import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { CodeProject } from '@/data/codeProjects';

interface LightboxContextValue {
  activeProject: CodeProject | null;
  open: (project: CodeProject) => void;
  close: () => void;
}

const LightboxContext = createContext<LightboxContextValue | null>(null);

export function LightboxProvider({ children }: { children: ReactNode }) {
  const [activeProject, setActiveProject] = useState<CodeProject | null>(null);

  const open = useCallback((project: CodeProject) => {
    setActiveProject(project);
    document.body.style.overflow = 'hidden';
  }, []);

  const close = useCallback(() => {
    setActiveProject(null);
    document.body.style.overflow = '';
  }, []);

  return (
    <LightboxContext.Provider value={{ activeProject, open, close }}>
      {children}
    </LightboxContext.Provider>
  );
}

export function useLightbox() {
  const ctx = useContext(LightboxContext);
  if (!ctx) throw new Error('useLightbox must be used within LightboxProvider');
  return ctx;
}
