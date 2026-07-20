import React from 'react';
import { Sparkles, Receipt, History, User, LogOut, ShieldCheck, ChevronLeft } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, user, onOpenAuth, onLogout, onViewLanding }) {
  const navItems = [
    {
      id: 'advisory',
      label: 'Smart Debt Planner',
      subtitle: 'Your payoff action plan',
      icon: Sparkles,
    },
    {
      id: 'expenses',
      label: 'Expense Tracker',
      subtitle: 'Log daily spending',
      icon: Receipt,
    },
    {
      id: 'history',
      label: 'Past Plans',
      subtitle: 'Your saved results',
      icon: History,
    },
  ];

  return (
    <aside className="w-60 bg-white border-r border-slate-200/90 flex flex-col justify-between h-screen sticky top-0 z-30 shrink-0 select-none">
      {/* Top Header & Brand */}
      <div className="p-4 space-y-4">
        <div className="flex items-center gap-2.5 cursor-pointer group" onClick={onViewLanding}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-extrabold text-base shadow-xs shrink-0">
            ₹
          </div>
          <div>
            <div className="font-extrabold text-slate-900 text-base tracking-tight leading-none">
              SmartRupee
            </div>
            <span className="text-[11px] text-slate-400 font-medium group-hover:text-emerald-700 transition-colors flex items-center gap-1 mt-0.5">
              <ChevronLeft className="w-3 h-3" /> Back to Home
            </span>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="space-y-1">
          <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold px-2 mb-1.5">
            Menu
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-2.5 px-3 h-11 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-200' : 'text-slate-400'}`} />
                <div className="text-left">
                  <div className="leading-tight text-xs font-semibold">{item.label}</div>
                  <div className={`text-[10px] font-normal ${isActive ? 'text-emerald-100' : 'text-slate-400'}`}>
                    {item.subtitle}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* How It Works */}
        <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200/80 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            How It Works
          </div>

          <div className="space-y-1.5 text-xs text-slate-600">
            <div className="flex items-center gap-2 bg-white px-2 py-1 rounded border border-emerald-100">
              <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[9px] font-bold flex items-center justify-center shrink-0">1</span>
              <span>Calculate your numbers</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-2 py-1 rounded border border-emerald-100">
              <span className="w-4 h-4 rounded-full bg-teal-600 text-white text-[9px] font-bold flex items-center justify-center shrink-0">2</span>
              <span>Pick best strategy</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-2 py-1 rounded border border-emerald-100">
              <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[9px] font-bold flex items-center justify-center shrink-0">3</span>
              <span>Get clear action plan</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer User Card */}
      <div className="p-3 border-t border-slate-200/80 bg-slate-50/50">
        {user ? (
          <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 truncate">
              <div className="w-8 h-8 rounded-md bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs shrink-0">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="truncate text-left">
                <div className="text-xs font-semibold text-slate-900 truncate">{user.name}</div>
                <div className="text-[10px] text-slate-400 font-normal truncate">
                  {user.gig_platform || 'Gig Worker'}
                </div>
              </div>
            </div>
            <button
              onClick={onLogout}
              title="Sign Out"
              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold h-11 px-3 rounded-lg text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <User className="w-3.5 h-3.5 text-emerald-200" />
            <span>Sign In / Create Account</span>
          </button>
        )}
      </div>
    </aside>
  );
}
