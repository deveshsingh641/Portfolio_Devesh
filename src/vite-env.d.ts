/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_EMAILJS_PUBLIC_KEY?: string;
  readonly VITE_EMAILJS_SERVICE_ID?: string;
  readonly VITE_EMAILJS_TEMPLATE_ID?: string;
  readonly VITE_RECEIVE_EMAIL?: string;
  readonly VITE_FORMSPREE_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  __lenis?: import("lenis").default;
}

interface Document {
  startViewTransition?: (updateCallback: () => Promise<void> | void) => {
    finished: Promise<void>;
  };
}
