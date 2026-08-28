"use client"

export interface TourStep {
  id: string
  title: string
  subtitle: string
  targetSection: string
  narration: string
  duration: number // in milliseconds
  threePreset?: "geral" | "secos" | "frios" | "antecamara" | "docas" | "2d"
  threeLevel?: "all" | 1 | 2 | 3 | 4 | 5
}

export const TOUR_STEPS: TourStep[] = [
  {
    id: "hero",
    title: "PROTOCOLO 01 // SERVIDOR CENTRAL",
    subtitle: "Apresentação do Criador",
    targetSection: "#inicio",
    narration:
      "Iniciando protocolo de tour guiado. Bem-vindo ao portal tecnológico de Victor Santos, Arquiteto de Software Full Stack e Inteligência Artificial. Todos os subsistemas operam com 100% de estabilidade.",
    duration: 8500,
    threePreset: "geral",
  },
  {
    id: "about",
    title: "PROTOCOLO 02 // HISTÓRICO DE MISSÕES",
    subtitle: "Formação & Engenharia de Missão Crítica",
    targetSection: "#sobre",
    narration:
      "Acessando os registros de engenharia. Victor é graduado em Análise e Desenvolvimento de Sistemas pela UNIFOR e pós-graduado em Full Stack pela INFNET. Ele liderou sistemas de inventário corporativo e infraestruturas escaláveis de missão crítica.",
    duration: 10500,
  },
  {
    id: "maker_lab",
    title: "PROTOCOLO 03 // DIGITAL TWIN 3D & WMS",
    subtitle: "Modelagem de Armazém em Produção",
    targetSection: "#maker-lab",
    narration:
      "Adentrando o Maker Lab. Aqui o Criador desenvolveu o Gêmeo Digital do armazém logístico do Cometa Supermercados com mais de 11.200 posições reais de estoque, cálculo FEFO e telemetria tridimensional em tempo real.",
    duration: 12000,
    threePreset: "frios",
    threeLevel: "all",
  },
  {
    id: "projects",
    title: "PROTOCOLO 04 // GALERIA DE PROTÓTIPOS",
    subtitle: "Aplicações em Produção & Automações",
    targetSection: "#projetos",
    narration:
      "Examinando a galeria de projetos ativos. Aqui você encontra ERPs de alta disponibilidade com Fastify e Prisma, pipelines ETL inteligentes em Python e agentes de IA multimodais operando em escala.",
    duration: 10000,
  },
  {
    id: "quote",
    title: "PROTOCOLO 05 // ORÇAMENTOS & PROPOSTAS",
    subtitle: "Consultoria & Engenharia de IA",
    targetSection: "#orcamento",
    narration:
      "Finalizando a varredura nos protocolos de proposta. Você pode solicitar um diagnóstico de arquitetura com IA em tempo real ou iniciar contato direto com o Criador via WhatsApp para tirar sua ideia do papel.",
    duration: 11000,
  },
]
