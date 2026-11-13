"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

type Splash = {
  active: boolean;
  title: string;
  subtitle: string;
  ctaLabel: string;
  imageUrl: string | null;
};

export function HomeSplash() {
  const pathname = usePathname();
  const [splash, setSplash] = useState<Splash | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (pathname.startsWith("/admin")) {
      setOpen(false);
      return;
    }
    let cancelled = false;
    fetch("/api/splash")
      .then(async (r) => (r.ok ? r.json() : null))
      .then((json) => {
        if (cancelled || !json?.active || !json.title) {
          setOpen(false);
          return;
        }
        setSplash(json as Splash);
        setOpen(true);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  function close() {
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

  if (!open || !splash) return null;

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
        aria-labelledby="home-splash-title"
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
        {splash.imageUrl && (
          <div className="relative mx-4 mt-12 aspect-[16/10] overflow-hidden rounded-2xl">
            <Image
              src={splash.imageUrl}
              alt=""
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        )}
        <div
          className={`relative px-8 pb-8 text-center sm:px-10 ${
            splash.imageUrl ? "pt-6" : "pt-12"
          }`}
        >
          <p className="text-[11px] font-medium uppercase tracking-[0.34em] text-[#e4c48a]">
            Aurea Joyas
          </p>
          <h2
            id="home-splash-title"
            className="mt-5 font-serif text-[2.1rem] font-medium leading-[1.05] tracking-[-0.03em] text-[#f7f1ea] sm:text-[2.35rem]"
          >
            {splash.title}
          </h2>
          {splash.subtitle && (
            <p className="mx-auto mt-5 text-sm leading-relaxed text-[#f0d7a8]">
              {splash.subtitle}
            </p>
          )}
          <button
            type="button"
            onClick={close}
            className="btn-press mt-8 w-full rounded-full bg-[#e4c48a] py-3.5 text-sm font-medium text-[#14110e] transition hover:bg-[#f0d7a8]"
          >
            {splash.ctaLabel || "Entrar a la tienda"}
          </button>
        </div>
      </div>
    </div>
  );
}
