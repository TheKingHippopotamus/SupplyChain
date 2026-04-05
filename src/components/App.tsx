import { type FC } from 'react';
import { useStore } from '@nanostores/react';
import { $viewMode } from '@stores/app';
import { useDimensions } from '@hooks/index';
import ChainFilter from './organisms/ChainFilter';
import NetworkView from './organisms/NetworkView';
import SankeyChart from './charts/SankeyChart';
import TreemapChart from './charts/TreemapChart';
import DetailPanel from './organisms/DetailPanel';
import ViewSwitcher from './molecules/ViewSwitcher';
import SearchBar from './molecules/SearchBar';
import { getGraphStats } from '@data/transformers';

const stats = getGraphStats();

const App: FC = () => {
  const viewMode = useStore($viewMode);
  const [canvasRef, dims] = useDimensions<HTMLDivElement>();

  return (
    <div className="cascade-app">
      {/* ── Header ────────────────────────────────────── */}
      <header className="cascade-header">
        <div className="header-left">
          <a href="/" className="logo">
            <span className="logo-text">CASCADE</span>
            <span className="logo-sub">Capital Flow Intelligence</span>
          </a>
        </div>
        <div className="header-center">
          <SearchBar />
        </div>
        <div className="header-right">
          <ViewSwitcher />
        </div>
      </header>

      {/* ── Body ──────────────────────────────────────── */}
      <div className="cascade-body">
        {/* Left sidebar */}
        <div className="cascade-sidebar">
          <ChainFilter />
        </div>

        {/* Main canvas */}
        <main className="cascade-main" ref={canvasRef}>
          {viewMode === 'network' && <NetworkView dims={dims} />}
          {viewMode === 'sankey' && <SankeyChart dims={dims} />}
          {viewMode === 'treemap' && <TreemapChart dims={dims} />}
        </main>

        {/* Right detail panel */}
        <DetailPanel />
      </div>

      {/* ── Footer stats ─────────────────────────────── */}
      <footer className="cascade-footer">
        <div className="stat-item">
          <span className="stat-value">{stats.totalNodes}</span>
          <span className="stat-label">Industries</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{stats.totalEdges}</span>
          <span className="stat-label">Connections</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{stats.chains}</span>
          <span className="stat-label">Supply Chains</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{stats.criticalNodes}</span>
          <span className="stat-label">Bottlenecks</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{stats.sectors}</span>
          <span className="stat-label">Sectors</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
