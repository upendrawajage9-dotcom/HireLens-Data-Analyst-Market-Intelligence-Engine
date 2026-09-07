'use client';

import { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingUp, ArrowUpRight } from 'lucide-react';
import { getSkillCoOccurrence } from '@/lib/analytics';
import { useHasMounted } from '@/hooks/useHasMounted';
import SectionLabel from '@/components/ui/SectionLabel';
import Reveal from '@/components/ui/Reveal';

const PRIMARY_SKILLS = ['SQL', 'Python', 'Power BI', 'Tableau', 'Snowflake', 'dbt', 'BigQuery', 'Excel'];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number | string; color?: string }>;
  label?: string;
}

function EditorialRadarTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-[#0c0c0e] border border-white/10 px-3.5 py-2.5 rounded shadow-2xl text-xs font-mono">
      <p className="font-semibold text-white mb-1.5">{label}</p>
      {payload.map((entry, idx) => (
        <div key={idx} className="flex items-center justify-between gap-4 text-zinc-300 py-0.5">
          <span className="flex items-center gap-1.5 text-zinc-400">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: entry.color }} />
            {entry.name}
          </span>
          <span className="font-mono font-bold text-white">
            {typeof entry.value === 'number' ? entry.value.toFixed(1) : entry.value}%
          </span>
        </div>
      ))}
    </div>
  );
}

