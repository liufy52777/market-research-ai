import Link from "next/link";

/* ------------------------------------------------------------------ */
/*  Feature cards data                                                */
/* ------------------------------------------------------------------ */

const features = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
    bg: "from-indigo-500/10 to-blue-400/10",
    iconColor: "text-indigo-600",
    title: "结构化报告",
    desc: "自动生成执行摘要、市场概况、客户结构、竞争格局与进入建议。",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
    bg: "from-emerald-500/10 to-teal-400/10",
    iconColor: "text-emerald-600",
    title: "适合出海调研",
    desc: "适用于汽车零部件、智能制造、装备制造等行业的海外市场初步分析。",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 4 23 10 17 10" />
        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
      </svg>
    ),
    bg: "from-violet-500/10 to-purple-400/10",
    iconColor: "text-violet-600",
    title: "可持续升级",
    desc: "后续可扩展联网搜索、来源引用、历史报告、PDF 导出与用户系统。",
  },
];

/* ------------------------------------------------------------------ */
/*  Dashboard metrics (static demo data)                              */
/* ------------------------------------------------------------------ */

const metrics = [
  { label: "市场规模", value: "456.8B", change: "+12.5%", color: "text-indigo-600" },
  { label: "年复合增长率", value: "12.5%", change: "CAGR", color: "text-emerald-600" },
  { label: "主要玩家", value: "2,847+", change: "活跃", color: "text-amber-600" },
  { label: "机会评分", value: "8.5", change: "/10", color: "text-violet-600" },
];

/* ------------------------------------------------------------------ */
/*  Inline SVG chart components                                       */
/* ------------------------------------------------------------------ */

