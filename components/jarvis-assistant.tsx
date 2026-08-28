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
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([])
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>("")
  const [showVoiceSettings, setShowVoiceSettings] = useState(false)
  
  // Real Groq AI Chat States
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [inputQuery, setInputQuery] = useState("")
  const [isAiLoading, setIsAiLoading] = useState(false)

  const messageEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Load saved voice preference and available voices
  useEffect(() => {
    if (typeof window === "undefined") return

    const savedVoiceState = localStorage.getItem("jarvis_voice_enabled")
    if (savedVoiceState !== null) {
      setVoiceEnabled(savedVoiceState === "true")
    }

    if (!("speechSynthesis" in window)) return

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices()
      if (voices.length > 0) {
        setAvailableVoices(voices)
        const saved = localStorage.getItem("jarvis_selected_voice")
        if (saved && voices.some((v) => v.voiceURI === saved)) {
          setSelectedVoiceURI(saved)
        } else {
          const defaultPt = voices.find(
            (v) =>
              (v.lang === "pt-BR" || v.lang.startsWith("pt")) &&
              (v.name.includes("Natural") ||
                v.name.includes("Neural") ||
                v.name.includes("Google") ||
                v.name.includes("Antonio") ||
                v.name.includes("Luciana") ||
                v.name.includes("Francisca"))
          ) || voices.find((v) => v.lang.startsWith("pt"))
          if (defaultPt) {
            setSelectedVoiceURI(defaultPt.voiceURI)
          }
        }
      }
    }

    loadVoices()
    window.speechSynthesis.onvoiceschanged = loadVoices
  }, [])

  // Toggle voice and save preference
  const toggleVoice = () => {
    const nextState = !voiceEnabled
    setVoiceEnabled(nextState)
    if (typeof window !== "undefined") {
      localStorage.setItem("jarvis_voice_enabled", String(nextState))
      if (!nextState) {
        if (audioRef.current) {
          audioRef.current.pause()
          audioRef.current.currentTime = 0
        }
        if ("speechSynthesis" in window) {
          window.speechSynthesis.cancel()
        }
      }
    }
  }

  // Helper to generate dynamic time-of-day greetings (Stark Industries / Jarvis Persona)
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 12) {
      const morningGreetings = [
        "Bom dia, Senhor. Os servidores estão atualizados e o café está pronto. Bem-vindo ao servidor central de Victor Santos. Como posso ser útil hoje?",
        "Bom dia, Senhor. Desculpe interromper seu descanso, mas temos novos projetos e arquiteturas prontas para inspeção.",
        "Bom dia, Senhor. Devo agendar seus compromissos ou prefere continuar programando em capacidade máxima?",
      ]
      return morningGreetings[Math.floor(Math.random() * morningGreetings.length)]
    } else if (hour >= 12 && hour < 18) {
      const afternoonGreetings = [
        "Boa tarde, Senhor. Os relatórios de telemetria acabam de chegar com 100% de estabilidade operacional.",
        "Boa tarde, Senhor. A temperatura em Malibu está ideal para um voo de teste e para explorar novas tecnologias.",
        "Boa tarde, Senhor. Os canais de comunicação direta com Victor Santos estão totalmente liberados.",
      ]
      return afternoonGreetings[Math.floor(Math.random() * afternoonGreetings.length)]
    } else {
      const nightGreetings = [
        "Boa noite, Senhor. Recomendo algumas horas de sono para o seu bem-estar, mas todos os sistemas continuam operando.",
        "Boa noite, Senhor. Todos os sistemas da oficina foram colocados em modo de prontidão e espera.",
        "Boa noite, Senhor. A armadura Mark 42 está totalmente recarregada e pronta para novas implantações.",
      ]
      return nightGreetings[Math.floor(Math.random() * nightGreetings.length)]
    }
  }

  const [welcomeText, setWelcomeText] = useState<string>("")

  // Initialize dynamic greeting on client mount
  useEffect(() => {
    setWelcomeText(getTimeBasedGreeting())
  }, [])

  // Exit Intent Detection (Quando o usuário move o mouse para fechar a aba/sair)
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 5) {
        const hasTriggeredExit = sessionStorage.getItem("jarvis_exit_notified")
        if (!hasTriggeredExit) {
          sessionStorage.setItem("jarvis_exit_notified", "true")
          const farewell = "Até logo, Senhor. Todos os sistemas e armaduras foram colocados em modo de espera. Estarei em prontidão para sua próxima missão."
          setIsOpen(true)
          setChatMessages((prev) => [
            ...prev,
            { role: "assistant", content: farewell },
          ])
          triggerTypewriter(farewell)
          speakHumanizedJarvis(farewell)
        }
      }
    }

    document.addEventListener("mouseleave", handleMouseLeave)
    return () => document.removeEventListener("mouseleave", handleMouseLeave)
  }, [voiceEnabled])

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

  /**
   * Helper to clean markdown, urls, symbols, bullets, asterisks and format natural human speech
   */
  const cleanSpeechText = (rawText: string): string => {
    if (!rawText) return ""
    return rawText
      // Replace markdown links [label](url) with just label
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      // Remove raw URLs
      .replace(/https?:\/\/[^\s)]+/g, "")
      // Convert emails to human spoken format
      .replace(/([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g, "$1 arroba $2")
      // Remove markdown bold, italic, strikethrough, backticks, hashes, quotes
      .replace(/[*_~`#>\\]/g, "")
      // Remove bullets, square icons and arrows
      .replace(/[•▪▸►■✦✧★\-\–\—]/g, " ")
      .replace(/\/\//g, " - ")
      // Pronounce Brazilian phone numbers naturally (ex: DDD 85, 99955 6385)
      .replace(/\+55\s*(\d{2})\s*(\d{4,5})-?(\d{4})/g, "DDD $1, $2 $3")
      // Pronounce Jarvis cleanly
      .replace(/J\.A\.R\.V\.I\.S\./gi, "Járvis")
      .replace(/\bJARVIS\b/gi, "Járvis")
      .replace(/\bJarvis\b/g, "Járvis")
      // Replace double colons or semicolons with comma for natural speech pause
      .replace(/[:;]+/g, ",")
      .replace(/\n\n+/g, ". ")
      .replace(/\n+/g, ", ")
      .replace(/\s+/g, " ")
      .replace(/\s+([.,!?])/g, "$1")
      .trim()
  }

  // Voice Preview Test
  const handleTestVoice = (voice: SpeechSynthesisVoice) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(
      "Sistemas calibrados, Senhor. Eu sou o Járvis, e este é o meu canal de sintetização de voz."
    )
    utterance.voice = voice
    utterance.rate = 1.02
    utterance.pitch = 0.96
    window.speechSynthesis.speak(utterance)
    setSelectedVoiceURI(voice.voiceURI)
    localStorage.setItem("jarvis_selected_voice", voice.voiceURI)
  }

  // Humanized J.A.R.V.I.S. Neural Audio Player (Edge TTS + SpeechSynthesis Fallback)
  const speakHumanizedJarvis = async (text: string) => {
    if (!voiceEnabled || typeof window === "undefined") return

    const spokenText = cleanSpeechText(text)
    if (!spokenText) return

    // Stop any existing audio
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel()
    }

    try {
      // 1. Primary: Microsoft Edge Neural TTS Audio Stream (/api/jarvis/tts)
      const res = await fetch("/api/jarvis/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: spokenText }),
      })

      if (res.ok) {
        const blob = await res.blob()
        const audioUrl = URL.createObjectURL(blob)
        const audio = new Audio(audioUrl)
        audioRef.current = audio
        await audio.play()
        return
      }
    } catch (err) {
      console.warn("Edge Neural TTS failed, using browser speech fallback...", err)
    }

    // 2. Fallback: Browser Native Speech Synthesis
    if (!("speechSynthesis" in window)) return
    const sentences = spokenText.match(/[^.!?]+[.!?]?/g) || [spokenText]
    const voices = availableVoices.length > 0 ? availableVoices : window.speechSynthesis.getVoices()
    
    let activeVoice = voices.find((v) => v.voiceURI === selectedVoiceURI)
    if (!activeVoice) {
      activeVoice =
        voices.find(
          (v) =>
            (v.lang === "pt-BR" || v.lang.startsWith("pt")) &&
            (v.name.includes("Natural") ||
              v.name.includes("Neural") ||
              v.name.includes("Google") ||
              v.name.includes("Antonio") ||
              v.name.includes("Luciana") ||
              v.name.includes("Francisca"))
        ) || voices.find((v) => v.lang.startsWith("pt"))
    }

    sentences.forEach((sentence, index) => {
      const trimmed = sentence.trim()
      if (!trimmed) return

      const utterance = new SpeechSynthesisUtterance(trimmed)
      if (activeVoice) utterance.voice = activeVoice
      utterance.rate = 1.02
      utterance.pitch = 0.96

      if (index === sentences.length - 1) {
        utterance.pitch = 0.93
      }

      window.speechSynthesis.speak(utterance)
    })
  }

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
      speakHumanizedJarvis(aiReply)
    } catch (err: any) {
      console.error(err)
      const errorMsg = "Senhor, houve uma oscilação na rede neural. Estou recalibrando os servidores."
      setChatMessages([...newMessages, { role: "assistant", content: errorMsg }])
      triggerTypewriter(errorMsg)
      speakHumanizedJarvis(errorMsg)
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
      title: "PROTOCOLO DE INICIALIZAÇÃO // J.A.R.V.I.S.",
      text: welcomeText || "Sistemas neurais online. Bem-vindo ao servidor central de Victor Santos. Eu sou o J.A.R.V.I.S. e gerencio os arquivos, códigos e implantações do Criador. Você pode explorar os módulos abaixo ou conversar diretamente comigo digitando sua mensagem no terminal.",
      actions: [
        { label: "🚀 Iniciar Tour Guiado", isTour: true },
        { label: "🎯 Missões & Carreira", nextState: "missions" },
        { label: "📦 Projetos & Protótipos", nextState: "prototypes" },
        { label: "⚡ Arquitetura & Stack", nextState: "architecture" },
        { label: "📡 Telemetria & Contato", nextState: "contact" },
      ],
    },
    missions: {
      title: "HISTÓRICO DE MISSÕES // TRAJETÓRIA",
      text: "O Criador atua na vanguarda do desenvolvimento Full Stack e Engenharia de Software, combinando TypeScript, React, Next.js, Node.js, PHP moderno e Integrações de Inteligência Artificial para construir sistemas robustos e de alto tráfego.",
      sectionId: "sobre",
      actions: [
        { label: "📜 Ir para Sobre", href: "#sobre" },
        { label: "📦 Ver Projetos", nextState: "prototypes" },
        { label: "🔄 Menu Principal", nextState: "welcome" },
      ],
    },
    prototypes: {
      title: "PROTÓTIPOS E IMPLANTAÇÕES // PROJETOS",
      text: "Acessando banco de dados de projetos: Destacam-se plataformas SaaS completas, dashboards de telemetria com Three.js em 3D, automações de logística reversa e integrações com modelos de linguagem avançados.",
      sectionId: "projetos",
      actions: [
        { label: "📂 Explorar Projetos no Site", href: "#projetos" },
        { label: "⚡ Ver Arquitetura Técnica", nextState: "architecture" },
        { label: "🔄 Menu Principal", nextState: "welcome" },
      ],
    },
    architecture: {
      title: "MATRIZ DE COMPETÊNCIAS // STACK",
      text: "Arquitetura otimizada para escala: Frontend com Next.js 16, React 19, Tailwind CSS e Framer Motion. Backend resiliente com APIs REST, WebSocket, integrações com bancos de dados relacionais e agentes autônomos de IA.",
      sectionId: "skills",
      actions: [
        { label: "🛠️ Ver Habilidades Técnicas", href: "#skills" },
        { label: "📊 Telemetria ao Vivo", nextState: "telemetry" },
        { label: "🔄 Menu Principal", nextState: "welcome" },
      ],
    },
    telemetry: {
      title: "TELEMETRIA DE SISTEMA // DIAGNÓSTICO",
      text: "Todos os subsistemas operando em capacidade máxima. Latência média de 32ms, infraestrutura 100% serverless na nuvem e integridade neural validada com múltiplos nós de contingência.",
      sectionId: "skills",
      actions: [
        { label: "📡 Ver Telemetria", href: "#skills" },
        { label: "💼 Falar com o Criador", nextState: "contact" },
        { label: "🔄 Menu Principal", nextState: "welcome" },
      ],
    },
    contact: {
      title: "CANAL DE TRANSMISSÃO // CONTATO",
      text: "Canais diretos de comunicação com o Senhor Victor Santos: Disponível via WhatsApp corporativo, LinkedIn e e-mail. Pronto para discutir novos projetos e parcerias estratégicas.",
      sectionId: "contato",
      actions: [
        { label: "💬 Iniciar Conversa no WhatsApp", href: "https://wa.me/5585999556385", isExternal: true },
        { label: "💼 Mensagem via LinkedIn", href: "https://www.linkedin.com/in/victor-santos-0a86021b7/", isExternal: true },
        { label: "✉️ Enviar E-mail Direto", href: "mailto:victoorsaantos16@gmail.com", isExternal: true },
        { label: "📋 Abrir Formulário de Orçamento", href: "#orcamento" },
        { label: "🔄 Menu Principal", nextState: "welcome" },
      ],
    },
    ai_chat: {
      title: "RESPOSTA NEURAL // J.A.R.V.I.S.",
      text: "",
      actions: [
        { label: "💬 Falar no WhatsApp", href: "https://wa.me/5585999556385", isExternal: true },
        { label: "📂 Ver Projetos", href: "#projetos" },
        { label: "🔄 Menu Principal", nextState: "welcome" },
      ],
    },
  }

  const typewriterRef = useRef<NodeJS.Timeout | null>(null)

  // Typewriter effect generator
  const triggerTypewriter = (fullText: string) => {
    if (typewriterRef.current) clearInterval(typewriterRef.current)
    setIsTyping(true)
    setDisplayedText("")
    let currentIndex = 0

    typewriterRef.current = setInterval(() => {
      if (currentIndex < fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex + 1))
        currentIndex++
      } else {
        setIsTyping(false)
        setDisplayedText(fullText)
        if (typewriterRef.current) clearInterval(typewriterRef.current)
      }
    }, 10)

    return typewriterRef.current
  }

  // Typewriter effect on preset state change (when not in ai_chat)
  useEffect(() => {
    if (!isOpen || currentState === "ai_chat") return

    const fullText = dialogContent[currentState].text
    triggerTypewriter(fullText)
    speakHumanizedJarvis(fullText)

    return () => {
      if (typewriterRef.current) clearInterval(typewriterRef.current)
      if (audioRef.current) {
        audioRef.current.pause()
      }
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

  // Send Message to AI Engine
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
      const aiReply = data.reply || "Senhor, não foi possível obter retorno dos nós neurais."

      setChatMessages([...newMessages, { role: "assistant", content: aiReply }])
      triggerTypewriter(aiReply)
      speakHumanizedJarvis(aiReply)
    } catch (err: any) {
      console.error(err)
      const errorMsg = "Senhor, houve uma oscilação na conexão. Estou restabelecendo os nós neurais."
      setChatMessages([...newMessages, { role: "assistant", content: errorMsg }])
      triggerTypewriter(errorMsg)
      speakHumanizedJarvis(errorMsg)
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
            <span>J.A.R.V.I.S.</span>
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
            initial={{ opacity: 0, y: "100%", scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: "100%", scale: 0.98 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-x-0 bottom-0 sm:bottom-20 sm:right-6 sm:inset-x-auto z-[9995] w-full sm:w-[480px] h-[88dvh] sm:h-auto sm:max-h-[78vh] flex flex-col rounded-t-[28px] sm:rounded-3xl bg-gray-950/98 border-t-2 sm:border-2 border-amber-500/50 backdrop-blur-2xl shadow-[0_-10px_50px_rgba(0,0,0,0.8),0_0_60px_rgba(245,158,11,0.25)] overflow-hidden"
          >
            {/* Mobile Drag/Pull Indicator Bar */}
            <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mt-2 -mb-1 sm:hidden shrink-0" />

            {/* HUD Scanline & Grid Effect */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px]" 
            />

            {/* Top Holographic Header Bar */}
            <div className="relative z-10 p-3 sm:p-4 border-b border-amber-500/30 bg-gradient-to-r from-amber-500/20 via-orange-950/40 to-transparent flex items-center justify-between shrink-0">
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
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className="text-xs sm:text-sm font-mono font-extrabold text-amber-400 tracking-wider">
                      J.A.R.V.I.S.
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                      ASSISTENTE IA
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  </div>
                  <div className="text-[9px] sm:text-[10px] font-mono text-muted-foreground">
                    SANTOS PROTOCOL • SISTEMA AUTÔNOMO
                  </div>
                </div>
              </div>

              {/* Header Actions (Voice Settings, Mute & Close) */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setShowVoiceSettings(!showVoiceSettings)}
                  className={`p-2 sm:p-1.5 rounded-xl border text-xs transition-colors cursor-pointer ${
                    showVoiceSettings
                      ? "bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.3)]"
                      : "border-white/10 text-muted-foreground hover:text-foreground hover:bg-white/10"
                  }`}
                  title="Configurar e testar vozes neurais"
                >
                  <Cpu className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setVoiceEnabled(!voiceEnabled)}
                  className={`p-2 sm:p-1.5 rounded-xl border text-xs transition-colors cursor-pointer ${
                    voiceEnabled
                      ? "bg-amber-500/20 border-amber-400 text-amber-300"
                      : "border-white/10 text-muted-foreground hover:text-foreground hover:bg-white/10"
                  }`}
                  title={voiceEnabled ? "Voz ativada" : "Ativar voz sintetizada"}
                >
                  {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 sm:p-1.5 rounded-xl border border-white/10 text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors cursor-pointer"
                  aria-label="Fechar Terminal J.A.R.V.I.S."
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Voice Calibration Drawer */}
            <AnimatePresence>
              {showVoiceSettings && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="relative z-20 p-3 sm:p-4 bg-gray-900/95 border-b border-amber-500/40 text-xs font-mono space-y-2.5 overflow-hidden shrink-0 shadow-lg"
                >
                  <div className="flex items-center justify-between pb-1 border-b border-white/10 text-amber-400 font-bold text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>CANAL DE VOZ // ESCOLHA & TESTE</span>
                    </div>
                    <button
                      onClick={() => setShowVoiceSettings(false)}
                      className="text-muted-foreground hover:text-white text-xs cursor-pointer"
                    >
                      ✕ Fechar
                    </button>
                  </div>

                  <p className="text-[10px] text-muted-foreground">
                    Selecione a voz neural de sua preferência e clique em <b>Ouvir</b> para calibrar o áudio:
                  </p>

                  <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
                    {availableVoices
                      .filter((v) => v.lang.startsWith("pt") || v.lang.startsWith("en"))
                      .map((voice) => (
                        <div
                          key={voice.voiceURI}
                          className={`p-2 rounded-xl border flex items-center justify-between gap-2 transition-all ${
                            selectedVoiceURI === voice.voiceURI
                              ? "bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.2)]"
                              : "bg-black/50 border-white/10 text-slate-300 hover:border-amber-500/40"
                          }`}
                        >
                          <div className="truncate flex-1">
                            <div className="font-bold truncate text-[11px]">{voice.name}</div>
                            <div className="text-[9px] text-muted-foreground">{voice.lang}</div>
                          </div>
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => handleTestVoice(voice)}
                            className="h-7 px-2.5 bg-amber-500 hover:bg-amber-400 text-black text-[10px] font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-colors shadow-sm shrink-0"
                          >
                            <span>▶️ Ouvir</span>
                          </Button>
                        </div>
                      ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Terminal Body: Message Stream & Actions (FLEX-1 FULL SCROLL) */}
            <div className="relative z-10 p-3 sm:p-4 flex-1 overflow-y-auto flex flex-col gap-3 min-h-0">
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
                            <span>J.A.R.V.I.S.</span>
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
                        <span>J.A.R.V.I.S. processando resposta...</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons (Guided Telemetry Menu) */}
              <div className="space-y-1.5 pt-1 mt-auto">
                <div className="text-[9px] sm:text-[10px] font-mono text-muted-foreground tracking-wider uppercase flex items-center gap-1.5">
                  <Zap className="w-3 h-3 text-amber-400" />
                  <span>Comandos Rápidos de Telemetria:</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 gap-1.5">
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
              className="relative z-10 p-2.5 sm:p-3 pb-4 sm:pb-3 border-t border-amber-500/30 bg-black/95 flex items-center gap-2 shrink-0"
            >
              <div className="relative flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder="Pergunte qualquer coisa ao J.A.R.V.I.S...."
                  disabled={isAiLoading}
                  className="w-full h-10 pl-3 pr-8 rounded-xl bg-gray-900/90 border border-amber-500/40 text-xs font-mono text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 shadow-inner"
                />
                <Sparkles className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-amber-400/60 pointer-events-none" />
              </div>

              <Button
                type="submit"
                disabled={!inputQuery.trim() || isAiLoading}
                className="h-10 px-3.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-bold text-xs rounded-xl gap-1 shrink-0 cursor-pointer shadow-lg shadow-amber-500/20"
              >
                <Send className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Enviar</span>
              </Button>
            </form>

            {/* Server Status Footer */}
            <div className="relative z-10 px-3 py-1 bg-black text-[9px] font-mono text-muted-foreground/60 border-t border-white/5 flex items-center justify-between shrink-0">
              <span>SISTEMA CENTRAL • 100% OPERACIONAL</span>
              <span className="text-emerald-400">● ONLINE</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
