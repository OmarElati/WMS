'use client';

import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import SectionAtmosphere from '@/components/SectionAtmosphere';

interface FormState {
  name: string;
  email: string;
  company: string;
  phone: string;
  service: string;
  message: string;
}

const INITIAL_FORM: FormState = {
  name: '', email: '', company: '', phone: '', service: '', message: '',
};

export default function Contact() {
  const { t } = useLanguage();
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); });
      },
      { threshold: 0.1 },
    );
    sectionRef.current
      ?.querySelectorAll('.animate-on-scroll, .animate-left, .animate-right')
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const validate = () => {
    const errs: Partial<FormState> = {};
    if (!form.name.trim()) errs.name = 'Requis';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = 'Email invalide';
    if (!form.message.trim()) errs.message = 'Requis';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus('sending');
    // Simulate API call
    await new Promise((res) => setTimeout(res, 1800));
    setStatus('success');
    setForm(INITIAL_FORM);
    setTimeout(() => setStatus('idle'), 6000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormState]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };




  return (
    <section id="contact" className="section-padding relative overflow-hidden" data-theme-section="contact" ref={sectionRef}>
      <SectionAtmosphere />
      {/* Background handled by ThemeCanvas */}

      <div className="container-page">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20 lg:mb-24">
          <div className="section-tag animate-on-scroll">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {t('contact.badge')}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-5 animate-on-scroll delay-100">
            {t('contact.title')}{' '}
            <span className="gradient-text">{t('contact.title_highlight')}</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg animate-on-scroll delay-200">
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">

          {/* ── FORM (3/5) ── */}
          <div className="lg:col-span-3 animate-left">
             <div className="glass rounded-2xl p-8 sm:p-10 glow-border">
              {status === 'success' ? (
                 <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                    <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-white font-semibold text-lg">{t('contact.f_success')}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  <div className="grid sm:grid-cols-2 gap-4 sm:gap-5 mb-5">
                    {/* Name */}
                    <div>
                      <label className="form-label">{t('contact.f_name')}</label>
                      <input
                        className={`form-input ${errors.name ? 'border-rose-500/60' : ''}`}
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder={t('contact.f_ph_name')}
                        autoComplete="name"
                      />
                      {errors.name && <p className="text-rose-400 text-xs mt-1">{errors.name}</p>}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="form-label">{t('contact.f_email')}</label>
                      <input
                        className={`form-input ${errors.email ? 'border-rose-500/60' : ''}`}
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder={t('contact.f_ph_email')}
                        autoComplete="email"
                      />
                      {errors.email && <p className="text-rose-400 text-xs mt-1">{errors.email}</p>}
                    </div>

                    {/* Company */}
                    <div>
                      <label className="form-label">{t('contact.f_company')}</label>
                      <input
                        className="form-input"
                        name="company"
                        value={form.company}
                        onChange={handleChange}
                        placeholder={t('contact.f_ph_company')}
                        autoComplete="organization"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="form-label">{t('contact.f_phone')}</label>
                      <input
                        className="form-input"
                        name="phone"
                        type="tel"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder={t('contact.f_ph_phone')}
                        autoComplete="tel"
                      />
                    </div>
                  </div>

                  {/* Service */}
                  <div className="mb-5">
                    <label className="form-label">{t('contact.f_service')}</label>
                    <select
                      className="form-input"
                      name="service"
                      value={form.service}
                      onChange={handleChange}
                    >
                      <option value="" disabled>—</option>
                      {[
                        'Développement Logiciel',
                        'Développement Web & Mobile',
                        'Intelligence Artificielle',
                        'Marketing Digital',
                        'Consulting IT',
                        'Cloud & DevOps',
                        'Autre',
                      ].map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  {/* Message */}
                  <div className="mb-8">
                    <label className="form-label">{t('contact.f_message')}</label>
                    <textarea
                      className={`form-input resize-none ${errors.message ? 'border-rose-500/60' : ''}`}
                      name="message"
                      rows={5}
                      value={form.message}
                      onChange={handleChange}
                      placeholder={t('contact.f_ph_message')}
                    />
                    {errors.message && <p className="text-rose-400 text-xs mt-1">{errors.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="btn-primary w-full py-4 text-base disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {status === 'sending' ? (
                      <>
                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        {t('contact.f_sending')}
                      </>
                    ) : (
                      <>
                        {t('contact.f_submit')}
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* ── INFO (2/5) ── */}
          <div className="lg:col-span-2 animate-right flex flex-col gap-5">

            {/* Contact details */}
            <div className="glass rounded-2xl p-6 glow-border">
              <h3 className="text-white font-bold text-xl mb-6">{t('contact.info_title')}</h3>
              <div className="space-y-4">
                {[
                  {
                    icon: (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    ),
                    label: t('contact.info_address'),
                    color: '#3b82f6',
                  },
                  {
                    icon: (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    ),
                    label: t('contact.info_email'),
                    color: '#06b6d4',
                  },
                  {
                    icon: (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    ),
                    label: t('contact.info_phone'),
                    color: '#8b5cf6',
                  },
                  {
                    icon: (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ),
                    label: t('contact.info_hours'),
                    color: '#10b981',
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${item.color}18`, color: item.color }}
                    >
                      {item.icon}
                    </div>
                    <span className="text-slate-300 text-sm leading-relaxed pt-1.5">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Social links */}
            <div className="glass rounded-2xl p-8 glow-border">
              <h3 className="text-white font-bold text-base mb-5">Réseaux sociaux</h3>
              <div className="flex gap-3">
                {[
                  { name: 'LinkedIn', color: '#0077b5', icon: 'in' },
                  { name: 'Twitter/X', color: '#1d9bf0', icon: 'X' },
                  { name: 'GitHub', color: '#6e40c9', icon: 'gh' },
                  { name: 'YouTube', color: '#ff0000', icon: 'yt' },
                ].map((s) => (
                  <a
                    key={s.name}
                    href="#"
                    aria-label={s.name}
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-xs font-black text-white transition-all duration-200 hover:scale-110"
                    style={{ background: `${s.color}22`, border: `1px solid ${s.color}30`, color: s.color }}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Map embed */}
            <div className="glass rounded-2xl overflow-hidden glow-border flex-1 min-h-[220px]">
              <iframe
                src="https://www.openstreetmap.org/export/embed.html?bbox=10.73%2C35.76%2C10.77%2C35.80&layer=mapnik&marker=35.78%2C10.75"
                className="w-full h-full min-h-[180px]"
                title="WMS Location — Monastir, Tunisia"
                loading="lazy"
                style={{ filter: 'invert(0.9) hue-rotate(190deg) saturate(0.7) brightness(0.7)' }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
