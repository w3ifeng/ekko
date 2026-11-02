/* @ds-bundle: {"format":4,"namespace":"EkkoDesignSystem_6a2b75","components":[{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Icon","sourcePath":"components/core/Icon.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"AppIcon","sourcePath":"components/display/AppIcon.jsx"},{"name":"Avatar","sourcePath":"components/display/Avatar.jsx"},{"name":"Card","sourcePath":"components/display/Card.jsx"},{"name":"Pill","sourcePath":"components/display/Pill.jsx"},{"name":"ProgressBar","sourcePath":"components/display/ProgressBar.jsx"},{"name":"StreakBadge","sourcePath":"components/display/StreakBadge.jsx"},{"name":"Sunrise","sourcePath":"components/display/Sunrise.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Segmented","sourcePath":"components/forms/Segmented.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"TabBar","sourcePath":"components/navigation/TabBar.jsx"},{"name":"Sheet","sourcePath":"components/overlay/Sheet.jsx"},{"name":"Toast","sourcePath":"components/overlay/Toast.jsx"},{"name":"AppRow","sourcePath":"components/routine/AppRow.jsx"},{"name":"ChoiceCard","sourcePath":"components/routine/ChoiceCard.jsx"},{"name":"FriendRow","sourcePath":"components/routine/FriendRow.jsx"},{"name":"TaskRow","sourcePath":"components/routine/TaskRow.jsx"}],"sourceHashes":{"components/core/Button.jsx":"6a54867589f2","components/core/Icon.jsx":"08b690d5d539","components/core/IconButton.jsx":"185fd8e40904","components/display/AppIcon.jsx":"c4321ec14755","components/display/Avatar.jsx":"326d1d202d76","components/display/Card.jsx":"31bc1981d6e1","components/display/Pill.jsx":"c75c378832ae","components/display/ProgressBar.jsx":"494beeeb2550","components/display/StreakBadge.jsx":"058a1cfe9ccf","components/display/Sunrise.jsx":"a5e65d58d930","components/forms/Checkbox.jsx":"67b618eee3f2","components/forms/Segmented.jsx":"258c0d1d5d6c","components/forms/Switch.jsx":"3c5297cdcddb","components/navigation/TabBar.jsx":"146a8816c8b3","components/overlay/Sheet.jsx":"f3998429bafc","components/overlay/Toast.jsx":"60eb9887f952","components/routine/AppRow.jsx":"93ca3e868a01","components/routine/ChoiceCard.jsx":"24b86b2857e9","components/routine/FriendRow.jsx":"1d831d86ae90","components/routine/TaskRow.jsx":"2e70eea09513","ui_kits/ekko-app/App.jsx":"3f3efcaa99fa","ui_kits/ekko-app/CircleScreen.jsx":"8c2d06dd15bd","ui_kits/ekko-app/Phone.jsx":"285f90a2b7cd","ui_kits/ekko-app/SetupScreen.jsx":"e36089f82284","ui_kits/ekko-app/ShieldScreen.jsx":"d7cb81fb0303","ui_kits/ekko-app/TodayScreen.jsx":"24a925cff5dd","ui_kits/ekko-app/UnlockedScreen.jsx":"34930fe9b411"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.EkkoDesignSystem_6a2b75 = window.EkkoDesignSystem_6a2b75 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Icon({
  name,
  size = 20,
  color,
  strokeless,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("i", _extends({
    className: 'icon-' + name,
    "aria-hidden": "true",
    style: {
      fontSize: size,
      width: size,
      height: size,
      lineHeight: 1,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: color || 'currentColor',
      flex: 'none',
      ...style
    }
  }, rest));
}
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Icon.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
const {
  useState
} = React;
const V = {
  primary: {
    bg: 'var(--accent)',
    hover: 'var(--accent-hover)',
    fg: 'var(--on-accent)',
    border: 'transparent'
  },
  secondary: {
    bg: 'var(--surface-card)',
    hover: 'var(--paper-100)',
    fg: 'var(--text-1)',
    border: 'var(--border-strong)'
  },
  ghost: {
    bg: 'transparent',
    hover: 'var(--moss-50)',
    fg: 'var(--text-accent)',
    border: 'transparent'
  },
  sunrise: {
    bg: 'var(--yolk-400)',
    hover: 'var(--yolk-500)',
    fg: 'var(--moss-950)',
    border: 'transparent'
  },
  night: {
    bg: 'var(--paper-0)',
    hover: 'var(--moss-100)',
    fg: 'var(--moss-900)',
    border: 'transparent'
  },
  danger: {
    bg: 'var(--danger-100)',
    hover: '#f0d2cb',
    fg: 'var(--danger-600)',
    border: 'transparent'
  }
};
const S = {
  sm: {
    h: 36,
    px: 14,
    fs: 13,
    r: 'var(--radius-sm)'
  },
  md: {
    h: 48,
    px: 18,
    fs: 15,
    r: 'var(--radius-md)'
  },
  lg: {
    h: 56,
    px: 22,
    fs: 16,
    r: 'var(--radius-lg)'
  }
};
function Button({
  children,
  variant = 'primary',
  size = 'md',
  block,
  pill,
  disabled,
  iconLeft,
  iconRight,
  onClick,
  style,
  type = 'button'
}) {
  const [h, setH] = useState(false);
  const [p, setP] = useState(false);
  const v = V[variant] || V.primary;
  const s = S[size] || S.md;
  return /*#__PURE__*/React.createElement("button", {
    type: type,
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => {
      setH(false);
      setP(false);
    },
    onMouseDown: () => setP(true),
    onMouseUp: () => setP(false),
    style: {
      display: block ? 'flex' : 'inline-flex',
      width: block ? '100%' : undefined,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      height: s.h,
      padding: '0 ' + s.px + 'px',
      borderRadius: pill ? 'var(--radius-pill)' : s.r,
      border: '1px solid ' + (disabled ? 'transparent' : v.border),
      background: disabled ? 'var(--disabled-bg)' : h ? v.hover : v.bg,
      color: disabled ? 'var(--disabled-fg)' : v.fg,
      font: 'var(--fw-bold) ' + s.fs + 'px/1 var(--font-body)',
      letterSpacing: '-.005em',
      cursor: disabled ? 'not-allowed' : 'pointer',
      transform: p && !disabled ? 'scale(var(--press-scale))' : 'none',
      transition: 'background var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out)',
      whiteSpace: 'nowrap',
      ...style
    }
  }, iconLeft && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: iconLeft,
    size: s.fs + 3
  }), children, iconRight && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: iconRight,
    size: s.fs + 3
  }));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
