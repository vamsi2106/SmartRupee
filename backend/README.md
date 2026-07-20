# SmartRupee — Agentic Debt Advisory Backend for Gig Workers

> **Production-grade FastAPI backend implementing a 3-stage agentic debt payoff pipeline tailored for gig economy workers in India.**

---

## 🌟 Architectural Differentiator: 3-Stage Pipeline

Generic budgeting applications provide static advice that ignores income volatility. SmartRupee implements a strict 3-stage pipeline separating deterministic math from AI decisions:

```
[Incoming Financial Data]
          │
          ▼
┌─────────────────────────────────────────┐
│ Stage 1: Deterministic Compute (Pure)   │
│ - Average Income & Volatility (% CV)   │
│ - Monthly Cash Surplus                  │
└────────────────────┬────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────┐
│ Stage 2: Strategy Agent (Gemini AI)     │
│ - Evaluates Volatility & Risk           │
│ - Chooses AVALANCHE vs. SNOWBALL        │
└────────────────────┬────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────┐
│ Stage 3: Explain Agent (Gemini AI)      │
│ - Empathetic plain-language steps       │
│ - Volatility-tailored emergency buffer  │
└────────────────────┬────────────────────┘
                     │
                     ▼
  [MongoDB Persistence & API Response]
```

---

## 📁 Repository Structure

```
smartrupee/
├── app/
│   ├── main.py                  # FastAPI app init, CORS, static routes
│   ├── config.py                # Pydantic-settings configuration
│   ├── api/
│   │   └── routes/
│   │       ├── analyze.py       # POST /api/analyze endpoint
│   │       └── history.py       # GET /api/history endpoint
│   ├── schemas/
│   │   └── analyze.py           # Pydantic v2 schemas
│   ├── core/
│   │   ├── finance_engine.py    # Stage 1: Pure deterministic compute
│   │   ├── db.py                # Async MongoDB Motor connection
│   │   └── exceptions.py        # Custom domain exceptions
│   ├── services/
│   │   └── gemini_client.py     # Injectable wrapped Gemini client
│   ├── agents/
│   │   ├── strategy_agent.py    # Stage 2: Gemini strategy selector
│   │   └── explain_agent.py     # Stage 3: Gemini action plan generator
│   └── graph/
│       └── flow.py              # Pipeline orchestrator
├── static/
│   └── index.html               # Interactive Tailwind CSS test dashboard
├── tests/
│   └── test_finance_engine.py   # Pytest unit tests for Stage 1 logic
├── Dockerfile                   # Azure Web App / Container setup
├── startup.sh                   # Azure Web App startup script
├── requirements.txt
├── .env.example
└── README.md
```

---

## 🚀 Quickstart (Local Development)

### 1. Prerequisites
- Python 3.11+
- Google Gemini API Key ([Get Key](https://aistudio.google.com/))
- MongoDB Atlas URI ([Get Free Connection](https://www.mongodb.com/cloud/atlas))

### 2. Environment Setup
Create a `.env` file in the root directory:
```bash
cp .env.example .env
```
Fill in your keys:
```env
GEMINI_API_KEY=your_gemini_api_key_here
MONGO_URI=mongodb+srv://username:password@cluster0.xxx.mongodb.net/smartrupee?retryWrites=true&w=majority
```

### 3. Install Dependencies & Run Tests
```bash
pip install -r requirements.txt
pytest
```

### 4. Start Server
```bash
uvicorn app.main:app --reload
```

Open your browser to:
- **Interactive UI**: `http://localhost:8000/`
- **Swagger API Docs**: `http://localhost:8000/docs`

---

## ☁️ Azure Web App Deployment Guide

### Option 1: Deploy using Azure App Service (Python 3.11)
1. Login to Azure CLI:
   ```bash
   az login
   ```
2. Create App Service Plan & Web App:
   ```bash
   az group create --name SmartRupeeRG --location centralindia
   az appservice plan create --name SmartRupeePlan --resource-group SmartRupeeRG --sku F1 --is-linux
   az webapp create --resource-group SmartRupeeRG --plan SmartRupeePlan --name smartrupee-api --runtime "PYTHON:3.11"
   ```
3. Set Environment Variables on Azure:
   ```bash
   az webapp config appsettings set --resource-group SmartRupeeRG --name smartrupee-api --settings \
     GEMINI_API_KEY="your_gemini_key" \
     MONGO_URI="your_mongo_uri" \
     SCM_DO_BUILD_DURING_DEPLOYMENT="true"
   ```
4. Set Startup Command:
   ```bash
   az webapp config set --resource-group SmartRupeeRG --name smartrupee-api --startup-file "startup.sh"
   ```
5. Deploy Code via ZIP / Git:
   ```bash
   az webapp up --resource-group SmartRupeeRG --name smartrupee-api
   ```

### Option 2: Deploy Containerized Web App via Azure Container Registry (ACR)
```bash
az acr create --resource-group SmartRupeeRG --name smartrupeeacr --sku Basic
az acr build --registry smartrupeeacr --image smartrupee-backend:v1 .
az webapp create --resource-group SmartRupeeRG --plan SmartRupeePlan --name smartrupee-api --deployment-container-image-name smartrupeeacr.azurecr.io/smartrupee-backend:v1
```

---

## 🧪 API Reference

### `POST /api/analyze`
**Request Payload:**
```json
{
  "income_entries": [12000, 18000, 9000, 22000],
  "monthly_expenses": 14000,
  "debts": [
    { "name": "Credit Card", "amount": 25000, "rate": 24.0 },
    { "name": "Friend Loan", "amount": 8000, "rate": 0.0 }
  ]
}
```

**Response Payload:**
```json
{
  "avg_income": 15250.0,
  "volatility_pct": 36.4,
  "surplus": 1250.0,
  "risk_level": "HIGH",
  "chosen_strategy": "SNOWBALL",
  "strategy_reasoning": "Due to high income volatility (36.4%), clearing smaller debts first builds momentum and reduces monthly commitments quickly.",
  "ordered_debts": [
    { "name": "Friend Loan", "amount": 8000, "rate": 0, "payoff_order": 1 },
    { "name": "Credit Card", "amount": 25000, "rate": 24, "payoff_order": 2 }
  ],
  "action_plan": [
    "1. Reserve ₹1,000 into a rainy-day buffer...",
    "2. Focus surplus on Friend Loan first...",
    "3. Pay minimum on Credit Card...",
    "4. Roll over cleared payments to Credit Card!"
  ]
}
```
