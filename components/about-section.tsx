"use client"

import { motion } from "framer-motion"
import { GraduationCap, Code, Award } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"

export function AboutSection() {
  const { t } = useLanguage()

  return (
    <section id="sobre" className="relative py-20 md:py-28 overflow-hidden bg-background">
      <div className="absolute inset-0 bg-linear-to-b from-background via-secondary/10 to-background" />

      <div className="relative container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-16"
        >
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
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
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-4 space-y-5"
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
          </motion.div>

          {/* Coluna da Direita: Trajetória e Cursos */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-8 space-y-7"
          >
            {/* Textos de Trajetória */}
            <div className="space-y-4 text-sm sm:text-base md:text-[17px] text-muted-foreground leading-relaxed">
              <p className="text-foreground font-medium text-base md:text-lg leading-relaxed text-justify">
                {t.about.paragraph1}
              </p>
              <p className="text-justify">
                {t.about.paragraph2}
              </p>
              <p className="text-justify">
                {t.about.paragraph3}
              </p>

              {/* Projetos do Cometa — 2 colunas sempre */}
              <div className="grid grid-cols-2 gap-3 my-5">
                {t.about.cometaProjects?.map((proj: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-3 sm:p-4 rounded-xl border border-border/30 bg-secondary/10 flex flex-col justify-between gap-2"
                  >
                    <div>
                      <h5 className="font-semibold text-foreground text-xs sm:text-sm leading-snug">{proj.title}</h5>
                      <p className="text-[11px] sm:text-xs text-muted-foreground mt-1 leading-relaxed">{proj.desc}</p>
                    </div>
                    <span className="text-[10px] font-mono text-primary bg-primary/5 px-2 py-0.5 rounded self-start border border-primary/10 leading-normal">
                      {proj.techs}
                    </span>
                  </div>
                ))}
              </div>

              {t.about.paragraph4 && (
                <p>
                  {t.about.paragraph4}
                </p>
              )}
            </div>

            {/* Cursos / Certificações */}
            <div className="space-y-4">
              <h3 className="text-lg md:text-xl font-bold text-foreground flex items-center gap-2">
                <Award className="h-5 w-5 text-primary shrink-0" />
                {t.about.skillsTitle}
              </h3>
              {/* 2 colunas em md+ para aproveitar o espaço */}
              <div className="grid md:grid-cols-2 gap-3">
                {t.about.skillsList.map((skill, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ x: 4 }}
                    className="glass rounded-xl border border-border/30 p-3 sm:p-4 flex items-start gap-3 hover:border-primary/30 transition-all duration-300"
                  >
                    <Code className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {skill}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
