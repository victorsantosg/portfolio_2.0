"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { FastForward } from "lucide-react"
import { JarvisHologramCanvas } from "@/components/three/jarvis-hologram-canvas"

interface LoadingScreenProps {
  onComplete?: () => void
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const [isSpinComplete, setIsSpinComplete] = useState(false)
  const [isActivating, setIsActivating] = useState(false)

  // Prevent background scrolling during intro
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = ""
    }
  }, [])

  // Automatic sequence: 3D Spin -> Seamless Holographic Dissolve -> Page Reveal
  useEffect(() => {
    // 1. Conclusão do giro 3D inicial (1.6s)
    const timerSpin = setTimeout(() => {
      setIsSpinComplete(true)
    }, 1600)

    // 2. Disparo da dispersão holográfica (2.4s)
    const timerActivate = setTimeout(() => {
      setIsActivating(true)
    }, 2400)

    // 3. Redirecionamento suave sem travamentos (2.85s)
    const timerRedirect = setTimeout(() => {
      if (onComplete) {
        onComplete()
      }
    }, 2850)

    return () => {
      clearTimeout(timerSpin)
      clearTimeout(timerActivate)
      clearTimeout(timerRedirect)
    }
  }, [onComplete])

  // 3D Parallax effect on mouse move
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      const { innerWidth, innerHeight } = window
      const x = (e.clientX / innerWidth) * 2 - 1
      const y = (e.clientY / innerHeight) * 2 - 1
      setMousePos({ x, y })
      setIsHovered(true)
    }

    const handleMouseLeave = () => {
      setIsHovered(false)
      setMousePos({ x: 0, y: 0 })
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!containerRef.current || e.touches.length === 0) return
      const touch = e.touches[0]
      const { innerWidth, innerHeight } = window
      const x = (touch.clientX / innerWidth) * 2 - 1
      const y = (touch.clientY / innerHeight) * 2 - 1
      setMousePos({ x, y })
      setIsHovered(true)
    }

    const handleTouchEnd = () => {
      setIsHovered(false)
      setMousePos({ x: 0, y: 0 })
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseleave", handleMouseLeave)
    window.addEventListener("touchmove", handleTouchMove, { passive: true })
    window.addEventListener("touchend", handleTouchEnd)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseleave", handleMouseLeave)
      window.removeEventListener("touchmove", handleTouchMove)
      window.removeEventListener("touchend", handleTouchEnd)
    }
  }, [])

  const handleSkip = () => {
    if (onComplete) {
      onComplete()
    }
  }

  // Smooth 3D tilt angles for mouse/touch parallax
  const mouseRotX = isHovered && isSpinComplete ? -mousePos.y * 12 : 0
  const mouseRotY = isHovered && isSpinComplete ? mousePos.x * 16 : 0

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.03 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="fixed inset-0 z-[99999] bg-[#030303] flex flex-col items-center justify-center p-3 sm:p-4 overflow-hidden select-none"
      style={{ perspective: 1200 }}
    >
      {/* 1. REAL-TIME 3D PROCEDURAL J.A.R.V.I.S. HOLOGRAM CANVAS */}
      <JarvisHologramCanvas isSpinComplete={isSpinComplete} isActivating={isActivating} />

      {/* 2. J.A.R.V.I.S. TELEMETRY & HUD OVERLAY */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {/* Top Santos Telemetry Bar */}
        <div className="absolute top-3 left-3 right-3 sm:top-6 sm:left-6 sm:right-6 flex items-center justify-between text-[11px] sm:text-xs font-mono text-amber-400 gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2 bg-black/80 backdrop-blur-md px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)] max-w-[70vw] sm:max-w-none truncate">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-amber-400 animate-ping shrink-0" />
            <span className="truncate">
              <span className="hidden sm:inline">PROTOCOLO SANTOS // </span>MOTOR 3D J.A.R.V.I.S. ATIVO
            </span>
          </div>

          <button
            onClick={handleSkip}
            className="pointer-events-auto shrink-0 flex items-center gap-1 bg-black/80 hover:bg-black/95 backdrop-blur-md px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full border border-amber-500/30 text-muted-foreground hover:text-amber-300 transition-colors text-[10px] sm:text-xs cursor-pointer group shadow-[0_0_15px_rgba(0,0,0,0.5)]"
          >
            <span>PULAR</span>
            <FastForward className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* 3. 3D METALLIC VS LOGO WITH ROTATION & PARALLAX */}
      <motion.div
        animate={isActivating ? { opacity: 0, scale: 1.15 } : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="relative z-20 flex flex-col items-center justify-center pointer-events-none px-4"
      >
        {/* Glowing Arc Reactor Backdrop Glow */}
        <motion.div
          animate={{ scale: [1, 1.25, 1], opacity: [0.65, 0.95, 0.65] }}
          transition={{ duration: 2.0, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-40 sm:w-56 h-40 sm:h-56 rounded-full bg-amber-500/30 blur-3xl pointer-events-none"
        />

        {/* VS 3D Card with Initial Spin and Tilt */}
        <motion.div
          initial={{ rotateY: 720, scale: 0.7, opacity: 0 }}
          animate={{
            rotateY: isSpinComplete ? mouseRotY : 0,
            rotateX: isSpinComplete ? mouseRotX : 0,
            scale: 1,
            opacity: 1,
          }}
          transition={{
            rotateY: isSpinComplete ? { duration: 0.15, ease: "linear" } : { duration: 1.6, ease: "easeOut" },
            rotateX: { duration: 0.15, ease: "linear" },
            scale: { duration: 1.2, ease: "easeOut" },
            opacity: { duration: 0.8 },
          }}
          className="relative w-44 xs:w-52 sm:w-72 md:w-88 h-auto flex items-center justify-center max-w-[80vw]"
          style={{ transformStyle: "preserve-3d" }}
        >
          <img
            src="/logovs-orange.svg"
            alt="Logo VS Cyber Circuit"
            className="w-full h-auto object-contain filter drop-shadow-[0_0_25px_rgba(238,113,18,0.9)] sm:drop-shadow-[0_0_35px_rgba(238,113,18,0.9)]"
          />
        </motion.div>

        {/* Identity Title */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-3 sm:mt-4 text-center px-2"
        >
          <div className="text-xl sm:text-3xl font-extrabold tracking-widest text-amber-400 font-mono drop-shadow-[0_0_18px_rgba(245,158,11,0.7)]">
            VICTOR SANTOS
          </div>
          <div className="text-[10px] sm:text-sm font-mono text-muted-foreground tracking-widest mt-1">
            FULL STACK & AI SYSTEMS ARCHITECT
          </div>
        </motion.div>

        {/* 4. AUTOMATIC STATUS TELEMETRY BADGE */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.9 }}
          className="mt-5 sm:mt-8 flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-black/80 border border-amber-500/30 backdrop-blur-md text-amber-400 text-[10px] sm:text-xs font-mono shadow-[0_0_20px_rgba(245,158,11,0.25)] max-w-[92vw] text-center"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
          <span className="truncate">
            INICIALIZANDO SISTEMAS<span className="hidden xs:inline"> • ACESSANDO PORTFÓLIO...</span>
          </span>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
