from datetime import timedelta
import pytest
from tests.conftest import client, TestingSessionLocal
from fastapi.testclient import TestClient
from app.main import app
from app.core.security import create_access_token

def test_waste_endpoint_requires_auth():
    unauth = TestClient(app)
    res_get = unauth.get("/api/v1/waste")
    assert res_get.status_code == 401
    assert "WWW-Authenticate" in res_get.headers

    res_post = unauth.post("/api/v1/waste", json={})
    assert res_post.status_code == 401


def test_get_waste_metrics_returns_real_structure():
    res = client.get("/api/v1/waste")
    assert res.status_code == 200
    data = res.json()
    assert "todayWasteKg" in data
    assert "monthlyWasteKg" in data
    assert "financialLoss" in data
    assert "wasteByReason" in data
    assert "mostWastedItems" in data
    assert "wasteLogs" in data
    assert isinstance(data["wasteLogs"], list)


def test_log_waste_entry_full_workflow_and_persistence():
    payload = {
        "item_name": "Paneer Butter Masala",
        "date": "2026-10-13",
        "time": "13:45",
        "quantity": 6.5,
        "unit": "portions",
        "reason": "Over-preparation",
        "financial_loss": 520.0,
        "notes": "Regression test excess batch"
    }
    create_res = client.post("/api/v1/waste", json=payload)
    assert create_res.status_code == 201
    created_data = create_res.json()
    assert created_data["success"] is True
    assert "wasteData" in created_data
    log_id = created_data["wasteData"]["id"]
    assert log_id is not None
    assert created_data["wasteData"]["itemName"] == "Paneer Butter Masala"
    assert created_data["wasteData"]["qty"] == 6.5
    assert created_data["wasteData"]["time"] == "13:45"

    # Confirm persistence in GET /api/v1/waste
    get_res = client.get("/api/v1/waste")
    assert get_res.status_code == 200
    logs = get_res.json()["wasteLogs"]
    found = [l for l in logs if l["id"] == log_id]
    assert len(found) == 1
    assert found[0]["item_name"] == "Paneer Butter Masala"
    assert found[0]["quantity"] == 6.5
    assert found[0]["reason"] == "Over-preparation"

    # Clean up with DELETE
    del_res = client.delete(f"/api/v1/waste/{log_id}")
    assert del_res.status_code == 200
    assert del_res.json()["success"] is True


def test_log_waste_all_supported_reasons():
    reasons = [
        "Over-preparation",
        "Spoilage",
        "Low Demand",
        "Cooking Error",
        "Customer Return",
        "Other"
    ]
    created_ids = []
    for r in reasons:
        payload = {
            "item_name": "Veg Biryani",
            "date": "2026-10-13",
            "time": "14:00",
            "quantity": 2.0,
            "unit": "plates",
            "reason": r,
            "financial_loss": 170.0,
            "notes": f"Testing reason {r}"
        }
        res = client.post("/api/v1/waste", json=payload)
        assert res.status_code == 201
        created_ids.append(res.json()["wasteData"]["id"])

    # Clean up test entries
    for cid in created_ids:
        client.delete(f"/api/v1/waste/{cid}")


def test_log_waste_entry_validation():
    # Negative quantity
    res_neg = client.post("/api/v1/waste", json={
        "item_name": "Masala Dosa",
        "date": "2026-10-13",
        "quantity": -2.0,
        "reason": "Cooking Error",
        "financial_loss": 50.0
    })
    assert res_neg.status_code == 422

    # Empty item name
    res_empty = client.post("/api/v1/waste", json={
        "item_name": "",
        "date": "2026-10-13",
        "quantity": 5.0,
        "reason": "Cooking Error",
        "financial_loss": 50.0
    })
    assert res_empty.status_code == 422


def test_waste_endpoints_reject_invalid_or_expired_token():
    unauth = TestClient(app)

    # 1. Bogus / malformed token
    res_bogus = unauth.get("/api/v1/waste", headers={"Authorization": "Bearer totally_bogus_token"})
    assert res_bogus.status_code == 401

    # 2. Expired token
    expired_token = create_access_token(
        subject="manager@smartserve.ai",
        expires_delta=timedelta(seconds=-10)
    )
    res_expired = unauth.get("/api/v1/waste", headers={"Authorization": f"Bearer {expired_token}"})
    assert res_expired.status_code == 401


def test_legitimate_auth_login_grants_waste_access():
    unauth = TestClient(app)

    # Attempt login with invalid credentials -> 401
    bad_login = unauth.post("/api/v1/auth/login", json={
        "email": "manager@smartserve.ai",
        "password": "wrong_password"
    })
    assert bad_login.status_code == 401

    # Attempt login with legitimate credentials -> 200
    good_login = unauth.post("/api/v1/auth/login", json={
        "email": "manager@smartserve.ai",
        "password": "password123"
    })
    assert good_login.status_code == 200
    login_data = good_login.json()
    assert "access_token" in login_data
    assert login_data["token_type"] == "bearer"
    assert "user" in login_data
    token = login_data["access_token"]

    # Use the legitimately acquired token to access protected waste endpoints
    auth_headers = {"Authorization": f"Bearer {token}"}
    waste_res = unauth.get("/api/v1/waste", headers={**auth_headers})
    assert waste_res.status_code == 200
    assert "wasteLogs" in waste_res.json()

    # Log waste using legitimate token
    post_res = unauth.post("/api/v1/waste", json={
        "item_name": "Paneer Tikka",
        "date": "2026-10-13",
        "time": "15:00",
        "quantity": 3.0,
        "unit": "portions",
        "reason": "Over-preparation",
        "financial_loss": 270.0,
        "notes": "Verified login test"
    }, headers={**auth_headers})
    assert post_res.status_code == 201
    log_id = post_res.json()["wasteData"]["id"]

    # Cleanup
    unauth.delete(f"/api/v1/waste/{log_id}", headers={**auth_headers})

