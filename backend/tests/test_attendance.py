def test_get_attendance_stats(client, admin_token):
    res = client.get("/api/attendance/stats", headers={"Authorization": f"Bearer {admin_token}"})
    assert res.status_code == 200
    data = res.json()
    assert "total_students" in data
    assert data["total_students"] >= 15
    assert "weekly_trend" in data
    assert len(data["weekly_trend"]) == 7
    assert "group_distribution" in data
    assert len(data["group_distribution"]) >= 3

def test_get_attendance_logs_with_filter(client, admin_token):
    res = client.get("/api/attendance/logs?status=present&limit=10", headers={"Authorization": f"Bearer {admin_token}"})
    assert res.status_code == 200
    logs = res.json()
    assert isinstance(logs, list)
    for log in logs:
        assert log["status"] == "present"

def test_check_in_invalid_course(client):
    res = client.post("/api/attendance/check-in", json={
        "frame": "dGVzdA==",
        "course_id": "NON_EXISTENT_COURSE_999"
    })
    assert res.status_code == 200
    assert res.json()["success"] is False
    assert res.json()["status"] == "error"

def test_check_in_blank_frame(client):
    import base64, cv2, numpy as np
    blank = np.zeros((200, 200, 3), dtype=np.uint8)
    _, buffer = cv2.imencode(".jpg", blank)
    b64_frame = base64.b64encode(buffer).decode("utf-8")

    res = client.post("/api/attendance/check-in", json={
        "frame": b64_frame,
        "course_id": "CS101"
    })
    assert res.status_code == 200
    assert res.json()["success"] is False
    assert res.json()["status"] == "no_face"
