import React, { useState, useEffect } from "react";
import { Download, Menu, X, Search } from "lucide-react";
import { PORTFOLIO_DATA } from "../data/portfolio";
import { SoundToggle } from "./SoundToggle";

interface NavbarProps {
  onOpenCvModal: () => void;
  onOpenCommandPalette?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCvModal, onOpenCommandPalette }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { brand, links } = PORTFOLIO_DATA.nav;

  useEffect(() => {
    const handleScroll = () => {
      const lenis = window.__lenis;
      const scrollY = lenis ? lenis.scroll : (window.scrollY || document.documentElement.scrollTop || 0);
      setIsScrolled(scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    const lenis = window.__lenis;
    if (lenis) {
      lenis.on("scroll", handleScroll);
    }
    return () => {
      window.removeEventListener("scroll", handleScroll);
      const l = window.__lenis;
      if (l) l.off("scroll", handleScroll);
    };
  }, []);

  // Handle mobile menu scroll locking and ESC dismissal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };

    if (mobileMenuOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
      const lenis = window.__lenis;
      if (lenis) lenis.stop();
    } else {
      document.body.style.overflow = "";
      const lenis = window.__lenis;
      if (lenis) lenis.start();
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      const lenis = window.__lenis;
      if (lenis) lenis.start();
    };
  }, [mobileMenuOpen]);

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const lenis = window.__lenis;
    if (lenis) {
      lenis.scrollTo(href, { offset: -70, duration: 1.1 });
    } else {
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleBrandClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    window.dispatchEvent(new CustomEvent("reset-hero-stage"));
    const lenis = window.__lenis;
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.1 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border/70 py-3 shadow-sm"
          : "bg-transparent py-4 sm:py-5"
      }`}
    >
      <div className="container mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <a
          href="#"
          onClick={handleBrandClick}
          aria-label={`${brand} - Home`}
          className="shrink-0 font-display text-lg sm:text-xl font-bold tracking-tight text-foreground hover:opacity-80 transition-opacity mr-4 lg:mr-8"
        >
          {brand}
        </a>

        {/* Desktop Links - Centered & relaxed */}
        <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-4 lg:gap-6 xl:gap-7">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(link.href);
              }}
              className="text-xs lg:text-sm font-medium text-foreground/70 hover:text-foreground transition-colors whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded-sm"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Action Buttons - Streamlined & balanced */}
        <div className="shrink-0 flex items-center gap-2 sm:gap-2.5">
          {/* Spotlight Quick Search - Compact Glass Pill */}
          <button
            type="button"
            onClick={onOpenCommandPalette}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-card/50 hover:bg-card/90 backdrop-blur-md px-2.5 lg:px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-all duration-200 shadow-sm hover:border-purple-500/40 hover:shadow-purple-500/10 active:scale-95 cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
            title="Spotlight Search (⌘K / Ctrl+K)"
            aria-label="Open Command Palette"
          >
            <Search className="h-3.5 w-3.5 text-muted-foreground group-hover:text-purple-400 transition-colors" />
            <kbd className="inline-flex items-center gap-0.5 rounded border border-border/70 bg-muted/60 px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground/85 leading-none">
              <span className="text-[10px]">⌘</span>K
            </kbd>
          </button>

          {/* Mobile Search Icon Button */}
          <button
            type="button"
            onClick={onOpenCommandPalette}
            className="sm:hidden flex h-8 w-8 items-center justify-center rounded-full border border-border/70 bg-card/60 text-muted-foreground hover:text-foreground transition-colors hover:bg-secondary active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
            title="Search (⌘K)"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </button>

          {/* Tactile Audio SFX Toggle - Clean circular icon button */}
          <SoundToggle variant="icon" />

          {/* Download CV */}
          <button
            type="button"
            onClick={onOpenCvModal}
            className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-3 sm:px-3.5 py-1.5 text-xs font-medium text-background transition-all duration-200 hover:opacity-90 active:scale-95 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
            aria-label="Download Resume / CV"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Download CV</span>
            <span className="sm:hidden">CV</span>
          </button>

          {/* Mobile Menu Trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation-menu"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Backdrop and Content */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 top-[57px] bg-black/40 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <div
            id="mobile-navigation-menu"
            role="dialog"
            aria-label="Mobile Navigation"
            aria-modal="true"
            className="relative z-50 md:hidden border-b border-border bg-background/95 backdrop-blur-xl px-4 py-6 shadow-xl animate-in slide-in-from-top-2 duration-200"
          >
            {/* Quick Spotlight Search Bar in Mobile Drawer */}
            <div className="mb-4">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenCommandPalette?.();
                }}
                className="flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl border border-border/80 bg-card/60 text-muted-foreground hover:text-foreground text-xs font-medium transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
              >
                <span className="flex items-center gap-2.5">
                  <Search className="h-4 w-4 text-purple-400" />
                  <span>Search projects, blog, skills...</span>
                </span>
                <kbd className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono border border-border/70 text-muted-foreground">⌘K</kbd>
              </button>
            </div>

            <nav className="flex flex-col gap-4">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  className="text-base font-medium text-foreground py-2 border-b border-border/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-2 flex items-center justify-between">
                <span className="text-sm font-medium text-foreground/70">Audio FX</span>
                <SoundToggle />
              </div>
            </nav>
          </div>
        </>
      )}
    </header>
  );
};
