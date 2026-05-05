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
    `本报告针对${country}的${industry}市场中的${product}产品展开初步市场进入研判，旨在为${role}提供参考依据，以${purpose}。报告从市场概况、客户与需求、竞争格局、进入机会、主要风险、进入路径及后续调研清单八个维度展开分析。需要特别说明的是，本报告为初步研判，部分信息需结合官方数据和实地调研进一步核验。`,
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

## 报告定位
本报告为初步市场进入研判报告，不是最终尽调报告。目的是帮助管理层判断是否值得投入更多资源进行深度调研和实地考察。请在报告中保持审慎的表达，不要做出绝对的「适合进入」或「不适合进入」的判断。

## 报告结构要求
请严格按照以下八个章节撰写，不得遗漏任何章节：

### 一、执行摘要
用 2-3 段概括：调研对象（国家、行业、产品）、是否值得进一步进入的初步判断、最关键的 2-3 个机会方向和最关键的 2-3 个风险因素。摘要应让管理层在 1 分钟内理解报告核心结论。不要一上来就绝对判断，要使用审慎表达。

### 二、市场概况
围绕 ${data.country} 的 ${data.industry} 市场展开，结合 ${data.product} 的产品特征进行分析。分析需求驱动因素、供给现状、政策环境和发展趋势。不要空泛地写「市场增长迅速」。如果没有实时数据，不要写具体数字，应提示需要进一步核验哪些数据口径（如市场规模、进口依赖度、行业增速等）。

### 三、目标客户与需求分析
结合 ${data.role} 的企业定位和 ${data.product} 的产品类型，分析潜在客户。根据行业和产品特性灵活选取：OEM、Tier 1、Tier 2、本地制造企业、分销商、贸易商、售后市场、国际企业当地分支机构等。分析每类客户的采购决策因素（如价格敏感度、认证要求、交期期望、售后需求），不要所有报告都固定一样的客户分类。

### 四、竞争格局分析
至少区分三个竞争层次：
- 本地及区域竞争者：分析其优势和劣势；
- 国际品牌供应商：分析其优势和劣势；
- 中国及其他新兴市场供应商：分析其优势和劣势。
结合 ${data.product} 的产品特性和 ${data.role} 的企业定位，指出差异化竞争的可能方向。不要机械罗列，要写成分析段落。

### 五、进入机会分析
结合 ${data.country} 和 ${data.product} 的具体情境，从以下角度中选取合适的内容展开分析（不需要全部覆盖，选择最相关的即可）：
- 需求缺口：本地供应是否充足，是否存在特定规格或品质层级的空缺
- 供应链替代：现有供应商在价格或响应速度上是否存在明显短板
- 成本与价格优势：中国供应商在成本控制和制造效率方面的潜力
- 交付与响应速度：相比远距离国际供应商，中国企业能否在交期上建立优势
- 本地化合作：与本地代理、经销商或制造企业合作的可能性
- 政策与产业配套：目标国家的产业政策是否利好外部供应商
- 中国企业协同效应：已有中资项目或中国产品在当地形成的认知基础
不要机械罗列，要写成分析段落，每个机会方向都要结合具体情境展开论证。

### 六、主要风险分析
结合 ${data.product} 和 ${data.industry} 的行业特征，具体分析以下风险（选择最相关的 5-7 个展开，不需要面面俱到）：
- 认证与合规风险：产品是否需要特定认证，获取认证的难度和周期
- 关税与进口政策风险：目标国家的关税结构和贸易壁垒
- 物流与交付风险：跨境运输、清关和本地仓储的挑战
- 客户获取风险：建立客户信任和品牌认知的难度
- 价格竞争风险：来自本地或其他供应商的价格压力
- 售后服务风险：在目标市场建立售后支持体系的投入
- 汇率与宏观环境风险：汇率波动和经济稳定性
每个风险点要说明「风险是什么」和「为什么重要」，不要只列标题。

### 七、进入路径建议
按照三个阶段给出具体可执行的建议：
- 短期：需求验证、客户访谈、代理商筛选、样品测试
- 中期：认证准备、渠道合作、小批量订单、本地仓储可行性评估
- 长期：本地办事处、本地化配套、合资合作、重点客户深度绑定
每个阶段给 2-3 条建议，建议要具体可操作，不要空泛。

### 八、后续调研清单
列出 8-12 项后续必须补充核验的信息，例如：
- 目标市场进口关税与贸易政策
- 产品认证标准与合规要求
- 目标客户名单与采购决策流程
- 主要竞争对手名单与定价策略
- 跨境物流成本与运输周期
- 本地展会和行业协会信息
- 渠道商和代理商资源
- 售后服务与技术支持要求
- 本地化生产或组装政策
- 中资企业在该市场的经营情况
- 目标市场对外资供应商的准入限制
- 客户信用与付款习惯

## 写作要求
- 全程使用专业、客观、稳健的中文撰写，适合企业内部汇报和决策参考。
- **严格禁止编造具体数据**。不得写出任何具体的市场份额、产量、销售额、增长率、公司数量、人口数量、GDP、市场规模金额等数字。如果某个结论需要数据支撑，必须使用「建议通过官方统计或行业数据进一步核验」「当前缺少公开数据支撑，需通过实地调研补全」等表述。
- 不要使用「根据行业数据」「数据显示」「据统计」这类模糊说法来暗示你掌握数据。
- 如果涉及市场规模、产量、份额、关税税率、政策条款、认证标准，必须提示需要进一步核验。
- 不要输出免责声明式废话（如「本报告仅供参考，不构成投资建议」）。
- 不要输出 Markdown 表格，保持纯文本段落和列表格式。
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
              "你是一名专业的海外市场进入咨询顾问和产业研究分析师，擅长为中国企业撰写海外市场调研、竞争分析和进入策略报告。你的输出应面向企业管理层和市场开拓团队，语言专业、稳健、结构清晰，适合企业内部汇报和决策参考。你必须严格按照八个章节（执行摘要、市场概况、目标客户与需求分析、竞争格局分析、进入机会分析、主要风险分析、进入路径建议、后续调研清单）组织报告。你必须避免编造未经核验的具体数据、市场规模、企业数量、市场份额、产量、金额或政策细节；如果缺少可靠数据，应使用「需进一步核验」「建议通过官方统计、行业协会、海关数据或当地渠道确认」等表述。你的报告定位为初步研判，目的是帮助企业在早期阶段做出是否投入更多资源进行深度调研的决策。",
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
