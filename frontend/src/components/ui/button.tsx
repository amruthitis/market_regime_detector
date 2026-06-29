import * as React from "react"
import { cn } from "@/lib/utils"

const buttonVariants = {
  default: "bg-white/10 text-white hover:bg-white/20 border border-white/10",
  primary: "bg-accent text-bg-primary hover:bg-accent/90 font-semibold",
  ghost: "hover:bg-white/5 text-text-secondary",
  outline: "border border-white/20 text-white hover:bg-white/10",
} as const

const buttonSizes = {
  default: "h-10 px-6 py-2",
  sm: "h-8 px-4 text-sm",
  lg: "h-12 px-8 text-lg",
  xl: "h-14 px-10 text-xl",
} as const

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof buttonVariants
  size?: keyof typeof buttonSizes
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-xl font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:pointer-events-none",
          buttonVariants[variant],
          buttonSizes[size],
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
