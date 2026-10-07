import { NextRequest, NextResponse } from "next/server";
import {
  isValidEmail,
  normalizeEmail,
  sendContactInquiryEmail,
} from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (String(body.website || "").trim()) {
      return NextResponse.json({ ok: true });
    }

    const name = String(body.name || "").trim();
    const email = normalizeEmail(String(body.email || ""));
    const phone = String(body.phone || "").trim().slice(0, 40);
    const message = String(body.message || "").trim();

    if (name.length < 2 || name.length > 80) {
      return NextResponse.json(
        { error: "Ingresá tu nombre" },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Ingresá un correo válido" },
        { status: 400 }
      );
    }

    if (message.length < 10 || message.length > 2000) {
      return NextResponse.json(
        { error: "Escribí tu consulta (al menos unas palabras)" },
        { status: 400 }
      );
    }

    const result = await sendContactInquiryEmail({
      name,
      email,
      phone,
      message,
    });

    if (!result.ok) {
      return NextResponse.json(
        {
          error:
            "No pudimos enviar el mensaje ahora. Escribinos por WhatsApp o Instagram.",
        },
        { status: 503 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "No se pudo enviar el mensaje" },
      { status: 400 }
    );
  }
}
