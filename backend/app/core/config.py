from typing import List, Union, Optional, Any
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "Pathly Career API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"

    HOST: str = "0.0.0.0"
    PORT: int = 8000
    DEBUG: bool = True

    @field_validator("DEBUG", mode="before")
    @classmethod
    def assemble_debug(cls, v: Any) -> bool:
        if isinstance(v, bool):
            return v
        if isinstance(v, str):
            return v.lower() in ("true", "1", "t", "yes", "y", "dev", "development")
        return bool(v)
    ENVIRONMENT: str = "development"

    # JWT Authentication
    JWT_SECRET_KEY: str = "pathly-super-secret-jwt-key-change-in-production-2026!"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # Cookie Configuration
    COOKIE_SECURE: bool = False
    COOKIE_SAMESITE: str = "lax"
    ACCESS_TOKEN_COOKIE_NAME: str = "pathly_access_token"
    REFRESH_TOKEN_COOKIE_NAME: str = "pathly_refresh_token"

    # Database Settings
    MONGODB_URI: str = "mongodb://localhost:27017"
    MONGODB_DB_NAME: str = "pathly_db"
    USE_MONGOMOCK_FALLBACK: bool = True

    # CORS
    CORS_ORIGINS: Union[List[str], str] = "http://localhost:3000,http://127.0.0.1:3000"

    # Google OAuth & AI
    GOOGLE_CLIENT_ID: str = ""
    GOOGLE_CLIENT_SECRET: str = ""
    GEMINI_API_KEY: str = ""
    OPENAI_API_KEY: str = ""
    OPENAI_MODEL: str = "gemini-3.5-flash"
    OPENAI_BASE_URL: Optional[str] = None
    AI_MAX_TOKENS: int = 2048
    AI_TEMPERATURE: float = 0.7

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str):
            return [i.strip() for i in v.split(",") if i.strip()]
        elif isinstance(v, list):
            return v
        return ["http://localhost:3000"]

    model_config = SettingsConfigDict(
        env_file=os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

settings = Settings()

