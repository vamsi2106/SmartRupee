import React, { useState } from 'react';
import { Activity, Plus, ChevronLeft, User, LogOut, X } from 'lucide-react';

export default function HeaderBar({ activeTab, onQuickExpense, user, onOpenAuth, onLogout, onViewLanding }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const titles = {
    advisory: { title: 'Smart Debt Planner', subtitle: 'Your personalized payoff plan' },
    expenses: { title: 'Expense Tracker', subtitle: 'Log your daily spending' },
    history: { title: 'Past Plans', subtitle: 'Your saved plans' },
  };

  const current = titles[activeTab] || titles.advisory;

  return (
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-lg border-b border-slate-200/80">
      <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 min-h-[52px]">

        {/* Left: Back + Title */}
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Back to landing — mobile only */}
          <button
            onClick={onViewLanding}
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer shrink-0"
            aria-label="Back to home"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-semibold text-slate-900 tracking-tight truncate">
              {current.title}
            </h1>
            <p className="text-xs text-slate-500 font-normal truncate hidden sm:block">
              {current.subtitle}
            </p>
          </div>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Status — desktop only */}
          <div className="hidden lg:flex items-center gap-2 px-3 h-9 bg-emerald-50 rounded-lg border border-emerald-200/70 text-xs font-semibold text-emerald-700">
            <Activity className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            <span>All systems ready</span>
          </div>

          {/* Quick-add expense button */}
          {activeTab !== 'expenses' && (
            <button
              onClick={onQuickExpense}
              className="flex items-center justify-center gap-1.5 px-3.5 h-10 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs sm:text-sm font-semibold shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Expense</span>
            </button>
          )}

          {/* Mobile user/menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            aria-label="User menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : (
              user ? (
                <div className="w-7 h-7 rounded-md bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              ) : (
                <User className="w-4 h-4" />
              )
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-3 py-3 space-y-2.5 shadow-md">
          {user ? (
            <>
              <div className="flex items-center gap-2.5 p-2.5 bg-slate-50 rounded-lg border border-slate-200/80">
                <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm shrink-0">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-slate-900 truncate">{user.name}</div>
                  <div className="text-xs text-slate-500 font-normal truncate">
                    {user.gig_platform || 'Gig Worker'}
                  </div>
                </div>
              </div>
              <button
                onClick={() => { setMenuOpen(false); onViewLanding(); }}
                className="w-full flex items-center gap-2.5 px-3 h-11 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4 text-slate-400" />
                Back to Home
              </button>
              <button
                onClick={() => { setMenuOpen(false); onLogout(); }}
                className="w-full flex items-center gap-2.5 px-3 h-11 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </>
          ) : (
            <button
              onClick={() => { setMenuOpen(false); onOpenAuth(); }}
              className="w-full flex items-center justify-center gap-2 px-3 h-11 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold transition-all cursor-pointer"
            >
              <User className="w-4 h-4" />
              Sign In / Create Account
            </button>
          )}
        </div>
      )}
    </header>
  );
}
