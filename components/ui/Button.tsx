'use client';

import { cn } from '@/lib/utils';
import { motion, type HTMLMotionProps } from 'framer-motion';
import type { ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-violet-600 hover:bg-violet-500 text-white border border-violet-500/50 hover:border-violet-400 shadow-lg shadow-violet-500/25',
  secondary: 'bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 backdrop-blur-md',
  ghost: 'bg-transparent hover:bg-white/5 text-zinc-400 hover:text-white border border-transparent',
  danger: 'bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30',
};

interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: ButtonVariant;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2 text-sm', lg: 'px-6 py-3 text-base' };

export function Button({ variant = 'secondary', size = 'md', className, children, whileHover, whileTap, ...props }: ButtonProps) {
  return (
    <motion.button
      whileHover={whileHover ?? { scale: 1.04 }}
      whileTap={whileTap ?? { scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}
