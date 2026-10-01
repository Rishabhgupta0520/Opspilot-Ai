import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
  ArrowRight,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

export default function ApprovalCenterPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [actionProcessing, setActionProcessing] = useState(false);
  const [selectedNotes, setSelectedNotes] = useState({});

  const canApprove = user?.role === 'admin' || user?.role === 'manager';

  const fetchApprovals = async () => {
    try {
      const res = await api.get(`/approvals?status=${statusFilter}&riskLevel=${riskFilter}`);
      setApprovals(res.data.data.approvals || []);
    } catch (err) {
      console.error('Failed to fetch approvals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovals();
    const interval = setInterval(fetchApprovals, 5000);
    return () => clearInterval(interval);
  }, [statusFilter, riskFilter]);

  const handleDecision = async (approvalId, decision) => {
    if (!canApprove) {
      alert('Only Manager or Admin roles have authority to approve high-risk operations.');
      return;
    }

    setActionProcessing(true);
    try {
      const notes = selectedNotes[approvalId] || `${decision === 'approved' ? 'Approved' : 'Rejected'} via Approval Center`;
      await api.post(`/approvals/${approvalId}/${decision}`, { notes });
      await fetchApprovals();
    } catch (err) {
      alert(`Decision error: ${err.response?.data?.error?.message || err.message}`);
    } finally {
      setActionProcessing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-amber-400" />
            <span>Human-in-the-Loop Approval Center</span>
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Deterministic governance checkpoint for high-value and high-risk actions
          </p>
        </div>

        {!canApprove && (
          <div className="px-3 py-1.5 rounded-lg bg-amber-950/40 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2 font-mono">
            <AlertCircle className="h-4 w-4" />
            <span>Active role ({user?.role}) is view-only. Manager/Admin required to authorize.</span>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-900/90 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-cyan"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending Approval</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>

        <select
          value={riskFilter}
          onChange={(e) => setRiskFilter(e.target.value)}
          className="bg-slate-900/90 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-cyan"
        >
          <option value="all">All Risk Levels</option>
          <option value="high">High Risk</option>
          <option value="critical">Critical</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {/* Approvals Cards Grid */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-8 text-center text-slate-400 font-mono">
            <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-brand-cyan" />
            Loading approval tickets...
          </div>
        ) : approvals.length === 0 ? (
          <div className="p-8 text-center text-slate-400 glass-panel rounded-2xl">
            No approval requests matching filters. High-risk operations (e.g. refunds &gt; ₹5,000) will appear here.
          </div>
        ) : (
          approvals.map((app) => (
            <div
              key={app._id}
              className={`p-6 rounded-2xl glass-panel border transition-all ${
                app.status === 'pending'
                  ? 'border-amber-500/50 bg-amber-950/10 shadow-lg shadow-amber-500/5'
                  : 'border-slate-800'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${
                      app.riskLevel === 'high' || app.riskLevel === 'critical'
                        ? 'bg-amber-950/60 text-amber-300 border-amber-500/40'
                        : 'bg-blue-950/60 text-blue-300 border-blue-500/40'
                    }`}>
                      {app.riskLevel} RISK
                    </span>
                    <span className="text-xs font-mono text-brand-cyan uppercase font-bold">
                      {app.actionType}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      &bull; Ref: {app.orderNumber || 'N/A'}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white">
                    {app.actionType.toUpperCase()}: ₹{app.amount?.toLocaleString() || 'N/A'} for {app.customerName}
                  </h3>

                  <p className="text-xs text-slate-300">{app.reason}</p>

                  <div className="text-[11px] font-mono text-slate-400">
                    Policy: <span className="text-slate-300">{app.policyReference}</span> &bull;
                    Requested by: <span className="text-slate-300">{app.requestedBy}</span> &bull;
                    Time: {new Date(app.createdAt).toLocaleTimeString()}
                  </div>

                  {/* Evidence Checklist */}
                  {app.evidence && app.evidence.length > 0 && (
                    <div className="mt-3 p-3 rounded-xl bg-dark-950/80 border border-slate-800 space-y-1">
                      <p className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                        Evidence gathered by Investigation Agent:
                      </p>
                      {app.evidence.map((ev, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-slate-300 font-mono">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                          <span>{ev}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Resolved Info if already decided */}
                  {app.status !== 'pending' && (
                    <div className="pt-2 text-xs font-mono text-slate-400">
                      Decided as <strong className="uppercase text-white">{app.status}</strong> by{' '}
                      <span className="text-brand-cyan">{app.decidedByName || 'Manager'}</span>. Notes: {app.decisionNotes || 'None'}
                    </div>
                  )}
                </div>

                {/* Right Action Buttons */}
                <div className="flex flex-col sm:items-end gap-3 flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold border ${
                      app.status === 'pending'
                        ? 'bg-amber-950/80 text-amber-300 border-amber-500/50 animate-pulse'
                        : app.status === 'approved'
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50'
                        : 'bg-rose-950/80 text-rose-300 border-rose-500/50'
                    }`}>
                      {app.status.toUpperCase()}
                    </span>
                  </div>

                  {app.status === 'pending' && canApprove && (
                    <div className="space-y-2 w-full sm:w-auto">
                      <input
                        type="text"
                        placeholder="Manager decision notes..."
                        value={selectedNotes[app._id] || ''}
                        onChange={(e) => setSelectedNotes({ ...selectedNotes, [app._id]: e.target.value })}
                        className="w-full sm:w-64 bg-dark-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
                      />
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDecision(app._id, 'approved')}
                          disabled={actionProcessing}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-dark-950 font-bold text-xs shadow-md shadow-emerald-500/20 cursor-pointer disabled:opacity-50"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleDecision(app._id, 'rejected')}
                          disabled={actionProcessing}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-500/50 text-rose-300 font-bold text-xs cursor-pointer disabled:opacity-50"
                        >
                          <XCircle className="h-3.5 w-3.5" />
                          <span>Reject</span>
                        </button>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => navigate(`/workflows/${app.workflowId}`)}
                    className="text-xs text-brand-cyan hover:underline font-mono flex items-center gap-1"
                  >
                    <span>View associated workflow &rarr;</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
