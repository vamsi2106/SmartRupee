# 💰 SmartRupee — Agentic Volatility-Aware Debt Advisory Platform for Indian Gig Workers

[![NxtWave Hackathon 2026](https://img.shields.io/badge/Hackathon-Idea2Impact_2026-brightgreen)](https://forms.ccbp.in/acad-online-hackathon-project-submission)
[![Theme](https://img.shields.io/badge/Theme_1-Sustainability_%26_Social_Impact-blue)](#-theme--problem-alignment)
[![Python](https://img.shields.io/badge/Backend-FastAPI_3.11+-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/Frontend-React_18_Vite-61DAFB?logo=react)](https://reactjs.org/)
[![Google Gemini](https://img.shields.io/badge/AI_Model-Google_Gemini_1.5_/_2.0-4285F4?logo=google)](https://aistudio.google.com/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB_Atlas-47A248?logo=mongodb)](https://www.mongodb.com/cloud/atlas)

> **SmartRupee** is a production-grade, full-stack AI financial platform built for **50+ million Indian gig economy workers** (delivery partners for Swiggy/Zomato/Zepto, rideshare drivers for Uber/Ola, and micro-freelancers). It replaces static salary assumptions with **income volatility mathematical risk modeling ($\text{CV}\%$)** and a **3-stage agentic pipeline** powered by Google Gemini AI.

---

## 📌 Submission Quick Links

- 📄 **[Problem Statement & Pitch Document](PROBLEM_STATEMENT_AND_PITCH.md)**
- 🏆 **[Hackathon Submission Form Guide & Pre-filled Responses](SUBMISSION_KIT.md)**
- 📘 **[Complete Product & API Documentation](SMARTRUPEE_PRODUCT_AND_API_DOCS.md)**

## 🔑 Evaluator Demo Account & Credentials

To test the application instantly without filling out registration forms, use the pre-configured Demo Account:

| Credential | Value |
| :--- | :--- |
| **Email** | `ramesh.demo@smartrupee.in` |
| **Password** | `DemoPassword123!` |
| **User Profile** | **Ramesh Kumar** (Zomato Rider, Bengaluru) |
| **Pre-populated Data** | Pre-loaded with 3-Stage Payoff Strategy & 4 Expense Logs |

> 🛡️ **AI Usage Quota Protection**: To protect Gemini API credit costs during evaluation, each user account is allowed **up to 5 free AI analysis runs**. The system enforces an HTTP 429 rate limit if a user exceeds 5 analysis runs.

---

## 🎯 Theme & Problem Alignment

- **Hackathon Theme**: **Theme 1 — Sustainability & Social Impact**
- **Domain Focus**: Financial Inclusion, Social Welfare & Informal Economy Protection
- **The Core Problem**: 
  Over 50M gig workers in India experience weekly income fluctuations of **30% to 60%**. Generic budgeting tools advise users to throw 100% of excess cash at debt payoff. When a lean income week hits, having zero cash reserves forces workers into predatory informal debt (local moneylenders charging 60–120% APR). SmartRupee prevents this debt relapse cycle.

---

## 🌟 Architectural Differentiator: 3-Stage Pipeline

Generic budgeting applications provide static advice that ignores income volatility. SmartRupee implements a strict 3-stage pipeline separating **pure deterministic math** from **AI strategic decisions**:

```
 ┌────────────────────────────────────────────────────────┐
 │   Stage 1: Pure Deterministic Compute (Python Engine)  │
 │   - Calculates Mean Earnings & Volatility (% CV)       │
 │   - Computes Monthly Net Surplus & Baseline Expenses   │
 └───────────────────────────┬────────────────────────────┘
                             │ (Guaranteed 100% Math Accuracy - Zero AI Math Errors)
                             ▼
 ┌────────────────────────────────────────────────────────┐
 │   Stage 2: Strategy Agent (Google Gemini AI)           │
 │   - Evaluates Volatility Risk Level (LOW, MED, HIGH)   │
 │   - High Volatility (>30% CV) ──► SNOWBALL (Quick Wins)│
 │   - Low Volatility (<30% CV)  ──► AVALANCHE (Min Interest)
 └───────────────────────────┬────────────────────────────┘
                             │
                             ▼
 ┌────────────────────────────────────────────────────────┐
 │   Stage 3: Explain Agent (Google Gemini AI)            │
 │   - Automatically Reserves Volatility Emergency Buffer  │
 │   - Empathetic Plain-Language Actionable Steps         │
 │   - Eliminates Financial Jargon & Jargon Confusion     │
 └───────────────────────────┬────────────────────────────┘
                             │
                             ▼
         [MongoDB Atlas Persistence & Response API]
```

---

## ✨ Key Features

1. **Volatility Metric Calculation ($\text{CV}\%$)**: Calculates standard deviation over mean income to measure true volatility risk rather than naive average earnings.
2. **Rainy-Day Emergency Buffer Protection**: Dynamic buffer calculation (15–25% of cash surplus) reserved *before* debt payoff allocation, protecting workers from relapse.
3. **Risk-Tailored Strategy Choice**:
   - **Debt Snowball**: Clears small loans first to rapidly eliminate monthly obligations and build psychological momentum.
   - **Debt Avalanche**: Focuses surplus on highest-interest debts when income is stable.
4. **Informal & Formal Debt Co-Existence**: Seamlessly manages micro-debts (friends, moneylenders) alongside credit cards and bank loans.
5. **AI Natural Language Expense Inferencing**: Automatically parses plain-text expenses (*"Petrol HP Bunk ₹350"*) into categories with real-time budget warnings.
6. **JWT Auth & Historical Analysis Timeline**: Secure user login with full analysis history stored in MongoDB Atlas.

---

## 📁 Repository Structure

```
nxtwave-hackthon/
├── PROBLEM_STATEMENT_AND_PITCH.md     # Official Hackathon Pitch Document
├── SUBMISSION_KIT.md                  # Pre-filled official submission form responses
├── SMARTRUPEE_PRODUCT_AND_API_DOCS.md # Product Overview & API Reference
├── backend/                           # FastAPI Python Backend
│   ├── app/
│   │   ├── main.py                    # FastAPI initialization, CORS & router registration
│   │   ├── config.py                  # Pydantic v2 settings & environment management
│   │   ├── api/routes/                # REST Controllers (auth, analyze, expenses, history)
│   │   ├── core/                      # Stage 1 Finance Math Engine, DB & Security
│   │   ├── services/                  # Gemini Client Wrapper & DB Service
│   │   ├── agents/                    # Stage 2 Strategy Agent & Stage 3 Explain Agent
│   │   └── graph/                     # LangGraph 3-Stage Pipeline Orchestrator
│   ├── tests/                         # Pytest unit tests (Auth, Expenses, Finance Engine)
│   ├── Dockerfile                     # Deployment container setup
│   ├── requirements.txt               # Backend dependencies
│   └── startup.sh                     # Azure/Cloud startup script
├── frontend/                          # React + Vite Frontend
│   ├── src/
│   │   ├── components/                # UI Components (AdvisoryView, ExpenseView, HistoryView, LandingPage)
│   │   ├── services/                  # Axios API Service Layer
│   │   └── hooks/                     # Custom React Hooks
│   ├── package.json                   # Node.js dependencies
│   └── vite.config.js                 # Vite bundler configuration
└── .gitignore                         # Master root git ignore
```

---

## 🚀 Quickstart (Local Development)

### 1. Prerequisites
- **Python 3.11+**
- **Node.js 18+ & npm**
- **Google Gemini API Key** ([Get Key at AI Studio](https://aistudio.google.com/))
- **MongoDB Atlas Connection URI** ([Get Free Cluster](https://www.mongodb.com/cloud/atlas))

---

### 2. Backend Setup
1. Open terminal in the `backend/` directory:
   ```bash
   cd backend
   ```
2. Create virtual environment & install dependencies:
   ```bash
   python3 -m venv venv
   source venv/bin/activate    # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```
3. Create a `.env` file in `backend/`:
   ```env
   GEMINI_API_KEY=your_google_gemini_api_key
   MONGO_URI=mongodb+srv://username:password@cluster0.xxx.mongodb.net/smartrupee?retryWrites=true&w=majority
   ENV=development
   PORT=8000
   ```
4. Run Unit Tests (100% passing):
   ```bash
   PYTHONPATH=. pytest
   ```
5. Start FastAPI Server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
   - Server running at: `http://localhost:8000`
   - Interactive Swagger API Docs: `http://localhost:8000/docs`

---

### 3. Frontend Setup
1. Open a new terminal in the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies & start Vite dev server:
   ```bash
   npm install
   npm run dev
   ```
3. Open browser at: `http://localhost:5173`

---

## 🧪 Verification & Testing

Both frontend and backend are fully tested:

```bash
# Backend pytest suite (15/15 tests passing)
cd backend && PYTHONPATH=. ./venv/bin/pytest

# Frontend production bundle test
cd frontend && npm run build
```

---

## ☁️ Deployment Guide

### Option 1: Deploy on Render + Vercel (Recommended - Free Tier)
- **Backend (Render)**:
  - Create new Web Service from GitHub repo.
  - Root Directory: `backend`
  - Build Command: `pip install -r requirements.txt`
  - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
  - Set Environment Variables: `GEMINI_API_KEY`, `MONGO_URI`.

- **Frontend (Vercel)**:
  - Import repository on Vercel.
  - Root Directory: `frontend`
  - Build Command: `npm run build`
  - Output Directory: `dist`
  - Set Environment Variable: `VITE_API_BASE_URL` = Render backend URL.

---

## 📜 License & Acknowledgments

Built with ❤️ for **NxtWave Idea2Impact Online Hackathon 2026**.  
Empowering Indian gig economy workers through ethical, volatility-aware AI financial intelligence.
