import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Lock, Mail, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';

export default function LoginPage() {
  const { login, quickLogin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (role) => {
    setLoading(true);
    setError(null);
    try {
      await quickLogin(role);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Quick login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center p-6 relative">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-brand-cyan/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 rounded-xl bg-gradient-to-tr from-brand-blue via-brand-cyan to-indigo-500 p-0.5 shadow-xl shadow-brand-cyan/20 mb-3">
            <div className="h-full w-full bg-dark-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-brand-cyan" />
            </div>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">OpsPilot AI</h1>
          <p className="text-sm text-slate-400 mt-1">Autonomous Operations Console</p>
        </div>

        {/* 1-Click Quick Demo Persona Login */}
        <div className="mb-6 p-4 rounded-xl glass-panel border border-slate-700/60 shadow-lg">
          <div className="flex items-center gap-2 mb-3">
            <UserCheck className="h-4 w-4 text-brand-cyan" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
              HACKATHON QUICK SIGN-IN
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('manager')}
              disabled={loading}
              className="px-3 py-2 rounded-lg bg-amber-950/40 hover:bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs font-semibold transition-all flex flex-col items-start"
            >
              <span>Manager Persona</span>
              <span className="text-[10px] text-amber-400/80 font-normal">Can Approve High Risk</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('admin')}
              disabled={loading}
              className="px-3 py-2 rounded-lg bg-purple-950/40 hover:bg-purple-950/80 border border-purple-500/40 text-purple-300 text-xs font-semibold transition-all flex flex-col items-start"
            >
              <span>Admin Persona</span>
              <span className="text-[10px] text-purple-400/80 font-normal">Full System Authority</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('operator')}
              disabled={loading}
              className="px-3 py-2 rounded-lg bg-blue-950/40 hover:bg-blue-950/80 border border-blue-500/40 text-blue-300 text-xs font-semibold transition-all flex flex-col items-start"
            >
              <span>Operator Persona</span>
              <span className="text-[10px] text-blue-400/80 font-normal">Standard Operations</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('viewer')}
              disabled={loading}
              className="px-3 py-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold transition-all flex flex-col items-start"
            >
              <span>Viewer Persona</span>
              <span className="text-[10px] text-slate-400 font-normal">Read-only Audits</span>
            </button>
          </div>
        </div>

        {/* Regular Login Form */}
        <div className="p-6 rounded-2xl glass-panel border border-slate-700/80 shadow-2xl">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-950/60 border border-rose-500/50 text-rose-300 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Work Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="manager@opspilot.ai"
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-lg pl-9 pr-3 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-brand-cyan transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-lg pl-9 pr-3 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-brand-cyan transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-gradient-to-r from-brand-blue to-brand-cyan hover:opacity-95 text-dark-950 font-bold text-sm transition-all disabled:opacity-50 cursor-pointer shadow-lg shadow-brand-cyan/20"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Console'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-4 text-center">
            <Link to="/register" className="text-xs text-brand-cyan hover:underline">
              Don't have an account? Register new operator
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
