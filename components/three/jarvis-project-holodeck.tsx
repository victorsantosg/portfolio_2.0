"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion"
import {
  X,
  Sparkles,
  Layers,
  Cpu,
  Database,
  ExternalLink,
  Shield,
  Activity,
  Maximize2,
  Minimize2,
  Terminal,
  Zap,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export interface HoloProjectData {
  id: string
  title: string
  subtitle: string
  image: string
  tags: string[]
  metrics: { label: string; value: string; color?: string }[]
  architecture: string
  solution: string
  liveDemoHref?: string
}

export const HOLODECK_PROJECTS: Record<string, HoloProjectData> = {
  maker_lab: {
    id: "wms_3d",
    title: "DIGITAL TWIN WMS // 3D COMETA",
    subtitle: "Gêmeo Digital de Armazém Logístico com 11.200 Posições Reais",
    image: "/wms-estoque-real-1.png",
    tags: ["Three.js", "Next.js 16", "React 19", "FEFO Algorithm", "TypeScript", "Tailwind CSS v4"],
    metrics: [
      { label: "Capacidade Modelada", value: "11.200+ Posições", color: "text-amber-400" },
      { label: "Taxa de Atualização", value: "60 FPS ao Vivo", color: "text-sky-400" },
      { label: "Precisão de Rota", value: "Curva FEFO 100%", color: "text-emerald-400" },
    ],
    architecture: "Three.js WebGL + Shaders customizados para renderização de estantes porta-paletes, câmaras de frios e docas com mapa de calor térmico e telemetria tridimensional.",
    solution: "Eliminou perdas por vencimento e otimizou rotas de empilhadeiras em armazéns de alta rotação no Cometa Supermercados.",
    liveDemoHref: "#maker-lab",
  },
  projects: {
    id: "erp_inventario",
    title: "ERP INVENTÁRIO CORPORATIVO // FULL STACK",
    subtitle: "Sistema de Alta Concorrência para Auditoria e Gestão de Perdas",
    image: "/inventario_img_enhanced.png",
    tags: ["Next.js 16", "Fastify", "Prisma ORM", "PostgreSQL", "Docker", "TanStack Table"],
    metrics: [
      { label: "Latência de API", value: "28ms média", color: "text-sky-400" },
      { label: "Concorrência", value: "5.000+ Reqs/s", color: "text-amber-400" },
      { label: "Integridade de Dados", value: "100% ACID", color: "text-emerald-400" },
    ],
    architecture: "Backend resiliente em Node.js com Fastify e Prisma ORM para queries de altíssima velocidade em bancos PostgreSQL particionados.",
    solution: "Sincronização em tempo real de contagens cegas de estoque com prevenção ativa de divergências fiscais e operacionais.",
    liveDemoHref: "#projetos",
  },
}

export function JarvisProjectHolodeck() {
  const [activeProject, setActiveProject] = useState<HoloProjectData | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [viewMode, setViewMode] = useState<"visual" | "xray">("visual")

  // 3D Tilt Effect Values
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 })
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 })
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"])

  // Listen to Holodeck Trigger Events from Tour or Manual Action
  useEffect(() => {
    const handleOpen = (e: any) => {
      const stepId = e.detail?.stepId || e.detail?.id
      if (stepId && HOLODECK_PROJECTS[stepId]) {
        setActiveProject(HOLODECK_PROJECTS[stepId])
      } else if (e.detail?.project) {
        setActiveProject(e.detail.project)
      }
    }

    const handleClose = () => {
      setActiveProject(null)
    }

    window.addEventListener("open-holodeck-project", handleOpen)
    window.addEventListener("close-holodeck-project", handleClose)
    return () => {
      window.removeEventListener("open-holodeck-project", handleOpen)
      window.removeEventListener("close-holodeck-project", handleClose)
    }
  }, [])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5
    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  if (!activeProject) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9998] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl pointer-events-auto"
        onClick={() => setActiveProject(null)}
      >
        {/* Hologram Projection Laser Emitters (Top & Bottom) */}
        <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-sky-500/20 via-sky-500/5 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-amber-500/25 via-amber-500/5 to-transparent pointer-events-none" />

        {/* 3D Holo-Deck Main Card Container */}
        <motion.div
          initial={{ scale: 0.85, y: 40, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.85, y: 40, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 260 }}
          style={{
            rotateX: rotateX,
            rotateY: rotateY,
            transformStyle: "preserve-3d",
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={(e) => e.stopPropagation()}
          className={`relative w-full ${
            isExpanded ? "max-w-4xl" : "max-w-2xl"
          } rounded-3xl bg-gray-950/95 border-2 border-sky-400/60 shadow-[0_0_80px_rgba(56,189,248,0.35),0_0_30px_rgba(245,158,11,0.2)] overflow-hidden transition-all duration-300`}
        >
          {/* Holographic Scanline Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-sky-400/10 via-transparent to-amber-500/10 pointer-events-none" />

          {/* Top Header Bar */}
          <div className="relative z-10 flex items-center justify-between p-3 sm:p-4 border-b border-sky-500/30 bg-black/60 font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-ping" />
              <span className="font-extrabold text-sky-400 tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>HOLO-DECK // PROJEÇÃO 3D EM TEMPO REAL</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode(viewMode === "visual" ? "xray" : "visual")}
                className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  viewMode === "xray"
                    ? "bg-amber-500 text-black border-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.4)]"
                    : "bg-sky-500/15 border-sky-400/40 text-sky-300 hover:bg-sky-500/25"
                }`}
              >
                <Layers className="w-3 h-3" />
                <span>{viewMode === "xray" ? "⚡ Raio-X Ativo" : "🔍 Raio-X Arquitetura"}</span>
              </button>

              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 rounded-lg border border-white/10 text-muted-foreground hover:text-white transition-colors cursor-pointer"
                title={isExpanded ? "Reduzir" : "Expandir"}
              >
                {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={() => setActiveProject(null)}
                className="p-1.5 rounded-lg border border-white/20 text-muted-foreground hover:text-red-400 hover:border-red-500/50 transition-colors cursor-pointer ml-1"
                title="Fechar Holograma"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Hologram Body */}
          <div className="relative z-10 p-4 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto font-mono">
            {/* Title & Subtitle */}
            <div>
              <div className="text-[10px] text-amber-400 font-bold uppercase tracking-widest flex items-center gap-1.5 mb-1">
                <Activity className="w-3 h-3 animate-pulse" />
                <span>SISTEMA EM PRODUÇÃO AUDITADO POR J.A.R.V.I.S.</span>
              </div>
              <h3 className="text-base sm:text-xl font-extrabold text-white tracking-wide">
                {activeProject.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                {activeProject.subtitle}
              </p>
            </div>

            {/* Visual Screen Mockup or X-Ray Architecture Mode */}
            {viewMode === "visual" ? (
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-sky-400/50 bg-black shadow-2xl group">
                <img
                  src={activeProject.image}
                  alt={activeProject.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 mix-blend-screen"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent opacity-80 pointer-events-none" />
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/80 border border-sky-400/60 text-sky-300 text-[10px] font-bold">
                  RENDER 3D WEBGL
                </div>
              </div>
            ) : (
              /* X-Ray Architecture Breakdown View */
              <div className="p-4 rounded-2xl bg-black/90 border border-amber-500/40 space-y-3 shadow-inner">
                <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5 pb-2 border-b border-amber-500/20">
                  <Terminal className="w-4 h-4 text-amber-400" />
                  <span>DIAGNÓSTICO ARQUITETURAL // DESAFIO & SOLUÇÃO</span>
                </div>
                <div className="text-xs text-slate-200 leading-relaxed">
                  <p className="font-semibold text-sky-300 mb-1">⚙️ Arquitetura Técnica:</p>
                  <p className="text-slate-300 bg-gray-900/80 p-2 rounded-xl border border-white/5">{activeProject.architecture}</p>
                </div>
                <div className="text-xs text-slate-200 leading-relaxed">
                  <p className="font-semibold text-emerald-400 mb-1">🎯 Solução de Engenharia:</p>
                  <p className="text-slate-300 bg-gray-900/80 p-2 rounded-xl border border-white/5">{activeProject.solution}</p>
                </div>
              </div>
            )}

            {/* Live Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {activeProject.metrics.map((metric, idx) => (
                <div
                  key={idx}
                  className="p-2.5 sm:p-3 rounded-xl bg-black/60 border border-white/10 flex flex-col justify-between"
                >
                  <span className="text-[10px] text-muted-foreground">{metric.label}</span>
                  <span className={`text-sm sm:text-base font-extrabold ${metric.color || "text-white"} mt-0.5`}>
                    {metric.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Tech Stack Tags */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {activeProject.tags.map((tag, idx) => (
                <Badge
                  key={idx}
                  variant="outline"
                  className="px-2 py-0.5 text-[10px] bg-sky-500/10 border-sky-400/40 text-sky-300 rounded-lg"
                >
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 flex items-center justify-between gap-3 border-t border-white/10">
              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-400" />
                <span>Inspecionado por J.A.R.V.I.S. (1.3x)</span>
              </span>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={() => setActiveProject(null)}
                  className="h-8 px-4 bg-sky-500 hover:bg-sky-400 text-black font-bold text-xs rounded-xl shadow-lg shadow-sky-500/20 cursor-pointer"
                >
                  <span>Continuar Tour</span>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
