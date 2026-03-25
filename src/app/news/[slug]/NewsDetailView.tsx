"use client";

import styled from "styled-components";
import { theme } from "@/lib/theme";
import { NewsItem } from "@/types";

const Wrapper = styled.div`
  padding-top: 6rem;
  padding-bottom: 5rem;
  max-width: 48rem;
  margin: 0 auto;
  padding-left: 1rem;
  padding-right: 1rem;

  @media (min-width: 640px) {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
`;

const CategoryBadge = styled.span`
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  background: ${theme.colors.brand}1a;
  color: ${theme.colors.brand};
  font-weight: 500;
`;

const Title = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: ${theme.colors.brand};
  margin-top: 1rem;
  margin-bottom: 0.75rem;
  line-height: 1.2;

  @media (min-width: 640px) {
    font-size: 2.25rem;
  }
`;

const Date = styled.p`
  font-size: 0.875rem;
  color: ${theme.colors.muted};
  margin-bottom: 2.5rem;
`;

const Divider = styled.div`
  height: 1px;
  background: ${theme.colors.border};
  margin-bottom: 2.5rem;
`;

const Content = styled.div`
  color: ${theme.colors.fg};
  line-height: 1.7;
  font-size: 0.875rem;

  @media (min-width: 640px) {
    font-size: 1rem;
  }

  p { margin: 0 0 0.75rem; }
  p:last-child { margin-bottom: 0; }
  h2 { font-size: 1.125rem; font-weight: 700; margin: 1rem 0 0.5rem; color: ${theme.colors.brand}; }
  h3 { font-size: 1rem; font-weight: 600; margin: 0.75rem 0 0.375rem; }
  ul, ol { padding-left: 1.5rem; margin: 0.5rem 0; }
  li { margin-bottom: 0.25rem; }
  strong { font-weight: 700; }
  em { font-style: italic; }
  u { text-decoration: underline; }
`;

export default function NewsDetailView({ item }: { item: NewsItem }) {
  return (
    <Wrapper>
      <div>
        <CategoryBadge>{item.category}</CategoryBadge>
      </div>
      <Title>{item.title}</Title>
      <Date>{item.date}</Date>

      <Divider />

      <Content dangerouslySetInnerHTML={{ __html: item.content }} />
    </Wrapper>
  );
}
