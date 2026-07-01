"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { ArrowRight, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useLanguage } from "@/hooks/use-language"

export function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { t } = useLanguage()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let radius = Math.max(window.innerWidth * 0.35, 520)

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height
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

      // Caixa de exclusão retangular para proteger o bloco de texto central
      const excludeWidth = 420  // Metade da largura protegida (total: 840px)
      const excludeHeight = 300 // Metade da altura protegida (total: 600px)
      const fadePadding = 80    // Margem de transição suave

      // Desenha as conexões 3D entre tags próximas
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

            // Verifica se as extremidades da linha entram na caixa central protegida
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

              // Pulso elétrico/LED correndo pela linha
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

      // Desenha as tags de texto projetadas em perspectiva
      sortedItems.forEach((item) => {
        const scale = depth / (depth + item.z * radius)
        if (scale <= 0) return // Ignora se estiver fora dos limites da perspectiva

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

        // Desenha apenas se estiver fora da área protegida
        if (tagFade > 0) {
          // Pequena esfera de conexão
          ctx.beginPath()
          ctx.arc(x - 10 * scale, y - 4 * scale, Math.max(0.1, 3 * scale), 0, Math.PI * 2)
          ctx.fillStyle = `rgba(34, 197, 94, ${scale * 0.8 * tagFade})`
          ctx.fill()

          // Label da tecnologia em perspectiva
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

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <canvas ref={canvasRef} className="absolute inset-0 z-10 pointer-events-none opacity-70" />

      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background z-0" />

      <div className="relative z-20 container mx-auto px-6 py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-5xl mx-auto text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="relative mb-8"
          >
            <div className="relative w-32 h-32 md:w-40 md:h-40 mx-auto">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary via-accent to-primary animate-gradient bg-[length:200%_200%] blur-md opacity-60" />
              <div className="relative w-full h-full rounded-full border-2 border-primary/50 overflow-hidden bg-card">
                <Image
                  src="/img_victor.jpeg"
                  alt="Victor Santos"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">
              {t.hero.available}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-balance"
          >
            <span className="text-foreground">{t.hero.title1}</span>
            <br />
            <span className="text-gradient animate-gradient bg-[length:200%_200%]">
              {t.hero.titleGradient}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 text-pretty"
          >
            {t.hero.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                size="lg"
                onClick={() => scrollToSection("#orcamento")}
                className="bg-primary text-primary-foreground font-semibold px-8 py-6 text-lg glow-border animate-pulse-glow"
              >
                {t.hero.ctaPrimary}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
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
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="mt-20 flex items-center justify-center gap-12 flex-wrap"
          >
            {[
              { value: "35+", label: t.hero.stats.repos },
              { value: "3+", label: t.hero.stats.exp },
              { value: "100%", label: t.hero.stats.automation },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + index * 0.1, duration: 0.6 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-gradient">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
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

