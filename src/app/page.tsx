import Link from "next/link";

const features = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
    bg: "from-blue-500/10 to-cyan-400/10",
    iconColor: "text-blue-600",
    title: "结构化报告",
    desc: "自动生成执行摘要、市场概况、客户结构、竞争格局与进入建议。",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
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
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
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

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-20">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center text-center">
        {/* Tag */}
        <span className="mb-10 inline-flex items-center gap-1.5 rounded-full border border-blue-200/60 bg-blue-50/70 px-4 py-1.5 text-xs font-medium tracking-wide text-blue-700 backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
          本地原型版 &middot; AI 市场调研报告生成工具
        </span>

        {/* Main Heading */}
        <h1 className="mb-6 bg-gradient-to-b from-slate-900 to-slate-700 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent sm:text-6xl lg:text-7xl">
          Market Research AI
        </h1>

        {/* Subtitle */}
        <p className="mb-12 max-w-2xl text-lg leading-relaxed text-slate-500 sm:text-xl">
          输入目标国家、行业、产品与调研目的，快速生成结构化市场调研报告，
          帮助完成市场概况、竞争格局、机会风险与进入策略分析。
        </p>

        {/* Buttons */}
        <div className="mb-24 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/research"
            className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-9 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:from-blue-700 hover:to-cyan-600 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5"
          >
            开始调研
          </Link>
          <Link
            href="/example"
            className="rounded-xl border border-slate-200 bg-white/70 px-9 py-3.5 text-base font-medium text-slate-700 shadow-sm backdrop-blur-sm transition-all hover:border-blue-300 hover:bg-white hover:text-blue-700 hover:shadow-md"
          >
            查看示例报告
          </Link>
          <Link
            href="/history"
            className="rounded-xl border border-slate-200 bg-white/70 px-9 py-3.5 text-base font-medium text-slate-700 shadow-sm backdrop-blur-sm transition-all hover:border-blue-300 hover:bg-white hover:text-blue-700 hover:shadow-md"
          >
            历史报告
          </Link>
        </div>

        {/* Feature Cards */}
        <div className="grid w-full gap-6 sm:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-slate-200/80 bg-white/70 p-8 text-left shadow-sm backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-100/30"
            >
              <div
                className={`mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${f.bg} ${f.iconColor}`}
              >
                {f.icon}
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-900">
                {f.title}
              </h3>
              <p className="text-sm leading-relaxed text-slate-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
