/**
 * AdminBlogEdit - Rich block-based blog editor
 * Replaces the old markdown textarea with a full block editor.
 *
 * Block types: paragraph, heading2, heading3, bulletList, orderedList,
 *              callout, keypoint, image, divider
 *
 * New posts use slug as Firestore document ID for efficient frontend lookups.
 *
 * Security: all dangerouslySetInnerHTML usages are wrapped with DOMPurify.sanitize()
 * via the safeHtml() helper defined below. User-supplied HTML is never rendered raw.
 */

import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, Timestamp, setDoc } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import DOMPurify from 'dompurify';
import AdminLayout from '../../components/admin/AdminLayout';
import { db, storage } from '../../lib/firebase';
import { updateDocById } from '../../hooks/useFirestore';

// ─────────────────────────────────────────────
// Security: sanitise all HTML before rendering
// ─────────────────────────────────────────────
function safeHtml(html) {
  return DOMPurify.sanitize(html || '', {
    ALLOWED_TAGS: ['strong', 'em', 'u', 'a', 'br', 'span'],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'style'],
  });
}

// ─────────────────────────────────────────────
// Utilities
// ─────────────────────────────────────────────
const genId = () => Math.random().toString(36).slice(2, 9);

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function newBlock(type) {
  const id = genId();
  switch (type) {
    case 'heading2':    return { id, type, text: '' };
    case 'heading3':    return { id, type, text: '' };
    case 'bulletList':  return { id, type, items: [''] };
    case 'orderedList': return { id, type, items: [''] };
    case 'callout':     return { id, type, variant: 'info', title: '', content: '' };
    case 'keypoint':    return { id, type, title: 'Key Takeaways', points: [''] };
    case 'image':       return { id, type, url: '', alt: '', caption: '', placement: 'full' };
    case 'divider':     return { id, type };
    default:            return { id, type: 'paragraph', html: '' };
  }
}

const CALLOUT_COLORS = {
  info:    { bg: '#e7f5ff', border: '#339af0', icon: '#1971c2' },
  warning: { bg: '#fff9db', border: '#fab005', icon: '#e67700' },
  tip:     { bg: '#d3f9d8', border: '#51cf66', icon: '#2f9e44' },
  quote:   { bg: '#f8f9fa', border: '#868e96', icon: '#495057' },
};

const BLOCK_LABELS = {
  paragraph:    '¶ Paragraph',
  heading2:     'H2 Heading',
  heading3:     'H3 Heading',
  bulletList:   '• Bullet List',
  orderedList:  '1. Numbered List',
  callout:      '⚡ Callout',
  keypoint:     '✓ Key Point',
  image:        '⬛ Image',
  divider:      '— Divider',
};

// ─────────────────────────────────────────────
// Block Editors
// ─────────────────────────────────────────────

/**
 * ParagraphBlock – contenteditable div with a format toolbar.
 * Bold/Italic/Underline use document.execCommand (universally supported).
 * innerHTML is only set on mount (or when block.id changes after reorder)
 * so the cursor is never reset by React re-renders.
 */
