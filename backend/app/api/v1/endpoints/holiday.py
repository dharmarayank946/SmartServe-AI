from datetime import date
from typing import Optional
from fastapi import APIRouter, Depends, Query, status

from app.core.security import get_current_user
from app.schemas.external_services import HolidayResponse, HolidayCheckResponse
from app.services.holiday_service import holiday_service

router = APIRouter()


@router.get("", response_model=HolidayResponse, status_code=status.HTTP_200_OK)
def get_holidays(
    year: Optional[int] = Query(None, description="Year to fetch public holidays for (defaults to current year)"),
    country_code: Optional[str] = Query(None, description="ISO two-letter country code (defaults to IN)"),
    current_user: dict = Depends(get_current_user),
):
    """
    Retrieve public holidays for a configured country and year.
    Supports India (IN) and regional configuration.
    """
    target_year = year or date.today().year
    data = holiday_service.get_public_holidays(year=target_year, country_code=country_code)
    return data


@router.get("/check", response_model=HolidayCheckResponse, status_code=status.HTTP_200_OK)
def check_holiday(
    check_date: date = Query(..., alias="date", description="Date to verify if public holiday"),
    country_code: Optional[str] = Query(None, description="Country code (defaults to IN)"),
    region_code: Optional[str] = Query(None, description="Region code (defaults to KA)"),
    current_user: dict = Depends(get_current_user),
):
    """
    Check whether a specific date is a public holiday in the configured country and region.
    """
    data = holiday_service.check_is_holiday(target_date=check_date, country_code=country_code, region_code=region_code)
    return data
