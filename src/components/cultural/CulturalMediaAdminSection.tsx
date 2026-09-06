import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  BookOpen,
  Quote,
  MapPin,
  HeartHandshake,
  Plus,
  Edit3,
  Trash2,
  Upload,
  Search,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  Calendar,
  Radio,
  FileText,
  Clock,
  Layers,
  Image as ImageIcon,
  Camera,
  Film,
  Video
} from 'lucide-react';
import {
  HistoricalAudio,
  HistoricalWork,
  VerifiedQuote,
  HistoricalVideo,
  HISTORICAL_VIDEOS,
  FootstepLocation,
  ChanhHiepActionModel,
  HISTORICAL_AUDIOS,
  HISTORICAL_WORKS,
  VERIFIED_QUOTES,
  FOOTSTEP_LOCATIONS,
  CHANH_HIEP_ACTION_MODELS
} from '../../data/hcmVerifiedMuseumData';
import {
  loadStoredAudios,
  saveStoredAudios,
  loadStoredVideos,
  saveStoredVideos,
  resetStoredVideos,
  loadStoredWorks,
  saveStoredWorks,
  loadStoredQuotes,
  saveStoredQuotes,
  loadStoredFootsteps,
  saveStoredFootsteps,
  loadStoredChanhHiepActions,
  saveStoredChanhHiepActions
} from '../../lib/hcmDataStore';
import { UniversalHcmEditorModal, EditableHcmItemType } from './UniversalHcmEditorModal';
import { uploadMediaToCloudinary } from '../../lib/cloudinaryService';
import { OptimizedImage } from '../common/OptimizedImage';

export interface CulturalMediaAdminSectionProps {
  onShowToast?: (title: string, message: string) => void;
  onOpenSpaceModal?: () => void;
}