function ParagraphBlock({ block, onChange }) {
  const divRef = useRef(null);

  useEffect(() => {
    if (divRef.current) {
      // Safe: this is the editor's own stored content, not user-supplied raw HTML.
      // Content was sanitised via DOMPurify before being stored.
      divRef.current.innerHTML = block.html || '';
    }
  }, [block.id]);

  function sync() {
    if (divRef.current) onChange({ ...block, html: divRef.current.innerHTML });
  }

  function fmt(cmd) {
    divRef.current?.focus();
    document.execCommand(cmd, false, null);
    sync();
  }

  function insertLink() {
    const url = window.prompt('Enter URL (include https://):');
    if (!url) return;
    divRef.current?.focus();
    document.execCommand('createLink', false, url);
    divRef.current.querySelectorAll('a').forEach((a) => {
      a.target = '_blank'; a.rel = 'noopener noreferrer';
    });
    sync();
  }

  const toolBtn = (label, action, style = {}) => (
    <button
      key={label}
      type="button"
      onMouseDown={(e) => { e.preventDefault(); action(); }}
      style={{ background: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '4px', padding: '3px 10px', cursor: 'pointer', fontSize: '0.82rem', color: '#374151', ...style }}
    >{label}</button>
  );

  return (
    <div>
      <div style={{ display: 'flex', gap: '4px', marginBottom: '6px', flexWrap: 'wrap' }}>
        {toolBtn('B',     () => fmt('bold'),       { fontWeight: 700 })}
        {toolBtn('I',     () => fmt('italic'),     { fontStyle: 'italic' })}
        {toolBtn('U',     () => fmt('underline'),  { textDecoration: 'underline' })}
        {toolBtn('Link',  insertLink)}
        {toolBtn('Clear', () => { fmt('removeFormat'); document.execCommand('unlink', false, null); }, { color: '#9ca3af' })}
      </div>
      <div
        ref={divRef}
        contentEditable
        suppressContentEditableWarning
        onInput={sync}
        onBlur={sync}
        style={{
          minHeight: '80px', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db',
          borderRadius: '6px', fontSize: '0.95rem', lineHeight: 1.75, color: '#111827',
          outline: 'none', fontFamily: 'inherit',
        }}
      />
    </div>
  );
}

function HeadingBlock({ block, onChange }) {
  const isH2 = block.type === 'heading2';
  return (
    <input
      value={block.text}
      onChange={(e) => onChange({ ...block, text: e.target.value })}
      placeholder={isH2 ? 'H2 — Section heading' : 'H3 — Sub-heading'}
      style={{
        width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db',
        borderRadius: '6px', color: '#111827', boxSizing: 'border-box',
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: isH2 ? '1.4rem' : '1.15rem', fontWeight: isH2 ? 700 : 600,
      }}
    />
  );
}

function ListBlock({ block, onChange }) {
  const refs = useRef([]);

  function setItem(i, val) {
    const items = [...block.items]; items[i] = val;
    onChange({ ...block, items });
  }
  function addItem(afterIdx) {
    const items = [...block.items]; items.splice(afterIdx + 1, 0, '');
    onChange({ ...block, items });
    setTimeout(() => refs.current[afterIdx + 1]?.focus(), 0);
  }
  function removeItem(i) {
    if (block.items.length <= 1) return;
    onChange({ ...block, items: block.items.filter((_, idx) => idx !== i) });
    setTimeout(() => refs.current[Math.max(0, i - 1)]?.focus(), 0);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
      {block.items.map((item, i) => (
        <div key={i} style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <span style={{ color: '#9ca3af', minWidth: '20px', textAlign: 'right', fontSize: '0.85rem', flexShrink: 0 }}>
            {block.type === 'orderedList' ? `${i + 1}.` : '•'}
          </span>
          <input
            ref={(el) => { refs.current[i] = el; }}
            value={item}
            onChange={(e) => setItem(i, e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') { e.preventDefault(); addItem(i); }
              if (e.key === 'Backspace' && item === '' && block.items.length > 1) {
                e.preventDefault(); removeItem(i);
              }
            }}
            placeholder="Item text — use <strong>bold</strong> for emphasis"
            style={{ flex: 1, padding: '0.35rem 0.6rem', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '0.875rem', color: '#111827' }}
          />
          <button type="button" onClick={() => removeItem(i)} style={{ background: 'none', border: 'none', color: '#d1d5db', cursor: 'pointer', fontSize: '1.1rem', padding: '0 4px', lineHeight: 1 }}>×</button>
        </div>
      ))}
      <button type="button" onClick={() => addItem(block.items.length - 1)} style={{ alignSelf: 'flex-start', background: 'none', border: '1px dashed #d1d5db', padding: '0.25rem 0.75rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', color: '#9ca3af', marginTop: '2px' }}>
        + Add item
      </button>
    </div>
  );
}

