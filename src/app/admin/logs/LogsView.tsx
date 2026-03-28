"use client";

import styled from "styled-components";
import { theme } from "@/lib/theme";

interface LogRow {
  id: string;
  action: string;
  entity: string;
  title: string;
  created_at: string;
}

const PageTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${theme.colors.brand};
  margin-bottom: 0.5rem;
`;

const Hint = styled.p`
  font-size: 0.8125rem;
  color: ${theme.colors.muted};
  margin-bottom: 2rem;
`;

const Section = styled.div`
  background: ${theme.colors.white};
  border: 1px solid ${theme.colors.border};
  border-radius: 0.75rem;
  padding: 1.5rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
`;

const Th = styled.th`
  text-align: left;
  padding: 0.625rem 0.75rem;
  border-bottom: 1px solid ${theme.colors.border};
  color: ${theme.colors.muted};
  font-weight: 500;
`;

const Td = styled.td`
  padding: 0.75rem;
  border-bottom: 1px solid ${theme.colors.border};
  color: ${theme.colors.fg};
`;

const ActionBadge = styled.span<{ $action: string }>`
  display: inline-block;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${({ $action }) =>
    $action === "추가" ? "#dcfce7" :
    $action === "수정" ? "#dbeafe" :
    $action === "삭제" ? "#fee2e2" : theme.colors.border};
  color: ${({ $action }) =>
    $action === "추가" ? "#16a34a" :
    $action === "수정" ? "#2563eb" :
    $action === "삭제" ? "#dc2626" : theme.colors.muted};
`;

const EntityBadge = styled.span`
  display: inline-block;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  background: ${theme.colors.brand}18;
  color: ${theme.colors.brand};
  font-weight: 500;
`;

const Empty = styled.p`
  color: ${theme.colors.muted};
  font-size: 0.875rem;
  padding: 1rem 0;
`;

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("ko", {
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  });
}

export default function LogsView({ logs }: { logs: LogRow[] }) {
  return (
    <>
      <PageTitle>활동 로그</PageTitle>

      <Section>
        {logs.length === 0 ? (
          <Empty>기록된 활동이 없습니다.</Empty>
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>일시</Th>
                <Th>액션</Th>
                <Th>분류</Th>
                <Th>대상</Th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <Td style={{ color: theme.colors.muted, whiteSpace: "nowrap" }}>
                    {formatDate(log.created_at)}
                  </Td>
                  <Td><ActionBadge $action={log.action}>{log.action}</ActionBadge></Td>
                  <Td><EntityBadge>{log.entity}</EntityBadge></Td>
                  <Td>{log.title}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Section>
    </>
  );
}
