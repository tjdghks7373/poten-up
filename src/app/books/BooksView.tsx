"use client";

import { useState, useMemo } from "react";
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
  margin-bottom: 1.5rem;
`;

const FilterRow = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const SearchInput = styled.input`
  flex: 1;
  min-width: 160px;
  padding: 0.5rem 0.75rem;
  border: 1px solid ${theme.colors.border};
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: ${theme.colors.fg};
  background: ${theme.colors.white};
  font-family: inherit;
  outline: none;

  &:focus {
    border-color: ${theme.colors.brand};
  }
`;

const SelectWrapper = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;

  &::after {
    content: "";
    position: absolute;
    right: 0.75rem;
    width: 0.4rem;
    height: 0.4rem;
    border-right: 1.5px solid ${theme.colors.muted};
    border-bottom: 1.5px solid ${theme.colors.muted};
    transform: rotate(45deg) translateY(-30%);
    pointer-events: none;
  }
`;

const GenreSelect = styled.select`
  appearance: none;
  padding: 0.5rem 2.25rem 0.5rem 0.75rem;
  border: 1px solid ${theme.colors.border};
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: ${theme.colors.fg};
  background: ${theme.colors.white};
  font-family: inherit;
  outline: none;
  cursor: pointer;

  &:focus {
    border-color: ${theme.colors.brand};
  }
`;

const Empty = styled.p`
  color: ${theme.colors.muted};
  font-size: 0.875rem;
  padding: 2rem 0;
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

function track(type: string, slug: string, title: string) {
  fetch("/api/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, slug, title }),
  }).catch(() => {});
}

export default function BooksView({ books }: { books: Book[] }) {
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("");

  const genres = useMemo(() => {
    const set = new Set(books.map((b) => b.genre).filter(Boolean));
    return Array.from(set).sort();
  }, [books]);

  const filtered = useMemo(() => {
    return books.filter((b) => {
      const matchQuery = b.title.toLowerCase().includes(query.toLowerCase()) ||
        b.author.toLowerCase().includes(query.toLowerCase());
      const matchGenre = genre === "" || b.genre === genre;
      return matchQuery && matchGenre;
    });
  }, [books, query, genre]);

  return (
    <Wrapper>
      <PageTitle>도서 목록</PageTitle>
      <Desc>포텐업 출판사의 모든 도서를 만나보세요.</Desc>

      <FilterRow>
        <SearchInput
          placeholder="제목 또는 저자 검색..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <SelectWrapper>
          <GenreSelect value={genre} onChange={(e) => setGenre(e.target.value)}>
            <option value="">전체 장르</option>
            {genres.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </GenreSelect>
        </SelectWrapper>
      </FilterRow>

      {filtered.length === 0 ? (
        <Empty>검색 결과가 없습니다.</Empty>
      ) : (
        <Grid>
          {filtered.map((book) => (
            <BookCard key={book.id} href={`/books/${book.slug}`} onClick={() => track("book", book.slug, book.title)}>
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
      )}
    </Wrapper>
  );
}
