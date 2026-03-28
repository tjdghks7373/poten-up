import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  const type = req.nextUrl.searchParams.get("type") ?? "books";

  if (!q) return NextResponse.json([]);

  if (type === "books") {
    const { data, error } = await supabase
      .from("books")
      .select("id, slug, title, author, cover, description, published_at, genre, featured, is_new, shop_url, sort_order")
      .textSearch("search_vector", q, { type: "websearch", config: "simple" })
      .order("sort_order", { ascending: true });

    if (error) return NextResponse.json([], { status: 500 });

    return NextResponse.json(
      (data ?? []).map((row) => ({
        id: row.id,
        slug: row.slug,
        title: row.title,
        author: row.author,
        cover: row.cover ?? "",
        description: row.description ?? "",
        publishedAt: row.published_at ?? "",
        genre: row.genre ?? "",
        featured: row.featured ?? false,
        isNew: row.is_new ?? false,
        shopUrl: row.shop_url ?? "",
      }))
    );
  }

  if (type === "news") {
    const { data, error } = await supabase
      .from("news")
      .select("id, slug, title, content, date, category, thumbnail")
      .textSearch("search_vector", q, { type: "websearch", config: "simple" })
      .order("date", { ascending: false });

    if (error) return NextResponse.json([], { status: 500 });

    return NextResponse.json(
      (data ?? []).map((row) => ({
        id: row.id,
        slug: row.slug,
        title: row.title,
        content: row.content ?? "",
        date: row.date ?? "",
        category: row.category ?? "",
        thumbnail: row.thumbnail ?? "",
      }))
    );
  }

  return NextResponse.json([]);
}
