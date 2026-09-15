import React from "react";
import { GraduationCap, Code2, Brain, Building2 } from "lucide-react";
import type { EducationItem } from "../types";

interface ExperienceSectionProps {
  theme: string;
  visibleSections: Set<string>;
  education?: EducationItem[];
}

const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  theme,
  visibleSections,
  education = [],
}) => {
  const experiences = [
    {
      company: education[0]?.school || "ABES Engineering College",
      role: education[0]?.degree || "B.Tech in Information Technology",
      period: education[0]?.year || "2022 – 2026",
      score: education[0]?.score || "CGPA: 8.0 / 10",
      icon: GraduationCap,
      accent: "from-purple-500 to-indigo-500",
    },
    {
      company: "Full-Stack Development",
      role: "React, Node.js, FastAPI & Next.js",
      period: "Production Engineering",
      score: "5+ Production Projects",
      icon: Code2,
      accent: "from-emerald-500 to-cyan-500",
    },
    {
      company: "AI & Distributed Systems",
      role: "ClassIntel AI & Agrisense",
      period: "RAG & Real-Time APIs",
      score: "FastAPI + Gemini + PyTorch",
      icon: Brain,
      accent: "from-violet-500 to-pink-500",
    },
    {
      company: "Sant Atulanand Convent School",
      role: "Intermediate (Class XII) & High School",
      period: "CBSE Board",
      score: "Distinction in Science & CS",
      icon: Building2,
      accent: "from-amber-500 to-orange-500",
    },
  ];

  return (
    <section
      id="experience"
      data-reveal
      className={`reveal-section ${
        visibleSections.has("experience") ? "is-visible" : ""
      } py-24 px-6 relative transition-colors duration-300 ${
        theme === "dark" ? "bg-black text-white" : "bg-neutral-50 text-neutral-900"
      }`}
    >
      <div className="max-w-6xl mx-auto text-center">
        {/* Section Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-[11px] font-mono tracking-widest uppercase mb-4 border-neutral-800 bg-neutral-900/80 text-neutral-400">
          <span>WHY ME?</span>
        </div>

        {/* Big Display Heading */}
        <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-3">
          Experience
        </h2>

        {/* Subtitle with bold count */}
        <p className="text-sm sm:text-base text-neutral-400 mb-14">
          Total <strong className="text-white font-semibold">3+ Years</strong> of Engineering & Full-Stack Development Journey
        </p>

        {/* Cards Carousel Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {experiences.map((exp, idx) => {
            const Icon = exp.icon;
            return (
              <div
                key={idx}
                className={`group p-6 rounded-3xl border text-left transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between ${
                  theme === "dark"
                    ? "bg-neutral-900/60 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-850"
                    : "bg-white border-neutral-200 hover:border-neutral-300 shadow-sm"
                }`}
              >
                <div>
                  <div className={`w-11 h-11 rounded-2xl bg-neutral-800 border border-neutral-700/60 flex items-center justify-center text-white mb-5 group-hover:scale-105 transition-transform`}>
                    <Icon size={20} className="text-purple-400" />
                  </div>
                  <h3 className="font-display text-lg font-bold mb-1 text-white group-hover:text-purple-400 transition-colors">
                    {exp.company}
                  </h3>
                  <p className="text-xs text-neutral-400 mb-4 leading-relaxed">
                    {exp.role}
                  </p>
                </div>

                <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between text-[11px] font-mono text-neutral-400">
                  <span>{exp.period}</span>
                  <span className="text-purple-400 font-medium">{exp.score}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Domain highlights statement */}
        <div className="max-w-3xl mx-auto text-center px-4">
          <p className="text-sm sm:text-base text-neutral-400 leading-relaxed">
            I've built systems across diverse industries such as{" "}
            <strong className="text-white font-semibold">Ed-Tech, Entertainment, E-Commerce, FinTech, and AI/ML</strong>.
            My strength lies in researching, architecting, and crafting user-centric systems that adapt seamlessly to different domains and user needs.
          </p>
        </div>

        {/* Bottom Circular Lens Indicator */}
        <div className="mt-16 flex justify-center">
          <a
            href="#projects"
            className="w-10 h-10 rounded-full border border-neutral-800 bg-neutral-900/80 hover:border-purple-500/50 flex items-center justify-center text-purple-400 transition-all hover:scale-110 shadow-lg shadow-purple-500/10"
            aria-label="Scroll to Projects"
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

export default ExperienceSection;
