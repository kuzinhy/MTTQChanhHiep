import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ProcedureItem, ProcedureCategory, ProcedureStep } from '../../types/procedure';
import { INITIAL_PROCEDURES } from '../../data/proceduresSeed';
import { 
  Layers, MapPin, Building2, Clock, Check, ExternalLink, 
  X, Search, Sparkles, CheckSquare, Square, ArrowRight, ArrowLeft, 
  QrCode, FileCheck, Play, Pause, RotateCcw, ChevronRight
} from 'lucide-react';

interface ProcedureGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProcedureId?: string;
  onAskAi?: (question: string) => void;
}

export const ProcedureGuideModal: React.FC<ProcedureGuideModalProps> = ({
  isOpen,
  onClose,
  initialProcedureId,
  onAskAi
}) => {
  const [procedures] = useState<ProcedureItem[]>(() => {
    try {
      const saved = localStorage.getItem('chanhhiep_procedures_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_PROCEDURES;
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeProcedure, setActiveProcedure] = useState<ProcedureItem | null>(null);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [checklistChecked, setChecklistChecked] = useState<Record<string, boolean>>({});
  const [showQrModal, setShowQrModal] = useState<boolean>(false);

  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (initialProcedureId) {
      const found = procedures.find(p => p.id === initialProcedureId);
      if (found) {
        selectProcedure(found);
      }
    }
  }, [initialProcedureId, procedures]);

  const selectProcedure = (proc: ProcedureItem) => {
    setActiveProcedure(proc);
    setActiveStepIndex(0);
    setIsPlaying(false);
    setChecklistChecked({});
  };

  // Auto-play simulation loop (2.5s)
  useEffect(() => {
    if (isPlaying && activeProcedure) {
      autoPlayTimerRef.current = setInterval(() => {
        setActiveStepIndex((prevIdx) => {
          if (prevIdx < activeProcedure.steps.length - 1) {
            return prevIdx + 1;
          } else {
            setIsPlaying(false);
            return prevIdx;
          }
        });
      }, 2500);
    } else {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    }
    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [isPlaying, activeProcedure]);

  const handleTogglePlay = () => {
    if (!activeProcedure) return;
    if (!isPlaying && activeStepIndex === activeProcedure.steps.length - 1) {
      setActiveStepIndex(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setActiveStepIndex(0);
  };

  const filteredProcedures = useMemo(() => {
    return procedures.filter(p => {
      if (!p.active) return false;
      const matchesCat = selectedCategory === 'ALL' || p.category === selectedCategory;
      const q = searchTerm.toLowerCase().trim();
      if (!q) return matchesCat;
      
      const matchesName = p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q);
      const matchesAlias = p.aliases?.some(a => a.toLowerCase().includes(q) || q.includes(a.toLowerCase()));
      const matchesDesc = p.description.toLowerCase().includes(q);
      
      return matchesCat && (matchesName || matchesAlias || matchesDesc);
    });
  }, [procedures, selectedCategory, searchTerm]);

  const categories: ProcedureCategory[] = ['Hộ tịch', 'Chứng thực', 'An sinh', 'Đất đai', 'Khác'];

  const toggleChecklistDoc = (docId: string) => {
    setChecklistChecked(prev => ({ ...prev, [docId]: !prev[docId] }));
  };

  if (!isOpen) return null;

  const currentStep: ProcedureStep | undefined = activeProcedure?.steps[activeStepIndex];
  const totalSteps = activeProcedure?.steps.length || 0;
  const progressPercent = totalSteps > 0 ? Math.round(((activeStepIndex + 1) / totalSteps) * 100) : 0;

  const docs = activeProcedure?.documents || [];
  const checkedDocsCount = docs.filter(d => checklistChecked[d.id]).length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 font-sans select-none animate-in fade-in duration-150">
      
      {/* MAIN CONTAINER: CLEAN WHITE THEME & SNUG VIEWPORT FIT */}
      <div className="bg-white text-slate-900 rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200/90 w-full max-w-3xl max-h-[90vh] sm:max-h-[85vh] flex flex-col overflow-hidden">
        
        {/* ================= HEADER BAR ================= */}
        <div className="bg-slate-50 border-b border-slate-200 px-3.5 sm:px-5 py-2 sm:py-2.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-100 text-blue-600 rounded-lg border border-blue-200 flex items-center justify-center shrink-0 shadow-xs">
              <Layers className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-mono font-black uppercase tracking-wider px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  MÔ PHỎNG QUY TRÌNH
                </span>
                {activeProcedure && (
                  <span className="text-[9px] font-mono bg-slate-100 px-1.5 py-0.2 rounded text-slate-700 border border-slate-200 font-bold">
                    {activeProcedure.code}
                  </span>
                )}
              </div>
              <h2 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight leading-snug truncate">
                {activeProcedure ? activeProcedure.name : 'Danh mục Thủ tục Một cửa'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {activeProcedure && (
              <>
                <button
                  type="button"
                  onClick={() => setShowQrModal(true)}
                  className="p-1.5 bg-white hover:bg-slate-100 text-slate-600 rounded-lg transition cursor-pointer border border-slate-200 shadow-xs"
                  title="Mã QR"
                >
                  <QrCode className="w-3.5 h-3.5 text-blue-600" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveProcedure(null)}
                  className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 rounded-lg text-[11px] font-bold transition flex items-center gap-1 cursor-pointer border border-slate-200 shadow-xs"
                >
                  <ArrowLeft className="w-3 h-3" />
                  <span className="hidden sm:inline">Đổi thủ tục</span>
                </button>
              </>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ================= MODAL BODY ================= */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2.5 sm:space-y-3 scrollbar-thin">
          
          {!activeProcedure ? (
            /* ================= VIEW 1: SEARCH & DIRECTORY ================= */
            <div className="space-y-3">
              
              {/* Search & Category Tabs */}
              <div className="space-y-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Tìm nhanh thủ tục (vd: 'giấy độc thân', 'sao y', 'khai sinh')..."
                    className="w-full text-xs pl-8 pr-3 py-1.5 sm:py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>

                {/* Category Pills */}
                <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none">
                  <button
                    type="button"
                    onClick={() => setSelectedCategory('ALL')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer shrink-0 ${
                      selectedCategory === 'ALL'
                        ? 'bg-blue-600 text-white font-black shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    Tất cả ({procedures.filter(p => p.active).length})
                  </button>
                  {categories.map(cat => {
                    const count = procedures.filter(p => p.active && p.category === cat).length;
                    if (count === 0) return null;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer shrink-0 ${
                          selectedCategory === cat
                            ? 'bg-blue-600 text-white font-black shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
                        }`}
                      >
                        {cat} ({count})
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Procedures Cards List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {filteredProcedures.map((proc) => (
                  <div
                    key={proc.id}
                    onClick={() => selectProcedure(proc)}
                    className="bg-white hover:bg-blue-50/50 rounded-xl border border-slate-200 hover:border-blue-400 p-3 transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-2 group shadow-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 font-mono text-[9px] font-bold border border-blue-200">
                          {proc.code}
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium">
                          {proc.steps.length} bước
                        </span>
                      </div>
                      
                      <h3 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                        {proc.name}
                      </h3>
                      
                      <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                        {proc.description}
                      </p>
                    </div>

                    <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-blue-600 font-bold">
                      <span className="flex items-center gap-1 text-slate-500">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{proc.processingTime}</span>
                      </span>

                      <span className="flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                        <span>Mô phỏng</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          ) : (
            /* ================= VIEW 2: STEP SIMULATION (WHITE THEME & NO CLIPPING) ================= */
            <div className="space-y-2.5 sm:space-y-3">
              
              {/* 1. TOP STEPPER NODES ROW */}
              <div className="bg-slate-50/90 rounded-xl border border-slate-200 p-2 sm:p-2.5 shadow-xs space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-600 font-bold">
                    TIẾN ĐỘ: BƯỚC {activeStepIndex + 1}/{totalSteps}
                  </span>
                  <span className="text-blue-600 font-extrabold">{progressPercent}%</span>
                </div>

                {/* Progress bar line */}
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                {/* Step Node Buttons */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-1 pt-0.5">
                  {activeProcedure.steps.map((step, idx) => {
                    const isActive = activeStepIndex === idx;
                    const isPassed = activeStepIndex > idx;

                    return (
                      <button
                        key={step.id}
                        type="button"
                        onClick={() => { setIsPlaying(false); setActiveStepIndex(idx); }}
                        className={`p-1.5 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between space-y-0.5 ${
                          isActive
                            ? 'bg-blue-600 text-white border-blue-600 font-black shadow-sm scale-[1.01]'
                            : isPassed
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-[9px] font-mono font-bold ${isActive ? 'text-white' : isPassed ? 'text-emerald-700' : 'text-slate-500'}`}>
                            BƯỚC 0{idx + 1}
                          </span>
                          {isPassed && <Check className="w-2.5 h-2.5 text-emerald-600 stroke-[3]" />}
                        </div>
                        <span className="text-[11px] font-bold truncate leading-tight block">
                          {step.title}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. ACTIVE STEP HERO CARD */}
              {currentStep && (
                <div className="bg-slate-50/70 rounded-2xl border border-slate-200 p-3 sm:p-3.5 space-y-2.5">
                  
                  {/* Step Header */}
                  <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-200">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="px-2 py-0.5 rounded bg-blue-600 text-white font-mono font-black text-[11px] shrink-0 shadow-xs">
                        0{activeStepIndex + 1}
                      </span>
                      <h3 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight truncate">
                        {currentStep.title}
                      </h3>
                    </div>

                    <div className="text-[10px] text-slate-600 font-medium shrink-0 flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-2xs">
                      <Clock className="w-3 h-3 text-blue-600" />
                      <span>{activeProcedure.processingTime}</span>
                    </div>
                  </div>

                  {/* Step Action Instruction Box */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider flex items-center gap-1">
                      <FileCheck className="w-3 h-3 text-blue-600" />
                      <span>Bạn cần làm gì ở bước này?</span>
                    </span>
                    
                    <div className="p-2 sm:p-2.5 bg-white rounded-xl border border-slate-200 text-xs text-slate-800 font-medium leading-relaxed shadow-2xs">
                      {currentStep.instruction || currentStep.description}
                    </div>
                  </div>

                  {/* Location & Counter Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-2 bg-white rounded-lg border border-slate-200 flex items-center gap-2 shadow-2xs">
                      <Building2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <div className="min-w-0">
                        <span className="text-slate-500 block text-[9px] font-bold">Quầy tiếp nhận:</span>
                        <strong className="text-slate-900 font-bold truncate block text-xs">
                          {currentStep.counter || activeProcedure.counter}
                        </strong>
                      </div>
                    </div>

                    <div className="p-2 bg-white rounded-lg border border-slate-200 flex items-center gap-2 shadow-2xs">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <div className="min-w-0">
                        <span className="text-slate-500 block text-[9px] font-bold">Địa điểm:</span>
                        <span className="text-slate-800 font-medium truncate block text-xs">
                          {currentStep.location || 'Trụ sở UBND Phường Chánh Hiệp'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Checklist & Quick Action */}
                  {docs.length > 0 && (
                    <div className="space-y-1 pt-0.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                          <CheckSquare className="w-3 h-3 text-emerald-600" />
                          <span>Giấy tờ cần mang</span>
                        </span>
                        <span className="font-mono text-blue-700 text-[10px] bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                          {checkedDocsCount}/{docs.length} đã chuẩn bị
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-20 overflow-y-auto pr-1 scrollbar-thin">
                        {docs.map(doc => {
                          const isChecked = !!checklistChecked[doc.id];
                          return (
                            <div
                              key={doc.id}
                              onClick={() => toggleChecklistDoc(doc.id)}
                              className={`p-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 text-[11px] select-none ${
                                isChecked
                                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 shadow-2xs'
                              }`}
                            >
                              <div className="shrink-0">
                                {isChecked ? (
                                  <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                  <Square className="w-3.5 h-3.5 text-slate-400" />
                                )}
                              </div>
                              <span className={`truncate ${isChecked ? 'line-through text-slate-400' : 'font-medium text-slate-800'}`}>
                                {doc.name}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Action Link & AI Button */}
                  <div className="pt-0.5 flex flex-wrap items-center gap-2">
                    {activeProcedure.onlineAvailable && activeProcedure.onlineUrl && (
                      <a
                        href={activeProcedure.onlineUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-[11px] transition flex items-center gap-1 shadow-xs cursor-pointer"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Nộp trực tuyến</span>
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={() => onAskAi?.(`Hướng dẫn chi tiết cho tôi về thủ tục "${activeProcedure.name}" ở Bước ${activeStepIndex + 1}: "${currentStep.title}"`)}
                      className="px-3 py-1 bg-white hover:bg-slate-100 text-blue-700 border border-slate-200 rounded-lg text-[11px] font-bold transition flex items-center gap-1 cursor-pointer shadow-2xs"
                    >
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      <span>Hỏi Trợ lý AI</span>
                    </button>
                  </div>

                </div>
              )}

              {/* 3. NAVIGATION CONTROLS BAR (ALWAYS VISIBLE & PERFECTLY PINNED) */}
              <div className="bg-slate-50/90 rounded-xl border border-slate-200 p-2 sm:p-2.5 shadow-xs flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => { setIsPlaying(false); setActiveStepIndex(Math.max(0, activeStepIndex - 1)); }}
                  disabled={activeStepIndex === 0}
                  className="px-3 py-1.5 bg-white hover:bg-slate-100 disabled:opacity-30 text-slate-700 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer border border-slate-200 shadow-2xs"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Bước trước</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleTogglePlay}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                      isPlaying
                        ? 'bg-amber-500 hover:bg-amber-600 text-white'
                        : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200'
                    }`}
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                    <span>{isPlaying ? 'Tạm dừng' : 'Tự động chạy'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="p-1.5 bg-white hover:bg-slate-100 text-slate-600 rounded-lg transition cursor-pointer border border-slate-200 shadow-2xs"
                    title="Bắt đầu lại"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => { setIsPlaying(false); setActiveStepIndex(Math.min(totalSteps - 1, activeStepIndex + 1)); }}
                  disabled={activeStepIndex === totalSteps - 1}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-30 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-xs"
                >
                  <span>Tiếp theo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          )}

        </div>

      </div>

      {/* QR MODAL */}
      {showQrModal && activeProcedure && (
        <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white text-slate-900 rounded-2xl p-4 border border-slate-200 max-w-xs w-full text-center space-y-2.5 shadow-2xl">
            <h4 className="font-bold text-xs text-blue-700">Mã QR Quy trình thủ tục</h4>
            <p className="text-[11px] text-slate-600 truncate">{activeProcedure.name}</p>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl inline-block mx-auto shadow-2xs">
              <QrCode className="w-24 h-24 text-slate-900" />
            </div>
            <p className="text-[10px] text-slate-500">Quét mã để xem trên điện thoại</p>
            <button
              type="button"
              onClick={() => setShowQrModal(false)}
              className="w-full py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold cursor-pointer border border-slate-200"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
