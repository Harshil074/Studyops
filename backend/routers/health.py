from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session

from database.postgres import get_db

router = APIRouter()


@router.get("/health")
def liveness():
    """Liveness probe — is the process up at all."""
    return {"status": "ok"}


@router.get("/health/ready")
def readiness(db: Session = Depends(get_db)):
    """Readiness probe — is the app actually able to serve traffic (DB reachable)."""
    db.execute(text("SELECT 1"))
    return {"status": "ok", "database": "connected"}
