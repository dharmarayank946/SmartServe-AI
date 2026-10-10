from fastapi import FastAPI, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy import text

from app.api.v1.router import api_router
from app.core.config import settings
from app.core.database import SessionLocal, engine

# Initialize FastAPI App
app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
    version="1.0.0",
)

# Configure CORS Middleware for Vite Frontend & Development URLs
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Include API v1 Router
app.include_router(api_router, prefix=settings.API_V1_STR)


# Health Check Endpoint (Liveness)
@app.get("/health", tags=["System Health"])
def health_check():
    """
    Production Liveness Check Endpoint.
    Verifies FastAPI server process availability.
    """
    return {
        "status": "ok",
        "project": settings.PROJECT_NAME,
        "version": "1.0.0",
    }


# Readiness Check Endpoint
@app.get("/ready", tags=["System Health"])
def readiness_check(response: JSONResponse = None):
    """
    Production Readiness Check Endpoint.
    Verifies database connectivity before accepting load balancer traffic.
    Returns HTTP 503 if database connection fails.
    """
    try:
        db = SessionLocal()
        db.execute(text("SELECT 1"))
        db.close()
        return {
            "status": "ready",
            "database": "connected",
            "project": settings.PROJECT_NAME,
            "version": "1.0.0",
        }
    except Exception as e:
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={
                "status": "not_ready",
                "database": "error",
                "detail": str(e) if settings.DEBUG else "Database connection unavailable",
            },
        )



# Root Information Route
@app.get("/", tags=["System Information"])
def root_info():
    return {
        "message": "Welcome to SmartServe AI Backend API",
        "docs": "/docs",
        "health": "/health",
        "version": "1.0.0",
    }


# Custom Exception Handlers for Clean Errors
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": exc.detail,
            "status_code": exc.status_code,
        },
        headers=exc.headers,
    )


@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "error": "Internal Server Error",
            "details": str(exc) if settings.DEBUG else None,
            "status_code": 500,
        },
    )
