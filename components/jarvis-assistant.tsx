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
  Send,
  Sparkles,
  Bot,
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
  | "ai_chat"

interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

interface JarvisAssistantProps {
  isReady?: boolean
}

export function JarvisAssistant({ isReady = false }: JarvisAssistantProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentState, setCurrentState] = useState<JarvisState>("welcome")
  const [isTyping, setIsTyping] = useState(false)
  const [displayedText, setDisplayedText] = useState("")
  const [voiceEnabled, setVoiceEnabled] = useState(false)
  
  // Real Groq AI Chat States
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [inputQuery, setInputQuery] = useState("")
  const [isAiLoading, setIsAiLoading] = useState(false)

  const messageEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Only open AFTER the initial intro and hero armor assembly effect have finished
  useEffect(() => {
    if (!isReady) return

    // Wait 3.8s after loading screen finishes to allow full armor assembly animation
    const timerHolo = setTimeout(() => {
      setIsOpen(true)
    }, 3800)

    return () => clearTimeout(timerHolo)
  }, [isReady])

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 300)
    }
  }, [isOpen])

  // Auto-scroll to bottom on message update or AI typing
  useEffect(() => {
    if (isOpen) {
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [chatMessages, displayedText, isAiLoading, isOpen])

  // Direct AI Query Handler
  const handleDirectAiQuery = async (queryText: string) => {
    if (!queryText.trim() || isAiLoading) return
    setIsAiLoading(true)
    setCurrentState("ai_chat")

    const newMessages: ChatMessage[] = [...chatMessages, { role: "user", content: queryText }]
    setChatMessages(newMessages)

    try {
      const res = await fetch("/api/jarvis/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      })

      const data = await res.json()
      const aiReply = data.reply || "Senhor, não foi possível obter retorno dos nós neurais."

      setChatMessages([...newMessages, { role: "assistant", content: aiReply }])
      triggerTypewriter(aiReply)
    } catch (err: any) {
      console.error(err)
      const errorMsg = "Senhor, houve uma oscilação na rede neural. Estou recalibrando os servidores."
      setChatMessages([...newMessages, { role: "assistant", content: errorMsg }])
      triggerTypewriter(errorMsg)
    } finally {
      setIsAiLoading(false)
      setTimeout(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" })
      }, 100)
    }
  }

  // Listen to External Trigger Queries (e.g. from 3D Diagnostics)
  useEffect(() => {
    const handleAskQuery = (e: any) => {
      const query = e.detail?.query
      if (query) {
        setIsOpen(true)
        handleDirectAiQuery(query)
      }
    }

    window.addEventListener("jarvis-ask-query", handleAskQuery)
    return () => window.removeEventListener("jarvis-ask-query", handleAskQuery)
  }, [chatMessages, isAiLoading])

  // Respostas programadas com a Persona Oficial do J.A.R.V.I.S.
  const dialogContent: Record<
    JarvisState,
    { title: string; text: string; sectionId?: string; actions: { label: string; nextState?: JarvisState; href?: string; isExternal?: boolean; isTour?: boolean; icon?: any }[] }
  > = {
    welcome: {
      title: "PROTOCOLO DE INICIALIZAÇÃO // J.A.R.V.I.S. (GROQ AI)",
      text: "Sistemas neurais online com Llama-3.3-70B e Gemini Failover. Bem-vindo ao servidor central de Victor Santos. Eu sou o J.A.R.V.I.S. e gerencio os arquivos, códigos e implantações do Criador.\n\nVocê pode me fazer qualquer pergunta sobre as habilidades, projetos ou trajetória do Criador no campo de texto abaixo, ou selecionar uma rota rápida de telemetria:\n\n• Histórico de Missões: Trajetória profissional e sistemas desenvolvidos.\n• Protótipos Ativos: Repositórios de código e aplicações em produção.\n• Arquitetura do Traje: A stack tecnológica e frameworks dominados.",
      actions: [
        { label: "🎙️ Iniciar Tour Narrado (Piloto Auto)", isTour: true },
        { label: "🚀 Ir Direto para Projetos", href: "#projetos" },
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
    ai_chat: {
      title: "RESPOSTA NEURAL // GROQ LLAMA 3.3 70B",
      text: "",
      actions: [
        { label: "💬 Falar no WhatsApp", href: "https://wa.me/5585999556385", isExternal: true },
        { label: "📂 Ver Projetos", href: "#projetos" },
        { label: "🔄 Menu Principal", nextState: "welcome" },
      ],
    },
  }

  // Humanized J.A.R.V.I.S. Text-to-Speech Engine
  const speakHumanizedJarvis = (rawText: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return

    window.speechSynthesis.cancel()

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

    const sentences = spokenText.match(/[^.!?:]+[.!?:]?/g) || [spokenText]
    const voices = window.speechSynthesis.getVoices()
    const bestVoice =
      voices.find(
        (v) =>
          (v.lang === "pt-BR" || v.lang.startsWith("pt")) &&
          (v.name.includes("Natural") ||
            v.name.includes("Neural") ||
            v.name.includes("Google") ||
            v.name.includes("Luciana") ||
            v.name.includes("Felipe") ||
            v.name.includes("Daniel") ||
            v.name.includes("Francisca"))
      ) || voices.find((v) => v.lang.startsWith("pt"))

    sentences.forEach((sentence, index) => {
      const trimmed = sentence.trim()
      if (!trimmed) return

      const utterance = new SpeechSynthesisUtterance(trimmed)
      if (bestVoice) utterance.voice = bestVoice
      utterance.rate = 1.06
      utterance.pitch = 0.95

      if (index === sentences.length - 1) {
        utterance.pitch = 0.92
      }

      window.speechSynthesis.speak(utterance)
    })
  }

  // Typewriter effect generator
  const triggerTypewriter = (fullText: string) => {
    setIsTyping(true)
    setDisplayedText("")
    let currentIndex = 0

    const interval = setInterval(() => {
      if (currentIndex < fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex + 1))
        currentIndex++
      } else {
        setIsTyping(false)
        clearInterval(interval)
      }
    }, 12)

    if (voiceEnabled) {
      speakHumanizedJarvis(fullText)
    }

    return interval
  }

  // Typewriter effect on preset state change (when not in ai_chat)
  useEffect(() => {
    if (!isOpen || currentState === "ai_chat") return

    const fullText = dialogContent[currentState].text
    const interval = triggerTypewriter(fullText)

    return () => {
      clearInterval(interval)
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [currentState, isOpen, voiceEnabled])

  // Handle Preset Action Click
  const handleActionClick = (action: {
    label: string
    nextState?: JarvisState
    href?: string
    isExternal?: boolean
    isTour?: boolean
  }) => {
    if (action.isTour) {
      setIsOpen(false)
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("start-jarvis-tour"))
      }
      return
    }

    if (action.nextState) {
      setCurrentState(action.nextState)
    }

    if (action.href) {
      if (action.isExternal) {
        window.open(action.href, "_blank", "noopener,noreferrer")
      } else {
        setIsOpen(false)
        const element = document.querySelector(action.href)
        if (element) {
          element.scrollIntoView({ behavior: "smooth" })
        }
      }
    }
  }

  // Send Message to Groq Llama 3.3 70B AI Engine
  const handleSendAiMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    const query = inputQuery.trim()
    if (!query || isAiLoading) return

    setInputQuery("")
    setIsAiLoading(true)
    setCurrentState("ai_chat")

    const newMessages: ChatMessage[] = [...chatMessages, { role: "user", content: query }]
    setChatMessages(newMessages)

    try {
      const res = await fetch("/api/jarvis/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      })

      const data = await res.json()
      const aiReply = data.reply || "Senhor, não foi possível obter retorno dos nós neurais da Groq."

      setChatMessages([...newMessages, { role: "assistant", content: aiReply }])
      triggerTypewriter(aiReply)
    } catch (err: any) {
      console.error(err)
      const errorMsg = "Senhor, houve uma interrupção na conexão com a rede da Groq. Estou restabelecendo os nós neurais."
      setChatMessages([...newMessages, { role: "assistant", content: errorMsg }])
      triggerTypewriter(errorMsg)
    } finally {
      setIsAiLoading(false)
      setTimeout(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" })
      }, 100)
    }
  }

  return (
    <>
      {/* ========================================================= */}
      {/* FLOATING ORANGE HOLOGRAPHIC SPHERE WIDGET (BOTTOM-RIGHT) */}
      {/* ========================================================= */}
      <div className="fixed bottom-5 right-5 z-[9990] flex items-center gap-2.5">
        {/* Helper Pulse Tag - Discreto e apenas Desktop */}
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/85 backdrop-blur-md border border-amber-500/30 text-amber-400 text-[11px] font-mono shadow-[0_0_12px_rgba(245,158,11,0.2)]"
          >
            <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
            <span>J.A.R.V.I.S. (GROQ AI)</span>
          </motion.div>
        )}

        {/* Holographic Glowing Sphere Trigger Button - Discreto & Elegante */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative w-13 h-13 sm:w-14 sm:h-14 rounded-full flex items-center justify-center cursor-pointer group shadow-[0_0_20px_rgba(245,158,11,0.35)]"
          aria-label="Abrir Assistente J.A.R.V.I.S."
        >
          <div className="absolute -inset-1 rounded-full border border-amber-500/30 border-dashed animate-spin [animation-duration:18s] pointer-events-none group-hover:border-amber-400/60 transition-colors" />
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-600/40 via-orange-500/40 to-amber-300/40 opacity-70 blur-[1px] group-hover:opacity-100 transition-opacity" />
          <div className="relative w-[44px] h-[44px] sm:w-[48px] sm:h-[48px] rounded-full overflow-hidden border border-amber-400/80 bg-black flex items-center justify-center shadow-inner">
            <img
              src="/jarvis/jarvis3.webp"
              alt="J.A.R.V.I.S. Arc Reactor Core"
              className="w-full h-full object-cover mix-blend-screen scale-110 pointer-events-none select-none"
            />
          </div>
          <div className="absolute inset-0 rounded-full border border-amber-400/40 pointer-events-none group-hover:border-amber-300 transition-colors" />
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
            className="fixed bottom-20 right-3 sm:right-6 z-[9995] w-[94vw] sm:w-[480px] max-h-[85vh] flex flex-col rounded-3xl bg-gray-950/95 border-2 border-amber-500/50 backdrop-blur-2xl shadow-[0_0_60px_rgba(245,158,11,0.25)] overflow-hidden"
          >
            {/* HUD Scanline & Grid Effect */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px]" 
            />

            {/* Top Holographic Header Bar */}
            <div className="relative z-10 p-3.5 sm:p-4 border-b border-amber-500/30 bg-gradient-to-r from-amber-500/20 via-orange-950/40 to-transparent flex items-center justify-between">
              <div className="flex items-center gap-2.5 sm:gap-3">
                {/* Mini Rotating Core */}
                <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden border border-amber-400 bg-black shrink-0 shadow-[0_0_10px_#f59e0b]">
                  <Image
                    src="/jarvis/jarvis3.webp"
                    alt="J.A.R.V.I.S. Core"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-mono font-extrabold text-amber-400 tracking-wider">
                      J.A.R.V.I.S. AI
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold hidden xs:inline">
                      LLAMA 3.3 70B
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  </div>
                  <div className="text-[9px] sm:text-[10px] font-mono text-muted-foreground">
                    SANTOS PROTOCOL • GROQ ENGINE
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
            <div className="relative z-10 p-3 sm:p-4 flex flex-col gap-3 overflow-y-auto max-h-[55vh] sm:max-h-[58vh]">
              {/* If no chat history yet, show current Preset Dialogue Box */}
              {chatMessages.length === 0 ? (
                <div className="p-3.5 sm:p-4 rounded-2xl bg-black/70 border border-amber-500/30 shadow-inner relative">
                  {/* State Title Tag */}
                  <div className="text-[10px] font-mono text-amber-400/90 font-bold mb-2 pb-1.5 border-b border-amber-500/20 flex items-center justify-between">
                    <span className="truncate">{dialogContent[currentState].title}</span>
                    <Activity className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  </div>

                  {/* Typewriter Text / Preset Response */}
                  <p className="text-xs sm:text-[13px] font-mono text-slate-200 leading-relaxed whitespace-pre-wrap">
                    {displayedText}
                    {isTyping && (
                      <span className="inline-block w-2 h-3.5 ml-1 bg-amber-400 animate-pulse align-middle" />
                    )}
                  </p>
                </div>
              ) : (
                /* Interactive Conversational History Thread */
                <div className="flex flex-col gap-3">
                  {chatMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {msg.role === "user" ? (
                        <div className="max-w-[88%] rounded-2xl rounded-tr-xs bg-gradient-to-r from-amber-600/30 via-orange-600/25 to-amber-500/30 border border-amber-500/50 p-2.5 sm:p-3 text-xs sm:text-sm font-mono text-amber-200 shadow-md">
                          <div className="text-[9px] text-amber-400 font-bold mb-1 flex items-center gap-1 justify-end">
                            <span>VOCÊ</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          </div>
                          <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                        </div>
                      ) : (
                        <div className="max-w-[92%] rounded-2xl rounded-tl-xs bg-black/80 border border-amber-500/40 p-3 sm:p-3.5 text-xs sm:text-[13px] font-mono text-slate-200 shadow-inner">
                          <div className="text-[9px] text-amber-400 font-bold mb-1.5 flex items-center gap-1.5 pb-1 border-b border-amber-500/20">
                            <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
                            <span>J.A.R.V.I.S. (IA CONVERSACIONAL)</span>
                          </div>
                          <p className="whitespace-pre-wrap leading-relaxed">
                            {idx === chatMessages.length - 1 && isTyping ? displayedText : msg.content}
                            {idx === chatMessages.length - 1 && isTyping && (
                              <span className="inline-block w-1.5 h-3 ml-1 bg-amber-400 animate-pulse align-middle" />
                            )}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* AI Thinking Animation */}
                  {isAiLoading && (
                    <div className="flex justify-start">
                      <div className="rounded-2xl rounded-tl-xs bg-black/75 border border-amber-500/40 p-2.5 sm:p-3 text-xs font-mono text-amber-300 flex items-center gap-2 shadow-inner animate-pulse">
                        <Bot className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                        <span>J.A.R.V.I.S. processando nós neurais...</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons (Guided Telemetry Menu) */}
              <div className="space-y-1.5 pt-1">
                <div className="text-[9px] sm:text-[10px] font-mono text-muted-foreground tracking-wider uppercase flex items-center gap-1.5">
                  <Zap className="w-3 h-3 text-amber-400" />
                  <span>Comandos Rápidos de Telemetria:</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {dialogContent[currentState].actions.map((action) => (
                    <Button
                      key={action.label}
                      variant="outline"
                      size="sm"
                      onClick={() => handleActionClick(action)}
                      className="justify-between h-auto py-1.5 px-2.5 bg-gray-900/80 hover:bg-amber-500/20 border-border/60 hover:border-amber-400/80 text-foreground hover:text-amber-300 text-[10px] sm:text-xs font-mono transition-all rounded-xl shadow-sm text-left group/btn"
                    >
                      <span className="font-semibold truncate">{action.label}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-amber-400 group-hover/btn:translate-x-0.5 transition-transform shrink-0" />
                    </Button>
                  ))}
                </div>
              </div>

              <div ref={messageEndRef} />
            </div>

            {/* Bottom Interactive AI Chat Input Box */}
            <form
              onSubmit={handleSendAiMessage}
              className="relative z-10 p-2.5 sm:p-3 border-t border-amber-500/30 bg-black/90 flex items-center gap-2"
            >
              <div className="relative flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder="Pergunte qualquer coisa ao J.A.R.V.I.S...."
                  disabled={isAiLoading}
                  className="w-full h-9 sm:h-10 pl-3 pr-8 rounded-xl bg-gray-900/90 border border-amber-500/40 text-xs font-mono text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 shadow-inner"
                />
                <Sparkles className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-amber-400/60 pointer-events-none" />
              </div>

              <Button
                type="submit"
                disabled={!inputQuery.trim() || isAiLoading}
                className="h-9 sm:h-10 px-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-bold text-xs rounded-xl gap-1 shrink-0 cursor-pointer shadow-lg shadow-amber-500/20"
              >
                <Send className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Enviar</span>
              </Button>
            </form>

            {/* Bottom Status Bar */}
            <div className="relative z-10 px-4 py-2 border-t border-amber-500/10 bg-black/60 flex items-center justify-between text-[9px] sm:text-[10px] font-mono text-muted-foreground">
              <div className="flex items-center gap-1.5 text-amber-400">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                <span>SERVER: GROQ CLOUD • 100% OPERACIONAL</span>
              </div>
              <span className="hidden xs:inline">VICTOR SANTOS // DEV</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
