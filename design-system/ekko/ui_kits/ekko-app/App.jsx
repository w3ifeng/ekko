(() => {
const { TabBar, Toast } = window.EkkoDesignSystem_6a2b75;
const INIT_APPS = [{ id: 'ig', name: 'Instagram', glyph: 'Ig', tone: 'clay', paused: true }, { id: 'tt', name: 'TikTok', glyph: 'Tt', tone: 'slate', paused: true }, { id: 'yt', name: 'YouTube', glyph: 'Yt', tone: 'lilac', paused: false }, { id: 'mail', name: 'Mail', glyph: '✉', tone: 'moss', paused: false }];
const INIT_STEPS = [{ id: 'brush', title: 'Brush teeth', icon: 'droplets', meta: 'about 2 min', required: true, done: false }, { id: 'water', title: 'Glass of water', icon: 'glass-water', meta: 'before coffee', required: true, done: false }, { id: 'ready', title: 'Get ready', icon: 'shirt', meta: 'take your time', required: true, done: false }, { id: 'skin', title: 'Skincare', icon: 'sparkles', meta: 'skip if you like', required: false, done: false }];
const INIT_FRIENDS = [{ id: 'j', name: 'Jamie', initial: 'J', tone: 'clay', streak: 6, done: true, at: '6:31' }, { id: 'a', name: 'Alex', initial: 'A', tone: 'sky', streak: 3, done: true, at: '6:48' }, { id: 'm', name: 'Mo', initial: 'M', tone: 'lilac', streak: 11, done: false }, { id: 'r', name: 'Riya', initial: 'R', tone: 'moss', streak: 0, done: false }];
const TABS = [{ id: 'today', label: 'Today', icon: 'sunrise' }, { id: 'circle', label: 'Circle', icon: 'users' }, { id: 'plan', label: 'Plan', icon: 'list-checks' }];
function App() {
  const [screen, setScreen] = React.useState(() => localStorage.getItem('ekko-kit-screen') || 'setup');
  const [apps, setApps] = React.useState(INIT_APPS); const [steps, setSteps] = React.useState(INIT_STEPS); const [friends, setFriends] = React.useState(INIT_FRIENDS);
  const [streak] = React.useState(5); const [streakEnded, setStreakEnded] = React.useState(false); const [sharing, setSharing] = React.useState(true);
  const [shieldMode, setShieldMode] = React.useState(null); const [t, setT] = React.useState(null);
  React.useEffect(() => { localStorage.setItem('ekko-kit-screen', screen); }, [screen]);
  const toast = (message, icon) => { setT({ message, icon, k: Date.now() }); setTimeout(() => setT(x => x && x.message === message ? null : x), 2200); };
  const go = s => setScreen(s);
  const tab = screen === 'circle' ? 'circle' : screen === 'plan' ? 'plan' : 'today';
  const dark = screen === 'shield';
  const showTabs = screen !== 'setup' && screen !== 'shield';
  let body;
  if (screen === 'setup' || screen === 'plan') body = <SetupScreen apps={apps} setApps={setApps} steps={steps} setSteps={setSteps} editing={screen === 'plan'} onDone={() => { go('today'); toast(screen === 'plan' ? 'Plan saved for tomorrow' : 'See you at 4:00 am', 'moon-star'); }} />;
  else if (screen === 'today') body = <TodayScreen steps={steps} setSteps={setSteps} apps={apps} streak={streak} streakEnded={streakEnded} onWake={() => go('unlocked')} onShield={m => { setShieldMode(m === 'peek' ? 'peek' : null); go('shield'); }} onSkip={() => { setStreakEnded(true); toast('Skipped today. Fresh start tomorrow.', 'sunrise'); }} />;
  else if (screen === 'shield') body = <ShieldScreen steps={steps} mode={shieldMode} onBack={() => go('today')} />;
  else if (screen === 'unlocked') body = <UnlockedScreen apps={apps} streak={streak} friends={friends} onCircle={() => go('circle')} onToday={() => go('today')} />;
  else body = <CircleScreen friends={friends} setFriends={setFriends} toast={toast} streak={streak} sharing={sharing} setSharing={setSharing} />;
  const jumps = [['setup', 'Set up'], ['today', 'Today'], ['shield', 'Shield'], ['unlocked', 'Unlocked'], ['circle', 'Circle']];
  return <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, padding: '24px 16px 40px' }}>
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>{jumps.map(([id, l]) => <button key={id} onClick={() => { if (id === 'unlocked') setSteps(steps.map(s => s.required ? { ...s, done: true } : s)); setShieldMode(null); go(id); }} style={{ border: '1px solid var(--border-subtle)', borderRadius: 999, padding: '8px 14px', background: screen === id ? 'var(--accent)' : 'var(--paper-0)', color: screen === id ? '#fff' : 'var(--text-2)', font: 'var(--fw-semibold) 13px/1 var(--font-body)', cursor: 'pointer' }}>{l}</button>)}</div>
    <Phone dark={dark} statusLight={screen === 'today' && !steps.filter(s => s.required).every(s => s.done)}>
      {body}
      {showTabs && <TabBar items={TABS} active={tab} onChange={id => go(id)} style={{ position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 20 }} />}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: showTabs ? 96 : 40, display: 'flex', justifyContent: 'center', zIndex: 50, pointerEvents: 'none' }}>{t && <Toast key={t.k} message={t.message} icon={t.icon} />}</div>
    </Phone>
  </div>;
}
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
})();
