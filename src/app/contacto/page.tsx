import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { InstagramLink } from "@/components/InstagramLink";
import { InstagramIcon, WhatsAppIcon } from "@/components/Icons";
import { SITE } from "@/lib/config";

export const metadata: Metadata = {
  title: "Contacto | Aurea Joyas ADN",
  description:
    "Escribinos por WhatsApp, Instagram o el formulario de contacto de Aurea Joyas ADN.",
};

export default function ContactoPage() {
  return (
    <main className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 70% 50% at 15% 8%, #d4b89644, transparent 55%), radial-gradient(ellipse 60% 45% at 90% 80%, #c9956a22, transparent 50%)",
        }}
      />

      <section className="relative mx-auto grid max-w-6xl gap-10 px-5 py-12 sm:px-6 sm:py-16 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#a67c52]">
            Hablemos
          </p>
          <h1 className="mt-3 font-serif text-4xl text-[#4a3b30] sm:text-5xl">
            Contacto
          </h1>
          <p className="mt-4 max-w-md text-[16px] leading-7 text-[#6d5c4d]">
            Si querés consultar por una pieza, un recuerdo o un pedido, escribinos
            por donde te quede más cómodo.
          </p>

          <ul className="mt-8 space-y-3">
            <li>
              <a
                href={`https://wa.me/${SITE.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-press flex items-center gap-3 rounded-2xl border border-[#e4d5c5] bg-white/80 px-4 py-3 text-[#4a3b30] hover:border-[#c9b29a]"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4a3b30] text-[#f7f1ea]">
                  <WhatsAppIcon className="h-4 w-4" />
                </span>
                <span>
                  <span className="block text-sm font-medium">WhatsApp</span>
                  <span className="block text-sm text-[#6d5c4d]">+54 9 343 500-1061</span>
                </span>
              </a>
            </li>
            <li>
              <InstagramLink className="btn-press flex items-center gap-3 rounded-2xl border border-[#e4d5c5] bg-white/80 px-4 py-3 text-[#4a3b30] hover:border-[#c9b29a]">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4a3b30] text-[#f7f1ea]">
                  <InstagramIcon className="h-4 w-4" />
                </span>
                <span>
                  <span className="block text-sm font-medium">Instagram</span>
                  <span className="block text-sm text-[#6d5c4d]">
                    @{SITE.instagramHandle}
                  </span>
                </span>
              </InstagramLink>
            </li>
            <li>
              <a
                href={`mailto:${SITE.contactEmail}`}
                className="btn-press flex items-center gap-3 rounded-2xl border border-[#e4d5c5] bg-white/80 px-4 py-3 text-[#4a3b30] hover:border-[#c9b29a]"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4a3b30] font-serif text-lg text-[#f7f1ea]">
                  @
                </span>
                <span>
                  <span className="block text-sm font-medium">Correo</span>
                  <span className="block text-sm text-[#6d5c4d]">{SITE.contactEmail}</span>
                </span>
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="font-serif text-2xl text-[#4a3b30]">Escribinos</h2>
          <p className="mt-2 mb-5 text-sm leading-6 text-[#6d5c4d]">
            Dejá tu consulta y te respondemos por correo.
          </p>
          <ContactForm />
        </div>
      </section>
    </main>
  );
}
