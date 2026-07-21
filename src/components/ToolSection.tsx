import type { WeaponRecoilData, CalculatedPoint } from '../types/weapon';
import type { Theme } from '../hooks/useTheme';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Select } from './ui/Select';
import { NumberInput } from './ui/NumberInput';
import { RecoilPreview } from './RecoilPreview';

interface ToolSectionProps {
  weapons: WeaponRecoilData[];
  selectedWeaponId: string;
  onSelectWeapon: (id: string) => void;
  sensitivity: number;
  onSensitivityChange: (n: number) => void;
  intensity: number;
  onIntensityChange: (n: number) => void;
  selectedWeapon: WeaponRecoilData | undefined;
  pattern: CalculatedPoint[];
  theme: Theme;
  onExportRazer: () => void;
  onExportLogitech: () => void;
}

export function ToolSection(props: ToolSectionProps) {
  const {
    weapons,
    selectedWeaponId,
    onSelectWeapon,
    sensitivity,
    onSensitivityChange,
    intensity,
    onIntensityChange,
    selectedWeapon,
    pattern,
    theme,
    onExportRazer,
    onExportLogitech,
  } = props;

  const weaponOptions = weapons.map((w) => ({ value: w.id, label: w.name }));

  return (
    <section id="tool" className="max-w-5xl mx-auto px-6 pb-16">
      <Card className="p-6 sm:p-8">
        <h2 className="text-2xl font-semibold tracking-tight mb-6">生成配置</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 左：参数 */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">选择枪械</label>
              <Select
                value={selectedWeaponId}
                options={weaponOptions}
                onChange={onSelectWeapon}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">游戏内灵敏度</label>
                <span className="text-xs text-muted-foreground font-mono">0.1 – 10</span>
              </div>
              <NumberInput
                value={sensitivity}
                min={0.1}
                max={10}
                step={0.1}
                onChange={onSensitivityChange}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">压枪强度</label>
                <span className="text-xs text-muted-foreground font-mono">{intensity}%</span>
              </div>
              <NumberInput
                value={intensity}
                min={0}
                max={200}
                step={5}
                onChange={onIntensityChange}
              />
            </div>
          </div>

          {/* 右：预览 */}
          <div className="space-y-3">
            <div className="text-sm font-medium">轨迹预览</div>
            <RecoilPreview
              pattern={pattern}
              weaponName={selectedWeapon?.name || ''}
              theme={theme}
            />
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button variant="primary" size="md" onClick={onExportRazer} disabled={!selectedWeapon}>
            导出雷蛇宏
          </Button>
          <Button variant="secondary" size="md" onClick={onExportLogitech} disabled={!selectedWeapon}>
            导出罗技宏
          </Button>
        </div>
      </Card>
    </section>
  );
}
