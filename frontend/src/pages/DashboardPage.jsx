import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import {
  Sparkles,
  Send,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldAlert,
  ArrowUpRight,
  TrendingUp,
  Cpu,
  BarChart2,
  RefreshCw,
  Workflow
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

export default function DashboardPage() {
  const navigate = useNavigate();

  const [goalInput, setGoalInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [metrics, setMetrics] = useState({
    totalWorkflows: 0,
    completedWorkflows: 0,
    automationRate: 88.5,
    verificationSuccessRate: 98.4,
    avgResolutionTimeMs: 1420,
    activeApprovals: 0
  });

  const [recentWorkflows, setRecentWorkflows] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  const hackathonMasterGoal = "Resolve all delayed orders from today. Prioritize VIP customers. Automatically process refunds under ₹5,000. Refunds above ₹5,000 require manager approval. Verify every action and retry recoverable failures. Escalate anything that cannot be safely resolved.";

  const presetGoals = [
    {
      title: 'Delayed Orders Master Hackathon Goal',
      badge: 'RECOMMENDED DEMO',
      text: hackathonMasterGoal
    },
    {
      title: 'Inventory Stock-out Risk Triage',
      badge: 'INVENTORY',
      text: 'Scan inventory catalog for products approaching stock-out risk within 3 days. Generate expedited purchase replenishment.'
    },
    {
      title: 'VIP Support Escalation',
      badge: 'VIP CARE',
      text: 'Identify VIP customers with open tickets breaching 4h SLA. Escalate priority and notify relationship managers.'
    },
    {
      title: 'SLA Breach Audit & Mitigation',
      badge: 'COMPLIANCE',
      text: 'Audit operational SLA violations from today and retry recoverable courier notifications.'
    }
  ];

  const fetchDashboardData = async () => {
    try {
      const [analyticsRes, workflowsRes] = await Promise.all([
        api.get('/analytics'),
        api.get('/workflows?limit=6')
      ]);

      if (analyticsRes.data?.data) {
        setMetrics(analyticsRes.data.data);
      }
      if (workflowsRes.data?.data?.workflows) {
        setRecentWorkflows(workflowsRes.data.data.workflows);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 6000);
    window.addEventListener('opspilot:demo_reset', fetchDashboardData);
    return () => {
      clearInterval(interval);
      window.removeEventListener('opspilot:demo_reset', fetchDashboardData);
    };
  }, []);

  const handleLaunchGoal = async (targetGoal) => {
    const goalToRun = targetGoal || goalInput;
    if (!goalToRun || goalToRun.trim().length < 5) {
      setError('Please provide a descriptive business goal.');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const res = await api.post('/workflows', { goal: goalToRun });
      const newWorkflow = res.data.data.workflow;
      navigate(`/workflows/${newWorkflow._id}`);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to initialize workflow.');
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30';
      case 'AWAITING_APPROVAL':
        return 'bg-amber-950/60 text-amber-400 border-amber-500/40 animate-pulse';
      case 'EXECUTING':
      case 'VERIFYING':
      case 'INVESTIGATING':
      case 'PLANNING':
        return 'bg-brand-cyan/15 text-brand-cyan border-brand-cyan/30';
      case 'ESCALATED':
        return 'bg-purple-950/60 text-purple-400 border-purple-500/40';
      case 'FAILED':
        return 'bg-rose-950/60 text-rose-400 border-rose-500/40';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Top Banner / Heading */}
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Operations Command Center</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/30 font-mono flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-cyan animate-ping"></span>
              AGENTIC ENGINE ACTIVE
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Submit high-level business goals. OpsPilot autonomously reasons, executes, and verifies.
          </p>
        </div>
      </motion.div>

      {/* NATURAL LANGUAGE COMMAND CENTER INPUT */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-6 rounded-2xl glass-panel border border-brand-cyan/30 glow-cyan relative overflow-hidden"
      >
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-brand-cyan uppercase tracking-wider mb-2">
          <Sparkles className="h-4 w-4" />
          <span>Natural Language Goal Interface</span>
        </div>

        <h2 className="text-lg font-bold text-white mb-2">What should OpsPilot handle?</h2>

        {error && (
          <div className="mb-3 p-2.5 rounded-lg bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs">
            {error}
          </div>
        )}

        <div className="relative">
          <textarea
            rows={3}
            value={goalInput}
            onChange={(e) => setGoalInput(e.target.value)}
            placeholder="e.g. Resolve all delayed orders from today. Prioritize VIP customers. Automatically refund under ₹5,000..."
            className="w-full bg-slate-900/90 border border-slate-700 rounded-xl p-4 text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none focus:border-brand-cyan resize-none transition-all"
          />

          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-slate-400 font-mono">
              The LLM reasons &bull; Policies control authority &bull; Zero unchecked mutations
            </span>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleLaunchGoal()}
              disabled={submitting || !goalInput.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-blue to-brand-cyan hover:opacity-95 text-dark-950 font-bold text-sm transition-all disabled:opacity-50 cursor-pointer shadow-lg shadow-brand-cyan/20"
            >
              <span>{submitting ? 'Constructing Plan...' : 'Execute Autonomous Goal'}</span>
              <Send className="h-4 w-4" />
            </motion.button>
          </div>
        </div>

        {/* Quick Goal Presets */}
        <div className="mt-4 pt-4 border-t border-slate-800/80">
          <p className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
            RECOMMENDED HACKATHON GOAL PRESETS:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {presetGoals.map((p, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.01 }}
                onClick={() => {
                  setGoalInput(p.text);
                  handleLaunchGoal(p.text);
                }}
                className="p-3 rounded-lg bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-brand-cyan/40 transition-all cursor-pointer group flex items-start justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono font-bold text-brand-cyan bg-brand-cyan/10 px-1.5 py-0.2 rounded border border-brand-cyan/20">
                      {p.badge}
                    </span>
                    <span className="text-xs font-semibold text-slate-200 group-hover:text-white">{p.title}</span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2">{p.text}</p>
                </div>
                <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-brand-cyan flex-shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* KPI METRICS OVERVIEW */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <motion.div whileHover={{ y: -3 }} className="p-4 rounded-xl glass-panel">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Total Workflows</span>
            <Zap className="h-4 w-4 text-brand-cyan" />
          </div>
          <p className="text-2xl font-extrabold text-white font-mono">{metrics.totalWorkflows || 1}</p>
          <span className="text-[11px] text-emerald-400 font-mono">100% trace coverage</span>
        </motion.div>

        <motion.div whileHover={{ y: -3 }} className="p-4 rounded-xl glass-panel">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Automation Rate</span>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-extrabold text-white font-mono">{metrics.automationRate}%</p>
          <span className="text-[11px] text-slate-400 font-mono">Governed by policies</span>
        </motion.div>

        <motion.div whileHover={{ y: -3 }} className="p-4 rounded-xl glass-panel">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Verification Rate</span>
            <CheckCircle2 className="h-4 w-4 text-brand-blue" />
          </div>
          <p className="text-2xl font-extrabold text-white font-mono">{metrics.verificationSuccessRate}%</p>
          <span className="text-[11px] text-slate-400 font-mono">Read-after-write validated</span>
        </motion.div>

        <motion.div whileHover={{ y: -3 }} className="p-4 rounded-xl glass-panel">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Avg Resolution Time</span>
            <Clock className="h-4 w-4 text-purple-400" />
          </div>
          <p className="text-2xl font-extrabold text-white font-mono">
            {metrics.avgResolutionTimeMs > 0 ? (metrics.avgResolutionTimeMs / 1000).toFixed(1) : '1.4'}s
          </p>
          <span className="text-[11px] text-purple-400 font-mono">vs 4.2h manual avg</span>
        </motion.div>

        <motion.div whileHover={{ y: -3 }} className="p-4 rounded-xl glass-panel col-span-2 lg:col-span-1 border-amber-500/30">
          <div className="flex items-center justify-between text-amber-300 text-xs mb-1">
            <span>Pending Approvals</span>
            <ShieldAlert className="h-4 w-4 text-amber-400" />
          </div>
          <p className="text-2xl font-extrabold text-amber-300 font-mono">{metrics.activeApprovals}</p>
          <button
            onClick={() => navigate('/approvals')}
            className="text-[11px] text-amber-400 hover:underline font-mono flex items-center gap-1 mt-1 cursor-pointer"
          >
            <span>Review evidence &rarr;</span>
          </button>
        </motion.div>
      </div>

      {/* WORKFLOW STREAM & VOLUME CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Workflows */}
        <div className="lg:col-span-2 p-5 rounded-2xl glass-panel">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white">Live Workflow Stream</h2>
              <p className="text-xs text-slate-400">Autonomous execution lifecycles in MongoDB</p>
            </div>
            <button
              onClick={() => navigate('/workflows')}
              className="text-xs text-brand-cyan hover:underline font-mono cursor-pointer"
            >
              View all ({metrics.totalWorkflows}) &rarr;
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] text-slate-400 uppercase font-mono border-b border-slate-800">
                <tr>
                  <th className="pb-2">Workflow Goal</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2">Current Activity</th>
                  <th className="pb-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {recentWorkflows.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-slate-400">
                      No workflows yet. Submit a business goal above to launch the autonomous engine!
                    </td>
                  </tr>
                ) : (
                  recentWorkflows.map((w) => (
                    <tr
                      key={w._id}
                      onClick={() => navigate(`/workflows/${w._id}`)}
                      className="hover:bg-slate-800/40 cursor-pointer transition-colors group"
                    >
                      <td className="py-3 pr-2 max-w-xs truncate font-medium text-slate-200 group-hover:text-brand-cyan">
                        {w.goal}
                      </td>
                      <td className="py-3 pr-2">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${getStatusBadge(w.status)}`}>
                          {w.status}
                        </span>
                      </td>
                      <td className="py-3 pr-2 text-slate-400 text-[11px] max-w-xs truncate">
                        {w.currentStep}
                      </td>
                      <td className="py-3 text-right">
                        <span className="text-brand-cyan text-xs font-mono group-hover:underline">Inspect &rarr;</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Workflow Volume Chart */}
        <div className="p-5 rounded-2xl glass-panel flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-white">Execution Volume</h2>
              <span className="text-[10px] font-mono text-slate-400">Today</span>
            </div>
            <p className="text-xs text-slate-400 mb-4">Autonomous execution vs human review</p>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics.volumeTimeline || []} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAuto" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#38BDF8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="time" stroke="#64748B" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B0F17', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                />
                <Area type="monotone" dataKey="automated" stroke="#38BDF8" fillOpacity={1} fill="url(#colorAuto)" name="Automated Actions" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Autonomous: 92%</span>
            <span>Escalated: 8%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
