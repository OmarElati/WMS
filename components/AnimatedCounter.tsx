'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  duration?: number;
  className?: string;
}

export default function AnimatedCounter({
  value,
  suffix = '',
  duration = 2,
  className,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      el.textContent = `${value}${suffix}`;
      setReady(true);
      return;
    }

    const ctx = gsap.context(() => {
      const obj = { val: 0 };
      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.to(obj, {
            val: value,
            duration,
            ease: 'power3.out',
            onUpdate: () => {
              el.textContent = `${Math.round(obj.val)}${suffix}`;
            },
            onComplete: () => setReady(true),
          });
        },
      });
    }, el);

    return () => ctx.revert();
  }, [value, suffix, duration]);

  return <span ref={ref} className={className}>0{suffix}</span>;
}
