import { type FC, useMemo, useCallback } from 'react';
import { useStore } from '@nanostores/react';
import { $activeChain, selectNode } from '@stores/app';
import { buildTreemapData } from '@data/transformers';
import { hexToRgba } from '@lib/utils';
import * as d3 from 'd3';
import type { Dimensions } from '@data/types';

interface Props {
  dims: Dimensions;
}

interface TreeNode {
  id: string;
  name: string;
  value: number;
  color: string;
  children?: TreeNode[];
}

interface LayoutRect {
  id: string;
  name: string;
  color: string;
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  depth: number;
  value: number;
  parentName?: string;
}

const TreemapChart: FC<Props> = ({ dims }) => {
  const activeChain = useStore($activeChain);

  const rects = useMemo((): LayoutRect[] => {
    if (dims.width <= 0 || dims.height <= 0) return [];

    const data = buildTreemapData(activeChain ?? undefined);
    const margin = { top: 32, right: 4, bottom: 4, left: 4 };
    const w = dims.width - margin.left - margin.right;
    const h = dims.height - margin.top - margin.bottom;

    if (w <= 0 || h <= 0) return [];

    const root = d3
      .hierarchy<TreeNode>(data)
      .sum((d) => d.value)
      .sort((a, b) => (b.value ?? 0) - (a.value ?? 0));

    d3.treemap<TreeNode>()
      .size([w, h])
      .padding(2)
      .paddingTop(18)
      .round(true)(root);

    const result: LayoutRect[] = [];

    // Sector groups (depth 1)
    for (const sector of root.children ?? []) {
      result.push({
        id: sector.data.id,
        name: sector.data.name,
        color: sector.data.color,
        x0: (sector as any).x0 + margin.left,
        y0: (sector as any).y0 + margin.top,
        x1: (sector as any).x1 + margin.left,
        y1: (sector as any).y1 + margin.top,
        depth: 1,
        value: sector.value ?? 0,
      });

      // Industry leaves (depth 2)
      for (const leaf of sector.children ?? []) {
        result.push({
          id: leaf.data.id,
          name: leaf.data.name,
          color: leaf.data.color,
          x0: (leaf as any).x0 + margin.left,
          y0: (leaf as any).y0 + margin.top,
          x1: (leaf as any).x1 + margin.left,
          y1: (leaf as any).y1 + margin.top,
          depth: 2,
          value: leaf.value ?? 0,
          parentName: sector.data.name,
        });
      }
    }

    return result;
  }, [dims.width, dims.height, activeChain]);

  const onClickLeaf = useCallback((id: string) => {
    selectNode(id);
  }, []);

  if (rects.length === 0) {
    return (
      <div className="treemap-empty">
        <p>Resize window to render treemap</p>
      </div>
    );
  }

  return (
    <div className="treemap-container" style={{ position: 'relative', width: dims.width, height: dims.height }}>
      {/* Title */}
      <div className="treemap-title">
        Industry Treemap — sized by connectivity
      </div>

      {rects.map((rect) => {
        const w = rect.x1 - rect.x0;
        const h = rect.y1 - rect.y0;

        if (rect.depth === 1) {
          // Sector header
          return (
            <div
              key={`s-${rect.id}`}
              className="treemap-sector"
              style={{
                position: 'absolute',
                left: rect.x0,
                top: rect.y0,
                width: w,
                height: h,
                borderColor: hexToRgba(rect.color, 0.2),
              }}
            >
              <span
                className="treemap-sector-label"
                style={{ color: hexToRgba(rect.color, 0.7) }}
              >
                {rect.name}
              </span>
            </div>
          );
        }

        // Industry leaf
        const showLabel = w > 40 && h > 22;
        return (
          <div
            key={`l-${rect.id}`}
            className="treemap-leaf"
            onClick={() => onClickLeaf(rect.id)}
            style={{
              position: 'absolute',
              left: rect.x0,
              top: rect.y0,
              width: w,
              height: h,
              background: hexToRgba(rect.color, 0.12),
              borderColor: hexToRgba(rect.color, 0.2),
            }}
            title={`${rect.name} (${rect.parentName})`}
          >
            {showLabel && (
              <span
                className="treemap-leaf-label"
                style={{ color: hexToRgba(rect.color, 0.8) }}
              >
                {rect.name}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TreemapChart;
