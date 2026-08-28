"use client"

import { useEffect, useState } from "react"
import { motion as motionFramer, AnimatePresence as AnimatePresenceFramer } from "framer-motion"
import { Menu, X, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/hooks/use-language"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { language, setLanguage, t } = useLanguage()

  const navLinks = [
    { href: "#inicio", label: t.nav.home },
    { href: "#sobre", label: t.nav.about },
    { href: "#stack", label: t.nav.stack },
    { href: "#maker-lab", label: t.nav.makerLab },
    { href: "#projetos", label: t.nav.projects },
    { href: "#orcamento", label: t.nav.contact },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      <motionFramer.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-in-out ${
          isScrolled 
            ? "top-2 w-[90%] md:w-[95%] max-w-5xl" 
            : "top-4 w-[95%] max-w-6xl"
        }`}
      >
        <nav
          className={`glass border border-border/50 transition-all duration-500 ease-in-out ${
            isScrolled ? "py-2 px-4 md:px-6 rounded-[2rem] shadow-lg shadow-primary/10" : "py-4 px-6 rounded-2xl"
          }`}
        >
          <div className="flex items-center justify-between">
            <motionFramer.button
              onClick={() => scrollToSection("#inicio")}
              className="flex items-center gap-2.5 text-xl font-bold tracking-tight"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img 
                src="/logovs.png" 
                alt="Logo VS" 
                style={{ filter: "hue-rotate(200deg) saturate(2.8) brightness(1.15) drop-shadow(0 0 8px rgba(245,158,11,0.5))" }}
                className={`object-contain -translate-y-[2.5px] transition-all duration-500 ease-in-out ${
                  isScrolled ? "h-12 w-12 md:h-10 md:w-10" : "h-20 w-20 md:h-16 md:w-16"
                }`}
              />
              <div className="hidden md:block">
                <span className="text-gradient font-extrabold">Victor</span>
                <span className="text-foreground font-mono">.dev</span>
              </div>
            </motionFramer.button>

            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.href}
                  href={link.href}
                  label={link.label}
                  onClick={() => scrollToSection(link.href)}
                />
              ))}
            </div>

            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={() => setLanguage(language === "pt" ? "en" : "pt")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/50 bg-secondary/50 hover:bg-secondary text-sm font-medium transition-colors"
              >
                <Globe className="h-4 w-4 text-primary" />
                <span>{language === "pt" ? "EN" : "PT"}</span>
              </button>

              <motionFramer.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={() => scrollToSection("#orcamento")}
                  className="relative overflow-hidden bg-primary text-primary-foreground font-semibold px-6 animate-pulse-glow"
                >
                  {t.nav.cta}
                </Button>
              </motionFramer.div>
            </div>

            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={() => setLanguage(language === "pt" ? "en" : "pt")}
                className="flex items-center gap-1 px-2.5 py-1 rounded border border-border/50 bg-secondary/55 text-xs font-semibold hover:bg-secondary transition-colors"
              >
                {language === "pt" ? "EN" : "PT"}
              </button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="flex items-center p-2 rounded-lg hover:bg-secondary transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </nav>
      </motionFramer.header>

      <AnimatePresenceFramer>
        {isMobileMenuOpen && (
          <motionFramer.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 pt-24 px-4 md:hidden bg-background/95 backdrop-blur-sm"
          >
            <div className="bg-background border border-border/50 rounded-2xl p-6 shadow-2xl">
              <div className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <button
                    key={link.href}
                    onClick={() => scrollToSection(link.href)}
                    className="text-left text-lg font-medium py-2 px-4 rounded-lg hover:bg-secondary transition-colors"
                  >
                    {link.label}
                  </button>
                ))}
                <Button
                  onClick={() => scrollToSection("#orcamento")}
                  className="mt-4 w-full bg-primary text-primary-foreground font-semibold"
                >
                  {t.nav.cta}
                </Button>
              </div>
            </div>
          </motionFramer.div>
        )}
      </AnimatePresenceFramer>
    </>
  )
}

function NavLink({
  href,
  label,
  onClick,
}: {
  href: string
  label: string
  onClick: () => void
}) {
  return (
    <motionFramer.button
      onClick={onClick}
      whileHover={{ y: -1, scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className="relative px-3.5 py-2 rounded-lg text-sm font-mono font-medium text-muted-foreground hover:text-white transition-colors duration-200 group overflow-hidden cursor-pointer"
    >
      {/* 1. Cybernetic Holographic Capsule Background */}
      <span className="absolute inset-0 bg-gradient-to-b from-[#ee7112]/15 via-transparent to-[#ee7112]/5 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-lg pointer-events-none" />
      <span className="absolute inset-0 border border-[#ee7112]/0 group-hover:border-[#ee7112]/50 group-hover:shadow-[0_0_18px_rgba(238,113,18,0.3)] rounded-lg transition-all duration-300 pointer-events-none" />

      {/* 2. Cyber Corner Brackets (┌ ┐ └ ┘) */}
      <span className="absolute top-1 left-1 w-1.5 h-1.5 border-t-2 border-l-2 border-[#ee7112] opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-x-1 -translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0" />
      <span className="absolute top-1 right-1 w-1.5 h-1.5 border-t-2 border-r-2 border-[#ee7112] opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-1 -translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0" />
      <span className="absolute bottom-1 left-1 w-1.5 h-1.5 border-b-2 border-l-2 border-[#ee7112] opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-x-1 translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0" />
      <span className="absolute bottom-1 right-1 w-1.5 h-1.5 border-b-2 border-r-2 border-[#ee7112] opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-1 translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0" />

      {/* 3. Laser Scanline Sweep */}
      <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-[#ee7112]/25 to-transparent pointer-events-none" />

      {/* 4. Text Clean */}
      <span className="relative z-10 block group-hover:text-amber-200 group-hover:drop-shadow-[0_0_10px_rgba(238,113,18,0.75)] transition-all duration-200">
        {label}
      </span>

      {/* 5. Bottom Glowing Circuit Line */}
      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-gradient-to-r from-transparent via-[#ee7112] to-transparent group-hover:w-4/5 transition-all duration-300 shadow-[0_0_8px_#ee7112]" />
    </motionFramer.button>
  )
}
