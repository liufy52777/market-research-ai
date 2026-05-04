import Link from "next/link";

const navLinks = [
  { href: "/", label: "首页" },
  { href: "/research", label: "开始调研" },
  { href: "/example", label: "示例报告" },
  { href: "/history", label: "历史报告" },
];

export default function SiteHeader() {
  return (
    <header className="border-b border-zinc-200 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="text-lg font-bold tracking-tight text-zinc-900 transition-colors hover:text-zinc-700"
        >
          Market Research AI
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
