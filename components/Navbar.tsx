'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme, type SectionId } from '@/contexts/ThemeContext';
import { useReducedMotion } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

/* Map SectionId → navbar theme class */
const THEME_TO_NAV: Record<SectionId, string> = {
  hero: 'navbar-theme-hero',
  services: 'navbar-theme-services',
  why: 'navbar-theme-why',
  solutions: 'navbar-theme-solutions',
  portfolio: 'navbar-theme-portfolio',
  about: 'navbar-theme-about',
  testimonials: 'navbar-theme-testimonials',
  blog: 'navbar-theme-blog',
  contact: 'navbar-theme-contact',
};

const NAV_LINKS = [
  { key: 'nav.home', href: '#accueil' },
  { key: 'nav.services', href: '#services' },
  { key: 'nav.solutions', href: '#solutions' },
  { key: 'nav.about', href: '#apropos' },
  { key: 'nav.portfolio', href: '#portfolio' },
  { key: 'nav.blog', href: '#blog' },
  { key: 'nav.contact', href: '#contact' },
];

const drawerVariants = {
  hidden: { x: '100%' },
  visible: { x: 0, transition: { type: 'spring' as const, damping: 28, stiffness: 300 } },
  exit: { x: '100%', transition: { type: 'spring' as const, damping: 28, stiffness: 300 } },
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('accueil');
  const [hidden, setHidden] = useState(false);
  const lastScrollRef = useRef(0);
  const { lang, setLang, t } = useLanguage();
  const { currentTheme } = useTheme();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const prefersReduced = useReducedMotion();

  const navThemeClass = THEME_TO_NAV[currentTheme.id] || 'navbar-theme-hero';
  const isHero = currentTheme.id === 'hero';

  /* Scroll handler for navbar background */
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 60);

      /* Hide/show on scroll direction */
      if (y > 200) {
        setHidden(y > lastScrollRef.current);
      } else {
        setHidden(false);
      }
      lastScrollRef.current = y;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* GSAP nav entrance animation */
  useEffect(() => {
    if (prefersReduced || !navRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(navRef.current, {
        y: -80,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.2,
      });
    });
    return () => ctx.revert();
  }, [prefersReduced]);

  /* Active section tracking */
  useEffect(() => {
    const sections = ['accueil', 'services', 'solutions', 'portfolio', 'apropos', 'apropos-valeurs', 'temoignages', 'blog', 'contact'];
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-40% 0px -55% 0px' },
    );
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observerRef.current?.observe(el);
    });
    return () => observerRef.current?.disconnect();
  }, []);

  /* Lock body scroll when mobile menu is open */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  /* Close on resize to desktop */
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 1024) setMobileOpen(false); };
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const getHrefId = (href: string) => href.replace('#', '');

  return (
    <>
      {/* ── NAVBAR ── */}
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
          scrolled || !isHero ? 'navbar-solid navbar-themed' : 'navbar-transparent'
        } ${navThemeClass} ${hidden ? '-translate-y-full' : 'translate-y-0'}`}
        style={{ transform: 'translateZ(0)' }}
      >
        <div className="container-page">
          <div className="flex items-center justify-between h-16 sm:h-20">

            {/* Logo */}
            <a href="#accueil" className="flex items-center gap-2.5 flex-shrink-0 group min-w-0">
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden bg-white shadow-md flex-shrink-0 group-hover:shadow-primary-500/40 transition-all duration-300">
                <Image
                  src="/images/logo-wms.png"
                  alt="WMS Logo"
                  fill
                  className="object-contain p-1.5"
                  priority
                />
              </div>
              <div className="hidden sm:block min-w-0">
                <div className="font-bold text-white text-sm leading-tight tracking-wide">WMS</div>
                <div className="nav-logo-subtitle text-[10px] font-medium leading-tight uppercase tracking-widest truncate transition-colors duration-500" style={{ color: 'var(--nav-accent, #3b82f6)' }}>
                  Worldwide Manager Solutions
                </div>
              </div>
            </a>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-0.5 xl:gap-1">
              {NAV_LINKS.map((link) => {
                const isActive = activeSection === getHrefId(link.href);
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    className={`nav-link px-2.5 xl:px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                      isActive ? 'active' : ''
                    }`}
                    style={{
                      color: isActive ? 'var(--nav-text, #f8fafc)' : 'var(--nav-text-muted, #94a3b8)',
                      background: isActive ? 'var(--nav-link-active-bg, rgba(255,255,255,0.1))' : 'transparent',
                    }}
                  >
                    {t(link.key)}
                  </a>
                );
              })}
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Language toggle — desktop */}
              <button
                onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
                className="nav-lang-toggle hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-300 flex-shrink-0"
                style={{
                  color: 'var(--nav-text-muted, #94a3b8)',
                  borderColor: 'var(--nav-border, rgba(255,255,255,0.1))',
                }}
                aria-label="Switch language"
              >
                <svg className="w-3.5 h-3.5 opacity-70 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                <span className="font-bold tracking-widest">{lang === 'fr' ? 'FR' : 'EN'}</span>
                <span className="text-slate-600">|</span>
                <span className="opacity-40">{lang === 'fr' ? 'EN' : 'FR'}</span>
              </button>

              {/* CTA — desktop */}
              <a
                href="#contact"
                className="nav-cta hidden sm:flex text-sm px-4 py-2 xl:px-5 xl:py-2.5 flex-shrink-0 rounded-xl font-semibold text-white transition-all duration-300"
                style={{
                  background: 'var(--nav-btn-bg, linear-gradient(135deg, #1d4ed8, #3b82f6))',
                }}
              >
                {t('nav.cta')}
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>

              {/* Hamburger — mobile */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="nav-hamburger lg:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 rounded-lg transition-all flex-shrink-0"
                style={{
                  borderColor: 'var(--nav-border, rgba(255,255,255,0.1))',
                  border: '1px solid',
                }}
                aria-label="Toggle menu"
                aria-expanded={mobileOpen}
              >
                <motion.span
                  className="nav-hamburger-line block w-5 h-0.5 origin-center transition-colors duration-500"
                  style={{ background: 'var(--nav-text, #f8fafc)' }}
                  animate={mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.2 }}
                />
                <motion.span
                  className="nav-hamburger-line block w-5 h-0.5 transition-colors duration-500"
                  style={{ background: 'var(--nav-text, #f8fafc)' }}
                  animate={mobileOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                  transition={{ duration: 0.2 }}
                />
                <motion.span
                  className="nav-hamburger-line block w-5 h-0.5 origin-center transition-colors duration-500"
                  style={{ background: 'var(--nav-text, #f8fafc)' }}
                  animate={mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.2 }}
                />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── MOBILE OVERLAY ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-overlay"
            className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm lg:hidden"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* ── MOBILE DRAWER ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-drawer"
            className="fixed top-0 right-0 bottom-0 z-[110] w-[280px] max-w-[85vw] border-l flex flex-col lg:hidden"
            style={{
              background: 'var(--nav-bg, #0b1628)',
              borderColor: 'var(--nav-border, rgba(255,255,255,0.08))',
            }}
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Drawer header */}
            <div className="flex items-center justify-between px-5 h-16 sm:h-20 border-b border-white/6 flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-white flex-shrink-0">
                  <Image src="/images/logo-wms.png" alt="WMS" fill className="object-contain p-1" />
                </div>
                <span className="text-white font-bold text-sm">WMS</span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-lg hover:bg-white/8 text-slate-400 hover:text-white transition-all"
                aria-label="Close menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-1">
              {NAV_LINKS.map((link, i) => {
                const isActive = activeSection === getHrefId(link.href);
                return (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                      isActive ? 'active' : ''
                    }`}
                    style={{
                      color: isActive ? 'var(--nav-text, #f8fafc)' : 'var(--nav-text-muted, #94a3b8)',
                      background: isActive ? 'var(--nav-link-active-bg, rgba(59,130,246,0.15))' : 'transparent',
                      borderColor: isActive ? 'var(--nav-accent, #3b82f6)' : 'transparent',
                      borderWidth: '1px',
                      borderStyle: 'solid',
                    }}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i, duration: 0.3 }}
                  >
                    {t(link.key)}
                  </motion.a>
                );
              })}
            </nav>

            {/* Drawer footer */}
            <div className="px-4 py-5 border-t flex flex-col gap-3 flex-shrink-0" style={{ borderColor: 'var(--nav-border, rgba(255,255,255,0.06))' }}>
              <button
                onClick={() => { setLang(lang === 'fr' ? 'en' : 'fr'); }}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-300"
                style={{
                  color: 'var(--nav-text-muted, #94a3b8)',
                  borderColor: 'var(--nav-border, rgba(255,255,255,0.1))',
                }}
              >
                <svg className="w-4 h-4 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                <span className="font-bold">{lang === 'fr' ? 'Français' : 'English'}</span>
                <span className="text-slate-600 mx-1">→</span>
                <span className="opacity-50">{lang === 'fr' ? 'English' : 'Français'}</span>
              </button>
              <a
                href="#contact"
                onClick={() => setMobileOpen(false)}
                className="nav-cta text-sm justify-center py-3 rounded-xl font-semibold text-white transition-all duration-300"
                style={{
                  background: 'var(--nav-btn-bg, linear-gradient(135deg, #1d4ed8, #3b82f6))',
                }}
              >
                {t('nav.cta')}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
