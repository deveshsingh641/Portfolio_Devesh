import React, { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Star, Zap, Sparkles, Send, Lock, Check, ExternalLink } from "lucide-react";
import { PaymentButton } from "./PaymentButton";

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

interface SupporterRewardsProps {
  isDark?: boolean;
}

export const SupporterRewards: React.FC<SupporterRewardsProps> = ({ isDark = true }) => {
  const [selectedTier, setSelectedTier] = useState<number>(0);
  const [isCustom, setIsCustom] = useState(false);
  const [customAmount, setCustomAmount] = useState<number>(150);

  const supportBaseUrl = "https://buymeacoffee.com/devesh_6661";
  const selected = tiers[selectedTier];

  return (
    <section
      id="support"
      className="py-24 md:py-32 px-4 relative scroll-mt-24 md:scroll-mt-32 overflow-hidden"
    >
      {/* Anchor alias for #rewards */}
      <span id="rewards" className="sr-only pointer-events-none" aria-hidden="true" />

      {/* Atmospheric Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-amber-500/5 dark:bg-purple-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="container mx-auto max-w-5xl">
        {/* Section Header - Styled Exactly Like Thoughts, Expertise, and Projects */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-1.5 text-xs font-mono font-medium tracking-widest uppercase text-muted-foreground mb-4 shadow-2xs">
              <Sparkles className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400" />
              <span>Supporter Rewards</span>
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display text-3xl sm:text-5xl md:text-6xl font-medium tracking-tight mb-3"
          >
            <span className="text-foreground font-normal">Fuel The </span>
            <span className="bg-gradient-to-r from-amber-500 via-rose-500 to-purple-500 bg-clip-text text-transparent font-semibold">
              Innovation
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-3 text-sm sm:text-base text-muted-foreground max-w-xl mx-auto font-light leading-relaxed"
          >
            Open source contributions and technical writing take time and caffeine. Your support
            directly funds server costs, new tools, and late-night coding sessions.
          </motion.p>

          {/* Glowing Gradient Accent Bar */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="w-28 h-1 bg-gradient-to-r from-amber-500 via-rose-500 to-purple-500 mx-auto rounded-full shadow-md shadow-amber-500/20 mt-6"
          />
        </div>

        {/* 4 Perks Grid - Styled as Portfolio Glass Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-4xl mx-auto mb-10"
        >
          {perks.map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="group flex flex-col items-center text-center gap-2.5 py-5 px-3.5 rounded-2xl border border-border bg-card/70 hover:bg-card hover:border-amber-400/40 dark:hover:border-amber-400/30 transition-all duration-300 hover:-translate-y-1 shadow-2xs"
            >
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 dark:text-amber-400 transition-transform duration-300 group-hover:scale-110">
                <Icon size={18} />
              </div>
              <span className="text-xs font-medium text-foreground/90 leading-snug">
                {text}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Floating Paper Airplane Pointer */}
        <div className="flex justify-center mb-4">
          <div className="flex items-center justify-center w-8 h-8 rounded-full border border-border bg-card shadow-2xs text-muted-foreground animate-bounce">
            <Send size={14} className="transform rotate-[135deg] translate-y-0.5 text-amber-500 dark:text-amber-400" />
          </div>
        </div>

        {/* Single Unified Checkout Card Container */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="max-w-lg mx-auto"
        >
          <div className="rounded-2xl border border-border bg-card p-6 md:p-8 transition-all duration-300 shadow-sm relative overflow-hidden">
            {/* Subtle corner aura */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/5 dark:bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

            {/* Header Row: Title & Custom Amount Toggle */}
            <div className="flex items-center justify-between mb-6 relative z-10">
              <span className="text-xs font-mono font-medium uppercase tracking-widest text-muted-foreground">
                {isCustom ? "CUSTOM AMOUNT" : "CHOOSE TIER"}
              </span>

              <button
                type="button"
                onClick={() => setIsCustom(!isCustom)}
                className="text-xs font-medium text-foreground py-1 px-3 rounded-full border border-border bg-secondary/50 hover:bg-secondary transition-colors"
              >
                {isCustom ? "View Tiers" : "+ Custom Amount"}
              </button>
            </div>

            {/* Mode 1: Preset Tiers */}
            {!isCustom ? (
              <div className="grid grid-cols-4 gap-2.5 mb-7 relative z-10">
                {tiers.map((tier, idx) => {
                  const isSelected = selectedTier === idx;
                  return (
                    <button
                      key={tier.label}
                      type="button"
                      onClick={() => setSelectedTier(idx)}
                      className={`relative flex flex-col items-center py-4 px-2 rounded-xl border transition-all duration-200 hover:scale-[1.02] ${
                        isSelected
                          ? "border-amber-500/80 dark:border-amber-400/80 bg-amber-500/10 dark:bg-amber-400/15 shadow-sm ring-1 ring-amber-400/40 text-foreground"
                          : "border-border bg-secondary/30 hover:bg-secondary/70 hover:border-border/80 text-muted-foreground"
                      }`}
                    >
                      {/* Active Checkmark Pill */}
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-amber-500 dark:bg-amber-400 text-slate-950 flex items-center justify-center shadow-xs">
                          <Check size={10} strokeWidth={3.5} />
                        </div>
                      )}

                      <span className="text-2xl mb-1.5 select-none">{tier.emoji}</span>
                      <span className="font-display text-base sm:text-lg font-semibold leading-none mb-1 text-foreground">
                        ₹{tier.inrAmount}
                      </span>
                      <span className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground">
                        {tier.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="mb-7 space-y-3 relative z-10">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-muted-foreground font-bold select-none">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="10"
                    max="50000"
                    value={customAmount || ""}
                    onChange={(e) => {
                      const val = e.target.value === "" ? 0 : Number(e.target.value);
                      setCustomAmount(val);
                    }}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-secondary/30 text-foreground font-mono text-base font-semibold focus:outline-none focus:ring-2 transition-all placeholder:text-muted-foreground ${
                      customAmount > 0 && customAmount < 10
                        ? "border-rose-500/80 focus:ring-rose-500/40"
                        : "border-border focus:ring-amber-500/40"
                    }`}
                    placeholder="Enter amount (min ₹10)"
                  />
                </div>

                {customAmount > 0 && customAmount < 10 && (
                  <p className="text-xs text-rose-500 font-mono">
                    Minimum contribution amount is ₹10
                  </p>
                )}

                {/* Quick Chip Suggestions */}
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  <span className="text-[11px] text-muted-foreground mr-1 font-mono">Quick:</span>
                  {quickCustomChips.map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setCustomAmount(val)}
                      className={`text-xs px-2.5 py-1 rounded-lg border font-mono transition-all cursor-pointer ${
                        customAmount === val
                          ? "border-amber-500/80 dark:border-amber-400/80 bg-amber-500/10 dark:bg-amber-400/15 text-amber-600 dark:text-amber-400 font-semibold"
                          : "border-border bg-secondary/40 text-muted-foreground hover:text-foreground hover:bg-secondary/70"
                      }`}
                    >
                      ₹{val}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Payment Action Button */}
            <div className="space-y-4 relative z-10">
              <PaymentButton
                tier={!isCustom ? selected.id : undefined}
                amount={!isCustom ? selected.inrAmount : undefined}
                customAmount={isCustom ? Math.max(10, customAmount) : undefined}
                label={
                  isCustom
                    ? customAmount >= 10
                      ? `Support with ₹${customAmount}`
                      : "Enter at least ₹10"
                    : `Support with ₹${selected.inrAmount} (${selected.label})`
                }
                gradient="from-amber-500 via-orange-500 to-amber-600"
                theme={isDark ? "dark" : "light"}
              />

              {/* Clean, Single Trust Badge */}
              <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground pt-1">
                <Lock size={13} className="text-emerald-500 dark:text-emerald-400 shrink-0" />
                <span>256-bit Encrypted • UPI, GPay, PhonePe, Cards, NetBanking</span>
              </div>
            </div>

            {/* Subtle Buy Me a Coffee alternative for international visitors */}
            <div className="mt-6 pt-4 border-t border-border flex justify-center relative z-10">
              <a
                href={supportBaseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <span>International cards / USD? Support via Buy Me a Coffee</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SupporterRewards;
