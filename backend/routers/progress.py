from datetime import date, timedelta

from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from auth_utils import get_current_user
from database.postgres import get_db
from models.homework import HomeworkTask
from models.mocktest import MockTestAttempt
from models.user import User

router = APIRouter(prefix="/progress", tags=["progress"])


@router.get("/summary")
def progress_summary(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    total_tasks = db.query(func.count(HomeworkTask.id)).filter(
        HomeworkTask.user_id == user.id
    ).scalar()

    completed_tasks = db.query(func.count(HomeworkTask.id)).filter(
        HomeworkTask.user_id == user.id, HomeworkTask.is_completed.is_(True)
    ).scalar()

    attempts = db.query(MockTestAttempt).filter(MockTestAttempt.user_id == user.id).all()
    avg_score_pct = (
        sum(a.score / a.total_questions for a in attempts) / len(attempts) * 100
        if attempts else 0
    )

    # daily streak: consecutive days (counting back from today) with at least one completed task
    streak = 0
    cursor = date.today()
    completed_dates = {
        t.completed_at.date()
        for t in db.query(HomeworkTask).filter(
            HomeworkTask.user_id == user.id, HomeworkTask.is_completed.is_(True)
        ).all()
        if t.completed_at
    }
    while cursor in completed_dates:
        streak += 1
        cursor -= timedelta(days=1)

    return {
        "total_homework_tasks": total_tasks,
        "completed_homework_tasks": completed_tasks,
        "completion_rate_pct": round((completed_tasks / total_tasks * 100) if total_tasks else 0, 1),
        "mock_tests_taken": len(attempts),
        "average_mock_score_pct": round(avg_score_pct, 1),
        "current_streak_days": streak,
    }
