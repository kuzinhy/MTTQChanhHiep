import React, { useState } from 'react';
import { 
  X, 
  QrCode, 
  Share2, 
  Copy, 
  Check, 
  Printer, 
  Building2, 
  Sparkles, 
  ExternalLink,
  MessageCircle
} from 'lucide-react';

interface ShareQrPosterModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  shareUrl?: string;
  category?: string;
}

export const ShareQrPosterModal: React.FC<ShareQrPosterModalProps> = ({
  isOpen,
  onClose,
  title,
  shareUrl = typeof window !== 'undefined' ? window.location.href : 'https://mttq-chanhhiep.gov.vn',
  category = 'Thông Tin Tuyên Truyền Mặt Trận'
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(shareUrl)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareZalo = () => {
    window.open(`https://zalo.me/share?url=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const handlePrintPoster = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-red-800 to-amber-700 p-4 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-amber-300" />
            <h3 className="font-extrabold text-sm sm:text-base">
              Trung Tâm Chia Sẻ Số & Poster Mã QR
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Poster Content */}
        <div className="p-6 sm:p-8 bg-gradient-to-b from-red-50/50 via-white to-amber-50/30 text-center space-y-6">
          
          {/* Official Agency Stamp Header */}
          <div className="space-y-1">
            <div className="w-12 h-12 bg-red-700 rounded-full flex items-center justify-center mx-auto text-amber-300 shadow-md">
              <Building2 className="w-6 h-6" />
            </div>
            <p className="text-red-800 font-extrabold text-xs tracking-wider uppercase mt-2">
              ỦY BAN MẶT TRẬN TỔ QUỐC VIỆT NAM PHƯỜNG CHÁNH HIỆP
            </p>
            <span className="inline-block px-2.5 py-0.5 bg-amber-100 text-amber-900 font-bold text-[10px] rounded-full uppercase border border-amber-200">
              {category}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 line-clamp-3 leading-snug px-2">
            {title}
          </h2>

          {/* QR Code Frame */}
          <div className="bg-white p-4 rounded-2xl border-2 border-red-600 shadow-lg inline-block mx-auto relative group">
            <img
              src={qrImageUrl}
              alt="Mã QR Tra cứu"
              className="w-48 h-48 sm:w-56 sm:h-56 mx-auto object-contain"
            />
            <p className="text-[11px] font-bold text-slate-500 mt-2">
              Quét mã QR bằng Camera điện thoại / Zalo để xem ngay
            </p>
          </div>

          <p className="text-xs text-slate-500 italic max-w-xs mx-auto">
            Hệ thống Chuyển đổi số Mặt trận - Kết nối Thông tin Dân sinh 21 Khu phố Phường Chánh Hiệp.
          </p>
        </div>

        {/* Action Buttons Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-3 print:hidden">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleShareZalo}
              className="py-2.5 bg-[#0068ff] hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chia sẻ qua Zalo</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Đã Sao Chép!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Sao Chép Link</span>
                </>
              )}
            </button>
          </div>

          <button
            onClick={handlePrintPoster}
            className="w-full py-2.5 bg-gradient-to-r from-red-700 to-amber-700 hover:from-red-800 hover:to-amber-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>In Poster QR Bảng Tin Khu Phố</span>
          </button>
        </div>
      </div>
    </div>
  );
};
export default ShareQrPosterModal;