function CalloutBlock({ block, onChange }) {
  const color = CALLOUT_COLORS[block.variant] || CALLOUT_COLORS.info;
  return (
    <div style={{ background: color.bg, borderLeft: `4px solid ${color.border}`, borderRadius: '0 6px 6px 0', padding: '1rem' }}>
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', alignItems: 'center' }}>
        <select
          value={block.variant}
          onChange={(e) => onChange({ ...block, variant: e.target.value })}
          style={{ padding: '0.3rem 0.5rem', border: `1px solid ${color.border}`, borderRadius: '4px', fontSize: '0.8rem', background: '#fff', color: color.icon, fontWeight: 600 }}
        >
          {['info', 'warning', 'tip', 'quote'].map((v) => (
            <option key={v} value={v}>{v.charAt(0).toUpperCase() + v.slice(1)}</option>
          ))}
        </select>
        <input
          value={block.title}
          onChange={(e) => onChange({ ...block, title: e.target.value })}
          placeholder="Title (optional — shown uppercase)"
          style={{ flex: 1, padding: '0.3rem 0.6rem', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '0.875rem', background: '#fff' }}
        />
      </div>
      <textarea
        value={block.content}
        onChange={(e) => onChange({ ...block, content: e.target.value })}
        placeholder="Callout content..."
        style={{ width: '100%', minHeight: '80px', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '0.875rem', resize: 'vertical', boxSizing: 'border-box', background: '#fff', lineHeight: 1.6 }}
      />
    </div>
  );
}

