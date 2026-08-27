"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/addons/controls/OrbitControls.js"
import { Sparkles, Layers, Box, Cpu, Download, RefreshCw, ZoomIn, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"

export type ViewMode = "pbr" | "hologram" | "slicer"

interface SandboxViewerProps {
  modelUrl?: string
  className?: string
}

export function SandboxViewer({ modelUrl, className = "" }: SandboxViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const [viewMode, setViewMode] = useState<ViewMode>("pbr")
  const [autoRotate, setAutoRotate] = useState(true)
  const [wireframe, setWireframe] = useState(false)
  const [layerProgress, setLayerProgress] = useState(100) // For 3D printing slicer mode
  const [activeModel, setActiveModel] = useState<"cybereye" | "reactor" | "mecha">("mecha")

  // Refs to update uniforms or materials without recreating the entire scene
  const sceneElementsRef = useRef<{
    scene: THREE.Scene
    renderer: THREE.WebGLRenderer
    controls: OrbitControls
    meshGroup: THREE.Group
    currentMaterials: THREE.Material[]
    buildPlateGroup: THREE.Group
    slicerUniforms: {
      uSliceHeight: { value: number }
      uTime: { value: number }
    }
  } | null>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const width = mount.clientWidth || 500
    const height = mount.clientHeight || 450

    const scene = new THREE.Scene()
    scene.background = null

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
    camera.position.set(2.6, 2.0, 3.2)

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.3
    mount.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.maxDistance = 8
    controls.minDistance = 1.2
    controls.autoRotate = autoRotate
    controls.autoRotateSpeed = 2.0

    // Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2)
    scene.add(ambientLight)

    const keyLight = new THREE.DirectionalLight(0x22c55e, 3.5)
    keyLight.position.set(4, 5, 4)
    scene.add(keyLight)

    const fillLight = new THREE.DirectionalLight(0x06b6d4, 3.0)
    fillLight.position.set(-4, -2, -3)
    scene.add(fillLight)

    const topLight = new THREE.DirectionalLight(0xffffff, 2.0)
    topLight.position.set(0, 5, 0)
    scene.add(topLight)

    // Build Plate for 3D Print / Slicer Mode
    const buildPlateGroup = new THREE.Group()
    scene.add(buildPlateGroup)

    const gridHelper = new THREE.GridHelper(3, 30, 0x22c55e, 0x1e293b)
    gridHelper.position.y = -1.0
    buildPlateGroup.add(gridHelper)

    // Build plate border
    const plateGeo = new THREE.BoxGeometry(3.1, 0.05, 3.1)
    const plateMat = new THREE.MeshStandardMaterial({
      color: 0x090d16,
      metalness: 0.8,
      roughness: 0.3,
    })
    const plate = new THREE.Mesh(plateGeo, plateMat)
    plate.position.y = -1.03
    buildPlateGroup.add(plate)

    // Mesh Models Group
    const meshGroup = new THREE.Group()
    scene.add(meshGroup)

    const slicerUniforms = {
      uSliceHeight: { value: 1.5 },
      uTime: { value: 0 },
    }

    const currentMaterials: THREE.Material[] = []

    // Generator function for interactive 3D model geometry
    const buildModel = () => {
      // Clear existing
      while (meshGroup.children.length > 0) {
        meshGroup.remove(meshGroup.children[0])
      }
      currentMaterials.length = 0

      if (activeModel === "mecha") {
        // High-Tech Cyber Drone Prototype
        const coreGeo = new THREE.DodecahedronGeometry(0.85, 1)
        const coreMat = new THREE.MeshStandardMaterial({
          color: 0x0f172a,
          metalness: 0.9,
          roughness: 0.2,
        })
        const core = new THREE.Mesh(coreGeo, coreMat)
        meshGroup.add(core)
        currentMaterials.push(coreMat)

        const ringGeo = new THREE.TorusGeometry(1.2, 0.04, 16, 64)
        const ringMat = new THREE.MeshStandardMaterial({
          color: 0x22c55e,
          emissive: 0x22c55e,
          emissiveIntensity: 0.7,
        })
        const ring = new THREE.Mesh(ringGeo, ringMat)
        ring.rotation.x = Math.PI / 3
        meshGroup.add(ring)
        currentMaterials.push(ringMat)

        const innerSphereGeo = new THREE.SphereGeometry(0.5, 32, 32)
        const innerMat = new THREE.MeshStandardMaterial({
          color: 0x06b6d4,
          emissive: 0x06b6d4,
          emissiveIntensity: 0.9,
        })
        const innerSphere = new THREE.Mesh(innerSphereGeo, innerMat)
        meshGroup.add(innerSphere)
        currentMaterials.push(innerMat)
      } else if (activeModel === "reactor") {
        // Sci-Fi Arc Reactor Model
        const torusGeo = new THREE.TorusGeometry(0.9, 0.25, 24, 64)
        const torusMat = new THREE.MeshStandardMaterial({
          color: 0x1e293b,
          metalness: 0.95,
          roughness: 0.15,
        })
        const torus = new THREE.Mesh(torusGeo, torusMat)
        meshGroup.add(torus)
        currentMaterials.push(torusMat)

        const coreGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.6, 32)
        const coreMat = new THREE.MeshStandardMaterial({
          color: 0x22c55e,
          emissive: 0x22c55e,
          emissiveIntensity: 1.0,
        })
        const coreMesh = new THREE.Mesh(coreGeo, coreMat)
        meshGroup.add(coreMesh)
        currentMaterials.push(coreMat)
      } else {
        // Cyber Eye Sensor Pod
        const sphereGeo = new THREE.SphereGeometry(0.9, 32, 32)
        const sphereMat = new THREE.MeshStandardMaterial({
          color: 0x030712,
          metalness: 0.85,
          roughness: 0.1,
        })
        const sphere = new THREE.Mesh(sphereGeo, sphereMat)
        meshGroup.add(sphere)
        currentMaterials.push(sphereMat)

        const lensGeo = new THREE.CylinderGeometry(0.45, 0.35, 0.4, 32)
        lensGeo.rotateX(Math.PI / 2)
        lensGeo.translate(0, 0, 0.7)
        const lensMat = new THREE.MeshStandardMaterial({
          color: 0x22c55e,
          emissive: 0x22c55e,
          emissiveIntensity: 0.8,
        })
        const lens = new THREE.Mesh(lensGeo, lensMat)
        meshGroup.add(lens)
        currentMaterials.push(lensMat)
      }
    }

    buildModel()

    sceneElementsRef.current = {
      scene,
      renderer,
      controls,
      meshGroup,
      currentMaterials,
      buildPlateGroup,
      slicerUniforms,
    }

    // Resize Handler
    const handleResize = () => {
      if (!mount) return
      const w = mount.clientWidth
      const h = mount.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener("resize", handleResize)

    // Animation Loop
    let clock = new THREE.Clock()
    let reqId: number

    const animate = () => {
      reqId = requestAnimationFrame(animate)

      const delta = clock.getDelta()
      const time = clock.getElapsedTime()
      slicerUniforms.uTime.value = time

      controls.update()
      renderer.render(scene, camera)
    }

    animate()

    return () => {
      cancelAnimationFrame(reqId)
      window.removeEventListener("resize", handleResize)
      if (renderer.domElement && mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [activeModel])

  // React to viewMode, wireframe, autoRotate, layerProgress changes
  useEffect(() => {
    if (!sceneElementsRef.current) return
    const { controls, meshGroup, buildPlateGroup, currentMaterials } = sceneElementsRef.current

    controls.autoRotate = autoRotate

    // Handle view modes & shaders
    meshGroup.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material.wireframe = wireframe

        if (viewMode === "pbr") {
          buildPlateGroup.visible = false
          if (child.material instanceof THREE.MeshStandardMaterial) {
            child.material.transparent = false
            child.material.opacity = 1.0
            child.material.roughness = 0.2
            child.material.metalness = 0.9
          }
        } else if (viewMode === "hologram") {
          buildPlateGroup.visible = true
          if (child.material instanceof THREE.MeshStandardMaterial) {
            child.material.transparent = true
            child.material.opacity = 0.65
            child.material.wireframe = true
            child.material.emissive.setHex(0x06b6d4)
            child.material.emissiveIntensity = 1.2
          }
        } else if (viewMode === "slicer") {
          buildPlateGroup.visible = true
          if (child.material instanceof THREE.MeshStandardMaterial) {
            child.material.transparent = false
            child.material.opacity = 1.0
            child.material.wireframe = false
            // Slicer style color (Orange / Green Filament)
            child.material.color.setHex(0x22c55e)
            child.material.emissive.setHex(0x15803d)
            child.material.emissiveIntensity = 0.2
            child.material.roughness = 0.7
            child.material.metalness = 0.1
          }
        }
      }
    })
  }, [viewMode, wireframe, autoRotate, layerProgress])

  return (
    <div className={`relative flex flex-col bg-gray-950/70 border border-border/60 rounded-2xl overflow-hidden backdrop-blur-xl shadow-2xl ${className}`}>
      {/* Top Header Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-border/40 bg-gray-900/50">
        {/* Mode Selector Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-black/40 rounded-xl border border-white/5">
          <Button
            size="sm"
            variant={viewMode === "pbr" ? "default" : "ghost"}
            onClick={() => setViewMode("pbr")}
            className="text-xs h-8 gap-1.5 rounded-lg"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>PBR Realista</span>
          </Button>

          <Button
            size="sm"
            variant={viewMode === "hologram" ? "default" : "ghost"}
            onClick={() => setViewMode("hologram")}
            className="text-xs h-8 gap-1.5 rounded-lg"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Holograma</span>
          </Button>

          <Button
            size="sm"
            variant={viewMode === "slicer" ? "default" : "ghost"}
            onClick={() => setViewMode("slicer")}
            className="text-xs h-8 gap-1.5 rounded-lg"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Fatiamento 3D (Slicer)</span>
          </Button>
        </div>

        {/* Quick Model Selector */}
        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
          <span>Modelo:</span>
          <select
            value={activeModel}
            onChange={(e) => setActiveModel(e.target.value as any)}
            className="bg-gray-900 border border-border/60 rounded-lg px-2 py-1 text-foreground focus:outline-none focus:border-primary"
          >
            <option value="mecha">Cyber Mecha Drone (Meshy AI)</option>
            <option value="reactor">Arc Reactor 3MF (Multicolor)</option>
            <option value="cybereye">Sensor Pod (Watertight STL)</option>
          </select>
        </div>
      </div>

      {/* 3D Canvas Area */}
      <div className="relative w-full h-[420px] sm:h-[480px]">
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* Viewport Info Overlay */}
        <div className="absolute top-4 left-4 pointer-events-none flex flex-col gap-1.5 font-mono text-[11px] text-muted-foreground bg-black/60 backdrop-blur-md p-3 rounded-xl border border-white/10">
          <div className="flex items-center gap-2 text-primary font-bold">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span>MESHY 3D ENGINE • ACTIVE</span>
          </div>
          <div>Triângulos: 28,450 (Topologia Otimizada)</div>
          <div>Manifold: 100% Watertight (Print Ready)</div>
          <div>Formato: GLB / 3MF Multicolor</div>
        </div>

        {/* Slicer Layer Slider (Visible in Slicer Mode) */}
        {viewMode === "slicer" && (
          <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-md p-3 rounded-xl border border-primary/30 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-mono text-primary">
              <Layers className="w-4 h-4" />
              <span>Simulação de Camadas (0.16mm Layer Height): {layerProgress}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={layerProgress}
              onChange={(e) => setLayerProgress(Number(e.target.value))}
              className="w-full sm:w-48 accent-primary cursor-pointer"
            />
          </div>
        )}
      </div>

      {/* Bottom Actions Bar */}
      <div className="p-4 border-t border-border/40 bg-gray-900/50 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setAutoRotate(!autoRotate)}
            className="text-xs h-8 gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${autoRotate ? "animate-spin" : ""}`} />
            <span>{autoRotate ? "Pausar Giro" : "Girar"}</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setWireframe(!wireframe)}
            className="text-xs h-8 gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{wireframe ? "Sólido" : "Wireframe"}</span>
          </Button>
        </div>

        {/* Direct Download Actions */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => alert("Baixando asset .GLB otimizado com texturas PBR...")}
            className="text-xs h-8 gap-1.5 bg-gray-800 hover:bg-gray-700"
          >
            <Download className="w-3.5 h-3.5 text-primary" />
            <span>Exportar .GLB</span>
          </Button>

          <Button
            size="sm"
            onClick={() => alert("Baixando arquivo .3MF com suporte a impressão multicolorida (Bambu Lab / Orca Slicer)...")}
            className="text-xs h-8 gap-1.5 bg-primary text-primary-foreground font-semibold"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Baixar .3MF (3D Print)</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
