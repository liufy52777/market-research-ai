"use client";

import { useState } from "react";
import Link from "next/link";

interface FormData {
  country: string;
  industry: string;
  product: string;
  identity: string;
  purpose: string;
}

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

interface ApiSuccessResponse {
  success: true;
  reportText: string;
  mode: string;
}

interface ApiErrorResponse {
  success: false;
  error: string;
}

type ApiResponse = ApiSuccessResponse | ApiErrorResponse;

const STORAGE_KEY = "market-research-reports";
const MAX_REPORTS = 20;

const emptyForm: FormData = {
  country: "",
  industry: "",
  product: "",
  identity: "",
  purpose: "",
};

function saveToHistory(data: FormData, reportText: string): void {
  const record: ReportRecord = {
    id: Date.now().toString(),
    title: `${data.country} ${data.industry} ${data.product} 调研报告`,
    country: data.country,
    industry: data.industry,
    product: data.product,
    role: data.identity,
    purpose: data.purpose,
    reportText,
    createdAt: new Date().toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }),
  };

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const existing: ReportRecord[] = raw ? JSON.parse(raw) : [];
    const updated = [record, ...existing].slice(0, MAX_REPORTS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // localStorage write failed — silently ignore
  }
}

export default function ResearchPage() {
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [reportData, setReportData] = useState<FormData | null>(null);
  const [reportText, setReportText] = useState<string | null>(null);
  const [mode, setMode] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const hasEmpty = Object.values(formData).some((v) => v.trim() === "");
    if (hasEmpty) {
      setError("请先完整填写调研信息");
      setReportData(null);
      setReportText(null);
      setMode(null);
      return;
    }

    setError("");
    setCopied(false);
    setIsGenerating(true);
    setMode(null);

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
        setReportData(null);
        setReportText(null);
        setMode(null);
        return;
      }

      setReportText(json.reportText);
      setMode(json.mode);
      setReportData({ ...formData });
      saveToHistory(formData, json.reportText);
    } catch {
      setError("报告生成失败，请稍后重试。");
      setReportData(null);
      setReportText(null);
      setMode(null);
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
    setReportData(null);
    setReportText(null);
    setMode(null);
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
    ].join("\n");

    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
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
              {mode && (
                <span className="inline-flex rounded-full border border-blue-200/60 bg-blue-50/70 px-3 py-1 text-xs font-medium text-blue-600 backdrop-blur-sm">
                  生成模式：API {mode}
                </span>
              )}
            </div>
            <div className="space-y-8">
              <ExecSummary data={reportData} />
              <MarketOverview data={reportData} />
              <CustomerAnalysis data={reportData} />
              <Competition data={reportData} />
              <Opportunity data={reportData} />
              <RiskAnalysis data={reportData} />
              <EntryAdvice data={reportData} />
            </div>

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

/* ------------------------------------------------------------------ */
/*  Report sections                                                   */
/* ------------------------------------------------------------------ */

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="mb-3 text-base font-semibold text-slate-900">{children}</h3>;
}

function SectionBody({ children }: { children: React.ReactNode }) {
  return <div className="text-sm leading-7 text-slate-600">{children}</div>;
}

function ExecSummary({ data: d }: { data: FormData }) {
  return (
    <section>
      <SectionTitle>一、执行摘要</SectionTitle>
      <SectionBody>
        <p>
          本报告针对 <strong>{d.country}</strong> 的 <strong>{d.industry}</strong>{" "}
          市场中的 <strong>{d.product}</strong> 产品展开初步调研，旨在为{" "}
          <strong>{d.identity}</strong> 提供参考依据，以{" "}
          <strong>{d.purpose}</strong>。以下内容从市场概况、客户需求、竞争格局、
          机会与风险等维度进行初步分析，并给出简明的进入建议。
        </p>
      </SectionBody>
    </section>
  );
}

