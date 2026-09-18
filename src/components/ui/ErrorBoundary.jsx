import React from "react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Unhandled render error:", error, errorInfo);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink px-6 font-mono text-fg">
        <div
          className="relative w-full max-w-lg overflow-hidden rounded-[22px] border border-red-500/25 p-8"
          style={{ background: "linear-gradient(150deg, rgba(239,68,68,0.10), rgba(11,15,24,0.85))" }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-[2px]"
            style={{ background: "linear-gradient(90deg, transparent, #ef4444 30%, #fca5a5 50%, #ef4444 70%, transparent)" }}
          />
          <div className="text-[10px] tracking-[0.26em] text-red-300">SYSTEM FAULT</div>
          <h1 className="m-0 mt-4 font-sans text-2xl font-bold tracking-[-0.02em] text-fg-bright">
            Something broke while rendering.
          </h1>
          <p className="m-0 mt-4 text-[13px] leading-relaxed text-muted">
            The error has been logged to the console. Reloading usually clears it.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-8 w-full rounded-full border border-red-400/40 py-4 text-[12px] tracking-[0.22em] text-red-200 transition-[background-color,color,border-color] duration-300 hover:border-red-400 hover:bg-red-500/15 hover:text-white"
          >
            RELOAD
          </button>
        </div>
      </div>
    );
  }
}
