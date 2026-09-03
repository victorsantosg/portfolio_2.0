import * as THREE from "three"

export type ArchetypeType =
  | "wms_logistics"
  | "cloud_erp"
  | "data_analytics"
  | "ai_neural"
  | "robotics_vision"
  | "audio_hardware"
  | "b2c_webapp"

export interface HoloLayerData {
  name: string
  tech: string
  description: string
  color: string
}

export interface HoloProjectData {
  id: string
  title: string
  subtitle: string
  image: string
  archetype: ArchetypeType
  tags: string[]
  metrics: { label: string; value: string; color?: string }[]
  architecture: string
  solution: string
  ttsBriefing: string
  layers: HoloLayerData[]
  printSpecs: {
    dimensions: string
    filamentWeight: string
    layerHeight: string
    infill: string
  }
  liveDemoHref?: string
  githubHref?: string
}

export const HOLODECK_REGISTRY: Record<string, HoloProjectData> = {
  // 1. Digital Twin WMS
  wms_3d: {
    id: "wms_3d",
    title: "DIGITAL TWIN WMS // 3D COMETA",
    subtitle: "Gêmeo Digital de Armazém Logístico com 11.200 Posições Reais",
    image: "/wms-estoque-real-1.png",
    archetype: "wms_logistics",
    tags: ["Three.js", "Next.js 16", "React 19", "FEFO Algorithm", "TypeScript", "Tailwind CSS v4"],
    metrics: [
      { label: "Capacidade Modelada", value: "11.200+ Posições", color: "text-amber-400" },
      { label: "Taxa de Atualização", value: "60 FPS ao Vivo", color: "text-sky-400" },
      { label: "Precisão de Rota", value: "Curva FEFO 100%", color: "text-emerald-400" },
    ],
    architecture:
      "Three.js WebGL + Shaders customizados para renderização de estantes porta-paletes, câmaras de frios e docas com mapa de calor térmico e telemetria tridimensional.",
    solution:
      "Eliminou perdas por vencimento e otimizou rotas de empilhadeiras em armazéns de alta rotação no Cometa Supermercados.",
    ttsBriefing:
      "Iniciando Holodeck 3D: Gêmeo Digital WMS. Renderizando mais de 11 mil posições de estoque em tempo real. Observe as estantes porta-paletes multicamadas, o gradiente térmico de demanda da Curva ABC e a câmara fria automatizada.",
    layers: [
      { name: "Piso Operacional & Docas", tech: "WebGL Grid", description: "12 docas com fluxo contínuo de carretas", color: "#38bdf8" },
      { name: "Estruturas Porta-Paletes", tech: "Parametric Mesh", description: "Estantes de aço carbono com 4 níveis de altura", color: "#f59e0b" },
      { name: "Camada de Estoque & Paletes", tech: "FEFO Heatmap", description: "Gradiente térmico de data de validade por SKU", color: "#10b981" },
      { name: "Interface & Telemetria do Armazém", tech: "Live WMS Canvas", description: "Painel operacional e mapa de calor em tempo real", color: "#ec4899" },
    ],
    printSpecs: {
      dimensions: "120 x 85 x 45 mm",
      filamentWeight: "38g PLA",
      layerHeight: "0.20mm Standard",
      infill: "15% Gyroid",
    },
    liveDemoHref: "#maker-lab",
  },

  // 2. ERP Inventário
  erp: {
    id: "erp",
    title: "ERP INVENTÁRIO CORPORATIVO // FULL STACK",
    subtitle: "Sistema de Alta Concorrência para Auditoria e Gestão de Perdas",
    image: "/inventario_img_enhanced.png",
    archetype: "cloud_erp",
    tags: ["Next.js 16", "Fastify", "Prisma ORM", "PostgreSQL", "Docker", "TanStack Table"],
    metrics: [
      { label: "Latência de API", value: "28ms média", color: "text-sky-400" },
      { label: "Concorrência", value: "5.000+ Reqs/s", color: "text-amber-400" },
      { label: "Integridade de Dados", value: "100% ACID", color: "text-emerald-400" },
    ],
    architecture:
      "Backend resiliente em Node.js com Fastify e Prisma ORM para queries de altíssima velocidade em bancos PostgreSQL particionados.",
    solution:
      "Sincronização em tempo real de contagens cegas de estoque com prevenção ativa de divergências fiscais e operacionais.",
    ttsBriefing:
      "Holodeck ativado: ERP Inventário Corporativo. Analisando arquitetura em nuvem desacoplada. No topo, a interface reativa em Next.js. No centro, o gateway Fastify operando a 28 milissegundos. Na base, o cluster PostgreSQL particionado.",
    layers: [
      { name: "Camada de Banco de Dados", tech: "PostgreSQL Cluster", description: "Cluster particionado com transações estritas ACID", color: "#0284c7" },
      { name: "Motor de Cache & Filas", tech: "Redis / In-Memory", description: "Buffer de alta taxa para contagens simultâneas", color: "#ef4444" },
      { name: "Gateway de Microsserviços", tech: "Fastify + Prisma", description: "5.000 requisições por segundo com baixa latência", color: "#10b981" },
      { name: "Interface do Operador (Next.js)", tech: "Next.js 16 + React 19", description: "TanStack Virtualized Table com renderização fluida", color: "#38bdf8" },
    ],
    printSpecs: {
      dimensions: "70 x 70 x 110 mm",
      filamentWeight: "52g PLA+",
      layerHeight: "0.16mm Fine",
      infill: "20% Grid",
    },
    liveDemoHref: "https://github.com/victorsantosg/erp-ui",
    githubHref: "https://github.com/victorsantosg/erp-ui",
  },

  // 3. Portal do Lojista
  bi: {
    id: "bi",
    title: "PORTAL DO LOJISTA // BI & ANALYTICS",
    subtitle: "Plataforma Centralizada de Inteligência de Vendas e Operação B2B",
    image: "/portal-lojista.png",
    archetype: "data_analytics",
    tags: ["Next.js 16", "Prisma ORM", "PostgreSQL", "Tailwind CSS v4", "Docker"],
    metrics: [
      { label: "Lojas Conectadas", value: "50+ Filiais", color: "text-sky-400" },
      { label: "Atualização", value: "Tempo Real", color: "text-emerald-400" },
      { label: "Volume Analítico", value: "Milhões de Linhas", color: "text-amber-400" },
    ],
    architecture:
      "Data pipeline de extração e agregação em PostgreSQL estruturando transações diárias de venda e fluxo de caixa para lojistas parceiros.",
    solution:
      "Substituiu relatórios manuais em planilhas por dashboards dinâmicos acessíveis por qualquer dispositivo com autenticação criptografada.",
    ttsBriefing:
      "Holodeck ativado: Portal do Lojista. Visualizando matriz analítica tridimensional. Os pilares holográficos representam volumes de venda consolidados por filial, com agregação contínua de métricas de faturamento.",
    layers: [
      { name: "Pilar de Origem de Dados", tech: "PostgreSQL Aggregates", description: "Pipelines de agregação rápida em bancos transacionais", color: "#3b82f6" },
      { name: "Cubo Multidimensional OLAP", tech: "Analytical Cache", description: "Pré-cálculo de curvas de vendas e margens", color: "#f59e0b" },
      { name: "Matriz de Visualização 3D", tech: "Dynamic Charts", description: "Gráficos de barras volumétricas com gradiente de metas", color: "#10b981" },
      { name: "Interface do Lojista (BI)", tech: "Dashboard B2B", description: "Painel de controle com faturamento e metas em tempo real", color: "#38bdf8" },
    ],
    printSpecs: {
      dimensions: "80 x 80 x 60 mm",
      filamentWeight: "35g PETG",
      layerHeight: "0.20mm Standard",
      infill: "15% Gyroid",
    },
    liveDemoHref: "https://github.com/victorsantosg/portal_Logista",
    githubHref: "https://github.com/victorsantosg/portal_Logista",
  },

  // 4. Gestão de Projetos & Mapa de Calor
  projects: {
    id: "projects",
    title: "GESTAO DE PROJETOS // MAPA DE CALOR",
    subtitle: "Monitoramento Espacial e Territorial com Mapas e Indicadores",
    image: "/mapa_calor_img_enhanced.png",
    archetype: "data_analytics",
    tags: ["Next.js 16", "Supabase", "Prisma", "Recharts", "React Simple Maps"],
    metrics: [
      { label: "Cobertura Geográfica", value: "Nacional", color: "text-emerald-400" },
      { label: "Tempo de Resposta", value: "35ms", color: "text-sky-400" },
      { label: "Indicadores", value: "KPIs Dinâmicos", color: "text-amber-400" },
    ],
    architecture:
      "Integração de dados geoespaciais em tempo real com mapas temáticos vetoriais e gráficos analíticos de avanço de metas.",
    solution:
      "Permite tomadas de decisão táticas baseadas na densidade regional de implantações e status de projetos.",
    ttsBriefing:
      "Holodeck ativado: Gestão de Projetos com Mapa de Calor. Observe a matriz de coordenadas espaciais e a distribuição de calor térmico dos projetos em andamento.",
    layers: [
      { name: "Camada de Coordenadas Geográficas", tech: "GeoJSON / Spatial", description: "Malha de polígonos territoriais e pontos de filiais", color: "#06b6d4" },
      { name: "Motor de Densidade Térmica", tech: "Heat Intensity Shaders", description: "Algoritmo de interpolação por gravidade de demanda", color: "#ef4444" },
      { name: "Barramento Supabase", tech: "Realtime WebSockets", description: "Sincronização instantânea de status de tarefas", color: "#10b981" },
      { name: "Cockpit Executivo (Mapa de Calor)", tech: "Recharts & Next.js", description: "Resumo executivo de prazos e alocação de equipes", color: "#38bdf8" },
    ],
    printSpecs: {
      dimensions: "90 x 90 x 40 mm",
      filamentWeight: "32g PLA",
      layerHeight: "0.20mm Standard",
      infill: "15% Honeycomb",
    },
    liveDemoHref: "https://github.com/victorsantosg/projectGestao",
    githubHref: "https://github.com/victorsantosg/projectGestao",
  },

  // 5. Laudo Técnico / Ouvidoria
  laudo: {
    id: "laudo",
    title: "OUVIDORIA & LAUDO TÉCNICO // NPS",
    subtitle: "Gestão de Ocorrências Administrativas e Satisfação do Cliente",
    image: "/ouvidoria.png",
    archetype: "cloud_erp",
    tags: ["Next.js 16", "React 19", "Prisma ORM", "PostgreSQL", "Tailwind CSS v4"],
    metrics: [
      { label: "Tempo de Resolução", value: "-65%", color: "text-emerald-400" },
      { label: "Anexos e Fotos", value: "Armazenamento Seguro", color: "text-sky-400" },
      { label: "Auditoria", value: "100% Rastreável", color: "text-amber-400" },
    ],
    architecture:
      "Workflow de atendimento com assinatura de tickets, upload de evidências fotográficas e notificações automáticas aos gestores.",
    solution:
      "Centralizou o fluxo de reclamações e laudos técnicos que antes se perdiam em e-mails e aplicativos de mensagem.",
    ttsBriefing:
      "Holodeck: Sistema de Ouvidoria e Laudo Técnico. Demonstração da esteira de atendimento. Os módulos representam o pipeline de entrada do ticket, a validação de evidências fotográficas e o laudo com assinatura digital.",
    layers: [
      { name: "Módulo de Entrada e Tickets", tech: "REST API", description: "Recepção pública com captcha e sanitização estrita", color: "#38bdf8" },
      { name: "Armazenamento de Evidências", tech: "Blob Storage", description: "Criptografia de ponta a ponta para imagens e laudos", color: "#6366f1" },
      { name: "Motor de Triagem & SLA", tech: "Prisma Engine", description: "Contagem regressiva de prazos e escalonamento", color: "#f59e0b" },
      { name: "Portal de Laudo & Assinatura", tech: "Digital Signatures", description: "Emissão de laudo final homologado em PDF", color: "#10b981" },
    ],
    printSpecs: {
      dimensions: "65 x 65 x 95 mm",
      filamentWeight: "40g PLA",
      layerHeight: "0.20mm Standard",
      infill: "15% Grid",
    },
    liveDemoHref: "https://github.com/victorsantosg/nps_solares",
    githubHref: "https://github.com/victorsantosg/nps_solares",
  },

  // 6. RPA Monitoramento & Telemetria
  rpa: {
    id: "rpa",
    title: "MONITORAMENTO & TELEMETRIA // RPA",
    subtitle: "Supervisão Contínua de Robôs e Filas de Processos Corporativos",
    image: "/monitoramento_img_enhanced.png",
    archetype: "robotics_vision",
    tags: ["Next.js 16", "PostgreSQL", "Tailwind CSS v4", "SWR", "Docker"],
    metrics: [
      { label: "Uptime do Sistema", value: "99.9%", color: "text-emerald-400" },
      { label: "Intervalo de Polling", value: "2 segundos", color: "text-sky-400" },
      { label: "Alertas Automáticos", value: "Push / Telegram", color: "text-amber-400" },
    ],
    architecture:
      "Dashboard de telemetria com cache reativo SWR conectado aos logs de execução de robôs de automação em tempo real.",
    solution:
      "Detecta anomalias e falhas de integração instantaneamente, enviando alertas antes que afetem a operação de faturamento.",
    ttsBriefing:
      "Holodeck: Sistema de Monitoramento e Telemetria de RPA. O modelo 3D projeta a torre de escaneamento de robôs, emitindo feixes de verificação contínua nos nós de execução operacional.",
    layers: [
      { name: "Nós de Execução de Robôs", tech: "Worker Daemons", description: "Instâncias autônomas de automação em segundo plano", color: "#f97316" },
      { name: "Feixe de Telemetria e Pulso", tech: "Heartbeat SWR", description: "Ping a cada 2 segundos com detecção de timeout", color: "#38bdf8" },
      { name: "Fila de Triagem de Alertas", tech: "Redis Queue", description: "Disparo imediato de notificações críticas", color: "#ef4444" },
      { name: "Painel de Comando (Dashboard)", tech: "Next.js Dashboard", description: "Visão consolidada com métricas de taxa de sucesso", color: "#10b981" },
    ],
    printSpecs: {
      dimensions: "75 x 75 x 100 mm",
      filamentWeight: "44g PLA",
      layerHeight: "0.16mm Fine",
      infill: "20% Gyroid",
    },
    liveDemoHref: "https://github.com/victorsantosg/Monitoramento",
    githubHref: "https://github.com/victorsantosg/Monitoramento",
  },

  // 7. Barbearia Dom Barbeiro
  barber: {
    id: "barber",
    title: "DOM BARBEIRO // AGENDAMENTO FULL STACK",
    subtitle: "Aplicação Completa de Agendamento, Catálogo e Gestão de Serviços",
    image: "/barbearia.png",
    archetype: "b2c_webapp",
    tags: ["React", "Node.js", "Express", "PostgreSQL", "Supabase"],
    metrics: [
      { label: "Tempo de Agendamento", value: "Menos de 30s", color: "text-emerald-400" },
      { label: "Conveniência", value: "Mobile First", color: "text-sky-400" },
      { label: "Taxa de No-Show", value: "-40%", color: "text-amber-400" },
    ],
    architecture:
      "Arquitetura cliente-servidor responsiva com sincronização de horários de barbeiros e confirmações automáticas.",
    solution:
      "Eliminou agendamentos conflitantes e otimizou a taxa de ocupação das cadeiras da barbearia.",
    ttsBriefing:
      "Holodeck: Dom Barbeiro. Camada de interface mobile desacoplada com agendamento em tempo real. Observe as lâminas do card digital representando a experiência do cliente e a sincronização com o banco de horários.",
    layers: [
      { name: "Banco de Disponibilidade", tech: "PostgreSQL", description: "Slots de horários atômicos para evitar concorrência dupla", color: "#38bdf8" },
      { name: "API de Agendamento", tech: "Node.js / Express", description: "Regras de negócio de serviços e cálculo de durações", color: "#f59e0b" },
      { name: "Interface Web & Mobile", tech: "React + Tailwind", description: "Fluxo simplificado em 3 passos com confirmação", color: "#10b981" },
    ],
    printSpecs: {
      dimensions: "70 x 70 x 50 mm",
      filamentWeight: "28g PLA",
      layerHeight: "0.20mm Standard",
      infill: "15% Grid",
    },
    liveDemoHref: "https://dombarbeiro.vercel.app",
    githubHref: "https://github.com/victorsantosg/domBarbeiro",
  },

  // 8. Catálogo Bosch ECU
  ecu: {
    id: "ecu",
    title: "CATÁLOGO BOSCH // DIAGNÓSTICO ECU",
    subtitle: "Software Desktop de Consulta Técnica Automotiva e Pinagens",
    image: "https://w7.pngwing.com/pngs/815/780/png-transparent-workshop-mechanic-logo-automobile-repair-shop-graphic-design-tokheim-white-text-hand.png",
    archetype: "audio_hardware",
    tags: ["Python", "CustomTkinter", "SQLite3", "Bcrypt"],
    metrics: [
      { label: "Bancos de Módulos", value: "Centenas de ECUs", color: "text-amber-400" },
      { label: "Busca Rápida", value: "Instantânea", color: "text-sky-400" },
      { label: "Segurança de Acesso", value: "Bcrypt Hashing", color: "text-emerald-400" },
    ],
    architecture:
      "Aplicação de desktop em Python com interface moderna CustomTkinter e banco embarcado SQLite3 para consulta offline de diagramas eletrônicos.",
    solution:
      "Agilizou o trabalho de mecânicos e reparadores na identificação de sensores e atuadores veiculares.",
    ttsBriefing:
      "Holodeck: Catálogo Bosch de ECUs automotivas. O modelo representa a carcaça de um módulo de controle eletrônico com circuitos integrados e barramento de injeção direta.",
    layers: [
      { name: "Chassi Blindado da ECU", tech: "Solid Hardware Housing", description: "Blindagem de alumínio fundido com aletas de resfriamento", color: "#64748b" },
      { name: "Placa Eletrônica Principal", tech: "PCB Multi-Layer", description: "Trilhas de alta condutividade e microcontroladores", color: "#10b981" },
      { name: "Conector de Pinagem Chicote", tech: "Automotive Pinout", description: "Pinos de diagnóstico de sensores analógicos e CAN bus", color: "#f59e0b" },
      { name: "Interface de Diagnóstico", tech: "CustomTkinter GUI", description: "Consulta e visualização de diagramas eletrônicos", color: "#38bdf8" },
    ],
    printSpecs: {
      dimensions: "100 x 70 x 30 mm",
      filamentWeight: "46g PLA",
      layerHeight: "0.20mm Standard",
      infill: "20% Honeycomb",
    },
    liveDemoHref: "https://github.com/victorsantosg/cat-logo_bosch",
    githubHref: "https://github.com/victorsantosg/cat-logo_bosch",
  },

  // 9. Drum Machine 3.0
  drum: {
    id: "drum",
    title: "DRUM MACHINE 3.0 // SINTETIZADOR & ÁUDIO",
    subtitle: "Sequenciador Rítmico Digital com Síntese Sonora em Baixa Latência",
    image: "https://i.ibb.co/cKHSvNL5/Drum-Machine-Victor-S.jpg",
    archetype: "audio_hardware",
    tags: ["Python", "Tkinter", "Pygame", "Sounddevice", "SQLite3"],
    metrics: [
      { label: "Canais de Sequenciamento", value: "16 Steps", color: "text-pink-400" },
      { label: "Latência de Áudio", value: "< 12ms", color: "text-sky-400" },
      { label: "Banco de Timbres", value: "Bateria Analógica", color: "text-amber-400" },
    ],
    architecture:
      "Motor de áudio com buffers circulares de baixa latência em Python usando Sounddevice e Pygame para sequenciamento polifônico.",
    solution:
      "Possibilita a criação de batidas e loops rítmicos de alta precisão temporal com salvamento de presets em banco de dados.",
    ttsBriefing:
      "Holodeck: Drum Machine 3.0. Console de sintetizador com dezesseis passos luminosos. Observe a onda sonora tridimensional flutuando acima dos controles táteis de mixagem.",
    layers: [
      { name: "Gabinete & Chassi", tech: "Brushed Aluminum", description: "Base sólida de suporte com pés emborrachados", color: "#334155" },
      { name: "Grade de 16 Pads Iluminados", tech: "RGB Silicone Switches", description: "Matriz de ativação rítmica com resposta visual imediata", color: "#ec4899" },
      { name: "Oscilador & Síntese Sonora", tech: "Low Latency Sounddevice", description: "Geração de ondas de áudio com síntese de graves", color: "#38bdf8" },
      { name: "Interface do Sintetizador", tech: "Tkinter Sequencer", description: "Painel de controle com waveform e controles de ganho", color: "#10b981" },
    ],
    printSpecs: {
      dimensions: "110 x 80 x 35 mm",
      filamentWeight: "48g PLA",
      layerHeight: "0.16mm Fine",
      infill: "15% Gyroid",
    },
    liveDemoHref: "https://github.com/victorsantosg/app_drum_3.0",
    githubHref: "https://github.com/victorsantosg/app_drum_3.0",
  },

  // 10. Score IA (Machine Learning)
  score_ia: {
    id: "score_ia",
    title: "SCORE IA // MACHINE LEARNING",
    subtitle: "Predição Inteligente de Score de Crédito e Risco Financeiro",
    image: "https://media.licdn.com/dms/image/v2/D4D12AQE0V7D6BeOEIg/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1732218680808?e=2147483647&v=beta&t=9m5htXuwixDTwtigui04ZDQU_4pN8fN9Byw9qeI_PVM",
    archetype: "ai_neural",
    tags: ["Python", "Scikit-Learn", "Machine Learning", "Pandas"],
    metrics: [
      { label: "Acurácia do Modelo", value: "92.4%", color: "text-emerald-400" },
      { label: "Algoritmos", value: "Random Forest & KNN", color: "text-sky-400" },
      { label: "Tempo de Inferência", value: "4ms", color: "text-amber-400" },
    ],
    architecture:
      "Pipeline completo de Machine Learning: pré-processamento de features, encoding de variáveis categóricas, validação cruzada e inferência de score.",
    solution:
      "Automatiza a tomada de decisão de concessão de crédito reduzindo significativamente as taxas de inadimplência.",
    ttsBriefing:
      "Holodeck: Rede Neural Score IA. Visualizando o grafo de decisão em múltiplas camadas. Os feixes luminosos representam a propagação das variáveis do cliente até o nó de predição de risco.",
    layers: [
      { name: "Camada de Entrada de Features", tech: "Feature Vectors (Pandas)", description: "Histórico financeiro, renda, pontualidade e dívidas", color: "#38bdf8" },
      { name: "Sinapses e Pesos Ocultos", tech: "Weighted Hidden Layers", description: "Matriz de pesos calculada via Random Forest", color: "#a855f7" },
      { name: "Nós de Ativação Não-Linear", tech: "Activation Neurons", description: "Pulsos de probabilidade ativados por gradiente", color: "#ec4899" },
      { name: "Interface do Modelo de Score", tech: "Scikit-Learn Visualizer", description: "Classificação em Bom, Regular ou Alto Risco", color: "#10b981" },
    ],
    printSpecs: {
      dimensions: "85 x 85 x 85 mm",
      filamentWeight: "42g PLA Translucent",
      layerHeight: "0.20mm Standard",
      infill: "15% Gyroid",
    },
    liveDemoHref: "https://github.com/victorsantosg/Projeto_Python_IA_Intelig-ncia_Artificial_e_Previs-es",
    githubHref: "https://github.com/victorsantosg/Projeto_Python_IA_Intelig-ncia_Artificial_e_Previs-es",
  },

  // 11. Chatbot IA GPT-4o
  chatbot_ia: {
    id: "chatbot_ia",
    title: "CHATBOT IA // ASSISTENTE GPT-4O",
    subtitle: "Assistente Conversacional com Engenharia de Prompt e Memória de Sessão",
    image: "/chatbot_ia_cover.png",
    archetype: "ai_neural",
    tags: ["Python", "Streamlit", "OpenAI SDK", "GPT-4o API", "Session State"],
    metrics: [
      { label: "Modelo Base", value: "GPT-4o Omnichannel", color: "text-emerald-400" },
      { label: "Context Window", value: "128K Tokens", color: "text-sky-400" },
      { label: "Memória", value: "Sessão Contínua", color: "text-amber-400" },
    ],
    architecture:
      "Integração direta com o modelo GPT-4o através de streaming de tokens em Python com interface reativa em Streamlit.",
    solution:
      "Proporciona atendimento interativo com retenção de contexto para resolução de dúvidas e assistência guiada.",
    ttsBriefing:
      "Holodeck: Chatbot IA com GPT-4o. Renderizando o núcleo de processamento de linguagem natural. Os anéis orbitais transmitem tokens semânticos sintetizados em respostas contextuais.",
    layers: [
      { name: "Embeddings & Tokenizador", tech: "BPE Tokenizer", description: "Conversão de texto em vetores numéricos de alta dimensão", color: "#38bdf8" },
      { name: "Atenção Multi-Head", tech: "Transformer Attention", description: "Mecanismo de ponderação contextual das mensagens anteriores", color: "#8b5cf6" },
      { name: "Motor de Geração Generativa", tech: "GPT-4o Reasoning Core", description: "Síntese de texto em tempo real com streaming", color: "#ec4899" },
      { name: "Interface de Diálogo (Streamlit)", tech: "Streamlit UI", description: "Apresentação reativa com suporte a markdown e código", color: "#10b981" },
    ],
    printSpecs: {
      dimensions: "75 x 75 x 85 mm",
      filamentWeight: "36g PLA",
      layerHeight: "0.20mm Standard",
      infill: "15% Honeycomb",
    },
    liveDemoHref: "https://github.com/victorsantosg/CHAT_BOT_COM_IA",
    githubHref: "https://github.com/victorsantosg/CHAT_BOT_COM_IA",
  },

  // 12. Automação OpenCV & PyAutoGUI
  pyautogui_opencv: {
    id: "pyautogui_opencv",
    title: "AUTOMAÇÃO COM VISÃO COMPUTACIONAL",
    subtitle: "Robô Autônomo com Reconhecimento de Imagens e Controle de Interface",
    image: "https://programadorviking.com.br/wp-content/uploads/2021/05/pyautogui-teclado.jpg",
    archetype: "robotics_vision",
    tags: ["Python", "PyAutoGUI", "OpenCV", "Computer Vision"],
    metrics: [
      { label: "Precisão Óptica", value: "99.8%", color: "text-emerald-400" },
      { label: "Tempo de Execução", value: "-80% tempo humano", color: "text-sky-400" },
      { label: "Tolerância a Escala", value: "Template Matching", color: "text-amber-400" },
    ],
    architecture:
      "Algoritmo de correspondência de padrões visuais (Template Matching) com OpenCV acoplado ao controle de periféricos do sistema operacional.",
    solution:
      "Executa rotinas repetitivas em softwares legados sem API, eliminando erros humanos e acelerando processos.",
    ttsBriefing:
      "Holodeck: Automação com Visão Computacional. Observe a câmera de rastreamento óptico com a mira laser reconhecendo elementos de interface gráfica na tela.",
    layers: [
      { name: "Varredura de Vídeo e Tela", tech: "Frame Grabber", description: "Captura instantânea de buffers de vídeo a 30 FPS", color: "#38bdf8" },
      { name: "Processamento OpenCV", tech: "Threshold & Feature Match", description: "Isolamento de padrões visuais e botões-alvo", color: "#10b981" },
      { name: "Mira Laser de Detecção", tech: "Bounding Box Laser", description: "Cálculo de coordenadas centrais do alvo identificado", color: "#ef4444" },
      { name: "Interface de Operação Visual", tech: "Target Recognition Screen", description: "Monitoramento de cliques e execuções do robô", color: "#38bdf8" },
    ],
    printSpecs: {
      dimensions: "80 x 80 x 90 mm",
      filamentWeight: "40g PLA",
      layerHeight: "0.16mm Fine",
      infill: "20% Gyroid",
    },
    liveDemoHref: "https://github.com/victorsantosg/Automatizado_no_meu_trabalho",
    githubHref: "https://github.com/victorsantosg/Automatizado_no_meu_trabalho",
  },

  // 13. Cupons Cancelados & Relatórios Fiscais
  cupons: {
    id: "cupons",
    title: "AUDITORIA DE CUPONS CANCELADOS",
    subtitle: "Rastreamento de Desvios de PDV e Emissão Automatizada de Relatórios",
    image: "/cancelamentos.png",
    archetype: "cloud_erp",
    tags: ["Next.js 16", "React 19", "PostgreSQL", "jsPDF", "Docker"],
    metrics: [
      { label: "Prevenção de Perdas", value: "R$ Milhares/Mês", color: "text-emerald-400" },
      { label: "Geração de PDF", value: "Menos de 1s", color: "text-sky-400" },
      { label: "Auditoria por Caixa", value: "100% dos Operadores", color: "text-amber-400" },
    ],
    architecture:
      "Processamento de cupons fiscais cancelados no ERP com geração dinâmica de relatórios em PDF com tabelas analíticas e assinaturas.",
    solution:
      "Permite identificar padrões suspeitos de cancelamento nos caixas de supermercado, garantindo compliance fiscal.",
    ttsBriefing:
      "Holodeck: Auditoria de Cupons Cancelados. Sistema de segurança contra perdas no ponto de venda. Camadas de análise de logs de cancelamento e geração instantânea de relatórios fiscais.",
    layers: [
      { name: "Log de Transações de PDV", tech: "PostgreSQL Event Store", description: "Captura de todos os eventos de cancelamento de item", color: "#ef4444" },
      { name: "Motor de Detecção de Desvios", tech: "Heuristic Anomaly Engine", description: "Identificação de repetições anormais por operador", color: "#f59e0b" },
      { name: "Gerador de Relatórios Fiscais", tech: "jsPDF-AutoTable", description: "Compilação de relatórios analíticos em PDF", color: "#38bdf8" },
      { name: "Dashboard Gerencial (Auditoria)", tech: "Next.js 16 + Tailwind", description: "Painel de controle com alertas visuais imediatos", color: "#10b981" },
    ],
    printSpecs: {
      dimensions: "70 x 70 x 80 mm",
      filamentWeight: "34g PLA",
      layerHeight: "0.20mm Standard",
      infill: "15% Grid",
    },
    liveDemoHref: "https://github.com/victorsantosg/cuponsCancelados",
    githubHref: "https://github.com/victorsantosg/cuponsCancelados",
  },
}

