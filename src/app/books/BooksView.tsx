"use client";

import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";
import { theme } from "@/lib/theme";
import { Book } from "@/types";

const Wrapper = styled.div`
  padding-top: 6rem;
  padding-bottom: 5rem;
  max-width: ${theme.maxWidth};
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

  @media (min-width: 1280px) {
    grid-template-columns: repeat(5, 1fr);
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

const BookTitle = styled.h2`
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

export default function BooksView({ books }: { books: Book[] }) {
  return (
    <Wrapper>
      <PageTitle>도서 목록</PageTitle>
      <Desc>포텐업 출판사의 모든 도서를 만나보세요.</Desc>

      <Grid>
        {books.map((book) => (
          <BookCard key={book.id} href={`/books/${book.slug}`}>
            <CoverWrapper>
              {book.cover ? (
                <CoverImage src={book.cover} alt={book.title} fill />
              ) : (
                <NoCover>표지 없음</NoCover>
              )}
            </CoverWrapper>
            <Genre>{book.genre}</Genre>
            <BookTitle>{book.title}</BookTitle>
            <Author>{book.author}</Author>
          </BookCard>
        ))}
      </Grid>
    </Wrapper>
  );
}
