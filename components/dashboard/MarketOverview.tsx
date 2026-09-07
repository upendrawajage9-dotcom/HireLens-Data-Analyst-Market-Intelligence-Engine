'use client';

import { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  AreaChart, Area, CartesianGrid,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { motion } from 'framer-motion';
import { Database, TrendingUp, Globe, DollarSign } from 'lucide-react';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { getMarketMetrics, getSkillDemand, getWorkTypeDistribution, getSalaryByExperience } from '@/lib/analytics';
import { useHasMounted } from '@/hooks/useHasMounted';

function ChartSkeleton({ height = 280 }: { height?: number }) {
  return (
    <div
      style={{ height }}
      className="w-full rounded-xl bg-zinc-900/30 animate-pulse flex flex-col justify-end p-6 gap-3"
    >
      <div className="h-3 bg-zinc-800/70 rounded w-1/4 mb-3" />
      <div className="h-5 bg-zinc-800/50 rounded w-4/5" />
      <div className="h-5 bg-zinc-800/40 rounded w-3/5" />
      <div className="h-5 bg-zinc-800/30 rounded w-2/3" />
      <div className="h-5 bg-zinc-800/20 rounded w-1/2" />
    </div>
  );
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number | string; color?: string; fill?: string }>;
  label?: string;
  prefix?: string;
  suffix?: string;
}

