import { db } from "@/lib/db";
import { findActiveCoupon } from "@/lib/coupons";
import { getActivePromotions, withPromotionPricing } from "@/lib/promotions";
import type { CartItem } from "@/lib/whatsapp";

export class CheckoutError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CheckoutError";
  }
}

type QuoteInput = {
  items: { id?: string; quantity?: number }[];
  couponCode?: string | null;
};

export async function quoteCart(input: QuoteInput): Promise<{
  items: CartItem[];
  couponCode: string | null;
  discountPercent: number;
  discountAmount: number;
  subtotal: number;
  total: number;
}> {
  if (!input.items?.length) {
    throw new CheckoutError("El carrito está vacío");
  }

  const promotions = await getActivePromotions();
  const ids = [
    ...new Set(input.items.map((item) => String(item.id || "").trim()).filter(Boolean)),
  ];

  const products = await db.product.findMany({
    where: { id: { in: ids }, active: true },
  });
  const byId = new Map(
    products.map((product) => [product.id, withPromotionPricing(product, promotions)])
  );

  const items: CartItem[] = [];
  for (const line of input.items) {
    const id = String(line.id || "").trim();
    const quantity = Math.max(1, Math.min(20, Math.floor(Number(line.quantity) || 0)));
    const product = byId.get(id);
    if (!product) {
      throw new CheckoutError("Hay un producto que ya no está disponible");
    }
    const unit = product.salePrice ?? product.price;
    items.push({
      id: product.id,
      name: product.name,
      price: unit,
      originalPrice: product.price,
      quantity,
    });
  }

  const coupon = input.couponCode
    ? await findActiveCoupon(String(input.couponCode))
    : null;
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountPercent = coupon?.percentOff ?? 0;
  const discountAmount =
    discountPercent > 0 ? Math.round((subtotal * discountPercent) / 100) : 0;

  return {
    items,
    couponCode: coupon?.code ?? null,
    discountPercent,
    discountAmount,
    subtotal,
    total: Math.max(0, subtotal - discountAmount),
  };
}

export function mediaIdFromUrl(url?: string | null) {
  if (!url) return null;
  const match = url.match(/\/api\/media\/([^/?#]+)/);
  return match?.[1] || null;
}

export async function deleteMediaByUrl(url?: string | null) {
  const id = mediaIdFromUrl(url);
  if (!id) return;
  await db.media.deleteMany({ where: { id } }).catch(() => undefined);
}
