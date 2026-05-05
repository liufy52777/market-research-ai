import type { ReactNode } from "react";

type Block =
  | { type: "h1"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[]; ordered: boolean }
  | { type: "table"; header: string[]; rows: string[][] }
  | { type: "hr" }
  | { type: "conclusion"; text: string }
  | { type: "score"; level: string };

/* ------------------------------------------------------------------ */
/*  Markdown-like text parser                                         */
/* ------------------------------------------------------------------ */

function parseBlocks(text: string): Block[] {
  const lines = text.split("\n");
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // Skip empty lines
    if (trimmed === "") {
      i++;
      continue;
    }

    // Horizontal rule
    if (/^[-*_]{3,}$/.test(trimmed)) {
      blocks.push({ type: "hr" });
      i++;
      continue;
    }

    // Table detection: lines containing |
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("|") && lines[i].trim().endsWith("|")) {
        tableLines.push(lines[i].trim());
        i++;
      }
      // Filter out separator rows (|---|---|)
      const dataLines = tableLines.filter(
        (l) => !/^\|[\s\-:|]+\|$/.test(l),
      );
      if (dataLines.length >= 2) {
        const header = dataLines[0]
          .split("|")
          .filter(Boolean)
          .map((c) => c.trim());
        const rows = dataLines.slice(1).map((row) =>
          row
            .split("|")
            .filter(Boolean)
            .map((c) => c.trim()),
        );
        if (header.length > 0 && rows.length > 0) {
          blocks.push({ type: "table", header, rows });
        }
      }
      continue;
    }

    // Heading 1
    if (trimmed.startsWith("# ") && !trimmed.startsWith("## ")) {
      blocks.push({ type: "h1", text: trimmed.slice(2).trim() });
      i++;
      continue;
    }

    // Heading 2
    if (trimmed.startsWith("## ") && !trimmed.startsWith("### ")) {
      blocks.push({ type: "h2", text: trimmed.slice(3).trim() });
      i++;
      continue;
    }

    // Heading 3
    if (trimmed.startsWith("### ")) {
      blocks.push({ type: "h3", text: trimmed.slice(4).trim() });
      i++;
      continue;
    }

    // Heading 4 (####)
    if (trimmed.startsWith("#### ")) {
      blocks.push({ type: "h3", text: trimmed.slice(5).trim() });
      i++;
      continue;
    }

    // Ordered list
    if (/^\d+[\.\)] /.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+[\.\)] /.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+[\.\)]\s*/, ""));
        i++;
      }
      blocks.push({ type: "list", items, ordered: true });
      continue;
    }

    // Unordered list
    if (/^[-*] /.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*] /.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[-*]\s*/, ""));
        i++;
      }
      blocks.push({ type: "list", items, ordered: false });
      continue;
    }

    // Conclusion detection
    if (
      trimmed.includes("建议优先进入") ||
      trimmed.includes("建议谨慎进入") ||
      trimmed.includes("暂不建议进入")
    ) {
      blocks.push({ type: "conclusion", text: trimmed });
      i++;
      continue;
    }

    // Market opportunity score level
    if (/市场机会等级[：:]\s*(高|中高|中|中低|低)/.test(trimmed)) {
      const match = trimmed.match(/市场机会等级[：:]\s*(高|中高|中|中低|低)/);
      if (match) {
        blocks.push({ type: "score", level: match[1] });
      }
      i++;
      continue;
    }

    // Default: paragraph (collect consecutive non-empty, non-special lines)
    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].trim().startsWith("#") &&
      !lines[i].trim().startsWith("|") &&
      !/^[-*] /.test(lines[i].trim()) &&
      !/^\d+[\.\)] /.test(lines[i].trim()) &&
      !/^[-*_]{3,}$/.test(lines[i].trim())
    ) {
      paraLines.push(lines[i].trim());
      i++;
    }
    if (paraLines.length > 0) {
      const t = paraLines.join(" ");
      // Re-check for conclusion keywords
      if (
        t.includes("建议优先进入") ||
        t.includes("建议谨慎进入") ||
        t.includes("暂不建议进入")
      ) {
        blocks.push({ type: "conclusion", text: t });
      } else {
        blocks.push({ type: "paragraph", text: t });
      }
    }
  }

  return blocks;
}

/* ------------------------------------------------------------------ */
/*  Block renderer                                                    */
/* ------------------------------------------------------------------ */

