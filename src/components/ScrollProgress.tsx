import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * 自定义右侧滚动指示器
 * - 替代浏览器原生 scrollbar（与 Lenis 平滑滚动 + 自定义鼠标兼容）
 * - 可点击 track 跳转
 * - 可拖动 thumb 滚动
 * - 自动 hover 变橙色，data-cursor="view" 触发自定义鼠标
 * - 移动端隐藏（pointer: coarse）
 */
export function ScrollProgress() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);       // 0-1
  const [thumbHeight, setThumbHeight] = useState(60);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  // 检测触屏
  useEffect(() => {
    const mql = window.matchMedia('(pointer: coarse)');
    setIsTouch(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setIsTouch(e.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  // 同步滚动状态
  const updateProgress = useCallback(() => {
    const docH = document.documentElement.scrollHeight;
    const winH = window.innerHeight;
    const scrolled = window.scrollY;
    const max = Math.max(1, docH - winH);
    setProgress(Math.min(1, scrolled / max));
    // thumb 高度按视口/文档比例，最小 40px
    const h = Math.max(40, Math.min(winH * 0.5, (winH / docH) * winH));
    setThumbHeight(h);
  }, []);

  useEffect(() => {
    if (isTouch) return;
    updateProgress();
    const onScroll = () => updateProgress();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateProgress);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', updateProgress);
    };
  }, [isTouch, updateProgress]);

  // 跳转到指定 Y 位置
  const scrollTo = useCallback((targetY: number) => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const y = Math.max(0, Math.min(max, targetY));
    window.scrollTo({ top: y, behavior: 'auto' });  // Lenis 接管平滑
  }, []);

  // 点击 track 跳转
  const handleTrackClick = (e: React.MouseEvent) => {
    if (isDragging) return;
    if (!trackRef.current) return;
    if ((e.target as HTMLElement).dataset.thumb === '1') return; // 点 thumb 不算
    const rect = trackRef.current.getBoundingClientRect();
    const clickRatio = (e.clientY - rect.top - thumbHeight / 2) / (rect.height - thumbHeight);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    scrollTo(Math.max(0, Math.min(1, clickRatio)) * max);
  };

  // 拖动 thumb
  const handleThumbMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!trackRef.current) return;
    setIsDragging(true);
    const trackRect = trackRef.current.getBoundingClientRect();
    const usableHeight = trackRect.height - thumbHeight;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const startY = e.clientY;
    const startProgress = progress;

    const onMove = (ev: MouseEvent) => {
      const deltaY = ev.clientY - startY;
      const newProgress = startProgress + deltaY / usableHeight;
      scrollTo(Math.max(0, Math.min(1, newProgress)) * max);
    };
    const onUp = () => {
      setIsDragging(false);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  if (isTouch) return null;

  // thumb 顶部 px
  const trackUsable = (typeof window !== 'undefined' ? window.innerHeight : 0) - thumbHeight;
  const thumbTop = progress * trackUsable;
  const active = isHovered || isDragging;

  return (
    <div
      ref={trackRef}
      onClick={handleTrackClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed top-0 right-0 h-screen z-[80] transition-[width] duration-200 ease-out"
      style={{ width: active ? '10px' : '4px' }}
      data-cursor="view"
    >
      {/* track 背景 */}
      <div className="absolute inset-y-0 right-0 w-full bg-[#8A8A85]/15" />
      {/* thumb */}
      <div
        data-thumb="1"
        onMouseDown={handleThumbMouseDown}
        className={`absolute right-0 w-full transition-colors ${
          active ? 'bg-[#FF3D00]' : 'bg-[#8A8A85]/60'
        }`}
        style={{
          height: thumbHeight,
          transform: `translateY(${thumbTop}px)`,
        }}
      />
    </div>
  );
}
