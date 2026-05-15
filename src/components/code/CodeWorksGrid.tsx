import { webProjects, aiProjects } from '@/data/codeProjects';
import { CodeProjectCard } from './CodeProjectCard';

/**
 * Code 区两组卡片：
 * - 上半：网页设计 10 个（001/005 wide，其他流式两列）
 * - 下半：AI 交互界面（独立小标题 + 单独 grid）
 */
export function CodeWorksGrid() {
  return (
    <div className="flex flex-col gap-16 md:gap-20">
      {/* —— 第一组：网页设计 —— */}
      <div>
        <div className="flex items-baseline justify-between mb-6 pb-3 border-b border-[#8A8A85]/20">
          <span className="section-label text-[#8A8A85]">
            01 / Web Design ·{' '}
            <span className="text-[#8A8A85]/60">网页设计</span>
          </span>
          <span className="section-label text-[#8A8A85]/50">
            {webProjects.length} Projects
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
          {webProjects.map((p) => (
            <CodeProjectCard key={p.id} project={p} />
          ))}
        </div>
      </div>

      {/* —— 第二组：AI 交互界面 —— */}
      <div>
        <div className="flex items-baseline justify-between mb-6 pb-3 border-b border-[#8A8A85]/20">
          <span className="section-label text-[#8A8A85]">
            02 / AI Interface ·{' '}
            <span className="text-[#8A8A85]/60">AI 交互</span>
          </span>
          <span className="section-label text-[#8A8A85]/50">
            {aiProjects.length} Project{aiProjects.length > 1 ? 's' : ''}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
          {aiProjects.map((p) => (
            <CodeProjectCard key={p.id} project={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
