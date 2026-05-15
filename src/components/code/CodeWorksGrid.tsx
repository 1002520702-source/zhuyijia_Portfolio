import { codeProjects } from '@/data/codeProjects';
import { CodeProjectCard } from './CodeProjectCard';

export function CodeWorksGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
      {codeProjects.map((project) => (
        <CodeProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
