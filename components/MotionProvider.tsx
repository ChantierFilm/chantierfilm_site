'use client';

import { MotionConfig } from 'framer-motion';

/**
 * Applique la préférence système `prefers-reduced-motion` à toutes les
 * animations framer-motion du site (réduction automatique des animations).
 */
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
