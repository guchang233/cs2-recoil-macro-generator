import type { WeaponRecoilData } from '../types/weapon';
import { calculateRecoilPattern } from './recoil';

export function generateLogitechMacro(
  weapon: WeaponRecoilData,
  sensitivity: number,
  intensityPercent: number = 100,
  options?: {
    macroName?: string;
    triggerKey?: number;
  }
): string {
  const triggerKey = options?.triggerKey ?? 1;
  const pattern = calculateRecoilPattern(weapon, sensitivity, intensityPercent);
  const waitDivider = 4;
  const now = new Date();
  const timeStr = now.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const steps: { x: number; y: number; delay: number }[] = [];
  for (let i = 0; i < pattern.length; i++) {
    const point = pattern[i];
    const x = Math.round(point.x);
    const y = Math.round(point.y);
    const stepDelay = Math.round(point.delay / waitDivider);
    for (let j = 0; j < waitDivider; j++) {
      steps.push({ x, y, delay: stepDelay });
    }
  }

  let patternLines = '';
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    const comma = i < steps.length - 1 ? ',' : '';
    patternLines += `  {${step.x}, ${step.y}, ${step.delay}}${comma}\n`;
  }

  const lua = `-- CS2 压枪宏 - ${weapon.name}
-- 武器: ${weapon.name}
-- 灵敏度: ${sensitivity}, 强度: ${intensityPercent}%
-- 生成时间: ${timeStr}
--
-- 使用说明:
-- 1. 打开 Logitech G HUB
-- 2. 选择鼠标设备，进入 "脚本" 页面
-- 3. 新建脚本，将本文件内容复制粘贴
-- 4. 保存并启用脚本
-- 5. 在游戏中按住鼠标左键即可自动压枪
--
-- 注意事项:
-- - 请确保游戏内灵敏度与配置一致
-- - 压枪强度可根据实际情况调整
-- - 仅用于学习交流，请遵守游戏规则

local recoilSteps = {
${patternLines}}

local totalSteps = ${steps.length}
local triggerButton = ${triggerKey}

function OnEvent(event, arg)
  if event == "MOUSE_BUTTON_PRESSED" and arg == triggerButton then
    local stepIndex = 1
    while IsMouseButtonPressed(triggerButton) and stepIndex <= totalSteps do
      local dx = recoilSteps[stepIndex][1]
      local dy = recoilSteps[stepIndex][2]
      local delay = recoilSteps[stepIndex][3]
      MoveMouseRelative(dx, dy)
      Sleep(delay)
      stepIndex = stepIndex + 1
    end
  end
end
`;

  return lua;
}

export function getLogitechMacroSummary(
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