/**
 * Returns the matching Holodeck project configuration by ID or alias,
 * preserving any custom image or title passed from caller.
 */
export function getHolodeckProject(keyOrId: string | number, fallbackProject?: any): HoloProjectData {
  const strId = String(keyOrId).toLowerCase()
  let baseProj: HoloProjectData

  // Match direct keys
  if (HOLODECK_REGISTRY[strId]) {
    baseProj = HOLODECK_REGISTRY[strId]
  } else {
    // Match numeric IDs from projects-section.tsx
    const numericMap: Record<number, string> = {
      1: "erp",
      2: "bi",
      3: "projects",
      4: "laudo",
      5: "rpa",
      6: "barber",
      7: "ecu",
      8: "drum",
      9: "bi",
      10: "pyautogui_opencv",
      11: "score_ia",
      12: "chatbot_ia",
      13: "pyautogui_opencv",
      14: "bi",
      18: "cupons",
    }

    const num = parseInt(strId, 10)
    if (!isNaN(num) && numericMap[num]) {
      baseProj = HOLODECK_REGISTRY[numericMap[num]]
    } else {
      baseProj = HOLODECK_REGISTRY.erp
    }
  }

  // Merge any dynamic properties from fallbackProject (e.g. custom image or description)
  if (fallbackProject) {
    return {
      ...baseProj,
      image: fallbackProject.image || baseProj.image,
      title: fallbackProject.title || baseProj.title,
      subtitle: fallbackProject.description || baseProj.subtitle,
    }
  }

  return baseProj
}

