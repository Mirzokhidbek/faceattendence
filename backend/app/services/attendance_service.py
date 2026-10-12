from datetime import datetime, date, time as dt_time, timedelta
import logging
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.core.config import settings
from app.models.student import Student
from app.models.course import Course
from app.models.attendance import AttendanceLog
from app.services.face_recognition_service import (
    face_recognition_service,
    FaceDetectionStatus
)
from app.services.liveness_service import liveness_service

logger = logging.getLogger(__name__)

class AttendanceService:
    def process_check_in(
        self,
        frame_base64: str,
        course_identifier: str,
        db: Session
    ) -> Dict[str, Any]:
        """
        Processes a single camera frame for automated Face ID attendance check-in.
        """
        # 1. Resolve Course
        course = db.query(Course).filter(
            (Course.id == course_identifier) | (Course.course_id == course_identifier)
        ).first()
        
        if not course:
            return {
                "success": False,
                "status": "error",
                "message": f"Dars topilmadi: {course_identifier}",
                "student": None,
                "attendance": None
            }

        # 2. Decode Frame
        image = face_recognition_service.decode_base64_image(frame_base64)
        if image is None:
            return {
                "success": False,
                "status": "error",
                "message": "Kamera kadrini o'qib bo'lmadi",
                "student": None,
                "attendance": None
            }

        # 3. Detect Face and Extract Embedding
        detect_status, embedding, face_info = face_recognition_service.detect_and_embed(image)
        
        if detect_status == FaceDetectionStatus.NO_FACE:
            return {
                "success": False,
                "status": "no_face",
                "message": "Yuz aniqlanmadi. Iltimos kamera markaziga qarang.",
                "student": None,
                "attendance": None
            }
            
        if detect_status == FaceDetectionStatus.MULTIPLE_FACES:
            return {
                "success": False,
                "status": "multiple_faces",
                "message": "Bir nechta yuz aniqlandi. Iltimos faqat bir kishi tursin.",
                "student": None,
                "attendance": None
            }

        if embedding is None:
            return {
                "success": False,
                "status": "error",
                "message": "Yuz embedding xususiyatini ajratib bo'lmadi.",
                "student": None,
                "attendance": None
            }

        # 4. Anti-spoofing and Liveness Verification
        liveness_result = liveness_service.evaluate_liveness(
            image,
            face_info["box"] if face_info else None
        )
        if not liveness_result["is_live"]:
            logger.warning(f"Liveness warning: {liveness_result['reason']}")

        # 5. Search for Match in In-Memory Cache
        matched_student_meta, confidence = face_recognition_service.search_match(
            embedding,
            threshold=settings.FACE_MATCH_THRESHOLD
        )
        
        if not matched_student_meta:
            return {
                "success": False,
                "status": "unknown_face",
                "message": "Yuz tanilmadi. Iltimos yaqinroq keling yoki administratorga murojaat qiling.",
                "student": None,
                "attendance": None
            }

        student_db_id = matched_student_meta["student_db_id"]
        student = db.query(Student).filter(Student.id == student_db_id).first()
        if not student:
            return {
                "success": False,
                "status": "unknown_face",
                "message": "Talaba topilmadi.",
                "student": None,
                "attendance": None
            }

        now = datetime.utcnow()
        today_start = datetime.combine(now.date(), dt_time.min)
        today_end = datetime.combine(now.date(), dt_time.max)

        # 6. Duplicate Attendance Protection
        existing_log = db.query(AttendanceLog).filter(
            AttendanceLog.student_id == student.id,
            AttendanceLog.course_id == course.id,
            AttendanceLog.timestamp >= today_start,
            AttendanceLog.timestamp <= today_end
        ).first()

        student_summary = {
            "student_id": student.student_id,
            "full_name": student.full_name,
            "group_name": student.group_name,
            "photo_url": student.photo_url or matched_student_meta.get("photo_url")
        }

        if existing_log:
            return {
                "success": True,
                "status": "already_recorded",
                "message": f"Davomat allaqachon belgilangan: {student.full_name}",
                "student": student_summary,
                "attendance": {
                    "id": existing_log.id,
                    "status": existing_log.status,
                    "confidence": existing_log.confidence_score,
                    "timestamp": existing_log.timestamp,
                    "course_id": course.course_id,
                    "course_name": course.course_name
                }
            }

        # 7. Calculate Status: Present vs Late
        status = self._calculate_attendance_status(course, now)

        # 8. Create New Attendance Log
        new_log = AttendanceLog(
            student_id=student.id,
            course_id=course.id,
            timestamp=now,
            status=status,
            confidence_score=round(confidence, 3)
        )
        db.add(new_log)
        db.commit()
        db.refresh(new_log)

        return {
            "success": True,
            "status": "success",
            "message": f"✓ Xush kelibsiz, {student.full_name}!",
            "student": student_summary,
            "attendance": {
                "id": new_log.id,
                "status": new_log.status,
                "confidence": new_log.confidence_score,
                "timestamp": new_log.timestamp,
                "course_id": course.course_id,
                "course_name": course.course_name
            }
        }

    def _calculate_attendance_status(self, course: Course, current_time: datetime) -> str:
        """Determines 'present' or 'late' status based on course start time and grace period."""
        if not course.start_time:
            return "present"
            
        try:
            parts = course.start_time.split(":")
            course_hour = int(parts[0])
            course_min = int(parts[1])
            course_start = current_time.replace(hour=course_hour, minute=course_min, second=0, microsecond=0)
            grace_threshold = course_start + timedelta(minutes=settings.LATE_GRACE_MINUTES)
            
            if current_time > grace_threshold:
                return "late"
            return "present"
        except Exception:
            return "present"

attendance_service = AttendanceService()
