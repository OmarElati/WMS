'use client';

import React, { useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import SectionAtmosphere from '@/components/SectionAtmosphere';

const ARTICLES = ['b1', 'b2', 'b3'];

const ARTICLE_COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4'];

function getArticleIcons() {
  return [
    <svg key="ai" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>,
    <svg key="dig" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
    </svg>,
    <svg key="mob" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>,
  ];
}

export default function Blog() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const articleIcons = getArticleIcons();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); });
      },
      { threshold: 0.1 },
    );
    sectionRef.current
      ?.querySelectorAll('.animate-on-scroll, .animate-scale')
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="blog" className="section-padding relative" data-theme-section="blog" ref={sectionRef}>
      <SectionAtmosphere />
      <div className="container-page">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-14">
          <div className="max-w-2xl">
            <div className="section-tag animate-on-scroll">
              <svg className="w-3.5 h-3.5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              {t('blog.badge')}
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white animate-on-scroll delay-100">
              {t('blog.title')}{' '}
              <span className="gradient-text">{t('blog.title_highlight')}</span>
            </h2>
          </div>
          <a href="#" className="btn-ghost text-sm hidden sm:inline-flex flex-shrink-0 mb-1 animate-on-scroll delay-100">
            {t('blog.see_all')}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>

        {/* Articles grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ARTICLES.map((bk, i) => (
            <article
              key={bk}
              className="animate-scale card group cursor-pointer overflow-hidden flex flex-col"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              {/* Top color bar + category */}
              <div className="h-1.5 w-full" style={{ background: ARTICLE_COLORS[i] }} />

              <div className="p-6 flex flex-col flex-1">
                {/* Category */}
                <div className="flex items-center gap-2 mb-4">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ background: `${ARTICLE_COLORS[i]}18`, color: ARTICLE_COLORS[i] }}
                  >
                    {articleIcons[i]}
                  </div>
                  <span
                    className="text-xs font-bold uppercase tracking-wider"
                    style={{ color: ARTICLE_COLORS[i] }}
                  >
                    {t(`blog.${bk}_cat`)}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-white font-bold text-base sm:text-lg leading-snug mb-3 group-hover:text-primary-300 transition-colors duration-200 flex-1">
                  {t(`blog.${bk}_title`)}
                </h3>

                {/* Excerpt */}
                <p className="text-slate-400 text-sm leading-relaxed mb-5 line-clamp-3">
                  {t(`blog.${bk}_excerpt`)}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {t(`blog.${bk}_date`)}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {t(`blog.${bk}_read`)}
                    </span>
                  </div>

                  <a
                    href="#"
                    className="flex items-center gap-1 text-xs font-semibold transition-all duration-200 group-hover:gap-2"
                    style={{ color: ARTICLE_COLORS[i] }}
                  >
                    {t('blog.read_more')}
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="text-center mt-10 sm:hidden animate-on-scroll">
          <a href="#" className="btn-ghost text-sm inline-flex">
            {t('blog.see_all')}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
