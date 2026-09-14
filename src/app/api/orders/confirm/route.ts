import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Mercado Pago no está disponible" },
    { status: 410 }
  );
}
