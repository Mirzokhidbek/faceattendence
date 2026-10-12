from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.user import User
from app.models.student import Student
from app.models.attendance import AttendanceLog
from app.schemas.student import (
    StudentCreate,
    StudentUpdate,
    StudentResponse,
    StudentListResponse
)
from app.services.student_service import student_service
from app.services.face_recognition_service import face_recognition_service
from app.core.dependencies import get_current_user, require_role

router = APIRouter(prefix="/students", tags=["Students"])

@router.post("/register", response_model=StudentResponse, status_code=status.HTTP_201_CREATED)
def register_student(
    payload: StudentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["professor", "super_admin"]))
):
    """
    Register a new student with biometric multi-angle face capture (Front, Left, Right).
    Requires professor or super_admin role.
    """
    success, student, message = student_service.register_student(payload, db)
    if not success or not student:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"code": "REGISTRATION_FAILED", "message": message}
        )

    return StudentResponse(
        id=student.id,
        student_id=student.student_id,
        full_name=student.full_name,
        group_name=student.group_name,
        photo_url=student.photo_url,
        consent_given=student.consent_given,
        created_at=student.created_at,
        total_attendance=0,
        attendance_rate=100.0
    )

@router.get("", response_model=StudentListResponse)
def get_students(
    search: Optional[str] = Query(None, description="Search by name or student ID"),
    group_name: Optional[str] = Query(None, description="Filter by group"),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    items, total = student_service.list_students(db, search, group_name, page, limit)
    return StudentListResponse(
        items=[StudentResponse(**item) for item in items],
        total=total,
        page=page,
        limit=limit
    )

@router.get("/{student_id}", response_model=StudentResponse)
def get_student(
    student_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    student = db.query(Student).filter(
        (Student.id == student_id) | (Student.student_id == student_id)
    ).first()
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "STUDENT_NOT_FOUND", "message": "Talaba topilmadi"}
        )

    total_logs = db.query(AttendanceLog).filter(AttendanceLog.student_id == student.id).count()
    present_logs = db.query(AttendanceLog).filter(
        AttendanceLog.student_id == student.id,
        AttendanceLog.status.in_(["present", "late"])
    ).count()
    rate = round((present_logs / total_logs * 100), 1) if total_logs > 0 else 100.0

    return StudentResponse(
        id=student.id,
        student_id=student.student_id,
        full_name=student.full_name,
        group_name=student.group_name,
        photo_url=student.photo_url,
        consent_given=student.consent_given,
        created_at=student.created_at,
        total_attendance=total_logs,
        attendance_rate=rate
    )

@router.put("/{student_id}", response_model=StudentResponse)
def update_student(
    student_id: str,
    payload: StudentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["professor", "super_admin"]))
):
    student = db.query(Student).filter(
        (Student.id == student_id) | (Student.student_id == student_id)
    ).first()
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "STUDENT_NOT_FOUND", "message": "Talaba topilmadi"}
        )

    if payload.full_name is not None:
        student.full_name = payload.full_name
    if payload.group_name is not None:
        student.group_name = payload.group_name

    db.commit()
    db.refresh(student)

    # Update in-memory cache
    face_recognition_service.update_cache(
        student_db_id=str(student.id),
        student_code=student.student_id,
        full_name=student.full_name,
        group_name=student.group_name,
        embedding=face_recognition_service._cache.get(str(student.id), {}).get("embedding", None),
        photo_url=student.photo_url
    )

    return get_student(student.id, db, current_user)

@router.delete("/{student_id}")
def delete_student(
    student_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["professor", "super_admin"]))
):
    success = student_service.delete_student(student_id, db)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "STUDENT_NOT_FOUND", "message": "Talaba topilmadi"}
        )
    return {"success": True, "message": "Talaba va uning biometrik ma'lumotlari o'chirildi"}
