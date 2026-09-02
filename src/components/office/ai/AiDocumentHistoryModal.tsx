import React from 'react';
import { 
  History, 
  X, 
  RotateCcw, 
  Check, 
  Calendar, 
  User, 
  FileText,
  Clock
} from 'lucide-react';
import { AiDocument, AiDocumentVersion } from '../../../types';

interface AiDocumentHistoryModalProps {
  document: AiDocument | null;
  isOpen: boolean;
  onClose: () => void;
  onRestoreVersion: (version: AiDocumentVersion) => void;
}

export const AiDocumentHistoryModal: React.FC<AiDocumentHistoryModalProps> = ({
  document,
  isOpen,
  onClose,
  onRestoreVersion
}) => {
  if (!isOpen || !document) return null;

  const versions = document.versions || [];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold">Lịch sử Phiên bản</h3>
              <p className="text-xs text-slate-300 line-clamp-1">{document.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3 bg-slate-50/50">
          {/* Current Version */}
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-600 text-white">
                  V{document.version || 1} (Hiện tại)
                </span>
                <span className="text-xs text-emerald-800 font-semibold">Đang hiển thị trên màn hình soạn thảo</span>
              </div>
              <p className="text-xs text-slate-600 flex items-center gap-3 mt-1">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {new Date(document.updatedAt).toLocaleString('vi-VN')}
                </span>
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  {document.ownerName || 'Cán bộ MTTQ'}
                </span>
              </p>
            </div>
            <span className="text-xs font-medium text-emerald-700 bg-white px-2 py-1 rounded-md border border-emerald-200">
              Đang hoạt động
            </span>
          </div>

          {/* Historical Versions List */}
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1 pt-2">
            Các phiên bản lưu trước đó ({versions.length})
          </div>

          {versions.map((ver) => (
            <div
              key={ver.id}
              className="p-3.5 bg-white border border-slate-200 rounded-xl hover:border-red-200 transition-all shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                    {ver.label || `V${ver.versionNumber}`}
                  </span>
                  <span className="text-xs font-medium text-slate-800">
                    {ver.changeSummary || 'Chỉnh sửa định kỳ'}
                  </span>
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {new Date(ver.createdAt).toLocaleString('vi-VN')}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    {ver.savedBy}
                  </span>
                </div>
                <div className="text-xs text-slate-600 line-clamp-1 italic bg-slate-50 p-1.5 rounded-md border border-slate-100 font-serif">
                  "{ver.content.substring(0, 120)}..."
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <button
                  onClick={() => {
                    if (window.confirm(`Đồng chí có chắc chắn muốn khôi phục lại phiên bản ${ver.label}?`)) {
                      onRestoreVersion(ver);
                      onClose();
                    }
                  }}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-50 hover:bg-red-600 hover:text-white text-red-700 font-medium text-xs rounded-lg transition-colors border border-red-200 hover:border-transparent"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Khôi phục bản này</span>
                </button>
              </div>
            </div>
          ))}

          {versions.length === 0 && (
            <div className="text-center py-6 text-slate-400 text-xs">
              Chưa có phiên bản lịch sử nào được ghi nhận cho tài liệu này. Khi bạn chỉnh sửa nội dung, hệ thống sẽ tự động lưu các phiên bản trước đó.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
