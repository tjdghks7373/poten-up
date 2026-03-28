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
    .from("books")
    .update({
      slug: toSlug(body.title),
      title: body.title,
      author: body.author,
      cover: body.cover ?? "",
      description: body.description ?? "",
      published_at: body.publishedAt ?? "",
      genre: body.genre ?? "",
      featured: body.featured ?? false,
      is_new: body.isNew ?? false,
      shop_url: body.shopUrl ?? "",
    })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  await writeLog("수정", "도서", body.title);
  return NextResponse.json(data);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { data: book } = await supabaseAdmin.from("books").select("title").eq("id", id).single();
  const { error } = await supabaseAdmin.from("books").delete().eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  await writeLog("삭제", "도서", book?.title ?? id);
  return NextResponse.json({ ok: true });
}
