import React, { useState, useEffect, useRef } from "react";
import { 
  User, Code2, Folder, BookOpen, Award, Mail, FileText, 
  Sun, Moon, Volume2, VolumeX, Monitor, Clock, ExternalLink, Github, ArrowRight, Terminal
} from "lucide-react";
import DesktopWindow from "./DesktopWindow";
import AboutSection from "../AboutSection";
import SkillsSection from "../SkillsSection";
import CertificationsSection from "../CertificationsSection";
import ContactSection from "../ContactSection";
import BlogSection from "../BlogSection";
import ProjectPreview from "../ProjectPreview";
import { TerminalWindow } from "./TerminalWindow";

interface WindowState {
  id: string;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  x: number;
  y: number;
  w: number;
  h: number;
  zIndex: number;
}

interface DesktopManagerProps {
  theme: string;
  setTheme: (theme: string) => void;
  onToggleOsMode: () => void;
  techCategories: any[];
  projects: any[];
  education: any[];
  certifications: any[];
  blogPosts: any[];
  onNavigate: (to: string) => void;
  formData: any;
  formStatus: any;
  handleFormChange: (e: any) => void;
  handleFormSubmit: (e: any) => void;
}

const DesktopManager: React.FC<DesktopManagerProps> = ({
  theme,
  setTheme,
  onToggleOsMode,
  techCategories,
  projects,
  education,
  certifications,
  blogPosts,
  onNavigate,
  formData,
  formStatus,
  handleFormChange,
  handleFormSubmit,
}) => {
  const [timeString, setTimeString] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [activeApp, setActiveApp] = useState("Finder");
  const maxZIndex = useRef(20);

  const [windows, setWindows] = useState<Record<string, WindowState>>({
    about: { id: "about", title: "About Me", isOpen: true, isMinimized: false, isMaximized: false, x: 80, y: 70, w: 750, h: 500, zIndex: 20 },
    skills: { id: "skills", title: "Tech Stack", isOpen: false, isMinimized: false, isMaximized: false, x: 120, y: 100, w: 700, h: 480, zIndex: 1 },
    projects: { id: "projects", title: "Projects Portfolio", isOpen: false, isMinimized: false, isMaximized: false, x: 160, y: 80, w: 800, h: 550, zIndex: 1 },
    blog: { id: "blog", title: "Technical Blog", isOpen: false, isMinimized: false, isMaximized: false, x: 200, y: 120, w: 750, h: 500, zIndex: 1 },
    certifications: { id: "certifications", title: "Certifications", isOpen: false, isMinimized: false, isMaximized: false, x: 240, y: 140, w: 700, h: 480, zIndex: 1 },
    contact: { id: "contact", title: "Contact Me", isOpen: false, isMinimized: false, isMaximized: false, x: 280, y: 160, w: 700, h: 500, zIndex: 1 },
    terminal: { id: "terminal", title: "Terminal Shell", isOpen: false, isMinimized: false, isMaximized: false, x: 180, y: 90, w: 550, h: 420, zIndex: 1 },
  });

  const [projectFilter, setProjectFilter] = useState("All");

  // Dynamic Live Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }) +
        "   " +
        now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Web Audio click tick generator
  const playTick = () => {
    if (isMuted) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(1000, ctx.currentTime);
      gain.gain.setValueAtTime(0.015, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch { /* ignore audio context issues */ }
  };

  const handleWindowFocus = (id: string) => {
    if (windows[id].zIndex === maxZIndex.current) return;
    playTick();
    maxZIndex.current += 1;
    setWindows((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        isMinimized: false,
        zIndex: maxZIndex.current,
      },
    }));
    const matchedApp = APP_DEFS.find((app) => app.id === id);
    if (matchedApp) {
      setActiveApp(matchedApp.title);
    }
  };

  const handleWindowOpen = (id: string) => {
    playTick();
    setWindows((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        isOpen: true,
        isMinimized: false,
      },
    }));
    handleWindowFocus(id);
  };

  const handleWindowClose = (id: string) => {
    playTick();
    setWindows((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        isOpen: false,
      },
    }));
    setActiveApp("Finder");
  };

  const handleWindowMinimize = (id: string) => {
    playTick();
    setWindows((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        isMinimized: true,
      },
    }));
    setActiveApp("Finder");
  };

  const handleWindowMaximize = (id: string) => {
    playTick();
    setWindows((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        isMaximized: !prev[id].isMaximized,
      },
    }));
  };

  const handleWindowMove = (id: string, x: number, y: number) => {
    setWindows((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        x,
        y,
      },
    }));
  };

  const handleWindowResize = (id: string, w: number, h: number) => {
    setWindows((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        w,
        h,
      },
    }));
  };

  const APP_DEFS = [
    { id: "about", title: "About Me", icon: User, color: "from-violet-500 to-indigo-600" },
    { id: "skills", title: "Tech Stack", icon: Code2, color: "from-emerald-500 to-teal-600" },
    { id: "projects", title: "Projects", icon: Folder, color: "from-cyan-500 to-blue-600" },
    { id: "blog", title: "Blog Posts", icon: BookOpen, color: "from-pink-500 to-rose-600" },
    { id: "certifications", title: "Certifications", icon: Award, color: "from-amber-500 to-orange-600" },
    { id: "contact", title: "Contact", icon: Mail, color: "from-rose-500 to-red-600" },
    { id: "terminal", title: "Terminal", icon: Terminal, color: "from-slate-800 to-slate-950" },
  ];

  const projectCategories = ["All", "AI", "Frontend"];
  const filteredProjects = projectFilter === "All"
    ? projects
    : projects.filter((p) => p.category === projectFilter);

  const isDark = theme === "dark";

  return (
    <div className={`h-screen w-screen overflow-hidden relative font-sans select-none flex flex-col ${
      isDark ? "bg-[#040611] text-slate-100" : "bg-slate-50 text-slate-900"
    }`}>
      {/* OS WALLPAPER & GRID OVERLAY */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {isDark ? (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#030612] to-slate-950" />
            <div className="absolute top-[-10%] left-[20%] w-[35rem] h-[35rem] rounded-full blur-[140px] bg-violet-600/15 animate-pulse duration-[6000ms]" />
            <div className="absolute bottom-[-10%] right-[20%] w-[35rem] h-[35rem] rounded-full blur-[140px] bg-cyan-600/10 animate-pulse duration-[8000ms]" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px]" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-100 via-indigo-50/20 to-sky-100" />
            <div className="absolute top-[-10%] left-[20%] w-[35rem] h-[35rem] rounded-full blur-[120px] bg-indigo-200/40" />
            <div className="absolute bottom-[-10%] right-[20%] w-[35rem] h-[35rem] rounded-full blur-[120px] bg-sky-200/35" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000003_1px,transparent_1px),linear-gradient(to_bottom,#00000003_1px,transparent_1px)] bg-[size:32px_32px]" />
          </>
        )}
      </div>

      {/* TOP MENU BAR */}
      <div className={`h-10 w-full px-4 flex items-center justify-between border-b backdrop-blur-md z-[100] ${
        isDark ? "bg-slate-950/70 border-slate-900 text-slate-200" : "bg-white/70 border-slate-200 text-slate-800"
      }`}>
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2 cursor-pointer font-black" onClick={playTick}>
            <span className="w-5 h-5 rounded-md bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center text-white text-[10px] shadow">D</span>
            <span className="text-xs tracking-wider">DeveshOS</span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-500/10 px-2 py-0.5 rounded">
            {activeApp}
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium">
          {/* Quick controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => { playTick(); setTheme(theme === "dark" ? "light" : "dark"); }}
              className={`p-1.5 rounded-lg transition-colors ${isDark ? "hover:bg-slate-800" : "hover:bg-slate-200"}`}
              title="Toggle theme"
            >
              {isDark ? <Sun size={14} className="text-yellow-400" /> : <Moon size={14} className="text-violet-600" />}
            </button>
            <button
              onClick={() => { setIsMuted(!isMuted); }}
              className={`p-1.5 rounded-lg transition-colors ${isDark ? "hover:bg-slate-800" : "hover:bg-slate-200"}`}
              title={isMuted ? "Unmute sounds" : "Mute sounds"}
            >
              {isMuted ? <VolumeX size={14} className="text-slate-400" /> : <Volume2 size={14} className="text-emerald-400" />}
            </button>
            <button
              onClick={onToggleOsMode}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border tracking-wider transition-colors ${
                isDark 
                  ? "bg-slate-900 border-cyan-400/30 text-cyan-300 hover:bg-cyan-500/10" 
                  : "bg-white border-violet-200 text-violet-700 hover:bg-violet-50"
              }`}
              title="Return to standard website mode"
            >
              <Monitor size={10} /> Scrolling Mode
            </button>
          </div>

          <div className="h-4 w-px bg-slate-400/20" />

          {/* DateTime Display */}
          <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
            <Clock size={12} className="text-slate-400/80" />
            {timeString}
          </div>
        </div>
      </div>

      {/* DESKTOP SHORTCUTS GRID */}
      <div className="flex-1 w-full relative p-6 z-10 select-none pointer-events-none">
        <div className="flex flex-col gap-6 w-24 pointer-events-auto">
          {APP_DEFS.map((app) => {
            const AppIcon = app.icon;
            const isWindowOpen = windows[app.id].isOpen;

            return (
              <button
                key={app.id}
                onDoubleClick={() => handleWindowOpen(app.id)}
                onClick={() => { playTick(); if (window.innerWidth < 768) handleWindowOpen(app.id); }}
                className="group flex flex-col items-center gap-1.5 cursor-pointer text-center relative"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${app.color} p-[1px] shadow-lg group-hover:scale-105 group-active:scale-95 transition-all duration-300 flex items-center justify-center relative`}>
                  <div className={`w-full h-full rounded-2xl flex items-center justify-center backdrop-blur-sm ${
                    isDark ? "bg-slate-950/45 text-white" : "bg-white/10 text-white"
                  }`}>
                    <AppIcon size={24} className="drop-shadow-md" />
                  </div>
                  {isWindowOpen && (
                    <div className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.9)]" />
                  )}
                </div>
                <span className={`text-[10px] font-bold font-mono tracking-wide px-1.5 py-0.5 rounded shadow-sm transition-colors ${
                  isDark 
                    ? "text-slate-200 bg-slate-950/60 group-hover:bg-slate-900/90" 
                    : "text-slate-700 bg-white/70 group-hover:bg-white"
                }`}>
                  {app.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* WINDOW MANAGER CONTAINER */}
      <div className="absolute inset-0 top-10 bottom-20 z-20 pointer-events-none">
        <div className="relative w-full h-full pointer-events-auto">
          {/* Window 1: About Me */}
          <DesktopWindow
            id="about"
            title="About Me"
            theme={theme}
            {...windows.about}
            onClose={handleWindowClose}
            onMinimize={handleWindowMinimize}
            onMaximize={handleWindowMaximize}
            onFocus={handleWindowFocus}
            onMove={handleWindowMove}
            onResize={handleWindowResize}
          >
            <AboutSection
              theme={theme}
              visibleSections={new Set(["about"])}
              scrollToSection={handleWindowOpen}
              navigate={(to) => {
                if (to.startsWith("/blog")) handleWindowOpen("blog");
                else if (to.startsWith("/projects")) handleWindowOpen("projects");
              }}
              education={education}
              isMobile={false}
            />
          </DesktopWindow>

          {/* Window 2: Skills / Tech Stack */}
          <DesktopWindow
            id="skills"
            title="Tech Stack"
            theme={theme}
            {...windows.skills}
            onClose={handleWindowClose}
            onMinimize={handleWindowMinimize}
            onMaximize={handleWindowMaximize}
            onFocus={handleWindowFocus}
            onMove={handleWindowMove}
            onResize={handleWindowResize}
          >
            <SkillsSection
              theme={theme}
              visibleSections={new Set(["skills"])}
              techCategories={techCategories}
            />
          </DesktopWindow>

          {/* Window 3: Projects Grid */}
          <DesktopWindow
            id="projects"
            title="Projects Portfolio"
            theme={theme}
            {...windows.projects}
            onClose={handleWindowClose}
            onMinimize={handleWindowMinimize}
            onMaximize={handleWindowMaximize}
            onFocus={handleWindowFocus}
            onMove={handleWindowMove}
            onResize={handleWindowResize}
          >
            <div className="space-y-8 font-sans pb-10">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800/40 pb-4">
                <div>
                  <h3 className={`text-xl font-bold ${isDark ? "text-slate-100" : "text-slate-900"}`}>My Works</h3>
                  <p className="text-xs text-slate-500 mt-1">A curated collection of web apps and AI software</p>
                </div>
                {/* Filters */}
                <div className="flex gap-2">
                  {projectCategories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setProjectFilter(cat)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                        projectFilter === cat
                          ? "bg-cyan-500/20 text-cyan-200 border-cyan-400/40 shadow"
                          : isDark
                            ? "bg-slate-900/40 text-slate-400 border-slate-800 hover:text-slate-200"
                            : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Projects list */}
              <div className="grid sm:grid-cols-2 gap-6">
                {filteredProjects.map((p) => (
                  <div
                    key={p.slug}
                    className={`rounded-2xl border p-5 shadow flex flex-col justify-between ${
                      isDark ? "bg-slate-900/40 border-slate-800/80" : "bg-white border-slate-200"
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">{p.category}</span>
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                          p.status === "Live"
                            ? "bg-emerald-500/10 border-emerald-400/30 text-emerald-300"
                            : "bg-violet-500/10 border-violet-400/30 text-violet-300"
                        }`}>{p.status}</span>
                      </div>
                      <h4 className={`text-base font-extrabold ${isDark ? "text-slate-100" : "text-slate-900"}`}>{p.title}</h4>
                      <p className="text-xs text-slate-400 mt-2 leading-relaxed line-clamp-3">{p.description}</p>
                      
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {p.tech.slice(0, 5).map((t: string) => (
                          <span key={t} className={`text-[9px] px-2 py-0.5 rounded border font-semibold ${
                            isDark ? "bg-slate-950/40 border-slate-800/60 text-slate-300" : "bg-slate-50 border-slate-200 text-slate-600"
                          }`}>{t}</span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-5 border-t border-slate-800/40 pt-3 flex flex-wrap items-center justify-between gap-3">
                      <a
                        href={p.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-cyan-400 transition-colors"
                      >
                        GitHub <Github size={12} />
                      </a>
                      {p.live && (
                        <a
                          href={p.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-cyan-300 hover:text-cyan-200 transition-colors"
                        >
                          Launch App <ArrowRight size={12} />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </DesktopWindow>

          {/* Window 4: Blog Section */}
          <DesktopWindow
            id="blog"
            title="Technical Blog"
            theme={theme}
            {...windows.blog}
            onClose={handleWindowClose}
            onMinimize={handleWindowMinimize}
            onMaximize={handleWindowMaximize}
            onFocus={handleWindowFocus}
            onMove={handleWindowMove}
            onResize={handleWindowResize}
          >
            <BlogSection
              theme={theme}
              posts={blogPosts}
              onNavigate={(to) => {
                // If opening a post inside WebOS, navigate natively or just simulate it.
                // We'll open it in standard scrolling view or let the user click share.
                window.open(window.location.origin + to, "_blank");
              }}
            />
          </DesktopWindow>

          {/* Window 5: Certifications */}
          <DesktopWindow
            id="certifications"
            title="Certifications"
            theme={theme}
            {...windows.certifications}
            onClose={handleWindowClose}
            onMinimize={handleWindowMinimize}
            onMaximize={handleWindowMaximize}
            onFocus={handleWindowFocus}
            onMove={handleWindowMove}
            onResize={handleWindowResize}
          >
            <CertificationsSection
              theme={theme}
              visibleSections={new Set(["certifications"])}
              certifications={certifications}
            />
          </DesktopWindow>

          {/* Window 6: Contact Form */}
          <DesktopWindow
            id="contact"
            title="Contact Me"
            theme={theme}
            {...windows.contact}
            onClose={handleWindowClose}
            onMinimize={handleWindowMinimize}
            onMaximize={handleWindowMaximize}
            onFocus={handleWindowFocus}
            onMove={handleWindowMove}
            onResize={handleWindowResize}
          >
            <ContactSection
              theme={theme}
              visibleSections={new Set(["contact"])}
              formData={formData}
              formStatus={formStatus}
              handleFormChange={handleFormChange}
              handleFormSubmit={handleFormSubmit}
              isMobile={false}
            />
          </DesktopWindow>

          {/* Window 7: Terminal Shell */}
          <DesktopWindow
            id="terminal"
            title="Terminal Shell"
            theme={theme}
            {...windows.terminal}
            onClose={handleWindowClose}
            onMinimize={handleWindowMinimize}
            onMaximize={handleWindowMaximize}
            onFocus={handleWindowFocus}
            onMove={handleWindowMove}
            onResize={handleWindowResize}
          >
            <TerminalWindow
              theme={theme}
              setTheme={setTheme}
            />
          </DesktopWindow>
        </div>
      </div>

      {/* BOTTOM GLASSMORPHIC TASKBAR / DOCK */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
        <div className={`flex items-end gap-3 px-4 py-2.5 rounded-3xl border backdrop-blur-lg shadow-2xl transition-all duration-300 ${
          isDark 
            ? "bg-slate-950/60 border-slate-800/80 shadow-black/50" 
            : "bg-white/60 border-slate-200/90 shadow-slate-900/10"
        }`}>
          {APP_DEFS.map((app) => {
            const AppIcon = app.icon;
            const win = windows[app.id];
            const isOpened = win.isOpen;
            const isMinimized = win.isMinimized;

            return (
              <div key={app.id} className="relative flex flex-col items-center group">
                {/* Tooltip */}
                <div className={`absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider shadow-md ${
                  isDark ? "bg-slate-900 text-slate-200" : "bg-white text-slate-800 border border-slate-200"
                }`}>
                  {app.title}
                </div>

                <button
                  onClick={() => {
                    playTick();
                    if (!isOpened) {
                      handleWindowOpen(app.id);
                    } else if (isMinimized) {
                      handleWindowFocus(app.id);
                    } else {
                      // Toggle minimize if already focused, else focus it
                      if (win.zIndex === maxZIndex.current) {
                        handleWindowMinimize(app.id);
                      } else {
                        handleWindowFocus(app.id);
                      }
                    }
                  }}
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${app.color} p-[1px] hover:-translate-y-1.5 transition-all duration-300 flex items-center justify-center relative ${
                    isOpened && !isMinimized ? "scale-100 brightness-100" : "brightness-75 scale-95"
                  }`}
                >
                  <div className={`w-full h-full rounded-xl flex items-center justify-center ${
                    isDark ? "bg-slate-950/45 text-white" : "bg-white/10 text-white"
                  }`}>
                    <AppIcon size={20} />
                  </div>
                </button>

                {/* Status indicator lights */}
                {isOpened && (
                  <div className={`w-1 h-1 rounded-full absolute -bottom-1.5 transition-colors ${
                    isMinimized ? "bg-slate-500" : "bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.8)]"
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DesktopManager;
