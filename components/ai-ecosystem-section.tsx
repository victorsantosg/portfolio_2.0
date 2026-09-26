"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Cpu,
  Network,
  GitMerge,
  Layers,
  Zap,
  ChevronRight,
  ChevronLeft,
  Activity,
  CheckCircle2,
  Map,
  Shrink,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { useLanguage } from "@/hooks/use-language"
import { jarvisVariants } from "@/lib/animations"

// ─── Data ─────────────────────────────────────────────────────────────────────

const ecosystemNodes = [
  {
    id: "omniroute",
    icon: Cpu,
    color: "from-sky-500 to-blue-600",
    glow: "shadow-[0_0_30px_rgba(56,189,248,0.35)]",
    borderHover: "hover:border-sky-400/60",
    badge: "CORE GATEWAY",
    title: "OmniRoute AI Gateway",
    subtitle: "Gateway Multi-Model Agnóstico",
    description:
      "Gateway de IA open source rodando localmente — roteamento inteligente entre Anthropic Claude, OpenAI, Google Gemini e DeepSeek em uma única API universal com fallback automático contra rate-limits (HTTP 429) e Circuit Breaker.",
    metrics: [
      { label: "Provedores Orquestrados", value: "4+" },
      { label: "Endpoint Local", value: ":20128" },
      { label: "Estratégia de Uptime", value: "Circuit Breaker" },
    ],
    tags: ["Anthropic Claude", "OpenAI", "Google Gemini", "DeepSeek", "Circuit Breaker"],
  },
  {
    id: "skills",
    icon: Network,
    color: "from-amber-500 to-orange-600",
    glow: "shadow-[0_0_30px_rgba(251,191,36,0.35)]",
    borderHover: "hover:border-amber-400/60",
    badge: "MCP PROTOCOL",
    title: "Model Context Protocol (MCP)",
    subtitle: "Integração de Agentes com APIs & Bancos",
    description:
      "Servidores MCP conectando agentes autônomos de IA diretamente a bancos de dados PostgreSQL, sistemas de arquivos, ferramentas e APIs externas com tipagem rígida e execução segura.",
    metrics: [
      { label: "Protocolo", value: "Anthropic MCP" },
      { label: "Conexões", value: "Bancos, APIs & CLI" },
      { label: "Segurança", value: "Isolamento Estrito" },
    ],
    tags: ["MCP Protocol", "PostgreSQL", "Tool Calling", "Extensibilidade"],
  },
  {
    id: "caveman",
    icon: Shrink,
    color: "from-cyan-500 to-sky-600",
    glow: "shadow-[0_0_30px_rgba(6,182,212,0.35)]",
    borderHover: "hover:border-cyan-400/60",
    badge: "CONTEXT ENGINEERING",
    title: "Context Engineering",
    subtitle: "Otimização de Contexto e Redução de Tokens (−70%)",
    description:
      "Técnicas cirúrgicas de empacotamento de contexto que eliminam até 70% dos tokens desnecessários com 100% de preservação semântica — acelerando respostas e reduzindo custos operacionais.",
    metrics: [
      { label: "Redução de Tokens", value: "65–75%" },
      { label: "Fidelidade Semântica", value: "100%" },
      { label: "Eficiência", value: "Alta Densidade" },
    ],
    tags: ["Token Reduction", "Context Packaging", "Semantic Compression", "Cost Efficiency"],
  },
  {
    id: "pipeline",
    icon: Layers,
    color: "from-emerald-500 to-teal-600",
    glow: "shadow-[0_0_30px_rgba(52,211,153,0.35)]",
    borderHover: "hover:border-emerald-400/60",
    badge: "MULTI-AGENT",
    title: "Multi-Agent Pipelines",
    subtitle: "Execução Paralela & Síntese por Consenso",
    description:
      "Execução encadeada e paralela entre múltiplos modelos especialistas — cada modelo refinando o raciocínio do anterior com síntese por consenso para validação de lógica crítica.",
    metrics: [
      { label: "Padrão", value: "Think → Code → Validate" },
      { label: "Síntese", value: "Consenso Multi-LLM" },
      { label: "Confiabilidade", value: "Alta Precisão" },
    ],
    tags: ["Step Chaining", "Multi-Agent", "Consensus", "Pipeline Resiliente"],
  },
  {
    id: "graphify",
    icon: Map,
    color: "from-rose-500 to-pink-600",
    glow: "shadow-[0_0_30px_rgba(251,113,133,0.35)]",
    borderHover: "hover:border-rose-400/60",
    badge: "KNOWLEDGE GRAPH",
    title: "Knowledge Graphs & GraphRAG",
    subtitle: "Mapeamento Semântico de Bases de Código",
    description:
      "Transformação de repositórios em grafos de conhecimento navegáveis — detectando nós centrais, acoplamentos e fluxos críticos para análise e refatorações complexas sem perda de contexto.",
    metrics: [
      { label: "Mapeamento", value: "AST + Grafo Semântico" },
      { label: "Detecção", value: "Dependências Críticas" },
      { label: "Aplicação", value: "Auditoria & Refatoração" },
    ],
    tags: ["Knowledge Graph", "AST", "GraphRAG", "Análise de Código"],
  },
]

