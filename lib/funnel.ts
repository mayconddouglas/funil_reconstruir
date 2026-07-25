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
    question: "O que você quer tirar do papel?",
    helper: "Assim entendemos o escopo da sua obra.",
    choices: [
      { value: "Construção do zero", label: "Construção do zero", hint: "Começar uma nova obra" },
      { value: "Reforma", label: "Reforma", hint: "Renovar um espaço que já existe" },
      { value: "Ampliação", label: "Ampliação", hint: "Aumentar o que já tenho" },
      { value: "Ainda estou definindo", label: "Ainda estou definindo", hint: "Preciso de orientação" },
    ],
  },
  {
    id: "imovel",
    index: "02",
    question: "É pra qual tipo de imóvel?",
    choices: [
      { value: "Casa", label: "Casa" },
      { value: "Apartamento", label: "Apartamento" },
      { value: "Comercial / Loja", label: "Comercial / Loja" },
      { value: "Outro", label: "Outro" },
    ],
  },
  {
    id: "local",
    index: "03",
    question: "Onde vai ser a obra?",
    helper: "Atendemos toda a Região Metropolitana do Recife.",
    choices: [
      { value: "Recife", label: "Recife" },
      { value: "Jaboatão / Olinda / Paulista", label: "Jaboatão, Olinda ou Paulista" },
      { value: "Litoral (Porto de Galinhas, praias)", label: "Litoral (Porto de Galinhas e praias)" },
      { value: "Outra cidade da RMR", label: "Outra cidade da RMR" },
    ],
  },
  {
    id: "estagio",
    index: "04",
    question: "Em que pé está o seu projeto?",
    helper: "Isso define a prioridade da nossa conversa.",
    choices: [
      { value: "Já tenho o projeto pronto", label: "Já tenho o projeto pronto" },
      { value: "Tenho o terreno, falta o projeto", label: "Tenho o terreno, falta o projeto" },
      { value: "Ainda estou planejando", label: "Ainda estou planejando" },
    ],
  },
  {
    id: "investimento",
    index: "05",
    question: "Qual investimento você tem em mente?",
    helper: "Ajuda a desenhar uma proposta realista pra você.",
    choices: [
      { value: "Até R$ 150 mil", label: "Até R$ 150 mil" },
      { value: "R$ 150 mil a R$ 500 mil", label: "R$ 150 mil a R$ 500 mil" },
      { value: "R$ 500 mil a R$ 1 milhão", label: "R$ 500 mil a R$ 1 milhão" },
      { value: "Acima de R$ 1 milhão", label: "Acima de R$ 1 milhão" },
    ],
  },
  {
    id: "prazo",
    index: "06",
    question: "Quando você pretende começar?",
    choices: [
      { value: "O quanto antes", label: "O quanto antes", hint: "Pronto pra iniciar" },
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
    "Olá! Vim pelo site da Reconstruir e quero um orçamento para minha obra na Região Metropolitana do Recife.",
    "",
    `*Nome:* ${contact.nome}`,
    `*Bairro/Cidade:* ${contact.cidade || "-"}`,
    "",
    ...STEPS.map((s) => `*${s.question}* ${answers[s.id] ?? "-"}`),
  ]
  return linhas.join("\n")
}

export function buildWhatsappUrl(answers: Answers, contact: Contact): string {
  const text = encodeURIComponent(buildWhatsappMessage(answers, contact))
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`
}
