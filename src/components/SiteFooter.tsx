export default function SiteFooter() {
  return (
    <footer className="border-t border-slate-200/60 bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="flex flex-col items-center text-center">
          <p className="mb-2 text-sm font-semibold text-slate-800">
            Market Research AI
          </p>
          <p className="mb-1 text-sm text-slate-500">
            AI 驱动的市场调研报告生成工具
          </p>
          <p className="mb-4 text-xs text-slate-400">
            版本：本地原型版
          </p>
          <p className="max-w-md text-xs leading-relaxed text-slate-400">
            当前版本已接入 AI 模型生成报告。后续可扩展联网搜索、来源引用、PDF 导出与用户系统。
          </p>
        </div>
      </div>
    </footer>
  );
}
