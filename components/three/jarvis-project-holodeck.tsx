"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion"
import * as THREE from "three"
import {
  X,
  Sparkles,
  Layers,
  Cpu,
  Database,
  ExternalLink,
  Shield,
  Activity,
  Maximize2,
  Minimize2,
  Terminal,
  Zap,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export interface HoloProjectData {
  id: string
  title: string
  subtitle: string
  image: string
  tags: string[]
  metrics: { label: string; value: string; color?: string }[]
  architecture: string
  solution: string
  liveDemoHref?: string
}

export const HOLODECK_PROJECTS: Record<string, HoloProjectData> = {
  maker_lab: {
    id: "wms_3d",
    title: "DIGITAL TWIN WMS // 3D COMETA",
    subtitle: "Gêmeo Digital de Armazém Logístico com 11.200 Posições Reais",
    image: "/wms-estoque-real-1.png",
    tags: ["Three.js", "Next.js 16", "React 19", "FEFO Algorithm", "TypeScript", "Tailwind CSS v4"],
    metrics: [
      { label: "Capacidade Modelada", value: "11.200+ Posições", color: "text-amber-400" },
      { label: "Taxa de Atualização", value: "60 FPS ao Vivo", color: "text-sky-400" },
      { label: "Precisão de Rota", value: "Curva FEFO 100%", color: "text-emerald-400" },
    ],
    architecture: "Three.js WebGL + Shaders customizados para renderização de estantes porta-paletes, câmaras de frios e docas com mapa de calor térmico e telemetria tridimensional.",
    solution: "Eliminou perdas por vencimento e otimizou rotas de empilhadeiras em armazéns de alta rotação no Cometa Supermercados.",
    liveDemoHref: "#maker-lab",
  },
  projects: {
    id: "erp_inventario",
    title: "ERP INVENTÁRIO CORPORATIVO // FULL STACK",
    subtitle: "Sistema de Alta Concorrência para Auditoria e Gestão de Perdas",
    image: "/inventario_img_enhanced.png",
    tags: ["Next.js 16", "Fastify", "Prisma ORM", "PostgreSQL", "Docker", "TanStack Table"],
    metrics: [
      { label: "Latência de API", value: "28ms média", color: "text-sky-400" },
      { label: "Concorrência", value: "5.000+ Reqs/s", color: "text-amber-400" },
      { label: "Integridade de Dados", value: "100% ACID", color: "text-emerald-400" },
    ],
    architecture: "Backend resiliente em Node.js com Fastify e Prisma ORM para queries de altíssima velocidade em bancos PostgreSQL particionados.",
    solution: "Sincronização em tempo real de contagens cegas de estoque com prevenção ativa de divergências fiscais e operacionais.",
    liveDemoHref: "#projetos",
  },
}

interface Holo3DSceneProps {
  projectId: string
  cameraPreset?: string
}

function Holo3DLiveScene({ projectId }: Holo3DSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const isDraggingRef = useRef(false)
  const previousMousePositionRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (!mountRef.current) return
    const container = mountRef.current
    const width = container.clientWidth || 600
    const height = container.clientHeight || 340

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
    camera.position.set(0, 4, 9)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9)
    scene.add(ambientLight)

    const cyanLight = new THREE.PointLight(0x38bdf8, 4, 15)
    cyanLight.position.set(3, 5, 4)
    scene.add(cyanLight)

    const amberLight = new THREE.PointLight(0xf59e0b, 3, 15)
    amberLight.position.set(-3, -2, 4)
    scene.add(amberLight)

    // Grid Floor
    const gridHelper = new THREE.GridHelper(12, 24, 0x38bdf8, 0x1e293b)
    gridHelper.position.y = -1.2
    scene.add(gridHelper)

    // Holographic Base Ring
    const ringGeo = new THREE.RingGeometry(3.5, 3.7, 48)
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.4,
      wireframe: true,
    })
    const ring = new THREE.Mesh(ringGeo, ringMat)
    ring.rotation.x = Math.PI / 2
    ring.position.y = -1.19
    scene.add(ring)

    const rootGroup = new THREE.Group()
    scene.add(rootGroup)

    // Laser Sweep Beam
    const laserGeo = new THREE.PlaneGeometry(8, 0.05)
    const laserMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8,
    })
    const laser = new THREE.Mesh(laserGeo, laserMat)
    laser.rotation.x = Math.PI / 2
    rootGroup.add(laser)

    let animateCustom: (time: number) => void = () => {}

    if (projectId === "wms_3d") {
      // 3D WMS Warehouse Miniature with Multi-Tier Racks & Pallets
      const warehouseGroup = new THREE.Group()

      const rackMat = new THREE.MeshStandardMaterial({
        color: 0x0284c7,
        wireframe: true,
        emissive: 0x0369a1,
        emissiveIntensity: 0.3,
      })

      const palletColors = [0xf59e0b, 0x10b981, 0x38bdf8, 0xe11d48]

      // 4 Rows of 5 Racks
      for (let row = -2; row <= 2; row++) {
        if (row === 0) continue // Central aisle
        for (let col = -3; col <= 3; col++) {
          for (let level = 0; level < 3; level++) {
            const boxGeo = new THREE.BoxGeometry(0.5, 0.3, 0.5)
            const color = palletColors[(Math.abs(row * 3 + col + level)) % palletColors.length]
            const boxMat = new THREE.MeshStandardMaterial({
              color: color,
              emissive: color,
              emissiveIntensity: 0.4,
              wireframe: level === 2,
            })
            const box = new THREE.Mesh(boxGeo, boxMat)
            box.position.set(col * 0.7, level * 0.45 - 0.7, row * 0.9)
            warehouseGroup.add(box)
          }

          // Rack Frame Uprights
          const frameGeo = new THREE.BoxGeometry(0.55, 1.4, 0.55)
          const frame = new THREE.Mesh(frameGeo, rackMat)
          frame.position.set(col * 0.7, -0.25, row * 0.9)
          warehouseGroup.add(frame)
        }
      }

      // Miniature Trucks at Docks
      for (let t = -2; t <= 2; t++) {
        const truckGroup = new THREE.Group()
        const cabGeo = new THREE.BoxGeometry(0.35, 0.3, 0.3)
        const cabMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b })
        const cab = new THREE.Mesh(cabGeo, cabMat)
        cab.position.set(0, -0.95, -2.2)

        const trailerGeo = new THREE.BoxGeometry(0.35, 0.4, 0.7)
        const trailerMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0 })
        const trailer = new THREE.Mesh(trailerGeo, trailerMat)
        trailer.position.set(0, -0.9, -1.6)

        truckGroup.add(cab, trailer)
        truckGroup.position.x = t * 1.1
        warehouseGroup.add(truckGroup)
      }

      rootGroup.add(warehouseGroup)

      animateCustom = (time) => {
        warehouseGroup.rotation.y = time * 0.25
        laser.position.z = Math.sin(time * 2) * 2.5
        laser.position.y = -0.3 + Math.sin(time * 4) * 0.4
      }
    } else {
      // 3D Cloud Data Center & Server Matrix (ERP & Microservices)
      const serverGroup = new THREE.Group()

      // 4 Futuristic Server Blades Towers
      for (let s = -2; s <= 2; s++) {
        if (s === 0) continue
        const towerGeo = new THREE.BoxGeometry(0.6, 2.0, 0.6)
        const towerMat = new THREE.MeshStandardMaterial({
          color: 0x0f172a,
          emissive: 0x0284c7,
          emissiveIntensity: 0.2,
          wireframe: true,
        })
        const tower = new THREE.Mesh(towerGeo, towerMat)
        tower.position.set(s * 1.0, -0.2, 0)
        serverGroup.add(tower)

        // Blinking LED Activity Modules
        for (let l = 0; l < 5; l++) {
          const ledGeo = new THREE.BoxGeometry(0.5, 0.08, 0.55)
          const ledColor = l % 2 === 0 ? 0x10b981 : 0xf59e0b
          const ledMat = new THREE.MeshStandardMaterial({
            color: ledColor,
            emissive: ledColor,
            emissiveIntensity: 0.7,
          })
          const led = new THREE.Mesh(ledGeo, ledMat)
          led.position.set(s * 1.0, l * 0.35 - 0.9, 0)
          serverGroup.add(led)
        }
      }

      // Central Floating Quantum Core (Database / API)
      const coreGeo = new THREE.IcosahedronGeometry(0.6, 1)
      const coreMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x0284c7,
        emissiveIntensity: 0.8,
        wireframe: true,
      })
      const core = new THREE.Mesh(coreGeo, coreMat)
      core.position.set(0, 0, 0)
      serverGroup.add(core)

      // Orbiting Data Stream Particles
      const streamCount = 120
      const streamGeo = new THREE.BufferGeometry()
      const streamPos = new Float32Array(streamCount * 3)
      for (let p = 0; p < streamCount * 3; p += 3) {
        const radius = 1.2 + Math.random() * 1.5
        const angle = Math.random() * Math.PI * 2
        streamPos[p] = Math.cos(angle) * radius
        streamPos[p + 1] = (Math.random() - 0.5) * 1.8
        streamPos[p + 2] = Math.sin(angle) * radius
      }
      streamGeo.setAttribute("position", new THREE.BufferAttribute(streamPos, 3))
      const streamMat = new THREE.PointsMaterial({
        color: 0x38bdf8,
        size: 0.05,
        transparent: true,
        opacity: 0.8,
      })
      const streamPoints = new THREE.Points(streamGeo, streamMat)
      serverGroup.add(streamPoints)

      rootGroup.add(serverGroup)

      animateCustom = (time) => {
        serverGroup.rotation.y = time * 0.3
        core.rotation.x = time * 1.2
        core.rotation.y = time * 1.5
        streamPoints.rotation.y = -time * 0.8
        const pulse = 1 + Math.sin(time * 5) * 0.15
        core.scale.set(pulse, pulse, pulse)
      }
    }

    // Mouse Drag Rotation
    const onMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY }
    }
    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return
      const deltaX = e.clientX - previousMousePositionRef.current.x
      const deltaY = e.clientY - previousMousePositionRef.current.y
      rootGroup.rotation.y += deltaX * 0.01
      rootGroup.rotation.x += deltaY * 0.01
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY }
    }
    const onMouseUp = () => {
      isDraggingRef.current = false
    }

    container.addEventListener("mousedown", onMouseDown)
    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseup", onMouseUp)

    let animId: number
    const clock = new THREE.Clock()

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const time = clock.getElapsedTime()
      if (!isDraggingRef.current) {
        rootGroup.position.y = Math.sin(time * 1.5) * 0.05
        ring.rotation.z = time * 0.3
      }
      animateCustom(time)
      renderer.render(scene, camera)
    }

    animate()

    const handleResize = () => {
      if (!container) return
      const w = container.clientWidth || 600
      const h = container.clientHeight || 340
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }

    window.addEventListener("resize", handleResize)

    return () => {
      cancelAnimationFrame(animId)
      container.removeEventListener("mousedown", onMouseDown)
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup", onMouseUp)
      window.removeEventListener("resize", handleResize)
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [projectId])

  return (
    <div
      ref={mountRef}
      className="relative w-full h-[260px] sm:h-[340px] rounded-2xl overflow-hidden bg-black/90 border border-sky-400/50 shadow-2xl cursor-grab active:cursor-grabbing select-none"
    >
      {/* 3D Viewport Controls & HUD Overlays */}
      <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        <span className="text-[10px] font-mono text-sky-300 font-bold bg-black/80 px-2 py-0.5 rounded-lg border border-sky-400/40 backdrop-blur-md">
          THREE.JS 3D LIVE • 60 FPS
        </span>
      </div>

      <div className="absolute top-2.5 right-2.5 z-10 text-[9px] font-mono text-muted-foreground bg-black/80 px-2 py-0.5 rounded-lg border border-white/10 pointer-events-none">
        🖱️ Arraste para girar 3D
      </div>

      {/* Floating 3D Callout Tags */}
      {projectId === "wms_3d" ? (
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-3">
          <div className="flex justify-between items-start mt-8">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ repeat: Infinity, repeatType: "reverse", duration: 2 }}
              className="text-[9px] font-mono text-emerald-300 bg-emerald-950/80 border border-emerald-500/50 px-2 py-1 rounded-md shadow-[0_0_10px_rgba(16,185,129,0.3)] backdrop-blur-sm"
            >
              📍 CÂMARA DE FRIOS (-18°C)
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ repeat: Infinity, repeatType: "reverse", duration: 2.3, delay: 0.5 }}
              className="text-[9px] font-mono text-amber-300 bg-amber-950/80 border border-amber-500/50 px-2 py-1 rounded-md shadow-[0_0_10px_rgba(245,158,11,0.3)] backdrop-blur-sm"
            >
              ⚡ CURVA FEFO (ALGORITMO)
            </motion.div>
          </div>

          <div className="flex justify-center mb-2">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ repeat: Infinity, repeatType: "reverse", duration: 2.5, delay: 1 }}
              className="text-[9px] font-mono text-sky-300 bg-sky-950/80 border border-sky-500/50 px-2.5 py-1 rounded-md shadow-[0_0_10px_rgba(56,189,248,0.3)] backdrop-blur-sm"
            >
              🚛 12 DOCAS DE EXPEDIÇÃO & RECEBIMENTO
            </motion.div>
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-3">
          <div className="flex justify-between items-start mt-8">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ repeat: Infinity, repeatType: "reverse", duration: 2 }}
              className="text-[9px] font-mono text-sky-300 bg-sky-950/80 border border-sky-500/50 px-2 py-1 rounded-md shadow-[0_0_10px_rgba(56,189,248,0.3)] backdrop-blur-sm"
            >
              ⚡ FASTIFY ENGINE (28ms)
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ repeat: Infinity, repeatType: "reverse", duration: 2.3, delay: 0.5 }}
              className="text-[9px] font-mono text-amber-300 bg-amber-950/80 border border-amber-500/50 px-2 py-1 rounded-md shadow-[0_0_10px_rgba(245,158,11,0.3)] backdrop-blur-sm"
            >
              🛡️ PRISMA ORM (5K REQS/S)
            </motion.div>
          </div>

          <div className="flex justify-center mb-2">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ repeat: Infinity, repeatType: "reverse", duration: 2.5, delay: 1 }}
              className="text-[9px] font-mono text-emerald-300 bg-emerald-950/80 border border-emerald-500/50 px-2.5 py-1 rounded-md shadow-[0_0_10px_rgba(16,185,129,0.3)] backdrop-blur-sm"
            >
              🗄️ POSTGRESQL CLUSTER (100% ACID)
            </motion.div>
          </div>
        </div>
      )}
    </div>
  )
}

