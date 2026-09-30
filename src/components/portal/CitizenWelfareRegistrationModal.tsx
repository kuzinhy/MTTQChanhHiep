import React, { useState } from 'react';
import { 
  HeartHandshake, X, Send, CheckCircle2, ShieldCheck, 
  MapPin, Phone, User, Home, AlertCircle, Sparkles, FileText
} from 'lucide-react';
import { OFFICIAL_NEIGHBORHOOD_NAMES } from '../../data/neighborhoodsList';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (title: string, msg: string) => void;
}

export const CitizenWelfareRegistrationModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [fullname, setFullname] = useState('');
  const [phone, setPhone] = useState('');
  const [neighborhood, setNeighborhood] = useState(OFFICIAL_NEIGHBORHOOD_NAMES[0] || 'Định Hòa 1');
  const [address, setAddress] = useState('');
  const [programType, setProgramType] = useState('BUA_COM_NGHIA_TINH');
  const [householdCircumstance, setHouseholdCircumstance] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullname.trim() || !phone.trim() || !householdCircumstance.trim()) return;

    setIsSubmitting(true);
    try {
      const newRecord = {
        id: 'welfare-' + Date.now(),
        fullname: fullname.trim(),
        phone: phone.trim(),
        neighborhood,
        address: address.trim(),
        programType,
        circumstance: householdCircumstance.trim(),
        status: 'PENDING',
        createdAt: new Date().toISOString()
      };

      const existingRaw = localStorage.getItem('chanh_hiep_welfare_registrations') || '[]';
      const list = JSON.parse(existingRaw);
      list.unshift(newRecord);
      localStorage.setItem('chanh_hiep_welfare_registrations', JSON.stringify(list));

      setIsSuccess(true);
      if (onSuccess) {
        onSuccess('Đã tiếp nhận hồ sơ an sinh', 'Ủy ban MTTQ và Ban CTMT khu phố sẽ tiến hành thẩm tra và liên hệ hỗ trợ sớm nhất.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-xl text-white">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Đăng Ký Nhận Hỗ Trợ An Sinh Xã Hội</h3>
              <p className="text-xs text-orange-100">Ủy ban MTTQ Việt Nam & Ban Vận động Quỹ Vì người nghèo Phường</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/20 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {isSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h4 className="font-black text-lg text-slate-800">Đã Gửi Hồ Sơ Thành Công!</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                Hồ sơ hỗ trợ của gia đình bà con đã được chuyển đến Ban Thường trực Ủy ban MTTQ Phường Chánh Hiệp và Ban Công tác Mặt trận Khu phố <strong>{neighborhood}</strong> để xác minh và phê duyệt.
              </p>
            </div>
            <button
              onClick={() => {
                setIsSuccess(false);
                onClose();
              }}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
            >
              Hoàn tất
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs">
            {/* Program Selection */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Chương trình an sinh đề nghị hỗ trợ:</label>
              <select
                value={programType}
                onChange={(e) => setProgramType(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              >
                <option value="BUA_COM_NGHIA_TINH">Chương trình "Bữa cơm nghĩa tình" (Suất ăn miễn phí)</option>
                <option value="NHA_DAI_DOAN_KET">Hỗ trợ Xây mới / Sửa chữa "Nhà Đại đoàn kết"</option>
                <option value="TIEP_SUC_DEN_TRUONG">Học bổng & Dụng cụ học tập "Tiếp sức đến trường"</option>
                <option value="TRO_CAP_DOT_XUAT">Trợ cấp khó khăn đột xuất / Bệnh hiểm nghèo</option>
                <option value="THE_BHYT_MIEN_PHI">Hỗ trợ Cấp thẻ Bảo hiểm Y tế tự nguyện</option>
              </select>
            </div>

            {/* Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Họ và tên người nhận / đại diện:</label>
                <input
                  type="text"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn A"
                  required
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Số điện thoại liên hệ:</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Ví dụ: 0912345678"
                  required
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
              </div>
            </div>

            {/* Neighborhood & Address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Thuộc Khu phố:</label>
                <select
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none"
                >
                  {OFFICIAL_NEIGHBORHOOD_NAMES.map(nb => (
                    <option key={nb} value={nb}>Khu phố {nb}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Địa chỉ cụ thể:</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Số nhà, tên đường, hẻm..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Circumstance */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Mô tả hoàn cảnh khó khăn & nhu cầu cần giúp đỡ:</label>
              <textarea
                rows={3}
                value={householdCircumstance}
                onChange={(e) => setHouseholdCircumstance(e.target.value)}
                placeholder="Mô tả hoàn cảnh (ví dụ: người già neo đơn không nguồn thu nhập, bệnh tật, nhà dột nát, con em có nguy cơ bỏ học...)"
                required
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              />
            </div>

            {/* Privacy note */}
            <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-xl flex items-start gap-2 text-[11px] text-amber-900">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>Thông tin của bà con được bảo mật tuyệt đối và chỉ dùng cho mục đích xác minh hỗ trợ an sinh của Ủy ban MTTQ Phường.</span>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded-xl font-bold transition shadow-sm flex items-center gap-1.5"
              >
                {isSubmitting ? 'Đang gửi...' : <Send className="w-4 h-4" />}
                <span>Gửi Hồ Sơ An Sinh</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
