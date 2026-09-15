import React, { useState } from "react";
import { Heart, Star, Zap, Sparkles, ExternalLink, Lock, Check } from "lucide-react";
import PaymentButton from "./PaymentButton";

interface Tier {
  id: string;
  emoji: string;
  label: string;
  inrAmount: number;
  gradient: string;
  popular?: boolean;
}

const tiers: Tier[] = [
  { id: "espresso", emoji: "☕", label: "ESPRESSO", inrAmount: 30, gradient: "from-amber-500 to-orange-500" },
  { id: "pizza", emoji: "🍕", label: "PIZZA", inrAmount: 100, gradient: "from-rose-500 to-pink-500" },
  { id: "headphones", emoji: "🎧", label: "HEADPHONES", inrAmount: 250, gradient: "from-violet-500 to-purple-500" },
  { id: "rocket", emoji: "🚀", label: "ROCKET FUEL", inrAmount: 500, gradient: "from-amber-400 via-rose-500 to-violet-600", popular: true },
];

const perks = [
  { icon: Heart, text: "Receive a personal shoutout" },
  { icon: Zap, text: "Prioritized issue resolution" },
  { icon: Star, text: "Name featured in supporters list" },
  { icon: Sparkles, text: "Early access to new features" },
];

const quickCustomChips = [50, 150, 300, 750, 1000];

const SupporterRewards: React.FC<{ theme: string }> = ({ theme }) => {
  const [selectedTier, setSelectedTier] = useState<number>(0);
  const [isCustom, setIsCustom] = useState(false);
  const [customAmount, setCustomAmount] = useState<number>(150);

  const supportBaseUrl = "https://buymeacoffee.com/devesh_6661";
  const selected = tiers[selectedTier];

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

      {/* Single Unified Checkout Card */}
      <div className="max-w-md mx-auto">
        <div
          className={`rounded-2xl border p-6 md:p-7 transition-all duration-300 ${
            theme === "dark"
              ? "border-slate-700/50 bg-slate-900/70 shadow-2xl shadow-black/40"
              : "border-slate-200 bg-white shadow-xl"
          }`}
        >
          {/* Header Row: Title & Custom Amount Toggle */}
          <div className="flex items-center justify-between mb-5">
            <span className={`text-xs font-bold uppercase tracking-[0.18em] ${theme === "dark" ? "text-slate-300" : "text-slate-600"}`}>
              {isCustom ? "Custom Amount" : "Choose Tier"}
            </span>

            <button
              type="button"
              onClick={() => setIsCustom(!isCustom)}
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors py-1 px-2.5 rounded-lg border border-amber-400/20 bg-amber-400/5 hover:bg-amber-400/10"
            >
              {isCustom ? "View Tiers" : "+ Custom Amount"}
            </button>
          </div>

          {/* Mode 1: Preset Tiers */}
          {!isCustom ? (
            <div className="grid grid-cols-4 gap-2.5 mb-6">
              {tiers.map((tier, idx) => {
                const isSelected = selectedTier === idx;
                return (
                  <button
                    key={tier.label}
                    type="button"
                    onClick={() => setSelectedTier(idx)}
                    className={`relative flex flex-col items-center py-3.5 px-2 rounded-xl border transition-all duration-200 hover:scale-[1.03] ${
                      isSelected
                        ? theme === "dark"
                          ? "border-amber-400 bg-gradient-to-b from-amber-400/15 to-transparent shadow-lg shadow-amber-500/15"
                          : "border-amber-500 bg-amber-50 shadow-md shadow-amber-200/60"
                        : theme === "dark"
                          ? "border-slate-800 bg-slate-800/40 hover:border-slate-700"
                          : "border-slate-200 bg-slate-50/80 hover:border-slate-300"
                    }`}
                  >
                    {/* Active Checkmark Pill */}
                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 w-3.5 h-3.5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-xs">
                        <Check size={9} strokeWidth={3.5} />
                      </div>
                    )}

                    <span className="text-2xl mb-1.5 select-none">{tier.emoji}</span>
                    <span className={`text-base font-extrabold leading-none mb-1 ${
                      isSelected
                        ? "text-amber-400"
                        : theme === "dark"
                          ? "text-white"
                          : "text-slate-900"
                    }`}>
                      ₹{tier.inrAmount}
                    </span>
                    <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400">
                      {tier.label}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            /* Mode 2: Custom Amount Input */
            <div className="mb-6 space-y-3">
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg text-slate-400 font-bold select-none">
                  ₹
                </span>
                <input
                  type="number"
                  min="10"
                  max="50000"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(Math.max(10, Number(e.target.value) || 10))}
                  className={`w-full pl-9 pr-4 py-3 rounded-xl border font-mono text-lg font-bold focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all ${
                    theme === "dark"
                      ? "bg-slate-950/70 border-slate-700 text-white placeholder-slate-500"
                      : "bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400"
                  }`}
                  placeholder="Enter amount (min ₹10)"
                />
              </div>

              {/* Quick Chip Suggestions */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] text-slate-400 mr-1 font-mono">Quick:</span>
                {quickCustomChips.map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setCustomAmount(val)}
                    className={`text-xs px-2.5 py-1 rounded-lg border font-mono transition-all ${
                      customAmount === val
                        ? "border-amber-400 bg-amber-400/20 text-amber-300 font-bold"
                        : theme === "dark"
                          ? "border-slate-800 bg-slate-800/40 text-slate-300 hover:border-slate-700"
                          : "border-slate-200 bg-slate-100 text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    ₹{val}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Payment Action Button */}
          <div className="space-y-3">
            <PaymentButton
              tier={!isCustom ? selected.id : undefined}
              amount={!isCustom ? selected.inrAmount : undefined}
              customAmount={isCustom ? customAmount : undefined}
              label={
                isCustom
                  ? `Pay ₹${customAmount} via Razorpay`
                  : `Support with ₹${selected.inrAmount} (${selected.label})`
              }
              gradient={selected.gradient}
              theme={theme}
            />

            {/* Clean, Single Trust Badge */}
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 pt-1">
              <Lock size={12} className="text-emerald-400" />
              <span>256-bit Encrypted • UPI, GPay, PhonePe, Cards, NetBanking</span>
            </div>
          </div>

          {/* Subtle Buy Me a Coffee alternative for international visitors */}
          <div className="mt-5 pt-4 border-t border-slate-700/20 text-center">
            <a
              href={supportBaseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-amber-400 transition-colors"
            >
              <span>International cards / USD? Support via Buy Me a Coffee</span>
              <ExternalLink size={11} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupporterRewards;
