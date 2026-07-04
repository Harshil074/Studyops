from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config.settings import settings
from database.postgres import Base, engine
from models import homework, mocktest, token, user  # noqa: F401 - import so Base knows about them
from routers import auth, health, homework as homework_router, mocktest as mocktest_router, progress, ws

app = FastAPI(title="StudyOps API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    # For a portfolio project this is fine. In a real production system,
    # use Alembic migrations instead of create_all.
    Base.metadata.create_all(bind=engine)


app.include_router(health.router)
app.include_router(auth.router)
app.include_router(homework_router.router)
app.include_router(mocktest_router.router)
app.include_router(progress.router)
app.include_router(ws.router)
