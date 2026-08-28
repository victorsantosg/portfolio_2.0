"use client"

import { useEffect, useRef, useState, useMemo } from "react"
import { createPortal } from "react-dom"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import {
  Layers,
  Printer,
  Eye,
  RotateCw,
  Download,
  Flame,
  Truck,
  Snowflake,
  Compass,
  Maximize2,
  Box,
  CheckCircle2,
  TrendingUp,
  Cpu,
  Calendar,
  AlertTriangle,
  ShieldCheck,
  X,
  Search,
  ArrowRight,
  Package,
} from "lucide-react"
import { Button } from "@/components/ui/button"

type ViewMode = "pbr" | "hologram" | "slicer"
type CameraPreset = "geral" | "secos" | "frios" | "docas" | "antecamara" | "2d"

export interface WarehouseSlotData {
  id: string
  address: string
  rua: string
  modulo: string
  nivel: number
  lado: "A" | "B"
  sector: "secos" | "frios" | "docas"
  sku: string
  name: string
  brand: string
  category: string
  orders: number
  estoqueAtual: number
  estoqueReserva: number
  capacidade: number
  validade: string
  fefoDaysRemaining: number
  fefoStatus: "normal" | "alerta" | "critico" | "vencido"
  etiqueta: string
  dataAuditoria: string
  vdo: number
  heatLevel: "A" | "B" | "Regular" | "Cold"
  color: number
  pos: [number, number, number]
}

interface SandboxViewerProps {
  className?: string
}

