'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import SectionAtmosphere from '@/components/SectionAtmosphere';

const QUOTES = ['q1', 'q2', 'q3', 'q4'];

const quoteVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.97,
    transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] },
  },
};

function StarRating() {
  return (
    <div className="flex gap-0.5 mb-3">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const { t } = useLanguage();
  const [current, setCurrent] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const sectionRef = useRef<HTMLDivElement>(null);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % QUOTES.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + QUOTES.length) % QUOTES.length);
  }, []);

  const goTo = useCallback((i: number) => {
    setCurrent(i);
    setIsAutoplay(false);
    clearTimeout(timerRef.current);
    setTimeout(() => setIsAutoplay(true), 8000);
  }, []);

  useEffect(() => {
    if (!isAutoplay) return;
    timerRef.current = setTimeout(next, 5000);
    return () => clearTimeout(timerRef.current);
  }, [isAutoplay, current, next]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); });
      },
      { threshold: 0.1 },
    );
    sectionRef.current?.querySelectorAll('.animate-on-scroll, .animate-scale')
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const q = QUOTES[current];

  return (
    <section id="temoignages" className="section-padding relative overflow-hidden" data-theme-section="testimonials" ref={sectionRef}>
      <SectionAtmosphere />
      {/* Background handled by ThemeCanvas */}

      <div className="container-page">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-14">
          <div className="section-tag animate-on-scroll">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            {t('testimonials.badge')}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 animate-on-scroll delay-100">
            {t('testimonials.title')}{' '}
            <span className="gradient-text">{t('testimonials.title_highlight')}</span>
          </h2>
          <p className="text-slate-400 animate-on-scroll delay-200">{t('testimonials.subtitle')}</p>
        </div>

        {/* Main testimonial */}
        <div className="relative animate-scale px-10 sm:px-14">
          {/* Quote card */}
          <div className="glass-strong rounded-2xl p-8 sm:p-12 glow-border text-center relative">

            {/* Large quote mark */}
            <div
              className="text-[80px] sm:text-[120px] leading-none font-black text-primary-500 opacity-15 absolute top-2 left-8 select-none"
              aria-hidden="true"
            >
              &ldquo;
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                variants={quoteVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <StarRating />

                {/* Quote text */}
                <blockquote
                  className="text-slate-200 text-base sm:text-xl leading-relaxed mb-8 max-w-3xl mx-auto relative z-10"
                >
                  {t(`testimonials.${q}`)}
                </blockquote>

                {/* Author */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-600 to-primary-400 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary-900/40">
                    {t(`testimonials.${q}_author`).charAt(0)}
                  </div>
                  <div className="text-center sm:text-left">
                    <div className="text-white font-bold text-base">
                      {t(`testimonials.${q}_author`)}
                    </div>
                    <div className="text-slate-400 text-sm">
                      {t(`testimonials.${q}_role`)} &middot; {t(`testimonials.${q}_company`)}
                    </div>
                    <div className="text-primary-400 text-xs font-medium mt-0.5">
                      {t(`testimonials.${q}_country`)}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Nav arrows */}
          <button
            onClick={() => { prev(); setIsAutoplay(false); }}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full glass-strong border border-white/10 flex items-center justify-center text-white hover:border-primary-500/40 hover:text-primary-400 transition-all duration-200"
            aria-label="Previous testimonial"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => { next(); setIsAutoplay(false); }}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full glass-strong border border-white/10 flex items-center justify-center text-white hover:border-primary-500/40 hover:text-primary-400 transition-all duration-200"
            aria-label="Next testimonial"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {QUOTES.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`transition-all duration-300 rounded-full ${
                i === current
                  ? 'w-8 h-2 bg-primary-500'
                  : 'w-2 h-2 bg-white/20 hover:bg-white/40'
              }`}
              aria-label={`Testimonial ${i + 1}`}
            />
          ))}
        </div>

        {/* Thumbnail bar */}
        <div className="grid grid-cols-4 gap-2 mt-8 max-w-lg mx-auto">
          {QUOTES.map((qk, i) => (
            <button
              key={qk}
              onClick={() => goTo(i)}
              className={`p-2 rounded-xl text-center transition-all duration-200 ${
                i === current
                  ? 'bg-primary-800/40 border border-primary-500/30'
                  : 'bg-white/3 border border-white/5 hover:bg-white/6'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-1 ${
                i === current
                  ? 'bg-gradient-to-br from-primary-600 to-primary-400 text-white'
                  : 'bg-white/10 text-slate-400'
              }`}>
                {t(`testimonials.${qk}_author`).charAt(0)}
              </div>
              <div className="text-[10px] text-slate-500 truncate leading-tight">
                {t(`testimonials.${qk}_company`)}
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
