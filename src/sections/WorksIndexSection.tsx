import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import { TextScrambleWithHover } from '@/components/ui/text-scramble';

gsap.registerPlugin(ScrollTrigger);

interface SubItem {
  id: string;
  label: string;
  targetId: string;
}

interface WorkCategory {
  index: string;
  title: string;
  mobileTitle: string[];
  subItems: SubItem[];
  targetId: string;
}

const workCategories: WorkCategory[] = [
  {
    index: '01',
    title: 'DESIGN',
    mobileTitle: ['DESIGN'],
    subItems: [
      { id: 'design-001', label: '001 《StoneCity》 石之城', targetId: 'design-001' },
      { id: 'design-002', label: '002 《Peak》 山崖', targetId: 'design-002' },
      { id: 'design-003', label: '003 《Blade Runner》 银翼杀手', targetId: 'design-003' },
      { id: 'design-004', label: '004 Tajima Cutter 美工刀', targetId: 'design-004' },
      { id: 'design-005', label: '005 Mech Prototype 机械原型', targetId: 'design-005' },
      { id: 'design-006', label: '006 《风格化柠檬》', targetId: 'design-006' },
    ],
    targetId: 'work-design',
  },
  {
    index: '02',
    title: 'GAME',
    mobileTitle: ['GAME'],
    subItems: [
      { id: 'game-001', label: '001 C++ 游戏', targetId: 'game-001' },
      { id: 'game-002', label: '002 《IK 重定向》', targetId: 'game-002' },
      { id: 'game-003', label: '003 《迭代缩小》', targetId: 'game-003' },
      { id: 'game-004', label: '004 《跟随指针》', targetId: 'game-004' },
    ],
    targetId: 'work-game',
  },
  {
    index: '03',
    title: 'CODE',
    mobileTitle: ['CODE'],
    subItems: [
      { id: 'code-001', label: '001 网页设计', targetId: 'frontend-001' },
      { id: 'code-002', label: '002 AI 交互界面', targetId: 'frontend-002' },
    ],
    targetId: 'work-code',
  },
];

