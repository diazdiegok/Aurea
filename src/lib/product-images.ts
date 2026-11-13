const REPLACEMENTS: Record<string, string> = {
  "anillo regulable circular": "/images/products/anillo-regulable-circular.webp",
  "anillo corazón": "/images/products/anillo-corazon.webp",
  "anillo corazon": "/images/products/anillo-corazon.webp",
};

export function publicProductImage(name: string, imageUrl: string | null) {
  return REPLACEMENTS[name.trim().toLowerCase()] ?? imageUrl;
}
