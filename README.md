# HireLens — Data Analyst Market Intelligence Engine

> **Decode the job market. Know your worth. Learn what matters next.**  
> An award-grade, cinematic market intelligence platform engineered for data analysts to decode hiring demand, skill synergies, compensation trajectories, and AI-driven job descriptions across 1,000+ verified roles.

---

## 🌐 Live System Architecture

HireLens combines modern high-performance web engineering with data visualization and generative AI:

- **Next.js 16 (App Router & Turbopack)** — Blazing fast server-rendered React 19 architecture with deterministic hydration.
- **Three.js WebGL 3D Globe** — Monumental glowing Earth with custom GLSL crescent atmosphere rim lighting, 3,400+ Fibonacci data points, and sweeping orbital ellipses with traveling data packets.
- **Framer Motion & Lenis Scroll** — Bidirectional reversible scroll-linked animations, sequential bar reveals, and self-drawing SVG growth paths.
- **Google Gemini AI** — Live job requisition deconstruction via `/api/analyze-job`.
- **Recharts & SVG Data Visualization** — Interactive skill radar, salary curves, and monthly market growth charts.
- **Tailwind CSS v4** — Custom dark cinematic design system (`#05070B`, `#06D6F5`, `#8B5CF6`).

---

## ✨ Core Product Features

### 1. 🌍 Monumental 3D Earth Globe
- **Custom GLSL Rim Lighting**: Electric cyan crescent atmosphere shader on the top-left limb reflecting celestial space lighting.
- **Data Matrix Cloud**: 3,400+ Fibonacci points mapping global data hubs (San Francisco, New York, London, Bengaluru, Singapore, Tokyo, Berlin).
- **Continuous Momentum**: Decoupled continuous rotation (~45s per revolution) that never resets or pauses on scroll.
- **Parallax Physics**: Interactive camera tilting with cursor motion and scroll depth.

### 2. ⚡ Kinetic Hero Experience
- **5-Line Editorial Typography**: Staggered blur-to-focus reveal (`DECODE` / `THE DATA` / `ANALYST` / `JOB` / `MARKET.`).
- **Live Market Pulse Ticker**: Infinite marquee streaming real-time compensation and toolstack adoption signals.
- **Full-Bleed Desktop Viewport**: Built for large screens (1440px / 1920px) with generous 6–8vw negative space.

### 3. 📊 Macro Market Signals (01 — The Market)
- **KPI Stat Counters**: Bidirectional eased count-ups for 1,000+ roles, 79.1% SQL demand, 44.2% remote density, and $108K median salary.
- **Job Listings Over Time**: 12-month sequential progression bar chart with cyan-to-violet gradient styling.

### 4. 📈 Dynamic Chart Storytelling
- **Sequential Bar Growth**: Each skill bar begins at 0% and animates sequentially with luminous leading-edge highlights.
- **Self-Drawing Compensation Curve**: Progressive SVG `pathLength` drawing showing earnings progression by YOE, reversing gracefully on upward scroll.
- **Work Modality Distribution**: Visual breakdown across Remote, Hybrid, and On-Site requisitions.

### 5. 🧩 Skill Ecosystem & Synergy Matrix (02 & 03)
- **Skill Stack Selector**: Interactive pills (`SQL`, `Python`, `Power BI`, `Tableau`, `Snowflake`, `dbt`, `BigQuery`, `Excel`).
- **Multi-Skill Radar**: Co-occurrence frequency and salary premium percentage for skill pairs.

### 6. 🎯 Market Coverage Engine (04)
- Interactive toolstack calculator computing personal market coverage score against 1,000+ benchmark jobs with dynamic SVG circular gauge.

### 7. 🤖 Gemini AI Job Deconstructor (05)
- Live AI analysis powered by Google Gemini (`gemini-3.6-flash`).
- Deconstructs raw job descriptions into hard skills, nice-to-haves, seniority, domain, executive summary, and salary bands.

### 8. 💼 Editorial Job Market & Modal Inspector (06)
- Instant search and multi-parameter filters (Seniority, Work Mode, Salary).
- Full Job Inspector modal with deep role breakdown and one-click AI audit.

---

## 📐 Market Coverage Formula

$$\text{Coverage Score} = \left( \frac{\text{Matching Benchmark Roles}}{\text{Total Corpus Listings (1,000)}} \right) \times 100$$

A listing is defined as matching when **all** user-selected core competencies are satisfied by the job's requirement profile.

---

## 🚀 Local Development Quickstart

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env.local

# 3. Add your Gemini API key in .env.local (optional):
# GEMINI_API_KEY=your_key_here

# 4. Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---


