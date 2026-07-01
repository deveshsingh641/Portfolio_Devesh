import React from "react";
import { Globe, Server } from "lucide-react";

interface TechItem {
  name: string;
  icon?: string;
}

interface TechCategory {
  title: string;
  icon: string;
  techs: TechItem[];
}

interface SkillsSectionProps {
  theme: string;
  visibleSections: Set<string>;
  techCategories: TechCategory[];
}

const SkillsSection: React.FC<SkillsSectionProps> = ({
  theme,
  visibleSections,
  techCategories,
}) => {
  return (
    <section
      id="skills"
      data-reveal
      className={`reveal-section ${
        visibleSections.has("skills") ? "is-visible" : ""
      } py-24 relative overflow-hidden transition-colors duration-300 ${
        theme === "dark"
          ? "bg-gradient-to-b from-slate-900/40 via-emerald-900/20 to-slate-900/40"
          : "bg-gradient-to-b from-slate-100/40 via-emerald-50/20 to-slate-100/40"
      }`}
    >
      <div className="hidden lg:block absolute right-0 top-1/4 w-96 h-96 bg-blue-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-20 motion-reduce:opacity-0"></div>
      <div className="hidden lg:block absolute left-0 bottom-1/4 w-96 h-96 bg-purple-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-20 motion-reduce:opacity-0"></div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="mb-16">
          <p className="text-xs font-mono uppercase tracking-[0.3em] text-emerald-400 mb-3">
            TECH_STACK
          </p>
          <h2
            className={`text-4xl md:text-5xl font-bold mb-2 ${
              theme === "dark" ? "text-slate-100" : "text-slate-900"
            }`}
          >
            TOOLS I{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              MASTER
            </span>
            .
          </h2>
          <div className="w-32 h-1.5 bg-gradient-to-r from-violet-600 via-emerald-500 to-cyan-400 rounded-full shadow-lg shadow-violet-400/50 mt-5"></div>
        </div>

        {/* Category Vertical List */}
        <div className="space-y-12">
          {techCategories.map((category, idx) => (
            <div key={idx}>
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    theme === "dark" ? "bg-emerald-500/15" : "bg-emerald-100"
                  }`}
                >
                  {category.icon === "code" && (
                    <span className="text-emerald-400 text-sm font-bold">{"</>"}</span>
                  )}
                  {category.icon === "globe" && <Globe size={16} className="text-emerald-400" />}
                  {category.icon === "server" && <Server size={16} className="text-emerald-400" />}
                  {category.icon === "brain" && <span className="text-emerald-400 text-sm">🧠</span>}
                  {category.icon === "gitbranch" && (
                    <span className="text-emerald-400 text-sm">⑂</span>
                  )}
                  {category.icon === "wrench" && (
                    <span className="text-emerald-400 text-sm">🔧</span>
                  )}
                </div>
                <div>
                  <h3
                    className={`text-lg font-bold ${
                      theme === "dark" ? "text-slate-100" : "text-slate-900"
                    }`}
                  >
                    {category.title}
                  </h3>
                  <span className="text-xs text-slate-500">{category.techs.length} technologies</span>
                </div>
              </div>

              {/* Tech Items — Horizontal Wrap Grid */}
              <div className="flex flex-wrap gap-3">
                {category.techs.map((tech) => (
                  <div
                    key={tech.name}
                    className={`flex flex-col items-center justify-center w-[120px] h-[90px] rounded-xl border transition-all duration-300 cursor-default group/item hover:-translate-y-0.5 ${
                      theme === "dark"
                        ? "bg-slate-800/60 border-slate-700/40 hover:border-emerald-500/40 hover:bg-slate-700/50"
                        : "bg-white border-slate-200 hover:border-emerald-400/40 hover:bg-slate-50 hover:shadow-md"
                    }`}
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
                    <span
                      className={`text-xs font-medium text-center leading-tight ${
                        theme === "dark" ? "text-slate-300" : "text-slate-700"
                      }`}
                    >
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
            {
              value: `${techCategories.reduce((s, c) => s + c.techs.length, 0)}+`,
              label: "TECHNOLOGIES",
            },
            { value: "5+", label: "PROJECTS BUILT" },
            { value: "4+", label: "CERTIFICATIONS" },
            { value: "∞", label: "ALWAYS LEARNING" },
          ].map(({ value, label }) => (
            <div
              key={label}
              className={`text-center py-4 px-3 rounded-xl border backdrop-blur-sm ${
                theme === "dark" ? "border-slate-700/30 bg-slate-900/40" : "border-slate-200 bg-white/80"
              }`}
            >
              <div className="text-2xl font-bold text-emerald-400 mb-1">{value}</div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
