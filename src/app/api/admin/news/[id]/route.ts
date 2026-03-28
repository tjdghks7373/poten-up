import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { toSlug } from "@/lib/db";
import { writeLog } from "@/lib/log";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const { data, error } = await supabaseAdmin
    .from("news")
    .update({
      slug: toSlug(body.title),
      title: body.title,
      content: body.content ?? "",
      date: body.date ?? "",
      category: body.category ?? "",
      thumbnail: body.thumbnail ?? "",
    })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  await writeLog("수정", "뉴스", body.title);
  return NextResponse.json(data);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { data: item } = await supabaseAdmin.from("news").select("title").eq("id", id).single();
  const { error } = await supabaseAdmin.from("news").delete().eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  await writeLog("삭제", "뉴스", item?.title ?? id);
  return NextResponse.json({ ok: true });
}
