import { SITE } from "@/lib/config";
import { InstagramLink } from "@/components/InstagramLink";
import { DnaMark, InstagramIcon, WhatsAppIcon } from "@/components/Icons";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[#e4d5c5] bg-[#efe4d8]/70">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 px-5 py-10 text-center sm:flex-row sm:justify-between sm:px-6 sm:text-left">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-[#a67c52]">
            {SITE.tagline}
          </p>
          <p className="mt-2 font-serif text-xl tracking-[0.08em] text-[#4a3b30]">
            {SITE.name}
          </p>
          <DnaMark className="mx-auto mt-2 h-3 w-24 text-[#a67c52] sm:mx-0" />
          <p className="mt-2 max-w-sm text-sm text-[#6d5c4d]">{SITE.manifesto}</p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={`https://wa.me/${SITE.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Contactar por WhatsApp"
            className="btn-press inline-flex h-11 items-center gap-2 rounded-full bg-[#4a3b30] px-5 text-sm font-medium text-[#f7f1ea] hover:bg-[#5c4a3d]"
          >
            <WhatsAppIcon className="h-4 w-4" />
            WhatsApp
          </a>
          <InstagramLink
            aria-label="Seguir en Instagram"
            className="btn-press inline-flex h-11 items-center gap-2 rounded-full border border-[#c9b29a] bg-white/50 px-5 text-sm font-medium text-[#4a3b30] hover:bg-white"
          >
            <InstagramIcon className="h-4 w-4" />
            Instagram
          </InstagramLink>
        </div>
      </div>
    </footer>
  );
}
