export default function SiteFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="flex flex-col items-center text-center">
          <p className="mb-2 text-sm font-semibold text-zinc-700">
            Market Research AI
          </p>
          <p className="mb-1 text-sm text-zinc-400">
            AI 驱动的市场调研报告生成工具
          </p>
          <p className="mb-4 text-xs text-zinc-400">
            版本：本地原型版
          </p>
          <p className="max-w-md text-xs leading-relaxed text-zinc-400">
            提示：当前报告内容为模板生成结果，后续可扩展联网搜索、来源引用与真实 AI 生成能力。
          </p>
        </div>
      </div>
    </footer>
  );
}
