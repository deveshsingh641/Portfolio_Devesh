import React, { useRef, useEffect } from "react";
import { X, Download, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PORTFOLIO_DATA } from "../data/portfolio";
import { soundService } from "../lib/sound";

interface CvModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CvModal: React.FC<CvModalProps> = ({ isOpen, onClose }) => {
  const { title, description, options } = PORTFOLIO_DATA.cvDownloads;
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        soundService.playModalClose();
        onClose();
        return;
      }

      if (e.key === "Tab" && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    if (isOpen) {
      soundService.playModalOpen();
      document.body.style.overflow = "hidden";
      const lenis = (window as any).__lenis;
      lenis?.stop();
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
      const lenis = (window as any).__lenis;
      lenis?.start();
    }

    return () => {
      document.body.style.overflow = "";
      const lenis = (window as any).__lenis;
      lenis?.start();
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cv-modal-title"
          data-lenis-prevent="true"
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 overscroll-contain"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h3 id="cv-modal-title" className="font-display text-xl font-semibold tracking-tight text-foreground">
                  {title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">{description}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                aria-label="Close CV modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Actions for Devesh_Singh_SDE.pdf */}
            <div className="mt-6 flex flex-col gap-3">
              {options.map((opt) => (
                <div key={opt.fileName} className="flex flex-col gap-2.5">
                  <a
                    href={opt.href}
                    download={opt.fileName}
                    onClick={onClose}
                    className="group flex items-center gap-4 rounded-xl border border-border bg-secondary/60 p-4 transition-all duration-200 hover:border-purple-500/50 hover:bg-secondary hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 transition-colors group-hover:bg-purple-500 group-hover:text-white">
                      <Download className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground text-sm">
                        {opt.label}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 font-mono">
                        {opt.fileName}
                      </p>
                    </div>
                    <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-foreground text-background transition-opacity group-hover:opacity-90">
                      Download
                    </span>
                  </a>

                  <a
                    href={opt.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={onClose}
                    aria-label="Preview resume in new tab (opens in a new tab)"
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-border/70 py-2.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                  >
                    <Globe className="h-3.5 w-3.5" />
                    <span>Preview in New Tab</span>
                  </a>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
