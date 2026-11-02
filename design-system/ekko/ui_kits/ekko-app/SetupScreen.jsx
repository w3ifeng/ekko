(() => {
const { Card, AppRow, Segmented, Button, Pill, Icon, IconButton } = window.EkkoDesignSystem_6a2b75;
function SetupScreen({ apps, setApps, steps, setSteps, onDone, editing }) {
  const toggleApp = (id, v) => setApps(apps.map(a => a.id === id ? { ...a, paused: v } : a));
  const setRule = (id, r) => setSteps(steps.map(s => s.id === id ? { ...s, required: r === 'Required' } : s));
  const paused = apps.filter(a => a.paused).length; const req = steps.filter(s => s.required).length;
  return <ScreenScroll>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '6px 0 18px' }}>
      <span style={{ font: '800 24px/1 var(--font-display)', letterSpacing: '-.06em', color: 'var(--moss-700)' }}>ekko</span>
      {editing ? <Pill icon="pencil" tone="neutral" size="sm">Changes start tomorrow</Pill> : <Pill tone="moss" size="sm">Step 1 of 1</Pill>}
    </div>
    <h1 style={{ font: 'var(--type-title)', letterSpacing: 'var(--tracking-title)', margin: '0 0 8px' }}>What should <span style={{ font: 'italic 400 34px/1 var(--font-accent)', letterSpacing: '-.01em', color: 'var(--ember-600)' }}>sleep in</span> until you’re up?</h1>
    <p style={{ font: 'var(--type-body)', color: 'var(--text-3)', margin: '0 0 18px' }}>These apps doze off at 4:00 every morning and wake up when your routine’s done.</p>
    <Card padding="4px 16px" style={{ marginBottom: 12 }}>
      {apps.map((a, i) => <AppRow key={a.id} name={a.name} glyph={a.glyph} tone={a.tone} paused={a.paused} onChange={v => toggleApp(a.id, v)} last={i === apps.length - 1} />)}
    </Card>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', margin: '22px 2px 10px' }}>
      <b style={{ font: 'var(--type-subhead)' }}>Your morning</b><span style={{ font: 'var(--type-caption)', color: 'var(--text-3)' }}>{req} required</span>
    </div>
    <Card padding="4px 16px" style={{ marginBottom: 12 }}>
      {steps.map((s, i) => <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 0', borderBottom: i === steps.length - 1 ? 0 : '1px solid #edf0e9' }}>
        <span style={{ width: 38, height: 38, borderRadius: 12, background: 'var(--paper-100)', display: 'grid', placeItems: 'center', color: 'var(--text-2)' }}><Icon name={s.icon} size={19} /></span>
        <b style={{ flex: 1, font: 'var(--type-label)' }}>{s.title}</b>
        <Segmented options={['Required', 'Optional']} value={s.required ? 'Required' : 'Optional'} onChange={r => setRule(s.id, r)} />
      </div>)}
      <button style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '12px 0', border: 0, borderTop: '1px solid #edf0e9', background: 'none', color: 'var(--text-accent)', font: 'var(--type-label)', cursor: 'pointer' }}><Icon name="plus" size={18} />Add a step</button>
    </Card>
    <Card variant="soft" style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
      <Icon name="moon-star" size={22} color="var(--moss-700)" />
      <span style={{ font: 'var(--type-small)', color: 'var(--moss-800)' }}><b>Lights out at 4:00 am.</b> {paused} app{paused === 1 ? '' : 's'} stay asleep until your required steps are ticked — or you choose a way out.</span>
    </Card>
    <div style={{ marginTop: 18 }}><Button block size="lg" iconRight="arrow-right" disabled={!paused || !req} onClick={onDone}>{editing ? 'Save plan' : 'Save my morning'}</Button></div>
  </ScreenScroll>;
}
window.SetupScreen = SetupScreen;
})();
