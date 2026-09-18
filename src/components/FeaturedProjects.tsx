import React, { useRef, useState, useEffect } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ExternalLink,
  Github,
  Sparkles,
  FolderArchive,
  Layers,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";
import { PORTFOLIO_DATA, ProjectItem } from "../data/portfolio";
import { CaseStudyModal } from "./CaseStudyModal";
import { HolographicTiltCard } from "./HolographicTiltCard";

const PROJECT_THEMES = [
  {
    bg: "from-[#0a122c] via-[#070d1f] to-[#03060f]",
    border: "border-blue-500/30 hover:border-blue-400/70",
    glow: "rgba(59, 130, 246, 0.25)",
    badge: "MERN STACK",
    accent: "text-blue-400",
  },
  {
    bg: "from-[#04281f] via-[#021d16] to-[#010e0b]",
    border: "border-emerald-500/30 hover:border-emerald-400/70",
    glow: "rgba(16, 185, 129, 0.25)",
    badge: "GIS & SENSORS",
    accent: "text-emerald-400",
  },
  {
    bg: "from-[#220c38] via-[#160725] to-[#0b0312]",
    border: "border-purple-500/30 hover:border-purple-400/70",
    glow: "rgba(168, 85, 247, 0.25)",
    badge: "FASTAPI & GEMINI",
    accent: "text-purple-400",
  },
  {
    bg: "from-[#09223a] via-[#061727] to-[#020b13]",
    border: "border-cyan-500/30 hover:border-cyan-400/70",
    glow: "rgba(6, 182, 212, 0.25)",
    badge: "WEBSOCKET ENGINE",
    accent: "text-cyan-400",
  },
  {
    bg: "from-[#1a142c] via-[#110d1e] to-[#08060f]",
    border: "border-indigo-500/30 hover:border-indigo-400/70",
    glow: "rgba(99, 102, 241, 0.25)",
    badge: "FRONTEND ARCHITECTURE",
    accent: "text-indigo-400",
  },
];

