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
    `本报告针对${country}的${industry}市场中的${product}产品展开初步市场进入研判，旨在为${role}提供参考依据，以${purpose}。报告从市场概况、客户与需求、竞争格局、进入机会、主要风险、进入路径及后续调研清单七个维度展开分析。需要特别说明的是，本报告为初步研判，部分信息需结合官方数据和实地调研进一步核验。`,
    "",
    "二、市场概况",
    `${country}的${industry}市场是本次调研的重点关注领域。${country}作为目标市场，其政策环境、经济发展水平和产业结构直接影响${product}的市场需求特征。从需求端来看，基础设施建设、本地制造业发展和终端消费需求是驱动市场增长的主要因素；从供给端来看，本地产能和技术水平是决定进口依赖度的关键变量。`,
    "",
    `当前${country}的${industry}领域是否存在供需缺口、缺口规模多大，需进一步通过官方统计、行业协会或海关数据核验。如果本地产能不足或产品规格不匹配，将为外部供应商提供进入窗口。从政策端看，${country}的关税政策、进口许可、技术标准和本地化率要求是核心考量因素，建议针对具体产品进行专项政策调研。`,
    "",
    "三、目标客户与需求分析",
    `以${role}的市场定位出发，${product}在${country}市场的潜在客户可从以下几个维度进行分析：`,
    "- 直接使用客户：如制造企业、装配工厂等，对产品质量、交期稳定性和技术支持有核心诉求。",
    "- 中间渠道客户：如分销商、贸易商和代理商，熟悉本地市场和客户关系，但对价格空间和备货灵活性敏感。",
    "- 国际企业本地分支：在${country}设有分支的国际企业，通常对供应商的全球供货能力和认证资质有较高要求。",
    "- 售后替换市场：已售产品的维修保养和备件更换需求，利润空间通常较高但订单量分散。",
    `客户的决策因素通常包括：产品性价比、交付稳定性、认证资质、售后响应速度以及供应商信誉。建议在进入前对目标客户群体进行初步画像和优先级排序。`,
    "",
    "四、竞争格局分析",
    `${country}的${industry}市场竞争格局可划分为三个层次：`,
    "- 本地及区域供应商：在本地市场关系、物流响应速度和文化理解方面具备天然优势，但可能在产能规模、技术深度或产品品类上存在局限。",
    "- 国际品牌供应商：来自成熟工业国家（如欧洲、日韩等）的知名企业，技术积累深厚、品牌认知度高，但价格通常较高，本地响应能力可能受限。",
    "- 中国企业及其他新兴市场供应商：以成本优势和柔性制造能力见长，部分先行者已在当地建立渠道或仓储配套，但在品牌认知和本地服务网络方面尚在建设中。",
    `作为${role}，需要在价格竞争力、品质一致性、认证完备度和本地化服务这四个维度上形成明确的竞争定位。`,
    "",
    "五、进入机会分析",
    `基于${country}市场的宏观环境和${product}的产业特征，以下方向值得重点关注：`,
    "- 需求缺口机会：若本地供应商无法满足特定细分领域的需求（如特定规格、交期、品质标准），则存在差异化切入的空间。",
    "- 供应链替代机会：若现有国际品牌供应商在价格或响应速度上存在明显短板，具备成本与效率优势的中国供应商有替代潜力。",
    "- 本地化合作机会：与本地企业建立代理、合资或代工合作关系，可借助其本地资源和渠道降低进入门槛。",
    "- 政策窗口机会：若${country}与中国的经贸关系处于稳定或上升期，关税优惠、贸易便利化和投资政策可能为进入创造有利条件。",
    "- 中资协同机会：已有中资项目在当地形成的商业网络和品牌认知，可为新进入者提供渠道支持和信任背书。",
    "",
    "六、主要风险分析",
    "进入${country}市场需要审慎评估以下风险维度：",
    "- 认证与合规风险：${product}进入${country}市场可能需要满足特定的技术标准、产品认证（如 CE、ISO 或当地标准），认证周期和费用需提前纳入计划。",
    `- 关税与政策风险：${country}的进口关税结构、贸易壁垒以及政策稳定性是影响成本结构和市场可行性的关键变量，建议进行专项政策研判。`,
    "- 物流与交付风险：跨境运输周期、清关效率、本地仓储能力共同构成供应链的脆弱环节，可能影响交付承诺和客户满意度。",
    "- 客户获取风险：从零建立客户信任和品牌认知通常需要较长周期和较高营销投入，初期客户转化率可能偏低。",
    "- 价格竞争风险：低价竞争者（来自本地或其他新兴市场供应商）可能压缩利润空间，需要在成本控制和价值定位上找到平衡。",
    `- 汇率与宏观经济风险：${country}的汇率波动、通胀水平和经济周期可能影响产品定价竞争力和长期收益预期。`,
    "- 售后服务风险：在目标市场建立有效的售后服务和技术支持体系需要额外投入，服务质量直接影响客户留存。",
    "",
    "七、进入路径建议",
    "建议分三个阶段推进市场进入：",
    `短期（验证期）：通过行业展会、商会或本地代理，对${country}的${industry}市场进行初步摸底，验证${product}的需求规模、价格接受度和客户偏好。同时收集关键政策与认证信息，评估市场进入的可行性。`,
    `中期（试水期）：在验证市场需求后，选择 1-2 家本地经销商或代理进行合作试水，以少量样品或小批量供货测试市场反馈。同步推进必要的产品认证和合规工作。建立初步的售后服务体系，积累客户使用数据和市场口碑。`,
    "长期（建设期）：在试水成功后，根据市场规模和增长趋势，考虑在目标市场建立本地仓储、办事处或售后服务中心。评估与本地企业合资或本地化配套的可行性，构建长期竞争壁垒。",
    "",
    "八、后续调研清单",
    "以下信息建议在下一步工作中重点补充和核验：",
    `- ${country}针对${product}产品的进口关税税率与贸易政策`,
    `- ${product}在${country}市场需要满足的技术标准和产品认证要求`,
    `- ${country}${industry}市场的规模、增长趋势与进口依赖度（需官方统计或行业数据）`,
    `- 目标客户名单及采购决策流程（OEM、分销商、售后渠道等）`,
    `- 主要竞争对手名单及定价策略（本地企业与国际品牌）`,
    `- 跨境物流成本、运输周期与本地仓储方案`,
    `- ${country}相关行业展会、行业协会和商业促进机构信息`,
    "- 中资企业在当地的经营情况和可借鉴经验",
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
  return `请根据以下信息生成一份中文市场进入初步研判报告。

## 用户输入
- 目标国家 / 地区：${data.country}
- 行业：${data.industry}
- 具体产品：${data.product}
- 企业身份：${data.role}
- 调研目的：${data.purpose}

## 报告结构要求
请严格按照以下八个章节撰写，不得遗漏任何章节：

### 一、执行摘要
用 2-3 段文字概括调研对象、进入判断、最关键的 2-3 个机会和最关键的 2-3 个风险。摘要应让管理层在 1 分钟内理解报告核心结论。

### 二、市场概况
围绕 ${data.country} 的 ${data.industry} 市场展开，结合 ${data.product} 的产品特征进行分析。涵盖需求驱动因素、供给现状、政策环境和发展趋势。不要空泛地写"市场正在增长"，要具体分析增长驱动力是什么、制约因素是什么。如果缺少具体数据支撑，使用"需进一步通过官方统计或行业渠道核验"。

### 三、目标客户与需求分析
从 ${data.role} 的视角出发，分析 ${data.country} 市场中 ${data.product} 的潜在客户类型及其需求特征。客户类型可以包括但不限于：本地制造企业、国际企业在当地的分支机构、分销商/贸易商、售后替换市场、工程项目采购方等。根据行业和产品特性灵活选取相关客户类型，分析每类客户的采购决策因素。

### 四、竞争格局分析
区分三个竞争层次——
- 本地及区域供应商：优势与劣势；
- 国际品牌供应商：优势与劣势；
- 中国及新兴市场供应商：优势与劣势。
结合 ${data.product} 的产品特性和 ${data.role} 的企业定位，指出差异化竞争的可能方向。

### 五、进入机会分析
从需求缺口、供应链替代、价格竞争力、交付能力、本地化合作、政策环境和协同效应等角度，具体分析进入机会。每个机会方向要结合 ${data.country} 和 ${data.product} 的具体情境展开，不要泛泛而谈。

### 六、主要风险分析
从认证合规、关税与政策、物流交付、客户获取、价格竞争、汇率波动、售后服务等维度逐一分析具体风险。每个风险点要说明"风险是什么"和"为什么对本次进入构成风险"。不要只列标题。

### 七、进入路径建议
分三个阶段给出建议——
- 短期（6 个月内）：市场验证和渠道摸底；
- 中期（6-18 个月）：试水进入和认证准备；
- 长期（18 个月以上）：本地化建设和规模化运营。
每个阶段给 2-3 条具体可执行的建议。

### 八、后续调研清单
列出至少 6 项后续需要补充核验的信息，例如：
- 目标市场进口关税与贸易政策
- 产品认证标准与合规要求
- 目标客户名单与采购流程
- 主要竞争对手与定价策略
- 跨境物流成本与周期
- 本地展会、协会与渠道资源
- 中资企业在该市场的经营情况

## 写作要求
- 全程使用专业、客观、稳健的中文撰写，适合企业管理层阅读。
- 报告定位为"初步市场进入研判"，不是最终尽调报告，也不是学术论文。
- **严格禁止编造具体数据**。不得写出任何具体的市场份额、产量、销售额、增长率、公司数量、人口数量、GDP 等数字。如果某个结论需要数据支撑，请使用"建议通过官方统计或行业数据进一步核验""当前缺少公开数据支撑，需通过实地调研补全""根据行业公开信息，该领域呈增长趋势"等表述。
- 不要使用"根据行业数据""数据显示""据统计"这类模糊说法来暗示你掌握数据。
- 内容要体现分析感，有逻辑推理和因果分析，不要只是罗列要点。
- 每个章节的内容要有实质性差异，不要在不同章节重复相同观点。`;
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
              "你是一名资深海外市场进入顾问，拥有 15 年以上帮助中国制造业企业拓展国际市场的经验。你擅长撰写结构清晰、分析深入的市场进入研判报告。你的报告风格：专业、客观、稳健，每一条判断都有逻辑支撑，不空谈、不编造数据。你深知企业高管的时间宝贵，因此你的报告精炼而有洞见，每个章节都有实质性内容而非罗列标题。你的报告定位为初步研判而非最终尽调，因此你会在缺乏数据时如实说明，而不是强行给出结论。",
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
      model: model,
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
      model: model,
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
