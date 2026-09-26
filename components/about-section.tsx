"use client"

import { motion } from "framer-motion"
import { Award, Code, Briefcase } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"
import { jarvisVariants } from "@/lib/animations"
import { IdPassCard } from "@/components/three/id-pass-card"

export function AboutSection() {
  const { t } = useLanguage()

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
            {/* Apresentação da Trajetória Profissional */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-6 text-sm sm:text-base md:text-[16px] text-muted-foreground leading-relaxed"
            >
              <div className="glass rounded-2xl border border-border/40 p-6 space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono text-primary font-semibold uppercase tracking-wider mb-1">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span>{"// FORMAÇÃO & ESPECIALIZAÇÃO"}</span>
                </div>
                <p className="text-foreground font-semibold text-base md:text-lg leading-relaxed text-justify hyphens-auto">
                  {t.about.paragraph1}
                </p>
                <p className="text-justify hyphens-auto">
                  {t.about.paragraph2}
                </p>
              </div>

              <div className="glass rounded-2xl border border-border/40 p-6 space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-semibold uppercase tracking-wider mb-1">
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>{"// TRAJETÓRIA CORPORATIVA EM PRODUÇÃO"}</span>
                </div>
                <p className="text-justify hyphens-auto">
                  {t.about.paragraph3}
                </p>
                {t.about.paragraph4 && (
                  <p className="text-justify hyphens-auto">
                    {t.about.paragraph4}
                  </p>
                )}
              </div>

              {/* Cases de Produção Corporativa — 2 colunas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-5">
                {t.about.cometaProjects?.map((proj: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-border/40 bg-secondary/15 flex flex-col justify-between gap-2 hover:border-primary/40 hover:bg-secondary/25 transition-all duration-300 group"
                  >
                    <div>
                      <h5 className="font-semibold text-foreground text-xs sm:text-sm leading-snug group-hover:text-primary transition-colors">
                        {proj.title}
                      </h5>
                      <p className="text-[11px] sm:text-xs text-muted-foreground mt-1 leading-relaxed text-justify hyphens-auto">
                        {proj.desc}
                      </p>
                    </div>
                    <span className="text-[10px] font-mono text-primary bg-primary/10 px-2 py-0.5 rounded self-start border border-primary/20 leading-normal">
                      {proj.techs}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

