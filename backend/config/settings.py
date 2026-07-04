import os
from dotenv import load_dotenv

load_dotenv()


def _require(key: str) -> str:
    """Fail loudly at startup instead of silently running with a weak default."""
    value = os.getenv(key)
    if not value:
        raise RuntimeError(f"Missing required environment variable: {key}")
    return value


class Settings:
    # Postgres
    DATABASE_URL: str = _require("DATABASE_URL")  # e.g. postgresql://user:pass@host:5432/studyops

    # Auth
    SECRET_KEY: str = _require("SECRET_KEY")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60))
    REFRESH_TOKEN_EXPIRE_DAYS: int = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", 7))

    # CORS (comma-separated origins, e.g. "http://localhost:3000,https://studyops.app")
    CORS_ORIGINS: list[str] = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")


settings = Settings()
