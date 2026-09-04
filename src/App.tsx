import { useState, useEffect, Suspense, lazy } from "react";
import {
  Github,
  ExternalLink,
  Menu,
  X,
  FileText,
  ChevronRight,
  Download,
  Sun,
  Moon,
  Search,
  Monitor,
} from "lucide-react";
import { Helmet } from "react-helmet";
import Tilt from "react-parallax-tilt";
import { TypeAnimation } from "react-type-animation";
import NeonBackground from "./components/NeonBackground";
import BlogSection from "./components/BlogSection";
import ProjectPreview from "./components/ProjectPreview";
import CommandPalette from "./components/CommandPalette";
import Playground from "./components/Playground";
import MissionControl from "./components/MissionControl";
import BugReportButton from "./components/BugReportButton";
import SupporterRewards from "./components/SupporterRewards";
import ResumePage from "./components/ResumePage";
import ProjectCaseStudyPage from "./components/ProjectCaseStudyPage";
import BlogPostPage from "./components/BlogPostPage";
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
  trackProjectInteraction,
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

  const handleCardSpotlightMove = (e: React.MouseEvent<HTMLElement>) => {
    if (isMobile) return;
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty("--sx", `${x}px`);
    el.style.setProperty("--sy", `${y}px`);
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
  const uniqueTechCount = new Set(projects.flatMap((p) => p.tech)).size;

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
      <div
        className={`custom-cursor hidden md:flex ${cursorVisible ? "opacity-100" : "opacity-0"} ${cursorActive ? "is-active" : ""}`}
        style={{ transform: `translate3d(${cursorPos.x}px, ${cursorPos.y}px, 0)` }}
      >
        <div className="custom-cursor-ring" />
        <div className="custom-cursor-core" />
        {cursorLabel && <span className="custom-cursor-label">{cursorLabel}</span>}
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
        className="fixed top-0 left-0 h-0.5 bg-gradient-to-r from-violet-600 to-cyan-400 z-[100] transition-all duration-100 ease-out"
        style={{ width: `${scrollProgress}%` }}
      ></div>

      {/* NAVBAR */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled
          ? `${theme === 'dark' ? 'bg-slate-950/90 border-cyan-300/30' : 'bg-white/90 border-slate-200'} backdrop-blur-md shadow-lg py-2 border-b`
          : "bg-transparent py-4"
          }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div
              className="text-2xl font-extrabold tracking-tight cursor-pointer flex items-center gap-2"
              role="button"
              tabIndex={0}
              onClick={() => scrollToSection("home")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  scrollToSection("home");
                }
              }}
            >
              <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 via-emerald-500 to-cyan-400 flex items-center justify-center text-white text-lg shadow-lg shadow-violet-500/50">
                D
              </span>
              <span className={`bg-gradient-to-r ${scrolled ? 'from-violet-300 via-emerald-300 to-cyan-300' : 'from-white via-emerald-200 to-cyan-200'} bg-clip-text text-transparent font-bold transition-colors duration-300`}>
                Devesh
              </span>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setCommandPaletteOpen(true)}
                data-cursor-label="Search"
                className={`hidden md:flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
                  theme === 'dark'
                    ? (scrolled ? 'bg-slate-800/60 border-slate-600 hover:border-cyan-400/50' : 'bg-black/20 border-white/10 hover:border-cyan-400/50')
                    : (scrolled ? 'bg-slate-50 border-slate-200 hover:border-violet-400/50' : 'bg-white/20 border-slate-300/30 hover:border-violet-400/50')
                }`}
                aria-label="Open command palette"
              >
                <Search size={16} className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'} />
                <span className={`text-xs font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                  ⌘K
                </span>
              </button>

              <button
                onClick={toggleTheme}
                data-cursor-label="Theme"
                className={`p-2 rounded-full transition-colors border ${theme === 'dark'
                  ? (scrolled ? 'border-cyan-400/30 text-slate-100 hover:bg-cyan-500/10' : 'border-white/20 text-white hover:bg-white/10')
                  : (scrolled ? 'border-slate-300 text-slate-700 hover:bg-slate-100' : 'border-slate-400/30 text-slate-700 hover:bg-slate-200/50')
                }`}
                aria-label="Toggle Dark Mode"
              >
                {theme === "dark" ? (
                  <Sun size={20} className={scrolled ? "text-yellow-500" : "text-yellow-300"} />
                ) : (
                  <Moon size={20} className="text-violet-600" />
                )}
              </button>

              <button
                onClick={() => setIsOsMode(true)}
                data-cursor-label="OS Mode"
                className={`p-2 rounded-full transition-colors border ${theme === 'dark'
                  ? (scrolled ? 'border-cyan-400/30 text-slate-100 hover:bg-cyan-500/10' : 'border-white/20 text-white hover:bg-white/10')
                  : (scrolled ? 'border-slate-300 text-slate-700 hover:bg-slate-100' : 'border-slate-400/30 text-slate-700 hover:bg-slate-200/50')
                }`}
                aria-label="Switch to Developer OS Mode"
                title="Switch to Developer OS Mode"
              >
                <Monitor size={20} />
              </button>

              <div className={`hidden md:flex space-x-1 p-1 rounded-full border transition-all duration-300 ${theme === 'dark'
                ? (scrolled ? 'bg-slate-900/60 border-cyan-400/20' : 'bg-black/20 border-white/10 backdrop-blur-md')
                : (scrolled ? 'bg-slate-100/80 border-slate-200' : 'bg-white/30 border-slate-300/30 backdrop-blur-md')
              }`}>
                {[
                  "home",
                  "about",
                  "skills",
                  "blog",
                  "projects",
                  "certifications",
                  "contact",
                ].map((item) => (
                  <button
                    key={item}
                    data-cursor-label={item}
                    onClick={() => (item === "resume" ? navigate("/resume") : scrollToSection(item))}
                    onMouseMove={handleMagneticMove}
                    onMouseLeave={handleMagneticLeave}
                    className={`magnetic-nav-item relative px-4 py-1.5 rounded-full capitalize transition-all font-medium text-sm ${activeSection === item
                      ? `bg-gradient-to-r from-violet-500/25 to-cyan-500/25 ${theme === 'dark' ? 'text-cyan-200' : 'text-violet-700'} shadow-md font-bold scale-105 border border-cyan-400/30`
                      : theme === 'dark'
                        ? (scrolled ? "text-slate-200 hover:text-cyan-200" : "text-gray-200 hover:text-white")
                        : (scrolled ? "text-slate-600 hover:text-violet-600" : "text-slate-700 hover:text-violet-600")
                      }`}
                  >
                    {item}
                    <span
                      className={`pointer-events-none absolute left-2 right-2 -bottom-0.5 h-[2px] rounded-full transition-all duration-300 ${
                        activeSection === item
                          ? "opacity-100 bg-gradient-to-r from-violet-400 via-emerald-400 to-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.8)]"
                          : "opacity-0"
                      }`}
                    />
                  </button>
                ))}
              </div>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`md:hidden p-2 transition-colors ${theme === 'dark' ? (scrolled ? 'text-slate-200' : 'text-white') : (scrolled ? 'text-slate-700' : 'text-slate-800')}`}
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMenuOpen}
                aria-controls="mobile-navigation"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div
            id="mobile-navigation"
            className={`md:hidden backdrop-blur-xl border-t shadow-xl absolute w-full animate-slideInDown ${theme === 'dark' ? 'bg-slate-950/95 border-cyan-400/20' : 'bg-white/95 border-slate-200'}`}
          >
            <div className="px-4 py-4 space-y-2">
              {[
                "home",
                "about",
                "skills",
                "blog",
                "projects",
                "certifications",
                "contact",
              ].map((item) => (
                <button
                  key={item}
                  onClick={() => (item === "resume" ? navigate("/resume") : scrollToSection(item))}
                  className={`block w-full text-left px-4 py-3 capitalize rounded-lg transition-colors font-medium ${theme === 'dark' ? 'text-slate-200 hover:bg-violet-500/20' : 'text-slate-700 hover:bg-violet-50'}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      <main>
        {/* HERO SECTION */}
        <section
          id="home"
          className="min-h-screen h-auto flex flex-col md:flex-row items-center justify-center relative overflow-hidden px-6 md:px-20 py-10 gap-10"
          onMouseMove={handleHeroMouseMove}
          onMouseLeave={resetHeroParallax}
        >
          <Suspense fallback={<div className="absolute inset-0 pointer-events-none" />}>
            <ThreeHeroCanvas theme={theme!} />
          </Suspense>
          <div className="hidden md:block absolute top-0 w-full h-full overflow-hidden z-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob motion-reduce:animate-none"></div>
            <div className="absolute top-0 right-1/4 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000 motion-reduce:animate-none"></div>
            <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000 motion-reduce:animate-none"></div>
          </div>

          <div className="relative z-10 w-full max-w-5xl mx-auto text-center">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold tracking-wide uppercase mb-8 animate-fadeInUp shadow-sm ${theme === 'dark' ? 'bg-slate-950/80 border-cyan-300/50 text-cyan-100' : 'bg-white/90 border-violet-300/50 text-violet-700'}`}>
              <span className="w-2.5 h-2.5 rounded-full bg-violet-600 animate-blink"></span>
              Open to Work
            </div>

            <h1
              className={`text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight animate-slideInUp parallax-layer ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}
              style={{
                transform: `translate3d(${heroParallax.x * 18}px, ${heroParallax.y * 18}px, 0)`,
              }}
            >
              Crafting{" "}
              <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-sm animate-gradient">
                Digital Reality
              </span>{" "}
              with Code.
            </h1>

            {/* TYPEWRITER EFFECT */}
            <div
              className={`text-xl md:text-2xl font-medium mb-10 max-w-3xl mx-auto text-center leading-relaxed h-20 md:h-auto parallax-layer ${theme === 'dark' ? 'text-slate-100' : 'text-slate-700'}`}
              style={{
                transform: `translate3d(${heroParallax.x * 10}px, ${heroParallax.y * 10}px, 0)`,
              }}
            >
              I am a{" "}
              <span className="bg-gradient-to-r from-violet-400 to-emerald-400 bg-clip-text text-transparent font-bold block md:inline mt-2 md:mt-0">
                <TypeAnimation
                  sequence={[
                    "Full Stack Developer",
                    2000,
                    "Problem Solver",
                    2000,
                    "App Developer",
                    2000,
                    "Tech Innovator",
                    2000,
                  ]}
                  wrapper="span"
                  speed={50}
                  repeat={Infinity}
                />
              </span>
            </div>

            <div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slideInUp parallax-layer"
              style={{
                transform: `translate3d(${heroParallax.x * 14}px, ${heroParallax.y * 14}px, 0)`,
              }}
            >
              <button
                onClick={() => scrollToSection("projects")}
                data-cursor-label="Projects"
                onMouseMove={handleMagneticMove}
                onMouseLeave={handleMagneticLeave}
                className="magnetic-btn group relative px-8 py-4 bg-gradient-to-r from-violet-600 via-emerald-500 to-cyan-400 rounded-full text-white font-semibold shadow-2xl shadow-violet-500/50 hover:shadow-3xl hover:shadow-emerald-500/50 hover:-translate-y-2 transition-all overflow-hidden w-full sm:w-auto"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-violet-700 via-emerald-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative flex items-center justify-center gap-2">
                  View Projects <ChevronRight size={18} />
                </span>
              </button>


              <a
                href="/FINAL_RESUME_DEVESH.pdf"
                download="Devesh_Singh_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                data-cursor-label="Download"
                onClick={() => trackResumeAction("download", "hero_section")}
                className={`magnetic-btn px-6 py-4 rounded-full font-bold border shadow-md transition-all flex items-center justify-center gap-2 w-full sm:w-auto hover:scale-105 ${theme === 'dark' ? 'bg-slate-950/60 text-slate-200 border-slate-700/50 hover:border-cyan-300/50' : 'bg-white text-slate-700 border-slate-200 hover:border-violet-300/50'}`}
              >
                Download PDF <Download size={18} />
              </a>
            </div>

          </div>
        </section>

        {/* ABOUT SECTION */}
        <AboutSection
          theme={theme!}
          visibleSections={visibleSections}
          scrollToSection={scrollToSection}
          navigate={navigate}
          education={education}
          isMobile={isMobile}
        />

        {/* SKILLS SECTION */}
        <SkillsSection
          theme={theme!}
          visibleSections={visibleSections}
          techCategories={techCategories}
        />


        {/* BLOG SECTION */}
        <section id="blog" data-reveal className={`reveal-section ${visibleSections.has('blog') ? 'is-visible' : ''} py-24 transition-colors duration-300 ${theme === 'dark' ? 'bg-gradient-to-b from-slate-900/40 via-violet-900/10 to-slate-900/40' : 'bg-gradient-to-b from-slate-100/40 via-violet-50/10 to-slate-100/40'}`}>
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className={`text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>Technical Writing</h2>
              <p className={theme === 'dark' ? 'text-slate-200' : 'text-slate-600'}>
                Architecture notes, engineering trade-offs, and implementation details from real projects.
              </p>
              <div className="w-32 h-1.5 bg-gradient-to-r from-violet-600 via-emerald-500 to-cyan-400 mx-auto rounded-full shadow-lg shadow-violet-400/50 mt-4"></div>
            </div>

            <BlogSection theme={theme!} posts={blogPosts} onNavigate={navigate} />
          </div>
        </section>

        {/* PLAYGROUND SECTION */}
        <section id="playground" data-reveal className={`reveal-section ${visibleSections.has('playground') ? 'is-visible' : ''} py-24 relative overflow-hidden transition-colors duration-300 ${theme === 'dark' ? 'bg-gradient-to-b from-slate-900/40 via-cyan-900/15 to-slate-900/40' : 'bg-gradient-to-b from-slate-100/40 via-cyan-50/15 to-slate-100/40'}`}>
          <div className="max-w-6xl mx-auto px-4">
            <Playground theme={theme!} setTheme={setTheme} />
          </div>
        </section>

        {/* PROJECTS SECTION */}
        <section id="projects" data-reveal className={`reveal-section ${visibleSections.has('projects') ? 'is-visible' : ''} py-24 ${theme === 'dark' ? 'bg-gradient-to-b from-slate-900/40 via-cyan-900/20 to-slate-900/40' : 'bg-gradient-to-b from-slate-100/40 via-cyan-50/20 to-slate-100/40'}`}>
          <div className="max-w-6xl mx-auto px-4">
            <div className="mb-12">
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
                <div className="max-w-2xl">
                  <p className="text-xs font-mono uppercase tracking-[0.35em] text-emerald-400 mb-3">ALLPROJECTS.</p>
                  <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    A curated collection of{" "}
                    <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent">
                      work
                    </span>
                  </h2>
                  <p className={`text-lg ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                    Projects spanning full-stack applications, AI-driven systems, and polished frontend experiences.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <div className={`px-4 py-3 rounded-2xl border backdrop-blur-sm ${theme === 'dark' ? 'bg-slate-950/60 border-slate-700/40' : 'bg-white/70 border-slate-200'}`}>
                    <p className={`text-[10px] font-mono uppercase tracking-[0.35em] ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>PROJECTS</p>
                    <p className={`text-xl font-extrabold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{projects.length}+</p>
                  </div>
                  <div className={`px-4 py-3 rounded-2xl border backdrop-blur-sm ${theme === 'dark' ? 'bg-slate-950/60 border-slate-700/40' : 'bg-white/70 border-slate-200'}`}>
                    <p className={`text-[10px] font-mono uppercase tracking-[0.35em] ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>TECHNOLOGIES</p>
                    <p className={`text-xl font-extrabold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{uniqueTechCount}+</p>
                  </div>
                  <div className={`px-4 py-3 rounded-2xl border backdrop-blur-sm ${theme === 'dark' ? 'bg-slate-950/60 border-slate-700/40' : 'bg-white/70 border-slate-200'}`}>
                    <p className={`text-[10px] font-mono uppercase tracking-[0.35em] ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>PASSION</p>
                    <p className={`text-xl font-extrabold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>100%</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <p className={`text-sm font-semibold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                  {filteredProjects.length} project{filteredProjects.length === 1 ? "" : "s"} found
                </p>

                <div className="flex flex-wrap gap-2">
                  {projectCategories.map((cat) => {
                    const isActive = cat === projectFilter;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setProjectFilter(cat)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border transition-all duration-300 ${
                          isActive
                            ? 'bg-gradient-to-r from-emerald-500/25 to-cyan-500/25 text-emerald-200 border-emerald-400/40'
                            : theme === 'dark'
                              ? 'bg-slate-900/40 text-slate-300 border-slate-700/50 hover:border-emerald-400/30 hover:text-emerald-200'
                              : 'bg-white/70 text-slate-700 border-slate-200 hover:border-emerald-400/40 hover:text-emerald-700'
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="w-32 h-1.5 bg-gradient-to-r from-violet-600 via-emerald-500 to-cyan-400 rounded-full shadow-lg shadow-violet-400/50 mt-8"></div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 stagger-animation">
              {filteredProjects.map((project, index) => (
                <Tilt
                  key={index}
                  tiltMaxAngleX={isMobile ? 0 : 6}
                  tiltMaxAngleY={isMobile ? 0 : 6}
                  tiltEnable={!isMobile}
                  glareEnable={!isMobile}
                  glareMaxOpacity={0.15}
                  scale={1.02}
                  className="h-full"
                >
                  <div
                    onMouseMove={handleCardSpotlightMove}
                    className={`project-spotlight-card group relative rounded-2xl overflow-hidden border shadow-xl hover:shadow-2xl h-full flex flex-col transition-all duration-500 hover:-translate-y-2 ${theme === 'dark' ? 'bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-slate-950/95 border-slate-700/40 hover:border-emerald-400/50' : 'bg-white border-slate-200 hover:border-emerald-400/60 hover:shadow-slate-300/40'}`}
                  >
                    {/* Image */}
                    <div className="h-52 overflow-hidden relative">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />

                      {/* Status badge */}
                      <div className={`absolute top-3 left-3 z-20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border backdrop-blur-sm ${
                        project.status === 'Live'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                          : 'bg-violet-500/20 text-violet-300 border-violet-400/40'
                      }`}>
                        <span className="flex items-center gap-1.5">
                          {project.status === 'Live' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
                          {project.status}
                        </span>
                      </div>

                      {/* Category badge */}
                      <div className="absolute top-3 right-3 z-20 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/40 text-white/80 border border-white/20 backdrop-blur-sm">
                        {project.category}
                      </div>

                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=1200&q=80";
                        }}
                      />

                      {/* Tech stack overlay */}
                      <div className="absolute bottom-3 left-3 right-3 z-20 flex gap-1.5 flex-wrap">
                        {project.tech.slice(0, 4).map((t, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 bg-black/40 backdrop-blur-md text-white text-[10px] rounded-md border border-white/20 font-semibold"
                          >
                            {t}
                          </span>
                        ))}
                        {project.tech.length > 4 && (
                          <span className="px-2 py-0.5 bg-black/40 backdrop-blur-md text-white/70 text-[10px] rounded-md border border-white/20">
                            +{project.tech.length - 4}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className={`text-lg font-bold mb-2 group-hover:text-emerald-400 transition-colors ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>
                        {project.title}
                      </h3>
                      <p className={`text-sm leading-relaxed flex-grow mb-5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                        {project.description}
                      </p>

                      {/* Action buttons */}
                      <div className="flex items-center gap-3 pt-4 border-t border-slate-700/30">
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          data-cursor-label="Source"
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-300 hover:scale-105 ${theme === 'dark' ? 'bg-slate-800/60 border-slate-700/50 text-slate-300 hover:text-cyan-300 hover:border-cyan-400/40' : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-violet-600 hover:border-violet-300'}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            trackProjectInteraction(project.title, "github_click");
                          }}
                        >
                          <Github size={14} /> Source
                        </a>
                        <button
                          type="button"
                          data-cursor-label="Case Study"
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-300 hover:scale-105 ${theme === 'dark' ? 'bg-slate-800/60 border-slate-700/50 text-slate-300 hover:text-emerald-300 hover:border-emerald-400/40' : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-emerald-700 hover:border-emerald-300'}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            trackProjectInteraction(project.title, "case_study_view");
                            navigate(`/projects/${project.slug}`);
                          }}
                        >
                          <FileText size={14} /> Case Study
                        </button>
                        {project.live && project.live !== '#' && (
                          <a
                            href={project.live}
                            target="_blank"
                            rel="noopener noreferrer"
                            data-cursor-label="Live"
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-300 border border-emerald-400/30 hover:border-emerald-400/60 transition-all duration-300 hover:scale-105"
                            onClick={(e) => {
                              e.stopPropagation();
                              trackProjectInteraction(project.title, "demo_click");
                            }}
                          >
                            <ExternalLink size={14} /> Live Site
                          </a>
                        )}
                      </div>

                      {/* Live Preview iframe (lazy-loaded) */}
                      {project.demoUrl && (
                        <ProjectPreview url={project.demoUrl} title={project.title} />
                      )}
                    </div>
                  </div>
                </Tilt>
              ))}
            </div>
          </div>
        </section>

        {/* CERTIFICATIONS SECTION */}
        <CertificationsSection
          theme={theme!}
          visibleSections={visibleSections}
          certifications={certifications}
        />

        {/* NOW TRACKER SECTION */}
        <section id="now-tracker" data-reveal className={`reveal-section ${visibleSections.has('now-tracker') ? 'is-visible' : ''} py-24 relative overflow-hidden transition-colors duration-300 ${theme === 'dark' ? 'bg-gradient-to-b from-slate-900/40 via-emerald-900/15 to-slate-900/40' : 'bg-gradient-to-b from-slate-100/40 via-emerald-50/15 to-slate-100/40'}`}>
          <div className="max-w-6xl mx-auto px-4">
            <MissionControl theme={theme!} />
          </div>
        </section>

        {/* SUPPORTER REWARDS SECTION */}
        <section id="supporter-rewards" data-reveal className={`reveal-section ${visibleSections.has('supporter-rewards') ? 'is-visible' : ''} py-24 relative overflow-hidden transition-colors duration-300 ${theme === 'dark' ? 'bg-gradient-to-b from-slate-900/40 via-amber-900/10 to-slate-900/40' : 'bg-gradient-to-b from-slate-100/40 via-amber-50/10 to-slate-100/40'}`}>
          <div className="max-w-6xl mx-auto px-4">
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

        {/* Footer */}
        <footer className={`border-t ${theme === 'dark' ? 'bg-slate-950/95 border-slate-700/40' : 'bg-slate-100 border-slate-200'}`}>
          <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="grid md:grid-cols-3 gap-8 mb-8">
                <div>
                <h3 className={`text-lg font-bold mb-2 ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>Devesh Singh</h3>
                <p className={`text-sm leading-relaxed mb-4 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                  Full-Stack Developer crafting digital experiences with passion and precision.
                </p>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  India
                </div>
              </div>

              {/* Navigation */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">Navigation</h4>
                <nav className="flex flex-col gap-2">
                  {[
                    { label: "Home", onClick: () => scrollToSection("home") },
                    { label: "About", onClick: () => scrollToSection("about") },
                    { label: "Skills", onClick: () => scrollToSection("skills") },
                    { label: "Blog", onClick: () => scrollToSection("blog") },
                    { label: "Projects", onClick: () => scrollToSection("projects") },
                    { label: "Contact", onClick: () => scrollToSection("contact") },
                  ].map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={item.onClick}
                      className={`text-sm text-left transition-colors ${theme === 'dark' ? 'text-slate-400 hover:text-cyan-300' : 'text-slate-600 hover:text-cyan-600'}`}
                    >
                      {item.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Connect */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">Connect</h4>
                <div className="flex flex-col gap-2">
                  <a href="mailto:deveshsingh20666@gmail.com" className={`text-sm transition-colors ${theme === 'dark' ? 'text-slate-400 hover:text-cyan-300' : 'text-slate-600 hover:text-cyan-600'}`}>deveshsingh20666@gmail.com</a>
                  <a href="https://deveshdev.live" target="_blank" rel="noopener noreferrer" className={`text-sm transition-colors ${theme === 'dark' ? 'text-slate-400 hover:text-cyan-300' : 'text-slate-600 hover:text-cyan-600'}`}>deveshdev.live</a>
                  <a href="https://github.com/deveshsingh641" target="_blank" rel="noopener noreferrer" className={`text-sm transition-colors ${theme === 'dark' ? 'text-slate-400 hover:text-cyan-300' : 'text-slate-600 hover:text-cyan-600'}`}>GitHub</a>
                  <a href="https://linkedin.com/in/deveshsingh64" target="_blank" rel="noopener noreferrer" className={`text-sm transition-colors ${theme === 'dark' ? 'text-slate-400 hover:text-cyan-300' : 'text-slate-600 hover:text-cyan-600'}`}>LinkedIn</a>
                  <a href="https://x.com/harshhere_666" target="_blank" rel="noopener noreferrer" className={`text-sm transition-colors ${theme === 'dark' ? 'text-slate-400 hover:text-cyan-300' : 'text-slate-600 hover:text-cyan-600'}`}>X / Twitter</a>
                </div>
              </div>
            </div>

            <div className={`pt-6 border-t flex flex-col md:flex-row items-center justify-between gap-3 ${theme === 'dark' ? 'border-slate-800/60' : 'border-slate-200'}`}>
              <p className="text-xs text-slate-500">© {new Date().getFullYear()} Devesh Singh. Crafted with React & Tailwind.</p>
              <p className="text-xs text-slate-600">Made with ♥ by Devesh Singh</p>
            </div>
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
