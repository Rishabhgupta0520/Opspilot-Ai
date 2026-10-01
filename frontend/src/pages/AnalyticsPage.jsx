import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  BarChart3,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Clock,
  RotateCcw,
  Zap,
  Users
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      const res = await api.get('/analytics');
      setData(res.data.data);
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-slate-400 font-mono text-xs">
        Compiling operations analytics...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-brand-cyan" />
          <span>Operational Intelligence & KPIs</span>
        </h1>
        <p className="text-sm text-slate-400 mt-0.5">
          Verifiable metrics computed directly from persistent database events
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl glass-panel">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Automation Rate</span>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-extrabold text-white font-mono">{data.automationRate}%</p>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            {data.completedWorkflows} auto / {data.totalWorkflows} total
          </p>
        </div>

        <div className="p-5 rounded-2xl glass-panel">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Verification Rate</span>
            <CheckCircle2 className="h-4 w-4 text-brand-cyan" />
          </div>
          <p className="text-3xl font-extrabold text-white font-mono">{data.verificationSuccessRate}%</p>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Read-after-write confirmed
          </p>
        </div>

        <div className="p-5 rounded-2xl glass-panel">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Recovery Rate</span>
            <RotateCcw className="h-4 w-4 text-amber-400" />
          </div>
          <p className="text-3xl font-extrabold text-white font-mono">{data.failureRecoveryRate}%</p>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Transient errors recovered
          </p>
        </div>

        <div className="p-5 rounded-2xl glass-panel">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Mean Resolution Time</span>
            <Clock className="h-4 w-4 text-purple-400" />
          </div>
          <p className="text-3xl font-extrabold text-white font-mono">
            {(data.avgResolutionTimeMs / 1000).toFixed(1)}s
          </p>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Automated SLA delivery
          </p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Workflow Volume Timeline */}
        <div className="p-6 rounded-2xl glass-panel space-y-4">
          <div>
            <h2 className="text-base font-bold text-white">Execution Volume & Human Reviews</h2>
            <p className="text-xs text-slate-400">Hourly automated workflows vs manager approval escalations</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.volumeTimeline || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorWorkflows" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#38BDF8" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorHuman" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="time" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0B0F17', borderColor: '#334155', borderRadius: '8px' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Area type="monotone" dataKey="workflows" stroke="#38BDF8" fillOpacity={1} fill="url(#colorWorkflows)" name="Total Operations" />
                <Area type="monotone" dataKey="humanReview" stroke="#F59E0B" fillOpacity={1} fill="url(#colorHuman)" name="Manager Approvals" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Agent Activity Duration Breakdown */}
        <div className="p-6 rounded-2xl glass-panel space-y-4">
          <div>
            <h2 className="text-base font-bold text-white">Specialized Agent Invocations & Latency</h2>
            <p className="text-xs text-slate-400">Average execution latency per specialized operational agent</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.agentBreakdown || []} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="name" stroke="#64748B" fontSize={9} interval={0} angle={-20} textAnchor="end" />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0B0F17', borderColor: '#334155', borderRadius: '8px' }} />
                <Bar dataKey="avgDurationMs" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Avg Duration (ms)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
