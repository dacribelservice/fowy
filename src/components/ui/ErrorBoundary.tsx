"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

interface Props {
  children?: ReactNode;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary atrapó un error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-full w-full bg-slate-50 p-6 text-center border border-red-100 rounded-[30px] shadow-sm">
          <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle size={32} />
          </div>
          <h2 className="text-lg font-black text-slate-800 mb-2">
            Algo salió mal
          </h2>
          <p className="text-sm text-slate-500 mb-6 max-w-[280px]">
            {this.props.fallbackMessage || "Tuvimos un problema temporal cargando esta sección. Las demás áreas siguen funcionando."}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="flex items-center gap-2 bg-slate-800 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-slate-700 active:scale-95 transition-all"
          >
            <RefreshCcw size={16} />
            Intentar de nuevo
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
