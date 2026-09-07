'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck, DollarSign, Briefcase, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import SectionLabel from '@/components/ui/SectionLabel';
import Reveal from '@/components/ui/Reveal';

const SAMPLE_JOBS = [
  {
    title: 'Senior FinTech Analyst',
    text: `We are looking for a Senior Data Analyst to join our Payment Risk analytics squad.
Requirements:
- 5+ years writing complex SQL queries (window functions, CTEs) on Snowflake.
- Strong Python skills for fraud pattern detection and automated anomaly alerting.
- Deep experience building mission-critical executive dashboards in Tableau.
- Understanding of financial transaction cycles, chargeback metrics, and A/B testing frameworks.
- Experience with dbt or modern data stacks is a major plus.
Estimated compensation: $130,000 - $160,000 USD with equity.`,
  },
  {
    title: 'Healthcare BI Specialist',
    text: `Leading HealthTech platform seeks an Analytics Specialist.
Key Responsibilities:
- Design clinical data models and build automated patient retention reports in Power BI.
- Query large-scale EHR datasets using BigQuery and PostgreSQL.
- Partner with clinical operations to identify workflow bottlenecks.
- Basic statistical modeling and R or Python proficiency preferred.
- HIPAA compliance experience highly desired.
Compensation range: $95,000 - $125,000 USD. Remote eligible.`,
  },
];

const ANALYSIS_STEPS = [
  'ANALYZING REQUISITION STRUCTURE...',
  'MATCHING CORE DATA TOOLSTACK...',
  'IDENTIFYING SKILL GAPS & DOMAIN SIGNALS...',
  'ESTIMATING COMPENSATION BENCHMARK...',
  'COMPLETING STRUCTURAL DECONSTRUCTION...',
];

interface AnalysisResult {
  hardSkills: string[];
  niceToHaveSkills: string[];
  businessDomain: string;
  executiveSummary: string;
  estimatedSalaryRange: {
    min: number;
    max: number;
    currency: string;
  };
  seniorityLevel: 'Entry' | 'Mid' | 'Senior' | 'Lead';
  isFallback?: boolean;
}

