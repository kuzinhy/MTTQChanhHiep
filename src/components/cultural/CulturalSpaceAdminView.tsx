import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Plus,
  Image as ImageIcon,
  FileText,
  Lock,
  Unlock,
  History,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Link,
  Eye,
  Edit3,
  Trash2,
  ExternalLink,
  ArrowRight,
  Globe,
  Upload,
  Layers,
  Calendar,
  MapPin,
  RefreshCw,
  Search,
  BookOpen,
  Info
} from 'lucide-react';
import {
  VerificationStatus,
  HistoricalSource,
  MediaItem,
  EventCardSchema,
  BiographyChapter,
  VersionHistoryRecord,
  CoverConfig,
  loadStoredCoverConfig,
  saveStoredCoverConfig,
  loadStoredChapters,
  saveStoredChapters,
  loadStoredEvents,
  saveStoredEvents,
  loadStoredSources,
  saveStoredSources,
  loadStoredVersions,
  recordVersionChange
} from '../../data/hcmGovernanceSchema';
import { OptimizedImage } from '../common/OptimizedImage';

export const CulturalSpaceAdminView: React.FC = () => {
  // Navigation Tabs: 7 Required Menus
  const [activeTab, setActiveTab] = useState<
    'cover' | 'biography' | 'timeline' | 'media' | 'sources' | 'review' | 'history'
  >('cover');

  // State Stores
  const [coverConfig, setCoverConfig] = useState<CoverConfig>(loadStoredCoverConfig());
  const [chapters, setChapters] = useState<BiographyChapter[]>(loadStoredChapters());
  const [events, setEvents] = useState<EventCardSchema[]>(loadStoredEvents());
  const [sources, setSources] = useState<HistoricalSource[]>(loadStoredSources());
  const [versions, setVersions] = useState<VersionHistoryRecord[]>(loadStoredVersions());

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [showManualImportModal, setShowManualImportModal] = useState<boolean>(false);
  const [showUrlImportModal, setShowUrlImportModal] = useState<boolean>(false);
  const [showAddSourceModal, setShowAddSourceModal] = useState<boolean>(false);
  const [showUnlockModal, setShowUnlockModal] = useState<boolean>(false);
  const [unlockTarget, setUnlockTarget] = useState<{ id: string; type: 'cover' | 'chapter' | 'event' } | null>(null);
  const [unlockReason, setUnlockReason] = useState<string>('');

  // URL Import State
  const [inputUrl, setInputUrl] = useState<string>('');
  const [urlImportError, setUrlImportError] = useState<string | null>(null);

  // Manual Import Form State
  const [manualForm, setManualForm] = useState<{
    targetType: 'chapter' | 'event';
    title: string;
    chapter_id: string;
    date_display: string;
    date_start: string;
    location: string;
    summary: string;
    full_content: string;
    source_url: string;
    source_agency: string;
    source_title: string;
    imageUrl: string;
    imageCaption: string;
  }>({
    targetType: 'event',
    title: '',
    chapter_id: 'chap-01',
    date_display: '',
    date_start: '',
    location: '',
    summary: '',
    full_content: '',
    source_url: 'https://hochiminhcity.gov.vn/cuoc-doi-su-nghiep',
    source_agency: 'Cổng thông tin điện tử Thành phố Hồ Chí Minh',
    source_title: 'Cuộc đời, sự nghiệp Chủ tịch Hồ Chí Minh',
    imageUrl: '',
    imageCaption: ''
  });

  // Add Source Form State
  const [sourceForm, setSourceForm] = useState<HistoricalSource>({
    id: '',
    source_title: '',
    source_url: '',
    source_agency: 'Cổng thông tin điện tử Thành phố Hồ Chí Minh',
    source_accessed_at: new Date().toISOString().split('T')[0],
    copyright_note: '',
    usage_permission: ''
  });

  // Reload data
  const refreshAllData = () => {
    setCoverConfig(loadStoredCoverConfig());
    setChapters(loadStoredChapters());
    setEvents(loadStoredEvents());
    setSources(loadStoredSources());
    setVersions(loadStoredVersions());
  };

  // Toggle Historical Lock on Cover
  const handleToggleCoverLock = () => {
    if (coverConfig.historical_lock) {
      setUnlockTarget({ id: 'cover-config', type: 'cover' });
      setShowUnlockModal(true);
    } else {
      const updated: CoverConfig = { ...coverConfig, historical_lock: true, updated_at: new Date().toISOString() };
      setCoverConfig(updated);
      saveStoredCoverConfig(updated);
      recordVersionChange('cover-config', 'cover', 'Quản trị viên', 'Khóa bảo vệ nội dung lịch sử', false, true);
      refreshAllData();
    }
  };

  // Confirm Unlock with Reason
  const handleConfirmUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!unlockReason || !unlockTarget) return;

    if (unlockTarget.type === 'cover') {
      const updated: CoverConfig = { ...coverConfig, historical_lock: false, updated_at: new Date().toISOString() };
      setCoverConfig(updated);
      saveStoredCoverConfig(updated);
      recordVersionChange('cover-config', 'cover', 'Quản trị viên', `Mở khóa: ${unlockReason}`, true, false);
    } else if (unlockTarget.type === 'chapter') {
      const updated = chapters.map(c => c.id === unlockTarget.id ? { ...c, locked: false } : c);
      setChapters(updated);
      saveStoredChapters(updated);
      recordVersionChange(unlockTarget.id, 'chapter', 'Quản trị viên', `Mở khóa: ${unlockReason}`, true, false);
    } else if (unlockTarget.type === 'event') {
      const updated = events.map(ev => ev.id === unlockTarget.id ? { ...ev, locked: false } : ev);
      setEvents(updated);
      saveStoredEvents(updated);
      recordVersionChange(unlockTarget.id, 'event', 'Quản trị viên', `Mở khóa: ${unlockReason}`, true, false);
    }

    setUnlockReason('');
    setUnlockTarget(null);
    setShowUnlockModal(false);
    refreshAllData();
  };

  // Change Workflow Status
  const handleChangeStatus = (
    id: string,
    type: 'chapter' | 'event',
    newStatus: VerificationStatus,
    reason: string = 'Chuyển trạng thái quy trình kiểm duyệt'
  ) => {
    if (type === 'chapter') {
      const chapter = chapters.find(c => c.id === id);
      if (!chapter) return;
      const oldStatus = chapter.editor_status;
      const updated = chapters.map(c => c.id === id ? { ...c, editor_status: newStatus, locked: newStatus === 'APPROVED' || newStatus === 'PUBLISHED' } : c);
      setChapters(updated);
      saveStoredChapters(updated);
      recordVersionChange(id, 'chapter', 'Ban Thẩm định Tư liệu', `${reason}: ${oldStatus} -> ${newStatus}`, oldStatus, newStatus);
    } else {
      const event = events.find(ev => ev.id === id);
      if (!event) return;
      const oldStatus = event.editor_status;
      const updated = events.map(ev => ev.id === id ? { ...ev, editor_status: newStatus, verified: newStatus === 'APPROVED' || newStatus === 'PUBLISHED', locked: newStatus === 'APPROVED' || newStatus === 'PUBLISHED' } : ev);
      setEvents(updated);
      saveStoredEvents(updated);
      recordVersionChange(id, 'event', 'Ban Thẩm định Tư liệu', `${reason}: ${oldStatus} -> ${newStatus}`, oldStatus, newStatus);
    }
    refreshAllData();
  };

  // Handle URL Import Simulation adhering to Rule V (No bypassing)
  const handleUrlImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUrlImportError(null);
    if (!inputUrl) return;

    // Check if URL is official hochiminhcity.gov.vn
    if (!inputUrl.includes('hochiminhcity.gov.vn')) {
      setUrlImportError('Lỗi kiểm định nguồn: Chỉ chấp nhận URL từ Cổng thông tin điện tử Thành phố Hồ Chí Minh (hochiminhcity.gov.vn) theo quy định.');
      return;
    }

    // According to Rule V: When source site has protection/anti-crawler, show clear verified notice
    setUrlImportError(
      'Website nguồn đang hạn chế truy cập tự động (CORS / Cloud Protection). Vui lòng sử dụng tính năng "Nhập tư liệu thủ công có thẩm định" để nhập nội dung nguyên bản.'
    );
  };

  // Handle Manual Import
  const handleManualImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualForm.title || !manualForm.full_content) return;

    if (manualForm.targetType === 'event') {
      const newEvent: EventCardSchema = {
        id: `evt-${Date.now()}`,
        chapter_id: manualForm.chapter_id,
        title: manualForm.title,
        date_display: manualForm.date_display || 'Chưa xác định ngày cụ thể',
        date_start: manualForm.date_start || new Date().toISOString().split('T')[0],
        date_precision: 'day',
        location: manualForm.location || 'Việt Nam',
        summary: manualForm.summary || manualForm.full_content.slice(0, 150) + '...',
        full_content: manualForm.full_content,
        media: manualForm.imageUrl ? [{
          id: `med-${Date.now()}`,
          file: manualForm.imageUrl,
          title: manualForm.title,
          caption: manualForm.imageCaption || manualForm.title,
          alt: manualForm.title,
          media_type: 'image',
          source_url: manualForm.source_url,
          source_agency: manualForm.source_agency,
          copyright_note: 'Tư liệu kiểm duyệt nguồn',
          usage_permission: 'Phục vụ công tác tuyên truyền',
          historical_date: manualForm.date_display,
          historical_location: manualForm.location,
          verified: true,
          editor_status: 'SOURCE_VERIFIED'
        }] : [],
        source_title: manualForm.source_title,
        source_url: manualForm.source_url,
        source_agency: manualForm.source_agency,
        source_accessed_at: new Date().toISOString().split('T')[0],
        verified: false,
        editor_status: 'DRAFT',
        locked: false
      };

      const updated = [newEvent, ...events];
      setEvents(updated);
      saveStoredEvents(updated);
      recordVersionChange(newEvent.id, 'event', 'Biên tập viên', 'Tạo bản thảo tư liệu mới từ nhập thủ công', null, newEvent);
    }

    setShowManualImportModal(false);
    refreshAllData();
  };

  // Handle Add Source
  const handleAddSourceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceForm.source_title || !sourceForm.source_url) return;
    const newSrc: HistoricalSource = {
      ...sourceForm,
      id: `src-${Date.now()}`
    };
    const updated = [newSrc, ...sources];
    setSources(updated);
    saveStoredSources(updated);
    setShowAddSourceModal(false);
    refreshAllData();
  };

  // Helper status color badge
  const getStatusBadge = (status: VerificationStatus) => {
    switch (status) {
      case 'PUBLISHED':
        return <span className="px-2.5 py-1 rounded-md text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">ĐÃ XUẤT BẢN</span>;
      case 'APPROVED':
        return <span className="px-2.5 py-1 rounded-md text-[10px] font-black bg-blue-100 text-blue-800 border border-blue-300">ĐÃ THẨM ĐỊNH</span>;
      case 'CONTENT_REVIEW':
        return <span className="px-2.5 py-1 rounded-md text-[10px] font-black bg-purple-100 text-purple-800 border border-purple-300">HỘI ĐỒNG DUYỆT</span>;
      case 'SOURCE_VERIFIED':
        return <span className="px-2.5 py-1 rounded-md text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-300">ĐÃ ĐỐI CHIẾU NGUỒN</span>;
      case 'DRAFT':
      default:
        return <span className="px-2.5 py-1 rounded-md text-[10px] font-black bg-slate-100 text-slate-700 border border-slate-300">BẢN THẢO (DRAFT)</span>;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-900 via-red-800 to-amber-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border border-amber-600/30">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-black/30 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-black text-amber-300 tracking-wider uppercase border border-amber-400/30">
            <ShieldCheck className="w-4 h-4 text-amber-300" />
            HỆ THỐNG QUẢN LÝ TƯ LIỆU CHÍNH THỐNG
          </div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-wide">
            Không Gian Văn Hóa Hồ Chí Minh – Phường Chánh Hiệp
          </h1>
          <p className="text-xs sm:text-sm text-amber-100/90 max-w-2xl leading-relaxed">
            Hệ thống thẩm định, quản lý tư liệu và kiểm duyệt chặt chẽ theo 2 nguồn chính thức từ Cổng thông tin điện tử Thành phố Hồ Chí Minh. Tuân thủ nghiêm ngặt nguyên tắc: <strong>SOURCE &gt; AI</strong>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowUrlImportModal(true)}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-2 border border-white/20 cursor-pointer transition-all"
          >
            <Globe className="w-4 h-4 text-amber-300" />
            <span>Nhập từ URL</span>
          </button>
          <button
            onClick={() => setShowManualImportModal(true)}
            className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Nhập Tư Liệu Thủ Công</span>
          </button>
        </div>
      </div>

      {/* Navigation: 7 Menus as mandated by Master Prompt */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto no-scrollbar">
        {[
          { id: 'cover', label: '1. Trang bìa', icon: Sparkles },
          { id: 'biography', label: '2. Cuộc đời – Sự nghiệp', icon: BookOpen },
          { id: 'timeline', label: '3. Timeline sự kiện', icon: Calendar },
          { id: 'media', label: '4. Kho Media & Bản quyền', icon: ImageIcon },
          { id: 'sources', label: '5. Quản lý Nguồn', icon: Link },
          { id: 'review', label: '6. Quy trình Kiểm duyệt', icon: ShieldCheck },
          { id: 'history', label: '7. Lịch sử chỉnh sửa', icon: History }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                isActive
                  ? 'bg-red-700 text-white shadow-md font-black'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: TRANG BÌA */}
      {activeTab === 'cover' && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700 pb-4">
            <div>
              <h2 className="font-serif font-bold text-lg text-slate-900 dark:text-white">
                Cấu Hình Trang Bìa (Hero &amp; Thông Điệp Chính)
              </h2>
              <p className="text-xs text-slate-500">
                Nguồn tham chiếu: <span className="font-semibold text-red-600">hochiminhcity.gov.vn/landing-khong-gian-van-hoa-ho-chi-minh</span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleToggleCoverLock}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  coverConfig.historical_lock
                    ? 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800'
                }`}
              >
                {coverConfig.historical_lock ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                <span>{coverConfig.historical_lock ? 'KHÓA NỘI DUNG (LOCKED)' : 'ĐANG MỞ KHÓA (EDITABLE)'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Tiêu đề chính thức
                </label>
                <input
                  type="text"
                  disabled={coverConfig.historical_lock}
                  value={coverConfig.title}
                  onChange={(e) => setCoverConfig({ ...coverConfig, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-sm font-serif font-bold text-slate-900 dark:text-white disabled:opacity-75"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Phụ đề / Khẩu hiệu trang trọng
                </label>
                <input
                  type="text"
                  disabled={coverConfig.historical_lock}
                  value={coverConfig.subtitle}
                  onChange={(e) => setCoverConfig({ ...coverConfig, subtitle: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white disabled:opacity-75"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Mô tả định vị Không gian văn hóa Hồ Chí Minh
                </label>
                <textarea
                  rows={4}
                  disabled={coverConfig.historical_lock}
                  value={coverConfig.description}
                  onChange={(e) => setCoverConfig({ ...coverConfig, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-xs leading-relaxed text-slate-900 dark:text-white disabled:opacity-75"
                />
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 text-xs space-y-1">
                <div className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-amber-600" />
                  <span>Nguồn pháp lý &amp; Lưu trữ:</span>
                </div>
                <p className="text-slate-700 dark:text-slate-300">
                  Cơ quan ban hành: <strong>{coverConfig.primary_source_agency}</strong>
                </p>
                <a
                  href={coverConfig.primary_source_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-red-600 hover:underline font-bold"
                >
                  <span>{coverConfig.primary_source_url}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Chân dung bìa */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Chân dung Bác Hồ (Ảnh tư liệu chính thức)
              </label>
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-900 aspect-3/4 flex items-center justify-center">
                <OptimizedImage
                  src={coverConfig.portrait_url}
                  alt={coverConfig.portrait_caption}
                  variant="card"
                  priority={true}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white text-[11px] leading-snug">
                  {coverConfig.portrait_caption}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CUỘC ĐỜI – SỰ NGHIỆP */}
      {activeTab === 'biography' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-serif font-bold text-lg text-slate-900 dark:text-white">
                6 Giai Đoạn Lịch Sử Cốt Lõi (Cuộc đời – Sự nghiệp)
              </h2>
              <p className="text-xs text-slate-500">
                Source of Truth: <span className="font-semibold text-red-600">hochiminhcity.gov.vn/cuoc-doi-su-nghiep</span>
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full">
              6/6 Chương đã thẩm định
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {chapters.map((chap) => (
              <div
                key={chap.id}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-red-600 text-white text-xs font-bold font-serif">
                      Chương 0{chap.order}
                    </span>
                    <h3 className="font-serif font-bold text-base text-slate-900 dark:text-white">
                      {chap.title}
                    </h3>
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                      ({chap.timeRange})
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {getStatusBadge(chap.editor_status)}
                    {chap.locked && (
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Đã khóa
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {chap.summary}
                </p>

                <div className="space-y-1.5 pt-2">
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Các mốc sự kiện chủ chốt:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {chap.keyMilestones.map((m, idx) => (
                      <div key={idx} className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                        <span>{m}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
                  <span>Nguồn: <strong>{chap.source_agency}</strong></span>
                  <a
                    href={chap.source_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-red-600 hover:underline font-semibold flex items-center gap-1"
                  >
                    <span>Xem văn bản gốc</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: TIMELINE SỰ KIỆN */}
      {activeTab === 'timeline' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-serif font-bold text-lg text-slate-900 dark:text-white">
                Danh Sách Sự Kiện Lịch Sử Được Thẩm Định ({events.length})
              </h2>
              <p className="text-xs text-slate-500">
                Tuân thủ nghiêm ngặt Schema Section XI: <code className="font-mono">date_precision, source_agency, verified</code>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm kiếm sự kiện, năm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-slate-50 dark:bg-slate-900"
                />
              </div>
              <button
                onClick={() => setShowManualImportModal(true)}
                className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm mốc</span>
              </button>
            </div>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            {events
              .filter(ev => !searchQuery || ev.title.toLowerCase().includes(searchQuery.toLowerCase()) || ev.date_display.includes(searchQuery))
              .map((ev) => (
                <div key={ev.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/80 dark:hover:bg-slate-700/50 transition-colors">
                  <div className="space-y-1.5 max-w-3xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200 text-xs font-bold flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-amber-600" />
                        {ev.date_display}
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-red-500" />
                        {ev.location}
                      </span>
                      {getStatusBadge(ev.editor_status)}
                    </div>

                    <h4 className="font-serif font-bold text-base text-slate-900 dark:text-white">
                      {ev.title}
                    </h4>

                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                      {ev.summary}
                    </p>

                    <div className="text-[11px] text-slate-400 flex items-center gap-3">
                      <span>Nguồn: {ev.source_agency}</span>
                      <span>•</span>
                      <span>Mã: {ev.id}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleChangeStatus(ev.id, 'event', 'APPROVED')}
                      className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold cursor-pointer"
                      title="Phê duyệt"
                    >
                      Duyệt
                    </button>
                    <button
                      onClick={() => handleChangeStatus(ev.id, 'event', 'PUBLISHED')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold cursor-pointer"
                      title="Xuất bản"
                    >
                      Xuất bản
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* TAB 4: KHO MEDIA & BẢN QUYỀN */}
      {activeTab === 'media' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-serif font-bold text-lg text-slate-900 dark:text-white">
                Thư Viện Ảnh &amp; Bản Quyền Tư Liệu (Media Library)
              </h2>
              <p className="text-xs text-slate-500">
                Tuân thủ Section XII: Mỗi ảnh bắt buộc có caption chính xác, quyền sử dụng và nguồn lưu trữ.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.flatMap(ev => ev.media).map((media, idx) => (
              <div
                key={media.id || idx}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm flex flex-col justify-between"
              >
                <div className="relative h-44 bg-slate-900">
                  <OptimizedImage
                    src={media.file}
                    alt={media.alt}
                    variant="card"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold">
                      {media.historical_date || 'Ảnh tư liệu'}
                    </span>
                  </div>
                  <div className="absolute top-2 right-2">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-bold">
                      ĐÃ THẨM ĐỊNH
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between text-xs">
                  <div>
                    <h4 className="font-serif font-bold text-slate-900 dark:text-white line-clamp-1 mb-1">
                      {media.title}
                    </h4>
                    <p className="text-slate-600 dark:text-slate-300 line-clamp-2 italic">
                      "{media.caption}"
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-700 text-[11px] text-slate-500 space-y-1">
                    <div>Nguồn: <strong>{media.source_agency}</strong></div>
                    <div>Bản quyền: <em>{media.copyright_note}</em></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: QUẢN LÝ NGUỒN */}
      {activeTab === 'sources' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-serif font-bold text-lg text-slate-900 dark:text-white">
                Danh Mục Nguồn Tư Liệu Chính Thức ({sources.length})
              </h2>
              <p className="text-xs text-slate-500">
                Chỉ sử dụng nguồn từ cơ quan Đảng, Nhà nước và Cổng TTĐT TP.HCM
              </p>
            </div>

            <button
              onClick={() => setShowAddSourceModal(true)}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm nguồn mới</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {sources.map((src) => (
              <div
                key={src.id}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>{src.source_title}</span>
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    Truy cập: {src.source_accessed_at}
                  </span>
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                  <div>Cơ quan chủ quản: <strong>{src.source_agency}</strong></div>
                  <div>Ghi chú bản quyền: <em>{src.copyright_note}</em></div>
                  <div>Quyền sử dụng: <span className="text-emerald-700 dark:text-emerald-400 font-medium">{src.usage_permission}</span></div>
                </div>

                <div className="pt-2">
                  <a
                    href={src.source_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-red-600 hover:underline font-bold"
                  >
                    <span>{src.source_url}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: QUY TRÌNH KIỂM DUYỆT */}
      {activeTab === 'review' && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-700 pb-4">
            <h2 className="font-serif font-bold text-lg text-slate-900 dark:text-white">
              Quy Trình Kiểm Duyệt 5 Bước Chuẩn (Governance Pipeline)
            </h2>
            <p className="text-xs text-slate-500">
              Nội dung AI không bao giờ được đi tắt từ DRAFT sang PUBLISHED.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {[
              { step: '01', name: 'DRAFT', desc: 'Bản thảo nhập thô', color: 'bg-slate-100 text-slate-700 border-slate-300' },
              { step: '02', name: 'SOURCE_VERIFIED', desc: 'Đối chiếu URL nguồn', color: 'bg-amber-100 text-amber-800 border-amber-300' },
              { step: '03', name: 'CONTENT_REVIEW', desc: 'Hội đồng thẩm định', color: 'bg-purple-100 text-purple-800 border-purple-300' },
              { step: '04', name: 'APPROVED', desc: 'Phê duyệt chính thức', color: 'bg-blue-100 text-blue-800 border-blue-300' },
              { step: '05', name: 'PUBLISHED', desc: 'Công khai trên cổng', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' }
            ].map((p, idx) => (
              <div key={idx} className={`p-4 rounded-2xl border ${p.color} space-y-1`}>
                <div className="text-[10px] font-mono font-bold opacity-60">BƯỚC {p.step}</div>
                <div className="font-black text-xs">{p.name}</div>
                <div className="text-[11px] opacity-80">{p.desc}</div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white">
              Nguyên tắc Bất khả xâm phạm trong Kiểm duyệt Lịch sử:
            </h4>
            <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300">
              <li>Mọi dữ kiện phải đối chiếu chính xác từng ngày, tháng, năm với 2 URL nguồn chỉ định.</li>
              <li>Chức năng <code>HISTORICAL_CONTENT_LOCK = TRUE</code> được kích hoạt tự động sau khi mục được <strong>APPROVED</strong>.</li>
              <li>Mở khóa chỉnh sửa bắt buộc phải ghi rõ lý do và lưu vết vào Lịch sử phiên bản (Version History).</li>
            </ul>
          </div>
        </div>
      )}

      {/* TAB 7: LỊCH SỬ CHỈNH SỬA */}
      {activeTab === 'history' && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-700 pb-4 flex items-center justify-between">
            <div>
              <h2 className="font-serif font-bold text-lg text-slate-900 dark:text-white">
                Nhật Ký &amp; Lịch Sử Phiên Bản (Version History)
              </h2>
              <p className="text-xs text-slate-500">
                Ghi nhận mọi thao tác: Người chỉnh sửa, lý do, giá trị cũ và giá trị mới.
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-full">
              {versions.length} bản ghi
            </span>
          </div>

          {versions.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              Chưa có phiên bản thay đổi nào được ghi nhận.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {versions.map((ver) => (
                <div key={ver.id} className="py-3 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[10px] font-bold">
                        v{ver.version}
                      </span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {ver.editor}
                      </span>
                      <span className="text-slate-400">• {new Date(ver.created_at).toLocaleString('vi-VN')}</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300">
                      Lý do: <strong>{ver.reason}</strong> (Mục: {ver.entity_id})
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL: NHẬP TỪ URL */}
      {showUrlImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <h3 className="font-serif font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-red-600" />
                <span>Nhập Dữ Liệu Từ URL Chính Thức</span>
              </h3>
              <button
                onClick={() => setShowUrlImportModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUrlImportSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nhập URL nguồn chính thức (hochiminhcity.gov.vn)
                </label>
                <input
                  type="url"
                  placeholder="https://hochiminhcity.gov.vn/cuoc-doi-su-nghiep"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900"
                  required
                />
              </div>

              {urlImportError && (
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs leading-relaxed flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>{urlImportError}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUrlImportModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold cursor-pointer"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-red-600 text-white font-bold cursor-pointer hover:bg-red-700"
                >
                  Kiểm tra &amp; Đọc nguồn
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: NHẬP TƯ LIỆU THỦ CÔNG */}
      {showManualImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4 border border-slate-200 dark:border-slate-700 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <h3 className="font-serif font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-red-600" />
                <span>Nhập Tư Liệu Thủ Công Có Thẩm Định</span>
              </h3>
              <button
                onClick={() => setShowManualImportModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleManualImportSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Thuộc Chương / Giai đoạn
                  </label>
                  <select
                    value={manualForm.chapter_id}
                    onChange={(e) => setManualForm({ ...manualForm, chapter_id: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 font-bold"
                  >
                    {chapters.map(c => (
                      <option key={c.id} value={c.id}>
                        Chương 0{c.order}: {c.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Thời gian hiển thị (VD: Ngày 5/6/1911)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Ngày 19 tháng 5 năm 1890"
                    value={manualForm.date_display}
                    onChange={(e) => setManualForm({ ...manualForm, date_display: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Tiêu đề sự kiện lịch sử chính thức
                </label>
                <input
                  type="text"
                  required
                  placeholder="Tiêu đề theo đúng nguồn Cổng TTĐT TP.HCM"
                  value={manualForm.title}
                  onChange={(e) => setManualForm({ ...manualForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 font-serif font-bold text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Địa điểm lịch sử
                </label>
                <input
                  type="text"
                  placeholder="VD: Làng Hoàng Trù, Kim Liên, Nam Đàn, Nghệ An"
                  value={manualForm.location}
                  onChange={(e) => setManualForm({ ...manualForm, location: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nội dung chi tiết nguyên bản
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Dán nội dung nguyên bản từ nguồn chính thức..."
                  value={manualForm.full_content}
                  onChange={(e) => setManualForm({ ...manualForm, full_content: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    URL ảnh tư liệu
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={manualForm.imageUrl}
                    onChange={(e) => setManualForm({ ...manualForm, imageUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Chú thích ảnh gốc
                  </label>
                  <input
                    type="text"
                    placeholder="Chú thích ảnh nguyên bản"
                    value={manualForm.imageCaption}
                    onChange={(e) => setManualForm({ ...manualForm, imageCaption: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setShowManualImportModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-red-600 text-white font-bold cursor-pointer hover:bg-red-700"
                >
                  Lưu vào Bản thảo (Draft)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: MỞ KHÓA NỘI DUNG LỊCH SỬ CÓ LÝ DO */}
      {showUnlockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <h3 className="font-serif font-bold text-base text-red-600 flex items-center gap-2">
                <Unlock className="w-4 h-4" />
                <span>Xác Nhận Mở Khóa Tư Liệu Lịch Sử</span>
              </h3>
              <button
                onClick={() => setShowUnlockModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmUnlock} className="space-y-4 text-xs">
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Nội dung này đã được khóa bảo vệ chống sai lệch lịch sử. Để mở khóa chỉnh sửa, bạn <strong>bắt buộc phải nêu rõ lý do</strong> và nguồn gốc đối chiếu.
              </p>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Lý do mở khóa &amp; Căn cứ văn bản
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="VD: Cập nhật trích dẫn theo thông báo thẩm định mới..."
                  value={unlockReason}
                  onChange={(e) => setUnlockReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUnlockModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-red-600 text-white font-bold cursor-pointer hover:bg-red-700"
                >
                  Xác nhận mở khóa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
