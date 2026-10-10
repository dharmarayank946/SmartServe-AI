import os
import io
from datetime import date, timedelta
import pytest

from app.ml.demand_model import DemandPredictionModel
from app.ml.model_loader import get_demand_model, reset_cached_model
from app.ml.train_model import train_and_save_model
from app.models.prediction import DemandPrediction
from app.models.sales import SalesRecord
from tests.conftest import TestingSessionLocal, client



def setup_function():
    reset_cached_model()


def test_valid_demand_prediction_and_db_persistence():
    test_db = TestingSessionLocal()
    train_and_save_model(test_db)
    test_db.close()

    payload = {
        "food_item": "Veg Biryani",
        "food_item_id": "item-001",
        "date": "2026-11-20",
        "day": "Friday",
        "historical_sales": 80,
        "expected_customers": 120,
        "weather": "Rainy",
        "temperature": 26.5,
        "rain_probability": 78,
        "holiday": False,
        "event": "None"
    }


    response = client.post("/api/v1/predict", json=payload)
    assert response.status_code == 200
    data = response.json()

    # Validate output schema fields required by BACKEND_INTEGRATION_PLAN.md
    assert "predicted_demand" in data
    assert "recommended_preparation" in data
    assert "confidence" in data
    assert "expected_waste" in data
    assert "shortage_risk" in data
    assert "unit" in data
    assert data["unit"] == "portions"
    assert "trend_percent" in data
    assert "factors" in data
    assert isinstance(data["factors"], list)
    assert "factor_impacts" in data
    assert isinstance(data["factor_impacts"], list)
    assert "explanation" in data
    assert "is_fallback" in data

    assert data["predicted_demand"] > 0
    assert data["recommended_preparation"] >= data["predicted_demand"]

    # Verify Database Persistence
    db_session = TestingSessionLocal()
    saved = db_session.query(DemandPrediction).filter(DemandPrediction.id == data["id"]).first()
    assert saved is not None
    assert saved.predicted_demand == data["predicted_demand"]
    assert saved.recommended_prep == data["recommended_preparation"]
    db_session.close()












def test_invalid_input_validation():
    # Negative historical_sales should fail Pydantic validation (422)
    invalid_payload = {
        "food_item": "Veg Biryani",
        "date": "2026-10-10",
        "historical_sales": -50,
        "rain_probability": 150  # Invalid > 100
    }
    response = client.post("/api/v1/predict", json=invalid_payload)
    assert response.status_code == 422


def test_insufficient_data_fallback():
    # Test model behavior when untrained/insufficient data
    untrained_model = DemandPredictionModel()
    payload = {
        "food_item": "Paneer Tikka",
        "date": "2026-10-15",
        "historical_sales": 50,
        "weather": "Sunny"
    }
    res = untrained_model.predict(payload)
    assert res["is_fallback"] is True
    assert "Fallback" in res["explanation"]
    assert res["predicted_demand"] > 0


def test_model_loading_and_caching():
    # Verify singleton loader caches model instance
    test_db = TestingSessionLocal()
    m1 = get_demand_model(test_db)
    m2 = get_demand_model(test_db)
    assert m1 is m2
    test_db.close()


def test_prediction_history_get_endpoint():
    response = client.get("/api/v1/predict")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
