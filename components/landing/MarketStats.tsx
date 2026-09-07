'use client';

import { useMemo, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { getMarketMetrics } from '@/lib/analytics';
import SectionLabel from '@/components/ui/SectionLabel';
import Reveal from '@/components/ui/Reveal';
import CountUp from '@/components/ui/CountUp';
import { ArrowRight } from 'lucide-react';

const MONTHLY_GROWTH = [
  { month: 'Jan', value: 160, percent: 16 },
  { month: 'Feb', value: 210, percent: 21 },
  { month: 'Mar', value: 270, percent: 27 },
  { month: 'Apr', value: 340, percent: 34 },
  { month: 'May', value: 410, percent: 41 },
  { month: 'Jun', value: 490, percent: 49 },
  { month: 'Jul', value: 580, percent: 58 },
  { month: 'Aug', value: 670, percent: 67 },
  { month: 'Sep', value: 760, percent: 76 },
  { month: 'Oct', value: 850, percent: 85 },
  { month: 'Nov', value: 930, percent: 93 },
  { month: 'Dec', value: 1000, percent: 100 },
];

export default function MarketStats() {
  const metrics = useMemo(() => getMarketMetrics(), []);
  const chartRef = useRef<HTMLDivElement>(null);
  // Reversible viewport observer
  const isChartInView = useInView(chartRef, { once: false, margin: '-50px' });

  const stats = [
    {
      id: 'listings',
      label: 'LISTINGS ANALYZED',
      numericValue: metrics.totalListings,
      suffix: '+',
    },
    {
      id: 'sql',
      label: 'SQL DEMAND',
      numericValue: 79.1,
      suffix: '%',
      decimals: 1,
    },
    {
      id: 'remote',
      label: 'REMOTE ROLES',
      numericValue: 44.2,
      suffix: '%',
      decimals: 1,
    },
    {
      id: 'salary',
      label: 'MEDIAN SALARY',
      numericValue: 108,
      prefix: '$',
      suffix: 'K',
    },
  ];

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="market" className="w-full py-28 px-6 sm:px-10 lg:px-[6vw] 2xl:px-[7vw] border-t border-white/[0.06] bg-[#05070b]">
      <div className="w-full space-y-16">
        {/* Section Label */}
        <Reveal>
          <SectionLabel index="01" title="THE MARKET" tag="MACRO SIGNALS" />
        </Reveal>

        {/* Two-Column Header & Stats matching Reference Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Headline & Editorial Context */}
          <div className="lg:col-span-5 space-y-6">
            <Reveal delay={0.1}>
              <h2 className="text-[clamp(2.6rem,5.5vw,5.5rem)] font-extrabold tracking-[-0.03em] leading-[0.96] text-white">
                THE MARKET <br />
                <span className="text-cyan-400">IS MOVING.</span>
              </h2>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="text-base sm:text-lg text-zinc-400 font-normal leading-relaxed max-w-lg">
                More listings don’t necessarily mean more opportunity. The real signal is what employers repeatedly ask for.
              </p>
            </Reveal>

            <Reveal delay={0.3}>
              <button
                onClick={() => scrollTo('visualizations')}
                className="group inline-flex items-center gap-2 text-sm font-medium text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
              >
                <span>Explore the data</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Reveal>
          </div>

          {/* Right Column: 4 KPI Metrics + Job Listings Over Time Chart */}
          <div className="lg:col-span-7 space-y-12">
            {/* 4 Stats Grid with Reversible CountUp */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pb-8 border-b border-white/[0.06]">
              {stats.map((stat, idx) => (
                <Reveal key={stat.id} delay={0.1 + idx * 0.08} className="space-y-1.5">
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-none">
                    <CountUp
                      value={stat.numericValue}
                      prefix={stat.prefix}
                      suffix={stat.suffix}
                      decimals={stat.decimals}
                    />
                  </div>
                  <div className="text-[10px] sm:text-[11px] font-mono tracking-wider uppercase text-zinc-500">
                    {stat.label}
                  </div>
                </Reveal>
              ))}
            </div>

            {/* JOB LISTINGS OVER TIME Progression Bar Chart */}
            <div ref={chartRef} className="space-y-4">
              <div className="flex items-center justify-between text-[11px] font-mono tracking-wider uppercase text-zinc-500">
                <span>JOB LISTINGS OVER TIME</span>
                <span className="text-zinc-600">HISTORICAL CORPUS</span>
              </div>

              {/* Chart container with Y-axis tick marks */}
              <div className="relative pt-6 pb-2">
                {/* Y-axis levels */}
                <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-[9px] font-mono text-zinc-600 pointer-events-none">
                  <span>1K</span>
                  <span>750</span>
                  <span>500</span>
                  <span>250</span>
                  <span>0</span>
                </div>

                {/* 12 Monthly Bars */}
                <div className="ml-8 grid grid-cols-12 gap-1.5 sm:gap-3 items-end h-[170px] border-b border-white/[0.08] pb-1">
                  {MONTHLY_GROWTH.map((item, idx) => {
                    // Smooth gradient interpolation from Cyan (#06D6F5) to Violet (#8B5CF6)
                    const factor = idx / (MONTHLY_GROWTH.length - 1);
                    const r = Math.round(6 + (139 - 6) * factor);
                    const g = Math.round(214 + (92 - 214) * factor);
                    const b = Math.round(245 + (246 - 245) * factor);
                    const color = `rgb(${r}, ${g}, ${b})`;

                    return (
                      <div key={item.month} className="flex flex-col items-center h-full justify-end group">
                        <motion.div
                          className="w-full rounded-t-sm relative transition-all duration-300"
                          style={{
                            backgroundColor: color,
                            boxShadow: `0 0 12px rgba(${r}, ${g}, ${b}, 0.25)`,
                          }}
                          initial={{ height: 0 }}
                          animate={{ height: isChartInView ? `${item.percent}%` : 0 }}
                          transition={{
                            duration: 0.8,
                            delay: isChartInView ? 0.15 + idx * 0.05 : 0,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                        >
                          {/* Top luminous highlight line */}
                          <div className="w-full h-0.5 bg-white/70 rounded-t-sm" />
                        </motion.div>
                        <span className="text-[10px] font-mono text-zinc-500 mt-2">
                          {item.month}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
