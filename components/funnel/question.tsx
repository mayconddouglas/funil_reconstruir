"use client"

import { ArrowLeft, Check } from "lucide-react"
import type { Step } from "@/lib/funnel"

type QuestionProps = {
  step: Step
  current: number
  total: number
  selected?: string
  onSelect: (value: string) => void
  onBack: () => void
}

export function Question({
  step,
  current,
  total,
  selected,
  onSelect,
  onBack,
}: QuestionProps) {
  const progress = Math.round((current / total) * 100)

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col px-5 py-8 sm:px-8">
      {/* topo: voltar + progresso */}
      <header className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Voltar
          </button>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {step.index} / {String(total).padStart(2, "0")}
          </span>
        </div>
        <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      {/* pergunta */}
      <div className="flex flex-1 flex-col justify-center gap-8 py-10">
        <div className="flex flex-col gap-3">
          <h2 className="text-balance font-display text-4xl font-bold uppercase leading-[0.95] tracking-tight sm:text-5xl">
            {step.question}
          </h2>
          {step.helper && (
            <p className="text-pretty leading-relaxed text-muted-foreground">
              {step.helper}
            </p>
          )}
        </div>

        {/* opções */}
        <div className="flex flex-col gap-3">
          {step.choices.map((choice) => {
            const isSelected = selected === choice.value
            return (
              <button
                key={choice.value}
                onClick={() => onSelect(choice.value)}
                className={`group flex items-center justify-between gap-4 rounded-md border px-5 py-4 text-left transition-all ${
                  isSelected
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card hover:border-primary/50 hover:bg-card/80"
                }`}
              >
                <span className="flex flex-col">
                  <span className="font-display text-lg font-medium uppercase tracking-wide">
                    {choice.label}
                  </span>
                  {choice.hint && (
                    <span className="text-sm text-muted-foreground">
                      {choice.hint}
                    </span>
                  )}
                </span>
                <span
                  className={`flex size-6 shrink-0 items-center justify-center rounded-full border transition-colors ${
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-transparent group-hover:border-primary/50"
                  }`}
                >
                  <Check className="size-3.5" />
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
