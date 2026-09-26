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
    title: "PROTOCOLO 01 // SISTEMAS DE ALTA CONCORRÊNCIA",
    subtitle: "Arquitetura Full Stack & Sistemas de IA",
    targetSection: "#inicio",
    narration:
      "Iniciando telemetria e navegação guiada. Bem-vindo ao portfólio de Victor Santos, Software Engineer focado em Full Stack e Sistemas de IA. Ele projeta aplicações modernas de ponta a ponta: interfaces em Next.js, microsserviços em Fastify operando a 28 milissegundos, clusters PostgreSQL e gateways agnósticos de IA.",
    duration: 10500,
    threePreset: "geral",
  },
  {
    id: "about_corporate",
    title: "PROTOCOLO 02 // TRAJETÓRIA CORPORATIVA",
    subtitle: "Formação Técnica & Cases de Produção",
    targetSection: "#sobre",
    narration:
      "Credenciais profissionais de Victor Santos: graduado em Análise e Desenvolvimento de Sistemas pela UNIFOR e pós-graduando em Full Stack Web pela INFNET. Trajetória com cases corporativos de alta relevância no Cometa Supermercados: painéis de inventário, portais B2B e APIs analíticas para bancos de alta concorrência.",
    duration: 12500,
  },
  {
    id: "about_ai",
    title: "PROTOCOLO 03 // IA & AGENTIC SYSTEMS",
    subtitle: "Gateways Multi-Model & Engenharia de Contexto",
    targetSection: "#ecossistema-ia",
    narration:
      "Avançando para a arquitetura de IA. Victor projeta gateways agnósticos e resilientes com OmniRoute, orquestrando OpenAI, Anthropic Claude, Google Gemini e DeepSeek com fallback automático e Circuit Breaker, além de agentes conectados via protocolo MCP e redução de 70% de tokens com engenharia de contexto.",
    duration: 13500,
  },
  {
    id: "wms_3d",
    title: "PROTOCOLO 04 // GÊMEO DIGITAL WMS 3D",
    subtitle: "Materializando Armazém Logístico no Holo-Deck",
    targetSection: "#maker-lab",
    narration:
      "Materializando o Holo-Deck 3D de projetos. Observe no holograma: este é o Gêmeo Digital do armazém logístico do Cometa Supermercados com mais de 11.200 posições reais de estoque modeladas em Three.js, cálculo automático FEFO e mapa térmico em tempo real.",
    duration: 13500,
    threePreset: "frios",
    threeLevel: "all",
  },
  {
    id: "erp",
    title: "PROTOCOLO 05 // ERP INVENTÁRIO CORPORATIVO",
    subtitle: "Raio-X de Engenharia em Nuvem de Alta Concorrência",
    targetSection: "#projetos",
    narration:
      "Projetando no Holo-Deck a arquitetura do ERP de Inventário e Auditoria Corporativa. Desenvolvido com Next.js 16, Fastify e PostgreSQL, processando mais de 5.000 requisições por segundo com latência de apenas 28 milissegundos e integridade ACID.",
    duration: 13000,
  },
  {
    id: "omniroute",
    title: "PROTOCOLO 06 // OMNIROUTE OPEN SOURCE & COMBOS",
    subtitle: "Orquestração Avançada de IA, Fusion de Modelos & Economia de Tokens",
    targetSection: "#projetos",
    narration:
      "Atenção aos sensores: projetando no Holodeck o domínio e engenharia de IA de Victor no ecossistema open source OmniRoute. Ele implementa e opera este orquestrador de alto throughput para solucionar o maior pesadelo das empresas: quedas de serviço por instabilidade de provedores e custos astronômicos de tokens. Observe no holograma o motor de Combos executando a estratégia Fusion, onde múltiplos modelos operam em paralelo e uma IA Juiz sintetiza o melhor consenso técnico. Tudo isso integrado a Circuit Breakers automáticos contra erros quatrocentos e vinte e nove e ao estúdio de compressão Caveman, que reduz até setenta e cinco por cento dos tokens sem perder contexto.",
    duration: 18500,
    threePreset: "geral",
  },
  {
    id: "quote",
    title: "PROTOCOLO 07 // VISÃO GERAL & CANAL DIRETO",
    subtitle: "Apenas a Ponta do Iceberg",
    targetSection: "#orcamento",
    narration:
      "Este voo guiado foi apenas um breve resumo executivo, Senhor. O ecossistema de Victor Santos conta com diversos outros projetos complexos, sistemas em produção e dados de arquitetura. Sinta-se à vontade para vasculhar cada canto deste portfólio ou simplesmente abrir meu terminal de chat e me perguntar qualquer detalhe. E caso queira dar início a um novo projeto de alto impacto, o canal direto via WhatsApp está totalmente à sua disposição.",
    duration: 16000,
  },
]
