import { JobPosting } from '@/types/job';

const companies = {
  US: ['Stripe', 'Airbnb', 'Netflix', 'Uber', 'Lyft', 'Coinbase', 'Snowflake', 'Databricks', 'Palantir', 'Twilio', 'Datadog', 'HashiCorp', 'MongoDB', 'Elastic', 'Confluent', 'dbt Labs', 'Fivetran', 'Looker', 'Mode Analytics', 'Sigma Computing'],
  India: ['Flipkart', 'Swiggy', 'Zomato', 'Paytm', 'Razorpay', 'CRED', 'PhonePe', 'Meesho', 'Groww', 'Zerodha', 'Nykaa', 'ShareChat', 'InMobi', 'Freshworks', 'Zoho', 'Infosys', 'Wipro', 'TCS', 'HCL', 'Capgemini'],
  Remote: ['GitLab', 'Automattic', 'Buffer', 'Zapier', 'Basecamp', 'Toptal', 'Remote.co', 'Deel', 'Oyster', 'Crossbeam', 'PlanetScale', 'Supabase', 'Vercel', 'Linear', 'Notion'],
};

const jobTitles = [
  'Data Analyst', 'Senior Data Analyst', 'Lead Data Analyst', 'Junior Data Analyst',
  'Business Intelligence Analyst', 'Senior BI Analyst', 'BI Developer',
  'Data Analytics Engineer', 'Analytics Engineer', 'Senior Analytics Engineer',
  'Product Analyst', 'Senior Product Analyst', 'Growth Analyst',
  'Marketing Data Analyst', 'Financial Data Analyst', 'Operations Analyst',
  'Data Scientist', 'Junior Data Scientist',
  'SQL Developer', 'Database Analyst', 'Reporting Analyst',
];

const locations = {
  US: ['San Francisco, CA', 'New York, NY', 'Seattle, WA', 'Austin, TX', 'Boston, MA', 'Chicago, IL', 'Los Angeles, CA', 'Denver, CO', 'Atlanta, GA', 'Miami, FL'],
  India: ['Bangalore', 'Mumbai', 'Delhi NCR', 'Hyderabad', 'Pune', 'Chennai', 'Kolkata', 'Ahmedabad'],
  Remote: ['Worldwide', 'Americas', 'EMEA', 'APAC', 'US Only', 'Global'],
};

const skillPools = {
  querying: ['SQL', 'PostgreSQL', 'MySQL', 'Snowflake', 'BigQuery', 'Redshift', 'dbt', 'Spark SQL', 'Hive'],
  visualization: ['Power BI', 'Tableau', 'Looker', 'Metabase', 'Grafana', 'Superset', 'Excel', 'Google Sheets'],
  programming: ['Python', 'R', 'Scala', 'Bash', 'DAX', 'MDX'],
  cloud: ['AWS', 'GCP', 'Azure', 'Databricks', 'dbt Cloud', 'Airflow', 'Kafka'],
  statistics: ['Statistics', 'A/B Testing', 'Regression Analysis', 'Hypothesis Testing', 'ML Basics'],
};

const coreSkillWeights: Record<string, number> = {
  SQL: 0.92,
  Python: 0.72,
  'Power BI': 0.54,
  Tableau: 0.51,
  Excel: 0.68,
  Snowflake: 0.38,
  dbt: 0.29,
  BigQuery: 0.32,
  'A/B Testing': 0.41,
  Statistics: 0.45,
};

