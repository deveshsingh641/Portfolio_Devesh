import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Search,
  X,
  ChevronRight,
  Moon,
  Sun,
  BookOpen,
  Code2,
  Mail,
  Home,
  User,
  Award,
  Download,
  GraduationCap,
  Github,
  Linkedin,
  Volume2,
  Eye,
  FolderGit2,
  Sparkles,
  Coffee,
  Bug,
  Copy,
} from "lucide-react";
import { trackResumeAction } from "../lib/analytics";
import { soundService } from "../lib/sound";

export interface Command {
  id: string;
  label: string;
  description: string;
  category: "navigation" | "project" | "blog" | "action";
  icon: React.ReactNode;
  action: () => void;
  keywords: string[];
  badge?: string;
}

export interface CommandPaletteProps {
  theme: string;
  setTheme: (theme: string) => void;
  scrollToSection: (section: string) => void;
  navigate?: (to: string) => void;
  posts?: Array<{ slug: string; title: string; category?: string; tags?: string[] }>;
  projects?: Array<{ slug: string; title: string; category?: string; tech?: string[]; summary?: string }>;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onOpenCvModal?: () => void;
  hideTrigger?: boolean;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  theme,
  setTheme,
  scrollToSection,
  navigate,
  posts = [],
  projects = [],
  isOpen: propIsOpen,
  onOpenChange,
  onOpenCvModal,
  hideTrigger = true,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = propIsOpen !== undefined ? propIsOpen : internalOpen;

  const setOpen = useCallback(
    (value: boolean | ((prev: boolean) => boolean)) => {
      const newValue = typeof value === "function" ? value(open) : value;
      if (propIsOpen !== undefined && onOpenChange) {
        onOpenChange(newValue);
      } else {
        setInternalOpen(newValue);
      }
    },
    [open, propIsOpen, onOpenChange]
  );

  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const prevOpenRef = useRef(open);

  // Audio cues on open/close
  useEffect(() => {
    if (open && !prevOpenRef.current) {
      soundService.playModalOpen();
    } else if (!open && prevOpenRef.current) {
      soundService.playModalClose();
    }
    prevOpenRef.current = open;
  }, [open]);

