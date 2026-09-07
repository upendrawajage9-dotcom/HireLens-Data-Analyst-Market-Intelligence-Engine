'use client';

import { useMemo, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { getSkillDemand, getWorkTypeDistribution, getSalaryByExperience } from '@/lib/analytics';
import Reveal from '@/components/ui/Reveal';
import SectionLabel from '@/components/ui/SectionLabel';
import DrawLineChart from '@/components/ui/DrawLineChart';

export default function MarketVisualization() {
  const topSkills = useMemo(() => getSkillDemand().slice(0, 8), []);
  const workDist = useMemo(() => getWorkTypeDistribution(), []);
  const salaryExp = useMemo(() => getSalaryByExperience(), []);

  // Reversible viewport observers across all stories
  const story1Ref = useRef<HTMLDivElement>(null);
  const story2Ref = useRef<HTMLDivElement>(null);
  const story3Ref = useRef<HTMLDivElement>(null);

  const isStory1InView = useInView(story1Ref, { once: false, margin: '-60px' });
  const isStory2InView = useInView(story2Ref, { once: false, margin: '-60px' });
  const isStory3InView = useInView(story3Ref, { once: false, margin: '-60px' });

  return (
    <section id="visualizations" className="w-full py-28 px-6 sm:px-10 lg:px-[6vw] 2xl:px-[7vw] border-t border-white/[0.06] bg-[#05070b]">
      <div className="w-full space-y-32">

        {/* Section Header */}
        <Reveal>
          <SectionLabel index="01b" title="MARKET SIGNALS" tag="DATA STORIES" />
        </Reveal>

        {/* STORY 1: Skill Demand Sequential Growth Bar Chart */}
        <div ref={story1Ref} className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-5">
            <Reveal direction="up" delay={0.1}>
              <div className="text-[11px] font-mono tracking-[0.25em] uppercase text-cyan-400 mb-2">
                CRITICAL TOOLSTACK REQUIREMENT
              </div>
              <h3 className="text-[clamp(2.4rem,4.8vw,4.4rem)] font-extrabold tracking-tight text-white leading-[0.95]">
                SQL ISN'T <br />
                <span className="text-zinc-500">OPTIONAL.</span>
              </h3>
              <p className="mt-6 text-base text-zinc-400 leading-relaxed font-normal">
                Query language fluency remains the non-negotiable bedrock of analyst roles. Python follows
                rapidly for algorithmic modeling, while Power BI and Tableau dominate corporate visualization.
              </p>
              <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center gap-6 text-xs font-mono text-zinc-400">
                <div>
                  <span className="text-white font-bold text-base">79.1%</span>
                  <p className="text-zinc-600">SQL Frequency</p>
                </div>
                <div className="w-px h-6 bg-white/[0.06]" />
                <div>
                  <span className="text-white font-bold text-base">+22.4%</span>
                  <p className="text-zinc-600">Python Premium</p>
                </div>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-7 bg-[#080c12]/60 border border-white/[0.08] p-6 sm:p-8 rounded-xl backdrop-blur-sm shadow-2xl">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/[0.06] text-xs font-mono text-zinc-500">
              <span>SKILL DEMAND DENSITY (% OF 1,000 ROLES)</span>
              <span className="text-cyan-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                SEQUENTIAL REVEAL
              </span>
            </div>

            {/* Sequential Growing Horizontal Bar Stack */}
            <div className="space-y-4">
              {topSkills.map((item, idx) => {
                const delay = isStory1InView ? 0.15 + idx * 0.12 : 0;
                return (
                  <div key={item.skill} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-zinc-300 font-semibold">{item.skill}</span>
                      <span className="text-cyan-400 font-bold">{item.percentage}%</span>
                    </div>

                    <div className="w-full h-3 bg-white/[0.04] rounded-full overflow-hidden p-0.5 relative">
                      <motion.div
                        className="h-full rounded-full relative"
                        style={{
                          background: 'linear-gradient(90deg, #06d6f5 0%, #38bdf8 60%, #8b5cf6 100%)',
                          boxShadow: '0 0 12px rgba(6, 214, 245, 0.4)',
                        }}
                        initial={{ width: '0%' }}
                        animate={{ width: isStory1InView ? `${item.percentage}%` : '0%' }}
                        transition={{
                          duration: 0.85,
                          delay,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                      >
                        {/* Leading edge luminous pulse */}
                        <div className="absolute right-0 top-0 bottom-0 w-2 rounded-full bg-white shadow-[0_0_8px_#ffffff]" />
                      </motion.div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* STORY 2: Experience & Compensation Self-Drawing Line Graph (Reversible) */}
        <div ref={story2Ref} className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-7 order-2 lg:order-1 bg-[#080c12]/60 border border-white/[0.08] p-6 sm:p-8 rounded-xl backdrop-blur-sm shadow-2xl">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.06] text-xs font-mono text-zinc-500">
              <span>ESTIMATED SALARY CURVES BY EXPERIENCE (USD)</span>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-cyan-400">
                  <span className="w-2.5 h-0.5 bg-cyan-400 inline-block rounded" /> US Market
                </span>
                <span className="flex items-center gap-1.5 text-violet-400">
                  <span className="w-2.5 h-0.5 bg-violet-400 inline-block rounded" /> Global Remote
                </span>
              </div>
            </div>

            {/* Self-drawing reversible SVG line chart */}
            <DrawLineChart data={salaryExp} />
          </div>

          <div className="lg:col-span-5 order-1 lg:order-2">
            <Reveal direction="up" delay={0.1}>
              <div className="text-[11px] font-mono tracking-[0.25em] uppercase text-violet-400 mb-2">
                PROGRESSIVE COMPENSATION TRAJECTORY
              </div>
              <h3 className="text-[clamp(2.4rem,4.8vw,4.4rem)] font-extrabold tracking-tight text-white leading-[0.95]">
                EXPERIENCE <br />
                <span className="text-zinc-500">UNLOCKS EARNINGS.</span>
              </h3>
              <p className="mt-6 text-base text-zinc-400 leading-relaxed font-normal">
                Compensation reaches inflection points at 3–4 years (independent data modeling autonomy) and 7+ years
                (architecture, dbt pipeline governance, stakeholder leadership). Remote roles match 85–90% of US base.
              </p>
              <div className="mt-6 pt-4 border-t border-white/[0.06] text-xs font-mono text-zinc-500">
                PROGRESSION: 5 YOE yields approx +65% median compensation over entry-level benchmark.
              </div>
            </Reveal>
          </div>
        </div>

        {/* STORY 3: Workplace Distribution */}
        <div ref={story3Ref} className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-5">
            <Reveal direction="up" delay={0.1}>
              <div className="text-[11px] font-mono tracking-[0.25em] uppercase text-emerald-400 mb-2">
                WORKPLACE DISTRIBUTION
              </div>
              <h3 className="text-[clamp(2.4rem,4.8vw,4.4rem)] font-extrabold tracking-tight text-white leading-[0.95]">
                REMOTE <br />
                <span className="text-zinc-500">IS REAL.</span>
              </h3>
              <p className="mt-6 text-base text-zinc-400 leading-relaxed font-normal">
                Almost half of all verified analyst requisitions explicitly support remote or hybrid arrangements.
                Data intelligence represents one of the highest remote-density disciplines in corporate tech.
              </p>
              <div className="mt-6 space-y-3 pt-4 border-t border-white/[0.06]">
                {workDist.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-xs font-mono">
                    <span className="flex items-center gap-2 text-zinc-400">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.fill }} />
                      {item.name}
                    </span>
                    <span className="text-white font-semibold">{item.value} roles ({Math.round(item.value / 10)}%)</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-7 bg-[#080c12]/60 border border-white/[0.08] p-8 rounded-xl backdrop-blur-sm shadow-2xl flex flex-col items-center justify-center">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/[0.06] text-xs font-mono text-zinc-500 w-full">
              <span>WORK MODALITY RATIOS</span>
              <span>1,000 CORPUS BENCHMARK</span>
            </div>

            {/* Circular Modality Progress Bars */}
            <div className="w-full max-w-md py-4 space-y-4">
              {workDist.map((item, idx) => {
                const percent = Math.round((item.value / 1000) * 100);
                return (
                  <div key={item.name} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-zinc-300">{item.name}</span>
                      <span className="font-bold text-white">{percent}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-white/[0.04] rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: item.fill }}
                        initial={{ width: 0 }}
                        animate={{ width: isStory3InView ? `${percent}%` : 0 }}
                        transition={{
                          duration: 0.8,
                          delay: isStory3InView ? 0.2 + idx * 0.1 : 0,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
