import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { toSlug } from "@/lib/db";
import { writeLog } from "@/lib/log";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("news")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const { data, error } = await supabaseAdmin
    .from("news")
    .insert({
      slug: toSlug(body.title),
      title: body.title,
      content: body.content ?? "",
      date: body.date ?? "",
      category: body.category ?? "",
      thumbnail: body.thumbnail ?? "",
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  await writeLog("추가", "뉴스", body.title);
  return NextResponse.json(data);
}
