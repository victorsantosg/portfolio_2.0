"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Cpu,
  Network,
  GitMerge,
  Layers,
  Zap,
  ChevronRight,
  Activity,
  CheckCircle2,
  Map,
  Shrink,
} from "lucide-react"
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
    title: "OmniRoute",
    subtitle: "Open Source AI Gateway",
    description:
      "Gateway de IA open source rodando localmente — roteamento inteligente entre Claude, GPT-5.6 Sol/Terra/Luna, Gemini e DeepSeek em uma única API universal com fallback automático e Circuit Breaker.",
    metrics: [
      { label: "Provedores Orquestrados", value: "5+" },
      { label: "Endpoint Local", value: ":20128" },
      { label: "Uptime Strategy", value: "Circuit Breaker" },
    ],
    tags: ["Claude Sonnet", "GPT-5.6 Sol", "Gemini Flash", "DeepSeek R1", "Fallback 429"],
  },
  {
    id: "fusion",
    icon: GitMerge,
    color: "from-violet-500 to-purple-600",
    glow: "shadow-[0_0_30px_rgba(167,139,250,0.35)]",
    borderHover: "hover:border-violet-400/60",
    badge: "COMBO MODE",
    title: "Fusion Mode",
    subtitle: "Execução Paralela Multi-LLM",
    description:
      "Executa múltiplos modelos em paralelo e sintetiza as respostas com uma IA Juíz de consenso — eliminando vieses de um único modelo e extraindo o raciocínio ótimo de cada especialista.",
    metrics: [
      { label: "Modelos em Paralelo", value: "3–5x" },
      { label: "Consensus Engine", value: "IA Juíz" },
      { label: "Qualidade vs Custo", value: "Otimizado" },
    ],
    tags: ["Parallel Execution", "IA Judge", "Consensus", "Best-of-N"],
  },
  {
    id: "pipeline",
    icon: Layers,
    color: "from-emerald-500 to-teal-600",
    glow: "shadow-[0_0_30px_rgba(52,211,153,0.35)]",
    borderHover: "hover:border-emerald-400/60",
    badge: "CHAIN MODE",
    title: "Pipeline Chains",
    subtitle: "Raciocínio Encadeado Multi-Etapa",
    description:
      "Encadeia 3+ etapas de raciocínio especializado entre modelos distintos — cada modelo recebe o output refinado do anterior, construindo soluções de complexidade crescente.",
    metrics: [
      { label: "Etapas Encadeadas", value: "3–5" },
      { label: "Padrão", value: "Think → Code → Review" },
      { label: "Output", value: "Produção-Ready" },
    ],
    tags: ["Step Chaining", "Refinement Loop", "Multi-Model", "Structured Output"],
  },
  {
    id: "skills",
    icon: Network,
    color: "from-amber-500 to-orange-600",
    glow: "shadow-[0_0_30px_rgba(251,191,36,0.35)]",
    borderHover: "hover:border-amber-400/60",
    badge: "MCP SERVER",
    title: "Central Skills Server",
    subtitle: "Servidor MCP Próprio com +30 Skills",
    description:
      "Servidor MCP próprio com mais de 30 skills modulares e especializadas — de RAG avançado a multi-agent orchestration, database design e frontend architecture — conectados ao Antigravity IDE.",
    metrics: [
      { label: "Skills Modulares", value: "30+" },
      { label: "Protocolo", value: "MCP" },
      { label: "Integração", value: "Antigravity IDE" },
    ],
    tags: ["RAG Patterns", "Multi-Agent", "MCP Protocol", "On-Demand Tools"],
  },
  {
    id: "graphify",
    icon: Map,
    color: "from-rose-500 to-pink-600",
    glow: "shadow-[0_0_30px_rgba(251,113,133,0.35)]",
    borderHover: "hover:border-rose-400/60",
    badge: "KNOWLEDGE GRAPH",
    title: "Graphify",
    subtitle: "Mapeamento Semântico de Código",
    description:
      "Transforma qualquer base de código em um knowledge graph persistente no Obsidian — detecta God Nodes, comunidades lógicas, fluxos críticos e dependências AST para entendimento profundo instantâneo.",
    metrics: [
      { label: "Output", value: "Obsidian Vault" },
      { label: "Análise", value: "AST + Semântica" },
      { label: "Padrão", value: "God Nodes + Communities" },
    ],
    tags: ["Knowledge Graph", "God Nodes", "AST", "Obsidian", "GraphRAG"],
  },
  {
    id: "caveman",
    icon: Shrink,
    color: "from-cyan-500 to-sky-600",
    glow: "shadow-[0_0_30px_rgba(6,182,212,0.35)]",
    borderHover: "hover:border-cyan-400/60",
    badge: "TOKEN PROTOCOL",
    title: "Caveman Protocol",
    subtitle: "Compressão de Contexto −70%",
    description:
      "Técnica de engenharia de contexto que elimina até 70% dos tokens desnecessários com preservação semântica total — comprimindo logs ruidosos, outputs verbosos e empacotando contexto cirurgicamente.",
    metrics: [
      { label: "Redução de Tokens", value: "65–75%" },
      { label: "Fidelidade Semântica", value: "100%" },
      { label: "Economia por 1M tok", value: "~$21" },
    ],
    tags: ["Token Reduction", "Log Compression", "Context Packaging", "Cost Efficiency"],
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
      className={`relative glass rounded-2xl border p-5 cursor-pointer transition-all duration-300 group overflow-hidden ${
        isActive
          ? `border-primary/60 ${node.glow}`
          : `border-border/40 ${node.borderHover}`
      }`}
    >
      {isActive && (
        <div className={`absolute inset-0 bg-gradient-to-br ${node.color} opacity-10 rounded-2xl pointer-events-none`} />
      )}

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div className={`p-2.5 rounded-xl bg-gradient-to-br ${node.color} border border-white/10`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
          <span className="text-[9px] font-mono font-bold tracking-widest text-primary/70 border border-primary/20 bg-primary/5 px-2 py-0.5 rounded-full">
            {node.badge}
          </span>
        </div>

        <h3 className="text-base font-bold text-foreground mb-0.5 group-hover:text-primary transition-colors">
          {node.title}
        </h3>
        <p className="text-[11px] text-muted-foreground font-mono mb-3">{node.subtitle}</p>

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

        <div
          className={`absolute bottom-3 right-3 transition-all duration-300 ${
            isActive ? "opacity-100" : "opacity-0 group-hover:opacity-50"
          }`}
        >
          <ChevronRight className="h-4 w-4 text-primary" />
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
          <span className="text-xs font-mono text-emerald-400 font-semibold">LIVE // OPERATIONAL</span>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Main Section ──────────────────────────────────────────────────────────────

export function AiEcosystemSection() {
  const { t } = useLanguage()
  const [activeNode, setActiveNode] = useState(ecosystemNodes[0].id)
  const activeData = ecosystemNodes.find((n) => n.id === activeNode) ?? ecosystemNodes[0]

  const tEco = (t as any).aiEcosystem ?? {
    tagline: "<AIEcosystem />",
    title: "Meu",
    titleGradient: "Ecossistema de IA",
    subtitle:
      "Não uso IA como copiloto — opero meu próprio gateway open source, orquestro 5+ modelos em paralelo e aplico técnicas de engenharia de contexto que poucos engenheiros conhecem.",
    proofTitle: "O que isso significa na prática:",
    proofs: [
      "OmniRoute local rodando em :20128 — zero dependência de um único provedor, fallback automático em rate-limit HTTP 429",
      "Fusion Mode: 3+ modelos raciocinam em paralelo, IA Juíz sintetiza o melhor — vai além do que qualquer chatbot oferece",
      "Context Engineering: 65–75% menos tokens, mesma precisão — projetos mais rápidos e econômicos",
      "Central Skills Server com +30 tools MCP prontas para qualquer stack, banco ou problema",
    ],
  }

  return (
    <section id="ecossistema-ia" className="relative py-20 md:py-28 overflow-hidden">
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
          className="glass rounded-2xl border border-primary/25 p-5 mb-12 max-w-4xl mx-auto bg-gradient-to-r from-primary/8 via-transparent to-transparent"
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
                onClick={() => setActiveNode(node.id)}
              />
            ))}
          </motion.div>

          {/* Detail */}
          <motion.div
            variants={jarvisVariants}
            custom={{ direction: "right", delay: 0.3 }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-5"
          >
            <AnimatePresence mode="wait">
              <EcosystemDetail key={activeNode} node={activeData} />
            </AnimatePresence>
          </motion.div>
        </div>

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
            {"// Clique em cada card para explorar os detalhes"}
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
