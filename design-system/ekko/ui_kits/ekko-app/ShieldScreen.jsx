(() => {
const { Button, AppIcon, Pill, Icon, Sunrise } = window.EkkoDesignSystem_6a2b75;
function ShieldScreen({ steps, mode, onBack }) {
  const req = steps.filter(s => s.required); const left = req.filter(s => !s.done);
  if (mode === 'peek') return <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, padding: 28, background: 'var(--moss-950)', color: '#fff', textAlign: 'center' }}>
    <div style={{ font: '750 88px/1 var(--font-display)', letterSpacing: '-.06em', fontVariantNumeric: 'tabular-nums', color: 'var(--yolk-400)' }}>4:59</div>
    <p style={{ font: 'var(--type-body)', color: 'var(--text-on-night-2)', margin: 0, maxWidth: 260 }}>Peek running. Instagram and TikTok go back to sleep when this hits zero.</p>
    <Button variant="night" onClick={onBack}>End peek early</Button>
  </div>;
  return <div style={{ position: 'absolute', inset: 0, background: 'var(--moss-950)', color: '#fff', display: 'flex', flexDirection: 'column', padding: '74px 22px 40px' }}>
    <div style={{ position: 'absolute', left: '50%', top: 180, width: 300, height: 300, marginLeft: -150, borderRadius: '50%', background: 'radial-gradient(circle,#386c5c66 0,transparent 70%)' }}></div>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 16, marginTop: 60, position: 'relative' }}>
      <AppIcon glyph="Tt" tone="night" size={84} />
      <Pill tone="night" icon="moon">Shielded by ekko</Pill>
      <h1 style={{ font: 'var(--type-display)', letterSpacing: 'var(--tracking-title)', margin: 0 }}>TikTok’s still<br /><span style={{ font: 'italic 400 50px/1 var(--font-accent)', color: 'var(--yolk-400)' }}>asleep.</span></h1>
      <p style={{ font: 'var(--type-body)', color: 'var(--text-on-night-2)', margin: 0, maxWidth: 280 }}>{left.length ? left.length + ' step' + (left.length > 1 ? 's' : '') + ' and it wakes up: ' + left.map(s => s.title.toLowerCase()).join(', ') + '.' : 'Your routine’s done — head back to ekko to wake it.'}</p>
    </div>
    <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 8, position: 'relative' }}>
      <Button block size="lg" variant="night" iconLeft="sunrise" onClick={onBack}>Open my routine</Button>
      <p style={{ font: 'var(--type-caption)', color: '#ffffff80', textAlign: 'center', margin: '6px 0 0' }}>Illustrative iOS shield. Real enforcement is still being validated.</p>
    </div>
  </div>;
}
window.ShieldScreen = ShieldScreen;
})();
