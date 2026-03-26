import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const { type, slug, title } = await req.json();
  await supabaseAdmin.from("page_views").insert({ type, slug, title });
  return NextResponse.json({ ok: true });
}
