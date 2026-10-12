from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.user import User
from app.models.course import Course
from app.schemas.course import CourseCreate, CourseUpdate, CourseResponse
from app.core.dependencies import get_current_user, require_role

router = APIRouter(prefix="/courses", tags=["Courses"])

@router.get("", response_model=List[CourseResponse])
def get_courses(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    courses = db.query(Course).all()
    return [
        CourseResponse(
            id=c.id,
            course_id=c.course_id,
            course_name=c.course_name,
            teacher_id=c.teacher_id,
            teacher_name=c.teacher.full_name if c.teacher else None,
            schedule=c.schedule,
            start_time=c.start_time,
            created_at=c.created_at
        )
        for c in courses
    ]

@router.post("", response_model=CourseResponse, status_code=status.HTTP_201_CREATED)
def create_course(
    payload: CourseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["professor", "super_admin"]))
):
    existing = db.query(Course).filter(Course.course_id == payload.course_id).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"code": "COURSE_EXISTS", "message": f"Kurs kodi '{payload.course_id}' allaqachon mavjud."}
        )

    course = Course(
        course_id=payload.course_id,
        course_name=payload.course_name,
        teacher_id=payload.teacher_id or current_user.id,
        schedule=payload.schedule,
        start_time=payload.start_time
    )
    db.add(course)
    db.commit()
    db.refresh(course)

    return CourseResponse(
        id=course.id,
        course_id=course.course_id,
        course_name=course.course_name,
        teacher_id=course.teacher_id,
        teacher_name=current_user.full_name,
        schedule=course.schedule,
        start_time=course.start_time,
        created_at=course.created_at
    )

@router.get("/{course_id}", response_model=CourseResponse)
def get_course(
    course_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    course = db.query(Course).filter(
        (Course.id == course_id) | (Course.course_id == course_id)
    ).first()
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "COURSE_NOT_FOUND", "message": "Kurs topilmadi"}
        )

    return CourseResponse(
        id=course.id,
        course_id=course.course_id,
        course_name=course.course_name,
        teacher_id=course.teacher_id,
        teacher_name=course.teacher.full_name if course.teacher else None,
        schedule=course.schedule,
        start_time=course.start_time,
        created_at=course.created_at
    )

@router.put("/{course_id}", response_model=CourseResponse)
def update_course(
    course_id: str,
    payload: CourseUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["professor", "super_admin"]))
):
    course = db.query(Course).filter(
        (Course.id == course_id) | (Course.course_id == course_id)
    ).first()
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "COURSE_NOT_FOUND", "message": "Kurs topilmadi"}
        )

    if payload.course_name is not None:
        course.course_name = payload.course_name
    if payload.teacher_id is not None:
        course.teacher_id = payload.teacher_id
    if payload.schedule is not None:
        course.schedule = payload.schedule
    if payload.start_time is not None:
        course.start_time = payload.start_time

    db.commit()
    db.refresh(course)

    return get_course(course.id, db, current_user)

@router.delete("/{course_id}")
def delete_course(
    course_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["super_admin"]))
):
    course = db.query(Course).filter(
        (Course.id == course_id) | (Course.course_id == course_id)
    ).first()
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "COURSE_NOT_FOUND", "message": "Kurs topilmadi"}
        )
    db.delete(course)
    db.commit()
    return {"success": True, "message": "Kurs muvaffaqiyatli o'chirildi"}
