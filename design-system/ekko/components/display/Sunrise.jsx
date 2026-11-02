import React from 'react';
export function Sunrise({ value = 0, width = 300, height = 150, night, children, style }) {
  const v = Math.max(0, Math.min(1, value)); const d = Math.round(height * 0.42); const hz = Math.round(height * 0.14);
  const sky = night ? 'linear-gradient(180deg,var(--moss-950),var(--moss-800))' : 'linear-gradient(180deg, color-mix(in oklch, var(--moss-800) ' + Math.round((1 - v) * 100) + '%, var(--yolk-100)), color-mix(in oklch, var(--moss-600) ' + Math.round((1 - v) * 70) + '%, var(--ember-100)))';
  const y0 = height - hz - d * 0.22, y1 = Math.max(48, height * 0.16); const y = y0 + (y1 - y0) * v;
  return <div style={{ position: 'relative', width, maxWidth: '100%', height, borderRadius: 'var(--radius-xl)', overflow: 'hidden', background: sky, transition: 'background var(--dur-sun) var(--ease-sun)', ...style }}>
    <div style={{ position: 'absolute', left: '74%', top: y, width: d, height: d, marginLeft: -d / 2, borderRadius: '50%', background: 'var(--sun-fill)', boxShadow: v > .05 ? 'var(--shadow-sun)' : 'none', transition: 'top var(--dur-sun) var(--ease-spring), box-shadow var(--dur-sun)' }}></div>
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: hz, background: night || v < 1 ? 'var(--moss-900)' : 'var(--moss-700)', transition: 'background var(--dur-sun)' }}></div>
    {children && <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '16px 18px ' + (hz + 14) + 'px', color: v > .6 && !night ? 'var(--moss-950)' : '#fff', background: v > .6 && !night ? 'none' : 'linear-gradient(180deg, transparent 30%, #17241eb3 100%)', transition: 'color var(--dur-sun)' }}>{children}</div>}
  </div>;
}
