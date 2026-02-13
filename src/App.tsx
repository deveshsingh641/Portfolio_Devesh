import { useState, useEffect, useMemo } from "react";
import {
  Mail,
  Github,
  Linkedin,
  ExternalLink,
  Menu,
  X,
  Code,
  Globe,
  Server,
  Layers,
  Brain,
  FileText,
  Award,
  GraduationCap,
  Sparkles,
  ChevronRight,
  Calendar,
  Download,
  CheckCircle,
  AlertCircle,
  Sun,
  Moon,
  BookOpen,
  Clock3,
  ArrowRight,
} from "lucide-react";
import { Helmet } from "react-helmet";
import Tilt from "react-parallax-tilt";
// import GitHubCalendar from "react-github-calendar"; // <--- Commented out to fix the crash
import { TypeAnimation } from "react-type-animation";
import NeonBackground from "./components/NeonBackground";

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [heroParallax, setHeroParallax] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(() => {
    try {
      return sessionStorage.getItem("portfolio_intro_seen") !== "true";
    } catch {
      return true;
    }
  });
  const [greetingIndex, setGreetingIndex] = useState(0);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [cursorVisible, setCursorVisible] = useState(false);
  const [cursorActive, setCursorActive] = useState(false);
  const [cursorLabel, setCursorLabel] = useState("");
  const [selectedBlog, setSelectedBlog] = useState<null | {
    title: string;
    platform: string;
    description: string;
    date: string;
    readTime: string;
    tags: string[];
    content: string[];
  }>(null);
  const isMobile = useMemo(() => window.innerWidth < 768, []);
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
      try {
        sessionStorage.setItem("portfolio_intro_seen", "true");
      } catch {
        // no-op
      }
    }, 1700);
    return () => window.clearTimeout(timer);
  }, [isLoading]);

  useEffect(() => {
    if (!isLoading) return;
    const interval = window.setInterval(() => {
      setGreetingIndex((prev) => (prev + 1) % greetings.length);
    }, 380);
    return () => window.clearInterval(interval);
  }, [greetings.length, isLoading]);

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
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -40px 0px" }
    );

    revealItems.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!selectedBlog) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [selectedBlog]);

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
            "projects",
            "certifications",
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
      const formspreeEndpoint = import.meta.env.VITE_FORMSPREE_ENDPOINT as
        | string
        | undefined;

      if (publicKey && serviceId && templateId) {
        const emailjsModule = await import("emailjs-com");
        const emailjs = emailjsModule.default;
        emailjs.init(publicKey);

        await emailjs.send(serviceId, templateId, {
          to_email: import.meta.env.VITE_RECEIVE_EMAIL,
          name: formData.name,
          email: formData.email,
          message: formData.message,
          title: "New Portfolio Inquiry",
        });
      } else if (formspreeEndpoint) {
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
          throw new Error("Formspree submission failed");
        }
      } else {
        throw new Error(
          "No form provider configured. Add EmailJS keys or VITE_FORMSPREE_ENDPOINT in .env.local"
        );
      }

      setFormStatus({
        status: "success",
        message: "Message sent successfully! I'll get back to you soon.",
      });
      setFormData({ name: "", email: "", message: "" });

      // Clear success message after 5 seconds
      setTimeout(() => {
        setFormStatus({ status: "", message: "" });
      }, 5000);
    } catch (error) {
      console.error("Email sending failed:", error);
      setFormStatus({
        status: "error",
        message:
          "Failed to send message. Please try again or contact me directly at deveshsingh20666@gmail.com.",
      });

      // Clear error message after 7 seconds
      setTimeout(() => {
        setFormStatus({ status: "", message: "" });
      }, 7000);
    }
  };

  // --- DATA ---
  const programmingSkills = [
    { name: "C++", icon: Code, level: 85 },
    { name: "Python", icon: Code, level: 88 },
    { name: "Java", icon: Code, level: 80 },
    { name: "JavaScript", icon: Code, level: 86 },
  ];

  const webDevSkills = [
    { name: "HTML", icon: Globe, level: 90 },
    { name: "CSS", icon: Globe, level: 86 },
    { name: "Node.js", icon: Server, level: 82 },
    { name: "Express.js", icon: Server, level: 80 },
  ];

  const blogPosts = [
    {
      title: "Engineering a Real-Time Lecture Feedback System: From Form Events to Actionable Analytics",
      platform: "Technical Deep Dive",
      description:
        "This post walks through the full architecture of my Lecture Feedback System — React frontend, Express APIs, MongoDB schema strategy, validation and rate-limiting, and how I transformed raw student responses into meaningful instructor insights with sentiment and trend views.",
      date: "Feb 2026",
      readTime: "9 min read",
      tags: ["React", "Express", "MongoDB", "System Design"],
      content: [
        "I designed the Lecture Feedback System with a strict separation between presentation, API, and analytics logic so each layer could evolve independently. On the frontend, React handles dynamic form states, section-based feedback input, and instructor dashboards with lightweight charting and trend summaries.",
        "The backend uses Express with modular route/controller/service architecture. Validation was implemented at both request and schema layers to avoid malformed payloads. I also added basic rate-limiting and anti-spam checks to keep submissions clean and preserve trust in analytics.",
        "MongoDB was modeled around lecture sessions, feedback documents, and derived aggregates. Instead of only storing raw responses, I introduced computed metrics (sentiment bucket, rating distributions, top concern tags) to support faster dashboard rendering and reduce repeated heavy queries.",
        "The most important engineering decision was to optimize for actionable output, not just data collection. Instructors get trend direction, weak-topic flags, and comparative snapshots between sessions—helping convert noisy student comments into improvements they can implement immediately.",
      ],
    },
    {
      title: "Building an Online Fraud Detection Pipeline with Scikit-learn: Feature Engineering to Threshold Tuning",
      platform: "ML Case Study",
      description:
        "A practical case study on my fraud detection project covering imbalanced-data handling, feature engineering, model selection, precision-recall trade-offs, and why threshold optimization mattered more than raw accuracy for production-like fraud screening.",
      date: "Feb 2026",
      readTime: "10 min read",
      tags: ["Python", "Scikit-learn", "Fraud Detection", "Model Evaluation"],
      content: [
        "Fraud detection problems are extremely imbalanced, so I structured the pipeline to prioritize recall and precision behavior rather than headline accuracy. Data preparation included null handling, outlier checks, and feature normalization where model assumptions needed it.",
        "I experimented with multiple classifiers and compared them with precision-recall curves, confusion matrix behavior, and false-positive costs. Feature engineering focused on transaction patterns and user-behavior deltas that helped separate suspicious activity from legitimate high-volume users.",
        "A key learning was threshold optimization. The default 0.5 probability cutoff was not business-optimal, so I tuned decision thresholds based on acceptable false-positive rates while maximizing fraud catch rate. This produced a significantly more practical model than accuracy-first tuning.",
        "The final workflow includes reproducible preprocessing, model serialization, and evaluation reporting that can be reused as a baseline for future fraud datasets. It is structured as a deployment-ready foundation rather than a one-off notebook experiment.",
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
      name: "Python for Data Science",
      source: "NPTEL",
      year: "2025",
      icon: FileText,
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
        "A comprehensive full-stack platform for collecting and analyzing student feedback on lectures in real-time. Features include anonymous feedback submission, instructor dashboard with analytics, sentiment analysis, and actionable insights to improve teaching quality.",
      tech: ["JavaScript", "Node.js", "Express.js", "MongoDB", "React"],
      github: "https://github.com/deveshsingh641/lecture_feedback_system",
      live: "https://lecture-feedback-system.demo",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Online Fraud Detection (ML)",
      description:
        "Machine learning model detecting fraudulent transactions with 95% accuracy using Scikit-learn and Pandas.",
      tech: ["Python", "Scikit-learn", "Pandas"],
      github: "https://github.com/deveshsingh641/Data-Science-Project-",
      live: "#",
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
  ];

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${theme === 'dark' ? 'bg-[#050816] text-slate-100 selection:bg-cyan-500 selection:text-slate-950' : 'bg-[#0a0f24] text-slate-100 selection:bg-cyan-500 selection:text-slate-950'}`}>
      <div
        className={`custom-cursor hidden md:flex ${cursorVisible ? "opacity-100" : "opacity-0"} ${cursorActive ? "is-active" : ""}`}
        style={{ transform: `translate3d(${cursorPos.x}px, ${cursorPos.y}px, 0)` }}
      >
        <div className="custom-cursor-ring" />
        <div className="custom-cursor-core" />
        {cursorLabel && <span className="custom-cursor-label">{cursorLabel}</span>}
      </div>

      {isLoading && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#040611]">
          <div className="relative flex flex-col items-center gap-5">
            <div className="loader-ring" />
            <div className="loader-core" />
            <p className="welcome-intro text-3xl md:text-4xl font-bold text-white">
              {greetings[greetingIndex]}
            </p>
            <p className="loader-text text-xs tracking-[0.35em] uppercase text-cyan-300/90">
              Initializing Portfolio
            </p>
          </div>
        </div>
      )}
      <NeonBackground />
      <Helmet>
        <html lang="en" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <meta
          name="description"
          content="Devesh Singh - Full-Stack Developer and ML enthusiast building high-performance web applications with modern React, Node.js, and intelligent systems."
        />
        <meta
          name="keywords"
          content="Devesh Singh, full stack developer, React developer, Node.js, machine learning, portfolio"
        />
        <meta name="author" content="Devesh Singh" />
        <meta name="robots" content="index, follow" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Devesh Singh | Portfolio" />
        <meta
          property="og:description"
          content="Portfolio of Devesh Singh — Full-Stack Developer and ML enthusiast focused on fast, accessible, and user-centered products."
        />
        <meta property="og:image" content="/profile.jpg" />
        <meta property="og:url" content={currentPageUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Devesh Singh | Portfolio" />
        <meta
          name="twitter:description"
          content="Explore projects, skills, and certifications of Devesh Singh — Full-Stack Developer and ML enthusiast."
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
        className="fixed top-0 left-0 h-0.5 bg-gradient-to-r from-violet-600 via-emerald-500 via-cyan-400 to-violet-600 z-[100] transition-all duration-100 ease-out"
        style={{ width: `${scrollProgress}%` }}
      ></div>

      {/* NAVBAR */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled
          ? "bg-slate-950/90 backdrop-blur-md shadow-lg py-2 border-b border-cyan-300/30"
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
                onClick={toggleTheme}
                data-cursor-label="Theme"
                className={`p-2 rounded-full transition-colors border ${scrolled ? 'border-cyan-400/30 text-slate-100 hover:bg-cyan-500/10' : 'border-white/20 text-white hover:bg-white/10'}`}
                aria-label="Toggle Dark Mode"
              >
                {theme === "dark" ? (
                  <Sun size={20} className={scrolled ? "text-yellow-500" : "text-yellow-300"} />
                ) : (
                  <Moon size={20} className={scrolled ? "text-violet-700" : "text-white"} />
                )}
              </button>

              <div className={`hidden md:flex space-x-1 p-1 rounded-full border transition-all duration-300 ${scrolled ? 'bg-slate-900/60 border-cyan-400/20' : 'bg-black/20 border-white/10 backdrop-blur-md'}`}>
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
                      ? "bg-gradient-to-r from-violet-500/25 to-cyan-500/25 text-cyan-200 shadow-md font-bold scale-105 border border-cyan-400/30"
                      : scrolled
                        ? "text-slate-200 hover:text-cyan-200"
                        : "text-gray-200 hover:text-white"
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
                className={`md:hidden p-2 transition-colors ${scrolled ? 'text-slate-200' : 'text-white'}`}
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
            className="md:hidden bg-slate-950/95 backdrop-blur-xl border-t border-cyan-400/20 shadow-xl absolute w-full animate-fade-in-down"
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
                  className="block w-full text-left px-4 py-3 capitalize text-slate-200 hover:bg-violet-500/20 rounded-lg transition-colors font-medium"
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-950/80 border border-cyan-300/50 text-cyan-100 text-xs font-bold tracking-wide uppercase mb-8 animate-fade-in-up shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-violet-600 animate-pulse"></span>
              Open to Work
            </div>

            <h1
              className="text-5xl md:text-7xl font-extrabold text-slate-100 tracking-tight mb-6 leading-tight animate-slideInUp parallax-layer"
              style={{
                transform: `translate3d(${heroParallax.x * 18}px, ${heroParallax.y * 18}px, 0)`,
              }}
            >
              Crafting{" "}
              <span className="bg-gradient-to-r from-violet-400 via-emerald-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent drop-shadow-sm animate-gradient">
                Digital Reality
              </span>{" "}
              with Code.
            </h1>

            {/* TYPEWRITER EFFECT */}
            <div
              className="text-xl md:text-2xl text-slate-100 font-medium mb-10 max-w-3xl mx-auto text-center leading-relaxed h-20 md:h-auto parallax-layer"
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
                    "Machine Learning Enthusiast",
                    2000,
                    "Problem Solver",
                    2000,
                    "App developer",
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
                className="magnetic-btn px-8 py-4 bg-slate-950/80 rounded-full text-cyan-100 font-bold border border-cyan-300/40 shadow-md hover:bg-slate-900 hover:border-emerald-300/60 hover:shadow-lg transition-all flex items-center justify-center gap-2 w-full sm:w-auto hover:scale-105"
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
          className="reveal-section py-24 bg-gradient-to-b from-slate-900/40 via-violet-900/20 to-slate-900/40 backdrop-blur-sm relative px-6 md:px-20 transition-colors duration-300"
        >
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row gap-16 items-center">
              <div className="w-full md:w-1/2">
                <h2 className="text-4xl font-bold text-slate-100 mb-6 flex items-center gap-3">
                  About Me{" "}
                  <Sparkles
                    className="text-transparent bg-gradient-to-r from-violet-500 to-emerald-500 bg-clip-text animate-pulse"
                    size={28}
                  />
                </h2>



                <div className="space-y-6 text-lg text-slate-100 leading-relaxed mb-10">
                  <p>
                    I am a developer who{" "}
                    <span className="text-cyan-300 font-bold">
                      thinks in data
                    </span>
                    . Currently pursuing my B.Tech in IT at{" "}
                    <span className="bg-gradient-to-r from-violet-700 to-emerald-700 bg-clip-text text-transparent font-bold">
                      ABES Engineering College
                    </span>
                    , I focus on building applications that are not just
                    functional, but intelligent.
                  </p>
                  <p>
                    My passion lies at the intersection of{" "}
                    <span className="bg-gradient-to-r from-emerald-600 to-cyan-500 bg-clip-text text-transparent font-semibold">
                      Full-Stack Engineering
                    </span>{" "}
                    and{" "}
                    <span className="bg-gradient-to-r from-emerald-700 to-cyan-600 bg-clip-text text-transparent font-bold">
                      Machine Learning
                    </span>
                    . Whether it's architecting a seamless e-commerce frontend
                    or training a fraud detection model, I love turning complex
                    logic into user-friendly reality.
                  </p>
                  <p>
                    When I'm not debugging, I'm refining my{" "}
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                      DSA skills
                    </span>{" "}
                    (solving problems on LeetCode) or exploring Cloud
                    architectures. I am eager to join a forward-thinking team
                    where I can deploy my analytical skills to solve real-world
                    challenges.
                  </p>
                </div>



                <h3 className="text-xl font-bold text-slate-100 mb-6 flex items-center gap-2">
                  <GraduationCap className="text-transparent bg-gradient-to-r from-violet-600 to-emerald-500 bg-clip-text" size={24} />{" "}
                  <span className="bg-gradient-to-r from-violet-700 to-emerald-600 bg-clip-text text-transparent">Education Journey</span>
                </h3>

                <div className="space-y-4 relative pl-4 border-l-2 border-gradient-to-b from-violet-400/50 to-emerald-400/50">
                  {education.map((edu, index) => (
                    <Tilt
                      key={index}
                      tiltEnable={false}
                      scale={1.03}
                      transitionSpeed={200}
                    >

                      <div className="relative group p-6 bg-slate-950/75 rounded-xl border border-violet-300/35 shadow-md hover:shadow-xl hover:shadow-violet-900/20 hover:border-emerald-400/60 transition-all cursor-default mb-4 hover:-translate-y-1">
                        <div className="absolute top-7 -left-[25px] w-5 h-5 bg-gradient-to-br from-violet-500 via-emerald-500 to-cyan-400 border-4 border-white dark:border-slate-950 rounded-full shadow-lg shadow-violet-400/50 group-hover:scale-125 transition-transform"></div>
                        <div className="flex justify-between items-start flex-wrap gap-2">
                          <div>
                            <h4 className="font-bold text-slate-100 text-lg group-hover:text-emerald-300 transition-colors">
                              {edu.degree}
                            </h4>
                            <p className="text-slate-200 font-medium">
                              {edu.school}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="inline-block px-3 py-1 bg-violet-100 dark:bg-violet-900/40 text-violet-800 dark:text-violet-200 text-xs font-bold rounded-full border border-violet-200 dark:border-violet-700/50 group-hover:border-emerald-500/50 transition-all shadow-sm">
                              {edu.year}
                            </span>
                          </div>
                        </div>
                        <div className="mt-4 flex items-center gap-2">
                          <Award size={16} className="text-emerald-400" />
                          <span className="text-sm font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-600/20 px-3 py-1 rounded-md border border-emerald-200 dark:border-emerald-400/30">
                            {edu.score}
                          </span>
                        </div>
                      </div>
                    </Tilt>
                  ))}
                </div>
              </div>

              {/* Profile Image */}
              <div className="w-full md:w-1/2 flex justify-center md:justify-end mt-10 md:mt-0">
                <Tilt
                  tiltMaxAngleX={12}
                  tiltMaxAngleY={12}
                  perspective={1200}
                  transitionSpeed={1000}
                  scale={1.05}
                  tiltEnable={!isMobile}
                  glareEnable={true}
                  glareMaxOpacity={0.2}
                >
                  <div className="w-[220px] md:w-[380px] rounded-3xl overflow-hidden shadow-2xl border-2 border-white bg-gradient-to-br from-violet-600 via-emerald-500 to-cyan-400 p-1 hover:shadow-3xl hover:shadow-violet-400/50 transition-all duration-300">
                    <div className="rounded-3xl overflow-hidden bg-slate-950">
                      <img
                        src="/profile.jpg"
                        alt="Profile"
                        className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-300"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-center md:justify-end">
                    <div className="bg-slate-900/95 backdrop-blur-md px-5 py-3 rounded-full shadow-lg border border-cyan-400/20 flex items-center gap-2 animate-float w-fit hover:shadow-xl transition-all">
                      <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
                      <span className="text-xs font-bold text-slate-100">
                        Open to Work
                      </span>
                    </div>
                  </div>
                </Tilt>
              </div>
            </div>
          </div>
        </section>

        {/* SKILLS SECTION */}
        <section id="skills" data-reveal className="reveal-section py-24 bg-gradient-to-b from-slate-900/40 via-emerald-900/20 to-slate-900/40 relative overflow-hidden transition-colors duration-300">
          <div className="hidden lg:block absolute right-0 top-1/4 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 motion-reduce:opacity-0"></div>
          <div className="hidden lg:block absolute left-0 bottom-1/4 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 motion-reduce:opacity-0"></div>

          <div className="max-w-6xl mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-100 mb-4">
                Technical Arsenal
              </h2>
              <p className="text-emerald-300 font-medium text-lg mb-4">Weapons in my developer toolkit</p>
              <div className="w-32 h-1.5 bg-gradient-to-r from-violet-600 via-emerald-500 to-cyan-400 mx-auto rounded-full shadow-lg shadow-violet-400/50"></div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 will-change-auto stagger-animation">
              {[
                {
                  title: "Languages",
                  icon: Code,
                  skills: programmingSkills,
                  color: "text-violet-300",
                  bg: "bg-violet-50",
                  gradient: "from-violet-500 to-purple-600",
                  borderColor: "border-violet-400/70",
                  accentColor: "text-violet-400",
                },
                {
                  title: "Web Development",
                  icon: Globe,
                  skills: webDevSkills,
                  color: "text-emerald-300",
                  bg: "bg-emerald-50",
                  gradient: "from-emerald-500 to-teal-600",
                  borderColor: "border-emerald-400/70",
                  accentColor: "text-emerald-400",
                },
                {
                  title: "Core Concepts",
                  icon: Brain,
                  skills: [
                    { name: "DSA", icon: Brain, level: 84 },
                    { name: "OOP", icon: Brain, level: 86 },
                  ],
                  color: "text-cyan-300",
                  bg: "bg-cyan-50",
                  gradient: "from-cyan-500 to-blue-600",
                  borderColor: "border-cyan-400/70",
                  accentColor: "text-cyan-400",
                },
                {
                  title: "Tools",
                  icon: Layers,
                  skills: [
                    { name: "Git", icon: Layers, level: 83 },
                    { name: "Figma", icon: Layers, level: 72 },
                  ],
                  color: "text-pink-300",
                  bg: "bg-pink-50",
                  gradient: "from-pink-500 via-rose-500 to-orange-500",
                  borderColor: "border-pink-400/70",
                  accentColor: "text-orange-400",
                },
              ].map((category, idx) => (
                <Tilt
                  key={idx}
                  tiltMaxAngleX={8}
                  tiltMaxAngleY={8}
                  glareEnable={true}
                  glareMaxOpacity={0.15}
                  scale={1.03}
                  className="h-full"
                >

                  <div className="p-8 rounded-2xl h-full border border-violet-300/35 shadow-lg hover:shadow-xl hover:shadow-violet-900/20 backdrop-blur-sm transition-all duration-300 group hover:-translate-y-2 bg-slate-950/75">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${category.gradient} p-3 mb-5 group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                      <category.icon size={28} className="text-white" />
                    </div>
                    <h3 className={`text-2xl font-bold mb-6 ${category.color} group-hover:text-slate-100`}>
                      {category.title}
                    </h3>
                    <div className="space-y-3">
                      {category.skills.map((skill, index) => (
                        <div
                          key={index}
                          className="rounded-xl border border-white/10 bg-slate-800/60 p-3"
                          role="progressbar"
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-valuenow={skill.level}
                          aria-label={`${skill.name} proficiency`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className={`text-sm font-bold text-slate-100`}>
                              {skill.name}
                            </span>
                            <span className="text-xs text-slate-400 font-semibold">
                              {skill.level}%
                            </span>
                          </div>
                          <div className="h-2.5 bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full bg-gradient-to-r ${category.gradient} transition-all duration-700`}
                              style={{ width: `${skill.level}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Tilt>
              ))}
            </div>
          </div>
        </section >

        {/* BLOG SECTION */}
        <section id="blog" data-reveal className="reveal-section py-24 bg-gradient-to-b from-slate-900/40 via-violet-900/10 to-slate-900/40 transition-colors duration-300">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-100 mb-4">Technical Writing</h2>
              <p className="text-slate-200">
                Architecture notes, engineering trade-offs, and implementation details from real projects.
              </p>
              <div className="w-32 h-1.5 bg-gradient-to-r from-violet-600 via-emerald-500 to-cyan-400 mx-auto rounded-full shadow-lg shadow-violet-400/50 mt-4"></div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 stagger-animation">
              {blogPosts.map((post, index) => (
                <article
                  key={index}
                  className="group p-7 rounded-2xl shadow-xl border border-cyan-300/20 bg-gradient-to-b from-slate-900/90 to-slate-950/95 hover:shadow-2xl hover:shadow-cyan-900/20 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between gap-3 mb-5">
                    <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-400/30">
                      <BookOpen size={12} /> {post.platform}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-slate-300">
                      <Clock3 size={13} /> {post.date} • {post.readTime}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-100 mb-3 leading-snug group-hover:text-cyan-200 transition-colors">{post.title}</h3>
                  <p className="text-slate-300 mb-5 leading-relaxed">{post.description}</p>


                  <div className="flex flex-wrap gap-2 mb-6">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 text-xs font-semibold rounded-md bg-violet-500/10 text-violet-200 border border-violet-400/30"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedBlog(post)}
                    className="inline-flex items-center gap-2 text-cyan-300 hover:text-cyan-200 font-semibold"
                    aria-label={`Read article: ${post.title}`}
                  >
                    <FileText size={16} /> Read Article <ArrowRight size={15} />
                  </button>
                </article>
              ))}
            </div>
          </div>
        </section >

        {/* CERTIFICATIONS SECTION */}
        < section id="certifications" data-reveal className="reveal-section py-24 bg-gradient-to-b from-slate-900/50 via-violet-900/20 to-slate-900/50 relative" >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-3">
                Certifications & Badges
              </h2>
              <p className="text-cyan-300 font-medium text-lg">Professional credentials & achievements</p>
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
                    <div className="p-7 rounded-2xl shadow-lg border border-cyan-300/35 group h-full backdrop-blur-sm hover:shadow-xl hover:shadow-cyan-900/20 transition-all duration-300 hover:-translate-y-2 bg-slate-950/75">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 via-emerald-500 to-violet-500 rounded-lg flex items-center justify-center text-white shadow-lg shadow-cyan-400/70 shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                          <IconComponent size={32} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-slate-100 text-lg leading-tight mb-2 group-hover:text-cyan-300 transition-colors">
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
        </section >

        {/* PROJECTS SECTION */}
        < section id="projects" data-reveal className="reveal-section py-24 bg-gradient-to-b from-slate-900/40 via-cyan-900/20 to-slate-900/40" >
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">
                Featured Work
              </h2>
              <p className="text-slate-200">Some things I've built</p>
            </div>

            <div className="grid md:grid-cols-2 gap-10 stagger-animation">
              {projects.map((project, index) => (
                <Tilt
                  key={index}
                  tiltMaxAngleX={isMobile ? 0 : 10}
                  tiltMaxAngleY={isMobile ? 0 : 10}
                  tiltEnable={!isMobile}
                  glareEnable={!isMobile}
                  glareMaxOpacity={0.3}
                  scale={1.05}
                  className="h-full"
                >
                  <div
                    onMouseMove={handleCardSpotlightMove}
                    className="project-spotlight-card group relative bg-gradient-to-br from-slate-900/85 via-violet-900/35 to-slate-900/85 rounded-3xl overflow-hidden border border-emerald-400/35 shadow-xl hover:shadow-2xl hover:shadow-emerald-500/30 h-full flex flex-col transform-style-3d transition-all duration-300 hover:-translate-y-3 hover:border-emerald-400/60"
                  >
                    <div className="h-64 overflow-hidden relative">
                      <div
                        className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent z-10"
                        style={{ opacity: 0.3 }}
                      ></div>

                      {project.title === "Blinkit Clone" && (
                        <div className="absolute top-4 left-4 z-30 bg-violet-500/90 text-xs md:text-sm font-bold px-3 py-1 rounded-md shadow-lg backdrop-blur-sm text-white border border-violet-300/60">
                          Featured Project
                        </div>
                      )}

                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover transform group-hover:scale-125 transition-transform duration-700"
                        loading="lazy"
                        decoding="async"
                      />
                      <div
                        className="absolute bottom-4 left-4 z-20 flex gap-2 flex-wrap"
                        style={{ transform: "translateZ(20px)" }}
                      >
                        {project.tech.map((t, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-white/30 backdrop-blur-md text-white text-xs rounded-md border border-white/30 font-semibold hover:bg-white/50 transition-all"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="p-8 flex-1 flex flex-col">
                      <h3 className="text-2xl font-bold text-slate-100 mb-3 flex justify-between items-center group-hover:text-emerald-300 transition-colors">
                        {project.title}
                        <div
                          className="flex gap-3"
                          style={{ transform: "translateZ(50px)" }}
                        >
                          <button
                            type="button"
                            data-cursor-label="Code"
                            className="text-cyan-400 hover:text-cyan-300 hover:scale-125 transition-all duration-300 z-50 cursor-pointer"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              window.open(
                                project.github,
                                "_blank",
                                "noopener,noreferrer"
                              );
                            }}
                            title="View Code"
                            aria-label={`View source code for ${project.title}`}
                          >
                            <Github size={24} />
                          </button>
                          <button
                            type="button"
                            data-cursor-label="Live"
                            className="text-emerald-400 hover:text-emerald-300 hover:scale-125 transition-all duration-300 z-50 cursor-pointer"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              window.open(
                                project.live,
                                "_blank",
                                "noopener,noreferrer"
                              );
                            }}
                            title="Live Demo"
                            aria-label={`Open live demo for ${project.title}`}
                          >
                            <ExternalLink size={24} />
                          </button>
                        </div>
                      </h3>
                      <p className="text-slate-200 leading-relaxed flex-grow">
                        {project.description}
                      </p>
                    </div>
                  </div>
                </Tilt>
              ))}
            </div>
          </div>
        </section >

        {/* CONTACT SECTION */}
        <section
          id="contact"
          data-reveal
          className="reveal-section py-24 bg-gradient-to-b from-slate-900/40 via-violet-900/30 to-slate-900/40 relative overflow-hidden transition-colors duration-300"
        >
          <div className="max-w-4xl mx-auto px-4 relative z-10">
            <Tilt
              tiltMaxAngleX={isMobile ? 0 : 2}
              tiltMaxAngleY={isMobile ? 0 : 2}
              tiltEnable={!isMobile}
              glareEnable={!isMobile}
              glareMaxOpacity={0.05}
            >
              <div className="bg-gradient-to-br from-slate-900/85 via-violet-900/35 to-slate-900 rounded-3xl p-8 md:p-12 shadow-2xl border border-violet-400/30">
                <div className="text-center mb-10">
                  <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-600 via-emerald-500 to-cyan-500 dark:from-violet-300 dark:via-emerald-300 dark:to-cyan-300 bg-clip-text text-transparent">
                    Let's Work Together
                  </h2>
                  <p className="text-slate-200 mt-3 text-lg">
                    Have a project in mind? Let's discuss and create something amazing.
                  </p>
                </div>

                {/* Status Messages */}
                {formStatus.status && (
                  <div
                    className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${formStatus.status === "success"
                      ? "bg-emerald-500/20 border border-emerald-400/50 text-emerald-300"
                      : formStatus.status === "error"
                        ? "bg-red-500/20 border border-red-400/50 text-red-300"
                        : "bg-blue-500/20 border border-blue-400/50 text-blue-300"
                      }`}
                    role={formStatus.status === "error" ? "alert" : "status"}
                    aria-live="polite"
                  >
                    {formStatus.status === "success" && (
                      <CheckCircle size={20} className="flex-shrink-0" />
                    )}
                    {formStatus.status === "error" && (
                      <AlertCircle size={20} className="flex-shrink-0" />
                    )}
                    <span className="text-sm font-medium">{formStatus.message}</span>
                  </div>
                )}

                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <label htmlFor="contact-name" className="sr-only">
                      Your Name
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      name="name"
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={handleFormChange}
                      required
                      disabled={formStatus.status === "sending"}
                      className="w-full px-6 py-4 bg-slate-800/70 border border-violet-400/25 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent focus:bg-slate-800 outline-none transition-all shadow-sm hover:border-emerald-400/30 text-slate-100 placeholder-slate-400 disabled:opacity-60"
                    />
                    <label htmlFor="contact-email" className="sr-only">
                      Your Email
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      placeholder="Your Email"
                      value={formData.email}
                      onChange={handleFormChange}
                      required
                      disabled={formStatus.status === "sending"}
                      className="w-full px-6 py-4 bg-slate-800/70 border border-violet-400/25 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent focus:bg-slate-800 outline-none transition-all shadow-sm hover:border-emerald-400/30 text-slate-100 placeholder-slate-400 disabled:opacity-60"
                    />
                  </div>
                  <label htmlFor="contact-message" className="sr-only">
                    Tell me about your project
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={4}
                    placeholder="Tell me about your project..."
                    value={formData.message}
                    onChange={handleFormChange}
                    required
                    disabled={formStatus.status === "sending"}
                    className="w-full px-6 py-4 bg-slate-800/70 border border-violet-400/25 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent focus:bg-slate-800 outline-none transition-all resize-none shadow-sm hover:border-emerald-400/30 text-slate-100 placeholder-slate-400 disabled:opacity-60"
                  ></textarea>
                  <button
                    type="submit"
                    disabled={formStatus.status === "sending"}
                    className="w-full bg-gradient-to-r from-violet-600 via-emerald-500 to-cyan-400 text-white font-bold py-4 rounded-xl hover:shadow-2xl hover:scale-[1.02] transition-all transform active:scale-95 shadow-lg hover:shadow-violet-500/50 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {formStatus.status === "sending"
                      ? "Sending..."
                      : "Send Message"}
                  </button>
                </form>

                <div className="mt-12 flex flex-col md:flex-row justify-center gap-6 pt-8 border-t border-violet-500/30">
                  <a
                    href="mailto:deveshsingh20666@gmail.com"
                    data-cursor-label="Mail"
                    className="flex items-center justify-center md:justify-start gap-2 text-slate-200 hover:text-emerald-300 transition-all hover:scale-105 font-semibold group"
                  >
                    <Mail size={18} className="group-hover:animate-pulse" /> deveshsingh20666@gmail.com
                  </a>
                  <a
                    href="https://linkedin.com/in/devesh-singh-0b234928b"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor-label="LinkedIn"
                    className="flex items-center justify-center md:justify-start gap-2 text-slate-200 hover:text-emerald-300 transition-all hover:scale-105 font-semibold group"
                  >
                    <Linkedin size={18} className="group-hover:animate-pulse" /> LinkedIn
                  </a>
                </div>
              </div>
            </Tilt>
          </div>
        </section >

        {/* Footer */}
        < footer className="bg-slate-950 py-8 border-t border-violet-500/30 text-center text-gray-400 text-sm" >
          <p>© 2025 Devesh Singh. Crafted with React & Tailwind.</p>
        </footer >
      </main >

      {selectedBlog && (
        <div
          className="fixed inset-0 z-[220] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedBlog(null)}
        >
          <article
            className="w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-2xl border border-cyan-400/25 bg-slate-950 p-6 md:p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-cyan-300 font-semibold mb-1">{selectedBlog.platform}</p>
                <h3 className="text-2xl font-bold text-slate-100 leading-snug">{selectedBlog.title}</h3>
                <p className="text-sm text-slate-400 mt-2">{selectedBlog.date} • {selectedBlog.readTime}</p>
              </div>
              <button
                type="button"
                className="p-2 rounded-md text-slate-300 hover:text-white hover:bg-white/10"
                onClick={() => setSelectedBlog(null)}
                aria-label="Close article"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 text-slate-200 leading-relaxed">
              {selectedBlog.content.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </article>
        </div>
      )}
    </div >
  );
}

export default App;
