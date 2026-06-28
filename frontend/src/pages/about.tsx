import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Cpu, Network, Layers, Sparkles, ArrowRight } from "lucide-react"

const approachCards = [
  {
    icon: Layers,
    title: "Compression",
    desc: "The autoencoder compresses market behavior into a lower-dimensional representation, distilling noisy price data into a compact latent space.",
  },
  {
    icon: Network,
    title: "Discovery",
    desc: "KMeans clustering discovers naturally occurring market states within the latent space, grouping similar behavioral patterns together.",
  },
  {
    icon: Cpu,
    title: "Classification",
    desc: "These clusters become the four market regimes — Bull, Bear, Sideways, and Crisis — each with a distinct profile for informed decision-making.",
  },
]

const techStack = [
  { title: "React + TypeScript", desc: "Interactive frontend with real-time regime visualization" },
  { title: "FastAPI", desc: "Async Python backend for low-latency API responses" },
  { title: "Redis Cache", desc: "In-memory caching layer for repeated predictions" },
  { title: "PyTorch", desc: "Deep learning framework for the autoencoder model" },
  { title: "Scikit-learn", desc: "KMeans clustering for regime discovery" },
  { title: "Yahoo Finance", desc: "Live and historical market data ingestion" },
]

function fadeInUp(offset = 20) {
  return {
    initial: { opacity: 0, y: offset },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-10%" as const },
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
  }
}

export function AboutPage() {
  const navigateToPrediction = () => {
    window.location.hash = "/prediction"
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-24">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        className="mb-32"
      >
        <h1 className="mb-6 text-5xl font-bold tracking-tight text-white sm:text-6xl md:text-7xl">
          Understanding<br />
          <span className="bg-gradient-to-r from-accent to-white bg-clip-text text-transparent">
            Market Regimes
          </span>
        </h1>
        <p className="max-w-3xl text-xl leading-relaxed text-text-secondary">
          Markets produce enormous amounts of data every second. Beneath the noise,
          they move through distinct states — each with its own character, risk profile,
          and opportunity.
        </p>
      </motion.section>

      {/* The Problem */}
      <motion.section {...fadeInUp()} className="mb-32">
        <h2 className="mb-6 text-3xl font-semibold tracking-tight text-white">The Problem</h2>
        <p className="max-w-3xl text-lg leading-relaxed text-text-secondary">
          Markets aren't random. They move through different states — bull runs, bear
          slides, sideways consolidations, and crisis-level volatility. Most approaches
          treat all market conditions the same, but successful strategies adapt to the
          regime at hand. The challenge is knowing which regime you're in before it's too late.
        </p>
      </motion.section>

      {/* The Approach */}
      <motion.section {...fadeInUp()} className="mb-32">
        <h2 className="mb-16 text-3xl font-semibold tracking-tight text-white">The Approach</h2>
        <div className="grid gap-8 md:grid-cols-3 items-stretch">
          {approachCards.map((item, i) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-5%" }}
                transition={{ duration: 0.6, delay: i * 0.15, ease: [0.25, 0.1, 0.25, 1] }}
                whileHover={{ y: -6 }}
                className="h-full"
              >
                <Card glow className="h-full border border-white/10 bg-white/5 p-8 flex flex-col items-start text-left">
                  <div className="mb-5 inline-flex rounded-xl bg-white/10 p-3">
                    <Icon className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-white">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-text-secondary mt-auto">{item.desc}</p>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </motion.section>

      {/* Technical Architecture */}
      <motion.section {...fadeInUp()} className="mb-32">
        <h2 className="mb-8 text-3xl font-semibold tracking-tight text-white">
          Technical Architecture
        </h2>
        <p className="mb-12 max-w-3xl text-lg leading-relaxed text-text-secondary">
          The system is built on a modern, modular stack — from data ingestion to
          real-time classification.
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
          {techStack.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-5%" }}
              transition={{ duration: 0.4, delay: i * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
              className="h-full"
            >
              <Card className="border border-white/5 bg-white/[0.03] p-5 h-full flex flex-col justify-between">
                <h4 className="mb-1 text-sm font-semibold text-white">{item.title}</h4>
                <p className="text-sm leading-relaxed text-text-secondary mt-1">{item.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Call to Action */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className="text-center"
      >
        <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-16">
          <Sparkles className="mx-auto mb-6 h-10 w-10 text-accent" />
          <h2 className="mb-4 text-3xl font-semibold tracking-tight text-white">
            Ready to see the market differently?
          </h2>
          <p className="mb-8 text-lg text-text-secondary">
            Upload your data or connect to a live feed and discover the regime in real time.
          </p>
          <Button variant="primary" size="xl" onClick={navigateToPrediction}>
            Try the Prediction
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </motion.section>
    </div>
  )
}