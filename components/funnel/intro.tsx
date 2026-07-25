"use client"

import Image from "next/image"
import { ArrowRight } from "lucide-react"

const OBRAS = [
  { src: "/obras/obra-1.jpg", alt: "Área de refeições com mesa de mármore e janelão com vista para piscina e mar" },
  { src: "/obras/obra-2.jpg", alt: "Sala e cozinha integradas com acabamento de alto padrão e vista para o mar" },
  { src: "/obras/obra-3.jpg", alt: "Suíte com cabeceira sob medida e varanda com vista para o mar" },
  { src: "/obras/obra-4.jpg", alt: "Sala ampla com iluminação linear de LED embutida no teto" },
]

export function Intro({ onStart }: { onStart: () => void }) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col px-5 py-8 sm:px-8">
      {/* topo / marca */}
      <header className="flex items-center justify-between">
        <span className="font-display text-xl font-bold uppercase tracking-tight">
          Recon<span className="text-primary">struir</span>
        </span>
        <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">
          (Construção &amp; Reforma)
        </span>
      </header>

      {/* corpo */}
      <div className="flex flex-1 flex-col justify-center gap-10 py-12">
        <div className="flex flex-col gap-6">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-primary">
            (01) — Obras que duram gerações
          </span>
          <h1 className="text-balance font-display text-5xl font-bold uppercase leading-[0.92] tracking-tight sm:text-7xl">
            Do papel à realidade,
            <br />
            <span className="text-primary">sem dor de cabeça</span>
          </h1>
        </div>

        {/* faixa de fotos das obras */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {OBRAS.map((obra, i) => (
            <div
              key={obra.src}
              className="relative aspect-3/4 overflow-hidden rounded-md border border-border"
            >
              <Image
                src={obra.src || "/placeholder.svg"}
                alt={obra.alt}
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 hover:scale-105"
                priority={i === 0}
              />
            </div>
          ))}
        </div>

        {/* headline comovente + mini texto */}
        <div className="flex max-w-2xl flex-col gap-4">
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
        </div>

        {/* CTA */}
        <div className="flex flex-col gap-3">
          <button
            onClick={onStart}
            className="group inline-flex w-full items-center justify-center gap-3 rounded-md bg-primary px-8 py-5 font-display text-lg font-semibold uppercase tracking-wide text-primary-foreground transition-colors hover:bg-primary/90 sm:w-auto"
          >
            Quero minha proposta
            <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
          </button>
          <span className="font-mono text-xs text-muted-foreground">
            Leva menos de 1 minuto. Sem compromisso.
          </span>
        </div>
      </div>
    </div>
  )
}
