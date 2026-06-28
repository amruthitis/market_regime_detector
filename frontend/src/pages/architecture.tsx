import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import {
  Database, BarChart3, Network, Search, Activity,
  Cpu, GitBranch, Box, ArrowDown,
  Server, HardDrive, FileText, FlaskConical,
  Sliders, Layers, Code,
} from "lucide-react"

type Mode = "conceptual" | "technical"

interface FlowStep {
  icon: React.ComponentType<{ className?: string }>
  label: string
  desc: string
}

const conceptualSteps: FlowStep[] = [
  { icon: Database, label: "Market Data", desc: "Raw price and volume data from exchanges" },
  { icon: BarChart3, label: "Feature Engineering", desc: "Technical indicators and derived metrics" },
  { icon: Network, label: "Representation Learning", desc: "Autoencoder compresses market behavior into a latent space" },
  { icon: Search, label: "Pattern Discovery", desc: "Unsupervised clustering reveals natural market states" },
  { icon: Activity, label: "Market State", desc: "Four distinct regimes that characterize market conditions" },
]

const technicalSteps: FlowStep[] = [
  { icon: Server, label: "FastAPI", desc: "Async Python backend serving predictions via REST endpoints" },
  { icon: HardDrive, label: "Redis Cache", desc: "In-memory cache reduces latency for repeated queries" },
  { icon: FileText, label: "CSV / Yahoo Finance", desc: "Market data ingestion from local files or live feeds" },
  { icon: FlaskConical, label: "Feature Engineering", desc: "Technical indicators computed from raw price data" },
  { icon: Sliders, label: "StandardScaler", desc: "Feature normalization ensures stable model inputs" },
  { icon: Cpu, label: "PyTorch Autoencoder", desc: "Deep neural network for unsupervised representation learning" },
  { icon: GitBranch, label: "KMeans", desc: "Partitions latent space into distinct behavioral clusters" },
  { icon: Code, label: "Prediction API", desc: "Real-time regime classification for new market data" },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.18 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
  },
}

function FlowCard({ step, index, total, technical }: { step: FlowStep; index: number; total: number; technical: boolean }) {
  const Icon = step.icon
  return (
    <motion.div variants={itemVariants} className="flex w-full flex-col items-center">
      <Card
        glow
        className={cn(
          "w-full border border-white/10 bg-white/5 transition-shadow duration-300 hover:shadow-2xl",
          technical ? "p-5" : "p-6 md:p-8"
        )}
      >
        <div className="flex items-center gap-5 text-left w-full">
          <div
            className={cn(
              "inline-flex shrink-0 rounded-xl bg-white/10",
              technical ? "p-2.5" : "p-4"
            )}
          >
            <Icon className={cn("text-accent", technical ? "h-5 w-5" : "h-8 w-8")} />
          </div>
          <div className="min-w-0 flex-1">
            <h3
              className={cn(
                "font-semibold text-white",
                technical ? "text-base" : "text-xl"
              )}
            >
              {step.label}
            </h3>
            <p
              className={cn(
                "text-text-secondary break-words",
                technical ? "mt-0.5 text-sm" : "mt-1 text-sm"
              )}
            >
              {step.desc}
            </p>
          </div>
        </div>
      </Card>
      {index < total - 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="flex justify-center py-3"
        >
          <ArrowDown className={cn("text-white/30", technical ? "h-4 w-4" : "h-5 w-5")} />
        </motion.div>
      )}
    </motion.div>
  )
}

function Toggle({ mode, onToggle }: { mode: Mode; onToggle: (m: Mode) => void }) {
  return (
    <div className="relative inline-flex rounded-full border border-white/10 bg-white/5 p-1">
      <div
        className={cn(
          "absolute inset-y-1 rounded-full bg-white/10 transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]",
          mode === "conceptual" ? "left-1 right-1/2" : "left-1/2 right-1"
        )}
      />
      {(["conceptual", "technical"] as Mode[]).map((m) => (
        <button
          key={m}
          onClick={() => onToggle(m)}
          className={cn(
            "relative z-10 rounded-full px-6 py-2 text-sm font-medium transition-colors duration-200",
            mode === m ? "text-white" : "text-text-secondary hover:text-white"
          )}
        >
          {m === "conceptual" ? "Conceptual" : "Technical"}
        </button>
      ))}
    </div>
  )
}

export function ArchitecturePage() {
  const [mode, setMode] = useState<Mode>("conceptual")
  const steps = mode === "conceptual" ? conceptualSteps : technicalSteps
  const IconBox = Box

  return (
    <div className="mx-auto max-w-5xl px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-16 text-center"
      >
        <div className="mb-4 inline-flex rounded-xl bg-white/5 p-3">
          <Layers className="h-6 w-6 text-accent" />
        </div>
        <h1 className="mb-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Architecture
        </h1>
        <p className="mb-8 text-lg text-text-secondary">
          From raw data to market state — the pipeline in full view.
        </p>
        <div className="flex justify-center">
          <Toggle mode={mode} onToggle={setMode} />
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center"
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex w-full max-w-2xl flex-col items-center"
          >
            {steps.map((step, i) => (
              <FlowCard
                key={step.label}
                step={step}
                index={i}
                total={steps.length}
                technical={mode === "technical"}
              />
            ))}
          </motion.div>

          {mode === "conceptual" && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-16 flex items-center gap-3 text-sm text-text-secondary"
            >
              <IconBox className="h-4 w-4" />
              <span>Each layer distills the market signal further</span>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}