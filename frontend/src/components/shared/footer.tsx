export function Footer() {
  return (
    <footer className="border-t border-white/5 py-8">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-text-secondary">
            Built with React, FastAPI and PyTorch
          </p>
          <div className="flex items-center gap-6">
            <a
              href="https://github.com/amruthitis/market_regime_detector"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-text-secondary hover:text-white transition-colors duration-200"
            >
              GitHub
            </a>
            <a
              href="#"
              className="text-sm text-text-secondary hover:text-white transition-colors duration-200"
            >
              LinkedIn
            </a>
            <a
              href="#"
              className="text-sm text-text-secondary hover:text-white transition-colors duration-200"
            >
              Documentation
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
