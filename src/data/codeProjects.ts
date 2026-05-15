// Code 区前端项目数据
// 目前展示 2 个主推项目。其他占位文件夹保留在 public/embed/frontend-003 ~ 010，
// 等新项目就位后再追加进这份数据，并补 cover / preview。

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

export const codeProjects: CodeProject[] = [
  {
    id: 'frontend-001',
    title: '网页设计',
    year: '2026',
    tags: ['HTML', 'CSS', 'JS', 'GSAP'],
    cover: '/covers/frontend-001.png',
    hoverVideo: '/previews/frontend-001.mp4',
    iframeUrl: '/embed/frontend-001/index.html',
    wide: true,
  },
  {
    id: 'frontend-002',
    title: 'AI 交互界面',
    year: '2026',
    tags: ['AI', 'UX'],
    cover: '/covers/frontend-002.png',
    hoverVideo: '/previews/frontend-002.mp4',
    iframeUrl: '/embed/frontend-002/index.html',
    wide: true,
  },
];
