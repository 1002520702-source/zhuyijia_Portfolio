// Code 区前端项目数据
// 暂时使用占位素材：cover 用空字符串（会渲染深色占位 + 项目编号）
// hoverVideo 暂时复用 Design 区的视频（待真实素材替换）
// iframeUrl 暂时指向 about:blank（待真实 demo 部署）

export interface CodeProject {
  id: string;
  title: string;
  year: string;
  tags: string[];
  cover?: string;       // 静态封面图路径，可空（空时渲染深色占位）
  hoverVideo?: string;  // 悬停视频路径，可空（空时不切换）
  iframeUrl: string;    // 点击后 iframe 加载的页面，可填外链或站内路径
  wide?: boolean;       // 主推卡片，占两列
}

export const codeProjects: CodeProject[] = [
  {
    id: 'frontend-001',
    title: '前端项目 001',
    year: '2025',
    tags: ['React', 'TypeScript', 'Vite'],
    cover: '',
    hoverVideo: '/videos/blender1.mp4',
    iframeUrl: 'about:blank',
    wide: true,
  },
  {
    id: 'frontend-002',
    title: '前端项目 002',
    year: '2025',
    tags: ['React', 'Tailwind'],
    cover: '',
    hoverVideo: '/videos/UE1.mp4',
    iframeUrl: 'about:blank',
  },
  {
    id: 'frontend-003',
    title: '前端项目 003',
    year: '2025',
    tags: ['Three.js', 'R3F'],
    cover: '',
    hoverVideo: '/videos/UE2.mp4',
    iframeUrl: 'about:blank',
  },
  {
    id: 'frontend-004',
    title: '前端项目 004',
    year: '2025',
    tags: ['GSAP', 'Lenis'],
    cover: '',
    hoverVideo: '/videos/UE3.mp4',
    iframeUrl: 'about:blank',
    wide: true,
  },
  {
    id: 'frontend-005',
    title: '前端项目 005',
    year: '2025',
    tags: ['Vue', 'Nuxt'],
    cover: '',
    hoverVideo: '/videos/blender1.mp4',
    iframeUrl: 'about:blank',
  },
  {
    id: 'frontend-006',
    title: '前端项目 006',
    year: '2025',
    tags: ['Next.js', 'TS'],
    cover: '',
    hoverVideo: '/videos/UE1.mp4',
    iframeUrl: 'about:blank',
  },
  {
    id: 'frontend-007',
    title: '前端项目 007',
    year: '2025',
    tags: ['Astro', 'MDX'],
    cover: '',
    hoverVideo: '/videos/UE2.mp4',
    iframeUrl: 'about:blank',
  },
  {
    id: 'frontend-008',
    title: '前端项目 008',
    year: '2025',
    tags: ['Svelte'],
    cover: '',
    hoverVideo: '/videos/UE3.mp4',
    iframeUrl: 'about:blank',
  },
  {
    id: 'frontend-009',
    title: '前端项目 009',
    year: '2025',
    tags: ['WebGL', 'Shader'],
    cover: '',
    hoverVideo: '/videos/blender1.mp4',
    iframeUrl: 'about:blank',
  },
  {
    id: 'frontend-010',
    title: '前端项目 010',
    year: '2025',
    tags: ['Canvas API'],
    cover: '',
    hoverVideo: '/videos/UE1.mp4',
    iframeUrl: 'about:blank',
  },
];
