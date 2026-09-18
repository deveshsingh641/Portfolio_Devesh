import React, { useState, useEffect } from "react";
import {
  X,
  Send,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Mail,
  Bug,
  Briefcase,
  Sparkles,
  MessageSquare,
  ExternalLink,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { soundService } from "../lib/sound";

export type MessageCategory = "job" | "collaboration" | "bug" | "general";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCategory?: MessageCategory;
}

const CATEGORIES: { id: MessageCategory; label: string; icon: React.ReactNode; defaultSubject: string }[] = [
  {
    id: "job",
    label: "SDE Opportunity",
    icon: <Briefcase className="w-3.5 h-3.5" />,
    defaultSubject: "SDE Role / Hiring Inquiry",
  },
  {
    id: "collaboration",
    label: "Project Collab",
    icon: <Sparkles className="w-3.5 h-3.5" />,
    defaultSubject: "Project Collaboration / Consulting",
  },
  {
    id: "bug",
    label: "Report Bug",
    icon: <Bug className="w-3.5 h-3.5" />,
    defaultSubject: "Portfolio Bug Report / Feedback",
  },
  {
    id: "general",
    label: "Quick Hello",
    icon: <MessageSquare className="w-3.5 h-3.5" />,
    defaultSubject: "Saying Hi / Networking",
  },
];

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  defaultCategory = "job",
}) => {
  const [category, setCategory] = useState<MessageCategory>(defaultCategory);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [copied, setCopied] = useState(false);

  // Sync default category when opened
  useEffect(() => {
    if (isOpen) {
      setCategory(defaultCategory);
      const cat = CATEGORIES.find((c) => c.id === defaultCategory);
      if (cat) {
        setSubject((prev) => prev || cat.defaultSubject);
      }
      setStatus("idle");
      setErrorMessage("");
    }
  }, [isOpen, defaultCategory]);

  // Handle category changes
  const handleCategorySelect = (catId: MessageCategory) => {
    setCategory(catId);
    const cat = CATEGORIES.find((c) => c.id === catId);
    if (cat) {
      setSubject(cat.defaultSubject);
    }
  };

  const modalRef = React.useRef<HTMLDivElement>(null);

  // Sound, Lenis scroll coordination & Focus Trap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        soundService.playModalClose();
        onClose();
        return;
      }

      if (e.key === "Tab" && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
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

    if (isOpen) {
      soundService.playModalOpen();
      document.body.style.overflow = "hidden";
      const lenis = window.__lenis;
      lenis?.stop();
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
      const lenis = window.__lenis;
      lenis?.start();
    }

    return () => {
      document.body.style.overflow = "";
      const lenis = window.__lenis;
      lenis?.start();
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText("deveshsingh20666@gmail.com");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback ignored
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !message.trim()) {
      setErrorMessage("Please provide both your email and a brief message.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMessage("Please enter a valid email address (e.g. name@domain.com).");
      return;
    }

    setIsLoading(true);
    setStatus("idle");
    setErrorMessage("");

    const endpoint =
      import.meta.env.VITE_FORMSPREE_ENDPOINT || "https://formspree.io/f/mojnjbnp";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: name.trim() || "Anonymous Visitor",
          email: email.trim(),
          category,
          subject: subject.trim() || "Portfolio Direct Message",
          message: message.trim(),
          timestamp: new Date().toISOString(),
          source: "Portfolio Connect Modal",
        }),
      });

      if (!response.ok) {
        throw new Error(`Submission failed with status ${response.status}`);
      }

      setStatus("success");
      setName("");
      setMessage("");
    } catch (err: unknown) {
      console.error("Failed to submit message:", err);
      setStatus("error");
      setErrorMessage(
        "Could not send message automatically. Please copy my email below or open your mail app."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="contact-modal-title"
          data-lenis-prevent="true"
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 overscroll-contain"
        >
          {/* Backdrop with Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              soundService.playModalClose();
              onClose();
            }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-lg rounded-2xl sm:rounded-3xl border border-border bg-card/95 backdrop-blur-xl p-6 sm:p-7 shadow-2xl overflow-hidden text-foreground"
          >
            {/* Top Accent Gradient Border */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-emerald-400" />

            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Available for Work
                  </span>
                </div>
                <h3
                  id="contact-modal-title"
                  className="font-display text-xl sm:text-2xl font-bold tracking-tight text-foreground"
                >
                  Let&apos;s Build Something Great
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Send a direct message or bug report straight to my inbox.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  soundService.playModalClose();
                  onClose();
                }}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-secondary/60 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground active:scale-95"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Category / Purpose Selector */}
            <div className="mb-4">
              <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-2">
                What is this regarding?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {CATEGORIES.map((cat) => {
                  const isSelected = category === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleCategorySelect(cat.id)}
                      className={`flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-medium transition-all duration-200 border cursor-pointer ${
                        isSelected
                          ? "bg-purple-500/15 border-purple-500/60 text-purple-600 dark:text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.2)]"
                          : "bg-secondary/40 border-border/70 text-muted-foreground hover:text-foreground hover:bg-secondary"
                      }`}
                    >
                      {cat.icon}
                      <span className="truncate">{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Form */}
            {status === "success" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-8 text-center flex flex-col items-center justify-center gap-3 bg-secondary/30 rounded-2xl border border-emerald-500/30 px-6 my-2"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-display text-lg font-semibold text-foreground">
                  Message Delivered!
                </h4>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-sm">
                  Thanks for reaching out! Your message was sent directly to{" "}
                  <strong className="text-foreground">deveshsingh20666@gmail.com</strong>. I usually respond within 24 hours.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setStatus("idle");
                    onClose();
                  }}
                  className="mt-2 inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2 text-xs font-medium text-background hover:opacity-90 transition-opacity"
                >
                  Done
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-muted-foreground mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full px-3.5 py-2 rounded-xl border border-border bg-secondary/50 text-foreground placeholder:text-muted-foreground/60 text-xs sm:text-sm focus:outline-none focus:border-purple-500/70 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-muted-foreground mb-1">
                      Your Email <span className="text-purple-400">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jane@company.com"
                      className="w-full px-3.5 py-2 rounded-xl border border-border bg-secondary/50 text-foreground placeholder:text-muted-foreground/60 text-xs sm:text-sm focus:outline-none focus:border-purple-500/70 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-muted-foreground mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Topic / Role"
                    className="w-full px-3.5 py-2 rounded-xl border border-border bg-secondary/50 text-foreground placeholder:text-muted-foreground/60 text-xs sm:text-sm focus:outline-none focus:border-purple-500/70 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-muted-foreground mb-1">
                    Message <span className="text-purple-400">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={
                      category === "bug"
                        ? "Describe the bug, screen where it occurred, or feature you'd like to see..."
                        : "Tell me about your team, project scope, or questions..."
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-secondary/50 text-foreground placeholder:text-muted-foreground/60 text-xs sm:text-sm focus:outline-none focus:border-purple-500/70 transition-colors resize-none"
                  />
                </div>

                {status === "error" && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading || !email.trim() || !message.trim()}
                  className="w-full flex items-center justify-center gap-2 rounded-full bg-foreground py-2.5 text-xs sm:text-sm font-medium text-background hover:opacity-90 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-background border-t-transparent rounded-full animate-spin" />
                      <span>Transmitting Message...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Direct to Inbox</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Quick Fallbacks & Direct Copy */}
            <div className="mt-5 pt-4 border-t border-border/60 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
              <span className="text-[11px] font-mono">
                Direct: <span className="text-foreground font-medium">deveshsingh20666@gmail.com</span>
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-border bg-secondary/50 hover:bg-secondary text-foreground text-[11px] font-medium transition-colors"
                  title="Copy email to clipboard"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>

                <a
                  href={`mailto:deveshsingh20666@gmail.com?subject=${encodeURIComponent(
                    subject || "Portfolio Contact"
                  )}&body=${encodeURIComponent(message)}`}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-border bg-secondary/50 hover:bg-secondary text-foreground text-[11px] font-medium transition-colors"
                  title="Open in your default mail app"
                >
                  <Mail className="w-3 h-3" />
                  <span>Mail App</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ContactModal;
