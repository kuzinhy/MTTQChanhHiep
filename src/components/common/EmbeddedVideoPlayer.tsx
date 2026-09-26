import React from 'react';
import { Play, Video, ExternalLink, Film } from 'lucide-react';

export interface VideoInfo {
  type: 'youtube' | 'facebook' | 'direct' | 'unsupported';
  embedUrl?: string;
  originalUrl: string;
  videoId?: string;
}

/**
 * Utility to parse and extract embed details from YouTube or Facebook video URLs
 */
export function parseVideoUrl(url: string | undefined | null): VideoInfo | null {
  if (!url || typeof url !== 'string' || !url.trim()) return null;
  const trimmed = url.trim();

  // 1. YouTube matching
  // Matches: youtube.com/watch?v=xxx, youtu.be/xxx, youtube.com/shorts/xxx, youtube.com/embed/xxx, m.youtube.com/...
  const ytMatch = trimmed.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|shorts\/)|youtu\.be\/)([^"&?\/\s]{11})/i);
  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    return {
      type: 'youtube',
      videoId,
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&enablejsapi=1`,
      originalUrl: trimmed
    };
  }

  // 2. Facebook Video matching
  // Matches: facebook.com/.../videos/..., fb.watch/..., facebook.com/reel/..., facebook.com/watch/?v=...
  if (
    trimmed.includes('facebook.com') ||
    trimmed.includes('fb.watch') ||
    trimmed.includes('fb.com')
  ) {
    const encoded = encodeURIComponent(trimmed);
    return {
      type: 'facebook',
      embedUrl: `https://www.facebook.com/plugins/video.php?href=${encoded}&show_text=false&t=0&autoplay=0`,
      originalUrl: trimmed
    };
  }

  // 3. Direct video file (mp4, webm, mov, ogg)
  if (/\.(mp4|webm|mov|ogg)(\?.*)?$/i.test(trimmed)) {
    return {
      type: 'direct',
      embedUrl: trimmed,
      originalUrl: trimmed
    };
  }

  // Unsupported or generic web link
  return {
    type: 'unsupported',
    originalUrl: trimmed
  };
}

interface EmbeddedVideoPlayerProps {
  url: string;
  title?: string;
  caption?: string;
  className?: string;
  aspectRatio?: '16/9' | '4/3' | '1/1' | '9/16';
  showExternalLink?: boolean;
}

export const EmbeddedVideoPlayer: React.FC<EmbeddedVideoPlayerProps> = ({
  url,
  title = 'Video Phóng Sự / Clip Hoạt Động',
  caption,
  className = '',
  aspectRatio = '16/9',
  showExternalLink = true
}) => {
  const videoInfo = parseVideoUrl(url);

  if (!videoInfo) return null;

  return (
    <div className={`overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-slate-950 text-white shadow-md ${className}`}>
      {/* Header bar of video player */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900/90 border-b border-white/10 text-xs gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-1.5 rounded-lg bg-red-600 text-white shrink-0 shadow-xs">
            {videoInfo.type === 'youtube' ? (
              <Play className="w-3.5 h-3.5 fill-current" />
            ) : videoInfo.type === 'facebook' ? (
              <Video className="w-3.5 h-3.5" />
            ) : (
              <Film className="w-3.5 h-3.5" />
            )}
          </div>
          <span className="font-bold text-white truncate text-xs sm:text-sm">
            {title}
          </span>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-black uppercase tracking-wider text-slate-300">
            {videoInfo.type === 'youtube' ? 'YouTube HD' : videoInfo.type === 'facebook' ? 'Facebook Video' : 'Video Clip'}
          </span>
        </div>

        {showExternalLink && (
          <a
            href={videoInfo.originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 text-[11px] font-medium transition-colors shrink-0"
            title="Mở video trên trang nguồn gốc"
          >
            <span>Mở video gốc</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>

      {/* Video Viewport */}
      <div className={`relative w-full bg-black flex items-center justify-center`} style={{ aspectRatio: aspectRatio.replace('/', ' / ') }}>
        {videoInfo.type === 'youtube' && videoInfo.embedUrl && (
          <iframe
            src={videoInfo.embedUrl}
            title={title}
            className="w-full h-full border-0 absolute inset-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        )}

        {videoInfo.type === 'facebook' && videoInfo.embedUrl && (
          <iframe
            src={videoInfo.embedUrl}
            title={title}
            className="w-full h-full border-0 absolute inset-0 bg-slate-900"
            scrolling="no"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            allowFullScreen
          />
        )}

        {videoInfo.type === 'direct' && videoInfo.embedUrl && (
          <video
            src={videoInfo.embedUrl}
            controls
            playsInline
            className="w-full h-full object-contain"
          >
            Trình duyệt của bạn không hỗ trợ phát trực tiếp video này.
          </video>
        )}

        {videoInfo.type === 'unsupported' && (
          <div className="p-8 text-center space-y-3">
            <Video className="w-12 h-12 text-slate-400 mx-auto" />
            <p className="text-xs text-slate-300">
              Liên kết video: <span className="font-mono text-blue-400">{videoInfo.originalUrl}</span>
            </p>
            <a
              href={videoInfo.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Xem trực tiếp video</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}
      </div>

      {/* Optional Caption */}
      {caption && (
        <div className="p-3 bg-slate-900 border-t border-white/10 text-xs text-slate-300 italic text-center">
          {caption}
        </div>
      )}
    </div>
  );
};
