import { useState, useEffect, useCallback } from "react";
import Lenis from "lenis";
import { useTactileSound } from "./hooks/useTactileSound";
import { WelcomeIntro } from "./components/WelcomeIntro";
import { Navbar } from "./components/Navbar";
import { CvModal } from "./components/CvModal";
import { CosmicHero } from "./components/CosmicHero";
import { EducationSection } from "./components/EducationSection";
import { FeaturedProjects } from "./components/FeaturedProjects";
import { QuoteBanner } from "./components/QuoteBanner";
import { AboutSection } from "./components/AboutSection";
import { SoftwareExpertise } from "./components/SoftwareExpertise";
import { CertificationsWall } from "./components/CertificationsWall";
import { ThoughtsSection } from "./components/ThoughtsSection";
import { SupporterRewards } from "./components/SupporterRewards";
import { ContactFooter } from "./components/ContactFooter";
import { ThemeToggle } from "./components/ThemeToggle";
import { SpideyCursor } from "./components/SpideyCursor";
import { CommandPalette } from "./components/CommandPalette";
import { ContactModal, type MessageCategory } from "./components/ContactModal";
import { PORTFOLIO_DATA } from "./data/portfolio";
import { loadAllPosts, type Post } from "./blog/posts";

export function App() {
  useTactileSound();
  const [cvModalOpen, setCvModalOpen] = useState(false);
  const [cmdPaletteOpen, setCmdPaletteOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [contactModalCategory, setContactModalCategory] = useState<MessageCategory>("job");
  const [posts, setPosts] = useState<Post[]>([]);

  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      if (saved === "light") return false;
      return true; // Default to dark mode
    }
    return true;
  });

  // Load blog posts for Command Palette search index
  useEffect(() => {
    let active = true;
    loadAllPosts().then((loaded) => {
      if (active) setPosts(loaded);
    });
    return () => {
      active = false;
    };
  }, []);

  // Handle Theme Switching
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  // Handle Smooth Scrolling with Lenis
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
    });

    window.__lenis = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  // Listen for custom open events from subcomponents
  useEffect(() => {
    const handleOpenCmd = () => setCmdPaletteOpen(true);
    const handleOpenCv = () => setCvModalOpen(true);
    const handleOpenContact = (e: Event) => {
      const customEvent = e as CustomEvent<{ category?: MessageCategory }>;
      if (customEvent.detail?.category) {
        setContactModalCategory(customEvent.detail.category);
      }
      setContactModalOpen(true);
    };

    window.addEventListener("open-command-palette", handleOpenCmd);
    window.addEventListener("open-cv-modal", handleOpenCv);
    window.addEventListener("open-contact-modal", handleOpenContact);

    return () => {
      window.removeEventListener("open-command-palette", handleOpenCmd);
      window.removeEventListener("open-cv-modal", handleOpenCv);
      window.removeEventListener("open-contact-modal", handleOpenContact);
    };
  }, []);

  // Smooth section scrolling helper with Lenis
  const scrollToSection = useCallback((sectionId: string) => {
    const cleanId = sectionId.replace(/^#/, "");
    if (cleanId === "home" || cleanId === "top") {
      window.dispatchEvent(new CustomEvent("reset-hero-stage"));
      const lenis = window.__lenis;
      if (lenis) {
        lenis.scrollTo(0, { duration: 1.1 });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }

    let targetSelector = `#${cleanId}`;
    if (cleanId === "skills" || cleanId === "tools") {
      targetSelector = "#expertise";
    } else if (cleanId === "blog") {
      targetSelector = "#thoughts";
    } else if (cleanId === "rewards") {
      targetSelector = "#support";
    }

    const target = document.querySelector<HTMLElement>(targetSelector) || document.querySelector<HTMLElement>(`#${cleanId}`);
    if (target) {
      const lenis = window.__lenis;
      if (lenis) {
        lenis.scrollTo(target, { offset: -70, duration: 1.1 });
      } else {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, []);

  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-purple-500/30 selection:text-purple-200">
      {/* 0. Multi-Lingual Matrix Welcome Intro */}
      <WelcomeIntro />

      {/* 1. Sticky Glass Navbar with Spotlight Glass Pill */}
      <Navbar
        onOpenCvModal={() => setCvModalOpen(true)}
        onOpenCommandPalette={() => setCmdPaletteOpen(true)}
      />

      {/* 2. Dual-Stage Cosmic Black Hole Hero */}
      <CosmicHero isDark={isDark} />

      {/* 3. Portfolio — Featured Projects Showcase & Full-Screen Case Study Modal */}
      <FeaturedProjects />

      {/* 4. Education & Academic Background */}
      <EducationSection />

      {/* 5. Atmosphere Quote Banner */}
      <QuoteBanner />

      {/* 6. About Section with Animated Counter Stats */}
      <AboutSection />

      {/* 7. Tools & Software Expertise Arsenal */}
      <SoftwareExpertise />

      {/* 8. Wall of Fame — 4 Real Certifications Showcase */}
      <CertificationsWall />

      {/* 9. Blogs — Thoughts I've Shared Technical Articles */}
      <ThoughtsSection />

      {/* 10. Supporter Rewards — Fuel the Innovation */}
      <SupporterRewards isDark={isDark} />

      {/* 11. Contact & Comprehensive Footer */}
      <ContactFooter
        onOpenContactModal={(cat) => {
          if (cat) setContactModalCategory(cat);
          setContactModalOpen(true);
        }}
      />

      {/* 12. CV Download Modal */}
      <CvModal
        isOpen={cvModalOpen}
        onClose={() => setCvModalOpen(false)}
      />

      {/* 13. Floating Bottom-Center Theme Toggle */}
      <ThemeToggle
        isDark={isDark}
        onToggle={() => setIsDark((prev) => !prev)}
      />

      {/* 14. Quick Command Palette (⌘K Spotlight Search) */}
      <CommandPalette
        isOpen={cmdPaletteOpen}
        onOpenChange={setCmdPaletteOpen}
        theme={isDark ? "dark" : "light"}
        setTheme={(newTheme) => setIsDark(newTheme === "dark")}
        scrollToSection={scrollToSection}
        projects={PORTFOLIO_DATA.projects.map((p) => ({
          slug: p.slug,
          title: p.title,
          category: p.category,
          tech: p.tags,
          summary: p.summary,
        }))}
        posts={posts.map((p) => ({
          slug: p.slug,
          title: p.title,
          category: p.category,
          tags: p.tags,
        }))}
        onOpenCvModal={() => setCvModalOpen(true)}
        hideTrigger={true}
      />

      {/* 15. Direct Contact & Bug Report Modal */}
      <ContactModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        defaultCategory={contactModalCategory}
      />

      {/* Interactive Spidey Companion Cursor from kashyaap69 template */}
      <SpideyCursor />
    </div>
  );
}

export default App;
