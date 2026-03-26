"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Script from "next/script";
import styled from "styled-components";
import { theme } from "@/lib/theme";
import { Book } from "@/types";

declare global {
  interface Window {
    Kakao: {
      init: (key: string) => void;
      isInitialized: () => boolean;
      Share: {
        sendDefault: (options: object) => void;
      };
    };
  }
}

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
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
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

const ShareRow = styled.div`
  display: flex;
  gap: 0.625rem;
  margin-bottom: 2rem;
`;

const BaseBtn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1.125rem;
  border-radius: 0.5rem;
  font-size: 0.8125rem;
  font-weight: 600;
  font-family: inherit;
  letter-spacing: 0.01em;
  cursor: pointer;
  transition: all 0.15s;
`;

const KakaoBtn = styled(BaseBtn)`
  background: #fee500;
  border: 1px solid #fee500;
  color: rgba(0, 0, 0, 0.85);
  border-radius: 12px;
  gap: 0.5rem;

  &:hover {
    background: #fada00;
    border-color: #fada00;
  }
`;

const ShareBtn = styled(BaseBtn)<{ $copied?: boolean }>`
  background: ${({ $copied }) => $copied ? theme.colors.brand : theme.colors.white};
  border: 1px solid ${({ $copied }) => $copied ? theme.colors.brand : theme.colors.border};
  color: ${({ $copied }) => $copied ? theme.colors.white : theme.colors.fg};

  &:hover {
    border-color: ${theme.colors.brand};
    color: ${({ $copied }) => $copied ? theme.colors.white : theme.colors.brand};
  }
`;

const Description = styled.div`
  color: ${theme.colors.fg};
  line-height: 1.7;
  font-size: 0.875rem;

  @media (min-width: 640px) {
    font-size: 1rem;
  }

  p {
    margin: 0 0 0.75rem;
  }
  p:last-child {
    margin-bottom: 0;
  }
  h2 {
    font-size: 1.125rem;
    font-weight: 700;
    margin: 1rem 0 0.5rem;
    color: ${theme.colors.brand};
  }
  h3 {
    font-size: 1rem;
    font-weight: 600;
    margin: 0.75rem 0 0.375rem;
  }
  ul,
  ol {
    padding-left: 1.5rem;
    margin: 0.5rem 0;
  }
  li {
    margin-bottom: 0.25rem;
  }
  strong {
    font-weight: 700;
  }
  em {
    font-style: italic;
  }
  u {
    text-decoration: underline;
  }
`;

export default function BookDetailView({ book }: { book: Book }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_APP_KEY!);
    }
  }, []);

  function track(type: string) {
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, slug: book.slug, title: book.title }),
    }).catch(() => {});
  }

  function copyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      track("link_copy");
    });
  }

  function shareKakao() {
    if (!window.Kakao?.isInitialized()) return;
    track("kakao_share");
    window.Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: book.title,
        description: `${book.author} 저 | ${book.genre}`,
        imageUrl: book.cover || undefined,
        link: {
          mobileWebUrl: window.location.href,
          webUrl: window.location.href,
        },
      },
    });
  }

  return (
    <>
      <Script
        src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"
        onLoad={() => {
          if (!window.Kakao.isInitialized()) {
            window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_APP_KEY!);
          }
        }}
      />
    <Wrapper>
      <Layout>
        <CoverCol>
          <CoverWrapper>
            {book.cover ? (
              <Image
                src={book.cover}
                alt={book.title}
                fill
                style={{ objectFit: "cover" }}
              />
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

          <ShareRow>
            <KakaoBtn onClick={shareKakao}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M9 1.5C4.857 1.5 1.5 4.186 1.5 7.5c0 2.109 1.29 3.963 3.244 5.1L3.75 15.75l3.476-2.273C7.712 13.579 8.35 13.625 9 13.625c4.143 0 7.5-2.686 7.5-6s-3.357-6.125-7.5-6.125z" fill="#000000"/>
              </svg>
              카카오톡 공유
            </KakaoBtn>
            <ShareBtn onClick={copyLink} $copied={copied}>
              {copied ? "✓ 링크 복사됨" : "링크 복사"}
            </ShareBtn>
          </ShareRow>

          <Divider />

          <Description dangerouslySetInnerHTML={{ __html: book.description }} />
        </Info>
      </Layout>
    </Wrapper>
    </>
  );
}
