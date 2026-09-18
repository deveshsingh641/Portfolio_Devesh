/**
 * Tactile Web Audio Synthesizer (0KB external assets, 100% native Web Audio API)
 * Procedurally generates subtle tactile mechanical clicks, hover pops, theme glides, and harmonic sweeps.
 */

class SoundService {
  private ctx: AudioContext | null = null;
  private isEnabled: boolean = false;
  private lastHoverTime: number = 0;
  private listeners: Set<(enabled: boolean) => void> = new Set();

  constructor() {
    if (typeof window !== "undefined") {
      // Check stored preference (default to false for respectful opt-in)
      const stored = localStorage.getItem("portfolio_sound");
      this.isEnabled = stored === "enabled";
    }
  }

  /**
   * Lazy initialization of AudioContext on first user interaction
   */
  private getContext(): AudioContext | null {
    if (typeof window === "undefined") return null;

    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }

    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }

    return this.ctx;
  }

  public getSoundEnabled(): boolean {
    return this.isEnabled;
  }

  public subscribe(listener: (enabled: boolean) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((l) => l(this.isEnabled));
  }

  public toggleSound(): boolean {
    this.isEnabled = !this.isEnabled;
    if (typeof window !== "undefined") {
      localStorage.setItem("portfolio_sound", this.isEnabled ? "enabled" : "disabled");
    }

    if (this.isEnabled) {
      this.getContext();
      // Play brief affirmative confirmation chime
      this.playAffirmativeChime();
    }

    this.notify();
    return this.isEnabled;
  }

  /**
   * Ultra-subtle muted tick for hovering over buttons, cards, and links
   */
  public playHover() {
    if (!this.isEnabled) return;
    const now = performance.now();
    // Throttle hover sounds so rapid mouse moves over lists don't overwhelm
    if (now - this.lastHoverTime < 50) return;
    this.lastHoverTime = now;

    const ctx = this.getContext();
    if (!ctx || ctx.state !== "running") return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = "bandpass";
      filter.frequency.setValueAtTime(1400, ctx.currentTime);
      filter.Q.setValueAtTime(3.5, ctx.currentTime);

      osc.type = "sine";
      osc.frequency.setValueAtTime(950, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(450, ctx.currentTime + 0.025);

      gain.gain.setValueAtTime(0.035, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.025);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.03);
    } catch {
      // AudioContext fallback
    }
  }

  /**
   * Crisp tactile mechanical switch click on button presses
   */
  public playClick() {
    if (!this.isEnabled) return;
    const ctx = this.getContext();
    if (!ctx || ctx.state !== "running") return;

    try {
      const t = ctx.currentTime;

      // Layer 1: High crisp transient impulse
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(2200, t);
      osc1.frequency.exponentialRampToValueAtTime(800, t + 0.02);
      gain1.gain.setValueAtTime(0.065, t);
      gain1.gain.exponentialRampToValueAtTime(0.0001, t + 0.02);

      // Layer 2: Muted body thud
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(420, t);
      osc2.frequency.exponentialRampToValueAtTime(120, t + 0.035);
      gain2.gain.setValueAtTime(0.07, t);
      gain2.gain.exponentialRampToValueAtTime(0.0001, t + 0.035);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);

      osc1.start(t);
      osc1.stop(t + 0.025);

      osc2.start(t);
      osc2.stop(t + 0.04);
    } catch {
      // Fallback
    }
  }

  /**
   * Pitch-gliding harmonic sweep when toggling Light / Dark mode
   */
  public playThemeSwitch(isDark: boolean) {
    if (!this.isEnabled) return;
    const ctx = this.getContext();
    if (!ctx || ctx.state !== "running") return;

    try {
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      if (isDark) {
        // Glides down to deep cosmic tone
        osc.frequency.setValueAtTime(740, t);
        osc.frequency.exponentialRampToValueAtTime(320, t + 0.16);
      } else {
        // Glides up to bright daylight tone
        osc.frequency.setValueAtTime(360, t);
        osc.frequency.exponentialRampToValueAtTime(880, t + 0.16);
      }

      gain.gain.setValueAtTime(0.06, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.2);
    } catch {
      // Fallback
    }
  }

  /**
   * Atmospheric harmonic sweep when the welcome intro finishes and unveils the hero
   */
  public playIntroSweep() {
    if (!this.isEnabled) return;
    const ctx = this.getContext();
    if (!ctx || ctx.state !== "running") return;

    try {
      const t = ctx.currentTime;
      // Soft pentatonic cosmic harmonic chord
      const freqs = [329.63, 392.0, 523.25, 659.25]; // E4, G4, C5, E5
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, t + idx * 0.04);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.05, t + idx * 0.04 + 0.35);

        gain.gain.setValueAtTime(0.0001, t + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.035, t + idx * 0.04 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + idx * 0.04 + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(t + idx * 0.04);
        osc.stop(t + idx * 0.04 + 0.45);
      });
    } catch {
      // Fallback
    }
  }

  /**
   * Gentle affirmative chime when sound is unmuted
   */
  private playAffirmativeChime() {
    const ctx = this.getContext();
    if (!ctx || ctx.state !== "running") return;

    try {
      const t = ctx.currentTime;
      const notes = [587.33, 880.0]; // D5, A5
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, t + idx * 0.07);

        gain.gain.setValueAtTime(0.055, t + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + idx * 0.07 + 0.18);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(t + idx * 0.07);
        osc.stop(t + idx * 0.07 + 0.2);
      });
    } catch {
      // Fallback
    }
  }

  /**
   * Modal open pop
   */
  public playModalOpen() {
    if (!this.isEnabled) return;
    const ctx = this.getContext();
    if (!ctx || ctx.state !== "running") return;

    try {
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(440, t);
      osc.frequency.exponentialRampToValueAtTime(720, t + 0.12);

      gain.gain.setValueAtTime(0.05, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.15);
    } catch {
      // Fallback
    }
  }

  /**
   * Modal close pop
   */
  public playModalClose() {
    if (!this.isEnabled) return;
    const ctx = this.getContext();
    if (!ctx || ctx.state !== "running") return;

    try {
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(680, t);
      osc.frequency.exponentialRampToValueAtTime(360, t + 0.1);

      gain.gain.setValueAtTime(0.045, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.13);
    } catch {
      // Fallback
    }
  }
}

export const soundService = new SoundService();
