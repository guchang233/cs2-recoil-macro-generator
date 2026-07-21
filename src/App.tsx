import { useState, useEffect, useMemo } from 'react';
import type { WeaponRecoilData } from './types/weapon';
import { useWeaponData } from './hooks/useWeaponData';
import { useTheme } from './hooks/useTheme';
import { generateRazerMacro } from './utils/razerMacro';
import { generateLogitechMacro } from './utils/logitechMacro';
import { downloadFile } from './utils/file';
import { calculateRecoilPattern } from './utils/recoil';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ToolSection } from './components/ToolSection';
import { UsageGuide } from './components/UsageGuide';
import { Footer } from './components/Footer';

const DEFAULT_SENSITIVITY = 2.0;
const DEFAULT_INTENSITY = 100;

function App() {
  const { theme, toggleTheme } = useTheme();
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

  const calculatedPattern = useMemo(
    () => (selectedWeapon ? calculateRecoilPattern(selectedWeapon, sensitivity, intensity) : []),
    [selectedWeapon, sensitivity, intensity]
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar theme={theme} onToggleTheme={toggleTheme} />
      <main className="flex-1">
        <Hero />
        <ToolSection
          weapons={weapons}
          selectedWeaponId={selectedWeaponId}
          onSelectWeapon={setSelectedWeaponId}
          sensitivity={sensitivity}
          onSensitivityChange={setSensitivity}
          intensity={intensity}
          onIntensityChange={setIntensity}
          selectedWeapon={selectedWeapon}
          pattern={calculatedPattern}
          theme={theme}
          onExportRazer={handleExportRazer}
          onExportLogitech={handleExportLogitech}
        />
        <UsageGuide />
      </main>
      <Footer />
    </div>
  );
}

export default App;
