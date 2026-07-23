'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useTheme, type SectionId } from '@/contexts/ThemeContext';
import FooterToggle from './FooterToggle';

const THEME_COLORS: Record<SectionId, { bg: string; border: string; icon: string; hover: string }> = {
  hero:        { bg: 'rgba(59,130,246,0.15)',  border: 'rgba(59,130,246,0.3)',   icon: '#60a5fa', hover: 'rgba(59,130,246,0.25)' },
  services:    { bg: 'rgba(6,182,212,0.15)',   border: 'rgba(6,182,212,0.3)',    icon: '#22d3ee', hover: 'rgba(6,182,212,0.25)' },
  why:         { bg: 'rgba(79,70,229,0.15)',   border: 'rgba(79,70,229,0.3)',    icon: '#a5b4fc', hover: 'rgba(79,70,229,0.25)' },
  solutions:   { bg: 'rgba(139,92,246,0.15)',  border: 'rgba(139,92,246,0.3)',   icon: '#c4b5fd', hover: 'rgba(139,92,246,0.25)' },
  portfolio:   { bg: 'rgba(16,185,129,0.15)',  border: 'rgba(16,185,129,0.3)',   icon: '#6ee7b7', hover: 'rgba(16,185,129,0.25)' },
  about:       { bg: 'rgba(245,158,11,0.15)',  border: 'rgba(245,158,11,0.3)',   icon: '#fcd34d', hover: 'rgba(245,158,11,0.25)' },
  testimonials:{ bg: 'rgba(59,130,246,0.12)',  border: 'rgba(59,130,246,0.25)',  icon: '#93c5fd', hover: 'rgba(59,130,246,0.2)' },
  blog:        { bg: 'rgba(236,72,153,0.12)',  border: 'rgba(236,72,153,0.25)',  icon: '#f9a8d4', hover: 'rgba(236,72,153,0.2)' },
  contact:     { bg: 'rgba(59,130,246,0.15)',  border: 'rgba(59,130,246,0.3)',   icon: '#60a5fa', hover: 'rgba(59,130,246,0.25)' },
};

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const { currentTheme } = useTheme();
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
  };

  const colors = THEME_COLORS[currentTheme.id] || THEME_COLORS.hero;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5">
      <FooterToggle visible={visible} />

      <motion.button
        id="scroll-to-top"
        onClick={scrollTop}
        aria-label="Retour en haut"
        className="w-11 h-11 rounded-xl flex items-center justify-center cursor-pointer backdrop-blur-md"
        style={{
          background: colors.bg,
          border: `1px solid ${colors.border}`,
          color: colors.icon,
        }}
        initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 16, scale: 0.8 }}
        animate={visible
          ? (prefersReduced ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 })
          : (prefersReduced ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.8 })
        }
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        whileHover={prefersReduced ? {} : { scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.background = colors.hover;
          (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 24px ${colors.border}`;
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.background = colors.bg;
          (e.currentTarget as HTMLElement).style.boxShadow = 'none';
        }}
      >
        <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
        </svg>
      </motion.button>
    </div>
  );
}
