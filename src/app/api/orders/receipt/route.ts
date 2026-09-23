import { NextRequest, NextResponse } from "next/server";
import { optimizeReceiptImage } from "@/lib/image";

const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
]);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "Adjuntá el comprobante" }, { status: 400 });
    }

    if (!ALLOWED.has(file.type) && !file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "El comprobante tiene que ser una imagen (JPG, PNG o similar)" },
        { status: 400 }
      );
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "El comprobante no puede superar 8 MB" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const url = await optimizeReceiptImage(buffer);
    return NextResponse.json({ url });
  } catch (error) {
    console.error("Receipt upload error:", error);
    return NextResponse.json(
      { error: "No se pudo subir el comprobante" },
      { status: 500 }
    );
  }
}
