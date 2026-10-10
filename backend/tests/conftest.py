import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

import app.models
from app.main import app
from app.core.database import Base, get_db
from app.db.init_db import init_db

SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

test_engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db

# Initialize database schema and seed data
Base.metadata.create_all(bind=test_engine)
db = TestingSessionLocal()
init_db(db)
db.close()

from app.core.security import create_access_token

# Shared TestClient instance configured with valid test JWT token
client = TestClient(app)
valid_test_token = create_access_token(subject="manager@smartserve.ai")
client.headers.update({"Authorization": f"Bearer {valid_test_token}"})


@pytest.fixture
def auth_headers():
    token = create_access_token(subject="manager@smartserve.ai")
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def test_client():
    c = TestClient(app)
    c.headers.update({"Authorization": f"Bearer {valid_test_token}"})
    return c


@pytest.fixture
def unauth_client():
    return TestClient(app)
