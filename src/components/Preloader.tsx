import { useEffect, useState } from 'react';

const SESSION_KEY = 'preloader_shown_v1';

/**
 * 首次访问加载动画
 * - 显示 0% → 100% 进度
 * - 监听 window.load 后渐隐
 * - 同 session 内二次访问不再展示
 * - 兜底超时 3 秒强制结束
 */
export function Preloader() {
  const [shouldShow, setShouldShow] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !sessionStorage.getItem(SESSION_KEY);
  });
  const [progress, setProgress] = useState(0);
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    if (!shouldShow) return;

    // 锁住背景滚动
    document.body.style.overflow = 'hidden';

    let timer: ReturnType<typeof setInterval> | null = null;
    let done = false;

    const finish = () => {
      if (done) return;
      done = true;
      if (timer) clearInterval(timer);
      setProgress(100);
      // 渐隐
      setTimeout(() => setFadingOut(true), 200);
      // 移除
      setTimeout(() => {
        setShouldShow(false);
        document.body.style.overflow = '';
        sessionStorage.setItem(SESSION_KEY, '1');
      }, 700);
    };

    // 假进度递增（避免一直停在某个数）
    timer = setInterval(() => {
      setProgress((p) => {
        const next = p + Math.random() * 8;
        return next >= 95 ? 95 : next;
      });
    }, 80);

    // 监听 window.load
    if (document.readyState === 'complete') {
      finish();
    } else {
      window.addEventListener('load', finish, { once: true });
    }

    // 兜底超时（3 秒）
    const fallback = setTimeout(finish, 3000);

    return () => {
      if (timer) clearInterval(timer);
      clearTimeout(fallback);
      window.removeEventListener('load', finish);
    };
  }, [shouldShow]);

  if (!shouldShow) return null;

  return (
    <div
      className={`fixed inset-0 z-[10000] bg-[#D1D1CB] flex items-center justify-center transition-opacity duration-500 ${
        fadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="font-mono text-5xl md:text-7xl text-[#FF3D00] tabular-nums tracking-tight">
        {String(Math.floor(progress)).padStart(3, '0')}%
      </div>
    </div>
  );
}