/**
 * Pure TypeScript STL Exporter
 * Converts any Three.js Group or Mesh hierarchy into a standard watertight ASCII STL Blob
 * ready for direct import into Bambu Studio, OrcaSlicer, PrusaSlicer, or Cura.
 */
export function exportMeshesToSTL(rootGroup: THREE.Group, modelName: string = "model"): Blob {
  let stlString = `solid ${modelName.replace(/\s+/g, "_")}\n`

  rootGroup.updateMatrixWorld(true)

  rootGroup.traverse((child) => {
    if (child instanceof THREE.Mesh && child.geometry) {
      const geom = child.geometry.clone()
      geom.applyMatrix4(child.matrixWorld)

      const nonIndexed = geom.toNonIndexed()
      const posAttr = nonIndexed.getAttribute("position")

      if (posAttr) {
        for (let i = 0; i < posAttr.count; i += 3) {
          const ax = posAttr.getX(i), ay = posAttr.getY(i), az = posAttr.getZ(i)
          const bx = posAttr.getX(i + 1), by = posAttr.getY(i + 1), bz = posAttr.getZ(i + 1)
          const cx = posAttr.getX(i + 2), cy = posAttr.getY(i + 2), cz = posAttr.getZ(i + 2)

          const vA = new THREE.Vector3(ax, ay, az)
          const vB = new THREE.Vector3(bx, by, bz)
          const vC = new THREE.Vector3(cx, cy, cz)
          const cb = new THREE.Vector3().subVectors(vC, vB)
          const ab = new THREE.Vector3().subVectors(vA, vB)
          const normal = cb.cross(ab).normalize()

          stlString += `  facet normal ${normal.x.toFixed(6)} ${normal.y.toFixed(6)} ${normal.z.toFixed(6)}\n`
          stlString += `    outer loop\n`
          stlString += `      vertex ${ax.toFixed(4)} ${ay.toFixed(4)} ${az.toFixed(4)}\n`
          stlString += `      vertex ${bx.toFixed(4)} ${by.toFixed(4)} ${bz.toFixed(4)}\n`
          stlString += `      vertex ${cx.toFixed(4)} ${cy.toFixed(4)} ${cz.toFixed(4)}\n`
          stlString += `    endloop\n`
          stlString += `  endfacet\n`
        }
      }
    }
  })

  stlString += `endsolid ${modelName.replace(/\s+/g, "_")}\n`

  return new Blob([stlString], { type: "model/stl;charset=utf-8" })
}
