import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { PORTFOLIO_DATA } from "../data/portfolio";

const AnimatedCounter: React.FC<{
  value: number;
  suffix?: string;
  duration?: number;
}> = ({ value, suffix = "", duration = 1.6 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    let animationFrameId: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(easeProgress * value));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isInView, value, duration]);

  const formatted = (value >= 1900 && value <= 2100) ? count.toString() : count.toLocaleString();

  return (
    <span ref={ref}>
      {formatted}
      {suffix}
    </span>
  );
};

export const AboutSection: React.FC<any> = () => {
  const { badge, title, titleHighlight, description, stats, image } =
    PORTFOLIO_DATA.about;

  return (
    <section id="about" className="relative py-24 md:py-32 px-4 scroll-mt-24 md:scroll-mt-32">
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Left Column: Portrait */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex justify-center"
          >
            <div className="w-full max-w-md aspect-[4/5] rounded-3xl overflow-hidden border border-border bg-card shadow-2xl relative group">
              <img
                src={image}
                alt="Devesh Singh — Full-Stack & Systems Engineer"
                className="w-full h-full object-cover grayscale contrast-105 transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
            </div>
          </motion.div>

          {/* Right Column: Bio & Stats */}
          <div className="flex flex-col gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="inline-block rounded-full border border-border px-4 py-1.5 text-xs font-medium tracking-widest uppercase text-muted-foreground mb-6">
                {badge}
              </span>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium leading-tight mb-6 tracking-tight">
                <span className="text-muted-foreground">{title} </span>
                <br />
                <span className="text-foreground font-semibold">
                  {titleHighlight}
                </span>
              </h2>
              <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
                {description}
              </p>
            </motion.div>

            {/* 4 Animated Counter Stats */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-8 pt-4 border-t border-border/60">
              {stats.map((st, i) => (
                <motion.div
                  key={st.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.15 + i * 0.08 }}
                >
                  <p className="text-xs sm:text-sm font-mono text-muted-foreground uppercase tracking-wider mb-1">
                    {st.label}
                  </p>
                  <p className="text-3xl sm:text-4xl md:text-5xl font-display font-medium text-foreground tracking-tight">
                    <AnimatedCounter value={st.value} suffix={st.suffix} />
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
