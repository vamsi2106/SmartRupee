import React from 'react';
import { Sparkles, ShieldCheck, TrendingUp, Receipt, ArrowRight, CheckCircle2, Zap, Brain, Lock, RefreshCcw } from 'lucide-react';

export default function LandingView({ onLaunchApp, onOpenExpenses }) {
  return (
    <div className="space-y-16 py-4 animate-in fade-in duration-300">
      
      {/* ========================================================================= */}
      {/* SECTION 1: HERO WITH VALUE PROPOSITION & CTA                             */}
      {/* ========================================================================= */}
      <section className="relative bg-white border border-slate-200/90 rounded-3xl p-8 sm:p-12 shadow-sm overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Built for 50M+ Indian Gig Workers & Micro-Freelancers</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Adaptive Debt Payoff for <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Volatile Income</span>
            </h1>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl font-medium">
              Generic budgeting apps fail delivery partners, drivers, and freelancers because they assume fixed salaries. SmartRupee calculates your income volatility deterministically, locks in a rainy-day emergency buffer, and deploys <strong>Google Gemini AI</strong> for an adaptive payoff plan.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                onClick={onLaunchApp}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3.5 rounded-xl text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer group"
              >
                <span>Launch 3-Stage Advisory Engine</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onOpenExpenses}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-5 py-3.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2 cursor-pointer border border-slate-200"
              >
                <Receipt className="w-4 h-4 text-emerald-600" />
                <span>Try Express Expense Tracker</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="pt-4 flex items-center gap-6 text-xs text-slate-500 font-medium">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Zero Hallucination Guardrails</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Brain className="w-4 h-4 text-teal-600" />
                <span>Google Gemini Powered</span>
              </div>
            </div>
          </div>

          {/* Hero Right Visual Mockup Card */}
          <div className="lg:col-span-5">
            <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800 space-y-4 relative">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Live Agent Pipeline Output
                </span>
              </div>

              {/* Stage 1 Pill */}
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60 space-y-1">
                <div className="flex items-center justify-between text-[11px] font-bold text-emerald-400">
                  <span>STAGE 1: DETERMINISTIC MATH</span>
                  <span>38.5% CV (HIGH RISK)</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                  <div>Avg Income: <span className="font-bold text-white">₹50,000</span></div>
                  <div>Rainy Buffer: <span className="font-bold text-amber-400">₹7,000</span></div>
                </div>
              </div>

              {/* Stage 2 Pill */}
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60 space-y-1">
                <div className="flex items-center justify-between text-[11px] font-bold text-teal-400">
                  <span>STAGE 2: GEMINI AI STRATEGY</span>
                  <span className="px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 font-extrabold">AVALANCHE</span>
                </div>
                <p className="text-[11px] text-slate-300 italic">
                  "Selected Avalanche to clear 24% CC interest first while preserving ₹7k emergency cushion."
                </p>
              </div>

              {/* Stage 3 Pill */}
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60 space-y-1.5 text-xs text-slate-200">
                <div className="text-[11px] font-bold text-emerald-400 uppercase">STAGE 3: GROUNDED MONTH 1 FOCUS</div>
                <div className="flex items-center justify-between bg-slate-900/80 p-2 rounded border border-slate-700/80">
                  <span className="font-semibold text-white">#1 Credit Card (24%)</span>
                  <span className="font-bold text-emerald-400">₹28,000 / mo</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: KEY FEATURES & HOW IT WORKS                                   */}
      {/* ========================================================================= */}
      <section className="space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            How It Works
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            The 3-Stage Agentic Financial Architecture
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm font-medium">
            SmartRupee combines strict mathematical computing with LLM reasoning to ensure zero financial hallucinations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 relative hover:border-emerald-300 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
              1
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">Stage 1: Deterministic Compute</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Calculates Coefficient of Variation (% CV) across irregular payout histories. Auto-detects formal vs. informal debt types and reserves a rainy-day buffer before debt allocation.
            </p>
            <div className="pt-2 text-[11px] font-bold text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 100% Pure Python Math
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 relative hover:border-teal-300 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
              2
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">Stage 2: Gemini Strategy Agent</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Evaluates Avalanche (high-interest first) vs Snowball (quick psychological wins) based on worker risk profiles and high-interest credit card burdens.
            </p>
            <div className="pt-2 text-[11px] font-bold text-teal-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Google Gemini Reasoning
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 relative hover:border-emerald-300 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
              3
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">Stage 3: Grounded Action Plan</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Translates financial output into empathetic, actionable monthly guidance steps. Strictly grounded to prohibit manufactured monetary numbers.
            </p>
            <div className="pt-2 text-[11px] font-bold text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Empathetic Execution Steps
            </div>
          </div>

        </div>

        {/* Bonus Feature Box */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-left">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[11px] font-extrabold uppercase">
              <Receipt className="w-3.5 h-3.5" /> Included Module
            </div>
            <h3 className="text-xl font-extrabold">Express Expense Tracker & Category Warnings</h3>
            <p className="text-slate-300 text-xs max-w-xl leading-relaxed">
              Log daily expenses with smart keyword auto-tagging (e.g., typing <em>"petrol HP"</em> automatically tags as <strong>Fuel</strong>). Get automatic warning alerts if fuel, food, or vehicle maintenance exceeds recommended spending caps.
            </p>
          </div>

          <button
            onClick={onOpenExpenses}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-5 py-3 rounded-xl text-xs shadow-sm transition-all whitespace-nowrap cursor-pointer shrink-0"
          >
            Explore Expense Tracker
          </button>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3: CALL TO ACTION & FOOTER                                      */}
      {/* ========================================================================= */}
      <section className="space-y-12">
        {/* Main CTA Card */}
        <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-teal-900 rounded-3xl p-8 sm:p-12 text-white text-center space-y-6 shadow-md relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-3 relative z-10">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Ready to Break the Gig Debt Cycle?
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm font-medium leading-relaxed">
              Experience an intelligent debt relief pipeline built specifically for Indian delivery partners, drivers, handymen, and independent freelancers.
            </p>
          </div>

          <div className="pt-2 relative z-10 flex justify-center">
            <button
              onClick={onLaunchApp}
              className="bg-white hover:bg-emerald-50 text-slate-900 font-extrabold px-8 py-4 rounded-xl text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer group"
            >
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Launch 3-Stage Advisory Engine Now</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