function MarketOverview({ data: d }: { data: FormData }) {
  return (
    <section>
      <SectionTitle>二、市场概况</SectionTitle>
      <SectionBody>
        <div className="space-y-3">
          <p>
            <strong>{d.country}</strong> 作为新兴市场经济体之一，其{" "}
            <strong>{d.industry}</strong>{" "}
            领域近年来呈现出较为明显的增长趋势。受基础设施建设推进、本地制造业升级
            以及消费需求释放等因素推动，该市场对 <strong>{d.product}</strong>{" "}
            及相关产品的需求持续扩大。
          </p>
          <p>
            目前 <strong>{d.country}</strong> 的 <strong>{d.industry}</strong>{" "}
            市场仍存在一定供需缺口，本地产能尚不能完全覆盖终端需求，进口依赖度相对
            较高，这为具备成本优势和制造经验的外部供应商提供了进入窗口。
          </p>
          <p>
            从政策环境看，<strong>{d.country}</strong>{" "}
            政府对外资和进口产品持相对开放态度，但同时也鼓励本地化生产与供应链配套，
            相关产业政策值得持续关注。
          </p>
        </div>
      </SectionBody>
    </section>
  );
}

function CustomerAnalysis({ data: d }: { data: FormData }) {
  return (
    <section>
      <SectionTitle>三、客户与需求分析</SectionTitle>
      <SectionBody>
        <div className="space-y-3">
          <p>
            基于 <strong>{d.product}</strong> 的产品属性及{" "}
            <strong>{d.identity}</strong> 的市场定位，{" "}
            <strong>{d.country}</strong> 市场的潜在客户可大致分为以下几类：
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>本地制造企业</strong>：作为{" "}
              <strong>{d.product}</strong> 的直接使用者或配套方，对产品质量、
              价格和供应稳定性有较高要求。
            </li>
            <li>
              <strong>分销商与贸易商</strong>：熟悉本地渠道，可帮助快速铺开市场，
              但对利润空间较为敏感。
            </li>
            <li>
              <strong>国际企业在 {d.country} 的分支机构</strong>
              ：倾向于选择有全球供应能力与认证资质的供应商，品牌信任度要求较高。
            </li>
          </ul>
          <p>
            客户核心需求方向集中在：性价比优势、稳定的交付能力、符合当地的产品认证，
            以及一定的售后技术支持。
          </p>
        </div>
      </SectionBody>
    </section>
  );
}

function Competition({ data: d }: { data: FormData }) {
  return (
    <section>
      <SectionTitle>四、竞争格局分析</SectionTitle>
      <SectionBody>
        <div className="space-y-3">
          <p>
            <strong>{d.country}</strong> 的 <strong>{d.industry}</strong>{" "}
            市场竞争格局大致可分为三个层次：
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>本地生产企业</strong>：具备地缘优势和本地客户关系，但可能在
              产能规模、技术水平或产品品类上存在局限。
            </li>
            <li>
              <strong>国际知名品牌供应商</strong>：来自欧洲、日韩等地的成熟企业，
              品牌认知度高、技术领先，但价格通常较高，响应速度可能不及本地竞争者。
            </li>
            <li>
              <strong>中国企业及其他新兴市场供应商</strong>：凭借成本优势和柔性
              制造能力快速切入，部分先行企业已在当地建立代理网络或仓储配套，竞争
              态势日趋活跃。
            </li>
          </ul>
          <p>
            作为 <strong>{d.identity}</strong>，在进入该市场时需重点评估自身在
            价格、品质、服务响应与渠道覆盖方面的综合竞争力。
          </p>
        </div>
      </SectionBody>
    </section>
  );
}

