import React, { useState } from 'react';
import { Sparkles, Plus, Image, FileText, FolderPlus, Settings, CheckCircle2, Clock, Trash2, Edit3, Eye } from 'lucide-react';

export const CulturalSpaceAdminView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'exhibits' | 'rooms' | 'media' | 'settings'>('exhibits');
  const [exhibits, setExhibits] = useState([
    { id: 'ex-1', title: 'Cổng chính Văn phòng MTTQ Phường Chánh Hiệp', category: 'Sảnh Trung Tâm', status: 'PUBLISHED', date: '2026-09-01' },
    { id: 'ex-2', title: 'Dòng thời gian 60 năm hình thành và phát triển', category: 'Lịch Sử Địa Phương', status: 'PUBLISHED', date: '2026-09-02' },
    { id: 'ex-3', title: 'Mô hình tự quản 21 Khu phố đoàn kết', category: '21 Khu Phố', status: 'DRAFT', date: '2026-09-03' },
  ]);

  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newCategory, setNewCategory] = useState<string>('Sảnh Trung Tâm');

  const handleAddExhibit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;
    setExhibits([
      { id: `ex-${Date.now()}`, title: newTitle, category: newCategory, status: 'DRAFT', date: new Date().toISOString().split('T')[0] },
      ...exhibits
    ]);
    setNewTitle('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-sky-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-amber-300 tracking-wider uppercase border border-white/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            QUẢN TRỊ NỘI DUNG 3D
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white">Không Gian Văn Hóa Số Chánh Hiệp 3D</h1>
          <p className="text-xs sm:text-sm text-blue-100 max-w-xl">
            Quản lý toàn bộ hiện vật, phòng trưng bày, hình ảnh, tài liệu và vị trí hiển thị trực quan không cần can thiệp mã nguồn.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg cursor-pointer transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Hiện Vật / Tư Liệu</span>
        </button>
      </div>

      {/* Navigation Subtabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('exhibits')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'exhibits' ? 'bg-blue-600 text-white shadow-xs font-black' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Danh Sách Hiện Vật ({exhibits.length})
        </button>
        <button
          onClick={() => setActiveSubTab('rooms')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'rooms' ? 'bg-blue-600 text-white shadow-xs font-black' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Phòng Trưng Bày (6 Phòng)
        </button>
        <button
          onClick={() => setActiveSubTab('media')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'media' ? 'bg-blue-600 text-white shadow-xs font-black' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Thư Viện Ảnh &amp; Media
        </button>
        <button
          onClick={() => setActiveSubTab('settings')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'settings' ? 'bg-blue-600 text-white shadow-xs font-black' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Cài Đặt Hệ Thống
        </button>
      </div>

      {/* Main Tab Content */}
      {activeSubTab === 'exhibits' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 uppercase">Danh Sách Hiện Vật Trưng Bày 3D</h3>
            <span className="text-xs font-bold text-slate-500">Cập nhật động trực tuyến</span>
          </div>

          <div className="divide-y divide-slate-100">
            {exhibits.map((item) => (
              <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-md ${
                      item.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {item.status}
                    </span>
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md">{item.category}</span>
                  </div>
                  <h4 className="text-sm sm:text-base font-black text-slate-900">{item.title}</h4>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {item.date}</span>
                    <span>Mã ID: {item.id}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                  <button className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer" title="Xem trước">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors cursor-pointer" title="Chỉnh sửa">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setExhibits(exhibits.filter(e => e.id !== item.id))}
                    className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                    title="Xóa"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSubTab === 'rooms' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {['Sảnh Trung Tâm', 'Lịch Sử Địa Phương', 'MTTQ & Đại Đoàn Kết', '21 Khu Phố', 'Địa Chỉ Đỏ & Di Sản', 'Triển Lãm Chuyên Đề'].map((roomName, idx) => (
            <div key={idx} className="bg-white rounded-3xl border border-slate-200 p-6 space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-black flex items-center justify-center text-sm shadow-md">
                0{idx + 1}
              </div>
              <h4 className="text-base font-black text-slate-900">{roomName}</h4>
              <p className="text-xs text-slate-500">Khu vực trưng bày tiêu chuẩn trong mô hình 3D bảo tàng số.</p>
              <div className="pt-2 flex justify-end">
                <button className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer">
                  Cấu Hình Vị Trí Slot
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeSubTab === 'media' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <Image className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-black text-slate-900">Thư Viện Media Tập Trung</h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            Kéo thả hoặc tải lên hình ảnh, âm thanh thuyết minh, video hoặc mô hình 3D (.glb) để phục vụ không gian triển lãm ảo.
          </p>
          <button className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-md cursor-pointer inline-flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span>Tải Lên Media Mới</span>
          </button>
        </div>
      )}

      {activeSubTab === 'settings' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs max-w-xl">
          <h3 className="text-sm font-black text-slate-900 uppercase">Cấu Hình Không Gian 3D</h3>
          <div className="space-y-3 text-xs">
            <label className="block space-y-1 font-bold text-slate-700">
              Tiêu đề Không gian Văn hóa 3D
              <input type="text" defaultValue="Không Gian Văn Hóa Số Chánh Hiệp 3D" className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 mt-1 font-normal text-slate-900" />
            </label>
            <label className="block space-y-1 font-bold text-slate-700">
              Trạng thái hoạt động
              <select className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 mt-1 font-normal text-slate-900">
                <option value="active">Đang mở cửa công khai</option>
                <option value="maintenance">Đang bảo trì / Nâng cấp</option>
              </select>
            </label>
            <button className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold cursor-pointer shadow-md">
              Lưu Cấu Hình
            </button>
          </div>
        </div>
      )}

      {/* Add Exhibit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleAddExhibit} className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">Thêm Hiện Vật Trưng Bày 3D</h3>
              <button type="button" onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 text-sm font-bold">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-extrabold text-slate-800">Tiêu đề hiện vật / tư liệu <span className="text-rose-600">*</span></label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ví dụ: Huân chương kháng chiến hạng Nhất..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="font-extrabold text-slate-800">Phòng / Khu vực trưng bày</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-900"
                >
                  <option value="Sảnh Trung Tâm">Sảnh Trung Tâm</option>
                  <option value="Lịch Sử Địa Phương">Lịch Sử Địa Phương</option>
                  <option value="MTTQ & Đại Đoàn Kết">MTTQ &amp; Đại Đoàn Kết</option>
                  <option value="21 Khu Phố">21 Khu Phố</option>
                  <option value="Địa Chỉ Đỏ & Di Sản">Địa Chỉ Đỏ &amp; Di Sản</option>
                  <option value="Triển Lãm Chuyên Đề">Triển Lãm Chuyên Đề</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs cursor-pointer shadow-md"
              >
                Lưu &amp; Thêm Mới
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
