import React, { useState } from 'react';
import { Lightbulb, ThumbsUp, Download, Share2, Sparkles, Eye, CheckCircle2, QrCode } from 'lucide-react';
import { QrCodeModal } from './QrCodeModal';

interface InitiativeItem {
  id: string;
  title: string;
  unit: string;
  summary: string;
  impact: string;
  likes: number;
  tags: string[];
  date: string;
}

const INITIATIVE_DATA: InitiativeItem[] = [
  {
    id: '1',
    title: 'Mô hình "Tổ Đoàn Kết Số 4.0" tại 21 Khu phố Phường Chánh Hiệp',
    unit: 'Ủy ban MTTQ & Ban CTMTKP 5',
    summary: 'Ứng dụng nhóm Zalo kết nối liên thông và Bảng tin số khu phố để thông báo lịch sinh hoạt, thu quỹ công khai và tiếp nhận kiến nghị trực tuyến.',
    impact: 'Tiết kiệm 90% chi phí in ấn giấy, 100% hộ dân nhận được thông tin chỉ đạo trong vòng 15 phút.',
    likes: 342,
    tags: ['Chuyển đổi số', 'Dân nguyện', 'Khu phố số'],
    date: '15/08/2026'
  },
  {
    id: '2',
    title: 'Sáng kiến "Góc Xanh Đại Đoàn Kết" - Phân loại rác tại nguồn',
    unit: 'Hội Liên hiệp Phụ nữ & MTTQ Phường',
    summary: 'Xây dựng 21 điểm thu gom rác tái chế lấy kinh phí nuôi heo đất khuyến học cho học sinh nghèo hiếu học tại các khu phố.',
    impact: 'Thu gom hơn 4.2 tấn nhựa tái chế, trao 85 suất học bổng cho học sinh nghèo.',
    likes: 289,
    tags: ['Bảo vệ môi trường', 'An sinh xã hội'],
    date: '02/08/2026'
  },
  {
    id: '3',
    title: 'Mô hình "Camera An ninh Đại đoàn kết" Nhân dân tự quản',
    unit: 'Ban CTMTKP 12 & Công an Phường',
    summary: 'Vận động Nhân dân đóng góp kinh phí lắp đặt 128 mắt camera độ phân giải cao tại các hẻm tự quản.',
    impact: 'Giảm 75% sự vụ mất an ninh trật tự, xử lý nhanh các vụ vi phạm môi trường.',
    likes: 215,
    tags: ['An ninh trật tự', 'Tự quản cộng đồng'],
    date: '20/07/2026'
  }
];

export const InitiativesSection: React.FC = () => {
  const [initiatives, setInitiatives] = useState(INITIATIVE_DATA);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [qrModalItem, setQrModalItem] = useState<{ title: string; url: string } | null>(null);

  const handleLike = (id: string) => {
    const isLiked = likedMap[id];
    setLikedMap((prev) => ({ ...prev, [id]: !isLiked }));
    setInitiatives((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, likes: item.likes + (isLiked ? -1 : 1) } : item
      )
    );
  };

  return (
    <section className="py-10 px-4 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-700 via-indigo-600 to-sky-700 text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-xs">
            <Lightbulb className="w-4 h-4 fill-amber-950" />
            <span>KHO SÁNG KIẾN &amp; MÔ HÌNH HAY</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Mô Hình Nhân Rộng &amp; Sáng Kiến Tác Nghiệp Mặt Trận
          </h2>
          <p className="text-xs text-blue-100 max-w-2xl">
            Tổng hợp các giải pháp, cách làm hay từ 21 Khu phố mang lại hiệu quả thiết thực cho Nhân dân Phường Chánh Hiệp.
          </p>
        </div>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {initiatives.map((item) => {
          const isLiked = likedMap[item.id];
          return (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between p-5 space-y-4 relative group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-black text-blue-800 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                    {item.unit}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">{item.date}</span>
                </div>

                <h3 className="text-sm font-black text-slate-900 group-hover:text-blue-700 transition leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {item.summary}
                </p>

                <div className="p-3 bg-emerald-50/80 rounded-2xl border border-emerald-100 space-y-1">
                  <div className="text-[10px] font-black uppercase text-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Kết quả &amp; Tác động</span>
                  </div>
                  <p className="text-xs font-semibold text-emerald-950 leading-tight">
                    {item.impact}
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="flex flex-wrap gap-1.5">
                  {item.tags.map((tag) => (
                    <span key={tag} className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <button
                    onClick={() => handleLike(item.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                      isLiked 
                        ? 'bg-blue-600 text-white shadow-xs' 
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? 'fill-white' : ''}`} />
                    <span>{item.likes} Hữu ích</span>
                  </button>

                  <button
                    onClick={() => setQrModalItem({ title: item.title, url: window.location.href })}
                    className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition cursor-pointer"
                    title="Mã QR Sáng kiến"
                  >
                    <QrCode className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* QR Modal */}
      {qrModalItem && (
        <QrCodeModal
          isOpen={true}
          onClose={() => setQrModalItem(null)}
          title={qrModalItem.title}
          itemUrl={qrModalItem.url}
          category="Mô hình Hay MTTQ"
        />
      )}
    </section>
  );
};
