import { useState, useCallback, useMemo } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart3,
  DollarSign,
  LineChart,
  Calendar,
  Info,
} from "lucide-react"
import { Canvas } from "@react-three/fiber"
import { LatentScatter } from "@/components/temporal/latent-scatter"

const REGIMES = ["bullish", "bearish", "crisis", "sideways"] as const
type Regime = (typeof REGIMES)[number]

const REGIME_COLORS: Record<Regime, string> = {
  bullish: "rgba(34, 197, 94, 0.08)",
  bearish: "rgba(239, 68, 68, 0.08)",
  crisis: "rgba(124, 58, 237, 0.08)",
  sideways: "rgba(250, 204, 21, 0.08)",
}

const REGIME_BADGE: Record<Regime, "bull" | "bear" | "crisis" | "sideways"> = {
  bullish: "bull",
  bearish: "bear",
  crisis: "crisis",
  sideways: "sideways",
}

const EVENTS = [
  { year: 2000, label: "Dot-com Bubble", range: [1999, 2002] },
  { year: 2008, label: "Financial Crisis", range: [2007, 2009] },
  { year: 2020, label: "COVID Crash", range: [2020, 2020] },
  { year: 2022, label: "Inflation Period", range: [2021, 2023] },
  { year: 2023, label: "Recovery", range: [2023, 2024] },
]

const MARKET_DATA = [
  { label: "S&P500", value: "5,782.45", change: "+0.32%", direction: "up" as const, icon: LineChart },
  { label: "VIX", value: "16.32", change: "-2.1%", direction: "down" as const, icon: Activity },
  { label: "10Y Treasury", value: "4.25%", change: "+0.03%", direction: "up" as const, icon: BarChart3 },
  { label: "3M Treasury", value: "4.78%", change: "-0.01%", direction: "down" as const, icon: DollarSign },
  { label: "Volume", value: "4.2B", change: "+8%", direction: "up" as const, icon: BarChart3 },
]

const MIN_YEAR = 2000
const MAX_YEAR = 2026

function generateMockData(selectedYear: number) {
  const bullishCenter = [0.6, 0.6]
  const bearishCenter = [-0.6, -0.6]
  const crisisCenter = [-0.6, 0.6]
  const sidewaysCenter = [0.6, -0.6]

  const points: Array<{ x: number; y: number; z: number; regime: Regime }> = []
  const seed = selectedYear - 2000

  const rng = (i: number, j: number) => {
    const x = Math.sin((i * 9301 + j * 49297 + seed * 12345) * 0.618) * 0.5 + 0.5
    return x
  }

  let idx = 0
  for (const center of [bullishCenter, bearishCenter, crisisCenter, sidewaysCenter]) {
    const regime = REGIMES[idx]
    for (let i = 0; i < 25; i++) {
      const angle = rng(idx * 100 + i, 0) * Math.PI * 2
      const radius = rng(idx * 100 + i, 1) * 0.3
      points.push({
        x: center[0] + Math.cos(angle) * radius,
        y: center[1] + Math.sin(angle) * radius,
        z: 0,
        regime,
      })
    }
    idx++
  }

  const regimeIndex = Math.floor(seed % 4)
  const currentRegime = REGIMES[regimeIndex]
  const currentCenter = [bullishCenter, bearishCenter, crisisCenter, sidewaysCenter][regimeIndex]

  return { points, currentPoint: { x: currentCenter[0], y: currentCenter[1], z: 0, regime: currentRegime }, currentRegime }
}

function getRegimeColor(regime: Regime) {
  const map: Record<Regime, string> = {
    bullish: "#22C55E",
    bearish: "#EF4444",
    crisis: "#7C3AED",
    sideways: "#FACC15",
  }
  return map[regime]
}

