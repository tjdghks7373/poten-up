"use client";

import { useState, useEffect, useCallback } from "react";
import {
  BarChart,
  Bar,
  Cell,
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

const FilterBar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

const PresetBtn = styled.button<{ $active?: boolean }>`
  padding: 0.375rem 0.875rem;
  border-radius: 0.5rem;
  font-size: 0.8125rem;
  font-weight: 500;
  font-family: inherit;
  background: ${({ $active }) => $active ? theme.colors.brand : theme.colors.white};
  color: ${({ $active }) => $active ? theme.colors.white : theme.colors.fg};
  border: 1px solid ${({ $active }) => $active ? theme.colors.brand : theme.colors.border};
  transition: all 0.15s;

  &:hover {
    opacity: 0.85;
  }
`;

const DateInput = styled.input`
  padding: 0.375rem 0.625rem;
  border: 1px solid ${theme.colors.border};
  border-radius: 0.5rem;
  font-size: 0.8125rem;
  font-family: inherit;
  color: ${theme.colors.fg};
  background: ${theme.colors.bg};
  outline: none;

  &:focus {
    border-color: ${theme.colors.brand};
  }
`;

const Separator = styled.span`
  color: ${theme.colors.muted};
  font-size: 0.8125rem;
`;

const COLORS = ["#6B8CBA", "#7BB5A0", "#C4A882", "#A98BBB", "#7BACC4", "#B5896E", "#8BABB5", "#B5A67B", "#9BB57B", "#B57B8B"];
const TYPE_LABELS: Record<string, string> = {
  book: "도서",
  news: "뉴스",
  author: "저자",
  home: "홈",
  kakao_share: "카카오 공유",
  link_copy: "링크 복사",
};

type Preset = "today" | "7d" | "30d" | "all" | "custom";

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

interface AnalyticsData {
  summary: TypeCount[];
  topBooks: TopItem[];
  topNews: TopItem[];
  daily: DailyCount[];
  topKakao: TopItem[];
  topLink: TopItem[];
}

type ChartKey = "daily" | "pie" | "books" | "news" | "kakao" | "link";

const CHART_TITLES: Record<ChartKey, string> = {
  daily: "일별 방문 추이",
  pie: "섹션별 클릭 비율",
  books: "도서 TOP 10",
  news: "뉴스 TOP 10",
  kakao: "카카오 공유 TOP 10",
  link: "링크 복사 TOP 10",
};

function getPresetDates(preset: Preset): { from: string; to: string } | null {
  if (preset === "all") return null;
  const today = new Date();
  const to = today.toISOString().slice(0, 10);
  if (preset === "today") return { from: to, to };
  const from = new Date(today);
  if (preset === "7d") from.setDate(from.getDate() - 6);
  if (preset === "30d") from.setDate(from.getDate() - 29);
  return { from: from.toISOString().slice(0, 10), to };
}

export default function AnalyticsView() {
  const [preset, setPreset] = useState<Preset>("30d");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState<ChartKey | null>(null);

  const fetchData = useCallback(async (p: Preset, cf: string, ct: string) => {
    setLoading(true);
    const params = new URLSearchParams();
    if (p === "custom") {
      if (cf) params.set("from", cf);
      if (ct) params.set("to", ct);
    } else {
      const dates = getPresetDates(p);
      if (dates) {
        params.set("from", dates.from);
        params.set("to", dates.to);
      }
    }
    const res = await fetch(`/api/admin/analytics?${params}`);
    const json = await res.json();
    setData(json);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData(preset, customFrom, customTo);
  }, [preset, fetchData]);

  function applyCustom() {
    fetchData("custom", customFrom, customTo);
  }

  const summary = data?.summary ?? [];
  const topBooks = data?.topBooks ?? [];
  const topNews = data?.topNews ?? [];
  const daily = data?.daily ?? [];
  const topKakao = data?.topKakao ?? [];
  const topLink = data?.topLink ?? [];

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
              label={(props: { name?: string; percent?: number }) => `${props.name ?? ""} ${(((props.percent as number) ?? 0) * 100).toFixed(0)}%`}
            >
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      );
    }
    const barData = key === "books" ? topBooks : key === "news" ? topNews : key === "kakao" ? topKakao : topLink;
    const barName = key === "kakao" ? "공유 수" : key === "link" ? "복사 수" : "클릭 수";
    return (
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={barData} layout="vertical" margin={{ left: 0 }}>
          <XAxis type="number" tick={{ fontSize: 11 }} />
          <YAxis type="category" dataKey="title" tick={{ fontSize: 11 }} width={140} />
          <Tooltip />
          <Bar dataKey="count" name={barName} radius={[0, 4, 4, 0]}>
            {barData.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  }

  return (
    <>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.25rem", color: theme.colors.fg }}>
        통계
      </h1>

      <FilterBar>
        {(["today", "7d", "30d", "all"] as Preset[]).map((p) => (
          <PresetBtn key={p} $active={preset === p && preset !== "custom"} onClick={() => setPreset(p)}>
            {p === "today" ? "오늘" : p === "7d" ? "7일" : p === "30d" ? "30일" : "전체"}
          </PresetBtn>
        ))}
        <Separator>|</Separator>
        <DateInput
          type="date"
          value={customFrom}
          onChange={(e) => setCustomFrom(e.target.value)}
        />
        <Separator>~</Separator>
        <DateInput
          type="date"
          value={customTo}
          onChange={(e) => setCustomTo(e.target.value)}
        />
        <PresetBtn
          $active={preset === "custom"}
          onClick={() => { setPreset("custom"); applyCustom(); }}
        >
          조회
        </PresetBtn>
      </FilterBar>

      {loading ? (
        <p style={{ color: theme.colors.muted, fontSize: "0.875rem" }}>불러오는 중...</p>
      ) : (
        <>
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

            <Card onClick={() => setExpanded("kakao")}>
              <CardTitle>{CHART_TITLES.kakao}</CardTitle>
              {renderChart("kakao", 220)}
            </Card>

            <Card onClick={() => setExpanded("link")}>
              <CardTitle>{CHART_TITLES.link}</CardTitle>
              {renderChart("link", 220)}
            </Card>

            <Card onClick={() => setExpanded("news")}>
              <CardTitle>{CHART_TITLES.news}</CardTitle>
              {renderChart("news", 220)}
            </Card>
          </Grid>
        </>
      )}

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
