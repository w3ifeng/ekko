import React from 'react';
import { Icon } from '../core/Icon.jsx';
export function TabBar({ items, active, onChange, night, style }) {
  return <nav style={{ display: 'flex', justifyContent: 'space-around', padding: '8px 10px 22px', background: night ? 'var(--glass-night)' : 'var(--glass-light)', backdropFilter: 'var(--blur-glass)', WebkitBackdropFilter: 'var(--blur-glass)', borderTop: '1px solid ' + (night ? '#ffffff14' : 'var(--border-subtle)'), ...style }}>
    {items.map(it => { const a = it.id === active; const c = night ? (a ? '#fff' : '#ffffff80') : (a ? 'var(--text-accent)' : 'var(--ink-400)');
      return <button key={it.id} onClick={() => onChange && onChange(it.id)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, minWidth: 64, minHeight: 'var(--hit-min)', border: 0, background: 'none', color: c, cursor: 'pointer', font: 'var(--fw-bold) 11px/1 var(--font-body)', padding: '4px 0' }}>
        <Icon name={it.icon} size={22} />{it.label}
      </button>; })}
  </nav>;
}