function TrendChart() {
  const pts = "0,28 20,24 40,26 60,18 80,20 100,12 120,14 140,8 160,10 180,4 200,6";
  const area = `0,36 ${pts} 200,36`;
  return (
    <svg viewBox="0 0 200 36" className="h-9 w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill="url(#trendGrad)" />
      <polyline points={pts} fill="none" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DonutChart() {
  const segments = [
    { pct: 0.38, color: "#6366f1" },
    { pct: 0.27, color: "#8b5cf6" },
    { pct: 0.20, color: "#06b6d4" },
    { pct: 0.15, color: "#e2e8f0" },
  ];
  let accumulated = 0;
  const radius = 18;
  const cx = 22;
  const cy = 22;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="flex items-center gap-4">
      <svg width="48" height="48" viewBox="0 0 44 44">
        {segments.map((seg, i) => {
          const start = accumulated;
          accumulated += seg.pct;
          const dashLen = circumference * seg.pct;
          const dashStart = circumference * start;
          return (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth="5"
              strokeDasharray={`${dashLen} ${circumference - dashLen}`}
              strokeDashoffset={-dashStart}
              transform="rotate(-90 22 22)"
            />
          );
        })}
      </svg>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
        {[
          { label: "智能家居", color: "#6366f1" },
          { label: "安防监控", color: "#8b5cf6" },
          { label: "可穿戴设备", color: "#06b6d4" },
          { label: "其他", color: "#94a3b8" },
        ].map((item) => (
          <span key={item.label} className="flex items-center gap-1.5 text-slate-500">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Dashboard preview card                                            */
/* ------------------------------------------------------------------ */

function DashboardCard() {
  return (
    <div className="relative w-full max-w-lg rounded-2xl border border-white/60 bg-white/70 p-6 shadow-xl shadow-indigo-200/30 backdrop-blur-xl">
      {/* Subtle inner glow */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-50/40 via-white/0 to-violet-50/40" />

      <div className="relative">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-800">
              东南亚智能家居市场调研报告
            </p>
            <p className="text-xs text-slate-400">2026 Q2 · AI 生成</p>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-600">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            已完成
          </span>
        </div>

        {/* Metric cards */}
        <div className="mb-5 grid grid-cols-4 gap-2">
          {metrics.map((m) => (
            <div
              key={m.label}
              className="rounded-xl border border-slate-200/60 bg-white/80 p-2.5 backdrop-blur-sm"
            >
              <p className="text-[10px] text-slate-400">{m.label}</p>
              <p className={`text-sm font-bold ${m.color}`}>{m.value}</p>
              <p className="text-[10px] text-slate-400">{m.change}</p>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div className="mb-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-slate-200/60 bg-white/60 p-3">
            <p className="mb-2 text-[10px] font-medium text-slate-400">
              市场趋势
            </p>
            <TrendChart />
            <div className="mt-1 flex justify-between text-[10px] text-slate-400">
              <span>Q1</span><span>Q2</span><span>Q3</span><span>Q4</span>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200/60 bg-white/60 p-3">
            <p className="mb-2 text-[10px] font-medium text-slate-400">
              细分市场占比
            </p>
            <DonutChart />
          </div>
        </div>

        {/* Floating AI card */}
        <div className="absolute -bottom-3 -right-3 rounded-xl border border-indigo-200/60 bg-white/90 px-4 py-2.5 shadow-lg shadow-indigo-200/30 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="4 17 10 11 16 17 22 11" />
                <polyline points="14 11 22 11 22 5" />
              </svg>
            </span>
            <div>
              <p className="text-xs font-semibold text-slate-700">
                AI 分析中
              </p>
              <p className="text-[10px] text-slate-400">
                正在评估市场进入机会...
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Homepage                                                          */
/* ------------------------------------------------------------------ */

export default function Home() {
  return (
    <div className="relative min-h-screen">
      {/* Decorative wave line — top */}
      <svg
        className="pointer-events-none absolute left-0 top-0 z-0 h-64 w-full opacity-20"
        viewBox="0 0 1440 200"
        preserveAspectRatio="none"
      >
        <path
          d="M0,80 C200,20 400,140 600,80 C800,20 1000,120 1200,80 C1300,60 1400,40 1440,30 L1440,0 L0,0 Z"
          fill="url(#waveGrad)"
        />
        <defs>
          <linearGradient id="waveGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.1" />
          </linearGradient>
        </defs>
      </svg>

      {/* Hero section */}
      <section className="relative z-10 mx-auto flex max-w-6xl flex-col items-center gap-16 px-4 pb-20 pt-16 lg:flex-row lg:items-start lg:gap-12 lg:pt-24">
        {/* Left: Text + CTA */}
        <div className="flex flex-1 flex-col items-center text-center lg:items-start lg:pt-8 lg:text-left">
          {/* Tag */}
          <span className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-indigo-200/60 bg-indigo-50/70 px-4 py-1.5 text-xs font-medium tracking-wide text-indigo-600 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
            本地原型版 &middot; AI 市场调研报告生成工具
          </span>

          {/* Main heading */}
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
              Market Research AI
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mb-10 max-w-lg text-base leading-relaxed text-slate-500 sm:text-lg">
            输入目标国家、行业、产品与调研目的，快速生成结构化市场调研报告，
            帮助完成市场概况、竞争格局、机会风险与进入策略分析。
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-3">
            <Link
              href="/research"
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:from-indigo-700 hover:to-violet-700 hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-0.5"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              开始调研
            </Link>
            <Link
              href="/example"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/80 px-6 py-3.5 text-sm font-medium text-slate-700 shadow-sm backdrop-blur-sm transition-all hover:border-indigo-300 hover:bg-white hover:text-indigo-600 hover:shadow-md"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              查看示例报告
            </Link>
            <Link
              href="/history"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/80 px-6 py-3.5 text-sm font-medium text-slate-700 shadow-sm backdrop-blur-sm transition-all hover:border-indigo-300 hover:bg-white hover:text-indigo-600 hover:shadow-md"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              历史报告
            </Link>
          </div>
        </div>

        {/* Right: Dashboard preview */}
        <div className="flex flex-1 justify-center lg:justify-end">
          <DashboardCard />
        </div>
      </section>

      {/* Feature cards section */}
      <section className="relative z-10 mx-auto max-w-6xl px-4 pb-24">
        <div className="mb-10 text-center">
          <span className="mb-3 inline-flex rounded-full border border-indigo-200/60 bg-indigo-50/70 px-4 py-1 text-xs font-medium tracking-wide text-indigo-600 backdrop-blur-sm">
            核心能力
          </span>
          <h2 className="mt-4 text-2xl font-bold text-slate-800 sm:text-3xl">
            为出海企业打造的专业调研工具
          </h2>
          <p className="mt-3 text-sm text-slate-500">
            从市场分析到进入策略，一站式生成结构化调研报告
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="group relative overflow-hidden rounded-2xl border border-white/60 bg-white/70 p-8 shadow-lg shadow-indigo-100/20 backdrop-blur-xl transition-all hover:-translate-y-1.5 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-200/30"
            >
              {/* Card inner glow */}
              <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-50/20 via-white/0 to-violet-50/20 opacity-0 transition-opacity group-hover:opacity-100" />

              <div className="relative">
                <div
                  className={`mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${f.bg} ${f.iconColor} shadow-sm`}
                >
                  {f.icon}
                </div>
                <h3 className="mb-3 text-lg font-semibold text-slate-900">
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-500">
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
