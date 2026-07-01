import React from "react";
import { Download, GraduationCap, Calendar, Award } from "lucide-react";
import Tilt from "react-parallax-tilt";

interface EducationItem {
  degree: string;
  school: string;
  year: string;
  score: string;
}

interface AboutSectionProps {
  theme: string;
  visibleSections: Set<string>;
  scrollToSection: (sectionId: string) => void;
  navigate: (to: string) => void;
  education: EducationItem[];
  isMobile: boolean;
  handleMagneticMove?: (e: React.MouseEvent<HTMLElement>) => void;
  handleMagneticLeave?: (e: React.MouseEvent<HTMLElement>) => void;
}

const AboutSection: React.FC<AboutSectionProps> = ({
  theme,
  visibleSections,
  scrollToSection,
  navigate,
  education,
  isMobile,
  handleMagneticMove = (e) => {
    if (isMobile) return;
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate3d(${x * 0.16}px, ${y * 0.16}px, 0)`;
  },
  handleMagneticLeave = (e) => {
    e.currentTarget.style.transform = "translate3d(0, 0, 0)";
  },
}) => {
  return (
    <section
      id="about"
      data-reveal
      className={`reveal-section ${
        visibleSections.has("about") ? "is-visible" : ""
      } py-28 backdrop-blur-sm relative px-6 md:px-20 transition-colors duration-300 overflow-hidden ${
        theme === "dark"
          ? "bg-gradient-to-b from-slate-900/40 via-violet-900/20 to-slate-900/40"
          : "bg-gradient-to-b from-slate-100/60 via-violet-100/20 to-slate-100/60"
      }`}
    >
      {/* Background decorations */}
      <div className="absolute top-20 -left-40 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 -right-40 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Label */}
        <p className="text-xs font-mono uppercase tracking-[0.3em] text-emerald-400 mb-6 text-center">
          ABOUT_ME
        </p>

        {/* Big Heading */}
        <div className="text-center mb-16">
          <h2
            className={`text-4xl md:text-6xl font-black leading-tight ${
              theme === "dark" ? "text-slate-100" : "text-slate-900"
            }`}
          >
            BUILDING{" "}
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent">
              SCALABLE
            </span>
            <br />
            <span className={theme === "dark" ? "text-slate-100" : "text-slate-900"}>
              SYSTEMS.
            </span>
          </h2>
        </div>

        {/* Main content grid */}
        <div className="grid lg:grid-cols-5 gap-12 items-start">
          {/* Left column - Bio + Stats (3 cols) */}
          <div className="lg:col-span-3 space-y-8">
            {/* Bio intro */}
            <div className="space-y-5">
              <p
                className={`text-xl md:text-2xl font-light leading-relaxed ${
                  theme === "dark" ? "text-slate-300" : "text-slate-600"
                }`}
              >
                I'm{" "}
                <span className={`font-semibold ${theme === "dark" ? "text-slate-100" : "text-slate-900"}`}>
                  Devesh Singh
                </span>
                . Full-Stack Developer crafting{" "}
                <span
                  className={`font-medium ${
                    theme === "dark" ? "text-emerald-400" : "text-emerald-600"
                  }`}
                >
                  robust, production-ready applications
                </span>
                .
              </p>
              <p
                className={`text-base leading-relaxed ${
                  theme === "dark" ? "text-slate-400" : "text-slate-600"
                }`}
              >
                Currently pursuing B.Tech in IT at{" "}
                <span
                  className={`font-semibold ${
                    theme === "dark" ? "text-violet-300" : "text-violet-600"
                  }`}
                >
                  ABES Engineering College
                </span>
                , I focus on building applications that are not just functional, but intuitive and
                scalable. My passion lies in full-stack engineering — leveraging modern technologies
                to turn complex logic into user-friendly reality.
              </p>
              <p
                className={`text-base leading-relaxed ${
                  theme === "dark" ? "text-slate-400" : "text-slate-600"
                }`}
              >
                When I'm not debugging, I'm refining my DSA skills on LeetCode or exploring new
                frameworks and modern tech stacks. I'm eager to join a forward-thinking team where
                I can deploy my technical expertise to solve real-world challenges.
              </p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4 pt-2">
              {[
                { value: "5+", label: "PROJECTS" },
                { value: "4+", label: "CERTIFICATIONS" },
                { value: "∞", label: "ALWAYS LEARNING" },
              ].map(({ value, label }) => (
                <div
                  key={label}
                  className={`group text-center py-5 rounded-xl border backdrop-blur-sm transition-all duration-300 ${
                    theme === "dark"
                      ? "border-slate-700/40 bg-slate-900/50 hover:border-emerald-500/40 hover:bg-slate-800/40"
                      : "border-slate-200 bg-white/80 hover:border-emerald-400/40 hover:bg-slate-50"
                  }`}
                >
                  <div className="text-3xl md:text-4xl font-black text-emerald-400 group-hover:scale-110 transition-transform duration-300">
                    {value}
                  </div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mt-1">
                    {label}
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => scrollToSection("contact")}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-900 font-bold rounded-lg hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 hover:-translate-y-0.5 text-sm"
              >
                Get in Touch
              </button>

              <a
                href="/FINAL_RESUME_DEVESH.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className={`px-6 py-3 border font-semibold rounded-lg transition-all duration-300 hover:-translate-y-0.5 text-sm flex items-center gap-2 ${
                  theme === "dark"
                    ? "border-slate-700 text-slate-300 hover:border-cyan-300/50 hover:text-cyan-300"
                    : "border-slate-200 text-slate-600 hover:border-violet-300/50 hover:text-violet-600"
                }`}
              >
                <Download size={16} /> Download PDF
              </a>
            </div>
          </div>

          {/* Right column - Profile Image (2 cols) */}
          <div className="lg:col-span-2 flex flex-col items-center">
            <Tilt
              tiltMaxAngleX={10}
              tiltMaxAngleY={10}
              perspective={1200}
              transitionSpeed={1000}
              scale={1.03}
              tiltEnable={!isMobile}
              glareEnable={true}
              glareMaxOpacity={0.15}
            >
              <div className="relative">
                {/* Image container */}
                <div className="w-[260px] md:w-[320px] rounded-2xl overflow-hidden shadow-2xl border border-slate-700/40 bg-gradient-to-br from-violet-600/20 via-emerald-500/20 to-cyan-400/20 p-[2px]">
                  <div className="rounded-2xl overflow-hidden bg-slate-950">
                    <img
                      src="/profile.jpg"
                      alt="Devesh Singh"
                      className="w-full h-auto object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </div>

                {/* Location badge - top left */}
                <div className="absolute -top-3 -left-3 bg-slate-900/95 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/50 shadow-lg flex items-center gap-1.5">
                  <span className="text-lg">🇮🇳</span>
                  <span className="text-xs font-semibold text-slate-300">India</span>
                </div>

                {/* Available badge - bottom right */}
                <div className="absolute -bottom-3 -right-3 bg-slate-900/95 backdrop-blur-md px-4 py-2 rounded-lg border border-emerald-500/30 shadow-lg flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <span className="text-xs font-bold text-emerald-300">Available</span>
                </div>
              </div>
            </Tilt>

            {/* Mini terminal below image */}
            <div className="mt-8 w-full max-w-[320px]">
              <div className="rounded-lg border border-slate-700/50 bg-[#1e1e2e] overflow-hidden shadow-xl">
                <div className="flex items-center gap-1.5 px-3 py-2 bg-[#181825] border-b border-slate-700/40">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/70"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/70"></span>
                  <span className="text-[10px] font-mono text-slate-500 ml-2">terminal</span>
                </div>
                <div className="px-4 py-3 font-mono text-xs space-y-1">
                  <p className="text-slate-500">
                    <span className="text-emerald-400">➜</span> <span className="text-cyan-400">~</span>{" "}
                    <span className="text-slate-300">cat interests.txt</span>
                  </p>
                  <p className="text-slate-400">🎯 Full-Stack Development</p>
                  <p className="text-slate-400">💻 Web Development</p>
                  <p className="text-slate-400">📱 App Development</p>
                  <p className="text-slate-400">🧠 DSA & Problem Solving</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Education Section */}
        <div className="mt-20">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-emerald-500 flex items-center justify-center shadow-lg">
              <GraduationCap size={20} className="text-white" />
            </div>
            <div>
              <h3
                className={`text-2xl font-bold ${
                  theme === "dark" ? "text-slate-100" : "text-slate-900"
                }`}
              >
                Education
              </h3>
              <p className="text-xs font-mono text-slate-500 uppercase tracking-wider">
                Academic Journey
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {education.map((edu, index) => (
              <div
                key={index}
                className={`group relative p-6 rounded-xl border backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 ${
                  theme === "dark"
                    ? "border-slate-700/40 bg-slate-900/50 hover:border-emerald-500/40 hover:bg-slate-800/40"
                    : "border-slate-200 bg-white/80 hover:border-emerald-400/40 hover:bg-slate-50"
                }`}
              >
                {/* Number badge */}
                <span className="absolute top-4 right-4 text-[10px] font-mono text-emerald-500/40 font-bold">
                  {String(index + 1).padStart(2, "0")}
                </span>

                {/* Year badge */}
                <div className="inline-flex px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-bold mb-4">
                  <Calendar size={12} className="mr-1.5" />
                  {edu.year}
                </div>

                <h4
                  className={`text-base font-bold mb-1.5 group-hover:text-emerald-400 transition-colors leading-snug ${
                    theme === "dark" ? "text-slate-200" : "text-slate-800"
                  }`}
                >
                  {edu.degree}
                </h4>
                <p className="text-sm text-slate-400 mb-3">{edu.school}</p>

                {/* Score */}
                <div className="flex items-center gap-2 mt-auto">
                  <Award size={14} className="text-emerald-400" />
                  <span className="text-sm font-bold text-emerald-300">{edu.score}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Philosophy / What Drives Me */}
        <div className="mt-20">
          <div className="text-center mb-10">
            <p className="text-xs font-mono uppercase tracking-[0.3em] text-emerald-400 mb-3">
              PHILOSOPHY
            </p>
            <h3
              className={`text-3xl md:text-4xl font-black ${
                theme === "dark" ? "text-slate-100" : "text-slate-900"
              }`}
            >
              CODE THAT{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                SCALES
              </span>
              .
            </h3>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
            {[
              {
                num: "01",
                title: "Clean Architecture",
                desc: "Readable, maintainable code following SOLID principles. Every module has a single responsibility.",
                icon: "🏗️",
              },
              {
                num: "02",
                title: "Performance First",
                desc: "Optimized queries, efficient algorithms, lazy loading. Built to handle scale.",
                icon: "⚡",
              },
              {
                num: "03",
                title: "Data-Driven",
                desc: "Every decision backed by data. From model metrics to user analytics, numbers guide the way.",
                icon: "📊",
              },
              {
                num: "04",
                title: "Ship Fast",
                desc: "Automated CI/CD pipelines. From commit to production in minutes, not hours.",
                icon: "🚀",
              },
            ].map(({ num, title, desc, icon }) => (
              <div
                key={num}
                className={`group relative p-6 rounded-xl border backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 ${
                  theme === "dark"
                    ? "border-slate-700/40 bg-slate-900/50 hover:border-emerald-500/40 hover:bg-slate-800/40"
                    : "border-slate-200 bg-white/80 hover:border-emerald-400/40 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl">{icon}</span>
                  <span className="text-[10px] font-mono text-emerald-500/40 font-bold">{num}</span>
                </div>
                <h4
                  className={`text-sm font-bold mb-2 group-hover:text-emerald-300 transition-colors ${
                    theme === "dark" ? "text-slate-200" : "text-slate-800"
                  }`}
                >
                  {title}
                </h4>
                <p className="text-xs leading-relaxed text-slate-500">{desc}</p>
              </div>
            ))}
          </div>

          {/* Quote */}
          <div className="mt-12 max-w-2xl mx-auto text-center">
            <blockquote className="relative">
              <span className="absolute -top-4 -left-2 text-5xl text-emerald-500/20 font-serif">
                "
              </span>
              <p
                className={`text-lg md:text-xl italic leading-relaxed px-8 ${
                  theme === "dark" ? "text-slate-300" : "text-slate-600"
                }`}
              >
                Code is poetry, debugging is the editing process.
              </p>
              <footer className="mt-3 text-sm text-slate-500">— My coding mantra</footer>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
