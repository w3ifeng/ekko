import React from 'react';
import { Icon } from '../core/Icon.jsx';
export function Toast({ message, icon = 'sparkles', visible = true, style }) {
  return <div role="status" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '11px 16px 11px 12px', borderRadius: 'var(--radius-pill)', background: 'var(--moss-900)', color: '#fff', font: 'var(--fw-semibold) 13px/1.2 var(--font-body)', boxShadow: 'var(--shadow-float)', opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(10px) scale(.96)', transition: 'all var(--dur-base) var(--ease-spring)', ...style }}>
    <span style={{ width: 26, height: 26, borderRadius: 13, background: 'var(--yolk-400)', color: 'var(--moss-950)', display: 'grid', placeItems: 'center' }}><Icon name={icon} size={14} /></span>{message}
  </div>;
}
