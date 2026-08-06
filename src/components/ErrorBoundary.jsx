"use client";

import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught an error:", error, info);
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-[1.8rem] border border-rose-500/30 bg-rose-500/10 p-6 text-rose-100 shadow-lg shadow-rose-500/10">
          <h2 className="text-xl font-semibold text-white">Rendering error</h2>
          <p className="mt-2 text-sm text-rose-200">
            {this.props.message ||
              "A component failed to render. Inspect the boundary to identify the problem."}
          </p>
          <pre className="mt-4 max-h-40 overflow-auto rounded-xl bg-slate-950 p-3 text-xs text-slate-200">
            {String(this.state.error)}
          </pre>
          <button
            type="button"
            onClick={this.resetError}
            className="mt-4 rounded-3xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
