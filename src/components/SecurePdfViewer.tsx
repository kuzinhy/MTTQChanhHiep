import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  getGoogleDrivePdfProxyUrl, 
  getGoogleDrivePreviewEmbedUrl, 
  getGoogleDriveViewUrl, 
  getGoogleDriveDirectDownloadUrl,
  extractGoogleDriveFileId
} from '../lib/googleDriveService';
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Maximize2, 
  Minimize2, 
  Download, 
  ExternalLink, 
  FileText, 
  RefreshCw, 
  Sliders, 
  LayoutGrid, 
  AlertCircle,
  CheckCircle2,
  Eye
} from 'lucide-react';

interface SecurePdfViewerProps {
  fileUrl?: string;
  driveUrl?: string;
  title?: string;
  height?: string;
  className?: string;
  onClose?: () => void;
}

type ViewerMode = 'pdfjs' | 'native' | 'drive_iframe';

declare global {
  interface Window {
    pdfjsLib?: any;
  }
}

export const SecurePdfViewer: React.FC<SecurePdfViewerProps> = ({
  fileUrl,
  driveUrl,
  title = 'Tài liệu Mặt trận',
  height = '620px',
  className = '',
  onClose
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderTaskRef = useRef<any>(null);

  const [mode, setMode] = useState<ViewerMode>('pdfjs');
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.25);
  const [rotation, setRotation] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showThumbnails, setShowThumbnails] = useState<boolean>(false);
  const [pdfDoc, setPdfDoc] = useState<any>(null);

  const targetSource = driveUrl || fileUrl || '';
  const fileId = extractGoogleDriveFileId(targetSource);
  const proxyPdfUrl = getGoogleDrivePdfProxyUrl(targetSource);
  const directDownloadUrl = getGoogleDriveDirectDownloadUrl(targetSource) || proxyPdfUrl;
  const driveViewUrl = getGoogleDriveViewUrl(targetSource) || targetSource;
  const driveEmbedUrl = getGoogleDrivePreviewEmbedUrl(targetSource);

  // Dynamically load PDF.js CDN script if not present
  const loadPdfJsLib = useCallback(async (): Promise<any> => {
    if (window.pdfjsLib) {
      return window.pdfjsLib;
    }

    return new Promise((resolve, reject) => {
      const scriptId = 'pdfjs-dist-script';
      if (document.getElementById(scriptId)) {
        const checkInterval = setInterval(() => {
          if (window.pdfjsLib) {
            clearInterval(checkInterval);
            resolve(window.pdfjsLib);
          }
        }, 100);
        setTimeout(() => {
          clearInterval(checkInterval);
          if (window.pdfjsLib) resolve(window.pdfjsLib);
          else reject(new Error('Timeout loading PDF.js'));
        }, 8000);
        return;
      }

      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      script.async = true;
      script.onload = () => {
        if (window.pdfjsLib) {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
          resolve(window.pdfjsLib);
        } else {
          reject(new Error('PDF.js library failed to initialize'));
        }
      };
      script.onerror = () => reject(new Error('Không thể tải thư viện giải mã PDF từ CDN'));
      document.body.appendChild(script);
    });
  }, []);

  // Fetch and load PDF document
  useEffect(() => {
    let isCancelled = false;

    if (!proxyPdfUrl) {
      setLoading(false);
      setError('Chưa có liên kết tài liệu hợp lệ.');
      return;
    }

    if (mode !== 'pdfjs') {
      setLoading(false);
      return;
    }

    const initPdf = async () => {
      try {
        setLoading(true);
        setError(null);
        setLoadingProgress(10);

        const pdfjs = await loadPdfJsLib();
        if (isCancelled) return;

        setLoadingProgress(40);

        let documentSource: any = {
          url: proxyPdfUrl,
          withCredentials: false,
          cMapUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/',
          cMapPacked: true,
        };

        if (proxyPdfUrl.startsWith('data:application/pdf;base64,')) {
          try {
            const b64Data = proxyPdfUrl.split(',')[1];
            const binaryString = window.atob(b64Data);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
              bytes[i] = binaryString.charCodeAt(i);
            }
            documentSource = {
              data: bytes,
              cMapUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/',
              cMapPacked: true,
            };
          } catch (e) {
            console.warn('[SecurePdfViewer] Failed converting base64 data URL, passing as URL:', e);
          }
        }

        const loadingTask = pdfjs.getDocument(documentSource);

        loadingTask.onProgress = (data: { loaded: number; total: number }) => {
          if (data.total > 0) {
            const percent = Math.min(95, Math.round((data.loaded / data.total) * 100));
            setLoadingProgress(percent);
          }
        };

        const doc = await loadingTask.promise;
        if (isCancelled) return;

        setPdfDoc(doc);
        setNumPages(doc.numPages);
        setCurrentPage(1);
        setLoadingProgress(100);
        setLoading(false);
      } catch (err: any) {
        console.warn('[SecurePdfViewer] Error loading PDF via PDF.js, switching fallback mode:', err);
        if (!isCancelled) {
          setError(err.message || 'Không thể giải mã trực tiếp PDF qua canvas. Chuyển sang chế độ nhúng.');
          setLoading(false);
          // Automatically fallback to iframe mode if PDF.js fails
          setMode('drive_iframe');
        }
      }
    };

    initPdf();

    return () => {
      isCancelled = true;
      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel();
        } catch (e) {
          // Ignore cancellation errors
        }
      }
    };
  }, [proxyPdfUrl, mode, loadPdfJsLib]);

  // Render current page onto canvas
  useEffect(() => {
    if (!pdfDoc || mode !== 'pdfjs' || !canvasRef.current) return;

    let isCurrentRender = true;

    const renderPage = async () => {
      try {
        if (renderTaskRef.current) {
          try {
            renderTaskRef.current.cancel();
          } catch (e) {
            // ignore
          }
        }

        const page = await pdfDoc.getPage(currentPage);
        if (!isCurrentRender || !canvasRef.current) return;

        const viewport = page.getViewport({ scale, rotation });
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        if (!context) return;

        // Output at device pixel ratio for super-crisp text
        const outputScale = window.devicePixelRatio || 1;
        canvas.width = Math.floor(viewport.width * outputScale);
        canvas.height = Math.floor(viewport.height * outputScale);
        canvas.style.width = Math.floor(viewport.width) + 'px';
        canvas.style.height = Math.floor(viewport.height) + 'px';

        const transform = outputScale !== 1 
          ? [outputScale, 0, 0, outputScale, 0, 0] 
          : undefined;

        const renderContext = {
          canvasContext: context,
          transform: transform,
          viewport: viewport,
        };

        const renderTask = page.render(renderContext);
        renderTaskRef.current = renderTask;
        await renderTask.promise;
      } catch (renderErr: any) {
        if (renderErr?.name !== 'RenderingCancelledException') {
          console.error('[SecurePdfViewer] Page render error:', renderErr);
        }
      }
    };

    renderPage();

    return () => {
      isCurrentRender = false;
    };
  }, [pdfDoc, currentPage, scale, rotation, mode]);

  // Handle Fullscreen toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => {
        console.warn('Fullscreen request failed:', err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const handleZoomIn = () => setScale(prev => Math.min(3.0, +(prev + 0.25).toFixed(2)));
  const handleZoomOut = () => setScale(prev => Math.max(0.5, +(prev - 0.25).toFixed(2)));
  const handleResetZoom = () => setScale(1.0);
  const handleFitWidth = () => setScale(1.35);
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < numPages) setCurrentPage(prev => prev + 1);
  };

  return (
    <div 
      ref={containerRef}
      className={`flex flex-col bg-slate-900 rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl transition-all ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none w-screen h-screen' : ''
      } ${className}`}
      style={{ height: isFullscreen ? '100vh' : height }}
    >
      {/* Top Header & Control Toolbar */}
      <div className="bg-slate-800/95 backdrop-blur-md border-b border-slate-700/90 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2.5 text-slate-200 z-10 shrink-0">
        
        {/* Left: Title & File Badge */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-1.5 bg-red-600/20 text-red-400 border border-red-500/30 rounded-lg shrink-0">
            <FileText className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-slate-100 truncate max-w-xs md:max-w-md" title={title}>
              {title}
            </h4>
            <div className="flex items-center gap-2 text-[10px] text-slate-400">
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <CheckCircle2 className="w-3 h-3" />
                <span>Bảo mật SSL / Context An toàn</span>
              </span>
              {numPages > 0 && mode === 'pdfjs' && (
                <span>• {numPages} trang</span>
              )}
            </div>
          </div>
        </div>

        {/* Center: Controls for PDF.js Mode */}
        {mode === 'pdfjs' && numPages > 0 && (
          <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-700/60 shadow-inner">
            {/* Thumbnails toggle */}
            <button
              onClick={() => setShowThumbnails(prev => !prev)}
              title="Danh sách trang"
              className={`p-1.5 rounded-lg text-xs font-semibold transition-colors ${
                showThumbnails ? 'bg-red-600 text-white' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>

            <div className="h-4 w-px bg-slate-700 mx-0.5" />

            {/* Page navigation */}
            <button
              onClick={handlePrevPage}
              disabled={currentPage <= 1}
              title="Trang trước"
              className="p-1.5 rounded-lg text-slate-300 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1 px-1 text-xs font-bold text-slate-200">
              <input
                type="number"
                min={1}
                max={numPages}
                value={currentPage}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  if (!isNaN(val) && val >= 1 && val <= numPages) {
                    setCurrentPage(val);
                  }
                }}
                className="w-9 bg-slate-800 border border-slate-700 rounded-md text-center text-xs py-0.5 text-white font-mono outline-none focus:border-red-500"
              />
              <span className="text-slate-400 font-medium">/ {numPages}</span>
            </div>

            <button
              onClick={handleNextPage}
              disabled={currentPage >= numPages}
              title="Trang sau"
              className="p-1.5 rounded-lg text-slate-300 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <div className="h-4 w-px bg-slate-700 mx-0.5" />

            {/* Zoom Controls */}
            <button
              onClick={handleZoomOut}
              title="Thu nhỏ (-)"
              className="p-1.5 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleResetZoom}
              title="Phóng chuẩn 100%"
              className="px-1.5 py-0.5 text-[11px] font-mono font-bold text-slate-300 hover:bg-slate-800 rounded-md transition-colors"
            >
              {Math.round(scale * 100)}%
            </button>

            <button
              onClick={handleZoomIn}
              title="Phóng to (+)"
              className="p-1.5 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleFitWidth}
              title="Vừa chiều ngang"
              className="px-2 py-0.5 text-[10px] font-bold text-slate-300 hover:bg-slate-800 rounded-md transition-colors hidden sm:inline-block"
            >
              Vừa trang
            </button>

            <div className="h-4 w-px bg-slate-700 mx-0.5" />

            {/* Rotate */}
            <button
              onClick={handleRotate}
              title="Xoay 90 độ"
              className="p-1.5 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Right: Mode Selector & Actions */}
        <div className="flex items-center gap-2">
          {/* Mode Switcher */}
          <div className="flex items-center bg-slate-900/90 p-0.5 rounded-xl border border-slate-700/60 text-[11px] font-bold">
            <button
              onClick={() => setMode('pdfjs')}
              className={`px-2 py-1 rounded-lg transition-all ${
                mode === 'pdfjs' 
                  ? 'bg-red-600 text-white shadow-xs' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Trình giải mã PDF.js độ nét cao"
            >
              PDF.js
            </button>
            <button
              onClick={() => setMode('drive_iframe')}
              className={`px-2 py-1 rounded-lg transition-all ${
                mode === 'drive_iframe' 
                  ? 'bg-blue-600 text-white shadow-xs' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Khung nhúng Google Drive gốc"
            >
              Drive Embed
            </button>
            <button
              onClick={() => setMode('native')}
              className={`px-2 py-1 rounded-lg transition-all ${
                mode === 'native' 
                  ? 'bg-indigo-600 text-white shadow-xs' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Trình duyệt Native Browser Object"
            >
              Trình duyệt
            </button>
          </div>

          {/* Download Button */}
          <a
            href={directDownloadUrl}
            target="_blank"
            rel="noreferrer"
            title="Tải văn bản về máy"
            className="p-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5 shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Tải về</span>
          </a>

          {/* Open in Google Drive */}
          {driveViewUrl && (
            <a
              href={driveViewUrl}
              target="_blank"
              rel="noreferrer"
              title="Mở tài liệu trên Google Drive"
              className="p-2 bg-blue-600/80 hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5 shadow-xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Google Drive</span>
            </a>
          )}

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Thu nhỏ' : 'Toàn màn hình'}
            className="p-2 bg-slate-700 hover:bg-slate-600 text-slate-200 hover:text-white rounded-xl transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>

          {/* Close button if provided */}
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 bg-red-600/30 hover:bg-red-600 text-white rounded-xl text-xs font-bold transition-colors"
              title="Đóng trình xem"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative flex overflow-hidden bg-slate-950">
        
        {/* Left Sidebar: Page Thumbnails in PDF.js mode */}
        {mode === 'pdfjs' && showThumbnails && numPages > 0 && (
          <div className="w-48 bg-slate-900 border-r border-slate-800 overflow-y-auto p-3 space-y-2 shrink-0 z-10 custom-scrollbar">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Danh sách {numPages} trang
            </div>
            {Array.from({ length: numPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-full text-left p-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                  currentPage === pageNum 
                    ? 'bg-red-600 text-white shadow-md' 
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 opacity-70" />
                  <span>Trang {pageNum}</span>
                </div>
                {currentPage === pageNum && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
              </button>
            ))}
          </div>
        )}

        {/* Viewport container */}
        <div className="flex-1 relative overflow-auto flex items-center justify-center p-4 custom-scrollbar">
          
          {/* Loading Indicator */}
          {loading && (
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center z-20 space-y-3">
              <div className="w-12 h-12 border-4 border-red-600/30 border-t-red-600 rounded-full animate-spin" />
              <p className="text-xs font-bold text-slate-300">
                Đang giải mã và bảo mật dòng văn bản... ({loadingProgress}%)
              </p>
              <div className="w-48 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-red-600 to-amber-500 transition-all duration-300"
                  style={{ width: `${loadingProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Mode 1: PDF.js Canvas Engine */}
          {mode === 'pdfjs' && (
            <div className="flex flex-col items-center justify-center my-auto transition-all shadow-2xl">
              <canvas 
                ref={canvasRef} 
                className="bg-white rounded-lg shadow-2xl max-w-full transition-all"
              />
            </div>
          )}

          {/* Mode 2: Google Drive Native Embed */}
          {mode === 'drive_iframe' && (
            <iframe
              src={driveEmbedUrl || proxyPdfUrl}
              title={title}
              className="w-full h-full border-none rounded-xl bg-white"
              allow="autoplay; fullscreen"
            />
          )}

          {/* Mode 3: Native Browser Object Stream */}
          {mode === 'native' && (
            <object
              data={proxyPdfUrl}
              type="application/pdf"
              className="w-full h-full rounded-xl bg-white"
            >
              <div className="p-8 text-center text-slate-300 space-y-4">
                <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
                <h4 className="font-bold text-base text-slate-100">Trình duyệt không hỗ trợ xem trực tiếp thẻ object</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Bạn có thể chuyển sang chế độ PDF.js Canvas hoặc mở trực tiếp trên Google Drive.
                </p>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => setMode('pdfjs')}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl"
                  >
                    Dùng PDF.js Canvas
                  </button>
                  <a
                    href={driveViewUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl"
                  >
                    Mở Google Drive
                  </a>
                </div>
              </div>
            </object>
          )}

        </div>
      </div>

      {/* Footer Info Bar */}
      <div className="bg-slate-900 border-t border-slate-800 px-4 py-2 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="font-medium text-slate-300">
            Chế độ xem: {mode === 'pdfjs' ? 'PDF.js Render Canvas' : mode === 'drive_iframe' ? 'Google Drive Embed' : 'Native Browser Stream'}
          </span>
          {fileId && (
            <span className="font-mono text-slate-500 hidden sm:inline">
              (Mã tài liệu: {fileId.substring(0, 10)}...)
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-slate-400">
            Ủy ban MTTQ Việt Nam Phường Chánh Hiệp
          </span>
        </div>
      </div>
    </div>
  );
};
