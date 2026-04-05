import { type FC } from 'react';
import { useStore } from '@nanostores/react';
import { $selectedNodeInfo, selectNode } from '@stores/app';
import { CHAIN_BY_ID, SECTOR_BY_ID } from '@data/constants';

const DetailPanel: FC = () => {
  const info = useStore($selectedNodeInfo);
  if (!info) return null;

  const { node, connections } = info;
  const sector = SECTOR_BY_ID.get(node.sector);

  return (
    <aside className="cascade-detail-panel">
      {/* Header */}
      <div className="detail-header">
        <div>
          <h3 className="detail-title">{node.label}</h3>
          <span className="detail-sector" style={{ color: sector?.color }}>
            {sector?.name}
          </span>
        </div>
        <button className="detail-close" onClick={() => selectNode(null)} type="button">
          ✕
        </button>
      </div>

      {/* Critical warning */}
      {node.critical && (
        <div className="detail-critical">
          <span>⚠</span> Critical bottleneck — high systemic risk
        </div>
      )}

      {/* Description */}
      {node.description && <p className="detail-desc">{node.description}</p>}

      {/* Chain badges */}
      <div className="detail-chains">
        {node.chains.map((ch) => {
          const chain = CHAIN_BY_ID.get(ch);
          if (!chain) return null;
          return (
            <span key={ch} className="chain-badge" style={{
              background: `${chain.color}18`,
              color: chain.color,
              borderColor: `${chain.color}33`,
            }}>
              {chain.icon} {chain.name}
            </span>
          );
        })}
      </div>

      {/* Upstream */}
      {connections.upstream.length > 0 && (
        <section className="detail-section">
          <h4 className="detail-section-title">↑ Upstream — feeds this industry</h4>
          {connections.upstream.map((u, i) => {
            const chain = CHAIN_BY_ID.get(u.chain);
            return (
              <button key={i} className="connection-row" onClick={() => selectNode(u.node.id)} type="button">
                <span className="connection-dot" style={{ background: chain?.color }} />
                <div className="connection-info">
                  <span className="connection-name">{u.node.label}</span>
                  <span className="connection-sector">{SECTOR_BY_ID.get(u.node.sector)?.name}</span>
                </div>
                <div className="connection-bars">
                  {Array.from({ length: u.weight }).map((_, wi) => (
                    <div key={wi} className="weight-bar" style={{ background: `${chain?.color}88` }} />
                  ))}
                </div>
              </button>
            );
          })}
        </section>
      )}

      {/* Downstream */}
      {connections.downstream.length > 0 && (
        <section className="detail-section">
          <h4 className="detail-section-title">↓ Downstream — depends on this</h4>
          {connections.downstream.map((d, i) => {
            const chain = CHAIN_BY_ID.get(d.chain);
            return (
              <button key={i} className="connection-row" onClick={() => selectNode(d.node.id)} type="button">
                <span className="connection-dot" style={{ background: chain?.color }} />
                <div className="connection-info">
                  <span className="connection-name">{d.node.label}</span>
                  <span className="connection-sector">{SECTOR_BY_ID.get(d.node.sector)?.name}</span>
                </div>
                <div className="connection-bars">
                  {Array.from({ length: d.weight }).map((_, wi) => (
                    <div key={wi} className="weight-bar" style={{ background: `${chain?.color}88` }} />
                  ))}
                </div>
              </button>
            );
          })}
        </section>
      )}
    </aside>
  );
};

export default DetailPanel;
