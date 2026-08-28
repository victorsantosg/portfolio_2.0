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

  // Speak narration and trigger next step on completion
  const speakText = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return
    window.speechSynthesis.cancel()

    const spokenText = text
      .replace(/J\.A\.R\.V\.I\.S\./gi, "Járvis")
      .replace(/•\s*/g, ", ")
      .replace(/\n+/g, " ")
      .replace(/\/\//g, " - ")
      .trim()

    const utterance = new SpeechSynthesisUtterance(spokenText)
    const voices = window.speechSynthesis.getVoices()
    const bestVoice =
      voices.find(
        (v) =>
          (v.lang === "pt-BR" || v.lang.startsWith("pt")) &&
          (v.name.includes("Natural") ||
            v.name.includes("Neural") ||
            v.name.includes("Google") ||
            v.name.includes("Antonio") ||
            v.name.includes("Luciana") ||
            v.name.includes("Felipe") ||
            v.name.includes("Daniel") ||
            v.name.includes("Francisca"))
      ) || voices.find((v) => v.lang.startsWith("pt"))

    if (bestVoice) utterance.voice = bestVoice
    utterance.rate = 1.02
    utterance.pitch = 0.96

    // Wait until the speech finishes completely before advancing to the next step
    utterance.onend = () => {
      if (!isPaused) {
        timerRef.current = setTimeout(() => {
          handleNext()
        }, 1800)
      }
    }

    utterance.onerror = () => {
      if (!isPaused) {
        timerRef.current = setTimeout(() => {
          handleNext()
        }, 3000)
      }
    }

    if (voiceEnabled) {
      window.speechSynthesis.speak(utterance)
    } else {
      // Fallback timer if voice is muted
      const readingDuration = Math.max(7000, text.length * 65)
      timerRef.current = setTimeout(() => {
        handleNext()
      }, readingDuration)
    }
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
    }, 16)

    if (timerRef.current) clearTimeout(timerRef.current)
    speakText(narrationText)

    return () => {
      clearInterval(typeInterval)
      if (timerRef.current) clearTimeout(timerRef.current)
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [isActive, currentStepIndex, isPaused, voiceEnabled])

  const handleNext = () => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1)
    } else {
      handleClose()
    }
  }

  const handleClose = () => {
    setIsActive(false)
    if (timerRef.current) clearTimeout(timerRef.current)
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel()
    }
  }

  const togglePause = () => {
    if (isPaused) {
      setIsPaused(false)
    } else {
      setIsPaused(true)
      if (timerRef.current) clearTimeout(timerRef.current)
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel()
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
        className="fixed top-20 left-1/2 -translate-x-1/2 z-[9999] w-[94vw] max-w-2xl flex flex-col gap-2 pointer-events-auto"
      >
        {/* Main HUD Banner */}
        <div className="relative p-3 sm:p-4 rounded-2xl bg-gray-950/95 border-2 border-amber-500/60 shadow-[0_0_40px_rgba(245,158,11,0.3)] backdrop-blur-2xl overflow-hidden">
          {/* Subtle Ambient Scanline */}
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-transparent to-amber-500/10 pointer-events-none" />

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
                    ? "bg-amber-500/20 border-amber-400 text-amber-300"
                    : "border-white/10 text-muted-foreground"
                }`}
                title={voiceEnabled ? "Mudo" : "Ativar Voz"}
              >
                {voiceEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={togglePause}
                className="p-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/30 transition-colors"
                title={isPaused ? "Retomar Tour" : "Pausar Tour"}
              >
                {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={handleNext}
                className="p-1.5 rounded-lg border border-amber-500/40 bg-amber-500 text-black font-bold hover:bg-amber-400 transition-colors"
                title="Próxima Etapa"
              >
                <SkipForward className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleClose}
                className="p-1.5 rounded-lg border border-white/20 text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors ml-1"
                title="Encerrar Tour"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Active Step Narration Stream */}
          <div className="relative z-10 pt-2.5">
            <div className="text-[11px] font-mono text-amber-300 font-bold flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>{currentStep.title} — {currentStep.subtitle}</span>
            </div>
            <p className="text-xs sm:text-[13px] font-mono text-slate-200 leading-relaxed min-h-[36px]">
              {displayedNarration}
              <span className="inline-block w-1.5 h-3 ml-1 bg-amber-400 animate-pulse align-middle" />
            </p>
          </div>

          {/* Bottom Progress Bar */}
          <div className="relative z-10 mt-2.5 h-1 w-full bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: `${((currentStepIndex + 1) / TOUR_STEPS.length) * 100}%` }}
              transition={{ duration: 0.4 }}
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 shadow-[0_0_8px_#f59e0b]"
            />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
