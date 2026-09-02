import React from 'react';
import { 
  Building, 
  Users, 
  Award, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ShieldCheck, 
  FileText,
  HeartHandshake,
  Star,
  Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';

export const AboutSection: React.FC<{
  onGoToTab?: (tab: string) => void;
}> = ({ onGoToTab }) => {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-sky-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-cyan-400/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-400/20 text-cyan-200 border border-cyan-300/30 text-xs font-black uppercase tracking-wider">
            <Star className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
            <span>Đoàn Kết – Dân Chủ – Đồng Thuận – Phát Triển</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
            Ủy Ban Mặt Trận Tổ Quốc Việt Nam Phường Chánh Hiệp
          </h1>
          <p className="text-blue-100 text-xs sm:text-sm font-medium leading-relaxed">
            Cơ quan đại diện cho khối đại đoàn kết toàn dân tộc tại địa bàn Phường Chánh Hiệp, Thành phố Hồ Chí Minh; cầu nối vững chắc giữa Đảng, Chính quyền với các tầng lớp Nhân dân trên 21 khu phố.
          </p>
        </div>
      </div>

      {/* 3 Pillars Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center font-black">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-base text-slate-900">Tập hợp Khối Đại Đoàn Kết</h3>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Tuyên truyền, vận động các tầng lớp nhân dân thực hiện chủ trương của Đảng, chính sách pháp luật của Nhà nước và các phong trào thi đua yêu nước tại cơ sở.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-700 flex items-center justify-center font-black">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-base text-slate-900">Giám Sát &amp; Phản Biện Xã Hội</h3>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Thực hiện quyền làm chủ của nhân dân, giám sát hoạt động của cơ quan nhà nước, cán bộ, đảng viên; tham gia đóng góp xây dựng Đảng và chính quyền trong sạch, vững mạnh.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-black">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-base text-slate-900">Chăm Lo An Sinh Xã Hội</h3>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Vận động xây dựng Quỹ "Vì người nghèo", cứu trợ thiên tai, trao tặng nhà Đại đoàn kết và chăm lo các đối tượng yếu thế trên địa bàn 21 khu phố.
          </p>
        </div>
      </div>

      {/* Leadership & Contact Structure */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-lg space-y-6">
        <h3 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3">
          Ban Thường Trực Ủy Ban MTTQ Phường Khóa X (Nhiệm kỳ 2024 - 2029)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-slate-200 overflow-hidden mx-auto mb-2 border border-slate-300">
              <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300" alt="Chủ tịch MTTQ" className="w-full h-full object-cover" />
            </div>
            <div className="text-center">
              <div className="font-black text-xs text-slate-900">Trần Thị Hoa</div>
              <div className="text-[11px] font-bold text-blue-700">Chủ tịch Ủy ban MTTQ</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-slate-200 overflow-hidden mx-auto mb-2 border border-slate-300">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300" alt="Phó Chủ tịch MTTQ" className="w-full h-full object-cover" />
            </div>
            <div className="text-center">
              <div className="font-black text-xs text-slate-900">Nguyễn Văn Hùng</div>
              <div className="text-[11px] font-bold text-blue-700">Phó Chủ tịch Thường trực</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-slate-200 overflow-hidden mx-auto mb-2 border border-slate-300">
              <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300" alt="Ủy viên Thường trực" className="w-full h-full object-cover" />
            </div>
            <div className="text-center">
              <div className="font-black text-xs text-slate-900">Trần Văn Nam</div>
              <div className="text-[11px] font-bold text-slate-600">Ủy viên Thường trực</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-slate-200 overflow-hidden mx-auto mb-2 border border-slate-300">
              <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300" alt="Cán bộ Tuyên giáo" className="w-full h-full object-cover" />
            </div>
            <div className="text-center">
              <div className="font-black text-xs text-slate-900">Lê Thị Thu Thảo</div>
              <div className="text-[11px] font-bold text-slate-600">Cán bộ Tuyên giáo - Thi đua</div>
            </div>
          </div>
        </div>

        {/* Official Address & Info */}
        <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="flex items-center gap-3 text-slate-600 font-medium">
            <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Số 1240, đường Đại Lộ Bình Dương, khu phố Định Hòa 5, phường Chánh Hiệp, Thành phố Hồ Chí Minh</span>
          </div>
          <div className="flex items-center gap-3 text-slate-600 font-medium">
            <Phone className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Hotline: 0989614614 (Đồng chí Nguyễn Xuân Kiều)</span>
          </div>
          <div className="flex items-center gap-3 text-slate-600 font-medium">
            <Mail className="w-4 h-4 text-blue-600 shrink-0" />
            <span>mttqvietnamphuongchanhhiep@gmail.com</span>
          </div>
        </div>
      </div>
    </div>
  );
};
