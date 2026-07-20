import React, { useState, useEffect } from 'react';
import { createExpense, getExpenses, getExpenseSummary, deleteExpense } from '../services/api';
import { toast } from 'sonner';
import { Receipt, Plus, Trash2, AlertTriangle, PieChart as PieIcon, Sparkles } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const CATEGORIES = [
  { id: 'fuel', label: 'Fuel', color: '#059669' },
  { id: 'maintenance', label: 'Vehicle Repair', color: '#d97706' },
  { id: 'food', label: 'Food & Tea', color: '#2563eb' },
  { id: 'recharge', label: 'Mobile Data', color: '#7c3aed' },
  { id: 'rent', label: 'Rent', color: '#db2777' },
  { id: 'utilities', label: 'Utilities', color: '#0891b2' },
  { id: 'healthcare', label: 'Healthcare', color: '#dc2626' },
  { id: 'other', label: 'Other', color: '#64748b' },
];

export default function ExpenseView() {
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [category, setCategory] = useState('');
  const [autoTag, setAutoTag] = useState(null);

  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  // Keyword auto-tagging preview on notes input
  useEffect(() => {
    if (!notes) {
      setAutoTag(null);
      return;
    }
    const n = notes.toLowerCase();
    if (/\b(petrol|diesel|ev|charging|hp|iocl|bunk)\b/.test(n)) setAutoTag('fuel');
    else if (/\b(mechanic|puncture|oil|service|brake|tyre|repair)\b/.test(n)) setAutoTag('maintenance');
    else if (/\b(chai|tea|lunch|dinner|breakfast|samosa|thali)\b/.test(n)) setAutoTag('food');
    else if (/\b(jio|airtel|vi|recharge|mobile)\b/.test(n)) setAutoTag('recharge');
    else setAutoTag(null);
  }, [notes]);

  const fetchData = async () => {
    try {
      const [list, sum] = await Promise.all([getExpenses(20), getExpenseSummary(30)]);
      setExpenses(list);
      setSummary(sum);
    } catch (err) {
      console.warn('Failed to load expenses data:', err);
    }
  };

  const handleCreateExpense = async (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid expense amount');
      return;
    }

    setLoading(true);
    try {
      await createExpense({
        amount: parseFloat(amount),
        notes: notes.trim() || undefined,
        category: category || autoTag || undefined,
      });

      toast.success('Expense saved!');
      setAmount('');
      setNotes('');
      setCategory('');
      fetchData();
    } catch (err) {
      toast.error('Failed to save expense');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteExpense(id);
      toast.success('Expense removed');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete expense');
    }
  };

  // Build Recharts data
  const pieData = summary
    ? summary.category_breakdown
        .filter((c) => c.total_amount > 0)
        .map((c) => ({
          name: c.category.toUpperCase(),
          value: c.total_amount,
          color: CATEGORIES.find((item) => item.id === c.category)?.color || '#64748b',
        }))
    : [];

  return (
    <div className="space-y-4">

      {/* ── Header with Total ── */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Expense Tracker</h2>
              <p className="text-slate-500 text-xs mt-0.5">Quick daily logging with smart auto-tagging</p>
            </div>
          </div>
          {summary && (
            <div className="bg-emerald-50 px-3.5 py-2.5 rounded-lg border border-emerald-200 w-full sm:w-auto text-center sm:text-right">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600 block">30-Day Total</span>
              <span className="text-lg font-bold text-emerald-800">
                ₹{summary.total_monthly_expenses.toLocaleString('en-IN')}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── Spending Warning Alerts ── */}
      {summary && summary.alerts && summary.alerts.length > 0 && (
        <div className="space-y-2">
          {summary.alerts.map((alertMsg, idx) => (
            <div key={idx} className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2.5 text-sm text-amber-900 font-medium">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>{alertMsg}</span>
            </div>
          ))}
        </div>
      )}

      {/* ── Main Content Layout ── */}
      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-4">

        {/* ═══ Quick Log Form ═══ */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-2.5 flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-600" />
              Quick Add
            </h3>

            <form onSubmit={handleCreateExpense} className="space-y-3.5">
              {/* Amount */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 350"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 h-11 text-base font-semibold text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Notes with Auto-tag Indicator */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                    What did you spend on?
                  </label>
                  {autoTag && !category && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Auto: {autoTag.toUpperCase()}
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Petrol HP Bunk, Chai samosa"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 h-11 text-base font-medium text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Category pills */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1.5">
                  Category (optional)
                </label>
                <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(category === cat.id ? '' : cat.id)}
                      className={`px-3 h-10 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                        category === cat.id
                          ? 'bg-emerald-600 text-white border-emerald-600 font-bold'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 active:bg-slate-200'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white font-semibold h-12 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-base"
              >
                {loading ? 'Saving...' : 'Save Expense'}
              </button>
            </form>
          </div>

          {/* ── Recent Logs ── */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs space-y-3">
            <h4 className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Recent Expenses</h4>

            <div className="space-y-2 max-h-72 overflow-y-auto">
              {expenses.length === 0 ? (
                <p className="text-sm text-slate-400 italic text-center py-6">No expenses logged yet. Start tracking above!</p>
              ) : (
                expenses.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200/70">
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-900 text-sm truncate">{item.notes || item.category.toUpperCase()}</div>
                      <div className="text-[11px] text-slate-400 uppercase font-semibold">{item.category}</div>
                    </div>
                    <div className="flex items-center gap-2.5 shrink-0">
                      <span className="font-bold text-slate-900 text-sm">₹{item.amount.toLocaleString('en-IN')}</span>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 p-1.5 rounded-md transition-colors cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* ═══ Category Breakdown & Chart ═══ */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2.5">
              <PieIcon className="w-4 h-4 text-emerald-600" />
              Where Your Money Goes (30 Days)
            </h3>

            {pieData.length > 0 ? (
              <div className="h-52 sm:h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="py-8 text-center text-sm text-slate-400 italic">
                Log some expenses to see your spending breakdown here.
              </div>
            )}

            {/* Category breakdown cards */}
            {summary && (
              <div className="space-y-2 pt-2.5 border-t border-slate-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {summary.category_breakdown.map((c) => (
                    <div key={c.category} className="p-3 rounded-lg bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: CATEGORIES.find(item => item.id === c.category)?.color || '#64748b' }}></span>
                        <span className="font-semibold text-slate-800 text-xs uppercase">{c.category}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-slate-900 text-xs">₹{c.total_amount.toLocaleString('en-IN')}</span>
                        <span className="text-[10px] text-slate-400 block font-normal">{c.percentage_of_total}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
