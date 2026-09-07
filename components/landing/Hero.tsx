'use client';

import dynamic from 'next/dynamic';
import { motion, useScroll, useTransform, type Variants } from 'framer-motion';
import { ArrowRight, Play, Sparkles } from 'lucide-react';
import { Ticker } from '@/components/ui/Ticker';

// Lazy-load the Three.js Earth Globe with SSR disabled for optimal performance and zero hydration issues
const EarthGlobe = dynamic(() => import('./EarthGlobe'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[580px] flex items-center justify-center">
      <div className="w-64 h-64 rounded-full border border-cyan-500/20 animate-pulse bg-cyan-950/10" />
    </div>
  ),
});

const TICKER_ITEMS = [
  'SQL Demand: 79.1% of total analyst listings',
  'Python Salary Premium: +22.4% over single-skill baseline',
  'Avg Remote Data Analyst Salary: $92,000 USD',
  'Snowflake Warehouse Demand Growth: +41% YoY',
  'dbt Modern Analytics Engineering Stack Adoption: +67%',
  'Power BI Requirement: 41.2% of corporate requisitions',
  'Remote Work Density: 44.2% of active roles',
  'Senior Data Analyst Median Compensation: $138,000 USD',
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const lineVariants: Variants = {
  hidden: { opacity: 0, y: 36, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.75,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const statsVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.75,
    },
  },
};

const statItemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export default function Hero() {
  const { scrollY } = useScroll();

  // Scroll-linked parallax for Earth and hero content
  const globeY = useTransform(scrollY, [0, 700], [0, 120]);
  const globeScale = useTransform(scrollY, [0, 700], [1, 0.9]);
  const globeOpacity = useTransform(scrollY, [0, 600], [1, 0.3]);

  const textY = useTransform(scrollY, [0, 600], [0, 50]);
  const textOpacity = useTransform(scrollY, [0, 520], [1, 0.25]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen w-full flex flex-col justify-between pt-24 pb-4 px-6 sm:px-10 lg:px-[6vw] 2xl:px-[7vw] overflow-hidden select-none bg-[#05070b]"
    >
      {/* Background ambient lighting — layered for celestial depth */}
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(#ffffff07_1px,transparent_1px)] [background-size:32px_32px] opacity-70" />
      <div className="pointer-events-none absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[650px] bg-cyan-600/[0.05] blur-[200px] rounded-full" />
      <div className="pointer-events-none absolute top-1/2 right-1/4 w-[750px] h-[600px] bg-violet-600/[0.06] blur-[190px] rounded-full" />
      <div className="pointer-events-none absolute bottom-1/4 left-1/2 w-[550px] h-[400px] bg-cyan-500/[0.03] blur-[150px] rounded-full" />

      {/* 1: Eyebrow appears */}
      <div className="w-full pt-2 z-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="inline-flex items-center gap-2.5 py-1 px-3.5 rounded-full border border-white/[0.08] bg-[#080c12]/80 backdrop-blur-md"
        >
          <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-[11px] font-mono tracking-[0.22em] uppercase text-cyan-300">
            DATA ANALYST MARKET INTELLIGENCE
          </span>
        </motion.div>
      </div>

      {/* Main Full-Bleed 3-Column Hero Grid: Left ~46% / Center ~44% / Right ~10% */}
      <div className="w-full my-auto py-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10">
        {/* LEFT COLUMN: 5-Line Editorial Typography & CTAs (~46%) */}
        <motion.div
          style={{ y: textY, opacity: textOpacity }}
          className="lg:col-span-6 xl:col-span-5 flex flex-col justify-center"
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col tracking-[-0.04em] font-extrabold text-white"
          >
            {/* 2: DECODE */}
            <motion.div variants={lineVariants} className="overflow-hidden">
              <span className="block text-[clamp(3.8rem,7.5vw,8.5rem)] leading-[0.92] text-[#f5f7fa]">
                DECODE
              </span>
            </motion.div>

            {/* 3: THE DATA */}
            <motion.div variants={lineVariants} className="overflow-hidden">
              <span className="block text-[clamp(3.8rem,7.5vw,8.5rem)] leading-[0.92] text-zinc-400">
                THE DATA
              </span>
            </motion.div>

            {/* 4: ANALYST with cyan/violet shimmer */}
            <motion.div variants={lineVariants} className="overflow-hidden">
              <span className="block text-[clamp(3.8rem,7.5vw,8.5rem)] leading-[0.92]">
                <span
                  className="bg-gradient-to-r from-cyan-300 via-white to-violet-400 bg-clip-text text-transparent"
                  style={{
                    backgroundSize: '200% auto',
                    animation: 'shimmer 3.8s linear infinite',
                  }}
                >
                  ANALYST
                </span>
              </span>
            </motion.div>

            {/* 5: JOB */}
            <motion.div variants={lineVariants} className="overflow-hidden">
              <span className="block text-[clamp(3.8rem,7.5vw,8.5rem)] leading-[0.92] text-zinc-400">
                JOB
              </span>
            </motion.div>

            {/* 6: MARKET. */}
            <motion.div variants={lineVariants} className="overflow-hidden">
              <span className="block text-[clamp(3.8rem,7.5vw,8.5rem)] leading-[0.92] text-[#f5f7fa]">
                MARKET.
              </span>
            </motion.div>
          </motion.div>

          {/* 7: Description slides/fades upward */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.55 }}
            className="mt-6 text-base sm:text-lg text-zinc-400 font-normal leading-relaxed max-w-xl"
          >
            Real market insights. Skill demand. Salary signals. AI-powered job analysis.
            Make smarter career decisions with data.
          </motion.p>

          {/* 8: CTA appears */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-8 flex flex-wrap items-center gap-5"
          >
            <button
              onClick={() => scrollTo('market')}
              className="group inline-flex items-center gap-2 text-sm font-medium text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
            >
              <span>Explore the market</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => scrollTo('ai')}
              className="inline-flex items-center gap-2.5 text-xs font-mono uppercase tracking-wider text-zinc-300 hover:text-white px-4 py-2.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] transition-all cursor-pointer"
            >
              <div className="w-5 h-5 rounded-full bg-cyan-400/20 flex items-center justify-center text-cyan-400">
                <Play size={10} className="translate-x-0.5 fill-cyan-400" />
              </div>
              <span>See how it works</span>
            </button>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.95 }}
            className="mt-12 hidden sm:flex items-center gap-3 text-[11px] font-mono tracking-[0.2em] uppercase text-zinc-500"
          >
            <div className="w-px h-6 bg-gradient-to-b from-cyan-400 to-transparent" />
            <span>SCROLL TO EXPLORE</span>
          </motion.div>
        </motion.div>

        {/* 9 & 10: Monumental 3D Earth Globe (~44% desktop width) */}
        <motion.div
          style={{ y: globeY, scale: globeScale, opacity: globeOpacity }}
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 xl:col-span-6 relative flex items-center justify-center w-full"
        >
          <EarthGlobe />
        </motion.div>

        {/* 11: FAR RIGHT COLUMN: Stats reveal sequentially (~10%) */}
        <div className="lg:col-span-1 flex flex-col justify-between h-full py-4 space-y-10 lg:pl-2">
          <motion.div
            variants={statsVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            <motion.div variants={statItemVariants}>
              <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-none">
                1,000+
              </div>
              <div className="text-[10px] font-mono tracking-widest uppercase text-zinc-500 mt-1">
                JOBS ANALYZED
              </div>
            </motion.div>

            <motion.div variants={statItemVariants}>
              <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-none">
                20+
              </div>
              <div className="text-[10px] font-mono tracking-widest uppercase text-zinc-500 mt-1">
                KEY SKILLS
              </div>
            </motion.div>

            <motion.div variants={statItemVariants}>
              <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-none">
                6
              </div>
              <div className="text-[10px] font-mono tracking-widest uppercase text-zinc-500 mt-1">
                MARKET INSIGHTS
              </div>
            </motion.div>

            <motion.div variants={statItemVariants}>
              <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-cyan-400 leading-none">
                ∞
              </div>
              <div className="text-[10px] font-mono tracking-widest uppercase text-zinc-500 mt-1">
                POSSIBILITIES
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="pt-6 border-t border-white/[0.06] text-[10px] font-mono uppercase tracking-widest text-zinc-500 leading-relaxed hidden lg:block"
          >
            <div>SAME DATA.</div>
            <div className="text-zinc-400">A CLEARER PICTURE.</div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Ticker */}
      <div className="w-full pt-1 z-10">
        <div className="flex items-center justify-between pb-2 text-[10px] font-mono tracking-wider text-zinc-500 uppercase">
          <span className="flex items-center gap-2">
            <Sparkles size={11} className="text-cyan-400" />
            LIVE MARKET PULSE
          </span>
          <span className="text-zinc-600">VERIFIED CORPUS</span>
        </div>
        <Ticker items={TICKER_ITEMS} speed={42} />
      </div>
    </section>
  );
}
