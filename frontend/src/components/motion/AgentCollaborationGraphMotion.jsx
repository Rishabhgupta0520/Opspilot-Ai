import React from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  RefreshCw,
  ShieldAlert,
  ArrowRight,
  Workflow,
  Search,
  Lock,
  BrainCircuit,
  Zap,
  CheckCheck
} from 'lucide-react';

export default function AgentCollaborationGraphMotion({ currentStatus }) {
  const pipelineStages = [
    { key: 'PLANNING', label: 'Planner', icon: Workflow, subtext: 'DAG Tasks', color: '#38BDF8' },
    { key: 'INVESTIGATING', label: 'Investigator', icon: Search, subtext: 'Context Data', color: '#3B82F6' },
    { key: 'DECIDING', label: 'Policy Engine', icon: Lock, subtext: 'Deterministic Rules', color: '#10B981' },
    { key: 'AWAITING_APPROVAL', label: 'HITL Gate', icon: ShieldAlert, subtext: 'Manager Sign-off', color: '#F59E0B' },
    { key: 'EXECUTING', label: 'Action Agent', icon: Zap, subtext: 'Idempotent Mutation', color: '#F43F5E' },
    { key: 'VERIFYING', label: 'Verification', icon: CheckCheck, subtext: 'DB Verification', color: '#06B6D4' },
    { key: 'COMPLETED', label: 'Completed', icon: CheckCircle2, subtext: 'Audit Trail', color: '#10B981' }
  ];

  const stageOrder = ['PLANNING', 'INVESTIGATING', 'DECIDING', 'AWAITING_APPROVAL', 'EXECUTING', 'VERIFYING', 'COMPLETED'];
  const currentIdx = stageOrder.indexOf(currentStatus);

  const getStageStatus = (stageKey) => {
    const targetIdx = stageOrder.indexOf(stageKey);

    if (currentStatus === 'COMPLETED') return 'completed';
    if (currentStatus === stageKey) return 'active';
    if (currentStatus === 'AWAITING_APPROVAL' && stageKey === 'AWAITING_APPROVAL') return 'waiting';
    if (currentIdx > targetIdx) return 'completed';
    return 'pending';
  };

  return (
    <div className="relative py-4 select-none">
      {/* BACKGROUND LASER DATA CONDUIT (SVG Line Connecting the Stages) */}
      <div className="hidden lg:block absolute top-[52px] left-[6%] right-[6%] h-[2px] pointer-events-none z-0">
        <div className="w-full h-full bg-slate-800/80 relative overflow-hidden rounded-full">
          {/* Traveling High-Speed Laser Pulse */}
          <motion.div
            className="absolute top-0 bottom-0 w-32 bg-gradient-to-r from-transparent via-brand-cyan to-transparent shadow-[0_0_12px_#38BDF8]"
            animate={{
              left: ['-20%', '120%']
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>
      </div>

      {/* Container for the 7 stages */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 relative z-10">
        {pipelineStages.map((stage, idx) => {
          const status = getStageStatus(stage.key);
          const Icon = stage.icon;

          return (
            <motion.div
              key={stage.key}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.35 }}
              whileHover={{ y: -3 }}
              className={`p-3.5 rounded-2xl border relative flex flex-col items-center justify-between text-center transition-all ${
                status === 'active'
                  ? 'bg-brand-cyan/15 border-brand-cyan text-brand-cyan shadow-xl shadow-brand-cyan/25 backdrop-blur-md'
                  : status === 'waiting'
                  ? 'bg-amber-950/40 border-amber-500 text-amber-300 shadow-xl shadow-amber-500/25 ring-2 ring-amber-400/50 backdrop-blur-md'
                  : status === 'completed'
                  ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-400 backdrop-blur-sm'
                  : 'bg-dark-900/80 border-slate-800 text-slate-500 backdrop-blur-sm'
              }`}
            >
              {/* Active Pulsing Radiator */}
              {status === 'active' && (
                <motion.div
                  className="absolute inset-0 rounded-2xl bg-brand-cyan/10 pointer-events-none"
                  animate={{
                    opacity: [0.3, 0.75, 0.3],
                    scale: [0.99, 1.03, 0.99]
                  }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                />
              )}

              {/* Waiting Approval Glow Pulse */}
              {status === 'waiting' && (
                <motion.div
                  className="absolute inset-0 rounded-2xl bg-amber-500/10 pointer-events-none"
                  animate={{
                    opacity: [0.4, 0.95, 0.4],
                    scale: [0.99, 1.04, 0.99]
                  }}
                  transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut" }}
                />
              )}

              {/* Top Step Number Badge */}
              <div className="flex items-center justify-between w-full mb-2 px-0.5">
                <span className="text-[10px] font-mono font-bold opacity-60">
                  0{idx + 1}
                </span>
                <div>
                  {status === 'completed' && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    </motion.div>
                  )}
                  {status === 'waiting' && <ShieldAlert className="h-4 w-4 text-amber-400 animate-bounce" />}
                  {status === 'active' && <RefreshCw className="h-4 w-4 text-brand-cyan animate-spin" />}
                </div>
              </div>

              {/* Center Agent Icon with Glow Orb */}
              <div className="my-2 relative flex items-center justify-center">
                <div
                  className="h-10 w-10 rounded-xl flex items-center justify-center border transition-all"
                  style={{
                    backgroundColor: status === 'active' ? 'rgba(56, 189, 248, 0.2)' :
                                     status === 'waiting' ? 'rgba(245, 158, 11, 0.2)' :
                                     status === 'completed' ? 'rgba(16, 185, 129, 0.15)' :
                                     'rgba(15, 23, 42, 0.6)',
                    borderColor: status === 'active' ? '#38BDF8' :
                                 status === 'waiting' ? '#F59E0B' :
                                 status === 'completed' ? '#10B981' :
                                 '#334155'
                  }}
                >
                  <Icon className={`h-5 w-5 ${
                    status === 'active' ? 'text-brand-cyan' :
                    status === 'waiting' ? 'text-amber-400' :
                    status === 'completed' ? 'text-emerald-400' :
                    'text-slate-600'
                  }`} />
                </div>
              </div>

              {/* Stage Title and Subtitle */}
              <div className="mt-1">
                <p className="text-xs font-bold font-mono tracking-tight text-white leading-tight">
                  {stage.label}
                </p>
                <p className="text-[10px] font-mono text-slate-400 truncate max-w-[100px] mt-0.5">
                  {stage.subtext}
                </p>
              </div>

              {/* Status Tag */}
              <span className={`text-[9px] uppercase tracking-wider font-mono font-extrabold px-2 py-0.5 rounded-full mt-2.5 ${
                status === 'active' ? 'bg-brand-cyan/25 text-brand-cyan border border-brand-cyan/40 shadow-sm' :
                status === 'waiting' ? 'bg-amber-500/25 text-amber-300 border border-amber-500/50 shadow-sm' :
                status === 'completed' ? 'bg-emerald-500/15 text-emerald-400' :
                'bg-slate-800/80 text-slate-500'
              }`}>
                {status}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
