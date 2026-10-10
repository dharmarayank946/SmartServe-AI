import uuid
from datetime import date, datetime
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.prediction import DemandPrediction
from app.models.food_item import FoodItem
from app.schemas.prediction import PredictionInput, PredictionResult, DemandPredictionDBResponse
from app.ml.model_loader import get_demand_model
from app.services.weather_service import weather_service
from app.services.holiday_service import holiday_service


router = APIRouter()


@router.post("", response_model=PredictionResult, status_code=status.HTTP_200_OK)
def predict_demand(
    payload: PredictionInput,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """
    Generate ML-driven demand prediction and prep recommendation for a food item.
    Enriches prediction with real-time weather and holiday status if available.
    Persists prediction in database and returns full explainable AI metrics.
    """
    try:
        model = get_demand_model(db)
        input_data = payload.model_dump()

        # Check if holiday enrichment is needed/useful
        if payload.holiday is None or "holiday" not in payload.model_fields_set:
            holiday_info = holiday_service.check_is_holiday(payload.date)
            if holiday_info["is_available"]:
                input_data["holiday"] = holiday_info["is_holiday"]
                if holiday_info["is_holiday"] and holiday_info["holiday_name"]:
                    input_data["event"] = holiday_info["holiday_name"]

        # Check if weather enrichment is needed
        if (payload.weather is None or payload.weather == "Sunny") and "weather" not in payload.model_fields_set:
            w_info = weather_service.get_current_weather()
            if w_info["is_available"]:
                input_data["weather"] = w_info["weather_condition"]
                if "temperature" not in payload.model_fields_set:
                    input_data["temperature"] = w_info["temperature"]
                if "rain_probability" not in payload.model_fields_set:
                    input_data["rain_probability"] = w_info["rain_probability"]

        # Run inference through ML model
        result_dict = model.predict(input_data)

        # Map food_item_id
        target_food_item_id = payload.food_item_id
        if not target_food_item_id and payload.food_item:
            item = db.query(FoodItem).filter(FoodItem.name.ilike(f"%{payload.food_item}%")).first()
            if item:
                target_food_item_id = item.id

        # Persist prediction in database
        pred_id = f"pred-{str(uuid.uuid4())[:8]}"
        db_prediction = DemandPrediction(
            id=pred_id,
            food_item_id=target_food_item_id,
            prediction_date=payload.date,
            day_of_week=payload.day or payload.date.strftime("%A"),
            predicted_demand=result_dict["predicted_demand"],
            recommended_prep=result_dict["recommended_preparation"],
            confidence=result_dict["confidence"],
            expected_waste=result_dict["expected_waste"],
            shortage_risk=result_dict["shortage_risk"],
            weather_condition=payload.weather,
            rain_probability=payload.rain_probability,
            factors=result_dict["factors"],
            explanation=result_dict["explanation"],
        )

        db.add(db_prediction)
        db.commit()

        result_dict["id"] = pred_id
        return result_dict

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error persisting demand prediction: {str(e)}",
        )
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Prediction error: {str(e)}",
        )


@router.get("", response_model=List[DemandPredictionDBResponse])
def get_prediction_history(
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """
    Retrieve historical stored demand predictions from database.
    """
    try:
        predictions = db.query(DemandPrediction).order_by(DemandPrediction.prediction_date.desc()).limit(limit).all()
        return predictions
    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error fetching prediction history: {str(e)}",
        )
