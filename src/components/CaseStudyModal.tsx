import React, { useEffect, useRef } from "react";
import { X, ExternalLink, Github, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ProjectItem } from "../data/portfolio";

interface CaseStudyModalProps {
  project: ProjectItem | null;
  onClose: () => void;
  onNextProject?: (next: ProjectItem) => void;
  allProjects?: ProjectItem[];
}

export const CaseStudyModal: React.FC<CaseStudyModalProps> = ({
  project,
  onClose,
  onNextProject,
  allProjects = [],
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!project) return;

    // Focus close button on mount
    const timer = setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      // Focus trap
      if (e.key === "Tab" && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.body.style.overflow = "hidden";
    const lenis = (window as any).__lenis;
    lenis?.stop();
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "";
      const l = (window as any).__lenis;
      l?.start();
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  const nextProject =
    allProjects.length > 1
      ? allProjects[
          (allProjects.findIndex((p) => p.id === project.id) + 1) %
            allProjects.length
        ]
      : null;

  return (
    <AnimatePresence>
      <motion.div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="case-study-title"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        data-lenis-prevent="true"
        className="fixed inset-0 z-[150] h-screen w-full overflow-y-auto overscroll-contain bg-background text-foreground select-text"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {/* Floating Close Button */}
        <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[160]">
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close case study"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-foreground text-background shadow-2xl transition-transform hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Scroll Content */}
        <div className="mx-auto max-w-5xl px-6 sm:px-10 pt-16 sm:pt-20 md:pt-24 pb-20">
          {/* Header Tag */}
          <div className="flex items-center gap-3 mb-5">
            <span className="inline-block rounded-full border border-purple-500/30 bg-purple-500/10 px-3.5 py-1 text-xs font-mono tracking-widest uppercase text-purple-600 dark:text-purple-400">
              Case Study
            </span>
            {project.badge && (
              <span className="relative inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white">
                <span className="rainbow-border absolute inset-0 rounded-full" />
                <span>⚡ {project.badge}</span>
              </span>
            )}
          </div>

          {/* Title & Subtitle */}
          <h1
            id="case-study-title"
            className="font-display text-3xl sm:text-5xl md:text-6xl font-medium tracking-tight text-foreground mb-4"
          >
            {project.title}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-light mb-6">
            {project.subtitle}
          </p>
          <p className="text-base md:text-lg text-muted-foreground max-w-3xl leading-relaxed mb-8">
            {project.summary}
          </p>

          {/* Action Links */}
          <div className="flex flex-wrap items-center gap-4 mb-10">
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open live demo of ${project.title} (opens in a new tab)`}
                className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
              >
                <span>Live Demo</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View source code for ${project.title} on GitHub (opens in a new tab)`}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/80 px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
              >
                <Github className="h-4 w-4" />
                <span>Source Code</span>
              </a>
            )}
          </div>

          {/* Project Meta Spec Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-6 border-y border-border/70 mb-10">
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">
                Year
              </p>
              <p className="text-sm sm:text-base font-medium text-foreground">
                {project.year}
              </p>
            </div>
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">
                Role
              </p>
              <p className="text-sm sm:text-base font-medium text-foreground">
                {project.role || "Lead Engineer"}
              </p>
            </div>
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">
                Team
              </p>
              <p className="text-sm sm:text-base font-medium text-foreground">
                {project.team || "Core Engineering"}
              </p>
            </div>
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">
                Timeline
              </p>
              <p className="text-sm sm:text-base font-medium text-foreground">
                {project.timeline || "8-12 Weeks"}
              </p>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative w-full h-72 sm:h-96 md:h-[460px] overflow-hidden rounded-2xl border border-border shadow-2xl mb-14 bg-secondary/30">
            <img
              src={project.thumbnail}
              alt={`Detailed interface screenshot of ${project.title}`}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/placeholder-project.svg";
              }}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Metrics Callout */}
          {project.caseStudy.metrics && project.caseStudy.metrics.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-14">
              {project.caseStudy.metrics.map((m, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-border bg-card p-6 text-center"
                >
                  <p className="text-3xl sm:text-4xl font-display font-semibold text-foreground mb-1">
                    {m.value}
                  </p>
                  <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    {m.label}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Section 1: The Problem */}
          <div className="mb-14">
            <div className="flex items-center gap-4 mb-4 border-b border-border/40 pb-4">
              <span className="font-display text-4xl sm:text-5xl font-light text-purple-600 dark:text-purple-400">
                01
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-medium tracking-tight text-foreground">
                The Problem & Core Friction
              </h2>
            </div>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              {project.caseStudy.problem}
            </p>
          </div>

          {/* Section 2: The Solution & Strategy */}
          <div className="mb-14">
            <div className="flex items-center gap-4 mb-4 border-b border-border/40 pb-4">
              <span className="font-display text-4xl sm:text-5xl font-light text-purple-600 dark:text-purple-400">
                02
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-medium tracking-tight text-foreground">
                Engineered Solution
              </h2>
            </div>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-6">
              {project.caseStudy.solution}
            </p>

            <div className="space-y-3">
              {project.caseStudy.keyFeatures.map((feat, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base text-foreground/90">
                    {feat}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Technical Architecture */}
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-4 border-b border-border/40 pb-4">
              <span className="font-display text-4xl sm:text-5xl font-light text-purple-600 dark:text-purple-400">
                03
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-medium tracking-tight text-foreground">
                Architecture & Data Flow
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="rounded-2xl border border-border bg-card p-6">
                <span className="text-xs font-mono uppercase tracking-widest text-purple-600 dark:text-purple-400 font-semibold mb-2 block">
                  Frontend Client
                </span>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {project.caseStudy.architecture.frontend}
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6">
                <span className="text-xs font-mono uppercase tracking-widest text-purple-600 dark:text-purple-400 font-semibold mb-2 block">
                  Backend Microservices
                </span>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {project.caseStudy.architecture.backend}
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6">
                <span className="text-xs font-mono uppercase tracking-widest text-purple-600 dark:text-purple-400 font-semibold mb-2 block">
                  Data & Persistence
                </span>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {project.caseStudy.architecture.data}
                </p>
              </div>
            </div>
          </div>

          {/* Technologies Used */}
          <div className="mb-16">
            <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-3">
              Technologies & Frameworks
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-border bg-secondary/60 px-3.5 py-1 text-xs font-medium text-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Next Project Card */}
          {nextProject && onNextProject && (
            <div className="mt-20 border-t border-border/70 pt-10">
              <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4">
                Next Project
              </p>
              <div
                role="button"
                tabIndex={0}
                aria-label={`Go to next project: ${nextProject.title}`}
                onClick={() => onNextProject(nextProject)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onNextProject(nextProject);
                  }
                }}
                className="group flex items-center justify-between p-6 sm:p-8 rounded-2xl border border-border bg-card hover:border-purple-500/50 hover:bg-secondary/40 transition-all duration-300 cursor-pointer shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
              >
                <div>
                  <h4 className="font-display text-2xl sm:text-3xl font-medium text-foreground group-hover:text-purple-400 transition-colors">
                    {nextProject.title}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {nextProject.subtitle}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-foreground text-background transition-transform group-hover:translate-x-1">
                  <ArrowRight className="h-5 w-5" />
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
