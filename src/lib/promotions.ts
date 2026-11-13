import { db } from "@/lib/db";

export type ActivePromotion = {
  id: string;
  name: string;
  categories: string[];
  productIds: string[];
  percentOff: number;
  endsAt: Date;
};

export type ProductWithPromo = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string | null;
  category: string;
  featured: boolean;
  active?: boolean;
  salePrice?: number | null;
  promotionPercent?: number | null;
  promotionEndsAt?: string | null;
  promotionId?: string | null;
};

export async function getActivePromotions(): Promise<ActivePromotion[]> {
  const now = new Date();
  const rows = await db.promotion.findMany({
    where: {
      active: true,
      startsAt: { lte: now },
      endsAt: { gt: now },
    },
    orderBy: { percentOff: "desc" },
  });

  return rows.map((p) => ({
    id: p.id,
    name: p.name,
    categories: p.categories,
    productIds: p.productIds || [],
    percentOff: p.percentOff,
    endsAt: p.endsAt,
  }));
}

export function findPromoForProduct(
  product: { id: string; category: string },
  promotions: ActivePromotion[]
) {
  return (
    promotions.find((p) => {
      if (p.productIds?.some((id) => id === product.id)) return true;
      return p.categories.some(
        (c) => c.trim().toLowerCase() === product.category.trim().toLowerCase()
      );
    }) || null
  );
}

export function salePriceFrom(price: number, percentOff: number) {
  const pct = Math.min(100, Math.max(0, percentOff));
  return Math.max(0, Math.round(price * (1 - pct / 100)));
}

export function withPromotionPricing<
  T extends { id: string; price: number; category: string },
>(
  product: T,
  promotions: ActivePromotion[]
): T & {
  salePrice: number | null;
  promotionPercent: number | null;
  promotionEndsAt: string | null;
  promotionId: string | null;
} {
  const promo = findPromoForProduct(product, promotions);
  if (!promo) {
    return {
      ...product,
      salePrice: null,
      promotionPercent: null,
      promotionEndsAt: null,
      promotionId: null,
    };
  }

  return {
    ...product,
    salePrice: salePriceFrom(product.price, promo.percentOff),
    promotionPercent: promo.percentOff,
    promotionEndsAt: promo.endsAt.toISOString(),
    promotionId: promo.id,
  };
}
