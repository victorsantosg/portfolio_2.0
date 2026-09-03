import * as THREE from "three"
import { ArchetypeType } from "@/lib/holodeck-data"

export interface ArchetypeSceneResult {
  rootGroup: THREE.Group
  layers: THREE.Group[]
  laserLines: THREE.LineSegments
  animate: (time: number, explosionProgress: number, isSlicerMode: boolean, sliceProgress: number) => void
  dispose: () => void
}

/**
 * Creates connecting laser line segments between layer centers
 */
function createLayerConnectors(layers: THREE.Group[]): THREE.LineSegments {
  const lineMat = new THREE.LineBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending,
  })
  const geom = new THREE.BufferGeometry()
  const positions = new Float32Array(layers.length * 6 * 4) // 4 vertical pillars
  geom.setAttribute("position", new THREE.BufferAttribute(positions, 3))
  return new THREE.LineSegments(geom, lineMat)
}

/**
 * Creates an ultra-crisp, high-definition 3D holographic display card
 * mapped with the project's real screenshot with anisotropic filtering (16x) and toneMapped: false
 */
function createProjectScreenMesh(imageUrl?: string, width = 4.8, height = 2.7): THREE.Group {
  const group = new THREE.Group()

  let screenMat: THREE.Material
  if (imageUrl) {
    const loader = new THREE.TextureLoader()
    const texture = loader.load(imageUrl, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace
      tex.generateMipmaps = false // Critical: Disables downsampled mipmaps so UI text is razor sharp
      tex.minFilter = THREE.LinearFilter // Always samples full 1080p native resolution
      tex.magFilter = THREE.LinearFilter
      tex.anisotropy = 16 // Maximum anisotropic filtering
      tex.needsUpdate = true
    })
    texture.colorSpace = THREE.SRGBColorSpace
    texture.generateMipmaps = false
    texture.minFilter = THREE.LinearFilter
    texture.magFilter = THREE.LinearFilter
    texture.anisotropy = 16

    screenMat = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide,
      toneMapped: false, // Prevents washing out and preserves razor-sharp UI text contrast
    })
  } else {
    screenMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.5,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
    })
  }

  // 1. High-fidelity Screen Plane
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(width, height), screenMat)
  screen.position.set(0, 0, 0.05)

  // 2. Cyber Bezel Frame (Dark Gunmetal with Metallic sheen)
  const bezelGeo = new THREE.BoxGeometry(width + 0.16, height + 0.16, 0.08)
  const bezelMat = new THREE.MeshStandardMaterial({
    color: 0x070a12,
    metalness: 0.9,
    roughness: 0.2,
    emissive: 0x0284c7,
    emissiveIntensity: 0.2,
  })
  const bezel = new THREE.Mesh(bezelGeo, bezelMat)

  // 3. Glowing Neon Edge Outline
  const edgeGeo = new THREE.EdgesGeometry(new THREE.BoxGeometry(width + 0.16, height + 0.16, 0.08))
  const edgeLines = new THREE.LineSegments(
    edgeGeo,
    new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.85 })
  )

  // 4. Subtle Top Hologram Status Bar
  const bar = new THREE.Mesh(
    new THREE.PlaneGeometry(width, 0.08),
    new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide, transparent: true, opacity: 0.6 })
  )
  bar.position.set(0, height / 2 - 0.04, 0.06)

  // 5. Dual Architectural Bottom Mounting Brackets (connecting screen to the graph below)
  const bracketGeo = new THREE.BoxGeometry(0.2, 0.35, 0.15)
  const bracketMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9, roughness: 0.1 })
  const bLeft = new THREE.Mesh(bracketGeo, bracketMat)
  bLeft.position.set(-width * 0.3, -height / 2 - 0.1, 0)
  const bRight = new THREE.Mesh(bracketGeo, bracketMat)
  bRight.position.set(width * 0.3, -height / 2 - 0.1, 0)

  group.add(bezel, screen, edgeLines, bar, bLeft, bRight)
  return group
}

