from datetime import datetime
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from auth_utils import get_current_user
from database.postgres import get_db
from models.homework import HomeworkTask
from models.user import User
from schemas.homework import HomeworkCreate, HomeworkOut, HomeworkUpdate
from websocket.manager import manager

router = APIRouter(prefix="/homework", tags=["homework"])


@router.get("", response_model=list[HomeworkOut])
def list_homework(
    only_pending: bool = False,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    query = db.query(HomeworkTask).filter(HomeworkTask.user_id == user.id)
    if only_pending:
        query = query.filter(HomeworkTask.is_completed.is_(False))
    return query.order_by(HomeworkTask.due_date.asc().nulls_last()).all()


@router.post("", response_model=HomeworkOut, status_code=201)
def create_homework(
    payload: HomeworkCreate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    task = HomeworkTask(user_id=user.id, **payload.model_dump())
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


def _get_owned_task(task_id: UUID, user: User, db: Session) -> HomeworkTask:
    task = db.query(HomeworkTask).filter(HomeworkTask.id == task_id).first()
    if not task or task.user_id != user.id:
        raise HTTPException(status_code=404, detail="Homework task not found")
    return task


@router.patch("/{task_id}", response_model=HomeworkOut)
async def update_homework(
    task_id: UUID,
    payload: HomeworkUpdate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    task = _get_owned_task(task_id, user, db)

    updates = payload.model_dump(exclude_unset=True)
    just_completed = updates.get("is_completed") is True and not task.is_completed

    for field, value in updates.items():
        setattr(task, field, value)

    if just_completed:
        task.completed_at = datetime.utcnow()

    db.commit()
    db.refresh(task)

    if just_completed:
        # live-push to any open dashboard tabs — this is the real-time piece
        await manager.send_to_user(user.id, {
            "event": "homework_completed",
            "task_id": str(task.id),
            "subject": task.subject,
        })

    return task


@router.delete("/{task_id}", status_code=204)
def delete_homework(
    task_id: UUID,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    task = _get_owned_task(task_id, user, db)
    db.delete(task)
    db.commit()
