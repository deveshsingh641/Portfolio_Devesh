import React from "react";
import Tilt from "react-parallax-tilt";
import { Mail, Globe, Linkedin, Github, Twitter, CheckCircle, AlertCircle } from "lucide-react";

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
  return (
    <section
      id="contact"
      data-reveal
      className={`reveal-section ${
        visibleSections.has("contact") ? "is-visible" : ""
      } py-24 relative overflow-hidden transition-colors duration-300 ${
        theme === "dark"
          ? "bg-gradient-to-b from-slate-900/40 via-violet-900/30 to-slate-900/40"
          : "bg-gradient-to-b from-slate-100/40 via-violet-50/30 to-slate-100/40"
      }`}
    >
      {/* Background decoration */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-violet-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        {/* Section header */}
        <div className="text-center mb-4">
          <span className="inline-block text-xs font-bold uppercase tracking-[0.3em] text-cyan-400 mb-3">
            Get in Touch
          </span>
          <h2
            className={`text-4xl md:text-5xl font-bold mb-4 ${
              theme === "dark" ? "text-slate-100" : "text-slate-900"
            }`}
          >
            Let's{" "}
            <span className="bg-gradient-to-r from-violet-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Connect
            </span>
          </h2>
          <p
            className={`text-lg max-w-2xl mx-auto leading-relaxed ${
              theme === "dark" ? "text-slate-300" : "text-slate-600"
            }`}
          >
            Have a project in mind? Want to collaborate? Or just want to say hello? I'd love to hear
            from you.
          </p>
          <div className="w-32 h-1.5 bg-gradient-to-r from-violet-600 via-emerald-500 to-cyan-400 mx-auto rounded-full shadow-lg shadow-violet-400/50 mt-6" />
        </div>

        <div className="grid lg:grid-cols-5 gap-8 mt-14">
          {/* LEFT — Contact Information */}
          <div className="lg:col-span-2 space-y-6">
            <div
              className={`rounded-2xl p-8 border shadow-xl ${
                theme === "dark"
                  ? "bg-gradient-to-br from-slate-900/90 via-violet-900/25 to-slate-900/90 border-violet-400/20"
                  : "bg-white border-slate-200"
              }`}
            >
              <h3 className={`text-xl font-bold mb-2 ${theme === "dark" ? "text-slate-100" : "text-slate-900"}`}>
                Contact Information
              </h3>
              <p
                className={`text-sm mb-8 ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}
              >
                Feel free to reach out through any of these channels. I typically respond within 24
                hours.
              </p>

              {/* Email */}
              <div className="space-y-5">
                <a href="mailto:deveshsingh20666@gmail.com" className="flex items-start gap-4 group">
                  <div className="w-10 h-10 rounded-lg bg-violet-500/15 border border-violet-400/25 flex items-center justify-center shrink-0 group-hover:bg-violet-500/25 group-hover:border-violet-400/40 transition-all">
                    <Mail size={18} className="text-violet-300" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-0.5">
                      Email
                    </p>
                    <p
                      className={`text-sm transition-colors ${
                        theme === "dark"
                          ? "text-slate-200 group-hover:text-cyan-300"
                          : "text-slate-700 group-hover:text-cyan-600"
                      }`}
                    >
                      deveshsingh20666@gmail.com
                    </p>
                  </div>
                </a>

                {/* Location */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/15 border border-emerald-400/25 flex items-center justify-center shrink-0">
                    <Globe size={18} className="text-emerald-300" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-0.5">
                      Location
                    </p>
                    <p className={`text-sm ${theme === "dark" ? "text-slate-200" : "text-slate-700"}`}>
                      India
                    </p>
                  </div>
                </div>

                {/* LinkedIn */}
                <a
                  href="https://linkedin.com/in/deveshsingh64"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/15 border border-cyan-400/25 flex items-center justify-center shrink-0 group-hover:bg-cyan-500/25 group-hover:border-cyan-400/40 transition-all">
                    <Linkedin size={18} className="text-cyan-300" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-0.5">
                      LinkedIn
                    </p>
                    <p
                      className={`text-sm transition-colors ${
                        theme === "dark"
                          ? "text-slate-200 group-hover:text-cyan-300"
                          : "text-slate-700 group-hover:text-cyan-600"
                      }`}
                    >
                      Devesh Singh
                    </p>
                  </div>
                </a>
              </div>

              {/* Social links row */}
              <div
                className={`mt-8 pt-6 border-t ${
                  theme === "dark" ? "border-slate-700/50" : "border-slate-200"
                }`}
              >
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
                  Follow Me
                </h4>
                <div className="flex items-center gap-3">
                  {[
                    { href: "https://deveshdev.live", icon: Globe, label: "Website" },
                    { href: "https://github.com/deveshsingh641", icon: Github, label: "GitHub" },
                    {
                      href: "https://linkedin.com/in/deveshsingh64",
                      icon: Linkedin,
                      label: "LinkedIn",
                    },
                    { href: "https://x.com/harshhere_666", icon: Twitter, label: "X / Twitter" },
                  ].map(({ href, icon: Icon, label }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-10 h-10 rounded-lg border flex items-center justify-center transition-all duration-300 ${
                        theme === "dark"
                          ? "border-slate-700/60 bg-slate-800/40 text-slate-400 hover:text-cyan-300 hover:border-cyan-400/40 hover:bg-cyan-500/10"
                          : "border-slate-200 bg-slate-50 text-slate-500 hover:text-cyan-600 hover:border-cyan-400/40 hover:bg-cyan-50"
                      }`}
                      title={label}
                      aria-label={label}
                    >
                      <Icon size={17} />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Availability badge */}
            <div
              className={`rounded-2xl p-6 border shadow-lg ${
                theme === "dark"
                  ? "bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border-emerald-400/20"
                  : "bg-emerald-50 border-emerald-200"
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <span
                  className={`text-sm font-bold ${
                    theme === "dark" ? "text-emerald-300" : "text-emerald-700"
                  }`}
                >
                  Available for work
                </span>
              </div>
              <p
                className={`text-xs leading-relaxed ${
                  theme === "dark" ? "text-slate-400" : "text-slate-600"
                }`}
              >
                I'm currently open to new opportunities and exciting projects. Let's create
                something amazing together!
              </p>
            </div>
          </div>

          {/* RIGHT — Send a Message form */}
          <div className="lg:col-span-3">
            <Tilt
              tiltMaxAngleX={isMobile ? 0 : 2}
              tiltMaxAngleY={isMobile ? 0 : 2}
              tiltEnable={!isMobile}
              glareEnable={!isMobile}
              glareMaxOpacity={0.05}
            >
              <div
                className={`rounded-2xl p-8 md:p-10 border shadow-xl ${
                  theme === "dark"
                    ? "bg-gradient-to-br from-slate-900/90 via-violet-900/25 to-slate-900/90 border-violet-400/20"
                    : "bg-white border-slate-200"
                }`}
              >
                <h3 className={`text-xl font-bold mb-1 ${theme === "dark" ? "text-slate-100" : "text-slate-900"}`}>
                  Send a Message
                </h3>
                <p
                  className={`text-sm mb-8 ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}
                >
                  I'll get back to you within 24–48 hours.
                </p>

                {/* Status Messages */}
                {formStatus.status && (
                  <div
                    className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
                      formStatus.status === "success"
                        ? "bg-emerald-500/15 border border-emerald-400/40 text-emerald-300"
                        : formStatus.status === "error"
                          ? "bg-red-500/15 border border-red-400/40 text-red-300"
                          : "bg-blue-500/15 border border-blue-400/40 text-blue-300"
                    }`}
                    role={formStatus.status === "error" ? "alert" : "status"}
                    aria-live="polite"
                  >
                    {formStatus.status === "success" && <CheckCircle size={18} className="flex-shrink-0" />}
                    {formStatus.status === "error" && <AlertCircle size={18} className="flex-shrink-0" />}
                    <span className="text-sm font-medium">{formStatus.message}</span>
                  </div>
                )}

                <form onSubmit={handleFormSubmit} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label
                        htmlFor="contact-name"
                        className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2"
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
                        className={`w-full px-4 py-3 border rounded-xl text-sm outline-none transition-all hover:border-slate-600/80 focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400/40 disabled:opacity-50 ${
                          theme === "dark"
                            ? "bg-slate-800/40 border-slate-700/60 text-slate-100 placeholder-slate-500"
                            : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400"
                        }`}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="contact-email"
                        className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2"
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
                        className={`w-full px-4 py-3 border rounded-xl text-sm outline-none transition-all hover:border-slate-600/80 focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400/40 disabled:opacity-50 ${
                          theme === "dark"
                            ? "bg-slate-800/40 border-slate-700/60 text-slate-100 placeholder-slate-500"
                            : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400"
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="contact-subject"
                      className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2"
                    >
                      Subject
                    </label>
                    <input
                      id="contact-subject"
                      type="text"
                      name="subject"
                      placeholder="Project Collaboration"
                      value={formData.subject}
                      onChange={handleFormChange}
                      disabled={formStatus.status === "sending"}
                      className={`w-full px-4 py-3 border rounded-xl text-sm outline-none transition-all hover:border-slate-600/80 focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400/40 disabled:opacity-50 ${
                        theme === "dark"
                          ? "bg-slate-800/40 border-slate-700/60 text-slate-100 placeholder-slate-500"
                          : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400"
                      }`}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-message"
                      className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2"
                    >
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={5}
                      placeholder="Tell me about your project..."
                      value={formData.message}
                      onChange={handleFormChange}
                      required
                      disabled={formStatus.status === "sending"}
                      className={`w-full px-4 py-3 border rounded-xl text-sm outline-none transition-all resize-none hover:border-slate-600/80 focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400/40 disabled:opacity-50 ${
                        theme === "dark"
                          ? "bg-slate-800/40 border-slate-700/60 text-slate-100 placeholder-slate-500"
                          : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400"
                      }`}
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={formStatus.status === "sending"}
                    className="w-full bg-gradient-to-r from-violet-600 via-emerald-500 to-cyan-400 text-white font-bold py-3.5 rounded-xl hover:shadow-2xl hover:shadow-violet-500/30 hover:scale-[1.02] transition-all transform active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {formStatus.status === "sending" ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Mail size={16} />
                        Send Message
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
