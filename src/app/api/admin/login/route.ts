import { NextRequest, NextResponse } from "next/server";
import {
  verifyAdminPassword,
  createAdminSession,
  createPendingTotpSession,
  consumeLoginAttempt,
} from "@/lib/auth";
import { isTotpEnabled } from "@/lib/totp";

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  const gate = consumeLoginAttempt(ip);
  if (!gate.ok) {
    return NextResponse.json(
      { error: "Demasiados intentos. Esperá unos minutos." },
      { status: 429 }
    );
  }

  const { password } = await request.json();

  if (!password || !(await verifyAdminPassword(password))) {
    return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 });
  }

  if (isTotpEnabled()) {
    await createPendingTotpSession();
    return NextResponse.json({ ok: true, requiresTotp: true });
  }

  await createAdminSession();
  return NextResponse.json({ ok: true });
}
