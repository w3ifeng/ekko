(() => {
const { Sunrise, Button, AppIcon, StreakBadge, Card, Avatar } = window.EkkoDesignSystem_6a2b75;
function UnlockedScreen({ apps, streak, friends, onCircle, onToday }) {
  const [up, setUp] = React.useState(0);
  React.useEffect(() => { const t = setTimeout(() => setUp(1), 80); return () => clearTimeout(t); }, []);
  const doneFriends = friends.filter(f => f.done);
  return <ScreenScroll pad={false} style={{ background: 'var(--surface-sunrise)' }}>
    <Sunrise value={up} width="100%" height={380} style={{ borderRadius: '0 0 32px 32px' }}>
      <div>
        <div style={{ font: 'var(--type-eyebrow)', letterSpacing: 'var(--tracking-eyebrow)', textTransform: 'uppercase', color: 'var(--ember-700)', marginBottom: 8 }}>7:05 am · morning done</div>
        <h1 style={{ font: 'var(--type-display)', letterSpacing: 'var(--tracking-title)', margin: 0, color: 'var(--moss-950)' }}>Morning first.<br /><span style={{ font: 'italic 400 50px/1 var(--font-accent)', color: 'var(--ember-600)' }}>Then the feed.</span></h1>
      </div>
    </Sunrise>
    <div style={{ padding: '20px 18px 120px', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Card variant="raised" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div><div style={{ font: 'var(--type-caption)', color: 'var(--text-3)', marginBottom: 6 }}>Streak</div><StreakBadge count={streak + 1} size="lg" /></div>
        <div style={{ display: 'flex', gap: 6 }}>{Array.from({ length: 7 }).map((_, i) => <span key={i} style={{ width: 14, height: 34, borderRadius: 7, background: i < 6 ? 'var(--ember-500)' : 'var(--paper-300)', opacity: i < 6 ? .35 + i * .13 : 1 }}></span>)}</div>
      </Card>
      <Card variant="raised">
        <div style={{ font: 'var(--type-caption)', color: 'var(--text-3)', marginBottom: 10 }}>Awake now</div>
        <div style={{ display: 'flex', gap: 10 }}>{apps.filter(a => a.paused).map(a => <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}><AppIcon glyph={a.glyph} tone={a.tone} /><b style={{ font: 'var(--type-label)' }}>{a.name}</b></div>)}</div>
      </Card>
      <Card variant="raised" onClick={onCircle} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ display: 'flex' }}>{doneFriends.map((f, i) => <Avatar key={f.id} initial={f.initial} tone={f.tone} done size={32} style={{ marginLeft: i ? -6 : 0 }} />)}</div>
        <span style={{ flex: 1, font: 'var(--type-small)' }}><b>{doneFriends.map(f => f.name).join(' & ')}</b> are up too.</span>
      </Card>
      <Button block size="lg" iconRight="arrow-right" onClick={onCircle}>Cheer on your circle</Button>
      <Button block variant="ghost" onClick={onToday}>Back to today</Button>
    </div>
  </ScreenScroll>;
}
window.UnlockedScreen = UnlockedScreen;
})();
