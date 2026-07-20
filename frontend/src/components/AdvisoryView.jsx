import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { runDebtAnalysis, getExpenseSummary } from '../services/api';
import { toast } from 'sonner';
import { Sparkles, Plus, Trash2, ArrowRight, ChevronRight, ChevronLeft, CheckCircle2, IndianRupee, Shield, Brain, RefreshCw } from 'lucide-react';

export default function AdvisoryView({ user, onOpenAuth }) {
  const [step, setStep] = useState(1);
  const [incomes, setIncomes] = useState([12000, 18000, 9000, 22000]);
  const [monthlyExpenses, setMonthlyExpenses] = useState(14000);
  const [debts, setDebts] = useState([
    { name: 'Credit Card', amount: 25000, rate: 24.0, lender_type: 'formal' },
    { name: 'Friend Loan', amount: 8000, rate: 0.0, lender_type: 'informal' },
  ]);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // Income handlers
  const handleAddIncome = () => {
    if (incomes.length >= 12) {
      toast.error('Maximum 12 income entries allowed');
      return;
    }
    setIncomes([...incomes, 10000]);
  };

  const handleUpdateIncome = (index, value) => {
    const next = [...incomes];
    next[index] = parseFloat(value) || 0;
    setIncomes(next);
  };

  const handleRemoveIncome = (index) => {
    if (incomes.length <= 1) {
      toast.error('At least 1 income entry is required');
      return;
    }
    setIncomes(incomes.filter((_, i) => i !== index));
  };

  // Debt handlers
  const handleAddDebt = () => {
    if (debts.length >= 10) {
      toast.error('Maximum 10 active debts allowed');
      return;
    }
    setDebts([...debts, { name: '', amount: 10000, rate: 12.0, lender_type: 'formal' }]);
  };

  const handleUpdateDebt = (index, field, value) => {
    const next = [...debts];
    next[index][field] = field === 'name' || field === 'lender_type' ? value : parseFloat(value) || 0;
    setDebts(next);
  };

  const handleRemoveDebt = (index) => {
    if (debts.length <= 1) {
      toast.error('At least 1 active debt is required');
      return;
    }
    setDebts(debts.filter((_, i) => i !== index));
  };

  // Load Ramesh's Gig Worker Scenario
  const handleLoadRameshStory = () => {
    setIncomes([4000, 1500, 5000, 2500]);
    setMonthlyExpenses(3000);
    setDebts([
      { name: 'Credit Card', amount: 12000, rate: 24.0, lender_type: 'formal' },
      { name: 'Friend Loan', amount: 5000, rate: 0.0, lender_type: 'informal' },
    ]);
    toast.success("Loaded Ramesh's Scenario: Zomato rider with volatile payouts!");
  };

  // Auto-fill expenses from Tracker
  const handleAutofillExpenses = async () => {
    try {
      const summary = await getExpenseSummary(30);
      if (summary.total_monthly_expenses > 0) {
        setMonthlyExpenses(summary.total_monthly_expenses);
        toast.success(`Autofilled ₹${summary.total_monthly_expenses.toLocaleString('en-IN')} from Expense Tracker!`);
      } else {
        toast.info('No expenses logged in tracker yet.');
      }
    } catch (err) {
      toast.error('Failed to fetch expense summary');
    }
  };

  // Submit Analysis
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!user) {
      toast.error('Please sign in first to get your plan.');
      if (onOpenAuth) onOpenAuth();
      return;
    }
    const validIncomes = incomes.filter(n => n > 0);
    const validDebts = debts.filter(d => d.name.trim() !== '' && d.amount > 0);

    if (validIncomes.length === 0) {
      toast.error('Please enter at least one income amount');
      setStep(1);
      return;
    }
    if (validDebts.length === 0) {
      toast.error('Please enter at least one debt');
      setStep(3);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        income_entries: validIncomes,
        monthly_expenses: monthlyExpenses,
        debts: validDebts,
      };

      const data = await runDebtAnalysis(payload);
      setResult(data);
      setStep(4);
      toast.success('Your action plan is ready!');
    } catch (err) {
      const errorMsg = err.response?.data?.detail || err.message || 'Something went wrong';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3 max-w-2xl mx-auto">

      {/* ── Auth Banner ── */}
      {!user && (
        <div className="bg-amber-50 border border-amber-200/90 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-amber-900 shadow-xs">
          <div className="flex items-start gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center text-sm shrink-0">
              🔒
            </div>
            <div>
              <div className="font-semibold text-xs">Sign in to get your plan</div>
              <div className="text-[11px] text-amber-800 mt-0.5">
                Create a free account to run your personalized debt payoff analysis.
              </div>
            </div>
          </div>
          <button
            onClick={onOpenAuth}
            className="w-full sm:w-auto px-3 h-9 bg-amber-900 hover:bg-amber-950 text-white rounded-lg text-xs font-semibold transition-all cursor-pointer shrink-0"
          >
            Sign In / Register
          </button>
        </div>
      )}

      {/* ── Animated Stepper Navigation Header ── */}
      <div className="bg-white border border-slate-200/80 rounded-xl px-3 py-2.5 shadow-xs">
        <div className="flex items-center justify-between gap-1">
          {[
            { id: 1, label: 'Earnings' },
            { id: 2, label: 'Expenses' },
            { id: 3, label: 'Debts' },
            { id: 4, label: 'Plan' },
          ].map((s, idx) => {
            const isActive = step === s.id;
            const isCompleted = step > s.id;
            const isDisabled = s.id === 4 && !result;

            return (
              <React.Fragment key={s.id}>
                <motion.button
                  type="button"
                  onClick={() => (!isDisabled || result) && setStep(s.id)}
                  disabled={isDisabled}
                  animate={{ scale: isActive ? 1.05 : 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className={`flex items-center justify-center sm:justify-start gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-xs font-bold'
                      : isCompleted
                      ? 'bg-emerald-50 text-emerald-800 font-semibold'
                      : isDisabled
                      ? 'text-slate-300 opacity-50 cursor-not-allowed'
                      : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                    isActive ? 'bg-white text-emerald-700' : isCompleted ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {s.id}
                  </span>
                  <span className="hidden sm:inline">{s.label}</span>
                </motion.button>
                {idx < 3 && <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* ── Main Animated Step Content ── */}
      <AnimatePresence mode="wait">
        
        {/* ═══════════════════════════════════════════════════════════════════════
            STEP 1: EARNINGS PAYOUTS
            ═══════════════════════════════════════════════════════════════════ */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white border border-slate-200/80 rounded-xl px-3 py-4 space-y-3 shadow-xs"
          >
            {/* Header */}
            <div className="space-y-2 border-b border-slate-100 pb-3">
              <div className="space-y-0.5">
                <h2 className="text-base font-semibold text-slate-900 leading-tight flex items-center gap-1.5">
                  <IndianRupee className="w-4 h-4 text-emerald-600 shrink-0" />
                  Step 1: Your Weekly / Monthly Payouts
                </h2>
                <p className="text-xs text-slate-500 font-normal">
                  Add your recent earnings payouts to calculate your income volatility.
                </p>
              </div>

              <button
                type="button"
                onClick={handleLoadRameshStory}
                className="w-full text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 px-3 py-2 rounded-lg border border-amber-200/90 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>⚡ Load Ramesh's Story</span>
              </button>
            </div>

            {/* Income Inputs */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                  Income Payout Entries (₹)
                </label>
                <button
                  type="button"
                  onClick={handleAddIncome}
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer px-2 py-1 rounded-md hover:bg-emerald-50"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Payout Entry
                </button>
              </div>

              <div className="space-y-2">
                {incomes.map((amount, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-slate-50/90 p-1.5 rounded-lg border border-slate-200/70">
                    <span className="text-xs font-bold text-slate-400 pl-1.5 shrink-0 w-6">#{idx + 1}</span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => handleUpdateIncome(idx, e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-md px-2.5 h-9 text-sm font-semibold text-slate-900 focus:outline-none focus:border-emerald-500"
                      placeholder="Amount ₹"
                    />
                    {incomes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveIncome(idx)}
                        className="w-8 h-9 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer flex items-center justify-center shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-semibold h-10 px-5 rounded-lg shadow-xs transition-all flex items-center gap-1.5 cursor-pointer text-xs"
              >
                <span>Next: Living Expenses</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════════
            STEP 2: MONTHLY EXPENSES
            ═══════════════════════════════════════════════════════════════════ */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white border border-slate-200/80 rounded-xl px-3 py-4 space-y-3 shadow-xs"
          >
            <div className="space-y-2 border-b border-slate-100 pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-base font-semibold text-slate-900 leading-tight flex items-center gap-1.5">
                    🛒 Step 2: Essential Monthly Expenses
                  </h2>
                  <p className="text-xs text-slate-500 font-normal mt-0.5">
                    How much do you spend on petrol, food, rent, and phone recharge every month?
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAutofillExpenses}
                  className="text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1.5 rounded-lg border border-emerald-200 transition-all cursor-pointer h-9 shrink-0"
                >
                  Auto-fill from Expense Tracker
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                Essential Monthly Expenses (₹)
              </label>
              <input
                type="number"
                value={monthlyExpenses}
                onChange={(e) => setMonthlyExpenses(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 h-10 text-sm font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
                placeholder="e.g. 14000"
              />
              <p className="text-[11px] text-slate-400">Includes rent, food, petrol/EV charging, and phone recharge.</p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold h-10 px-4 rounded-lg transition-all flex items-center gap-1 cursor-pointer text-xs"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-semibold h-10 px-5 rounded-lg shadow-xs transition-all flex items-center gap-1.5 cursor-pointer text-xs"
              >
                <span>Next: Active Debts</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════════
            STEP 3: ACTIVE DEBTS & LOANS
            ═══════════════════════════════════════════════════════════════════ */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white border border-slate-200/80 rounded-xl px-3 py-4 space-y-3 shadow-xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-semibold text-slate-900 leading-tight flex items-center gap-1.5">
                  💳 Step 3: Active Debts & Loans
                </h2>
                <p className="text-xs text-slate-500 font-normal mt-0.5">
                  List your credit card balances, bike loan EMIs, or informal loans from friends.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddDebt}
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer px-2 py-1 rounded-lg hover:bg-emerald-50 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" /> Add Debt
              </button>
            </div>

            <div className="space-y-2">
              {debts.map((d, idx) => (
                <div key={idx} className="bg-slate-50/90 p-2.5 rounded-lg border border-slate-200/70 space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={d.name}
                      onChange={(e) => handleUpdateDebt(idx, 'name', e.target.value)}
                      placeholder="e.g. Credit Card, Friend Loan"
                      className="w-full bg-white border border-slate-200 rounded-md px-2.5 h-9 text-sm font-semibold text-slate-900 focus:outline-none focus:border-emerald-500"
                    />
                    {debts.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveDebt(idx)}
                        className="w-8 h-9 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer flex items-center justify-center shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-0.5">Balance ₹</label>
                      <input
                        type="number"
                        value={d.amount}
                        onChange={(e) => handleUpdateDebt(idx, 'amount', e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-md px-2.5 h-9 text-sm font-semibold text-slate-900 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-0.5">Interest %</label>
                      <input
                        type="number"
                        value={d.rate}
                        onChange={(e) => handleUpdateDebt(idx, 'rate', e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-md px-2.5 h-9 text-sm font-semibold text-slate-900 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-0.5">Lender Type</label>
                      <select
                        value={d.lender_type || 'formal'}
                        onChange={(e) => handleUpdateDebt(idx, 'lender_type', e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-md px-2 h-9 text-xs font-semibold text-slate-800 focus:outline-none focus:border-emerald-500 appearance-none"
                      >
                        <option value="formal">Bank / App</option>
                        <option value="informal">Friend / Family</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold h-10 px-4 rounded-lg transition-all flex items-center gap-1 cursor-pointer text-xs"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-semibold h-10 px-5 rounded-lg shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 text-xs"
              >
                {loading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Calculating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
                    <span>Get My Action Plan</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════════
            STEP 4: ACTION PLAN RESULTS
            ═══════════════════════════════════════════════════════════════════ */}
        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            {/* Header Controls */}
            <div className="flex items-center justify-between bg-white border border-slate-200/80 rounded-xl p-3 shadow-xs">
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-emerald-700 bg-slate-50 hover:bg-slate-100 px-2.5 py-1.5 rounded-lg border border-slate-200 transition-all cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Edit Inputs</span>
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1.5 rounded-lg border border-emerald-200 transition-all cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>Re-run Analysis</span>
              </button>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="bg-white border border-slate-200/80 rounded-xl p-8 text-center space-y-3 shadow-xs">
                <div className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <h4 className="text-slate-900 font-semibold text-base">Creating your plan...</h4>
                <p className="text-sm text-slate-500">Analyzing income → Picking best strategy → Writing your steps</p>
              </div>
            )}

            {/* Results Cards */}
            {result && !loading && (
              <div className="space-y-3">
                
                {/* ── 1. Your Money Breakdown ── */}
                <div className="bg-white border border-slate-200/80 rounded-xl p-3 sm:p-4 shadow-xs space-y-2.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
                    <span className="text-base font-semibold text-slate-900 flex items-center gap-1.5">
                      <Shield className="w-4 h-4 text-emerald-600" />
                      Your Money Breakdown
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold self-start sm:self-auto ${
                      result.risk_level === 'HIGH' ? 'bg-red-100 text-red-700 border border-red-200' :
                      result.risk_level === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' : 'bg-green-100 text-green-800 border border-green-200'
                    }`}>
                      {result.risk_level === 'HIGH' ? '🔴 Your income changes a lot' :
                       result.risk_level === 'MEDIUM' ? '🟡 Your income has some ups & downs' : '🟢 Your income is steady'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/70">
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block mb-0.5">Average Earnings</span>
                      <span className="text-sm sm:text-base font-bold text-slate-900">₹{result.avg_income.toLocaleString('en-IN')}</span>
                    </div>
                    <div className={`p-2.5 rounded-lg border ${
                      result.risk_level === 'HIGH' ? 'bg-red-50 border-red-200' :
                      result.risk_level === 'MEDIUM' ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200'
                    }`}>
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block mb-0.5">Income Swing</span>
                      <span className={`text-sm sm:text-base font-bold ${
                        result.risk_level === 'HIGH' ? 'text-red-700' :
                        result.risk_level === 'MEDIUM' ? 'text-yellow-700' : 'text-green-700'
                      }`}>{result.volatility_pct}%</span>
                    </div>
                    <div className="bg-yellow-50 p-2.5 rounded-lg border border-yellow-200">
                      <span className="text-[10px] uppercase tracking-wider text-yellow-700 font-semibold block mb-0.5">🛡️ Safety Net</span>
                      <span className="text-sm sm:text-base font-bold text-yellow-800">₹{result.emergency_buffer.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="bg-green-50 p-2.5 rounded-lg border border-green-200">
                      <span className="text-[10px] uppercase tracking-wider text-green-700 font-semibold block mb-0.5">✅ Available to Pay</span>
                      <span className="text-sm sm:text-base font-bold text-green-800">₹{result.debt_repayment_surplus.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                {/* ── 2. Best Way to Pay Off ── */}
                <div className="bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200/80 rounded-xl p-3 sm:p-4 shadow-xs space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-sm sm:text-base font-semibold text-teal-900 flex items-center gap-1.5">
                      <Brain className="w-4 h-4 text-teal-700" />
                      Best Way to Pay Off Your Debts
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-600 text-white shadow-xs self-start sm:self-auto">
                      {result.chosen_strategy === 'AVALANCHE' ? '💰 Save the Most Interest' : '⚡ Quick Wins First'}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-white/70 p-2.5 rounded-lg border border-teal-100">
                    "{result.strategy_reasoning}"
                  </p>
                </div>

                {/* ── 3. What to Pay & When ── */}
                <div className="bg-white border border-slate-200/80 rounded-xl p-3 sm:p-4 shadow-xs space-y-2.5">
                  <h3 className="text-base font-semibold text-slate-900">
                    💳 What to Pay & When
                  </h3>

                  <div className="space-y-2">
                    {result.ordered_debts.map((item, idx) => (
                      <div key={item.payoff_order || idx} className={`rounded-xl border overflow-hidden ${
                        idx === 0 ? 'border-emerald-400 bg-emerald-50/40' : 'border-slate-200 bg-white'
                      }`}>
                        {idx === 0 && (
                          <div className="bg-emerald-600 text-white text-xs font-semibold px-3 py-0.5 text-center">
                            👆 Pay This First
                          </div>
                        )}
                        <div className="p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className={`w-6 h-6 rounded-full font-bold flex items-center justify-center text-xs shrink-0 ${
                                idx === 0 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                              }`}>
                                {item.payoff_order || idx + 1}
                              </div>
                              <div>
                                <div className="font-semibold text-slate-900 text-sm sm:text-base">{item.name}</div>
                                <span className={`text-[11px] font-medium ${
                                  item.lender_type === 'informal' ? 'text-purple-600' : 'text-blue-600'
                                }`}>
                                  {item.lender_type === 'informal' ? '👤 Friend / Family' : '🏦 Bank / App'}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-2">
                            <div className="bg-slate-50 rounded-lg p-1.5 text-center border border-slate-200/70">
                              <div className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold mb-0.5">Amount Owed</div>
                              <div className="text-xs font-bold text-slate-900">₹{item.amount.toLocaleString('en-IN')}</div>
                            </div>
                            <div className={`rounded-lg p-1.5 text-center border ${
                              item.rate >= 20 ? 'bg-red-50 border-red-200' :
                              item.rate >= 10 ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200'
                            }`}>
                              <div className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold mb-0.5">Interest</div>
                              <div className={`text-xs font-bold ${
                                item.rate >= 20 ? 'text-red-700' :
                                item.rate >= 10 ? 'text-yellow-700' : 'text-green-700'
                              }`}>{item.rate}%</div>
                            </div>
                            <div className="bg-emerald-50 rounded-lg p-1.5 text-center border border-emerald-200">
                              <div className="text-[9px] uppercase tracking-wider text-emerald-700 font-semibold mb-0.5">Next Payment</div>
                              <div className="text-xs font-bold text-emerald-800">₹{item.recommended_monthly_payment.toLocaleString('en-IN')}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── 4. Action Steps & WhatsApp Card ── */}
                <div className="bg-white border border-slate-200/80 rounded-xl p-3 sm:p-4 shadow-xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold text-slate-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Your Step-by-Step Plan
                    </h3>
                    <span className="text-[9px] uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold border border-emerald-200">
                      Stage 3 Advice
                    </span>
                  </div>

                  {/* WhatsApp Guidance Card */}
                  <div className="bg-emerald-900 text-white rounded-xl p-3.5 space-y-2 shadow-sm border border-emerald-800">
                    <div className="flex items-center justify-between text-[11px] text-emerald-300 font-bold border-b border-emerald-800/80 pb-1.5">
                      <span className="flex items-center gap-1">
                        💬 WhatsApp Action Guidance
                      </span>
                      <span>100% Grounded</span>
                    </div>
                    <div className="space-y-1 text-xs text-slate-100 font-normal leading-relaxed">
                      <p className="font-semibold text-emerald-200">
                        Hi Ramesh! Here is your safe debt plan for this month based on your payouts:
                      </p>
                      <p>
                        ☔ <strong>Rainy-Day Reserve:</strong> Keep ₹{result.emergency_buffer.toLocaleString('en-IN')} locked in your cash box so slow order days don't force you back into borrowing.
                      </p>
                      <p>
                        💳 <strong>Monthly Debt Focus:</strong> Pay ₹{result.ordered_debts[0]?.recommended_monthly_payment.toLocaleString('en-IN')} to {result.ordered_debts[0]?.name} first.
                      </p>
                      <p>
                        ✅ <strong>Safe Spending:</strong> You have ₹{Math.max(0, result.avg_income - result.emergency_buffer - (result.ordered_debts[0]?.recommended_monthly_payment || 0)).toLocaleString('en-IN')} safe to spend on petrol & meals.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-0.5">
                    {result.action_plan.map((stepItem, idx) => (
                      <div key={idx} className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200/70 text-xs sm:text-sm text-slate-600 leading-relaxed">
                        <div className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                          {idx + 1}
                        </div>
                        <span className="font-normal text-slate-700">{stepItem}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
