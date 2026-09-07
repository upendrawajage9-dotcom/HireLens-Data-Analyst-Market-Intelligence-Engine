import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import LenisProvider from '@/components/providers/LenisProvider';
import ScrollProgress from '@/components/ui/ScrollProgress';
import Logo from '@/components/ui/Logo';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'HireLens — Data Analyst Market Intelligence',
  description: 'Analyze Data Analyst job market demand, skill combinations, salary signals, job coverage, and AI-powered job descriptions with HireLens.',
  keywords: [
    'data analyst',
    'market intelligence',
    'skill demand',
    'salary analysis',
    'SQL',
    'Python',
    'Power BI',
    'Tableau',
    'Snowflake',
    'Gemini AI',
  ],
  openGraph: {
    title: 'HireLens — Data Analyst Market Intelligence',
    description: 'Analyze Data Analyst job market demand, skill combinations, salary signals, and job coverage.',
    type: 'website',
  },
};

const NAV_LINKS = [
  { href: '#market', label: 'Market' },
  { href: '#skills', label: 'Skills' },
  { href: '#synergy', label: 'Synergy' },
  { href: '#coverage', label: 'Coverage' },
  { href: '#ai', label: 'AI' },
  { href: '#jobs', label: 'Jobs' },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} scroll-smooth`}>
      <body className="bg-[#05070b] text-[#f5f7fa] antialiased font-sans relative selection:bg-cyan-500/20 selection:text-cyan-200">
        <ScrollProgress />
        <LenisProvider>
          {/* Subtle background ambient mesh */}
          <div className="pointer-events-none fixed inset-0 -z-20 bg-[radial-gradient(#ffffff07_1px,transparent_1px)] [background-size:32px_32px] bg-[#05070b]" />

          {/* Minimal sticky editorial navigation with fluid wide padding */}
          <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 sm:px-10 lg:px-[6vw] 2xl:px-[7vw] py-4 backdrop-blur-xl bg-[#05070b]/80 border-b border-white/[0.06]">
            <Logo />

            {/* Center Navigation */}
            <nav className="hidden md:flex items-center gap-1 bg-white/[0.03] px-3 py-1.5 rounded-full border border-white/[0.08]" aria-label="Main navigation">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3.5 py-1 rounded-full text-xs font-mono uppercase tracking-wider text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-all"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right Status Badge */}
            <div className="flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-950/30 px-3 py-1.5 text-[11px] font-mono text-cyan-300 shadow-sm shadow-cyan-950/20">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>1K+ LISTINGS</span>
            </div>
          </header>

          {/* Page content */}
          <main className="relative z-10 w-full">{children}</main>

          {/* Massive Editorial Footer with fluid wide padding */}
          <footer className="relative z-10 border-t border-white/[0.06] pt-24 pb-16 px-6 sm:px-10 lg:px-[6vw] 2xl:px-[7vw] bg-[#040609]">
            <div className="w-full space-y-16">
              {/* Giant Brand Statement */}
              <div className="space-y-4">
                <div className="text-[clamp(3.5rem,10vw,9.5rem)] font-extrabold tracking-[-0.04em] text-white leading-none select-none">
                  HIRELENS
                </div>
                <p className="text-base sm:text-xl text-zinc-400 max-w-xl font-normal">
                  Decode the job market. Know your worth. Learn what matters next.
                </p>
              </div>

              {/* Navigation Links and Engineering Credits */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pt-10 border-t border-white/[0.06]">
                <div className="md:col-span-4 space-y-3">
                  <div className="text-xs font-mono uppercase tracking-widest text-zinc-500">
                    NAVIGATION
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm font-mono text-zinc-400">
                    {NAV_LINKS.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="hover:text-cyan-400 transition-colors"
                      >
                        {link.label} →
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-4 space-y-3">
                  <div className="text-xs font-mono uppercase tracking-widest text-zinc-500">
                    ARCHITECTURE & STACK
                  </div>
                  <p className="text-xs font-mono text-zinc-400 leading-relaxed">
                    Next.js 16 App Router · Three.js 3D WebGL · TypeScript · Tailwind CSS v4 · Framer Motion · Lenis Smooth Scroll · Recharts · Google Gemini AI
                  </p>
                  <p className="text-[11px] font-mono text-zinc-600">
                    Deterministic client/server rendering with zero hydration mismatch.
                  </p>
                </div>

                <div className="md:col-span-4 space-y-3">
                  <div className="text-xs font-mono uppercase tracking-widest text-zinc-500">
                    DATA NOTE & TRANSPARENCY
                  </div>
                  <p className="text-xs font-mono text-zinc-500 leading-relaxed">
                    Market metrics are derived from HireLens’s curated 1,000-job benchmark dataset (US, India, Remote) for analytical demonstration and portfolio evaluation.
                  </p>
                </div>
              </div>

              {/* Bottom Copyright */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-white/[0.04] text-xs font-mono text-zinc-600">
                <span>© 2026 HireLens Intelligence Engine. All rights reserved.</span>
                <span className="text-zinc-500">Production Portfolio Showcase</span>
              </div>
            </div>
          </footer>
        </LenisProvider>
      </body>
    </html>
  );
}
