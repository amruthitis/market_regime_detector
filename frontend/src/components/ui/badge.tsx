import * as React from "react"
import { cn } from "@/lib/utils"

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "bull" | "bear" | "sideways" | "crisis" | "default"
}

const variantStyles: Record<string, string> = {
  bull: "bg-bull/10 text-bull border-bull/20",
  bear: "bg-bear/10 text-bear border-bear/20",
  sideways: "bg-sideways/10 text-sideways border-sideways/20",
  crisis: "bg-crisis/10 text-crisis border-crisis/20",
  default: "bg-white/5 text-text-secondary border-white/10",
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  )
)
Badge.displayName = "Badge"

export { Badge }
