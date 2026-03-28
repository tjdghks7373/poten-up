"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styled, { keyframes } from "styled-components";
import { theme } from "@/lib/theme";

const slideDown = keyframes`
  from { transform: translateY(-100%); opacity: 0; }
  to   { transform: translateY(0);    opacity: 1; }
`;

const Banner = styled.div`
  position: fixed;
  top: 4rem;
  left: 0;
  right: 0;
  z-index: 40;
  background: ${theme.colors.brand};
  color: ${theme.colors.white};
  animation: ${slideDown} 0.4s ease;
`;

const Inner = styled.div`
  max-width: ${theme.maxWidth};
  margin: 0 auto;
  padding: 0 1.5rem;
  height: 2.75rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const Badge = styled.span`
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  background: ${theme.colors.accent};
  color: ${theme.colors.white};
  border-radius: 9999px;
  padding: 0.125rem 0.5rem;
  flex-shrink: 0;
`;

const Text = styled.span`
  font-size: 0.875rem;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const BookLink = styled(Link)`
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 2px;

  &:hover {
    opacity: 0.85;
  }
`;

const CloseBtn = styled.button`
  flex-shrink: 0;
  color: rgba(255,255,255,0.7);
  font-size: 1rem;
  line-height: 1;
  transition: color 0.15s;

  &:hover {
    color: ${theme.colors.white};
  }
`;

interface Props {
  title: string;
  slug: string;
  author: string;
}

const STORAGE_KEY = "banner_dismissed";

export default function NewBookBanner({ title, slug, author }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem(STORAGE_KEY);
    if (dismissed !== slug) setVisible(true);
  }, [slug]);

  function dismiss() {
    sessionStorage.setItem(STORAGE_KEY, slug);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <Banner>
      <Inner>
        <Badge>NEW</Badge>
        <Text>
          신간 출시 —{" "}
          <BookLink href={`/books/${slug}`} onClick={dismiss}>
            {title}
          </BookLink>
          {author && ` · ${author}`}
        </Text>
        <CloseBtn onClick={dismiss} aria-label="닫기">✕</CloseBtn>
      </Inner>
    </Banner>
  );
}
