const REPLACEMENTS: Record<string, string> = {
  "anillo regulable circular": "/images/products/anillo-regulable-circular.webp",
};

export function publicProductImage(name: string, imageUrl: string | null) {
  return REPLACEMENTS[name.trim().toLowerCase()] ?? imageUrl;
}
