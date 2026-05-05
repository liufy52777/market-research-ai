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
          <svg width="32" height="32" viewBox="0 0 36 36" fill="none" className="h-8 w-8 shrink-0">
            <defs>
              <linearGradient id="logoHdr" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#2f6bff" />
                <stop offset="100%" stopColor="#7a5cff" />
              </linearGradient>
            </defs>
            <rect width="36" height="36" rx="10" fill="url(#logoHdr)" />
            <path d="M10 26L18 8L26 26" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="14" y1="20" x2="22" y2="20" stroke="white" strokeWidth="2" strokeLinecap="round" />
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
