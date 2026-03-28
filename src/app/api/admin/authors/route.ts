import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { writeLog } from "@/lib/log";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("authors")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const { data, error } = await supabaseAdmin
    .from("authors")
    .insert({
      name: body.name,
      photo: body.photo ?? "",
      bio: body.bio ?? "",
      books: body.books ?? [],
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  await writeLog("추가", "작가", body.name);
  return NextResponse.json(data);
}
