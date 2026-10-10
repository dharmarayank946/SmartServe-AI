from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr
from app.core.security import create_access_token, verify_password, get_password_hash

router = APIRouter()


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict


@router.post("/login", response_model=TokenResponse)
def login(credentials: LoginRequest):
    """
    Authenticate restaurant manager credentials and issue JWT access token.
    (Phase 1 security foundation endpoint)
    """
    # Demo credentials check or validation structure
    demo_email = "manager@smartserve.ai"
    demo_hashed_pass = get_password_hash("password123")

    if credentials.email != demo_email or not verify_password(
        credentials.password, demo_hashed_pass
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(subject=credentials.email)

    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user={
            "id": "mgr-001",
            "name": "SmartServe Manager",
            "email": credentials.email,
            "role": "Restaurant Manager",
            "branch_id": "HYD-BLR-04",
        },
    )
