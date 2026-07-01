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
    { href: "#projetos", label: t.nav.projects },
    { href: "#contato", label: t.nav.contact },
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
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
          isScrolled ? "w-[95%] max-w-5xl" : "w-[95%] max-w-6xl"
        }`}
      >
        <nav
          className={`glass rounded-2xl border border-border/50 px-6 py-3 transition-all duration-300 ${
            isScrolled ? "py-2" : "py-4"
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
                className="h-12 w-12 object-contain -translate-y-[2.5px]"
              />
              <div>
                <span className="text-gradient">Victor</span>
                <span className="text-foreground">.dev</span>
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
            className="fixed inset-0 z-40 pt-24 px-4 md:hidden"
          >
            <div className="glass rounded-2xl border border-border/50 p-6">
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
    <button
      onClick={onClick}
      className="relative px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
    >
      {label}
      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary rounded-full transition-all duration-300 group-hover:w-3/4" />
    </button>
  )
}

