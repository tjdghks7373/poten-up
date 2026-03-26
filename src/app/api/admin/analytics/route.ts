import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  let query = supabaseAdmin.from("page_views").select("type, slug, title, created_at");
  if (from) query = query.gte("created_at", from);
  if (to) query = query.lte("created_at", to + "T23:59:59.999Z");

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const rows = data ?? [];

  const summaryMap: Record<string, number> = {};
  for (const r of rows) {
    summaryMap[r.type] = (summaryMap[r.type] ?? 0) + 1;
  }
  const summary = Object.entries(summaryMap).map(([type, count]) => ({ type, count }));

  function buildTop(type: string) {
    const map: Record<string, { title: string; count: number }> = {};
    for (const r of rows.filter((r) => r.type === type)) {
      if (!map[r.slug]) map[r.slug] = { title: r.title, count: 0 };
      map[r.slug].count += 1;
    }
    return Object.entries(map)
      .map(([slug, v]) => ({ slug, title: v.title, count: v.count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }

  // daily: from~to 범위 or 최근 14일
  const dailyFrom = from ? new Date(from) : (() => { const d = new Date(); d.setDate(d.getDate() - 13); return d; })();
  const dailyTo = to ? new Date(to) : new Date();
  const dailyMap: Record<string, number> = {};
  for (let d = new Date(dailyFrom); d <= dailyTo; d.setDate(d.getDate() + 1)) {
    dailyMap[d.toISOString().slice(0, 10)] = 0;
  }
  for (const r of rows) {
    const day = r.created_at.slice(0, 10);
    if (day in dailyMap) dailyMap[day] = (dailyMap[day] ?? 0) + 1;
  }
  const daily = Object.entries(dailyMap).map(([date, count]) => ({ date: date.slice(5), count }));

  return NextResponse.json({
    summary,
    topBooks: buildTop("book"),
    topNews: buildTop("news"),
    topKakao: buildTop("kakao_share"),
    topLink: buildTop("link_copy"),
    daily,
  });
}
