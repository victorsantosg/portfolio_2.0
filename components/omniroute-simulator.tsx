"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Zap,
  Cpu,
  Layers,
  Shield,
  Activity,
  CheckCircle2,
  ArrowRight,
  TrendingDown,
  Sparkles,
  GitMerge,
  GitCommit,
  RotateCw,
  Sliders,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function OmniRouteSimulator() {
  const [activeTab, setActiveTab] = useState<"fusion" | "pipe" | "compression">("fusion")

  // Estado do Fusion Simulator
  const [fusionState, setFusionState] = useState<"idle" | "running" | "done">("idle")
  const [fusionPrompt, setFusionPrompt] = useState(
    "Arquitetar endpoint em Fastify para alta concorrência com pool PostgreSQL particionado"
  )

  // Estado do Compression Studio
  const [compressionMode, setCompressionMode] = useState<"log" | "code" | "custom">("log")
  const [customText, setCustomText] = useState(
    `[2026-09-23 18:42:01.104] INFO [Server] Starting Fastify v4.26 on 0.0.0.0:3000
[2026-09-23 18:42:01.215] DEBUG [DB-Pool] Connected to PostgreSQL 16.2 cluster (4 active connections)
[2026-09-23 18:42:01.380] WARN [Cache] Redis replica connection high latency: 42ms (threshold: 30ms)
[2026-09-23 18:42:01.401] INFO [AuthService] JWT public key loaded successfully from Vault
[2026-09-23 18:42:01.550] ERROR [Worker] Rate limit exceeded on upstream external inventory sync (HTTP 429)`
  )

  const runFusionSimulation = () => {
    setFusionState("running")
    setTimeout(() => {
      setFusionState("done")
    }, 1800)
  }

  // Cálculo de compressão
  const originalWords = customText.trim().split(/\s+/).length
  const originalTokensEst = Math.round(originalWords * 1.35)
  const compressedTokensEst = Math.max(12, Math.round(originalTokensEst * 0.28))
  const tokenSavingsPct = Math.round(((originalTokensEst - compressedTokensEst) / originalTokensEst) * 100)
  const costSavingsDollars = ((originalTokensEst - compressedTokensEst) * 0.00003).toFixed(4)

  return (
    <div className="rounded-xl border border-sky-500/30 bg-[#090d16]/95 backdrop-blur-xl p-4 sm:p-5 text-foreground space-y-4 shadow-[0_0_35px_rgba(56,189,248,0.15)]">
      {/* Header do Simulador */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sky-500/20 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-lg bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400">
            <Cpu className="h-4 w-4 animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-bold text-sky-300 flex items-center gap-2">
              <span>OmniRoute // Open Source AI Orchestration</span>
              <Badge variant="outline" className="text-[10px] border-emerald-500/40 text-emerald-400 bg-emerald-500/10">
                Simulador Client-Side
              </Badge>
            </h4>
            <p className="text-xs text-muted-foreground">
              Demonstração prática de domínio dos motores de Combos (Fusion & Pipe), Juiz de Consenso e Compressão RTK
            </p>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex rounded-lg bg-secondary/60 p-1 border border-border/50 text-xs">
          <button
            onClick={() => setActiveTab("fusion")}
            className={`px-3 py-1 rounded-md font-semibold transition-all ${
              activeTab === "fusion"
                ? "bg-sky-500 text-black shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            🧬 Fusion Combo
          </button>
          <button
            onClick={() => setActiveTab("pipe")}
            className={`px-3 py-1 rounded-md font-semibold transition-all ${
              activeTab === "pipe"
                ? "bg-sky-500 text-black shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            ⛓️ Pipeline
          </button>
          <button
            onClick={() => setActiveTab("compression")}
            className={`px-3 py-1 rounded-md font-semibold transition-all ${
              activeTab === "compression"
                ? "bg-sky-500 text-black shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            📉 Compression (-75%)
          </button>
        </div>
      </div>

      {/* ABA 1: FUSION COMBO */}
      {activeTab === "fusion" && (
        <div className="space-y-4 text-xs sm:text-sm">
          <div className="rounded-lg bg-secondary/30 p-3 border border-sky-500/20 space-y-2">
            <span className="text-[11px] font-semibold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" /> Prompt de Entrada para Orquestração Paralela:
            </span>
            <input
              type="text"
              value={fusionPrompt}
              onChange={(e) => setFusionPrompt(e.target.value)}
              className="w-full bg-black/50 border border-border/50 rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-sky-400"
            />
            <Button
              onClick={runFusionSimulation}
              disabled={fusionState === "running"}
              className="w-full bg-sky-500 hover:bg-sky-400 text-black font-bold h-8 text-xs rounded-lg cursor-pointer"
            >
              {fusionState === "running" ? (
                <>
                  <RotateCw className="h-3.5 w-3.5 animate-spin mr-1.5" />
                  Bifurcando Modelos & Invocando Juiz...
                </>
              ) : (
                <>
                  <GitMerge className="h-3.5 w-3.5 mr-1.5" />
                  Executar Fusion Ensemble (2 Modelos + Juiz)
                </>
              )}
            </Button>
          </div>

          {/* Visualizador de Nós do Fusion */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Modelo A */}
            <div
              className={`p-3 rounded-lg border transition-all ${
                fusionState === "running"
                  ? "border-sky-400 bg-sky-500/10 shadow-[0_0_15px_rgba(56,189,248,0.2)] animate-pulse"
                  : "border-border/40 bg-secondary/20"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-sky-400 text-xs flex items-center gap-1">
                  <Cpu className="h-3.5 w-3.5" /> Modelo A (Codex Sol Ultra)
                </span>
                <Badge variant="outline" className="text-[10px] text-sky-300 border-sky-500/30">
                  {fusionState === "done" ? "TTFT: 245ms • 118 tps" : "Especialista em Algoritmos"}
                </Badge>
              </div>
              <p className="text-muted-foreground text-xs leading-relaxed">
                {fusionState === "done"
                  ? "✔ Estruturação de índices B-Tree compostos e particionamento hash por tenant_id em tabelas PostgreSQL."
                  : "Aguardando disparo da rota de engenharia..."}
              </p>
            </div>

            {/* Modelo B */}
            <div
              className={`p-3 rounded-lg border transition-all ${
                fusionState === "running"
                  ? "border-purple-400 bg-purple-500/10 shadow-[0_0_15px_rgba(168,85,247,0.2)] animate-pulse"
                  : "border-border/40 bg-secondary/20"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-purple-400 text-xs flex items-center gap-1">
                  <Shield className="h-3.5 w-3.5" /> Modelo B (Claude Thinking 4.6)
                </span>
                <Badge variant="outline" className="text-[10px] text-purple-300 border-purple-500/30">
                  {fusionState === "done" ? "TTFT: 310ms • 89 tps" : "Especialista em Resiliência"}
                </Badge>
              </div>
              <p className="text-muted-foreground text-xs leading-relaxed">
                {fusionState === "done"
                  ? "✔ Implementação de Circuit Breaker com failover suave e controle de lock otimista (ACID isolations)."
                  : "Aguardando disparo da rota de integridade..."}
              </p>
            </div>
          </div>

          {/* Juiz de Consenso (Judge) */}
          <div
            className={`p-3 rounded-lg border transition-all ${
              fusionState === "done"
                ? "border-emerald-500/60 bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.25)]"
                : "border-border/30 bg-secondary/10"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-emerald-400 text-xs flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" /> Síntese do Juiz de Consenso (OmniRoute Judge)
              </span>
              {fusionState === "done" && (
                <div className="flex items-center gap-2">
                  <Badge className="bg-emerald-500 text-black font-extrabold text-[10px]">Consenso: 98.6%</Badge>
                  <span className="text-[11px] text-muted-foreground">Latência Total: 412ms</span>
                </div>
              )}
            </div>
            <p className="text-muted-foreground text-xs leading-relaxed">
              {fusionState === "done" ? (
                <span className="text-foreground">
                  <strong>Solução Unificada:</strong> O Juiz sintetizou os índices de partição do Modelo A com os Circuit
                  Breakers de isolamento do Modelo B, eliminando redundâncias e entregando um boilerplate blindado pronto
                  para produção.
                </span>
              ) : (
                "O Juiz aguarda o término das inferências paralelas para cruzar os resultados e emitir o veredito unificado."
              )}
            </p>
          </div>
        </div>
      )}

      {/* ABA 2: PIPELINE COMBO */}
      {activeTab === "pipe" && (
        <div className="space-y-3 text-xs sm:text-sm">
          <p className="text-xs text-muted-foreground">
            O <strong>Pipeline Combo</strong> encadeia modelos em estágios sequenciais com validação entre cada fase:
          </p>

          <div className="space-y-2">
            {[
              {
                step: "01",
                role: "Planejador & Extração AST",
                model: "GPT-5.6 Terra",
                desc: "Analisa requisitos brutos e gera esquema estrito JSON de tipos e dependências.",
                badge: "Concluído (180ms)",
                badgeColor: "text-sky-400 border-sky-500/30",
              },
              {
                step: "02",
                role: "Engenharia de Código Enxuto",
                model: "Codex Sol Ultra",
                desc: "Implementa funções cirúrgicas respeitando as Karpathy Guidelines sem overengineering.",
                badge: "Concluído (320ms)",
                badgeColor: "text-purple-400 border-purple-500/30",
              },
              {
                step: "03",
                role: "Auditoria OWASP & Linter",
                model: "Claude Opus 4.6 Thinking",
                desc: "Inspeciona prepared statements, sanitização de inputs e vulnerabilidades de injeção.",
                badge: "Aprovado 100%",
                badgeColor: "text-emerald-400 border-emerald-500/30",
              },
            ].map((p, idx) => (
              <div
                key={p.step}
                className="flex items-start gap-3 p-2.5 rounded-lg bg-secondary/30 border border-border/40 hover:border-sky-500/30 transition-all"
              >
                <div className="h-6 w-6 rounded bg-sky-500/20 text-sky-400 font-mono font-bold flex items-center justify-center shrink-0 text-xs">
                  {p.step}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-foreground text-xs">{p.role}</span>
                    <Badge variant="outline" className={`text-[10px] ${p.badgeColor}`}>
                      {p.badge}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-xs mt-0.5">{p.desc}</p>
                  <span className="text-[10px] font-mono text-sky-400/80">Motor: {p.model}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ABA 3: COMPRESSION STUDIO */}
      {activeTab === "compression" && (
        <div className="space-y-4 text-xs sm:text-sm">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-muted-foreground">
              Simule a compressão cirúrgica de tokens com o padrão <strong>Caveman / RTK</strong>:
            </span>
            <div className="flex gap-1.5 text-[10px]">
              <button
                onClick={() => {
                  setCompressionMode("log")
                  setCustomText(
                    `[2026-09-23 18:42:01.104] INFO [Server] Starting Fastify v4.26 on 0.0.0.0:3000\n[2026-09-23 18:42:01.215] DEBUG [DB-Pool] Connected to PostgreSQL 16.2 cluster (4 active connections)\n[2026-09-23 18:42:01.380] WARN [Cache] Redis replica connection high latency: 42ms\n[2026-09-23 18:42:01.401] INFO [AuthService] JWT public key loaded successfully from Vault\n[2026-09-23 18:42:01.550] ERROR [Worker] Rate limit exceeded on upstream external inventory sync (HTTP 429)`
                  )
                }}
                className={`px-2 py-0.5 rounded border ${
                  compressionMode === "log" ? "bg-sky-500/20 text-sky-300 border-sky-400" : "border-border/50 text-muted-foreground"
                }`}
              >
                Log de Servidor
              </button>
              <button
                onClick={() => {
                  setCompressionMode("code")
                  setCustomText(
                    `// Function to calculate ABC curve on store inventory\nfunction calculateAbcCurve(skus: Array<{ id: string, revenue: number, cost: number }>) {\n  const sorted = [...skus].sort((a, b) => b.revenue - a.revenue);\n  const totalRevenue = sorted.reduce((acc, curr) => acc + curr.revenue, 0);\n  let accumulated = 0;\n  return sorted.map(item => {\n    accumulated += item.revenue;\n    const percentage = (accumulated / totalRevenue) * 100;\n    const curve = percentage <= 70 ? 'A' : percentage <= 90 ? 'B' : 'C';\n    return { ...item, curve };\n  });\n}`
                  )
                }}
                className={`px-2 py-0.5 rounded border ${
                  compressionMode === "code" ? "bg-sky-500/20 text-sky-300 border-sky-400" : "border-border/50 text-muted-foreground"
                }`}
              >
                Bloco de Código
              </button>
            </div>
          </div>

          <textarea
            value={customText}
            onChange={(e) => {
              setCustomText(e.target.value)
              setCompressionMode("custom")
            }}
            rows={4}
            className="w-full bg-black/60 border border-border/50 rounded-lg p-2.5 font-mono text-[11px] text-foreground focus:outline-none focus:border-sky-400 leading-relaxed resize-none"
            placeholder="Cole qualquer log, prompt ou código para testar a compressão..."
          />

          {/* Painel de Métricas de Redução de Tokens */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 rounded-lg bg-secondary/30 border border-border/40">
              <span className="text-[10px] text-muted-foreground block">Tokens Originais</span>
              <span className="text-sm font-bold text-foreground font-mono">~{originalTokensEst} tok</span>
            </div>
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
              <span className="text-[10px] text-emerald-400 block">Após RTK / Caveman</span>
              <span className="text-sm font-extrabold text-emerald-400 font-mono">~{compressedTokensEst} tok</span>
            </div>
            <div className="p-2 rounded-lg bg-sky-500/10 border border-sky-500/30">
              <span className="text-[10px] text-sky-400 block">Economia Real</span>
              <span className="text-sm font-extrabold text-sky-400 font-mono">-{tokenSavingsPct}%</span>
            </div>
          </div>

          {/* Barra de Progresso Visual de Economia */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>Eficiência de Compactação</span>
              <span className="text-emerald-400 font-bold">Economia média estimada: ${costSavingsDollars}/req</span>
            </div>
            <div className="h-2 w-full bg-secondary/60 rounded-full overflow-hidden flex">
              <div
                className="h-full bg-gradient-to-r from-sky-400 to-emerald-400 transition-all duration-500 rounded-full"
                style={{ width: `${tokenSavingsPct}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
