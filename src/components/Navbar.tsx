import { Crosshair } from 'lucide-react';
import type { Theme } from '../hooks/useTheme';
import { ThemeToggle } from './ThemeToggle';
import { GithubIcon } from './icons/GithubIcon';

interface NavbarProps {
  theme: Theme;
  onToggleTheme: () => void;
}

export function Navbar({ theme, onToggleTheme }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Crosshair size={22} className="text-primary" />
          <span className="font-semibold tracking-tight">CS2 压枪宏生成器</span>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="https://github.com/guchang233/cs2-recoil-macro-generator"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub 仓库"
            className="btn-capsule bg-secondary text-secondary-foreground h-10 w-10 p-0"
          >
            <GithubIcon size={18} />
          </a>
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </div>
      </div>
    </header>
  );
}
