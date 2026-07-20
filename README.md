<div align="center">

  <br />
  <div style="background: linear-gradient(135deg, #059669 0%, #0d9488 100%); padding: 20px; border-radius: 20px; color: white;">
    <h1 style="font-size: 2.5rem; font-weight: 800; margin: 0;">💰 SmartRupee</h1>
    <h3 style="font-weight: 500; opacity: 0.95; margin-top: 5px;">Agentic Volatility-Aware Debt Advisory Platform for Indian Gig Workers</h3>
  </div>

  <br />

  <p>
    <b>Financial Inclusion & Informal Economy Debt Protection for 50M+ Delivery Partners, Drivers & Freelancers</b>
  </p>

  <p>
    <a href="https://forms.ccbp.in/acad-online-hackathon-project-submission"><img src="https://img.shields.io/badge/Hackathon-NxtWave_Idea2Impact_2026-brightgreen?style=for-the-badge&logo=google" alt="Hackathon"></a>
    <a href="#-theme--problem-alignment"><img src="https://img.shields.io/badge/Theme-1._Sustainability_%26_Social_Impact-blue?style=for-the-badge" alt="Theme"></a>
    <a href="https://fastapi.tiangolo.com/"><img src="https://img.shields.io/badge/Backend-FastAPI_3.11+-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI"></a>
    <a href="https://reactjs.org/"><img src="https://img.shields.io/badge/Frontend-React_18_Vite-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React"></a>
    <a href="https://aistudio.google.com/"><img src="https://img.shields.io/badge/AI_Engine-Google_Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Gemini"></a>
    <a href="https://www.mongodb.com/"><img src="https://img.shields.io/badge/Database-MongoDB_Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB"></a>
  </p>

  <p>
    <a href="#-evaluator-demo-account"><b>🔑 Demo Credentials</b></a> &nbsp;•&nbsp;
    <a href="PROBLEM_STATEMENT_AND_PITCH.md"><b>📄 Pitch Document</b></a> &nbsp;•&nbsp;
    <a href="SMARTRUPEE_PRODUCT_AND_API_DOCS.md"><b>📘 API Reference</b></a>
  </p>

</div>

---

<a name="-evaluator-demo-account"></a>
## 🔑 Evaluator Demo Account & Credentials

To test the application immediately without signing up for a new account:

<table width="100%">
  <tr>
    <td width="30%"><b>Demo Email</b></td>
    <td><code>ramesh.demo@smartrupee.in</code></td>
  </tr>
  <tr>
    <td><b>Demo Password</b></td>
    <td><code>DemoPassword123!</code></td>
  </tr>
  <tr>
    <td><b>User Profile</b></td>
    <td><b>Ramesh Kumar</b> (Zomato Delivery Partner, Bengaluru)</td>
  </tr>
  <tr>
    <td><b>Pre-Populated Data</b></td>
    <td>Pre-loaded with 3-Stage Payoff Strategy & 4 Expense Logs</td>
  </tr>
  <tr>
    <td><b>1-Click Login</b></td>
    <td>Click <b>"Instant Login as Ramesh (Zomato Rider)"</b> in the app login window</td>
  </tr>
</table>

> [!IMPORTANT]
> **AI Usage Quota Protection**: To protect Gemini API credit costs during evaluation, each user account is allowed **up to 5 free AI analysis runs**. The backend enforces an `HTTP 429` rate limit if an account exceeds 5 runs.

---

## 🎯 Theme & Problem Alignment

* **Hackathon Theme**: **Theme 1 — Sustainability & Social Impact**
* **Domain Focus**: Financial Inclusion, Informal Economy Protection & Micro-Welfare
* **The Core Problem**:
  Over 50M gig workers in India experience weekly income fluctuations of **30% to 60%**. Standard budgeting apps advise users to throw 100% of excess cash at debt payoff. When a lean income week hits, having zero cash reserves forces workers into predatory informal debt (local moneylenders charging 60–120% APR). SmartRupee prevents this debt relapse cycle.

---

## ⚡ The 3-Stage Agentic Debt Engine Architecture

SmartRupee decouples **pure deterministic financial compute** from **AI natural language strategy selection**:

