import React from "react";
import Tilt from "react-parallax-tilt";
import { Calendar } from "lucide-react";
import type { CertificationItem } from "../types";

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
      } py-28 px-6 relative transition-colors duration-300 ${
        theme === "dark" ? "bg-neutral-900/20" : "bg-neutral-100/30"
      }`}
    >
      <div className="max-w-6xl mx-auto">
        {/* Arslan-style Section Header */}
        <div className="mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono tracking-wider uppercase border mb-3 border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400">
            <span>WALL OF FAME</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight">
            <span className="text-neutral-400 dark:text-neutral-500">Certifications & </span>
            <span className="text-neutral-900 dark:text-white">Recognitions</span>
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 mt-2 max-w-xl">
            Verified professional certifications, coursework milestones, and technical credentials.
          </p>
        </div>

        {/* Certifications Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {certifications.map((cert, index) => {
            const IconComponent = cert.icon;
            return (
              <Tilt
                key={index}
                tiltMaxAngleX={3}
                tiltMaxAngleY={3}
                scale={1.01}
                glareEnable={true}
                glareMaxOpacity={0.08}
                className="h-full"
              >
                <div
                  className={`group p-6 sm:p-7 rounded-3xl border transition-all duration-300 flex flex-col justify-between h-full hover:shadow-xl ${
                    theme === "dark"
                      ? "bg-neutral-900/60 border-neutral-800 hover:border-neutral-700 hover:shadow-black/40"
                      : "bg-white border-neutral-200 hover:border-neutral-300 hover:shadow-neutral-200/60"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-neutral-900 dark:text-white shrink-0 group-hover:scale-105 transition-transform">
                      <IconComponent size={24} className="text-emerald-500" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-display text-lg sm:text-xl font-bold leading-snug mb-2 text-neutral-900 dark:text-white group-hover:text-emerald-500 transition-colors">
                        {cert.name}
                      </h3>

                      <div className="flex flex-wrap items-center gap-2 mb-4">
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">
                          {cert.source}
                        </span>
                        {cert.year && (
                          <span className="px-2.5 py-1 rounded-full text-xs font-mono text-neutral-500 border border-neutral-200 dark:border-neutral-800 flex items-center gap-1">
                            <Calendar size={11} /> {cert.year}
                          </span>
                        )}
                      </div>

                      {cert.badges && (
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {cert.badges.map((badge, badgeIndex) => (
                            <span
                              key={badgeIndex}
                              className="px-2.5 py-0.5 rounded-md text-[11px] font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
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
