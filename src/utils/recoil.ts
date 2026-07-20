import type { WeaponRecoilData, CalculatedPoint } from '../types/weapon';

/**
 * 计算单步压枪补偿量（与参考仓库 RSC-AUTO 一致）
 * moveX = (patternX / weaponSense) * (2.52 / userSensitivity) * (intensity / 100)
 * moveY = (patternY / weaponSense) * (2.52 / userSensitivity) * (intensity / 100)
 *
 * pattern 值即为鼠标补偿方向（直接用于 mouse_event / MoveMouseRelative）：
 *   Y 正 = 向下移动（抵消向上的后坐力）
 *   X 正 = 向右移动（抵消向左的后坐力）
 * 不需要取反。
 */
export function calculateBulletCompensation(
  patternX: number,
  patternY: number,
  weaponSense: number,
  userSensitivity: number,
  intensityPercent: number = 100
): { x: number; y: number } {
  const modifier = 2.52 / userSensitivity;
  const intensityFactor = intensityPercent / 100;
  const x = (patternX / weaponSense) * modifier * intensityFactor;
  const y = (patternY / weaponSense) * modifier * intensityFactor;
  return { x, y };
}

/**
 * 计算整个弹夹的压枪轨迹
 * 每发子弹的 pattern 值已经是增量（相对上一发的偏移），不需要做累积差分
 */
export function calculateRecoilPattern(
  weapon: WeaponRecoilData,
  sensitivity: number,
  intensityPercent: number = 100
): CalculatedPoint[] {
  const pattern = weapon.recoilPattern;
  return pattern.map(([px, py, delay]) => {
    const { x, y } = calculateBulletCompensation(
      px, py, weapon.sense, sensitivity, intensityPercent
    );
    return { x, y, delay };
  });
}
