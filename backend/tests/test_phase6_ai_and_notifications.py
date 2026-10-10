import pytest
from unittest.mock import patch, MagicMock
from datetime import date
import httpx

from app.services.llm_service import LLMCopilotService
from tests.conftest import client, TestingSessionLocal


# ==========================================
# LLM Copilot Service Unit Tests
# ==========================================

def test_llm_service_missing_api_key():
    service = LLMCopilotService(api_key="")
    db = TestingSessionLocal()
    try:
        res = service.generate_chat_response(prompt="Why is Paneer Curry waste high?", db=db)
        assert res["is_fallback"] is True
        assert "LLM API key not configured" in res["error_reason"]
        assert "financial loss" in res["reply"].lower() or "smartserve" in res["reply"].lower()
    finally:
        db.close()



def test_llm_service_gemini_success():
    service = LLMCopilotService(api_key="mock_key", provider="gemini", model="gemini-1.5-flash")
    db = TestingSessionLocal()
    mock_resp = MagicMock()
    mock_resp.status_code = 200
    mock_resp.json.return_value = {
        "candidates": [
            {
                "content": {
                    "parts": [{"text": "Paneer Curry waste is elevated due to over-prep. Recommend reducing batch size by 8 portions."}]
                }
            }
        ]
    }

    try:
        with patch("httpx.Client.post", return_value=mock_resp):
            res = service.generate_chat_response(prompt="How to reduce Paneer Curry waste?", db=db)
            assert res["is_fallback"] is False
            assert res["confidence"] == 95.0
            assert "Paneer Curry waste is elevated" in res["reply"]
    finally:
        db.close()


def test_llm_service_timeout_fallback():
    service = LLMCopilotService(api_key="mock_key", provider="gemini")
    db = TestingSessionLocal()

    try:
        with patch("httpx.Client.post", side_effect=httpx.TimeoutException("Timeout")):
            res = service.generate_chat_response(prompt="What are peak sales items?", db=db)
            assert res["is_fallback"] is True
            assert "timed out" in res["error_reason"].lower()
            assert "sales" in res["reply"].lower() or "smartserve" in res["reply"].lower()
    finally:
        db.close()


# ==========================================
# FastAPI Endpoints Integration Tests (Phase 6)
# ==========================================

def test_ai_copilot_chat_endpoint():
    mock_copilot_res = {
        "reply": "Veg Biryani is projected for high demand (+18%) this evening.",
        "confidence": 94.0,
        "timestamp": "20:00:00",
        "is_fallback": False,
        "error_reason": None,
    }
    with patch("app.services.llm_service.LLMCopilotService.generate_chat_response", return_value=mock_copilot_res):
        response = client.post("/api/v1/ai/chat", json={"prompt": "What is the demand forecast for Veg Biryani?"})
        assert response.status_code == 200
        data = response.json()
        assert data["reply"] == "Veg Biryani is projected for high demand (+18%) this evening."
        assert data["confidence"] == 94.0
        assert data["timestamp"] == "20:00:00"


def test_ai_copilot_chat_invalid_prompt():
    # Test empty prompt validation
    response = client.post("/api/v1/ai/chat", json={"prompt": ""})
    assert response.status_code == 422


def test_ai_insights_endpoint():
    response = client.get("/api/v1/ai/insights")
    assert response.status_code == 200
    data = response.json()
    assert "total_insights" in data
    assert "insights" in data
    assert len(data["insights"]) >= 1
    # Check structure of insight item
    insight = data["insights"][0]
    assert "id" in insight
    assert "category" in insight
    assert "summary" in insight
    assert "evidence" in insight
    assert "recommendation" in insight


def test_ai_briefing_endpoint():
    response = client.get("/api/v1/ai/briefing")
    assert response.status_code == 200
    data = response.json()
    assert "summaryHeader" in data
    assert "points" in data
    assert isinstance(data["points"], list)
    assert len(data["points"]) >= 3


def test_notifications_endpoints():
    # 1. List notifications
    res1 = client.get("/api/v1/notifications")
    assert res1.status_code == 200
    notifs = res1.json()
    assert isinstance(notifs, list)

    if notifs:
        target_id = notifs[0]["id"]
        # 2. Mark single notification as read
        res2 = client.put(f"/api/v1/notifications/{target_id}/read")
        assert res2.status_code == 200
        updated_notif = res2.json()
        assert updated_notif["is_read"] is True

    # 3. Mark all as read
    res3 = client.put("/api/v1/notifications/read-all")
    assert res3.status_code == 200
    assert res3.json()["success"] is True
