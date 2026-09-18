import React from "react";
import { ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { PORTFOLIO_DATA } from "../data/portfolio";
import { HolographicTiltCard } from "./HolographicTiltCard";

export const CertificationsWall: React.FC = () => {
  const { certifications } = PORTFOLIO_DATA;

  return (
    <section id="certifications" className="py-24 md:py-32 px-4 scroll-mt-24 md:scroll-mt-32">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block rounded-full border border-border px-4 py-1.5 text-[10px] font-medium tracking-[0.2em] uppercase text-muted-foreground mb-4">
            WALL OF FAME
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-medium mb-3 tracking-tight">
            <span className="text-foreground">Certifications </span>
            <span className="text-muted-foreground">& Recognitions</span>
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base font-light">
            Continuous mastery that powers architectural rigor
          </p>
        </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map((cert, idx) => (
            <motion.div
              key={cert.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="h-full"
            >
              <HolographicTiltCard
                borderRadius="rounded-2xl"
                maxTilt={8}
                perspective={1000}
                scale={1.03}
                glowColor="rgba(168, 85, 247, 0.2)"
                className="group rounded-2xl border border-border bg-card p-0 flex flex-col overflow-hidden hover:border-purple-500/40 transition-all duration-300 shadow-sm hover:shadow-xl h-full"
              >
                {/* Preview Image */}
                <div
                  className="aspect-[16/10] overflow-hidden bg-secondary/30 relative border-b border-border flex items-center justify-center p-2"
                  style={{ transform: "translateZ(16px)" }}
                >
                  <img
                    src={cert.image}
                    alt={cert.title}
                    loading="lazy"
                    className={`w-full h-full transition-transform duration-500 group-hover:scale-105 ${
                      cert.image.endsWith(".png")
                        ? "object-contain p-2 drop-shadow-xl"
                        : "object-cover"
                    }`}
                    onError={(e) => {
                      // fallback if cert image fails
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>

                {/* Card Body */}
                <div
                  className="p-6 flex flex-col gap-4 flex-grow justify-between"
                  style={{ transform: "translateZ(14px)" }}
                >
                  <div className="flex flex-col gap-1.5">
                    <h3 className="font-display text-base sm:text-lg font-medium text-foreground tracking-tight leading-snug group-hover:text-purple-300 transition-colors">
                      {cert.title}
                    </h3>
                    <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                      {cert.issuer}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {cert.date}
                    </p>
                  </div>

                  <a
                    href={cert.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View credentials for ${cert.title} on ${cert.issuer} (opens in a new tab)`}
                    className="mt-2 flex items-center justify-center gap-2 rounded-full border border-border py-2 text-xs sm:text-sm font-medium text-foreground transition-colors hover:bg-secondary/80 hover:border-purple-500/40 active:scale-95 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                  >
                    <span>See Credentials</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </HolographicTiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
