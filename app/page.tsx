import Hero from '@/components/landing/Hero';
import MarketStats from '@/components/landing/MarketStats';
import MarketVisualization from '@/components/landing/MarketVisualization';
import SkillStory from '@/components/landing/SkillStory';
import SynergyMatrix from '@/components/analytics/SynergyMatrix';
import SkillMatcher from '@/components/tools/SkillMatcher';
import AIExperience from '@/components/landing/AIExperience';
import JobFeed from '@/components/jobs/JobFeed';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center w-full overflow-x-hidden">
      {/* Hero Cinematic Landing */}
      <Hero />

      {/* 01 — The Market (Narrative + Statistics) */}
      <MarketStats />

      {/* Market Visualization Stories (SQL Demand, Experience Curves, Work Modality) */}
      <MarketVisualization />

      {/* 02 — Skills Ecosystem & Stacks */}
      <SkillStory />

      {/* 03 — Skill Synergy (Co-occurrence & Multi-skill Radar) */}
      <SynergyMatrix />

      {/* 04 — Your Position (Interactive Coverage Engine) */}
      <SkillMatcher />

      {/* 05 — AI Intelligence (Job Deconstructor) */}
      <AIExperience />

      {/* 06 — Live Job Market & Inspector */}
      <JobFeed />
    </div>
  );
}
