import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';
interface ThemeState { theme: ThemeMode; setTheme: (theme: ThemeMode) => void; toggleTheme: () => void; }
const ThemeContext = createContext<ThemeState | undefined>(undefined);
function apply(theme: ThemeMode) {
  const dark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.classList.toggle('dark', dark);
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
}
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>(() => (localStorage.getItem('height-ai-theme') as ThemeMode) || 'light');
  const setTheme = (next: ThemeMode) => { setThemeState(next); localStorage.setItem('height-ai-theme', next); apply(next); };
  useEffect(() => { apply(theme); const m = window.matchMedia('(prefers-color-scheme: dark)'); const fn=()=>theme==='system'&&apply(theme); m.addEventListener?.('change',fn); return ()=>m.removeEventListener?.('change',fn); }, [theme]);
  const value=useMemo(()=>({theme,setTheme,toggleTheme:()=>setTheme(theme==='dark'?'light':'dark')}),[theme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
export function useTheme(){ const v=useContext(ThemeContext); if(!v) throw new Error('useTheme must be used within ThemeProvider'); return v; }
