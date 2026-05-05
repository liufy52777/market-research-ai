"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "首页" },
  { href: "/research", label: "开始调研" },
  { href: "/example", label: "示例报告" },
  { href: "/history", label: "历史报告" },
];

export default function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 h-[68px] border-b border-slate-200/50 bg-white/75 backdrop-blur-xl">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-5 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <svg width="36" height="36" viewBox="0 0 44 44" fill="none" className="h-9 w-9 shrink-0">
            <defs>
              <linearGradient id="logoHdr" x1="0.15" y1="0" x2="0.85" y2="1">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="35%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#7c3aed" />
              </linearGradient>
            </defs>
            <path d="M12 36 C16 24 19 14 22 8" fill="none" stroke="url(#logoHdr)" strokeWidth="12" strokeLinecap="round" />
            <path d="M32 36 C28 24 25 14 22 8" fill="none" stroke="url(#logoHdr)" strokeWidth="12" strokeLinecap="round" />
          </svg>
          <span className="text-lg font-bold tracking-tight text-[#102247]">Market Research AI</span>
        </Link>
        <nav className="flex items-center gap-0.5 sm:gap-1.5">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
