import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Sections
import HeroSection from './sections/HeroSection';
import StickyNavigation from './sections/StickyNavigation';
import AboutSection from './sections/AboutSection';
import WorksIndexSection from './sections/WorksIndexSection';
import WorkDetailSection from './sections/WorkDetailSection';
import { DotGridBackground } from './components/ui/dot-grid-background';
import { TextScrambleWithHover } from './components/ui/text-scramble';
import { LightboxProvider } from './components/code/LightboxContext';
import { IframeLightbox } from './components/code/IframeLightbox';
import { CustomCursor } from './components/CustomCursor';
// import { SmoothScroll } from './components/SmoothScroll';  // 暂时去掉 Lenis 平滑滚动
import { Preloader } from './components/Preloader';
import { ScrollProgress } from './components/ScrollProgress';

import './App.css';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

function App() {
  useEffect(() => {
    ScrollTrigger.defaults({
      toggleActions: 'play none none reverse',
    });

    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener('resize', handleResize);

    const refreshTimeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(refreshTimeout);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <LightboxProvider>
      {/* <SmoothScroll /> 平滑滚动已去掉（与原生滚轮和 ScrollProgress 拖动冲突） */}
      <CustomCursor />
      <ScrollProgress />
      <Preloader />
      <IframeLightbox />
    <div className="relative bg-[#D1D1CB] min-h-screen">
      {/* Dot Grid Background - 铺满整个页面，在最底层 */}
      <DotGridBackground containerClassName="bg-[#D1D1CB]" />

      {/* Sticky Navigation - 在背景之上，Hero滑过后出现 */}
      <div className="relative" style={{ zIndex: 100 }}>
        <StickyNavigation />
      </div>

      {/* Main Content - 在背景之上 */}
      <main className="relative" style={{ zIndex: 10 }}>
        {/* Screen 1: Hero / Portfolio */}
        <HeroSection />

        {/* Screen 2: About Me */}
        <AboutSection />

        {/* Screen 3: Works Index */}
        <WorksIndexSection />

        {/* Screen 4+: Work Details */}
        <WorkDetailSection />

        {/* Footer */}
        <footer className="relative py-16 px-6 md:px-12 lg:px-24 border-t border-[#8A8A85]/20 bg-[#D1D1CB]" style={{ zIndex: 20 }}>
          <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            {/* Left: Branding */}
            <div>
              <h3 className="display-giant text-2xl md:text-3xl mb-2">
                <TextScrambleWithHover duration={0.5} speed={0.03} trigger={true}>
                  portfolio
                </TextScrambleWithHover>
              </h3>
            </div>

            {/* Center: Links */}
            <div className="flex flex-wrap gap-6 md:gap-8">
              <a href="#portfolio" className="nav-link">
                <TextScrambleWithHover duration={0.5} speed={0.03} trigger={true}>home</TextScrambleWithHover>
              </a>
              <a href="#about" className="nav-link">
                <TextScrambleWithHover duration={0.5} speed={0.03} trigger={true}>about</TextScrambleWithHover>
              </a>
              <a href="#works-index" className="nav-link">
                <TextScrambleWithHover duration={0.5} speed={0.03} trigger={true}>works</TextScrambleWithHover>
              </a>
            </div>
          </div>

          {/* Copyright & Personal Info */}
          <div className="max-w-[1600px] mx-auto mt-12 pt-8 border-t border-[#8A8A85]/10">
            {/* 个人信息 */}
            <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-12 mb-8">
              <div className="text-center">
                <p className="text-[10px] font-mono text-[#8A8A85] mb-1">
                  <TextScrambleWithHover duration={0.5} speed={0.03} trigger={true}>年龄</TextScrambleWithHover>
                </p>
                <p className="text-sm font-mono text-[#1A1A1A]">
                  <TextScrambleWithHover duration={0.5} speed={0.03} trigger={true}>21岁</TextScrambleWithHover>
                </p>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-mono text-[#8A8A85] mb-1">
                  <TextScrambleWithHover duration={0.5} speed={0.03} trigger={true}>电子邮件</TextScrambleWithHover>
                </p>
                <a href="mailto:1002520702@qq.com" className="text-sm font-mono text-[#1A1A1A] hover:text-[#FF3D00] transition-colors">
                  <TextScrambleWithHover duration={0.5} speed={0.03} trigger={true}>1002520702@qq.com</TextScrambleWithHover>
                </a>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-mono text-[#8A8A85] mb-1">
                  <TextScrambleWithHover duration={0.5} speed={0.03} trigger={true}>电话/微信</TextScrambleWithHover>
                </p>
                <p className="text-sm font-mono text-[#1A1A1A]">
                  <TextScrambleWithHover duration={0.5} speed={0.03} trigger={true}>13757722815</TextScrambleWithHover>
                </p>
              </div>
            </div>
            {/* 版权信息 */}
            <div className="text-center">
              <p className="work-index text-[10px] text-[#8A8A85]/50">
                <TextScrambleWithHover duration={0.5} speed={0.03} trigger={true}>2026 Zhuyijia made</TextScrambleWithHover>
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
    </LightboxProvider>
  );
}

export default App;
