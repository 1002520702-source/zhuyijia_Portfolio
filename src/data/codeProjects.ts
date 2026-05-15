// Code 区项目数据
// 分两组渲染：
//   webProjects   — 网页设计 10 个（001 + 005 wide，其他两两一组）
//   aiProjects    — AI 交互界面（独立分组，目前为占位，等真实内容补入）

export interface CodeProject {
  id: string;
  title: string;
  year: string;
  tags: string[];
  cover?: string;
  hoverVideo?: string;
  iframeUrl: string;
  wide?: boolean;
}

export const webProjects: CodeProject[] = [
  {
    id: 'frontend-001',
    title: 'Synthwave OS',
    year: '2026',
    tags: ['HTML', 'CSS', 'JS', 'GSAP'],
    cover: '/covers/frontend-001.webp',
    hoverVideo: '/previews/frontend-001.mp4',
    iframeUrl: '/embed/frontend-001/index.html',
    wide: true,
  },
  {
    id: 'frontend-002',
    title: 'Waitlist — Join Now',
    year: '2026',
    tags: ['HTML', 'CSS', 'JS'],
    cover: '/covers/frontend-002.webp',
    hoverVideo: '/previews/frontend-002.mp4',
    iframeUrl: '/embed/frontend-002/index.html',
  },
  {
    id: 'frontend-003',
    title: 'Synth Dashboard — Memphis Console',
    year: '2026',
    tags: ['HTML', 'CSS', 'JS'],
    cover: '/covers/frontend-003.webp',
    hoverVideo: '/previews/frontend-003.mp4',
    iframeUrl: '/embed/frontend-003/index.html',
  },
  {
    id: 'frontend-004',
    title: 'Outsource Consultants',
    year: '2026',
    tags: ['HTML', 'CSS', 'JS'],
    cover: '/covers/frontend-004.webp',
    hoverVideo: '/previews/frontend-004.mp4',
    iframeUrl: '/embed/frontend-004/index.html',
  },
  {
    id: 'frontend-005',
    title: 'Exat — Hot Type Replica',
    year: '2026',
    tags: ['HTML', 'CSS', 'JS'],
    cover: '/covers/frontend-005.webp',
    hoverVideo: '/previews/frontend-005.mp4',
    iframeUrl: '/embed/frontend-005/index.html',
  },
  {
    id: 'frontend-006',
    title: 'Exat Typeface I',
    year: '2026',
    tags: ['HTML', 'CSS', 'JS'],
    cover: '/covers/frontend-006.webp',
    hoverVideo: '/previews/frontend-006.mp4',
    iframeUrl: '/embed/frontend-006/index.html',
    wide: true,
  },
  {
    id: 'frontend-007',
    title: 'Exat Typeface II',
    year: '2026',
    tags: ['HTML', 'CSS', 'JS'],
    cover: '/covers/frontend-007.webp',
    hoverVideo: '/previews/frontend-007.mp4',
    iframeUrl: '/embed/frontend-007/index.html',
  },
  {
    id: 'frontend-008',
    title: 'Dev.Engineer — Frontend',
    year: '2026',
    tags: ['HTML', 'CSS', 'JS'],
    cover: '/covers/frontend-008.webp',
    hoverVideo: '/previews/frontend-008.mp4',
    iframeUrl: '/embed/frontend-008/index.html',
  },
  {
    id: 'frontend-009',
    title: 'Nexus Analytics — 数据可视化',
    year: '2026',
    tags: ['HTML', 'CSS', 'JS', 'D3'],
    cover: '/covers/frontend-009.webp',
    hoverVideo: '/previews/frontend-009.mp4',
    iframeUrl: '/embed/frontend-009/index.html',
  },
  {
    id: 'frontend-010',
    title: 'Yijia.Zhu — Portfolio',
    year: '2026',
    tags: ['HTML', 'CSS', 'JS'],
    cover: '/covers/frontend-010.webp',
    hoverVideo: '/previews/frontend-010.mp4',
    iframeUrl: '/embed/frontend-010/index.html',
  },
];

// AI 组：目前 1 个占位项目，等真实素材到位后替换/扩展
export const aiProjects: CodeProject[] = [
  {
    id: 'ai-001',
    title: 'AI 交互界面',
    year: '2026',
    tags: ['AI', 'UX', 'Coming Soon'],
    // 暂无 cover/hoverVideo，自动 fallback 为深色占位
    iframeUrl: '/embed/ai-coming-soon/index.html',
    wide: true,
  },
];

// 兼容：旧的统一 export
export const codeProjects = [...webProjects, ...aiProjects];
