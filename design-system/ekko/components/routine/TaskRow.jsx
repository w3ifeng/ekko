import React from 'react';
import { Checkbox } from '../forms/Checkbox.jsx';
import { Icon } from '../core/Icon.jsx';
export function TaskRow({ title, meta, icon, required = true, done, onToggle, last }) {
  return <div onClick={() => onToggle && onToggle(!done)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: last ? 0 : '1px solid #edf0e9', cursor: 'pointer', minHeight: 'var(--hit-min)' }}>
    {icon && <span style={{ width: 38, height: 38, borderRadius: 12, background: done ? 'var(--yolk-100)' : 'var(--paper-100)', color: done ? 'var(--ember-600)' : 'var(--text-2)', display: 'grid', placeItems: 'center', flex: 'none', transition: 'background var(--dur-base)' }}><Icon name={icon} size={19} /></span>}
    <span style={{ flex: 1, minWidth: 0 }}>
      <b style={{ display: 'block', font: 'var(--type-label)', color: done ? 'var(--text-3)' : 'var(--text-1)', textDecoration: done ? 'line-through' : 'none', textDecorationColor: 'var(--ink-300)' }}>{title}</b>
      <small style={{ display: 'block', font: 'var(--type-caption)', color: 'var(--ink-400)', marginTop: 2 }}>{required ? 'Required' : 'Optional'}{meta ? ' · ' + meta : ''}</small>
    </span>
    <Checkbox checked={done} onChange={onToggle} label={title} tone={required ? 'moss' : 'sun'} />
  </div>;
}
