import React, { useState } from 'react';
import { PublicOpinion, OpinionTopic } from '../types';
import { MessageSquareHeart, Send, Search, CheckCircle, ShieldAlert, FileText, Lock, UserX, AlertCircle } from 'lucide-react';

interface OpinionFormSectionProps {
  opinions: PublicOpinion[];
  onSubmitOpinion: (opinion: PublicOpinion) => void;
}

export const OpinionFormSection: React.FC<OpinionFormSectionProps> = ({ opinions, onSubmitOpinion }) => {
  const [topic, setTopic] = useState<OpinionTopic>('Vấn đề dân sinh');
  const [content, setContent] = useState('');
  const [neighborhood, setNeighborhood] = useState('Khu phố 1');
  const [fullname, setFullname] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [submittedCode, setSubmittedCode] = useState<string | null>(null);

  // Lookup Tool State
  const [lookupCode, setLookupCode] = useState('');
  const [foundOpinion, setFoundOpinion] = useState<PublicOpinion | null>(null);
  const [lookupAttempted, setLookupAttempted] = useState(false);

  const topics: OpinionTopic[] = [
    'Vấn đề dân sinh',
    'An sinh xã hội',
    'Môi trường & Đô thị',
    'Trật tự an toàn',
    'Thủ tục hành chính',
    'Văn hóa - Xã hội',
    'Ý kiến đóng góp khác'
  ];

  const neighborhoods = Array.from({ length: 12 }, (_, i) => `Khu phố ${i + 1}`);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      alert('Vui lòng nhập nội dung phản ánh!');
      return;
    }

    const code = 'PA-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);

    const newOpinion: PublicOpinion = {
      id: 'op-' + Date.now(),
      receiptCode: code,
      topic,
      content,
      neighborhood,
      fullname: isAnonymous ? '' : fullname,
      phone: isAnonymous ? '' : phone,
      email: isAnonymous ? '' : email,
      isAnonymous,
      status: 'NEW',
      priority: 'NORMAL',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    onSubmitOpinion(newOpinion);
    setSubmittedCode(code);
    setContent('');
    setFullname('');
    setPhone('');
    setEmail('');
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
              <div className="inline-block px-4 py-2 bg-blue-600 text-white font-extrabold text-base rounded-xl tracking-wider shadow-xs">
                {submittedCode}
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
                  placeholder="Mô tả chi tiết địa điểm, thời gian, sự việc..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-hidden leading-relaxed"
                />
              </div>

              {/* Anonymous Option */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserX className="w-4 h-4 text-slate-600" />
                  <span className="text-xs font-semibold text-slate-800">Gửi ẩn danh (Không gửi thông tin cá nhân)</span>
                </div>
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded-md focus:ring-blue-600"
                />
              </div>

              {!isAnonymous && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">Họ và tên</label>
                    <input
                      type="text"
                      placeholder="Nguyễn Văn A"
                      value={fullname}
                      onChange={(e) => setFullname(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">Số điện thoại</label>
                    <input
                      type="text"
                      placeholder="0908xxxxxx"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">Email (nếu có)</label>
                    <input
                      type="email"
                      placeholder="email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-hidden"
                    />
                  </div>
                </div>
              )}

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
        </div>

      </div>
    </section>
  );
};
