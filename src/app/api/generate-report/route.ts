import { NextResponse } from "next/server";

export const maxDuration = 300; // 5 minutes for qwen3.7-max with web search

const DASHSCOPE_BASE_URL =
  (process.env.DASHSCOPE_BASE_URL || "https://dashscope.aliyuncs.com/compatible-mode/v1") + "/chat/completions";

interface ReportRequest {
  country: string;
  industry: string;
  product: string;
  role: string;
  purpose: string;
}

/* ------------------------------------------------------------------ */
/*  Mock template builder (fallback only when no API key)             */
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
    "",
    "九、需进一步核验事项",
    "以下为报告中涉及但缺乏可靠数据支撑的关键信息点，建议作为下一步调研工作的行动清单：",
    `1. 数据核验：${country}${industry}市场的实际规模、增长率、进口依赖度，建议通过${country}官方统计机构、行业协会年报或海关进出口数据库获取；`,
    `2. 合规核验：${product}进入${country}市场的具体关税税率、是否涉及反倾销或保障措施、产品认证（如 CE、ISO 或当地等效标准）的适用范围和申请周期；`,
    `3. 企业调研：${country}市场主要客户（OEM、Tier 1、分销商）名单及采购流程、主要竞争对手（本地及国际品牌）在当地的定价策略和市场份额；`,
    `4. 成本估算：${country}跨境物流（海运/空运）的标准运费和周期、当地仓储租金水平、产品认证费用和渠道建设初期投入预算；`,
    "以上事项建议通过官方统计、行业协会、海关数据、展会调研、目标客户访谈等途径逐步核验，并根据核验结果动态调整市场进入策略。",
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
  return `请根据以下信息生成一份中文结构化市场进入研判报告。

## 用户输入
- 目标国家 / 地区：${data.country}
- 行业：${data.industry}
- 具体产品：${data.product}
- 企业身份：${data.role}
- 调研目的：${data.purpose}

## 报告定位
本报告为结构化市场进入研判报告，面向企业管理层。目的是帮助决策者判断是否值得投入资源进行深度调研和实地考察。报告需使用 Markdown 格式输出。

## 报告结构要求
必须严格按照以下十个章节顺序输出，不得遗漏任何章节。

### 一、执行摘要
用 3-5 句话总结：目标市场概述、产品机会判断、最主要风险、初步建议方向。语言精炼，让管理层在 1 分钟内理解核心要点。

### 二、关键结论
用 4-6 条 bullet points 输出最重要的判断结论。要求覆盖：
- 市场是否值得进入的判断
- 需求是否明确
- 竞争激烈程度评估
- 中国供应商（${data.role}）的主要优势
- 最大的进入障碍是什么

### 三、市场概况
围绕 ${data.country} 的 ${data.industry} 市场展开分析。涵盖：行业背景、市场发展趋势、产业链特点、进口依赖度、本地制造能力、政策环境。优先使用联网搜索获取的最新信息。如缺乏具体数据，用「建议通过官方统计核验」等表述，不要编造数字。

### 四、目标客户与需求分析
请按以下四个小节展开：

#### 4.1 潜在客户类型
根据 ${data.product} 的产品特征，分析可能的客户类型（如 OEM 工厂、Tier 1 供应商、分销商、售后市场、工程项目采购方等）。

#### 4.2 客户核心需求
每类客户最关心的需求是什么（如价格、品质、交期、认证、售后服务等）。

#### 4.3 采购关注因素
客户在采购决策中优先考虑的因素排序。

#### 4.4 对中国供应商的接受度判断
${data.country} 市场对中国供应商的认知和接受程度如何，是否存在偏见或额外门槛。

### 五、竞争格局分析
请使用 Markdown 表格输出：

| 竞争者类型 | 代表企业或来源地 | 主要优势 | 主要劣势 | 对中国供应商的影响 |
|---|---|---|---|---|
| 本地竞争者 | | | | |
| 国际品牌供应商 | | | | |
| 中国及新兴市场供应商 | | | | |

注意：如果缺乏具体企业名称，填「需进一步核验」，严禁编造企业名。

### 六、市场机会评分
请输出评分表格：

| 评价维度 | 分值（1-5 分） | 判断理由 |
|---|---|---|
| 市场需求 | | |
| 进入门槛 | | |
| 竞争压力 | | |
| 供应链匹配度 | | |
| 中国企业机会 | | |

表格后给出：

**市场机会等级：高 / 中高 / 中 / 中低 / 低**

并附一句理由说明。

注意：分值为基于已有信息的初步判断，而非精确评估。

### 七、风险分析
对以下 6 类风险逐一分析，每类风险必须包含：风险描述、影响程度（高/中/低）、应对建议。

1. 政策与监管风险
2. 认证与技术标准风险
3. 物流与交付风险
4. 客户开发风险
5. 价格竞争风险
6. 汇率与宏观经济风险

### 八、进入策略建议
分四个阶段给出建议：

#### 第一阶段：低成本市场验证
- 主要目标
- 具体动作
- 进入下一阶段的判断标准

#### 第二阶段：渠道与客户开发
- 主要目标
- 具体动作
- 进入下一阶段的判断标准

#### 第三阶段：本地化能力建设
- 主要目标
- 具体动作
- 进入下一阶段的判断标准

#### 第四阶段：长期布局建议
- 主要目标
- 具体动作

### 九、需进一步核验事项
企业调研行动清单，列出报告中涉及但缺乏可靠数据支撑的关键信息点：
1. 需核验的数据（市场规模、产量、份额等）及建议核验途径；
2. 需核验的合规事项（关税、认证、进口许可等）；
3. 需补充调研的企业名单（客户、竞争对手、供应链配套）；
4. 需进一步估算的成本项（物流、认证、渠道建设）；
5. 可进一步搜索或访谈的问题清单。
每条标注优先级（高/中/低）。

### 十、结论性建议
用明确语气给出最终建议。必须从以下三种中选择其一：
- **建议优先进入** — 市场机会明确，风险可控，建议尽快启动市场验证
- **建议谨慎进入** — 有机会但风险较高或信息不足，建议完成关键核验后再决策
- **暂不建议进入** — 当前条件下进入风险过高或机会不足，建议观望或转向其他市场

选择后给出 3-4 条核心理由。

## 写作要求
- 全程使用专业、客观、稳健的中文撰写。
- **严格禁止编造具体数据**。不得写出任何市场份额、产量、销售额、增长率、公司数量、人口数量、GDP、市场规模金额等具体数字。需要用数据支撑的地方，使用「建议通过官方统计或行业数据核验」「当前缺少公开数据」「需实地调研确认」等表述。
- 不要使用「根据行业数据」「数据显示」「据统计」等暗示掌握数据的模糊说法。
- 涉及市场规模、产量、份额、关税税率、政策条款、认证标准时，必须提示需要进一步核验。
- 不要输出免责声明式废话。
- 竞争格局和市场机会评分两个章节必须使用 Markdown 表格。
- 其他章节使用段落和列表，不强制表格。
- 内容要有分析深度和逻辑推理，不同章节之间观点不重复。`;
}

