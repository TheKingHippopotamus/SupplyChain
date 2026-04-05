import type { Sector, SupplyChain, SectorId } from './types';

// ── Sector Definitions ──────────────────────────────────────────────────

export const SECTORS: readonly Sector[] = [
  { id: 'technology', name: 'Technology', color: '#6366f1', ticker: 'XLK' },
  { id: 'financials', name: 'Financials', color: '#3b82f6', ticker: 'XLF' },
  { id: 'healthcare', name: 'Healthcare', color: '#ec4899', ticker: 'XLV' },
  { id: 'energy', name: 'Energy', color: '#f97316', ticker: 'XLE' },
  { id: 'industrials', name: 'Industrials', color: '#64748b', ticker: 'XLI' },
  { id: 'materials', name: 'Materials', color: '#f59e0b', ticker: 'XLB' },
  { id: 'consumer-disc', name: 'Consumer Discretionary', color: '#10b981', ticker: 'XLY' },
  { id: 'consumer-def', name: 'Consumer Staples', color: '#84cc16', ticker: 'XLP' },
  { id: 'comm-services', name: 'Communication Services', color: '#8b5cf6', ticker: 'XLC' },
  { id: 'real-estate', name: 'Real Estate', color: '#14b8a6', ticker: 'XLRE' },
  { id: 'utilities', name: 'Utilities', color: '#a78bfa', ticker: 'XLU' },
] as const;

// ── Supply Chain Definitions ────────────────────────────────────────────

export const CHAINS: readonly SupplyChain[] = [
  { id: 'tech', name: 'Technology', color: '#6366f1', description: 'Silicon to Software', icon: '⚡' },
  { id: 'energy', name: 'Energy', color: '#f59e0b', description: 'Well to Wheel', icon: '🛢️' },
  { id: 'data', name: 'Data / Cloud', color: '#06b6d4', description: 'Power to Platform', icon: '☁️' },
  { id: 'construction', name: 'Construction', color: '#10b981', description: 'Bank to Building', icon: '🏗️' },
  { id: 'finance', name: 'Financial', color: '#3b82f6', description: 'Capital to Markets', icon: '💰' },
  { id: 'health', name: 'Healthcare', color: '#ec4899', description: 'Lab to Pharmacy', icon: '🧬' },
  { id: 'defense', name: 'Defense', color: '#ef4444', description: 'Steel to Shield', icon: '🛡️' },
  { id: 'agri', name: 'Agriculture', color: '#84cc16', description: 'Seed to Store', icon: '🌾' },
] as const;

// ── Lookup Maps ─────────────────────────────────────────────────────────

export const SECTOR_BY_ID: ReadonlyMap<SectorId, Sector> = new Map(
  SECTORS.map((s) => [s.id, s]),
);

export const CHAIN_BY_ID: ReadonlyMap<string, SupplyChain> = new Map(
  CHAINS.map((c) => [c.id, c]),
);

export const SECTOR_COLOR: Record<SectorId, string> = Object.fromEntries(
  SECTORS.map((s) => [s.id, s.color]),
) as Record<SectorId, string>;

// ── Design Tokens ───────────────────────────────────────────────────────

export const THEME = {
  bg: {
    primary: '#07070e',
    secondary: '#0d0d18',
    elevated: '#131320',
    hover: '#1a1a2e',
  },
  border: {
    subtle: '#1a1a28',
    medium: '#252538',
    strong: '#333350',
  },
  text: {
    primary: '#e8e8f0',
    secondary: '#9898aa',
    muted: '#5a5a70',
    dim: '#3a3a4d',
  },
  glow: {
    spread: 12,
    blur: 20,
  },
} as const;
