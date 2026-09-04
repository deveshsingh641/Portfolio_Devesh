import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import App from './App.tsx';
import AppErrorBoundary from './components/AppErrorBoundary.tsx';
import './index.css';

declare global {
  interface Window {
    __lastErrorMessage?: string;
    __lastErrorStack?: string;
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    window.__lastErrorMessage = event.error?.message || event.message || 'Unknown error';
    window.__lastErrorStack = event.error?.stack || '';
  });

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason as Error | string | undefined;
    window.__lastErrorMessage = typeof reason === 'string' ? reason : reason?.message || 'Unhandled rejection';
    window.__lastErrorStack = typeof reason === 'string' ? '' : reason?.stack || '';
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppErrorBoundary>
      <App />
      <Analytics />
      <SpeedInsights />
    </AppErrorBoundary>
  </StrictMode>
);