const {
  useState
} = React;
function IconButton({
  icon,
  label,
  variant = 'soft',
  size = 44,
  onClick,
  style
}) {
  const [p, setP] = useState(false);
  const bg = {
    soft: 'var(--surface-card)',
    ghost: 'transparent',
    night: '#ffffff1a',
    accent: 'var(--accent)'
  }[variant];
  const fg = {
    soft: 'var(--text-1)',
    ghost: 'var(--text-2)',
    night: '#fff',
    accent: '#fff'
  }[variant];
  return /*#__PURE__*/React.createElement("button", {
    "aria-label": label,
    onClick: onClick,
    onMouseDown: () => setP(true),
    onMouseUp: () => setP(false),
    onMouseLeave: () => setP(false),
    style: {
      width: size,
      height: size,
      borderRadius: 'var(--radius-pill)',
      border: variant === 'soft' ? '1px solid var(--border-subtle)' : '0',
      background: bg,
      color: fg,
      display: 'inline-grid',
      placeItems: 'center',
      cursor: 'pointer',
      transform: p ? 'scale(.92)' : 'none',
      transition: 'transform var(--dur-fast) var(--ease-out)',
      padding: 0,
      ...style
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: Math.round(size * 0.45)
  }));
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/display/AppIcon.jsx
try { (() => {
const T = {
  clay: ['#f0e5dd', '#914f37'],
  slate: ['#e8eaf2', '#33384a'],
  moss: ['#e3eee8', '#36705b'],
  sky: ['var(--sky-200)', 'var(--sky-700)'],
  lilac: ['var(--lilac-200)', 'var(--lilac-700)'],
  yolk: ['var(--yolk-100)', '#7a5a12'],
  night: ['#ffffff1a', '#fff']
};
function AppIcon({
  glyph,
  tone = 'clay',
  size = 36,
  asleep,
  style
}) {
  const [bg, fg] = T[tone] || T.clay;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      width: size,
      height: size,
      borderRadius: Math.round(size / 3),
      background: bg,
      color: fg,
      display: 'grid',
      placeItems: 'center',
      font: 'var(--fw-black) ' + Math.round(size * 0.42) + 'px/1 var(--font-display)',
      flex: 'none',
      filter: asleep ? 'grayscale(.6)' : 'none',
      opacity: asleep ? .75 : 1,
      ...style
    }
  }, glyph, asleep && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      right: -4,
      top: -4,
      width: 16,
      height: 16,
      borderRadius: 8,
      background: 'var(--moss-800)',
      color: '#fff',
      font: '800 9px/16px var(--font-body)',
      textAlign: 'center',
      border: '2px solid var(--surface-card)'
    }
  }, "z"));
}
Object.assign(__ds_scope, { AppIcon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/AppIcon.jsx", error: String((e && e.message) || e) }); }

// components/display/Avatar.jsx
try { (() => {
const T = {
  clay: ['var(--clay-200)', 'var(--clay-700)'],
  sky: ['var(--sky-200)', 'var(--sky-700)'],
  moss: ['var(--moss-200)', 'var(--moss-700)'],
  lilac: ['var(--lilac-200)', 'var(--lilac-700)'],
  yolk: ['var(--yolk-200)', '#6d4f0d']
};
function Avatar({
  initial,
  tone = 'clay',
  size = 36,
  done,
  style
}) {
  const [bg, fg] = T[tone] || T.clay;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      width: size,
      height: size,
      borderRadius: '50%',
      background: bg,
      color: fg,
      display: 'grid',
      placeItems: 'center',
      font: 'var(--fw-black) ' + Math.round(size * .42) + 'px/1 var(--font-display)',
      flex: 'none',
      boxShadow: done ? '0 0 0 2px var(--surface-card), 0 0 0 4px var(--yolk-400)' : 'none',
      ...style
    }
  }, initial);
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/display/Card.jsx
try { (() => {
const V = {
  default: {
    background: 'var(--surface-card)',
    border: '1px solid #e9ebe4',
    color: 'var(--text-1)'
  },
  soft: {
    background: 'var(--surface-soft)',
    border: '1px solid transparent',
    color: 'var(--text-1)'
  },
  muted: {
    background: 'var(--surface-muted)',
    border: '1px solid transparent',
    color: 'var(--text-1)'
  },
  night: {
    background: 'var(--surface-night)',
    border: '1px solid transparent',
    color: 'var(--text-on-night)'
  },
  sunrise: {
    background: 'var(--surface-sunrise)',
    border: '1px solid var(--yolk-200)',
    color: 'var(--text-1)'
  },
  raised: {
    background: 'var(--surface-card)',
    border: '1px solid var(--border-subtle)',
    color: 'var(--text-1)',
    boxShadow: 'var(--shadow-card)'
  }
};
function Card({
  children,
  variant = 'default',
  padding = 16,
  radius = 'var(--radius-lg)',
  style,
  onClick
}) {
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    style: {
      borderRadius: radius,
      padding,
      ...(V[variant] || V.default),
      cursor: onClick ? 'pointer' : undefined,
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Card.jsx", error: String((e && e.message) || e) }); }

// components/display/Pill.jsx
try { (() => {
const T = {
  moss: ['var(--moss-100)', 'var(--moss-700)'],
  ember: ['var(--ember-100)', 'var(--ember-700)'],
  yolk: ['var(--yolk-100)', '#7a5a12'],
  sand: ['var(--sand-100)', 'var(--sand-700)'],
  night: ['#ffffff1a', '#ffffff'],
  neutral: ['var(--paper-200)', 'var(--text-2)'],
  solid: ['var(--accent)', '#fff']
};
function Pill({
  children,
  tone = 'moss',
  icon,
  size = 'md',
  style
}) {
  const [bg, fg] = T[tone] || T.moss;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      borderRadius: 'var(--radius-pill)',
      background: bg,
      color: fg,
      padding: size === 'sm' ? '4px 8px' : '6px 11px',
      font: 'var(--fw-bold) ' + (size === 'sm' ? 11 : 12) + 'px/1.1 var(--font-body)',
      whiteSpace: 'nowrap',
      ...style
    }
  }, icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: size === 'sm' ? 12 : 14
  }), children);
}
Object.assign(__ds_scope, { Pill });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Pill.jsx", error: String((e && e.message) || e) }); }

// components/display/ProgressBar.jsx
try { (() => {
function ProgressBar({
  value = 0,
  tone = 'moss',
  height = 8,
  style
}) {
  const fill = tone === 'sun' ? 'linear-gradient(90deg,var(--yolk-400),var(--ember-500))' : 'var(--moss-500)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height,
      background: tone === 'night' ? '#ffffff22' : '#e6e9e2',
      borderRadius: 20,
      overflow: 'hidden',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      height: '100%',
      width: Math.max(0, Math.min(1, value)) * 100 + '%',
      background: tone === 'night' ? 'var(--yolk-400)' : fill,
      borderRadius: 20,
      transition: 'width var(--dur-base) var(--ease-out)'
    }
  }));
}
Object.assign(__ds_scope, { ProgressBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/ProgressBar.jsx", error: String((e && e.message) || e) }); }

// components/display/StreakBadge.jsx
try { (() => {
function StreakBadge({
  count,
  size = 'md',
  ended,
  style
}) {
  const big = size === 'lg';
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: big ? 6 : 3,
      color: ended ? 'var(--text-3)' : 'var(--streak-text)',
      font: 'var(--fw-bold) ' + (big ? 28 : 12) + 'px/1 var(--font-display)',
      letterSpacing: big ? '-.03em' : 0,
      whiteSpace: 'nowrap',
      flex: 'none',
      ...style
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "flame",
    size: big ? 26 : 13,
    color: ended ? 'var(--ink-300)' : 'var(--streak)'
  }), /*#__PURE__*/React.createElement("span", null, count, !big && /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 650,
      fontFamily: 'var(--font-body)'
    }
  }, "-day")));
}
Object.assign(__ds_scope, { StreakBadge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/StreakBadge.jsx", error: String((e && e.message) || e) }); }

// components/display/Sunrise.jsx
try { (() => {
function Sunrise({
  value = 0,
  width = 300,
  height = 150,
  night,
  children,
  style
}) {
  const v = Math.max(0, Math.min(1, value));
  const d = Math.round(height * 0.42);
  const hz = Math.round(height * 0.14);
  const sky = night ? 'linear-gradient(180deg,var(--moss-950),var(--moss-800))' : 'linear-gradient(180deg, color-mix(in oklch, var(--moss-800) ' + Math.round((1 - v) * 100) + '%, var(--yolk-100)), color-mix(in oklch, var(--moss-600) ' + Math.round((1 - v) * 70) + '%, var(--ember-100)))';
  const y0 = height - hz - d * 0.22,
    y1 = Math.max(48, height * 0.16);
  const y = y0 + (y1 - y0) * v;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width,
      maxWidth: '100%',
      height,
      borderRadius: 'var(--radius-xl)',
      overflow: 'hidden',
      background: sky,
      transition: 'background var(--dur-sun) var(--ease-sun)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: '74%',
      top: y,
      width: d,
      height: d,
      marginLeft: -d / 2,
      borderRadius: '50%',
      background: 'var(--sun-fill)',
      boxShadow: v > .05 ? 'var(--shadow-sun)' : 'none',
      transition: 'top var(--dur-sun) var(--ease-spring), box-shadow var(--dur-sun)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      height: hz,
      background: night || v < 1 ? 'var(--moss-900)' : 'var(--moss-700)',
      transition: 'background var(--dur-sun)'
    }
  }), children && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      padding: '16px 18px ' + (hz + 14) + 'px',
      color: v > .6 && !night ? 'var(--moss-950)' : '#fff',
      background: v > .6 && !night ? 'none' : 'linear-gradient(180deg, transparent 30%, #17241eb3 100%)',
      transition: 'color var(--dur-sun)'
    }
  }, children));
}
Object.assign(__ds_scope, { Sunrise });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Sunrise.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function Checkbox({
  checked,
  onChange,
  size = 28,
  tone = 'moss',
  label,
  style
}) {
  const on = tone === 'sun' ? 'var(--yolk-400)' : 'var(--accent)';
  return /*#__PURE__*/React.createElement("button", {
    role: "checkbox",
    "aria-checked": !!checked,
    "aria-label": label,
    onClick: () => onChange && onChange(!checked),
    style: {
      width: size,
      height: size,
      borderRadius: '50%',
      border: checked ? '0' : '2px solid var(--paper-400)',
      background: checked ? on : 'var(--surface-card)',
      color: tone === 'sun' ? 'var(--moss-950)' : '#fff',
      display: 'grid',
      placeItems: 'center',
      padding: 0,
      cursor: 'pointer',
      flex: 'none',
      transform: checked ? 'scale(1)' : 'scale(.94)',
      transition: 'all var(--dur-base) var(--ease-spring)',
      ...style
    }
  }, checked && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "check",
    size: Math.round(size * .6)
  }));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Segmented.jsx
try { (() => {
function Segmented({
  options,
  value,
  onChange,
  size = 'sm',
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    role: "radiogroup",
    style: {
      display: 'inline-flex',
      background: 'var(--paper-200)',
      borderRadius: 'var(--radius-pill)',
      padding: 3,
      gap: 2,
      ...style
    }
  }, options.map(o => {
    const v = typeof o === 'string' ? o : o.value;
    const l = typeof o === 'string' ? o : o.label;
    const a = v === value;
    return /*#__PURE__*/React.createElement("button", {
      key: v,
      role: "radio",
      "aria-checked": a,
      onClick: () => onChange && onChange(v),
      style: {
        border: 0,
        borderRadius: 'var(--radius-pill)',
        padding: size === 'sm' ? '6px 11px' : '9px 16px',
        background: a ? 'var(--surface-card)' : 'transparent',
        boxShadow: a ? '0 1px 4px #1f30291f' : 'none',
        color: a ? 'var(--text-1)' : 'var(--text-3)',
        font: 'var(--fw-bold) ' + (size === 'sm' ? 12 : 14) + 'px/1 var(--font-body)',
        cursor: 'pointer',
        transition: 'all var(--dur-fast) var(--ease-out)'
      }
    }, l);
  }));
}
Object.assign(__ds_scope, { Segmented });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Segmented.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
function Switch({
  checked,
  onChange,
  disabled,
  label,
  style
}) {
  return /*#__PURE__*/React.createElement("button", {
    role: "switch",
    "aria-checked": !!checked,
    "aria-label": label,
    disabled: disabled,
    onClick: () => onChange && onChange(!checked),
    style: {
      width: 50,
      height: 30,
      borderRadius: 15,
      border: 0,
      padding: 3,
      background: checked ? 'var(--accent)' : 'var(--paper-400)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? .5 : 1,
      transition: 'background var(--dur-base) var(--ease-out)',
      flex: 'none',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      width: 24,
      height: 24,
      borderRadius: 12,
      background: '#fff',
      boxShadow: '0 2px 6px #1f302933',
      transform: checked ? 'translateX(20px)' : 'none',
      transition: 'transform var(--dur-base) var(--ease-spring)'
    }
  }));
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/navigation/TabBar.jsx
try { (() => {
function TabBar({
  items,
  active,
  onChange,
  night,
  style
}) {
  return /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      justifyContent: 'space-around',
      padding: '8px 10px 22px',
      background: night ? 'var(--glass-night)' : 'var(--glass-light)',
      backdropFilter: 'var(--blur-glass)',
      WebkitBackdropFilter: 'var(--blur-glass)',
      borderTop: '1px solid ' + (night ? '#ffffff14' : 'var(--border-subtle)'),
      ...style
    }
  }, items.map(it => {
    const a = it.id === active;
    const c = night ? a ? '#fff' : '#ffffff80' : a ? 'var(--text-accent)' : 'var(--ink-400)';
    return /*#__PURE__*/React.createElement("button", {
      key: it.id,
      onClick: () => onChange && onChange(it.id),
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        minWidth: 64,
        minHeight: 'var(--hit-min)',
        border: 0,
        background: 'none',
        color: c,
        cursor: 'pointer',
        font: 'var(--fw-bold) 11px/1 var(--font-body)',
        padding: '4px 0'
      }
    }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: it.icon,
      size: 22
    }), it.label);
  }));
}
Object.assign(__ds_scope, { TabBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/TabBar.jsx", error: String((e && e.message) || e) }); }

// components/overlay/Sheet.jsx
try { (() => {
function Sheet({
  open,
  title,
  children,
  onClose
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      zIndex: 40,
      pointerEvents: open ? 'auto' : 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'absolute',
      inset: 0,
      background: '#17241e66',
      opacity: open ? 1 : 0,
      transition: 'opacity var(--dur-base) var(--ease-out)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      background: 'var(--surface-screen)',
      borderRadius: '28px 28px 0 0',
      padding: '10px 20px 28px',
      transform: open ? 'none' : 'translateY(105%)',
      transition: 'transform 380ms var(--ease-out)',
      boxShadow: 'var(--shadow-float)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 40,
      height: 5,
      borderRadius: 3,
      background: 'var(--paper-400)',
      margin: '0 auto 16px'
    }
  }), title && /*#__PURE__*/React.createElement("h3", {
    style: {
      font: 'var(--type-heading)',
      letterSpacing: 'var(--tracking-heading)',
      margin: '0 0 12px'
    }
  }, title), children));
}
Object.assign(__ds_scope, { Sheet });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/overlay/Sheet.jsx", error: String((e && e.message) || e) }); }

// components/overlay/Toast.jsx
try { (() => {
function Toast({
  message,
  icon = 'sparkles',
  visible = true,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    role: "status",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      padding: '11px 16px 11px 12px',
      borderRadius: 'var(--radius-pill)',
      background: 'var(--moss-900)',
      color: '#fff',
      font: 'var(--fw-semibold) 13px/1.2 var(--font-body)',
      boxShadow: 'var(--shadow-float)',
      opacity: visible ? 1 : 0,
      transform: visible ? 'none' : 'translateY(10px) scale(.96)',
      transition: 'all var(--dur-base) var(--ease-spring)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 26,
      height: 26,
      borderRadius: 13,
      background: 'var(--yolk-400)',
      color: 'var(--moss-950)',
      display: 'grid',
      placeItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 14
  })), message);
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/overlay/Toast.jsx", error: String((e && e.message) || e) }); }

// components/routine/AppRow.jsx
try { (() => {
function AppRow({
  name,
  glyph,
  tone,
  paused,
  onChange,
  last
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 11,
      padding: '11px 0',
      borderBottom: last ? 0 : '1px solid #edf0e9'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.AppIcon, {
    glyph: glyph,
    tone: tone,
    asleep: paused
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("b", {
    style: {
      display: 'block',
      font: 'var(--type-label)'
    }
  }, name), /*#__PURE__*/React.createElement("small", {
    style: {
      display: 'block',
      font: 'var(--type-caption)',
      color: paused ? 'var(--moss-600)' : 'var(--ink-400)',
      marginTop: 2
    }
  }, paused ? 'Sleeps in until your routine’s done' : 'Always awake')), /*#__PURE__*/React.createElement(__ds_scope.Switch, {
    checked: paused,
    onChange: onChange,
    label: 'Pause ' + name
  }));
}
Object.assign(__ds_scope, { AppRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/routine/AppRow.jsx", error: String((e && e.message) || e) }); }

// components/routine/ChoiceCard.jsx
try { (() => {
function ChoiceCard({
  title,
  description,
  icon,
  selected,
  tone = 'moss',
  onClick
}) {
  const sel = tone === 'danger' ? ['var(--danger-600)', 'var(--danger-100)'] : ['var(--moss-500)', 'var(--moss-50)'];
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: 8,
      textAlign: 'left',
      width: '100%',
      padding: 14,
      borderRadius: 'var(--radius-md)',
      border: '1.5px solid ' + (selected ? sel[0] : 'var(--border-subtle)'),
      background: selected ? sel[1] : 'var(--surface-card)',
      cursor: 'pointer',
      transition: 'all var(--dur-fast) var(--ease-out)',
      color: 'var(--text-1)'
    }
  }, icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 20,
    color: selected ? sel[0] : 'var(--text-3)'
  }), /*#__PURE__*/React.createElement("b", {
    style: {
      font: 'var(--fw-bold) 14px/1.2 var(--font-body)'
    }
  }, title), description && /*#__PURE__*/React.createElement("small", {
    style: {
      font: 'var(--type-caption)',
      color: 'var(--text-3)'
    }
  }, description));
}
Object.assign(__ds_scope, { ChoiceCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/routine/ChoiceCard.jsx", error: String((e && e.message) || e) }); }

// components/routine/FriendRow.jsx
try { (() => {
function FriendRow({
  name,
  initial,
  tone,
  streak,
  done,
  status,
  cheered,
  onCheer,
  last
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '11px 0',
      borderBottom: last ? 0 : '1px solid #edf0e9'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Avatar, {
    initial: initial,
    tone: tone,
    done: done
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("b", {
    style: {
      font: 'var(--type-label)'
    }
  }, name), streak != null && /*#__PURE__*/React.createElement(__ds_scope.StreakBadge, {
    count: streak
  })), /*#__PURE__*/React.createElement("small", {
    style: {
      display: 'block',
      font: 'var(--type-caption)',
      color: 'var(--ink-400)',
      marginTop: 2
    }
  }, status || (done ? 'Up and done' : 'Still snoozing'))), onCheer && /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: cheered ? 'heart-handshake' : 'heart',
    label: 'Cheer ' + name,
    variant: cheered ? 'accent' : 'soft',
    size: 40,
    onClick: onCheer
  }));
}
Object.assign(__ds_scope, { FriendRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/routine/FriendRow.jsx", error: String((e && e.message) || e) }); }

// components/routine/TaskRow.jsx
try { (() => {
function TaskRow({
  title,
  meta,
  icon,
  required = true,
  done,
  onToggle,
  last
}) {
  return /*#__PURE__*/React.createElement("div", {
    onClick: () => onToggle && onToggle(!done),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '12px 0',
      borderBottom: last ? 0 : '1px solid #edf0e9',
      cursor: 'pointer',
      minHeight: 'var(--hit-min)'
    }
  }, icon && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 38,
      height: 38,
      borderRadius: 12,
      background: done ? 'var(--yolk-100)' : 'var(--paper-100)',
      color: done ? 'var(--ember-600)' : 'var(--text-2)',
      display: 'grid',
      placeItems: 'center',
      flex: 'none',
      transition: 'background var(--dur-base)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 19
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("b", {
    style: {
      display: 'block',
      font: 'var(--type-label)',
      color: done ? 'var(--text-3)' : 'var(--text-1)',
      textDecoration: done ? 'line-through' : 'none',
      textDecorationColor: 'var(--ink-300)'
    }
  }, title), /*#__PURE__*/React.createElement("small", {
    style: {
      display: 'block',
      font: 'var(--type-caption)',
      color: 'var(--ink-400)',
      marginTop: 2
    }
  }, required ? 'Required' : 'Optional', meta ? ' · ' + meta : '')), /*#__PURE__*/React.createElement(__ds_scope.Checkbox, {
    checked: done,
    onChange: onToggle,
    label: title,
    tone: required ? 'moss' : 'sun'
  }));
}
Object.assign(__ds_scope, { TaskRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/routine/TaskRow.jsx", error: String((e && e.message) || e) }); }

// ui_kits/ekko-app/App.jsx
try { (() => {
(() => {
  const {
    TabBar,
    Toast
  } = window.EkkoDesignSystem_6a2b75;
  const INIT_APPS = [{
    id: 'ig',
    name: 'Instagram',
    glyph: 'Ig',
    tone: 'clay',
    paused: true
  }, {
    id: 'tt',
    name: 'TikTok',
    glyph: 'Tt',
    tone: 'slate',
    paused: true
  }, {
    id: 'yt',
    name: 'YouTube',
    glyph: 'Yt',
    tone: 'lilac',
    paused: false
  }, {
    id: 'mail',
    name: 'Mail',
    glyph: '✉',
    tone: 'moss',
    paused: false
  }];
  const INIT_STEPS = [{
    id: 'brush',
    title: 'Brush teeth',
    icon: 'droplets',
    meta: 'about 2 min',
    required: true,
    done: false
  }, {
    id: 'water',
    title: 'Glass of water',
    icon: 'glass-water',
    meta: 'before coffee',
    required: true,
    done: false
  }, {
    id: 'ready',
    title: 'Get ready',
    icon: 'shirt',
    meta: 'take your time',
    required: true,
    done: false
  }, {
    id: 'skin',
    title: 'Skincare',
    icon: 'sparkles',
    meta: 'skip if you like',
    required: false,
    done: false
  }];
  const INIT_FRIENDS = [{
    id: 'j',
    name: 'Jamie',
    initial: 'J',
    tone: 'clay',
    streak: 6,
    done: true,
    at: '6:31'
  }, {
    id: 'a',
    name: 'Alex',
    initial: 'A',
    tone: 'sky',
    streak: 3,
    done: true,
    at: '6:48'
  }, {
    id: 'm',
    name: 'Mo',
    initial: 'M',
    tone: 'lilac',
    streak: 11,
    done: false
  }, {
    id: 'r',
    name: 'Riya',
    initial: 'R',
    tone: 'moss',
    streak: 0,
    done: false
  }];
  const TABS = [{
    id: 'today',
    label: 'Today',
    icon: 'sunrise'
  }, {
    id: 'circle',
    label: 'Circle',
    icon: 'users'
  }, {
    id: 'plan',
    label: 'Plan',
    icon: 'list-checks'
  }];
  function App() {
    const [screen, setScreen] = React.useState(() => localStorage.getItem('ekko-kit-screen') || 'setup');
    const [apps, setApps] = React.useState(INIT_APPS);
    const [steps, setSteps] = React.useState(INIT_STEPS);
    const [friends, setFriends] = React.useState(INIT_FRIENDS);
    const [streak] = React.useState(5);
    const [streakEnded, setStreakEnded] = React.useState(false);
    const [sharing, setSharing] = React.useState(true);
    const [shieldMode, setShieldMode] = React.useState(null);
    const [t, setT] = React.useState(null);
    React.useEffect(() => {
      localStorage.setItem('ekko-kit-screen', screen);
    }, [screen]);
    const toast = (message, icon) => {
      setT({
        message,
        icon,
        k: Date.now()
      });
      setTimeout(() => setT(x => x && x.message === message ? null : x), 2200);
    };
    const go = s => setScreen(s);
    const tab = screen === 'circle' ? 'circle' : screen === 'plan' ? 'plan' : 'today';
    const dark = screen === 'shield';
    const showTabs = screen !== 'setup' && screen !== 'shield';
    let body;
    if (screen === 'setup' || screen === 'plan') body = /*#__PURE__*/React.createElement(SetupScreen, {
      apps: apps,
      setApps: setApps,
      steps: steps,
      setSteps: setSteps,
      editing: screen === 'plan',
      onDone: () => {
        go('today');
        toast(screen === 'plan' ? 'Plan saved for tomorrow' : 'See you at 4:00 am', 'moon-star');
      }
    });else if (screen === 'today') body = /*#__PURE__*/React.createElement(TodayScreen, {
      steps: steps,
      setSteps: setSteps,
      apps: apps,
      streak: streak,
      streakEnded: streakEnded,
      onWake: () => go('unlocked'),
      onShield: m => {
        setShieldMode(m === 'peek' ? 'peek' : null);
        go('shield');
      },
      onSkip: () => {
        setStreakEnded(true);
        toast('Skipped today. Fresh start tomorrow.', 'sunrise');
      }
    });else if (screen === 'shield') body = /*#__PURE__*/React.createElement(ShieldScreen, {
      steps: steps,
      mode: shieldMode,
      onBack: () => go('today')
    });else if (screen === 'unlocked') body = /*#__PURE__*/React.createElement(UnlockedScreen, {
      apps: apps,
      streak: streak,
      friends: friends,
      onCircle: () => go('circle'),
      onToday: () => go('today')
    });else body = /*#__PURE__*/React.createElement(CircleScreen, {
      friends: friends,
      setFriends: setFriends,
      toast: toast,
      streak: streak,
      sharing: sharing,
      setSharing: setSharing
    });
    const jumps = [['setup', 'Set up'], ['today', 'Today'], ['shield', 'Shield'], ['unlocked', 'Unlocked'], ['circle', 'Circle']];
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 18,
        padding: '24px 16px 40px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 6,
        flexWrap: 'wrap',
        justifyContent: 'center'
      }
    }, jumps.map(([id, l]) => /*#__PURE__*/React.createElement("button", {
      key: id,
      onClick: () => {
        if (id === 'unlocked') setSteps(steps.map(s => s.required ? {
          ...s,
          done: true
        } : s));
        setShieldMode(null);
        go(id);
      },
      style: {
        border: '1px solid var(--border-subtle)',
        borderRadius: 999,
        padding: '8px 14px',
        background: screen === id ? 'var(--accent)' : 'var(--paper-0)',
        color: screen === id ? '#fff' : 'var(--text-2)',
        font: 'var(--fw-semibold) 13px/1 var(--font-body)',
        cursor: 'pointer'
      }
    }, l))), /*#__PURE__*/React.createElement(Phone, {
      dark: dark,
      statusLight: screen === 'today' && !steps.filter(s => s.required).every(s => s.done)
    }, body, showTabs && /*#__PURE__*/React.createElement(TabBar, {
      items: TABS,
      active: tab,
      onChange: id => go(id),
      style: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 20
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: showTabs ? 96 : 40,
        display: 'flex',
        justifyContent: 'center',
        zIndex: 50,
        pointerEvents: 'none'
      }
    }, t && /*#__PURE__*/React.createElement(Toast, {
      key: t.k,
      message: t.message,
      icon: t.icon
    }))));
  }
  ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/ekko-app/App.jsx", error: String((e && e.message) || e) }); }

// ui_kits/ekko-app/CircleScreen.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
(() => {
  const {
    Card,
    FriendRow,
    Switch,
    Pill,
    Button,
    StreakBadge
  } = window.EkkoDesignSystem_6a2b75;
  function CircleScreen({
    friends,
    setFriends,
    toast,
    streak,
    sharing,
    setSharing
  }) {
    const cheer = f => {
      setFriends(friends.map(x => x.id === f.id ? {
        ...x,
        cheered: !x.cheered
      } : x));
      if (!f.cheered) toast('Cheer sent to ' + f.name, 'heart');
    };
    const up = friends.filter(f => f.done);
    const asleep = friends.filter(f => !f.done);
    return /*#__PURE__*/React.createElement(ScreenScroll, null, /*#__PURE__*/React.createElement(Eyebrow, null, "Your circle"), /*#__PURE__*/React.createElement("h1", {
      style: {
        font: 'var(--type-title)',
        letterSpacing: 'var(--tracking-title)',
        margin: '8px 0 6px'
      }
    }, "You\u2019ve got ", /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'italic 400 34px/1 var(--font-accent)',
        color: 'var(--ember-600)'
      }
    }, "company.")), /*#__PURE__*/React.createElement("p", {
      style: {
        font: 'var(--type-body)',
        color: 'var(--text-3)',
        margin: '0 0 18px'
      }
    }, up.length, " of ", friends.length, " friends are up and done."), /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--type-caption)',
        color: 'var(--text-3)',
        margin: '0 2px 8px'
      }
    }, "Up and done"), /*#__PURE__*/React.createElement(Card, {
      padding: "2px 16px",
      style: {
        marginBottom: 14
      }
    }, up.map((f, i) => /*#__PURE__*/React.createElement(FriendRow, _extends({
      key: f.id
    }, f, {
      status: 'Done at ' + f.at,
      onCheer: () => cheer(f),
      last: i === up.length - 1
    })))), /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--type-caption)',
        color: 'var(--text-3)',
        margin: '0 2px 8px'
      }
    }, "Still snoozing"), /*#__PURE__*/React.createElement(Card, {
      padding: "2px 16px",
      style: {
        marginBottom: 14
      }
    }, asleep.map((f, i) => /*#__PURE__*/React.createElement(FriendRow, _extends({
      key: f.id
    }, f, {
      status: "Hasn\u2019t started yet",
      onCheer: () => cheer(f),
      last: i === asleep.length - 1
    })))), /*#__PURE__*/React.createElement(Card, {
      variant: "soft",
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        font: 'var(--type-small)',
        color: 'var(--moss-800)'
      }
    }, /*#__PURE__*/React.createElement("b", null, "Share my mornings"), /*#__PURE__*/React.createElement("br", null), "Friends see if you finished and your streak. Never your apps or your list."), /*#__PURE__*/React.createElement(Switch, {
      checked: sharing,
      onChange: setSharing,
      label: "Share my mornings"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 14
      }
    }, /*#__PURE__*/React.createElement(Button, {
      block: true,
      variant: "secondary",
      iconLeft: "user-plus"
    }, "Invite a friend")));
  }
  window.CircleScreen = CircleScreen;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/ekko-app/CircleScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/ekko-app/Phone.jsx
try { (() => {
(() => {
  const {
    Icon
  } = window.EkkoDesignSystem_6a2b75;
  function Phone({
    children,
    dark,
    statusLight,
    time = '6:52'
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        width: 390,
        height: 844,
        background: '#111714',
        borderRadius: 54,
        padding: 11,
        boxShadow: 'var(--shadow-device)',
        flex: 'none'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: '100%',
        height: '100%',
        borderRadius: 44,
        overflow: 'hidden',
        background: dark ? 'var(--moss-950)' : 'var(--surface-screen)',
        transition: 'background var(--dur-slow)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 50,
        zIndex: 30,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '4px 30px 0',
        color: dark || statusLight ? '#fff' : 'var(--text-1)',
        font: '650 15px/1 var(--font-body)',
        pointerEvents: 'none'
      }
    }, /*#__PURE__*/React.createElement("span", null, time), /*#__PURE__*/React.createElement("span", {
      style: {
        width: 110,
        height: 32,
        borderRadius: 18,
        background: '#000',
        position: 'absolute',
        left: '50%',
        marginLeft: -55,
        top: 10
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'flex',
        gap: 5
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "signal",
      size: 15
    }), /*#__PURE__*/React.createElement(Icon, {
      name: "wifi",
      size: 15
    }), /*#__PURE__*/React.createElement(Icon, {
      name: "battery-full",
      size: 17
    }))), children));
  }
  function ScreenScroll({
    children,
    pad = true,
    style
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        overflowY: 'auto',
        padding: pad ? '58px 18px 110px' : 0,
        scrollbarWidth: 'none',
        ...style
      }
    }, children);
  }
  function Eyebrow({
    children,
    color = 'var(--moss-600)'
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--type-eyebrow)',
        letterSpacing: 'var(--tracking-eyebrow)',
        textTransform: 'uppercase',
        color
      }
    }, children);
  }
  Object.assign(window, {
    Phone,
    ScreenScroll,
    Eyebrow
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/ekko-app/Phone.jsx", error: String((e && e.message) || e) }); }

// ui_kits/ekko-app/SetupScreen.jsx
try { (() => {
(() => {
  const {
    Card,
    AppRow,
    Segmented,
    Button,
    Pill,
    Icon,
    IconButton
  } = window.EkkoDesignSystem_6a2b75;
  function SetupScreen({
    apps,
    setApps,
    steps,
    setSteps,
    onDone,
    editing
  }) {
    const toggleApp = (id, v) => setApps(apps.map(a => a.id === id ? {
      ...a,
      paused: v
    } : a));
    const setRule = (id, r) => setSteps(steps.map(s => s.id === id ? {
      ...s,
      required: r === 'Required'
    } : s));
    const paused = apps.filter(a => a.paused).length;
    const req = steps.filter(s => s.required).length;
    return /*#__PURE__*/React.createElement(ScreenScroll, null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: '6px 0 18px'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: '800 24px/1 var(--font-display)',
        letterSpacing: '-.06em',
        color: 'var(--moss-700)'
      }
    }, "ekko"), editing ? /*#__PURE__*/React.createElement(Pill, {
      icon: "pencil",
      tone: "neutral",
      size: "sm"
    }, "Changes start tomorrow") : /*#__PURE__*/React.createElement(Pill, {
      tone: "moss",
      size: "sm"
    }, "Step 1 of 1")), /*#__PURE__*/React.createElement("h1", {
      style: {
        font: 'var(--type-title)',
        letterSpacing: 'var(--tracking-title)',
        margin: '0 0 8px'
      }
    }, "What should ", /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'italic 400 34px/1 var(--font-accent)',
        letterSpacing: '-.01em',
        color: 'var(--ember-600)'
      }
    }, "sleep in"), " until you\u2019re up?"), /*#__PURE__*/React.createElement("p", {
      style: {
        font: 'var(--type-body)',
        color: 'var(--text-3)',
        margin: '0 0 18px'
      }
    }, "These apps doze off at 4:00 every morning and wake up when your routine\u2019s done."), /*#__PURE__*/React.createElement(Card, {
      padding: "4px 16px",
      style: {
        marginBottom: 12
      }
    }, apps.map((a, i) => /*#__PURE__*/React.createElement(AppRow, {
      key: a.id,
      name: a.name,
      glyph: a.glyph,
      tone: a.tone,
      paused: a.paused,
      onChange: v => toggleApp(a.id, v),
      last: i === apps.length - 1
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        margin: '22px 2px 10px'
      }
    }, /*#__PURE__*/React.createElement("b", {
      style: {
        font: 'var(--type-subhead)'
      }
    }, "Your morning"), /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--type-caption)',
        color: 'var(--text-3)'
      }
    }, req, " required")), /*#__PURE__*/React.createElement(Card, {
      padding: "4px 16px",
      style: {
        marginBottom: 12
      }
    }, steps.map((s, i) => /*#__PURE__*/React.createElement("div", {
      key: s.id,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '11px 0',
        borderBottom: i === steps.length - 1 ? 0 : '1px solid #edf0e9'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 38,
        height: 38,
        borderRadius: 12,
        background: 'var(--paper-100)',
        display: 'grid',
        placeItems: 'center',
        color: 'var(--text-2)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: s.icon,
      size: 19
    })), /*#__PURE__*/React.createElement("b", {
      style: {
        flex: 1,
        font: 'var(--type-label)'
      }
    }, s.title), /*#__PURE__*/React.createElement(Segmented, {
      options: ['Required', 'Optional'],
      value: s.required ? 'Required' : 'Optional',
      onChange: r => setRule(s.id, r)
    }))), /*#__PURE__*/React.createElement("button", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        width: '100%',
        padding: '12px 0',
        border: 0,
        borderTop: '1px solid #edf0e9',
        background: 'none',
        color: 'var(--text-accent)',
        font: 'var(--type-label)',
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "plus",
      size: 18
    }), "Add a step")), /*#__PURE__*/React.createElement(Card, {
      variant: "soft",
      style: {
        display: 'flex',
        gap: 12,
        alignItems: 'flex-start'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "moon-star",
      size: 22,
      color: "var(--moss-700)"
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--type-small)',
        color: 'var(--moss-800)'
      }
    }, /*#__PURE__*/React.createElement("b", null, "Lights out at 4:00 am."), " ", paused, " app", paused === 1 ? '' : 's', " stay asleep until your required steps are ticked \u2014 or you choose a way out.")), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 18
      }
    }, /*#__PURE__*/React.createElement(Button, {
      block: true,
      size: "lg",
      iconRight: "arrow-right",
      disabled: !paused || !req,
      onClick: onDone
    }, editing ? 'Save plan' : 'Save my morning')));
  }
  window.SetupScreen = SetupScreen;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/ekko-app/SetupScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/ekko-app/ShieldScreen.jsx
