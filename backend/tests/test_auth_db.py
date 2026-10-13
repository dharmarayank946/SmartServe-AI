import pytest
from datetime import timedelta
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.core.database import Base, get_db
from app.core.config import settings
from app.core.security import create_access_token, verify_password, get_password_hash
from app.models.user import User
from app.db.init_db import init_db


@pytest.fixture
def auth_db():
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    TestingSession = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base.metadata.create_all(bind=engine)
    db = TestingSession()

    # Pre-seed a known manager and regular test user
    manager = User(
        id="test-mgr-001",
        name="Primary Manager",
        email="manager@smartserve.ai",
        password_hash=get_password_hash("CorrectManagerPass123!"),
        role="Restaurant Manager",
        branch_id="HYD-BLR-04",
    )
    db.add(manager)
    db.commit()

    def override_db():
        session = TestingSession()
        try:
            yield session
        finally:
            session.close()

    app.dependency_overrides[get_db] = override_db
    yield db
    db.close()
    from tests.conftest import override_get_db
    app.dependency_overrides[get_db] = override_get_db


def test_auth_login_successful_real_db_user(auth_db):
    client = TestClient(app)
    res = client.post(
        "/api/v1/auth/login",
        json={"email": "manager@smartserve.ai", "password": "CorrectManagerPass123!"},
    )
    assert res.status_code == 200
    data = res.json()

    assert "access_token" in data
    assert data["token_type"] == "bearer"
    user_info = data["user"]
    assert user_info["id"] == "test-mgr-001"
    assert user_info["name"] == "Primary Manager"
    assert user_info["email"] == "manager@smartserve.ai"
    assert user_info["role"] == "Restaurant Manager"
    assert user_info["branch_id"] == "HYD-BLR-04"


def test_auth_login_case_insensitive_email(auth_db):
    client = TestClient(app)
    # Testing uppercase/mixed case email normalization
    res = client.post(
        "/api/v1/auth/login",
        json={"email": "MANAGER@SmartServe.AI", "password": "CorrectManagerPass123!"},
    )
    assert res.status_code == 200
    assert "access_token" in res.json()
    assert res.json()["user"]["email"] == "manager@smartserve.ai"


def test_auth_login_incorrect_password(auth_db):
    client = TestClient(app)
    res = client.post(
        "/api/v1/auth/login",
        json={"email": "manager@smartserve.ai", "password": "wrong_password_xyz"},
    )
    assert res.status_code == 401
    assert "WWW-Authenticate" in res.headers
    # Generic error without leaking whether email vs password was wrong
    assert res.json()["error"] == "Incorrect email or password"


def test_auth_login_unknown_email(auth_db):
    client = TestClient(app)
    res = client.post(
        "/api/v1/auth/login",
        json={"email": "unknown_intruder@smartserve.ai", "password": "anypassword"},
    )
    assert res.status_code == 401
    assert "WWW-Authenticate" in res.headers
    assert res.json()["error"] == "Incorrect email or password"


def test_jwt_token_validity_and_protected_access(auth_db):
    client = TestClient(app)

    # 1. Access without token should fail
    unauth_res = client.get("/api/v1/dashboard")
    assert unauth_res.status_code == 401

    # 2. Login to get token
    login_res = client.post(
        "/api/v1/auth/login",
        json={"email": "manager@smartserve.ai", "password": "CorrectManagerPass123!"},
    )
    token = login_res.json()["access_token"]

    # 3. Access with valid token succeeds
    headers = {"Authorization": f"Bearer {token}"}
    auth_res = client.get("/api/v1/dashboard", headers=headers)
    assert auth_res.status_code == 200


def test_init_db_idempotency_preserves_existing_user():
    # Fresh isolated engine
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    TestingSession = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base.metadata.create_all(bind=engine)
    db = TestingSession()

    # Create manager with customized pre-existing hash
    original_pass = "ExistingManagerOriginalSecret!"
    original_hash = get_password_hash(original_pass)
    custom_user = User(
        id="custom-001",
        name="Custom Manager",
        email="manager@smartserve.ai",
        password_hash=original_hash,
        role="Owner",
        branch_id="HYD-BLR-04",
    )
    db.add(custom_user)
    db.commit()

    # Run init_db multiple times
    settings.INITIAL_MANAGER_PASSWORD = "ShouldNotOverwriteExistingPass!"
    init_db(db)
    init_db(db)

    # Verify existing user is untouched
    persisted_user = db.query(User).filter_by(email="manager@smartserve.ai").first()
    assert persisted_user is not None
    assert persisted_user.id == "custom-001"
    assert persisted_user.name == "Custom Manager"
    assert persisted_user.role == "Owner"
    # Ensure password was NOT overwritten
    assert verify_password(original_pass, persisted_user.password_hash) is True
    assert verify_password("ShouldNotOverwriteExistingPass!", persisted_user.password_hash) is False

    # Verify no duplicate user was created
    user_count = db.query(User).filter(User.email.ilike("manager@smartserve.ai")).count()
    assert user_count == 1

    db.close()