export default function AIExperience() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeJob = async (textToAnalyze?: string) => {
    const text = textToAnalyze || input;
    if (!text.trim()) return;

    setLoading(true);
    setError(null);
    setCurrentStepIndex(0);

    // Progressive step sequencing (approx 350ms per step, total ~1.4s)
    const stepInterval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < ANALYSIS_STEPS.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 320);

    try {
      const res = await fetch('/api/analyze-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription: text }),
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }

      // Ensure minimum sequence completion for smooth visual storytelling
      setTimeout(() => {
        clearInterval(stepInterval);
        setResult(data);
        setLoading(false);
      }, 1200);
    } catch (err: unknown) {
      clearInterval(stepInterval);
      const msg = err instanceof Error ? err.message : 'Analysis failed. Please try again.';
      setError(msg);
      setLoading(false);
    }
  };

  const loadSample = (sampleText: string) => {
    setInput(sampleText);
    analyzeJob(sampleText);
  };

  return (
    <section id="ai" className="w-full py-28 px-6 sm:px-10 lg:px-[6vw] 2xl:px-[7vw] border-t border-white/[0.06] bg-[#05070b]">
      <div className="w-full">
        {/* Section Label */}
        <Reveal direction="up">
          <SectionLabel index="05" title="AI INTELLIGENCE" tag="GEMINI DECONSTRUCTOR" />
        </Reveal>

        {/* Headline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start mt-6">
          <div className="lg:col-span-8">
            <Reveal direction="up" delay={0.1}>
              <h2 className="text-[clamp(2.4rem,5.2vw,5.2rem)] font-extrabold tracking-[-0.03em] leading-[0.98] text-white">
                DON'T JUST READ THE JOB. <br />
                <span className="text-zinc-500">DECODE IT.</span>
              </h2>
            </Reveal>
          </div>

          <div className="lg:col-span-4 pt-2">
            <Reveal direction="up" delay={0.2}>
              <p className="text-base text-zinc-400 leading-relaxed">
                Job descriptions hide real expectations behind corporate fluff. Our AI deconstructs
                any posting into strict hard requirements, expected seniority, domain signals, and compensation bands.
              </p>
            </Reveal>
          </div>
        </div>

        {/* Main AI Workspace Grid */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Input Side (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-500 pb-2 border-b border-white/[0.06]">
              <span>INPUT REQUISITION</span>
              <div className="flex gap-2">
                {SAMPLE_JOBS.map((sample, i) => (
                  <button
                    key={i}
                    onClick={() => loadSample(sample.text)}
                    disabled={loading}
                    className="text-[11px] text-cyan-400 hover:text-cyan-300 transition-colors underline cursor-pointer disabled:opacity-50"
                  >
                    Sample {i + 1}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste any data analyst job description here..."
                rows={10}
                disabled={loading}
                className="w-full bg-[#0a0a0c] border border-white/[0.08] focus:border-cyan-500/50 rounded-lg p-4 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none transition-all font-mono leading-relaxed resize-none"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => {
                  setInput('');
                  setResult(null);
                  setError(null);
                }}
                disabled={!input || loading}
                className="text-xs font-mono text-zinc-500 hover:text-zinc-300 disabled:opacity-30 transition-colors cursor-pointer"
              >
                Clear input
              </button>

              <button
                onClick={() => analyzeJob()}
                disabled={loading || !input.trim()}
                className="inline-flex items-center gap-2 px-6 py-3 rounded bg-white text-zinc-950 hover:bg-zinc-200 font-mono text-xs uppercase tracking-wider font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-white/5"
              >
                {loading ? (
                  <>
                    <RefreshCw size={14} className="animate-spin text-cyan-600" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={14} className="text-cyan-600" />
                    <span>DECODE ROLE →</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results Side (7 cols) */}
          <div className="lg:col-span-7 bg-[#0a0a0c] border border-white/[0.06] p-8 sm:p-10 rounded-lg min-h-[390px] flex flex-col justify-center shadow-2xl">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/[0.06] text-xs font-mono text-zinc-500">
              <span className="uppercase">INTELLIGENCE REPORT</span>
              <span className="flex items-center gap-1 text-cyan-400">
                <Sparkles size={12} /> GEMINI ANALYTICS
              </span>
            </div>

            <AnimatePresence mode="wait">
              {loading && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-12 space-y-6"
                >
                  <div className="w-10 h-10 border-2 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin mx-auto" />
                  
                  {/* Step-by-step Analysis Sequence */}
                  <div className="max-w-md mx-auto space-y-2">
                    {ANALYSIS_STEPS.map((step, idx) => {
                      const isDone = idx < currentStepIndex;
                      const isCurrent = idx === currentStepIndex;
                      return (
                        <div
                          key={step}
                          className={`flex items-center gap-2.5 text-xs font-mono transition-all ${
                            isDone
                              ? 'text-zinc-500'
                              : isCurrent
                              ? 'text-cyan-300 font-semibold'
                              : 'text-zinc-700'
                          }`}
                        >
                          {isDone ? (
                            <CheckCircle2 size={13} className="text-emerald-400 flex-shrink-0" />
                          ) : isCurrent ? (
                            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping flex-shrink-0" />
                          ) : (
                            <span className="w-2 h-2 rounded-full bg-zinc-800 flex-shrink-0" />
                          )}
                          <span>{step}</span>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {error && !loading && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-12 text-center space-y-4"
                >
                  <AlertCircle size={32} className="text-rose-400 mx-auto" />
                  <div className="text-sm text-zinc-200 font-mono">{error}</div>
                  <button
                    onClick={() => analyzeJob()}
                    className="text-xs font-mono uppercase text-cyan-400 underline cursor-pointer"
                  >
                    Retry Analysis
                  </button>
                </motion.div>
              )}

              {!loading && !error && !result && (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-16 text-center space-y-3 text-zinc-600"
                >
                  <Briefcase size={36} className="mx-auto text-zinc-700" />
                  <div className="text-sm font-mono uppercase tracking-wider text-zinc-400">
                    Awaiting Requisition Input
                  </div>
                  <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                    Paste a raw job description on the left or click "Sample 1" to see immediate structured decompression.
                  </p>
                </motion.div>
              )}

              {!loading && !error && result && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-6"
                >
                  {/* Top Metadata Badges */}
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="px-3 py-1 rounded bg-violet-950/40 border border-violet-500/30 text-violet-300 text-xs font-mono font-semibold">
                      SENIORITY: {result.seniorityLevel.toUpperCase()}
                    </span>
                    <span className="px-3 py-1 rounded bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
                      DOMAIN: {result.businessDomain}
                    </span>
                    <span className="px-3 py-1 rounded bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold">
                      ${Math.round(result.estimatedSalaryRange.min / 1000)}K – ${Math.round(result.estimatedSalaryRange.max / 1000)}K USD
                    </span>
                  </div>

                  {/* Executive Summary */}
                  <div className="pt-2">
                    <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1.5">
                      EXECUTIVE SIGNAL
                    </div>
                    <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-normal">
                      {result.executiveSummary}
                    </p>
                  </div>

                  {/* Skills Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/[0.06]">
                    <div>
                      <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                        <ShieldCheck size={12} className="text-cyan-400" />
                        CORE HARD SKILLS
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {result.hardSkills.map((skill) => (
                          <span
                            key={skill}
                            className="px-2.5 py-1 rounded bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-zinc-200"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-2">
                        NICE-TO-HAVE / DIFFERENTIATORS
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {result.niceToHaveSkills.map((skill) => (
                          <span
                            key={skill}
                            className="px-2.5 py-1 rounded bg-white/[0.02] border border-white/[0.05] text-xs font-mono text-zinc-400"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Strategic Action Recommendation */}
                  <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-zinc-400">
                    <span>STATUS: REQUISITION DECODED</span>
                    <span className="text-cyan-400 font-bold">MATCH VERIFIED</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
