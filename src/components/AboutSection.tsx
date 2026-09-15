import React from "react";
import { Download } from "lucide-react";
import Tilt from "react-parallax-tilt";
import { EducationItem } from "../types";
import { trackResumeAction } from "../lib/analytics";

interface AboutSectionProps {
  theme: string;
  visibleSections: Set<string>;
  scrollToSection: (sectionId: string) => void;
  education: EducationItem[];
  isMobile: boolean;
  navigate?: (to: string) => void;
}

const AboutSection: React.FC<AboutSectionProps> = ({
  theme,
  visibleSections,
  scrollToSection,
  isMobile,
}) => {
  return (
    <section
      id="about"
      data-reveal
      className={`reveal-section ${
        visibleSections.has("about") ? "is-visible" : ""
      } py-28 px-6 transition-colors duration-300 relative overflow-hidden ${
        theme === "dark" ? "bg-black text-white" : "bg-neutral-900 text-white"
      }`}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-10 sm:gap-14 items-center">
          {/* Left Column: B&W Portrait Photo (Screenshot 6) */}
          <div className="lg:col-span-5 flex justify-center">
            <Tilt
              tiltMaxAngleX={4}
              tiltMaxAngleY={4}
              scale={1.01}
              tiltEnable={!isMobile}
              glareEnable={false}
              className="w-full max-w-md"
            >
              <div className="relative rounded-[2rem] overflow-hidden border border-neutral-800 bg-neutral-900 shadow-2xl">
                <img
                  src="/profile.jpg"
                  alt="Devesh Singh"
                  className="w-full h-auto object-cover grayscale contrast-110 brightness-95"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
              </div>
            </Tilt>
          </div>

          {/* Right Column: Bio + 4 Stats Grid (Screenshot 6) */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight leading-[1.1] text-neutral-300">
                I am an Engineer <br />
                Turned <br />
                Into a <strong className="font-bold text-white font-display">Full-Stack Developer</strong>
              </h2>
            </div>

            <p className="text-sm sm:text-base leading-relaxed text-neutral-400 max-w-xl">
              With a foundation in engineering at ABES, I bring problem-solving, systems thinking, and analytical skills into building full-stack applications. My approach blends technical precision with modern engineering to craft solutions that are functional, intuitive, and scalable. My goal is to build software products that not only work seamlessly but also deliver intuitive, meaningful experiences.
            </p>

            {/* 4 Stats Grid matching Screenshot 6 */}
            <div className="grid grid-cols-2 gap-8 pt-4 border-t border-neutral-800/80">
              <div>
                <p className="text-xs text-neutral-400 font-mono uppercase tracking-wider mb-1">
                  Academic Performance
                </p>
                <p className="font-display text-4xl sm:text-5xl font-bold text-white">
                  8.0 <span className="text-lg text-neutral-500 font-normal">CGPA</span>
                </p>
              </div>

              <div>
                <p className="text-xs text-neutral-400 font-mono uppercase tracking-wider mb-1">
                  Tech Tools & Domains
                </p>
                <p className="font-display text-4xl sm:text-5xl font-bold text-white">
                  20+
                </p>
              </div>

              <div>
                <p className="text-xs text-neutral-400 font-mono uppercase tracking-wider mb-1">
                  Projects Completed
                </p>
                <p className="font-display text-4xl sm:text-5xl font-bold text-white">
                  5+
                </p>
              </div>

              <div>
                <p className="text-xs text-neutral-400 font-mono uppercase tracking-wider mb-1">
                  Hours of Engineering
                </p>
                <p className="font-display text-4xl sm:text-5xl font-bold text-white">
                  2,000+
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => scrollToSection("contact")}
                className="px-6 py-2.5 rounded-full bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-colors shadow-sm"
              >
                Get in Touch
              </button>
              <a
                href="/FINAL_RESUME_DEVESH.pdf"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackResumeAction("download", "about_section")}
                className="px-5 py-2.5 rounded-full border border-neutral-700 text-neutral-300 font-medium text-xs hover:border-neutral-500 hover:text-white transition-all flex items-center gap-1.5"
              >
                <Download size={13} /> Download Resume
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Circular Lens Indicator */}
        <div className="mt-16 flex justify-center">
          <a
            href="#skills"
            className="w-10 h-10 rounded-full border border-neutral-800 bg-neutral-900/80 hover:border-purple-500/50 flex items-center justify-center text-purple-400 transition-all hover:scale-110 shadow-lg shadow-purple-500/10"
            aria-label="Scroll to Skills"
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

export default AboutSection;
