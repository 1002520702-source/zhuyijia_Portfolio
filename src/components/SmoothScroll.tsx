import { useEffect } from 'react';
import Lenis from 'lenis';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Lenis 平滑滚动
 * - 桌面端开启惯性滚动
 * - 移动端走原生（避免触控冲突）
 * - 与 GSAP ScrollTrigger 集成
 */
export function SmoothScroll() {
  useEffect(() => {
    // 移动端跳过
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // 与 GSAP ScrollTrigger 联动
    lenis.on('scroll', () => ScrollTrigger.update());

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return null;
}
