"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { Book } from "@/types";

gsap.registerPlugin(ScrollTrigger);

export default function FeaturedBooks({ books }: { books: Book[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".featured-title",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        }
      );

      gsap.fromTo(
        ".book-card",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 80%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-12">
          <h2 className="featured-title text-3xl sm:text-4xl font-bold text-[var(--brand)]">
            추천 도서
          </h2>
          <Link
            href="/books"
            className="text-sm text-[var(--muted)] hover:text-[var(--fg)] transition-colors"
          >
            전체보기 →
          </Link>
        </div>

        <div
          ref={cardsRef}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {books.slice(0, 4).map((book) => (
            <Link key={book.id} href={`/books/${book.slug}`} className="book-card group">
              <div className="aspect-[3/4] relative rounded-lg overflow-hidden bg-[var(--border)] mb-3 shadow-sm group-hover:shadow-md transition-shadow">
                {book.cover ? (
                  <Image
                    src={book.cover}
                    alt={book.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[var(--muted)] text-sm">
                    표지 없음
                  </div>
                )}
              </div>
              <p className="text-xs text-[var(--accent)] font-medium mb-1">{book.genre}</p>
              <h3 className="text-sm font-semibold text-[var(--fg)] leading-snug mb-0.5 group-hover:text-[var(--brand)] transition-colors">
                {book.title}
              </h3>
              <p className="text-xs text-[var(--muted)]">{book.author}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
