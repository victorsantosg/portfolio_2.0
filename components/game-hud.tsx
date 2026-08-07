"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useLanguage } from "@/hooks/use-language"
import { Check, Star, Play, Award, Zap } from "lucide-react"
import { toast } from "sonner"

interface Stage {
  id: string
  num: string
  labelPt: string
  labelEn: string
  icon: any
}

export function GameHUD() {
  const { language } = useLanguage()
  const [activeStageIndex, setActiveStageIndex] = useState(0)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [notification, setNotification] = useState<string | null>(null)

  const stages: Stage[] = [
    { id: "inicio", num: "01", labelPt: "Start / Início", labelEn: "Start / Home", icon: Play },
    { id: "sobre", num: "02", labelPt: "Lore / Trajetória", labelEn: "Lore / About", icon: BookIcon },
    { id: "stack", num: "03", labelPt: "Inventory / Skills", labelEn: "Inventory / Skills", icon: Zap },
    { id: "projetos", num: "04", labelPt: "Quests / Projetos", labelEn: "Quests / Projects", icon: Star },
    { id: "orcamento", num: "05", labelPt: "Boss / Orçamento", labelEn: "Boss / Contact", icon: Award },
  ]

  // Custom Book icon since Book is not imported
  function BookIcon(props: any) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={props.className}
      >
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
        <path d="M6 6h10M6 10h10M6 14h10" />
      </svg>
    )
  }

  useEffect(() => {
    const observers = stages.map((stage, index) => {
      const element = document.getElementById(stage.id)
      if (!element) return null

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveStageIndex(index)
          }
        },
        {
          rootMargin: "-40% 0px -40% 0px", // Detect when section is in the middle of screen
          threshold: 0.1,
        }
      )
      observer.observe(element)
      return { observer, element }
    })

    return () => {
      observers.forEach((obs) => {
        if (obs) obs.observer.unobserve(obs.element)
      })
    }
  }, [])

  const scrollToStage = (stageId: string, index: number) => {
    const element = document.getElementById(stageId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      
      // Trigger game-like stage unlock notification via Sonner
      const stage = stages[index]
      const label = language === "pt" ? stage.labelPt : stage.labelEn
      const stageName = label.split(" / ")[1]
      
      toast.success(
        language === "pt" ? `Fase ${stage.num} Desbloqueada: ${stageName}` : `Stage ${stage.num} Unlocked: ${stageName}`,
        {
          description: language === "pt" ? "Conquista de exploração ativada no HUD J.A.R.V.I.S." : "Exploration achievement triggered on J.A.R.V.I.S. HUD",
          icon: "⚡",
          style: {
            backgroundColor: "#090d16",
            borderColor: "rgba(34, 197, 94, 0.4)",
            color: "#f8fafc",
            fontFamily: "monospace",
          },
        }
      )
    }
  }

  return (
    <>
      {/* Floating Level Map HUD - Left/Right side */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-center gap-7 bg-background/25 backdrop-blur-md p-4 rounded-2xl border border-border/20 shadow-2xl">
        <span className="text-[10px] font-bold tracking-widest text-primary/70 font-mono mb-2 uppercase">
          {language === "pt" ? "Fases" : "Stages"}
        </span>

        <div className="relative flex flex-col items-center gap-7">
          {/* Connecting Vertical Trail Line */}
          <div className="absolute top-3 bottom-3 w-[3px] bg-secondary/35 rounded-full overflow-hidden">
            <motion.div
              className="w-full bg-gradient-to-b from-primary to-accent origin-top"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: activeStageIndex / (stages.length - 1) }}
              transition={{ type: "spring", stiffness: 60, damping: 15 }}
              style={{ height: "100%" }}
            />
          </div>

          {stages.map((stage, index) => {
            const isActive = index === activeStageIndex
            const isCompleted = index < activeStageIndex
            const Icon = stage.icon

            return (
              <div
                key={stage.id}
                className="relative group flex items-center justify-center"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Stage Node Button */}
                <button
                  onClick={() => scrollToStage(stage.id, index)}
                  className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-300 shadow-md ${
                    isActive
                      ? "bg-primary border-primary text-primary-foreground scale-110 shadow-primary/45"
                      : isCompleted
                      ? "bg-accent/15 border-accent text-accent"
                      : "bg-card border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/40"
                  }`}
                  aria-label={`Go to stage ${stage.num}`}
                >
                  {/* Glowing Ring for active level */}
                  {isActive && (
                    <span className="absolute inset-0 rounded-full bg-primary/40 animate-ping opacity-60" />
                  )}

                  {isCompleted ? (
                    <Check className="h-4.5 w-4.5 stroke-[3]" />
                  ) : (
                    <Icon className="h-4.5 w-4.5" />
                  )}
                </button>

                {/* Level Map floating label tooltip */}
                <div
                  className={`absolute right-12 px-3 py-1.5 rounded-lg bg-card/95 border border-border/80 text-xs font-mono tracking-wide text-foreground shadow-lg whitespace-nowrap transition-all duration-200 pointer-events-none ${
                    hoveredIndex === index
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 translate-x-4"
                  }`}
                >
                  <span className="text-primary font-bold mr-1.5">STAGE {stage.num}:</span>
                  {language === "pt" ? stage.labelPt.split(" / ")[1] : stage.labelEn.split(" / ")[1]}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Gamified Stage Unlocked Overlay Banner */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 120, damping: 14 }}
            className="fixed bottom-10 left-10 z-[9999] px-6 py-4 rounded-xl border-2 border-primary/50 bg-[#07070a]/95 text-white shadow-2xl flex items-center gap-3 backdrop-blur-md"
            style={{ boxShadow: "0 0 25px rgba(34, 197, 94, 0.25)" }}
          >
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary animate-pulse">
              <Zap className="h-4.5 w-4.5 fill-primary/20" />
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-widest text-primary font-mono uppercase">
                {language === "pt" ? "Fase Desbloqueada" : "Stage Unlocked"}
              </p>
              <p className="text-sm font-bold font-sans tracking-wide text-foreground">
                {notification}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
