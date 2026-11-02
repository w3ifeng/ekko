import React from 'react';
export function Switch({ checked, onChange, disabled, label, style }) {
  return <button role="switch" aria-checked={!!checked} aria-label={label} disabled={disabled} onClick={() => onChange && onChange(!checked)}
    style={{ width: 50, height: 30, borderRadius: 15, border: 0, padding: 3, background: checked ? 'var(--accent)' : 'var(--paper-400)', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? .5 : 1, transition: 'background var(--dur-base) var(--ease-out)', flex: 'none', ...style }}>
    <span style={{ display: 'block', width: 24, height: 24, borderRadius: 12, background: '#fff', boxShadow: '0 2px 6px #1f302933', transform: checked ? 'translateX(20px)' : 'none', transition: 'transform var(--dur-base) var(--ease-spring)' }}></span>
  </button>;
}
