'use client';

/**
 * useScrollTheme — Sets up GSAP ScrollTrigger watchers for every section
 * and fires ThemeContext.setTheme() when each enters the viewport.
 *
 * Must be called once, after the DOM is ready (inside a Client Component).
 */

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTheme, type SectionId } from '@/contexts/ThemeContext';

gsap.registerPlugin(ScrollTrigger);

// Maps DOM section IDs → theme IDs
const SECTION_MAP: { domId: string; themeId: SectionId }[] = [
  { domId: 'accueil',         themeId: 'hero'         },
  { domId: 'services',        themeId: 'services'     },
  { domId: 'apropos-valeurs', themeId: 'why'          },
  { domId: 'solutions',       themeId: 'solutions'    },
  { domId: 'portfolio',       themeId: 'portfolio'    },
  { domId: 'apropos',         themeId: 'about'        },
  { domId: 'temoignages',     themeId: 'testimonials' },
  { domId: 'blog',            themeId: 'blog'         },
  { domId: 'contact',         themeId: 'contact'      },
];

export function useScrollTheme() {
  const { setTheme } = useTheme();

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    const triggers: ScrollTrigger[] = [];

    SECTION_MAP.forEach(({ domId, themeId }) => {
      const el = document.getElementById(domId);
      if (!el) return;

      const st = ScrollTrigger.create({
        trigger: el,
        start: 'top 55%',
        end: 'bottom 45%',
        onEnter: () => setTheme(themeId),
        onEnterBack: () => setTheme(themeId),
        // For reduced motion just snap — no intermediate progress
        ...(prefersReduced ? {} : {}),
      });

      triggers.push(st);
    });

    return () => {
      triggers.forEach((t) => t.kill());
    };
  }, [setTheme]);
}
