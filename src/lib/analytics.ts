import { track } from "@vercel/analytics";

type AnalyticsValue = string | number | boolean | null;

/**
 * Safely track any custom event to Vercel Analytics.
 * Never crashes the app if tracking fails or is blocked by an adblocker.
 */
export function trackEvent(name: string, properties?: Record<string, AnalyticsValue>) {
  try {
    // 1. Primary: @vercel/analytics SDK track()
    track(name, properties);
  } catch (err) {
    // 2. Fallback: window.va queue if SDK fails to reach network
    try {
      if (typeof window !== "undefined" && typeof window.va === "function") {
        window.va("event", { name, data: properties });
      }
    } catch {
      // Silently ignore in environments without analytics (e.g. strict CSP / offline)
    }
    if (import.meta.env.DEV) {
      console.debug(`[Analytics Debug] Event "${name}":`, properties, err);
    }
  }
}

/**
 * Tracks a profile view event.
 * Fires on initial visit and when navigating between main views.
 */
export function trackProfileView(details?: Record<string, AnalyticsValue>) {
  if (typeof window === "undefined") return;

  const referrer = document.referrer ? new URL(document.referrer, window.location.href).hostname : "direct";
  const path = window.location.pathname + (window.location.hash || "");

  trackEvent("profile_view", {
    path: path || "/",
    referrer,
    screen: `${window.innerWidth}x${window.innerHeight}`,
    ...details,
  });
}

// Track visited sections with a cooldown to avoid flood on rapid scrolling
const lastSectionTimes = new Map<string, number>();
const SECTION_COOLDOWN_MS = 15000; // 15 seconds cooldown per section

export function trackSectionView(sectionName: string) {
  if (!sectionName) return;
  const now = Date.now();
  const lastTime = lastSectionTimes.get(sectionName) || 0;
  if (now - lastTime < SECTION_COOLDOWN_MS) {
    return;
  }
  lastSectionTimes.set(sectionName, now);

  trackEvent("section_view", {
    section: sectionName,
    path: typeof window !== "undefined" ? window.location.pathname : "/",
  });
}

/**
 * Tracks when a user views or downloads the resume
 */
export function trackResumeAction(action: "view" | "download", source?: string) {
  trackEvent("resume_interaction", {
    action,
    source: source || "unknown",
  });
}

/**
 * Tracks project interactions (live demo clicked, github repo opened, case study read)
 */
export function trackProjectInteraction(
  projectName: string,
  action: "demo_click" | "github_click" | "case_study_view"
) {
  trackEvent("project_interaction", {
    project: projectName,
    action,
  });
}

/**
 * Tracks contact form submissions
 */
export function trackContactSubmission(status: "success" | "error") {
  trackEvent("contact_submission", {
    status,
  });
}

/**
 * Tracks OS Mode / Terminal interactions
 */
export function trackOsModeToggle(enabled: boolean) {
  trackEvent("os_mode_toggle", {
    state: enabled ? "active" : "disabled",
  });
}
