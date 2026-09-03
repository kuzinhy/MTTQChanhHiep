import React from 'react';
import { 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Users, 
  MessageSquare, 
  Cloud, 
  Headphones, 
  ArrowRight, 
  Bot, 
  FileText, 
  HeartHandshake,
  Star,
  Zap,
  Award
} from 'lucide-react';
import { motion } from 'motion/react';

interface ZaloStyleServiceBannerProps {
  onGoToOpinion?: () => void;
  onGoToCompetitions?: () => void;
  onGoToDocuments?: () => void;
  onOpenVolunteerModal?: () => void;
}

export const ZaloStyleServiceBanner: React.FC<ZaloStyleServiceBannerProps> = ({
  onGoToOpinion,
  onGoToCompetitions,
  onGoToDocuments,
  onOpenVolunteerModal
}) => {
  return (
    <div className="my-8 space-y-6 animate-fadeIn">
      {/* 1. TOP HERO BANNER - Zalo Electric Blue Gradient with Concentric Orbit Rings (Inspired by Screenshot 1) */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#0052cc] via-[#0068ff] to-[#0088ff] text-white p-6 sm:p-10 shadow-xl shadow-blue-600/20 border border-blue-400/30">
        {/* Concentric Orbit Background Graphics */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] pointer-events-none opacity-40 sm:opacity-90">
          {/* Ring 1 - Outer */}
          <div className="absolute inset-0 rounded-full border border-dashed border-white/25 animate-spin-slow" />
          {/* Ring 2 - Middle */}
          <div className="absolute inset-8 rounded-full border border-white/20" />
          {/* Ring 3 - Inner */}
          <div className="absolute inset-20 rounded-full border border-dashed border-white/30" />

          {/* Orbit Floating Icons */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 p-2.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 shadow-md">
            <Users className="w-5 h-5 text-cyan-200" />
          </div>
          <div className="absolute bottom-8 right-6 p-2.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 shadow-md">
            <Headphones className="w-5 h-5 text-cyan-200" />
          </div>
          <div className="absolute top-1/3 left-6 p-2.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 shadow-md">
            <MessageSquare className="w-5 h-5 text-cyan-200" />
          </div>
          <div className="absolute top-12 right-12 p-3 rounded-full bg-white/30 backdrop-blur-md border border-white/40 shadow-lg">
            <Cloud className="w-6 h-6 text-white" />
          </div>

          {/* Center Glowing Badge */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white text-blue-700 flex flex-col items-center justify-center shadow-2xl border-4 border-blue-300 transform hover:scale-105 transition-transform">
                <Users className="w-8 h-8 sm:w-10 sm:h-10 text-[#0068ff]" />
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 font-black text-[11px] uppercase tracking-wider px-3 py-0.5 rounded-md shadow-md border border-amber-300 whitespace-nowrap">
                Chánh Hiệp 4.0
              </div>
            </div>
          </div>
        </div>

        {/* Content Side */}
        <div className="relative z-10 max-w-xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-xs font-black uppercase tracking-wider text-cyan-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Mặt Trận Số Phường Chánh Hiệp</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            Chánh Hiệp <span className="text-cyan-300">Digital 4.0</span>
            <br />
            Phục vụ Dân nguyện & An sinh Số
          </h2>

          <p className="text-blue-100 text-xs sm:text-base font-medium leading-relaxed max-w-lg">
            Tối ưu hóa phản ánh dân nguyện, tra cứu văn bản chính quyền và đăng ký hoạt động Mặt trận - Đoàn thể hoàn toàn miễn phí, an toàn & tiện lợi 24/7.
          </p>

          <div className="pt-2 flex items-center gap-3 flex-wrap">
            <button
              onClick={onGoToOpinion}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#0068ff] hover:bg-cyan-50 font-black text-xs sm:text-sm rounded-2xl shadow-lg shadow-black/10 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <span>Gửi phản ánh ngay</span>
              <ArrowRight className="w-4 h-4 text-[#0068ff]" />
            </button>

            <button
              onClick={onGoToDocuments}
              className="inline-flex items-center gap-2 px-5 py-3 bg-white/15 hover:bg-white/25 text-white font-bold text-xs sm:text-sm rounded-2xl border border-white/30 backdrop-blur-md transition-all cursor-pointer"
            >
              <span>Tra cứu Văn bản</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. BOTTOM FEATURE COMPARISON SECTION (Inspired by Screenshot 2) */}
      <div className="bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 rounded-3xl p-6 sm:p-10 border border-blue-100/80 shadow-xs">
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Nâng cao hiệu quả phục vụ nhân dân cùng <span className="text-[#0068ff]">Chánh Hiệp Digital 4.0</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Tất cả tiện ích được thiết kế đồng bộ, trực quan theo chuẩn Công nghệ Chuyển đổi số Quốc gia.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Feature Checkmark List */}
          <div className="lg:col-span-7 space-y-5">
            <h4 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#0068ff]" />
              <span>Đặc quyền Dịch vụ Số cho Nhân dân</span>
            </h4>

            <div className="space-y-3.5">
              <div className="flex items-start gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
                <div className="p-1.5 rounded-full bg-blue-50 text-[#0068ff] shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-[#0068ff]" />
                </div>
                <div className="flex-1 text-xs sm:text-sm">
                  <div className="font-extrabold text-slate-900 flex items-center gap-2 flex-wrap">
                    <span>Tiếp nhận & Xử lý Ý kiến Dân nguyện 24/7</span>
                    <span className="bg-amber-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-md shadow-2xs uppercase">
                      Chính thức
                    </span>
                  </div>
                  <p className="text-slate-500 text-xs mt-0.5 font-medium">
                    Gửi phản ánh trực tiếp tới Thường trực Mặt trận phường, nhận phản hồi công khai minh bạch.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
                <div className="p-1.5 rounded-full bg-blue-50 text-[#0068ff] shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-[#0068ff]" />
                </div>
                <div className="flex-1 text-xs sm:text-sm">
                  <div className="font-extrabold text-slate-900 flex items-center gap-2 flex-wrap">
                    <span>Kho tra cứu Văn bản, Kế hoạch & Quy định</span>
                    <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-md shadow-2xs">
                      X2 Tốc độ
                    </span>
                  </div>
                  <p className="text-slate-500 text-xs mt-0.5 font-medium">
                    Cập nhật đầy đủ quyết định, thông báo, quy trình TTHC và biểu mẫu tải về miễn phí.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
                <div className="p-1.5 rounded-full bg-blue-50 text-[#0068ff] shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-[#0068ff]" />
                </div>
                <div className="flex-1 text-xs sm:text-sm">
                  <div className="font-extrabold text-slate-900 flex items-center gap-2 flex-wrap">
                    <span>Hội thi Trực tuyến & Khảo sát Dư luận</span>
                    <span className="bg-blue-50 text-blue-700 font-extrabold border border-blue-200 text-[10px] px-2 py-0.5 rounded-md">
                      Mới
                    </span>
                  </div>
                  <p className="text-slate-500 text-xs mt-0.5 font-medium">
                    Tham gia nộp bài thi trắc nghiệm, bài viết cảm nhận và đóng góp ý kiến xây dựng chính quyền.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
                <div className="p-1.5 rounded-full bg-blue-50 text-[#0068ff] shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-[#0068ff]" />
                </div>
                <div className="flex-1 text-xs sm:text-sm">
                  <div className="font-extrabold text-slate-900 flex items-center gap-2 flex-wrap">
                    <span>Đăng ký Tình nguyện viên An sinh Xã hội</span>
                    <span className="bg-cyan-100 text-cyan-800 font-extrabold text-[10px] px-2 py-0.5 rounded-md border border-cyan-200">
                      Nổi bật
                    </span>
                  </div>
                  <p className="text-slate-500 text-xs mt-0.5 font-medium">
                    Đóng góp công sức, tài trợ phong trào và kết nối lực lượng đoàn viên thanh niên 21 khu phố.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Floating Elevated Service Card (Inspired by Screenshot 2 Right Card) */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-blue-200 shadow-xl shadow-blue-500/10 space-y-5 relative overflow-hidden">
              {/* Gold / Orange Ribbon Badge */}
              <div className="absolute top-4 right-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[11px] font-black px-3 py-1 rounded-full shadow-md uppercase tracking-wider">
                100% Miễn Phí
              </div>

              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Tiện ích phục vụ nhân dân</span>
                <h4 className="text-lg font-black text-slate-900 mt-1">Cổng Số Chánh Hiệp 4.0</h4>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/50 border border-blue-200/80 space-y-2">
                <div className="text-2xl font-black text-[#0068ff]">
                  0 VNĐ <span className="text-xs font-medium text-slate-500">/ Toàn bộ tính năng</span>
                </div>
                <p className="text-xs text-slate-600 font-medium">
                  Được tài trợ & vận hành bởi Ủy ban MTTQ Việt Nam phường Chánh Hiệp.
                </p>
              </div>

              {/* Bonus Included Services */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold text-slate-700 block">Tặng kèm tiện ích thông minh:</span>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100 text-[#0068ff] shrink-0">
                    <Bot className="w-4 h-4 text-[#0068ff]" />
                  </div>
                  <div className="text-xs">
                    <span className="font-extrabold text-slate-900 block">Trợ lý AI Studio Chánh Hiệp</span>
                    <span className="text-slate-500 text-[11px]">Hỗ trợ hướng dẫn thủ tục & giải đáp 24/7</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700 shrink-0">
                    <FileText className="w-4 h-4 text-emerald-700" />
                  </div>
                  <div className="text-xs">
                    <span className="font-extrabold text-slate-900 block">Hồ sơ & Lịch công tác số</span>
                    <span className="text-slate-500 text-[11px]">Tra cứu lịch làm việc & sự kiện cộng đồng</span>
                  </div>
                </div>
              </div>

              {/* Primary Electric Blue CTA Button */}
              <button
                onClick={onGoToOpinion}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#0068ff] hover:bg-[#0052cc] text-white font-black text-xs sm:text-sm shadow-lg shadow-blue-600/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Trải nghiệm Dịch vụ Số Ngay</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
