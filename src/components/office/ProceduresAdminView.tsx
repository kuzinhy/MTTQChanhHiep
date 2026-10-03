import React, { useState, useEffect } from 'react';
import { ProcedureItem, ProcedureStep, ProcedureDocumentRequirement, ProcedureFormItem, ProcedureCategory } from '../../types/procedure';
import { INITIAL_PROCEDURES } from '../../data/proceduresSeed';
import { 
  ClipboardList, Plus, Edit3, Trash2, ArrowUp, ArrowDown, Check, X, 
  Layers, MapPin, Building2, Clock, FileText, ExternalLink, ShieldCheck, 
  Save, Eye, AlertCircle, RefreshCw, Sparkles
} from 'lucide-react';

interface ProceduresAdminViewProps {
  onTriggerToast: (title: string, message?: string) => void;
}

export const ProceduresAdminView: React.FC<ProceduresAdminViewProps> = ({ onTriggerToast }) => {
  const [procedures, setProcedures] = useState<ProcedureItem[]>(() => {
    try {
      const saved = localStorage.getItem('chanhhiep_procedures_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_PROCEDURES;
  });

  const [selectedProcId, setSelectedProcId] = useState<string>(procedures[0]?.id || '');
  const [isEditingProc, setIsEditingProc] = useState(false);
  const [currentProcEdit, setCurrentProcEdit] = useState<ProcedureItem | null>(null);

  // Sync to localStorage
  const saveToStorage = (updated: ProcedureItem[]) => {
    setProcedures(updated);
    try {
      localStorage.setItem('chanhhiep_procedures_v1', JSON.stringify(updated));
      window.dispatchEvent(new Event('app_storage_synced'));
    } catch (e) {}
  };

  const activeProcedure = procedures.find(p => p.id === selectedProcId) || procedures[0];

  const handleOpenEditProc = (proc?: ProcedureItem) => {
    if (proc) {
      setCurrentProcEdit(JSON.parse(JSON.stringify(proc)));
    } else {
      setCurrentProcEdit({
        id: `proc-${Date.now()}`,
        code: `T-MCD-${Math.floor(Math.random() * 900 + 100)}`,
        name: '',
        aliases: [],
        category: 'Hộ tịch',
        description: '',
        authority: 'UBND Phường Chánh Hiệp',
        locationId: 'loc-mot-cua',
        counter: 'Quầy tiếp nhận Một cửa',
        onlineAvailable: true,
        onlineUrl: 'https://dichvucong.binhduong.gov.vn',
        processingTime: 'Trong ngày làm việc',
        fee: 'Theo quy định pháp luật',
        officialSourceUrl: 'https://dichvucong.gov.vn',
        sourceUpdatedAt: new Date().toISOString().split('T')[0],
        active: true,
        sortOrder: procedures.length + 1,
        version: 'v1.0',
        updatedAt: new Date().toISOString(),
        updatedBy: 'Cán bộ Quản trị',
        steps: [
          {
            id: `s-${Date.now()}-1`,
            procedureId: '',
            stepNumber: 1,
            title: 'Chuẩn bị hồ sơ',
            description: 'Chuẩn bị các thành phần giấy tờ theo quy định.',
            instruction: 'Mang theo CCCD và giấy tờ liên quan.',
            location: 'Tại nhà'
          }
        ],
        documents: [],
        forms: []
      });
    }
    setIsEditingProc(true);
  };

  const handleSaveProc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProcEdit) return;

    const exists = procedures.some(p => p.id === currentProcEdit.id);
    let updated: ProcedureItem[];
    if (exists) {
      updated = procedures.map(p => p.id === currentProcEdit.id ? { ...currentProcEdit, updatedAt: new Date().toISOString() } : p);
    } else {
      updated = [...procedures, currentProcEdit];
    }
    saveToStorage(updated);
    setIsEditingProc(false);
    onTriggerToast('Thành công', 'Đã lưu cấu hình thủ tục hành chính');
  };

  const handleDeleteProc = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa thủ tục này không?')) {
      const updated = procedures.filter(p => p.id !== id);
      saveToStorage(updated);
      if (selectedProcId === id && updated.length > 0) {
        setSelectedProcId(updated[0].id);
      }
      onTriggerToast('Đã xóa', 'Thủ tục đã được gỡ khỏi hệ thống');
    }
  };

  // Step reordering
  const handleMoveStep = (stepIdx: number, direction: 'up' | 'down') => {
    if (!activeProcedure) return;
    const steps = [...activeProcedure.steps];
    const targetIdx = direction === 'up' ? stepIdx - 1 : stepIdx + 1;
    if (targetIdx < 0 || targetIdx >= steps.length) return;

    const temp = steps[stepIdx];
    steps[stepIdx] = steps[targetIdx];
    steps[targetIdx] = temp;

    // Reassign step numbers
    steps.forEach((s, idx) => { s.stepNumber = idx + 1; });

    const updated = procedures.map(p => p.id === activeProcedure.id ? { ...p, steps } : p);
    saveToStorage(updated);
  };

  const handleAddStepToActive = () => {
    if (!activeProcedure) return;
    const newStep: ProcedureStep = {
      id: `s-${Date.now()}`,
      procedureId: activeProcedure.id,
      stepNumber: activeProcedure.steps.length + 1,
      title: 'Bước mới',
      description: 'Mô tả ngắn gọn nội dung bước thực hiện.',
      instruction: 'Hướng dẫn chi tiết cho công dân.',
      location: 'UBND Phường Chánh Hiệp'
    };
    const steps = [...activeProcedure.steps, newStep];
    const updated = procedures.map(p => p.id === activeProcedure.id ? { ...p, steps } : p);
    saveToStorage(updated);
  };

  const handleDeleteStepFromActive = (stepId: string) => {
    if (!activeProcedure) return;
    if (activeProcedure.steps.length <= 1) {
      alert('Quy trình phải có ít nhất 1 bước.');
      return;
    }
    const steps = activeProcedure.steps.filter(s => s.id !== stepId).map((s, idx) => ({ ...s, stepNumber: idx + 1 }));
    const updated = procedures.map(p => p.id === activeProcedure.id ? { ...p, steps } : p);
    saveToStorage(updated);
  };

  const handleUpdateStepField = (stepId: string, field: keyof ProcedureStep, value: any) => {
    if (!activeProcedure) return;
    const steps = activeProcedure.steps.map(s => s.id === stepId ? { ...s, [field]: value } : s);
    const updated = procedures.map(p => p.id === activeProcedure.id ? { ...p, steps } : p);
    saveToStorage(updated);
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* HEADER BAR */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              Trình thiết kế quy trình Một cửa (Visual Procedure Builder)
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Quản lý danh mục thủ tục, kéo thả/sắp xếp thứ tự các bước và cấu hình hồ sơ trực quan
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => handleOpenEditProc()}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm thủ tục mới</span>
        </button>
      </div>

      {/* MAIN LAYOUT: LEFT LIST / RIGHT VISUAL BUILDER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: PROCEDURE SELECTOR LIST (4/12) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-black text-slate-800 uppercase tracking-wide">
                Danh mục thủ tục ({procedures.length})
              </span>
            </div>

            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {procedures.map(proc => {
                const isSelected = proc.id === selectedProcId;
                return (
                  <div
                    key={proc.id}
                    onClick={() => setSelectedProcId(proc.id)}
                    className={`p-3.5 rounded-xl border transition cursor-pointer flex items-center justify-between group ${
                      isSelected 
                        ? 'bg-blue-50/80 border-blue-500 text-blue-950 shadow-2xs' 
                        : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                    }`}
                  >
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-mono text-[10px] font-black">
                          {proc.code}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${proc.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                          {proc.active ? 'Đang kích hoạt' : 'Tạm ẩn'}
                        </span>
                      </div>
                      <h4 className="font-bold text-xs line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {proc.name}
                      </h4>
                      <span className="text-[10px] text-slate-400 block">
                        {proc.steps.length} bước • {proc.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleOpenEditProc(proc); }}
                        className="p-1.5 bg-white text-slate-600 hover:text-blue-600 rounded-lg border border-slate-200 shadow-2xs cursor-pointer"
                        title="Sửa thủ tục"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleDeleteProc(proc.id); }}
                        className="p-1.5 bg-white text-slate-600 hover:text-rose-600 rounded-lg border border-slate-200 shadow-2xs cursor-pointer"
                        title="Xóa thủ tục"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: VISUAL PROCEDURE STEP BUILDER (8/12) */}
        <div className="lg:col-span-8 space-y-6">
          {activeProcedure ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
              
              {/* Header Info & Edit Button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded bg-blue-100 text-blue-800 font-mono text-xs font-black">
                      {activeProcedure.code}
                    </span>
                    <span className="text-xs text-slate-500 font-bold">
                      Lĩnh vực: {activeProcedure.category}
                    </span>
                  </div>
                  <h3 className="text-base font-black text-slate-900 mt-1">
                    {activeProcedure.name}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEditProc(activeProcedure)}
                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Chỉnh sửa thông tin chung</span>
                  </button>
                </div>
              </div>

              {/* STEPS BUILDER SECTION */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    Các bước thực hiện quy trình ({activeProcedure.steps.length} bước)
                  </h4>

                  <button
                    type="button"
                    onClick={handleAddStepToActive}
                    className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Thêm bước mới</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {activeProcedure.steps.map((step, idx) => (
                    <div 
                      key={step.id}
                      className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/90 space-y-3 relative group"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-xl bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                            0{idx + 1}
                          </span>
                          <input
                            type="text"
                            value={step.title}
                            onChange={(e) => handleUpdateStepField(step.id, 'title', e.target.value)}
                            className="text-xs font-black text-slate-900 bg-white border border-slate-200 rounded-lg px-2.5 py-1 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Tiêu đề bước..."
                          />
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleMoveStep(idx, 'up')}
                            disabled={idx === 0}
                            className="p-1.5 bg-white hover:bg-slate-100 text-slate-600 rounded-lg border border-slate-200 disabled:opacity-30 cursor-pointer"
                            title="Di chuyển lên"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveStep(idx, 'down')}
                            disabled={idx === activeProcedure.steps.length - 1}
                            className="p-1.5 bg-white hover:bg-slate-100 text-slate-600 rounded-lg border border-slate-200 disabled:opacity-30 cursor-pointer"
                            title="Di chuyển xuống"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteStepFromActive(step.id)}
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg border border-rose-200 cursor-pointer"
                            title="Xóa bước này"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block mb-1">Mô tả bước:</label>
                          <input
                            type="text"
                            value={step.description}
                            onChange={(e) => handleUpdateStepField(step.id, 'description', e.target.value)}
                            className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg font-medium"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block mb-1">Địa điểm / Quầy:</label>
                          <input
                            type="text"
                            value={step.counter || activeProcedure.counter || ''}
                            onChange={(e) => handleUpdateStepField(step.id, 'counter', e.target.value)}
                            className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg font-medium"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="p-12 bg-white rounded-2xl border border-slate-200 text-center space-y-3">
              <ClipboardList className="w-12 h-12 text-slate-300 mx-auto" />
              <h4 className="font-bold text-slate-800 text-sm">Chưa chọn thủ tục nào</h4>
              <p className="text-xs text-slate-500">Hãy chọn một thủ tục từ danh sách bên trái để thiết kế quy trình.</p>
            </div>
          )}
        </div>

      </div>

      {/* EDIT / CREATE PROCEDURE MODAL */}
      {isEditingProc && currentProcEdit && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="font-black text-slate-900 text-base">
                {procedures.some(p => p.id === currentProcEdit.id) ? 'Chỉnh sửa thông tin thủ tục' : 'Thêm thủ tục hành chính mới'}
              </h3>
              <button
                type="button"
                onClick={() => setIsEditingProc(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProc} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">Mã thủ tục (*)</label>
                  <input
                    type="text"
                    required
                    value={currentProcEdit.code}
                    onChange={(e) => setCurrentProcEdit({ ...currentProcEdit, code: e.target.value })}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">Lĩnh vực (*)</label>
                  <select
                    value={currentProcEdit.category}
                    onChange={(e) => setCurrentProcEdit({ ...currentProcEdit, category: e.target.value as ProcedureCategory })}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  >
                    <option value="Hộ tịch">Hộ tịch</option>
                    <option value="Chứng thực">Chứng thực</option>
                    <option value="An sinh">An sinh</option>
                    <option value="Đất đai">Đất đai</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">Tên thủ tục hành chính (*)</label>
                <input
                  type="text"
                  required
                  value={currentProcEdit.name}
                  onChange={(e) => setCurrentProcEdit({ ...currentProcEdit, name: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  placeholder="Ví dụ: Đăng ký khai sinh..."
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">Mô tả chi tiết</label>
                <textarea
                  rows={2}
                  value={currentProcEdit.description}
                  onChange={(e) => setCurrentProcEdit({ ...currentProcEdit, description: e.target.value })}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">Thời gian giải quyết</label>
                  <input
                    type="text"
                    value={currentProcEdit.processingTime}
                    onChange={(e) => setCurrentProcEdit({ ...currentProcEdit, processingTime: e.target.value })}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">Lệ phí</label>
                  <input
                    type="text"
                    value={currentProcEdit.fee}
                    onChange={(e) => setCurrentProcEdit({ ...currentProcEdit, fee: e.target.value })}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-xs font-bold text-slate-800">Kích hoạt hiển thị công khai</span>
                <input
                  type="checkbox"
                  checked={currentProcEdit.active}
                  onChange={(e) => setCurrentProcEdit({ ...currentProcEdit, active: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditingProc(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Lưu thủ tục</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
