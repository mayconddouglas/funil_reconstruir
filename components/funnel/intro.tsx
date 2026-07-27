"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { ArrowRight, ChevronDown } from "lucide-react"
import { clarityEvent } from "@/lib/funnel"

const OBRAS = [
  { src: "/obras/obra-1.jpg", alt: "Área de refeições com mesa de mármore e janelão com vista para piscina e mar" },
  { src: "/obras/obra-2.jpg", alt: "Sala e cozinha integradas com acabamento de alto padrão e vista para o mar" },
  { src: "/obras/obra-3.jpg", alt: "Suíte com cabeceira sob medida e varanda com vista para o mar" },
  { src: "/obras/obra-4.jpg", alt: "Sala ampla com iluminação linear de LED embutida no teto" },
]

// Troca de foto de fundo, em crossfade lento — decorativo, não deve
// competir pela atenção com o CTA (por isso sem setas/bolinhas).
const CAROUSEL_INTERVAL_MS = 5000

export function Intro({ onStart }: { onStart: () => void }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % OBRAS.length)
    }, CAROUSEL_INTERVAL_MS)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="flex flex-col">
      {/* HERO — pensado pra caber em uma tela (H1 + headline + CTA sempre
          visíveis, sem precisar rolar). "min-h" e não altura travada: em
          telas muito pequenas ou zoom de acessibilidade, o conteúdo pode
          crescer e permitir rolagem normalmente — cabe por design, não
          por bloqueio técnico de scroll. */}
      <section className="relative flex min-h-dvh w-full flex-col overflow-hidden">
        {/* fundo: fotos das obras em crossfade automático */}
        <div className="absolute inset-0">
          {OBRAS.map((obra, i) => (
            <Image
              key={obra.src}
              src={obra.src || "/placeholder.svg"}
              alt={obra.alt}
              fill
              sizes="100vw"
              priority={i === 0}
              className={`object-cover transition-opacity duration-[1600ms] ease-in-out ${
                i === index ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
          {/* overlay pra manter o texto legível sobre qualquer uma das fotos */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/85 to-background/50" />
        </div>

        {/* conteúdo, acima do fundo */}
        <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col px-5 py-6 sm:px-8">
          <header className="flex items-center justify-between">
            <span className="font-display text-xl font-bold uppercase tracking-tight">
              Recon<span className="text-primary">struir</span>
            </span>
            <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">
              (Construção &amp; Reforma)
            </span>
          </header>

          <div className="flex flex-1 flex-col justify-center gap-6 py-8">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-primary">
              Obras que duram gerações
            </span>
            <h1 className="text-balance font-display text-5xl font-bold uppercase leading-[0.95] tracking-tight sm:text-6xl">
              Sua obra, sem surpresas de custo ou prazo.
            </h1>
            <p className="max-w-md text-pretty leading-relaxed text-muted-foreground">
              Descubra em 1 minuto o investimento ideal para o seu projeto.
            </p>

            <div className="flex flex-col gap-3 pt-2">
              <button
                onClick={onStart}
                className="group inline-flex w-full items-center justify-center gap-3 rounded-md bg-primary px-8 py-5 font-display text-lg font-semibold uppercase tracking-wide text-primary-foreground transition-colors hover:bg-primary/90 sm:w-auto"
              >
                Iniciar minha proposta personalizada
                <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
              </button>
              <span className="font-mono text-xs text-muted-foreground">
                Leva menos de 1 minuto. Sem compromisso.
              </span>
            </div>
          </div>

          {/* convite sutil e opcional pra quem quiser ler mais antes de decidir */}
          <button
            onClick={() => {
              clarityEvent("intro_saiba_mais_click")
              document.getElementById("intro-confianca")?.scrollIntoView({ behavior: "smooth" })
            }}
            className="mx-auto mb-2 flex flex-col items-center gap-1 text-muted-foreground/70 transition-colors hover:text-muted-foreground"
          >
            <span className="font-mono text-[0.6rem] uppercase tracking-[0.2em]">Saiba mais</span>
            <ChevronDown className="size-4 animate-bounce" />
          </button>
        </div>
      </section>

      {/* bloco de confiança — opcional, só pra quem decidir rolar */}
      <section
        id="intro-confianca"
        className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-5 py-16 sm:px-8"
      >
        <p className="text-pretty font-serif text-2xl italic leading-snug sm:text-3xl">
          &ldquo;Cada obra carrega o sonho de uma família.&rdquo;
        </p>
        <p className="text-pretty leading-relaxed text-muted-foreground">
          Sabemos o peso de confiar a alguém o lugar onde a sua vida vai
          acontecer. Por isso tratamos cada projeto como se fosse o nosso: com
          transparência, prazo respeitado e acabamento impecável. Conte pra
          gente o que você imagina — em menos de um minuto preparamos uma
          proposta feita só para você.
        </p>
      </section>
    </div>
  )
}
