import React, { useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useTactileSound } from "../hooks/useTactileSound";

interface SoundToggleProps {
  className?: string;
  variant?: "pill" | "icon";
}

export const SoundToggle: React.FC<SoundToggleProps> = ({
  className = "",
  variant = "pill",
}) => {
  const { soundEnabled, toggleSound } = useTactileSound();
  const [showToast, setShowToast] = useState(false);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSound();
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2200);
  };

  return (
    <div className="relative inline-flex items-center">
      {variant === "pill" ? (
        <button
          type="button"
          onClick={handleToggle}
          aria-label={soundEnabled ? "Mute sound effects" : "Enable tactile sound effects"}
          title={soundEnabled ? "Sound effects active (Click to mute)" : "Enable tactile micro-sounds"}
          className={`group relative inline-flex items-center gap-1.5 rounded-full px-2.5 sm:px-3 py-1.5 text-xs font-medium transition-all duration-300 active:scale-95 border ${
            soundEnabled
              ? "bg-purple-500/10 border-purple-500/40 text-purple-600 dark:text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.2)]"
              : "bg-card/60 border-border/70 text-foreground/70 hover:text-foreground hover:border-border hover:bg-card/90"
          } ${className}`}
        >
          {soundEnabled ? (
            <>
              <Volume2 className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400 transition-transform group-hover:scale-110" />
              {/* Animated Mini Audio Equalizer Bars */}
              <span className="hidden sm:inline-flex items-center gap-[2px] h-3">
                <span className="w-[2px] h-2 bg-purple-500 rounded-full animate-[pulse_0.8s_ease-in-out_infinite]" />
                <span className="w-[2px] h-3 bg-purple-400 rounded-full animate-[pulse_0.6s_ease-in-out_infinite_0.15s]" />
                <span className="w-[2px] h-1.5 bg-purple-500 rounded-full animate-[pulse_0.9s_ease-in-out_infinite_0.3s]" />
              </span>
              <span className="hidden sm:inline text-[11px] font-medium tracking-wide">Sound ON</span>
            </>
          ) : (
            <>
              <VolumeX className="h-3.5 w-3.5 text-foreground/50 group-hover:text-foreground/80 transition-colors" />
              <span className="hidden sm:inline text-[11px] text-foreground/60 group-hover:text-foreground/80 tracking-wide">
                Sound OFF
              </span>
            </>
          )}
        </button>
      ) : (
        <button
          type="button"
          onClick={handleToggle}
          aria-label={soundEnabled ? "Mute sound effects" : "Enable tactile sound effects"}
          title={soundEnabled ? "Sound effects active" : "Enable tactile sound effects"}
          className={`flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-200 active:scale-95 ${
            soundEnabled
              ? "bg-purple-500/15 border-purple-500/40 text-purple-600 dark:text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.25)]"
              : "bg-card/60 border-border/70 text-foreground/60 hover:text-foreground hover:bg-card/90"
          } ${className}`}
        >
          {soundEnabled ? (
            <Volume2 className="h-4 w-4 text-purple-500" />
          ) : (
            <VolumeX className="h-4 w-4 text-foreground/50" />
          )}
        </button>
      )}

      {/* Floating Status Toast */}
      {showToast && (
        <div
          role="status"
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-foreground px-2.5 py-0.5 text-[10px] font-medium text-background shadow-lg pointer-events-none animate-in fade-in zoom-in-95 duration-200 z-50"
        >
          {soundEnabled ? "Tactile audio enabled 🔊" : "Audio muted 🔇"}
        </div>
      )}
    </div>
  );
};
