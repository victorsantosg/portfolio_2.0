"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion"
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
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
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
import { jarvisVariants } from "@/lib/animations"

export function ProjectsSection() {
  const { language, t } = useLanguage()
  const [activeFilter, setActiveFilter] = useState("all")
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null)
  const [zoomImage, setZoomImage] = useState<string | null>(null)

  const projects = [
    {
      id: 1,
      isPrivate: true,
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
      isPrivate: true,
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
      isPrivate: true,
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
      isPrivate: true,
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
      isPrivate: true,
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
      image: "/chatbot_ia_cover.png",
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
      isPrivate: true,
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
  }

  const openInHolodeck = (project: any) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("open-holodeck-project", {
          detail: { project, id: project.id, projectId: project.id },
        })
      )
    }
  }

  return (
    <section id="projetos" className="relative py-20 md:py-28 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
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
          variants={jarvisVariants}
          custom={{ direction: "bottom", delay: 0.2 }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
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

        <div className="space-y-12">
          {/* Row 1: Corporativos */}
          {(activeFilter === "all" || activeFilter === "corporate") && (
            <motion.div
              layout
              variants={jarvisVariants}
              custom={{ direction: "left", delay: 0.3 }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              exit={{ opacity: 0, y: 20 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between border-b border-border/20 pb-2">
                <h3 className="text-lg font-semibold flex items-center gap-2 border-l-4 border-primary pl-3">
                  {t.projects.filters.corporate}
                </h3>
              </div>
              <HorizontalScrollRow
                projects={projects.filter((p) => p.category === "corporate")}
                openProjectDetails={openProjectDetails}
                openInHolodeck={openInHolodeck}
                setZoomImage={setZoomImage}
              />
            </motion.div>
          )}

          {/* Row 2: Pessoais */}
          {(activeFilter === "all" || activeFilter === "personal") && (
            <motion.div
              layout
              variants={jarvisVariants}
              custom={{ direction: "right", delay: 0.4 }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              exit={{ opacity: 0, y: 20 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between border-b border-border/20 pb-2">
                <h3 className="text-lg font-semibold flex items-center gap-2 border-l-4 border-primary pl-3">
                  {t.projects.filters.personal}
                </h3>
              </div>
              <HorizontalScrollRow
                projects={projects.filter((p) => p.category === "personal")}
                openProjectDetails={openProjectDetails}
                openInHolodeck={openInHolodeck}
                setZoomImage={setZoomImage}
              />
            </motion.div>
          )}
        </div>
      </div>

      <Dialog open={!!selectedProject} onOpenChange={(open) => !open && setSelectedProjectId(null)}>
        <DialogContent className="w-[95vw] sm:max-w-2xl md:max-w-3xl max-h-[90vh] bg-[#0c0a08]/95 backdrop-blur-2xl border border-[#ee7112]/50 p-0 overflow-hidden shadow-[0_25px_70px_rgba(238,113,18,0.25)] rounded-2xl flex flex-col">
          <div className="flex items-center justify-between border-b border-[#ee7112]/20 px-4 sm:px-6 py-3.5 bg-gradient-to-r from-[#18120c] via-[#0f0c08] to-[#18120c] shrink-0">
            <DialogTitle className="text-base sm:text-xl font-bold flex items-center gap-3 text-foreground truncate pr-6">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ee7112] animate-pulse shrink-0" />
              <span className="truncate">{selectedProject?.title}</span>
            </DialogTitle>
          </div>

          {selectedProject && (
            <div className="flex flex-col flex-1 overflow-hidden min-h-0">
              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                <div 
                  className="aspect-video rounded-xl bg-secondary overflow-hidden relative border border-border/50 shadow-inner cursor-zoom-in max-h-[320px]"
                  onClick={() => setZoomImage(selectedProject.image)}
                >
                  <Image
                    src={selectedProject.image}
                    alt={selectedProject.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4 min-w-0">
                    <div className="min-w-0">
                      <h4 className="font-semibold text-primary flex items-center gap-2 mb-2">
                        <Zap className="h-4 w-4 shrink-0" />
                        <span>{t.projects.challenge}</span>
                      </h4>
                      <p className="text-muted-foreground text-sm leading-relaxed break-words">
                        {selectedProject.details.challenge}
                      </p>
                    </div>

                    <div className="min-w-0">
                      <h4 className="font-semibold text-primary flex items-center gap-2 mb-2">
                        <Code className="h-4 w-4 shrink-0" />
                        <span>{t.projects.solution}</span>
                      </h4>
                      <p className="text-muted-foreground text-sm leading-relaxed break-words">
                        {selectedProject.details.solution}
                      </p>
                    </div>
                  </div>

                  <div className="min-w-0">
                    <h4 className="font-semibold mb-3">{t.projects.stackTitle}</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedProject.details.techStack.map((tech: string) => (
                        <Badge
                          key={tech}
                          variant="secondary"
                          className="bg-secondary text-foreground hover:bg-secondary/80 border border-border/30 text-xs"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Dialog Footer */}
              <div className="border-t border-border/40 bg-secondary/30 p-3 sm:p-4 flex flex-col gap-2.5 shrink-0">
                <Button
                  onClick={() => {
                    const p = selectedProject
                    setSelectedProjectId(null)
                    openInHolodeck(p)
                  }}
                  className="w-full bg-gradient-to-r from-sky-500 via-sky-400 to-amber-500 hover:from-sky-400 hover:to-amber-400 text-black font-extrabold shadow-[0_0_20px_rgba(56,189,248,0.35)] cursor-pointer text-xs sm:text-sm h-10 rounded-xl flex items-center justify-center gap-2"
                >
                  <Sparkles className="h-4 w-4 text-black shrink-0" />
                  <span>Projetar no Holodeck 3D (Exploded View & Slicer)</span>
                </Button>

                <div className="flex flex-col sm:flex-row items-center gap-2 w-full">
                  {selectedProject.isPrivate ? (
                    <div className="w-full text-xs text-amber-500 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2 flex items-center gap-2 font-medium">
                      <span className="h-2 w-2 rounded-full bg-amber-500 shrink-0 animate-pulse" />
                      <span className="leading-snug">
                        {language === "pt"
                          ? "Código-fonte restrito e projeto não publicado externamente por questões de confidencialidade/uso interno."
                          : "Source code restricted and project not published externally due to confidentiality/internal use."}
                      </span>
                    </div>
                  ) : (
                    <>
                      <Button
                        asChild
                        className="w-full sm:flex-1 bg-primary text-primary-foreground font-semibold h-9 rounded-xl text-xs sm:text-sm"
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
                        className="w-full sm:flex-1 font-semibold h-9 rounded-xl text-xs sm:text-sm"
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
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Image Zoom Modal (Lightbox) */}
      <Dialog open={!!zoomImage} onOpenChange={(open) => !open && setZoomImage(null)}>
        <DialogContent 
          className="max-w-[95vw] md:max-w-[85vw] max-h-[90vh] p-1 bg-black/95 border-none flex items-center justify-center overflow-hidden shadow-2xl"
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

function HorizontalScrollRow({
  projects,
  openProjectDetails,
  openInHolodeck,
  setZoomImage,
}: {
  projects: any[]
  openProjectDetails: (project: any) => void
  openInHolodeck: (project: any) => void
  setZoomImage: (img: string) => void
}) {
  return (
    <div className="w-full">
      <div className="grid grid-cols-3 gap-3 sm:gap-6 lg:grid-cols-4 pt-1">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            className="w-full flex-shrink-0"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05, duration: 0.5, ease: "easeOut" }}
          >
            <ProjectCard
              project={project}
              onViewDetails={() => openProjectDetails(project)}
              onHolodeckClick={() => openInHolodeck(project)}
              onImageClick={setZoomImage}
            />
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function ProjectCard({
  project,
  onViewDetails,
  onHolodeckClick,
  onImageClick,
}: {
  project: any
  onViewDetails: () => void
  onHolodeckClick: () => void
  onImageClick: (imageUrl: string) => void
}) {
  const { language, t } = useLanguage()
  const cardRef = useRef<HTMLDivElement>(null)
  const [isClicking, setIsClicking] = useState(false)

  // 3D Motion Values with Amplified Physics for intense Card Tilt
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springConfig = { damping: 14, stiffness: 300 }
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [22, -22]), springConfig)
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-25, 25]), springConfig)
  const glareX = useTransform(mouseX, [-0.5, 0.5], ["0%", "100%"])
  const glareY = useTransform(mouseY, [-0.5, 0.5], ["0%", "100%"])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    mouseX.set(x)
    mouseY.set(y)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  const handleClick = (e: React.MouseEvent) => {
    setIsClicking(true)
    setTimeout(() => setIsClicking(false), 400)
    onHolodeckClick()
  }

  return (
    <div style={{ perspective: 900 }} className="h-full py-2">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        whileHover={{
          y: -16,
          scale: 1.06,
          transition: { duration: 0.25, ease: "easeOut" },
        }}
        whileTap={{
          scale: 0.94,
          rotateX: 8,
          transition: { duration: 0.1 },
        }}
        className="group h-full rounded-2xl bg-gradient-to-b from-[#181410] via-[#0e0c0a] to-[#070605] border border-border/50 overflow-hidden hover:border-[#ee7112] hover:shadow-[0_30px_70px_rgba(238,113,18,0.45),0_0_35px_rgba(238,113,18,0.3)] transition-all duration-300 flex flex-col justify-between relative cursor-pointer select-none"
      >
        {/* Intense Holographic Specular Glare in #ee7112 / Gold */}
        <motion.div
          className="absolute inset-0 z-30 pointer-events-none opacity-0 group-hover:opacity-80 mix-blend-screen transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle 320px at ${glareX} ${glareY}, rgba(238, 113, 18, 0.6) 0%, rgba(251, 191, 36, 0.25) 35%, transparent 75%)`,
          }}
        />

        {/* 3D Holographic Vertical Scan Beam on Hover */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-40 h-24 bg-gradient-to-b from-[#ee7112]/40 via-amber-400/20 to-transparent blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-30" />

        {/* 3D Holographic Corner Accent Brackets */}
        <div className="absolute top-2.5 right-2.5 w-4 h-4 border-t-2 border-r-2 border-[#ee7112]/40 group-hover:border-[#ee7112] group-hover:shadow-[0_0_10px_#ee7112] transition-all duration-300 z-30 pointer-events-none rounded-tr" />
        <div className="absolute bottom-2.5 left-2.5 w-4 h-4 border-b-2 border-l-2 border-[#ee7112]/40 group-hover:border-[#ee7112] group-hover:shadow-[0_0_10px_#ee7112] transition-all duration-300 z-30 pointer-events-none rounded-bl" />

        {/* 3D Click Shockwave Pulse */}
        {isClicking && (
          <motion.div
            initial={{ scale: 0.3, opacity: 1 }}
            animate={{ scale: 2.4, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="absolute inset-0 z-40 bg-gradient-to-r from-[#ee7112]/40 via-amber-400/30 to-transparent pointer-events-none rounded-2xl"
          />
        )}

        {/* 3D Layer 1: Image & Floating Badge (Z: 55px) */}
        <div style={{ transform: "translateZ(55px)", transformStyle: "preserve-3d" }}>
          <div className="relative aspect-video overflow-hidden bg-card rounded-t-xl">
            {project.image ? (
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover group-hover:scale-115 group-hover:brightness-110 transition-all duration-500"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                <Layers className="h-12 w-12" />
              </div>
            )}

            {/* Floating Category Hologram Badge (Z: 85px) */}
            <div
              className="absolute top-2.5 left-2.5 sm:top-3.5 sm:left-3.5 z-10"
              style={{ transform: "translateZ(85px)" }}
            >
              <Badge
                className={`text-[9px] sm:text-xs font-semibold backdrop-blur-md shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_18px_rgba(238,113,18,0.6)] ${
                  project.category === "corporate"
                    ? "bg-[#ee7112]/30 text-[#ffedd5] border-[#ee7112]/60"
                    : "bg-emerald-500/30 text-emerald-200 border-emerald-400/60 shadow-[0_0_18px_rgba(16,185,129,0.5)]"
                }`}
              >
                {project.category === "corporate" ? "🏢 Corporativo" : "🚀 Pessoal"}
              </Badge>
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent opacity-40 group-hover:opacity-90 transition-opacity duration-300" />
          </div>

          {/* 3D Layer 2: Main Text Content (Z: 65px) */}
          <div style={{ transform: "translateZ(65px)" }} className="p-2.5 sm:p-4">
            <h3 className="font-bold text-[11px] sm:text-base leading-snug mb-1 sm:mb-1.5 text-foreground group-hover:text-[#ee7112] transition-colors line-clamp-2 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
              {project.title}
            </h3>
            <p className="hidden sm:block text-xs text-muted-foreground mb-3 line-clamp-2 leading-relaxed">
              {project.description}
            </p>

            <div className="hidden sm:flex flex-wrap gap-1 sm:gap-1.5 mb-0 sm:mb-1">
              {project.tags.slice(0, 2).map((tag: string) => (
                <span
                  key={tag}
                  className="text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-md bg-secondary/90 text-muted-foreground group-hover:text-amber-200 border border-border/40 group-hover:border-[#ee7112]/50 transition-colors shadow-sm"
                >
                  {tag}
                </span>
              ))}
              {project.tags.length > 2 && (
                <span className="text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-md bg-secondary/60 text-muted-foreground">
                  +{project.tags.length - 2}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 3D Layer 3: Footer & CTA Buttons (Z: 75px) */}
        <div
          style={{ transform: "translateZ(75px)", transformStyle: "preserve-3d" }}
          className="p-2.5 sm:p-4 pt-0 flex flex-col gap-1.5 sm:gap-2"
        >
          {project.isPrivate && (
            <div className="hidden sm:flex text-[9px] sm:text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/25 rounded-md px-1.5 sm:px-2 py-1 items-center gap-1.5 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0 animate-ping" />
              <span className="line-clamp-1">
                {language === "pt" ? "Código corporativo seguro" : "Secure corporate code"}
              </span>
            </div>
          )}
          <div className="flex items-center gap-1.5 sm:gap-2 w-full">
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onHolodeckClick()
              }}
              className="flex-1 text-[10px] sm:text-xs py-0.5 h-7 sm:h-8 bg-sky-500/20 text-sky-300 hover:bg-sky-400 hover:text-black border border-sky-400/40 transition-all duration-300 font-bold shadow-[0_0_15px_rgba(56,189,248,0.2)] group-hover:shadow-[0_0_20px_rgba(56,189,248,0.4)] flex items-center justify-center gap-1 cursor-pointer"
              title="Explorar Réplica 3D no Holodeck com Exploded View"
            >
              <span>Holodeck 3D</span>
            </Button>
            {!project.isPrivate ? (
              <Button
                size="sm"
                variant="outline"
                asChild
                className="hidden sm:flex h-7 sm:h-8 w-7 sm:w-8 p-0 border-border hover:border-[#ee7112] hover:text-[#ee7112] transition-colors items-center justify-center"
                onClick={(e) => e.stopPropagation()}
              >
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Ver código no GitHub"
                >
                  <Github className="h-3.5 w-3.5" />
                </a>
              </Button>
            ) : (
              <div
                className="hidden sm:flex h-7 sm:h-8 w-7 sm:w-8 rounded-md border border-border bg-muted/30 text-muted-foreground items-center justify-center cursor-help"
                title={
                  language === "pt"
                    ? "Código privado por se tratar de um projeto interno."
                    : "Private code due to being an internal project."
                }
                onClick={(e) => e.stopPropagation()}
              >
                <Github className="h-3.5 w-3.5 opacity-40" />
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
