import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { TechStackSection } from "@/components/tech-stack-section"
import { ProjectsSection } from "@/components/projects-section"
import { QuoteSection } from "@/components/quote-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="relative">
      <Navbar />
      <HeroSection />
      <TechStackSection />
      <ProjectsSection />
      <QuoteSection />
      <Footer />
    </main>
  )
}
