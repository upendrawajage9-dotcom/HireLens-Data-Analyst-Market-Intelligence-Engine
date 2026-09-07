import { MOCK_JOBS } from './mockJobData';
import type { SkillDemand, CoOccurrencePair, UserSkillMatch, MarketMetrics } from '@/types/job';

const USD_PER_INR = 0.012;

function toUSD(amount: number, currency: 'USD' | 'INR'): number {
  return currency === 'INR' ? Math.round(amount * USD_PER_INR) : amount;
}

export const ALL_SKILLS = [
  'SQL', 'Python', 'Excel', 'Power BI', 'Tableau', 'Snowflake', 'dbt', 'BigQuery',
  'A/B Testing', 'Statistics', 'Looker', 'AWS', 'GCP', 'Azure', 'Databricks',
  'Airflow', 'Spark SQL', 'R', 'Metabase',
];

export const SKILL_CATEGORIES: Record<string, string[]> = {
  Querying: ['SQL', 'Snowflake', 'BigQuery', 'Spark SQL', 'dbt'],
  Visualization: ['Power BI', 'Tableau', 'Looker', 'Metabase', 'Excel'],
  Cloud: ['AWS', 'GCP', 'Azure', 'Databricks', 'Airflow'],
  Programming: ['Python', 'R', 'Statistics', 'A/B Testing'],
};

export function getMarketMetrics(): MarketMetrics {
  const total = MOCK_JOBS.length;

  // Skill frequency
  const skillCount: Record<string, number> = {};
  MOCK_JOBS.forEach(job => {
    job.requiredSkills.forEach(s => { skillCount[s] = (skillCount[s] || 0) + 1; });
  });
  const topTool = Object.entries(skillCount).sort((a, b) => b[1] - a[1])[0];

  // Median salary in USD
  const salaries = MOCK_JOBS.map(j => toUSD((j.salaryMin + j.salaryMax) / 2, j.currency)).sort((a, b) => a - b);
  const medianSalary = salaries[Math.floor(salaries.length / 2)];

  const remoteCount = MOCK_JOBS.filter(j => j.workType === 'Remote').length;

  const totalExp = MOCK_JOBS.reduce((sum, j) => sum + j.experienceYears, 0);

  return {
    totalListings: total,
    topTool: topTool[0],
    topToolPercentage: Math.round((topTool[1] / total) * 100 * 10) / 10,
    medianSalaryUSD: medianSalary,
    remoteRatio: Math.round((remoteCount / total) * 100 * 10) / 10,
    avgExperienceYears: Math.round((totalExp / total) * 10) / 10,
  };
}

export function getSkillDemand(): SkillDemand[] {
  const total = MOCK_JOBS.length;
  const skillCount: Record<string, number> = {};
  const skillSalaries: Record<string, number[]> = {};

  MOCK_JOBS.forEach(job => {
    const avgSalUSD = toUSD((job.salaryMin + job.salaryMax) / 2, job.currency);
    job.requiredSkills.forEach(s => {
      skillCount[s] = (skillCount[s] || 0) + 1;
      if (!skillSalaries[s]) skillSalaries[s] = [];
      skillSalaries[s].push(avgSalUSD);
    });
  });

  return ALL_SKILLS.map(skill => {
    const count = skillCount[skill] || 0;
    const sals = skillSalaries[skill] || [0];
    const avg = Math.round(sals.reduce((a, b) => a + b, 0) / sals.length);
    return {
      skill,
      count,
      percentage: Math.round((count / total) * 100 * 10) / 10,
      avgSalaryUSD: avg,
    };
  }).sort((a, b) => b.count - a.count);
}

export function getSkillCoOccurrence(primarySkill: string): CoOccurrencePair[] {
  const primaryJobs = MOCK_JOBS.filter(j => j.requiredSkills.includes(primarySkill));
  const primaryCount = primaryJobs.length;
  if (primaryCount === 0) return [];

  const baseSalaries = MOCK_JOBS.map(j => toUSD((j.salaryMin + j.salaryMax) / 2, j.currency));
  const baseAvg = baseSalaries.reduce((a, b) => a + b, 0) / baseSalaries.length;

  const coCount: Record<string, number> = {};
  const coSalaries: Record<string, number[]> = {};

  primaryJobs.forEach(job => {
    const avg = toUSD((job.salaryMin + job.salaryMax) / 2, job.currency);
    job.requiredSkills.forEach(s => {
      if (s === primarySkill) return;
      coCount[s] = (coCount[s] || 0) + 1;
      if (!coSalaries[s]) coSalaries[s] = [];
      coSalaries[s].push(avg);
    });
  });

  return Object.entries(coCount)
    .map(([skill, count]) => {
      const sals = coSalaries[skill] || [baseAvg];
      const avgWithBoth = Math.round(sals.reduce((a, b) => a + b, 0) / sals.length);
      const premium = Math.round(((avgWithBoth - baseAvg) / baseAvg) * 100 * 10) / 10;
      return {
        primarySkill,
        secondarySkill: skill,
        coCount: count,
        frequency: Math.round((count / primaryCount) * 100 * 10) / 10,
        salaryPremium: premium,
        avgSalaryWithBoth: avgWithBoth,
      };
    })
    .filter(p => p.coCount >= 5)
    .sort((a, b) => b.coCount - a.coCount)
    .slice(0, 12);
}

