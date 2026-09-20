import React, { useState } from 'react';
import { 
  FileCheck, 
  Plus, 
  Edit3, 
  Trash2, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Sparkles, 
  Layers, 
  Award,
  ChevronRight,
  Info
} from 'lucide-react';
import { 
  CriterionItem, 
  INITIAL_CRITERIA_LIST, 
  loadStoredCriteria, 
  saveStoredCriteria,
  INITIAL_CATEGORIES,
  EmulationCategory
} from '../youthUnionData';

interface Props {
  onNotify: (msg: string) => void;
}

export const CriteriaConfigTab: React.FC<Props> = ({ onNotify }) => {
  const [criteria, setCriteria] = useState<CriterionItem[]>(() => loadStoredCriteria());
  const [activeCategory, setActiveCategory] = useState<'I' | 'II' | 'III' | 'IV' | 'ALL'>('ALL');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCriterion, setEditingCriterion] = useState<CriterionItem | null>(null);

  // Form states
  const [formCode, setFormCode] = useState('TC 1.4');
  const [formCategory, setFormCategory] = useState<'I' | 'II' | 'III' | 'IV'>('I');
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formMaxPoints, setFormMaxPoints] = useState<number>(10);
  const [formRequiredEvidence, setFormRequiredEvidence] = useState(true);

  // Points calculation
  const totalPoints = criteria.reduce((sum, c) => sum + (c.maxPoints || 0), 0);
  const catPoints = {
    I: criteria.filter(c => c.category === 'I').reduce((s, c) => s + c.maxPoints, 0),
    II: criteria.filter(c => c.category === 'II').reduce((s, c) => s + c.maxPoints, 0),
    III: criteria.filter(c => c.category === 'III').reduce((s, c) => s + c.maxPoints, 0),
    IV: criteria.filter(c => c.category === 'IV').reduce((s, c) => s + c.maxPoints, 0),
  };

  const handleOpenAddModal = (cat?: 'I' | 'II' | 'III' | 'IV') => {
    setEditingCriterion(null);
    const category = cat || (activeCategory === 'ALL' ? 'I' : activeCategory);
    const countInCat = criteria.filter(c => c.category === category).length;
    setFormCategory(category);
    setFormCode(`TC ${category === 'I' ? '1' : category === 'II' ? '2' : category === 'III' ? '3' : '4'}.${countInCat + 1}`);
    setFormTitle('');
    setFormDescription('');
    setFormMaxPoints(10);
    setFormRequiredEvidence(true);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: CriterionItem) => {
    setEditingCriterion(item);
    setFormCode(item.code);
    setFormCategory(item.category);
    setFormTitle(item.title);
    setFormDescription(item.description);
    setFormMaxPoints(item.maxPoints);
    setFormRequiredEvidence(item.requiredEvidence ?? true);
    setIsModalOpen(true);
  };

  const handleSaveCriterion = () => {
    if (!formTitle.trim()) {
      alert('Vui lòng nhập Tên tiêu chí!');
      return;
    }

    if (editingCriterion) {
      const updated = criteria.map(c => {
        if (c.id === editingCriterion.id) {
          return {
            ...c,
            code: formCode.trim(),
            category: formCategory,
            title: formTitle.trim(),
            description: formDescription.trim(),
            maxPoints: Math.max(1, formMaxPoints),
            requiredEvidence: formRequiredEvidence
          };
        }
        return c;
      });
      setCriteria(updated);
      saveStoredCriteria(updated);
      onNotify(`Đã cập nhật tiêu chí "${formCode}"!`);
    } else {
      const newId = 'tc_' + Date.now();
      const newItem: CriterionItem = {
        id: newId,
        code: formCode.trim(),
        category: formCategory,
        title: formTitle.trim(),
        description: formDescription.trim(),
        maxPoints: Math.max(1, formMaxPoints),
        requiredEvidence: formRequiredEvidence
      };
      const updated = [...criteria, newItem];
      setCriteria(updated);
      saveStoredCriteria(updated);
      onNotify(`Đã thêm mới tiêu chí "${formCode}" thành công!`);
    }

    setIsModalOpen(false);
  };

  const handleDeleteCriterion = (id: string, code: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa tiêu chí "${code}"?`)) {
      const updated = criteria.filter(c => c.id !== id);
      setCriteria(updated);
      saveStoredCriteria(updated);
      onNotify(`Đã xóa tiêu chí "${code}"!`);
    }
  };

  const handleResetDefault = () => {
    if (window.confirm('Khôi phục lại toàn bộ bộ tiêu chí chuẩn Đoàn Phường Chánh Hiệp (10 tiêu chí - 100 điểm)?')) {
      setCriteria(INITIAL_CRITERIA_LIST);
      saveStoredCriteria(INITIAL_CRITERIA_LIST);
      onNotify('Đã khôi phục bộ tiêu chí thi đua chuẩn!');
    }
  };

  const filteredCriteria = activeCategory === 'ALL' 
    ? criteria 
    : criteria.filter(c => c.category === activeCategory);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-black rounded-md uppercase">
                BỘ TIÊU CHÍ ĐÁNH GIÁ
              </span>
              <span className="text-xs text-slate-400 font-bold">•</span>
              <span className="text-xs text-slate-500 font-semibold">Năm công tác 2026</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Cài Đặt Nội Dung & Thang Điểm Thi Đua Chi Đoàn
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">
              Cấu hình các tiêu chí, thang điểm tối đa, căn cứ hồ sơ minh chứng áp dụng cho toàn bộ 16 Chi đoàn trực thuộc Phường Chánh Hiệp. Thay đổi sẽ cập nhật ngay lập tức vào Workspace Chi đoàn.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={handleResetDefault}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Khôi phục chuẩn</span>
            </button>
            <button
              onClick={() => handleOpenAddModal()}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-md shadow-blue-500/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Tiêu Chí Mới</span>
            </button>
          </div>
        </div>

        {/* 4 Category Score Blocks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div 
            onClick={() => setActiveCategory('I')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              activeCategory === 'I' 
                ? 'bg-blue-50/90 border-blue-300 ring-2 ring-blue-500/20' 
                : 'bg-slate-50/80 border-slate-200/70 hover:bg-slate-100/80'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 text-[10px] font-black">
                NHÓM I
              </span>
              <span className="text-xs font-black text-blue-700">{catPoints.I} đ</span>
            </div>
            <p className="text-xs font-bold text-slate-900 mt-2 line-clamp-1">Công tác Tuyên giáo</p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {criteria.filter(c => c.category === 'I').length} tiêu chí
            </p>
          </div>

          <div 
            onClick={() => setActiveCategory('II')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              activeCategory === 'II' 
                ? 'bg-emerald-50/90 border-emerald-300 ring-2 ring-emerald-500/20' 
                : 'bg-slate-50/80 border-slate-200/70 hover:bg-slate-100/80'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 text-[10px] font-black">
                NHÓM II
              </span>
              <span className="text-xs font-black text-emerald-700">{catPoints.II} đ</span>
            </div>
            <p className="text-xs font-bold text-slate-900 mt-2 line-clamp-1">Phong trào Tình nguyện</p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {criteria.filter(c => c.category === 'II').length} tiêu chí
            </p>
          </div>

          <div 
            onClick={() => setActiveCategory('III')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              activeCategory === 'III' 
                ? 'bg-amber-50/90 border-amber-300 ring-2 ring-amber-500/20' 
                : 'bg-slate-50/80 border-slate-200/70 hover:bg-slate-100/80'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-700 text-[10px] font-black">
                NHÓM III
              </span>
              <span className="text-xs font-black text-amber-700">{catPoints.III} đ</span>
            </div>
            <p className="text-xs font-bold text-slate-900 mt-2 line-clamp-1">Xây dựng Đoàn - Hội</p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {criteria.filter(c => c.category === 'III').length} tiêu chí
            </p>
          </div>

          <div 
            onClick={() => setActiveCategory('IV')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              activeCategory === 'IV' 
                ? 'bg-purple-50/90 border-purple-300 ring-2 ring-purple-500/20' 
                : 'bg-slate-50/80 border-slate-200/70 hover:bg-slate-100/80'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-700 text-[10px] font-black">
                NHÓM IV
              </span>
              <span className="text-xs font-black text-purple-700">{catPoints.IV} đ</span>
            </div>
            <p className="text-xs font-bold text-slate-900 mt-2 line-clamp-1">Chuyển đổi số & Sáng kiến</p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {criteria.filter(c => c.category === 'IV').length} tiêu chí
            </p>
          </div>
        </div>

        {/* Total Points Bar */}
        <div className="mt-5 p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="text-xs font-bold text-slate-700">
              Tổng thang điểm bộ tiêu chí hiện tại:
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base font-black text-blue-600">{totalPoints} / 100 điểm</span>
            {totalPoints === 100 ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-700">
                Chuẩn 100đ
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-700">
                Lệch chuẩn ({totalPoints > 100 ? `+${totalPoints - 100}đ` : `-${100 - totalPoints}đ`})
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'ALL', label: 'Tất cả tiêu chí' },
            { id: 'I', label: 'Nhóm I (Tuyên giáo)' },
            { id: 'II', label: 'Nhóm II (Phong trào)' },
            { id: 'III', label: 'Nhóm III (Xây dựng Đoàn)' },
            { id: 'IV', label: 'Nhóm IV (Chuyển đổi số)' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeCategory === tab.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <p className="text-xs font-bold text-slate-500">
          Hiển thị {filteredCriteria.length} tiêu chí
        </p>
      </div>

      {/* Criteria Cards Grid */}
      <div className="space-y-4">
        {filteredCriteria.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:border-blue-200 transition-all flex flex-col md:flex-row md:items-start justify-between gap-4"
          >
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-black rounded-lg border border-blue-200/60 font-mono">
                  {item.code}
                </span>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-black ${
                  item.category === 'I' ? 'bg-blue-100 text-blue-800' :
                  item.category === 'II' ? 'bg-emerald-100 text-emerald-800' :
                  item.category === 'III' ? 'bg-amber-100 text-amber-800' :
                  'bg-purple-100 text-purple-800'
                }`}>
                  Nhóm {item.category}
                </span>
                <span className="text-xs font-black text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
                  Tối đa: {item.maxPoints} điểm
                </span>
                {item.requiredEvidence && (
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                    Bắt buộc minh chứng
                  </span>
                )}
              </div>

              <h3 className="text-base font-black text-slate-900">
                {item.title}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
              <button
                onClick={() => handleOpenEditModal(item)}
                className="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-700 text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-200 hover:border-blue-200 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Chỉnh sửa</span>
              </button>
              <button
                onClick={() => handleDeleteCriterion(item.id, item.code)}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all border border-transparent hover:border-rose-100 cursor-pointer"
                title="Xóa tiêu chí"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add / Edit Criterion */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 animate-scale-up">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-100 text-blue-700 rounded-xl">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    {editingCriterion ? 'Chỉnh Sửa Tiêu Chí Thi Đua' : 'Thêm Tiêu Chí Thi Đua Mới'}
                  </h3>
                  <p className="text-[11px] text-slate-400">Thiết lập nội dung và thang điểm đánh giá Chi đoàn</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 py-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Mã tiêu chí <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    placeholder="VD: TC 1.4"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Thuộc nhóm
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="I">Nhóm I: Tuyên giáo</option>
                    <option value="II">Nhóm II: Phong trào</option>
                    <option value="III">Nhóm III: Xây dựng Đoàn</option>
                    <option value="IV">Nhóm IV: Chuyển đổi số</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Tên tiêu chí thi đua <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="VD: Tổ chức hành trình về nguồn và địa chỉ đỏ..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Hướng dẫn nội dung & Căn cứ minh chứng
                </label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Mô tả cụ thể yêu cầu cần đạt, chỉ tiêu phần trăm hoặc hồ sơ đính kèm..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 items-center">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Thang điểm tối đa (điểm)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={formMaxPoints}
                    onChange={(e) => setFormMaxPoints(parseFloat(e.target.value) || 1)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black text-blue-600 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div className="pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formRequiredEvidence}
                      onChange={(e) => setFormRequiredEvidence(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded-md border-slate-300 focus:ring-blue-500"
                    />
                    <span className="text-xs font-bold text-slate-700">Bắt buộc tệp minh chứng</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold transition-all"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleSaveCriterion}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-md shadow-blue-500/20"
              >
                <Save className="w-4 h-4" />
                <span>{editingCriterion ? 'Lưu Thay Đổi' : 'Tạo Tiêu Chí'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
