"use client"

import { useState, useEffect, useRef, useCallback } from "react"
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
  Volume2,
  VolumeX,
  RotateCw,
  Printer,
  Download,
  Play,
  Pause,
  RefreshCw,
  Eye,
  Sliders,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  HoloProjectData,
  HOLODECK_REGISTRY,
  getHolodeckProject,
  exportMeshesToSTL,
} from "@/lib/holodeck-data"
import { buildArchetypeScene, ArchetypeSceneResult } from "@/components/three/holodeck-archetypes"

interface Holo3DSceneProps {
  project: HoloProjectData
  explosionProgress: number
  isSlicerMode: boolean
  sliceProgress: number
  onSceneReady?: (result: ArchetypeSceneResult) => void
  onToggleRealImage?: () => void
}

function Holo3DLiveScene({
  project,
  explosionProgress,
  isSlicerMode,
  sliceProgress,
  onSceneReady,
  onToggleRealImage,
}: Holo3DSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const isDraggingRef = useRef(false)
  const previousPointerPosRef = useRef({ x: 0, y: 0 })
  const sceneResultRef = useRef<ArchetypeSceneResult | null>(null)
  const rootGroupRef = useRef<THREE.Group | null>(null)

  // Track zoom distance and focus states
  const cameraDistanceRef = useRef(5.8)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const [isZoomFocused, setIsZoomFocused] = useState(false)
  const isZoomFocusedRef = useRef(false)
  const [isPaused, setIsPaused] = useState(false)
  const isPausedRef = useRef(false)

  useEffect(() => {
    isZoomFocusedRef.current = isZoomFocused
  }, [isZoomFocused])

  useEffect(() => {
    isPausedRef.current = isPaused
  }, [isPaused])

  // Keep animated props in refs for smooth requestAnimationFrame
  const explosionRef = useRef(explosionProgress)
  const isSlicerRef = useRef(isSlicerMode)
  const sliceProgRef = useRef(sliceProgress)

  useEffect(() => {
    explosionRef.current = explosionProgress
  }, [explosionProgress])

  useEffect(() => {
    isSlicerRef.current = isSlicerMode
  }, [isSlicerMode])

  useEffect(() => {
    sliceProgRef.current = sliceProgress
  }, [sliceProgress])

  useEffect(() => {
    if (!mountRef.current) return
    const container = mountRef.current
    const width = container.clientWidth || 700
    const height = container.clientHeight || 380

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
    camera.position.set(0, 1.35, cameraDistanceRef.current)
    camera.lookAt(0, 0.95, 0)
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2.5))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    container.appendChild(renderer.domElement)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9)
    scene.add(ambientLight)

    const cyanLight = new THREE.PointLight(0x38bdf8, 5, 20)
    cyanLight.position.set(4, 6, 4)
    scene.add(cyanLight)

    const amberLight = new THREE.PointLight(0xf59e0b, 4, 20)
    amberLight.position.set(-4, -3, 4)
    scene.add(amberLight)

    const accentLight = new THREE.PointLight(0x10b981, 3, 15)
    accentLight.position.set(0, 4, -4)
    scene.add(accentLight)

    // Holographic Grid Floor
    const gridHelper = new THREE.GridHelper(14, 28, 0x38bdf8, 0x1e293b)
    gridHelper.position.y = -1.6
    scene.add(gridHelper)

    // Outer Hologram Emitter Ring
    const ringGeo = new THREE.RingGeometry(3.6, 3.8, 64)
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.45,
      wireframe: true,
    })
    const emitterRing = new THREE.Mesh(ringGeo, ringMat)
    emitterRing.rotation.x = Math.PI / 2
    emitterRing.position.y = -1.59
    scene.add(emitterRing)

    // Build Archetype 3D Scene with REAL project screenshot texture
    const sceneResult = buildArchetypeScene(project.archetype, project.image)
    sceneResultRef.current = sceneResult
    rootGroupRef.current = sceneResult.rootGroup
    scene.add(sceneResult.rootGroup)

    if (onSceneReady) {
      onSceneReady(sceneResult)
    }

    // Pointer Interaction (Mouse & Touch Orbit)
    let touchStartDist = 0

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDraggingRef.current = true
      if ("touches" in e) {
        if (e.touches.length === 1) {
          previousPointerPosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
        } else if (e.touches.length === 2) {
          const dx = e.touches[0].clientX - e.touches[1].clientX
          const dy = e.touches[0].clientY - e.touches[1].clientY
          touchStartDist = Math.sqrt(dx * dx + dy * dy)
        }
      } else {
        previousPointerPosRef.current = { x: e.clientX, y: e.clientY }
      }
    }

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDraggingRef.current || !rootGroupRef.current) return
      if ("touches" in e) {
        if (e.touches.length === 1) {
          const deltaX = e.touches[0].clientX - previousPointerPosRef.current.x
          const deltaY = e.touches[0].clientY - previousPointerPosRef.current.y
          rootGroupRef.current.rotation.y += deltaX * 0.008
          rootGroupRef.current.rotation.x += deltaY * 0.008
          previousPointerPosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
        } else if (e.touches.length === 2 && cameraRef.current) {
          const dx = e.touches[0].clientX - e.touches[1].clientX
          const dy = e.touches[0].clientY - e.touches[1].clientY
          const dist = Math.sqrt(dx * dx + dy * dy)
          const factor = touchStartDist / dist
          cameraDistanceRef.current = THREE.MathUtils.clamp(cameraDistanceRef.current * factor, 4, 14)
          cameraRef.current.position.setLength(cameraDistanceRef.current)
          touchStartDist = dist
        }
      } else {
        const deltaX = e.clientX - previousPointerPosRef.current.x
        const deltaY = e.clientY - previousPointerPosRef.current.y
        rootGroupRef.current.rotation.y += deltaX * 0.008
        rootGroupRef.current.rotation.x += deltaY * 0.008
        previousPointerPosRef.current = { x: e.clientX, y: e.clientY }
      }
    }

    const onPointerUp = () => {
      isDraggingRef.current = false
    }

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      if (!cameraRef.current) return
      cameraDistanceRef.current = THREE.MathUtils.clamp(
        cameraDistanceRef.current + e.deltaY * 0.006,
        4.5,
        13.5
      )
      cameraRef.current.position.setLength(cameraDistanceRef.current)
    }

    container.addEventListener("mousedown", onPointerDown)
    window.addEventListener("mousemove", onPointerMove)
    window.addEventListener("mouseup", onPointerUp)

    container.addEventListener("touchstart", onPointerDown, { passive: true })
    window.addEventListener("touchmove", onPointerMove, { passive: true })
    window.addEventListener("touchend", onPointerUp)
    container.addEventListener("wheel", onWheel, { passive: false })

    // Animation Loop
    let animId: number
    const clock = new THREE.Clock()

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const time = clock.getElapsedTime()

      if (rootGroupRef.current && !isDraggingRef.current) {
        if (!isPausedRef.current) {
          rootGroupRef.current.rotation.y += 0.0012
        }
        rootGroupRef.current.position.y = Math.sin(time * 1.5) * 0.03
        emitterRing.rotation.z = time * 0.15
      }

      // Smooth camera interpolation for Focus Zoom
      const targetDist = isZoomFocusedRef.current ? 3.8 : cameraDistanceRef.current
      camera.position.z += (targetDist - camera.position.z) * 0.08
      const targetCamY = isZoomFocusedRef.current ? 1.45 : 1.35
      camera.position.y += (targetCamY - camera.position.y) * 0.08
      const targetLookY = isZoomFocusedRef.current ? 1.45 : 0.95
      camera.lookAt(0, targetLookY, 0)

      sceneResult.animate(time, explosionRef.current, isSlicerRef.current, sliceProgRef.current)
      renderer.render(scene, camera)
    }

    animate()

    const handleResize = () => {
      if (!container) return
      const w = container.clientWidth || 700
      const h = container.clientHeight || 380
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }

    window.addEventListener("resize", handleResize)

    return () => {
      cancelAnimationFrame(animId)
      container.removeEventListener("mousedown", onPointerDown)
      window.removeEventListener("mousemove", onPointerMove)
      window.removeEventListener("mouseup", onPointerUp)
      container.removeEventListener("touchstart", onPointerDown)
      window.removeEventListener("touchmove", onPointerMove)
      window.removeEventListener("touchend", onPointerUp)
      container.removeEventListener("wheel", onWheel)
      window.removeEventListener("resize", handleResize)

      sceneResult.dispose()
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [project.id, project.archetype, project.image])

  return (
    <div
      ref={mountRef}
      className="relative w-full h-[320px] sm:h-[420px] md:h-[470px] rounded-2xl overflow-hidden bg-black/95 border border-sky-400/50 shadow-[0_0_50px_rgba(56,189,248,0.2)] cursor-grab active:cursor-grabbing select-none"
    >
      {/* 3D Viewport HUD Overlays */}
      <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-2 pointer-events-none">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
        <span className="text-[10px] font-mono text-sky-300 font-bold bg-black/85 px-2.5 py-1 rounded-lg border border-sky-400/40 backdrop-blur-md">
          {isSlicerMode ? "🖨️ FATIAMENTO 3D (0.20mm)" : "🎮 EXPLODED 3D LIVE • 60 FPS"}
        </span>
      </div>

      <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1.5 pointer-events-auto">
        {/* Toggle Zoom Focus */}
        <button
          onClick={() => setIsZoomFocused(!isZoomFocused)}
          className={`flex items-center gap-1 text-[9px] font-mono font-bold px-2.5 py-1 rounded-lg border cursor-pointer transition-all shadow-md ${
            isZoomFocused
              ? "bg-sky-500 text-black border-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.5)]"
              : "text-sky-300 bg-black/80 hover:bg-sky-500/20 border-sky-500/30"
          }`}
          title={isZoomFocused ? "Voltar ao ângulo geral" : "Aproximar zoom para ler todas as frases e números"}
        >
          <Maximize2 className="w-3 h-3" />
          <span>{isZoomFocused ? "Zoom 100%" : "🔍 Foco na Tela"}</span>
        </button>

        {/* Pause Rotation */}
        <button
          onClick={() => setIsPaused(!isPaused)}
          className={`flex items-center gap-1 text-[9px] font-mono font-bold px-2 py-1 rounded-lg border cursor-pointer transition-all ${
            isPaused
              ? "bg-amber-500 text-black border-amber-400"
              : "text-slate-300 bg-black/80 hover:text-white border-white/10"
          }`}
          title={isPaused ? "Retomar rotação automática" : "Pausar rotação para leitura"}
        >
          {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
        </button>

        {/* Switch to native HD */}
        {onToggleRealImage && (
          <button
            onClick={onToggleRealImage}
            className="flex items-center gap-1 text-[9px] font-mono font-bold text-amber-300 bg-amber-500/20 hover:bg-amber-500 hover:text-black px-2.5 py-1 rounded-lg border border-amber-500/40 cursor-pointer transition-all shadow-md"
            title="Ver captura real da aplicação em 100% de nitidez nativa"
          >
            <Eye className="w-3 h-3" />
            <span>Foto Real HD</span>
          </button>
        )}
      </div>

      {/* Dynamic Layer Indicators */}
      {!isSlicerMode && (
        <div className="absolute bottom-2.5 inset-x-2.5 z-10 pointer-events-none flex items-center justify-between gap-1 overflow-x-auto">
          {project.layers.map((layer, i) => (
            <div
              key={i}
              className="text-[9px] font-mono px-2 py-1 rounded-md bg-black/80 border border-white/15 backdrop-blur-md flex items-center gap-1.5 shrink-0"
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: layer.color }} />
              <span className="text-white font-semibold">L{i + 1}: {layer.name}</span>
            </div>
          ))}
        </div>
      )}

      {/* Slicer Indicator */}
      {isSlicerMode && (
        <div className="absolute bottom-2.5 inset-x-2.5 z-10 pointer-events-none flex items-center justify-between p-2 rounded-lg bg-black/85 border border-amber-500/40 font-mono text-[10px] text-amber-300">
          <span>Camada: {Math.round((sliceProgress / 100) * 350)} / 350 (0.2mm)</span>
          <span>Bocal: 0.4mm E3D</span>
          <span>Filamento: {project.printSpecs.filamentWeight}</span>
        </div>
      )}
    </div>
  )
}

