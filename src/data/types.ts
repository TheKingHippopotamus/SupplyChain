// ── Core Domain Types ───────────────────────────────────────────────────

export type SectorId =
  | 'technology'
  | 'financials'
  | 'healthcare'
  | 'energy'
  | 'industrials'
  | 'materials'
  | 'consumer-disc'
  | 'consumer-def'
  | 'comm-services'
  | 'real-estate'
  | 'utilities';

export type ChainId =
  | 'tech'
  | 'energy'
  | 'data'
  | 'construction'
  | 'finance'
  | 'health'
  | 'defense'
  | 'agri';

export type DependencyType = 'supply' | 'demand' | 'enabling' | 'regulatory';

export type ViewMode = 'network' | 'sankey' | 'treemap';

// ── Graph Model ─────────────────────────────────────────────────────────

export interface IndustryNode {
  readonly id: string;
  readonly label: string;
  readonly sector: SectorId;
  readonly chains: readonly ChainId[];
  readonly critical: boolean;
  readonly x: number;
  readonly y: number;
  readonly description?: string;
  readonly tickerCount?: number;
}

export interface FlowEdge {
  readonly id: string;
  readonly from: string;
  readonly to: string;
  readonly chain: ChainId;
  readonly weight: number;
  readonly type: DependencyType;
}

export interface SupplyChain {
  readonly id: ChainId;
  readonly name: string;
  readonly color: string;
  readonly description: string;
  readonly icon: string;
}

export interface Sector {
  readonly id: SectorId;
  readonly name: string;
  readonly color: string;
  readonly ticker: string;
}

// ── Particle System ─────────────────────────────────────────────────────

export interface Particle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  progress: number;
  speed: number;
  color: string;
  size: number;
  opacity: number;
}

// ── UI State ────────────────────────────────────────────────────────────

export interface NodeConnections {
  upstream: ReadonlyArray<{
    node: IndustryNode;
    chain: ChainId;
    weight: number;
  }>;
  downstream: ReadonlyArray<{
    node: IndustryNode;
    chain: ChainId;
    weight: number;
  }>;
}

export interface Dimensions {
  width: number;
  height: number;
}

// ── Sankey Types ────────────────────────────────────────────────────────

export interface SankeyNodeDatum {
  id: string;
  name: string;
  color: string;
}

export interface SankeyLinkDatum {
  source: string;
  target: string;
  value: number;
  color: string;
}

export interface SankeyData {
  nodes: SankeyNodeDatum[];
  links: SankeyLinkDatum[];
}

// ── Treemap Types ───────────────────────────────────────────────────────

export interface TreemapDatum {
  id: string;
  name: string;
  value: number;
  color: string;
  children?: TreemapDatum[];
}
