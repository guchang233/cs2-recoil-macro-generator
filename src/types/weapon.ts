/** 后坐力模式中的单发数据 [x偏移, y偏移, 延迟ms] */
export type RecoilAction = [number, number, number];

export interface WeaponRecoilData {
  id: string;
  name: string;
  category: string;
  magazineSize: number;
  fireRate: number;
  damage: number;
  /** 武器 sense 参数（用于压枪换算的分母） */
  sense: number;
  /** 武器 zoom 参数（开镜灵敏度相关） */
  zoom: number;
  /** 后坐力模式，每发子弹的 [x, y, delay] */
  recoilPattern: RecoilAction[];
}

export interface CalculatedPoint {
  x: number;
  y: number;
  delay: number;
}
