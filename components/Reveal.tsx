'use client';

import { motion, type Variants, type HTMLMotionProps, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

type RevealVariant = 'fadeUp' | 'fadeDown' | 'fadeLeft' | 'fadeRight' | 'scale' | 'none';

interface RevealProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode;
  variant?: RevealVariant;
  delay?: number;
  duration?: number;
  once?: boolean;
  distance?: number;
}

const variantMap: Record<RevealVariant, Variants> = {
  fadeUp: {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  },
  fadeDown: {
    hidden: { opacity: 0, y: -40 },
    visible: { opacity: 1, y: 0 },
  },
  fadeLeft: {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0 },
  },
  fadeRight: {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
  },
  none: {
    hidden: { opacity: 1 },
    visible: { opacity: 1 },
  },
};

export default function Reveal({
  children,
  variant = 'fadeUp',
  delay = 0,
  duration = 0.6,
  once = true,
  distance,
  ...rest
}: RevealProps) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <>{children}</>;
  }

  const base = variantMap[variant];
  const variants: Variants = {
    hidden: { ...base.hidden, ...(distance != null ? { y: variant === 'fadeUp' ? distance : variant === 'fadeDown' ? -distance : undefined, x: variant === 'fadeLeft' ? -distance : variant === 'fadeRight' ? distance : undefined } : {}) },
    visible: { ...base.visible },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '-60px' }}
      variants={variants}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
