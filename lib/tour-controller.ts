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
    subtitle: "Armadura Tecnológica de Victor Santos",
    targetSection: "#inicio",
    narration:
      "Iniciando protocolo de telemetria e voo guiado. Bem-vindo ao quartel-general de Victor Santos, Arquiteto Full Stack e Engenheiro de Inteligência Artificial. Ele projeta cada sistema como quem constrói uma armadura de combate: código blindado, microsserviços ultrarrápidos e alta resiliência para suportar tráfego extremo.",
    duration: 10500,
    threePreset: "geral",
  },
  {
    id: "about",
    title: "PROTOCOLO 02 // HISTÓRICO DE MISSÕES",
    subtitle: "Engenharia de Missão Crítica & Formação",
    targetSection: "#sobre",
    narration:
      "Acessando o histórico de missões do Criador. Victor é graduado em Análise de Sistemas pela UNIFOR e pós-graduado em Full Stack pela INFNET. Ele liderou a modernização do inventário corporativo do Cometa Supermercados, eliminando distorções contábeis e conectando ERPs legados a dashboards em tempo real.",
    duration: 11500,
  },
  {
    id: "maker_lab",
    title: "PROTOCOLO 03 // DIGITAL TWIN 3D & WMS",
    subtitle: "Gêmeo Digital de Armazém em Produção",
    targetSection: "#maker-lab",
    narration:
      "Adentrando o Maker Lab e acionando sensores tridimensionais. Aqui o Senhor Victor construiu o Gêmeo Digital do armazém logístico com mais de 11.200 posições reais de estoque, cálculo dinâmico de curva de giro e shelf-life em Three.js. Um verdadeiro centro de comando holográfico em produção.",
    duration: 13000,
    threePreset: "frios",
    threeLevel: "all",
  },
  {
    id: "projects",
    title: "PROTOCOLO 04 // GALERIA DE PROTÓTIPOS",
    subtitle: "Aplicações Escaláveis, ETL & Agentes de IA",
    targetSection: "#projetos",
    narration:
      "Inspecionando os protótipos ativos de software. De plataformas SaaS completas em Next.js e Fastify a robôs de automação ETL em Python e agentes autônomos de IA integrados a modelos de linguagem. Se existe um gargalo operacional na sua empresa, o Criador projeta a solução para automatizá-lo.",
    duration: 12000,
  },
  {
    id: "quote",
    title: "PROTOCOLO 05 // ORÇAMENTO & DESPEDIDA",
    subtitle: "Canal Direto com o Criador",
    targetSection: "#orcamento",
    narration:
      "Varredura de sistemas finalizada com sucesso, Senhor. Todos os servidores operam com 100% de estabilidade e o Victor já está na terceira xícara de café. Sugiro fortemente acioná-lo no WhatsApp antes que a cafeína acabe e ele decida recodificar toda a internet.",
    duration: 12500,
  },
]
