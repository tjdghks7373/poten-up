"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";
import { theme } from "@/lib/theme";
import { Book } from "@/types";

gsap.registerPlugin(ScrollTrigger);

const Section = styled.section`
  padding: 6rem 0;
  background: ${theme.colors.white};
`;

const Inner = styled.div`
  max-width: ${theme.maxWidth};
  margin: 0 auto;
  padding: 0 1.5rem;
`;

const Header = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.875rem;
  font-weight: 700;
  color: ${theme.colors.brand};

  @media (min-width: 640px) {
    font-size: 2.25rem;
  }
`;

const ViewAll = styled(Link)`
  font-size: 0.875rem;
  color: ${theme.colors.muted};
  transition: color 0.2s;

  &:hover {
    color: ${theme.colors.fg};
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const BookCard = styled(Link)`
  display: block;
`;

const CoverWrapper = styled.div`
  aspect-ratio: 3/4;
  position: relative;
  border-radius: 0.5rem;
  overflow: hidden;
  background: ${theme.colors.border};
  margin-bottom: 0.75rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  transition: box-shadow 0.2s;

  ${BookCard}:hover & {
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }
`;

const CoverImage = styled(Image)`
  object-fit: cover;
  transition: transform 0.5s;

  ${BookCard}:hover & {
    transform: scale(1.05);
  }
`;

const NoCover = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.muted};
  font-size: 0.875rem;
`;

const Genre = styled.p`
  font-size: 0.75rem;
  color: ${theme.colors.accent};
  font-weight: 500;
  margin-bottom: 0.25rem;
`;

const BookTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${theme.colors.fg};
  line-height: 1.3;
  margin-bottom: 0.125rem;
  transition: color 0.2s;

  ${BookCard}:hover & {
    color: ${theme.colors.brand};
  }
`;

const Author = styled.p`
  font-size: 0.75rem;
  color: ${theme.colors.muted};
`;

const NewBadge = styled.span`
  display: inline-block;
  font-size: 0.625rem;
  font-weight: 700;
  padding: 0.125rem 0.375rem;
  border-radius: 9999px;
  background: ${theme.colors.accent};
  color: ${theme.colors.white};
  margin-left: 0.375rem;
  vertical-align: middle;
  letter-spacing: 0.05em;
`;

export default function FeaturedBooks({ books }: { books: Book[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (books.length === 0) return;
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

  if (books.length === 0) return null;

  return (
    <Section ref={sectionRef}>
      <Inner>
        <Header>
          <SectionTitle className="featured-title">추천 도서</SectionTitle>
          <ViewAll href="/books">전체보기 →</ViewAll>
        </Header>

        <Grid ref={cardsRef}>
          {books.slice(0, 4).map((book) => (
            <BookCard key={book.id} href={`/books/${book.slug}`} className="book-card">
              <CoverWrapper>
                {book.cover ? (
                  <CoverImage src={book.cover} alt={book.title} fill />
                ) : (
                  <NoCover>표지 없음</NoCover>
                )}
              </CoverWrapper>
              <Genre>{book.genre}</Genre>
              <BookTitle>
                {book.title}
                {book.isNew && <NewBadge>NEW</NewBadge>}
              </BookTitle>
              <Author>{book.author}</Author>
            </BookCard>
          ))}
        </Grid>
      </Inner>
    </Section>
  );
}
