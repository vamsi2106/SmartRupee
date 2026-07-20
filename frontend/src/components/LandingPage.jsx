import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Receipt,
  CheckCircle2,
  Brain,
  User,
  ChevronRight,
  TrendingDown,
  Umbrella,
  Calculator,
  Target,
  FileText,
  IndianRupee,
  AlertTriangle,
  Landmark,
  Clock,
  Lock,
  Heart,
  Menu,
  X,
} from 'lucide-react';

/* ─────────────────────────────────────────────────────────────────────────────
   ANIMATED WRAPPER – fades + slides children in when they scroll into view
   ─────────────────────────────────────────────────────────────────────────── */
function FadeInWhenVisible({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN LANDING PAGE COMPONENT
   ─────────────────────────────────────────────────────────────────────────── */
export default function LandingPage({ onEnterApp, onOpenAuth, isAuthenticated, user }) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleCTA = () => {
    if (isAuthenticated) {
      onEnterApp();
    } else {
      onOpenAuth();
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900 flex flex-col overflow-x-hidden">

      {/* ═══════════════════════════════════════════════════════════════════════
          STICKY NAVBAR
          ═══════════════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-slate-100 transition-all">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 h-16 sm:h-[72px] flex items-center justify-between">

          {/* Logo */}
          <div
            className="flex items-center gap-2.5 cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-extrabold text-xl shadow-md shadow-emerald-500/20">
              ₹
            </div>
            <div>
              <div className="font-extrabold text-slate-900 text-lg tracking-tight leading-none">
                SmartRupee
              </div>
              <span className="text-[11px] text-slate-500 font-medium hidden sm:inline-block">
                Smart Finance for Gig Workers
              </span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-500">
            <a href="#problems" className="hover:text-emerald-700 transition-colors">Why SmartRupee</a>
            <a href="#how-it-works" className="hover:text-emerald-700 transition-colors">How It Works</a>
            <a href="#features" className="hover:text-emerald-700 transition-colors">Features</a>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <button
                onClick={onEnterApp}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-lg shadow-emerald-500/20 transition-all cursor-pointer min-h-[48px]"
              >
                <span>Go to Dashboard</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <>
                <button
                  onClick={onOpenAuth}
                  className="px-4 py-2.5 text-sm font-bold text-slate-600 hover:text-emerald-700 transition-colors cursor-pointer min-h-[48px]"
                >
                  Sign In
                </button>
                <button
                  onClick={handleCTA}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-lg shadow-emerald-500/20 transition-all cursor-pointer min-h-[48px]"
                >
                  Get Started Free
                </button>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex items-center justify-center w-12 h-12 rounded-2xl hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-slate-100 px-5 py-5 space-y-3"
          >
            <a href="#problems" onClick={() => setMobileMenuOpen(false)} className="block text-base font-semibold text-slate-700 py-2">Why SmartRupee</a>
            <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="block text-base font-semibold text-slate-700 py-2">How It Works</a>
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block text-base font-semibold text-slate-700 py-2">Features</a>
            <hr className="border-slate-100" />
            {isAuthenticated ? (
              <button
                onClick={() => { setMobileMenuOpen(false); onEnterApp(); }}
                className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-base font-bold transition-all cursor-pointer min-h-[48px]"
              >
                Go to Dashboard
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="space-y-2.5">
                <button
                  onClick={() => { setMobileMenuOpen(false); onOpenAuth(); }}
                  className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 text-slate-700 text-base font-bold transition-all cursor-pointer min-h-[48px]"
                >
                  Sign In
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); handleCTA(); }}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-base font-bold shadow-lg shadow-emerald-500/20 transition-all cursor-pointer min-h-[48px]"
                >
                  Get Started Free
                </button>
              </div>
            )}
          </motion.div>
        )}
      </header>


      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 1 — HERO
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative w-full bg-gradient-to-b from-emerald-50/70 via-white to-white">
        {/* Decorative blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-32 right-0 w-[300px] h-[300px] bg-teal-200/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-12 sm:pt-20 lg:pt-28 pb-16 sm:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

            {/* ── Hero Text ── */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-6 text-center lg:text-left order-1"
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-sm">
                <Heart className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                <span>Built for India's 50M+ Gig Workers</span>
              </div>

              {/* Headline */}
              <h1 className="text-[2rem] sm:text-5xl lg:text-[3.5rem] font-extrabold text-slate-900 tracking-tight leading-[1.1]">
                Smart Finance for{' '}
                <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                  Irregular Incomes.
                </span>
              </h1>

              {/* Subheadline */}
              <p className="text-slate-600 text-base sm:text-lg lg:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium">
                Take control of your money, build a rainy-day fund, and crush your debts — even if your weekly earnings change every single time.
              </p>

              {/* Primary CTA */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2 justify-center lg:justify-start">
                <button
                  onClick={handleCTA}
                  className="bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold px-8 py-4 rounded-2xl text-base sm:text-lg shadow-xl shadow-emerald-500/25 transition-all flex items-center justify-center gap-2.5 cursor-pointer group min-h-[56px]"
                >
                  <Sparkles className="w-5 h-5 text-emerald-200" />
                  <span>{isAuthenticated ? 'Open Your Dashboard' : 'Get Your Free Action Plan'}</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Trust micro-line */}
              <p className="text-xs sm:text-sm text-slate-400 font-medium flex items-center gap-1.5 justify-center lg:justify-start pt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Free forever · No credit card needed · 100% secure
              </p>
            </motion.div>

            {/* ── Hero Visual Card (Mobile phone mockup) ── */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="order-2 flex justify-center"
            >
              <div className="w-full max-w-[340px] sm:max-w-[380px]">
                {/* Phone Frame */}
                <div className="bg-slate-900 rounded-[2rem] p-5 sm:p-6 shadow-2xl border border-slate-800 space-y-4 relative">
                  {/* Status bar */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-700/50">
                    <span className="text-[11px] font-bold text-slate-400">SmartRupee</span>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/15 px-2.5 py-1 rounded-full">
                      ✓ Your Plan is Ready
                    </span>
                  </div>

                  {/* Card 1: Income Summary */}
                  <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-4 rounded-2xl text-white space-y-2">
                    <p className="text-xs font-semibold text-emerald-100 opacity-80">This Month's Income</p>
                    <div className="flex items-end gap-2">
                      <span className="text-3xl font-extrabold tracking-tight">₹48,500</span>
                      <span className="text-xs font-bold text-emerald-100 pb-1">avg from 12 weeks</span>
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <span className="px-2 py-0.5 bg-white/20 rounded-full text-[10px] font-bold">Rainy-Day Fund: ₹7,200 ✓</span>
                    </div>
                  </div>

                  {/* Card 2: Today's Action */}
                  <div className="bg-slate-800/70 p-4 rounded-2xl border border-slate-700/50 space-y-2.5">
                    <p className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">Today's Action</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between bg-slate-900/60 p-3 rounded-xl">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center">
                            <TrendingDown className="w-4 h-4 text-rose-400" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white">Pay Credit Card</p>
                            <p className="text-[10px] text-slate-400">24% interest — attack first!</p>
                          </div>
                        </div>
                        <span className="text-sm font-extrabold text-emerald-400">₹4,200</span>
                      </div>
                      <div className="flex items-center justify-between bg-slate-900/60 p-3 rounded-xl">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                            <Landmark className="w-4 h-4 text-blue-400" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white">Bike Loan EMI</p>
                            <p className="text-[10px] text-slate-400">On track — keep it up!</p>
                          </div>
                        </div>
                        <span className="text-sm font-extrabold text-emerald-400">₹2,800</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom tag */}
                  <div className="flex items-center justify-center gap-1.5 pt-1">
                    <Lock className="w-3 h-3 text-slate-500" />
                    <span className="text-[10px] text-slate-500 font-medium">All calculations verified · Zero guesswork</span>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 2 — THE PROBLEM (Pain Points)
          ═══════════════════════════════════════════════════════════════════ */}
      <section id="problems" className="w-full py-16 sm:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">

          <FadeInWhenVisible>
            <div className="text-center max-w-2xl mx-auto space-y-3 mb-12 sm:mb-16">
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-4 py-1.5 rounded-full border border-rose-200">
                Sound familiar?
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Money apps aren't built for people like you.
              </h2>
              <p className="text-slate-500 text-sm sm:text-base font-medium max-w-lg mx-auto">
                You work hard every day. But budgeting tools assume a fixed salary hits your bank every month. That's not your reality.
              </p>
            </div>
          </FadeInWhenVisible>

          {/* Pain-Point Cards — horizontal scroll on mobile, 3-col on desktop */}
          <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide md:grid md:grid-cols-3 md:overflow-visible md:pb-0">

            {/* Card 1 */}
            <FadeInWhenVisible delay={0.05} className="min-w-[280px] sm:min-w-[300px] md:min-w-0 snap-center">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-rose-200 transition-all h-full space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
                  <TrendingDown className="w-7 h-7" />
                </div>
                <h3 className="font-extrabold text-slate-900 text-lg sm:text-xl">
                  "Some weeks I earn ₹12K, some weeks ₹4K"
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Your income goes up and down every week. How do you plan a budget when you don't know what's coming next? Most apps simply can't handle this.
                </p>
              </div>
            </FadeInWhenVisible>

            {/* Card 2 */}
            <FadeInWhenVisible delay={0.12} className="min-w-[280px] sm:min-w-[300px] md:min-w-0 snap-center">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-amber-200 transition-all h-full space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <AlertTriangle className="w-7 h-7" />
                </div>
                <h3 className="font-extrabold text-slate-900 text-lg sm:text-xl">
                  "I'm stuck in a cycle of quick-loan apps"
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  High-interest quick-loan apps and borrowing from friends might solve today, but they make next month harder. It's a debt trap that keeps growing.
                </p>
              </div>
            </FadeInWhenVisible>

            {/* Card 3 */}
            <FadeInWhenVisible delay={0.19} className="min-w-[280px] sm:min-w-[300px] md:min-w-0 snap-center">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-blue-200 transition-all h-full space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Clock className="w-7 h-7" />
                </div>
                <h3 className="font-extrabold text-slate-900 text-lg sm:text-xl">
                  "No app understands gig life"
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Every finance app asks for your "monthly salary." When you type ₹0 or skip it, the app becomes useless. They weren't built for riders, drivers, or freelancers.
                </p>
              </div>
            </FadeInWhenVisible>

          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 3 — HOW IT WORKS (3-Step Engine, Simplified)
          ═══════════════════════════════════════════════════════════════════ */}
      <section id="how-it-works" className="w-full py-16 sm:py-24 bg-white relative overflow-hidden">
        {/* Decorative */}
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-100/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">

          <FadeInWhenVisible>
            <div className="text-center max-w-2xl mx-auto space-y-3 mb-14 sm:mb-20">
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-200">
                Simple as 1-2-3
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Here's how SmartRupee works for you.
              </h2>
              <p className="text-slate-500 text-sm sm:text-base font-medium">
                No complicated setup. Just enter your numbers and get a clear plan in minutes.
              </p>
            </div>
          </FadeInWhenVisible>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">

            {/* Step 1 */}
            <FadeInWhenVisible delay={0.05}>
              <div className="relative bg-gradient-to-b from-emerald-50 to-white rounded-3xl p-7 sm:p-8 border border-emerald-100 shadow-sm h-full">
                {/* Step Number */}
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-extrabold text-lg mb-5 shadow-md shadow-emerald-500/20">
                  1
                </div>
                <h3 className="font-extrabold text-slate-900 text-xl mb-3">
                  The Math<br />
                  <span className="text-emerald-700 text-base font-bold">(No Guesswork)</span>
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  We calculate your <strong>exact income swings</strong> from your weekly payouts and set aside a <strong>safety net first</strong> — before anything else. Every Rupee is accounted for.
                </p>
                <div className="mt-5 flex items-center gap-2 text-xs font-bold text-emerald-700">
                  <Calculator className="w-4 h-4" />
                  <span>100% real math, not AI predictions</span>
                </div>
              </div>
            </FadeInWhenVisible>

            {/* Step 2 */}
            <FadeInWhenVisible delay={0.12}>
              <div className="relative bg-gradient-to-b from-teal-50 to-white rounded-3xl p-7 sm:p-8 border border-teal-100 shadow-sm h-full">
                <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-extrabold text-lg mb-5 shadow-md shadow-teal-500/20">
                  2
                </div>
                <h3 className="font-extrabold text-slate-900 text-xl mb-3">
                  The Strategy<br />
                  <span className="text-teal-700 text-base font-bold">(AI-Powered)</span>
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Our AI looks at your debts — credit cards, bike loans, friend loans — and decides the <strong>fastest, most motivating way</strong> to pay them off one by one.
                </p>
                <div className="mt-5 flex items-center gap-2 text-xs font-bold text-teal-700">
                  <Brain className="w-4 h-4" />
                  <span>Powered by Google Gemini AI</span>
                </div>
              </div>
            </FadeInWhenVisible>

            {/* Step 3 */}
            <FadeInWhenVisible delay={0.19}>
              <div className="relative bg-gradient-to-b from-emerald-50 to-white rounded-3xl p-7 sm:p-8 border border-emerald-100 shadow-sm h-full">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-extrabold text-lg mb-5 shadow-md shadow-emerald-500/20">
                  3
                </div>
                <h3 className="font-extrabold text-slate-900 text-xl mb-3">
                  The Plan<br />
                  <span className="text-emerald-700 text-base font-bold">(Plain English)</span>
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  You get a <strong>simple 4-step daily action plan</strong>. No confusing percentages, no financial jargon — just <strong>exact Rupee amounts</strong> telling you what to pay and when.
                </p>
                <div className="mt-5 flex items-center gap-2 text-xs font-bold text-emerald-700">
                  <FileText className="w-4 h-4" />
                  <span>Clear steps anyone can follow</span>
                </div>
              </div>
            </FadeInWhenVisible>

          </div>

          {/* Mid-Section CTA */}
          <FadeInWhenVisible delay={0.25}>
            <div className="mt-12 sm:mt-16 flex justify-center">
              <button
                onClick={handleCTA}
                className="bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold px-8 py-4 rounded-2xl text-base shadow-xl shadow-emerald-500/25 transition-all flex items-center justify-center gap-2.5 cursor-pointer group min-h-[56px]"
              >
                <span>{isAuthenticated ? 'See My Plan' : 'Get Your Free Action Plan'}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </FadeInWhenVisible>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 4 — EXPENSE TRACKER FEATURE
          ═══════════════════════════════════════════════════════════════════ */}
      <section id="features" className="w-full py-16 sm:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <FadeInWhenVisible>
            <div className="bg-slate-900 text-white rounded-[2rem] p-7 sm:p-10 lg:p-14 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
              <div className="space-y-4 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 text-emerald-300 text-xs sm:text-sm font-bold">
                  <Receipt className="w-4 h-4" />
                  Also Included
                </div>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight">
                  Track every Rupee<br className="hidden sm:block" /> you spend. Instantly.
                </h3>
                <p className="text-slate-300 text-sm sm:text-base max-w-xl leading-relaxed font-medium">
                  Just type <em>"petrol HP ₹500"</em> and it auto-tags as <strong>Fuel</strong>. Get warnings when your fuel, food, or maintenance spending crosses safe limits. No forms, no hassle.
                </p>
                <ul className="space-y-2.5 text-left inline-block pt-2">
                  <li className="flex items-center gap-2.5 text-sm text-slate-200">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>Smart auto-tagging for common expenses</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-sm text-slate-200">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>Spending alerts before you overshoot</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-sm text-slate-200">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>Works offline — syncs when you're back online</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={onEnterApp}
                className="bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-slate-950 font-extrabold px-8 py-4 rounded-2xl text-base shadow-lg transition-all whitespace-nowrap cursor-pointer shrink-0 min-h-[56px]"
              >
                Try Expense Tracker →
              </button>
            </div>
          </FadeInWhenVisible>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 5 — FINAL CTA + TRUST FOOTER
          ═══════════════════════════════════════════════════════════════════ */}
      <footer className="mt-auto bg-slate-900 text-white pt-16 sm:pt-20 pb-8 w-full">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">

          {/* Big CTA Banner */}
          <FadeInWhenVisible>
            <div className="bg-gradient-to-br from-emerald-800 via-emerald-900 to-teal-900 rounded-[2rem] p-8 sm:p-12 lg:p-16 text-center space-y-6 border border-emerald-700/30 shadow-2xl relative overflow-hidden">
              {/* Decorative glow */}
              <div className="absolute top-0 right-0 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight relative">
                Your money. Your control.<br className="hidden sm:block" />
                <span className="text-emerald-300"> Start today.</span>
              </h2>
              <p className="text-emerald-100/80 text-sm sm:text-base font-medium max-w-lg mx-auto leading-relaxed relative">
                Join thousands of delivery partners, drivers, and freelancers who are building a safer financial future — one step at a time.
              </p>
              <div className="pt-2 flex justify-center relative">
                <button
                  onClick={handleCTA}
                  className="bg-white hover:bg-emerald-50 active:scale-[0.98] text-slate-900 font-extrabold px-8 sm:px-10 py-4 sm:py-5 rounded-2xl text-base sm:text-lg shadow-2xl transition-all flex items-center gap-3 cursor-pointer group min-h-[56px]"
                >
                  <IndianRupee className="w-5 h-5 text-emerald-600" />
                  <span>{isAuthenticated ? 'Go to Your Dashboard' : 'Get Your Free Action Plan'}</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                </button>
              </div>
            </div>
          </FadeInWhenVisible>

          {/* Trust Banner */}
          <div className="bg-slate-800/50 rounded-2xl p-5 sm:p-6 border border-slate-700/40 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-center sm:text-left">
            <div className="flex items-center gap-2.5 text-sm text-slate-300 font-medium">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>100% mathematically verified calculations</span>
            </div>
            <div className="hidden sm:block w-px h-5 bg-slate-700" />
            <div className="flex items-center gap-2.5 text-sm text-slate-300 font-medium">
              <Lock className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Your data is encrypted & never shared</span>
            </div>
            <div className="hidden sm:block w-px h-5 bg-slate-700" />
            <div className="flex items-center gap-2.5 text-sm text-slate-300 font-medium">
              <Heart className="w-5 h-5 text-emerald-400 shrink-0 fill-emerald-400" />
              <span>Made with ❤️ for gig workers</span>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800/80 pt-8 text-sm text-slate-400">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                ₹
              </div>
              <span className="font-bold text-white">SmartRupee</span>
              <span>— Smart Finance for Gig Workers</span>
            </div>
            <div className="text-xs sm:text-sm">
              Powered by <strong className="text-white">Google Gemini AI</strong> & <strong className="text-white">FastAPI</strong>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
