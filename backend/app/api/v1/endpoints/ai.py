from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

from app.core.database import get_db
from app.core.security import get_current_user
from app.schemas.ai import (
    AIChatRequest,
    AIChatResponse,
    AIInsightsResponse,
    AIBriefingResponse,
)
from app.services.llm_service import llm_service
from app.services.insight_service import insight_engine

router = APIRouter()


@router.post("/chat", response_model=AIChatResponse, status_code=status.HTTP_200_OK)
def ai_copilot_chat(
    payload: AIChatRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """
    AI Copilot chat endpoint. Accepts user prompt and returns restaurant-specific,
    database-grounded AI recommendations.
    """
    try:
        response_dict = llm_service.generate_chat_response(prompt=payload.prompt, db=db)
        return response_dict
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"AI Copilot service error: {str(e)}",
        )


@router.get("/insights", response_model=AIInsightsResponse, status_code=status.HTTP_200_OK)
def get_ai_insights(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """
    Retrieve categorized, evidence-based AI operational insights generated from
    live sales, waste logs, inventory, weather, and predictions.
    """
    try:
        insights_data = insight_engine.generate_insights(db=db)
        return insights_data
    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error generating AI insights: {str(e)}",
        )


@router.get("/briefing", response_model=AIBriefingResponse, status_code=status.HTTP_200_OK)
def get_daily_briefing(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """
    Retrieve morning daily executive operations briefing summaryHeader and key bullet points.
    """
    try:
        briefing_data = insight_engine.generate_briefing(db=db)
        return briefing_data
    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error generating daily briefing: {str(e)}",
        )
