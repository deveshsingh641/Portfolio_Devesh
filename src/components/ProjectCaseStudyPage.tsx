import React from "react";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";

type ProjectCaseStudy = {
  problem: string;
  solution: string;
  keyFeatures: string[];
  architecture: {
    frontend: string;
    backend: string;
    data: string;
  };
};

type ProjectItem = {
  title: string;
  slug: string;
  description: string;
  tech: string[];
  github: string;
  live?: string;
  status: string;
  category: string;
  image: string;
  caseStudy: ProjectCaseStudy;
};

export default function ProjectCaseStudyPage({
  theme,
  project,
  onNavigate,
}: {
  theme: string;
  project?: ProjectItem;
  onNavigate: (to: string) => void;
}) {
  const isDark = theme === "dark";

  if (!project) {
    return (
      <div className={`min-h-screen ${isDark ? "text-slate-100" : "text-slate-900"}`}>
        <div className={`sticky top-0 z-[80] border-b ${isDark ? "bg-slate-950/90 border-slate-700/40" : "bg-white/90 border-slate-200"} backdrop-blur`}>
          <div className="max-w-5xl mx-auto px-4 py-3">
            <button
              type="button"
              onClick={() => onNavigate("/")}
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold border transition-all ${isDark ? "bg-slate-900/60 border-slate-700/50 text-slate-200 hover:border-cyan-400/40 hover:text-cyan-200" : "bg-white border-slate-200 text-slate-700 hover:border-cyan-400/40 hover:text-cyan-700"}`}
            >
              <ArrowLeft size={14} /> Back
            </button>
          </div>
        </div>
        <main className="max-w-5xl mx-auto px-4 py-12">
          <h1 className={`text-2xl font-extrabold ${isDark ? "text-white" : "text-slate-900"}`}>Project not found</h1>
          <p className={`mt-2 text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>The link may be outdated.</p>
        </main>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? "text-slate-100" : "text-slate-900"}`}>
      <div className={`sticky top-0 z-[80] border-b ${isDark ? "bg-slate-950/90 border-slate-700/40" : "bg-white/90 border-slate-200"} backdrop-blur`}>
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => onNavigate("/#projects")}
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold border transition-all ${isDark ? "bg-slate-900/60 border-slate-700/50 text-slate-200 hover:border-cyan-400/40 hover:text-cyan-200" : "bg-white border-slate-200 text-slate-700 hover:border-cyan-400/40 hover:text-cyan-700"}`}
          >
            <ArrowLeft size={14} /> Projects
          </button>

          <div className="flex items-center gap-2">
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold border transition-all ${isDark ? "bg-slate-900/60 border-slate-700/50 text-slate-200 hover:border-cyan-400/40 hover:text-cyan-200" : "bg-white border-slate-200 text-slate-700 hover:border-cyan-400/40 hover:text-cyan-700"}`}
            >
              <Github size={14} /> Source
            </a>
            {project.live ? (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-extrabold bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-200 border border-emerald-400/30 hover:border-emerald-400/60 transition-all"
              >
                <ExternalLink size={14} /> Live
              </a>
            ) : null}
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 py-10">
        <header className={`rounded-2xl border overflow-hidden shadow-xl ${isDark ? "bg-slate-900/60 border-slate-700/40" : "bg-white border-slate-200"}`}>
          <div className="h-56 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10" />
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
              onError={(e) => {
                e.currentTarget.src =
                  "https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=1200&q=80";
              }}
            />
            <div className="absolute bottom-4 left-4 right-4 z-20">
              <p className="text-[10px] font-mono uppercase tracking-[0.35em] text-emerald-300">CASE_STUDY</p>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1">{project.title}</h1>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border bg-black/40 border-white/20 text-white/80">{project.category}</span>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${project.status === "Live" ? "bg-emerald-500/20 text-emerald-200 border-emerald-400/30" : "bg-violet-500/20 text-violet-200 border-violet-400/30"}`}>
                  {project.status}
                </span>
              </div>
            </div>
          </div>

          <div className="p-6">
            <p className={`${isDark ? "text-slate-300" : "text-slate-700"}`}>{project.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span key={t} className={`text-[10px] font-bold px-2 py-1 rounded-md border ${isDark ? "bg-slate-950/50 text-slate-300 border-slate-700/50" : "bg-slate-50 text-slate-700 border-slate-200"}`}>{t}</span>
              ))}
            </div>
          </div>
        </header>

        <section className="mt-8 grid lg:grid-cols-2 gap-6">
          <div className={`rounded-2xl border p-6 ${isDark ? "bg-slate-900/50 border-slate-700/40" : "bg-white border-slate-200"}`}>
            <h2 className={`text-lg font-extrabold ${isDark ? "text-slate-100" : "text-slate-900"}`}>Problem</h2>
            <p className={`mt-2 text-sm leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>{project.caseStudy.problem}</p>
          </div>
          <div className={`rounded-2xl border p-6 ${isDark ? "bg-slate-900/50 border-slate-700/40" : "bg-white border-slate-200"}`}>
            <h2 className={`text-lg font-extrabold ${isDark ? "text-slate-100" : "text-slate-900"}`}>Solution</h2>
            <p className={`mt-2 text-sm leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>{project.caseStudy.solution}</p>
          </div>
        </section>

        <section className={`mt-6 rounded-2xl border p-6 ${isDark ? "bg-slate-900/50 border-slate-700/40" : "bg-white border-slate-200"}`}>
          <h2 className={`text-lg font-extrabold ${isDark ? "text-slate-100" : "text-slate-900"}`}>Key Features</h2>
          <div className="mt-3 grid md:grid-cols-2 gap-3">
            {project.caseStudy.keyFeatures.map((f) => (
              <div key={f} className={`rounded-xl border px-4 py-3 ${isDark ? "bg-slate-950/40 border-slate-700/40" : "bg-slate-50 border-slate-200"}`}>
                <p className={`text-sm font-semibold ${isDark ? "text-slate-200" : "text-slate-800"}`}>{f}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={`mt-6 rounded-2xl border p-6 ${isDark ? "bg-slate-900/50 border-slate-700/40" : "bg-white border-slate-200"}`}>
          <h2 className={`text-lg font-extrabold ${isDark ? "text-slate-100" : "text-slate-900"}`}>Architecture</h2>
          <div className="mt-4 grid md:grid-cols-3 gap-4">
            {[
              { label: "Frontend", value: project.caseStudy.architecture.frontend },
              { label: "Backend", value: project.caseStudy.architecture.backend },
              { label: "Data/AI", value: project.caseStudy.architecture.data },
            ].map((item) => (
              <div key={item.label} className={`rounded-xl border p-4 ${isDark ? "bg-slate-950/40 border-slate-700/40" : "bg-slate-50 border-slate-200"}`}>
                <p className="text-[10px] font-mono uppercase tracking-[0.35em] text-emerald-400 mb-2">{item.label}</p>
                <p className={`text-sm leading-relaxed ${isDark ? "text-slate-300" : "text-slate-700"}`}>{item.value}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
