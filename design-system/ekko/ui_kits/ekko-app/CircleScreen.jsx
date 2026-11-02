(() => {
const { Card, FriendRow, Switch, Pill, Button, StreakBadge } = window.EkkoDesignSystem_6a2b75;
function CircleScreen({ friends, setFriends, toast, streak, sharing, setSharing }) {
  const cheer = f => { setFriends(friends.map(x => x.id === f.id ? { ...x, cheered: !x.cheered } : x)); if (!f.cheered) toast('Cheer sent to ' + f.name, 'heart'); };
  const up = friends.filter(f => f.done); const asleep = friends.filter(f => !f.done);
  return <ScreenScroll>
    <Eyebrow>Your circle</Eyebrow>
    <h1 style={{ font: 'var(--type-title)', letterSpacing: 'var(--tracking-title)', margin: '8px 0 6px' }}>You’ve got <span style={{ font: 'italic 400 34px/1 var(--font-accent)', color: 'var(--ember-600)' }}>company.</span></h1>
    <p style={{ font: 'var(--type-body)', color: 'var(--text-3)', margin: '0 0 18px' }}>{up.length} of {friends.length} friends are up and done.</p>
    <div style={{ font: 'var(--type-caption)', color: 'var(--text-3)', margin: '0 2px 8px' }}>Up and done</div>
    <Card padding="2px 16px" style={{ marginBottom: 14 }}>{up.map((f, i) => <FriendRow key={f.id} {...f} status={'Done at ' + f.at} onCheer={() => cheer(f)} last={i === up.length - 1} />)}</Card>
    <div style={{ font: 'var(--type-caption)', color: 'var(--text-3)', margin: '0 2px 8px' }}>Still snoozing</div>
    <Card padding="2px 16px" style={{ marginBottom: 14 }}>{asleep.map((f, i) => <FriendRow key={f.id} {...f} status="Hasn’t started yet" onCheer={() => cheer(f)} last={i === asleep.length - 1} />)}</Card>
    <Card variant="soft" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <span style={{ flex: 1, font: 'var(--type-small)', color: 'var(--moss-800)' }}><b>Share my mornings</b><br />Friends see if you finished and your streak. Never your apps or your list.</span>
      <Switch checked={sharing} onChange={setSharing} label="Share my mornings" />
    </Card>
    <div style={{ marginTop: 14 }}><Button block variant="secondary" iconLeft="user-plus">Invite a friend</Button></div>
  </ScreenScroll>;
}
window.CircleScreen = CircleScreen;
})();
