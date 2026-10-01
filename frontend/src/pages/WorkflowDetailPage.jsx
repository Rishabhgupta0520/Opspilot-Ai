import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCcw,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  Database,
  Cpu,
  Layers,
  FileCheck2,
  RefreshCw,
  XCircle,
  HelpCircle
} from 'lucide-react';
import AgentCollaborationGraphMotion from '../components/motion/AgentCollaborationGraphMotion';

export default function WorkflowDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [workflow, setWorkflow] = useState(null);
  const [steps, setSteps] = useState([]);
  const [logs, setLogs] = useState([]);
  const [auditEvents, setAuditEvents] = useState([]);
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [decisionNotes, setDecisionNotes] = useState('');
  const [actionProcessing, setActionProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState('timeline'); // 'timeline' | 'plan' | 'audit' | 'evidence'

  const fetchWorkflow = async () => {
    try {
      const res = await api.get(`/workflows/${id}`);
      const data = res.data.data;
      setWorkflow(data.workflow);
      setSteps(data.steps || []);
      setLogs(data.logs || []);
      setAuditEvents(data.auditEvents || []);
      setApprovals(data.approvals || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to load workflow details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkflow();
    const interval = setInterval(() => {
      if (workflow && ['COMPLETED', 'FAILED', 'CANCELLED'].includes(workflow.status)) {
        return;
      }
      fetchWorkflow();
    }, 1500);

    return () => clearInterval(interval);
  }, [id, workflow?.status]);

  const handleApprovalAction = async (approvalId, decision) => {
    setActionProcessing(true);
    try {
      await api.post(`/approvals/${approvalId}/${decision}`, {
        notes: decisionNotes || `${decision === 'approved' ? 'Approved' : 'Rejected'} via Workflow Console by ${user?.username || 'Manager'}`
      });
      setDecisionNotes('');
      await fetchWorkflow();
    } catch (err) {
      alert(`Approval action failed: ${err.response?.data?.error?.message || err.message}`);
    } finally {
      setActionProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400 space-y-3">
        <RefreshCw className="h-8 w-8 animate-spin text-brand-cyan" />
        <p className="text-sm font-mono">Loading autonomous execution state...</p>
      </div>
    );
  }

  if (error || !workflow) {
    return (
      <div className="p-8 text-center text-rose-300 bg-rose-950/40 rounded-2xl border border-rose-500/40 max-w-xl mx-auto">
        <AlertTriangle className="h-10 w-10 text-rose-400 mx-auto mb-3" />
        <h2 className="text-lg font-bold">Workflow Not Found</h2>
        <p className="text-sm mt-1">{error || 'Could not locate the requested workflow execution.'}</p>
        <button
          onClick={() => navigate('/workflows')}
          className="mt-4 px-4 py-2 rounded-lg bg-slate-800 text-white text-xs font-semibold hover:bg-slate-700"
        >
          &larr; Back to Workflows
        </button>
      </div>
    );
  }

  const pendingApproval = approvals.find((a) => a.status === 'pending');

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      {/* Top Header Card */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl glass-panel border border-slate-700/80 shadow-2xl"
      >
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-brand-cyan bg-brand-cyan/10 px-2 py-0.5 rounded border border-brand-cyan/20">
                {workflow.category || 'CUSTOM OPERATION'}
              </span>
              <span className="text-xs font-mono text-slate-400">
                ID: {workflow._id}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
              {workflow.goal}
            </h1>
            <p className="text-xs font-mono text-slate-400 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Current Activity: {workflow.currentStep}</span>
            </p>
          </div>

          <div className="flex flex-col sm:items-end gap-2 flex-shrink-0">
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${
                workflow.status === 'COMPLETED'
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50'
                  : workflow.status === 'AWAITING_APPROVAL'
                  ? 'bg-amber-950/80 text-amber-300 border-amber-500/50 animate-pulse'
                  : 'bg-brand-cyan/15 text-brand-cyan border-brand-cyan/40'
              }`}>
                {workflow.status}
              </span>
            </div>
            <div className="text-[11px] font-mono text-slate-400 text-right">
              Started: {new Date(workflow.createdAt).toLocaleTimeString()} &bull;
              Duration: {workflow.metrics?.durationMs ? `${(workflow.metrics.durationMs / 1000).toFixed(1)}s` : 'running...'}
            </div>
          </div>
        </div>

        {/* MOTION GRAPHIC AGENT COLLABORATION GRAPH */}
        <div className="mt-8 pt-6 border-t border-slate-800/80">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-mono uppercase text-slate-400 font-bold">
              AUTONOMOUS MULTI-AGENT EXECUTION GRAPH
            </span>
            <span className="text-[10px] font-mono text-brand-cyan flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-cyan animate-ping"></span>
              Live Pipeline Active
            </span>
          </div>
          <AgentCollaborationGraphMotion currentStatus={workflow.status} />
        </div>
      </motion.div>

      {/* HUMAN-IN-THE-LOOP APPROVAL CARD (THE CRITICAL HITL MOMENT) */}
      <AnimatePresence>
        {pendingApproval && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="p-6 rounded-2xl bg-amber-950/30 border-2 border-amber-500/60 glow-amber relative"
          >
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="h-6 w-6 text-amber-400 animate-bounce" />
                  <h2 className="text-lg font-bold text-amber-200">
                    Human-in-the-Loop Authorization Checkpoint
                  </h2>
                  <span className="text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded">
                    RISK: HIGH
                  </span>
                </div>
                <p className="text-sm text-slate-300">
                  Action: <strong className="text-white uppercase">{pendingApproval.actionType}</strong> of{' '}
                  <strong className="text-amber-400 text-base">₹{pendingApproval.amount?.toLocaleString() || 'N/A'}</strong> for customer{' '}
                  <strong className="text-white">{pendingApproval.customerName}</strong> ({pendingApproval.orderNumber}).
                </p>
                <div className="text-xs text-slate-400 font-mono">
                  Policy Mandate: {pendingApproval.policyReference} &bull; Requested by: {pendingApproval.requestedBy}
                </div>

                {/* Decision Evidence List */}
                <div className="mt-3 p-3 rounded-xl bg-dark-950/80 border border-amber-500/30 space-y-1.5">
                  <p className="text-xs font-mono font-bold text-amber-300 uppercase">Decision Evidence Collected:</p>
                  {pendingApproval.evidence?.map((ev, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-2 text-xs text-slate-300 font-mono"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                      <span>{ev}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Approval Decision Controls */}
              <div className="flex flex-col sm:items-end gap-3 flex-shrink-0 w-full sm:w-auto">
                <input
                  type="text"
                  value={decisionNotes}
                  onChange={(e) => setDecisionNotes(e.target.value)}
                  placeholder="Manager decision notes (optional)..."
                  className="w-full sm:w-64 bg-dark-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
                />
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleApprovalAction(pendingApproval._id, 'approved')}
                    disabled={actionProcessing}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-dark-950 font-bold text-xs transition-all disabled:opacity-50 cursor-pointer shadow-lg shadow-emerald-500/20"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Approve & Execute</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleApprovalAction(pendingApproval._id, 'rejected')}
                    disabled={actionProcessing}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-500/50 text-rose-300 font-bold text-xs transition-all disabled:opacity-50 cursor-pointer"
                  >
                    <XCircle className="h-4 w-4" />
                    <span>Reject & Escalate</span>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* METRICS & VERIFICATION SUMMARY TILES */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div whileHover={{ y: -2 }} className="p-4 rounded-xl glass-panel">
          <p className="text-xs text-slate-400">Total Tools Invoked</p>
          <p className="text-xl font-bold font-mono text-white mt-1">{workflow.metrics?.toolsCalled || 0}</p>
          <span className="text-[10px] text-brand-cyan font-mono">100% Zod validated</span>
        </motion.div>
        <motion.div whileHover={{ y: -2 }} className="p-4 rounded-xl glass-panel">
          <p className="text-xs text-slate-400">Actions Executed</p>
          <p className="text-xl font-bold font-mono text-white mt-1">{workflow.metrics?.actionsExecuted || 0}</p>
          <span className="text-[10px] text-emerald-400 font-mono">Idempotent transactions</span>
        </motion.div>
        <motion.div whileHover={{ y: -2 }} className="p-4 rounded-xl glass-panel">
          <p className="text-xs text-slate-400">Verified in Database</p>
          <p className="text-xl font-bold font-mono text-emerald-400 mt-1">{workflow.metrics?.actionsVerified || 0}</p>
          <span className="text-[10px] text-slate-400 font-mono">Read-after-write confirmed</span>
        </motion.div>
        <motion.div whileHover={{ y: -2 }} className="p-4 rounded-xl glass-panel">
          <p className="text-xs text-slate-400">Recovered Failures</p>
          <p className="text-xl font-bold font-mono text-amber-300 mt-1">{workflow.metrics?.retryAttempts || 0}</p>
          <span className="text-[10px] text-amber-400 font-mono">Exponential backoff retry</span>
        </motion.div>
      </div>

      {/* TABS: Timeline, Plan, Audit Events, Evidence */}
      <div className="border-b border-slate-800 flex items-center gap-4 text-xs font-mono">
        <button
          onClick={() => setActiveTab('timeline')}
          className={`pb-3 border-b-2 font-bold transition-colors ${
            activeTab === 'timeline'
              ? 'border-brand-cyan text-brand-cyan'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Live Agent Timeline ({logs.length})
        </button>
        <button
          onClick={() => setActiveTab('plan')}
          className={`pb-3 border-b-2 font-bold transition-colors ${
            activeTab === 'plan'
              ? 'border-brand-cyan text-brand-cyan'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Decomposed Plan ({workflow.plan?.tasks?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('evidence')}
          className={`pb-3 border-b-2 font-bold transition-colors ${
            activeTab === 'evidence'
              ? 'border-brand-cyan text-brand-cyan'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Decision Evidence & Policies
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`pb-3 border-b-2 font-bold transition-colors ${
            activeTab === 'audit'
              ? 'border-brand-cyan text-brand-cyan'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Immutable Audit Trail ({auditEvents.length})
        </button>
      </div>

      {/* TAB CONTENT: TIMELINE */}
      {activeTab === 'timeline' && (
        <div className="p-6 rounded-2xl glass-panel space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
              Agent Activity & Tool Invocation Log
            </h2>
            <span className="text-[11px] font-mono text-slate-400">Real-time DB Events</span>
          </div>

          <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
            {logs.length === 0 ? (
              <p className="text-xs text-slate-400 font-mono">No agent tool activity recorded yet.</p>
            ) : (
              logs.map((log, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className="relative group"
                >
                  {/* Dot on timeline */}
                  <div className={`absolute -left-[27px] top-1.5 h-3.5 w-3.5 rounded-full border-2 bg-dark-950 ${
                    log.status === 'failed' ? 'border-rose-500 bg-rose-950' : 'border-brand-cyan bg-brand-cyan/20'
                  }`} />

                  <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white font-mono">{log.agent}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20">
                          {log.tool || log.task}
                        </span>
                        {log.durationMs > 0 && (
                          <span className="text-[10px] font-mono text-slate-400">{log.durationMs}ms</span>
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300">{log.task}</p>

                    {log.payload && Object.keys(log.payload).length > 0 && (
                      <div className="p-2.5 rounded bg-dark-950 font-mono text-[11px] text-slate-300 border border-slate-800/80 overflow-x-auto">
                        <span className="text-slate-400 text-[10px] uppercase block mb-1">Payload:</span>
                        <pre>{JSON.stringify(log.payload, null, 2)}</pre>
                      </div>
                    )}

                    {log.result && (
                      <div className="p-2.5 rounded bg-dark-950 font-mono text-[11px] text-emerald-300 border border-slate-800/80 overflow-x-auto">
                        <span className="text-slate-400 text-[10px] uppercase block mb-1">Result:</span>
                        <pre>{JSON.stringify(log.result, null, 2)}</pre>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: DECOMPOSED PLAN */}
      {activeTab === 'plan' && (
        <div className="p-6 rounded-2xl glass-panel space-y-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
                Planner Agent Decomposition Graph
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Objective: {workflow.plan?.objective}</p>
            </div>
            <span className="text-xs font-mono text-brand-cyan bg-brand-cyan/10 px-2 py-1 rounded border border-brand-cyan/20">
              Risk: {workflow.plan?.estimatedRisk?.toUpperCase()}
            </span>
          </div>

          <div className="space-y-3">
            {workflow.plan?.tasks?.map((t, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-brand-cyan">Task #{idx + 1}</span>
                    <span className="text-xs font-bold text-white">{t.name}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 uppercase">
                      Agent: {t.agent}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{t.description}</p>
                  {t.requiredTools?.length > 0 && (
                    <div className="flex items-center gap-1 mt-2">
                      <span className="text-[10px] font-mono text-slate-400">Tools:</span>
                      {t.requiredTools.map((tool, i) => (
                        <span key={i} className="text-[10px] font-mono bg-dark-950 px-1.5 py-0.5 rounded border border-slate-700 text-slate-300">
                          {tool}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-xs font-mono text-slate-400">Priority: {t.priority}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: DECISION EVIDENCE & POLICIES */}
      {activeTab === 'evidence' && (
        <div className="p-6 rounded-2xl glass-panel space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
              Evaluated Operational Decisions & Evidence
            </h2>
            <span className="text-xs font-mono text-slate-400">
              Total Decisions: {workflow.decision?.decisions?.length || 0}
            </span>
          </div>

          <div className="space-y-4">
            {workflow.decision?.decisions?.map((dec, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white uppercase font-mono">
                      Action: {dec.action}
                    </span>
                    <span className="text-xs text-brand-cyan font-mono font-semibold">
                      Target: {dec.targetEntity} {dec.targetId}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                      dec.riskLevel === 'high' || dec.riskLevel === 'critical'
                        ? 'bg-amber-950/60 text-amber-300 border border-amber-500/40'
                        : 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40'
                    }`}>
                      Risk: {dec.riskLevel}
                    </span>
                    {dec.requiresApproval && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/60 text-purple-300 border border-purple-500/40 font-bold">
                        APPROVAL REQUIRED
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-300">{dec.reason}</p>

                {dec.evidence && dec.evidence.length > 0 && (
                  <div className="p-2.5 rounded bg-dark-950 border border-slate-800/80 space-y-1">
                    <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Evidence:</span>
                    {dec.evidence.map((ev, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-300 font-mono">
                        <CheckCircle2 className="h-3 w-3 text-emerald-400 flex-shrink-0" />
                        <span>{ev}</span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: IMMUTABLE AUDIT TRAIL */}
      {activeTab === 'audit' && (
        <div className="p-6 rounded-2xl glass-panel space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
              Cryptographically Ordered Audit Events
            </h2>
            <span className="text-xs font-mono text-emerald-400">Immutable Compliance Trail</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="text-[10px] text-slate-400 uppercase border-b border-slate-800">
                <tr>
                  <th className="pb-2">Timestamp</th>
                  <th className="pb-2">Agent</th>
                  <th className="pb-2">Event Type</th>
                  <th className="pb-2">Message</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {auditEvents.map((evt, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/30">
                    <td className="py-2.5 pr-3 text-slate-400 text-[11px] whitespace-nowrap">
                      {new Date(evt.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="py-2.5 pr-3 text-slate-200 font-bold">{evt.agent}</td>
                    <td className="py-2.5 pr-3 text-brand-cyan">{evt.eventType}</td>
                    <td className="py-2.5 pr-3 text-slate-300 font-sans text-xs">{evt.message}</td>
                    <td className="py-2.5">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold ${
                        evt.status === 'success'
                          ? 'text-emerald-400 bg-emerald-950/40'
                          : evt.status === 'warning'
                          ? 'text-amber-400 bg-amber-950/40'
                          : evt.status === 'error'
                          ? 'text-rose-400 bg-rose-950/40'
                          : 'text-slate-400 bg-slate-800'
                      }`}>
                        {evt.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
