import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database.database import Base

class Course(Base):
    __tablename__ = "courses"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    course_id = Column(String(50), unique=True, index=True, nullable=False)
    course_name = Column(String(255), nullable=False)
    teacher_id = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    schedule = Column(String(255), nullable=True)  # e.g., "Mon, Wed 09:00 - 10:30"
    start_time = Column(String(10), default="09:00", nullable=True)  # HH:MM for grace period logic
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    teacher = relationship("User", back_populates="courses")
    attendance_logs = relationship("AttendanceLog", back_populates="course", cascade="all, delete-orphan")
