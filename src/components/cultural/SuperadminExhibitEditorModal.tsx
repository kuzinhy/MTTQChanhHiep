import React, { useState } from 'react';
import {
  X,
  Save,
  Trash2,
  Plus,
  Edit3,
  ShieldCheck,
  Image as ImageIcon,
  BookOpen,
  Volume2,
  MapPin,
  Sparkles,
  Layers,
  HelpCircle
} from 'lucide-react';
import { ExhibitItem, ExhibitPart } from '../../data/hcmCulturalData';

interface SuperadminExhibitEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  exhibit: ExhibitItem | null;
  onSave: (updatedExhibit: ExhibitItem) => void;
  onDelete?: (exhibitId: string) => void;
}

export const SuperadminExhibitEditorModal: React.FC<SuperadminExhibitEditorModalProps> = ({
  isOpen,
  onClose,
  exhibit,
  onSave,
  onDelete,
}) => {
  if (!isOpen || !exhibit) return null;

  const [activeTab, setActiveTab] = useState<'general' | 'content' | 'parts'>('general');
  const [formData, setFormData] = useState<ExhibitItem>({ ...exhibit });
  const [editingPartIndex, setEditingPartIndex] = useState<number | null>(null);
  const [tempDetailInput, setTempDetailInput] = useState('');

  const handleChange = (field: keyof ExhibitItem, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddDetail = () => {
    if (!tempDetailInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      details: [...prev.details, tempDetailInput.trim()],
    }));
    setTempDetailInput('');
  };

  const handleRemoveDetail = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      details: prev.details.filter((_, i) => i !== idx),
    }));
  };

  const handleAddPart = () => {
    const newPart: ExhibitPart = {
      id: `part-${Date.now()}`,
      name: 'Cấu phần mới ' + (formData.parts.length + 1),
      type: 'di_tich',
      typeLabel: 'Di tích & Hiện vật',
      xPercent: 50,
      yPercent: 50,
      shortSummary: 'Tóm tắt đặc điểm cấu phần số hóa...',
      significance: 'Ý nghĩa lịch sử và giáo dục truyền thống...',
      material: 'Chất liệu tiêu chuẩn',
      dimensions: 'Kích thước tiêu chuẩn',
      historicalNote: 'Tư liệu lịch sử liên quan...',
    };

    setFormData((prev) => ({
      ...prev,
      parts: [...prev.parts, newPart],
    }));
    setEditingPartIndex(formData.parts.length);
  };

  const handleUpdatePart = (index: number, field: keyof ExhibitPart, value: any) => {
    setFormData((prev) => {
      const updatedParts = [...prev.parts];
      updatedParts[index] = { ...updatedParts[index], [field]: value };
      return { ...prev, parts: updatedParts };
    });
  };

  const handleRemovePart = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      parts: prev.parts.filter((_, i) => i !== index),
    }));
    if (editingPartIndex === index) {
      setEditingPartIndex(null);
    } else if (editingPartIndex !== null && editingPartIndex > index) {
      setEditingPartIndex(editingPartIndex - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Vui lòng nhập tên hiện vật!');
      return;
    }
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl max-h-[92vh] rounded-2xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden text-slate-800">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-50 via-amber-50 to-white px-4 py-3 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 break-words">
                  Chỉnh Sửa Trực Tiếp Hiện Vật
                </h3>
                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-300">
                  Superadmin
                </span>
              </div>
              <p className="text-[11px] text-slate-500 break-words">
                Dữ liệu sẽ được lưu trực tiếp vào bộ nhớ hệ thống ngay khi bạn bấm Lưu
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Đóng cửa sổ"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 px-4 py-2 border-b border-slate-100 bg-slate-50/80 shrink-0 overflow-x-auto text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
              activeTab === 'general'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Thông Tin Cơ Bản
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('content')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
              activeTab === 'content'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Lời Dạy & Thuyết Minh
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('parts')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
              activeTab === 'parts'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Cấu Phần & Hotspots ({formData.parts.length})
          </button>
        </div>

        {/* Tab Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {/* TAB 1: THÔNG TIN CƠ BẢN */}
          {activeTab === 'general' && (
            <div className="space-y-3.5">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Tiêu đề hiện vật / Di tích <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all text-xs"
                  placeholder="Nhập tên hiện vật trang trọng..."
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Phụ đề & Ý nghĩa tóm tắt</label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => handleChange('subtitle', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all text-xs"
                  placeholder="Ví dụ: Bảo vật Quốc gia - Mốc son khai sinh non sông..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phân loại</label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all text-xs"
                  >
                    <option value="Hiện vật & Di tích">Hiện vật & Di tích</option>
                    <option value="Tư liệu lịch sử">Tư liệu lịch sử</option>
                    <option value="Tủ sách Bác Hồ">Tủ sách Bác Hồ</option>
                    <option value="Ảnh tư liệu">Ảnh tư liệu</option>
                    <option value="Mô hình 3D">Mô hình 3D</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Năm lịch sử / Niên đại</label>
                  <input
                    type="text"
                    value={formData.year}
                    onChange={(e) => handleChange('year', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all text-xs"
                    placeholder="Ví dụ: 1945, 1969, 1911 - 1941..."
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Đường dẫn Hình ảnh mô hình / tư liệu
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => handleChange('imageUrl', e.target.value)}
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all text-xs"
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>
                {formData.imageUrl && (
                  <div className="mt-2 relative rounded-lg border border-slate-200 overflow-hidden h-28 bg-slate-100 flex items-center justify-center">
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <span className="absolute bottom-1 right-2 text-[10px] bg-black/60 text-white px-2 py-0.5 rounded">
                      Xem trước ảnh mô hình
                    </span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Tọa độ 3D X (-180 đến 180)
                  </label>
                  <input
                    type="number"
                    value={formData.x}
                    onChange={(e) => handleChange('x', Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Tọa độ 3D Z (-180 đến 180)
                  </label>
                  <input
                    type="number"
                    value={formData.z}
                    onChange={(e) => handleChange('z', Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LỜI DẠY BÁC & NỘI DUNG */}
          {activeTab === 'content' && (
            <div className="space-y-3.5">
              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <span className="text-red-600">★</span> Lời dạy của Bác / Câu nói lịch sử bất hủ
                </label>
                <textarea
                  rows={2}
                  value={formData.quote || ''}
                  onChange={(e) => handleChange('quote', e.target.value)}
                  className="w-full px-3 py-2 bg-red-50/50 border border-red-200 rounded-lg text-red-950 font-serif italic focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all text-xs"
                  placeholder="“Không có gì quý hơn độc lập tự do...”"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mô tả tổng quan & Ý nghĩa</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all text-xs leading-relaxed"
                  placeholder="Mô tả chi tiết hiện vật và bối cảnh lịch sử..."
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-amber-600" />
                  Nội dung đọc thuyết minh Audio (Voice Narration)
                </label>
                <textarea
                  rows={2}
                  value={formData.audioText}
                  onChange={(e) => handleChange('audioText', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all text-xs leading-relaxed"
                  placeholder="Văn bản tự động đọc khi khách tham quan bấm nút Nghe thuyết minh..."
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  Gắn kết thực tiễn với Phường Chánh Hiệp
                </label>
                <input
                  type="text"
                  value={formData.localConnection || ''}
                  onChange={(e) => handleChange('localConnection', e.target.value)}
                  className="w-full px-3 py-2 bg-blue-50/50 border border-blue-200 rounded-lg text-blue-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all text-xs"
                  placeholder="Trưng bày tại Nhà văn hóa / Liên kết với 21 khu phố Chánh Hiệp..."
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Các điểm giá trị cốt lõi</label>
                <div className="space-y-1.5 mb-2">
                  {formData.details.map((detail, idx) => (
                    <div
                      key={idx}
                      className="flex items-start justify-between gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg"
                    >
                      <span className="text-[11px] text-slate-700 leading-snug break-words">
                        • {detail}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveDetail(idx)}
                        className="text-red-500 hover:text-red-700 p-1 shrink-0 cursor-pointer"
                        title="Xóa ý này"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tempDetailInput}
                    onChange={(e) => setTempDetailInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddDetail();
                      }
                    }}
                    className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white text-xs"
                    placeholder="Thêm điểm giá trị mới rồi bấm Thêm..."
                  />
                  <button
                    type="button"
                    onClick={handleAddDetail}
                    className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-lg text-xs shrink-0 cursor-pointer"
                  >
                    Thêm ý
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CẤU PHẦN & HOTSPOTS */}
          {activeTab === 'parts' && (
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-800 text-xs">
                    Danh sách các cấu phần di tích / sản phẩm số hóa ({formData.parts.length})
                  </h4>
                  <p className="text-[10px] text-slate-500">
                    Mỗi cấu phần tương ứng với 1 điểm hotspot ghim trên mô hình để người xem bấm xem
                    chi tiết
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddPart}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg text-xs flex items-center gap-1 shrink-0 cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Thêm Cấu Phần
                </button>
              </div>

              {/* Parts list */}
              <div className="space-y-2">
                {formData.parts.map((part, pIdx) => {
                  const isEditing = editingPartIndex === pIdx;
                  return (
                    <div
                      key={part.id || pIdx}
                      className={`border rounded-xl transition-all ${
                        isEditing
                          ? 'border-amber-400 bg-amber-50/40 shadow-sm'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div
                        className="p-3 flex items-center justify-between gap-2 cursor-pointer"
                        onClick={() => setEditingPartIndex(isEditing ? null : pIdx)}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="w-6 h-6 rounded-md bg-red-600 text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                            {pIdx + 1}
                          </span>
                          <div className="min-w-0">
                            <h5 className="font-bold text-slate-900 text-xs break-words">
                              {part.name}
                            </h5>
                            <div className="flex items-center gap-2 text-[10px] text-slate-500">
                              <span className="text-amber-700 font-semibold">{part.typeLabel}</span>
                              <span>•</span>
                              <span>
                                Tọa độ ghim: X: {part.xPercent}% | Y: {part.yPercent}%
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingPartIndex(isEditing ? null : pIdx);
                            }}
                            className="p-1.5 text-slate-500 hover:text-amber-700 hover:bg-slate-100 rounded-md cursor-pointer"
                            title={isEditing ? 'Thu gọn' : 'Chỉnh sửa'}
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm(`Bạn có chắc muốn xóa cấu phần "${part.name}"?`)) {
                                handleRemovePart(pIdx);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md cursor-pointer"
                            title="Xóa cấu phần"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Editing Part Form Drawer */}
                      {isEditing && (
                        <div className="px-3 pb-3 pt-1 border-t border-amber-200/60 space-y-2.5 text-xs">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div>
                              <label className="block font-bold text-slate-700 mb-0.5 text-[11px]">
                                Tên cấu phần
                              </label>
                              <input
                                type="text"
                                value={part.name}
                                onChange={(e) => handleUpdatePart(pIdx, 'name', e.target.value)}
                                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-xs font-bold"
                              />
                            </div>
                            <div>
                              <label className="block font-bold text-slate-700 mb-0.5 text-[11px]">
                                Nhãn phân loại
                              </label>
                              <input
                                type="text"
                                value={part.typeLabel}
                                onChange={(e) => handleUpdatePart(pIdx, 'typeLabel', e.target.value)}
                                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-xs"
                                placeholder="Bảo vật Quốc gia, Kỷ vật..."
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block font-bold text-slate-700 mb-0.5 text-[11px]">
                                Tọa độ X trên ảnh (10 - 90%)
                              </label>
                              <input
                                type="number"
                                min={10}
                                max={90}
                                value={part.xPercent}
                                onChange={(e) =>
                                  handleUpdatePart(pIdx, 'xPercent', Number(e.target.value))
                                }
                                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-xs"
                              />
                            </div>
                            <div>
                              <label className="block font-bold text-slate-700 mb-0.5 text-[11px]">
                                Tọa độ Y trên ảnh (10 - 90%)
                              </label>
                              <input
                                type="number"
                                min={10}
                                max={90}
                                value={part.yPercent}
                                onChange={(e) =>
                                  handleUpdatePart(pIdx, 'yPercent', Number(e.target.value))
                                }
                                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-xs"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block font-bold text-slate-700 mb-0.5 text-[11px]">
                              Tóm tắt đặc điểm cấu phần
                            </label>
                            <input
                              type="text"
                              value={part.shortSummary}
                              onChange={(e) =>
                                handleUpdatePart(pIdx, 'shortSummary', e.target.value)
                              }
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-xs"
                              placeholder="Mô tả ngắn gọn khi hover chuột vào hotspot..."
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div>
                              <label className="block font-bold text-slate-700 mb-0.5 text-[11px]">
                                Chất liệu chế tác
                              </label>
                              <input
                                type="text"
                                value={part.material || ''}
                                onChange={(e) => handleUpdatePart(pIdx, 'material', e.target.value)}
                                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-xs"
                                placeholder="Ví dụ: Đồng đúc nguyên khối, gỗ sồi..."
                              />
                            </div>
                            <div>
                              <label className="block font-bold text-slate-700 mb-0.5 text-[11px]">
                                Kích thước / Quy cách
                              </label>
                              <input
                                type="text"
                                value={part.dimensions || ''}
                                onChange={(e) =>
                                  handleUpdatePart(pIdx, 'dimensions', e.target.value)
                                }
                                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-xs"
                                placeholder="Ví dụ: Tỷ lệ 1:1, cao 185cm..."
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block font-bold text-slate-700 mb-0.5 text-[11px]">
                              Ý nghĩa lịch sử & Tư tưởng
                            </label>
                            <textarea
                              rows={2}
                              value={part.significance}
                              onChange={(e) =>
                                handleUpdatePart(pIdx, 'significance', e.target.value)
                              }
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-xs leading-relaxed"
                              placeholder="Ý nghĩa biểu tượng thiêng liêng..."
                            />
                          </div>

                          <div>
                            <label className="block font-bold text-slate-700 mb-0.5 text-[11px]">
                              Ghi chú tư liệu / Hoàn cảnh lịch sử
                            </label>
                            <input
                              type="text"
                              value={part.historicalNote || ''}
                              onChange={(e) =>
                                handleUpdatePart(pIdx, 'historicalNote', e.target.value)
                              }
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-xs"
                              placeholder="Tư liệu gốc, bảo tàng lưu giữ..."
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action Buttons Footer */}
          <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 shrink-0">
            {onDelete ? (
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Bạn có chắc muốn xóa hiện vật "${formData.title}" khỏi không gian văn hóa?`)) {
                    onDelete(formData.id);
                    onClose();
                  }
                }}
                className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl border border-rose-200 text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Xóa Hiện Vật
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl border border-slate-200 text-xs cursor-pointer transition-colors"
              >
                Hủy Bỏ
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-xl text-xs flex items-center gap-1.5 shadow-md hover:shadow-lg cursor-pointer transition-all"
              >
                <Save className="w-3.5 h-3.5" />
                Lưu Trực Tiếp
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
