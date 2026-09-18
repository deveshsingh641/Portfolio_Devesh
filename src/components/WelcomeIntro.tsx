import React, { useState, useEffect, useMemo, useCallback } from "react";
import { soundService } from "../lib/sound";
import "./WelcomeIntro.css";

const GREETINGS = ["नमस्ते", "Hello", "Bonjour", "Hola", "Ciao"];
const COLS = 22;
const ROWS = 13;
const TOTAL_CELLS = COLS * ROWS;

const TRIM_VARIATIONS = [
  "trim-left",
  "trim-right",
  "trim-top",
  "trim-bottom",
  "trim-top-left",
  "trim-top-right",
  "trim-bottom-left",
  "trim-bottom-right",
];

const INTRO_SESSION_KEY = "devesh_portfolio_has_seen_intro";

export const WelcomeIntro: React.FC = () => {
  const [greetingIndex, setGreetingIndex] = useState(0);
  const [isExitingText, setIsExitingText] = useState(false);
  const [isExitingCurtain, setIsExitingCurtain] = useState(false);
  const [showLoader, setShowLoader] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      if (sessionStorage.getItem(INTRO_SESSION_KEY) === "true") return false;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
    } catch {
      // Fallback
    }
    return true;
  });

  const dismissIntro = useCallback(() => {
    try {
      sessionStorage.setItem(INTRO_SESSION_KEY, "true");
    } catch {
      // Ignore
    }
    document.body.style.overflow = "";
    setIsExitingText(true);
    setIsExitingCurtain(true);
    setTimeout(() => {
      setShowLoader(false);
      window.dispatchEvent(new CustomEvent("welcome-intro-finished"));
    }, 200);
  }, []);

  // Pre-generate deterministic cell properties matching animation parameters
  const delays = useMemo(
    () => Array.from({ length: TOTAL_CELLS }, () => 1.3 * Math.random()),
    []
  );
  const durations = useMemo(
    () => Array.from({ length: TOTAL_CELLS }, () => 0.3 + 0.3 * Math.random()),
    []
  );
  const opacities = useMemo(
    () => Array.from({ length: TOTAL_CELLS }, () => 0.05 + 0.05 * Math.random()),
    []
  );
  const blinkDurations = useMemo(
    () => Array.from({ length: TOTAL_CELLS }, () => 0.5 + 0.6 * Math.random()),
    []
  );
  const trimClasses = useMemo(
    () =>
      Array.from(
        { length: TOTAL_CELLS },
        () => TRIM_VARIATIONS[Math.floor(Math.random() * TRIM_VARIATIONS.length)]
      ),
    []
  );

  useEffect(() => {
    if (!showLoader) return;

    // Lock document scroll during welcome intro
    document.body.style.overflow = "hidden";

    // Allow user to dismiss with Escape or Space
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === " ") {
        e.preventDefault();
        dismissIntro();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    // Cycle greetings
    const interval = setInterval(() => {
      setGreetingIndex((prev) => {
        if (prev < GREETINGS.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 300);

    // Stage 1 (1550ms): "Ciao" finishes; trigger text & logo blur-out
    const timerTextExit = setTimeout(() => {
      clearInterval(interval);
      setIsExitingText(true);
    }, 1550);

    // Stage 2 (1950ms): dissolve dark curtain
    const timerCurtainExit = setTimeout(() => {
      setIsExitingCurtain(true);
      document.body.style.overflow = "";
      soundService.playIntroSweep();
    }, 1950);

    // Stage 3 (2450ms): Curtain dissolved; cleanly unmount
    const timerComplete = setTimeout(() => {
      try {
        sessionStorage.setItem(INTRO_SESSION_KEY, "true");
      } catch {
        // Ignore
      }
      setShowLoader(false);
      window.dispatchEvent(new CustomEvent("welcome-intro-finished"));
    }, 2450);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearInterval(interval);
      clearTimeout(timerTextExit);
      clearTimeout(timerCurtainExit);
      clearTimeout(timerComplete);
      document.body.style.overflow = "";
    };
  }, [showLoader, dismissIntro]);

  if (!showLoader) return null;

  return (
    <aside
      className={`site-loader ${isExitingText ? "exit-text" : ""} ${
        isExitingCurtain ? "exit-curtain" : ""
      }`}
      aria-label="Welcome Greeting"
      aria-live="polite"
      onClick={dismissIntro}
      role="region"
    >
      {/* 22x13 Animated Matrix Grid */}
      <div
        className="site-loader-grid"
        style={{
          gridTemplateColumns: `repeat(${COLS}, 1fr)`,
          gridTemplateRows: `repeat(${ROWS}, 1fr)`,
        }}
      >
        {delays.map((delay, i) => (
          <div
            key={i}
            className={`site-loader-cell ${trimClasses[i]}`}
            style={
              {
                "--cell-delay": `${delay.toFixed(3)}s`,
                "--cell-duration": `${durations[i].toFixed(3)}s`,
                "--cell-blink-duration": `${blinkDurations[i].toFixed(3)}s`,
                "--cell-opacity-max": opacities[i].toFixed(4),
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      {/* Foreground Content: Monogram Logo + Multilingual Greeting */}
      <div className="site-loader-content">
        <div className="site-loader-logo">
          <svg
            width="70"
            height="70"
            viewBox="0 0 70 70"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-12 h-12 md:w-16 md:h-16 drop-shadow-[0_0_20px_rgba(168,85,247,0.4)]"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="introLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="50%" stopColor="#818cf8" />
                <stop offset="100%" stopColor="#38bdf8" />
              </linearGradient>
            </defs>
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M33.2695 4.21484H51.9213V7.15484H33.4153C29.4894 7.56743 21.2305 10.9213 19.5598 21.2123C19.3605 23.2322 19.8386 28.5026 23.4622 32.7857L24.5608 34.0842L23.1168 34.9831C21.7884 35.81 20.1345 37.553 19.5841 40.0127C19.0496 42.4017 19.4958 45.7453 22.8551 49.9534L22.8877 49.9943L32.2181 63.56H47.5151L32.362 38.3994H41.5837V41.3394H37.5647L52.7178 66.5H30.6719L20.5243 51.7461C16.7697 47.0241 15.9463 42.8066 16.7151 39.3707C17.2992 36.7603 18.7678 34.7624 20.2632 33.4558C16.8471 28.658 16.3905 23.2402 16.6397 20.8669L16.6439 20.8272L16.6502 20.7877C18.5947 8.66204 28.4452 4.68578 33.1982 4.2218L33.2695 4.21484Z"
              fill="url(#introLogoGrad)"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M53.4977 4.23486V11.9933L53.4914 12.0608C53.0457 16.8785 51.4207 20.2604 48.2666 22.3401C47.3233 22.9621 46.2683 23.4493 45.1086 23.8255C47.7868 25.1096 49.6433 26.9767 50.9059 29.1056C53.1406 32.8739 53.3617 37.2415 53.4871 39.7191C53.49 39.7773 53.4929 39.8345 53.4958 39.8906C53.9887 49.5394 48.2279 54.9659 45.0563 56.5243L43.7598 53.8856C46.0498 52.7604 50.9833 48.3342 50.5596 40.0406L50.5591 40.0304C50.4296 37.4956 50.2379 33.7429 48.3771 30.6053C46.6068 27.6202 43.1643 24.9491 35.9062 24.9491V22.0091C40.9314 22.0091 44.3739 21.3852 46.6482 19.8856C48.7959 18.4696 50.154 16.0922 50.5577 11.8565V4.23486H53.4977Z"
              fill="url(#introLogoGrad)"
            />
          </svg>
        </div>
        <div className="site-loader-greeting-box">
          <span key={greetingIndex} className="site-loader-greeting">
            {GREETINGS[greetingIndex]}
          </span>
        </div>

        {/* Accessible skip hint */}
        <div className="text-[11px] uppercase tracking-[0.2em] text-neutral-400/70 font-mono select-none mt-4 transition-opacity duration-300">
          Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-neutral-300 border border-white/15">ESC</kbd> or click to skip
        </div>
      </div>
    </aside>
  );
};
