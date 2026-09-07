'use client';

import { motion } from 'framer-motion';

interface TickerProps {
  items: string[];
  speed?: number; // px per second
}

export function Ticker({ items, speed = 60 }: TickerProps) {
  // Duplicate items for seamless infinite loop
  const doubled = [...items, ...items];
  const itemWidth = 300;
  const totalWidth = itemWidth * items.length;

  return (
    <div className="relative overflow-hidden py-3 border-y border-white/[0.05] bg-[#05070a]/60">
      {/* Fade edges */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-r from-[#05070a] to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-l from-[#05070a] to-transparent" />

      <motion.div
        className="flex gap-0 whitespace-nowrap"
        animate={{ x: [0, -totalWidth] }}
        transition={{
          duration: totalWidth / speed,
          repeat: Infinity,
          ease: 'linear',
          repeatType: 'loop',
        }}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-2 text-[11px] text-zinc-400 font-mono tracking-wide"
            style={{ width: itemWidth }}
          >
            <span className="w-1 h-1 rounded-full bg-cyan-400/70 flex-shrink-0" />
            {item}
            <span className="ml-3 text-zinc-700">·</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
