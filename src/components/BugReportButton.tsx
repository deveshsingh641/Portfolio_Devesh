import React, { useState } from "react";
import { createPortal } from "react-dom";
import { Bug, X, Send, CheckCircle, AlertTriangle, AlertCircle } from "lucide-react";

interface BugReportProps {
  theme: string;
}

const BugReportButton: React.FC<BugReportProps> = ({ theme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ type: "bug", title: "", description: "", email: "" });
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string | undefined;
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID as string | undefined;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string | undefined;
      const receiveEmail = import.meta.env.VITE_RECEIVE_EMAIL as string | undefined;

      console.log("🐛 Bug Report Email Config:", { 
        publicKey: publicKey ? "✓ Found" : "✗ Missing", 
        serviceId: serviceId ? "✓ Found" : "✗ Missing", 
        templateId: templateId ? "✓ Found" : "✗ Missing", 
        receiveEmail: receiveEmail ? `✓ ${receiveEmail}` : "✗ Missing"
      });

      if (!publicKey || !serviceId || !templateId || !receiveEmail) {
        throw new Error(
          "❌ Email service not configured. Please ensure VITE_EMAILJS_PUBLIC_KEY, VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, and VITE_RECEIVE_EMAIL are set in .env.local"
        );
      }

      const emailjsModule = await import("emailjs-com");
      const emailjs = emailjsModule.default;
      emailjs.init(publicKey);

      const emailPayload = {
        to_email: receiveEmail,
        name: `[${formData.type === "bug" ? "BUG" : "FEATURE"}] ${formData.title}`,
        email: formData.email || "anonymous@portfolio.local",
        title: `Bug Report / Feature Request - ${formData.type}`,
        message: formData.description,
      };

      console.log("📤 Sending bug report with payload:", emailPayload);

      const response = await emailjs.send(serviceId, templateId, emailPayload);
      
      console.log("✅ Bug report sent successfully:", response);

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setIsOpen(false);
        setFormData({ type: "bug", title: "", description: "", email: "" });
        setIsLoading(false);
      }, 2500);
    } catch (err) {
      console.error("❌ Bug report sending failed:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to submit report. Please try again.";
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating bug report button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 left-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full shadow-lg transition-all duration-300 hover:scale-105 group ${
          theme === "dark"
            ? "bg-slate-800/90 border border-slate-700/50 text-slate-300 hover:bg-slate-700/90 hover:text-white backdrop-blur-sm"
            : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 shadow-slate-200/50"
        }`}
        title="Report a bug or suggest a feature"
      >
        <Bug size={16} className="text-amber-400 group-hover:rotate-12 transition-transform" />
        <span className="text-xs font-semibold hidden sm:inline">Report Bug</span>
      </button>

      {/* Modal */}
      {isOpen && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          <div
            className={`relative w-full max-w-lg rounded-2xl shadow-2xl border overflow-hidden ${
              theme === "dark"
                ? "bg-slate-900 border-slate-700/50"
                : "bg-white border-slate-200"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className={`flex items-center justify-between px-6 py-4 border-b ${theme === "dark" ? "border-slate-700/50" : "border-slate-200"}`}>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10">
                  <Bug size={18} className="text-amber-400" />
                </div>
                <div>
                  <h3 className={`font-bold text-sm ${theme === "dark" ? "text-slate-100" : "text-slate-900"}`}>
                    Report Bug / Suggest Feature
                  </h3>
                  <p className={`text-xs ${theme === "dark" ? "text-slate-500" : "text-slate-400"}`}>
                    Help improve this portfolio
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className={`p-1.5 rounded-lg transition-colors ${theme === "dark" ? "hover:bg-slate-800 text-slate-400" : "hover:bg-slate-100 text-slate-500"}`}
              >
                <X size={18} />
              </button>
            </div>

            {submitted ? (
              <div className="flex flex-col items-center justify-center py-16 px-6">
                <CheckCircle size={48} className="text-emerald-400 mb-4" />
                <h4 className={`text-lg font-bold mb-2 ${theme === "dark" ? "text-slate-100" : "text-slate-900"}`}>
                  Thank you!
                </h4>
                <p className={`text-sm text-center ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>
                  Your report has been submitted successfully. I'll look into it!
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Type picker */}
                <div className="flex gap-3">
                  {[
                    { value: "bug", label: "Bug Report", icon: Bug, color: "text-red-400" },
                    { value: "feature", label: "Feature Request", icon: AlertTriangle, color: "text-amber-400" },
                  ].map(({ value, label, icon: Icon, color }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setFormData((p) => ({ ...p, type: value }))}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                        formData.type === value
                          ? theme === "dark"
                            ? "bg-violet-500/15 border-violet-400/40 text-violet-300"
                            : "bg-violet-50 border-violet-300 text-violet-700"
                          : theme === "dark"
                            ? "bg-slate-800/40 border-slate-700/50 text-slate-400 hover:border-slate-600"
                            : "bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300"
                      }`}
                    >
                      <Icon size={14} className={formData.type === value ? color : ""} />
                      {label}
                    </button>
                  ))}
                </div>

                {/* Title */}
                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>
                    Title
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                    placeholder={formData.type === "bug" ? "Describe the bug briefly..." : "What feature would you like?"}
                    className={`w-full px-4 py-2.5 rounded-xl text-sm border outline-none transition-all ${
                      theme === "dark"
                        ? "bg-slate-800/60 border-slate-700/50 text-slate-200 placeholder-slate-500 focus:border-violet-400/50"
                        : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-violet-400"
                    }`}
                  />
                </div>

                {/* Description */}
                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>
                    Description
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                    placeholder="Provide details. Steps to reproduce if it's a bug..."
                    className={`w-full px-4 py-2.5 rounded-xl text-sm border outline-none transition-all resize-none ${
                      theme === "dark"
                        ? "bg-slate-800/60 border-slate-700/50 text-slate-200 placeholder-slate-500 focus:border-violet-400/50"
                        : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-violet-400"
                    }`}
                  />
                </div>

                {/* Email (optional) */}
                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>
                    Email <span className="font-normal normal-case">(optional — for follow-up)</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                    placeholder="you@example.com"
                    className={`w-full px-4 py-2.5 rounded-xl text-sm border outline-none transition-all ${
                      theme === "dark"
                        ? "bg-slate-800/60 border-slate-700/50 text-slate-200 placeholder-slate-500 focus:border-violet-400/50"
                        : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-violet-400"
                    }`}
                  />
                </div>

                {/* Error message */}
                {error && (
                  <div className={`flex gap-2 p-3 rounded-xl text-sm ${theme === "dark" ? "bg-red-500/10 border border-red-500/20 text-red-400" : "bg-red-50 border border-red-200 text-red-700"}`}>
                    <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                    {error}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${
                    isLoading
                      ? "bg-gradient-to-r from-violet-600/50 to-cyan-500/50 text-white cursor-not-allowed opacity-70"
                      : "bg-gradient-to-r from-violet-600 to-cyan-500 text-white hover:shadow-lg hover:shadow-violet-500/20 hover:scale-[1.01] active:scale-[0.99]"
                  }`}
                >
                  <Send size={14} />
                  {isLoading ? "Sending..." : "Submit Report"}
                </button>
              </form>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default BugReportButton;
