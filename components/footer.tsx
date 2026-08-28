"use client"

import { motion } from "framer-motion"
import { Heart, ArrowUp, Mail, Phone, MapPin, Github, Linkedin } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"

export function Footer() {
  const { language, t } = useLanguage()

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <footer id="footer" className="relative pt-16 pb-8 border-t border-border/50 overflow-hidden bg-background">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 mb-16">
          
          {/* Brand & Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-5 lg:col-span-4 space-y-6 text-center md:text-left"
          >
            <div className="flex items-center justify-center md:justify-start">
              <img 
                src="/logovs-orange.svg" 
                alt="Logo VS Victor Santos" 
                className="h-16 w-auto object-contain hover:scale-105 transition-transform duration-300 filter drop-shadow-[0_0_15px_rgba(238,113,18,0.7)]"
              />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto md:mx-0">
              {t.footer.description}
            </p>
            <div className="flex items-center justify-center md:justify-start gap-4">
              <a href="https://github.com/victorsantosg" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-secondary/50 hover:bg-primary hover:text-primary-foreground transition-colors">
                <Github className="h-4 w-4" />
              </a>
              <a href="https://linkedin.com/in/victorpeixoto" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-secondary/50 hover:bg-primary hover:text-primary-foreground transition-colors">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href="mailto:victoorsaantos16@gmail.com" className="p-2 rounded-full bg-secondary/50 hover:bg-primary hover:text-primary-foreground transition-colors">
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </motion.div>
          
          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="md:col-span-3 lg:col-span-3 lg:col-start-6 text-center md:text-left"
          >
            <h4 className="font-semibold text-foreground mb-6">{language === "pt" ? "Links Rápidos" : "Quick Links"}</h4>
            <ul className="flex flex-wrap justify-center md:flex-col gap-4 md:gap-4 text-sm text-muted-foreground">
              <li><a href="#inicio" className="hover:text-primary transition-colors">{t.nav.home}</a></li>
              <li><a href="#sobre" className="hover:text-primary transition-colors">{t.nav.about}</a></li>
              <li><a href="#stack" className="hover:text-primary transition-colors">{t.nav.stack}</a></li>
              <li><a href="#projetos" className="hover:text-primary transition-colors">{t.nav.projects}</a></li>
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="md:col-span-4 lg:col-span-4 text-center md:text-left"
          >
            <h4 className="font-semibold text-foreground mb-6">{t.nav.contact}</h4>
            <ul className="flex flex-wrap justify-center md:flex-col gap-5 md:gap-4 text-sm text-muted-foreground">
              <li className="flex items-center gap-3 w-full sm:w-auto justify-center md:justify-start">
                <div className="p-2 rounded-lg bg-primary/10 text-primary"><Mail className="h-4 w-4" /></div>
                <span>victoorsaantos16@gmail.com</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary"><Phone className="h-4 w-4" /></div>
                <span>(85) 99955-6385</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary"><MapPin className="h-4 w-4" /></div>
                <span>Fortaleza, {language === "pt" ? "CE" : "BR"}</span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-border/30">
          <p className="text-sm text-muted-foreground text-center md:text-left order-2 md:order-1">
            © {new Date().getFullYear()} Victor Santos. {t.footer.rights}
          </p>
          
          <div className="flex items-center gap-6 order-1 md:order-2">
            <motion.button
              onClick={scrollToTop}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.95 }}
              className="p-2.5 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors"
              aria-label={language === "pt" ? "Voltar ao topo" : "Back to top"}
            >
              <ArrowUp className="h-4 w-4" />
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  )
}
