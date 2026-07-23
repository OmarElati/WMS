'use client';

import {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  type ReactNode,
} from 'react';

/* ─────────────────────────────────────────────────────────────────────────────
   SECTION THEME DEFINITIONS
   Each section has a unique cinematic identity.
───────────────────────────────────────────────────────────────────────────── */

export type SectionId =
  | 'hero'
  | 'services'
  | 'why'
  | 'solutions'
  | 'portfolio'
  | 'about'
  | 'testimonials'
  | 'blog'
  | 'contact';

export interface SectionTheme {
  id: SectionId;
  /** CSS gradient for the fixed background canvas */
  background: string;
  /** Ambient glow colour (radial, centred) */
  ambientColor: string;
  ambientOpacity: number;
  /** Primary accent used for particles / lines */
  particleHue: number;
  particleHue2: number;
  particleCount: number;
  /** Vignette / overlay gradient layered on top of the canvas */
  overlayGradient: string;
  /** Noise / pattern type rendered on canvas */
  patternType: 'stars' | 'circuit' | 'grid' | 'dots' | 'waves' | 'hex' | 'none';
  patternOpacity: number;
  /** CSS variables injected on <html> for component use */
  cssVars: Record<string, string>;
  /** Planet/celestial body identifier for the 3D globe */
  planetId: string;
}

