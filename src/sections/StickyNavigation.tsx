import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface NavItem {
  id: string;
  label: string;
  index?: string;
}

const navItems: NavItem[] = [
  { id: 'about', label: 'About Me' },
  { id: 'works-index', label: 'Works' },
  { id: 'work-design', label: 'Design', index: '01' },
  { id: 'work-game', label: 'Game', index: '02' },
  { id: 'work-code', label: 'Code', index: '03' },
];

export default function StickyNavigation() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('portfolio');
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // 当滚动到 about 部分时才显示导航栏（HERO 滑过之后）
    ScrollTrigger.create({
      trigger: '#about',
      start: 'top 80%',
      onEnter: () => setIsVisible(true),
      onLeaveBack: () => setIsVisible(false),
    });

    // Track active section
    const sections = ['portfolio', 'about', 'works-index', 'work-design', 'work-game', 'work-code'];
    
    sections.forEach((sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) {
        ScrollTrigger.create({
          trigger: element,
          start: 'top center',
          end: 'bottom center',
          onEnter: () => setActiveSection(sectionId),
          onEnterBack: () => setActiveSection(sectionId),
        });
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const handleNavClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav
          ref={navRef}
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{
            duration: 0.5,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          className="fixed top-0 left-0 right-0 py-4 px-6 md:px-12 z-50"
          style={{
            background: 'rgba(209, 209, 203, 0.92)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(138, 138, 133, 0.2)',
          }}
        >
          <div className="flex items-center justify-between max-w-[1800px] mx-auto">
            {/* Logo / Home */}
            <button
              onClick={() => handleNavClick('portfolio')}
              className="section-label hover:text-[#FF3D00] transition-colors"
            >
              TA Portfolio
            </button>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`nav-link flex items-center gap-2 ${
                    activeSection === item.id ? 'active' : ''
                  }`}
                >
                  {item.index && (
                    <span className="work-index text-[10px]">{item.index}</span>
                  )}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            {/* Mobile Menu Indicator */}
            <div className="md:hidden section-label">
              {activeSection === 'portfolio' && 'Home'}
              {activeSection === 'about' && 'About'}
              {activeSection === 'works-index' && 'Works'}
              {activeSection?.startsWith('work-') &&
                navItems.find((i) => i.id === activeSection)?.label}
            </div>

            {/* Contact */}
            <button
              onClick={() => handleNavClick('about')}
              className="section-label hover:text-[#FF3D00] transition-colors"
            >
              Contact
            </button>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