function WorkItem({
  work,
  activeDropdown,
  setActiveDropdown
}: {
  work: WorkCategory;
  activeDropdown: string | null;
  setActiveDropdown: (id: string | null) => void;
}) {
  const itemRef = useRef<HTMLDivElement>(null);
  const isActive = activeDropdown === work.index;

  const handleMouseEnter = () => {
    setActiveDropdown(work.index);
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    const relatedTarget = e.relatedTarget as HTMLElement;
    const dropdownEl = itemRef.current?.querySelector('.dropdown-menu');

    if (dropdownEl && dropdownEl.contains(relatedTarget)) {
      return;
    }
    if (activeDropdown === work.index) {
      setActiveDropdown(null);
    }
  };

  const handleDropdownMouseLeave = (e: React.MouseEvent) => {
    const relatedTarget = e.relatedTarget as HTMLElement;
    const itemEl = itemRef.current;

    if (itemEl && itemEl.contains(relatedTarget)) {
      return;
    }
    setActiveDropdown(null);
  };

  const handleWorkClick = () => {
    const element = document.getElementById(work.targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubItemClick = (targetId: string) => {
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setActiveDropdown(null);
  };

  return (
    <div
      ref={itemRef}
      className="work-item group relative"
      onMouseEnter={handleMouseEnter}
    >
      {/* Divider Line */}
      <div className="h-px bg-[#8A8A85]/30 relative overflow-hidden">
        <div className="absolute inset-y-0 left-0 w-0 bg-[#FF3D00] group-hover:w-full transition-all duration-500 ease-out" />
      </div>

      {/* Work Item Content */}
      <div
        className="py-8 md:py-10 flex items-center justify-between gap-6 cursor-pointer"
        onClick={handleWorkClick}
        onMouseLeave={handleMouseLeave}
      >
        {/* Left: Index + Title */}
        <div className="flex items-baseline gap-4 md:gap-12 flex-1 min-w-0">
          <span className={`work-index transition-colors flex-shrink-0 ${isActive ? 'text-[#FF3D00]' : 'text-[#8A8A85] group-hover:text-[#FF3D00]'}`}>
            <TextScrambleWithHover duration={0.5} speed={0.03} trigger={true}>
              {work.index}
            </TextScrambleWithHover>
          </span>
          <div className="flex flex-col gap-0">
            {/* Desktop Title */}
            <h3 className={`hidden md:block work-title transition-all duration-300 ${isActive ? 'translate-x-2 text-[#FF3D00]' : 'group-hover:translate-x-2'}`}>
              <TextScrambleWithHover duration={0.5} speed={0.03} trigger={true}>
                {work.title}
              </TextScrambleWithHover>
            </h3>
            {/* Mobile Title */}
            <h3 className={`md:hidden work-title transition-all duration-300 leading-tight ${isActive ? 'translate-x-2 text-[#FF3D00]' : 'group-hover:translate-x-2'}`}>
              {work.mobileTitle.map((line, i) => (
                <span key={i} className="block">
                  <TextScrambleWithHover duration={0.5} speed={0.03} trigger={true}>
                    {line}
                  </TextScrambleWithHover>
                </span>
              ))}
            </h3>
          </div>
        </div>

        {/* Right: Arrow */}
        <div className={`w-10 h-10 rounded-full border flex items-center justify-center flex-shrink-0 transition-all duration-300 ${isActive ? 'border-[#FF3D00] bg-[#FF3D00]' : 'border-[#8A8A85]/30 group-hover:border-[#FF3D00] group-hover:bg-[#FF3D00]'}`}>
          <ArrowUpRight
            className={`w-4 h-4 transition-colors ${isActive ? 'text-white' : 'text-[#8A8A85] group-hover:text-white'}`}
            strokeWidth={1.5}
          />
        </div>
      </div>

      {/* Dropdown Menu — grid-rows 0fr↔1fr 平滑展开 + 子项整体淡入（不抽搐） */}
      <div
        className="dropdown-menu grid transition-[grid-template-rows,opacity] ease-[cubic-bezier(0.22,1,0.36,1)] duration-500"
        style={{
          gridTemplateRows: isActive ? '1fr' : '0fr',
          opacity: isActive ? 1 : 0,
          pointerEvents: isActive ? 'auto' : 'none',
        }}
        onMouseLeave={handleDropdownMouseLeave}
      >
        <div className="overflow-hidden">
          <div className="pt-2 pb-6 pl-12 md:pl-20 space-y-3">
            {work.subItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 cursor-pointer group/item"
                onClick={() => handleSubItemClick(item.targetId)}
              >
                <span className="w-6 h-px bg-[#8A8A85]/50 group-hover/item:bg-[#FF3D00] transition-colors" />
                <span className="body-mono text-[#8A8A85] group-hover/item:text-[#FF3D00] transition-colors">
                  <TextScrambleWithHover duration={0.5} speed={0.03} trigger={true}>
                    {item.label}
                  </TextScrambleWithHover>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}

export default function WorksIndexSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const header = headerRef.current;
    const list = listRef.current;
    if (!section || !header || !list) return;

    const headerTitle = header.querySelector('h2');
    const headerSubtitle = header.querySelector('.subtitle-en');
    const headerSubtitleCn = header.querySelector('.subtitle-cn');

    gsap.set(headerTitle, { y: 60, opacity: 0 });
    gsap.set(headerSubtitle, { y: 30, opacity: 0 });
    gsap.set(headerSubtitleCn, { y: 20, opacity: 0 });

    const workItems = list.querySelectorAll('.work-item');
    gsap.set(workItems, { y: 80, opacity: 0 });

    ScrollTrigger.create({
      trigger: section,
      start: 'top 70%',
      end: 'bottom 30%',
      onEnter: () => setIsInView(true),
      onLeave: () => setIsInView(false),
      onEnterBack: () => setIsInView(true),
      onLeaveBack: () => setIsInView(false),
    });

    const headerTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 70%',
        toggleActions: 'play none none reverse',
      },
    });

    headerTl
      .to(headerTitle, {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: 'power3.out',
      })
      .to(
        headerSubtitle,
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
        },
        '-=0.3'
      )
      .to(
        headerSubtitleCn,
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: 'power2.out',
        },
        '-=0.3'
      );

    gsap.to(workItems, {
      y: 0,
      opacity: 1,
      duration: 0.7,
      stagger: 0.12,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: list,
        start: 'top 75%',
        toggleActions: 'play none none reverse',
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        trigger.kill();
      });
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="works-index"
      className="section-full relative flex flex-col justify-center py-24 px-6 md:px-12 lg:px-24"
      style={{ zIndex: 10 }}
    >
      <div className="max-w-[1600px] mx-auto w-full">
      {/* Section Header */}
      <div ref={headerRef} className="mb-16 md:mb-24">
        <h2 className="display-giant text-5xl md:text-7xl lg:text-8xl mb-6">
          <TextScrambleWithHover duration={1.0} speed={0.03} trigger={isInView}>
            WORKS
          </TextScrambleWithHover>
        </h2>
        <p className="subtitle-en body-mono text-[#8A8A85] max-w-xl">
          <TextScrambleWithHover duration={0.5} speed={0.03} trigger={isInView}>
            Design · Game · Code
          </TextScrambleWithHover>
        </p>
        <p className="subtitle-cn body-mono text-[#8A8A85]/60 mt-2 text-xs">
          <TextScrambleWithHover duration={0.5} speed={0.03} trigger={isInView}>
            视觉设计 · 游戏开发 · 前端开发
          </TextScrambleWithHover>
        </p>
      </div>

      {/* Works List */}
      <div ref={listRef} className="space-y-0">
        {workCategories.map((work) => (
          <WorkItem
            key={work.index}
            work={work}
            activeDropdown={activeDropdown}
            setActiveDropdown={setActiveDropdown}
          />
        ))}

        {/* Final Divider */}
        <div className="h-px bg-[#8A8A85]/30" />
      </div>

      {/* Bottom Note */}
      <div className="mt-16 flex justify-between items-center">
        <p className="section-label">
          <TextScrambleWithHover duration={0.5} speed={0.03} trigger={isInView}>
            Scroll to explore each category
          </TextScrambleWithHover>
        </p>
        <p className="work-index">
          <TextScrambleWithHover duration={0.5} speed={0.03} trigger={isInView}>
            03 Categories
          </TextScrambleWithHover>
        </p>
      </div>
      </div>
    </section>
  );
}
