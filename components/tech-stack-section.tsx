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
  { name: "Claude 3.7 Thinking", icon: Brain },
  { name: "OpenAI o-series & Codex", icon: Sparkles },
  { name: "OmniRoute AI Gateway", icon: Cpu },
  { name: "MCP Protocol & Tools", icon: Network },
  { name: "Next.js 16 / PWA", icon: Code2 },
  { name: "Docker & Coolify", icon: Server },
  { name: "Python (RPA & IA)", icon: Terminal },
  { name: "PostgreSQL & Prisma", icon: Database },
  { name: "TypeScript", icon: Code2 },
]

export function TechStackSection() {
  const { t } = useLanguage()

  const categories = [
    {
      title: t.stack.categories.aiModels,
      systemId: "SYSTEM.AI_MODELS // INFERENCE",
      icon: Brain,
      techs: [
        { name: "Claude Sonnet & Opus (Thinking)", level: 98 },
        { name: "OpenAI GPT (Codex, Sol/Terra, o-series)", level: 96 },
        { name: "Google Gemini (Ultra Context & Flash)", level: 95 },
        { name: "DeepSeek R1 & Qwen 2.5 Coder", level: 93 },
      ],
    },
    {
      title: t.stack.categories.aiTools,
      systemId: "SYSTEM.AI_GATEWAY // ORCHESTRATION",
      icon: Cpu,
      techs: [
        { name: "OmniRoute (AI Gateway & Resiliência)", level: 98 },
        { name: "MCP (Model Context Protocol & Tools)", level: 96 },
        { name: "Combos de IA (Fusion, Think & Pipelines)", level: 95 },
        { name: "Token Compression (Caveman, RTK -70%)", level: 94 },
      ],
    },
    {
      title: t.stack.categories.web,
      systemId: "SYSTEM.WEB_UI // ACTIVE",
      icon: Code2,
      techs: [
        { name: "Next.js (App Router & SSR)", level: 98 },
        { name: "PWA (Mobile/Web Offline-First)", level: 95 },
        { name: "React & TypeScript", level: 94 },
        { name: "Tailwind CSS v4 & Motion", level: 92 },
      ],
    },
    {
      title: t.stack.categories.backend,
      systemId: "SYSTEM.BACKEND // RUNNING",
      icon: Server,
      techs: [
        { name: "Node.js & Fastify (28ms Latency)", level: 94 },
        { name: "Prisma ORM & PostgreSQL", level: 92 },
        { name: "REST APIs & Integrações LDAP/ERP", level: 90 },
        { name: "Supabase & Firebase", level: 85 },
      ],
    },
    {
      title: t.stack.categories.infra,
      systemId: "SYSTEM.INFRA // READY",
      icon: Database,
      techs: [
        { name: "Docker & Docker Compose", level: 95 },
        { name: "Coolify (Self-hosting & CI/CD)", level: 92 },
        { name: "GCP BigQuery & Cloud Storage", level: 88 },
        { name: "Vitest (E2E & Testes Unitários)", level: 82 },
      ],
    },
    {
      title: t.stack.categories.automation,
      systemId: "SYSTEM.AUTO // COMPLETED",
      icon: Cog,
      techs: [
        { name: "Python (Pandas & NumPy)", level: 96 },
        { name: "PyAutoGUI & Selenium (RPA)", level: 95 },
        { name: "Agentes Autônomos & Tool Calling", level: 93 },
        { name: "Pipelines ETL & Scripting", level: 90 },
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

                {/* Lista de Tecnologias sem truncamento */}
                <div className="space-y-3 sm:space-y-3.5">
                  {category.techs.map((tech) => {
                    let mastery = "INTERMEDIATE"
                    let ledColor = "bg-purple-500 shadow-[0_0_6px_#c084fc]"
                    if (tech.level >= 95) {
                      mastery = "EXPERT"
                      ledColor = "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)]"
                    } else if (tech.level >= 90) {
                      mastery = "ADVANCED"
                      ledColor = "bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.7)]"
                    } else if (tech.level >= 80) {
                      mastery = "FLUENT"
                      ledColor = "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.7)]"
                    }

                    return (
                      <div key={tech.name} className="space-y-1 group/row">
                        <div className="flex items-center justify-between text-xs sm:text-sm gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${ledColor}`} />
                            <span className="font-semibold text-foreground/90 group-hover/row:text-primary transition-colors text-xs leading-tight">
                              {tech.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0 text-xs">
                            <span className="font-mono text-muted-foreground text-[10px] hidden sm:inline">
                              {mastery}
                            </span>
                            <span className="font-mono text-primary font-bold text-xs">
                              {tech.level}%
                            </span>
                          </div>
                        </div>
                        <div className="h-[3px] bg-secondary/80 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${tech.level}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-primary via-amber-400 to-primary/50 rounded-full"
                          />
                        </div>
                      </div>
                    )
                  })}
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
              {"// Ferramentas & Protocolos Complementares"}
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
