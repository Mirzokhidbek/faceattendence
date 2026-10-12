def test_login_success(client):
    res = client.post("/api/auth/login", json={
        "email": "admin@smartcheck.edu",
        "password": "Admin@123"
    })
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["email"] == "admin@smartcheck.edu"
    assert data["user"]["role"] == "super_admin"

def test_login_invalid_password(client):
    res = client.post("/api/auth/login", json={
        "email": "admin@smartcheck.edu",
        "password": "WrongPassword999"
    })
    assert res.status_code == 401
    assert res.json()["error"]["code"] == "INVALID_CREDENTIALS"

def test_login_nonexistent_user(client):
    res = client.post("/api/auth/login", json={
        "email": "nobody@example.com",
        "password": "SomePassword"
    })
    assert res.status_code == 401

def test_get_me_authenticated(client, admin_token):
    res = client.get("/api/auth/me", headers={"Authorization": f"Bearer {admin_token}"})
    assert res.status_code == 200
    data = res.json()
    assert data["email"] == "admin@smartcheck.edu"
    assert data["role"] == "super_admin"

def test_get_me_unauthorized(client):
    res = client.get("/api/auth/me")
    assert res.status_code == 401

def test_token_refresh(client, prof_token):
    res = client.post("/api/auth/refresh", headers={"Authorization": f"Bearer {prof_token}"})
    assert res.status_code == 200
    assert "access_token" in res.json()
