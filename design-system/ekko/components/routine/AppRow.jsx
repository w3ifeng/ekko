import React from 'react';
import { AppIcon } from '../display/AppIcon.jsx';
import { Switch } from '../forms/Switch.jsx';
export function AppRow({ name, glyph, tone, paused, onChange, last }) {
  return <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '11px 0', borderBottom: last ? 0 : '1px solid #edf0e9' }}>
    <AppIcon glyph={glyph} tone={tone} asleep={paused} />
    <span style={{ flex: 1, minWidth: 0 }}>
      <b style={{ display: 'block', font: 'var(--type-label)' }}>{name}</b>
      <small style={{ display: 'block', font: 'var(--type-caption)', color: paused ? 'var(--moss-600)' : 'var(--ink-400)', marginTop: 2 }}>{paused ? 'Sleeps in until your routine’s done' : 'Always awake'}</small>
    </span>
    <Switch checked={paused} onChange={onChange} label={'Pause ' + name} />
  </div>;
}
