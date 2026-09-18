import React from "react";
import { motion } from "framer-motion";

interface CosmicCurveHorizonProps {
  className?: string;
  isDark?: boolean;
}

const EASING: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface CurveRingProps {
  color: string;
  size: string;
  initialOffset?: string;
  blur?: number;
  boxShadow?: string;
  delay: number;
}

const CurveRing: React.FC<CurveRingProps> = ({
  color,
  size,
  initialOffset,
  blur,
  boxShadow,
  delay,
}) => {
  const scaleVal = parseFloat(size) / 100;
  // Moves upwards (-Y) to meet the horizon edge, creating the authentic glow-up bloom
  const initialY = initialOffset
    ? `-${Math.abs(parseFloat(initialOffset) - 50)}%`
    : undefined;

  return (
    <motion.div
      aria-hidden="true"
      className="absolute inset-0 rounded-[100%]"
      style={{
        scale: scaleVal,
        background: color,
        willChange: "transform",
        ...(blur !== undefined && { filter: `blur(${blur}px)` }),
        ...(boxShadow && { boxShadow }),
      }}
      initial={initialY ? { y: initialY } : false}
      animate={initialY ? { y: 0 } : undefined}
      transition={{ duration: 2, ease: EASING, delay }}
    />
  );
};

export const CosmicCurveHorizon: React.FC<CosmicCurveHorizonProps> = ({
  className = "",
  isDark = true,
}) => {
  return (
    <motion.div
      className={`absolute w-full h-full pointer-events-none ${className}`}
      style={{ isolation: "isolate", willChange: "transform, opacity" }}
      initial={{ y: "-100%", scaleY: 1.35, opacity: 0 }}
      animate={{ y: "-50%", scaleY: 1, opacity: 1 }}
      transition={{ duration: 1.5, ease: EASING }}
    >
      {/* 1. Luminous White Horizon Edge with Radiant Violet & Ultraviolet Bloom */}
      <CurveRing
        color={isDark ? "#FFFFFF" : "#7c3aed"}
        size="132%"
        boxShadow={
          isDark
            ? "0px -4px 28px 0px rgba(255,255,255,0.95), 0px -8px 48px 0px rgba(168,85,247,0.85), 0px -16px 80px 0px rgba(124,58,237,0.5)"
            : "0px -4px 28px 0px rgba(147,51,234,0.6), 0px -8px 48px 0px rgba(168,85,247,0.4)"
        }
        delay={0.8}
      />

      {/* 2. Electric Violet Aura Ring */}
      <CurveRing
        color="#A558FB"
        size="120%"
        initialOffset="10%"
        blur={31}
        delay={0.4}
      />

      {/* 3. Deep Ultraviolet Core Ring */}
      <CurveRing
        color="#4922E5"
        size="124%"
        initialOffset="10%"
        blur={21}
        delay={0}
      />

      {/* 4. Cosmic Outer Bloom Ring */}
      <CurveRing
        color={isDark ? "rgba(168,85,247,0.3)" : "rgba(168,85,247,0.15)"}
        size="128%"
        initialOffset="15%"
        blur={42}
        delay={0.2}
      />

      {/* 5. Background blend cut */}
      <CurveRing
        color="hsl(var(--background))"
        size="120%"
        initialOffset="10%"
        blur={51}
        delay={0}
      />
    </motion.div>
  );
};
