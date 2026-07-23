'use client';

import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGsapAnimation } from '@/hooks/useGsapAnimation';
import Reveal from '@/components/Reveal';
import SectionAtmosphere from '@/components/SectionAtmosphere';

gsap.registerPlugin(ScrollTrigger);

const SERVICES = [
  {
    key: 's1',
    icon: (
      <svg className="w-6 h-6 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    tags: ['SaaS', 'Enterprise', 'API REST', 'Microservices'],
    accent: '#3b82f6',
  },
  {
    key: 's2',
    icon: (
      <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    tags: ['React', 'React Native', 'Next.js', 'Flutter'],
    accent: '#06b6d4',
  },
  {
    key: 's3',
    icon: (
      <svg className="w-6 h-6 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    tags: ['Deep Learning', 'NLP', 'Computer Vision', 'MLOps'],
    accent: '#8b5cf6',
  },
  {
    key: 's4',
    icon: (
      <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    tags: ['SEO/SEM', 'Growth Hacking', 'Analytics', 'CRM'],
    accent: '#10b981',
  },
  {
    key: 's5',
    icon: (
      <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    tags: ['Agile', 'Scrum', 'IT Audit', 'PMO'],
    accent: '#f59e0b',
  },
  {
    key: 's6',
    icon: (
      <svg className="w-6 h-6 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
      </svg>
    ),
    tags: ['AWS', 'Docker', 'Kubernetes', 'Zero Trust'],
    accent: '#f43f5e',
  },
];

export default function Services() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  /* Section-level parallax + scale */
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(section,
        { opacity: 0.4, scale: 0.96, y: 60 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 90%',
            end: 'top 40%',
            scrub: 0.4,
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  /* Card stagger entrance */
  const scopeRef = useGsapAnimation((ctx) => {
    const cards = ctx.selector?.('.service-card');
    if (!cards || cards.length === 0) return;

    gsap.from(cards, {
      y: 80,
      opacity: 0,
      scale: 0.9,
      rotateX: 8,
      duration: 0.6,
      ease: 'power3.out',
      stagger: 0.08,
      scrollTrigger: {
        trigger: gridRef.current,
        start: 'top 85%',
        once: true,
      },
    });
  }, []);

  return (
    <section id="services" className="section-padding relative" data-theme-section="services" ref={sectionRef}>
      <SectionAtmosphere />
      <div className="container-page" ref={scopeRef}>

        {/* Header */}
        <div ref={headerRef} className="text-center max-w-3xl mx-auto mb-14 sm:mb-18 lg:mb-20">
          <Reveal variant="fadeDown">
            <div className="section-tag">
              <svg className="w-3.5 h-3.5 text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 6a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zm0 6a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" />
              </svg>
              {t('services.badge')}
            </div>
          </Reveal>
          <Reveal variant="fadeUp" delay={0.1}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 sm:mb-5 tracking-[-0.03em] leading-[1.1]">
              {t('services.title')}{' '}
              <span className="gradient-text">{t('services.title_highlight')}</span>
            </h2>
          </Reveal>
          <Reveal variant="fadeUp" delay={0.2}>
            <p className="text-slate-400 text-base sm:text-lg leading-[1.7]">
              {t('services.subtitle')}
            </p>
          </Reveal>
        </div>

        {/* Services grid */}
        <div ref={gridRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
          {SERVICES.map((service, i) => (
            <motion.div
              key={service.key}
              className="service-card group relative card p-8 cursor-default"
              whileHover={{ scale: 1.03, y: -6, transition: { type: 'spring', stiffness: 300, damping: 18 } }}
            >
              {/* Top accent bar */}
              <div
                className="absolute top-0 left-0 right-0 h-0.5 rounded-t-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `linear-gradient(to right, ${service.accent}00, ${service.accent}, ${service.accent}00)` }}
              />

              {/* Icon */}
              <div
                className="card-icon mb-6 group-hover:scale-110 transition-transform duration-300"
                style={{
                  background: `linear-gradient(135deg, ${service.accent}20, ${service.accent}0d)`,
                  borderColor: `${service.accent}30`,
                }}
              >
                {service.icon}
              </div>

              {/* Content */}
              <h3 className="text-white font-bold text-base sm:text-lg mb-3 group-hover:text-primary-300 transition-colors duration-200 tracking-[-0.01em]">
                {t(`services.${service.key}_title`)}
              </h3>
              <p className="text-slate-400 text-sm leading-[1.7] mb-5">
                {t(`services.${service.key}_desc`)}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {service.tags.map((tag) => (
                  <span key={tag} className="tech-tag" style={{ color: service.accent, borderColor: `${service.accent}25`, backgroundColor: `${service.accent}0a` }}>
                    {tag}
                  </span>
                ))}
              </div>

              {/* Arrow */}
              <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-0 group-hover:translate-x-1" style={{ color: service.accent }}>
                {t('services.explore')}
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
