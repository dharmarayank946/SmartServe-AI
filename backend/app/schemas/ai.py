from datetime import datetime, date
from typing import List, Optional
from pydantic import BaseModel, Field, ConfigDict


# AI Copilot Chat Schemas
class AIChatRequest(BaseModel):
    prompt: str = Field(..., min_length=1, max_length=1000, description="User question or operational query for AI copilot")


class AIChatResponse(BaseModel):
    reply: str
    confidence: float = Field(..., ge=0.0, le=100.0)
    timestamp: str
    is_fallback: bool = False
    error_reason: Optional[str] = None


# AI Insights Schemas
class AIInsightItem(BaseModel):
    id: str
    category: str  # Waste Reduction, Prep Optimization, Demand Surge, Margin Alert
    type: str = "warning"  # warning, opportunity, critical, info
    title: str
    summary: str
    evidence: str
    recommendation: str
    potential_savings: Optional[float] = None
    impact_level: str = "Medium"  # High, Medium, Low


class AIInsightsResponse(BaseModel):
    generated_at: str
    total_insights: int
    insights: List[AIInsightItem]


# Daily Briefing Schemas
class AIBriefingResponse(BaseModel):
    summaryHeader: str
    points: List[str]
    generated_at: str


# Notification Schemas
class NotificationBase(BaseModel):
    type: str  # warning, critical, opportunity, shortage
    priority: str  # HIGH, CRITICAL, OPPORTUNITY, MEDIUM
    title: str
    time_label: Optional[str] = None
    reason: str
    recommended_action: str
    is_read: bool = False


class NotificationCreate(NotificationBase):
    pass


class NotificationResponse(NotificationBase):
    id: str
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
