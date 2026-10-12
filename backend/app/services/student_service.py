import json
import logging
from typing import List, Optional, Tuple, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.models.student import Student
from app.models.attendance import AttendanceLog
from app.schemas.student import StudentCreate, StudentUpdate
from app.services.face_recognition_service import (
    face_recognition_service,
    FaceDetectionStatus
)

logger = logging.getLogger(__name__)

class StudentService:
    def register_student(self, data: StudentCreate, db: Session) -> Tuple[bool, Optional[Student], str]:
        """
        Registers a new student with biometric multi-angle face embeddings.
        """
        # 1. Check unique student_id
        existing = db.query(Student).filter(Student.student_id == data.student_id).first()
        if existing:
            return False, None, f"Student ID '{data.student_id}' allaqachon mavjud."

        # 2. Decode and validate front image
        front_img = face_recognition_service.decode_base64_image(data.photo_front)
        if front_img is None:
            return False, None, "Old (Front) suratni o'qib bo'lmadi. Iltimos qaytadan yuklang."

        det_status, front_emb, face_info = face_recognition_service.detect_and_embed(front_img)
        if det_status == FaceDetectionStatus.NO_FACE:
            return False, None, "Old (Front) suratda yuz aniqlanmadi. Iltimos kamera yaqinroq turing."
        if det_status == FaceDetectionStatus.MULTIPLE_FACES:
            return False, None, "Old (Front) suratda bir nechta yuz aniqlandi. Faqat bitta yuz bo'lishi kerak."
        if front_emb is None:
            return False, None, "Yuz xususiyatini ajratib bo'lmadi."

        # 3. Multi-angle embeddings if provided
        angle_images = [data.photo_front]
        if data.photo_left:
            angle_images.append(data.photo_left)
        if data.photo_right:
            angle_images.append(data.photo_right)

        success, combined_emb, msg = face_recognition_service.process_multi_angle_embeddings(angle_images)
        if not success or combined_emb is None:
            # Fallback to high quality front embedding
            combined_emb = front_emb

        # 4. Save profile photo
        photo_url = face_recognition_service.save_student_photo(data.student_id, front_img)

        # 5. Create Student entity
        student = Student(
            student_id=data.student_id,
            full_name=data.full_name,
            group_name=data.group_name,
            photo_url=photo_url,
            face_embedding=json.dumps(combined_emb.tolist()),
            consent_given=data.consent_given
        )
        db.add(student)
        db.commit()
        db.refresh(student)

        # 6. Update in-memory vector cache immediately
        face_recognition_service.update_cache(
            student_db_id=str(student.id),
            student_code=student.student_id,
            full_name=student.full_name,
            group_name=student.group_name,
            embedding=combined_emb,
            photo_url=photo_url
        )

        return True, student, "Talaba muvaffaqiyatli ro'yxatdan o'tkazildi."

    def list_students(
        self,
        db: Session,
        search: Optional[str] = None,
        group_name: Optional[str] = None,
        page: int = 1,
        limit: int = 20
    ) -> Tuple[List[Dict[str, Any]], int]:
        query = db.query(Student)
        if search:
            query = query.filter(
                or_(
                    Student.full_name.ilike(f"%{search}%"),
                    Student.student_id.ilike(f"%{search}%")
                )
            )
        if group_name:
            query = query.filter(Student.group_name == group_name)

        total = query.count()
        offset = (page - 1) * limit
        students = query.order_by(Student.created_at.desc()).offset(offset).limit(limit).all()

        results = []
        for s in students:
            total_logs = db.query(AttendanceLog).filter(AttendanceLog.student_id == s.id).count()
            present_logs = db.query(AttendanceLog).filter(
                AttendanceLog.student_id == s.id,
                AttendanceLog.status.in_(["present", "late"])
            ).count()
            rate = round((present_logs / total_logs * 100), 1) if total_logs > 0 else 100.0

            results.append({
                "id": s.id,
                "student_id": s.student_id,
                "full_name": s.full_name,
                "group_name": s.group_name,
                "photo_url": s.photo_url,
                "consent_given": s.consent_given,
                "created_at": s.created_at,
                "total_attendance": total_logs,
                "attendance_rate": rate
            })

        return results, total

    def delete_student(self, student_id: str, db: Session) -> bool:
        student = db.query(Student).filter(
            (Student.id == student_id) | (Student.student_id == student_id)
        ).first()
        if not student:
            return False

        # Remove from vector cache
        face_recognition_service.remove_from_cache(str(student.id))

        db.delete(student)
        db.commit()
        return True

student_service = StudentService()
