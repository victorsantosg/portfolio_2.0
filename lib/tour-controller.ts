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
    subtitle: "Escaneando Credenciais Biométricas",
    targetSection: "#sobre",
    narration:
      "Escaneando credenciais biométricas de Victor Santos. Acesso Nível 4 confirmado: graduado em Análise de Sistemas pela UNIFOR e pós-graduado em Full Stack pela INFNET. Observe o crachá holográfico abrindo com o histórico de missões e certificações de engenharia.",
    duration: 12500,
  },
  {
    id: "maker_lab",
    title: "PROTOCOLO 03 // DIGITAL TWIN 3D & WMS",
    subtitle: "Materializando Gêmeo Digital no Holo-Deck",
    targetSection: "#maker-lab",
    narration:
      "Materializando o Holo-Deck 3D de projetos. Observe no holograma: este é o Gêmeo Digital do armazém logístico do Cometa Supermercados com mais de 11.200 posições reais de estoque modeladas em Three.js, cálculo automático FEFO e mapa térmico em tempo real.",
    duration: 13500,
    threePreset: "frios",
    threeLevel: "all",
  },
  {
    id: "projects",
    title: "PROTOCOLO 04 // GALERIA DE PROTÓTIPOS",
    subtitle: "Raio-X de Arquitetura no Holo-Deck",
    targetSection: "#projetos",
    narration:
      "Projetando no Holo-Deck a arquitetura do ERP de Inventário e Auditoria Corporativa. Desenvolvido com Next.js 16, Fastify e PostgreSQL, processando mais de 5.000 requisições por segundo com latência de apenas 28 milissegundos e integridade ACID.",
    duration: 13000,
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
