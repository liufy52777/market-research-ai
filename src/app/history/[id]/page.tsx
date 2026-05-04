"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

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
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
      <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900">
        <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
          <p className="text-slate-600">正在加载报告...</p>
        </div>
      </main>
    );
  }

  if (!report) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900">
        <div className="mx-auto max-w-4xl rounded-2xl bg-white p-10 text-center shadow-sm ring-1 ring-slate-200">
          <h1 className="text-3xl font-bold">未找到该报告</h1>
          <p className="mt-4 text-slate-600">
            该报告可能已被删除，或当前浏览器中没有对应的历史记录。
          </p>
          <Link
            href="/history"
            className="mt-6 inline-flex rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-700"
          >
            返回历史报告
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/history"
          className="text-sm font-medium text-slate-500 hover:text-slate-900"
        >
          返回历史报告
        </Link>

        <div className="mt-8 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <div className="flex flex-col justify-between gap-5 border-b border-slate-200 pb-6 sm:flex-row sm:items-start">
            <div>
              <h1 className="text-3xl font-bold">{report.title}</h1>
              <p className="mt-3 text-sm text-slate-500">
                创建时间：{report.createdAt}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  void handleCopy();
                }}
                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-700"
              >
                {copied ? "已复制" : "复制完整报告"}
              </button>

              <button
                type="button"
                onClick={handleExportMarkdown}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-100"
              >
                导出 Markdown
              </button>
            </div>
          </div>

          <section className="mt-6 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
            <p>
              <span className="font-semibold text-slate-900">国家 / 地区：</span>
              {report.country}
            </p>
            <p>
              <span className="font-semibold text-slate-900">行业：</span>
              {report.industry}
            </p>
            <p>
              <span className="font-semibold text-slate-900">产品：</span>
              {report.product}
            </p>
            <p>
              <span className="font-semibold text-slate-900">企业身份：</span>
              {report.role}
            </p>
            <p className="sm:col-span-2">
              <span className="font-semibold text-slate-900">调研目的：</span>
              {report.purpose}
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-bold">完整报告正文</h2>
            <div className="mt-5 whitespace-pre-line rounded-2xl bg-slate-50 p-6 leading-8 text-slate-700 ring-1 ring-slate-200">
              {report.reportText}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
