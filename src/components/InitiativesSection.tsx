import React, { useState, useEffect } from 'react';
import { Lightbulb, ThumbsUp, Download, Share2, Sparkles, Eye, CheckCircle2, QrCode, BookOpen, ArrowRight, X } from 'lucide-react';
import { QrCodeModal } from './QrCodeModal';
import { FrontInitiative, ChanhHiepActionModel } from '../data/hcmVerifiedMuseumData';
import { loadStoredInitiatives, saveStoredInitiatives, loadStoredChanhHiepActions } from '../lib/hcmDataStore';

export const InitiativesSection: React.FC = () => {
  const [initiatives, setInitiatives] = useState<FrontInitiative[]>(() => loadStoredInitiatives());
  const [hcmActions, setHcmActions] = useState<ChanhHiepActionModel[]>(() => loadStoredChanhHiepActions());
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [qrModalItem, setQrModalItem] = useState<{ title: string; url: string } | null>(null);
  const [selectedHcmActionModal, setSelectedHcmActionModal] = useState<ChanhHiepActionModel | null>(null);

  useEffect(() => {
    setInitiatives(loadStoredInitiatives());
    setHcmActions(loadStoredChanhHiepActions());
  }, []);

  const handleLike = (id: string) => {
    const isLiked = likedMap[id];
    setLikedMap((prev) => ({ ...prev, [id]: !isLiked }));
    const updated = initiatives.map((item) =>
      item.id === id ? { ...item, likes: item.likes + (isLiked ? -1 : 1) } : item
    );
    setInitiatives(updated);
    saveStoredInitiatives(updated);
  };

  const handleViewHcmAction = (actionId?: string, topicTitle?: string) => {
    const found = hcmActions.find(
      (a) => a.id === actionId || (topicTitle && a.title.toLowerCase().includes(topicTitle.toLowerCase()))
    ) || hcmActions[0];

    if (found) {
      setSelectedHcmActionModal(found);
    }
  };

  return (
    <section className="py-10 px-4 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-700 via-indigo-600 to-sky-700 text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-xs">
            <Lightbulb className="w-4 h-4 fill-amber-950" />
            <span>KHO SÁNG KIẾN &amp; MÔ HÌNH HAY MẶT TRẬN</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Mô Hình Nhân Rộng &amp; Sáng Kiến Tác Nghiệp Mặt Trận 21 Khu Phố
          </h2>
          <p className="text-xs text-blue-100 max-w-2xl">
            Các giải pháp, sáng kiến tác nghiệp Mặt Trận liên thông trực tiếp với Chuyên đề Học tập và Làm theo Tư tưởng, Đạo đức, Phong cách Hồ Chí Minh Phường Chánh Hiệp.
          </p>
        </div>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {initiatives.map((item) => {
          const isLiked = likedMap[item.id];
          return (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between p-5 space-y-4 relative group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-black text-blue-800 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                    {item.unit}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">{item.date}</span>
                </div>

                <h3 className="text-sm font-black text-slate-900 group-hover:text-blue-700 transition leading-snug">
                  {item.title}
                </h3>

                {/* Badge Liên thông Học Bác */}
                {item.linkedHcmTopicTitle && (
                  <button
                    onClick={() => handleViewHcmAction(item.linkedHcmActionId, item.linkedHcmTopicTitle)}
                    className="w-full text-left p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-xs text-rose-950 transition flex items-center justify-between gap-2 cursor-pointer group/badge"
                  >
                    <div className="flex items-start gap-1.5 min-w-0">
                      <BookOpen className="w-3.5 h-3.5 text-rose-700 shrink-0 mt-0.5" />
                      <span className="line-clamp-1 font-semibold">
                        Gắn liền Học Bác: <strong className="text-rose-900">{item.linkedHcmTopicTitle}</strong>
                      </span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-rose-700 shrink-0 group-hover/badge:translate-x-0.5 transition" />
                  </button>
                )}

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {item.summary}
                </p>

                <div className="p-3 bg-emerald-50/80 rounded-2xl border border-emerald-100 space-y-1">
                  <div className="text-[10px] font-black uppercase text-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Kết quả &amp; Tác động</span>
                  </div>
                  <p className="text-xs font-semibold text-emerald-950 leading-tight">
                    {item.impact}
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="flex flex-wrap gap-1.5">
                  {item.tags.map((tag) => (
                    <span key={tag} className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <button
                    onClick={() => handleLike(item.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                      isLiked 
                        ? 'bg-blue-600 text-white shadow-xs' 
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? 'fill-white' : ''}`} />
                    <span>{item.likes} Hữu ích</span>
                  </button>

                  <button
                    onClick={() => setQrModalItem({ title: item.title, url: window.location.href })}
                    className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition cursor-pointer"
                    title="Mã QR Sáng kiến"
                  >
                    <QrCode className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL XEM BÀI VIẾT HỌC BÁC LIÊN THÔNG */}
      {selectedHcmActionModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border-2 border-rose-300 shadow-2xl max-w-lg w-full p-6 space-y-4 relative">
            <button
              onClick={() => setSelectedHcmActionModal(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-rose-100 text-rose-900 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-900 font-bold text-xs border border-rose-200 inline-block">
                Chuyên đề Học Tập Bác • {selectedHcmActionModal.neighborhood}
              </span>
              <h3 className="text-lg font-serif font-extrabold text-rose-950">
                {selectedHcmActionModal.title}
              </h3>
            </div>

            {selectedHcmActionModal.inspirationalQuote && (
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs italic font-serif text-amber-950">
                <span className="font-sans font-bold text-amber-900 not-italic block mb-0.5">Kim chỉ nam:</span>
                “{selectedHcmActionModal.inspirationalQuote}”
              </div>
            )}

            <div className="space-y-2 text-xs">
              <p className="text-slate-800 leading-relaxed font-normal">
                {selectedHcmActionModal.summary}
              </p>
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                <span className="font-bold text-emerald-900 block">Kết quả thực tiễn:</span>
                <p className="text-emerald-950 font-medium">{selectedHcmActionModal.practicalResult}</p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedHcmActionModal(null)}
                className="px-4 py-2 rounded-xl bg-rose-800 text-white font-bold text-xs hover:bg-rose-900 transition cursor-pointer"
              >
                Đóng cửa sổ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Modal */}
      {qrModalItem && (
        <QrCodeModal
          isOpen={true}
          onClose={() => setQrModalItem(null)}
          title={qrModalItem.title}
          itemUrl={qrModalItem.url}
          category="Mô hình Hay MTTQ"
        />
      )}
    </section>
  );
};

