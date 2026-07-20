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
  let nice: number;
  if (normalized <= 1) nice = 1;
  else if (normalized <= 2) nice = 2;
  else if (normalized <= 5) nice = 5;
  else nice = 10;
  return nice * magnitude;
}

export function RecoilPreview({ pattern, weaponName }: RecoilPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState(1);

  const steps = useMemo(() => {
    const result: { x: number; y: number; delay: number }[] = [];
    const waitDivider = 4;
    for (let i = 0; i < pattern.length; i++) {
      const point = pattern[i];
      const x = Math.round(point.x);
      const y = Math.round(point.y);
      const stepDelay = Math.round(point.delay / waitDivider);
      for (let j = 0; j < waitDivider; j++) {
        result.push({ x, y, delay: stepDelay });
      }
    }
    return result;
  }, [pattern]);

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

  const { minX, maxX, minY, maxY, xStep, yStep } = useMemo(() => {
    if (accumulated.length === 0) {
      return { minX: 0, maxX: 1, minY: 0, maxY: 1, xStep: 1, yStep: 1 };
    }
    const allX = accumulated.map(p => p.x);
    const allY = accumulated.map(p => p.y);
    let minX = Math.min(...allX);
    let maxX = Math.max(...allX);
    let minY = Math.min(...allY);
    let maxY = Math.max(...allY);
    const padding = 0.15;
    const rangeX = (maxX - minX) || 10;
    const rangeY = (maxY - minY) || 10;
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

  const draw = useCallback((progressRatio: number) => {
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
    const padL = 55;
    const padR = 20;
    const padT = 30;
    const padB = 40;
    const chartW = width - padL - padR;
    const chartH = height - padT - padB;

    const rangeX = maxX - minX;
    const rangeY = maxY - minY;
    const scaleX = chartW / rangeX;
    const scaleY = chartH / rangeY;
    const scale = Math.min(scaleX, scaleY);

    const chartDrawW = rangeX * scale;
    const chartDrawH = rangeY * scale;
    const offsetX = padL + (chartW - chartDrawW) / 2;
    const offsetY = padT + (chartH - chartDrawH) / 2;

    const toScreen = (x: number, y: number) => ({
      sx: offsetX + (x - minX) * scale,
      sy: offsetY + (y - minY) * scale,
    });

    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);

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

    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(offsetX, offsetY, rangeX * scale, rangeY * scale);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    for (let x = minX; x <= maxX + xStep * 0.5; x += xStep) {
      const { sx } = toScreen(x, 0);
      ctx.fillText(x.toFixed(0), sx, height - padB + 15);
    }
    ctx.textAlign = 'right';
    for (let y = minY; y <= maxY + yStep * 0.5; y += yStep) {
      const { sy } = toScreen(0, y);
      ctx.fillText(y.toFixed(0), padL - 8, sy + 3);
    }

    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('X 偏移 (像素)', width / 2, height - 8);
    ctx.save();
    ctx.translate(12, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Y 偏移 (像素)', 0, 0);
    ctx.restore();

    const totalSteps = accumulated.length - 1;
    const currentStep = Math.min(Math.floor(progressRatio * totalSteps), totalSteps);

    if (totalSteps > 0) {
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      for (let i = 0; i < accumulated.length; i++) {
        const { sx, sy } = toScreen(accumulated[i].x, accumulated[i].y);
        if (i === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }

    if (currentStep > 0) {
      const gradient = ctx.createLinearGradient(0, padT, 0, height - padB);
      gradient.addColorStop(0, 'rgba(16, 185, 129, 0.25)');
      gradient.addColorStop(1, 'rgba(16, 185, 129, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      const startP = toScreen(accumulated[0].x, accumulated[0].y);
      ctx.moveTo(startP.sx, startP.sy);
      for (let i = 1; i <= currentStep; i++) {
        const { sx, sy } = toScreen(accumulated[i].x, accumulated[i].y);
        ctx.lineTo(sx, sy);
      }
      const curP = toScreen(accumulated[currentStep].x, accumulated[currentStep].y);
      ctx.lineTo(curP.sx, height - padB);
      ctx.lineTo(startP.sx, height - padB);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let i = 0; i <= currentStep; i++) {
        const { sx, sy } = toScreen(accumulated[i].x, accumulated[i].y);
        if (i === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      }
      ctx.stroke();
    }

    const startP = toScreen(accumulated[0].x, accumulated[0].y);
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.arc(startP.sx, startP.sy, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('起点', startP.sx + 8, startP.sy + 4);

    const endP = toScreen(accumulated[accumulated.length - 1].x, accumulated[accumulated.length - 1].y);
    ctx.fillStyle = '#64748b';
    ctx.beginPath();
    ctx.arc(endP.sx, endP.sy, 4, 0, Math.PI * 2);
    ctx.fill();

    if (currentStep > 0 && currentStep < accumulated.length - 1) {
      const curPt = toScreen(accumulated[currentStep].x, accumulated[currentStep].y);
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(curPt.sx, curPt.sy, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(curPt.sx, curPt.sy, 6, 0, Math.PI * 2);
      ctx.stroke();
    }

    if (currentStep >= accumulated.length - 1 && accumulated.length > 1) {
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(endP.sx, endP.sy, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#e2e8f0';
      ctx.textAlign = 'left';
      ctx.fillText('终点', endP.sx + 8, endP.sy + 4);
    }

    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 13px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`${weaponName}`, padL, padT - 12);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'right';
    const totalX = accumulated[accumulated.length - 1].x;
    const totalY = accumulated[accumulated.length - 1].y;
    ctx.fillText(`总偏移: (${Math.round(totalX)}, ${Math.round(totalY)}) px`, width - padR, padT - 12);

    ctx.textAlign = 'left';
    ctx.fillText(`步数: ${currentStep} / ${totalSteps}`, padL, height - 8);
  }, [accumulated, maxX, maxY, minX, minY, weaponName, xStep, yStep]);

  useEffect(() => {
    draw(progress);
  }, [draw, progress]);

  useEffect(() => {
    setProgress(0);
    setIsPlaying(false);
    if (animRef.current) {
      cancelAnimationFrame(animRef.current);
      animRef.current = null;
    }
  }, [pattern, speed]);

  useEffect(() => {
    if (!isPlaying || steps.length === 0) return;

    const totalDelay = steps.reduce((s, p) => s + p.delay, 0);
    const totalMs = totalDelay / speed;
    const startTime = performance.now() - progress * totalMs;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const ratio = Math.min(elapsed / totalMs, 1);
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
  }, [isPlaying, steps, speed]);

  const handlePlay = () => {
    if (progress >= 1) {
      setProgress(0);
    }
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setProgress(0);
  };

  return (
    <div className="bg-[#1e293b] rounded-lg overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-72 block"
      />
      <div className="px-3 py-2 bg-[#0f172a] border-t border-[#334155] flex items-center gap-2">
        <button
          onClick={isPlaying ? handlePause : handlePlay}
          className="px-3 py-1 bg-[#10b981] hover:bg-[#059669] text-white text-sm rounded transition-colors"
        >
          {isPlaying ? '暂停' : '播放'}
        </button>
        <button
          onClick={handleReset}
          className="px-3 py-1 bg-[#475569] hover:bg-[#334155] text-white text-sm rounded transition-colors"
        >
          重置
        </button>
        <div className="flex items-center gap-2 ml-2">
          <span className="text-xs text-[#94a3b8]">速度:</span>
          <select
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
            className="bg-[#1e293b] border border-[#334155] rounded px-2 py-0.5 text-xs text-[#f1f5f9] focus:outline-none"
          >
            <option value={0.25}>0.25x</option>
            <option value={0.5}>0.5x</option>
            <option value={1}>1x</option>
            <option value={2}>2x</option>
            <option value={4}>4x</option>
          </select>
        </div>
        <div className="ml-auto text-xs text-[#94a3b8]">
          {Math.round(progress * 100)}%
        </div>
      </div>
    </div>
  );
}
