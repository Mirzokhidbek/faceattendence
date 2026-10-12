import os
import sys
import pytest
from fastapi.testclient import TestClient

# Ensure backend root is on sys.path
backend_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if backend_path not in sys.path:
    sys.path.insert(0, backend_path)

from app.main import app
from app.database.database import Base, engine, SessionLocal
from app.models.student import Student
from app.seed_data import seed_database
from app.services.face_recognition_service import face_recognition_service

@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_database(db)
        students = db.query(Student).all()
        face_recognition_service.load_cache_from_db(students)
    finally:
        db.close()
    yield

@pytest.fixture
def client():
    with TestClient(app) as c:
        yield c

@pytest.fixture
def admin_token(client):
    res = client.post("/api/auth/login", json={
        "email": "admin@smartcheck.edu",
        "password": "Admin@123"
    })
    assert res.status_code == 200
    return res.json()["access_token"]

@pytest.fixture
def prof_token(client):
    res = client.post("/api/auth/login", json={
        "email": "prof.john@smartcheck.edu",
        "password": "Prof@123"
    })
    assert res.status_code == 200
    return res.json()["access_token"]