export const CulturalMediaAdminSection: React.FC<CulturalMediaAdminSectionProps> = ({
  onShowToast,
  onOpenSpaceModal
}) => {
  // Navigation Sub-tab
  const [subTab, setSubTab] = useState<'audios' | 'videos' | 'works' | 'quotes' | 'footsteps' | 'actions'>('audios');

  // Search keyword
  const [searchTerm, setSearchTerm] = useState('');

  // Stores
  const [audios, setAudios] = useState<HistoricalAudio[]>(() => loadStoredAudios());
  const [videos, setVideos] = useState<HistoricalVideo[]>(() => loadStoredVideos());
  const [works, setWorks] = useState<HistoricalWork[]>(() => loadStoredWorks());
  const [quotes, setQuotes] = useState<VerifiedQuote[]>(() => loadStoredQuotes());
  const [footsteps, setFootsteps] = useState<FootstepLocation[]>(() => loadStoredFootsteps());
  const [actions, setActions] = useState<ChanhHiepActionModel[]>(() => loadStoredChanhHiepActions());

  // Universal Editor Modal State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editorItemType, setEditorItemType] = useState<EditableHcmItemType>('audio');
  const [editingItemData, setEditingItemData] = useState<any>(null);

  // Audio Player State for Admin Testing
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackErrorId, setPlaybackErrorId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Direct Audio Fast-Upload state
  const [isFastUploadingAudio, setIsFastUploadingAudio] = useState(false);
  const [uploadingAvatarId, setUploadingAvatarId] = useState<string | null>(null);

  // Quote Category filter
  const [selectedQuoteCategory, setSelectedQuoteCategory] = useState<string>('ALL');

  useEffect(() => {
    setAudios(loadStoredAudios());
    setWorks(loadStoredWorks());
    setQuotes(loadStoredQuotes());
    setFootsteps(loadStoredFootsteps());
    setActions(loadStoredChanhHiepActions());
  }, []);

  const triggerNotify = (title: string, msg: string) => {
    if (onShowToast) {
      onShowToast(title, msg);
    }
  };

  // Helper to resolve audio URL
  const resolveAudioUrl = (url?: string) => {
    if (!url) return '';
    if (url.startsWith('/uploads/')) return url;
    if (url.includes('hochiminh.vn') || url.includes('baochinhphu.vn')) {
      return `/api/media/proxy?url=${encodeURIComponent(url)}`;
    }
    return url;
  };

  // Audio toggle playback
  const handleTogglePlay = (audio: HistoricalAudio) => {
    if (!audioRef.current) return;

    if (playingAudioId === audio.id && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setPlaybackErrorId(null);
      const src = resolveAudioUrl(audio.audioUrl);
      if (!src) {
        setPlaybackErrorId(audio.id);
        triggerNotify('Thiếu URL âm thanh', 'Bản ghi âm chưa có đường dẫn tệp âm thanh hợp lệ.');
        return;
      }

      setPlayingAudioId(audio.id);
      audioRef.current.src = src;
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.warn('Audio play error:', err);
        setPlaybackErrorId(audio.id);
        setIsPlaying(false);
        triggerNotify('Lỗi phát âm thanh', 'Không thể nạp tệp âm thanh. Vui lòng kiểm tra lại nguồn hoặc proxy.');
      });
    }
  };

  // Direct Audio Upload handler
  const handleDirectAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsFastUploadingAudio(true);
    try {
      const res = await uploadMediaToCloudinary(file, 'cultural-audio');
      if (res.success && res.image) {
        const audioUrl = res.image.secureUrl || res.image.url;
        const newAudio: HistoricalAudio = {
          id: `aud-${Date.now()}`,
          title: file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' '),
          dateStr: new Date().toLocaleDateString('vi-VN'),
          duration: 'Đang xác định',
          occasion: 'Tư liệu âm thanh mới tải lên hệ thống',
          sourceAgency: 'Trung tâm Lưu trữ Phường Chánh Hiệp & Tư liệu Lịch sử',
          audioUrl: audioUrl,
          historicalNote: `Tệp âm thanh tải lên trực tiếp (${(file.size / (1024 * 1024)).toFixed(2)} MB)`,
          transcript: 'Đang cập nhật nội dung ghi âm chính xác...',
          verificationStatus: 'VERIFIED'
        };

        const updatedList = [newAudio, ...audios];
        setAudios(updatedList);
        saveStoredAudios(updatedList);
        triggerNotify('Tải âm thanh thành công', `Đã lưu tệp âm thanh "${newAudio.title}" vào kho tư liệu!`);
      } else {
        triggerNotify('Tải thất bại', res.error || 'Có lỗi xảy ra khi nạp tệp âm thanh.');
      }
    } catch (err: any) {
      triggerNotify('Lỗi kết nối', err?.message || 'Không thể tải tệp âm thanh lên máy chủ.');
    } finally {
      setIsFastUploadingAudio(false);
      e.target.value = '';
    }
  };

  // Direct avatar upload for individual cultural items
  const handleItemAvatarUpload = async (
    type: 'audio' | 'work' | 'footstep' | 'action',
    itemId: string,
    file: File
  ) => {
    setUploadingAvatarId(itemId);
    try {
      const result = await uploadMediaToCloudinary(file, 'cultural-avatars');
      if (result.success && result.image) {
        const newImageUrl = result.image.secureUrl || result.image.url;
        if (type === 'audio') {
          const updated = audios.map(a => a.id === itemId ? { ...a, imageUrl: newImageUrl } : a);
          setAudios(updated);
          saveStoredAudios(updated);
          triggerNotify('Đã cập nhật ảnh đại diện', 'Ảnh đại diện bản ghi âm đã được tải lên và lưu trữ thành công.');
        } else if (type === 'work') {
          const updated = works.map(w => w.id === itemId ? { ...w, imageUrl: newImageUrl } : w);
          setWorks(updated);
          saveStoredWorks(updated);
          triggerNotify('Đã cập nhật ảnh tư liệu', 'Ảnh bìa tác phẩm đã được lưu trữ thành công.');
        } else if (type === 'footstep') {
          const updated = footsteps.map(f => f.id === itemId ? { ...f, imageUrl: newImageUrl } : f);
          setFootsteps(updated);
          saveStoredFootsteps(updated);
          triggerNotify('Đã cập nhật ảnh di tích', 'Ảnh di tích dấu chân Bác đã được lưu trữ thành công.');
        } else if (type === 'action') {
          const updated = actions.map(ac => ac.id === itemId ? { ...ac, imageUrl: newImageUrl } : ac);
          setActions(updated);
          saveStoredChanhHiepActions(updated);
          triggerNotify('Đã cập nhật ảnh mô hình', 'Ảnh mô hình học Bác đã được lưu trữ thành công.');
        }
      } else {
        triggerNotify('Tải ảnh thất bại', result.error || 'Có lỗi xảy ra khi nạp ảnh.');
      }
    } catch (err: any) {
      console.error('Avatar upload error:', err);
      triggerNotify('Lỗi tải ảnh', err?.message || 'Không thể tải ảnh lên máy chủ.');
    } finally {
      setUploadingAvatarId(null);
    }
  };

  // Modal Open For Editing
  const openEditor = (type: EditableHcmItemType, item: any) => {
    setEditorItemType(type);
    setEditingItemData(item);
    setIsEditorOpen(true);
  };

  // Modal Open For Adding
  const openAddModal = (type: EditableHcmItemType) => {
    setEditorItemType(type);
    let defaultItem: any = {};
    const timestamp = Date.now();

    if (type === 'audio') {
      defaultItem = {
        id: `aud-${timestamp}`,
        title: '',
        dateStr: new Date().toLocaleDateString('vi-VN'),
        duration: '',
        occasion: '',
        sourceAgency: 'Đài Tiếng nói Việt Nam (VOV)',
        audioUrl: '',
        imageUrl: '',
        historicalNote: '',
        transcript: '',
        verificationStatus: 'VERIFIED'
      };
    } else if (type === 'video') {
      defaultItem = {
        id: `vid-${timestamp}`,
        title: '',
        youtubeUrl: '',
        youtubeVideoId: '',
        duration: '',
        dateStr: `${new Date().getFullYear()}`,
        occasion: '',
        sourceAgency: 'Đài Truyền hình Việt Nam (VTV)',
        category: 'Phim tài liệu lịch sử',
        imageUrl: '',
        description: '',
        historicalNote: '',
        verificationStatus: 'VERIFIED'
      };
    } else if (type === 'work') {
      defaultItem = {
        id: `wk-${timestamp}`,
        title: '',
        penName: 'Hồ Chí Minh',
        year: `${new Date().getFullYear()}`,
        publishedPlace: 'Hà Nội',
        historicalContext: '',
        summary: '',
        keyIdeas: [''],
        volume: 1,
        pageRange: '1',
        publisher: 'NXB Chính trị quốc gia Sự thật',
        officialSourceUrl: 'https://hochiminh.vn/',
        verificationStatus: 'VERIFIED'
      };
    } else if (type === 'quote') {
      defaultItem = {
        id: `qt-${timestamp}`,
        quoteText: '',
        category: 'Đại đoàn kết',
        occasion: '',
        dateStr: `${new Date().getFullYear()}`,
        originalWork: '',
        volume: 1,
        page: '1',
        publisher: 'NXB Chính trị quốc gia Sự thật',
        officialUrl: 'https://hochiminh.vn/',
        verificationStatus: 'VERIFIED'
      };
    } else if (type === 'footstep') {
      defaultItem = {
        id: `loc-${timestamp}`,
        name: '',
        country: 'Việt Nam',
        periodYears: '',
        coordinates: [10.7681, 106.7067],
        aliasUsed: 'Nguyễn Tất Thành',
        historicalAction: '',
        primaryRelic: '',
        sourceReference: 'Hồ Chí Minh – Biên niên tiểu sử'
      };
    } else if (type === 'chanh_hiep_action') {
      defaultItem = {
        id: `act-${timestamp}`,
        title: '',
        targetGroup: 'Khu phố 1',
        neighborhood: 'Khu phố 1',
        summary: '',
        practicalResult: '',
        inspirationalQuote: 'Đoàn kết, đoàn kết, đại đoàn kết. Thành công, thành công, đại thành công.',
        updatedDate: new Date().toLocaleDateString('vi-VN')
      };
    }

    setEditingItemData(defaultItem);
    setIsEditorOpen(true);
  };

  // Save Modal Callback
  const handleSaveItem = (savedItem: any) => {
    if (editorItemType === 'audio') {
      const exists = audios.some(a => a.id === savedItem.id);
      const updated = exists
        ? audios.map(a => a.id === savedItem.id ? savedItem : a)
        : [savedItem, ...audios];
      setAudios(updated);
      saveStoredAudios(updated);
      triggerNotify('Đã cập nhật âm thanh', `Bản ghi "${savedItem.title}" đã được lưu trữ thành công.`);
    } else if (editorItemType === 'video') {
      const exists = videos.some(v => v.id === savedItem.id);
      const updated = exists
        ? videos.map(v => v.id === savedItem.id ? savedItem : v)
        : [savedItem, ...videos];
      setVideos(updated);
      saveStoredVideos(updated);
      triggerNotify('Đã cập nhật video', `Tư liệu video "${savedItem.title}" đã được lưu trữ thành công.`);
    } else if (editorItemType === 'work') {
      const exists = works.some(w => w.id === savedItem.id);
      const updated = exists
        ? works.map(w => w.id === savedItem.id ? savedItem : w)
        : [savedItem, ...works];
      setWorks(updated);
      saveStoredWorks(updated);
      triggerNotify('Đã cập nhật tác phẩm', `Tác phẩm "${savedItem.title}" đã được lưu trữ thành công.`);
    } else if (editorItemType === 'quote') {
      const exists = quotes.some(q => q.id === savedItem.id);
      const updated = exists
        ? quotes.map(q => q.id === savedItem.id ? savedItem : q)
        : [savedItem, ...quotes];
      setQuotes(updated);
      saveStoredQuotes(updated);
      triggerNotify('Đã cập nhật lời dạy', 'Trích dẫn tư tưởng Hồ Chí Minh đã được lưu trữ thành công.');
    } else if (editorItemType === 'footstep') {
      const exists = footsteps.some(f => f.id === savedItem.id);
      const updated = exists
        ? footsteps.map(f => f.id === savedItem.id ? savedItem : f)
        : [savedItem, ...footsteps];
      setFootsteps(updated);
      saveStoredFootsteps(updated);
      triggerNotify('Đã cập nhật tọa độ', `Địa điểm "${savedItem.name}" đã được lưu trữ thành công.`);
    } else if (editorItemType === 'chanh_hiep_action') {
      const exists = actions.some(ac => ac.id === savedItem.id);
      const updated = exists
        ? actions.map(ac => ac.id === savedItem.id ? savedItem : ac)
        : [savedItem, ...actions];
      setActions(updated);
      saveStoredChanhHiepActions(updated);
      triggerNotify('Đã cập nhật mô hình', `Mô hình học tập tại "${savedItem.neighborhood}" đã được lưu trữ.`);
    }
    setIsEditorOpen(false);
  };

  // Delete Handlers
  const handleDeleteAudio = (id: string, title: string) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa bản ghi âm "${title}" khỏi hệ thống?`)) return;
    const updated = audios.filter(a => a.id !== id);
    setAudios(updated);
    saveStoredAudios(updated);
    if (playingAudioId === id && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      setPlayingAudioId(null);
    }
    triggerNotify('Đã xóa âm thanh', `Đã xóa bản ghi âm "${title}".`);
  };

  const handleDeleteVideo = (id: string, title: string) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa video tư liệu "${title}" khỏi hệ thống?`)) return;
    const updated = videos.filter(v => v.id !== id);
    setVideos(updated);
    saveStoredVideos(updated);
    triggerNotify('Đã xóa video', `Đã xóa video tư liệu "${title}".`);
  };

  const handleDeleteWork = (id: string, title: string) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa tác phẩm "${title}"?`)) return;
    const updated = works.filter(w => w.id !== id);
    setWorks(updated);
    saveStoredWorks(updated);
    triggerNotify('Đã xóa tác phẩm', `Đã xóa tác phẩm "${title}".`);
  };

  const handleDeleteQuote = (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa lời dạy này?')) return;
    const updated = quotes.filter(q => q.id !== id);
    setQuotes(updated);
    saveStoredQuotes(updated);
    triggerNotify('Đã xóa lời dạy', 'Đã xóa trích dẫn khỏi danh mục.');
  };

  const handleDeleteFootstep = (id: string, name: string) => {
    if (!window.confirm(`Bạn có chắc muốn xóa mốc tọa độ "${name}"?`)) return;
    const updated = footsteps.filter(f => f.id !== id);
    setFootsteps(updated);
    saveStoredFootsteps(updated);
    triggerNotify('Đã xóa tọa độ', `Đã xóa "${name}" khỏi bản đồ.`);
  };

  const handleDeleteAction = (id: string, title: string) => {
    if (!window.confirm(`Bạn có chắc muốn xóa mô hình "${title}"?`)) return;
    const updated = actions.filter(ac => ac.id !== id);
    setActions(updated);
    saveStoredChanhHiepActions(updated);
    triggerNotify('Đã xóa mô hình', `Đã xóa "${title}".`);
  };

  // Copy transcript
  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDeleteItemFromModal = (id: string) => {
    switch (editorItemType) {
      case 'audio':
        handleDeleteAudio(id, editingItemData?.title || 'bản ghi âm');
        break;
      case 'video':
        handleDeleteVideo(id, editingItemData?.title || 'video');
        break;
      case 'work':
        handleDeleteWork(id, editingItemData?.title || 'tác phẩm');
        break;
      case 'quote':
        handleDeleteQuote(id);
        break;
      case 'footstep':
        handleDeleteFootstep(id, editingItemData?.name || 'tọa độ');
        break;
      case 'chanh_hiep_action':
        handleDeleteAction(id, editingItemData?.title || 'mô hình');
        break;
    }
  };

  // Filtered lists
  const filteredAudios = audios.filter(a =>
    !searchTerm ||
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.occasion.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.transcript.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredVideos = videos.filter(v =>
    !searchTerm ||
    v.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.occasion.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.sourceAgency.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredWorks = works.filter(w =>
    !searchTerm ||
    w.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (w.penName && w.penName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    w.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.year.includes(searchTerm)
  );

  const filteredQuotes = quotes.filter(q => {
    const matchCat = selectedQuoteCategory === 'ALL' || q.category === selectedQuoteCategory;
    const matchSearch = !searchTerm ||
      q.quoteText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.originalWork.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  const filteredFootsteps = footsteps.filter(f =>
    !searchTerm ||
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.historicalAction.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredActions = actions.filter(ac =>
    !searchTerm ||
    ac.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ac.neighborhood.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ac.summary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Hidden Audio Player instance for background playback */}
      <audio
        ref={audioRef}
        onEnded={() => setIsPlaying(false)}
        onError={() => {
          setIsPlaying(false);
          if (playingAudioId) setPlaybackErrorId(playingAudioId);
        }}
        className="hidden"
      />

      {/* Top Banner with Stats & Primary Actions */}
      <div className="bg-gradient-to-r from-red-800 via-rose-800 to-amber-700 text-white rounded-3xl p-6 shadow-md border border-amber-400/30 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-amber-400 text-rose-950 font-black text-[11px] uppercase tracking-wider shadow-xs">
              HỆ THỐNG QUẢN TRỊ TƯ LIỆU VĂN HÓA HỒ CHÍ MINH
            </span>
            <span className="text-xs text-rose-200 font-bold">•</span>
            <span className="text-xs text-amber-200 font-bold flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-amber-300" /> Dữ liệu đã được thẩm định theo Nguồn Cấp A
            </span>
          </div>
          <h2 className="text-2xl font-black tracking-tight font-serif text-white">
            Trung Tâm Điều Chỉnh Chuyên Nghiệp Không Gian Văn Hóa
          </h2>
          <p className="text-xs text-rose-100/90 max-w-2xl leading-relaxed">
            Quản lý trực tiếp Bản ghi âm giọng Bác, tác phẩm nguyên bản, lời dạy bất hủ, dấu chân lịch sử và phong trào học tập tại 21 khu phố Chánh Hiệp.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap shrink-0">
          {onOpenSpaceModal && (
            <button
              type="button"
              onClick={onOpenSpaceModal}
              className="px-4 py-2.5 bg-white/15 hover:bg-white/25 active:scale-98 text-amber-200 text-xs font-bold rounded-2xl border border-white/30 backdrop-blur-md transition-all flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Xem Giao Diện 3D Bảo Tàng</span>
            </button>
          )}

          <label
            className={`px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-rose-950 active:scale-98 text-xs font-black rounded-2xl shadow-md transition-all flex items-center gap-2 cursor-pointer ${
              isFastUploadingAudio ? 'opacity-60 pointer-events-none' : ''
            }`}
            title="Tải nhanh tệp âm thanh giọng đọc Bác Hồ hoặc tư liệu phát thanh (MP3, M4A, WAV, OGG)"
          >
            <Upload className="w-4 h-4 text-rose-950 stroke-[2.5]" />
            <span>{isFastUploadingAudio ? 'Đang Tải Lên...' : 'Tải Âm Thanh Lên'}</span>
            <input
              type="file"
              accept="audio/*,.mp3,.m4a,.wav,.ogg"
              onChange={handleDirectAudioUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Mini Stats Counter */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
        <div
          onClick={() => setSubTab('audios')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            subTab === 'audios'
              ? 'bg-red-50 border-red-300 ring-2 ring-red-400 shadow-xs'
              : 'bg-white border-slate-200 hover:border-red-200'
          }`}
        >
          <div className="flex items-center justify-between text-red-700">
            <span className="text-[11px] font-bold uppercase tracking-wider">Âm thanh tư liệu</span>
            <Volume2 className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-1">{audios.length}</p>
          <span className="text-[10px] text-slate-500">Giọng đọc &amp; phát thanh</span>
        </div>

        <div
          onClick={() => setSubTab('videos')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            subTab === 'videos'
              ? 'bg-red-50 border-red-300 ring-2 ring-red-400 shadow-xs'
              : 'bg-white border-slate-200 hover:border-red-200'
          }`}
        >
          <div className="flex items-center justify-between text-red-700">
            <span className="text-[11px] font-bold uppercase tracking-wider">Tư liệu Video</span>
            <Film className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-1">{videos.length}</p>
          <span className="text-[10px] text-slate-500">YouTube &amp; Thước phim</span>
        </div>

        <div
          onClick={() => setSubTab('works')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            subTab === 'works'
              ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-400 shadow-xs'
              : 'bg-white border-slate-200 hover:border-amber-200'
          }`}
        >
          <div className="flex items-center justify-between text-amber-700">
            <span className="text-[11px] font-bold uppercase tracking-wider">Tác phẩm tiêu biểu</span>
            <BookOpen className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-1">{works.length}</p>
          <span className="text-[10px] text-slate-500">Kèm trọn bộ 15 tập</span>
        </div>

        <div
          onClick={() => setSubTab('quotes')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            subTab === 'quotes'
              ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-400 shadow-xs'
              : 'bg-white border-slate-200 hover:border-rose-200'
          }`}
        >
          <div className="flex items-center justify-between text-rose-700">
            <span className="text-[11px] font-bold uppercase tracking-wider">Lời dạy bất hủ</span>
            <Quote className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-1">{quotes.length}</p>
          <span className="text-[10px] text-slate-500">Trích dẫn chính xác</span>
        </div>

        <div
          onClick={() => setSubTab('footsteps')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            subTab === 'footsteps'
              ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-400 shadow-xs'
              : 'bg-white border-slate-200 hover:border-blue-200'
          }`}
        >
          <div className="flex items-center justify-between text-blue-700">
            <span className="text-[11px] font-bold uppercase tracking-wider">Dấu chân Người</span>
            <MapPin className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-1">{footsteps.length}</p>
          <span className="text-[10px] text-slate-500">Tọa độ lịch sử</span>
        </div>

        <div
          onClick={() => setSubTab('actions')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            subTab === 'actions'
              ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-400 shadow-xs'
              : 'bg-white border-slate-200 hover:border-emerald-200'
          }`}
        >
          <div className="flex items-center justify-between text-emerald-700">
            <span className="text-[11px] font-bold uppercase tracking-wider">Chánh Hiệp học Bác</span>
            <HeartHandshake className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-1">{actions.length}</p>
          <span className="text-[10px] text-slate-500">21 Khu phố đoàn kết</span>
        </div>
      </div>

      {/* Sub-tab Navigation Bar */}
      <div className="bg-slate-100 p-1.5 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-2 shadow-2xs">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => { setSubTab('audios'); setSearchTerm(''); }}
            className={`px-4 py-2 text-xs font-black rounded-xl transition cursor-pointer flex items-center gap-2 ${
              subTab === 'audios'
                ? 'bg-red-700 text-white shadow-xs'
                : 'text-slate-700 hover:bg-white hover:text-red-700'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>Kho Âm Thanh ({audios.length})</span>
          </button>

          <button
            onClick={() => { setSubTab('videos'); setSearchTerm(''); }}
            className={`px-4 py-2 text-xs font-black rounded-xl transition cursor-pointer flex items-center gap-2 ${
              subTab === 'videos'
                ? 'bg-red-700 text-white shadow-xs'
                : 'text-slate-700 hover:bg-white hover:text-red-700'
            }`}
          >
            <Film className="w-4 h-4" />
            <span>Kho Video YouTube ({videos.length})</span>
          </button>

          <button
            onClick={() => { setSubTab('works'); setSearchTerm(''); }}
            className={`px-4 py-2 text-xs font-black rounded-xl transition cursor-pointer flex items-center gap-2 ${
              subTab === 'works'
                ? 'bg-red-700 text-white shadow-xs'
                : 'text-slate-700 hover:bg-white hover:text-red-700'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Tác Phẩm &amp; Bút Tích ({works.length})</span>
          </button>

          <button
            onClick={() => { setSubTab('quotes'); setSearchTerm(''); }}
            className={`px-4 py-2 text-xs font-black rounded-xl transition cursor-pointer flex items-center gap-2 ${
              subTab === 'quotes'
                ? 'bg-red-700 text-white shadow-xs'
                : 'text-slate-700 hover:bg-white hover:text-red-700'
            }`}
          >
            <Quote className="w-4 h-4" />
            <span>Lời Dạy Bất Hủ ({quotes.length})</span>
          </button>

          <button
            onClick={() => { setSubTab('footsteps'); setSearchTerm(''); }}
            className={`px-4 py-2 text-xs font-black rounded-xl transition cursor-pointer flex items-center gap-2 ${
              subTab === 'footsteps'
                ? 'bg-red-700 text-white shadow-xs'
                : 'text-slate-700 hover:bg-white hover:text-red-700'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Tọa Độ Dấu Chân ({footsteps.length})</span>
          </button>

          <button
            onClick={() => { setSubTab('actions'); setSearchTerm(''); }}
            className={`px-4 py-2 text-xs font-black rounded-xl transition cursor-pointer flex items-center gap-2 ${
              subTab === 'actions'
                ? 'bg-red-700 text-white shadow-xs'
                : 'text-slate-700 hover:bg-white hover:text-red-700'
            }`}
          >
            <HeartHandshake className="w-4 h-4" />
            <span>Mô Hình Địa Phương ({actions.length})</span>
          </button>
        </div>

        {/* Action Button for Current Sub-tab */}
        <div className="flex items-center gap-2">
          {subTab === 'audios' && (
            <button
              onClick={() => openAddModal('audio')}
              className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Bản Ghi Mới</span>
            </button>
          )}

          {subTab === 'videos' && (
            <button
              onClick={() => openAddModal('video')}
              className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Video Tư Liệu</span>
            </button>
          )}

          {subTab === 'works' && (
            <button
              onClick={() => openAddModal('work')}
              className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Tác Phẩm</span>
            </button>
          )}

          {subTab === 'quotes' && (
            <button
              onClick={() => openAddModal('quote')}
              className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Lời Dạy</span>
            </button>
          )}

          {subTab === 'footsteps' && (
            <button
              onClick={() => openAddModal('footstep')}
              className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Tọa Độ Mốc</span>
            </button>
          )}

          {subTab === 'actions' && (
            <button
              onClick={() => openAddModal('chanh_hiep_action')}
              className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Mô Hình</span>
            </button>
          )}
        </div>
      </div>

      {/* Search & Sub-filters Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
        <div className="relative w-full sm:w-96">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={
              subTab === 'audios'
                ? 'Tìm theo tên bài phát thanh, bối cảnh, trích đoạn...'
                : subTab === 'videos'
                ? 'Tìm theo tên thước phim, sự kiện, nguồn tư liệu...'
                : subTab === 'works'
                ? 'Tìm theo tên tác phẩm, bút danh, năm sáng tác...'
                : subTab === 'quotes'
                ? 'Tìm theo nội dung lời dạy, hoàn cảnh, xuất xứ...'
                : 'Tìm kiếm theo từ khóa...'
            }
            className="w-full pl-9 pr-8 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 bg-slate-50 focus:bg-white text-slate-800"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>

        {subTab === 'quotes' && (
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
            {['ALL', 'Đại đoàn kết', 'Dân vận', 'Cán bộ & Đạo đức', 'Thế hệ trẻ'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedQuoteCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  selectedQuoteCategory === cat
                    ? 'bg-rose-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat === 'ALL' ? 'Tất cả chủ đề' : cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ===================================================================== */}
      {/* 1. SUB-TAB: AUDIOS (KHO ÂM THANH) */}
      {/* ===================================================================== */}
      {subTab === 'audios' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {filteredAudios.map((audio) => {
              const isCurrentPlaying = playingAudioId === audio.id && isPlaying;
              const hasError = playbackErrorId === audio.id;
              const resolvedSrc = resolveAudioUrl(audio.audioUrl);

              return (
                <div
                  key={audio.id}
                  className={`bg-white rounded-2xl border p-5 transition-all shadow-sm flex flex-col md:flex-row items-start justify-between gap-5 ${
                    isCurrentPlaying
                      ? 'border-red-500 ring-2 ring-red-200 bg-gradient-to-r from-red-50/40 to-white'
                      : 'border-slate-200 hover:border-red-200'
                  }`}
                >
                  {/* Ảnh đại diện / Avatar tư liệu với nút đổi ảnh nhanh */}
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shrink-0 border-2 border-amber-200/80 bg-gradient-to-br from-rose-50 to-amber-50 shadow-xs group">
                    {audio.imageUrl ? (
                      <>
                        <img
                          src={audio.imageUrl}
                          alt={audio.title}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                        />
                        <label
                          className={`absolute inset-0 bg-black/65 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer p-1.5 text-center backdrop-blur-2xs ${
                            uploadingAvatarId === audio.id ? 'opacity-100 pointer-events-none' : ''
                          }`}
                          title="Bấm để thay đổi ảnh đại diện bản ghi âm này"
                        >
                          {uploadingAvatarId === audio.id ? (
                            <div className="flex flex-col items-center gap-1">
                              <div className="w-5 h-5 border-2 border-amber-300 border-t-transparent rounded-full animate-spin" />
                              <span className="text-[10px] font-bold text-amber-200">Đang lưu...</span>
                            </div>
                          ) : (
                            <>
                              <Camera className="w-5 h-5 text-amber-300 mb-0.5" />
                              <span className="text-[10px] font-bold text-amber-200 leading-tight">Đổi ảnh</span>
                              <span className="text-[8px] text-slate-300 mt-0.5">JPG, PNG</span>
                            </>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleItemAvatarUpload('audio', audio.id, file);
                            }}
                          />
                        </label>
                      </>
                    ) : (
                      <label
                        className={`w-full h-full flex flex-col items-center justify-center p-2 text-center cursor-pointer hover:bg-rose-100/60 transition group/empty ${
                          uploadingAvatarId === audio.id ? 'pointer-events-none' : ''
                        }`}
                        title="Bấm để tải ảnh đại diện cho bản ghi âm"
                      >
                        {uploadingAvatarId === audio.id ? (
                          <div className="flex flex-col items-center gap-1">
                            <div className="w-5 h-5 border-2 border-rose-600 border-t-transparent rounded-full animate-spin" />
                            <span className="text-[10px] font-bold text-rose-800">Đang lưu...</span>
                          </div>
                        ) : (
                          <>
                            <div className="w-9 h-9 rounded-xl bg-rose-100 group-hover/empty:bg-rose-200 text-rose-700 flex items-center justify-center mb-1 transition shadow-2xs">
                              <ImageIcon className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] font-bold text-rose-900 leading-tight">Tải ảnh</span>
                            <span className="text-[8px] text-slate-500 mt-0.5">Đại diện</span>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleItemAvatarUpload('audio', audio.id, file);
                          }}
                        />
                      </label>
                    )}

                    {/* Huy hiệu đang phát âm thanh */}
                    {isCurrentPlaying && (
                      <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-full bg-red-600 text-white text-[8px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1 animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-ping" />
                        <span>Phát</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-md bg-red-100 text-red-800 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                        <Radio className="w-3 h-3" />
                        Tư liệu phát thanh
                      </span>

                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        {audio.dateStr}
                      </span>

                      <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-xs font-bold flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-700" />
                        {audio.duration || 'Thời lượng'}
                      </span>

                      <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        {audio.sourceAgency}
                      </span>
                    </div>

                    <h3 className="font-serif font-black text-base text-slate-900 leading-snug">
                      {audio.title}
                    </h3>

                    <p className="text-xs text-slate-600 italic">
                      Bối cảnh: {audio.occasion}
                    </p>

                    {/* Audio URL indicator */}
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 truncate">
                      <span className="font-bold text-slate-700 shrink-0">Nguồn tệp:</span>
                      <span className="font-mono text-xs text-blue-700 truncate underline" title={audio.audioUrl}>
                        {audio.audioUrl || 'Chưa nạp URL âm thanh'}
                      </span>
                      {hasError && (
                        <span className="text-red-600 font-bold flex items-center gap-1 shrink-0">
                          <AlertCircle className="w-3.5 h-3.5" /> Lỗi phát
                        </span>
                      )}
                    </div>

                    {/* Transcript Box */}
                    {audio.transcript && (
                      <div className="mt-2 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed space-y-1.5">
                        <div className="flex items-center justify-between font-bold text-[11px] text-slate-800">
                          <span className="flex items-center gap-1 text-red-800">
                            <FileText className="w-3.5 h-3.5" />
                            Toàn văn nội dung ghi âm (Transcript):
                          </span>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(audio.transcript, audio.id)}
                            className="text-slate-500 hover:text-red-700 flex items-center gap-1 text-[10px] font-bold cursor-pointer"
                            title="Sao chép toàn bộ văn bản ghi âm"
                          >
                            {copiedId === audio.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span className="text-emerald-700">Đã sao chép</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Sao chép</span>
                              </>
                            )}
                          </button>
                        </div>
                        <p className="font-serif text-slate-800 italic line-clamp-3">
                          "{audio.transcript}"
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Player & Actions Controls */}
                  <div className="flex md:flex-col items-center md:items-end justify-between gap-3 shrink-0 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <button
                      type="button"
                      onClick={() => handleTogglePlay(audio)}
                      className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-xs ${
                        isCurrentPlaying
                          ? 'bg-amber-500 hover:bg-amber-600 text-white ring-2 ring-amber-300'
                          : 'bg-red-700 hover:bg-red-800 text-white'
                      }`}
                      title={isCurrentPlaying ? 'Tạm dừng phát' : 'Nghe trực tiếp bản thu âm này'}
                    >
                      {isCurrentPlaying ? (
                        <>
                          <Pause className="w-4 h-4 fill-white" />
                          <span>Tạm Dừng</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 fill-white" />
                          <span>Phát Âm Thanh</span>
                        </>
                      )}
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => openEditor('audio', audio)}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                        title="Chỉnh sửa chi tiết thông tin và tệp âm thanh"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                        <span>Sửa</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteAudio(audio.id, audio.title)}
                        className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition cursor-pointer"
                        title="Xóa bản ghi âm này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredAudios.length === 0 && (
              <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-300 space-y-2">
                <Volume2 className="w-10 h-10 text-slate-400 mx-auto" />
                <p className="font-bold text-slate-700">Không tìm thấy bản ghi âm nào phù hợp</p>
                <p className="text-xs text-slate-500">Thử tìm kiếm với từ khóa khác hoặc bấm "Thêm Bản Ghi Mới".</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 2. SUB-TAB: VIDEOS (KHO TƯ LIỆU VIDEO YOUTUBE) */}
      {/* ===================================================================== */}
      {subTab === 'videos' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredVideos.map((video) => {
              const videoId = video.youtubeVideoId || '';
              const thumbUrl = video.imageUrl || (videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '');

              return (
                <div
                  key={video.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-red-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    {/* Video Thumbnail with Play Overlay */}
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 border border-slate-200 group">
                      {thumbUrl ? (
                        <img
                          src={thumbUrl}
                          alt={video.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                          <Film className="w-8 h-8 mb-1" />
                          <span className="text-xs">Chưa có ảnh đại diện</span>
                        </div>
                      )}

                      {/* Dark overlay & Play Button */}
                      <a
                        href={video.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute inset-0 bg-black/35 group-hover:bg-black/20 transition-all flex items-center justify-center cursor-pointer"
                        title="Mở xem trên YouTube"
                      >
                        <div className="w-12 h-12 rounded-full bg-red-600 group-hover:bg-red-700 text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                          <Play className="w-5 h-5 fill-white ml-0.5" />
                        </div>
                      </a>

                      {/* Badges on Thumbnail */}
                      <div className="absolute top-2 left-2 flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-xs text-white text-[10px] font-bold">
                          {video.category}
                        </span>
                      </div>

                      {video.duration && (
                        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-xs text-white text-[10px] font-mono font-bold flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-300" />
                          <span>{video.duration}</span>
                        </div>
                      )}
                    </div>

                    {/* Metadata Badges */}
                    <div className="flex items-center justify-between text-xs text-slate-500 gap-2 flex-wrap">
                      <span className="flex items-center gap-1 text-red-700 font-bold">
                        <Calendar className="w-3.5 h-3.5 text-red-600" />
                        <span>{video.dateStr}</span>
                      </span>

                      <span className="px-2 py-0.5 rounded-md bg-red-50 text-red-900 font-semibold text-[11px] truncate max-w-[200px]" title={video.sourceAgency}>
                        {video.sourceAgency}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-serif font-black text-base text-slate-900 leading-snug">
                      {video.title}
                    </h3>

                    {/* Occasion */}
                    {video.occasion && (
                      <p className="text-xs text-slate-600 italic">
                        Bối cảnh: {video.occasion}
                      </p>
                    )}

                    {/* Description */}
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {video.description}
                    </p>

                    {/* YouTube URL indicator */}
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 truncate pt-1 border-t border-slate-100">
                      <span className="font-bold text-red-800 shrink-0 flex items-center gap-1">
                        <Film className="w-3 h-3 text-red-600" />
                        YouTube:
                      </span>
                      <a
                        href={video.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-xs text-blue-700 hover:text-blue-900 truncate underline flex items-center gap-1"
                        title={video.youtubeUrl}
                      >
                        <span className="truncate">{video.youtubeUrl}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    </div>
                  </div>

                  {/* Actions Buttons */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                    <button
                      type="button"
                      onClick={() => copyToClipboard(video.youtubeUrl, video.id)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition flex items-center gap-1 cursor-pointer"
                      title="Sao chép liên kết YouTube"
                    >
                      {copiedId === video.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-700 text-[11px]">Đã chép link</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span className="text-[11px]">Chép link</span>
                        </>
                      )}
                    </button>

                    <div className="flex items-center gap-1.5">
                      <a
                        href={video.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 font-bold transition flex items-center gap-1 cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 fill-red-700" />
                        <span>Xem</span>
                      </a>

                      <button
                        type="button"
                        onClick={() => openEditor('video', video)}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold transition flex items-center gap-1 cursor-pointer"
                        title="Chỉnh sửa chi tiết thông tin và link YouTube"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                        <span>Sửa</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteVideo(video.id, video.title)}
                        className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold transition cursor-pointer"
                        title="Xóa video tư liệu này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredVideos.length === 0 && (
              <div className="col-span-full p-12 text-center bg-white rounded-2xl border border-dashed border-slate-300 space-y-2">
                <Film className="w-10 h-10 text-slate-400 mx-auto" />
                <p className="font-bold text-slate-700">Không tìm thấy video tư liệu nào phù hợp</p>
                <p className="text-xs text-slate-500">Thử tìm kiếm với từ khóa khác hoặc bấm "Thêm Video Tư Liệu".</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 3. SUB-TAB: WORKS (TÁC PHẨM TIÊU BIỂU) */}
      {/* ===================================================================== */}
      {subTab === 'works' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredWorks.map((work) => {
              const isUploadingThis = uploadingAvatarId === work.id;
              return (
                <div
                  key={work.id}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-amber-300 p-5 shadow-sm transition space-y-3 flex flex-col justify-between"
                >
                  <div className="flex items-start gap-3.5">
                    {/* Ảnh bìa / Avatar Tác phẩm */}
                    <div className="relative w-20 h-28 rounded-xl overflow-hidden shrink-0 border border-amber-200 bg-amber-50 shadow-2xs group">
                      {work.imageUrl ? (
                        <>
                          <img
                            src={work.imageUrl}
                            alt={work.title}
                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                            referrerPolicy="no-referrer"
                          />
                          <label
                            className={`absolute inset-0 bg-black/65 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer p-1 text-center backdrop-blur-2xs ${
                              isUploadingThis ? 'opacity-100 pointer-events-none' : ''
                            }`}
                            title="Đổi ảnh bìa tác phẩm"
                          >
                            {isUploadingThis ? (
                              <div className="w-4 h-4 border-2 border-amber-300 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <>
                                <Camera className="w-4 h-4 text-amber-300 mb-0.5" />
                                <span className="text-[9px] font-bold text-amber-200">Đổi ảnh</span>
                              </>
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleItemAvatarUpload('work', work.id, file);
                              }}
                            />
                          </label>
                        </>
                      ) : (
                        <label
                          className={`w-full h-full flex flex-col items-center justify-center p-1.5 text-center cursor-pointer hover:bg-amber-100/60 transition group/empty text-amber-800 ${
                            isUploadingThis ? 'pointer-events-none' : ''
                          }`}
                          title="Tải ảnh bìa tác phẩm"
                        >
                          {isUploadingThis ? (
                            <div className="w-4 h-4 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <>
                              <BookOpen className="w-6 h-6 text-amber-600 mb-1" />
                              <span className="text-[9px] font-bold">Thêm ảnh</span>
                            </>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleItemAvatarUpload('work', work.id, file);
                            }}
                          />
                        </label>
                      )}
                    </div>

                    <div className="space-y-2 flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[10px] font-black uppercase tracking-wider">
                          Năm {work.year}
                        </span>
                        {work.penName && (
                          <span className="text-xs text-slate-500 font-semibold italic">
                            Bút danh: {work.penName}
                          </span>
                        )}
                      </div>

                      <h3 className="font-serif font-black text-base text-slate-900 leading-tight">
                        {work.title}
                      </h3>

                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                        {work.summary}
                      </p>
                    </div>
                  </div>

                  {work.keyIdeas && work.keyIdeas.length > 0 && (
                    <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 space-y-1">
                      <span className="font-bold text-[10px] uppercase text-amber-900">Luận điểm cốt lõi:</span>
                      <ul className="list-disc list-inside space-y-0.5">
                        {work.keyIdeas.slice(0, 2).map((idea, idx) => (
                          <li key={idx} className="line-clamp-1">{idea}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                  <span className="text-slate-500 font-medium">
                    Tập {work.volume}, Trang {work.pageRange}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {work.officialSourceUrl && (
                      <a
                        href={work.officialSourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                        title="Xem nguồn chính thức"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={() => openEditor('work', work)}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                      <span>Sửa</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteWork(work.id, work.title)}
                      className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition cursor-pointer"
                      title="Xóa tác phẩm này"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 3. SUB-TAB: QUOTES (LỜI DẠY BẤT HỦ) */}
      {/* ===================================================================== */}
      {subTab === 'quotes' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredQuotes.map((quote) => (
              <div
                key={quote.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-rose-300 p-5 shadow-sm transition space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-900 text-[10px] font-black uppercase tracking-wider">
                      {quote.category}
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">
                      {quote.dateStr}
                    </span>
                  </div>

                  <p className="font-serif font-bold text-sm sm:text-base text-slate-900 leading-relaxed italic text-rose-950">
                    "{quote.quoteText}"
                  </p>

                  <div className="text-xs text-slate-600 space-y-0.5">
                    <div><strong>Bối cảnh:</strong> {quote.occasion}</div>
                    {quote.originalWork && (
                      <div><strong>Xuất xứ:</strong> {quote.originalWork} (Tập {quote.volume}, Tr. {quote.page})</div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => copyToClipboard(quote.quoteText, quote.id)}
                    className="text-slate-500 hover:text-rose-700 flex items-center gap-1 font-bold cursor-pointer"
                  >
                    {copiedId === quote.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Đã chép</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Sao chép câu nói</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => openEditor('quote', quote)}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                      <span>Sửa</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteQuote(quote.id)}
                      className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 4. SUB-TAB: FOOTSTEPS (TỌA ĐỘ DẤU CHÂN NGƯỜI) */}
      {/* ===================================================================== */}
      {subTab === 'footsteps' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredFootsteps.map((footstep) => {
              const isUploadingThis = uploadingAvatarId === footstep.id;
              return (
                <div
                  key={footstep.id}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-blue-300 p-5 shadow-sm transition space-y-3 flex flex-col justify-between"
                >
                  <div className="flex items-start gap-3.5">
                    {/* Ảnh di tích / Avatar địa danh */}
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-blue-200 bg-blue-50 shadow-2xs group">
                      {footstep.imageUrl ? (
                        <>
                          <img
                            src={footstep.imageUrl}
                            alt={footstep.name}
                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform"
                            referrerPolicy="no-referrer"
                          />
                          <label
                            className={`absolute inset-0 bg-black/65 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer p-1 text-center backdrop-blur-2xs ${
                              isUploadingThis ? 'opacity-100 pointer-events-none' : ''
                            }`}
                            title="Đổi ảnh di tích"
                          >
                            {isUploadingThis ? (
                              <div className="w-4 h-4 border-2 border-blue-300 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <>
                                <Camera className="w-4 h-4 text-blue-300 mb-0.5" />
                                <span className="text-[9px] font-bold text-blue-200">Đổi ảnh</span>
                              </>
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleItemAvatarUpload('footstep', footstep.id, file);
                              }}
                            />
                          </label>
                        </>
                      ) : (
                        <label
                          className={`w-full h-full flex flex-col items-center justify-center p-1.5 text-center cursor-pointer hover:bg-blue-100/60 transition group/empty text-blue-800 ${
                            isUploadingThis ? 'pointer-events-none' : ''
                          }`}
                          title="Tải ảnh di tích dấu chân"
                        >
                          {isUploadingThis ? (
                            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <>
                              <MapPin className="w-5 h-5 text-blue-600 mb-1" />
                              <span className="text-[9px] font-bold">Thêm ảnh</span>
                            </>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleItemAvatarUpload('footstep', footstep.id, file);
                            }}
                          />
                        </label>
                      )}
                    </div>

                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-900 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-blue-600" />
                          {footstep.country}
                        </span>
                        <span className="text-xs text-slate-500 font-bold">
                          {footstep.periodYears}
                        </span>
                      </div>

                      <h3 className="font-serif font-black text-base text-slate-900 leading-tight">
                        {footstep.name}
                      </h3>

                      <div className="text-xs text-slate-600 space-y-0.5">
                        <div><strong>Bí danh:</strong> {footstep.aliasUsed}</div>
                        <div className="line-clamp-1"><strong>Di tích:</strong> {footstep.primaryRelic}</div>
                      </div>
                    </div>
                  </div>

                  <p className="line-clamp-2 leading-relaxed text-xs text-slate-700">{footstep.historicalAction}</p>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-1.5 text-xs">
                    <button
                      type="button"
                      onClick={() => openEditor('footstep', footstep)}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                      <span>Sửa</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteFootstep(footstep.id, footstep.name)}
                      className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 5. SUB-TAB: ACTIONS (CHÁNH HIỆP HỌC BÁC) */}
      {/* ===================================================================== */}
      {subTab === 'actions' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredActions.map((action) => {
              const isUploadingThis = uploadingAvatarId === action.id;
              return (
                <div
                  key={action.id}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 p-5 shadow-sm transition space-y-3 flex flex-col justify-between"
                >
                  <div className="flex items-start gap-3.5">
                    {/* Ảnh mô hình / Avatar hành động */}
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-emerald-200 bg-emerald-50 shadow-2xs group">
                      {action.imageUrl ? (
                        <>
                          <img
                            src={action.imageUrl}
                            alt={action.title}
                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform"
                            referrerPolicy="no-referrer"
                          />
                          <label
                            className={`absolute inset-0 bg-black/65 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer p-1 text-center backdrop-blur-2xs ${
                              isUploadingThis ? 'opacity-100 pointer-events-none' : ''
                            }`}
                            title="Đổi ảnh mô hình"
                          >
                            {isUploadingThis ? (
                              <div className="w-4 h-4 border-2 border-emerald-300 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <>
                                <Camera className="w-4 h-4 text-emerald-300 mb-0.5" />
                                <span className="text-[9px] font-bold text-emerald-200">Đổi ảnh</span>
                              </>
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleItemAvatarUpload('action', action.id, file);
                              }}
                            />
                          </label>
                        </>
                      ) : (
                        <label
                          className={`w-full h-full flex flex-col items-center justify-center p-1.5 text-center cursor-pointer hover:bg-emerald-100/60 transition group/empty text-emerald-800 ${
                            isUploadingThis ? 'pointer-events-none' : ''
                          }`}
                          title="Tải ảnh mô hình thực tế"
                        >
                          {isUploadingThis ? (
                            <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <>
                              <HeartHandshake className="w-5 h-5 text-emerald-600 mb-1" />
                              <span className="text-[9px] font-bold">Thêm ảnh</span>
                            </>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleItemAvatarUpload('action', action.id, file);
                            }}
                          />
                        </label>
                      )}
                    </div>

                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 text-[10px] font-black uppercase tracking-wider">
                          {action.neighborhood}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          {action.updatedDate}
                        </span>
                      </div>

                      <h3 className="font-serif font-black text-base text-slate-900 leading-tight">
                        {action.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {action.summary}
                  </p>

                  {action.practicalResult && (
                    <div className="p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-950 space-y-0.5">
                      <span className="font-bold text-[10px] uppercase text-emerald-900">Kết quả thiết thực:</span>
                      <p className="line-clamp-2">{action.practicalResult}</p>
                    </div>
                  )}

                  {action.inspirationalQuote && (
                    <p className="text-xs italic text-slate-600 font-serif border-l-2 border-amber-400 pl-2">
                      "{action.inspirationalQuote}"
                    </p>
                  )}

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-1.5 text-xs">
                    <button
                      type="button"
                      onClick={() => openEditor('chanh_hiep_action', action)}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                      <span>Sửa</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteAction(action.id, action.title)}
                      className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Universal HCM Editor Modal */}
      {isEditorOpen && (
        <UniversalHcmEditorModal
          isOpen={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
          itemType={editorItemType}
          itemData={editingItemData}
          onSave={handleSaveItem}
          onDelete={handleDeleteItemFromModal}
        />
      )}
    </div>
  );
};
