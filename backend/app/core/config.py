import json
from typing import List, Union
from pydantic import field_validator, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "SmartServe AI Backend"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "replace-this-with-a-secure-random-secret-key-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    DEBUG: bool = True

    # CORS origins list or JSON string
    BACKEND_CORS_ORIGINS: Union[List[str], str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
    ]

    # External APIs & Restaurant Configuration
    OPENWEATHERMAP_API_KEY: str = ""
    RESTAURANT_CITY: str = "Bengaluru"
    RESTAURANT_LAT: float = 12.9716
    RESTAURANT_LON: float = 77.5946
    DEFAULT_COUNTRY_CODE: str = "IN"
    DEFAULT_REGION_CODE: str = "KA"
    WEATHER_CACHE_TTL_SECONDS: int = 1800  # 30 minutes
    HOLIDAY_CACHE_TTL_SECONDS: int = 86400  # 24 hours

    # LLM Provider Configuration (Gemini / OpenAI / Custom)
    LLM_API_KEY: str = ""
    LLM_PROVIDER: str = "gemini"  # "gemini" or "openai"
    LLM_MODEL: str = "gemini-1.5-flash"


    # Database configuration (defaults to local SQLite, production configured via PostgreSQL DATABASE_URL)
    DATABASE_URL: str = "sqlite:///./smartserve.db"

    @field_validator("BACKEND_CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str):
            if v.startswith("[") and v.endswith("]"):
                try:
                    return json.loads(v)
                except Exception:
                    pass
            return [i.strip() for i in v.split(",") if i.strip()]
        elif isinstance(v, list):
            return v
        return ["http://localhost:5173"]

    @model_validator(mode="after")
    def validate_production_settings(self) -> "Settings":
        if not self.DEBUG:
            if "replace-this" in self.SECRET_KEY.lower() or len(self.SECRET_KEY) < 16:
                raise ValueError(
                    "CRITICAL PRODUCTION ERROR: DEBUG=False requires a secure, non-default SECRET_KEY (minimum 16 characters)."
                )
        return self

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )
settings = Settings()
