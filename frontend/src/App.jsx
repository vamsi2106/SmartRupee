import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import HeaderBar from './components/HeaderBar';
import AdvisoryView from './components/AdvisoryView';
import ExpenseView from './components/ExpenseView';
import HistoryView from './components/HistoryView';
import AuthModal from './components/AuthModal';
import { useAuth } from './hooks/useAuth';
import { Toaster } from 'sonner';

export default function App() {
  const [mode, setMode] = useState('landing'); // 'landing' (public marketing) or 'app' (private workspace)
  const [activeTab, setActiveTab] = useState('advisory'); // 'advisory', 'expenses', 'history'
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const { user, login, loginDemo, register, logout } = useAuth();

  // Custom login/register wrappers that switch mode to 'app' automatically upon authentication
  const handleLogin = async (credentials) => {
    const res = await login(credentials);
    setMode('app');
    return res;
  };

  const handleDemoLogin = async () => {
    const res = await loginDemo();
    setMode('app');
    return res;
  };

  const handleRegister = async (userData) => {
    const res = await register(userData);
    setMode('app');
    return res;
  };

  // Switch to App Workspace
  const handleEnterApp = () => {
    setMode('app');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Return to Marketing Landing Page
  const handleViewLanding = () => {
    setMode('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <Toaster position="top-center" richColors />

      {/* ========================================================================= */}
      {/* EXPERIENCE 1: PUBLIC STANDALONE MARKETING LANDING PAGE                   */}
      {/* ========================================================================= */}
      {mode === 'landing' && (
        <LandingPage
          onEnterApp={handleEnterApp}
          onOpenAuth={() => setIsAuthOpen(true)}
          isAuthenticated={!!user}
          user={user}
        />
      )}

      {/* ========================================================================= */}
      {/* EXPERIENCE 2: MOBILE-FIRST DASHBOARD WORKSPACE                           */}
      {/* ========================================================================= */}
      {mode === 'app' && (
        <div className="flex min-h-screen">
          {/* Desktop-only Sidebar — hidden on mobile */}
          <div className="hidden md:block">
            <Sidebar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              user={user}
              onOpenAuth={() => setIsAuthOpen(true)}
              onLogout={() => {
                logout();
                setMode('landing');
              }}
              onViewLanding={handleViewLanding}
            />
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0 min-h-screen">
            {/* Top Header Bar */}
            <HeaderBar
              activeTab={activeTab}
              onQuickExpense={() => setActiveTab('expenses')}
              user={user}
              onOpenAuth={() => setIsAuthOpen(true)}
              onLogout={() => {
                logout();
                setMode('landing');
              }}
              onViewLanding={handleViewLanding}
            />

            {/* Workspace Content — extra bottom padding on mobile for bottom nav */}
            <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-4 py-4 space-y-4 pb-20 md:pb-6">
              {activeTab === 'advisory' && <AdvisoryView user={user} onOpenAuth={() => setIsAuthOpen(true)} />}
              {activeTab === 'expenses' && <ExpenseView />}
              {activeTab === 'history' && <HistoryView />}
            </main>

            {/* Desktop Footer — hidden on mobile (bottom nav takes its place) */}
            <footer className="hidden md:block border-t border-slate-200/80 bg-white py-4 px-6 text-xs text-slate-500 font-medium mt-auto">
              <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="font-bold text-slate-800">SmartRupee</span>
                  <span>— Smart Finance for Gig Workers</span>
                </div>
                <div>
                  Powered by <strong>Google Gemini AI</strong> &mdash; Made for India's gig workers
                </div>
              </div>
            </footer>
          </div>

          {/* Mobile Bottom Navigation — only visible on mobile */}
          <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      )}

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLogin={handleLogin}
        onDemoLogin={handleDemoLogin}
        onRegister={handleRegister}
      />
    </div>
  );
}
