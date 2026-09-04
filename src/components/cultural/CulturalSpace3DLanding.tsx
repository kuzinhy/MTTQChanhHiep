import React, { useState } from 'react';
import { Sparkles, Globe, BookOpen, Layers, Shield, Award, Users, Compass, ExternalLink, ArrowRight, Play, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface CulturalSpace3DLandingProps {
  onEnter3D: () => void;
  onOpenMap: () => void;
}

export const CulturalSpace3DLanding: React.FC<CulturalSpace3DLandingProps> = ({ onEnter3D, onOpenMap }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'rooms' | 'tours'>('overview');

  const rooms = [
    { title: 'Sảnh Trung Tâm', desc: 'Không gian đón tiếp, giới thiệu tổng quan truyền thống MTTQ Phường Chánh Hiệp.', icon: Globe, color: 'from-blue-600 to-indigo-700' },
    { title: 'Phòng Lịch Sử Địa Phương', desc: 'Dòng thời gian, tư liệu quý giá và hình ảnh qua các thời kỳ phát triển.', icon: BookOpen, color: 'from-amber-600 to-orange-700' },
    { title: 'MTTQ & Khối Đại Đoàn Kết', desc: 'Dấu ấn các kỳ Đại hội, phong trào thi đua yêu nước và gương điển hình tiên tiến.', icon: Users, color: 'from-rose-600 to-red-700' },
    { title: 'Không gian 21 Khu Phố', desc: 'Khám phá văn hóa, đời sống và các mô hình tự quản tại 21 khu phố trên địa bàn.', icon: Compass, color: 'from-emerald-600 to-teal-700' },
    { title: 'Địa Chỉ Đỏ & Di Sản', desc: 'Các di tích lịch sử, văn hóa, tín ngưỡng và công trình ghi công.', icon: Shield, color: 'from-purple-600 to-indigo-700' },
    { title: 'Triển Lãm Chuyên Đề', desc: 'Các không gian trưng bày theo sự kiện, ngày lễ lớn và hoạt động đổi mới sáng tạo.', icon: Award, color: 'from-sky-600 to-blue-700' },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-900">
      {/* Header Banner / Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 border-b border-blue-500/20 py-20 px-6 lg:px-16 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.15),transparent_50%)]" />
        
        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-400/30 px-4 py-1.5 rounded-full text-xs font-bold text-amber-300 tracking-wider uppercase backdrop-blur-md">
            <Sparkles className="w-4 h-4 animate-pulse text-amber-400" />
            Bảo Tàng Số Trực Tuyến • Phường Chánh Hiệp
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            KHÔNG GIAN VĂN HÓA SỐ <br />
            <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent">
              CHÁNH HIỆP 3D
            </span>
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">
            Trải nghiệm không gian trưng bày ảo đa chiều, khám phá lịch sử, truyền thống văn hóa, các phong trào Mặt trận và 21 khu phố trực tiếp trên trình duyệt mà không cần cài đặt phần mềm.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onEnter3D}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 text-slate-950 font-black text-sm sm:text-base flex items-center gap-3 shadow-xl shadow-amber-500/20 border border-amber-300/50 cursor-pointer"
            >
              <Play className="w-5 h-5 fill-slate-950" />
              <span>BẮT ĐẦU THAM QUAN 3D</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onOpenMap}
              className="px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm sm:text-base flex items-center gap-2.5 backdrop-blur-md border border-white/20 cursor-pointer transition-all"
            >
              <Globe className="w-5 h-5 text-blue-400" />
              <span>Mở Bản Đồ Số 21 Khu Phố</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Main Body */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 flex-1 w-full space-y-12">
        {/* Navigation Tabs */}
        <div className="flex justify-center border-b border-slate-800 pb-4">
          <div className="inline-flex bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700/60 shadow-inner">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'overview' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Giới Thiệu Chung
            </button>
            <button
              onClick={() => setActiveTab('rooms')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'rooms' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Các Phòng Trưng Bày (6 Khu Vực)
            </button>
            <button
              onClick={() => setActiveTab('tours')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'tours' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Hướng Dẫn Trải Nghiệm
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-800/50 border border-slate-700/80 rounded-3xl p-6 space-y-3 backdrop-blur-sm">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-black">
                01
              </div>
              <h3 className="text-lg font-bold text-white">Công Nghệ Trực Tuyến 3D</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Tích hợp công nghệ đồ họa WebGL tiên tiến, tối ưu hóa siêu nhẹ, cho phép người dân tham quan mượt mà trên cả máy tính, máy tính bảng và điện thoại di động.
              </p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700/80 rounded-3xl p-6 space-y-3 backdrop-blur-sm">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black">
                02
              </div>
              <h3 className="text-lg font-bold text-white">Quản Trị Động Từ Admin</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                100% nội dung, hình ảnh, tài liệu và vị trí trưng bày được quản lý tập trung từ hệ thống quản trị, cập nhật tức thời không cần can thiệp mã nguồn.
              </p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700/80 rounded-3xl p-6 space-y-3 backdrop-blur-sm">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black">
                03
              </div>
              <h3 className="text-lg font-bold text-white">Kết Nối Bản Đồ Số &amp; Dân Nguyện</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Liên thông trực tiếp với hệ thống Bản đồ 21 khu phố và Trợ lý tham mưu MTTQ, tạo nên hệ sinh thái văn phòng số toàn diện tại phường Chánh Hiệp.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'rooms' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room, idx) => {
              const Icon = room.icon;
              return (
                <div key={idx} className="bg-slate-800/60 border border-slate-700/70 rounded-3xl p-6 space-y-4 hover:border-blue-500/50 transition-all group">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${room.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="text-base font-black text-white group-hover:text-amber-300 transition-colors">{room.title}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{room.desc}</p>
                  </div>
                  <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-blue-400">
                    <span>Khám phá ngay</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'tours' && (
          <div className="bg-slate-800/60 border border-slate-700/80 rounded-3xl p-8 max-w-3xl mx-auto space-y-6">
            <h3 className="text-xl font-black text-white text-center">Hướng Dẫn Điều Khiển Trực Quan</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div className="space-y-3 bg-slate-900/60 p-5 rounded-2xl border border-slate-700">
                <h4 className="text-sm font-black text-amber-300 uppercase">Máy tính (Desktop)</h4>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Phím <kbd className="bg-slate-800 px-2 py-0.5 rounded text-amber-300 font-mono">W S A D</kbd> hoặc Mũi tên: Di chuyển</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Giữ chuột &amp; kéo: Xoay góc nhìn quan sát</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Click vào vật phẩm / Hotspot: Xem chi tiết</li>
                </ul>
              </div>

              <div className="space-y-3 bg-slate-900/60 p-5 rounded-2xl border border-slate-700">
                <h4 className="text-sm font-black text-amber-300 uppercase">Điện thoại / Máy tính bảng</h4>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Joystick ảo bên trái: Di chuyển linh hoạt</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Vuốt màn hình bên phải: Đổi hướng nhìn</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Chạm trực tiếp vào biểu tượng: Tương tác</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 px-6 text-center text-xs text-slate-500">
        Ủy ban MTTQ Việt Nam Phường Chánh Hiệp • Cổng thông tin Không gian Văn hóa số 3D © 2026
      </footer>
    </div>
  );
};
