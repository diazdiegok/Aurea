const REPLACEMENTS: Record<string, string> = {
  "anillo regulable circular": "/images/products/anillo-regulable-circular.webp",
  "anillo corazon": "/images/products/anillo-corazon.webp",
  "charms para colgante o pulsera": "/images/products/charms-colgante.webp",
  "perla de leche materna": "/images/products/perla-leche.webp",
  "conjunto gota pequena + aros + anillo regulable":
    "/images/products/conjunto-gota-aros.webp",
  "aros circulos de amor": "/images/products/aros-circulos.webp",
  "dije corazon de mama pequeno": "/images/products/dije-corazon-mama.webp",
  "gota grande": "/images/products/gota-grande.webp",
  "dije circulo pequeno": "/images/products/dije-circulo-pequeno.webp",
  "gota de plata 15 mm": "/images/products/gota-plata-15.webp",
};

/** Normaliza para comparar nombres con/sin tildes. */
export function normalizeProductName(name: string) {
  return name
    .normalize("NFC")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ");
}

export function publicProductImage(name: string, imageUrl: string | null) {
  const key = normalizeProductName(name);
  return REPLACEMENTS[key] ?? imageUrl;
}

export function productImageOverrides() {
  return { ...REPLACEMENTS };
}
