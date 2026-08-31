"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

interface JarvisTourHologramProps {
  stepId: string
  className?: string
}

export function JarvisTourHologram({ stepId, className = "" }: JarvisTourHologramProps) {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mountRef.current) return

    const container = mountRef.current
    const width = container.clientWidth || 160
    const height = container.clientHeight || 160

    // Scene, Camera, Renderer
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
    camera.position.set(0, 0, 5)

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    // Ambient & Point Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
    scene.add(ambientLight)

    const cyanPointLight = new THREE.PointLight(0x38bdf8, 3, 10)
    cyanPointLight.position.set(2, 3, 4)
    scene.add(cyanPointLight)

    const amberPointLight = new THREE.PointLight(0xf59e0b, 3, 10)
    amberPointLight.position.set(-2, -2, 3)
    scene.add(amberPointLight)

    // Main Group for Hologram Content
    const holoGroup = new THREE.Group()
    scene.add(holoGroup)

    // Holographic Base Ring
    const baseRingGeo = new THREE.RingGeometry(1.6, 1.8, 32)
    const baseRingMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35,
      wireframe: true,
    })
    const baseRing = new THREE.Mesh(baseRingGeo, baseRingMat)
    baseRing.rotation.x = Math.PI / 2
    baseRing.position.y = -1.4
    scene.add(baseRing)

    // Holographic Scanlines / Grid Particles
    const particlesCount = 80
    const particlePositions = new Float32Array(particlesCount * 3)
    for (let i = 0; i < particlesCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 3
      particlePositions[i + 1] = (Math.random() - 0.5) * 2.5
      particlePositions[i + 2] = (Math.random() - 0.5) * 3
    }
    const particlesGeo = new THREE.BufferGeometry()
    particlesGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3))
    const particlesMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.04,
      transparent: true,
      opacity: 0.6,
    })
    const holoParticles = new THREE.Points(particlesGeo, particlesMat)
    scene.add(holoParticles)

    // Distinct 3D Models for Each Step
    let updateAnimation: (time: number) => void = () => {}

    if (stepId === "hero") {
      // 1. Arc Reactor / Mark Core (Rotating Concentric Rings & Glowing Core)
      const coreGeo = new THREE.SphereGeometry(0.5, 16, 16)
      const coreMat = new THREE.MeshStandardMaterial({
        color: 0x0284c7,
        emissive: 0x38bdf8,
        emissiveIntensity: 0.8,
        wireframe: true,
      })
      const core = new THREE.Mesh(coreGeo, coreMat)
      holoGroup.add(core)

      const ring1Geo = new THREE.TorusGeometry(1.0, 0.04, 16, 32)
      const ring1Mat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, wireframe: true })
      const ring1 = new THREE.Mesh(ring1Geo, ring1Mat)
      holoGroup.add(ring1)

      const ring2Geo = new THREE.TorusGeometry(1.3, 0.03, 16, 32)
      const ring2Mat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, wireframe: true })
      const ring2 = new THREE.Mesh(ring2Geo, ring2Mat)
      holoGroup.add(ring2)

      updateAnimation = (time) => {
        ring1.rotation.x = time * 1.5
        ring1.rotation.y = time * 1.2
        ring2.rotation.y = -time * 1.4
        ring2.rotation.z = time * 0.8
        core.rotation.y = time * 0.5
        const pulse = 1 + Math.sin(time * 6) * 0.1
        core.scale.set(pulse, pulse, pulse)
      }
    } else if (stepId === "about") {
      // 2. Academic Crest & Engineering Milestone Shield
      const shieldGeo = new THREE.OctahedronGeometry(1.1, 1)
      const shieldMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        emissive: 0xd97706,
        emissiveIntensity: 0.5,
        wireframe: true,
      })
      const shield = new THREE.Mesh(shieldGeo, shieldMat)
      holoGroup.add(shield)

      const orbitNodeGeo = new THREE.IcosahedronGeometry(0.2, 0)
      const orbitNodeMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, wireframe: true })
      const node1 = new THREE.Mesh(orbitNodeGeo, orbitNodeMat)
      const node2 = new THREE.Mesh(orbitNodeGeo, orbitNodeMat)
      holoGroup.add(node1, node2)

      updateAnimation = (time) => {
        shield.rotation.y = time * 0.8
        shield.rotation.x = Math.sin(time * 0.5) * 0.2
        node1.position.set(Math.cos(time * 2) * 1.5, Math.sin(time * 2) * 0.5, Math.sin(time * 2) * 1.5)
        node2.position.set(Math.cos(time * 2 + Math.PI) * 1.5, Math.sin(time * 2 + Math.PI) * 0.5, Math.sin(time * 2 + Math.PI) * 1.5)
      }
    } else if (stepId === "maker_lab") {
      // 3. Mini Warehouse Racks with Scanning Laser Line
      const rackGroup = new THREE.Group()
      const boxMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, wireframe: true })
      
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          const boxGeo = new THREE.BoxGeometry(0.35, 0.25, 0.35)
          const box = new THREE.Mesh(boxGeo, boxMat)
          box.position.set((c - 1) * 0.55, (r - 1) * 0.45, 0)
          rackGroup.add(box)
        }
      }
      holoGroup.add(rackGroup)

      // Laser Scanner Line
      const laserGeo = new THREE.PlaneGeometry(1.8, 0.03)
      const laserMat = new THREE.MeshBasicMaterial({ color: 0xef4444, side: THREE.DoubleSide })
      const laser = new THREE.Mesh(laserGeo, laserMat)
      holoGroup.add(laser)

      updateAnimation = (time) => {
        rackGroup.rotation.y = time * 0.7
        laser.position.y = Math.sin(time * 3) * 0.7
        laser.rotation.y = rackGroup.rotation.y
      }
    } else if (stepId === "projects") {
      // 4. Quantum Neural Hypercube (Tesseract IA)
      const outerGeo = new THREE.BoxGeometry(1.3, 1.3, 1.3)
      const outerMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, wireframe: true })
      const outerCube = new THREE.Mesh(outerGeo, outerMat)
      holoGroup.add(outerCube)

      const innerGeo = new THREE.BoxGeometry(0.7, 0.7, 0.7)
      const innerMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        emissive: 0xd97706,
        emissiveIntensity: 0.6,
        wireframe: true,
      })
      const innerCube = new THREE.Mesh(innerGeo, innerMat)
      holoGroup.add(innerCube)

      updateAnimation = (time) => {
        outerCube.rotation.x = time * 0.9
        outerCube.rotation.y = time * 1.1
        innerCube.rotation.x = -time * 1.3
        innerCube.rotation.z = time * 1.2
      }
    } else if (stepId === "quote") {
      // 5. Stark 3D Coffee Mug with Rising Holographic Steam Particles!
      const mugGroup = new THREE.Group()

      // Mug Cylinder
      const mugGeo = new THREE.CylinderGeometry(0.55, 0.45, 0.9, 24, 1, true)
      const mugMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        emissive: 0xd97706,
        emissiveIntensity: 0.3,
        wireframe: true,
      })
      const mug = new THREE.Mesh(mugGeo, mugMat)
      mugGroup.add(mug)

      // Mug Handle
      const handleGeo = new THREE.TorusGeometry(0.3, 0.05, 8, 16, Math.PI)
      const handleMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, wireframe: true })
      const handle = new THREE.Mesh(handleGeo, handleMat)
      handle.position.set(0.55, 0, 0)
      handle.rotation.z = -Math.PI / 2
      mugGroup.add(handle)

      holoGroup.add(mugGroup)

      // Steam Particle System
      const steamCount = 30
      const steamGeo = new THREE.BufferGeometry()
      const steamPositions = new Float32Array(steamCount * 3)
      for (let s = 0; s < steamCount; s++) {
        steamPositions[s * 3] = (Math.random() - 0.5) * 0.3
        steamPositions[s * 3 + 1] = 0.5 + Math.random() * 0.8
        steamPositions[s * 3 + 2] = (Math.random() - 0.5) * 0.3
      }
      steamGeo.setAttribute("position", new THREE.BufferAttribute(steamPositions, 3))
      const steamMat = new THREE.PointsMaterial({
        color: 0x38bdf8,
        size: 0.05,
        transparent: true,
        opacity: 0.8,
      })
      const steamParticles = new THREE.Points(steamGeo, steamMat)
      holoGroup.add(steamParticles)

      updateAnimation = (time) => {
        mugGroup.rotation.y = time * 0.8
        const positions = steamGeo.attributes.position.array as Float32Array
        for (let s = 0; s < steamCount; s++) {
          positions[s * 3 + 1] += 0.01
          if (positions[s * 3 + 1] > 1.4) {
            positions[s * 3 + 1] = 0.5
          }
        }
        steamGeo.attributes.position.needsUpdate = true
      }
    }

    // Animation Loop
    let animationFrameId: number
    const clock = new THREE.Clock()

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)
      const elapsedTime = clock.getElapsedTime()

      holoGroup.position.y = Math.sin(elapsedTime * 2) * 0.08
      baseRing.rotation.z = elapsedTime * 0.4
      holoParticles.rotation.y = elapsedTime * 0.2

      updateAnimation(elapsedTime)
      renderer.render(scene, camera)
    }

    animate()

    // Handle Resize
    const handleResize = () => {
      if (!container) return
      const newWidth = container.clientWidth || 160
      const newHeight = container.clientHeight || 160
      camera.aspect = newWidth / newHeight
      camera.updateProjectionMatrix()
      renderer.setSize(newWidth, newHeight)
    }

    window.addEventListener("resize", handleResize)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener("resize", handleResize)
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [stepId])

  return (
    <div
      ref={mountRef}
      className={`relative w-full h-full flex items-center justify-center pointer-events-none select-none ${className}`}
    />
  )
}
