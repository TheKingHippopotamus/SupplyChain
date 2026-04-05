import { type FC, useMemo, useRef, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { $sankeyData, $activeChain, selectNode } from '@stores/app';
import { CHAIN_BY_ID } from '@data/constants';
import {
  sankey as d3Sankey,
  sankeyLinkHorizontal,
  sankeyJustify,
} from 'd3-sankey';
import type { SankeyNode, SankeyLink } from 'd3-sankey';
import { hexToRgba } from '@lib/utils';
import type { Dimensions } from '@data/types';

interface NodeExtra { id: string; name: string; color: string; }
interface LinkExtra { color: string; }
type SNode = SankeyNode<NodeExtra, LinkExtra>;
type SLink = SankeyLink<NodeExtra, LinkExtra>;

interface Props {
  dims: Dimensions;
}

const SankeyChart: FC<Props> = ({ dims }) => {
  const data = useStore($sankeyData);
  const activeChain = useStore($activeChain);
  const chain = activeChain ? CHAIN_BY_ID.get(activeChain) : null;

  const margin = { top: 24, right: 24, bottom: 24, left: 24 };
  const innerW = dims.width - margin.left - margin.right;
  const innerH = dims.height - margin.top - margin.bottom;

  const layout = useMemo(() => {
    if (innerW <= 0 || innerH <= 0 || data.nodes.length === 0) return null;

    try {
      const generator = d3Sankey<NodeExtra, LinkExtra>()
        .nodeWidth(18)
        .nodePadding(14)
        .nodeAlign(sankeyJustify)
        .extent([[0, 0], [innerW, innerH]]);

      return generator({
        nodes: data.nodes.map((d) => ({ ...d })),
        links: data.links.map((d) => ({ ...d })),
      });
    } catch {
      return null;
    }
  }, [data, innerW, innerH]);

  if (!layout || innerW <= 0) {
    return (
      <div className="sankey-empty">
        <p>Select a supply chain to visualize flow</p>
      </div>
    );
  }

  return (
    <svg width={dims.width} height={dims.height} className="sankey-svg">
      <g transform={`translate(${margin.left},${margin.top})`}>
        {/* Links */}
        {layout.links.map((link: SLink, i) => {
          const path = sankeyLinkHorizontal()(link);
          if (!path) return null;
          const color = chain?.color ?? (link as unknown as LinkExtra).color ?? '#444';
          return (
            <path
              key={`link-${i}`}
              d={path}
              fill="none"
              stroke={hexToRgba(color, 0.25)}
              strokeWidth={Math.max(1, link.width ?? 0)}
              className="sankey-link"
            />
          );
        })}

        {/* Nodes */}
        {layout.nodes.map((node: SNode) => {
          const w = (node.x1 ?? 0) - (node.x0 ?? 0);
          const h = (node.y1 ?? 0) - (node.y0 ?? 0);
          const color = chain?.color ?? node.color ?? '#666';
          return (
            <g key={node.id}>
              <rect
                x={node.x0}
                y={node.y0}
                width={w}
                height={h}
                fill={color}
                rx={3}
                className="sankey-node"
                onClick={() => selectNode(node.id)}
                style={{ cursor: 'pointer' }}
              />
              {h > 14 && (
                <text
                  x={(node.x0 ?? 0) + w + 6}
                  y={(node.y0 ?? 0) + h / 2}
                  dy="0.35em"
                  fill="#aaa"
                  fontSize={10}
                  fontFamily="var(--font-mono)"
                >
                  {node.name}
                </text>
              )}
            </g>
          );
        })}
      </g>

      {/* Title */}
      <text x={dims.width / 2} y={16} textAnchor="middle" fill="#666" fontSize={11} fontFamily="var(--font-body)">
        {chain ? `${chain.name} Chain — Capital Flow` : 'All Chains — Capital Flow'}
      </text>
    </svg>
  );
};

export default SankeyChart;