function BlockRenderer({ block }: { block: Block }) {
  switch (block.type) {
    case "h1":
      return (
        <h2 className="mb-3 mt-8 text-xl font-bold text-slate-900 first:mt-0">
          {block.text}
        </h2>
      );

    case "h2":
      return (
        <h3 className="mb-2 mt-6 border-b border-slate-100 pb-2 text-lg font-semibold text-slate-800">
          {block.text}
        </h3>
      );

    case "h3":
      return (
        <h4 className="mb-1.5 mt-4 text-base font-medium text-blue-700">
          {block.text}
        </h4>
      );

    case "paragraph":
      return (
        <p className="mb-3 text-sm leading-7 text-slate-600">
          {renderInline(block.text)}
        </p>
      );

    case "list":
      return block.ordered ? (
        <ol className="mb-3 ml-5 list-decimal space-y-1 text-sm leading-7 text-slate-600">
          {block.items.map((item, i) => (
            <li key={i}>{renderInline(item)}</li>
          ))}
        </ol>
      ) : (
        <ul className="mb-3 ml-5 list-disc space-y-1 text-sm leading-7 text-slate-600">
          {block.items.map((item, i) => (
            <li key={i}>{renderInline(item)}</li>
          ))}
        </ul>
      );

    case "table":
      return (
        <div className="mb-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-slate-100">
                {block.header.map((h, i) => (
                  <th
                    key={i}
                    className="border border-slate-200 px-3 py-2 text-left font-semibold text-slate-700"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, ri) => (
                <tr key={ri} className="even:bg-slate-50/50">
                  {row.map((cell, ci) => (
                    <td
                      key={ci}
                      className="border border-slate-200 px-3 py-2 text-slate-600"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case "hr":
      return <hr className="my-6 border-slate-100" />;

    case "conclusion":
      return (
        <div className="mb-3 rounded-xl border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50 px-5 py-3">
          <span className="text-sm font-bold text-blue-700">
            {block.text}
          </span>
        </div>
      );

    case "score": {
      const colors: Record<string, string> = {
        "高": "bg-emerald-100 text-emerald-800 border-emerald-200",
        "中高": "bg-blue-100 text-blue-800 border-blue-200",
        "中": "bg-amber-100 text-amber-800 border-amber-200",
        "中低": "bg-orange-100 text-orange-800 border-orange-200",
        "低": "bg-red-100 text-red-800 border-red-200",
      };
      return (
        <div className="mb-3 inline-block rounded-xl border px-4 py-1.5 text-sm font-semibold">
          <span className={colors[block.level] || "bg-slate-100 text-slate-600 border-slate-200"}>
            市场机会等级：{block.level}
          </span>
        </div>
      );
    }

    default:
      return null;
  }
}

/* ------------------------------------------------------------------ */
/*  Inline markdown helper                                             */
/* ------------------------------------------------------------------ */

function renderInline(text: string): ReactNode {
  // Bold: **text**
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-slate-800">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

/* ------------------------------------------------------------------ */
/*  Public component                                                   */
/* ------------------------------------------------------------------ */

export default function ReportRenderer({ text }: { text: string }) {
  const blocks = parseBlocks(text);

  return (
    <div>
      {blocks.map((block, i) => (
        <BlockRenderer key={i} block={block} />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Score extraction utility (for radar chart)                        */
/* ------------------------------------------------------------------ */

export function extractScores(text: string): {
  scores: Record<string, number>;
  found: boolean;
} {
  const dims = ["市场需求", "进入门槛", "竞争压力", "供应链匹配度", "中国企业机会"];
  const scores: Record<string, number> = {};

  for (const dim of dims) {
    // Try table format: | 市场需求 | 4 | reason |
    const tableRegex = new RegExp(
      `\\|\\s*${dim}\\s*\\|\\s*(\\d)\\s*\\|`,
      "i",
    );
    const tableMatch = text.match(tableRegex);
    if (tableMatch) {
      scores[dim] = parseInt(tableMatch[1], 10);
      continue;
    }

    // Try inline: 市场需求：4 分 or 市场需求 4 分
    const inlineRegex = new RegExp(`${dim}[：:\\s]*(\\d)\\s*分?`, "i");
    const inlineMatch = text.match(inlineRegex);
    if (inlineMatch) {
      scores[dim] = parseInt(inlineMatch[1], 10);
      continue;
    }
  }

  const found = Object.keys(scores).length >= 3;
  return { scores, found };
}

export function extractConclusion(text: string): string | null {
  const match = text.match(
    /(建议优先进入|建议谨慎进入|暂不建议进入)/,
  );
  return match ? match[1] : null;
}

export function extractScoreLevel(text: string): string | null {
  const match = text.match(/市场机会等级[：:]\s*(高|中高|中|中低|低)/);
  return match ? match[1] : null;
}
