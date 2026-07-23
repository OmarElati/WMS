'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useTheme, type SectionId } from '@/contexts/ThemeContext';
import { useLenis } from '@/contexts/LenisContext';

/* ─────────────────────────────────────────────────────────────────────────────
   PER-SECTION SCROLL BEHAVIOR CONFIGS
   Each section gets a unique scroll feel matching its mood.
───────────────────────────────────────────────────────────────────────────── */

interface ScrollBehavior {
  /** Duration of the smooth scroll in seconds */
  duration: number;
  /** Easing function */
  easing: (t: number) => number;
  /** Wheel multiplier — higher = faster response */
  wheelMultiplier: number;
  /** Snap strength override (0 = off, 1 = strong) */
  snapStrength: number;
}

const SCROLL_CONFIGS: Record<SectionId, ScrollBehavior> = {
  /* Hero — Deep Space: Slow, floating, dreamy */
  hero: {
    duration: 1.4,
    easing: (t) => 1 - Math.pow(1 - t, 4), // easeOutQuart — gentle deceleration
    wheelMultiplier: 0.7,
    snapStrength: 1.0,
  },

  /* Services — Tech: Fast, decisive, snappy */
  services: {
    duration: 0.5,
    easing: (t) => t * (2 - t), // easeOutQuad — quick response
    wheelMultiplier: 2.0,
    snapStrength: 0.8,
  },

  /* Why WMS — Corporate: Standard, professional */
  why: {
    duration: 0.8,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
    wheelMultiplier: 1.3,
    snapStrength: 0.9,
  },

  /* Solutions — Purple: Medium, data-driven feel */
  solutions: {
    duration: 0.65,
    easing: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t, // easeInOutQuad
    wheelMultiplier: 1.6,
    snapStrength: 0.85,
  },

  /* Portfolio — Emerald: Standard, gallery browsing */
  portfolio: {
    duration: 0.9,
    easing: (t) => 1 - Math.pow(1 - t, 3), // easeOutCubic
    wheelMultiplier: 1.1,
    snapStrength: 0.7,
  },

  /* About — Warm: Gentle, reflective */
  about: {
    duration: 1.1,
    easing: (t) => 1 - Math.pow(1 - t, 5), // easeOutQuint — very gentle
    wheelMultiplier: 0.85,
    snapStrength: 0.6,
  },

  /* Testimonials — Trust: Standard, steady */
  testimonials: {
    duration: 0.75,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
    wheelMultiplier: 1.2,
    snapStrength: 0.8,
  },

  /* Blog — Electric: Fast, energetic */
  blog: {
    duration: 0.55,
    easing: (t) => t * (2 - t), // easeOutQuad — quick
    wheelMultiplier: 1.8,
    snapStrength: 0.75,
  },

  /* Contact — Mission Control: Standard, purposeful */
  contact: {
    duration: 0.7,
    easing: (t) => 1 - Math.pow(1 - t, 3), // easeOutCubic
    wheelMultiplier: 1.4,
    snapStrength: 0.9,
  },
};

/* ─────────────────────────────────────────────────────────────────────────────
   SCROLL BEHAVIOR MANAGER
   Listens to theme changes and smoothly transitions Lenis config.
───────────────────────────────────────────────────────────────────────────── */

export default function ScrollBehaviorManager() {
  const { currentTheme } = useTheme();
  const { lenis } = useLenis();
  const animRef = useRef<gsap.core.Tween | null>(null);
  const currentValues = useRef({
    duration: 0.8,
    wheelMultiplier: 1.5,
  });

  useEffect(() => {
    if (!lenis) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const config = SCROLL_CONFIGS[currentTheme.id] || SCROLL_CONFIGS.hero;

    /* Kill any running interpolation */
    if (animRef.current) {
      animRef.current.kill();
    }

    if (prefersReduced) {
      /* Just apply immediately */
      lenis.options.duration = config.duration;
      lenis.options.easing = config.easing;
      lenis.options.wheelMultiplier = config.wheelMultiplier;
      return;
    }

    /* Smoothly interpolate to new values */
    const proxy = {
      duration: currentValues.current.duration,
      wheelMultiplier: currentValues.current.wheelMultiplier,
    };

    animRef.current = gsap.to(proxy, {
      duration: 0.6,
      ease: 'power2.inOut',
      wheelMultiplier: config.wheelMultiplier,
      onUpdate: () => {
        lenis.options.duration = proxy.duration;
        lenis.options.wheelMultiplier = proxy.wheelMultiplier;
        lenis.options.easing = config.easing;
      },
      onComplete: () => {
        currentValues.current.duration = proxy.duration;
        currentValues.current.wheelMultiplier = proxy.wheelMultiplier;
      },
    });

    return () => {
      if (animRef.current) {
        animRef.current.kill();
      }
    };
  }, [currentTheme.id, lenis]);

  return null;
}
