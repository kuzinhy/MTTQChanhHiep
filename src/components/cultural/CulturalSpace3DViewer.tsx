import React, { useState } from 'react';
import { CulturalSpace3DLanding } from './CulturalSpace3DLanding';
import { Play, ArrowLeft, Layers, Volume2, VolumeX, Maximize2, Compass, Shield, Sparkles, MapPin } from 'lucide-react';
import { motion } from 'motion/react';

interface CulturalSpace3DViewerProps {
  onBackToPortal: () => void;
  onOpenMap: () => void;
}

export const CulturalSpace3DViewer: React.FC<CulturalSpace3DViewerProps> = ({ onBackToPortal, onOpenMap }) => {
  const [isInSpace, setIsInSpace] = useState<boolean>(false);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [activeRoom, setActiveRoom] = useState<string>('lobby');
  const [selectedExhibit, setSelectedExhibit] = useState<any | null>(null);

  const roomsList = [
    { id: 'lobby', name: 'Sảnh Trung Tâm' },
    { id: 'history', name: 'Lịch Sử Địa Phương' },
    { id: 'mttq', name: 'MTTQ & Đại Đoàn Kết' },
    { id: 'neighborhoods', name: '21 Khu Phố' },
    { id: 'heritage', name: 'Địa Chỉ Đỏ & Di Sản' },
    { id: 'exhibition', name: 'Triển Lãm Chuyên Đề' },
  ];

  const sampleExhibits: Record<string, any[]> = {
    lobby: [
      { id: 'lb-1', title: 'Cổng chính Văn phòng MTTQ Phường Chánh Hiệp', desc: 'Trung tâm chỉ đạo và phối hợp hành động chung của khối đại đoàn kết toàn dân tộc.', image: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80' },
      { id: 'lb-2', title: 'Huân chương Lao động hạng Ba', desc: 'Phần thưởng cao quý ghi nhận thành tích xuất sắc trong công tác Mặt trận giai đoạn 2020 - 2025.', image: 'https://images.unsplash.com/photo-1567427017947-545c5f2d16ad?auto=format&fit=crop&w=800&q=80' }
    ],
    history: [
      { id: 'hist-1', title: 'Dòng thời gian 60 năm hình thành và phát triển', desc: 'Những cột mốc lịch sử hào hùng của nhân dân và cán bộ phường Chánh Hiệp qua các thời kỳ kháng chiến và xây dựng đổi mới.', image: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=800&q=80' }
    ],
    mttq: [
      { id: 'mttq-1', title: 'Đại hội đại biểu MTTQ Việt Nam Phường', desc: 'Nghị quyết đại hội và phương hướng nhiệm kỳ mới với khát vọng vươn lên mạnh mẽ.', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80' }
    ],
    neighborhoods: [
      { id: 'nh-1', title: 'Mô hình tự quản 21 Khu phố', desc: 'Toàn phường có 21 khu phố đoàn kết, đồng lòng xây dựng đô thị văn minh, an toàn và nghĩa tình.', image: 'https://images.unsplash.com/photo-1517732306149-e8f829eb588a?auto=format&fit=crop&w=800&q=80' }
    ],
    heritage: [
      { id: 'her-1', title: 'Địa chỉ đỏ giáo dục truyền thống', desc: 'Các di tích lịch sử cách mạng và điểm đến tâm linh, sinh hoạt chính trị cho thế hệ trẻ.', image: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=800&q=80' }
    ],
    exhibition: [
      { id: 'ex-1', title: 'Triển lãm chuyên đề "Tự hào truyền thống Mặt trận"', desc: 'Không gian trưng bày các ấn phẩm, tư liệu và hình ảnh hoạt động nổi bật của các tổ chức thành viên.', image: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=800&q=80' }
    ]
  };

  if (!isInSpace) {
    return (
      <div className="relative min-h-screen">
        {/* Back to Portal Top Bar */}
        <div className="absolute top-4 left-4 z-50">
          <button
            onClick={onBackToPortal}
            className="px-4 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-2 border border-slate-700 shadow-lg backdrop-blur-md cursor-pointer transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay về Cổng thông tin</span>
          </button>
        </div>

        <CulturalSpace3DLanding
          onEnter3D={() => setIsInSpace(true)}
          onOpenMap={onOpenMap}
        />
      </div>
    );
  }

  return (
    <div className="relative w-screen h-screen bg-slate-950 text-white overflow-hidden flex flex-col font-sans select-none">
      {/* Top Header Controls */}
      <div className="absolute top-0 inset-x-0 z-40 bg-gradient-to-b from-slate-950/90 via-slate-950/50 to-transparent p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsInSpace(false)}
            className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-2 border border-slate-700 backdrop-blur-md cursor-pointer transition-all shadow-md"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Thoát Không Gian 3D</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800">
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
            <span className="text-xs font-black text-amber-300">Không Gian Văn Hóa Số 3D • Phường Chánh Hiệp</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenMap}
            className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <MapPin className="w-4 h-4" />
            <span className="hidden md:inline">Bản Đồ Số</span>
          </button>

          <button
            onClick={() => setIsAudioMuted(!isAudioMuted)}
            className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white border border-slate-700 backdrop-blur-md cursor-pointer"
            title={isAudioMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>
      </div>

      {/* 3D Simulation Viewport (Babylon.js Interactive Canvas Container) */}
      <div className="relative flex-1 w-full h-full bg-gradient-to-b from-slate-900 via-indigo-950/40 to-slate-950 flex items-center justify-center overflow-hidden">
        {/* Simulated 3D Environment Background with Room Details */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            key={activeRoom}
            className="max-w-xl mx-auto space-y-4 bg-slate-900/40 backdrop-blur-md p-8 rounded-3xl border border-white/10 shadow-2xl pointer-events-auto"
          >
            <div className="inline-block bg-amber-500/20 text-amber-300 font-black text-[10px] px-3 py-1 rounded-full uppercase tracking-widest border border-amber-500/30">
              Khu vực hiện tại
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              {roomsList.find(r => r.id === activeRoom)?.name}
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Sử dụng chuột xoay góc nhìn hoặc chọn hiện vật trưng bày bên dưới để khám phá chi tiết tư liệu lịch sử, hình ảnh và câu chuyện văn hóa.
            </p>

            {/* Exhibits Grid in Current Room */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 text-left">
              {(sampleExhibits[activeRoom] || []).map((ex) => (
                <div
                  key={ex.id}
                  onClick={() => setSelectedExhibit(ex)}
                  className="bg-slate-800/80 hover:bg-slate-750 border border-slate-700/80 p-3 rounded-2xl cursor-pointer transition-all hover:border-amber-400/60 shadow-md group flex items-center gap-3"
                >
                  <img src={ex.image} alt={ex.title} className="w-12 h-12 rounded-xl object-cover shrink-0 border border-white/20" />
                  <div className="min-w-0 flex-1">
                    <h5 className="text-xs font-bold text-white truncate group-hover:text-amber-300 transition-colors">{ex.title}</h5>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5">{ex.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Ambient Grid overlay for 3D depth */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />
      </div>

      {/* Bottom Room Navigation Bar */}
      <div className="absolute bottom-4 inset-x-4 z-40 max-w-4xl mx-auto bg-slate-900/90 backdrop-blur-md border border-slate-800 p-2 rounded-2xl shadow-2xl flex items-center justify-center gap-1.5 overflow-x-auto">
        {roomsList.map((room) => (
          <button
            key={room.id}
            onClick={() => setActiveRoom(room.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeRoom === room.id
                ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            {room.name}
          </button>
        ))}
      </div>

      {/* Exhibit Detail Modal */}
      {selectedExhibit && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative"
          >
            <button
              onClick={() => setSelectedExhibit(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              ✕
            </button>

            <img src={selectedExhibit.image} alt={selectedExhibit.title} className="w-full h-56 object-cover rounded-2xl border border-slate-700" />

            <div className="space-y-2">
              <h3 className="text-lg font-black text-amber-300">{selectedExhibit.title}</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{selectedExhibit.desc}</p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedExhibit(null)}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs cursor-pointer shadow-md"
              >
                Đóng
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
