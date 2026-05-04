import Link from "next/link";

const navLinks = [
  { href: "/", label: "首页" },
  { href: "/research", label: "开始调研" },
  { href: "/example", label: "示例报告" },
  { href: "/history", label: "历史报告" },
];

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/80 shadow-sm shadow-slate-200/20 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-lg font-bold tracking-tight text-transparent"
        >
          Market Research AI
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-500 transition-all hover:bg-blue-50 hover:text-blue-600"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
