from app.routers.auth import router as auth_router
from app.routers.students import router as students_router
from app.routers.attendance import router as attendance_router
from app.routers.courses import router as courses_router
from app.routers.reports import router as reports_router

__all__ = [
    "auth_router",
    "students_router",
    "attendance_router",
    "courses_router",
    "reports_router"
]
