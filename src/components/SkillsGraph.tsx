import React, { useState, useMemo } from "react";
import { BarChart3, TrendingUp, Zap, Code2 } from "lucide-react";

interface Skill {
  name: string;
  level: number; // 0-100
  category: string;
  icon?: string;
  experience: string; // e.g. "2 years"
}

const skills: Skill[] = [
  // Languages
  { name: "JavaScript", level: 90, category: "Languages", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg", experience: "2+ years" },
  { name: "TypeScript", level: 85, category: "Languages", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg", experience: "1+ year" },
  { name: "C++", level: 82, category: "Languages", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg", experience: "2+ years" },
  { name: "Java", level: 75, category: "Languages", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg", experience: "1+ year" },
  // Frontend
  { name: "React", level: 92, category: "Frontend", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg", experience: "2+ years" },
  { name: "Tailwind CSS", level: 90, category: "Frontend", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg", experience: "2+ years" },
  { name: "HTML5 / CSS3", level: 95, category: "Frontend", experience: "3+ years" },
  { name: "Three.js", level: 60, category: "Frontend", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/threejs/threejs-original.svg", experience: "6 months" },
  // Backend
  { name: "Node.js", level: 85, category: "Backend", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg", experience: "2+ years" },
  { name: "Express.js", level: 83, category: "Backend", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg", experience: "1+ year" },
  { name: "MongoDB", level: 80, category: "Backend", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg", experience: "1+ year" },
  { name: "REST APIs", level: 88, category: "Backend", experience: "2+ years" },
  // Tools
  { name: "Git", level: 88, category: "Tools", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg", experience: "2+ years" },
  { name: "VS Code", level: 95, category: "Tools", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg", experience: "3+ years" },
  { name: "Linux", level: 75, category: "Tools", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg", experience: "1+ year" },
  { name: "Figma", level: 70, category: "Tools", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg", experience: "1+ year" },
];

const categories = ["All", "Languages", "Frontend", "Backend", "Tools"];

function getBarColor(level: number): string {
  if (level >= 90) return "from-emerald-400 to-cyan-400";
  if (level >= 80) return "from-violet-400 to-cyan-400";
  if (level >= 70) return "from-amber-400 to-orange-400";
  return "from-pink-400 to-rose-400";
}

function getLevelLabel(level: number): string {
  if (level >= 90) return "Expert";
  if (level >= 80) return "Advanced";
  if (level >= 70) return "Intermediate";
  return "Learning";
}

const SkillsGraph: React.FC<{ theme: string }> = ({ theme }) => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"level" | "name">("level");

  const filtered = useMemo(() => {
    let list = activeCategory === "All" ? skills : skills.filter((s) => s.category === activeCategory);
    if (sortBy === "level") list = [...list].sort((a, b) => b.level - a.level);
    else list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [activeCategory, sortBy]);

  const avgLevel = useMemo(() => Math.round(filtered.reduce((s, sk) => s + sk.level, 0) / (filtered.length || 1)), [filtered]);

  return (
    <div className="space-y-8">
      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: BarChart3, label: "Total Skills", value: skills.length.toString() },
          { icon: TrendingUp, label: "Avg Proficiency", value: `${avgLevel}%` },
          { icon: Zap, label: "Expert Level", value: skills.filter((s) => s.level >= 90).length.toString() },
          { icon: Code2, label: "Categories", value: (categories.length - 1).toString() },
        ].map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className={`text-center py-4 px-3 rounded-xl border backdrop-blur-sm ${
              theme === "dark" ? "border-slate-700/30 bg-slate-900/40" : "border-slate-200 bg-white/80"
            }`}
          >
            <Icon size={18} className="mx-auto mb-2 text-emerald-400" />
            <div className="text-2xl font-bold text-emerald-400">{value}</div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500">{label}</div>
          </div>
        ))}
      </div>

      {/* Category filter + sort */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase transition-all duration-300 border ${
                cat === activeCategory
                  ? theme === "dark"
                    ? "bg-cyan-500/20 text-cyan-200 border-cyan-400/50 shadow-lg shadow-cyan-500/10"
                    : "bg-violet-500/15 text-violet-700 border-violet-400/50"
                  : theme === "dark"
                    ? "bg-slate-800/40 text-slate-400 border-slate-700/50 hover:text-slate-200 hover:bg-slate-700/50"
                    : "bg-white text-slate-500 border-slate-200 hover:text-slate-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setSortBy(sortBy === "level" ? "name" : "level")}
          className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
            theme === "dark"
              ? "border-slate-700/50 text-slate-400 hover:text-slate-200 bg-slate-800/40"
              : "border-slate-200 text-slate-500 hover:text-slate-700 bg-white"
          }`}
        >
          Sort: {sortBy === "level" ? "Proficiency" : "A-Z"}
        </button>
      </div>

      {/* Skills bars */}
      <div className="space-y-3">
        {filtered.map((skill) => (
          <div
            key={skill.name}
            className={`group rounded-xl border px-4 py-3 transition-all duration-300 cursor-default ${
              theme === "dark"
                ? "border-slate-700/30 bg-slate-900/40 hover:border-emerald-500/30"
                : "border-slate-200 bg-white hover:border-emerald-400/40"
            } ${hoveredSkill === skill.name ? "ring-1 ring-emerald-400/40" : ""}`}
            onMouseEnter={() => setHoveredSkill(skill.name)}
            onMouseLeave={() => setHoveredSkill(null)}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                {skill.icon ? (
                  <img src={skill.icon} alt={skill.name} className="w-5 h-5" loading="lazy" />
                ) : (
                  <div className="w-5 h-5 rounded bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
                    <Code2 size={12} className="text-white" />
                  </div>
                )}
                <span className={`text-sm font-semibold ${theme === "dark" ? "text-slate-200" : "text-slate-800"}`}>
                  {skill.name}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-[10px] font-mono uppercase tracking-wider ${
                  skill.level >= 90 ? "text-emerald-400" : skill.level >= 80 ? "text-violet-400" : skill.level >= 70 ? "text-amber-400" : "text-pink-400"
                }`}>
                  {getLevelLabel(skill.level)}
                </span>
                <span className={`text-xs font-bold tabular-nums ${theme === "dark" ? "text-slate-300" : "text-slate-700"}`}>
                  {skill.level}%
                </span>
              </div>
            </div>

            {/* Bar */}
            <div className={`h-2 rounded-full overflow-hidden ${theme === "dark" ? "bg-slate-800" : "bg-slate-200"}`}>
              <div
                className={`h-full rounded-full bg-gradient-to-r ${getBarColor(skill.level)} transition-all duration-700 ease-out`}
                style={{ width: `${skill.level}%` }}
              />
            </div>

            {/* Hover details */}
            {hoveredSkill === skill.name && (
              <div className="flex items-center gap-4 mt-2 text-[11px] text-slate-500">
                <span>Experience: {skill.experience}</span>
                <span>Category: {skill.category}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Summary */}
      <p className={`text-xs text-center ${theme === "dark" ? "text-slate-500" : "text-slate-400"}`}>
        Showing {filtered.length} skill{filtered.length !== 1 ? "s" : ""} • Average proficiency: {avgLevel}%
      </p>
    </div>
  );
};

export default SkillsGraph;
