import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

/**
 * 全局 Lightbox 状态
 * 任何卡片只要传 { url, title } 就能弹出 iOS 风格 iframe 窗口
 */
export interface LightboxTarget {
  url: string;
  title: string;
  id?: string;
}

interface LightboxContextValue {
  active: LightboxTarget | null;
  open: (target: LightboxTarget) => void;
  close: () => void;
}

const LightboxContext = createContext<LightboxContextValue | null>(null);

export function LightboxProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<LightboxTarget | null>(null);

  const open = useCallback((target: LightboxTarget) => {
    setActive(target);
    document.body.style.overflow = 'hidden';
  }, []);

  const close = useCallback(() => {
    setActive(null);
    document.body.style.overflow = '';
  }, []);

  return (
    <LightboxContext.Provider value={{ active, open, close }}>
      {children}
    </LightboxContext.Provider>
  );
}

export function useLightbox() {
  const ctx = useContext(LightboxContext);
  if (!ctx) throw new Error('useLightbox must be used within LightboxProvider');
  return ctx;
}
