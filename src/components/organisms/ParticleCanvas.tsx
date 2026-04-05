import { useRef, useCallback, useEffect, type FC } from 'react';
import { useStore } from '@nanostores/react';
import { $visibleEdges, $activeChain } from '@stores/app';
import { NODE_BY_ID } from '@data/graph';
import { CHAIN_BY_ID } from '@data/constants';
import { useAnimationFrame } from '@hooks/index';
import { quadraticBezier, hexToRgba } from '@lib/utils';
import type { Particle, Dimensions } from '@data/types';

interface Props {
  dims: Dimensions;
}

const MAX_PARTICLES = 500;

const ParticleCanvas: FC<Props> = ({ dims }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const edges = useStore($visibleEdges);
  const activeChain = useStore($activeChain);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !dims.width) return;
    canvas.width = dims.width;
    canvas.height = dims.height;
  }, [dims.width, dims.height]);

  const animate = useCallback(
    () => {
      const canvas = canvasRef.current;
      if (!canvas || !dims.width) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, dims.width, dims.height);

      // Draw edge curves
      for (const edge of edges) {
        const fn = NODE_BY_ID.get(edge.from);
        const tn = NODE_BY_ID.get(edge.to);
        if (!fn || !tn) continue;
        const chain = CHAIN_BY_ID.get(edge.chain);
        const color = chain?.color ?? '#555';
        const fx = fn.x * dims.width, fy = fn.y * dims.height;
        const tx = tn.x * dims.width, ty = tn.y * dims.height;
        const mx = (fx + tx) / 2, my = (fy + ty) / 2 - 18;

        ctx.beginPath();
        ctx.moveTo(fx, fy);
        ctx.quadraticCurveTo(mx, my, tx, ty);
        ctx.strokeStyle = hexToRgba(color, activeChain ? 0.14 : 0.06);
        ctx.lineWidth = activeChain ? edge.weight * 0.6 : edge.weight * 0.25;
        ctx.stroke();
      }

      // Spawn particles
      for (const edge of edges) {
        if (particles.current.length >= MAX_PARTICLES) break;
        if (Math.random() > 0.025 * edge.weight) continue;
        const fn = NODE_BY_ID.get(edge.from);
        const tn = NODE_BY_ID.get(edge.to);
        if (!fn || !tn) continue;
        const chain = CHAIN_BY_ID.get(edge.chain);
        particles.current.push({
          x: fn.x * dims.width, y: fn.y * dims.height,
          targetX: tn.x * dims.width, targetY: tn.y * dims.height,
          progress: 0, speed: 0.003 + Math.random() * 0.005,
          color: chain?.color ?? '#fff',
          size: 1 + Math.random() * 1.8, opacity: 0.35 + Math.random() * 0.45,
        });
      }

      // Update & draw particles
      const alive: Particle[] = [];
      for (const p of particles.current) {
        p.progress += p.speed;
        if (p.progress >= 1) continue;
        const t = p.progress;
        const mx = (p.x + p.targetX) / 2;
        const my = (p.y + p.targetY) / 2 - 18;
        const cx = quadraticBezier(t, p.x, mx, p.targetX);
        const cy = quadraticBezier(t, p.y, my, p.targetY);
        const fade = t < 0.1 ? t / 0.1 : t > 0.85 ? (1 - t) / 0.15 : 1;

        ctx.beginPath();
        ctx.arc(cx, cy, p.size, 0, Math.PI * 2);
        ctx.fillStyle = hexToRgba(p.color, fade * p.opacity);
        ctx.fill();
        alive.push(p);
      }
      particles.current = alive;
    },
    [edges, activeChain, dims.width, dims.height],
  );

  useAnimationFrame(animate, dims.width > 0);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }}
    />
  );
};

export default ParticleCanvas;
