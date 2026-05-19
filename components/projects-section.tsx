"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ExternalLink, Github, X, Layers, Zap, Code } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

const projects = [
  {
    id: 1,
    title: "ERP Corporativo (API & UI)",
    description: "Sistema integrado de ERP com Módulo de Inventário Avançado, controle de estoque e dashboard financeiro.",
    category: "web",
    image: "/inventario_img_enhanced.png",
    tags: ["Next.js", "Fastify", "Prisma ORM", "PostgreSQL", "Tailwind CSS v4"],
    github: "https://github.com/victorsantosg/erp-ui",
    demo: "https://github.com/victorsantosg/erp-ui",
    details: {
      challenge: "Criar uma plataforma de ERP responsiva de alta fidelidade e performance com tabelas de dados complexas e sincronização segura com o banco de dados.",
      solution: "Desenvolvi o frontend modular utilizando Next.js 15, React 19 e TanStack Table para manipulação rápida de grandes conjuntos de dados, conectado a uma API robusta construída com Fastify, Prisma e PostgreSQL.",
      techStack: ["Next.js 15", "React 19", "Fastify", "Prisma ORM", "PostgreSQL", "Tailwind CSS v4", "TanStack Table", "Docker"],
    },
  },
  {
    id: 2,
    title: "Dashboard de BI & Analytics Suite",
    description: "Portal de Business Intelligence corporativo com gráficos dinâmicos de faturamento, margens e metas de vendas.",
    category: "data",
    image: "/analytics-suite.png",
    tags: ["Flutter", "PlutoGrid", "Firebase", "Syncfusion Charts", "BigQuery"],
    github: "https://github.com/victorsantosg/cometa_analytics",
    demo: "https://github.com/victorsantosg/cometa_analytics",
    details: {
      challenge: "Desenvolver uma plataforma de exploração de dados extremamente rápida, robusta e multiplataforma para acompanhar métricas de vendas e faturamento em tempo real.",
      solution: "Implementei um app em Flutter usando PlutoGrid para renderização rápida de tabelas de dados complexas e Syncfusion Charts para visualizações interativas de dados consolidados do BigQuery e Firestore.",
      techStack: ["Flutter (Dart)", "PlutoGrid", "Firebase Auth & Firestore", "Syncfusion Charts", "Google APIs (BigQuery)"],
    },
  },
  {
    id: 3,
    title: "Gestão de Projetos & Dashboard de Obras",
    description: "Dashboard administrativo de acompanhamento de projetos com mapas interativos, cronogramas de progresso e relatórios dinâmicos.",
    category: "web",
    image: "/mapa_calor_img_enhanced.png",
    tags: ["Next.js 16", "Supabase", "Prisma", "Recharts", "Maps"],
    github: "https://github.com/victorsantosg/projectGestao",
    demo: "https://github.com/victorsantosg/projectGestao",
    details: {
      challenge: "Criar uma ferramenta de gestão interna com suporte a mapas geográficos e relatórios estruturados para controle administrativo de projetos locais.",
      solution: "Construí um painel em Next.js 16 integrado ao Supabase para autenticação e banco PostgreSQL, com mapas de calor regionais utilizando react-simple-maps e relatórios integrados via Mammoth (.docx).",
      techStack: ["Next.js 16", "React 19", "Supabase", "Prisma ORM", "PostgreSQL", "Recharts", "react-simple-maps", "Mammoth"],
    },
  },
  {
    id: 4,
    title: "API de Laudos & Central de Integrações",
    description: "API REST de alta performance para emissão de laudos técnicos e integração segura com sistemas de chamados e autenticação LDAP.",
    category: "web",
    image: "/api-laudo.png",
    tags: ["Fastify", "TypeScript", "LDAP", "GLPI API", "Vitest"],
    github: "https://github.com/victorsantosg/api-laudo",
    demo: "https://github.com/victorsantosg/api-laudo",
    details: {
      challenge: "Integrar e automatizar a sincronização de chamados de suporte técnico, controle de acessos corporativos via LDAP/AD e emissão de laudos com alta confiabilidade.",
      solution: "Criei um microsserviço com Fastify e TypeScript integrado a APIs externas e autenticação segura LDAP, com testes de integração rodando em Vitest e formatação automatizada via Biome.",
      techStack: ["Fastify", "TypeScript", "LDAP / Active Directory", "GLPI API", "Vitest", "Biome"],
    },
  },
  {
    id: 5,
    title: "RPA - Monitoramento de Margens & Mapa de Calor",
    description: "Automação robótica para cruzamento de notas fiscais, custos de fornecedores e geração de planilhas com mapas de calor de rentabilidade.",
    category: "automation",
    image: "/monitoramento_img_enhanced.png",
    tags: ["Python", "Pandas", "PyAutoGUI", "Selenium", "Cloud Storage"],
    github: "https://github.com/victorsantosg/monitoramento-margem",
    demo: "https://github.com/victorsantosg/monitoramento-margem",
    details: {
      challenge: "Auditar margens de lucro de milhares de itens e transações financeiras diariamente, cruzando dados de múltiplos relatórios sem intervenção manual.",
      solution: "Desenvolvi um robô em Python que utiliza Selenium para extração automática de dados fiscais, Pandas para o processamento de custos, formata planilhas com mapas de calor coloridos e realiza o upload seguro das auditorias para o Google Cloud Storage.",
      techStack: ["Python", "Pandas", "PyAutoGUI", "Selenium", "Google Cloud Storage", "Openpyxl"],
    },
  },
  {
    id: 6,
    title: "Dom Barbeiro Web App",
    description: "Aplicativo web para agendamento online de barbearias e gestão administrativa de atendimentos em tempo real.",
    category: "web",
    image: "/dom-barbeiro.png",
    tags: ["React", "Node.js", "Express", "Vercel"],
    github: "https://github.com/victorsantosg/domBarbeiro",
    demo: "https://dombarbeiro.vercel.app",
    details: {
      challenge: "Criar uma plataforma de reservas intuitiva e responsiva para clientes com painel administrativo em tempo real.",
      solution: "Plataforma desenvolvida em React com Tailwind CSS no frontend, conectada a uma API em Node.js hospedada na Vercel com banco de dados seguro.",
      techStack: ["React", "Node.js", "Express", "Vercel", "Tailwind CSS"],
    },
  },
]

