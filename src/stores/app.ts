import { atom, computed } from 'nanostores';
import type { ChainId, ViewMode, IndustryNode, NodeConnections } from '@data/types';
import { NODES, EDGES, NODE_BY_ID } from '@data/graph';
import { getNodeConnections, getConnectedNodeIds, buildSankeyData } from '@data/transformers';

// ── Core UI State ───────────────────────────────────────────────────────

export const $activeChain = atom<ChainId | null>(null);
export const $selectedNodeId = atom<string | null>(null);
export const $hoveredNodeId = atom<string | null>(null);
export const $viewMode = atom<ViewMode>('network');
export const $searchQuery = atom<string>('');

// ── Actions ─────────────────────────────────────────────────────────────

export function setActiveChain(chain: ChainId | null): void {
  $activeChain.set(chain);
  $selectedNodeId.set(null);
}

export function toggleChain(chain: ChainId): void {
  $activeChain.set($activeChain.get() === chain ? null : chain);
  $selectedNodeId.set(null);
}

export function selectNode(nodeId: string | null): void {
  $selectedNodeId.set($selectedNodeId.get() === nodeId ? null : nodeId);
}

export function hoverNode(nodeId: string | null): void {
  $hoveredNodeId.set(nodeId);
}

export function setView(mode: ViewMode): void {
  $viewMode.set(mode);
}

export function setSearch(query: string): void {
  $searchQuery.set(query);
}

// ── Derived State ───────────────────────────────────────────────────────

/** Nodes visible based on active chain filter */
export const $visibleNodes = computed([$activeChain], (chain) => {
  if (!chain) return NODES;
  return NODES.filter((n) => n.chains.includes(chain));
});

/** Edges visible based on active chain filter */
export const $visibleEdges = computed([$activeChain], (chain) => {
  if (!chain) return EDGES;
  return EDGES.filter((e) => e.chain === chain);
});

/** IDs connected to the hovered node */
export const $connectedIds = computed([$hoveredNodeId], (hovered) => {
  if (!hovered) return null;
  return getConnectedNodeIds(hovered);
});

/** Selected node full data + connections */
export const $selectedNodeInfo = computed([$selectedNodeId], (nodeId): {
  node: IndustryNode;
  connections: NodeConnections;
} | null => {
  if (!nodeId) return null;
  const node = NODE_BY_ID.get(nodeId);
  if (!node) return null;
  return { node, connections: getNodeConnections(nodeId) };
});

/** Search-filtered nodes */
export const $searchResults = computed([$searchQuery], (query) => {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase();
  return NODES.filter(
    (n) =>
      n.label.toLowerCase().includes(q) ||
      n.sector.toLowerCase().includes(q) ||
      (n.description?.toLowerCase().includes(q) ?? false),
  );
});

/** Sankey data derived from active chain */
export const $sankeyData = computed([$activeChain], (chain) =>
  buildSankeyData(chain ?? undefined),
);

// ── Node Visibility Helpers ─────────────────────────────────────────────

export function isNodeActive(node: IndustryNode, activeChain: ChainId | null): boolean {
  if (!activeChain) return true;
  return node.chains.includes(activeChain);
}

export function isNodeHighlighted(
  nodeId: string,
  hoveredId: string | null,
  connectedIds: ReadonlySet<string> | null,
): boolean {
  if (!hoveredId) return true;
  if (!connectedIds) return true;
  return connectedIds.has(nodeId);
}
