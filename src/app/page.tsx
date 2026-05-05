import Link from "next/link";

/* ================================================================== */
/*  Inline SVG Icons                                                   */
/* ================================================================== */

const SparklesIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3z" /><path d="M19 3l.5 2L21 5.5 19.5 6 19 8l-.5-2L17 5.5 18.5 5 19 3z" /><path d="M5 17l.5 2L7 19.5 5.5 20 5 22l-.5-2L3 19.5 4.5 19 5 17z" />
  </svg>
);

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const FileIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
  </svg>
);

const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);

const DocIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);

const GlobeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const RefreshIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
  </svg>
);

/* ================================================================== */
/*  Feature cards data                                                 */
/* ================================================================== */

const features = [
  { icon: <DocIcon />, bg: "from-blue-500/10 to-cyan-400/10", iconColor: "text-blue-600", title: "结构化报告", desc: "自动生成执行摘要、市场概况、客户结构、竞争格局与进入建议。" },
  { icon: <GlobeIcon />, bg: "from-emerald-500/10 to-teal-400/10", iconColor: "text-emerald-600", title: "适合出海调研", desc: "适用于汽车零部件、智能制造、装备制造等行业的海外市场初步分析。" },
  { icon: <RefreshIcon />, bg: "from-violet-500/10 to-purple-400/10", iconColor: "text-violet-600", title: "可持续升级", desc: "后续可扩展联网搜索、来源引用、历史报告、PDF 导出与用户系统。" },
];

/* ================================================================== */
/*  Dashboard — Line Chart (2021-2028 market size, SVG)                */
/* ================================================================== */

const lineData = [
  { year: "2021", val: 18.5 },
  { year: "2022", val: 23.7 },
  { year: "2023", val: 29.8 },
  { year: "2024E", val: 36.2 },
  { year: "2025E", val: 44.1 },
  { year: "2026E", val: 53.5 },
  { year: "2027E", val: 64.0 },
  { year: "2028E", val: 78.6 },
];

function LineChart() {
  const W = 470, H = 210, padL = 40, padR = 14, padT = 14, padB = 26;
  const xRange = W - padL - padR;
  const yMax = 80, yMin = 0;
  const yRange = H - padT - padB;
  const scaleX = (i: number) => padL + (i / (lineData.length - 1)) * xRange;
  const scaleY = (v: number) => padT + yRange - ((v - yMin) / (yMax - yMin)) * yRange;
  const pts = lineData.map((d, i) => `${scaleX(i)},${scaleY(d.val)}`).join(" ");
  const area = `0,${H - padB} ${pts} ${W - padR},${H - padB}`;

  return (
    <div>
      <p className="mb-2 text-[11px] font-medium text-slate-500">市场规模趋势（十亿美元）</p>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full">
        <defs>
          <linearGradient id="lcGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2f6bff" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#2f6bff" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Grid lines */}
        {[0, 20, 40, 60, 80].map((v) => (
          <g key={`grid-${v}`}>
            <line x1={padL} y1={scaleY(v)} x2={W - padR} y2={scaleY(v)} stroke="#e8ecf4" strokeWidth="0.8" />
            <text x={padL - 6} y={scaleY(v) + 4} textAnchor="end" className="fill-slate-400" style={{ fontSize: "9px" }}>{v}</text>
          </g>
        ))}
        {/* Area */}
        <polygon points={area} fill="url(#lcGrad)" />
        {/* Line */}
        <polyline points={pts} fill="none" stroke="#2f6bff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {/* Dots */}
        {lineData.map((d, i) => {
          const isLast = i === lineData.length - 1;
          return <circle key={i} cx={scaleX(i)} cy={scaleY(d.val)} r={isLast ? 4 : 2.5} fill={isLast ? "#2f6bff" : "#fff"} stroke="#2f6bff" strokeWidth={isLast ? 0 : 1.5} />;
        })}
        {/* X labels */}
        {lineData.map((d, i) => (
          <text key={`x-${i}`} x={scaleX(i)} y={H - 4} textAnchor="middle" className="fill-slate-400" style={{ fontSize: "8px" }}>{d.year}</text>
        ))}
      </svg>
    </div>
  );
}

