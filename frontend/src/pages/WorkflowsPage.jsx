import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
  GitBranch,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  RefreshCw
} from 'lucide-react';

export default function WorkflowsPage() {
  const navigate = useNavigate();

  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  const fetchWorkflows = async () => {
    try {
      const res = await api.get(`/workflows?status=${statusFilter}&search=${search}`);
      setWorkflows(res.data.data.workflows || []);
    } catch (err) {
      console.error('Error fetching workflows:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkflows();
    const interval = setInterval(fetchWorkflows, 4000);
    return () => clearInterval(interval);
  }, [statusFilter, search]);

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
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <GitBranch className="h-6 w-6 text-brand-cyan" />
            <span>Autonomous Workflows</span>
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Real-time execution records across multi-agent pipelines
          </p>
        </div>

        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-blue to-brand-cyan text-dark-950 font-bold text-xs shadow-md shadow-brand-cyan/10 self-start sm:self-auto"
        >
          <Sparkles className="h-4 w-4" />
          <span>Launch New Goal</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search goals by keywords..."
            className="w-full bg-slate-900/90 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-brand-cyan"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900/90 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-cyan"
          >
            <option value="all">All Statuses</option>
            <option value="COMPLETED">Completed</option>
            <option value="AWAITING_APPROVAL">Awaiting Approval</option>
            <option value="EXECUTING">Executing</option>
            <option value="PLANNING">Planning</option>
            <option value="ESCALATED">Escalated</option>
            <option value="FAILED">Failed</option>
          </select>
        </div>
      </div>

      {/* Workflows Table */}
      <div className="p-5 rounded-2xl glass-panel">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] text-slate-400 uppercase font-mono border-b border-slate-800">
              <tr>
                <th className="pb-3">Workflow Goal</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Current Activity</th>
                <th className="pb-3">Verified Actions</th>
                <th className="pb-3">Created</th>
                <th className="pb-3 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 font-mono">
                    <RefreshCw className="h-5 w-5 animate-spin mx-auto mb-2 text-brand-cyan" />
                    Loading workflows...
                  </td>
                </tr>
              ) : workflows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No matching workflows found.
                  </td>
                </tr>
              ) : (
                workflows.map((w) => (
                  <tr
                    key={w._id}
                    onClick={() => navigate(`/workflows/${w._id}`)}
                    className="hover:bg-slate-800/40 cursor-pointer transition-colors group"
                  >
                    <td className="py-3.5 pr-3 max-w-sm truncate font-medium text-slate-200 group-hover:text-brand-cyan">
                      {w.goal}
                    </td>
                    <td className="py-3.5 pr-3">
                      <span className="text-[10px] font-mono uppercase bg-slate-800/80 px-2 py-0.5 rounded text-slate-300">
                        {w.category || 'OPERATION'}
                      </span>
                    </td>
                    <td className="py-3.5 pr-3">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${getStatusBadge(w.status)}`}>
                        {w.status}
                      </span>
                    </td>
                    <td className="py-3.5 pr-3 text-slate-400 text-[11px] max-w-xs truncate">
                      {w.currentStep}
                    </td>
                    <td className="py-3.5 pr-3 font-mono text-emerald-400">
                      {w.metrics?.actionsVerified || 0}
                    </td>
                    <td className="py-3.5 pr-3 text-slate-400 text-[11px] font-mono">
                      {new Date(w.createdAt).toLocaleTimeString()}
                    </td>
                    <td className="py-3.5 text-right font-mono text-brand-cyan group-hover:underline">
                      Inspect &rarr;
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
