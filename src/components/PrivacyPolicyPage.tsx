import React from 'react';
import { ShieldCheck, Lock, FileText, CheckCircle2, ChevronLeft, Scale } from 'lucide-react';
import { motion } from 'motion/react';

export const PrivacyPolicyPage: React.FC<{
  onBack: () => void;
}> = ({ onBack }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Quay lại Trang chủ</span>
      </button>

      {/* Main Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Banner */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-sky-950 p-8 text-white space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/20 text-cyan-200 border border-cyan-300/30 text-xs font-black uppercase">
            <Scale className="w-3.5 h-3.5" />
            <span>Nghị định 13/2023/NĐ-CP</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Chính Sách Bảo Vệ Dữ Liệu Cá Nhân &amp; Quyền Riêng Tư
          </h1>
          <p className="text-blue-100 text-xs sm:text-sm font-medium">
            Ủy ban Mặt trận Tổ quốc Việt Nam Phường Chánh Hiệp, Thành phố Hồ Chí Minh
          </p>
        </div>

        <div className="p-8 sm:p-12 space-y-8 text-slate-800 text-sm leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2 text-blue-900">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs">1</span>
              Mục đích thu thập và xử lý dữ liệu
            </h2>
            <p className="text-slate-600 font-medium">
              Cổng thông tin điện tử &amp; Văn phòng số MTTQ Phường Chánh Hiệp chỉ thu thập các thông tin tối thiểu theo nguyên tắc <strong>Data Minimization</strong> nhằm phục vụ:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600 font-medium">
              <li>Tiếp nhận, phân loại và chuyển xử lý các ý kiến, kiến nghị, phản ánh dân sinh của người dân (Mục Dân nguyện).</li>
              <li>Ghi nhận kết quả tham gia các hội thi trực tuyến và cấp giấy chứng nhận/khen thưởng phong trào thi đua.</li>
              <li>Ghi nhận ý kiến đánh giá sự hài lòng của công dân đối với các dịch vụ hành chính công.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2 text-blue-900">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs">2</span>
              Nguyên tắc bảo mật thông tin công dân
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-blue-700" />
                  <span>Mã hóa &amp; Lưu trữ an toàn</span>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  Số điện thoại, địa chỉ và nội dung phản ánh cá nhân được lưu trữ bảo mật trên cơ sở dữ liệu đám mây, chỉ cán bộ được phân công xử lý mới có quyền truy cập.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>Tùy chọn Ẩn danh</span>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  Người dân có toàn quyền chọn chế độ "Gửi phản ánh ẩn danh" khi không muốn cung cấp thông tin định danh cá nhân.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2 text-blue-900">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs">3</span>
              Quyền của chủ thể dữ liệu
            </h2>
            <p className="text-slate-600 font-medium">
              Người dân gửi phản ánh có quyền tra cứu tiến độ xử lý bằng Mã hồ sơ (ví dụ: <code className="font-mono text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">DN-2026-XXXXXX</code>) hoặc yêu cầu chỉnh sửa/rút lại phản ánh qua đường dây nóng của Ủy ban MTTQ Phường.
            </p>
          </section>

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-medium flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-amber-700 shrink-0" />
            <span>
              Mọi thắc mắc về chính sách bảo mật xin vui lòng liên hệ Văn phòng Ủy ban MTTQ Việt Nam Phường Chánh Hiệp. Điện thoại: (0274) 3822 111.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
