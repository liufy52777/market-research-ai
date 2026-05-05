"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { MouseEvent } from "react";

const STORAGE_KEY = "market-research-reports";

type ReportRecord = {
  id: string;
  title: string;
  country: string;
  industry: string;
  product: string;
  role: string;
  purpose: string;
  reportText: string;
  createdAt: string;
  model?: string;
};

function readReports(): ReportRecord[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed;
  } catch {
    return [];
  }
}

function getSummary(text: string) {
  if (!text) {
    return "";
  }

  return text.length > 120 ? `${text.slice(0, 120)}...` : text;
}

export default function HistoryPage() {
  const router = useRouter();
  const [reports, setReports] = useState<ReportRecord[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const savedReports = readReports();

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReports(savedReports);
     
    setLoaded(true);
  }, []);

  async function handleCopy(
    event: MouseEvent<HTMLButtonElement>,
    report: ReportRecord,
  ) {
    event.stopPropagation();

    try {
      await navigator.clipboard.writeText(report.reportText);
      setCopiedId(report.id);

      window.setTimeout(() => {
        setCopiedId(null);
      }, 2000);
    } catch {
      setCopiedId(null);
    }
  }

  function handleDelete(event: MouseEvent<HTMLButtonElement>, reportId: string) {
    event.stopPropagation();

    const nextReports = reports.filter((report) => report.id !== reportId);
    setReports(nextReports);

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextReports));
    } catch {
      // localStorage 写入失败时，页面状态仍然保持已删除
    }
  }

  function handleOpen(reportId: string) {
    router.push(`/history/${reportId}`);
  }

  return (
    <main className="min-h-screen px-6 py-12 text-slate-900">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">历史报告</h1>
            <p className="mt-4 text-lg text-slate-500">
              这里保存了你在当前浏览器中生成过的市场调研报告。
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/"
              className="rounded-xl border border-slate-200 bg-white/70 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm backdrop-blur-sm transition-all hover:border-blue-300 hover:text-blue-700 hover:shadow-md"
            >
              返回首页
            </Link>
            <Link
              href="/research"
              className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:from-blue-700 hover:to-cyan-600 hover:shadow-xl hover:shadow-blue-500/30"
            >
              开始新调研
            </Link>
          </div>
        </div>

        {!loaded ? (
          <div className="rounded-2xl border border-slate-200/80 bg-white/70 p-8 text-center shadow-sm backdrop-blur-sm">
            <p className="text-slate-500">正在加载历史报告...</p>
          </div>
        ) : reports.length === 0 ? (
          <div className="rounded-2xl border border-slate-200/80 bg-white/70 p-10 text-center shadow-sm backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-slate-900">暂无历史报告</h2>
            <p className="mt-4 text-slate-500">
              请先生成一份市场调研报告。
            </p>
            <Link
              href="/research"
              className="mt-6 inline-flex rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:from-blue-700 hover:to-cyan-600 hover:shadow-xl hover:shadow-blue-500/30"
            >
              开始调研
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {reports.map((report) => (
              <article
                key={report.id}
                role="button"
                tabIndex={0}
                onClick={() => handleOpen(report.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleOpen(report.id);
                  }
                }}
                className="cursor-pointer rounded-2xl border border-slate-200/80 bg-white/70 p-6 shadow-sm backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-100/30"
              >
                <div className="flex flex-col justify-between gap-4 sm:flex-row">
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-slate-900">{report.title}</h2>
                    <p className="mt-2 text-sm text-slate-400">
                      {report.createdAt}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2 text-sm">
                      <span className="rounded-full border border-blue-200/60 bg-blue-50/60 px-3 py-1 text-blue-700">
                        {report.country}
                      </span>
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-slate-600">
                        {report.industry}
                      </span>
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-slate-600">
                        {report.product}
                      </span>
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-slate-600">
                        {report.purpose}
                      </span>
                      {report.model && (
                        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-400">
                          模型：{report.model}
                        </span>
                      )}
                    </div>

                    <p className="mt-5 leading-7 text-slate-600">
                      {getSummary(report.reportText)}
                    </p>
                  </div>

                  <div className="flex shrink-0 gap-3 sm:flex-col">
                    <button
                      type="button"
                      onClick={(event) => {
                        void handleCopy(event, report);
                      }}
                      className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:from-blue-700 hover:to-cyan-600"
                    >
                      {copiedId === report.id ? "已复制" : "复制报告"}
                    </button>

                    <button
                      type="button"
                      onClick={(event) => handleDelete(event, report.id)}
                      className="rounded-xl border border-red-200 bg-white/70 px-4 py-2 text-sm font-medium text-red-500 shadow-sm backdrop-blur-sm transition-all hover:bg-red-50 hover:border-red-300 hover:text-red-600"
                    >
                      删除
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
