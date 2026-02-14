import React, { useState, useRef, useEffect } from "react";
import { ExternalLink, X, Maximize2, Minimize2 } from "lucide-react";

interface ProjectPreviewProps {
  /** URL to embed (deployed site, CodeSandbox, StackBlitz, etc.) */
  url: string;
  /** Project title shown in the header bar */
  title: string;
}

/**
 * Lazy-loaded iframe preview with expand/collapse and fullscreen modal.
 * Only loads the iframe when the user clicks "Live Preview".
 */
const ProjectPreview: React.FC<ProjectPreviewProps> = ({ url, title }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  // Intersection Observer for lazy-loading: only load iframe when card scrolls into view AND user clicks preview
  useEffect(() => {
    if (!sentinelRef.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    obs.observe(sentinelRef.current);
    return () => obs.disconnect();
  }, []);

  // Lock body scroll when fullscreen modal is open
  useEffect(() => {
    if (!isFullscreen) return;
    const orig = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = orig;
    };
  }, [isFullscreen]);

  const shouldRenderIframe = isOpen && inView;

  return (
    <>
      {/* Sentinel for intersection observer */}
      <div ref={sentinelRef} className="w-full" />

      {/* Toggle button */}
      {!isOpen ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold
                     bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-300
                     border border-emerald-400/30 hover:border-emerald-400/60
                     hover:from-emerald-500/30 hover:to-cyan-500/30
                     transition-all duration-300 group"
          data-cursor-label="Preview"
        >
          <ExternalLink size={15} className="group-hover:scale-110 transition-transform" />
          Live Preview
        </button>
      ) : (
        <div className="mt-4 rounded-xl overflow-hidden border border-emerald-400/30 bg-slate-950/80">
          {/* Mini toolbar */}
          <div className="flex items-center justify-between px-3 py-2 bg-slate-900/90 border-b border-slate-700/50">
            <div className="flex items-center gap-2">
              {/* Traffic-light dots */}
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
              <span className="ml-2 text-[11px] text-slate-400 truncate max-w-[160px]">{title}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setIsFullscreen(true)}
                className="p-1 rounded hover:bg-slate-700/60 text-slate-400 hover:text-slate-200 transition-colors"
                title="Fullscreen"
              >
                <Maximize2 size={14} />
              </button>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 rounded hover:bg-slate-700/60 text-slate-400 hover:text-slate-200 transition-colors"
                title="Open in new tab"
              >
                <ExternalLink size={14} />
              </a>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setLoaded(false);
                }}
                className="p-1 rounded hover:bg-slate-700/60 text-slate-400 hover:text-slate-200 transition-colors"
                title="Close preview"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Iframe area */}
          <div className="relative w-full" style={{ height: 280 }}>
            {!loaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-950/90 z-10">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs text-slate-400">Loading preview…</span>
                </div>
              </div>
            )}
            {shouldRenderIframe && (
              <iframe
                src={url}
                title={`Preview of ${title}`}
                className="w-full h-full border-0"
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                loading="lazy"
                onLoad={() => setLoaded(true)}
              />
            )}
          </div>
        </div>
      )}

      {/* Fullscreen modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-[999] flex flex-col bg-slate-950/95 backdrop-blur-sm">
          {/* Toolbar */}
          <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-700/50">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
              <span className="ml-2 text-sm font-medium text-slate-200">{title}</span>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded hover:bg-slate-700/60 text-slate-400 hover:text-slate-200 transition-colors"
                title="Open in new tab"
              >
                <ExternalLink size={16} />
              </a>
              <button
                type="button"
                onClick={() => setIsFullscreen(false)}
                className="p-1.5 rounded hover:bg-slate-700/60 text-slate-400 hover:text-slate-200 transition-colors"
                title="Exit fullscreen"
              >
                <Minimize2 size={16} />
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsFullscreen(false);
                  setIsOpen(false);
                  setLoaded(false);
                }}
                className="p-1.5 rounded hover:bg-slate-700/60 text-slate-400 hover:text-slate-200 transition-colors"
                title="Close"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Iframe */}
          <div className="flex-1 relative">
            <iframe
              src={url}
              title={`Fullscreen preview of ${title}`}
              className="absolute inset-0 w-full h-full border-0"
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectPreview;
