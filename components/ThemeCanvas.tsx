'use client';

/**
 * ThemeCanvas — fixed full-viewport background that renders the current
 * section theme with GPU-accelerated canvas particles, patterns, and
 * smooth GSAP-driven cross-fades between themes.
 *
 * Architecture:
 *  - Two off-screen canvases (A/B) that cross-fade during transitions.
 *  - Particles are per-theme with hue, density, and connection line style.
 *  - SVG-pattern overlays (circuit, hex, grid, dots) fade in/out.
 *  - A CSS-variable <div> acts as the backdrop gradient layer.
 *  - All animation pauses when prefers-reduced-motion is active.
 */

import { useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTheme, type SectionTheme } from '@/contexts/ThemeContext';

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────────────────────────────────────
   PARTICLE SYSTEM
───────────────────────────────────────────────────────────────────────────── */
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  hue: number;
  glow: boolean;
  twinklePhase: number;
  twinkleSpeed: number;
}

function createParticles(
  count: number,
  width: number,
  height: number,
  hue1: number,
  hue2: number,
  patternType: SectionTheme['patternType'],
): Particle[] {
  return Array.from({ length: count }, () => {
    const isStar = patternType === 'stars';
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * (isStar ? 0.25 : 0.4),
      vy: (Math.random() - 0.5) * (isStar ? 0.25 : 0.4),
      size: isStar
        ? Math.random() * 1.5 + 0.3
        : Math.random() * 2.5 + 0.5,
      opacity: Math.random() * 0.6 + 0.2,
      hue: Math.random() > 0.5 ? hue1 : hue2,
      glow: Math.random() > 0.6,
      twinklePhase: Math.random() * Math.PI * 2,
      twinkleSpeed: 0.01 + Math.random() * 0.02,
    };
  });
}

