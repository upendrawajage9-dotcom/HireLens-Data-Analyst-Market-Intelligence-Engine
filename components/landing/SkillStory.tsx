'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getSkillDemand } from '@/lib/analytics';
import SectionLabel from '@/components/ui/SectionLabel';
import Reveal from '@/components/ui/Reveal';
import { Sparkles, ShieldCheck } from 'lucide-react';

const DISPLAY_SKILLS = [
  { skill: 'SQL', percentage: 79.1 },
  { skill: 'Python', percentage: 76.0 },
  { skill: 'Power BI', percentage: 41.2 },
  { skill: 'Tableau', percentage: 31.6 },
  { skill: 'Snowflake', percentage: 20.7 },
  { skill: 'dbt', percentage: 15.3 },
  { skill: 'BigQuery', percentage: 12.1 },
  { skill: 'Excel', percentage: 9.8 },
];

export default function SkillStory() {
  const demandList = useMemo(() => getSkillDemand(), []);
  const [activeSkill, setActiveSkill] = useState<string>('SQL');

  const selectedData = useMemo(() => {
    return demandList.find((s) => s.skill.toLowerCase() === activeSkill.toLowerCase()) || demandList[0];
  }, [demandList, activeSkill]);

  const skillRank = useMemo(() => {
    const idx = DISPLAY_SKILLS.findIndex((s) => s.skill === activeSkill);
    return idx >= 0 ? idx + 1 : 1;
  }, [activeSkill]);

  return (
    <section id="skills" className="w-full py-28 px-6 sm:px-10 lg:px-[6vw] 2xl:px-[7vw] border-t border-white/[0.06] overflow-hidden bg-[#05070b]">
      <div className="w-full space-y-12">
        {/* Section Label */}
        <Reveal>
          <SectionLabel index="02" title="SKILLS" tag="TOOLSTACK DECOMPOSITION" />
        </Reveal>

        {/* Headline matching Reference Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div className="lg:col-span-8">
            <Reveal delay={0.1}>
              <h2 className="text-[clamp(2.4rem,5.2vw,5.2rem)] font-extrabold tracking-[-0.03em] leading-[0.96] text-white">
                THE MARKET <br />
                DOESN'T HIRE <br />
                TITLES. <br />
                IT HIRES <br />
                <span className="text-violet-400">SKILL STACKS.</span>
              </h2>
            </Reveal>
          </div>

          <div className="lg:col-span-4 pt-2">
            <Reveal delay={0.2}>
              <p className="text-base sm:text-lg text-zinc-400 leading-relaxed">
                A "Data Analyst" title covers vastly different realities. The market prices candidates by
                their specific combination of querying power, visualization craft, and cloud warehousing.
              </p>
            </Reveal>
          </div>
        </div>

        {/* Skill Selection Pills matching Reference Design */}
        <div className="pt-4">
          <div className="flex flex-wrap items-center gap-3">
            {DISPLAY_SKILLS.map((item) => {
              const isSelected = item.skill === activeSkill;
              return (
                <button
                  key={item.skill}
                  onClick={() => setActiveSkill(item.skill)}
                  className={`px-4 py-2.5 rounded-lg border transition-all text-center cursor-pointer flex flex-col items-center justify-center min-w-[96px] ${
                    isSelected
                      ? 'bg-[#080c12] border-cyan-400 text-white shadow-[0_0_16px_rgba(6,214,245,0.35)]'
                      : 'bg-[#080c12]/40 border-white/[0.08] text-zinc-400 hover:border-white/20 hover:text-white'
                  }`}
                >
                  <span className="text-xs sm:text-sm font-semibold tracking-tight">{item.skill}</span>
                  <span className={`text-[10px] font-mono mt-0.5 ${isSelected ? 'text-cyan-400 font-bold' : 'text-zinc-500'}`}>
                    {item.percentage}%
                  </span>
                </button>
              );
            })}
          </div>

          <p className="mt-4 text-xs font-mono text-zinc-500">
            Select a skill to see market insights, related skills, and salary impact.
          </p>
        </div>

        {/* Interactive Deep-Dive on Active Skill */}
        <div className="bg-[#080c12]/50 border border-white/[0.08] p-8 sm:p-12 rounded-xl backdrop-blur-sm">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSkill}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
            >
              <div className="lg:col-span-5 space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest">
                  <Sparkles size={14} />
                  <span>MARKET DEMAND RANK #{skillRank}</span>
                </div>
                <h3 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-none">
                  {selectedData.skill}
                </h3>
                <p className="text-sm sm:text-base text-zinc-400 leading-relaxed font-normal">
                  Demanded in <strong className="text-white font-semibold">{selectedData.percentage}%</strong> of all analyzed data analyst listings.
                  Proficiency in {selectedData.skill} serves as a gateway requirement across corporate analytics, finance intelligence, and product telemetry.
                </p>
              </div>

              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 lg:pt-0 lg:border-l lg:border-white/[0.06] lg:pl-10">
                <div className="bg-white/[0.02] border border-white/[0.04] p-5 rounded-lg">
                  <div className="text-[11px] font-mono uppercase text-zinc-500 mb-1">
                    DEMAND DENSITY
                  </div>
                  <div className="text-3xl font-extrabold text-white">
                    {selectedData.percentage}%
                  </div>
                  <div className="mt-2 text-xs text-zinc-500 font-mono">
                    {selectedData.count} of 1,000 roles
                  </div>
                </div>

                <div className="bg-white/[0.02] border border-white/[0.04] p-5 rounded-lg">
                  <div className="text-[11px] font-mono uppercase text-zinc-500 mb-1">
                    BENCHMARK SALARY
                  </div>
                  <div className="text-3xl font-extrabold text-cyan-400">
                    ${Math.round(selectedData.avgSalaryUSD / 1000)}K
                  </div>
                  <div className="mt-2 text-xs text-zinc-500 font-mono">
                    Midpoint benchmark
                  </div>
                </div>

                <div className="bg-white/[0.02] border border-white/[0.04] p-5 rounded-lg">
                  <div className="text-[11px] font-mono uppercase text-zinc-500 mb-1">
                    SIGNAL STATUS
                  </div>
                  <div className="text-lg font-bold text-emerald-400 flex items-center gap-1.5 mt-1">
                    <ShieldCheck size={18} />
                    {selectedData.percentage > 40 ? 'CORE STACK' : 'HIGH VALUE'}
                  </div>
                  <div className="mt-2 text-xs text-zinc-500 font-mono">
                    High synergy factor
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
