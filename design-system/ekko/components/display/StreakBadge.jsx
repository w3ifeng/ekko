import React from 'react';
import { Icon } from '../core/Icon.jsx';
export function StreakBadge({ count, size = 'md', ended, style }) {
  const big = size === 'lg';
  return <span style={{ display: 'inline-flex', alignItems: 'center', gap: big ? 6 : 3, color: ended ? 'var(--text-3)' : 'var(--streak-text)', font: 'var(--fw-bold) ' + (big ? 28 : 12) + 'px/1 var(--font-display)', letterSpacing: big ? '-.03em' : 0, whiteSpace: 'nowrap', flex: 'none', ...style }}>
    <Icon name="flame" size={big ? 26 : 13} color={ended ? 'var(--ink-300)' : 'var(--streak)'} /><span>{count}{!big && <span style={{ fontWeight: 650, fontFamily: 'var(--font-body)' }}>-day</span>}</span>
  </span>;
}
