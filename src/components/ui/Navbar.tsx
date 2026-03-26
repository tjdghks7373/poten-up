"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
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
  gap: 2rem;
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

const NavLink = styled(Link)<{ $active?: boolean }>`
  font-size: 0.9rem;
  font-weight: ${({ $active }) => $active ? "700" : "500"};
  color: ${({ $active }) => $active ? theme.colors.brand : theme.colors.fg};
  position: relative;
  transition: color 0.2s;
  padding-bottom: 2px;

  &::after {
    content: "";
    position: absolute;
    bottom: -2px;
    left: 0;
    right: 0;
    height: 2px;
    background: ${theme.colors.brand};
    border-radius: 1px;
    opacity: ${({ $active }) => $active ? "1" : "0"};
    transition: opacity 0.2s;
  }

  &:hover {
    color: ${theme.colors.brand};
    &::after { opacity: 1; }
  }
`;

const RightRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-left: auto;
`;

const ThemeToggle = styled.button`
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  color: ${theme.colors.muted};
  transition: color 0.2s, background 0.2s;
  font-size: 1rem;

  &:hover {
    color: ${theme.colors.fg};
    background: ${theme.colors.border};
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

const MobileLink = styled(Link)<{ $active?: boolean }>`
  display: block;
  padding: 0.75rem 0;
  font-size: 0.9rem;
  font-weight: ${({ $active }) => $active ? "700" : "500"};
  color: ${({ $active }) => $active ? theme.colors.brand : theme.colors.fg};
  border-bottom: 1px solid ${theme.colors.border};
  transition: color 0.2s;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    color: ${theme.colors.brand};
  }
`;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setDark(document.documentElement.getAttribute("data-theme") === "dark");
  }, []);

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    if (next) {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("theme", "light");
    }
  }

  return (
    <Header>
      <Inner>
        <Logo href="/">포텐업</Logo>

        <Nav>
          {links.map((l) => (
            <NavLink key={l.href} href={l.href} $active={pathname.startsWith(l.href)}>
              {l.label}
            </NavLink>
          ))}
        </Nav>

        <RightRow>
          <ThemeToggle onClick={toggleTheme} aria-label="다크모드 토글">
            {dark ? "☀️" : "🌙"}
          </ThemeToggle>
          <MenuButton onClick={() => setOpen(!open)} aria-label="메뉴">
            <Bar />
            <Bar />
            <Bar />
          </MenuButton>
        </RightRow>
      </Inner>

      {open && (
        <MobileMenu>
          {links.map((l) => (
            <MobileLink key={l.href} href={l.href} $active={pathname.startsWith(l.href)} onClick={() => setOpen(false)}>
              {l.label}
            </MobileLink>
          ))}
        </MobileMenu>
      )}
    </Header>
  );
}
