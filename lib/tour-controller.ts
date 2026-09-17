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
    id: "about_corporate",
    title: "PROTOCOLO 02 // HISTÓRICO DE MISSÕES",
    subtitle: "Escaneando Credenciais Biométricas",
    targetSection: "#sobre",
    narration:
      "Escaneando credenciais biométricas de Victor Santos. Acesso Nível 4 confirmado: graduado em Análise de Sistemas pela UNIFOR e pós-graduado em Full Stack pela INFNET. Observe o crachá holográfico abrindo com o histórico de missões corporativas e arquiteturas de alta concorrência entregues no Cometa Supermercados.",
    duration: 12500,
  },
  {
    id: "about_ai",
    title: "PROTOCOLO 03 // ECOSSISTEMA DE IA AGENTIC",
    subtitle: "Modelos de Fronteira & Engenharia de Contexto",
    targetSection: "#sobre",
    narration:
      "Ativando matriz de Inteligência Artificial. Victor orquestra os modelos mais potentes do mercado mundial: GPT-6 Astra, GPT-5.6 Sol e Terra, Claude Sonnet 4.6 e Claude Opus 4.6 com modo Thinking deliberativo, e Gemini 3.8 Flash com contexto ultra-longo. Isso se soma a servidores MCP ao vivo, roteamento OmniRoute, economia cirúrgica de 70% de tokens com o padrão Caveman e grafos Graphify para análise profunda de software.",
    duration: 15500,
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
    id: "quote",
    title: "PROTOCOLO 06 // VISÃO GERAL & CANAL DIRETO",
    subtitle: "Apenas a Ponta do Iceberg",
    targetSection: "#orcamento",
    narration:
      "Este voo guiado foi apenas um breve resumo executivo, Senhor. O ecossistema de Victor Santos conta com diversos outros projetos complexos, sistemas em produção e dados de arquitetura. Sinta-se à vontade para vasculhar cada canto deste portfólio ou simplesmente abrir meu terminal de chat e me perguntar qualquer detalhe. E caso queira dar início a um novo projeto de alto impacto, o canal direto via WhatsApp está totalmente à sua disposição.",
    duration: 16000,
  },
]
