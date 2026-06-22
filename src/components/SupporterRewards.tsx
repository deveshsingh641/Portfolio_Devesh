import React, { useState } from "react";
import { Coffee, Heart, Star, Zap, Sparkles, ExternalLink } from "lucide-react";

interface Tier {
  emoji: string;
  label: string;
  amount: number;
  color: string;
  gradient: string;
}

const tiers: Tier[] = [
  { emoji: "☕", label: "ESPRESSO", amount: 3, color: "text-amber-400", gradient: "from-amber-500 to-orange-500" },
  { emoji: "🍕", label: "PIZZA", amount: 9, color: "text-rose-400", gradient: "from-rose-500 to-pink-500" },
  { emoji: "🎧", label: "HEADPHONES", amount: 15, color: "text-violet-400", gradient: "from-violet-500 to-purple-500" },
  { emoji: "🚀", label: "ROCKET FUEL", amount: 25, color: "text-cyan-400", gradient: "from-cyan-500 to-blue-500" },
];

const perks = [
  { icon: Heart, text: "Receive a personal shoutout" },
  { icon: Zap, text: "Prioritized issue resolution" },
  { icon: Star, text: "Name featured in supporters list" },
  { icon: Sparkles, text: "Early access to new features" },
];

const SupporterRewards: React.FC<{ theme: string }> = ({ theme }) => {
  const [selectedTier, setSelectedTier] = useState(0);

  // Replace with your actual Buy Me a Coffee / support link
  const supportBaseUrl = "https://buymeacoffee.com/devesh_6661";

  return (
    <div className="space-y-10">
      {/* Section Header */}
      <div className="text-center">
        <p className="text-xs font-mono uppercase tracking-[0.3em] text-amber-400 mb-3">SUPPORTER REWARDS</p>
        <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
          FUEL THE{" "}
          <span className="bg-gradient-to-r from-amber-400 via-rose-400 to-violet-400 bg-clip-text text-transparent">
            INNOVATION
          </span>
        </h2>
        <p className={`text-lg max-w-2xl mx-auto leading-relaxed ${theme === "dark" ? "text-slate-300" : "text-slate-600"}`}>
          Open source contributions and technical writing take time and caffeine.
          Your support directly funds server costs, new tools, and late-night coding sessions.
        </p>
        <div className="w-32 h-1.5 bg-gradient-to-r from-amber-500 via-rose-500 to-violet-500 mx-auto rounded-full shadow-lg shadow-amber-400/50 mt-5" />
      </div>

      {/* Perks */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
        {perks.map(({ icon: Icon, text }) => (
          <div
            key={text}
            className={`flex flex-col items-center text-center gap-2 py-4 px-3 rounded-xl border transition-all duration-300 hover:-translate-y-0.5 ${
              theme === "dark"
                ? "border-slate-700/30 bg-slate-900/40"
                : "border-slate-200 bg-white/80"
            }`}
          >
            <Icon size={18} className="text-amber-400" />
            <span className={`text-xs font-medium ${theme === "dark" ? "text-slate-300" : "text-slate-600"}`}>
              {text}
            </span>
          </div>
        ))}
      </div>

      {/* Amount selector card */}
      <div className="max-w-lg mx-auto">
        <div
          className={`rounded-2xl border p-8 transition-all duration-500 ${
            theme === "dark"
              ? "border-slate-700/40 bg-slate-900/60"
              : "border-slate-200 bg-white shadow-lg"
          }`}
        >
          {/* Label */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <Coffee size={16} className="text-amber-400" />
            <span className={`text-xs font-bold uppercase tracking-[0.2em] ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>
              SELECT AMOUNT
            </span>
          </div>

          {/* Tier buttons */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            {tiers.map((tier, idx) => (
              <button
                key={tier.label}
                type="button"
                onClick={() => setSelectedTier(idx)}
                className={`relative flex flex-col items-center py-4 px-2 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                  selectedTier === idx
                    ? theme === "dark"
                      ? `border-amber-400/60 bg-amber-950/30 shadow-lg shadow-amber-500/10`
                      : `border-amber-400 bg-amber-50 shadow-lg shadow-amber-200/50`
                    : theme === "dark"
                      ? "border-slate-700/40 bg-slate-800/40 hover:border-slate-600"
                      : "border-slate-200 bg-slate-50 hover:border-slate-300"
                }`}
              >
                <span className="text-2xl mb-1">{tier.emoji}</span>
                <span className={`text-sm font-bold ${theme === "dark" ? "text-slate-100" : "text-slate-900"}`}>
                  ${tier.amount}
                </span>
                <span className="text-[9px] font-mono uppercase tracking-wider text-slate-500 mt-0.5">
                  {tier.label}
                </span>
                {selectedTier === idx && (
                  <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full bg-gradient-to-br ${tier.gradient}`} />
                )}
              </button>
            ))}
          </div>

          {/* Support button */}
          <a
            href={`${supportBaseUrl}?price=${tiers[selectedTier].amount}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl bg-gradient-to-r ${tiers[selectedTier].gradient} text-white font-bold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/20 hover:scale-[1.01] active:scale-[0.99]`}
          >
            <Coffee size={16} />
            Support with ${tiers[selectedTier].amount}
            <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default SupporterRewards;
