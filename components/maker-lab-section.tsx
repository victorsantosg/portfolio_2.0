"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  Printer,
  Cpu,
  Box,
  CheckCircle2,
  ArrowUpRight,
  ShieldCheck,
  Flame,
  TrendingUp,
  Warehouse,
  Image as ImageIcon,
  AlertTriangle,
  ExternalLink,
  Layers,
  Activity,
  Maximize2,
  X,
} from "lucide-react"
import { SandboxViewer } from "@/components/three/sandbox-viewer"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export function MakerLabSection() {
  const [activeTab, setActiveTab] = useState<"3d_demo" | "real_app">("3d_demo")
  const [selectedRealImage, setSelectedRealImage] = useState<string>("/wms-estoque-real-1.png")
  const [isRealFullscreenOpen, setIsRealFullscreenOpen] = useState(false)

  // ESC key listener for real app fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isRealFullscreenOpen) {
        setIsRealFullscreenOpen(false)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isRealFullscreenOpen])

  const capabilities = [
    {
      icon: <Warehouse className="w-5 h-5 text-amber-400" />,
      title: "Digital Twin & Heatmap WMS (Three.js WebGL)",
      description: "Renderização em tempo real de centenas de posições de estoque (Ruas, Módulos e Níveis) com gradiente térmico de demanda para reorganização da curva ABC.",
    },
    {
      icon: <TrendingUp className="w-5 h-5 text-orange-400" />,
      title: "Impacto Operacional & Otimização de Picking",
      description: "Redução de até 42% no tempo de deslocamento de operadores no armazém, eliminando pontos cegos e acelerando o fluxo de expedição corporativa.",
    },
    {
      icon: <Printer className="w-5 h-5 text-amber-400" />,
      title: "Do Digital à Impressão 3D Real (3MF / STL)",
      description: "Modelagem paramétrica estanque (100% Watertight), simulação de fatiamento em camadas (0.2mm) e manufatura aditiva para maquetes industriais e protótipos físicos.",
    },
  ]

  return (
    <section id="maker-lab" className="relative py-28 overflow-hidden bg-black/40 border-t border-border/40">
      {/* Background Glows */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-6xl">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-mono mb-4 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <Flame className="w-3.5 h-3.5" />
            <span>3D DIGITAL TWIN • ENGENHARIA LOGÍSTICA & WMS</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 text-foreground">
            Do Conceito Digital à <span className="text-gradient">Operação & Impressão 3D Real</span>
          </h2>

          <p className="text-muted-foreground max-w-3xl text-base md:text-lg">
            Aplicação prática de visualização 3D de alta performance e manufatura aditiva. Desenvolvi o <strong>Digital Twin do Armazém com Heatmap Interativo</strong> para transformar dados brutos de estoque em decisões visuais instantâneas e protótipos físicos de engenharia.
          </p>

          {/* Switcher Tabs: 3D Interativo vs Aplicação Real em Produção */}
          <div className="flex items-center gap-2 p-1.5 bg-gray-950/80 border border-amber-500/30 rounded-2xl mt-8 shadow-xl">
            <button
              onClick={() => setActiveTab("3d_demo")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-mono font-bold transition-all cursor-pointer ${
                activeTab === "3d_demo"
                  ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span>🎮 Visualizador 3D Interativo (Demonstrativo)</span>
            </button>

            <button
              onClick={() => setActiveTab("real_app")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-mono font-bold transition-all cursor-pointer ${
                activeTab === "real_app"
                  ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>📸 Aplicação Real em Produção (WMS Cometa)</span>
            </button>
          </div>
        </div>

        {/* Main Content Showcase */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive 3D Sandbox OR Real Production Showcase */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {activeTab === "3d_demo" ? (
                <motion.div
                  key="3d_demo"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                >
                  <SandboxViewer />
                </motion.div>
              ) : (
                <motion.div
                  key="real_app"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gray-950/95 border border-amber-500/40 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl"
                >
                  {/* Header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-amber-500/20 bg-gray-900/80">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                      <span className="text-xs font-mono font-bold text-emerald-400 uppercase">
                        SISTEMA WMS EM PRODUÇÃO • CD COMETA
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold hidden sm:inline">
                        +11.270 POSIÇÕES REAIS
                      </span>

                      <Button
                        size="sm"
                        onClick={() => setIsRealFullscreenOpen(true)}
                        className="h-8 text-xs font-mono font-bold bg-amber-500 text-black hover:bg-amber-400 gap-1.5 rounded-xl shadow-lg shadow-amber-500/20 cursor-pointer"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                        <span>⛶ Tela Cheia</span>
                      </Button>
                    </div>
                  </div>

                  {/* Real Image Viewport */}
                  <div className="relative w-full aspect-video bg-black overflow-hidden group">
                    <img
                      src={selectedRealImage}
                      alt="Aplicação Real do Armazém 3D WMS em Produção"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Hover Click-to-Expand Overlay */}
                    <div
                      onClick={() => setIsRealFullscreenOpen(true)}
                      className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer z-10"
                    >
                      <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black/85 border border-amber-500/50 text-amber-300 text-xs font-mono font-bold shadow-2xl backdrop-blur-md">
                        <Maximize2 className="w-4 h-4 text-amber-400" />
                        <span>Clique para Expandir em Tela Cheia</span>
                      </div>
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

                    {/* Image Selector Pills */}
                    <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 z-20">
                      <div className="flex flex-wrap items-center gap-1.5 bg-black/85 p-1 rounded-xl border border-amber-500/30 backdrop-blur-md">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedRealImage("/wms-estoque-real-1.png")
                          }}
                          className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                            selectedRealImage === "/wms-estoque-real-1.png"
                              ? "bg-amber-500 text-black font-bold"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          1. Visão Frontal / Docas
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedRealImage("/wms-estoque-real-2.png")
                          }}
                          className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                            selectedRealImage === "/wms-estoque-real-2.png"
                              ? "bg-amber-500 text-black font-bold"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          2. Visão Isométrica Geral
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedRealImage("/wms-estoque-real-3.png")
                          }}
                          className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                            selectedRealImage === "/wms-estoque-real-3.png"
                              ? "bg-amber-500 text-black font-bold"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          3. Câmara Fria & Corredores
                        </button>
                      </div>

                      <span className="text-[11px] font-mono text-amber-300 bg-black/85 px-2.5 py-1 rounded-lg border border-amber-500/30 backdrop-blur-md hidden sm:inline">
                        100% Integrado ao ERP Cometa
                      </span>
                    </div>
                  </div>

                  {/* Real WMS Metrics Summary */}
                  <div className="p-5 space-y-4 text-xs font-mono bg-gray-900/60 border-t border-amber-500/20">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="p-2.5 rounded-xl bg-black/60 border border-border/60">
                        <span className="text-[10px] text-muted-foreground uppercase">Altíssimo Giro (A)</span>
                        <p className="text-sm font-bold text-red-400 mt-0.5">16 posições</p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-black/60 border border-border/60">
                        <span className="text-[10px] text-muted-foreground uppercase">Médio Giro (B)</span>
                        <p className="text-sm font-bold text-amber-400 mt-0.5">923 posições</p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-black/60 border border-border/60">
                        <span className="text-[10px] text-muted-foreground uppercase">Giro Regular</span>
                        <p className="text-sm font-bold text-emerald-400 mt-0.5">2.403 posições</p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-black/60 border border-border/60">
                        <span className="text-[10px] text-muted-foreground uppercase">Sem Giro / Pulmão</span>
                        <p className="text-sm font-bold text-blue-400 mt-0.5">7.931 posições</p>
                      </div>
                    </div>

                    <p className="text-muted-foreground leading-relaxed text-[11px]">
                      A tela em produção renderiza a totalidade do Centro de Distribuição em tempo real com Three.js e WebGL, permitindo auditoria por rua/módulo, controle de vencimentos por FEFO e rotas automáticas de separação.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Disclaimer explicativo do 3D de teste */}
            <div className="mt-4 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-amber-300">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1 font-mono">
                <span className="font-bold text-amber-400 uppercase block text-[11px]">
                  Nota de Engenharia & Performance:
                </span>
                <p className="text-muted-foreground text-[11px] leading-relaxed">
                  O visualizador 3D interativo exibido acima utiliza dados e amostragem geométrica reduzida para permitir testes fluidos a 60 FPS diretamente no portfólio. A aplicação em produção conta com mais de <strong>11.200 posições reais de estoque</strong> integradas ao banco PostgreSQL.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Pipeline Cards & Features */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            {capabilities.map((cap, i) => (
              <motion.div
                key={cap.title}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="p-5 rounded-2xl bg-gray-950/80 border border-border/60 hover:border-primary/50 transition-all shadow-lg group"
              >
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-gray-900 border border-border/80 group-hover:border-primary/40 transition-colors">
                    {cap.icon}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                      {cap.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {cap.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Quality Seal / Specs Box */}
            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 flex items-center justify-between mt-2">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-primary" />
                <div className="text-xs font-mono">
                  <div className="text-foreground font-semibold">100% Watertight & WebGL 60FPS</div>
                  <div className="text-muted-foreground">Pronto para WMS Real & FDM / SLA</div>
                </div>
              </div>

              <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-primary/20 text-primary border border-primary/30 font-bold">
                INDUSTRIAL GRADE
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* FULLSCREEN LIGHTBOX MODAL: Aplicação Real em Produção (WMS Cometa) */}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {isRealFullscreenOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25 }}
                className="fixed inset-0 z-[99999999] bg-[#050505]/98 backdrop-blur-2xl flex flex-col p-3 sm:p-6 select-none w-screen h-screen m-0"
              >
                {/* Top Fullscreen Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-gray-900/90 border border-amber-500/30 mb-3 shadow-2xl">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                    <div>
                      <div className="text-xs sm:text-sm font-mono font-bold text-emerald-400 uppercase">
                        SISTEMA WMS EM PRODUÇÃO • CD COMETA (TELA CHEIA FULL HD)
                      </div>
                      <div className="text-[11px] text-muted-foreground font-mono">
                        Renderização WebGL 3D • Auditoria de Estoque em Tempo Real
                      </div>
                    </div>
                  </div>

                  {/* Perspective Switcher Pills in Fullscreen */}
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-1.5 bg-black/85 p-1 rounded-xl border border-amber-500/30">
                      <button
                        onClick={() => setSelectedRealImage("/wms-estoque-real-1.png")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                          selectedRealImage === "/wms-estoque-real-1.png"
                            ? "bg-amber-500 text-black font-bold shadow-md"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        1. Visão Frontal / Docas
                      </button>
                      <button
                        onClick={() => setSelectedRealImage("/wms-estoque-real-2.png")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                          selectedRealImage === "/wms-estoque-real-2.png"
                            ? "bg-amber-500 text-black font-bold shadow-md"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        2. Visão Isométrica Geral
                      </button>
                      <button
                        onClick={() => setSelectedRealImage("/wms-estoque-real-3.png")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                          selectedRealImage === "/wms-estoque-real-3.png"
                            ? "bg-amber-500 text-black font-bold shadow-md"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        3. Câmara Fria & Corredores
                      </button>
                    </div>

                    <Button
                      size="sm"
                      onClick={() => setIsRealFullscreenOpen(false)}
                      className="bg-red-500/20 text-red-300 border border-red-500/40 hover:bg-red-500 hover:text-white text-xs font-mono font-bold rounded-xl h-9 gap-1.5 shadow-lg"
                    >
                      <X className="w-4 h-4" />
                      <span>Fechar (ESC)</span>
                    </Button>
                  </div>
                </div>

                {/* Massive Fullscreen Image Canvas */}
                <div className="flex-1 relative rounded-2xl overflow-hidden bg-black border border-amber-500/20 shadow-2xl flex items-center justify-center">
                  <img
                    src={selectedRealImage}
                    alt="WMS Cometa Produção Fullscreen"
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Bottom Fullscreen Telemetry Bar */}
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-gray-900/90 border border-amber-500/30 text-xs font-mono">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                      +11.270 POSIÇÕES ATIVAS
                    </span>
                    <span className="text-muted-foreground hidden sm:inline">
                      Integração Direta: ERP RPINFO • PostgreSQL • Three.js WebGL 60 FPS
                    </span>
                  </div>

                  <span className="text-amber-400 font-bold">
                    ESC para sair da tela cheia
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </section>
  )
}
