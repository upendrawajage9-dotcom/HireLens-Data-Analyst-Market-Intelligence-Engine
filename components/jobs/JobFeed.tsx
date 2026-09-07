'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, ArrowUpRight, X } from 'lucide-react';
import { MOCK_JOBS } from '@/lib/mockJobData';
import { formatSalary } from '@/lib/utils';
import type { JobPosting } from '@/types/job';
import JobInspectorModal from './JobInspectorModal';
import SectionLabel from '@/components/ui/SectionLabel';
import Reveal from '@/components/ui/Reveal';

const EXPERIENCE_LEVELS = ['Entry', 'Mid', 'Senior', 'Lead'];
const WORK_TYPES = ['Remote', 'Hybrid', 'On-site'];
const SALARY_RANGES = [
  { label: 'All Salaries', min: 0, max: Infinity },
  { label: '<$80K', min: 0, max: 80000 },
  { label: '$80K–$120K', min: 80000, max: 120000 },
  { label: '$120K–$160K', min: 120000, max: 160000 },
  { label: '$160K+', min: 160000, max: Infinity },
];

const USD_PER_INR = 0.012;
function toUSD(amount: number, currency: 'USD' | 'INR') {
  return currency === 'INR' ? amount * USD_PER_INR : amount;
}

const PAGE_SIZE = 12;

