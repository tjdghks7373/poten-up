import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";

const attempts = new Map<string, { count: number; lockedUntil: number }>();

const MAX_ATTEMPTS = 5;
const LOCK_DURATION = 15 * 60 * 1000;

function makeToken() {
  return createHmac("sha256", process.env.COOKIE_SECRET!)
    .update(process.env.ADMIN_PASSWORD!)
    .digest("hex");
}

function getIp(request: NextRequest) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown"
  );
}

export async function POST(request: NextRequest) {
  const ip = getIp(request);
  const now = Date.now();
  const record = attempts.get(ip);

  if (record && record.lockedUntil > now) {
    const remaining = Math.ceil((record.lockedUntil - now) / 60000);
    return NextResponse.json(
      { error: `너무 많은 시도. ${remaining}분 후 다시 시도하세요.` },
      { status: 429 }
    );
  }

  const { password } = await request.json();

  if (password !== process.env.ADMIN_PASSWORD) {
    const count = (record?.count ?? 0) + 1;
    attempts.set(ip, {
      count,
      lockedUntil: count >= MAX_ATTEMPTS ? now + LOCK_DURATION : 0,
    });

    const left = MAX_ATTEMPTS - count;
    return NextResponse.json(
      { error: left > 0 ? `비밀번호가 틀렸습니다. (${left}회 남음)` : "계정이 잠겼습니다. 15분 후 다시 시도하세요." },
      { status: 401 }
    );
  }

  attempts.delete(ip);

  const response = NextResponse.json({ ok: true });
  response.cookies.set("admin_token", makeToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete("admin_token");
  return response;
}
