# SmartServe AI — Production Deployment & Operational Runbook

This document provides exact instructions for provisioning, running database migrations, deploying, and maintaining the SmartServe AI backend and frontend stack in a production environment.

---

## 1. Environment Configuration

### Backend (.env)
Create `backend/.env` based on `backend/.env.example`:

```env
# Server Configuration
PROJECT_NAME="SmartServe AI Backend"
API_V1_STR="/api/v1"
SECRET_KEY="generate-a-secure-random-32-character-secret"
ACCESS_TOKEN_EXPIRE_MINUTES=60
DEBUG=False

# Production CORS Allowed Origins
BACKEND_CORS_ORIGINS=["https://yourdomain.com", "http://localhost:5173"]

# Production PostgreSQL Database URL
DATABASE_URL="postgresql+psycopg2://username:password@postgres-host:5432/smartserve_db"

# Weather API (OpenWeatherMap)
OPENWEATHERMAP_API_KEY="your_openopenweathermap_api_key"
RESTAURANT_CITY="Bengaluru"
RESTAURANT_LAT=12.9716
RESTAURANT_LON=77.5946

# Holiday API
DEFAULT_COUNTRY_CODE="IN"
DEFAULT_REGION_CODE="KA"

# LLM Copilot API
LLM_API_KEY="your_llm_api_key"
LLM_PROVIDER="gemini"
LLM_MODEL="gemini-1.5-flash"
```

### Frontend (.env.production)
Create `.env.production` at root directory:

```env
VITE_API_URL="https://api.yourdomain.com"
VITE_USE_MOCK_DATA="false"
```

---

## 2. Database Migration Commands (Alembic)

Run database migrations against the production PostgreSQL database:

```bash
# Set PYTHONPATH and database URL
export PYTHONPATH=backend
export DATABASE_URL="postgresql+psycopg2://username:password@postgres-host:5432/smartserve_db"

# Apply all Alembic migrations to latest schema revision
cd backend
alembic upgrade head
```

To rollback a migration if needed:
```bash
alembic downgrade -1
```

---

## 3. Docker Deployment Commands

### Option A: Docker Compose (Single Host / VPS / EC2)
```bash
# Build and start PostgreSQL + FastAPI Backend
docker compose up -d --build

# Verify container status
docker compose ps

# Inspect logs
docker compose logs -f backend
```

### Option B: Cloud Container Deployment (GCP Cloud Run / AWS ECS / Render)
1. Build container:
   ```bash
   docker build -t gcr.io/your-gcp-project/smartserve-backend:latest .
   ```
2. Push container to registry:
   ```bash
   docker push gcr.io/your-gcp-project/smartserve-backend:latest
   ```
3. Deploy container specifying port `8000` and health endpoint `/ready`.

---

## 4. Frontend Production Build & Hosting

```bash
# Install frontend dependencies
npm install

# Build static production bundle
npm run build
```

The output `dist/` directory can be deployed directly to Vercel, Netlify, Cloudflare Pages, or S3 + CloudFront.

---

## 5. Health & Readiness Verification

- **Liveness Check**: `GET /health` -> Returns `{ "status": "ok" }`
- **Readiness Check**: `GET /ready` -> Returns `{ "status": "ready", "database": "connected" }` (Returns HTTP 503 if DB is unreachable).
