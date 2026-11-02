import React, { useState } from 'react';
import { Icon } from './Icon.jsx';
export function IconButton({ icon, label, variant = 'soft', size = 44, onClick, style }) {
  const [p, setP] = useState(false);
  const bg = { soft: 'var(--surface-card)', ghost: 'transparent', night: '#ffffff1a', accent: 'var(--accent)' }[variant];
  const fg = { soft: 'var(--text-1)', ghost: 'var(--text-2)', night: '#fff', accent: '#fff' }[variant];
  return <button aria-label={label} onClick={onClick} onMouseDown={() => setP(true)} onMouseUp={() => setP(false)} onMouseLeave={() => setP(false)}
    style={{ width: size, height: size, borderRadius: 'var(--radius-pill)', border: variant === 'soft' ? '1px solid var(--border-subtle)' : '0', background: bg, color: fg, display: 'inline-grid', placeItems: 'center', cursor: 'pointer', transform: p ? 'scale(.92)' : 'none', transition: 'transform var(--dur-fast) var(--ease-out)', padding: 0, ...style }}>
    <Icon name={icon} size={Math.round(size * 0.45)} />
  </button>;
}
