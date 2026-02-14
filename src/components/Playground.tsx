import React, { useState, useRef } from "react";
import { Play, Copy, Check, RotateCcw, Terminal, Code2, Palette, Sparkles, Zap, Gamepad2, Sliders } from "lucide-react";

/* ───────────────────── CODE SNIPPETS TAB ───────────────────── */

interface CodeSnippet {
  id: string;
  title: string;
  language: string;
  code: string;
  output: string;
  description: string;
}

const snippets: CodeSnippet[] = [
  {
    id: "fizzbuzz",
    title: "FizzBuzz",
    language: "javascript",
    code: `function fizzBuzz(n) {
  const result = [];
  for (let i = 1; i <= n; i++) {
    if (i % 15 === 0) result.push("FizzBuzz");
    else if (i % 3 === 0) result.push("Fizz");
    else if (i % 5 === 0) result.push("Buzz");
    else result.push(i);
  }
  return result;
}

console.log(fizzBuzz(20).join(", "));`,
    output: "1, 2, Fizz, 4, Buzz, Fizz, 7, 8, Fizz, Buzz, 11, Fizz, 13, 14, FizzBuzz, 16, 17, Fizz, 19, Buzz",
    description: "The classic interview warm-up. Divisibility checks with clean logic.",
  },
  {
    id: "debounce",
    title: "Debounce",
    language: "typescript",
    code: `function debounce<T extends (...args: any[]) => void>(
  fn: T, delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

const search = debounce((q: string) => {
  console.log("Searching:", q);
}, 300);

search("react");
search("react hooks"); // Only this fires`,
    output: 'Searching: react hooks',
    description: "Production-grade debounce with TypeScript generics. Essential for search inputs.",
  },
  {
    id: "flatten",
    title: "Deep Flatten",
    language: "javascript",
    code: `function deepFlatten(arr) {
  return arr.reduce((acc, val) =>
    Array.isArray(val)
      ? acc.concat(deepFlatten(val))
      : acc.concat(val),
    []
  );
}

const nested = [1, [2, [3, [4, 5]]], [6, 7]];
console.log(deepFlatten(nested));`,
    output: "[1, 2, 3, 4, 5, 6, 7]",
    description: "Recursive flatten — a common DSA pattern for nested data structures.",
  },
  {
    id: "curry",
    title: "Currying",
    language: "typescript",
    code: `function curry(fn: Function) {
  return function curried(...args: any[]): any {
    if (args.length >= fn.length)
      return fn(...args);
    return (...more: any[]) =>
      curried(...args, ...more);
  };
}

const add = curry((a: number, b: number, c: number) =>
  a + b + c
);

console.log(add(1)(2)(3));   // 6
console.log(add(1, 2)(3));   // 6`,
    output: "6\n6",
    description: "Functional programming essential. Transform multi-argument functions into composable chains.",
  },
  {
    id: "memoize",
    title: "Memoize",
    language: "typescript",
    code: `function memoize<T extends (...args: any[]) => any>(
  fn: T
): T {
  const cache = new Map<string, ReturnType<T>>();
  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      console.log("Cache hit:", key);
      return cache.get(key)!;
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

const factorial = memoize((n: number): number =>
  n <= 1 ? 1 : n * factorial(n - 1)
);

console.log(factorial(5));  // 120
console.log(factorial(5));  // Cache hit`,
    output: "120\nCache hit: [5]\n120",
    description: "Map-based caching. Dramatically speeds up recursive or expensive computations.",
  },
];

/* ───────────────────── GLASSMORPHISM LAB ───────────────────── */

interface GlassControls {
  blur: number;
  transparency: number;
  borderRadius: number;
  tilt: boolean;
  bgMood: "mix" | "sunset" | "ocean" | "forest" | "neon";
  contentPreview: "profile" | "credit" | "app";
}

