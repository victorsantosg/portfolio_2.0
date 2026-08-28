"use client"

import { useState, useRef } from "react"
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion"
import Image from "next/image"
import {
  ShieldCheck,
  Cpu,
  Zap,
  Activity,
  Award,
  GraduationCap,
  Scan,
  MessageCircle,
  Linkedin,
  Github,
  Mail,
  Download,
  X,
  ExternalLink,
  CheckCircle2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"

export function IdPassCard() {
  const [isScanning, setIsScanning] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  // Motion values for smooth 3D tilt
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springConfig = { damping: 22, stiffness: 180 }
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [14, -14]), springConfig)
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-16, 16]), springConfig)
  const glareX = useTransform(mouseX, [-0.5, 0.5], ["0%", "100%"])
  const glareY = useTransform(mouseY, [-0.5, 0.5], ["0%", "100%"])

  const [scanStatus, setScanStatus] = useState("SCANNING BIOMETRICS...")

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    mouseX.set(x)
    mouseY.set(y)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  const handleCardClick = () => {
    if (isScanning) return
    setIsScanning(true)
    setScanStatus("SCANNING BIOMETRICS...")

    const t1 = setTimeout(() => {
      setScanStatus("VERIFYING CLEARANCE...")
    }, 800)

    const t2 = setTimeout(() => {
      setScanStatus("ACCESS GRANTED ✓")
    }, 1500)

    // Open holographic profile HUD after 2.0s
    const t3 = setTimeout(() => {
      setIsScanning(false)
      setIsModalOpen(true)
    }, 2000)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }

  return (
    <>
      <div className="flex flex-col items-center gap-3 w-full py-4">
        {/* 3D Perspective Wrapper */}
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={handleCardClick}
          className="w-full max-w-[340px] sm:max-w-[360px] h-[480px] cursor-pointer relative select-none group"
          style={{ perspective: 1200 }}
        >
          {/* Lanyard Clip / Top Attachment */}
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center">
            <div className="w-8 h-4 bg-gray-800 rounded-t-md border border-gray-600 shadow-md" />
            <div className="w-12 h-2.5 bg-gradient-to-r from-gray-700 via-gray-500 to-gray-700 rounded-full border border-gray-400 shadow-lg" />
            <div className="w-4 h-3 bg-gray-900 border-x border-b border-primary/50 rounded-b-sm" />
          </div>

          {/* 3D Card Container */}
          <motion.div
            style={{
              rotateX,
              rotateY,
              transformStyle: "preserve-3d",
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full h-full relative rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-primary/40 group-hover:border-primary group-hover:shadow-[0_0_35px_rgba(34,197,94,0.3)] transition-colors duration-300 bg-gradient-to-b from-gray-950 via-slate-900 to-gray-950 overflow-hidden"
          >
            {/* Dynamic Holographic Specular Glare */}
            <motion.div
              className="absolute inset-0 z-20 pointer-events-none opacity-40 mix-blend-overlay transition-opacity duration-300"
              style={{
                background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(0, 243, 255, 0.45) 0%, transparent 60%)`,
              }}
            />

            {/* Laser Biometric Scanner Effect (Slower & Cinematic) */}
            <AnimatePresence>
              {isScanning && (
                <motion.div
                  initial={{ y: -30, opacity: 0 }}
                  animate={{
                    y: [0, 480, 240, 480],
                    opacity: [0.9, 1, 0.95, 1],
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.95, ease: "easeInOut" }}
                  className="absolute inset-x-0 h-2 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_25px_#00f3ff,0_0_50px_rgba(34,197,94,0.6)] z-30 pointer-events-none"
                >
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 py-1 bg-black/95 rounded-full border border-cyan-400 text-[10px] font-mono text-cyan-300 font-bold tracking-wider shadow-[0_0_15px_rgba(0,243,255,0.6)] whitespace-nowrap">
                    {scanStatus}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* CARD CONTENT */}
            <div className="p-5 flex flex-col justify-between h-full relative z-10">
              {/* Header: Security Clearance */}
              <div className="flex items-center justify-between border-b border-primary/30 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-primary animate-pulse" />
                  <span className="text-[11px] font-mono font-bold tracking-wider text-primary">
                    J.A.R.V.I.S. SECURITY ACCESS
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary/20 text-primary border border-primary/40 font-semibold">
                  CLEARANCE LVL 4
                </span>
              </div>

              {/* Middle Section: Photo & Smart Chip */}
              <div className="flex items-center gap-4 my-2">
                {/* Photo with Cyber Border */}
                <div className="relative w-24 h-28 rounded-xl overflow-hidden border-2 border-primary/60 bg-gray-900 shadow-[0_0_15px_rgba(34,197,94,0.3)] shrink-0">
                  <Image
                    src="/img_victor.jpeg"
                    alt="Victor Santos"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full bg-primary border-2 border-black animate-ping" />
                  <div className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full bg-primary border-2 border-black" />
                </div>

                {/* Smart Chip & Details */}
                <div className="flex flex-col gap-2 flex-1">
                  {/* Gold Smart Chip */}
                  <div className="w-11 h-8 rounded-md bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 border border-amber-300 p-1 flex flex-col justify-between shadow-inner relative overflow-hidden">
                    <div className="w-full h-[1px] bg-amber-800/40" />
                    <div className="flex justify-between">
                      <div className="w-3 h-2 rounded-[2px] border border-amber-800/40" />
                      <div className="w-3 h-2 rounded-[2px] border border-amber-800/40" />
                    </div>
                    <div className="w-full h-[1px] bg-amber-800/40" />
                  </div>

                  <div className="space-y-0.5">
                    <div className="text-[10px] font-mono text-muted-foreground">ENGINEER ID</div>
                    <div className="text-xs font-mono font-bold text-foreground">VS-2026-X09</div>
                  </div>

                  <div className="flex items-center gap-1 text-[10px] font-mono text-amber-400 font-semibold">
                    <Zap className="w-3 h-3" />
                    <span>BIOMETRIC ACTIVE</span>
                  </div>
                </div>
              </div>

              {/* Name & Title */}
              <div className="space-y-1 bg-black/40 p-3 rounded-xl border border-white/5">
                <h3 className="text-lg font-extrabold text-foreground tracking-tight group-hover:text-primary transition-colors">
                  Victor Santos
                </h3>
                <p className="text-xs font-mono text-primary font-medium">
                  Full Stack & Automation Engineer
                </p>
              </div>

              {/* Academic Credentials Hologram Seal */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-cyan-950/40 to-emerald-950/40 border border-cyan-500/30 text-xs">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div className="text-[11px] font-mono leading-tight">
                    <div className="text-foreground font-semibold">UNIFOR & INFNET</div>
                    <div className="text-muted-foreground text-[9px]">ADS • Pós Full Stack</div>
                  </div>
                </div>
                <span className="text-[9px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30 font-semibold">
                  VERIFIED
                </span>
              </div>

              {/* Footer Click Action */}
              <div className="flex items-center justify-between pt-2 border-t border-border/40 text-[9px] font-mono">
                <div className="tracking-widest font-mono text-[10px] text-muted-foreground">
                  ||| | |||| | || ||| ||||
                </div>
                <div className="flex items-center gap-1 text-primary font-bold animate-pulse">
                  <Scan className="w-3.5 h-3.5" />
                  <span>CLIQUE P/ ESCANEAR</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Helper text under card */}
        <span className="text-[11px] font-mono text-muted-foreground flex items-center gap-1.5">
          <Activity className="w-3 h-3 text-primary" />
          Passe o mouse para inclinar ou clique para abrir o perfil holográfico
        </span>
      </div>

      {/* ========================================================= */}
      {/* J.A.R.V.I.S. HOLOGRAPHIC PROFILE HUD MODAL */}
      {/* ========================================================= */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent
          className="max-w-2xl bg-gray-950/95 border border-primary/50 text-foreground p-0 overflow-hidden shadow-[0_0_60px_rgba(34,197,94,0.25)] backdrop-blur-2xl"
          showCloseButton={false}
        >
          {/* Header Banner */}
          <div className="flex items-center justify-between p-5 bg-gradient-to-r from-primary/20 via-cyan-500/10 to-transparent border-b border-primary/30">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/20 border border-primary/40 text-primary">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold font-mono text-foreground flex items-center gap-2">
                  <span>J.A.R.V.I.S. IDENTITY VERIFIED</span>
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                </DialogTitle>
                <p className="text-xs font-mono text-primary">
                  CLEARANCE LEVEL 04 • VICTOR DOS SANTOS GONÇALVES PEIXOTO
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsModalOpen(false)}
              className="p-2 rounded-full hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            {/* Academic Credentials Box */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase text-muted-foreground tracking-wider flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-primary" />
                <span>Formação & Certificações Acadêmicas</span>
              </h4>

              <div className="grid sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-gray-900/80 border border-primary/30 space-y-1">
                  <div className="text-xs font-mono text-primary font-bold">GRADUAÇÃO OFICIAL</div>
                  <div className="text-sm font-semibold text-foreground">
                    Análise e Desenvolvimento de Sistemas
                  </div>
                  <div className="text-xs text-muted-foreground">
                    UNIFOR (Universidade de Fortaleza)
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-gray-900/80 border border-cyan-500/30 space-y-1">
                  <div className="text-xs font-mono text-cyan-400 font-bold">PÓS-GRADUAÇÃO</div>
                  <div className="text-sm font-semibold text-foreground">
                    Desenvolvimento Web Full Stack
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Faculdade INFNET (Concluído)
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Action Hub (WhatsApp, LinkedIn, CV, GitHub) */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-mono uppercase text-muted-foreground tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span>Canais de Conexão & Documentação</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* WhatsApp */}
                <Button
                  asChild
                  className="h-12 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center justify-start gap-3 px-4 rounded-xl shadow-lg"
                >
                  <a
                    href="https://wa.me/5585999556385"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="w-5 h-5 text-white shrink-0" />
                    <div className="text-left leading-tight">
                      <div className="text-xs font-bold">Falar no WhatsApp</div>
                      <div className="text-[10px] text-emerald-100 font-normal">
                        (85) 99955-6385
                      </div>
                    </div>
                  </a>
                </Button>

                {/* LinkedIn */}
                <Button
                  asChild
                  className="h-12 bg-[#0A66C2] hover:bg-[#004182] text-white font-semibold flex items-center justify-start gap-3 px-4 rounded-xl shadow-lg"
                >
                  <a
                    href="https://www.linkedin.com/in/victor-santos-0a86021b7/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Linkedin className="w-5 h-5 text-white shrink-0" />
                    <div className="text-left leading-tight">
                      <div className="text-xs font-bold">Conectar no LinkedIn</div>
                      <div className="text-[10px] text-blue-100 font-normal">
                        /in/victor-santos-0a86021b7
                      </div>
                    </div>
                  </a>
                </Button>

                {/* GitHub */}
                <Button
                  asChild
                  variant="outline"
                  className="h-12 border-gray-700 bg-gray-900/90 hover:bg-gray-800 text-foreground font-semibold flex items-center justify-start gap-3 px-4 rounded-xl"
                >
                  <a
                    href="https://github.com/victorsantosg"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="w-5 h-5 text-primary shrink-0" />
                    <div className="text-left leading-tight">
                      <div className="text-xs font-bold">Repositórios GitHub</div>
                      <div className="text-[10px] text-muted-foreground font-normal">
                        @victorsantosg
                      </div>
                    </div>
                  </a>
                </Button>

                {/* Email */}
                <Button
                  asChild
                  variant="outline"
                  className="h-12 border-gray-700 bg-gray-900/90 hover:bg-gray-800 text-foreground font-semibold flex items-center justify-start gap-3 px-4 rounded-xl"
                >
                  <a href="mailto:victoorsaantos16@gmail.com">
                    <Mail className="w-5 h-5 text-cyan-400 shrink-0" />
                    <div className="text-left leading-tight">
                      <div className="text-xs font-bold">Enviar E-mail Direto</div>
                      <div className="text-[10px] text-muted-foreground font-normal">
                        victoorsaantos16@gmail.com
                      </div>
                    </div>
                  </a>
                </Button>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="p-4 bg-gray-900/60 border-t border-border/40 flex items-center justify-between text-xs font-mono text-muted-foreground">
            <span className="text-primary flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
              STATUS: AUTHENTICATED & READY FOR DEPLOY
            </span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsModalOpen(false)}
              className="text-xs font-mono hover:text-foreground"
            >
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
