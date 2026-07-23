'use client';

import type { ReactElement } from 'react';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGsapAnimation } from '@/hooks/useGsapAnimation';
import Reveal from '@/components/Reveal';
import SectionAtmosphere from '@/components/SectionAtmosphere';

gsap.registerPlugin(ScrollTrigger);

const TABS = ['ecommerce', 'fintech', 'sante', 'saas', 'marketing'];

const TAB_FEATURES: Record<string, string[][]> = {
  ecommerce: [
    ['fr', 'Marketplace multi-vendeurs', 'Paiements internationaux', 'Gestion logistique', 'IA de recommandation', 'Analytics temps réel'],
    ['en', 'Multi-vendor marketplace', 'International payments', 'Logistics management', 'AI recommendation engine', 'Real-time analytics'],
  ],
  fintech: [
    ['fr', 'Conformité PSD2/KYC', 'Transactions temps réel', 'Détection fraude IA', 'Open Banking APIs', 'Portefeuille multi-devises'],
    ['en', 'PSD2/KYC compliance', 'Real-time transactions', 'AI fraud detection', 'Open Banking APIs', 'Multi-currency wallet'],
  ],
  sante: [
    ['fr', 'Télémédecine intégrée', 'DMP électronique', 'IA diagnostique', 'Conformité HIPAA/RGPD', 'Prescriptions numériques'],
    ['en', 'Integrated telemedicine', 'Electronic health records', 'Diagnostic AI', 'HIPAA/GDPR compliance', 'Digital prescriptions'],
  ],
  saas: [
    ['fr', 'Multi-tenancy cloud', 'Auto-scaling dynamique', 'Billing & usage tracking', 'Analytics en temps réel', 'CI/CD automatisé'],
    ['en', 'Cloud multi-tenancy', 'Dynamic auto-scaling', 'Billing & usage tracking', 'Real-time analytics', 'Automated CI/CD'],
  ],
  marketing: [
    ['fr', 'Marketing automation', 'Attribution IA multi-canal', 'CRM personnalisé', 'A/B Testing avancé', 'Reporting en temps réel'],
    ['en', 'Marketing automation', 'AI multi-channel attribution', 'Custom CRM', 'Advanced A/B testing', 'Real-time reporting'],
  ],
};

const TAB_ICONS: Record<string, ReactElement> = {
  ecommerce: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  fintech: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  sante: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
  saas: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
    </svg>
  ),
  marketing: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
    </svg>
  ),
};

const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.25 } },
};

