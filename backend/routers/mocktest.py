from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from auth_utils import get_current_user
from database.postgres import get_db
from models.mocktest import MockTest, MockTestAttempt, MockTestQuestion
from models.user import User
from schemas.mocktest import MockTestCreate, MockTestOut, MockTestResultOut, MockTestSubmit
from websocket.manager import manager

router = APIRouter(prefix="/mock-tests", tags=["mock-tests"])


@router.post("", response_model=MockTestOut, status_code=201)
def create_mock_test(
    payload: MockTestCreate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    test = MockTest(created_by=user.id, title=payload.title, subject=payload.subject)
    db.add(test)
    db.flush()  # get test.id before inserting questions

    for q in payload.questions:
        db.add(MockTestQuestion(
            test_id=test.id,
            question_text=q.question_text,
            options=q.options,
            correct_option_index=q.correct_option_index,
        ))

    db.commit()
    db.refresh(test)
    test.questions = db.query(MockTestQuestion).filter(MockTestQuestion.test_id == test.id).all()
    return test


@router.get("", response_model=list[MockTestOut])
def list_mock_tests(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    tests = db.query(MockTest).all()
    for t in tests:
        t.questions = db.query(MockTestQuestion).filter(MockTestQuestion.test_id == t.id).all()
    return tests


@router.get("/{test_id}", response_model=MockTestOut)
def get_mock_test(test_id: UUID, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    test = db.query(MockTest).filter(MockTest.id == test_id).first()
    if not test:
        raise HTTPException(status_code=404, detail="Mock test not found")
    test.questions = db.query(MockTestQuestion).filter(MockTestQuestion.test_id == test.id).all()
    return test


@router.post("/{test_id}/submit", response_model=MockTestResultOut)
async def submit_mock_test(
    test_id: UUID,
    payload: MockTestSubmit,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    questions = db.query(MockTestQuestion).filter(MockTestQuestion.test_id == test_id).all()
    if not questions:
        raise HTTPException(status_code=404, detail="Mock test not found or has no questions")

    score = 0
    for q in questions:
        chosen = payload.answers.get(q.id)
        if chosen is not None and chosen == q.correct_option_index:
            score += 1

    attempt = MockTestAttempt(
        test_id=test_id,
        user_id=user.id,
        answers={str(k): v for k, v in payload.answers.items()},
        score=score,
        total_questions=len(questions),
    )
    db.add(attempt)
    db.commit()
    db.refresh(attempt)

    # live-push the result so an open progress dashboard updates immediately
    await manager.send_to_user(user.id, {
        "event": "mock_test_submitted",
        "test_id": str(test_id),
        "score": score,
        "total_questions": len(questions),
    })

    return attempt
