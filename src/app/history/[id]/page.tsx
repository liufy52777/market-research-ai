"use client";

import { useSyncExternalStore, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

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

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export default function ReportDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const reports = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const report = reports.find((r) => r.id === id) ?? null;

  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!report) return;
    try {
      await navigator.clipboard.writeText(report.reportText);
      setCopied(true);
    } catch {
      // Clipboard write failed — silently ignore
    }
  };

  const handleDownloadMarkdown = () => {
    if (!report) return;
    const md = [
      "# 市场调研报告",
      "",
      "## 基本信息",
      `- 目标国家 / 地区：${report.country}`,
      `- 行业：${report.industry}`,
      `- 具体产品：${report.product}`,
      `- 企业身份：${report.role}`,
      `- 调研目的：${report.purpose}`,
      `- 生成时间：${report.createdAt}`,
      "",
      "## 报告正文",
      "",
      report.reportText,
    ].join("\n");

    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${report.country}-${report.industry}-${report.product}-市场调研报告.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Not found
  if (report === null) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-white to-zinc-100/50 px-4 py-16">
        <div className="rounded-xl border border-zinc-200 bg-white p-10 text-center shadow-sm">
          <h1 className="mb-3 text-xl font-bold text-zinc-900">未找到该报告</h1>
          <p className="mb-6 text-sm text-zinc-500">
            该报告可能已被删除，或链接无效。
          </p>
          <Link
            href="/history"
            className="inline-block rounded-lg bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-zinc-800 hover:shadow-md"
          >
            返回历史报告
          </Link>
        </div>
      </div>
    );
  }

  // Found
  return (
    <div className="flex min-h-screen flex-col items-center bg-gradient-to-b from-white to-zinc-100/50 px-4 py-16">
      <div className="mx-auto w-full max-w-3xl">
        {/* Navigation */}
        <Link
          href="/history"
          className="mb-8 inline-flex items-center gap-1 text-sm text-zinc-400 transition-colors hover:text-zinc-600"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          返回历史报告
        </Link>

        {/* Report card */}
        <div className="rounded-xl border border-zinc-200 bg-white p-8 shadow-sm sm:p-10">
          {/* Header */}
          <h1 className="mb-2 text-2xl font-bold text-zinc-900 sm:text-3xl">
            {report.title}
          </h1>
          <p className="mb-6 text-sm text-zinc-400">{report.createdAt}</p>

          {/* Meta tags */}
          <div className="mb-8 flex flex-wrap gap-2">
            <span className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm text-blue-700">
              {report.country}
            </span>
            <span className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm text-blue-700">
              {report.industry}
            </span>
            <span className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm text-blue-700">
              {report.product}
            </span>
            <span className="inline-flex rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-sm text-zinc-600">
              {report.role}
            </span>
            <span className="inline-flex rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-sm text-zinc-600">
              {report.purpose}
            </span>
          </div>

          {/* Divider */}
          <div className="mb-8 border-t border-zinc-100" />

          {/* Full report text */}
          <div className="whitespace-pre-line text-sm leading-7 text-zinc-700">
            {report.reportText}
          </div>

          {/* Actions */}
          <div className="mt-10 flex items-center gap-3 border-t border-zinc-100 pt-8">
            <button
              onClick={handleCopy}
              className="rounded-lg bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-zinc-800 hover:shadow-md"
            >
              复制完整报告
            </button>
            <button
              onClick={handleDownloadMarkdown}
              className="rounded-lg border border-zinc-300 bg-white px-6 py-2.5 text-sm font-medium text-zinc-700 shadow-sm transition-all hover:bg-zinc-50 hover:border-zinc-400"
            >
              导出 Markdown
            </button>
            {copied && (
              <span className="text-sm text-emerald-600">已复制</span>
            )}
          </div>
        </div>

        <div className="h-16" />
      </div>
    </div>
  );
}
