import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function MotionLightCursor() {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  // Raw mouse coordinates
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth springs for trailing motion light effect
  const springConfig = { damping: 28, stiffness: 350, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Slower ambient torch spotlight for realistic lag
  const ambientSpringConfig = { damping: 40, stiffness: 180, mass: 0.8 };
  const ambientX = useSpring(mouseX, ambientSpringConfig);
  const ambientY = useSpring(mouseY, ambientSpringConfig);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);

      // Check if hovering clickable elements
      const target = e.target;
      const isInteractive = target.closest('button, a, input, select, textarea, [role="button"], .cursor-pointer, .glass-panel-hover');
      setIsHovered(!!isInteractive);
    };

    const handleMouseDown = () => {
      setIsClicked(true);
      setTimeout(() => setIsClicked(false), 200);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isVisible, mouseX, mouseY]);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {/* 1. WIDE AMBIENT FLASHLIGHT / SPOTLIGHT ILLUMINATION */}
      <motion.div
        className="absolute rounded-full"
        style={{
          x: ambientX,
          y: ambientY,
          translateX: '-50%',
          translateY: '-50%',
          width: isHovered ? '420px' : '360px',
          height: isHovered ? '420px' : '360px',
          background: isHovered
            ? 'radial-gradient(circle, rgba(56, 189, 248, 0.18) 0%, rgba(99, 102, 241, 0.08) 40%, rgba(0, 0, 0, 0) 70%)'
            : 'radial-gradient(circle, rgba(56, 189, 248, 0.12) 0%, rgba(59, 130, 246, 0.04) 45%, rgba(0, 0, 0, 0) 70%)',
          filter: 'blur(30px)',
          transition: 'width 0.3s ease, height 0.3s ease'
        }}
      />

      {/* 2. INNER GLOWING ENERGY AURA */}
      <motion.div
        className="absolute rounded-full"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
          width: isHovered ? '56px' : '32px',
          height: isHovered ? '56px' : '32px',
          background: isHovered
            ? 'radial-gradient(circle, rgba(56, 189, 248, 0.6) 0%, rgba(59, 130, 246, 0.2) 60%, transparent 100%)'
            : 'radial-gradient(circle, rgba(56, 189, 248, 0.45) 0%, rgba(59, 130, 246, 0.1) 70%, transparent 100%)',
          border: isHovered ? '1.5px solid rgba(56, 189, 248, 0.8)' : '1px solid rgba(56, 189, 248, 0.4)',
          boxShadow: isHovered
            ? '0 0 25px rgba(56, 189, 248, 0.8), inset 0 0 15px rgba(56, 189, 248, 0.4)'
            : '0 0 15px rgba(56, 189, 248, 0.4)',
          transition: 'width 0.2s cubic-bezier(0.16, 1, 0.3, 1), height 0.2s cubic-bezier(0.16, 1, 0.3, 1), border 0.2s ease, box-shadow 0.2s ease'
        }}
      />

      {/* 3. SHARP LUMINOUS MOTION LIGHT CORE (THE CENTER BEAM) */}
      <motion.div
        className="absolute rounded-full bg-white shadow-lg"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
          width: isClicked ? '14px' : isHovered ? '8px' : '6px',
          height: isClicked ? '14px' : isHovered ? '8px' : '6px',
          boxShadow: '0 0 10px #FFFFFF, 0 0 20px #38BDF8, 0 0 35px #38BDF8',
          transition: 'width 0.15s ease, height 0.15s ease'
        }}
      />

      {/* 4. CLICK SHOCKWAVE BURST */}
      {isClicked && (
        <motion.div
          initial={{ scale: 0.5, opacity: 1 }}
          animate={{ scale: 2.2, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="absolute rounded-full border border-brand-cyan"
          style={{
            x: mouseX,
            y: mouseY,
            translateX: '-50%',
            translateY: '-50%',
            width: '60px',
            height: '60px',
            boxShadow: '0 0 20px rgba(56, 189, 248, 0.8)'
          }}
        />
      )}
    </div>
  );
}
