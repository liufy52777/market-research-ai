"use client";

import { useSyncExternalStore, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ReportRecord {
  id: string;
  title: string;
  country: string;
  industry: string;
  product: string;
  role: string;
  purpose: string;
  reportText: string;
  createdAt: string;
}

const STORAGE_KEY = "market-research-reports";

/* ------------------------------------------------------------------ */
/*  localStorage-backed external store (for useSyncExternalStore)     */
/* ------------------------------------------------------------------ */

let listeners: (() => void)[] = [];

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

function subscribe(cb: () => void) {
  listeners = [...listeners, cb];
  return () => {
    listeners = listeners.filter((l) => l !== cb);
  };
}

function getSnapshot(): ReportRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function getServerSnapshot(): ReportRecord[] {
  return [];
}

function writeReports(reports: ReportRecord[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  emitChange();
}

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export default function HistoryPage() {
  const router = useRouter();
  const reports = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    writeReports(reports.filter((r) => r.id !== id));
  };

  const handleCopy = async (e: React.MouseEvent, report: ReportRecord) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(report.reportText);
      setCopiedId(report.id);
    } catch {
      // Clipboard write failed — silently ignore
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-gradient-to-b from-white to-zinc-100/50 px-4 py-16">
      <div className="mx-auto w-full max-w-3xl">
        {/* Navigation */}
        <div className="mb-8 flex items-center gap-4 text-sm">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-zinc-400 transition-colors hover:text-zinc-600"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            返回首页
          </Link>
          <span className="text-zinc-300">|</span>
          <Link
            href="/research"
            className="text-blue-600 transition-colors hover:text-blue-700"
          >
            开始新调研 →
          </Link>
        </div>

        {/* Header */}
        <h1 className="mb-3 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
          历史报告
        </h1>
        <p className="mb-10 text-base leading-relaxed text-zinc-500">
          这里保存了你在当前浏览器中生成过的市场调研报告。
        </p>

        {/* Empty state */}
        {reports.length === 0 && (
          <div className="rounded-xl border border-zinc-200 bg-white p-10 text-center shadow-sm">
            <p className="mb-6 text-zinc-500">
              暂无历史报告，请先生成一份市场调研报告。
            </p>
            <Link
              href="/research"
              className="inline-block rounded-lg bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-zinc-800 hover:shadow-md"
            >
              开始调研
            </Link>
          </div>
        )}

        {/* Report list */}
        {reports.length > 0 && (
          <div className="space-y-4">
            {reports.map((report) => (
              <div
                key={report.id}
                onClick={() => router.push(`/history/${report.id}`)}
                className="cursor-pointer rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:border-blue-300 hover:shadow-md"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <h3 className="mb-2 text-lg font-semibold text-zinc-900">
                      {report.title}
                    </h3>
                    <p className="mb-3 text-xs text-zinc-400">{report.createdAt}</p>
                    <div className="mb-3 flex flex-wrap gap-2">
                      <span className="inline-flex rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-0.5 text-xs text-zinc-600">
                        {report.country}
                      </span>
                      <span className="inline-flex rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-0.5 text-xs text-zinc-600">
                        {report.industry}
                      </span>
                      <span className="inline-flex rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-0.5 text-xs text-zinc-600">
                        {report.product}
                      </span>
                      <span className="inline-flex rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-0.5 text-xs text-zinc-600">
                        {report.purpose}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-zinc-500 line-clamp-3">
                      {report.reportText.slice(0, 120)}
                      {report.reportText.length > 120 ? "…" : ""}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2 sm:flex-col">
                    <button
                      onClick={(e) => handleCopy(e, report)}
                      className="rounded-lg bg-zinc-900 px-4 py-2 text-xs font-medium text-white shadow-sm transition-all hover:bg-zinc-800"
                    >
                      {copiedId === report.id ? "已复制" : "复制报告"}
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, report.id)}
                      className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-xs font-medium text-red-600 shadow-sm transition-all hover:bg-red-50 hover:border-red-300"
                    >
                      删除
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="h-16" />
      </div>
    </div>
  );
}
