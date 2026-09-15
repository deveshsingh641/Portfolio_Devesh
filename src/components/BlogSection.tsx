import React, { useEffect, useState, useMemo } from "react";
import { createPortal } from "react-dom";
import ReactMarkdown from "react-markdown";
import {
  BookOpen,
  Clock3,
  ArrowRight,
  Search,
  X,
  FileText,
  Eye,
  TrendingUp,
  Calendar,
  Share2,
  Check,
} from "lucide-react";

import { extractHeadings, loadAllPosts, type Post } from "../blog/posts";

const getPlainText = (node: unknown): string => {
  if (!node) return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(getPlainText).join("");
  if (typeof node === "object" && node !== null && "props" in node) {
    const props = (node as { props?: { children?: unknown } }).props;
    if (props && props.children) return getPlainText(props.children);
  }
  return "";
};

/* ------------------------------------------------------------------ */
/*  Category badge color mapping                                       */
/* ------------------------------------------------------------------ */
const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  Development: { bg: "bg-cyan-500/15",    text: "text-cyan-300",    border: "border-cyan-400/30"    },
  Career:      { bg: "bg-violet-500/15",  text: "text-violet-300",  border: "border-violet-400/30"  },
  Design:      { bg: "bg-pink-500/15",    text: "text-pink-300",    border: "border-pink-400/30"    },
  Tutorials:   { bg: "bg-emerald-500/15", text: "text-emerald-300", border: "border-emerald-400/30" },
};

function getCategoryStyle(cat: string) {
  return categoryColors[cat] || categoryColors.Development;
}

/* ------------------------------------------------------------------ */
/*  Share Button                                                       */
/* ------------------------------------------------------------------ */
const ShareButton: React.FC<{ title: string; slug: string }> = ({ title, slug }) => {
  const [copied, setCopied] = useState(false);
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const url = origin ? `${origin}/blog/${slug}` : "";

  const copyLink = async () => {
    try {
      if (!url) return;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* fallback – ignored */ }
  };

  const shareNative = () => {
    if (!url) return;
    if (navigator.share) {
      navigator.share({ title, url }).catch(() => {});
    } else {
      copyLink();
    }
  };

  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); shareNative(); }}
      className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-300 transition-colors"
      title="Share"
    >
      {copied ? <Check size={13} /> : <Share2 size={13} />}
      {copied ? "Copied!" : "Share"}
    </button>
  );
};

