import React, { useState, useEffect, useRef } from 'react';
import { 
  HeartHandshake, 
  Copy, 
  Check, 
  Download, 
  Share2, 
  Printer, 
  ExternalLink, 
  ArrowLeft, 
  QrCode, 
  Sparkles, 
  ShieldCheck, 
  Users, 
  CheckCircle2, 
  MapPin, 
  Info,
  X,
  Smartphone,
  Award
} from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { VolunteerRegistrationModal } from '../VolunteerRegistrationModal';

const MTTQ_LOGO_URL = 'https://res.cloudinary.com/idt08wyp/image/upload/v1789907080/Logo-Mat-Tran-To-Quoc-Viet-Nam.png';

export const PublicVolunteerRegistrationPage: React.FC = () => {
  const [registrationUrl, setRegistrationUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [showPosterModal, setShowPosterModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const qrCanvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const origin = window.location.origin;
      const pathname = window.location.pathname;
      // Canonical link targeting the volunteer registration hash route
      const cleanUrl = `${origin}${pathname}#/dang-ky-tinh-nguyen`;
      setRegistrationUrl(cleanUrl);
    }
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleCopyLink = async () => {
    if (!registrationUrl) return;
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(registrationUrl);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = registrationUrl;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      triggerToast('Đã sao chép đường dẫn đăng ký vào bộ nhớ tạm!');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      triggerToast('Vui lòng chọn và sao chép đường dẫn bằng tay.');
    }
  };

  const handleDownloadQrPng = () => {
    try {
      const canvas = document.getElementById('public-volunteer-qr-canvas') as HTMLCanvasElement;
      if (!canvas) {
        triggerToast('Không tìm thấy khung mã QR để tải.');
        return;
      }
      const pngUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = 'QR_Dang_Ky_Tinh_Nguyen_Vien_MTTQ_Chanh_Hiep.png';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      triggerToast('Đã tải xuống ảnh mã QR chất lượng cao (PNG)!');
    } catch (err) {
      console.error('Error downloading QR code:', err);
      triggerToast('Lỗi khi tải ảnh mã QR.');
    }
  };

  const handleNativeShare = async () => {
    if (navigator?.share) {
      try {
        await navigator.share({
          title: 'Đăng ký Tình nguyện viên MTTQ Phường Chánh Hiệp',
          text: 'Kính mời quý bà con, thanh niên và đoàn viên đăng ký tham gia Đội hình Tình nguyện viên An sinh & Chuyển đổi số 21 Khu phố Phường Chánh Hiệp!',
          url: registrationUrl
        });
        triggerToast('Đã mở cửa sổ chia sẻ!');
      } catch {
        // User cancelled or share dismissed
      }
    } else {
      handleCopyLink();
    }
  };

  const handlePrintPoster = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100/80 text-slate-900 pb-16 pt-4 sm:pt-6 px-3 sm:px-6 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[100] bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 text-xs sm:text-sm font-bold flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Navigation Top Bar */}
        <div className="flex items-center justify-between gap-3 bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl border border-slate-200 shadow-xs">
          <a 
            href="#/trang-chu" 
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-blue-700 hover:text-blue-900 transition-colors group cursor-pointer"
          >
            <div className="w-7 h-7 rounded-xl bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center transition">
              <ArrowLeft className="w-4 h-4 text-blue-700 group-hover:-translate-x-0.5 transition" />
            </div>
            <span>Quay lại Trang chủ Cổng thông tin</span>
          </a>

          <div className="flex items-center gap-2">
            <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Tiếp nhận trực tuyến 24/7</span>
            </span>

            <button
              onClick={handleNativeShare}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition active:scale-95 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Chia sẻ link</span>
            </button>
          </div>
        </div>

        {/* Hero Branding Banner */}
        <div className="bg-gradient-to-r from-[#004bb5] via-[#0060df] to-[#007bfd] text-white rounded-3xl p-5 sm:p-8 shadow-xl relative overflow-hidden border border-blue-400/40">
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-40" />
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-cyan-300/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-left">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white p-1.5 shadow-lg border-2 border-amber-300 flex items-center justify-center shrink-0">
                <img 
                  src={MTTQ_LOGO_URL} 
                  alt="Logo Ủy ban Mặt trận Tổ quốc Việt Nam" 
                  className="w-full h-full object-contain"
                />
              </div>

              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 border border-white/30 text-[10px] sm:text-xs font-black uppercase tracking-wider text-amber-200 mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>KẾT NỐI SỨC MẠNH CỘNG ĐỒNG 21 KHU PHỐ</span>
                </div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight leading-tight uppercase text-white drop-shadow-xs">
                  CỔNG ĐĂNG KÝ TÌNH NGUYỆN VIÊN MẶT TRẬN
                </h1>
                <p className="text-xs sm:text-sm text-blue-100 font-semibold mt-1">
                  ỦY BAN MẶT TRẬN TỔ QUỐC VIỆT NAM PHƯỜNG CHÁNH HIỆP — TP. HỒ CHÍ MINH
                </p>
                <p className="text-[11px] sm:text-xs text-amber-200/90 italic mt-0.5 font-medium">
                  "Đoàn kết - Dân chủ - Nghĩa tình - Vì Chánh Hiệp văn minh, hiện đại, phát triển"
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 self-stretch md:self-auto justify-end">
              <button
                onClick={() => setShowPosterModal(true)}
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-md transition active:scale-95 cursor-pointer"
              >
                <Printer className="w-4 h-4 text-slate-950" />
                <span>Xem & In Poster A4</span>
              </button>
            </div>
          </div>
        </div>

        {/* 2-Column Responsive Layout: Form on Left, QR & Share Tools on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          
          {/* Column 1: Main Volunteer Registration Form (lg:col-span-7) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white rounded-3xl p-1 sm:p-2 border border-slate-200 shadow-md">
              <VolunteerRegistrationModal 
                isOpen={true} 
                isInline={true}
                onClose={() => {
                  window.location.hash = '#/trang-chu';
                }} 
                onSuccess={(title, msg) => {
                  triggerToast(`${title}: ${msg}`);
                }} 
              />
            </div>

            {/* Supplementary Information Card */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-3xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-blue-900 font-black text-sm">
                <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
                <span>Quyền lợi & Trách nhiệm của Tình nguyện viên MTTQ</span>
              </div>
              <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
                <li>Được cấp <strong>Thẻ Chứng nhận Tình nguyện viên số</strong> có mã QR định danh xác thực.</li>
                <li>Được tập huấn kỹ năng sơ cấp cứu, kỹ năng số cộng đồng, công tác an sinh xã hội.</li>
                <li>Được ưu tiên biểu dương, khen thưởng gương "Người tốt - Việc tốt", "Chiến sĩ thi đua cơ sở".</li>
                <li>Đóng góp trực tiếp vào công tác chăm lo người yếu thế, bảo vệ môi trường 21 Khu phố.</li>
              </ul>
            </div>
          </div>

          {/* Column 2: Interactive QR Code & Link Sharing Card (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-20">
            
            {/* Main QR Code & Link Box */}
            <div className="bg-white rounded-3xl p-6 border-2 border-blue-100 shadow-lg relative overflow-hidden space-y-5 text-center">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

              {/* Card Title */}
              <div className="space-y-1 relative z-10">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-[11px] font-black uppercase tracking-wider">
                  <QrCode className="w-3.5 h-3.5 text-blue-600" />
                  <span>MÃ QR ĐĂNG KÝ NHANH</span>
                </div>
                <h3 className="text-lg font-black text-slate-900">
                  Quét Mã Để Mở Form Hoặc In Poster
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Mã QR tự động liên kết trực tiếp tới trang này, quét bằng Zalo, Camera điện thoại hoặc ứng dụng quét mã.
                </p>
              </div>

              {/* High-Resolution QR Display with Border & Logo */}
              <div className="relative inline-block mx-auto p-4 bg-white rounded-2xl border-2 border-blue-200 shadow-md group">
                <div ref={qrCanvasRef} className="flex items-center justify-center">
                  <QRCodeCanvas
                    id="public-volunteer-qr-canvas"
                    value={registrationUrl || 'https://ais-dev-eokzuo3lbp4ijcdgdnvif3-553565080913.asia-southeast1.run.app/#/dang-ky-tinh-nguyen'}
                    size={220}
                    level="H"
                    includeMargin={true}
                    imageSettings={{
                      src: MTTQ_LOGO_URL,
                      x: undefined,
                      y: undefined,
                      height: 42,
                      width: 42,
                      excavate: true,
                    }}
                  />
                </div>

                <div className="mt-2 text-[10px] font-bold text-slate-500 flex items-center justify-center gap-1">
                  <Smartphone className="w-3.5 h-3.5 text-blue-600" />
                  <span>Chạm để quét từ điện thoại</span>
                </div>
              </div>

              {/* URL Display with Copy Button */}
              <div className="space-y-2 text-left relative z-10">
                <label className="block text-[11px] font-black text-slate-700">
                  Đường dẫn đăng ký công khai (Shareable Link):
                </label>
                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-2xl p-1.5 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition">
                  <input
                    type="text"
                    readOnly
                    value={registrationUrl}
                    className="w-full bg-transparent px-2.5 text-xs font-mono text-slate-700 outline-none select-all truncate font-semibold"
                  />
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                      copied 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'Đã chép' : 'Sao chép'}</span>
                  </button>
                </div>
              </div>

              {/* Action Buttons: Download QR PNG, Print Poster, Share */}
              <div className="grid grid-cols-2 gap-2.5 pt-1 relative z-10">
                <button
                  type="button"
                  onClick={handleDownloadQrPng}
                  className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                >
                  <Download className="w-4 h-4 text-blue-700 shrink-0" />
                  <span>Tải ảnh QR (PNG)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowPosterModal(true)}
                  className="px-3 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                >
                  <Printer className="w-4 h-4 text-indigo-700 shrink-0" />
                  <span>In Poster A4</span>
                </button>
              </div>

              {/* Quick Social Share Buttons */}
              <div className="pt-2 border-t border-slate-100 space-y-2 text-left relative z-10">
                <div className="text-[11px] font-bold text-slate-600">Chia sẻ trực tiếp lên mạng xã hội:</div>
                <div className="flex items-center gap-2">
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(registrationUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 px-3 bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] border border-[#1877F2]/30 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Facebook</span>
                  </a>

                  <a
                    href={`https://zalo.me/share?url=${encodeURIComponent(registrationUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 px-3 bg-[#0068ff]/10 hover:bg-[#0068ff]/20 text-[#0068ff] border border-[#0068ff]/30 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Zalo</span>
                  </a>

                  <button
                    type="button"
                    onClick={handleNativeShare}
                    className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl border border-slate-200 transition"
                    title="Mở bảng chia sẻ hệ thống"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Instructions for Neighborhood Units */}
              <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-3 text-left space-y-1">
                <div className="flex items-center gap-1.5 text-amber-900 font-black text-[11px]">
                  <Info className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span>Dành cho 21 Ban Công tác Mặt trận Khu phố:</span>
                </div>
                <p className="text-[11px] text-amber-800 leading-relaxed font-medium">
                  Cán bộ khu phố có thể bấm <strong>"Tải ảnh QR"</strong> hoặc <strong>"In Poster A4"</strong> để dán tại Bảng tin, Nhà sinh hoạt cộng đồng hoặc chia sẻ vào các nhóm Zalo Tổ dân phố để bà con quét đăng ký thuận tiện.
                </p>
              </div>

            </div>

            {/* Community Impact Stats Box */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-black text-xs uppercase tracking-wider">
                <Users className="w-4 h-4 text-blue-600" />
                <span>Đội ngũ Tình nguyện viên Phường Chánh Hiệp</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-3 bg-blue-50/80 border border-blue-200/60 rounded-2xl">
                  <div className="text-xl font-black text-blue-700">21/21</div>
                  <div className="text-[10px] text-blue-900 font-bold mt-0.5">Khu phố phủ sóng</div>
                </div>
                <div className="p-3 bg-emerald-50/80 border border-emerald-200/60 rounded-2xl">
                  <div className="text-xl font-black text-emerald-700">04</div>
                  <div className="text-[10px] text-emerald-900 font-bold mt-0.5">Đội hình chuyên trách</div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* Poster A4 Preview & Print Modal */}
      {/* ------------------------------------------------------------- */}
      {showPosterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-3 sm:p-4 overflow-y-auto">
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-300 p-6 sm:p-8 space-y-6 my-auto text-slate-900">
            {/* Modal Header Actions */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-blue-700" />
                <h3 className="font-black text-base text-slate-900">Mẫu Poster A4 Chuẩn Tuyên Truyền</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPosterModal(false)}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Poster Content Area (Designed for printing / photography) */}
            <div id="printable-poster-area" className="border-4 border-double border-red-600 rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-amber-50/40 via-white to-red-50/20 text-center space-y-5 shadow-inner">
              {/* National Header */}
              <div className="space-y-0.5">
                <div className="text-xs font-black uppercase text-red-700 tracking-wider">
                  ỦY BAN MẶT TRẬN TỔ QUỐC VIỆT NAM PHƯỜNG CHÁNH HIỆP
                </div>
                <div className="text-[11px] font-bold text-slate-600">
                  THÀNH PHỐ HỒ CHÍ MINH
                </div>
              </div>

              {/* Logo Emblem */}
              <div className="w-20 h-20 mx-auto rounded-full bg-white p-1 border-2 border-amber-400 shadow-md flex items-center justify-center">
                <img src={MTTQ_LOGO_URL} alt="Logo MTTQ" className="w-full h-full object-contain" />
              </div>

              {/* Poster Title */}
              <div className="space-y-1">
                <div className="inline-block px-3 py-1 bg-red-700 text-amber-300 text-[10px] font-black uppercase tracking-widest rounded-md">
                  KÊU GỌI THAM GIA
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-red-700 uppercase leading-snug">
                  LỰC LƯỢNG TÌNH NGUYỆN VIÊN AN SINH &amp; CHUYỂN ĐỔI SỐ
                </h2>
                <p className="text-xs text-slate-700 font-bold italic">
                  Chung tay chăm lo an sinh xã hội, bảo vệ môi trường &amp; hỗ trợ số 21 Khu phố
                </p>
              </div>

              {/* Large Centered QR Code */}
              <div className="p-4 bg-white border-2 border-dashed border-red-500 rounded-3xl inline-block shadow-md">
                <QRCodeCanvas
                  value={registrationUrl || 'https://ais-dev-eokzuo3lbp4ijcdgdnvif3-553565080913.asia-southeast1.run.app/#/dang-ky-tinh-nguyen'}
                  size={200}
                  level="H"
                  includeMargin={true}
                  imageSettings={{
                    src: MTTQ_LOGO_URL,
                    x: undefined,
                    y: undefined,
                    height: 38,
                    width: 38,
                    excavate: true,
                  }}
                />
                <div className="mt-2 text-xs font-black text-red-700 tracking-wide uppercase">
                  QUÉT MÃ ĐĂNG KÝ TRỰC TIẾP
                </div>
                <div className="text-[10px] font-mono text-slate-500 font-bold truncate max-w-[200px] mx-auto">
                  {registrationUrl}
                </div>
              </div>

              {/* Four Key Teams */}
              <div className="grid grid-cols-2 gap-2 text-left text-[11px] text-slate-800 font-bold">
                <div className="p-2 bg-blue-50/80 rounded-xl border border-blue-200">
                  ❤ Đội An sinh &amp; Cứu trợ khẩn cấp
                </div>
                <div className="p-2 bg-emerald-50/80 rounded-xl border border-emerald-200">
                  🌱 Đội Bảo vệ Môi trường &amp; Xanh hóa
                </div>
                <div className="p-2 bg-purple-50/80 rounded-xl border border-purple-200">
                  📲 Tổ Công nghệ số Cộng đồng 4.0
                </div>
                <div className="p-2 bg-rose-50/80 rounded-xl border border-rose-200">
                  ⚡ Đội Phản ứng nhanh MTTQ
                </div>
              </div>

              {/* Footer Notice */}
              <div className="text-[10px] text-slate-500 border-t border-slate-200 pt-2 font-medium">
                Địa chỉ: Trụ sở UB MTTQ Việt Nam Phường Chánh Hiệp — Hotline: 0274.3822.408
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handlePrintPoster}
                className="flex-1 py-3 bg-red-700 hover:bg-red-800 text-white font-black text-sm rounded-2xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>In Poster Ngay</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadQrPng}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm rounded-2xl border border-slate-300 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4 text-blue-600" />
                <span>Tải File Ảnh QR</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
