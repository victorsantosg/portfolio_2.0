"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function LoadingScreen() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const [isSpinComplete, setIsSpinComplete] = useState(false)
  const [showLockFlash, setShowLockFlash] = useState(false)

  // Impede o scroll enquanto a tela estiver carregando
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = ""
    }
  }, [])

  // Timer para conclusão da rotação e disparo do flash de bloqueio
  useEffect(() => {
    const timerSpin = setTimeout(() => {
      setIsSpinComplete(true)
      setShowLockFlash(true)
      setTimeout(() => setShowLockFlash(false), 500)
    }, 2200)

    return () => clearTimeout(timerSpin)
  }, [])

  // Efeito 3D de Parallax ao mover o mouse (ativo após a rotação)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      const { innerWidth, innerHeight } = window
      const x = (e.clientX / innerWidth) * 2 - 1
      const y = (e.clientY / innerHeight) * 2 - 1
      setMousePos({ x, y })
      setIsHovered(true)
    }

    const handleMouseLeave = () => {
      setIsHovered(false)
      setMousePos({ x: 0, y: 0 })
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  // Ângulos de rotação 3D suaves para o mouse parallax após parar
  const mouseRotX = isHovered && isSpinComplete ? -mousePos.y * 14 : 0
  const mouseRotY = isHovered && isSpinComplete ? mousePos.x * 18 : 0

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] bg-[#030303] flex flex-col items-center justify-center p-4 overflow-hidden select-none"
      style={{ perspective: 1200 }}
    >
      {/* Container Principal 3D */}
      <div
        ref={containerRef}
        className="w-full max-w-[95vw] sm:max-w-[600px] flex flex-col justify-center items-center relative"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* EFEITOS VISUAIS AO RODAR (Ativos durante o giro de 0s a 2.2s) */}
        {!isSpinComplete && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {/* Anéis de Choque Expansivos / Energy Shockwaves */}
            <motion.div
              initial={{ scale: 0.2, opacity: 0.9 }}
              animate={{ scale: [0.2, 1.6, 2.4], opacity: [0.8, 0.4, 0] }}
              transition={{ duration: 1.1, repeat: 1, ease: "easeOut" }}
              className="absolute w-72 h-72 rounded-full border border-cyan-400/60 shadow-[0_0_25px_rgba(0,243,255,0.4)]"
            />
            <motion.div
              initial={{ scale: 0.2, opacity: 0.9 }}
              animate={{ scale: [0.2, 1.4, 2.2], opacity: [0.8, 0.3, 0] }}
              transition={{ duration: 1.1, delay: 0.4, repeat: 1, ease: "easeOut" }}
              className="absolute w-60 h-60 rounded-full border border-blue-500/50 shadow-[0_0_20px_rgba(0,85,255,0.4)]"
            />

            {/* Rastros de Luz Orbitais / Spinning Particle Trails */}
            <motion.div
              animate={{ rotate: 720 }}
              transition={{ duration: 2.2, ease: [0.08, 0.82, 0.17, 1] }}
              className="absolute w-80 h-80 rounded-full border-t-2 border-r border-cyan-400/80 filter blur-[0.5px] opacity-70"
            />
            <motion.div
              animate={{ rotate: -1080 }}
              transition={{ duration: 2.2, ease: [0.08, 0.82, 0.17, 1] }}
              className="absolute w-96 h-96 rounded-full border-b-2 border-l border-blue-400/60 filter blur-[1px] opacity-60"
            />

            {/* Faíscas de Energia Ciano que se dispersam no giro */}
            {[0, 60, 120, 180, 240, 300].map((deg, i) => (
              <motion.div
                key={deg}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{
                  x: Math.cos((deg * Math.PI) / 180) * 160,
                  y: Math.sin((deg * Math.PI) / 180) * 160,
                  opacity: [1, 0.8, 0],
                  scale: [1, 1.5, 0.2],
                }}
                transition={{ duration: 1.4, delay: 0.1 * i, ease: "easeOut" }}
                className="absolute w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_10px_#00f3ff]"
              />
            ))}
          </div>
        )}

        {/* Flash de Luz no momento em que trava na posição (2.2s) */}
        <AnimatePresence>
          {showLockFlash && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1.3 }}
              exit={{ opacity: 0, scale: 1.6 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
            >
              <div className="w-80 h-80 rounded-full bg-cyan-400/25 blur-3xl" />
              <div className="w-40 h-40 rounded-full bg-white/40 blur-xl" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* LOGO VS: 3D Spin Inicial Rápido desacelerando suavemente até 0deg */}
        <motion.div
          initial={{
            rotateY: -1440, // Giros rápidos em 3D
            scale: 0.35,
            opacity: 0,
          }}
          animate={
            isSpinComplete
              ? {
                  rotateY: mouseRotY,
                  rotateX: mouseRotX,
                  scale: 1,
                  opacity: 1,
                }
              : {
                  rotateY: 0,
                  scale: 1,
                  opacity: 1,
                }
          }
          transition={
            isSpinComplete
              ? {
                  rotateX: { type: "spring", stiffness: 120, damping: 18 },
                  rotateY: { type: "spring", stiffness: 120, damping: 18 },
                  scale: { duration: 0.3 },
                }
              : {
                  rotateY: { duration: 2.2, ease: [0.08, 0.82, 0.17, 1] },
                  scale: { duration: 2.0, ease: [0.08, 0.82, 0.17, 1] },
                  opacity: { duration: 0.5, ease: "easeOut" },
                }
          }
          className="w-full h-auto relative"
          style={{ transformStyle: "preserve-3d" }}
        >
          <svg
            id="vs-cyber-logo-svg"
            viewBox="0 0 1000 480"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto"
            style={{ 
              filter: "drop-shadow(0 0 20px rgba(0,0,0,0.85))",
            }}
          >
            <defs>
              {/* Filtro de Brilho Neon Cyber */}
              <filter id="vs-cyber-glow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="2.1" result="blur1" />
                <feGaussianBlur stdDeviation="4.2" result="blur2" />
                <feGaussianBlur stdDeviation="7.8" result="blur3" />
                <feMerge>
                  <feMergeNode in="blur3" />
                  <feMergeNode in="blur2" />
                  <feMergeNode in="blur1" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Gradiente Metalizado Cromo para Solder Nodes */}
              <radialGradient id="chrome-node-grad" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="30%" stopColor="#d1f5ff" />
                <stop offset="70%" stopColor="#00f3ff" />
                <stop offset="90%" stopColor="#052c3d" />
                <stop offset="100%" stopColor="#000e14" />
              </radialGradient>

              {/* Gradiente de Cobre/Ouro para Detalhes Solder */}
              <radialGradient id="gold-node-grad" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="45%" stopColor="#ffd280" />
                <stop offset="75%" stopColor="#e69d24" />
                <stop offset="100%" stopColor="#593600" />
              </radialGradient>

              {/* Gradiente para Trilha de Circuito */}
              <linearGradient id="vs-circuit-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00f3ff" />
                <stop offset="100%" stopColor="#0055ff" />
              </linearGradient>
            </defs>

            {/* Grade de Fundo Original */}
            <g opacity="0.12" stroke="#00f3ff" strokeWidth="0.5">
              <line x1="100" y1="0" x2="100" y2="480" strokeDasharray="5,5" />
              <line x1="200" y1="0" x2="200" y2="480" strokeDasharray="5,5" />
              <line x1="300" y1="0" x2="300" y2="480" strokeDasharray="5,5" />
              <line x1="400" y1="0" x2="400" y2="480" strokeDasharray="5,5" />
              <line x1="500" y1="0" x2="500" y2="480" strokeDasharray="5,5" />
              <line x1="600" y1="0" x2="600" y2="480" strokeDasharray="5,5" />
              <line x1="700" y1="0" x2="700" y2="480" strokeDasharray="5,5" />
              <line x1="800" y1="0" x2="800" y2="480" strokeDasharray="5,5" />
              <line x1="900" y1="0" x2="900" y2="480" strokeDasharray="5,5" />
              <line x1="0" y1="80" x2="1000" y2="80" strokeDasharray="5,5" />
              <line x1="0" y1="160" x2="1000" y2="160" strokeDasharray="5,5" />
              <line x1="0" y1="240" x2="1000" y2="240" strokeDasharray="5,5" />
              <line x1="0" y1="320" x2="1000" y2="320" strokeDasharray="5,5" />
              <line x1="0" y1="400" x2="1000" y2="400" strokeDasharray="5,5" />
            </g>

            {/* Letra V */}
            <g filter="url(#vs-cyber-glow)">
              {/* Contorno Neon V */}
              <path d="M 370 115 L 285 115 L 420 395 L 435 395 L 485 295" stroke="#00f3ff" strokeWidth="9.0" strokeLinecap="square" strokeLinejoin="miter" opacity="0.85" />
              <path d="M 445 420 L 490 330" stroke="#0055ff" strokeWidth="4.5" strokeLinecap="round" opacity="0.6" />
              
              {/* Linhas de Trilhas de Circuito do V */}
              <path d="M 345 145 L 345 180 L 415 320" stroke="url(#vs-circuit-grad)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M 390 145 L 445 255" stroke="#00f3ff" strokeWidth="3.3" strokeLinecap="round" opacity="0.75" />
              
              {/* Miolo Branco Super Brilhante */}
              <path d="M 368 115 L 287 115 L 420 395 L 433 395 L 482 295" stroke="#ffffff" strokeWidth="2.0" strokeLinecap="square" opacity="0.95" />
            </g>

            {/* Animação do Pulso Elétrico do V */}
            <g filter="url(#vs-cyber-glow)">
              <path d="M 345 145 L 345 180 L 415 320" stroke="#ffffff" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="30 150" style={{ animation: "vs-dash 1.0714285714285714s linear infinite" }} />
              <path d="M 370 115 L 285 115 L 420 395" stroke="#00f3ff" strokeWidth="6.0" strokeLinecap="square" strokeDasharray="40 220" style={{ animation: "vs-dash 1.0714285714285714s linear infinite", animationDelay: "-0.7s" }} />
            </g>

            {/* Letra S */}
            <g filter="url(#vs-cyber-glow)">
              {/* Contorno Neon S */}
              <path d="M 520 115 L 725 115 A 25 25 0 0 1 750 140 L 750 142 A 25 25 0 0 1 725 167 L 550 167 A 35 35 0 0 0 515 202 L 515 210 A 35 35 0 0 0 550 245 L 655 245 A 45 45 0 0 1 700 290 L 700 310 A 45 45 0 0 1 655 355 L 490 355" stroke="#0055ff" strokeWidth="9.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.85" />
              <path d="M 535 245 L 655 245 A 45 45 0 0 1 700 290 L 700 310 A 45 45 0 0 1 655 355 L 490 355" stroke="#00f3ff" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />

              {/* Trilhas do Miolo do S */}
              <path d="M 535 141 L 710 141 C 715 141 720 145 720 150 C 720 155 715 159 710 159 L 555 159" stroke="url(#vs-circuit-grad)" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M 505 205 C 505 185 540 193 570 193 L 660 193 A 15 15 0 0 1 675 208 A 15 15 0 0 1 660 223 L 560 223" stroke="#00f3ff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M 545 327 L 650 327 A 15 15 0 0 0 665 312 A 15 15 0 0 0 650 297 L 575 297" stroke="#0055ff" strokeWidth="4.3" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M 535 355 L 650 355 A 15 15 0 0 0 665 340 A 15 15 0 0 0 650 325 L 560 325" stroke="#00f3ff" strokeWidth="3.8" strokeLinecap="round" strokeLinejoin="round" />

              {/* Linha Branca de Núcleo Brilhante */}
              <path d="M 520 115 L 725 115 A 25 25 0 0 1 750 140 L 750 142 A 25 25 0 0 1 725 167 L 550 167 A 35 35 0 0 0 515 202 L 515 210 A 35 35 0 0 0 550 245 L 655 245 A 45 45 0 0 1 700 290 L 700 310 A 45 45 0 0 1 655 355 L 490 355" stroke="#ffffff" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" opacity="0.95" />
            </g>

            {/* Animação do Pulso Elétrico do S */}
            <g filter="url(#vs-cyber-glow)" opacity="0.9">
              <path d="M 520 115 L 725 115 A 25 25 0 0 1 750 140 L 750 142 A 25 25 0 0 1 725 167 L 550 167 A 35 35 0 0 0 515 202 L 515 210 A 35 35 0 0 0 550 245 L 655 245 A 45 45 0 0 1 700 290 L 700 310 A 45 45 0 0 1 655 355 L 490 355" stroke="#ffffff" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="45 190" style={{ animation: "vs-dash 1.0714285714285714s linear infinite", animationDelay: "-0.3s" }} />
              <path d="M 535 141 L 710 141 C 715 141 720 145 720 150 C 720 155 715 159 710 159 L 555 159" stroke="#00f3ff" strokeWidth="5" strokeLinecap="round" strokeDasharray="25 100" style={{ animation: "vs-dash 1.0714285714285714s linear infinite", animationDelay: "-1.1s" }} />
            </g>

            {/* Anéis de Conexão dos Nodes */}
            <g filter="url(#vs-cyber-glow)" opacity="0.85">
              <circle cx="345" cy="180" r="11.0" fill="none" stroke="#00f3ff" strokeWidth="1.5" />
              <circle cx="725" cy="115" r="12.5" fill="none" stroke="#0055ff" strokeWidth="1.8" />
              <circle cx="682" cy="193" r="10.5" fill="none" stroke="#00f3ff" strokeWidth="1.5" />
              <circle cx="560" cy="325" r="11.5" fill="none" stroke="#00f3ff" strokeWidth="1.5" />
              <circle cx="682" cy="297" r="10.0" fill="none" stroke="#0055ff" strokeWidth="1.5" />
            </g>

            {/* Esferas de Solda Metalizadas (Bolinhas do circuito) */}
            <g>
              <circle cx="345" cy="180" r="6.5" fill="url(#chrome-node-grad)" />
              <circle cx="345" cy="180" r="2.0" fill="#ffffff" opacity="0.6" />

              <circle cx="725" cy="115" r="8.0" fill="url(#chrome-node-grad)" />
              <circle cx="725" cy="115" r="2.5" fill="#ffffff" opacity="0.6" />

              <circle cx="682" cy="193" r="6.5" fill="url(#chrome-node-grad)" />
              <circle cx="682" cy="193" r="2.0" fill="#ffffff" opacity="0.6" />

              <circle cx="560" cy="325" r="7.0" fill="url(#gold-node-grad)" />
              <circle cx="560" cy="325" r="2.0" fill="#ffffff" opacity="0.7" />

              <circle cx="682" cy="297" r="6.0" fill="url(#chrome-node-grad)" />
              <circle cx="682" cy="297" r="1.5" fill="#ffffff" opacity="0.6" />
            </g>

            {/* Scanner de Laser Horizontal */}
            <g filter="url(#vs-cyber-glow)">
              <line x1="120" y1="0" x2="880" y2="0" stroke="#00f3ff" strokeWidth="2.5" opacity="0.9" style={{ animation: "vs-scan 1.6071428571428572s cubic-bezier(0.4, 0, 0.2, 1) infinite" }} />
              <line x1="120" y1="0" x2="880" y2="0" stroke="#ffffff" strokeWidth="1.0" opacity="0.95" style={{ animation: "vs-scan 1.6071428571428572s cubic-bezier(0.4, 0, 0.2, 1) infinite" }} />
            </g>

            {/* Estrela de Brilho */}
            <g filter="url(#vs-cyber-glow)" opacity="0.8">
              <path d="M 900 380 Q 900 395 915 395 Q 900 395 900 410 Q 900 395 885 395 Q 900 395 900 380 Z" fill="#00f3ff" style={{ animation: "vs-star 4s ease-in-out infinite" }} />
            </g>

            {/* Folha de Estilos CSS Embutida para a Animação */}
            <style>{`
              @keyframes vs-dash {
                0% { stroke-dashoffset: 240; }
                100% { stroke-dashoffset: 0; }
              }
              @keyframes vs-star {
                0%, 100% {
                  transform: scale(0.8) translate(0, 0);
                  transform-origin: 900px 395px;
                  opacity: 0.4;
                }
                50% {
                  transform: scale(1.2) translate(0, 0);
                  transform-origin: 900px 395px;
                  opacity: 1;
                }
              }
              @keyframes vs-scan {
                0% {
                  transform: translateY(60px);
                  opacity: 0;
                }
                5% {
                  opacity: 0.85;
                }
                90% {
                  opacity: 0.85;
                }
                95%, 100% {
                  transform: translateY(420px);
                  opacity: 0;
                }
              }
            `}</style>
          </svg>
        </motion.div>

        {/* Barra de Carregamento Sincronizada com o Giro */}
        <div className="w-[180px] h-[3px] bg-secondary/20 rounded-full mt-8 overflow-hidden relative border border-border/10">
          <div 
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-accent rounded-full animate-pulse" 
            style={{ animation: "vs-loading-bar 2.2s cubic-bezier(0.08, 0.82, 0.17, 1) forwards" }}
          />
        </div>

        <style>{`
          @keyframes vs-loading-bar {
            0% { width: 0%; }
            100% { width: 100%; }
          }
        `}</style>
      </div>
    </motion.div>
  )
}
