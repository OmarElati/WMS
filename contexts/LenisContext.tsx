'use client';

import { createContext, useContext, useRef, type ReactNode } from 'react';
import type Lenis from 'lenis';

interface LenisContextValue {
  lenis: Lenis | null;
  setLenis: (l: Lenis) => void;
}

const LenisContext = createContext<LenisContextValue>({
  lenis: null,
  setLenis: () => {},
});

export function LenisProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  const setLenis = (l: Lenis) => {
    lenisRef.current = l;
  };

  return (
    <LenisContext.Provider value={{ lenis: lenisRef.current, setLenis }}>
      {children}
    </LenisContext.Provider>
  );
}

export const useLenis = () => useContext(LenisContext);
