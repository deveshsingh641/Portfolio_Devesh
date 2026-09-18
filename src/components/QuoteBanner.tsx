import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { PORTFOLIO_DATA } from "../data/portfolio";

export const QuoteBanner: React.FC = () => {
  const quotes = PORTFOLIO_DATA.quotes || [PORTFOLIO_DATA.quote];
  const [index, setIndex] = useState<number>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = sessionStorage.getItem("portfolio_quote_idx");
        const prevIdx = saved !== null ? parseInt(saved, 10) : -1;
        let nextIdx;
        do {
          nextIdx = Math.floor(Math.random() * quotes.length);
        } while (quotes.length > 1 && nextIdx === prevIdx);
        sessionStorage.setItem("portfolio_quote_idx", nextIdx.toString());
        return nextIdx;
      } catch {
        return Math.floor(Math.random() * quotes.length);
      }
    }
    return 0;
  });

  const [isRotating, setIsRotating] = useState(false);

  const handleNextQuote = () => {
    setIsRotating(true);
    setIndex((prev) => {
      let nextIdx;
      do {
        nextIdx = Math.floor(Math.random() * quotes.length);
      } while (quotes.length > 1 && nextIdx === prev);
      try {
        sessionStorage.setItem("portfolio_quote_idx", nextIdx.toString());
      } catch {}
      return nextIdx;
    });
    setTimeout(() => setIsRotating(false), 500);
  };

  const currentQuote = quotes[index] || quotes[0];

  return (
    <section className="py-16 sm:py-24 md:py-32 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="relative isolate overflow-hidden rounded-[1.75rem] border border-border shadow-2xl bg-card group">
          {/* Background Animated Glows */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
            <div className="absolute inset-0 bg-quote-surface" />
            <div
              className="absolute -bottom-1/3 -right-1/4 h-[110%] w-[95%] animate-quote-drift"
              style={{
                background:
                  "radial-gradient(closest-side, hsl(var(--quote-glow) / 0.85) 0%, hsl(var(--quote-glow) / 0.35) 42%, transparent 80%)",
                willChange: "transform",
              }}
            />
            <div
              className="absolute -left-1/4 bottom-0 h-[95%] w-[85%] animate-quote-drift-slow"
              style={{
                background:
                  "radial-gradient(closest-side, hsl(var(--quote-deep) / 0.75) 0%, hsl(var(--quote-deep) / 0.3) 48%, transparent 78%)",
                willChange: "transform",
              }}
            />
            <div
              className="absolute inset-0 opacity-[0.2] mix-blend-overlay"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
                backgroundSize: "120px 120px",
              }}
            />
          </div>

          {/* Interactive Shuffle Pill on Top-Right */}
          <div className="absolute top-6 right-6 sm:top-8 sm:right-8 z-30">
            <button
              type="button"
              onClick={handleNextQuote}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/80 hover:bg-secondary px-3 py-1.5 text-xs font-mono text-muted-foreground hover:text-foreground transition-all duration-200 shadow-sm backdrop-blur-md active:scale-95 cursor-pointer hover:border-purple-500/40"
              title="Click to see another quote (also changes on every page refresh)"
              aria-label="Next inspiring quote"
            >
              <RefreshCw
                className={`h-3 w-3 text-purple-400 transition-transform duration-500 ${
                  isRotating ? "rotate-180" : ""
                }`}
              />
              <span className="hidden sm:inline">Shuffle</span>
            </button>
          </div>

          {/* Giant Decorative Opening Quote */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-6 left-2 select-none font-display font-semibold leading-none text-foreground/[0.08]"
            style={{ fontSize: "clamp(9rem, 24vw, 18rem)" }}
          >
            “
          </span>

          {/* Text Content with AnimatePresence */}
          <div className="relative z-10 px-6 py-16 sm:px-10 sm:py-20 md:px-16 md:py-24">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="max-w-3xl"
              >
                <blockquote className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-semibold leading-[1.2] tracking-tight text-foreground">
                  {currentQuote.text}
                </blockquote>

                <p className="mt-5 max-w-xl text-sm sm:text-base leading-relaxed text-foreground/70">
                  {currentQuote.subtext}
                </p>

                <div className="mt-8 flex items-center gap-4 sm:mt-10">
                  <span className="h-px w-12 bg-foreground/50 sm:w-16" />
                  <span className="font-serif text-lg italic font-light tracking-wide text-foreground sm:text-xl">
                    {currentQuote.author}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Giant Decorative Closing Quote */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-8 right-6 select-none font-display font-semibold leading-none text-foreground/20 sm:right-10"
            style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}
          >
            ”
          </span>
        </div>
      </div>
    </section>
  );
};
