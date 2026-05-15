import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextScrambleWithHover } from '@/components/ui/text-scramble';
import { CodeWorksGrid } from '@/components/code/CodeWorksGrid';
import { codeProjects } from '@/data/codeProjects';
import { useLightbox } from '@/components/code/LightboxContext';

gsap.registerPlugin(ScrollTrigger);

interface TextureMap {
  name: string;
  src: string;
}

interface Award {
  title: string;
  image: string;
}

interface Project {
  id: string;
  title: string;
  category: string;
  year: string;
  description: string;
  tools: string[];
  wide?: boolean;
  modelUrl?: string;          // Sketchfab 3D 模型 iframe（保留原交互）
  videoUrl?: string;          // 本地 mp4 — 用作 hover 预览
  bilibiliEmbedUrl?: string;  // 点击 lightbox 嵌入的 Bilibili iframe URL（player.bilibili.com/...）
  bilibiliUrl?: string;       // 跳转用外链（旧字段，C++游戏卡片）
  coverImage?: string;        // 静态封面图；没有则用 video 第一帧
  textureMaps?: TextureMap[];
  awards?: Award[];
  stylizedImage?: { name: string; src: string };
}

interface WorkDetail {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  projects: Project[];
}

type FilterKey = 'all' | 'design' | 'game' | 'code';

