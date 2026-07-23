'use client';

/**
 * ScrollThemeOrchestrator — mounts once inside the layout.
 * Boots the scroll-to-theme wiring after the component tree is ready.
 */

import { useScrollTheme } from '@/hooks/useScrollTheme';

export default function ScrollThemeOrchestrator() {
  useScrollTheme();
  return null;
}
