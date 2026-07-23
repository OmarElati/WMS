'use client';

/**
 * ThemeSweepLine — a thin gradient line that sweeps across the top of the
 * viewport each time the section theme changes, giving a cinematic "cut"
 * feel without being distracting.
 */

import { useEffect, useRef } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

export default function ThemeSweepLine() {
  const { currentTheme } = useTheme();
  const lineRef = useRef<HTMLDivElement>(null);
  const prevIdRef = useRef(currentTheme.id);

  useEffect(() => {
    if (currentTheme.id === prevIdRef.current) return;
    prevIdRef.current = currentTheme.id;

    const el = lineRef.current;
    if (!el) return;

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (prefersReduced) return;

    // Reset
    el.classList.remove('active');
    // Force reflow
    void el.offsetWidth;
    el.classList.add('active');

    const tid = setTimeout(() => el.classList.remove('active'), 1100);
    return () => clearTimeout(tid);
  }, [currentTheme]);

  return <div ref={lineRef} className="theme-sweep-line" aria-hidden="true" />;
}
