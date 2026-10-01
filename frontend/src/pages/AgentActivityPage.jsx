import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Cpu, Search, Clock, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';

export default function AgentActivityPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [agentFilter, setAgentFilter] = useState('all');

  const fetchLogs = async () => {
    try {
      const res = await api.get(`/agents/activity?agent=${agentFilter}&limit=100`);
      setLogs(res.data.data.logs || []);
    } catch (err) {
      console.error('Failed to load agent logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, [agentFilter]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Cpu className="h-6 w-6 text-brand-cyan" />
            <span>Agent Telemetry & Tool Activity</span>
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Granular invocation traces recorded across specialized AI agents
          </p>
        </div>

        <select
          value={agentFilter}
          onChange={(e) => setAgentFilter(e.target.value)}
          className="bg-slate-900/90 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-cyan"
        >
          <option value="all">All Agents</option>
          <option value="Planner Agent">Planner Agent</option>
          <option value="Investigation Agent">Investigation Agent</option>
          <option value="Decision Agent">Decision Agent</option>
          <option value="Action Agent">Action Agent</option>
          <option value="Verification Agent">Verification Agent</option>
        </select>
      </div>

      <div className="p-5 rounded-2xl glass-panel">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="text-[11px] text-slate-400 uppercase border-b border-slate-800">
              <tr>
                <th className="pb-3">Timestamp</th>
                <th className="pb-3">Agent</th>
                <th className="pb-3">Tool / Action</th>
                <th className="pb-3">Task Description</th>
                <th className="pb-3">Latency</th>
                <th className="pb-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Loading agent activity telemetry...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No agent activity recorded yet.
                  </td>
                </tr>
              ) : (
                logs.map((l) => (
                  <tr key={l._id} className="hover:bg-slate-800/30">
                    <td className="py-3 pr-3 text-slate-400 text-[11px]">
                      {new Date(l.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="py-3 pr-3 font-bold text-white">
                      {l.agent}
                    </td>
                    <td className="py-3 pr-3 text-brand-cyan">
                      {l.tool || 'N/A'}
                    </td>
                    <td className="py-3 pr-3 text-slate-300 font-sans text-xs max-w-sm truncate">
                      {l.task}
                    </td>
                    <td className="py-3 pr-3 text-slate-400">
                      {l.durationMs}ms
                    </td>
                    <td className="py-3 text-right">
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                        l.status === 'success'
                          ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                          : l.status === 'failed'
                          ? 'bg-rose-950/60 text-rose-400 border border-rose-500/40'
                          : 'bg-amber-950/60 text-amber-400 border border-amber-500/40'
                      }`}>
                        {l.status}
                      </span>
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
