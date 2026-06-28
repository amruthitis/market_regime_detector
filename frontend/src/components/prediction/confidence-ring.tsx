import { useEffect, useState } from "react"
import { animate } from "framer-motion"

interface ConfidenceRingProps {
  value: number
  size?: number
  strokeWidth?: number
  color?: string
}

function getConfidenceColor(value: number): string {
  if (value >= 0.7) return "#22C55E"
  if (value >= 0.4) return "#FACC15"
  return "#EF4444"
}

export function ConfidenceRing({
  value,
  size = 160,
  strokeWidth = 8,
  color,
}: ConfidenceRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const center = size / 2
  const displayColor = color ?? getConfidenceColor(value)

  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1.5,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => setProgress(latest),
    })
    return controls.stop
  }, [value])

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={displayColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - progress)}
        />
      </svg>
      <span
        className="absolute text-2xl font-bold"
        style={{ color: displayColor }}
      >
        {Math.round(value * 100)}%
      </span>
    </div>
  )
}
