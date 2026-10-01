import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  RefreshCw,
  ShieldAlert,
  Workflow,
  Search,
  Lock,
  Zap,
  CheckCheck,
  Sparkles
} from 'lucide-react';

const STAGE_ORDER = [
  'PLANNING', 'INVESTIGATING', 'DECIDING',
  'AWAITING_APPROVAL', 'EXECUTING', 'VERIFYING', 'COMPLETED'
];

const PIPELINE_STAGES = [
  { key: 'PLANNING',          label: 'Planner',      icon: Workflow,     subtext: 'DAG Tasks',         color: '#38BDF8', glow: 'rgba(56,189,248,0.5)' },
  { key: 'INVESTIGATING',     label: 'Investigator', icon: Search,       subtext: 'Context Data',      color: '#3B82F6', glow: 'rgba(59,130,246,0.5)' },
  { key: 'DECIDING',          label: 'Policy Engine',icon: Lock,         subtext: 'Deterministic',     color: '#10B981', glow: 'rgba(16,185,129,0.5)' },
  { key: 'AWAITING_APPROVAL', label: 'HITL Gate',    icon: ShieldAlert,  subtext: 'Manager Sign-off',  color: '#F59E0B', glow: 'rgba(245,158,11,0.5)'  },
  { key: 'EXECUTING',         label: 'Action Agent', icon: Zap,          subtext: 'Safe Mutation',     color: '#F43F5E', glow: 'rgba(244,63,94,0.5)'   },
  { key: 'VERIFYING',         label: 'Verification', icon: CheckCheck,   subtext: 'DB Verify',         color: '#06B6D4', glow: 'rgba(6,182,212,0.5)'   },
  { key: 'COMPLETED',         label: 'Completed',    icon: CheckCircle2, subtext: 'Audit Trail',       color: '#10B981', glow: 'rgba(16,185,129,0.5)'  }
];

