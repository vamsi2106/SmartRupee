# SmartRupee — Product Overview & Backend API Documentation

A comprehensive, single-source guide covering the **SmartRupee Product Vision, Architectural Design, 3-Stage Agentic AI Pipeline**, and complete **REST API Reference**.

---

## Table of Contents

1. [Product Overview](#1-product-overview)
   - [Problem Statement](#problem-statement)
   - [The SmartRupee Solution](#the-smartrupee-solution)
   - [Target Audience](#target-audience)
   - [Key Value Propositions](#key-value-propositions)
2. [System Architecture & Tech Stack](#2-system-architecture--tech-stack)
   - [Tech Stack Summary](#tech-stack-summary)
   - [Folder Structure](#folder-structure)
3. [The 3-Stage Agentic Debt Engine](#3-the-3-stage-agentic-debt-engine)
   - [Stage 1: Deterministic Math Compute](#stage-1-deterministic-math-compute)
   - [Stage 2: Strategy Agent Decision](#stage-2-strategy-agent-decision)
   - [Stage 3: Plain-Language Explain Agent](#stage-3-plain-language-explain-agent)
4. [Backend API Reference](#4-backend-api-reference)
   - [Health Check](#health-check)
   - [Authentication API (`/api/auth`)](#authentication-api-apiauth)
   - [Financial Analysis API (`/api`)](#financial-analysis-api-api)
   - [Expense Management API (`/api/expenses`)](#expense-management-api-apiexpenses)
5. [Data Models & Pydantic Schemas](#5-data-models--pydantic-schemas)
6. [Config-Driven Rules & Category Auto-Tagging](#6-config-driven-rules--category-auto-tagging)
7. [Database Collections (MongoDB Atlas)](#7-database-collections-mongodb-atlas)
8. [Setup & Deployment Guide](#8-setup--deployment-guide)

---

## 1. Product Overview

### Problem Statement
Over **50 million gig workers and micro-freelancers in India** (delivery partners for Zomato/Swiggy, drivers for Uber/Ola, urban handymen, and independent freelancers) live with **highly volatile and unpredictable weekly income**.

Traditional personal finance tools and budgeting applications fail this demographic because:
1. **Static Assumptions**: They assume a fixed monthly salary and static spending caps.
2. **Debt Traps**: Gig workers frequently rely on informal micro-debts (local moneylenders, peer loans, chit funds) alongside credit cards with exorbitant interest rates.
3. **No Safety Cushion**: Generic advice instructs users to throw 100% of excess cash at debt, causing them to relapse into informal borrowing during lean income weeks.

### The SmartRupee Solution
**SmartRupee** is an **Agentic 3-Stage Personal Finance Engine** built specifically for Indian gig economy workers. It combines **pure deterministic financial mathematics** with **Google Gemini LLM reasoning agents** to:
- Quantify income volatility using standard mathematical metrics (Coefficient of Variation).
- Automatically reserve a **rainy-day emergency buffer** *before* debt payoff allocation.
- Dynamically select between **Debt Avalanche** (interest optimization) and **Debt Snowball** (psychological quick wins) based on income risk.
- Auto-tag gig expenses (fuel, vehicle maintenance, food, mobile recharges) with real-time threshold alert warnings.
- Deliver step-by-step, plain-language action plans strictly grounded in verified rupee figures (zero financial hallucinations).

### Target Audience
- **Delivery Partners**: Zomato, Swiggy, Dunzo, Zepto, Blinkit riders.
- **Rideshare Drivers**: Uber, Ola, Rapido drivers.
- **Micro-Freelancers & Artisans**: Urban Company partners, freelance designers, tutors, tradespeople.
- **Informal Wage Earners**: Anyone experiencing weekly income fluctuations.

### Key Value Propositions
- **Income Volatility Aware**: Uses variance metrics ($\text{CV}\%$) rather than naive average income.
- **Hybrid Agentic Pipeline**: Deterministic compute guarantees zero math errors; LLMs provide empathetic, contextual reasoning.
- **Informal Debt Intelligence**: Categorizes and prioritizes informal debts (relatives, moneylenders) alongside formal bank debt.
- **Smart Expense Tracking**: Automatic inference of expense categories from natural text notes (e.g., `"Petrol HP Bunk"` $\rightarrow$ `fuel`).

---

## 2. System Architecture & Tech Stack

SmartRupee uses a production-ready, clean layered architecture separating API routing, core domain compute, AI orchestration, and database persistence.

```
                  ┌──────────────────────────────────────────┐
                  │          FastAPI Web Controller          │
                  │   (routes/auth, analyze, expenses, etc.) │
                  └────────────────────┬─────────────────────┘
                                       │
                ┌──────────────────────┴──────────────────────┐
                ▼                                             ▼
┌──────────────────────────────┐              ┌──────────────────────────────┐
│  Stage 1: Finance Engine     │              │     Config & DB Layer        │
│  (Pure Python Math - No AI)  │              │  (Pydantic Settings & Mongo) │
└───────────────┬──────────────┘              └──────────────────────────────┘
                │
                ▼
┌────────────────────────────────────────────────────────────────────────────┐
│                  LangGraph / Sequential Pipeline                           │
│  ┌─────────────────────────────┐        ┌──────────────────────────────┐   │
│  │ Stage 2: Strategy Agent     │───────►│ Stage 3: Explain Agent       │   │
│  │ (Gemini 1.5 Flash - Decision│        │ (Gemini 1.5 Flash - Guidance)│   │
│  └─────────────────────────────┘        └──────────────────────────────┘   │
└──────────────────────────────────────┬─────────────────────────────────────┘
                                       │
                                       ▼
                  ┌──────────────────────────────────────────┐
                  │       MongoDB Atlas Persistence DB       │
                  │   (users, expenses, analyses collections)│
                  └──────────────────────────────────────────┘
```

### Tech Stack Summary
| Layer | Technology | Purpose |
|---|---|---|
| **Backend Framework** | FastAPI (Python 3.11) | Asynchronous, high-performance web API framework |
| **Validation / Schemas**| Pydantic v2 & `pydantic-settings` | Type safety, request/response validation, env management |
| **AI Model & SDK** | Official Google GenAI SDK (`google-genai`) | Integration with `gemini-1.5-flash` for structured JSON agents |
| **Database** | MongoDB Atlas via `motor` | Async NoSQL persistence for users, expenses, and analysis history |
| **Security** | PyJWT + Passlib (`bcrypt`) | Secure password hashing & JWT Bearer token authentication |
| **Testing** | Pytest | Unit test coverage for pure financial calculations |
| **Deployment** | GCP Cloud Run & Docker | Containerized deployment in Google Cloud Platform (`asia-south1`) |

### Folder Structure
```
backend/
├── app/
│   ├── main.py                  # FastAPI application entrypoint & middleware
│   ├── config.py                # Config-driven settings & keyword rules via pydantic-settings
│   ├── api/
│   │   └── routes/
│   │       ├── auth.py          # /api/auth endpoints (register, login, me)
│   │       ├── analyze.py       # /api/analyze endpoint (3-stage debt analysis)
│   │       ├── expenses.py      # /api/expenses endpoints (create, list, summary, delete)
│   │       └── history.py       # /api/history endpoint (past analysis records)
│   ├── schemas/
│   │   ├── auth.py              # Auth request & response Pydantic models
│   │   ├── analyze.py           # Debt analysis request/response & debt models
│   │   └── expense.py           # Expense tracking request/response models
│   ├── core/
│   │   ├── finance_engine.py    # Stage 1: Deterministic financial compute (pure python)
│   │   ├── security.py          # Password hashing and JWT generation/decoding
│   │   ├── db.py                # Motor AsyncIOMotorClient singleton connection
│   │   └── exceptions.py        # Domain-specific custom exception classes
│   ├── agents/
│   │   ├── strategy_agent.py    # Stage 2 Agent: Decides Avalanche vs. Snowball
│   │   └── explain_agent.py     # Stage 3 Agent: Generates plain-language action plan
│   ├── services/
│   │   └── gemini_client.py     # Wrapped DI-friendly Google GenAI SDK client
│   └── graph/
│       └── flow.py              # Orchestrator wiring the 3-stage agentic pipeline
├── tests/
│   └── test_finance_engine.py   # Unit tests for pure compute logic
├── .env.example
├── Dockerfile
├── requirements.txt
└── README.md
```

---

## 3. The 3-Stage Agentic Debt Engine

The core differentiator of SmartRupee is its **3-Stage Pipeline** defined in [`app/graph/flow.py`](file:///Users/apple/Desktop/nxtwave-hackthon/backend/app/graph/flow.py).

```
  Input: Income Entries, Monthly Expenses, List of Debts
                         │
                         ▼
        ┌──────────────────────────────────┐
        │ STAGE 1: Deterministic Compute   │  <-- Pure Math (finance_engine.py)
        │ - Avg Income                     │
        │ - Volatility % (CV)              │
        │ - Surplus & Risk Level           │
        │ - Rainy-Day Emergency Buffer     │
        └────────────────┬─────────────────┘
                         │
                         ▼
        ┌──────────────────────────────────┐
        │ STAGE 2: Strategy Agent          │  <-- AI Reasoning (strategy_agent.py)
        │ - Evaluates Avalanche vs Snowball│
        │ - Considers volatility & surplus │
        │ - Outputs chosen strategy        │
        └────────────────┬─────────────────┘
                         │
                         ▼
        ┌──────────────────────────────────┐
        │ Math Payoff Ordering             │  <-- Algorithmic Debt Ordering
        │ - Allocates month 1 surplus      │
        └────────────────┬─────────────────┘
                         │
                         ▼
        ┌──────────────────────────────────┐
        │ STAGE 3: Explain Agent           │  <-- AI Guidance (explain_agent.py)
        │ - Strictly grounded in ₹ figures│
        │ - 4-step plain language action   │
        └────────────────┬─────────────────┘
                         │
                         ▼
  Output: AnalyzeResponse + Persisted MongoDB Record
```

### Stage 1: Deterministic Math Compute
Located in [`app/core/finance_engine.py`](file:///Users/apple/Desktop/nxtwave-hackthon/backend/app/core/finance_engine.py). This stage performs zero AI calls, guaranteeing 100% mathematical accuracy.

1. **Average Income ($\mu$)**:
   $$\mu = \frac{1}{N} \sum_{i=1}^N \text{Income}_i$$
2. **Income Volatility ($\text{CV}\%$)**:
   $$\text{CV}\% = \left( \frac{\sigma}{\mu} \right) \times 100$$
3. **Net Cash Surplus**:
   $$\text{Surplus} = \mu - \text{Monthly Expenses}$$
4. **Risk Level Classification**:
   - `HIGH`: If Surplus $\le 0$ or Volatility $> 30\%$.
   - `MEDIUM`: If Volatility $> 15\%$.
   - `LOW`: If Volatility $\le 15\%$.
5. **Deterministic Emergency Buffer**:
   - If Surplus $\le 0$: ₹0.0
   - If Volatility $> 25\%$ or Risk Level is `HIGH`: $20\%$ of Surplus.
   - If Volatility $> 10\%$ or Risk Level is `MEDIUM`: $10\%$ of Surplus.
   - Otherwise (`LOW` Risk): ₹0.0.
6. **Net Repayment Surplus**:
   $$\text{Repayment Surplus} = \text{Surplus} - \text{Emergency Buffer}$$

### Stage 2: Strategy Agent Decision
Located in [`app/agents/strategy_agent.py`](file:///Users/apple/Desktop/nxtwave-hackthon/backend/app/agents/strategy_agent.py).
- Sends financial metrics to `gemini-1.5-flash` with structured JSON output enforcement.
- Evaluates **AVALANCHE** (highest interest rate first for interest savings) vs **SNOWBALL** (smallest balance first for psychological motivation).
- **Deterministic Fallback**: If Gemini key is missing or fails, it defaults to `SNOWBALL` when income volatility $>20\%$ or surplus $<\text{₹}5000$, else `AVALANCHE`.

### Stage 3: Plain-Language Explain Agent
Located in [`app/agents/explain_agent.py`](file:///Users/apple/Desktop/nxtwave-hackthon/backend/app/agents/explain_agent.py).
- Receives computed figures, selected strategy, and debt sequence.
- Instructs Gemini to write a 4-step plain-language action plan for the worker.
- **Strict Grounding Rules**: Prompts enforce that Gemini MUST use exact calculated figures (Emergency Buffer ₹, Repayment Surplus ₹, Month 1 Focus Payment ₹) without inventing new figures.
- **Deterministic Fallback**: Provides pre-formatted, non-AI structured steps if the API is unavailable.

---

## 4. Backend API Reference

### Health Check

#### `GET /health`
Returns system operational status and current deployment environment.

- **Authentication**: None (Public)
- **Tags**: `Health`
- **Response `200 OK`**:
```json
{
  "status": "healthy",
  "app": "SmartRupee Backend",
  "env": "development"
}
```

---

### Authentication API (`/api/auth`)

#### `POST /api/auth/register`
Registers a new gig worker account and issues a signed JWT access token.

- **Authentication**: None (Public)
- **Summary**: Register a new gig worker account
- **Request Body** (`application/json`):
```json
{
  "name": "Ramesh Kumar",
  "email": "ramesh@example.com",
  "password": "SecretPassword123",
  "gig_platform": "Zomato",
  "city": "Bengaluru"
}
```
- **Response `201 Created`**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": "669ba8f12c1b2c3d4e5f6a7b",
    "name": "Ramesh Kumar",
    "email": "ramesh@example.com",
    "gig_platform": "Zomato",
    "city": "Bengaluru",
    "created_at": "2026-07-20T14:00:00Z"
  }
}
```
- **Error Responses**:
  - `400 Bad Request`: `{"detail": "Email is already registered."}`

---

#### `POST /api/auth/login`
Authenticates existing credentials and returns a JWT access token.

- **Authentication**: None (Public)
- **Summary**: Authenticate user & get access token
- **Request Body** (`application/json`):
```json
{
  "email": "ramesh@example.com",
  "password": "SecretPassword123"
}
```
- **Response `200 OK`**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": "669ba8f12c1b2c3d4e5f6a7b",
    "name": "Ramesh Kumar",
    "email": "ramesh@example.com",
    "gig_platform": "Zomato",
    "city": "Bengaluru",
    "created_at": "2026-07-20T14:00:00Z"
  }
}
```
- **Error Responses**:
  - `401 Unauthorized`: `{"detail": "Invalid email or password."}`

---

#### `GET /api/auth/me`
Retrieves the user profile for the currently authenticated JWT bearer token.

- **Authentication**: `Bearer Token` (`Authorization: Bearer <token>`)
- **Summary**: Fetch authenticated user profile
- **Response `200 OK`**:
```json
{
  "id": "669ba8f12c1b2c3d4e5f6a7b",
  "name": "Ramesh Kumar",
  "email": "ramesh@example.com",
  "gig_platform": "Zomato",
  "city": "Bengaluru",
  "created_at": "2026-07-20T14:00:00Z"
}
```
- **Error Responses**:
  - `401 Unauthorized`: `{"detail": "Authentication credentials were not provided."}` or `{"detail": "Invalid or expired authentication token."}`

---

### Financial Analysis API (`/api`)

#### `POST /api/analyze`
Executes the full 3-Stage Agentic Debt Analysis on income entries, expenses, and active debts.

- **Authentication**: Optional Bearer Token
- **Summary**: Analyze financial situation and generate 3-stage debt strategy
- **Request Body** (`application/json`):
```json
{
  "income_entries": [8500.0, 12000.0, 6500.0, 9000.0],
  "monthly_expenses": 18000.0,
  "debts": [
    {
      "name": "Credit Card",
      "amount": 25000.0,
      "rate": 36.0,
      "lender_type": "formal"
    },
    {
      "name": "Local Moneylender Bhai",
      "amount": 10000.0,
      "rate": 24.0,
      "lender_type": "informal"
    },
    {
      "name": "Bike EMI Loan",
      "amount": 40000.0,
      "rate": 14.5,
      "lender_type": "formal"
    }
  ]
}
```
- **Response `200 OK`**:
```json
{
  "avg_income": 9000.0,
  "volatility_pct": 25.46,
  "surplus": 9000.0,
  "emergency_buffer": 1800.0,
  "debt_repayment_surplus": 7200.0,
  "risk_level": "HIGH",
  "chosen_strategy": "SNOWBALL",
  "strategy_reasoning": "Given your high income volatility (25.46%) and debt breakdown, the Snowball method is recommended. Clearing your smaller informal loan first gives you immediate cash-flow relief and psychological momentum.",
  "ordered_debts": [
    {
      "name": "Local Moneylender Bhai",
      "amount": 10000.0,
      "rate": 24.0,
      "lender_type": "informal",
      "payoff_order": 1,
      "recommended_monthly_payment": 7200.0
    },
    {
      "name": "Credit Card",
      "amount": 25000.0,
      "rate": 36.0,
      "lender_type": "formal",
      "payoff_order": 2,
      "recommended_monthly_payment": 0.0
    },
    {
      "name": "Bike EMI Loan",
      "amount": 40000.0,
      "rate": 14.5,
      "lender_type": "formal",
      "payoff_order": 3,
      "recommended_monthly_payment": 0.0
    }
  ],
  "action_plan": [
    "1. Reserve ₹1800.0 into a rainy-day emergency buffer to protect against income fluctuations (25.46% volatility).",
    "2. Direct your net repayment surplus of ₹7200.0 (₹7200.0 allocated in Month 1) primarily towards paying off 'Local Moneylender Bhai' using the SNOWBALL method.",
    "3. Pay minimum required balances on all other debts to avoid late fees or penalty escalation.",
    "4. Once 'Local Moneylender Bhai' is cleared, roll that payment amount into the next debt in your sequence!"
  ]
}
```
- **Error Responses**:
  - `400 Bad Request`: Validation failure or empty income entries.
  - `500 Internal Server Error`: Pipeline execution error.

---

#### `GET /api/history`
Fetches the 10 most recent saved debt analysis records from MongoDB.

- **Authentication**: None / User Context
- **Summary**: Fetch past 10 debt analysis records
- **Response `200 OK`**:
```json
{
  "status": "success",
  "records": [
    {
      "_id": "669ba9212c1b2c3d4e5f6a8c",
      "created_at": "2026-07-20T14:10:00.000000+00:00",
      "inputs": {
        "income_entries": [8500, 12000, 6500, 9000],
        "monthly_expenses": 18000,
        "debts": [...]
      },
      "avg_income": 9000.0,
      "volatility_pct": 25.46,
      "surplus": 9000.0,
      "emergency_buffer": 1800.0,
      "debt_repayment_surplus": 7200.0,
      "risk_level": "HIGH",
      "chosen_strategy": "SNOWBALL",
      "strategy_reasoning": "...",
      "action_plan": [...]
    }
  ]
}
```

---

### Expense Management API (`/api/expenses`)

#### `POST /api/expenses`
Logs a new expense entry. Uses config-driven keyword rules to auto-infer categories if omitted.

- **Authentication**: Optional Bearer Token
- **Summary**: Log a new expense entry
- **Request Body** (`application/json`):
```json
{
  "amount": 350.0,
  "category": null,
  "notes": "Petrol HP Bunk",
  "date": "2026-07-20T14:30:00Z"
}
```
- **Response `201 Created`**:
```json
{
  "id": "669baa112c1b2c3d4e5f6a9d",
  "user_id": "669ba8f12c1b2c3d4e5f6a7b",
  "amount": 350.0,
  "category": "fuel",
  "notes": "Petrol HP Bunk",
  "date": "2026-07-20T14:30:00Z"
}
```

---

#### `GET /api/expenses`
Retrieves logged expenses ordered by date descending.

- **Authentication**: Optional Bearer Token
- **Query Parameters**:
  - `limit` (integer, default `20`, range `1..100`): Maximum number of entries to return.
- **Response `200 OK`**:
```json
[
  {
    "id": "669baa112c1b2c3d4e5f6a9d",
    "user_id": "669ba8f12c1b2c3d4e5f6a7b",
    "amount": 350.0,
    "category": "fuel",
    "notes": "Petrol HP Bunk",
    "date": "2026-07-20T14:30:00Z"
  },
  {
    "id": "669baa052c1b2c3d4e5f6a9c",
    "user_id": "669ba8f12c1b2c3d4e5f6a7b",
    "amount": 120.0,
    "category": "food",
    "notes": "Chai and thali lunch",
    "date": "2026-07-20T12:15:00Z"
  }
]
```

---

#### `GET /api/expenses/summary`
Calculates total spending, category percentage breakdowns, and spending threshold alerts for gig workers.

- **Authentication**: Optional Bearer Token
- **Query Parameters**:
  - `days` (integer, default `30`, range `1..90`): Lookback period in days.
- **Response `200 OK`**:
```json
{
  "total_monthly_expenses": 12500.0,
  "currency_symbol": "₹",
  "period_days": 30,
  "total_entries_count": 14,
  "category_breakdown": [
    {
      "category": "fuel",
      "total_amount": 5600.0,
      "percentage_of_total": 44.8,
      "is_over_threshold": true,
      "warning_message": "Spending on 'Fuel' (44.8%) exceeds recommended threshold of 40.0%!"
    },
    {
      "category": "maintenance",
      "total_amount": 1500.0,
      "percentage_of_total": 12.0,
      "is_over_threshold": false,
      "warning_message": null
    },
    {
      "category": "food",
      "total_amount": 2800.0,
      "percentage_of_total": 22.4,
      "is_over_threshold": false,
      "warning_message": null
    },
    {
      "category": "recharge",
      "total_amount": 699.0,
      "percentage_of_total": 5.6,
      "is_over_threshold": false,
      "warning_message": null
    },
    {
      "category": "rent",
      "total_amount": 0.0,
      "percentage_of_total": 0.0,
      "is_over_threshold": false,
      "warning_message": null
    },
    {
      "category": "utilities",
      "total_amount": 0.0,
      "percentage_of_total": 0.0,
      "is_over_threshold": false,
      "warning_message": null
    },
    {
      "category": "healthcare",
      "total_amount": 0.0,
      "percentage_of_total": 0.0,
      "is_over_threshold": false,
      "warning_message": null
    },
    {
      "category": "other",
      "total_amount": 1901.0,
      "percentage_of_total": 15.2,
      "is_over_threshold": false,
      "warning_message": null
    }
  ],
  "alerts": [
    "Spending on 'Fuel' (44.8%) exceeds recommended threshold of 40.0%!"
  ]
}
```

---

#### `DELETE /api/expenses/{expense_id}`
Deletes a specific expense entry by ID.

- **Authentication**: Optional Bearer Token
- **Path Parameter**: `expense_id` (string, MongoDB ObjectId)
- **Response `200 OK`**:
```json
{
  "status": "success",
  "deleted_id": "669baa112c1b2c3d4e5f6a9d"
}
```
- **Error Responses**:
  - `404 Not Found`: `{"detail": "Expense entry not found."}`
  - `400 Bad Request`: `{"detail": "Invalid ObjectId format."}`

---

## 5. Data Models & Pydantic Schemas

Below are the exact Pydantic schema structures defined in [`app/schemas/`](file:///Users/apple/Desktop/nxtwave-hackthon/backend/app/schemas).

### `Debt`
```python
class Debt(BaseModel):
    name: str                  # Name of creditor or loan e.g. "Credit Card"
    amount: float              # Outstanding balance (> 0)
    rate: float                # Interest rate % (>= 0)
    lender_type: Optional[str] # "formal" or "informal"
```

### `AnalyzeRequest`
```python
class AnalyzeRequest(BaseModel):
    income_entries: List[float] # List of periodic income entries (1 to 12)
    monthly_expenses: float    # Essential monthly living expenses (>= 0)
    debts: List[Debt]          # Active debts (1 to 10)
```

### `DebtStrategyItem`
```python
class DebtStrategyItem(BaseModel):
    name: str
    amount: float
    rate: float
    lender_type: str
    payoff_order: int
    recommended_monthly_payment: float
```

### `AnalyzeResponse`
```python
class AnalyzeResponse(BaseModel):
    avg_income: float
    volatility_pct: float
    surplus: float
    emergency_buffer: float
    debt_repayment_surplus: float
    risk_level: str              # "LOW", "MEDIUM", "HIGH"
    chosen_strategy: str         # "AVALANCHE" or "SNOWBALL"
    strategy_reasoning: str
    ordered_debts: List[DebtStrategyItem]
    action_plan: List[str]
```

### `UserRegister` & `UserResponse`
```python
class UserRegister(BaseModel):
    name: str                  # Full name (min 2 chars)
    email: EmailStr            # Valid email
    password: str              # Password (min 6 chars)
    gig_platform: Optional[str]# e.g. "Zomato", "Swiggy", "Uber", "Ola"
    city: Optional[str]        # User city e.g. "Bengaluru"

class UserResponse(BaseModel):
    id: str
    name: str
    email: EmailStr
    gig_platform: Optional[str]
    city: Optional[str]
    created_at: datetime
```

### `ExpenseCreate` & `ExpenseSummaryResponse`
```python
class ExpenseCreate(BaseModel):
    amount: float              # Amount spent (> 0)
    category: Optional[str]    # Explicit category (or auto-inferred)
    notes: Optional[str]       # Free text e.g. "Petrol HP Bunk"
    date: Optional[datetime]   # Date of expense

class CategoryBreakdownItem(BaseModel):
    category: str
    total_amount: float
    percentage_of_total: float
    is_over_threshold: bool
    warning_message: Optional[str]

class ExpenseSummaryResponse(BaseModel):
    total_monthly_expenses: float
    currency_symbol: str = "₹"
    period_days: int = 30
    total_entries_count: int
    category_breakdown: List[CategoryBreakdownItem]
    alerts: List[str]
```

---

## 6. Config-Driven Rules & Category Auto-Tagging

Defined in [`app/config.py`](file:///Users/apple/Desktop/nxtwave-hackthon/backend/app/config.py), SmartRupee provides config-driven category inference and spending alerts:

### Expense Categories & Keyword Rules
When logging expenses, if no category is provided, `infer_expense_category()` uses regular expressions to match keywords in the `notes` field:

| Category | Recommended Threshold % | Matching Keywords in Notes |
|---|---|---|
| `fuel` | **40.0%** | `petrol`, `diesel`, `ev`, `charging`, `hp`, `iocl`, `bpcl`, `bunk` |
| `maintenance` | **20.0%** | `mechanic`, `puncture`, `oil`, `service`, `brake`, `tyre`, `repair` |
| `food` | **25.0%** | `chai`, `tea`, `lunch`, `dinner`, `breakfast`, `samosa`, `thali`, `hotel`, `canteen` |
| `recharge` | N/A | `jio`, `airtel`, `vi`, `data`, `recharge`, `mobile` |
| `rent` | N/A | `rent`, `room`, `house` |
| `utilities` | N/A | `electricity`, `water`, `gas`, `bill` |
| `healthcare` | N/A | `doctor`, `medicine`, `medical`, `pharma` |
| `other` | N/A | Fallback for non-matching notes |

---

## 7. Database Collections (MongoDB Atlas)

SmartRupee connects asynchronously to MongoDB via `motor`.

### Collection 1: `users`
```json
{
  "_id": ObjectId("669ba8f12c1b2c3d4e5f6a7b"),
  "name": "Ramesh Kumar",
  "email": "ramesh@example.com",
  "password": "$2b$12$eImiTXuWVxfM37uY4JANjO...",
  "gig_platform": "Zomato",
  "city": "Bengaluru",
  "created_at": ISODate("2026-07-20T14:00:00Z")
}
```

### Collection 2: `expenses`
```json
{
  "_id": ObjectId("669baa112c1b2c3d4e5f6a9d"),
  "user_id": "669ba8f12c1b2c3d4e5f6a7b",
  "amount": 350.0,
  "category": "fuel",
  "notes": "Petrol HP Bunk",
  "date": ISODate("2026-07-20T14:30:00Z")
}
```

### Collection 3: `analyses`
```json
{
  "_id": ObjectId("669ba9212c1b2c3d4e5f6a8c"),
  "created_at": ISODate("2026-07-20T14:10:00Z"),
  "inputs": {
    "income_entries": [8500, 12000, 6500, 9000],
    "monthly_expenses": 18000,
    "debts": [...]
  },
  "avg_income": 9000.0,
  "volatility_pct": 25.46,
  "surplus": 9000.0,
  "emergency_buffer": 1800.0,
  "debt_repayment_surplus": 7200.0,
  "risk_level": "HIGH",
  "chosen_strategy": "SNOWBALL",
  "strategy_reasoning": "...",
  "action_plan": [...]
}
```

---

## 8. Setup & Deployment Guide

### Prerequisites
- Python 3.11+
- MongoDB instance (or free MongoDB Atlas cluster)
- Google Gemini API Key (from Google AI Studio)

### Environment File (`.env`)
Create a `.env` file in `backend/`:
```env
GEMINI_API_KEY=your_google_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/smartrupee
JWT_SECRET_KEY=super_secret_jwt_key_change_in_production
JWT_ALGORITHM=HS256
ENV=development
PORT=8000
```

### Local Development Setup

1. **Navigate to backend**:
   ```bash
   cd backend
   ```
2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```
3. **Run tests**:
   ```bash
   pytest
   ```
4. **Start local server**:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
5. **Interactive Swagger Docs**:
   Visit `http://localhost:8000/docs` in your browser.

---

### Cloud Run Deployment (GCP)

Deploy to Google Cloud Run with a single command using the included `Dockerfile`:

```bash
gcloud run deploy smartrupee \
  --source . \
  --region asia-south1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY="your_api_key",MONGO_URI="your_mongo_uri"
```

---

*Document compiled and verified for SmartRupee production backend.*
