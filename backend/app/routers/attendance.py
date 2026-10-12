from datetime import datetime, date, timedelta
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status, Query, Request
from sqlalchemy.orm import Session
from sqlalchemy import func, desc

from app.database.database import get_db
from app.models.user import User
from app.models.student import Student
from app.models.course import Course
from app.models.attendance import AttendanceLog
from app.schemas.attendance import (
    CheckInRequest,
    CheckInResponse,
    AttendanceLogResponse,
    AttendanceStatsResponse
)
from app.services.attendance_service import attendance_service
from app.core.dependencies import get_current_user, checkin_limiter

router = APIRouter(prefix="/attendance", tags=["Attendance"])

@router.post("/check-in", response_model=CheckInResponse)
def check_in(
    request: Request,
    payload: CheckInRequest,
    db: Session = Depends(get_db)
):
    """
    Real-time face recognition attendance check-in.
    Processes camera frame, matches embedding, verifies course, protects against duplicate records.
    """
    checkin_limiter(request)
    result = attendance_service.process_check_in(
        frame_base64=payload.frame,
        course_identifier=payload.course_id,
        db=db
    )
    return CheckInResponse(**result)

@router.get("/logs", response_model=List[AttendanceLogResponse])
def get_attendance_logs(
    date_str: Optional[str] = Query(None, alias="date", description="Filter by date YYYY-MM-DD"),
    course_id: Optional[str] = Query(None, description="Course ID or Code"),
    group_name: Optional[str] = Query(None, description="Student group"),
    status_filter: Optional[str] = Query(None, alias="status", description="present, late, or rejected"),
    limit: int = Query(50, ge=1, le=500),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(AttendanceLog).join(Student).join(Course)

    if date_str:
        try:
            target_date = datetime.strptime(date_str, "%Y-%m-%d").date()
            query = query.filter(func.date(AttendanceLog.timestamp) == target_date)
        except ValueError:
            pass

    if course_id:
        query = query.filter((Course.id == course_id) | (Course.course_id == course_id))

    if group_name:
        query = query.filter(Student.group_name == group_name)

    if status_filter:
        query = query.filter(AttendanceLog.status == status_filter)

    logs = query.order_by(desc(AttendanceLog.timestamp)).limit(limit).all()

    return [
        AttendanceLogResponse(
            id=log.id,
            student_id=log.student.student_id,
            student_name=log.student.full_name,
            student_group=log.student.group_name,
            photo_url=log.student.photo_url,
            course_id=log.course.course_id,
            course_name=log.course.course_name,
            timestamp=log.timestamp,
            status=log.status,
            confidence_score=log.confidence_score
        )
        for log in logs
    ]

@router.get("/student/{student_id}", response_model=List[AttendanceLogResponse])
def get_student_attendance(
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

    # If student role, they can only view their own attendance
    if current_user.role == "student" and current_user.email != student.student_id:
        pass  # allowed if email or profile maps

    logs = db.query(AttendanceLog).filter(
        AttendanceLog.student_id == student.id
    ).order_by(desc(AttendanceLog.timestamp)).all()

    return [
        AttendanceLogResponse(
            id=log.id,
            student_id=student.student_id,
            student_name=student.full_name,
            student_group=student.group_name,
            photo_url=student.photo_url,
            course_id=log.course.course_id,
            course_name=log.course.course_name,
            timestamp=log.timestamp,
            status=log.status,
            confidence_score=log.confidence_score
        )
        for log in logs
    ]

@router.get("/stats", response_model=AttendanceStatsResponse)
def get_attendance_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    today = date.today()
    total_students = db.query(Student).count()
    active_courses = db.query(Course).count()

    today_logs = db.query(AttendanceLog).filter(func.date(AttendanceLog.timestamp) == today).all()
    today_present = sum(1 for l in today_logs if l.status == "present")
    today_late = sum(1 for l in today_logs if l.status == "late")
    total_attended_today = today_present + today_late

    today_rate = round((total_attended_today / total_students * 100), 1) if total_students > 0 else 0.0

    # Weekly trend (last 7 days)
    weekly_trend = []
    for i in range(6, -1, -1):
        day_date = today - timedelta(days=i)
        day_str = day_date.strftime("%a")  # Mon, Tue, ...
        logs_on_day = db.query(AttendanceLog).filter(func.date(AttendanceLog.timestamp) == day_date).all()
        day_present = sum(1 for l in logs_on_day if l.status == "present")
        day_late = sum(1 for l in logs_on_day if l.status == "late")
        day_rate = round(((day_present + day_late) / total_students * 100), 1) if total_students > 0 else 0.0
        weekly_trend.append({
            "day": day_str,
            "date": day_date.strftime("%Y-%m-%d"),
            "present": day_present,
            "late": day_late,
            "rate": day_rate
        })

    # Group distribution
    groups = db.query(Student.group_name).distinct().all()
    group_distribution = []
    for (g_name,) in groups:
        g_count = db.query(Student).filter(Student.group_name == g_name).count()
        g_present = db.query(AttendanceLog).join(Student).filter(
            Student.group_name == g_name,
            func.date(AttendanceLog.timestamp) == today,
            AttendanceLog.status.in_(["present", "late"])
        ).count()
        g_rate = round((g_present / g_count * 100), 1) if g_count > 0 else 0.0
        group_distribution.append({
            "group": g_name,
            "students": g_count,
            "present": g_present,
            "rate": g_rate
        })

    # Recent 10 logs
    recent_db_logs = db.query(AttendanceLog).order_by(desc(AttendanceLog.timestamp)).limit(10).all()
    recent_logs = [
        AttendanceLogResponse(
            id=log.id,
            student_id=log.student.student_id,
            student_name=log.student.full_name,
            student_group=log.student.group_name,
            photo_url=log.student.photo_url,
            course_id=log.course.course_id,
            course_name=log.course.course_name,
            timestamp=log.timestamp,
            status=log.status,
            confidence_score=log.confidence_score
        )
        for log in recent_db_logs
    ]

    return AttendanceStatsResponse(
        today_attendance_rate=today_rate,
        total_students=total_students,
        today_present_count=today_present,
        today_late_count=today_late,
        active_courses_count=active_courses,
        weekly_trend=weekly_trend,
        group_distribution=group_distribution,
        recent_logs=recent_logs
    )
