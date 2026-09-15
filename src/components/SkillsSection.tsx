import React from "react";

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
  theme?: string;
  visibleSections: Set<string>;
  techCategories: TechCategory[];
}

const SkillsSection: React.FC<SkillsSectionProps> = ({
  theme = "dark",
  visibleSections,
  techCategories,
}) => {
  return (
    <section
      id="skills"
      data-reveal
      className={`reveal-section ${
        visibleSections.has("skills") ? "is-visible" : ""
      } py-28 px-6 ${theme === "light" ? "bg-neutral-900" : "bg-black"} text-white relative overflow-hidden`}
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header (Screenshot 7) */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-[11px] font-mono tracking-widest uppercase mb-4 border-neutral-800 bg-neutral-900/80 text-neutral-400">
            <span>TOOLS</span>
          </div>

          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-3">
            <span className="text-neutral-400">Software </span>
            <span className="text-white">Expertise</span>
          </h2>

          <p className="text-sm sm:text-base text-neutral-400">
            Mastery begins with knowing your tools inside out
          </p>
        </div>

        {/* 3-Column Categorized Cards (Screenshot 7) */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {techCategories.map((cat, idx) => (
            <div
              key={idx}
              className="p-7 rounded-[2rem] border border-neutral-800 bg-neutral-900/60 flex flex-col justify-between hover:border-neutral-700 transition-colors"
            >
              <div>
                <h3 className="font-display text-lg font-bold text-white mb-6">
                  {cat.title}
                </h3>

                <div className="flex flex-wrap gap-2.5">
                  {cat.techs.map((tech) => (
                    <div
                      key={tech.name}
                      className="px-3.5 py-2 rounded-xl border border-neutral-700/60 bg-neutral-800/80 hover:bg-neutral-800 flex items-center gap-2 text-xs font-medium text-neutral-200 transition-all hover:scale-105"
                    >
                      {tech.icon ? (
                        <img
                          src={tech.icon}
                          alt={tech.name}
                          className="w-4 h-4 object-contain"
                          loading="lazy"
                        />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-purple-400" />
                      )}
                      <span>{tech.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Circular Lens Indicator */}
        <div className="mt-16 flex justify-center">
          <a
            href="#certifications"
            className="w-10 h-10 rounded-full border border-neutral-800 bg-neutral-900/80 hover:border-purple-500/50 flex items-center justify-center text-purple-400 transition-all hover:scale-110 shadow-lg shadow-purple-500/10"
            aria-label="Scroll to Certifications"
          >
            <div className="w-4 h-4 rounded-full border-2 border-current flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-current" />
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
