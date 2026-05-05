"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { ReportRecord } from "@/lib/types";
import { readReports } from "@/lib/storage";

function buildMarkdown(report: ReportRecord) {
  return `# 市场调研报告

## 基本信息

- 目标国家 / 地区：${report.country}
- 行业：${report.industry}
- 具体产品：${report.product}
- 企业身份：${report.role}
- 调研目的：${report.purpose}
- 生成时间：${report.createdAt}

## 报告正文

${report.reportText}
`;
}

function buildFileName(report: ReportRecord) {
  const rawName = `${report.country}-${report.industry}-${report.product}-市场调研报告.md`;
  return rawName.replace(/[\\/:*?"<>|]/g, "_");
}

export default function HistoryDetailPage() {
  const params = useParams();
  const rawId = params.id;
  const id =
    typeof rawId === "string" ? rawId : Array.isArray(rawId) ? rawId[0] : "";

  const [report, setReport] = useState<ReportRecord | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const found = readReports().find((item) => item.id === id) ?? null;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReport(found);
     
    setLoaded(true);
  }, [id]);

  async function handleCopy() {
    if (!report) {
      return;
    }

    try {
      await navigator.clipboard.writeText(report.reportText);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setCopied(false);
    }
  }

  function handleExportMarkdown() {
    if (!report) {
      return;
    }

    const markdown = buildMarkdown(report);
    const blob = new Blob([markdown], {
      type: "text/markdown;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = buildFileName(report);
    link.click();

    URL.revokeObjectURL(url);
  }

  if (!loaded) {
    return (
      <main className="min-h-screen px-6 py-12 text-slate-900">
        <div className="mx-auto max-w-4xl rounded-2xl border border-slate-200/80 bg-white/70 p-8 text-center shadow-sm backdrop-blur-sm">
          <p className="text-slate-500">正在加载报告...</p>
        </div>
      </main>
    );
  }

  if (!report) {
    return (
      <main className="min-h-screen px-6 py-12 text-slate-900">
        <div className="mx-auto max-w-4xl rounded-2xl border border-slate-200/80 bg-white/70 p-10 text-center shadow-sm backdrop-blur-sm">
          <h1 className="text-3xl font-bold text-slate-900">未找到该报告</h1>
          <p className="mt-4 text-slate-500">
            该报告可能已被删除，或当前浏览器中没有对应的历史记录。
          </p>
          <Link
            href="/history"
            className="mt-6 inline-flex rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:from-blue-700 hover:to-cyan-600"
          >
            返回历史报告
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-12 text-slate-900">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/history"
          className="inline-flex items-center gap-1 text-sm font-medium text-slate-400 transition-colors hover:text-slate-600"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          返回历史报告
        </Link>

        <div className="mt-8 rounded-2xl border border-slate-200/80 bg-white/80 p-8 shadow-sm backdrop-blur-sm sm:p-10">
          <div className="flex flex-col justify-between gap-5 border-b border-slate-100 pb-6 sm:flex-row sm:items-start">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{report.title}</h1>
              <p className="mt-3 text-sm text-slate-400">
                创建时间：{report.createdAt}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  void handleCopy();
                }}
                className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:from-blue-700 hover:to-cyan-600"
              >
                {copied ? "已复制" : "复制完整报告"}
              </button>

              <button
                type="button"
                onClick={handleExportMarkdown}
                className="rounded-xl border border-slate-200 bg-white/70 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm backdrop-blur-sm transition-all hover:border-blue-300 hover:text-blue-700 hover:shadow-md"
              >
                导出 Markdown
              </button>
            </div>
          </div>

          <section className="mt-6 rounded-xl bg-gradient-to-br from-slate-50 to-blue-50/40 p-5">
            <h3 className="mb-3 text-sm font-semibold text-slate-700">报告概览</h3>
            <div className="grid gap-3 text-sm sm:grid-cols-2">
              <p>
                <span className="font-semibold text-slate-800">目标市场：</span>
                <span className="text-slate-600">{report.country}</span>
              </p>
              <p>
                <span className="font-semibold text-slate-800">行业：</span>
                <span className="text-slate-600">{report.industry}</span>
              </p>
              <p>
                <span className="font-semibold text-slate-800">产品：</span>
                <span className="text-slate-600">{report.product}</span>
              </p>
              <p>
                <span className="font-semibold text-slate-800">企业身份：</span>
                <span className="text-slate-600">{report.role}</span>
              </p>
              <p className="sm:col-span-2">
                <span className="font-semibold text-slate-800">调研目的：</span>
                <span className="text-slate-600">{report.purpose}</span>
              </p>
              <p>
                <span className="font-semibold text-slate-800">生成模式：</span>
                <span className="text-slate-600">{report.generationMode || report.mode || "未记录"}</span>
              </p>
              <p>
                <span className="font-semibold text-slate-800">生成模型：</span>
                <span className="text-slate-600">{report.model || "未记录"}</span>
              </p>
              <p>
                <span className="font-semibold text-slate-800">联网搜索：</span>
                {report.webSearchEnabled ? (
                  <span className="text-emerald-600">已启用</span>
                ) : (
                  <span className="text-slate-400">{report.webSearchEnabled === false ? "未启用" : "未记录"}</span>
                )}
              </p>
              {report.warning && (
                <p className="sm:col-span-2">
                  <span className="font-semibold text-amber-700">警告：</span>
                  <span className="text-amber-700">{report.warning}</span>
                </p>
              )}
            </div>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-bold text-slate-900">完整报告正文</h2>
            <div className="mt-5 whitespace-pre-line rounded-2xl border border-slate-100 bg-white p-6 leading-8 text-slate-700 shadow-sm">
              {report.reportText}
            </div>
          </section>

          {report.sources && report.sources.length > 0 && (
            <section className="mt-8">
              <h2 className="text-xl font-bold text-slate-900">参考来源</h2>
              <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50/80 p-5">
                <ul className="space-y-2">
                  {report.sources.map((s, i) => (
                    <li key={i} className="text-xs leading-relaxed text-slate-500">
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-blue-600 hover:text-blue-700"
                      >
                        {s.title || s.url}
                      </a>
                      {s.snippet && (
                        <span className="ml-2 text-slate-400">
                          — {s.snippet.slice(0, 120)}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
