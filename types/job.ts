export interface JobPosting {
  id: string;
  title: string;
  company: string;
  location: string;
  country: 'India' | 'US' | 'Remote';
  workType: 'Remote' | 'Hybrid' | 'On-site';
  experienceLevel: 'Entry' | 'Mid' | 'Senior' | 'Lead';
  experienceYears: number;
  salaryMin: number;
  salaryMax: number;
  currency: 'USD' | 'INR';
  requiredSkills: string[];
  niceToHaveSkills: string[];
  postedDate: string;
  description: string;
}

export interface SkillDemand {
  skill: string;
  count: number;
  percentage: number;
  avgSalaryUSD: number;
}

export interface CoOccurrencePair {
  primarySkill: string;
  secondarySkill: string;
  coCount: number;
  frequency: number;
  salaryPremium: number;
  avgSalaryWithBoth: number;
}

export interface UserSkillMatch {
  matchedJobs: number;
  totalJobs: number;
  coveragePercent: number;
  estimatedSalaryMin: number;
  estimatedSalaryMax: number;
  salaryTier: 'Entry' | 'Mid' | 'Senior' | 'Lead';
  nextRecommendedSkill: string;
  nextSkillROI: number;
}

export interface MarketMetrics {
  totalListings: number;
  topTool: string;
  topToolPercentage: number;
  medianSalaryUSD: number;
  remoteRatio: number;
  avgExperienceYears: number;
}

export interface GeminiAnalysis {
  hardSkills: string[];
  niceToHaveSkills: string[];
  businessDomain: string;
  executiveSummary: string;
  estimatedSalaryRange: { min: number; max: number; currency: string };
  seniorityLevel: string;
}
