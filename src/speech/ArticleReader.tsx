import React, { useEffect } from 'react';
import { useSpeechSynthesis } from './useSpeechSynthesis';
import { Volume2, Play, Pause, Square, Gauge, Headphones } from 'lucide-react';

interface ArticleReaderProps {
  title: string;
  summary?: string;
  content?: string;
  className?: string;
}

export const ArticleReader: React.FC<ArticleReaderProps> = ({
  title,
  summary,
  content,
  className = ''
}) => {
  const {
    isSupported,
    playbackState,
    isPlaying,
    isPaused,
    activeChunkIndex,
    totalChunks,
    rate,
    speakArticle,
    pause,
    resume,
    stop,
    changeRate
  } = useSpeechSynthesis();

  // Stop speech when unmounting or when title changes (user navigated to another article)
  useEffect(() => {
    return () => {
      stop();
    };
  }, [title]);

  if (!isSupported) return null;

  const handlePlayOrResume = () => {
    if (isPaused) {
      resume();
    } else {
      speakArticle(title, summary, content);
    }
  };

  const speedOptions = [1.0, 1.25, 1.5];
  const progressPercent = totalChunks > 0 
    ? Math.min(100, Math.round(((activeChunkIndex + 1) / totalChunks) * 100)) 
    : 0;

  return (
    <div className={`relative bg-gradient-to-r from-blue-50 via-indigo-50/80 to-blue-50 border border-blue-200/90 rounded-2xl px-3 sm:px-4 py-2 sm:py-2.5 shadow-2xs transition-all my-2 sm:my-3 select-none overflow-hidden ${className}`}>
      
      {/* Sleek Single Row Layout */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        
        {/* Left: Speaker Icon & Title */}
        <div className="flex items-center gap-2 min-w-0">
          <div className={`p-1.5 rounded-xl shrink-0 transition-all ${
            isPlaying ? 'bg-blue-600 text-white shadow-xs animate-pulse' : 'bg-blue-600/90 text-white'
          }`}>
            <Volume2 className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-slate-900 tracking-tight whitespace-nowrap">
                Nghe đọc bài viết
              </span>
              <span className="text-[9px] bg-blue-100 text-blue-800 border border-blue-200/80 font-bold px-1.5 py-0.2 rounded-md shrink-0 hidden sm:inline-block">
                Giọng Tiếng Việt
              </span>
            </div>
          </div>
        </div>

        {/* Center: Play / Pause / Stop Controls & Soundwave */}
        <div className="flex items-center gap-2 shrink-0">
          
          {/* Animated Audio Waveform when Playing */}
          {isPlaying && (
            <div className="hidden xs:flex items-end gap-0.5 h-4 px-1" title="Đang phát âm thanh">
              <span className="w-0.5 bg-blue-600 h-full rounded-full animate-bounce" style={{ animationDuration: '0.6s' }} />
              <span className="w-0.5 bg-blue-600 h-2/3 rounded-full animate-bounce" style={{ animationDuration: '0.8s', animationDelay: '0.2s' }} />
              <span className="w-0.5 bg-blue-600 h-4/5 rounded-full animate-bounce" style={{ animationDuration: '0.5s', animationDelay: '0.1s' }} />
            </div>
          )}

          {!isPlaying ? (
            <button
              type="button"
              onClick={handlePlayOrResume}
              aria-label={isPaused ? "Tiếp tục nghe đọc" : "Phát giọng đọc bài viết"}
              title={isPaused ? "Tiếp tục nghe" : "Nhấp để nghe đọc bằng giọng Tiếng Việt"}
              className="h-8 px-3.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-current text-white" />
              <span>{isPaused ? 'Tiếp tục' : 'Phát bài viết'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={pause}
              aria-label="Tạm dừng đọc"
              title="Nhấn để tạm dừng"
              className="h-8 px-3.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Pause className="w-3.5 h-3.5 fill-current text-white" />
              <span>Tạm dừng</span>
            </button>
          )}

          {(isPlaying || isPaused) && (
            <button
              type="button"
              onClick={stop}
              aria-label="Dừng phát"
              title="Nhấn để dừng hẳn"
              className="h-8 w-8 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl transition-all flex items-center justify-center cursor-pointer active:scale-95 shrink-0"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
            </button>
          )}
        </div>

        {/* Right: Compact Speed Selector */}
        <div className="flex items-center gap-1.5 bg-white/90 border border-slate-200/80 rounded-xl px-2 py-1 shrink-0">
          <span className="text-[10px] font-bold text-slate-500 hidden sm:inline">Tốc độ:</span>
          <div className="flex items-center gap-0.5">
            {speedOptions.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => changeRate(opt)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-black transition-all cursor-pointer ${
                  rate === opt
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {opt}x
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom Ultra-Thin Progress Bar */}
      {(isPlaying || isPaused) && totalChunks > 0 && (
        <div className="absolute inset-x-0 bottom-0 h-1 bg-blue-100">
          <div 
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default ArticleReader;
