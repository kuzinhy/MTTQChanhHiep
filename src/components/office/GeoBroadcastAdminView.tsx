import React, { useState } from 'react';
import { 
  Radio, Send, Bell, MapPin, AlertCircle, CheckCircle2, 
  Users, Sparkles, Filter, Calendar, ShieldCheck 
} from 'lucide-react';
import { OFFICIAL_NEIGHBORHOOD_NAMES } from '../../data/neighborhoodsList';

export const GeoBroadcastAdminView: React.FC<{ onTriggerToast: (title: string, msg?: string) => void }> = ({
  onTriggerToast
}) => {
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<string[]>(['ALL']);
  const [alertType, setAlertType] = useState<'AN_SINH' | 'TIEM_CHUNG' | 'TRIEU_CUONG' | 'HOP_DAN'>('AN_SINH');
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [scheduledTime, setScheduledTime] = useState<string>('NOW');

  // History broadcasts
  const [history, setHistory] = useState([
    {
      id: 'b-1',
      title: 'Thông báo Lịch chi trả Trợ cấp An sinh Xã hội tháng 10/2026',
      target: 'Toàn bộ 21 Khu phố',
      type: 'AN_SINH',
      sentTime: '02/10/2026 09:00',
      recipientCount: 3850
    },
    {
      id: 'b-2',
      title: 'Cảnh báo Triều cường & Mưa lớn tại các tuyến đường trũng',
      target: 'Khu phố 1, Khu phố 4, Khu phố 6',
      type: 'TRIEU_CUONG',
      sentTime: '01/10/2026 16:30',
      recipientCount: 840
    }
  ]);

  const handleToggleNeighborhood = (kp: string) => {
    if (kp === 'ALL') {
      setSelectedNeighborhoods(['ALL']);
      return;
    }
    const currentWithoutAll = selectedNeighborhoods.filter(k => k !== 'ALL');
    if (currentWithoutAll.includes(kp)) {
      const next = currentWithoutAll.filter(k => k !== kp);
      setSelectedNeighborhoods(next.length === 0 ? ['ALL'] : next);
    } else {
      setSelectedNeighborhoods([...currentWithoutAll, kp]);
    }
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    const targetLabel = selectedNeighborhoods.includes('ALL') ? 'Toàn bộ 21 Khu phố' : selectedNeighborhoods.join(', ');
    const newBroadcast = {
      id: `b-${Date.now()}`,
      title,
      target: targetLabel,
      type: alertType,
      sentTime: 'Vừa xong',
      recipientCount: selectedNeighborhoods.includes('ALL') ? 4200 : selectedNeighborhoods.length * 200
    };

    setHistory([newBroadcast, ...history]);
    setTitle('');
    setContent('');
    onTriggerToast('Phát thông báo thành công', `Đã gửi cảnh báo/thông báo đến người dân tại: ${targetLabel}`);
  };

  return (
    <div className="space-y-6 font-sans select-none">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-cyan-50 text-cyan-600 rounded-2xl border border-cyan-100">
            <Radio className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-cyan-100 text-cyan-800 font-mono text-[10px] font-black">
                GEO-TARGETED BROADCAST
              </span>
              <span className="text-xs text-slate-500 font-bold">Hệ thống Phát Thông báo 21 Khu phố</span>
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight mt-0.5">
              Phát Cảnh báo &amp; Thông báo Dân sinh theo Khu phố
            </h2>
          </div>
        </div>

        <span className="text-xs font-bold text-slate-500 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
          Kết nối trực tiếp App Cổng thông tin &amp; Zalo OA
        </span>
      </div>

      {/* Main Broadcast Composer */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
        <h3 className="font-black text-sm text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
          <Bell className="w-4 h-4 text-blue-600" />
          <span>Soạn nội dung phát sóng thông báo mới</span>
        </h3>

        <form onSubmit={handleSendBroadcast} className="space-y-4">
          
          {/* 1. Target Neighborhood Picker */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Chọn Khu phố nhận thông báo (*):
            </label>
            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <button
                type="button"
                onClick={() => handleToggleNeighborhood('ALL')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                  selectedNeighborhoods.includes('ALL')
                    ? 'bg-blue-600 text-white font-black shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                🌍 Toàn bộ 21 Khu phố
              </button>

              {OFFICIAL_NEIGHBORHOOD_NAMES.map(kp => {
                const isSelected = selectedNeighborhoods.includes(kp) || selectedNeighborhoods.includes('ALL');
                return (
                  <button
                    key={kp}
                    type="button"
                    onClick={() => handleToggleNeighborhood(kp)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                      isSelected && !selectedNeighborhoods.includes('ALL')
                        ? 'bg-cyan-600 text-white font-black shadow-xs'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {kp}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Type & Title */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Loại thông báo:</label>
              <select
                value={alertType}
                onChange={(e) => setAlertType(e.target.value as any)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold"
              >
                <option value="AN_SINH">Lịch chi trả an sinh xã hội</option>
                <option value="TIEM_CHUNG">Lịch tiêm chủng / Y tế</option>
                <option value="TRIEU_CUONG">Cảnh báo thời tiết / Triều cường</option>
                <option value="HOP_DAN">Lịch họp dân / Tiếp xúc cử tri</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 block mb-1">Tiêu đề thông báo (*):</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ví dụ: Lịch tiêm phòng mở rộng cho trẻ em tại Trạm Y tế..."
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
              />
            </div>
          </div>

          {/* 3. Content */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Nội dung chi tiết thông báo (*):</label>
            <textarea
              rows={3}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Nhập nội dung hướng dẫn cho người dân..."
              className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900"
            />
          </div>

          <div className="pt-2 flex items-center justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Send className="w-4 h-4" />
              <span>Phát thông báo ngay lập tức</span>
            </button>
          </div>

        </form>
      </div>

      {/* History Log */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="font-black text-sm text-slate-900 pb-2 border-b border-slate-100">
          Nhật ký các thông báo đã phát gần đây
        </h3>

        <div className="space-y-2.5">
          {history.map(h => (
            <div key={h.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="space-y-0.5">
                <span className="font-black text-slate-900 block">{h.title}</span>
                <span className="text-slate-500 block text-[11px]">Phạm vi gửi: <strong>{h.target}</strong> • Lúc: {h.sentTime}</span>
              </div>
              <span className="px-3 py-1 bg-white border border-slate-200 rounded-xl text-[11px] font-bold text-emerald-700 flex items-center gap-1 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Đã phát đến ~{h.recipientCount.toLocaleString()} người dân</span>
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
