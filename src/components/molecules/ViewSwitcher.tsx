import { type FC } from 'react';
import { useStore } from '@nanostores/react';
import { $viewMode, setView } from '@stores/app';
import type { ViewMode } from '@data/types';

const VIEWS: { id: ViewMode; label: string; icon: string }[] = [
  { id: 'network', label: 'Network Map', icon: '◉' },
  { id: 'sankey', label: 'Flow Diagram', icon: '⇶' },
  { id: 'treemap', label: 'Treemap', icon: '▦' },
];

const ViewSwitcher: FC = () => {
  const current = useStore($viewMode);

  return (
    <div className="view-switcher">
      {VIEWS.map((v) => (
        <button
          key={v.id}
          className={`view-tab ${current === v.id ? 'active' : ''}`}
          onClick={() => setView(v.id)}
          type="button"
        >
          <span className="view-icon">{v.icon}</span>
          {v.label}
        </button>
      ))}
    </div>
  );
};

export default ViewSwitcher;
