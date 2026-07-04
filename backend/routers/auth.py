from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from auth_utils import (
    create_access_token,
    create_refresh_token,
    get_current_user,
    hash_password,
    require_admin,
    security,
    verify_password,
)
from config.settings import settings
from database.postgres import get_db
from models.token import BlacklistedToken
from models.user import User
from schemas.auth import RefreshTokenRequest, TokenResponse, UserLogin, UserRegister

router = APIRouter()


@router.post("/register", status_code=201)
def register(user: UserRegister, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="User already exists")

    new_user = User(
        name=user.name,
        email=user.email,
        password_hash=hash_password(user.password),
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User registered successfully", "user_id": str(new_user.id)}


@router.post("/login", response_model=TokenResponse)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == credentials.email).first()

    if not user or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Invalid email or password")

    access_token = create_access_token({"sub": user.email, "role": user.role})
    refresh_token = create_refresh_token({"sub": user.email})

    user.refresh_token = refresh_token
    db.commit()

    return TokenResponse(access_token=access_token, refresh_token=refresh_token)


@router.post("/refresh", response_model=TokenResponse)
def refresh_access_token(data: RefreshTokenRequest, db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(data.refresh_token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email = payload.get("sub")
        token_type = payload.get("type")

        if email is None or token_type != "refresh":
            raise HTTPException(status_code=401, detail="Invalid refresh token")

        user = db.query(User).filter(User.email == email).first()
        if not user or user.refresh_token != data.refresh_token:
            raise HTTPException(status_code=401, detail="Refresh token mismatch")

        new_access_token = create_access_token({"sub": user.email, "role": user.role})
        return TokenResponse(access_token=new_access_token, refresh_token=None)

    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")


@router.post("/logout")
def logout(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
):
    token = credentials.credentials
    db.add(BlacklistedToken(token=token))

    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email = payload.get("sub")
        if email:
            db.query(User).filter(User.email == email).update({"refresh_token": None})
    except JWTError:
        pass

    db.commit()
    return {"message": "Logged out successfully"}


@router.get("/profile")
def profile(user: User = Depends(get_current_user)):
    return {"email": user.email, "name": user.name, "role": user.role}


@router.get("/admin")
def admin_dashboard(user: User = Depends(require_admin)):
    return {"message": "Welcome, admin", "email": user.email}
