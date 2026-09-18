export {};

declare global {
  interface Window {
    __lastErrorMessage?: string;
    __lastErrorStack?: string;
  }
}
