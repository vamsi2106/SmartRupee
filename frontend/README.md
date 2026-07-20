# 💻 SmartRupee — Frontend Application (React + Vite + Tailwind CSS)

The client application for **SmartRupee**, providing an intuitive, mobile-responsive dashboard designed for Indian gig economy workers.

---

## ✨ Features & Views

1. **Interactive Advisory Wizard (`AdvisoryView.jsx`)**:
   - Step-by-step income entry (captures weekly pay fluctuations).
   - Monthly expense breakdown and informal/formal debt management.
   - Real-time volatility metric ($\text{CV}\%$) calculation & risk level visual badge.
   - Dynamic 3-stage analysis execution with interactive Gemini strategy card, rainy-day emergency buffer breakdown, and prioritized step-by-step action plan.
2. **AI Expense Tracker (`ExpenseView.jsx`)**:
   - Natural language expense entry with automatic Gemini AI category inference (*"Petrol HP Bunk ₹350"* $\rightarrow$ `Fuel`).
   - Real-time visual spending limit warnings and budget progress bars.
3. **Historical Analysis Timeline (`HistoryView.jsx`)**:
   - Timeline of all past financial assessments retrieved from MongoDB Atlas.
4. **Public Landing Page (`LandingPage.jsx`)**:
   - High-converting landing page highlighting problem statement, value proposition, live interactive calculator preview, and hackathon theme alignment.
5. **Authentication Modal (`AuthModal.jsx`)**:
   - JWT user sign-in and registration flow.

---

## 🚀 Development Quickstart

1. Install dependencies:
   ```bash
   npm install
   ```
2. Set Environment Variables (optional, defaults to `http://localhost:8000`):
   Create a `.env` file in `frontend/`:
   ```env
   VITE_API_BASE_URL=http://localhost:8000
   ```
3. Run Development Server:
   ```bash
   npm run dev
   ```
4. Build Production Bundle:
   ```bash
   npm run build
   ```