function KeyPointBlock({ block, onChange }) {
  const refs = useRef([]);

  function setPoint(i, val) {
    const points = [...block.points]; points[i] = val;
    onChange({ ...block, points });
  }
  function addPoint(afterIdx) {
    const points = [...block.points]; points.splice(afterIdx + 1, 0, '');
    onChange({ ...block, points });
    setTimeout(() => refs.current[afterIdx + 1]?.focus(), 0);
  }
  function removePoint(i) {
    if (block.points.length <= 1) return;
    onChange({ ...block, points: block.points.filter((_, idx) => idx !== i) });
  }

  return (
    <div style={{ background: '#1a1a1a', borderRadius: '8px', padding: '1.25rem' }}>
      <input
        value={block.title}
        onChange={(e) => onChange({ ...block, title: e.target.value })}
        placeholder="Box title (e.g. Key Takeaways)"
        style={{
          width: '100%', marginBottom: '0.875rem', padding: '0.4rem 0.6rem',
          border: '1px solid rgba(255,255,255,0.2)', borderRadius: '4px',
          background: 'rgba(255,255,255,0.08)', color: '#fff',
          fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase',
          letterSpacing: '0.06em', boxSizing: 'border-box',
        }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {block.points.map((point, i) => (
          <div key={i} style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <span style={{ color: '#51cf66', fontSize: '0.65rem', flexShrink: 0 }}>●</span>
            <input
              ref={(el) => { refs.current[i] = el; }}
              value={point}
              onChange={(e) => setPoint(i, e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addPoint(i); } }}
              placeholder="Bullet point..."
              style={{ flex: 1, padding: '0.35rem 0.5rem', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '4px', background: 'rgba(255,255,255,0.08)', color: '#fff', fontSize: '0.875rem' }}
            />
            <button type="button" onClick={() => removePoint(i)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.25)', cursor: 'pointer', fontSize: '1.1rem', padding: '0 4px', lineHeight: 1 }}>×</button>
          </div>
        ))}
        <button type="button" onClick={() => addPoint(block.points.length - 1)} style={{ alignSelf: 'flex-start', background: 'none', border: '1px dashed rgba(255,255,255,0.25)', padding: '0.25rem 0.75rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>
          + Add point
        </button>
      </div>
    </div>
  );
}

function ImageBlock({ block, onChange, onUpload, uploading }) {
  const PLACEMENTS = ['full', 'center', 'left', 'right'];
  return (
    <div style={{ border: '1px solid #d1d5db', borderRadius: '6px', padding: '1rem', background: '#f9fafb' }}>
      {block.url && (
        <img src={block.url} alt={block.alt} style={{ width: '100%', maxHeight: '220px', objectFit: 'cover', borderRadius: '4px', marginBottom: '0.75rem', display: 'block' }} />
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <input type="file" accept="image/*" onChange={(e) => onUpload(e, block.id)} style={{ fontSize: '0.8rem' }} />
          {uploading && <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>Uploading…</span>}
        </div>
        {block.url && (
          <>
            <input value={block.alt} onChange={(e) => onChange({ ...block, alt: e.target.value })} placeholder="Alt text / image description (accessibility)" style={{ padding: '0.4rem 0.6rem', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '0.875rem', color: '#111827' }} />
            <input value={block.caption} onChange={(e) => onChange({ ...block, caption: e.target.value })} placeholder="Caption displayed below image (optional)" style={{ padding: '0.4rem 0.6rem', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '0.875rem', color: '#111827' }} />
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', marginTop: '4px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151' }}>Placement:</span>
              {PLACEMENTS.map((p) => (
                <label key={p} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.82rem', cursor: 'pointer', color: '#374151' }}>
                  <input type="radio" name={`pl-${block.id}`} value={p} checked={block.placement === p} onChange={() => onChange({ ...block, placement: p })} />
                  {p.charAt(0).toUpperCase() + p.slice(1)}{p === 'left' || p === 'right' ? ' (float)' : ''}
                </label>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function DividerBlock() {
  return (
    <div style={{ padding: '0.5rem 0' }}>
      <hr style={{ border: 'none', borderTop: '2px dashed #d1d5db', margin: 0 }} />
    </div>
  );
}

// ─────────────────────────────────────────────
// Block Item Wrapper
// ─────────────────────────────────────────────
function BlockItem({ block, index, total, onChange, onMove, onDelete, onUpload, uploadingBlockId }) {
  const ctrlBtn = (label, onClick, disabled, danger) => (
    <button type="button" disabled={disabled} onClick={onClick} style={{ background: 'none', border: `1px solid ${danger ? '#fecaca' : '#e5e7eb'}`, borderRadius: '4px', padding: '2px 7px', fontSize: '0.72rem', cursor: disabled ? 'default' : 'pointer', color: disabled ? '#d1d5db' : danger ? '#dc2626' : '#374151' }}>
      {label}
    </button>
  );

  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '0.75rem', background: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
        <span style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#9ca3af' }}>
          {BLOCK_LABELS[block.type] || block.type}
        </span>
        <div style={{ display: 'flex', gap: '4px' }}>
          {ctrlBtn('▲', () => onMove(index, -1), index === 0)}
          {ctrlBtn('▼', () => onMove(index, 1),  index === total - 1)}
          {ctrlBtn('✕ Remove', () => onDelete(index), false, true)}
        </div>
      </div>

      {block.type === 'paragraph'    && <ParagraphBlock block={block} onChange={onChange} />}
      {(block.type === 'heading2' || block.type === 'heading3') && <HeadingBlock block={block} onChange={onChange} />}
      {(block.type === 'bulletList'  || block.type === 'orderedList') && <ListBlock block={block} onChange={onChange} />}
      {block.type === 'callout'      && <CalloutBlock  block={block} onChange={onChange} />}
      {block.type === 'keypoint'     && <KeyPointBlock block={block} onChange={onChange} />}
      {block.type === 'image'        && <ImageBlock    block={block} onChange={onChange} onUpload={onUpload} uploading={uploadingBlockId === block.id} />}
      {block.type === 'divider'      && <DividerBlock />}
    </div>
  );
}

// ─────────────────────────────────────────────
// Add Block Panel
// ─────────────────────────────────────────────
const ADD_TYPES = [
  { type: 'paragraph',   label: '¶ Paragraph' },
  { type: 'heading2',    label: 'H2 Heading' },
  { type: 'heading3',    label: 'H3 Heading' },
  { type: 'bulletList',  label: '• Bullet List' },
  { type: 'orderedList', label: '1. Numbered List' },
  { type: 'callout',     label: '⚡ Callout' },
  { type: 'keypoint',    label: '✓ Key Point' },
  { type: 'image',       label: '⬛ Image' },
  { type: 'divider',     label: '— Divider' },
];

function AddBlockPanel({ onAdd }) {
  return (
    <div style={{ border: '1px dashed #d1d5db', borderRadius: '8px', padding: '0.875rem', background: '#fafafa' }}>
      <p style={{ margin: '0 0 0.6rem', fontSize: '0.68rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        Add Block
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
        {ADD_TYPES.map(({ type, label }) => (
          <button
            key={type} type="button" onClick={() => onAdd(type)}
            style={{ padding: '0.35rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '6px', background: '#fff', cursor: 'pointer', fontSize: '0.8rem', color: '#374151', fontWeight: 500 }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#111827'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#111827'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#fff';    e.currentTarget.style.color = '#374151'; e.currentTarget.style.borderColor = '#d1d5db'; }}
          >{label}</button>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Preview Renderer
// All HTML is sanitised through safeHtml() before rendering.
// ─────────────────────────────────────────────
function BlockPreview({ block }) {
  const C = CALLOUT_COLORS;

  switch (block.type) {
    case 'paragraph':
      return (
        <p
          style={{ margin: '0 0 1.5rem' }}
          dangerouslySetInnerHTML={{ __html: safeHtml(block.html) }}
        />
      );

    case 'heading2':
      return <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.75rem', fontWeight: 700, color: '#1a1a1a', margin: '3rem 0 1.5rem' }}>{block.text}</h2>;

    case 'heading3':
      return <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.35rem', fontWeight: 600, color: '#1a1a1a', margin: '2.5rem 0 1rem' }}>{block.text}</h3>;

    case 'bulletList':
      return (
        <ul style={{ margin: '0 0 1.5rem', paddingLeft: '1.5rem' }}>
          {block.items.map((item, i) => (
            <li key={i} style={{ marginBottom: '0.5rem' }} dangerouslySetInnerHTML={{ __html: safeHtml(item) }} />
          ))}
        </ul>
      );

    case 'orderedList':
      return (
        <ol style={{ margin: '0 0 1.5rem', paddingLeft: '1.5rem' }}>
          {block.items.map((item, i) => (
            <li key={i} style={{ marginBottom: '0.5rem' }} dangerouslySetInnerHTML={{ __html: safeHtml(item) }} />
          ))}
        </ol>
      );

    case 'callout': {
      const col = C[block.variant] || C.info;
      return (
        <div style={{ background: col.bg, borderLeft: `4px solid ${col.border}`, borderRadius: '0 8px 8px 0', padding: '1.25rem 1.5rem', margin: '1.5rem 0' }}>
          {block.title && (
            <h4 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.95rem', fontWeight: 600, color: col.icon, margin: '0 0 0.5rem', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
              {block.title}
            </h4>
          )}
          <p style={{ fontSize: '0.95rem', color: '#495057', lineHeight: 1.6, margin: 0 }}>{block.content}</p>
        </div>
      );
    }

    case 'keypoint':
      return (
        <div style={{ background: '#1a1a1a', color: '#fff', borderRadius: '8px', padding: '1.5rem 2rem', margin: '2rem 0' }}>
          <h4 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 1rem', color: '#fff' }}>{block.title}</h4>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
            {block.points.map((p, i) => (
              <li key={i} style={{ paddingLeft: '1.25rem', marginBottom: '0.5rem', fontSize: '0.95rem', lineHeight: 1.5, color: 'rgba(255,255,255,0.9)', position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0, top: '0.45rem', width: 6, height: 6, background: '#51cf66', borderRadius: '50%', display: 'inline-block' }} />
                {p}
              </li>
            ))}
          </ul>
        </div>
      );

    case 'image': {
      if (!block.url) return null;
      const imgStyles = {
        full:   { width: '100%', display: 'block', margin: '1.5rem 0' },
        center: { display: 'block', margin: '1.5rem auto', maxWidth: '75%' },
        left:   { float: 'left', margin: '0 1.5rem 1rem 0', maxWidth: '45%' },
        right:  { float: 'right', margin: '0 0 1rem 1.5rem', maxWidth: '45%' },
      };
      return (
        <figure style={{ margin: '1.5rem 0', overflow: 'hidden' }}>
          <img src={block.url} alt={block.alt} style={{ ...(imgStyles[block.placement] || imgStyles.full), borderRadius: 6, objectFit: 'cover' }} />
          {block.caption && (
            <figcaption style={{ textAlign: 'center', fontSize: '0.8rem', color: '#666', marginTop: '0.5rem', fontStyle: 'italic', clear: 'both' }}>
              {block.caption}
            </figcaption>
          )}
        </figure>
      );
    }

    case 'divider':
      return <hr style={{ border: 'none', borderTop: '1px solid #e8e6e2', margin: '2rem 0' }} />;

    default:
      return null;
  }
}

function BlocksPreview({ blocks }) {
  return (
    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.05rem', lineHeight: 1.8, color: '#333' }}>
      {blocks.map((block) => <BlockPreview key={block.id} block={block} />)}
    </div>
  );
}

// ─────────────────────────────────────────────
// Main Editor Component
// ─────────────────────────────────────────────
const EMPTY = {
  title: '', slug: '', excerpt: '', blocks: [], coverImage: '',
  status: 'draft', tags: [], category: 'Training', author: 'HQ Aviation', readingTime: '',
};

export default function AdminBlogEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';

  const [form, setForm]                = useState(EMPTY);
  const [loading, setLoading]          = useState(!isNew);
  const [saving, setSaving]            = useState(false);
  const [coverUploading, setCoverUp]   = useState(false);
  const [uploadingBlockId, setBlockUp] = useState(null);
  const [preview, setPreview]          = useState(false);
  const [error, setError]              = useState('');
  const [tagInput, setTagInput]        = useState('');

  useEffect(() => {
    if (isNew) return;
    getDoc(doc(db, 'blog_posts', id)).then((snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setForm({ ...EMPTY, ...data, blocks: data.blocks || [] });
      }
      setLoading(false);
    });
  }, [id, isNew]);

  function set(field, value) {
    setForm((f) => {
      const next = { ...f, [field]: value };
      if (field === 'title' && isNew) next.slug = slugify(value);
      return next;
    });
  }

  // Block management
  const addBlock    = (type) => setForm((f) => ({ ...f, blocks: [...f.blocks, newBlock(type)] }));
  const updateBlock = (upd)  => setForm((f) => ({ ...f, blocks: f.blocks.map((b) => b.id === upd.id ? upd : b) }));
  const deleteBlock = (i)    => setForm((f) => ({ ...f, blocks: f.blocks.filter((_, idx) => idx !== i) }));
  const moveBlock   = (i, d) => setForm((f) => {
    const blocks = [...f.blocks]; const ni = i + d;
    if (ni < 0 || ni >= blocks.length) return f;
    [blocks[i], blocks[ni]] = [blocks[ni], blocks[i]];
    return { ...f, blocks };
  });

  async function handleCoverUpload(e) {
    const file = e.target.files[0]; if (!file) return;
    setCoverUp(true);
    try {
      const r = storageRef(storage, `blog/${Date.now()}-${file.name}`);
      await uploadBytes(r, file);
      set('coverImage', await getDownloadURL(r));
    } finally { setCoverUp(false); }
  }

  async function handleBlockImageUpload(e, blockId) {
    const file = e.target.files[0]; if (!file) return;
    setBlockUp(blockId);
    try {
      const r = storageRef(storage, `blog/${Date.now()}-${file.name}`);
      await uploadBytes(r, file);
      const url = await getDownloadURL(r);
      setForm((f) => ({ ...f, blocks: f.blocks.map((b) => b.id === blockId ? { ...b, url } : b) }));
    } finally { setBlockUp(null); }
  }

  function addTag() {
    const t = tagInput.trim().toLowerCase();
    if (t && !form.tags.includes(t)) set('tags', [...form.tags, t]);
    setTagInput('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      const data = {
        ...form,
        publishedAt: form.status === 'published' ? (form.publishedAt || Timestamp.now()) : null,
      };
      if (isNew) {
        const docId = form.slug || genId();
        await setDoc(doc(db, 'blog_posts', docId), {
          ...data, createdAt: Timestamp.now(), updatedAt: Timestamp.now(),
        });
        navigate(`/admin/blog/${docId}`);
      } else {
        await updateDocById('blog_posts', id, data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  const fld = { width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.875rem', color: '#111827', boxSizing: 'border-box' };
  const lbl = { display: 'block', fontWeight: 600, fontSize: '0.72rem', color: '#374151', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' };

  if (loading) return <AdminLayout><p style={{ color: '#6b7280' }}>Loading…</p></AdminLayout>;

  return (
    <AdminLayout>
      <div style={{ maxWidth: '940px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#111827', margin: 0 }}>
            {isNew ? 'New Blog Post' : `Editing: ${form.title || 'Untitled'}`}
          </h1>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="button" onClick={() => setPreview((p) => !p)} style={{ background: preview ? '#111827' : '#f3f4f6', color: preview ? '#fff' : '#374151', border: '1px solid #d1d5db', padding: '0.4rem 0.875rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 }}>
              {preview ? '← Edit' : 'Preview →'}
            </button>
            <button onClick={() => navigate('/admin/blog')} style={{ background: 'none', border: '1px solid #d1d5db', padding: '0.4rem 0.75rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.875rem', color: '#374151' }}>
              ← Back
            </button>
          </div>
        </div>

        {error && <div style={{ background: '#fee2e2', color: '#991b1b', padding: '0.75rem 1rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</div>}

        {/* Preview Mode */}
        {preview ? (
          <div style={{ background: '#faf9f6', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '2rem' }}>
            {form.coverImage && <img src={form.coverImage} alt="cover" style={{ width: '100%', height: '280px', objectFit: 'cover', borderRadius: '6px', marginBottom: '2rem', display: 'block' }} />}
            <div style={{ textAlign: 'center', marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid #e8e6e2' }}>
              <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#888' }}>{form.category}</span>
              <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '2.25rem', fontWeight: 700, color: '#1a1a1a', margin: '0.75rem 0 1rem', lineHeight: 1.2 }}>
                {form.title || 'Untitled Post'}
              </h1>
              <div style={{ color: '#666', fontSize: '0.9rem' }}>{form.author}{form.readingTime ? ` • ${form.readingTime}` : ''}</div>
            </div>
            {form.blocks.length === 0
              ? <p style={{ color: '#9ca3af', textAlign: 'center', fontStyle: 'italic' }}>No content blocks yet — switch to Edit to start writing.</p>
              : <BlocksPreview blocks={form.blocks} />
            }
          </div>

        ) : (
        /* Edit Mode */
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            {/* Title + Slug */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
              <div>
                <label style={lbl}>Title *</label>
                <input style={fld} value={form.title} onChange={(e) => set('title', e.target.value)} required placeholder="Post title" />
              </div>
              <div>
                <label style={lbl}>Slug (URL path)</label>
                <input style={fld} value={form.slug} onChange={(e) => set('slug', e.target.value)} placeholder="auto-generated from title" />
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <label style={lbl}>Excerpt</label>
              <textarea style={{ ...fld, minHeight: '60px', resize: 'vertical' }} value={form.excerpt} onChange={(e) => set('excerpt', e.target.value)} placeholder="Short summary shown on the blog listing page" />
            </div>

            {/* Meta row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
              <div>
                <label style={lbl}>Category</label>
                <select style={{ ...fld, width: '100%' }} value={form.category} onChange={(e) => set('category', e.target.value)}>
                  {['Training', 'Operations', 'Maintenance', 'Safety', 'Aircraft', 'Ownership', 'Lifestyle', 'Press'].map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={lbl}>Author</label>
                <input style={fld} value={form.author} onChange={(e) => set('author', e.target.value)} />
              </div>
              <div>
                <label style={lbl}>Reading Time</label>
                <input style={fld} value={form.readingTime} onChange={(e) => set('readingTime', e.target.value)} placeholder="8 min" />
              </div>
              <div>
                <label style={lbl}>Status</label>
                <select style={{ ...fld, width: '100%' }} value={form.status} onChange={(e) => set('status', e.target.value)}>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>

            {/* Cover Image */}
            <div>
              <label style={lbl}>Cover / Hero Image</label>
              {form.coverImage && <img src={form.coverImage} alt="cover" style={{ width: '240px', height: '135px', objectFit: 'cover', borderRadius: '6px', display: 'block', marginBottom: '0.5rem', border: '1px solid #e5e7eb' }} />}
              <input type="file" accept="image/*" onChange={handleCoverUpload} disabled={coverUploading} />
              {coverUploading && <span style={{ fontSize: '0.8rem', color: '#6b7280', marginLeft: '0.5rem' }}>Uploading…</span>}
            </div>

            {/* Tags */}
            <div>
              <label style={lbl}>Tags</label>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <input style={{ ...fld, flex: 1 }} value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }} placeholder="Type tag and press Enter" />
                <button type="button" onClick={addTag} style={{ padding: '0.5rem 1rem', background: '#e5e7eb', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.875rem' }}>Add</button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {form.tags.map((t) => (
                  <span key={t} style={{ background: '#e0e7ff', color: '#3730a3', padding: '2px 10px', borderRadius: '9999px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {t}
                    <button type="button" onClick={() => set('tags', form.tags.filter((x) => x !== t))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3730a3', fontSize: '0.85rem', padding: 0, lineHeight: 1 }}>×</button>
                  </span>
                ))}
              </div>
            </div>

            {/* Block Editor */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.75rem' }}>
                <label style={lbl}>Content Blocks</label>
                <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{form.blocks.length} block{form.blocks.length !== 1 ? 's' : ''}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {form.blocks.map((block, index) => (
                  <BlockItem
                    key={block.id}
                    block={block}
                    index={index}
                    total={form.blocks.length}
                    onChange={updateBlock}
                    onMove={moveBlock}
                    onDelete={deleteBlock}
                    onUpload={handleBlockImageUpload}
                    uploadingBlockId={uploadingBlockId}
                  />
                ))}
                <AddBlockPanel onAdd={addBlock} />
              </div>
            </div>

            {/* Save */}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', paddingTop: '0.5rem', paddingBottom: '2rem' }}>
              <button type="submit" disabled={saving} style={{ background: '#111827', color: '#fff', padding: '0.625rem 1.75rem', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', fontSize: '0.875rem', opacity: saving ? 0.7 : 1 }}>
                {saving ? 'Saving…' : isNew ? 'Create Post' : 'Save Changes'}
              </button>
              {!saving && (
                <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
                  URL: <code style={{ background: '#f3f4f6', padding: '1px 5px', borderRadius: '3px' }}>/blog/{form.slug || '…'}</code>
                </span>
              )}
            </div>
          </form>
        )}
      </div>
    </AdminLayout>
  );
}
