import React, { useState } from "react";
import Tilt from "react-parallax-tilt";
import { Mail, Globe, Linkedin, Github, Twitter, CheckCircle, AlertCircle, Copy, Check, Send } from "lucide-react";

interface ContactSectionProps {
  theme: string;
  visibleSections: Set<string>;
  formData: {
    name: string;
    email: string;
    subject: string;
    message: string;
  };
  formStatus: {
    status: string;
    message: string;
  };
  handleFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleFormSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isMobile: boolean;
}

const ContactSection: React.FC<ContactSectionProps> = ({
  theme,
  visibleSections,
  formData,
  formStatus,
  handleFormChange,
  handleFormSubmit,
  isMobile,
}) => {
  const [copiedEmail, setCopiedEmail] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText("deveshsingh20666@gmail.com");
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } catch {
      // fallback ignored
    }
  };

  return (
    <section
      id="contact"
      data-reveal
      className={`reveal-section ${
        visibleSections.has("contact") ? "is-visible" : ""
      } py-28 px-6 relative overflow-hidden transition-colors duration-300 ${
        theme === "dark" ? "bg-neutral-950" : "bg-neutral-50/50"
      }`}
    >
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Arslan Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono tracking-wider uppercase border mb-3 border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400">
            <span>GET IN TOUCH</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
            <span className="text-neutral-400 dark:text-neutral-500">Let's Build </span>
            <span className="text-neutral-900 dark:text-white">Something Great</span>
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 mt-2 max-w-xl mx-auto">
            Have a project in mind, an engineering role, or just want to chat? Drop a line below.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Quick Contact & Info (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Quick Email Card */}
            <div
              className={`p-6 sm:p-7 rounded-3xl border transition-all duration-300 ${
                theme === "dark"
                  ? "bg-neutral-900/60 border-neutral-800"
                  : "bg-white border-neutral-200 shadow-sm"
              }`}
            >
              <h3 className="font-display text-xl font-bold mb-2 text-neutral-900 dark:text-white">
                Contact Information
              </h3>
              <p className="text-sm text-neutral-500 mb-6">
                Feel free to reach out through any of these channels. I typically respond within 24 hours.
              </p>

              {/* Direct email pill with copy */}
              <div className="space-y-4">
                <div className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
                  theme === 'dark' ? 'bg-neutral-900/90 border-neutral-800' : 'bg-neutral-50 border-neutral-200'
                }`}>
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                      <Mail size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">EMAIL</p>
                      <a
                        href="mailto:deveshsingh20666@gmail.com"
                        className="text-xs sm:text-sm font-mono truncate block text-neutral-800 dark:text-neutral-200 hover:text-emerald-500 transition-colors"
                      >
                        deveshsingh20666@gmail.com
                      </a>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={copyEmail}
                    className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-neutral-500 shrink-0"
                    title="Copy email address"
                  >
                    {copiedEmail ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                  </button>
                </div>

                {/* Location */}
                <div className={`p-4 rounded-2xl border flex items-center gap-3 ${
                  theme === 'dark' ? 'bg-neutral-900/90 border-neutral-800' : 'bg-neutral-50 border-neutral-200'
                }`}>
                  <div className="w-10 h-10 rounded-full bg-cyan-500/10 text-cyan-500 flex items-center justify-center shrink-0">
                    <Globe size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">LOCATION</p>
                    <p className="text-xs sm:text-sm font-mono text-neutral-800 dark:text-neutral-200">
                      India · Open to Remote & Global Relocation
                    </p>
                  </div>
                </div>

                {/* Status Pill */}
                <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <p className="text-xs font-mono text-emerald-600 dark:text-emerald-400">
                    <strong>Currently Available</strong> for internships, full-time engineering roles, and selected freelance contracts.
                  </p>
                </div>
              </div>

              {/* Social Channels Strip */}
              <div className="mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-800/80">
                <p className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-3">
                  Social Channels
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { href: "https://github.com/deveshsingh641", icon: Github, label: "GitHub" },
                    { href: "https://linkedin.com/in/deveshsingh64", icon: Linkedin, label: "LinkedIn" },
                    { href: "https://x.com/harshhere_666", icon: Twitter, label: "X" },
                    { href: "https://deveshdev.live", icon: Globe, label: "Website" },
                  ].map(({ href, icon: Icon, label }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-mono transition-all hover:scale-105 ${
                        theme === "dark"
                          ? "border-neutral-800 bg-neutral-900/80 text-neutral-300 hover:text-white hover:border-neutral-700"
                          : "border-neutral-200 bg-neutral-50 text-neutral-700 hover:text-neutral-900 hover:border-neutral-300"
                      }`}
                    >
                      <Icon size={12} />
                      <span>{label}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Send a Message Form (7 cols) */}
          <div className="lg:col-span-7">
            <Tilt
              tiltMaxAngleX={isMobile ? 0 : 2}
              tiltMaxAngleY={isMobile ? 0 : 2}
              tiltEnable={!isMobile}
              glareEnable={!isMobile}
              glareMaxOpacity={0.04}
            >
              <div
                className={`p-7 sm:p-10 rounded-3xl border transition-all duration-300 ${
                  theme === "dark"
                    ? "bg-neutral-900/60 border-neutral-800"
                    : "bg-white border-neutral-200 shadow-sm"
                }`}
              >
                <h3 className="font-display text-xl sm:text-2xl font-bold mb-1 text-neutral-900 dark:text-white">
                  Send a Message
                </h3>
                <p className="text-sm text-neutral-500 mb-6">
                  Fill out the details below and I will get back to you promptly.
                </p>

                {/* Status Messages */}
                {formStatus.status && (
                  <div
                    className={`mb-6 p-4 rounded-2xl flex items-center gap-3 text-sm font-medium ${
                      formStatus.status === "success"
                        ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                        : formStatus.status === "error"
                          ? "bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400"
                          : "bg-cyan-500/10 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400"
                    }`}
                    role={formStatus.status === "error" ? "alert" : "status"}
                    aria-live="polite"
                  >
                    {formStatus.status === "success" && <CheckCircle size={18} className="shrink-0" />}
                    {formStatus.status === "error" && <AlertCircle size={18} className="shrink-0" />}
                    <span>{formStatus.message}</span>
                  </div>
                )}

                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="contact-name"
                        className="block text-[11px] font-mono uppercase tracking-wider text-neutral-500 mb-1.5"
                      >
                        Your Name
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        name="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleFormChange}
                        required
                        disabled={formStatus.status === "sending"}
                        className={`w-full px-4 py-3 rounded-2xl text-sm border outline-none transition-all ${
                          theme === "dark"
                            ? "bg-neutral-950/60 border-neutral-800 text-white placeholder-neutral-600 focus:border-neutral-500"
                            : "bg-neutral-50 border-neutral-200 text-neutral-900 placeholder-neutral-400 focus:border-neutral-400"
                        }`}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="contact-email"
                        className="block text-[11px] font-mono uppercase tracking-wider text-neutral-500 mb-1.5"
                      >
                        Your Email
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        name="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={handleFormChange}
                        required
                        disabled={formStatus.status === "sending"}
                        className={`w-full px-4 py-3 rounded-2xl text-sm border outline-none transition-all ${
                          theme === "dark"
                            ? "bg-neutral-950/60 border-neutral-800 text-white placeholder-neutral-600 focus:border-neutral-500"
                            : "bg-neutral-50 border-neutral-200 text-neutral-900 placeholder-neutral-400 focus:border-neutral-400"
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="contact-subject"
                      className="block text-[11px] font-mono uppercase tracking-wider text-neutral-500 mb-1.5"
                    >
                      Subject
                    </label>
                    <input
                      id="contact-subject"
                      type="text"
                      name="subject"
                      placeholder="Project Inquiry / Job Opportunity"
                      value={formData.subject}
                      onChange={handleFormChange}
                      disabled={formStatus.status === "sending"}
                      className={`w-full px-4 py-3 rounded-2xl text-sm border outline-none transition-all ${
                        theme === "dark"
                          ? "bg-neutral-950/60 border-neutral-800 text-white placeholder-neutral-600 focus:border-neutral-500"
                          : "bg-neutral-50 border-neutral-200 text-neutral-900 placeholder-neutral-400 focus:border-neutral-400"
                      }`}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-message"
                      className="block text-[11px] font-mono uppercase tracking-wider text-neutral-500 mb-1.5"
                    >
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={5}
                      placeholder="Tell me about your project, timeline, or idea..."
                      value={formData.message}
                      onChange={handleFormChange}
                      required
                      disabled={formStatus.status === "sending"}
                      className={`w-full px-4 py-3 rounded-2xl text-sm border outline-none resize-none transition-all ${
                        theme === "dark"
                          ? "bg-neutral-950/60 border-neutral-800 text-white placeholder-neutral-600 focus:border-neutral-500"
                          : "bg-neutral-50 border-neutral-200 text-neutral-900 placeholder-neutral-400 focus:border-neutral-400"
                      }`}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={formStatus.status === "sending"}
                    className="rainbow-border w-full py-3.5 px-6 rounded-full text-white font-medium text-sm transition-transform hover:scale-[1.01] active:scale-98 shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {formStatus.status === "sending" ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Sending message...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <Send size={15} />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </Tilt>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
