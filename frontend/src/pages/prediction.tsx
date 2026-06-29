import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { usePrediction } from "@/hooks/usePrediction"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Calendar,
  BarChart3,
  Activity,
  LineChart,
  DollarSign,
  Waves,
} from "lucide-react"
import { ConfidenceRing } from "@/components/prediction/confidence-ring"

const LOADING_STEPS = [
  "Connecting to Market Data",
  "Engineering Features",
  "Normalizing Inputs",
  "Compressing into Latent Space",
  "Searching Historical Regimes",
  "Constructing Market State",
] as const

const FEATURE_DATA = [
  { key: "VIX", value: 18.5, icon: Activity, decimals: 1, suffix: "", transform: undefined as ((v: number) => number) | undefined },
  { key: "Volume", value: 4520000000, icon: BarChart3, decimals: 2, suffix: "B", transform: (v: number) => v / 1e9 },
  { key: "Yield Spread", value: 1.25, icon: DollarSign, decimals: 2, suffix: "", transform: undefined },
  { key: "Returns", value: 0.42, icon: LineChart, decimals: 2, suffix: "%", transform: undefined },
  { key: "Volatility", value: 0.78, icon: Waves, decimals: 2, suffix: "%", transform: undefined },
] as const

const REGIME_COLORS: Record<string, string> = {
  Bullish: "#22C55E",
  Bearish: "#EF4444",
  Sideways: "#FACC15",
  Crisis: "#7C3AED",
}

const REGIME_EXPLANATIONS: Record<string, string> = {
  Bullish:
    "Low volatility combined with positive market momentum and a healthy yield spread indicate conditions similar to previous Bullish market regimes.",
  Bearish:
    "Elevated volatility combined with negative market momentum and an inverted yield spread indicate conditions similar to previous Bearish market regimes.",
  Sideways:
    "Mixed signals with moderate volatility and neutral market momentum indicate conditions similar to previous Sideways market regimes.",
  Crisis:
    "Extreme volatility combined with severe negative momentum and yield curve inversion indicate conditions similar to previous Crisis market regimes.",
}

function AnimatedNumber({
  value,
  decimals = 0,
  transform,
  suffix = "",
}: {
  value: number
  decimals?: number
  transform?: (v: number) => number
  suffix?: string
}) {
  const [display, setDisplay] = useState(0)
  const frameRef = useRef<number>(0)

  useEffect(() => {
    const duration = 1000
    const startTime = performance.now()

    const animateFrame = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const p = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setDisplay(eased * value)

      if (p < 1) {
        frameRef.current = requestAnimationFrame(animateFrame)
      }
    }

    frameRef.current = requestAnimationFrame(animateFrame)
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [value])

  const displayValue = transform ? transform(display) : display

  return (
    <>{displayValue.toFixed(decimals)}{suffix}</>
  )
}