/* ================================================================== */
/*  Dashboard — Donut Chart (segment breakdown, SVG)                   */
/* ================================================================== */

const donutData = [
  { label: "智能照明", pct: 28, color: "#2f6bff" },
  { label: "智能安防", pct: 24, color: "#7a5cff" },
  { label: "智能家电", pct: 20, color: "#21c7a8" },
  { label: "环境控制", pct: 16, color: "#ff9f43" },
  { label: "其他", pct: 12, color: "#b8c4d9" },
];

function DonutChart() {
  const r = 40, c = 50, circ = 2 * Math.PI * r;
  // Compute cumulative totals immutably
  const cumSums = donutData.map((_, i) =>
    donutData.slice(0, i + 1).reduce((s, seg) => s + seg.pct, 0),
  );
  const segments = donutData.map((seg, i) => {
    const start = i > 0 ? cumSums[i - 1] : 0;
    const dash = (seg.pct / 100) * circ;
    const off = (start / 100) * circ;
    return { ...seg, dash, off };
  });
  return (
    <div>
      <p className="mb-2 text-[11px] font-medium text-slate-500">细分市场占比</p>
      <div className="flex items-center gap-4">
        <div className="relative shrink-0">
          <svg width="100" height="100" viewBox="0 0 100 100">
            {segments.map((seg, i) => (
              <circle key={i} cx={c} cy={c} r={r} fill="none" stroke={seg.color} strokeWidth="10" strokeDasharray={`${seg.dash} ${circ - seg.dash}`} strokeDashoffset={-seg.off} transform="rotate(-90 50 50)" />
            ))}
            <text x={c} y={c} textAnchor="middle" dominantBaseline="central" className="fill-slate-800" style={{ fontSize: "16px", fontWeight: 700 }}>100%</text>
          </svg>
        </div>
        <div className="flex flex-col gap-1.5">
          {donutData.map((seg) => (
            <div key={seg.label} className="flex items-center gap-2 whitespace-nowrap text-[11px] text-slate-600">
              <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ backgroundColor: seg.color }} />
              <span>{seg.label}</span>
              <span className="ml-auto font-medium text-slate-800">{seg.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  Dashboard — KPI Cards                                              */
/* ================================================================== */

const kpis = [
  { label: "市场规模", value: "$48.7B", note: "+12.4% YoY", color: "text-[#2f6bff]" },
  { label: "年复合增长率", value: "18.6%", note: "2023-2028 预测", color: "text-emerald-600" },
  { label: "主要玩家", value: "32", note: "活跃企业", color: "text-amber-600" },
  { label: "机会评分", value: "8.7/10", note: "高潜力市场", color: "text-violet-600" },
];

/* ================================================================== */
/*  Dashboard — Full Preview Shell                                     */
/* ================================================================== */

function DashboardShell() {
  return (
    <div className="relative">
      {/* Backdrop shadow layers — depth illusion */}
      <div className="absolute -right-5 -top-5 h-full w-full rounded-[28px] bg-indigo-200/20 blur-lg" />
      <div className="absolute -left-4 -bottom-4 h-full w-full rounded-[28px] bg-violet-200/15 blur-lg" />
      <div className="absolute -right-2 -top-2 h-full w-full rounded-[26px] bg-blue-100/30 blur-sm" />

      {/* Main card */}
      <div className="relative flex rounded-[24px] border border-[#E6ECF7] bg-white/88 shadow-[0_40px_100px_rgba(47,107,255,0.20)] backdrop-blur-xl">
        {/* Left icon rail */}
        <div className="hidden w-[56px] shrink-0 flex-col items-center gap-5 border-r border-slate-100 bg-slate-50/60 py-5 sm:flex">
          <svg width="36" height="36" viewBox="0 0 44 44" fill="none" className="h-9 w-9 shrink-0">
            <defs>
              <linearGradient id="logoDash" x1="0.15" y1="0" x2="0.85" y2="1">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="35%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#7c3aed" />
              </linearGradient>
            </defs>
            <path d="M12 36 C16 24 19 14 22 8" fill="none" stroke="url(#logoDash)" strokeWidth="12" strokeLinecap="round" />
            <path d="M32 36 C28 24 25 14 22 8" fill="none" stroke="url(#logoDash)" strokeWidth="12" strokeLinecap="round" />
          </svg>
          {[
            <svg key="1" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 21 9 12 15 12 15 21" /></svg>,
            <svg key="2" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>,
            <svg key="3" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>,
            <svg key="4" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>,
            <svg key="5" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>,
          ].map((icon, i) => (
            <div key={i} className={`flex h-9 w-9 items-center justify-center rounded-xl transition-colors ${i === 1 ? "bg-blue-50 text-[#2f6bff]" : "text-slate-400 hover:text-slate-600"}`}>
              {icon}
            </div>
          ))}
        </div>

        {/* Main content */}
        <div className="flex-1 p-5 lg:px-6 lg:py-5">
          {/* Header */}
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h3 className="text-base font-bold text-[#102247]">东南亚智能家居 市场调研报告</h3>
              <p className="mt-1 text-xs text-[#6E7B96]">2025 Q2 · AI 生成</p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              已完成
            </span>
          </div>

          {/* KPI Row */}
          <div className="mb-4 grid grid-cols-4 gap-2.5">
            {kpis.map((k) => (
              <div key={k.label} className="rounded-xl border border-[#E6ECF7] bg-white/80 p-2.5 backdrop-blur-sm">
                <p className="text-[11px] text-[#6E7B96]">{k.label}</p>
                <p className={`mt-0.5 text-sm font-bold ${k.color}`}>{k.value}</p>
                <p className="text-[10px] text-slate-400">{k.note}</p>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid gap-4 sm:grid-cols-[1.3fr_1fr]">
            <div className="rounded-xl border border-[#E6ECF7]/70 bg-white/50 p-3.5 backdrop-blur-sm">
              <LineChart />
            </div>
            <div className="rounded-xl border border-[#E6ECF7]/70 bg-white/50 p-3.5 backdrop-blur-sm">
              <DonutChart />
            </div>
          </div>
        </div>
      </div>

      {/* Floating AI card */}
      <div className="absolute -bottom-8 right-4 z-10 rounded-2xl border border-indigo-200/60 bg-white/94 px-4 py-3 shadow-[0_20px_50px_rgba(47,107,255,0.15)] backdrop-blur-lg">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#2f6bff] to-[#7a5cff] shadow-sm">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
            </svg>
          </span>
          <div>
            <p className="text-xs font-semibold text-slate-700">AI 分析中</p>
            <p className="text-[10px] text-[#6E7B96]">正在评估市场进入机会</p>
          </div>
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#16c784" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 20 4 12" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  Homepage                                                          */
/* ================================================================== */

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Decorative top wave */}
      <svg className="pointer-events-none absolute left-0 right-0 top-0 z-0 h-52 w-full opacity-[0.10]" viewBox="0 0 1440 200" preserveAspectRatio="none">
        <path d="M0,60 C240,10 480,110 720,70 C960,30 1200,100 1440,50 L1440,0 L0,0 Z" fill="url(#wGrad)" />
        <defs>
          <linearGradient id="wGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#2f6bff" stopOpacity="0.7" />
            <stop offset="50%" stopColor="#7a5cff" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.15" />
          </linearGradient>
        </defs>
      </svg>

      {/* Mid-flow decorative wave — behind Dashboard area */}
      <svg className="pointer-events-none absolute left-0 right-0 top-[28%] z-0 h-64 w-full opacity-[0.12]" viewBox="0 0 1440 280" preserveAspectRatio="none">
        <defs>
          <linearGradient id="wGrad2" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#7a5cff" stopOpacity="0.5" />
            <stop offset="40%" stopColor="#2f6bff" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <path d="M0,120 C200,40 400,200 720,110 C1040,20 1300,170 1440,100 L1440,280 L0,280 Z" fill="url(#wGrad2)" />
        <path d="M0,160 C180,70 380,190 700,130 C1020,70 1280,180 1440,120 L1440,280 L0,280 Z" fill="url(#wGrad2)" opacity="0.5" />
      </svg>

      {/* Hero Section */}
      <section className="relative z-10 mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-10 px-6 pb-10 pt-12 lg:grid-cols-[0.95fr_1.05fr] lg:pb-14 lg:pt-20 xl:gap-12 xl:px-8">
        {/* Left: Hero text */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <span className="mb-7 inline-flex items-center gap-1.5 rounded-full border border-blue-200/60 bg-blue-50/70 px-4 py-1.5 text-xs font-medium tracking-wide text-blue-600 backdrop-blur-sm">
            <SparklesIcon />
            本地原型版 · AI 市场调研报告生成工具
          </span>

          <h1 className="text-5xl font-extrabold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl lg:leading-[1.05]">
            <span className="text-[#102247]">Market</span>
            <br />
            <span className="text-[#102247]">Research </span>
            <span className="bg-gradient-to-r from-[#2f6bff] to-[#7a5cff] bg-clip-text text-transparent">AI</span>
          </h1>

          <p className="mt-6 max-w-md text-base leading-relaxed text-[#6E7B96] sm:text-lg sm:leading-relaxed">
            输入目标国家、行业、产品与调研目的，快速生成结构化市场调研报告，帮助完成市场概况、竞争格局、机会风险与进入策略分析。
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/research" className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#2f6bff] to-[#7a5cff] px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:from-[#2560e0] hover:to-[#6948e8] hover:shadow-xl hover:shadow-indigo-500/35 hover:-translate-y-0.5">
              <SearchIcon /> 开始调研
            </Link>
            <Link href="/example" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/80 px-6 py-3.5 text-sm font-medium text-slate-700 shadow-sm backdrop-blur-sm transition-all hover:border-indigo-300 hover:bg-white hover:text-indigo-600 hover:shadow-md">
              <FileIcon /> 查看示例报告
            </Link>
            <Link href="/history" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/80 px-6 py-3.5 text-sm font-medium text-slate-700 shadow-sm backdrop-blur-sm transition-all hover:border-indigo-300 hover:bg-white hover:text-indigo-600 hover:shadow-md">
              <ClockIcon /> 历史报告
            </Link>
          </div>
        </div>

        {/* Right: Dashboard */}
        <div className="relative flex w-full justify-center lg:justify-end">
          {/* Dashboard halo orb */}
          <div className="pointer-events-none absolute -right-16 top-12 h-72 w-72 rounded-full bg-gradient-to-br from-indigo-400/10 to-violet-400/8 blur-3xl" />
          <div className="w-full max-w-[720px] xl:max-w-[760px]"><DashboardShell /></div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="relative z-10 mx-auto max-w-6xl px-5 pb-16">
        <div className="mb-8 text-center">
          <span className="inline-flex rounded-full border border-indigo-200/60 bg-indigo-50/70 px-4 py-1 text-xs font-medium tracking-wide text-indigo-600 backdrop-blur-sm">核心能力</span>
          <h2 className="mt-3 text-2xl font-extrabold text-slate-800 sm:text-3xl">为出海企业打造的专业调研工具</h2>
          <p className="mt-2 text-sm text-slate-500">从市场分析到进入策略，一站式生成结构化调研报告</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="group relative overflow-hidden rounded-[22px] border border-[#E6ECF7] bg-white/80 px-6 py-5 shadow-[0_4px_20px_rgba(47,107,255,0.06)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200/60 hover:shadow-[0_12px_36px_rgba(47,107,255,0.12)]">
              <div className="pointer-events-none absolute inset-0 rounded-[22px] bg-gradient-to-br from-indigo-50/25 via-white/0 to-violet-50/25 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="relative flex flex-col">
                <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${f.bg} ${f.iconColor} shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:scale-105`}>{f.icon}</div>
                <h3 className="mb-2 text-lg font-semibold text-slate-900">{f.title}</h3>
                <p className="text-sm leading-relaxed text-slate-500">{f.desc}</p>
                {/* Arrow indicator */}
                <div className="mt-3 flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:text-indigo-500 group-hover:border-indigo-200 group-hover:shadow-sm group-hover:translate-x-0.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
