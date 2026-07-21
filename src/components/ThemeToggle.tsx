import { Sun, Moon } from 'lucide-react';
import type { Theme } from '../hooks/useTheme';

interface ThemeToggleProps {
  theme: Theme;
  onToggle: () => void;
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  return (
    <button
      onClick={onToggle}
      aria-label="切换主题"
      className="btn-capsule glass text-foreground h-10 w-10 p-0"
    >
      <span className="transition-transform duration-200 inline-flex">
        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
      </span>
    </button>
  );
}
