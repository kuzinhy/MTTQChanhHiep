import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  HeartHandshake,
  Users,
  Building,
  CheckCircle2,
  Quote,
  Sparkles,
  Calendar,
  Award,
  BookOpen,
  FolderArchive,
  ExternalLink,
  Download,
  ShieldCheck,
  Edit3,
  Lightbulb,
  ArrowRight,
  Plus,
  QrCode,
  ThumbsUp,
  X
} from 'lucide-react';
import {
  ChanhHiepActionModel,
  FrontInitiative,
  GOOGLE_DRIVE_HCM_TOAN_TAP_URL
} from '../../data/hcmVerifiedMuseumData';
import {
  loadStoredActions,
  saveStoredActions,
  loadStoredInitiatives,
  saveStoredInitiatives
} from '../../lib/hcmDataStore';
import { DongSonDrumIcon } from './TraditionalMotifs';
import { UniversalHcmEditorModal, EditableHcmItemType } from './UniversalHcmEditorModal';
import { QrCodeModal } from '../QrCodeModal';

interface HcmChanhHiepActionProps {
  isAdmin?: boolean;
}

export const HcmChanhHiepAction: React.FC<HcmChanhHiepActionProps> = ({ isAdmin = false }) => {
  const [actionsList, setActionsList] = useState<ChanhHiepActionModel[]>(() => loadStoredActions());
  const [initiativesList, setInitiativesList] = useState<FrontInitiative[]>(() => loadStoredInitiatives());

  // Filter state
  const [viewFilter, setViewFilter] = useState<'all' | 'actions' | 'initiatives'>('all');

  // Modal / Editing states
  const [editingItem, setEditingItem] = useState<{ type: EditableHcmItemType; data: any } | null>(null);
  const [selectedInitiativeDetail, setSelectedInitiativeDetail] = useState<FrontInitiative | null>(null);
  const [qrModalItem, setQrModalItem] = useState<{ title: string; url: string } | null>(null);

  useEffect(() => {
    setActionsList(loadStoredActions());
    setInitiativesList(loadStoredInitiatives());
  }, []);

  const handleSaveItem = (updated: any) => {
    if (!editingItem) return;

    if (editingItem.type === 'chanh_hiep_action') {
      const updatedList = actionsList.map((a) => (a.id === updated.id ? updated : a));
      setActionsList(updatedList);
      saveStoredActions(updatedList);
    } else if (editingItem.type === 'front_initiative') {
      const exists = initiativesList.some((i) => i.id === updated.id);
      const updatedList = exists
        ? initiativesList.map((i) => (i.id === updated.id ? updated : i))
        : [updated, ...initiativesList];
      setInitiativesList(updatedList);
      saveStoredInitiatives(updatedList);
    }
    setEditingItem(null);
  };

  const handleAddInitiative = () => {
    const newInit: FrontInitiative = {
      id: `init-${Date.now()}`,
      title: 'Sáng kiến Tác nghiệp Mặt Trận mới',
      unit: 'Ủy ban MTTQ Phường Chánh Hiệp',
      summary: 'Mô tả tóm tắt nội dung giải pháp tác nghiệp và cách làm hay.',
      impact: 'Hiệu quả thiết thực mang lại cho nhân dân địa phương.',
      likes: 100,
      tags: ['Sáng kiến mới', 'Làm theo Bác'],
      date: new Date().toLocaleDateString('vi-VN'),
      linkedHcmActionId: actionsList[0]?.id || 'act-01',
      linkedHcmTopicTitle: actionsList[0]?.title || ''
    };
    setEditingItem({ type: 'front_initiative', data: newInit });
  };

  return (
    <div className="space-y-6 py-2">
      {/* Universal Direct Editor Modal for Admin Editing Actions or Initiatives */}
      {editingItem && (
        <UniversalHcmEditorModal
          isOpen={!!editingItem}
          onClose={() => setEditingItem(null)}
          itemType={editingItem.type}
          itemData={editingItem.data}
          onSave={handleSaveItem}
        />
      )}

      {/* Header Giới Thiệu - Tone Hồng Cánh Sen */}
      <div className="bg-gradient-to-r from-rose-800 via-pink-700 to-rose-900 text-white p-6 sm:p-8 rounded-3xl border-2 border-rose-300/40 shadow-xl space-y-3 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-15 pointer-events-none">
          <DongSonDrumIcon size={240} />
        </div>

        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-100 text-xs font-bold">
            <HeartHandshake className="w-4 h-4 text-amber-300" />
            <span>PHÂN HỆ THỰC TIỄN &amp; SÁNG KIẾN MẶT TRẬN LIÊN THÔNG</span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif font-extrabold text-white leading-tight">
            Chánh Hiệp Học Tập Và Làm Theo Tư Tưởng, Đạo Đức, Phong Cách Hồ Chí Minh
          </h2>
          <p className="text-xs sm:text-sm text-rose-50 max-w-3xl leading-relaxed font-normal">
            Gắn kết chặt chẽ giữa Chuyên đề Học tập Bác với các **Sáng kiến Tác nghiệp &amp; Mô hình Nhân rộng Mặt Trận** tại 21 khu phố; biến tư tưởng của Người thành những hành động "Làm theo" cụ thể, thiết thực.
          </p>
        </div>
      </div>

      {/* Thanh Lọc & Điều Hướng Liên Thông */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-2xl border border-rose-200 shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setViewFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              viewFilter === 'all'
                ? 'bg-rose-800 text-white shadow-xs'
                : 'bg-rose-50 text-rose-900 hover:bg-rose-100'
            }`}
          >
            Tất cả Bài viết &amp; Sáng kiến Liên thông ({actionsList.length + initiativesList.length})
          </button>
          <button
            onClick={() => setViewFilter('actions')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              viewFilter === 'actions'
                ? 'bg-rose-800 text-white shadow-xs'
                : 'bg-rose-50 text-rose-900 hover:bg-rose-100'
            }`}
          >
            Chuyên đề Học tập Bác ({actionsList.length})
          </button>
          <button
            onClick={() => setViewFilter('initiatives')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              viewFilter === 'initiatives'
                ? 'bg-rose-800 text-white shadow-xs'
                : 'bg-rose-50 text-rose-900 hover:bg-rose-100'
            }`}
          >
            Sáng kiến Tác nghiệp Mặt Trận ({initiativesList.length})
          </button>
        </div>

        {isAdmin && (
          <button
            onClick={handleAddInitiative}
            className="px-3.5 py-1.5 rounded-xl bg-amber-400 text-rose-950 font-extrabold text-xs flex items-center gap-1.5 hover:bg-amber-300 transition cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Sáng kiến Mặt Trận mới</span>
          </button>
        )}
      </div>

      {/* TỦ SÁCH ĐIỆN TỬ HỒ CHÍ MINH TOÀN TẬP PHƯỜNG CHÁNH HIỆP */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-white via-rose-50/60 to-amber-50/40 border-2 border-rose-200 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-900 border border-rose-200 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
              <FolderArchive className="w-4 h-4 text-rose-700" />
              Tủ sách điện tử 21 Khu phố Chánh Hiệp
            </span>
            <h3 className="text-lg sm:text-xl font-serif font-bold text-rose-950">
              Trọn bộ 15 Tập Hồ Chí Minh Toàn Tập (Drive Lưu Trữ Chính Thức)
            </h3>
            <p className="text-xs sm:text-sm text-rose-900/80 max-w-2xl leading-relaxed">
              Phục vụ các Chi bộ 21 Khu phố sinh hoạt chuyên đề, tra cứu chính xác tập - trang và trích dẫn tư liệu chính thống NXB Chính trị quốc gia Sự thật.
            </p>
          </div>

          <a
            href={GOOGLE_DRIVE_HCM_TOAN_TAP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-300 text-rose-950 font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all shrink-0 cursor-pointer"
          >
            <Download className="w-4 h-4 text-rose-950" />
            <span>Mở Tủ Sách Google Drive</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="p-3.5 rounded-2xl bg-white border border-rose-200 space-y-1 shadow-2xs">
            <span className="font-bold text-rose-950 block">1. Chi bộ Khu phố</span>
            <span className="text-rose-900/80 text-xs">Tài liệu sinh hoạt định kỳ, học tập chuyên đề hằng tháng.</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white border border-rose-200 space-y-1 shadow-2xs">
            <span className="font-bold text-rose-950 block">2. Cán bộ &amp; Đoàn viên</span>
            <span className="text-rose-900/80 text-xs">Học tập tác phong "Sửa đổi lối làm việc" &amp; "Dân vận" khéo.</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white border border-rose-200 space-y-1 shadow-2xs">
            <span className="font-bold text-rose-950 block">3. Nhân dân Chánh Hiệp</span>
            <span className="text-rose-900/80 text-xs">Tra cứu, đọc và làm theo Bác trong cuộc sống gia đình, tổ dân phố.</span>
          </div>
        </div>
      </div>

      {/* DANH SÁCH BÀI VIẾT HỌC BÁC & MÔ HÌNH SÁNG KIẾN MẶT TRẬN LIÊN THÔNG */}
      <div className="space-y-6">
        {(viewFilter === 'all' || viewFilter === 'actions') && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-rose-200 pb-2">
              <h3 className="text-base sm:text-lg font-serif font-extrabold text-rose-950 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-rose-800" />
                <span>Chuyên Đề Học Tập &amp; Làm Theo Bác Phường Chánh Hiệp</span>
              </h3>
              <span className="text-xs font-bold text-rose-700 bg-rose-100 px-2.5 py-1 rounded-full border border-rose-200">
                {actionsList.length} Bài viết cốt lõi
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {actionsList.map((model, idx) => {
                // Find linked initiatives
                const linkedInits = initiativesList.filter(
                  (init) =>
                    init.linkedHcmActionId === model.id ||
                    model.linkedInitiativeIds?.includes(init.id)
                );

                return (
                  <motion.div
                    key={model.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="rounded-3xl bg-gradient-to-br from-white via-rose-50/50 to-amber-50/30 border-2 border-rose-200 shadow-sm hover:shadow-md hover:border-rose-400 transition-all flex flex-col justify-between overflow-hidden"
                  >
                    {/* Ảnh minh họa mô hình */}
                    {model.imageUrl && (
                      <div className="relative h-48 w-full overflow-hidden bg-rose-950">
                        <img
                          src={model.imageUrl}
                          alt={model.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                        <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-rose-950/80 text-amber-200 text-xs font-bold border border-rose-300/40 backdrop-blur-sm">
                          {model.targetGroup}
                        </div>

                        {isAdmin && (
                          <button
                            onClick={() => setEditingItem({ type: 'chanh_hiep_action', data: model })}
                            className="absolute top-3 right-3 px-3 py-1 rounded-xl bg-amber-400 text-rose-950 font-extrabold text-xs flex items-center gap-1 shadow-md hover:bg-amber-300 transition cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Sửa bài viết</span>
                          </button>
                        )}
                      </div>
                    )}

                    <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-extrabold text-rose-700 uppercase tracking-wider">
                              Chuyên đề Học Bác • {model.neighborhood}
                            </span>
                            {!model.imageUrl && isAdmin && (
                              <button
                                onClick={() => setEditingItem({ type: 'chanh_hiep_action', data: model })}
                                className="px-2.5 py-1 rounded-lg bg-amber-400 text-rose-950 font-extrabold text-xs flex items-center gap-1 hover:bg-amber-300 transition cursor-pointer"
                              >
                                <Edit3 className="w-3 h-3" />
                                <span>Sửa</span>
                              </button>
                            )}
                          </div>
                          <h3 className="text-lg font-serif font-extrabold text-rose-950 leading-snug">
                            {model.title}
                          </h3>
                        </div>

                        {/* Lời Bác dạy là kim chỉ nam */}
                        {model.inspirationalQuote && (
                          <div className="p-3.5 rounded-2xl bg-white border border-rose-200 text-xs text-rose-950 italic font-serif space-y-1">
                            <div className="flex items-center gap-1 text-[11px] font-sans font-bold text-rose-900 not-italic">
                              <Quote className="w-3.5 h-3.5 text-rose-700" />
                              <span>Kim chỉ nam học tập:</span>
                            </div>
                            <p className="leading-relaxed">“{model.inspirationalQuote}”</p>
                          </div>
                        )}

                        {/* Mô tả mô hình */}
                        <p className="text-xs sm:text-sm text-rose-900/90 leading-relaxed">
                          {model.summary}
                        </p>

                        {/* Kết quả thực tiễn đạt được */}
                        {model.practicalResult && (
                          <div className="space-y-1.5 pt-2 border-t border-rose-200">
                            <h5 className="text-xs font-bold text-rose-950 uppercase flex items-center gap-1.5">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              <span>Kết quả nổi bật đạt được:</span>
                            </h5>
                            <p className="text-xs text-rose-900 font-medium leading-relaxed">
                              {model.practicalResult}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* KHU VỰC SÁNG KIẾN MẶT TRẬN LIÊN THÔNG */}
                      <div className="pt-3 border-t border-rose-200 space-y-2 mt-4 bg-amber-50/50 -mx-6 -mb-6 p-4 rounded-b-3xl border-t">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-amber-950 uppercase flex items-center gap-1">
                            <Lightbulb className="w-3.5 h-3.5 text-amber-700 fill-amber-300" />
                            <span>Mô hình &amp; Sáng kiến Mặt Trận Liên thông ({linkedInits.length}):</span>
                          </span>
                        </div>

                        {linkedInits.length > 0 ? (
                          <div className="space-y-2">
                            {linkedInits.map((init) => (
                              <div
                                key={init.id}
                                onClick={() => setSelectedInitiativeDetail(init)}
                                className="p-2.5 rounded-xl bg-white border border-amber-200 hover:border-amber-400 shadow-2xs transition cursor-pointer flex items-center justify-between gap-2 group"
                              >
                                <div className="space-y-0.5 min-w-0">
                                  <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                                    {init.unit}
                                  </span>
                                  <h5 className="text-xs font-bold text-rose-950 truncate group-hover:text-rose-700">
                                    {init.title}
                                  </h5>
                                </div>
                                <ArrowRight className="w-4 h-4 text-rose-600 shrink-0 group-hover:translate-x-0.5 transition" />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-[11px] text-amber-900/70 italic">
                            Chưa có sáng kiến tác nghiệp liên thông.
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {(viewFilter === 'all' || viewFilter === 'initiatives') && (
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between border-b border-rose-200 pb-2">
              <h3 className="text-base sm:text-lg font-serif font-extrabold text-rose-950 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-600 fill-amber-300" />
                <span>Mô Hình Nhân Rộng &amp; Sáng Kiến Tác Nghiệp Mặt Trận 21 Khu Phố</span>
              </h3>
              <span className="text-xs font-bold text-amber-900 bg-amber-100 px-2.5 py-1 rounded-full border border-amber-200">
                {initiativesList.length} Sáng kiến liên thông
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {initiativesList.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl border-2 border-rose-200 shadow-xs hover:shadow-md hover:border-rose-300 transition-all flex flex-col justify-between p-5 space-y-4 relative group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold text-rose-900 bg-rose-100 px-2.5 py-1 rounded-lg border border-rose-200">
                        {item.unit}
                      </span>
                      <span className="text-[11px] text-rose-700 font-medium">{item.date}</span>
                    </div>

                    <h4 className="text-sm font-bold text-rose-950 leading-snug group-hover:text-rose-700 transition">
                      {item.title}
                    </h4>

                    {item.linkedHcmTopicTitle && (
                      <div className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-[11px] font-semibold text-rose-900 flex items-start gap-1">
                        <BookOpen className="w-3.5 h-3.5 text-rose-700 shrink-0 mt-0.5" />
                        <span>Chuyên đề Học Bác: <strong>{item.linkedHcmTopicTitle}</strong></span>
                      </div>
                    )}

                    <p className="text-xs text-rose-900/80 leading-relaxed line-clamp-3">
                      {item.summary}
                    </p>

                    <div className="p-3 bg-emerald-50/80 rounded-2xl border border-emerald-200 space-y-1">
                      <div className="text-[10px] font-bold uppercase text-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Kết quả &amp; Tác động</span>
                      </div>
                      <p className="text-xs font-bold text-emerald-950 leading-tight">
                        {item.impact}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2 border-t border-rose-100">
                    <div className="flex flex-wrap gap-1">
                      {item.tags.map((tag) => (
                        <span key={tag} className="text-[10px] font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded-md">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => setSelectedInitiativeDetail(item)}
                        className="px-3 py-1.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-950 font-bold text-xs flex items-center gap-1 transition cursor-pointer"
                      >
                        <span>Chi tiết sáng kiến</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex items-center gap-1">
                        {isAdmin && (
                          <button
                            onClick={() => setEditingItem({ type: 'front_initiative', data: item })}
                            className="p-1.5 text-amber-800 hover:bg-amber-100 rounded-xl transition cursor-pointer"
                            title="Sửa sáng kiến"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => setQrModalItem({ title: item.title, url: window.location.href })}
                          className="p-1.5 text-rose-700 hover:bg-rose-100 rounded-xl transition cursor-pointer"
                          title="Tạo mã QR sáng kiến"
                        >
                          <QrCode className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* CHI TIẾT SÁNG KIẾN MẶT TRẬN MODAL */}
      {selectedInitiativeDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl border-2 border-rose-300 shadow-2xl max-w-lg w-full p-6 space-y-4 relative"
          >
            <button
              onClick={() => setSelectedInitiativeDetail(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-rose-100 text-rose-900 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-xs border border-amber-300 inline-block">
                {selectedInitiativeDetail.unit}
              </span>
              <h3 className="text-lg font-serif font-extrabold text-rose-950">
                {selectedInitiativeDetail.title}
              </h3>
            </div>

            {selectedInitiativeDetail.linkedHcmTopicTitle && (
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-900 space-y-1">
                <span className="text-[11px] font-bold uppercase text-rose-800 block">Liên thông Chuyên đề Học Bác:</span>
                <p className="font-serif italic font-bold">"{selectedInitiativeDetail.linkedHcmTopicTitle}"</p>
              </div>
            )}

            <div className="space-y-2 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 block uppercase">Nội dung cách làm &amp; giải pháp:</span>
                <p className="text-slate-800 leading-relaxed">{selectedInitiativeDetail.summary}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                <span className="font-bold text-emerald-900 block uppercase">Kết quả &amp; tác động thực tiễn:</span>
                <p className="text-emerald-950 font-medium leading-relaxed">{selectedInitiativeDetail.impact}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-rose-200">
              <span className="text-xs text-rose-700 font-medium">Thời gian ban hành: {selectedInitiativeDetail.date}</span>

              <button
                onClick={() => {
                  setSelectedInitiativeDetail(null);
                  setQrModalItem({ title: selectedInitiativeDetail.title, url: window.location.href });
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-300 text-rose-950 font-extrabold text-xs flex items-center gap-1.5 shadow-xs hover:brightness-105 transition cursor-pointer"
              >
                <QrCode className="w-4 h-4" />
                <span>Xuất mã QR chia sẻ</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* QR MODAL */}
      {qrModalItem && (
        <QrCodeModal
          isOpen={true}
          onClose={() => setQrModalItem(null)}
          title={qrModalItem.title}
          itemUrl={qrModalItem.url}
          category="Sáng kiến Mặt Trận Chánh Hiệp"
        />
      )}
    </div>
  );
};

