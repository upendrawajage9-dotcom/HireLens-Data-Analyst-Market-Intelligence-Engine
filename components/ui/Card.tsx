'use client';

import { cn } from '@/lib/utils';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef, type ReactNode, type MouseEvent } from 'react';
import { useHasMounted } from '@/hooks/useHasMounted';

interface CardProps {
  children: ReactNode;
  className?: string;
  glow?: boolean;
  tilt?: boolean;
}

export function Card({ children, className, glow = false, tilt = true }: CardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const hasMounted = useHasMounted();
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 220, damping: 24 });
  const mouseYSpring = useSpring(y, { stiffness: 220, damping: 24 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['6deg', '-6deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-6deg', '6deg']);

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    if (!tilt || !cardRef.current || !hasMounted) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    if (width === 0 || height === 0) return;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={hasMounted && tilt ? { rotateX, rotateY, transformStyle: 'preserve-3d' } : undefined}
      className={cn(
        'relative rounded-2xl border border-white/[0.08] bg-zinc-900/40 backdrop-blur-2xl transition-all duration-500 hover:border-violet-500/50 hover:shadow-[0_0_40px_-10px_rgba(139,92,246,0.2)]',
        glow && 'shadow-[0_0_30px_-8px_rgba(139,92,246,0.15)]',
        className
      )}
    >
      <div style={hasMounted && tilt ? { transform: 'translateZ(12px)' } : undefined}>
        {children}
      </div>
    </motion.div>
  );
}

export function CardHeader({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('px-6 pt-6 pb-4', className)}>{children}</div>;
}

export function CardBody({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('px-6 pb-6', className)}>{children}</div>;
}
