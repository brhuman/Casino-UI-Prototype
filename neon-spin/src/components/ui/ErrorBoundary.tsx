import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertOctagon, RotateCcw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackMessage?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleRestart = () => {
    // When dealing with PIXI context loss or catastrophic failures, 
    // a full page reload is often the safest and cleanest recovery.
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-black/90 backdrop-blur-md rounded-3xl p-6 min-h-[300px]">
          <div className="flex flex-col items-center justify-center text-center max-w-md gap-4 p-8 border border-red-500/30 bg-red-500/10 rounded-2xl shadow-[0_0_50px_rgba(239,68,68,0.2)]">
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
              <AlertOctagon className="text-red-500 w-8 h-8" />
            </div>
            
            <h3 className="text-xl sm:text-2xl font-black uppercase text-white tracking-widest leading-none mt-2">
              System Error
            </h3>
            
            <p className="text-red-400/80 text-[11px] sm:text-xs uppercase tracking-[0.2em] mb-4">
              {this.props.fallbackMessage || 'The game engine encountered a critical rendering fault.'}
            </p>

            {this.state.error && (
              <div className="w-full max-h-24 overflow-y-auto bg-black/50 p-3 rounded-lg border border-red-500/20 mb-2 scrollbar-hide text-left">
                <code className="text-red-500/60 text-[9px] font-mono break-words">
                  {this.state.error.message}
                </code>
              </div>
            )}

            <button
              onClick={this.handleRestart}
              className="mt-4 px-8 py-3 bg-red-500 text-black font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-white transition-colors duration-300 flex items-center gap-2 max-w-[200px]"
            >
              <RotateCcw size={14} /> Reboot System
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
