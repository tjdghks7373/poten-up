"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import styled from "styled-components";
import { theme } from "@/lib/theme";
import { NewsItem } from "@/types";

gsap.registerPlugin(ScrollTrigger);

const Section = styled.section`
  padding: 6rem 0;
  background: ${theme.colors.bg};
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

const List = styled.div`
  & > * + * {
    border-top: 1px solid ${theme.colors.border};
  }
`;

const NewsLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 0;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const CategoryBadge = styled.span`
  display: none;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  background: ${theme.colors.brand}1a;
  color: ${theme.colors.brand};
  font-weight: 500;

  @media (min-width: 640px) {
    display: inline;
  }
`;

const NewsTitle = styled.p<{ $hover?: boolean }>`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${theme.colors.fg};
  transition: color 0.2s;

  ${NewsLink}:hover & {
    color: ${theme.colors.brand};
  }

  @media (min-width: 640px) {
    font-size: 1rem;
  }
`;

const Date = styled.span`
  font-size: 0.75rem;
  color: ${theme.colors.muted};
  flex-shrink: 0;
  margin-left: 1rem;
`;

export default function LatestNews({ news }: { news: NewsItem[] }) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (news.length === 0) return;
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

  if (news.length === 0) return null;

  return (
    <Section ref={sectionRef}>
      <Inner>
        <Header>
          <SectionTitle className="news-title">뉴스 / 공지</SectionTitle>
          <ViewAll href="/news">전체보기 →</ViewAll>
        </Header>

        <List>
          {news.slice(0, 5).map((item) => (
            <NewsLink key={item.id} href={`/news/${item.slug}`} className="news-item">
              <Left>
                <CategoryBadge>{item.category}</CategoryBadge>
                <NewsTitle>{item.title}</NewsTitle>
              </Left>
              <Date>{item.date}</Date>
            </NewsLink>
          ))}
        </List>
      </Inner>
    </Section>
  );
}
