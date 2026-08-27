"use client"

import { motion } from "framer-motion"
import { Sparkles, Printer, Cpu, Box, CheckCircle2, ArrowUpRight, ShieldCheck, Flame } from "lucide-react"
import { SandboxViewer } from "@/components/three/sandbox-viewer"
import { Button } from "@/components/ui/button"

export function MakerLabSection() {
  const capabilities = [
    {
      icon: <Sparkles className="w-5 h-5 text-emerald-400" />,
      title: "IA Generativa 3D (Meshy AI)",
      description: "Conversão de prompts textuais e fotos de referências em modelos 3D com topologia inteligente e mapas PBR 4K.",
    },
    {
      icon: <Cpu className="w-5 h-5 text-cyan-400" />,
      title: "Auto-Rigging & Animação",
      description: "Geração e inserção automática de esqueletos esqueléticos (T-Pose / A-Pose) com animações dinâmicas para web e games.",
    },
    {
      icon: <Printer className="w-5 h-5 text-emerald-400" />,
      title: "Manufatura Aditiva & Slicing",
      description: "Exportação em .3MF e .STL para fatiadores (Orca Slicer / Bambu Studio), verificação de manifold 100% estanque e suporte a multicolor.",
    },
  ]

  return (
    <section id="maker-lab" className="relative py-28 overflow-hidden bg-black/40 border-t border-border/40">
      {/* Background Glows */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-6xl">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-mono mb-4 shadow-[0_0_15px_rgba(34,197,94,0.2)]">
            <Flame className="w-3.5 h-3.5" />
            <span>3D & AI MAKER LAB • MESHY ENGINE</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 text-foreground">
            Do Conceito Digital à <span className="text-gradient">Impressão 3D Real</span>
          </h2>

          <p className="text-muted-foreground max-w-2xl text-base md:text-lg">
            Integração avançada entre Inteligência Artificial generativa para malhas 3D e engenharia de manufatura aditiva. Experimente o visualizador 3D interativo abaixo.
          </p>
        </div>

        {/* Main Grid: 3D Sandbox + Tech Details */}
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Interactive 3D Sandbox */}
          <div className="lg:col-span-7">
            <SandboxViewer />
          </div>

          {/* Right Column: Pipeline Cards & Features */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            {capabilities.map((cap, i) => (
              <motion.div
                key={cap.title}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="p-5 rounded-2xl bg-gray-950/80 border border-border/60 hover:border-primary/50 transition-all shadow-lg group"
              >
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-gray-900 border border-border/80 group-hover:border-primary/40 transition-colors">
                    {cap.icon}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                      {cap.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {cap.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Quality Seal / Specs Box */}
            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 flex items-center justify-between mt-2">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-primary" />
                <div className="text-xs font-mono">
                  <div className="text-foreground font-semibold">100% Watertight Check</div>
                  <div className="text-muted-foreground">Pronto para FDM / SLA / SLS</div>
                </div>
              </div>

              <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-primary/20 text-primary border border-primary/30">
                PRO QUALITY
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
