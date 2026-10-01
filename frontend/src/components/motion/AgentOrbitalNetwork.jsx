import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Workflow,
  Search,
  Lock,
  BrainCircuit,
  ShieldAlert,
  Zap,
  CheckCircle2,
  Cpu,
  Radio,
  Activity
} from 'lucide-react';

export default function AgentOrbitalNetwork({ className = '' }) {
  const [hoveredAgent, setHoveredAgent] = useState(null);

  const agents = [
    {
      id: 'planner',
      name: 'Planner Agent',
      shortName: 'PLANNER',
      icon: Workflow,
      role: 'Goal DAG Decomposition & Tool Planning',
      metrics: '7 Tasks Generated',
      tools: ['generatePlan', 'taskDependencyGraph', 'aiDecompose'],
      color: '#38BDF8', // Cyan
      glow: 'rgba(56, 189, 248, 0.6)',
      angle: 0,
      radius: 195
    },
    {
      id: 'investigator',
      name: 'Investigation Agent',
      shortName: 'INVESTIGATOR',
      icon: Search,
      role: 'Context Extraction & Database Telemetry',
      metrics: '17 Delayed Orders Found',
      tools: ['getDelayedOrders', 'getShipment', 'getCustomerHistory'],
      color: '#3B82F6', // Blue
      glow: 'rgba(59, 130, 246, 0.6)',
      angle: 51.4,
      radius: 195
    },
    {
      id: 'policy',
      name: 'Deterministic Policy Engine',
      shortName: 'POLICIES',
      icon: Lock,
      role: 'Application Authority & Financial Governance',
      metrics: '₹5,000 Threshold Guard',
      tools: ['POL-REF-001 (Auto)', 'POL-REF-002 (Approval)', 'POL-VIP-001'],
      color: '#10B981', // Emerald
      glow: 'rgba(16, 185, 129, 0.6)',
      angle: 102.8,
      radius: 195
    },
    {
      id: 'decision',
      name: 'Decision Agent',
      shortName: 'DECISION',
      icon: BrainCircuit,
      role: 'Evidence Synthesis & Action Formulation',
      metrics: '95% Model Confidence',
      tools: ['makeDecision', 'evidenceChecklist', 'riskScoring'],
      color: '#A855F7', // Purple
      glow: 'rgba(168, 85, 247, 0.6)',
      angle: 154.2,
      radius: 195
    },
    {
      id: 'approval',
      name: 'HITL Gatekeeper',
      shortName: 'HITL APPROVAL',
      icon: ShieldAlert,
      role: 'Mandatory Human Manager Sign-Off',
      metrics: '3 High-Value Pauses',
      tools: ['createApprovalRequest', 'verifySignoff', 'auditSignature'],
      color: '#F59E0B', // Amber
      glow: 'rgba(245, 158, 11, 0.7)',
      angle: 205.6,
      radius: 195
    },
    {
      id: 'action',
      name: 'Action Agent',
      shortName: 'ACTION AGENT',
      icon: Zap,
      role: 'Safe Mutation Dispatch with Idempotency',
      metrics: 'Zero Duplicate Payouts',
      tools: ['createRefund', 'createReplacement', 'sendNotification'],
      color: '#F43F5E', // Rose
      glow: 'rgba(244, 63, 94, 0.6)',
      angle: 257.0,
      radius: 195
    },
    {
      id: 'verification',
      name: 'Verification Agent',
      shortName: 'VERIFICATION',
      icon: CheckCircle2,
      role: 'Read-After-Write Persistent Database Check',
      metrics: '100% Verified in MongoDB',
      tools: ['verifyRefund', 'verifyReplacement', 'verifyNotification'],
      color: '#06B6D4', // Teal/Cyan
      glow: 'rgba(6, 182, 212, 0.6)',
      angle: 308.4,
      radius: 195
    }
  ];

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      {/* 1. RADAR / SONAR PULSE WAVES RADIATING FROM CENTER */}
      <div className="absolute w-[560px] h-[560px] flex items-center justify-center pointer-events-none">
        {[0, 1.5, 3].map((delay, idx) => (
          <motion.div
            key={idx}
            className="absolute rounded-full border border-brand-cyan/25"
            initial={{ width: 80, height: 80, opacity: 0.8 }}
            animate={{
              width: [80, 480],
              height: [80, 480],
              opacity: [0.6, 0]
            }}
            transition={{
              duration: 4.5,
              repeat: Infinity,
              delay,
              ease: "easeOut"
            }}
          />
        ))}
      </div>

      {/* 2. DYNAMIC SVG HOLOGRAPHIC CHASSIS (560x560) */}
      <svg className="absolute w-[560px] h-[560px] pointer-events-none overflow-visible" viewBox="0 0 560 560">
        <defs>
          {/* Deep core glow gradient */}
          <radialGradient id="hologramCore" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.45" />
            <stop offset="35%" stopColor="#3B82F6" stopOpacity="0.18" />
            <stop offset="70%" stopColor="#6366F1" stopOpacity="0.05" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>

          {/* Laser Glow Filter */}
          <filter id="laserGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ambient Center Glow */}
        <circle cx="280" cy="280" r="195" fill="url(#hologramCore)" />

        {/* Outer Orbital Ring 1: High Tech Dashes */}
        <motion.circle
          cx="280"
          cy="280"
          r="195"
          fill="none"
          stroke="rgba(56, 189, 248, 0.25)"
          strokeWidth="1.5"
          strokeDasharray="6 14"
          animate={{ rotate: 360 }}
          transition={{ duration: 75, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: '280px 280px' }}
        />

        {/* Middle Ring 2: Precision Dial */}
        <motion.circle
          cx="280"
          cy="280"
          r="145"
          fill="none"
          stroke="rgba(99, 102, 241, 0.2)"
          strokeWidth="1"
          strokeDasharray="2 8"
          animate={{ rotate: -360 }}
          transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: '280px 280px' }}
        />

        {/* Inner Ring 3: Tight Gear */}
        <motion.circle
          cx="280"
          cy="280"
          r="95"
          fill="none"
          stroke="rgba(56, 189, 248, 0.3)"
          strokeWidth="1"
          strokeDasharray="3 6"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: '280px 280px' }}
        />

        {/* Crosshair Coordinate Markers */}
        <line x1="280" y1="50" x2="280" y2="70" stroke="#334155" strokeWidth="1" />
        <line x1="280" y1="490" x2="280" y2="510" stroke="#334155" strokeWidth="1" />
        <line x1="50" y1="280" x2="70" y2="280" stroke="#334155" strokeWidth="1" />
        <line x1="490" y1="280" x2="510" y2="280" stroke="#334155" strokeWidth="1" />

        {/* Laser Beams & Animated Traveling Photons from Center to Each Node */}
        {agents.map((agent, i) => {
          const rad = (agent.angle * Math.PI) / 180;
          const x = 280 + Math.cos(rad) * 195;
          const y = 280 + Math.sin(rad) * 195;
          const isHovered = hoveredAgent?.id === agent.id;

          return (
            <g key={agent.id}>
              {/* Laser line */}
              <line
                x1="280"
                y1="280"
                x2={x}
                y2={y}
                stroke={isHovered ? agent.color : 'rgba(51, 65, 85, 0.4)'}
                strokeWidth={isHovered ? 2.5 : 1}
                strokeOpacity={isHovered ? 1 : 0.4}
                filter={isHovered ? "url(#laserGlow)" : undefined}
                strokeDasharray={isHovered ? 'none' : '4 6'}
              />

              {/* High-speed Photon Energy Pulse */}
              <motion.circle
                r={isHovered ? 4.5 : 2.5}
                fill={agent.color}
                filter="url(#laserGlow)"
                animate={{
                  cx: [280, x],
                  cy: [280, y],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 2.2 + (i % 2) * 0.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.3
                }}
              />
            </g>
          );
        })}
      </svg>

      {/* 3. CENTER CYBERNETIC COMMAND CORE */}
      <motion.div
        className="relative z-20 w-32 h-32 rounded-full glass-panel border-2 border-brand-cyan/50 flex flex-col items-center justify-center p-3 text-center cursor-pointer shadow-2xl group"
        whileHover={{ scale: 1.08 }}
        animate={{
          boxShadow: [
            '0 0 25px rgba(56, 189, 248, 0.25), inset 0 0 15px rgba(56, 189, 248, 0.2)',
            '0 0 45px rgba(59, 130, 246, 0.5), inset 0 0 25px rgba(59, 130, 246, 0.35)',
            '0 0 25px rgba(56, 189, 248, 0.25), inset 0 0 15px rgba(56, 189, 248, 0.2)'
          ]
        }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Rotating outer aperture rim */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute inset-[-4px] rounded-full border border-dashed border-brand-cyan/40"
        />

        <div className="relative flex items-center justify-center mb-1">
          <Cpu className="h-7 w-7 text-brand-cyan animate-pulse" />
          <motion.span
            className="absolute h-10 w-10 rounded-full border border-brand-cyan/40"
            animate={{ scale: [1, 1.3, 1], opacity: [0.8, 0, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
        <span className="text-[11px] font-mono font-black text-white tracking-widest leading-none drop-shadow">
          OPSPILOT
        </span>
        <span className="text-[8px] font-mono font-bold text-brand-cyan tracking-wider uppercase mt-1 px-1.5 py-0.2 rounded bg-brand-cyan/15 border border-brand-cyan/30">
          CORE ENGINE
        </span>
      </motion.div>

      {/* 4. SATELLITE AGENT NODES (7 SPECIALIZED AGENTS) */}
      <div className="absolute w-[560px] h-[560px] pointer-events-none">
        {agents.map((agent) => {
          const rad = (agent.angle * Math.PI) / 180;
          const leftPos = 280 + Math.cos(rad) * 195;
          const topPos = 280 + Math.sin(rad) * 195;
          const Icon = agent.icon;
          const isHovered = hoveredAgent?.id === agent.id;

          return (
            <div
              key={agent.id}
              className="absolute pointer-events-auto"
              style={{
                left: `${leftPos}px`,
                top: `${topPos}px`,
                transform: 'translate(-50%, -50%)'
              }}
              onMouseEnter={() => setHoveredAgent(agent)}
              onMouseLeave={() => setHoveredAgent(null)}
            >
              <motion.div
                whileHover={{ scale: 1.25 }}
                whileTap={{ scale: 0.95 }}
                className={`relative flex items-center justify-center h-12 w-12 rounded-2xl glass-panel cursor-pointer transition-all border ${
                  isHovered
                    ? 'border-white bg-slate-900 shadow-2xl z-30'
                    : 'border-slate-700/80 bg-dark-950/90 hover:border-slate-500'
                }`}
                style={{
                  boxShadow: isHovered
                    ? `0 0 30px ${agent.glow}, inset 0 0 15px ${agent.glow}`
                    : `0 0 12px ${agent.glow}22`
                }}
              >
                <Icon
                  className="h-5 w-5 transition-transform"
                  style={{ color: agent.color }}
                />

                {/* Satellite Active Pulsing Halo */}
                <motion.div
                  className="absolute inset-0 rounded-2xl"
                  animate={{
                    boxShadow: [
                      `0 0 0px ${agent.color}`,
                      `0 0 16px ${agent.glow}`,
                      `0 0 0px ${agent.color}`
                    ]
                  }}
                  transition={{ duration: 2.2, repeat: Infinity }}
                />

                {/* Live Activity Green Dot */}
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span
                    className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                    style={{ backgroundColor: agent.color }}
                  />
                  <span
                    className="relative inline-flex rounded-full h-2.5 w-2.5 border border-dark-950"
                    style={{ backgroundColor: agent.color }}
                  />
                </span>
              </motion.div>

              {/* Node Badge Underneath */}
              <div className="absolute top-14 left-1/2 -translate-x-1/2 whitespace-nowrap text-center">
                <span
                  className="text-[9px] font-mono font-extrabold tracking-wider px-2 py-0.5 rounded-md bg-dark-950/95 border border-slate-800 shadow-lg block"
                  style={{ color: agent.color, borderColor: isHovered ? agent.color : undefined }}
                >
                  {agent.shortName}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 5. FLOATING HUD INSPECTION CARD ON HOVER */}
      <AnimatePresence>
        {hoveredAgent && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            className="absolute bottom-[-135px] left-1/2 -translate-x-1/2 z-40 p-4 rounded-2xl glass-panel border border-slate-700 shadow-2xl bg-dark-950/95 w-80 text-left pointer-events-none backdrop-blur-xl"
            style={{
              borderColor: hoveredAgent.color,
              boxShadow: `0 10px 40px -10px ${hoveredAgent.glow}`
            }}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full animate-ping"
                  style={{ backgroundColor: hoveredAgent.color }}
                />
                <span className="text-xs font-bold text-white font-mono">
                  {hoveredAgent.name}
                </span>
              </div>
              <span
                className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-dark-900 border"
                style={{ color: hoveredAgent.color, borderColor: hoveredAgent.color + '55' }}
              >
                {hoveredAgent.metrics}
              </span>
            </div>

            <p className="text-[11px] text-slate-300 font-sans mb-2.5 leading-snug">
              {hoveredAgent.role}
            </p>

            <div className="space-y-1.5 pt-2 border-t border-slate-800/90">
              <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider font-bold block">
                Active Controlled Tools:
              </span>
              <div className="flex flex-wrap gap-1">
                {hoveredAgent.tools.map((t, idx) => (
                  <span
                    key={idx}
                    className="text-[9px] font-mono bg-slate-900/90 border border-slate-800 px-2 py-0.5 rounded text-slate-300"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
