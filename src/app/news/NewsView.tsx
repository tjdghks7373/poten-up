"use client";

import { useState } from "react";
import Link from "next/link";
import styled from "styled-components";
import { theme } from "@/lib/theme";
import { NewsItem } from "@/types";

const PAGE_SIZE = 10;

const Wrapper = styled.div`
  padding-top: 6rem;
  padding-bottom: 5rem;
  max-width: 1152px;
  margin: 0 auto;
  padding-left: 1rem;
  padding-right: 1rem;

  @media (min-width: 640px) {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
`;

const PageTitle = styled.h1`
  font-size: 2.25rem;
  font-weight: 700;
  color: ${theme.colors.brand};
  margin-bottom: 0.5rem;
`;

const Desc = styled.p`
  color: ${theme.colors.muted};
  margin-bottom: 3rem;
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
  flex-shrink: 0;

  @media (min-width: 640px) {
    display: inline;
  }
`;

const Title = styled.p`
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

const Pagination = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  margin-top: 2.5rem;
`;

const PageBtn = styled.button<{ $active?: boolean }>`
  width: 2rem;
  height: 2rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-family: inherit;
  font-weight: ${({ $active }) => $active ? "700" : "400"};
  background: ${({ $active }) => $active ? theme.colors.brand : "transparent"};
  color: ${({ $active }) => $active ? theme.colors.white : theme.colors.fg};
  border: 1px solid ${({ $active }) => $active ? theme.colors.brand : theme.colors.border};
  cursor: pointer;
  transition: all 0.15s;

  &:hover:not(:disabled) {
    border-color: ${theme.colors.brand};
    color: ${({ $active }) => $active ? theme.colors.white : theme.colors.brand};
  }

  &:disabled {
    opacity: 0.35;
    cursor: default;
  }
`;

function track(type: string, slug: string, title: string) {
  fetch("/api/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, slug, title }),
  }).catch(() => {});
}

export default function NewsView({ newsList }: { newsList: NewsItem[] }) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(newsList.length / PAGE_SIZE);
  const paged = newsList.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <Wrapper>
      <PageTitle>뉴스 / 공지</PageTitle>
      <Desc>포텐업 출판사의 최신 소식을 확인하세요.</Desc>

      <List>
        {paged.map((item) => (
          <NewsLink key={item.id} href={`/news/${item.slug}`} onClick={() => track("news", item.slug, item.title)}>
            <Left>
              <CategoryBadge>{item.category}</CategoryBadge>
              <Title>{item.title}</Title>
            </Left>
            <Date>{item.date}</Date>
          </NewsLink>
        ))}
      </List>

      {totalPages > 1 && (
        <Pagination>
          <PageBtn onClick={() => setPage(page - 1)} disabled={page === 1}>‹</PageBtn>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <PageBtn key={p} $active={p === page} onClick={() => setPage(p)}>{p}</PageBtn>
          ))}
          <PageBtn onClick={() => setPage(page + 1)} disabled={page === totalPages}>›</PageBtn>
        </Pagination>
      )}
    </Wrapper>
  );
}
