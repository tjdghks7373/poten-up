"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { NewsItem } from "@/types";

gsap.registerPlugin(ScrollTrigger);

export default function LatestNews({ news }: { news: NewsItem[] }) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".news-title",
        { x: -40, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        }
      );

      gsap.fromTo(
        ".news-item",
        { x: 40, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-[var(--bg)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-12">
          <h2 className="news-title text-3xl sm:text-4xl font-bold text-[var(--brand)]">
            뉴스 / 공지
          </h2>
          <Link
            href="/news"
            className="text-sm text-[var(--muted)] hover:text-[var(--fg)] transition-colors"
          >
            전체보기 →
          </Link>
        </div>

        <div className="divide-y divide-[var(--border)]">
          {news.slice(0, 5).map((item) => (
            <Link
              key={item.id}
              href={`/news/${item.slug}`}
              className="news-item flex items-center justify-between py-5 group"
            >
              <div className="flex items-center gap-4">
                <span className="hidden sm:inline text-xs px-2 py-1 rounded-full bg-[var(--brand)]/10 text-[var(--brand)] font-medium">
                  {item.category}
                </span>
                <p className="text-sm sm:text-base font-medium text-[var(--fg)] group-hover:text-[var(--brand)] transition-colors">
                  {item.title}
                </p>
              </div>
              <span className="text-xs text-[var(--muted)] shrink-0 ml-4">{item.date}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
