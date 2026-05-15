import { useEffect, useRef, useState } from 'react';
import type { CodeProject } from '@/data/codeProjects';
import { useLightbox } from './LightboxContext';

interface Props {
  project: CodeProject;
}

export function CodeProjectCard({ project }: Props) {
  const { open } = useLightbox();
  const videoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  // 视口可见时才挂载 video（lazy）
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: '200px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const handleEnter = () => {
    const v = videoRef.current;
    if (!v) return;
    v.play().catch(() => {}); // 忽略 autoplay 限制错误
  };

  const handleLeave = () => {
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
  };

  const handleClick = () => {
    open({ url: project.iframeUrl, title: project.title, id: project.id });
  };

  return (
    <div
      ref={cardRef}
      id={project.id}
      className={`group cursor-pointer ${project.wide ? 'col-span-1 md:col-span-2' : 'col-span-1'}`}
      onClick={handleClick}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      data-cursor="view"
    >
      {/* 项目编号 badge（沿用原风格） */}
      <div className="h-6 px-3 py-1 bg-[#FF3D00] text-white text-[10px] font-mono tracking-wider flex items-center w-fit mb-4">
        {project.id.split('-').pop()?.toUpperCase()}
      </div>

      {/* 媒体容器 - 16:9，cover 与 hoverVideo 切换 */}
      <div className="relative w-full aspect-[16/9] overflow-hidden bg-[#1A1A1A]/10 border border-[#8A8A85]/20">
        {/* 静态封面 */}
        {project.cover ? (
          <img
            src={project.cover}
            alt={project.title}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          /* 没封面时的深色占位 */
          <div className="absolute inset-0 flex items-center justify-center bg-[#1A1A1A]/10 transition-opacity duration-500 group-hover:opacity-0">
            <span className="text-[#8A8A85]/40 text-xs font-mono tracking-widest">
              {project.id.split('-').pop()?.toUpperCase()}
            </span>
          </div>
        )}

        {/* Hover 视频（lazy mount） */}
        {inView && project.hoverVideo && (
          <video
            ref={videoRef}
            src={project.hoverVideo}
            muted
            loop
            playsInline
            preload="none"
            className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          />
        )}

        {/* Hover 角标（沿用原风格的橙色 L 角） */}
        <div className="absolute top-0 right-0 w-10 h-10 border-t-2 border-r-2 border-[#FF3D00] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-0 left-0 w-10 h-10 border-b-2 border-l-2 border-[#FF3D00] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* 元信息 */}
      <div className="mt-4 flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <span className="work-index text-[#8A8A85]">Frontend</span>
          <span className="w-4 h-px bg-[#8A8A85]/30" />
          <span className="work-index text-[#8A8A85]/50">{project.year}</span>
        </div>
        <h4 className="text-lg md:text-xl font-medium text-[#1A1A1A] group-hover:text-[#FF3D00] transition-colors">
          {project.title}
        </h4>
        {project.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-1">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-mono px-2 py-0.5 border border-[#FF3D00]/60 text-[#FF3D00]/80"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
