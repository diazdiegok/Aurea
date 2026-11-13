/**
 * Apunta productos con fotos letterboxeadas a las versiones corregidas en /public.
 * Idempotente: se puede correr en cada arranque.
 */
import { createDb } from "./create-db";
import {
  normalizeProductName,
  productImageOverrides,
} from "../src/lib/product-images";

const { db, pool } = createDb();

async function main() {
  const overrides = productImageOverrides();
  const products = await db.product.findMany({
    select: { id: true, name: true, imageUrl: true },
  });

  let updated = 0;
  for (const product of products) {
    const key = normalizeProductName(product.name);
    const next = overrides[key];
    if (!next || product.imageUrl === next) continue;
    await db.product.update({
      where: { id: product.id },
      data: { imageUrl: next },
    });
    updated += 1;
    console.log(`OK ${product.name} → ${next}`);
  }

  console.log(
    updated
      ? `Actualizadas ${updated} fotos de producto`
      : "Ninguna foto pendiente de actualizar"
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
    await pool.end();
  });
