import { useState, useEffect } from 'react';
import type { WeaponRecoilData } from './types/weapon';
import { useWeaponData } from './hooks/useWeaponData';
import { generateRazerMacro } from './utils/razerMacro';
import { generateLogitechMacro } from './utils/logitechMacro';
import { downloadFile } from './utils/file';
import { calculateRecoilPattern } from './utils/recoil';
import { RecoilPreview } from './components/RecoilPreview';

const DEFAULT_SENSITIVITY = 2.0;
const DEFAULT_INTENSITY = 100;

function App() {
  const { weapons } = useWeaponData();
  const [selectedWeaponId, setSelectedWeaponId] = useState<string>('');
  const [sensitivity, setSensitivity] = useState<number>(DEFAULT_SENSITIVITY);
  const [intensity, setIntensity] = useState<number>(DEFAULT_INTENSITY);

  useEffect(() => {
    if (weapons.length > 0 && !selectedWeaponId) {
      setSelectedWeaponId(weapons[0].id);
    }
  }, [weapons, selectedWeaponId]);

  const selectedWeapon: WeaponRecoilData | undefined = weapons.find(
    (w) => w.id === selectedWeaponId
  );

  const handleExportRazer = () => {
    if (!selectedWeapon) return;
    const name = `${selectedWeapon.name}_sens${sensitivity}`;
    const xml = generateRazerMacro(selectedWeapon, sensitivity, intensity, name);
    downloadFile(xml, `${name}.xml`, 'application/xml');
  };

  const handleExportLogitech = () => {
    if (!selectedWeapon) return;
    const name = `${selectedWeapon.name}_sens${sensitivity}`;
    const lua = generateLogitechMacro(selectedWeapon, sensitivity, intensity, { macroName: name });
    downloadFile(lua, `${name}.lua`, 'text/plain');
  };

  const calculatedPattern = selectedWeapon
    ? calculateRecoilPattern(selectedWeapon, sensitivity, intensity)
    : [];

  return (
    <div className="min-h-screen bg-[#0f172a] text-[#f1f5f9] p-6">
      <div className="max-w-md mx-auto space-y-4">
        <h1 className="text-xl font-medium text-center">CS2 压枪宏生成器</h1>

        <div className="space-y-2">
          <label className="text-sm text-[#94a3b8]">选择枪械</label>
          <select
            value={selectedWeaponId}
            onChange={(e) => setSelectedWeaponId(e.target.value)}
            className="w-full px-3 py-2 bg-[#1e293b] border border-[#334155] rounded text-[#f1f5f9] focus:outline-none focus:border-[#3b82f6]"
          >
            {weapons.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-[#94a3b8]">游戏内灵敏度</label>
          <input
            type="number"
            step="0.1"
            min="0.1"
            max="10"
            value={sensitivity}
            onChange={(e) => setSensitivity(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 bg-[#1e293b] border border-[#334155] rounded text-[#f1f5f9] focus:outline-none focus:border-[#3b82f6]"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-[#94a3b8]">压枪强度 (%)</label>
          <input
            type="number"
            step="5"
            min="0"
            max="200"
            value={intensity}
            onChange={(e) => setIntensity(parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 bg-[#1e293b] border border-[#334155] rounded text-[#f1f5f9] focus:outline-none focus:border-[#3b82f6]"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-[#94a3b8]">轨迹预览</label>
          <RecoilPreview
            pattern={calculatedPattern}
            weaponName={selectedWeapon?.name || ''}
          />
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={handleExportRazer}
            disabled={!selectedWeapon}
            className="px-4 py-2 bg-[#10b981] hover:bg-[#059669] disabled:opacity-50 text-white rounded transition-colors"
          >
            导出雷蛇宏
          </button>
          <button
            onClick={handleExportLogitech}
            disabled={!selectedWeapon}
            className="px-4 py-2 bg-[#3b82f6] hover:bg-[#2563eb] disabled:opacity-50 text-white rounded transition-colors"
          >
            导出罗技宏
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
