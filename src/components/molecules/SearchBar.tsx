import { type FC, useCallback, useRef, useState } from 'react';
import { useStore } from '@nanostores/react';
import { $searchResults, setSearch, selectNode } from '@stores/app';
import { SECTOR_BY_ID } from '@data/constants';

const SearchBar: FC = () => {
  const results = useStore($searchResults);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }, []);

  const onSelect = useCallback((id: string) => {
    selectNode(id);
    setSearch('');
    if (inputRef.current) inputRef.current.value = '';
    setFocused(false);
  }, []);

  return (
    <div className="search-container">
      <input
        ref={inputRef}
        className="search-input"
        type="text"
        placeholder="Search industries… (⌘K)"
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 200)}
      />
      {focused && results.length > 0 && (
        <div className="search-dropdown">
          {results.slice(0, 8).map((node) => {
            const sector = SECTOR_BY_ID.get(node.sector);
            return (
              <button
                key={node.id}
                className="search-result"
                onMouseDown={() => onSelect(node.id)}
                type="button"
              >
                <span className="result-dot" style={{ background: sector?.color }} />
                <span className="result-name">{node.label}</span>
                <span className="result-sector">{sector?.name}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
