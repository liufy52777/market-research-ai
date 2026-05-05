import { NextResponse } from "next/server";

const BAILIAN_BASE_URL =
  "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions";

interface ReportRequest {
  country: string;
  industry: string;
  product: string;
  role: string;
  purpose: string;
}

/* ------------------------------------------------------------------ */
/*  Mock template builder (fallback)                                  */
/* ------------------------------------------------------------------ */

function buildReportText(data: ReportRequest): string {
  const { country, industry, product, role, purpose } = data;

  const lines = [
    "一、执行摘要",
    `本报告针对${country}的${industry}市场中的${product}产品展开初步调研，旨在为${role}提供参考依据，以${purpose}。以下内容从市场概况、客户需求、竞争格局、机会与风险等维度进行初步分析，并给出简明的进入建议。`,
    "",
    "二、市场概况",
    `${country}作为新兴市场经济体之一，其${industry}领域近年来呈现出较为明显的增长趋势。受基础设施建设推进、本地制造业升级以及消费需求释放等因素推动，该市场对${product}及相关产品的需求持续扩大。`,
    "",
    `目前${country}的${industry}市场仍存在一定供需缺口，本地产能尚不能完全覆盖终端需求，进口依赖度相对较高，这为具备成本优势和制造经验的外部供应商提供了进入窗口。`,
    "",
    `从政策环境看，${country}政府对外资和进口产品持相对开放态度，但同时也鼓励本地化生产与供应链配套，相关产业政策值得持续关注。`,
    "",
    "三、客户与需求分析",
    `基于${product}的产品属性及${role}的市场定位，${country}市场的潜在客户可大致分为以下几类：`,
    `- 本地制造企业：作为${product}的直接使用者或配套方，对产品质量、价格和供应稳定性有较高要求。`,
    "- 分销商与贸易商：熟悉本地渠道，可帮助快速铺开市场，但对利润空间较为敏感。",
    `- 国际企业在${country}的分支机构：倾向于选择有全球供应能力与认证资质的供应商，品牌信任度要求较高。`,
    "客户核心需求方向集中在：性价比优势、稳定的交付能力、符合当地的产品认证，以及一定的售后技术支持。",
    "",
    "四、竞争格局分析",
    `${country}的${industry}市场竞争格局大致可分为三个层次：`,
    "- 本地生产企业：具备地缘优势和本地客户关系，但可能在产能规模、技术水平或产品品类上存在局限。",
    "- 国际知名品牌供应商：来自欧洲、日韩等地的成熟企业，品牌认知度高、技术领先，但价格通常较高，响应速度可能不及本地竞争者。",
    "- 中国企业及其他新兴市场供应商：凭借成本优势和柔性制造能力快速切入，部分先行企业已在当地建立代理网络或仓储配套，竞争态势日趋活跃。",
    `作为${role}，在进入该市场时需重点评估自身在价格、品质、服务响应与渠道覆盖方面的综合竞争力。`,
    "",
    "五、机会分析",
    `综合市场环境与企业自身条件，${product}进入${country}市场存在以下机会：`,
    `- 市场增长红利：${country}的${industry}市场仍处于增长通道，新增需求为新产品进入提供了空间。`,
    `- 供应链替代机会：若本地或现有供应商在价格、交期、品质方面存在明显短板，则${role}具备差异化切入的潜力。`,
    "- 中国企业协同效应：如已有中资项目或中国制造产品在当地形成一定认知基础，可借助已有的品牌印象和渠道资源降低进入门槛。",
    `- 政策窗口期：若${country}与中国的贸易关系保持稳定或加强，关税与贸易便利化政策可能带来利好条件。`,
    "",
    "六、风险分析",
    "在推进市场进入的过程中，需要重点关注以下风险因素：",
    `- 政策与监管风险：${country}对进口${product}可能涉及关税调整、进口许可、技术标准或认证要求的变化。`,
    "- 产品认证与技术壁垒：产品可能需要取得当地或国际认证（如 CE、ISO 等）方可进入市场，认证周期与成本需提前评估。",
    "- 物流与供应链风险：跨国运输周期、清关效率、本地仓储配套等因素可能影响交付稳定性与成本结构。",
    "- 客户获取与渠道风险：建立本地客户信任和稳定的分销渠道通常需要较长周期，初期投入与回报可能不匹配。",
    "- 价格竞争风险：本地低价产品和国际品牌的高端定价之间，需要找到合适的定位空间，价格战可能侵蚀利润。",
    `- 汇率与宏观经济风险：${country}的汇率波动和经济稳定性可能影响项目的长期收益预期。`,
    "",
    "七、初步进入建议",
    `1. 开展实地或代理调研：建议在正式投入前，通过展会、行业商会或本地代理对${country}${industry}市场进行实地或间接摸底，验证需求规模与客户偏好，为后续决策提供更精确的依据。`,
    `2. 选择轻资产切入路径：优先通过本地经销商、代理或跨境电商平台试水${product}产品的市场反馈，控制前期资金投入与库存风险，积累一定客户基础后再考虑设立办事处或本地仓储。`,
    `3. 提前布局认证与合规：尽快梳理${country}对${product}的进口法规、技术标准和认证要求，将认证成本和时间纳入整体进入计划，避免因合规问题延误市场切入时机。`,
  ];

  return lines.join("\n");
}

