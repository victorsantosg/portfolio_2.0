"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

export function ScrollAssemblyCanvas() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Scene, Camera, Renderer
    const scene = new THREE.Scene()

    let width = window.innerWidth
    let height = window.innerHeight

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
    camera.position.set(0, 0, 9)

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.0
    container.appendChild(renderer.domElement)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x180d02, 2.5)
    scene.add(ambientLight)

    const orangeLight = new THREE.DirectionalLight(0xf59e0b, 3.2)
    orangeLight.position.set(5, 6, 4)
    scene.add(orangeLight)

    const amberLight = new THREE.DirectionalLight(0xff7b00, 2.6)
    amberLight.position.set(-5, -4, -2)
    scene.add(amberLight)

    const coreLight = new THREE.PointLight(0xf59e0b, 4.5, 8)
    scene.add(coreLight)

    // Master Assembly Group
    const serverGroup = new THREE.Group()
    scene.add(serverGroup)
    serverGroup.position.set(0, 0, 0)

    // Materials
    const titaniumMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.9,
      roughness: 0.25,
    })

    const accentMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.8,
      roughness: 0.3,
    })

    const pcbMat = new THREE.MeshStandardMaterial({
      color: 0x180d02, // Dark carbon / amber PCB
      metalness: 0.6,
      roughness: 0.4,
    })

    const cyanEmissiveMat = new THREE.MeshStandardMaterial({
      color: 0xfbbf24, // Gold Amber Emissive
      emissive: 0xfbbf24,
      emissiveIntensity: 0.9,
      roughness: 0.2,
    })

    const greenEmissiveMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b, // J.A.R.V.I.S. Stark Orange Emissive
      emissive: 0xf59e0b,
      emissiveIntensity: 1.2,
      roughness: 0.1,
    })

    const wireframeMat = new THREE.LineBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.35,
    })

    // ==========================================
    // 1. RACK FRAME & STRUCTURAL CHASSIS BASE
    // ==========================================
    const rackGroup = new THREE.Group()
    serverGroup.add(rackGroup)

    // Vertical corner pillars
    const pillarGeo = new THREE.BoxGeometry(0.08, 3.4, 0.08)
    const positionsPillars = [
      [-1.3, 0, -0.9],
      [1.3, 0, -0.9],
      [-1.3, 0, 0.9],
      [1.3, 0, 0.9],
    ]
    positionsPillars.forEach(([x, y, z]) => {
      const pillar = new THREE.Mesh(pillarGeo, titaniumMat)
      pillar.position.set(x, y, z)
      rackGroup.add(pillar)
    })

    // Top & Bottom structural plates
    const plateGeo = new THREE.BoxGeometry(2.7, 0.08, 1.9)
    const topPlate = new THREE.Mesh(plateGeo, titaniumMat)
    topPlate.position.set(0, 1.7, 0)
    rackGroup.add(topPlate)

    const bottomPlate = new THREE.Mesh(plateGeo, titaniumMat)
    bottomPlate.position.set(0, -1.7, 0)
    rackGroup.add(bottomPlate)

    // ==========================================
    // 2. MOTHERBOARD / BACKPLANE
    // ==========================================
    const motherboardGroup = new THREE.Group()
    serverGroup.add(motherboardGroup)

    const mbGeo = new THREE.BoxGeometry(2.4, 3.1, 0.05)
    const motherboard = new THREE.Mesh(mbGeo, pcbMat)
    motherboard.position.set(0, 0, -0.7)
    motherboardGroup.add(motherboard)

    // Motherboard Circuit Line Details
    for (let i = 0; i < 6; i++) {
      const lineGeo = new THREE.BoxGeometry(2.1, 0.02, 0.02)
      const lineMesh = new THREE.Mesh(lineGeo, cyanEmissiveMat)
      lineMesh.position.set(0, -1.2 + i * 0.48, -0.66)
      motherboardGroup.add(lineMesh)
    }

    // ==========================================
    // 3. CENTRAL AI CORE & QUANTUM PROCESSOR
    // ==========================================
    const cpuGroup = new THREE.Group()
    serverGroup.add(cpuGroup)

    const cpuBaseGeo = new THREE.BoxGeometry(0.8, 0.8, 0.12)
    const cpuBase = new THREE.Mesh(cpuBaseGeo, titaniumMat)
    cpuBase.position.set(0, 0, -0.58)
    cpuGroup.add(cpuBase)

    const cpuCoreGeo = new THREE.DodecahedronGeometry(0.28, 1)
    const cpuCore = new THREE.Mesh(cpuCoreGeo, greenEmissiveMat)
    cpuCore.position.set(0, 0, -0.45)
    cpuGroup.add(cpuCore)

    // Heatsink fins
    for (let i = 0; i < 8; i++) {
      const finGeo = new THREE.BoxGeometry(0.7, 0.015, 0.2)
      const fin = new THREE.Mesh(finGeo, accentMat)
      fin.position.set(0, -0.3 + i * 0.085, -0.48)
      cpuGroup.add(fin)
    }

    // ==========================================
    // 4. MODULAR RAM & DATABASE BLADE UNITS (4 Blades)
    // ==========================================
    const bladesGroup = new THREE.Group()
    serverGroup.add(bladesGroup)

    const blades: THREE.Group[] = []
    const bladeGeo = new THREE.BoxGeometry(0.12, 1.2, 0.9)
    const bladeXPositions = [-0.85, -0.45, 0.45, 0.85]

    bladeXPositions.forEach((targetX, idx) => {
      const bladeUnit = new THREE.Group()

      const bladeMesh = new THREE.Mesh(bladeGeo, titaniumMat)
      bladeUnit.add(bladeMesh)

      // Emissive status strip on blade
      const stripGeo = new THREE.BoxGeometry(0.02, 1.0, 0.04)
      const stripMesh = new THREE.Mesh(
        stripGeo,
        idx % 2 === 0 ? greenEmissiveMat : cyanEmissiveMat
      )
      stripMesh.position.set(0.065, 0, 0.4)
      bladeUnit.add(stripMesh)

      // Initial target docked position
      bladeUnit.position.set(targetX, 0, 0)
      bladesGroup.add(bladeUnit)
      blades.push(bladeUnit)
    })

    // ==========================================
    // 5. CHASSIS PANELS & FRONT BEZEL
    // ==========================================
    const chassisGroup = new THREE.Group()
    serverGroup.add(chassisGroup)

    // Left side panel
    const sidePanelGeo = new THREE.BoxGeometry(0.05, 3.2, 1.7)
    const leftPanel = new THREE.Mesh(sidePanelGeo, titaniumMat)
    leftPanel.position.set(-1.3, 0, 0)
    chassisGroup.add(leftPanel)

    // Right side panel
    const rightPanel = new THREE.Mesh(sidePanelGeo, titaniumMat)
    rightPanel.position.set(1.3, 0, 0)
    chassisGroup.add(rightPanel)

    // Front Bezel Frame with Ventilation Grid
    const frontBezelGeo = new THREE.BoxGeometry(2.5, 3.2, 0.08)
    const frontBezel = new THREE.Mesh(frontBezelGeo, accentMat)
    frontBezel.position.set(0, 0, 0.9)
    chassisGroup.add(frontBezel)

    // Front Server Activity LED Grid
    const ledsGroup = new THREE.Group()
    frontBezel.add(ledsGroup)
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 6; c++) {
        const ledGeo = new THREE.BoxGeometry(0.04, 0.04, 0.02)
        const led = new THREE.Mesh(
          ledGeo,
          (r + c) % 3 === 0 ? greenEmissiveMat : cyanEmissiveMat
        )
        led.position.set(-0.9 + c * 0.36, -1.0 + r * 0.65, 0.05)
        ledsGroup.add(led)
      }
    }

    // ==========================================
    // 6. CLOUD NETWORK NODES & ORBITAL DATA RINGS
    // ==========================================
    const networkGroup = new THREE.Group()
    serverGroup.add(networkGroup)

    const ringGeo1 = new THREE.TorusGeometry(2.6, 0.018, 16, 64)
    const networkRing1 = new THREE.Mesh(ringGeo1, cyanEmissiveMat)
    networkRing1.rotation.x = Math.PI / 2.5
    networkGroup.add(networkRing1)

    const ringGeo2 = new THREE.TorusGeometry(3.1, 0.015, 16, 64)
    const networkRing2 = new THREE.Mesh(ringGeo2, greenEmissiveMat)
    networkRing2.rotation.y = Math.PI / 3
    networkGroup.add(networkRing2)

    // Ambient floating cyberspace particles
    const particleCount = 120
    const particleGeo = new THREE.BufferGeometry()
    const particlePositions = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 16
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 16
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 10
    }
    particleGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(particlePositions, 3)
    )
    const particleMat = new THREE.PointsMaterial({
      color: 0x22c55e,
      size: 0.04,
      transparent: true,
      opacity: 0.45,
    })
    const particleSystem = new THREE.Points(particleGeo, particleMat)
    scene.add(particleSystem)

    // ==========================================
    // SCROLL TRACKING & PROGRESS INTERPOLATION
    // ==========================================
    let targetScrollProgress = 0
    let currentScrollProgress = 0
    let mouseX = 0
    let mouseY = 0

    const handleScroll = () => {
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight
      if (docHeight > 0) {
        targetScrollProgress = Math.min(
          1,
          Math.max(0, window.scrollY / docHeight)
        )
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1
    }

    const handleResize = () => {
      width = window.innerWidth
      height = window.innerHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    window.addEventListener("resize", handleResize)
    handleScroll()

    // Animation Loop
    let reqId: number
    const clock = new THREE.Clock()

    const animate = () => {
      reqId = requestAnimationFrame(animate)

      const time = clock.getElapsedTime()

      // Smooth Lerp for scroll progression
      currentScrollProgress = THREE.MathUtils.lerp(
        currentScrollProgress,
        targetScrollProgress,
        0.06
      )

      // Master Server Orientation (Gentle 3D rotation based on scroll)
      serverGroup.rotation.y =
        Math.PI * 0.25 +
        currentScrollProgress * Math.PI * 1.8 +
        mouseX * 0.15
      serverGroup.rotation.x =
        0.15 - currentScrollProgress * 0.1 + mouseY * 0.1
      serverGroup.rotation.z = Math.sin(time * 0.5) * 0.03

      // Shift position slightly to the right side on desktop so text on left stays prominent
      const isMobile = window.innerWidth < 1024
      serverGroup.position.x = isMobile ? 0 : 1.2
      serverGroup.position.y = Math.sin(time * 1.2) * 0.08
      serverGroup.scale.setScalar(isMobile ? 0.72 : 1.0)

      // ============================================================
      // STAGED SCROLL ASSEMBLY (Exploded View -> Full Server Online)
      // ============================================================

      // Stage 1: Rack & Foundation (0.0 -> 0.20)
      const p1 = Math.min(1, Math.max(0, currentScrollProgress / 0.2))
      const rackOffset = (1 - p1) * 3.5
      topPlate.position.y = 1.7 + rackOffset
      bottomPlate.position.y = -1.7 - rackOffset

      // Stage 2: Motherboard (0.15 -> 0.40)
      const p2 = Math.min(1, Math.max(0, (currentScrollProgress - 0.15) / 0.25))
      motherboardGroup.position.z = (1 - p2) * -5.0
      motherboardGroup.position.y = (1 - p2) * 2.0
      motherboardGroup.rotation.x = (1 - p2) * 0.8

      // Stage 3: CPU & Neural Core (0.35 -> 0.60)
      const p3 = Math.min(1, Math.max(0, (currentScrollProgress - 0.35) / 0.25))
      cpuGroup.position.y = (1 - p3) * 4.0
      cpuGroup.position.z = (1 - p3) * 3.0
      cpuCore.rotation.x = time * 0.8
      cpuCore.rotation.y = time * 1.2

      // Stage 4: Database/RAM Blades (0.50 -> 0.75)
      const p4 = Math.min(1, Math.max(0, (currentScrollProgress - 0.5) / 0.25))
      blades.forEach((blade, i) => {
        const sign = i < 2 ? -1 : 1
        blade.position.x =
          bladeXPositions[i] + sign * (1 - p4) * (2.0 + i * 0.5)
        blade.position.z = (1 - p4) * (3.0 + i * 0.8)
        blade.rotation.y = (1 - p4) * (sign * 0.6)
      })

      // Stage 5: Chassis Panels & Bezel (0.65 -> 0.88)
      const p5 = Math.min(1, Math.max(0, (currentScrollProgress - 0.65) / 0.23))
      leftPanel.position.x = -1.3 - (1 - p5) * 3.0
      rightPanel.position.x = 1.3 + (1 - p5) * 3.0
      frontBezel.position.z = 0.9 + (1 - p5) * 4.0

      // Stage 6: Network Rings & Cloud System Complete (0.85 -> 1.00)
      const p6 = Math.min(1, Math.max(0, (currentScrollProgress - 0.85) / 0.15))
      networkRing1.scale.setScalar(0.2 + p6 * 0.8)
      networkRing2.scale.setScalar(0.2 + p6 * 0.8)
      networkRing1.rotation.z += 0.015
      networkRing2.rotation.x -= 0.02
      networkGroup.visible = p6 > 0.05

      // LED Blinking when assembled
      if (p5 > 0.8) {
        ledsGroup.children.forEach((led, idx) => {
          if (led instanceof THREE.Mesh) {
            led.visible = Math.sin(time * 5 + idx) > -0.2
          }
        })
      }

      // Core point light pulse
      coreLight.position.copy(serverGroup.position)
      coreLight.intensity = 2.0 + Math.sin(time * 3) * 1.5 + p6 * 2.0

      // Floating dust rotation
      particleSystem.rotation.y = time * 0.02

      renderer.render(scene, camera)
    }

    animate()

    // Cleanup
    return () => {
      cancelAnimationFrame(reqId)
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("resize", handleResize)
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-85"
      aria-hidden="true"
    />
  )
}
