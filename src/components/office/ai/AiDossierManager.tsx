import React, { useState } from 'react';
import { 
  FolderKanban, 
  Plus, 
  Calendar, 
  MapPin, 
  FileText, 
  Tag, 
  Trash2, 
  CheckCircle2, 
  ChevronRight,
  FolderOpen
} from 'lucide-react';
import { AiDossier, AiDocument } from '../../../types';
import { aiWorkspaceService } from '../../../lib/aiWorkspaceService';

interface AiDossierManagerProps {
  dossiers: AiDossier[];
  documents: AiDocument[];
  onSelectDossier: (dossier: AiDossier) => void;
  onRefresh: () => void;
}

export const AiDossierManager: React.FC<AiDossierManagerProps> = ({
  dossiers = [],
  documents = [],
  onSelectDossier,
  onRefresh
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newTags, setNewTags] = useState('');

  const safeDossiers = Array.isArray(dossiers) ? dossiers : [];
  const safeDocs = Array.isArray(documents) ? documents : [];

  const handleCreateDossier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newDossier: AiDossier = {
      id: `dossier_${Date.now()}`,
      title: newTitle,
      description: newDesc,
      eventDate: newDate || undefined,
      location: newLocation || undefined,
      status: 'active',
      documentsCount: 0,
      tags: newTags ? newTags.split(',').map(t => t.trim()).filter(Boolean) : [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    aiWorkspaceService.saveDossier(newDossier);
    setShowAddModal(false);
    setNewTitle('');
    setNewDesc('');
    setNewDate('');
    setNewLocation('');
    setNewTags('');
    onRefresh();
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center text-red-700">
            <FolderKanban className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Hồ Sơ Công Việc Tham Mưu</h2>
            <p className="text-xs text-slate-500">
              Quản lý trọn gói toàn bộ văn bản, kế hoạch, kịch bản và báo cáo theo từng sự kiện, chuyên đề của MTTQ.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo Hồ Sơ Mới</span>
        </button>
      </div>

      {/* Dossiers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {safeDossiers.map((dossier) => {
          const dossierDocs = safeDocs.filter(d => d && d.dossierId === dossier.id);
          const docCount = dossierDocs.length || dossier.documentsCount || 0;

          return (
            <div
              key={dossier.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-red-200 hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer"
              onClick={() => onSelectDossier(dossier)}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    dossier.status === 'completed' 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {dossier.status === 'completed' ? 'Đã hoàn thành' : 'Đang xử lý'}
                  </span>
                  <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                    {docCount} tài liệu
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-800 group-hover:text-red-700 transition-colors line-clamp-2 mb-2">
                  {dossier.title}
                </h3>

                <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                  {dossier.description || 'Chưa có mô tả chi tiết cho hồ sơ này.'}
                </p>

                {(dossier.eventDate || dossier.location) && (
                  <div className="space-y-1.5 pt-3 border-t border-slate-100 text-xs text-slate-600">
                    {dossier.eventDate && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{dossier.eventDate}</span>
                      </div>
                    )}
                    {dossier.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span className="line-clamp-1">{dossier.location}</span>
                      </div>
                    )}
                  </div>
                )}

                {dossier.tags && dossier.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {dossier.tags.map((tag, idx) => (
                      <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-red-700 font-semibold group-hover:translate-x-1 transition-transform">
                <span>Mở hồ sơ làm việc</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-800">Tạo Hồ Sơ Công Việc Mới</h3>
            <form onSubmit={handleCreateDossier} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 mb-1 block">Tên hồ sơ / Sự kiện *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ví dụ: Hồ sơ Ngày hội Đại đoàn kết toàn dân tộc 2026..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-hidden focus:border-red-600 focus:bg-white transition-all text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 mb-1 block">Mô tả mục tiêu</label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Tóm tắt nội dung gói công việc này..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-hidden focus:border-red-600 focus:bg-white transition-all text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 mb-1 block">Thời gian diễn ra</label>
                  <input
                    type="text"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    placeholder="18/11/2026..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-hidden focus:border-red-600 focus:bg-white transition-all text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 mb-1 block">Địa điểm</label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="Hội trường UBND Phường..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-hidden focus:border-red-600 focus:bg-white transition-all text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 mb-1 block">Thẻ phân loại (phân cách bằng dấu phẩy)</label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="Đại đoàn kết, An sinh, Thi đua..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-hidden focus:border-red-600 focus:bg-white transition-all text-xs"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold"
                >
                  Tạo Hồ Sơ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
