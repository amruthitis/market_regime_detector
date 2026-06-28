import { useState, useEffect } from "react"
import { AnimatePresence } from "framer-motion"
import { Navigation } from "@/components/shared/navigation"
import { Footer } from "@/components/shared/footer"
import { LandingPage } from "@/pages/landing"
import { PredictionPage } from "@/pages/prediction"
import { ArchitecturePage } from "@/pages/architecture"
import { AboutPage } from "@/pages/about"
import { Component as EtherealShadow } from "@/components/ui/etheral-shadow"

type Page = "/" | "/prediction" | "/architecture" | "/about"

function getPath(): Page {
  const hash = window.location.hash.replace("#", "") || "/"
  return hash as Page
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>(getPath)

  useEffect(() => {
    const onHashChange = () => setCurrentPage(getPath())
    window.addEventListener("hashchange", onHashChange)
    return () => window.removeEventListener("hashchange", onHashChange)
  }, [])

  const navigate = (path: string) => {
    window.location.hash = path
  }

  const renderPage = () => {
    switch (currentPage) {
      case "/prediction":
        return <PredictionPage />
      case "/architecture":
        return <ArchitecturePage />
      case "/about":
        return <AboutPage />
      default:
        return <LandingPage onNavigate={navigate} />
    }
  }

  return (
    <div className="relative min-h-screen bg-bg-primary overflow-x-hidden">
      {/* Ethereal Shadow Background Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-45">
        <EtherealShadow
          showTitle={false}
          color="rgba(110, 231, 183, 0.15)" // Soft emerald-mint tint matching the branding
          animation={{ scale: 50, speed: 12 }} // Slow, optimized noise animation
          noise={{ opacity: 0.12, scale: 0.8 }} // Fine grain noise texture
          sizing="fill"
        />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navigation activePath={currentPage} onNavigate={navigate} />
        <main className="flex-grow pt-16">
          <AnimatePresence mode="wait">
            <div key={currentPage}>{renderPage()}</div>
          </AnimatePresence>
        </main>
        <Footer />
      </div>
    </div>
  )
}