export function buildArchetypeScene(archetype: ArchetypeType, imageUrl?: string): ArchetypeSceneResult {
  const rootGroup = new THREE.Group()
  const layers: THREE.Group[] = []

  let customAnimate: (time: number, explosion: number, isSlicer: boolean, sliceProg: number) => void = () => {}

  if (archetype === "wms_logistics") {
    // LAYER 0: Floor & Docks
    const l0 = new THREE.Group()
    const floorGeo = new THREE.BoxGeometry(7, 0.2, 5)
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.8,
      metalness: 0.2,
    })
    const floor = new THREE.Mesh(floorGeo, floorMat)
    floor.position.y = -1.2
    l0.add(floor)

    // Dock bays and trucks
    for (let t = -2; t <= 2; t++) {
      const cab = new THREE.Mesh(
        new THREE.BoxGeometry(0.35, 0.28, 0.35),
        new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.4 })
      )
      cab.position.set(t * 1.1, -0.96, -2.1)

      const trailer = new THREE.Mesh(
        new THREE.BoxGeometry(0.35, 0.4, 0.7),
        new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.5 })
      )
      trailer.position.set(t * 1.1, -0.9, -1.5)
      l0.add(cab, trailer)
    }
    layers.push(l0)

    // LAYER 1: Steel Racks
    const l1 = new THREE.Group()
    const rackMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      wireframe: true,
      emissive: 0x0369a1,
      emissiveIntensity: 0.3,
    })
    for (let row = -1; row <= 1; row += 2) {
      for (let col = -3; col <= 3; col++) {
        const frame = new THREE.Mesh(new THREE.BoxGeometry(0.55, 1.4, 0.55), rackMat)
        frame.position.set(col * 0.75, -0.3, row * 0.9)
        l1.add(frame)
      }
    }
    layers.push(l1)

    // LAYER 2: Pallets & Inventory (FEFO Heatmap)
    const l2 = new THREE.Group()
    const palletColors = [0xf59e0b, 0x10b981, 0x38bdf8, 0xe11d48]
    for (let row = -1; row <= 1; row += 2) {
      for (let col = -3; col <= 3; col++) {
        for (let lvl = 0; lvl < 3; lvl++) {
          const color = palletColors[Math.abs(row * 3 + col + lvl) % palletColors.length]
          const box = new THREE.Mesh(
            new THREE.BoxGeometry(0.48, 0.28, 0.48),
            new THREE.MeshStandardMaterial({
              color,
              emissive: color,
              emissiveIntensity: 0.35,
              roughness: 0.5,
            })
          )
          box.position.set(col * 0.75, lvl * 0.4 - 0.7, row * 0.9)
          l2.add(box)
        }
      }
    }
    layers.push(l2)

    // LAYER 3: WMS Production Screen & Telemetry Scanner (Features REAL project image)
    const l3 = new THREE.Group()
    const screenMesh = createProjectScreenMesh(imageUrl, 4.8, 2.7)
    screenMesh.position.set(0, 1.45, 0.1)
    screenMesh.rotation.x = -0.04

    const scanLaser = new THREE.Mesh(
      new THREE.PlaneGeometry(6, 0.05),
      new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8,
      })
    )
    scanLaser.rotation.x = Math.PI / 2
    scanLaser.position.y = 0.2
    l3.add(screenMesh, scanLaser)
    layers.push(l3)

    customAnimate = (time) => {
      screenMesh.position.y = 1.45 + Math.sin(time * 2) * 0.04
      scanLaser.position.z = Math.sin(time * 2) * 1.8
      scanLaser.position.y = 0.2 + Math.sin(time * 3) * 0.2
    }
  } else if (archetype === "cloud_erp") {
    // LAYER 0: PostgreSQL Database Cluster
    const l0 = new THREE.Group()
    for (let c = -1.5; c <= 1.5; c += 1.5) {
      const dbCylinder = new THREE.Mesh(
        new THREE.CylinderGeometry(0.45, 0.45, 0.4, 24),
        new THREE.MeshStandardMaterial({
          color: 0x0284c7,
          metalness: 0.8,
          roughness: 0.2,
          emissive: 0x0369a1,
          emissiveIntensity: 0.4,
        })
      )
      dbCylinder.position.set(c, -1.0, 0)
      l0.add(dbCylinder)
    }
    layers.push(l0)

    // LAYER 1: Redis Cache & In-Memory Bus
    const l1 = new THREE.Group()
    const cachePlate = new THREE.Mesh(
      new THREE.BoxGeometry(4.2, 0.15, 2.0),
      new THREE.MeshStandardMaterial({
        color: 0xef4444,
        emissive: 0xb91c1c,
        emissiveIntensity: 0.5,
        wireframe: true,
      })
    )
    cachePlate.position.y = -0.4
    l1.add(cachePlate)
    layers.push(l1)

    // LAYER 2: Fastify Microservices & Gateway Blades (Architectural Graph Supporting the Screen)
    // Positioned DIRECTLY BELOW the screen to hold it up like pedestals, WITHOUT occluding any text!
    const l2 = new THREE.Group()
    for (let s = -3; s <= 3; s++) {
      const bladeH = 0.75 + Math.sin(Math.abs(s) * 0.7) * 0.2
      const blade = new THREE.Mesh(
        new THREE.BoxGeometry(0.38, bladeH, 0.5),
        new THREE.MeshStandardMaterial({
          color: 0x0f172a,
          emissive: s % 2 === 0 ? 0x10b981 : 0xf59e0b,
          emissiveIntensity: 0.65,
          metalness: 0.8,
          roughness: 0.2,
        })
      )
      // Top of blade reaches y = 0.05, perfectly aligning below the screen at y = 0.1
      blade.position.set(s * 0.65, -0.35 + bladeH / 2, -0.05)
      l2.add(blade)
    }
    layers.push(l2)

    // LAYER 3: Next.js Frontend Dashboard Screen with the ACTUAL ERP Screenshot (Expanded & Sharp)
    const l3 = new THREE.Group()
    const screenMesh = createProjectScreenMesh(imageUrl, 4.8, 2.7)
    screenMesh.position.set(0, 1.48, 0.05)
    screenMesh.rotation.x = -0.04 // Gentle ergonomic angle, avoiding perspective blurring
    l3.add(screenMesh)
    layers.push(l3)

    customAnimate = (time) => {
      l2.children.forEach((blade, i) => {
        blade.position.z = -0.05 + Math.sin(time * 2.5 + i) * 0.04
      })
      screenMesh.position.y = 1.48 + Math.sin(time * 2) * 0.04
    }
  } else if (archetype === "data_analytics") {
    // LAYER 0: Geospatial Data Lake Disk
    const l0 = new THREE.Group()
    const lake = new THREE.Mesh(
      new THREE.CylinderGeometry(2.5, 2.7, 0.2, 32),
      new THREE.MeshStandardMaterial({
        color: 0x0284c7,
        wireframe: true,
        emissive: 0x0369a1,
        emissiveIntensity: 0.3,
      })
    )
    lake.position.y = -1.1
    l0.add(lake)
    layers.push(l0)

    // LAYER 1: 3D Bar Chart Matrix
    const l1 = new THREE.Group()
    const barColors = [0x38bdf8, 0x10b981, 0xf59e0b, 0xec4899]
    for (let x = -2; x <= 2; x++) {
      for (let z = -2; z <= 2; z++) {
        const height = 0.4 + Math.abs(Math.sin(x * 1.2 + z * 1.5)) * 0.7
        const color = barColors[(Math.abs(x + z)) % barColors.length]
        const bar = new THREE.Mesh(
          new THREE.BoxGeometry(0.3, height, 0.3),
          new THREE.MeshStandardMaterial({
            color,
            emissive: color,
            emissiveIntensity: 0.5,
          })
        )
        bar.position.set(x * 0.6, -0.9 + height / 2, z * 0.6)
        l1.add(bar)
      }
    }
    layers.push(l1)

    // LAYER 2: Floating OLAP Cube (Supporting from below)
    const l2 = new THREE.Group()
    const olapCube = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 0.6, 1.2),
      new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        wireframe: true,
        emissive: 0xd97706,
        emissiveIntensity: 0.7,
      })
    )
    olapCube.position.set(0, -0.1, 0)
    l2.add(olapCube)
    layers.push(l2)

    // LAYER 3: BI Dashboard Screen with REAL Project Screenshot
    const l3 = new THREE.Group()
    const screenMesh = createProjectScreenMesh(imageUrl, 4.8, 2.7)
    screenMesh.position.set(0, 1.48, 0.05)
    screenMesh.rotation.x = -0.04
    l3.add(screenMesh)
    layers.push(l3)

    customAnimate = (time) => {
      olapCube.rotation.y = time * 0.8
      screenMesh.position.y = 1.48 + Math.sin(time * 2) * 0.04
    }
  } else if (archetype === "ai_neural") {
    // LAYER 0: Input Feature Nodes
    const l0 = new THREE.Group()
    for (let i = -2; i <= 2; i++) {
      const node = new THREE.Mesh(
        new THREE.SphereGeometry(0.18, 16, 16),
        new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.8 })
      )
      node.position.set(i * 0.7, -1.0, -0.6)
      l0.add(node)
    }
    layers.push(l0)

    // LAYER 1: Hidden Layer 1 Synaptic Matrix
    const l1 = new THREE.Group()
    for (let i = -2.5; i <= 2.5; i++) {
      const node = new THREE.Mesh(
        new THREE.SphereGeometry(0.22, 16, 16),
        new THREE.MeshStandardMaterial({ color: 0x8b5cf6, emissive: 0x6d28d9, emissiveIntensity: 0.8 })
      )
      node.position.set(i * 0.6, -0.5, 0)
      l1.add(node)
    }
    layers.push(l1)

    // LAYER 2: Hidden Layer 2 Activation Matrix
    const l2 = new THREE.Group()
    for (let i = -1.5; i <= 1.5; i++) {
      const node = new THREE.Mesh(
        new THREE.SphereGeometry(0.24, 16, 16),
        new THREE.MeshStandardMaterial({ color: 0xec4899, emissive: 0xbe185d, emissiveIntensity: 0.8 })
      )
      node.position.set(i * 0.7, -0.05, 0)
      l2.add(node)
    }
    layers.push(l2)

    // LAYER 3: AI Model Dashboard Screen with REAL Screenshot
    const l3 = new THREE.Group()
    const screenMesh = createProjectScreenMesh(imageUrl, 4.8, 2.7)
    screenMesh.position.set(0, 1.48, 0.05)
    screenMesh.rotation.x = -0.04
    l3.add(screenMesh)
    layers.push(l3)

    customAnimate = (time) => {
      screenMesh.position.y = 1.48 + Math.sin(time * 2) * 0.04
    }
  } else if (archetype === "robotics_vision") {
    // LAYER 0: Turret Base Pedestal
    const l0 = new THREE.Group()
    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(1.2, 1.5, 0.35, 32),
      new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.3 })
    )
    base.position.y = -1.1
    l0.add(base)
    layers.push(l0)

    // LAYER 1: Dual Articulated Arm
    const l1 = new THREE.Group()
    const arm1 = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 0.8, 0.3),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.4 })
    )
    arm1.position.set(0, -0.6, 0)
    l1.add(arm1)
    layers.push(l1)

    // LAYER 2: Optical Camera & Laser Turret (Under the screen)
    const l2 = new THREE.Group()
    const cameraBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.6, 0.4, 0.6),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9 })
    )
    cameraBody.position.set(0, -0.1, 0)
    l2.add(cameraBody)
    layers.push(l2)

    // LAYER 3: Computer Vision Screen with REAL Screenshot
    const l3 = new THREE.Group()
    const screenMesh = createProjectScreenMesh(imageUrl, 4.8, 2.7)
    screenMesh.position.set(0, 1.48, 0.05)
    screenMesh.rotation.x = -0.04
    l3.add(screenMesh)
    layers.push(l3)

    customAnimate = (time) => {
      screenMesh.position.y = 1.48 + Math.sin(time * 2) * 0.04
    }
  } else if (archetype === "audio_hardware") {
    // LAYER 0: Aluminum Chassis
    const l0 = new THREE.Group()
    const chassis = new THREE.Mesh(
      new THREE.BoxGeometry(3.6, 0.3, 2.6),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.7, roughness: 0.3 })
    )
    chassis.position.y = -1.0
    l0.add(chassis)
    layers.push(l0)

    // LAYER 1: 16-Pad RGB Sequencer Grid
    const l1 = new THREE.Group()
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const pad = new THREE.Mesh(
          new THREE.BoxGeometry(0.4, 0.12, 0.4),
          new THREE.MeshStandardMaterial({
            color: (r + c) % 2 === 0 ? 0xec4899 : 0x38bdf8,
            emissive: (r + c) % 2 === 0 ? 0xbe185d : 0x0284c7,
            emissiveIntensity: 0.6,
          })
        )
        pad.position.set(c * 0.55 - 0.82, -0.5, r * 0.55 - 0.82)
        l1.add(pad)
      }
    }
    layers.push(l1)

    // LAYER 2: Rotary Knobs & Sliders
    const l2 = new THREE.Group()
    for (let k = -2; k <= 2; k++) {
      const knob = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.12, 0.18, 16),
        new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xd97706, emissiveIntensity: 0.5 })
      )
      knob.position.set(k * 0.6, -0.05, 0)
      l2.add(knob)
    }
    layers.push(l2)

    // LAYER 3: Audio Interface Screen with REAL Screenshot
    const l3 = new THREE.Group()
    const screenMesh = createProjectScreenMesh(imageUrl, 4.8, 2.7)
    screenMesh.position.set(0, 1.48, 0.05)
    screenMesh.rotation.x = -0.04
    l3.add(screenMesh)
    layers.push(l3)

    customAnimate = (time) => {
      screenMesh.position.y = 1.48 + Math.sin(time * 2) * 0.04
    }
  } else {
    // b2c_webapp (Default / Dom Barbeiro)
    // LAYER 0: Database Disc
    const l0 = new THREE.Group()
    const db = new THREE.Mesh(
      new THREE.CylinderGeometry(1.6, 1.6, 0.25, 32),
      new THREE.MeshStandardMaterial({ color: 0x0284c7, wireframe: true, emissive: 0x0369a1, emissiveIntensity: 0.3 })
    )
    db.position.y = -1.1
    l0.add(db)
    layers.push(l0)

    // LAYER 1: API / Server Gateway Plate
    const l1 = new THREE.Group()
    const apiPlate = new THREE.Mesh(
      new THREE.BoxGeometry(3.2, 0.15, 2.0),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, wireframe: true, emissive: 0xd97706, emissiveIntensity: 0.4 })
    )
    apiPlate.position.y = -0.5
    l1.add(apiPlate)
    layers.push(l1)

    // LAYER 2: Support Base
    const l2 = new THREE.Group()
    const basePlate = new THREE.Mesh(
      new THREE.BoxGeometry(4.0, 0.2, 0.6),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, emissive: 0x10b981, emissiveIntensity: 0.4 })
    )
    basePlate.position.set(0, -0.05, 0)
    l2.add(basePlate)
    layers.push(l2)

    // LAYER 3: Desktop Browser Frame with REAL Screenshot
    const l3 = new THREE.Group()
    const screenMesh = createProjectScreenMesh(imageUrl, 4.8, 2.7)
    screenMesh.position.set(0, 1.48, 0.05)
    screenMesh.rotation.x = -0.04
    l3.add(screenMesh)
    layers.push(l3)

    customAnimate = (time) => {
      screenMesh.position.y = 1.48 + Math.sin(time * 2) * 0.04
    }
  }

  // Add all layers to rootGroup
  layers.forEach((layer) => {
    rootGroup.add(layer)
  })

  // Laser connectors
  const laserLines = createLayerConnectors(layers)
  rootGroup.add(laserLines)

  // Slicer visual elements: cutting laser ring + nozzle
  const slicerPlane = new THREE.Mesh(
    new THREE.RingGeometry(2.4, 2.48, 48),
    new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9,
    })
  )
  slicerPlane.rotation.x = Math.PI / 2
  slicerPlane.visible = false
  rootGroup.add(slicerPlane)

  const nozzle = new THREE.Mesh(
    new THREE.ConeGeometry(0.1, 0.25, 16),
    new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xd97706, emissiveIntensity: 0.8 })
  )
  nozzle.rotation.x = Math.PI
  nozzle.visible = false
  rootGroup.add(nozzle)

  const animate = (time: number, explosionProgress: number, isSlicerMode: boolean, sliceProgress: number) => {
    // 1. Handle Exploded View separation
    const explosionFactor = explosionProgress / 100

    layers.forEach((layer, index) => {
      const targetY = (index - 1.5) * 0.75 * explosionFactor
      layer.position.y = targetY
    })

    // 2. Update connector lines positions
    if (explosionFactor > 0.05 && !isSlicerMode) {
      laserLines.visible = true
      const posAttr = laserLines.geometry.attributes.position as THREE.BufferAttribute
      let idx = 0
      for (let i = 0; i < layers.length - 1; i++) {
        const y1 = layers[i].position.y
        const y2 = layers[i + 1].position.y
        const corners = [
          [-1.5, -0.8],
          [1.5, -0.8],
          [1.5, 0.8],
          [-1.5, 0.8],
        ]
        for (const [cx, cz] of corners) {
          posAttr.setXYZ(idx++, cx, y1, cz)
          posAttr.setXYZ(idx++, cx, y2, cz)
        }
      }
      posAttr.needsUpdate = true
    } else {
      laserLines.visible = false
    }

    // 3. Handle Slicer Mode
    if (isSlicerMode) {
      slicerPlane.visible = true
      nozzle.visible = true

      const sliceHeight = -1.2 + (sliceProgress / 100) * 2.8
      slicerPlane.position.y = sliceHeight

      const nozzleAngle = time * 4
      const radius = 1.4 + Math.sin(time * 2) * 0.3
      nozzle.position.set(Math.cos(nozzleAngle) * radius, sliceHeight + 0.15, Math.sin(nozzleAngle) * radius)
    } else {
      slicerPlane.visible = false
      nozzle.visible = false
    }

    // 4. Custom layer animations
    customAnimate(time, explosionFactor, isSlicerMode, sliceProgress)
  }

  const dispose = () => {
    rootGroup.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry?.dispose()
        if (Array.isArray(child.material)) {
          child.material.forEach((m) => m.dispose())
        } else if (child.material) {
          child.material.dispose()
        }
      }
    })
  }

  return {
    rootGroup,
    layers,
    laserLines,
    animate,
    dispose,
  }
}
