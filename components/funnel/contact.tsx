"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft, MessageCircle } from "lucide-react"
import { isValidBrazilianPhone, type Contact } from "@/lib/funnel"

type ContactStepProps = {
  total: number
  onBack: () => void
  onSubmit: (contact: Contact) => void
}

function maskPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11)
  if (digits.length <= 2) return digits
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

export function ContactStep({ total, onBack, onSubmit }: ContactStepProps) {
  const [nome, setNome] = useState("")
  const [whatsapp, setWhatsapp] = useState("")
  const [cidade, setCidade] = useState("")

  const phoneDigits = whatsapp.replace(/\D/g, "")
  const phoneValid = isValidBrazilianPhone(phoneDigits)
  const valid = nome.trim().length >= 2 && phoneValid
  const showPhoneError = phoneDigits.length === 11 && !phoneValid

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!valid) return
    onSubmit({ nome: nome.trim(), whatsapp: phoneDigits, cidade: cidade.trim() })
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col px-5 py-8 sm:px-8">
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
            Último passo
          </span>
        </div>
        <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full w-full rounded-full bg-primary" />
        </div>
      </header>

      <div className="flex flex-1 flex-col justify-center gap-8 py-10">
        <div className="flex flex-col gap-3">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-primary">
            (Quase lá)
          </span>
          <h2 className="text-balance font-display text-4xl font-bold uppercase leading-[0.95] tracking-tight sm:text-5xl">
            Para onde enviamos sua Proposta Técnica?
          </h2>
          <p className="text-pretty leading-relaxed text-muted-foreground">
            Nossos engenheiros analisarão suas respostas agora. Você receberá
            um contato humano no WhatsApp em instantes.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-2">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Seu nome
            </span>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Como podemos te chamar?"
              className="rounded-md border border-border bg-card px-4 py-3.5 text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
              WhatsApp
            </span>
            <input
              type="tel"
              inputMode="numeric"
              value={whatsapp}
              onChange={(e) => setWhatsapp(maskPhone(e.target.value))}
              placeholder="(11) 99999-9999"
              className={`rounded-md border bg-card px-4 py-3.5 text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary ${
                showPhoneError ? "border-destructive" : "border-border"
              }`}
            />
            {showPhoneError && (
              <span className="text-xs text-destructive">
                Confira o DDD e o número — o celular deve ter 9 dígitos.
              </span>
            )}
          </label>

          <label className="flex flex-col gap-2">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Cidade <span className="normal-case">(opcional)</span>
            </span>
            <input
              type="text"
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
              placeholder="Onde será a obra?"
              className="rounded-md border border-border bg-card px-4 py-3.5 text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary"
            />
          </label>

          <button
            type="submit"
            disabled={!valid}
            className="mt-2 inline-flex items-center justify-center gap-3 rounded-md bg-primary px-8 py-5 font-display text-lg font-semibold uppercase tracking-wide text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <MessageCircle className="size-5" />
            Receber proposta no WhatsApp
          </button>
          <span className="text-center font-mono text-xs text-muted-foreground">
            Leva menos de 1 minuto para receber o primeiro contato. Sem
            compromisso.
          </span>
        </form>
      </div>
    </div>
  )
}