function GlassmorphicTooltip({ active, payload, label, prefix = '', suffix = '' }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-zinc-950/90 border border-white/10 rounded-xl p-3.5 shadow-2xl backdrop-blur-2xl min-w-[140px] border-t-violet-500/40">
      {label && <p className="text-[11px] font-mono uppercase tracking-wider font-semibold text-zinc-400 mb-2">{label}</p>}
      <div className="space-y-1.5">
        {payload.map((entry, idx) => {
          const color = entry.color || entry.fill || '#8b5cf6';
          return (
            <div key={idx} className="flex items-center justify-between gap-4 text-xs">
              <span className="flex items-center gap-2 text-zinc-300">
                <span
                  className="w-2 h-2 rounded-full inline-block flex-shrink-0"
                  style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }}
                />
                <span className="font-medium text-zinc-300">{entry.name}</span>
              </span>
              <span className="font-mono font-bold text-white tracking-tight">
                {prefix}{typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}{suffix}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs text-zinc-500 uppercase tracking-widest font-medium mb-2">{children}</p>
  );
}

export default function MarketOverview() {
  const hasMounted = useHasMounted();

  const metrics = useMemo(() => getMarketMetrics(), []);
  const skillDemand = useMemo(() => getSkillDemand().slice(0, 10), []);
  const workDist = useMemo(() => getWorkTypeDistribution(), []);
  const salaryExp = useMemo(() => getSalaryByExperience(), []);

  const kpis = [
    {
      icon: <Database size={20} className="text-violet-400" />,
      label: 'Total Listings',
      value: metrics.totalListings,
      suffix: '',
      color: 'violet',
    },
    {
      icon: <TrendingUp size={20} className="text-cyan-400" />,
      label: 'Median Salary',
      value: metrics.medianSalaryUSD,
      prefix: '$',
      suffix: '',
      color: 'cyan',
    },
    {
      icon: <Globe size={20} className="text-emerald-400" />,
      label: 'Remote Ratio',
      value: metrics.remoteRatio,
      suffix: '%',
      decimals: 1,
      color: 'emerald',
    },
    {
      icon: <DollarSign size={20} className="text-amber-400" />,
      label: `Top Tool: ${metrics.topTool}`,
      value: metrics.topToolPercentage,
      suffix: '% demand',
      decimals: 1,
      color: 'amber',
    },
  ];

  const glowHover: Record<string, string> = {
    violet: 'hover:border-violet-500/50 hover:shadow-violet-500/10',
    cyan: 'hover:border-cyan-500/50 hover:shadow-cyan-500/10',
    emerald: 'hover:border-emerald-500/50 hover:shadow-emerald-500/10',
    amber: 'hover:border-amber-500/50 hover:shadow-amber-500/10',
  };

  return (
    <section id="dashboard" className="py-24 px-6 max-w-7xl mx-auto w-full">
      {/* Section header */}
      <div className="mb-14 text-center">
        <p className="text-xs text-violet-400 uppercase tracking-widest font-medium mb-3">Market Intelligence</p>
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">Data Analyst Market Overview</h2>
        <p className="text-zinc-400 max-w-xl mx-auto">Real-time aggregated signals from 1,000+ active job listings across India, US, and Remote markets.</p>
      </div>

      {/* KPI metric cards with glassmorphic backdrop filters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
          >
            <div
              className={`rounded-2xl border border-white/10 bg-zinc-900/50 backdrop-blur-2xl p-5 transition-all duration-300 shadow-xl ${glowHover[kpi.color]}`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-xl bg-zinc-800/80 border border-white/5">{kpi.icon}</div>
                <p className="text-xs text-zinc-400 font-medium">{kpi.label}</p>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-white tabular-nums tracking-tight">
                <AnimatedCounter
                  value={kpi.value}
                  prefix={kpi.prefix}
                  suffix={kpi.suffix}
                  decimals={kpi.decimals}
                />
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Skill demand bar chart */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card glow className="h-full backdrop-blur-xl">
            <CardHeader>
              <SectionLabel>Skill Demand Frequency</SectionLabel>
              <h3 className="text-lg font-semibold text-white">Top 10 In-Demand Skills</h3>
            </CardHeader>
            <CardBody>
              {!hasMounted ? (
                <ChartSkeleton height={280} />
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={skillDemand} layout="vertical" margin={{ left: 10, right: 20 }}>
                    <defs>
                      <linearGradient id="violetGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.9} />
                        <stop offset="65%" stopColor="#06b6d4" stopOpacity={0.95} />
                        <stop offset="100%" stopColor="#10b981" stopOpacity={1} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis
                      type="number"
                      tickFormatter={v => `${v}%`}
                      tick={{ fill: '#71717a', fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      type="category"
                      dataKey="skill"
                      width={84}
                      tick={{ fill: '#d4d4d8', fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      content={<GlassmorphicTooltip suffix="%" />}
                      cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                    />
                    <Bar
                      dataKey="percentage"
                      name="Demand"
                      radius={[0, 6, 6, 0]}
                      fill="url(#violetGradient)"
                      isAnimationActive={true}
                      animationDuration={1500}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardBody>
          </Card>
        </motion.div>

        {/* Work type donut */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card glow className="h-full backdrop-blur-xl">
            <CardHeader>
              <SectionLabel>Work Arrangement</SectionLabel>
              <h3 className="text-lg font-semibold text-white">Remote vs Hybrid vs On-site</h3>
            </CardHeader>
            <CardBody>
              {!hasMounted ? (
                <ChartSkeleton height={280} />
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={workDist}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="45%"
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={4}
                      strokeWidth={0}
                      isAnimationActive={true}
                      animationDuration={1500}
                    >
                      {workDist.map((entry, i) => (
                        <Cell key={i} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Legend
                      formatter={(value) => <span className="text-zinc-300 text-xs font-medium">{value}</span>}
                      wrapperStyle={{ paddingTop: 8 }}
                    />
                    <Tooltip content={<GlassmorphicTooltip suffix=" listings" />} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardBody>
          </Card>
        </motion.div>

        {/* Salary vs experience area chart */}
        <motion.div
          className="lg:col-span-3"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card glow className="backdrop-blur-xl">
            <CardHeader>
              <SectionLabel>Compensation Analysis</SectionLabel>
              <h3 className="text-lg font-semibold text-white">Salary Band vs Experience (USD) by Market</h3>
            </CardHeader>
            <CardBody>
              {!hasMounted ? (
                <ChartSkeleton height={280} />
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={salaryExp} margin={{ left: 10, right: 20 }}>
                    <defs>
                      <linearGradient id="usGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.45} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="remoteGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="indiaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis
                      dataKey="years"
                      tickFormatter={v => `${v} yr`}
                      tick={{ fill: '#71717a', fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tickFormatter={v => `$${(v / 1000).toFixed(0)}K`}
                      tick={{ fill: '#71717a', fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      content={
                        <GlassmorphicTooltip
                          prefix="$"
                          label="Experience"
                        />
                      }
                    />
                    <Area
                      type="monotone"
                      dataKey="US"
                      stroke="#8b5cf6"
                      fill="url(#usGrad)"
                      strokeWidth={2.5}
                      name="US"
                      isAnimationActive={true}
                      animationDuration={1500}
                    />
                    <Area
                      type="monotone"
                      dataKey="Remote"
                      stroke="#06b6d4"
                      fill="url(#remoteGrad)"
                      strokeWidth={2.5}
                      name="Remote"
                      isAnimationActive={true}
                      animationDuration={1500}
                    />
                    <Area
                      type="monotone"
                      dataKey="India"
                      stroke="#10b981"
                      fill="url(#indiaGrad)"
                      strokeWidth={2.5}
                      name="India (USD equiv)"
                      isAnimationActive={true}
                      animationDuration={1500}
                    />
                    <Legend
                      formatter={(value) => <span className="text-zinc-300 text-xs font-medium">{value}</span>}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </CardBody>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
