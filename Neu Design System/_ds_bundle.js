/* @ds-bundle: {"format":4,"namespace":"NeuDesignSystem_32f7fb","components":[{"name":"Avatar","sourcePath":"components/display/Avatar.jsx"},{"name":"Badge","sourcePath":"components/display/Badge.jsx"},{"name":"Card","sourcePath":"components/display/Card.jsx"},{"name":"ProductCard","sourcePath":"components/display/ProductCard.jsx"},{"name":"ToneSwatch","sourcePath":"components/display/ToneSwatch.jsx"},{"name":"Button","sourcePath":"components/forms/Button.jsx"},{"name":"Chip","sourcePath":"components/forms/Chip.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"QuizOption","sourcePath":"components/forms/QuizOption.jsx"},{"name":"SegmentedControl","sourcePath":"components/forms/SegmentedControl.jsx"},{"name":"TabBar","sourcePath":"components/navigation/TabBar.jsx"}],"sourceHashes":{"components/display/Avatar.jsx":"673e5404df51","components/display/Badge.jsx":"5003273b713c","components/display/Card.jsx":"3e6124bd0d1f","components/display/ProductCard.jsx":"bc13ca5a54ff","components/display/ToneSwatch.jsx":"82de86720538","components/forms/Button.jsx":"3a1270ec032e","components/forms/Chip.jsx":"fb0e0bd38207","components/forms/Input.jsx":"11c10e75e0fa","components/forms/QuizOption.jsx":"c3715f6ac961","components/forms/SegmentedControl.jsx":"ed16552a1206","components/navigation/TabBar.jsx":"fc532b8c7046","ui_kits/neu-app/FeedScreen.jsx":"66d6360de908","ui_kits/neu-app/NeuApp.jsx":"1fee26a40640","ui_kits/neu-app/ProductScreen.jsx":"74778d8ca5d0","ui_kits/neu-app/ProfileScreen.jsx":"1df14967268c","ui_kits/neu-app/QuizScreen.jsx":"8f5404a66cb6","ui_kits/neu-app/ResultScreen.jsx":"db3eefaf8fae","ui_kits/neu-app/data.js":"78c584b72fc1"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.NeuDesignSystem_32f7fb = window.NeuDesignSystem_32f7fb || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/display/Avatar.jsx
try { (() => {
/**
 * Avatar — a tone twin. Shows initials on a warm tint, with an optional
 * small ToneSwatch-style tone dot in the corner (`tone` = Monk 1–10).
 */
