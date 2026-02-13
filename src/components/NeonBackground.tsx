import React, { useEffect, useRef, useState } from 'react';

const NeonBackground: React.FC = () => {
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [trail, setTrail] = useState({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);
  const cursorRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const next = { x: e.clientX, y: e.clientY };
      cursorRef.current = next;
      setCursor(next);
    };

    const animateTrail = () => {
      setTrail((prev) => ({
        x: prev.x + (cursorRef.current.x - prev.x) * 0.14,
        y: prev.y + (cursorRef.current.y - prev.y) * 0.14,
      }));
      rafRef.current = requestAnimationFrame(animateTrail);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    rafRef.current = requestAnimationFrame(animateTrail);

    return () => {
      window.removeEventListener('mousemove', onMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute inset-0 bg-[linear-gradient(130deg,#040611_0%,#0a1024_45%,#060b1b_100%)]" />

      <div className="absolute inset-0 neon-grid opacity-60" />

      <div className="absolute -top-24 left-[8%] w-[30rem] h-[30rem] rounded-full blur-3xl bg-cyan-400/20 aurora-layer" />
      <div className="absolute top-[8%] right-[10%] w-[28rem] h-[28rem] rounded-full blur-3xl bg-violet-500/20 aurora-layer" />
      <div className="absolute -bottom-24 left-[30%] w-[32rem] h-[32rem] rounded-full blur-3xl bg-pink-500/18 aurora-layer" />

      <div className="absolute inset-0">
        <span className="particle absolute top-[18%] left-[14%] w-1.5 h-1.5 rounded-full bg-cyan-300/60 shadow-[0_0_20px_rgba(34,211,238,0.7)]" />
        <span className="particle absolute top-[32%] right-[22%] w-1 h-1 rounded-full bg-violet-300/70 shadow-[0_0_16px_rgba(168,85,247,0.8)]" />
        <span className="particle absolute bottom-[24%] left-[24%] w-1.5 h-1.5 rounded-full bg-pink-300/60 shadow-[0_0_18px_rgba(236,72,153,0.7)]" />
        <span className="particle absolute bottom-[34%] right-[30%] w-1 h-1 rounded-full bg-emerald-300/60 shadow-[0_0_14px_rgba(52,211,153,0.7)]" />
      </div>

      <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent animate-pulse" />
      <div className="absolute top-1/2 right-0 w-full h-px bg-gradient-to-r from-transparent via-violet-400/25 to-transparent animate-pulse" />
      <div className="absolute bottom-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-pink-400/25 to-transparent animate-pulse" />

      {/* Mouse reactive glow + trailing orb */}
      <div
        className="hidden md:block absolute w-72 h-72 rounded-full blur-3xl bg-cyan-400/18"
        style={{
          transform: `translate(${cursor.x - 144}px, ${cursor.y - 144}px)`,
        }}
      />
      <div
        className="hidden md:block absolute w-44 h-44 rounded-full blur-2xl bg-violet-400/20"
        style={{
          transform: `translate(${trail.x - 88}px, ${trail.y - 88}px)`,
        }}
      />
    </div>
  );
};

export default NeonBackground;
