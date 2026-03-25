"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { Author } from "@/types";

gsap.registerPlugin(ScrollTrigger);

export default function AuthorsSection({ authors }: { authors: Author[] }) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".author-card",
        { y: 50, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.7,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-[var(--brand)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">작가 소개</h2>
          <Link
            href="/authors"
            className="text-sm text-white/60 hover:text-white transition-colors"
          >
            전체보기 →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {authors.slice(0, 4).map((author) => (
            <div key={author.id} className="author-card text-center group">
              <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-full overflow-hidden bg-white/10 mb-4 relative">
                {author.photo ? (
                  <Image
                    src={author.photo}
                    alt={author.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/40 text-2xl">
                    {author.name[0]}
                  </div>
                )}
              </div>
              <p className="text-white font-semibold text-sm mb-1">{author.name}</p>
              <p className="text-white/60 text-xs leading-relaxed line-clamp-2">{author.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