export const SECTION_THEMES: Record<SectionId, SectionTheme> = {
  /* ── 1. HERO — Deep Space ─────────────────────────────────────── */
  hero: {
    id: 'hero',
    background:
      'radial-gradient(ellipse 80% 80% at 20% 50%, #1e3a8a 0%, transparent 65%),' +
      'radial-gradient(ellipse 60% 60% at 80% 30%, #0e7490 0%, transparent 65%),' +
      'radial-gradient(ellipse 40% 40% at 50% 80%, #3730a3 0%, transparent 70%),' +
      'linear-gradient(180deg, #020817 0%, #060d1a 40%, #0a1628 100%)',
    ambientColor: '#1d4ed8',
    ambientOpacity: 0.35,
    particleHue: 220,
    particleHue2: 185,
    particleCount: 180,
    overlayGradient:
      'radial-gradient(ellipse 100% 60% at 50% 0%, rgba(30,64,175,0.18) 0%, transparent 70%)',
    patternType: 'stars',
    patternOpacity: 0.55,
    planetId: 'earth',
    cssVars: {
      '--theme-accent': '#3b82f6',
      '--theme-accent2': '#06b6d4',
      '--theme-glow': 'rgba(59,130,246,0.25)',
      '--theme-card-bg': 'rgba(15,23,42,0.85)',
      '--theme-section-bg': '#0a1628',
      '--theme-gradient-text-from': '#60a5fa',
      '--theme-gradient-text-to': '#06b6d4',
    },
  },

  /* ── 2. SERVICES — Dark Tech / Circuit ───────────────────────── */
  services: {
    id: 'services',
    background:
      'radial-gradient(ellipse 70% 50% at 80% 20%, rgba(6,182,212,0.12) 0%, transparent 60%),' +
      'radial-gradient(ellipse 50% 50% at 10% 80%, rgba(8,145,178,0.1) 0%, transparent 60%),' +
      'linear-gradient(160deg, #040d1a 0%, #071520 40%, #0a1e30 70%, #071520 100%)',
    ambientColor: '#06b6d4',
    ambientOpacity: 0.12,
    particleHue: 190,
    particleHue2: 200,
    particleCount: 120,
    overlayGradient:
      'radial-gradient(ellipse 80% 40% at 50% 100%, rgba(6,182,212,0.07) 0%, transparent 70%)',
    patternType: 'circuit',
    patternOpacity: 0.06,
    planetId: 'neptune',
    cssVars: {
      '--theme-accent': '#06b6d4',
      '--theme-accent2': '#3b82f6',
      '--theme-glow': 'rgba(6,182,212,0.2)',
      '--theme-card-bg': 'rgba(4,13,26,0.9)',
      '--theme-section-bg': '#071520',
      '--theme-gradient-text-from': '#22d3ee',
      '--theme-gradient-text-to': '#3b82f6',
    },
  },

  /* ── 3. WHY WMS — Corporate Blue Depth ───────────────────────── */
  why: {
    id: 'why',
    background:
      'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(30,64,175,0.15) 0%, transparent 70%),' +
      'radial-gradient(ellipse 40% 40% at 90% 10%, rgba(99,102,241,0.08) 0%, transparent 60%),' +
      'linear-gradient(180deg, #071520 0%, #0a1628 50%, #0d1f3c 100%)',
    ambientColor: '#1e40af',
    ambientOpacity: 0.15,
    particleHue: 225,
    particleHue2: 240,
    particleCount: 80,
    overlayGradient:
      'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(30,64,175,0.08) 0%, transparent 70%)',
    patternType: 'dots',
    patternOpacity: 0.04,
    planetId: 'saturn',
    cssVars: {
      '--theme-accent': '#4f46e5',
      '--theme-accent2': '#3b82f6',
      '--theme-glow': 'rgba(79,70,229,0.2)',
      '--theme-card-bg': 'rgba(10,22,40,0.9)',
      '--theme-section-bg': '#0a1628',
      '--theme-gradient-text-from': '#818cf8',
      '--theme-gradient-text-to': '#60a5fa',
    },
  },

  /* ── 4. SOLUTIONS — Purple Data Viz ──────────────────────────── */
  solutions: {
    id: 'solutions',
    background:
      'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(88,28,135,0.2) 0%, transparent 65%),' +
      'radial-gradient(ellipse 60% 60% at 80% 80%, rgba(124,58,237,0.12) 0%, transparent 60%),' +
      'radial-gradient(ellipse 40% 40% at 10% 50%, rgba(139,92,246,0.1) 0%, transparent 60%),' +
      'linear-gradient(160deg, #07061a 0%, #0f0a25 50%, #130d2e 100%)',
    ambientColor: '#7c3aed',
    ambientOpacity: 0.2,
    particleHue: 265,
    particleHue2: 285,
    particleCount: 100,
    overlayGradient:
      'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(124,58,237,0.1) 0%, transparent 70%)',
    patternType: 'hex',
    patternOpacity: 0.05,
    planetId: 'jupiter',
    cssVars: {
      '--theme-accent': '#8b5cf6',
      '--theme-accent2': '#a78bfa',
      '--theme-glow': 'rgba(139,92,246,0.25)',
      '--theme-card-bg': 'rgba(7,6,26,0.92)',
      '--theme-section-bg': '#0f0a25',
      '--theme-gradient-text-from': '#c084fc',
      '--theme-gradient-text-to': '#818cf8',
    },
  },

  /* ── 5. PORTFOLIO — Midnight Emerald ─────────────────────────── */
  portfolio: {
    id: 'portfolio',
    background:
      'radial-gradient(ellipse 70% 50% at 20% 50%, rgba(4,120,87,0.14) 0%, transparent 60%),' +
      'radial-gradient(ellipse 50% 50% at 85% 30%, rgba(5,150,105,0.1) 0%, transparent 60%),' +
      'linear-gradient(160deg, #020f0c 0%, #061a14 50%, #081f18 100%)',
    ambientColor: '#059669',
    ambientOpacity: 0.15,
    particleHue: 160,
    particleHue2: 175,
    particleCount: 90,
    overlayGradient:
      'radial-gradient(ellipse 60% 40% at 50% 80%, rgba(4,120,87,0.08) 0%, transparent 70%)',
    patternType: 'grid',
    patternOpacity: 0.04,
    planetId: 'mars',
    cssVars: {
      '--theme-accent': '#10b981',
      '--theme-accent2': '#34d399',
      '--theme-glow': 'rgba(16,185,129,0.2)',
      '--theme-card-bg': 'rgba(2,15,12,0.92)',
      '--theme-section-bg': '#061a14',
      '--theme-gradient-text-from': '#6ee7b7',
      '--theme-gradient-text-to': '#34d399',
    },
  },

  /* ── 6. ABOUT — Warm Nebula ───────────────────────────────────── */
  about: {
    id: 'about',
    background:
      'radial-gradient(ellipse 70% 60% at 70% 50%, rgba(194,65,12,0.12) 0%, transparent 60%),' +
      'radial-gradient(ellipse 50% 50% at 20% 30%, rgba(124,58,237,0.1) 0%, transparent 60%),' +
      'radial-gradient(ellipse 40% 40% at 50% 90%, rgba(245,158,11,0.08) 0%, transparent 60%),' +
      'linear-gradient(160deg, #0d0806 0%, #160c0a 50%, #1a0f0c 100%)',
    ambientColor: '#f59e0b',
    ambientOpacity: 0.1,
    particleHue: 30,
    particleHue2: 280,
    particleCount: 70,
    overlayGradient:
      'radial-gradient(ellipse 60% 50% at 80% 30%, rgba(194,65,12,0.06) 0%, transparent 70%)',
    patternType: 'waves',
    patternOpacity: 0.04,
    planetId: 'titan',
    cssVars: {
      '--theme-accent': '#f59e0b',
      '--theme-accent2': '#8b5cf6',
      '--theme-glow': 'rgba(245,158,11,0.2)',
      '--theme-card-bg': 'rgba(13,8,6,0.92)',
      '--theme-section-bg': '#160c0a',
      '--theme-gradient-text-from': '#fcd34d',
      '--theme-gradient-text-to': '#f97316',
    },
  },

  /* ── 7. TESTIMONIALS — Deep Slate Trust ──────────────────────── */
  testimonials: {
    id: 'testimonials',
    background:
      'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(30,58,138,0.15) 0%, transparent 70%),' +
      'radial-gradient(ellipse 40% 40% at 10% 20%, rgba(15,23,42,0.6) 0%, transparent 60%),' +
      'linear-gradient(180deg, #04090f 0%, #071018 50%, #060e18 100%)',
    ambientColor: '#1e3a8a',
    ambientOpacity: 0.18,
    particleHue: 215,
    particleHue2: 230,
    particleCount: 60,
    overlayGradient:
      'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(30,58,138,0.08) 0%, transparent 70%)',
    patternType: 'dots',
    patternOpacity: 0.035,
    planetId: 'io',
    cssVars: {
      '--theme-accent': '#3b82f6',
      '--theme-accent2': '#60a5fa',
      '--theme-glow': 'rgba(59,130,246,0.18)',
      '--theme-card-bg': 'rgba(4,9,15,0.92)',
      '--theme-section-bg': '#071018',
      '--theme-gradient-text-from': '#93c5fd',
      '--theme-gradient-text-to': '#60a5fa',
    },
  },

  /* ── 8. BLOG — Electric Ink ───────────────────────────────────── */
  blog: {
    id: 'blog',
    background:
      'radial-gradient(ellipse 60% 40% at 80% 20%, rgba(236,72,153,0.1) 0%, transparent 60%),' +
      'radial-gradient(ellipse 50% 50% at 20% 70%, rgba(99,102,241,0.1) 0%, transparent 60%),' +
      'linear-gradient(160deg, #080510 0%, #0d0a1c 50%, #100c1e 100%)',
    ambientColor: '#db2777',
    ambientOpacity: 0.1,
    particleHue: 320,
    particleHue2: 250,
    particleCount: 75,
    overlayGradient:
      'radial-gradient(ellipse 60% 40% at 80% 10%, rgba(236,72,153,0.06) 0%, transparent 70%)',
    patternType: 'none',
    patternOpacity: 0,
    planetId: 'comet',
    cssVars: {
      '--theme-accent': '#ec4899',
      '--theme-accent2': '#8b5cf6',
      '--theme-glow': 'rgba(236,72,153,0.18)',
      '--theme-card-bg': 'rgba(8,5,16,0.92)',
      '--theme-section-bg': '#0d0a1c',
      '--theme-gradient-text-from': '#f9a8d4',
      '--theme-gradient-text-to': '#c084fc',
    },
  },

  /* ── 9. CONTACT — Mission Control ────────────────────────────── */
  contact: {
    id: 'contact',
    background:
      'radial-gradient(ellipse 80% 60% at 50% 80%, rgba(30,64,175,0.2) 0%, transparent 65%),' +
      'radial-gradient(ellipse 50% 50% at 80% 10%, rgba(6,182,212,0.1) 0%, transparent 60%),' +
      'linear-gradient(180deg, #020817 0%, #050d1a 60%, #06101f 100%)',
    ambientColor: '#1d4ed8',
    ambientOpacity: 0.22,
    particleHue: 220,
    particleHue2: 200,
    particleCount: 110,
    overlayGradient:
      'radial-gradient(ellipse 70% 50% at 50% 100%, rgba(30,64,175,0.14) 0%, transparent 70%)',
    patternType: 'stars',
    patternOpacity: 0.3,
    planetId: 'earth-return',
    cssVars: {
      '--theme-accent': '#3b82f6',
      '--theme-accent2': '#06b6d4',
      '--theme-glow': 'rgba(59,130,246,0.22)',
      '--theme-card-bg': 'rgba(2,8,23,0.94)',
      '--theme-section-bg': '#050d1a',
      '--theme-gradient-text-from': '#60a5fa',
      '--theme-gradient-text-to': '#06b6d4',
    },
  },
};

/* ─────────────────────────────────────────────────────────────────────────────
   THEME CONTEXT
───────────────────────────────────────────────────────────────────────────── */

interface ThemeContextValue {
  currentTheme: SectionTheme;
  previousTheme: SectionTheme | null;
  progress: number; // 0‒1 cross-fade progress between prev → current
  setTheme: (id: SectionId, progress?: number) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  currentTheme: SECTION_THEMES.hero,
  previousTheme: null,
  progress: 1,
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [currentTheme, setCurrentThemeState] = useState<SectionTheme>(
    SECTION_THEMES.hero,
  );
  const [previousTheme, setPreviousTheme] = useState<SectionTheme | null>(null);
  const [progress, setProgress] = useState(1);
  const prevIdRef = useRef<SectionId>('hero');

  const setTheme = useCallback((id: SectionId, prog = 1) => {
    if (id !== prevIdRef.current) {
      setPreviousTheme(SECTION_THEMES[prevIdRef.current]);
      prevIdRef.current = id;
    }
    setCurrentThemeState(SECTION_THEMES[id]);
    setProgress(prog);
  }, []);

  return (
    <ThemeContext.Provider value={{ currentTheme, previousTheme, progress, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
