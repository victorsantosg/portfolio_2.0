"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import * as THREE from "three"

interface JarvisGuideDroneProps {
  targetHref: string | null
  startPos: { x: number; y: number } | null
  onComplete: () => void
}

export function JarvisGuideDrone({ targetHref, startPos, onComplete }: JarvisGuideDroneProps) {
  const canvasMountRef = useRef<HTMLDivElement>(null)
  const [speechText, setSpeechText] = useState("")
  const [targetTitle, setTargetTitle] = useState("DESTINO")
  const [isArrived, setIsArrived] = useState(false)

  const droneAudioRef = useRef<HTMLAudioElement | null>(null)

  // Exclusive Neural Voice Synthesis via Edge TTS API (/api/jarvis/tts)
  const speakJarvisVoice = async (phrase: string) => {
    if (typeof window === "undefined") return

    if (droneAudioRef.current) {
      droneAudioRef.current.pause()
      droneAudioRef.current.currentTime = 0
    }

    try {
      const res = await fetch("/api/jarvis/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: phrase }),
      })

      if (res.ok) {
        const blob = await res.blob()
        const audioUrl = URL.createObjectURL(blob)
        const audio = new Audio(audioUrl)
        droneAudioRef.current = audio
        await audio.play()
      }
    } catch (err) {
      console.warn("Drone Neural TTS failed:", err)
    }
  }

  useEffect(() => {
    if (!targetHref) return

    let routeTitle = "MÓDULO DE ENGENHARIA"
    let routePhrase = "Direcionando os sensores para o destino, Senhor."

    if (targetHref === "#orcamento") {
      routeTitle = "MÓDULO DE ORÇAMENTO"
      routePhrase = "Calculando rota de engenharia. Acompanhe-me até o módulo de orçamento, Senhor."
    } else if (targetHref === "#projetos") {
      routeTitle = "GALERIA DE PROJETOS"
      routePhrase = "Acessando banco de protótipos. Direcionando para o showroom de projetos ativos."
    } else if (targetHref === "#maker-lab") {
      routeTitle = "3D MAKER LAB"
      routePhrase = "Carregando gêmeo digital e prototipagem 3D."
    } else if (targetHref === "#sobre") {
      routeTitle = "HISTÓRICO PROFISSIONAL"
      routePhrase = "Acessando registros de missões do Criador."
    } else if (targetHref === "#stack") {
      routeTitle = "ARQUITETURA DO TRAJE"
      routePhrase = "Examinando a stack tecnológica e frameworks."
    }

    setTargetTitle(routeTitle)
    setSpeechText(routePhrase)
    speakJarvisVoice(routePhrase)

    // Smooth scroll down guided by JARVIS
    const scrollTimer = setTimeout(() => {
      const elem = document.querySelector(targetHref)
      if (elem) {
        elem.scrollIntoView({ behavior: "smooth" })
      }
    }, 550)

    // Arrival pulse after scroll
    const arriveTimer = setTimeout(() => {
      setIsArrived(true)
      const targetElem = document.querySelector(targetHref)
      if (targetElem) {
        targetElem.classList.add(
          "transition-all",
          "duration-1000",
          "ring-4",
          "ring-[#ee7112]",
          "shadow-[0_0_80px_rgba(238,113,18,0.7)]"
        )
        setTimeout(() => {
          targetElem.classList.remove("ring-4", "ring-[#ee7112]", "shadow-[0_0_80px_rgba(238,113,18,0.7)]")
        }, 2200)
      }
    }, 1250)

    // Finish transition
    const finishTimer = setTimeout(() => {
      onComplete()
    }, 3200)

    return () => {
      clearTimeout(scrollTimer)
      clearTimeout(arriveTimer)
      clearTimeout(finishTimer)
    }
  }, [targetHref])

  // Real-Time 3D Hologram WebGL Scene
  useEffect(() => {
    const container = canvasMountRef.current
    if (!container) return

    const size = 320
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
    camera.position.set(0, 0, 15)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(size, size)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 2.2
    container.appendChild(renderer.domElement)

    // Master Group
    const group = new THREE.Group()
    scene.add(group)

    // 1. Core Sphere Particles (600 glowing points)
    const pCount = 600
    const pGeo = new THREE.BufferGeometry()
    const pPos = new Float32Array(pCount * 3)
    for (let i = 0; i < pCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / pCount)
      const theta = Math.sqrt(pCount * Math.PI) * phi
      const r = 3.6 + Math.random() * 0.4
      pPos[i * 3] = r * Math.cos(theta) * Math.sin(phi)
      pPos[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi)
      pPos[i * 3 + 2] = r * Math.cos(phi)
    }
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3))
    const pMat = new THREE.PointsMaterial({
      color: 0xee7112,
      size: 0.22,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
    })
    const particles = new THREE.Points(pGeo, pMat)
    group.add(particles)

    // 2. Concentric Telemetry Gimbal Rings
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      wireframe: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    })
    const ring1 = new THREE.Mesh(new THREE.RingGeometry(4.4, 4.65, 48), ringMat)
    const ring2 = new THREE.Mesh(new THREE.RingGeometry(5.2, 5.45, 48), ringMat)
    const ring3 = new THREE.Mesh(new THREE.RingGeometry(5.9, 6.15, 48), ringMat)
    group.add(ring1, ring2, ring3)

    // 3. Geodesic Icosahedron Core
    const icoGeo = new THREE.IcosahedronGeometry(2.8, 2)
    const icoMat = new THREE.MeshBasicMaterial({
      color: 0xee7112,
      wireframe: true,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
    })
    const ico = new THREE.Mesh(icoGeo, icoMat)
    group.add(ico)

    // Animation Loop
    let reqId: number
    const clock = new THREE.Clock()

    const animate = () => {
      reqId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      particles.rotation.y = t * 1.2
      particles.rotation.x = t * 0.5

      ring1.rotation.x = t * 2.2
      ring1.rotation.y = t * 1.1
      ring2.rotation.y = -t * 2.6
      ring2.rotation.z = t * 1.3
      ring3.rotation.x = -t * 1.8
      ring3.rotation.z = -t * 2.0

      ico.rotation.x = -t * 0.9
      ico.rotation.y = t * 1.5

      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(reqId)
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [])

  if (!targetHref) return null

  return (
    <div className="fixed inset-0 z-[999999] pointer-events-none select-none flex items-center justify-center overflow-hidden">
      {/* 1. Fullscreen Holographic Cyber Tunnel Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center"
      >
        {/* Holographic Radar Concentric Waves */}
        <div className="absolute w-[600px] h-[600px] rounded-full border border-[#ee7112]/30 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]" />
        <div className="absolute w-[900px] h-[900px] rounded-full border border-amber-500/20 animate-[ping_4s_cubic-bezier(0,0,0.2,1)_infinite]" />
        <div className="absolute w-[1200px] h-[1200px] rounded-full border border-[#ee7112]/10" />

        {/* 3D Vertical Laser Beams & Speed Streaks */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(16)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: "-100%", opacity: 0 }}
              animate={{ y: "200%", opacity: [0, 1, 0] }}
              transition={{
                duration: 0.5 + (i % 4) * 0.1,
                repeat: Infinity,
                ease: "linear",
                delay: (i % 6) * 0.08,
              }}
              className="absolute w-[2px] h-64 bg-gradient-to-b from-transparent via-[#ee7112] to-amber-300 shadow-[0_0_20px_#ee7112]"
              style={{ left: `${4 + i * 6}%` }}
            />
          ))}
        </div>
      </motion.div>

      {/* 2. Central 3D J.A.R.V.I.S. Hologram Drone Core */}
      <motion.div
        initial={{ scale: 0.3, opacity: 0, y: -40 }}
        animate={{
          scale: isArrived ? 0.7 : 1,
          opacity: 1,
          y: isArrived ? 180 : 0,
        }}
        exit={{ scale: 0.2, opacity: 0 }}
        transition={{ type: "spring", stiffness: 140, damping: 18 }}
        className="relative z-20 flex flex-col items-center gap-4"
      >
        {/* 3D Canvas Box */}
        <div className="relative w-[320px] h-[320px] flex items-center justify-center">
          <div ref={canvasMountRef} className="w-[320px] h-[320px]" />

          {/* Laser Navigation Beam Downwards */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-1.5 h-80 bg-gradient-to-b from-[#ee7112] via-amber-400 to-transparent blur-[1px] shadow-[0_0_25px_#ee7112] animate-pulse" />

          {/* Rotating Telemetry Ring HUD */}
          <div className="absolute inset-4 rounded-full border border-dashed border-[#ee7112]/70 animate-[spin_6s_linear_infinite]" />
          <div className="absolute inset-10 rounded-full border border-dotted border-amber-400/50 animate-[spin_10s_linear_infinite_reverse]" />
        </div>

        {/* 3. J.A.R.V.I.S. Hologram Speech HUD */}
        <motion.div
          initial={{ opacity: 0, y: 15, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="p-4 rounded-2xl bg-black/95 border-2 border-[#ee7112] shadow-[0_0_50px_rgba(238,113,18,0.7)] backdrop-blur-xl max-w-[380px] text-center space-y-2"
        >
          <div className="flex items-center justify-between border-b border-amber-500/40 pb-1.5 text-[10px] font-mono text-amber-400 uppercase font-bold tracking-wider">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              J.A.R.V.I.S. // DIRECIONAMENTO
            </span>
            <span className="text-[#ee7112]">{targetTitle}</span>
          </div>

          <p className="text-sm font-sans font-medium text-white leading-relaxed">
            {speechText}
          </p>

          <div className="flex items-center justify-center gap-2 pt-1 text-[10px] font-mono text-amber-300">
            <span className="animate-pulse">▼ Conduzindo visão até a seção...</span>
          </div>
        </motion.div>
      </motion.div>

      {/* 4. Shockwave Pulse on Arrival */}
      {isArrived && (
        <motion.div
          initial={{ scale: 0.1, opacity: 1 }}
          animate={{ scale: 40, opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute w-24 h-24 rounded-full border-4 border-[#ee7112] bg-[#ee7112]/30 shadow-[0_0_80px_#ee7112] z-30"
        />
      )}
    </div>
  )
}
