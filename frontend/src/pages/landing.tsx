import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowDown, TrendingUp, TrendingDown, Minus, AlertTriangle } from "lucide-react"
import { ParticleField } from "@/components/landing/particle-field"

interface LandingPageProps {
  onNavigate: (path: string) => void
}

const regimes = [
  {
    title: "Bull Market",
    description: "Sustained upward momentum with strong buying pressure and increasing asset prices across the market.",
    color: "#22C55E",
    icon: TrendingUp,
  },
  {
    title: "Bear Market",
    description: "Prolonged price declines driven by selling pressure, fear, and deteriorating economic conditions.",
    color: "#EF4444",
    icon: TrendingDown,
  },
  {
    title: "Sideways",
    description: "Price movement within a range-bound channel with no clear directional bias or trend.",
    color: "#FACC15",
    icon: Minus,
  },
  {
    title: "Crisis",
    description: "Extreme volatility with rapid, disorderly moves, panic selling, and systemic risk.",
    color: "#7C3AED",
    icon: AlertTriangle,
  },
]

const architectureSteps = [
  "Market Data",
  "Feature Engineering",
  "Representation Learning",
  "Latent Space",
  "Pattern Discovery",
  "Market State",
]

const statementWords = ["It", "moves", "through", "hidden", "regimes."]

function AnimatedStatement() {
  return (
    <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden py-32">
      <div className="px-4 text-center">
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-8 text-5xl font-light tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl"
        >
          The market is never random.
        </motion.p>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
          {statementWords.map((word, i) => (
            <motion.span
              key={word}
              initial={{ opacity: 0, y: 60, rotateX: -30 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{
                duration: 0.8,
                delay: i * 0.15,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="inline-block text-5xl font-light tracking-tight text-white/80 sm:text-6xl md:text-7xl lg:text-8xl"
            >
              {word}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  )
}

function RegimeCards() {
  return (
    <section className="relative w-full px-4 py-32">
      <div className="mx-auto max-w-7xl">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.6 }}
          className="mb-4 text-center text-4xl font-semibold tracking-tight text-white sm:text-5xl"
        >
          Market Regimes
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-16 text-center text-lg text-text-secondary"
        >
          Every market state reveals a different character. Learn to see them all.
        </motion.p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {regimes.map((regime, i) => {
            const Icon = regime.icon
            return (
              <motion.div
                key={regime.title}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-5%" }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.12,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="group"
              >
                <Card
                  glow
                  className="relative overflow-hidden border-white/10 bg-white/5 p-6 transition-shadow duration-300 hover:shadow-2xl"
                >
                  <div
                    className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-10"
                    style={{
                      background: `radial-gradient(600px circle at 50% 0%, ${regime.color}, transparent)`,
                    }}
                  />
                  <div className="relative z-10">
                    <div
                      className="mb-4 inline-flex rounded-xl p-3"
                      style={{ backgroundColor: `${regime.color}15` }}
                    >
                      <Icon className="h-6 w-6" style={{ color: regime.color }} />
                    </div>
                    <h3 className="mb-2 text-xl font-semibold text-white">{regime.title}</h3>
                    <p className="text-sm leading-relaxed text-text-secondary">{regime.description}</p>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function ArchitectureStep({ step, index, total }: {
  step: string
  index: number
  total: number
}) {
  const isEven = index % 2 === 0

  return (
    <motion.div
      initial={{ opacity: 0.2, scale: 0.9, x: isEven ? -40 : 40 }}
      whileInView={{ opacity: 1, scale: 1, x: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1], delay: index * 0.05 }}
      className="relative flex w-full items-center justify-center py-3"
    >
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 px-8 py-5 text-center backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:bg-white/10">
        <span className="text-lg font-medium text-white">{step}</span>
      </div>
      {index < total - 1 && (
        <div className="absolute -bottom-0 left-1/2 flex h-3 -translate-x-1/2 items-center justify-center">
          <ArrowDown className="h-4 w-4 text-text-secondary" />
        </div>
      )}
    </motion.div>
  )
}

function ArchitecturePreview() {
  return (
    <section className="relative w-full px-4 py-32">
      <div className="mx-auto max-w-6xl">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.6 }}
          className="mb-4 text-center text-4xl font-semibold tracking-tight text-white sm:text-5xl"
        >
          Architecture
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-16 text-center text-lg text-text-secondary"
        >
          From raw data to market state — the pipeline in full view.
        </motion.p>

        <div className="relative flex flex-col items-center gap-0">
          {architectureSteps.map((step, i) => (
            <ArchitectureStep
              key={step}
              step={step}
              index={i}
              total={architectureSteps.length}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-4">
        <ParticleField />
        <div className="relative z-10 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <h1 className="mb-4 bg-gradient-to-b from-white to-white/40 bg-clip-text text-7xl font-bold tracking-tight text-transparent sm:text-8xl md:text-9xl">
              La Chronos
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="mb-16 max-w-2xl text-lg font-medium italic text-accent/90 drop-shadow-[0_0_12px_rgba(110,231,183,0.35)] sm:text-xl"
          >
            Where Time Reveals The Market
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap justify-center gap-10"
          >
            <Button variant="primary" size="xl" className="rounded-full" onClick={() => onNavigate("/prediction")}>
              Begin Analysis
            </Button>
            <Button variant="ghost" size="xl" onClick={() => onNavigate("/about")}>
              Learn More
            </Button>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 z-10 flex flex-col items-center gap-2"
        >
          <span className="text-xs uppercase tracking-widest text-text-secondary">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown className="h-5 w-5 text-text-secondary" />
          </motion.div>
        </motion.div>
      </section>

      <AnimatedStatement />
      <RegimeCards />
      <ArchitecturePreview />
    </div>
  )
}
