import React, { useEffect, useState, useRef } from "react";
import {
  Clock3,
  Calendar,
  X,
  ArrowUpRight,
  Share2,
  Check,
  ArrowUp,
  Tag,
  BookOpen,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { loadAllPosts, type Post } from "../blog/posts";

const LazyReactMarkdown = React.lazy(() => import("react-markdown"));

export const ThoughtsSection: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [copied, setCopied] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const modalScrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let active = true;
    loadAllPosts().then((loaded) => {
      if (active) setPosts(loaded);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const handleOpenBlogPost = (e: Event) => {
      const customEvent = e as CustomEvent<{ slug?: string }>;
      const slug = customEvent.detail?.slug;
      if (slug) {
        const found = posts.find((p) => p.slug === slug);
        if (found) {
          setSelectedPost(found);
        }
      }
    };
    window.addEventListener("open-blog-post", handleOpenBlogPost);
    return () => window.removeEventListener("open-blog-post", handleOpenBlogPost);
  }, [posts]);

  // Handle Lenis scroll lock, focus trap & modal scroll restoration
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setSelectedPost(null);
        return;
      }

      if (e.key === "Tab" && modalScrollRef.current) {
        const focusable = modalScrollRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    if (selectedPost) {
      // Pause global Lenis smooth scrolling so modal inner scroll works freely
      const lenisInstance = (window as unknown as { __lenis?: { stop: () => void; start: () => void } }).__lenis;
      lenisInstance?.stop();
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
      setScrollProgress(0);
      setShowScrollTop(false);

      // Reset scroll position of modal to top
      if (modalScrollRef.current) {
        modalScrollRef.current.scrollTop = 0;
      }
    } else {
      const lenisInstance = (window as unknown as { __lenis?: { stop: () => void; start: () => void } }).__lenis;
      lenisInstance?.start();
      document.body.style.overflow = "";
    }

    return () => {
      const lenisInstance = (window as unknown as { __lenis?: { stop: () => void; start: () => void } }).__lenis;
      lenisInstance?.start();
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedPost]);

  const handleModalScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const total = target.scrollHeight - target.clientHeight;
    if (total > 0) {
      const progress = Math.min(100, Math.max(0, (target.scrollTop / total) * 100));
      setScrollProgress(progress);
      setShowScrollTop(target.scrollTop > 300);
    }
  };

  const scrollToTop = () => {
    if (modalScrollRef.current) {
      modalScrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleShare = async (post: Post) => {
    const url = window.location.href.split("#")[0] + `#thoughts`;
    try {
      await navigator.clipboard.writeText(`${post.title} — ${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback if clipboard permissions are restricted
    }
  };

  return (
    <section id="thoughts" className="py-24 md:py-32 px-4 relative scroll-mt-24 md:scroll-mt-32">
      {/* Anchor alias for #blogs backward compatibility */}
      <span id="blogs" className="sr-only pointer-events-none" aria-hidden="true" />

      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-1.5 text-xs font-medium tracking-widest uppercase text-muted-foreground mb-4">
            <BookOpen className="h-3.5 w-3.5 text-purple-400" />
            <span>Engineering Insights</span>
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-medium tracking-tight">
            <span className="text-foreground font-normal">Thoughts </span>
            <span className="text-muted-foreground">I've Shared</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-xl mx-auto font-light">
            Architectural teardowns, performance optimizations, and technical deep dives built from real-world engineering.
          </p>
        </div>

        {/* Vertical List Container */}
        <div className="rounded-2xl border border-border bg-card p-6 md:p-8 flex flex-col divide-y divide-border shadow-sm">
          {posts.map((post, idx) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              role="button"
              tabIndex={0}
              aria-label={`Read article: ${post.title}`}
              onClick={() => setSelectedPost(post)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelectedPost(post);
                }
              }}
              className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 py-6 sm:py-8 first:pt-0 last:pb-0 group cursor-pointer hover:opacity-90 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded-xl"
            >
              {/* Thumbnail */}
              <div className="relative overflow-hidden rounded-xl shrink-0 w-full h-44 sm:w-28 sm:h-28 md:w-36 md:h-36 bg-secondary">
                {post.coverImage ? (
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1600&q=85";
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900/30 to-blue-900/30 text-muted-foreground">
                    <span className="font-mono text-xs uppercase">{post.category}</span>
                  </div>
                )}
              </div>

              {/* Text Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[10px] uppercase tracking-widest text-primary mb-2 font-medium font-mono">
                  <span>{post.date}</span>
                  <span>•</span>
                  <span>{post.readTime} MIN READ</span>
                  <span>•</span>
                  <span className="text-purple-400 font-semibold">{post.category}</span>
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-normal text-foreground leading-snug group-hover:text-purple-400 transition-colors break-words">
                  {post.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 line-clamp-2 font-light leading-relaxed">
                  {post.description}
                </p>

                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {post.tags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-md bg-secondary/80 text-muted-foreground border border-border/50"
                      >
                        <Tag className="w-2.5 h-2.5 opacity-60" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Arrow Icon */}
              <div className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-muted-foreground group-hover:text-foreground group-hover:bg-purple-500/20 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Reader Modal */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            ref={modalScrollRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="article-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onScroll={handleModalScroll}
            data-lenis-prevent="true"
            className="fixed inset-0 z-[150] h-screen w-full overflow-y-auto overscroll-contain bg-background/95 backdrop-blur-xl p-4 sm:p-8 select-text focus:outline-none"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {/* Reading Progress Bar */}
            <div className="fixed top-0 left-0 right-0 h-1 bg-border/40 z-[170]">
              <div
                className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500 transition-all duration-75"
                style={{ width: `${scrollProgress}%` }}
              />
            </div>

            {/* Floating Top Controls */}
            <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[160] flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleShare(selectedPost)}
                aria-label="Share article"
                title="Copy share link"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Share2 className="h-4 w-4" />}
              </button>
              <button
                type="button"
                onClick={() => setSelectedPost(null)}
                aria-label="Close reader"
                title="Close (Esc)"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-foreground text-background shadow-2xl transition-transform hover:scale-105 active:scale-95 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Floating Back to Top Button */}
            {showScrollTop && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                type="button"
                onClick={scrollToTop}
                aria-label="Back to top"
                className="fixed bottom-6 right-6 z-[160] flex h-11 w-11 items-center justify-center rounded-full bg-purple-600 text-white shadow-xl hover:bg-purple-500 transition-transform hover:scale-105 active:scale-95 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
              >
                <ArrowUp className="h-5 w-5" />
              </motion.button>
            )}

            {/* Article Content Container */}
            <article className="mx-auto max-w-3xl pt-16 sm:pt-20 pb-28">
              {/* Category & Meta */}
              <div className="flex flex-wrap items-center gap-3 mb-4 text-xs font-mono text-muted-foreground">
                <span className="rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 px-3 py-1 font-semibold border border-purple-500/20">
                  {selectedPost.category}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {selectedPost.date}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock3 className="h-3.5 w-3.5" />
                  {selectedPost.readTime} min read
                </span>
                <span>•</span>
                <span className="text-foreground/80">By Devesh Singh</span>
              </div>

              {/* Title */}
              <h1 id="article-title" className="font-display text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-foreground mb-6 leading-tight">
                {selectedPost.title}
              </h1>

              {/* Tags */}
              {selectedPost.tags && selectedPost.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {selectedPost.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-mono px-2.5 py-1 rounded-md bg-secondary text-muted-foreground border border-border"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Cover Image */}
              {selectedPost.coverImage && (
                <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden mb-10 border border-border shadow-md">
                  <img
                    src={selectedPost.coverImage}
                    alt={selectedPost.title}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1600&q=85";
                    }}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Markdown Content */}
              <div
                data-lenis-prevent="true"
                className="prose prose-invert prose-purple max-w-none prose-headings:font-display prose-headings:font-medium prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-p:leading-relaxed prose-p:text-foreground/90 prose-li:text-foreground/90 prose-pre:border prose-pre:border-border prose-pre:bg-secondary/40 prose-pre:rounded-xl prose-code:font-mono prose-code:text-purple-300"
              >
                <React.Suspense
                  fallback={
                    <div className="py-12 flex flex-col items-center justify-center gap-3 text-muted-foreground">
                      <div className="w-6 h-6 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
                      <span className="text-xs font-mono">Rendering article...</span>
                    </div>
                  }
                >
                  <LazyReactMarkdown>{selectedPost.content}</LazyReactMarkdown>
                </React.Suspense>
              </div>

              {/* Article Footer */}
              <div className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-foreground">Written by Devesh Singh</p>
                  <p className="text-xs text-muted-foreground">Software Development Engineer · Full-Stack &amp; AI</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleShare(selectedPost)}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-medium text-foreground hover:bg-secondary transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Share2 className="h-3.5 w-3.5" />}
                    <span>{copied ? "Link Copied!" : "Share Thought"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedPost(null)}
                    className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-4 py-2 text-xs font-medium hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    <span>Close Reader</span>
                  </button>
                </div>
              </div>
            </article>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
