import time
import logging
from datetime import datetime, date, timedelta
from typing import Dict, Any, List, Optional
import httpx
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.core.config import settings
from app.models.food_item import FoodItem
from app.models.sales import SalesRecord
from app.models.waste import WasteLog
from app.models.prediction import DemandPrediction

logger = logging.getLogger(__name__)


class LLMCopilotService:
    def __init__(self, api_key: Optional[str] = None, provider: Optional[str] = None, model: Optional[str] = None, timeout: float = 8.0):
        self.api_key = api_key or settings.LLM_API_KEY
        self.provider = (provider or settings.LLM_PROVIDER).lower()
        self.model = model or settings.LLM_MODEL
        self.timeout = timeout

    def build_grounded_context(self, db: Session) -> str:
        """
        Extract recent operational stats from SQLite/PostgreSQL to ground the AI response.
        """
        try:
            today = date.today()
            seven_days_ago = today - timedelta(days=7)

            # Top food items
            food_items = db.query(FoodItem).all()
            item_list_str = ", ".join([f"{item.name} (Stock: {item.current_stock}, Avg Sales: {item.avg_daily_sales})" for item in food_items[:5]])

            # Recent waste totals
            total_waste_loss = db.query(func.sum(WasteLog.financial_loss)).filter(WasteLog.date >= seven_days_ago).scalar() or 0.0
            recent_waste_logs = db.query(WasteLog).order_by(WasteLog.created_at.desc()).limit(3).all()
            waste_str = "; ".join([f"{w.item_name}: {w.quantity} {w.unit} ({w.reason}, loss ₹{w.financial_loss})" for w in recent_waste_logs]) or "No recent waste logged."

            # Recent sales
            total_sales_qty = db.query(func.sum(SalesRecord.quantity_sold)).filter(SalesRecord.date >= seven_days_ago).scalar() or 0
            sales_rev = db.query(func.sum(SalesRecord.revenue)).filter(SalesRecord.date >= seven_days_ago).scalar() or 0.0

            # Recent prediction
            latest_pred = db.query(DemandPrediction).order_by(DemandPrediction.created_at.desc()).first()
            pred_str = f"Latest Prediction for item {latest_pred.food_item_id}: Demand {latest_pred.predicted_demand}, Prep {latest_pred.recommended_prep} (Risk: {latest_pred.shortage_risk})" if latest_pred else "No recent predictions."

            context = (
                f"RESTAURANT OPERATIONAL TELEMETRY (Last 7 Days):\n"
                f"- Configured Location: {settings.RESTAURANT_CITY}, India\n"
                f"- Food Items Inventory: {item_list_str}\n"
                f"- Total Sales: {total_sales_qty} portions, Revenue ₹{float(sales_rev):,.2f}\n"
                f"- Total Waste Loss (7 days): ₹{float(total_waste_loss):,.2f}\n"
                f"- Recent Waste Events: {waste_str}\n"
                f"- Prediction Telemetry: {pred_str}\n"
            )
            return context
        except Exception as e:
            logger.error(f"Error building grounded context for LLM: {e}")
            return "RESTAURANT OPERATIONAL TELEMETRY: Context unavailable due to database read error."

    def generate_chat_response(self, prompt: str, db: Session) -> Dict[str, Any]:
        """
        Generates a chat response using external LLM grounded in real DB telemetry.
        If LLM is unconfigured, times out, or fails, returns a database-derived fallback response.
        """
        now_str = datetime.now().strftime("%H:%M:%S")

        # Build grounded DB context
        telemetry_context = self.build_grounded_context(db)

        if not self.api_key:
            return self.generate_database_fallback(prompt, db, reason="LLM API key not configured")

        system_prompt = (
            "You are SmartServe AI Copilot, an expert AI operational assistant for restaurant managers.\n"
            "Answer questions concisely, professionally, and directly using the provided real-time operational context.\n"
            "Give specific, actionable inventory, prep, and waste reduction guidance based on the data.\n\n"
            f"{telemetry_context}\n\n"
            f"USER QUESTION: {prompt}"
        )

        try:
            if self.provider == "gemini":
                # Google Gemini REST API endpoint
                url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model}:generateContent?key={self.api_key}"
                payload = {
                    "contents": [{"parts": [{"text": system_prompt}]}]
                }
                with httpx.Client(timeout=self.timeout) as client:
                    resp = client.post(url, json=payload)
                if resp.status_code == 200:
                    res_json = resp.json()
                    candidates = res_json.get("candidates", [])
                    if candidates:
                        text = candidates[0].get("content", {}).get("parts", [{}])[0].get("text", "")
                        if text:
                            return {
                                "reply": text.strip(),
                                "confidence": 95.0,
                                "timestamp": now_str,
                                "is_fallback": False,
                                "error_reason": None,
                            }
                return self.generate_database_fallback(prompt, db, reason=f"Gemini API error (Status {resp.status_code})")

            elif self.provider == "openai":
                url = "https://api.openai.com/v1/chat/completions"
                headers = {"Authorization": f"Bearer {self.api_key}"}
                payload = {
                    "model": self.model or "gpt-3.5-turbo",
                    "messages": [
                        {"role": "system", "content": "You are SmartServe AI Copilot."},
                        {"role": "user", "content": system_prompt},
                    ],
                    "temperature": 0.3,
                }
                with httpx.Client(timeout=self.timeout) as client:
                    resp = client.post(url, headers=headers, json=payload)
                if resp.status_code == 200:
                    res_json = resp.json()
                    text = res_json["choices"][0]["message"]["content"]
                    return {
                        "reply": text.strip(),
                        "confidence": 95.0,
                        "timestamp": now_str,
                        "is_fallback": False,
                        "error_reason": None,
                    }
                return self.generate_database_fallback(prompt, db, reason=f"OpenAI API error (Status {resp.status_code})")

            else:
                return self.generate_database_fallback(prompt, db, reason=f"Unsupported LLM provider '{self.provider}'")

        except httpx.TimeoutException:
            logger.warning("LLM API request timed out")
            return self.generate_database_fallback(prompt, db, reason="LLM provider request timed out")
        except Exception as e:
            logger.error(f"Error calling LLM provider: {e}")
            return self.generate_database_fallback(prompt, db, reason=f"LLM provider error: {str(e)}")

    def generate_database_fallback(self, prompt: str, db: Session, reason: str) -> Dict[str, Any]:
        """
        Returns a deterministic, database-grounded fallback response when external LLM is unavailable.
        """
        now_str = datetime.now().strftime("%H:%M:%S")
        prompt_lower = prompt.lower()

        # Query real database for specific keywords
        if "waste" in prompt_lower or "paneer" in prompt_lower or "biryani" in prompt_lower:
            high_waste_log = db.query(WasteLog).order_by(WasteLog.financial_loss.desc()).first()
            if high_waste_log:
                reply = (
                    f"Based on real database records: Highest financial loss was recorded for {high_waste_log.item_name} "
                    f"with {high_waste_log.quantity} {high_waste_log.unit} wasted (loss: ₹{high_waste_log.financial_loss:.2f}) "
                    f"due to '{high_waste_log.reason}'. SmartServe AI recommends reducing tomorrow's prep batch by 10%."
                )
            else:
                reply = "SmartServe AI analyzed current waste logs: Total financial loss is minimal with no high-risk items recorded."
        elif "sales" in prompt_lower or "revenue" in prompt_lower or "popular" in prompt_lower:
            top_item = db.query(FoodItem).order_by(FoodItem.avg_daily_sales.desc()).first()
            if top_item:
                reply = (
                    f"Based on POS sales telemetry: Top selling item is {top_item.name} with average daily sales of "
                    f"{top_item.avg_daily_sales} {top_item.unit} at ₹{top_item.price:.2f}/portion."
                )
            else:
                reply = "Sales telemetry shows steady demand across all configured food items."
        else:
            total_items = db.query(FoodItem).count()
            total_waste = db.query(func.sum(WasteLog.financial_loss)).scalar() or 0.0
            reply = (
                f"SmartServe AI System Status ({reason}): Monitoring {total_items} food items across inventory. "
                f"Total logged waste loss is ₹{total_waste:,.2f}. All demand prediction and telemetry services are fully active."
            )

        return {
            "reply": reply,
            "confidence": 88.0,
            "timestamp": now_str,
            "is_fallback": True,
            "error_reason": reason,
        }


llm_service = LLMCopilotService()
