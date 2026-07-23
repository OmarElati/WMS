'use client';

import dynamic from 'next/dynamic';

const GlobeBackground = dynamic(() => import('@/components/GlobeBackground'), { ssr: false });

export default function GlobeBackgroundWrapper() {
  return (
    <GlobeBackground
      glowIntensity={1}
      interactive
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
    />
  );
}
