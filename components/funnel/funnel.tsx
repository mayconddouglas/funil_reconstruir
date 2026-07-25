"use client"

import { useState } from "react"
import { CheckCircle2, MessageCircle } from "lucide-react"
import { STEPS, buildWhatsappUrl, type Answers, type Contact } from "@/lib/funnel"
import { Intro } from "./intro"
import { Question } from "./question"
import { ContactStep } from "./contact"

// -1 = intro | 0..STEPS.length-1 = perguntas | STEPS.length = contato | "done"
type Screen = number | "done"

export function Funnel() {
  const [screen, setScreen] = useState<Screen>(-1)
  const [answers, setAnswers] = useState<Answers>({})
  const [waUrl, setWaUrl] = useState("")

  function selectAnswer(stepId: string, value: string, stepIndex: number) {
    setAnswers((prev) => ({ ...prev, [stepId]: value }))
    // pequeno atraso para o usuário ver a seleção antes de avançar
    setTimeout(() => setScreen(stepIndex + 1), 220)
  }

  function handleContact(contact: Contact) {
    const url = buildWhatsappUrl(answers, contact)
    setWaUrl(url)
    setScreen("done")
    // abre o WhatsApp automaticamente
    window.open(url, "_blank", "noopener,noreferrer")
  }

  if (screen === -1) {
    return <Intro onStart={() => setScreen(0)} />
  }

  if (screen === "done") {
    return (
      <div className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col items-center justify-center gap-8 px-5 py-8 text-center sm:px-8">
        <CheckCircle2 className="size-16 text-primary" />
        <div className="flex flex-col gap-3">
          <h2 className="text-balance font-display text-4xl font-bold uppercase leading-[0.95] tracking-tight sm:text-5xl">
            Pronto! Já é com a gente
          </h2>
          <p className="text-pretty leading-relaxed text-muted-foreground">
            Abrimos uma conversa no WhatsApp com o resumo da sua obra. Nossa
            equipe aqui em Recife já vai te responder. Se a conversa não abrir
            sozinha, é só tocar no botão abaixo.
          </p>
        </div>
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-3 rounded-md bg-primary px-8 py-5 font-display text-lg font-semibold uppercase tracking-wide text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <MessageCircle className="size-5" />
          Abrir conversa no WhatsApp
        </a>
      </div>
    )
  }

  if (screen === STEPS.length) {
    return (
      <ContactStep
        total={STEPS.length}
        onBack={() => setScreen(STEPS.length - 1)}
        onSubmit={handleContact}
      />
    )
  }

  const step = STEPS[screen]
  return (
    <Question
      step={step}
      current={screen + 1}
      total={STEPS.length}
      selected={answers[step.id]}
      onSelect={(value) => selectAnswer(step.id, value, screen)}
      onBack={() => setScreen(screen - 1)}
    />
  )
}
