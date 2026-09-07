'use client';

import { cn } from '@/lib/utils';

interface SectionLabelProps {
  index: number | string;
  title: string;
  className?: string;
  tag?: string;
}

export default function SectionLabel({
  index,
  title,
  className = '',
  tag,
}: SectionLabelProps) {
  const padded = typeof index === 'number' ? String(index).padStart(2, '0') : index;

  return (
    <div className={cn('inline-flex items-center gap-3 text-xs tracking-[0.2em] uppercase font-mono text-zinc-500 mb-4', className)}>
      <span className="flex items-center gap-1.5 text-zinc-400">
        <span className="w-1.5 h-1.5 rounded-full bg-violet-400/80" />
        <span>{padded}</span>
      </span>
      <span className="text-zinc-700">/</span>
      <span className="text-zinc-300 font-semibold">{title}</span>
      {tag && (
        <>
          <span className="text-zinc-700">/</span>
          <span className="text-zinc-500">{tag}</span>
        </>
      )}
    </div>
  );
}
