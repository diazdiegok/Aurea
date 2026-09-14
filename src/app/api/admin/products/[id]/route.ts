import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { db } from "@/lib/db";
import { deleteMediaByUrl } from "@/lib/checkout";
import { parsePriceARS } from "@/lib/whatsapp";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, context: RouteContext) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await context.params;
  const body = await request.json();
  const current = await db.product.findUnique({ where: { id } });
  if (!current) {
    return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
  }

  const nextImage =
    body.imageUrl !== undefined ? body.imageUrl || null : current.imageUrl;
  if (nextImage !== current.imageUrl) {
    await deleteMediaByUrl(current.imageUrl);
  }

  let parsedPrice: number | undefined;
  if (body.price != null && body.price !== "") {
    const price = parsePriceARS(body.price);
    if (price == null) {
      return NextResponse.json(
        { error: "Precio inválido. Usá 290.000 para doscientos noventa mil." },
        { status: 400 }
      );
    }
    parsedPrice = price;
  }

  const product = await db.product.update({
    where: { id },
    data: {
      ...(body.name != null && { name: String(body.name).trim() }),
      ...(body.description != null && { description: String(body.description).trim() }),
      ...(parsedPrice != null && { price: parsedPrice }),
      ...(body.imageUrl !== undefined && { imageUrl: body.imageUrl || null }),
      ...(body.category != null && { category: String(body.category).trim() }),
      ...(body.featured != null && { featured: Boolean(body.featured) }),
      ...(body.active != null && { active: Boolean(body.active) }),
    },
  });

  return NextResponse.json(product);
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await context.params;
  const current = await db.product.findUnique({ where: { id } });
  if (current) {
    await deleteMediaByUrl(current.imageUrl);
  }
  await db.product.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
