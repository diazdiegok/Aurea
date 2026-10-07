import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = path.join(root, "public/images/joyas-cenizas.png");
const { data, info } = await sharp(src)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
const w = info.width;
const h = info.height;
const bg = new Uint8Array(w * h);

function lum(i) {
  return (data[i] + data[i + 1] + data[i + 2]) / 3;
}
function chroma(i) {
  return (
    Math.max(data[i], data[i + 1], data[i + 2]) -
    Math.min(data[i], data[i + 1], data[i + 2])
  );
}
function isBg(x, y) {
  const i = (y * w + x) * 4;
  return lum(i) >= 228 && chroma(i) < 16;
}

const qx = new Int32Array(w * h);
const qy = new Int32Array(w * h);
let qs = 0;
let qe = 0;
function push(x, y) {
  const p = y * w + x;
  if (bg[p] || !isBg(x, y)) return;
  bg[p] = 1;
  qx[qe] = x;
  qy[qe] = y;
  qe++;
}
for (let x = 0; x < w; x++) {
  push(x, 0);
  push(x, h - 1);
}
for (let y = 0; y < h; y++) {
  push(0, y);
  push(w - 1, y);
}
while (qs < qe) {
  const x = qx[qs];
  const y = qy[qs];
  qs++;
  if (x > 0) push(x - 1, y);
  if (x < w - 1) push(x + 1, y);
  if (y > 0) push(x, y - 1);
  if (y < h - 1) push(x, y + 1);
}

for (let p = 0; p < w * h; p++) {
  const i = p * 4;
  if (bg[p]) {
    data[i + 3] = 0;
    continue;
  }
  const x = p % w;
  const y = (p / w) | 0;
  let near = false;
  if (x > 0 && bg[p - 1]) near = true;
  if (x < w - 1 && bg[p + 1]) near = true;
  if (y > 0 && bg[p - w]) near = true;
  if (y < h - 1 && bg[p + w]) near = true;
  const l = lum(i);
  if (near && l > 205) {
    data[i + 3] = Math.max(0, Math.min(255, (228 - l) * 8));
  }
}

let minX = w;
let minY = h;
let maxX = 0;
let maxY = 0;
for (let y = 0; y < h; y++) {
  for (let x = 0; x < w; x++) {
    if (data[(y * w + x) * 4 + 3] > 18) {
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }
  }
}
const pad = 28;
minX = Math.max(0, minX - pad);
minY = Math.max(0, minY - pad);
maxX = Math.min(w - 1, maxX + pad);
maxY = Math.min(h - 1, maxY + pad);

const cut = await sharp(data, { raw: { width: w, height: h, channels: 4 } })
  .extract({
    left: minX,
    top: minY,
    width: maxX - minX + 1,
    height: maxY - minY + 1,
  })
  .png()
  .toBuffer();

const out = path.join(root, "public/images/joyas-cenizas-cut.png");
const preview = path.join(root, "tmp-cut-cream.png");
await sharp(cut).png().toFile(out);

const meta = await sharp(cut).metadata();
await sharp({
  create: {
    width: meta.width,
    height: meta.height,
    channels: 4,
    background: { r: 247, g: 241, b: 234, alpha: 1 },
  },
})
  .composite([{ input: cut }])
  .png()
  .toFile(preview);

console.log("cut", meta.width, meta.height);
