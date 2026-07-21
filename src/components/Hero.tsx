import { ArrowDown } from 'lucide-react';
import { Button } from './ui/Button';

export function Hero() {
  const scrollToTool = () => {
    document.getElementById('tool')?.scrollIntoView({ behavior: 'smooth' });
  };
  return (
    <section className="relative max-w-3xl mx-auto text-center py-20 px-6">
      {/* iOS 风格背景光斑，衬托毛玻璃 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute left-1/2 top-6 h-40 w-72 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(0,122,255,0.25),transparent_70%)] blur-2xl" />
        <div className="absolute left-[20%] top-24 h-32 w-56 rounded-full bg-[radial-gradient(circle,rgba(175,82,222,0.22),transparent_70%)] blur-2xl" />
      </div>
      <h1 className="text-5xl font-bold tracking-tight text-gradient">
        可视化压枪轨迹，一键生成鼠标宏
      </h1>
      <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
        选择枪械、调整灵敏度与强度，实时预览压枪补偿轨迹，并导出雷蛇 Synapse 或罗技 G HUB 宏脚本。
      </p>
      <div className="mt-8">
        <Button size="lg" onClick={scrollToTool}>
          开始生成
          <ArrowDown size={18} />
        </Button>
      </div>
    </section>
  );
}
