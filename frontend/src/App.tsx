import { useState, useEffect } from "react"
import { AnimatePresence } from "framer-motion"
import { Navigation } from "@/components/shared/navigation"
import { Footer } from "@/components/shared/footer"
import { LandingPage } from "@/pages/landing"
import { PredictionPage } from "@/pages/prediction"
import { TemporalExplorerPage } from "@/pages/temporal-explorer"
import { ArchitecturePage } from "@/pages/architecture"
import { AboutPage } from "@/pages/about"

type Page = "/" | "/prediction" | "/temporal" | "/architecture" | "/about"

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
      case "/temporal":
        return <TemporalExplorerPage />
      case "/architecture":
        return <ArchitecturePage />
      case "/about":
        return <AboutPage />
      default:
        return <LandingPage onNavigate={navigate} />
    }
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navigation activePath={currentPage} onNavigate={navigate} />
      <main className="pt-16">
        <AnimatePresence mode="wait">
          <div key={currentPage}>{renderPage()}</div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  )
}