export function JarvisProjectHolodeck() {
  const [activeProject, setActiveProject] = useState<HoloProjectData | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [displayMode, setDisplayMode] = useState<"3d" | "real_image">("3d")
  const [isImageLightboxOpen, setIsImageLightboxOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"architecture" | "slicer">("architecture")
  const [explosionProgress, setExplosionProgress] = useState(35)
  const [sliceProgress, setSliceProgress] = useState(50)
  const [selectedLayerIndex, setSelectedLayerIndex] = useState<number | null>(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadSuccess, setDownloadSuccess] = useState(false)

  // Voice Narration State
  const [isVoicePlaying, setIsVoicePlaying] = useState(false)
  const [isVoiceMuted, setIsVoiceMuted] = useState(false)
  const [isVoiceLoading, setIsVoiceLoading] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const sceneResultRef = useRef<ArchetypeSceneResult | null>(null)

  // Load saved voice preference
  useEffect(() => {
    if (typeof window === "undefined") return
    const saved = localStorage.getItem("jarvis_voice_enabled")
    if (saved !== null) {
      setIsVoiceMuted(saved === "false")
    }
  }, [])

  // Listen to open/close events
  useEffect(() => {
    const handleOpen = (e: any) => {
      const stepId = e.detail?.stepId || e.detail?.id || e.detail?.projectId
      let foundProj: HoloProjectData

      if (e.detail?.project) {
        foundProj = getHolodeckProject(e.detail.project.id || e.detail.project.title, e.detail.project)
      } else if (stepId) {
        foundProj = getHolodeckProject(stepId)
      } else {
        foundProj = HOLODECK_REGISTRY.erp
      }

      setActiveProject(foundProj)
      setDisplayMode("3d")
      setIsImageLightboxOpen(false)
      setExplosionProgress(35)
      setActiveTab("architecture")
      setSelectedLayerIndex(null)
    }

    const handleClose = () => {
      setActiveProject(null)
      setIsImageLightboxOpen(false)
      stopVoice()
    }

    window.addEventListener("open-holodeck-project", handleOpen)
    window.addEventListener("close-holodeck-project", handleClose)
    return () => {
      window.removeEventListener("open-holodeck-project", handleOpen)
      window.removeEventListener("close-holodeck-project", handleClose)
    }
  }, [])

  // Listen to Escape key to close image lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isImageLightboxOpen) {
          setIsImageLightboxOpen(false)
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isImageLightboxOpen])

  // Stop voice helper
  const stopVoice = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current = null
    }
    setIsVoicePlaying(false)
    setIsVoiceLoading(false)
  }, [])

  // Play voice narration for the active project
  const playNarration = useCallback(async (project: HoloProjectData) => {
    stopVoice()
    if (isVoiceMuted || !project.ttsBriefing) return

    setIsVoiceLoading(true)
    try {
      const res = await fetch("/api/jarvis/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: project.ttsBriefing }),
      })

      if (!res.ok) throw new Error("TTS request failed")
      const blob = await res.blob()
      const audioUrl = URL.createObjectURL(blob)
      const audio = new Audio(audioUrl)
      audioRef.current = audio

      audio.onplay = () => {
        setIsVoiceLoading(false)
        setIsVoicePlaying(true)
      }
      audio.onended = () => {
        setIsVoicePlaying(false)
      }
      audio.onerror = () => {
        setIsVoiceLoading(false)
        setIsVoicePlaying(false)
      }

      await audio.play()
    } catch (err) {
      console.warn("Failed to play Jarvis narration:", err)
      setIsVoiceLoading(false)
      setIsVoicePlaying(false)
    }
  }, [isVoiceMuted, stopVoice])

  // Trigger speech when active project opens
  useEffect(() => {
    if (activeProject && !isVoiceMuted) {
      const timer = setTimeout(() => {
        playNarration(activeProject)
      }, 500)
      return () => clearTimeout(timer)
    } else {
      stopVoice()
    }
  }, [activeProject, isVoiceMuted, playNarration, stopVoice])

  // Toggle voice mute
  const toggleMute = () => {
    const nextMuted = !isVoiceMuted
    setIsVoiceMuted(nextMuted)
    if (typeof window !== "undefined") {
      localStorage.setItem("jarvis_voice_enabled", String(!nextMuted))
    }
    if (nextMuted) {
      stopVoice()
    } else if (activeProject) {
      playNarration(activeProject)
    }
  }

  // Handle STL Download
  const handleDownloadSTL = () => {
    if (!sceneResultRef.current || !activeProject) return
    setIsDownloading(true)

    try {
      const blob = exportMeshesToSTL(sceneResultRef.current.rootGroup, activeProject.id)
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${activeProject.id}_maker_model.stl`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setDownloadSuccess(true)
      setTimeout(() => setDownloadSuccess(false), 3500)
    } catch (err) {
      console.error("Error exporting STL:", err)
    } finally {
      setIsDownloading(false)
    }
  }

  if (!activeProject) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9998] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-xl pointer-events-auto"
        onClick={() => {
          setActiveProject(null)
          stopVoice()
        }}
      >
        {/* Hologram Projection Laser Emitters (Top & Bottom Glows) */}
        <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-sky-500/20 via-sky-500/5 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-amber-500/25 via-amber-500/5 to-transparent pointer-events-none" />

        {/* Main Solid Crisp Card Container (No 3D tilt blurring) */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
          className={`relative w-full ${
            isExpanded ? "max-w-6xl" : "max-w-4xl"
          } rounded-3xl bg-gray-950 border-2 border-sky-400/60 shadow-[0_0_90px_rgba(56,189,248,0.35),0_0_30px_rgba(245,158,11,0.2)] overflow-hidden transition-all duration-300 font-mono`}
        >

          {/* Top Header Bar */}
          <div className="relative z-10 flex flex-wrap items-center justify-between p-3 sm:p-4 border-b border-sky-500/30 bg-black/75 text-xs gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-ping" />
              <span className="font-extrabold text-sky-400 tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>HOLODECK 3D // SHOWROOM INTERATIVO</span>
              </span>
            </div>

            {/* Top Toolbar Actions */}
            <div className="flex items-center gap-2">
              {/* Voice Narration Button */}
              <button
                onClick={toggleMute}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-bold transition-all cursor-pointer ${
                  !isVoiceMuted
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                    : "bg-gray-900 text-muted-foreground border-white/10 hover:text-white"
                }`}
                title={isVoiceMuted ? "Ativar Narração do Jarvis" : "Silenciar Narração"}
              >
                {!isVoiceMuted ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">
                  {isVoiceLoading ? "Sintetizando..." : isVoicePlaying ? "Jarvis Falando" : isVoiceMuted ? "Voz Mudo" : "Voz Ativa"}
                </span>
              </button>

              {/* Expand / Minimize */}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 rounded-lg border border-white/10 text-muted-foreground hover:text-white transition-colors cursor-pointer"
                title={isExpanded ? "Reduzir Janela" : "Expandir Tela"}
              >
                {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>

              {/* Close Button */}
              <button
                onClick={() => {
                  setActiveProject(null)
                  stopVoice()
                }}
                className="p-1.5 rounded-lg border border-white/20 text-muted-foreground hover:text-red-400 hover:border-red-500/50 transition-colors cursor-pointer ml-1"
                title="Fechar Holodeck"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Top Pinned Sub-Header Bar (Title + Switcher always visible!) */}
          <div className="relative z-10 px-4 sm:px-6 py-3 border-b border-sky-500/20 bg-black/90 backdrop-blur-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shrink-0">
            <div>
              <div className="text-[10px] text-amber-400 font-bold uppercase tracking-widest flex items-center gap-1.5 mb-0.5">
                <Activity className="w-3 h-3 animate-pulse text-amber-400" />
                <span>MODELO HOLOGRÁFICO PARAMÉTRICO // PROJETO EM PRODUÇÃO</span>
              </div>
              <h3 className="text-sm sm:text-lg font-extrabold text-white tracking-wide truncate max-w-[500px]">
                {activeProject.title}
              </h3>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex items-center gap-1.5 bg-black/80 p-1 rounded-xl border border-sky-400/40 shrink-0">
              <button
                onClick={() => setDisplayMode("3d")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  displayMode === "3d"
                    ? "bg-sky-500 text-black shadow-lg shadow-sky-500/30"
                    : "text-muted-foreground hover:text-white"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>🎮 Holograma 3D</span>
              </button>
              <button
                onClick={() => setDisplayMode("real_image")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  displayMode === "real_image"
                    ? "bg-amber-500 text-black shadow-lg shadow-amber-500/30"
                    : "text-muted-foreground hover:text-white"
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>📸 Captura Real HD</span>
              </button>
            </div>
          </div>

          {/* Hologram Body Content */}
          <div className="relative z-10 p-4 sm:p-5 space-y-4 max-h-[75vh] overflow-y-auto">
            {/* Quick 3D Sub-controls when in 3D Mode */}
            {displayMode === "3d" && (
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs text-slate-300">
                  {activeProject.subtitle}
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setActiveTab("architecture")}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                      activeTab === "architecture"
                        ? "bg-sky-500/20 text-sky-300 border border-sky-400/50"
                        : "text-muted-foreground hover:text-white"
                    }`}
                  >
                    <Layers className="w-3 h-3" />
                    <span>Exploded</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("slicer")}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                      activeTab === "slicer"
                        ? "bg-amber-500/20 text-amber-300 border border-amber-400/50"
                        : "text-muted-foreground hover:text-white"
                    }`}
                  >
                    <Printer className="w-3 h-3" />
                    <span>Slicer 3D</span>
                  </button>
                </div>
              </div>
            )}

            {/* LIVE 3D WEBGL CANVAS OR HIGH-RES REAL PRODUCTION IMAGE */}
            {displayMode === "3d" ? (
              <Holo3DLiveScene
                project={activeProject}
                explosionProgress={activeTab === "architecture" ? explosionProgress : 0}
                isSlicerMode={activeTab === "slicer"}
                sliceProgress={sliceProgress}
                onToggleRealImage={() => setDisplayMode("real_image")}
                onSceneReady={(res) => {
                  sceneResultRef.current = res
                }}
              />
            ) : (
              /* Real High-Resolution Production Screenshot Showcase */
              <div className="relative w-full h-[340px] sm:h-[440px] md:h-[490px] rounded-2xl overflow-hidden bg-black/95 border-2 border-amber-500/50 shadow-[0_0_60px_rgba(245,158,11,0.25)] flex flex-col group select-none">
                <div 
                  className="flex-1 relative overflow-hidden bg-[#070a12] flex items-center justify-center p-3 cursor-zoom-in"
                  onClick={() => setIsImageLightboxOpen(true)}
                  title="Clique para expandir em tela cheia na mesma página"
                >
                  <img
                    src={activeProject.image}
                    alt={activeProject.title}
                    className="max-w-full max-h-full object-contain rounded-lg shadow-2xl border border-white/10 transition-transform duration-300 hover:scale-[1.02]"
                  />

                  {/* Status Badges */}
                  <div className="absolute top-3 left-3 z-10 flex items-center gap-2 pointer-events-none">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-[10px] font-mono text-emerald-300 font-bold bg-black/90 px-3 py-1.5 rounded-lg border border-emerald-500/40 backdrop-blur-md shadow-lg">
                      100% NITIDEZ ORIGINAL • SISTEMA EM PRODUÇÃO
                    </span>
                  </div>

                  <div className="absolute top-3 right-3 z-10">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setIsImageLightboxOpen(true)
                      }}
                      className="text-[10px] font-mono font-bold text-amber-300 bg-black/90 hover:bg-amber-500 hover:text-black px-3 py-1.5 rounded-lg border border-amber-500/40 backdrop-blur-md transition-all flex items-center gap-1.5 cursor-pointer shadow-lg"
                      title="Expandir em tela cheia (permanece na mesma página)"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>Tela Cheia (Sem sair)</span>
                    </button>
                  </div>
                </div>

                {/* Bottom Footer Overlay */}
                <div className="p-3 bg-black/90 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-muted-foreground">
                  <span className="text-white font-medium flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span>Clique na imagem para dar zoom em tela cheia na mesma página.</span>
                  </span>
                  <button
                    onClick={() => setDisplayMode("3d")}
                    className="text-sky-400 hover:text-sky-300 font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <span>Voltar à Arquitetura 3D</span>
                    <Sparkles className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Interactive Control Panel (Sliders & Callouts) */}
            <div className="p-3.5 rounded-2xl bg-black/75 border border-sky-400/30 space-y-3">
              {activeTab === "architecture" ? (
                /* Exploded View Slider Controls */
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-sky-300 font-bold flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5" />
                      <span>Deslocamento Tridimensional das Camadas (Exploded View):</span>
                    </span>
                    <span className="text-amber-400 font-extrabold text-sm">{explosionProgress}%</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setExplosionProgress(0)}
                      className="text-[10px] px-2 py-1 rounded bg-gray-900 border border-white/10 hover:border-sky-400 text-muted-foreground hover:text-white cursor-pointer"
                    >
                      Montado (0%)
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={explosionProgress}
                      onChange={(e) => setExplosionProgress(Number(e.target.value))}
                      className="flex-1 accent-sky-400 h-2 bg-gray-900 rounded-lg cursor-pointer"
                    />
                    <button
                      onClick={() => setExplosionProgress(100)}
                      className="text-[10px] px-2 py-1 rounded bg-gray-900 border border-white/10 hover:border-amber-400 text-muted-foreground hover:text-white cursor-pointer"
                    >
                      Explodido (100%)
                    </button>
                  </div>

                  {/* Interactive Layer Callout Buttons */}
                  <div className="pt-2">
                    <div className="text-[10px] text-muted-foreground mb-1.5">
                      Clique em uma camada para inspecionar a decisão arquitetural:
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {activeProject.layers.map((layer, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedLayerIndex(selectedLayerIndex === idx ? null : idx)}
                          className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                            selectedLayerIndex === idx
                              ? "bg-sky-500/20 border-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.3)]"
                              : "bg-gray-950/80 border-white/10 hover:border-white/30"
                          }`}
                        >
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: layer.color }} />
                            <span className="text-[11px] font-bold text-white truncate">{layer.name}</span>
                          </div>
                          <div className="text-[9px] text-sky-300 truncate">{layer.tech}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Selected Layer Details Note */}
                  {selectedLayerIndex !== null && activeProject.layers[selectedLayerIndex] && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 rounded-xl bg-gray-900/90 border border-sky-400/40 text-xs text-slate-200"
                    >
                      <div className="font-bold text-sky-400 mb-0.5 flex items-center justify-between">
                        <span>{activeProject.layers[selectedLayerIndex].name} • {activeProject.layers[selectedLayerIndex].tech}</span>
                        <button
                          onClick={() => setSelectedLayerIndex(null)}
                          className="text-muted-foreground hover:text-white text-[10px]"
                        >
                          Fechar
                        </button>
                      </div>
                      <p className="text-slate-300 text-[11px] leading-relaxed">
                        {activeProject.layers[selectedLayerIndex].description}
                      </p>
                    </motion.div>
                  )}
                </div>
              ) : (
                /* 3D Slicer / Maker Print Controls */
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-amber-400 font-bold flex items-center gap-1.5">
                      <Printer className="w-3.5 h-3.5" />
                      <span>Simulação de Fatiador em Camadas (Slicer 0.20mm):</span>
                    </span>
                    <span className="text-amber-400 font-extrabold text-sm">{sliceProgress}%</span>
                  </div>

                  <input
                    type="range"
                    min="5"
                    max="100"
                    value={sliceProgress}
                    onChange={(e) => setSliceProgress(Number(e.target.value))}
                    className="w-full accent-amber-400 h-2 bg-gray-900 rounded-lg cursor-pointer"
                  />

                  {/* 3D Printing Specs & Export Button */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1 border-t border-white/10">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] text-muted-foreground flex-1">
                      <div className="bg-gray-950 p-2 rounded-lg border border-white/10">
                        <div className="text-[9px]">Dimensões:</div>
                        <div className="font-bold text-white">{activeProject.printSpecs.dimensions}</div>
                      </div>
                      <div className="bg-gray-950 p-2 rounded-lg border border-white/10">
                        <div className="text-[9px]">Filamento:</div>
                        <div className="font-bold text-white">{activeProject.printSpecs.filamentWeight}</div>
                      </div>
                      <div className="bg-gray-950 p-2 rounded-lg border border-white/10">
                        <div className="text-[9px]">Camada:</div>
                        <div className="font-bold text-white">{activeProject.printSpecs.layerHeight}</div>
                      </div>
                      <div className="bg-gray-950 p-2 rounded-lg border border-white/10">
                        <div className="text-[9px]">Preenchimento:</div>
                        <div className="font-bold text-white">{activeProject.printSpecs.infill}</div>
                      </div>
                    </div>

                    <Button
                      onClick={handleDownloadSTL}
                      disabled={isDownloading}
                      className={`h-10 px-4 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer transition-all ${
                        downloadSuccess
                          ? "bg-emerald-500 text-black hover:bg-emerald-400"
                          : "bg-amber-500 hover:bg-amber-400 text-black shadow-lg shadow-amber-500/20"
                      }`}
                    >
                      <Download className="w-4 h-4" />
                      <span>{downloadSuccess ? "✓ Arquivo STL Baixado!" : "Baixar STL para Impressão 3D"}</span>
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Architecture Diagnosis & Solution Briefing */}
            <div className="grid md:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-black/60 border border-sky-400/30 space-y-1.5">
                <div className="font-bold text-sky-300 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-sky-400" />
                  <span>ARQUITETURA TÉCNICA</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px] bg-gray-950/60 p-2.5 rounded-xl border border-white/5">
                  {activeProject.architecture}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/60 border border-emerald-400/30 space-y-1.5">
                <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  <span>SOLUÇÃO DE ENGENHARIA</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px] bg-gray-950/60 p-2.5 rounded-xl border border-white/5">
                  {activeProject.solution}
                </p>
              </div>
            </div>

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

            {/* Tech Stack Badges */}
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

            {/* Footer Navigation Bar */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-white/10">
              <span className="text-[10px] text-muted-foreground flex items-center gap-1.5">
                <Zap className="w-3 h-3 text-amber-400" />
                <span>Malha paramétrica Three.js renderizada a 60 FPS • Áudio Neural J.A.R.V.I.S.</span>
              </span>

              <div className="flex items-center gap-2">
                {activeProject.githubHref && (
                  <Button
                    size="sm"
                    variant="outline"
                    asChild
                    className="h-8 px-3 text-xs border-white/20 hover:border-sky-400 hover:text-sky-300 cursor-pointer"
                  >
                    <a href={activeProject.githubHref} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-3.5 h-3.5 mr-1" />
                      <span>GitHub</span>
                    </a>
                  </Button>
                )}

                <Button
                  size="sm"
                  onClick={() => {
                    setActiveProject(null)
                    stopVoice()
                  }}
                  className="h-8 px-4 bg-sky-500 hover:bg-sky-400 text-black font-bold text-xs rounded-xl shadow-lg shadow-sky-500/20 cursor-pointer"
                >
                  <span>Fechar Holodeck</span>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* In-Page Fullscreen Image Lightbox Modal */}
        <AnimatePresence>
          {isImageLightboxOpen && activeProject && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsImageLightboxOpen(false)}
              className="fixed inset-0 z-[120] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-between p-4 sm:p-6 select-none cursor-zoom-out"
            >
              {/* Lightbox Top Header */}
              <div 
                className="w-full max-w-6xl flex items-center justify-between p-3 rounded-xl bg-black/80 border border-white/10 text-xs font-mono z-20"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-emerald-300 font-bold uppercase tracking-wider">
                    {activeProject.title} • 100% NITIDEZ ORIGINAL
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-muted-foreground hidden sm:inline">
                    Pressione ESC ou clique para sair do zoom
                  </span>
                  <button
                    onClick={() => setIsImageLightboxOpen(false)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500 hover:text-white border border-red-500/40 text-xs font-bold transition-all cursor-pointer shadow-lg"
                    title="Fechar zoom e voltar"
                  >
                    <Minimize2 className="w-3.5 h-3.5" />
                    <span>Sair do Zoom (ESC)</span>
                  </button>
                </div>
              </div>

              {/* Centered High-Resolution Image */}
              <div 
                className="flex-1 w-full max-w-6xl flex items-center justify-center p-2 relative overflow-auto"
                onClick={() => setIsImageLightboxOpen(false)}
              >
                <motion.img
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  src={activeProject.image}
                  alt={activeProject.title}
                  className="max-w-full max-h-[82vh] object-contain rounded-2xl shadow-[0_0_100px_rgba(245,158,11,0.3)] border-2 border-amber-500/40"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>

              {/* Lightbox Bottom Status */}
              <div 
                className="w-full max-w-6xl p-2.5 rounded-xl bg-black/80 border border-white/10 text-[11px] font-mono text-center text-slate-300 flex items-center justify-between z-20"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="text-amber-400 font-medium">
                  🔍 Modo Alta Definição • Imagem real sem distorção 3D
                </span>
                <button
                  onClick={() => setIsImageLightboxOpen(false)}
                  className="text-sky-400 hover:text-sky-300 underline font-bold cursor-pointer"
                >
                  Voltar ao Holodeck ➔
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  )
}
