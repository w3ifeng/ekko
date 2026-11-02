import React from 'react';
import { Icon } from '../core/Icon.jsx';
const T = { moss: ['var(--moss-100)', 'var(--moss-700)'], ember: ['var(--ember-100)', 'var(--ember-700)'], yolk: ['var(--yolk-100)', '#7a5a12'], sand: ['var(--sand-100)', 'var(--sand-700)'], night: ['#ffffff1a', '#ffffff'], neutral: ['var(--paper-200)', 'var(--text-2)'], solid: ['var(--accent)', '#fff'] };
export function Pill({ children, tone = 'moss', icon, size = 'md', style }) {
  const [bg, fg] = T[tone] || T.moss;
  return <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, borderRadius: 'var(--radius-pill)', background: bg, color: fg, padding: size === 'sm' ? '4px 8px' : '6px 11px', font: 'var(--fw-bold) ' + (size === 'sm' ? 11 : 12) + 'px/1.1 var(--font-body)', whiteSpace: 'nowrap', ...style }}>
    {icon && <Icon name={icon} size={size === 'sm' ? 12 : 14} />}{children}
  </span>;
}
