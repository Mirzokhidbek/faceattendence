import json
import random
from datetime import datetime, date, timedelta
import numpy as np
from sqlalchemy.orm import Session

from app.models.user import User
from app.models.student import Student
from app.models.course import Course
from app.models.attendance import AttendanceLog
from app.core.security import hash_password

def generate_random_embedding(seed: int) -> list:
    """Generate deterministic 128-d normalized embedding for seed students."""
    np.random.seed(seed)
    vec = np.random.randn(128).astype(np.float32)
    norm = np.linalg.norm(vec)
    normalized = (vec / norm).tolist()
    return normalized

def seed_database(db: Session):
    """Populates development database with initial administrative accounts, courses, and students."""
    # Ensure super admin exists
    admin_exists = db.query(User).filter(User.email == "admin@smartcheck.edu").first()
    if not admin_exists:
        super_admin = User(
            email="admin@smartcheck.edu",
            password_hash=hash_password("Admin@123"),
            full_name="Erkinov Shakhzodjon (Team Lead)",
            role="super_admin",
            is_active=True
        )
        prof1 = User(
            email="prof.john@smartcheck.edu",
            password_hash=hash_password("Prof@123"),
            full_name="Dr. Mirzokhidbek Karimov",
            role="professor",
            is_active=True
        )
        prof2 = User(
            email="prof.sarah@smartcheck.edu",
            password_hash=hash_password("Prof@123"),
            full_name="Prof. Li Yizhe",
            role="professor",
            is_active=True
        )
        db.add_all([super_admin, prof1, prof2])
        db.flush()
    else:
        prof1 = db.query(User).filter(User.email == "prof.john@smartcheck.edu").first()
        prof2 = db.query(User).filter(User.email == "prof.sarah@smartcheck.edu").first()

    # Ensure courses exist
    if db.query(Course).count() == 0:
        c1 = Course(
            course_id="CS101",
            course_name="Artificial Intelligence & Computer Vision",
            teacher_id=prof1.id if prof1 else None,
            schedule="Mon, Wed 09:00 - 10:30",
            start_time="09:00"
        )
        c2 = Course(
            course_id="CS204",
            course_name="Database Systems & Architecture",
            teacher_id=prof2.id if prof2 else None,
            schedule="Tue, Thu 11:00 - 12:30",
            start_time="11:00"
        )
        c3 = Course(
            course_id="SE301",
            course_name="Software Engineering & Cloud Infrastructure",
            teacher_id=prof1.id if prof1 else None,
            schedule="Fri 14:00 - 16:30",
            start_time="14:00"
        )
        db.add_all([c1, c2, c3])
        db.flush()

    # Check if students exist
    if db.query(Student).count() > 0:
        return

    # 3. Create Sample Students
    student_templates = [
        ("23013094", "Muzaffar Toshmatov", "CS-21"),
        ("23013095", "Jasur Aliyev", "CS-21"),
        ("23013096", "Dilshod Rahimov", "CS-21"),
        ("23013097", "Shahnoza Karimova", "CS-21"),
        ("23013098", "Azizbek Yusupov", "CS-21"),
        ("23014010", "Ziyoda Usmanova", "SE-102"),
        ("23014011", "Farrux Qodirov", "SE-102"),
        ("23014012", "Madina Saidova", "SE-102"),
        ("23014013", "Sardorbek Boboev", "SE-102"),
        ("23014014", "Nilufar Norova", "SE-102"),
        ("23015021", "Bekzod Shukurov", "DS-301"),
        ("23015022", "Malika Ahmedova", "DS-301"),
        ("23015023", "Rustam Ikromov", "DS-301"),
        ("23015024", "Gulsanam Umarova", "DS-301"),
        ("23015025", "Otabek Kimsanov", "DS-301"),
        ("23015026", "Sevara Halimova", "DS-301"),
        ("23016001", "Bobur Mirzayev", "CS-21"),
        ("23016002", "Kamola Ergasheva", "SE-102"),
        ("23016003", "Sherzod Mahmudov", "DS-301"),
        ("23016004", "Nozima Zokirova", "CS-21"),
    ]

    created_students = []
    for idx, (code, name, group) in enumerate(student_templates):
        embedding_list = generate_random_embedding(1000 + idx)
        # Use cute avatar generator
        avatar_url = f"https://api.dicebear.com/7.x/avataaars/svg?seed={code}"
        st = Student(
            student_id=code,
            full_name=name,
            group_name=group,
            photo_url=avatar_url,
            face_embedding=json.dumps(embedding_list),
            consent_given=True
        )
        db.add(st)
        created_students.append(st)

    db.flush()

    # 4. Generate Past 7 Days of Attendance Logs for realistic Charts & KPIs
    today = date.today()
    courses = db.query(Course).all()

    for day_offset in range(6, -1, -1):
        log_date = today - timedelta(days=day_offset)
        # Weekdays only
        if log_date.weekday() >= 5:
            continue

        for student in created_students:
            # 85% attendance probability
            if random.random() < 0.85:
                course = random.choice(courses)
                # 80% present on-time, 20% late
                is_late = random.random() < 0.18
                status = "late" if is_late else "present"
                conf = round(random.uniform(0.88, 0.98), 3)

                hour = 9 if not is_late else 9
                minute = random.randint(1, 10) if not is_late else random.randint(18, 40)
                ts = datetime.combine(log_date, datetime.min.time()).replace(hour=hour, minute=minute)

                log = AttendanceLog(
                    student_id=student.id,
                    course_id=course.id,
                    timestamp=ts,
                    status=status,
                    confidence_score=conf
                )
                db.add(log)

    db.commit()
