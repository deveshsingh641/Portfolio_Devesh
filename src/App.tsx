import { useState, useEffect, Suspense, lazy } from "react";
import {
  Github,
  ExternalLink,
  Menu,
  X,
  FileText,
  Sun,
  Moon,
  Search,
  Monitor,
  Mail,
  Sparkles,
} from "lucide-react";
import { Helmet } from "react-helmet";
import Tilt from "react-parallax-tilt";
import NeonBackground from "./components/NeonBackground";
import BlogSection from "./components/BlogSection";
import CommandPalette from "./components/CommandPalette";
import Playground from "./components/Playground";
import MissionControl from "./components/MissionControl";
import BugReportButton from "./components/BugReportButton";
import SupporterRewards from "./components/SupporterRewards";
import ResumePage from "./components/ResumePage";
import ProjectCaseStudyPage from "./components/ProjectCaseStudyPage";
import BlogPostPage from "./components/BlogPostPage";
import ExperienceSection from "./components/ExperienceSection";
import PhilosophyBanner from "./components/PhilosophyBanner";
import AboutSection from "./components/AboutSection";
import SkillsSection from "./components/SkillsSection";
import CertificationsSection from "./components/CertificationsSection";
import ContactSection from "./components/ContactSection";
import DesktopManager from "./components/DesktopOS/DesktopManager";
import { projects, techCategories, education, certifications } from "./data/portfolio";
import { loadAllPosts, type Post } from "./blog/posts";
import { useEasterEggs, triggerKonamiEffect, triggerHiddenTerminal } from "./hooks/useEasterEggs";
import { MatrixScreensaver } from "./components/DesktopOS/MatrixScreensaver";
import {
  trackProfileView,
  trackSectionView,
  trackResumeAction,
  trackContactSubmission,
  trackOsModeToggle,
} from "./lib/analytics";

