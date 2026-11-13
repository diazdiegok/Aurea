"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { ConfirmDialog } from "@/components/ConfirmDialog";

type Promotion = {
  id: string;
  name: string;
  categories: string[];
  productIds?: string[];
  percentOff: number;
  hours: number;
  startsAt: string;
  endsAt: string;
  active: boolean;
};

type ProductOption = {
  id: string;
  name: string;
  category: string;
  active: boolean;
};

const inputClass =
  "mt-1.5 w-full rounded-xl border border-[#e8ddd3] bg-[#faf6f1] px-3 py-2.5 text-[#5c4a3d] outline-none transition focus:border-[#c9956a] focus:ring-2 focus:ring-[#c9956a]/20";

export function AdminPromotions({
  categories,
  products: productsProp = [],
}: {
  categories: string[];
  products?: ProductOption[];
}) {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [catalog, setCatalog] = useState<ProductOption[]>(productsProp);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [productQuery, setProductQuery] = useState("");
  const [percentOff, setPercentOff] = useState("20");
  const [hours, setHours] = useState("24");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const categoryList = useMemo(
    () => [...new Set(categories.filter(Boolean))].sort(),
    [categories]
  );

  const products = catalog.length > 0 ? catalog : productsProp;

  const productById = useMemo(() => {
    const map = new Map(products.map((p) => [p.id, p]));
    return map;
  }, [products]);

  const filteredProducts = useMemo(() => {
    const q = productQuery.trim().toLowerCase();
    const list = [...products].sort((a, b) => a.name.localeCompare(b.name, "es"));
    if (!q) return list;
    return list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }, [products, productQuery]);

  const canSave = selectedCategories.length > 0 || selectedProducts.length > 0;

  async function load() {
    setLoading(true);
    const [promoRes, productRes] = await Promise.all([
      fetch("/api/admin/promotions"),
      fetch("/api/admin/products"),
    ]);
    if (promoRes.ok) setPromotions(await promoRes.json());
    if (productRes.ok) {
      const rows = (await productRes.json()) as ProductOption[];
      setCatalog(
        rows.map((p) => ({
          id: p.id,
          name: p.name,
          category: p.category,
          active: p.active,
        }))
      );
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (productsProp.length) setCatalog(productsProp);
  }, [productsProp]);

  function toggleCategory(cat: string) {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  }

  function toggleProduct(id: string) {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  }

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    const res = await fetch("/api/admin/promotions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        categories: selectedCategories,
        productIds: selectedProducts,
        percentOff: Number(percentOff),
        hours: Number(hours),
      }),
    });
    const json = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) {
      setMessage(json.error || "No se pudo crear la promoción");
      return;
    }

    const parts: string[] = [];
    if (json.productIds?.length) {
      parts.push(
        `${json.productIds.length} producto${json.productIds.length === 1 ? "" : "s"}`
      );
    }
    if (json.categories?.length) parts.push(json.categories.join(", "));

    setSelectedCategories([]);
    setSelectedProducts([]);
    setProductQuery("");
    setPercentOff("20");
    setHours("24");
    setName("");
    setMessage(
      `Promoción activa: −${json.percentOff}% por ${json.hours}h en ${parts.join(" · ")}`
    );
    await load();
  }

  async function endPromo(id: string) {
    await fetch(`/api/admin/promotions/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: false }),
    });
    await load();
  }

  async function confirmDelete() {
    if (!pendingDeleteId) return;
    setDeleting(true);
    await fetch(`/api/admin/promotions/${pendingDeleteId}`, { method: "DELETE" });
    setPendingDeleteId(null);
    setDeleting(false);
    await load();
  }

  function promoTargetLabel(promo: Promotion) {
    const bits: string[] = [];
    const ids = promo.productIds || [];
    if (ids.length) {
      const names = ids
        .map((id) => productById.get(id)?.name || "Producto")
        .slice(0, 4);
      const extra = ids.length > 4 ? ` +${ids.length - 4}` : "";
      bits.push(`${names.join(", ")}${extra}`);
    }
    if (promo.categories?.length) bits.push(promo.categories.join(" · "));
    return bits.join(" · ") || "Sin destino";
  }

  const now = Date.now();

  return (
    <div className="space-y-8">
      <form
        onSubmit={handleCreate}
        className="rounded-2xl border border-[#e8ddd3] bg-white p-6 shadow-sm"
      >
        <h2 className="font-serif text-xl text-stone-800">Nueva promoción HOT</h2>
        <p className="mt-1 text-sm text-[#9a8b7e]">
          Primero elegí productos (o una categoría entera), el % y las horas.
        </p>

        <label className="mt-4 block text-sm font-medium text-[#5c4a3d]">
          Nombre (opcional)
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: Flash weekend"
            className={inputClass}
          />
        </label>

        <div className="mt-6 rounded-2xl border border-[#f0dcc8] bg-[#fff8f1] p-4">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <p className="text-sm font-medium text-[#5c4a3d]">
                1. Elegí productos
              </p>
              <p className="mt-0.5 text-xs text-[#9a8b7e]">
                Tocá las piezas que van con descuento. Podés buscar por nombre.
              </p>
            </div>
            {selectedProducts.length > 0 && (
              <button
                type="button"
                onClick={() => setSelectedProducts([])}
                className="text-xs text-[#9a8b7e] underline hover:text-[#5c4a3d]"
              >
                Limpiar ({selectedProducts.length})
              </button>
            )}
          </div>

          <input
            value={productQuery}
            onChange={(e) => setProductQuery(e.target.value)}
            placeholder="Buscar producto..."
            className={`${inputClass} mt-3 bg-white`}
          />

          {loading && products.length === 0 ? (
            <p className="mt-3 text-sm text-[#9a8b7e]">Cargando productos...</p>
          ) : products.length === 0 ? (
            <p className="mt-3 text-sm text-[#9a8b7e]">
              Todavía no hay productos en el catálogo.
            </p>
          ) : (
            <div className="mt-3 max-h-72 space-y-1 overflow-y-auto rounded-xl border border-[#e8ddd3] bg-white p-2">
              {filteredProducts.length === 0 ? (
                <p className="px-2 py-3 text-sm text-[#9a8b7e]">
                  Ningún producto coincide con la búsqueda.
                </p>
              ) : (
                filteredProducts.map((product) => {
                  const on = selectedProducts.includes(product.id);
                  return (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => toggleProduct(product.id)}
                      className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition ${
                        on
                          ? "bg-[#c45c26] text-white"
                          : "bg-[#faf6f1] text-[#5c4a3d] hover:bg-[#f5ebe3]"
                      }`}
                    >
                      <span className="min-w-0">
                        <span className="block truncate font-medium">
                          {on ? `✓ ${product.name}` : product.name}
                        </span>
                        <span
                          className={`block truncate text-xs ${
                            on ? "text-white/80" : "text-[#9a8b7e]"
                          }`}
                        >
                          {product.category}
                          {!product.active ? " · oculto" : ""}
                        </span>
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          )}
          <p className="mt-2 text-xs text-[#9a8b7e]">
            {products.length} en catálogo
            {selectedProducts.length > 0
              ? ` · ${selectedProducts.length} seleccionados`
              : ""}
          </p>
        </div>

        <div className="mt-5">
          <p className="text-sm font-medium text-[#5c4a3d]">
            2. O toda una categoría (opcional)
          </p>
          <p className="mt-0.5 text-xs text-[#9a8b7e]">
            Si marcás una categoría, aplica a todos los productos de esa
            categoría.
          </p>
          {categoryList.length === 0 ? (
            <p className="mt-2 text-sm text-[#9a8b7e]">
              Todavía no hay categorías. Creálas en la pestaña Categorías.
            </p>
          ) : (
            <div className="mt-2 flex flex-wrap gap-2">
              {categoryList.map((cat) => {
                const on = selectedCategories.includes(cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleCategory(cat)}
                    className={`rounded-full px-3 py-1.5 text-sm transition ${
                      on
                        ? "bg-[#c45c26] text-white"
                        : "bg-[#faf6f1] text-[#5c4a3d] ring-1 ring-[#e8ddd3]"
                    }`}
                  >
                    {on ? `✓ ${cat}` : cat}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium text-[#5c4a3d]">
            Descuento (%)
            <input
              type="number"
              min="1"
              max="100"
              value={percentOff}
              onChange={(e) => setPercentOff(e.target.value)}
              className={inputClass}
              required
            />
          </label>
          <label className="block text-sm font-medium text-[#5c4a3d]">
            Duración (horas)
            <input
              type="number"
              min="1"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              className={inputClass}
              required
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={saving || !canSave}
          className="mt-4 rounded-full bg-[#c45c26] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#a84c1f] disabled:opacity-50"
        >
          {saving ? "Activando..." : "🔥 Activar promoción"}
        </button>
        {message && (
          <p
            className={`mt-3 text-sm ${
              message.includes("No se pudo") || message.includes("Elegí")
                ? "text-red-600"
                : "text-green-700"
            }`}
          >
            {message}
          </p>
        )}
      </form>

      <section>
        <h3 className="font-serif text-xl text-[#4a3b30]">
          Promociones ({promotions.length})
        </h3>
        {loading ? (
          <p className="mt-3 text-sm text-[#8a7b6e]">Cargando...</p>
        ) : promotions.length === 0 ? (
          <p className="mt-3 text-sm text-[#8a7b6e]">Todavía no hay promociones.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {promotions.map((promo) => {
              const live =
                promo.active && new Date(promo.endsAt).getTime() > now;
              return (
                <article
                  key={promo.id}
                  className="rounded-2xl border border-[#e8ddd3] bg-white p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-[#4a3b30]">
                        {promo.name || "Promoción"}{" "}
                        <span className="text-[#c45c26]">
                          −{promo.percentOff}%
                        </span>
                      </p>
                      <p className="mt-1 text-sm text-[#6d5c4d]">
                        {promoTargetLabel(promo)}
                      </p>
                      <p className="mt-1 text-xs text-[#8a7b6e]">
                        {live ? "En curso" : "Finalizada"} · {promo.hours}h · hasta{" "}
                        {new Date(promo.endsAt).toLocaleString("es-AR")}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {live && (
                        <button
                          type="button"
                          onClick={() => endPromo(promo.id)}
                          className="rounded-full border border-[#e4d5c5] px-3 py-1.5 text-sm"
                        >
                          Cortar ahora
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setPendingDeleteId(promo.id)}
                        className="rounded-full border border-red-200 px-3 py-1.5 text-sm text-red-600"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <ConfirmDialog
        open={Boolean(pendingDeleteId)}
        title="Eliminar promoción"
        message="¿Eliminar esta promoción? Dejará de aplicar en el catálogo."
        confirmLabel="Eliminar"
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDeleteId(null)}
      />
    </div>
  );
}
