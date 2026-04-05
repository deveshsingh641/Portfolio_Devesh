import React from "react";

interface AppErrorBoundaryState {
  hasError: boolean;
  errorMessage?: string;
  errorStack?: string;
}

declare global {
  interface Window {
    __lastErrorMessage?: string;
    __lastErrorStack?: string;
  }
}

class AppErrorBoundary extends React.Component<React.PropsWithChildren, AppErrorBoundaryState> {
  constructor(props: React.PropsWithChildren) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): AppErrorBoundaryState {
    return { hasError: true, errorMessage: error.message };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("App runtime error:", error, errorInfo);
    this.setState({
      errorMessage: error.message,
      errorStack: errorInfo.componentStack,
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const globalErrorMessage = typeof window !== "undefined" ? window.__lastErrorMessage : undefined;
      const globalErrorStack = typeof window !== "undefined" ? window.__lastErrorStack : undefined;
      const message = this.state.errorMessage || globalErrorMessage;
      const stack = this.state.errorStack || globalErrorStack;
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100 px-6">
          <div className="max-w-md text-center rounded-2xl border border-slate-700 bg-slate-900/80 p-8">
            <h1 className="text-2xl font-bold mb-3">Something went wrong</h1>
            <p className="text-slate-300 text-sm mb-6">
              The portfolio hit an unexpected runtime issue. Please reload the page.
            </p>
            {message && (
              <div className="mb-4 text-left text-xs text-slate-400 bg-slate-950/50 border border-slate-700/50 rounded-lg p-3">
                <p className="font-semibold text-slate-300">Error</p>
                <p className="mt-1 break-words">{message}</p>
                {stack && (
                  <pre className="mt-2 whitespace-pre-wrap break-words text-[10px] text-slate-500">
                    {stack}
                  </pre>
                )}
              </div>
            )}
            <button
              type="button"
              onClick={this.handleReload}
              className="px-5 py-2.5 rounded-lg font-semibold bg-gradient-to-r from-violet-600 to-cyan-500 text-white hover:opacity-90 transition"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AppErrorBoundary;
