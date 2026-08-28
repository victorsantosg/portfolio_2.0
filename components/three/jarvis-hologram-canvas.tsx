"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

interface JarvisHologramCanvasProps {
  isSpinComplete?: boolean
  isActivating?: boolean
}

export function JarvisHologramCanvas({ isSpinComplete, isActivating }: JarvisHologramCanvasProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const isActivatingRef = useRef(isActivating)
  isActivatingRef.current = isActivating

  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    const width = container.clientWidth || window.innerWidth
    const height = container.clientHeight || window.innerHeight

    const isMobile = width < 768 || width < height
    const camZ = isMobile ? 24 : 16

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
    camera.position.set(0, 0, camZ)

    // 2. RENDERER
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.4
    container.appendChild(renderer.domElement)

    // 3. LIGHTING (Neon Amber & Cyan Rim)
    const ambientLight = new THREE.AmbientLight(0xffeedd, 0.7)
    scene.add(ambientLight)

    const coreLight = new THREE.PointLight(0xf59e0b, 6, 28)
    scene.add(coreLight)

    const blueRimLight = new THREE.PointLight(0x00e5ff, 3.5, 22)
    blueRimLight.position.set(-9, 7, -6)
    scene.add(blueRimLight)

    // 4. HOLOGRAM MASTER GROUP
    const holoGroup = new THREE.Group()
    scene.add(holoGroup)

    // A. 3D PARTICLE SPHERE (Neural Network Nodes)
    const particleCount = 750
    const sphereRadius = 5.2
    const particleGeo = new THREE.BufferGeometry()
    const particlePos = new Float32Array(particleCount * 3)
    const particleVels: { x: number; y: number; z: number }[] = []

    for (let i = 0; i < particleCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / particleCount)
      const theta = Math.sqrt(particleCount * Math.PI) * phi

      const px = sphereRadius * Math.cos(theta) * Math.sin(phi)
      const py = sphereRadius * Math.sin(theta) * Math.sin(phi)
      const pz = sphereRadius * Math.cos(phi)

      particlePos[i * 3] = px
      particlePos[i * 3 + 1] = py
      particlePos[i * 3 + 2] = pz

      // Expansion vector on activation
      particleVels.push({
        x: px * (0.8 + Math.random() * 0.5),
        y: py * (0.8 + Math.random() * 0.5),
        z: pz * (0.8 + Math.random() * 0.5),
      })
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePos, 3))
    const particleMat = new THREE.PointsMaterial({
      color: 0xf59e0b,
      size: 0.13,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
    })
    const particleSphere = new THREE.Points(particleGeo, particleMat)
    holoGroup.add(particleSphere)

    // B. 3D WIREFRAME ICOSAHEDRON (J.A.R.V.I.S. Geodesic Grid)
    const icoGeo = new THREE.IcosahedronGeometry(4.8, 2)
    const icoMat = new THREE.MeshBasicMaterial({
      color: 0xd97706,
      wireframe: true,
      transparent: true,
      opacity: 0.28,
      blending: THREE.AdditiveBlending,
    })
    const icoMesh = new THREE.Mesh(icoGeo, icoMat)
    holoGroup.add(icoMesh)

    // C. 3D CONCENTRIC ORBITAL RINGS & RADAR TICKS
    const ringMaterials = [
      new THREE.MeshBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending }),
      new THREE.MeshBasicMaterial({ color: 0xea580c, transparent: true, opacity: 0.65, blending: THREE.AdditiveBlending }),
      new THREE.MeshBasicMaterial({ color: 0xfbbf24, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending }),
    ]

    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(6.2, 0.035, 16, 100), ringMaterials[0])
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(5.6, 0.025, 16, 100), ringMaterials[1])
    const ring3 = new THREE.Mesh(new THREE.TorusGeometry(6.8, 0.03, 16, 100), ringMaterials[2])

    ring1.rotation.x = Math.PI / 3
    ring2.rotation.y = Math.PI / 4
    ring3.rotation.z = Math.PI / 6

    holoGroup.add(ring1)
    holoGroup.add(ring2)
    holoGroup.add(ring3)

    // Radar tick markers on Ring 1
    const tickGroup = new THREE.Group()
    for (let i = 0; i < 24; i++) {
      const angle = (i / 24) * Math.PI * 2
      const tickGeo = new THREE.BoxGeometry(0.12, 0.04, 0.04)
      const tickMat = new THREE.MeshBasicMaterial({ color: 0xffaa00, transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending })
      const tick = new THREE.Mesh(tickGeo, tickMat)
      tick.position.set(Math.cos(angle) * 6.2, Math.sin(angle) * 6.2, 0)
      tick.rotation.z = angle
      tickGroup.add(tick)
    }
    ring1.add(tickGroup)

    // D. 3D DYNAMIC AUDIO WAVEFORM EQUATORIAL RING
    const wavePointsCount = 200
    const waveGeo = new THREE.BufferGeometry()
    const wavePos = new Float32Array(wavePointsCount * 3)
    waveGeo.setAttribute("position", new THREE.BufferAttribute(wavePos, 3))
    const waveMat = new THREE.LineBasicMaterial({
      color: 0xffaa00,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
    })
    const waveLine = new THREE.LineLoop(waveGeo, waveMat)
    holoGroup.add(waveLine)

    // E. 3D VERTICAL SCANLINE BEAM
    const scanGeo = new THREE.RingGeometry(0.1, 5.8, 48)
    const scanMat = new THREE.MeshBasicMaterial({
      color: 0x00d4ff,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    })
    const scanBeam = new THREE.Mesh(scanGeo, scanMat)
    scanBeam.rotation.x = Math.PI / 2
    holoGroup.add(scanBeam)

    // F. 3D AMBIENT STARFIELD
    const starCount = 350
    const starGeo = new THREE.BufferGeometry()
    const starPos = new Float32Array(starCount * 3)
    for (let i = 0; i < starCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 40
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 40
      starPos[i * 3 + 2] = (Math.random() - 0.5) * 30
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3))
    const starMat = new THREE.PointsMaterial({
      color: 0xf59e0b,
      size: 0.08,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    })
    const stars = new THREE.Points(starGeo, starMat)
    scene.add(stars)

    // 5. MOUSE PARALLAX TRACKING
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 }
    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1
      mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener("mousemove", handleMouseMove)

    // 6. ANIMATION LOOP WITH SMOOTH LERP
    let animationFrameId: number
    const clock = new THREE.Clock()
    let activationProgress = 0

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)

      const time = clock.getElapsedTime()

      // Smooth mouse lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.06
      mouse.y += (mouse.targetY - mouse.y) * 0.06

      // Hologram Group Rotations
      holoGroup.rotation.y = time * 0.28 + mouse.x * 0.5
      holoGroup.rotation.x = Math.sin(time * 0.25) * 0.12 - mouse.y * 0.35

      // Independent Orbital Ring Rotations
      ring1.rotation.z = time * 0.45
      ring1.rotation.y = time * 0.3
      ring2.rotation.x = time * 0.38
      ring2.rotation.z = -time * 0.28
      ring3.rotation.y = -time * 0.42

      // Vertical Scanline Oscillation
      scanBeam.position.y = Math.sin(time * 2.8) * 4.6

      // Particle Sphere Pulsing
      const scalePulse = 1.0 + Math.sin(time * 3.5) * 0.035
      particleSphere.scale.setScalar(scalePulse)
      icoMesh.scale.setScalar(scalePulse * 0.98)

      // Audio Waveform Oscillation
      const waveArray = waveGeo.attributes.position.array as Float32Array
      const waveRadius = 5.0
      for (let i = 0; i < wavePointsCount; i++) {
        const angle = (i / wavePointsCount) * Math.PI * 2
        const freq1 = Math.sin(angle * 8 + time * 6) * 0.35
        const freq2 = Math.cos(angle * 14 - time * 8) * 0.2
        const r = waveRadius + freq1 + freq2

        waveArray[i * 3] = Math.cos(angle) * r
        waveArray[i * 3 + 1] = Math.sin(angle) * r
        waveArray[i * 3 + 2] = Math.sin(angle * 4 + time * 4) * 0.5
      }
      waveGeo.attributes.position.needsUpdate = true

      // Core Light Modulation
      coreLight.intensity = 5 + Math.sin(time * 6) * 2.5
      coreLight.position.x = mouse.x * 4
      coreLight.position.y = mouse.y * 3

      // Smooth Activation Dissolution (Zero Lag / GPU Lerp)
      if (isActivatingRef.current) {
        activationProgress += 0.035

        // Expand particles outwards seamlessly
        const pArray = particleGeo.attributes.position.array as Float32Array
        for (let i = 0; i < particleCount; i++) {
          pArray[i * 3] += particleVels[i].x * 0.02
          pArray[i * 3 + 1] += particleVels[i].y * 0.02
          pArray[i * 3 + 2] += particleVels[i].z * 0.02
        }
        particleGeo.attributes.position.needsUpdate = true

        // Smoothly fade opacities
        particleMat.opacity = Math.max(0, 0.9 * (1 - activationProgress))
        icoMat.opacity = Math.max(0, 0.28 * (1 - activationProgress))
        ringMaterials.forEach((m) => {
          m.opacity = Math.max(0, m.opacity * 0.94)
        })
        waveMat.opacity = Math.max(0, 0.9 * (1 - activationProgress))
        scanMat.opacity = Math.max(0, 0.35 * (1 - activationProgress))
      }

      renderer.render(scene, camera)
    }

    animate()

    // 7. RESIZE HANDLER
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
  }, [])

  return <div ref={mountRef} className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden" />
}
