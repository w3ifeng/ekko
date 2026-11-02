import React from 'react';
export function Sheet({ open, title, children, onClose }) {
  return <div style={{ position: 'absolute', inset: 0, zIndex: 40, pointerEvents: open ? 'auto' : 'none' }}>
    <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: '#17241e66', opacity: open ? 1 : 0, transition: 'opacity var(--dur-base) var(--ease-out)' }}></div>
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, background: 'var(--surface-screen)', borderRadius: '28px 28px 0 0', padding: '10px 20px 28px', transform: open ? 'none' : 'translateY(105%)', transition: 'transform 380ms var(--ease-out)', boxShadow: 'var(--shadow-float)' }}>
      <div style={{ width: 40, height: 5, borderRadius: 3, background: 'var(--paper-400)', margin: '0 auto 16px' }}></div>
      {title && <h3 style={{ font: 'var(--type-heading)', letterSpacing: 'var(--tracking-heading)', margin: '0 0 12px' }}>{title}</h3>}
      {children}
    </div>
  </div>;
}
