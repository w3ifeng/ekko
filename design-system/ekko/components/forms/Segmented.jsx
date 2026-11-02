import React from 'react';
export function Segmented({ options, value, onChange, size = 'sm', style }) {
  return <div role="radiogroup" style={{ display: 'inline-flex', background: 'var(--paper-200)', borderRadius: 'var(--radius-pill)', padding: 3, gap: 2, ...style }}>
    {options.map(o => { const v = typeof o === 'string' ? o : o.value; const l = typeof o === 'string' ? o : o.label; const a = v === value;
      return <button key={v} role="radio" aria-checked={a} onClick={() => onChange && onChange(v)} style={{ border: 0, borderRadius: 'var(--radius-pill)', padding: size === 'sm' ? '6px 11px' : '9px 16px', background: a ? 'var(--surface-card)' : 'transparent', boxShadow: a ? '0 1px 4px #1f30291f' : 'none', color: a ? 'var(--text-1)' : 'var(--text-3)', font: 'var(--fw-bold) ' + (size === 'sm' ? 12 : 14) + 'px/1 var(--font-body)', cursor: 'pointer', transition: 'all var(--dur-fast) var(--ease-out)' }}>{l}</button>; })}
  </div>;
}
