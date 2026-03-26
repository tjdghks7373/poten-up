import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  const { order }: { order: { id: string; sort_order: number }[] } = await request.json();

  const updates = order.map(({ id, sort_order }) =>
    supabaseAdmin.from("books").update({ sort_order }).eq("id", id)
  );

  await Promise.all(updates);
  return NextResponse.json({ ok: true });
}
