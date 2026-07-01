"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ExternalLink,
  Github,
  Layers,
  Zap,
  Code,
  Search,
  Plus,
  Trash,
  Play,
  Terminal as TermIcon,
  Calendar,
  Check,
  Send,
  Database,
  Building2,
  TrendingUp,
  Cpu,
  X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { useLanguage } from "@/hooks/use-language"
import { Input } from "@/components/ui/input"

export function ProjectsSection() {
  const { language, t } = useLanguage()
  const [activeFilter, setActiveFilter] = useState("all")
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState<"overview" | "simulator">("overview")
  const [zoomImage, setZoomImage] = useState<string | null>(null)

  const projects = [
    {
      id: 1,
      title: t.projects.list.erp.title,
      description: t.projects.list.erp.description,
      category: "corporate",
      image: "/inventario_img_enhanced.png",
      tags: ["Next.js", "Fastify", "Prisma ORM", "PostgreSQL", "Tailwind CSS v4"],
      github: "https://github.com/victorsantosg/erp-ui",
      demo: "https://github.com/victorsantosg/erp-ui",
      details: {
        challenge: t.projects.list.erp.challenge,
        solution: t.projects.list.erp.solution,
        techStack: ["Next.js 15", "React 19", "Fastify", "Prisma ORM", "PostgreSQL", "Tailwind CSS v4", "TanStack Table", "Docker"],
      },
    },
    {
      id: 2,
      title: t.projects.list.bi.title,
      description: t.projects.list.bi.description,
      category: "corporate",
      image: "/portal-lojista.png",
      tags: ["Next.js 16", "Prisma ORM", "PostgreSQL", "Tailwind CSS v4", "Docker"],
      github: "https://github.com/victorsantosg/portal_Logista",
      demo: "https://github.com/victorsantosg/portal_Logista",
      details: {
        challenge: t.projects.list.bi.challenge,
        solution: t.projects.list.bi.solution,
        techStack: ["Next.js 16", "React 19", "Prisma ORM", "PostgreSQL", "Tailwind CSS v4", "Bcrypt", "Docker", "Docker Compose"],
      },
    },
    {
      id: 3,
      title: t.projects.list.projects.title,
      description: t.projects.list.projects.description,
      category: "corporate",
      image: "/mapa_calor_img_enhanced.png",
      tags: ["Next.js 16", "Supabase", "Prisma", "Recharts", "Maps"],
      github: "https://github.com/victorsantosg/projectGestao",
      demo: "https://github.com/victorsantosg/projectGestao",
      details: {
        challenge: t.projects.list.projects.challenge,
        solution: t.projects.list.projects.solution,
        techStack: ["Next.js 16", "React 19", "Supabase", "Prisma ORM", "PostgreSQL", "Recharts", "react-simple-maps", "Mammoth"],
      },
    },
    {
      id: 4,
      title: t.projects.list.laudo.title,
      description: t.projects.list.laudo.description,
      category: "corporate",
      image: "/ouvidoria.png",
      tags: ["Next.js 16", "React 19", "Prisma ORM", "PostgreSQL"],
      github: "https://github.com/victorsantosg/nps_solares",
      demo: "https://github.com/victorsantosg/nps_solares",
      details: {
        challenge: t.projects.list.laudo.challenge,
        solution: t.projects.list.laudo.solution,
        techStack: ["Next.js 16", "React 19", "Prisma ORM", "PostgreSQL", "Tailwind CSS v4"],
      },
    },
    {
      id: 5,
      title: t.projects.list.rpa.title,
      description: t.projects.list.rpa.description,
      category: "corporate",
      image: "/monitoramento_img_enhanced.png",
      tags: ["Next.js 16", "PostgreSQL", "Tailwind CSS v4", "SWR"],
      github: "https://github.com/victorsantosg/Monitoramento",
      demo: "https://github.com/victorsantosg/Monitoramento",
      details: {
        challenge: t.projects.list.rpa.challenge,
        solution: t.projects.list.rpa.solution,
        techStack: ["Next.js 16", "React 19", "pg (PostgreSQL)", "Tailwind CSS v4", "Recharts", "SWR", "Docker"],
      },
    },
    {
      id: 6,
      title: t.projects.list.barber.title,
      description: t.projects.list.barber.description,
      category: "personal",
      image: "/barbearia.png",
      tags: ["React", "Node.js", "Express", "Vercel"],
      github: "https://github.com/victorsantosg/domBarbeiro",
      demo: "https://dombarbeiro.vercel.app",
      details: {
        challenge: t.projects.list.barber.challenge,
        solution: t.projects.list.barber.solution,
        techStack: ["React (Vite)", "Express", "Prisma ORM", "PostgreSQL", "Supabase", "React-Bootstrap"],
      },
    },
    {
      id: 7,
      title: t.projects.list.ecu.title,
      description: t.projects.list.ecu.description,
      category: "corporate",
      image: "https://w7.pngwing.com/pngs/815/780/png-transparent-workshop-mechanic-logo-automobile-repair-shop-graphic-design-tokheim-white-text-hand.png",
      tags: ["Python", "CustomTkinter", "SQLite3", "Bcrypt"],
      github: "https://github.com/victorsantosg/cat-logo_bosch",
      demo: "https://github.com/victorsantosg/cat-logo_bosch",
      details: {
        challenge: t.projects.list.ecu.challenge,
        solution: t.projects.list.ecu.solution,
        techStack: ["Python 3.12", "CustomTkinter", "SQLite3", "Bcrypt (Password Hashing)"],
      },
    },
    {
      id: 8,
      title: t.projects.list.drum.title,
      description: t.projects.list.drum.description,
      category: "personal",
      image: "https://i.ibb.co/cKHSvNL5/Drum-Machine-Victor-S.jpg",
      tags: ["Python", "Tkinter", "Pygame", "Sounddevice"],
      github: "https://github.com/victorsantosg/app_drum_3.0",
      demo: "https://github.com/victorsantosg/app_drum_3.0",
      details: {
        challenge: t.projects.list.drum.challenge,
        solution: t.projects.list.drum.solution,
        techStack: ["Python 3.12", "Tkinter (GUI)", "Pygame (Audio Sequencing)", "Sounddevice (Loop Capture)", "SQLite3"],
      },
    },
    {
      id: 9,
      title: t.projects.list.data_analysis.title,
      description: t.projects.list.data_analysis.description,
      category: "personal",
      image: "https://i.ibb.co/5W1BPZF6/Analisando-dados-empresa-Apostila-Jornada-Python-Aula-2-pdf-at-main-victorsantosg-Analisando-dados-e.jpg",
      tags: ["Python", "Pandas", "Jupyter", "Plotly"],
      github: "https://github.com/victorsantosg/Analisando_dados_empresa",
      demo: "https://github.com/victorsantosg/Analisando_dados_empresa",
      details: {
        challenge: t.projects.list.data_analysis.challenge,
        solution: t.projects.list.data_analysis.solution,
        techStack: ["Python", "Pandas", "Plotly", "Jupyter Notebook"],
      },
    },
    {
      id: 10,
      title: t.projects.list.cadastro_auto.title,
      description: t.projects.list.cadastro_auto.description,
      category: "personal",
      image: "https://img-c.udemycdn.com/course/750x422/2364684_6b56_8.jpg",
      tags: ["Python", "PyAutoGUI", "Excel Automation"],
      github: "https://github.com/victorsantosg/Automatizando_preenchimento_tabela",
      demo: "https://github.com/victorsantosg/Automatizando_preenchimento_tabela",
      details: {
        challenge: t.projects.list.cadastro_auto.challenge,
        solution: t.projects.list.cadastro_auto.solution,
        techStack: ["Python", "PyAutoGUI", "Openpyxl", "Excel"],
      },
    },
    {
      id: 11,
      title: t.projects.list.score_ia.title,
      description: t.projects.list.score_ia.description,
      category: "personal",
      image: "https://media.licdn.com/dms/image/v2/D4D12AQE0V7D6BeOEIg/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1732218680808?e=2147483647&v=beta&t=9m5htXuwixDTwtigui04ZDQU_4pN8fN9Byw9qeI_PVM",
      tags: ["Python", "Scikit-Learn", "Machine Learning", "Pandas"],
      github: "https://github.com/victorsantosg/Projeto_Python_IA_Intelig-ncia_Artificial_e_Previs-es",
      demo: "https://github.com/victorsantosg/Projeto_Python_IA_Intelig-ncia_Artificial_e_Previs-es",
      details: {
        challenge: t.projects.list.score_ia.challenge,
        solution: t.projects.list.score_ia.solution,
        techStack: ["Python", "Pandas", "Scikit-Learn", "Machine Learning (Random Forest / KNN)"],
      },
    },
    {
      id: 12,
      title: t.projects.list.chatbot_ia.title,
      description: t.projects.list.chatbot_ia.description,
      category: "personal",
      image: "https://www.codingal.com/resources/wp-content/uploads/2024/12/145.png",
      tags: ["Python", "Streamlit", "OpenAI API", "GPT-4o"],
      github: "https://github.com/victorsantosg/CHAT_BOT_COM_IA",
      demo: "https://github.com/victorsantosg/CHAT_BOT_COM_IA",
      details: {
        challenge: t.projects.list.chatbot_ia.challenge,
        solution: t.projects.list.chatbot_ia.solution,
        techStack: ["Python 3.12", "Streamlit", "OpenAI SDK", "GPT-4o API", "Session State"],
      },
    },
    {
      id: 13,
      title: t.projects.list.pyautogui_opencv.title,
      description: t.projects.list.pyautogui_opencv.description,
      category: "personal",
      image: "https://programadorviking.com.br/wp-content/uploads/2021/05/pyautogui-teclado.jpg",
      tags: ["Python", "PyAutoGUI", "OpenCV", "Computer Vision"],
      github: "https://github.com/victorsantosg/Automatizado_no_meu_trabalho",
      demo: "https://github.com/victorsantosg/Automatizado_no_meu_trabalho",
      details: {
        challenge: t.projects.list.pyautogui_opencv.challenge,
        solution: t.projects.list.pyautogui_opencv.solution,
        techStack: ["Python", "PyAutoGUI", "OpenCV", "Computer Vision"],
      },
    },
    {
      id: 14,
      title: t.projects.list.financas.title,
      description: t.projects.list.financas.description,
      category: "personal",
      image: "https://img.freepik.com/vetores-premium/conhecimento-em-financas-e-investimentos_327176-1095.jpg?w=740",
      tags: ["React", "Netlify", "CSS personalizado"],
      github: "https://github.com/victorsantosg",
      demo: "https://financascontrole.netlify.app/",
      details: {
        challenge: t.projects.list.financas.challenge,
        solution: t.projects.list.financas.solution,
        techStack: ["React.js", "Vanilla CSS", "Netlify Hosting"],
      },
    },
    {
      id: 15,
      title: t.projects.list.uniflix.title,
      description: t.projects.list.uniflix.description,
      category: "personal",
      image: "https://cdn.arstechnica.net/wp-content/uploads/2022/07/netflix-800x450.jpg",
      tags: ["HTML5", "CSS3", "JavaScript"],
      github: "https://github.com/victorsantosg",
      demo: "https://uniflix.netlify.app/",
      details: {
        challenge: t.projects.list.uniflix.challenge,
        solution: t.projects.list.uniflix.solution,
        techStack: ["HTML5", "CSS3", "JavaScript"],
      },
    },
    {
      id: 16,
      title: t.projects.list.clima.title,
      description: t.projects.list.clima.description,
      category: "personal",
      image: "https://www.fmmetropole.com.br/arquivos/cache/noticia/antigas/Previsao-do-Tempo/PREVISAO-DO-TEMPO-METROPOLE-FM-605x.jpg",
      tags: ["JavaScript", "OpenWeather API", "Responsive CSS"],
      github: "https://github.com/victorsantosg",
      demo: "https://climavictor.netlify.app",
      details: {
        challenge: t.projects.list.clima.challenge,
        solution: t.projects.list.clima.solution,
        techStack: ["JavaScript", "OpenWeatherMap API", "CSS3"],
      },
    },
    {
      id: 17,
      title: t.projects.list.portfolio_estudo.title,
      description: t.projects.list.portfolio_estudo.description,
      category: "personal",
      image: "https://www.investopedia.com/thmb/bJ_bKFNuXw2BXn-23gldyoyLHZk=/2121x1414/filters:fill(auto,1)/GettyImages-508126658-e57932d9c64246e5b2946582a3586881.jpg",
      tags: ["Vite", "React", "SASS", "Responsive Layout"],
      github: "https://github.com/victorsantosg",
      demo: "https://main--portfoliovictorr.netlify.app/",
      details: {
        challenge: t.projects.list.portfolio_estudo.challenge,
        solution: t.projects.list.portfolio_estudo.solution,
        techStack: ["Vite.js", "React", "SASS"],
      },
    },
    {
      id: 18,
      title: t.projects.list.cupons.title,
      description: t.projects.list.cupons.description,
      category: "corporate",
      image: "/cancelamentos.png",
      tags: ["Next.js 16", "PostgreSQL", "jsPDF", "Tailwind CSS v4"],
      github: "https://github.com/victorsantosg/cuponsCancelados",
      demo: "https://github.com/victorsantosg/cuponsCancelados",
      details: {
        challenge: t.projects.list.cupons.challenge,
        solution: t.projects.list.cupons.solution,
        techStack: ["Next.js 16", "React 19", "pg (PostgreSQL)", "Tailwind CSS v4", "jsPDF", "jsPDF-AutoTable", "Docker"],
      },
    },
  ]

  const selectedProject = projects.find((p) => p.id === selectedProjectId)

  const filters = [
    { id: "all", label: t.projects.filters.all },
    { id: "corporate", label: t.projects.filters.corporate },
    { id: "personal", label: t.projects.filters.personal },
  ]

  const filteredProjects =
    activeFilter === "all"
      ? projects
      : projects.filter((p) => p.category === activeFilter)

  const openProjectDetails = (project: any) => {
    setSelectedProjectId(project.id)
    setActiveTab("overview")
  }

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
            {t.projects.tagline}
          </motion.span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-balance">
            {t.projects.title} <span className="text-gradient">{t.projects.titleGradient}</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
            {t.projects.subtitle}
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
                  onViewDetails={() => openProjectDetails(project)}
                  onImageClick={(img) => setZoomImage(img)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <Dialog open={!!selectedProject} onOpenChange={(open) => !open && setSelectedProjectId(null)}>
        <DialogContent className="max-w-3xl bg-card border border-border p-0 overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-secondary/30">
            <DialogTitle className="text-xl font-bold flex items-center gap-3">
              {selectedProject?.title}
            </DialogTitle>
          </div>

          {selectedProject && (
            <div className="flex flex-col h-[75vh]">
              {/* Tab Selector */}
              <div className="flex border-b border-border bg-secondary/10 px-4">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`px-4 py-3 text-sm font-medium border-b-2 transition-all ${
                    activeTab === "overview"
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {language === "pt" ? "Visão Geral" : "Overview"}
                </button>
                <button
                  onClick={() => setActiveTab("simulator")}
                  className={`px-4 py-3 text-sm font-medium border-b-2 transition-all flex items-center gap-1.5 ${
                    activeTab === "simulator"
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Cpu className="h-4 w-4" />
                  {t.projects.simulatorTitle}
                </button>
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {activeTab === "overview" ? (
                  <>
                    <div 
                      className="aspect-video rounded-xl bg-secondary overflow-hidden relative border border-border/50 shadow-inner cursor-zoom-in"
                      onClick={() => setZoomImage(selectedProject.image)}
                    >
                      <Image
                        src={selectedProject.image}
                        alt={selectedProject.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-primary flex items-center gap-2 mb-2">
                            <Zap className="h-4 w-4" />
                            {t.projects.challenge}
                          </h4>
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            {selectedProject.details.challenge}
                          </p>
                        </div>

                        <div>
                          <h4 className="font-semibold text-primary flex items-center gap-2 mb-2">
                            <Code className="h-4 w-4" />
                            {t.projects.solution}
                          </h4>
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            {selectedProject.details.solution}
                          </p>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3">{t.projects.stackTitle}</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedProject.details.techStack.map((tech: string) => (
                            <Badge
                              key={tech}
                              variant="secondary"
                              className="bg-secondary text-foreground hover:bg-secondary/80 border border-border/30"
                            >
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="h-full min-h-[350px]">
                    <ProjectSimulator projectId={selectedProject.id} language={language} />
                  </div>
                )}
              </div>

              {/* Dialog Footer */}
              <div className="border-t border-border bg-secondary/20 p-4 flex gap-3">
                <Button
                  asChild
                  className="flex-1 bg-primary text-primary-foreground font-semibold"
                >
                  <a
                    href={selectedProject.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    {t.projects.btnDemo}
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="flex-1 font-semibold"
                >
                  <a
                    href={selectedProject.github}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="mr-2 h-4 w-4" />
                    {t.projects.btnCode}
                  </a>
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Image Zoom Modal (Lightbox) */}
      <Dialog open={!!zoomImage} onOpenChange={(open) => !open && setZoomImage(null)}>
        <DialogContent 
          className="max-w-[95vw] md:max-w-[85vw] max-h-[90vh] p-1 bg-black/95 border-none flex items-center justify-center overflow-hidden shadow-2xl relative"
          showCloseButton={false}
        >
          {zoomImage && (
            <div className="relative w-full h-[85vh] flex items-center justify-center">
              <img
                src={zoomImage}
                alt="Project screenshot full view"
                className="max-w-full max-h-full object-contain rounded-lg select-none"
              />
              <button
                onClick={() => setZoomImage(null)}
                className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white/90 hover:text-white transition-all border border-white/10 shadow-lg cursor-pointer"
                aria-label="Fechar"
              >
                <X className="h-5 w-5" />
              </button>
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
  onImageClick,
}: {
  project: any
  onViewDetails: () => void
  onImageClick: (imageUrl: string) => void
}) {
  const { language, t } = useLanguage()
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="group h-full rounded-2xl bg-card border border-border/50 overflow-hidden hover:border-primary/30 transition-all duration-300 flex flex-col justify-between"
    >
      <div>
        <div 
          className="relative aspect-video bg-secondary overflow-hidden cursor-zoom-in group/img"
          onClick={() => onImageClick(project.image)}
        >
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
              className={`text-xs font-semibold ${
                project.category === "corporate"
                  ? "bg-blue-500/20 text-blue-400"
                  : "bg-purple-500/20 text-purple-400"
              }`}
            >
              {project.category === "corporate"
                ? (language === "pt" ? "Corporativo" : "Corporate")
                : (language === "pt" ? "Pessoal" : "Personal")}
            </Badge>
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <div className="p-5">
          <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.tags.slice(0, 4).map((tag: string) => (
              <span
                key={tag}
                className="text-xs px-2 py-1 rounded-md bg-secondary text-muted-foreground border border-border/20"
              >
                {tag}
              </span>
            ))}
            {project.tags.length > 4 && (
              <span className="text-xs px-2 py-1 rounded-md bg-secondary text-muted-foreground">
                +{project.tags.length - 4}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="p-5 pt-0 flex items-center gap-2">
        <Button
          size="sm"
          onClick={onViewDetails}
          className="flex-1 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 font-semibold"
        >
          {t.projects.btnDetails}
        </Button>
        <Button
          size="sm"
          variant="outline"
          asChild
          className="border-border hover:border-primary transition-colors"
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
    </motion.div>
  )
}

function ProjectSimulator({ projectId, language }: { projectId: number; language: string }) {
  switch (projectId) {
    case 1:
      return <ERPSimulator language={language} />
    case 2:
      return <BISimulator language={language} />
    case 3:
      return <ProjectTrackerSimulator language={language} />
    case 4:
      return <APISimulator language={language} />
    case 5:
      return <RPASimulator language={language} />
    case 6:
      return <BarberSimulator language={language} />
    default:
      return <div className="text-center py-10 text-muted-foreground">Simulator not found</div>
  }
}

/* 1. ERP Simulator Component */
function ERPSimulator({ language }: { language: string }) {
  const isPt = language === "pt"
  const [items, setItems] = useState([
    { id: 1, name: "Fio de Cobre Flexível 2.5mm", stock: 120, unit: "m", minStock: 50 },
    { id: 2, name: "Disjuntor Termomagnético 20A", stock: 15, unit: "un", minStock: 20 },
    { id: 3, name: "Painel Solar Fotovoltaico 400W", stock: 45, unit: "un", minStock: 10 },
    { id: 4, name: "Eletroduto Corrugado 3/4", stock: 210, unit: "m", minStock: 100 },
  ])
  const [search, setSearch] = useState("")
  const [newItemName, setNewItemName] = useState("")
  const [newItemQty, setNewItemQty] = useState(10)

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newItemName.trim()) return
    setItems([
      ...items,
      {
        id: Date.now(),
        name: newItemName,
        stock: Number(newItemQty),
        unit: "un",
        minStock: 5,
      },
    ])
    setNewItemName("")
    setNewItemQty(10)
  }

  const handleDeleteItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-4 font-sans text-sm">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <h5 className="font-semibold text-primary">{isPt ? "Controle de Inventário Avançado" : "Advanced Inventory System"}</h5>
        <span className="text-xs text-muted-foreground">Frontend: NextJS / React | Backend: Prisma + Fastify</span>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={isPt ? "Pesquisar item..." : "Search item..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-secondary/50 border-border"
          />
        </div>
      </div>

      <div className="border border-border rounded-xl overflow-hidden bg-secondary/20 max-h-[160px] overflow-y-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-secondary/50 text-muted-foreground text-xs font-semibold border-b border-border">
              <th className="p-3">{isPt ? "Item" : "Product"}</th>
              <th className="p-3 text-center">{isPt ? "Estoque" : "Stock"}</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-center">{isPt ? "Ação" : "Action"}</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => {
              const isLow = item.stock < item.minStock
              return (
                <tr key={item.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                  <td className="p-3 font-medium">{item.name}</td>
                  <td className="p-3 text-center">{item.stock} {item.unit}</td>
                  <td className="p-3 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        isLow ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"
                      }`}
                    >
                      {isLow ? (isPt ? "Estoque Baixo" : "Low Stock") : (isPt ? "Ok" : "Normal")}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="text-red-400 hover:text-red-300 p-1"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <form onSubmit={handleAddItem} className="flex gap-2 items-end pt-2">
        <div className="flex-1 space-y-1">
          <label className="text-xs text-muted-foreground font-medium">{isPt ? "Novo Item" : "New Item Name"}</label>
          <Input
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder={isPt ? "Nome do item..." : "Item name..."}
            className="bg-secondary/50 border-border"
          />
        </div>
        <div className="w-24 space-y-1">
          <label className="text-xs text-muted-foreground font-medium">{isPt ? "Quantidade" : "Quantity"}</label>
          <Input
            type="number"
            value={newItemQty}
            onChange={(e) => setNewItemQty(Number(e.target.value))}
            className="bg-secondary/50 border-border"
          />
        </div>
        <Button type="submit" size="sm" className="bg-primary text-primary-foreground font-bold">
          <Plus className="h-4 w-4 mr-1" /> {isPt ? "Adicionar" : "Add"}
        </Button>
      </form>
    </div>
  )
}

/* 2. BI / Dashboard Simulator Component */
function BISimulator({ language }: { language: string }) {
  const isPt = language === "pt"
  const [metric, setMetric] = useState<"faturamento" | "margem" | "metas">("faturamento")
  const [activeMonth, setActiveMonth] = useState<"Jan" | "Fev" | "Mar" | "Abr">("Abr")

  const data = {
    Jan: { faturamento: 120000, margem: 32, metas: 95 },
    Fev: { faturamento: 145000, margem: 34, metas: 98 },
    Mar: { faturamento: 168000, margem: 36, metas: 104 },
    Abr: { faturamento: 195000, margem: 38, metas: 110 },
  }

  return (
    <div className="space-y-4 font-sans text-sm h-full flex flex-col justify-between">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <h5 className="font-semibold text-primary flex items-center gap-1.5">
          <TrendingUp className="h-4 w-4" />
          {isPt ? "Analytics Suite - Monitoramento Operacional" : "Analytics Suite - Operational Dashboard"}
        </h5>
        <span className="text-xs text-muted-foreground">Flutter Web Engine & Real BigQuery Data Mock</span>
      </div>

      <div className="flex gap-2">
        {(["faturamento", "margem", "metas"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMetric(m)}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all border ${
              metric === m
                ? "bg-primary/10 border-primary text-primary"
                : "bg-secondary/30 border-border/50 text-muted-foreground hover:text-foreground"
            }`}
          >
            {m === "faturamento" ? (isPt ? "Faturamento" : "Revenue") : m === "margem" ? (isPt ? "Margem Bruta" : "Gross Margin") : (isPt ? "Ating. Meta" : "Goal Target")}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-3 bg-secondary/15 p-4 rounded-2xl border border-border/50 items-end min-h-[160px]">
        {(["Jan", "Fev", "Mar", "Abr"] as const).map((month) => {
          const val = data[month][metric]
          // Calculate height percentage
          const maxVal = metric === "faturamento" ? 220000 : metric === "margem" ? 45 : 120
          const pct = Math.min((val / maxVal) * 100, 100)

          return (
            <div
              key={month}
              onClick={() => setActiveMonth(month)}
              className="flex flex-col items-center gap-2 cursor-pointer group"
            >
              <div className="w-full relative flex justify-center items-end h-[100px]">
                {/* Bar */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${pct}%` }}
                  transition={{ type: "spring", stiffness: 100 }}
                  className={`w-8 rounded-t-lg transition-colors ${
                    activeMonth === month
                      ? "bg-gradient-to-t from-primary to-primary/80 shadow-[0_0_12px_rgba(34,197,94,0.4)]"
                      : "bg-secondary hover:bg-secondary/80"
                  }`}
                />
                {/* Tooltip on active */}
                {activeMonth === month && (
                  <div className="absolute -top-7 px-2 py-1 rounded bg-popover text-popover-foreground text-[10px] font-bold border border-border shadow-md">
                    {metric === "faturamento"
                      ? `R$ ${(val / 1000).toFixed(0)}k`
                      : metric === "margem"
                      ? `${val}%`
                      : `${val}%`}
                  </div>
                )}
              </div>
              <span className={`text-xs font-semibold ${activeMonth === month ? "text-primary" : "text-muted-foreground"}`}>
                {month}
              </span>
            </div>
          )
        })}
      </div>

      <div className="bg-secondary/30 border border-border/50 rounded-xl p-3 flex justify-between items-center text-xs">
        <div>
          <span className="text-muted-foreground block">{isPt ? "Mês Selecionado" : "Selected Month"}</span>
          <span className="font-bold text-foreground text-sm">{activeMonth}</span>
        </div>
        <div className="text-right">
          <span className="text-muted-foreground block">{isPt ? "Valor Consolidado" : "Consolidated Value"}</span>
          <span className="font-bold text-primary text-sm">
            {metric === "faturamento"
              ? `R$ ${data[activeMonth].faturamento.toLocaleString("pt-BR")}`
              : metric === "margem"
              ? `${data[activeMonth].margem}%`
              : `${data[activeMonth].metas}%`}
          </span>
        </div>
      </div>
    </div>
  )
}

/* 3. Project Tracker / Construct Simulator Component */
function ProjectTrackerSimulator({ language }: { language: string }) {
  const isPt = language === "pt"
  const [tasks, setTasks] = useState([
    { id: 1, text: isPt ? "Cronograma Físico-Financeiro" : "Financial Timeline Schedule", done: true },
    { id: 2, text: isPt ? "Sincronização com Banco Supabase" : "Supabase Database Synchronization", done: true },
    { id: 3, text: isPt ? "Integração do Google Maps SDK" : "Google Maps SDK Integration", done: false },
    { id: 4, text: isPt ? "Geração Automática de Relatórios (.docx)" : "Automated Docx Report Generation", done: false },
  ])

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  const doneCount = tasks.filter(t => t.done).length
  const percent = Math.round((doneCount / tasks.length) * 100)

  return (
    <div className="space-y-4 font-sans text-sm">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <h5 className="font-semibold text-primary flex items-center gap-1.5">
          <Building2 className="h-4 w-4" />
          {isPt ? "Gestão de Obras & Projetos" : "Construction Project Management"}
        </h5>
        <span className="text-xs text-muted-foreground">NextJS 16 + Supabase Postgres Database Mock</span>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs font-semibold">
          <span className="text-muted-foreground">{isPt ? "Progresso do Projeto" : "Project Progress"}</span>
          <span className="text-primary">{percent}%</span>
        </div>
        <div className="h-2.5 bg-secondary rounded-full overflow-hidden border border-border/50 shadow-inner">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 0.5 }}
            className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full"
          />
        </div>
      </div>

      <div className="space-y-2.5 bg-secondary/25 p-4 rounded-xl border border-border/50">
        <span className="text-xs text-muted-foreground font-semibold block mb-1">
          {isPt ? "Marcos e Entregas Administrativas" : "Administrative Milestones"}
        </span>
        {tasks.map(task => (
          <div
            key={task.id}
            onClick={() => toggleTask(task.id)}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div
              className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                task.done
                  ? "bg-primary border-primary text-primary-foreground"
                  : "border-border bg-secondary/50 group-hover:border-primary/50"
              }`}
            >
              {task.done && <Check className="h-3 w-3 stroke-[3]" />}
            </div>
            <span className={`text-xs font-medium transition-colors ${task.done ? "line-through text-muted-foreground" : "text-foreground"}`}>
              {task.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* 4. API Sandbox Simulator Component */
function APISimulator({ language }: { language: string }) {
  const isPt = language === "pt"
  const [route, setRoute] = useState("/api/laudos/emitir")
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<any>(null)

  const routesResponses: Record<string, any> = {
    "/api/laudos/emitir": {
      status: 201,
      statusText: "Created",
      headers: {
        "content-type": "application/json",
        "x-powered-by": "Fastify",
        "cache-control": "no-store",
      },
      body: {
        success: true,
        laudo_id: "laudo_2026_06_9876",
        emissao: new Date().toISOString(),
        colaborador: "Victor Santos",
        sistema: "Central de Laudos Corporativos",
        ldap_status: "SYNCHRONIZED",
      },
    },
    "/api/auth/ldap": {
      status: 200,
      statusText: "OK",
      headers: {
        "content-type": "application/json",
        "x-powered-by": "Fastify",
      },
      body: {
        authenticated: true,
        uid: "victor.peixoto",
        mail: "victor.peixoto@cometa.com.br",
        roles: ["ADM_TI", "DEVELOPER_FULLSTACK"],
        session_expires: "4h",
      },
    },
    "/api/glpi/sync": {
      status: 200,
      statusText: "OK",
      headers: {
        "content-type": "application/json",
        "x-powered-by": "Fastify",
      },
      body: {
        sync_completed: true,
        tickets_imported: 42,
        unassigned_tickets: 3,
        execution_time_ms: 182,
        glpi_api_version: "2.1.0",
      },
    },
  }

  const handleSendRequest = () => {
    setLoading(true)
    setResponse(null)
    setTimeout(() => {
      setResponse(routesResponses[route])
      setLoading(false)
    }, 600)
  }

  return (
    <div className="space-y-4 font-mono text-sm h-full flex flex-col justify-between">
      <div className="flex items-center justify-between border-b border-border pb-3 font-sans">
        <h5 className="font-semibold text-primary">{isPt ? "Fastify API Playground" : "Fastify API Playground"}</h5>
        <span className="text-xs text-muted-foreground">LDAP Auth & GLPI Integrations Microservice</span>
      </div>

      <div className="flex gap-2">
        <select
          value={route}
          onChange={(e) => setRoute(e.target.value)}
          className="flex-1 bg-secondary border border-border rounded-lg px-3 py-2 text-xs font-semibold text-foreground focus:outline-none focus:border-primary"
        >
          <option value="/api/laudos/emitir">POST /api/laudos/emitir</option>
          <option value="/api/auth/ldap">POST /api/auth/ldap</option>
          <option value="/api/glpi/sync">GET /api/glpi/sync</option>
        </select>

        <Button
          onClick={handleSendRequest}
          disabled={loading}
          size="sm"
          className="bg-primary text-primary-foreground font-bold"
        >
          {loading ? (isPt ? "Enviando..." : "Sending...") : (isPt ? "ENVIAR REQUISIÇÃO" : "SEND REQUEST")}
        </Button>
      </div>

      <div className="flex-1 min-h-[170px] border border-border bg-black rounded-xl p-3 overflow-y-auto text-xs flex flex-col">
        {loading && (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground gap-2">
            <span className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            <span>CONNECTING TO FASTIFY SERVER...</span>
          </div>
        )}

        {!loading && !response && (
          <div className="flex-1 flex items-center justify-center text-muted-foreground text-center px-4 font-sans">
            {isPt ? "Selecione uma rota e clique em ENVIAR REQUISIÇÃO para testar a resposta JSON em tempo real." : "Select a route and click SEND REQUEST to inspect the live REST API JSON response."}
          </div>
        )}

        {response && (
          <div className="space-y-3 font-mono text-[11px] leading-normal text-green-400">
            <div>
              <span className="text-slate-400 font-bold">HTTP/1.1 </span>
              <span className={`font-bold ${response.status === 201 || response.status === 200 ? "text-emerald-400" : "text-rose-400"}`}>
                {response.status} {response.statusText}
              </span>
            </div>

            <div>
              <span className="text-slate-500 font-semibold block">{isPt ? "// Headers de Resposta" : "// Response Headers"}</span>
              {Object.entries(response.headers).map(([k, v]: any) => (
                <div key={k}>
                  <span className="text-slate-400 font-medium">{k}:</span> <span className="text-yellow-400">{v}</span>
                </div>
              ))}
            </div>

            <div>
              <span className="text-slate-500 font-semibold block">{isPt ? "// Payload da Resposta" : "// Response Body JSON"}</span>
              <pre className="text-emerald-300 font-medium overflow-x-auto whitespace-pre-wrap">
                {JSON.stringify(response.body, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* 5. RPA / Terminal Simulator Component */
function RPASimulator({ language }: { language: string }) {
  const isPt = language === "pt"
  const [running, setRunning] = useState(false)
  const [logs, setLogs] = useState<string[]>([])

  const runRpaScript = () => {
    if (running) return
    setRunning(true)
    setLogs([])

    const scriptLogs = isPt
      ? [
          "[$] python bot_auditor.py --env production",
          "[+] Inicializando headless Chrome Driver via Selenium...",
          "[+] Efetuando login no portal SEFAZ com certificado digital...",
          "[+] Crawling de notas fiscais emitidas nas últimas 24 horas concluído.",
          "[+] Processando margens de lucro dos itens usando Pandas DataFrame...",
          "[!] Alerta: 2 notas fiscais apresentaram divergência de margem de custos.",
          "[+] Gerando planilha Excel formatada com mapa de calor de rentabilidade...",
          "[+] Exportando arquivo auditoria_margem_20260622.xlsx...",
          "[+] Efetuando upload seguro para Google Cloud Storage (Bucket: audit-margens)...",
          "[√] Robô finalizado com sucesso. 182 itens auditados. Tempo total: 4.8s."
        ]
      : [
          "[$] python bot_auditor.py --env production",
          "[+] Initializing headless Chrome Driver via Selenium...",
          "[+] Logging into SEFAZ Tax Portal using digital certificate...",
          "[+] Crawling of tax invoices issued in the last 24h completed.",
          "[+] Processing items profit margins using Pandas DataFrame...",
          "[!] Warning: 2 tax invoices presented margin/cost divergence.",
          "[+] Generating formatted Excel spreadsheet with profitability heatmap...",
          "[+] Exporting audit_margin_20260622.xlsx report file...",
          "[+] Securing upload to Google Cloud Storage (Bucket: audit-margins)...",
          "[√] Bot finished successfully. 182 items audited. Total time: 4.8s."
        ]

    let currentLogIndex = 0
    const addNextLog = () => {
      if (currentLogIndex < scriptLogs.length) {
        setLogs((prev) => [...prev, scriptLogs[currentLogIndex]])
        currentLogIndex++
        setTimeout(addNextLog, 450)
      } else {
        setRunning(false)
      }
    }
    addNextLog()
  }

  return (
    <div className="space-y-4 font-mono text-sm h-full flex flex-col justify-between">
      <div className="flex items-center justify-between border-b border-border pb-3 font-sans">
        <h5 className="font-semibold text-primary flex items-center gap-1.5">
          <TermIcon className="h-4 w-4" />
          {isPt ? "Auditor RPA - Terminal de Execução" : "RPA Auditor - Script Terminal"}
        </h5>
        <span className="text-xs text-muted-foreground">Python 3.12 (Pandas / Selenium) Script Exec</span>
      </div>

      <div className="flex-1 min-h-[180px] border border-border bg-[#050508] rounded-xl p-4 overflow-y-auto text-xs space-y-1.5 shadow-inner">
        {logs.length === 0 && (
          <div className="text-muted-foreground h-full flex items-center justify-center font-sans text-center px-4">
            {isPt ? "Clique em RODAR SCRIPT AUTOMATIZADO para ver a simulação de logs do robô em tempo real." : "Click RUN AUTOMATED SCRIPT to watch the robotic logs execute in real time."}
          </div>
        )}
        {logs.map((log, index) => {
          let color = "text-slate-300"
          if (log.startsWith("[+]")) color = "text-emerald-400"
          else if (log.startsWith("[!]")) color = "text-yellow-400"
          else if (log.startsWith("[√]")) color = "text-cyan-400 font-bold"
          else if (log.startsWith("[$]")) color = "text-slate-400 font-bold"

          return (
            <div key={index} className={`${color} leading-relaxed`}>
              {log}
            </div>
          )
        })}
      </div>

      <Button
        onClick={runRpaScript}
        disabled={running}
        className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-bold flex items-center justify-center gap-2"
      >
        <Play className="h-4 w-4 fill-current" />
        {running ? (isPt ? "Executando Robô..." : "Bot Running...") : (isPt ? "RODAR SCRIPT AUTOMATIZADO" : "RUN AUTOMATED SCRIPT")}
      </Button>
    </div>
  )
}

/* 6. Barber App Simulator Component */
function BarberSimulator({ language }: { language: string }) {
  const isPt = language === "pt"
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [bookingConfirmed, setBookingConfirmed] = useState(false)

  const services = [
    { id: "corte", name: isPt ? "Corte Clássico" : "Classic Haircut", price: "R$ 45" },
    { id: "barba", name: isPt ? "Barba Terapia" : "Beard Shave Therapy", price: "R$ 35" },
    { id: "combo", name: isPt ? "Cabelo & Barba" : "Haircut & Beard Combo", price: "R$ 70" },
  ]

  const times = ["09:00", "10:30", "14:00", "15:30", "17:00"]

  const handleBooking = () => {
    if (!selectedService || !selectedTime) return
    setBookingConfirmed(true)
  }

  return (
    <div className="space-y-4 font-sans text-sm h-full flex flex-col justify-between">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <h5 className="font-semibold text-primary flex items-center gap-1.5">
          <Calendar className="h-4 w-4" />
          {isPt ? "Dom Barbeiro - Agendamento Online" : "Dom Barbeiro - Online Booking Client"}
        </h5>
        <span className="text-xs text-muted-foreground">React PWA + Firebase Firestore Real-Time Sync Mock</span>
      </div>

      {bookingConfirmed ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-secondary/15 rounded-xl border border-primary/30 space-y-3">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
            <Check className="h-6 w-6 stroke-[3]" />
          </div>
          <div>
            <h6 className="font-bold text-sm text-foreground">{isPt ? "Agendamento Confirmado!" : "Appointment Confirmed!"}</h6>
            <p className="text-xs text-muted-foreground mt-1 max-w-[240px]">
              {isPt
                ? `Seu horário para ${services.find(s => s.id === selectedService)?.name} foi reservado para hoje às ${selectedTime}.`
                : `Your appointment for ${services.find(s => s.id === selectedService)?.name} is successfully scheduled for today at ${selectedTime}.`}
            </p>
          </div>
          <button
            onClick={() => {
              setBookingConfirmed(false)
              setSelectedService(null)
              setSelectedTime(null)
            }}
            className="text-xs text-primary font-bold hover:underline"
          >
            {isPt ? "Fazer outro agendamento" : "Make another appointment"}
          </button>
        </div>
      ) : (
        <div className="space-y-3 flex-1 overflow-y-auto">
          {/* Services Selector */}
          <div>
            <span className="text-xs font-semibold text-muted-foreground block mb-2">{isPt ? "Escolha o Serviço" : "Select Service"}</span>
            <div className="grid grid-cols-3 gap-2">
              {services.map(s => (
                <button
                  key={s.id}
                  onClick={() => setSelectedService(s.id)}
                  className={`p-2.5 rounded-lg border text-left flex flex-col justify-between transition-all ${
                    selectedService === s.id
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-secondary/35 text-foreground hover:border-primary/50"
                  }`}
                >
                  <span className="text-xs font-semibold block">{s.name}</span>
                  <span className="text-xs text-muted-foreground font-bold mt-1.5">{s.price}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Time Selector */}
          <div>
            <span className="text-xs font-semibold text-muted-foreground block mb-2">{isPt ? "Horários Disponíveis (Hoje)" : "Available Times (Today)"}</span>
            <div className="flex flex-wrap gap-1.5">
              {times.map(time => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                    selectedTime === time
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-secondary/35 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          <Button
            onClick={handleBooking}
            disabled={!selectedService || !selectedTime}
            className="w-full bg-primary text-primary-foreground font-bold mt-2"
          >
            {isPt ? "CONFIRMAR RESERVA" : "BOOK APPOINTMENT"}
          </Button>
        </div>
      )}
    </div>
  )
}
