import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import {
  getEmailProvider,
  getOrderNotifyEmails,
  isEmailConfigured,
  sendMail,
  parseFromForStatus,
} from "@/lib/email";
import { SITE } from "@/lib/config";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const provider = getEmailProvider();
  const fromRaw =
    process.env.EMAIL_FROM?.trim() ||
    process.env.SMTP_USER?.trim() ||
    SITE.contactEmail;
  const from = parseFromForStatus(fromRaw);
  const notifyEmails = getOrderNotifyEmails();

  let hint = "";
  if (!provider) {
    hint =
      "Falta BREVO_API_KEY (o RESEND_API_KEY) en Render → Environment. Sin eso no sale ningún correo.";
  } else if (provider === "brevo") {
    hint =
      "Si Brevo rechaza el envío, verificá el remitente en Brevo → Senders (aureajoyasadn@gmail.com).";
  } else {
    hint =
      "Resend no permite enviar desde @gmail.com. Preferí Brevo con el Gmail verificado, o un dominio propio.";
  }

  return NextResponse.json({
    configured: isEmailConfigured(),
    provider,
    from,
    notifyEmails,
    hint,
  });
}

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  if (!isEmailConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Falta BREVO_API_KEY o RESEND_API_KEY en Render. Agregala y redeployá.",
      },
      { status: 400 }
    );
  }

  const body = await request.json().catch(() => ({}));
  const toList = getOrderNotifyEmails();
  const extra = String(body.to || "").trim().toLowerCase();
  const recipients = extra
    ? [...new Set([...toList, extra])]
    : toList;

  if (!recipients.length) {
    return NextResponse.json(
      { ok: false, error: "No hay destinatarios de aviso configurados" },
      { status: 400 }
    );
  }

  const result = await sendMail(
    recipients,
    `Prueba de correo — ${SITE.emailBrand}`,
    `<p>Este es un correo de prueba desde el admin de ${SITE.emailBrand}.</p>
     <p>Si lo recibís, las notificaciones de pedidos deberían funcionar.</p>`
  );

  if (!result.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: result.error,
        skipped: result.skipped,
        provider: result.provider || getEmailProvider(),
        recipients,
      },
      { status: 502 }
    );
  }

  return NextResponse.json({
    ok: true,
    provider: result.provider,
    recipients,
  });
}