/* ─────────────────────────────────────────────────────────────────────────────
   PATTERN RENDERERS
───────────────────────────────────────────────────────────────────────────── */
function drawCircuitPattern(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  opacity: number,
  hue: number,
) {
  ctx.save();
  ctx.strokeStyle = `hsla(${hue}, 80%, 60%, ${opacity})`;
  ctx.lineWidth = 0.5;

  const gridSize = 60;
  const cols = Math.ceil(w / gridSize) + 1;
  const rows = Math.ceil(h / gridSize) + 1;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * gridSize;
      const y = row * gridSize;
      const seed = (row * 100 + col) * 7 + 13;
      const r = ((seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;

      if (r > 0.5) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + gridSize, y);
        ctx.stroke();
      }
      if (r > 0.6) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + gridSize);
        ctx.stroke();
      }
      if (r > 0.8) {
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${hue}, 80%, 70%, ${opacity * 3})`;
        ctx.fill();
      }
    }
  }
  ctx.restore();
}

function drawGridPattern(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  opacity: number,
  hue: number,
) {
  ctx.save();
  ctx.strokeStyle = `hsla(${hue}, 60%, 60%, ${opacity})`;
  ctx.lineWidth = 0.5;
  const size = 40;

  for (let x = 0; x <= w; x += size) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = 0; y <= h; y += size) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }
  ctx.restore();
}

function drawDotsPattern(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  opacity: number,
  hue: number,
) {
  ctx.save();
  const size = 32;
  ctx.fillStyle = `hsla(${hue}, 70%, 65%, ${opacity})`;
  for (let x = size / 2; x <= w; x += size) {
    for (let y = size / 2; y <= h; y += size) {
      ctx.beginPath();
      ctx.arc(x, y, 1, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
}

function drawHexPattern(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  opacity: number,
  hue: number,
) {
  ctx.save();
  ctx.strokeStyle = `hsla(${hue}, 70%, 65%, ${opacity})`;
  ctx.lineWidth = 0.6;
  const r = 35;
  const dx = r * 1.732;
  const dy = r * 1.5;

  for (let row = -1; row <= h / dy + 1; row++) {
    for (let col = -1; col <= w / dx + 1; col++) {
      const cx = col * dx + (row % 2 === 0 ? 0 : dx / 2);
      const cy = row * dy;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 6;
        const px = cx + r * Math.cos(angle);
        const py = cy + r * Math.sin(angle);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();
    }
  }
  ctx.restore();
}

function drawWavesPattern(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  opacity: number,
  hue: number,
  time: number,
) {
  ctx.save();
  ctx.strokeStyle = `hsla(${hue}, 70%, 65%, ${opacity})`;
  ctx.lineWidth = 0.7;
  const waveCount = 6;
  for (let i = 0; i < waveCount; i++) {
    const yBase = (h / waveCount) * i + h / (waveCount * 2);
    ctx.beginPath();
    for (let x = 0; x <= w; x += 4) {
      const y =
        yBase +
        Math.sin(x * 0.015 + time * 0.3 + i * 0.8) * 18 +
        Math.sin(x * 0.03 + time * 0.15 + i * 0.4) * 8;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  ctx.restore();
}

/* ─────────────────────────────────────────────────────────────────────────────
   CANVAS RENDERER — renders particles + optional pattern on a given canvas
───────────────────────────────────────────────────────────────────────────── */
interface CanvasState {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  particles: Particle[];
  theme: SectionTheme;
  opacity: number; // 0–1 for cross-fade
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────────────────────── */
export default function ThemeCanvas() {
  const { currentTheme } = useTheme();

  // Two canvas layers for cross-fading
  const canvasARef = useRef<HTMLCanvasElement>(null);
  const canvasBRef = useRef<HTMLCanvasElement>(null);
  const gradientDivRef = useRef<HTMLDivElement>(null);
  const patternDivRef = useRef<HTMLDivElement>(null);

  const animFrameRef = useRef<number>(0);
  const timeRef = useRef(0);
  const currentThemeRef = useRef<SectionTheme>(currentTheme);
  const prevThemeRef = useRef<SectionTheme | null>(null);
  const crossFadeRef = useRef(1); // 0 = fully prev, 1 = fully current
  const particlesARef = useRef<Particle[]>([]);
  const particlesBRef = useRef<Particle[]>([]);
  const crossfadeTweenRef = useRef<gsap.core.Tween | null>(null);

  const prefersReducedRef = useRef(false);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const isInitialRef = useRef(true);

  // Size
  const sizeRef = useRef({ w: 0, h: 0 });

  /* ── Init particles for a given canvas slot ── */
  const initParticles = useCallback(
    (theme: SectionTheme, slot: 'A' | 'B') => {
      const { w, h } = sizeRef.current;
      const p = createParticles(
        prefersReducedRef.current ? 0 : theme.particleCount,
        w,
        h,
        theme.particleHue,
        theme.particleHue2,
        theme.patternType,
      );
      if (slot === 'A') particlesARef.current = p;
      else particlesBRef.current = p;
    },
    [],
  );

  /* ── Render a single canvas layer ── */
  const renderLayer = useCallback(
    (
      canvas: HTMLCanvasElement,
      ctx: CanvasRenderingContext2D,
      particles: Particle[],
      theme: SectionTheme,
      alpha: number,
    ) => {
      const { w, h } = sizeRef.current;
      const t = timeRef.current;
      ctx.clearRect(0, 0, w, h);

      if (alpha <= 0) return;

      ctx.save();
      ctx.globalAlpha = alpha;

      // Draw background pattern
      if (theme.patternType !== 'none' && theme.patternOpacity > 0) {
        const pOp = theme.patternOpacity * alpha;
        switch (theme.patternType) {
          case 'circuit':
            drawCircuitPattern(ctx, w, h, pOp, theme.particleHue);
            break;
          case 'grid':
            drawGridPattern(ctx, w, h, pOp, theme.particleHue);
            break;
          case 'dots':
            drawDotsPattern(ctx, w, h, pOp, theme.particleHue);
            break;
          case 'hex':
            drawHexPattern(ctx, w, h, pOp, theme.particleHue);
            break;
          case 'waves':
            drawWavesPattern(ctx, w, h, pOp, theme.particleHue, t);
            break;
          case 'stars':
          default:
            break;
        }
      }

      const mouse = mouseRef.current;
      const MAX_DIST = 140;
      const MAX_MOUSE = 100;
      const isStar = theme.patternType === 'stars';

      // Update & draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Mouse repulsion
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dm = Math.sqrt(dx * dx + dy * dy);
        if (dm < MAX_MOUSE) {
          const force = (MAX_MOUSE - dm) / MAX_MOUSE;
          const angle = Math.atan2(dy, dx);
          p.vx += Math.cos(angle) * force * 0.15;
          p.vy += Math.sin(angle) * force * 0.15;
        }

        // Speed cap + friction
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        const maxSpeed = 1.2;
        if (speed > maxSpeed) {
          p.vx = (p.vx / speed) * maxSpeed;
          p.vy = (p.vy / speed) * maxSpeed;
        }
        p.vx *= 0.992;
        p.vy *= 0.992;

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = w;
        else if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        else if (p.y > h) p.y = 0;

        // Twinkle
        p.twinklePhase += p.twinkleSpeed;
        const twinkle = 0.7 + 0.3 * Math.sin(p.twinklePhase);

        // Connection lines (skip for star pattern — too dense)
        if (!isStar) {
          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const cx = p.x - p2.x;
            const cy = p.y - p2.y;
            const dist = Math.sqrt(cx * cx + cy * cy);
            if (dist < MAX_DIST) {
              const lineAlpha = 0.18 * (1 - dist / MAX_DIST) * alpha;
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = `hsla(${p.hue}, 80%, 65%, ${lineAlpha})`;
              ctx.lineWidth = 0.4;
              ctx.stroke();
            }
          }
        }

        // Glow halo
        if (p.glow) {
          const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 6);
          grd.addColorStop(0, `hsla(${p.hue}, 85%, 65%, ${p.opacity * twinkle * 0.35 * alpha})`);
          grd.addColorStop(1, `hsla(${p.hue}, 85%, 65%, 0)`);
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 6, 0, Math.PI * 2);
          ctx.fillStyle = grd;
          ctx.fill();
        }

        // Core dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * twinkle, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 80%, 72%, ${p.opacity * twinkle * alpha})`;
        ctx.fill();
      }

      ctx.restore();
    },
    [],
  );

  /* ── Main animation loop ── */
  const animate = useCallback(() => {
    timeRef.current += 0.016;

    const canvasA = canvasARef.current;
    const canvasB = canvasBRef.current;
    if (!canvasA || !canvasB) {
      animFrameRef.current = requestAnimationFrame(animate);
      return;
    }

    const ctxA = canvasA.getContext('2d');
    const ctxB = canvasB.getContext('2d');
    if (!ctxA || !ctxB) {
      animFrameRef.current = requestAnimationFrame(animate);
      return;
    }

    const cf = crossFadeRef.current;

    // Canvas A = current theme
    renderLayer(canvasA, ctxA, particlesARef.current, currentThemeRef.current, 1);

    // Canvas B = previous theme (fades out as cf goes from 0→1)
    if (prevThemeRef.current && cf < 1) {
      renderLayer(canvasB, ctxB, particlesBRef.current, prevThemeRef.current, 1 - cf);
    } else {
      ctxB.clearRect(0, 0, sizeRef.current.w, sizeRef.current.h);
    }

    // Update gradient div
    if (gradientDivRef.current) {
      const cur = currentThemeRef.current;
      const prev = prevThemeRef.current;
      if (prev && cf < 1) {
        // During transition let CSS handle it — opacity drives the blend
        gradientDivRef.current.style.background = cur.background;
      } else {
        gradientDivRef.current.style.background = cur.background;
      }
    }

    animFrameRef.current = requestAnimationFrame(animate);
  }, [renderLayer]);

  /* ── Handle resize ── */
  const handleResize = useCallback(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    sizeRef.current = { w, h };

    for (const c of [canvasARef.current, canvasBRef.current]) {
      if (c) {
        c.width = w;
        c.height = h;
      }
    }

    initParticles(currentThemeRef.current, 'A');
    if (prevThemeRef.current) {
      initParticles(prevThemeRef.current, 'B');
    }
  }, [initParticles]);

  /* ── Bootstrap ── */
  useEffect(() => {
    prefersReducedRef.current = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });

    const onMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', onMouse, { passive: true });

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouse);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── React to theme changes ── */
  useEffect(() => {
    if (prefersReducedRef.current) {
      // Just snap — no cross-fade
      currentThemeRef.current = currentTheme;
      initParticles(currentTheme, 'A');

      // Snap CSS vars
      const root = document.documentElement;
      Object.entries(currentTheme.cssVars).forEach(([k, v]) => {
        root.style.setProperty(k, v);
      });

      if (gradientDivRef.current) {
        gradientDivRef.current.style.background = currentTheme.background;
      }
      return;
    }

    const previousTheme = currentThemeRef.current;

    // Don't transition on first mount
    if (isInitialRef.current) {
      isInitialRef.current = false;
      currentThemeRef.current = currentTheme;
      initParticles(currentTheme, 'A');

      const root = document.documentElement;
      Object.entries(currentTheme.cssVars).forEach(([k, v]) => {
        root.style.setProperty(k, v);
      });

      if (gradientDivRef.current) {
        gradientDivRef.current.style.background = currentTheme.background;
      }
      return;
    }

    if (previousTheme.id === currentTheme.id) return;

    // Store previous into slot B
    prevThemeRef.current = previousTheme;
    particlesBRef.current = [...particlesARef.current];

    // Update current to new theme
    currentThemeRef.current = currentTheme;
    initParticles(currentTheme, 'A');

    // Reset cross-fade
    crossFadeRef.current = 0;

    // Kill any ongoing cross-fade tween
    crossfadeTweenRef.current?.kill();

    const crossFadeProxy = { value: 0 };

    crossfadeTweenRef.current = gsap.to(crossFadeProxy, {
      value: 1,
      duration: 1.6,
      ease: 'power2.inOut',
      onUpdate: () => {
        crossFadeRef.current = crossFadeProxy.value;
      },
      onComplete: () => {
        prevThemeRef.current = null;
      },
    });

    // Animate CSS vars
    const root = document.documentElement;
    Object.entries(currentTheme.cssVars).forEach(([k, v]) => {
      root.style.setProperty(k, v);
    });

    // Fade the gradient div
    if (gradientDivRef.current) {
      gsap.to(gradientDivRef.current, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          if (gradientDivRef.current) {
            gradientDivRef.current.style.background = currentTheme.background;
            gsap.to(gradientDivRef.current, { opacity: 1, duration: 1.2, ease: 'power2.out' });
          }
        },
      });
    }

    // Fade the overlay div
    if (patternDivRef.current) {
      gsap.to(patternDivRef.current, {
        opacity: 0,
        duration: 0.4,
        onComplete: () => {
          if (patternDivRef.current) {
            patternDivRef.current.style.background = currentTheme.overlayGradient;
            gsap.to(patternDivRef.current, { opacity: 1, duration: 1.4, ease: 'power2.out' });
          }
        },
      });
    }
  }, [currentTheme, initParticles]);

  return (
    /* Fixed layer sits behind z-0, above the body bg */
    <div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: -1 }}
      aria-hidden="true"
    >
      {/* Gradient background */}
      <div
        ref={gradientDivRef}
        className="absolute inset-0 transition-none"
        style={{ background: currentTheme.background }}
      />

      {/* Overlay / vignette */}
      <div
        ref={patternDivRef}
        className="absolute inset-0"
        style={{ background: currentTheme.overlayGradient }}
      />

      {/* Canvas A — current theme particles */}
      <canvas
        ref={canvasARef}
        className="absolute inset-0"
        style={{ opacity: 1 }}
      />

      {/* Canvas B — previous theme particles (cross-fade out) */}
      <canvas
        ref={canvasBRef}
        className="absolute inset-0"
        style={{ opacity: 1 }}
      />
    </div>
  );
}
