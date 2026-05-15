import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useLightbox } from './LightboxContext';

export function IframeLightbox() {
  const { active, close } = useLightbox();
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (active) {
      setLoading(true);
      requestAnimationFrame(() => setMounted(true));
    } else {
      setMounted(false);
    }
  }, [active]);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, close]);

  if (!active) return null;

  const displayUrl =
    active.url === 'about:blank'
      ? `zhuyijia.art/embed/${active.id ?? ''}`
      : active.url.replace(/^https?:\/\//, '').slice(0, 60);

  return (
    <div
      className={`fixed inset-0 z-[200] bg-black/70 backdrop-blur-md flex items-center justify-center p-4 md:p-12 transition-opacity duration-300 ${
        mounted ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={close}
    >
      <div
        className={`relative w-full h-full max-w-[1400px] max-h-[900px] bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col transition-transform duration-300 ${
          mounted ? 'scale-100' : 'scale-95'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Safari-style 顶栏 */}
        <div className="h-10 bg-[#F0F0F0] flex items-center px-4 gap-3 border-b border-gray-200 flex-shrink-0">
          {/* Traffic lights */}
          <div className="flex gap-2">
            <button
              onClick={close}
              className="w-3 h-3 rounded-full bg-[#FF5F57] hover:opacity-80 transition-opacity"
              aria-label="Close"
            />
            <span className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
            <span className="w-3 h-3 rounded-full bg-[#28C840]" />
          </div>

          {/* URL bar */}
          <div className="flex-1 mx-auto max-w-md bg-white rounded-md px-3 py-1 text-xs font-mono text-gray-600 text-center truncate">
            🔒 {displayUrl}
          </div>

          {/* Close X (备用) */}
          <button
            onClick={close}
            className="text-gray-500 hover:text-black transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Loading indicator */}
        {loading && (
          <div className="absolute top-10 left-0 right-0 bottom-0 flex items-center justify-center bg-white z-10">
            <div className="font-mono text-xs text-[#8A8A85] tracking-wider">LOADING…</div>
          </div>
        )}

        {/* 内容：本地视频文件用 video，其他用 iframe */}
        {/\.(mp4|webm|mov|m4v)(\?|$)/i.test(active.url) ? (
          <video
            key={active.id ?? active.url}
            src={active.url}
            title={active.title}
            controls
            autoPlay
            playsInline
            className="flex-1 w-full bg-black object-contain"
            onLoadedData={() => setLoading(false)}
          />
        ) : (
          <iframe
            key={active.id ?? active.url}
            src={active.url}
            title={active.title}
            className="flex-1 w-full border-0"
            allow="autoplay; fullscreen; clipboard-write; encrypted-media"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-presentation"
            onLoad={() => setLoading(false)}
          />
        )}
      </div>
    </div>
  );
}