const ThreeHeroCanvas = lazy(() => import("./components/ThreeHeroCanvas"));

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [heroParallax, setHeroParallax] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [introGreeting, setIntroGreeting] = useState("Hello");
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [cursorVisible, setCursorVisible] = useState(false);
  const [cursorActive, setCursorActive] = useState(false);
  const [cursorLabel, setCursorLabel] = useState("");
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [projectFilter, setProjectFilter] = useState<string>("All");
  const [routePath, setRoutePath] = useState(() =>
    typeof window !== "undefined" ? window.location.pathname + window.location.hash : "/"
  );

  const [blogPosts, setBlogPosts] = useState<Post[]>([]);
  const [isOsMode, setIsOsMode] = useState(() => {
    try {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("isOsMode");
        return stored === "true";
      }
    } catch { /* ignore */ }
    return false;
  });

  useEffect(() => {
    try {
      localStorage.setItem("isOsMode", String(isOsMode));
    } catch { /* ignore */ }
    trackOsModeToggle(isOsMode);
  }, [isOsMode]);

  // --- Screensaver & Custom Easter Egg Command States ---
  const [isScreensaverActive, setIsScreensaverActive] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);
  const [isMatrixActive, setIsMatrixActive] = useState(false);

  useEffect(() => {
    let idleTimeout: ReturnType<typeof setTimeout> | undefined;

    const resetIdleTimer = () => {
      clearTimeout(idleTimeout);
      if (isScreensaverActive) return; // Don't set new timer while screensaver is showing
      idleTimeout = setTimeout(() => {
        setIsScreensaverActive(true);
      }, 45000); // 45 seconds of idle time
    };

    // User activity event listeners
    window.addEventListener("mousemove", resetIdleTimer);
    window.addEventListener("keydown", resetIdleTimer);
    window.addEventListener("mousedown", resetIdleTimer);
    window.addEventListener("scroll", resetIdleTimer);

    resetIdleTimer(); // Initial call

    // Terminal triggers custom event listeners
    const handleGlitch = () => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 1200);
    };

    const handleMatrixTheme = () => {
      setIsMatrixActive((prev) => !prev);
    };

    const handleScreensaver = () => {
      setIsScreensaverActive(true);
    };

    window.addEventListener("trigger-glitch", handleGlitch);
    window.addEventListener("trigger-matrix-theme", handleMatrixTheme);
    window.addEventListener("trigger-screensaver", handleScreensaver);

    return () => {
      clearTimeout(idleTimeout);
      window.removeEventListener("mousemove", resetIdleTimer);
      window.removeEventListener("keydown", resetIdleTimer);
      window.removeEventListener("mousedown", resetIdleTimer);
      window.removeEventListener("scroll", resetIdleTimer);
      window.removeEventListener("trigger-glitch", handleGlitch);
      window.removeEventListener("trigger-matrix-theme", handleMatrixTheme);
      window.removeEventListener("trigger-screensaver", handleScreensaver);
    };
  }, [isScreensaverActive]);

  const navigate = (to: string) => {
    if (typeof window === "undefined") return;
    if (to === routePath) return;
    // Support hash navigation (e.g. /#projects) as well as routes (/resume, /projects/:slug)
    const [path, hash] = to.split("#");
    window.history.pushState({}, "", `${path || "/"}${hash ? `#${hash}` : ""}`);
    setRoutePath(window.location.pathname + window.location.hash);
    // Only force-scroll to top for non-hash navigation.
    // Hash scrolling is handled in a dedicated effect so it also works on back/forward.
    if (!hash) {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  };

  useEffect(() => {
    const onPopState = () => setRoutePath(window.location.pathname + window.location.hash);
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  // Hash navigation: when URL has #section, scroll to that element.
  useEffect(() => {
    trackProfileView({
      route: routePath,
      osMode: isOsMode,
    });

    if (typeof window === "undefined") return;
    const hash = window.location.hash;
    if (!hash) return;

    const id = hash.replace(/^#/, "");
    if (!id) return;

    // Defer until the DOM for the new route is painted.
    requestAnimationFrame(() => {
      const element = document.getElementById(id);
      if (!element) return;

      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    });
  }, [routePath, isOsMode]);

  useEffect(() => {
    let active = true;
    loadAllPosts()
      .then((posts) => {
        if (active) setBlogPosts(posts);
      })
      .catch(() => {
        if (active) setBlogPosts([]);
      });
    return () => {
      active = false;
    };
  }, []);

  useEasterEggs({
    onKonami: () => triggerKonamiEffect(),
    onSecretCode: (code) => {
      if (code === "hidden-terminal") triggerHiddenTerminal();
      if (code === "developer-mode") setCommandPaletteOpen(true);
    },
  });

  // Contact form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [formStatus, setFormStatus] = useState({
    status: "", // "idle", "sending", "success", "error"
    message: "",
  });

  // Dark Mode State
  const [theme, setTheme] = useState(() => {
    try {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("theme");
        return stored ? stored : "dark";
      }
    } catch {
      // Ignore storage access issues (privacy mode, blocked storage).
    }
    return "dark";
  });

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    try {
      localStorage.setItem("theme", theme!);
    } catch {
      // Ignore storage access issues.
    }
  }, [theme]);

  useEffect(() => {
    if (!isLoading) return;

    // Match live-site loader greeting sequence
    setIntroGreeting("Hello");
    const timeouts: number[] = [];
    timeouts.push(window.setTimeout(() => setIntroGreeting("Namaste"), 400));
    timeouts.push(window.setTimeout(() => setIntroGreeting("Bonjour"), 800));
    timeouts.push(window.setTimeout(() => setIntroGreeting("Hola"), 1600));
    timeouts.push(window.setTimeout(() => setIntroGreeting("Ciao"), 2000));
    timeouts.push(window.setTimeout(() => setIntroGreeting("Welcome"), 2400));

    const timer = window.setTimeout(() => {
      setIsLoading(false);
    }, 2800);
    return () => {
      window.clearTimeout(timer);
      timeouts.forEach((t) => window.clearTimeout(t));
    };
  }, [isLoading]);

  // Command Palette keyboard shortcut
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K on Mac or Ctrl+K on Windows/Linux
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
      // Escape to close
      if (e.key === "Escape" && commandPaletteOpen) {
        setCommandPaletteOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [commandPaletteOpen]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.innerWidth < 768) return;

    const handleMove = (e: MouseEvent) => {
      setCursorVisible(true);
      setCursorPos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const interactive = target?.closest("[data-cursor-label]") as HTMLElement | null;
      if (interactive) {
        setCursorActive(true);
        setCursorLabel(interactive.dataset.cursorLabel || "");
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const related = e.relatedTarget as HTMLElement | null;
      const stillInside = related?.closest("[data-cursor-label]");
      if (!stillInside) {
        setCursorActive(false);
        setCursorLabel("");
      }
    };

    const handleLeaveWindow = () => setCursorVisible(false);

    window.addEventListener("mousemove", handleMove, { passive: true });
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mouseout", handleMouseOut);
    document.addEventListener("mouseleave", handleLeaveWindow);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mouseout", handleMouseOut);
      document.removeEventListener("mouseleave", handleLeaveWindow);
    };
  }, []);

  useEffect(() => {
    const revealItems = document.querySelectorAll<HTMLElement>("[data-reveal]");
    if (!revealItems.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            if (id) {
              setVisibleSections(prev => {
                const next = new Set(prev);
                next.add(id);
                return next;
              });
            }
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px 80px 0px" }
    );

    revealItems.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const currentPageUrl =
    typeof window !== "undefined" ? window.location.href : "";

  useEffect(() => {
    if (typeof window === "undefined") return;
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 50);

          const scrollTop = window.scrollY;
          const docHeight =
            document.documentElement.scrollHeight -
            document.documentElement.clientHeight;
          const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
          setScrollProgress(scrollPercent);

          const sections = [
            "home",
            "about",
            "skills",
            "blog",
            "playground",
            "projects",
            "now-tracker",
            "certifications",
            "supporter-rewards",
            "contact",
          ];
          const scrollPosition = window.scrollY + 100;

          for (const section of sections) {
            const element = document.getElementById(section);
            if (element) {
              const { offsetTop, offsetHeight } = element;
              if (
                scrollPosition >= offsetTop &&
                scrollPosition < offsetTop + offsetHeight
              ) {
                setActiveSection(section);
                trackSectionView(section);
                break;
              }
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    trackSectionView(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  const handleHeroMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (isMobile) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setHeroParallax({ x, y });
  };

  const resetHeroParallax = () => setHeroParallax({ x: 0, y: 0 });

  const handleMagneticMove = (e: React.MouseEvent<HTMLElement>) => {
    if (isMobile) return;
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate3d(${x * 0.16}px, ${y * 0.16}px, 0)`;
  };

  const handleMagneticLeave = (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.transform = "translate3d(0, 0, 0)";
  };

  // Handle form input changes
  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission (EmailJS primary, Formspree fallback)
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus({ status: "sending", message: "Sending your message..." });

    try {
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as
        | string
        | undefined;
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID as
        | string
        | undefined;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as
        | string
        | undefined;
      const receiveEmail = import.meta.env.VITE_RECEIVE_EMAIL as
        | string
        | undefined;
      const formspreeEndpoint = import.meta.env.VITE_FORMSPREE_ENDPOINT as
        | string
        | undefined;

      const submitViaFormspree = async () => {
        if (!formspreeEndpoint) {
          throw new Error("Formspree endpoint is not configured");
        }

        const response = await fetch(formspreeEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            subject: formData.subject,
            message: formData.message,
            source: "Portfolio Contact Form",
          }),
        });

        if (!response.ok) {
          throw new Error(`Formspree submission failed with status ${response.status}`);
        }
      };

      console.log("📧 Email Config Check:", { 
        publicKey: publicKey ? "✓ Found" : "✗ Missing", 
        serviceId: serviceId ? "✓ Found" : "✗ Missing", 
        templateId: templateId ? "✓ Found" : "✗ Missing", 
        receiveEmail: receiveEmail ? `✓ ${receiveEmail}` : "✗ Missing",
        formspreeEndpoint: formspreeEndpoint ? "✓ Found" : "✗ Missing"
      });

      // Prefer Formspree for static hosting reliability; fallback to EmailJS when configured.
      if (formspreeEndpoint) {
        console.log("📤 Sending message via Formspree");
        try {
          await submitViaFormspree();
          console.log("✅ Message sent successfully via Formspree");
        } catch (formspreeError) {
          if (!(publicKey && serviceId && templateId && receiveEmail)) {
            throw formspreeError;
          }
          console.warn("⚠️ Formspree failed, falling back to EmailJS", formspreeError);
          const emailjsModule = await import("emailjs-com");
          const emailjs = emailjsModule.default;
          emailjs.init(publicKey);
          const emailPayload = {
            to_email: receiveEmail,
            name: formData.name,
            email: formData.email,
            from_name: formData.name,
            from_email: formData.email,
            reply_to: formData.email,
            report_type: "contact",
            title: formData.subject || "Contact Form Inquiry",
            subject: formData.subject || "Contact Form Inquiry",
            message: formData.message,
          };
          console.log("📤 Sending email with payload:", emailPayload);
          await emailjs.send(serviceId, templateId, emailPayload);
          console.log("✅ Message sent successfully via EmailJS");
        }
      } else if (publicKey && serviceId && templateId && receiveEmail) {
        const emailjsModule = await import("emailjs-com");
        const emailjs = emailjsModule.default;
        emailjs.init(publicKey);
        const emailPayload = {
          to_email: receiveEmail,
          name: formData.name,
          email: formData.email,
          from_name: formData.name,
          from_email: formData.email,
          reply_to: formData.email,
          report_type: "contact",
          title: formData.subject || "Contact Form Inquiry",
          subject: formData.subject || "Contact Form Inquiry",
          message: formData.message,
        };
        console.log("📤 Sending email with payload:", emailPayload);
        await emailjs.send(serviceId, templateId, emailPayload);
        console.log("✅ Message sent successfully via EmailJS");
      } else {
        throw new Error(
          "❌ No email service configured. Set VITE_FORMSPREE_ENDPOINT (recommended) or configure EmailJS (VITE_EMAILJS_PUBLIC_KEY, VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, VITE_RECEIVE_EMAIL)."
        );
      }

      trackContactSubmission("success");
      setFormStatus({
        status: "success",
        message: "Message sent successfully! I'll get back to you within 24-48 hours.",
      });
      setFormData({ name: "", email: "", subject: "", message: "" });

      // Clear success message after 5 seconds
      setTimeout(() => {
        setFormStatus({ status: "", message: "" });
      }, 5000);
    } catch (error) {
      console.error("❌ Email sending failed:", error);
      const fullError = error instanceof Error ? error.message : JSON.stringify(error);
      const isStrictModeIssue = /strict mode/i.test(fullError);
      const helpMessage = isStrictModeIssue
        ? "EmailJS is in strict mode for server API. For reliable client-side delivery, set VITE_FORMSPREE_ENDPOINT in .env.local or adjust EmailJS strict-mode settings."
        : fullError;
      
      trackContactSubmission("error");
      setFormStatus({
        status: "error",
        message: `Failed to send message: ${helpMessage}. Please try contacting me directly at deveshsingh20666@gmail.com.`,
      });

      // Clear error message after 7 seconds
      setTimeout(() => {
        setFormStatus({ status: "", message: "" });
      }, 7000);
    }
  };

  const projectCategories = [
    "All",
    ...Array.from(new Set(projects.map((p) => p.category))).filter(Boolean),
  ];
  const filteredProjects =
    projectFilter === "All"
      ? projects
      : projects.filter((p) => p.category === projectFilter);

  const isResumeRoute = routePath.startsWith("/resume");
  const isProjectRoute = routePath.startsWith("/projects/");
  const isBlogRoute = routePath.startsWith("/blog/");
  const currentProjectSlug = isProjectRoute
    ? routePath.replace("/projects/", "").split("#")[0].split("?")[0]
    : "";
  const currentProject = isProjectRoute
    ? projects.find((p) => p.slug === currentProjectSlug)
    : undefined;

  const currentBlogSlug = isBlogRoute
    ? routePath.replace("/blog/", "").split("#")[0].split("?")[0]
    : "";
  const currentBlogPost = isBlogRoute
    ? blogPosts.find((p) => p.slug === currentBlogSlug)
    : undefined;

  return (
    <div className={`min-h-screen font-sans transition-colors duration-500 ${theme === 'dark' ? 'bg-[#050816] text-slate-100 selection:bg-cyan-500 selection:text-slate-950' : 'bg-slate-50 text-slate-900 selection:bg-violet-500 selection:text-white'}`}>
      {/* ARSLAN PAPER AIRPLANE CURSOR */}
      <div
        className={`arslan-cursor hidden md:flex items-center gap-2 pointer-events-none transition-opacity duration-150 ${
          cursorVisible ? "opacity-100" : "opacity-0"
        } ${cursorActive ? "scale-125" : "scale-100"}`}
        style={{ transform: `translate3d(${cursorPos.x}px, ${cursorPos.y}px, 0)` }}
      >
        <svg
          viewBox="0 0 24 24"
          width="24"
          height="24"
          className="fill-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] transform -rotate-45"
        >
          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
        </svg>
        {cursorLabel && (
          <span className="px-2 py-0.5 rounded-full bg-purple-600/90 text-[10px] font-mono text-white backdrop-blur shadow-md">
            {cursorLabel}
          </span>
        )}
      </div>

      {isLoading && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#040611] intro-screen">
          {/* Ambient glow */}
          <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-violet-600/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-cyan-500/15 rounded-full blur-[120px] animate-pulse" />

          <div className="relative flex flex-col items-center gap-6 z-10">
            {/* Greeting text */}
            <div className="relative overflow-hidden">
              <p className="intro-greeting text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-violet-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent animate-gradient">
                {introGreeting}
              </p>
            </div>

            {/* Name reveal */}
            <div className="intro-name-reveal">
              <p className="text-lg md:text-xl font-medium text-slate-400 tracking-wide">
                I'm <span className="text-white font-bold">Devesh Singh</span>
              </p>
            </div>

            {/* Loader */}
            <div className="relative mt-4">
              <div className="loader-ring" />
              <div className="loader-core" />
            </div>

            <p className="loader-text text-xs tracking-[0.35em] uppercase text-cyan-300/90 mt-2">
              Loading Portfolio
            </p>
          </div>
        </div>
      )}
      {theme === 'dark' && <NeonBackground />}
      <Helmet>
        <html lang="en" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <meta
          name="description"
          content="Devesh Singh - Full-Stack Developer building high-performance web applications with modern React, Node.js, and innovative solutions."
        />
        <meta
          name="keywords"
          content="Devesh Singh, full stack developer, React developer, Node.js, web development, portfolio"
        />
        <meta name="author" content="Devesh Singh" />
        <meta name="robots" content="index, follow" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Devesh Singh | Portfolio" />
        <meta
          property="og:description"
          content="Portfolio of Devesh Singh — Full-Stack Developer focused on fast, accessible, and user-centered products."
        />
        <meta property="og:image" content="/profile.jpg" />
        <meta property="og:url" content={currentPageUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Devesh Singh | Portfolio" />
        <meta
          name="twitter:description"
          content="Explore projects, skills, and certifications of Devesh Singh — Full-Stack Developer building innovative web solutions."
        />
        <meta name="twitter:image" content="/profile.jpg" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <title>Devesh Singh | Portfolio</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <style>{`
          body { font-family: 'Plus Jakarta Sans', sans-serif; }
          h1, h2, h3, h4, button { font-family: 'Outfit', sans-serif; }
        `}</style>
      </Helmet>

      {isOsMode ? (
        <DesktopManager
          theme={theme!}
          setTheme={setTheme}
          onToggleOsMode={() => setIsOsMode(false)}
          techCategories={techCategories}
          projects={projects}
          education={education}
          certifications={certifications}
          blogPosts={blogPosts}
          onNavigate={navigate}
          formData={formData}
          formStatus={formStatus}
          handleFormChange={handleFormChange}
          handleFormSubmit={handleFormSubmit}
        />
      ) : isResumeRoute ? (
        <ResumePage
          theme={theme!}
          onNavigate={navigate}
          techCategories={techCategories}
          projects={projects}
          education={education}
          certifications={certifications}
        />
      ) : isProjectRoute ? (
        <ProjectCaseStudyPage theme={theme!} project={currentProject} onNavigate={navigate} />
      ) : isBlogRoute ? (
        <BlogPostPage theme={theme!} slug={currentBlogSlug} post={currentBlogPost} onNavigate={navigate} />
      ) : (
      <>
      {/* SCROLL PROGRESS BAR */}
      <div
        className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-emerald-500 via-cyan-500 to-violet-500 z-[100] transition-all duration-100 ease-out"
        style={{ width: `${scrollProgress}%` }}
      ></div>

      {/* FIXED TOP NAVBAR — MATCHING SCREENSHOTS 1-8 */}
      <header className={`fixed top-0 left-0 right-0 z-50 px-6 sm:px-12 py-4 flex items-center justify-between border-b border-white/5 transition-all duration-300 ${
        scrolled ? "bg-black/90 backdrop-blur-xl shadow-lg shadow-black/40" : "bg-black/80 backdrop-blur-xl"
      }`}>
        <div
          role="button"
          tabIndex={0}
          onClick={() => scrollToSection("home")}
          className="font-display font-bold text-xl sm:text-2xl tracking-tight text-white cursor-pointer hover:opacity-90 transition-opacity"
        >
          Devesh S.
        </div>

        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-neutral-300">
          {[
            { id: "projects", label: "Portfolio" },
            { id: "experience", label: "Experience" },
            { id: "about", label: "About" },
            { id: "skills", label: "Skills" },
            { id: "certifications", label: "Certifications" },
            { id: "contact", label: "Contact" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`transition-colors ${
                activeSection === item.id ? "text-white font-semibold" : "text-neutral-400 hover:text-white"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setCommandPaletteOpen(true)}
            data-cursor-label="Search"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-mono border border-neutral-800 bg-neutral-900/80 text-neutral-400 hover:text-white hover:border-neutral-700 transition-colors"
            title="Search (⌘K)"
          >
            <Search size={13} />
            <span>⌘K</span>
          </button>

          <button
            onClick={toggleTheme}
            data-cursor-label="Theme"
            className="p-2 rounded-full border border-neutral-800 bg-neutral-900/80 text-neutral-400 hover:text-white transition-colors"
            aria-label="Toggle Dark Mode"
          >
            {theme === "dark" ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} />}
          </button>

          <button
            onClick={() => setIsOsMode(true)}
            data-cursor-label="OS Mode"
            className="p-2 rounded-full border border-neutral-800 bg-neutral-900/80 text-neutral-400 hover:text-white transition-colors"
            title="Switch to Developer OS Mode"
          >
            <Monitor size={15} />
          </button>

          <a
            href="/FINAL_RESUME_DEVESH.pdf"
            download="Devesh_Singh_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackResumeAction("download", "navbar")}
            className="px-5 py-2 rounded-full bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-colors shadow-sm"
          >
            Download CV
          </a>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-white"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div
          id="mobile-navigation"
          className="md:hidden fixed top-16 inset-x-4 z-50 rounded-3xl p-5 border border-neutral-800 bg-neutral-950/95 shadow-2xl backdrop-blur-2xl transition-all"
        >
          <div className="flex flex-col gap-1.5 text-sm font-medium text-neutral-300">
            {[
              { id: "home", label: "Home" },
              { id: "projects", label: "Portfolio" },
              { id: "experience", label: "Experience" },
              { id: "about", label: "About" },
              { id: "skills", label: "Skills" },
              { id: "certifications", label: "Certifications" },
              { id: "blog", label: "Blog" },
              { id: "contact", label: "Contact" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setIsMenuOpen(false);
                  scrollToSection(item.id);
                }}
                className="w-full text-left px-4 py-3 rounded-2xl hover:bg-neutral-900 hover:text-white transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <main className="bg-black text-white">
        {/* HERO SECTION — EXACT MATCH TO SCREENSHOTS 1 & 2 */}
        <section
          id="home"
          className="min-h-screen relative flex flex-col items-center justify-center text-center px-6 pt-28 pb-20 overflow-hidden bg-[#030307] text-white cosmic-grid-bg"
          onMouseMove={handleHeroMouseMove}
          onMouseLeave={resetHeroParallax}
        >
          {/* Three.js star particles canvas */}
          <Suspense fallback={<div className="absolute inset-0 pointer-events-none" />}>
            <ThreeHeroCanvas theme={theme!} />
          </Suspense>

          {/* Glowing Accretion Disk / Cosmic Celestial Arc from Screenshot 1 & 2 */}
          <div className="absolute bottom-[-160px] sm:bottom-[-220px] left-1/2 -translate-x-1/2 w-[1100px] sm:w-[1400px] max-w-[140vw] h-[340px] sm:h-[420px] rounded-[100%] border-t-2 border-purple-400/90 cosmic-arc-glow bg-gradient-to-t from-purple-950/70 via-purple-600/15 to-transparent pointer-events-none z-0" />

          <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
            {/* Top Status & Greeting Pills (Video 00:00 & Screenshot 2) */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-neutral-800 bg-neutral-900/80 backdrop-blur-md text-xs font-mono text-neutral-300">
                <span>Hello, I'm Devesh 👋</span>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-950/40 backdrop-blur-md text-xs font-mono text-purple-300 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                <span>AVAILABLE FOR WORK</span>
              </div>
            </div>

            {/* Huge Display Headline (Video 00:00-00:06 & Screenshots) */}
            <h1
              className="font-display text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight mb-6 leading-[1.05] text-white"
              style={{
                transform: `translate3d(${heroParallax.x * 12}px, ${heroParallax.y * 12}px, 0)`,
              }}
            >
              Architecting Scalable Systems,{" "}
              <span className="text-purple-400 font-display">Code & AI</span>
            </h1>

            {/* Subtitle */}
            <p
              className="text-base sm:text-xl text-neutral-400 font-normal mb-10 max-w-2xl leading-relaxed"
              style={{
                transform: `translate3d(${heroParallax.x * 8}px, ${heroParallax.y * 8}px, 0)`,
              }}
            >
              Full-Stack Developer building high-performance web applications, AI-accelerated delivery, and scalable cloud systems.
            </p>

            {/* Centered Connect Button (Screenshot 1 & 2) */}
            <div
              className="mb-14"
              style={{
                transform: `translate3d(${heroParallax.x * 10}px, ${heroParallax.y * 10}px, 0)`,
              }}
            >
              <button
                onClick={() => scrollToSection("contact")}
                data-cursor-label="Connect"
                onMouseMove={handleMagneticMove}
                onMouseLeave={handleMagneticLeave}
                className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-neutral-900/90 hover:bg-neutral-850 text-white border border-purple-500/40 shadow-[0_0_35px_rgba(168,85,247,0.35)] hover:shadow-[0_0_50px_rgba(168,85,247,0.6)] hover:border-purple-400 transition-all font-medium text-sm hover:scale-105 active:scale-95"
              >
                <Mail size={16} className="text-purple-400" />
                <span>Connect Now</span>
              </button>
            </div>

            {/* Bottom Horizon Subtitle (Screenshot 2) */}
            <div className="pt-8 flex flex-col items-center gap-6">
              <p className="text-[11px] font-mono tracking-[0.25em] text-neutral-400 uppercase">
                INDIA · AVAILABLE FOR WORK
              </p>

              {/* Circular Lens Indicator (Screenshot 1 & 2) */}
              <a
                href="#experience"
                className="w-10 h-10 rounded-full border border-neutral-800 bg-neutral-900/90 hover:border-purple-500/50 flex items-center justify-center text-purple-400 transition-all hover:scale-110 shadow-lg shadow-purple-500/20"
                aria-label="Scroll to Experience"
              >
                <div className="w-4 h-4 rounded-full border-2 border-current flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-current" />
                </div>
              </a>
            </div>
          </div>
        </section>

        {/* EXPERIENCE SECTION — SCREENSHOT 3 */}
        <ExperienceSection
          theme={theme!}
          visibleSections={visibleSections}
          education={education}
        />

        {/* PROJECTS SECTION — SCREENSHOT 4 */}
        <section
          id="projects"
          data-reveal
          className={`reveal-section ${visibleSections.has('projects') ? 'is-visible' : ''} py-28 px-6 bg-black text-white relative`}
        >
          <div className="max-w-6xl mx-auto">
            {/* Pill & Heading (Screenshot 4) */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-[11px] font-mono tracking-widest uppercase mb-4 border-neutral-800 bg-neutral-900/80 text-neutral-400">
                <span>PORTFOLIO</span>
              </div>

              <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
                <span className="text-neutral-400">My Featured </span>
                <span className="text-white">Projects</span>
              </h2>
            </div>

            {/* Category Filter Chips */}
            <div className="flex justify-center mb-12">
              <div className="flex flex-wrap gap-2 p-1.5 rounded-full border border-neutral-800 bg-neutral-900/70 backdrop-blur-sm">
                {projectCategories.map((cat) => {
                  const isActive = cat === projectFilter;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setProjectFilter(cat)}
                      className={`px-4 py-1.5 rounded-full text-xs font-medium tracking-tight transition-all duration-200 ${
                        isActive
                          ? "bg-white text-black font-semibold shadow-sm"
                          : "text-neutral-400 hover:text-white"
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3-Column Project Cards matching Screenshot 4 */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project, index) => (
                <Tilt
                  key={index}
                  tiltMaxAngleX={isMobile ? 0 : 3}
                  tiltMaxAngleY={isMobile ? 0 : 3}
                  tiltEnable={!isMobile}
                  glareEnable={false}
                  scale={1.01}
                  className="h-full"
                >
                  <div
                    className="p-6 rounded-[2rem] border border-neutral-800 bg-neutral-900/60 hover:border-neutral-700 transition-all flex flex-col justify-between h-full group"
                  >
                    <div>
                      {/* Top Header: Year on left, AI / Tag badge on right (Screenshot 4) */}
                      <div className="flex items-center justify-between mb-3 text-xs font-mono text-neutral-400">
                        <span>2026</span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border border-purple-500/40 bg-purple-950/40 text-purple-300 text-[10px] font-semibold">
                          <Sparkles size={10} />
                          BUILT USING AI
                        </span>
                      </div>

                      {/* Title & App name */}
                      <h3 className="font-display text-xl font-bold text-white mb-1 group-hover:text-purple-400 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-xs text-neutral-500 mb-5 font-mono">
                        {project.category} · {project.status}
                      </p>

                      {/* Mockup Frame (Screenshot 4) */}
                      <div className="h-56 rounded-2xl overflow-hidden relative bg-neutral-950 border border-neutral-800/80 mb-5">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                          loading="lazy"
                          decoding="async"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=1200&q=80";
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                      </div>

                      <p className="text-xs text-neutral-400 leading-relaxed mb-4 line-clamp-3">
                        {project.description}
                      </p>
                    </div>

                    {/* Action Links */}
                    <div className="pt-4 border-t border-neutral-800/80 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-full border border-neutral-700 text-xs text-neutral-300 hover:text-white hover:border-neutral-500 transition-all flex items-center gap-1"
                        >
                          <Github size={12} /> Source
                        </a>
                        <button
                          type="button"
                          onClick={() => navigate(`/projects/${project.slug}`)}
                          className="px-3 py-1.5 rounded-full border border-neutral-700 text-xs text-neutral-300 hover:text-purple-400 hover:border-purple-500 transition-all flex items-center gap-1"
                        >
                          <FileText size={12} /> Case Study
                        </button>
                      </div>

                      {project.live && project.live !== '#' && (
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-full bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-colors flex items-center gap-1"
                        >
                          <span>Live</span>
                          <ExternalLink size={11} />
                        </a>
                      )}
                    </div>
                  </div>
                </Tilt>
              ))}
            </div>

            {/* Bottom Circular Lens Indicator */}
            <div className="mt-16 flex justify-center">
              <a
                href="#about"
                className="w-10 h-10 rounded-full border border-neutral-800 bg-neutral-900/80 hover:border-purple-500/50 flex items-center justify-center text-purple-400 transition-all hover:scale-110 shadow-lg shadow-purple-500/10"
                aria-label="Scroll to Philosophy"
              >
                <div className="w-4 h-4 rounded-full border-2 border-current flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-current" />
                </div>
              </a>
            </div>
          </div>
        </section>

        {/* PHILOSOPHY IMPACT BANNER — SCREENSHOT 5 */}
        <PhilosophyBanner theme={theme!} />

        {/* ABOUT SECTION — SCREENSHOT 6 */}
        <AboutSection
          theme={theme!}
          visibleSections={visibleSections}
          scrollToSection={scrollToSection}
          education={education}
          isMobile={isMobile}
        />

        {/* SKILLS SECTION ("Software Expertise") — SCREENSHOT 7 */}
        <SkillsSection
          theme={theme!}
          visibleSections={visibleSections}
          techCategories={techCategories}
        />

        {/* CERTIFICATIONS SECTION ("Wall of Fame") */}
        <CertificationsSection
          theme={theme!}
          visibleSections={visibleSections}
          certifications={certifications}
        />

        {/* BLOG SECTION ("Thoughts I've Shared") */}
        <section
          id="blog"
          data-reveal
          className={`reveal-section ${visibleSections.has('blog') ? 'is-visible' : ''} py-28 px-6 bg-black text-white relative`}
        >
          <div className="max-w-6xl mx-auto">
            <div className="mb-12 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-[11px] font-mono tracking-widest uppercase mb-3 border-neutral-800 bg-neutral-900/80 text-neutral-400">
                <span>BLOGS</span>
              </div>
              <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight">
                <span className="text-neutral-400">Thoughts I've </span>
                <span className="text-white">Shared</span>
              </h2>
              <p className="text-sm sm:text-base text-neutral-400 mt-2 max-w-xl mx-auto">
                Architecture notes, engineering trade-offs, and implementation insights from real-world systems.
              </p>
            </div>

            <BlogSection theme={theme!} posts={blogPosts} onNavigate={navigate} />
          </div>
        </section>

        {/* PLAYGROUND SECTION */}
        <section
          id="playground"
          data-reveal
          className={`reveal-section ${visibleSections.has('playground') ? 'is-visible' : ''} py-24 px-6 bg-neutral-950 text-white relative overflow-hidden`}
        >
          <div className="max-w-6xl mx-auto">
            <Playground theme={theme!} setTheme={setTheme} />
          </div>
        </section>

        {/* NOW TRACKER / MISSION CONTROL */}
        <section
          id="now-tracker"
          data-reveal
          className={`reveal-section ${visibleSections.has('now-tracker') ? 'is-visible' : ''} py-24 px-6 bg-black text-white relative overflow-hidden`}
        >
          <div className="max-w-6xl mx-auto">
            <MissionControl theme={theme!} />
          </div>
        </section>

        {/* SUPPORTER REWARDS / RAZORPAY INTEGRATION */}
        <section
          id="supporter-rewards"
          data-reveal
          className={`reveal-section ${visibleSections.has('supporter-rewards') ? 'is-visible' : ''} py-24 px-6 bg-neutral-950 text-white relative overflow-hidden`}
        >
          <div className="max-w-6xl mx-auto">
            <SupporterRewards theme={theme!} />
          </div>
        </section>

        {/* CONTACT SECTION */}
        <ContactSection
          theme={theme!}
          visibleSections={visibleSections}
          formData={formData}
          formStatus={formStatus}
          handleFormChange={handleFormChange}
          handleFormSubmit={handleFormSubmit}
          isMobile={isMobile}
        />

        {/* ARSLAN FOOTER — EXACT MATCH TO SCREENSHOT 8 */}
        <footer className="py-24 px-6 bg-black text-white border-t border-neutral-900 text-center relative overflow-hidden">
          <div className="max-w-4xl mx-auto flex flex-col items-center">
            {/* Pill: Contact (Screenshot 8) */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-[11px] font-mono tracking-widest uppercase mb-6 border-neutral-800 bg-neutral-900/80 text-neutral-400">
              <span>Contact</span>
            </div>

            {/* Headline: Thank you for visiting! (Screenshot 8) */}
            <h2 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-4 text-white">
              Thank you <span className="italic font-light text-neutral-400 font-serif">for visiting!</span>
            </h2>

            {/* Subtitle (Screenshot 8) */}
            <p className="text-sm sm:text-base text-neutral-400 mb-10 max-w-md">
              Let's work together! You can also say hi to me on
            </p>

            {/* Pill Links with ↗ Arrow (Screenshot 8) */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
              <a
                href="mailto:deveshsingh20666@gmail.com"
                className="px-6 py-3 rounded-full border border-neutral-800 bg-neutral-900/80 hover:border-neutral-600 hover:bg-neutral-800 text-white text-xs font-mono transition-all hover:scale-105"
              >
                Email ↗
              </a>
              <a
                href="https://linkedin.com/in/deveshsingh64"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-full border border-neutral-800 bg-neutral-900/80 hover:border-neutral-600 hover:bg-neutral-800 text-white text-xs font-mono transition-all hover:scale-105"
              >
                LinkedIn ↗
              </a>
              <a
                href="https://github.com/deveshsingh641"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-full border border-neutral-800 bg-neutral-900/80 hover:border-neutral-600 hover:bg-neutral-800 text-white text-xs font-mono transition-all hover:scale-105"
              >
                GitHub ↗
              </a>
              <a
                href="https://x.com/harshhere_666"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-full border border-neutral-800 bg-neutral-900/80 hover:border-neutral-600 hover:bg-neutral-800 text-white text-xs font-mono transition-all hover:scale-105"
              >
                X / Twitter ↗
              </a>
              <a
                href="https://deveshdev.live"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-full border border-neutral-800 bg-neutral-900/80 hover:border-neutral-600 hover:bg-neutral-800 text-white text-xs font-mono transition-all hover:scale-105"
              >
                Live Site ↗
              </a>
            </div>

            {/* Lower Footer 3-Column Bar (Video 00:52) */}
            <div className="w-full pt-16 mt-8 border-t border-neutral-900 grid grid-cols-1 md:grid-cols-3 gap-10 text-left mb-16">
              {/* Brand & Bio */}
              <div>
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center font-bold text-sm text-purple-300">
                    D
                  </div>
                  <span className="font-display font-bold text-lg text-white">Devesh S.</span>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed mb-3 max-w-xs">
                  Full-Stack Developer crafting clean, high-performance & scalable digital experiences.
                </p>
                <a
                  href="mailto:deveshsingh20666@gmail.com"
                  className="text-xs font-mono text-purple-400 hover:text-purple-300 transition-colors"
                >
                  deveshsingh20666@gmail.com
                </a>
              </div>

              {/* Navigation Links */}
              <div>
                <h4 className="text-xs font-mono uppercase tracking-widest text-neutral-500 mb-4">Navigation</h4>
                <ul className="space-y-2.5 text-xs text-neutral-400 font-medium">
                  <li><a href="#projects" className="hover:text-white transition-colors">Portfolio</a></li>
                  <li><a href="#experience" className="hover:text-white transition-colors">Experience</a></li>
                  <li><a href="#about" className="hover:text-white transition-colors">About</a></li>
                  <li><a href="#contact" className="hover:text-white transition-colors">Contact me</a></li>
                </ul>
              </div>

              {/* Social / Connect */}
              <div>
                <h4 className="text-xs font-mono uppercase tracking-widest text-neutral-500 mb-4">Connect</h4>
                <ul className="space-y-2.5 text-xs text-neutral-400 font-medium">
                  <li><a href="https://linkedin.com/in/deveshsingh64" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LinkedIn ↗</a></li>
                  <li><a href="https://github.com/deveshsingh641" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub ↗</a></li>
                  <li><a href="/FINAL_RESUME_DEVESH.pdf" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Resume ↗</a></li>
                  <li><a href="https://deveshdev.live" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Live Site ↗</a></li>
                </ul>
              </div>
            </div>

            {/* Giant Watermark & Centered Lens Indicator (Video 00:54 - 01:02) */}
            <div className="relative w-full overflow-hidden py-10 flex flex-col items-center justify-center">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                <span className="font-display font-black text-[14vw] tracking-tighter text-white/[0.04] uppercase">
                  DEVESH S.
                </span>
              </div>

              {/* Bottom Circular Lens Indicator */}
              <a
                href="#home"
                className="relative z-10 w-11 h-11 rounded-full border border-neutral-800 bg-neutral-900/90 hover:border-purple-500/50 flex items-center justify-center text-purple-400 transition-all hover:scale-110 shadow-lg shadow-purple-500/10"
                aria-label="Back to Top"
              >
                <div className="w-4 h-4 rounded-full border-2 border-current flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-current" />
                </div>
              </a>
            </div>

            <p className="text-xs font-mono text-neutral-600 mt-4">
              © {new Date().getFullYear()} Devesh Singh · Crafted with precision
            </p>
          </div>
        </footer>
      </main>
      </>
      )}

      {/* BUG REPORT BUTTON */}
      <BugReportButton theme={theme!} />

      {/* COMMAND PALETTE */}
      <CommandPalette
        theme={theme!}
        setTheme={setTheme}
        scrollToSection={scrollToSection}
        navigate={navigate}
        posts={blogPosts.map((p) => ({ slug: p.slug, title: p.title }))}
        projects={projects.map((p) => ({ slug: p.slug, title: p.title, category: p.category, tech: p.tech }))}
        isOpen={commandPaletteOpen}
        onOpenChange={setCommandPaletteOpen}
      />

      {/* MATRIX GREEN CRT phosphor STYLE */}
      {isMatrixActive && (
        <style>{`
          * {
            font-family: 'Courier New', Courier, monospace !important;
            color: #10b981 !important;
            border-color: rgba(16, 185, 129, 0.35) !important;
            text-shadow: 0 0 4px rgba(16, 185, 129, 0.65) !important;
          }
          body, html, div, section, nav, footer, main {
            background-color: #020702 !important;
            background-image: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06)) !important;
            background-size: 100% 4px, 6px 100% !important;
          }
          button, a {
            text-decoration: underline !important;
          }
          img, canvas, svg {
            filter: sepia(1) saturate(5) hue-rotate(80deg) !important;
          }
        `}</style>
      )}

      {/* CYBERPUNK GLITCH SCREEN OVERLAY */}
      {isGlitching && (
        <>
          <div className="fixed inset-0 z-[400] pointer-events-none" style={{
            background: 'rgba(255, 0, 0, 0.03)',
            animation: 'glitch-shift 0.15s infinite',
            mixBlendMode: 'exclusion',
          }} />
          <div className="fixed inset-0 z-[401] pointer-events-none" style={{
            background: 'rgba(0, 255, 255, 0.03)',
            animation: 'glitch-shift 0.15s infinite reverse',
            mixBlendMode: 'exclusion',
          }} />
          <div className="fixed inset-0 z-[402] pointer-events-none" style={{
            background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0px, rgba(0,0,0,0.15) 1px, transparent 1px, transparent 3px)',
            animation: 'glitch-scanlines 0.08s infinite',
          }} />
          <style>{`
            @keyframes glitch-shift {
              0% { transform: translate(0, 0); }
              20% { transform: translate(-3px, 1px); }
              40% { transform: translate(3px, -2px); }
              60% { transform: translate(-1px, 3px); }
              80% { transform: translate(2px, -1px); }
              100% { transform: translate(0, 0); }
            }
            @keyframes glitch-scanlines {
              0% { opacity: 0.6; }
              50% { opacity: 0.3; }
              100% { opacity: 0.6; }
            }
          `}</style>
        </>
      )}

      {/* MATRIX SCREENSAVER */}
      {isScreensaverActive && (
        <MatrixScreensaver onClose={() => setIsScreensaverActive(false)} />
      )}
    </div>
  );
}

export default App;
