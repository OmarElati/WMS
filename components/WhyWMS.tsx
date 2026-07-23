'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGsapAnimation } from '@/hooks/useGsapAnimation';
import Reveal from '@/components/Reveal';
import AnimatedCounter from '@/components/AnimatedCounter';
import SectionAtmosphere from '@/components/SectionAtmosphere';

gsap.registerPlugin(ScrollTrigger);

const VALUES = [
  {
    key: 'v1',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: '#3b82f6',
  },
  {
    key: 'v2',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    color: '#8b5cf6',
  },
  {
    key: 'v3',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
    color: '#10b981',
  },
  {
    key: 'v4',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    color: '#f59e0b',
  },
];

export default function WhyWMS() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const scopeRef = useGsapAnimation((ctx) => {
    const cards = ctx.selector?.('.value-card');
    if (!cards || cards.length === 0) return;

    gsap.from(cards, {
      y: 40,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out',
      stagger: 0.12,
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
        once: true,
      },
    });
  }, []);

  const stats = [
    { val: 200, suffix: '+', labelKey: 'why.s1_label' },
    { val: 30, suffix: '+', labelKey: 'why.s2_label' },
    { val: 98, suffix: '%', labelKey: 'why.s3_label' },
    { val: 15, suffix: '+', labelKey: 'why.s4_label' },
  ];

  return (
    <section id="apropos-valeurs" className="section-padding relative" data-theme-section="why" ref={sectionRef}>
      <SectionAtmosphere />
      {/* Background handled by ThemeCanvas */}

      <div className="container-page" ref={scopeRef}>

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <Reveal variant="fadeDown">
            <div className="section-tag">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {t('why.badge')}
            </div>
          </Reveal>
          <Reveal variant="fadeUp" delay={0.1}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-5">
              {t('why.title')}{' '}
              <span className="gradient-text">{t('why.title_highlight')}</span>
            </h2>
          </Reveal>
          <Reveal variant="fadeUp" delay={0.2}>
            <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
              {t('why.subtitle')}
            </p>
          </Reveal>
        </div>

        {/* Values grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-12 sm:mb-16">
          {VALUES.map((v, i) => (
            <motion.div
              key={v.key}
              className="value-card card p-6 group text-center"
              whileHover={{ scale: 1.04, y: -6, transition: { type: 'spring', stiffness: 300, damping: 18 } }}
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300"
                style={{ background: `${v.color}18`, border: `1px solid ${v.color}30`, color: v.color }}
              >
                {v.icon}
              </div>
              <h3 className="text-white font-bold text-base mb-2 group-hover:text-primary-300 transition-colors">
                {t(`why.${v.key}_title`)}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {t(`why.${v.key}_desc`)}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Stats row */}
        <div className="glass rounded-2xl glow-border overflow-hidden">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-white/5">
            {stats.map((s, i) => (
              <div key={i} className="text-center p-6">
                <div className="text-4xl sm:text-5xl font-black gradient-text mb-2">
                  <AnimatedCounter value={s.val} suffix={s.suffix} />
                </div>
                <div className="text-slate-400 text-sm font-medium">{t(s.labelKey)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
