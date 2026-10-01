import React from 'react';
import { motion } from 'framer-motion';

export default function GlowingBackgroundMesh() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Subtle Digital Grid */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#38BDF8 1px, transparent 1px), linear-gradient(90deg, #38BDF8 1px, transparent 1px)`,
          backgroundSize: '48px 48px'
        }}
      />

      {/* Floating Orb 1: Cyan */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-brand-cyan/15 to-transparent blur-[120px]"
        animate={{
          x: [0, 80, -40, 0],
          y: [0, -60, 40, 0],
          scale: [1, 1.15, 0.95, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ top: '10%', left: '20%' }}
      />

      {/* Floating Orb 2: Deep Blue / Indigo */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-bl from-indigo-500/10 via-brand-blue/15 to-transparent blur-[140px]"
        animate={{
          x: [0, -70, 50, 0],
          y: [0, 80, -50, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ top: '35%', right: '15%' }}
      />

      {/* Floating Orb 3: Subtle Amber / Glow for HITL Governance */}
      <motion.div
        className="absolute w-[450px] h-[450px] rounded-full bg-gradient-to-tr from-amber-500/8 to-transparent blur-[130px]"
        animate={{
          x: [0, 50, -60, 0],
          y: [0, 40, -40, 0],
          scale: [0.95, 1.1, 1, 0.95],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ bottom: '5%', left: '35%' }}
      />
    </div>
  );
}
