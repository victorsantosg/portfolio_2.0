"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Cpu,
  X,
  MessageCircle,
  Linkedin,
  Github,
  FileText,
  Volume2,
  VolumeX,
  RefreshCw,
  Terminal,
  Activity,
  Layers,
  ChevronRight,
  ShieldAlert,
  Radio,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

type JarvisState =
  | "welcome"
  | "missions"
  | "prototypes"
  | "architecture"
  | "telemetry"
  | "contact"

interface JarvisAssistantProps {
  isReady?: boolean
}

export function JarvisAssistant({ isReady = false }: JarvisAssistantProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [showStartupHolo, setShowStartupHolo] = useState(false)
  const [currentState, setCurrentState] = useState<JarvisState>("welcome")
  const [isTyping, setIsTyping] = useState(false)
  const [displayedText, setDisplayedText] = useState("")
  const [voiceEnabled, setVoiceEnabled] = useState(false)
  const messageEndRef = useRef<HTMLDivElement>(null)

  // Only open AFTER the initial intro and hero armor assembly effect have finished
  useEffect(() => {
    if (!isReady) return

    // Wait 3.8s after loading screen finishes to allow full armor assembly animation
    const timerHolo = setTimeout(() => {
      setShowStartupHolo(true)
      setIsOpen(true)
    }, 3800)

    return () => clearTimeout(timerHolo)
  }, [isReady])

  // Respostas programadas com a Persona Oficial do J.A.R.V.I.S.
  const dialogContent: Record<
    JarvisState,
    { title: string; text: string; sectionId?: string; actions: { label: string; nextState?: JarvisState; href?: string; isExternal?: boolean; icon?: any }[] }
  > = {
    welcome: {
      title: "PROTOCOLO DE INICIALIZAÇÃO // J.A.R.V.I.S.",
      text: "Sistemas online. Bem-vindo ao servidor central de Victor Santos, Convidado. Eu sou o J.A.R.V.I.S. e gerencio os arquivos, códigos e implantações do Criador.\n\nOs bancos de dados de backend e interfaces de usuário estão operando com 100% de eficiência. Compilando as opções de telemetria disponíveis:\n\n• Histórico de Missões: Trajetória profissional e sistemas desenvolvidos.\n• Protótipos Ativos: Repositórios de código e aplicações em produção.\n• Arquitetura do Traje: A stack tecnológica e frameworks dominados.\n\nPor onde deseja começar a varredura, Senhor?",
      actions: [
        { label: "📜 Histórico de Missões", nextState: "missions" },
        { label: "🚀 Protótipos Ativos", nextState: "prototypes" },
        { label: "⚙️ Arquitetura do Traje", nextState: "architecture" },
        { label: "📊 Telemetria de Eficiência", nextState: "telemetry" },
        { label: "💬 Falar com o Criador", nextState: "contact" },
      ],
    },
    missions: {
      title: "REGISTROS DE MISSÕES // HISTÓRICO PROFISSIONAL",
      text: "Acessando logs confidenciais de carreira do Criador:\n\n1. Cometa Supermercados (Missão Crítica):\nO Criador desenvolveu do zero o Sistema de Inventário Corporativo integrado ao ERP (RPINFO), confrontando estoque físico com sistêmico e eliminando distorções de perdas.\n\n2. Formação Acadêmica de Engenharia:\n• Graduação em Análise e Desenvolvimento de Sistemas — UNIFOR\n• Pós-Graduação em Desenvolvimento Web Full Stack — Faculdade INFNET\n\nTodos os registros estão autenticados e disponíveis para inspeção, Senhor.",
      sectionId: "#sobre",
      actions: [
        { label: "🚀 Ver Protótipos Ativos", nextState: "prototypes" },
        { label: "⚙️ Ver Stack Tecnológica", nextState: "architecture" },
        { label: "📋 Baixar Registros (Currículo)", href: "#orcamento" },
        { label: "🔄 Menu Principal", nextState: "welcome" },
      ],
    },
    prototypes: {
      title: "PROTÓTIPOS ATIVOS // SISTEMAS EM PRODUÇÃO",
      text: "Transmissão de telemetria dos protótipos de software desenvolvidos pelo Criador:\n\n• ERP Corporativo & Inventário: Painel analítico de missão crítica com Fastify, Prisma e Next.js.\n• Robôs de Automação ETL Python: Scripts inteligentes para extração e processamento massivo de dados com 0% de falha operacional.\n• Chatbot com IA & Visão Computacional: Assistentes inteligentes integrados a APIs de LLM e automação de fluxos desktop.\n\nDirecionando os sensores para a galeria de projetos...",
      sectionId: "#projetos",
      actions: [
        { label: "📂 Abrir Galeria de Projetos", href: "#projetos" },
        { label: "⚙️ Inspecionar Arquitetura", nextState: "architecture" },
        { label: "💬 Contatar o Criador (WhatsApp)", href: "https://wa.me/5585999556385", isExternal: true },
        { label: "🔄 Menu Principal", nextState: "welcome" },
      ],
    },
    architecture: {
      title: "ARQUITETURA DO TRAJE // TECH STACK",
      text: "Diagnóstico da armadura tecnológica do Criador:\n\n• Frontend Core: Next.js 16, React 19, TypeScript, Tailwind CSS v4, Three.js.\n• Backend & APIs: Node.js, Fastify, Prisma ORM, Python 3.12, RESTful APIs.\n• Banco de Dados: PostgreSQL, Supabase, Firebase, SQL otimizado.\n• Infraestrutura & Deploy: Docker, Coolify, Docker Compose, AWS Cloud.\n• Manufatura & IA 3D: Meshy AI Engine, Geração 3D e Fatiamento 3MF.\n\nTodos os subsistemas reportam estabilidade máxima de 60 FPS.",
      sectionId: "#stack",
      actions: [
        { label: "🔬 Inspecionar 3D Maker Lab", href: "#maker-lab" },
        { label: "📊 Ver Métricas de Eficiência", nextState: "telemetry" },
        { label: "📜 Histórico de Missões", nextState: "missions" },
        { label: "🔄 Menu Principal", nextState: "welcome" },
      ],
    },
    telemetry: {
      title: "TELEMETRIA DE EFICIÊNCIA // MÉTRICAS REAIS",
      text: "Compilação de métricas de desempenho registradas:\n\n• Repositórios Ativos: Mais de 60 projetos de código estruturados no GitHub.\n• Experiência Full Stack: 2+ anos construindo aplicações escaláveis.\n• Automação de Processos: 100% de precisão nos fluxos corporativos automatizados.\n• Manifold Check 3D: 100% Watertight (Modelos estanques prontos para manufatura).\n\nA eficiência das operações do Criador excede os padrões industriais convencionais, Senhor.",
      actions: [
        { label: "💬 Solicitar Orçamento / Proposta", href: "#orcamento" },
        { label: "💼 Conectar no LinkedIn", href: "https://www.linkedin.com/in/victor-santos-0a86021b7/", isExternal: true },
        { label: "🐙 Ver GitHub do Criador", href: "https://github.com/victorsantosg", isExternal: true },
        { label: "🔄 Menu Principal", nextState: "welcome" },
      ],
    },
    contact: {
      title: "PROTOCOLO DE COMUNICAÇÃO // CONTATO DIRETO",
      text: "Estabelecendo canal prioritário com Victor Santos:\n\nOs links de comunicação direta estão ativos e criptografados para sua conveniência, Senhor. Como deseja prosseguir?",
      actions: [
        { label: "💬 Falar no WhatsApp Oficial", href: "https://wa.me/5585999556385", isExternal: true },
        { label: "💼 Mensagem via LinkedIn", href: "https://www.linkedin.com/in/victor-santos-0a86021b7/", isExternal: true },
        { label: "✉️ Enviar E-mail Direto", href: "mailto:victoorsaantos16@gmail.com", isExternal: true },
        { label: "📋 Abrir Formulário de Orçamento", href: "#orcamento" },
        { label: "🔄 Menu Principal", nextState: "welcome" },
      ],
    },
  }

  // Humanized J.A.R.V.I.S. Text-to-Speech Engine
  const speakHumanizedJarvis = (rawText: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return

    window.speechSynthesis.cancel()

    // 1. Convert text to natural spoken prose with phonetic replacement for Járvis
    const spokenText = rawText
      .replace(/J\.A\.R\.V\.I\.S\./gi, "Járvis")
      .replace(/J\.A\.R\.V\.I\.S/gi, "Járvis")
      .replace(/\bJARVIS\b/gi, "Járvis")
      .replace(/\bJarvis\b/g, "Járvis")
      .replace(/•\s*/g, ", ")
      .replace(/\n\n+/g, ". ")
      .replace(/\n+/g, ", ")
      .replace(/\/\//g, " - ")
      .replace(/\s+/g, " ")
      .trim()

    // 2. Break down into complete sentences / clauses to respect commas and periods
    const sentences = spokenText.match(/[^.!?:]+[.!?:]?/g) || [spokenText]

    // 3. Find the highest-quality Natural / Neural Brazilian Portuguese voice
    const voices = window.speechSynthesis.getVoices()
    const bestVoice =
      voices.find(
        (v) =>
          (v.lang === "pt-BR" || v.lang.startsWith("pt")) &&
          (v.name.includes("Natural") ||
            v.name.includes("Neural") ||
            v.name.includes("Google") ||
            v.name.includes("Francisca") ||
            v.name.includes("Antonio") ||
            v.name.includes("Luciana") ||
            v.name.includes("Felipe") ||
            v.name.includes("Daniel"))
      ) ||
      voices.find((v) => v.lang === "pt-BR") ||
      voices.find((v) => v.lang.startsWith("pt"))

    // 4. Queue each sentence with calm, dignified J.A.R.V.I.S. prosody
    sentences.forEach((sentence, index) => {
      const cleanSentence = sentence.trim()
      if (!cleanSentence) return

      const utterance = new SpeechSynthesisUtterance(cleanSentence)
      if (bestVoice) {
        utterance.voice = bestVoice
      }
      utterance.lang = "pt-BR"
      utterance.rate = 0.94 // Calm, paced, humanized delivery
      utterance.pitch = 0.92 // Slightly lower dignified tone
      utterance.volume = 1.0

      window.speechSynthesis.speak(utterance)
    })
  }

  // Pre-load voices on mount
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.getVoices()
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices()
      }
    }
  }, [])

  // Typewriter text animation effect & TTS trigger
  useEffect(() => {
    if (!isOpen) return

    const fullText = dialogContent[currentState].text
    setDisplayedText("")
    setIsTyping(true)

    let index = 0
    const interval = setInterval(() => {
      index++
      setDisplayedText(fullText.slice(0, index))
      if (index >= fullText.length) {
        clearInterval(interval)
        setIsTyping(false)
      }
    }, 12)

    // Voice synthesis (TTS) if enabled
    if (voiceEnabled) {
      speakHumanizedJarvis(fullText)
    }

    return () => {
      clearInterval(interval)
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [currentState, isOpen, voiceEnabled])

  const handleActionClick = (action: {
    label: string
    nextState?: JarvisState
    href?: string
    isExternal?: boolean
  }) => {
    if (action.nextState) {
      setCurrentState(action.nextState)
    }

    if (action.href) {
      if (action.isExternal) {
        window.open(action.href, "_blank", "noopener,noreferrer")
      } else {
        const element = document.querySelector(action.href)
        if (element) {
          element.scrollIntoView({ behavior: "smooth" })
        }
      }
    }
  }

  return (
    <>
      {/* ========================================================= */}
      {/* FLOATING ORANGE HOLOGRAPHIC SPHERE WIDGET (BOTTOM-RIGHT) */}
      {/* ========================================================= */}
      <div className="fixed bottom-6 right-6 z-[9990] flex items-center gap-3">
        {/* Helper Pulse Tag */}
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-amber-500/40 text-amber-400 text-xs font-mono shadow-[0_0_20px_rgba(245,158,11,0.25)]"
          >
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>J.A.R.V.I.S. ONLINE</span>
          </motion.div>
        )}

        {/* Holographic Glowing Sphere Trigger Button */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-full flex items-center justify-center cursor-pointer group shadow-[0_0_35px_rgba(245,158,11,0.4)]"
          aria-label="Abrir Assistente J.A.R.V.I.S."
        >
          {/* Startup Shockwave Wave */}
          {showStartupHolo && (
            <motion.div
              initial={{ scale: 1, opacity: 0.9 }}
              animate={{ scale: [1, 3, 5], opacity: [0.9, 0.4, 0] }}
              transition={{ duration: 1.1, repeat: Infinity, ease: "easeOut" }}
              className="absolute inset-0 rounded-full border-2 border-amber-400 pointer-events-none"
            />
          )}

          {/* Rotating Audio Visualizer Rings */}
          <div className="absolute -inset-2 rounded-full border border-amber-500/40 border-dashed animate-spin [animation-duration:12s] pointer-events-none" />
          <div className="absolute -inset-3.5 rounded-full border border-amber-400/20 border-dotted animate-spin [animation-duration:20s] [animation-direction:reverse] pointer-events-none" />

          {/* Glowing Hologram Backdrop Core */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-600 via-orange-500 to-amber-300 opacity-80 blur-[2px] group-hover:opacity-100 transition-opacity" />

          {/* Animated Hologram Core of J.A.R.V.I.S. (WebP - Immune to iOS/Instagram Play Icon Overlays) */}
          <div className="relative w-[54px] h-[54px] sm:w-[60px] sm:h-[60px] rounded-full overflow-hidden border-2 border-amber-300 bg-black flex items-center justify-center shadow-inner">
            <img
              src="/jarvis/jarvis3.webp"
              alt="J.A.R.V.I.S. Arc Reactor Core"
              className="w-full h-full object-cover mix-blend-screen scale-110 pointer-events-none select-none"
            />
          </div>

          {/* Central Hologram Core Indicator */}
          <div className="absolute inset-0 rounded-full border-2 border-amber-400/60 pointer-events-none group-hover:border-amber-300 transition-colors" />
        </motion.button>
      </div>

      {/* ========================================================= */}
      {/* J.A.R.V.I.S. HOLOGRAPHIC HUD TERMINAL DRAWER */}
      {/* ========================================================= */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="fixed bottom-24 right-4 sm:right-6 z-[9995] w-[92vw] sm:w-[460px] max-h-[82vh] flex flex-col rounded-3xl bg-gray-950/95 border-2 border-amber-500/50 backdrop-blur-2xl shadow-[0_0_60px_rgba(245,158,11,0.25)] overflow-hidden"
          >
            {/* HUD Scanline & Grid Effect */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px]" 
            />

            {/* Top Holographic Header Bar */}
            <div className="relative z-10 p-4 border-b border-amber-500/30 bg-gradient-to-r from-amber-500/20 via-orange-950/40 to-transparent flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Mini Rotating Core */}
                <div className="relative w-9 h-9 rounded-full overflow-hidden border border-amber-400 bg-black shrink-0 shadow-[0_0_10px_#f59e0b]">
                  <Image
                    src="/jarvis/jarvis3.webp"
                    alt="J.A.R.V.I.S. Core"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-extrabold text-amber-400 tracking-wider">
                      J.A.R.V.I.S. INTERFACE
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  </div>
                  <div className="text-[10px] font-mono text-muted-foreground">
                    SANTOS PROTOCOL • VER 2.0
                  </div>
                </div>
              </div>

              {/* Header Actions (Mute & Close) */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setVoiceEnabled(!voiceEnabled)}
                  className={`p-1.5 rounded-lg border text-xs transition-colors cursor-pointer ${
                    voiceEnabled
                      ? "bg-amber-500/20 border-amber-400 text-amber-300"
                      : "border-white/10 text-muted-foreground hover:text-foreground"
                  }`}
                  title={voiceEnabled ? "Voz ativada" : "Ativar voz sintetizada"}
                >
                  {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg border border-white/10 text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors cursor-pointer"
                  aria-label="Fechar Terminal J.A.R.V.I.S."
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Terminal Body: Message Stream & Actions */}
            <div className="relative z-10 p-5 flex flex-col gap-4 overflow-y-auto max-h-[60vh]">
              {/* Dialogue Box */}
              <div className="p-4 rounded-2xl bg-black/60 border border-amber-500/30 shadow-inner relative">
                {/* State Title Tag */}
                <div className="text-[10px] font-mono text-amber-400/90 font-bold mb-2 pb-1.5 border-b border-amber-500/20 flex items-center justify-between">
                  <span>{dialogContent[currentState].title}</span>
                  <Activity className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                </div>

                {/* Typewriter Text */}
                <p className="text-xs sm:text-[13px] font-mono text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {displayedText}
                  {isTyping && (
                    <span className="inline-block w-2 h-3.5 ml-1 bg-amber-400 animate-pulse align-middle" />
                  )}
                </p>
              </div>

              {/* Action Buttons (Guided Telemetry Menu) */}
              <div className="space-y-2 pt-1">
                <div className="text-[10px] font-mono text-muted-foreground tracking-wider uppercase flex items-center gap-1.5">
                  <Zap className="w-3 h-3 text-amber-400" />
                  <span>Comandos de Telemetria Disponíveis:</span>
                </div>

                <div className="flex flex-col gap-2">
                  {dialogContent[currentState].actions.map((action, idx) => (
                    <Button
                      key={action.label}
                      variant="outline"
                      onClick={() => handleActionClick(action)}
                      className="w-full justify-between h-auto py-2.5 px-4 bg-gray-900/80 hover:bg-amber-500/20 border-border/60 hover:border-amber-400/80 text-foreground hover:text-amber-300 text-xs font-mono transition-all rounded-xl shadow-sm text-left group/btn"
                    >
                      <span className="font-semibold">{action.label}</span>
                      <ChevronRight className="w-4 h-4 text-amber-400 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  ))}
                </div>
              </div>

              <div ref={messageEndRef} />
            </div>

            {/* Bottom Status Bar */}
            <div className="relative z-10 px-5 py-3 border-t border-amber-500/20 bg-black/40 flex items-center justify-between text-[10px] font-mono text-muted-foreground">
              <div className="flex items-center gap-2 text-amber-400">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                <span>SERVER: ONLINE • 100% OPERATIONAL</span>
              </div>
              <span>VICTOR SANTOS // DEV</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
