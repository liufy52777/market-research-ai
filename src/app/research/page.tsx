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

const STORAGE_KEY = "market-research-reports";
const MAX_REPORTS = 20;

const emptyForm: FormData = {
  country: "",
  industry: "",
  product: "",
  identity: "",
  purpose: "",
};

function saveToHistory(data: FormData): void {
  const text = buildReportText(data);
  const record: ReportRecord = {
    id: Date.now().toString(),
    title: `${data.country} ${data.industry} ${data.product} 调研报告`,
    country: data.country,
    industry: data.industry,
    product: data.product,
    role: data.identity,
    purpose: data.purpose,
    reportText: text,
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
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError("");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const hasEmpty = Object.values(formData).some((v) => v.trim() === "");
    if (hasEmpty) {
      setError("请先完整填写调研信息");
      setReportData(null);
      return;
    }

    setError("");
    setCopied(false);
    setReportData({ ...formData });
    saveToHistory(formData);
  };

  const handleCopy = async () => {
    if (!reportData) return;
    const text = buildReportText(reportData);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      // Clipboard write failed — silently ignore
    }
  };

  const handleReset = () => {
    setFormData({ ...emptyForm });
    setReportData(null);
    setError("");
    setCopied(false);
  };

  const handleDownloadMarkdown = () => {
    if (!reportData) return;
    const text = buildReportText(reportData);
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
      text,
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
    <div className="flex min-h-screen flex-col items-center bg-gradient-to-b from-white to-zinc-100/50 px-4 py-16">
      <div className="mx-auto w-full max-w-3xl">
        {/* Back link */}
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-1 text-sm text-zinc-400 transition-colors hover:text-zinc-600"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          返回首页
        </Link>

        {/* Header */}
        <h1 className="mb-3 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
          开始市场调研
        </h1>
        <p className="mb-10 text-base leading-relaxed text-zinc-500">
          请填写目标市场与产品信息，系统将根据这些信息生成结构化市场调研报告。
        </p>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
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
            <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-lg bg-zinc-900 px-6 py-3.5 text-base font-medium text-white shadow-sm transition-all hover:bg-zinc-800 hover:shadow-md"
          >
            生成调研报告
          </button>
        </form>

        {/* Report */}
        {reportData && (
          <div className="mt-12 rounded-xl border border-zinc-200 bg-white p-8 shadow-sm sm:p-10">
            <h2 className="mb-8 text-xl font-bold text-zinc-900">
              调研报告预览
            </h2>
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
            <div className="mt-10 flex flex-col items-start gap-3 border-t border-zinc-100 pt-8 sm:flex-row sm:items-center">
              <button
                onClick={handleCopy}
                className="rounded-lg bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-zinc-800 hover:shadow-md"
              >
                复制报告
              </button>
              <button
                onClick={handleReset}
                className="rounded-lg border border-zinc-300 bg-white px-6 py-2.5 text-sm font-medium text-zinc-700 shadow-sm transition-all hover:bg-zinc-50 hover:border-zinc-400"
              >
                重新填写
              </button>
              <button
                onClick={handleDownloadMarkdown}
                className="rounded-lg border border-zinc-300 bg-white px-6 py-2.5 text-sm font-medium text-zinc-700 shadow-sm transition-all hover:bg-zinc-50 hover:border-zinc-400"
              >
                导出 Markdown
              </button>
              {copied && (
                <span className="text-sm text-emerald-600">
                  已复制到剪贴板
                </span>
              )}
              <Link
                href="/history"
                className="text-sm text-blue-600 transition-colors hover:text-blue-700 sm:ml-auto"
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
      <label className="mb-2 block text-sm font-medium text-zinc-700">
        {label}
      </label>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 shadow-sm outline-none transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Report sections                                                   */
/* ------------------------------------------------------------------ */

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="mb-3 text-base font-semibold text-zinc-900">{children}</h3>;
}

function SectionBody({ children }: { children: React.ReactNode }) {
  return <div className="text-sm leading-7 text-zinc-600">{children}</div>;
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

/* ------------------------------------------------------------------ */
/*  Plain-text report builder (for clipboard copy)                    */
/* ------------------------------------------------------------------ */

function buildReportText(d: FormData): string {
  const lines = [
    "一、执行摘要",
    `本报告针对${d.country}的${d.industry}市场中的${d.product}产品展开初步调研，旨在为${d.identity}提供参考依据，以${d.purpose}。以下内容从市场概况、客户需求、竞争格局、机会与风险等维度进行初步分析，并给出简明的进入建议。`,
    "",
    "二、市场概况",
    `${d.country}作为新兴市场经济体之一，其${d.industry}领域近年来呈现出较为明显的增长趋势。受基础设施建设推进、本地制造业升级以及消费需求释放等因素推动，该市场对${d.product}及相关产品的需求持续扩大。`,
    "",
    `目前${d.country}的${d.industry}市场仍存在一定供需缺口，本地产能尚不能完全覆盖终端需求，进口依赖度相对较高，这为具备成本优势和制造经验的外部供应商提供了进入窗口。`,
    "",
    `从政策环境看，${d.country}政府对外资和进口产品持相对开放态度，但同时也鼓励本地化生产与供应链配套，相关产业政策值得持续关注。`,
    "",
    "三、客户与需求分析",
    `基于${d.product}的产品属性及${d.identity}的市场定位，${d.country}市场的潜在客户可大致分为以下几类：`,
    `- 本地制造企业：作为${d.product}的直接使用者或配套方，对产品质量、价格和供应稳定性有较高要求。`,
    "- 分销商与贸易商：熟悉本地渠道，可帮助快速铺开市场，但对利润空间较为敏感。",
    `- 国际企业在${d.country}的分支机构：倾向于选择有全球供应能力与认证资质的供应商，品牌信任度要求较高。`,
    "客户核心需求方向集中在：性价比优势、稳定的交付能力、符合当地的产品认证，以及一定的售后技术支持。",
    "",
    "四、竞争格局分析",
    `${d.country}的${d.industry}市场竞争格局大致可分为三个层次：`,
    "- 本地生产企业：具备地缘优势和本地客户关系，但可能在产能规模、技术水平或产品品类上存在局限。",
    "- 国际知名品牌供应商：来自欧洲、日韩等地的成熟企业，品牌认知度高、技术领先，但价格通常较高，响应速度可能不及本地竞争者。",
    "- 中国企业及其他新兴市场供应商：凭借成本优势和柔性制造能力快速切入，部分先行企业已在当地建立代理网络或仓储配套，竞争态势日趋活跃。",
    `作为${d.identity}，在进入该市场时需重点评估自身在价格、品质、服务响应与渠道覆盖方面的综合竞争力。`,
    "",
    "五、机会分析",
    `综合市场环境与企业自身条件，${d.product}进入${d.country}市场存在以下机会：`,
    `- 市场增长红利：${d.country}的${d.industry}市场仍处于增长通道，新增需求为新产品进入提供了空间。`,
    `- 供应链替代机会：若本地或现有供应商在价格、交期、品质方面存在明显短板，则${d.identity}具备差异化切入的潜力。`,
    "- 中国企业协同效应：如已有中资项目或中国制造产品在当地形成一定认知基础，可借助已有的品牌印象和渠道资源降低进入门槛。",
    `- 政策窗口期：若${d.country}与中国的贸易关系保持稳定或加强，关税与贸易便利化政策可能带来利好条件。`,
    "",
    "六、风险分析",
    "在推进市场进入的过程中，需要重点关注以下风险因素：",
    `- 政策与监管风险：${d.country}对进口${d.product}可能涉及关税调整、进口许可、技术标准或认证要求的变化。`,
    "- 产品认证与技术壁垒：产品可能需要取得当地或国际认证（如 CE、ISO 等）方可进入市场，认证周期与成本需提前评估。",
    "- 物流与供应链风险：跨国运输周期、清关效率、本地仓储配套等因素可能影响交付稳定性与成本结构。",
    "- 客户获取与渠道风险：建立本地客户信任和稳定的分销渠道通常需要较长周期，初期投入与回报可能不匹配。",
    "- 价格竞争风险：本地低价产品和国际品牌的高端定价之间，需要找到合适的定位空间，价格战可能侵蚀利润。",
    `- 汇率与宏观经济风险：${d.country}的汇率波动和经济稳定性可能影响项目的长期收益预期。`,
    "",
    "七、初步进入建议",
    `1. 开展实地或代理调研：建议在正式投入前，通过展会、行业商会或本地代理对${d.country}${d.industry}市场进行实地或间接摸底，验证需求规模与客户偏好，为后续决策提供更精确的依据。`,
    `2. 选择轻资产切入路径：优先通过本地经销商、代理或跨境电商平台试水${d.product}产品的市场反馈，控制前期资金投入与库存风险，积累一定客户基础后再考虑设立办事处或本地仓储。`,
    `3. 提前布局认证与合规：尽快梳理${d.country}对${d.product}的进口法规、技术标准和认证要求，将认证成本和时间纳入整体进入计划，避免因合规问题延误市场切入时机。`,
  ];

  return lines.join("\n");
}
