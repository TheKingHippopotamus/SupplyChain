import { type FC, useCallback } from 'react';
import { useStore } from '@nanostores/react';
import {
  $activeChain, $hoveredNodeId, $selectedNodeId, $connectedIds,
  selectNode, hoverNode, isNodeActive, isNodeHighlighted,
} from '@stores/app';
import { NODES } from '@data/graph';
import { CHAIN_BY_ID, SECTOR_BY_ID } from '@data/constants';
import { hexToRgba } from '@lib/utils';
import type { Dimensions, IndustryNode } from '@data/types';

interface Props {
  dims: Dimensions;
}

const NodeDot: FC<{
  node: IndustryNode;
  dims: Dimensions;
  active: boolean;
  highlighted: boolean;
  selected: boolean;
  hovered: boolean;
}> = ({ node, dims, active, highlighted, selected, hovered }) => {
  const chain = node.chains[0] ? CHAIN_BY_ID.get(node.chains[0]) : null;
  const sector = SECTOR_BY_ID.get(node.sector);
  const color = chain?.color ?? sector?.color ?? '#888';
  const opacity = !active ? 0.08 : !highlighted ? 0.2 : 1;
  const scale = hovered || selected ? 1.15 : 1;

  const onClick = useCallback(() => selectNode(node.id), [node.id]);
  const onEnter = useCallback(() => hoverNode(node.id), [node.id]);
  const onLeave = useCallback(() => hoverNode(null), []);

  return (
    <div
      onClick={onClick}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="cascade-node"
      style={{
        position: 'absolute',
        left: node.x * dims.width,
        top: node.y * dims.height,
        transform: `translate(-50%, -50%) scale(${scale})`,
        zIndex: hovered || selected ? 15 : 10,
        opacity,
        cursor: 'pointer',
        transition: 'all 0.25s ease',
      }}
    >
      {/* Critical glow ring */}
      {node.critical && active && (
        <div
          className="cascade-pulse"
          style={{
            position: 'absolute',
            inset: -7,
            borderRadius: '50%',
            border: `2px solid ${hexToRgba(color, 0.35)}`,
          }}
        />
      )}

      {/* Dot */}
      <div
        style={{
          width: selected ? 16 : 10,
          height: selected ? 16 : 10,
          borderRadius: '50%',
          background: `radial-gradient(circle at 35% 35%, ${color}, ${hexToRgba(color, 0.5)})`,
          boxShadow: `0 0 ${hovered ? 16 : 6}px ${hexToRgba(color, 0.4)}`,
          border: selected ? `2px solid ${color}` : 'none',
          margin: '0 auto 3px',
          transition: 'all 0.25s',
        }}
      />

      {/* Label */}
      <div
        style={{
          fontSize: 7.5,
          fontWeight: selected ? 600 : 400,
          color: selected || hovered ? '#fff' : '#999',
          textAlign: 'center',
          lineHeight: 1.25,
          whiteSpace: 'pre-line',
          textShadow: '0 1px 4px rgba(0,0,0,0.9)',
          pointerEvents: 'none',
          transition: 'color 0.2s',
        }}
      >
        {node.label}
      </div>
    </div>
  );
};

const NodeOverlay: FC<Props> = ({ dims }) => {
  const activeChain = useStore($activeChain);
  const hoveredId = useStore($hoveredNodeId);
  const selectedId = useStore($selectedNodeId);
  const connectedIds = useStore($connectedIds);

  return (
    <>
      {NODES.map((node) => (
        <NodeDot
          key={node.id}
          node={node}
          dims={dims}
          active={isNodeActive(node, activeChain)}
          highlighted={isNodeHighlighted(node.id, hoveredId, connectedIds)}
          selected={selectedId === node.id}
          hovered={hoveredId === node.id}
        />
      ))}
    </>
  );
};

export default NodeOverlay;
