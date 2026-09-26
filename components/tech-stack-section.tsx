"use client"

import { motion } from "framer-motion"
import {
  Brain,
  Cpu,
  Sparkles,
  Bot,
  Network,
  Code2,
  Server,
  Database,
  Cog,
  Cloud,
  Terminal,
  Palette,
  Zap,
} from "lucide-react"
import { useLanguage } from "@/hooks/use-language"
import { jarvisVariants } from "@/lib/animations"

const additionalTools = [
  { name: "Next.js & React 19", icon: Code2 },
  { name: "TypeScript & Node.js", icon: Code2 },
  { name: "Fastify (High Concurrency)", icon: Server },
  { name: "PostgreSQL & Prisma ORM", icon: Database },
  { name: "Docker & Coolify", icon: Server },
  { name: "Python (ETL & RPA)", icon: Terminal },
  { name: "OmniRoute AI Gateway", icon: Cpu },
  { name: "Model Context Protocol (MCP)", icon: Network },
  { name: "Tailwind CSS & Three.js", icon: Palette },
]

export function TechStackSection() {
  const { t } = useLanguage()

  const categories = [
    {
      title: t.stack.categories.web,
      systemId: "SYSTEM.WEB_UI // ACTIVE",
      icon: Code2,
      techs: [
        { name: "Next.js", highlight: "App Router / SSR" },
        { name: "React 19 & TypeScript", highlight: "Interfaces Reativas" },
        { name: "Tailwind CSS v4 & Motion", highlight: "Design System Fluido" },
        { name: "PWA (Mobile & Desktop)", highlight: "Offline-First" },
      ],
    },
    {
      title: t.stack.categories.backend,
      systemId: "SYSTEM.BACKEND // RUNNING",
      icon: Server,
      techs: [
        { name: "Node.js & Fastify", highlight: "28ms Latência / Microserviços" },
        { name: "PostgreSQL & Prisma ORM", highlight: "Modelagem ACID & Partições" },
        { name: "REST APIs & Webhooks", highlight: "Integrações ERP / Auth JWT" },
        { name: "Supabase & Firebase", highlight: "BaaS & Realtime Data" },
      ],
    },
    {
      title: t.stack.categories.aiGateway,
      systemId: "SYSTEM.AI_GATEWAY // ORCHESTRATION",
      icon: Cpu,
      techs: [
        { name: "OmniRoute Gateway", highlight: "Multi-Model / Circuit Breaker" },
        { name: "Model Context Protocol (MCP)", highlight: "Conexão de Tools & DBs" },
        { name: "Context Engineering", highlight: "Token Compression (-70%)" },
        { name: "Multi-Agent Pipelines", highlight: "Orquestração & Avaliação" },
      ],
    },
    {
      title: t.stack.categories.automation,
      systemId: "SYSTEM.AUTO // COMPLETED",
      icon: Cog,
      techs: [
        { name: "Python (Pandas & NumPy)", highlight: "Processamento de Dados & ETL" },
        { name: "PyAutoGUI & Selenium", highlight: "RPA & Automação de Tarefas" },
        { name: "Scripts & Cron Jobs", highlight: "Alertas Telegram & Rotinas" },
        { name: "Auditoria & Conciliação", highlight: "Validação Cruzada de ERP" },
      ],
    },
    {
      title: t.stack.categories.infra,
      systemId: "SYSTEM.INFRA // READY",
      icon: Database,
      techs: [
        { name: "Docker & Docker Compose", highlight: "Containerização Isolada" },
        { name: "Coolify (Self-Hosting)", highlight: "CI/CD & Deploy Contínuo" },
        { name: "Linux & Bash / Shell", highlight: "Infraestrutura & Servidores" },
        { name: "Git & Versionamento", highlight: "Git Flow & Governança" },
      ],
    },
    {
      title: t.stack.categories.models,
      systemId: "SYSTEM.MODELS // ECOSYSTEM",
      icon: Brain,
      techs: [
        { name: "Anthropic Claude", highlight: "Thinking Mode & Refatoração" },
        { name: "OpenAI GPT", highlight: "Raciocínio Lógico & APIs" },
        { name: "Google Gemini", highlight: "Janelas Longas & Multimodal" },
        { name: "DeepSeek & Open Models", highlight: "Inferência de Alta Eficiência" },
      ],
    },
  ]

  return (
    <section id="stack" className="relative py-12 md:py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />

      <div className="relative container mx-auto px-4 md:px-6">
        <motion.div
          variants={jarvisVariants}
          custom={{ direction: "top" }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-16"
        >
          <motion.span
            variants={jarvisVariants}
            custom={{ direction: "scale", delay: 0.2 }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="inline-block text-primary font-mono text-sm mb-4"
          >
            {"<TechStack />"}
          </motion.span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-balance">
            {t.stack.title.split(" & ")[0]} & <span className="text-gradient">{t.stack.title.split(" & ")[1]}</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
            {t.stack.subtitle}
          </p>
        </motion.div>

        {/* Painel Dashboard 3x2 em Desktop, 2x3 em Tablet, 1 col em Mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto mb-8 sm:mb-12">
          {categories.map((category, catIndex) => (
            <motion.div
              key={category.title}
              variants={jarvisVariants}
              custom={{ direction: "bottom", delay: catIndex * 0.08 }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="glass rounded-2xl border border-border/40 p-4 sm:p-5 flex flex-col justify-between hover:border-primary/40 transition-all duration-300 relative group overflow-hidden shadow-lg"
            >
              {/* Header do Servidor / Categoria */}
              <div>
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/30">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/25 shrink-0 group-hover:bg-primary/20 transition-colors">
                      <category.icon className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-xs sm:text-sm text-foreground leading-snug break-words">
                        {category.title}
                      </h3>
                      <p className="text-[9px] sm:text-[10px] text-muted-foreground font-mono mt-0.5 tracking-wider truncate">
                        {category.systemId}
                      </p>
                    </div>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)] shrink-0 ml-2" />
                </div>

                {/* Lista de Tecnologias com foco prático (Sem porcentagens arbitrárias) */}
                <div className="space-y-2.5">
                  {category.techs.map((tech) => (
                    <div
                      key={tech.name}
                      className="group/row flex items-center justify-between py-2 px-3 rounded-xl bg-secondary/20 border border-border/30 hover:border-primary/40 hover:bg-secondary/35 transition-all duration-200"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 shadow-[0_0_8px_rgba(238,113,18,0.7)] group-hover/row:scale-125 transition-transform" />
                        <span className="font-semibold text-foreground/90 group-hover/row:text-primary transition-colors text-xs leading-tight truncate">
                          {tech.name}
                        </span>
                      </div>
                      <span className="font-mono text-[10px] text-primary/90 font-medium bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full shrink-0 ml-2">
                        {tech.highlight}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Dock Integrado de Ferramentas & Protocolos Complementares */}
        <motion.div
          variants={jarvisVariants}
          custom={{ direction: "bottom", delay: 0.3 }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="glass rounded-2xl border border-border/40 p-4 sm:p-5 max-w-4xl mx-auto shadow-lg"
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[11px] sm:text-xs font-mono font-semibold tracking-wider text-muted-foreground uppercase">
              {"// Tecnologias & Frameworks em Destaque"}
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
            {additionalTools.map((tool, index) => (
              <motion.div
                key={tool.name}
                variants={jarvisVariants}
                custom={{ direction: "scale", delay: 0.35 + index * 0.03 }}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -2 }}
                className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-full bg-secondary/80 border border-border/50 hover:border-primary/60 hover:bg-secondary transition-all shadow-sm cursor-default"
              >
                <tool.icon className="h-3.5 w-3.5 text-primary shrink-0" />
                <span className="text-[11px] sm:text-xs font-mono font-medium text-foreground/90">{tool.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
