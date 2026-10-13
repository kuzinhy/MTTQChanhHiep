// Lucian UX/UI Prompt #032 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#032
import React, { useState, useRef, DragEvent, ChangeEvent, KeyboardEvent } from 'react';

export interface UploadFileItem {
  id: string;
  file: File;
  name: string;
  sizeFormatted: string;
  extension: string;
  color: string;
  progress: number; // 0 to 1
  status: 'uploading' | 'done' | 'fail';
  errorMessage?: string;
  resultData?: any;
}

export interface DragDropUpload032Props {
  accept?: string;
  multiple?: boolean;
  maxSizeBytes?: number;
  title?: string;
  actionWord?: string;
  subtitle?: string;
  onUploadFile?: (
    file: File, 
    updateProgress: (p: number) => void
  ) => Promise<{ success: boolean; data?: any; error?: string }>;
  onFilesSelected?: (files: File[]) => void;
  onFileSuccess?: (file: File, data?: any) => void;
  onFileFail?: (file: File, error?: string) => void;
  disabled?: boolean;
  className?: string;
  initialItems?: UploadFileItem[];
}

const getFileColor = (ext: string): string => {
  switch (ext) {
    case 'PDF':
      return '#E05252';
    case 'DOC':
    case 'DOCX':
      return '#2F8FE0';
    case 'XLS':
    case 'XLSX':
    case 'CSV':
      return '#119C72';
    case 'JPG':
    case 'JPEG':
    case 'PNG':
    case 'WEBP':
    case 'GIF':
      return '#6A57F2';
    case 'ZIP':
    case 'RAR':
      return '#D6731E';
    default:
      return '#7C67F6';
  }
};

const formatSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

