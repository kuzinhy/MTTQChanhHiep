import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertOctagon, RotateCcw, Home } from 'lucide-react';

export interface AppErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export interface AppErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  constructor(props: AppErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  public static getDerivedStateFromError(error: Error): AppErrorBoundaryState {
    return { hasError: true, error, errorInfo: null };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('AppErrorBoundary caught an uncaught exception:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.hash = '#/trang-chu';
    window.location.reload();
  };

  public override render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
          <div className="max-w-xl w-full bg-slate-800 rounded-3xl border border-slate-700 p-8 shadow-2xl space-y-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/20 text-rose-400 mx-auto flex items-center justify-center border border-rose-500/30">
              <AlertOctagon className="w-9 h-9 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-black text-white">
                Đã Xảy Ra Sự Cố Hiển Thị
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Hệ thống Cổng thông tin MTTQ Phường Chánh Hiệp đã kích hoạt cơ chế bảo vệ phiên làm việc an toàn để tránh mất mát dữ liệu.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-700 text-left font-mono text-[11px] text-rose-300 overflow-x-auto max-h-32">
                <span className="font-bold text-slate-400">Chi tiết lỗi: </span>
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleReset}
                className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Tải lại &amp; Khôi phục Cổng TT</span>
              </button>

              <button
                onClick={() => {
                  window.location.hash = '#/trang-chu';
                  window.location.reload();
                }}
                className="w-full sm:w-auto px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span>Về Trang chủ</span>
              </button>
            </div>

            <p className="text-[10px] text-slate-400">
              Ủy ban MTTQ Việt Nam Phường Chánh Hiệp - Hotline hỗ trợ kỹ thuật: 0989614614
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
