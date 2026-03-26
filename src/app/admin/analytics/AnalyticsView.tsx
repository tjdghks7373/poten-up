"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import styled from "styled-components";
import { theme } from "@/lib/theme";

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
`;

const Card = styled.div`
  background: ${theme.colors.white};
  border: 1px solid ${theme.colors.border};
  border-radius: 0.75rem;
  padding: 1.25rem;
  cursor: pointer;
  transition: box-shadow 0.15s;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  & svg {
    cursor: pointer;
  }
`;

const CardTitle = styled.h2`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${theme.colors.muted};
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const SummaryCard = styled.div`
  background: ${theme.colors.white};
  border: 1px solid ${theme.colors.border};
  border-radius: 0.75rem;
  padding: 1.25rem;
`;

const StatNumber = styled.p`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${theme.colors.brand};
`;

const StatLabel = styled.p`
  font-size: 0.875rem;
  color: ${theme.colors.muted};
  margin-top: 0.25rem;
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const Modal = styled.div`
  background: ${theme.colors.white};
  border-radius: 1rem;
  padding: 2rem;
  width: 100%;
  max-width: 860px;
  max-height: 90vh;
  overflow: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${theme.colors.fg};
`;

const CloseBtn = styled.button`
  font-size: 1.25rem;
  color: ${theme.colors.muted};
  line-height: 1;

  &:hover {
    color: ${theme.colors.fg};
  }
`;

const COLORS = ["#4F46E5", "#10B981", "#F59E0B", "#EF4444"];
const TYPE_LABELS: Record<string, string> = {
  book: "도서",
  news: "뉴스",
  author: "저자",
  home: "홈",
};

interface TopItem {
  slug: string;
  title: string;
  count: number;
}

interface DailyCount {
  date: string;
  count: number;
}

interface TypeCount {
  type: string;
  count: number;
}

interface Props {
  summary: TypeCount[];
  topBooks: TopItem[];
  topNews: TopItem[];
  daily: DailyCount[];
}

type ChartKey = "daily" | "pie" | "books" | "news";

const CHART_TITLES: Record<ChartKey, string> = {
  daily: "일별 방문 추이 (최근 14일)",
  pie: "섹션별 클릭 비율",
  books: "도서 TOP 10",
  news: "뉴스 TOP 10",
};

export default function AnalyticsView({ summary, topBooks, topNews, daily }: Props) {
  const [expanded, setExpanded] = useState<ChartKey | null>(null);

  const total = summary.reduce((acc, s) => acc + s.count, 0);
  const pieData = summary.map((s) => ({
    name: TYPE_LABELS[s.type] ?? s.type,
    value: s.count,
  }));

  function renderChart(key: ChartKey, height: number) {
    if (key === "daily") {
      return (
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={daily}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.border} />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke={theme.colors.brand} strokeWidth={2} dot={false} name="방문 수" />
          </LineChart>
        </ResponsiveContainer>
      );
    }
    if (key === "pie") {
      return (
        <ResponsiveContainer width="100%" height={height}>
          <PieChart>
            <Pie
              data={pieData.map((d, i) => ({ ...d, fill: COLORS[i % COLORS.length] }))}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={height / 3}
              label={({ name, percent }: { name: string; percent?: number }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
            >
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      );
    }
    if (key === "books") {
      return (
        <ResponsiveContainer width="100%" height={height}>
          <BarChart data={topBooks} layout="vertical" margin={{ left: 0 }}>
            <XAxis type="number" tick={{ fontSize: 11 }} />
            <YAxis type="category" dataKey="title" tick={{ fontSize: 11 }} width={140} />
            <Tooltip />
            <Bar dataKey="count" fill={COLORS[0]} name="클릭 수" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      );
    }
    return (
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={topNews} layout="vertical" margin={{ left: 0 }}>
          <XAxis type="number" tick={{ fontSize: 11 }} />
          <YAxis type="category" dataKey="title" tick={{ fontSize: 11 }} width={140} />
          <Tooltip />
          <Bar dataKey="count" fill={COLORS[1]} name="클릭 수" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  return (
    <>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem", color: theme.colors.fg }}>
        통계
      </h1>

      <SummaryGrid>
        <SummaryCard>
          <StatNumber>{total.toLocaleString()}</StatNumber>
          <StatLabel>전체 클릭 수</StatLabel>
        </SummaryCard>
        {summary.map((s) => (
          <SummaryCard key={s.type}>
            <StatNumber>{s.count.toLocaleString()}</StatNumber>
            <StatLabel>{TYPE_LABELS[s.type] ?? s.type} 클릭</StatLabel>
          </SummaryCard>
        ))}
      </SummaryGrid>

      <Grid>
        <Card style={{ gridColumn: "1 / -1" }} onClick={() => setExpanded("daily")}>
          <CardTitle>{CHART_TITLES.daily}</CardTitle>
          {renderChart("daily", 220)}
        </Card>

        <Card onClick={() => setExpanded("pie")}>
          <CardTitle>{CHART_TITLES.pie}</CardTitle>
          {renderChart("pie", 220)}
        </Card>

        <Card onClick={() => setExpanded("books")}>
          <CardTitle>{CHART_TITLES.books}</CardTitle>
          {renderChart("books", 220)}
        </Card>

        <Card onClick={() => setExpanded("news")}>
          <CardTitle>{CHART_TITLES.news}</CardTitle>
          {renderChart("news", 220)}
        </Card>
      </Grid>

      {expanded && (
        <Overlay onClick={() => setExpanded(null)}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>{CHART_TITLES[expanded]}</ModalTitle>
              <CloseBtn onClick={() => setExpanded(null)}>✕</CloseBtn>
            </ModalHeader>
            {renderChart(expanded, 480)}
          </Modal>
        </Overlay>
      )}
    </>
  );
}
