from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field

class StudentCreate(BaseModel):
    student_id: str = Field(..., min_length=2, max_length=50, description="Unique student ID or roll number")
    full_name: str = Field(..., min_length=2, max_length=255)
    group_name: str = Field(..., min_length=2, max_length=100)
    photo_front: str = Field(..., description="Base64 encoded front face image")
    photo_left: Optional[str] = Field(None, description="Optional base64 left profile image")
    photo_right: Optional[str] = Field(None, description="Optional base64 right profile image")
    consent_given: bool = Field(True, description="Biometric data processing consent confirmation")

class StudentUpdate(BaseModel):
    full_name: Optional[str] = None
    group_name: Optional[str] = None

class StudentResponse(BaseModel):
    id: str
    student_id: str
    full_name: str
    group_name: str
    photo_url: Optional[str] = None
    consent_given: bool
    created_at: datetime
    total_attendance: Optional[int] = 0
    attendance_rate: Optional[float] = 0.0

    class Config:
        from_attributes = True

class StudentListResponse(BaseModel):
    items: List[StudentResponse]
    total: int
    page: int
    limit: int
