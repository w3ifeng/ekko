import React from 'react';
import { Avatar } from '../display/Avatar.jsx';
import { StreakBadge } from '../display/StreakBadge.jsx';
import { IconButton } from '../core/IconButton.jsx';
export function FriendRow({ name, initial, tone, streak, done, status, cheered, onCheer, last }) {
  return <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 0', borderBottom: last ? 0 : '1px solid #edf0e9' }}>
    <Avatar initial={initial} tone={tone} done={done} />
    <span style={{ flex: 1, minWidth: 0 }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><b style={{ font: 'var(--type-label)' }}>{name}</b>{streak != null && <StreakBadge count={streak} />}</span>
      <small style={{ display: 'block', font: 'var(--type-caption)', color: 'var(--ink-400)', marginTop: 2 }}>{status || (done ? 'Up and done' : 'Still snoozing')}</small>
    </span>
    {onCheer && <IconButton icon={cheered ? 'heart-handshake' : 'heart'} label={'Cheer ' + name} variant={cheered ? 'accent' : 'soft'} size={40} onClick={onCheer} />}
  </div>;
}
