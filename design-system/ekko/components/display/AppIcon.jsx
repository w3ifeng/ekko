import React from 'react';
const T = { clay: ['#f0e5dd', '#914f37'], slate: ['#e8eaf2', '#33384a'], moss: ['#e3eee8', '#36705b'], sky: ['var(--sky-200)', 'var(--sky-700)'], lilac: ['var(--lilac-200)', 'var(--lilac-700)'], yolk: ['var(--yolk-100)', '#7a5a12'], night: ['#ffffff1a', '#fff'] };
export function AppIcon({ glyph, tone = 'clay', size = 36, asleep, style }) {
  const [bg, fg] = T[tone] || T.clay;
  return <span style={{ position: 'relative', width: size, height: size, borderRadius: Math.round(size / 3), background: bg, color: fg, display: 'grid', placeItems: 'center', font: 'var(--fw-black) ' + Math.round(size * 0.42) + 'px/1 var(--font-display)', flex: 'none', filter: asleep ? 'grayscale(.6)' : 'none', opacity: asleep ? .75 : 1, ...style }}>
    {glyph}
    {asleep && <span style={{ position: 'absolute', right: -4, top: -4, width: 16, height: 16, borderRadius: 8, background: 'var(--moss-800)', color: '#fff', font: '800 9px/16px var(--font-body)', textAlign: 'center', border: '2px solid var(--surface-card)' }}>z</span>}
  </span>;
}
