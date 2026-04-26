import { useState, useMemo } from 'react';
import ProvenanceBadge from './ProvenanceBadge';
import { CLASSES } from '../../lib/comparablesSchema';

export default function ComparisonSelector({ comparables, selectedIds, onAdd, onRemove, max = 3 }) {
  const [searchQ, setSearchQ] = useState('');

  const robinsons = useMemo(
    () => comparables.filter((c) => c.isRobinson),
    [comparables],
  );

  const nonRobinsonResults = useMemo(() => {
    if (!searchQ.trim()) return [];
    const q = searchQ.trim().toLowerCase();
    return comparables
      .filter((c) => !c.isRobinson)
      .filter(
        (c) =>
          c.model?.toLowerCase().includes(q) ||
          c.displayName?.toLowerCase().includes(q) ||
          c.manufacturer?.toLowerCase().includes(q),
      );
  }, [comparables, searchQ]);

  const groupedResults = useMemo(() => {
    const groups = new Map(CLASSES.map((c) => [c.id, []]));
    for (const r of nonRobinsonResults) {
      if (groups.has(r.class)) groups.get(r.class).push(r);
    }
    return CLASSES.filter(({ id }) => groups.get(id).length).map(({ id, label }) => ({
      label,
      items: groups.get(id),
    }));
  }, [nonRobinsonResults]);

  const isSelected = (id) => selectedIds.includes(id);
  const atMax = selectedIds.length >= max;

  function handleChip(id) {
    if (isSelected(id)) onRemove(id);
    else if (!atMax) onAdd(id);
  }

  function handlePick(id) {
    setSearchQ('');
    if (!isSelected(id) && !atMax) onAdd(id);
  }

  return (
    <div className="comparison-selector">
      <div className="comparison-selector__group-label">Robinson lineup</div>
      <div className="comparison-selector__chips">
        {robinsons.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => handleChip(r.id)}
            disabled={!isSelected(r.id) && atMax}
            className={`comparison-selector__chip ${isSelected(r.id) ? 'is-selected' : ''}`}
          >
            {r.displayName || r.model}
            {isSelected(r.id) && <span aria-hidden="true"> ✓</span>}
          </button>
        ))}
      </div>

      <div className="comparison-selector__search-wrap">
        <input
          type="text"
          value={searchQ}
          onChange={(e) => setSearchQ(e.target.value)}
          placeholder="Compare against another aircraft (e.g. Bell 505, AS350)…"
          className="comparison-selector__search"
          aria-label="Search aircraft"
        />
        {groupedResults.length > 0 && (
          <div className="comparison-selector__dropdown" role="listbox">
            {groupedResults.map((group) => (
              <div key={group.label} className="comparison-selector__group">
                <div className="comparison-selector__group-heading">{group.label}</div>
                {group.items.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    role="option"
                    aria-selected={isSelected(c.id)}
                    disabled={isSelected(c.id) || atMax}
                    onClick={() => handlePick(c.id)}
                    className="comparison-selector__pick"
                  >
                    <span>{c.model}</span>
                    {c.marketStatus === 'used-only' && (
                      <span className="comparison-selector__used-tag">used market</span>
                    )}
                    <ProvenanceBadge confidence={c.costsConfidence} source={c.costsSource} />
                  </button>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedIds.filter((id) => !robinsons.some((r) => r.id === id)).length > 0 && (
        <div className="comparison-selector__pills">
          {selectedIds
            .map((id) => comparables.find((c) => c.id === id))
            .filter((c) => c && !c.isRobinson)
            .map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => onRemove(c.id)}
                className="comparison-selector__pill"
                aria-label={`Remove ${c.model}`}
              >
                {c.model} · <ProvenanceBadge confidence={c.costsConfidence} /> <span aria-hidden="true">✕</span>
              </button>
            ))}
        </div>
      )}

      {atMax && (
        <p className="comparison-selector__limit-note">Up to 3 aircraft. Remove one to add another.</p>
      )}
    </div>
  );
}
