import React from "react";
import { motion } from "framer-motion";
import { GraduationCap, Award, Calendar, MapPin, ChevronDown } from "lucide-react";
import { PORTFOLIO_DATA } from "../data/portfolio";

export const EducationSection: React.FC = () => {
  const { sectionLabel, headline, subline, items } = PORTFOLIO_DATA.education;

  return (
    <section id="education" className="relative py-24 md:py-32 px-4 bg-background scroll-mt-24 md:scroll-mt-32">
      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block rounded-full border border-border px-4 py-1.5 text-xs font-mono font-medium tracking-widest uppercase text-muted-foreground mb-4">
              {sectionLabel || "ACADEMICS"}
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display text-3xl sm:text-5xl md:text-6xl font-medium tracking-tight text-foreground mb-3"
          >
            {headline || "Education"}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto font-light"
          >
            {subline || "Academic background & qualifications"}
          </motion.p>
        </div>

        {/* 3-Card Grid Matching Resume Exactly */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {items.map((item, index) => (
            <motion.div
              key={`${item.degree}-${index}`}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group rounded-3xl border border-border bg-card/90 dark:bg-card/70 backdrop-blur-md p-6 sm:p-8 flex flex-col justify-between hover:border-foreground/30 hover:shadow-xl transition-all duration-300"
            >
              <div>
                {/* Top Meta: Period & Icon */}
                <div className="flex items-center justify-between gap-2 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-secondary/80 border border-border flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full border border-border/60">
                    <Calendar className="w-3.5 h-3.5" />
                    {item.period}
                  </span>
                </div>

                {/* Degree & Program */}
                <h3 className="font-display text-lg sm:text-xl font-semibold text-foreground tracking-tight mb-2 group-hover:text-purple-400 transition-colors">
                  {item.degree}
                </h3>

                {/* Affiliation / Board */}
                {item.affiliation && (
                  <p className="text-xs sm:text-sm text-muted-foreground mb-4 leading-relaxed font-light">
                    {item.affiliation}
                  </p>
                )}
              </div>

              {/* Bottom Details: Institution, Location & Score */}
              <div className="pt-6 border-t border-border/50 flex flex-col gap-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="font-medium text-foreground/90">{item.institution}</span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono">
                    <MapPin className="w-3 h-3 text-muted-foreground/70" />
                    {item.location}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                    Result / Score
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-semibold">
                    <Award className="w-3.5 h-3.5" />
                    {item.score}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Downward Scroll Indicator to About */}
        <div className="flex justify-center">
          <a
            href="#about"
            onClick={(e) => {
              e.preventDefault();
              const lenis = (window as any).__lenis;
              if (lenis) {
                lenis.scrollTo("#about", { offset: -70, duration: 1.1 });
              } else {
                document.querySelector("#about")?.scrollIntoView({ behavior: "smooth" });
              }
            }}
            aria-label="Scroll to About section"
            className="group flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-muted-foreground hover:text-foreground hover:border-purple-500/50 hover:bg-secondary transition-all duration-300 shadow-sm hover:scale-110 active:scale-95 cursor-pointer"
          >
            <ChevronDown className="h-5 w-5 transition-transform group-hover:translate-y-0.5 text-purple-400" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default EducationSection;
