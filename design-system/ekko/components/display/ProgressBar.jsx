import React from 'react';
export function ProgressBar({ value = 0, tone = 'moss', height = 8, style }) {
  const fill = tone === 'sun' ? 'linear-gradient(90deg,var(--yolk-400),var(--ember-500))' : 'var(--moss-500)';
  return <div style={{ height, background: tone === 'night' ? '#ffffff22' : '#e6e9e2', borderRadius: 20, overflow: 'hidden', ...style }}>
    <span style={{ display: 'block', height: '100%', width: Math.max(0, Math.min(1, value)) * 100 + '%', background: tone === 'night' ? 'var(--yolk-400)' : fill, borderRadius: 20, transition: 'width var(--dur-base) var(--ease-out)' }}></span>
  </div>;
}