export const FeaturedProjects: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeProject, setActiveProject] = useState<ProjectItem | null>(null);

  const { projects } = PORTFOLIO_DATA;

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 15);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 15);
    }
  };

  useEffect(() => {
    const timer = setTimeout(checkScroll, 200);
    window.addEventListener("resize", checkScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", checkScroll);
    };
  }, [projects]);

  useEffect(() => {
    const handleOpenCaseStudy = (e: Event) => {
      const customEvent = e as CustomEvent<{ slug?: string; id?: string }>;
      const slug = customEvent.detail?.slug;
      const id = customEvent.detail?.id;
      if (slug || id) {
        const found = projects.find((p) => p.slug === slug || p.id === id);
        if (found) {
          setActiveProject(found);
        }
      }
    };
    window.addEventListener("open-case-study", handleOpenCaseStudy);
    return () => window.removeEventListener("open-case-study", handleOpenCaseStudy);
  }, [projects]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const firstCard = container.querySelector<HTMLElement>(".project-card-item");
      const step = firstCard ? firstCard.offsetWidth + 24 : 460;
      container.scrollBy({
        left: direction === "left" ? -step : step,
        behavior: "smooth",
      });
      setTimeout(checkScroll, 400);
    }
  };

  const scrollToArchive = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        left: scrollRef.current.scrollWidth,
        behavior: "smooth",
      });
      setTimeout(checkScroll, 400);
    }
  };

  return (
    <section id="projects" className="relative py-20 md:py-28 scroll-mt-24">
      {/* Section Header with Integrated Controls */}
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 mb-8 md:mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-3.5 py-1 text-[10px] font-medium tracking-[0.2em] uppercase text-muted-foreground mb-3">
              <Layers className="h-3 w-3 text-purple-400" />
              <span>PRODUCTION SYSTEMS</span>
            </span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight">
              <span className="text-muted-foreground">Featured </span>
              <span className="text-foreground">Projects</span>
            </h2>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-xl font-light">
              Full-stack MERN web platforms, real-time engines, and distributed architectures engineered end to end.
            </p>
          </div>

          {/* Top Controls for Quick Exploration */}
          <div className="flex items-center gap-2.5 self-start md:self-end">
            <button
              type="button"
              onClick={scrollToArchive}
              title="View all repositories"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 hover:bg-secondary px-4 py-2 text-xs font-medium text-foreground hover:border-purple-500/40 transition-all shadow-sm active:scale-95 cursor-pointer backdrop-blur-sm"
            >
              <span>Explore All</span>
              <span className="rounded-full bg-secondary border border-border px-1.5 py-0.2 text-[10px] font-mono text-muted-foreground">
                {projects.length}
              </span>
              <ArrowRight className="h-3 w-3" />
            </button>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => scroll("left")}
                disabled={!canScrollLeft}
                aria-label="Scroll left"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/80 text-foreground transition-all hover:bg-secondary hover:border-purple-500/40 disabled:opacity-25 disabled:cursor-not-allowed shadow-sm active:scale-95 cursor-pointer backdrop-blur-sm"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => scroll("right")}
                disabled={!canScrollRight}
                aria-label="Scroll right"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/80 text-foreground transition-all hover:bg-secondary hover:border-purple-500/40 disabled:opacity-25 disabled:cursor-not-allowed shadow-sm active:scale-95 cursor-pointer backdrop-blur-sm"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Carousel Track */}
      <div className="relative w-full">
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          role="region"
          aria-label="Featured projects carousel"
          data-lenis-prevent="true"
          className="flex w-full overflow-x-auto overscroll-x-contain py-4 px-4 md:px-12 gap-6 no-scrollbar snap-x snap-mandatory"
        >
          {projects.map((project, idx) => {
            const theme = PROJECT_THEMES[idx % PROJECT_THEMES.length];
            const topMetric = project.caseStudy?.metrics?.[0];

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.06 }}
                className="project-card-item snap-start shrink-0"
              >
                <HolographicTiltCard
                  borderRadius="rounded-3xl"
                  maxTilt={7}
                  perspective={1200}
                  scale={1.02}
                  glowColor={theme.glow}
                  onClick={() => setActiveProject(project)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setActiveProject(project);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  className={`group relative flex h-[34rem] w-[19rem] sm:h-[36rem] sm:w-[22rem] md:h-[38rem] md:w-[24.5rem] flex-col justify-between overflow-hidden rounded-3xl border bg-gradient-to-b ${theme.bg} ${theme.border} text-left transition-all duration-500 hover:shadow-2xl cursor-pointer p-6 md:p-7 select-none`}
                  style={{
                    boxShadow: `0 20px 50px -15px ${theme.glow}`,
                  }}
                >
                  {/* Top Header inside Card */}
                  <div className="relative z-20 w-full" style={{ transform: "translateZ(18px)" }}>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-xs font-mono uppercase tracking-wider text-white/80">
                        {project.year}
                      </span>
                      <span className="relative inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-white">
                        <span className="rainbow-border absolute inset-0 rounded-full" />
                        <Sparkles className="h-3 w-3 text-purple-300" />
                        <span>{theme.badge}</span>
                      </span>
                    </div>

                    <h3 className="font-display text-2xl sm:text-3xl font-medium tracking-tight text-white leading-tight">
                      {project.title}
                    </h3>
                    <p className="mt-1.5 text-xs sm:text-sm text-white/70 line-clamp-2 leading-relaxed">
                      {project.subtitle}
                    </p>
                  </div>

                  {/* High-Resolution Dashboard Mockup (Wide Desktop Perspective) */}
                  <div className="relative z-10 my-auto py-2 w-full" style={{ transform: "translateZ(26px)" }}>
                    <div className="relative w-full aspect-[16/10] rounded-2xl border border-white/20 bg-slate-950/80 shadow-2xl overflow-hidden transform-gpu transition-all duration-500 group-hover:scale-105 group-hover:border-white/40">
                      {/* Window titlebar dots */}
                      <div className="absolute top-0 left-0 right-0 h-6 bg-slate-900/90 border-b border-white/10 px-3 flex items-center justify-between z-20">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-red-500/80" />
                          <span className="w-2 h-2 rounded-full bg-yellow-500/80" />
                          <span className="w-2 h-2 rounded-full bg-emerald-500/80" />
                        </div>
                        <span className="text-[9px] font-mono text-white/40 truncate max-w-[120px]">
                          {project.slug}{(project.live || project.demoUrl) ? ".live" : ".git"}
                        </span>
                      </div>

                      {/* Project UI Screen */}
                      <img
                        src={project.cardImage || project.thumbnail}
                        alt={`Interface preview of ${project.title}`}
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "/placeholder-project.svg";
                        }}
                        className="w-full h-full object-cover object-top pt-6"
                      />

                      {/* Subtle Screen Glare */}
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/10" />

                      {/* Floating Key Metric Pill on image */}
                      {topMetric && (
                        <div className="absolute bottom-2.5 left-2.5 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-[10px] font-mono text-white">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>{topMetric.label}:</span>
                          <span className="font-bold text-purple-300">{topMetric.value}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Tags Badges */}
                  <div className="relative z-20 flex flex-wrap gap-1.5 mb-4" style={{ transform: "translateZ(14px)" }}>
                    {project.tags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/10 text-white/80 border border-white/10"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Bottom Action Bar */}
                  <div className="relative z-20 flex items-center justify-between pt-3.5 border-t border-white/15 w-full" style={{ transform: "translateZ(20px)" }}>
                    {/* View Case Study Pill */}
                    <div className="flex items-center gap-2 text-xs font-medium text-white group-hover:text-purple-300 transition-colors">
                      <span>View Case Study</span>
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:translate-x-0.5">
                        <ArrowUpRight className="h-4 w-4" />
                      </div>
                    </div>

                    {/* External Quick Action Links */}
                    <div className="flex items-center gap-2">
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="View Source Code"
                          aria-label={`View source code for ${project.title} on GitHub (opens in a new tab)`}
                          onClick={(e) => e.stopPropagation()}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 hover:bg-white/25 text-white transition-all duration-200 hover:scale-110 border border-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
                        >
                          <Github className="h-3.5 w-3.5" />
                        </a>
                      )}
                      {(project.live || project.demoUrl) && (
                        <a
                          href={project.live || project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Open Live Application"
                          aria-label={`Open live application for ${project.title} (opens in a new tab)`}
                          onClick={(e) => e.stopPropagation()}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500/25 hover:bg-purple-500/50 text-purple-200 transition-all duration-200 hover:scale-110 border border-purple-400/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </HolographicTiltCard>
              </motion.div>
            );
          })}

          {/* Archive / All Projects Card */}
          <div className="project-card-item snap-start shrink-0">
            <HolographicTiltCard
              borderRadius="rounded-3xl"
              maxTilt={7}
              perspective={1200}
              scale={1.02}
              glowColor="rgba(168, 85, 247, 0.25)"
              onClick={() => window.open("https://github.com/deveshsingh641", "_blank", "noopener,noreferrer")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  window.open("https://github.com/deveshsingh641", "_blank", "noopener,noreferrer");
                }
              }}
              role="button"
              tabIndex={0}
              className="group relative flex h-[34rem] w-[19rem] sm:h-[36rem] sm:w-[22rem] md:h-[38rem] md:w-[24.5rem] flex-col justify-between overflow-hidden rounded-3xl border border-border bg-card p-6 md:p-8 text-left transition-all duration-300 hover:border-purple-500/40 hover:shadow-2xl cursor-pointer select-none"
            >
              <div className="relative z-10 flex items-center justify-between" style={{ transform: "translateZ(16px)" }}>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  <FolderArchive className="h-3 w-3" />
                  Archive
                </span>
                <span className="rounded-full border border-border bg-secondary/80 px-2.5 py-0.5 text-[11px] font-medium text-foreground">
                  All Systems
                </span>
              </div>

              <div className="relative z-10 my-auto py-6" style={{ transform: "translateZ(24px)" }}>
                <h3 className="font-display text-2xl md:text-3xl font-medium tracking-tight text-foreground leading-snug group-hover:text-purple-400 transition-colors">
                  Explore Complete <br className="hidden md:block" /> Code Repositories
                </h3>
                <p className="mt-3 text-xs md:text-sm text-muted-foreground leading-relaxed">
                  Discover the full portfolio of full-stack MERN web platforms, real-time WebSocket applications, and algorithms.
                </p>
              </div>

              <div className="relative z-10 pt-5 border-t border-border/60 flex items-center justify-between" style={{ transform: "translateZ(20px)" }}>
                <span className="text-xs md:text-sm font-medium text-foreground group-hover:text-purple-400 transition-colors">
                  View GitHub Repositories
                </span>
                <div
                  aria-hidden="true"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-background shadow-lg transition-transform group-hover:scale-110"
                >
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </div>
            </HolographicTiltCard>
          </div>
        </div>

        {/* Carousel Bottom Controls */}
        <div className="container mx-auto max-w-6xl px-4 flex items-center justify-between gap-3 mt-6">
          <div className="text-xs font-mono text-muted-foreground hidden sm:block">
            Scroll or use arrows to explore · Click card for Case Study
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {/* View All Pill */}
            <button
              type="button"
              onClick={scrollToArchive}
              title="View all repositories"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-medium text-foreground hover:bg-secondary hover:border-purple-500/40 transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <span>Explore All</span>
              <span className="rounded-full bg-secondary border border-border px-1.5 py-0.2 text-[10px] font-mono text-muted-foreground">
                {projects.length}
              </span>
              <ArrowRight className="h-3 w-3" />
            </button>

            {/* Navigation Arrows */}
            <button
              type="button"
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              aria-label="Scroll left"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-all hover:bg-secondary hover:border-purple-500/40 disabled:opacity-30 disabled:cursor-not-allowed shadow-sm active:scale-95 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              aria-label="Scroll right"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-all hover:bg-secondary hover:border-purple-500/40 disabled:opacity-30 disabled:cursor-not-allowed shadow-sm active:scale-95 cursor-pointer"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Case Study Full-Screen Modal */}
      <CaseStudyModal
        project={activeProject}
        onClose={() => setActiveProject(null)}
        onNextProject={(next) => setActiveProject(next)}
        allProjects={projects}
      />
    </section>
  );
};