// ─── Card Component ────────────────────────────────────────────────────────────

function EcosystemCard({
  node,
  isActive,
  onClick,
}: {
  node: (typeof ecosystemNodes)[0]
  isActive: boolean
  onClick: () => void
}) {
  const Icon = node.icon
  return (
    <motion.div
      onClick={onClick}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`relative glass rounded-2xl border p-4 sm:p-5 cursor-pointer transition-all duration-300 group overflow-hidden flex flex-col justify-between ${
        isActive
          ? `border-primary/60 ${node.glow}`
          : `border-border/40 ${node.borderHover}`
      }`}
    >
      {isActive && (
        <div className={`absolute inset-0 bg-gradient-to-br ${node.color} opacity-10 rounded-2xl pointer-events-none`} />
      )}

      <div className="relative z-10 flex flex-col h-full justify-between gap-3">
        <div>
          <div className="flex items-start justify-between mb-2.5">
            <div className={`p-2.5 rounded-xl bg-gradient-to-br ${node.color} border border-white/10 shadow-sm`}>
              <Icon className="h-5 w-5 text-white" />
            </div>
            <span className="text-[9px] font-mono font-bold tracking-widest text-primary/80 border border-primary/25 bg-primary/8 px-2 py-0.5 rounded-full">
              {node.badge}
            </span>
          </div>

          <h3 className="text-base font-bold text-foreground mb-0.5 group-hover:text-primary transition-colors">
            {node.title}
          </h3>
          <p className="text-[11px] text-muted-foreground font-mono mb-2.5">{node.subtitle}</p>

          <div className="flex flex-wrap gap-1">
            {node.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-secondary/60 text-foreground/70 border border-border/30"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Action Button Row */}
        <div className="pt-2.5 border-t border-border/20 flex items-center justify-between">
          <span className="text-[11px] font-mono text-primary font-medium flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
            Ver tela principal
            <ChevronRight className="h-3.5 w-3.5" />
          </span>
          <span className="text-[9px] font-mono text-muted-foreground/80 sm:hidden">
            Toque para abrir
          </span>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Detail Panel ──────────────────────────────────────────────────────────────

function EcosystemDetail({ node }: { node: (typeof ecosystemNodes)[0] }) {
  const Icon = node.icon
  return (
    <motion.div
      key={node.id}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`glass rounded-2xl border border-primary/30 p-6 flex flex-col gap-5 relative overflow-hidden min-h-[400px] ${node.glow}`}
    >
      <div
        className={`absolute top-0 right-0 w-72 h-72 bg-gradient-to-br ${node.color} opacity-10 rounded-full blur-3xl pointer-events-none -mr-24 -mt-24`}
      />

      <div className="relative z-10 flex flex-col gap-5 flex-1">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${node.color} shadow-lg`}>
            <Icon className="h-7 w-7 text-white" />
          </div>
          <div>
            <div className="text-[10px] font-mono font-bold tracking-widest text-primary/80 mb-0.5">{node.badge}</div>
            <h3 className="text-xl font-bold text-foreground">{node.title}</h3>
            <p className="text-xs text-muted-foreground font-mono">{node.subtitle}</p>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed">{node.description}</p>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-3">
          {node.metrics.map((metric) => (
            <div key={metric.label} className="glass rounded-xl border border-border/40 p-3 text-center">
              <div className="text-base font-bold text-primary font-mono">{metric.value}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{metric.label}</div>
            </div>
          ))}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {node.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-mono px-2.5 py-1 rounded-full border border-primary/25 bg-primary/8 text-primary/90"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Status */}
        <div className="flex items-center gap-2 mt-auto pt-2 border-t border-border/20">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          <span className="text-xs font-mono text-emerald-400 font-semibold">STATUS: OPERATIONAL // ONLINE</span>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Main Section ──────────────────────────────────────────────────────────────

export function AiEcosystemSection() {
  const { t } = useLanguage()
  const [activeNode, setActiveNode] = useState(ecosystemNodes[0].id)
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false)
  const activeData = ecosystemNodes.find((n) => n.id === activeNode) ?? ecosystemNodes[0]

  const currentIndex = ecosystemNodes.findIndex((n) => n.id === activeNode)

  const handlePrev = useCallback(() => {
    const prevIndex = (currentIndex - 1 + ecosystemNodes.length) % ecosystemNodes.length
    setActiveNode(ecosystemNodes[prevIndex].id)
  }, [currentIndex])

  const handleNext = useCallback(() => {
    const nextIndex = (currentIndex + 1) % ecosystemNodes.length
    setActiveNode(ecosystemNodes[nextIndex].id)
  }, [currentIndex])

  const handleSelectNode = useCallback((id: string) => {
    setActiveNode(id)
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setIsMobileModalOpen(true)
    }
  }, [])

  const tEco = (t as any).aiEcosystem ?? {
    tagline: "<AIEcosystem />",
    title: "IA &",
    titleGradient: "Agentic Systems",
    subtitle:
      "Arquitetura de gateways multi-model agnósticos, conexão de agentes via MCP e engenharia de contexto para altíssima densidade de raciocínio com governança e controle de custos.",
    proofTitle: "Pilares de Engenharia de IA:",
    proofs: [
      "OmniRoute Gateway: Zero dependência de provedor único e fallback automático contra HTTP 429.",
      "Model Context Protocol (MCP): Integração padronizada de agentes com APIs, bancos PostgreSQL e ferramentas.",
      "Context Engineering: Redução cirúrgica de até 70% de tokens desnecessários com fidelidade semântica total.",
      "Multi-Agent Pipelines: Execução paralela e validação por consenso entre múltiplos modelos especialistas.",
    ],
  }

  return (
    <section id="ecossistema-ia" className="relative py-12 md:py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/15 to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,rgba(238,113,18,0.05),transparent)]" />

      <div className="relative container mx-auto px-4 md:px-6">
        {/* Header */}
        <motion.div
          variants={jarvisVariants}
          custom={{ direction: "top" }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.span
            variants={jarvisVariants}
            custom={{ direction: "scale", delay: 0.2 }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="inline-block text-primary font-mono text-sm mb-4"
          >
            {tEco.tagline}
          </motion.span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 text-balance">
            {tEco.title} <span className="text-gradient">{tEco.titleGradient}</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-pretty text-base leading-relaxed">
            {tEco.subtitle}
          </p>
        </motion.div>

        {/* Proof Points Banner */}
        <motion.div
          variants={jarvisVariants}
          custom={{ direction: "bottom", delay: 0.15 }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="glass rounded-2xl border border-primary/25 p-5 mb-8 md:mb-12 max-w-4xl mx-auto bg-gradient-to-r from-primary/8 via-transparent to-transparent"
        >
          <div className="flex items-center gap-2 mb-3">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-sm font-bold text-foreground">{tEco.proofTitle}</span>
          </div>
          <div className="grid sm:grid-cols-2 gap-2">
            {tEco.proofs.map((proof: string, i: number) => (
              <div key={i} className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground leading-relaxed">{proof}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Mobile Quick Bar */}
        <div className="lg:hidden flex items-center justify-between mb-3 px-1">
          <span className="text-xs font-mono text-muted-foreground flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Módulos de IA ({ecosystemNodes.length})
          </span>
          <button
            type="button"
            onClick={() => setIsMobileModalOpen(true)}
            className="inline-flex items-center gap-1 text-xs font-mono text-primary font-semibold border border-primary/30 bg-primary/10 hover:bg-primary/20 active:scale-95 px-2.5 py-1 rounded-lg transition-all"
          >
            <Activity className="h-3 w-3 animate-pulse" />
            Ver Tela Principal
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>

        {/* Interactive Grid + Detail */}
        <div className="grid lg:grid-cols-12 gap-6 max-w-7xl mx-auto">
          {/* Cards */}
          <motion.div
            variants={jarvisVariants}
            custom={{ direction: "left", delay: 0.2 }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3"
          >
            {ecosystemNodes.map((node) => (
              <EcosystemCard
                key={node.id}
                node={node}
                isActive={activeNode === node.id}
                onClick={() => handleSelectNode(node.id)}
              />
            ))}
          </motion.div>

          {/* Detail - Desktop Side-by-Side */}
          <motion.div
            variants={jarvisVariants}
            custom={{ direction: "right", delay: 0.3 }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="hidden lg:block lg:col-span-5"
          >
            <AnimatePresence mode="wait">
              <EcosystemDetail key={activeNode} node={activeData} />
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Mobile Detail Modal ("Tela Principal") */}
        <Dialog open={isMobileModalOpen} onOpenChange={setIsMobileModalOpen}>
          <DialogContent className="glass-amber bg-background/95 backdrop-blur-2xl border-primary/40 p-5 max-h-[88vh] overflow-y-auto w-[92vw] max-w-lg rounded-2xl">
            <DialogHeader className="text-left pb-1">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl bg-gradient-to-br ${activeData.color} shadow-lg shrink-0`}>
                  <activeData.icon className="h-6 w-6 text-white" />
                </div>
                <div className="min-w-0 flex-1 pr-6">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[9px] font-mono font-bold tracking-widest text-primary/80 border border-primary/25 bg-primary/8 px-1.5 py-0.5 rounded">
                      {activeData.badge}
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground">
                      {currentIndex + 1} de {ecosystemNodes.length}
                    </span>
                  </div>
                  <DialogTitle className="text-lg font-bold text-foreground truncate">
                    {activeData.title}
                  </DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground font-mono truncate">
                    {activeData.subtitle}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="flex flex-col gap-4 py-1">
              {/* Description */}
              <div className="bg-secondary/30 p-3 rounded-xl border border-border/30">
                <div className="text-[10px] font-mono uppercase text-muted-foreground tracking-wider mb-1">
                  Arquitetura & Operação
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {activeData.description}
                </p>
              </div>

              {/* Metrics */}
              <div>
                <div className="text-[10px] font-mono uppercase text-muted-foreground tracking-wider mb-1.5">
                  Métricas Operacionais
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {activeData.metrics.map((metric) => (
                    <div
                      key={metric.label}
                      className="glass rounded-xl border border-border/40 p-2 text-center bg-secondary/20"
                    >
                      <div className="text-sm font-bold text-primary font-mono">{metric.value}</div>
                      <div className="text-[9px] text-muted-foreground mt-0.5 leading-tight">{metric.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <div className="text-[10px] font-mono uppercase text-muted-foreground tracking-wider mb-1.5">
                  Capacidades & Tecnologias
                </div>
                <div className="flex flex-wrap gap-1">
                  {activeData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[9px] font-mono px-2 py-0.5 rounded-full border border-primary/25 bg-primary/8 text-primary/90"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between pt-2 border-t border-border/20">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                  <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                    LIVE // OPERATIONAL
                  </span>
                </div>
                <span className="text-[9px] font-mono text-primary/70">
                  TELA PRINCIPAL ATIVA
                </span>
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/30">
              <button
                type="button"
                onClick={handlePrev}
                className="flex items-center justify-center gap-1 py-2 px-3 rounded-lg border border-border/50 bg-secondary/40 text-xs font-mono text-foreground hover:bg-secondary/70 active:scale-95 transition-all cursor-pointer"
              >
                <ChevronLeft className="h-3.5 w-3.5" /> Anterior
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center justify-center gap-1 py-2 px-3 rounded-lg border border-primary/40 bg-primary/10 text-xs font-mono text-primary font-semibold hover:bg-primary/20 active:scale-95 transition-all cursor-pointer"
              >
                Próximo <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Footer CTA */}
        <motion.div
          variants={jarvisVariants}
          custom={{ direction: "bottom", delay: 0.4 }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <p className="text-xs text-muted-foreground font-mono mb-3">
            {"// Toque em cada card para abrir a tela principal com métricas"}
          </p>
          <div className="inline-flex items-center gap-2 text-xs text-primary/70 font-mono border border-primary/20 bg-primary/5 px-4 py-2 rounded-full">
            <Activity className="h-3.5 w-3.5 animate-pulse" />
            <span>TODOS OS SISTEMAS OPERACIONAIS // localhost:20128</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
