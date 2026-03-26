import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { toSlug } from "@/lib/db";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("books")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const slug = toSlug(body.title);

  const { data, error } = await supabaseAdmin
    .from("books")
    .insert({
      slug,
      title: body.title,
      author: body.author,
      cover: body.cover ?? "",
      description: body.description ?? "",
      published_at: body.publishedAt ?? "",
      genre: body.genre ?? "",
      featured: body.featured ?? false,
      is_new: body.isNew ?? false,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