const bgMoodColors: Record<string, string> = {
  mix: "from-violet-600 via-pink-500 to-amber-400",
  sunset: "from-orange-500 via-rose-500 to-purple-600",
  ocean: "from-cyan-500 via-blue-500 to-indigo-600",
  forest: "from-emerald-500 via-green-500 to-teal-600",
  neon: "from-fuchsia-500 via-violet-500 to-cyan-400",
};

/* ───────────────────── COMPONENT ───────────────────── */

const Playground: React.FC<{ theme: string }> = ({ theme }) => {
  const [activeTab, setActiveTab] = useState<"glass" | "code">("glass");

  // Code snippet state
  const [activeId, setActiveId] = useState(snippets[0].id);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [running, setRunning] = useState<string | null>(null);
  const [outputs, setOutputs] = useState<Record<string, string | null>>({});

  // Glass lab state
  const [glass, setGlass] = useState<GlassControls>({
    blur: 16,
    transparency: 70,
    borderRadius: 24,
    tilt: true,
    bgMood: "mix",
    contentPreview: "profile",
  });
  const [cssCopied, setCssCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [tiltStyle, setTiltStyle] = useState({ transform: "" });

  const active = snippets.find((s) => s.id === activeId)!;

  /* ── Code helpers ── */
  const handleCopy = async (code: string, id: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch { /* ignore */ }
  };

  const handleRun = (snippet: CodeSnippet) => {
    setRunning(snippet.id);
    setOutputs((prev) => ({ ...prev, [snippet.id]: null }));
    setTimeout(() => {
      setOutputs((prev) => ({ ...prev, [snippet.id]: snippet.output }));
      setRunning(null);
    }, 800);
  };

  const handleReset = (id: string) => {
    setOutputs((prev) => ({ ...prev, [id]: null }));
  };

  /* ── Glass helpers ── */
  const generatedCSS = `.glass-card {
  backdrop-filter: blur(${glass.blur}px);
  -webkit-backdrop-filter: blur(${glass.blur}px);
  background: rgba(255, 255, 255, ${(glass.transparency / 100).toFixed(2)});
  border-radius: ${glass.borderRadius}px;
  border: 1px solid rgba(255, 255, 255, 0.18);
}`;

  const copyCSS = async () => {
    try {
      await navigator.clipboard.writeText(generatedCSS);
      setCssCopied(true);
      setTimeout(() => setCssCopied(false), 2000);
    } catch { /* ignore */ }
  };

  const handleTiltMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!glass.tilt || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTiltStyle({
      transform: `perspective(800px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) scale3d(1.02,1.02,1.02)`,
    });
  };

  const handleTiltLeave = () => {
    setTiltStyle({ transform: "perspective(800px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1)" });
  };

  return (
    <div className="space-y-10">
      {/* Section Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Sparkles size={14} className="text-emerald-400" />
          <span className="text-xs font-mono uppercase tracking-[0.3em] text-emerald-400">Experimental Zone</span>
        </div>
        <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
          Interactive{" "}
          <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent">
            Playground
          </span>
        </h2>
        <p className={`text-lg max-w-2xl mx-auto ${theme === "dark" ? "text-slate-300" : "text-slate-600"}`}>
          Welcome to my digital laboratory. Experiment with interactive design patterns,
          animations, and code snippets. Go ahead — break things!
        </p>
        <div className="w-32 h-1.5 bg-gradient-to-r from-emerald-600 via-cyan-500 to-violet-500 mx-auto rounded-full shadow-lg shadow-emerald-400/50 mt-5" />
      </div>

      {/* Tab Switcher */}
      <div className="flex justify-center">
        <div className={`inline-flex rounded-xl p-1 border ${theme === "dark" ? "bg-slate-800/60 border-slate-700/50" : "bg-slate-100 border-slate-200"}`}>
          {[
            { id: "glass" as const, label: "Glassmorphism Lab", icon: Palette },
            { id: "code" as const, label: "Code Snippets", icon: Code2 },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${
                activeTab === id
                  ? "bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-400 shadow-md"
                  : theme === "dark"
                    ? "text-slate-400 hover:text-slate-200"
                    : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ═══════════ GLASSMORPHISM LAB TAB ═══════════ */}
      {activeTab === "glass" && (
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Live Preview */}
          <div className="order-2 lg:order-1">
            <div className={`relative rounded-2xl overflow-hidden h-[420px] ${theme === "dark" ? "border border-slate-700/40" : "border border-slate-200"}`}>
              {/* Animated background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${bgMoodColors[glass.bgMood]} animate-gradient-shift`} />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.15),transparent_60%)]" />

              {/* Glass card */}
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <div
                  ref={cardRef}
                  onMouseMove={handleTiltMove}
                  onMouseLeave={handleTiltLeave}
                  style={{
                    backdropFilter: `blur(${glass.blur}px)`,
                    WebkitBackdropFilter: `blur(${glass.blur}px)`,
                    background: `rgba(255, 255, 255, ${glass.transparency / 100})`,
                    borderRadius: `${glass.borderRadius}px`,
                    border: "1px solid rgba(255, 255, 255, 0.18)",
                    transition: "transform 0.15s ease-out",
                    ...tiltStyle,
                  }}
                  className="w-full max-w-xs shadow-2xl"
                >
                  {/* Content Preview: Profile */}
                  {glass.contentPreview === "profile" && (
                    <div className="p-6 text-center">
                      <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-violet-400 to-cyan-400 flex items-center justify-center text-white text-2xl font-bold mb-3 shadow-lg">
                        D
                      </div>
                      <h4 className="text-white font-bold text-lg drop-shadow-md">Devesh Singh</h4>
                      <p className="text-white/80 text-sm mb-4">Full-Stack Developer</p>
                      <div className="flex justify-center gap-4 text-white/70 text-xs">
                        <span>5+ Projects</span>
                        <span>•</span>
                        <span>India</span>
                      </div>
                    </div>
                  )}

                  {/* Content Preview: Credit Card */}
                  {glass.contentPreview === "credit" && (
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-8">
                        <div className="w-10 h-7 rounded bg-gradient-to-r from-amber-300 to-yellow-400 shadow-inner" />
                        <span className="text-white/60 text-xs font-mono tracking-wider">VISA</span>
                      </div>
                      <div className="text-white font-mono text-lg tracking-[0.25em] mb-6 drop-shadow-md">
                        •••• •••• •••• 4242
                      </div>
                      <div className="flex justify-between text-white/70 text-xs">
                        <div>
                          <div className="text-[9px] uppercase tracking-wider mb-0.5 text-white/40">HOLDER</div>
                          <div>DEVESH SINGH</div>
                        </div>
                        <div>
                          <div className="text-[9px] uppercase tracking-wider mb-0.5 text-white/40">EXPIRES</div>
                          <div>12/28</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Content Preview: App Card */}
                  {glass.contentPreview === "app" && (
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shadow-lg">
                          <Zap size={18} className="text-white" />
                        </div>
                        <div>
                          <h4 className="text-white font-bold text-sm drop-shadow-md">Productivity</h4>
                          <p className="text-white/60 text-xs">Dashboard v2.0</p>
                        </div>
                      </div>
                      <div className="space-y-2.5">
                        {[
                          { label: "Tasks Completed", value: "87%", w: "w-[87%]" },
                          { label: "Code Quality", value: "94%", w: "w-[94%]" },
                          { label: "Sprint Progress", value: "62%", w: "w-[62%]" },
                        ].map(({ label, value, w }) => (
                          <div key={label}>
                            <div className="flex justify-between text-[10px] text-white/70 mb-1">
                              <span>{label}</span>
                              <span>{value}</span>
                            </div>
                            <div className="h-1.5 rounded-full bg-white/20 overflow-hidden">
                              <div className={`h-full ${w} rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all duration-700`} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Controls Panel */}
          <div className="order-1 lg:order-2 space-y-6">
            <div className={`rounded-2xl border p-6 ${theme === "dark" ? "border-slate-700/40 bg-slate-900/60" : "border-slate-200 bg-white"}`}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Sliders size={14} className="text-emerald-400" />
                  <h3 className={`text-sm font-bold ${theme === "dark" ? "text-slate-200" : "text-slate-800"}`}>Glassmorphism Lab</h3>
                </div>
                <button
                  type="button"
                  onClick={copyCSS}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    cssCopied
                      ? "bg-emerald-500/20 text-emerald-400"
                      : theme === "dark"
                        ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {cssCopied ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy CSS</>}
                </button>
              </div>

              {/* Content Preview Tabs */}
              <div className="mb-6">
                <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>
                  Content Preview
                </label>
                <div className="flex gap-2">
                  {([["profile", "Profile"], ["credit", "Credit"], ["app", "App"]] as const).map(([val, label]) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setGlass((p) => ({ ...p, contentPreview: val }))}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all border ${
                        glass.contentPreview === val
                          ? theme === "dark"
                            ? "bg-emerald-500/15 border-emerald-400/40 text-emerald-300"
                            : "bg-emerald-50 border-emerald-300 text-emerald-700"
                          : theme === "dark"
                            ? "bg-slate-800/40 border-slate-700/50 text-slate-400 hover:border-slate-600"
                            : "bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Background Mood */}
              <div className="mb-6">
                <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>
                  Background Mood
                </label>
                <div className="flex gap-2">
                  {(["mix", "sunset", "ocean", "forest", "neon"] as const).map((mood) => (
                    <button
                      key={mood}
                      type="button"
                      onClick={() => setGlass((p) => ({ ...p, bgMood: mood }))}
                      className={`flex-1 h-8 rounded-lg bg-gradient-to-r ${bgMoodColors[mood]} transition-all duration-300 border-2 ${
                        glass.bgMood === mood
                          ? "border-white shadow-lg scale-110"
                          : "border-transparent opacity-60 hover:opacity-80"
                      }`}
                      title={mood}
                    />
                  ))}
                </div>
              </div>

              {/* Sliders */}
              {[
                { key: "blur" as const, label: "Backdrop Blur", min: 0, max: 40, unit: "px" },
                { key: "transparency" as const, label: "Transparency", min: 5, max: 95, unit: "%" },
                { key: "borderRadius" as const, label: "Border Radius", min: 0, max: 48, unit: "px" },
              ].map(({ key, label, min, max, unit }) => (
                <div key={key} className="mb-5">
                  <div className="flex justify-between items-center mb-2">
                    <label className={`text-xs font-bold uppercase tracking-wider ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>
                      {label}
                    </label>
                    <span className={`text-xs font-mono ${theme === "dark" ? "text-emerald-400" : "text-emerald-600"}`}>
                      {glass[key]}{unit}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={min}
                    max={max}
                    value={glass[key]}
                    onChange={(e) => setGlass((p) => ({ ...p, [key]: Number(e.target.value) }))}
                    className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-emerald-500 bg-slate-600/30"
                  />
                </div>
              ))}

              {/* Tilt Toggle */}
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold uppercase tracking-wider ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>
                  Interactive Tilt
                </span>
                <button
                  type="button"
                  onClick={() => setGlass((p) => ({ ...p, tilt: !p.tilt }))}
                  className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${
                    glass.tilt ? "bg-emerald-500" : theme === "dark" ? "bg-slate-700" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${
                      glass.tilt ? "translate-x-5" : ""
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { emoji: "🎨", title: "Dynamic Theming", desc: "Real-time color and material updates" },
                { emoji: "⚡", title: "Performance", desc: "Optimized rendering pipeline" },
                { emoji: "🕹️", title: "Interactive", desc: "Intuitive controls & feedback" },
              ].map(({ emoji, title, desc }) => (
                <div
                  key={title}
                  className={`text-center p-3 rounded-xl border transition-all hover:-translate-y-0.5 ${
                    theme === "dark"
                      ? "border-slate-700/30 bg-slate-900/40 hover:border-emerald-500/30"
                      : "border-slate-200 bg-white/80 hover:border-emerald-400/30"
                  }`}
                >
                  <span className="text-xl mb-1 block">{emoji}</span>
                  <h4 className={`text-xs font-bold mb-0.5 ${theme === "dark" ? "text-slate-200" : "text-slate-800"}`}>{title}</h4>
                  <p className="text-[10px] text-slate-500">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════ CODE SNIPPETS TAB ═══════════ */}
      {activeTab === "code" && (
        <div className="space-y-6">
          {/* Snippet tabs */}
          <div className="flex flex-wrap gap-2 justify-center">
            {snippets.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setActiveId(s.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide uppercase transition-all duration-300 border ${
                  s.id === activeId
                    ? theme === "dark"
                      ? "bg-emerald-500/15 text-emerald-300 border-emerald-400/40 shadow-lg shadow-emerald-500/10"
                      : "bg-emerald-500/10 text-emerald-700 border-emerald-400/40"
                    : theme === "dark"
                      ? "bg-slate-800/40 text-slate-400 border-slate-700/50 hover:text-slate-200"
                      : "bg-white text-slate-500 border-slate-200 hover:text-slate-700"
                }`}
              >
                {s.title}
              </button>
            ))}
          </div>

          {/* Active snippet */}
          <div className={`rounded-2xl border overflow-hidden ${theme === "dark" ? "border-slate-700/40 bg-slate-900/60" : "border-slate-200 bg-white"}`}>
            {/* Snippet header */}
            <div className={`flex items-center justify-between px-5 py-3 border-b ${theme === "dark" ? "border-slate-700/40 bg-slate-800/40" : "border-slate-200 bg-slate-50"}`}>
              <div className="flex items-center gap-3">
                <Code2 size={14} className="text-emerald-400" />
                <span className={`text-sm font-bold ${theme === "dark" ? "text-slate-200" : "text-slate-800"}`}>{active.title}</span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${theme === "dark" ? "border-slate-700 bg-slate-800 text-slate-400" : "border-slate-200 bg-slate-100 text-slate-500"}`}>
                  {active.language}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopy(active.code, active.id)}
                  className={`p-1.5 rounded-lg transition-colors ${theme === "dark" ? "hover:bg-slate-700 text-slate-400" : "hover:bg-slate-200 text-slate-500"}`}
                  title="Copy code"
                >
                  {copiedId === active.id ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                </button>
                <button
                  type="button"
                  onClick={() => handleReset(active.id)}
                  className={`p-1.5 rounded-lg transition-colors ${theme === "dark" ? "hover:bg-slate-700 text-slate-400" : "hover:bg-slate-200 text-slate-500"}`}
                  title="Reset output"
                >
                  <RotateCcw size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => handleRun(active)}
                  disabled={running === active.id}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors disabled:opacity-50"
                >
                  <Play size={12} /> {running === active.id ? "Running..." : "Run"}
                </button>
              </div>
            </div>

            {/* Code block */}
            <div className="px-5 py-4 overflow-x-auto">
              <pre className={`text-sm font-mono leading-relaxed whitespace-pre ${theme === "dark" ? "text-slate-300" : "text-slate-700"}`}>
                {active.code}
              </pre>
            </div>

            {/* Output */}
            {outputs[active.id] !== undefined && outputs[active.id] !== null && (
              <div className={`border-t px-5 py-4 ${theme === "dark" ? "border-slate-700/40 bg-slate-950/50" : "border-slate-200 bg-slate-50"}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Terminal size={12} className="text-emerald-400" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Output</span>
                </div>
                <pre className={`text-sm font-mono whitespace-pre-wrap ${theme === "dark" ? "text-emerald-300" : "text-emerald-700"}`}>
                  {outputs[active.id]}
                </pre>
              </div>
            )}

            {/* Description */}
            <div className={`border-t px-5 py-3 ${theme === "dark" ? "border-slate-700/40" : "border-slate-200"}`}>
              <p className={`text-xs leading-relaxed ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>
                {active.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Playground;
