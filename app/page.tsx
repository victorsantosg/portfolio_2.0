"use client"

import { useState, useEffect } from "react"
import { AnimatePresence } from "framer-motion"
import { LanguageProvider } from "@/hooks/use-language"
import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { AboutSection } from "@/components/about-section"
import { TechStackSection } from "@/components/tech-stack-section"
import { MakerLabSection } from "@/components/maker-lab-section"
import { ProjectsSection } from "@/components/projects-section"
import { QuoteSection } from "@/components/quote-section"
import { Footer } from "@/components/footer"
import { LoadingScreen } from "@/components/loading-screen"
import { GameHUD } from "@/components/game-hud"
import { ScrollAssemblyCanvas } from "@/components/three/scroll-assembly-canvas"

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2800)
    return () => clearTimeout(timer)
  }, [])

  return (
    <LanguageProvider>
      <AnimatePresence mode="wait">
        {isLoading && <LoadingScreen key="loader" />}
      </AnimatePresence>
      {!isLoading && (
        <main className="relative min-h-screen">
          <ScrollAssemblyCanvas />
          <Navbar />
          <GameHUD />
          <HeroSection />
          <AboutSection />
          <TechStackSection />
          <MakerLabSection />
          <ProjectsSection />
          <QuoteSection />
          <Footer />
        </main>
      )}
    </LanguageProvider>
  )
}

