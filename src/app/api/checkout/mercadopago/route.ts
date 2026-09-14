import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Mercado Pago no está disponible. Usá transferencia o WhatsApp." },
    { status: 410 }
  );
}

export async function GET() {
  return NextResponse.json({ enabled: false });
}
