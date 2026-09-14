import Link from "next/link";

export function CheckoutDisabled() {
  return (
    <main className="mx-auto max-w-lg px-5 py-20 text-center">
      <h1 className="font-serif text-3xl text-[#4a3b30]">Checkout no disponible</h1>
      <p className="mt-4 text-[#6d5c4d]">
        El pago online no está activo. Completá tu pedido por transferencia o WhatsApp
        desde el carrito.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-full bg-[#4a3b30] px-6 py-3 text-white"
      >
        Volver al catálogo
      </Link>
    </main>
  );
}