export function TemporalExplorerPage() {
  const [sliderYear, setSliderYear] = useState(2024)
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null)

  const { points, currentPoint, currentRegime } = useMemo(
    () => generateMockData(sliderYear),
    [sliderYear],
  )

  const handleEventClick = useCallback((year: number) => {
    setSliderYear(year)
    setSelectedEvent(EVENTS.find((e) => e.year === year)?.label ?? null)
  }, [])

  const handleSliderChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderYear(Number(e.target.value))
    setSelectedEvent(null)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative min-h-screen"
      style={{
        backgroundColor: REGIME_COLORS[currentRegime],
        transition: "background-color 1.2s ease",
      }}
    >
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Temporal Explorer</h1>
            <p className="mt-1 text-sm text-text-secondary">
              Scrub through time to explore market regimes
            </p>
          </div>
          <Badge variant={REGIME_BADGE[currentRegime]}>
            <span
              className="mr-1.5 inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: getRegimeColor(currentRegime) }}
            />
            {currentRegime.charAt(0).toUpperCase() + currentRegime.slice(1)}
          </Badge>
        </div>

        {/* Live Market Dashboard */}
        <div className="mb-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {MARKET_DATA.map((item) => {
            const Icon = item.icon
            const DirectionIcon =
              item.direction === "up" ? TrendingUp : TrendingDown
            const directionColor =
              item.direction === "up" ? "text-bull" : "text-bear"
            return (
              <Card key={item.label} className="px-4 py-3">
                <div className="mb-1 flex items-center gap-1.5 text-xs text-text-secondary">
                  <Icon className="h-3.5 w-3.5" />
                  {item.label}
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-semibold text-text-primary">
                    {item.value}
                  </span>
                  <span
                    className={`flex items-center gap-0.5 text-xs font-medium ${directionColor}`}
                  >
                    <DirectionIcon className="h-3 w-3" />
                    {item.change}
                  </span>
                </div>
              </Card>
            )
          })}
        </div>

        {/* Timeline */}
        <Card className="mb-8 px-6 py-6 relative overflow-visible">
          <div className="mb-6 flex items-center justify-between">
            <span className="text-sm font-medium text-text-primary">
              Historical Timeline
            </span>
            <span className="text-xs text-text-secondary font-bold bg-white/10 px-2 py-0.5 rounded">
              {Math.floor(sliderYear)}
            </span>
          </div>

          {/* Safe inner boundary container for markers */}
          <div className="relative mx-3 mb-6 h-6">
            {EVENTS.map((event) => {
              const pos =
                ((event.year - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100
              const isActive =
                selectedEvent === event.label
              return (
                <button
                  key={event.label}
                  onClick={() => handleEventClick(event.year)}
                  className={`group absolute z-10 flex flex-col items-center transition-all duration-300 top-0 ${isActive ? "scale-110" : ""
                    }`}
                  style={{ left: `${pos}%`, transform: `translateX(-50%)` }}
                >
                  <span
                    className={`mb-1 whitespace-nowrap text-[10px] font-bold transition-colors ${isActive
                        ? "text-accent"
                        : "text-text-secondary/40 group-hover:text-text-secondary/80"
                      }`}
                  >
                    {event.year}
                  </span>
                  <span
                    className={`block h-3 w-3 rounded-full border-2 transition-all ${isActive
                        ? "border-accent bg-accent shadow-lg shadow-accent/30"
                        : "border-white/20 bg-bg-primary group-hover:border-white/40"
                      }`}
                  />
                </button>
              )
            })}
          </div>

          {/* Slider track */}
          <div className="relative mt-4 mx-3">
            <div className="absolute left-0 right-0 top-1/2 h-0.5 -translate-y-1/2 rounded-full bg-white/10" />
            <div
              className="absolute left-0 top-1/2 h-0.5 -translate-y-1/2 rounded-full bg-accent transition-all duration-150"
              style={{
                width: `${((sliderYear - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100}%`,
              }}
            />
            <input
              type="range"
              min={MIN_YEAR}
              max={MAX_YEAR}
              step={0.1}
              value={sliderYear}
              onChange={handleSliderChange}
              className="relative w-full cursor-pointer appearance-none bg-transparent outline-none block
                [&::-webkit-slider-thumb]:h-5
                [&::-webkit-slider-thumb]:w-5
                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:border-2
                [&::-webkit-slider-thumb]:border-accent
                [&::-webkit-slider-thumb]:bg-bg-primary
                [&::-webkit-slider-thumb]:shadow-lg
                [&::-webkit-slider-thumb]:shadow-accent/20
                [&::-webkit-slider-thumb]:transition-transform
                [&::-webkit-slider-thumb]:duration-150
                [&::-webkit-slider-thumb]:hover:scale-125
                [&::-moz-range-thumb]:h-5
                [&::-moz-range-thumb]:w-5
                [&::-moz-range-thumb]:rounded-full
                [&::-moz-range-thumb]:border-2
                [&::-moz-range-thumb]:border-accent
                [&::-moz-range-thumb]:bg-bg-primary"
            />
          </div>

          {/* Year labels */}
          <div className="mt-3 mx-3 flex justify-between text-[10px] font-medium text-text-secondary/40">
            <span>{MIN_YEAR}</span>
            <span>{MAX_YEAR}</span>
          </div>

          {/* Quick-Select Event Chips */}
          <div className="mt-6 border-t border-white/5 pt-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary/50">
              Quick-Select Historical Events
            </span>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {EVENTS.map((event) => {
                const isActive = selectedEvent === event.label
                return (
                  <button
                    key={event.label}
                    onClick={() => handleEventClick(event.year)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200 border ${
                      isActive
                        ? "bg-accent/15 border-accent text-accent shadow-sm"
                        : "bg-white/5 border-white/5 text-text-secondary hover:bg-white/10 hover:border-white/10 hover:text-text-primary"
                    }`}
                  >
                    {event.label} ({event.year})
                  </button>
                )
              })}
            </div>
          </div>
        </Card>

        {/* Latent Space + Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 3D Scatter */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <div className="flex flex-wrap items-center justify-between border-b border-white/5 px-5 py-3 gap-2">
                <span className="text-sm font-medium text-text-primary">
                  Latent Space Visualization
                </span>
                <div className="flex flex-wrap items-center gap-3">
                  {REGIMES.map((r) => (
                    <span
                      key={r}
                      className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-text-secondary"
                    >
                      <span
                        className="inline-block h-2 w-2 rounded-full"
                        style={{ backgroundColor: getRegimeColor(r) }}
                      />
                      {r}
                    </span>
                  ))}
                </div>
              </div>
              <div className="h-[400px] w-full">
                <Canvas
                  camera={{ position: [2, 2, 2.5], fov: 50 }}
                  dpr={[1, 2]}
                  gl={{ antialias: true }}
                >
                  <ambientLight intensity={0.4} />
                  <pointLight position={[5, 5, 5]} intensity={0.6} />
                  <LatentScatter
                    currentRegime={currentRegime}
                    selectedDate={String(sliderYear)}
                    mockData={points}
                    currentPoint={currentPoint}
                  />
                </Canvas>
              </div>
              <div className="border-t border-white/5 bg-white/[0.02] px-5 py-4 text-xs text-text-secondary leading-relaxed">
                <div className="flex items-center gap-1.5 font-semibold text-text-primary mb-1">
                  <Info className="h-3.5 w-3.5 text-accent" />
                  Understanding the Latent Space
                </div>
                <p>
                  The deep learning autoencoder compresses high-dimensional market features (VIX, volume, yields, returns) into this 3D coordinate space. Similar market states naturally cluster together: <span className="text-bull font-medium">Bullish</span>, <span className="text-bear font-medium">Bearish</span>, <span className="text-sideways font-medium">Sideways</span>, and <span className="text-crisis font-medium">Crisis</span>. The larger pulsing point represents the market state at the selected time.
                </p>
              </div>
            </Card>
          </div>

          {/* Regime Info Panel */}
          <div className="space-y-4">
            <Card className="px-5 py-4">
              <h3 className="mb-3 text-sm font-medium text-text-primary">
                Current Regime
              </h3>
              <div className="mb-3 flex items-center gap-2">
                <span
                  className="inline-block h-4 w-4 rounded-full"
                  style={{ backgroundColor: getRegimeColor(currentRegime) }}
                />
                <span className="text-xl font-bold text-text-primary">
                  {currentRegime.charAt(0).toUpperCase() +
                    currentRegime.slice(1)}
                </span>
              </div>
              <p className="text-xs leading-relaxed text-text-secondary">
                {currentRegime === "bullish" &&
                  "Markets are exhibiting strong upward momentum with increasing volume and positive sentiment across sectors."}
                {currentRegime === "bearish" &&
                  "Markets are in a downtrend with declining prices and elevated volatility suggesting continued weakness."}
                {currentRegime === "crisis" &&
                  "Markets are experiencing extreme stress with panic selling, liquidity concerns, and flight to safety."}
                {currentRegime === "sideways" &&
                  "Markets are range-bound with low volatility as buyers and sellers remain in equilibrium."}
              </p>
            </Card>

            <Card className="px-5 py-4">
              <h3 className="mb-4 text-sm font-medium text-text-primary">
                Key Metrics
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-medium text-text-secondary">Confidence</span>
                    <span className="font-semibold text-text-primary bg-white/5 px-2 py-0.5 rounded">
                      {Math.floor(Math.abs(Math.sin(sliderYear * 0.3)) * 20 + 78)}%
                    </span>
                  </div>
                  <p className="text-[10px] text-text-secondary/70 leading-normal">
                    Model classification certainty based on proximity to the cluster center.
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-medium text-text-secondary">Regime Stability</span>
                    <span className="font-semibold text-text-primary bg-white/5 px-2 py-0.5 rounded">
                      {currentRegime === "crisis"
                        ? "Low"
                        : currentRegime === "sideways"
                          ? "High"
                          : "Moderate"}
                    </span>
                  </div>
                  <p className="text-[10px] text-text-secondary/70 leading-normal">
                    Historical persistence of the state (Crisis is highly volatile; Sideways is sticky).
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-medium text-text-secondary">Prediction Horizon</span>
                    <span className="font-semibold text-text-primary bg-white/5 px-2 py-0.5 rounded">
                      {sliderYear < 2020 ? "Historical" : sliderYear < 2025 ? "Near-term" : "Forecast"}
                    </span>
                  </div>
                  <p className="text-[10px] text-text-secondary/70 leading-normal">
                    Target period classification relative to available training datasets.
                  </p>
                </div>
              </div>
            </Card>

            {selectedEvent && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-accent/20 bg-accent/5 px-5 py-3"
              >
                <div className="mb-1 flex items-center gap-1.5 text-xs text-accent">
                  <Calendar className="h-3.5 w-3.5" />
                  Event Selected
                </div>
                <p className="text-sm font-medium text-text-primary">
                  {selectedEvent}
                </p>
                <p className="mt-0.5 text-[11px] text-text-secondary">
                  Scrub the timeline to explore market states around this event.
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}