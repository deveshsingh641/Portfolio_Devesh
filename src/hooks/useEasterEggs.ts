import { useEffect } from "react";

interface EasterEggOptions {
  onKonami?: () => void;
  onSecretCode?: (code: string) => void;
}

export const useEasterEggs = (options: EasterEggOptions = {}) => {
  useEffect(() => {
    const konami = [
      "ArrowUp",
      "ArrowUp",
      "ArrowDown",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "ArrowLeft",
      "ArrowRight",
      "b",
      "a",
    ];
    let konamiIndex = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key === " " ? " " : e.code || e.key;

      // Konami code detection
      if (key === konami[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konami.length) {
          options.onKonami?.();
          konamiIndex = 0;
        }
      } else {
        // Reset if wrong key
        if (key === konami[0]) {
          konamiIndex = 1;
        } else {
          konamiIndex = 0;
        }
      }

      // Alt+D for developer mode
      if ((e.altKey || e.metaKey) && e.key.toLowerCase() === "d") {
        e.preventDefault();
        options.onSecretCode?.("developer-mode");
      }

      // Ctrl+Shift+X for hidden terminal
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "x") {
        e.preventDefault();
        options.onSecretCode?.("hidden-terminal");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [options]);
};

// Easter egg effects
export const triggerKonamiEffect = () => {
  // Rainbow cursor
  const style = document.createElement("style");
  style.innerHTML = `
    @keyframes rainbow-rotation {
      0% { filter: hue-rotate(0deg) }
      100% { filter: hue-rotate(360deg) }
    }
    body {
      animation: rainbow-rotation 3s linear !important;
    }
  `;
  document.head.appendChild(style);

  // Confetti
  const confetti = () => {
    for (let i = 0; i < 50; i++) {
      const div = document.createElement("div");
      div.style.position = "fixed";
      div.style.width = "10px";
      div.style.height = "10px";
      div.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
      div.style.left = Math.random() * 100 + "%";
      div.style.top = "-10px";
      div.style.borderRadius = "50%";
      div.style.pointerEvents = "none";
      div.style.zIndex = "9999";
      div.style.animation = `fall ${2 + Math.random()}s linear forwards`;

      document.body.appendChild(div);
      setTimeout(() => div.remove(), 3000);
    }
  };

  const style2 = document.createElement("style");
  style2.innerHTML = `
    @keyframes fall {
      to {
        transform: translateY(100vh) rotate(360deg);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style2);

  confetti();
  setTimeout(confetti, 500);

  // Play a little sound easter egg (optional)
  console.log(
    "%c🎉 You found the Konami code! 🎉",
    "color: #22d3ee; font-size: 20px; font-weight: bold;"
  );
};

export const triggerHiddenTerminal = () => {
  console.log(
    "%c╔════════════════════════════════════════╗",
    "color: #00ff00; font-family: monospace"
  );
  console.log(
    "%c║   Developer Terminal Activated         ║",
    "color: #00ff00; font-family: monospace"
  );
  console.log(
    "%c╚════════════════════════════════════════╝",
    "color: #00ff00; font-family: monospace"
  );
  console.log(
    "%c\n[system] Welcome back, developer!\n[system] Type 'help()' for available commands",
    "color: #00ff00; font-family: monospace"
  );

  // Make help function available
  (window as any).help = () => {
    console.log(
      "%c Available Commands:\n" +
      "  - viewSource(): View portfolio source code\n" +
      "  - about(): Learn about the developer\n" +
      "  - social(): Get social links\n" +
      "  - secretMessage(): Unlock a message",
      "color: #00ff00; font-family: monospace"
    );
  };

  (window as any).viewSource = () => {
    window.open("https://github.com/deveshsingh641", "_blank");
  };

  (window as any).about = () => {
    console.log(
      "%cDevesh Singh - Full Stack Developer\nPassionate about building scalable systems and crafting beautiful UIs",
      "color: #22d3ee; font-weight: bold"
    );
  };

  (window as any).social = () => {
    console.log(
      "%cGitHub: https://github.com/deveshsingh641\nLinkedIn: https://linkedin.com/in/devesh-singh-0b234928b\nTwitter: https://x.com/harshhere_666",
      "color: #a855f7"
    );
  };

  (window as any).secretMessage = () => {
    console.log(
      "%c💡 Fun Fact: This portfolio has\n   6+ hidden easter eggs!\n   Keep exploring... 🔍",
      "color: #fbbf24; font-size: 14px; font-weight: bold"
    );
  };
};