/* ------------------------------------------------------------------ */
/*  Bailian API call (with web search)                                */
/* ------------------------------------------------------------------ */

interface SearchSource {
  title: string;
  url: string;
  snippet: string;
}

interface BailianResponse {
  choices?: Array<{
    message?: {
      content?: string;
      search_info?: {
        search_results?: Array<{
          title?: string;
          url?: string;
          snippet?: string;
        }>;
      };
    };
  }>;
  output?: {
    choices?: Array<{
      message?: {
        content?: string;
        search_info?: {
          search_results?: Array<{
            title?: string;
            url?: string;
            snippet?: string;
          }>;
        };
      };
    }>;
  };
}

interface BailianCallResult {
  reportText: string;
  sources: SearchSource[];
}

function extractSources(json: BailianResponse): SearchSource[] {
  const results = [];

  // Try choices[0].message.search_info.search_results
  const searchResults =
    json.choices?.[0]?.message?.search_info?.search_results ??
    json.output?.choices?.[0]?.message?.search_info?.search_results;

  if (searchResults) {
    for (const item of searchResults) {
      if (item.title || item.url || item.snippet) {
        results.push({
          title: item.title ?? "",
          url: item.url ?? "",
          snippet: item.snippet ?? "",
        });
      }
    }
  }

  return results;
}

