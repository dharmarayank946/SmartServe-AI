import time
import logging
from datetime import date
from typing import Dict, Any, List, Optional
import httpx

from app.core.config import settings

logger = logging.getLogger(__name__)

# In-memory holiday cache: key (year_country) -> (timestamp, list_of_holidays)
_HOLIDAY_CACHE: Dict[str, tuple[float, List[Dict[str, Any]]]] = {}


class HolidayService:
    def __init__(self, timeout: float = 5.0):
        self.timeout = timeout
        self.base_url = "https://date.nager.at/api/v3/PublicHolidays"

    def get_public_holidays(
        self,
        year: int,
        country_code: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Retrieve public holidays for a given year and country code (defaults to IN).
        Handles network errors, timeouts, and API provider failures gracefully.
        """
        code = (country_code or settings.DEFAULT_COUNTRY_CODE).upper()
        cache_key = f"{year}_{code}"

        # Check cache
        if cache_key in _HOLIDAY_CACHE:
            cached_time, cached_holidays = _HOLIDAY_CACHE[cache_key]
            if time.time() - cached_time < settings.HOLIDAY_CACHE_TTL_SECONDS:
                return {
                    "year": year,
                    "country_code": code,
                    "holidays": cached_holidays,
                    "count": len(cached_holidays),
                    "is_available": True,
                    "error_reason": None,
                }

        url = f"{self.base_url}/{year}/{code}"

        try:
            with httpx.Client(timeout=self.timeout) as client:
                response = client.get(url)

            if response.status_code == 200:
                raw_holidays = response.json()
                processed_holidays = []
                for h in raw_holidays:
                    processed_holidays.append({
                        "date": h.get("date"),
                        "local_name": h.get("localName"),
                        "name": h.get("name"),
                        "country_code": h.get("countryCode"),
                        "fixed": h.get("fixed", True),
                        "global": h.get("global", True),
                        "counties": h.get("counties"),
                        "types": h.get("types", []),
                    })

                _HOLIDAY_CACHE[cache_key] = (time.time(), processed_holidays)
                return {
                    "year": year,
                    "country_code": code,
                    "holidays": processed_holidays,
                    "count": len(processed_holidays),
                    "is_available": True,
                    "error_reason": None,
                }
            elif response.status_code == 404:
                return self._unavailable_response(year, code, f"Country code '{code}' or year {year} not supported (404)")
            elif response.status_code == 429:
                return self._unavailable_response(year, code, "Nager.Date API rate limit exceeded (429)")
            else:
                return self._unavailable_response(year, code, f"Provider error status {response.status_code}")

        except httpx.TimeoutException:
            logger.warning("Nager.Date API request timed out")
            return self._unavailable_response(year, code, "Request timed out")
        except httpx.HTTPError as e:
            logger.warning(f"Nager.Date HTTP error: {e}")
            return self._unavailable_response(year, code, f"HTTP error: {str(e)}")
        except Exception as e:
            logger.error(f"Unexpected holiday service error: {e}")
            return self._unavailable_response(year, code, f"Unexpected error: {str(e)}")

    def check_is_holiday(
        self,
        target_date: date,
        country_code: Optional[str] = None,
        region_code: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Check whether a specific prediction date is a public holiday in country/region.
        """
        res = self.get_public_holidays(year=target_date.year, country_code=country_code)
        date_str = target_date.isoformat()
        region = (region_code or settings.DEFAULT_REGION_CODE).upper()

        if not res["is_available"]:
            return {
                "date": date_str,
                "is_holiday": False,
                "holiday_name": None,
                "is_available": False,
                "error_reason": res["error_reason"],
            }

        for h in res["holidays"]:
            if h["date"] == date_str:
                # If regional counties filter exists, check if applicable
                counties = h.get("counties")
                if counties and isinstance(counties, list):
                    # Nager.Date counties format for region codes e.g. IN-KA
                    full_region_tag = f"{res['country_code']}-{region}"
                    if not any(c.upper() in [region, full_region_tag] for c in counties):
                        continue

                return {
                    "date": date_str,
                    "is_holiday": True,
                    "holiday_name": h.get("local_name") or h.get("name"),
                    "is_available": True,
                    "error_reason": None,
                }

        return {
            "date": date_str,
            "is_holiday": False,
            "holiday_name": None,
            "is_available": True,
            "error_reason": None,
        }

    def _unavailable_response(self, year: int, country_code: str, reason: str) -> Dict[str, Any]:
        return {
            "year": year,
            "country_code": country_code,
            "holidays": [],
            "count": 0,
            "is_available": False,
            "error_reason": reason,
        }


holiday_service = HolidayService()
