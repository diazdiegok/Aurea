import { db } from "@/lib/db";

export type HomeSplashData = {
  active: boolean;
  title: string;
  subtitle: string;
  ctaLabel: string;
  imageUrl: string | null;
};

const DEFAULTS: HomeSplashData = {
  active: false,
  title: "",
  subtitle: "",
  ctaLabel: "Entrar a la tienda",
  imageUrl: null,
};

export async function getHomeSplash(): Promise<HomeSplashData> {
  const row = await db.homeSplash.findUnique({ where: { id: "home" } });
  if (!row) return { ...DEFAULTS };
  return {
    active: row.active,
    title: row.title,
    subtitle: row.subtitle,
    ctaLabel: row.ctaLabel || DEFAULTS.ctaLabel,
    imageUrl: row.imageUrl,
  };
}

export async function upsertHomeSplash(
  data: Partial<HomeSplashData>
): Promise<HomeSplashData> {
  const current = await getHomeSplash();
  const next = {
    active: data.active ?? current.active,
    title: data.title != null ? String(data.title).trim() : current.title,
    subtitle:
      data.subtitle != null ? String(data.subtitle).trim() : current.subtitle,
    ctaLabel:
      data.ctaLabel != null && String(data.ctaLabel).trim()
        ? String(data.ctaLabel).trim()
        : current.ctaLabel || DEFAULTS.ctaLabel,
    imageUrl:
      data.imageUrl === undefined ? current.imageUrl : data.imageUrl || null,
  };

  const row = await db.homeSplash.upsert({
    where: { id: "home" },
    create: { id: "home", ...next },
    update: next,
  });

  return {
    active: row.active,
    title: row.title,
    subtitle: row.subtitle,
    ctaLabel: row.ctaLabel,
    imageUrl: row.imageUrl,
  };
}
