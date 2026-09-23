import { SITE } from "./config";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  quantity: number;
};

export function formatPrice(amount: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: SITE.currency,
    minimumFractionDigits: 0,
  }).format(amount);
}

/** 290000 → "290.000" (formato admin, miles con punto). */
export function formatPriceInput(amount: number) {
  return new Intl.NumberFormat("es-AR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

/**
 * Lee un precio en formato argentino.
 * 290.000 → 290000, 1.250.000 → 1250000, 290,50 → 291 (se redondea al peso).
 */
export function parsePriceARS(raw: unknown): number | null {
  if (typeof raw === "number") {
    if (!Number.isFinite(raw) || raw < 0) return null;
    return Math.round(raw);
  }
  if (raw == null) return null;

  const text = String(raw)
    .trim()
    .replace(/\$/g, "")
    .replace(/\s/g, "")
    .replace(/ARS/gi, "");
  if (!text) return null;
  if (/[^0-9.,]/.test(text)) return null;

  let normalized = text;
  const hasComma = text.includes(",");
  const hasDot = text.includes(".");

  if (hasComma && hasDot) {
    const lastComma = text.lastIndexOf(",");
    const lastDot = text.lastIndexOf(".");
    normalized =
      lastComma > lastDot
        ? text.replace(/\./g, "").replace(",", ".")
        : text.replace(/,/g, "");
  } else if (hasComma) {
    const parts = text.split(",");
    if (parts.length > 2) {
      normalized = text.replace(/,/g, "");
    } else if (parts[1]?.length === 3 && parts[0] !== "0") {
      normalized = parts[0] + parts[1];
    } else {
      normalized = text.replace(",", ".");
    }
  } else if (hasDot) {
    const parts = text.split(".");
    if (parts.length > 2) {
      normalized = text.replace(/\./g, "");
    } else if (parts[1]?.length === 3 && parts[0] !== "" && parts[0] !== "0") {
      normalized = parts[0] + parts[1];
    }
  }

  const value = Number(normalized);
  if (!Number.isFinite(value) || value < 0) return null;
  return Math.round(value);
}

type WhatsAppOrderOptions = {
  items: CartItem[];
  note?: string;
  discount?: { code: string; percentOff: number; amount: number } | null;
  orderCode?: string | null;
  paid?: boolean;
  transfer?: boolean;
  customerName?: string | null;
  customerPhone?: string | null;
  customerEmail?: string | null;
};

export function buildWhatsAppUrl(options: WhatsAppOrderOptions) {
  const {
    items,
    note,
    discount,
    orderCode,
    paid = false,
    transfer = false,
    customerName,
    customerPhone,
    customerEmail,
  } = options;
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const total = discount ? Math.max(0, subtotal - discount.amount) : subtotal;
  const brand = SITE.emailBrand;

  const lines: string[] = [];

  if (paid) {
    lines.push(`Hola! Acabo de *pagar* un pedido en *${brand}*.`, "");
  } else if (transfer) {
    lines.push(
      `Hola! Realicé un *pedido por transferencia* en *${brand}*.`,
      "",
      `Alias: ${SITE.transfer.alias}`,
      `Total transferido: *${formatPrice(total)}*`,
      `Adjunté el *comprobante* en la web.`,
      ""
    );
  } else {
    lines.push(`Hola! Realicé un *pedido* en *${brand}*.`, "");
  }

  if (orderCode) {
    lines.push(`N° de pedido: *${orderCode}*`, "");
  }

  if (customerName?.trim() || customerPhone?.trim() || customerEmail?.trim()) {
    lines.push("*Datos del cliente*");
    if (customerName?.trim()) lines.push(`Nombre: ${customerName.trim()}`);
    if (customerPhone?.trim()) lines.push(`Teléfono: ${customerPhone.trim()}`);
    if (customerEmail?.trim()) lines.push(`Correo: ${customerEmail.trim()}`);
    lines.push("");
  }

  lines.push(
    ...items.map(
      (item) =>
        `• ${item.quantity}x ${item.name} — ${formatPrice(item.price * item.quantity)}`
    ),
    ""
  );

  if (discount && discount.percentOff > 0) {
    lines.push(
      `Subtotal: ${formatPrice(subtotal)}`,
      `Cupón *${discount.code}* (−${discount.percentOff}%): −${formatPrice(discount.amount)}`,
      `*Total: ${formatPrice(total)}*`
    );
  } else {
    lines.push(`*Total: ${formatPrice(total)}*`);
  }

  if (note?.trim()) {
    lines.push("", `Nota: ${note.trim()}`);
  }

  if (paid) {
    lines.push(
      "",
      "✅ El pago ya fue realizado por Mercado Pago.",
      "Quedo a la espera de la confirmación y el envío."
    );
  } else {
    lines.push(
      "",
      "Quedo a la espera de la confirmación. ¡Gracias!"
    );
  }

  const text = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${SITE.whatsapp}?text=${text}`;
}