export default function JobFeed() {
  const [query, setQuery] = useState('');
  const [levels, setLevels] = useState<string[]>([]);
  const [workTypes, setWorkTypes] = useState<string[]>([]);
  const [salaryRange, setSalaryRange] = useState(SALARY_RANGES[0]);
  const [page, setPage] = useState(1);
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  function toggleFilter<T>(arr: T[], setArr: (v: T[]) => void, val: T) {
    setArr(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);
    setPage(1);
  }

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return MOCK_JOBS.filter((job) => {
      if (q) {
        const haystack = `${job.title} ${job.company} ${job.requiredSkills.join(' ')} ${job.location}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (levels.length > 0 && !levels.includes(job.experienceLevel)) return false;
      if (workTypes.length > 0 && !workTypes.includes(job.workType)) return false;
      if (salaryRange.label !== 'All Salaries') {
        const midUSD = toUSD((job.salaryMin + job.salaryMax) / 2, job.currency);
        if (midUSD < salaryRange.min || midUSD > salaryRange.max) return false;
      }
      return true;
    });
  }, [query, levels, workTypes, salaryRange]);

  const paginated = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = paginated.length < filtered.length;

  return (
    <section id="jobs" className="w-full py-28 px-6 sm:px-10 lg:px-[6vw] 2xl:px-[7vw] border-t border-white/[0.06] bg-[#05070b]">
      <div className="w-full">
        {/* Section Label */}
        <Reveal direction="up">
          <SectionLabel index="06" title="LIVE JOB MARKET" tag="ACTIVE REQUISITIONS" />
        </Reveal>

        {/* Headline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start mt-6 mb-12">
          <div className="lg:col-span-8">
            <Reveal direction="up" delay={0.1}>
              <h2 className="text-[clamp(2.4rem,5.2vw,5.2rem)] font-extrabold tracking-[-0.03em] leading-[0.98] text-white">
                REAL LISTINGS. <br />
                <span className="text-zinc-500">REAL SIGNALS.</span>
              </h2>
            </Reveal>
          </div>

          <div className="lg:col-span-4 pt-2">
            <Reveal direction="up" delay={0.2}>
              <p className="text-base text-zinc-400 leading-relaxed">
                Explore real benchmark listings and examine exact required skillstacks.
                Click any position to deconstruct its hiring signals with AI intelligence.
              </p>
            </Reveal>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="space-y-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
              <input
                id="job-search"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Search by role title, company, toolstack, or city..."
                className="w-full bg-[#0a0a0c] border border-white/[0.08] focus:border-cyan-500/50 rounded-lg pl-11 pr-4 py-3.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none transition-all font-mono"
              />
              {query && (
                <button
                  onClick={() => {
                    setQuery('');
                    setPage(1);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <button
              onClick={() => setShowFilters((v) => !v)}
              className={`inline-flex items-center gap-2 px-5 py-3 rounded-lg border font-mono text-xs uppercase tracking-wider transition-all cursor-pointer ${
                showFilters || levels.length > 0 || workTypes.length > 0 || salaryRange.label !== 'All Salaries'
                  ? 'bg-zinc-900 border-cyan-400 text-white'
                  : 'bg-[#0a0a0c] border-white/[0.08] text-zinc-400 hover:text-white'
              }`}
            >
              <SlidersHorizontal size={14} />
              <span>Filters</span>
              {(levels.length + workTypes.length + (salaryRange.label !== 'All Salaries' ? 1 : 0)) > 0 && (
                <span className="w-5 h-5 rounded-full bg-cyan-400 text-zinc-950 font-bold flex items-center justify-center text-[10px]">
                  {levels.length + workTypes.length + (salaryRange.label !== 'All Salaries' ? 1 : 0)}
                </span>
              )}
            </button>
          </div>

          {/* Expandable Filter Controls */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden bg-[#0a0a0c] border border-white/[0.06] rounded-lg p-6 space-y-6"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {/* Experience Level */}
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-2.5">
                      SENIORITY LEVEL
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {EXPERIENCE_LEVELS.map((lvl) => (
                        <button
                          key={lvl}
                          onClick={() => toggleFilter(levels, setLevels, lvl)}
                          className={`px-3 py-1.5 text-xs font-mono rounded border transition-all cursor-pointer ${
                            levels.includes(lvl)
                              ? 'bg-zinc-800 border-violet-400 text-violet-200'
                              : 'bg-white/[0.02] border-white/[0.06] text-zinc-400 hover:text-zinc-200'
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Work Type */}
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-2.5">
                      WORK ARRANGEMENT
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {WORK_TYPES.map((wt) => (
                        <button
                          key={wt}
                          onClick={() => toggleFilter(workTypes, setWorkTypes, wt)}
                          className={`px-3 py-1.5 text-xs font-mono rounded border transition-all cursor-pointer ${
                            workTypes.includes(wt)
                              ? 'bg-zinc-800 border-cyan-400 text-cyan-200'
                              : 'bg-white/[0.02] border-white/[0.06] text-zinc-400 hover:text-zinc-200'
                          }`}
                        >
                          {wt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Salary Filter */}
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-2.5">
                      SALARY RANGE (USD)
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {SALARY_RANGES.map((sr) => (
                        <button
                          key={sr.label}
                          onClick={() => {
                            setSalaryRange(sr);
                            setPage(1);
                          }}
                          className={`px-3 py-1.5 text-xs font-mono rounded border transition-all cursor-pointer ${
                            salaryRange.label === sr.label
                              ? 'bg-zinc-800 border-emerald-400 text-emerald-200'
                              : 'bg-white/[0.02] border-white/[0.06] text-zinc-400 hover:text-zinc-200'
                          }`}
                        >
                          {sr.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Telemetry Counter */}
          <div className="flex items-center justify-between text-xs font-mono text-zinc-500 pt-1">
            <span>
              SHOWING <strong className="text-white">{filtered.length}</strong> OF {MOCK_JOBS.length} BENCHMARK ROLES
            </span>
            {(levels.length + workTypes.length + (salaryRange.label !== 'All Salaries' ? 1 : 0)) > 0 && (
              <button
                onClick={() => {
                  setLevels([]);
                  setWorkTypes([]);
                  setSalaryRange(SALARY_RANGES[0]);
                  setPage(1);
                }}
                className="text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
              >
                Reset active filters
              </button>
            )}
          </div>
        </div>

        {/* Focus list with group-hover dimming and border illumination */}
        <div className="border-t border-white/[0.08] divide-y divide-white/[0.06] group/list">
          {paginated.map((job) => (
            <div
              key={job.id}
              onClick={() => setSelectedJob(job)}
              className="group py-6 px-4 -mx-4 rounded hover:bg-white/[0.02] group-hover/list:opacity-75 hover:!opacity-100 transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-l-2 hover:border-cyan-400"
            >
              {/* Left Details */}
              <div className="md:w-5/12 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-mono uppercase tracking-widest text-zinc-400 group-hover:text-cyan-300 transition-colors">
                    {job.company}
                  </span>
                  <span className="text-zinc-700">·</span>
                  <span className="text-xs font-mono text-zinc-500">
                    {job.location} ({job.country})
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-cyan-200 transition-colors truncate">
                  {job.title}
                </h3>
              </div>

              {/* Center Skill Tags */}
              <div className="md:w-4/12 flex flex-wrap gap-1.5">
                {job.requiredSkills.slice(0, 4).map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-0.5 rounded bg-white/[0.03] border border-white/[0.06] text-[11px] font-mono text-zinc-400 group-hover:border-white/20 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
                {job.requiredSkills.length > 4 && (
                  <span className="px-1.5 py-0.5 text-[10px] font-mono text-zinc-600">
                    +{job.requiredSkills.length - 4}
                  </span>
                )}
              </div>

              {/* Right Salary & Inspect Trigger */}
              <div className="md:w-3/12 flex items-center justify-between md:justify-end gap-6 text-right">
                <div>
                  <div className="text-sm sm:text-base font-bold text-white font-mono">
                    {formatSalary(job.salaryMin, job.currency)} – {formatSalary(job.salaryMax, job.currency)}
                  </div>
                  <div className="text-[11px] font-mono text-zinc-500 flex items-center gap-2 justify-end">
                    <span>{job.workType}</span>
                    <span>·</span>
                    <span>{job.experienceLevel}</span>
                  </div>
                </div>

                <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:border-cyan-400/50 group-hover:bg-cyan-950/20 transition-all flex-shrink-0">
                  <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="py-20 text-center space-y-3 font-mono">
              <div className="text-base text-zinc-300 uppercase tracking-widest font-bold">
                NO ROLES FOUND
              </div>
              <p className="text-xs text-zinc-500">
                Try clearing your search keyword or relaxing filter thresholds.
              </p>
              <button
                onClick={() => {
                  setQuery('');
                  setLevels([]);
                  setWorkTypes([]);
                  setSalaryRange(SALARY_RANGES[0]);
                  setPage(1);
                }}
                className="mt-2 text-xs text-cyan-400 underline cursor-pointer"
              >
                Clear all search parameters
              </button>
            </div>
          )}
        </div>

        {/* Load More Pagination */}
        {hasMore && (
          <div className="mt-12 text-center">
            <button
              onClick={() => setPage((p) => p + 1)}
              className="px-8 py-3.5 rounded border border-white/10 hover:border-cyan-400/40 bg-[#0a0a0c] hover:bg-zinc-900 font-mono text-xs uppercase tracking-wider text-zinc-200 hover:text-white transition-all cursor-pointer shadow-lg shadow-black/40"
            >
              Load More Requisitions ({filtered.length - paginated.length} remaining)
            </button>
          </div>
        )}
      </div>

      {/* Modal Inspector */}
      {selectedJob && (
        <JobInspectorModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
        />
      )}
    </section>
  );
}
