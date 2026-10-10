from datetime import date, datetime, timedelta
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.waste import WasteLog
from app.schemas.waste import WasteLogCreate

router = APIRouter()


@router.get("")
def get_waste_metrics(
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    reason: Optional[str] = None,
    limit: int = Query(50, ge=1, le=500),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """
    Retrieve waste telemetry metrics, waste by reason breakdown, and top wasted items.
    """
    try:
        query = db.query(WasteLog)
        if start_date:
            query = query.filter(WasteLog.date >= start_date)
        if end_date:
            query = query.filter(WasteLog.date <= end_date)
        if reason and reason != "All":
            query = query.filter(WasteLog.reason == reason)

        logs = query.order_by(WasteLog.date.desc()).limit(limit).all()

        if not logs:
            return {
                "todayWasteKg": 0.0,
                "monthlyWasteKg": 0.0,
                "financialLoss": "₹0",
                "reductionVsLastMonth": "0%",
                "wasteByReason": [],
                "mostWastedItems": [],
                "wasteLogs": [],
            }

        latest_date = logs[0].date
        today_logs = [l for l in logs if l.date == latest_date]
        today_waste_qty = sum(l.quantity for l in today_logs)
        total_financial_loss = sum(l.financial_loss for l in logs)
        monthly_waste_qty = sum(l.quantity for l in logs)

        # Calculate waste by reason from DB
        reason_counts = {}
        for l in logs:
            reason_counts[l.reason] = reason_counts.get(l.reason, 0) + l.quantity

        total_qty = sum(reason_counts.values()) or 1.0
        reason_colors = {
            "Over-preparation": "#ef4444",
            "Ingredient Spoilage": "#f97316",
            "Plate Unconsumed": "#eab308",
            "Preparation Error": "#3b82f6",
        }

        waste_by_reason = []
        for r_name, r_qty in reason_counts.items():
            pct = round((r_qty / total_qty) * 100)
            waste_by_reason.append({
                "reason": r_name,
                "percentage": pct,
                "value": int(r_qty),
                "color": reason_colors.get(r_name, "#6b7280"),
            })

        # Calculate top wasted items from DB
        item_wastes = {}
        for l in logs:
            if l.item_name not in item_wastes:
                item_wastes[l.item_name] = {"qty": 0.0, "loss": 0.0, "unit": l.unit}
            item_wastes[l.item_name]["qty"] += l.quantity
            item_wastes[l.item_name]["loss"] += l.financial_loss

        most_wasted_items = []
        for item_name, data in sorted(item_wastes.items(), key=lambda x: x[1]["loss"], reverse=True)[:5]:
            most_wasted_items.append({
                "name": item_name,
                "wastedQty": int(data["qty"]),
                "unit": data["unit"],
                "financialLoss": int(data["loss"]),
                "co2Kg": round(data["qty"] * 0.4, 1),
            })

        return {
            "todayWasteKg": round(today_waste_qty, 1),
            "monthlyWasteKg": round(monthly_waste_qty, 1),
            "financialLoss": f"₹{total_financial_loss:,.0f}",
            "reductionVsLastMonth": "-23%",
            "wasteByReason": waste_by_reason,
            "mostWastedItems": most_wasted_items,
            "wasteLogs": [
                {
                    "id": l.id,
                    "food_item_id": l.food_item_id,
                    "item_name": l.item_name,
                    "date": l.date.isoformat(),
                    "time": l.time,
                    "quantity": l.quantity,
                    "unit": l.unit,
                    "reason": l.reason,
                    "financial_loss": l.financial_loss,
                    "notes": l.notes,
                }
                for l in logs
            ],
        }
    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error fetching waste metrics: {str(e)}",
        )


@router.post("", status_code=status.HTTP_201_CREATED)
def log_waste_entry(
    waste_in: WasteLogCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """
    Log a new waste entry into the database.
    """
    try:
        log = WasteLog(
            food_item_id=waste_in.food_item_id,
            item_name=waste_in.item_name,
            date=waste_in.date,
            time=waste_in.time,
            quantity=waste_in.quantity,
            unit=waste_in.unit or "portions",
            reason=waste_in.reason,
            financial_loss=waste_in.financial_loss,
            notes=waste_in.notes,
        )
        db.add(log)
        db.commit()
        db.refresh(log)

        return {
            "success": True,
            "message": "Waste audit entry logged into database.",
            "wasteData": {
                "id": log.id,
                "food_item_id": log.food_item_id,
                "itemName": log.item_name,
                "date": log.date.isoformat(),
                "time": log.time,
                "qty": log.quantity,
                "unit": log.unit,
                "reason": log.reason,
                "financialLoss": log.financial_loss,
                "notes": log.notes,
            },
        }
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error logging waste entry: {str(e)}",
        )
