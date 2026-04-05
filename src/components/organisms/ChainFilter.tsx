import { type FC } from 'react';
import { useStore } from '@nanostores/react';
import { $activeChain, toggleChain, setActiveChain } from '@stores/app';
import { CHAINS } from '@data/constants';
import { hexToRgba } from '@lib/utils';

const ChainFilter: FC = () => {
  const activeChain = useStore($activeChain);

  return (
    <nav className="chain-filter">
      <h2 className="filter-heading">Supply Chains</h2>

      <button
        className={`chain-btn ${!activeChain ? 'active' : ''}`}
        onClick={() => setActiveChain(null)}
        type="button"
      >
        <div className="chain-dot chain-dot-all" />
        <span>All Chains</span>
      </button>

      {CHAINS.map((ch) => {
        const isActive = activeChain === ch.id;
        return (
          <button
            key={ch.id}
            className={`chain-btn ${isActive ? 'active' : ''}`}
            onClick={() => toggleChain(ch.id)}
            style={{
              '--chain-color': ch.color,
              background: isActive ? hexToRgba(ch.color, 0.08) : undefined,
              color: isActive ? ch.color : undefined,
            } as React.CSSProperties}
            type="button"
          >
            <div
              className="chain-dot"
              style={{
                background: ch.color,
                opacity: isActive ? 1 : 0.4,
              }}
            />
            <div className="chain-label">
              <span className="chain-name">{ch.name}</span>
              <span className="chain-desc">{ch.description}</span>
            </div>
          </button>
        );
      })}

      <div className="chain-legend">
        <div className="legend-item">
          <div className="legend-icon legend-critical" />
          <span>Critical bottleneck</span>
        </div>
        <div className="legend-item">
          <div className="legend-icon legend-node" />
          <span>Industry node</span>
        </div>
        <div className="legend-item">
          <div className="legend-icon legend-flow" />
          <span>Capital flow</span>
        </div>
      </div>
    </nav>
  );
};

export default ChainFilter;
