import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

type BadgeVariant = 'violet' | 'cyan' | 'emerald' | 'amber' | 'rose' | 'ghost';

const variantClasses: Record<BadgeVariant, string> = {
  violet: 'bg-violet-500/15 text-violet-300 border border-violet-500/30',
  cyan: 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30',
  emerald: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30',
  amber: 'bg-amber-500/15 text-amber-300 border border-amber-500/30',
  rose: 'bg-rose-500/15 text-rose-300 border border-rose-500/30',
  ghost: 'bg-white/5 text-zinc-400 border border-white/10',
};

export function Badge({ children, variant = 'ghost', className }: { children: ReactNode; variant?: BadgeVariant; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium', variantClasses[variant], className)}>
      {children}
    </span>
  );
}
