'use client';

import Link from 'next/link';

// Precomputed static blade coordinates rounded to 2 decimal places
// to guarantee 100% deterministic SSR/CSR SVG rendering with zero floating-point drift.
const BLADE_COORDINATES = [
  { x2: 30, y2: 18 },
  { x2: 24, y2: 28.39 },
  { x2: 12, y2: 28.39 },
  { x2: 6, y2: 18 },
  { x2: 12, y2: 7.61 },
  { x2: 24, y2: 7.61 },
];

export default function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const scale = size === 'sm' ? 0.75 : size === 'lg' ? 1.4 : 1;

  return (
    <Link href="/" className="inline-flex items-center gap-3 group" aria-label="HireLens Home">
      {/* Aperture SVG icon — using span to prevent invalid block-in-anchor HTML hydration nesting */}
      <span
        className="relative inline-block flex-shrink-0"
        style={{ width: 36 * scale, height: 36 * scale }}
      >
        {/* Ambient glow */}
        <span
          className="absolute inset-0 rounded-full blur-md opacity-60 group-hover:opacity-90 transition-opacity duration-500 pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.4) 0%, rgba(6,182,212,0.25) 50%, rgba(16,185,129,0.08) 100%)' }}
        />
        {/* Aperture ring */}
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10 w-full h-full block"
        >
          <circle cx="18" cy="18" r="17" stroke="url(#hirelens-logo-grad)" strokeWidth="1.5" />
          {/* Precomputed deterministic aperture blades */}
          {BLADE_COORDINATES.map((pt, i) => (
            <line
              key={i}
              x1="18"
              y1="18"
              x2={pt.x2}
              y2={pt.y2}
              stroke="url(#hirelens-logo-grad)"
              strokeWidth="1.2"
              strokeLinecap="round"
              opacity="0.75"
            />
          ))}
          {/* Pulsing data core */}
          <circle
            cx="18"
            cy="18"
            r="4"
            fill="url(#hirelens-core-grad)"
            className="animate-pulse"
          />
          <defs>
            <linearGradient id="hirelens-logo-grad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
              <stop stopColor="#8b5cf6" />
              <stop offset="0.5" stopColor="#06b6d4" />
              <stop offset="1" stopColor="#10b981" />
            </linearGradient>
            <radialGradient id="hirelens-core-grad" cx="50%" cy="50%" r="50%">
              <stop stopColor="#c4b5fd" />
              <stop offset="1" stopColor="#06b6d4" stopOpacity={0.8} />
            </radialGradient>
          </defs>
        </svg>
      </span>

      {/* Wordmark */}
      <span
        className="font-bold tracking-tight select-none inline-block"
        style={{ fontSize: 20 * scale, lineHeight: 1 }}
      >
        <span className="text-white font-extrabold tracking-tight">Hire</span>
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-cyan-400 to-emerald-400">
          Lens
        </span>
      </span>
    </Link>
  );
}