export const DragDropUpload032: React.FC<DragDropUpload032Props> = ({
  accept = 'image/jpeg,image/png,image/webp,.pdf,.doc,.docx',
  multiple = false,
  maxSizeBytes = 10 * 1024 * 1024,
  title = 'Kéo thả tệp vào đây hoặc',
  actionWord = 'chọn tệp',
  subtitle = 'Hỗ trợ PNG, JPG, WEBP, PDF (Tối đa 10MB)',
  onUploadFile,
  onFilesSelected,
  onFileSuccess,
  onFileFail,
  disabled = false,
  className = '',
  initialItems = []
}) => {
  const [isOver, setIsOver] = useState(false);
  const [items, setItems] = useState<UploadFileItem[]>(initialItems);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    const ext = (file.name.split('.').pop() || 'FILE').toUpperCase().slice(0, 4);
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    
    // Check file size
    if (file.size > maxSizeBytes) {
      const failedItem: UploadFileItem = {
        id,
        file,
        name: file.name,
        sizeFormatted: formatSize(file.size),
        extension: ext,
        color: getFileColor(ext),
        progress: 1,
        status: 'fail',
        errorMessage: `Vượt quá giới hạn ${formatSize(maxSizeBytes)}`
      };
      setItems(prev => [failedItem, ...prev]);
      if (onFileFail) onFileFail(file, failedItem.errorMessage);
      return;
    }

    const newItem: UploadFileItem = {
      id,
      file,
      name: file.name,
      sizeFormatted: formatSize(file.size),
      extension: ext,
      color: getFileColor(ext),
      progress: 0.1,
      status: 'uploading'
    };

    setItems(prev => multiple ? [newItem, ...prev] : [newItem]);

    if (!onUploadFile) {
      // Simulate quick upload if no handler provided
      simulateLocalUpload(id, file);
      return;
    }

    try {
      const updateProgress = (p: number) => {
        setItems(prev => prev.map(it => it.id === id ? { ...it, progress: Math.min(Math.max(p, 0), 1) } : it));
      };

      // Start with initial progress
      updateProgress(0.2);

      const res = await onUploadFile(file, updateProgress);
      if (res.success) {
        setItems(prev => prev.map(it => it.id === id ? { ...it, progress: 1, status: 'done', resultData: res.data } : it));
        if (onFileSuccess) onFileSuccess(file, res.data);
      } else {
        setItems(prev => prev.map(it => it.id === id ? { ...it, progress: 1, status: 'fail', errorMessage: res.error || 'Tải lên thất bại' } : it));
        if (onFileFail) onFileFail(file, res.error);
      }
    } catch (err: any) {
      setItems(prev => prev.map(it => it.id === id ? { ...it, progress: 1, status: 'fail', errorMessage: err?.message || 'Có lỗi xảy ra khi tải tệp' } : it));
      if (onFileFail) onFileFail(file, err?.message);
    }
  };

  const simulateLocalUpload = (id: string, file: File) => {
    let p = 0.15;
    const interval = setInterval(() => {
      p += 0.25;
      if (p >= 1) {
        clearInterval(interval);
        setItems(prev => prev.map(it => it.id === id ? { ...it, progress: 1, status: 'done' } : it));
        if (onFileSuccess) onFileSuccess(file);
      } else {
        setItems(prev => prev.map(it => it.id === id ? { ...it, progress: p } : it));
      }
    }, 180);
  };

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0 || disabled) return;
    const files = Array.from(fileList);
    if (onFilesSelected) onFilesSelected(files);

    if (multiple) {
      files.forEach(f => processFile(f));
    } else {
      processFile(files[0]);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && !isOver) setIsOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOver(false);
    if (!disabled && e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
    // reset input so the same file can be selected again if needed
    e.target.value = '';
  };

  const handleRetry = (id: string) => {
    const target = items.find(it => it.id === id);
    if (!target) return;
    processFile(target.file);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fileInputRef.current?.click();
    }
  };

  return (
    <div className={`ux u032 ${isOver ? 'is-over' : ''} ${className}`}>
      <style>{`
        .u032{
          --ux-page:#F4F2EE;
          --ux-surface:#FFFFFF;
          --ux-surface-2:#F5F3EF;
          --ux-surface-3:#EAE7E1;
          --ux-ink:#16151B;
          --ux-ink-2:#57535F;
          --ux-ink-3:#8E8A97;
          --ux-line:rgba(22,21,27,.09);
          --ux-line-2:rgba(22,21,27,.17);
          --ux-accent:#6A57F2;
          --ux-accent-2:#2F8FE0;
          --ux-accent-soft:rgba(106,87,242,.12);
          --ux-accent-ink:#FFFFFF;
          --ux-mint:#119C72;
          --ux-warn:#D6731E;
          --ux-danger:#D93A55;
          --ux-glass:rgba(255,255,255,.58);
          --ux-glass-line:rgba(255,255,255,.85);
          --ux-shadow:rgba(40,30,80,.14);
          --ux-shadow-strong:rgba(40,30,80,.3);
          --ux-grad:linear-gradient(120deg,#7B61FF,#3D8BFF 55%,#1FB89A);
          --ux-ease:cubic-bezier(.2,.8,.2,1);
          --ux-spring:cubic-bezier(.34,1.45,.64,1);
          position:relative;
          width:100%;
          max-width:480px;
          min-height:200px;
          margin:0 auto;
        }

        @media (prefers-color-scheme:dark){
          .u032:not([data-theme="light"]){
            --ux-page:#07080D;
            --ux-surface:#13141C;
            --ux-surface-2:#1A1B25;
            --ux-surface-3:#252632;
            --ux-ink:#F4F0E8;
            --ux-ink-2:rgba(244,240,232,.68);
            --ux-ink-3:rgba(244,240,232,.42);
            --ux-line:rgba(255,255,255,.08);
            --ux-line-2:rgba(255,255,255,.16);
            --ux-accent:#B7A4FF;
            --ux-accent-2:#7DB4FF;
            --ux-accent-soft:rgba(183,164,255,.15);
            --ux-accent-ink:#0B0C12;
            --ux-mint:#7EE8C0;
            --ux-warn:#FFB26B;
            --ux-danger:#FF7D8C;
            --ux-glass:rgba(255,255,255,.07);
            --ux-glass-line:rgba(255,255,255,.18);
            --ux-shadow:rgba(0,0,0,.45);
            --ux-shadow-strong:rgba(0,0,0,.72);
            --ux-grad:linear-gradient(120deg,#B7A4FF,#7DB4FF 55%,#A5F2D3);
          }
        }

        :is([data-theme="dark"], .dark) .u032, .u032[data-theme="dark"]{
          --ux-page:#07080D;
          --ux-surface:#13141C;
          --ux-surface-2:#1A1B25;
          --ux-surface-3:#252632;
          --ux-ink:#F4F0E8;
          --ux-ink-2:rgba(244,240,232,.68);
          --ux-ink-3:rgba(244,240,232,.42);
          --ux-line:rgba(255,255,255,.08);
          --ux-line-2:rgba(255,255,255,.16);
          --ux-accent:#B7A4FF;
          --ux-accent-2:#7DB4FF;
          --ux-accent-soft:rgba(183,164,255,.15);
          --ux-accent-ink:#0B0C12;
          --ux-mint:#7EE8C0;
          --ux-warn:#FFB26B;
          --ux-danger:#FF7D8C;
          --ux-glass:rgba(255,255,255,.07);
          --ux-glass-line:rgba(255,255,255,.18);
          --ux-shadow:rgba(0,0,0,.45);
          --ux-shadow-strong:rgba(0,0,0,.72);
          --ux-grad:linear-gradient(120deg,#B7A4FF,#7DB4FF 55%,#A5F2D3);
        }

        .ux, .ux *, .ux *::before, .ux *::after{box-sizing:border-box}
        .ux{
          font-family: inherit;
          color:var(--ux-ink);
          -webkit-font-smoothing:antialiased;
          letter-spacing:-.01em;
          -webkit-tap-highlight-color:transparent;
          word-break:keep-all;
          overflow-wrap:break-word;
        }

        :where(.ux) :is(button,input,textarea,select){font:inherit;color:inherit}
        :where(.ux) button{cursor:pointer}
        .ux :focus-visible{outline:2px solid var(--ux-accent);outline-offset:3px}
        .ux [hidden]{display:none!important}

        @media (prefers-reduced-motion:reduce){
          .ux, .ux *, .ux *::before, .ux *::after{
            animation-duration:.001ms!important;
            animation-iteration-count:1!important;
            transition-duration:.001ms!important;
            scroll-behavior:auto!important;
          }
        }

        .u032-zone{
          position:relative;
          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:center;
          width:100%;
          min-height:196px;
          border:0;
          padding:24px 16px;
          border-radius:26px;
          background:var(--ux-surface);
          color:var(--ux-ink);
          cursor:pointer;
          transition:transform .5s var(--ux-spring),background-color .3s var(--ux-ease);
          box-shadow: 0 4px 20px -6px var(--ux-shadow);
        }
        .u032-zone:focus-visible{outline:2px solid var(--ux-accent);outline-offset:4px}
        .u032-zone svg.u032-dash{
          position:absolute;
          left:1px;
          top:1px;
          width:calc(100% - 2px);
          height:calc(100% - 2px);
          overflow:visible;
          pointer-events:none;
        }
        .u032-dash rect{
          fill:none;
          stroke:var(--ux-line-2);
          stroke-width:2;
          stroke-dasharray:8 7;
          transition:stroke .3s var(--ux-ease);
        }
        .u032-zone:hover .u032-dash rect, .u032.is-over .u032-dash rect{
          stroke:var(--ux-accent);
          animation:u032-march .9s linear infinite;
        }
        @keyframes u032-march{to{stroke-dashoffset:-30}}
        .u032.is-over .u032-zone{
          transform:scale(1.03);
          background:color-mix(in srgb,var(--ux-accent) 7%,var(--ux-surface));
        }
        .u032-orb{
          width:60px;
          height:60px;
          border-radius:20px;
          display:grid;
          place-items:center;
          color:#fff;
          background:linear-gradient(140deg,#5B8CFF,#8B6CFF);
          box-shadow:0 16px 28px -14px rgba(91,108,255,.8);
          transition:transform .5s var(--ux-spring);
        }
        .u032-orb svg{
          width:28px;
          height:28px;
          fill:none;
          stroke:currentColor;
          stroke-width:2;
          stroke-linecap:round;
          stroke-linejoin:round;
        }
        .u032-zone:hover .u032-orb{transform:translateY(-4px)}
        .u032.is-over .u032-orb{transform:translateY(-8px) scale(1.1) rotate(-6deg)}
        .u032-zone b{margin-top:14px;font-size:15.5px;font-weight:720;letter-spacing:-.02em}
        .u032-zone b em{font-style:normal;color:var(--ux-accent)}
        .u032-zone small{margin-top:4px;font-size:12.5px;color:var(--ux-ink-3)}
        .u032-file{position:absolute;width:1px;height:1px;opacity:0;pointer-events:none}
        .u032-list{margin:14px 0 0;padding:0;list-style:none;display:flex;flex-direction:column;gap:8px}
        .u032-row{
          position:relative;
          display:flex;
          align-items:center;
          gap:12px;
          height:62px;
          padding:0 12px;
          border-radius:18px;
          background:var(--ux-surface);
          box-shadow:0 0 0 1px var(--ux-line);
          overflow:hidden;
          animation:u032-in .5s var(--ux-spring);
        }
        @keyframes u032-in{from{transform:translateY(-10px) scale(.96);opacity:0}}
        .u032-row.out{transition:transform .35s var(--ux-ease),opacity .3s;transform:translateX(30px);opacity:0}
        .u032-ic{
          width:36px;
          height:40px;
          flex:none;
          border-radius:9px;
          display:grid;
          place-items:end center;
          padding-bottom:5px;
          font-size:8.5px;
          font-weight:800;
          letter-spacing:.04em;
          color:#fff;
          background:var(--c);
        }
        .u032-meta{flex:1;min-width:0}
        .u032-meta b{display:block;font-size:14px;font-weight:660;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .u032-meta small{display:block;margin-top:3px;font-size:12px;color:var(--ux-ink-3);font-variant-numeric:tabular-nums}
        .u032-bar{
          position:absolute;
          left:0;
          bottom:0;
          height:3px;
          width:100%;
          background:var(--ux-accent);
          transform-origin:0 50%;
          transform:scaleX(var(--p,0));
          transition:transform .2s linear,background-color .3s,opacity .5s .4s;
        }
        .u032-row.done .u032-bar{background:var(--ux-mint);opacity:0}
        .u032-row.fail .u032-bar{background:var(--ux-danger)}
        .u032-st{width:30px;height:30px;flex:none;border-radius:50%;display:grid;place-items:center}
        .u032-st svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:2.6;stroke-linecap:round;stroke-linejoin:round}
        .u032-row.done .u032-st{background:var(--ux-mint);color:var(--ux-accent-ink);animation:u032-pop .45s var(--ux-spring)}
        @keyframes u032-pop{from{transform:scale(.3)}}
        .u032-row.done .u032-st path{stroke-dasharray:16;stroke-dashoffset:16;animation:u032-draw .4s var(--ux-ease) .15s forwards}
        @keyframes u032-draw{to{stroke-dashoffset:0}}
        .u032-row.fail .u032-meta small{color:var(--ux-danger)}
        .u032-retry{
          height:32px;
          padding:0 12px;
          border:0;
          border-radius:10px;
          background:color-mix(in srgb,var(--ux-danger) 12%,transparent);
          color:var(--ux-danger);
          font-size:12.5px;
          font-weight:700;
          white-space:nowrap;
          transition: background-color .2s;
        }
        .u032-retry:hover{background:color-mix(in srgb,var(--ux-danger) 20%,transparent)}
        .u032-retry:focus-visible{outline:2px solid var(--ux-danger);outline-offset:2px}
        .u032-spin{
          width:20px;
          height:20px;
          border-radius:50%;
          border:2.5px solid var(--ux-surface-3);
          border-top-color:var(--ux-accent);
          animation:u032-rot .8s linear infinite;
        }
        @keyframes u032-rot{to{transform:rotate(360deg)}}
      `}</style>

      {/* Hidden Native File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={handleInputChange}
        className="u032-file"
        tabIndex={-1}
        aria-hidden="true"
      />

      {/* Main Drag-and-Drop Zone */}
      <button
        type="button"
        className="u032-zone"
        onClick={() => !disabled && fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        aria-label={`${title} ${actionWord}. ${subtitle}`}
      >
        <svg className="u032-dash" aria-hidden="true">
          <rect rx="26" ry="26" x="1" y="1" width="calc(100% - 2px)" height="calc(100% - 2px)" />
        </svg>

        <div className="u032-orb" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </div>

        <b>
          {title} <em>{actionWord}</em>
        </b>
        <small>{subtitle}</small>
      </button>

      {/* Uploading & Finished Items List */}
      {items.length > 0 && (
        <ul className="u032-list" aria-live="polite">
          {items.map(item => (
            <li
              key={item.id}
              className={`u032-row ${item.status}`}
              style={{
                '--p': item.progress
              } as React.CSSProperties}
            >
              <div 
                className="u032-ic" 
                style={{ '--c': item.color } as React.CSSProperties}
                aria-label={item.extension}
              >
                {item.extension}
              </div>

              <div className="u032-meta">
                <b title={item.name}>{item.name}</b>
                <small>
                  {item.status === 'uploading' && `${item.sizeFormatted} · Đang tải lên ${Math.round(item.progress * 100)}%`}
                  {item.status === 'done' && `${item.sizeFormatted} · Hoàn tất`}
                  {item.status === 'fail' && `${item.errorMessage || 'Tải lên thất bại'} · Thử lại`}
                </small>
              </div>

              {/* Progress bar line */}
              <div 
                className="u032-bar" 
                style={{ '--p': item.progress } as React.CSSProperties} 
              />

              {/* Status Indicator or Retry Button */}
              {item.status === 'uploading' && (
                <div className="u032-st">
                  <div className="u032-spin" title="Đang xử lý..." />
                </div>
              )}

              {item.status === 'done' && (
                <div className="u032-st" aria-label="Đã hoàn thành">
                  <svg viewBox="0 0 24 24">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}

              {item.status === 'fail' && (
                <button
                  type="button"
                  className="u032-retry"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRetry(item.id);
                  }}
                  aria-label={`Thử lại tải tệp ${item.name}`}
                >
                  Thử lại
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