/* ------------------------------------------------------------------ */
/*  Blog Section Component                                             */
/* ------------------------------------------------------------------ */
const BlogSection: React.FC<{ theme: string; posts?: Post[]; onNavigate?: (to: string) => void }> = ({ theme, posts: postsProp, onNavigate }) => {
  const [posts, setPosts] = useState<Post[]>(postsProp || []);
  const [selected, setSelected] = useState<Post | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  /* ---- Load posts ---- */
  useEffect(() => {
    if (postsProp && postsProp.length) {
      setPosts(postsProp);
      return;
    }
    let active = true;
    loadAllPosts()
      .then((loaded) => {
        if (active) setPosts(loaded);
      })
      .catch(() => {
        if (active) setPosts([]);
      });
    return () => {
      active = false;
    };
  }, [postsProp]);

  /* ---- Lock scroll when modal open + Escape to close ---- */
  useEffect(() => {
    if (!selected) return;
    const orig = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = orig;
      window.removeEventListener("keydown", handleKey);
    };
  }, [selected]);

  /* ---- Derived: categories ---- */
  const categories = useMemo(() => {
    const cats = new Set(posts.map((p) => p.category));
    return ["All", ...Array.from(cats)];
  }, [posts]);

  /* ---- Filtered posts ---- */
  const filtered = useMemo(() => {
    let list = posts;
    if (activeCategory !== "All") {
      list = list.filter((p) => p.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return list;
  }, [posts, activeCategory, searchQuery]);

  const featured = filtered[0];
  const rest = filtered.slice(1);

  const openPost = (post: Post) => {
    if (onNavigate) {
      onNavigate(`/blog/${post.slug}`);
    } else {
      setSelected(post);
    }
  };

  /* ---- Table of contents for selected post ---- */
  const toc = useMemo(() => (selected ? extractHeadings(selected.content) : []), [selected]);

  /* ---- Render ---- */
  return (
    <>
      {/* ===== STATS BAR ===== */}
      <div className="flex flex-wrap items-center justify-start gap-4 sm:gap-8 mb-8">
        {[
          { icon: FileText, label: "ARTICLES", value: `${posts.length}+` },
          { icon: Eye,      label: "READERS",  value: "5k+"              },
          { icon: TrendingUp, label: "UPDATES", value: "Weekly"          },
        ].map((stat) => (
          <div key={stat.label} className="flex items-center gap-2 text-xs font-mono text-neutral-500">
            <stat.icon size={14} className="text-emerald-500" />
            <span className="font-bold text-neutral-900 dark:text-white font-mono">{stat.value}</span>
            <span className="uppercase tracking-wider">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* ===== SEARCH + CATEGORY FILTERS ===== */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
        {/* Category tabs */}
        <div className="flex items-center gap-1.5 flex-wrap p-1 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-sm self-start md:self-auto">
          {categories.map((cat) => {
            const isActive = cat === activeCategory;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium tracking-tight transition-all duration-200 ${
                  isActive
                    ? theme === 'dark'
                      ? "bg-white text-neutral-950 font-semibold shadow-sm"
                      : "bg-neutral-900 text-white font-semibold shadow-sm"
                    : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className={`relative w-full md:w-72 transition-all duration-300 ${searchFocused ? "md:w-80" : ""}`}>
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className={`w-full pl-9 pr-9 py-2 rounded-full text-xs font-mono border outline-none transition-all ${
              theme === 'dark'
                ? 'bg-neutral-900/80 text-white border-neutral-800 placeholder-neutral-500 focus:border-neutral-600'
                : 'bg-white text-neutral-900 border-neutral-200 placeholder-neutral-400 focus:border-neutral-300 shadow-sm'
            }`}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* ===== ARTICLE COUNT ===== */}
      <p className="text-xs font-mono text-neutral-500 mb-6">
        <span className="font-bold text-neutral-900 dark:text-white">{filtered.length}</span>{" "}
        article{filtered.length !== 1 ? "s" : ""} found
      </p>

      {/* ===== NO RESULTS ===== */}
      {filtered.length === 0 && (
        <div className="text-center py-16">
          <BookOpen size={36} className="mx-auto text-neutral-400 mb-3" />
          <p className="text-neutral-500 text-sm">No articles match your filters.</p>
          <button
            type="button"
            onClick={() => { setActiveCategory("All"); setSearchQuery(""); }}
            className="mt-3 text-xs font-mono text-emerald-500 hover:text-emerald-400 underline underline-offset-4"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* ===== FEATURED ARTICLE (first one, large card) ===== */}
      {featured && (
        <article
          onClick={() => openPost(featured)}
          className={`group mb-8 p-7 sm:p-8 rounded-3xl border transition-all duration-500 hover:-translate-y-1 cursor-pointer relative overflow-hidden ${
            theme === 'dark'
              ? 'border-neutral-800 bg-neutral-900/60 hover:border-neutral-700 hover:shadow-2xl hover:shadow-black/50'
              : 'border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-xl hover:shadow-neutral-200/60'
          }`}
          data-cursor-label="Read"
        >
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                {featured.category}
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-mono text-neutral-500">
                <Calendar size={12} /> {featured.date}
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-mono text-neutral-500">
                <Clock3 size={12} /> {featured.readTime} min read
              </span>
            </div>

            <h3 className="font-display text-2xl sm:text-3xl font-bold mb-3 leading-tight transition-colors text-neutral-900 dark:text-white group-hover:text-emerald-500">
              {featured.title}
            </h3>
            <p className="mb-6 text-sm sm:text-base leading-relaxed max-w-3xl text-neutral-600 dark:text-neutral-400">
              {featured.description}
            </p>

            <div className="flex items-center justify-between flex-wrap gap-4 pt-4 border-t border-neutral-100 dark:border-neutral-800/80">
              <div className="flex flex-wrap gap-1.5">
                {featured.tags.map((t) => (
                  <span key={t} className="px-2 py-0.5 text-[11px] font-mono rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700">
                    {t}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-4">
                <ShareButton title={featured.title} slug={featured.slug} />
                <span className="inline-flex items-center gap-1.5 text-emerald-500 font-semibold text-xs group-hover:gap-2.5 transition-all">
                  Read Article <ArrowRight size={13} />
                </span>
              </div>
            </div>
          </div>
        </article>
      )}

      {/* ===== REST OF ARTICLES (compact grid) ===== */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rest.map((post, idx) => {
          return (
            <article
              key={post.slug}
              onClick={() => openPost(post)}
              className={`group p-6 rounded-3xl border transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between ${
                theme === 'dark'
                  ? 'border-neutral-800 bg-neutral-900/60 hover:border-neutral-700 hover:shadow-xl hover:shadow-black/40'
                  : 'border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-lg hover:shadow-neutral-200/50'
              }`}
              data-cursor-label="Read"
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="inline-flex items-center text-[10px] font-mono font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    {post.category}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono text-neutral-400">
                    <Clock3 size={11} /> {post.readTime}m
                  </span>
                </div>

                <h3 className="font-display text-lg font-bold mb-2 leading-snug transition-colors line-clamp-2 text-neutral-900 dark:text-white group-hover:text-emerald-500">
                  {post.title}
                </h3>

                <p className="text-xs leading-relaxed line-clamp-3 text-neutral-600 dark:text-neutral-400 mb-4">
                  {post.description}
                </p>
              </div>

              <div>
                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {post.tags.slice(0, 3).map((t) => (
                    <span key={t} className="text-[10px] font-mono py-0.5 px-2 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700">
                      {t}
                    </span>
                  ))}
                  {post.tags.length > 3 && (
                    <span className="text-[10px] font-mono py-0.5 px-1.5 rounded text-neutral-400">
                      +{post.tags.length - 3}
                    </span>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between text-xs text-neutral-400 pt-3 border-t border-neutral-100 dark:border-neutral-800/80">
                  <span className="font-mono text-[11px]">
                    {post.date}
                  </span>
                  <span className="inline-flex items-center gap-1 text-emerald-500 font-semibold text-xs group-hover:translate-x-0.5 transition-transform">
                    Read <ArrowRight size={11} />
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* ===== FULL ARTICLE MODAL — rendered via portal to escape stacking contexts ===== */}
      {selected && createPortal(
        <div
          className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm overflow-y-auto"
          onClick={() => setSelected(null)}
          style={{ isolation: "isolate" }}
        >
          {/* Fixed close button — always visible top-right */}
          <button
            type="button"
            onClick={() => setSelected(null)}
            className="fixed top-4 right-4 z-[10001] flex items-center gap-2 px-4 py-2 rounded-full bg-red-600 hover:bg-red-500 text-white font-semibold text-sm shadow-lg transition-colors"
            aria-label="Close article"
          >
            <X size={16} /> Close
          </button>

          {/* Article container — scrolls naturally with the page */}
          <div
            className="relative max-w-3xl mx-auto my-8 px-4 sm:px-6 pb-12"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden">
              {/* Article header */}
              <div className="px-6 md:px-10 pt-8 pb-6 border-b border-slate-800/60">
                {(() => {
                  const s = getCategoryStyle(selected.category);
                  return (
                    <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border mb-4 ${s.bg} ${s.text} ${s.border}`}>
                      {selected.category}
                    </span>
                  );
                })()}

                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-100 mb-4 leading-tight">{selected.title}</h1>

                <div className="flex items-center gap-3 flex-wrap text-sm text-slate-400 mb-4">
                  <span className="inline-flex items-center gap-1"><Calendar size={13} /> {selected.date}</span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1"><Clock3 size={13} /> {selected.readTime} min read</span>
                  <span>•</span>
                  <span>{selected.wordCount.toLocaleString()} words</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {selected.tags.map((t) => (
                    <span key={t} className="px-2.5 py-1 text-xs font-semibold rounded-md bg-violet-500/10 text-violet-200 border border-violet-400/30">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Table of Contents (inline, collapsible) */}
              {toc.length > 0 && (
                <details className="px-6 md:px-10 py-4 border-b border-slate-800/60 bg-slate-950/40">
                  <summary className="text-[10px] font-bold uppercase tracking-widest text-slate-500 cursor-pointer select-none hover:text-slate-300 transition-colors">
                    Table of Contents
                  </summary>
                  <nav className="flex flex-col gap-1.5 mt-3">
                    {toc.map((h) => (
                      <a
                        key={h.id}
                        href={`#${h.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          document.getElementById(h.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                        }}
                        className={`text-xs text-slate-400 hover:text-cyan-300 transition-colors ${h.level === 3 ? "pl-4" : h.level === 4 ? "pl-8" : ""}`}
                      >
                        {h.text}
                      </a>
                    ))}
                  </nav>
                </details>
              )}

              {/* Rendered Markdown */}
              <div className="px-6 md:px-10 py-8">
                <div className="prose prose-invert prose-base sm:prose-lg max-w-none
                  prose-headings:font-bold prose-headings:text-slate-100
                  prose-h2:text-xl sm:prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:border-b prose-h2:border-slate-800/60 prose-h2:pb-2
                  prose-h3:text-lg sm:prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                  prose-p:text-slate-300 prose-p:leading-relaxed
                  prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-slate-200
                  prose-code:text-cyan-300 prose-code:bg-slate-800/60 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
                  prose-pre:bg-slate-950/80 prose-pre:border prose-pre:border-slate-700/50 prose-pre:rounded-xl prose-pre:overflow-x-auto
                  prose-li:text-slate-300 prose-li:marker:text-cyan-500
                  prose-blockquote:border-cyan-500 prose-blockquote:text-slate-400
                ">
                  <ReactMarkdown
                    components={{
                      h2: ({ children, ...props }) => {
                        const text = getPlainText(children);
                        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
                        return <h2 id={id} {...props}>{children}</h2>;
                      },
                      h3: ({ children, ...props }) => {
                        const text = getPlainText(children);
                        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
                        return <h3 id={id} {...props}>{children}</h3>;
                      },
                    }}
                  >
                    {selected.content}
                  </ReactMarkdown>
                </div>

                {/* Bottom actions */}
                <div className="flex items-center justify-between mt-10 pt-6 border-t border-slate-800/60">
                  <button
                    type="button"
                    onClick={() => setSelected(null)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium transition-colors"
                  >
                    ← Back to articles
                  </button>
                  <ShareButton title={selected.title} slug={selected.slug} />
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default BlogSection;
