import React from 'react';
import { Sparkles, Receipt, History } from 'lucide-react';

export default function BottomNav({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'advisory', label: 'Debt Planner', icon: Sparkles },
    { id: 'expenses', label: 'Track Expense', icon: Receipt },
    { id: 'history', label: 'History', icon: History },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-slate-200 md:hidden safe-area-bottom">
      <div className="flex items-stretch justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 min-h-[56px] cursor-pointer transition-colors ${
                isActive
                  ? 'text-emerald-700'
                  : 'text-slate-400 active:text-slate-600'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-600' : ''}`} />
              <span className={`text-[11px] font-semibold ${isActive ? 'font-bold text-emerald-800' : ''}`}>
                {tab.label}
              </span>
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-emerald-600 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