function Avatar({
  name = '',
  src = null,
  tone = null,
  size = 44,
  style = {}
}) {
  const initials = name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: size,
      height: size,
      flex: 'none',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: size,
      height: size,
      borderRadius: 'var(--r-circle)',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--amethyst-soft)',
      color: 'var(--amethyst-deep)',
      fontFamily: 'var(--font-body)',
      fontWeight: 'var(--w-semi)',
      fontSize: size * 0.36,
      boxShadow: 'inset 0 0 0 1px rgba(42,31,24,.08)'
    }
  }, src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: name,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }) : initials), tone && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      right: -2,
      bottom: -2,
      width: size * 0.34,
      height: size * 0.34,
      borderRadius: 'var(--r-circle)',
      background: `var(--mst-${tone})`,
      boxShadow: '0 0 0 2px var(--surface)'
    }
  }));
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/display/Badge.jsx
try { (() => {
/**
 * Badge — small status/label pill. `tone`:
 *  good (olive) · warm (gold) · berry · neutral · olive (outlined flag)
 */
function Badge({
  children,
  tone = 'neutral',
  style = {}
}) {
  const tones = {
    good: {
      background: 'var(--good-soft)',
      color: 'var(--amethyst-deep)',
      border: 'transparent'
    },
    warm: {
      background: 'var(--gold-soft)',
      color: '#8A6A22',
      border: 'transparent'
    },
    berry: {
      background: 'var(--berry-soft)',
      color: 'var(--berry-deep)',
      border: 'transparent'
    },
    neutral: {
      background: 'var(--paper-sink)',
      color: 'var(--ink-2)',
      border: 'transparent'
    },
    olive: {
      background: 'transparent',
      color: 'var(--amethyst-deep)',
      border: 'var(--amethyst)'
    }
  };
  const t = tones[tone] || tones.neutral;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '5px',
      fontFamily: 'var(--font-body)',
      fontWeight: 'var(--w-semi)',
      fontSize: 'var(--t-cap)',
      lineHeight: 1,
      padding: '5px 10px',
      borderRadius: 'var(--r-pill)',
      background: t.background,
      color: t.color,
      border: `1px solid ${t.border}`,
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Badge.jsx", error: String((e && e.message) || e) }); }

// components/display/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Card — the base warm surface. `pad` toggles inner padding, `flat` drops shadow. */
function Card({
  children,
  pad = true,
  flat = false,
  style = {},
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      background: 'var(--surface)',
      border: '1px solid var(--line)',
      borderRadius: 'var(--r-lg)',
      boxShadow: flat ? 'none' : 'var(--shadow-md)',
      padding: pad ? 'var(--sp-5)' : 0,
      overflow: 'hidden',
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Card.jsx", error: String((e && e.message) || e) }); }

// components/display/ProductCard.jsx
try { (() => {
/**
 * ProductCard — a product surfaced through tone twins. The heart of the feed.
 * `image` is a color/gradient placeholder swatch (no photo needed).
 * `verdicts` is an array of short strings ("Didn't oxidize", "No white cast").
 * `twins` = { count, tone } summarizes who vouches for it.
 */
function ProductCard({
  brand,
  name,
  price,
  image = 'var(--amethyst-soft)',
  verdicts = [],
  twins = null,
  saved = false,
  onSave,
  onClick,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    style: {
      background: 'var(--surface)',
      border: '1px solid var(--line)',
      borderRadius: 'var(--r-lg)',
      boxShadow: 'var(--shadow-md)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      height: 132,
      background: image
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: e => {
      e.stopPropagation();
      onSave && onSave();
    },
    "aria-label": "Save",
    style: {
      position: 'absolute',
      top: 10,
      right: 10,
      width: 34,
      height: 34,
      borderRadius: 'var(--r-circle)',
      border: 'none',
      cursor: 'pointer',
      background: 'rgba(255,255,255,.9)',
      backdropFilter: 'blur(4px)',
      color: saved ? 'var(--berry)' : 'var(--ink-2)',
      fontSize: 16,
      lineHeight: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: 'var(--shadow-sm)'
    }
  }, saved ? '♥' : '♡'), twins && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 10,
      bottom: 10,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      background: 'rgba(255,255,255,.92)',
      backdropFilter: 'blur(4px)',
      padding: '4px 10px 4px 6px',
      borderRadius: 'var(--r-pill)',
      boxShadow: 'var(--shadow-sm)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Avatar, {
    name: "Tone Twin",
    tone: twins.tone,
    size: 20
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontWeight: 'var(--w-semi)',
      fontSize: 'var(--t-cap)',
      color: 'var(--ink)'
    }
  }, twins.count, " tone twins"))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--sp-4)',
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--t-micro)',
      letterSpacing: '.08em',
      textTransform: 'uppercase',
      color: 'var(--ink-3)'
    }
  }, brand), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 'var(--w-med)',
      fontSize: 'var(--t-h3)',
      lineHeight: 1.1,
      color: 'var(--ink)'
    }
  }, name), verdicts.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 6,
      marginTop: 2
    }
  }, verdicts.map(v => /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    key: v,
    tone: "good"
  }, v))), price && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4,
      fontFamily: 'var(--font-body)',
      fontWeight: 'var(--w-semi)',
      fontSize: 'var(--t-body)',
      color: 'var(--ink)'
    }
  }, price)));
}
Object.assign(__ds_scope, { ProductCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/ProductCard.jsx", error: String((e && e.message) || e) }); }

// components/display/ToneSwatch.jsx
try { (() => {
/**
 * ToneSwatch — the Monk Skin Tone dot, the brand's signature primitive.
 * Pass `tone` (1–10) to pull the official --mst-N color, or a raw `color`.
 * `selected` draws the olive placement ring.
 */
function ToneSwatch({
  tone = null,
  color = null,
  size = 40,
  selected = false,
  label = false,
  style = {}
}) {
  const bg = color || (tone ? `var(--mst-${tone})` : 'var(--mst-5)');
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '6px',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: size,
      height: size,
      borderRadius: 'var(--r-circle)',
      background: bg,
      boxShadow: selected ? '0 0 0 3px var(--paper), 0 0 0 6px var(--amethyst), var(--shadow-sm)' : 'inset 0 0 0 1px rgba(42,31,24,.12)',
      transition: 'box-shadow .18s ease'
    }
  }), label && tone && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--t-micro)',
      color: selected ? 'var(--amethyst-deep)' : 'var(--ink-3)',
      letterSpacing: '.04em'
    }
  }, "MST-", String(tone).padStart(2, '0')));
}
Object.assign(__ds_scope, { ToneSwatch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/ToneSwatch.jsx", error: String((e && e.message) || e) }); }

// components/forms/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Neu Button — pill-shaped, warm. Variants map to brand roles:
 *  - primary  : clay fill (the inviting CTA)
 *  - quiet    : ink fill (confident/secondary dark)
 *  - soft     : clay-tint fill, clay text
 *  - ghost    : text-only with hover tint
 */
function Button({
  children,
  variant = 'primary',
  size = 'md',
  full = false,
  icon = null,
  disabled = false,
  style = {},
  ...rest
}) {
  const sizes = {
    sm: {
      padding: '8px 16px',
      font: 'var(--t-sm)',
      gap: '6px'
    },
    md: {
      padding: '12px 22px',
      font: 'var(--t-body)',
      gap: '8px'
    },
    lg: {
      padding: '16px 28px',
      font: 'var(--t-title)',
      gap: '10px'
    }
  };
  const variants = {
    primary: {
      background: 'var(--action)',
      color: 'var(--action-text)',
      border: '1px solid transparent'
    },
    quiet: {
      background: 'var(--action-quiet)',
      color: 'var(--ink-inv)',
      border: '1px solid transparent'
    },
    soft: {
      background: 'var(--amethyst-soft)',
      color: 'var(--amethyst-deep)',
      border: '1px solid transparent'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--amethyst-deep)',
      border: '1px solid var(--line-strong)'
    }
  };
  const s = sizes[size] || sizes.md;
  const v = variants[variant] || variants.primary;
  return /*#__PURE__*/React.createElement("button", _extends({
    disabled: disabled,
    style: {
      display: full ? 'flex' : 'inline-flex',
      width: full ? '100%' : 'auto',
      alignItems: 'center',
      justifyContent: 'center',
      gap: s.gap,
      fontFamily: 'var(--font-body)',
      fontWeight: 'var(--w-semi)',
      fontSize: s.font,
      lineHeight: 1,
      letterSpacing: '0.01em',
      padding: s.padding,
      borderRadius: 'var(--r-pill)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.45 : 1,
      transition: 'transform .12s ease, filter .15s ease',
      ...v,
      ...style
    },
    onMouseDown: e => {
      if (!disabled) e.currentTarget.style.transform = 'scale(0.97)';
    },
    onMouseUp: e => {
      e.currentTarget.style.transform = 'scale(1)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.transform = 'scale(1)';
    }
  }, rest), icon, children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Button.jsx", error: String((e && e.message) || e) }); }

// components/forms/Chip.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Chip — filter / undertone / tone pill. Selectable.
 * A leading `swatch` color renders a dot (undertone or Monk tone).
 */
function Chip({
  children,
  selected = false,
  swatch = null,
  size = 'md',
  onClick,
  style = {},
  ...rest
}) {
  const pad = size === 'sm' ? '5px 11px' : '8px 14px';
  const font = size === 'sm' ? 'var(--t-cap)' : 'var(--t-sm)';
  return /*#__PURE__*/React.createElement("button", _extends({
    onClick: onClick,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '7px',
      fontFamily: 'var(--font-body)',
      fontWeight: 'var(--w-med)',
      fontSize: font,
      lineHeight: 1,
      padding: pad,
      borderRadius: 'var(--r-pill)',
      cursor: 'pointer',
      transition: 'background .15s ease, color .15s ease, border-color .15s ease',
      background: selected ? 'var(--ink)' : 'var(--surface)',
      color: selected ? 'var(--ink-inv)' : 'var(--ink-2)',
      border: `1px solid ${selected ? 'var(--ink)' : 'var(--line-strong)'}`,
      ...style
    }
  }, rest), swatch && /*#__PURE__*/React.createElement("span", {
    style: {
      width: '12px',
      height: '12px',
      borderRadius: 'var(--r-circle)',
      background: swatch,
      boxShadow: 'inset 0 0 0 1px rgba(42,31,24,.12)',
      flex: 'none'
    }
  }), children);
}
Object.assign(__ds_scope, { Chip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Chip.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Search / text input, warm pill or rounded field. */
function Input({
  value,
  onChange,
  placeholder = '',
  icon = null,
  type = 'text',
  pill = false,
  style = {},
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      background: 'var(--surface)',
      border: '1px solid var(--line-strong)',
      borderRadius: pill ? 'var(--r-pill)' : 'var(--r-md)',
      padding: pill ? '11px 18px' : '12px 14px',
      transition: 'box-shadow .15s ease, border-color .15s ease',
      ...style
    },
    onFocus: e => {
      e.currentTarget.style.boxShadow = 'var(--ring)';
      e.currentTarget.style.borderColor = 'var(--amethyst)';
    },
    onBlur: e => {
      e.currentTarget.style.boxShadow = 'none';
      e.currentTarget.style.borderColor = 'var(--line-strong)';
    }
  }, icon && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--ink-3)',
      display: 'flex'
    }
  }, icon), /*#__PURE__*/React.createElement("input", _extends({
    type: type,
    value: value,
    onChange: onChange,
    placeholder: placeholder,
    style: {
      flex: 1,
      border: 'none',
      outline: 'none',
      background: 'transparent',
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--t-body)',
      color: 'var(--ink)'
    }
  }, rest)));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/QuizOption.jsx
