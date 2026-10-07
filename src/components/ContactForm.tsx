"use client";

import { FormEvent, useState } from "react";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const form = event.currentTarget as HTMLFormElement;
    const website = new FormData(form).get("website");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          message,
          website,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "No se pudo enviar el mensaje");
        return;
      }
      setSent(true);
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch {
      setError("No se pudo enviar el mensaje. Probá de nuevo en un momento.");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="rounded-3xl border border-[#e4d5c5] bg-white/90 p-6 shadow-sm sm:p-8">
        <p className="font-serif text-2xl text-[#4a3b30]">Mensaje enviado</p>
        <p className="mt-3 text-sm leading-6 text-[#6d5c4d]">
          Recibimos tu consulta. Te vamos a responder a la brevedad.
        </p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="mt-6 text-sm font-medium text-[#a67c52] hover:text-[#4a3b30]"
        >
          Enviar otra consulta
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-[#e4d5c5] bg-white/90 p-6 shadow-sm sm:p-8"
    >
      <label className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        Sitio web
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>

      <div className="grid gap-4">
        <label className="block text-sm font-medium text-[#5c4a3d]">
          Nombre
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            required
            minLength={2}
            maxLength={80}
            className="mt-1.5 w-full rounded-xl border border-[#e8ddd3] bg-[#faf6f1] px-3 py-3 text-[#5c4a3d] outline-none transition focus:border-[#c9956a] focus:ring-2 focus:ring-[#c9956a]/20"
          />
        </label>
        <label className="block text-sm font-medium text-[#5c4a3d]">
          Correo
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
            placeholder="tu@email.com"
            className="mt-1.5 w-full rounded-xl border border-[#e8ddd3] bg-[#faf6f1] px-3 py-3 text-[#5c4a3d] outline-none transition focus:border-[#c9956a] focus:ring-2 focus:ring-[#c9956a]/20"
          />
        </label>
        <label className="block text-sm font-medium text-[#5c4a3d]">
          Teléfono <span className="font-normal text-[#8a7b6e]">(opcional)</span>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="tel"
            maxLength={40}
            className="mt-1.5 w-full rounded-xl border border-[#e8ddd3] bg-[#faf6f1] px-3 py-3 text-[#5c4a3d] outline-none transition focus:border-[#c9956a] focus:ring-2 focus:ring-[#c9956a]/20"
          />
        </label>
        <label className="block text-sm font-medium text-[#5c4a3d]">
          Mensaje
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            minLength={10}
            maxLength={2000}
            rows={5}
            placeholder="Contanos qué te gustaría saber"
            className="mt-1.5 w-full resize-y rounded-xl border border-[#e8ddd3] bg-[#faf6f1] px-3 py-3 text-[#5c4a3d] outline-none transition focus:border-[#c9956a] focus:ring-2 focus:ring-[#c9956a]/20"
          />
        </label>
      </div>

      {error && (
        <p className="mt-4 text-sm text-[#8b3a3a]" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="btn-press mt-6 inline-flex h-11 items-center rounded-full bg-[#4a3b30] px-6 text-sm font-medium text-[#f7f1ea] hover:bg-[#5c4a3d] disabled:opacity-60"
      >
        {loading ? "Enviando…" : "Enviar consulta"}
      </button>
    </form>
  );
}