try { (() => {
(() => {
  const {
    Button,
    AppIcon,
    Pill,
    Icon,
    Sunrise
  } = window.EkkoDesignSystem_6a2b75;
  function ShieldScreen({
    steps,
    mode,
    onBack
  }) {
    const req = steps.filter(s => s.required);
    const left = req.filter(s => !s.done);
    if (mode === 'peek') return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 14,
        padding: 28,
        background: 'var(--moss-950)',
        color: '#fff',
        textAlign: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        font: '750 88px/1 var(--font-display)',
        letterSpacing: '-.06em',
        fontVariantNumeric: 'tabular-nums',
        color: 'var(--yolk-400)'
      }
    }, "4:59"), /*#__PURE__*/React.createElement("p", {
      style: {
        font: 'var(--type-body)',
        color: 'var(--text-on-night-2)',
        margin: 0,
        maxWidth: 260
      }
    }, "Peek running. Instagram and TikTok go back to sleep when this hits zero."), /*#__PURE__*/React.createElement(Button, {
      variant: "night",
      onClick: onBack
    }, "End peek early"));
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        background: 'var(--moss-950)',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        padding: '74px 22px 40px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: '50%',
        top: 180,
        width: 300,
        height: 300,
        marginLeft: -150,
        borderRadius: '50%',
        background: 'radial-gradient(circle,#386c5c66 0,transparent 70%)'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: 16,
        marginTop: 60,
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement(AppIcon, {
      glyph: "Tt",
      tone: "night",
      size: 84
    }), /*#__PURE__*/React.createElement(Pill, {
      tone: "night",
      icon: "moon"
    }, "Shielded by ekko"), /*#__PURE__*/React.createElement("h1", {
      style: {
        font: 'var(--type-display)',
        letterSpacing: 'var(--tracking-title)',
        margin: 0
      }
    }, "TikTok\u2019s still", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'italic 400 50px/1 var(--font-accent)',
        color: 'var(--yolk-400)'
      }
    }, "asleep.")), /*#__PURE__*/React.createElement("p", {
      style: {
        font: 'var(--type-body)',
        color: 'var(--text-on-night-2)',
        margin: 0,
        maxWidth: 280
      }
    }, left.length ? left.length + ' step' + (left.length > 1 ? 's' : '') + ' and it wakes up: ' + left.map(s => s.title.toLowerCase()).join(', ') + '.' : 'Your routine’s done — head back to ekko to wake it.')), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement(Button, {
      block: true,
      size: "lg",
      variant: "night",
      iconLeft: "sunrise",
      onClick: onBack
    }, "Open my routine"), /*#__PURE__*/React.createElement("p", {
      style: {
        font: 'var(--type-caption)',
        color: '#ffffff80',
        textAlign: 'center',
        margin: '6px 0 0'
      }
    }, "Illustrative iOS shield. Real enforcement is still being validated.")));
  }
  window.ShieldScreen = ShieldScreen;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/ekko-app/ShieldScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/ekko-app/TodayScreen.jsx
