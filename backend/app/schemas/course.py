from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field

class CourseCreate(BaseModel):
    course_id: str = Field(..., min_length=2, max_length=50)
    course_name: str = Field(..., min_length=2, max_length=255)
    teacher_id: Optional[str] = None
    schedule: Optional[str] = "Mon, Wed 09:00 - 10:30"
    start_time: Optional[str] = "09:00"

class CourseUpdate(BaseModel):
    course_name: Optional[str] = None
    teacher_id: Optional[str] = None
    schedule: Optional[str] = None
    start_time: Optional[str] = None

class CourseResponse(BaseModel):
    id: str
    course_id: str
    course_name: str
    teacher_id: Optional[str] = None
    teacher_name: Optional[str] = None
    schedule: Optional[str] = None
    start_time: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
