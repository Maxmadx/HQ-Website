import { useMemo, useState } from 'react';
import { IMAGE_PATHS } from './imagePickerList';

export default function ImagePicker() {
  const [query, setQuery] = useState('');
  const [folder, setFolder] = useState('all');
  const [selected, setSelected] = useState(null);

  const folders = useMemo(() => {
    const set = new Set();
    IMAGE_PATHS.forEach((p) => {
      const parts = p.replace('/assets/images/', '').split('/');
      if (parts.length > 1) set.add(parts[0]);
    });
    return ['all', ...Array.from(set).sort()];
  }, []);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return IMAGE_PATHS.filter((p) => {
      if (folder !== 'all' && !p.includes(`/assets/images/${folder}/`)) return false;
      if (q && !p.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [query, folder]);

  const copy = (path) => {
    navigator.clipboard?.writeText(path);
    setSelected(path);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#1a1a1a', color: '#fff', fontFamily: "'Space Grotesk', sans-serif", padding: '2rem' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '1.5rem', margin: '0 0 0.25rem', textTransform: 'uppercase', letterSpacing: '-0.01em' }}>Image Picker</h1>
        <p style={{ color: '#999', fontSize: '0.85rem', margin: '0 0 1.5rem' }}>{IMAGE_PATHS.length} images in <code>/public/assets/images</code>. Click a tile to copy its path.</p>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by filename / path…"
            style={{ flex: 1, minWidth: '260px', padding: '0.55rem 0.85rem', borderRadius: '4px', border: '1px solid #333', background: '#222', color: '#fff', fontSize: '0.85rem', fontFamily: 'inherit', outline: 'none' }}
          />
          <select
            value={folder}
            onChange={(e) => setFolder(e.target.value)}
            style={{ padding: '0.55rem 0.85rem', borderRadius: '4px', border: '1px solid #333', background: '#222', color: '#fff', fontSize: '0.85rem', fontFamily: 'inherit' }}
          >
            {folders.map((f) => (
              <option key={f} value={f}>{f === 'all' ? `All folders (${IMAGE_PATHS.length})` : f}</option>
            ))}
          </select>
        </div>

        {selected && (
          <div style={{ background: '#0e3', color: '#000', padding: '0.85rem 1rem', borderRadius: '4px', marginBottom: '1rem', fontFamily: 'monospace', fontSize: '0.8rem', wordBreak: 'break-all' }}>
            <strong>Copied:</strong> {selected}
          </div>
        )}

        <p style={{ color: '#777', fontSize: '0.75rem', margin: '0 0 0.75rem' }}>{visible.length} match{visible.length === 1 ? '' : 'es'}</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.75rem' }}>
          {visible.map((path) => (
            <button
              key={path}
              onClick={() => copy(path)}
              title="Click to copy path"
              style={{ background: '#222', border: selected === path ? '2px solid #0e3' : '1px solid #333', borderRadius: '6px', overflow: 'hidden', cursor: 'pointer', padding: 0, color: '#fff', textAlign: 'left', fontFamily: 'inherit' }}
            >
              <div style={{ aspectRatio: '4 / 3', background: `url(${path}) center / cover`, backgroundColor: '#111' }} />
              <div style={{ padding: '0.5rem 0.6rem', fontSize: '0.65rem', fontFamily: 'monospace', color: '#bbb', wordBreak: 'break-all', lineHeight: 1.3 }}>
                {path.replace('/assets/images/', '')}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