async function callBailianAPI(
  data: ReportRequest,
  apiKey: string,
  model: string,
): Promise<BailianCallResult> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 300000);

  try {
    const res = await fetch(DASHSCOPE_BASE_URL, {
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
              "你是一名资深海外市场进入咨询顾问和产业研究分析师，擅长为中国企业撰写结构化的市场进入研判报告。你的输出面向企业管理层，语言专业、客观、稳健，适合内部决策参考。你必须严格按照十个章节（执行摘要、关键结论、市场概况、目标客户与需求分析、竞争格局分析、市场机会评分、风险分析、进入策略建议、需进一步核验事项、结论性建议）组织报告，并使用 Markdown 格式。竞争格局和市场机会评分两个章节必须使用 Markdown 表格。你严格禁止编造任何具体数据（市场份额、产量、销售额、增长率、企业数量等）。如需数据支撑，使用「建议通过官方统计或行业数据核验」「需实地调研确认」等表述。最终结论必须从「建议优先进入」「建议谨慎进入」「暂不建议进入」三者中选一。",
          },
          {
            role: "user",
            content: buildUserPrompt(data),
          },
        ],
        temperature: 0.4,
        enable_search: true,
        search_options: {
          forced_search: true,
          search_strategy: "turbo",
        },
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      const errorBody = await res.text().catch(() => "");
      const status = res.status;
      const snippet = errorBody.slice(0, 300);

      // Detect search-related failures
      if (
        snippet.includes("search") ||
        snippet.includes("Search") ||
        snippet.includes("enable_search") ||
        snippet.includes("web_search")
      ) {
        throw new Error(
          `联网搜索不可用：模型可能不支持联网搜索功能（HTTP ${status}）。请确认模型是否开通联网搜索权限。`,
        );
      }

      throw new Error(
        `阿里百炼 API 返回错误（HTTP ${status}）：${snippet}`,
      );
    }

    const json: BailianResponse = await res.json();

    const content =
      json.choices?.[0]?.message?.content ??
      json.output?.choices?.[0]?.message?.content;

    if (!content || content.trim().length === 0) {
      throw new Error("阿里百炼 API 返回了空的报告内容");
    }

    const sources = extractSources(json);

    return {
      reportText: content.trim(),
      sources,
    };
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
  const model = process.env.DASHSCOPE_MODEL || "qwen3.7-max";
  const generatedAt = new Date().toISOString();

  // No API key configured — use mock template with clear warning
  if (!apiKey) {
    return NextResponse.json({
      success: true,
      reportText: buildReportText(body),
      provider: "mock",
      model,
      mode: "mock-template",
      generationMode: "mock-template",
      webSearchEnabled: false,
      generatedAt,
      sources: [],
      warning: "未配置 DASHSCOPE_API_KEY，当前使用本地模板生成。联网搜索不可用。",
    });
  }

  // Call Bailian API with web search enabled
  try {
    const { reportText, sources } = await callBailianAPI(body, apiKey, model);

    return NextResponse.json({
      success: true,
      reportText,
      provider: "bailian",
      model,
      mode: "bailian-qwen-web-search",
      generationMode: "bailian-qwen-web-search",
      webSearchEnabled: true,
      generatedAt,
      sources,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(
      "[generate-report] Bailian API call failed:",
      msg.replace(/Bearer\s+\S+/gi, "Bearer ***"),
    );

    // Return the error directly to the frontend — no silent fallback
    return NextResponse.json(
      {
        success: false,
        error: `报告生成失败：${msg}`,
      },
      { status: 502 },
    );
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
