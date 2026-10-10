import uuid
import logging
from datetime import datetime, date, timedelta
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session

from app.models.notification import Notification
from app.models.waste import WasteLog
from app.models.food_item import FoodItem
from app.models.prediction import DemandPrediction
from app.services.weather_service import weather_service
from app.services.holiday_service import holiday_service

logger = logging.getLogger(__name__)


class NotificationService:
    """
    Manages operational alert notifications in database.
    Evaluates live database conditions (high waste, low stock, demand surge) to generate non-duplicate alerts.
    """

    def generate_operational_alerts(self, db: Session) -> int:
        """
        Scans database conditions and creates relevant notifications if they don't already exist.
        Returns the count of newly created alerts.
        """
        new_alerts_count = 0
        today = date.today()
        seven_days_ago = today - timedelta(days=7)

        # 1. Check for High Waste Alerts
        recent_waste_sum = db.query(WasteLog).filter(WasteLog.date >= seven_days_ago).all()
        total_loss = sum(w.financial_loss for w in recent_waste_sum)
        if total_loss > 500.0:
            title = "High Food Waste Threshold Exceeded"
            # Check for existing duplicate unread or recent notification with same title
            existing = db.query(Notification).filter(Notification.title == title, Notification.is_read == False).first()
            if not existing:
                notif = Notification(
                    id=f"notif-{str(uuid.uuid4())[:8]}",
                    type="critical",
                    priority="CRITICAL",
                    title=title,
                    time_label="Just Now",
                    reason=f"7-day accumulated waste loss reached ₹{total_loss:,.2f}, exceeding threshold of ₹500.00.",
                    recommended_action="Review prep schedules for high-loss items and reduce safety prep buffer by 5%.",
                    is_read=False,
                )
                db.add(notif)
                new_alerts_count += 1

        # 2. Check for Low Stock / Reorder Alerts
        low_stock_items = db.query(FoodItem).filter(FoodItem.current_stock < FoodItem.avg_daily_sales).all()
        for item in low_stock_items:
            title = f"Low Stock Warning: {item.name}"
            existing = db.query(Notification).filter(Notification.title == title, Notification.is_read == False).first()
            if not existing:
                notif = Notification(
                    id=f"notif-{str(uuid.uuid4())[:8]}",
                    type="warning",
                    priority="HIGH",
                    title=title,
                    time_label="10 min ago",
                    reason=f"Current stock for {item.name} ({item.current_stock} {item.unit}) is below average daily sales ({item.avg_daily_sales}).",
                    recommended_action=f"Place an emergency reorder for {item.name} ingredients before evening rush.",
                    is_read=False,
                )
                db.add(notif)
                new_alerts_count += 1

        # 3. Check for Rain / Weather Surge Alert
        weather_info = weather_service.get_current_weather()
        if weather_info.get("is_available") and weather_info.get("rain_probability", 0) >= 70:
            title = f"Rain Surge Alert: {weather_info['city']}"
            existing = db.query(Notification).filter(Notification.title == title, Notification.is_read == False).first()
            if not existing:
                notif = Notification(
                    id=f"notif-{str(uuid.uuid4())[:8]}",
                    type="opportunity",
                    priority="OPPORTUNITY",
                    title=title,
                    time_label="Today",
                    reason=f"High probability of rain ({weather_info['rain_probability']}%) detected in {weather_info['city']}.",
                    recommended_action="Prepare +15% additional hot beverage and soup batches for anticipated demand surge.",
                    is_read=False,
                )
                db.add(notif)
                new_alerts_count += 1

        # 4. Check for Holiday Alert
        holiday_info = holiday_service.check_is_holiday(today)
        if holiday_info.get("is_available") and holiday_info.get("is_holiday"):
            title = f"Holiday Footfall Surge: {holiday_info.get('holiday_name')}"
            existing = db.query(Notification).filter(Notification.title == title, Notification.is_read == False).first()
            if not existing:
                notif = Notification(
                    id=f"notif-{str(uuid.uuid4())[:8]}",
                    type="opportunity",
                    priority="HIGH",
                    title=title,
                    time_label="Today",
                    reason=f"Public holiday ({holiday_info.get('holiday_name')}) detected today.",
                    recommended_action="Increase dining hall seating arrangement and prep safety buffer.",
                    is_read=False,
                )
                db.add(notif)
                new_alerts_count += 1

        if new_alerts_count > 0:
            db.commit()

        return new_alerts_count

    def get_notifications(self, db: Session, unread_only: bool = False, limit: int = 50) -> List[Notification]:
        # Generate any new condition-based alerts first
        self.generate_operational_alerts(db)

        query = db.query(Notification)
        if unread_only:
            query = query.filter(Notification.is_read == False)

        return query.order_by(Notification.created_at.desc()).limit(limit).all()

    def mark_as_read(self, notification_id: str, db: Session) -> Optional[Notification]:
        notif = db.query(Notification).filter(Notification.id == notification_id).first()
        if notif:
            notif.is_read = True
            db.commit()
            db.refresh(notif)
            return notif
        return None

    def mark_all_as_read(self, db: Session) -> int:
        updated = db.query(Notification).filter(Notification.is_read == False).update({"is_read": True})
        db.commit()
        return updated


notification_service = NotificationService()
