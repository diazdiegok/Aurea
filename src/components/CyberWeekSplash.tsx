"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { RocketIcon } from "@/components/Icons";

const STORAGE_KEY = "aurea-cyberweek-closed";

export function CyberWeekSplash() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;
    try {
      if (sessionStorage.getItem(STORAGE_KEY) === "1") return;
    } catch {
      /* sessionStorage can fail in private mode */
    }
    setOpen(true);
  }, [pathname]);

  function close() {
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") close();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center px-4 py-8">
      <button
        type="button"
        aria-label="Cerrar y entrar a la tienda"
        className="absolute inset-0 bg-[#1a1612]/50 backdrop-blur-md"
        onClick={close}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cyberweek-title"
        className="relative w-full max-w-[26rem] overflow-hidden rounded-[1.8rem] border border-[#e4c48a]/40 bg-[#14110e] text-[#f6f1ea] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.65)]"
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 55% at 50% 0%, rgba(228,196,138,0.28), transparent 60%)",
          }}
          aria-hidden
        />
        <button
          type="button"
          onClick={close}
          aria-label="Cerrar"
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full text-[#f6f1ea]/80 transition hover:bg-white/10 hover:text-white"
        >
          ✕
        </button>
        <div className="relative px-8 pb-8 pt-12 text-center sm:px-10">
          <p className="text-[11px] font-medium uppercase tracking-[0.34em] text-[#e4c48a]">
            Aurea Joyas
          </p>
          <h2
            id="cyberweek-title"
            className="mt-5 font-serif text-[2.35rem] font-medium leading-[1.05] tracking-[-0.03em] text-[#f7f1ea]"
          >
            ¡Aprovechá las ofertas del Cyberweek!
          </h2>
          <p className="mx-auto mt-5 inline-flex items-center justify-center gap-2 text-sm leading-relaxed text-[#f0d7a8]">
            <RocketIcon className="h-4 w-4 shrink-0" />
            Envíos gratis y precios increíbles
          </p>
          <button
            type="button"
            onClick={close}
            className="btn-press mt-8 w-full rounded-full bg-[#e4c48a] py-3.5 text-sm font-medium text-[#14110e] transition hover:bg-[#f0d7a8]"
          >
            Entrar a la tienda
          </button>
        </div>
      </div>
    </div>
  );
}
