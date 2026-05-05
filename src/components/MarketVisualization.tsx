/* ------------------------------------------------------------------ */
/*  Keyword-based market attractiveness scoring + hexagon radar       */
/* ------------------------------------------------------------------ */

interface DimensionScore {
  label: string;
  score: number; // 0-100
}

const DIMENSIONS = [
  { key: "marketSize", label: "市场规模" },
  { key: "growthPotential", label: "增长潜力" },
  { key: "competitionIntensity", label: "竞争强度" },
  { key: "entryBarrier", label: "进入难度" },
  { key: "policyRisk", label: "政策风险" },
  { key: "supplyChainMaturity", label: "供应链成熟度" },
] as const;

/* ------------------------------------------------------------------ */
/*  Keyword-based scoring                                             */
/* ------------------------------------------------------------------ */

function scoreDimension(text: string): DimensionScore[] {
  // Normalize text
  const t = text.toLowerCase();

  // Positive indicators (push scores up)
  const positivePatterns: Record<string, RegExp[]> = {
    marketSize: [/市场[规模]/g, /需求[量大旺盛]/g, /市场规模/g, /进口[量额]/g, /需求量/g],
    growthPotential: [/增长/g, /上升/g, /扩展/g, /增速/g, /发展[趋势前景]/g, /机会/g, /空间/g, /潜力/g],
    competitionIntensity: [/竞争/g, /对手/g, /竞争者/g, /品牌/g, /巨头/g, /供应商/g],
    entryBarrier: [/壁垒/g, /门槛/g, /认证/g, /准入/g, /许可/g, /标准/g, /合规/g, /本地化/g],
    policyRisk: [/政策/g, /关税/g, /法规/g, /风险/g, /监管/g, /政治/g, /不确定性/g, /贸易/g],
    supplyChainMaturity: [/供应链/g, /物流/g, /仓储/g, /配送/g, /渠道/g, /分销/g, /配套/g, /基础设施/g],
  };

  // Negative indicators (for certain dimensions like policy risk, lower is better)
  const negativePatterns: Record<string, RegExp[]> = {
    marketSize: [/市场[狭小]/g, /需求不[足旺]/g, /饱和/g],
    growthPotential: [/下降/g, /萎缩/g, /衰退/g, /减缓/g, /低迷/g],
    competitionIntensity: [/竞争[少弱]/g, /缺乏竞争/g, /空白市场/g],
    entryBarrier: [/开放/g, /自由/g, /便利/g, /门槛低/g, /无限制/g],
    policyRisk: [/政策[支持利好]/g, /稳定/g, /优惠/g, /鼓励/g, /扶持/g, /开放/g],
    supplyChainMaturity: [/供应链[成熟完善]/g, /物流便利/g],
  };

  const results: DimensionScore[] = DIMENSIONS.map(({ key, label }) => {
    const posMatches = positivePatterns[key].reduce((sum, re) => {
      const m = t.match(re);
      return sum + (m ? m.length : 0);
    }, 0);

    const negMatches = negativePatterns[key].reduce((sum, re) => {
      const m = t.match(re);
      return sum + (m ? m.length : 0);
    }, 0);

    // Base score with positive boost and negative penalty
    // For competition/policy/entry, higher matches mean higher challenges (still shown as score)
    let raw = 40 + posMatches * 6 - negMatches * 5;

    // Special handling for "competition" and "policy" — more mentions = higher score (more challenging)
    if (
      key === "competitionIntensity" ||
      key === "entryBarrier" ||
      key === "policyRisk"
    ) {
      raw = raw + posMatches * 2;
    }

    // Growth-related dimensions get boost from positive mentions
    if (key === "growthPotential" || key === "marketSize") {
      raw = raw + posMatches * 3;
    }

    // Clamp to 15-95 range
    const score = Math.min(95, Math.max(15, Math.round(raw)));

    return { label, score };
  });

  return results;
}

/* ------------------------------------------------------------------ */
/*  Hexagon radar chart (SVG)                                         */
/* ------------------------------------------------------------------ */

const SIZE = 240;
const CENTER = SIZE / 2;
const RADIUS = 90;
const SIDES = 6;

function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
  return {
    x: cx + r * Math.cos(angle - Math.PI / 2),
    y: cy + r * Math.sin(angle - Math.PI / 2),
  };
}

