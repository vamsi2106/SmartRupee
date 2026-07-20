import React, { useState } from 'react';
import { X, User, Lock, Mail, Briefcase, MapPin } from 'lucide-react';
import { toast } from 'sonner';

export default function AuthModal({ isOpen, onClose, onLogin, onDemoLogin, onRegister }) {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [gigPlatform, setGigPlatform] = useState('Zomato');
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleFillDemo = () => {
    setMode('login');
    setEmail('ramesh.demo@smartrupee.in');
    setPassword('DemoPassword123!');
    toast.info('Prefilled Ramesh (Zomato Rider) credentials!');
  };

  const handleDemoClick = async () => {
    setMode('login');
    setEmail('ramesh.demo@smartrupee.in');
    setPassword('DemoPassword123!');
    setLoading(true);
    try {
      if (onDemoLogin) {
        await onDemoLogin();
      } else {
        await onLogin({ email: 'ramesh.demo@smartrupee.in', password: 'DemoPassword123!' });
      }
      toast.success('Logged in as Ramesh Kumar (Zomato Rider)!');
      onClose();
    } catch (err) {
      toast.error('Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Email and password are required');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        await onLogin({ email, password });
        toast.success('Logged in successfully!');
      } else {
        if (!name) {
          toast.error('Full name is required');
          setLoading(false);
          return;
        }
        await onRegister({ email, password, name, gig_platform: gigPlatform, city });
        toast.success('Account registered successfully!');
      }
      onClose();
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Authentication failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-xl w-full max-w-md p-6 space-y-6 relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="space-y-1 text-center">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 font-extrabold flex items-center justify-center mx-auto text-lg">
            ₹
          </div>
          <h3 className="text-xl font-extrabold text-slate-900">
            {mode === 'login' ? 'Welcome Back' : 'Create Worker Account'}
          </h3>
          <p className="text-xs text-slate-500">
            {mode === 'login' ? 'Log in to track your debt trajectory over time' : 'Join SmartRupee to manage volatile income & debt'}
          </p>
        </div>

        {/* Mode Toggle Pills */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/80">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`w-1/2 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              mode === 'login' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`w-1/2 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              mode === 'register' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Register
          </button>
        </div>

        {/* 1-Click Demo Account Login Banner */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/90 rounded-xl p-3 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
            <span>⚡ Demo Account for Evaluators</span>
            <span className="text-[10px] bg-emerald-200/60 px-2 py-0.5 rounded text-emerald-800 font-extrabold">PRE-LOADED</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-snug">
            Sign in as <strong>Ramesh Kumar (Zomato Rider)</strong> to test with pre-populated history & expenses.
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleDemoClick}
              disabled={loading}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold py-2 px-3 rounded-lg text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <span>Instant Demo Login</span>
            </button>
            <button
              type="button"
              onClick={handleFillDemo}
              className="bg-white hover:bg-emerald-100/60 text-emerald-800 border border-emerald-300 font-bold py-2 px-3 rounded-lg text-xs transition-all cursor-pointer"
              title="Prefill input fields with Ramesh's credentials"
            >
              Auto-Fill Fields
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ramesh Kumar"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ramesh@example.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {mode === 'register' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Gig Platform
                </label>
                <select
                  value={gigPlatform}
                  onChange={(e) => setGigPlatform(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-500"
                >
                  <option value="Zomato">Zomato</option>
                  <option value="Swiggy">Swiggy</option>
                  <option value="Uber">Uber</option>
                  <option value="Ola">Ola</option>
                  <option value="Urban Company">Urban Company</option>
                  <option value="Porter">Porter</option>
                  <option value="Freelance">Freelance</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Bengaluru"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50 mt-2"
          >
            {loading ? 'Processing...' : mode === 'login' ? 'Login' : 'Register Account'}
          </button>
        </form>
      </div>
    </div>
  );
}
