'use client';

import { useEffect } from 'react';

/**
 * Global scroll animation trigger — observes all .animate-on-scroll,
 * .animate-left, .animate-right, .animate-scale elements and adds
 * the .visible class when they enter the viewport.
 * Using rootMargin to trigger slightly early so elements are never
 * invisible when the user scrolls to them.
 */
export default function AnimationObserver() {
  useEffect(() => {
    const selectors = [
      '.animate-on-scroll',
      '.animate-left',
      '.animate-right',
      '.animate-scale',
    ];

    const elements = document.querySelectorAll<HTMLElement>(selectors.join(', '));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Once visible, no need to keep observing
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0,
        rootMargin: '0px 0px -60px 0px', // trigger 60px before element enters bottom of screen
      },
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return null;
}
