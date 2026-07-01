"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"

export function LoadingScreen() {
  // Impede o scroll enquanto a tela estiver carregando
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = ""
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] bg-[#030303] flex flex-col items-center justify-center p-6"
    >
      <div className="w-full max-w-[600px] flex flex-col justify-center items-center">
        {/* SVG da Logo Animada */}
        <svg
          id="vs-cyber-logo-svg"
          viewBox="0 0 1000 480"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
          style={{ filter: "drop-shadow(0 0 20px rgba(0,0,0,0.85))" }}
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

          {/* Grade de Fundo */}
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
            @keyframes vs-pulse {
              0% {
                filter: drop-shadow(0 0 2px rgba(0, 243, 255, 0.4)) blur(0.2px);
                opacity: 0.8;
              }
              50% {
                filter: drop-shadow(0 0 8px rgba(0, 243, 255, 0.4)) drop-shadow(0 0 15px #00f3ff);
                opacity: 0.9;
              }
              100% {
                filter: drop-shadow(0 0 18px rgba(0, 243, 255, 0.4)) drop-shadow(0 0 35px #00f3ff);
                opacity: 1;
              }
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

        <div className="w-[180px] h-[3px] bg-secondary/20 rounded-full mt-8 overflow-hidden relative border border-border/10">
          <div 
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-accent rounded-full animate-pulse" 
            style={{ animation: "vs-loading-bar 2.5s cubic-bezier(0.4, 0, 0.2, 1) forwards" }}
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
