import Link from "next/link";

export default function ExamplePage() {
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
          示例调研报告
        </h1>
        <p className="mb-3 text-base leading-relaxed text-slate-500">
          以下内容展示市场调研报告的基础结构，帮助用户理解生成结果的呈现形式。
        </p>
        <div className="mb-10 inline-flex items-center gap-1.5 rounded-full border border-blue-200/60 bg-blue-50/70 px-4 py-1.5 text-xs font-medium text-blue-700 backdrop-blur-sm">
          示例主题：摩洛哥汽车零部件市场初步调研报告——以汽车线束产品为例
        </div>

        {/* Report Card */}
        <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-8 shadow-sm backdrop-blur-sm sm:p-10">
          <div className="space-y-8 text-sm leading-7 text-slate-600">
            <Section title="一、执行摘要">
              <p>
                本报告针对摩洛哥汽车零部件市场中的汽车线束产品展开初步调研，旨在为中国
                汽车零部件供应商提供参考依据，以判断是否适合进入当地市场。以下内容从市场
                概况、客户需求、竞争格局、机会与风险等维度进行初步分析，并给出简明的进入建议。
              </p>
            </Section>

            <Section title="二、市场概况">
              <div className="space-y-3">
                <p>
                  摩洛哥作为北非地区重要的汽车制造枢纽，其汽车零部件领域近年来呈现出较为
                  明显的增长趋势。受欧盟-摩洛哥自由贸易协定、本地汽车产业集聚效应（雷诺、
                  Stellantis 等整车厂在摩设立工厂）以及基础设施建设推进等因素推动，该市场
                  对汽车线束及相关零部件的需求持续扩大。
                </p>
                <p>
                  目前摩洛哥的汽车零部件市场仍存在一定供需缺口。根据行业数据，摩洛哥汽车
                  产业本地配套率约为 40-50%，其余依赖进口。汽车线束作为汽车电气系统的核心
                  组件，本地产能尚不能完全覆盖终端需求，进口依赖度相对较高，这为具备成本
                  优势和制造经验的外部供应商提供了进入窗口。
                </p>
                <p>
                  从政策环境看，摩洛哥政府对外资持积极欢迎态度，设立了多个汽车产业自由
                  贸易区（如丹吉尔汽车城），提供税收优惠和基础设施支持。但同时也鼓励本地化
                  生产与供应链配套，对于纯进口贸易模式可能存在一定的政策引导压力。
                </p>
              </div>
            </Section>

            <Section title="三、客户与需求分析">
              <div className="space-y-3">
                <p>
                  基于汽车线束的产品属性及中国汽车零部件供应商的市场定位，摩洛哥市场的
                  潜在客户可大致分为以下几类：
                </p>
                <ul className="list-disc space-y-1 pl-5">
                  <li>
                    <strong>整车厂（OEM）本地工厂</strong>：如雷诺、Stellantis 在摩洛哥的
                    组装工厂，作为汽车线束的直接使用者，对产品质量、技术标准和供应稳定性
                    有极高要求，通常需要通过严格的供应商认证体系。
                  </li>
                  <li>
                    <strong>一级供应商（Tier 1）</strong>：在摩洛哥设有分支机构的国际汽车
                    电子系统供应商，可能将线束作为子系统采购，关注技术适配性与成本优化。
                  </li>
                  <li>
                    <strong>本地分销商与贸易商</strong>：熟悉摩洛哥及北非售后市场（Aftermarket）
                    渠道，可帮助快速铺开维修替换市场，但对利润空间和备货灵活性较为敏感。
                  </li>
                  <li>
                    <strong>中资企业在摩洛哥的分支机构</strong>：已在当地投资设厂的中国汽车
                    相关企业，可能产生配套采购需求，沟通和信任基础相对较好。
                  </li>
                </ul>
                <p>
                  客户核心需求方向集中在：符合欧盟标准（ECE/EC）的产品认证、稳定的批次交
                  付能力、具有竞争力的价格、以及本地化的售后技术支持与快速响应服务。
                </p>
              </div>
            </Section>

            <Section title="四、竞争格局分析">
              <div className="space-y-3">
                <p>
                  摩洛哥汽车零部件市场竞争格局大致可分为三个层次：
                </p>
                <ul className="list-disc space-y-1 pl-5">
                  <li>
                    <strong>本地及欧盟近岸供应商</strong>：如摩洛哥本土企业及西班牙、法国
                    等南欧国家的供应商。具备地理近、物流快、文化相通等天然优势，并受益于
                    欧盟-摩洛哥自贸协定，但人工成本和制造成本相对较高。
                  </li>
                  <li>
                    <strong>国际知名品牌供应商</strong>：如矢崎、住友电工、李尔、安波福等
                    全球线束巨头。品牌认知度高、技术领先、与 OEM 有长期合作关系。但价格
                    通常较高，且部分企业的供应链布局重心在亚洲和东欧。
                  </li>
                  <li>
                    <strong>中国企业及其他新兴市场供应商</strong>：凭借成本优势和柔性制造
                    能力快速切入，部分先行企业已在摩洛哥或周边地区建立代理网络和仓储配套。
                    近年来中国企业在北非的活跃度持续上升，竞争态势日趋积极。
                  </li>
                </ul>
                <p>
                  作为中国汽车零部件供应商，在进入该市场时需重点评估自身在价格、品质、
                  认证资质、服务响应速度与渠道覆盖方面的综合竞争力，找到合适的差异化定位。
                </p>
              </div>
            </Section>

            <Section title="五、机会分析">
              <div className="space-y-3">
                <p>
                  综合市场环境与企业自身条件，汽车线束进入摩洛哥市场存在以下机会：
                </p>
                <ul className="list-disc space-y-1 pl-5">
                  <li>
                    <strong>市场增长红利</strong>：摩洛哥汽车产量持续增长（年均约 70 万辆
                    以上），且政府目标进一步扩大，新增产能带来的零部件配套需求为新产品进入
                    提供了增量空间。
                  </li>
                  <li>
                    <strong>供应链替代与补充机会</strong>：部分欧洲供应商因成本压力缩减
                    规模或转向高端产品线，在中端性价比区间存在空缺，中国供应商具备填补
                    该空白的差异化切入潜力。
                  </li>
                  <li>
                    <strong>中国-摩洛哥合作框架</strong>：中摩两国在&ldquo;一带一路&rdquo;框架下经贸
                    合作不断深化，已有中资汽车产业链项目落地，可借助已有的商业网络和政策
                    便利降低进入门槛。
                  </li>
                  <li>
                    <strong>辐射效应</strong>：摩洛哥地理位置优越，可作为进入北非、西非
                    乃至欧洲市场的跳板，一旦建立本地化运营，长远市场空间远超单一国家。
                  </li>
                </ul>
              </div>
            </Section>

            <Section title="六、风险分析">
              <div className="space-y-3">
                <p>在推进市场进入的过程中，需要重点关注以下风险因素：</p>
                <ul className="list-disc space-y-1 pl-5">
                  <li>
                    <strong>认证与合规风险</strong>：摩洛哥汽车市场需符合欧盟 ECE/EC 法规
                    体系，汽车线束作为安全相关部件，认证流程复杂、周期长（通常 6-12 个月），
                    且费用不低，需提前纳入时间与成本计划。
                  </li>
                  <li>
                    <strong>客户准入门槛高</strong>：OEM 和 Tier 1 供应商的审核体系严格，
                    从初次接触到批量供货通常需 1-2 年，新供应商需要长期投入客户关系维护。
                  </li>
                  <li>
                    <strong>物流与汇率波动</strong>：从中国出口至摩洛哥的海运周期约 30-40
                    天，紧急补货响应慢。摩洛哥迪拉姆与欧元挂钩，汇率波动可能影响以人民币
                    计价的成本结构和利润预期。
                  </li>
                  <li>
                    <strong>本地化政策趋严</strong>：摩洛哥政府逐步提高本地化率要求，未来
                    可能要求供应商在本地设立生产或组装环节，纯贸易出口模式可能面临政策风险。
                  </li>
                  <li>
                    <strong>竞争加剧风险</strong>：中国同行的集中涌入可能导致价格竞争加剧，
                    需在产品品质、服务和品牌建设上形成差异化壁垒，避免陷入低价竞争困局。
                  </li>
                </ul>
              </div>
            </Section>

            <Section title="七、初步进入建议">
              <div className="space-y-3">
                <ol className="list-decimal space-y-2 pl-5">
                  <li>
                    <strong>优先参展并与本地代理合作</strong>：建议通过参加摩洛哥国际汽车
                    展（如 Auto Expo Maroc）或通过中国贸促会、中摩商会等渠道，先与 1-2 家
                    本地代理或经销商建立合作关系，以代理模式试水市场，验证客户真实需求与
                    价格接受度，同时降低前期独立投入风险。
                  </li>
                  <li>
                    <strong>提前启动认证工作</strong>：将 ECE/EC 认证作为进入市场的第一
                    优先级事项，尽早确定认证路径（自研认证或与已获证企业合作），将 6-12 个
                    月的认证窗口纳入整体计划。在认证完成前，可先通过售后服务市场（Aftermarket）
                    积累产品实际使用数据和客户反馈。
                  </li>
                  <li>
                    <strong>关注本地化政策动向并预留投资弹性</strong>：持续跟踪摩洛哥对汽车
                    零部件的本地化率政策变化，评估在丹吉尔或盖尼特拉等汽车产业园区设立小型
                    组装线或合资工厂的可行性。如市场验证积极，本地化布局可作为中长期战略
                    选项，提前做好土地、人员、法规方面的信息储备。
                  </li>
                </ol>
              </div>
            </Section>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <Link
            href="/research"
            className="inline-block rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-9 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:from-blue-700 hover:to-cyan-600 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5"
          >
            开始生成我的报告
          </Link>
        </div>

        <div className="h-16" />
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h3 className="mb-3 text-base font-semibold text-slate-900">{title}</h3>
      <div className="text-sm leading-7 text-slate-600">{children}</div>
    </section>
  );
}
