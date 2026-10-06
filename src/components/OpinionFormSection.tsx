import React, { useState } from 'react';
import { PublicOpinion, OpinionTopic } from '../types';
import { 
  MessageSquareHeart, Send, Search, CheckCircle, ShieldAlert, FileText, Lock, 
  UserX, AlertCircle, Copy, ArrowLeft, ArrowRight, CheckCircle2, Layers, Sparkles, 
  MapPin, X, Loader2, HelpCircle, Info, ExternalLink, AlertTriangle, Image as ImageIcon, Share2, CloudUpload
} from 'lucide-react';
import { OFFICIAL_NEIGHBORHOOD_NAMES } from '../data/neighborhoodsList';
import { getGoogleDriveDirectImageUrl, uploadCitizenEvidenceImage } from '../lib/googleDriveService';

interface OpinionFormSectionProps {
  opinions: PublicOpinion[];
  onSubmitOpinion: (opinion: PublicOpinion) => void;
}

export const OpinionFormSection: React.FC<OpinionFormSectionProps> = ({ opinions, onSubmitOpinion }) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [topic, setTopic] = useState<OpinionTopic>('Vấn đề dân sinh');
  const [content, setContent] = useState('');
  const [neighborhood, setNeighborhood] = useState(OFFICIAL_NEIGHBORHOOD_NAMES[0]);
  const [fullname, setFullname] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [submittedCode, setSubmittedCode] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [imageLink, setImageLink] = useState('');
  const [referenceLink, setReferenceLink] = useState('');

  // Drive Link Guide Modal State
  const [isDriveGuideOpen, setIsDriveGuideOpen] = useState(false);

  // Lookup Tool State
  const [lookupCode, setLookupCode] = useState('');
  const [foundOpinion, setFoundOpinion] = useState<PublicOpinion | null>(null);
  const [lookupAttempted, setLookupAttempted] = useState(false);
  const [ratedStar, setRatedStar] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccessNote, setUploadSuccessNote] = useState<string | null>(null);

  const MTTQ_DRIVE_FOLDER_URL = 'https://drive.google.com/drive/folders/1esbw7TuyePZEFmNe7oimUav-AIyeVv4B?hl=vi';

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Security & Regulation: File size limit (15MB)
    const MAX_SIZE = 15 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setUploadError('Tệp tin quá lớn. Vui lòng tải ảnh minh chứng dưới 15MB.');
      return;
    }

    // Security: Only images
    if (!file.type.startsWith('image/')) {
      setUploadError('Chỉ hỗ trợ tải lên tệp hình ảnh (jpg, png, webp, jpeg).');
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccessNote(null);

    try {
      // Automatic upload to Google Drive & auto-paste returned Drive link!
      const res = await uploadCitizenEvidenceImage(file, '1esbw7TuyePZEFmNe7oimUav-AIyeVv4B');
      
      if (res.driveLink || res.directUrl) {
        const finalLink = res.driveLink || res.directUrl;
        setImageLink(finalLink);
        if (res.isGoogleDrive) {
          setUploadSuccessNote(`✓ Đã tải ảnh lên Google Drive thành công & tự động dán liên kết tệp!`);
        } else {
          setUploadSuccessNote(`✓ Đã tải ảnh từ thiết bị lên hệ thống thành công!`);
        }
      } else {
        setUploadError('Không thể tạo liên kết sau khi tải ảnh. Vui lòng thử lại.');
      }
    } catch (err: any) {
      console.error('[OpinionForm] Upload error:', err);
      setUploadError('Lỗi khi tải ảnh lên Google Drive: ' + (err?.message || 'Vui lòng dán link trực tiếp.'));
    } finally {
      setIsUploading(false);
    }
  };

  const topics: OpinionTopic[] = [
    'Vấn đề dân sinh',
    'An sinh xã hội',
    'Môi trường & Đô thị',
    'Trật tự an toàn',
    'Thủ tục hành chính',
    'Văn hóa - Xã hội',
    'Ý kiến đóng góp khác'
  ];

  const neighborhoods = OFFICIAL_NEIGHBORHOOD_NAMES;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!content.trim()) {
      setFormError('Vui lòng nhập nội dung phản ánh hoặc đề xuất cụ thể của bạn!');
      return;
    }

    if (!fullname.trim()) {
      setFormError('Vui lòng nhập Họ và tên người phản ánh!');
      return;
    }

    if (!phone.trim()) {
      setFormError('Vui lòng nhập Số điện thoại liên hệ!');
      return;
    }

    const phoneRegex = /^[0-9]{9,11}$/;
    if (!phoneRegex.test(phone.replace(/\s+/g, ''))) {
      setFormError('Số điện thoại không hợp lệ. Vui lòng nhập từ 9-11 số!');
      return;
    }

    if (!address.trim()) {
      setFormError('Vui lòng nhập Địa chỉ cư trú / nơi ở của người phản ánh!');
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);

    const now = new Date();
    const dateStr = now.getFullYear().toString() +
      String(now.getMonth() + 1).padStart(2, '0') +
      String(now.getDate()).padStart(2, '0');
    const randomSeq = String(Math.floor(1000 + Math.random() * 9000));
    const code = `PA-${dateStr}-${randomSeq}`;

    const newOpinion: PublicOpinion = {
      id: 'op-' + Date.now(),
      receiptCode: code,
      topic,
      content: content.trim(),
      neighborhood,
      fullname: fullname.trim(),
      phone: phone.trim(),
      address: address.trim(),
      email: email.trim(),
      isAnonymous: false,
      status: 'NEW',
      priority: 'NORMAL',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      imageLink: imageLink.trim() || undefined,
      referenceLink: referenceLink.trim() || undefined
    };

    onSubmitOpinion(newOpinion);
    setSubmittedCode(code);
    setCurrentStep(1);
    setContent('');
    setFullname('');
    setPhone('');
    setAddress('');
    setEmail('');
    setImageLink('');
    setReferenceLink('');
    setIsSubmitting(false);
  };

  const handleNextStep = () => {
    setFormError(null);
    if (currentStep === 1) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!content.trim()) {
        setFormError('Vui lòng nhập nội dung phản ánh hoặc đề xuất cụ thể trước khi tiếp tục!');
        return;
      }
      setCurrentStep(3);
    }
  };

  const handlePrevStep = () => {
    setFormError(null);
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    setLookupAttempted(true);
    const match = opinions.find(o => o.receiptCode.toUpperCase() === lookupCode.trim().toUpperCase());
    setFoundOpinion(match || null);
  };

  return (
    <section className="space-y-8">
      {/* Header Banner */}
      <div className="bg-white/90 backdrop-blur-md text-slate-900 p-6 sm:p-8 rounded-2xl shadow-2xs border border-blue-200/80 space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-2xs font-black">
            <MessageSquareHeart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-wide">
              NẮM BẮT DƯ LUẬN XÃ HỘI, AN SINH &amp; Ý KIẾN NHÂN DÂN
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Kênh tiếp nhận phản ánh dân sinh, cứu trợ an sinh &amp; đề xuất xây dựng địa phương trực tiếp tới Ban Thường trực MTTQ Phường Chánh Hiệp
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Form submission (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-6">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="text-base font-extrabold text-slate-900">Gửi Ý Kiến, Cứu Trợ An Sinh &amp; Phản Ánh Dân Sinh</h3>
            <p className="text-xs text-slate-500">Mọi thông tin phản ánh được Ban Thường trực MTTQ phường bảo mật và chuyển đúng bộ phận xử lý.</p>
          </div>

          {submittedCode ? (
            <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-3">
              <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
              <h4 className="text-base font-bold text-emerald-900">Tiếp nhận ý kiến thành công!</h4>
              <p className="text-xs text-slate-700">
                Mã tiếp nhận phản ánh của bạn là:
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-extrabold text-base rounded-xl tracking-wider shadow-xs">
                <span>{submittedCode}</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(submittedCode || '');
                    // Add a small toast or visual feedback here if needed
                  }}
                  className="p-1 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[11px] text-slate-500 max-w-md mx-auto">
                Vui lòng lưu lại mã phản ánh này để tra cứu tiến độ xử lý của Mặt trận và Ủy ban nhân dân phường.
              </p>
              <button
                onClick={() => setSubmittedCode(null)}
                className="mt-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Gửi thêm phản ánh khác
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* MULTI-STEP PROGRESS INDICATOR */}
              <div className="bg-gradient-to-r from-blue-50 via-indigo-50/60 to-slate-50 p-4 rounded-2xl border border-blue-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center shadow-2xs">
                      {currentStep}
                    </span>
                    <div>
                      <h4 className="font-extrabold text-xs text-blue-950 uppercase tracking-tight">
                        Tiến trình điền phản ánh: Bước {currentStep}/3
                      </h4>
                      <p className="text-[11px] text-slate-500 font-medium">
                        {currentStep === 3 && 'Bước cuối cùng - Kiểm tra & Gửi phản ánh chính thức!'}
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-blue-600 text-white text-[11px] font-black shadow-2xs">
                    {Math.round((currentStep / 3) * 100)}% HOÀN THÀNH
                  </span>
                </div>

                {/* Animated Progress Bar */}
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 transition-all duration-300 shadow-2xs"
                    style={{ width: `${(currentStep / 3) * 100}%` }}
                  />
                </div>

                {/* Interactive Step Navigation Pills */}
                <div className="grid grid-cols-3 gap-1.5 pt-1 text-[11px] font-bold">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className={`p-2 rounded-xl border text-center transition cursor-pointer ${
                      currentStep === 1 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-2xs font-extrabold' 
                        : currentStep > 1 
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-800' 
                          : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    <span className="block truncate">1. Lĩnh vực &amp; Địa bàn</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (currentStep > 1) setCurrentStep(2);
                    }}
                    disabled={currentStep < 2 && !content.trim()}
                    className={`p-2 rounded-xl border text-center transition cursor-pointer ${
                      currentStep === 2 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-2xs font-extrabold' 
                        : currentStep > 2 
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-800' 
                          : 'bg-white border-slate-200 text-slate-500 disabled:opacity-50'
                    }`}
                  >
                    <span className="block truncate">2. Nội dung phản ánh</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (content.trim()) setCurrentStep(3);
                    }}
                    disabled={!content.trim()}
                    className={`p-2 rounded-xl border text-center transition cursor-pointer ${
                      currentStep === 3 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-2xs font-extrabold' 
                        : 'bg-white border-slate-200 text-slate-500 disabled:opacity-50'
                    }`}
                  >
                    <span className="block truncate">3. Người gửi &amp; Gửi</span>
                  </button>
                </div>
              </div>

              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700 text-xs font-semibold animate-in fade-in duration-200">
                  <AlertCircle className="w-4 h-4 shrink-0 animate-pulse text-red-600" />
                  <span>{formError}</span>
                </div>
              )}

              {/* STEP 1: LĨNH VỰC & KHU PHỐ */}
              {currentStep === 1 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 text-xs text-blue-900 font-medium">
                    📍 <strong>Bước 1:</strong> Chọn Lĩnh vực thuộc thẩm quyền giải quyết và Khu phố phát sinh sự việc tại Phường Chánh Hiệp.
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Lĩnh vực phản ánh (*)
                      </label>
                      <select
                        value={topic}
                        onChange={(e) => setTopic(e.target.value as OpinionTopic)}
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:bg-white outline-hidden font-medium"
                      >
                        {topics.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Khu phố phát sinh sự việc (*)
                      </label>
                      <select
                        value={neighborhood}
                        onChange={(e) => setNeighborhood(e.target.value)}
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:bg-white outline-hidden font-medium"
                      >
                        {neighborhoods.map((kp) => (
                          <option key={kp} value={kp}>{kp}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <span>Tiếp tục: Nhập nội dung</span>
                      <ArrowRight className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: NỘI DUNG PHẢN ÁNH & NÓI Ý KIẾN */}
              {currentStep === 2 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 text-xs text-blue-900 font-medium">
                    ✍️ <strong>Bước 2:</strong> Nhập mô tả chi tiết nội dung sự việc, thời gian, địa điểm và có thể đính kèm hình ảnh hoặc liên kết minh chứng.
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Nội dung phản ánh / Đề xuất cụ thể (*)
                    </label>
                    <textarea
                      rows={5}
                      placeholder="Mô tả chi tiết địa điểm, thời gian, sự việc phản ánh..."
                      value={content}
                      onChange={(e) => {
                        setContent(e.target.value);
                        if (formError) setFormError(null);
                      }}
                      className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-hidden leading-relaxed font-medium mb-4"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Image Upload / Link Section */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-tight flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-rose-500" />
                            <span>Ảnh minh chứng</span>
                          </label>

                          {/* Drive Link Guide Trigger Button */}
                          <button
                            type="button"
                            onClick={() => setIsDriveGuideOpen(true)}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 text-[10.5px] font-extrabold border border-amber-300 transition-colors shadow-2xs cursor-pointer group"
                            title="Bấm để xem cách lấy link tệp ảnh từ Google Drive"
                          >
                            <HelpCircle className="w-3.5 h-3.5 text-amber-600 group-hover:scale-110 transition-transform" />
                            <span>Cách lấy link ảnh Drive</span>
                          </button>
                        </div>
                        
                        <div className="space-y-2.5">
                          {/* Dedicated Upload Button to Drive */}
                          <div className="relative group">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleFileUpload}
                              disabled={isUploading}
                              className="absolute inset-0 opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
                            />
                            <div className={`w-full py-3.5 px-3 border-2 border-dashed rounded-xl flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
                              isUploading 
                                ? 'bg-blue-50 border-blue-400 text-blue-700' 
                                : imageLink && imageLink.includes('drive.google.com')
                                  ? 'bg-emerald-50 border-emerald-400 text-emerald-800'
                                  : 'bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 border-blue-300 hover:border-blue-500 hover:shadow-sm text-blue-900'
                            }`}>
                              {isUploading ? (
                                <>
                                  <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                                  <span className="text-[11px] font-bold text-blue-700">Đang đẩy ảnh lên Google Drive & lấy link...</span>
                                </>
                              ) : imageLink && imageLink.includes('drive.google.com') ? (
                                <>
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                  <span className="text-[11px] font-extrabold text-emerald-800">
                                    ✓ Đã tự động dán Link Google Drive (Bấm để đổi ảnh)
                                  </span>
                                </>
                              ) : imageLink ? (
                                <>
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                  <span className="text-[11px] font-bold text-emerald-800">Đã chọn ảnh (Bấm để chọn lại)</span>
                                </>
                              ) : (
                                <>
                                  <CloudUpload className="w-4 h-4 text-blue-600 shrink-0 group-hover:scale-110 transition-transform" />
                                  <div className="text-left">
                                    <span className="text-[11px] font-black text-blue-900 block">☁️ Upload ảnh lên Google Drive (Tự dán link)</span>
                                    <span className="text-[9.5px] text-blue-600 font-medium block">Chọn ảnh từ thiết bị - Hệ thống tự tạo &amp; dán link Drive</span>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>

                          {uploadSuccessNote && (
                            <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-1.5 text-emerald-800 text-[10.5px] font-bold animate-in fade-in duration-150">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>{uploadSuccessNote}</span>
                            </div>
                          )}

                          {uploadError && (
                            <div className="p-2 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-1.5 text-rose-700 text-[10.5px] font-bold">
                              <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                              <span>{uploadError}</span>
                            </div>
                          )}

                          <div className="flex items-center gap-2 pt-0.5">
                            <div className="h-px bg-slate-200 flex-1" />
                            <span className="text-[9px] font-black text-slate-400 uppercase">Hoặc nhập / dán trực tiếp Link Google Drive</span>
                            <div className="h-px bg-slate-200 flex-1" />
                          </div>

                          {/* Quick Link to MTTQ Drive Folder */}
                          <div className="flex items-center justify-between text-[10.5px] bg-slate-50 p-2 rounded-xl border border-slate-200">
                            <span className="text-slate-600 font-medium">Kho Drive tiếp nhận ảnh MTTQ:</span>
                            <a
                              href={MTTQ_DRIVE_FOLDER_URL}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-bold underline"
                            >
                              <span>Mở thư mục Drive</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>

                          <div className="space-y-1.5">
                            <input
                              type="text"
                              placeholder="Dán link tệp ảnh (https://drive.google.com/file/d/...)"
                              value={imageLink}
                              onChange={(e) => setImageLink(e.target.value)}
                              className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-hidden font-medium"
                            />

                            {/* Real-time Link Validation Alert: Folder Link Detection */}
                            {imageLink && imageLink.includes('/drive/folders/') && (
                              <div className="p-2.5 bg-amber-50 border border-amber-300 rounded-xl text-amber-900 text-[10.5px] space-y-1 animate-in fade-in duration-200 shadow-2xs">
                                <div className="flex items-center gap-1.5 font-black text-amber-800">
                                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                                  <span>Phát hiện Link Thư mục Drive (Chưa phải link ảnh trực tiếp)</span>
                                </div>
                                <p className="leading-relaxed">
                                  Link bạn dán là đường dẫn <strong>Thư mục</strong>, Cán bộ sẽ không thể xem được ảnh của bạn. Vui lòng mở ảnh trong Drive &gt; bấm <strong>Chia sẻ</strong> &gt; sao chép <strong>Link tệp ảnh</strong>!
                                </p>
                                <button
                                  type="button"
                                  onClick={() => setIsDriveGuideOpen(true)}
                                  className="font-bold text-blue-700 underline hover:text-blue-900 flex items-center gap-1 cursor-pointer pt-0.5"
                                >
                                  <span>Xem ví dụ link đúng &amp; cách lấy link tệp</span>
                                  <ArrowRight className="w-3 h-3" />
                                </button>
                              </div>
                            )}

                            {/* Real-time Link Validation Alert: Correct File Link Detection */}
                            {imageLink && (imageLink.includes('/file/d/') || imageLink.includes('drive.google.com/open?id=') || imageLink.includes('drive.google.com/uc?')) && (
                              <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-[10.5px] font-bold flex items-center gap-1.5 animate-in fade-in duration-200">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span>Đã nhận diện đúng liên kết tệp ảnh Google Drive (Sẵn sàng gửi) ✓</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Image Preview Card */}
                        {imageLink && (
                          <div className="flex items-center gap-3 p-2 bg-slate-50 border border-slate-200 rounded-xl">
                            <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-slate-300 bg-white shrink-0">
                              {imageLink.includes('drive.google.com') && !imageLink.includes('/folders/') ? (
                                <img 
                                  src={getGoogleDriveDirectImageUrl(imageLink)} 
                                  alt="Preview" 
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLElement).style.display = 'none';
                                  }}
                                />
                              ) : imageLink.startsWith('data:') || imageLink.startsWith('http') ? (
                                <img src={imageLink} alt="Preview" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                                  <ImageIcon className="w-5 h-5" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="text-[11px] font-extrabold text-slate-800 block truncate">
                                {imageLink.startsWith('data:') ? 'Ảnh đính kèm từ thiết bị' : 'Ảnh từ liên kết ngoài'}
                              </span>
                              <span className="text-[10px] text-slate-500 block truncate">
                                {imageLink.startsWith('data:') ? 'Đã tải thành công' : imageLink}
                              </span>
                            </div>
                            <button 
                              type="button"
                              onClick={() => setImageLink('')}
                              className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg border border-rose-200 transition-colors shrink-0 cursor-pointer"
                              title="Gỡ ảnh này"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Reference Link Section */}
                      <div className="space-y-3">
                        <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-tight flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-blue-600" />
                          <span>Link bài viết / Video liên quan</span>
                        </label>
                        <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl space-y-2">
                          <input
                            type="text"
                            placeholder="Dán link Facebook, Zalo, YouTube... (nếu có)"
                            value={referenceLink}
                            onChange={(e) => setReferenceLink(e.target.value)}
                            className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-hidden font-medium shadow-2xs"
                          />
                          <p className="text-[10px] text-slate-500 italic leading-relaxed">
                            Liên kết tới các bài đăng phản ánh trên mạng xã hội giúp Mặt trận dễ dàng nắm bắt bối cảnh sự việc nhanh hơn.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4 text-slate-600" />
                      <span>Quay lại Bước 1</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <span>Tiếp tục: Thông tin người gửi</span>
                      <ArrowRight className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: THÔNG TIN NGƯỜI GỬI & XÁC NHẬN GỬI */}
              {currentStep === 3 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-200/80 flex items-start gap-2.5">
                    <Lock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-blue-900 leading-relaxed font-medium">
                      <strong>Yêu cầu thông tin chính xác:</strong> Bắt buộc cung cấp Họ tên, Số điện thoại và Địa chỉ để Mặt trận Tổ quốc xác minh, liên hệ và trả lời kết quả chính thức. Thông tin cá nhân của bạn được bảo mật tuyệt đối.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Họ và tên người phản ánh <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Nguyễn Văn A"
                        value={fullname}
                        onChange={(e) => {
                          setFullname(e.target.value);
                          if (formError) setFormError(null);
                        }}
                        className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-hidden font-medium"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Số điện thoại liên hệ <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="0908xxxxxx"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          if (formError) setFormError(null);
                        }}
                        className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-hidden font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Địa chỉ cư trú / Nơi phát sinh sự việc <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Số nhà, đường, khu phố... (ví dụ: 123 Lê Chí Dân, KP 1)"
                        value={address}
                        onChange={(e) => {
                          setAddress(e.target.value);
                          if (formError) setFormError(null);
                        }}
                        className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-hidden font-medium"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Email (nếu có)
                      </label>
                      <input
                        type="email"
                        placeholder="email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-hidden font-medium"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4 text-slate-600" />
                      <span>Quay lại Bước 2</span>
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer disabled:opacity-50"
                    >
                      <Send className="w-4 h-4 text-white" />
                      <span>GỬI PHẢN ÁNH CHÍNH THỨC</span>
                    </button>
                  </div>
                </div>
              )}

            </form>
          )}
        </div>

        {/* Right Column: Receipt Lookup Tool */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-4">
            <div className="border-b border-slate-200 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Search className="w-4 h-4 text-blue-600" />
                <span>Tra Cứu Tiến Độ Phản Ánh</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Nhập mã phản ánh (Ví dụ: PA-2026-0801) để xem kết quả giải quyết.</p>
            </div>

            <form onSubmit={handleLookup} className="flex gap-2">
              <input
                type="text"
                placeholder="Mã PA-2026-xxxx"
                value={lookupCode}
                onChange={(e) => setLookupCode(e.target.value)}
                className="flex-1 text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-hidden uppercase font-semibold"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shrink-0 transition-all shadow-xs cursor-pointer"
              >
                Tra cứu
              </button>
            </form>


            {lookupAttempted && (
              <div className="pt-2">
                {foundOpinion ? (
                  <div className="p-4 bg-blue-50/80 rounded-xl border border-blue-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-blue-800">{foundOpinion.receiptCode}</span>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        foundOpinion.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {foundOpinion.status === 'RESOLVED' ? 'Đã giải quyết' : 'Đang xử lý'}
                      </span>
                    </div>

                    <p className="text-slate-800 font-medium">{foundOpinion.topic} - {foundOpinion.neighborhood}</p>
                    <p className="text-slate-600 line-clamp-2">{foundOpinion.content}</p>

                    {foundOpinion.adminResponse && (
                      <div className="pt-2 border-t border-blue-200 text-slate-900 font-medium">
                        <span className="text-blue-800 font-bold block mb-1">Kết quả phản hồi của MTTQ:</span>
                        <p className="bg-white p-2 rounded-lg border border-blue-200 text-slate-800">
                          {foundOpinion.adminResponse}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4 bg-red-50 text-red-800 text-xs rounded-xl border border-red-200 text-center font-medium">
                    Không tìm thấy phản ánh với mã nhập vào.
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2 border border-slate-800">
            <h4 className="font-bold text-blue-400 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-blue-400" />
              <span>Bảo mật &amp; An toàn thông tin</span>
            </h4>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Ý kiến phản ánh của công dân được bảo mật tuyệt đối. Dữ liệu tổng hợp chỉ sử dụng cho mục đích cải thiện đời sống nhân dân và nâng cao chất lượng hoạt động của MTTQ Phường Chánh Hiệp.
            </p>
          </div>

          {/* Citizen Satisfaction Survey Widget */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-600 text-white rounded-xl shadow-xs">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900 uppercase">Đánh Giá Mức Độ Hài Lòng</h4>
                <p className="text-[10px] text-slate-500">Khảo sát chất lượng phục vụ của cán bộ MTTQ</p>
              </div>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-blue-100 text-center space-y-2.5">
              <span className="text-[11px] font-extrabold text-blue-900 block">Ông/Bà hài lòng ở mức độ nào?</span>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRatedStar(star)}
                    className={`p-1.5 px-2.5 rounded-lg text-xs font-black border transition cursor-pointer flex items-center gap-1 ${
                      ratedStar === star
                        ? 'bg-amber-500 text-white border-amber-600 shadow-xs scale-105'
                        : 'bg-amber-50 hover:bg-amber-100 text-amber-600 border-amber-200'
                    }`}
                  >
                    <span>⭐</span>
                    <span>{star}</span>
                  </button>
                ))}
              </div>

              {ratedStar && (
                <div className="pt-2 border-t border-slate-100 text-[11px] text-emerald-700 font-bold bg-emerald-50/80 p-2 rounded-lg">
                  Cảm ơn Ông/Bà đã đánh giá {ratedStar}/5 sao chất lượng phục vụ!
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Google Drive Direct Image Link Guide Modal Popup */}
      {isDriveGuideOpen && (
        <div className="fixed inset-0 z-[9999] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-2xl text-white">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black tracking-tight">
                    Hướng Dẫn Lấy Link Ảnh Google Drive
                  </h3>
                  <p className="text-xs text-blue-100 font-medium">
                    Cách lấy link tệp ảnh trực tiếp để Cán bộ Mặt trận xem được ngay
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsDriveGuideOpen(false)}
                className="p-1.5 hover:bg-white/20 rounded-xl transition-colors text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-slate-700 text-xs">
              {/* Important Note Banner */}
              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-[11.5px] text-amber-950 leading-relaxed font-medium">
                  <strong>Lưu ý quan trọng:</strong> Hệ thống cần <strong>Đường dẫn tệp ảnh trực tiếp</strong> (File Link) thay vì đường dẫn cả thư mục (Folder Link) để có thể hiển thị ảnh cho cán bộ xác minh nhanh chóng.
                </p>
              </div>

              {/* 3 Steps */}
              <div className="space-y-3">
                <h4 className="font-black text-slate-900 uppercase text-[11px] tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>3 Bước lấy link ảnh đúng chuẩn:</span>
                </h4>

                <div className="space-y-2.5">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0">1</span>
                    <div className="space-y-1">
                      <p className="font-bold text-slate-900">Tải ảnh lên Google Drive của bạn hoặc Kho tiếp nhận MTTQ</p>
                      <p className="text-[11px] text-slate-500">Nếu chưa có thư mục riêng, bạn có thể tải thẳng vào Kho tiếp nhận của phường.</p>
                      <a
                        href={MTTQ_DRIVE_FOLDER_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-800 font-extrabold underline pt-1"
                      >
                        <span>Mở Thư mục Drive tiếp nhận của MTTQ Phường ↗</span>
                      </a>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0">2</span>
                    <div className="space-y-1">
                      <p className="font-bold text-slate-900">Lấy liên kết chia sẻ của ĐÚNG TỆP ẢNH</p>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        • Nhấp chuột phải (hoặc nhấn giữ trên điện thoại) vào <strong>tấm ảnh đã tải lên</strong>.<br />
                        • Chọn <strong>Chia sẻ (Share)</strong> &gt; Đặt quyền: <strong>"Bất kỳ ai có đường liên kết" (Anyone with the link)</strong>.<br />
                        • Nhấn nút <strong>Sao chép đường liên kết (Copy link)</strong>.
                      </p>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0">3</span>
                    <div>
                      <p className="font-bold text-slate-900">Dán vào ô Link ảnh trên biểu mẫu</p>
                      <p className="text-[11px] text-slate-500">Hệ thống sẽ tự động nhận diện và hiển thị ảnh xem trước.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comparison Visual Table */}
              <div className="space-y-2.5">
                <h4 className="font-black text-slate-900 uppercase text-[11px] tracking-wider">
                  Bảng so sánh ví dụ cụ thể:
                </h4>

                <div className="space-y-2">
                  {/* WRONG LINK */}
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-1">
                    <div className="flex items-center gap-1.5 font-extrabold text-rose-800 text-[11.5px]">
                      <span>❌ LINK SAI (Link thư mục - Cán bộ KHÔNG xem được ảnh)</span>
                    </div>
                    <code className="block p-2 bg-white rounded-lg border border-rose-200 text-rose-700 font-mono text-[10.5px] break-all select-all">
                      https://drive.google.com/drive/folders/1esbw7TuyePZEFmNe7oimUav-AIyeVv4B
                    </code>
                    <p className="text-[10.5px] text-rose-600 italic">
                      Dấu hiệu nhận biết: Link có chứa chữ <strong>"/folders/..."</strong>. Đây là link cả thư mục, không phải tấm ảnh cụ thể.
                    </p>
                  </div>

                  {/* CORRECT LINK */}
                  <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl space-y-1 shadow-2xs">
                    <div className="flex items-center gap-1.5 font-extrabold text-emerald-900 text-[11.5px]">
                      <span>✅ LINK ĐÚNG (Link tệp ảnh trực tiếp - Cán bộ xem được ngay)</span>
                    </div>
                    <code className="block p-2 bg-white rounded-lg border border-emerald-300 text-emerald-800 font-mono text-[10.5px] break-all select-all">
                      https://drive.google.com/file/d/1jz3QltvYgaHqG9uZUiJtBtowU4OM7G3G/view?usp=sharing
                    </code>
                    <p className="text-[10.5px] text-emerald-700 font-medium">
                      Dấu hiệu nhận biết: Link có chứa <strong>"/file/d/..."</strong> hoặc <strong>"?id=..."</strong>. Hệ thống sẽ ngay lập tức trích xuất và hiển thị ảnh xem trước.
                    </p>
                  </div>
                </div>
              </div>

              {/* Simple Alternative Tip */}
              <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-200 flex items-center gap-2 text-blue-900 text-[11px] font-medium">
                <Info className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Mẹo nhanh: Bạn có thể chọn trực tiếp nút <strong>"Tải ảnh từ điện thoại / máy tính"</strong> phía trên để đính kèm ảnh ngay mà không cần qua Google Drive.</span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
              <a
                href={MTTQ_DRIVE_FOLDER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <span>Mở Kho Drive MTTQ</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                type="button"
                onClick={() => setIsDriveGuideOpen(false)}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs transition-colors shadow-xs cursor-pointer"
              >
                Đã hiểu, đóng hướng dẫn
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
