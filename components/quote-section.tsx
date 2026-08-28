"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Send,
  Mail,
  Github,
  Linkedin,
  CheckCircle2,
  ArrowRight,
  Clock,
  Wallet,
  Globe,
  Smartphone,
  Cog,
  Building2,
  Phone,
  Download,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/hooks/use-language"
import { jarvisVariants } from "@/lib/animations"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts"

export function QuoteSection() {
  const { language, t } = useLanguage()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    projectType: "",
    timeline: "",
    budget: [5000],
    name: "",
    email: "",
    description: "",
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [aiProposal, setAiProposal] = useState<{
    summary?: string
    recommendedStack?: string[]
    architectureHighlights?: string[]
    estimatedTimeline?: string
    complexityLevel?: string
    keyDeliverables?: string[]
    jarvisExecutiveVerdict?: string
  } | null>(null)
  const [isGeneratingAiProposal, setIsGeneratingAiProposal] = useState(false)

  const handleGenerateAiProposal = async () => {
    setIsGeneratingAiProposal(true)
    try {
      const res = await fetch("/api/jarvis/scope-proposal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          projectType: formData.projectType,
          budget: `R$ ${formData.budget[0].toLocaleString("pt-BR")}`,
          urgency: formData.timeline,
          description: formData.description,
        }),
      })

      const data = await res.json()
      setAiProposal(data)
    } catch (err) {
      console.error(err)
    } finally {
      setIsGeneratingAiProposal(false)
    }
  }

  const handleSendToWhatsApp = () => {
    const text = `*SOLICITAÇÃO DE PROPOSTA TÉCNICA // J.A.R.V.I.S.*
-----------------------------------
*Cliente:* ${formData.name || "Interessado"}
*Email:* ${formData.email || "Não informado"}
*Tipo de Projeto:* ${formData.projectType || "Geral"}
*Orçamento Estimado:* R$ ${formData.budget[0].toLocaleString("pt-BR")}
*Prazo/Urgência:* ${formData.timeline || "Normal"}

*Descrição:* ${formData.description || "N/A"}

${
  aiProposal
    ? `*DIAGNÓSTICO J.A.R.V.I.S. (IA):*
• *Stack Recomendada:* ${aiProposal.recommendedStack?.join(", ")}
• *Prazo Estimado:* ${aiProposal.estimatedTimeline}
• *Complexidade:* ${aiProposal.complexityLevel}
• *Veredito:* ${aiProposal.jarvisExecutiveVerdict}`
    : ""
}`

    const encoded = encodeURIComponent(text)
    window.open(`https://wa.me/5585999556385?text=${encoded}`, "_blank")
  }

  const projectTypes = [
    { id: "web", label: language === "pt" ? "Web App" : "Web App", icon: Globe },
    { id: "mobile", label: language === "pt" ? "App Mobile" : "Mobile App", icon: Smartphone },
    { id: "automation", label: language === "pt" ? "Automação" : "Automation / RPA", icon: Cog },
    { id: "system", label: language === "pt" ? "Sistema Completo" : "Full Platform", icon: Building2 },
  ]

  const timelines = [
    { id: "urgent", label: language === "pt" ? "Urgente (< 2 semanas)" : "Urgent (< 2 weeks)", multiplier: 1.5 },
    { id: "normal", label: language === "pt" ? "Normal (2-4 semanas)" : "Normal (2-4 weeks)", multiplier: 1 },
    { id: "relaxed", label: language === "pt" ? "Flexível (1-2 meses)" : "Flexible (1-2 months)", multiplier: 0.9 },
  ]

  const contactLinks = [
    {
      label: "Email",
      value: "victoorsaantos16@gmail.com",
      href: "mailto:victoorsaantos16@gmail.com",
      icon: Mail,
    },
    {
      label: language === "pt" ? "WhatsApp / Telefone" : "WhatsApp / Phone",
      value: "(85) 99955-6385",
      href: "https://wa.me/5585999556385",
      icon: Phone,
    },
    {
      label: "GitHub",
      value: "@victorsantosg",
      href: "https://github.com/victorsantosg",
      icon: Github,
    },
    {
      label: "LinkedIn",
      value: "/in/victorpeixoto",
      href: "https://www.linkedin.com/in/victor-santos-0a86021b7/",
      icon: Linkedin,
    },
  ]

  const handleProjectTypeSelect = (id: string) => {
    setFormData({ ...formData, projectType: id })
  }

  const handleTimelineSelect = (id: string) => {
    setFormData({ ...formData, timeline: id })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await fetch("https://formspree.io/f/mzdlkzyl", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          projectType: formData.projectType,
          timeline: formData.timeline,
          budget: formData.budget[0],
          description: formData.description
        }),
      })
    } catch (err) {
      console.error("Formspree submit error", err)
    }
    setSubmitting(false)
    setIsSubmitted(true)
  }

  const nextStep = () => {
    if (step < 3) setStep((prev) => prev + 1)
  }

  const prevStep = () => {
    if (step > 1) setStep((prev) => prev - 1)
  }

  const canProceed = () => {
    if (step === 1) return formData.projectType !== ""
    if (step === 2) return formData.timeline !== ""
    return formData.name.trim() !== "" && formData.email.trim() !== "" && formData.description.trim() !== ""
  }

  return (
    <section id="orcamento" className="relative py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/10 to-background" />

      <div className="relative container mx-auto px-4 md:px-6">
        <motion.div
          variants={jarvisVariants}
          custom={{ direction: "top" }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.span
            variants={jarvisVariants}
            custom={{ direction: "scale", delay: 0.2 }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="inline-block text-primary font-mono text-sm mb-4"
          >
            {t.quote.tagline}
          </motion.span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-balance">
            {t.quote.title} <span className="text-gradient">{t.quote.titleGradient}</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
            {t.quote.subtitle}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
          <motion.div
            variants={jarvisVariants}
            custom={{ direction: "left", delay: 0.2 }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-2 h-full"
          >
            {isSubmitted ? (
              <SuccessMessage
                title={t.quote.successTitle}
                desc={t.quote.successDesc}
                btnResetText={t.quote.btnReset}
                onReset={() => {
                  setIsSubmitted(false)
                  setStep(1)
                  setFormData({
                    projectType: "",
                    timeline: "",
                    budget: [5000],
                    name: "",
                    email: "",
                    description: "",
                  })
                }}
              />
            ) : (
              <div className="rounded-2xl bg-card border border-border/50 p-8 min-h-[440px] flex flex-col justify-between h-full">
                <div className="flex items-center gap-2 mb-8">
                  {[1, 2, 3].map((s) => (
                    <div key={s} className="flex items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${step >= s
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-muted-foreground"
                          }`}
                      >
                        {s}
                      </div>
                      {s < 3 && (
                        <div
                          className={`w-12 h-0.5 mx-2 transition-colors ${step > s ? "bg-primary" : "bg-secondary"
                            }`}
                        />
                      )}
                    </div>
                  ))}
                </div>

                {/* Painel de Monitoramento Jarvis (Desktop Only para Preenchimento Dinâmico) */}
                <div className="hidden lg:flex items-center justify-center p-6 border-y border-border/20 my-4 bg-secondary/10 rounded-xl relative overflow-hidden min-h-[140px] group/viz">
                  {/* Grid overlay futurista */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[16px_16px] pointer-events-none" />

                  {step === 1 && (
                    <motion.div
                      key="step1-viz"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative flex items-center gap-6 z-10 w-full"
                    >
                      <div className="relative w-16 h-16 shrink-0 flex items-center justify-center rounded-full border border-primary/20 bg-primary/5">
                        <div className="absolute inset-0 border border-primary/30 border-t-transparent rounded-full animate-spin" />
                        <Globe className="h-6 w-6 text-primary animate-pulse" />
                      </div>
                      <div className="space-y-1">
                        <div className="font-mono text-[10px] text-primary font-bold tracking-wider">{"// INITIALIZING_MODULE: TYPE_SCAN"}</div>
                        <h4 className="font-semibold text-foreground text-sm">{language === 'pt' ? 'Categoria do Projeto' : 'Project Category'}</h4>
                        <p className="text-xs text-muted-foreground">
                          {language === 'pt'
                            ? 'Defina a natureza do sistema para ajustarmos as tecnologias base.'
                            : 'Define the system nature to adjust baseline technologies.'}
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                      key="step2-viz"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative flex items-center gap-6 z-10 w-full"
                    >
                      <div className="relative w-16 h-16 shrink-0 flex items-center justify-center rounded-full border border-primary/20 bg-primary/5">
                        <div className="absolute inset-1.5 border border-dashed border-primary/30 rounded-full animate-spin" style={{ animationDuration: '8s' }} />
                        <Clock className="h-6 w-6 text-primary animate-pulse" />
                      </div>
                      <div className="space-y-1">
                        <div className="font-mono text-[10px] text-primary font-bold tracking-wider">{"// CALIBRATING_MODULE: TIMELINE_ESTIMATE"}</div>
                        <h4 className="font-semibold text-foreground text-sm">{language === 'pt' ? 'Prazo de Desenvolvimento' : 'Development Timeframe'}</h4>
                        <p className="text-xs text-muted-foreground">
                          {language === 'pt'
                            ? 'Estime o tempo de entrega para organizarmos o fluxo de sprints.'
                            : 'Estimate delivery time to organize sprint flow.'}
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div
                      key="step3-viz"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative flex items-center gap-6 z-10 w-full"
                    >
                      <div className="relative w-16 h-16 shrink-0 flex items-center justify-center rounded-full border border-primary/20 bg-primary/5">
                        <div className="absolute inset-0.5 border border-primary/40 rounded-full animate-ping" style={{ animationDuration: '2.5s' }} />
                        <Wallet className="h-6 w-6 text-primary animate-pulse" />
                      </div>
                      <div className="space-y-1">
                        <div className="font-mono text-[10px] text-primary font-bold tracking-wider">{"// SYNCHRONIZING_MODULE: ESTIMATED_BUDGET"}</div>
                        <h4 className="font-semibold text-foreground text-sm">{language === 'pt' ? 'Dados e Orçamento' : 'Budget & Contact'}</h4>
                        <p className="text-xs text-muted-foreground">
                          {language === 'pt'
                            ? 'Informe sua estimativa e contato para criarmos uma proposta personalizada.'
                            : 'Enter your estimate and contact details to generate a custom proposal.'}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </div>

                <form onSubmit={handleSubmit}>
                  {step === 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div>
                        <Label className="text-lg font-semibold mb-4 block">
                          {t.quote.typeTitle}
                        </Label>
                        <div className="grid grid-cols-2 gap-3">
                          {projectTypes.map((type) => (
                            <button
                              key={type.id}
                              type="button"
                              onClick={() => handleProjectTypeSelect(type.id)}
                              className={`p-4 rounded-xl border-2 transition-all duration-200 text-center flex flex-col items-center justify-center gap-1 ${formData.projectType === type.id
                                ? "border-primary bg-primary/10"
                                : "border-border hover:border-primary/50"
                                }`}
                            >
                              <type.icon
                                className={`h-6 w-6 ${formData.projectType === type.id
                                  ? "text-primary"
                                  : "text-muted-foreground"
                                  }`}
                              />
                              <span className="block font-medium text-sm">{type.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div>
                        <Label className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <Clock className="h-5 w-5 text-primary" />
                          {t.quote.timelineTitle}
                        </Label>
                        <div className="space-y-3">
                          {timelines.map((timeline) => (
                            <button
                              key={timeline.id}
                              type="button"
                              onClick={() => handleTimelineSelect(timeline.id)}
                              className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-center flex flex-col items-center justify-center ${formData.timeline === timeline.id
                                ? "border-primary bg-primary/10"
                                : "border-border hover:border-primary/50"
                                }`}
                            >
                              <span className="block font-medium">{timeline.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <Wallet className="h-5 w-5 text-primary" />
                          {t.quote.budgetTitle}
                        </Label>
                        <div className="px-2">
                          <Slider
                            value={formData.budget}
                            onValueChange={(value) =>
                              setFormData({ ...formData, budget: value })
                            }
                            min={1000}
                            max={50000}
                            step={500}
                            className="mb-4"
                          />
                          <div className="flex justify-between text-sm mb-6">
                            <span className="text-muted-foreground">{language === "pt" ? "R$ 1.000" : "$ 1,000"}</span>
                            <span className="font-semibold text-primary text-base">
                              {language === "pt" ? `R$ ${formData.budget[0].toLocaleString("pt-BR")}` : `$ ${formData.budget[0].toLocaleString("en-US")}`}
                            </span>
                            <span className="text-muted-foreground">{language === "pt" ? "R$ 50.000+" : "$ 50,000+"}</span>
                          </div>

                          {/* Recharts ROI & Hours Saved Interactive Visualization */}
                          <div className="p-4 rounded-xl bg-black/40 border border-primary/30 backdrop-blur-sm space-y-3">
                            <div className="flex items-center justify-between text-xs font-mono text-emerald-400">
                              <span className="font-semibold">{"// SIMULADOR_ROI & IMPACTO"}</span>
                              <span className="font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                                {language === "pt"
                                  ? `~${Math.round((formData.budget[0] / 5000) * 45)}h/mês economizadas`
                                  : `~${Math.round((formData.budget[0] / 5000) * 45)}h/mo saved`}
                              </span>
                            </div>
                            <div className="h-32 w-full pt-2">
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                  data={[
                                    {
                                      name: language === "pt" ? "Carga Manual" : "Manual Task",
                                      horas: 160,
                                    },
                                    {
                                      name: language === "pt" ? "Com Automação" : "Automated",
                                      horas: Math.max(20, 160 - Math.round((formData.budget[0] / 5000) * 45)),
                                    },
                                  ]}
                                  margin={{ top: 10, right: 15, left: -20, bottom: 0 }}
                                >
                                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                                  <Tooltip
                                    contentStyle={{ backgroundColor: "#0f172a", borderColor: "#1e293b", color: "#f8fafc", borderRadius: "8px", fontSize: "12px" }}
                                    formatter={(val) => [`${val} h/mês`, language === "pt" ? "Horas Gastas" : "Hours Spent"]}
                                  />
                                  <Bar dataKey="horas" radius={[6, 6, 0, 0]}>
                                    <Cell fill="#334155" />
                                    <Cell fill="#10b981" />
                                  </Bar>
                                </BarChart>
                              </ResponsiveContainer>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">{t.quote.nameLabel}</Label>
                          <Input
                            id="name"
                            placeholder={t.quote.namePlaceholder}
                            value={formData.name}
                            onChange={(e) =>
                              setFormData({ ...formData, name: e.target.value })
                            }
                            className="bg-secondary border-border"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">{t.quote.emailLabel}</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder={t.quote.emailPlaceholder}
                            value={formData.email}
                            onChange={(e) =>
                              setFormData({ ...formData, email: e.target.value })
                            }
                            className="bg-secondary border-border"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">{t.quote.descLabel}</Label>
                        <Textarea
                          id="description"
                          placeholder={t.quote.descPlaceholder}
                          rows={4}
                          value={formData.description}
                          onChange={(e) =>
                            setFormData({ ...formData, description: e.target.value })
                          }
                          className="bg-secondary border-border resize-none"
                        />
                      </div>

                      {/* AI Architecture Diagnosis Trigger */}
                      <div className="pt-1">
                        <Button
                          type="button"
                          onClick={handleGenerateAiProposal}
                          disabled={isGeneratingAiProposal || !formData.description.trim()}
                          className="w-full bg-gradient-to-r from-amber-600/30 via-orange-600/30 to-amber-500/30 hover:from-amber-600/50 hover:to-orange-500/50 border border-amber-500/50 text-amber-300 font-mono text-xs py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.2)] transition-all cursor-pointer"
                        >
                          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                          <span>
                            {isGeneratingAiProposal
                              ? "J.A.R.V.I.S. PROCESSANDO ARQUITETURA..."
                              : "✨ Gerar Diagnóstico Técnico com IA (Groq/Gemini)"}
                          </span>
                        </Button>
                      </div>

                      {/* AI Architecture Proposal Result Card */}
                      {aiProposal && (
                        <motion.div
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 rounded-2xl bg-black/80 border-2 border-amber-500/60 shadow-[0_0_30px_rgba(245,158,11,0.25)] font-mono space-y-3 relative overflow-hidden"
                        >
                          <div className="flex items-center justify-between pb-2 border-b border-amber-500/30 text-xs">
                            <div className="flex items-center gap-2 text-amber-400 font-bold">
                              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                              <span>DIAGNÓSTICO TÉCNICO // J.A.R.V.I.S.</span>
                            </div>
                            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[10px] border border-amber-500/40">
                              {aiProposal.complexityLevel}
                            </span>
                          </div>

                          <p className="text-xs text-slate-200 leading-relaxed">
                            {aiProposal.summary}
                          </p>

                          {/* Tech Stack Badges */}
                          {aiProposal.recommendedStack && (
                            <div>
                              <div className="text-[10px] text-muted-foreground uppercase mb-1">
                                Stack Recomendada:
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {aiProposal.recommendedStack.map((tech) => (
                                  <span
                                    key={tech}
                                    className="px-2 py-0.5 rounded-lg bg-gray-900 border border-amber-500/30 text-amber-300 text-[10px]"
                                  >
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Timeline & Verdict */}
                          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-amber-500/20 text-[11px]">
                            <div>
                              <span className="text-muted-foreground">Prazo Estimado: </span>
                              <span className="text-amber-400 font-bold">{aiProposal.estimatedTimeline}</span>
                            </div>
                          </div>

                          {/* 1-Click WhatsApp Export */}
                          <Button
                            type="button"
                            onClick={handleSendToWhatsApp}
                            className="w-full h-10 bg-emerald-600 hover:bg-emerald-500 text-white font-bold font-mono text-xs rounded-xl gap-2 shadow-lg shadow-emerald-600/30 cursor-pointer transition-all"
                          >
                            <span>📱 Enviar Pré-Proposta para WhatsApp do Victor</span>
                          </Button>
                        </motion.div>
                      )}
                    </motion.div>
                  )}

                  <div className="flex gap-3 mt-8">
                    {step > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={prevStep}
                        className="flex-1"
                      >
                        {t.quote.btnBack}
                      </Button>
                    )}
                    {step < 3 ? (
                      <Button
                        type="button"
                        onClick={nextStep}
                        disabled={!canProceed()}
                        className="flex-1 bg-primary text-primary-foreground font-semibold"
                      >
                        {t.quote.btnNext}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        disabled={!canProceed() || submitting}
                        className="flex-1 bg-primary text-primary-foreground font-semibold animate-pulse-glow"
                      >
                        {submitting ? "..." : t.quote.btnSubmit}
                        <Send className="ml-2 h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </form>
              </div>
            )}
          </motion.div>

          {/* Coluna da Direita: Canais de Contato & Escolha */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div
              variants={jarvisVariants}
              custom={{ direction: "right", delay: 0.3 }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <div className="rounded-2xl bg-card border border-border/50 p-8">
                <h3 className="text-xl font-semibold mb-6">{t.quote.channelsTitle}</h3>
                <div className="space-y-4">
                  {contactLinks.map((link) => (
                    <motion.a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ x: 5 }}
                      className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors group"
                    >
                      <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <link.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">{link.label}</div>
                        <div className="font-medium">{link.value}</div>
                      </div>
                    </motion.a>
                  ))}
                </div>

                {/* Download CV */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <motion.button
                      whileHover={{ x: 5 }}
                      className="mt-4 w-full flex items-center gap-4 p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors group outline-none"
                    >
                      <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <Download className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground text-left">PDF</div>
                        <div className="font-medium text-left">{language === "pt" ? "Baixar Currículo" : "Download Resume"}</div>
                      </div>
                    </motion.button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 bg-card border-border/50">
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <a href="https://drive.google.com/file/d/1Cv596z56VEIEgutcjcX7SPFurH2w03-6/view?usp=sharing" target="_blank" rel="noopener noreferrer">
                        Português (PT-BR)
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <a href="https://drive.google.com/file/d/1L9fgPyRqCy2OiDwD6Uru94ZHsEhxBN1r/view?usp=sharing" target="_blank" rel="noopener noreferrer">
                        English (EN-US)
                      </a>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </motion.div>

            <motion.div
              variants={jarvisVariants}
              custom={{ direction: "right", delay: 0.4 }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <div className="rounded-2xl bg-gradient-to-br from-primary/15 via-primary/5 to-transparent border border-primary/25 p-8 flex flex-col">
                <h3 className="text-xl font-semibold mb-6">{t.quote.whyChooseMe}</h3>
                <ul className="space-y-4">
                  {t.quote.reasons.map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

function SuccessMessage({
  title,
  desc,
  btnResetText,
  onReset,
}: {
  title: string
  desc: string
  btnResetText: string
  onReset: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-2xl bg-card border border-primary/50 p-8 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6"
      >
        <CheckCircle2 className="h-8 w-8 text-primary" />
      </motion.div>
      <h3 className="text-2xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6">{desc}</p>
      <Button onClick={onReset} variant="outline">
        {btnResetText}
      </Button>
    </motion.div>
  )
}
