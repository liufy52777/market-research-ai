import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-white to-zinc-100/50 px-4 py-16">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center text-center">
        {/* Tag */}
        <span className="mb-8 inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-xs font-medium text-slate-500 tracking-wide">
          本地原型版 &middot; AI 市场调研报告生成工具
        </span>

        {/* Main Heading */}
        <h1 className="mb-6 text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl">
          Market Research AI
        </h1>

        {/* Subtitle */}
        <p className="mb-10 max-w-2xl text-lg leading-relaxed text-zinc-500 sm:text-xl">
          输入目标国家、行业、产品与调研目的，快速生成结构化市场调研报告，
          帮助完成市场概况、竞争格局、机会风险与进入策略分析。
        </p>

        {/* Buttons */}
        <div className="mb-20 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/research"
            className="rounded-lg bg-zinc-900 px-8 py-3 text-base font-medium text-white shadow-sm transition-all hover:bg-zinc-800 hover:shadow-md"
          >
            开始调研
          </Link>
          <Link
            href="/example"
            className="rounded-lg border border-zinc-300 bg-white px-8 py-3 text-base font-medium text-zinc-700 shadow-sm transition-all hover:bg-zinc-50 hover:border-zinc-400"
          >
            查看示例报告
          </Link>
          <Link
            href="/history"
            className="rounded-lg border border-zinc-300 bg-white px-8 py-3 text-base font-medium text-zinc-700 shadow-sm transition-all hover:bg-zinc-50 hover:border-zinc-400"
          >
            历史报告
          </Link>
        </div>

        {/* Feature Cards */}
        <div className="grid w-full gap-6 sm:grid-cols-3">
          <div className="group rounded-xl border border-zinc-200 bg-white p-8 text-left shadow-sm transition-all hover:border-blue-200 hover:shadow-md">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
            <h3 className="mb-3 text-lg font-semibold text-zinc-900">结构化报告</h3>
            <p className="text-sm leading-relaxed text-zinc-500">
              自动生成执行摘要、市场概况、客户结构、竞争格局与进入建议。
            </p>
          </div>

          <div className="group rounded-xl border border-zinc-200 bg-white p-8 text-left shadow-sm transition-all hover:border-blue-200 hover:shadow-md">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </div>
            <h3 className="mb-3 text-lg font-semibold text-zinc-900">适合出海调研</h3>
            <p className="text-sm leading-relaxed text-zinc-500">
              适用于汽车零部件、智能制造、装备制造等行业的海外市场初步分析。
            </p>
          </div>

          <div className="group rounded-xl border border-zinc-200 bg-white p-8 text-left shadow-sm transition-all hover:border-blue-200 hover:shadow-md">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 4 23 10 17 10" />
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
              </svg>
            </div>
            <h3 className="mb-3 text-lg font-semibold text-zinc-900">可持续升级</h3>
            <p className="text-sm leading-relaxed text-zinc-500">
              后续可扩展联网搜索、来源引用、历史报告、PDF 导出与用户系统。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
