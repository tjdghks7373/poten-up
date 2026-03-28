import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { writeLog } from "@/lib/log";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const { data, error } = await supabaseAdmin
    .from("authors")
    .update({
      name: body.name,
      photo: body.photo ?? "",
      bio: body.bio ?? "",
      books: body.books ?? [],
    })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  await writeLog("수정", "작가", body.name);
  return NextResponse.json(data);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { data: author } = await supabaseAdmin.from("authors").select("name").eq("id", id).single();
  const { error } = await supabaseAdmin.from("authors").delete().eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  await writeLog("삭제", "작가", author?.name ?? id);
  return NextResponse.json({ ok: true });
}
