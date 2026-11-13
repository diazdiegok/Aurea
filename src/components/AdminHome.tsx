"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";

const inputClass =
  "mt-1.5 w-full rounded-xl border border-[#e8ddd3] bg-[#faf6f1] px-3 py-2.5 text-[#5c4a3d] outline-none transition focus:border-[#c9956a] focus:ring-2 focus:ring-[#c9956a]/20";

type SplashForm = {
  active: boolean;
  title: string;
  subtitle: string;
  ctaLabel: string;
  imageUrl: string | null;
};

const empty: SplashForm = {
  active: false,
  title: "",
  subtitle: "",
  ctaLabel: "Entrar a la tienda",
  imageUrl: null,
};

export function AdminHome() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<SplashForm>(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/splash");
    if (res.ok) {
      const json = await res.json();
      setForm({
        active: Boolean(json.active),
        title: json.title || "",
        subtitle: json.subtitle || "",
        ctaLabel: json.ctaLabel || "Entrar a la tienda",
        imageUrl: json.imageUrl || null,
      });
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleUpload(file: File) {
    setUploading(true);
    const data = new FormData();
    data.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: data });
    const json = await res.json().catch(() => ({}));
    setUploading(false);
    if (json.url) {
      setForm((f) => ({ ...f, imageUrl: json.url }));
    } else {
      setMessage(json.error || "No se pudo subir la imagen");
    }
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    const res = await fetch("/api/admin/splash", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const json = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) {
      setMessage(json.error || "No se pudo guardar");
      return;
    }
    setForm({
      active: Boolean(json.active),
      title: json.title || "",
      subtitle: json.subtitle || "",
      ctaLabel: json.ctaLabel || "Entrar a la tienda",
      imageUrl: json.imageUrl || null,
    });
    setMessage(
      json.active
        ? "Aviso activo: se muestra al entrar a la tienda"
        : "Guardado. El aviso está apagado"
    );
  }

  if (loading) {
    return <p className="text-sm text-[#8a7b6e]">Cargando...</p>;
  }

  return (
    <form
      onSubmit={handleSave}
      className="rounded-2xl border border-[#e8ddd3] bg-white p-6 shadow-sm"
    >
      <h2 className="font-serif text-xl text-stone-800">Aviso de inicio</h2>
      <p className="mt-1 text-sm text-[#9a8b7e]">
        Popup al entrar a la web (Cyberweek, Black Friday, envíos, etc.). Si está
        apagado, no aparece nada.
      </p>

      <label className="mt-5 flex cursor-pointer items-center gap-2.5 text-sm">
        <input
          type="checkbox"
          checked={form.active}
          onChange={(e) => setForm({ ...form, active: e.target.checked })}
          className="h-4 w-4 rounded border-[#d4b896] text-[#5c4a3d] focus:ring-[#c9956a]"
        />
        Mostrar aviso en la tienda
      </label>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-[#5c4a3d] sm:col-span-2">
          Título *
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="¡Aprovechá las ofertas del Cyberweek!"
            className={inputClass}
            required={form.active}
          />
        </label>
        <label className="block text-sm font-medium text-[#5c4a3d] sm:col-span-2">
          Subtítulo
          <input
            value={form.subtitle}
            onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
            placeholder="Envíos gratis y precios increíbles"
            className={inputClass}
          />
        </label>
        <label className="block text-sm font-medium text-[#5c4a3d]">
          Texto del botón
          <input
            value={form.ctaLabel}
            onChange={(e) => setForm({ ...form, ctaLabel: e.target.value })}
            className={inputClass}
          />
        </label>
      </div>

      <div className="mt-4 block text-sm font-medium text-[#5c4a3d]">
        Imagen (opcional)
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleUpload(file);
          }}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="mt-1.5 flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#d4b896] bg-[#faf6f1] px-4 py-6 text-center transition hover:border-[#c9956a] hover:bg-[#f5ebe3] disabled:opacity-60"
        >
          <span className="text-sm font-medium text-[#5c4a3d]">
            {uploading ? "Subiendo..." : "Subir imagen del aviso"}
          </span>
          <span className="text-xs text-[#9a8b7e]">
            Banner, flyer o foto promocional
          </span>
        </button>
      </div>

      {form.imageUrl && (
        <div className="mt-4 flex flex-wrap items-end gap-4">
          <div className="relative h-40 w-64 overflow-hidden rounded-xl bg-[#14110e] ring-1 ring-[#e8ddd3]">
            <Image
              src={form.imageUrl}
              alt="Preview aviso"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <button
            type="button"
            onClick={() => setForm((f) => ({ ...f, imageUrl: null }))}
            className="rounded-full border border-red-200 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            Quitar imagen
          </button>
        </div>
      )}

      <div className="mt-6 rounded-2xl border border-[#e8ddd3] bg-[#14110e] p-5 text-center text-[#f6f1ea]">
        <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-[#e4c48a]">
          Vista previa
        </p>
        {form.imageUrl && (
          <div className="relative mx-auto mt-4 h-36 w-full max-w-xs overflow-hidden rounded-xl">
            <Image
              src={form.imageUrl}
              alt=""
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        )}
        <p className="mt-4 font-serif text-2xl leading-tight">
          {form.title || "Título del aviso"}
        </p>
        {form.subtitle && (
          <p className="mt-3 text-sm text-[#f0d7a8]">{form.subtitle}</p>
        )}
        <p className="mt-5 inline-flex rounded-full bg-[#e4c48a] px-5 py-2 text-sm font-medium text-[#14110e]">
          {form.ctaLabel || "Entrar a la tienda"}
        </p>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="mt-6 rounded-full bg-[#5c4a3d] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#9a7349] disabled:opacity-60"
      >
        {saving ? "Guardando..." : "Guardar aviso"}
      </button>
      {message && (
        <p
          className={`mt-3 text-sm ${
            message.includes("No se pudo") ? "text-red-600" : "text-green-700"
          }`}
        >
          {message}
        </p>
      )}
    </form>
  );
}
