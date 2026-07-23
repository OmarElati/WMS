'use client';

import { useRef, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import Reveal from '@/components/Reveal';

gsap.registerPlugin(ScrollTrigger);

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  hue: number;
  glow: boolean;
}

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const particlesRef = useRef<Particle[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const bgLayerRef = useRef<HTMLDivElement>(null);
  const transitionRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  const prefersReduced = useReducedMotion();

  const initParticles = useCallback((width: number, height: number) => {
    const count = Math.min(180, Math.floor((width * height) / 7000));
    particlesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.6 + 0.2,
      hue: Math.random() > 0.6 ? 185 : 220,
      glow: Math.random() > 0.7,
    }));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles(canvas.width, canvas.height);
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    const MAX_DIST = 150;
    const MAX_MOUSE = 120;

    const animate = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const distToMouse = Math.sqrt(dx * dx + dy * dy);
        if (distToMouse < MAX_MOUSE) {
          const force = (MAX_MOUSE - distToMouse) / MAX_MOUSE;
          const angle = Math.atan2(dy, dx);
          p.vx += Math.cos(angle) * force * 0.2;
          p.vy += Math.sin(angle) * force * 0.2;
        }

        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > 1.5) {
          p.vx = (p.vx / speed) * 1.5;
          p.vy = (p.vy / speed) * 1.5;
        }
        p.vx *= 0.99;
        p.vy *= 0.99;

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = w;
        else if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        else if (p.y > h) p.y = 0;

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const cx = p.x - p2.x;
          const cy = p.y - p2.y;
          const dist = Math.sqrt(cx * cx + cy * cy);
          if (dist < MAX_DIST) {
            const alpha = 0.18 * (1 - dist / MAX_DIST);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `hsla(${p.hue}, 85%, 65%, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }

        if (p.glow) {
          const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 5);
          grd.addColorStop(0, `hsla(${p.hue}, 90%, 65%, ${p.opacity * 0.4})`);
          grd.addColorStop(1, `hsla(${p.hue}, 90%, 65%, 0)`);
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 5, 0, Math.PI * 2);
          ctx.fillStyle = grd;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 85%, 70%, ${p.opacity})`;
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animRef.current);
    };
  }, [initParticles]);

  /* GSAP ScrollTrigger: hero exit animations (no pin — Lenis snap handles sections) */
  useEffect(() => {
    if (prefersReduced) return;

    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    const ctx = gsap.context(() => {
      gsap.to(content, {
        scale: 0.85,
        opacity: 0,
        y: -80,
        ease: 'power2.in',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.5,
        },
      });

      if (bgLayerRef.current) {
        gsap.to(bgLayerRef.current, {
          opacity: 0,
          scale: 1.15,
          ease: 'power2.in',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.5,
          },
        });
      }

      if (transitionRef.current) {
        gsap.to(transitionRef.current, {
          opacity: 1,
          ease: 'power2.in',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.5,
          },
        });
      }
    });

    return () => ctx.revert();
  }, [prefersReduced]);

  return (
    <section
      id="accueil"
      ref={sectionRef}
      data-theme-section="hero"
      className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* ── BACKGROUND LAYER – fades out on scroll ── */}
      <div ref={bgLayerRef} className="absolute inset-0 z-0">
        <canvas ref={canvasRef} className="absolute inset-0 z-[1]" style={{ opacity: 0.65 }} />
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 80% 80% at 50% 50%, rgba(30,64,175,0.45) 0%, transparent 65%), radial-gradient(ellipse 60% 60% at 80% 20%, rgba(6,182,212,0.18) 0%, transparent 65%)',
          }}
        />
      </div>

      {/* ── TRANSITION GRADIENT – fades in on scroll to blend into services ── */}
      <div
        ref={transitionRef}
        className="absolute inset-0 z-[11] pointer-events-none opacity-0"
        style={{
          background:
            'linear-gradient(to bottom, transparent 0%, rgba(10,22,40,0.4) 30%, rgba(13,31,60,0.8) 60%, #0d1f3c 90%)',
        }}
      />

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 z-10 h-32 sm:h-40 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, #0d1f3c)' }}
      />

      {/* ── CONTENT ── */}
      <div
        ref={contentRef}
        className="hero-content container-page relative z-20 pt-28 sm:pt-32 lg:pt-36 pb-40 sm:pb-44 lg:pb-36 w-full"
      >
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center lg:min-h-[calc(100vh-10rem)]">

          {/* ── Left column: text content ── */}
          <div className="lg:pr-8 xl:pr-16 text-center lg:text-left">

            {/* Badge */}
            <Reveal variant="fadeDown" delay={0.1}>
              <div className="section-tag" style={{ display: 'inline-flex' }}>
                <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block animate-pulse" />
                {t('hero.badge')}
              </div>
            </Reveal>

            {/* Main headline */}
            <Reveal variant="fadeUp" delay={0.2}>
              <h1 className="text-4xl sm:text-5xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-black text-white leading-[1.05] tracking-[-0.03em] mb-6 lg:mb-8">
                {t('hero.headline')}{' '}
                <span className="gradient-text">
                  {t('hero.headline_highlight')}
                </span>
              </h1>
            </Reveal>

            {/* Subheadline */}
            <Reveal variant="fadeUp" delay={0.3}>
              <p className="text-base sm:text-lg text-primary-300 font-semibold mb-5 lg:mb-6 tracking-[-0.01em]">
                {t('hero.subheadline')}
              </p>
            </Reveal>

            {/* Description */}
            <Reveal variant="fadeUp" delay={0.4}>
              <p className="text-slate-400 text-base sm:text-lg leading-[1.7] mb-10 lg:mb-12 max-w-xl lg:max-w-none">
                {t('hero.description')}
              </p>
            </Reveal>

            {/* CTA buttons */}
            <Reveal variant="fadeUp" delay={0.5}>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 mb-12 lg:mb-16 items-center lg:items-start">
                <a href="#services" className="btn-primary text-base sm:text-lg px-10 py-5">
                  {t('hero.cta1')}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
                <a href="#contact" className="btn-outline text-base sm:text-lg px-10 py-5">
                  {t('hero.cta2')}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </a>
              </div>
            </Reveal>

            {/* Stats grid */}
            <Reveal variant="fadeUp" delay={0.6}>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-lg lg:max-w-none">
                {[
                  { val: t('hero.stats_projects'), label: t('hero.stats_projects_label'), accent: '#3b82f6' },
                  { val: t('hero.stats_countries'), label: t('hero.stats_countries_label'), accent: '#06b6d4' },
                  { val: t('hero.stats_clients'), label: t('hero.stats_clients_label'), accent: '#8b5cf6' },
                  { val: t('hero.stats_years'), label: t('hero.stats_years_label'), accent: '#10b981' },
                ].map((s, i) => (
                  <div
                    key={i}
                    className="relative glass-medium rounded-xl p-4 sm:p-5 lg:p-6 text-center overflow-hidden"
                    style={{
                      border: `1px solid ${s.accent}25`,
                      boxShadow: `0 4px 20px ${s.accent}0a, inset 0 0 16px ${s.accent}04`,
                    }}
                  >
                    <div
                      className="absolute top-0 left-0 right-0 h-px"
                      style={{ background: `linear-gradient(to right, transparent, ${s.accent}60, transparent)` }}
                    />
                    <div className="text-xl sm:text-2xl lg:text-3xl font-black mb-1 lg:mb-2 tracking-[-0.02em]" style={{ color: s.accent }}>{s.val}</div>
                    <div className="text-slate-400 text-xs sm:text-sm leading-relaxed">{s.label}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* ── Right column: empty (globe sits behind in background) ── */}
          <div className="hidden lg:block" />
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 sm:bottom-10 left-0 right-0 z-20 flex flex-col items-center gap-1.5 text-slate-500 pointer-events-none">
        <span className="text-[10px] uppercase tracking-[0.2em] font-medium">{t('hero.scroll')}</span>
        <div className="w-px h-8 bg-gradient-to-b from-slate-500 to-transparent animate-pulse" />
        <svg className="w-4 h-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}
