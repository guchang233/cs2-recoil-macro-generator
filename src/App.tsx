import { useState } from 'react';
import type { WeaponRecoilData } from './types/weapon';
import weapons from './data/weapons.json';
import { generateRazerMacro } from './utils/razerMacro';
import { generateLogitechMacro } from './utils/logitechMacro';
import { downloadFile } from './utils/file';
import { calculateRecoilPattern } from './utils/recoil';
import { RecoilPreview } from './components/RecoilPreview';

const inputClass =
  'w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-slate-100 focus:outline-none focus:border-blue-500';

function App() {
  const [selectedWeaponId, setSelectedWeaponId] = useState<string>(
    weapons[0]?.id ?? ''
  );
  const [sensitivity, setSensitivity] = useState<number>(2.0);
  const [intensity, setIntensity] = useState<number>(100);

  const selectedWeapon = (weapons as WeaponRecoilData[]).find(
    (w) => w.id === selectedWeaponId
  );

  const handleExportRazer = () => {
    if (!selectedWeapon) return;
    const name = `${selectedWeapon.name}_sens${sensitivity}`;
    downloadFile(
      generateRazerMacro(selectedWeapon, sensitivity, intensity, name),
      `${name}.xml`,
      'application/xml'
    );
  };

  const handleExportLogitech = () => {
    if (!selectedWeapon) return;
    const name = `${selectedWeapon.name}_sens${sensitivity}`;
    downloadFile(
      generateLogitechMacro(selectedWeapon, sensitivity, intensity, { macroName: name }),
      `${name}.lua`,
      'text/plain'
    );
  };

  const calculatedPattern = selectedWeapon
    ? calculateRecoilPattern(selectedWeapon, sensitivity, intensity)
    : [];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6">
      <div className="max-w-md mx-auto space-y-4">
        <h1 className="text-xl font-medium text-center">CS2 压枪宏生成器</h1>

        <label className="block space-y-1">
          <span className="text-sm text-slate-400">选择枪械</span>
          <select
            value={selectedWeaponId}
            onChange={(e) => setSelectedWeaponId(e.target.value)}
            className={inputClass}
          >
            {weapons.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block space-y-1">
          <span className="text-sm text-slate-400">游戏内灵敏度</span>
          <input
            type="number"
            step="0.1"
            min="0.1"
            max="10"
            value={sensitivity}
            onChange={(e) => setSensitivity(parseFloat(e.target.value) || 0)}
            className={inputClass}
          />
        </label>

        <label className="block space-y-1">
          <span className="text-sm text-slate-400">压枪强度 (%)</span>
          <input
            type="number"
            step="5"
            min="0"
            max="200"
            value={intensity}
            onChange={(e) => setIntensity(parseInt(e.target.value) || 0)}
            className={inputClass}
          />
        </label>

        <div className="space-y-2">
          <span className="text-sm text-slate-400">轨迹预览</span>
          <RecoilPreview
            pattern={calculatedPattern}
            weaponName={selectedWeapon?.name || ''}
          />
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={handleExportRazer}
            disabled={!selectedWeapon}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white rounded transition-colors"
          >
            导出雷蛇宏
          </button>
          <button
            onClick={handleExportLogitech}
            disabled={!selectedWeapon}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white rounded transition-colors"
          >
            导出罗技宏
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