export default function Solutions() {
  const [activeTab, setActiveTab] = useState('ecommerce');
  const { lang, t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

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

  /* Feature list entrance */
  const scopeRef = useGsapAnimation((ctx) => {
    const features = ctx.selector?.('.solution-feature');
    if (!features || features.length === 0) return;

    gsap.from(features, {
      x: -40,
      opacity: 0,
      scale: 0.95,
      duration: 0.5,
      ease: 'power3.out',
      stagger: 0.06,
      scrollTrigger: {
        trigger: contentRef.current,
        start: 'top 85%',
        once: true,
      },
    });
  }, []);

  const features = TAB_FEATURES[activeTab]?.find((arr) => arr[0] === lang)?.slice(1)
    ?? TAB_FEATURES[activeTab]?.[0]?.slice(1) ?? [];

  return (
    <section id="solutions" className="section-padding relative" data-theme-section="solutions" ref={sectionRef}>
      <SectionAtmosphere />
      <div className="container-page" ref={scopeRef}>

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-14">
          <Reveal variant="fadeDown">
            <div className="section-tag">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              {t('solutions.badge')}
            </div>
          </Reveal>
          <Reveal variant="fadeUp" delay={0.1}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-5 tracking-[-0.03em] leading-[1.1]">
              {t('solutions.title')}{' '}
              <span className="gradient-text">{t('solutions.title_highlight')}</span>
            </h2>
          </Reveal>
          <Reveal variant="fadeUp" delay={0.2}>
            <p className="text-slate-400 text-base sm:text-lg leading-[1.7]">
              {t('solutions.subtitle')}
            </p>
          </Reveal>
        </div>

        {/* Tab bar */}
        <Reveal variant="fadeUp" delay={0.2}>
          <div className="overflow-x-auto pb-2 -mb-2">
            <div className="flex justify-center gap-2 mb-10 min-w-max mx-auto w-max">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  activeTab === tab
                    ? 'bg-primary-700 text-white shadow-lg shadow-primary-900/50'
                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-white/8'
                }`}
              >
                {TAB_ICONS[tab]}
                {t(`solutions.tab_${tab}`)}
              </button>
            ))}
          </div>
          </div>
        </Reveal>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            ref={contentRef}
            className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center"
          >
            {/* Text side */}
            <div>
              <h3 className="text-2xl sm:text-3xl font-black text-white mb-4">
                {t(`solutions.${activeTab}_title`)}
              </h3>
              <p className="text-slate-400 text-base leading-relaxed mb-8">
                {t(`solutions.${activeTab}_desc`)}
              </p>

              {/* Feature list */}
              <div className="space-y-3">
                {features.map((feature, i) => (
                  <div key={i} className="solution-feature flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary-500/20 border border-primary-500/40 flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-slate-300 text-sm font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              <a href="#contact" className="btn-primary mt-8 inline-flex">
                {lang === 'fr' ? 'Discuter de ce projet' : 'Discuss this project'}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>

            {/* Visual side */}
            <div>
              <div className="relative">
                <div className="glass rounded-2xl glow-border p-8 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-5"
                    style={{
                      backgroundImage: 'radial-gradient(rgba(59,130,246,0.8) 1px, transparent 1px)',
                      backgroundSize: '24px 24px',
                    }} />
                  
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-6">
                      <div className="w-3 h-3 rounded-full bg-rose-500" />
                      <div className="w-3 h-3 rounded-full bg-amber-500" />
                      <div className="w-3 h-3 rounded-full bg-emerald-500" />
                      <div className="flex-1 h-6 rounded-md bg-white/5 ml-2" />
                    </div>

                    <div className="space-y-3">
                      <div className="h-8 rounded-lg bg-primary-800/40 border border-primary-500/20 flex items-center px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-primary-400 animate-pulse" />
                          <div className="h-2 w-32 rounded-full bg-white/20" />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {[...Array(3)].map((_, j) => (
                          <div key={j} className="h-16 rounded-xl glass border border-white/5 flex flex-col items-center justify-center gap-1 p-2">
                            <div className="h-3 w-8 rounded-full bg-primary-400/40" />
                            <div className="h-2 w-12 rounded-full bg-white/15" />
                          </div>
                        ))}
                      </div>
                      <div className="h-24 rounded-xl bg-gradient-to-r from-primary-900/40 to-primary-800/20 border border-primary-500/15 p-3">
                        <div className="flex gap-1 h-full items-end">
                          {[40, 65, 45, 80, 55, 90, 70].map((h, j) => (
                            <div
                              key={j}
                              className="flex-1 rounded-sm bg-primary-500/50"
                              style={{ height: `${h}%`, transition: 'height 0.5s ease' }}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="h-10 rounded-lg glass border border-white/5 p-2 flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-400" />
                          <div className="h-2 flex-1 rounded-full bg-white/10" />
                        </div>
                        <div className="h-10 rounded-lg glass border border-white/5 p-2 flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-cyan-400" />
                          <div className="h-2 flex-1 rounded-full bg-white/10" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute -top-4 -right-4 glass-medium px-3 py-2 rounded-xl floating-badge border border-primary-500/20 shadow-lg shadow-primary-900/30">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs text-white font-semibold">
                      {lang === 'fr' ? 'Livré en production' : 'Live in production'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
