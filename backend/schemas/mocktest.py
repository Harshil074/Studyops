from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class QuestionCreate(BaseModel):
    question_text: str
    options: list[str] = Field(min_length=2)
    correct_option_index: int


class MockTestCreate(BaseModel):
    title: str
    subject: str
    questions: list[QuestionCreate] = Field(min_length=1)


class QuestionOut(BaseModel):
    id: UUID
    question_text: str
    options: list[str]
    # correct_option_index intentionally omitted — don't leak answers to the test-taker

    class Config:
        from_attributes = True


class MockTestOut(BaseModel):
    id: UUID
    title: str
    subject: str
    created_at: datetime
    questions: list[QuestionOut]

    class Config:
        from_attributes = True


class MockTestSubmit(BaseModel):
    answers: dict[UUID, int]  # question_id -> chosen option index


class MockTestResultOut(BaseModel):
    id: UUID
    test_id: UUID
    score: int
    total_questions: int
    submitted_at: datetime

    class Config:
        from_attributes = True
