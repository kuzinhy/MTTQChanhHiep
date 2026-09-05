import React, { useState } from 'react';
import { QrCode, Download, Copy, Check, X, Share2, ExternalLink } from 'lucide-react';

interface QrCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  itemUrl?: string;
  url?: string;
  category?: string;
}

export const QrCodeModal: React.FC<QrCodeModalProps> = ({
  isOpen,
  onClose,
  title,
  itemUrl,
  url,
  category = 'Nội dung MTTQ'
}) => {
  const [copied, setCopied] = useState(false);

  const targetUrl = itemUrl || url || window.location.href;

  if (!isOpen) return null;

  // High-resolution QR code generator (500x500 for crisp rendering on HiDPI/Retina screens)
  const encodedText = encodeURIComponent(targetUrl);
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodedText}&color=1d4ed8&bgcolor=ffffff&margin=10`;

  const handleCopy = () => {
    navigator.clipboard.writeText(itemUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden space-y-4 p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1 pr-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-extrabold text-[10px] uppercase border border-blue-200/80">
            <QrCode className="w-3.5 h-3.5 text-blue-600" />
            <span>Mã QR Thông Tin Điện Tử</span>
          </div>
          <h3 className="text-base font-black text-slate-900 line-clamp-2 leading-tight">
            {title}
          </h3>
          <p className="text-[11px] text-slate-500 font-medium">Quét mã bằng Zalo hoặc Camera điện thoại để mở ngay</p>
        </div>

        {/* QR Frame Container */}
        <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-b from-blue-50/50 to-indigo-50/30 rounded-2xl border border-slate-200/80 space-y-3">
          <div className="w-48 h-48 bg-white p-3 rounded-2xl shadow-md border border-slate-200 flex items-center justify-center relative group">
            <img
              src={qrApiUrl}
              alt="Mã QR"
              className="w-full h-full object-contain"
            />
            <div className="absolute inset-0 bg-white/90 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity p-3 text-center">
              <span className="text-xs font-bold text-blue-900">MTTQ Phường Chánh Hiệp</span>
            </div>
          </div>
          <span className="text-[10px] font-extrabold text-blue-800 bg-white px-2.5 py-0.5 rounded-md border border-blue-200">
            {category}
          </span>
        </div>

        {/* Action Controls */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={itemUrl}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-600 truncate focus:outline-none"
            />
            <button
              onClick={handleCopy}
              className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1 transition shadow-xs cursor-pointer shrink-0"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-amber-300" />
                  <span>Đã chép</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Sao chép</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <a
              href={qrApiUrl}
              download="Ma_QR_MTTQ_ChanhHiep.png"
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-blue-600" />
              <span>Tải ảnh QR</span>
            </a>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title, url: itemUrl }).catch(() => {});
                } else {
                  handleCopy();
                }
              }}
              className="py-2.5 px-3 bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 border border-blue-200 transition cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-blue-600" />
              <span>Chia sẻ</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
