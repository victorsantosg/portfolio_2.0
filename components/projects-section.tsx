"use client"

import { useState, useEffect, useRef } from "react"
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
  X,
  ChevronLeft,
  ChevronRight
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

        <div className="space-y-12">
          {/* Row 1: Corporativos */}
          {(activeFilter === "all" || activeFilter === "corporate") && (
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
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
                setZoomImage={setZoomImage}
              />
            </motion.div>
          )}

          {/* Row 2: Pessoais */}
          {(activeFilter === "all" || activeFilter === "personal") && (
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
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
                setZoomImage={setZoomImage}
              />
            </motion.div>
          )}
        </div>
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
              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
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
              </div>

              {/* Dialog Footer */}
              <div className="border-t border-border bg-secondary/20 p-4 flex flex-col sm:flex-row items-center gap-3">
                {selectedProject.isPrivate ? (
                  <div className="w-full sm:flex-1 text-xs text-amber-500 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2.5 flex items-center gap-2 font-medium">
                    <span className="h-2 w-2 rounded-full bg-amber-500 shrink-0 animate-pulse" />
                    {language === "pt"
                      ? "Código-fonte restrito e projeto não publicado externamente por questões de confidencialidade/uso interno."
                      : "Source code restricted and project not published externally due to confidentiality/internal use."}
                  </div>
                ) : (
                  <>
                    <Button
                      asChild
                      className="w-full sm:flex-1 bg-primary text-primary-foreground font-semibold"
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
                      className="w-full sm:flex-1 font-semibold"
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
  setZoomImage,
}: {
  projects: any[]
  openProjectDetails: (project: any) => void
  setZoomImage: (img: string) => void
}) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)

  const checkScrollLimits = () => {
    const el = scrollRef.current
    if (!el) return
    setShowLeftArrow(el.scrollLeft > 5)
    setShowRightArrow(el.scrollLeft < el.scrollWidth - el.clientWidth - 5)
  }

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0) {
        e.preventDefault()
        el.scrollLeft += e.deltaY * 1.5
      }
    }

    el.addEventListener("wheel", handleWheel, { passive: false })
    el.addEventListener("scroll", checkScrollLimits)

    checkScrollLimits()
    const timer = setTimeout(checkScrollLimits, 300)
    window.addEventListener("resize", checkScrollLimits)

    return () => {
      el.removeEventListener("wheel", handleWheel)
      el.removeEventListener("scroll", checkScrollLimits)
      window.removeEventListener("resize", checkScrollLimits)
      clearTimeout(timer)
    }
  }, [projects])

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current
    if (!el) return
    const cardWidth = 330
    const scrollAmount = direction === "left" ? -cardWidth : cardWidth
    el.scrollBy({ left: scrollAmount, behavior: "smooth" })
  }

  return (
    <div className="relative group/row w-full">
      {showLeftArrow && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2.5 rounded-full bg-background/90 hover:bg-background border border-border text-foreground shadow-lg hover:scale-110 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
          aria-label="Rolar para esquerda"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}

      {showRightArrow && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2.5 rounded-full bg-background/90 hover:bg-background border border-border text-foreground shadow-lg hover:scale-110 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
          aria-label="Rolar para direita"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      )}

      <div
        ref={scrollRef}
        className="flex overflow-x-auto gap-5 pb-4 pt-1 no-scrollbar select-none snap-x snap-mandatory"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            className="min-w-[280px] sm:min-w-[310px] max-w-[310px] flex-shrink-0 snap-start"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05, duration: 0.5, ease: "easeOut" }}
          >
            <ProjectCard
              project={project}
              onViewDetails={() => openProjectDetails(project)}
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
  onImageClick,
}: {
  project: any
  onViewDetails: () => void
  onImageClick: (imageUrl: string) => void
}) {
  const { language, t } = useLanguage()
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="group h-full rounded-2xl bg-card border border-border/50 overflow-hidden hover:border-primary/50 hover:shadow-[0_15px_30px_rgba(99,102,241,0.15)] dark:hover:shadow-[0_15px_30px_rgba(99,102,241,0.08)] transition-all duration-300 flex flex-col justify-between"
    >
      <div>
        <div 
          className={`relative aspect-video overflow-hidden cursor-pointer group/img ${!project.image ? "bg-secondary" : "bg-card"}`}
          onClick={onViewDetails}
        >
          {project.image ? (
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
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

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <div className="p-4">
          <h3 className="font-bold text-base mb-1.5 group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          <p className="text-xs text-muted-foreground mb-3 line-clamp-2 leading-relaxed">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-1.5 mb-3">
            {project.tags.slice(0, 4).map((tag: string) => (
              <span
                key={tag}
                className="text-[10px] px-1.5 py-0.5 rounded-md bg-secondary text-muted-foreground border border-border/20"
              >
                {tag}
              </span>
            ))}
            {project.tags.length > 4 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-secondary text-muted-foreground">
                +{project.tags.length - 4}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 pt-0 flex flex-col gap-2">
        {project.isPrivate && (
          <div className="text-[10px] text-amber-500/80 bg-amber-500/10 border border-amber-500/20 rounded-md px-2 py-1 flex items-center gap-1.5 font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0 animate-pulse" />
            {language === "pt"
              ? "Código privado (Projeto interno de rede)"
              : "Private code (Internal network project)"}
          </div>
        )}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={onViewDetails}
            className="flex-1 text-xs py-1 h-8 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 font-semibold"
          >
            {t.projects.btnDetails}
          </Button>
          {!project.isPrivate ? (
            <Button
              size="sm"
              variant="outline"
              asChild
              className="h-8 w-8 p-0 border-border hover:border-primary transition-colors flex items-center justify-center"
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
              className="h-8 w-8 rounded-md border border-border bg-muted/30 text-muted-foreground flex items-center justify-center cursor-help"
              title={
                language === "pt"
                  ? "Código privado por se tratar de um projeto interno."
                  : "Private code due to being an internal project."
              }
            >
              <Github className="h-3.5 w-3.5 opacity-40" />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
