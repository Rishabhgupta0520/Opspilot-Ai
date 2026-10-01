import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Cpu,
  RotateCcw,
  CheckCircle2,
  Workflow,
  Lock,
  Zap,
  ChevronRight
} from 'lucide-react';
import GlowingBackgroundMesh from '../components/motion/GlowingBackgroundMesh';
import AgentOrbitalNetwork from '../components/motion/AgentOrbitalNetwork';

export default function LandingPage() {
  const navigate = useNavigate();

  const capabilities = [
    {
      title: 'Autonomous Goal Decomposition',
      description: 'Business users state goals in natural language. The Planner agent decomposes goals into dependency-aware operational tasks.',
      icon: Workflow,
      badge: 'PLANNER AGENT'
    },
    {
      title: 'Deterministic Policy Engine',
      description: 'The LLM reasons, but application policies govern authority. Financial thresholds (₹5,000) and VIP rules are enforced deterministically.',
      icon: Lock,
      badge: 'GOVERNANCE'
    },
    {
      title: 'Controlled Tool Registry',
      description: 'Zero raw database mutations by LLMs. All actions pass through schema-validated, audited tools with idempotency tokens.',
      icon: Cpu,
      badge: 'SAFE TOOLS'
    },
    {
      title: 'Human-in-the-Loop Safeguards',
      description: 'High-risk and high-value operations automatically pause the execution graph and route evidence cards to human managers.',
      icon: ShieldCheck,
      badge: 'HITL APPROVAL'
    },
    {
      title: 'Read-After-Write Verification',
      description: 'Never mark an action complete merely because an API responded. The Verification agent confirms persistent database state.',
      icon: CheckCircle2,
      badge: 'VERIFICATION'
    },
    {
      title: 'Self-Healing Failure Recovery',
      description: 'Transient courier and gateway timeouts automatically trigger exponential backoff retries, recovering gracefully.',
      icon: RotateCcw,
      badge: 'RECOVERY'
    }
  ];

  const problemTemplates = [
    {
      title: 'Delayed Orders Master Hackathon Goal',
      sample: 'Resolve all delayed orders from today. Prioritize VIP customers. Automatically refund under ₹5,000. Refunds above ₹5,000 require manager approval.',
      metric: '17 Orders Handled'
    },
    {
      title: 'Customer Escalation Triage',
      sample: 'Find VIP customers with open critical tickets and stalled shipments. Escalate to senior logistics.',
      metric: 'Sub-minute Triage'
    },
    {
      title: 'Inventory Stockout Prevention',
      sample: 'Detect products approaching stockout within 3 days. Generate expedited purchase replenishment.',
      metric: 'Zero Stockouts'
    },
    {
      title: 'SLA Breach Mitigation',
      sample: 'Scan tickets with under 4 hours remaining to SLA breach and assign to tier-2 engineers.',
      metric: '100% SLA Guard'
    }
  ];

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 flex flex-col font-sans relative overflow-hidden">
      {/* Dynamic Ambient Background Motion Graphics */}
      <GlowingBackgroundMesh />

      {/* Navigation Bar */}
      <nav className="border-b border-slate-800/80 bg-dark-900/60 backdrop-blur-md px-6 py-4 sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-brand-blue via-brand-cyan to-indigo-500 p-0.5 shadow-lg shadow-brand-cyan/20">
            <div className="h-full w-full bg-dark-950 rounded-[7px] flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-brand-cyan" />
            </div>
          </div>
          <div>
            <span className="font-extrabold tracking-tight text-white text-lg">OpsPilot</span>
            <span className="text-brand-cyan font-bold text-xs ml-1 px-1.5 py-0.5 rounded bg-brand-cyan/10 border border-brand-cyan/20">AI</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/login')}
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-brand-blue to-brand-cyan hover:opacity-90 text-dark-950 font-bold text-xs sm:text-sm transition-all shadow-lg shadow-brand-cyan/15 cursor-pointer"
          >
            <span>Launch Console</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </nav>

      {/* HERO SECTION WITH ORBITAL MOTION GRAPHIC */}
      <header className="relative pt-16 pb-12 px-6 max-w-7xl mx-auto text-center flex flex-col items-center z-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/70 text-slate-300 text-xs font-mono mb-6 backdrop-blur-md"
        >
          <span className="h-2 w-2 rounded-full bg-brand-cyan animate-pulse"></span>
          <span>THE AUTONOMOUS AGENTIC OPERATIONS PLATFORM</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl leading-tight"
        >
          From Business Goal to <br />
          <span className="bg-gradient-to-r from-brand-cyan via-brand-blue to-indigo-400 bg-clip-text text-transparent">
            Verified Action.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl leading-relaxed"
        >
          Give your operations team a goal. Let specialized AI agents plan, investigate, evaluate deterministic policies, execute safe mutations, verify results, and escalate high-risk cases.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-brand-blue via-brand-cyan to-brand-blue hover:brightness-110 text-dark-950 font-bold text-sm sm:text-base transition-all shadow-xl shadow-brand-cyan/20 cursor-pointer"
          >
            <Sparkles className="h-5 w-5" />
            <span>Launch Operations Console</span>
            <ArrowRight className="h-5 w-5" />
          </button>

          <button
            onClick={() => navigate('/approvals')}
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-semibold text-sm sm:text-base transition-all cursor-pointer"
          >
            <ShieldCheck className="h-5 w-5 text-amber-400" />
            <span>Human-in-the-Loop Hub</span>
          </button>
        </motion.div>

        {/* HERO MOTION GRAPHIC: ORBITAL AGENT NETWORK */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-14 mb-8 w-full flex flex-col items-center"
        >
          <div className="text-center mb-3">
            <span className="text-[11px] font-mono uppercase tracking-widest text-brand-cyan font-bold">
              INTERACTIVE AGENTIC TOPOLOGY
            </span>
            <p className="text-xs text-slate-400">Hover over any node to inspect specialized tool capabilities</p>
          </div>
          <div className="h-[460px] w-full flex items-center justify-center">
            <AgentOrbitalNetwork />
          </div>
        </motion.div>

        {/* Architectural Principle Banner */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-6 w-full max-w-3xl p-5 rounded-2xl glass-panel text-left flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-700/60 shadow-xl"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-brand-cyan/10 border border-brand-cyan/30 flex items-center justify-center flex-shrink-0">
              <Zap className="h-5 w-5 text-brand-cyan" />
            </div>
            <div>
              <p className="text-xs uppercase font-mono font-bold text-brand-cyan">Core Architectural Principle</p>
              <h2 className="text-base font-bold text-white">The LLM Reasons. The Application Controls Authority.</h2>
            </div>
          </div>
          <div className="text-xs font-mono text-slate-400 text-right sm:border-l sm:border-slate-800 sm:pl-4">
            Deterministic Policies &bull; Idempotency Keys &bull; State Verification
          </div>
        </motion.div>
      </header>

      {/* Core Capabilities Grid */}
      <section className="py-16 px-6 max-w-6xl mx-auto w-full z-10">
        <div className="text-center mb-12">
          <h2 className="text-xs font-mono uppercase tracking-widest text-brand-cyan font-bold">ENTERPRISE GRADE ARCHITECTURE</h2>
          <p className="text-2xl sm:text-3xl font-extrabold text-white mt-1">Built for Mission-Critical Operations</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {capabilities.map((c, i) => {
            const Icon = c.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4 }}
                className="p-6 rounded-2xl glass-panel glass-panel-hover flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-10 w-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-brand-cyan">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-slate-400 px-2 py-1 rounded bg-slate-800/80 border border-slate-700/50">
                      {c.badge}
                    </span>
                  </div>
                  <h3 className="font-bold text-white text-base mb-2">{c.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{c.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Multi-Problem Reusable Engine */}
      <section className="py-16 px-6 max-w-6xl mx-auto w-full border-t border-slate-800/60 z-10">
        <div className="text-center mb-10">
          <h2 className="text-xs font-mono uppercase tracking-widest text-brand-cyan font-bold">MULTI-PROBLEM ENGINE</h2>
          <p className="text-2xl sm:text-3xl font-extrabold text-white mt-1">One Agentic Engine. Endless Operations.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {problemTemplates.map((p, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.02 }}
              onClick={() => navigate('/dashboard')}
              className="p-5 rounded-xl glass-panel hover:border-brand-cyan/40 cursor-pointer transition-all group flex flex-col justify-between"
            >
              <div>
                <p className="font-bold text-white text-sm group-hover:text-brand-cyan transition-colors">{p.title}</p>
                <p className="text-xs text-slate-400 mt-2 italic bg-slate-900/60 p-2 rounded border border-slate-800/70">"{p.sample}"</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] font-mono text-emerald-400">{p.metric}</span>
                <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-brand-cyan transition-transform group-hover:translate-x-1" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 py-8 px-6 text-center text-xs text-slate-400 font-mono z-10">
        OpsPilot AI &bull; Built for Autonomous Hackathon Excellence &bull; Google Gemini + Node.js + React
      </footer>
    </div>
  );
}