/* ------------------------------------------------------------------ */
/*  Validation                                                        */
/* ------------------------------------------------------------------ */

const requiredFields: (keyof ReportRequest)[] = [
  "country",
  "industry",
  "product",
  "role",
  "purpose",
];

function isValidRequest(body: unknown): body is ReportRequest {
  if (!body || typeof body !== "object") {
    return false;
  }

  const record = body as Record<string, unknown>;

  return requiredFields.every(
    (field) =>
      typeof record[field] === "string" &&
      (record[field] as string).trim().length > 0,
  );
}

/* ------------------------------------------------------------------ */
/*  AI prompt builder                                                 */
/* ------------------------------------------------------------------ */

function buildUserPrompt(data: ReportRequest): string {
  return `请根据以下信息生成一份中文市场调研报告。

## 用户输入
- 目标国家 / 地区：${data.country}
- 行业：${data.industry}
- 具体产品：${data.product}
- 企业身份：${data.role}
- 调研目的：${data.purpose}

## 报告要求
请严格按照以下七个章节撰写报告：

一、执行摘要
简要说明针对哪个国家、哪个行业、哪个产品进行调研，以及调研目的和核心结论。

二、市场概况
介绍${data.country}的${data.industry}市场现状、发展趋势、政策环境与市场规模概况。

三、客户与需求分析
分析潜在客户类型、需求特征与采购偏好。

四、竞争格局分析
分析本地生产企业、国际品牌供应商、中国企业等竞争层次。

五、机会分析
分析该产品进入该市场的主要机会方向。

六、风险分析
分析政策、认证、物流、客户获取、价格竞争、汇率等方面的潜在风险。

七、初步进入建议
给出 3-5 条简洁可操作的初步进入建议。

## 写作要求
- 使用中文撰写。
- 内容要比通用模板更具体、更专业，适合企业决策参考。
- 不要编造具体数字（如市场份额百分比、具体销售额等），如需要引用数据，使用"建议进一步核验"或"根据行业公开信息"等表述。
- 语言客观、理性、精炼。`;
}

/* ------------------------------------------------------------------ */
/*  Bailian API call                                                  */
/* ------------------------------------------------------------------ */

interface BailianResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
}

async function callBailianAPI(
  data: ReportRequest,
  apiKey: string,
  model: string,
): Promise<string> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000);

  try {
    const res = await fetch(BAILIAN_BASE_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content:
              "你是一名专业的海外市场调研分析师，擅长为中国企业撰写结构化市场调研报告。你的报告风格专业、客观、精炼，适合企业决策参考。",
          },
          {
            role: "user",
            content: buildUserPrompt(data),
          },
        ],
        temperature: 0.4,
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      const errorBody = await res.text().catch(() => "");
      throw new Error(
        `Bailian API returned ${res.status}${errorBody ? `: ${errorBody.slice(0, 200)}` : ""}`,
      );
    }

    const json: BailianResponse = await res.json();

    const content = json.choices?.[0]?.message?.content;
    if (!content || content.trim().length === 0) {
      throw new Error("Bailian API returned empty content");
    }

    return content.trim();
  } finally {
    clearTimeout(timeoutId);
  }
}

/* ------------------------------------------------------------------ */
/*  POST /api/generate-report                                         */
/* ------------------------------------------------------------------ */

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "请求格式错误" },
      { status: 400 },
    );
  }

  if (!isValidRequest(body)) {
    return NextResponse.json(
      { success: false, error: "请完整填写调研信息" },
      { status: 400 },
    );
  }

  const apiKey = process.env.DASHSCOPE_API_KEY;
  const model = process.env.BAILIAN_MODEL || "qwen3.5-flash";

  // No API key configured — use mock template directly
  if (!apiKey) {
    const reportText = buildReportText(body);
    return NextResponse.json({
      success: true,
      reportText,
      mode: "mock-template",
      warning: "未配置 DASHSCOPE_API_KEY，当前使用本地模板生成",
    });
  }

  // Try Bailian API — fallback to mock template on failure
  try {
    const reportText = await callBailianAPI(body, apiKey, model);
    return NextResponse.json({
      success: true,
      reportText,
      mode: "bailian-qwen",
      model,
    });
  } catch {
    const reportText = buildReportText(body);
    return NextResponse.json({
      success: true,
      reportText,
      mode: "mock-template-fallback",
      warning: "AI 生成失败，当前使用本地模板生成",
    });
  }
}

/* ------------------------------------------------------------------ */
/*  GET /api/generate-report (health check)                           */
/* ------------------------------------------------------------------ */

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Market Research AI report generation API is running",
  });
}
