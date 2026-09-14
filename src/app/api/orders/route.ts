import { NextRequest, NextResponse } from "next/server";
import { createOrder } from "@/lib/orders";
import { CheckoutError, quoteCart } from "@/lib/checkout";
import {
  isValidEmail,
  normalizeEmail,
  sendOrderReceivedEmail,
  sendNewOrderNotifyEmail,
} from "@/lib/email";

const PUBLIC_CHANNELS = ["whatsapp", "transfer"] as const;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const channel = String(body.channel || "");
    const email = normalizeEmail(String(body.email || ""));
    const customerName = String(body.customerName || "").trim();
    const customerPhone = String(body.customerPhone || "").trim();
    const note = String(body.note || "").trim().slice(0, 500);

    if (!PUBLIC_CHANNELS.includes(channel as (typeof PUBLIC_CHANNELS)[number])) {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }

    if (!customerName || customerName.length < 3) {
      return NextResponse.json(
        { error: "Ingresá tu nombre y apellido" },
        { status: 400 }
      );
    }

    if (!customerPhone) {
      return NextResponse.json(
        { error: "Ingresá tu teléfono con la característica" },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Ingresá un correo válido para recibir el pedido" },
        { status: 400 }
      );
    }

    const quoted = await quoteCart({
      items: body.items || [],
      couponCode: body.couponCode ? String(body.couponCode) : null,
    });

    const order = await createOrder({
      channel: channel as "whatsapp" | "transfer",
      items: quoted.items,
      customerName,
      customerPhone,
      customerEmail: email,
      customerNote: note,
      status: "pending",
      couponCode: quoted.couponCode,
      discountPercent: quoted.discountPercent,
    });

    const mailPayload = {
      code: order.code,
      createdAt: order.createdAt,
      total: order.total,
      customerNote: note,
      couponCode: quoted.couponCode,
      discountAmount: quoted.discountAmount,
      items: quoted.items,
      customerName,
      customerPhone,
      customerEmail: email,
      channel,
    };

    const [mail, notify] = await Promise.all([
      sendOrderReceivedEmail(email, mailPayload),
      sendNewOrderNotifyEmail(mailPayload),
    ]);

    if (!notify.ok && !notify.skipped) {
      console.error("Order notify email failed:", notify.error);
    }

    return NextResponse.json({
      id: order.id,
      code: order.code,
      total: order.total,
      email,
      customerName,
      customerPhone,
      emailSent: mail.ok,
      emailSkipped: mail.skipped,
      emailError: mail.ok ? null : mail.error,
      notifySent: notify.ok,
    });
  } catch (error) {
    if (error instanceof CheckoutError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("Create order error:", error);
    return NextResponse.json(
      { error: "No se pudo registrar el pedido" },
      { status: 500 }
    );
  }
}
