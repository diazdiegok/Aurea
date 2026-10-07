import type { Metadata } from "next";
import Link from "next/link";
import { AshesShowcase } from "@/components/AshesShowcase";

export const metadata: Metadata = {
  title: "Joyas con cenizas de cremación | Aurea Joyas ADN",
  description:
    "Cada recuerdo merece convertirse en algo eterno. Joyas hechas con cenizas de cremación, con cuidado, respeto y amor.",
};

const paragraphs = [
  "Las cenizas son tan únicas como la historia de cada persona que llevamos en el corazón. Por eso, cada joya que realizamos es diferente y especial.",
  "Su color puede variar naturalmente: algunas cenizas son muy claras, otras pueden presentar tonalidades grises, beige, marrones o incluso más oscuras. No existe un color correcto o incorrecto; es simplemente parte de la esencia y de la historia de esa persona.",
  "Al incorporarlas a la joya, el resultado puede verse ligeramente diferente a como se perciben las cenizas antes de ser encapsuladas. Por eso, antes de comenzar, realizamos una pequeña prueba que nos permite apreciar cómo se verá el material una vez integrado en la pieza.",
  "Cuando las cenizas son claras, tenemos más posibilidades para trabajar con distintos tonos y pigmentos, creando combinaciones delicadas y personalizadas. En cambio, cuando presentan una tonalidad más oscura y no es posible modificarlas mediante pigmentación, también podemos crear diseños especialmente pensados para ellas.",
  "Podés elegir un color de fondo que tenga un significado para vos y, sobre él, incorporar las cenizas de la manera que prefieras: formando un pequeño corazón, una inicial, un detalle especial o simplemente dejándolas reposar delicadamente, como pequeñas partículas de un recuerdo eterno.",
];

export default function JoyasCenizasPage() {
  return (
    <main className="relative">
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 70% 50% at 12% 0%, #d4b89644, transparent 55%), radial-gradient(ellipse 55% 40% at 90% 30%, #c9956a22, transparent 50%)",
        }}
      />

      <article className="relative mx-auto grid max-w-6xl items-start gap-10 px-5 py-10 sm:px-6 sm:py-14 lg:grid-cols-[minmax(0,1fr)_minmax(300px,480px)] lg:gap-16">
        <AshesShowcase />

        <div className="max-w-2xl">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#a67c52]">
            Recuerdos eternos
          </p>
          <h1 className="mt-3 font-serif text-4xl leading-tight text-[#4a3b30] sm:text-5xl">
            Cada recuerdo merece convertirse en algo eterno 🤍
          </h1>

          <div className="mt-8 space-y-5 text-[16px] leading-7 text-[#5c4a3d] sm:text-[17px] sm:leading-8">
            {paragraphs.map((text) => (
              <p key={text}>{text}</p>
            ))}
          </div>

          <p className="mt-10 font-serif text-2xl leading-snug text-[#4a3b30] sm:text-3xl">
            Porque no se trata solamente de una joya.
          </p>
          <p className="mt-4 text-[16px] leading-7 text-[#5c4a3d] sm:text-[17px] sm:leading-8">
            Se trata de llevar cerquita a alguien que amamos, transformar un
            recuerdo en algo tangible y conservar una parte de su historia para
            siempre. ✨
          </p>
          <p className="mt-5 text-[16px] leading-7 text-[#5c4a3d] sm:text-[17px] sm:leading-8">
            Cada pieza se realiza con muchísimo cuidado, respeto y amor, porque
            sabemos que detrás de cada pequeña porción de cenizas hay una vida,
            una historia y un vínculo que merece ser honrado. 🤍
          </p>

          <Link
            href="/contacto"
            className="btn-press mt-10 inline-flex h-11 items-center rounded-full bg-[#4a3b30] px-6 text-sm font-medium text-[#f7f1ea] hover:bg-[#5c4a3d]"
          >
            Consultar por una pieza
          </Link>
        </div>
      </article>
    </main>
  );
}
