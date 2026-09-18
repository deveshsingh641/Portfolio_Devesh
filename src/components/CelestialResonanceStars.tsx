import React, { useEffect, useRef } from "react";

interface CelestialResonanceStarsProps {
  isDark?: boolean;
  particleCount?: number;
  particleSpeed?: number;
  particleLife?: number;
  trailOpacity?: number;
  hueSpeed?: number;
  canvasGlow?: number;
  className?: string;
}

export const CelestialResonanceStars: React.FC<CelestialResonanceStarsProps> = ({
  isDark = true,
  particleCount = 900,
  particleSpeed = 0.045,
  particleLife = 380,
  trailOpacity = isDark ? 0.12 : 0.18,
  hueSpeed = 0.08,
  canvasGlow = isDark ? 12 : 6,
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    let baseHue = 210;
    let animId: number;

    const magnet = {
      x: width / 2,
      y: height,
    };

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      age: number;
      life: number;
      reset: () => void;
      update: () => void;
      draw: () => void;
    }

    function createParticle(): Particle {
      let px = Math.random() * width;
      let py = Math.random() * height;
      let vx = 0;
      let vy = 0;
      let age = 0;
      let life = Math.random() * particleLife;

      const reset = () => {
        px = Math.random() * width;
        py = Math.random() * height;
        vx = 0;
        vy = 0;
        age = 0;
        life = Math.random() * particleLife;
      };

      return {
        get x() {
          return px;
        },
        get y() {
          return py;
        },
        vx,
        vy,
        age,
        life,
        reset,
        update: () => {
          age++;
          if (age > life) reset();

          const dx = magnet.x - px;
          const dy = magnet.y - py;
          const angle = Math.atan2(dy, dx) + Math.PI / 2;

          vx += Math.cos(angle) * particleSpeed;
          vy += Math.sin(angle) * particleSpeed;

          vx *= 0.97;
          vy *= 0.97;

          px += vx;
          py += vy;

          if (px < -10 || px > width + 10 || py < -10 || py > height + 10) {
            reset();
          }
        },
        draw: () => {
          const progress = 1 - age / life;
          const hue = baseHue + (px / width) * 50;

          ctx!.beginPath();
          if (isDark) {
            ctx!.fillStyle = `hsla(${hue}, 100%, 75%, ${progress * 0.75})`;
          } else {
            ctx!.fillStyle = `hsla(${hue}, 85%, 45%, ${progress * 0.85})`;
          }
          ctx!.arc(px, py, isDark ? 1.25 : 1.35, 0, Math.PI * 2);
          ctx!.fill();
        },
      };
    }

    const particles: Particle[] = [];

    function setup() {
      width = canvas!.width = canvas!.parentElement?.clientWidth || window.innerWidth;
      height = canvas!.height = canvas!.parentElement?.clientHeight || window.innerHeight;
      magnet.x = width / 2;
      magnet.y = height;

      ctx!.fillStyle = isDark ? "#000000" : "#ffffff";
      ctx!.fillRect(0, 0, width, height);

      particles.length = 0;
      for (let i = 0; i < particleCount; i++) {
        particles.push(createParticle());
      }
    }

    function render() {
      if (!ctx) return;
      ctx.fillStyle = isDark
        ? `rgba(0, 0, 0, ${trailOpacity})`
        : `rgba(255, 255, 255, ${trailOpacity})`;
      ctx.fillRect(0, 0, width, height);

      ctx.shadowBlur = isDark ? canvasGlow : Math.max(canvasGlow * 0.5, 4);
      ctx.shadowColor = isDark
        ? `hsla(${baseHue}, 100%, 50%, 0.5)`
        : `hsla(${baseHue}, 85%, 55%, 0.35)`;

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }

      ctx.shadowBlur = 0;
      baseHue += hueSpeed;

      animId = requestAnimationFrame(render);
    }

    function onResize() {
      cancelAnimationFrame(animId);
      setup();
      render();
    }

    window.addEventListener("resize", onResize);
    setup();
    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
    };
  }, [isDark, particleCount, particleSpeed, particleLife, trailOpacity, hueSpeed, canvasGlow]);

  return (
    <div
      role="img"
      aria-label="Celestial constellation particle animation"
      className={`relative overflow-hidden pointer-events-none select-none ${className}`}
      style={{ width: "100%", height: "100%" }}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{ display: "block", width: "100%", height: "100%" }}
      />
    </div>
  );
};
