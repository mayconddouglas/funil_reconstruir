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
export const STEPS: Step[] = [
  {
    id: "projeto",
    index: "01",
    question: "O que você quer construir?",
    helper: "Assim entendemos o escopo do seu projeto.",
    choices: [
      { value: "Construção do zero", label: "Construção do zero", hint: "Começar uma nova obra" },
      { value: "Reforma", label: "Reforma", hint: "Renovar um espaço existente" },
      { value: "Ampliação", label: "Ampliação", hint: "Aumentar o que já existe" },
      { value: "Ainda estou definindo", label: "Ainda estou definindo", hint: "Preciso de orientação" },
    ],
  },
  {
    id: "imovel",
    index: "02",
    question: "Qual o tipo de imóvel?",
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
    question: "Em que estágio você está?",
    helper: "Isso define a prioridade da nossa conversa.",
    choices: [
      { value: "Já tenho o projeto pronto", label: "Já tenho o projeto pronto" },
      { value: "Tenho o terreno, falta o projeto", label: "Tenho o terreno, falta o projeto" },
      { value: "Ainda estou planejando", label: "Ainda estou planejando" },
    ],
  },
  {
    id: "investimento",
    index: "04",
    question: "Qual investimento você tem em mente?",
    helper: "Ajuda a desenhar uma proposta realista para você.",
    choices: [
      { value: "Até R$ 150 mil", label: "Até R$ 150 mil" },
      { value: "R$ 150 mil a R$ 500 mil", label: "R$ 150 mil a R$ 500 mil" },
      { value: "R$ 500 mil a R$ 1 milhão", label: "R$ 500 mil a R$ 1 milhão" },
      { value: "Acima de R$ 1 milhão", label: "Acima de R$ 1 milhão" },
    ],
  },
  {
    id: "prazo",
    index: "05",
    question: "Quando pretende começar?",
    choices: [
      { value: "O quanto antes", label: "O quanto antes", hint: "Pronto para iniciar" },
      { value: "Nos próximos 3 meses", label: "Nos próximos 3 meses" },
      { value: "Daqui a 6 meses ou mais", label: "Daqui a 6 meses ou mais" },
    ],
  },
]

export type Answers = Record<string, string>

export type Contact = {
  nome: string
  whatsapp: string
  cidade: string
}

// Monta a mensagem que vai pré-preenchida no WhatsApp.
export function buildWhatsappMessage(answers: Answers, contact: Contact): string {
  const linhas = [
    "Olá! Vim pelo site da Reconstruir e quero uma proposta.",
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
