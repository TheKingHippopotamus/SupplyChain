import type { ChainId, FlowEdge, IndustryNode, NodeConnections, SankeyData } from './types';
import { EDGES, NODE_BY_ID, NODES } from './graph';
import { CHAIN_BY_ID, SECTOR_BY_ID } from './constants';

// ── Graph Queries ───────────────────────────────────────────────────────

export function getNodeConnections(nodeId: string): NodeConnections {
  const upstream = EDGES
    .filter((e) => e.to === nodeId)
    .map((e) => ({
      node: NODE_BY_ID.get(e.from)!,
      chain: e.chain,
      weight: e.weight,
    }))
    .filter((u) => u.node !== undefined);

  const downstream = EDGES
    .filter((e) => e.from === nodeId)
    .map((e) => ({
      node: NODE_BY_ID.get(e.to)!,
      chain: e.chain,
      weight: e.weight,
    }))
    .filter((d) => d.node !== undefined);

  return { upstream, downstream };
}

export function getConnectedNodeIds(nodeId: string): ReadonlySet<string> {
  const ids = new Set<string>([nodeId]);
  for (const e of EDGES) {
    if (e.from === nodeId) ids.add(e.to);
    if (e.to === nodeId) ids.add(e.from);
  }
  return ids;
}

export function getChainNodes(chainId: ChainId): readonly IndustryNode[] {
  return NODES.filter((n) => n.chains.includes(chainId));
}

export function getChainEdges(chainId: ChainId): readonly FlowEdge[] {
  return EDGES.filter((e) => e.chain === chainId);
}

export function getCriticalNodes(): readonly IndustryNode[] {
  return NODES.filter((n) => n.critical);
}

// ── Sankey Data Builder ─────────────────────────────────────────────────

export function buildSankeyData(chainId?: ChainId): SankeyData {
  const filteredEdges = chainId ? getChainEdges(chainId) : EDGES;

  const nodeIds = new Set<string>();
  for (const e of filteredEdges) {
    nodeIds.add(e.from);
    nodeIds.add(e.to);
  }

  const nodes = Array.from(nodeIds).map((id) => {
    const node = NODE_BY_ID.get(id);
    const sector = node ? SECTOR_BY_ID.get(node.sector) : undefined;
    return {
      id,
      name: node?.label.replace('\n', ' ') ?? id,
      color: sector?.color ?? '#666',
    };
  });

  const links = filteredEdges.map((e) => {
    const chain = CHAIN_BY_ID.get(e.chain);
    return {
      source: e.from,
      target: e.to,
      value: e.weight,
      color: chain?.color ?? '#444',
    };
  });

  return { nodes, links };
}

// ── Treemap Data Builder ────────────────────────────────────────────────

export function buildTreemapData(chainId?: ChainId) {
  const filteredNodes = chainId ? getChainNodes(chainId) : NODES;

  const sectorGroups = new Map<string, IndustryNode[]>();
  for (const node of filteredNodes) {
    const list = sectorGroups.get(node.sector) ?? [];
    list.push(node);
    sectorGroups.set(node.sector, list);
  }

  return {
    id: 'root',
    name: 'Economy',
    value: 0,
    color: '#333',
    children: Array.from(sectorGroups.entries()).map(([sectorId, nodes]) => {
      const sector = SECTOR_BY_ID.get(sectorId as IndustryNode['sector']);
      return {
        id: sectorId,
        name: sector?.name ?? sectorId,
        value: nodes.length,
        color: sector?.color ?? '#666',
        children: nodes.map((n) => ({
          id: n.id,
          name: n.label.replace('\n', ' '),
          value: n.chains.length + (n.critical ? 2 : 0),
          color: sector?.color ?? '#666',
        })),
      };
    }),
  };
}

// ── Stats ───────────────────────────────────────────────────────────────

export function getGraphStats() {
  return {
    totalNodes: NODES.length,
    totalEdges: EDGES.length,
    criticalNodes: NODES.filter((n) => n.critical).length,
    sectors: new Set(NODES.map((n) => n.sector)).size,
    chains: new Set(EDGES.map((e) => e.chain)).size,
  };
}
