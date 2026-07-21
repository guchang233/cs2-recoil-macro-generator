import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import type { CalculatedPoint } from '../types/weapon';

interface RecoilPreviewProps {
  pattern: CalculatedPoint[];
  weaponName: string;
}

function niceStep(range: number, targetTicks: number): number {
  const rawStep = range / targetTicks;
  const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const normalized = rawStep / magnitude;
  const nice = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
  return nice * magnitude;
}

export function RecoilPreview({ pattern, weaponName }: RecoilPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState(1);

  // 每发子弹拆成 4 步平滑发送（与宏生成逻辑一致）
  const steps = useMemo(() => {
    const result: { x: number; y: number; delay: number }[] = [];
    const waitDivider = 4;
    for (const point of pattern) {
      const x = Math.round(point.x);
      const y = Math.round(point.y);
      const stepDelay = Math.round(point.delay / waitDivider);
      for (let j = 0; j < waitDivider; j++) {
        result.push({ x, y, delay: stepDelay });
      }
    }
    return result;
  }, [pattern]);

  // 累积偏移轨迹
  const accumulated = useMemo(() => {
    const points: { x: number; y: number }[] = [{ x: 0, y: 0 }];
    let cx = 0;
    let cy = 0;
    for (const s of steps) {
      cx += s.x;
      cy += s.y;
      points.push({ x: cx, y: cy });
    }
    return points;
  }, [steps]);

  // 自适应坐标范围
  const bounds = useMemo(() => {
    if (accumulated.length === 0) {
      return { minX: 0, maxX: 1, minY: 0, maxY: 1, xStep: 1, yStep: 1 };
    }
    const allX = accumulated.map((p) => p.x);
    const allY = accumulated.map((p) => p.y);
    let minX = Math.min(...allX);
    let maxX = Math.max(...allX);
    let minY = Math.min(...allY);
    let maxY = Math.max(...allY);
    const padding = 0.15;
    const rangeX = maxX - minX || 10;
    const rangeY = maxY - minY || 10;
    minX -= rangeX * padding;
    maxX += rangeX * padding;
    minY -= rangeY * padding;
    maxY += rangeY * padding;
    const xStep = niceStep(maxX - minX, 6);
    const yStep = niceStep(maxY - minY, 6);
    minX = Math.floor(minX / xStep) * xStep;
    maxX = Math.ceil(maxX / xStep) * xStep;
    minY = Math.floor(minY / yStep) * yStep;
    maxY = Math.ceil(maxY / yStep) * yStep;
    return { minX, maxX, minY, maxY, xStep, yStep };
  }, [accumulated]);

  const draw = useCallback(
    (progressRatio: number) => {
      const canvas = canvasRef.current;
      if (!canvas || accumulated.length === 0) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);

      const width = rect.width;
      const height = rect.height;
      const padL = 50;
      const padR = 20;
      const padT = 28;
      const padB = 36;
      const chartW = width - padL - padR;
      const chartH = height - padT - padB;

      const { minX, maxX, minY, maxY, xStep, yStep } = bounds;
      const rangeX = maxX - minX;
      const rangeY = maxY - minY;
      const scale = Math.min(chartW / rangeX, chartH / rangeY);
      const offsetX = padL + (chartW - rangeX * scale) / 2;
      const offsetY = padT + (chartH - rangeY * scale) / 2;

      const toScreen = (x: number, y: number) => ({
        sx: offsetX + (x - minX) * scale,
        sy: offsetY + (y - minY) * scale,
      });

      ctx.clearRect(0, 0, width, height);

      // 背景
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, width, height);

      // 网格
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      for (let x = minX; x <= maxX + xStep * 0.5; x += xStep) {
        const { sx } = toScreen(x, 0);
        ctx.beginPath();
        ctx.moveTo(sx, padT);
        ctx.lineTo(sx, height - padB);
        ctx.stroke();
      }
      for (let y = minY; y <= maxY + yStep * 0.5; y += yStep) {
        const { sy } = toScreen(0, y);
        ctx.beginPath();
        ctx.moveTo(padL, sy);
        ctx.lineTo(width - padR, sy);
        ctx.stroke();
      }

      // 坐标刻度
      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      for (let x = minX; x <= maxX + xStep * 0.5; x += xStep) {
        const { sx } = toScreen(x, 0);
        ctx.fillText(x.toFixed(0), sx, height - padB + 14);
      }
      ctx.textAlign = 'right';
      for (let y = minY; y <= maxY + yStep * 0.5; y += yStep) {
        const { sy } = toScreen(0, y);
        ctx.fillText(y.toFixed(0), padL - 6, sy + 3);
      }

      // 轴标签
      ctx.fillStyle = '#64748b';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('X 偏移 (px)', width / 2, height - 6);
      ctx.save();
      ctx.translate(12, height / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText('Y 偏移 (px)', 0, 0);
      ctx.restore();

      // 当前播放进度对应的轨迹终点索引
      const totalSteps = accumulated.length - 1;
      const currentStep = Math.min(Math.floor(progressRatio * totalSteps), totalSteps);

      // 主轨迹（绿色实线）
      if (currentStep > 0) {
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i <= currentStep; i++) {
          const { sx, sy } = toScreen(accumulated[i].x, accumulated[i].y);
          if (i === 0) ctx.moveTo(sx, sy);
          else ctx.lineTo(sx, sy);
        }
        ctx.stroke();
      }

      // 起点（蓝色）
      const startP = toScreen(accumulated[0].x, accumulated[0].y);
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.arc(startP.sx, startP.sy, 4, 0, Math.PI * 2);
      ctx.fill();

      // 终点（红色，仅在播放完成时显示）
      const endP = toScreen(
        accumulated[accumulated.length - 1].x,
        accumulated[accumulated.length - 1].y
      );
      if (currentStep >= totalSteps && accumulated.length > 1) {
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(endP.sx, endP.sy, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      // 标题与统计
      ctx.fillStyle = '#e2e8f0';
      ctx.font = 'bold 13px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(weaponName, padL, padT - 10);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'right';
      const totalX = accumulated[accumulated.length - 1].x;
      const totalY = accumulated[accumulated.length - 1].y;
      ctx.fillText(
        `总偏移: (${Math.round(totalX)}, ${Math.round(totalY)}) px`,
        width - padR,
        padT - 10
      );
    },
    [accumulated, bounds, weaponName]
  );

  useEffect(() => {
    draw(progress);
  }, [draw, progress]);

  // 切换武器或速度时重置
  useEffect(() => {
    setProgress(0);
    setIsPlaying(false);
    if (animRef.current) {
      cancelAnimationFrame(animRef.current);
      animRef.current = null;
    }
  }, [pattern, speed]);

  // 播放动画
  useEffect(() => {
    if (!isPlaying || steps.length === 0) return;
    const totalDelay = steps.reduce((s, p) => s + p.delay, 0);
    const totalMs = totalDelay / speed;
    const startTime = performance.now() - progress * totalMs;

    const animate = (now: number) => {
      const ratio = Math.min((now - startTime) / totalMs, 1);
      setProgress(ratio);
      if (ratio < 1) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        setIsPlaying(false);
      }
    };
    animRef.current = requestAnimationFrame(animate);
    return () => {
      if (animRef.current) {
        cancelAnimationFrame(animRef.current);
        animRef.current = null;
      }
    };
  }, [isPlaying, steps, speed, progress]);

  const handlePlay = () => {
    if (progress >= 1) setProgress(0);
    setIsPlaying(true);
  };
  const handleReset = () => {
    setIsPlaying(false);
    setProgress(0);
  };

  return (
    <div className="bg-slate-800 rounded-lg overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-72 block" />
      <div className="px-3 py-2 bg-slate-900 border-t border-slate-700 flex items-center gap-2">
        <button
          onClick={isPlaying ? () => setIsPlaying(false) : handlePlay}
          className="px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-white text-sm rounded transition-colors"
        >
          {isPlaying ? '暂停' : '播放'}
        </button>
        <button
          onClick={handleReset}
          className="px-3 py-1 bg-slate-600 hover:bg-slate-700 text-white text-sm rounded transition-colors"
        >
          重置
        </button>
        <div className="flex items-center gap-2 ml-2">
          <span className="text-xs text-slate-400">速度:</span>
          <select
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
            className="bg-slate-800 border border-slate-700 rounded px-2 py-0.5 text-xs text-slate-100 focus:outline-none"
          >
            <option value={0.25}>0.25x</option>
            <option value={0.5}>0.5x</option>
            <option value={1}>1x</option>
            <option value={2}>2x</option>
            <option value={4}>4x</option>
          </select>
        </div>
        <div className="ml-auto text-xs text-slate-400">
          {Math.round(progress * 100)}%
        </div>
      </div>
    </div>
  );
}
