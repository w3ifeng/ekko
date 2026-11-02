import React, { useState } from 'react';
import { Icon } from './Icon.jsx';
const V = {
  primary: { bg: 'var(--accent)', hover: 'var(--accent-hover)', fg: 'var(--on-accent)', border: 'transparent' },
  secondary: { bg: 'var(--surface-card)', hover: 'var(--paper-100)', fg: 'var(--text-1)', border: 'var(--border-strong)' },
  ghost: { bg: 'transparent', hover: 'var(--moss-50)', fg: 'var(--text-accent)', border: 'transparent' },
  sunrise: { bg: 'var(--yolk-400)', hover: 'var(--yolk-500)', fg: 'var(--moss-950)', border: 'transparent' },
  night: { bg: 'var(--paper-0)', hover: 'var(--moss-100)', fg: 'var(--moss-900)', border: 'transparent' },
  danger: { bg: 'var(--danger-100)', hover: '#f0d2cb', fg: 'var(--danger-600)', border: 'transparent' },
};
const S = { sm: { h: 36, px: 14, fs: 13, r: 'var(--radius-sm)' }, md: { h: 48, px: 18, fs: 15, r: 'var(--radius-md)' }, lg: { h: 56, px: 22, fs: 16, r: 'var(--radius-lg)' } };
export function Button({ children, variant = 'primary', size = 'md', block, pill, disabled, iconLeft, iconRight, onClick, style, type = 'button' }) {
  const [h, setH] = useState(false); const [p, setP] = useState(false);
  const v = V[variant] || V.primary; const s = S[size] || S.md;
  return <button type={type} disabled={disabled} onClick={onClick}
    onMouseEnter={() => setH(true)} onMouseLeave={() => { setH(false); setP(false); }} onMouseDown={() => setP(true)} onMouseUp={() => setP(false)}
    style={{ display: block ? 'flex' : 'inline-flex', width: block ? '100%' : undefined, alignItems: 'center', justifyContent: 'center', gap: 8, height: s.h, padding: '0 ' + s.px + 'px', borderRadius: pill ? 'var(--radius-pill)' : s.r,
      border: '1px solid ' + (disabled ? 'transparent' : v.border), background: disabled ? 'var(--disabled-bg)' : (h ? v.hover : v.bg), color: disabled ? 'var(--disabled-fg)' : v.fg,
      font: 'var(--fw-bold) ' + s.fs + 'px/1 var(--font-body)', letterSpacing: '-.005em', cursor: disabled ? 'not-allowed' : 'pointer',
      transform: p && !disabled ? 'scale(var(--press-scale))' : 'none', transition: 'background var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out)', whiteSpace: 'nowrap', ...style }}>
    {iconLeft && <Icon name={iconLeft} size={s.fs + 3} />}{children}{iconRight && <Icon name={iconRight} size={s.fs + 3} />}
  </button>;
}
