def test_get_attendance_report(client, admin_token):
    res = client.get("/api/reports/attendance", headers={"Authorization": f"Bearer {admin_token}"})
    assert res.status_code == 200
    data = res.json()
    assert "summary" in data
    assert "records" in data
    assert "total_records" in data["summary"]
    assert "overall_rate" in data["summary"]

def test_export_excel(client, admin_token):
    res = client.get("/api/reports/attendance/export?format=excel", headers={"Authorization": f"Bearer {admin_token}"})
    assert res.status_code == 200
    assert "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" in res.headers["content-type"]
    assert len(res.content) > 1000

def test_export_pdf(client, admin_token):
    res = client.get("/api/reports/attendance/export?format=pdf", headers={"Authorization": f"Bearer {admin_token}"})
    assert res.status_code == 200
    assert "application/pdf" in res.headers["content-type"]
    assert len(res.content) > 1000
