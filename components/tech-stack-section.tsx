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

const categories = [
  {
    title: "Frontend",
    icon: Code2,
    techs: [
      { name: "React", level: 95 },
      { name: "Next.js", level: 92 },
      { name: "TypeScript", level: 90 },
      { name: "Tailwind CSS", level: 95 },
    ],
  },
  {
    title: "Backend",
    icon: Server,
    techs: [
      { name: "Node.js", level: 90 },
      { name: "Python", level: 85 },
      { name: "PostgreSQL", level: 88 },
      { name: "Prisma", level: 85 },
    ],
  },
  {
    title: "Mobile",
    icon: Smartphone,
    techs: [
      { name: "Flutter", level: 88 },
      { name: "React Native", level: 82 },
      { name: "Dart", level: 85 },
      { name: "iOS/Android", level: 80 },
    ],
  },
  {
    title: "Automação & DevOps",
    icon: Cog,
    techs: [
      { name: "Docker", level: 85 },
      { name: "CI/CD", level: 82 },
      { name: "AWS", level: 78 },
      { name: "Python Scripts", level: 90 },
    ],
  },
]

const additionalTools = [
  { name: "Git", icon: Terminal },
  { name: "Figma", icon: Palette },
  { name: "MongoDB", icon: Database },
  { name: "Vercel", icon: Cloud },
]

export function TechStackSection() {
  return (
    <section id="stack" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />

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
            {"<TechStack />"}
          </motion.span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-balance">
            Tecnologias & <span className="text-gradient">Habilidades</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
            Domínio em tecnologias modernas para entregar soluções completas e
            escaláveis
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {categories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
            >
              <TechCard category={category} />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          {additionalTools.map((tool, index) => (
            <motion.div
              key={tool.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 + index * 0.05, duration: 0.4 }}
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

function TechCard({
  category,
}: {
  category: (typeof categories)[0]
}) {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="h-full p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-300 group"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
          <category.icon className="h-5 w-5" />
        </div>
        <h3 className="font-semibold text-lg">{category.title}</h3>
      </div>

      <div className="space-y-4">
        {category.techs.map((tech) => (
          <div key={tech.name}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium">{tech.name}</span>
              <span className="text-xs text-muted-foreground">{tech.level}%</span>
            </div>
            <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${tech.level}%` }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full"
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