function createPRNG(seed: number) {
  let s = seed;
  return function () {
    s = (s + 0x6D2B79F5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const prng = createPRNG(42);

function weightedRandom<T>(items: T[], weights: number[], rand: () => number): T {
  const total = weights.reduce((a, b) => a + b, 0);
  let r = rand() * total;
  for (let i = 0; i < items.length; i++) {
    r -= weights[i];
    if (r <= 0) return items[i];
  }
  return items[items.length - 1];
}

function pickSkills(count: number, bias: string[], rand: () => number): string[] {
  const all = Object.values(skillPools).flat();
  const selected = new Set<string>();

  // Ensure biased skills appear more often
  for (const skill of bias) {
    if (rand() < 0.75) selected.add(skill);
  }

  while (selected.size < count) {
    const pool = all[Math.floor(rand() * all.length)];
    selected.add(pool);
  }
  return Array.from(selected).slice(0, count);
}

function generateSalary(
  country: 'India' | 'US' | 'Remote',
  level: string,
  expYears: number,
  rand: () => number
): { min: number; max: number; currency: 'USD' | 'INR' } {
  const bands: Record<string, Record<string, [number, number]>> = {
    US: { Entry: [65000, 90000], Mid: [90000, 130000], Senior: [130000, 175000], Lead: [165000, 220000] },
    India: { Entry: [600000, 1000000], Mid: [1000000, 1800000], Senior: [1800000, 2800000], Lead: [2800000, 4200000] },
    Remote: { Entry: [60000, 85000], Mid: [85000, 120000], Senior: [115000, 160000], Lead: [155000, 210000] },
  };
  const [lo, hi] = bands[country][level];
  const spread = hi - lo;
  // Factor experience smoothly into salary within the level
  const min = Math.round((lo + rand() * spread * 0.4) / 1000) * 1000;
  const max = Math.round((min + spread * 0.35 + rand() * spread * 0.25) / 1000) * 1000;
  return { min, max, currency: country === 'India' ? 'INR' : 'USD' };
}

function randomDate(rand: () => number): string {
  const now = new Date('2026-09-06');
  const daysAgo = Math.floor(rand() * 60);
  const d = new Date(now.getTime() - daysAgo * 86400000);
  return d.toISOString().split('T')[0];
}

export function generateMockJobs(): JobPosting[] {
  const rand = createPRNG(1337);
  const jobs: JobPosting[] = [];
  let id = 1;

  const countryDist: Array<'India' | 'US' | 'Remote'> = [
    ...Array(400).fill('India'),
    ...Array(400).fill('US'),
    ...Array(200).fill('Remote'),
  ];

  const levelDist: Array<'Entry' | 'Mid' | 'Senior' | 'Lead'> = [
    ...Array(200).fill('Entry'),
    ...Array(400).fill('Mid'),
    ...Array(300).fill('Senior'),
    ...Array(100).fill('Lead'),
  ];

  const workTypeDist: Record<'India' | 'US' | 'Remote', Array<'Remote' | 'Hybrid' | 'On-site'>> = {
    India: [...Array(20).fill('Remote'), ...Array(50).fill('Hybrid'), ...Array(30).fill('On-site')],
    US: [...Array(35).fill('Remote'), ...Array(45).fill('Hybrid'), ...Array(20).fill('On-site')],
    Remote: [...Array(100).fill('Remote')],
  };

  for (let i = 0; i < 1000; i++) {
    const country = countryDist[i % countryDist.length];
    const level = levelDist[i % levelDist.length];
    const companyPool = companies[country];
    const locationPool = locations[country];
    const company = companyPool[Math.floor(rand() * companyPool.length)];
    const location = locationPool[Math.floor(rand() * locationPool.length)];
    const title = jobTitles[Math.floor(rand() * jobTitles.length)];
    const workTypePool = workTypeDist[country];
    const workType = workTypePool[Math.floor(rand() * workTypePool.length)];

    // Ensure realistic smooth experience distribution covering ALL years 1 to 11
    let expYears: number;
    if (level === 'Entry') {
      expYears = 1 + Math.floor(rand() * 2); // 1, 2
    } else if (level === 'Mid') {
      expYears = 3 + Math.floor(rand() * 3); // 3, 4, 5
    } else if (level === 'Senior') {
      expYears = 6 + Math.floor(rand() * 3); // 6, 7, 8
    } else {
      expYears = 9 + Math.floor(rand() * 3); // 9, 10, 11
    }

    const salary = generateSalary(country, level, expYears, rand);

    const biasSkills = ['SQL', 'Python', 'Excel'];
    if (rand() > 0.4) biasSkills.push('Power BI');
    if (rand() > 0.5) biasSkills.push('Tableau');
    if (rand() > 0.65) biasSkills.push('Snowflake');
    if (rand() > 0.72) biasSkills.push('dbt');

    const skillCount = 3 + Math.floor(rand() * 4);
    const requiredSkills = pickSkills(skillCount, biasSkills, rand);
    const niceCount = 1 + Math.floor(rand() * 3);
    const niceToHaveSkills = pickSkills(niceCount, ['Statistics', 'A/B Testing', 'Kafka', 'Airflow'], rand).filter(
      s => !requiredSkills.includes(s)
    );

    jobs.push({
      id: `HL-${String(id).padStart(4, '0')}`,
      title,
      company,
      location,
      country,
      workType,
      experienceLevel: level,
      experienceYears: expYears,
      salaryMin: salary.min,
      salaryMax: salary.max,
      currency: salary.currency,
      requiredSkills,
      niceToHaveSkills,
      postedDate: randomDate(rand),
      description: `${company} is seeking a ${title} to join our data team. You will work with ${requiredSkills.slice(0, 3).join(', ')} and help drive data-informed decisions across the organization. ${expYears}+ years of experience required.`,
    });

    id++;
  }

  return jobs;
}

export const MOCK_JOBS: JobPosting[] = generateMockJobs();
