(() => {
const { Icon } = window.EkkoDesignSystem_6a2b75;
function Phone({ children, dark, statusLight, time = '6:52' }) {
  return <div style={{ width: 390, height: 844, background: '#111714', borderRadius: 54, padding: 11, boxShadow: 'var(--shadow-device)', flex: 'none' }}>
    <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: 44, overflow: 'hidden', background: dark ? 'var(--moss-950)' : 'var(--surface-screen)', transition: 'background var(--dur-slow)' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 50, zIndex: 30, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 30px 0', color: dark || statusLight ? '#fff' : 'var(--text-1)', font: '650 15px/1 var(--font-body)', pointerEvents: 'none' }}>
        <span>{time}</span><span style={{ width: 110, height: 32, borderRadius: 18, background: '#000', position: 'absolute', left: '50%', marginLeft: -55, top: 10 }}></span>
        <span style={{ display: 'flex', gap: 5 }}><Icon name="signal" size={15} /><Icon name="wifi" size={15} /><Icon name="battery-full" size={17} /></span>
      </div>
      {children}
    </div>
  </div>;
}
function ScreenScroll({ children, pad = true, style }) {
  return <div style={{ position: 'absolute', inset: 0, overflowY: 'auto', padding: pad ? '58px 18px 110px' : 0, scrollbarWidth: 'none', ...style }}>{children}</div>;
}
function Eyebrow({ children, color = 'var(--moss-600)' }) {
  return <div style={{ font: 'var(--type-eyebrow)', letterSpacing: 'var(--tracking-eyebrow)', textTransform: 'uppercase', color }}>{children}</div>;
}
Object.assign(window, { Phone, ScreenScroll, Eyebrow });
})();