const workDetails: WorkDetail[] = [
  {
    id: 'work-design',
    index: '01',
    title: 'DESIGN',
    subtitle: '视觉设计',
    projects: [
      {
        id: 'design-001',
        title: '《StoneCity》 石之城',
        category: 'UE5 LEVEL ART',
        year: '2025',
        wide: true,
        description:
          '设计说明：本作品以 "石之城"—— 古文明 "灰岩之邦" 的废墟为核心场景，这座因透支地脉魔法而覆灭的城邦，千年后化为迷雾笼罩的石墟。动画通过四幕递进叙事：全景展现残垣断壁与石纹符文的文明遗骸，UE 环境光效强化死寂氛围；兜帽守墓者从废墟中蛰伏现身，石质纹理贴合城邦基石质感；碎石浮动与微光闪烁触发觉醒预兆，暗示地脉魔法复苏；最终守墓者展开复刻石城瓦纹的渡鸦之翼，裂痕红光呼应昔日魔法核心。作品以 "石" 为载体，用冷硬质感与锐利生机的反差，诠释 "文明余烬从未消散，以守护者形态蛰伏觉醒" 的核心立意。',
        tools: ['UE5', 'C4D', 'NIAGARA', 'MD', 'Blender'],
        videoUrl: '/videos/002.mp4',
        awards: [
          { title: '2025第二届·AADC北美应用艺术设计奖：金奖', image: '/images/0021.jpg' },
          { title: '2025第六届·G-CROSS跨界艺术创意奖：佳作奖', image: '/images/0022.jpg' },
        ],
      },
      {
        id: 'design-002',
        title: '《Peak》 山崖',
        category: 'UE5 LEVEL ART',
        year: '2025',
        description:
          '设计说明：本作品以 "登顶释然" 为核心情绪，围绕 "攀登 — 抵达" 的叙事线展开：首帧聚焦攀登者手部抓握岩石的特写，粗糙石质、苔藓纹理呼应 UE 写实材质表现，背景虚化的山路暗示前行的崎岖；尾帧切换为山顶俯瞰视角，开阔的天际线、浮动的流云与远方层峦，搭配轻快背景音乐，释放 "突破阻碍后的松弛感"。动画通过镜头从 "聚焦局部" 到 "全景舒展" 的递进，用明亮的自然光效、通透的空气质感，弱化攀登的艰辛，强化 "向山而行、终抵辽阔" 的治愈感，诠释 "山崖不仅是目的地，更是自我突破的见证" 的核心立意。',
        tools: ['UE5', 'C4D', 'NIAGARA'],
        videoUrl: '/videos/001.mp4',
        awards: [{ title: '2025第四届HKDADC：一等奖', image: '' }],
      },
      {
        id: 'design-003',
        title: '《Blade Runner》 银翼杀手',
        category: 'UE5 LEVEL ART',
        year: '2025',
        description:
          '设计说明：本作品以轻快化的赛博朋克都市为核心，命名呼应经典 IP 却重构氛围：用 UE 搭建雨夜摩天楼群，霓虹广告（发光猫、悬浮水母等）糅合科技冷硬与市井奇幻，车流光轨强化都市动感；轻快 BGM 中和赛博场景的疏离压抑，让冰冷钢筋间漾起轻盈律动。作品以 "霓虹里的松弛" 为核心，打破赛博朋克的惯常沉重，展现都市冰冷外壳下，藏在光怪陆离里的鲜活松弛感。',
        tools: ['UE5', 'C4D', 'NIAGARA'],
        videoUrl: '/videos/003.mp4',
      },
      {
        id: 'design-004',
        title: 'Tajima Cutter 美工刀',
        category: 'Hard Surface',
        year: '2025',
        description: 'PBR 美工刀，全套贴图制作',
        tools: ['Blender', 'ZBrush', 'Marmoset Toolbag', 'Substance 3D Painter'],
        modelUrl:
          'https://sketchfab.com/models/c58dcb7624b341bb8d335f33ecd722f0/embed?autostart=1&ui_controls=1&ui_infos=0&ui_inspector=0&ui_stop=0&ui_watermark=0&ui_watermark_link=0',
        textureMaps: [
          { name: 'Base Color', src: '/textures/T_TAJIMA_BC.png' },
          { name: 'Metallic', src: '/textures/T_TAJIMA_MT.png' },
          { name: 'Normal Map', src: '/textures/T_TAJIMA_N.png' },
          { name: 'Roughness', src: '/textures/T_TAJIMA_R.png' },
        ],
      },
      {
        id: 'design-005',
        title: 'Mech Prototype 机械原型',
        category: 'Hard Surface',
        year: '2025',
        description: '白模 多足机器人',
        tools: ['Blender', 'C4D'],
        modelUrl:
          'https://sketchfab.com/models/a5407920f5f24dcea82311788aa87765/embed?autostart=1&ui_controls=1&ui_infos=0&ui_inspector=0&ui_stop=0&ui_watermark=0&ui_watermark_link=0',
      },
      {
        id: 'design-006',
        title: '《风格化柠檬》',
        category: 'STYLIZED',
        year: '2025',
        description: '风格化着色器',
        tools: ['Blender', 'PS'],
        videoUrl: '/videos/blender1.mp4',
        stylizedImage: { name: '风格化着色器', src: '/images/22.png' },
      },
    ],
  },
  {
    id: 'work-game',
    index: '02',
    title: 'GAME',
    subtitle: '游戏开发',
    projects: [
      {
        id: 'game-001',
        title: 'C++ 游戏',
        category: 'C++ / Game Dev',
        year: '2025',
        wide: true,
        description: '基于 C++ 开发的游戏项目，点击封面跳转 B站 查看演示视频。',
        tools: ['C++'],
        bilibiliUrl: 'https://space.bilibili.com/',
        coverImage: '',
      },
      {
        id: 'game-002',
        title: '《IK 重定向》',
        category: 'UE5 Blueprint',
        year: '2025',
        description: '骨骼 IK重定向',
        tools: ['UE5', 'Blender', 'mixamo'],
        videoUrl: '/videos/UE1.mp4',
      },
      {
        id: 'game-003',
        title: '《迭代缩小》',
        category: 'UE5 Blueprint',
        year: '2025',
        description: '蓝图交互',
        tools: ['UE5', 'Blender'],
        videoUrl: '/videos/UE2.mp4',
      },
      {
        id: 'game-004',
        title: '《跟随指针》',
        category: 'UE5 Blueprint',
        year: '2025',
        description: '蓝图交互',
        tools: ['UE5', 'Blender'],
        videoUrl: '/videos/UE3.mp4',
      },
    ],
  },
  {
    id: 'work-code',
    index: '03',
    title: 'CODE',
    subtitle: '前端开发',
    projects: [
      { id: 'frontend-001', title: '前端项目 001', category: 'Frontend', year: '2025', description: '陆续填入', tools: [] },
      { id: 'frontend-002', title: '前端项目 002', category: 'Frontend', year: '2025', description: '陆续填入', tools: [] },
      { id: 'frontend-003', title: '前端项目 003', category: 'Frontend', year: '2025', description: '陆续填入', tools: [] },
      { id: 'frontend-004', title: '前端项目 004', category: 'Frontend', year: '2025', description: '陆续填入', tools: [] },
      { id: 'frontend-005', title: '前端项目 005', category: 'Frontend', year: '2025', description: '陆续填入', tools: [] },
      { id: 'frontend-006', title: '前端项目 006', category: 'Frontend', year: '2025', description: '陆续填入', tools: [] },
      { id: 'frontend-007', title: '前端项目 007', category: 'Frontend', year: '2025', description: '陆续填入', tools: [] },
      { id: 'frontend-008', title: '前端项目 008', category: 'Frontend', year: '2025', description: '陆续填入', tools: [] },
      { id: 'frontend-009', title: '前端项目 009', category: 'Frontend', year: '2025', description: '陆续填入', tools: [] },
      { id: 'frontend-010', title: '前端项目 010', category: 'Frontend', year: '2025', description: '陆续填入', tools: [] },
    ],
  },
];

