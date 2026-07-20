# 🏆 SmartRupee — Official Hackathon Submission Kit

> **NxtWave Idea2Impact Online Hackathon 2026 Submission Document**  
> *Use this document to quickly fill out the official NxtWave Submission Form at:*  
> 👉 **[Submission Form Link](https://forms.ccbp.in/acad-online-hackathon-project-submission)**

---

## 📋 Quick Reference Checklist

| Submission Requirement | Status | Action Needed |
|---|---|---|
| **1. Theme & Problem Statement** | ✅ **READY** | Copy Section 1 below into Form Field 1 |
| **2. Solution Description** | ✅ **READY** | Copy Section 2 below into Form Field 2 |
| **3. GitHub Repository Link** | ⚡ **READY TO PUSH** | Follow Section 3 instructions to push repo & paste URL |
| **4. Deployed Live Link** | ⚡ **READY TO DEPLOY** | Follow Section 4 instructions for instant deployment |
| **5. 2–3 Min Demo Video** | 🎬 **SCRIPT READY** | Record video using Section 5 script & paste YouTube/GDrive link |

## 🔑 Demo Account for Judges
- **1-Click Login**: Click **"Instant Login as Ramesh (Zomato Rider)"** in the login modal.
- **Email**: `ramesh.demo@smartrupee.in`
- **Password**: `DemoPassword123!`
- **AI Quota Protection**: Each account is allowed **up to 5 free AI analysis runs** (`HTTP 429` quota enforcement) to protect Gemini API credit costs.

---

## 1️⃣ Field 1: Theme & Problem Statement

*(Copy & Paste into Submission Form - Field 01)*

```text
THEME: Theme 1 — Sustainability & Social Impact (Financial Inclusion & Gig Economy Welfare)

PROBLEM STATEMENT:
Over 50 million gig economy workers and micro-freelancers in India (delivery partners for Swiggy/Zomato/Zepto, rideshare drivers for Uber/Ola, and Urban Company technicians) experience extreme weekly income volatility—fluctuating by 30% to 60% week-over-week. 

Traditional personal finance tools fail this demographic because:
1. Fixed Salary Bias: They assume predictable monthly paychecks and static spending limits.
2. The "Relapse" Debt Trap: Standard debt payoff strategies (like Avalanche/Snowball) instruct users to throw 100% of excess cash at debt. When a lean income week hits, the worker lacks basic emergency cash and is forced to borrow from predatory informal moneylenders charging 60–120% annual interest.
3. Hidden Informal Debts: Traditional software ignores informal debts (relatives, neighborhood shop credit, daily-penalty loans) that carry immense social and psychological stress.
4. Financial Jargon: Complex formulas and wealth-management terminology alienate informal earners.

TARGET AUDIENCE:
Gig delivery workers, rideshare drivers, informal wage earners, and micro-freelancers across India.
```

---

## 2️⃣ Field 2: Solution Description & Technical Approach

*(Copy & Paste into Submission Form - Field 02)*

```text
SOLUTION DESCRIPTION:
SmartRupee is an AI-powered 3-Stage Volatility-Aware Debt Advisory Platform built specifically for Indian gig workers. It combines pure deterministic financial mathematics with Google Gemini AI agents to deliver safe, jargon-free, risk-adjusted debt repayment plans.

KEY ARCHITECTURAL HIGHLIGHTS & AI IMPLEMENTATION:
1. Pure Deterministic Compute (Stage 1):
   - Computes average earnings and quantifies volatility using standard variation metrics: Coefficient of Variation % (CV = StdDev / Mean * 100).
   - Computes monthly net cash surplus. Pure Python code guarantees ZERO mathematical errors or AI hallucinations.

2. Gemini AI Strategy Selector Agent (Stage 2):
   - Evaluates volatility risk. If income variation exceeds 30% (High Risk), Gemini selects the Debt Snowball strategy (clearing smallest loans first to eliminate monthly payment obligations rapidly and build psychological wins).
   - If income is stable (Low Risk), Gemini selects Debt Avalanche to minimize total interest paid.

3. Gemini AI Empathetic Action Planner Agent (Stage 3):
   - Automatically reserves a dynamic rainy-day emergency buffer (15-25% of surplus) BEFORE allocating cash to debt, protecting workers against low-income weeks.
   - Generates plain-language, step-by-step action plans tailored for informal & formal debts without confusing financial jargon.

4. Natural Language Expense AI:
   - Auto-categorizes natural language expense entries (e.g. "Petrol HP Bunk ₹350" -> Fuel) and triggers real-time visual safety warnings when spending exceeds thresholds.

TECH STACK:
- Frontend: React 18, Vite, Tailwind CSS, Lucide Icons
- Backend: Python 3.11+, FastAPI, Pydantic v2, Pytest
- AI Model: Google Gemini AI (gemini-1.5-flash / gemini-2.0)
- Database: MongoDB Atlas (Async Motor client)
- Architecture: 3-Stage Modular Agentic Pipeline
```

---

## 3️⃣ Field 3: GitHub Repository

*(Provide your PUBLIC GitHub Repository URL)*

### GitHub Repo Setup Instructions:
1. Initialize Git repository and add files:
   ```bash
   git init
   git add .
   git commit -m "feat: complete SmartRupee 3-stage agentic debt advisory app for hackathon"
   ```
2. Create a public repository on GitHub named `smartrupee-ai` (or `nxtwave-hackathon-smartrupee`).
3. Push codebase to GitHub:
   ```bash
   git branch -M main
   git remote add origin https://github.com/YOUR_GITHUB_USERNAME/smartrupee-ai.git
   git push -u origin main
   ```
4. Confirm repository visibility is **PUBLIC**.
5. Paste link: `https://github.com/YOUR_GITHUB_USERNAME/smartrupee-ai`

---

## 4️⃣ Field 4: Deployed Live Link

*(Provide a working URL to your live project)*

### Quick Deployment Options:

#### Option A: Deploy Frontend on Vercel + Backend on Render (Recommended - 5 Mins)
1. **Backend on Render (Free Tier)**:
   - Go to [render.com](https://render.com/) -> New Web Service.
   - Connect your GitHub Repo.
   - Root Directory: `backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - Environment Variables:
     - `GEMINI_API_KEY` = your Google AI Studio key
     - `MONGO_URI` = your MongoDB connection string
     - `ENV` = `production`

2. **Frontend on Vercel (Free Tier)**:
   - Go to [vercel.com](https://vercel.com/) -> New Project.
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Environment Variables:
     - `VITE_API_BASE_URL` = your backend Render URL (e.g., `https://smartrupee-api.onrender.com`)

3. **Test Credentials**:
   - Provide test login credentials if applicable or state: *"No login required to view demo / guest mode enabled"*.

---

## 5️⃣ Field 5: Demo Video Recording Guide (2–3 Minutes)

*(Provide YouTube Unlisted Link or Public Google Drive Link)*

### Recommended Video Structure (2 Min 30 Sec Total):

| Timeframe | Visual Focus | Voiceover / Explanation Script |
|---|---|---|
| **0:00 – 0:30** | **Problem Statement** | "Hi! Over 50 million gig workers in India struggle with highly unpredictable weekly earnings. Standard financial tools force rigid debt payoff formulas that cause workers to relapse into predatory 100% APR informal debt whenever income dips. Introducing SmartRupee." |
| **0:30 – 1:15** | **Live App Walkthrough** | Show SmartRupee UI. Enter fluctuating weekly earnings (e.g., ₹18,000, ₹9,000, ₹22,000, ₹11,000), monthly expenses, and informal/formal debts (e.g. Credit Card at 24% and Moneylender loan). |
| **1:15 – 2:00** | **AI Pipeline in Action** | Show the 3-Stage Analysis result: Point out the deterministic Volatility Metric ($\text{CV} = 36\%$), Gemini AI selecting **Debt Snowball** due to high volatility risk, the dynamic **Rainy-Day Emergency Buffer** reserved first, and the plain-language step-by-step action plan. |
| **2:00 – 2:30** | **Expense AI & Conclusion** | Show AI Expense tracking auto-inferring categories from text notes (e.g., "Petrol HP Bunk"). Summarize social impact: preventing debt traps for millions of Indian gig workers. Thank you! |

---