export function JarvisProjectHolodeck() {
  const [activeProject, setActiveProject] = useState<HoloProjectData | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [viewMode, setViewMode] = useState<"visual" | "xray">("visual")

  // 3D Tilt Effect Values
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 })
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 })
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"])

  // Listen to Holodeck Trigger Events from Tour or Manual Action
  useEffect(() => {
    const handleOpen = (e: any) => {
      const stepId = e.detail?.stepId || e.detail?.id
      if (stepId && HOLODECK_PROJECTS[stepId]) {
        setActiveProject(HOLODECK_PROJECTS[stepId])
      } else if (e.detail?.project) {
        setActiveProject(e.detail.project)
      }
    }

    const handleClose = () => {
      setActiveProject(null)
    }

    window.addEventListener("open-holodeck-project", handleOpen)
    window.addEventListener("close-holodeck-project", handleClose)
    return () => {
      window.removeEventListener("open-holodeck-project", handleOpen)
      window.removeEventListener("close-holodeck-project", handleClose)
    }
  }, [])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5
    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  if (!activeProject) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9998] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl pointer-events-auto"
        onClick={() => setActiveProject(null)}
      >
        {/* Hologram Projection Laser Emitters (Top & Bottom) */}
        <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-sky-500/20 via-sky-500/5 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-amber-500/25 via-amber-500/5 to-transparent pointer-events-none" />

        {/* 3D Holo-Deck Main Card Container */}
        <motion.div
          initial={{ scale: 0.85, y: 40, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.85, y: 40, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 260 }}
          style={{
            rotateX: rotateX,
            rotateY: rotateY,
            transformStyle: "preserve-3d",
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={(e) => e.stopPropagation()}
          className={`relative w-full ${
            isExpanded ? "max-w-5xl" : "max-w-3xl"
          } rounded-3xl bg-gray-950/98 border-2 border-sky-400/70 shadow-[0_0_90px_rgba(56,189,248,0.4),0_0_30px_rgba(245,158,11,0.25)] overflow-hidden transition-all duration-300`}
        >
          {/* Holographic Scanline Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-sky-400/10 via-transparent to-amber-500/10 pointer-events-none" />

          {/* Top Header Bar */}
          <div className="relative z-10 flex items-center justify-between p-3 sm:p-4 border-b border-sky-500/30 bg-black/70 font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-ping" />
              <span className="font-extrabold text-sky-400 tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>HOLO-DECK // PROJEÇÃO 3D AO VIVO</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode(viewMode === "visual" ? "xray" : "visual")}
                className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  viewMode === "xray"
                    ? "bg-amber-500 text-black border-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.4)]"
                    : "bg-sky-500/15 border-sky-400/40 text-sky-300 hover:bg-sky-500/25"
                }`}
              >
                <Layers className="w-3 h-3" />
                <span>{viewMode === "xray" ? "⚡ Raio-X Ativo" : "🔍 Raio-X Arquitetura"}</span>
              </button>

              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 rounded-lg border border-white/10 text-muted-foreground hover:text-white transition-colors cursor-pointer"
                title={isExpanded ? "Reduzir" : "Expandir"}
              >
                {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={() => setActiveProject(null)}
                className="p-1.5 rounded-lg border border-white/20 text-muted-foreground hover:text-red-400 hover:border-red-500/50 transition-colors cursor-pointer ml-1"
                title="Fechar Holograma"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Hologram Body */}
          <div className="relative z-10 p-4 sm:p-5 space-y-3.5 max-h-[78vh] overflow-y-auto font-mono">
            {/* Title & Subtitle */}
            <div>
              <div className="text-[10px] text-amber-400 font-bold uppercase tracking-widest flex items-center gap-1.5 mb-1">
                <Activity className="w-3 h-3 animate-pulse" />
                <span>SISTEMA 3D EM PRODUÇÃO AUDITADO POR J.A.R.V.I.S.</span>
              </div>
              <h3 className="text-base sm:text-xl font-extrabold text-white tracking-wide">
                {activeProject.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                {activeProject.subtitle}
              </p>
            </div>

            {/* LIVE 3D WEBGL SCENE (Replaces static image with animated 3D) */}
            {viewMode === "visual" ? (
              <Holo3DLiveScene projectId={activeProject.id} />
            ) : (
              /* X-Ray Architecture Breakdown View */
              <div className="p-4 rounded-2xl bg-black/90 border border-amber-500/40 space-y-3 shadow-inner">
                <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5 pb-2 border-b border-amber-500/20">
                  <Terminal className="w-4 h-4 text-amber-400" />
                  <span>DIAGNÓSTICO ARQUITETURAL // DESAFIO & SOLUÇÃO</span>
                </div>
                <div className="text-xs text-slate-200 leading-relaxed">
                  <p className="font-semibold text-sky-300 mb-1">⚙️ Arquitetura Técnica:</p>
                  <p className="text-slate-300 bg-gray-900/80 p-2.5 rounded-xl border border-white/5">{activeProject.architecture}</p>
                </div>
                <div className="text-xs text-slate-200 leading-relaxed">
                  <p className="font-semibold text-emerald-400 mb-1">🎯 Solução de Engenharia:</p>
                  <p className="text-slate-300 bg-gray-900/80 p-2.5 rounded-xl border border-white/5">{activeProject.solution}</p>
                </div>
              </div>
            )}

            {/* Live Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {activeProject.metrics.map((metric, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-black/60 border border-white/10 flex flex-col justify-between"
                >
                  <span className="text-[10px] text-muted-foreground">{metric.label}</span>
                  <span className={`text-sm sm:text-base font-extrabold ${metric.color || "text-white"} mt-0.5`}>
                    {metric.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Tech Stack Tags */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {activeProject.tags.map((tag, idx) => (
                <Badge
                  key={idx}
                  variant="outline"
                  className="px-2 py-0.5 text-[10px] bg-sky-500/10 border-sky-400/40 text-sky-300 rounded-lg"
                >
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 flex items-center justify-between gap-3 border-t border-white/10">
              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-400" />
                <span>Renderização 3D WebGL ativa</span>
              </span>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={() => setActiveProject(null)}
                  className="h-8 px-4 bg-sky-500 hover:bg-sky-400 text-black font-bold text-xs rounded-xl shadow-lg shadow-sky-500/20 cursor-pointer"
                >
                  <span>Continuar Tour</span>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
