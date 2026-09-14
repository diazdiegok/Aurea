"use client";

import { useEffect, useMemo, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { HeroBrand } from "@/components/HeroBrand";
import { SearchIcon } from "@/components/Icons";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string | null;
  category: string;
  featured: boolean;
  salePrice?: number | null;
  promotionPercent?: number | null;
  promotionEndsAt?: string | null;
};

const CATEGORY_ORDER = ["Sin Bordes", "Bordes de Acero", "Plata 925", "Mascotas"];

type SortKey = "featured" | "price-asc" | "price-desc" | "name";

function displayPrice(product: Product) {
  const onSale =
    product.salePrice != null &&
    product.salePrice < product.price &&
    (product.promotionPercent || 0) > 0;
  return onSale ? product.salePrice! : product.price;
}

export function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("Todos");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("featured");

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then(setProducts)
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const unique = [...new Set(products.map((p) => p.category))];
    unique.sort(
      (a, b) =>
        (CATEGORY_ORDER.indexOf(a) === -1 ? 99 : CATEGORY_ORDER.indexOf(a)) -
        (CATEGORY_ORDER.indexOf(b) === -1 ? 99 : CATEGORY_ORDER.indexOf(b))
    );
    return ["Todos", ...unique];
  }, [products]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = products.filter((p) => {
      if (category !== "Todos" && p.category !== category) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    });

    const ranked = [...list];
    if (sort === "price-asc") {
      ranked.sort((a, b) => displayPrice(a) - displayPrice(b));
    } else if (sort === "price-desc") {
      ranked.sort((a, b) => displayPrice(b) - displayPrice(a));
    } else if (sort === "name") {
      ranked.sort((a, b) => a.name.localeCompare(b.name, "es"));
    } else {
      ranked.sort((a, b) => Number(b.featured) - Number(a.featured));
    }
    return ranked;
  }, [products, category, query, sort]);

  const lookbookPiece =
    !query.trim() && category === "Todos" && sort === "featured"
      ? filtered.find((p) => p.featured) ?? null
      : null;
  const gridProducts = lookbookPiece
    ? filtered.filter((p) => p.id !== lookbookPiece.id)
    : filtered;

  return (
    <main>
      <section className="relative overflow-hidden border-b border-[#e4d5c5] bg-[linear-gradient(165deg,#f3e8dc_0%,#f7f1ea_48%,#efe4d8_100%)]">
        <div
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 80% 60% at 18% 18%, #d4b89655, transparent 55%), radial-gradient(ellipse 70% 50% at 92% 78%, #c9956a28, transparent 50%)",
          }}
        />
        <div className="pointer-events-none absolute -right-16 top-10 h-56 w-56 rounded-full bg-[#d4b896]/15 blur-3xl" />
        <div className="pointer-events-none absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-[#a67c52]/10 blur-3xl" />

        <HeroBrand />
      </section>

      <section className="mx-auto max-w-6xl px-0 pb-16 pt-0 sm:px-6 sm:pb-20 sm:pt-2">
        <Reveal className="px-5 pb-1 pt-8 text-center sm:px-0 sm:pt-10">
          <h2 className="font-serif text-3xl text-[#4a3b30] sm:text-4xl">
            Piezas
          </h2>
        </Reveal>

        <div className="sticky top-[56px] z-30 border-b border-[#e4d5c5]/80 bg-[#f7f1ea]/95 backdrop-blur-md sm:static sm:border-0 sm:bg-transparent sm:backdrop-blur-none">
          <div className="mx-auto flex max-w-2xl flex-col gap-3 px-5 py-3.5 sm:px-0 sm:py-6">
            <label className="relative block">
              <span className="sr-only">Buscar piezas</span>
              <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a67c52]" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por nombre, descripción o categoría"
                className="w-full rounded-full border border-[#e4d5c5] bg-white/80 py-2.5 pl-10 pr-4 text-sm text-[#4a3b30] outline-none placeholder:text-[#8a7b6e] focus:border-[#c9b29a] focus:ring-2 focus:ring-[#c9956a]/20"
              />
            </label>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {categories.length > 1 &&
                categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`shrink-0 rounded-full px-4 py-2 text-[13px] transition duration-300 sm:px-5 sm:text-sm ${
                      category === cat
                        ? "bg-[#4a3b30] text-[#f7f1ea] shadow-[0_8px_18px_-10px_rgba(74,59,48,0.8)]"
                        : "bg-white/70 text-[#6d5c4d] ring-1 ring-[#e4d5c5] hover:text-[#4a3b30] hover:ring-[#c9b29a]"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                aria-label="Ordenar piezas"
                className="rounded-full border border-[#e4d5c5] bg-white/80 px-3 py-2 text-[13px] text-[#5c4a3d] outline-none focus:border-[#c9b29a]"
              >
                <option value="featured">Destacadas</option>
                <option value="price-asc">Precio: menor a mayor</option>
                <option value="price-desc">Precio: mayor a menor</option>
                <option value="name">Nombre A–Z</option>
              </select>
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-0">
          {loading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="skeleton-shimmer aspect-[4/5] rounded-[1.35rem]"
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-[#d4b896] bg-white/50 p-12 text-center">
              <p className="font-serif text-2xl text-[#4a3b30]">
                {query.trim() || category !== "Todos"
                  ? "No encontramos piezas con esa búsqueda"
                  : "Pronto vas a ver productos acá"}
              </p>
              {(query.trim() || category !== "Todos") && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setCategory("Todos");
                  }}
                  className="mt-4 rounded-full bg-[#4a3b30] px-5 py-2 text-sm text-white"
                >
                  Ver toda la colección
                </button>
              )}
            </div>
          ) : (
            <div key={`${category}-${sort}-${query}`} className="space-y-5 sm:space-y-7">
              {lookbookPiece && (
                <Reveal>
                  <ProductCard product={lookbookPiece} variant="lookbook" />
                </Reveal>
              )}
              {gridProducts.length > 0 && (
                <div className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-7">
                  {gridProducts.map((product, index) => (
                    <Reveal
                      key={product.id}
                      className="h-full"
                      delay={Math.min(index % 3, 2) * 40}
                    >
                      <ProductCard product={product} />
                    </Reveal>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
