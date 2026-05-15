import { useEffect, useState } from 'react';

const MIN_DURATION = 1500;   // 至少展示 1.5 秒（让用户看到进度动画）
const MAX_DURATION = 6000;   // 最多 6 秒兜底
const SESSION_KEY = 'preloader_shown_v2';

/**
 * 首屏加载动画
 * - DEV 模式：每次刷新都展示
 * - 生产模式：同 session 只展示一次
 * - 真实监控：统计页面所有 img / video 的加载进度
 * - 最小展示时长 1.5s（保证用户看到 0-100% 动画）
 */
export function Preloader() {
  const [shouldShow, setShouldShow] = useState(() => {
    if (typeof window === 'undefined') return false;
    if (import.meta.env.DEV) return true;             // 开发模式每次展示
    return !sessionStorage.getItem(SESSION_KEY);
  });
  const [progress, setProgress] = useState(0);
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    if (!shouldShow) return;
    document.body.style.overflow = 'hidden';

    const startTime = performance.now();
    let done = false;
    let timer: number | null = null;

    const checkAssets = () => {
      const imgs = Array.from(document.querySelectorAll('img'));
      const videos = Array.from(document.querySelectorAll('video'));
      const total = imgs.length + videos.length;
      if (total === 0) return { loaded: 0, total: 0 };
      let loaded = 0;
      imgs.forEach((img) => {
        if (img.complete && img.naturalHeight > 0) loaded++;
      });
      videos.forEach((v) => {
        if (v.readyState >= 2) loaded++;  // HAVE_CURRENT_DATA 即可
      });
      return { loaded, total };
    };

    const finish = () => {
      if (done) return;
      done = true;
      if (timer) clearInterval(timer);
      const elapsed = performance.now() - startTime;
      const remaining = Math.max(0, MIN_DURATION - elapsed);
      window.setTimeout(() => {
        setProgress(100);
        window.setTimeout(() => setFadingOut(true), 250);
        window.setTimeout(() => {
          setShouldShow(false);
          document.body.style.overflow = '';
          sessionStorage.setItem(SESSION_KEY, '1');
        }, 800);
      }, remaining);
    };

    // 主循环：每 50ms 更新进度
    timer = window.setInterval(() => {
      const elapsed = performance.now() - startTime;
      const { loaded, total } = checkAssets();
      // 进度 = max(基于时间的最小推进, 真实资源进度)
      const timeProgress = Math.min(elapsed / MIN_DURATION, 1) * 95;
      const assetProgress = total > 0 ? (loaded / total) * 95 : timeProgress;
      const next = Math.max(timeProgress, assetProgress);
      setProgress(Math.min(95, next));

      // 完成条件
      if (total > 0 && loaded === total && elapsed >= MIN_DURATION) {
        finish();
      } else if (elapsed >= MAX_DURATION) {
        finish();
      }
    }, 50);

    return () => {
      if (timer) clearInterval(timer);
      document.body.style.overflow = '';
    };
  }, [shouldShow]);

  if (!shouldShow) return null;

  return (
    <div
      className={`fixed inset-0 z-[10000] bg-[#D1D1CB] flex flex-col items-center justify-center transition-opacity duration-700 ${
        fadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* 名字 / 标识 */}
      <div className="absolute top-8 left-8 font-mono text-xs tracking-widest text-[#8A8A85]">
        ZHUYIJIA — PORTFOLIO
      </div>

      {/* 主数字 */}
      <div className="font-mono text-6xl md:text-8xl text-[#FF3D00] tabular-nums tracking-tight">
        {String(Math.floor(progress)).padStart(3, '0')}
      </div>

      {/* 进度条 */}
      <div className="mt-8 w-48 md:w-64 h-px bg-[#8A8A85]/30 overflow-hidden">
        <div
          className="h-full bg-[#FF3D00] transition-[width] duration-200 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* 底部小字 */}
      <div className="absolute bottom-8 left-8 font-mono text-[10px] tracking-widest text-[#8A8A85]">
        LOADING ASSETS
      </div>
      <div className="absolute bottom-8 right-8 font-mono text-[10px] tracking-widest text-[#8A8A85] tabular-nums">
        {Math.floor(progress)}%
      </div>
    </div>
  );
}
