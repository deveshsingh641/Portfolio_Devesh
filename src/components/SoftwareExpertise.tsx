import React, { useState } from "react";
import { motion } from "framer-motion";
import { Code2, Brain, Layout, Server, Database, Wrench } from "lucide-react";
import { PORTFOLIO_DATA } from "../data/portfolio";
import { TECH_META } from "./TechLogos";

const CATEGORY_CONFIG: Record<
  string,
  { icon: React.ReactNode; color: string; glow: string; label: string }
> = {
  Languages: {
    icon: <Code2 className="w-5 h-5" />,
    color: "#A855F7",
    glow: "rgba(168, 85, 247, 0.35)",
    label: "Core Syntax & Foundations",
  },
  "Core Concepts": {
    icon: <Brain className="w-5 h-5" />,
    color: "#6366F1",
    glow: "rgba(99, 102, 241, 0.35)",
    label: "Algorithms & Architecture",
  },
  Frontend: {
    icon: <Layout className="w-5 h-5" />,
    color: "#06B6D4",
    glow: "rgba(6, 182, 212, 0.35)",
    label: "UI, Styling & Performance",
  },
  Backend: {
    icon: <Server className="w-5 h-5" />,
    color: "#10B981",
    glow: "rgba(16, 185, 129, 0.35)",
    label: "APIs, Security & Workflows",
  },
  Databases: {
    icon: <Database className="w-5 h-5" />,
    color: "#F59E0B",
    glow: "rgba(245, 158, 11, 0.35)",
    label: "Data Modeling & Queries",
  },
  Tools: {
    icon: <Wrench className="w-5 h-5" />,
    color: "#EC4899",
    glow: "rgba(236, 72, 153, 0.35)",
    label: "DevOps, Git & API Testing",
  },
};

export const SoftwareExpertise: React.FC = () => {
  const { tools } = PORTFOLIO_DATA;
  const [hoveredTool, setHoveredTool] = useState<string | null>(null);

  return (
    <section id="expertise" className="relative py-24 md:py-32 px-4 bg-background scroll-mt-24 md:scroll-mt-32">
      {/* Anchor alias for #tools backwards compatibility */}
      <span id="tools" className="sr-only pointer-events-none" aria-hidden="true" />
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
              TECHNICAL EXPERTISE
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display text-3xl sm:text-5xl md:text-6xl font-medium tracking-tight mb-3"
          >
            <span className="text-muted-foreground">Software </span>
            <span className="text-foreground">Expertise</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-muted-foreground text-sm sm:text-base font-light max-w-xl mx-auto"
          >
            Curated toolkit and technical proficiencies verified from engineering production software
          </motion.p>
        </div>

        {/* 6-Category Grid with Glowing Tech Badges */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((group, idx) => {
            const config = CATEGORY_CONFIG[group.category] || {
              icon: <Code2 className="w-5 h-5" />,
              color: "#A855F7",
              glow: "rgba(168, 85, 247, 0.35)",
              label: "Engineering Domain",
            };

            return (
              <motion.div
                key={group.category}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="group relative rounded-3xl border border-border bg-card/60 backdrop-blur-md p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:border-foreground/30 hover:shadow-2xl hover:bg-card/80"
              >
                {/* Subtle top ambient glow line */}
                <div
                  className="absolute top-0 left-8 right-8 h-px opacity-30 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${config.color}, transparent)`,
                  }}
                />

                <div>
                  {/* Category Header */}
                  <div className="flex items-center justify-between gap-3 border-b border-border/50 pb-4 mb-5">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110"
                        style={{
                          backgroundColor: `${config.color}15`,
                          border: `1px solid ${config.color}35`,
                          color: config.color,
                          boxShadow: `0 0 14px ${config.glow}`,
                        }}
                      >
                        {config.icon}
                      </div>
                      <div>
                        <h3 className="font-display text-base sm:text-lg font-semibold text-foreground tracking-tight">
                          {group.category}
                        </h3>
                        <p className="text-[11px] text-muted-foreground font-light">
                          {config.label}
                        </p>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground bg-secondary/60 px-2.5 py-1 rounded-full border border-border/60">
                      {group.items.length} skills
                    </span>
                  </div>

                  {/* Skills Badges with Logo and Ambient Glow */}
                  <div className="flex flex-wrap gap-2.5">
                    {group.items.map((tool) => {
                      const meta = TECH_META[tool.name];
                      const isHovered = hoveredTool === tool.name;

                      return (
                        <motion.div
                          key={`${group.category}-${tool.name}`}
                          onMouseEnter={() => setHoveredTool(tool.name)}
                          onMouseLeave={() => setHoveredTool(null)}
                          whileHover={{ y: -2, scale: 1.02 }}
                          transition={{ duration: 0.18 }}
                          className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl border border-border bg-secondary/40 text-foreground/90 transition-all duration-200 cursor-default"
                          style={{
                            boxShadow: isHovered && meta ? `0 0 14px ${meta.glow}` : "none",
                            borderColor: isHovered && meta ? meta.color : undefined,
                            backgroundColor: isHovered && meta ? `${meta.color}12` : undefined,
                          }}
                        >
                          {/* Tech SVG Logo */}
                          {meta && (
                            <span
                              className="shrink-0 transition-transform duration-200"
                              style={{
                                filter: isHovered
                                  ? `drop-shadow(0 0 6px ${meta.glow})`
                                  : "none",
                              }}
                            >
                              {meta.icon}
                            </span>
                          )}

                          <span className="text-xs font-medium tracking-tight">
                            {tool.name}
                          </span>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SoftwareExpertise;
