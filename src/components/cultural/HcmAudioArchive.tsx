import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  ShieldCheck,
  Calendar,
  Radio,
  FileText,
  Clock,
  Sparkles,
  Building,
  Edit3,
  Plus,
  Trash2,
  Copy,
  Check,
  Download,
  AlertCircle,
  ExternalLink,
  Upload
} from 'lucide-react';
import { HISTORICAL_AUDIOS, HistoricalAudio } from '../../data/hcmVerifiedMuseumData';
import { loadStoredAudios, saveStoredAudios } from '../../lib/hcmDataStore';
import { DongSonDrumIcon, ChimHacIcon, HoaSenIcon } from './TraditionalMotifs';
import { UniversalHcmEditorModal } from './UniversalHcmEditorModal';

interface HcmAudioArchiveProps {
  isResearchMode: boolean;
  isAdmin?: boolean;
}

export const HcmAudioArchive: React.FC<HcmAudioArchiveProps> = ({ isResearchMode, isAdmin = false }) => {
  const [audioList, setAudioList] = useState<HistoricalAudio[]>(() => loadStoredAudios());
  const [selectedAudio, setSelectedAudio] = useState<HistoricalAudio>(() => {
    const list = loadStoredAudios();
    return list[0] || HISTORICAL_AUDIOS[0];
  });

  // Real Audio Player state
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [isLoadingAudio, setIsLoadingAudio] = useState<boolean>(false);
  const [hasPlaybackError, setHasPlaybackError] = useState<boolean>(false);
  const [copiedTranscript, setCopiedTranscript] = useState<boolean>(false);

  // Admin Modal state
  const [editingAudio, setEditingAudio] = useState<HistoricalAudio | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);

  useEffect(() => {
    const list = loadStoredAudios();
    setAudioList(list);
    if (!list.some(item => item.id === selectedAudio?.id)) {
      setSelectedAudio(list[0] || HISTORICAL_AUDIOS[0]);
    }
  }, []);

  // When selected audio changes, reset player states
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setHasPlaybackError(false);
    setIsLoadingAudio(false);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.load();
    }
  }, [selectedAudio?.id, selectedAudio?.audioUrl]);

  const resolveAudioUrl = (url?: string) => {
    if (!url) return '';
    if (url.startsWith('/uploads/')) return url;
    if (url.includes('hochiminh.vn') || url.includes('baochinhphu.vn')) {
      return `/api/media/proxy?url=${encodeURIComponent(url)}`;
    }
    return url;
  };

  const currentAudioSrc = resolveAudioUrl(selectedAudio?.audioUrl);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (!currentAudioSrc) {
      setHasPlaybackError(true);
      return;
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setIsLoadingAudio(true);
      setHasPlaybackError(false);
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setIsLoadingAudio(false);
        })
        .catch((err) => {
          console.warn('Playback error:', err);
          setIsPlaying(false);
          setIsLoadingAudio(false);
          setHasPlaybackError(true);
        });
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
      setIsLoadingAudio(false);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = Number(e.target.value);
    setCurrentTime(seekTime);
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
    }
  };

  const skipTime = (seconds: number) => {
    if (audioRef.current) {
      const newTime = Math.min(Math.max(0, audioRef.current.currentTime + seconds), duration || 9999);
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleRateChange = (rate: number) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      const nextMuted = !isMuted;
      audioRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
      if (val === 0) {
        setIsMuted(true);
      } else if (isMuted) {
        setIsMuted(false);
      }
    }
  };

  const formatSeconds = (sec: number) => {
    if (isNaN(sec) || sec < 0) return '00:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleCopyTranscript = () => {
    if (selectedAudio?.transcript) {
      navigator.clipboard.writeText(selectedAudio.transcript);
      setCopiedTranscript(true);
      setTimeout(() => setCopiedTranscript(false), 2000);
    }
  };

  // CRUD Operations
  const handleSaveAudio = (updated: HistoricalAudio) => {
    let updatedList: HistoricalAudio[];
    const exists = audioList.some(a => a.id === updated.id);

    if (exists) {
      updatedList = audioList.map(a => (a.id === updated.id ? updated : a));
    } else {
      updatedList = [updated, ...audioList];
    }

    setAudioList(updatedList);
    saveStoredAudios(updatedList);
    setSelectedAudio(updated);
    setEditingAudio(null);
    setIsCreatingNew(false);
  };

  const handleDeleteAudio = (audioId: string) => {
    if (confirm('Đồng chí có chắc chắn muốn xóa bản ghi âm tư liệu này?')) {
      const updatedList = audioList.filter(a => a.id !== audioId);
      setAudioList(updatedList);
      saveStoredAudios(updatedList);
      if (selectedAudio?.id === audioId) {
        setSelectedAudio(updatedList[0] || HISTORICAL_AUDIOS[0]);
      }
    }
  };

  const handleOpenCreateNew = () => {
    const newAudio: HistoricalAudio = {
      id: `aud-${Date.now()}`,
      title: 'Bản ghi âm tư liệu mới',
      dateStr: new Date().toLocaleDateString('vi-VN'),
      duration: '03 phút 00 giây',
      occasion: 'Tư liệu lịch sử Bác Hồ',
      sourceAgency: 'Đài Tiếng nói Việt Nam (VOV)',
      audioUrl: '',
      transcript: '',
      historicalNote: '',
      verificationStatus: 'VERIFIED'
    };
    setIsCreatingNew(true);
    setEditingAudio(newAudio);
  };

  return (
    <div className="space-y-6 py-2">
      {/* Hidden HTML5 Audio Element */}
      {currentAudioSrc && (
        <audio
          ref={audioRef}
          src={currentAudioSrc}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
          onError={() => {
            setIsLoadingAudio(false);
            setIsPlaying(false);
            setHasPlaybackError(true);
          }}
          preload="metadata"
        />
      )}

      {/* Direct Editor Modal */}
      {editingAudio && (
        <UniversalHcmEditorModal
          isOpen={!!editingAudio}
          onClose={() => {
            setEditingAudio(null);
            setIsCreatingNew(false);
          }}
          itemType="audio"
          itemData={editingAudio}
          onSave={handleSaveAudio}
        />
      )}

      {/* Header Banner - Tone Hồng Cánh Sen & Hoa Sen */}
      <div className="bg-gradient-to-br from-white via-rose-50/70 to-amber-50/50 p-5 sm:p-6 rounded-3xl border-2 border-rose-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold font-serif text-rose-950 flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-rose-700" />
            <span>Phòng Tư Liệu Âm Thanh Gốc Của Chủ Tịch Hồ Chí Minh</span>
          </h2>
          <p className="text-xs text-rose-800/80 mt-1">
            Bản ghi âm giọng nói ấm áp của Bác được bảo tồn chính thức tại Đài Tiếng nói Việt Nam và Trung tâm Lưu trữ Quốc gia III kèm transcript chữ viết toàn văn.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isAdmin && (
            <button
              onClick={handleOpenCreateNew}
              className="px-3.5 py-2 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-300 hover:brightness-105 text-rose-950 font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer transition"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm bản ghi âm mới</span>
            </button>
          )}

          <div className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-rose-100 text-rose-900 border border-rose-200">
            <Radio className="w-4 h-4 text-rose-700 animate-pulse" />
            <span>{audioList.length} tư liệu âm thanh</span>
          </div>
        </div>
      </div>

      {/* Layout 2 cột: Danh sách bên trái, Trình phát & Transcript bên phải */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Cột Trái: Danh sách bản ghi âm */}
        <div className="lg:col-span-5 space-y-3">
          {audioList.map((item) => {
            const isSelected = selectedAudio?.id === item.id;
            const hasAudio = !!item.audioUrl;

            return (
              <div
                key={item.id}
                onClick={() => {
                  setSelectedAudio(item);
                }}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3.5 ${
                  isSelected
                    ? 'bg-gradient-to-br from-rose-800 via-pink-700 to-rose-900 text-white border-amber-300 shadow-md ring-2 ring-amber-300/30'
                    : 'bg-gradient-to-br from-white via-rose-50/50 to-amber-50/30 border-rose-200 text-rose-950 hover:border-rose-400 hover:shadow-xs'
                }`}
              >
                <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 mt-0.5 border border-rose-200/80 shadow-2xs">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover object-center"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div
                      className={`w-full h-full flex items-center justify-center ${
                        isSelected
                          ? 'bg-amber-300 text-rose-950'
                          : 'bg-rose-100 text-rose-900'
                      }`}
                    >
                      <Volume2 className="w-5 h-5" />
                    </div>
                  )}
                  {isSelected && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Volume2 className={`w-5 h-5 text-amber-300 ${isPlaying ? 'animate-bounce' : ''}`} />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span
                      className={`text-xs font-bold flex items-center gap-1 ${
                        isSelected ? 'text-amber-200' : 'text-rose-700'
                      }`}
                    >
                      <Calendar className="w-3 h-3" />
                      <span>{item.dateStr}</span>
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                        isSelected
                          ? 'bg-rose-950/60 text-amber-100'
                          : 'bg-rose-100 text-rose-900 border border-rose-200'
                      }`}
                    >
                      <Clock className="w-3 h-3" />
                      <span>{item.duration || 'Âm thanh'}</span>
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-sm line-clamp-1 mb-1 leading-snug">
                    {item.title}
                  </h3>

                  <p
                    className={`text-xs line-clamp-2 leading-relaxed ${
                      isSelected ? 'text-rose-100' : 'text-rose-900/80'
                    }`}
                  >
                    {item.historicalNote || item.occasion}
                  </p>

                  <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-rose-300/20">
                    <span className={`text-[10px] ${hasAudio ? (isSelected ? 'text-emerald-300' : 'text-emerald-600 font-semibold') : (isSelected ? 'text-rose-200' : 'text-slate-400')}`}>
                      {hasAudio ? '● Sẵn sàng phát' : '○ Chưa có tệp mp3'}
                    </span>

                    {isAdmin && (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingAudio(item);
                          }}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition ${
                            isSelected
                              ? 'bg-amber-300 text-rose-950 hover:bg-amber-200'
                              : 'bg-rose-100 text-rose-900 hover:bg-rose-200 border border-rose-300'
                          }`}
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Sửa</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteAudio(item.id);
                          }}
                          className="p-1 rounded-lg text-rose-300 hover:text-rose-100 hover:bg-rose-950/40 transition"
                          title="Xóa tư liệu"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Cột Phải: Trình Phát Âm Thanh Thực & Transcript Toàn Văn */}
        <div className="lg:col-span-7">
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-white via-rose-50/60 to-amber-50/40 border-2 border-rose-200 shadow-md space-y-6 sticky top-4">
            {/* Header Audio Chi Tiết */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-rose-200 pb-4">
              <span className="px-3.5 py-1.5 rounded-full bg-rose-700 text-white font-serif font-bold text-xs uppercase tracking-wider shadow-2xs">
                {selectedAudio?.dateStr} • {selectedAudio?.duration}
              </span>

              {isAdmin && (
                <button
                  onClick={() => setEditingAudio(selectedAudio)}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-rose-950 font-bold text-xs flex items-center gap-1.5 transition shadow-xs cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Chỉnh sửa tư liệu này</span>
                </button>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-start gap-4">
              {selectedAudio?.imageUrl && (
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shrink-0 border-2 border-amber-300/80 shadow-md bg-amber-50">
                  <img
                    src={selectedAudio.imageUrl}
                    alt={selectedAudio.title}
                    className="w-full h-full object-cover object-center"
                    referrerPolicy="no-referrer"
                  />
                  {isPlaying && (
                    <div className="absolute top-1.5 right-1.5 px-2 py-0.5 rounded-full bg-rose-700/90 text-amber-200 text-[9px] font-black tracking-wider uppercase backdrop-blur-xs flex items-center gap-1 animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-ping" />
                      <span>Đang phát</span>
                    </div>
                  )}
                </div>
              )}
              <div className="space-y-1.5 flex-1 min-w-0">
                <h3 className="text-xl font-serif font-extrabold text-rose-950 leading-tight">
                  {selectedAudio?.title}
                </h3>
                {selectedAudio?.occasion && (
                  <p className="text-xs text-rose-800 font-medium leading-relaxed">
                    {selectedAudio.occasion}
                  </p>
                )}
                {selectedAudio?.sourceAgency && (
                  <p className="text-[11px] text-emerald-800 font-semibold flex items-center gap-1 mt-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Nguồn lưu trữ: {selectedAudio.sourceAgency}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Trình Phát Audio Thực Chuyên Nghiệp */}
            <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-rose-900 via-rose-800 to-pink-800 text-white space-y-4 shadow-lg border border-rose-400/30">
              {/* Controls Hàng Trên: Play/Pause, Seek Bar, Time */}
              <div className="flex items-center gap-4">
                <button
                  onClick={togglePlay}
                  disabled={isLoadingAudio}
                  className="w-13 h-13 rounded-full bg-gradient-to-br from-amber-300 to-amber-400 hover:brightness-110 text-rose-950 font-bold flex items-center justify-center transition shadow-md cursor-pointer shrink-0 disabled:opacity-50"
                  title={isPlaying ? 'Tạm dừng' : 'Phát bản ghi âm'}
                >
                  {isLoadingAudio ? (
                    <div className="w-5 h-5 border-2 border-rose-950 border-t-transparent rounded-full animate-spin" />
                  ) : isPlaying ? (
                    <Pause className="w-6 h-6 fill-rose-950" />
                  ) : (
                    <Play className="w-6 h-6 ml-0.5 fill-rose-950" />
                  )}
                </button>

                <div className="flex-1 space-y-1.5">
                  {/* Seek slider */}
                  <input
                    type="range"
                    min="0"
                    max={duration || 100}
                    value={currentTime}
                    onChange={handleSeek}
                    disabled={!currentAudioSrc}
                    className="w-full h-2 bg-rose-950/70 rounded-lg appearance-none cursor-pointer accent-amber-300 disabled:opacity-50"
                  />
                  <div className="flex justify-between text-[11px] font-bold text-amber-200">
                    <span>{formatSeconds(currentTime)}</span>
                    <span>{duration > 0 ? formatSeconds(duration) : (selectedAudio?.duration || '00:00')}</span>
                  </div>
                </div>
              </div>

              {/* Controls Hàng Dưới: Lùi 10s, Tiến 10s, Tốc độ, Âm lượng */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-rose-700/50 text-xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => skipTime(-10)}
                    disabled={!currentAudioSrc}
                    className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-950/60 text-amber-200 flex items-center gap-1 transition text-[11px] font-bold"
                    title="Lùi 10 giây"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>-10s</span>
                  </button>
                  <button
                    onClick={() => skipTime(10)}
                    disabled={!currentAudioSrc}
                    className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-950/60 text-amber-200 flex items-center gap-1 transition text-[11px] font-bold"
                    title="Tua tới 10 giây"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>+10s</span>
                  </button>

                  {/* Tốc độ phát */}
                  <div className="flex items-center gap-1 bg-rose-950/40 px-2 py-1 rounded-lg">
                    {[0.75, 1, 1.25].map(rate => (
                      <button
                        key={rate}
                        onClick={() => handleRateChange(rate)}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition ${playbackRate === rate ? 'bg-amber-300 text-rose-950' : 'text-rose-200 hover:text-white'}`}
                      >
                        {rate}x
                      </button>
                    ))}
                  </div>
                </div>

                {/* Âm lượng */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleMute}
                    className="text-amber-200 hover:text-white transition"
                    title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
                  >
                    {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-16 sm:w-20 h-1.5 bg-rose-950/60 rounded appearance-none cursor-pointer accent-amber-300"
                  />
                  {selectedAudio?.audioUrl && (
                    <a
                      href={selectedAudio.audioUrl}
                      target="_blank"
                      rel="noreferrer"
                      download
                      className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-950/70 text-amber-200 transition"
                      title="Mở hoặc tải tệp gốc"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>

              {/* Thông báo nếu chưa có tệp hoặc tệp lỗi */}
              {(!selectedAudio?.audioUrl || hasPlaybackError) && (
                <div className="p-3 bg-amber-950/60 border border-amber-400/40 rounded-2xl text-xs space-y-2">
                  <div className="flex items-start gap-2 text-amber-200">
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="font-bold">
                        {!selectedAudio?.audioUrl
                          ? 'Tư liệu này hiện chưa có tệp âm thanh đính kèm trực tiếp.'
                          : 'Không thể kết nối trực tiếp đến nguồn phát âm thanh từ máy chủ.'}
                      </p>
                      <p className="text-[11px] text-amber-100/80">
                        {isAdmin
                          ? 'Đồng chí có thể tải lên tệp âm thanh (MP3, WAV, M4A) từ máy tính hoặc dán URL mới ngay dưới đây.'
                          : 'Đồng chí có thể xem bản Transcript toàn văn lời Bác Hồ ở phần bên dưới.'}
                      </p>
                    </div>
                  </div>

                  {isAdmin && (
                    <div className="flex justify-end pt-1">
                      <button
                        onClick={() => setEditingAudio(selectedAudio)}
                        className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-rose-950 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Tải lên / Cập nhật âm thanh</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Transcript Bảng Chữ Viết Toàn Văn */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-900 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-rose-700" />
                  <span>Transcript Chữ Viết Toàn Văn Lời Bác Hồ</span>
                </h4>

                {selectedAudio?.transcript && (
                  <button
                    onClick={handleCopyTranscript}
                    className="text-[11px] font-bold text-rose-700 hover:text-rose-950 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-100/80 hover:bg-rose-200/80 transition"
                  >
                    {copiedTranscript ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Đã sao chép</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Sao chép toàn văn</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              <div className="p-5 rounded-2xl bg-white border border-rose-200 font-serif text-xs sm:text-sm text-rose-950 leading-relaxed space-y-3 max-h-80 overflow-y-auto shadow-2xs">
                {selectedAudio?.transcript ? (
                  <p className="italic font-bold text-rose-900 border-b border-rose-100 pb-3 whitespace-pre-line">
                    "{selectedAudio.transcript}"
                  </p>
                ) : (
                  <p className="text-slate-400 italic font-sans text-xs">
                    Chưa có bản transcript chữ viết cho tư liệu này.
                  </p>
                )}

                <div className="text-xs font-sans text-rose-800 space-y-1">
                  {selectedAudio?.sourceAgency && (
                    <p>
                      <b>Nguồn lưu trữ:</b> {selectedAudio.sourceAgency}
                    </p>
                  )}
                  {selectedAudio?.historicalNote && (
                    <p>
                      <b>Chú thích lịch sử:</b> {selectedAudio.historicalNote}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
