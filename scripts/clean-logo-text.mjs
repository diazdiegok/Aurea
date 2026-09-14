import sharp from "sharp";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(__dirname, "../public");
const CREAM = { r: 250, g: 246, b: 241 };

const SOURCE = path.join(PUBLIC, "logo-original.png");
const CURRENT = path.join(PUBLIC, "logo.png");

function pixelAt(pixels, width, channels, x, y) {
  const i = (y * width + x) * channels;
  return [pixels[i], pixels[i + 1], pixels[i + 2]];
}

function mix(a, b, t) {
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  ];
}

function isGoldStroke(c) {
  const lum = (c[0] + c[1] + c[2]) / 3;
  return lum < 200 && c[0] - c[2] > 25;
}

function fillBoxVerticalLerp(pixels, width, channels, region) {
  const { left, top, width: rw, height: rh } = region;

  for (let x = 0; x < rw; x++) {
    let above = pixelAt(pixels, width, channels, left + x, top - 1);
    let below = pixelAt(pixels, width, channels, left + x, top + rh);
    if (isGoldStroke(above) || isGoldStroke(below)) {
      continue;
    }
    for (let y = 0; y < rh; y++) {
      const t = rh === 1 ? 0 : y / (rh - 1);
      const color = mix(above, below, t);
      const i = ((top + y) * width + (left + x)) * channels;
      pixels[i] = Math.round(color[0]);
      pixels[i + 1] = Math.round(color[1]);
      pixels[i + 2] = Math.round(color[2]);
    }
  }

  for (let x = 0; x < rw; x++) {
    const mid = pixelAt(pixels, width, channels, left + x, top + Math.floor(rh / 2));
    if (!isGoldStroke(mid)) continue;
    let src = null;
    for (let d = 1; d < rw && !src; d++) {
      for (const nx of [x - d, x + d]) {
        if (nx < 0 || nx >= rw) continue;
        const c = pixelAt(pixels, width, channels, left + nx, top + Math.floor(rh / 2));
        if (!isGoldStroke(c)) {
          src = nx;
          break;
        }
      }
    }
    if (src == null) continue;
    for (let y = 0; y < rh; y++) {
      const c = pixelAt(pixels, width, channels, left + src, top + y);
      const i = ((top + y) * width + (left + x)) * channels;
      pixels[i] = c[0];
      pixels[i + 1] = c[1];
      pixels[i + 2] = c[2];
    }
  }
}

async function writeVariants(cleanedPng) {
  const base = sharp(cleanedPng).flatten({ background: CREAM });

  await base
    .clone()
    .resize(900, 900, { fit: "contain", background: CREAM })
    .webp({ quality: 98 })
    .toFile(path.join(PUBLIC, "logo.webp"));

  await base
    .clone()
    .resize(512, 512, { fit: "contain", background: CREAM })
    .webp({ quality: 98 })
    .toFile(path.join(PUBLIC, "logo-icon.webp"));

  await base
    .clone()
    .resize(120, 120, { fit: "contain", background: CREAM })
    .webp({ quality: 98 })
    .toFile(path.join(PUBLIC, "logo-header.webp"));

  await base
    .clone()
    .resize(560, 560, { fit: "contain", background: CREAM })
    .webp({ quality: 98 })
    .toFile(path.join(PUBLIC, "logo-hero.webp"));

  await base
    .clone()
    .resize(400, 400, { fit: "contain", background: CREAM })
    .png({ quality: 95 })
    .toFile(path.join(PUBLIC, "email-logo.png"));
}

async function main() {
  if (!fs.existsSync(SOURCE)) {
    fs.copyFileSync(CURRENT, SOURCE);
  }

  const { data, info } = await sharp(SOURCE)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const pixels = new Uint8Array(data);
  const { width, height, channels } = info;

  const regions = [
    { left: 620, top: 1156, width: 900, height: 158 },
    { left: 1490, top: 1012, width: 300, height: 168 },
  ];

  for (const region of regions) {
    fillBoxVerticalLerp(pixels, width, channels, region);
  }

  const cleaned = await sharp(Buffer.from(pixels), {
    raw: { width, height, channels },
  })
    .removeAlpha()
    .png()
    .toBuffer();

  await sharp(cleaned).toFile(CURRENT);
  await writeVariants(cleaned);
  console.log("Cleaned logo text and regenerated variants");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
