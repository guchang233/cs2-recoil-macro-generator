import { GithubIcon } from './icons/GithubIcon';

export function Footer() {
  return (
    <footer className="glass-strong border-t border-border">
      <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <div>
          <p>© {new Date().getFullYear()} CS2 压枪宏生成器</p>
          <p className="mt-1">仅用于学习交流，请遵守游戏规则与相关服务条款。</p>
        </div>
        <a
          href="https://github.com/guchang233/cs2-recoil-macro-generator"
          target="_blank"
          rel="noreferrer"
          className="btn-capsule glass border border-border text-secondary-foreground h-10 px-4 text-sm"
        >
          <GithubIcon size={16} />
          GitHub
        </a>
      </div>
    </footer>
  );
}
