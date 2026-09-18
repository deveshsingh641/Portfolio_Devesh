import React from "react";
import { ArrowUpRight, Compass } from "lucide-react";
import { motion } from "framer-motion";
import { PORTFOLIO_DATA } from "../data/portfolio";
import type { MessageCategory } from "./ContactModal";

interface ContactFooterProps {
  onOpenContactModal?: (category?: MessageCategory) => void;
}

export const ContactFooter: React.FC<ContactFooterProps> = ({ onOpenContactModal }) => {
  const { headline, headlineItalic, subline, email } = PORTFOLIO_DATA.contact;

  const scrollToTop = () => {
    const lenis = (window as any).__lenis;
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const openModal = (category: MessageCategory) => {
    if (onOpenContactModal) {
      onOpenContactModal(category);
    } else {
      window.dispatchEvent(
        new CustomEvent("open-contact-modal", { detail: { category } })
      );
    }
  };

  return (
    <footer id="contact" className="relative pt-24 pb-12 px-4 border-t border-border/40 overflow-hidden bg-background scroll-mt-24 md:scroll-mt-32">
      {/* Upper CTA Banner */}
      <div className="container mx-auto max-w-4xl text-center mb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          className="mb-6"
        >
          <span className="inline-block rounded-full border border-border px-4 py-1.5 text-xs font-medium tracking-widest uppercase text-muted-foreground">
            Get In Touch
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display text-4xl sm:text-6xl md:text-7xl font-semibold tracking-tight text-foreground"
        >
          {headline}{" "}
          <span className="font-serif italic font-normal text-muted-foreground/90">
            {headlineItalic}
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-4 text-base sm:text-lg text-muted-foreground font-light max-w-xl mx-auto"
        >
          {subline}
        </motion.p>

        {/* 3 Clean Action Contact Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          {/* Email / Direct Message Modal Trigger */}
          <button
            type="button"
            onClick={() => openModal("general")}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-medium text-foreground transition-all duration-300 hover:border-purple-500/50 hover:bg-secondary hover:shadow-md hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>Email</span>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </button>

          {/* LinkedIn */}
          <a
            href="https://linkedin.com/in/deveshsingh64"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-medium text-foreground transition-all duration-300 hover:border-purple-500/50 hover:bg-secondary hover:shadow-md hover:scale-105 active:scale-95"
          >
            <span>LinkedIn</span>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </a>

          {/* GitHub */}
          <a
            href="https://github.com/deveshsingh641"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-medium text-foreground transition-all duration-300 hover:border-purple-500/50 hover:bg-secondary hover:shadow-md hover:scale-105 active:scale-95"
          >
            <span>GitHub</span>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </a>
        </motion.div>
      </div>

      {/* Main Footer Layout matching Image 5 */}
      <div className="container mx-auto max-w-6xl relative z-10 pt-12 border-t border-border/40">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16 mb-16">
          {/* Left Column: Brand & Bio */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-secondary border border-border flex items-center justify-center font-display font-bold text-sm text-foreground">
                D
              </div>
              <span className="font-display text-xl font-semibold tracking-tight text-foreground">
                Devesh S.
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mt-1">
              Software Engineer crafting scalable full-stack MERN &amp; real-time systems
            </p>
            <button
              type="button"
              onClick={() => openModal("general")}
              className="text-left text-sm text-muted-foreground hover:text-foreground font-mono transition-colors mt-1 inline-flex items-center gap-1.5 cursor-pointer group"
              title="Click to send message"
            >
              <span>{email}</span>
              <ArrowUpRight className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>

          {/* Spacer for MD */}
          <div className="hidden md:block" />

          {/* Right Columns: 2 Columns of Clean Links */}
          <div className="grid grid-cols-2 gap-8 text-sm">
            {/* Column 1: Navigation */}
            <div className="flex flex-col gap-3">
              {[
                { label: "Projects", href: "#projects" },
                { label: "Education", href: "#education" },
                { label: "About", href: "#about" },
                { label: "Expertise", href: "#expertise" },
                { label: "Certifications", href: "#certifications" },
                { label: "Thoughts", href: "#thoughts" },
                { label: "Rewards", href: "#support" },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    const lenis = (window as any).__lenis;
                    if (lenis) {
                      lenis.scrollTo(link.href, { offset: -70, duration: 1.1 });
                    } else {
                      document.querySelector(link.href)?.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Column 2: Socials & Resume (No Medium) */}
            <div className="flex flex-col gap-3">
              <a
                href="https://linkedin.com/in/deveshsingh64"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                LinkedIn
              </a>
              <a
                href="https://github.com/deveshsingh641"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                GitHub
              </a>
              <a
                href="/Devesh_Singh_SDE.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Resume
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-border/40 mb-8" />

        {/* Bottom Bar: Copyright | Center Compass */}
        <div className="flex items-center justify-between gap-6 relative z-20">
          <div className="text-xs text-muted-foreground/80 font-mono">
            © {new Date().getFullYear()} Devesh S.
          </div>

          {/* Center Compass / Back to Top Button */}
          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground hover:text-foreground hover:border-purple-500/50 hover:bg-secondary transition-all duration-300 shadow-sm hover:scale-110 active:scale-95"
          >
            <Compass className="h-4 w-4" />
          </button>

          {/* Right Spacer to preserve exact Center Alignment of Compass */}
          <div className="w-20 hidden sm:block" aria-hidden="true" />
        </div>

        {/* Giant Watermark Typography - Enhanced Visibility in Light & Dark Mode */}
        <div className="relative w-full overflow-hidden mt-12 pb-20 select-none pointer-events-none text-center">
          <span className="font-display font-black text-[15vw] tracking-tighter leading-none text-foreground/[0.09] dark:text-foreground/[0.05] uppercase block transition-colors">
            DEVESH S.
          </span>
        </div>
      </div>
    </footer>
  );
};
