"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { CheckCircle2, MessageCircle } from "lucide-react"
import {
  STEPS,
  buildWhatsappUrl,
  trackWhatsappLead,
  clarityTag,
  clarityEvent,
  clarityUpgrade,
  type Answers,
  type Contact,
} from "@/lib/funnel"
import { Intro } from "./intro"
import { Question } from "./question"
import { ContactStep } from "./contact"

// -1 = intro | 0..STEPS.length-1 = perguntas | STEPS.length = contato | "done"
type Screen = number | "done"

// Direção do slide: 1 = avançando, -1 = voltando. Alimenta a animação de troca de tela.
const slideVariants = {
  enter: (direction: number) => ({ opacity: 0, x: direction > 0 ? 32 : -32 }),
  center: { opacity: 1, x: 0 },
  exit: (direction: number) => ({ opacity: 0, x: direction > 0 ? -32 : 32 }),
}

export function Funnel() {
  const [screen, setScreen] = useState<Screen>(-1)
  const [direction, setDirection] = useState(1)
  const [answers, setAnswers] = useState<Answers>({})
  const [waUrl, setWaUrl] = useState("")

  function goTo(next: Screen) {
    try {
      setDirection(typeof next === "number" && typeof screen === "number" ? (next > screen ? 1 : -1) : 1)
      setScreen(next)
    } catch (error) {
      // Falha silenciosa: nunca travar a navegação do funil por um erro
      // momentâneo de renderização (ex: transição do Framer Motion).
      console.warn("[funnel] falha ao trocar de etapa:", error)
    }
  }

  function selectAnswer(stepId?: string, value?: string, stepIndex?: number) {
    try {
      if (!stepId || value === undefined || stepIndex === undefined) return
      setAnswers((prev) => ({ ...prev, [stepId]: value }))
      // Tag filtrável ("filtros" no Clarity) + evento na timeline da gravação.
      // Nunca envia PII, só o par pergunta/resposta do funil.
      clarityTag(stepId, value)
      clarityEvent(`funil_etapa_${stepId}`)
      // pequeno atraso para o usuário ver a seleção (feedback visual) antes de avançar
      setTimeout(() => goTo(stepIndex + 1), 220)
    } catch (error) {
      console.warn("[funnel] falha ao registrar resposta:", error)
    }
  }

  function handleContact(contact?: Contact) {
    try {
      if (!contact?.nome || !contact?.whatsapp) return
      const url = buildWhatsappUrl(answers, contact)
      setWaUrl(url)
      goTo("done")
      // dispara o evento padrão "Lead" do Meta Pixel (requer NEXT_PUBLIC_META_PIXEL_ID configurado)
      trackWhatsappLead(answers, contact)
      // Clarity: marca a conversão e garante que essa sessão nunca seja
      // descartada por amostragem, mesmo em dias de tráfego alto.
      clarityEvent("lead_convertido")
      clarityUpgrade("lead convertido - contato enviado")
      // abre o WhatsApp automaticamente
      if (typeof window !== "undefined") {
        window.open(url, "_blank", "noopener,noreferrer")
      }
    } catch (error) {
      console.warn("[funnel] falha ao enviar contato:", error)
    }
  }

  const currentStep = typeof screen === "number" && screen >= 0 && screen < STEPS.length ? STEPS[screen] : undefined

  return (
    <AnimatePresence mode="wait" custom={direction} initial={false}>
      {screen === -1 && (
        <motion.div
          key="intro"
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <Intro
            onStart={() => {
              clarityEvent("funil_iniciado")
              goTo(0)
            }}
          />
        </motion.div>
      )}

      {screen === "done" && (
        <motion.div
          key="done"
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col items-center justify-center gap-8 px-5 py-8 text-center sm:px-8"
        >
          <CheckCircle2 className="size-16 text-primary" />
          <div className="flex flex-col gap-3">
            <h2 className="text-balance font-display text-4xl font-bold uppercase leading-[0.95] tracking-tight sm:text-5xl">
              Recebemos o seu pedido
            </h2>
            <p className="text-pretty leading-relaxed text-muted-foreground">
              Abrimos uma conversa no WhatsApp com o resumo do seu projeto. Se ela
              não abrir automaticamente, é só tocar no botão abaixo.
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
        </motion.div>
      )}

      {screen === STEPS.length && (
        <motion.div
          key="contact"
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <ContactStep total={STEPS.length} onBack={() => goTo(STEPS.length - 1)} onSubmit={handleContact} />
        </motion.div>
      )}

      {currentStep && typeof screen === "number" && (
        <motion.div
          key={currentStep.id}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <Question
            step={currentStep}
            current={screen + 1}
            total={STEPS.length}
            selected={answers[currentStep.id]}
            onSelect={(value) => selectAnswer(currentStep.id, value, screen)}
            onBack={() => goTo(screen - 1)}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
