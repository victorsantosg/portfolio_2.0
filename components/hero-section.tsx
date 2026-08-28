"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { ArrowRight, ExternalLink, Cpu } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useLanguage } from "@/hooks/use-language"

// Kinetic 3D Letter Zoom on Hover Component
function KineticLetters({
  text,
  isGradient = false,
  className = "",
}: {
  text: string
  isGradient?: boolean
  className?: string
}) {
  return (
    <span className={`inline-flex flex-wrap gap-x-2 sm:gap-x-3 gap-y-1 ${className}`}>
      {text.split(" ").map((word, wIdx) => (
        <span key={wIdx} className="inline-flex whitespace-nowrap">
          {word.split("").map((char, cIdx) => (
            <motion.span
              key={cIdx}
              whileHover={{
                scale: 1.35,
                y: -6,
                rotate: cIdx % 2 === 0 ? 5 : -5,
                color: isGradient ? "#fbbf24" : "#ee7112",
                textShadow: "0 0 16px rgba(238, 113, 18, 0.9), 0 0 32px rgba(238, 113, 18, 0.5)",
              }}
              transition={{ type: "spring", stiffness: 450, damping: 10 }}
              className={`inline-block cursor-default select-none transition-colors duration-150 ${
                isGradient ? "text-gradient animate-gradient bg-[length:200%_200%]" : "text-foreground"
              }`}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </span>
      ))}
    </span>
  )
}

// 3D Cybernetic Hologram Avatar with Spring Tilt & Laser Scanline
function InteractiveHeroAvatar({
  isDesktop = false,
  assemblyState,
  getTransition,
}: {
  isDesktop?: boolean
  assemblyState: "disassembled" | "assembling" | "assembled"
  getTransition: (delay: number) => any
}) {
  const avatarRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  // 3D Tilt Motion Values
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springConfig = { damping: 18, stiffness: 280 }
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [16, -16]), springConfig)
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-16, 16]), springConfig)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!avatarRef.current) return
    const rect = avatarRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    mouseX.set(x)
    mouseY.set(y)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
    setIsHovered(false)
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!avatarRef.current || e.touches.length === 0) return
    const touch = e.touches[0]
    const rect = avatarRef.current.getBoundingClientRect()
    const x = (touch.clientX - rect.left) / rect.width - 0.5
    const y = (touch.clientY - rect.top) / rect.height - 0.5
    mouseX.set(x)
    mouseY.set(y)
    setIsHovered(true)
  }

  const handleTouchEnd = () => {
    mouseX.set(0)
    mouseY.set(0)
    setIsHovered(false)
  }

  const sizeClasses = isDesktop
    ? "w-64 h-64 xl:w-84 xl:h-84"
    : "w-36 h-36 sm:w-44 sm:h-44"

  return (
    <div style={{ perspective: 1000 }} className="relative select-none">
      <motion.div
        ref={avatarRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        onTouchMove={handleTouchMove}
        onTouchStart={() => setIsHovered(true)}
        onTouchEnd={handleTouchEnd}
        initial={{ scale: 0.1, rotate: -180, opacity: 0 }}
        animate={
          assemblyState === "disassembled"
            ? { scale: 0.05, rotate: -240, opacity: 0, y: -200 }
            : { scale: 1, rotate: 0, opacity: 1, y: 0 }
        }
        transition={getTransition(0.1)}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        whileHover={{
          scale: 1.08,
          transition: { duration: 0.25, ease: "easeOut" },
        }}
        className={`relative ${sizeClasses} rounded-full p-2.5 flex items-center justify-center bg-gray-950/90 border-2 border-primary/50 group cursor-pointer shadow-[0_0_40px_rgba(238,113,18,0.3)] hover:border-[#ee7112] hover:shadow-[0_0_60px_rgba(238,113,18,0.6),inset_0_0_30px_rgba(238,113,18,0.3)] transition-shadow duration-500`}
      >
        {/* Outer Rotating Cybernetic Telemetry Ring */}
        <div className="absolute inset-[-10px] sm:inset-[-14px] rounded-full border border-dashed border-[#ee7112]/40 animate-[spin_20s_linear_infinite] group-hover:border-[#ee7112]/90 group-hover:animate-[spin_8s_linear_infinite] transition-all duration-300 pointer-events-none" />

        {/* Pulse Aura Wave Ring */}
        <div className="absolute inset-[-4px] rounded-full border border-primary/30 group-hover:border-[#ee7112] group-hover:scale-105 transition-all duration-300 pointer-events-none" />

        {/* Holographic Laser Scanline on Hover */}
        {isHovered && (
          <motion.div
            initial={{ top: "0%", opacity: 0 }}
            animate={{ top: "100%", opacity: [0, 1, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-3 right-3 h-[3px] bg-gradient-to-r from-transparent via-[#ee7112] to-transparent shadow-[0_0_12px_#ee7112] z-30 pointer-events-none rounded-full"
          />
        )}

        {/* Inner Profile Image with 3D Depth & Zoom */}
        <div
          style={{ transform: "translateZ(30px)" }}
          className="relative w-full h-full rounded-full overflow-hidden border border-gray-800 bg-gray-900 flex items-center justify-center shadow-2xl"
        >
          <Image
            src="/img_victor.jpeg"
            alt="Victor Santos"
            fill
            className="object-cover transition-all duration-500 group-hover:scale-115 group-hover:brightness-110"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-[#ee7112]/10 opacity-30 group-hover:opacity-60 transition-opacity duration-300" />
        </div>

        {/* Floating CPU / Cyber Chip Badge */}
        <motion.div
          style={{ transform: "translateZ(55px)" }}
          whileHover={{ scale: 1.35, rotate: 20 }}
          className={`absolute ${
            isDesktop ? "bottom-2 right-2 w-12 h-12" : "bottom-0 right-0 w-8 h-8"
          } rounded-full border border-black bg-primary flex items-center justify-center shadow-[0_0_18px_#ee7112] group-hover:bg-[#ee7112] group-hover:shadow-[0_0_25px_#ee7112] transition-all duration-300`}
        >
          <Cpu className={`${isDesktop ? "w-6 h-6" : "w-4 h-4"} text-white`} />
        </motion.div>
      </motion.div>
    </div>
  )
}

interface HeroSectionProps {
  isLoaded?: boolean
}

export function HeroSection({ isLoaded = true }: HeroSectionProps) {
  const { t } = useLanguage()

  // J.A.R.V.I.S. Iron Man Armor Assembly System
  const [assemblyState, setAssemblyState] = useState<"disassembled" | "assembling" | "assembled">("disassembled")

  // Stats Counters
  const [reposCount, setReposCount] = useState(0)
  const [yearsCount, setYearsCount] = useState(0)
  const [autoCount, setAutoCount] = useState(0)

  useEffect(() => {
    if (!isLoaded) return

    // Small delay (150ms) after loading screen ends to let the user see the pieces fly in!
    const timerStart = setTimeout(() => {
      setAssemblyState("assembling")

      const duration = 1800
      const steps = 30
      const intervalTime = duration / steps
      let currentStep = 0

      const counterInterval = setInterval(() => {
        currentStep++
        const progress = currentStep / steps
        setReposCount(Math.round(progress * 60))
        setYearsCount(Math.round(progress * 2))
        setAutoCount(Math.round(progress * 100))

        if (currentStep >= steps) {
          clearInterval(counterInterval)
          setReposCount(60)
          setYearsCount(2)
          setAutoCount(100)
          setAssemblyState("assembled")
        }
      }, intervalTime)

      return () => {
        clearInterval(counterInterval)
      }
    }, 150)

    return () => clearTimeout(timerStart)
  }, [isLoaded])

  const getTransition = (delay: number) => {
    return {
      type: "spring" as const,
      stiffness: 75,
      damping: 14,
      delay,
    }
  }

  const getAssemblyVariants = (index: number, type: "left" | "right" | "top" | "bottom" | "scale") => {
    if (assemblyState === "disassembled") {
      switch (type) {
        case "left":
          return { x: -500, y: 120, rotate: -25, opacity: 0, scale: 0.3 }
        case "right":
          return { x: 500, y: -120, rotate: 25, opacity: 0, scale: 0.3 }
        case "top":
          return { y: -400, rotate: 15, opacity: 0, scale: 0.3 }
        case "bottom":
          return { y: 400, rotate: -15, opacity: 0, scale: 0.3 }
        case "scale":
          return { scale: 0.1, rotate: -180, opacity: 0 }
      }
    }
    return { x: 0, y: 0, rotate: 0, opacity: 1, scale: 1 }
  }

  const [warpTarget, setWarpTarget] = useState<string | null>(null)
  const [clickPos, setClickPos] = useState<{ x: number; y: number } | null>(null)

  const handleWarpToSection = (href: string, e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setClickPos({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    })
    setWarpTarget(href)

    // 1. Trigger Warp Shockwave & Speed Trail
    setTimeout(() => {
      const targetElem = document.querySelector(href)
      if (targetElem) {
        targetElem.scrollIntoView({ behavior: "smooth" })

        // 2. Pulse Destination Beacon
        targetElem.classList.add("transition-all", "duration-1000", "ring-2", "ring-[#ee7112]", "shadow-[0_0_60px_rgba(238,113,18,0.35)]")
        setTimeout(() => {
          targetElem.classList.remove("ring-2", "ring-[#ee7112]", "shadow-[0_0_60px_rgba(238,113,18,0.35)]")
        }, 1800)
      }
    }, 180)

    // 3. Clear Warp Overlay
    setTimeout(() => {
      setWarpTarget(null)
      setClickPos(null)
    }, 900)
  }

  const title1 = t.hero.title1
  const title2 = t.hero.titleGradient

  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center justify-center overflow-hidden py-24"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background z-0" />

      <div className="relative z-20 container mx-auto px-4 md:px-6 py-12 md:py-20">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center max-w-6xl mx-auto">
          {/* Left Column: Info & CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-7 text-center lg:text-left flex flex-col items-center lg:items-start"
          >
            {/* Avatar - Mobile Only */}
            <div className="relative group mb-8 lg:hidden">
              <InteractiveHeroAvatar
                assemblyState={assemblyState}
                getTransition={getTransition}
              />
            </div>

            {/* Status Badge */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={assemblyState === "disassembled" ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
              transition={getTransition(0.2)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 mb-8 text-sm font-medium text-primary shadow-sm hover:border-[#ee7112] hover:bg-[#ee7112]/10 transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span>{t.hero.available}</span>
            </motion.div>

            {/* Flying Titles with Per-Word Armor Assembly Physics & Kinetic Zoom on Hover */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-balance">
              <div className="flex flex-wrap justify-center lg:justify-start gap-x-3 gap-y-1">
                {title1.split(" ").map((word, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={getAssemblyVariants(i, i % 2 === 0 ? "left" : "right")}
                    transition={getTransition(0.3 + i * 0.12)}
                    className="inline-block relative text-foreground"
                  >
                    <KineticLetters text={word} />
                    {assemblyState === "assembling" && (
                      <span className="absolute left-0 right-0 bottom-0 h-[2px] bg-[#ee7112] shadow-[0_0_8px_#ee7112] animate-pulse" />
                    )}
                  </motion.span>
                ))}
              </div>
              <div className="flex flex-wrap justify-center lg:justify-start gap-x-3 gap-y-1 mt-1">
                {title2.split(" ").map((word, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={getAssemblyVariants(i, i === 1 ? "scale" : i === 0 ? "left" : "right")}
                    transition={getTransition(0.65 + i * 0.15)}
                    className="inline-block text-gradient animate-gradient bg-[length:200%_200%]"
                  >
                    <KineticLetters text={word} isGradient />
                  </motion.span>
                ))}
              </div>
            </h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 80 }}
              animate={assemblyState === "disassembled" ? { opacity: 0, y: 80 } : { opacity: 1, y: 0 }}
              transition={getTransition(0.85)}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl lg:max-w-none lg:text-left mb-10 text-pretty"
            >
              {t.hero.subtitle}
            </motion.p>

            {/* CTA Buttons with Armor Assembly Flight */}
            <div className="flex flex-row items-center justify-center lg:justify-start gap-2.5 sm:gap-3 w-full flex-wrap">
              <motion.div
                initial={{ x: -200, opacity: 0 }}
                animate={assemblyState === "disassembled" ? { x: -200, opacity: 0 } : { x: 0, opacity: 1 }}
                transition={getTransition(0.9)}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  onClick={(e) => handleWarpToSection("#orcamento", e)}
                  className="relative overflow-hidden bg-primary text-primary-foreground font-semibold px-4 py-3.5 text-xs sm:px-8 sm:py-6 sm:text-lg glow-border animate-pulse-glow hover:bg-[#ee7112] hover:shadow-[0_0_30px_rgba(238,113,18,0.8)] cursor-pointer transition-all duration-300"
                >
                  {t.hero.ctaPrimary}
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5 sm:ml-2 sm:h-5 sm:w-5" />
                </Button>
              </motion.div>

              <motion.div
                initial={{ x: 200, opacity: 0 }}
                animate={assemblyState === "disassembled" ? { x: 200, opacity: 0 } : { x: 0, opacity: 1 }}
                transition={getTransition(1.0)}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  variant="outline"
                  onClick={(e) => handleWarpToSection("#projetos", e)}
                  className="relative overflow-hidden border-border bg-transparent hover:bg-secondary font-semibold px-4 py-3.5 text-xs sm:px-8 sm:py-6 sm:text-lg hover:border-[#ee7112] hover:text-amber-300 hover:shadow-[0_0_20px_rgba(238,113,18,0.4)] cursor-pointer transition-all duration-300"
                >
                  {t.hero.ctaSecondary}
                  <ExternalLink className="ml-1.5 h-3.5 w-3.5 sm:ml-2 sm:h-5 sm:w-5" />
                </Button>
              </motion.div>
            </div>

            {/* Stats Bar */}
            <motion.div
              initial={{ y: 120, opacity: 0 }}
              animate={assemblyState === "disassembled" ? { y: 120, opacity: 0 } : { y: 0, opacity: 1 }}
              transition={getTransition(1.2)}
              className="mt-10 sm:mt-16 flex items-center justify-center lg:justify-start w-full"
            >
              <div className="inline-flex items-center gap-0 glass rounded-2xl border border-border/40 overflow-hidden divide-x divide-border/40 w-full max-w-sm sm:max-w-none sm:w-auto hover:border-[#ee7112]/40 transition-colors shadow-lg">
                {[
                  { value: `${reposCount}+`, label: t.hero.stats.repos },
                  { value: `${yearsCount}+`, label: t.hero.stats.exp },
                  { value: `${autoCount}%`, label: t.hero.stats.automation },
                ].map((stat, i) => (
                  <div
                    key={stat.label}
                    className="text-center px-2.5 py-2.5 sm:px-8 sm:py-5 flex-1 group/stat hover:bg-white/5 transition-colors cursor-default"
                  >
                    <div className="text-lg sm:text-3xl md:text-4xl font-bold text-gradient group-hover/stat:scale-110 transition-transform duration-200">
                      {stat.value}
                    </div>
                    <div className="text-[9px] sm:text-sm text-muted-foreground mt-0.5 leading-tight">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Visual Avatar/Jarvis Assembly - Desktop Only */}
          <div className="lg:col-span-5 hidden lg:flex items-center justify-center h-[500px] relative">
            <InteractiveHeroAvatar
              isDesktop
              assemblyState={assemblyState}
              getTransition={getTransition}
            />
          </div>
        </div>
      </div>

      {/* Sci-Fi Quantum Warp Speed Transition Overlay on Button Click */}
      {warpTarget && (
        <div className="fixed inset-0 z-[99999] pointer-events-none overflow-hidden select-none">
          {/* Shockwave circle originating from clicked button */}
          {clickPos && (
            <motion.div
              initial={{ scale: 0.1, opacity: 1 }}
              animate={{ scale: 35, opacity: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="absolute w-20 h-20 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#ee7112] bg-[#ee7112]/20 shadow-[0_0_50px_#ee7112]"
              style={{ left: clickPos.x, top: clickPos.y }}
            />
          )}

          {/* Vertical Hyperdrive Warp Laser Streaks */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.85, 0] }}
            transition={{ duration: 0.65, ease: "easeInOut" }}
            className="absolute inset-0 bg-gradient-to-b from-transparent via-[#ee7112]/15 to-transparent backdrop-blur-[2px]"
          >
            {[...Array(14)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ y: "-100%", opacity: 0.8 }}
                animate={{ y: "200%", opacity: [0, 1, 0] }}
                transition={{
                  duration: 0.45 + (i % 3) * 0.1,
                  repeat: 1,
                  ease: "linear",
                  delay: (i % 4) * 0.05,
                }}
                className="absolute w-[2px] h-48 bg-gradient-to-b from-transparent via-[#ee7112] to-amber-300 shadow-[0_0_15px_#ee7112]"
                style={{ left: `${6 + i * 7}%` }}
              />
            ))}
          </motion.div>

          {/* Holographic Navigation Telemetry Pill */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-16 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/90 border border-[#ee7112] text-amber-300 font-mono text-xs font-bold shadow-[0_0_30px_rgba(238,113,18,0.6)] flex items-center gap-2"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#ee7112] animate-ping" />
            <span>
              TRANSITANDO PARA: {warpTarget.replace("#", "").toUpperCase()}
            </span>
          </motion.div>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-1 h-2 bg-primary rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}

