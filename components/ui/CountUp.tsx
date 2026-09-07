'use client';

import { useEffect, useRef, useState } from 'react';
import { useMotionValue, useSpring, useInView } from 'framer-motion';

interface CountUpProps {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}

export default function CountUp({
  value,
  prefix = '',
  suffix = '',
  decimals = 0,
  className = '',
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  // Reversible: once: false
  const isInView = useInView(ref, { once: false, margin: '-50px' });
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, {
    damping: 30,
    stiffness: 85,
  });

  const initialText = `${prefix}${decimals > 0 ? (0).toFixed(decimals) : '0'}${suffix}`;
  const [display, setDisplay] = useState(initialText);

  useEffect(() => {
    if (isInView) {
      motionVal.set(value);
    } else {
      motionVal.set(0);
    }
  }, [isInView, value, motionVal]);

  useEffect(() => {
    const unsub = spring.on('change', (latest) => {
      const formatted =
        decimals > 0
          ? latest.toFixed(decimals)
          : Math.round(latest).toLocaleString();
      setDisplay(`${prefix}${formatted}${suffix}`);
    });
    return () => unsub();
  }, [spring, decimals, prefix, suffix]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
