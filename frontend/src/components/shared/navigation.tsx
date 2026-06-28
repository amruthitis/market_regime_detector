import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "Home", href: "/" },
  { label: "Prediction", href: "/prediction" },
  { label: "Architecture", href: "/architecture" },
  { label: "About", href: "/about" },
]

interface NavigationProps {
  activePath: string
  onNavigate: (path: string) => void
}

export function Navigation({ activePath, onNavigate }: NavigationProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()
  const backgroundColor = useTransform(
    scrollY,
    [0, 100],
    ["rgba(9, 9, 11, 0)", "rgba(9, 9, 11, 0.8)"]
  )
  const backdropBlur = useTransform(scrollY, [0, 100], [0, 12])

  return (
    <motion.nav
      ref={ref}
      style={{ backgroundColor, backdropFilter: `blur(${backdropBlur}px)` }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-white/5"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <button
          onClick={() => onNavigate("/")}
          className="text-lg font-semibold tracking-tight text-white"
        >
          La Chronos
        </button>
        <div className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <button
              key={item.href}
              onClick={() => onNavigate(item.href)}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200",
                activePath === item.href
                  ? "text-white bg-white/10"
                  : "text-text-secondary hover:text-white hover:bg-white/5"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </motion.nav>
  )
}