function RadarHex({ scores }: { scores: DimensionScore[] }) {
  const levels = 4;

  const gridPolygons = Array.from({ length: levels }, (_, i) => {
    const r = ((i + 1) / levels) * RADIUS;
    const pts = Array.from({ length: SIDES }, (_, j) => {
      const angle = (2 * Math.PI * j) / SIDES;
      const { x, y } = polarToCartesian(CENTER, CENTER, r, angle);
      return `${x},${y}`;
    }).join(" ");
    return pts;
  });

  const dataPts = scores.map((s, i) => {
    const angle = (2 * Math.PI * i) / SIDES;
    const r = (s.score / 100) * RADIUS;
    const { x, y } = polarToCartesian(CENTER, CENTER, r, angle);
    return { x, y };
  });
  const dataPolygon = dataPts.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
      <defs>
        <linearGradient id="radarGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.15" />
        </linearGradient>
      </defs>

      {/* Grid */}
      {gridPolygons.map((pts, i) => (
        <polygon
          key={`g-${i}`}
          points={pts}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={i === levels - 1 ? 1.5 : 0.8}
        />
      ))}

      {/* Axes */}
      {scores.map((_, i) => {
        const angle = (2 * Math.PI * i) / SIDES;
        const outer = polarToCartesian(CENTER, CENTER, RADIUS, angle);
        return (
          <line
            key={`a-${i}`}
            x1={CENTER}
            y1={CENTER}
            x2={outer.x}
            y2={outer.y}
            stroke="#e2e8f0"
            strokeWidth={0.8}
          />
        );
      })}

      {/* Data polygon */}
      <polygon
        points={dataPolygon}
        fill="url(#radarGrad)"
        stroke="#6366f1"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* Data dots */}
      {dataPts.map((p, i) => (
        <circle
          key={`d-${i}`}
          cx={p.x}
          cy={p.y}
          r={3.5}
          fill="#6366f1"
          stroke="#fff"
          strokeWidth={1.5}
        />
      ))}

      {/* Labels */}
      {scores.map((s, i) => {
        const angle = (2 * Math.PI * i) / SIDES;
        const labelR = RADIUS + 30;
        const { x, y } = polarToCartesian(CENTER, CENTER, labelR, angle);
        const dx = x - CENTER;
        let anchor: "start" | "middle" | "end" = "middle";
        if (dx > 20) anchor = "start";
        else if (dx < -20) anchor = "end";
        return (
          <text
            key={`l-${i}`}
            x={x}
            y={y}
            textAnchor={anchor}
            dominantBaseline="middle"
            className="fill-slate-600"
            style={{ fontSize: "11px" }}
          >
            {s.label}
          </text>
        );
      })}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Public component                                                  */
/* ------------------------------------------------------------------ */

export default function MarketVisualization({ reportText }: { reportText: string }) {
  const scores = scoreDimension(reportText);
  const avg = Math.round(
    scores.reduce((sum, s) => sum + s.score, 0) / scores.length,
  );

  let judgment = "";
  let judgmentColor = "";

  if (avg >= 80) {
    judgment = "市场吸引力较强，建议重点跟进";
    judgmentColor = "text-emerald-700 bg-emerald-50/70 border-emerald-200/60";
  } else if (avg >= 60) {
    judgment = "具备进入潜力，但需进一步验证";
    judgmentColor = "text-amber-700 bg-amber-50/70 border-amber-200/60";
  } else {
    judgment = "进入需谨慎，建议先做小规模测试";
    judgmentColor = "text-red-700 bg-red-50/70 border-red-200/60";
  }

  const gaugeDash = (avg / 100) * 125;

  return (
    <section className="mt-8">
      <h2 className="text-xl font-bold text-slate-900">市场可视化分析</h2>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        {/* Summary score card */}
        <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-5 shadow-sm backdrop-blur-sm lg:col-span-1">
          <p className="text-xs font-medium text-slate-400">市场吸引力综合评分</p>

          {/* Gauge ring */}
          <div className="mt-3 flex items-center justify-center">
            <svg width="100" height="60" viewBox="0 0 100 60">
              <path
                d="M10 50 A40 40 0 0 1 90 50"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="10"
                strokeLinecap="round"
              />
              <path
                d="M10 50 A40 40 0 0 1 90 50"
                fill="none"
                stroke={avg >= 80 ? "#10b981" : avg >= 60 ? "#f59e0b" : "#ef4444"}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={`${gaugeDash} 200`}
              />
            </svg>
            <span className="absolute text-2xl font-bold text-slate-800">
              {avg}
            </span>
          </div>
          <p className="mt-1 text-center text-xs text-slate-400">满分 100</p>

          <div
            className={`mt-4 rounded-xl border px-4 py-3 text-sm font-medium ${judgmentColor} backdrop-blur-sm`}
          >
            {judgment}
          </div>
        </div>

        {/* Radar chart */}
        <div className="flex items-center justify-center rounded-2xl border border-slate-200/80 bg-white/80 p-5 shadow-sm backdrop-blur-sm lg:col-span-1">
          <RadarHex scores={scores} />
        </div>

        {/* Score list */}
        <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-5 shadow-sm backdrop-blur-sm lg:col-span-1">
          <p className="mb-4 text-xs font-medium text-slate-400">维度评分详情</p>
          <div className="space-y-3">
            {scores.map((s) => (
              <div key={s.label}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-slate-600">{s.label}</span>
                  <span className="font-semibold text-slate-700">{s.score}</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full transition-all ${
                      s.score >= 80
                        ? "bg-emerald-400"
                        : s.score >= 60
                          ? "bg-amber-400"
                          : "bg-red-400"
                    }`}
                    style={{ width: `${s.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
