'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGsapAnimation } from '@/hooks/useGsapAnimation';
import SectionAtmosphere from '@/components/SectionAtmosphere';

gsap.registerPlugin(ScrollTrigger);

const PROJECTS = [
  {
    key: 'p1',
    image: '/images/portfolio-ecommerce.jpg',
    tags: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
    color: '#3b82f6',
  },
  {
    key: 'p2',
    image: '/images/portfolio-fintech.jpg',
    tags: ['React Native', 'Python', 'ML', 'Azure'],
    color: '#8b5cf6',
  },
  {
    key: 'p3',
    image: '/images/portfolio-healthcare.jpg',
    tags: ['Vue.js', 'Django', 'PostgreSQL', 'GCP'],
    color: '#10b981',
  },
  {
    key: 'p4',
    image: '/images/portfolio-ai.jpg',
    tags: ['Python', 'TensorFlow', 'FastAPI', 'GCP'],
    color: '#06b6d4',
  },
];

function TiltCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(y, { stiffness: 150, damping: 15 });
  const rotateY = useSpring(x, { stiffness: 150, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) / 12);
    y.set(-(e.clientY - cy) / 12);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div style={{ perspective: 1000 }} className="group card overflow-hidden cursor-pointer">
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ transformStyle: 'preserve-3d', rotateX, rotateY } as any}
        whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export default function Portfolio() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const scopeRef = useGsapAnimation(
    (ctx) => {
      const images = ctx.selector?.('.image-clip-reveal');
      if (!images || images.length === 0) return;

      gsap.from(images, {
        clipPath: 'inset(0 100% 0 0)',
        duration: 1.2,
        ease: 'power3.inOut',
        stagger: 0.15,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          once: true,
        },
      });
    },
    [],
  );

  return (
    <section id="portfolio" className="section-padding" data-theme-section="portfolio" ref={sectionRef}>
      <SectionAtmosphere />
      <div className="container-page" ref={scopeRef}>

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20 lg:mb-24">
          <div className="section-tag animate-on-scroll">
            <svg className="w-3.5 h-3.5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {t('portfolio.badge')}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-5 animate-on-scroll delay-100">
            {t('portfolio.title')}{' '}
            <span className="gradient-text">{t('portfolio.title_highlight')}</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg animate-on-scroll delay-200">
            {t('portfolio.subtitle')}
          </p>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 gap-5 sm:gap-6 lg:gap-8">
          {PROJECTS.map((project) => (
            <TiltCard key={project.key}>
              {/* Image */}
              <div className="relative h-52 sm:h-60 overflow-hidden">
                <div className="image-clip-reveal absolute inset-0">
                  <Image
                    src={project.image}
                    alt={t(`portfolio.${project.key}_title`)}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `linear-gradient(to bottom, transparent 30%, ${project.color}30)` }}
                />

                {/* Category badge */}
                <div className="absolute top-4 left-4">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-bold text-white"
                    style={{ background: `${project.color}cc` }}
                  >
                    {t(`portfolio.${project.key}_cat`)}
                  </span>
                </div>

                {/* Country */}
                <div className="absolute top-4 right-4">
                  <div className="glass px-2.5 py-1 rounded-full flex items-center gap-1.5">
                    <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-[10px] text-slate-300 font-medium">{t(`portfolio.${project.key}_country`)}</span>
                  </div>
                </div>

                {/* Hover overlay CTA */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <span className="btn-primary text-sm px-5 py-2.5 shadow-xl">
                    {t('portfolio.cta')}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-8" style={{ transform: 'translateZ(24px)' }}>
                <h3 className="text-white font-bold text-xl mb-3 group-hover:text-primary-300 transition-colors">
                  {t(`portfolio.${project.key}_title`)}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-5">
                  {t(`portfolio.${project.key}_desc`)}
                </p>

                {/* Tech tags */}
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="tech-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </TiltCard>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16 sm:mt-20 animate-on-scroll">
             <a href="#contact" className="btn-outline text-base px-10 py-4 inline-flex">
            {t('portfolio.all_projects')}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
