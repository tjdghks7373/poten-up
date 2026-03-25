"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";
import { theme } from "@/lib/theme";
import { Author } from "@/types";

gsap.registerPlugin(ScrollTrigger);

const Section = styled.section`
  padding: 6rem 0;
  background: ${theme.colors.brand};
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
  color: ${theme.colors.white};

  @media (min-width: 640px) {
    font-size: 2.25rem;
  }
`;

const ViewAll = styled(Link)`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.6);
  transition: color 0.2s;

  &:hover {
    color: ${theme.colors.white};
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;

  @media (min-width: 640px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const Card = styled.div`
  text-align: center;
`;

const AvatarWrapper = styled.div`
  width: 6rem;
  height: 6rem;
  margin: 0 auto 1rem;
  border-radius: 9999px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.1);
  position: relative;

  @media (min-width: 640px) {
    width: 7rem;
    height: 7rem;
  }
`;

const AvatarPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.4);
  font-size: 1.5rem;
`;

const Name = styled.p`
  color: ${theme.colors.white};
  font-weight: 600;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
`;

const Bio = styled.p`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.75rem;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export default function AuthorsSection({ authors }: { authors: Author[] }) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (authors.length === 0) return;
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

  if (authors.length === 0) return null;

  return (
    <Section ref={sectionRef}>
      <Inner>
        <Header>
          <SectionTitle>작가 소개</SectionTitle>
          <ViewAll href="/authors">전체보기 →</ViewAll>
        </Header>

        <Grid>
          {authors.slice(0, 4).map((author) => (
            <Card key={author.id} className="author-card">
              <AvatarWrapper>
                {author.photo ? (
                  <Image src={author.photo} alt={author.name} fill style={{ objectFit: "cover" }} />
                ) : (
                  <AvatarPlaceholder>{author.name[0]}</AvatarPlaceholder>
                )}
              </AvatarWrapper>
              <Name>{author.name}</Name>
              <Bio>{author.bio}</Bio>
            </Card>
          ))}
        </Grid>
      </Inner>
    </Section>
  );
}
