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
import { JarvisAssistant } from "@/components/jarvis-assistant"
import { TourHudControls } from "@/components/tour-hud-controls"

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <LanguageProvider>
      <AnimatePresence>
        {isLoading && (
          <LoadingScreen
            key="loader"
            onComplete={() => setIsLoading(false)}
          />
        )}
      </AnimatePresence>

      {/* Main page is pre-mounted in the background so 3D shaders and DOM are fully warm */}
      <main className="relative min-h-screen">
        <ScrollAssemblyCanvas />
        <Navbar />
        <GameHUD />
        <TourHudControls />
        <JarvisAssistant isReady={!isLoading} />
        <HeroSection isLoaded={!isLoading} />
        <AboutSection />
        <TechStackSection />
        <MakerLabSection />
        <ProjectsSection />
        <QuoteSection />
        <Footer />
      </main>
    </LanguageProvider>
  )
}

