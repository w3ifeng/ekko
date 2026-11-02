import React from 'react';
import { Icon } from '../core/Icon.jsx';
export function Checkbox({ checked, onChange, size = 28, tone = 'moss', label, style }) {
  const on = tone === 'sun' ? 'var(--yolk-400)' : 'var(--accent)';
  return <button role="checkbox" aria-checked={!!checked} aria-label={label} onClick={() => onChange && onChange(!checked)}
    style={{ width: size, height: size, borderRadius: '50%', border: checked ? '0' : '2px solid var(--paper-400)', background: checked ? on : 'var(--surface-card)', color: tone === 'sun' ? 'var(--moss-950)' : '#fff', display: 'grid', placeItems: 'center', padding: 0, cursor: 'pointer', flex: 'none', transform: checked ? 'scale(1)' : 'scale(.94)', transition: 'all var(--dur-base) var(--ease-spring)', ...style }}>
    {checked && <Icon name="check" size={Math.round(size * .6)} />}
  </button>;
}