export function evaluateSkillCoverage(selectedSkills: string[]): UserSkillMatch {
  const total = MOCK_JOBS.length;
  if (selectedSkills.length === 0) {
    return {
      matchedJobs: 0,
      totalJobs: total,
      coveragePercent: 0,
      estimatedSalaryMin: 0,
      estimatedSalaryMax: 0,
      salaryTier: 'Entry',
      nextRecommendedSkill: 'SQL',
      nextSkillROI: 0,
    };
  }

  const matched = MOCK_JOBS.filter(job =>
    selectedSkills.every(skill => job.requiredSkills.includes(skill))
  );

  const matchedSalaries = matched.map(j => ({
    min: toUSD(j.salaryMin, j.currency),
    max: toUSD(j.salaryMax, j.currency),
  }));

  const avgMin = matchedSalaries.length > 0
    ? Math.round(matchedSalaries.reduce((a, b) => a + b.min, 0) / matchedSalaries.length)
    : 50000;
  const avgMax = matchedSalaries.length > 0
    ? Math.round(matchedSalaries.reduce((a, b) => a + b.max, 0) / matchedSalaries.length)
    : 80000;

  const coverage = Math.round((matched.length / total) * 100 * 10) / 10;

  let tier: UserSkillMatch['salaryTier'] = 'Entry';
  if (avgMax > 160000) tier = 'Lead';
  else if (avgMax > 120000) tier = 'Senior';
  else if (avgMax > 85000) tier = 'Mid';

  // Find next best skill by ROI (which skill added gives the most new jobs)
  let bestSkill = 'SQL';
  let bestGain = 0;

  ALL_SKILLS.filter(s => !selectedSkills.includes(s)).forEach(candidate => {
    const withCandidate = MOCK_JOBS.filter(job =>
      [...selectedSkills, candidate].every(skill => job.requiredSkills.includes(skill))
    );
    const gain = withCandidate.length - matched.length;
    if (gain > bestGain) {
      bestGain = gain;
      bestSkill = candidate;
    }
  });

  const roiPercent = matched.length > 0 ? Math.round((bestGain / matched.length) * 100) : 0;

  return {
    matchedJobs: matched.length,
    totalJobs: total,
    coveragePercent: coverage,
    estimatedSalaryMin: avgMin,
    estimatedSalaryMax: avgMax,
    salaryTier: tier,
    nextRecommendedSkill: bestSkill,
    nextSkillROI: roiPercent,
  };
}

export function getWorkTypeDistribution(): Array<{ name: string; value: number; fill: string }> {
  const dist = { Remote: 0, Hybrid: 0, 'On-site': 0 };
  MOCK_JOBS.forEach(j => { dist[j.workType]++; });
  return [
    { name: 'Remote', value: dist.Remote, fill: '#8b5cf6' },
    { name: 'Hybrid', value: dist.Hybrid, fill: '#06b6d4' },
    { name: 'On-site', value: dist['On-site'], fill: '#10b981' },
  ];
}

export function getSalaryByExperience(): Array<{ years: number; US: number; India: number; Remote: number }> {
  const data: Record<number, Record<string, number[]>> = {};

  MOCK_JOBS.forEach(job => {
    const yr = Math.min(Math.max(job.experienceYears, 1), 10);
    if (!data[yr]) data[yr] = { US: [], India: [], Remote: [] };
    const avgUSD = toUSD((job.salaryMin + job.salaryMax) / 2, job.currency);
    data[yr][job.country].push(avgUSD);
  });

  const result: Array<{ years: number; US: number; India: number; Remote: number }> = [];
  let prevUS = 68000;
  let prevIndia = 11000;
  let prevRemote = 62000;

  for (let yr = 1; yr <= 10; yr++) {
    const row = data[yr];
    const rawUS = row?.US?.length ? Math.round(row.US.reduce((a, b) => a + b, 0) / row.US.length) : Math.round(prevUS * 1.09);
    const rawIndia = row?.India?.length ? Math.round(row.India.reduce((a, b) => a + b, 0) / row.India.length) : Math.round(prevIndia * 1.12);
    const rawRemote = row?.Remote?.length ? Math.round(row.Remote.reduce((a, b) => a + b, 0) / row.Remote.length) : Math.round(prevRemote * 1.09);

    // Guarantee smooth realistic monotonic growth curve across all years
    const finalUS = Math.max(rawUS, Math.round(prevUS * 1.05));
    const finalIndia = Math.max(rawIndia, Math.round(prevIndia * 1.06));
    const finalRemote = Math.max(rawRemote, Math.round(prevRemote * 1.05));

    prevUS = finalUS;
    prevIndia = finalIndia;
    prevRemote = finalRemote;

    result.push({
      years: yr,
      US: finalUS,
      India: finalIndia,
      Remote: finalRemote,
    });
  }

  return result;
}
