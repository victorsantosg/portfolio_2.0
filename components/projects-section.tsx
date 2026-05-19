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

const projects = [
  {
    id: 1,
    title: "FinTrack Pro",
    description: "Dashboard financeiro completo com análises em tempo real e integração bancária",
    category: "web",
    image: "/api/placeholder/600/400",
    tags: ["Next.js", "TypeScript", "Prisma", "PostgreSQL"],
    github: "https://github.com",
    demo: "https://demo.com",
    details: {
      challenge: "Criar uma plataforma que centralizasse todas as finanças pessoais e empresariais com análises preditivas.",
      solution: "Desenvolvemos um dashboard modular com gráficos interativos, categorização automática de transações e alertas personalizados.",
      techStack: ["Next.js 14", "TypeScript", "Prisma ORM", "PostgreSQL", "Chart.js", "Tailwind CSS", "Vercel"],
    },
  },
  {
    id: 2,
    title: "DeliverEats",
    description: "Aplicativo mobile de delivery com rastreamento em tempo real e pagamento integrado",
    category: "mobile",
    image: "/api/placeholder/600/400",
    tags: ["Flutter", "Firebase", "Node.js", "Stripe"],
    github: "https://github.com",
    demo: "https://demo.com",
    details: {
      challenge: "Desenvolver um app de delivery que fosse rápido, intuitivo e oferecesse rastreamento preciso.",
      solution: "Criamos um app Flutter com arquitetura limpa, integração com Google Maps para rastreamento e sistema de pagamento Stripe.",
      techStack: ["Flutter", "Dart", "Firebase", "Node.js", "Express", "Stripe API", "Google Maps API"],
    },
  },
  {
    id: 3,
    title: "AutoBot HR",
    description: "Sistema de automação para RH com processamento de currículos via IA",
    category: "automation",
    image: "/api/placeholder/600/400",
    tags: ["Python", "OpenAI", "Docker", "AWS"],
    github: "https://github.com",
    demo: "https://demo.com",
    details: {
      challenge: "Automatizar a triagem de currículos e agendamento de entrevistas para grandes empresas.",
      solution: "Implementamos um sistema com IA para análise de currículos, ranking automático de candidatos e integração com calendários.",
      techStack: ["Python", "OpenAI API", "FastAPI", "Docker", "AWS Lambda", "PostgreSQL", "Redis"],
    },
  },
  {
    id: 4,
    title: "EcoShop",
    description: "E-commerce sustentável com cálculo de pegada de carbono por produto",
    category: "web",
    image: "/api/placeholder/600/400",
    tags: ["React", "Node.js", "MongoDB", "Stripe"],
    github: "https://github.com",
    demo: "https://demo.com",
    details: {
      challenge: "Criar uma loja virtual que incentivasse compras conscientes mostrando o impacto ambiental.",
      solution: "Desenvolvemos um e-commerce com API própria para cálculo de carbono e sistema de gamificação para clientes eco-friendly.",
      techStack: ["React", "Node.js", "Express", "MongoDB", "Stripe", "Redis", "Docker"],
    },
  },
  {
    id: 5,
    title: "FitPulse",
    description: "App de fitness com treinos personalizados por IA e integração com wearables",
    category: "mobile",
    image: "/api/placeholder/600/400",
    tags: ["React Native", "TensorFlow", "Node.js", "PostgreSQL"],
    github: "https://github.com",
    demo: "https://demo.com",
    details: {
      challenge: "Criar treinos personalizados que se adaptassem ao progresso e limitações do usuário.",
      solution: "Implementamos ML para análise de desempenho e criação dinâmica de treinos com sincronização de smartwatches.",
      techStack: ["React Native", "TensorFlow Lite", "Node.js", "PostgreSQL", "HealthKit", "Google Fit API"],
    },
  },
  {
    id: 6,
    title: "DataSync Pro",
    description: "Pipeline de dados automatizado com ETL e dashboards analíticos",
    category: "automation",
    image: "/api/placeholder/600/400",
    tags: ["Python", "Apache Airflow", "PostgreSQL", "Grafana"],
    github: "https://github.com",
    demo: "https://demo.com",
    details: {
      challenge: "Unificar dados de múltiplas fontes para análises centralizadas em tempo real.",
      solution: "Criamos um pipeline robusto com Apache Airflow para orquestração e Grafana para visualização de métricas.",
      techStack: ["Python", "Apache Airflow", "PostgreSQL", "Grafana", "Docker", "AWS S3", "dbt"],
    },
  },
]

const filters = [
  { id: "all", label: "Todos" },
  { id: "web", label: "Web Apps" },
  { id: "mobile", label: "Mobile" },
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
              <div className="aspect-video rounded-lg bg-secondary overflow-hidden">
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <Layers className="h-12 w-12" />
                </div>
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
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
          <Layers className="h-12 w-12" />
        </div>

        <div className="absolute top-3 left-3">
          <Badge
            className={`text-xs ${
              project.category === "web"
                ? "bg-blue-500/20 text-blue-400"
                : project.category === "mobile"
                ? "bg-purple-500/20 text-purple-400"
                : "bg-orange-500/20 text-orange-400"
            }`}
          >
            {project.category === "web"
              ? "Web App"
              : project.category === "mobile"
              ? "Mobile"
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
