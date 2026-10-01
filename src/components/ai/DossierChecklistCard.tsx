import React, { useState } from 'react';
import { CheckSquare, Square, FileText, Clock, DollarSign, MapPin, CheckCircle2, ChevronDown, ChevronUp, Sparkles, PhoneCall } from 'lucide-react';

export interface RequiredDocumentItem {
  id: string;
  label: string;
  isMandatory?: boolean;
  note?: string;
}

export interface ProcedureStepItem {
  step: number;
  title: string;
  detail: string;
}

export interface ProcedureDossierData {
  title: string;
  counterWindow?: string;
  processingTime?: string;
  fee?: string;
  requiredDocuments: RequiredDocumentItem[];
  steps?: ProcedureStepItem[];
}

interface DossierChecklistCardProps {
  dossier: ProcedureDossierData;
}

export const DossierChecklistCard: React.FC<DossierChecklistCardProps> = ({ dossier }) => {
  const [checkedDocIds, setCheckedDocIds] = useState<string[]>([]);
  const [isStepsExpanded, setIsStepsExpanded] = useState(true);

  const toggleCheckDoc = (id: string) => {
    setCheckedDocIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const totalDocs = dossier.requiredDocuments.length;
  const completedDocs = checkedDocIds.length;
  const progressPercent = totalDocs > 0 ? Math.round((completedDocs / totalDocs) * 100) : 0;

  return (
    <div className="my-3 rounded-2xl border border-blue-200/90 bg-gradient-to-b from-blue-50/70 via-white to-slate-50 p-3.5 shadow-xs space-y-3 font-sans text-slate-900">
      
      {/* Header Banner */}
      <div className="flex items-start gap-2.5 border-b border-blue-100 pb-2.5">
        <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-xl shadow-xs shrink-0 mt-0.5">
          <FileText className="w-4 h-4 text-amber-300" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 font-extrabold text-[10px] uppercase tracking-wide">
              Bộ phận Một cửa UBND Phường
            </span>
            {dossier.counterWindow && (
              <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                {dossier.counterWindow}
              </span>
            )}
          </div>
          <h4 className="font-black text-xs sm:text-sm text-slate-900 mt-1 leading-snug">
            {dossier.title}
          </h4>
        </div>
      </div>

      {/* Meta Specs Grid */}
      <div className="grid grid-cols-2 gap-2 text-[11px] bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center gap-1.5 text-slate-700 font-medium">
          <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span>Thời hạn: <strong className="text-slate-900 font-bold">{dossier.processingTime || 'Trong ngày làm việc'}</strong></span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-700 font-medium">
          <DollarSign className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>Lệ phí: <strong className="text-slate-900 font-bold">{dossier.fee || '15.000 VNĐ'}</strong></span>
        </div>
      </div>

      {/* Interactive Required Documents Checklist */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h5 className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            Checklist Hồ sơ cần chuẩn bị ({completedDocs}/{totalDocs}):
          </h5>
          <span className="text-[10.5px] font-black text-blue-700">
            {progressPercent}% Hoàn thành
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Document Items List */}
        <div className="space-y-1.5 pt-1">
          {dossier.requiredDocuments.map((doc) => {
            const isChecked = checkedDocIds.includes(doc.id);
            return (
              <div
                key={doc.id}
                onClick={() => toggleCheckDoc(doc.id)}
                className={`p-2 rounded-xl border transition-all cursor-pointer flex items-start gap-2 text-[11px] leading-snug select-none ${
                  isChecked 
                    ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 font-medium' 
                    : 'bg-white border-slate-200 hover:border-blue-300 text-slate-800'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isChecked ? (
                    <CheckSquare className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400" />
                  )}
                </div>
                <div className="flex-1">
                  <span className={isChecked ? 'line-through text-slate-500' : 'font-semibold text-slate-900'}>
                    {doc.label}
                  </span>
                  {doc.isMandatory && (
                    <span className="ml-1.5 text-[9.5px] text-red-600 font-extrabold uppercase bg-red-50 px-1.5 py-0.2 rounded border border-red-200">
                      Bắt buộc
                    </span>
                  )}
                  {doc.note && (
                    <p className="text-[10px] text-slate-500 font-normal mt-0.5">{doc.note}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step-by-Step Procedure Guide */}
      {dossier.steps && dossier.steps.length > 0 && (
        <div className="border-t border-slate-200/80 pt-2.5">
          <button
            type="button"
            onClick={() => setIsStepsExpanded(!isStepsExpanded)}
            className="flex w-full items-center justify-between font-extrabold text-xs text-blue-950 hover:text-blue-700 cursor-pointer py-1"
          >
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
              Hướng dẫn quy trình thực hiện ({dossier.steps.length} Bước):
            </span>
            {isStepsExpanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
          </button>

          {isStepsExpanded && (
            <div className="mt-2 space-y-2 text-[11px]">
              {dossier.steps.map((st) => (
                <div key={st.step} className="flex items-start gap-2 bg-white p-2 rounded-xl border border-slate-100">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    {st.step}
                  </span>
                  <div className="space-y-0.5">
                    <strong className="text-slate-900 font-bold block">{st.title}</strong>
                    <p className="text-slate-600 leading-relaxed font-normal">{st.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Footer Contact & Location */}
      <div className="pt-2 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-600 font-medium">
        <span className="flex items-center gap-1">
          <MapPin className="w-3 h-3 text-red-600" />
          Số 1240 Đại Lộ Bình Dương, KP Định Hòa 5
        </span>
        <a 
          href="tel:02743822456" 
          className="flex items-center gap-1 text-blue-700 font-bold hover:underline"
        >
          <PhoneCall className="w-3 h-3 text-blue-600" />
          Một cửa: 0274.3822.456
        </a>
      </div>

    </div>
  );
};
