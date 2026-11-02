(() => {
const { Sunrise, Card, TaskRow, Button, Pill, ProgressBar, Sheet, ChoiceCard, StreakBadge, AppIcon } = window.EkkoDesignSystem_6a2b75;
function TodayScreen({ steps, setSteps, apps, streak, streakEnded, onWake, onShield, onSkip }) {
  const [sheet, setSheet] = React.useState(false); const [choice, setChoice] = React.useState('peek');
  const req = steps.filter(s => s.required); const done = req.filter(s => s.done).length; const all = req.length > 0 && done === req.length;
  const v = req.length ? done / req.length : 1; const left = req.length - done;
  const paused = apps.filter(a => a.paused);
  return <>
    <ScreenScroll pad={false}>
      <Sunrise value={v} width="100%" height={330} style={{ borderRadius: '0 0 32px 32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 10 }}>
          <div>
            <Pill tone={all ? 'yolk' : 'night'} icon={all ? 'sun' : 'moon'} style={{ marginBottom: 12 }}>{all ? 'Apps can wake up' : paused.length + ' apps asleep since 4:00'}</Pill>
            <h1 style={{ font: 'var(--type-display)', letterSpacing: 'var(--tracking-title)', margin: 0, color: 'inherit' }}>Good <span style={{ font: 'italic 400 48px/1 var(--font-accent)', color: v > .6 ? 'var(--ember-600)' : 'var(--yolk-200)', letterSpacing: '-.01em' }}>morning,</span><br />Sam.</h1>
          </div>
          
        </div>
      </Sunrise>
      <div style={{ padding: '18px 18px 120px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <b style={{ font: 'var(--type-subhead)' }}>{all ? 'All done. Nice one.' : left === 1 ? 'One more step' : left + ' steps till the sun’s up'}</b>
          {streakEnded ? <Pill tone="neutral" size="sm">Streak restarts tomorrow</Pill> : <StreakBadge count={all ? streak + 1 : streak} />}
        </div>
        <ProgressBar value={v} tone="sun" style={{ marginBottom: 12 }} />
        <Card padding="2px 16px">
          {steps.map((s, i) => <TaskRow key={s.id} icon={s.icon} title={s.title} meta={s.meta} required={s.required} done={s.done} last={i === steps.length - 1} onToggle={d => setSteps(steps.map(x => x.id === s.id ? { ...x, done: d } : x))} />)}
        </Card>
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Button block size="lg" variant={all ? 'sunrise' : 'primary'} iconLeft={all ? 'sunrise' : 'lock'} disabled={!all} onClick={onWake}>{all ? 'Wake my apps' : left + ' to go'}</Button>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
            <Button variant="ghost" size="sm" onClick={() => setSheet(true)}>Need access now?</Button>
            <Button variant="ghost" size="sm" onClick={onShield}>Try opening TikTok</Button>
          </div>
        </div>
      </div>
    </ScreenScroll>
    <Sheet open={sheet} title="Real life happens." onClose={() => setSheet(false)}>
      <p style={{ font: 'var(--type-small)', color: 'var(--text-3)', margin: '-4px 0 14px' }}>Pick a way out. No judgement — just know what each one costs.</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
        <ChoiceCard icon="timer" title="5-minute peek" description="Apps nap again after. Streak safe." selected={choice === 'peek'} onClick={() => setChoice('peek')} />
        <ChoiceCard icon="flame-kindling" tone="danger" title="Skip today" description={'Ends your ' + streak + '-day streak.'} selected={choice === 'skip'} onClick={() => setChoice('skip')} />
      </div>
      <Button block variant={choice === 'skip' ? 'danger' : 'primary'} onClick={() => { setSheet(false); if (choice === 'skip') onSkip(); else onShield('peek'); }}>{choice === 'skip' ? 'Skip today' : 'Start my 5 minutes'}</Button>
      <p style={{ font: 'var(--type-caption)', color: 'var(--ink-400)', textAlign: 'center', margin: '12px 0 0' }}>Peek length and daily allowance are still being decided.</p>
    </Sheet>
  </>;
}
window.TodayScreen = TodayScreen;
})();
