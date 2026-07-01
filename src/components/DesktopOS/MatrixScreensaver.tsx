import React, { useEffect, useRef } from "react";

interface MatrixScreensaverProps {
  onClose: () => void;
}

export const MatrixScreensaver: React.FC<MatrixScreensaverProps> = ({ onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas sizes
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Matrix characters - Katakana, digits, alphabet
    const chars = "ｦｧｨｩｪｫｬｭｮｯｰｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const charArray = chars.split("");

    const fontSize = 16;
    const columns = Math.ceil(canvas.width / fontSize);
    const drops: number[] = Array(columns).fill(1);

    let animationFrameId: number;

    const draw = () => {
      // Semi-transparent black background to create tail trails
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#0f0"; // Green text
      ctx.font = `${fontSize}px Courier New`;

      for (let i = 0; i < drops.length; i++) {
        // Random character
        const text = charArray[Math.floor(Math.random() * charArray.length)];
        
        // Randomize brightness for some characters to add depth
        if (Math.random() > 0.98) {
          ctx.fillStyle = "#fff"; // Occasional white highlighting
        } else {
          ctx.fillStyle = "#10b981"; // Emerald/Neon Green
        }

        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx.fillText(text, x, y);

        // Reset drop position or increment it
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      animationFrameId = requestAnimationFrame(draw);
    };

    // Delay start slightly to prevent immediate wake trigger from mouse move
    const startTimeout = setTimeout(() => {
      draw();
    }, 200);

    // Wake-up event handlers
    let lastMouseX = -1;
    let lastMouseY = -1;

    const handleMouseMove = (e: MouseEvent) => {
      // Verify mouse actually moved (some browsers trigger mousemove on click or hover start)
      if (lastMouseX === -1 || lastMouseY === -1) {
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
        return;
      }
      const movementThreshold = 5;
      if (
        Math.abs(e.clientX - lastMouseX) > movementThreshold ||
        Math.abs(e.clientY - lastMouseY) > movementThreshold
      ) {
        onClose();
      }
    };

    const handleInput = () => {
      onClose();
    };

    // Attach listeners
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("keydown", handleInput, { passive: true });
    window.addEventListener("mousedown", handleInput, { passive: true });
    window.addEventListener("touchstart", handleInput, { passive: true });

    return () => {
      clearTimeout(startTimeout);
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("keydown", handleInput);
      window.removeEventListener("mousedown", handleInput);
      window.removeEventListener("touchstart", handleInput);
    };
  }, [onClose]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-screen h-screen z-[300] bg-black block cursor-none select-none pointer-events-auto"
      style={{ touchAction: "none" }}
    />
  );
};