const filters = [
  { id: "all", label: "Todos" },
  { id: "web", label: "Web Apps" },
  { id: "data", label: "Dados & IA" },
  { id: "automation", label: "Automações" },
]

export function ProjectsSection() {
  const [activeFilter, setActiveFilter] = useState("all")
  const [selectedProject, setSelectedProject] = useState<(typeof projects)[0] | null>(null)

  const filteredProjects =
    activeFilter === "all"
      ? projects
      : projects.filter((p) => p.category === activeFilter)

  return (
    <section id="projetos" className="relative py-32">
      <div className="container mx-auto px-6">
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
            {"<Projects />"}
          </motion.span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-balance">
            Projetos em <span className="text-gradient">Destaque</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
            Uma seleção dos meus trabalhos mais recentes e impactantes
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-2 mb-12"
        >
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeFilter === filter.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </motion.div>

        <motion.div
          layout
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
              >
                <ProjectCard
                  project={project}
                  onViewDetails={() => setSelectedProject(project)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="max-w-2xl bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-3">
              {selectedProject?.title}
            </DialogTitle>
          </DialogHeader>

          {selectedProject && (
            <div className="space-y-6">
              <div className="aspect-video rounded-lg bg-secondary overflow-hidden relative">
                <Image
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div>
                <h4 className="font-semibold text-primary flex items-center gap-2 mb-2">
                  <Zap className="h-4 w-4" />
                  Desafio
                </h4>
                <p className="text-muted-foreground text-sm">
                  {selectedProject.details.challenge}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-primary flex items-center gap-2 mb-2">
                  <Code className="h-4 w-4" />
                  Solução
                </h4>
                <p className="text-muted-foreground text-sm">
                  {selectedProject.details.solution}
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Stack Completa</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.details.techStack.map((tech) => (
                    <Badge
                      key={tech}
                      variant="secondary"
                      className="bg-secondary text-foreground"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  asChild
                  className="flex-1 bg-primary text-primary-foreground"
                >
                  <a
                    href={selectedProject.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Ver Demo
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="flex-1"
                >
                  <a
                    href={selectedProject.github}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="mr-2 h-4 w-4" />
                    Código
                  </a>
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}

function ProjectCard({
  project,
  onViewDetails,
}: {
  project: (typeof projects)[0]
  onViewDetails: () => void
}) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="group h-full rounded-2xl bg-card border border-border/50 overflow-hidden hover:border-primary/30 transition-all duration-300"
    >
      <div className="relative aspect-video bg-secondary overflow-hidden">
        {project.image ? (
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
            <Layers className="h-12 w-12" />
          </div>
        )}

        <div className="absolute top-3 left-3">
          <Badge
            className={`text-xs ${
              project.category === "web"
                ? "bg-blue-500/20 text-blue-400"
                : project.category === "data"
                ? "bg-purple-500/20 text-purple-400"
                : "bg-orange-500/20 text-orange-400"
            }`}
          >
            {project.category === "web"
              ? "Web App"
              : project.category === "data"
              ? "Dados & IA"
              : "Automação"}
          </Badge>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-5">
        <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
          {project.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-1 rounded-md bg-secondary text-muted-foreground"
            >
              {tag}
            </span>
          ))}
          {project.tags.length > 3 && (
            <span className="text-xs px-2 py-1 rounded-md bg-secondary text-muted-foreground">
              +{project.tags.length - 3}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={onViewDetails}
            className="flex-1 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground"
          >
            Ver Detalhes
          </Button>
          <Button
            size="sm"
            variant="outline"
            asChild
            className="border-border hover:border-primary"
          >
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Ver código no GitHub"
            >
              <Github className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
