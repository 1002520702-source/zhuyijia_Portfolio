import { useEffect, useRef, useState } from 'react';

/**
 * 自定义鼠标光标
 * - 默认：8px 橙色小圆点（瞬时跟随）
 * - hover 带 data-cursor="view" 的元素时：60px 橙色圆圈 + "VIEW"
 * - 鼠标位置上有 iframe（即使被 overlay 遮挡）：隐藏自定义光标 + 恢复原生光标
 */
export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isTouch, setIsTouch] = useState(false);

  // 用 ref 存状态，避免频繁 setState 触发 rerender
  const stateRef = useRef({ variant: 'default', overIframe: false, hidden: true });

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

    // 全部用 DOM 操作（不走 React state）以获得最丝滑响应
    const applyState = () => {
      const { variant, overIframe, hidden } = stateRef.current;
      const showCustom = !hidden && !overIframe;
      el.style.opacity = showCustom ? '1' : '0';
      el.style.width = variant === 'view' ? '64px' : '8px';
      el.style.height = variant === 'view' ? '64px' : '8px';
      el.dataset.variant = variant;
      // 让出原生光标
      document.documentElement.style.cursor = overIframe ? 'auto' : 'none';
    };

    let lastIframeCheck = 0;
    const onMove = (e: MouseEvent) => {
      el.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      if (stateRef.current.hidden) {
        stateRef.current.hidden = false;
        applyState();
      }
      // 节流检测当前位置是否有 iframe（最准的方法，能穿透 overlay）
      const now = performance.now();
      if (now - lastIframeCheck > 60) {
        lastIframeCheck = now;
        const els = document.elementsFromPoint(e.clientX, e.clientY);
        const hasIframe = els.some((n) => (n as HTMLElement).tagName === 'IFRAME');
        if (hasIframe !== stateRef.current.overIframe) {
          stateRef.current.overIframe = hasIframe;
          applyState();
        }
      }
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      const newVariant = t.closest('[data-cursor="view"]') ? 'view' : 'default';
      if (newVariant !== stateRef.current.variant) {
        stateRef.current.variant = newVariant;
        applyState();
      }
    };

    const onLeave = () => {
      stateRef.current.hidden = true;
      applyState();
    };

    // window 失焦（用户切到 iframe / 别的窗口）
    const onBlur = () => {
      stateRef.current.overIframe = true;
      applyState();
    };
    const onFocus = () => {
      stateRef.current.overIframe = false;
      applyState();
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseleave', onLeave);
    window.addEventListener('blur', onBlur);
    window.addEventListener('focus', onFocus);

    applyState();

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('blur', onBlur);
      window.removeEventListener('focus', onFocus);
      document.documentElement.style.cursor = '';
    };
  }, [isTouch]);

  if (isTouch) return null;

  return (
    <>
      <style>{`
        @media (pointer: fine) {
          html, body, * { cursor: inherit; }
          iframe { cursor: auto !important; }
        }
      `}</style>
      <div
        ref={cursorRef}
        data-variant="default"
        className="fixed top-0 left-0 z-[9999] pointer-events-none rounded-full bg-[#FF3D00]
                   flex items-center justify-center
                   transition-[width,height,opacity] duration-200 ease-out"
        style={{ opacity: 0, width: 8, height: 8 }}
      >
        <span
          className="text-[10px] font-mono tracking-widest text-white select-none opacity-0
                     transition-opacity duration-200"
          style={{ opacity: 'var(--cursor-text-opacity, 0)' as any }}
        >
          VIEW
        </span>
      </div>
      {/* 用 CSS 控制 VIEW 文字显示 */}
      <style>{`
        [data-variant="view"] > span { opacity: 1 !important; }
        [data-variant="default"] > span { opacity: 0 !important; }
      `}</style>
    </>
  );
}
