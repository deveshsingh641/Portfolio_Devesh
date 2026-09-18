import React, { useState, useEffect, useRef } from "react";

export interface SpideyCursorState {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  facingLeft: boolean;
  mode: "idle" | "walk" | "fly";
  frame: number;
  angle: number;
}

export const SpideyCursor: React.FC = () => {
  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
    return false;
  });

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  const [state, setState] = useState<SpideyCursorState>(() => {
    const midX = typeof window !== "undefined" ? Math.max(200, window.innerWidth / 2) : 500;
    const midY = typeof window !== "undefined" ? Math.max(150, window.innerHeight / 3) : 250;
    return {
      x: midX,
      y: midY,
      targetX: midX,
      targetY: midY,
      facingLeft: false,
      mode: "idle",
      frame: 0,
      angle: 0,
    };
  });

  const posRef = useRef({
    x: typeof window !== "undefined" ? Math.max(200, window.innerWidth / 2) : 500,
    y: typeof window !== "undefined" ? Math.max(150, window.innerHeight / 3) : 250,
  });
  const targetRef = useRef({
    x: typeof window !== "undefined" ? Math.max(200, window.innerWidth / 2) : 500,
    y: typeof window !== "undefined" ? Math.max(150, window.innerHeight / 3) : 250,
  });
  const flyStartRef = useRef({
    x: typeof window !== "undefined" ? Math.max(200, window.innerWidth / 2) : 500,
    y: typeof window !== "undefined" ? Math.max(150, window.innerHeight / 3) : 250,
  });
  const flyEndRef = useRef({
    x: typeof window !== "undefined" ? Math.max(200, window.innerWidth / 2) : 500,
    y: typeof window !== "undefined" ? Math.max(150, window.innerHeight / 3) : 250,
  });
  const flyProgressRef = useRef(0);
  const animStateRef = useRef({
    facingLeft: false,
    mode: "idle" as "idle" | "walk" | "fly",
    frame: 0,
    angle: 0,
    lastFrameTime: 0,
  });

  // Track mouse and pointer position globally
  useEffect(() => {
    const handleMove = (e: MouseEvent | PointerEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    window.addEventListener("pointermove", handleMove, { passive: true });
    document.addEventListener("mousemove", handleMove, { passive: true });
    document.addEventListener("pointermove", handleMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("pointermove", handleMove);
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("pointermove", handleMove);
    };
  }, []);

  // Animation Loop
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const loop = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const pos = posRef.current;
      const target = targetRef.current;
      const anim = animStateRef.current;

      const dx = target.x - pos.x;
      const dy = target.y - pos.y;
      const dist = Math.hypot(dx, dy);

      if (anim.mode !== "fly") {
        if (dx > 35) anim.facingLeft = false;
        else if (dx < -35) anim.facingLeft = true;
      }

      let nextMode = anim.mode;
      if (anim.mode === "fly") {
        if (flyProgressRef.current >= 0.99 || dist < 18) {
          nextMode = dist > 24 ? "walk" : "idle";
          flyProgressRef.current = 0;
        }
      } else if (anim.mode === "walk") {
        if (dist > 150) {
          nextMode = "fly";
          flyStartRef.current = { x: pos.x, y: pos.y };
          flyEndRef.current = { x: target.x, y: target.y };
          flyProgressRef.current = 0;
        } else if (dist < 12) {
          nextMode = "idle";
        }
      } else {
        // idle
        if (dist > 150) {
          nextMode = "fly";
          flyStartRef.current = { x: pos.x, y: pos.y };
          flyEndRef.current = { x: target.x, y: target.y };
          flyProgressRef.current = 0;
        } else if (dist > 20) {
          nextMode = "walk";
        }
      }

      if (anim.mode !== "fly" && nextMode === "fly") {
        flyStartRef.current = { x: pos.x, y: pos.y };
        flyEndRef.current = { x: target.x, y: target.y };
        flyProgressRef.current = 0;
      }

      let targetAngle = 0;
      if (nextMode === "fly") {
        if (Math.hypot(target.x - flyEndRef.current.x, target.y - flyEndRef.current.y) > 45) {
          flyStartRef.current = { x: pos.x, y: pos.y };
          flyEndRef.current = { x: target.x, y: target.y };
          flyProgressRef.current = 0;
        }

        const start = flyStartRef.current;
        const end = flyEndRef.current;
        const trajX = end.x - start.x;
        const trajY = end.y - start.y;
        const trajLen = Math.hypot(trajX, trajY) || 1;

        if (trajX > 15) anim.facingLeft = false;
        else if (trajX < -15) anim.facingLeft = true;

        const speed = Math.max(90, Math.min(520, 260 * Math.pow(Math.hypot(target.x - pos.x, target.y - pos.y) / 450, 1.25) + 90)) * dt / Math.max(trajLen, 120);
        flyProgressRef.current = Math.min(1, flyProgressRef.current + speed);

        const smoothStep = (1 - Math.cos(flyProgressRef.current * Math.PI)) / 2;
        const curX = start.x + trajX * smoothStep;
        const curY = start.y + trajY * smoothStep;
        const arcSin = Math.sin(smoothStep * Math.PI);
        const arcSpreadX = Math.min(0.32 * trajLen, 75) * (anim.facingLeft ? -1 : 1);
        const arcSpreadY = Math.min(0.28 * trajLen, 65);

        const oldX = pos.x;
        const oldY = pos.y;
        pos.x = curX + (-trajY / trajLen) * arcSpreadX * arcSin;
        pos.y = curY + (trajX / trajLen * arcSpreadX + arcSpreadY) * arcSin;

        const deltaX = pos.x - oldX;
        const deltaY = pos.y - oldY;
        const deltaLen = Math.hypot(deltaX, deltaY) || 1;
        const pitch = (deltaY / deltaLen) * 32;
        targetAngle = anim.facingLeft ? -pitch : pitch;
      } else if (nextMode === "walk") {
        flyProgressRef.current = 0;
        const step = Math.min(Math.max(0.28, Math.min(2.8, 2.52 * Math.pow(dist / 150, 1.3) + 0.28)), dist);
        pos.x += (dx / (dist || 1)) * step;
        pos.y += (dy / (dist || 1)) * step;
        targetAngle = 0;
      } else {
        flyProgressRef.current = 0;
        targetAngle = 0;
      }

      anim.angle += (targetAngle - anim.angle) * 0.15;
      anim.mode = nextMode;

      const walkFrameDuration = Math.max(65, Math.min(150, 150 - (dist / 150) * 85));
      const frameDuration = nextMode === "fly" ? 90 : nextMode === "walk" ? walkFrameDuration : 380;

      if (now - anim.lastFrameTime > frameDuration) {
        anim.lastFrameTime = now;
        anim.frame = (anim.frame + 1) % 4;
      }

      setState({
        x: pos.x,
        y: pos.y,
        targetX: target.x,
        targetY: target.y,
        facingLeft: anim.facingLeft,
        mode: anim.mode,
        frame: anim.frame,
        angle: anim.angle,
      });

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  if (reducedMotion || state.x < 0) return null;

  // Render variables
  const d = state.x;
  const p = state.y;
  const h = state.targetX;
  const m = state.targetY;
  const x = state.facingLeft;
  const y = state.mode;
  const g = state.frame;
  const v = state.angle;

  const w = h - d;
  const L = m - p;
  const b = Math.hypot(w, L) || 1;
  const C = d + (w / b) * 20;
  const E = p + (L / b) * 14;

  // React createElement wrapper to execute the exact vector JSX from original
  const t = {
    Fragment: React.Fragment,
    jsx: (type: React.ElementType, props: Record<string, unknown> & { children?: unknown }) => {
      let finalProps = props;
      if (props && Array.isArray(props.children)) {
        finalProps = {
          ...props,
          children: props.children.map((c: unknown, i: number) =>
            c && typeof c === "object" && !("key" in c && (c as { key?: unknown }).key)
              ? React.cloneElement(c as React.ReactElement, { key: `k-${i}` })
              : c
          ),
        };
      }
      return React.createElement(type, finalProps);
    },
    jsxs: (type: React.ElementType, props: Record<string, unknown> & { children?: unknown }) => {
      let finalProps = props;
      if (props && Array.isArray(props.children)) {
        finalProps = {
          ...props,
          children: props.children.map((c: unknown, i: number) =>
            c && typeof c === "object" && !("key" in c && (c as { key?: unknown }).key)
              ? React.cloneElement(c as React.ReactElement, { key: `k-${i}` })
              : c
          ),
        };
      }
      return React.createElement(type, finalProps);
    },
  };

  return (0,t.jsxs)(t.Fragment,{children:["fly"===y&&(0,t.jsxs)("svg",{className:"fixed inset-0 pointer-events-none z-[99998] w-full h-full hidden md:block",style:{willChange:"contents"},children:[(0,t.jsx)("defs",{children:(0,t.jsxs)("filter",{id:"webSoftGlow",x:"-20%",y:"-20%",width:"140%",height:"140%",children:[(0,t.jsx)("feGaussianBlur",{stdDeviation:"0.8",result:"blur"}),(0,t.jsxs)("feMerge",{children:[(0,t.jsx)("feMergeNode",{in:"blur"}),(0,t.jsx)("feMergeNode",{in:"SourceGraphic"})]})]})}),(0,t.jsx)("line",{x1:C,y1:E,x2:h,y2:m,stroke:"#60A5FA",strokeWidth:"2.0",strokeOpacity:"0.25",className:"filter blur-[0.6px]"}),(0,t.jsx)("line",{x1:C,y1:E,x2:h,y2:m,stroke:"#FFFFFF",strokeWidth:"0.9",filter:"url(#webSoftGlow)"}),(0,t.jsxs)("g",{transform:`translate(${h}, ${m})`,children:[(0,t.jsx)("circle",{r:"2.2",fill:"#FFFFFF",opacity:"0.95"}),(0,t.jsx)("line",{x1:"-5",y1:"0",x2:"5",y2:"0",stroke:"#FFFFFF",strokeWidth:"0.9",opacity:"0.85"}),(0,t.jsx)("line",{x1:"0",y1:"-5",x2:"0",y2:"5",stroke:"#FFFFFF",strokeWidth:"0.9",opacity:"0.85"}),(0,t.jsx)("line",{x1:"-3.5",y1:"-3.5",x2:"3.5",y2:"3.5",stroke:"#93C5FD",strokeWidth:"0.75",opacity:"0.75"}),(0,t.jsx)("line",{x1:"-3.5",y1:"3.5",x2:"3.5",y2:"-3.5",stroke:"#93C5FD",strokeWidth:"0.75",opacity:"0.75"}),(0,t.jsx)("circle",{r:"4.5",fill:"none",stroke:"#FFFFFF",strokeWidth:"0.6",strokeDasharray:"1.5 1.5",opacity:"0.55"})]}),(0,t.jsx)("circle",{cx:C,cy:E,r:"1.8",fill:"#FFFFFF",opacity:"0.9"}),(0,t.jsx)("circle",{cx:C,cy:E,r:"3.2",fill:"#60A5FA",opacity:"0.3"})]}),(0,t.jsx)("div",{className:"fixed top-0 left-0 z-[99999] pointer-events-none select-none hidden md:block",style:{transform:`translate3d(${d-29}px, ${p-23}px, 0) ${"fly"===y&&x?"scaleX(-1)":"scaleX(1)"} rotate(${"fly"===y&&x?-v:v}deg)`,imageRendering:"pixelated",willChange:"transform"},children:(0,t.jsxs)("svg",{width:"58",height:"46",viewBox:"0 0 60 48",fill:"none",xmlns:"http://www.w3.org/2000/svg",className:"filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.65)]",children:[(0,t.jsx)("ellipse",{cx:"30",cy:"42.5",rx:"23",ry:"3",fill:"#000000",fillOpacity:"0.32"}),"fly"===y?(0,t.jsxs)("g",{id:"spidey-fly-joined",transform:"rotate(-8 30 24)",children:[(0,t.jsx)("path",{d:"M 31 19 L 48 12 L 49 14 L 33 22 Z",fill:"#EF4444"}),(0,t.jsx)("circle",{cx:"48.5",cy:"13",r:"2",fill:"#DC2626"}),(0,t.jsx)("path",{d:"M 19 18 L 34 18 L 32 29 L 21 29 Z",fill:"#1D4ED8"}),(0,t.jsx)("path",{d:"M 22 18 L 34 18 L 32 27 L 24 27 Z",fill:"#EF4444"}),(0,t.jsx)("path",{d:"M 28 20 L 27 22 L 29 22 Z",fill:"#0F172A"}),(0,t.jsx)("path",{d:"M 21 19 L 12 24 L 11 22 L 20 17 Z",fill:"#EF4444"}),(0,t.jsx)("path",{d:"M 27 16 L 32 16 L 33 21 L 28 21 Z",fill:"#EF4444"}),(0,t.jsx)("ellipse",{cx:"32",cy:"11",rx:"6.5",ry:"7",fill:"#EF4444"}),(0,t.jsx)("polygon",{points:"30,8 35.5,9.5 34.5,12 30,10.5",fill:"#0F172A"}),(0,t.jsx)("polygon",{points:"30.5,8.4 35,9.7 34.2,11.6 30.5,10.3",fill:"#FFFFFF"}),(0,t.jsx)("path",{d:"M 23 28 L 16 36 L 21 44 L 24.5 43 L 20 36 L 25 28 Z",fill:"#2563EB"}),(0,t.jsx)("path",{d:"M 16 36 L 21 44 L 24.5 43 L 20 36 Z",fill:"#EF4444"}),(0,t.jsx)("path",{d:"M 21 28 L 11 35 L 6 43 L 9.5 44 L 14 35 L 23 28 Z",fill:"#1D4ED8"}),(0,t.jsx)("path",{d:"M 11 35 L 6 43 L 9.5 44 L 14 35 Z",fill:"#B91C1C"})]}):(0,t.jsxs)("g",{id:"spidey-crouch-exact",transform:"walk"===y?0===g?"translate(-0.8, -0.4)":1===g?"translate(0, 0.6)":2===g?"translate(0.8, -0.4)":"translate(0, 0.6)":"translate(0, 0)",children:["walk"===y?0===g?(0,t.jsx)("path",{d:"M 35 17 Q 41 8 45 12 L 48 18 Q 49 21 47 22 L 44 15 Q 38 12 33 18 Z",fill:"#EF4444"}):1===g?(0,t.jsx)("path",{d:"M 35 17 Q 43 14 46 20 L 48 26 Q 47 28 45 27 L 43 21 Q 39 16 33 18 Z",fill:"#EF4444"}):2===g?(0,t.jsx)("path",{d:"M 35 17 Q 44 18 47 24 L 46 31 Q 44 32 43 30 L 43 24 Q 39 18 33 18 Z",fill:"#EF4444"}):(0,t.jsx)("path",{d:"M 35 17 Q 42 10 46 14 L 49 19 Q 49 22 47 23 L 44 16 Q 38 13 33 18 Z",fill:"#EF4444"}):(0,t.jsxs)("g",{children:[(0,t.jsx)("path",{d:"M 35 17 Q 41 9 45 12 L 48 18 Q 49.5 21 48 22.5 Q 46.5 22 45.5 19 L 43 15 Q 38 12.5 33 18 Z",fill:"#EF4444"}),(0,t.jsx)("path",{d:"M 36 17.5 Q 40.5 11 43 13.5 L 41.5 15 Q 38.5 13 34.5 18 Z",fill:"#1D4ED8"}),(0,t.jsx)("line",{x1:"44",y1:"13",x2:"46.5",y2:"18",stroke:"#991B1B",strokeWidth:"0.6"})]}),"walk"===y?0===g?(0,t.jsxs)("g",{children:[(0,t.jsx)("path",{d:"M 24 28 Q 12 19 6 24 L 2 38 L -1.5 41.5 L 5.5 41.5 L 8 28 Q 14 23 25 30 Z",fill:"#2563EB"}),(0,t.jsx)("path",{d:"M 6 24 L 2 38 L -1.5 41.5 L 5.5 41.5 L 8 29 Z",fill:"#EF4444"})]}):1===g?(0,t.jsxs)("g",{children:[(0,t.jsx)("path",{d:"M 24 28 Q 14 17 9 22 L 6 36 L 2.5 39.5 L 9.5 39.5 L 12 27 Q 16 22 25 30 Z",fill:"#2563EB"}),(0,t.jsx)("path",{d:"M 9 22 L 6 36 L 2.5 39.5 L 9.5 39.5 L 12 28 Z",fill:"#EF4444"})]}):2===g?(0,t.jsxs)("g",{children:[(0,t.jsx)("path",{d:"M 24 28 Q 15 22 10 27 L 8 40 L 4.5 41.5 L 11.5 41.5 L 13 30 Q 17 25 25 30 Z",fill:"#2563EB"}),(0,t.jsx)("path",{d:"M 10 27 L 8 40 L 4.5 41.5 L 11.5 41.5 L 13 31 Z",fill:"#EF4444"})]}):(0,t.jsxs)("g",{children:[(0,t.jsx)("path",{d:"M 24 28 Q 13 18 7 23 L 4 37 L 0.5 40.5 L 7.5 40.5 L 10 28 Q 15 23 25 30 Z",fill:"#2563EB"}),(0,t.jsx)("path",{d:"M 7 23 L 4 37 L 0.5 40.5 L 7.5 40.5 L 10 29 Z",fill:"#EF4444"})]}):(0,t.jsxs)("g",{children:[(0,t.jsx)("path",{d:"M 24 28 Q 14 22 8 26 L 5 39 L 1 41.5 L 8 41.5 L 11 29 Q 16 25 25 30 Z",fill:"#2563EB"}),(0,t.jsx)("path",{d:"M 8 28 L 5 39 L 1 41.5 L 8 41.5 L 11 31 Z",fill:"#EF4444"}),(0,t.jsx)("line",{x1:"8",y1:"31",x2:"11",y2:"31",stroke:"#991B1B",strokeWidth:"0.6"}),(0,t.jsx)("line",{x1:"6",y1:"36",x2:"9.5",y2:"36",stroke:"#991B1B",strokeWidth:"0.5"})]}),"walk"===y?0===g?(0,t.jsxs)("g",{children:[(0,t.jsx)("path",{d:"M 32 29 Q 39 27 43 31 L 41 39 L 37.5 41.5 L 44.5 41.5 L 45 32 Q 39 28 31 31 Z",fill:"#2563EB"}),(0,t.jsx)("path",{d:"M 43 31 L 41 39 L 37.5 41.5 L 44.5 41.5 L 45 32 Z",fill:"#EF4444"})]}):1===g?(0,t.jsxs)("g",{children:[(0,t.jsx)("path",{d:"M 32 29 Q 42 25 47 29 L 45 38 L 42 41.5 L 49 41.5 L 49 30 Q 42 26 31 31 Z",fill:"#2563EB"}),(0,t.jsx)("path",{d:"M 47 29 L 45 38 L 42 41.5 L 49 41.5 L 49 31 Z",fill:"#EF4444"})]}):2===g?(0,t.jsxs)("g",{children:[(0,t.jsx)("path",{d:"M 32 29 Q 44 24 50 28 L 48 38 L 45 41.5 L 52 41.5 L 52 29 Q 44 25 31 31 Z",fill:"#2563EB"}),(0,t.jsx)("path",{d:"M 50 28 L 48 38 L 45 41.5 L 52 41.5 L 52 30 Z",fill:"#EF4444"})]}):(0,t.jsxs)("g",{children:[(0,t.jsx)("path",{d:"M 32 29 Q 41 26 45 30 L 43 37 L 40 40 L 47 40 L 47 31 Q 41 27 31 31 Z",fill:"#2563EB"}),(0,t.jsx)("path",{d:"M 45 30 L 43 37 L 40 40 L 47 40 L 47 32 Z",fill:"#EF4444"})]}):(0,t.jsxs)("g",{children:[(0,t.jsx)("path",{d:"M 32 29 Q 41 27 45 31 L 43 39 L 39.5 41.5 L 46.5 41.5 L 47 32 Q 41 28 31 31 Z",fill:"#2563EB"}),(0,t.jsx)("path",{d:"M 45 32 L 43 39 L 39.5 41.5 L 46.5 41.5 L 47 33 Z",fill:"#EF4444"}),(0,t.jsx)("line",{x1:"43",y1:"34",x2:"47",y2:"34",stroke:"#991B1B",strokeWidth:"0.6"}),(0,t.jsx)("line",{x1:"41.5",y1:"38",x2:"45.5",y2:"38",stroke:"#991B1B",strokeWidth:"0.5"})]}),(0,t.jsx)("path",{d:"M 21 27 L 35 27 L 33 34 L 22 34 Z",fill:"#1D4ED8"}),(0,t.jsx)("path",{d:"M 21 20 L 37 19 L 35 32 L 21 32 Z",fill:"#1D4ED8"}),(0,t.jsx)("path",{d:"M 21 20 Q 30 17 37 19 L 34 28 Q 29 27 23 27 Z",fill:"#EF4444"}),(0,t.jsx)("path",{d:"M 25 27 L 32 27 L 31.5 32 L 25.5 32 Z",fill:"#EF4444"}),(0,t.jsx)("path",{d:"M 22 31.5 L 29 34 L 36 31.5 L 36 33.5 L 29 36 L 22 33.5 Z",fill:"#DC2626"}),(0,t.jsx)("path",{d:"M 29.5 22.5 L 28.3 25.2 L 30.7 25.2 Z",fill:"#0F172A"}),(0,t.jsx)("line",{x1:"29.5",y1:"23",x2:"24",y2:"21.5",stroke:"#0F172A",strokeWidth:"0.6"}),(0,t.jsx)("line",{x1:"29.5",y1:"23",x2:"35",y2:"21.5",stroke:"#0F172A",strokeWidth:"0.6"}),(0,t.jsx)("line",{x1:"29.5",y1:"24.8",x2:"24",y2:"27.5",stroke:"#0F172A",strokeWidth:"0.6"}),(0,t.jsx)("line",{x1:"29.5",y1:"24.8",x2:"35",y2:"27.5",stroke:"#0F172A",strokeWidth:"0.6"}),"walk"===y?0===g?(0,t.jsxs)("g",{children:[(0,t.jsx)("path",{d:"M 23 19 Q 24 26 24 33 L 23 41.5 Q 21.5 42.5 23.5 42.5 Q 25.5 42.5 25.5 41.5 L 26 33 Q 26 26 24.5 19 Z",fill:"#EF4444"}),(0,t.jsx)("circle",{cx:"24.5",cy:"42",r:"1.5",fill:"#DC2626"})]}):1===g?(0,t.jsxs)("g",{children:[(0,t.jsx)("path",{d:"M 23 19 Q 26 26 27 33 L 26.5 41.5 Q 25 42.5 27 42.5 Q 29 42.5 29 41.5 L 29 33 Q 28 26 24.5 19 Z",fill:"#EF4444"}),(0,t.jsx)("circle",{cx:"28",cy:"42",r:"1.5",fill:"#DC2626"})]}):2===g?(0,t.jsxs)("g",{children:[(0,t.jsx)("path",{d:"M 23 19 Q 24 25 23.5 31 L 22 38 Q 20.5 39 22.5 39 Q 24.5 39 24.5 38 L 25.5 31 Q 26 25 24.5 19 Z",fill:"#EF4444"}),(0,t.jsx)("circle",{cx:"23",cy:"38.5",r:"1.5",fill:"#DC2626"})]}):(0,t.jsxs)("g",{children:[(0,t.jsx)("path",{d:"M 23 19 Q 23.5 26 23.5 33 L 22.5 41.5 Q 21 42.5 23 42.5 Q 25 42.5 25 41.5 L 25.5 33 Q 25.5 26 24.5 19 Z",fill:"#EF4444"}),(0,t.jsx)("circle",{cx:"23.8",cy:"42",r:"1.5",fill:"#DC2626"})]}):(0,t.jsxs)("g",{children:[(0,t.jsx)("path",{d:"M 23 19 Q 25.5 26 26 33 L 25 41 Q 23.5 42 25.5 42 Q 27.5 42 27.5 41 L 28.5 33 Q 28 26 25.5 19 Z",fill:"#EF4444"}),(0,t.jsx)("path",{d:"M 24 21 Q 25.8 27 26.5 32 L 27.8 32 Q 27.2 27 25.2 21 Z",fill:"#1D4ED8"}),(0,t.jsx)("circle",{cx:"26",cy:"41.5",r:"1.5",fill:"#DC2626"})]}),(0,t.jsx)("path",{d:"M 27 18 L 32 18 L 31 21 L 26 21 Z",fill:"#EF4444"}),(0,t.jsx)("path",{d:"M 30.5 5.5 C 24.5 5.5 22.5 10 22.5 15 C 22.5 19.5 26 21.5 30.5 21.5 C 35 21.5 38.5 19.5 38.5 15 C 38.5 10 36.5 5.5 30.5 5.5 Z",fill:"#EF4444"}),(0,t.jsx)("line",{x1:"30.5",y1:"5.5",x2:"30.5",y2:"21.5",stroke:"#991B1B",strokeWidth:"0.5"}),(0,t.jsx)("path",{d:"M 23 14.5 Q 30.5 17 38 14.5",fill:"none",stroke:"#991B1B",strokeWidth:"0.5"}),(0,t.jsx)("polygon",{points:"25,10.5 29.2,12.5 28,15.8 24.5,13.8",fill:"#0F172A"}),(0,t.jsx)("polygon",{points:"25.6,11 28.6,12.7 27.8,15.2 25.2,13.6",fill:"#FFFFFF"}),(0,t.jsx)("polygon",{points:"35.5,10.5 31.8,12.5 32.8,15.8 36,13.8",fill:"#0F172A"}),(0,t.jsx)("polygon",{points:"35,11 32.2,12.7 33,15.2 35.4,13.6",fill:"#FFFFFF"})]})]})})]});
};

export default SpideyCursor;