try { (() => {
(() => {
  const {
    Sunrise,
    Card,
    TaskRow,
    Button,
    Pill,
    ProgressBar,
    Sheet,
    ChoiceCard,
    StreakBadge,
    AppIcon
  } = window.EkkoDesignSystem_6a2b75;
  function TodayScreen({
    steps,
    setSteps,
    apps,
    streak,
    streakEnded,
    onWake,
    onShield,
    onSkip
  }) {
    const [sheet, setSheet] = React.useState(false);
    const [choice, setChoice] = React.useState('peek');
    const req = steps.filter(s => s.required);
    const done = req.filter(s => s.done).length;
    const all = req.length > 0 && done === req.length;
    const v = req.length ? done / req.length : 1;
    const left = req.length - done;
    const paused = apps.filter(a => a.paused);
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ScreenScroll, {
      pad: false
    }, /*#__PURE__*/React.createElement(Sunrise, {
      value: v,
      width: "100%",
      height: 330,
      style: {
        borderRadius: '0 0 32px 32px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Pill, {
      tone: all ? 'yolk' : 'night',
      icon: all ? 'sun' : 'moon',
      style: {
        marginBottom: 12
      }
    }, all ? 'Apps can wake up' : paused.length + ' apps asleep since 4:00'), /*#__PURE__*/React.createElement("h1", {
      style: {
        font: 'var(--type-display)',
        letterSpacing: 'var(--tracking-title)',
        margin: 0,
        color: 'inherit'
      }
    }, "Good ", /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'italic 400 48px/1 var(--font-accent)',
        color: v > .6 ? 'var(--ember-600)' : 'var(--yolk-200)',
        letterSpacing: '-.01em'
      }
    }, "morning,"), /*#__PURE__*/React.createElement("br", null), "Sam.")))), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '18px 18px 120px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10
      }
    }, /*#__PURE__*/React.createElement("b", {
      style: {
        font: 'var(--type-subhead)'
      }
    }, all ? 'All done. Nice one.' : left === 1 ? 'One more step' : left + ' steps till the sun’s up'), streakEnded ? /*#__PURE__*/React.createElement(Pill, {
      tone: "neutral",
      size: "sm"
    }, "Streak restarts tomorrow") : /*#__PURE__*/React.createElement(StreakBadge, {
      count: all ? streak + 1 : streak
    })), /*#__PURE__*/React.createElement(ProgressBar, {
      value: v,
      tone: "sun",
      style: {
        marginBottom: 12
      }
    }), /*#__PURE__*/React.createElement(Card, {
      padding: "2px 16px"
    }, steps.map((s, i) => /*#__PURE__*/React.createElement(TaskRow, {
      key: s.id,
      icon: s.icon,
      title: s.title,
      meta: s.meta,
      required: s.required,
      done: s.done,
      last: i === steps.length - 1,
      onToggle: d => setSteps(steps.map(x => x.id === s.id ? {
        ...x,
        done: d
      } : x))
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 4
      }
    }, /*#__PURE__*/React.createElement(Button, {
      block: true,
      size: "lg",
      variant: all ? 'sunrise' : 'primary',
      iconLeft: all ? 'sunrise' : 'lock',
      disabled: !all,
      onClick: onWake
    }, all ? 'Wake my apps' : left + ' to go'), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'center',
        gap: 4
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      size: "sm",
      onClick: () => setSheet(true)
    }, "Need access now?"), /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      size: "sm",
      onClick: onShield
    }, "Try opening TikTok"))))), /*#__PURE__*/React.createElement(Sheet, {
      open: sheet,
      title: "Real life happens.",
      onClose: () => setSheet(false)
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        font: 'var(--type-small)',
        color: 'var(--text-3)',
        margin: '-4px 0 14px'
      }
    }, "Pick a way out. No judgement \u2014 just know what each one costs."), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 8,
        marginBottom: 14
      }
    }, /*#__PURE__*/React.createElement(ChoiceCard, {
      icon: "timer",
      title: "5-minute peek",
      description: "Apps nap again after. Streak safe.",
      selected: choice === 'peek',
      onClick: () => setChoice('peek')
    }), /*#__PURE__*/React.createElement(ChoiceCard, {
      icon: "flame-kindling",
      tone: "danger",
      title: "Skip today",
      description: 'Ends your ' + streak + '-day streak.',
      selected: choice === 'skip',
      onClick: () => setChoice('skip')
    })), /*#__PURE__*/React.createElement(Button, {
      block: true,
      variant: choice === 'skip' ? 'danger' : 'primary',
      onClick: () => {
        setSheet(false);
        if (choice === 'skip') onSkip();else onShield('peek');
      }
    }, choice === 'skip' ? 'Skip today' : 'Start my 5 minutes'), /*#__PURE__*/React.createElement("p", {
      style: {
        font: 'var(--type-caption)',
        color: 'var(--ink-400)',
        textAlign: 'center',
        margin: '12px 0 0'
      }
    }, "Peek length and daily allowance are still being decided.")));
  }
  window.TodayScreen = TodayScreen;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/ekko-app/TodayScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/ekko-app/UnlockedScreen.jsx
