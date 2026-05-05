"use client";

import { useState } from "react";
import Link from "next/link";
import type { FormData, ReportRecord, ApiResponse, SearchSource } from "@/lib/types";
import { writeReports, readReports, MAX_REPORTS } from "@/lib/storage";

const emptyForm: FormData = {
  country: "",
  industry: "",
  product: "",
  identity: "",
  purpose: "",
};

interface SaveToHistoryParams {
  data: FormData;
  reportText: string;
  generationMode?: string;
  model?: string;
  warning?: string;
  webSearchEnabled?: boolean;
  sources?: SearchSource[];
}

function saveToHistory(params: SaveToHistoryParams): void {
  const { data, reportText, generationMode, model, warning, webSearchEnabled, sources } = params;
  const record: ReportRecord = {
    id: Date.now().toString(),
    title: `${data.country} ${data.industry} ${data.product} 调研报告`,
    country: data.country,
    industry: data.industry,
    product: data.product,
    role: data.identity,
    purpose: data.purpose,
    reportText,
    generationMode,
    model,
    warning,
    webSearchEnabled,
    sources,
    createdAt: new Date().toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }),
  };

  const existing = readReports();
  writeReports([record, ...existing].slice(0, MAX_REPORTS));
}

export default function ResearchPage() {
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [reportData, setReportData] = useState<FormData | null>(null);
  const [reportText, setReportText] = useState<string | null>(null);
  const [generationMode, setGenerationMode] = useState<string | null>(null);
  const [modelName, setModelName] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [webSearchEnabled, setWebSearchEnabled] = useState(false);
  const [sources, setSources] = useState<SearchSource[]>([]);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const clearReport = () => {
    setReportData(null);
    setReportText(null);
    setGenerationMode(null);
    setModelName(null);
    setWarning(null);
    setWebSearchEnabled(false);
    setSources([]);
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const hasEmpty = Object.values(formData).some((v) => v.trim() === "");
    if (hasEmpty) {
      setError("请先完整填写调研信息");
      clearReport();
      return;
    }

    setError("");
    setCopied(false);
    setIsGenerating(true);
    setGenerationMode(null);

    try {
      const res = await fetch("/api/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          country: formData.country.trim(),
          industry: formData.industry.trim(),
          product: formData.product.trim(),
          role: formData.identity.trim(),
          purpose: formData.purpose.trim(),
        }),
      });

      const json: ApiResponse = await res.json();

      if (!json.success) {
        setError(json.error);
        clearReport();
        return;
      }

      setReportText(json.reportText);
      setGenerationMode(json.generationMode ?? json.mode ?? null);
      setModelName(json.model ?? null);
      setWarning(json.warning ?? null);
      setWebSearchEnabled(json.webSearchEnabled ?? false);
      setSources(json.sources ?? []);
      setReportData({ ...formData });

      saveToHistory({
        data: formData,
        reportText: json.reportText,
        generationMode: json.generationMode ?? json.mode,
        model: json.model,
        warning: json.warning,
        webSearchEnabled: json.webSearchEnabled,
        sources: json.sources,
      });
    } catch {
      setError("报告生成失败，请稍后重试。");
      clearReport();
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!reportText) return;
    try {
      await navigator.clipboard.writeText(reportText);
      setCopied(true);
    } catch {
      // Clipboard write failed — silently ignore
    }
  };

  const handleReset = () => {
    setFormData({ ...emptyForm });
    clearReport();
    setError("");
    setCopied(false);
  };

  const handleDownloadMarkdown = () => {
    if (!reportData || !reportText) return;
    const now = new Date().toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
    const md = [
      "# 市场调研报告",
      "",
      "## 基本信息",
      `- 目标国家 / 地区：${reportData.country}`,
      `- 行业：${reportData.industry}`,
      `- 具体产品：${reportData.product}`,
      `- 企业身份：${reportData.identity}`,
      `- 调研目的：${reportData.purpose}`,
      `- 生成时间：${now}`,
      "",
      "## 报告正文",
      "",
      reportText,
    ];

    if (sources.length > 0) {
      md.push("", "## 参考来源", "");
      for (const s of sources) {
        md.push(`- ${s.title || s.url}${s.url ? `：${s.url}` : ""}`);
      }
    }

    const content = md.join("\n");

    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${reportData.country}-${reportData.industry}-${reportData.product}-市场调研报告.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex min-h-screen flex-col items-center px-4 py-16">
      <div className="mx-auto w-full max-w-3xl">
        {/* Back link */}
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-1 text-sm text-slate-400 transition-colors hover:text-slate-600"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          返回首页
        </Link>

        {/* Header */}
        <h1 className="mb-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          开始市场调研
        </h1>
        <p className="mb-10 text-base leading-relaxed text-slate-500">
          请填写目标市场与产品信息，系统将根据这些信息生成结构化市场调研报告。
        </p>

        {/* Form card */}
        <form
          className="space-y-6 rounded-2xl border border-slate-200/80 bg-white/70 p-6 shadow-sm backdrop-blur-sm sm:p-8"
          onSubmit={handleSubmit}
        >
          <TextInput
            label="目标国家 / 地区"
            placeholder="例如：摩洛哥"
            value={formData.country}
            onChange={(v) => handleChange("country", v)}
          />
          <TextInput
            label="行业"
            placeholder="例如：汽车零部件"
            value={formData.industry}
            onChange={(v) => handleChange("industry", v)}
          />
          <TextInput
            label="具体产品"
            placeholder="例如：汽车线束"
            value={formData.product}
            onChange={(v) => handleChange("product", v)}
          />
          <TextInput
            label="企业身份"
            placeholder="例如：中国汽车零部件供应商"
            value={formData.identity}
            onChange={(v) => handleChange("identity", v)}
          />
          <TextInput
            label="调研目的"
            placeholder="例如：判断是否适合进入当地市场"
            value={formData.purpose}
            onChange={(v) => handleChange("purpose", v)}
          />

          {error && (
            <p className="rounded-xl border border-red-200 bg-red-50/80 px-4 py-3 text-sm text-red-600 backdrop-blur-sm">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isGenerating}
            className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:from-blue-700 hover:to-cyan-600 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {isGenerating ? "正在生成..." : "生成调研报告"}
          </button>
        </form>

        {/* Loading state */}
        {isGenerating && (
          <div className="mt-12 rounded-2xl border border-slate-200/80 bg-white/70 p-8 text-center shadow-sm backdrop-blur-sm">
            <p className="text-slate-500">报告生成中，请稍候...</p>
          </div>
        )}

        {/* Report */}
        {!isGenerating && reportData && reportText && (
          <div className="mt-12 rounded-2xl border border-slate-200/80 bg-white/80 p-8 shadow-sm backdrop-blur-sm sm:p-10">
            <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-bold text-slate-900">
                调研报告预览
              </h2>
              <div className="flex flex-wrap items-center gap-2">
                {generationMode && (
                  <span className="inline-flex rounded-full border border-blue-200/60 bg-blue-50/70 px-3 py-1 text-xs font-medium text-blue-600 backdrop-blur-sm">
                    生成模式：{generationMode}
                  </span>
                )}
                {modelName && (
                  <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-500 backdrop-blur-sm">
                    模型：{modelName}
                  </span>
                )}
                {webSearchEnabled && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200/60 bg-emerald-50/70 px-3 py-1 text-xs font-medium text-emerald-600 backdrop-blur-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    联网搜索已启用
                  </span>
                )}
              </div>
            </div>

            {warning && (
              <div className="mb-6 rounded-xl border border-amber-200/80 bg-amber-50/70 px-5 py-4 text-sm leading-relaxed text-amber-800 backdrop-blur-sm">
                <span className="font-semibold">提示：</span>
                {warning}
              </div>
            )}

            <div className="whitespace-pre-line text-sm leading-7 text-slate-700">
              {reportText}
            </div>

            {/* Sources */}
            {sources.length > 0 ? (
              <div className="mt-8 rounded-xl border border-slate-100 bg-slate-50/80 p-5">
                <h3 className="mb-3 text-sm font-semibold text-slate-700">
                  参考来源
                </h3>
                <ul className="space-y-2">
                  {sources.map((s, i) => (
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
            ) : (
              webSearchEnabled && (
                <div className="mt-8 rounded-xl border border-slate-200/60 bg-slate-50/60 px-5 py-4 text-xs leading-relaxed text-slate-400">
                  当前模型已开启联网搜索，但接口未返回可展示的来源列表。建议后续通过资料上传或来源引用功能增强报告可追溯性。
                </div>
              )
            )}

            {/* Actions */}
            <div className="mt-10 flex flex-col items-start gap-3 border-t border-slate-100 pt-8 sm:flex-row sm:items-center">
              <button
                onClick={handleCopy}
                className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:from-blue-700 hover:to-cyan-600 hover:shadow-xl hover:shadow-blue-500/30"
              >
                复制报告
              </button>
              <button
                onClick={handleReset}
                className="rounded-xl border border-slate-200 bg-white/70 px-6 py-2.5 text-sm font-medium text-slate-700 shadow-sm backdrop-blur-sm transition-all hover:border-blue-300 hover:text-blue-700 hover:shadow-md"
              >
                重新填写
              </button>
              <button
                onClick={handleDownloadMarkdown}
                className="rounded-xl border border-slate-200 bg-white/70 px-6 py-2.5 text-sm font-medium text-slate-700 shadow-sm backdrop-blur-sm transition-all hover:border-blue-300 hover:text-blue-700 hover:shadow-md"
              >
                导出 Markdown
              </button>
              {copied && (
                <span className="text-sm font-medium text-emerald-600">
                  已复制到剪贴板
                </span>
              )}
              <Link
                href="/history"
                className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-700 sm:ml-auto"
              >
                查看历史报告 →
              </Link>
            </div>
          </div>
        )}

        <div className="h-16" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Form input                                                        */
/* ------------------------------------------------------------------ */

function TextInput({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 shadow-sm outline-none transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
      />
    </div>
  );
}
