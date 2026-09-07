'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';

type Direction = 'up' | 'down' | 'left' | 'right' | 'scale' | 'fade';

interface RevealProps {
  children: ReactNode;
  className?: string;
  direction?: Direction;
  delay?: number;
  duration?: number;
  distance?: number;
  staggerChildren?: number;
  once?: boolean;
}

export default function Reveal({
  children,
  className = '',
  direction = 'up',
  delay = 0,
  duration = 0.7,
  distance = 32,
  staggerChildren,
  once = false, // Reversible scroll animation by default
}: RevealProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const getInitialState = () => {
    switch (direction) {
      case 'up':
        return { opacity: 0, y: distance, x: 0, scale: 1 };
      case 'down':
        return { opacity: 0, y: -distance, x: 0, scale: 1 };
      case 'left':
        return { opacity: 0, x: distance, y: 0, scale: 1 };
      case 'right':
        return { opacity: 0, x: -distance, y: 0, scale: 1 };
      case 'scale':
        return { opacity: 0, scale: 0.94, x: 0, y: 0 };
      case 'fade':
      default:
        return { opacity: 0, x: 0, y: 0, scale: 1 };
    }
  };

  const variants: Variants = {
    hidden: getInitialState(),
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: {
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
        ...(staggerChildren ? { staggerChildren } : {}),
      },
    },
  };

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '-60px' }}
      variants={variants}
    >
      {children}
    </motion.div>
  );
}