try { (() => {
/**
 * QuizOption — a big tappable quiz answer (the 30-second quiz).
 * Radio-like; `selected` fills olive-soft with an olive ring.
 */
function QuizOption({
  children,
  selected = false,
  sublabel = null,
  swatch = null,
  onClick,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      width: '100%',
      textAlign: 'left',
      padding: '16px 18px',
      borderRadius: 'var(--r-md)',
      cursor: 'pointer',
      background: selected ? 'var(--amethyst-soft)' : 'var(--surface)',
      border: `1.5px solid ${selected ? 'var(--amethyst)' : 'var(--line-strong)'}`,
      transition: 'background .15s ease, border-color .15s ease',
      ...style
    }
  }, swatch && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 32,
      height: 32,
      borderRadius: 'var(--r-circle)',
      background: swatch,
      flex: 'none',
      boxShadow: 'inset 0 0 0 1px rgba(42,31,24,.12)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontWeight: 'var(--w-semi)',
      fontSize: 'var(--t-title)',
      color: 'var(--ink)'
    }
  }, children), sublabel && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--t-sm)',
      color: 'var(--ink-2)'
    }
  }, sublabel)), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 22,
      height: 22,
      borderRadius: 'var(--r-circle)',
      flex: 'none',
      border: `2px solid ${selected ? 'var(--amethyst)' : 'var(--line-strong)'}`,
      background: selected ? 'var(--amethyst)' : 'transparent',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      fontSize: 13
    }
  }, selected ? '✓' : ''));
}
Object.assign(__ds_scope, { QuizOption });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/QuizOption.jsx", error: String((e && e.message) || e) }); }

