"use client";

import Link from "next/link";
import styled from "styled-components";
import { theme } from "@/lib/theme";

const FooterEl = styled.footer`
  background: ${theme.colors.brand};
  color: rgba(255, 255, 255, 0.7);
  margin-top: 6rem;
`;

const Inner = styled.div`
  max-width: ${theme.maxWidth};
  margin: 0 auto;
  padding: 3rem 1.5rem;
`;

const Top = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
  }
`;

const Brand = styled.p`
  color: ${theme.colors.white};
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const Tagline = styled.p`
  font-size: 0.875rem;
`;

const Links = styled.div`
  display: flex;
  gap: 3rem;
  font-size: 0.875rem;
`;

const LinkGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const GroupTitle = styled.p`
  color: ${theme.colors.white};
  font-weight: 500;
  margin-bottom: 0.25rem;
`;

const FooterLink = styled(Link)`
  transition: color 0.2s;

  &:hover {
    color: ${theme.colors.white};
  }
`;

const Bottom = styled.div`
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  margin-top: 2rem;
  padding-top: 1.5rem;
  font-size: 0.75rem;
  text-align: center;
`;

export default function Footer() {
  return (
    <FooterEl>
      <Inner>
        <Top>
          <div>
            <Brand>포텐업</Brand>
            <Tagline>좋은 글이 세상을 바꿉니다.</Tagline>
          </div>
        </Top>
        <Bottom>
          © {new Date().getFullYear()} 포텐업 출판사. All rights reserved.
        </Bottom>
      </Inner>
    </FooterEl>
  );
}
