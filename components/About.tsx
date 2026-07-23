'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '@/contexts/LanguageContext';
import Reveal from '@/components/Reveal';
import SectionAtmosphere from '@/components/SectionAtmosphere';

gsap.registerPlugin(ScrollTrigger);

const TEAM = ['t1', 't2', 't3'];

const AVATAR_COLORS = [
  { bg: 'from-primary-700 to-primary-500', letter: 'O' },
  { bg: 'from-violet-700 to-violet-500', letter: 'S' },
  { bg: 'from-cyan-700 to-cyan-500', letter: 'Y' },
];

export default function About() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const orbitScopeRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced) return;

    const ctx = gsap.context((self) => {
      const rings = self.selector?.('.orbit-ring');
      if (rings) {
        gsap.to(rings, {
          rotation: 360,
          transformOrigin: 'center center',
          duration: 30,
          repeat: -1,
          ease: 'none',
        });
        gsap.to(rings[1], {
          rotation: -360,
          duration: 20,
          repeat: -1,
          ease: 'none',
        });
        gsap.to(rings[2], {
          rotation: 360,
          duration: 15,
          repeat: -1,
          ease: 'none',
        });
      }

      const dots = self.selector?.('.orbit-dot');
      if (dots) {
        gsap.set(dots, {
          rotation: (i: number) => i * 120,
          transformOrigin: 'center center',
        });
        gsap.to(dots, {
          rotation: '+=360',
          duration: 12,
          repeat: -1,
          ease: 'none',
        });
      }

      const orbitGroup = self.selector?.('.orbit-group');
      if (orbitGroup) {
        gsap.from(orbitGroup, {
          scale: 0.85,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            once: true,
          },
        });

        gsap.to(orbitGroup, {
          y: -20,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });
      }
    }, orbitScopeRef.current || undefined);

    return () => ctx.revert();
  }, [prefersReduced]);

  return (
    <section id="apropos" className="section-padding relative" data-theme-section="about" ref={sectionRef}>
      <SectionAtmosphere />
      <div className="container-page" ref={orbitScopeRef}>

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <Reveal variant="fadeDown">
            <div className="section-tag">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              {t('about.badge')}
            </div>
          </Reveal>
          <Reveal variant="fadeUp" delay={0.1}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-5">
              {t('about.title')}{' '}
              <span className="gradient-text">{t('about.title_highlight')}</span>
            </h2>
          </Reveal>
        </div>

        {/* Story + Mission/Vision */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 mb-20 items-center">

          {/* Story text */}
          <div>
            <Reveal variant="fadeLeft">
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-6">
                {t('about.story1')}
              </p>
              <p className="text-slate-400 text-base leading-relaxed mb-8">
                {t('about.story2')}
              </p>

              {/* Mission */}
              <div className="glass rounded-xl p-5 border-l-2 border-primary-500 mb-4">
                <div className="text-xs font-bold uppercase tracking-widest text-primary-400 mb-2">
                  {t('about.mission_label')}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {t('about.mission')}
                </p>
              </div>

              {/* Vision */}
              <div className="glass rounded-xl p-5 border-l-2 border-cyan-500">
                <div className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-2">
                  {t('about.vision_label')}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {t('about.vision')}
                </p>
              </div>
            </Reveal>
          </div>

          {/* Visual side */}
          <Reveal variant="fadeRight">
            <div className="orbit-group relative flex items-center justify-center">
              {/* Outer rings */}
              <div
                className="orbit-ring absolute w-80 h-80 rounded-full border border-primary-500/10"
              />
              <div
                className="orbit-ring absolute w-64 h-64 rounded-full border border-cyan-500/10"
              />
              <div
                className="orbit-ring absolute w-48 h-48 rounded-full border border-primary-500/15"
              />

              {/* Center card */}
              <div className="glass-strong rounded-3xl p-8 text-center relative z-10 glow-border">
                {/* Logo placeholder */}
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-800 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-900/50">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="font-black text-2xl text-white mb-1">WMS</div>
                <div className="text-primary-400 text-xs uppercase tracking-widest font-semibold mb-4">
                  Worldwide Manager Solutions
                </div>
                <div className="divider-gradient mb-4" />
                <div className="text-slate-400 text-xs leading-relaxed">
                  {t('about.vision_label')} :<br />
                  <span className="text-slate-300 mt-1 block">{t('about.vision')}</span>
                </div>
              </div>

              {/* Orbiting dots */}
              {[0, 120, 240].map((deg, i) => (
                <div
                  key={i}
                  className="orbit-dot absolute w-3 h-3 rounded-full bg-primary-500 shadow-lg shadow-primary-500/50"
                  style={{
                    transform: `rotate(${deg}deg) translateY(-9rem)`,
                  }}
                />
              ))}
            </div>
          </Reveal>
        </div>

        {/* Divider */}
        <Reveal variant="fadeUp">
          <div className="divider-gradient mb-12 sm:mb-16" />
        </Reveal>

        {/* Team */}
        <div>
          <Reveal variant="fadeUp">
            <h3 className="text-2xl sm:text-3xl font-black text-white text-center mb-10">
              {t('about.team_title')}
            </h3>
          </Reveal>

          <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {TEAM.map((tk, i) => (
              <Reveal key={tk} variant="scale" delay={i * 0.1}>
                <div
                  className="card p-6 text-center group"
                >
                  {/* Avatar */}
                  <div
                    className={`w-20 h-20 rounded-full bg-gradient-to-br ${AVATAR_COLORS[i].bg} flex items-center justify-center text-3xl font-black text-white mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                  >
                    {AVATAR_COLORS[i].letter}
                  </div>
                  <div className="font-bold text-white text-base mb-1">
                    {t(`about.${tk}_name`)}
                  </div>
                  <div className="text-primary-400 text-sm font-semibold mb-2">
                    {t(`about.${tk}_role`)}
                  </div>
                  <div className="text-xs text-slate-500 font-medium px-3 py-1 bg-white/3 rounded-full inline-block">
                    {t(`about.${tk}_spec`)}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
