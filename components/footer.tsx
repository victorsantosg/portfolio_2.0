"use client"

import { motion } from "framer-motion"
import { Heart, ArrowUp } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"

export function Footer() {
  const { language, t } = useLanguage()

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <footer id="contato" className="relative py-12 border-t border-border/50">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center md:text-left"
          >
            <div className="flex items-center justify-center md:justify-start mb-4">
              <img 
                src="/logovs.png" 
                alt="Logo VS" 
                className="h-16 w-16 md:h-20 md:w-20 object-contain hover:scale-105 transition-transform duration-300"
              />
            </div>
            <p className="text-sm text-muted-foreground mb-1 max-w-xs leading-normal">
              {t.footer.description}
            </p>
            <p className="text-xs text-muted-foreground/80 flex items-center gap-1 justify-center md:justify-start">
       
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-center"
          >
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Victor Santos. {t.footer.rights}
            </p>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            onClick={scrollToTop}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors"
            aria-label={language === "pt" ? "Voltar ao topo" : "Back to top"}
          >
            <ArrowUp className="h-5 w-5" />
          </motion.button>
        </div>
      </div>
    </footer>
  )
}

