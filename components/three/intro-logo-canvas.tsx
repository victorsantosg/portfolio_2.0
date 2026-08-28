"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

interface IntroLogoCanvasProps {
  onLanded?: () => void
  isActivating?: boolean
}

export function IntroLogoCanvas({ onLanded, isActivating }: IntroLogoCanvasProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const isActivatingRef = useRef(isActivating)
  isActivatingRef.current = isActivating

  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    const width = container.clientWidth || window.innerWidth
    const height = container.clientHeight || window.innerHeight

    // 1. SCENE & CAMERA
    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x030303, 0.025)

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
    camera.position.set(0, 4, 18)

    // 2. RENDERER
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.3
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    container.appendChild(renderer.domElement)

    // 3. LIGHTING (Cinematic Orange & Gold Cyberpunk)
    const ambientLight = new THREE.AmbientLight(0xffeedd, 0.8)
    scene.add(ambientLight)

    const mainLight = new THREE.DirectionalLight(0xffaa44, 3.5)
    mainLight.position.set(10, 20, 15)
    mainLight.castShadow = true
    mainLight.shadow.mapSize.width = 2048
    mainLight.shadow.mapSize.height = 2048
    scene.add(mainLight)

    const rimLight = new THREE.DirectionalLight(0x00d4ff, 2.0)
    rimLight.position.set(-15, 10, -10)
    scene.add(rimLight)

    const pointLight = new THREE.PointLight(0xf59e0b, 5, 25)
    pointLight.position.set(0, 2, 5)
    scene.add(pointLight)

    // 4. REFLECTIVE GROUND & HOLOGRAPHIC GRID
    const groundGeo = new THREE.PlaneGeometry(120, 120)
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x050505,
      roughness: 0.15,
      metalness: 0.85,
    })
    const ground = new THREE.Mesh(groundGeo, groundMat)
    ground.rotation.x = -Math.PI / 2
    ground.position.y = -2.5
    ground.receiveShadow = true
    scene.add(ground)

    const gridHelper = new THREE.GridHelper(100, 50, 0xf59e0b, 0x1f1f1f)
    gridHelper.position.y = -2.48
    scene.add(gridHelper)

    // 5. CONSTRUCT 3D VS LOGO MESHES
    const logoGroup = new THREE.Group()

    // Materials
    const metalDarkMat = new THREE.MeshStandardMaterial({
      color: 0x151515,
      metalness: 0.95,
      roughness: 0.2,
    })

    const goldTrimMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.9,
      roughness: 0.25,
      emissive: 0xd97706,
      emissiveIntensity: 0.3,
    })

    const neonOrangeMat = new THREE.MeshStandardMaterial({
      color: 0xff6600,
      emissive: 0xff7700,
      emissiveIntensity: 2.2,
      roughness: 0.1,
      metalness: 0.5,
    })

    // Create 3D "V" Shape
    const vShape = new THREE.Shape()
    vShape.moveTo(-3.2, 2.5)
    vShape.lineTo(-1.6, -1.8)
    vShape.lineTo(-0.2, 0.8)
    vShape.lineTo(-0.8, 0.8)
    vShape.lineTo(-1.6, -0.6)
    vShape.lineTo(-2.6, 2.5)
    vShape.closePath()

    const extrudeSettings = {
      depth: 0.5,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.08,
      bevelThickness: 0.08,
    }

    const vGeo = new THREE.ExtrudeGeometry(vShape, extrudeSettings)
    vGeo.center()
    const vMesh = new THREE.Mesh(vGeo, goldTrimMat)
    vMesh.position.x = -1.6
    vMesh.castShadow = true
    logoGroup.add(vMesh)

    // Neon Core insert for V
    const vNeonGeo = new THREE.ExtrudeGeometry(vShape, { ...extrudeSettings, depth: 0.2 })
    vNeonGeo.center()
    const vNeonMesh = new THREE.Mesh(vNeonGeo, neonOrangeMat)
    vNeonMesh.position.set(-1.6, 0, 0.28)
    logoGroup.add(vNeonMesh)

    // Create 3D "S" Shape
    const sGroup = new THREE.Group()
    const sSegments = [
      // Top bar
      { x: 1.8, y: 1.8, w: 2.4, h: 0.6, d: 0.5 },
      // Top-left bar
      { x: 0.9, y: 1.0, w: 0.6, h: 1.4, d: 0.5 },
      // Middle bar
      { x: 1.8, y: 0.2, w: 2.4, h: 0.6, d: 0.5 },
      // Bottom-right bar
      { x: 2.7, y: -0.6, w: 0.6, h: 1.4, d: 0.5 },
      // Bottom bar
      { x: 1.8, y: -1.4, w: 2.4, h: 0.6, d: 0.5 },
    ]

    sSegments.forEach((seg) => {
      const segGeo = new THREE.BoxGeometry(seg.w, seg.h, seg.d)
      const segMesh = new THREE.Mesh(segGeo, goldTrimMat)
      segMesh.position.set(seg.x, seg.y, 0)
      segMesh.castShadow = true
      sGroup.add(segMesh)

      const neonGeo = new THREE.BoxGeometry(seg.w * 0.85, seg.h * 0.5, 0.2)
      const neonMesh = new THREE.Mesh(neonGeo, neonOrangeMat)
      neonMesh.position.set(seg.x, seg.y, 0.28)
      sGroup.add(neonMesh)
    })

    logoGroup.add(sGroup)

    // Central Arc Reactor Core 3D Ring & Orb
    const coreGroup = new THREE.Group()
    const outerRingGeo = new THREE.TorusGeometry(0.7, 0.08, 16, 32)
    const outerRing = new THREE.Mesh(outerRingGeo, goldTrimMat)
    coreGroup.add(outerRing)

    const innerOrbGeo = new THREE.SphereGeometry(0.35, 32, 32)
    const innerOrbMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xffffff,
      emissiveIntensity: 3.5,
      roughness: 0,
      metalness: 0,
    })
    const innerOrb = new THREE.Mesh(innerOrbGeo, innerOrbMat)
    coreGroup.add(innerOrb)

    coreGroup.position.set(0.1, 0.2, 0.25)
    logoGroup.add(coreGroup)

    logoGroup.position.y = 35 // Initial high altitude
    scene.add(logoGroup)

    // 6. GROUND IMPACT SHOCKWAVE RINGS
    const shockwaves: { mesh: THREE.Mesh; maxScale: number; speed: number; active: boolean }[] = []
    for (let i = 0; i < 3; i++) {
      const ringGeo = new THREE.RingGeometry(0.8, 1.2, 48)
      const ringMat = new THREE.MeshBasicMaterial({
        color: i === 0 ? 0xf59e0b : 0xea580c,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0,
      })
      const ringMesh = new THREE.Mesh(ringGeo, ringMat)
      ringMesh.rotation.x = -Math.PI / 2
      ringMesh.position.y = -2.4
      scene.add(ringMesh)
      shockwaves.push({ mesh: ringMesh, maxScale: 14 + i * 4, speed: 18 + i * 5, active: false })
    }

    // 7. 3D IMPACT PARTICLES SYSTEM (150 Sparks)
    const sparkCount = 140
    const sparkGeo = new THREE.BufferGeometry()
    const sparkPos = new Float32Array(sparkCount * 3)
    const sparkVels: { x: number; y: number; z: number }[] = []

    for (let i = 0; i < sparkCount; i++) {
      sparkPos[i * 3] = 0
      sparkPos[i * 3 + 1] = -2.3
      sparkPos[i * 3 + 2] = 0

      const angle = Math.random() * Math.PI * 2
      const speed = 4 + Math.random() * 12
      sparkVels.push({
        x: Math.cos(angle) * speed,
        y: 3 + Math.random() * 8,
        z: Math.sin(angle) * speed,
      })
    }

    sparkGeo.setAttribute("position", new THREE.BufferAttribute(sparkPos, 3))
    const sparkMat = new THREE.PointsMaterial({
      color: 0xffaa00,
      size: 0.2,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    })
    const sparkPoints = new THREE.Points(sparkGeo, sparkMat)
    scene.add(sparkPoints)

    // 8. MOUSE PARALLAX TRACKING
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 }
    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1
      mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener("mousemove", handleMouseMove)

    // 9. ANIMATION LOOP WITH GRAVITY SLAM & CAMERA SHAKE
    let startTime = performance.now()
    let landedTriggered = false
    let shakeIntensity = 0

    const triggerImpact = () => {
      if (landedTriggered) return
      landedTriggered = true
      shakeIntensity = 0.65
      sparkMat.opacity = 1.0

      shockwaves.forEach((sw) => {
        sw.active = true
        sw.mesh.scale.set(0.1, 0.1, 0.1)
        ;(sw.mesh.material as THREE.MeshBasicMaterial).opacity = 0.9
      })

      if (onLanded) onLanded()
    }

    let animationFrameId: number

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)

      const elapsed = (performance.now() - startTime) / 1000

      // A. HERO LANDING DROP PHYSICS (0 to 0.75s)
      if (elapsed < 0.75) {
        const progress = elapsed / 0.75
        // Quadratic gravity acceleration drop
        const fallEase = progress * progress
        logoGroup.position.y = 35 - fallEase * 35
        logoGroup.rotation.x = (1 - progress) * 1.5
        logoGroup.rotation.z = (1 - progress) * 0.8
        logoGroup.scale.setScalar(2.5 - progress * 1.5)
      } else if (!landedTriggered) {
        logoGroup.position.y = 0
        logoGroup.rotation.set(0, 0, 0)
        logoGroup.scale.setScalar(1.0)
        triggerImpact()
      }

      // B. CAMERA SHAKE POST IMPACT
      if (shakeIntensity > 0.005) {
        camera.position.x = (Math.random() - 0.5) * shakeIntensity * 2.5
        camera.position.y = 4 + (Math.random() - 0.5) * shakeIntensity * 2.5
        shakeIntensity *= 0.91 // Decay shake
      } else {
        // Smooth mouse parallax after impact
        mouse.x += (mouse.targetX - mouse.x) * 0.05
        mouse.y += (mouse.targetY - mouse.y) * 0.05
        camera.position.x = mouse.x * 2.5
        camera.position.y = 4 + mouse.y * 1.5
        camera.lookAt(0, 0.5, 0)
      }

      // C. INTERACTIVE FLOATING POSE (After Landing)
      if (landedTriggered) {
        const t = elapsed - 0.75
        logoGroup.position.y = Math.sin(t * 2.2) * 0.2
        logoGroup.rotation.y = mouse.x * 0.4
        logoGroup.rotation.x = -mouse.y * 0.3

        // Pulse Arc Reactor Core
        const pulse = 1.0 + Math.sin(t * 5.0) * 0.25
        innerOrb.scale.setScalar(pulse)
        pointLight.intensity = 4 + Math.sin(t * 5.0) * 2.5

        // Move light with mouse
        pointLight.position.x = mouse.x * 6
        pointLight.position.y = 2 + mouse.y * 4
      }

      // D. UPDATE SHOCKWAVE RINGS
      shockwaves.forEach((sw) => {
        if (sw.active) {
          const currentScale = sw.mesh.scale.x
          const newScale = currentScale + (sw.speed * 0.016)
          sw.mesh.scale.set(newScale, newScale, 1)

          const mat = sw.mesh.material as THREE.MeshBasicMaterial
          mat.opacity = Math.max(0, 0.9 * (1 - newScale / sw.maxScale))

          if (newScale >= sw.maxScale) {
            sw.active = false
          }
        }
      })

      // E. UPDATE PARTICLES / SPARKS
      if (landedTriggered && sparkMat.opacity > 0.01) {
        const positions = sparkGeo.attributes.position.array as Float32Array
        for (let i = 0; i < sparkCount; i++) {
          positions[i * 3] += sparkVels[i].x * 0.016
          positions[i * 3 + 1] += sparkVels[i].y * 0.016
          positions[i * 3 + 2] += sparkVels[i].z * 0.016

          sparkVels[i].y -= 9.8 * 0.016 // Gravity

          // Ground bounce
          if (positions[i * 3 + 1] < -2.4) {
            positions[i * 3 + 1] = -2.4
            sparkVels[i].y *= -0.4
          }
        }
        sparkGeo.attributes.position.needsUpdate = true
        sparkMat.opacity *= 0.97
      }

      // F. WARP ZOOM ON ACTIVATION CLICK
      if (isActivatingRef.current) {
        camera.position.z -= 0.6
        logoGroup.rotation.y += 0.12
        pointLight.intensity += 1.5
      }

      renderer.render(scene, camera)
    }

    animate()

    // 10. RESIZE HANDLER
    const handleResize = () => {
      if (!container) return
      const w = container.clientWidth || window.innerWidth
      const h = container.clientHeight || window.innerHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationFrameId)
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [onLanded])

  return <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-0" />
}