export function SandboxViewer({ className = "" }: SandboxViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const [viewMode, setViewMode] = useState<ViewMode>("pbr")
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>("geral")
  const [selectedLevel, setSelectedLevel] = useState<number | "all">("all")
  const [wireframe, setWireframe] = useState(false)
  const [autoRotate, setAutoRotate] = useState(false)
  const [layerProgress, setLayerProgress] = useState(100)
  
  // Selected slot for modal and HUD
  const [selectedSlot, setSelectedSlot] = useState<WarehouseSlotData | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [hoveredSlot, setHoveredSlot] = useState<WarehouseSlotData | null>(null)

  // Dataset generation
  const slotsData = useMemo<WarehouseSlotData[]>(() => {
    const products = [
      { sku: "114593", name: "Ervilha Fugini Sh 170G", brand: "Fugini", category: "Mercearia Salgada", cap: 2400 },
      { sku: "209412", name: "Café Pilão Tradicional Vácuo 500g", brand: "Pilão", category: "Matinais", cap: 1800 },
      { sku: "884102", name: "Arroz Tio João Tipo 1 5kg", brand: "Tio João", category: "Grãos & Cereais", cap: 3200 },
      { sku: "551209", name: "Azeite de Oliva Gallo Extra Virgem 500ml", brand: "Gallo", category: "Óleos & Temperos", cap: 1200 },
      { sku: "331904", name: "Leite UHT Integral Piracanjuba 1L", brand: "Piracanjuba", category: "Laticínios", cap: 2800 },
      { sku: "991045", name: "Iogurte Grego Danone Frutas Vermelhas 100g", brand: "Danone", category: "Refrigerados / Frios", cap: 1500 },
      { sku: "441289", name: "Queijo Mussarela Fatiado Sadia 150g", brand: "Sadia", category: "Frios & Embutidos", cap: 1600 },
      { sku: "772190", name: "Manteiga com Sal Aviação 200g", brand: "Aviação", category: "Frios & Laticínios", cap: 1400 },
      { sku: "661201", name: "Biscoito Oreo Recheado Original 90g", brand: "Mondelez", category: "Biscoitos & Doces", cap: 2200 },
      { sku: "102948", name: "Sabão em Pó OMO Lavagem Perfeita 1.6kg", brand: "Unilever", category: "Higiene & Limpeza", cap: 1900 },
    ]

    const list: WarehouseSlotData[] = []
    const modLen = 1.9
    const lvlH = 1.05

    // 1. Setor Secos (Ruas 01 a 07)
    for (let a = 0; a < 7; a++) {
      const ruaStr = (a + 1).toString().padStart(2, "0")
      const rx = -6.5 + a * 1.35
      for (let m = 0; m < 10; m++) {
        const modStr = (m + 1).toString().padStart(2, "0")
        const rz = -20.0 + m * modLen
        for (let l = 0; l < 5; l++) {
          const nivelNum = l + 1
          const ry = nivelNum * lvlH - 0.08 + 0.38

          const pIdx = (a * 5 + m * 3 + l) % products.length
          const p = products[pIdx]

          // Heatmap distribution
          let heat: "A" | "B" | "Regular" | "Cold" = "Regular"
          let color = 0x10b981 // Regular Green
          let orders = 140 + (m * 45) + (a * 30)

          if ((a === 1 || a === 2) && m >= 6 && l <= 1) {
            heat = "A"
            color = 0xef4444 // Red Hotspot
            orders = 1240 + m * 20
          } else if ((a === 0 || a === 3) && m >= 5) {
            heat = "B"
            color = 0xf59e0b // Amber
            orders = 780 + m * 15
          } else if (l >= 3) {
            heat = "Cold"
            color = 0x3b82f6 // Blue
            orders = 40 + l * 10
          }

          // Expiration and FEFO
          const fefoDays = 180 - (m * 18) - (l * 12)
          let fefoStatus: "normal" | "alerta" | "critico" | "vencido" = "normal"
          if (fefoDays < 0) fefoStatus = "vencido"
          else if (fefoDays <= 30) fefoStatus = "critico"
          else if (fefoDays <= 90) fefoStatus = "alerta"

          const estAtual = Math.round(p.cap * (0.45 + (m % 5) * 0.11))

          list.push({
            id: `slot-sec-${a}-${m}-${l}`,
            address: `${ruaStr}${modStr}${nivelNum}001 (ZONA 01 • RUA ${ruaStr})`,
            rua: `RUA ${ruaStr}`,
            modulo: `MÓD ${modStr}`,
            nivel: nivelNum,
            lado: m % 2 === 0 ? "A" : "B",
            sector: "secos",
            sku: p.sku,
            name: p.name,
            brand: p.brand,
            category: p.category,
            orders,
            estoqueAtual: estAtual,
            estoqueReserva: Math.round(estAtual * 0.35),
            capacidade: p.cap,
            validade: fefoDays < 0 ? "14/08/2026" : fefoDays <= 30 ? "20/09/2026" : "15/02/2027",
            fefoDaysRemaining: fefoDays,
            fefoStatus,
            etiqueta: `PLT-${ruaStr}${modStr}-${nivelNum}A`,
            dataAuditoria: "24/08/2026 14:30",
            vdo: Math.round(orders / 14),
            heatLevel: heat,
            color,
            pos: [rx, ry, rz],
          })
        }
      }
    }

    // 2. Setor Frios (Ruas 20 a 27)
    for (let a = 0; a < 8; a++) {
      const ruaStr = (20 + a).toString()
      const rx = 5.5 + a * 1.4
      for (let m = 0; m < 9; m++) {
        const modStr = (m + 1).toString().padStart(2, "0")
        const rz = -16.0 + m * modLen
        for (let l = 0; l < 4; l++) {
          const nivelNum = l + 1
          const ry = nivelNum * lvlH - 0.08 + 0.38

          const pIdx = (5 + a * 2 + m + l) % products.length
          const p = products[pIdx]

          const color = (m + l) % 2 === 0 ? 0x06b6d4 : 0x3b82f6
          const estAtual = Math.round(p.cap * 0.72)

          list.push({
            id: `slot-fri-${a}-${m}-${l}`,
            address: `${ruaStr}${modStr}${nivelNum}001 (ZONA 02 • RUA ${ruaStr})`,
            rua: `RUA ${ruaStr}`,
            modulo: `MÓD ${modStr}`,
            nivel: nivelNum,
            lado: m % 2 === 0 ? "A" : "B",
            sector: "frios",
            sku: p.sku,
            name: p.name,
            brand: p.brand,
            category: p.category,
            orders: 320 + m * 25,
            estoqueAtual: estAtual,
            estoqueReserva: Math.round(estAtual * 0.4),
            capacidade: p.cap,
            validade: "10/11/2026",
            fefoDaysRemaining: 74,
            fefoStatus: "alerta",
            etiqueta: `PLT-${ruaStr}${modStr}-${nivelNum}B`,
            dataAuditoria: "26/08/2026 09:15",
            vdo: 48,
            heatLevel: "Regular",
            color,
            pos: [rx, ry, rz],
          })
        }
      }
    }

    return list
  }, [])

  // Set default initial selected slot
  useEffect(() => {
    if (slotsData.length > 0 && !selectedSlot) {
      setSelectedSlot(slotsData[0])
    }
  }, [slotsData])

  const sceneElementsRef = useRef<{
    scene: THREE.Scene
    camera: THREE.PerspectiveCamera
    renderer: THREE.WebGLRenderer
    controls: OrbitControls
    meshGroup: THREE.Group
    buildPlateGroup: THREE.Group
    slotMeshes: { mesh: THREE.Mesh; slot: WarehouseSlotData }[]
    raycaster: THREE.Raycaster
    mouse: THREE.Vector2
  } | null>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    // Scene Setup
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x040302)

    const width = mount.clientWidth || 800
    const height = mount.clientHeight || 500
    const isMobileViewport = width < 640

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
    camera.position.set(0, isMobileViewport ? 44 : 32, isMobileViewport ? 62 : 48)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping

    // 3. Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.08
    controls.maxPolarAngle = Math.PI / 2 - 0.03
    controls.minDistance = 8
    controls.maxDistance = 140
    controls.target.set(0, 2, -2)
    mount.appendChild(renderer.domElement)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffedd5, 1.8)
    scene.add(ambientLight)

    const sunLight = new THREE.DirectionalLight(0xf59e0b, 3.8)
    sunLight.position.set(20, 35, 25)
    sunLight.castShadow = true
    scene.add(sunLight)

    const fillLight = new THREE.DirectionalLight(0x0284c7, 2.2)
    fillLight.position.set(-25, 15, -15)
    scene.add(fillLight)

    // Build Plate / Slicer Bed
    const buildPlateGroup = new THREE.Group()
    scene.add(buildPlateGroup)
    const gridHelper = new THREE.GridHelper(60, 50, 0xf59e0b, 0x451a03)
    gridHelper.position.y = -0.05
    buildPlateGroup.add(gridHelper)

    // Master Warehouse Group
    const meshGroup = new THREE.Group()
    scene.add(meshGroup)

    // Floor & Demarcations
    const floorGeo = new THREE.PlaneGeometry(54, 68)
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.8,
      metalness: 0.2,
    })
    const floor = new THREE.Mesh(floorGeo, floorMat)
    floor.rotation.x = -Math.PI / 2
    floor.position.set(0, 0, -4)
    floor.receiveShadow = true
    meshGroup.add(floor)

    const addYellowStripe = (w: number, l: number, x: number, z: number, color = 0xfacc15) => {
      const stripeGeo = new THREE.PlaneGeometry(w, l)
      const stripeMat = new THREE.MeshBasicMaterial({ color, opacity: 0.85, transparent: true })
      const stripe = new THREE.Mesh(stripeGeo, stripeMat)
      stripe.rotation.x = -Math.PI / 2
      stripe.position.set(x, 0.02, z)
      meshGroup.add(stripe)
    }

    addYellowStripe(50, 0.15, 0, 14.5)
    addYellowStripe(50, 0.15, 0, 12.0)
    addYellowStripe(50, 0.15, 0, -28.0)
    for (let x = -24; x <= 24; x += 8) {
      addYellowStripe(0.15, 42, x, -7)
    }

    // Cold Room
    const wallMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.4, metalness: 0.1 })
    const coldX = 11.5
    const coldZ = -5.5
    const coldW = 15.0
    const coldL = 26.0
    const coldH = 7.0

    const backWall = new THREE.Mesh(new THREE.BoxGeometry(coldW, coldH, 0.4), wallMat)
    backWall.position.set(coldX, coldH / 2, coldZ - coldL / 2)
    const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.4, coldH, coldL), wallMat)
    rightWall.position.set(coldX + coldW / 2, coldH / 2, coldZ)
    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.4, coldH, coldL), wallMat)
    leftWall.position.set(coldX - coldW / 2, coldH / 2, coldZ)
    const frontWall = new THREE.Mesh(new THREE.BoxGeometry(coldW, coldH * 0.4, 0.4), wallMat)
    frontWall.position.set(coldX, coldH * 0.8, coldZ + coldL / 2)
    meshGroup.add(backWall, rightWall, leftWall, frontWall)

    // Blue Overhead Beams
    const beamMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, metalness: 0.8, roughness: 0.3 })
    for (let bx = -22; bx <= 22; bx += 3.4) {
      const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 54, 8), beamMat)
      beam.rotation.x = Math.PI / 2
      beam.position.set(bx, 8.5, -6)
      meshGroup.add(beam)
    }

    // Sector Badges
    const createSectorSign = (text: string, color: number, x: number, y: number, z: number, w = 4.2, h = 1.4) => {
      const sign = new THREE.Mesh(
        new THREE.BoxGeometry(w, h, 0.15),
        new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.8, metalness: 0.5, roughness: 0.2 })
      )
      sign.position.set(x, y, z)
      meshGroup.add(sign)

      const cableMat = new THREE.MeshBasicMaterial({ color: 0x94a3b8 })
      const c1 = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 2.5), cableMat)
      c1.position.set(x - w / 2 + 0.3, y + 1.25, z)
      const c2 = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 2.5), cableMat)
      c2.position.set(x + w / 2 - 0.3, y + 1.25, z)
      meshGroup.add(c1, c2)
    }

    createSectorSign("PISO / DOCAS", 0xc2410c, -16.0, 5.5, 9.5, 4.5, 1.3)
    createSectorSign("VIRTUAIS", 0x7e22ce, -10.5, 5.5, 9.5, 3.8, 1.3)
    createSectorSign("SECOS", 0x1d4ed8, -2.5, 5.5, 9.5, 4.2, 1.3)
    createSectorSign("FRIOS", 0x0284c7, 11.5, 5.5, 9.5, 4.2, 1.3)
    createSectorSign("ANTECAMARA - GLICOL", 0xca8a04, 11.5, 3.2, 11.0, 4.8, 0.8)

    // Rack Structure Columns and Orange Support Beams
    const rackPostMat = new THREE.MeshStandardMaterial({ color: 0x292524, metalness: 0.85, roughness: 0.3 })
    const rackOrangeBeamMat = new THREE.MeshStandardMaterial({ color: 0xea580c, metalness: 0.8, roughness: 0.25 })

    // Dry sector rack beams
    for (let a = 0; a < 7; a++) {
      const rx = -6.5 + a * 1.35
      for (let m = 0; m < 10; m++) {
        const rz = -20.0 + m * 1.9
        const colGeo = new THREE.BoxGeometry(0.05, 5 * 1.05 + 0.2, 0.05)
        const c1 = new THREE.Mesh(colGeo, rackPostMat)
        c1.position.set(rx - 0.4, (5 * 1.05) / 2, rz - 1.9 / 2)
        const c2 = new THREE.Mesh(colGeo, rackPostMat)
        c2.position.set(rx + 0.4, (5 * 1.05) / 2, rz - 1.9 / 2)
        meshGroup.add(c1, c2)

        for (let l = 0; l < 5; l++) {
          const ry = (l + 1) * 1.05 - 0.08
          const beam = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.04, 1.9), rackOrangeBeamMat)
          beam.position.set(rx, ry, rz)
          meshGroup.add(beam)
        }
      }
    }

    // =========================================================
    // 5. INTERACTIVE CARGO BOXES (RAYCASTABLE SLOTS)
    // =========================================================
    const slotMeshes: { mesh: THREE.Mesh; slot: WarehouseSlotData }[] = []
    const boxGeo = new THREE.BoxGeometry(0.68, 0.68, 0.78)

    slotsData.forEach((slot) => {
      const boxMat = new THREE.MeshStandardMaterial({
        color: slot.color,
        emissive: slot.color,
        emissiveIntensity: slot.heatLevel === "A" ? 0.65 : slot.heatLevel === "B" ? 0.4 : 0.2,
        metalness: 0.35,
        roughness: 0.4,
      })

      const mesh = new THREE.Mesh(boxGeo, boxMat)
      mesh.position.set(slot.pos[0], slot.pos[1], slot.pos[2])
      mesh.castShadow = true
      mesh.receiveShadow = true
      mesh.userData = { slot }
      meshGroup.add(mesh)
      slotMeshes.push({ mesh, slot })
    })

    // Trucks at Docks
    const truckColors = [0xea580c, 0xf59e0b, 0xd97706, 0xef4444, 0x0284c7, 0x16a34a, 0xf59e0b, 0xea580c, 0xd97706, 0x0284c7]
    for (let t = 0; t < 10; t++) {
      const tx = -20 + t * 4.4
      const tz = 18.5
      const cabColor = truckColors[t]

      const truckGroup = new THREE.Group()
      truckGroup.position.set(tx, 0, tz)

      const cargoMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.4, metalness: 0.2 })
      const cargo = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.6, 4.8), cargoMat)
      cargo.position.set(0, 1.8, -1.2)
      cargo.castShadow = true
      truckGroup.add(cargo)

      const cabMat = new THREE.MeshStandardMaterial({ color: cabColor, metalness: 0.7, roughness: 0.25 })
      const cab = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.8, 1.6), cabMat)
      cab.position.set(0, 1.4, 2.0)
      cab.castShadow = true
      truckGroup.add(cab)

      const glassMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.95, roughness: 0.05 })
      const windshield = new THREE.Mesh(new THREE.PlaneGeometry(1.9, 0.75), glassMat)
      windshield.position.set(0, 1.7, 2.81)
      truckGroup.add(windshield)

      const headlightMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xfef08a, emissiveIntensity: 1.5 })
      const hl1 = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.2, 0.05), headlightMat)
      hl1.position.set(-0.8, 0.7, 2.82)
      const hl2 = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.2, 0.05), headlightMat)
      hl2.position.set(0.8, 0.7, 2.82)
      truckGroup.add(hl1, hl2)

      meshGroup.add(truckGroup)
    }

    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    sceneElementsRef.current = {
      scene,
      camera,
      renderer,
      controls,
      meshGroup,
      buildPlateGroup,
      slotMeshes,
      raycaster,
      mouse,
    }

    // Raycast click & hover handler
    const onPointerDown = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect()
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

      raycaster.setFromCamera(mouse, camera)
      const meshes = slotMeshes.filter((s) => s.mesh.visible).map((s) => s.mesh)
      const intersects = raycaster.intersectObjects(meshes)

      if (intersects.length > 0) {
        const hitSlot = intersects[0].object.userData.slot as WarehouseSlotData
        if (hitSlot) {
          setSelectedSlot(hitSlot)
          setIsModalOpen(true)
        }
      }
    }

    const onPointerMove = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect()
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

      raycaster.setFromCamera(mouse, camera)
      const meshes = slotMeshes.filter((s) => s.mesh.visible).map((s) => s.mesh)
      const intersects = raycaster.intersectObjects(meshes)

      if (intersects.length > 0) {
        const hitSlot = intersects[0].object.userData.slot as WarehouseSlotData
        setHoveredSlot(hitSlot)
        renderer.domElement.style.cursor = "pointer"
      } else {
        setHoveredSlot(null)
        renderer.domElement.style.cursor = "grab"
      }
    }

    renderer.domElement.addEventListener("click", onPointerDown)
    renderer.domElement.addEventListener("mousemove", onPointerMove)

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
    let reqId: number
    const animate = () => {
      reqId = requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(reqId)
      window.removeEventListener("resize", handleResize)
      if (renderer.domElement) {
        renderer.domElement.removeEventListener("click", onPointerDown)
        renderer.domElement.removeEventListener("mousemove", onPointerMove)
        if (mount.contains(renderer.domElement)) {
          mount.removeChild(renderer.domElement)
        }
      }
      renderer.dispose()
    }
  }, [slotsData])

  // Filter by Selected Level
  useEffect(() => {
    if (!sceneElementsRef.current) return
    const { slotMeshes } = sceneElementsRef.current

    slotMeshes.forEach(({ mesh, slot }) => {
      mesh.visible = selectedLevel === "all" || slot.nivel === selectedLevel
    })
  }, [selectedLevel])

  // Camera Presets
  useEffect(() => {
    if (!sceneElementsRef.current) return
    const { camera, controls } = sceneElementsRef.current
    const isMob = typeof window !== "undefined" ? window.innerWidth < 640 : false

    switch (cameraPreset) {
      case "geral":
        if (isMob) {
          camera.position.set(0, 48, 64)
          controls.target.set(0, 3, -4)
        } else {
          camera.position.set(0, 32, 48)
          controls.target.set(0, 2, -2)
        }
        break
      case "secos":
        camera.position.set(isMob ? -6 : -8, isMob ? 22 : 16, isMob ? 28 : 22)
        controls.target.set(-2.5, 3, -6)
        break
      case "frios":
        camera.position.set(isMob ? 14 : 16, isMob ? 24 : 18, isMob ? 28 : 22)
        controls.target.set(11.5, 3, -5)
        break
      case "antecamara":
        camera.position.set(11.5, isMob ? 12 : 8, isMob ? 28 : 24)
        controls.target.set(11.5, 2.5, 11)
        break
      case "docas":
        camera.position.set(0, isMob ? 14 : 10, isMob ? 42 : 34)
        controls.target.set(0, 2, 18)
        break
      case "2d":
        camera.position.set(0, isMob ? 80 : 62, -3.99)
        controls.target.set(0, 0, -4)
        break
    }
    controls.update()
  }, [cameraPreset])

  // View Mode (PBR, Hologram, Slicer)
  useEffect(() => {
    if (!sceneElementsRef.current) return
    const { meshGroup, buildPlateGroup } = sceneElementsRef.current

    meshGroup.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material.wireframe = wireframe

        if (viewMode === "pbr") {
          buildPlateGroup.visible = false
          if (child.material instanceof THREE.MeshStandardMaterial) {
            child.material.transparent = false
            child.material.opacity = 1.0
          }
        } else if (viewMode === "hologram") {
          buildPlateGroup.visible = true
          if (child.material instanceof THREE.MeshStandardMaterial) {
            child.material.transparent = true
            child.material.opacity = 0.6
            child.material.wireframe = true
            child.material.emissive.setHex(0xf59e0b)
            child.material.emissiveIntensity = 1.2
          }
        } else if (viewMode === "slicer") {
          buildPlateGroup.visible = true
          if (child.material instanceof THREE.MeshStandardMaterial) {
            child.material.transparent = false
            child.material.opacity = 1.0
            child.material.wireframe = false
            child.material.color.setHex(0xf97316)
            child.material.emissive.setHex(0xc2410c)
            child.material.emissiveIntensity = 0.25
          }
        }
      }
    })
  }, [viewMode, wireframe])

  const [isFullscreen, setIsFullscreen] = useState(false)
  const rootContainerRef = useRef<HTMLDivElement>(null)

  // Listen to native browser fullscreen changes and resize Three.js
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFs = !!document.fullscreenElement
      setIsFullscreen(isFs)
      setTimeout(() => {
        window.dispatchEvent(new Event("resize"))
      }, 80)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange)

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange)
    }
  }, [])

  const toggleFullscreen = () => {
    const elem = rootContainerRef.current
    if (!elem) return

    if (!document.fullscreenElement) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(() => {
          setIsFullscreen(true)
        })
      } else if ((elem as any).webkitRequestFullscreen) {
        (elem as any).webkitRequestFullscreen()
      } else {
        setIsFullscreen(true)
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {
          setIsFullscreen(false)
        })
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen()
      } else {
        setIsFullscreen(false)
      }
    }
  }

  const activeSlot = hoveredSlot || selectedSlot

  // Listen to Jarvis Autonomous Tour Steps
  useEffect(() => {
    const handleTourStep = (e: any) => {
      const step = e.detail
      if (step?.id === "maker_lab") {
        if (step.threePreset) setCameraPreset(step.threePreset)
        if (step.threeLevel) setSelectedLevel(step.threeLevel)
        setAutoRotate(true)
      }
    }

    window.addEventListener("jarvis-tour-step", handleTourStep)
    return () => window.removeEventListener("jarvis-tour-step", handleTourStep)
  }, [])

  // Disclaimer Banner & Quick AI Diagnostics Trigger
  const triggerJarvisQuery = (query: string) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("jarvis-ask-query", { detail: { query } }))
    }
  }

  return (
    <div
      ref={rootContainerRef}
      className={`relative flex flex-col w-full max-w-full bg-gray-950/95 border border-amber-500/30 overflow-hidden backdrop-blur-2xl shadow-[0_0_60px_rgba(245,158,11,0.2)] transition-all duration-300 ${
        isFullscreen
          ? "w-full h-full rounded-none border-none p-2 bg-[#050505]"
          : `rounded-2xl ${className}`
      }`}
    >
      {/* Top Header Controls Bar */}
      <div className="flex items-center justify-between gap-2 p-2 sm:p-3 border-b border-amber-500/20 bg-gray-900/80 w-full overflow-hidden">
        {/* Camera Tour Navigation Tabs - Horizontally Scrollable on Mobile with flex-1 min-w-0 */}
        <div className="flex-1 min-w-0 flex items-center gap-1 bg-black/60 p-1 rounded-xl border border-amber-500/20 text-xs font-mono overflow-x-auto no-scrollbar">
          <span className="text-amber-400 font-bold px-1.5 flex items-center gap-1 shrink-0">
            <Compass className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Setores:</span>
          </span>
          {(["geral", "secos", "frios", "antecamara", "docas", "2d"] as CameraPreset[]).map((preset) => (
            <button
              key={preset}
              onClick={() => setCameraPreset(preset)}
              className={`px-2 py-1 rounded-lg text-xs capitalize transition-colors shrink-0 ${
                cameraPreset === preset
                  ? "bg-amber-500/25 text-amber-300 border border-amber-400/50 font-bold shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {preset === "geral" ? "Geral" : preset === "2d" ? "Planta 2D" : preset}
            </button>
          ))}
        </div>

        {/* Fullscreen Mode Button */}
        <Button
          size="sm"
          onClick={toggleFullscreen}
          className={`text-xs h-7.5 sm:h-8.5 px-2.5 sm:px-3 gap-1 rounded-xl font-mono font-bold shadow-lg transition-all shrink-0 ${
            isFullscreen
              ? "bg-red-500/20 text-red-300 border border-red-500/40 hover:bg-red-500 hover:text-white"
              : "bg-amber-500 text-black hover:bg-amber-400 shadow-amber-500/20"
          }`}
        >
          {isFullscreen ? (
            <>
              <X className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sair (ESC)</span>
            </>
          ) : (
            <>
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="text-[11px] sm:text-xs">Tela Cheia</span>
            </>
          )}
        </Button>
      </div>

      {/* Disclaimer & AI Diagnostic Badges */}
      <div className="px-2.5 sm:px-3 py-1.5 bg-amber-500/10 border-b border-amber-500/20 flex flex-wrap items-center justify-between gap-1.5 text-[10px] sm:text-[11px] font-mono text-amber-300 w-full overflow-hidden">
        <div className="flex items-center gap-1.5 min-w-0">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="truncate">
            <strong>3D Demo:</strong> 11.200 posições reais (WMS).
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => triggerJarvisQuery("J.A.R.V.I.S., realize um diagnóstico imediato dos produtos com risco de validade FEFO e shelf-life no armazém.")}
            className="px-2 py-0.5 rounded bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 font-bold text-[9px] flex items-center gap-1 cursor-pointer transition-colors shadow-sm"
          >
            <span>⚠️ Diagnóstico FEFO</span>
          </button>
          <button
            onClick={() => triggerJarvisQuery("J.A.R.V.I.S., analise os produtos de Curva A (alta rotatividade) e a eficiência de picking nas docas.")}
            className="px-2 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold text-[9px] flex items-center gap-1 cursor-pointer transition-colors shadow-sm"
          >
            <span>🔥 Análise Curva A</span>
          </button>
        </div>
      </div>

      {/* Main 3D Canvas Viewport */}
      <div className={`relative w-full max-w-full overflow-hidden ${isFullscreen ? "flex-1 h-full min-h-[500px]" : "h-[380px] sm:h-[500px]"}`}>
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* Desktop Left Floating Levels Selector */}
        <div className="hidden sm:flex absolute top-4 left-4 p-2 rounded-2xl bg-black/85 backdrop-blur-md border border-amber-500/30 flex-col gap-1 text-[11px] font-mono shadow-xl select-none z-10">
          <div className="text-[10px] font-bold text-amber-400 px-2 py-0.5 border-b border-amber-500/20 mb-0.5">
            NÍVEIS
          </div>
          <button
            onClick={() => setSelectedLevel("all")}
            className={`px-3 py-1 rounded-lg transition-colors font-bold cursor-pointer ${
              selectedLevel === "all"
                ? "bg-amber-500 text-black shadow-md"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            TODOS
          </button>
          {[1, 2, 3, 4, 5].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl)}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                selectedLevel === lvl
                  ? "bg-amber-500 text-black font-bold shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              NÍVEL {lvl.toString().padStart(2, "0")}
            </button>
          ))}
        </div>

        {/* Mobile Horizontal Top Levels Bar */}
        <div className="sm:hidden absolute top-2 left-2 right-2 flex items-center p-1 bg-black/90 backdrop-blur-md border border-amber-500/30 rounded-xl text-[10px] font-mono shadow-xl select-none z-10 overflow-x-auto no-scrollbar gap-1">
          <button
            onClick={() => setSelectedLevel("all")}
            className={`px-2 py-0.5 rounded-lg font-bold shrink-0 text-[10px] ${
              selectedLevel === "all"
                ? "bg-amber-500 text-black"
                : "text-muted-foreground"
            }`}
          >
            TODOS
          </button>
          {[1, 2, 3, 4, 5].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl)}
              className={`px-2 py-0.5 rounded-lg shrink-0 text-[10px] ${
                selectedLevel === lvl
                  ? "bg-amber-500 text-black font-bold"
                  : "text-muted-foreground"
              }`}
            >
              NV {lvl.toString().padStart(2, "0")}
            </button>
          ))}
        </div>

        {/* Right Floating Compact Slot Inspection Card */}
        {activeSlot && (
          <div className="absolute top-9 sm:top-3 right-2 sm:right-3 p-2 rounded-xl bg-black/90 backdrop-blur-md border border-amber-500/40 text-[10px] font-mono space-y-1 max-w-[170px] sm:max-w-[220px] shadow-2xl z-10 animate-in fade-in duration-150 select-none">
            <div className="flex items-center justify-between border-b border-amber-500/30 pb-0.5">
              <span className={`text-[8px] sm:text-[9px] font-bold px-1.5 py-0.2 rounded border ${
                activeSlot.heatLevel === "A"
                  ? "bg-red-500/20 text-red-400 border-red-500/40"
                  : activeSlot.heatLevel === "B"
                  ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                  : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
              }`}>
                CURVA {activeSlot.heatLevel}
              </span>
              <span className="text-[8px] sm:text-[9px] text-muted-foreground">{activeSlot.rua}</span>
            </div>

            <div>
              <div className="text-foreground font-bold text-[10px] leading-tight truncate">
                {activeSlot.name}
              </div>
              <div className="text-[8px] text-muted-foreground truncate">SKU {activeSlot.sku}</div>
            </div>

            <div className="grid grid-cols-2 gap-1 pt-0.5 border-t border-border/40 text-[8px]">
              <div>
                <span className="text-muted-foreground">Ped: </span>
                <span className="text-amber-400 font-bold">{activeSlot.orders}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Est: </span>
                <span className="text-foreground font-bold">{activeSlot.estoqueAtual}</span>
              </div>
            </div>

            <Button
              size="sm"
              className="w-full h-5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-[8px] rounded-lg shadow gap-1 cursor-pointer py-0"
              onClick={() => {
                setSelectedSlot(activeSlot)
                setIsModalOpen(true)
              }}
            >
              <Package className="w-2.5 h-2.5" />
              <span>DETALHES</span>
            </Button>
          </div>
        )}

        {/* Bottom-Right Heatmap Legend */}
        <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 p-1.5 sm:p-2.5 rounded-xl bg-black/85 backdrop-blur-md border border-amber-500/30 text-[8px] sm:text-[10px] font-mono space-y-0.5 pointer-events-none shadow-xl z-10 max-w-[130px] sm:max-w-none">
          <div className="flex items-center gap-1 text-amber-400 font-bold text-[9px] sm:text-xs pb-0.5 border-b border-amber-500/20">
            <Flame className="w-2.5 h-2.5 text-red-500" />
            <span>GIRO / DEMANDA</span>
          </div>
          <div className="flex items-center justify-between gap-1 text-muted-foreground text-[8px]">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_6px_#ef4444]" />
              <span>Alta Curva (A)</span>
            </span>
          </div>
          <div className="flex items-center justify-between gap-1 text-muted-foreground text-[8px]">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>Média Curva (B)</span>
            </span>
          </div>
          <div className="flex items-center justify-between gap-1 text-muted-foreground text-[8px]">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Giro Regular</span>
            </span>
          </div>
        </div>

        {/* Tip helper */}
        <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-xl bg-black/80 backdrop-blur-md border border-amber-500/20 text-[10px] font-mono text-muted-foreground pointer-events-none hidden sm:flex items-center gap-1.5 z-10">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span>Dica: Clique em qualquer caixa 3D para abrir o modal de lote e validade</span>
        </div>
      </div>

      {/* Bottom Actions Bar - 2x2 Grid on Mobile, Flex on Desktop */}
      <div className="p-2 sm:p-3 border-t border-amber-500/20 bg-gray-900/80 w-full overflow-hidden">
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-between gap-1.5 sm:gap-2 w-full">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setAutoRotate(!autoRotate)}
            className="text-[10px] sm:text-xs h-7 sm:h-7.5 px-2 justify-center gap-1 border-gray-700 hover:border-amber-400 text-foreground w-full sm:w-auto font-mono"
          >
            <RotateCw className="w-3 h-3" />
            <span>{autoRotate ? "Pausar" : "Girar 360°"}</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setWireframe(!wireframe)}
            className="text-[10px] sm:text-xs h-7 sm:h-7.5 px-2 justify-center gap-1 border-gray-700 hover:border-amber-400 text-foreground w-full sm:w-auto font-mono"
          >
            <Eye className="w-3 h-3" />
            <span>Wireframe CAD</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="text-[10px] sm:text-xs h-7 sm:h-7.5 px-2 justify-center gap-1 border-gray-700 hover:border-amber-400 text-foreground w-full sm:w-auto font-mono"
            onClick={() => alert("Exportação do modelo 3D GLB do Armazém Cometa concluída!")}
          >
            <Download className="w-3 h-3" />
            <span>Exportar .GLB</span>
          </Button>

          <Button
            size="sm"
            className="text-[10px] sm:text-xs h-7 sm:h-7.5 px-2 justify-center gap-1 bg-amber-500 hover:bg-amber-400 text-black font-bold shadow-md w-full sm:w-auto font-mono"
            onClick={() => alert("Download do pacote .3MF para fatiamento industrial iniciado!")}
          >
            <Download className="w-3 h-3" />
            <span>Baixar .3MF</span>
          </Button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODAL DE DETALHE COMPLETO DO SLOT / LOTE / FEFO / WMS */}
      {/* ========================================================= */}
      {isModalOpen && selectedSlot && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-gray-950 border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden text-foreground">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-amber-500/20 bg-gray-900/80">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  <Box className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-amber-400">
                      {selectedSlot.rua} • {selectedSlot.modulo} • NÍVEL {selectedSlot.nivel.toString().padStart(2, "0")} • LADO {selectedSlot.lado}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      PICKING ATIVO
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-foreground mt-0.5">
                    SKU {selectedSlot.sku} • {selectedSlot.name}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto font-mono text-xs">
              {/* Grid de Métricas de Estoque */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-gray-900/60 border border-border/60">
                  <span className="text-[10px] text-muted-foreground uppercase">Estoque Atual</span>
                  <p className="text-base font-bold text-amber-400 mt-1">
                    {selectedSlot.estoqueAtual.toLocaleString("pt-BR")} <span className="text-[10px] text-muted-foreground">un</span>
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-gray-900/60 border border-border/60">
                  <span className="text-[10px] text-muted-foreground uppercase">Reserva WMS</span>
                  <p className="text-base font-bold text-foreground mt-1">
                    {selectedSlot.estoqueReserva.toLocaleString("pt-BR")} <span className="text-[10px] text-muted-foreground">un</span>
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-gray-900/60 border border-border/60">
                  <span className="text-[10px] text-muted-foreground uppercase">Capacidade</span>
                  <p className="text-base font-bold text-foreground mt-1">
                    {selectedSlot.capacidade.toLocaleString("pt-BR")} <span className="text-[10px] text-muted-foreground">un</span>
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-gray-900/60 border border-border/60">
                  <span className="text-[10px] text-muted-foreground uppercase">Ocupação</span>
                  <p className="text-base font-bold text-emerald-400 mt-1">
                    {Math.round((selectedSlot.estoqueAtual / selectedSlot.capacidade) * 100)}%
                  </p>
                </div>
              </div>

              {/* Barra de Ocupação da Posição */}
              <div>
                <div className="flex justify-between text-xs font-bold text-muted-foreground mb-1.5">
                  <span>Taxa de Ocupação da Prateleira</span>
                  <span className="text-amber-400">
                    {Math.round((selectedSlot.estoqueAtual / selectedSlot.capacidade) * 100)}% Preenchido
                  </span>
                </div>
                <div className="w-full h-2.5 bg-gray-800 rounded-full overflow-hidden border border-border/40">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((selectedSlot.estoqueAtual / selectedSlot.capacidade) * 100, 100)}%` }}
                  />
                </div>
              </div>

              {/* Validade do Lote (FEFO) e Auditoria */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className={`p-4 rounded-xl border space-y-2 ${
                  selectedSlot.fefoStatus === "vencido"
                    ? "bg-red-500/10 border-red-500/40"
                    : selectedSlot.fefoStatus === "critico"
                    ? "bg-amber-500/10 border-amber-500/40"
                    : "bg-gray-900/60 border-border/60"
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      Validade do Lote (FEFO)
                    </span>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                      selectedSlot.fefoDaysRemaining <= 30
                        ? "bg-red-500/20 text-red-300 border border-red-500/30"
                        : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    }`}>
                      {selectedSlot.fefoDaysRemaining <= 30
                        ? `Crítico (${selectedSlot.fefoDaysRemaining} dias)`
                        : `Normal (${selectedSlot.fefoDaysRemaining} dias)`}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-foreground">
                    {selectedSlot.validade}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Etiqueta Palete: <strong className="text-foreground">{selectedSlot.etiqueta}</strong>
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-gray-900/60 border border-border/60 space-y-2">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Inventário / Auditoria WMS
                  </span>
                  <p className="text-xs font-bold text-foreground">
                    Auditado em {selectedSlot.dataAuditoria}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Giro Médio (VDO): <strong className="text-amber-400">{selectedSlot.vdo} un/dia</strong>
                  </p>
                </div>
              </div>

              {/* Banner de Alerta Operacional */}
              {selectedSlot.fefoDaysRemaining <= 30 && (
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-amber-300">
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5 animate-pulse" />
                  <div className="text-xs space-y-1">
                    <span className="font-bold text-amber-400 uppercase">
                      Alerta de Shelf-Life: Validade Próxima ({selectedSlot.fefoDaysRemaining} dias)
                    </span>
                    <p className="text-muted-foreground">
                      Lote com vencimento próximo cadastrado. O algoritmo do WMS priorizou esta posição nas próximas rotas de separação para evitar descarte.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between p-4 border-t border-amber-500/20 bg-gray-900/80">
              <span className="text-xs font-mono text-muted-foreground">
                Endereço WMS: <strong className="text-amber-400">{selectedSlot.address}</strong>
              </span>
              <Button
                size="sm"
                onClick={() => setIsModalOpen(false)}
                className="bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-xl"
              >
                Fechar Ficha
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
