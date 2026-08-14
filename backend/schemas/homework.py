from datetime import date, datetime
from uuid import UUID

from pydantic import BaseModel


class HomeworkCreate(BaseModel):
    subject: str
    title: str
    due_date: date | None = None


class HomeworkUpdate(BaseModel):
    subject: str | None = None
    title: str | None = None
    due_date: date | None = None
    is_completed: bool | None = None


class HomeworkOut(BaseModel):
    id: UUID
    subject: str
    title: str
    due_date: date | None
    is_completed: bool
    completed_at: datetime | None
    created_at: datetime

    class Config:
        from_attributes = True
