'use client';

import { useEffect, useRef, type DependencyList } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type AnimationSetup = (ctx: gsap.Context) => void;

export function useGsapAnimation(
  setup: AnimationSetup,
  deps: DependencyList = [],
) {
  const scopeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context((self) => {
      setup(self);
    }, scopeRef.current || undefined);

    return () => {
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return scopeRef;
}
