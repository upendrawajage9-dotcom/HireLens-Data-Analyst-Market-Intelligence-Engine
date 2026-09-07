'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, RefreshCw, DollarSign, MapPin, Briefcase, ShieldCheck, Check, AlertCircle } from 'lucide-react';
import type { JobPosting, GeminiAnalysis } from '@/types/job';
import { formatSalary } from '@/lib/utils';

interface JobInspectorModalProps {
  job: JobPosting | null;
  onClose: () => void;
}

export default function JobInspectorModal({ job, onClose }: JobInspectorModalProps) {
  const [analysis, setAnalysis] = useState<GeminiAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Lock background scroll while modal is open & listen for ESC key
  useEffect(() => {
    if (!job) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [job, onClose]);

  // Reset analysis when job changes
  useEffect(() => {
    setAnalysis(null);
    setError(null);
    setLoading(false);
  }, [job]);

  const runGeminiAnalysis = async () => {
    if (!job) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/analyze-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription: job.description }),
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setAnalysis(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Analysis failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!job) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md">
      {/* Backdrop click handler */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      {/* Modal Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-3xl bg-[#0a0a0c] border border-white/10 rounded-xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-job-title"
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 sm:p-8 border-b border-white/[0.08] bg-[#0c0c0e]">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2 text-xs font-mono">
              <span className="px-2.5 py-0.5 rounded border border-white/10 bg-white/[0.03] text-zinc-300">
                {job.experienceLevel}
              </span>
              <span className="px-2.5 py-0.5 rounded border border-cyan-500/20 bg-cyan-950/30 text-cyan-300">
                {job.workType}
              </span>
              <span className="px-2.5 py-0.5 rounded border border-emerald-500/20 bg-emerald-950/30 text-emerald-300">
                {job.country}
              </span>
            </div>

            <h2 id="modal-job-title" className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {job.title}
            </h2>
            <p className="text-sm font-mono text-zinc-400 mt-1">
              {job.company} · {job.location}
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-white/30 hover:bg-white/[0.04] transition-all cursor-pointer flex-shrink-0"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8 no-scrollbar">
          {/* Compensation & Meta Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white/[0.02] border border-white/[0.06] p-4 rounded">
              <div className="text-[10px] font-mono uppercase text-zinc-500 mb-1">
                COMPENSATION BAND
              </div>
              <div className="text-base font-mono font-bold text-white">
                {formatSalary(job.salaryMin, job.currency)} – {formatSalary(job.salaryMax, job.currency)}
              </div>
              <div className="text-[10px] font-mono text-zinc-500 mt-0.5">{job.currency} Annual Base</div>
            </div>

            <div className="bg-white/[0.02] border border-white/[0.06] p-4 rounded">
              <div className="text-[10px] font-mono uppercase text-zinc-500 mb-1">
                EXPERIENCE REQUIRED
              </div>
              <div className="text-base font-mono font-bold text-white">
                {job.experienceYears}+ Years
              </div>
              <div className="text-[10px] font-mono text-zinc-500 mt-0.5">{job.experienceLevel} Tier</div>
            </div>

            <div className="bg-white/[0.02] border border-white/[0.06] p-4 rounded">
              <div className="text-[10px] font-mono uppercase text-zinc-500 mb-1">
                POSTED REQUISITION
              </div>
              <div className="text-base font-mono font-bold text-white">
                {job.postedDate}
              </div>
              <div className="text-[10px] font-mono text-zinc-500 mt-0.5">Verified Posting</div>
            </div>
          </div>

          {/* Required Skills Section */}
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-zinc-400 mb-3 flex items-center gap-2">
              <ShieldCheck size={14} className="text-cyan-400" />
              MANDATORY SKILLSTACK ({job.requiredSkills.length})
            </div>
            <div className="flex flex-wrap gap-2">
              {job.requiredSkills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 rounded bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-zinc-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Job Description Raw Excerpt */}
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-zinc-400 mb-2">
              JOB SPECIFICATION
            </div>
            <div className="bg-white/[0.01] border border-white/[0.06] p-4 rounded text-sm text-zinc-400 leading-relaxed font-mono">
              {job.description}
            </div>
          </div>

          {/* AI Intelligence Section */}
          <div className="pt-4 border-t border-white/[0.08]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-xs font-mono uppercase tracking-widest text-cyan-400 flex items-center gap-1.5">
                  <Sparkles size={14} />
                  AI REQUISITION AUDIT
                </div>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Run deep semantic parsing with Gemini to verify candidate qualification requirements.
                </p>
              </div>

              {!analysis && (
                <button
                  onClick={runGeminiAnalysis}
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs font-mono uppercase tracking-wider text-white transition-all cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <RefreshCw size={12} className="animate-spin" />
                      <span>Parsing...</span>
                    </>
                  ) : (
                    <span>Audit With Gemini</span>
                  )}
                </button>
              )}
            </div>

            {error && (
              <div className="p-4 rounded border border-rose-500/30 bg-rose-950/20 text-xs font-mono text-rose-300 flex items-center gap-2">
                <AlertCircle size={14} />
                <span>{error}</span>
                <button onClick={runGeminiAnalysis} className="underline ml-auto cursor-pointer">
                  Retry
                </button>
              </div>
            )}

            {analysis && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/[0.02] border border-cyan-500/20 p-5 rounded space-y-4"
              >
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                  <span className="text-zinc-500">DOMAIN:</span>
                  <span className="text-white font-bold">{analysis.businessDomain}</span>
                  <span className="text-zinc-700">|</span>
                  <span className="text-zinc-500">EXTRACTED LEVEL:</span>
                  <span className="text-cyan-400 font-bold">{analysis.seniorityLevel}</span>
                </div>

                <p className="text-sm text-zinc-300 leading-relaxed font-mono">
                  {analysis.executiveSummary}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-white/[0.06] text-xs font-mono">
                  <div>
                    <span className="text-zinc-500 block mb-1">EXTRACTED CORE TOOLS:</span>
                    <div className="flex flex-wrap gap-1">
                      {analysis.hardSkills.map((s) => (
                        <span key={s} className="px-2 py-0.5 rounded bg-white/[0.04] text-zinc-300">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-zinc-500 block mb-1">NICE TO HAVE:</span>
                    <div className="flex flex-wrap gap-1">
                      {analysis.niceToHaveSkills.map((s) => (
                        <span key={s} className="px-2 py-0.5 rounded bg-white/[0.02] text-zinc-500">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 border-t border-white/[0.08] bg-[#0c0c0e] flex items-center justify-between text-xs font-mono text-zinc-500">
          <span>PRESS ESC TO CLOSE</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-white/[0.06] hover:bg-white/[0.1] text-zinc-300 transition-colors cursor-pointer"
          >
            Close Inspector
          </button>
        </div>
      </motion.div>
    </div>
  );
}
