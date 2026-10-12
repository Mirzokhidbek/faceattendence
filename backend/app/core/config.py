import os
from typing import List
from pydantic_settings import BaseSettings
from pydantic import Field

class Settings(BaseSettings):
    PROJECT_NAME: str = "SmartCheck — Seamless Face ID Attendance System"
    VERSION: str = "1.0.0"
    API_V1_PREFIX: str = "/api"
    
    # Database
    DATABASE_URL: str = Field(
        default="sqlite:///./smartcheck.db",
        description="Database connection URL (PostgreSQL or SQLite)"
    )
    
    # Security & JWT
    JWT_SECRET: str = Field(
        default="super-secure-smartcheck-secret-key-2026-production-ready",
        description="JWT secret key"
    )
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    # Face Recognition Engine
    FACE_MATCH_THRESHOLD: float = Field(
        default=0.40,
        description="Cosine similarity threshold for face match (SFace: >0.363 indicates same identity)"
    )
    FACE_DISTANCE_THRESHOLD: float = Field(
        default=1.12,
        description="L2 distance threshold for face match (SFace: <1.128 indicates same identity)"
    )
    LATE_GRACE_MINUTES: int = Field(
        default=15,
        description="Grace period in minutes after course start time before marking attendance as 'late'"
    )
    
    # Paths
    BASE_DIR: str = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    MODELS_DIR: str = os.path.join(BASE_DIR, "models_weights")
    UPLOAD_DIR: str = os.path.join(os.path.dirname(BASE_DIR), "uploads")
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*"
    ]
    
    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
os.makedirs(settings.MODELS_DIR, exist_ok=True)
