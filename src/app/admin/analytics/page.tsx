import { supabaseAdmin } from "@/lib/supabase";
import AnalyticsView from "./AnalyticsView";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const { data: all } = await supabaseAdmin
    .from("page_views")
    .select("type, slug, title, created_at");

  const rows = all ?? [];

  const summaryMap: Record<string, number> = {};
  for (const r of rows) {
    summaryMap[r.type] = (summaryMap[r.type] ?? 0) + 1;
  }
  const summary = Object.entries(summaryMap).map(([type, count]) => ({ type, count }));

  const bookMap: Record<string, { title: string; count: number }> = {};
  for (const r of rows.filter((r) => r.type === "book")) {
    if (!bookMap[r.slug]) bookMap[r.slug] = { title: r.title, count: 0 };
    bookMap[r.slug].count += 1;
  }
  const topBooks = Object.entries(bookMap)
    .map(([slug, v]) => ({ slug, title: v.title, count: v.count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const newsMap: Record<string, { title: string; count: number }> = {};
  for (const r of rows.filter((r) => r.type === "news")) {
    if (!newsMap[r.slug]) newsMap[r.slug] = { title: r.title, count: 0 };
    newsMap[r.slug].count += 1;
  }
  const topNews = Object.entries(newsMap)
    .map(([slug, v]) => ({ slug, title: v.title, count: v.count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const now = new Date();
  const dailyMap: Record<string, number> = {};
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    dailyMap[d.toISOString().slice(0, 10)] = 0;
  }
  for (const r of rows) {
    const day = r.created_at.slice(0, 10);
    if (day in dailyMap) dailyMap[day] = (dailyMap[day] ?? 0) + 1;
  }
  const daily = Object.entries(dailyMap).map(([date, count]) => ({
    date: date.slice(5),
    count,
  }));

  return <AnalyticsView summary={summary} topBooks={topBooks} topNews={topNews} daily={daily} />;
}