export default function SynergyMatrix() {
  const hasMounted = useHasMounted();
  const [selected, setSelected] = useState('SQL');

  const pairs = useMemo(() => getSkillCoOccurrence(selected), [selected]);

  const radarData = useMemo(() => {
    return pairs.slice(0, 8).map((p) => ({
      skill: p.secondarySkill,
      frequency: p.frequency,
      premium: Math.max(0, p.salaryPremium),
    }));
  }, [pairs]);

  // Track viewport for Radar Chart center-outward draw (reversible)
  const radarContainerRef = useRef<HTMLDivElement>(null);
  const isRadarInView = useInView(radarContainerRef, { once: false, margin: '-60px' });

  return (
    <section id="synergy" className="w-full py-28 px-6 sm:px-10 lg:px-[6vw] 2xl:px-[7vw] border-t border-white/[0.06] bg-[#05070b]">
      <div className="w-full">
        {/* Section Label */}
        <Reveal direction="up">
          <SectionLabel index="03" title="SKILL SYNERGY" tag="CO-OCCURRENCE CLUSTERS" />
        </Reveal>

        {/* Headline & Narrative */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start mt-6">
          <div className="lg:col-span-8">
            <Reveal direction="up" delay={0.1}>
              <h2 className="text-[clamp(2.4rem,5.2vw,5.2rem)] font-extrabold tracking-[-0.03em] leading-[0.98] text-white">
                ONE SKILL <br />
                <span className="text-zinc-500">IS NEVER ENOUGH.</span>
              </h2>
            </Reveal>
          </div>

          <div className="lg:col-span-4 pt-2">
            <Reveal direction="up" delay={0.2}>
              <p className="text-base text-zinc-400 leading-relaxed">
                See which tools consistently appear together in real requisitions — and how stacking specific skills
                exponentially multiplies candidate market value.
              </p>
            </Reveal>
          </div>
        </div>

        {/* Interactive Primary Skill Selector Pills */}
        <div className="mt-14 pt-6 border-t border-white/[0.06]">
          <div className="text-[11px] font-mono tracking-widest text-zinc-500 uppercase mb-4">
            SELECT ANCHOR SKILL:
          </div>
          <div className="flex flex-wrap gap-2.5">
            {PRIMARY_SKILLS.map((skill) => {
              const isSelected = selected === skill;
              return (
                <button
                  key={skill}
                  id={`synergy-skill-${skill}`}
                  onClick={() => setSelected(skill)}
                  className={`relative px-4 py-2 text-xs font-mono uppercase tracking-wider rounded border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-zinc-900 border-cyan-400 text-white shadow-sm'
                      : 'bg-[#0a0a0c] border-white/[0.08] text-zinc-400 hover:text-zinc-200 hover:border-white/20'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span
                      className={`w-1.5 h-1.5 rounded-full transition-colors ${
                        isSelected ? 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]' : 'bg-zinc-600'
                      }`}
                    />
                    {skill}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Synergy Rows and Radar Web */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Pair Rows (Editorial Rows with smooth layout animations) */}
          <div className="lg:col-span-7 divide-y divide-white/[0.06] border-y border-white/[0.06]">
            <AnimatePresence mode="popLayout">
              {pairs.slice(0, 7).map((pair, idx) => (
                <motion.div
                  key={`${selected}-${pair.secondarySkill}`}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3, delay: idx * 0.035 }}
                  className="py-4.5 flex items-center justify-between gap-4 group hover:bg-white/[0.01] transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-mono text-zinc-600 w-5">
                      #{String(idx + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base sm:text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                          {selected} + {pair.secondarySkill}
                        </span>
                      </div>
                      <div className="text-xs font-mono text-zinc-500 mt-0.5">
                        {pair.coCount} co-occurrences · Avg ${Math.round(pair.avgSalaryWithBoth / 1000)}k
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 sm:gap-6 text-right font-mono">
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-zinc-200">
                        {pair.frequency}%
                      </div>
                      <div className="text-[10px] text-zinc-500 uppercase">CO-OCCURRENCE</div>
                    </div>

                    <div className="min-w-[75px]">
                      {pair.salaryPremium > 0 ? (
                        <div className="text-xs sm:text-sm font-bold text-emerald-400 flex items-center justify-end gap-0.5">
                          <TrendingUp size={12} />
                          +{pair.salaryPremium}%
                        </div>
                      ) : (
                        <div className="text-xs text-zinc-500">Neutral</div>
                      )}
                      <div className="text-[10px] text-zinc-500 uppercase">PREMIUM</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Radar Chart (Animates from center outward when in view) */}
          <div ref={radarContainerRef} className="lg:col-span-5 bg-[#0a0a0c] border border-white/[0.06] p-6 rounded-lg shadow-2xl">
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-white/[0.06] text-xs font-mono text-zinc-500">
              <span className="uppercase">MULTI-SKILL TOPOLOGY ({selected})</span>
              <span className="text-cyan-400 flex items-center gap-1">
                <ArrowUpRight size={12} /> RADAR WEB
              </span>
            </div>

            {!hasMounted ? (
              <div className="h-[280px] flex items-center justify-center text-xs font-mono text-zinc-600 animate-pulse">
                INITIALIZING RADAR WEB...
              </div>
            ) : radarData.length > 0 ? (
              <div className="h-[290px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="72%">
                    <PolarGrid stroke="rgba(255,255,255,0.06)" />
                    <PolarAngleAxis
                      dataKey="skill"
                      tick={{ fill: '#a1a1aa', fontSize: 11, fontFamily: 'monospace' }}
                    />
                    <Radar
                      name="Frequency %"
                      dataKey="frequency"
                      stroke="#06b6d4"
                      fill="#06b6d4"
                      fillOpacity={0.18}
                      strokeWidth={1.5}
                      isAnimationActive={isRadarInView}
                      animationDuration={1400}
                    />
                    <Radar
                      name="Salary Premium %"
                      dataKey="premium"
                      stroke="#8b5cf6"
                      fill="#8b5cf6"
                      fillOpacity={0.15}
                      strokeWidth={1.5}
                      isAnimationActive={isRadarInView}
                      animationDuration={1400}
                    />
                    <Tooltip content={<EditorialRadarTooltip />} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-zinc-600 text-xs font-mono">
                INSUFFICIENT RADAR PROFILE
              </div>
            )}

            <div className="flex items-center justify-center gap-6 mt-3 pt-3 border-t border-white/[0.06] text-xs font-mono text-zinc-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-0.5 bg-cyan-400 inline-block" /> Co-occurrence %
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-0.5 bg-violet-400 inline-block" /> Salary premium %
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
