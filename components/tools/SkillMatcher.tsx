'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Sparkles, Check, Info, ArrowUpRight } from 'lucide-react';
import { evaluateSkillCoverage, SKILL_CATEGORIES } from '@/lib/analytics';
import { formatSalary } from '@/lib/utils';
import { useHasMounted } from '@/hooks/useHasMounted';
import SectionLabel from '@/components/ui/SectionLabel';
import Reveal from '@/components/ui/Reveal';

const tierBadgeStyles: Record<string, string> = {
  Entry: 'text-zinc-400 border-zinc-700 bg-zinc-900/50',
  Mid: 'text-cyan-400 border-cyan-500/30 bg-cyan-950/30',
  Senior: 'text-violet-400 border-violet-500/30 bg-violet-950/30',
  Lead: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/30',
};

// Fixed radius & exact circumference rounded to 2 decimal places
const GAUGE_RADIUS = 64;
const GAUGE_CIRCUMFERENCE = 402.12;

export default function SkillMatcher() {
  const hasMounted = useHasMounted();
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['SQL', 'Python']);

  const toggle = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const result = useMemo(() => evaluateSkillCoverage(selectedSkills), [selectedSkills]);

  // Exact rounded strokeDashoffset
  const coverageRatio = Math.min(Math.max(result.coveragePercent, 0), 100) / 100;
  const strokeDashoffset = Math.round((GAUGE_CIRCUMFERENCE - coverageRatio * GAUGE_CIRCUMFERENCE) * 100) / 100;

  const statusLabel =
    result.coveragePercent >= 65 ? 'STRONG' : result.coveragePercent >= 30 ? 'MODERATE' : 'EMERGING';

  return (
    <section id="coverage" className="w-full py-28 px-6 sm:px-10 lg:px-[6vw] 2xl:px-[7vw] border-t border-white/[0.06] bg-[#05070b]">
      {/* Anchor for backward compatibility */}
      <span id="matcher" className="relative -top-24" />

      <div className="w-full">
        {/* Section Label */}
        <Reveal direction="up">
          <SectionLabel index="04" title="YOUR POSITION" tag="MARKET COVERAGE ENGINE" />
        </Reveal>

        {/* Headline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start mt-6">
          <div className="lg:col-span-8">
            <Reveal direction="up" delay={0.1}>
              <h2 className="text-[clamp(2.4rem,5.2vw,5.2rem)] font-extrabold tracking-[-0.03em] leading-[0.98] text-white">
                WHERE DO <br />
                <span className="text-zinc-500">YOU STAND?</span>
              </h2>
            </Reveal>
          </div>

          <div className="lg:col-span-4 pt-2">
            <Reveal direction="up" delay={0.2}>
              <p className="text-base text-zinc-400 leading-relaxed">
                Select the tools and languages currently in your arsenal. We compute your instant
                coverage index across 1,000 real job requisitions and predict your highest-ROI next move.
              </p>
            </Reveal>
          </div>
        </div>

        {/* Main Interactive Grid */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Skill Selector Categorized (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] text-xs font-mono text-zinc-500 uppercase">
              <span>TOOLSTACK SELECTION</span>
              <span>{selectedSkills.length} ACTIVE TOOLS</span>
            </div>

            {Object.entries(SKILL_CATEGORIES).map(([category, skills]) => (
              <div key={category}>
                <div className="text-[11px] font-mono tracking-widest text-zinc-400 uppercase mb-3">
                  {category}
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {skills.map((skill) => {
                    const isActive = selectedSkills.includes(skill);
                    return (
                      <button
                        key={skill}
                        id={`matcher-skill-${skill}`}
                        onClick={() => toggle(skill)}
                        className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-mono uppercase tracking-wider rounded border transition-all cursor-pointer ${
                          isActive
                            ? 'bg-zinc-900 border-cyan-400 text-white shadow-sm'
                            : 'bg-[#0a0a0c] border-white/[0.08] text-zinc-400 hover:border-white/20 hover:text-zinc-200'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full transition-colors ${
                            isActive ? 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]' : 'bg-zinc-600'
                          }`}
                        />
                        <span>{skill}</span>
                        {isActive && <Check size={12} className="text-cyan-400 ml-0.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {selectedSkills.length === 0 && (
              <div className="p-4 rounded border border-cyan-500/20 bg-cyan-950/10 text-xs font-mono text-cyan-300 flex items-center gap-2">
                <Info size={14} />
                <span>Select your current skills above to calculate live market reach.</span>
              </div>
            )}
          </div>

          {/* Results Telemetry Panel (5 cols) */}
          <div className="lg:col-span-5 bg-[#0a0a0c] border border-white/[0.06] p-8 sm:p-10 rounded-lg shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.06] text-xs font-mono text-zinc-500">
              <span className="uppercase">COVERAGE TELEMETRY</span>
              <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${tierBadgeStyles[result.salaryTier]}`}>
                TIER: {result.salaryTier}
              </span>
            </div>

            {/* Circular Gauge + Big Percentage */}
            <div className="py-8 flex flex-col sm:flex-row items-center justify-center gap-8 text-center sm:text-left">
              {/* Circular SVG Gauge */}
              <div className="relative w-36 h-36 flex-shrink-0 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
                  <circle
                    cx="80"
                    cy="80"
                    r={GAUGE_RADIUS}
                    stroke="rgba(255,255,255,0.06)"
                    strokeWidth="10"
                    fill="transparent"
                  />
                  <motion.circle
                    cx="80"
                    cy="80"
                    r={GAUGE_RADIUS}
                    stroke="url(#coverageGaugeGrad)"
                    strokeWidth="10"
                    strokeDasharray={GAUGE_CIRCUMFERENCE}
                    initial={{ strokeDashoffset: GAUGE_CIRCUMFERENCE }}
                    animate={{ strokeDashoffset: hasMounted ? strokeDashoffset : GAUGE_CIRCUMFERENCE }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                  <defs>
                    <linearGradient id="coverageGaugeGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#06b6d4" />
                      <stop offset="60%" stopColor="#22d3ee" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <motion.span
                    key={result.coveragePercent}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-3xl font-extrabold text-white tracking-tight leading-none"
                  >
                    {hasMounted ? `${result.coveragePercent}%` : '—'}
                  </motion.span>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase mt-1">
                    {statusLabel}
                  </span>
                </div>
              </div>

              <div>
                <div className="text-[11px] font-mono uppercase text-zinc-500">
                  MARKET QUALIFICATION
                </div>
                <div className="text-2xl font-bold text-white mt-1">
                  {hasMounted ? result.matchedJobs.toLocaleString() : '0'}{' '}
                  <span className="text-zinc-500 text-sm font-normal">/ {hasMounted ? result.totalJobs.toLocaleString() : '1,000'}</span>
                </div>
                <p className="text-xs text-zinc-400 mt-1 font-mono">
                  Full skill match across all selected requisitions
                </p>
              </div>
            </div>

            {/* Compensation & Strategic Recommendation Rows */}
            <div className="space-y-4 pt-6 border-t border-white/[0.06]">
              <div className="bg-white/[0.02] border border-white/[0.04] p-4 rounded">
                <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-1">
                  <span>BENCHMARK SALARY RANGE</span>
                  <DollarSign size={14} className="text-emerald-400" />
                </div>
                <div className="text-xl sm:text-2xl font-extrabold text-white font-mono">
                  {result.matchedJobs > 0 ? (
                    <>
                      {formatSalary(result.estimatedSalaryMin)} – {formatSalary(result.estimatedSalaryMax)}
                    </>
                  ) : (
                    <span className="text-sm font-normal text-zinc-500">Select skills for salary estimate</span>
                  )}
                </div>
              </div>

              {result.nextRecommendedSkill && (
                <div className="bg-white/[0.02] border border-cyan-500/20 p-4 rounded">
                  <div className="flex items-center justify-between text-xs font-mono text-cyan-400 mb-1">
                    <span className="flex items-center gap-1.5">
                      <Sparkles size={12} />
                      HIGHEST-ROI NEXT TOOL
                    </span>
                    <ArrowUpRight size={14} />
                  </div>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="text-xl font-bold text-white">
                      {result.nextRecommendedSkill}
                    </span>
                    <span className="text-xs font-mono text-emerald-400 font-semibold">
                      +{result.nextSkillROI}% REACH EXPANSION
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Methodology Note */}
            <div className="mt-6 pt-4 border-t border-white/[0.06] text-[11px] font-mono text-zinc-500 leading-relaxed">
              METHODOLOGY: Coverage Index = (Matching Listings / Total Benchmark Listings) × 100.
              Matching listings contain all selected skills simultaneously.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