// components/forms/SegmentedControl.jsx
try { (() => {
/** iOS-style segmented control. `options` is an array of string labels. */
function SegmentedControl({
  options = [],
  value,
  onChange,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      background: 'var(--paper-sink)',
      border: '1px solid var(--line)',
      borderRadius: 'var(--r-pill)',
      padding: '3px',
      gap: '2px',
      ...style
    }
  }, options.map(opt => {
    const active = opt === value;
    return /*#__PURE__*/React.createElement("button", {
      key: opt,
      onClick: () => onChange && onChange(opt),
      style: {
        padding: '8px 16px',
        borderRadius: 'var(--r-pill)',
        border: 'none',
        cursor: 'pointer',
        fontFamily: 'var(--font-body)',
        fontWeight: active ? 'var(--w-semi)' : 'var(--w-med)',
        fontSize: 'var(--t-sm)',
        transition: 'all .18s ease',
        background: active ? 'var(--surface)' : 'transparent',
        color: active ? 'var(--ink)' : 'var(--ink-2)',
        boxShadow: active ? 'var(--shadow-sm)' : 'none'
      }
    }, opt);
  }));
}
Object.assign(__ds_scope, { SegmentedControl });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/SegmentedControl.jsx", error: String((e && e.message) || e) }); }

// components/navigation/TabBar.jsx
try { (() => {
/**
 * TabBar — iOS bottom navigation. `items` = [{ key, label, icon }].
 * `icon` is any node (pass Lucide icons from the kit). Active tab is clay.
 */
function TabBar({
  items = [],
  active,
  onChange,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      background: 'rgba(251,246,239,.86)',
      backdropFilter: 'blur(18px)',
      borderTop: '1px solid var(--line)',
      padding: '8px 8px calc(8px + env(safe-area-inset-bottom))',
      ...style
    }
  }, items.map(it => {
    const on = it.key === active;
    return /*#__PURE__*/React.createElement("button", {
      key: it.key,
      onClick: () => onChange && onChange(it.key),
      style: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 3,
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '4px 0',
        color: on ? 'var(--amethyst-deep)' : 'var(--ink-3)',
        transition: 'color .15s ease'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'flex',
        height: 24,
        alignItems: 'center'
      }
    }, it.icon), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-body)',
        fontSize: '11px',
        fontWeight: on ? 'var(--w-semi)' : 'var(--w-med)'
      }
    }, it.label));
  }));
}
Object.assign(__ds_scope, { TabBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/TabBar.jsx", error: String((e && e.message) || e) }); }

// ui_kits/neu-app/FeedScreen.jsx
try { (() => {
// Feed screen — "For You", products filtered through your tone twins.
function FeedScreen({
  onOpen,
  onProfile
}) {
  const D = window.NEU_DATA;
  const {
    ProductCard,
    Chip,
    Avatar
  } = window.NeuDesignSystem_32f7fb;
  const [filter, setFilter] = React.useState('All');
  const filters = ['All', 'Foundation', 'SPF', 'Blush', 'Concealer'];
  const [saved, setSaved] = React.useState({});
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '6px 0 20px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '6px 20px 14px'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      letterSpacing: '.08em',
      textTransform: 'uppercase',
      color: 'var(--ink-3)'
    }
  }, "For you \xB7 MST-07 olive"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 28,
      letterSpacing: '-.02em',
      color: 'var(--ink)',
      margin: '2px 0 0'
    }
  }, "What works on skin like yours")), /*#__PURE__*/React.createElement("div", {
    onClick: onProfile,
    style: {
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: "You",
    tone: 7,
    size: 40
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      overflowX: 'auto',
      padding: '2px 20px 14px'
    }
  }, filters.map(f => /*#__PURE__*/React.createElement(Chip, {
    key: f,
    selected: filter === f,
    onClick: () => setFilter(f)
  }, f))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 14,
      padding: '0 20px'
    }
  }, D.products.map(p => /*#__PURE__*/React.createElement(ProductCard, {
    key: p.id,
    brand: p.brand,
    name: p.name,
    price: p.price,
    image: p.image,
    verdicts: p.verdicts,
    twins: p.twins,
    saved: !!saved[p.id],
    onSave: () => setSaved(s => ({
      ...s,
      [p.id]: !s[p.id]
    })),
    style: {
      cursor: 'pointer'
    },
    onClick: onOpen
  }))));
}
window.FeedScreen = FeedScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/neu-app/FeedScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/neu-app/NeuApp.jsx
try { (() => {
// Neu app shell: iOS status bar, screen router, TabBar, Lucide icon helper.
const {
  useState,
  useEffect
} = React;

// Lucide icon helper — renders SVG via the UMD build, re-scans after paint.
function Icon({
  name,
  size = 22,
  color = 'currentColor',
  strokeWidth = 2,
  style = {}
}) {
  useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  });
  return /*#__PURE__*/React.createElement("i", {
    "data-lucide": name,
    style: {
      width: size,
      height: size,
      color,
      display: 'inline-flex',
      ...style
    },
    "data-stroke": strokeWidth
  });
}
function StatusBar({
  dark = false
}) {
  const c = dark ? 'var(--ink-inv)' : 'var(--ink)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px 22px 4px',
      fontFamily: 'var(--font-body)',
      fontWeight: 600,
      fontSize: 14,
      color: c
    }
  }, /*#__PURE__*/React.createElement("span", null, "9:41"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      gap: 6,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "signal",
    size: 15,
    color: c
  }), /*#__PURE__*/React.createElement(Icon, {
    name: "wifi",
    size: 15,
    color: c
  }), /*#__PURE__*/React.createElement(Icon, {
    name: "battery-full",
    size: 17,
    color: c
  })));
}
function NeuApp() {
  const [screen, setScreen] = useState('quiz'); // quiz → result → feed → product → profile
  const [tab, setTab] = useState('feed');
  const D = window.NEU_DATA;
  const {
    TabBar
  } = window.NeuDesignSystem_32f7fb;
  const go = s => {
    setScreen(s);
    if (['feed', 'profile'].includes(s)) setTab(s === 'profile' ? 'you' : 'feed');
  };
  const showTabs = ['feed', 'profile', 'product'].includes(screen);
  const darkStatus = false;
  const screens = {
    quiz: /*#__PURE__*/React.createElement(window.QuizScreen, {
      onDone: () => go('result')
    }),
    result: /*#__PURE__*/React.createElement(window.ResultScreen, {
      onDone: () => go('feed')
    }),
    feed: /*#__PURE__*/React.createElement(window.FeedScreen, {
      onOpen: () => go('product'),
      onProfile: () => go('profile')
    }),
    product: /*#__PURE__*/React.createElement(window.ProductScreen, {
      onBack: () => go('feed')
    }),
    profile: /*#__PURE__*/React.createElement(window.ProfileScreen, {
      onRetake: () => go('quiz')
    })
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: 390,
      height: 844,
      background: 'var(--paper)',
      borderRadius: 44,
      overflow: 'hidden',
      boxShadow: 'var(--shadow-lg)',
      border: '1px solid var(--line)',
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement(StatusBar, {
    dark: darkStatus
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: 'auto',
      position: 'relative'
    }
  }, screens[screen]), showTabs && /*#__PURE__*/React.createElement(TabBar, {
    active: tab,
    onChange: k => {
      setTab(k);
      if (k === 'you') go('profile');else go('feed');
    },
    items: [{
      key: 'feed',
      label: 'For You',
      icon: /*#__PURE__*/React.createElement(Icon, {
        name: "sparkles",
        size: 22
      })
    }, {
      key: 'search',
      label: 'Discover',
      icon: /*#__PURE__*/React.createElement(Icon, {
        name: "search",
        size: 22
      })
    }, {
      key: 'saved',
      label: 'Saved',
      icon: /*#__PURE__*/React.createElement(Icon, {
        name: "heart",
        size: 22
      })
    }, {
      key: 'you',
      label: 'You',
      icon: /*#__PURE__*/React.createElement(Icon, {
        name: "user",
        size: 22
      })
    }]
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 8,
      left: '50%',
      transform: 'translateX(-50%)',
      width: 134,
      height: 5,
      borderRadius: 3,
      background: 'rgba(42,31,24,.28)'
    }
  }));
}
Object.assign(window, {
  NeuApp,
  Icon,
  StatusBar
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/neu-app/NeuApp.jsx", error: String((e && e.message) || e) }); }

// ui_kits/neu-app/ProductScreen.jsx
try { (() => {
// Product detail — tone-twin verdicts, shade match, reviews.
function ProductScreen({
  onBack
}) {
  const d = window.NEU_DATA.detail;
  const {
    Button,
    Badge,
    Avatar
  } = window.NeuDesignSystem_32f7fb;
  const [saved, setSaved] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      paddingBottom: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      height: 260,
      background: d.image
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onBack,
    style: {
      position: 'absolute',
      top: 14,
      left: 16,
      width: 38,
      height: 38,
      borderRadius: 999,
      border: 'none',
      background: 'rgba(255,255,255,.9)',
      boxShadow: 'var(--shadow-sm)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(window.Icon, {
    name: "arrow-left",
    size: 20,
    color: "var(--ink)"
  })), /*#__PURE__*/React.createElement("button", {
    onClick: () => setSaved(s => !s),
    style: {
      position: 'absolute',
      top: 14,
      right: 16,
      width: 38,
      height: 38,
      borderRadius: 999,
      border: 'none',
      background: 'rgba(255,255,255,.9)',
      boxShadow: 'var(--shadow-sm)',
      color: saved ? 'var(--berry)' : 'var(--ink-2)',
      fontSize: 18,
      cursor: 'pointer'
    }
  }, saved ? '♥' : '♡')), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '18px 22px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      letterSpacing: '.08em',
      textTransform: 'uppercase',
      color: 'var(--ink-3)'
    }
  }, d.brand), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 28,
      lineHeight: 1.1,
      letterSpacing: '-.02em',
      color: 'var(--ink)',
      margin: '4px 0 8px'
    }
  }, d.name), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontWeight: 600,
      fontSize: 18,
      color: 'var(--ink)'
    }
  }, d.price), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      color: 'var(--amethyst-deep)'
    }
  }, "Shade ", d.shade)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap',
      marginBottom: 18
    }
  }, d.verdicts.map(v => /*#__PURE__*/React.createElement(Badge, {
    key: v,
    tone: "good"
  }, v))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--amethyst-soft)',
      borderRadius: 'var(--r-md)',
      padding: '14px 16px',
      display: 'flex',
      gap: 12,
      marginBottom: 22
    }
  }, /*#__PURE__*/React.createElement(window.Icon, {
    name: "sparkles",
    size: 20,
    color: "var(--amethyst-deep)"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 14,
      lineHeight: 1.45,
      color: 'var(--amethyst-deep)'
    }
  }, d.matchNote)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 20,
      color: 'var(--ink)',
      margin: '0 0 12px'
    }
  }, "From your tone twins"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
      marginBottom: 22
    }
  }, d.reviews.map(r => /*#__PURE__*/React.createElement("div", {
    key: r.name,
    style: {
      display: 'flex',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: r.name,
    tone: r.tone,
    size: 40
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontWeight: 600,
      fontSize: 14,
      color: 'var(--ink)'
    }
  }, r.name), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      color: 'var(--ink-3)'
    }
  }, "MST-", String(r.tone).padStart(2, '0'))), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 14,
      lineHeight: 1.5,
      color: 'var(--ink-2)',
      margin: '3px 0 0'
    }
  }, r.text))))), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    full: true,
    icon: /*#__PURE__*/React.createElement(window.Icon, {
      name: "shopping-bag",
      size: 18,
      color: "#fff"
    })
  }, "Shop this shade")));
}
window.ProductScreen = ProductScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/neu-app/ProductScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/neu-app/ProfileScreen.jsx
try { (() => {
// Profile / You — your tone, twins, and what you've posted.
function ProfileScreen({
  onRetake
}) {
  const {
    you,
    twins,
    products
  } = window.NEU_DATA;
  const {
    Button,
    Badge,
    Avatar,
    ToneSwatch
  } = window.NeuDesignSystem_32f7fb;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      paddingBottom: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '12px 22px 20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(ToneSwatch, {
    tone: you.tone,
    selected: true,
    size: 72
  }), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 26,
      letterSpacing: '-.02em',
      color: 'var(--ink)',
      margin: '12px 0 2px'
    }
  }, you.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 13,
      color: 'var(--ink-2)',
      marginBottom: 10
    }
  }, you.code, " \xB7 ", you.undertone), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "olive"
  }, "Olive undertone"), /*#__PURE__*/React.createElement(Badge, {
    tone: "good"
  }, "Warm-leaning"))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 22px',
      marginBottom: 22
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface)',
      border: '1px solid var(--line)',
      borderRadius: 'var(--r-lg)',
      boxShadow: 'var(--shadow-sm)',
      padding: '16px 18px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 20,
      color: 'var(--ink)'
    }
  }, "1,240 tone twins"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 13,
      color: 'var(--ink-2)',
      marginTop: 2
    }
  }, "share your MST-07 olive tone")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex'
    }
  }, twins.slice(0, 4).map((t, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      marginLeft: i ? -10 : 0
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: t.name,
    tone: t.tone,
    size: 34,
    style: {
      boxShadow: '0 0 0 2px var(--surface)'
    }
  })))))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 22px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 20,
      color: 'var(--ink)'
    }
  }, "What works on me"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 13,
      fontWeight: 600,
      color: 'var(--amethyst-deep)'
    }
  }, "Post")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: 6,
      padding: '0 22px',
      marginBottom: 22
    }
  }, products.concat(products.slice(0, 2)).map((p, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      aspectRatio: '1',
      borderRadius: 'var(--r-sm)',
      background: p.image,
      position: 'relative',
      boxShadow: 'inset 0 0 0 1px rgba(42,31,24,.06)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      bottom: 6,
      left: 6,
      background: 'var(--good-soft)',
      color: 'var(--amethyst-deep)',
      fontFamily: 'var(--font-body)',
      fontWeight: 600,
      fontSize: 10,
      padding: '2px 6px',
      borderRadius: 999
    }
  }, p.verdicts[0])))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 22px'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    full: true,
    onClick: onRetake,
    icon: /*#__PURE__*/React.createElement(window.Icon, {
      name: "rotate-ccw",
      size: 16,
      color: "var(--amethyst-deep)"
    })
  }, "Retake the quiz")));
}
window.ProfileScreen = ProfileScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/neu-app/ProfileScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/neu-app/QuizScreen.jsx
try { (() => {
// Quiz screen — the 30-second, no-camera quiz.
function QuizScreen({
  onDone
}) {
  const D = window.NEU_DATA.quiz;
  const {
    Button,
    QuizOption
  } = window.NeuDesignSystem_32f7fb;
  const [pick, setPick] = React.useState('olive');
  const pct = Math.round(D.step / D.total * 100);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      padding: '8px 22px 24px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      marginBottom: 22
    }
  }, /*#__PURE__*/React.createElement(window.Icon, {
    name: "arrow-left",
    size: 22,
    color: "var(--ink)"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 6,
      background: 'var(--paper-sink)',
      borderRadius: 999,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: pct + '%',
      height: '100%',
      background: 'var(--amethyst)',
      borderRadius: 999
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      color: 'var(--ink-3)'
    }
  }, D.step, "/", D.total)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      letterSpacing: '.1em',
      textTransform: 'uppercase',
      color: 'var(--amethyst-deep)',
      marginBottom: 8
    }
  }, "Your undertone"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 32,
      lineHeight: 1.08,
      letterSpacing: '-.02em',
      color: 'var(--ink)',
      margin: '0 0 8px'
    }
  }, D.q), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 15,
      lineHeight: 1.5,
      color: 'var(--ink-2)',
      margin: '0 0 22px'
    }
  }, D.help), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, D.options.map(o => /*#__PURE__*/React.createElement(QuizOption, {
    key: o.key,
    selected: pick === o.key,
    swatch: o.swatch,
    sublabel: o.sub,
    onClick: () => setPick(o.key)
  }, o.label))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    full: true,
    onClick: onDone
  }, "Continue"));
}
window.QuizScreen = QuizScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/neu-app/QuizScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/neu-app/ResultScreen.jsx
try { (() => {
// Result screen — your Monk Scale placement + undertone (including olive).
function ResultScreen({
  onDone
}) {
  const {
    you
  } = window.NEU_DATA;
  const {
    Button,
    ToneSwatch,
    Badge
  } = window.NeuDesignSystem_32f7fb;
  const tones = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100%',
      padding: '12px 22px 24px',
      background: 'var(--paper)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      letterSpacing: '.1em',
      textTransform: 'uppercase',
      color: 'var(--amethyst-deep)',
      marginBottom: 10
    }
  }, "Your result"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 34,
      lineHeight: 1.06,
      letterSpacing: '-.02em',
      color: 'var(--ink)',
      margin: '0 0 6px'
    }
  }, "You\u2019re ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontStyle: 'italic',
      color: 'var(--amethyst-deep)'
    }
  }, "MST-07, olive"), "."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 15,
      lineHeight: 1.5,
      color: 'var(--ink-2)',
      margin: '0 0 22px'
    }
  }, "A warm mid-deep tone with an olive undertone \u2014 the one most tools pretend doesn\u2019t exist. From here, everything is filtered through people who share it."), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface)',
      border: '1px solid var(--line)',
      borderRadius: 'var(--r-lg)',
      boxShadow: 'var(--shadow-md)',
      padding: 20,
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      letterSpacing: '.08em',
      textTransform: 'uppercase',
      color: 'var(--ink-3)',
      marginBottom: 14
    }
  }, "Monk Skin Tone Scale"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 5,
      alignItems: 'flex-end',
      height: 64
    }
  }, tones.map(t => /*#__PURE__*/React.createElement("div", {
    key: t,
    style: {
      flex: 1,
      height: t === you.tone ? 64 : 44,
      borderRadius: 6,
      background: `var(--mst-${t})`,
      boxShadow: t === you.tone ? '0 0 0 3px var(--paper),0 0 0 6px var(--amethyst)' : 'inset 0 0 0 1px rgba(42,31,24,.1)',
      position: 'relative'
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14,
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "olive"
  }, "Olive undertone"), /*#__PURE__*/React.createElement(Badge, {
    tone: "good"
  }, "Warm-leaning"))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--amethyst-soft)',
      borderRadius: 'var(--r-lg)',
      padding: '16px 18px',
      marginBottom: 'auto',
      display: 'flex',
      gap: 12,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(window.Icon, {
    name: "users",
    size: 22,
    color: "var(--amethyst-deep)"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 14,
      lineHeight: 1.4,
      color: 'var(--amethyst-deep)'
    }
  }, /*#__PURE__*/React.createElement("b", null, "1,240 tone twins"), " share MST-07 olive. You\u2019ll see what worked on them first.")), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 20
    }
  }), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    full: true,
    onClick: onDone
  }, "Meet my tone twins"));
}
window.ResultScreen = ResultScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/neu-app/ResultScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/neu-app/data.js
try { (() => {
// Neu UI kit — shared fake data (no photos; color placeholders only)
window.NEU_DATA = {
  you: {
    name: 'You',
    tone: 7,
    undertone: 'Olive',
    code: 'MST-07'
  },
  quiz: {
    step: 3,
    total: 6,
    q: 'Which undertone sounds most like you?',
    help: 'No camera, no photos — just you. 30 seconds, promise.',
    options: [{
      key: 'warm',
      label: 'Warm',
      sub: 'Gold jewelry wins; I tan easily',
      swatch: 'var(--tone-warm)'
    }, {
      key: 'cool',
      label: 'Cool',
      sub: 'Silver suits me; I burn then pink',
      swatch: 'var(--tone-cool)'
    }, {
      key: 'neutral',
      label: 'Neutral',
      sub: 'Honestly, both look fine',
      swatch: 'var(--tone-neutral)'
    }, {
      key: 'olive',
      label: 'Olive',
      sub: 'A green-grey cast most tools miss',
      swatch: 'var(--tone-olive)'
    }]
  },
  twins: [{
    name: 'Ama K.',
    tone: 7
  }, {
    name: 'Priya S.',
    tone: 7
  }, {
    name: 'Lena O.',
    tone: 8
  }, {
    name: 'Rae M.',
    tone: 6
  }, {
    name: 'Dee W.',
    tone: 7
  }],
  products: [{
    id: 1,
    brand: 'Rare Beauty',
    name: 'Liquid Touch Foundation',
    price: '$32',
    image: 'linear-gradient(135deg,#E9C9A6,#C99B6E)',
    verdicts: ['Didn\u2019t oxidize', 'True to olive'],
    twins: {
      count: 214,
      tone: 7
    }
  }, {
    id: 2,
    brand: 'Supergoop',
    name: 'Unseen Sunscreen SPF 40',
    price: '$38',
    image: 'linear-gradient(135deg,#EFE6D3,#D9C9A8)',
    verdicts: ['No white cast'],
    twins: {
      count: 389,
      tone: 7
    }
  }, {
    id: 3,
    brand: 'Rare Beauty',
    name: 'Soft Pinch Blush',
    price: '$23',
    image: 'linear-gradient(135deg,#F2D6DC,#D89AAE)',
    verdicts: ['Didn\u2019t go muddy', 'Buildable'],
    twins: {
      count: 156,
      tone: 7
    }
  }, {
    id: 4,
    brand: 'Kosas',
    name: 'Revealer Concealer',
    price: '$28',
    image: 'linear-gradient(135deg,#E6C6A0,#BE9163)',
    verdicts: ['No grey cast', 'Olive-friendly'],
    twins: {
      count: 98,
      tone: 8
    }
  }],
  detail: {
    brand: 'Rare Beauty',
    name: 'Liquid Touch Foundation',
    price: '$32',
    shade: '320N (olive)',
    image: 'linear-gradient(135deg,#E9C9A6,#C99B6E)',
    verdicts: ['Didn\u2019t oxidize', 'True to olive', 'Medium buildable'],
    matchNote: '87% of your tone twins wear 310\u2013330. Reach for the N (olive) shades, not W.',
    reviews: [{
      name: 'Ama K.',
      tone: 7,
      text: 'Finally a foundation that doesn\u2019t turn orange on me by 2pm. The olive undertone is real.'
    }, {
      name: 'Priya S.',
      tone: 7,
      text: 'Went a half-shade darker than the app suggested and it\u2019s perfect. No oxidizing at all.'
    }]
  }
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/neu-app/data.js", error: String((e && e.message) || e) }); }

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.ProductCard = __ds_scope.ProductCard;

__ds_ns.ToneSwatch = __ds_scope.ToneSwatch;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Chip = __ds_scope.Chip;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.QuizOption = __ds_scope.QuizOption;

__ds_ns.SegmentedControl = __ds_scope.SegmentedControl;

__ds_ns.TabBar = __ds_scope.TabBar;

})();
