'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';

const SERVICE_LINKS = [
  'Développement Logiciel',
  'Web & Mobile',
  'IA & Machine Learning',
  'Marketing Digital',
  'Cloud & DevOps',
  'Consulting IT',
];

const COMPANY_LINKS = [
  { label: 'À Propos', href: '#apropos' },
  { label: 'Réalisations', href: '#portfolio' },
  { label: 'Blog', href: '#blog' },
  { label: 'Carrières', href: '#contact' },
  { label: 'Contact', href: '#contact' },
];

const SOCIAL = [
  {
    name: 'LinkedIn',
    href: '#',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    color: '#0077b5',
  },
  {
    name: 'Twitter/X',
    href: '#',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    color: '#e2e8f0',
  },
  {
    name: 'GitHub',
    href: '#',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
      </svg>
    ),
    color: '#8b5cf6',
  },
  {
    name: 'YouTube',
    href: '#',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
    color: '#ef4444',
  },
];

export default function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();
  const [visible, setVisible] = useState(true);
  const prefersReduced = useReducedMotion();

  /* Load preference from localStorage and listen for toggle events */
  useEffect(() => {
    const stored = localStorage.getItem('wms-footer-visible');
    if (stored === 'false') setVisible(false);

    const onToggle = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setVisible(detail.visible);
    };
    window.addEventListener('footer-toggle', onToggle);
    return () => window.removeEventListener('footer-toggle', onToggle);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.footer
          key="footer"
          className="relative border-t border-white/5 overflow-hidden"
          initial={prefersReduced ? { opacity: 1 } : { opacity: 0, height: 0 }}
          animate={prefersReduced ? { opacity: 1 } : { opacity: 1, height: 'auto' }}
          exit={prefersReduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, #0a1628, #060d1a)',
        }} />

      <div className="relative container-page pt-16 pb-8">

        {/* Top grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">

          {/* Brand */}
          <div className="lg:col-span-1">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-5">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden ring-1 ring-white/10">
                <Image src="/images/logo-wms.png" alt="WMS Logo" fill className="object-contain p-1" />
              </div>
              <div>
                <div className="font-bold text-white text-base">WMS</div>
                <div className="text-[10px] text-primary-400 uppercase tracking-widest">
                  Worldwide Manager Solutions
                </div>
              </div>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed mb-5">
              {t('footer.description')}
            </p>

            {/* Contact info */}
            <div className="space-y-2.5 mb-5">
              <a href="mailto:worldwidemanagersolutions@gmail.com" className="flex items-center gap-2 text-slate-400 hover:text-primary-400 text-xs transition-colors duration-200">
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                worldwidemanagersolutions@gmail.com
              </a>
              <a href="tel:+21699454512" className="flex items-center gap-2 text-slate-400 hover:text-primary-400 text-xs transition-colors duration-200">
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                +216 99 45 45 12
              </a>
              <div className="flex items-start gap-2 text-slate-500 text-xs">
                <svg className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>SKANES EL MECHREF, Cité Bir Hlou<br />Monastir 5060, Tunisie</span>
              </div>
            </div>

            {/* Social */}
            <div className="flex gap-2.5">
              {SOCIAL.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  aria-label={s.name}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110"
                  style={{
                    background: `${s.color}15`,
                    border: `1px solid ${s.color}25`,
                    color: s.color,
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-5">
              {t('footer.services_title')}
            </h4>
            <ul className="space-y-2.5">
              {SERVICE_LINKS.map((svc) => (
                <li key={svc}>
                  <a href="#services"
                    className="text-slate-500 hover:text-primary-400 text-sm transition-colors duration-200 flex items-center gap-1.5 group">
                    <span className="w-1 h-1 rounded-full bg-primary-600 group-hover:bg-primary-400 transition-colors" />
                    {svc}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-5">
              {t('footer.company_title')}
            </h4>
            <ul className="space-y-2.5">
              {COMPANY_LINKS.map((link) => (
                <li key={link.label}>
                  <a href={link.href}
                    className="text-slate-500 hover:text-primary-400 text-sm transition-colors duration-200 flex items-center gap-1.5 group">
                    <span className="w-1 h-1 rounded-full bg-primary-600 group-hover:bg-primary-400 transition-colors" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA block */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-5">
              {t('footer.legal_title')}
            </h4>
            <ul className="space-y-2.5 mb-8">
              {[t('footer.privacy'), t('footer.terms'), t('footer.cookies')].map((item) => (
                <li key={item}>
                  <a href="#"
                    className="text-slate-500 hover:text-primary-400 text-sm transition-colors duration-200 flex items-center gap-1.5 group">
                    <span className="w-1 h-1 rounded-full bg-primary-600 group-hover:bg-primary-400 transition-colors" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <div className="glass rounded-xl p-4 glow-border">
              <p className="text-slate-400 text-xs mb-3 leading-relaxed">
                Prêt à démarrer votre projet?
              </p>
              <a href="#contact" className="btn-primary text-xs px-4 py-2 w-full justify-center text-center">
                Demander un devis
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="divider-gradient mb-8" />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-600 text-xs text-center sm:text-left">
            {t('footer.rights').replace('2025', String(year))}
          </p>
          <p className="text-slate-700 text-xs text-center">
            Société WORLDWIDE MANAGER SOLUTIONS W M S — Omar Elati, Fondateur & CEO
          </p>
          <div className="flex items-center gap-1.5 text-xs text-slate-700">
            <span>Made with</span>
            <svg className="w-3.5 h-3.5 text-rose-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
            <span>by WMS</span>
          </div>
        </div>
      </div>
    </motion.footer>
    )}
    </AnimatePresence>
  );
}
