from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field

class CheckInRequest(BaseModel):
    frame: str = Field(..., description="Base64 encoded frame from camera")
    course_id: str = Field(..., description="Course ID (e.g. CS101 or UUID)")

class StudentAttendanceSummary(BaseModel):
    student_id: str
    full_name: str
    group_name: str
    photo_url: Optional[str] = None

class AttendanceInfo(BaseModel):
    id: str
    status: str  # present, late, already_recorded
    confidence: float
    timestamp: datetime
    course_id: str
    course_name: str

class CheckInResponse(BaseModel):
    success: bool
    status: str  # success, already_recorded, no_face, multiple_faces, unknown_face, error
    message: str
    student: Optional[StudentAttendanceSummary] = None
    attendance: Optional[AttendanceInfo] = None

class AttendanceLogResponse(BaseModel):
    id: str
    student_id: str
    student_name: str
    student_group: str
    photo_url: Optional[str] = None
    course_id: str
    course_name: str
    timestamp: datetime
    status: str
    confidence_score: float

    class Config:
        from_attributes = True

class AttendanceStatsResponse(BaseModel):
    today_attendance_rate: float
    total_students: int
    today_present_count: int
    today_late_count: int
    active_courses_count: int
    weekly_trend: List[Dict[str, Any]]
    group_distribution: List[Dict[str, Any]]
    recent_logs: List[AttendanceLogResponse]
