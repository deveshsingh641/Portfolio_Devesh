import React, { useRef, useEffect } from "react";
import { X, Minus, Square, ShieldAlert } from "lucide-react";

interface DesktopWindowProps {
  id: string;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  x: number;
  y: number;
  w: number;
  h: number;
  zIndex: number;
  theme: string;
  children: React.ReactNode;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onMaximize: (id: string) => void;
  onFocus: (id: string) => void;
  onMove: (id: string, x: number, y: number) => void;
  onResize: (id: string, w: number, h: number) => void;
}

const DesktopWindow: React.FC<DesktopWindowProps> = ({
  id,
  title,
  isOpen,
  isMinimized,
  isMaximized,
  x,
  y,
  w,
  h,
  zIndex,
  theme,
  children,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onMove,
  onResize,
}) => {
  const windowRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ px: number; py: number; wx: number; wy: number } | null>(null);
  const resizeStartRef = useRef<{ px: number; py: number; ww: number; wh: number } | null>(null);

  if (!isOpen || isMinimized) return null;

  // Header drag pointer handlers
  const handleHeaderPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isMaximized) return; // Disable dragging when maximized
    onFocus(id);
    const target = e.currentTarget;
    target.setPointerCapture(e.pointerId);
    dragStartRef.current = {
      px: e.clientX,
      py: e.clientY,
      wx: x,
      wy: y,
    };
  };

  const handleHeaderPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStartRef.current) return;
    const dx = e.clientX - dragStartRef.current.px;
    const dy = e.clientY - dragStartRef.current.py;
    
    // Bounds constraints: prevent dragging header completely off-screen
    let newX = dragStartRef.current.wx + dx;
    let newY = dragStartRef.current.wy + dy;
    
    // Prevent dragging header above top screen boundary (menu bar is 40px)
    if (newY < 40) newY = 40;
    if (newX < -w + 100) newX = -w + 100;
    if (newX > window.innerWidth - 100) newX = window.innerWidth - 100;

    onMove(id, newX, newY);
  };

  const handleHeaderPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    dragStartRef.current = null;
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  // Resize pointer handlers
  const handleResizePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    onFocus(id);
    const target = e.currentTarget;
    target.setPointerCapture(e.pointerId);
    resizeStartRef.current = {
      px: e.clientX,
      py: e.clientY,
      ww: w,
      wh: h,
    };
  };

  const handleResizePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!resizeStartRef.current) return;
    const dx = e.clientX - resizeStartRef.current.px;
    const dy = e.clientY - resizeStartRef.current.py;

    const newW = Math.max(350, resizeStartRef.current.ww + dx);
    const newH = Math.max(250, resizeStartRef.current.wh + dy);

    onResize(id, newW, newH);
  };

  const handleResizePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    resizeStartRef.current = null;
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const isDark = theme === "dark";

  return (
    <div
      ref={windowRef}
      onPointerDown={() => onFocus(id)}
      style={{
        position: "absolute",
        left: isMaximized ? 0 : x,
        top: isMaximized ? 40 : y, // Top offset for top bar (40px)
        width: isMaximized ? "100%" : w,
        height: isMaximized ? "calc(100vh - 40px - 72px)" : h, // Account for top bar and bottom dock
        zIndex: zIndex,
        display: "flex",
        flexDirection: "column",
        transition: dragStartRef.current || resizeStartRef.current ? "none" : "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      className={`rounded-xl shadow-2xl border overflow-hidden backdrop-blur-md select-none ${
        isDark
          ? "bg-slate-950/85 border-slate-800/80 shadow-black/60"
          : "bg-white/90 border-slate-200/90 shadow-slate-900/10"
      }`}
    >
      {/* Header bar */}
      <div
        onPointerDown={handleHeaderPointerDown}
        onPointerMove={handleHeaderPointerMove}
        onPointerUp={handleHeaderPointerUp}
        className={`flex items-center justify-between px-4 py-3 cursor-move border-b font-sans ${
          isDark
            ? "bg-slate-900/90 border-slate-800/80 text-slate-200"
            : "bg-slate-100/90 border-slate-200 text-slate-700"
        }`}
      >
        {/* Windows traffic light controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onClose(id)}
            className="w-3.5 h-3.5 rounded-full bg-red-500 hover:bg-red-600 transition-colors flex items-center justify-center group"
            title="Close"
          >
            <X size={8} className="text-red-950 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          <button
            onClick={() => onMinimize(id)}
            className="w-3.5 h-3.5 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors flex items-center justify-center group"
            title="Minimize"
          >
            <Minus size={8} className="text-yellow-950 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          <button
            onClick={() => onMaximize(id)}
            className="w-3.5 h-3.5 rounded-full bg-green-500 hover:bg-green-600 transition-colors flex items-center justify-center group"
            title="Maximize"
          >
            <Square size={6} className="text-green-950 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>

        {/* Window Title */}
        <span className="text-xs font-bold font-mono tracking-wide uppercase select-none">
          {title}
        </span>

        {/* Dummy spacer */}
        <div className="w-14" />
      </div>

      {/* Window Content */}
      <div className="flex-1 overflow-y-auto p-6 font-sans scrollbar-thin select-text">
        <div className="max-w-4xl mx-auto h-full">
          {children}
        </div>
      </div>

      {/* Corner Resize Handle */}
      {!isMaximized && (
        <div
          onPointerDown={handleResizePointerDown}
          onPointerMove={handleResizePointerMove}
          onPointerUp={handleResizePointerUp}
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-20 flex items-end justify-end p-0.5"
        >
          <svg width="8" height="8" viewBox="0 0 8 8" className={isDark ? "text-slate-700" : "text-slate-300"}>
            <line x1="6" y1="0" x2="6" y2="8" stroke="currentColor" strokeWidth="1" />
            <line x1="3" y1="3" x2="8" y2="3" stroke="currentColor" strokeWidth="1" />
            <line x1="0" y1="6" x2="8" y2="6" stroke="currentColor" strokeWidth="1" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default DesktopWindow;
