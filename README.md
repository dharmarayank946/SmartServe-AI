# 🍲 SmartServe AI — Intelligent Restaurant Intelligence SaaS Platform

> **Predict Demand. Prepare Smart. Reduce Waste.**

SmartServe AI is a commercial-grade, real-time AI restaurant operations and digital twin platform. It connects historical sales data, weather telemetry, regional events, and kitchen batching to predict food demand, optimize kitchen preparation schedules, and eliminate food waste.

---

## 🚀 Key Features

1. **AI Control Room & Digital Twin**: Real-time operational canvas monitoring customer flow, kitchen output, weather impact, and waste metrics live.
2. **Executive AI Dashboard**: High-level KPI indicators, ROI tracking, and zero-waste telemetry.
3. **Demand Prediction Engine**: Item-level ML demand forecasting with explainable factor decomposition (Historical sales, weather, day patterns, holidays).
4. **Preparation Management**: Dynamic batch scheduling transforming demand forecasts into precise kitchen cooking directives.
5. **Sales Intelligence**: POS integration, sales volume trends, and hourly order pattern analytics.
6. **Waste Tracking & Audits**: Financial loss telemetry, wasted portion audits, and CO2 emissions tracking.
7. **Analytics & Financial ROI**: Cost recovery metrics, profit impact analysis, and monthly ROI reports.
8. **Data & AI Learning Center**: Dataset quality scoring, connected REST data pipelines, and one-click model retraining.
9. **Restaurant Network**: Multi-location command center for managing chains, franchises, and cloud kitchens.
10. **Notifications & Alert Center**: Real-time operational risk detection, demand surge warnings, and automated AI briefings.
11. **SmartServe AI Copilot**: Floating conversational AI assistant available across all screens.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite 8, Tailwind CSS, Lucide Icons, Recharts
- **Design Tokens**: Custom CSS Design System with Deep Forest Green (`#1b4332`), Warm Cream (`#f4f6f0`), and Elegant Gold (`#d4af37`) AI accents
- **Backend Ready**: Centralized HTTP client supporting FastAPI (`http://localhost:8000`) & Simulated Mock Data Mode

---

## ⚡ Quick Start & Setup

### 1. Installation
Clone the repository and install dependencies:
```bash
npm install
```

### 2. Environment Configuration
Copy the example environment file:
```bash
cp .env.example .env
```

Set your environment variables in `.env`:
```env
VITE_API_URL=http://localhost:8000
VITE_USE_MOCK_DATA=true
```
- Set `VITE_USE_MOCK_DATA=true` to run offline in **Simulated AI Demo Mode**.
- Set `VITE_USE_MOCK_DATA=false` to connect to a live **FastAPI** backend endpoint.

### 3. Run Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

### 4. Build for Production
```bash
npm run build
```

---

## 📁 Project Structure

```
src/
├── components/            # Reusable UI Components
│   ├── AiChatFloatingBot.jsx  # Universal AI Copilot Assistant
│   ├── Navbar.jsx             # Top Header & Global Search Overlay
│   ├── Sidebar.jsx            # Collapsible Clean Sidebar
│   ├── StatCard.jsx           # Standard Metric Cards
│   ├── Modal.jsx              # Accessible Dialog Overlay
│   ├── DigitalTwinGraph.jsx   # Node Graph Visualizer
│   └── VisualFlow.jsx         # Pipeline Diagram
├── pages/                 # Main Application Views (15 Pages)
│   ├── AiControlRoom.jsx
│   ├── Dashboard.jsx
│   ├── DemandPrediction.jsx
│   ├── PrepRecommendation.jsx
│   ├── SalesData.jsx
│   ├── WasteTracking.jsx
│   ├── DataLearning.jsx
│   ├── Analytics.jsx
│   ├── AiInsights.jsx
│   ├── RestaurantNetwork.jsx
│   ├── NotificationsAlerts.jsx
│   ├── FoodManagement.jsx
│   ├── Settings.jsx
│   ├── Profile.jsx
│   └── LandingPage.jsx
├── services/              # Service Layer & API Clients
│   ├── api.js                 # Central HTTP Fetch Wrapper
│   ├── apiService.js          # Unified Service Aggregator & Local Storage
│   ├── dashboardService.js    # Executive Dashboard API
│   ├── salesService.js        # Sales Intelligence API
│   ├── predictionService.js   # ML Demand Prediction API
│   ├── preparationService.js  # Prep Schedule API
│   ├── wasteService.js        # Waste Audit API
│   ├── analyticsService.js    # Financial ROI API
│   ├── aiService.js           # AI Insights & Copilot Chat API
│   ├── restaurantService.js   # Multi-location Network API
│   ├── notificationService.js # Risk Alert System API
│   └── dataService.js         # Dataset & Training API
├── index.css              # Design System Utility Classes & Tokens
├── App.jsx                # Main Application Shell & Route Controller
└── main.jsx               # Entry Point
```

---

## 🤖 AI / ML Model Endpoint Interface (`POST /predict`)

When connected to FastAPI, `predictionService.js` sends:
```json
{
  "food_item": "Veg Biryani",
  "date": "2026-10-07",
  "day": "Friday",
  "historical_sales": 80,
  "weather": "Rainy",
  "temperature": 28,
  "rain_probability": 78,
  "holiday": false,
  "event": "Weekend Rush"
}
```

The FastAPI backend returns:
```json
{
  "predicted_demand": 92,
  "recommended_preparation": 98,
  "confidence": 94.2,
  "risk_level": "Low",
  "factors": [
    "Friday Peak Surge (+20%)",
    "Rainy Weather Impact (+15%)"
  ],
  "explanation": "AI model predicted 92 portions based on Friday footfall and 78% rain probability."
}
```

---

## 📜 License
SmartServe AI © 2026. All rights reserved.
