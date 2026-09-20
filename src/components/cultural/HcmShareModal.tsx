import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Share2,
  Copy,
  Check,
  QrCode,
  Download,
  ExternalLink,
  X,
  Send,
  Mail,
  Globe,
  MessageSquare,
  CheckCircle2,
  Bookmark,
  Sparkles
} from 'lucide-react';
import { DongSonDrumIcon, HoaSenIcon } from './TraditionalMotifs';

export interface HcmShareItem {
  id?: string;
  title: string;
  summary?: string;
  category?: string;
  url?: string;
  quote?: string;
  source?: string;
  date?: string;
  unit?: string;
  author?: string;
}

interface HcmShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: HcmShareItem | null;
}

export const HcmShareModal: React.FC<HcmShareModalProps> = ({ isOpen, onClose, item }) => {
  const [activeTab, setActiveTab] = useState<'quick' | 'qr'>('quick');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedQuote, setCopiedQuote] = useState<boolean>(false);

  if (!isOpen || !item) return null;

  // Build canonical share URL
  const currentBase = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : '';
  const itemIdParam = item.id ? `?hcm_item=${encodeURIComponent(item.id)}#hcm-${encodeURIComponent(item.id)}` : '';
  const shareUrl = item.url || `${currentBase}${itemIdParam}`;

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(
    `${item.title} - Không Gian Văn Hóa Hồ Chí Minh Phường Chánh Hiệp`
  );
  const encodedSummary = encodeURIComponent(
    item.summary ? `${item.summary}\n\nNguồn: ${shareUrl}` : shareUrl
  );

  // QR Server generation (sharp 500x500 in cultural red/rose palette)
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodedUrl}&color=9f1239&bgcolor=ffffff&margin=12`;

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = shareUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleCopyQuoteAndSource = async () => {
    const textToCopy = [
      item.title,
      item.quote ? `“${item.quote}”` : '',
      item.summary || '',
      item.source ? `Xuất xứ: ${item.source}` : '',
      `Không Gian Văn Hóa Hồ Chí Minh – Phường Chánh Hiệp`,
      `Liên kết: ${shareUrl}`
    ]
      .filter(Boolean)
      .join('\n\n');

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = textToCopy;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopiedQuote(true);
      setTimeout(() => setCopiedQuote(false), 2500);
    } catch (err) {
      console.error('Failed to copy quote:', err);
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: item.summary || item.title,
          url: shareUrl
        });
      } catch (err) {
        // User cancelled or share failed, fallback silently
      }
    }
  };

  // Social Share URLs
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  const zaloShareUrl = `https://chat.zalo.me/?url=${encodedUrl}`;
  const telegramShareUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`;
  const emailShareUrl = `mailto:?subject=${encodedTitle}&body=${encodedSummary}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-white rounded-3xl border-2 border-rose-200 shadow-2xl max-w-lg w-full overflow-hidden relative flex flex-col max-h-[90vh]"
      >
        {/* Header - Tone Hồng Cánh Sen */}
        <div className="bg-gradient-to-r from-rose-800 via-pink-700 to-rose-900 text-white p-5 sm:p-6 relative overflow-hidden shrink-0">
          <div className="absolute top-0 right-0 p-4 opacity-15 pointer-events-none text-amber-200">
            <DongSonDrumIcon size={180} />
          </div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-rose-950/40 hover:bg-rose-950 text-rose-100 hover:text-white transition cursor-pointer z-10"
            title="Đóng cửa sổ"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="relative z-10 space-y-2 pr-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-200 text-xs font-bold">
              <Share2 className="w-3.5 h-3.5 text-amber-300" />
              <span>CHIA SẺ LAN TỎA KHÔNG GIAN VĂN HÓA</span>
            </div>
            <h3 className="text-base sm:text-lg font-serif font-extrabold text-white leading-snug line-clamp-2">
              {item.title}
            </h3>
            {item.category && (
              <p className="text-xs text-rose-100 font-medium">
                Phân loại: <strong className="text-amber-200">{item.category}</strong>
                {item.unit && ` • ${item.unit}`}
              </p>
            )}
          </div>
        </div>

        {/* Tab switcher: Chia sẻ liên kết / Quét mã QR */}
        <div className="flex border-b border-rose-100 bg-rose-50/50 p-2 gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('quick')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
              activeTab === 'quick'
                ? 'bg-rose-800 text-white shadow-xs'
                : 'bg-white text-rose-900 hover:bg-rose-100 border border-rose-200'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Liên kết &amp; Mạng xã hội</span>
          </button>

          <button
            onClick={() => setActiveTab('qr')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
              activeTab === 'qr'
                ? 'bg-rose-800 text-white shadow-xs'
                : 'bg-white text-rose-900 hover:bg-rose-100 border border-rose-200'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Mã QR Điện Tử</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 text-slate-800">
          {activeTab === 'quick' ? (
            <div className="space-y-5">
              {/* Box Copy Link */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-rose-950 uppercase tracking-wider block">
                  Đường dẫn liên kết bài viết (URL)
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 px-3.5 py-2.5 rounded-2xl bg-rose-50/70 border border-rose-200 text-xs font-mono text-rose-900 truncate select-all">
                    {shareUrl}
                  </div>
                  <button
                    onClick={handleCopyLink}
                    className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-1.5 transition cursor-pointer shadow-xs shrink-0 ${
                      copiedLink
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-500 hover:to-amber-400 text-rose-950'
                    }`}
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Đã chép</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Sao chép</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Native Web Share Button (if available on mobile/tablet) */}
              {typeof navigator !== 'undefined' && !!navigator.share && (
                <button
                  onClick={handleNativeShare}
                  className="w-full py-2.5 px-4 rounded-2xl bg-rose-100 hover:bg-rose-200 text-rose-950 font-bold text-xs flex items-center justify-center gap-2 border border-rose-300 transition cursor-pointer"
                >
                  <Share2 className="w-4 h-4 text-rose-700" />
                  <span>Mở Menu Chia sẻ của Thiết bị (Zalo, Tin nhắn, AirDrop, v.v.)</span>
                </button>
              )}

              {/* Nền tảng Mạng xã hội */}
              <div className="space-y-2.5">
                <span className="text-xs font-bold text-rose-950 uppercase tracking-wider block">
                  Chia sẻ trực tiếp lên các nền tảng
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {/* Zalo */}
                  <a
                    href={zaloShareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-2xl border-2 border-blue-200 bg-blue-50/60 hover:bg-blue-100/80 hover:border-blue-400 text-blue-900 flex flex-col items-center text-center gap-1.5 transition cursor-pointer group shadow-2xs"
                  >
                    <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs group-hover:scale-105 transition-transform">
                      Zalo
                    </div>
                    <span className="text-xs font-bold">Zalo Chat</span>
                  </a>

                  {/* Facebook */}
                  <a
                    href={facebookShareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-2xl border-2 border-indigo-200 bg-indigo-50/60 hover:bg-indigo-100/80 hover:border-indigo-400 text-indigo-900 flex flex-col items-center text-center gap-1.5 transition cursor-pointer group shadow-2xs"
                  >
                    <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-xs group-hover:scale-105 transition-transform">
                      f
                    </div>
                    <span className="text-xs font-bold">Facebook</span>
                  </a>

                  {/* Telegram */}
                  <a
                    href={telegramShareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-2xl border-2 border-sky-200 bg-sky-50/60 hover:bg-sky-100/80 hover:border-sky-400 text-sky-900 flex flex-col items-center text-center gap-1.5 transition cursor-pointer group shadow-2xs"
                  >
                    <div className="w-9 h-9 rounded-xl bg-sky-500 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                      <Send className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold">Telegram</span>
                  </a>

                  {/* Email */}
                  <a
                    href={emailShareUrl}
                    className="p-3 rounded-2xl border-2 border-rose-200 bg-rose-50/60 hover:bg-rose-100/80 hover:border-rose-400 text-rose-900 flex flex-col items-center text-center gap-1.5 transition cursor-pointer group shadow-2xs"
                  >
                    <div className="w-9 h-9 rounded-xl bg-rose-700 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                      <Mail className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold">Thư điện tử</span>
                  </a>
                </div>
              </div>

              {/* Sao chép toàn bộ trích dẫn & nguồn học thuật */}
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                    <Bookmark className="w-3.5 h-3.5 text-amber-700" />
                    <span>Sao chép trích dẫn &amp; nguồn tư liệu chính thống</span>
                  </span>
                  <button
                    onClick={handleCopyQuoteAndSource}
                    className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1 transition cursor-pointer ${
                      copiedQuote
                        ? 'bg-emerald-600 text-white'
                        : 'bg-amber-400 hover:bg-amber-300 text-rose-950 shadow-2xs'
                    }`}
                  >
                    {copiedQuote ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Đã sao chép</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Sao chép trích dẫn</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-[11px] text-amber-900/80 italic leading-relaxed">
                  Phù hợp dán vào tin nhắn sinh hoạt chi bộ, báo cáo chuyên đề học tập và làm theo Bác hoặc tài liệu tuyên truyền 21 Khu phố.
                </p>
              </div>
            </div>
          ) : (
            /* QR Code Tab */
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="p-4 bg-gradient-to-br from-rose-50 via-white to-amber-50 rounded-3xl border-2 border-rose-200 shadow-md">
                <div className="w-56 h-56 bg-white p-3 rounded-2xl shadow-inner border border-rose-100 flex items-center justify-center">
                  <img
                    src={qrApiUrl}
                    alt={`Mã QR ${item.title}`}
                    className="w-full h-full object-contain rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-1 max-w-sm">
                <h4 className="text-sm font-serif font-bold text-rose-950">
                  Quét Mã QR Bằng Camera Điện Thoại Hoặc Zalo
                </h4>
                <p className="text-xs text-rose-800/80 leading-relaxed">
                  Người dân và đoàn viên có thể quét để mở trực tiếp bài viết và tư liệu này trên điện thoại cá nhân mà không cần cài đặt ứng dụng.
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <a
                  href={qrApiUrl}
                  download={`QR-${item.id || 'hcm'}.png`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-rose-800 hover:bg-rose-900 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Tải ảnh QR về máy</span>
                </a>

                <button
                  onClick={handleCopyLink}
                  className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-rose-950 font-bold text-xs flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Sao chép Link</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-rose-50/60 border-t border-rose-200 flex items-center justify-between text-[11px] text-rose-800 shrink-0">
          <div className="flex items-center gap-1.5">
            <HoaSenIcon className="w-3.5 h-3.5 text-rose-600" />
            <span className="font-semibold">Ủy ban MTTQ Việt Nam Phường Chánh Hiệp</span>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-lg text-rose-900 hover:bg-rose-200 font-bold transition cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// Reusable compact trigger button component
export interface HcmShareButtonProps {
  item: HcmShareItem;
  variant?: 'button' | 'pill' | 'icon';
  size?: 'sm' | 'md';
  className?: string;
  label?: string;
}

export const HcmShareButton: React.FC<HcmShareButtonProps> = ({
  item,
  variant = 'button',
  size = 'sm',
  className = '',
  label = 'Chia sẻ'
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(true);
  };

  return (
    <>
      {variant === 'icon' ? (
        <button
          onClick={handleClick}
          className={`p-1.5 rounded-xl text-rose-700 hover:text-rose-950 hover:bg-rose-100 transition cursor-pointer ${className}`}
          title={`Chia sẻ: ${item.title}`}
          aria-label={`Chia sẻ ${item.title}`}
        >
          <Share2 className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
        </button>
      ) : variant === 'pill' ? (
        <button
          onClick={handleClick}
          className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-200 transition cursor-pointer ${className}`}
          title={`Chia sẻ: ${item.title}`}
        >
          <Share2 className="w-3 h-3 text-rose-700" />
          <span>{label}</span>
        </button>
      ) : (
        <button
          onClick={handleClick}
          className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-500 hover:to-amber-400 text-rose-950 shadow-2xs hover:shadow-xs transition cursor-pointer ${className}`}
          title={`Chia sẻ: ${item.title}`}
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>{label}</span>
        </button>
      )}

      <HcmShareModal isOpen={isOpen} onClose={() => setIsOpen(false)} item={item} />
    </>
  );
};
