import type { WeaponRecoilData, CalculatedPoint } from '../types/weapon';
import type { Theme } from '../hooks/useTheme';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
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

const inputClass =
  'w-full sm:w-48 px-3 py-2 bg-background border border-input rounded-lg text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-[box-shadow]';

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

  return (
    <section id="tool" className="max-w-5xl mx-auto px-6 pb-16">
      <Card className="p-6 sm:p-8">
        <h2 className="text-2xl font-semibold tracking-tight mb-6">生成配置</h2>

        <div className="divide-y divide-border">
          <div className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <label className="text-sm font-medium">选择枪械</label>
            <select
              value={selectedWeaponId}
              onChange={(e) => onSelectWeapon(e.target.value)}
              className={inputClass}
            >
              {weapons.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
          </div>
          <div className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <label className="text-sm font-medium">游戏内灵敏度</label>
            <input
              type="number"
              step="0.1"
              min="0.1"
              max="10"
              value={sensitivity}
              onChange={(e) => onSensitivityChange(parseFloat(e.target.value) || 0)}
              className={inputClass}
            />
          </div>
          <div className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <label className="text-sm font-medium">压枪强度 (%)</label>
            <input
              type="number"
              step="5"
              min="0"
              max="200"
              value={intensity}
              onChange={(e) => onIntensityChange(parseInt(e.target.value) || 0)}
              className={inputClass}
            />
          </div>
        </div>

        <div className="mt-8">
          <div className="text-sm font-medium mb-3">轨迹预览</div>
          <RecoilPreview
            pattern={pattern}
            weaponName={selectedWeapon?.name || ''}
            theme={theme}
          />
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button variant="success" size="md" onClick={onExportRazer} disabled={!selectedWeapon}>
            导出雷蛇宏
          </Button>
          <Button variant="primary" size="md" onClick={onExportLogitech} disabled={!selectedWeapon}>
            导出罗技宏
          </Button>
        </div>
      </Card>
    </section>
  );
}
