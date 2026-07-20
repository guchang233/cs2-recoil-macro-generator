import type { WeaponRecoilData } from '../types/weapon';
import { calculateRecoilPattern } from './recoil';

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function generateRazerMacro(
  weapon: WeaponRecoilData,
  sensitivity: number,
  intensityPercent: number = 100,
  macroName?: string
): string {
  const name = macroName || `${weapon.name} 压枪宏`;
  const guid = generateUUID();
  const pattern = calculateRecoilPattern(weapon, sensitivity, intensityPercent);
  const waitDivider = 4;

  // 雷蛇宏使用绝对屏幕坐标，从屏幕中心开始
  // 游戏只看到相邻两个坐标之间的差值（相对移动）
  // 默认 1920x1080，如分辨率不同请修改 baseX/baseY 为屏幕中心
  const baseX = 960;
  const baseY = 540;

  let cumX = baseX;
  let cumY = baseY;

  let macroEvents = '';

  // 第一个事件：设定起始位置（无延迟）
  macroEvents += `    <MacroEvent>
      <Type>3</Type>
      <Delay>0</Delay>
      <MouseMovement>
        <MouseMovementEvent>
          <Type>3</Type>
          <X>${cumX}</X>
          <Y>${cumY}</Y>
        </MouseMovementEvent>
      </MouseMovement>
    </MacroEvent>\n`;

  // 后续事件：累积绝对坐标路径
  // 游戏感知的是相邻坐标差值 = 每步的相对移动量
  for (let i = 0; i < pattern.length; i++) {
    const point = pattern[i];
    const x = Math.round(point.x);
    const y = Math.round(point.y);
    const stepDelay = Math.round(point.delay / waitDivider);
    for (let j = 0; j < waitDivider; j++) {
      cumX += x;
      cumY += y;
      macroEvents += `    <MacroEvent>
      <Type>3</Type>
      <Delay>${stepDelay}</Delay>
      <MouseMovement>
        <MouseMovementEvent>
          <Type>3</Type>
          <X>${cumX}</X>
          <Y>${cumY}</Y>
        </MouseMovementEvent>
      </MouseMovement>
    </MacroEvent>\n`;
    }
  }

  const xml = `<?xml version="1.0" encoding="utf-8"?>
<!-- 雷蛇压枪宏 - ${weapon.name} (灵敏度${sensitivity}, 强度${intensityPercent}%)
     注意: baseX/baseY 默认为 1920x1080 屏幕中心(960,540)
     如分辨率不同，请将所有坐标按比例调整 -->
<Macro xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
  <Name>${name}</Name>
  <Guid>${guid}</Guid>
  <MacroEvents>
${macroEvents}  </MacroEvents>
  <IsFolder>false</IsFolder>
  <FolderGuid>00000000-0000-0000-0000-000000000000</FolderGuid>
</Macro>`;

  return xml;
}

export function getMacroSummary(
  weapon: WeaponRecoilData,
  sensitivity: number,
  intensityPercent: number = 100
): {
  totalBullets: number;
  totalX: number;
  totalY: number;
} {
  const pattern = calculateRecoilPattern(weapon, sensitivity, intensityPercent);
  const waitDivider = 4;
  const totalX = pattern.reduce((sum, p) => sum + Math.round(p.x) * waitDivider, 0);
  const totalY = pattern.reduce((sum, p) => sum + Math.round(p.y) * waitDivider, 0);

  return {
    totalBullets: pattern.length,
    totalX,
    totalY,
  };
}
