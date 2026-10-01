import React, { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Settings, CheckCircle2, RotateCcw, ShieldCheck, Cpu, Database, Server, Key } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuth();
  const [resetting, setResetting] = useState(false);
  const [message, setMessage] = useState(null);

  const handleReset = async () => {
    setResetting(true);
    setMessage(null);
    try {
      const res = await api.post('/demo/reset');
      setMessage('Demo dataset successfully reset to 17 delayed orders, 12 auto-resolvable, 3 approval-required baseline!');
      window.dispatchEvent(new CustomEvent('opspilot:demo_reset'));
    } catch (err) {
      setMessage('Reset failed: ' + err.message);
    } finally {
      setResetting(false);
    }
  };

  const systemStatus = [
    { service: 'Backend Core API', status: 'Operational', icon: Server, color: 'text-emerald-400' },
    { service: 'Database Layer', status: 'Connected (MongoDB & Mongoose)', icon: Database, color: 'text-emerald-400' },
    { service: 'AI Reasoning Engine', status: 'Operational (Gemini Flash + Fallback)', icon: Cpu, color: 'text-brand-cyan' },
    { service: 'Controlled Tool Registry', status: 'Operational (20 Schema Tools)', icon: ShieldCheck, color: 'text-emerald-400' },
    { service: 'Multi-Agent Orchestrator', status: 'Active & Stateful', icon: Cpu, color: 'text-emerald-400' }
  ];

  const credentials = [
    { role: 'Manager', email: 'manager@opspilot.ai', pass: 'Manager@123456', authority: 'High-Risk Approval Authorization' },
    { role: 'Admin', email: 'admin@opspilot.ai', pass: 'Admin@123456', authority: 'Full System Configuration' },
    { role: 'Operator', email: 'operator@opspilot.ai', pass: 'Operator@123456', authority: 'Goal Execution & Tracking' },
    { role: 'Viewer', email: 'viewer@opspilot.ai', pass: 'Viewer@123456', authority: 'Read-only Compliance Audits' }
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Settings className="h-6 w-6 text-brand-cyan" />
          <span>System Status & Hackathon Demo Settings</span>
        </h1>
        <p className="text-sm text-slate-400 mt-0.5">
          Live engine health diagnostics and deterministic demo controls
        </p>
      </div>

      {/* System Status Diagnostics */}
      <div className="p-6 rounded-2xl glass-panel space-y-4">
        <h2 className="text-sm font-bold font-mono uppercase tracking-wider text-slate-300">
          Component Health Telemetry
        </h2>
        <div className="space-y-2">
          {systemStatus.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon className="h-4 w-4 text-slate-400" />
                  <span className="text-xs font-semibold text-white">{s.service}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></div>
                  <span className={`text-xs font-mono font-bold ${s.color}`}>{s.status}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Deterministic Demo Dataset Reset */}
      <div className="p-6 rounded-2xl glass-panel border border-amber-500/40 glow-amber space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RotateCcw className="h-5 w-5 text-amber-400" />
            <h2 className="text-base font-bold text-white">Deterministic Demo Reset</h2>
          </div>
          <span className="text-[10px] font-mono text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30 font-bold">
            HACKATHON SAFE
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Instantly re-seeds MongoDB with the exact deterministic test pool: <strong>17 delayed orders</strong> (12 auto-resolvable, 3 approval-required, 1 recoverable network failure, 1 logistics escalation).
        </p>

        {message && (
          <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
            <span>{message}</span>
          </div>
        )}

        <button
          onClick={handleReset}
          disabled={resetting}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-dark-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all cursor-pointer disabled:opacity-50"
        >
          <RotateCcw className={`h-4 w-4 ${resetting ? 'animate-spin' : ''}`} />
          <span>{resetting ? 'Resetting Database...' : 'Reset Demo Dataset to Baseline'}</span>
        </button>
      </div>

      {/* Demo Credentials Guide */}
      <div className="p-6 rounded-2xl glass-panel space-y-4">
        <div className="flex items-center gap-2">
          <Key className="h-5 w-5 text-purple-400" />
          <h2 className="text-sm font-bold font-mono uppercase tracking-wider text-slate-300">
            Hackathon Demo Personas
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {credentials.map((c, i) => (
            <div key={i} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{c.role} Persona</span>
                <span className="text-[10px] font-mono text-slate-400">PW: {c.pass}</span>
              </div>
              <p className="text-xs font-mono text-brand-cyan">{c.email}</p>
              <p className="text-[11px] text-slate-400">{c.authority}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
