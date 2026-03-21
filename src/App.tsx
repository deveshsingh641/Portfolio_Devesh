import { useState, useEffect, useMemo } from "react";
import {
  Mail,
  Github,
  Linkedin,
  ExternalLink,
  Menu,
  X,
  Globe,
  Server,
  FileText,
  Award,
  GraduationCap,
  ChevronRight,
  Calendar,
  Download,
  CheckCircle,
  AlertCircle,
  Sun,
  Moon,
  Twitter,
  Search,
} from "lucide-react";
import { Helmet } from "react-helmet";
import Tilt from "react-parallax-tilt";
// import GitHubCalendar from "react-github-calendar"; // <--- Commented out to fix the crash
import { TypeAnimation } from "react-type-animation";
import NeonBackground from "./components/NeonBackground";
import BlogSection from "./components/BlogSection";
import ProjectPreview from "./components/ProjectPreview";
import CommandPalette from "./components/CommandPalette";
import Playground from "./components/Playground";
import MissionControl from "./components/MissionControl";
import BugReportButton from "./components/BugReportButton";
import SupporterRewards from "./components/SupporterRewards";

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [heroParallax, setHeroParallax] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [greetingIndex, setGreetingIndex] = useState(0);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [cursorVisible, setCursorVisible] = useState(false);
  const [cursorActive, setCursorActive] = useState(false);
  const [cursorLabel, setCursorLabel] = useState("");
  const isMobile = useMemo(() => window.innerWidth < 768, []);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const greetings = useMemo(
    () => ["Hello", "Namaste", "Bonjour", "Hola", "Ciao"],
    []
  );

  // Contact form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [formStatus, setFormStatus] = useState({
    status: "", // "idle", "sending", "success", "error"
    message: "",
  });

  // Dark Mode State
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") ? localStorage.getItem("theme") : "dark"
  );

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme!);
  }, [theme]);

  useEffect(() => {
    if (!isLoading) return;
    const timer = window.setTimeout(() => {
      setIsLoading(false);
    }, 2800);
    return () => window.clearTimeout(timer);
  }, [isLoading]);

  useEffect(() => {
    if (!isLoading) return;
    const interval = window.setInterval(() => {
      setGreetingIndex((prev) => (prev + 1) % greetings.length);
    }, 450);
    return () => window.clearInterval(interval);
  }, [greetings.length, isLoading]);

  // Command Palette keyboard shortcut
  useEffect(() => {
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
      { threshold: 0.12, rootMargin: "0px 0px -20px 0px" }
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

      console.log("📧 Email Config Check:", { 
        publicKey: publicKey ? "✓ Found" : "✗ Missing", 
        serviceId: serviceId ? "✓ Found" : "✗ Missing", 
        templateId: templateId ? "✓ Found" : "✗ Missing", 
        receiveEmail: receiveEmail ? `✓ ${receiveEmail}` : "✗ Missing",
        formspreeEndpoint: formspreeEndpoint ? "✓ Found" : "✗ Missing"
      });

      if (publicKey && serviceId && templateId && receiveEmail) {
        const emailjsModule = await import("emailjs-com");
        const emailjs = emailjsModule.default;
        emailjs.init(publicKey);

        const emailPayload = {
          to_email: receiveEmail,
          name: formData.name,
          email: formData.email,
          title: "Contact Form Inquiry",
          message: formData.message,
        };

        console.log("📤 Sending email with payload:", emailPayload);

        await emailjs.send(serviceId, templateId, emailPayload);
        
        console.log("✅ Email sent successfully via EmailJS");
      } else if (formspreeEndpoint) {
        console.log("📤 Using Formspree as EmailJS is not configured");
        const response = await fetch(formspreeEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            message: formData.message,
            source: "Portfolio Contact Form",
          }),
        });

        if (!response.ok) {
          throw new Error(`Formspree submission failed with status ${response.status}`);
        }
        
        console.log("✅ Email sent successfully via Formspree");
      } else {
        throw new Error(
          "❌ No email service configured. Please set up EmailJS (VITE_EMAILJS_PUBLIC_KEY, VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, VITE_RECEIVE_EMAIL) or Formspree (VITE_FORMSPREE_ENDPOINT) in .env.local"
        );
      }

      setFormStatus({
        status: "success",
        message: "Message sent successfully! I'll get back to you within 24-48 hours.",
      });
      setFormData({ name: "", email: "", message: "" });

      // Clear success message after 5 seconds
      setTimeout(() => {
        setFormStatus({ status: "", message: "" });
      }, 5000);
    } catch (error) {
      console.error("❌ Email sending failed:", error);
      const fullError = error instanceof Error ? error.message : JSON.stringify(error);
      
      setFormStatus({
        status: "error",
        message: `Failed to send message: ${fullError}. Please try contacting me directly at deveshsingh20666@gmail.com.`,
      });

      // Clear error message after 7 seconds
      setTimeout(() => {
        setFormStatus({ status: "", message: "" });
      }, 7000);
    }
  };

  // --- DATA ---
  const techCategories = [
    {
      title: "Languages",
      icon: "code",
      techs: [
        { name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
        { name: "TypeScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
        { name: "C++", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg" },
      ],
    },
    {
      title: "Frontend",
      icon: "globe",
      techs: [
        { name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
        { name: "Tailwind CSS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg" },
        { name: "Vite", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vitejs/vitejs-original.svg" },
        { name: "HTML5", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
        { name: "CSS3", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
      ],
    },
    {
      title: "Backend",
      icon: "server",
      techs: [
        { name: "Node.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
        { name: "Express.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" },
        { name: "MongoDB", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
      ],
    },

    {
      title: "DevOps & Version Control",
      icon: "gitbranch",
      techs: [
        { name: "Git", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
        { name: "GitHub", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" },
        { name: "GitHub Actions", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/githubactions/githubactions-original.svg" },
        { name: "Vercel", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vercel/vercel-original.svg" },
      ],
    },
    {
      title: "Tools",
      icon: "wrench",
      techs: [
        { name: "VS Code", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg" },
        { name: "Postman", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postman/postman-original.svg" },
        { name: "Figma", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg" },
        { name: "ESLint", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/eslint/eslint-original.svg" },
      ],
    },
  ];

  const education = [
    {
      degree: "B.Tech, Information Technology",
      school: "ABES Engineering College",
      year: "2024-Present",
      score: "CGPA: 8.0",
    },
    {
      degree: "Intermediate (CBSE)",
      school: "Sant Atulanand Convent School",
      year: "2022-2023",
      score: "Percentage: 89.02%",
    },
    {
      degree: "High School (CBSE)",
      school: "Sant Atulanand Convent School",
      year: "2020-2021",
      score: "Percentage: 94.6%",
    },
  ];

  const certifications = [
    {
      name: "Data Structures and Algorithms",
      source: "Infosys Springboard",
      year: "2025",
      icon: FileText,
    },
    {
      name: "Problem Solving (Intermediate)",
      source: "HackerRank",
      year: "2024",
      icon: Award,
    },
    {
      name: "Google Arcade Cloud Skills Badges",
      source: "Google Cloud",
      year: "2025",
      badges: ["Cloud Essentials", "Generative AI", "Kubernetes Basics"],
      icon: Award,
    },
  ];

  const projects = [
    {
      title: "Lecture Feedback System",
      description:
        "A comprehensive full-stack platform for collecting and analyzing student feedback on lectures in real-time. Features anonymous feedback submission, instructor dashboard with analytics, and actionable insights to improve teaching quality.",
      tech: ["React", "Node.js", "Express.js", "MongoDB", "Tailwind CSS"],
      github: "https://github.com/deveshsingh641/lecture_feedback_system",
      live: "https://lecture-feedback-system.demo",
      demoUrl: "https://lecture-feedback-system.demo",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      status: "Completed",
      category: "Full Stack",
    },

    {
      title: "Personal Portfolio",
      description:
        "A modern, responsive personal portfolio built with React and Tailwind CSS. Features dark/light theme toggle, animated intro sequence, parallax effects, custom cursor, embedded blog with markdown rendering, live project previews, and glassmorphic design aesthetic.",
      tech: ["React", "TypeScript", "Tailwind CSS", "Vite"],
      github: "https://github.com/deveshsingh641/Portfolio_Devesh",
      live: "https://deveshdev.live",
      demoUrl: "https://deveshdev.live",
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      status: "Live",
      category: "Frontend",
    },
  ];

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
                {greetings[greetingIndex]}
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
                    onClick={() => scrollToSection(item)}
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
                  onClick={() => scrollToSection(item)}
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
          <div className="hidden md:block absolute top-0 w-full h-full overflow-hidden z-0">
            <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob motion-reduce:animate-none"></div>
            <div className="absolute top-0 right-1/4 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000 motion-reduce:animate-none"></div>
            <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000 motion-reduce:animate-none"></div>
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

              {/* FIXED RESUME LINK - Uses %20 for spaces */}
              <a
                href="/Updated_resume%20(1).pdf"
                download="Devesh_Singh_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                data-cursor-label="Resume"
                onMouseMove={handleMagneticMove}
                onMouseLeave={handleMagneticLeave}
                className={`magnetic-btn px-8 py-4 rounded-full font-bold border shadow-md transition-all flex items-center justify-center gap-2 w-full sm:w-auto hover:scale-105 ${theme === 'dark' ? 'bg-slate-950/80 text-cyan-100 border-cyan-300/40 hover:bg-slate-900 hover:border-emerald-300/60' : 'bg-white text-violet-700 border-violet-300/50 hover:bg-violet-50 hover:border-violet-400/60'}`}
              >
                Resume <Download size={18} />
              </a>
            </div>

          </div>
        </section>

        {/* ABOUT SECTION */}
        <section
          id="about"
          data-reveal
          className={`reveal-section ${visibleSections.has('about') ? 'is-visible' : ''} py-28 backdrop-blur-sm relative px-6 md:px-20 transition-colors duration-300 overflow-hidden ${theme === 'dark' ? 'bg-gradient-to-b from-slate-900/40 via-violet-900/20 to-slate-900/40' : 'bg-gradient-to-b from-slate-100/60 via-violet-100/20 to-slate-100/60'}`}
        >
          {/* Background decorations */}
          <div className="absolute top-20 -left-40 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 -right-40 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl"></div>

          <div className="max-w-6xl mx-auto relative z-10">
            {/* Section Label */}
            <p className="text-xs font-mono uppercase tracking-[0.3em] text-emerald-400 mb-6 text-center">ABOUT_ME</p>

            {/* Big Heading */}
            <div className="text-center mb-16">
              <h2 className={`text-4xl md:text-6xl font-black leading-tight ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>
                BUILDING{" "}
                <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent">
                  SCALABLE
                </span>
                <br />
                <span className={theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}>SYSTEMS.</span>
              </h2>
            </div>

            {/* Main content grid */}
            <div className="grid lg:grid-cols-5 gap-12 items-start">

              {/* Left column - Bio + Stats (3 cols) */}
              <div className="lg:col-span-3 space-y-8">
                {/* Bio intro */}
                <div className="space-y-5">
                  <p className={`text-xl md:text-2xl font-light leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                    I'm <span className={`font-semibold ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>Devesh Singh</span>.
                    Full-Stack Developer crafting{" "}
                    <span className={`font-medium ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>robust, production-ready applications</span>.
                  </p>
                  <p className={`text-base leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                    Currently pursuing B.Tech in IT at{" "}
                    <span className={`font-semibold ${theme === 'dark' ? 'text-violet-300' : 'text-violet-600'}`}>ABES Engineering College</span>,
                    I focus on building applications that are not just functional, but intuitive and scalable.
                    My passion lies in full-stack engineering — leveraging modern technologies to turn complex logic into user-friendly reality.
                  </p>
                  <p className={`text-base leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                    When I'm not debugging, I'm refining my DSA skills on LeetCode or exploring
                    new frameworks and modern tech stacks. I'm eager to join a forward-thinking team where I can
                    deploy my technical expertise to solve real-world challenges.
                  </p>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-4 pt-2">
                  {[
                    { value: "5+", label: "PROJECTS" },
                    { value: "4+", label: "CERTIFICATIONS" },
                    { value: "∞", label: "ALWAYS LEARNING" },
                  ].map(({ value, label }) => (
                    <div key={label} className={`group text-center py-5 rounded-xl border backdrop-blur-sm transition-all duration-300 ${theme === 'dark' ? 'border-slate-700/40 bg-slate-900/50 hover:border-emerald-500/40 hover:bg-slate-800/40' : 'border-slate-200 bg-white/80 hover:border-emerald-400/40 hover:bg-slate-50'}`}>
                      <div className="text-3xl md:text-4xl font-black text-emerald-400 group-hover:scale-110 transition-transform duration-300">{value}</div>
                      <div className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mt-1">{label}</div>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className="flex flex-wrap gap-4 pt-2">
                  <button
                    onClick={() => scrollToSection("contact")}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-900 font-bold rounded-lg hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 hover:-translate-y-0.5 text-sm"
                  >
                    Get in Touch
                  </button>
                  <a
                    href="/Updated_resume%20(1).pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`px-6 py-3 border font-semibold rounded-lg transition-all duration-300 hover:-translate-y-0.5 text-sm flex items-center gap-2 ${theme === 'dark' ? 'border-slate-600 text-slate-300 hover:border-emerald-400/50 hover:text-emerald-300' : 'border-slate-300 text-slate-600 hover:border-violet-400/50 hover:text-violet-600'}`}
                  >
                    <Download size={16} /> Resume
                  </a>
                </div>
              </div>

              {/* Right column - Profile Image (2 cols) */}
              <div className="lg:col-span-2 flex flex-col items-center">
                <Tilt
                  tiltMaxAngleX={10}
                  tiltMaxAngleY={10}
                  perspective={1200}
                  transitionSpeed={1000}
                  scale={1.03}
                  tiltEnable={!isMobile}
                  glareEnable={true}
                  glareMaxOpacity={0.15}
                >
                  <div className="relative">
                    {/* Image container */}
                    <div className="w-[260px] md:w-[320px] rounded-2xl overflow-hidden shadow-2xl border border-slate-700/40 bg-gradient-to-br from-violet-600/20 via-emerald-500/20 to-cyan-400/20 p-[2px]">
                      <div className="rounded-2xl overflow-hidden bg-slate-950">
                        <img
                          src="/profile.jpg"
                          alt="Devesh Singh"
                          className="w-full h-auto object-cover"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                    </div>

                    {/* Location badge - top left */}
                    <div className="absolute -top-3 -left-3 bg-slate-900/95 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/50 shadow-lg flex items-center gap-1.5">
                      <span className="text-lg">🇮🇳</span>
                      <span className="text-xs font-semibold text-slate-300">India</span>
                    </div>

                    {/* Available badge - bottom right */}
                    <div className="absolute -bottom-3 -right-3 bg-slate-900/95 backdrop-blur-md px-4 py-2 rounded-lg border border-emerald-500/30 shadow-lg flex items-center gap-2">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                      </span>
                      <span className="text-xs font-bold text-emerald-300">Available</span>
                    </div>
                  </div>
                </Tilt>

                {/* Mini terminal below image */}
                <div className="mt-8 w-full max-w-[320px]">
                  <div className="rounded-lg border border-slate-700/50 bg-[#1e1e2e] overflow-hidden shadow-xl">
                    <div className="flex items-center gap-1.5 px-3 py-2 bg-[#181825] border-b border-slate-700/40">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500/70"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-green-500/70"></span>
                      <span className="text-[10px] font-mono text-slate-500 ml-2">terminal</span>
                    </div>
                    <div className="px-4 py-3 font-mono text-xs space-y-1">
                      <p className="text-slate-500">
                        <span className="text-emerald-400">➜</span>{" "}
                        <span className="text-cyan-400">~</span>{" "}
                        <span className="text-slate-300">cat interests.txt</span>
                      </p>
                      <p className="text-slate-400">🎯 Full-Stack Development</p>
                      <p className="text-slate-400">💻 Web Development</p>
                      <p className="text-slate-400">📱 App Development</p>
                      <p className="text-slate-400">🧠 DSA & Problem Solving</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Education Section */}
            <div className="mt-20">
              <div className="flex items-center gap-3 mb-10">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-emerald-500 flex items-center justify-center shadow-lg">
                  <GraduationCap size={20} className="text-white" />
                </div>
                <div>
                  <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>Education</h3>
                  <p className="text-xs font-mono text-slate-500 uppercase tracking-wider">Academic Journey</p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-5">
                {education.map((edu, index) => (
                  <div
                    key={index}
                    className={`group relative p-6 rounded-xl border backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 ${theme === 'dark' ? 'border-slate-700/40 bg-slate-900/50 hover:border-emerald-500/40 hover:bg-slate-800/40' : 'border-slate-200 bg-white/80 hover:border-emerald-400/40 hover:bg-slate-50'}`}
                  >
                    {/* Number badge */}
                    <span className="absolute top-4 right-4 text-[10px] font-mono text-emerald-500/40 font-bold">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    {/* Year badge */}
                    <div className="inline-flex px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-bold mb-4">
                      <Calendar size={12} className="mr-1.5" />
                      {edu.year}
                    </div>

                    <h4 className={`text-base font-bold mb-1.5 group-hover:text-emerald-400 transition-colors leading-snug ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>
                      {edu.degree}
                    </h4>
                    <p className="text-sm text-slate-400 mb-3">{edu.school}</p>

                    {/* Score */}
                    <div className="flex items-center gap-2 mt-auto">
                      <Award size={14} className="text-emerald-400" />
                      <span className="text-sm font-bold text-emerald-300">
                        {edu.score}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Philosophy / What Drives Me */}
            <div className="mt-20">
              <div className="text-center mb-10">
                <p className="text-xs font-mono uppercase tracking-[0.3em] text-emerald-400 mb-3">PHILOSOPHY</p>
                <h3 className={`text-3xl md:text-4xl font-black ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>
                  CODE THAT{" "}
                  <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">SCALES</span>.
                </h3>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
                {[
                  { num: "01", title: "Clean Architecture", desc: "Readable, maintainable code following SOLID principles. Every module has a single responsibility.", icon: "🏗️" },
                  { num: "02", title: "Performance First", desc: "Optimized queries, efficient algorithms, lazy loading. Built to handle scale.", icon: "⚡" },
                  { num: "03", title: "Data-Driven", desc: "Every decision backed by data. From model metrics to user analytics, numbers guide the way.", icon: "📊" },
                  { num: "04", title: "Ship Fast", desc: "Automated CI/CD pipelines. From commit to production in minutes, not hours.", icon: "🚀" },
                ].map(({ num, title, desc, icon }) => (
                  <div key={num} className={`group relative p-6 rounded-xl border backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 ${theme === 'dark' ? 'border-slate-700/40 bg-slate-900/50 hover:border-emerald-500/40 hover:bg-slate-800/40' : 'border-slate-200 bg-white/80 hover:border-emerald-400/40 hover:bg-slate-50'}`}>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl">{icon}</span>
                      <span className="text-[10px] font-mono text-emerald-500/40 font-bold">{num}</span>
                    </div>
                    <h4 className={`text-sm font-bold mb-2 group-hover:text-emerald-300 transition-colors ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>{title}</h4>
                    <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`}>{desc}</p>
                  </div>
                ))}
              </div>

              {/* Quote */}
              <div className="mt-12 max-w-2xl mx-auto text-center">
                <blockquote className="relative">
                  <span className="absolute -top-4 -left-2 text-5xl text-emerald-500/20 font-serif">"</span>
                  <p className={`text-lg md:text-xl italic leading-relaxed px-8 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                    Code is poetry, debugging is the editing process.
                  </p>
                  <footer className="mt-3 text-sm text-slate-500">— My coding mantra</footer>
                </blockquote>
              </div>
            </div>
          </div>
        </section>

        {/* SKILLS SECTION — "TOOLS I MASTER" vertical list layout */}
        <section id="skills" data-reveal className={`reveal-section ${visibleSections.has('skills') ? 'is-visible' : ''} py-24 relative overflow-hidden transition-colors duration-300 ${theme === 'dark' ? 'bg-gradient-to-b from-slate-900/40 via-emerald-900/20 to-slate-900/40' : 'bg-gradient-to-b from-slate-100/40 via-emerald-50/20 to-slate-100/40'}`}>
          <div className="hidden lg:block absolute right-0 top-1/4 w-96 h-96 bg-blue-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-20 motion-reduce:opacity-0"></div>
          <div className="hidden lg:block absolute left-0 bottom-1/4 w-96 h-96 bg-purple-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-20 motion-reduce:opacity-0"></div>

          <div className="max-w-6xl mx-auto px-4 relative z-10">
            <div className="mb-16">
              <p className="text-xs font-mono uppercase tracking-[0.3em] text-emerald-400 mb-3">TECH_STACK</p>
              <h2 className={`text-4xl md:text-5xl font-bold mb-2 ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>
                TOOLS I <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">MASTER</span>.
              </h2>
              <div className="w-32 h-1.5 bg-gradient-to-r from-violet-600 via-emerald-500 to-cyan-400 rounded-full shadow-lg shadow-violet-400/50 mt-5"></div>
            </div>

            {/* Category Vertical List */}
            <div className="space-y-12">
              {techCategories.map((category, idx) => (
                <div key={idx}>
                  {/* Category Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${theme === 'dark' ? 'bg-emerald-500/15' : 'bg-emerald-100'}`}>
                      {category.icon === 'code' && <span className="text-emerald-400 text-sm font-bold">{`</>`}</span>}
                      {category.icon === 'globe' && <Globe size={16} className="text-emerald-400" />}
                      {category.icon === 'server' && <Server size={16} className="text-emerald-400" />}
                      {category.icon === 'brain' && <span className="text-emerald-400 text-sm">🧠</span>}
                      {category.icon === 'gitbranch' && <span className="text-emerald-400 text-sm">⑂</span>}
                      {category.icon === 'wrench' && <span className="text-emerald-400 text-sm">🔧</span>}
                    </div>
                    <div>
                      <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>
                        {category.title}
                      </h3>
                      <span className="text-xs text-slate-500">
                        {category.techs.length} technologies
                      </span>
                    </div>
                  </div>

                  {/* Tech Items — Horizontal Wrap Grid */}
                  <div className="flex flex-wrap gap-3">
                    {category.techs.map((tech) => (
                      <div
                        key={tech.name}
                        className={`flex flex-col items-center justify-center w-[120px] h-[90px] rounded-xl border transition-all duration-300 cursor-default group/item hover:-translate-y-0.5 ${theme === 'dark' ? 'bg-slate-800/60 border-slate-700/40 hover:border-emerald-500/40 hover:bg-slate-700/50' : 'bg-white border-slate-200 hover:border-emerald-400/40 hover:bg-slate-50 hover:shadow-md'}`}
                      >
                        {tech.icon ? (
                          <img
                            src={tech.icon}
                            alt={tech.name}
                            className="w-8 h-8 mb-2 group-hover/item:scale-110 transition-transform duration-300"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-8 h-8 mb-2 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
                            <Server size={16} className="text-white" />
                          </div>
                        )}
                        <span className={`text-xs font-medium text-center leading-tight ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                          {tech.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-4xl mx-auto">
              {[
                { value: `${techCategories.reduce((s, c) => s + c.techs.length, 0)}+`, label: "TECHNOLOGIES" },
                { value: "5+", label: "PROJECTS BUILT" },
                { value: "4+", label: "CERTIFICATIONS" },
                { value: "∞", label: "ALWAYS LEARNING" },
              ].map(({ value, label }) => (
                <div key={label} className={`text-center py-4 px-3 rounded-xl border backdrop-blur-sm ${theme === 'dark' ? 'border-slate-700/30 bg-slate-900/40' : 'border-slate-200 bg-white/80'}`}>
                  <div className="text-2xl font-bold text-emerald-400 mb-1">{value}</div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

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

            <BlogSection theme={theme!} />
          </div>
        </section>

        {/* PLAYGROUND SECTION */}
        <section id="playground" data-reveal className={`reveal-section ${visibleSections.has('playground') ? 'is-visible' : ''} py-24 relative overflow-hidden transition-colors duration-300 ${theme === 'dark' ? 'bg-gradient-to-b from-slate-900/40 via-cyan-900/15 to-slate-900/40' : 'bg-gradient-to-b from-slate-100/40 via-cyan-50/15 to-slate-100/40'}`}>
          <div className="max-w-6xl mx-auto px-4">
            <Playground theme={theme!} />
          </div>
        </section>

        {/* PROJECTS SECTION */}
        <section id="projects" data-reveal className={`reveal-section ${visibleSections.has('projects') ? 'is-visible' : ''} py-24 ${theme === 'dark' ? 'bg-gradient-to-b from-slate-900/40 via-cyan-900/20 to-slate-900/40' : 'bg-gradient-to-b from-slate-100/40 via-cyan-50/20 to-slate-100/40'}`}>
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <p className="text-xs font-mono uppercase tracking-[0.3em] text-emerald-400 mb-3">SELECTED_WORKS</p>
              <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                DIGITAL{" "}
                <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent">
                  PRODUCTS
                </span>
              </h2>
              <p className={`text-lg max-w-2xl mx-auto ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                A curated selection of applications engineered for performance and scalability.
              </p>
              <div className="w-32 h-1.5 bg-gradient-to-r from-violet-600 via-emerald-500 to-cyan-400 mx-auto rounded-full shadow-lg shadow-violet-400/50 mt-5"></div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-animation">
              {projects.map((project, index) => (
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
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Github size={14} /> Source
                        </a>
                        {project.live && project.live !== '#' && (
                          <a
                            href={project.live}
                            target="_blank"
                            rel="noopener noreferrer"
                            data-cursor-label="Live"
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-300 border border-emerald-400/30 hover:border-emerald-400/60 transition-all duration-300 hover:scale-105"
                            onClick={(e) => e.stopPropagation()}
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
        <section id="certifications" data-reveal className={`reveal-section ${visibleSections.has('certifications') ? 'is-visible' : ''} py-24 relative ${theme === 'dark' ? 'bg-gradient-to-b from-slate-900/50 via-violet-900/20 to-slate-900/50' : 'bg-gradient-to-b from-slate-100/50 via-violet-50/20 to-slate-100/50'}`}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <p className="text-xs font-mono uppercase tracking-[0.3em] text-cyan-400 mb-3">CREDENTIALS</p>
              <h2 className={`text-4xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Certifications & Badges
              </h2>
              <p className={`font-medium text-lg ${theme === 'dark' ? 'text-cyan-300' : 'text-cyan-700'}`}>Professional credentials & achievements</p>
              <div className="w-32 h-1.5 bg-gradient-to-r from-cyan-600 via-emerald-500 to-violet-600 mx-auto rounded-full shadow-lg shadow-cyan-400/50 mt-4"></div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 stagger-animation">
              {certifications.map((cert, index) => {
                const IconComponent = cert.icon;
                return (
                  <Tilt
                    key={index}
                    tiltMaxAngleX={4}
                    tiltMaxAngleY={4}
                    scale={1.02}
                    glareEnable={true}
                    glareMaxOpacity={0.1}
                  >
                    <div className={`p-7 rounded-2xl shadow-lg border group h-full backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 ${theme === 'dark' ? 'bg-slate-950/75 border-cyan-300/35 hover:shadow-cyan-900/20' : 'bg-white border-slate-200 hover:shadow-slate-300/30'}`}>
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 via-emerald-500 to-violet-500 rounded-lg flex items-center justify-center text-white shadow-lg shadow-cyan-400/70 shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                          <IconComponent size={32} />
                        </div>
                        <div className="flex-1">
                          <h3 className={`font-bold text-lg leading-tight mb-2 transition-colors ${theme === 'dark' ? 'text-slate-100 group-hover:text-cyan-300' : 'text-slate-900 group-hover:text-cyan-600'}`}>
                            {cert.name}
                          </h3>
                          <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                            <p className="text-sm font-bold text-emerald-800 dark:text-emerald-100 bg-emerald-100 dark:bg-emerald-900/60 px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-700/50">
                              {cert.source}
                            </p>
                            {cert.year && (
                              <span className="text-xs text-cyan-800 dark:text-cyan-100 font-semibold bg-cyan-100 dark:bg-cyan-900/60 px-3 py-1.5 rounded-full border border-cyan-200 dark:border-cyan-700/50 flex items-center gap-1">
                                <Calendar size={12} /> {cert.year}
                              </span>
                            )}
                          </div>

                          {cert.badges && (
                            <div className="mt-4 flex flex-wrap gap-3">
                              {cert.badges.map((badge, badgeIndex) => (
                                <span
                                  key={badgeIndex}
                                  className="px-3 py-2 bg-gradient-to-r from-violet-600/80 to-cyan-600/80 border-2 border-violet-400/90 text-white text-[12px] uppercase tracking-wider font-bold rounded-lg shadow-md hover:shadow-lg hover:shadow-violet-500/70 transition-all hover:from-violet-600/95 hover:to-cyan-600/95 hover:border-violet-300 hover:scale-105"
                                >
                                  {badge}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Tilt>
                );
              })}
            </div>
          </div>
        </section>

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
        <section
          id="contact"
          data-reveal
          className={`reveal-section ${visibleSections.has('contact') ? 'is-visible' : ''} py-24 relative overflow-hidden transition-colors duration-300 ${theme === 'dark' ? 'bg-gradient-to-b from-slate-900/40 via-violet-900/30 to-slate-900/40' : 'bg-gradient-to-b from-slate-100/40 via-violet-50/30 to-slate-100/40'}`}
        >
          {/* Background decoration */}
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-violet-500/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

          <div className="max-w-6xl mx-auto px-4 relative z-10">
            {/* Section header */}
            <div className="text-center mb-4">
              <span className="inline-block text-xs font-bold uppercase tracking-[0.3em] text-cyan-400 mb-3">Get in Touch</span>
              <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>
                Let's <span className="bg-gradient-to-r from-violet-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">Connect</span>
              </h2>
              <p className={`text-lg max-w-2xl mx-auto leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                Have a project in mind? Want to collaborate? Or just want to say hello? I'd love to hear from you.
              </p>
              <div className="w-32 h-1.5 bg-gradient-to-r from-violet-600 via-emerald-500 to-cyan-400 mx-auto rounded-full shadow-lg shadow-violet-400/50 mt-6" />
            </div>

            <div className="grid lg:grid-cols-5 gap-8 mt-14">
              {/* LEFT — Contact Information */}
              <div className="lg:col-span-2 space-y-6">
                <div className={`rounded-2xl p-8 border shadow-xl ${theme === 'dark' ? 'bg-gradient-to-br from-slate-900/90 via-violet-900/25 to-slate-900/90 border-violet-400/20' : 'bg-white border-slate-200'}`}>
                  <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>Contact Information</h3>
                  <p className={`text-sm mb-8 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Feel free to reach out through any of these channels. I typically respond within 24 hours.</p>

                  {/* Email */}
                  <div className="space-y-5">
                    <a
                      href="mailto:deveshsingh20666@gmail.com"
                      className="flex items-start gap-4 group"
                      data-cursor-label="Mail"
                    >
                      <div className="w-10 h-10 rounded-lg bg-violet-500/15 border border-violet-400/25 flex items-center justify-center shrink-0 group-hover:bg-violet-500/25 group-hover:border-violet-400/40 transition-all">
                        <Mail size={18} className="text-violet-300" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-0.5">Email</p>
                        <p className={`text-sm transition-colors ${theme === 'dark' ? 'text-slate-200 group-hover:text-cyan-300' : 'text-slate-700 group-hover:text-cyan-600'}`}>deveshsingh20666@gmail.com</p>
                      </div>
                    </a>

                    {/* Location */}
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/15 border border-emerald-400/25 flex items-center justify-center shrink-0">
                        <Globe size={18} className="text-emerald-300" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-0.5">Location</p>
                        <p className={`text-sm ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>India</p>
                      </div>
                    </div>

                    {/* LinkedIn */}
                    <a
                      href="https://linkedin.com/in/devesh-singh-0b234928b"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-4 group"
                      data-cursor-label="LinkedIn"
                    >
                      <div className="w-10 h-10 rounded-lg bg-cyan-500/15 border border-cyan-400/25 flex items-center justify-center shrink-0 group-hover:bg-cyan-500/25 group-hover:border-cyan-400/40 transition-all">
                        <Linkedin size={18} className="text-cyan-300" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-0.5">LinkedIn</p>
                        <p className={`text-sm transition-colors ${theme === 'dark' ? 'text-slate-200 group-hover:text-cyan-300' : 'text-slate-700 group-hover:text-cyan-600'}`}>Devesh Singh</p>
                      </div>
                    </a>
                  </div>

                  {/* Social links row */}
                  <div className={`mt-8 pt-6 border-t ${theme === 'dark' ? 'border-slate-700/50' : 'border-slate-200'}`}>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">Follow Me</h4>
                    <div className="flex items-center gap-3">
                      {[
                        { href: "https://deveshdev.live", icon: Globe, label: "Website" },
                        { href: "https://github.com/deveshsingh641", icon: Github, label: "GitHub" },
                        { href: "https://linkedin.com/in/devesh-singh-0b234928b", icon: Linkedin, label: "LinkedIn" },
                        { href: "https://x.com/harshhere_666", icon: Twitter, label: "X / Twitter" },
                      ].map(({ href, icon: Icon, label }) => (
                        <a
                          key={label}
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          data-cursor-label={label}
                          className={`w-10 h-10 rounded-lg border flex items-center justify-center transition-all duration-300 ${theme === 'dark' ? 'border-slate-700/60 bg-slate-800/40 text-slate-400 hover:text-cyan-300 hover:border-cyan-400/40 hover:bg-cyan-500/10' : 'border-slate-200 bg-slate-50 text-slate-500 hover:text-cyan-600 hover:border-cyan-400/40 hover:bg-cyan-50'}`}
                          title={label}
                          aria-label={label}
                        >
                          <Icon size={17} />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Availability badge */}
                <div className={`rounded-2xl p-6 border shadow-lg ${theme === 'dark' ? 'bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border-emerald-400/20' : 'bg-emerald-50 border-emerald-200'}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </span>
                    <span className={`text-sm font-bold ${theme === 'dark' ? 'text-emerald-300' : 'text-emerald-700'}`}>Available for work</span>
                  </div>
                  <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                    I'm currently open to new opportunities and exciting projects. Let's create something amazing together!
                  </p>
                </div>
              </div>

              {/* RIGHT — Send a Message form */}
              <div className="lg:col-span-3">
                <Tilt
                  tiltMaxAngleX={isMobile ? 0 : 2}
                  tiltMaxAngleY={isMobile ? 0 : 2}
                  tiltEnable={!isMobile}
                  glareEnable={!isMobile}
                  glareMaxOpacity={0.05}
                >
                  <div className={`rounded-2xl p-8 md:p-10 border shadow-xl ${theme === 'dark' ? 'bg-gradient-to-br from-slate-900/90 via-violet-900/25 to-slate-900/90 border-violet-400/20' : 'bg-white border-slate-200'}`}>
                    <h3 className={`text-xl font-bold mb-1 ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>Send a Message</h3>
                    <p className={`text-sm mb-8 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>I'll get back to you within 24–48 hours.</p>

                    {/* Status Messages */}
                    {formStatus.status && (
                      <div
                        className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${formStatus.status === "success"
                          ? "bg-emerald-500/15 border border-emerald-400/40 text-emerald-300"
                          : formStatus.status === "error"
                            ? "bg-red-500/15 border border-red-400/40 text-red-300"
                            : "bg-blue-500/15 border border-blue-400/40 text-blue-300"
                          }`}
                        role={formStatus.status === "error" ? "alert" : "status"}
                        aria-live="polite"
                      >
                        {formStatus.status === "success" && <CheckCircle size={18} className="flex-shrink-0" />}
                        {formStatus.status === "error" && <AlertCircle size={18} className="flex-shrink-0" />}
                        <span className="text-sm font-medium">{formStatus.message}</span>
                      </div>
                    )}

                    <form onSubmit={handleFormSubmit} className="space-y-5">
                      <div className="grid md:grid-cols-2 gap-5">
                        <div>
                          <label htmlFor="contact-name" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Your Name</label>
                          <input
                            id="contact-name"
                            type="text"
                            name="name"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={handleFormChange}
                            required
                            disabled={formStatus.status === "sending"}
                            className="w-full px-4 py-3 bg-slate-800/60 border border-slate-700/60 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400/40 outline-none transition-all hover:border-slate-600/80 disabled:opacity-50"
                          />
                        </div>
                        <div>
                          <label htmlFor="contact-email" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Your Email</label>
                          <input
                            id="contact-email"
                            type="email"
                            name="email"
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={handleFormChange}
                            required
                            disabled={formStatus.status === "sending"}
                            className="w-full px-4 py-3 bg-slate-800/60 border border-slate-700/60 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400/40 outline-none transition-all hover:border-slate-600/80 disabled:opacity-50"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="contact-subject" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Subject</label>
                        <input
                          id="contact-subject"
                          type="text"
                          name="subject"
                          placeholder="Project Collaboration"
                          onChange={handleFormChange}
                          disabled={formStatus.status === "sending"}
                          className="w-full px-4 py-3 bg-slate-800/60 border border-slate-700/60 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400/40 outline-none transition-all hover:border-slate-600/80 disabled:opacity-50"
                        />
                      </div>

                      <div>
                        <label htmlFor="contact-message" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Message</label>
                        <textarea
                          id="contact-message"
                          name="message"
                          rows={5}
                          placeholder="Tell me about your project..."
                          value={formData.message}
                          onChange={handleFormChange}
                          required
                          disabled={formStatus.status === "sending"}
                          className="w-full px-4 py-3 bg-slate-800/60 border border-slate-700/60 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400/40 outline-none transition-all resize-none hover:border-slate-600/80 disabled:opacity-50"
                        ></textarea>
                      </div>

                      <button
                        type="submit"
                        disabled={formStatus.status === "sending"}
                        className="w-full bg-gradient-to-r from-violet-600 via-emerald-500 to-cyan-400 text-white font-bold py-3.5 rounded-xl hover:shadow-2xl hover:shadow-violet-500/30 hover:scale-[1.02] transition-all transform active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {formStatus.status === "sending" ? (
                          <>
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Mail size={16} />
                            Send Message
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                </Tilt>
              </div>
            </div>
          </div>
        </section>

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
                  {["Home", "About", "Skills", "Blog", "Projects", "Contact"].map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => scrollToSection(item.toLowerCase())}
                      className={`text-sm text-left transition-colors ${theme === 'dark' ? 'text-slate-400 hover:text-cyan-300' : 'text-slate-600 hover:text-cyan-600'}`}
                    >
                      {item}
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
                  <a href="https://linkedin.com/in/devesh-singh-0b234928b" target="_blank" rel="noopener noreferrer" className={`text-sm transition-colors ${theme === 'dark' ? 'text-slate-400 hover:text-cyan-300' : 'text-slate-600 hover:text-cyan-600'}`}>LinkedIn</a>
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

      {/* BUG REPORT BUTTON */}
      <BugReportButton theme={theme!} />

      {/* COMMAND PALETTE */}
      <CommandPalette
        theme={theme!}
        setTheme={setTheme}
        scrollToSection={scrollToSection}
        isOpen={commandPaletteOpen}
        onOpenChange={setCommandPaletteOpen}
      />
    </div>
  );
}

export default App;
