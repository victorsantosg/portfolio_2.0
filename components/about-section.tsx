"use client"

import { motion } from "framer-motion"
import { GraduationCap, Code, Award } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"
import { jarvisVariants } from "@/lib/animations"

export function AboutSection() {
  const { t } = useLanguage()

  return (
    <section id="sobre" className="relative py-20 md:py-28 overflow-hidden bg-background">
      <div className="absolute inset-0 bg-linear-to-b from-background via-secondary/10 to-background" />

      <div className="relative container mx-auto">
        <motion.div
          variants={jarvisVariants}
          custom={{ direction: "top" }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
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
          {/* Coluna da Esquerda: Contato e Formação */}
          <motion.div
            variants={jarvisVariants}
            custom={{ direction: "left", delay: 0.2 }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-4 space-y-5 order-2 lg:order-1"
          >
            {/* Card de Formação Acadêmica */}
            <div className="glass rounded-2xl border border-border/50 p-5 sm:p-6">
              <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary shrink-0" />
                Formação Acadêmica
              </h4>
              <ul className="space-y-4 text-sm">
                <li className="relative pl-4 before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-primary/60">
                  <p className="font-medium text-foreground leading-snug">Graduação em Análise e Desenvolvimento de Sistemas</p>
                  <p className="text-xs text-muted-foreground mt-0.5">UNIFOR (Universidade de Fortaleza)</p>
                </li>
                <li className="relative pl-4 before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-primary/60">
                  <p className="font-medium text-foreground leading-snug">Pós-Graduação em Dev Web Full Stack</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Faculdade INFNET (Concluído)</p>
                </li>
              </ul>
            </div>

            {/* Cursos / Certificações (Movido para a coluna da esquerda) */}
            <div className="space-y-4 pt-4 lg:pt-8">
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

          {/* Coluna da Direita: Trajetória e Cursos */}
          <motion.div
            variants={jarvisVariants}
            custom={{ direction: "right", delay: 0.3 }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-8 space-y-7 order-1 lg:order-2"
          >
            {/* Trajetória estruturada em Cards */}
            <div className="space-y-6 text-sm sm:text-base md:text-[16px] text-muted-foreground leading-relaxed">
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
              <div className="grid grid-cols-2 gap-3 my-5">
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
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
