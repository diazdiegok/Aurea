import sharp from "sharp";
import { db } from "./db";

const OUTPUT = 1440;
const WEBP_QUALITY = 96;
const CREAM = { r: 250, g: 246, b: 241, alpha: 1 };

/** Quita barras negras / letterboxing antes de encuadrar. */
async function trimLetterbox(buffer: Buffer): Promise<Buffer> {
  const { data, info } = await sharp(buffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;

  function isContent(i: number) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const lum = (r + g + b) / 3;
    if (lum < 45) return false;
    if (
      r > 242 &&
      g > 238 &&
      b > 230 &&
      Math.abs(r - g) < 10 &&
      Math.abs(g - b) < 16
    ) {
      return false;
    }
    return true;
  }

  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;
  let count = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * channels;
      if (!isContent(i)) continue;
      count++;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }

  const contentW = maxX - minX + 1;
  const contentH = maxY - minY + 1;
  if (
    count < width * height * 0.05 ||
    contentW < width * 0.25 ||
    contentH < height * 0.25
  ) {
    return buffer;
  }

  const pad = Math.round(Math.min(contentW, contentH) * 0.01);
  const left = Math.max(0, minX - pad);
  const top = Math.max(0, minY - pad);
  const extractWidth = Math.min(width - left, contentW + pad * 2);
  const extractHeight = Math.min(height - top, contentH + pad * 2);

  if (extractWidth >= width * 0.98 && extractHeight >= height * 0.98) {
    return buffer;
  }

  return sharp(buffer)
    .extract({ left, top, width: extractWidth, height: extractHeight })
    .toBuffer();
}

export async function optimizeProductImage(buffer: Buffer) {
  const cleaned = await trimLetterbox(buffer);
  const webp = await sharp(cleaned)
    .rotate()
    .flatten({ background: CREAM })
    .resize(OUTPUT, OUTPUT, {
      fit: "cover",
      position: "centre",
    })
    .sharpen({ sigma: 0.6 })
    .webp({ quality: WEBP_QUALITY, effort: 6 })
    .toBuffer();

  const media = await db.media.create({
    data: {
      mimeType: "image/webp",
      data: webp,
    },
  });

  return `/api/media/${media.id}`;
}

/** Comprobante de transferencia: mantiene proporción, sin recorte cuadrado. */
export async function optimizeReceiptImage(buffer: Buffer) {
  const webp = await sharp(buffer)
    .rotate()
    .resize(1600, 1600, {
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 82, effort: 4 })
    .toBuffer();

  const media = await db.media.create({
    data: {
      mimeType: "image/webp",
      data: webp,
    },
  });

  return `/api/media/${media.id}`;
}
