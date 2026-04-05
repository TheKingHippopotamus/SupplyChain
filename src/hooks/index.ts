import { useRef, useEffect, useState, useCallback } from 'react';
import type { Dimensions } from '@data/types';

// ── useAnimationFrame ───────────────────────────────────────────────────

export function useAnimationFrame(callback: (dt: number) => void, active = true): void {
  const reqRef = useRef(0);
  const prevRef = useRef(0);
  const cbRef = useRef(callback);
  cbRef.current = callback;

  useEffect(() => {
    if (!active) return;

    const animate = (time: DOMHighResTimeStamp) => {
      if (prevRef.current) {
        cbRef.current(time - prevRef.current);
      }
      prevRef.current = time;
      reqRef.current = requestAnimationFrame(animate);
    };

    reqRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(reqRef.current);
      prevRef.current = 0;
    };
  }, [active]);
}

// ── useDimensions ───────────────────────────────────────────────────────

export function useDimensions<T extends HTMLElement>(): [
  React.RefObject<T | null>,
  Dimensions,
] {
  const ref = useRef<T>(null);
  const [dims, setDims] = useState<Dimensions>({ width: 0, height: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return;
      const { width, height } = entry.contentRect;
      setDims({ width: Math.floor(width), height: Math.floor(height) });
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, dims];
}

// ── useCanvas2D ─────────────────────────────────────────────────────────

export function useCanvas2D(
  width: number,
  height: number,
): [React.RefObject<HTMLCanvasElement | null>, CanvasRenderingContext2D | null] {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = width;
    canvas.height = height;
    ctxRef.current = canvas.getContext('2d');
  }, [width, height]);

  return [canvasRef, ctxRef.current];
}

// ── useThrottle ─────────────────────────────────────────────────────────

export function useThrottle<T>(value: T, interval: number): T {
  const [throttled, setThrottled] = useState(value);
  const lastRef = useRef(Date.now());

  useEffect(() => {
    const now = Date.now();
    if (now - lastRef.current >= interval) {
      lastRef.current = now;
      setThrottled(value);
    } else {
      const id = setTimeout(() => {
        lastRef.current = Date.now();
        setThrottled(value);
      }, interval - (now - lastRef.current));
      return () => clearTimeout(id);
    }
  }, [value, interval]);

  return throttled;
}

// ── useKeyboard ─────────────────────────────────────────────────────────

export function useKeyboard(handlers: Record<string, () => void>): void {
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const handler = handlersRef.current[e.key];
      if (handler) {
        e.preventDefault();
        handler();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
}
