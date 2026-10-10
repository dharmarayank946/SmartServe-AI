import io
from datetime import timedelta
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.core.security import create_access_token


def test_public_endpoints_accessible_without_auth():
    unauth = TestClient(app)

    res_health = unauth.get("/health")
    assert res_health.status_code == 200
    assert res_health.json()["status"] == "ok"

    res_ready = unauth.get("/ready")
    assert res_ready.status_code == 200
    assert res_ready.json()["status"] == "ready"

    res_login = unauth.post("/api/v1/auth/login", json={"email": "manager@smartserve.ai", "password": "password123"})
    assert res_login.status_code == 200
    assert "access_token" in res_login.json()


def test_protected_endpoints_reject_missing_token():
    unauth = TestClient(app)

    protected_paths = [
        ("GET", "/api/v1/dashboard"),
        ("GET", "/api/v1/food-items"),
        ("POST", "/api/v1/food-items"),
        ("GET", "/api/v1/sales"),
        ("POST", "/api/v1/sales"),
        ("GET", "/api/v1/waste"),
        ("POST", "/api/v1/waste"),
        ("POST", "/api/v1/predict"),
        ("GET", "/api/v1/ai/insights"),
        ("GET", "/api/v1/ai/briefing"),
        ("POST", "/api/v1/ai/chat"),
        ("GET", "/api/v1/notifications"),
        ("GET", "/api/v1/weather"),
        ("GET", "/api/v1/holidays"),
    ]

    for method, path in protected_paths:
        if method == "GET":
            res = unauth.get(path)
        elif method == "POST":
            res = unauth.post(path, json={})
        assert res.status_code == 401, f"Expected 401 for {method} {path}, got {res.status_code}"
        assert "WWW-Authenticate" in res.headers
        assert res.headers["WWW-Authenticate"] == "Bearer"


def test_protected_endpoints_reject_invalid_token():
    unauth = TestClient(app)
    headers = {"Authorization": "Bearer invalid_gibberish_token_12345"}

    res = unauth.get("/api/v1/dashboard", headers=headers)
    assert res.status_code == 401
    assert "Could not validate credentials" in res.json()["error"]


def test_protected_endpoints_reject_expired_token():
    unauth = TestClient(app)
    expired_token = create_access_token(subject="manager@smartserve.ai", expires_delta=timedelta(seconds=-10))
    headers = {"Authorization": f"Bearer {expired_token}"}

    res = unauth.get("/api/v1/dashboard", headers=headers)
    assert res.status_code == 401


def test_protected_endpoints_accept_valid_token():
    unauth = TestClient(app)
    valid_token = create_access_token(subject="manager@smartserve.ai")
    headers = {"Authorization": f"Bearer {valid_token}"}

    res = unauth.get("/api/v1/dashboard", headers=headers)
    assert res.status_code == 200
    assert "todaySales" in res.json()


def test_sales_csv_upload_size_limit():
    unauth = TestClient(app)
    valid_token = create_access_token(subject="manager@smartserve.ai")
    headers = {"Authorization": f"Bearer {valid_token}"}

    # Generate 10.5MB oversized byte buffer instantly
    oversized_bytes = b"date,quantity_sold,revenue\n" + (b"2026-10-01,10,100.00\n" * 500000)
    file_bytes = io.BytesIO(oversized_bytes)
    files = {"file": ("large_sales.csv", file_bytes, "text/csv")}

    res = unauth.post("/api/v1/sales/upload", headers=headers, files=files)
    assert res.status_code == 413
    assert "exceeds maximum allowed limit" in res.json()["error"]
