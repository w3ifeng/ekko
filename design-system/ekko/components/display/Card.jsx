import React from 'react';
const V = {
  default: { background: 'var(--surface-card)', border: '1px solid #e9ebe4', color: 'var(--text-1)' },
  soft: { background: 'var(--surface-soft)', border: '1px solid transparent', color: 'var(--text-1)' },
  muted: { background: 'var(--surface-muted)', border: '1px solid transparent', color: 'var(--text-1)' },
  night: { background: 'var(--surface-night)', border: '1px solid transparent', color: 'var(--text-on-night)' },
  sunrise: { background: 'var(--surface-sunrise)', border: '1px solid var(--yolk-200)', color: 'var(--text-1)' },
  raised: { background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', color: 'var(--text-1)', boxShadow: 'var(--shadow-card)' },
};
export function Card({ children, variant = 'default', padding = 16, radius = 'var(--radius-lg)', style, onClick }) {
  return <div onClick={onClick} style={{ borderRadius: radius, padding, ...(V[variant] || V.default), cursor: onClick ? 'pointer' : undefined, ...style }}>{children}</div>;
}