  // Lock body scroll and pause Lenis while palette is open
  useEffect(() => {
    if (open) {
      const lenis = (window as any).__lenis;
      lenis?.stop();
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        lenis?.start();
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [open]);

  // 1. Navigation Commands
  const navigationCommands: Command[] = [
    {
      id: "nav-home",
      label: "Home",
      description: "Jump to top hero & interactive cosmic matrix",
      category: "navigation",
      icon: <Home size={16} />,
      action: () => {
        scrollToSection("home");
        setOpen(false);
      },
      keywords: ["home", "top", "start", "matrix", "cosmic", "hero"],
    },
    {
      id: "nav-projects",
      label: "Featured Projects",
      description: "Explore engineering showcase, case studies & architecture",
      category: "navigation",
      icon: <FolderGit2 size={16} />,
      action: () => {
        scrollToSection("projects");
        setOpen(false);
      },
      keywords: ["projects", "work", "portfolio", "mern", "code", "architecture", "case study"],
    },
    {
      id: "nav-education",
      label: "Education & Academics",
      description: "ABES Engineering College, B.Tech IT & academic records",
      category: "navigation",
      icon: <GraduationCap size={16} />,
      action: () => {
        scrollToSection("education");
        setOpen(false);
      },
      keywords: ["education", "academics", "college", "abes", "degree", "btech", "school", "cgpa", "grades"],
    },
    {
      id: "nav-about",
      label: "About Me",
      description: "Software engineering journey, impact & metrics",
      category: "navigation",
      icon: <User size={16} />,
      action: () => {
        scrollToSection("about");
        setOpen(false);
      },
      keywords: ["about", "me", "background", "experience", "story", "bio"],
    },
    {
      id: "nav-skills",
      label: "Software & Tech Arsenal",
      description: "Languages, full-stack frameworks, databases & DevOps tools",
      category: "navigation",
      icon: <Code2 size={16} />,
      action: () => {
        scrollToSection("expertise");
        setOpen(false);
      },
      keywords: ["skills", "tech", "stack", "technologies", "mern", "react", "node", "mongo", "express", "tools", "docker"],
    },
    {
      id: "nav-certifications",
      label: "Certifications Wall",
      description: "Verified credentials from Google Cloud, Udemy, Infosys & NPTEL",
      category: "navigation",
      icon: <Award size={16} />,
      action: () => {
        scrollToSection("certifications");
        setOpen(false);
      },
      keywords: ["certifications", "credentials", "badges", "google cloud", "udemy", "infosys", "nptel", "fame"],
    },
    {
      id: "nav-blog",
      label: "Thoughts & Engineering Articles",
      description: "Deep dives on systems, WebSockets, REST APIs & algorithms",
      category: "navigation",
      icon: <BookOpen size={16} />,
      action: () => {
        scrollToSection("thoughts");
        setOpen(false);
      },
      keywords: ["blog", "articles", "posts", "writing", "thoughts", "system design", "read"],
    },
    {
      id: "nav-supporter-rewards",
      label: "Supporter Rewards",
      description: "Support open-source engineering & buy me a coffee",
      category: "navigation",
      icon: <Coffee size={16} />,
      action: () => {
        scrollToSection("support");
        setOpen(false);
      },
      keywords: ["support", "rewards", "coffee", "donate", "fuel", "sponsor"],
    },
    {
      id: "nav-contact",
      label: "Contact & Connect",
      description: "Email, social channels & open collaborations",
      category: "navigation",
      icon: <Mail size={16} />,
      action: () => {
        scrollToSection("contact");
        setOpen(false);
      },
      keywords: ["contact", "email", "reach", "connect", "hire", "message"],
    },
  ];

  // 2. Project Search Commands
  const projectSearchCommands: Command[] = projects.map((project) => ({
    id: `project-${project.slug}`,
    label: project.title,
    description: project.summary ? project.summary.slice(0, 90) + "..." : "Launch interactive case study modal",
    category: "project",
    badge: project.category || "PROJECT",
    icon: <Sparkles size={16} className="text-purple-400" />,
    action: () => {
      setOpen(false);
      scrollToSection("projects");
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent("open-case-study", { detail: { slug: project.slug } }));
      }, 150);
    },
    keywords: [
      project.title.toLowerCase(),
      project.slug.toLowerCase(),
      (project.category || "").toLowerCase(),
      ...(project.tech || []).map((t) => t.toLowerCase()),
      "project",
      "case study",
      "architecture",
    ],
  }));

  // 3. Blog Search Commands
  const blogSearchCommands: Command[] = posts.map((post) => ({
    id: `blog-${post.slug}`,
    label: post.title,
    description: "Read full article & architectural walkthrough",
    category: "blog",
    badge: post.category || "ARTICLE",
    icon: <BookOpen size={16} className="text-blue-400" />,
    action: () => {
      setOpen(false);
      if (navigate) {
        navigate(`/blog/${post.slug}`);
      } else {
        scrollToSection("thoughts");
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent("open-blog-post", { detail: { slug: post.slug } }));
        }, 150);
      }
    },
    keywords: [
      post.title.toLowerCase(),
      post.slug.toLowerCase(),
      (post.category || "").toLowerCase(),
      ...(post.tags || []).map((t) => t.toLowerCase()),
      "blog",
      "post",
      "article",
      "read",
    ],
  }));

  // 4. Action Commands
  const actionCommands: Command[] = [
    {
      id: "action-theme",
      label: `Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`,
      description: `Toggle interface to ${theme === "dark" ? "light" : "dark"} theme`,
      category: "action",
      icon: theme === "dark" ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-indigo-400" />,
      action: () => {
        setTheme(theme === "dark" ? "light" : "dark");
        setOpen(false);
      },
      keywords: ["theme", "dark", "light", "mode", "toggle", "appearance"],
    },
    {
      id: "action-resume",
      label: "Download Resume (PDF)",
      description: "Instant download of latest SDE Resume (PDF)",
      category: "action",
      badge: "PDF",
      icon: <Download size={16} className="text-emerald-400" />,
      action: () => {
        trackResumeAction("download", "command_palette");
        const link = document.createElement("a");
        link.href = "/Devesh_Singh_SDE.pdf";
        link.download = "Devesh_Singh_SDE.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setOpen(false);
      },
      keywords: ["resume", "cv", "download", "pdf", "sde", "hire"],
    },
    {
      id: "action-cv-modal",
      label: "Open Interactive CV Viewer",
      description: "Preview verified credentials, GPA & achievements modal",
      category: "action",
      badge: "PREVIEW",
      icon: <Eye size={16} className="text-cyan-400" />,
      action: () => {
        setOpen(false);
        if (onOpenCvModal) {
          onOpenCvModal();
        } else {
          window.dispatchEvent(new CustomEvent("open-cv-modal"));
        }
      },
      keywords: ["cv", "resume", "modal", "view", "preview", "grades"],
    },
    {
      id: "action-sound-toggle",
      label: "Toggle Tactile Audio FX",
      description: "Enable or mute interactive sound effects",
      category: "action",
      icon: <Volume2 size={16} className="text-pink-400" />,
      action: () => {
        soundService.toggleSound();
        setOpen(false);
      },
      keywords: ["sound", "audio", "sfx", "mute", "unmute", "music", "tactile"],
    },
    {
      id: "action-github",
      label: "GitHub Profile",
      description: "github.com/deveshsingh641 — Repositories & commits",
      category: "action",
      icon: <Github size={16} />,
      action: () => {
        window.open("https://github.com/deveshsingh641", "_blank", "noopener,noreferrer");
        setOpen(false);
      },
      keywords: ["github", "git", "repos", "commits", "code", "profile"],
    },
    {
      id: "action-linkedin",
      label: "LinkedIn Profile",
      description: "linkedin.com/in/deveshsingh64 — Professional network",
      category: "action",
      icon: <Linkedin size={16} className="text-blue-500" />,
      action: () => {
        window.open("https://linkedin.com/in/deveshsingh64", "_blank", "noopener,noreferrer");
        setOpen(false);
      },
      keywords: ["linkedin", "network", "connect", "social", "profile"],
    },
    {
      id: "action-send-message",
      label: "Send Direct Message",
      description: "Compose an in-browser message or hiring inquiry to Devesh",
      category: "action",
      icon: <Mail size={16} className="text-purple-400" />,
      action: () => {
        setOpen(false);
        window.dispatchEvent(
          new CustomEvent("open-contact-modal", { detail: { category: "job" } })
        );
      },
      keywords: ["message", "contact", "email", "hire", "job", "inquiry", "reach"],
    },
    {
      id: "action-report-bug",
      label: "Report Bug / Feedback",
      description: "Report a bug or feature request straight to Devesh's inbox",
      category: "action",
      icon: <Bug size={16} className="text-rose-400" />,
      action: () => {
        setOpen(false);
        window.dispatchEvent(
          new CustomEvent("open-contact-modal", { detail: { category: "bug" } })
        );
      },
      keywords: ["bug", "report", "issue", "feedback", "suggestion", "error"],
    },
    {
      id: "action-copy-email",
      label: "Copy Email Address",
      description: "deveshsingh20666@gmail.com — Copy directly to clipboard",
      category: "action",
      icon: <Copy size={16} className="text-emerald-400" />,
      action: async () => {
        try {
          await navigator.clipboard.writeText("deveshsingh20666@gmail.com");
        } catch {
          // fallback
        }
        setOpen(false);
      },
      keywords: ["email", "copy", "address", "contact", "gmail", "message"],
    },
  ];

  const allCommands = [
    ...navigationCommands,
    ...projectSearchCommands,
    ...blogSearchCommands,
    ...actionCommands,
  ];

  const filtered =
    search.trim() === ""
      ? allCommands
      : allCommands.filter((cmd) => {
          const q = search.toLowerCase().trim();
          return (
            cmd.label.toLowerCase().includes(q) ||
            cmd.description.toLowerCase().includes(q) ||
            cmd.keywords.some((k) => k.includes(q))
          );
        });

  // Global Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K opens/closes palette
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
        setSearch("");
        return;
      }

      // When palette is open
      if (!open) return;

      switch (e.key) {
        case "Escape":
          e.preventDefault();
          setOpen(false);
          break;
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => (prev - 1 + (filtered.length || 1)) % (filtered.length || 1));
          break;
        case "Enter":
          e.preventDefault();
          if (filtered[selectedIndex]) {
            filtered[selectedIndex].action();
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, filtered, selectedIndex, setOpen]);

  // Focus input and reset search when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setSearch("");
      setSelectedIndex(0);
    }
  }, [open]);

  // Reset selection index when search query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  // Auto-scroll the selected item into view during arrow navigation
  useEffect(() => {
    if (itemRefs.current[selectedIndex]) {
      itemRefs.current[selectedIndex]?.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  }, [selectedIndex]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, setOpen]);

  // Group filtered commands by category
  const navItems = filtered.filter((c) => c.category === "navigation");
  const projectItems = filtered.filter((c) => c.category === "project");
  const blogItems = filtered.filter((c) => c.category === "blog");
  const actionItems = filtered.filter((c) => c.category === "action");

  return (
    <>
      {/* Fallback Command button in navbar if not hidden */}
      {!hideTrigger && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            theme === "dark"
              ? "bg-slate-800/40 border border-slate-700/50 text-slate-400 hover:bg-slate-700/50 hover:border-slate-600/50"
              : "bg-slate-100 border border-slate-200 text-slate-600 hover:bg-slate-200 hover:border-slate-300"
          }`}
          title="Press ⌘K or Ctrl+K"
        >
          <Search size={13} />
          <span>Search...</span>
          <span className="ml-auto text-[10px] opacity-60">⌘K</span>
        </button>
      )}

      {/* Modal overlay */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Spotlight Command Palette"
          className="fixed inset-0 z-[150] flex items-start justify-center pt-16 sm:pt-24 md:pt-28 px-4"
        >
          {/* Backdrop with Blur */}
          <div
            className={`fixed inset-0 transition-opacity backdrop-blur-md ${
              theme === "dark" ? "bg-black/80" : "bg-black/40"
            }`}
            onClick={() => setOpen(false)}
          />

          {/* Command palette container */}
          <div
            ref={containerRef}
            className={`relative w-full max-w-2xl mx-auto rounded-2xl shadow-2xl border overflow-hidden z-10 transition-all duration-200 ${
              theme === "dark"
                ? "bg-[#0a0a0f]/95 border-purple-500/30 shadow-purple-950/40 text-slate-100"
                : "bg-white/95 border-slate-300 shadow-slate-900/15 text-slate-900"
            } backdrop-blur-xl`}
          >
            {/* Search Input Bar */}
            <div
              className={`flex items-center gap-3 px-4 sm:px-5 py-3.5 sm:py-4 border-b ${
                theme === "dark" ? "border-slate-800/70" : "border-slate-200"
              }`}
            >
              <Search
                size={18}
                className={theme === "dark" ? "text-purple-400 shrink-0" : "text-purple-600 shrink-0"}
              />
              <input
                ref={inputRef}
                type="text"
                role="searchbox"
                aria-label="Search portfolio commands, projects, posts, or skills"
                placeholder="Type a command, project, post, or skill..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`flex-1 bg-transparent outline-none text-sm sm:text-base font-medium ${
                  theme === "dark"
                    ? "text-slate-100 placeholder-slate-500"
                    : "text-slate-900 placeholder-slate-400"
                }`}
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Clear search input"
                  className={`text-xs px-2 py-1 rounded transition-colors cursor-pointer ${
                    theme === "dark" ? "text-slate-500 hover:text-slate-300" : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  Clear
                </button>
              )}
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close command palette"
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  theme === "dark"
                    ? "hover:bg-slate-800 text-slate-400 hover:text-slate-200"
                    : "hover:bg-slate-100 text-slate-500 hover:text-slate-800"
                }`}
                title="Close (Esc)"
              >
                <X size={18} />
              </button>
            </div>

            {/* Results List */}
            <div
              data-lenis-prevent
              className="max-h-[60vh] sm:max-h-96 overflow-y-auto overscroll-contain py-2 divide-y divide-transparent"
            >
              {filtered.length === 0 ? (
                <div
                  className={`flex flex-col items-center justify-center py-12 px-4 text-center ${
                    theme === "dark" ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  <Search size={32} className="mb-3 opacity-30 text-purple-400" />
                  <p className="text-sm font-semibold">No commands found for &ldquo;{search}&rdquo;</p>
                  <p className="text-xs mt-1 opacity-70">
                    Try searching for &ldquo;projects&rdquo;, &ldquo;mern&rdquo;, &ldquo;education&rdquo;, or &ldquo;resume&rdquo;
                  </p>
                </div>
              ) : (
                <>
                  {/* Navigation Section */}
                  {navItems.length > 0 && (
                    <div className="mb-2">
                      <div
                        className={`px-4 sm:px-5 py-1.5 text-[11px] font-bold uppercase tracking-wider ${
                          theme === "dark" ? "text-purple-400/80" : "text-purple-700/80"
                        }`}
                      >
                        Navigation
                      </div>
                      {navItems.map((cmd) => {
                        const globalIndex = filtered.indexOf(cmd);
                        return (
                          <CommandItem
                            key={cmd.id}
                            ref={(el) => (itemRefs.current[globalIndex] = el)}
                            cmd={cmd}
                            isSelected={globalIndex === selectedIndex}
                            onClick={() => cmd.action()}
                            onMouseEnter={() => setSelectedIndex(globalIndex)}
                            theme={theme}
                          />
                        );
                      })}
                    </div>
                  )}

                  {/* Projects Section */}
                  {projectItems.length > 0 && (
                    <div className="mb-2">
                      <div
                        className={`px-4 sm:px-5 py-1.5 text-[11px] font-bold uppercase tracking-wider ${
                          theme === "dark" ? "text-purple-400/80" : "text-purple-700/80"
                        }`}
                      >
                        Projects &amp; Case Studies ({projectItems.length})
                      </div>
                      {projectItems.map((cmd) => {
                        const globalIndex = filtered.indexOf(cmd);
                        return (
                          <CommandItem
                            key={cmd.id}
                            ref={(el) => (itemRefs.current[globalIndex] = el)}
                            cmd={cmd}
                            isSelected={globalIndex === selectedIndex}
                            onClick={() => cmd.action()}
                            onMouseEnter={() => setSelectedIndex(globalIndex)}
                            theme={theme}
                          />
                        );
                      })}
                    </div>
                  )}

                  {/* Blog Posts Section */}
                  {blogItems.length > 0 && (
                    <div className="mb-2">
                      <div
                        className={`px-4 sm:px-5 py-1.5 text-[11px] font-bold uppercase tracking-wider ${
                          theme === "dark" ? "text-blue-400/80" : "text-blue-700/80"
                        }`}
                      >
                        Blog Articles ({blogItems.length})
                      </div>
                      {blogItems.map((cmd) => {
                        const globalIndex = filtered.indexOf(cmd);
                        return (
                          <CommandItem
                            key={cmd.id}
                            ref={(el) => (itemRefs.current[globalIndex] = el)}
                            cmd={cmd}
                            isSelected={globalIndex === selectedIndex}
                            onClick={() => cmd.action()}
                            onMouseEnter={() => setSelectedIndex(globalIndex)}
                            theme={theme}
                          />
                        );
                      })}
                    </div>
                  )}

                  {/* Actions Section */}
                  {actionItems.length > 0 && (
                    <div className="mb-2">
                      <div
                        className={`px-4 sm:px-5 py-1.5 text-[11px] font-bold uppercase tracking-wider ${
                          theme === "dark" ? "text-emerald-400/80" : "text-emerald-700/80"
                        }`}
                      >
                        Quick Actions
                      </div>
                      {actionItems.map((cmd) => {
                        const globalIndex = filtered.indexOf(cmd);
                        return (
                          <CommandItem
                            key={cmd.id}
                            ref={(el) => (itemRefs.current[globalIndex] = el)}
                            cmd={cmd}
                            isSelected={globalIndex === selectedIndex}
                            onClick={() => cmd.action()}
                            onMouseEnter={() => setSelectedIndex(globalIndex)}
                            theme={theme}
                          />
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer keyboard hints */}
            <div
              className={`flex items-center justify-between px-4 sm:px-5 py-2.5 text-xs border-t ${
                theme === "dark"
                  ? "border-slate-800/80 text-slate-400 bg-black/40"
                  : "border-slate-200 text-slate-500 bg-slate-50/70"
              }`}
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="flex items-center gap-1">
                  <kbd
                    className={`px-1.5 py-0.5 rounded border text-[10px] font-mono ${
                      theme === "dark" ? "border-slate-700 bg-slate-800" : "border-slate-300 bg-white"
                    }`}
                  >
                    ↑↓
                  </kbd>
                  <span className="hidden sm:inline">Navigate</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd
                    className={`px-1.5 py-0.5 rounded border text-[10px] font-mono ${
                      theme === "dark" ? "border-slate-700 bg-slate-800" : "border-slate-300 bg-white"
                    }`}
                  >
                    ↵
                  </kbd>
                  <span className="hidden sm:inline">Select</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd
                    className={`px-1.5 py-0.5 rounded border text-[10px] font-mono ${
                      theme === "dark" ? "border-slate-700 bg-slate-800" : "border-slate-300 bg-white"
                    }`}
                  >
                    Esc
                  </kbd>
                  <span className="hidden sm:inline">Close</span>
                </span>
              </div>
              <div className="text-[11px] font-mono opacity-75">
                {filtered.length} {filtered.length === 1 ? "result" : "results"}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

interface CommandItemProps {
  cmd: Command;
  isSelected: boolean;
  onClick: () => void;
  onMouseEnter?: () => void;
  theme: string;
}

const CommandItem = React.forwardRef<HTMLButtonElement, CommandItemProps>(
  ({ cmd, isSelected, onClick, onMouseEnter, theme }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        className={`w-full flex items-center gap-3 px-4 sm:px-5 py-2.5 sm:py-3 text-left transition-all border-l-2 cursor-pointer ${
          isSelected
            ? theme === "dark"
              ? "bg-purple-900/25 border-purple-400 text-purple-200"
              : "bg-purple-50 border-purple-600 text-purple-900"
            : theme === "dark"
            ? "border-transparent text-slate-300 hover:bg-slate-900/60"
            : "border-transparent text-slate-700 hover:bg-slate-100/70"
        }`}
      >
        <div
          className={`shrink-0 ${
            isSelected
              ? theme === "dark"
                ? "text-purple-300"
                : "text-purple-600"
              : theme === "dark"
              ? "text-slate-400"
              : "text-slate-500"
          }`}
        >
          {cmd.icon}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-xs sm:text-sm truncate">{cmd.label}</span>
            {cmd.badge && (
              <span
                className={`text-[9px] font-mono px-1.5 py-0.2 rounded border uppercase tracking-wider ${
                  theme === "dark"
                    ? "bg-purple-950/60 border-purple-800/60 text-purple-300"
                    : "bg-purple-100 border-purple-200 text-purple-700"
                }`}
              >
                {cmd.badge}
              </span>
            )}
          </div>
          <div
            className={`text-[11px] sm:text-xs truncate mt-0.5 ${
              isSelected
                ? theme === "dark"
                  ? "text-purple-300/80"
                  : "text-purple-700"
                : theme === "dark"
                ? "text-slate-400"
                : "text-slate-500"
            }`}
          >
            {cmd.description}
          </div>
        </div>

        {isSelected && (
          <ChevronRight
            size={16}
            className={`shrink-0 ${theme === "dark" ? "text-purple-400" : "text-purple-600"}`}
          />
        )}
      </button>
    );
  }
);

CommandItem.displayName = "CommandItem";

export default CommandPalette;
