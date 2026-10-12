def test_get_students_list(client, admin_token):
    res = client.get("/api/students", headers={"Authorization": f"Bearer {admin_token}"})
    assert res.status_code == 200
    data = res.json()
    assert "items" in data
    assert data["total"] >= 15
    assert len(data["items"]) > 0
    assert "student_id" in data["items"][0]

def test_get_single_student(client, admin_token):
    res = client.get("/api/students/23013094", headers={"Authorization": f"Bearer {admin_token}"})
    assert res.status_code == 200
    data = res.json()
    assert data["student_id"] == "23013094"
    assert "Muzaffar" in data["full_name"]
    assert data["group_name"] == "CS-21"
    assert data["consent_given"] is True

def test_search_students(client, admin_token):
    res = client.get("/api/students?search=Muzaffar", headers={"Authorization": f"Bearer {admin_token}"})
    assert res.status_code == 200
    data = res.json()
    assert len(data["items"]) >= 1
    assert data["items"][0]["student_id"] == "23013094"

def test_update_student(client, admin_token):
    res = client.put(
        "/api/students/23013094",
        json={"full_name": "Muzaffar Toshmatov Updated"},
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert res.status_code == 200
    assert res.json()["full_name"] == "Muzaffar Toshmatov Updated"

    # Restore name
    restore_res = client.put(
        "/api/students/23013094",
        json={"full_name": "Muzaffar Toshmatov"},
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert restore_res.status_code == 200
    assert restore_res.json()["full_name"] == "Muzaffar Toshmatov"
