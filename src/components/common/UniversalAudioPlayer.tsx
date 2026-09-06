import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, RotateCw, Volume2, Settings } from 'lucide-react';

interface UniversalAudioPlayerProps {
  url: string;
  title: string;
  onLoadedMetadata?: (duration: number) => void;
}

export const UniversalAudioPlayer: React.FC<UniversalAudioPlayerProps> = ({ url, title, onLoadedMetadata }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
  }, [url]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.pause();
      else audioRef.current.play().catch(e => setError('Không thể phát âm thanh'));
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      if (onLoadedMetadata) onLoadedMetadata(audioRef.current.duration);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const skip = (seconds: number) => {
    if (audioRef.current) audioRef.current.currentTime += seconds;
  };

  const proxyUrl = url.includes('hochiminh.vn') ? `/api/media/proxy?url=${encodeURIComponent(url)}` : url;

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 font-sans">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-slate-900 truncate">{title}</h4>
      </div>

      {error ? (
        <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl border border-red-200">
          Không thể phát tư liệu âm thanh. Vui lòng thử lại hoặc mở nguồn tư liệu.
          <a href={url} target="_blank" rel="noreferrer" className="block mt-1 font-bold underline">Mở nguồn tư liệu</a>
        </div>
      ) : (
        <div className="space-y-2">
          <audio
            ref={audioRef}
            src={proxyUrl}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onError={() => setError('Lỗi khi tải dữ liệu âm thanh')}
          />
          
          {/* Progress bar */}
          <input
            type="range"
            min="0"
            max={duration}
            value={currentTime}
            onChange={(e) => {
              if (audioRef.current) audioRef.current.currentTime = Number(e.target.value);
            }}
            className="w-full h-1 bg-slate-300 rounded-lg appearance-none cursor-pointer accent-red-600"
          />
          
          <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              <button onClick={() => skip(-10)} className="p-1.5 hover:bg-slate-200 rounded-full"><RotateCcw className="w-4 h-4" /></button>
              <button onClick={togglePlay} className="p-2 bg-red-600 text-white rounded-full">
                {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white" />}
              </button>
              <button onClick={() => skip(10)} className="p-1.5 hover:bg-slate-200 rounded-full"><RotateCw className="w-4 h-4" /></button>
            </div>
            
            <div className="flex items-center gap-2">
              <select 
                value={playbackRate} 
                onChange={(e) => {
                  const rate = Number(e.target.value);
                  setPlaybackRate(rate);
                  if (audioRef.current) audioRef.current.playbackRate = rate;
                }}
                className="text-[10px] font-bold bg-slate-200 rounded-lg px-1"
              >
                {[0.75, 1, 1.25, 1.5].map(r => <option key={r} value={r}>{r}x</option>)}
              </select>
              <Volume2 className="w-4 h-4 text-slate-500" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
