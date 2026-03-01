import React from "react";
import { Activity, BookOpen, Code2, Rocket, Target, Zap, ExternalLink, Briefcase } from "lucide-react";

interface StatusItem {
  id: string;
  label: string;
  title: string;
  description: string;
  status: "live" | "building" | "learning" | "reading" | "working";
  link?: string;
}

const items: StatusItem[] = [
  {
    id: "project-1",
    label: "BUILDING",
    title: "Lecture Feedback System",
    description: "Full-stack platform for collecting and analyzing student feedback on lectures in real-time with advanced analytics.",
    status: "building",
    link: "https://github.com/deveshsingh641/lecture_feedback_system",
  },
  {
    id: "project-2",
    label: "WORKING",
    title: "E-Commerce Platform",
    description: "Building a full-stack e-commerce solution with React, Node.js, and MongoDB. Features include product catalog, shopping cart, and payment integration.",
    status: "working",
    link: "https://github.com/deveshsingh641",
  },
  {
    id: "learning-1",
    label: "LEARNING",
    title: "Data Structures & Algorithms",
    description: "Deep diving into graphs, dynamic programming, and advanced tree structures. Solving problems on LeetCode daily.",
    status: "learning",
    link: "https://leetcode.com/",
  },
  {
    id: "reading-1",
    label: "READING",
    title: "Clean Code by Robert C. Martin",
    description: "Currently studying best practices for writing readable, maintainable, and elegant code.",
    status: "reading",
  },
];

const statusConfig = {
  live: { color: "text-emerald-400", bg: "bg-emerald-400", gradient: "from-emerald-500 to-green-500", icon: Rocket },
  building: { color: "text-cyan-400", bg: "bg-cyan-400", gradient: "from-cyan-500 to-blue-500", icon: Code2 },
  learning: { color: "text-violet-400", bg: "bg-violet-400", gradient: "from-violet-500 to-purple-500", icon: Target },
  reading: { color: "text-amber-400", bg: "bg-amber-400", gradient: "from-amber-500 to-orange-500", icon: BookOpen },
  working: { color: "text-rose-400", bg: "bg-rose-400", gradient: "from-rose-500 to-pink-500", icon: Briefcase },
};

const MissionControl: React.FC<{ theme: string }> = ({ theme }) => {
  return (
    <div className="space-y-10">
      {/* Section header — matches reference "NOW TRACKER" style */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <span className="text-xs font-mono uppercase tracking-[0.3em] text-emerald-400">LIVE TRANSMISSION</span>
        </div>
        <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
          NOW{" "}
          <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent">
            TRACKER
          </span>
        </h2>
        <p className={`text-lg max-w-2xl mx-auto ${theme === "dark" ? "text-slate-300" : "text-slate-600"}`}>
          A real-time dashboard of my current focus, media consumption, and active projects.
        </p>
        <div className="w-32 h-1.5 bg-gradient-to-r from-emerald-600 via-cyan-500 to-violet-500 mx-auto rounded-full shadow-lg shadow-emerald-400/50 mt-5" />
      </div>

      {/* Status cards — reference uses LIVE badges on each card */}
      <div className="grid md:grid-cols-2 gap-5">
        {items.map((item) => {
          const cfg = statusConfig[item.status];
          const StatusIcon = cfg.icon;

          return (
            <div
              key={item.id}
              className={`group relative rounded-2xl border p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl ${
                theme === "dark"
                  ? "border-slate-700/40 bg-slate-900/60 hover:border-slate-600/60 hover:shadow-cyan-900/10"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-slate-200/50"
              }`}
            >
              {/* LIVE status badge */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-2 w-2">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${cfg.bg} opacity-75`} />
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${cfg.bg}`} />
                  </span>
                  <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${cfg.color}`}>
                    LIVE {item.label}
                  </span>
                </div>
                <div className={`p-2 rounded-lg bg-gradient-to-br ${cfg.gradient} bg-opacity-10`}>
                  <StatusIcon size={16} className="text-white" />
                </div>
              </div>

              {/* Content */}
              <h3 className={`text-lg font-bold mb-2 group-hover:${cfg.color} transition-colors ${theme === "dark" ? "text-slate-100" : "text-slate-900"}`}>
                {item.title}
              </h3>
              <p className={`text-sm leading-relaxed ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}>
                {item.description}
              </p>

              {/* Link */}
              {item.link && (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold mt-4 transition-all hover:gap-2.5 ${cfg.color}`}
                >
                  Details <ExternalLink size={11} />
                </a>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Activity, label: "UPTIME", value: "99.9%" },
          { icon: Zap, label: "ACTIVE PROJECTS", value: "3" },
          { icon: Target, label: "THIS MONTH GOALS", value: "5" },
          { icon: Rocket, label: "DEPLOYED", value: "2 this week" },
        ].map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className={`text-center py-4 px-3 rounded-xl border backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 ${
              theme === "dark" ? "border-slate-700/30 bg-slate-900/40" : "border-slate-200 bg-white/80"
            }`}
          >
            <Icon size={16} className="mx-auto mb-2 text-emerald-400" />
            <div className={`text-lg font-bold ${theme === "dark" ? "text-slate-100" : "text-slate-900"}`}>{value}</div>
            <div className="text-[9px] font-mono uppercase tracking-wider text-slate-500">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MissionControl;
