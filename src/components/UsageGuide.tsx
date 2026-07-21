import { Download, Mouse, Play } from 'lucide-react';
import { Card } from './ui/Card';

const STEPS = [
  {
    icon: Download,
    title: '下载宏文件',
    desc: '在上方选择枪械与参数后，点击导出按钮，下载对应格式的雷蛇 .xml 或罗技 .lua 文件。',
  },
  {
    icon: Mouse,
    title: '导入到鼠标驱动',
    desc: '雷蛇：打开 Synapse → 进入鼠标「宏」页面 → 导入 .xml。罗技：打开 G HUB → 设备「脚本」→ 粘贴 .lua 内容并保存。',
  },
  {
    icon: Play,
    title: '游戏内启用',
    desc: '在 CS2 中按住鼠标左键开火，宏将自动按预览轨迹下压补偿后坐力。如效果偏差，回到工具调整强度或灵敏度。',
  },
];

export function UsageGuide() {
  return (
    <section className="max-w-3xl mx-auto px-6 pb-20">
      <h2 className="text-2xl font-semibold tracking-tight mb-6">使用说明</h2>
      <div className="grid gap-4">
        {STEPS.map((step, i) => {
          const Icon = step.icon;
          return (
            <Card key={i} className="p-6 flex items-start gap-4">
              <div className="flex-shrink-0 h-11 w-11 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center">
                <Icon size={20} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-muted-foreground">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="font-medium">{step.title}</h3>
                </div>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
