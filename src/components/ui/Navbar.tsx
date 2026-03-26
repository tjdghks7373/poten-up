"use client";

import Link from "next/link";
import { useState } from "react";
import styled from "styled-components";
import { theme } from "@/lib/theme";

const links = [
  { href: "/books", label: "도서 목록" },
  { href: "/news", label: "뉴스/공지" },
  { href: "/authors", label: "작가 소개" },
];

const Header = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  background: ${theme.colors.bg}e6;
  backdrop-filter: blur(12px);
  border-bottom: 1px solid ${theme.colors.border};
  transform: translateZ(0);
  will-change: transform;
`;

const Inner = styled.div`
  max-width: ${theme.maxWidth};
  margin: 0 auto;
  padding: 0 1.5rem;
  height: 4rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled(Link)`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${theme.colors.brand};
  letter-spacing: -0.025em;
`;

const Nav = styled.nav`
  display: none;
  align-items: center;
  gap: 2rem;

  @media (min-width: 768px) {
    display: flex;
  }
`;

const NavLink = styled(Link)`
  font-size: 0.875rem;
  color: ${theme.colors.muted};
  transition: color 0.2s;

  &:hover {
    color: ${theme.colors.fg};
  }
`;

const MenuButton = styled.button`
  padding: 0.5rem;
  color: ${theme.colors.fg};

  @media (min-width: 768px) {
    display: none;
  }
`;

const Bar = styled.span`
  display: block;
  width: 1.25rem;
  height: 2px;
  background: currentColor;
  margin-bottom: 4px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const MobileMenu = styled.div`
  background: ${theme.colors.bg};
  border-top: 1px solid ${theme.colors.border};
  padding: 0 1rem 1rem;

  @media (min-width: 768px) {
    display: none;
  }
`;

const MobileLink = styled(Link)`
  display: block;
  padding: 0.75rem 0;
  font-size: 0.875rem;
  color: ${theme.colors.muted};
  border-bottom: 1px solid ${theme.colors.border};
  transition: color 0.2s;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    color: ${theme.colors.fg};
  }
`;

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <Header>
      <Inner>
        <Logo href="/">포텐업</Logo>

        <Nav>
          {links.map((l) => (
            <NavLink key={l.href} href={l.href}>
              {l.label}
            </NavLink>
          ))}
        </Nav>

        <MenuButton onClick={() => setOpen(!open)} aria-label="메뉴">
          <Bar />
          <Bar />
          <Bar />
        </MenuButton>
      </Inner>

      {open && (
        <MobileMenu>
          {links.map((l) => (
            <MobileLink key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </MobileLink>
          ))}
        </MobileMenu>
      )}
    </Header>
  );
}
