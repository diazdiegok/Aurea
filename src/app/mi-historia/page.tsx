import type { Metadata } from "next";
import { StoryLetter } from "@/components/StoryLetter";

export const metadata: Metadata = {
  title: "Mi historia | Aurea Joyas ADN",
  description:
    "ÁUREA nació para convertir recuerdos en una joya. La historia detrás de las piezas hechas con amor.",
};

export default function MiHistoriaPage() {
  return (
    <main className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 60% 40% at 50% 0%, #e7d3b888, transparent 60%), radial-gradient(ellipse 40% 30% at 100% 80%, #c9956a22, transparent 55%)",
        }}
      />
      <StoryLetter />
    </main>
  );
}
