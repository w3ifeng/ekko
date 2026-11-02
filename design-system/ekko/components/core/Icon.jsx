import React from 'react';
export function Icon({ name, size = 20, color, strokeless, style, ...rest }) {
  return <i className={'icon-' + name} aria-hidden="true" style={{ fontSize: size, width: size, height: size, lineHeight: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: color || 'currentColor', flex: 'none', ...style }} {...rest}></i>;
}
