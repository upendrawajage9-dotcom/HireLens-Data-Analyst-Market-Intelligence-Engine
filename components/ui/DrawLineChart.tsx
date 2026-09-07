'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface DataPoint {
  years: number;
  US: number;
  Remote: number;
  India: number;
}

interface DrawLineChartProps {
  data: DataPoint[];
}

export default function DrawLineChart({ data }: DrawLineChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  // Reversible inView trigger
  const isInView = useInView(containerRef, { once: false, margin: '-60px' });

  // SVG viewBox coordinates
  const width = 640;
  const height = 280;
  const padding = { top: 30, right: 30, bottom: 40, left: 60 };

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Domain scaling
  const minSalary = 40000;
  const maxSalary = 160000;

  const getX = (index: number) => padding.left + (index / (data.length - 1)) * chartWidth;
  const getY = (val: number) =>
    padding.top + chartHeight - ((val - minSalary) / (maxSalary - minSalary)) * chartHeight;

  // Construct smooth SVG path
  const buildPath = (key: 'US' | 'Remote' | 'India') => {
    return data.reduce((acc, d, i) => {
      const x = getX(i);
      const y = getY(d[key]);
      if (i === 0) return `M ${x} ${y}`;
      // Cubic bezier smoothing
      const prevX = getX(i - 1);
      const prevY = getY(data[i - 1][key]);
      const cp1x = prevX + (x - prevX) / 2;
      const cp1y = prevY;
      const cp2x = prevX + (x - prevX) / 2;
      const cp2y = y;
      return `${acc} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x} ${y}`;
    }, '');
  };

  const pathUS = buildPath('US');
  const pathRemote = buildPath('Remote');

  // Closed area path for US gradient fill
  const lastX = getX(data.length - 1);
  const firstX = getX(0);
  const bottomY = padding.top + chartHeight;
  const areaUS = `${pathUS} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;

  // Grid lines
  const yTicks = [50000, 80000, 110000, 140000];

  return (
    <div ref={containerRef} className="w-full relative select-none">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradient for area fill under US line */}
          <linearGradient id="areaFillGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.35} />
            <stop offset="60%" stopColor="#06b6d4" stopOpacity={0.08} />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.0} />
          </linearGradient>

          {/* Cyan glowing line filter */}
          <filter id="cyanLineGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Horizontal Grid lines */}
        {yTicks.map((val) => {
          const y = getY(val);
          return (
            <g key={val}>
              <line
                x1={padding.left}
                y1={y}
                x2={width - padding.right}
                y2={y}
                stroke="rgba(255, 255, 255, 0.05)"
                strokeDasharray="4 4"
              />
              <text
                x={padding.left - 12}
                y={y + 4}
                fill="#71717a"
                fontSize="10"
                fontFamily="monospace"
                textAnchor="end"
              >
                ${(val / 1000).toFixed(0)}k
              </text>
            </g>
          );
        })}

        {/* X-axis tick labels */}
        {data.map((d, i) => {
          const x = getX(i);
          return (
            <text
              key={d.years}
              x={x}
              y={height - 12}
              fill="#71717a"
              fontSize="11"
              fontFamily="monospace"
              textAnchor="middle"
            >
              {d.years} YOE
            </text>
          );
        })}

        {/* Area fill under curve (reversible fade) */}
        <motion.path
          d={areaUS}
          fill="url(#areaFillGrad)"
          initial={{ opacity: 0 }}
          animate={{ opacity: isInView ? 1 : 0 }}
          transition={{ duration: 1.4, delay: 0.3 }}
        />

        {/* Secondary curve (Global Remote in violet) - draws itself */}
        <motion.path
          d={pathRemote}
          stroke="#8b5cf6"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: isInView ? 1 : 0,
            opacity: isInView ? 0.75 : 0,
          }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Primary curve (US Market in glowing cyan) - draws itself */}
        <motion.path
          d={pathUS}
          stroke="#06b6d4"
          strokeWidth="2.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#cyanLineGlow)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: isInView ? 1 : 0 }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Data points along US line that scale in as the line reaches them */}
        {data.map((d, i) => {
          const x = getX(i);
          const y = getY(d.US);
          return (
            <g key={`pt-${i}`}>
              <motion.circle
                cx={x}
                cy={y}
                r="4.5"
                fill="#0a0a0f"
                stroke="#06b6d4"
                strokeWidth="2.5"
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: isInView ? 1 : 0,
                  opacity: isInView ? 1 : 0,
                }}
                transition={{
                  duration: 0.4,
                  delay: isInView ? 0.3 + (i / (data.length - 1)) * 1.3 : 0,
                  ease: 'backOut',
                }}
              />
              {/* Highlight halo on the highest/senior point */}
              {i === data.length - 1 && (
                <motion.circle
                  cx={x}
                  cy={y}
                  r="9"
                  stroke="#06b6d4"
                  strokeWidth="1"
                  strokeOpacity="0.5"
                  initial={{ scale: 0 }}
                  animate={{
                    scale: isInView ? [1, 1.4, 1] : 0,
                    opacity: isInView ? [0.6, 0.2, 0.6] : 0,
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2.2,
                    ease: 'easeInOut',
                  }}
                />
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
