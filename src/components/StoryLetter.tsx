"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Reveal } from "@/components/Reveal";

function Line({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <Reveal delay={delay}>
      <p className="text-[17px] leading-8 text-[#5c4a3d] sm:text-lg sm:leading-9">
        {children}
      </p>
    </Reveal>
  );
}

function Emphasis({ children }: { children: ReactNode }) {
  return (
    <Reveal>
      <p className="font-serif text-3xl leading-snug text-[#4a3b30] sm:text-4xl">
        {children}
      </p>
    </Reveal>
  );
}

export function StoryLetter() {
  const storyRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const story = storyRef.current;
    if (!story) return;

    function onScroll() {
      if (!story) return;
      const start = story.offsetTop - 140;
      const distance = Math.max(story.offsetHeight - window.innerHeight * 0.45, 1);
      const value = (window.scrollY - start) / distance;
      setProgress(Math.min(1, Math.max(0, value)));
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <article ref={storyRef} className="relative mx-auto max-w-3xl px-5 py-12 sm:px-6 sm:py-16">
      <div
        className="pointer-events-none absolute inset-y-0 left-3 hidden w-px bg-[#e4d5c5] sm:left-6 sm:block"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute left-3 top-0 hidden w-px origin-top bg-[#a67c52] shadow-[0_0_16px_#d4b896] sm:left-6 sm:block"
        style={{ height: `${progress * 100}%` }}
        aria-hidden="true"
      />

      <div className="sm:pl-8">
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#a67c52]">
          Mi historia 💫 ♥️
        </p>
        <h1 className="mt-3 font-serif text-5xl text-[#4a3b30] sm:text-6xl">ÁUREA</h1>
        <p className="mt-4 max-w-xl text-lg leading-8 text-[#6d5c4d]">
          Una historia para conservar lo que alguna vez fue parte de nosotros.
        </p>

        <div
          className="sticky top-[7.4rem] z-20 -mx-5 mt-8 h-1 overflow-hidden bg-[#e4d5c5]/80 sm:hidden"
          aria-hidden="true"
        >
          <div
            className="h-full bg-[#a67c52] shadow-[0_0_12px_#d4b896]"
            style={{ width: `${progress * 100}%` }}
          />
        </div>

        <div className="mt-10 space-y-8">
          <Line>
            ÁUREA nació de algo mucho más profundo que el deseo de emprender.
            Nació de una historia, de una emoción y de esa necesidad tan humana
            de conservar para siempre aquello que alguna vez fue parte de
            nosotros. 🤍
          </Line>
          <Line>
            Cuando descubrí el mundo de las joyas de leche materna y ADN,
            entendí que no estaba creando simplemente una joya. Estaba creando
            una manera de transformar un pedacito de una historia en algo que
            pudiera acompañarnos toda la vida.
          </Line>
          <Line>
            La leche materna guarda meses de amor, de noches sin dormir, de
            abrazos, de esfuerzo, de conexión y de un vínculo imposible de
            explicar con palabras. Un mechoncito de pelo, un dientito, el
            cordón umbilical o incluso una muestra de ADN también pueden guardar
            recuerdos que queremos llevar cerca del corazón.
          </Line>

          <Emphasis>Y fue ahí cuando entendí que esto era lo que quería hacer.</Emphasis>

          <Line>
            Emprendí porque quería crear algo con significado. Algo que no se
            use solamente por ser lindo, sino que tenga una historia detrás. Una
            joya que, cada vez que alguien la mire, le recuerde una etapa, una
            persona, un vínculo o un amor que merece ser guardado para siempre.
          </Line>
          <Line>
            ÁUREA también nació de mis ganas de aprender, de crecer, de
            perfeccionarme y de hacer cada pieza con el mayor cuidado y respeto
            posible. Porque detrás de cada joya hay una historia que merece ser
            tratada como única.
          </Line>

          <Emphasis>
            Hoy miro todo lo que fui construyendo y entiendo que ÁUREA no es
            solamente mi emprendimiento.
          </Emphasis>

          <Reveal>
            <div className="space-y-3 border-l-2 border-[#d4b896] pl-5 text-[17px] leading-8 text-[#5c4a3d] sm:text-lg sm:leading-9">
              <p>Es mi manera de convertir recuerdos en algo tangible.</p>
              <p>De darle una nueva vida a momentos que pasan demasiado rápido.</p>
              <p>
                De transformar lo que alguna vez fue parte de una historia en una
                joya para toda la vida.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <p className="font-serif text-2xl leading-snug text-[#4a3b30] sm:text-3xl">
              Porque hay recuerdos que no queremos dejar atrás.
              <span className="mt-2 block">
                Queremos llevarlos siempre con nosotros. ✨
              </span>
            </p>
          </Reveal>

          <Reveal>
            <div className="story-close rounded-[28px] bg-[#4a3b30] px-6 py-8 text-[#f7f1ea] sm:px-8">
              <p className="font-serif text-4xl">ÁUREA.</p>
              <p className="mt-3 text-lg leading-8 text-[#f3e6d8]">
                Joyas hechas con amor, para guardar lo que más amamos. 🤍
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </article>
  );
}
