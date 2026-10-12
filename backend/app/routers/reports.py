from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Depends, Query, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from sqlalchemy import func, desc

from app.database.database import get_db
from app.models.user import User
from app.models.student import Student
from app.models.course import Course
from app.models.attendance import AttendanceLog
from app.services.report_service import report_service
from app.core.dependencies import get_current_user

router = APIRouter(prefix="/reports", tags=["Reports"])

def _fetch_filtered_records(
    db: Session,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    course_id: Optional[str] = None,
    group_name: Optional[str] = None,
    status_filter: Optional[str] = None
):
    query = db.query(AttendanceLog).join(Student).join(Course)

    if start_date:
        try:
            d_start = datetime.strptime(start_date, "%Y-%m-%d").date()
            query = query.filter(func.date(AttendanceLog.timestamp) >= d_start)
        except ValueError:
            pass

    if end_date:
        try:
            d_end = datetime.strptime(end_date, "%Y-%m-%d").date()
            query = query.filter(func.date(AttendanceLog.timestamp) <= d_end)
        except ValueError:
            pass

    if course_id:
        query = query.filter((Course.id == course_id) | (Course.course_id == course_id))

    if group_name:
        query = query.filter(Student.group_name == group_name)

    if status_filter:
        query = query.filter(AttendanceLog.status == status_filter)

    logs = query.order_by(desc(AttendanceLog.timestamp)).all()

    records = [
        {
            "id": log.id,
            "student_id": log.student.student_id,
            "student_name": log.student.full_name,
            "student_group": log.student.group_name,
            "course_id": log.course.course_id,
            "course_name": log.course.course_name,
            "timestamp": log.timestamp,
            "status": log.status,
            "confidence_score": log.confidence_score
        }
        for log in logs
    ]
    return records

@router.get("/attendance")
def get_attendance_report(
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    course_id: Optional[str] = Query(None),
    group_name: Optional[str] = Query(None),
    status_filter: Optional[str] = Query(None, alias="status"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    records = _fetch_filtered_records(db, start_date, end_date, course_id, group_name, status_filter)
    total = len(records)
    present_cnt = sum(1 for r in records if r["status"] == "present")
    late_cnt = sum(1 for r in records if r["status"] == "late")
    rate = round(((present_cnt + late_cnt) / total * 100), 1) if total > 0 else 0.0

    return {
        "summary": {
            "total_records": total,
            "present_count": present_cnt,
            "late_count": late_cnt,
            "overall_rate": rate
        },
        "records": records
    }

@router.get("/attendance/export")
def export_attendance_report(
    export_format: str = Query("excel", alias="format", pattern="^(excel|pdf)$"),
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    course_id: Optional[str] = Query(None),
    group_name: Optional[str] = Query(None),
    status_filter: Optional[str] = Query(None, alias="status"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    records = _fetch_filtered_records(db, start_date, end_date, course_id, group_name, status_filter)
    filter_dict = {
        "Sana oralig'i": f"{start_date or 'Boshidan'} - {end_date or 'Hozirgacha'}",
        "Kurs": course_id or "Barchasi",
        "Guruh": group_name or "Barchasi"
    }

    if export_format == "excel":
        file_buffer = report_service.export_excel(records, filter_dict)
        filename = f"SmartCheck_Attendance_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
        media_type = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    else:
        file_buffer = report_service.export_pdf(records, filter_dict)
        filename = f"SmartCheck_Attendance_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
        media_type = "application/pdf"

    return StreamingResponse(
        file_buffer,
        media_type=media_type,
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )
