"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Link from "next/link";
import styled from "styled-components";
import { theme } from "@/lib/theme";

const Section = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding-top: 4rem;
  background: ${theme.colors.bg};
`;

const Inner = styled.div`
  max-width: ${theme.maxWidth};
  margin: 0 auto;
  padding: 0 1.5rem;
  width: 100%;
`;

const Content = styled.div`
  max-width: 48rem;
`;

const AccentLine = styled.div`
  width: 4rem;
  height: 4px;
  background: ${theme.colors.accent};
  margin-bottom: 2rem;
  border-radius: 9999px;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  color: ${theme.colors.brand};
  line-height: 1.2;
  margin-bottom: 1.5rem;

  @media (min-width: 640px) {
    font-size: 4.5rem;
  }
`;

const Sub = styled.p`
  font-size: 1.125rem;
  color: ${theme.colors.muted};
  line-height: 1.7;
  margin-bottom: 2.5rem;

  @media (min-width: 640px) {
    font-size: 1.25rem;
  }
`;

const CtaGroup = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const PrimaryBtn = styled(Link)`
  padding: 0.75rem 1.5rem;
  background: ${theme.colors.brand};
  color: ${theme.colors.white};
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  transition: background 0.2s;

  &:hover {
    background: ${theme.colors.brandLight};
  }
`;

const OutlineBtn = styled(Link)`
  padding: 0.75rem 1.5rem;
  border: 1px solid ${theme.colors.brand};
  color: ${theme.colors.brand};
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  transition: background 0.2s, color 0.2s;

  &:hover {
    background: ${theme.colors.brand};
    color: ${theme.colors.white};
  }
`;

const HiddenSm = styled.br`
  @media (max-width: 639px) {
    display: none;
  }
`;

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
    <Section>
      <Inner>
        <Content>
          <AccentLine ref={lineRef} />
          <Title ref={titleRef} style={{ opacity: 0 }}>
            좋은 글이
            <br />
            세상을 바꿉니다.
          </Title>
          <Sub ref={subRef} style={{ opacity: 0 }}>
            포텐업 출판사는 가능성을 발견하고 이야기를 세상과 잇습니다.
            <HiddenSm />
            작가와 독자 사이의 다리를 놓는 일에 최선을 다합니다.
          </Sub>
          <CtaGroup ref={ctaRef} style={{ opacity: 0 }}>
            <PrimaryBtn href="/books">도서 둘러보기</PrimaryBtn>
            <OutlineBtn href="/authors">작가 소개</OutlineBtn>
          </CtaGroup>
        </Content>
      </Inner>
    </Section>
  );
}
