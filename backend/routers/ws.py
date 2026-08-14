from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from jose import JWTError, jwt

from config.settings import settings
from database.postgres import SessionLocal
from models.user import User
from websocket.manager import manager

router = APIRouter()


def _authenticate_ws_token(token: str) -> User | None:
    """
    Browsers can't set an Authorization header during the WS handshake,
    so the access token is passed as a query param instead: /ws/progress?token=...
    """
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        if payload.get("type") != "access":
            return None
        db = SessionLocal()
        try:
            return db.query(User).filter(User.email == payload.get("sub")).first()
        finally:
            db.close()
    except JWTError:
        return None


@router.websocket("/ws/progress")
async def progress_websocket(websocket: WebSocket, token: str):
    user = _authenticate_ws_token(token)
    if not user:
        await websocket.close(code=4401)  # custom close code = unauthorized
        return

    await manager.connect(user.id, websocket)
    try:
        while True:
            # We don't expect the client to send anything meaningful; this just
            # keeps the connection alive and detects disconnects.
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(user.id, websocket)
