import React, { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, Calendar, Clock3, Share2 } from "lucide-react";
import { extractHeadings, Post } from "../blog/posts";

const getPlainText = (node: any): string => {
  if (!node) return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(getPlainText).join("");
  if (node.props && node.props.children) return getPlainText(node.props.children);
  return "";
};

function slugToTitle(slug: string) {
  return slug
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

function getHeadingId(children: React.ReactNode) {
  const raw = getPlainText(children);
  return raw
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function BlogPostPage({
  theme,
  post,
  slug,
  onNavigate,
}: {
  theme: string;
  post?: Post | null;
  slug: string;
  onNavigate: (to: string) => void;
}) {
  const isDark = theme === "dark";

  const toc = useMemo(() => (post ? extractHeadings(post.content) : []), [post]);

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const shareUrl = origin ? `${origin}/blog/${slug}` : "";

  const onShare = async () => {
    if (!shareUrl) return;
    try {
      if (navigator.share) {
        await navigator.share({ title: post?.title || slugToTitle(slug), url: shareUrl });
      } else {
        await navigator.clipboard.writeText(shareUrl);
      }
    } catch {
      // ignored
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? "text-slate-100" : "text-slate-900"}`}>
      <div
        className={`sticky top-0 z-[80] border-b ${isDark ? "bg-slate-950/90 border-slate-700/40" : "bg-white/90 border-slate-200"} backdrop-blur`}
      >
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => onNavigate("/#blog")}
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold border transition-all ${
              isDark
                ? "bg-slate-900/60 border-slate-700/50 text-slate-200 hover:border-cyan-400/40 hover:text-cyan-200"
                : "bg-white border-slate-200 text-slate-700 hover:border-cyan-400/40 hover:text-cyan-700"
            }`}
          >
            <ArrowLeft size={14} /> Blog
          </button>

          <button
            type="button"
            onClick={onShare}
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold border transition-all ${
              isDark
                ? "bg-slate-900/60 border-slate-700/50 text-slate-200 hover:border-emerald-400/40 hover:text-emerald-200"
                : "bg-white border-slate-200 text-slate-700 hover:border-emerald-400/40 hover:text-emerald-700"
            }`}
            aria-label="Share"
            title={navigator.share ? "Share" : "Copy link"}
          >
            <Share2 size={14} /> Share
          </button>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 py-10">
        {!post ? (
          <div className={`rounded-2xl border p-8 ${isDark ? "bg-slate-900/60 border-slate-700/40" : "bg-white border-slate-200"}`}>
            <h1 className={`text-2xl font-extrabold ${isDark ? "text-white" : "text-slate-900"}`}>
              Article not found
            </h1>
            <p className={`mt-2 text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              The link may be outdated.
            </p>
          </div>
        ) : (
          <div className={`rounded-2xl shadow-2xl border overflow-hidden ${isDark ? "bg-gradient-to-b from-slate-900 to-slate-950 border-slate-700/50" : "bg-white border-slate-200"}`}>
            <div className={`px-6 md:px-10 pt-8 pb-6 border-b ${isDark ? "border-slate-800/60" : "border-slate-200"}`}>
              <div className="flex items-center gap-3 flex-wrap text-sm">
                <span
                  className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
                    isDark
                      ? "bg-cyan-500/15 text-cyan-300 border-cyan-400/30"
                      : "bg-violet-500/10 text-violet-700 border-violet-400/30"
                  }`}
                >
                  {post.category}
                </span>
                <span className={isDark ? "text-slate-400" : "text-slate-500"}>
                  <span className="inline-flex items-center gap-1">
                    <Calendar size={13} /> {post.date}
                  </span>
                </span>
                <span className={isDark ? "text-slate-400" : "text-slate-500"}>
                  <span className="inline-flex items-center gap-1">
                    <Clock3 size={13} /> {post.readTime} min read
                  </span>
                </span>
                <span className={isDark ? "text-slate-400" : "text-slate-500"}>{post.wordCount.toLocaleString()} words</span>
              </div>

              <h1 className={`text-2xl sm:text-3xl md:text-4xl font-bold mt-4 leading-tight ${isDark ? "text-slate-100" : "text-slate-900"}`}>
                {post.title}
              </h1>
              {post.description ? (
                <p className={`mt-3 text-base leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                  {post.description}
                </p>
              ) : null}

              {post.tags?.length ? (
                <div className="mt-5 flex flex-wrap gap-2">
                  {post.tags.map((t) => (
                    <span
                      key={t}
                      className={`px-2.5 py-1 text-xs font-semibold rounded-md border ${
                        isDark
                          ? "bg-violet-500/10 text-violet-200 border-violet-400/30"
                          : "bg-violet-500/10 text-violet-700 border-violet-400/30"
                      }`}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>

            {toc.length > 0 ? (
              <details className={`px-6 md:px-10 py-4 border-b ${isDark ? "border-slate-800/60 bg-slate-950/40" : "border-slate-200 bg-slate-50"}`}>
                <summary
                  className={`text-[10px] font-bold uppercase tracking-widest cursor-pointer select-none transition-colors ${
                    isDark ? "text-slate-500 hover:text-slate-300" : "text-slate-500 hover:text-slate-700"
                  }`}
                >
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
                      className={`text-xs transition-colors ${
                        isDark ? "text-slate-400 hover:text-cyan-300" : "text-slate-600 hover:text-cyan-700"
                      } ${h.level === 3 ? "pl-4" : h.level === 4 ? "pl-8" : ""}`}
                    >
                      {h.text}
                    </a>
                  ))}
                </nav>
              </details>
            ) : null}

            <div className="px-6 md:px-10 py-8">
              <div
                className={`prose max-w-none ${
                  isDark
                    ? `prose-invert prose-headings:font-bold prose-headings:text-slate-100
                       prose-h2:text-xl sm:prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:border-b prose-h2:border-slate-800/60 prose-h2:pb-2
                       prose-h3:text-lg sm:prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                       prose-p:text-slate-300 prose-p:leading-relaxed
                       prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:underline
                       prose-strong:text-slate-200
                       prose-code:text-cyan-300 prose-code:bg-slate-800/60 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
                       prose-pre:bg-slate-950/80 prose-pre:border prose-pre:border-slate-700/50 prose-pre:rounded-xl prose-pre:overflow-x-auto
                       prose-li:text-slate-300 prose-li:marker:text-cyan-500
                       prose-blockquote:border-cyan-500 prose-blockquote:text-slate-400`
                    : `prose-slate prose-headings:font-bold
                       prose-h2:text-xl sm:prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:border-b prose-h2:border-slate-200 prose-h2:pb-2
                       prose-h3:text-lg sm:prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                       prose-a:text-cyan-700 prose-a:no-underline hover:prose-a:underline
                       prose-code:bg-slate-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
                       prose-pre:bg-slate-950 prose-pre:rounded-xl prose-pre:overflow-x-auto`
                }`}
              >
                <ReactMarkdown
                  components={{
                    h2: ({ children, ...props }) => <h2 id={getHeadingId(children)} {...props}>{children}</h2>,
                    h3: ({ children, ...props }) => <h3 id={getHeadingId(children)} {...props}>{children}</h3>,
                    h4: ({ children, ...props }) => <h4 id={getHeadingId(children)} {...props}>{children}</h4>,
                  }}
                >
                  {post.content}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
