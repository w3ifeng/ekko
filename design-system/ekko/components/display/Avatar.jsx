import React from 'react';
const T = { clay: ['var(--clay-200)', 'var(--clay-700)'], sky: ['var(--sky-200)', 'var(--sky-700)'], moss: ['var(--moss-200)', 'var(--moss-700)'], lilac: ['var(--lilac-200)', 'var(--lilac-700)'], yolk: ['var(--yolk-200)', '#6d4f0d'] };
export function Avatar({ initial, tone = 'clay', size = 36, done, style }) {
  const [bg, fg] = T[tone] || T.clay;
  return <span style={{ width: size, height: size, borderRadius: '50%', background: bg, color: fg, display: 'grid', placeItems: 'center', font: 'var(--fw-black) ' + Math.round(size * .42) + 'px/1 var(--font-display)', flex: 'none', boxShadow: done ? '0 0 0 2px var(--surface-card), 0 0 0 4px var(--yolk-400)' : 'none', ...style }}>{initial}</span>;
}
