import React, { useState, useEffect, useRef } from "react";

interface TerminalWindowProps {
  theme: string;
  setTheme: (theme: string) => void;
  onClose?: () => void;
}

interface LogLine {
  text: string;
  type: "system" | "input" | "output" | "error" | "success";
}

export const TerminalWindow: React.FC<TerminalWindowProps> = ({ theme, setTheme }) => {
  const [history, setHistory] = useState<LogLine[]>([
    { text: "DeveshOS v1.1.2 (kernel 6.2.0-generic-x86_64)", type: "system" },
    { text: "System initialization complete. 1024MB RAM allocated.", type: "system" },
    { text: "Type 'help' for a list of commands, or 'play retro-game' to start.", type: "system" },
    { text: "--------------------------------------------------------", type: "system" }
  ]);
  const [command, setCommand] = useState("");
  const [gameMode, setGameMode] = useState<"idle" | "snake">("idle");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Snake Game states
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameScore, setGameScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    try {
      return parseInt(localStorage.getItem("terminal_snake_highscore") || "0", 10);
    } catch {
      return 0;
    }
  });
  const [gameStatus, setGameStatus] = useState<"start" | "playing" | "gameover" | "paused">("start");

  // Web Audio Synth for retro sound effects
  const playSound = (type: "eat" | "die" | "tick" | "start") => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === "eat") {
        // High pitch beep-boop
        osc.type = "square";
        osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.08); // E5
        gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.2);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.2);
      } else if (type === "die") {
        // Downward slide buzz
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(150, audioCtx.currentTime);
        osc.frequency.linearRampToValueAtTime(40, audioCtx.currentTime + 0.45);
        gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.5);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.5);
      } else if (type === "tick") {
        // Quiet high-hat style tick
        osc.type = "sine";
        osc.frequency.setValueAtTime(1200, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.01, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.03);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.03);
      } else if (type === "start") {
        // Arpeggio
        const notes = [261.63, 329.63, 392.00, 523.25];
        osc.type = "triangle";
        gain.gain.setValueAtTime(0.03, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.4);
        notes.forEach((freq, idx) => {
          osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.08);
        });
        osc.start();
        osc.stop(audioCtx.currentTime + 0.45);
      }
    } catch { /* ignore audio errors */ }
  };

  useEffect(() => {
    if (gameMode === "idle") {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      inputRef.current?.focus();
    }
  }, [history, gameMode]);

  // Command processor
  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCmd = command.trim().toLowerCase();
    const cmdTokens = cleanCmd.split(" ");
    const baseCmd = cmdTokens[0];

    const newHistory = [...history, { text: `devesh@DeveshOS:~$ ${command}`, type: "input" as const }];

    if (cleanCmd === "") {
      setHistory(newHistory);
      setCommand("");
      return;
    }

    switch (baseCmd) {
      case "help":
        newHistory.push(
          { text: "Available commands:", type: "system" },
          { text: "  help          - Display this listing.", type: "output" },
          { text: "  cat resume    - Read Devesh's profile overview.", type: "output" },
          { text: "  cat skills    - List languages, databases, & technologies.", type: "output" },
          { text: "  clear         - Clear terminal history.", type: "output" },
          { text: "  theme toggle  - Toggle the page styling mood (light/dark).", type: "output" },
          { text: "  play snake    - Launch the retro Snake arcade canvas game.", type: "output" },
          { text: "  play retro-game - Same as 'play snake'.", type: "output" },
          { text: "  glitch        - Trigger a cyberpunk visual screen distortion.", type: "output" },
          { text: "  matrix        - Toggle a green CRT phosphor theme on the portfolio.", type: "output" },
          { text: "  screensaver   - Start the falling digital rain Matrix screensaver.", type: "output" }
        );
        break;

      case "clear":
        setHistory([]);
        setCommand("");
        return;

      case "glitch":
        window.dispatchEvent(new CustomEvent("trigger-glitch"));
        newHistory.push({ text: "Alert: Cyberpunk screen glitch triggered.", type: "success" });
        break;

      case "matrix":
        window.dispatchEvent(new CustomEvent("trigger-matrix-theme"));
        newHistory.push({ text: "Alert: Green CRT Matrix theme toggled.", type: "success" });
        break;

      case "screensaver":
        window.dispatchEvent(new CustomEvent("trigger-screensaver"));
        newHistory.push({ text: "Alert: Matrix screensaver activated.", type: "success" });
        break;

      case "cat":
        const file = cmdTokens[1];
        if (file === "resume") {
          newHistory.push(
            { text: "================= DEVESH SINGH =================", type: "success" },
            { text: "Full Stack Developer (MERN)", type: "success" },
            { text: "Location: Ghaziabad, Uttar Pradesh, India", type: "output" },
            { text: "Email: deveshsingh20666@gmail.com | Portfolio: deveshdev.live", type: "output" },
            { text: "--------------------------------------------------------", type: "system" },
            { text: "SUMMARY:", type: "success" },
            { text: "Full Stack Developer skilled in Node.js, React, Express, and MongoDB. Experienced in schema design, API security (JWT, RBAC), and robust automated workflows via GitHub Actions. Active problem solver with 500+ solved DSA challenges.", type: "output" },
            { text: "--------------------------------------------------------", type: "system" },
            { text: "EDUCATION:", type: "success" },
            { text: "  - B.Tech (Information Technology) @ ABES Engineering College [CGPA: 8.0/10.0]", type: "output" },
            { text: "  - Intermediate (CBSE) @ Sant Atulanand Convent School [89.02%]", type: "output" },
            { text: "  - High School (CBSE) @ Sant Atulanand Convent School [94.6%]", type: "output" }
          );
        } else if (file === "skills") {
          newHistory.push(
            { text: "================ TECHNICAL SKILLS ================", type: "success" },
            { text: "  Languages : JavaScript (ES6+), TypeScript, C++, SQL", type: "output" },
            { text: "  Front-End : React.js, Tailwind CSS, HTML5, CSS3, Vite", type: "output" },
            { text: "  Back-End  : Node.js, Express.js, RESTful API design, JWT auth", type: "output" },
            { text: "  Databases : MongoDB, MySQL, Mongoose ODM", type: "output" },
            { text: "  Tools/DevOps: Git, GitHub, Actions, Vercel, Postman", type: "output" }
          );
        } else if (!file) {
          newHistory.push({ text: "Error: Please specify a file name (e.g. 'cat resume' or 'cat skills').", type: "error" });
        } else {
          newHistory.push({ text: `cat: ${file}: No such file or directory.`, type: "error" });
        }
        break;

      case "theme":
        if (cmdTokens[1] === "toggle") {
          setTheme(theme === "dark" ? "light" : "dark");
          newHistory.push({ text: `System theme toggled to: ${theme === "dark" ? "light" : "dark"} mode.`, type: "success" });
        } else {
          newHistory.push({ text: "Usage: 'theme toggle'", type: "error" });
        }
        break;

      case "play":
        const target = cmdTokens[1];
        if (target === "snake" || target === "retro-game" || !target) {
          playSound("start");
          setGameMode("snake");
          setGameStatus("start");
          setGameScore(0);
          setCommand("");
          return;
        } else {
          newHistory.push({ text: `Unknown game '${target}'. Type 'play snake' to play the retro game.`, type: "error" });
        }
        break;

      default:
        newHistory.push({ text: `DeveshOS: ${baseCmd}: command not found. Type 'help' for commands.`, type: "error" });
        break;
    }

    setHistory(newHistory);
    setCommand("");
  };

  // Snake game implementation loop
  useEffect(() => {
    if (gameMode !== "snake") return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const grid = 15;
    const canvasSize = 300; // 20x20 grid
    let snake = [
      { x: 7 * grid, y: 10 * grid },
      { x: 6 * grid, y: 10 * grid },
      { x: 5 * grid, y: 10 * grid }
    ];
    let dx = grid;
    let dy = 0;
    let food = { x: 12 * grid, y: 10 * grid };
    let score = 0;
    let localStatus = "start";

    const generateFood = () => {
      let rx, ry;
      let onSnake = true;
      while (onSnake) {
        rx = Math.floor(Math.random() * (canvasSize / grid)) * grid;
        ry = Math.floor(Math.random() * (canvasSize / grid)) * grid;
        onSnake = snake.some((segment) => segment.x === rx && segment.y === ry);
      }
      return { x: rx!, y: ry! };
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space", " "].includes(e.key)) {
        e.preventDefault(); // Stop window scroll
      }

      if (e.key === "Escape") {
        setGameMode("idle");
        setHistory((prev) => [...prev, { text: "Snake Game session ended.", type: "system" }]);
        return;
      }

      if (e.key === " " || e.key === "Spacebar") {
        if (localStatus === "playing") {
          localStatus = "paused";
          setGameStatus("paused");
        } else if (localStatus === "paused") {
          localStatus = "playing";
          setGameStatus("playing");
        }
        return;
      }

      if (localStatus === "start" && ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        localStatus = "playing";
        setGameStatus("playing");
      }

      if (localStatus !== "playing") return;

      playSound("tick");
      if (e.key === "ArrowUp" && dy === 0) {
        dx = 0;
        dy = -grid;
      } else if (e.key === "ArrowDown" && dy === 0) {
        dx = 0;
        dy = grid;
      } else if (e.key === "ArrowLeft" && dx === 0) {
        dx = -grid;
        dy = 0;
      } else if (e.key === "ArrowRight" && dx === 0) {
        dx = grid;
        dy = 0;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    let gameInterval: any;

    const gameLoop = () => {
      if (localStatus !== "playing") {
        // Render static screen (start, paused, gameover)
        ctx.fillStyle = "#020617";
        ctx.fillRect(0, 0, canvasSize, canvasSize);

        // Grid
        ctx.strokeStyle = "rgba(16, 185, 129, 0.05)";
        for (let i = 0; i <= canvasSize; i += grid) {
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(i, canvasSize);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(0, i);
          ctx.lineTo(canvasSize, i);
          ctx.stroke();
        }

        // Draw food
        ctx.fillStyle = "#f43f5e";
        ctx.fillRect(food.x + 1, food.y + 1, grid - 2, grid - 2);

        // Draw Snake
        snake.forEach((segment, idx) => {
          ctx.fillStyle = idx === 0 ? "#10b981" : "#059669";
          ctx.fillRect(segment.x + 1, segment.y + 1, grid - 2, grid - 2);
        });

        if (localStatus === "start") {
          ctx.fillStyle = "rgba(2, 6, 23, 0.85)";
          ctx.fillRect(0, 0, canvasSize, canvasSize);
          ctx.fillStyle = "#10b981";
          ctx.font = "bold 13px Courier New";
          ctx.textAlign = "center";
          ctx.fillText("NEON RETRO SNAKE", canvasSize / 2, canvasSize / 2 - 20);
          ctx.fillStyle = "#22d3ee";
          ctx.font = "11px Courier New";
          ctx.fillText("PRESS ANY ARROW KEY TO START", canvasSize / 2, canvasSize / 2 + 10);
          ctx.fillStyle = "#64748b";
          ctx.font = "9px Courier New";
          ctx.fillText("Press ESC to Exit | SPACE to Pause", canvasSize / 2, canvasSize / 2 + 35);
        } else if (localStatus === "paused") {
          ctx.fillStyle = "rgba(2, 6, 23, 0.85)";
          ctx.fillRect(0, 0, canvasSize, canvasSize);
          ctx.fillStyle = "#fbbf24";
          ctx.font = "bold 16px Courier New";
          ctx.textAlign = "center";
          ctx.fillText("GAME PAUSED", canvasSize / 2, canvasSize / 2 - 10);
          ctx.fillStyle = "#e2e8f0";
          ctx.font = "11px Courier New";
          ctx.fillText("PRESS SPACE TO RESUME", canvasSize / 2, canvasSize / 2 + 15);
        } else if (localStatus === "gameover") {
          ctx.fillStyle = "rgba(2, 6, 23, 0.9)";
          ctx.fillRect(0, 0, canvasSize, canvasSize);
          ctx.fillStyle = "#ef4444";
          ctx.font = "bold 18px Courier New";
          ctx.textAlign = "center";
          ctx.fillText("GAME OVER", canvasSize / 2, canvasSize / 2 - 25);
          ctx.fillStyle = "#ffffff";
          ctx.font = "12px Courier New";
          ctx.fillText(`SCORE: ${score}`, canvasSize / 2, canvasSize / 2 + 5);
          ctx.fillStyle = "#10b981";
          ctx.fillText(`HIGH SCORE: ${highScore}`, canvasSize / 2, canvasSize / 2 + 25);
          ctx.fillStyle = "#38bdf8";
          ctx.font = "10px Courier New";
          ctx.fillText("PRESS ANY KEY TO PLAY AGAIN", canvasSize / 2, canvasSize / 2 + 50);
        }
        return;
      }

      // Update snake position
      const head = { x: snake[0].x + dx, y: snake[0].y + dy };

      // Self collision or wall collision check
      if (
        head.x < 0 ||
        head.x >= canvasSize ||
        head.y < 0 ||
        head.y >= canvasSize ||
        snake.some((seg) => seg.x === head.x && seg.y === head.y)
      ) {
        playSound("die");
        localStatus = "gameover";
        setGameStatus("gameover");
        setHistory((prev) => [
          ...prev,
          { text: `GAME OVER! Score achieved: ${score}. Type 'play snake' to retry.`, type: "error" as const }
        ]);

        if (score > highScore) {
          setHighScore(score);
          try {
            localStorage.setItem("terminal_snake_highscore", score.toString());
          } catch {}
        }
        return;
      }

      snake.unshift(head);

      // Eat food check
      if (head.x === food.x && head.y === food.y) {
        playSound("eat");
        score += 10;
        setGameScore(score);
        food = generateFood();
      } else {
        snake.pop();
      }

      // Render
      ctx.fillStyle = "#020617";
      ctx.fillRect(0, 0, canvasSize, canvasSize);

      // Grid helper lines
      ctx.strokeStyle = "rgba(16, 185, 129, 0.06)";
      for (let i = 0; i <= canvasSize; i += grid) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvasSize);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvasSize, i);
        ctx.stroke();
      }

      // Draw food
      ctx.fillStyle = "#f43f5e";
      ctx.fillRect(food.x + 1, food.y + 1, grid - 2, grid - 2);

      // Draw Snake
      snake.forEach((segment, idx) => {
        ctx.fillStyle = idx === 0 ? "#10b981" : "#059669";
        ctx.fillRect(segment.x + 1, segment.y + 1, grid - 2, grid - 2);
      });
    };

    gameInterval = setInterval(gameLoop, 90);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearInterval(gameInterval);
    };
  }, [gameMode, highScore]);

  // Restart snake game click
  const restartSnake = () => {
    playSound("start");
    setGameScore(0);
    setGameStatus("playing");
    setGameMode("snake");
  };

  if (gameMode === "snake") {
    return (
      <div className="flex flex-col items-center justify-center bg-slate-950 p-4 rounded-xl font-mono text-emerald-400 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)] w-full max-w-sm mx-auto select-none">
        <div className="w-full flex items-center justify-between border-b border-emerald-500/20 pb-2 mb-3">
          <span className="text-xs uppercase tracking-wider text-cyan-300">Retro Snake Arcade</span>
          <div className="flex items-center gap-4 text-xs font-bold">
            <span>Score: <span className="text-white">{gameScore}</span></span>
            <span>Hi: <span className="text-white">{highScore}</span></span>
          </div>
        </div>

        <div className="relative border-2 border-emerald-500/35 rounded-lg overflow-hidden bg-slate-950">
          <canvas ref={canvasRef} width={300} height={300} className="block" />
        </div>

        <div className="w-full flex items-center justify-between mt-3 text-[10px] text-slate-500">
          <span>[ESC] Quit to Terminal</span>
          <span>[SPACE] Pause</span>
        </div>

        {gameStatus === "gameover" && (
          <button
            onClick={restartSnake}
            className="mt-3 px-4 py-1.5 rounded bg-emerald-500/20 text-emerald-200 border border-emerald-400/40 hover:bg-emerald-500/30 transition-all font-bold text-xs"
          >
            PLAY AGAIN
          </button>
        )}
      </div>
    );
  }

  return (
    <div 
      className="flex flex-col h-[340px] bg-slate-950 rounded-xl p-4 font-mono text-[13px] text-emerald-400 border border-slate-900 shadow-inner overflow-hidden select-text"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex-1 overflow-y-auto pr-1 select-text scrollbar-thin scrollbar-thumb-emerald-950 scrollbar-track-transparent">
        {history.map((line, idx) => {
          let colorClass = "text-emerald-400";
          if (line.type === "system") colorClass = "text-slate-500";
          if (line.type === "input") colorClass = "text-cyan-400";
          if (line.type === "error") colorClass = "text-rose-400";
          if (line.type === "success") colorClass = "text-amber-400";
          return (
            <div key={idx} className={`${colorClass} mb-1 whitespace-pre-wrap select-text`}>
              {line.text}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleCommandSubmit} className="flex items-center gap-1 mt-3 border-t border-emerald-500/10 pt-2 shrink-0">
        <span className="text-cyan-400 shrink-0 select-none">devesh@DeveshOS:~$</span>
        <input
          ref={inputRef}
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          className="flex-1 bg-transparent border-none outline-none text-emerald-300 font-mono caret-cyan-400 focus:ring-0 p-0 text-[13px]"
          autoFocus
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />
      </form>
    </div>
  );
};
