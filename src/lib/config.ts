export const SITE = {
  name: "Aurea",
  brandFull: "Aurea Joyas ADN",
  /** Nombre que aparece en correos al cliente */
  emailBrand: "Aurea Joyas ADN",
  contactEmail: "aureajoyasadn@gmail.com",
  tagline: "Joyas ADN",
  subtitle: "Accesorios y box personalizados",
  whatsapp: "5493435001061",
  instagramHandle: "aurea.joyasadn",
  instagram: "https://www.instagram.com/aurea.joyasadn",
  currency: "ARS",
  /** Avisos internos cuando llega un pedido web */
  orderNotifyEmails: [
    "aureajoyasadn@gmail.com",
    "vfontanetto@gmail.com",
  ],
  transfer: {
    alias: "vale.fonta",
    cvu: "0000003100078490743361",
    holder: "Valentina Fontanetto Masset",
  },
} as const;

/** URL pública de producción (fallback si falta env en Render) */
export const PRODUCTION_BASE_URL = "https://aurea-isyq.onrender.com";

export function getBaseUrl() {
  const fromEnv = (
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.RENDER_EXTERNAL_URL ||
    ""
  ).trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  if (process.env.NODE_ENV === "production") {
    return PRODUCTION_BASE_URL;
  }
  return "http://localhost:3000";
}

/** Logo limpio para correos (CDN; evita cold start de Render). */
export function getEmailLogoUrl() {
  return "https://cdn.jsdelivr.net/gh/diazdiegok/Aurea@4ef603bd1b2ec8a83e799383b998b4272ca89124/public/email-logo.png";
}
