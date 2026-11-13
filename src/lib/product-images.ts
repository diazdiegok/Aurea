const REPLACEMENTS: Record<string, string> = {
  "anillo regulable circular": "/images/products/anillo-regulable-circular.webp",
  "anillo corazón": "/images/products/anillo-corazon.webp",
  "anillo corazon": "/images/products/anillo-corazon.webp",
  "charms para colgante o pulsera": "/images/products/charms-colgante.webp",
  "perla de leche materna": "/images/products/perla-leche.webp",
  "conjunto gota pequeña + aros + anillo regulable":
    "/images/products/conjunto-gota-aros.webp",
  "aros círculos de amor": "/images/products/aros-circulos.webp",
  "aros circulos de amor": "/images/products/aros-circulos.webp",
  "dije corazón de mamá pequeño": "/images/products/dije-corazon-mama.webp",
  "dije corazon de mama pequeño": "/images/products/dije-corazon-mama.webp",
  "dije corazón de mama pequeño": "/images/products/dije-corazon-mama.webp",
  "gota grande": "/images/products/gota-grande.webp",
  "dije círculo pequeño": "/images/products/dije-circulo-pequeno.webp",
  "dije circulo pequeño": "/images/products/dije-circulo-pequeno.webp",
  "gota de plata 15 mm": "/images/products/gota-plata-15.webp",
};

export function publicProductImage(name: string, imageUrl: string | null) {
  return REPLACEMENTS[name.trim().toLowerCase()] ?? imageUrl;
}
