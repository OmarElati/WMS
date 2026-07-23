'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'fr' | 'en';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

/* ──────────────────────────────────────────────
   TRANSLATIONS OBJECT
────────────────────────────────────────────── */
const translations: Record<Language, Record<string, unknown>> = {
  fr: {
    nav: {
      home: 'Accueil',
      services: 'Services',
      solutions: 'Solutions',
      about: 'À Propos',
      portfolio: 'Réalisations',
      blog: 'Blog',
      contact: 'Contact',
      cta: 'Demander un devis',
    },
    hero: {
      badge: 'Solutions IT à l\'Échelle Mondiale',
      headline: 'Solutions Informatiques Innovantes',
      headline_highlight: 'à l\'Échelle Mondiale',
      subheadline: 'IA • Développement Web & Mobile • Transformation Digitale • Export International',
      description:
        'WMS accompagne les entreprises dans leur transformation numérique avec des solutions sur mesure, innovantes et orientées vers les marchés internationaux.',
      cta1: 'Découvrir nos services',
      cta2: 'Parler à un expert',
      stats_projects: '200+',
      stats_projects_label: 'Projets livrés',
      stats_countries: '30+',
      stats_countries_label: 'Pays servis',
      stats_clients: '150+',
      stats_clients_label: 'Clients satisfaits',
      stats_years: '15+',
      stats_years_label: "Années d'expérience",
      scroll: 'Défiler',
    },
    services: {
      badge: 'Nos Services',
      title: 'Des Solutions Complètes pour Votre',
      title_highlight: 'Transformation Numérique',
      subtitle:
        "De la conception à la livraison, nous couvrons l'intégralité de vos besoins digitaux avec une expertise technique de pointe.",
      s1_title: 'Développement Logiciel & Programmation',
      s1_desc:
        'Applications sur mesure, APIs robustes et architectures enterprise évolutives. Nous transformons vos idées en solutions technologiques performantes.',
      s2_title: 'Développement Web & Mobile',
      s2_desc:
        "Sites web modernes, applications iOS, Android et Progressive Web Apps. Des expériences utilisateurs exceptionnelles sur tous les appareils.",
      s3_title: 'Intelligence Artificielle & ML',
      s3_desc:
        'Modèles IA personnalisés, automatisation intelligente, analyse prédictive et data science au service de votre croissance business.',
      s4_title: 'Marketing Digital & Croissance',
      s4_desc:
        "Stratégies de croissance, SEO technique, campagnes data-driven et acquisition client optimisée pour les marchés internationaux.",
      s5_title: 'Consulting IT & Gestion de Projets',
      s5_desc:
        "Transformation digitale, accompagnement stratégique, gestion de projets Agile/Scrum et audit technique pour optimiser votre SI.",
      s6_title: 'Cloud, DevOps & Cybersécurité',
      s6_desc:
        'Infrastructure cloud scalable, pipelines CI/CD, monitoring avancé et protection complète contre les cybermenaces.',
      explore: 'En savoir plus',
    },
    why: {
      badge: 'Pourquoi WMS',
      title: 'Votre Partenaire de Confiance pour',
      title_highlight: "L'Excellence Digitale",
      subtitle:
        'WMS combine expertise technique, vision stratégique et engagement client pour livrer des solutions qui dépassent vos attentes.',
      v1_title: 'Portée Mondiale',
      v1_desc:
        "Nous intervenons dans plus de 30 pays avec une expertise des marchés internationaux et une approche totalement orientée export.",
      v2_title: 'Innovation Continue',
      v2_desc:
        "Notre équipe intègre les technologies les plus avancées : IA, Cloud-native, Edge Computing pour vous maintenir en avance.",
      v3_title: 'Qualité Garantie',
      v3_desc:
        "Processus rigoureux de QA, code review et tests automatisés pour des livrables irréprochables à chaque fois.",
      v4_title: 'Centré Client',
      v4_desc:
        "Un account manager dédié, une communication transparente et un suivi post-livraison pour votre satisfaction totale.",
      s1_val: '200+',
      s1_label: 'Projets livrés',
      s2_val: '30+',
      s2_label: 'Pays servis',
      s3_val: '98%',
      s3_label: 'Taux de satisfaction',
      s4_val: '15+',
      s4_label: "Années d'expérience",
    },
    solutions: {
      badge: 'Solutions Sectorielles',
      title: 'Des Solutions Adaptées à',
      title_highlight: 'Chaque Secteur',
      subtitle: 'WMS développe des solutions verticales pour les industries les plus exigeantes à travers le monde.',
      tab_ecommerce: 'E-Commerce',
      tab_fintech: 'Fintech',
      tab_sante: 'Santé',
      tab_saas: 'SaaS & Cloud',
      tab_marketing: 'Marketing Digital',
      ecommerce_title: 'Plateformes E-Commerce de Nouvelle Génération',
      ecommerce_desc:
        'Solutions e-commerce B2B/B2C complètes avec gestion des stocks en temps réel, paiements multi-devises, marketplace multi-vendeurs et analytics avancés.',
      fintech_title: 'Applications Fintech Sécurisées',
      fintech_desc:
        'Plateformes bancaires digitales, wallets e-money, systèmes de paiement conformes PSD2 et solutions de compliance réglementaire internationale.',
      sante_title: 'Transformation Digitale de la Santé',
      sante_desc:
        'Systèmes de gestion hospitalière (HIS), télémédecine, dossiers médicaux électroniques et solutions santé connectée conformes RGPD/HIPAA.',
      saas_title: 'Plateformes SaaS Évolutives',
      saas_desc:
        'Architecture SaaS multi-tenant cloud-native avec auto-scaling, monitoring avancé, système de billing et dashboards analytics en temps réel.',
      marketing_title: 'Croissance Digitale Internationale',
      marketing_desc:
        "Écosystèmes marketing complets : CRM, marketing automation, attribution multi-canal, personnalisation IA et dashboards de performance.",
    },
    portfolio: {
      badge: 'Nos Réalisations',
      title: 'Des Projets qui Parlent',
      title_highlight: "d'Eux-Mêmes",
      subtitle: 'Découvrez une sélection de nos réalisations pour des clients à travers le monde.',
      cta: 'Voir le cas',
      all_projects: 'Voir tous les projets',
      p1_title: 'TradePulse',
      p1_cat: 'E-Commerce B2B',
      p1_desc:
        'Plateforme e-commerce internationale avec gestion multi-devises, marketplace B2B et analytics temps réel.',
      p1_country: 'France / Belgique',
      p2_title: 'FinFlow',
      p2_cat: 'Fintech',
      p2_desc:
        'Application fintech avec IA prédictive, conformité PSD2 et intégrations open banking multi-marchés.',
      p2_country: 'Maroc / UAE',
      p3_title: 'MediSync',
      p3_cat: 'Santé Digitale',
      p3_desc:
        'Système hospitalier complet avec télémédecine intégrée et dossiers médicaux électroniques.',
      p3_country: 'Tunisie / Canada',
      p4_title: 'NeuralCraft',
      p4_cat: 'Intelligence Artificielle',
      p4_desc:
        "Plateforme d'automatisation IA avec NLP avancé et computer vision pour l'industrie.",
      p4_country: 'UK / USA',
    },
    about: {
      badge: 'À Propos de WMS',
      title: "L'Histoire de",
      title_highlight: 'WMS',
      story1:
        "Fondée avec la vision de connecter les entreprises aux meilleures technologies mondiales, Worldwide Manager Solutions s'est imposée comme un partenaire de référence pour les organisations qui visent l'excellence digitale à l'international.",
      story2:
        'Notre approche est simple : comprendre profondément vos enjeux business, concevoir des solutions technologiques sur mesure, et vous accompagner dans la durée pour maximiser votre retour sur investissement.',
      mission_label: 'Notre Mission',
      mission:
        "Démocratiser l'accès aux technologies de pointe pour les entreprises du monde entier, en livrant des solutions sur mesure qui créent une valeur durable.",
      vision_label: 'Notre Vision',
      vision:
        "Être le partenaire IT de référence pour les entreprises qui transforment leur secteur à l'échelle internationale.",
      team_title: 'L\'Équipe Dirigeante',
      t1_name: 'Omar El Azizi',
      t1_role: 'CEO & Fondateur',
      t1_spec: 'Stratégie & Innovation',
      t2_name: 'Sarah Benali',
      t2_role: 'CTO',
      t2_spec: 'Architecture & IA',
      t3_name: 'Youssef Qasmi',
      t3_role: 'Directeur Commercial',
      t3_spec: 'Business Development',
    },
    testimonials: {
      badge: 'Témoignages Clients',
      title: 'Ce que Disent',
      title_highlight: 'Nos Clients',
      subtitle: 'Des entreprises à travers le monde nous font confiance pour leur transformation digitale.',
      q1: "WMS a complètement transformé notre infrastructure digitale. En 6 mois, nous avons multiplié notre chiffre d'affaires en ligne par 3. Une équipe exceptionnelle qui comprend vraiment les enjeux business.",
      q1_author: 'Jean-Pierre Martin',
      q1_role: 'PDG',
      q1_company: 'LuxeRetail SA',
      q1_country: 'France 🇫🇷',
      q2: 'La qualité du code et l\'expertise IA de WMS sont impressionnantes. Ils ont livré notre plateforme fintech en respectant toutes les contraintes réglementaires. Je les recommande sans hésitation.',
      q2_author: 'Maria Santos',
      q2_role: 'CTO',
      q2_company: 'BankNova Group',
      q2_country: 'Portugal 🇵🇹',
      q3: "Grâce à WMS, notre plateforme IA est passée de prototype à production en 4 mois. Leur maîtrise du ML et approche agile font d'eux un partenaire de premier ordre pour l'innovation.",
      q3_author: 'Ahmed Al-Rashid',
      q3_role: 'Fondateur',
      q3_company: 'TechVenture MENA',
      q3_country: 'UAE 🇦🇪',
      q4: 'Professionnalisme, réactivité et expertise : WMS réunit tout ce qu\'on recherche. Notre système hospitalier est maintenant un modèle dans le secteur. Merci à toute l\'équipe !',
      q4_author: 'Dr. Claire Fontaine',
      q4_role: 'DSI',
      q4_company: 'MedClinique Group',
      q4_country: 'Belgique 🇧🇪',
    },
    blog: {
      badge: 'Blog & Insights',
      title: 'Dernières Actualités',
      title_highlight: '& Insights',
      subtitle: "Restez à la pointe de l'innovation avec nos analyses et guides techniques.",
      read_more: "Lire l'article",
      see_all: 'Voir tous les articles',
      b1_cat: 'Intelligence Artificielle',
      b1_title: "L'IA Générative en Entreprise : Guide Complet 2025",
      b1_excerpt:
        "Comment intégrer les LLMs, Copilots et agents IA dans vos processus métier pour gagner en productivité et compétitivité.",
      b1_date: '24 juin 2025',
      b1_read: '8 min',
      b2_cat: 'Transformation Digitale',
      b2_title: 'Réussir sa Transformation Digitale à l\'International',
      b2_excerpt:
        "Les 5 piliers d'une stratégie de transformation digitale réussie pour les entreprises qui ciblent les marchés internationaux.",
      b2_date: '15 juin 2025',
      b2_read: '6 min',
      b3_cat: 'Développement Mobile',
      b3_title: 'PWA vs Apps Natives en 2025 : Le Guide Définitif',
      b3_excerpt:
        'Analyse comparative pour choisir entre Progressive Web Apps, React Native, Flutter et développement natif selon votre contexte.',
      b3_date: '8 juin 2025',
      b3_read: '10 min',
    },
    contact: {
      badge: 'Contactez-nous',
      title: 'Démarrons Votre',
      title_highlight: 'Projet Ensemble',
      subtitle: 'Parlez-nous de votre projet et obtenez une consultation gratuite avec nos experts.',
      f_name: 'Nom complet *',
      f_email: 'Email professionnel *',
      f_company: 'Entreprise',
      f_phone: 'Téléphone',
      f_service: 'Service recherché',
      f_message: 'Décrivez votre projet... *',
      f_submit: 'Envoyer ma demande',
      f_sending: 'Envoi en cours...',
      f_success: '✅ Message envoyé ! Nous vous répondrons dans les 24h.',
      f_error: 'Une erreur est survenue. Veuillez réessayer.',
      f_ph_name: 'Jean Dupont',
      f_ph_email: 'jean@entreprise.com',
      f_ph_company: 'Mon Entreprise SAS',
      f_ph_phone: '+33 6 XX XX XX XX',
      f_ph_message: 'Bonjour, je cherche à développer...',
      info_title: 'Informations',
      info_address: 'SKANES EL MECHREF, Cité Bir Hlou\nMonastir 5060, Tunisie',
      info_email: 'worldwidemanagersolutions@gmail.com',
      info_phone: '+216 99 45 45 12',
      info_hours: 'Lun-Ven : 9h - 18h (GMT+1)',
      services_opt: ['Développement Logiciel', 'Développement Web & Mobile', 'Intelligence Artificielle', 'Marketing Digital', 'Consulting IT', 'Cloud & DevOps', 'Autre'],
    },
    footer: {
      tagline: 'Programmation & Développement Informatique — Totalement à l\'Exportation',
      description: 'WMS est votre partenaire de référence pour la transformation digitale et les solutions IT à l\'échelle internationale.',
      services_title: 'Services',
      company_title: 'Entreprise',
      legal_title: 'Légal',
      rights: '© 2025 Worldwide Manager Solutions. Tous droits réservés.',
      privacy: 'Confidentialité',
      terms: 'Conditions d\'utilisation',
      cookies: 'Cookies',
    },
  },

  en: {
    nav: {
      home: 'Home',
      services: 'Services',
      solutions: 'Solutions',
      about: 'About',
      portfolio: 'Portfolio',
      blog: 'Blog',
      contact: 'Contact',
      cta: 'Request a quote',
    },
    hero: {
      badge: 'Global IT Solutions',
      headline: 'Innovative IT Solutions',
      headline_highlight: 'on a Global Scale',
      subheadline: 'AI • Web & Mobile Development • Digital Transformation • International Export',
      description:
        'WMS supports businesses in their digital transformation with tailor-made, innovative solutions oriented towards international markets.',
      cta1: 'Discover our services',
      cta2: 'Talk to an expert',
      stats_projects: '200+',
      stats_projects_label: 'Projects delivered',
      stats_countries: '30+',
      stats_countries_label: 'Countries served',
      stats_clients: '150+',
      stats_clients_label: 'Satisfied clients',
      stats_years: '15+',
      stats_years_label: 'Years of experience',
      scroll: 'Scroll',
    },
    services: {
      badge: 'Our Services',
      title: 'Complete Solutions for Your',
      title_highlight: 'Digital Transformation',
      subtitle:
        'From design to delivery, we cover all your digital needs with cutting-edge technical expertise.',
      s1_title: 'Software Development & Programming',
      s1_desc:
        'Tailor-made applications, robust APIs and scalable enterprise architectures. We turn your ideas into high-performance technological solutions.',
      s2_title: 'Web & Mobile Development',
      s2_desc:
        'Modern websites, iOS, Android and Progressive Web Apps. Exceptional user experiences on every device.',
      s3_title: 'Artificial Intelligence & ML',
      s3_desc:
        'Custom AI models, intelligent automation, predictive analytics and data science in service of your business growth.',
      s4_title: 'Digital Marketing & Growth',
      s4_desc:
        'Growth strategies, technical SEO, data-driven campaigns and optimised client acquisition for international markets.',
      s5_title: 'IT Consulting & Project Management',
      s5_desc:
        'Digital transformation, strategic advisory, Agile/Scrum project management and technical audits to optimise your IS.',
      s6_title: 'Cloud, DevOps & Cybersecurity',
      s6_desc:
        'Scalable cloud infrastructure, CI/CD pipelines, advanced monitoring and full protection against cyber threats.',
      explore: 'Learn more',
    },
    why: {
      badge: 'Why WMS',
      title: 'Your Trusted Partner for',
      title_highlight: 'Digital Excellence',
      subtitle:
        'WMS combines technical expertise, strategic vision and client commitment to deliver solutions that exceed your expectations.',
      v1_title: 'Global Reach',
      v1_desc:
        'We operate in more than 30 countries with expertise in international markets and a fully export-oriented approach.',
      v2_title: 'Continuous Innovation',
      v2_desc:
        'Our team integrates the most advanced technologies: AI, Cloud-native, Edge Computing to keep you ahead.',
      v3_title: 'Guaranteed Quality',
      v3_desc:
        'Rigorous QA processes, code review and automated testing for impeccable deliverables every time.',
      v4_title: 'Client-Centric',
      v4_desc:
        'A dedicated account manager, transparent communication and post-delivery follow-up for your total satisfaction.',
      s1_val: '200+',
      s1_label: 'Projects delivered',
      s2_val: '30+',
      s2_label: 'Countries served',
      s3_val: '98%',
      s3_label: 'Satisfaction rate',
      s4_val: '15+',
      s4_label: 'Years of experience',
    },
    solutions: {
      badge: 'Industry Solutions',
      title: 'Solutions Tailored to',
      title_highlight: 'Every Sector',
      subtitle: 'WMS develops vertical solutions for the most demanding industries worldwide.',
      tab_ecommerce: 'E-Commerce',
      tab_fintech: 'Fintech',
      tab_sante: 'Healthcare',
      tab_saas: 'SaaS & Cloud',
      tab_marketing: 'Digital Marketing',
      ecommerce_title: 'Next-Generation E-Commerce Platforms',
      ecommerce_desc:
        'Complete B2B/B2C e-commerce solutions with real-time inventory, multi-currency payments, multi-vendor marketplace and advanced analytics.',
      fintech_title: 'Secure Fintech Applications',
      fintech_desc:
        'Digital banking platforms, e-money wallets, PSD2-compliant payment systems and international regulatory compliance solutions.',
      sante_title: 'Healthcare Digital Transformation',
      sante_desc:
        'Hospital information systems, telemedicine, electronic health records and connected health solutions compliant with GDPR/HIPAA.',
      saas_title: 'Scalable SaaS Platforms',
      saas_desc:
        'Cloud-native multi-tenant SaaS architecture with auto-scaling, advanced monitoring, billing systems and real-time analytics dashboards.',
      marketing_title: 'International Digital Growth',
      marketing_desc:
        'Complete marketing ecosystems: CRM, marketing automation, multi-channel attribution, AI personalisation and performance dashboards.',
    },
    portfolio: {
      badge: 'Our Work',
      title: 'Projects that Speak',
      title_highlight: 'for Themselves',
      subtitle: 'Discover a selection of our projects for clients around the world.',
      cta: 'View case study',
      all_projects: 'View all projects',
      p1_title: 'TradePulse',
      p1_cat: 'B2B E-Commerce',
      p1_desc:
        'International e-commerce platform with multi-currency management, B2B marketplace and real-time analytics.',
      p1_country: 'France / Belgium',
      p2_title: 'FinFlow',
      p2_cat: 'Fintech',
      p2_desc:
        'Fintech app with predictive AI, PSD2 compliance and multi-market open banking integrations.',
      p2_country: 'Morocco / UAE',
      p3_title: 'MediSync',
      p3_cat: 'Digital Health',
      p3_desc:
        'Complete hospital management system with integrated telemedicine and electronic health records.',
      p3_country: 'Tunisia / Canada',
      p4_title: 'NeuralCraft',
      p4_cat: 'Artificial Intelligence',
      p4_desc:
        'AI automation platform with advanced NLP and computer vision for industry.',
      p4_country: 'UK / USA',
    },
    about: {
      badge: 'About WMS',
      title: 'The Story of',
      title_highlight: 'WMS',
      story1:
        'Founded with the vision of connecting businesses to the best global technologies, Worldwide Manager Solutions has established itself as a reference partner for organisations targeting digital excellence internationally.',
      story2:
        'Our approach is simple: deeply understand your business challenges, design tailor-made technological solutions, and support you over time to maximise your return on investment.',
      mission_label: 'Our Mission',
      mission:
        'Democratise access to cutting-edge technologies for businesses worldwide, delivering tailor-made solutions that create lasting value.',
      vision_label: 'Our Vision',
      vision:
        'To be the reference IT partner for businesses transforming their sector on an international scale.',
      team_title: 'Our Leadership Team',
      t1_name: 'Omar El Azizi',
      t1_role: 'CEO & Founder',
      t1_spec: 'Strategy & Innovation',
      t2_name: 'Sarah Benali',
      t2_role: 'CTO',
      t2_spec: 'Architecture & AI',
      t3_name: 'Youssef Qasmi',
      t3_role: 'Commercial Director',
      t3_spec: 'Business Development',
    },
    testimonials: {
      badge: 'Client Testimonials',
      title: 'What Our',
      title_highlight: 'Clients Say',
      subtitle: 'Businesses around the world trust us for their digital transformation.',
      q1: 'WMS completely transformed our digital infrastructure. In 6 months, we tripled our online revenue. An exceptional team that truly understands business challenges.',
      q1_author: 'Jean-Pierre Martin',
      q1_role: 'CEO',
      q1_company: 'LuxeRetail SA',
      q1_country: 'France 🇫🇷',
      q2: "WMS's code quality and AI expertise are impressive. They delivered our fintech platform while meeting all regulatory requirements. I recommend them without hesitation.",
      q2_author: 'Maria Santos',
      q2_role: 'CTO',
      q2_company: 'BankNova Group',
      q2_country: 'Portugal 🇵🇹',
      q3: "Thanks to WMS, our AI platform went from prototype to production in 4 months. Their ML mastery and agile approach make them a first-class innovation partner.",
      q3_author: 'Ahmed Al-Rashid',
      q3_role: 'Founder',
      q3_company: 'TechVenture MENA',
      q3_country: 'UAE 🇦🇪',
      q4: "Professionalism, responsiveness and expertise: WMS has it all. Our hospital system is now a model in the sector. Thank you to the whole team!",
      q4_author: 'Dr. Claire Fontaine',
      q4_role: 'CIO',
      q4_company: 'MedClinique Group',
      q4_country: 'Belgium 🇧🇪',
    },
    blog: {
      badge: 'Blog & Insights',
      title: 'Latest News',
      title_highlight: '& Insights',
      subtitle: 'Stay at the cutting edge of innovation with our technical analyses and guides.',
      read_more: 'Read article',
      see_all: 'See all articles',
      b1_cat: 'Artificial Intelligence',
      b1_title: 'Generative AI in Business: Complete Guide 2025',
      b1_excerpt:
        'How to integrate LLMs, Copilots and AI agents into your business processes to gain productivity and competitiveness.',
      b1_date: 'June 24, 2025',
      b1_read: '8 min',
      b2_cat: 'Digital Transformation',
      b2_title: 'Succeeding in Digital Transformation Internationally',
      b2_excerpt:
        'The 5 pillars of a successful digital transformation strategy for companies targeting international markets.',
      b2_date: 'June 15, 2025',
      b2_read: '6 min',
      b3_cat: 'Mobile Development',
      b3_title: 'PWA vs Native Apps in 2025: The Definitive Guide',
      b3_excerpt:
        'Comprehensive comparative analysis to choose between Progressive Web Apps, React Native, Flutter and native development.',
      b3_date: 'June 8, 2025',
      b3_read: '10 min',
    },
    contact: {
      badge: 'Contact Us',
      title: 'Let\'s Start Your',
      title_highlight: 'Project Together',
      subtitle: 'Tell us about your project and get a free consultation with our experts.',
      f_name: 'Full name *',
      f_email: 'Professional email *',
      f_company: 'Company',
      f_phone: 'Phone number',
      f_service: 'Service needed',
      f_message: 'Describe your project... *',
      f_submit: 'Send my request',
      f_sending: 'Sending...',
      f_success: '✅ Message sent! We\'ll get back to you within 24 hours.',
      f_error: 'An error occurred. Please try again.',
      f_ph_name: 'John Smith',
      f_ph_email: 'john@company.com',
      f_ph_company: 'My Company Ltd',
      f_ph_phone: '+44 7XX XXX XXXX',
      f_ph_message: 'Hello, I am looking to develop...',
      info_title: 'Information',
      info_address: 'SKANES EL MECHREF, Cité Bir Hlou\nMonastir 5060, Tunisia',
      info_email: 'worldwidemanagersolutions@gmail.com',
      info_phone: '+216 99 45 45 12',
      info_hours: 'Mon-Fri: 9am - 6pm (GMT+1)',
      services_opt: ['Software Development', 'Web & Mobile Development', 'Artificial Intelligence', 'Digital Marketing', 'IT Consulting', 'Cloud & DevOps', 'Other'],
    },
    footer: {
      tagline: 'Programming & IT Development — Totally Export-Oriented',
      description: 'WMS is your reference partner for digital transformation and IT solutions on an international scale.',
      services_title: 'Services',
      company_title: 'Company',
      legal_title: 'Legal',
      rights: '© 2025 Worldwide Manager Solutions. All rights reserved.',
      privacy: 'Privacy Policy',
      terms: 'Terms of Use',
      cookies: 'Cookies',
    },
  },
};

/* ──────────────────────────────────────────────
   CONTEXT
────────────────────────────────────────────── */
const LanguageContext = createContext<LanguageContextType>({
  lang: 'fr',
  setLang: () => {},
  t: (key) => key,
});

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const result = path.split('.').reduce((acc: unknown, key: string) => {
    if (acc && typeof acc === 'object') {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
  return typeof result === 'string' ? result : path;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>('fr');

  const t = (key: string): string =>
    getNestedValue(translations[lang] as Record<string, unknown>, key);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
