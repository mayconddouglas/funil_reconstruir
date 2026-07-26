// ================================================================
//  CONFIGURAÇÃO DO FUNIL
//  Troque o número abaixo pelo WhatsApp que deve receber os leads.
//  Formato internacional, somente dígitos: 55 (Brasil) + DDD + número.
//  Ex.: (11) 98888-7777  ->  "5511988887777"
// ================================================================
export const WHATSAPP_NUMBER = "5581987723203"

export type Choice = {
  value: string
  label: string
  hint?: string
  /** Nome do ícone (lucide-react) usado apenas na Etapa 1 do PRD. */
  icon?: string
}

export type Step = {
  id: string
  index: string // rótulo tipo "01"
  question: string
  helper?: string
  choices: Choice[]
}

// As etapas de qualificação. Cada resposta filtra o visitante
// e entra na mensagem final enviada ao WhatsApp.
// Copy alinhada ao PRD "Otimização de Funil de Conversão - Reconstruir Engenharia".
export const STEPS: Step[] = [
  {
    id: "projeto",
    index: "01",
    question: "O que você deseja construir ou transformar?",
    helper: "Assim entendemos o escopo do seu projeto.",
    choices: [
      {
        value: "Construção do zero",
        label: "Construção do zero",
        hint: "Começar uma nova obra",
        icon: "Hammer",
      },
      {
        value: "Reforma",
        label: "Reforma",
        hint: "Renovar um espaço existente",
        icon: "PaintRoller",
      },
      {
        value: "Ampliação",
        label: "Ampliação",
        hint: "Aumentar o que já existe",
        icon: "Expand",
      },
      {
        value: "Ainda estou definindo",
        label: "Ainda estou definindo",
        hint: "Preciso de orientação",
        icon: "Compass",
      },
    ],
  },
  {
    id: "imovel",
    index: "02",
    question: "Qual o perfil do seu projeto?",
    choices: [
      { value: "Residencial", label: "Residencial" },
      { value: "Comercial", label: "Comercial" },
      { value: "Corporativo", label: "Corporativo" },
      { value: "Outro", label: "Outro" },
    ],
  },
  {
    id: "estagio",
    index: "03",
    question: "Em que fase você se encontra hoje?",
    helper: "Isso define a prioridade da nossa conversa.",
    choices: [
      { value: "Tenho apenas a ideia", label: "Tenho apenas a ideia" },
      {
        value: "Tenho o terreno e preciso de projeto",
        label: "Tenho o terreno e preciso de projeto",
      },
      {
        value: "Tenho o projeto e quero orçamento para execução",
        label: "Tenho o projeto e quero orçamento para execução",
      },
      {
        value: "Obra em andamento / Reforma urgente",
        label: "Obra em andamento / Reforma urgente",
      },
    ],
  },
  {
    id: "padrao",
    index: "04",
    question: "Qual o padrão de acabamento desejado para sua obra?",
    helper: "Ajuda a desenhar uma proposta realista para você.",
    choices: [
      { value: "Padrão Premium", label: "Padrão Premium", hint: "Até R$ 500 mil" },
      { value: "Padrão Luxo", label: "Padrão Luxo", hint: "R$ 500 mil a R$ 1 milhão" },
      { value: "Padrão Extraordinário", label: "Padrão Extraordinário", hint: "Acima de R$ 1 milhão" },
      { value: "Ainda estou definindo o orçamento", label: "Ainda estou definindo o orçamento" },
    ],
  },
  {
    id: "prazo",
    index: "05",
    question: "Qual a sua urgência para o início das obras?",
    choices: [
      { value: "Imediato", label: "Imediato", hint: "Pronto para iniciar" },
      { value: "Em 3 meses", label: "Em 3 meses" },
      { value: "Apenas planejamento futuro", label: "Apenas planejamento futuro" },
    ],
  },
]

export type Answers = Record<string, string>

export type Contact = {
  nome: string
  whatsapp: string
  cidade: string
}

// ================================================================
//  VALIDAÇÃO DE WHATSAPP (BR)
//  Aceita DDD (2 dígitos) + 9 dígitos com celular começando em 9.
//  Ex.: 81 9 8772-3203 -> 11 dígitos ao todo.
// ================================================================
export function isValidBrazilianPhone(digits: string): boolean {
  if (!/^\d{11}$/.test(digits)) return false
  const ddd = Number(digits.slice(0, 2))
  const nonono = digits[2] // primeiro dígito do número, celular = 9
  if (ddd < 11 || ddd > 99) return false
  if (nonono !== "9") return false
  return true
}

// Monta a mensagem que vai pré-preenchida no WhatsApp.
// Segue o template do PRD (seção 4), citando diretamente o escopo (Etapa 1)
// e o padrão de acabamento (Etapa 4), além do resumo completo das respostas
// para o time comercial ter contexto total do lead.
export function buildWhatsappMessage(answers: Answers, contact: Contact): string {
  const escopo = answers["projeto"] ?? "projeto"
  const padrao = answers["padrao"] ?? "a definir"

  const linhas = [
    `Olá! Acabei de completar o funil da Reconstruir. Meu projeto é um(a) ${escopo} de padrão ${padrao}. Aguardo minha proposta!`,
    "",
    `*Nome:* ${contact.nome}`,
    `*Cidade:* ${contact.cidade || "-"}`,
    "",
    ...STEPS.map((s) => `*${s.question}* ${answers[s.id] ?? "-"}`),
  ]
  return linhas.join("\n")
}

export function buildWhatsappUrl(answers: Answers, contact: Contact): string {
  const text = encodeURIComponent(buildWhatsappMessage(answers, contact))
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`
}

// ================================================================
//  META PIXEL
//  Dispara o evento padrão "Lead" ao final do funil (PRD seção 4).
//  Não faz nada se o Pixel não estiver carregado na página (ex: dev local).
// ================================================================
declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
  }
}

export function trackWhatsappLead(answers: Answers, contact: Contact) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return
  window.fbq("track", "Lead", {
    content_name: "Funil Reconstruir",
    escopo: answers["projeto"],
    padrao_acabamento: answers["padrao"],
    cidade: contact.cidade || undefined,
  })
}