export function PredictionPage() {
  const [dateInput, setDateInput] = useState("")
  const [analysisDate, setAnalysisDate] = useState<string | undefined>(undefined)
  const [trigger, setTrigger] = useState(0)
  const [pageState, setPageState] = useState<"initial" | "loading" | "result">("initial")
  const [visibleSteps, setVisibleSteps] = useState(0)
  const [animationDone, setAnimationDone] = useState(false)
  const [hasData, setHasData] = useState(false)

  const { data, refetch, isFetching } = usePrediction(analysisDate)
  const wasFetching = useRef(false)

  useEffect(() => {
    if (trigger > 0) {
      refetch()
    }
  }, [trigger, refetch])

  useEffect(() => {
    if (wasFetching.current && !isFetching && pageState === "loading" && data) {
      setHasData(true)
    }
    wasFetching.current = isFetching
  }, [isFetching, pageState, data])

  useEffect(() => {
    if (pageState !== "loading") {
      return
    }

    if (visibleSteps < LOADING_STEPS.length) {
      const timer = setTimeout(
        () => setVisibleSteps((prev) => prev + 1),
        300,
      )
      return () => clearTimeout(timer)
    } else {
      setAnimationDone(true)
    }
  }, [pageState, visibleSteps])

  useEffect(() => {
    if (animationDone && hasData && pageState === "loading") {
      const timer = setTimeout(() => setPageState("result"), 400)
      return () => clearTimeout(timer)
    }
  }, [animationDone, hasData, pageState])

  const startAnalysis = (date?: string) => {
    setAnalysisDate(date)
    setPageState("loading")
    setVisibleSteps(0)
    setAnimationDone(false)
    setHasData(false)
    wasFetching.current = false
    setTrigger((t) => t + 1)
  }

  const resetToInitial = () => {
    setPageState("initial")
    setDateInput("")
    setAnalysisDate(undefined)
    setHasData(false)
    setAnimationDone(false)
    setVisibleSteps(0)
  }

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <AnimatePresence mode="wait">
        {pageState === "initial" && (
          <motion.div
            key="initial"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-6"
          >
            <Card className="w-full max-w-xl">
              <CardContent className="p-6 sm:p-12 text-center">
                <h1 className="text-3xl font-bold tracking-tight text-white">
                  Market Regime Detector
                </h1>
                <p className="mt-3 text-text-secondary">
                  Analyze current market conditions using deep learning
                </p>

                <div className="mt-10 space-y-4">
                  <div className="relative">
                    <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
                    <Input
                      type="date"
                      value={dateInput}
                      onChange={(e) => setDateInput(e.target.value)}
                      className="pl-10"
                      placeholder="Select date (optional)"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      variant="primary"
                      size="lg"
                      className="w-full sm:flex-1"
                      onClick={() => startAnalysis(dateInput || undefined)}
                    >
                      Analyze Market
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full sm:flex-1"
                      onClick={() => startAnalysis(undefined)}
                    >
                      Analyze Today
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {pageState === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-6"
          >
            <div className="w-full max-w-md space-y-5">
              {LOADING_STEPS.map((step, i) => {
                const isVisible = visibleSteps > i
                const isLast = i === LOADING_STEPS.length - 1

                return (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, y: 10 }}
                    animate={
                      isVisible
                        ? { opacity: 1, y: 0 }
                        : { opacity: 0, y: 10 }
                    }
                    transition={{ duration: 0.3 }}
                    className="flex items-center gap-4"
                  >
                    <div className="flex h-6 w-6 items-center justify-center">
                      {isVisible ? (
                        isLast ? (
                          <span className="text-xs font-semibold text-accent">
                            ✓
                          </span>
                        ) : (
                          <svg
                            className="h-5 w-5 text-accent"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                          >
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                        )
                      ) : (
                        <div className="h-2 w-2 rounded-full bg-white/20" />
                      )}
                    </div>
                    <span
                      className={
                        isVisible ? "text-white" : "text-text-secondary"
                      }
                    >
                      {step}
                    </span>
                  </motion.div>
                )
              })}

              {visibleSteps > 0 && visibleSteps <= LOADING_STEPS.length && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="pt-4"
                >
                  <Progress
                    value={(visibleSteps / LOADING_STEPS.length) * 100}
                  />
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {pageState === "result" && data && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto max-w-6xl space-y-8 px-6 py-12"
          >
            <Card className="overflow-hidden p-0">
              <CardContent className="relative p-12 text-center">
                <div
                  className="pointer-events-none absolute inset-0 opacity-[0.03]"
                  style={{
                    background: `radial-gradient(circle at 50% 50%, ${REGIME_COLORS[data.regime]} 0%, transparent 70%)`,
                  }}
                />
                <p className="mb-2 text-sm font-medium uppercase tracking-widest text-text-secondary">
                  Current Market State
                </p>
                <div className="mt-4 flex items-center justify-center gap-4">
                  <Badge variant={data.regime.toLowerCase() as "bull" | "bear" | "sideways" | "crisis"}>
                    {data.regime} Market
                  </Badge>
                </div>
                <h2
                  className="mt-6 text-6xl font-black tracking-tight md:text-7xl"
                  style={{ color: REGIME_COLORS[data.regime] }}
                >
                  {data.regime}
                </h2>
                <div className="mt-6 flex items-center justify-center gap-4 text-sm text-text-secondary">
                  <span className="flex items-center gap-1.5">
                    {data.source === "Live Market" ? (
                      <Activity className="h-3.5 w-3.5" />
                    ) : (
                      <Calendar className="h-3.5 w-3.5" />
                    )}
                    {data.source}
                  </span>
                  <span className="text-white/10">·</span>
                  <span>
                    {new Date(data.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="mt-8">
                  <Button variant="outline" onClick={resetToInitial}>
                    New Analysis
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-5 items-stretch">
              {FEATURE_DATA.map((feature) => {
                const Icon = feature.icon
                return (
                  <Card
                    key={feature.key}
                    className="group h-full transition-all duration-300 hover:shadow-lg hover:shadow-accent/5"
                  >
                    <CardContent className="p-6 text-center h-full flex flex-col justify-between items-center gap-2">
                      <div>
                        <Icon className="mx-auto h-5 w-5 text-text-secondary" />
                        <p className="mt-3 text-xs font-medium uppercase tracking-wider text-text-secondary">
                          {feature.key}
                        </p>
                      </div>
                      <p className="mt-2 text-2xl font-bold text-white whitespace-nowrap">
                        <AnimatedNumber
                          value={feature.value}
                          decimals={feature.decimals}
                          transform={
                            feature.transform as
                            | ((v: number) => number)
                            | undefined
                          }
                          suffix={feature.suffix}
                        />
                      </p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            <div className="grid gap-8 md:grid-cols-2 items-stretch">
              <Card className="h-full">
                <CardContent className="p-8 text-center h-full flex flex-col justify-center items-center">
                  <ConfidenceRing value={data.confidence} />
                  <h3 className="mt-4 text-lg font-semibold text-white">
                    Confidence
                  </h3>
                  <p className="mt-1 text-sm text-text-secondary">
                    Similarity to historical market regimes
                  </p>
                </CardContent>
              </Card>

              <Card className="flex items-center h-full">
                <CardContent className="p-8 h-full flex flex-col justify-center">
                  <h3 className="text-lg font-semibold text-white">
                    Analysis
                  </h3>
                  <p className="mt-3 leading-relaxed text-text-secondary">
                    {REGIME_EXPLANATIONS[data.regime]}
                  </p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}