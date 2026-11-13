const REPLACEMENTS: Record<string, string> = {
  "anillo regulable circular": "/images/products/anillo-regulable-circular.webp",
  "anillo corazon": "/images/products/anillo-corazon-v2.webp",
  "charms para colgante o pulsera": "/images/products/charms-colgante-v2.webp",
  "perla de leche materna": "/images/products/perla-leche-v2.webp",
  "conjunto gota pequena + aros + anillo regulable":
    "/images/products/conjunto-gota-aros-v2.webp",
  "aros circulos de amor": "/images/products/aros-circulos-v2.webp",
  "dije corazon de mama pequeno": "/images/products/dije-corazon-mama-v2.webp",
  "gota grande": "/images/products/gota-grande-v2.webp",
  "dije circulo pequeno": "/images/products/dije-circulo-pequeno-v2.webp",
  "gota de plata 15 mm": "/images/products/gota-plata-15-v2.webp",
  // extras que también suelen venir letterboxeadas
  "charms corazon con cadena incluido":
    "/images/products/charms-corazon-cadena-v2.webp",
  "combo joya circulo de amor + aros circulo de amor":
    "/images/products/combo-circulo-amor-v2.webp",
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