<pre align="center">
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
 │   - High Volatility (&gt;30% CV) ──► SNOWBALL (Quick Wins)│
 │   - Low Volatility (&lt;30% CV)  ──► AVALANCHE (Min Interest)
 └───────────────────────────┬────────────────────────────┘
                             │
                             ▼
 ┌────────────────────────────────────────────────────────┐
 │   Stage 3: Explain Agent (Google Gemini AI)            │
 │   - Automatically Reserves Volatility Emergency Buffer │
 │   - Empathetic Plain-Language Actionable Steps         │
 │   - Eliminates Financial Jargon & Jargon Confusion     │
 └───────────────────────────┬────────────────────────────┘
                             │
                             ▼
         [MongoDB Atlas Persistence & Response API]
</pre>

---

## ✨ Key Features & Capabilities

<table width="100%">
  <tr>
    <td width="50%">
      <h3>📈 Volatility Risk Modeling ($\text{CV}\%$)</h3>
      Calculates coefficient of variation ($\frac{\sigma}{\mu}$) across weekly income payouts to measure true earnings unpredictability.
    </td>
    <td width="50%">
      <h3>☔ Rainy-Day Emergency Reserve</h3>
      Locks a cash safety buffer <i>before</i> allocating debt surplus, protecting gig workers from relapsing into informal loans.
    </td>
  </tr>
  <tr>
    <td>
      <h3>⚡ Adaptive Strategy Engine</h3>
      Dynamically selects <b>Snowball</b> (quick balance wins) for high-stress informal debts or <b>Avalanche</b> (interest reduction) for stable periods.
    </td>
    <td>
      <h3>🏷️ Smart Expense Auto-Tagging</h3>
      Auto-infers expense categories from plain text (e.g., <i>"Petrol HP Bunk ₹500"</i> ➔ <b>Fuel</b>) with threshold warnings.
    </td>
  </tr>
  <tr>
    <td>
      <h3>📱 Mobile-First 4-Step Wizard</h3>
      Hyper-compact native mobile UI built with Framer Motion slide transitions and 1-click Ramesh demo scenario.
    </td>
    <td>
      <h3>🛡️ Grounded Advice Guardrails</h3>
      Zero-hallucination prompt architecture bound strictly to Stage 1 math calculations.
    </td>
  </tr>
</table>

---

## 📁 Repository Structure

```text
nxtwave-hackthon/
├── README.md                          # Main Repository Overview & Setup Guide
├── PROBLEM_STATEMENT_AND_PITCH.md     # Official Hackathon Pitch Document
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
│   └── requirements.txt               # Backend dependencies
└── frontend/                          # React + Vite Frontend
    ├── src/
    │   ├── components/                # UI Components (AdvisoryView, ExpenseView, HistoryView, LandingPage)
    │   ├── services/                  # Axios API Service Layer
    │   └── hooks/                     # Custom React Hooks
    └── vite.config.js                 # Vite bundler configuration
```

---

## 🚀 Quickstart & Setup Guide

<details>
<summary><b>1. Prerequisites</b></summary>
<br />
<ul>
  <li><b>Python 3.11+</b></li>
  <li><b>Node.js 18+ & npm</b></li>
  <li><b>Google Gemini API Key</b> (<a href="https://aistudio.google.com/">Get API Key</a>)</li>
  <li><b>MongoDB Atlas Connection URI</b> (<a href="https://www.mongodb.com/cloud/atlas">Get Free Database</a>)</li>
</ul>
</details>

<details>
<summary><b>2. Backend Setup (FastAPI)</b></summary>
<br />
<pre><code>cd backend
python3 -m venv venv
source venv/bin/activate    # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Start Server
uvicorn app.main:app --reload --port 8000
</code></pre>
<ul>
  <li>Backend API: <code>http://localhost:8000</code></li>
  <li>Swagger Docs: <code>http://localhost:8000/docs</code></li>
</ul>
</details>

<details>
<summary><b>3. Frontend Setup (React + Vite)</b></summary>
<br />
<pre><code>cd frontend
npm install
npm run dev
</code></pre>
<ul>
  <li>Web App: <code>http://localhost:5173</code></li>
</ul>
</details>

---

## 🧪 Verification & Testing

Both frontend and backend include automated test suites:

```bash
# Run Backend Pytest Suite (15/15 Tests Passing)
cd backend && PYTHONPATH=. ./venv/bin/pytest

# Test Frontend Production Build
cd frontend && npm run build
```

---

<div align="center">
  <p>Built with ❤️ for <b>NxtWave Idea2Impact Online Hackathon 2026</b></p>
  <p><b>SmartRupee</b> — Empowering Indian gig economy workers through ethical AI financial intelligence.</p>
</div>
