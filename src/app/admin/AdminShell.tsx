"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import styled from "styled-components";
import { theme } from "@/lib/theme";

const navItems = [
  { href: "/admin/books", label: "도서" },
  { href: "/admin/news", label: "뉴스/공지" },
  { href: "/admin/authors", label: "작가" },
  { href: "/admin/analytics", label: "통계" },
];

const Shell = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${theme.colors.bg};
`;

const Sidebar = styled.aside`
  width: 220px;
  background: ${theme.colors.brand};
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
`;

const SidebarTop = styled.div`
  padding:6rem 1.5rem 1.5rem;
  border-bottom: 1px solid rgba(255,255,255,0.1);
`;

const SiteName = styled.p`
  color: ${theme.colors.white};
  font-weight: 700;
  font-size: 1.125rem;
`;

const AdminLabel = styled.p`
  color: rgba(255,255,255,0.5);
  font-size: 0.75rem;
  margin-top: 0.25rem;
`;

const Nav = styled.nav`
  flex: 1;
  padding: 1rem 0;
`;

const NavLink = styled(Link)<{ $active: boolean }>`
  display: block;
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
  color: ${({ $active }) => $active ? theme.colors.white : "rgba(255,255,255,0.6)"};
  background: ${({ $active }) => $active ? "rgba(255,255,255,0.1)" : "transparent"};
  border-left: 3px solid ${({ $active }) => $active ? theme.colors.accent : "transparent"};
  transition: all 0.15s;

  &:hover {
    color: ${theme.colors.white};
    background: rgba(255,255,255,0.08);
  }
`;

const LogoutBtn = styled.button`
  margin: 1rem;
  padding: 0.625rem;
  background: rgba(255,255,255,0.1);
  color: rgba(255,255,255,0.7);
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-family: inherit;
  transition: all 0.15s;

  &:hover {
    background: rgba(255,255,255,0.15);
    color: ${theme.colors.white};
  }
`;

const Content = styled.main`
  margin-left: 220px;
  flex: 1;
  padding: 2rem;
  max-width: 900px;
`;

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
  }

  if (pathname === "/admin/login") return <>{children}</>;

  return (
    <Shell>
      <Sidebar>
        <SidebarTop>
          <SiteName>포텐업</SiteName>
          <AdminLabel>관리자 패널</AdminLabel>
        </SidebarTop>
        <Nav>
          {navItems.map((item) => (
            <NavLink key={item.href} href={item.href} $active={pathname.startsWith(item.href)}>
              {item.label}
            </NavLink>
          ))}
        </Nav>
        <LogoutBtn onClick={handleLogout}>로그아웃</LogoutBtn>
      </Sidebar>
      <Content>{children}</Content>
    </Shell>
  );
}
