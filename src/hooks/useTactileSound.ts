import { useState, useEffect, useCallback } from "react";
import { soundService } from "../lib/sound";

export function useTactileSound() {
  const [soundEnabled, setSoundEnabled] = useState(() => soundService.getSoundEnabled());

  useEffect(() => {
    const unsubscribe = soundService.subscribe((enabled) => {
      setSoundEnabled(enabled);
    });
    return unsubscribe;
  }, []);

  const toggleSound = useCallback(() => {
    soundService.toggleSound();
  }, []);

  useEffect(() => {
    // Global delegation for hover and click sounds with deduplication
    let lastHoveredElement: Element | null = null;
    let lastClickTime = 0;

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest("button, a, [role='button'], input[type='submit'], .cursor-pointer");
      if (interactive && interactive !== lastHoveredElement) {
        lastHoveredElement = interactive;
        soundService.playHover();
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest("button, a, [role='button'], input[type='submit'], .cursor-pointer");
      const related = (e.relatedTarget as HTMLElement | null)?.closest("button, a, [role='button'], input[type='submit'], .cursor-pointer");
      if (interactive && interactive !== related) {
        lastHoveredElement = null;
      }
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest("button, a, [role='button'], input[type='submit'], .cursor-pointer");
      const now = Date.now();
      if (interactive && now - lastClickTime > 80) {
        lastClickTime = now;
        soundService.playClick();
      }
    };

    window.addEventListener("mouseover", handleMouseOver, { passive: true });
    window.addEventListener("mouseout", handleMouseOut, { passive: true });
    window.addEventListener("click", handleClick, { passive: true });

    return () => {
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mouseout", handleMouseOut);
      window.removeEventListener("click", handleClick);
    };
  }, []);

  return {
    soundEnabled,
    toggleSound,
    playHover: () => soundService.playHover(),
    playClick: () => soundService.playClick(),
    playThemeSwitch: (isDark: boolean) => soundService.playThemeSwitch(isDark),
    playIntroSweep: () => soundService.playIntroSweep(),
    playModalOpen: () => soundService.playModalOpen(),
    playModalClose: () => soundService.playModalClose(),
  };
}
