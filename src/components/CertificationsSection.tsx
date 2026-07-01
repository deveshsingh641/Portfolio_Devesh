import React from "react";
import Tilt from "react-parallax-tilt";
import { Calendar } from "lucide-react";

interface CertificationItem {
  name: string;
  source: string;
  year?: string;
  badges?: string[];
  icon: React.ComponentType<{ size?: number }>;
}

interface CertificationsSectionProps {
  theme: string;
  visibleSections: Set<string>;
  certifications: CertificationItem[];
}

const CertificationsSection: React.FC<CertificationsSectionProps> = ({
  theme,
  visibleSections,
  certifications,
}) => {
  return (
    <section
      id="certifications"
      data-reveal
      className={`reveal-section ${
        visibleSections.has("certifications") ? "is-visible" : ""
      } py-24 relative ${
        theme === "dark"
          ? "bg-gradient-to-b from-slate-900/50 via-violet-900/20 to-slate-900/50"
          : "bg-gradient-to-b from-slate-100/50 via-violet-50/20 to-slate-100/50"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-xs font-mono uppercase tracking-[0.3em] text-cyan-400 mb-3">
            CREDENTIALS
          </p>
          <h2
            className={`text-4xl font-bold mb-3 ${theme === "dark" ? "text-white" : "text-slate-900"}`}
          >
            Certifications & Badges
          </h2>
          <p
            className={`font-medium text-lg ${
              theme === "dark" ? "text-cyan-300" : "text-cyan-700"
            }`}
          >
            Professional credentials & achievements
          </p>
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
                <div
                  className={`p-7 rounded-2xl shadow-lg border group h-full backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 ${
                    theme === "dark"
                      ? "bg-slate-950/75 border-cyan-300/35 hover:shadow-cyan-900/20"
                      : "bg-white border-slate-200 hover:shadow-slate-300/30"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 via-emerald-500 to-violet-500 rounded-lg flex items-center justify-center text-white shadow-lg shadow-cyan-400/70 shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                      <IconComponent size={32} />
                    </div>
                    <div className="flex-1">
                      <h3
                        className={`font-bold text-lg leading-tight mb-2 transition-colors ${
                          theme === "dark"
                            ? "text-slate-100 group-hover:text-cyan-300"
                            : "text-slate-900 group-hover:text-cyan-600"
                        }`}
                      >
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
    </section>
  );
};

export default CertificationsSection;
