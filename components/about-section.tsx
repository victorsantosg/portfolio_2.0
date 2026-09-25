"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Award, Code, Brain, Layers, Network, Cpu, Bot, Briefcase, Zap, CheckCircle2 } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"
import { jarvisVariants } from "@/lib/animations"
import { IdPassCard } from "@/components/three/id-pass-card"
import { cn } from "@/lib/utils"

export function AboutSection() {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState<"corporate" | "ai">("ai")

  // Escuta evento do tour para alternar abas dinamicamente
  useEffect(() => {
    const handleSwitchTab = (e: any) => {
      const targetTab = e.detail?.tab
      if (targetTab === "corporate" || targetTab === "ai") {
        setActiveTab(targetTab)
      }
    }

    window.addEventListener("switch-about-tab", handleSwitchTab)
    return () => window.removeEventListener("switch-about-tab", handleSwitchTab)
  }, [])

  const pillarIcons: Record<string, React.ReactNode> = {
    models: <Brain className="h-5 w-5 text-purple-400" />,
    prototyping: <Layers className="h-5 w-5 text-cyan-400" />,
    agents: <Network className="h-5 w-5 text-emerald-400" />,
    optimization: <Cpu className="h-5 w-5 text-amber-400" />,
  }

  return (
    <section id="sobre" className="relative py-12 md:py-24 overflow-hidden bg-background/80 backdrop-blur-[1px]">
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-secondary/10 to-background/40" />

      <div className="relative container mx-auto px-4 md:px-6">
        <motion.div
          variants={jarvisVariants}
          custom={{ direction: "top" }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-14"
        >
          <motion.span
            variants={jarvisVariants}
            custom={{ direction: "scale", delay: 0.2 }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="inline-block text-primary font-mono text-sm mb-4"
          >
            {t.about.tagline}
          </motion.span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-balance">
            {t.about.title} <span className="text-gradient">{t.about.titleGradient}</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Coluna da Esquerda: Cartão de Acesso 3D e Competências */}
          <motion.div
            variants={jarvisVariants}
            custom={{ direction: "left", delay: 0.2 }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-4 space-y-5 order-2 lg:order-1 flex flex-col items-center lg:items-start"
          >
            {/* Cartão de Acesso ID / Security Pass 3D */}
            <IdPassCard />

            {/* Cursos / Certificações */}
            <div className="space-y-4 pt-4 lg:pt-8 w-full">
              <h3 className="text-lg md:text-xl font-bold text-foreground flex items-center gap-2">
                <Award className="h-5 w-5 text-primary shrink-0" />
                {t.about.skillsTitle}
              </h3>
              {/* 1 coluna no desktop (lg), 2 colunas em telas médias */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-3">
                {t.about.skillsList.map((skill: string, index: number) => (
                  <motion.div
                    key={index}
                    whileHover={{ x: 4 }}
                    className="glass rounded-xl border border-border/30 p-3 sm:p-4 flex items-start gap-3 hover:border-primary/30 transition-all duration-300"
                  >
                    <Code className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed text-justify hyphens-auto">
                      {skill}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Coluna da Direita: Seletor em Abas + Conteúdo */}
          <motion.div
            variants={jarvisVariants}
            custom={{ direction: "right", delay: 0.3 }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-8 space-y-6 order-1 lg:order-2"
          >
            {/* Seletor de Visão / Abas Interativas HUD */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span className="uppercase tracking-wider font-semibold">{"// Alternar Visão Técnica:"}</span>
              </div>

              <div className="inline-flex flex-wrap sm:flex-nowrap items-center gap-2 p-1.5 rounded-2xl bg-secondary/25 border border-border/60 shadow-lg backdrop-blur-md w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setActiveTab("corporate")}
                  className={cn(
                    "relative px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer select-none border flex-1 sm:flex-initial",
                    activeTab === "corporate"
                      ? "bg-gradient-to-r from-[#ee7112] to-amber-500 text-black font-bold border-amber-300 shadow-[0_0_20px_rgba(238,113,18,0.45)] scale-[1.01]"
                      : "bg-white/5 border-white/10 text-foreground/85 hover:text-foreground hover:bg-white/10 hover:border-amber-500/50 hover:shadow-[0_0_12px_rgba(245,158,11,0.2)]"
                  )}
                >
                  <Briefcase className={cn("w-4 h-4 shrink-0 transition-colors", activeTab === "corporate" ? "text-black" : "text-primary")} />
                  <span className="font-semibold">{t.about.tabs?.corporate || "Carreira & Projetos Corporativos"}</span>
                  {activeTab === "corporate" ? (
                    <span className="w-1.5 h-1.5 rounded-full bg-black/80 animate-pulse ml-1" />
                  ) : (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-muted-foreground border border-white/10 hidden md:inline">Clique p/ alternar</span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("ai")}
                  className={cn(
                    "relative px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer select-none border flex-1 sm:flex-initial",
                    activeTab === "ai"
                      ? "bg-gradient-to-r from-[#ee7112] to-amber-500 text-black font-bold border-amber-300 shadow-[0_0_20px_rgba(238,113,18,0.45)] scale-[1.01]"
                      : "bg-white/5 border-white/10 text-foreground/85 hover:text-foreground hover:bg-white/10 hover:border-amber-500/50 hover:shadow-[0_0_12px_rgba(245,158,11,0.2)]"
                  )}
                >
                  <Bot className={cn("w-4 h-4 shrink-0 transition-colors", activeTab === "ai" ? "text-black" : "text-amber-400")} />
                  <span className="font-semibold">{t.about.tabs?.ai || "IA Agentic & Engenharia de Contexto"}</span>
                  {activeTab === "ai" ? (
                    <span className="w-1.5 h-1.5 rounded-full bg-black/80 animate-pulse ml-1" />
                  ) : (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-muted-foreground border border-white/10 hidden md:inline">Clique p/ alternar</span>
                  )}
                </button>
              </div>
            </div>

            {/* Conteúdo Dinâmico com Transição Suave */}
            <AnimatePresence mode="wait">
              {activeTab === "corporate" ? (
                <motion.div
                  key="corporate"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6 text-sm sm:text-base md:text-[16px] text-muted-foreground leading-relaxed"
                >
                  <div className="glass rounded-2xl border border-border/40 p-6 space-y-4">
                    <p className="text-foreground font-semibold text-base md:text-lg leading-relaxed text-justify hyphens-auto">
                      {t.about.paragraph1}
                    </p>
                    <p className="text-justify hyphens-auto">
                      {t.about.paragraph2}
                    </p>
                  </div>

                  <div className="glass rounded-2xl border border-border/40 p-6 space-y-4">
                    <p className="text-justify hyphens-auto">
                      {t.about.paragraph3}
                    </p>
                    {t.about.paragraph4 && (
                      <p className="text-justify hyphens-auto">
                        {t.about.paragraph4}
                      </p>
                    )}
                  </div>

                  {/* Projetos do Cometa — 2 colunas sempre */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-5">
                    {t.about.cometaProjects?.map((proj: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl border border-border/40 bg-secondary/10 flex flex-col justify-between gap-2 hover:border-primary/30 transition-all duration-300"
                      >
                        <div>
                          <h5 className="font-semibold text-foreground text-xs sm:text-sm leading-snug">{proj.title}</h5>
                          <p className="text-[11px] sm:text-xs text-muted-foreground mt-1 leading-relaxed text-justify hyphens-auto">{proj.desc}</p>
                        </div>
                        <span className="text-[10px] font-mono text-primary bg-primary/5 px-2 py-0.5 rounded self-start border border-primary/10 leading-normal">
                          {proj.techs}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="ai"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Banner de Apresentação da Especialização */}
                  <div className="glass rounded-2xl border border-primary/25 p-6 bg-gradient-to-br from-primary/10 via-secondary/15 to-transparent relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
                    <div className="relative z-10 space-y-2">
                      <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-mono">
                        <Zap className="w-3.5 h-3.5" />
                        <span>{t.about.aiSpecialist?.badge}</span>
                      </div>
                      <h4 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
                        {t.about.aiSpecialist?.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed text-justify hyphens-auto">
                        {t.about.aiSpecialist?.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Grid dos 4 Pilares */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {t.about.aiSpecialist?.pillars?.map((pillar: any) => (
                      <div
                        key={pillar.id}
                        className="glass rounded-2xl border border-border/40 p-5 bg-card/40 flex flex-col justify-between hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group"
                      >
                        <div>
                          {/* Cabeçalho do Pilar */}
                          <div className="flex items-center gap-3 mb-3">
                            <div className="p-2.5 rounded-xl bg-secondary/30 border border-border/50 group-hover:border-primary/40 group-hover:scale-105 transition-all duration-300">
                              {pillarIcons[pillar.id] || <Cpu className="w-5 h-5 text-primary" />}
                            </div>
                            <div>
                              <h5 className="font-semibold text-foreground text-sm sm:text-base leading-tight">
                                {pillar.title}
                              </h5>
                            </div>
                          </div>

                          <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                            {pillar.description}
                          </p>

                          {/* Itens do Pilar */}
                          <div className="space-y-3 pt-2 border-t border-border/30">
                            {pillar.items?.map((item: any, iIdx: number) => (
                              <div
                                key={iIdx}
                                className="p-3 rounded-xl border border-border/30 bg-secondary/10 hover:bg-secondary/20 hover:border-primary/20 transition-all duration-200"
                              >
                                <div className="flex items-center gap-1.5 mb-1.5">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                                  <span className="text-xs font-semibold text-foreground">
                                    {item.name}
                                  </span>
                                </div>

                                <p className="text-[11px] text-muted-foreground leading-relaxed text-justify hyphens-auto mb-2">
                                  {item.detail}
                                </p>

                                <div className="flex flex-wrap gap-1.5">
                                  {item.tags?.map((tag: string, tIdx: number) => (
                                    <span
                                      key={tIdx}
                                      className="text-[10px] font-mono px-2 py-0.5 rounded-md border border-primary/20 bg-primary/5 text-primary/90"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

