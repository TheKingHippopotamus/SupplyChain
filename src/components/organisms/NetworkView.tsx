import { type FC } from 'react';
import { useStore } from '@nanostores/react';
import { $activeChain } from '@stores/app';
import { CHAIN_BY_ID } from '@data/constants';
import ParticleCanvas from './ParticleCanvas';
import NodeOverlay from './NodeOverlay';
import type { Dimensions } from '@data/types';

interface Props {
  dims: Dimensions;
}

const NetworkView: FC<Props> = ({ dims }) => {
  const activeChain = useStore($activeChain);
  const chain = activeChain ? CHAIN_BY_ID.get(activeChain) : null;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <ParticleCanvas dims={dims} />
      <NodeOverlay dims={dims} />

      {/* Active chain badge */}
      {chain && (
        <div className="chain-active-badge" style={{ borderColor: `${chain.color}33` }}>
          <span className="badge-name" style={{ color: chain.color }}>
            {chain.icon} {chain.name} Chain
          </span>
          <span className="badge-desc">{chain.description}</span>
        </div>
      )}
    </div>
  );
};

export default NetworkView;
