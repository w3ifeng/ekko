import React from 'react';
import { Icon } from '../core/Icon.jsx';
export function ChoiceCard({ title, description, icon, selected, tone = 'moss', onClick }) {
  const sel = tone === 'danger' ? ['var(--danger-600)', 'var(--danger-100)'] : ['var(--moss-500)', 'var(--moss-50)'];
  return <button onClick={onClick} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8, textAlign: 'left', width: '100%', padding: 14, borderRadius: 'var(--radius-md)', border: '1.5px solid ' + (selected ? sel[0] : 'var(--border-subtle)'), background: selected ? sel[1] : 'var(--surface-card)', cursor: 'pointer', transition: 'all var(--dur-fast) var(--ease-out)', color: 'var(--text-1)' }}>
    {icon && <Icon name={icon} size={20} color={selected ? sel[0] : 'var(--text-3)'} />}
    <b style={{ font: 'var(--fw-bold) 14px/1.2 var(--font-body)' }}>{title}</b>
    {description && <small style={{ font: 'var(--type-caption)', color: 'var(--text-3)' }}>{description}</small>}
  </button>;
}
