import React, { useRef } from "react";
import { soundService } from "../lib/sound";

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDark, onToggle }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick = () => {
    soundService.playThemeSwitch(!isDark);
    // If browser supports View Transitions API
    if (document.startViewTransition && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      let x = window.innerWidth / 2;
      let y = window.innerHeight - 36;
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        x = rect.left + rect.width / 2;
        y = rect.top + rect.height / 2;
      }

      const radius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      const styleEl = document.createElement("style");
      styleEl.textContent = `
        ::view-transition-old(root) {
          animation: none !important;
          z-index: 1 !important;
        }
        ::view-transition-new(root) {
          animation: circle-expand 0.75s cubic-bezier(0.16, 1, 0.3, 1) forwards !important;
          z-index: 9999 !important;
        }
        @keyframes circle-expand {
          from {
            clip-path: circle(0px at ${x}px ${y}px);
          }
          to {
            clip-path: circle(${radius}px at ${x}px ${y}px);
          }
        }
      `;
      document.head.appendChild(styleEl);

      const transition = document.startViewTransition(() => {
        onToggle();
      });

      transition.finished.finally(() => {
        styleEl.remove();
      });
    } else {
      onToggle();
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <button
        ref={buttonRef}
        type="button"
        onClick={handleClick}
        aria-pressed={isDark}
        aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
        title={isDark ? "Switch to light mode" : "Switch to dark mode"}
        className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-neutral-900/90 dark:bg-neutral-900 border border-white/20 p-2 shadow-2xl transition-transform duration-300 hover:scale-110 active:scale-95 backdrop-blur-md focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
      >
        <svg
          viewBox="0 0 240 240"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <g
            style={{
              transform: isDark ? "rotate(-180deg)" : "rotate(0deg)",
              transformOrigin: "120px 120px",
              transition: "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <path
              d="M120 67.5C149.25 67.5 172.5 90.75 172.5 120C172.5 149.25 149.25 172.5 120 172.5"
              fill="white"
            />
            <path
              d="M120 67.5C90.75 67.5 67.5 90.75 67.5 120C67.5 149.25 90.75 172.5 120 172.5"
              fill="black"
            />
          </g>
          <path
            style={{
              transform: isDark ? "rotate(180deg)" : "rotate(0deg)",
              transformOrigin: "120px 120px",
              transition: "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
            d="M120 3.75C55.5 3.75 3.75 55.5 3.75 120C3.75 184.5 55.5 236.25 120 236.25C184.5 236.25 236.25 184.5 236.25 120C236.25 55.5 184.5 3.75 120 3.75ZM120 214.5V172.5C90.75 172.5 67.5 149.25 67.5 120C67.5 90.75 90.75 67.5 120 67.5V25.5C172.5 25.5 214.5 67.5 214.5 120C214.5 172.5 172.5 214.5 120 214.5Z"
            fill="white"
          />
        </svg>
      </button>
    </div>
  );
};
