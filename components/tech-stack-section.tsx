"use client"

import { motion } from "framer-motion"
import {
  Code2,
  Server,
  Smartphone,
  Cog,
  Database,
  Cloud,
  Palette,
  Terminal,
} from "lucide-react"
import { useLanguage } from "@/hooks/use-language"
import { jarvisVariants } from "@/lib/animations"

const additionalTools = [
  { name: "Next.js / PWA", icon: Code2 },
  { name: "Docker & Compose", icon: Server },
  { name: "Coolify", icon: Cloud },
  { name: "TypeScript", icon: Code2 },
  { name: "Git & GitHub", icon: Terminal },
  { name: "Figma", icon: Palette },
]

export function TechStackSection() {
  const { t } = useLanguage()

  const categories = [
    {
      title: t.stack.categories.web,
      icon: Code2,
      techs: [
        { name: "Next.js", level: 98 },
        { name: "PWA (Mobile/Web Apps)", level: 95 },
        { name: "React & TypeScript", level: 92 },
        { name: "Tailwind CSS v4 & Motion", level: 90 },
      ],
    },
    {
      title: t.stack.categories.backend,
      icon: Server,
      techs: [
        { name: "Node.js & Fastify", level: 90 },
        { name: "Prisma ORM & PostgreSQL", level: 88 },
        { name: "REST APIs & LDAP/AD Integration", level: 88 },
        { name: "Supabase & Firebase", level: 82 },
      ],
    },
    {
      title: t.stack.categories.infra,
      icon: Database,
      techs: [
        { name: "Docker & Docker Compose", level: 95 },
        { name: "Coolify (Self-hosting & CI/CD)", level: 90 },
        { name: "GCP BigQuery & S3 Storage", level: 85 },
        { name: "Vitest (E2E & Unit Testing)", level: 80 },
      ],
    },
    {
      title: t.stack.categories.automation,
      icon: Cog,
      techs: [
        { name: "Python (Pandas & NumPy)", level: 95 },
        { name: "PyAutoGUI & Selenium (RPA)", level: 95 },
        { name: "OpenAI & LLM APIs / AI Agents", level: 90 },
        { name: "ETL & Advanced Scripting", level: 90 },
      ],
    },
  ]

  return (
    <section id="stack" className="relative py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />

      <div className="relative container mx-auto px-4 md:px-6">
        <motion.div
          variants={jarvisVariants}
          custom={{ direction: "top" }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-16"
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

        {/* Painel Dashboard 2x2 */}
        <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:gap-8 max-w-6xl mx-auto mb-12">
          {categories.map((category, catIndex) => (
            <motion.div
              key={category.title}
              variants={jarvisVariants}
              custom={{ direction: "bottom", delay: catIndex * 0.1 }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="glass rounded-2xl border border-border/40 p-3 sm:p-5 lg:p-6 flex flex-col justify-between hover:border-primary/30 transition-all duration-300 relative group overflow-hidden"
            >
              {/* Header do Servidor */}
              <div>
                <div className="flex items-center justify-between mb-3 sm:mb-6 pb-2 sm:pb-4 border-b border-border/30">
                  <div className="flex items-center gap-1.5 sm:gap-3">
                    <div className="p-1 sm:p-2 rounded-lg bg-primary/10 text-primary border border-primary/20 shrink-0">
                      <category.icon className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[10px] xs:text-xs sm:text-base text-foreground leading-tight truncate max-w-[80px] xs:max-w-none">{category.title}</h3>
                      <p className="hidden sm:block text-[10px] text-muted-foreground font-mono mt-0.5">
                        {catIndex === 0 && "SYSTEM.WEB_UI // ACTIVE"}
                        {catIndex === 1 && "SYSTEM.BACKEND // RUNNING"}
                        {catIndex === 2 && "SYSTEM.INFRA // READY"}
                        {catIndex === 3 && "SYSTEM.AUTO // COMPLETED"}
                      </p>
                    </div>
                  </div>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_var(--primary)] shrink-0" />
                </div>

                {/* Lista de Tecnologias */}
                <div className="space-y-2.5 sm:space-y-4">
                  {category.techs.map((tech) => {
                    // Determinar labels do Jarvis baseados no nível
                    let mastery = "INTERMEDIATE"
                    let ledColor = "bg-purple-500 shadow-[0_0_6px_#c084fc]"
                    if (tech.level >= 95) {
                      mastery = "EXPERT"
                      ledColor = "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"
                    } else if (tech.level >= 90) {
                      mastery = "ADVANCED"
                      ledColor = "bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.6)]"
                    } else if (tech.level >= 80) {
                      mastery = "FLUENT"
                      ledColor = "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"
                    }

                    return (
                      <div key={tech.name} className="space-y-1 group/row">
                        <div className="flex items-center justify-between text-[10px] sm:text-sm">
                          <div className="flex items-center gap-2">
                            <span className={`w-1.5 h-1.5 rounded-full ${ledColor}`} />
                            <span className="font-semibold text-foreground/90 group-hover/row:text-primary transition-colors text-[9px] xs:text-[11px] sm:text-sm truncate max-w-[70px] xs:max-w-none">{tech.name}</span>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] sm:text-xs">
                            <span className="font-mono text-muted-foreground hidden md:inline">{mastery}</span>
                            <span className="font-mono text-primary font-bold text-[9px] sm:text-xs">{tech.level}%</span>
                          </div>
                        </div>
                        <div className="h-[3px] bg-secondary/80 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${tech.level}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="h-full bg-linear-to-r from-primary to-primary/50 rounded-full"
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

        <motion.div
          variants={jarvisVariants}
          custom={{ direction: "bottom", delay: 0.4 }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-wrap items-center justify-center gap-2 sm:gap-3"
        >
          {additionalTools.map((tool, index) => (
            <motion.div
              key={tool.name}
              variants={jarvisVariants}
              custom={{ direction: "scale", delay: 0.5 + index * 0.05 }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -2 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border/50 hover:border-primary/50 transition-colors"
            >
              <tool.icon className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">{tool.name}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
