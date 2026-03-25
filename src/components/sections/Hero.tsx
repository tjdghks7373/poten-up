"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Link from "next/link";

export default function Hero() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        lineRef.current,
        { scaleX: 0, transformOrigin: "left" },
        { scaleX: 1, duration: 0.8 }
      )
        .fromTo(
          titleRef.current,
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, duration: 1 },
          "-=0.3"
        )
        .fromTo(
          subRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          "-=0.5"
        )
        .fromTo(
          ctaRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 },
          "-=0.4"
        );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="min-h-screen flex items-center pt-16 bg-[var(--bg)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full">
        <div className="max-w-3xl">
          <div
            ref={lineRef}
            className="w-16 h-1 bg-[var(--accent)] mb-8 rounded-full"
          />
          <h1
            ref={titleRef}
            className="text-5xl sm:text-7xl font-bold text-[var(--brand)] leading-tight mb-6"
            style={{ opacity: 0 }}
          >
            좋은 글이
            <br />
            세상을 바꿉니다.
          </h1>
          <p
            ref={subRef}
            className="text-lg sm:text-xl text-[var(--muted)] leading-relaxed mb-10"
            style={{ opacity: 0 }}
          >
            포텐업 출판사는 가능성을 발견하고 이야기를 세상과 잇습니다.
            <br className="hidden sm:block" />
            작가와 독자 사이의 다리를 놓는 일에 최선을 다합니다.
          </p>
          <div ref={ctaRef} className="flex gap-4 flex-wrap" style={{ opacity: 0 }}>
            <Link
              href="/books"
              className="px-6 py-3 bg-[var(--brand)] text-white rounded-full text-sm font-medium hover:bg-[var(--brand-light)] transition-colors"
            >
              도서 둘러보기
            </Link>
            <Link
              href="/authors"
              className="px-6 py-3 border border-[var(--brand)] text-[var(--brand)] rounded-full text-sm font-medium hover:bg-[var(--brand)] hover:text-white transition-colors"
            >
              작가 소개
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
