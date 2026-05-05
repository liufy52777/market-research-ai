/* ------------------------------------------------------------------ */
/*  Native SVG radar (pentagon) chart — zero dependencies            */
/* ------------------------------------------------------------------ */

interface RadarProps {
  scores: Record<string, number>;
}

const DIMENSIONS = ["市场需求", "进入门槛", "竞争压力", "供应链匹配度", "中国企业机会"];
const SIZE = 260;
const CENTER = SIZE / 2;
const RADIUS = 100;
const LEVELS = 5;

function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
  return {
    x: cx + r * Math.cos(angle - Math.PI / 2),
    y: cy + r * Math.sin(angle - Math.PI / 2),
  };
}

function polygonPoints(cx: number, cy: number, r: number, sides: number) {
  const points: string[] = [];
  for (let i = 0; i < sides; i++) {
    const angle = (2 * Math.PI * i) / sides;
    const { x, y } = polarToCartesian(cx, cy, r, angle);
    points.push(`${x},${y}`);
  }
  return points.join(" ");
}

export default function ScoreRadarChart({ scores }: RadarProps) {
  const sides = DIMENSIONS.length;
  const dataPoints: { x: number; y: number }[] = [];

  for (let i = 0; i < sides; i++) {
    const dim = DIMENSIONS[i];
    const val = scores[dim] ?? 0;
    const angle = (2 * Math.PI * i) / sides;
    const r = (val / 5) * RADIUS;
    dataPoints.push(polarToCartesian(CENTER, CENTER, r, angle));
  }

  const dataPolygon = dataPoints.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <div className="flex flex-col items-center">
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="overflow-visible"
      >
        {/* Grid rings */}
        {Array.from({ length: LEVELS }, (_, i) => {
          const r = ((i + 1) / LEVELS) * RADIUS;
          return (
            <polygon
              key={`grid-${i}`}
              points={polygonPoints(CENTER, CENTER, r, sides)}
              fill="none"
              stroke="#e2e8f0"
              strokeWidth={1}
            />
          );
        })}

        {/* Axes from center to each vertex */}
        {DIMENSIONS.map((_, i) => {
          const angle = (2 * Math.PI * i) / sides;
          const outer = polarToCartesian(CENTER, CENTER, RADIUS, angle);
          return (
            <line
              key={`axis-${i}`}
              x1={CENTER}
              y1={CENTER}
              x2={outer.x}
              y2={outer.y}
              stroke="#e2e8f0"
              strokeWidth={1}
            />
          );
        })}

        {/* Data area */}
        <polygon
          points={dataPolygon}
          fill="rgba(59, 130, 246, 0.15)"
          stroke="#3b82f6"
          strokeWidth={2}
        />

        {/* Data points */}
        {dataPoints.map((p, i) => (
          <circle
            key={`dot-${i}`}
            cx={p.x}
            cy={p.y}
            r={4}
            fill="#3b82f6"
            stroke="#fff"
            strokeWidth={1.5}
          />
        ))}

        {/* Labels */}
        {DIMENSIONS.map((dim, i) => {
          const angle = (2 * Math.PI * i) / sides;
          const labelR = RADIUS + 28;
          const { x, y } = polarToCartesian(CENTER, CENTER, labelR, angle);
          // Readjust for text anchoring
          const dx = x - CENTER;
          const textAnchor = dx > 15 ? "start" : dx < -15 ? "end" : "middle";
          return (
            <text
              key={`label-${i}`}
              x={x}
              y={y}
              textAnchor={textAnchor}
              dominantBaseline="middle"
              className="fill-slate-600"
              style={{ fontSize: "12px" }}
            >
              {dim}
            </text>
          );
        })}
      </svg>

      {/* Score list below chart */}
      <div className="mt-4 flex flex-wrap justify-center gap-3">
        {DIMENSIONS.map((dim) => (
          <span
            key={dim}
            className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600"
          >
            <span className="text-blue-600">{scores[dim] ?? "?"}</span>
            <span className="text-slate-400">{dim}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