// ─── ProjectCard ────────────────────────────────────────────────────────────

function ProjectCard({
  project,
  onProjectClick,
}: {
  project: Project;
  onProjectClick?: (projectId: string) => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);
  const { open: openLightbox } = useLightbox();

  // 视频卡片：hover 播放、leave 暂停归零
  const handleMediaEnter = () => {
    setIsHovered(true);
    const v = videoRef.current;
    if (v) v.play().catch(() => {});
  };
  const handleMediaLeave = () => {
    setIsHovered(false);
    const v = videoRef.current;
    if (v) {
      v.pause();
      v.currentTime = 0.1;
    }
  };
  // 视频元素 metadata 加载后定位到 0.1s 作为"封面"
  const handleVideoMeta = () => {
    const v = videoRef.current;
    if (v && v.paused) v.currentTime = 0.1;
  };

  // 视频卡片点击：优先 bilibili 嵌入，fallback 用本地视频 URL 作为 iframe src（浏览器原生播放）
  const handleMediaClick = () => {
    if (project.bilibiliEmbedUrl) {
      openLightbox({ url: project.bilibiliEmbedUrl, title: project.title, id: project.id });
    } else if (project.videoUrl) {
      openLightbox({ url: project.videoUrl, title: project.title, id: project.id });
    }
  };

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    gsap.set(card, { y: 50, opacity: 0 });

    gsap.to(card, {
      y: 0,
      opacity: 1,
      duration: 0.6,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === card) {
          trigger.kill();
        }
      });
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isInteracting) {
        setIsInteracting(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isInteracting]);

  const mediaAspect = 'aspect-[16/9]';

  return (
    <div
      ref={cardRef}
      className={`group ${project.wide ? 'col-span-1 md:col-span-2' : 'col-span-1'}`}
      id={project.id}
    >
      <div className="flex flex-col gap-6 py-10 border-b border-[#8A8A85]/20 relative">
        {/* 右下角橙色收尾 */}
        <div className="absolute bottom-0 right-0 w-16 h-16 pointer-events-none">
          <div className="absolute bottom-0 right-0 w-full h-[2px] bg-[#FF3D00]" />
          <div className="absolute bottom-0 right-0 w-[2px] h-full bg-[#FF3D00]" />
        </div>

        {/* Project ID badge */}
        <div
          className="h-6 px-3 py-1 bg-[#FF3D00] text-white text-[10px] font-mono tracking-wider flex items-center w-fit cursor-pointer hover:bg-[#FF3D00]/80 transition-colors"
          onClick={() => onProjectClick && onProjectClick(project.id)}
        >
          <TextScrambleWithHover duration={0.5} speed={0.03} trigger={true}>
            {project.id.split('-').pop()?.toUpperCase() || project.id.toUpperCase()}
          </TextScrambleWithHover>
        </div>

        {/* Media container */}
        <div
          className={`w-full bg-[#1A1A1A]/5 border border-[#8A8A85]/20 relative overflow-hidden ${mediaAspect}
                      ${project.videoUrl ? 'cursor-pointer' : ''}`}
          onMouseEnter={project.videoUrl ? handleMediaEnter : () => setIsHovered(true)}
          onMouseLeave={project.videoUrl ? handleMediaLeave : () => setIsHovered(false)}
          onClick={project.videoUrl ? handleMediaClick : undefined}
          data-cursor={project.videoUrl ? 'view' : undefined}
        >
          {project.bilibiliUrl ? (
            /* C++ 游戏卡：B站封面 + 外链跳转 */
            <a
              href={project.bilibiliUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-0 flex items-center justify-center group/bili"
            >
              {project.coverImage ? (
                <img
                  src={project.coverImage}
                  alt={project.title}
                  className="w-full h-full object-cover opacity-80 group-hover/bili:opacity-100 transition-opacity"
                />
              ) : (
                <div className="absolute inset-0 bg-[#1A1A1A]/10" />
              )}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/bili:opacity-100 transition-opacity duration-300">
                <span className="px-4 py-2 bg-[#FF3D00] text-white text-[11px] font-mono tracking-wider">
                  BILIBILI ↗
                </span>
              </div>
              <div className="absolute top-4 left-4 z-10">
                <span className="px-3 py-1 bg-[#FF3D00] text-white text-[10px] font-mono tracking-wider">
                  BILIBILI
                </span>
              </div>
            </a>
          ) : project.videoUrl ? (
            /* 视频卡：第一帧作为封面 + hover 播放预览 + 点击 lightbox */
            <>
              {/* 静态封面（如有） */}
              {project.coverImage && (
                <img
                  src={project.coverImage}
                  alt={project.title}
                  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0"
                />
              )}
              {/* video 元素：paused 时显示第一帧，hover 时 play */}
              <video
                ref={videoRef}
                src={project.videoUrl}
                muted
                loop
                playsInline
                preload="metadata"
                onLoadedMetadata={handleVideoMeta}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300
                            ${project.coverImage ? 'opacity-0 group-hover:opacity-100' : ''}`}
              />
              {/* 播放图标 — 提示这是可播放的视频 */}
              <div
                className={`absolute top-4 left-4 z-10 px-3 py-1 bg-[#FF3D00] text-white text-[10px] font-mono tracking-wider
                            transition-opacity duration-300 ${isHovered ? 'opacity-0' : 'opacity-100'}`}
              >
                ▶ VIDEO
              </div>
            </>
          ) : project.modelUrl ? (
            <iframe
              title={project.title}
              src={project.modelUrl}
              className="w-full h-full border-0"
              allow="autoplay; fullscreen; xr-spatial-tracking"
              allowFullScreen
              scrolling="no"
              style={{ pointerEvents: isInteracting ? 'auto' : 'none' }}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="section-label text-[#8A8A85]/40">
                {project.id.split('-').pop()}
              </span>
            </div>
          )}

          {/* 3D model 点击交互遮罩 */}
          {!isInteracting && project.modelUrl && (
            <div
              className="absolute inset-0 bg-transparent z-20 cursor-pointer"
              onClick={() => setIsInteracting(true)}
            />
          )}

          {/* Hover 角标 */}
          <div className={`absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-[#FF3D00] z-30 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
          <div className={`absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-[#FF3D00] z-30 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />

          {/* 3D Model badge */}
          {project.modelUrl && (
            <div className="absolute top-4 left-4 z-30 flex items-center gap-2">
              <span className="px-3 py-1 bg-[#FF3D00] text-white text-[10px] font-mono tracking-wider">
                <TextScrambleWithHover duration={0.5} speed={0.03} trigger={true}>
                  3D MODEL
                </TextScrambleWithHover>
              </span>
              <span className="px-2 py-1 bg-[#1A1A1A]/80 text-white/80 text-[9px] font-mono">
                鼠标点击交互，esc退出交互
              </span>
            </div>
          )}
        </div>

        {/* Project info + extras */}
        <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-2">
              <span className="work-index text-[#8A8A85]">
                <TextScrambleWithHover duration={0.5} speed={0.03} trigger={true}>
                  {project.category}
                </TextScrambleWithHover>
              </span>
              <span className="w-4 h-px bg-[#8A8A85]/30" />
              <span className="work-index text-[#8A8A85]/50">
                <TextScrambleWithHover duration={0.5} speed={0.03} trigger={true}>
                  {project.year}
                </TextScrambleWithHover>
              </span>
            </div>

            <h4 className="text-xl md:text-2xl font-medium text-[#1A1A1A] mb-3 group-hover:text-[#FF3D00] transition-colors">
              <TextScrambleWithHover duration={0.5} speed={0.03} trigger={true}>
                {project.title}
              </TextScrambleWithHover>
            </h4>

            {project.tools.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tools.map((tool) => (
                  <span
                    key={tool}
                    className="text-[10px] font-mono px-3 py-1 border border-[#FF3D00] text-[#FF3D00] hover:border-[#8A8A85]/30 hover:text-[#8A8A85] transition-all cursor-default"
                  >
                    <TextScrambleWithHover duration={0.5} speed={0.03} trigger={true}>
                      {tool}
                    </TextScrambleWithHover>
                  </span>
                ))}
              </div>
            )}

            <p className="body-mono text-[#8A8A85] leading-relaxed">
              <TextScrambleWithHover duration={0.5} speed={0.03} trigger={true}>
                {project.description}
              </TextScrambleWithHover>
            </p>

            {/* Awards */}
            {project.awards && project.awards.length > 0 && (
              <div className="flex flex-col gap-3 mt-4">
                <p className="section-label text-[10px]">获奖：</p>
                <div className="flex flex-col gap-3">
                  {project.awards.map((award, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      {award.image && (
                        <img
                          src={award.image}
                          alt={award.title}
                          className="w-12 h-12 object-cover border border-[#8A8A85]/20 cursor-pointer hover:border-[#FF3D00] transition-colors"
                          onClick={() => setEnlargedImage(award.image)}
                        />
                      )}
                      <span className="body-mono text-[10px] text-[#8A8A85]">
                        <TextScrambleWithHover duration={0.5} speed={0.03} trigger={true}>
                          {award.title}
                        </TextScrambleWithHover>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 图片放大弹窗 */}
            {enlargedImage && (
              <div
                className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center cursor-pointer"
                onClick={() => setEnlargedImage(null)}
              >
                <img
                  src={enlargedImage}
                  alt="Award"
                  className="max-w-[90vw] max-h-[90vh] object-contain"
                  onClick={(e) => e.stopPropagation()}
                />
                <button
                  className="absolute top-4 right-4 text-white text-2xl hover:text-[#FF3D00] transition-colors"
                  onClick={() => setEnlargedImage(null)}
                >
                  ×
                </button>
              </div>
            )}
          </div>

          {/* Texture maps / stylized image */}
          {(project.textureMaps || project.stylizedImage) && (
            <div className="xl:w-auto xl:flex-shrink-0">
              {project.textureMaps && (
                <>
                  <p className="section-label mb-3 text-[10px]">Texture Maps</p>
                  <div className="flex flex-wrap xl:flex-nowrap gap-2">
                    {project.textureMaps.map((map, mapIndex) => (
                      <div
                        key={mapIndex}
                        className="relative w-24 h-24 xl:w-20 xl:h-20 bg-[#1A1A1A]/5 border border-[#8A8A85]/20 overflow-hidden group/map flex-shrink-0"
                      >
                        <img
                          src={map.src}
                          alt={map.name}
                          className="w-full h-full object-cover opacity-80 group-hover/map:opacity-100 transition-opacity"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                        <div className="absolute bottom-0 left-0 right-0 px-1 py-0.5 bg-[#1A1A1A]/80">
                          <span className="text-[8px] text-white/90 font-mono">{map.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {project.stylizedImage && (
                <div className={project.textureMaps ? 'mt-6' : ''}>
                  <p className="section-label mb-3 text-[10px]">{project.stylizedImage.name}</p>
                  <div
                    className="relative w-40 h-40 xl:w-48 xl:h-48 bg-[#1A1A1A]/5 border border-[#8A8A85]/20 overflow-hidden cursor-pointer hover:border-[#FF3D00] transition-colors group/stylized"
                    onClick={() => setEnlargedImage(project.stylizedImage?.src || null)}
                  >
                    <img
                      src={project.stylizedImage.src}
                      alt={project.stylizedImage.name}
                      className="w-full h-full object-cover opacity-80 group-hover/stylized:opacity-100 transition-opacity"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── WorkCategorySection ─────────────────────────────────────────────────────

function WorkCategorySection({
  work,
  onProjectClick,
}: {
  work: WorkDetail;
  onProjectClick?: (projectId: string) => void;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const header = headerRef.current;
    if (!section || !header) return;

    const indexEl = header.querySelector('.work-index-large');
    const titleEl = header.querySelector('.work-title-large');
    const subtitleEl = header.querySelector('.work-subtitle');

    gsap.set([indexEl, titleEl, subtitleEl], { y: 60, opacity: 0 });

    ScrollTrigger.create({
      trigger: section,
      start: 'top 70%',
      end: 'bottom 30%',
      onEnter: () => setIsInView(true),
      onLeave: () => setIsInView(false),
      onEnterBack: () => setIsInView(true),
      onLeaveBack: () => setIsInView(false),
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 70%',
        toggleActions: 'play none none reverse',
      },
    });

    tl.to(indexEl, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' })
      .to(titleEl, { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }, '-=0.3')
      .to(subtitleEl, { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }, '-=0.2');

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id={work.id}
      className="section-full relative flex flex-col justify-center py-24 px-6 md:px-12 lg:px-24"
      style={{ zIndex: 10 }}
    >
      <div className="max-w-[1600px] mx-auto w-full">
      {/* Section Header */}
      <div ref={headerRef} className="mb-12 md:mb-16">
        <div className="flex items-baseline gap-4 md:gap-6 mb-4">
          <span className="work-index-large work-index text-2xl md:text-3xl text-[#FF3D00] flex-shrink-0">
            <TextScrambleWithHover duration={0.5} speed={0.03} trigger={isInView}>
              {work.index}
            </TextScrambleWithHover>
          </span>
          <h2 className="hidden md:block work-title-large display-giant text-4xl md:text-6xl lg:text-7xl">
            <TextScrambleWithHover duration={1.0} speed={0.03} trigger={isInView}>
              {work.title}
            </TextScrambleWithHover>
          </h2>
          <h2 className="md:hidden work-title-large display-giant text-3xl sm:text-4xl leading-tight">
            {work.title.split(' ').map((word, i) => (
              <span key={i} className="block">
                <TextScrambleWithHover duration={0.5} speed={0.03} trigger={isInView}>
                  {word}
                </TextScrambleWithHover>
              </span>
            ))}
          </h2>
        </div>
        <p className="work-subtitle body-mono text-[#8A8A85]/70">
          <TextScrambleWithHover duration={0.5} speed={0.03} trigger={isInView}>
            {work.subtitle}
          </TextScrambleWithHover>
        </p>
      </div>

      {/* Projects grid — Code 区使用新组件，其他用 ProjectCard */}
      {work.id === 'work-code' ? (
        <CodeWorksGrid />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {work.projects.map((project) => (
            <ProjectCard key={project.id} project={project} onProjectClick={onProjectClick} />
          ))}
        </div>
      )}

      {/* Footer row */}
      <div className="mt-12 pt-8 border-t border-[#8A8A85]/20 flex justify-between items-center">
        <span className="section-label">
          <TextScrambleWithHover duration={0.5} speed={0.03} trigger={isInView}>
            {(work.id === 'work-code' ? codeProjects.length : work.projects.length) + ' Projects'}
          </TextScrambleWithHover>
        </span>
      </div>
      </div>
    </section>
  );
}

// ─── Filter Bar ──────────────────────────────────────────────────────────────

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'design', label: 'Design' },
  { key: 'game', label: 'Game' },
  { key: 'code', label: 'Code' },
];

function FilterBar({
  active,
  onChange,
}: {
  active: FilterKey;
  onChange: (key: FilterKey) => void;
}) {
  // 项目数量：从 workDetails 派生，Code 区使用 codeProjects
  const counts: Record<FilterKey, number> = {
    design: workDetails.find((w) => w.id === 'work-design')?.projects.length ?? 0,
    game: workDetails.find((w) => w.id === 'work-game')?.projects.length ?? 0,
    code: codeProjects.length,
    all: 0,
  };
  counts.all = counts.design + counts.game + counts.code;

  return (
    <div className="px-4 sm:px-6 md:px-12 lg:px-24 py-6 md:py-8 border-b border-[#8A8A85]/20">
      <div className="max-w-[1600px] mx-auto flex items-center gap-4 sm:gap-6 flex-wrap">
      {FILTERS.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`relative body-mono text-xs tracking-widest uppercase transition-colors pb-1 ${
            active === key ? 'text-[#FF3D00]' : 'text-[#8A8A85] hover:text-[#1A1A1A]'
          }`}
        >
          {label}
          <span className="ml-1.5 text-[10px] opacity-60">({counts[key]})</span>
          {active === key && (
            <span className="absolute left-0 bottom-0 w-full h-[2px] bg-[#FF3D00]" />
          )}
        </button>
      ))}
      </div>
    </div>
  );
}

// ─── WorkDetailSection (root export) ────────────────────────────────────────

export default function WorkDetailSection() {
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');

  const handleProjectClick = (projectId: string) => {
    const element = document.getElementById(projectId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isVisible = (work: WorkDetail): boolean => {
    if (activeFilter === 'all') return true;
    return work.id === `work-${activeFilter}`;
  };

  return (
    <>
      <FilterBar active={activeFilter} onChange={setActiveFilter} />
      {workDetails.map((work) => (
        <div key={work.id} className={isVisible(work) ? '' : 'hidden'}>
          <WorkCategorySection work={work} onProjectClick={handleProjectClick} />
        </div>
      ))}
    </>
  );
}
