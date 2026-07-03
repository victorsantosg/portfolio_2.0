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
import { useLanguage } from "@/hooks/use-language"

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
    if (step < 3) setStep(step + 1)
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
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
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
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

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
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
              <div className="rounded-2xl bg-card border border-border/50 p-8">
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
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{language === "pt" ? "R$ 1.000" : "$ 1,000"}</span>
                            <span className="font-semibold text-primary">
                              {language === "pt" ? `R$ ${formData.budget[0].toLocaleString("pt-BR")}` : `$ ${formData.budget[0].toLocaleString("en-US")}`}
                            </span>
                            <span className="text-muted-foreground">{language === "pt" ? "R$ 50.000+" : "$ 50,000+"}</span>
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
                          rows={5}
                          value={formData.description}
                          onChange={(e) =>
                            setFormData({ ...formData, description: e.target.value })
                          }
                          className="bg-secondary border-border resize-none"
                        />
                      </div>
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

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="space-y-6"
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
              <motion.a
                href="https://drive.google.com/file/d/1gdDbgXD7UKc8hjmY5wgNlEpxk7jhDPW1/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ x: 5 }}
                className="mt-4 flex items-center gap-4 p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors group"
              >
                <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Download className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground text-left">PDF</div>
                  <div className="font-medium text-left">{language === "pt" ? "Baixar Currículo" : "Download Resume"}</div>
                </div>
              </motion.a>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 p-8">
              <h3 className="text-xl font-semibold mb-4">{t.quote.whyChooseMe}</h3>
              <ul className="space-y-3">
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
