import React, { useState } from 'react';
import { HeartHandshake, User, Phone, MapPin, Sparkles, Check, X, ShieldCheck, Send } from 'lucide-react';

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
  const [neighborhood, setNeighborhood] = useState('Khu phố 1');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in overflow-y-auto">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-sky-700 text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/15 backdrop-blur-md rounded-2xl border border-white/20 text-amber-300">
              <HeartHandshake className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 bg-white/10 px-2 py-0.5 rounded-md">
                KẾT NỐI SỨC MẠNH CỘNG ĐỒNG
              </span>
              <h2 className="text-lg font-black text-white mt-1">Đăng Ký Tình Nguyện Viên MTTQ</h2>
              <p className="text-xs text-blue-100 font-medium">Đồng hành cùng MTTQ Phường Chánh Hiệp xây dựng đô thị văn minh</p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        {isSubmitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
              <Check className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-slate-900">Trân Trọng Cảm Ơn Tinh Thần Tình Nguyện!</h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                Thông tin của bạn <strong className="text-slate-900">{fullName}</strong> ({phone}) đã được lưu trữ trên hệ thống Chánh Hiệp Digital Office. Thường trực MTTQ sẽ liên hệ khi có hoạt động phù hợp.
              </p>
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs transition shadow-md cursor-pointer"
            >
              Đóng cửa sổ
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Họ và tên Tình nguyện viên <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="Nguyễn Văn A"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-600 focus:bg-white transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Số điện thoại / Zalo <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="0901234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-600 focus:bg-white transition"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Khu phố sinh sống / Tác nghiệp
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <select
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-600 focus:bg-white transition"
                >
                  {Array.from({ length: 21 }, (_, i) => `Khu phố ${i + 1}`).map((kp) => (
                    <option key={kp} value={kp}>{kp}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Chọn Đội hình / Lĩnh vực muốn đóng góp (Có thể chọn nhiều)
              </label>
              <div className="space-y-2">
                {volunteerTeams.map((team) => {
                  const isSelected = selectedTeams.includes(team.id);
                  return (
                    <div
                      key={team.id}
                      onClick={() => toggleTeam(team.id)}
                      className={`p-3 rounded-2xl border transition cursor-pointer flex items-start gap-3 ${
                        isSelected 
                          ? 'bg-blue-50/80 border-blue-500 text-blue-900 shadow-xs' 
                          : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border transition ${
                        isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-white'
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </div>
                      <div>
                        <div className="text-xs font-black">{team.id}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{team.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Ghi chú thêm (Kỹ năng, thời gian rảnh)
              </label>
              <textarea
                rows={2}
                placeholder="Ví dụ: Rảnh sáng Chủ nhật, có xe máy, biết thiết kế đồ họa/quay phim..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-blue-600 focus:bg-white transition"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-100 transition cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs shadow-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Đang gửi thông tin...</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Gửi Đăng Ký Ngay</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
