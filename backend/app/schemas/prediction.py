from datetime import date, datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, ConfigDict, Field, AliasChoices


class DemandPredictionBase(BaseModel):
    food_item_id: Optional[str] = None
    prediction_date: date
    day_of_week: str
    predicted_demand: int
    recommended_prep: int
    confidence: float
    expected_waste: Optional[int] = 0
    shortage_risk: Optional[str] = "Low"
    weather_condition: Optional[str] = None
    rain_probability: Optional[int] = None
    factors: Optional[List[Any]] = []
    explanation: Optional[str] = None


class DemandPredictionCreate(DemandPredictionBase):
    pass


class DemandPredictionDBResponse(DemandPredictionBase):
    id: str
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


DemandPredictionResponse = DemandPredictionDBResponse



class PredictionInput(BaseModel):
    food_item: Optional[str] = "Veg Biryani"
    food_item_id: Optional[str] = "item-001"
    date: date
    day: Optional[str] = "Friday"
    historical_sales: Optional[int] = Field(80, ge=0, validation_alias=AliasChoices("historical_sales", "avg_sales"))
    expected_customers: Optional[int] = Field(120, ge=0, validation_alias=AliasChoices("expected_customers", "customers"))
    weather: Optional[str] = "Sunny"
    temperature: Optional[float] = Field(25.0, validation_alias=AliasChoices("temperature", "temp_c"))
    rain_probability: Optional[int] = Field(10, ge=0, le=100, validation_alias=AliasChoices("rain_probability", "rain_prob"))
    holiday: Optional[bool] = False
    event: Optional[str] = "None"

    model_config = ConfigDict(populate_by_name=True)


class FactorImpact(BaseModel):
    name: str
    impact: str
    level: str
    color: str


class PredictionResult(BaseModel):
    id: Optional[str] = None
    predicted_demand: int
    recommended_preparation: int
    confidence: float
    expected_waste: int
    shortage_risk: str
    unit: str = "portions"
    trend_percent: str
    factors: List[str]
    factor_impacts: List[Dict[str, Any]]
    explanation: str
    is_fallback: bool = False
