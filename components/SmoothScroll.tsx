'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import Lenis from 'lenis';
import Snap from 'lenis/snap';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLenis } from '@/contexts/LenisContext';

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const snapRef = useRef<Snap | null>(null);
  const { setLenis } = useLenis();

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 0.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1.5,
      smoothWheel: true,
      syncTouch: true,
      anchors: true,
    });

    lenisRef.current = lenis;
    setLenis(lenis);

    const snap = new Snap(lenis, {
      type: 'mandatory',
      duration: 0.4,
      debounce: 50,
    });

    const sections = document.querySelectorAll<HTMLElement>('main > section');
    snap.addElements(Array.from(sections));

    snapRef.current = snap;

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    return () => {
      snap.destroy();
      lenis.destroy();
      gsap.ticker.lagSmoothing(0);
    };
  }, [setLenis]);

  return <>{children}</>;
}
