"use client";

import Image from "next/image";
import styled from "styled-components";
import { theme } from "@/lib/theme";
import { Book } from "@/types";

const Wrapper = styled.div`
  padding-top: 6rem;
  padding-bottom: 5rem;
  max-width: 56rem;
  margin: 0 auto;
  padding-left: 1rem;
  padding-right: 1rem;

  @media (min-width: 640px) {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
`;

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.5rem;

  @media (min-width: 640px) {
    flex-direction: row;
  }
`;

const CoverCol = styled.div`
  width: 12rem;
  flex-shrink: 0;
  margin: 0 auto;

  @media (min-width: 640px) {
    width: 14rem;
    margin: 0;
  }
`;

const CoverWrapper = styled.div`
  aspect-ratio: 3/4;
  position: relative;
  border-radius: 0.5rem;
  overflow: hidden;
  background: ${theme.colors.border};
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
`;

const NoCover = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.muted};
`;

const Info = styled.div`
  flex: 1;
`;

const Genre = styled.p`
  font-size: 0.875rem;
  color: ${theme.colors.accent};
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

const Title = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: ${theme.colors.brand};
  margin-bottom: 0.5rem;
  line-height: 1.2;

  @media (min-width: 640px) {
    font-size: 2.25rem;
  }
`;

const AuthorName = styled.p`
  color: ${theme.colors.muted};
  margin-bottom: 0.25rem;
`;

const PublishedAt = styled.p`
  font-size: 0.875rem;
  color: ${theme.colors.muted};
  margin-bottom: 2rem;
`;

const Divider = styled.div`
  height: 1px;
  background: ${theme.colors.border};
  margin-bottom: 2rem;
`;

const Description = styled.div`
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

export default function BookDetailView({ book }: { book: Book }) {
  return (
    <Wrapper>
      <Layout>
        <CoverCol>
          <CoverWrapper>
            {book.cover ? (
              <Image src={book.cover} alt={book.title} fill style={{ objectFit: "cover" }} />
            ) : (
              <NoCover>표지 없음</NoCover>
            )}
          </CoverWrapper>
        </CoverCol>

        <Info>
          <Genre>{book.genre}</Genre>
          <Title>{book.title}</Title>
          <AuthorName>{book.author}</AuthorName>
          <PublishedAt>{book.publishedAt} 출판</PublishedAt>

          <Divider />

          <Description dangerouslySetInnerHTML={{ __html: book.description }} />
        </Info>
      </Layout>
    </Wrapper>
  );
}
