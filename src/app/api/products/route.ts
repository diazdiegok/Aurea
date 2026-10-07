import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { publicProductImage } from "@/lib/product-images";
import { getActivePromotions, withPromotionPricing } from "@/lib/promotions";

export async function GET() {
  const [products, promotions] = await Promise.all([
    db.product.findMany({
      where: { active: true },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    }),
    getActivePromotions(),
  ]);

  return NextResponse.json(
    products.map((p) =>
      withPromotionPricing(
        { ...p, imageUrl: publicProductImage(p.name, p.imageUrl) },
        promotions
      )
    )
  );
}
