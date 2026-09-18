import React, { useState, useEffect, useRef } from "react";
import { Mail } from "lucide-react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { PORTFOLIO_DATA } from "../data/portfolio";
import { CelestialResonanceStars } from "./CelestialResonanceStars";
import { CosmicCurveHorizon } from "./CosmicCurveHorizon";

interface CosmicHeroProps {
  isDark: boolean;
}

export const CosmicHero: React.FC<CosmicHeroProps> = ({ isDark }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  const { greeting, headline, endBadge, endSubline, endMeta } =
    PORTFOLIO_DATA.hero;

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(media.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  // Use normalized progress (0 to 1) based on window.innerHeight
  const progress = useMotionValue(0);

  useEffect(() => {
    const updateProgress = () => {
      const lenis = window.__lenis;
      const scrollY = lenis
        ? lenis.scroll
        : (window.scrollY || document.documentElement.scrollTop || 0);
      const H = window.innerHeight || 900;
      const p = Math.min(Math.max(scrollY / Math.max(H, 1), 0), 1);
      progress.set(p);
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress, { passive: true });

    const lenis = window.__lenis;
    if (lenis) {
      lenis.on("scroll", updateProgress);
    }

    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
      const l = window.__lenis;
      if (l) {
        l.off("scroll", updateProgress);
      }
    };
  }, [progress]);

  // Reset stage event handler (triggered by navbar logo or top clicks)
  useEffect(() => {
    const handleReset = () => {
      const lenis = window.__lenis;
      if (lenis) {
        lenis.scrollTo(0, { immediate: true });
      } else {
        window.scrollTo({ top: 0, behavior: "instant" });
      }
      progress.set(0);
      setCurveTriggered(false);
    };

    window.addEventListener("reset-hero-stage", handleReset);
    return () => window.removeEventListener("reset-hero-stage", handleReset);
  }, [progress]);

  // Curve horizon glow-up trigger when scrolling into Stage 2
  const [curveTriggered, setCurveTriggered] = useState(false);

  useEffect(() => {
    const unsubscribe = progress.on("change", (p) => {
      if (p >= 0.25 && !curveTriggered) {
        setCurveTriggered(true);
      } else if (p < 0.12 && curveTriggered) {
        setCurveTriggered(false);
      }
    });
    return () => unsubscribe();
  }, [progress, curveTriggered]);

  // Assisted gentle snap between Stage 1 & Stage 2 only when not reduced motion
  useEffect(() => {
    if (reducedMotion) return;
    let isTransitioning = false;

    const onWheel = (e: WheelEvent) => {
      const lenis = window.__lenis;
      if (!lenis || isTransitioning || lenis.isLocked) return;

      const H = window.innerHeight;
      const scrollY = lenis.scroll || window.scrollY || 0;

      // Soft snap only if deliberate wheel scroll down from top
      if (scrollY < 15 && e.deltaY > 65) {
        isTransitioning = true;
        lenis.scrollTo(H, {
          duration: 0.85,
          onComplete: () => {
            isTransitioning = false;
          },
        });
      }
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
  }, [reducedMotion]);

  // Stage 1 transforms (smoothly scales up and fades out)
  const stage1Opacity = useTransform(progress, [0, 0.45], [1, 0], { clamp: true });
  const stage1Scale = useTransform(progress, [0, 0.85], [1, 1.35], { clamp: true });
  const stage1PointerEvents = useTransform(progress, (p) => (p < 0.25 ? "auto" : "none"));

  // Stage 2 transforms (smoothly enters, rises, and blooms)
  const stage2Opacity = useTransform(progress, [0.30, 0.75], [0, 1], { clamp: true });
  const stage2Scale = useTransform(progress, [0.30, 0.90], [0.88, 1], { clamp: true });
  const stage2Y = useTransform(progress, [0.30, 0.90], [28, 0], { clamp: true });
  const stage2PointerEvents = useTransform(progress, (p) => (p > 0.65 ? "auto" : "none"));

  // Background gradient shift
  const bgDark = useTransform(
    progress,
    [0, 0.60],
    ["#000000", "#0a031a"],
    { clamp: true }
  );
  const bgLight = useTransform(
    progress,
    [0, 0.60],
    ["#ffffff", "#f8f3fe"],
    { clamp: true }
  );
  const heroBg = isDark ? bgDark : bgLight;

  return (
    <section
      ref={containerRef}
      aria-label="Cosmic Hero Introduction"
      className={`relative w-full ${reducedMotion ? "h-screen" : "h-[200vh]"}`}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden select-none">
        {/* Dynamic Background */}
        <motion.div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            backgroundColor: reducedMotion
              ? isDark
                ? "#000000"
                : "#ffffff"
              : heroBg,
          }}
        />

        {/* ================= STAGE 1: BLACK HOLE & GREETING ================= */}
        <motion.div
          className="relative z-10 flex h-full flex-col items-center justify-center px-4 will-change-transform"
          style={{
            opacity: reducedMotion ? 1 : stage1Opacity,
            scale: reducedMotion ? 1 : stage1Scale,
            pointerEvents: reducedMotion ? "auto" : stage1PointerEvents,
          }}
        >
          {/* Constellation Particle Layer (Moving Stars) */}
          <div className="absolute inset-0 pointer-events-none z-0" aria-hidden="true">
            <CelestialResonanceStars
              isDark={isDark}
              particleCount={reducedMotion ? 250 : 850}
              particleSpeed={0.045}
              particleLife={380}
              trailOpacity={isDark ? 0.12 : 0.18}
              hueSpeed={0.08}
              canvasGlow={isDark ? 12 : 6}
            />
          </div>

          {/* Cosmic Video Layer */}
          <div
            aria-hidden="true"
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] sm:w-[1450px] md:w-[1800px] lg:w-[2000px] h-[800px] sm:h-[1000px] md:h-[1160px] lg:h-[1280px] pointer-events-none z-[1]"
            style={{
              WebkitMaskImage:
                "radial-gradient(55% 82% at 50% 100%, #fff 72%, transparent 100%)",
              maskImage:
                "radial-gradient(55% 82% at 50% 100%, #fff 72%, transparent 100%)",
            }}
          >
            <video
              autoPlay
              muted
              playsInline
              loop
              preload="auto"
              aria-hidden="true"
              tabIndex={-1}
              className="w-full h-full object-cover object-top pointer-events-none select-none transition-all duration-500"
              style={{
                mixBlendMode: isDark ? "screen" : "multiply",
                filter: isDark
                  ? "brightness(1.15) contrast(1.08) saturate(1.22)"
                  : "invert(1) hue-rotate(180deg) contrast(1.2) brightness(1.05) saturate(1.3)",
                opacity: isDark ? 1 : 0.88,
              }}
            >
              <source src="/videos/black-hole.webm" type="video/webm" />
              <source src="/videos/black-hole.mp4" type="video/mp4" />
            </video>
          </div>

          {/* Greeting Pill */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-6 relative z-20"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-4 py-2 text-sm text-foreground backdrop-blur-md shadow-sm">
              {greeting}
            </span>
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="relative z-20 flex w-full max-w-4xl items-center justify-center text-center"
          >
            <h1 className="font-display text-3xl sm:text-5xl md:text-7xl lg:text-[5.2rem] font-medium tracking-tight text-foreground leading-[1.12] max-w-[20rem] sm:max-w-none">
              {headline}
            </h1>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-8 relative z-30"
          >
            <button
              type="button"
              aria-label="Connect now with Devesh Singh"
              onClick={() => {
                window.dispatchEvent(
                  new CustomEvent("open-contact-modal", { detail: { category: "job" } })
                );
              }}
              className="group relative inline-flex items-center justify-center gap-3 rounded-full bg-card border border-purple-500/35 text-foreground hover:border-purple-400 hover:bg-secondary/80 px-8 py-4 shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 dark:bg-[#140d24] dark:text-white dark:hover:bg-[#1d1333] dark:shadow-[0_0_25px_rgba(168,85,247,0.25)] text-base font-medium tracking-tight cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
            >
              <Mail className="h-5 w-5 text-purple-600 dark:text-purple-400 transition-transform duration-300 group-hover:scale-110" />
              <span>Connect Now</span>
            </button>
          </motion.div>
        </motion.div>

        {/* ================= STAGE 2: AVAILABLE FOR WORK ================= */}
        <motion.div
          className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4 text-center will-change-transform"
          style={{
            opacity: reducedMotion ? 0 : stage2Opacity,
            scale: reducedMotion ? 1 : stage2Scale,
            y: reducedMotion ? 0 : stage2Y,
            pointerEvents: reducedMotion ? "none" : stage2PointerEvents,
          }}
        >
          {/* Dynamic Horizon Curve Effect */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden z-0" aria-hidden="true">
            {(curveTriggered || reducedMotion) && (
              <CosmicCurveHorizon isDark={isDark} />
            )}
          </div>

          {/* Ambient Purple Glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 h-[46rem] w-[46rem] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background: isDark
                ? "radial-gradient(circle, rgba(168,85,247,0.24) 0%, rgba(147,51,234,0.08) 42%, rgba(147,51,234,0) 70%)"
                : "radial-gradient(circle, rgba(168,85,247,0.16) 0%, rgba(147,51,234,0.05) 42%, rgba(147,51,234,0) 70%)",
            }}
          />

          {/* Geometric Grid Background */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(to right, ${
                isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"
              } 1px, transparent 1px), linear-gradient(to bottom, ${
                isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"
              } 1px, transparent 1px)`,
              backgroundSize: "72px 72px",
              maskImage:
                "radial-gradient(ellipse 62% 55% at 50% 50%, black 20%, transparent 78%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 62% 55% at 50% 50%, black 20%, transparent 78%)",
            }}
          />

          {/* Stage 2 Content */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Pulsing Pill */}
            <span
              style={{
                color: isDark ? "#c084fc" : "#7e22ce",
                borderColor: isDark ? "rgba(168,85,247,0.35)" : "rgba(126,34,206,0.30)",
                backgroundColor: isDark ? "rgba(168,85,247,0.10)" : "rgba(126,34,206,0.08)",
              }}
              className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] backdrop-blur-sm shadow-sm"
            >
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span
                  className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                  style={{ backgroundColor: isDark ? "#c084fc" : "#7e22ce" }}
                />
                <span
                  className="relative inline-flex h-2 w-2 rounded-full"
                  style={{ backgroundColor: isDark ? "#c084fc" : "#7e22ce" }}
                />
              </span>
              {endBadge}
            </span>

            {/* Headline */}
            <h2 className="mt-7 max-w-4xl font-display text-3xl sm:text-5xl md:text-7xl font-medium leading-tight tracking-tight text-foreground">
              Let's build something{" "}
              <span className="text-purple-600 dark:text-purple-400 font-semibold">great</span>
            </h2>

            {/* Subline */}
            <p className="mt-6 max-w-xl text-base sm:text-lg text-muted-foreground leading-relaxed">
              {endSubline}
            </p>

            <div className="mt-8 flex items-center justify-center">
              <button
                type="button"
                aria-label="Connect now with Devesh Singh"
                onClick={() => {
                  window.dispatchEvent(
                    new CustomEvent("open-contact-modal", { detail: { category: "job" } })
                  );
                }}
                className="group relative inline-flex items-center justify-center gap-3 rounded-full bg-card border border-purple-500/35 text-foreground hover:border-purple-400 hover:bg-secondary/80 px-8 py-4 shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 dark:bg-[#140d24] dark:text-white dark:hover:bg-[#1d1333] dark:shadow-[0_0_25px_rgba(168,85,247,0.25)] text-base font-medium tracking-tight cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
              >
                <Mail className="h-5 w-5 text-purple-600 dark:text-purple-400 transition-transform duration-300 group-hover:scale-110" />
                <span>Connect Now</span>
              </button>
            </div>

            {/* Meta Divider */}
            <div className="mt-12 w-full max-w-md">
              <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />
              <p className="mt-4 text-xs font-mono uppercase tracking-[0.22em] text-muted-foreground">
                {endMeta}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
