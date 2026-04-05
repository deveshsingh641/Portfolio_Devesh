import React, { useState, useEffect, useRef, useCallback } from "react";
import { Search, X, ChevronRight, Moon, Sun, BookOpen, Code2, Mail, Home, User, Award, Command, Play, Rocket, Bug, Coffee, Download, FileText, Github } from "lucide-react";

interface Command {
  id: string;
  label: string;
  description: string;
  category: "navigation" | "action" | "search";
  icon: React.ReactNode;
  action: () => void;
  keywords: string[];
}

interface CommandPaletteProps {
  theme: string;
  setTheme: (theme: string) => void;
  scrollToSection: (section: string) => void;
  navigate?: (to: string) => void;
  posts?: Array<{ slug: string; title: string }>;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ theme, setTheme, scrollToSection, navigate, posts = [], isOpen: propIsOpen, onOpenChange }) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = propIsOpen !== undefined ? propIsOpen : internalOpen;
  const setOpen = useCallback((value: boolean | ((prev: boolean) => boolean)) => {
    const newValue = typeof value === 'function' ? value(open) : value;
    if (propIsOpen !== undefined && onOpenChange) {
      onOpenChange(newValue);
    } else {
      setInternalOpen(newValue);
    }
  }, [open, propIsOpen, onOpenChange]);
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const navigationCommands: Command[] = [
    {
      id: "nav-home",
      label: "Home",
      description: "Jump to home section",
      category: "navigation",
      icon: <Home size={16} />,
      action: () => {
        scrollToSection("home");
        setOpen(false);
      },
      keywords: ["home", "top", "start"],
    },
    {
      id: "nav-about",
      label: "About",
      description: "Learn about me",
      category: "navigation",
      icon: <User size={16} />,
      action: () => {
        scrollToSection("about");
        setOpen(false);
      },
      keywords: ["about", "me", "background"],
    },
    {
      id: "nav-skills",
      label: "Skills",
      description: "View my technical skills",
      category: "navigation",
      icon: <Code2 size={16} />,
      action: () => {
        scrollToSection("skills");
        setOpen(false);
      },
      keywords: ["skills", "tech", "stack", "technologies"],
    },
    {
      id: "nav-github",
      label: "GitHub Dashboard",
      description: "View GitHub stats & activity",
      category: "navigation",
      icon: <Github size={16} />,
      action: () => {
        scrollToSection("github");
        setOpen(false);
      },
      keywords: ["github", "stats", "streak", "activity", "languages"],
    },
    {
      id: "nav-blog",
      label: "Blog",
      description: "Read my blog posts",
      category: "navigation",
      icon: <BookOpen size={16} />,
      action: () => {
        scrollToSection("blog");
        setOpen(false);
      },
      keywords: ["blog", "articles", "posts", "writing"],
    },
    {
      id: "nav-projects",
      label: "Projects",
      description: "View my projects",
      category: "navigation",
      icon: <Code2 size={16} />,
      action: () => {
        scrollToSection("projects");
        setOpen(false);
      },
      keywords: ["projects", "work", "portfolio"],
    },
    {
      id: "nav-resume",
      label: "Resume",
      description: "View my resume page",
      category: "navigation",
      icon: <FileText size={16} />,
      action: () => {
        if (navigate) {
          navigate("/resume");
        } else {
          const link = document.createElement("a");
          link.href = "/FINAL_RESUME_DEVESH.pdf";
          link.target = "_blank";
          link.click();
        }
        setOpen(false);
      },
      keywords: ["resume", "cv", "profile", "placement"],
    },
    {
      id: "nav-contact",
      label: "Contact",
      description: "Get in touch",
      category: "navigation",
      icon: <Mail size={16} />,
      action: () => {
        scrollToSection("contact");
        setOpen(false);
      },
      keywords: ["contact", "email", "reach", "connect"],
    },
    {
      id: "nav-certifications",
      label: "Certifications",
      description: "View my credentials",
      category: "navigation",
      icon: <Award size={16} />,
      action: () => {
        scrollToSection("certifications");
        setOpen(false);
      },
      keywords: ["certifications", "credentials", "badges"],
    },
    {
      id: "nav-playground",
      label: "Playground",
      description: "Try interactive code snippets",
      category: "navigation",
      icon: <Play size={16} />,
      action: () => {
        scrollToSection("playground");
        setOpen(false);
      },
      keywords: ["playground", "code", "snippets", "run", "try"],
    },
    {
      id: "nav-now-tracker",
      label: "Now Tracker",
      description: "See what I'm currently working on",
      category: "navigation",
      icon: <Rocket size={16} />,
      action: () => {
        scrollToSection("now-tracker");
        setOpen(false);
      },
      keywords: ["now", "tracker", "current", "status", "live", "building", "reading"],
    },
    {
      id: "nav-supporter-rewards",
      label: "Supporter Rewards",
      description: "Support my work — buy me a coffee",
      category: "navigation",
      icon: <Coffee size={16} />,
      action: () => {
        scrollToSection("supporter-rewards");
        setOpen(false);
      },
      keywords: ["support", "rewards", "coffee", "donate", "fuel", "sponsor"],
    },
  ];

  const actionCommands: Command[] = [
    {
      id: "action-theme",
      label: `Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`,
      description: `Enable ${theme === "dark" ? "light" : "dark"} theme`,
      category: "action",
      icon: theme === "dark" ? <Sun size={16} /> : <Moon size={16} />,
      action: () => {
        setTheme(theme === "dark" ? "light" : "dark");
        setOpen(false);
      },
      keywords: ["theme", "dark", "light", "mode", "toggle"],
    },
    {
      id: "action-resume",
      label: "Download Resume",
      description: "Download my resume as PDF",
      category: "action",
      icon: <Download size={16} />,
      action: () => {
        const link = document.createElement("a");
          link.href = "/FINAL_RESUME_DEVESH.pdf";
        link.download = "Devesh_Singh_Resume.pdf";
        link.click();
        setOpen(false);
      },
      keywords: ["resume", "cv", "download", "pdf"],
    },
    ...(navigate
      ? [
        {
          id: "action-open-resume",
          label: "Open Resume Page",
          description: "View the ATS-friendly resume page",
          category: "action",
          icon: <FileText size={16} />,
          action: () => {
            navigate("/resume");
            setOpen(false);
          },
          keywords: ["resume", "page", "ats", "placements"],
        },
      ]
      : []),
    {
      id: "action-bug-report",
      label: "Report Bug / Suggest Feature",
      description: "Submit a bug report or feature request",
      category: "action",
      icon: <Bug size={16} />,
      action: () => {
        setOpen(false);
        // Click the floating bug report button
        setTimeout(() => {
          const bugBtn = document.querySelector('[title="Report a bug or suggest a feature"]') as HTMLButtonElement;
          if (bugBtn) bugBtn.click();
        }, 200);
      },
      keywords: ["bug", "report", "issue", "feature", "suggest", "feedback"],
    },
  ];

  // Blog search commands
  const blogSearchCommands: Command[] = posts.slice(0, 5).map((post) => ({
    id: `blog-${post.slug}`,
    label: post.title,
    description: "Read this article",
    category: "search",
    icon: <BookOpen size={16} />,
    action: () => {
      scrollToSection("blog");
      setOpen(false);
    },
    keywords: [post.title.toLowerCase(), post.slug.toLowerCase()],
  }));

  const allCommands = [...navigationCommands, ...actionCommands, ...blogSearchCommands];

  const filtered =
    search.trim() === ""
      ? allCommands
      : allCommands.filter(
          (cmd) =>
            cmd.label.toLowerCase().includes(search.toLowerCase()) ||
            cmd.description.toLowerCase().includes(search.toLowerCase()) ||
            cmd.keywords.some((k) => k.includes(search.toLowerCase()))
        );

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K opens/closes palette
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
        setSearch("");
      }

      // When palette is open
      if (!open) return;

      switch (e.key) {
        case "Escape":
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

  // Focus input when opened
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open, setOpen]);

  // Reset selection when search changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

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

  return (
    <>
      {/* Command button in navbar (optional) */}
      <button
        onClick={() => setOpen(true)}
        className={`hidden md:flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
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

      {/* Modal overlay */}
      {open && (
        <div className="fixed inset-0 z-[200] flex items-start justify-center pt-20 md:pt-32">
          {/* Backdrop */}
          <div
            className={`absolute inset-0 transition-opacity ${
              theme === "dark" ? "bg-black/60" : "bg-white/40"
            }`}
            onClick={() => setOpen(false)}
          />

          {/* Command palette container */}
          <div
            ref={containerRef}
            className={`relative w-full max-w-xl mx-auto px-4 rounded-2xl shadow-2xl border overflow-hidden z-10 animate-slideInUp ${
              theme === "dark"
                ? "bg-slate-950/95 border-slate-800/50"
                : "bg-white border-slate-200"
            }`}
          >
            {/* Search input */}
            <div className={`flex items-center gap-3 px-5 py-4 border-b ${
              theme === "dark"
                ? "border-slate-800/50"
                : "border-slate-200"
            }`}>
              <Search size={18} className={theme === "dark" ? "text-slate-500" : "text-slate-400"} />
              <input
                ref={inputRef}
                type="text"
                placeholder="Type a command..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`flex-1 bg-transparent outline-none text-sm font-medium ${
                  theme === "dark"
                    ? "text-slate-100 placeholder-slate-500"
                    : "text-slate-900 placeholder-slate-400"
                }`}
              />
              <button
                onClick={() => setOpen(false)}
                className={`p-1 rounded transition-colors ${
                  theme === "dark"
                    ? "hover:bg-slate-800/50 text-slate-500"
                    : "hover:bg-slate-100 text-slate-400"
                }`}
              >
                <X size={18} />
              </button>
            </div>

            {/* Results */}
            <div className="max-h-96 overflow-y-auto">
              {filtered.length === 0 ? (
                <div className={`flex flex-col items-center justify-center py-12 ${
                  theme === "dark" ? "text-slate-500" : "text-slate-400"
                }`}>
                  <Search size={32} className="mb-2 opacity-30" />
                  <p className="text-sm font-medium">No commands found</p>
                  <p className="text-xs opacity-75">Try searching for a section or action</p>
                </div>
              ) : (
                <>
                  {/* Navigation section */}
                  {filtered.some((cmd) => cmd.category === "navigation") && (
                    <div>
                      <div className={`px-5 py-2 text-xs font-bold uppercase tracking-wider ${
                        theme === "dark"
                          ? "text-slate-600"
                          : "text-slate-400"
                      }`}>
                        Navigate
                      </div>
                      {filtered
                        .filter((cmd) => cmd.category === "navigation")
                        .map((cmd) => (
                          <CommandItem
                            key={cmd.id}
                            cmd={cmd}
                            isSelected={filtered.indexOf(cmd) === selectedIndex}
                            onClick={() => cmd.action()}
                            theme={theme}
                          />
                        ))}
                    </div>
                  )}

                  {/* Actions section */}
                  {filtered.some((cmd) => cmd.category === "action") && (
                    <div>
                      <div className={`px-5 py-2 text-xs font-bold uppercase tracking-wider ${
                        theme === "dark"
                          ? "text-slate-600"
                          : "text-slate-400"
                      }`}>
                        Actions
                      </div>
                      {filtered
                        .filter((cmd) => cmd.category === "action")
                        .map((cmd) => (
                          <CommandItem
                            key={cmd.id}
                            cmd={cmd}
                            isSelected={filtered.indexOf(cmd) === selectedIndex}
                            onClick={() => cmd.action()}
                            theme={theme}
                          />
                        ))}
                    </div>
                  )}

                  {/* Search results section */}
                  {filtered.some((cmd) => cmd.category === "search") && (
                    <div>
                      <div className={`px-5 py-2 text-xs font-bold uppercase tracking-wider ${
                        theme === "dark"
                          ? "text-slate-600"
                          : "text-slate-400"
                      }`}>
                        Articles
                      </div>
                      {filtered
                        .filter((cmd) => cmd.category === "search")
                        .map((cmd) => (
                          <CommandItem
                            key={cmd.id}
                            cmd={cmd}
                            isSelected={filtered.indexOf(cmd) === selectedIndex}
                            onClick={() => cmd.action()}
                            theme={theme}
                          />
                        ))}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer hint */}
            {filtered.length > 0 && (
              <div className={`flex items-center justify-between px-5 py-3 text-xs border-t ${
                theme === "dark"
                  ? "border-slate-800/50 text-slate-500"
                  : "border-slate-200 text-slate-400"
              }`}>
                <div className="flex gap-3">
                  <kbd className={`px-2 py-1 rounded border ${
                    theme === "dark"
                      ? "border-slate-700 bg-slate-800/40"
                      : "border-slate-200 bg-slate-100"
                  }`}>
                    ↑↓
                  </kbd>
                  <span>Navigate</span>
                </div>
                <div className="flex gap-3">
                  <kbd className={`px-2 py-1 rounded border ${
                    theme === "dark"
                      ? "border-slate-700 bg-slate-800/40"
                      : "border-slate-200 bg-slate-100"
                  }`}>
                    ↵
                  </kbd>
                  <span>Select</span>
                  <kbd className={`px-2 py-1 rounded border ${
                    theme === "dark"
                      ? "border-slate-700 bg-slate-800/40"
                      : "border-slate-200 bg-slate-100"
                  }`}>
                    Esc
                  </kbd>
                  <span>Close</span>
                </div>
              </div>
            )}
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
  theme: string;
}

const CommandItem: React.FC<CommandItemProps> = ({ cmd, isSelected, onClick, theme }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-5 py-3 text-left transition-colors border-l-2 ${
      isSelected
        ? theme === "dark"
          ? "bg-violet-500/15 border-violet-400/50 text-violet-300"
          : "bg-violet-100/50 border-violet-400/50 text-violet-700"
        : theme === "dark"
          ? "border-transparent text-slate-300 hover:bg-slate-900/50"
          : "border-transparent text-slate-700 hover:bg-slate-50"
    }`}
  >
    <div className={isSelected ? "text-violet-300" : theme === "dark" ? "text-slate-500" : "text-slate-400"}>
      {cmd.icon}
    </div>
    <div className="flex-1 min-w-0">
      <div className="font-medium text-sm truncate">{cmd.label}</div>
      <div className={`text-xs truncate ${
        theme === "dark"
          ? "text-slate-500"
          : "text-slate-400"
      }`}>
        {cmd.description}
      </div>
    </div>
    {isSelected && <ChevronRight size={16} className="text-violet-300 flex-shrink-0" />}
  </button>
);

export default CommandPalette;
