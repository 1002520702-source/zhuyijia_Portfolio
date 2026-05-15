import { useEffect, useRef, useState } from 'react';

/**
 * 自定义鼠标光标
 * - 默认：8px 黑色小圆点
 * - hover 带 data-cursor="view" 的元素时：变成 60px 圆圈 + "VIEW" 文字
 * - 移动端（pointer: coarse）不渲染
 */
export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isTouch, setIsTouch] = useState(false);
  const [variant, setVariant] = useState<'default' | 'view'>('default');
  const [hidden, setHidden] = useState(true); // 鼠标进入页面前隐藏

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia('(pointer: coarse)');
    setIsTouch(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setIsTouch(e.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (isTouch) return;

    const el = cursorRef.current;
    if (!el) return;

    // 用 transform 直接操作，性能比 setState 高
    let raf = 0;
    const pos = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };

    const onMove = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (hidden) setHidden(false);
    };

    const tick = () => {
      // 缓动跟随（lerp）
      pos.x += (target.x - pos.x) * 0.25;
      pos.y += (target.y - pos.y) * 0.25;
      el.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // 监听 mousemove
    window.addEventListener('mousemove', onMove);

    // 事件委托：监听整页 mouseover，根据 target 元素决定 variant
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t && t.closest('[data-cursor="view"]')) {
        setVariant('view');
      } else {
        setVariant('default');
      }
    };
    document.addEventListener('mouseover', onOver);

    // 鼠标离开窗口
    const onLeave = () => setHidden(true);
    document.addEventListener('mouseleave', onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, [isTouch, hidden]);

  if (isTouch) return null;

  return (
    <>
      {/* 隐藏原生光标 */}
      <style>{`
        @media (pointer: fine) {
          html, body, * { cursor: none !important; }
        }
      `}</style>
      <div
        ref={cursorRef}
        className={`fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference
                    flex items-center justify-center rounded-full bg-white
                    transition-[width,height,opacity] duration-200 ease-out
                    ${hidden ? 'opacity-0' : 'opacity-100'}
                    ${variant === 'view' ? 'w-16 h-16' : 'w-2 h-2'}`}
      >
        {variant === 'view' && (
          <span className="text-[10px] font-mono tracking-widest text-black mix-blend-normal select-none">
            VIEW
          </span>
        )}
      </div>
    </>
  );
}
