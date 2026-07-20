import React, { useState, useEffect } from 'react';
import { getAnalysisHistory } from '../services/api';
import { History, Calendar, CheckCircle2, RefreshCw, Shield, Brain } from 'lucide-react';
import { toast } from 'sonner';

export default function HistoryView() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await getAnalysisHistory();
      if (res.status === 'success' && res.records) {
        setHistory(res.records);
      } else {
        setHistory([]);
      }
    } catch (err) {
      toast.error('Failed to load past plans');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">

      {/* ── Header ── */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <History className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-slate-900 truncate">Past Plans</h2>
            <p className="text-slate-500 text-xs mt-0.5">Plans you've created before</p>
          </div>
        </div>

        <button
          onClick={fetchHistory}
          disabled={loading}
          className="w-10 h-10 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer flex items-center justify-center shrink-0"
          title="Refresh"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* ── Loading ── */}
      {loading && (
        <div className="bg-white border border-slate-200/80 rounded-xl p-8 text-center text-slate-500 text-sm shadow-xs">
          <div className="w-7 h-7 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2.5"></div>
          Loading your past plans...
        </div>
      )}

      {/* ── Empty ── */}
      {!loading && history.length === 0 && (
        <div className="bg-white border border-slate-200/80 rounded-xl p-8 text-center space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <History className="w-6 h-6" />
          </div>
          <h3 className="text-slate-900 font-semibold text-base">No Past Plans Yet</h3>
          <p className="text-slate-500 text-sm max-w-xs mx-auto">
            Go to the Smart Debt Planner tab and create your first plan to see it saved here.
          </p>
        </div>
      )}

      {/* ── History Cards List ── */}
      {!loading && history.length > 0 && (
        <div className="space-y-6">
          {history.map((record, recordIdx) => {
            const avgIncome = record.avg_income || 0;
            const volatility = record.volatility_pct || 0;
            const emergencyBuffer = record.emergency_buffer || 0;
            const availableToPay = record.debt_repayment_surplus ?? record.surplus ?? 0;
            const riskLevel = record.risk_level || 'MEDIUM';
            const strategy = record.chosen_strategy || 'AVALANCHE';
            const orderedDebts = record.ordered_debts || [];
            const actionPlan = record.action_plan || [];
            const reasoning = record.strategy_reasoning || '';
            const createdAt = record.created_at ? new Date(record.created_at).toLocaleString('en-IN') : 'Saved Run';

            const firstDebtName = orderedDebts[0]?.name || 'primary debt';
            const firstDebtPay = orderedDebts[0]?.recommended_monthly_payment || availableToPay;
            const safeSpend = Math.max(0, avgIncome - emergencyBuffer - firstDebtPay);

            return (
              <div key={record._id || recordIdx} className="bg-slate-50/60 border border-slate-200/90 rounded-2xl p-4 sm:p-5 space-y-4 shadow-sm">
                
                {/* Timestamp & Strategy Card Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white p-3 rounded-xl border border-slate-200/70">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                    <Calendar className="w-4 h-4 text-emerald-600" />
                    <span>Plan Saved on: <strong>{createdAt}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                      {strategy === 'AVALANCHE' ? '💰 Avalanche Strategy' : '⚡ Snowball Strategy'}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      riskLevel === 'HIGH' ? 'bg-red-100 text-red-700' :
                      riskLevel === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {riskLevel} RISK
                    </span>
                  </div>
                </div>

                {/* ── 1. Your Money Breakdown ── */}
                <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                    <span className="text-base sm:text-lg font-semibold text-slate-900 flex items-center gap-1.5">
                      <Shield className="w-4 h-4 text-emerald-600" />
                      Your Money Breakdown
                    </span>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold self-start sm:self-auto ${
                      riskLevel === 'HIGH' ? 'bg-red-100 text-red-700 border border-red-200' :
                      riskLevel === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' : 'bg-green-100 text-green-800 border border-green-200'
                    }`}>
                      {riskLevel === 'HIGH' ? '🔴 Your income changes a lot' :
                       riskLevel === 'MEDIUM' ? '🟡 Your income has some ups & downs' : '🟢 Your income is steady'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/70">
                      <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block mb-0.5">Average Earnings</span>
                      <span className="text-base sm:text-lg font-bold text-slate-900">₹{avgIncome.toLocaleString('en-IN')}</span>
                    </div>
                    <div className={`p-3 rounded-lg border ${
                      riskLevel === 'HIGH' ? 'bg-red-50 border-red-200' :
                      riskLevel === 'MEDIUM' ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200'
                    }`}>
                      <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block mb-0.5">Income Swing</span>
                      <span className={`text-base sm:text-lg font-bold ${
                        riskLevel === 'HIGH' ? 'text-red-700' :
                        riskLevel === 'MEDIUM' ? 'text-yellow-700' : 'text-green-700'
                      }`}>{volatility}%</span>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                      <span className="text-[11px] uppercase tracking-wider text-yellow-700 font-semibold block mb-0.5">🛡️ Safety Net</span>
                      <span className="text-base sm:text-lg font-bold text-yellow-800">₹{emergencyBuffer.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                      <span className="text-[11px] uppercase tracking-wider text-green-700 font-semibold block mb-0.5">✅ Available to Pay</span>
                      <span className="text-base sm:text-lg font-bold text-green-800">₹{availableToPay.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                {/* ── 2. Best Way to Pay Off Your Debts ── */}
                {reasoning && (
                  <div className="bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200/80 rounded-xl p-4 shadow-xs space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <span className="text-base font-semibold text-teal-900 flex items-center gap-1.5">
                        <Brain className="w-4 h-4 text-teal-700" />
                        Best Way to Pay Off Your Debts
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-teal-600 text-white shadow-xs self-start sm:self-auto">
                        {strategy === 'AVALANCHE' ? '💰 Save the Most Interest' : '⚡ Quick Wins First'}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed bg-white/70 p-3 rounded-lg border border-teal-100">
                      "{reasoning}"
                    </p>
                  </div>
                )}

                {/* ── 3. What to Pay & When ── */}
                {orderedDebts.length > 0 && (
                  <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs space-y-3">
                    <h3 className="text-base sm:text-lg font-semibold text-slate-900">
                      💳 What to Pay & When
                    </h3>

                    <div className="space-y-2.5">
                      {orderedDebts.map((item, idx) => (
                        <div key={item.payoff_order || idx} className={`rounded-xl border overflow-hidden ${
                          idx === 0 ? 'border-emerald-400 bg-emerald-50/40' : 'border-slate-200 bg-white'
                        }`}>
                          {idx === 0 && (
                            <div className="bg-emerald-600 text-white text-xs font-semibold px-3 py-1 text-center">
                              👆 Pay This First
                            </div>
                          )}
                          <div className="p-3.5 space-y-2.5">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className={`w-7 h-7 rounded-full font-bold flex items-center justify-center text-xs shrink-0 ${
                                  idx === 0 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                                }`}>
                                  {item.payoff_order || idx + 1}
                                </div>
                                <div>
                                  <div className="font-semibold text-slate-900 text-base">{item.name}</div>
                                  <span className={`text-xs font-medium ${
                                    item.lender_type === 'informal' ? 'text-purple-600' : 'text-blue-600'
                                  }`}>
                                    {item.lender_type === 'informal' ? '👤 Friend / Family' : '🏦 Bank / App'}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                              <div className="bg-slate-50 rounded-lg p-2 text-center border border-slate-200/70">
                                <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-0.5">Amount Owed</div>
                                <div className="text-sm font-bold text-slate-900">₹{(item.amount || 0).toLocaleString('en-IN')}</div>
                              </div>
                              <div className={`rounded-lg p-2 text-center border ${
                                item.rate >= 20 ? 'bg-red-50 border-red-200' :
                                item.rate >= 10 ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200'
                              }`}>
                                <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-0.5">Interest</div>
                                <div className={`text-sm font-bold ${
                                  item.rate >= 20 ? 'text-red-700' :
                                  item.rate >= 10 ? 'text-yellow-700' : 'text-green-700'
                                }`}>{item.rate || 0}%</div>
                              </div>
                              <div className="bg-emerald-50 rounded-lg p-2 text-center border border-emerald-200">
                                <div className="text-[10px] uppercase tracking-wider text-emerald-700 font-semibold mb-0.5">Next Payment</div>
                                <div className="text-sm font-bold text-emerald-800">₹{(item.recommended_monthly_payment || 0).toLocaleString('en-IN')}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── 4. Your Step-by-Step Plan ── */}
                <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base sm:text-lg font-semibold text-slate-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Your Step-by-Step Plan
                    </h3>
                    <span className="text-[10px] uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold border border-emerald-200">
                      Stage 3: Grounded Advice
                    </span>
                  </div>

                  {/* WhatsApp Guidance Card */}
                  <div className="bg-emerald-900 text-white rounded-xl p-4 space-y-2.5 shadow-sm border border-emerald-800">
                    <div className="flex items-center justify-between text-xs text-emerald-300 font-bold border-b border-emerald-800/80 pb-2">
                      <span className="flex items-center gap-1.5">
                        💬 WhatsApp Action Guidance
                      </span>
                      <span>100% Grounded (0% AI Hallucinations)</span>
                    </div>
                    <div className="space-y-1.5 text-xs text-slate-100 font-normal leading-relaxed">
                      <p className="font-semibold text-emerald-200">
                        Hi Ramesh! Here is your safe debt plan for this month based on your payouts:
                      </p>
                      <p>
                        ☔ <strong>Rainy-Day Reserve:</strong> Keep ₹{emergencyBuffer.toLocaleString('en-IN')} locked in your cash box so slow order days don't force you back into borrowing.
                      </p>
                      <p>
                        💳 <strong>Monthly Debt Focus:</strong> Pay ₹{firstDebtPay.toLocaleString('en-IN')} to {firstDebtName} first.
                      </p>
                      <p>
                        ✅ <strong>Safe Spending:</strong> You have ₹{safeSpend.toLocaleString('en-IN')} safe to spend on petrol & meals.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 pt-1">
                    {actionPlan.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-200/70 text-sm text-slate-600 leading-relaxed">
                        <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                          {idx + 1}
                        </div>
                        <span className="font-normal text-slate-700">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
