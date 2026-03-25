"use client";

import Link from "next/link";
import { useState } from "react";

const links = [
  { href: "/books", label: "도서 목록" },
  { href: "/news", label: "뉴스/공지" },
  { href: "/authors", label: "작가 소개" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--bg)]/90 backdrop-blur-md border-b border-[var(--border)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-[var(--brand)] tracking-tight">
          포텐업
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-[var(--muted)] hover:text-[var(--fg)] transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <button
          className="md:hidden p-2 text-[var(--fg)]"
          onClick={() => setOpen(!open)}
          aria-label="메뉴"
        >
          <span className="block w-5 h-0.5 bg-current mb-1" />
          <span className="block w-5 h-0.5 bg-current mb-1" />
          <span className="block w-5 h-0.5 bg-current" />
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-[var(--bg)] border-t border-[var(--border)] px-4 pb-4">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="block py-3 text-sm text-[var(--muted)] hover:text-[var(--fg)] transition-colors border-b border-[var(--border)] last:border-0"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