try { (() => {
(() => {
  const {
    Sunrise,
    Button,
    AppIcon,
    StreakBadge,
    Card,
    Avatar
  } = window.EkkoDesignSystem_6a2b75;
  function UnlockedScreen({
    apps,
    streak,
    friends,
    onCircle,
    onToday
  }) {
    const [up, setUp] = React.useState(0);
    React.useEffect(() => {
      const t = setTimeout(() => setUp(1), 80);
      return () => clearTimeout(t);
    }, []);
    const doneFriends = friends.filter(f => f.done);
    return /*#__PURE__*/React.createElement(ScreenScroll, {
      pad: false,
      style: {
        background: 'var(--surface-sunrise)'
      }
    }, /*#__PURE__*/React.createElement(Sunrise, {
      value: up,
      width: "100%",
      height: 380,
      style: {
        borderRadius: '0 0 32px 32px'
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--type-eyebrow)',
        letterSpacing: 'var(--tracking-eyebrow)',
        textTransform: 'uppercase',
        color: 'var(--ember-700)',
        marginBottom: 8
      }
    }, "7:05 am \xB7 morning done"), /*#__PURE__*/React.createElement("h1", {
      style: {
        font: 'var(--type-display)',
        letterSpacing: 'var(--tracking-title)',
        margin: 0,
        color: 'var(--moss-950)'
      }
    }, "Morning first.", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'italic 400 50px/1 var(--font-accent)',
        color: 'var(--ember-600)'
      }
    }, "Then the feed.")))), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '20px 18px 120px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement(Card, {
      variant: "raised",
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--type-caption)',
        color: 'var(--text-3)',
        marginBottom: 6
      }
    }, "Streak"), /*#__PURE__*/React.createElement(StreakBadge, {
      count: streak + 1,
      size: "lg"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 6
      }
    }, Array.from({
      length: 7
    }).map((_, i) => /*#__PURE__*/React.createElement("span", {
      key: i,
      style: {
        width: 14,
        height: 34,
        borderRadius: 7,
        background: i < 6 ? 'var(--ember-500)' : 'var(--paper-300)',
        opacity: i < 6 ? .35 + i * .13 : 1
      }
    })))), /*#__PURE__*/React.createElement(Card, {
      variant: "raised"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--type-caption)',
        color: 'var(--text-3)',
        marginBottom: 10
      }
    }, "Awake now"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 10
      }
    }, apps.filter(a => a.paused).map(a => /*#__PURE__*/React.createElement("div", {
      key: a.id,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(AppIcon, {
      glyph: a.glyph,
      tone: a.tone
    }), /*#__PURE__*/React.createElement("b", {
      style: {
        font: 'var(--type-label)'
      }
    }, a.name))))), /*#__PURE__*/React.createElement(Card, {
      variant: "raised",
      onClick: onCircle,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex'
      }
    }, doneFriends.map((f, i) => /*#__PURE__*/React.createElement(Avatar, {
      key: f.id,
      initial: f.initial,
      tone: f.tone,
      done: true,
      size: 32,
      style: {
        marginLeft: i ? -6 : 0
      }
    }))), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        font: 'var(--type-small)'
      }
    }, /*#__PURE__*/React.createElement("b", null, doneFriends.map(f => f.name).join(' & ')), " are up too.")), /*#__PURE__*/React.createElement(Button, {
      block: true,
      size: "lg",
      iconRight: "arrow-right",
      onClick: onCircle
    }, "Cheer on your circle"), /*#__PURE__*/React.createElement(Button, {
      block: true,
      variant: "ghost",
      onClick: onToday
    }, "Back to today")));
  }
  window.UnlockedScreen = UnlockedScreen;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/ekko-app/UnlockedScreen.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.AppIcon = __ds_scope.AppIcon;

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Pill = __ds_scope.Pill;

__ds_ns.ProgressBar = __ds_scope.ProgressBar;

__ds_ns.StreakBadge = __ds_scope.StreakBadge;

__ds_ns.Sunrise = __ds_scope.Sunrise;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Segmented = __ds_scope.Segmented;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.TabBar = __ds_scope.TabBar;

__ds_ns.Sheet = __ds_scope.Sheet;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.AppRow = __ds_scope.AppRow;

__ds_ns.ChoiceCard = __ds_scope.ChoiceCard;

__ds_ns.FriendRow = __ds_scope.FriendRow;

__ds_ns.TaskRow = __ds_scope.TaskRow;

})();
