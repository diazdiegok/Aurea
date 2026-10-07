import Image from "next/image";

export function AshesShowcase() {
  return (
    <figure className="ashes-stage relative lg:sticky lg:top-28 lg:order-last">
      <div className="ashes-ground" aria-hidden="true" />
      <Image
        src="/images/joyas-cenizas-cut.png"
        alt="Anillo y dije de plata con cenizas de cremación"
        width={674}
        height={294}
        priority
        className="ashes-piece"
      />
    </figure>
  );
}
