import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { LenisProvider } from '@/contexts/LenisContext';
import AnimationObserver from '@/components/AnimationObserver';
import SmoothScroll from '@/components/SmoothScroll';
import ThemeCanvas from '@/components/ThemeCanvas';
import ScrollThemeOrchestrator from '@/components/ScrollThemeOrchestrator';
import ScrollBehaviorManager from '@/components/ScrollBehaviorManager';
import ThemeSweepLine from '@/components/ThemeSweepLine';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0a1628',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://wms-solutions.com'),
  title: "WMS — Worldwide Manager Solutions | Développement IT & IA à l'Export",
  description:
    "WMS (Worldwide Manager Solutions) est votre partenaire expert en développement logiciel, web & mobile, intelligence artificielle, marketing digital et consulting IT à l'échelle internationale.",
  keywords: [
    'développement logiciel', 'intelligence artificielle', 'développement web', 'développement mobile',
    'marketing digital', 'consulting IT', 'cloud', 'devops', 'cybersécurité', 'exportation', 'international',
    'WMS', 'Worldwide Manager Solutions',
  ],
  authors: [{ name: 'Worldwide Manager Solutions' }],
  creator: 'WMS',
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    alternateLocale: 'en_US',
    url: 'https://wms-solutions.com',
    siteName: 'Worldwide Manager Solutions',
    title: "WMS — Solutions Informatiques Innovantes à l'Échelle Mondiale",
    description:
      "Développement logiciel, IA, web & mobile, marketing digital et consulting IT pour entreprises internationales.",
    images: [{ url: '/images/logo-wms.png', width: 1024, height: 1024, alt: 'WMS Logo' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WMS — Worldwide Manager Solutions',
    description: "Solutions IT innovantes à l'échelle mondiale.",
    images: ['/images/logo-wms.png'],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={inter.variable} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/images/logo-wms.png" type="image/png" />
      </head>
      <body className={`${inter.variable} antialiased text-slate-100`} style={{ backgroundColor: 'transparent' }}>
        <LanguageProvider>
          <ThemeProvider>
            <LenisProvider>
              {/* Fixed cinematic background canvas — renders behind everything */}
              <ThemeCanvas />
              {/* Scroll watcher that fires theme changes */}
              <ScrollThemeOrchestrator />
              {/* Dynamic scroll behavior per section theme */}
              <ScrollBehaviorManager />
              {/* Sweep line indicator for theme transitions */}
              <ThemeSweepLine />
              <AnimationObserver />
              <SmoothScroll>
                {children}
              </SmoothScroll>
            </LenisProvider>
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}

