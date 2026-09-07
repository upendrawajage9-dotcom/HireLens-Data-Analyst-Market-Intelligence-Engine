'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView, useMotionValue, useSpring } from 'framer-motion';
import { useHasMounted } from '@/hooks/useHasMounted';

interface AnimatedCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}

export function AnimatedCounter({
  value,
  prefix = '',
  suffix = '',
  decimals = 0,
  className,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const hasMounted = useHasMounted();

  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 35,
    stiffness: 90,
  });

  const [formatted, setFormatted] = useState<string>(() => {
    return `${prefix}${decimals > 0 ? (0).toFixed(decimals) : '0'}${suffix}`;
  });

  useEffect(() => {
    if (inView && hasMounted) {
      motionValue.set(value);
    }
  }, [inView, hasMounted, motionValue, value]);

  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest) => {
      const formattedNum =
        decimals > 0
          ? latest.toFixed(decimals)
          : Math.round(latest).toLocaleString();
      setFormatted(`${prefix}${formattedNum}${suffix}`);
    });
    return () => unsubscribe();
  }, [springValue, decimals, prefix, suffix]);

  return (
    <span ref={ref} className={className}>
      {hasMounted
        ? formatted
        : `${prefix}${decimals > 0 ? (0).toFixed(decimals) : '0'}${suffix}`}
    </span>
  );
}
