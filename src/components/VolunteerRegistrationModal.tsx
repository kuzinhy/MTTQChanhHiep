import React, { useState } from 'react';
import { HeartHandshake, User, Phone, MapPin, Sparkles, Check, X, ShieldCheck, Send } from 'lucide-react';
import { OFFICIAL_NEIGHBORHOOD_NAMES } from '../data/neighborhoodsList';

interface VolunteerRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (title: string, message: string) => void;
}

export const VolunteerRegistrationModal: React.FC<VolunteerRegistrationModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [neighborhood, setNeighborhood] = useState(OFFICIAL_NEIGHBORHOOD_NAMES[0]);
  const [selectedTeams, setSelectedTeams] = useState<string[]>(['An sinh & Cứu trợ']);
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const volunteerTeams = [
    { id: 'An sinh & Cứu trợ', desc: 'Hỗ trợ trao quà, hỗ trợ hộ khó khăn, cứu trợ đột xuất' },
    { id: 'Bảo vệ Môi trường & Xanh hóa', desc: 'Chủ nhật Xanh, phân loại rác thải, trồng cây xanh' },
    { id: 'Tổ Công nghệ số Cộng đồng', desc: 'Tuyên truyền, hướng dẫn người dân dùng Dịch vụ công & App số' },
    { id: 'Đội Phản ứng nhanh MTTQ', desc: 'Tham gia cứu hộ, điều tiết sự kiện đại đoàn kết địa phương' }
  ];

  const toggleTeam = (teamId: string) => {
    if (selectedTeams.includes(teamId)) {
      setSelectedTeams(selectedTeams.filter(t => t !== teamId));
    } else {
      setSelectedTeams([...selectedTeams, teamId]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) {
      alert('Vui lòng điền Họ tên và Số điện thoại liên hệ');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      if (onSuccess) {
        onSuccess('Đăng ký Tình nguyện viên thành công!', 'Ủy ban MTTQ Phường Chánh Hiệp đã ghi nhận thông tin của bạn.');
      }
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[88vh] my-auto">
        {/* Compact Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-sky-700 text-white px-4 py-3 sm:px-5 sm:py-3.5 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            title="Đóng"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-2.5 sm:gap-3 pr-8">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-amber-300 shrink-0">
              <HeartHandshake className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-black uppercase tracking-wider text-amber-300 bg-white/10 px-1.5 py-0.5 rounded">
                  KẾT NỐI SỨC MẠNH CỘNG ĐỒNG
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-black text-white leading-tight mt-0.5">
                Đăng Ký Tình Nguyện Viên MTTQ
              </h2>
              <p className="text-[11px] text-blue-100 font-medium">
                Ủy ban MTTQ Việt Nam Phường Chánh Hiệp
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        {isSubmitted ? (
          <div className="p-6 sm:p-8 text-center space-y-3.5 my-auto">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
              <Check className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                Trân Trọng Cảm Ơn Tinh Thần Tình Nguyện!
              </h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                Thông tin của bạn <strong className="text-slate-900">{fullName}</strong> ({phone}) đã được lưu trữ trên hệ thống Chánh Hiệp Digital Office. Thường trực MTTQ sẽ liên hệ khi có hoạt động phù hợp.
              </p>
            </div>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-sm cursor-pointer"
            >
              Đóng cửa sổ
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
            {/* Scrollable Form Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
              {/* Row 1: Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Họ và tên Tình nguyện viên <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      required
                      placeholder="Nguyễn Văn A"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-blue-600 focus:bg-white transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Số điện thoại / Zalo <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      required
                      placeholder="0901234567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-blue-600 focus:bg-white transition"
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: Neighborhood */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Khu phố sinh sống / Tác nghiệp
                </label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <select
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-blue-600 focus:bg-white transition"
                  >
                    {OFFICIAL_NEIGHBORHOOD_NAMES.map((kp) => (
                      <option key={kp} value={kp}>{kp}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 3: Volunteer Teams (Compact 2x2 Grid) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-bold text-slate-700">
                    Chọn Đội hình / Lĩnh vực tham gia
                  </label>
                  <span className="text-[10px] text-slate-400 font-medium">
                    Có thể chọn nhiều
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {volunteerTeams.map((team) => {
                    const isSelected = selectedTeams.includes(team.id);
                    return (
                      <div
                        key={team.id}
                        onClick={() => toggleTeam(team.id)}
                        className={`p-2 sm:p-2.5 rounded-xl border transition cursor-pointer flex items-start gap-2 ${
                          isSelected 
                            ? 'bg-blue-50/90 border-blue-500 text-blue-900 shadow-2xs' 
                            : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 mt-0.5 border transition ${
                          isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-white'
                        }`}>
                          {isSelected && <Check className="w-3 h-3" />}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold leading-tight">{team.id}</div>
                          <div className="text-[10px] text-slate-500 mt-0.5 leading-snug line-clamp-2">{team.desc}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Row 4: Note */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Ghi chú thêm (Kỹ năng, khung giờ rảnh)
                </label>
                <textarea
                  rows={2}
                  placeholder="Ví dụ: Rảnh sáng Chủ nhật, có xe máy, có kỹ năng chụp ảnh / tin học..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:border-blue-600 focus:bg-white transition"
                />
              </div>
            </div>

            {/* Pinned Action Footer - Never cut off */}
            <div className="px-4 py-2.5 sm:px-5 sm:py-3 bg-slate-50/95 backdrop-blur-xs border-t border-slate-200 flex items-center justify-between gap-2 shrink-0">
              <span className="text-[11px] text-slate-500 hidden sm:inline-flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Thông tin được bảo mật
              </span>
              <div className="flex items-center gap-2 ml-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 font-semibold text-xs hover:bg-slate-100 transition cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-xs hover:shadow transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Đang gửi...</span>
                  ) : (
                    <>
                      <Send className="w-3 h-3" />
                      <span>Gửi Đăng Ký Ngay</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
