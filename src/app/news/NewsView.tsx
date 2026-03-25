"use client";

import Link from "next/link";
import styled from "styled-components";
import { theme } from "@/lib/theme";
import { NewsItem } from "@/types";

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

export default function NewsView({ newsList }: { newsList: NewsItem[] }) {
  return (
    <Wrapper>
      <PageTitle>뉴스 / 공지</PageTitle>
      <Desc>포텐업 출판사의 최신 소식을 확인하세요.</Desc>

      <List>
        {newsList.map((item) => (
          <NewsLink key={item.id} href={`/news/${item.slug}`}>
            <Left>
              <CategoryBadge>{item.category}</CategoryBadge>
              <Title>{item.title}</Title>
            </Left>
            <Date>{item.date}</Date>
          </NewsLink>
        ))}
      </List>
    </Wrapper>
  );
}
