"use client"

import { motion } from "framer-motion"
import { GraduationCap, Code, Briefcase, Award, Phone, Mail, MapPin } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"

export function AboutSection() {
  const { t } = useLanguage()

  const contactInfo = [
    { icon: Phone, text: "(85) 99955-6385", href: "tel:+5585999556385" },
    { icon: Mail, text: "victoorsaantos16@gmail.com", href: "mailto:victoorsaantos16@gmail.com" },
    { icon: MapPin, text: "Fortaleza / Ceará", href: null }
  ]

  return (
    <section id="sobre" className="relative py-32 overflow-hidden bg-background">
      <div className="absolute inset-0 bg-linear-to-b from-background via-secondary/10 to-background" />

      <div className="relative container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
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

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Coluna da Esquerda: Contato e Resumo */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-4 space-y-6"
          >
            <div className="glass rounded-2xl border border-border/50 p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <Briefcase className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Victor Santos</h3>
                  <p className="text-sm text-muted-foreground">Full Stack & Data Analyst</p>
                </div>
              </div>

              <hr className="border-border/50" />

              <div className="space-y-4">
                {contactInfo.map((info, idx) => {
                  const Icon = info.icon
                  return (
                    <div key={idx} className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-primary shrink-0" />
                      {info.href ? (
                        <a href={info.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                          {info.text}
                        </a>
                      ) : (
                        <span className="text-sm text-muted-foreground">{info.text}</span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="glass rounded-2xl border border-border/50 p-6">
              <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary" />
                Formação Acadêmica
              </h4>
              <ul className="space-y-4 text-sm">
                <li>
                  <p className="font-medium text-foreground">Graduação em Análise e Desenvolvimento de Sistemas</p>
                  <p className="text-xs text-muted-foreground">UNIFOR (Universidade de Fortaleza)</p>
                </li>
                <li>
                  <p className="font-medium text-foreground">Pós-Graduação em Dev Web Full Stack</p>
                  <p className="text-xs text-muted-foreground">Faculdade INFNET (Concluído)</p>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Coluna da Direita: Trajetória e Cursos */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-8 space-y-8"
          >
            <div className="space-y-6 text-base md:text-lg text-muted-foreground leading-relaxed">
              <p className="text-foreground font-medium text-xl">
                {t.about.paragraph1}
              </p>
              <p>
                {t.about.paragraph2}
              </p>
              <p>
                {t.about.paragraph3}
              </p>
              {/* Projetos do Cometa com Explicação e Techs */}
              <div className="grid sm:grid-cols-2 gap-4 my-6">
                {t.about.cometaProjects?.map((proj: any, idx: number) => (
                  <div key={idx} className="p-4 rounded-xl border border-border/30 bg-secondary/10 flex flex-col justify-between space-y-2">
                    <div>
                      <h5 className="font-semibold text-foreground text-sm md:text-base">{proj.title}</h5>
                      <p className="text-xs text-muted-foreground mt-1">{proj.desc}</p>
                    </div>
                    <span className="text-[10px] font-mono text-primary bg-primary/5 px-2 py-0.5 rounded self-start border border-primary/10">
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
              <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                {t.about.skillsTitle}
              </h3>
              <div className="grid gap-4">
                {t.about.skillsList.map((skill, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ x: 4 }}
                    className="glass rounded-xl border border-border/30 p-4 flex items-start gap-3 hover:border-primary/30 transition-all duration-300"
                  >
                    <Code className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
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
