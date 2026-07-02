"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { ArrowRight, ExternalLink, Cpu } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useLanguage } from "@/hooks/use-language"

export function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { t } = useLanguage()

  // J.A.R.V.I.S. Assembly States
  const [assemblyState, setAssemblyState] = useState<"disassembled" | "assembling" | "assembled">("disassembled")

  // Stats Counters
  const [reposCount, setReposCount] = useState(0)
  const [yearsCount, setYearsCount] = useState(0)
  const [autoCount, setAutoCount] = useState(0)

  const handleAssemble = () => {
    if (assemblyState === "assembling") return
    
    setAssemblyState("assembling")

    // Reset counters and count up
    setReposCount(0)
    setYearsCount(0)
    setAutoCount(0)

    const steps = 30
    const intervalTime = 1500 / steps
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
      }
    }, intervalTime)

    const timer = setTimeout(() => {
      setAssemblyState("assembled")
    }, 1600)

    return () => {
      clearInterval(counterInterval)
      clearTimeout(timer)
    }
  }

  const getAssemblyVariants = (index: number, direction: "left" | "right" | "top" | "bottom" | "scale") => {
    const isDisassembled = assemblyState === "disassembled"
    
    if (isDisassembled) {
      switch (direction) {
        case "left":
          return { x: -600 - index * 100, y: -50, rotate: -35, opacity: 0, scale: 0.4 }
        case "right":
          return { x: 600 + index * 100, y: 50, rotate: 35, opacity: 0, scale: 0.4 }
        case "top":
          return { y: -500, x: (index - 2) * 80, rotate: -45, opacity: 0, scale: 0.2 }
        case "bottom":
          return { y: 400, x: (index - 1) * 120, rotate: 20, opacity: 0, scale: 0.3 }
        case "scale":
        default:
          return { scale: 0.05, opacity: 0, rotate: 180 }
      }
    }
    return { x: 0, y: 0, rotate: 0, opacity: 1, scale: 1 }
  }

  const getTransition = (delay: number) => {
    return {
      type: "spring" as const,
      stiffness: 75,
      damping: 14,
      delay: assemblyState === "assembling" ? delay : 0,
    }
  }

  // 3D Tag Cloud Canvas logic
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let radius = Math.max(window.innerWidth * 0.35, 520)

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      radius = Math.max(canvas.width * 0.35, 520)
    }
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    const tags = [
      "Next.js", "React", "TypeScript", "Python", "Fastify", "Prisma",
      "PostgreSQL", "Docker", "Coolify", "Flutter", "PWA", "Tailwind v4",
      "Node.js", "Git", "Figma", "Supabase", "Firebase", "ETL",
      "AWS", "REST APIs", "Data Analysis", "SQL", "Pandas"
    ]

    const items = tags.map((text, i) => {
      const phi = Math.acos(-1 + (2 * i) / tags.length)
      const theta = Math.sqrt(tags.length * Math.PI) * phi
      return {
        text,
        x: Math.cos(theta) * Math.sin(phi),
        y: Math.sin(theta) * Math.sin(phi),
        z: Math.cos(phi),
      }
    })

    let targetAngleX = 0.0001
    let targetAngleY = 0.0001
    let currentAngleX = 0.0001
    let currentAngleY = 0.0001
    let pulseTime = 0

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      targetAngleY = (e.clientX - cx) * 0.0000008
      targetAngleX = -(e.clientY - cy) * 0.0000008
    }

    const handleMouseLeave = () => {
      targetAngleX = 0.0001
      targetAngleY = 0.0001
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseleave", handleMouseLeave)

    const animate = () => {
      if (!canvas || !ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      currentAngleX += (targetAngleX - currentAngleX) * 0.08
      currentAngleY += (targetAngleY - currentAngleY) * 0.08
      pulseTime += 0.008

      const cosX = Math.cos(currentAngleX)
      const sinX = Math.sin(currentAngleX)
      const cosY = Math.cos(currentAngleY)
      const sinY = Math.sin(currentAngleY)

      items.forEach((item) => {
        // Rotate X
        const y1 = item.y * cosX - item.z * sinX
        const z1 = item.z * cosX + item.y * sinX
        item.y = y1
        item.z = z1

        // Rotate Y
        const x2 = item.x * cosY - item.z * sinY
        const z2 = item.z * cosY + item.x * sinY
        item.x = x2
        item.z = z2
      })

      const sortedItems = [...items].sort((a, b) => b.z - a.z)
      const depth = 450
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2

      const excludeWidth = Math.min(canvas.width * 0.35, 420)
      const excludeHeight = Math.min(canvas.height * 0.3, 220)
      const fadePadding = canvas.width < 768 ? 40 : 80

      ctx.lineWidth = 0.6
      for (let i = 0; i < items.length; i++) {
        for (let j = i + 1; j < items.length; j++) {
          const dx = items[i].x - items[j].x
          const dy = items[i].y - items[j].y
          const dz = items[i].z - items[j].z
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)

          if (dist < 1.3) {
            const scaleI = depth / (depth + items[i].z * radius)
            const scaleJ = depth / (depth + items[j].z * radius)

            const xi = (items[i].x * radius) * scaleI + centerX
            const yi = (items[i].y * radius) * scaleI + centerY
            const xj = (items[j].x * radius) * scaleJ + centerX
            const yj = (items[j].y * radius) * scaleJ + centerY

            const dxI = Math.abs(xi - centerX)
            const dyI = Math.abs(yi - centerY)
            const dxJ = Math.abs(xj - centerX)
            const dyJ = Math.abs(yj - centerY)

            let lineFade = 1
            if ((dxI < excludeWidth && dyI < excludeHeight) || (dxJ < excludeWidth && dyJ < excludeHeight)) {
              lineFade = 0
            } else {
              const fadeIX = dxI < excludeWidth + fadePadding ? (dxI - excludeWidth) / fadePadding : 1
              const fadeIY = dyI < excludeHeight + fadePadding ? (dyI - excludeHeight) / fadePadding : 1
              const fadeJX = dxJ < excludeWidth + fadePadding ? (dxJ - excludeWidth) / fadePadding : 1
              const fadeJY = dyJ < excludeHeight + fadePadding ? (dyJ - excludeHeight) / fadePadding : 1
              lineFade = Math.min(Math.max(fadeIX, fadeIY), Math.max(fadeJX, fadeJY))
            }

            if (lineFade > 0) {
              const alpha = (1 - dist / 1.3) * 0.12 * Math.min(scaleI, scaleJ) * lineFade
              ctx.beginPath()
              ctx.moveTo(xi, yi)
              ctx.lineTo(xj, yj)
              ctx.strokeStyle = `rgba(34, 197, 94, ${alpha})`
              ctx.stroke()

              const progress = (pulseTime + (i * 0.15) + (j * 0.07)) % 1.0
              const px = items[i].x + progress * (items[j].x - items[i].x)
              const py = items[i].y + progress * (items[j].y - items[i].y)
              const pz = items[i].z + progress * (items[j].z - items[i].z)

              const scaleP = depth / (depth + pz * radius)
              if (scaleP > 0) {
                const xPulse = (px * radius) * scaleP + centerX
                const yPulse = (py * radius) * scaleP + centerY

                ctx.beginPath()
                ctx.arc(xPulse, yPulse, Math.max(0.1, 0.8 * scaleP), 0, Math.PI * 2)
                ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 3.5})`
                ctx.fill()
              }
            }
          }
        }
      }

      sortedItems.forEach((item) => {
        const scale = depth / (depth + item.z * radius)
        if (scale <= 0) return

        const x = (item.x * radius) * scale + centerX
        const y = (item.y * radius) * scale + centerY

        const dx = Math.abs(x - centerX)
        const dy = Math.abs(y - centerY)

        let tagFade = 1
        if (dx < excludeWidth && dy < excludeHeight) {
          tagFade = 0
        } else {
          const fadeX = dx < excludeWidth + fadePadding ? (dx - excludeWidth) / fadePadding : 1
          const fadeY = dy < excludeHeight + fadePadding ? (dy - excludeHeight) / fadePadding : 1
          tagFade = Math.max(fadeX, fadeY)
        }

        if (tagFade > 0) {
          ctx.beginPath()
          ctx.arc(x - 10 * scale, y - 4 * scale, Math.max(0.1, 3 * scale), 0, Math.PI * 2)
          ctx.fillStyle = `rgba(34, 197, 94, ${scale * 0.8 * tagFade})`
          ctx.fill()

          ctx.font = `bold ${Math.round(11 * scale + 7)}px monospace`
          ctx.fillStyle = `rgba(255, 255, 255, ${(scale * 0.8 + 0.2) * tagFade})`
          ctx.fillText(item.text, x, y)
        }
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      handleAssemble()
    }, 600)
    return () => clearTimeout(timer)
  }, [])

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  const title1 = t.hero.title1
  const title2 = t.hero.titleGradient

  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center justify-center overflow-hidden py-24"
    >
      <canvas ref={canvasRef} className="absolute inset-0 z-10 pointer-events-none opacity-70" />

      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background z-0" />

      {assemblyState === "assembling" && (
        <div 
          className="absolute left-0 right-0 h-[3px] z-50 pointer-events-none animate-vs-laser-scan-viewport"
          style={{
            background: "linear-gradient(90deg, transparent, var(--primary), #fff, var(--primary), transparent)",
            boxShadow: "0 0 15px var(--primary), 0 0 30px var(--primary)"
          }}
        />
      )}

      <div className="relative z-20 container mx-auto px-6 py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-5xl mx-auto text-center"
        >
          {/* Avatar / Portrait with Holographic Targets */}
          <div className="relative group mb-8">
            {assemblyState === "assembling" && (
              <>
                <div 
                  className="absolute -inset-6 rounded-full border-2 border-dashed pointer-events-none animate-spin" 
                  style={{ borderColor: "rgba(34, 197, 94, 0.3)", animationDuration: "12s" }}
                />
                <div 
                  className="absolute -inset-10 rounded-full border border-dotted pointer-events-none animate-spin" 
                  style={{ borderColor: "rgba(34, 197, 94, 0.15)", animationDuration: "25s", animationDirection: "reverse" }}
                />
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-[10px] font-mono select-none text-primary">[ CALIBRATING LOCK-ON ]</div>
              </>
            )}

            <motion.div 
              initial={{ scale: 0.1, rotate: -180, opacity: 0 }}
              animate={assemblyState === "disassembled" ? { scale: 0.05, rotate: -240, opacity: 0, y: -200 } : { scale: 1, rotate: 0, opacity: 1, y: 0 }}
              transition={getTransition(0.1)}
              className="relative w-32 h-32 md:w-40 md:h-40 mx-auto rounded-full p-1.5 flex items-center justify-center bg-gray-950 border-2"
              style={{ 
                borderColor: "var(--primary)",
                boxShadow: "0 0 25px rgba(34, 197, 94, 0.3), inset 0 0 15px rgba(34, 197, 94, 0.2)" 
              }}
            >
              {assemblyState === "assembling" && (
                <div 
                  className="absolute bottom-[-40px] left-1/2 -translate-x-1/2 w-8 h-16 pointer-events-none bg-gradient-to-t blur-md opacity-80"
                  style={{
                    backgroundImage: "linear-gradient(to top, transparent, var(--primary), #fff)"
                  }}
                />
              )}

              <div className="relative w-full h-full rounded-full overflow-hidden border border-gray-800 bg-gray-900 flex items-center justify-center">
                <Image
                  src="/img_victor.jpeg"
                  alt="Victor Santos"
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              <div 
                className="absolute bottom-0 right-1 w-8 h-8 rounded-full border border-black bg-primary flex items-center justify-center shadow-lg animate-pulse"
                style={{ 
                  boxShadow: "0 0 10px var(--primary)"
                }}
              >
                <Cpu className="w-4 h-4 text-white" />
              </div>
            </motion.div>
          </div>

          {/* Status Badge */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={assemblyState === "disassembled" ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
            transition={getTransition(0.4)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 mb-8 text-sm font-medium text-primary"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span>{t.hero.available}</span>
          </motion.div>

          {/* Flying Titles */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-balance">
            <span className="flex flex-wrap justify-center gap-x-3 gap-y-1">
              {title1.split(" ").map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={getAssemblyVariants(i, i % 2 === 0 ? "left" : "right")}
                  transition={getTransition(0.3 + i * 0.12)}
                  className="inline-block relative text-foreground"
                >
                  {word}
                  {assemblyState === "assembling" && (
                    <span className="absolute left-0 right-0 bottom-0 h-[2px] bg-white animate-pulse" />
                  )}
                </motion.span>
              ))}
            </span>
            <span className="flex flex-wrap justify-center gap-x-4">
              {title2.split(" ").map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={getAssemblyVariants(i, i === 1 ? "scale" : i === 0 ? "left" : "right")}
                  transition={getTransition(0.8 + i * 0.15)}
                  className="inline-block text-gradient animate-gradient bg-[length:200%_200%]"
                >
                  {word}
                </motion.span>
              ))}
            </span>
          </h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 100 }}
            animate={assemblyState === "disassembled" ? { opacity: 0, y: 150 } : { opacity: 1, y: 0 }}
            transition={getTransition(1.1)}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 text-pretty"
          >
            {t.hero.subtitle}
          </motion.p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.div
              initial={{ x: -200, opacity: 0 }}
              animate={assemblyState === "disassembled" ? { x: -300, opacity: 0 } : { x: 0, opacity: 1 }}
              transition={getTransition(1.3)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                size="lg"
                onClick={() => scrollToSection("#orcamento")}
                className="bg-primary text-primary-foreground font-semibold px-8 py-6 text-lg glow-border animate-pulse-glow"
              >
                {t.hero.ctaPrimary}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>

            <motion.div
              initial={{ x: 200, opacity: 0 }}
              animate={assemblyState === "disassembled" ? { x: 300, opacity: 0 } : { x: 0, opacity: 1 }}
              transition={getTransition(1.4)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                size="lg"
                variant="outline"
                onClick={() => scrollToSection("#projetos")}
                className="border-border bg-transparent hover:bg-secondary font-semibold px-8 py-6 text-lg"
              >
                {t.hero.ctaSecondary}
                <ExternalLink className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </div>

          {/* Stats Bar */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={assemblyState === "disassembled" ? { y: 150, opacity: 0 } : { y: 0, opacity: 1 }}
            transition={getTransition(1.6)}
            className="mt-20 flex items-center justify-center gap-12 flex-wrap"
          >
            {[
              { value: `${reposCount}+`, label: t.hero.stats.repos },
              { value: `${yearsCount}+`, label: t.hero.stats.exp },
              { value: `${autoCount}%`, label: t.hero.stats.automation },
            ].map((stat) => (
              <div
                key={stat.label}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-gradient">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

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

