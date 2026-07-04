import uuid
from datetime import datetime

from sqlalchemy import Column, String, DateTime, Integer, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID

from database.postgres import Base


class MockTest(Base):
    __tablename__ = "mock_tests"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)

    title = Column(String, nullable=False)
    subject = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class MockTestQuestion(Base):
    __tablename__ = "mock_test_questions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    test_id = Column(UUID(as_uuid=True), ForeignKey("mock_tests.id"), nullable=False, index=True)

    question_text = Column(String, nullable=False)
    options = Column(JSON, nullable=False)          # e.g. ["A) ...", "B) ...", "C) ...", "D) ..."]
    correct_option_index = Column(Integer, nullable=False)  # 0-based index into options


class MockTestAttempt(Base):
    __tablename__ = "mock_test_attempts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    test_id = Column(UUID(as_uuid=True), ForeignKey("mock_tests.id"), nullable=False, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)

    answers = Column(JSON, nullable=False)   # {question_id: chosen_option_index}
    score = Column(Integer, nullable=False)
    total_questions = Column(Integer, nullable=False)
    submitted_at = Column(DateTime, default=datetime.utcnow)