function Opportunity({ data: d }: { data: FormData }) {
  return (
    <section>
      <SectionTitle>五、机会分析</SectionTitle>
      <SectionBody>
        <div className="space-y-3">
          <p>
            综合市场环境与企业自身条件，<strong>{d.product}</strong> 进入{" "}
            <strong>{d.country}</strong> 市场存在以下机会：
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>市场增长红利</strong>：<strong>{d.country}</strong> 的{" "}
              <strong>{d.industry}</strong> 市场仍处于增长通道，新增需求为新
              产品进入提供了空间。
            </li>
            <li>
              <strong>供应链替代机会</strong>：若本地或现有供应商在价格、交期、
              品质方面存在明显短板，则 <strong>{d.identity}</strong> 具备差异化
              切入的潜力。
            </li>
            <li>
              <strong>中国企业协同效应</strong>：如已有中资项目或中国制造产品在
              当地形成一定认知基础，可借助已有的品牌印象和渠道资源降低进入门槛。
            </li>
            <li>
              <strong>政策窗口期</strong>：若 <strong>{d.country}</strong>{" "}
              与中国的贸易关系保持稳定或加强，关税与贸易便利化政策可能带来利好条件。
            </li>
          </ul>
        </div>
      </SectionBody>
    </section>
  );
}

function RiskAnalysis({ data: d }: { data: FormData }) {
  return (
    <section>
      <SectionTitle>六、风险分析</SectionTitle>
      <SectionBody>
        <div className="space-y-3">
          <p>在推进市场进入的过程中，需要重点关注以下风险因素：</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>政策与监管风险</strong>：<strong>{d.country}</strong>{" "}
              对进口 <strong>{d.product}</strong>{" "}
              可能涉及关税调整、进口许可、技术标准或认证要求的变化。
            </li>
            <li>
              <strong>产品认证与技术壁垒</strong>：产品可能需要取得当地或国际认证
              （如 CE、ISO 等）方可进入市场，认证周期与成本需提前评估。
            </li>
            <li>
              <strong>物流与供应链风险</strong>：跨国运输周期、清关效率、本地仓储
              配套等因素可能影响交付稳定性与成本结构。
            </li>
            <li>
              <strong>客户获取与渠道风险</strong>：建立本地客户信任和稳定的分销渠道
              通常需要较长周期，初期投入与回报可能不匹配。
            </li>
            <li>
              <strong>价格竞争风险</strong>：本地低价产品和国际品牌的高端定价之间，
              需要找到合适的定位空间，价格战可能侵蚀利润。
            </li>
            <li>
              <strong>汇率与宏观经济风险</strong>：<strong>{d.country}</strong>{" "}
              的汇率波动和经济稳定性可能影响项目的长期收益预期。
            </li>
          </ul>
        </div>
      </SectionBody>
    </section>
  );
}

function EntryAdvice({ data: d }: { data: FormData }) {
  return (
    <section>
      <SectionTitle>七、初步进入建议</SectionTitle>
      <SectionBody>
        <div className="space-y-3">
          <ol className="list-decimal space-y-2 pl-5">
            <li>
              <strong>开展实地或代理调研</strong>：建议在正式投入前，通过展会、
              行业商会或本地代理对 <strong>{d.country}</strong>{" "}
              <strong>{d.industry}</strong>{" "}
              市场进行实地或间接摸底，验证需求规模与客户偏好，为后续决策提供更精确
              的依据。
            </li>
            <li>
              <strong>选择轻资产切入路径</strong>：优先通过本地经销商、代理或跨境
              电商平台试水 <strong>{d.product}</strong>{" "}
              产品的市场反馈，控制前期资金投入与库存风险，积累一定客户基础后再考虑
              设立办事处或本地仓储。
            </li>
            <li>
              <strong>提前布局认证与合规</strong>：尽快梳理{" "}
              <strong>{d.country}</strong> 对 <strong>{d.product}</strong>{" "}
              的进口法规、技术标准和认证要求，将认证成本和时间纳入整体进入计划，
              避免因合规问题延误市场切入时机。
            </li>
          </ol>
        </div>
      </SectionBody>
    </section>
  );
}
