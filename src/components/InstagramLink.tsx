"use client";

import type { ReactNode } from "react";
import { SITE } from "@/lib/config";

type InstagramLinkProps = {
  className?: string;
  children: ReactNode;
  "aria-label"?: string;
};

export function InstagramLink({
  className,
  children,
  "aria-label": ariaLabel = "Seguir en Instagram",
}: InstagramLinkProps) {
  const handle = SITE.instagramHandle;
  const webUrl = `https://www.instagram.com/_u/${handle}`;

  function openApp(event: React.MouseEvent<HTMLAnchorElement>) {
    const ua = navigator.userAgent || "";
    const isMobile = /iPhone|iPad|iPod|Android/i.test(ua);
    if (!isMobile) return;

    event.preventDefault();
    const isAndroid = /Android/i.test(ua);
    const appUrl = isAndroid
      ? `intent://instagram.com/_u/${handle}#Intent;package=com.instagram.android;scheme=https;S.browser_fallback_url=${encodeURIComponent(webUrl)};end`
      : `instagram://user?username=${handle}`;

    window.location.href = appUrl;

    window.setTimeout(() => {
      if (document.hidden || document.visibilityState === "hidden") return;
      window.location.href = webUrl;
    }, 900);
  }

  return (
    <a
      href={webUrl}
      onClick={openApp}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className={className}
    >
      {children}
    </a>
  );
}
