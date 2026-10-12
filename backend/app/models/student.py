import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, Boolean, DateTime
from sqlalchemy.orm import relationship
from app.database.database import Base

class Student(Base):
    __tablename__ = "students"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    student_id = Column(String(50), unique=True, index=True, nullable=False)
    full_name = Column(String(255), index=True, nullable=False)
    group_name = Column(String(100), index=True, nullable=False)
    photo_url = Column(Text, nullable=True)
    # Stored as JSON string of list[float] (128-dimensional embedding vector)
    face_embedding = Column(Text, nullable=False)
    consent_given = Column(Boolean, default=True, nullable=False)
    consent_timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    attendance_logs = relationship("AttendanceLog", back_populates="student", cascade="all, delete-orphan")
