from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

from app.core.database import get_db
from app.core.security import get_current_user
from app.schemas.ai import NotificationResponse
from app.services.notification_service import notification_service

router = APIRouter()


@router.get("", response_model=List[NotificationResponse], status_code=status.HTTP_200_OK)
def list_notifications(
    unread_only: bool = Query(False, description="Filter for unread notifications only"),
    limit: int = Query(50, ge=1, le=200, description="Max notifications to retrieve"),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """
    List operational alerts and notifications generated from real DB conditions.
    """
    try:
        notifications = notification_service.get_notifications(db=db, unread_only=unread_only, limit=limit)
        return notifications
    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error listing notifications: {str(e)}",
        )


@router.put("/{notification_id}/read", response_model=NotificationResponse, status_code=status.HTTP_200_OK)
def mark_notification_as_read(
    notification_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """
    Mark a specific notification as read.
    """
    try:
        notif = notification_service.mark_as_read(notification_id=notification_id, db=db)
        if not notif:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Notification '{notification_id}' not found.",
            )
        return notif
    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error updating notification: {str(e)}",
        )


@router.put("/read-all", status_code=status.HTTP_200_OK)
def mark_all_notifications_as_read(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """
    Mark all unread notifications as read.
    """
    try:
        count = notification_service.mark_all_as_read(db=db)
        return {"success": True, "updated_count": count}
    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error updating notifications: {str(e)}",
        )
