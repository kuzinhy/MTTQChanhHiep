import React, { useState } from 'react';
import { PublicOpinion, OpinionTopic } from '../types';
import { MessageSquareHeart, Send, Search, CheckCircle, ShieldAlert, FileText, Lock, UserX, AlertCircle, Copy } from 'lucide-react';
import { OFFICIAL_NEIGHBORHOOD_NAMES } from '../data/neighborhoodsList';
import { VoiceInputControl } from '../speech/VoiceInputControl';

interface OpinionFormSectionProps {
  opinions: PublicOpinion[];
  onSubmitOpinion: (opinion: PublicOpinion) => void;
}

export const OpinionFormSection: React.FC<OpinionFormSectionProps> = ({ opinions, onSubmitOpinion }) => {
  const [topic, setTopic] = useState<OpinionTopic>('Vấn đề dân sinh');
  const [content, setContent] = useState('');
  const [neighborhood, setNeighborhood] = useState(OFFICIAL_NEIGHBORHOOD_NAMES[0]);
  const [fullname, setFullname] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [submittedCode, setSubmittedCode] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Lookup Tool State
  const [lookupCode, setLookupCode] = useState('');
  const [foundOpinion, setFoundOpinion] = useState<PublicOpinion | null>(null);
  const [lookupAttempted, setLookupAttempted] = useState(false);
  const [ratedStar, setRatedStar] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    onSubmitOpinion(newOpinion);
    setSubmittedCode(code);
    setContent('');
    setFullname('');
    setPhone('');
    setAddress('');
    setEmail('');
    setIsSubmitting(false);
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
            <form onSubmit={handleSubmit} className="space-y-4">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700 text-xs font-semibold">
                  <AlertCircle className="w-4 h-4 shrink-0 animate-pulse" />
                  <span>{formError}</span>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Lĩnh vực phản ánh (*)
                  </label>
                  <select
                    value={topic}
                    onChange={(e) => setTopic(e.target.value as OpinionTopic)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-hidden"
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
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-hidden"
                  >
                    {neighborhoods.map((kp) => (
                      <option key={kp} value={kp}>{kp}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Nội dung phản ánh / Đề xuất cụ thể (*)
                </label>
                <textarea
                  rows={5}
                  placeholder="Mô tả chi tiết địa điểm, thời gian, sự việc... Hoặc bấm nút 'Nói ý kiến' bên dưới để đọc trực tiếp"
                  value={content}
                  onChange={(e) => {
                    setContent(e.target.value);
                    if (formError) setFormError(null);
                  }}
                  className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-hidden leading-relaxed"
                />
                
                {/* Voice Input Module for Citizen Opinions */}
                <VoiceInputControl
                  value={content}
                  onChange={(val) => {
                    setContent(val);
                    if (formError) setFormError(null);
                  }}
                  maxLength={2000}
                />
              </div>

              {/* Contact Information Section - Mandatory */}
              <div className="space-y-3 pt-2 border-t border-slate-200">
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
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-hidden"
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
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-hidden"
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
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-hidden"
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
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-hidden"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
              >
                <Send className="w-4 h-4 text-white" />
                <span>Gửi Ý Kiến Phản Ánh</span>
              </button>
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
    </section>
  );
};
