import { ArrowDown } from 'lucide-react';
import { Button } from './ui/Button';

export function Hero() {
  const scrollToTool = () => {
    document.getElementById('tool')?.scrollIntoView({ behavior: 'smooth' });
  };
  return (
    <section className="max-w-3xl mx-auto text-center py-20 px-6">
      <h1 className="text-5xl font-bold tracking-tight">
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
