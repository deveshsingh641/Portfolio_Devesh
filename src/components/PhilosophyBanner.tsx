import React from "react";

interface PhilosophyBannerProps {
  theme?: string;
}

const PhilosophyBanner: React.FC<PhilosophyBannerProps> = () => {
  return (
    <section className="py-24 px-6 bg-black relative overflow-hidden">
      <div className="max-w-5xl mx-auto">
        {/* Massive Purple Gradient Rounded Container */}
        <div className="relative rounded-[2.5rem] border border-purple-500/30 bg-gradient-to-br from-purple-950/70 via-purple-900/30 to-black p-8 sm:p-14 lg:p-16 shadow-[0_0_60px_rgba(168,85,247,0.25)] overflow-hidden">
          {/* Ambient light glow inside */}
          <div className="absolute top-1/2 right-10 -translate-y-1/2 w-80 h-80 bg-purple-600/20 rounded-full blur-[100px] pointer-events-none" />

          {/* Top-left giant quotes */}
          <div className="font-serif text-6xl sm:text-8xl text-purple-400/25 leading-none select-none mb-2">
            “
          </div>

          <div className="relative z-10 max-w-3xl">
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-[1.2] mb-6">
              Building software that delights users and drives impact.
            </h2>
            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-2xl mb-8">
              No more trade-offs between clean architecture and performance — systems that create harmony where user experience and scalability thrive together.
            </p>
            <p className="font-display text-sm sm:text-base text-neutral-400 italic">
              ——— Devesh Singh
            </p>
          </div>

          {/* Bottom-right giant quotes */}
          <div className="absolute bottom-6 right-8 sm:right-12 font-serif text-6xl sm:text-8xl text-purple-400/20 leading-none select-none pointer-events-none">
            ”
          </div>
        </div>

        {/* Bottom Circular Lens Indicator */}
        <div className="mt-14 flex justify-center">
          <a
            href="#about"
            className="w-10 h-10 rounded-full border border-neutral-800 bg-neutral-900/80 hover:border-purple-500/50 flex items-center justify-center text-purple-400 transition-all hover:scale-110 shadow-lg shadow-purple-500/10"
            aria-label="Scroll to About"
          >
            <div className="w-4 h-4 rounded-full border-2 border-current flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-current" />
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};

export default PhilosophyBanner;