export default function AgentCollaborationGraphMotion({ currentStatus }) {
  const [animatingPulse, setAnimatingPulse] = useState(false);

  useEffect(() => {
    setAnimatingPulse(true);
    const t = setTimeout(() => setAnimatingPulse(false), 800);
    return () => clearTimeout(t);
  }, [currentStatus]);

  const currentIdx = STAGE_ORDER.indexOf(currentStatus);

  const getStageStatus = (stageKey) => {
    const targetIdx = STAGE_ORDER.indexOf(stageKey);
    if (currentStatus === 'COMPLETED') return 'completed';
    if (currentStatus === stageKey) return 'active';
    if (currentStatus === 'AWAITING_APPROVAL' && stageKey === 'AWAITING_APPROVAL') return 'waiting';
    if (currentIdx > targetIdx) return 'completed';
    return 'pending';
  };

  return (
    <div className="relative py-4 select-none">

      {/* ── CONDUIT RAIL ─────────────────────────────────── */}
      <div className="hidden lg:block absolute top-[52px] left-[6%] right-[6%] h-[2px] pointer-events-none z-0">
        <div className="w-full h-full rounded-full relative overflow-hidden"
          style={{ background: 'linear-gradient(90deg, rgba(56,189,248,0.08) 0%, rgba(56,189,248,0.25) 50%, rgba(56,189,248,0.08) 100%)' }}
        >
          {/* Primary laser pulse */}
          <motion.div
            className="absolute top-0 bottom-0 w-32 rounded-full"
            style={{ background: 'linear-gradient(90deg, transparent, #38BDF8, transparent)', boxShadow: '0 0 16px #38BDF8, 0 0 32px rgba(56,189,248,0.4)' }}
            animate={{ left: ['-20%', '120%'] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
          />
          {/* Secondary trailing pulse */}
          <motion.div
            className="absolute top-0 bottom-0 w-16 rounded-full"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.8), transparent)' }}
            animate={{ left: ['-20%', '120%'] }}
            transition={{ duration: 2.5, delay: 1.2, repeat: Infinity, ease: 'linear' }}
          />
        </div>
      </div>

      {/* ── STAGE CARDS ──────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 relative z-10">
        {PIPELINE_STAGES.map((stage, idx) => {
          const status = getStageStatus(stage.key);
          const Icon = stage.icon;
          const isActive  = status === 'active';
          const isWaiting = status === 'waiting';
          const isDone    = status === 'completed';

          const cardStyles = {
            active:    { bg: 'rgba(56,189,248,0.1)',  border: '#38BDF8', shadow: '0 0 24px rgba(56,189,248,0.3), 0 0 60px rgba(56,189,248,0.08)' },
            waiting:   { bg: 'rgba(245,158,11,0.1)',  border: '#F59E0B', shadow: '0 0 24px rgba(245,158,11,0.3), 0 0 60px rgba(245,158,11,0.08)' },
            completed: { bg: 'rgba(16,185,129,0.06)', border: 'rgba(16,185,129,0.45)', shadow: '0 0 8px rgba(16,185,129,0.1)' },
            pending:   { bg: 'rgba(7,10,15,0.75)',    border: '#1E293B', shadow: 'none' }
          };
          const cs = cardStyles[status];

          return (
            <motion.div
              key={stage.key}
              initial={{ opacity: 0, y: 20, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: idx * 0.06, duration: 0.4, type: 'spring', stiffness: 260, damping: 22 }}
              whileHover={{ y: -4, scale: 1.03 }}
              className="relative flex flex-col items-center text-center rounded-2xl p-3.5 border backdrop-blur-sm overflow-hidden cursor-default"
              style={{
                background: cs.bg,
                borderColor: cs.border,
                boxShadow: cs.shadow
              }}
            >
              {/* Active pulse ring */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    key="active-bg"
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    style={{ background: 'rgba(56,189,248,0.08)' }}
                    animate={{ opacity: [0.4, 0.9, 0.4], scale: [0.98, 1.03, 0.98] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                  />
                )}
                {isWaiting && (
                  <motion.div
                    key="waiting-bg"
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    style={{ background: 'rgba(245,158,11,0.08)' }}
                    animate={{ opacity: [0.4, 0.95, 0.4], scale: [0.98, 1.05, 0.98] }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                  />
                )}
              </AnimatePresence>

              {/* Sonar ring on active */}
              {isActive && (
                <>
                  <motion.div
                    className="absolute rounded-full border border-brand-cyan/30 pointer-events-none"
                    style={{ inset: '-8px' }}
                    animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
                  />
                  <motion.div
                    className="absolute rounded-full border border-brand-cyan/20 pointer-events-none"
                    style={{ inset: '-16px' }}
                    animate={{ scale: [1, 1.3], opacity: [0.4, 0] }}
                    transition={{ duration: 1.8, delay: 0.5, repeat: Infinity, ease: 'easeOut' }}
                  />
                </>
              )}

              {/* Top row: step index + status icon */}
              <div className="flex items-center justify-between w-full mb-2.5 px-0.5">
                <span className="text-[10px] font-mono font-bold opacity-50">0{idx + 1}</span>
                <div>
                  {isDone && (
                    <motion.div initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 400, damping: 16 }}>
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    </motion.div>
                  )}
                  {isWaiting && (
                    <motion.div animate={{ y: [0, -3, 0] }} transition={{ duration: 0.7, repeat: Infinity }}>
                      <ShieldAlert className="h-4 w-4 text-amber-400" />
                    </motion.div>
                  )}
                  {isActive && (
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}>
                      <RefreshCw className="h-4 w-4 text-brand-cyan" />
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Icon orb */}
              <div className="my-1.5 relative flex items-center justify-center">
                {/* Animated glow ring on active/waiting */}
                {(isActive || isWaiting) && (
                  <motion.div
                    className="absolute inset-0 rounded-xl"
                    style={{ boxShadow: `0 0 20px ${stage.glow}, 0 0 40px ${stage.glow}` }}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                  />
                )}
                <motion.div
                  className="h-11 w-11 rounded-xl flex items-center justify-center border relative z-10"
                  animate={isActive ? { scale: [1, 1.05, 1] } : {}}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                  style={{
                    backgroundColor: isActive  ? 'rgba(56,189,248,0.2)' :
                                     isWaiting ? 'rgba(245,158,11,0.2)' :
                                     isDone    ? 'rgba(16,185,129,0.15)' :
                                                 'rgba(7,10,15,0.6)',
                    borderColor: isActive  ? '#38BDF8' :
                                 isWaiting ? '#F59E0B' :
                                 isDone    ? '#10B981' :
                                             '#1E293B'
                  }}
                >
                  <Icon
                    className={`h-5 w-5 ${
                      isActive  ? 'text-brand-cyan' :
                      isWaiting ? 'text-amber-400'  :
                      isDone    ? 'text-emerald-400' :
                                  'text-slate-600'
                    }`}
                  />
                </motion.div>
              </div>

              {/* Label */}
              <div className="mt-1.5">
                <p className="text-xs font-bold font-mono tracking-tight leading-tight"
                  style={{ color: isActive ? '#38BDF8' : isWaiting ? '#F59E0B' : isDone ? '#10B981' : '#64748B' }}>
                  {stage.label}
                </p>
                <p className="text-[10px] font-mono text-slate-500 truncate max-w-[90px] mt-0.5">{stage.subtext}</p>
              </div>

              {/* Status pill */}
              <motion.span
                className="text-[9px] uppercase tracking-wider font-mono font-extrabold px-2 py-0.5 rounded-full mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  background: isActive  ? 'rgba(56,189,248,0.2)'  :
                              isWaiting ? 'rgba(245,158,11,0.2)'   :
                              isDone    ? 'rgba(16,185,129,0.15)'  :
                                          'rgba(30,41,59,0.8)',
                  color:      isActive  ? '#38BDF8' :
                              isWaiting ? '#F59E0B'  :
                              isDone    ? '#34D399'  :
                                          '#475569',
                  border: `1px solid ${
                    isActive  ? 'rgba(56,189,248,0.4)' :
                    isWaiting ? 'rgba(245,158,11,0.4)' :
                    isDone    ? 'rgba(16,185,129,0.3)' :
                                'rgba(30,41,59,0.9)'
                  }`
                }}
              >
                {status}
              </motion.span>

              {/* Active: live data particles */}
              {isActive && (
                <div className="absolute bottom-1.5 left-0 right-0 flex justify-center gap-1 pointer-events-none">
                  {[0, 0.3, 0.6].map((delay, i) => (
                    <motion.div
                      key={i}
                      className="h-1 w-1 rounded-full bg-brand-cyan"
                      animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
                      transition={{ duration: 0.9, delay, repeat: Infinity }}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* ── LEGEND ───────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-4 mt-4 px-1">
        {[
          { label: 'Active', color: '#38BDF8' },
          { label: 'Awaiting Human', color: '#F59E0B' },
          { label: 'Completed', color: '#10B981' },
          { label: 'Pending', color: '#475569' }
        ].map(({ label, color }) => (
          <div key={label} className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full inline-block" style={{ backgroundColor: color }} />
            <span className="text-[10px] font-mono text-slate-500">{label}</span>
          </div>
        ))}
        <div className="ml-auto flex items-center gap-1.5 text-[10px] font-mono text-brand-cyan/60">
          <Sparkles className="h-3 w-3" />
          <span>Live Execution Graph</span>
        </div>
      </div>
    </div>
  );
}
