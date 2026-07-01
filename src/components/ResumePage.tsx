import { Download, ArrowLeft, Mail, Github, Linkedin, Globe } from "lucide-react";

type TechCategory = {
  title: string;
  icon: string;
  techs: Array<{ name: string; icon?: string }>;
};

type EducationItem = {
  degree: string;
  school: string;
  year: string;
  score: string;
};

type CertificationItem = {
  name: string;
  source: string;
  year?: string;
  badges?: string[];
  icon: React.ElementType;
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
};

export default function ResumePage({
  theme,
  onNavigate,
  techCategories,
  projects,
  education,
  certifications,
}: {
  theme: string;
  onNavigate: (to: string) => void;
  techCategories: TechCategory[];
  projects: ProjectItem[];
  education: EducationItem[];
  certifications: CertificationItem[];
}) {
  const isDark = theme === "dark";

  const handleDownloadPdf = () => {
    const link = document.createElement("a");
    link.href = "/FINAL_RESUME_DEVESH.pdf";
    link.download = "Devesh_Singh_Resume.pdf";
    link.click();
  };

  return (
    <div className={`min-h-screen ${isDark ? "text-slate-100" : "text-slate-900"}`}>
      {/* Top bar */}
      <div className={`no-print sticky top-0 z-[80] border-b ${isDark ? "bg-slate-950/90 border-slate-700/40" : "bg-white/90 border-slate-200"} backdrop-blur`}> 
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => onNavigate("/")}
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold border transition-all ${isDark ? "bg-slate-900/60 border-slate-700/50 text-slate-200 hover:border-cyan-400/40 hover:text-cyan-200" : "bg-white border-slate-200 text-slate-700 hover:border-cyan-400/40 hover:text-cyan-700"}`}
          >
            <ArrowLeft size={14} /> Back
          </button>

          <button
            type="button"
            onClick={handleDownloadPdf}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-extrabold bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-200 border border-emerald-400/30 hover:border-emerald-400/60 transition-all"
          >
            <Download size={14} /> Download PDF
          </button>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 py-10 print-container">
        {/* Header */}
        <section className={`rounded-2xl border shadow-xl p-8 ${isDark ? "bg-gradient-to-br from-slate-900/90 via-violet-900/20 to-slate-900/90 border-slate-700/40" : "bg-white border-slate-200"}`}>
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div>
              <p className="text-xs font-mono uppercase tracking-[0.3em] text-emerald-400 mb-2">RESUME</p>
              <h1 className={`text-3xl md:text-4xl font-black ${isDark ? "text-white" : "text-slate-900"}`}>Devesh Singh</h1>
              <p className={`mt-2 text-base font-semibold ${isDark ? "text-slate-300" : "text-slate-600"}`}>Full-Stack Developer (MERN)</p>
              <p className={`mt-3 text-sm leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                Full Stack Developer (MERN) skilled in JavaScript, TypeScript, React.js, Node.js, Express.js, MongoDB, RESTful APIs, JWT Authentication, and Role-Based Access Control (RBAC). Delivered production applications with CI/CD pipelines via GitHub Actions, achieving 80% reduction in processing time and 95+ Google Lighthouse scores. B.Tech Information Technology student with 500+ DSA problems solved across CodeChef and LeetCode.
              </p>
            </div>

            <div className="grid gap-2 text-sm">
              <a className={`flex items-center gap-2 ${isDark ? "text-slate-300 hover:text-cyan-300" : "text-slate-700 hover:text-cyan-700"}`} href="mailto:deveshsingh20666@gmail.com">
                <Mail size={16} /> deveshsingh20666@gmail.com
              </a>
              <a className={`flex items-center gap-2 ${isDark ? "text-slate-300 hover:text-cyan-300" : "text-slate-700 hover:text-cyan-700"}`} href="https://github.com/deveshsingh641" target="_blank" rel="noopener noreferrer">
                <Github size={16} /> github.com/deveshsingh641
              </a>
              <a className={`flex items-center gap-2 ${isDark ? "text-slate-300 hover:text-cyan-300" : "text-slate-700 hover:text-cyan-700"}`} href="https://linkedin.com/in/deveshsingh64" target="_blank" rel="noopener noreferrer">
                <Linkedin size={16} /> linkedin.com/in/deveshsingh64
              </a>
              <a className={`flex items-center gap-2 ${isDark ? "text-slate-300 hover:text-cyan-300" : "text-slate-700 hover:text-cyan-700"}`} href="https://deveshdev.live" target="_blank" rel="noopener noreferrer">
                <Globe size={16} /> deveshdev.live
              </a>
            </div>
          </div>
        </section>

        {/* Placement Snapshot */}
        <section className="mt-6 grid md:grid-cols-4 gap-4">
          {[
            { label: "Target Role", value: "Full-Stack Developer" },
            { label: "Core Stack", value: "React, Node.js, Express, MongoDB" },
            { label: "Availability", value: "Open to placements" },
            { label: "Location", value: "India" },
          ].map((item) => (
            <div key={item.label} className={`rounded-2xl border p-5 ${isDark ? "bg-slate-900/50 border-slate-700/40" : "bg-white border-slate-200"}`}>
              <p className={`text-[10px] font-mono uppercase tracking-[0.35em] ${isDark ? "text-slate-400" : "text-slate-500"}`}>{item.label}</p>
              <p className={`mt-2 text-sm font-extrabold ${isDark ? "text-slate-100" : "text-slate-900"}`}>{item.value}</p>
            </div>
          ))}
        </section>

        {/* Featured Projects */}
        <section className="mt-8">
          <div className="flex items-end justify-between gap-4 mb-4">
            <div>
              <h2 className={`text-xl font-extrabold ${isDark ? "text-slate-100" : "text-slate-900"}`}>Featured Projects</h2>
              <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>Most relevant for placements</p>
            </div>
            <button
              type="button"
              className={`no-print text-xs font-bold uppercase tracking-wider ${isDark ? "text-slate-400 hover:text-cyan-300" : "text-slate-600 hover:text-cyan-700"}`}
              onClick={() => onNavigate("/#projects")}
            >
              View All
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {projects.slice(0, 2).map((p) => (
              <div
                key={p.slug}
                className={`rounded-2xl border p-5 ${isDark ? "bg-slate-900/50 border-slate-700/40" : "bg-white border-slate-200"}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">{p.category}</p>
                    <h3 className={`text-base font-bold mt-1 ${isDark ? "text-slate-100" : "text-slate-900"}`}>{p.title}</h3>
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${p.status === "Live" ? "bg-emerald-500/15 text-emerald-200 border-emerald-400/30" : "bg-violet-500/15 text-violet-200 border-violet-400/30"}`}>
                    {p.status}
                  </span>
                </div>
                <p className={`mt-3 text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>{p.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {p.tech.slice(0, 6).map((t) => (
                    <span key={t} className={`text-[10px] font-bold px-2 py-1 rounded-md border ${isDark ? "bg-slate-950/50 text-slate-300 border-slate-700/50" : "bg-slate-50 text-slate-700 border-slate-200"}`}>{t}</span>
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-3 no-print">
                  <button
                    type="button"
                    onClick={() => onNavigate(`/projects/${p.slug}`)}
                    className={`text-xs font-bold px-3 py-2 rounded-lg border transition-all ${isDark ? "bg-slate-950/50 border-slate-700/50 text-slate-200 hover:border-emerald-400/40 hover:text-emerald-200" : "bg-white border-slate-200 text-slate-700 hover:border-emerald-400/40 hover:text-emerald-700"}`}
                  >
                    Case Study
                  </button>
                  <a
                    href={p.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-xs font-bold ${isDark ? "text-slate-400 hover:text-cyan-300" : "text-slate-600 hover:text-cyan-700"}`}
                  >
                    Source
                  </a>
                  {p.live && (
                    <a
                      href={p.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-xs font-bold ${isDark ? "text-slate-400 hover:text-cyan-300" : "text-slate-600 hover:text-cyan-700"}`}
                    >
                      Live
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Skills */}
        <section className="mt-8">
          <h2 className={`text-xl font-extrabold mb-4 ${isDark ? "text-slate-100" : "text-slate-900"}`}>Skills</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {techCategories.map((cat) => (
              <div
                key={cat.title}
                className={`rounded-2xl border p-5 ${isDark ? "bg-slate-900/50 border-slate-700/40" : "bg-white border-slate-200"}`}
              >
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className={`text-sm font-extrabold ${isDark ? "text-slate-100" : "text-slate-900"}`}>{cat.title}</h3>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">{cat.techs.length} tech</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {cat.techs.map((t) => (
                    <span
                      key={t.name}
                      className={`text-[10px] font-bold px-2 py-1 rounded-md border ${isDark ? "bg-slate-950/50 text-slate-300 border-slate-700/50" : "bg-slate-50 text-slate-700 border-slate-200"}`}
                    >
                      {t.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Education + Certifications */}
        <section className="mt-8 grid lg:grid-cols-2 gap-6">
          <div>
            <h2 className={`text-xl font-extrabold mb-4 ${isDark ? "text-slate-100" : "text-slate-900"}`}>Education</h2>
            <div className="space-y-3">
              {education.map((e) => (
                <div key={`${e.degree}-${e.year}`} className={`rounded-2xl border p-5 ${isDark ? "bg-slate-900/50 border-slate-700/40" : "bg-white border-slate-200"}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className={`text-sm font-extrabold ${isDark ? "text-slate-100" : "text-slate-900"}`}>{e.degree}</h3>
                      <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>{e.school}</p>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border bg-violet-500/10 border-violet-400/20 text-violet-200">{e.year}</span>
                  </div>
                  <p className={`mt-2 text-sm font-semibold ${isDark ? "text-emerald-200" : "text-emerald-700"}`}>{e.score}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className={`text-xl font-extrabold mb-4 ${isDark ? "text-slate-100" : "text-slate-900"}`}>Certifications</h2>
            <div className="space-y-3">
              {certifications.map((c) => (
                <div key={`${c.name}-${c.source}`} className={`rounded-2xl border p-5 ${isDark ? "bg-slate-900/50 border-slate-700/40" : "bg-white border-slate-200"}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className={`text-sm font-extrabold ${isDark ? "text-slate-100" : "text-slate-900"}`}>{c.name}</h3>
                      <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>{c.source}{c.year ? ` • ${c.year}` : ""}</p>
                    </div>
                  </div>
                  {c.badges?.length ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {c.badges.map((b) => (
                        <span key={b} className={`text-[10px] font-bold px-2 py-1 rounded-md border ${isDark ? "bg-slate-950/50 text-slate-300 border-slate-700/50" : "bg-slate-50 text-slate-700 border-slate-200"}`}>
                          {b}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
