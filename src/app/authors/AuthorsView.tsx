"use client";

import Image from "next/image";
import styled from "styled-components";
import { theme } from "@/lib/theme";
import { Author } from "@/types";

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
  grid-template-columns: 1fr;
  gap: 2rem;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const Card = styled.div`
  display: flex;
  gap: 1.25rem;
  padding: 1.5rem;
  border-radius: 0.75rem;
  background: ${theme.colors.white};
  border: 1px solid ${theme.colors.border};
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  }
`;

const AvatarWrapper = styled.div`
  width: 4rem;
  height: 4rem;
  border-radius: 9999px;
  overflow: hidden;
  background: ${theme.colors.border};
  position: relative;
  flex-shrink: 0;
`;

const AvatarPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.muted};
  font-size: 1.25rem;
  font-weight: 700;
`;

const Info = styled.div`
  flex: 1;
  min-width: 0;
`;

const Name = styled.h2`
  font-weight: 700;
  color: ${theme.colors.fg};
  margin-bottom: 0.25rem;
`;

const Bio = styled.p`
  font-size: 0.75rem;
  color: ${theme.colors.muted};
  line-height: 1.6;
  margin-bottom: 0.75rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const BookTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
`;

const BookTag = styled.span`
  font-size: 0.75rem;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  background: ${theme.colors.brand}1a;
  color: ${theme.colors.brand};
`;

export default function AuthorsView({ authors }: { authors: Author[] }) {
  return (
    <Wrapper>
      <PageTitle>작가 소개</PageTitle>
      <Desc>포텐업 출판사와 함께하는 작가들을 소개합니다.</Desc>

      <Grid>
        {authors.map((author) => (
          <Card key={author.id}>
            <AvatarWrapper>
              {author.photo ? (
                <Image src={author.photo} alt={author.name} fill style={{ objectFit: "cover" }} />
              ) : (
                <AvatarPlaceholder>{author.name[0]}</AvatarPlaceholder>
              )}
            </AvatarWrapper>
            <Info>
              <Name>{author.name}</Name>
              <Bio dangerouslySetInnerHTML={{ __html: author.bio }} />
              {author.books.length > 0 && (
                <BookTags>
                  {author.books.map((b) => (
                    <BookTag key={b}>{b}</BookTag>
                  ))}
                </BookTags>
              )}
            </Info>
          </Card>
        ))}
      </Grid>
    </Wrapper>
  );
}
