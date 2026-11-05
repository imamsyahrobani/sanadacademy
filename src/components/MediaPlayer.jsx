import React, { useState } from 'react';
import { parseMediaUrl } from '../utils/mediaParser';
import { Video, Volume2, ExternalLink, Play, AlertCircle } from 'lucide-react';

export default function MediaPlayer({ mediaType = 'audio', mediaUrl, title }) {
  if (!mediaUrl) return null;

  const parsed = parseMediaUrl(mediaUrl);
  if (!parsed) return null;

  const [useAlternativeEmbed, setUseAlternativeEmbed] = useState(false);

  // Determine if it should be treated as video
  const isVideo = mediaType === 'video' || parsed.type === 'youtube' || parsed.type === 'gdrive' || parsed.type === 'direct_video';

  if (isVideo) {
    if (parsed.type === 'youtube') {
      // Toggle between standard youtube.com and youtube-nocookie.com
      const embedSrc = useAlternativeEmbed 
        ? `https://www.youtube.com/embed/${parsed.videoId}?autoplay=0&rel=0&modestbranding=1&enablejsapi=1` 
        : `https://www.youtube-nocookie.com/embed/${parsed.videoId}?autoplay=0&rel=0&modestbranding=1&enablejsapi=1`;

      const youtubeWatchUrl = `https://www.youtube.com/watch?v=${parsed.videoId}`;

      return (
        <div className="space-y-2.5 my-3.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
            <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
              <Video className="w-4 h-4 text-red-600 shrink-0" />
              <span>Video Pembelajaran • YouTube</span>
            </span>
            <a
              href={youtubeWatchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs bg-red-50 hover:bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800/50 px-2.5 py-1 rounded-xl flex items-center gap-1.5 font-bold transition shadow-xs"
              title="Buka langsung video ini di aplikasi atau web YouTube"
            >
              <span>Buka di YouTube ↗</span>
              <ExternalLink className="w-3 h-3 text-red-600 dark:text-red-400" />
            </a>
          </div>

          {/* 16:9 Responsive Video Container */}
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 shadow-md">
            <iframe
              key={embedSrc}
              src={embedSrc}
              title={title || "Video Pembelajaran Modul"}
              className="absolute inset-0 w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>

          {/* Helpful Quick Troubleshooting Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 px-3.5 py-2.5 rounded-xl text-xs text-slate-600 dark:text-slate-400">
            <span>Video tidak berputar atau terhalang browser?</span>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setUseAlternativeEmbed(!useAlternativeEmbed)}
                className="text-amber-700 dark:text-amber-400 hover:underline font-bold"
              >
                Ganti Jalur Embed ({useAlternativeEmbed ? 'Server 2' : 'Server 1'})
              </button>
              <span>•</span>
              <a
                href={youtubeWatchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 dark:text-emerald-400 hover:underline font-bold flex items-center gap-0.5"
              >
                Tonton Langsung di YouTube ↗
              </a>
            </div>
          </div>
        </div>
      );
    }

    if (parsed.type === 'gdrive' || parsed.type === 'generic') {
      return (
        <div className="space-y-2 my-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <Video className="w-4 h-4" />
              <span>Video Pembelajaran {parsed.type === 'gdrive' ? '• Google Drive' : ''}</span>
            </span>
            <a
              href={parsed.directWatchUrl || parsed.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 flex items-center gap-1 transition"
            >
              <span>Buka di Tab Baru</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-black shadow-md">
            <iframe
              src={parsed.embedUrl}
              title={title || "Video Pembelajaran Modul"}
              className="absolute inset-0 w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>
      );
    }

    if (parsed.type === 'direct_video') {
      return (
        <div className="space-y-2 my-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <Video className="w-4 h-4" />
            <span>Video Pembelajaran</span>
          </div>
          <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-black shadow-md">
            <video
              src={parsed.embedUrl}
              controls
              className="w-full aspect-video"
              title={title}
            >
              Browser Anda tidak mendukung tag video HTML5.
            </video>
          </div>
        </div>
      );
    }
  }

  // Audio Player Display
  return (
    <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 p-3.5 rounded-2xl space-y-2 my-3 shadow-sm">
      <div className="flex items-center justify-between text-xs font-bold text-emerald-800 dark:text-emerald-300">
        <span className="flex items-center gap-1.5">
          <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 animate-pulse" />
          <span>Ulasan Audio Pengajar</span>
        </span>
        <span className="text-[10px] bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full font-bold">
          Audio Pembelajaran
        </span>
      </div>
      <audio src={parsed.embedUrl} controls className="w-full h-9 accent-emerald-600" />
    </div>
  );
}
