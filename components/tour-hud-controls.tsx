"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Play,
  Pause,
  SkipForward,
  X,
  Volume2,
  VolumeX,
  Compass,
  Sparkles,
  Radio,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { TOUR_STEPS, TourStep } from "@/lib/tour-controller"

import { JarvisTourHologram } from "@/components/three/jarvis-tour-hologram"

export function TourHudControls() {
  const [isActive, setIsActive] = useState(false)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [displayedNarration, setDisplayedNarration] = useState("")
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const currentStep = TOUR_STEPS[currentStepIndex] || TOUR_STEPS[0]

  // Listen to Global Custom Event to Start Tour
  useEffect(() => {
    const handleStartTour = () => {
      setIsActive(true)
      setCurrentStepIndex(0)
      setIsPaused(false)
    }

    window.addEventListener("start-jarvis-tour", handleStartTour)
    return () => window.removeEventListener("start-jarvis-tour", handleStartTour)
  }, [])

  const tourAudioRef = useRef<HTMLAudioElement | null>(null)

  // Speak narration and trigger next step on completion (Edge Neural TTS + Fallback)
  const speakText = async (text: string) => {
    if (typeof window === "undefined") return

    // Stop existing audio
    if (tourAudioRef.current) {
      tourAudioRef.current.pause()
      tourAudioRef.current.currentTime = 0
    }
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel()
    }

    const spokenText = text
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/https?:\/\/[^\s)]+/g, "")
      .replace(/([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g, "$1 arroba $2")
      .replace(/[*_~`#>\\]/g, "")
      .replace(/[•▪▸►■✦✧★\-\–\—]/g, " ")
      .replace(/\/\//g, " - ")
      .replace(/\+55\s*(\d{2})\s*(\d{4,5})-?(\d{4})/g, "DDD $1, $2 $3")
      .replace(/J\.A\.R\.V\.I\.S\./gi, "Járvis")
      .replace(/\bJARVIS\b/gi, "Járvis")
      .replace(/\bJarvis\b/g, "Járvis")
      .replace(/[:;]+/g, ",")
      .replace(/\n+/g, ", ")
      .replace(/\s+/g, " ")
      .replace(/\s+([.,!?])/g, "$1")
      .trim()

    if (voiceEnabled) {
      try {
        // 1. Exclusively: Microsoft Edge Neural TTS (/api/jarvis/tts)
        const res = await fetch("/api/jarvis/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: spokenText }),
        })

        if (res.ok) {
          const blob = await res.blob()
          const audioUrl = URL.createObjectURL(blob)
          const audio = new Audio(audioUrl)
          tourAudioRef.current = audio

          audio.onended = () => {
            if (!isPaused) {
              timerRef.current = setTimeout(() => {
                handleNext()
              }, 1200)
            }
          }

          audio.onerror = () => {
            if (!isPaused) {
              timerRef.current = setTimeout(() => {
                handleNext()
              }, 2500)
            }
          }

          await audio.play()
          return
        }
      } catch (err) {
        console.warn("Edge TTS failed for tour:", err)
      }
    }

    // Fallback reading timer if voice is muted
    const readingDuration = Math.max(4000, text.length * 45)
    timerRef.current = setTimeout(() => {
      handleNext()
    }, readingDuration)
  }

  // Typewriter effect for active step
  useEffect(() => {
    if (!isActive) return

    // Scroll smoothly to target section
    const element = document.querySelector(currentStep.targetSection)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }

    // Dispatch event for 3D Viewer or other interactive sections
    window.dispatchEvent(
      new CustomEvent("jarvis-tour-step", {
        detail: currentStep,
      })
    )

    // Trigger ID Pass Card Scan in About Section
    if (currentStep.id === "about") {
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent("trigger-id-card-scan"))
      }, 700)
    } else {
      window.dispatchEvent(new CustomEvent("close-id-card-scan"))
    }

    // Open/Close 3D Project Holo-Deck
    if (currentStep.id === "maker_lab" || currentStep.id === "projects") {
      window.dispatchEvent(
        new CustomEvent("open-holodeck-project", {
          detail: { stepId: currentStep.id },
        })
      )
    } else {
      window.dispatchEvent(new CustomEvent("close-holodeck-project"))
    }

    // Typewriter
    let idx = 0
    setDisplayedNarration("")
    const narrationText = currentStep.narration

    const typeInterval = setInterval(() => {
      if (idx < narrationText.length) {
        setDisplayedNarration(narrationText.slice(0, idx + 1))
        idx++
      } else {
        clearInterval(typeInterval)
      }
    }, 11)

    if (timerRef.current) clearTimeout(timerRef.current)
    if (!isPaused) {
      speakText(narrationText)
    }

    return () => {
      clearInterval(typeInterval)
      if (timerRef.current) clearTimeout(timerRef.current)
      if (tourAudioRef.current) {
        tourAudioRef.current.pause()
      }
      window.dispatchEvent(new CustomEvent("close-holodeck-project"))
      window.dispatchEvent(new CustomEvent("close-id-card-scan"))
    }
  }, [isActive, currentStepIndex, isPaused, voiceEnabled])

  const handleNext = () => {
    if (tourAudioRef.current) {
      tourAudioRef.current.pause()
      tourAudioRef.current.currentTime = 0
    }
    window.dispatchEvent(new CustomEvent("close-holodeck-project"))
    window.dispatchEvent(new CustomEvent("close-id-card-scan"))
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1)
    } else {
      handleClose()
    }
  }

  const handleClose = () => {
    setIsActive(false)
    setIsPaused(false)
    window.dispatchEvent(new CustomEvent("close-holodeck-project"))
    window.dispatchEvent(new CustomEvent("close-id-card-scan"))
    if (timerRef.current) clearTimeout(timerRef.current)
    if (tourAudioRef.current) {
      tourAudioRef.current.pause()
      tourAudioRef.current.currentTime = 0
      tourAudioRef.current = null
    }
  }

  const togglePause = () => {
    if (isPaused) {
      setIsPaused(false)
      if (tourAudioRef.current && tourAudioRef.current.paused) {
        tourAudioRef.current.play().catch(() => {})
      }
    } else {
      setIsPaused(true)
      if (timerRef.current) clearTimeout(timerRef.current)
      if (tourAudioRef.current) {
        tourAudioRef.current.pause()
      }
    }
  }

  if (!isActive) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        className="fixed top-18 sm:top-20 left-1/2 -translate-x-1/2 z-[9999] w-[95vw] max-w-3xl flex flex-col gap-2 pointer-events-auto"
      >
        {/* Main HUD Banner with Integrated 3D Holographic Stage */}
        <div className="relative p-3.5 sm:p-4 rounded-2xl bg-gray-950/98 border-2 border-amber-500/60 shadow-[0_0_50px_rgba(245,158,11,0.35)] backdrop-blur-2xl overflow-hidden">
          {/* Subtle Ambient Scanline Grid */}
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-sky-500/5 to-amber-500/10 pointer-events-none" />

          {/* Header Row */}
          <div className="relative z-10 flex items-center justify-between pb-2 border-b border-amber-500/30 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span className="font-extrabold text-amber-400 tracking-wider">
                PILOTO AUTOMÁTICO // J.A.R.V.I.S.
              </span>
              <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40 text-[10px]">
                {currentStepIndex + 1}/{TOUR_STEPS.length}
              </span>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                className={`p-1.5 rounded-lg border transition-colors ${
                  voiceEnabled
                    ? "bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.2)]"
                    : "border-white/10 text-muted-foreground"
                }`}
                title={voiceEnabled ? "Mudo" : "Ativar Voz"}
              >
                {voiceEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={togglePause}
                className="p-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/30 transition-colors cursor-pointer"
                title={isPaused ? "Retomar Tour" : "Pausar Tour"}
              >
                {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={handleNext}
                className="p-1.5 rounded-lg border border-amber-500/40 bg-amber-500 text-black font-bold hover:bg-amber-400 transition-colors cursor-pointer shadow-sm"
                title="Próxima Etapa"
              >
                <SkipForward className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleClose}
                className="p-1.5 rounded-lg border border-white/20 text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors ml-1 cursor-pointer"
                title="Encerrar Tour"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Hologram Stage & Active Step Narration Row */}
          <div className="relative z-10 pt-2.5 flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
            {/* 3D Holographic Sci-Fi Viewport */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-2xl bg-black/80 border border-sky-500/40 shadow-[0_0_20px_rgba(56,189,248,0.25)] overflow-hidden flex flex-col items-center justify-center">
              <div className="absolute top-1 left-1.5 text-[8px] font-mono text-sky-400 font-bold z-10 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                <span>3D HOLO</span>
              </div>
              <JarvisTourHologram stepId={currentStep.id} />
              <div className="absolute bottom-1 inset-x-0 text-center text-[7px] font-mono text-sky-400/70 tracking-widest uppercase pointer-events-none">
                STARK PROTOCOL
              </div>
            </div>

            {/* Narration Text Stream */}
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-mono text-amber-300 font-bold flex items-center gap-1.5 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate">{currentStep.title} — {currentStep.subtitle}</span>
              </div>
              <p className="text-xs sm:text-[13px] font-mono text-slate-200 leading-relaxed min-h-[48px]">
                {displayedNarration}
                <span className="inline-block w-1.5 h-3 ml-1 bg-amber-400 animate-pulse align-middle" />
              </p>
            </div>
          </div>

          {/* Bottom Progress Bar */}
          <div className="relative z-10 mt-3 h-1 w-full bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: `${((currentStepIndex + 1) / TOUR_STEPS.length) * 100}%` }}
              transition={{ duration: 0.4 }}
              className="h-full bg-gradient-to-r from-sky-500 via-amber-500 to-orange-500 shadow-[0_0_8px_#f59e0b]"
            />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
