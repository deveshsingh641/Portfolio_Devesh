import React, { useState, useCallback } from "react";
import Tilt from "react-parallax-tilt";

export interface HolographicTiltCardProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  borderRadius?: string;
  maxTilt?: number;
  perspective?: number;
  scale?: number;
  glowColor?: string;
  enableGlare?: boolean;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  role?: string;
  tabIndex?: number;
}

export const HolographicTiltCard: React.FC<HolographicTiltCardProps> = ({
  children,
  className = "",
  containerClassName = "",
  borderRadius = "rounded-3xl",
  maxTilt = 7,
  perspective = 1200,
  scale = 1.02,
  glowColor,
  enableGlare = true,
  style,
  onClick,
  onKeyDown,
  role,
  tabIndex,
}) => {
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });
  const [glareAngle, setGlareAngle] = useState(135);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setGlarePosition({ x, y });

    // Calculate dynamic refraction angle relative to center
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const deltaX = e.clientX - rect.left - centerX;
    const deltaY = e.clientY - rect.top - centerY;
    const rad = Math.atan2(deltaY, deltaX);
    const deg = (rad * (180 / Math.PI) + 90 + 360) % 360;
    setGlareAngle(deg);
  }, []);

  return (
    <Tilt
      tiltMaxAngleX={maxTilt}
      tiltMaxAngleY={maxTilt}
      perspective={perspective}
      scale={scale}
      transitionSpeed={1200}
      gyroscope={true}
      glareEnable={false}
      className={`h-full ${containerClassName}`}
      style={{ transformStyle: "preserve-3d" }}
    >
      <div
        role={role}
        tabIndex={tabIndex}
        onClick={onClick}
        onKeyDown={onKeyDown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseMove={handleMouseMove}
        className={`relative h-full overflow-hidden ${borderRadius} transition-shadow duration-500 ${className}`}
        style={{
          transformStyle: "preserve-3d",
          ...(glowColor && isHovered ? { boxShadow: `0 24px 60px -15px ${glowColor}` } : {}),
          ...style,
        }}
      >
        {/* Child Content */}
        {children}

        {/* Dynamic Holographic Prismatic Sheen Layer */}
        {enableGlare && (
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 z-30 transition-opacity duration-500 ${borderRadius}`}
            style={{
              opacity: isHovered ? 1 : 0,
              background: `linear-gradient(${glareAngle}deg, transparent 15%, rgba(255, 255, 255, 0.05) 35%, rgba(168, 85, 247, 0.18) 46%, rgba(6, 182, 212, 0.22) 50%, rgba(236, 72, 153, 0.18) 54%, rgba(255, 255, 255, 0.08) 65%, transparent 85%)`,
              mixBlendMode: "color-dodge",
            }}
          />
        )}

        {/* Dynamic Radial Spotlight Specular Glare */}
        {enableGlare && (
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 z-30 transition-opacity duration-300 ${borderRadius}`}
            style={{
              opacity: isHovered ? 0.45 : 0,
              background: `radial-gradient(circle 350px at ${glarePosition.x}% ${glarePosition.y}%, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0.08) 40%, transparent 80%)`,
              mixBlendMode: "overlay",
            }}
          />
        )}
      </div>
    </Tilt>
  );
};

export default HolographicTiltCard;
