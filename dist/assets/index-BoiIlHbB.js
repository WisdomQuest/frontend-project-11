(function () {
  const e = document.createElement('link').relList; if (e && e.supports && e.supports('modulepreload')) return; for (const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i); new MutationObserver((i) => {
    for (const r of i) if (r.type === 'childList') for (const a of r.addedNodes)a.tagName === 'LINK' && a.rel === 'modulepreload' && s(a)
  }).observe(document, { childList: !0, subtree: !0 }); function t(i) {
    const r = {}; return i.integrity && (r.integrity = i.integrity), i.referrerPolicy && (r.referrerPolicy = i.referrerPolicy), i.crossOrigin === 'use-credentials' ? r.credentials = 'include' : i.crossOrigin === 'anonymous' ? r.credentials = 'omit' : r.credentials = 'same-origin', r
  } function s(i) {
    if (i.ep) return; i.ep = !0; const r = t(i); fetch(i.href, r)
  }
}()); const W = '.'; const je = Symbol('target'); const pt = Symbol('unsubscribe'); function Le(n) {
  return n instanceof Date || n instanceof Set || n instanceof Map || n instanceof WeakSet || n instanceof WeakMap || ArrayBuffer.isView(n)
} function Dt(n) {
  return (typeof n === 'object' ? n === null : typeof n !== 'function') || n instanceof RegExp
} const P = Array.isArray; function xe(n) {
  return typeof n === 'symbol'
} const M = {
  after(n, e) {
    return P(n) ? n.slice(e.length) : e === '' ? n : n.slice(e.length + 1)
  },
  concat(n, e) {
    return P(n) ? (n = [...n], e && n.push(e), n) : e && e.toString !== void 0 ? (n !== '' && (n += W), xe(e) ? n + e.toString() : n + e) : n
  },
  initial(n) {
    if (P(n)) return n.slice(0, -1); if (n === '') return n; const e = n.lastIndexOf(W); return e === -1 ? '' : n.slice(0, e)
  },
  last(n) {
    if (P(n)) return n.at(-1) ?? ''; if (n === '') return n; const e = n.lastIndexOf(W); return e === -1 ? n : n.slice(e + 1)
  },
  walk(n, e) {
    if (P(n)) for (const t of n)e(t); else if (n !== '') {
      let t = 0; let s = n.indexOf(W); if (s === -1)e(n); else for (;t < n.length;)s === -1 && (s = n.length), e(n.slice(t, s)), t = s + 1, s = n.indexOf(W, t)
    }
  },
  get(n, e) {
    return this.walk(e, (t) => {
      n && (n = n[t])
    }), n
  },
  isSubPath(n, e) {
    if (P(n)) {
      if (n.length < e.length) return !1; for (let t = 0; t < e.length; t++) if (n[t] !== e[t]) return !1; return !0
    } return n.length < e.length ? !1 : n === e ? !0 : n.startsWith(e) ? n[e.length] === W : !1
  },
  isRootPath(n) {
    return P(n) ? n.length === 0 : n === ''
  },
}; function Pt(n) {
  return typeof n === 'object' && typeof n.next === 'function'
} function Nt(n, e, t, s, i) {
  const r = n.next; if (e.name === 'entries') {
    n.next = function () {
      const a = r.call(this); return a.done === !1 && (a.value[0] = i(a.value[0], e, a.value[0], s), a.value[1] = i(a.value[1], e, a.value[0], s)), a
    }
  } else if (e.name === 'values') {
    const a = t[je].keys(); n.next = function () {
      const o = r.call(this); return o.done === !1 && (o.value = i(o.value, e, a.next().value, s)), o
    }
  } else {
    n.next = function () {
      const a = r.call(this); return a.done === !1 && (a.value = i(a.value, e, a.value, s)), a
    }
  } return n
} function qe(n, e, t) {
  return n.isUnsubscribed || e.ignoreSymbols && xe(t) || e.ignoreUnderscores && t.charAt(0) === '_' || 'ignoreKeys' in e && e.ignoreKeys.includes(t)
} class At {
  constructor(e) {
    this._equals = e, this._proxyCache = new WeakMap(), this._pathCache = new WeakMap(), this.isUnsubscribed = !1
  }

  _getDescriptorCache() {
    return this._descriptorCache === void 0 && (this._descriptorCache = new WeakMap()), this._descriptorCache
  }

  _getProperties(e) {
    const t = this._getDescriptorCache(); let s = t.get(e); return s === void 0 && (s = {}, t.set(e, s)), s
  }

  _getOwnPropertyDescriptor(e, t) {
    if (this.isUnsubscribed) return Reflect.getOwnPropertyDescriptor(e, t); const s = this._getProperties(e); let i = s[t]; return i === void 0 && (i = Reflect.getOwnPropertyDescriptor(e, t), s[t] = i), i
  }

  getProxy(e, t, s, i) {
    if (this.isUnsubscribed) return e; const r = e[i]; const a = r ?? e; this._pathCache.set(a, t); let o = this._proxyCache.get(a); return o === void 0 && (o = r === void 0 ? new Proxy(e, s) : e, this._proxyCache.set(a, o)), o
  }

  getPath(e) {
    return this.isUnsubscribed ? void 0 : this._pathCache.get(e)
  }

  isDetached(e, t) {
    return !Object.is(e, M.get(t, this.getPath(e)))
  }

  defineProperty(e, t, s) {
    return Reflect.defineProperty(e, t, s) ? (this.isUnsubscribed || (this._getProperties(e)[t] = s), !0) : !1
  }

  setProperty(e, t, s, i, r) {
    if (!this._equals(r, s) || !(t in e)) {
      const a = this._getOwnPropertyDescriptor(e, t); return a !== void 0 && 'set' in a ? Reflect.set(e, t, s, i) : Reflect.set(e, t, s)
    } return !0
  }

  deleteProperty(e, t, s) {
    if (Reflect.deleteProperty(e, t)) {
      if (!this.isUnsubscribed) {
        const i = this._getDescriptorCache().get(e); i && (delete i[t], this._pathCache.delete(s))
      } return !0
    } return !1
  }

  isSameDescriptor(e, t, s) {
    const i = this._getOwnPropertyDescriptor(t, s); return e !== void 0 && i !== void 0 && Object.is(e.value, i.value) && (e.writable || !1) === (i.writable || !1) && (e.enumerable || !1) === (i.enumerable || !1) && (e.configurable || !1) === (i.configurable || !1) && e.get === i.get && e.set === i.set
  }

  isGetInvariant(e, t) {
    const s = this._getOwnPropertyDescriptor(e, t); return s !== void 0 && s.configurable !== !0 && s.writable !== !0
  }

  unsubscribe() {
    this._descriptorCache = null, this._pathCache = null, this._proxyCache = null, this.isUnsubscribed = !0
  }
} function Re(n) {
  return toString.call(n) === '[object Object]'
} function de() {
  return !0
} function ee(n, e) {
  return n.length !== e.length || n.some((t, s) => e[s] !== t)
} const gt = new Set(['hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'toLocaleString', 'toString', 'valueOf']); const Mt = new Set(['concat', 'includes', 'indexOf', 'join', 'keys', 'lastIndexOf']); const mt = {
  push: de, pop: de, shift: de, unshift: de, copyWithin: ee, reverse: ee, sort: ee, splice: ee, flat: ee, fill: ee,
}; const It = new Set([...gt, ...Mt, ...Object.keys(mt)]); function pe(n, e) {
  if (n.size !== e.size) return !0; for (const t of n) if (!e.has(t)) return !0; return !1
} const yt = ['keys', 'values', 'entries']; const bt = new Set(['has', 'toString']); const xt = {
  add: pe, clear: pe, delete: pe, forEach: pe,
}; const jt = new Set([...bt, ...Object.keys(xt), ...yt]); function ge(n, e) {
  if (n.size !== e.size) return !0; let t; for (const [s, i] of n) if (t = e.get(s), t !== i || t === void 0 && !e.has(s)) return !0; return !1
} const Vt = new Set([...bt, 'get']); const St = {
  set: ge, clear: ge, delete: ge, forEach: ge,
}; const Ut = new Set([...Vt, ...Object.keys(St), ...yt]); class G {
  constructor(e, t, s, i) {
    this._path = t, this._isChanged = !1, this._clonedCache = new Set(), this._hasOnValidate = i, this._changes = i ? [] : null, this.clone = t === void 0 ? e : this._shallowClone(e)
  }

  static isHandledMethod(e) {
    return gt.has(e)
  }

  _shallowClone(e) {
    let t = e; if (Re(e))t = { ...e }; else if (P(e) || ArrayBuffer.isView(e))t = [...e]; else if (e instanceof Date)t = new Date(e); else if (e instanceof Set)t = new Set([...e].map((s) => this._shallowClone(s))); else if (e instanceof Map) {
      t = new Map(); for (const [s, i] of e.entries())t.set(s, this._shallowClone(i))
    } return this._clonedCache.add(t), t
  }

  preferredThisArg(e, t, s, i) {
    return e ? (P(i) ? this._onIsChanged = mt[t] : i instanceof Set ? this._onIsChanged = xt[t] : i instanceof Map && (this._onIsChanged = St[t]), i) : s
  }

  update(e, t, s) {
    const i = M.after(e, this._path); if (t !== 'length') {
      let r = this.clone; M.walk(i, (a) => {
        r != null && r[a] && (this._clonedCache.has(r[a]) || (r[a] = this._shallowClone(r[a])), r = r[a])
      }), this._hasOnValidate && this._changes.push({ path: i, property: t, previous: s }), r != null && r[t] && (r[t] = s)
    } this._isChanged = !0
  }

  undo(e) {
    let t; for (let s = this._changes.length - 1; s !== -1; s--)t = this._changes[s], M.get(e, t.path)[t.property] = t.previous
  }

  isChanged(e) {
    return this._onIsChanged === void 0 ? this._isChanged : this._onIsChanged(this.clone, e)
  }

  isPathApplicable(e) {
    return M.isRootPath(this._path) || M.isSubPath(e, this._path)
  }
} class Be extends G {
  static isHandledMethod(e) {
    return It.has(e)
  }
} class Ht extends G {
  undo(e) {
    e.setTime(this.clone.getTime())
  }

  isChanged(e, t) {
    return !t(this.clone.valueOf(), e.valueOf())
  }
} class We extends G {
  static isHandledMethod(e) {
    return jt.has(e)
  }

  undo(e) {
    for (const t of this.clone)e.add(t); for (const t of e) this.clone.has(t) || e.delete(t)
  }
} class Je extends G {
  static isHandledMethod(e) {
    return Ut.has(e)
  }

  undo(e) {
    for (const [t, s] of this.clone.entries())e.set(t, s); for (const t of e.keys()) this.clone.has(t) || e.delete(t)
  }
} class zt extends G {
  constructor(e, t, s, i) {
    super(void 0, t, s, i), this._argument1 = s[0], this._weakValue = e.has(this._argument1)
  }

  isChanged(e) {
    return this._weakValue !== e.has(this._argument1)
  }

  undo(e) {
    this._weakValue && !e.has(this._argument1) ? e.add(this._argument1) : e.delete(this._argument1)
  }
} class Kt extends G {
  constructor(e, t, s, i) {
    super(void 0, t, s, i), this._weakKey = s[0], this._weakHas = e.has(this._weakKey), this._weakValue = e.get(this._weakKey)
  }

  isChanged(e) {
    return this._weakValue !== e.get(this._weakKey)
  }

  undo(e) {
    const t = e.has(this._weakKey); this._weakHas && !t ? e.set(this._weakKey, this._weakValue) : !this._weakHas && t ? e.delete(this._weakKey) : this._weakValue !== e.get(this._weakKey) && e.set(this._weakKey, this._weakValue)
  }
} class Q {
  constructor(e) {
    this._stack = [], this._hasOnValidate = e
  }

  static isHandledType(e) {
    return Re(e) || P(e) || Le(e)
  }

  static isHandledMethod(e, t) {
    return Re(e) ? G.isHandledMethod(t) : P(e) ? Be.isHandledMethod(t) : e instanceof Set ? We.isHandledMethod(t) : e instanceof Map ? Je.isHandledMethod(t) : Le(e)
  }

  get isCloning() {
    return this._stack.length > 0
  }

  start(e, t, s) {
    let i = G; P(e) ? i = Be : e instanceof Date ? i = Ht : e instanceof Set ? i = We : e instanceof Map ? i = Je : e instanceof WeakSet ? i = zt : e instanceof WeakMap && (i = Kt), this._stack.push(new i(e, t, s, this._hasOnValidate))
  }

  update(e, t, s) {
    this._stack.at(-1).update(e, t, s)
  }

  preferredThisArg(e, t, s) {
    const { name: i } = e; const r = Q.isHandledMethod(s, i); return this._stack.at(-1).preferredThisArg(r, i, t, s)
  }

  isChanged(e, t, s) {
    return this._stack.at(-1).isChanged(e, t, s)
  }

  isPartOfClone(e) {
    return this._stack.at(-1).isPathApplicable(e)
  }

  undo(e) {
    this._previousClone !== void 0 && this._previousClone.undo(e)
  }

  stop() {
    return this._previousClone = this._stack.pop(), this._previousClone.clone
  }
} const qt = {
  equals: Object.is, isShallow: !1, pathAsArray: !1, ignoreSymbols: !1, ignoreUnderscores: !1, ignoreDetached: !1, details: !1,
}; const ne = (n, e, t = {}) => {
  t = { ...qt, ...t }; const s = Symbol('ProxyTarget'); const {
    equals: i, isShallow: r, ignoreDetached: a, details: o,
  } = t; const l = new At(i); const u = typeof t.onValidate === 'function'; const c = new Q(u); const f = (h, d, y, x, C) => !u || c.isCloning || t.onValidate(M.concat(l.getPath(h), d), y, x, C) === !0; const m = (h, d, y, x) => {
    !qe(l, t, d) && !(a && l.isDetached(h, n)) && p(l.getPath(h), d, y, x)
  }; const p = (h, d, y, x, C) => {
    c.isCloning && c.isPartOfClone(h) ? c.update(h, d, x) : e(M.concat(h, d), y, x, C)
  }; const g = (h) => h && (h[s] ?? h); const S = (h, d, y, x) => {
    if (Dt(h) || y === 'constructor' || r && !Q.isHandledMethod(d, y) || qe(l, t, y) || l.isGetInvariant(d, y) || a && l.isDetached(d, n)) return h; x === void 0 && (x = l.getPath(d)); const C = M.concat(x, y); const $ = l.getPath(h); return $ && v(C, $) ? l.getProxy(h, $, b, s) : l.getProxy(h, C, b, s)
  }; const v = (h, d) => {
    if (xe(h) || h.length <= d.length || P(d) && d.length === 0) return !1; const y = P(h) ? h : h.split(W); const x = P(d) ? d : d.split(W); return y.length <= x.length ? !1 : !x.some((C, $) => C !== y[$])
  }; const b = {
    get(h, d, y) {
      if (xe(d)) {
        if (d === s || d === je) return h; if (d === pt && !l.isUnsubscribed && l.getPath(h).length === 0) return l.unsubscribe(), h
      } const x = Le(h) ? Reflect.get(h, d) : Reflect.get(h, d, y); return S(x, h, d)
    },
    set(h, d, y, x) {
      y = g(y); const C = h[s] ?? h; const $ = C[d]; if (i($, y) && d in h) return !0; const E = f(h, d, y, $); return E && l.setProperty(C, d, y, x, $) ? (m(h, d, h[d], $), !0) : !E
    },
    defineProperty(h, d, y) {
      if (!l.isSameDescriptor(y, h, d)) {
        const x = h[d]; f(h, d, y.value, x) && l.defineProperty(h, d, y, x) && m(h, d, y.value, x)
      } return !0
    },
    deleteProperty(h, d) {
      if (!Reflect.has(h, d)) return !0; const y = Reflect.get(h, d); const x = f(h, d, void 0, y); return x && l.deleteProperty(h, d, y) ? (m(h, d, void 0, y), !0) : !x
    },
    apply(h, d, y) {
      const x = d[s] ?? d; if (l.isUnsubscribed) return Reflect.apply(h, x, y); if ((o === !1 || o !== !0 && !o.includes(h.name)) && Q.isHandledType(x)) {
        let C = M.initial(l.getPath(h)); const $ = Q.isHandledMethod(x, h.name); c.start(x, C, y); let E = Reflect.apply(h, c.preferredThisArg(h, d, x), $ ? y.map((N) => g(N)) : y); const _ = c.isChanged(x, i); const k = c.stop(); if (Q.isHandledType(E) && $ && (d instanceof Map && h.name === 'get' && (C = M.concat(C, y[0])), E = l.getProxy(E, C, b)), _) {
          const N = { name: h.name, args: y, result: E }; const R = c.isCloning ? M.initial(C) : C; const T = c.isCloning ? M.last(C) : ''; f(M.get(n, R), T, x, k, N) ? p(R, T, x, k, N) : c.undo(x)
        } return (d instanceof Map || d instanceof Set) && Pt(E) ? Nt(E, h, d, C, S) : E
      } return Reflect.apply(h, d, y)
    },
  }; const w = l.getProxy(n, t.pathAsArray ? [] : '', b); return e = e.bind(w), u && (t.onValidate = t.onValidate.bind(w)), w
}; ne.target = (n) => (n == null ? void 0 : n[je]) ?? n; ne.unsubscribe = (n) => (n == null ? void 0 : n[pt]) ?? n; const O = (n) => typeof n === 'string'; const oe = () => {
  let n; let e; const t = new Promise((s, i) => {
    n = s, e = i
  }); return t.resolve = n, t.reject = e, t
}; const Ge = (n) => (n == null ? '' : `${n}`); const Bt = (n, e, t) => {
  n.forEach((s) => {
    e[s] && (t[s] = e[s])
  })
}; const Wt = /###/g; const Ye = (n) => (n && n.indexOf('###') > -1 ? n.replace(Wt, '.') : n); const Ze = (n) => !n || O(n); const le = (n, e, t) => {
  const s = O(e) ? e.split('.') : e; let i = 0; for (;i < s.length - 1;) {
    if (Ze(n)) return {}; const r = Ye(s[i]); !n[r] && t && (n[r] = new t()), Object.prototype.hasOwnProperty.call(n, r) ? n = n[r] : n = {}, ++i
  } return Ze(n) ? {} : { obj: n, k: Ye(s[i]) }
}; const Qe = (n, e, t) => {
  const { obj: s, k: i } = le(n, e, Object); if (s !== void 0 || e.length === 1) {
    s[i] = t; return
  } let r = e[e.length - 1]; let a = e.slice(0, e.length - 1); let o = le(n, a, Object); for (;o.obj === void 0 && a.length;)r = `${a[a.length - 1]}.${r}`, a = a.slice(0, a.length - 1), o = le(n, a, Object), o != null && o.obj && typeof o.obj[`${o.k}.${r}`] < 'u' && (o.obj = void 0); o.obj[`${o.k}.${r}`] = t
}; const Jt = (n, e, t, s) => {
  const { obj: i, k: r } = le(n, e, Object); i[r] = i[r] || [], i[r].push(t)
}; const Se = (n, e) => {
  const { obj: t, k: s } = le(n, e); if (t && Object.prototype.hasOwnProperty.call(t, s)) return t[s]
}; const Gt = (n, e, t) => {
  const s = Se(n, t); return s !== void 0 ? s : Se(e, t)
}; const wt = (n, e, t) => {
  for (const s in e)s !== '__proto__' && s !== 'constructor' && (s in n ? O(n[s]) || n[s] instanceof String || O(e[s]) || e[s] instanceof String ? t && (n[s] = e[s]) : wt(n[s], e[s], t) : n[s] = e[s]); return n
}; const te = (n) => n.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&'); const Yt = {
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '/': '&#x2F;',
}; const Zt = (n) => (O(n) ? n.replace(/[&<>"'\/]/g, (e) => Yt[e]) : n); class Qt {
  constructor(e) {
    this.capacity = e, this.regExpMap = new Map(), this.regExpQueue = []
  }

  getRegExp(e) {
    const t = this.regExpMap.get(e); if (t !== void 0) return t; const s = new RegExp(e); return this.regExpQueue.length === this.capacity && this.regExpMap.delete(this.regExpQueue.shift()), this.regExpMap.set(e, s), this.regExpQueue.push(e), s
  }
} const Xt = [' ', ',', '?', '!', ';']; const es = new Qt(20); const ts = (n, e, t) => {
  e = e || '', t = t || ''; const s = Xt.filter((a) => e.indexOf(a) < 0 && t.indexOf(a) < 0); if (s.length === 0) return !0; const i = es.getRegExp(`(${s.map((a) => (a === '?' ? '\\?' : a)).join('|')})`); let r = !i.test(n); if (!r) {
    const a = n.indexOf(t); a > 0 && !i.test(n.substring(0, a)) && (r = !0)
  } return r
}; const De = (n, e, t = '.') => {
  if (!n) return; if (n[e]) return Object.prototype.hasOwnProperty.call(n, e) ? n[e] : void 0; const s = e.split(t); let i = n; for (let r = 0; r < s.length;) {
    if (!i || typeof i !== 'object') return; let a; let o = ''; for (let l = r; l < s.length; ++l) {
      if (l !== r && (o += t), o += s[l], a = i[o], a !== void 0) {
        if (['string', 'number', 'boolean'].indexOf(typeof a) > -1 && l < s.length - 1) continue; r += l - r + 1; break
      }
    }i = a
  } return i
}; const ue = (n) => (n == null ? void 0 : n.replace('_', '-')); const ss = {
  type: 'logger',
  log(n) {
    this.output('log', n)
  },
  warn(n) {
    this.output('warn', n)
  },
  error(n) {
    this.output('error', n)
  },
  output(n, e) {
    let t; let s; (s = (t = console == null ? void 0 : console[n]) == null ? void 0 : t.apply) == null || s.call(t, console, e)
  },
}; class we {
  constructor(e, t = {}) {
    this.init(e, t)
  }

  init(e, t = {}) {
    this.prefix = t.prefix || 'i18next:', this.logger = e || ss, this.options = t, this.debug = t.debug
  }

  log(...e) {
    return this.forward(e, 'log', '', !0)
  }

  warn(...e) {
    return this.forward(e, 'warn', '', !0)
  }

  error(...e) {
    return this.forward(e, 'error', '')
  }

  deprecate(...e) {
    return this.forward(e, 'warn', 'WARNING DEPRECATED: ', !0)
  }

  forward(e, t, s, i) {
    return i && !this.debug ? null : (O(e[0]) && (e[0] = `${s}${this.prefix} ${e[0]}`), this.logger[t](e))
  }

  create(e) {
    return new we(this.logger, { prefix: `${this.prefix}:${e}:`, ...this.options })
  }

  clone(e) {
    return e = e || this.options, e.prefix = e.prefix || this.prefix, new we(this.logger, e)
  }
} const H = new we(); class $e {
  constructor() {
    this.observers = {}
  }

  on(e, t) {
    return e.split(' ').forEach((s) => {
      this.observers[s] || (this.observers[s] = new Map()); const i = this.observers[s].get(t) || 0; this.observers[s].set(t, i + 1)
    }), this
  }

  off(e, t) {
    if (this.observers[e]) {
      if (!t) {
        delete this.observers[e]; return
      } this.observers[e].delete(t)
    }
  }

  emit(e, ...t) {
    this.observers[e] && Array.from(this.observers[e].entries()).forEach(([i, r]) => {
      for (let a = 0; a < r; a++)i(...t)
    }), this.observers['*'] && Array.from(this.observers['*'].entries()).forEach(([i, r]) => {
      for (let a = 0; a < r; a++)i.apply(i, [e, ...t])
    })
  }
} class Xe extends $e {
  constructor(e, t = { ns: ['translation'], defaultNS: 'translation' }) {
    super(), this.data = e || {}, this.options = t, this.options.keySeparator === void 0 && (this.options.keySeparator = '.'), this.options.ignoreJSONStructure === void 0 && (this.options.ignoreJSONStructure = !0)
  }

  addNamespaces(e) {
    this.options.ns.indexOf(e) < 0 && this.options.ns.push(e)
  }

  removeNamespaces(e) {
    const t = this.options.ns.indexOf(e); t > -1 && this.options.ns.splice(t, 1)
  }

  getResource(e, t, s, i = {}) {
    let u; let c; const r = i.keySeparator !== void 0 ? i.keySeparator : this.options.keySeparator; const a = i.ignoreJSONStructure !== void 0 ? i.ignoreJSONStructure : this.options.ignoreJSONStructure; let o; e.indexOf('.') > -1 ? o = e.split('.') : (o = [e, t], s && (Array.isArray(s) ? o.push(...s) : O(s) && r ? o.push(...s.split(r)) : o.push(s))); const l = Se(this.data, o); return !l && !t && !s && e.indexOf('.') > -1 && (e = o[0], t = o[1], s = o.slice(2).join('.')), l || !a || !O(s) ? l : De((c = (u = this.data) == null ? void 0 : u[e]) == null ? void 0 : c[t], s, r)
  }

  addResource(e, t, s, i, r = { silent: !1 }) {
    const a = r.keySeparator !== void 0 ? r.keySeparator : this.options.keySeparator; let o = [e, t]; s && (o = o.concat(a ? s.split(a) : s)), e.indexOf('.') > -1 && (o = e.split('.'), i = t, t = o[1]), this.addNamespaces(t), Qe(this.data, o, i), r.silent || this.emit('added', e, t, s, i)
  }

  addResources(e, t, s, i = { silent: !1 }) {
    for (const r in s)(O(s[r]) || Array.isArray(s[r])) && this.addResource(e, t, r, s[r], { silent: !0 }); i.silent || this.emit('added', e, t, s)
  }

  addResourceBundle(e, t, s, i, r, a = { silent: !1, skipCopy: !1 }) {
    let o = [e, t]; e.indexOf('.') > -1 && (o = e.split('.'), i = s, s = t, t = o[1]), this.addNamespaces(t); let l = Se(this.data, o) || {}; a.skipCopy || (s = JSON.parse(JSON.stringify(s))), i ? wt(l, s, r) : l = { ...l, ...s }, Qe(this.data, o, l), a.silent || this.emit('added', e, t, s)
  }

  removeResourceBundle(e, t) {
    this.hasResourceBundle(e, t) && delete this.data[e][t], this.removeNamespaces(t), this.emit('removed', e, t)
  }

  hasResourceBundle(e, t) {
    return this.getResource(e, t) !== void 0
  }

  getResourceBundle(e, t) {
    return t || (t = this.options.defaultNS), this.getResource(e, t)
  }

  getDataByLanguage(e) {
    return this.data[e]
  }

  hasLanguageSomeTranslations(e) {
    const t = this.getDataByLanguage(e); return !!(t && Object.keys(t) || []).find((i) => t[i] && Object.keys(t[i]).length > 0)
  }

  toJSON() {
    return this.data
  }
} const Ot = {
  processors: {},
  addPostProcessor(n) {
    this.processors[n.name] = n
  },
  handle(n, e, t, s, i) {
    return n.forEach((r) => {
      let a; e = ((a = this.processors[r]) == null ? void 0 : a.process(e, t, s, i)) ?? e
    }), e
  },
}; const et = {}; const tt = (n) => !O(n) && typeof n !== 'boolean' && typeof n !== 'number'; class Oe extends $e {
  constructor(e, t = {}) {
    super(), Bt(['resourceStore', 'languageUtils', 'pluralResolver', 'interpolator', 'backendConnector', 'i18nFormat', 'utils'], e, this), this.options = t, this.options.keySeparator === void 0 && (this.options.keySeparator = '.'), this.logger = H.create('translator')
  }

  changeLanguage(e) {
    e && (this.language = e)
  }

  exists(e, t = { interpolation: {} }) {
    const s = { ...t }; if (e == null) return !1; const i = this.resolve(e, s); return (i == null ? void 0 : i.res) !== void 0
  }

  extractFromKey(e, t) {
    let s = t.nsSeparator !== void 0 ? t.nsSeparator : this.options.nsSeparator; s === void 0 && (s = ':'); const i = t.keySeparator !== void 0 ? t.keySeparator : this.options.keySeparator; let r = t.ns || this.options.defaultNS || []; const a = s && e.indexOf(s) > -1; const o = !this.options.userDefinedKeySeparator && !t.keySeparator && !this.options.userDefinedNsSeparator && !t.nsSeparator && !ts(e, s, i); if (a && !o) {
      const l = e.match(this.interpolator.nestingRegexp); if (l && l.length > 0) return { key: e, namespaces: O(r) ? [r] : r }; const u = e.split(s); (s !== i || s === i && this.options.ns.indexOf(u[0]) > -1) && (r = u.shift()), e = u.join(i)
    } return { key: e, namespaces: O(r) ? [r] : r }
  }

  translate(e, t, s) {
    let i = typeof t === 'object' ? { ...t } : t; if (typeof i !== 'object' && this.options.overloadTranslationOptionHandler && (i = this.options.overloadTranslationOptionHandler(arguments)), typeof options === 'object' && (i = { ...i }), i || (i = {}), e == null) return ''; Array.isArray(e) || (e = [String(e)]); const r = i.returnDetails !== void 0 ? i.returnDetails : this.options.returnDetails; const a = i.keySeparator !== void 0 ? i.keySeparator : this.options.keySeparator; const { key: o, namespaces: l } = this.extractFromKey(e[e.length - 1], i); const u = l[l.length - 1]; let c = i.nsSeparator !== void 0 ? i.nsSeparator : this.options.nsSeparator; c === void 0 && (c = ':'); const f = i.lng || this.language; const m = i.appendNamespaceToCIMode || this.options.appendNamespaceToCIMode; if ((f == null ? void 0 : f.toLowerCase()) === 'cimode') {
      return m ? r ? {
        res: `${u}${c}${o}`, usedKey: o, exactUsedKey: o, usedLng: f, usedNS: u, usedParams: this.getUsedParamsDetails(i),
      } : `${u}${c}${o}` : r ? {
        res: o, usedKey: o, exactUsedKey: o, usedLng: f, usedNS: u, usedParams: this.getUsedParamsDetails(i),
      } : o
    } const p = this.resolve(e, i); let g = p == null ? void 0 : p.res; const S = (p == null ? void 0 : p.usedKey) || o; const v = (p == null ? void 0 : p.exactUsedKey) || o; const b = ['[object Number]', '[object Function]', '[object RegExp]']; const w = i.joinArrays !== void 0 ? i.joinArrays : this.options.joinArrays; const h = !this.i18nFormat || this.i18nFormat.handleAsObject; const d = i.count !== void 0 && !O(i.count); const y = Oe.hasDefaultValue(i); const x = d ? this.pluralResolver.getSuffix(f, i.count, i) : ''; const C = i.ordinal && d ? this.pluralResolver.getSuffix(f, i.count, { ordinal: !1 }) : ''; const $ = d && !i.ordinal && i.count === 0; const E = $ && i[`defaultValue${this.options.pluralSeparator}zero`] || i[`defaultValue${x}`] || i[`defaultValue${C}`] || i.defaultValue; let _ = g; h && !g && y && (_ = E); const k = tt(_); const N = Object.prototype.toString.apply(_); if (h && _ && k && b.indexOf(N) < 0 && !(O(w) && Array.isArray(_))) {
      if (!i.returnObjects && !this.options.returnObjects) {
        this.options.returnedObjectHandler || this.logger.warn('accessing an object - but returnObjects options is not enabled!'); const R = this.options.returnedObjectHandler ? this.options.returnedObjectHandler(S, _, { ...i, ns: l }) : `key '${o} (${this.language})' returned an object instead of string.`; return r ? (p.res = R, p.usedParams = this.getUsedParamsDetails(i), p) : R
      } if (a) {
        const R = Array.isArray(_); const T = R ? [] : {}; const Ue = R ? v : S; for (const V in _) {
          if (Object.prototype.hasOwnProperty.call(_, V)) {
            const z = `${Ue}${a}${V}`; y && !g ? T[V] = this.translate(z, {
              ...i, defaultValue: tt(E) ? E[V] : void 0, joinArrays: !1, ns: l,
            }) : T[V] = this.translate(z, { ...i, joinArrays: !1, ns: l }), T[V] === z && (T[V] = _[V])
          }
        }g = T
      }
    } else if (h && O(w) && Array.isArray(g))g = g.join(w), g && (g = this.extendTranslation(g, e, i, s)); else {
      let R = !1; let T = !1; !this.isValidLookup(g) && y && (R = !0, g = E), this.isValidLookup(g) || (T = !0, g = o); const V = (i.missingKeyNoValueFallbackToKey || this.options.missingKeyNoValueFallbackToKey) && T ? void 0 : g; const z = y && E !== g && this.options.updateMissing; if (T || R || z) {
        if (this.logger.log(z ? 'updateKey' : 'missingKey', f, u, o, z ? E : g), a) {
          const j = this.resolve(o, { ...i, keySeparator: !1 }); j && j.res && this.logger.warn('Seems the loaded translations were in flat JSON format instead of nested. Either set keySeparator: false on init or make sure your translations are published in nested format.')
        } let re = []; const he = this.languageUtils.getFallbackCodes(this.options.fallbackLng, i.lng || this.language); if (this.options.saveMissingTo === 'fallback' && he && he[0]) for (let j = 0; j < he.length; j++)re.push(he[j]); else this.options.saveMissingTo === 'all' ? re = this.languageUtils.toResolveHierarchy(i.lng || this.language) : re.push(i.lng || this.language); const He = (j, Z, ae) => {
          let Ke; const ze = y && ae !== g ? ae : V; this.options.missingKeyHandler ? this.options.missingKeyHandler(j, u, Z, ze, z, i) : (Ke = this.backendConnector) != null && Ke.saveMissing && this.backendConnector.saveMissing(j, u, Z, ze, z, i), this.emit('missingKey', j, u, Z, g)
        }; this.options.saveMissing && (this.options.saveMissingPlurals && d ? re.forEach((j) => {
          const Z = this.pluralResolver.getSuffixes(j, i); $ && i[`defaultValue${this.options.pluralSeparator}zero`] && Z.indexOf(`${this.options.pluralSeparator}zero`) < 0 && Z.push(`${this.options.pluralSeparator}zero`), Z.forEach((ae) => {
            He([j], o + ae, i[`defaultValue${ae}`] || E)
          })
        }) : He(re, o, E))
      }g = this.extendTranslation(g, e, i, p, s), T && g === o && this.options.appendNamespaceToMissingKey && (g = `${u}${c}${o}`), (T || R) && this.options.parseMissingKeyHandler && (g = this.options.parseMissingKeyHandler(this.options.appendNamespaceToMissingKey ? `${u}${c}${o}` : o, R ? g : void 0, i))
    } return r ? (p.res = g, p.usedParams = this.getUsedParamsDetails(i), p) : g
  }

  extendTranslation(e, t, s, i, r) {
    let l; let u; if ((l = this.i18nFormat) != null && l.parse)e = this.i18nFormat.parse(e, { ...this.options.interpolation.defaultVariables, ...s }, s.lng || this.language || i.usedLng, i.usedNS, i.usedKey, { resolved: i }); else if (!s.skipInterpolation) {
      s.interpolation && this.interpolator.init({ ...s, interpolation: { ...this.options.interpolation, ...s.interpolation } }); const c = O(e) && (((u = s == null ? void 0 : s.interpolation) == null ? void 0 : u.skipOnVariables) !== void 0 ? s.interpolation.skipOnVariables : this.options.interpolation.skipOnVariables); let f; if (c) {
        const p = e.match(this.interpolator.nestingRegexp); f = p && p.length
      } let m = s.replace && !O(s.replace) ? s.replace : s; if (this.options.interpolation.defaultVariables && (m = { ...this.options.interpolation.defaultVariables, ...m }), e = this.interpolator.interpolate(e, m, s.lng || this.language || i.usedLng, s), c) {
        const p = e.match(this.interpolator.nestingRegexp); const g = p && p.length; f < g && (s.nest = !1)
      }!s.lng && i && i.res && (s.lng = this.language || i.usedLng), s.nest !== !1 && (e = this.interpolator.nest(e, (...p) => ((r == null ? void 0 : r[0]) === p[0] && !s.context ? (this.logger.warn(`It seems you are nesting recursively key: ${p[0]} in key: ${t[0]}`), null) : this.translate(...p, t)), s)), s.interpolation && this.interpolator.reset()
    } const a = s.postProcess || this.options.postProcess; const o = O(a) ? [a] : a; return e != null && (o != null && o.length) && s.applyPostProcessor !== !1 && (e = Ot.handle(o, e, t, this.options && this.options.postProcessPassResolved ? { i18nResolved: { ...i, usedParams: this.getUsedParamsDetails(s) }, ...s } : s, this)), e
  }

  resolve(e, t = {}) {
    let s; let i; let r; let a; let o; return O(e) && (e = [e]), e.forEach((l) => {
      if (this.isValidLookup(s)) return; const u = this.extractFromKey(l, t); const c = u.key; i = c; let f = u.namespaces; this.options.fallbackNS && (f = f.concat(this.options.fallbackNS)); const m = t.count !== void 0 && !O(t.count); const p = m && !t.ordinal && t.count === 0; const g = t.context !== void 0 && (O(t.context) || typeof t.context === 'number') && t.context !== ''; const S = t.lngs ? t.lngs : this.languageUtils.toResolveHierarchy(t.lng || this.language, t.fallbackLng); f.forEach((v) => {
        let b; let w; this.isValidLookup(s) || (o = v, !et[`${S[0]}-${v}`] && ((b = this.utils) != null && b.hasLoadedNamespace) && !((w = this.utils) != null && w.hasLoadedNamespace(o)) && (et[`${S[0]}-${v}`] = !0, this.logger.warn(`key "${i}" for languages "${S.join(', ')}" won't get resolved as namespace "${o}" was not yet loaded`, 'This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!')), S.forEach((h) => {
          let x; if (this.isValidLookup(s)) return; a = h; const d = [c]; if ((x = this.i18nFormat) != null && x.addLookupKeys) this.i18nFormat.addLookupKeys(d, c, h, v, t); else {
            let C; m && (C = this.pluralResolver.getSuffix(h, t.count, t)); const $ = `${this.options.pluralSeparator}zero`; const E = `${this.options.pluralSeparator}ordinal${this.options.pluralSeparator}`; if (m && (d.push(c + C), t.ordinal && C.indexOf(E) === 0 && d.push(c + C.replace(E, this.options.pluralSeparator)), p && d.push(c + $)), g) {
              const _ = `${c}${this.options.contextSeparator}${t.context}`; d.push(_), m && (d.push(_ + C), t.ordinal && C.indexOf(E) === 0 && d.push(_ + C.replace(E, this.options.pluralSeparator)), p && d.push(_ + $))
            }
          } let y; for (;y = d.pop();) this.isValidLookup(s) || (r = y, s = this.getResource(h, v, y, t))
        }))
      })
    }), {
      res: s, usedKey: i, exactUsedKey: r, usedLng: a, usedNS: o,
    }
  }

  isValidLookup(e) {
    return e !== void 0 && !(!this.options.returnNull && e === null) && !(!this.options.returnEmptyString && e === '')
  }

  getResource(e, t, s, i = {}) {
    let r; return (r = this.i18nFormat) != null && r.getResource ? this.i18nFormat.getResource(e, t, s, i) : this.resourceStore.getResource(e, t, s, i)
  }

  getUsedParamsDetails(e = {}) {
    const t = ['defaultValue', 'ordinal', 'context', 'replace', 'lng', 'lngs', 'fallbackLng', 'ns', 'keySeparator', 'nsSeparator', 'returnObjects', 'returnDetails', 'joinArrays', 'postProcess', 'interpolation']; const s = e.replace && !O(e.replace); let i = s ? e.replace : e; if (s && typeof e.count < 'u' && (i.count = e.count), this.options.interpolation.defaultVariables && (i = { ...this.options.interpolation.defaultVariables, ...i }), !s) {
      i = { ...i }; for (const r of t) delete i[r]
    } return i
  }

  static hasDefaultValue(e) {
    const t = 'defaultValue'; for (const s in e) if (Object.prototype.hasOwnProperty.call(e, s) && t === s.substring(0, t.length) && e[s] !== void 0) return !0; return !1
  }
} class st {
  constructor(e) {
    this.options = e, this.supportedLngs = this.options.supportedLngs || !1, this.logger = H.create('languageUtils')
  }

  getScriptPartFromCode(e) {
    if (e = ue(e), !e || e.indexOf('-') < 0) return null; const t = e.split('-'); return t.length === 2 || (t.pop(), t[t.length - 1].toLowerCase() === 'x') ? null : this.formatLanguageCode(t.join('-'))
  }

  getLanguagePartFromCode(e) {
    if (e = ue(e), !e || e.indexOf('-') < 0) return e; const t = e.split('-'); return this.formatLanguageCode(t[0])
  }

  formatLanguageCode(e) {
    if (O(e) && e.indexOf('-') > -1) {
      let t; try {
        t = Intl.getCanonicalLocales(e)[0]
      } catch {} return t && this.options.lowerCaseLng && (t = t.toLowerCase()), t || (this.options.lowerCaseLng ? e.toLowerCase() : e)
    } return this.options.cleanCode || this.options.lowerCaseLng ? e.toLowerCase() : e
  }

  isSupportedCode(e) {
    return (this.options.load === 'languageOnly' || this.options.nonExplicitSupportedLngs) && (e = this.getLanguagePartFromCode(e)), !this.supportedLngs || !this.supportedLngs.length || this.supportedLngs.indexOf(e) > -1
  }

  getBestMatchFromCodes(e) {
    if (!e) return null; let t; return e.forEach((s) => {
      if (t) return; const i = this.formatLanguageCode(s); (!this.options.supportedLngs || this.isSupportedCode(i)) && (t = i)
    }), !t && this.options.supportedLngs && e.forEach((s) => {
      if (t) return; const i = this.getScriptPartFromCode(s); if (this.isSupportedCode(i)) return t = i; const r = this.getLanguagePartFromCode(s); if (this.isSupportedCode(r)) return t = r; t = this.options.supportedLngs.find((a) => {
        if (a === r) return a; if (!(a.indexOf('-') < 0 && r.indexOf('-') < 0) && (a.indexOf('-') > 0 && r.indexOf('-') < 0 && a.substring(0, a.indexOf('-')) === r || a.indexOf(r) === 0 && r.length > 1)) return a
      })
    }), t || (t = this.getFallbackCodes(this.options.fallbackLng)[0]), t
  }

  getFallbackCodes(e, t) {
    if (!e) return []; if (typeof e === 'function' && (e = e(t)), O(e) && (e = [e]), Array.isArray(e)) return e; if (!t) return e.default || []; let s = e[t]; return s || (s = e[this.getScriptPartFromCode(t)]), s || (s = e[this.formatLanguageCode(t)]), s || (s = e[this.getLanguagePartFromCode(t)]), s || (s = e.default), s || []
  }

  toResolveHierarchy(e, t) {
    const s = this.getFallbackCodes((t === !1 ? [] : t) || this.options.fallbackLng || [], e); const i = []; const r = (a) => {
      a && (this.isSupportedCode(a) ? i.push(a) : this.logger.warn(`rejecting language code not found in supportedLngs: ${a}`))
    }; return O(e) && (e.indexOf('-') > -1 || e.indexOf('_') > -1) ? (this.options.load !== 'languageOnly' && r(this.formatLanguageCode(e)), this.options.load !== 'languageOnly' && this.options.load !== 'currentOnly' && r(this.getScriptPartFromCode(e)), this.options.load !== 'currentOnly' && r(this.getLanguagePartFromCode(e))) : O(e) && r(this.formatLanguageCode(e)), s.forEach((a) => {
      i.indexOf(a) < 0 && r(this.formatLanguageCode(a))
    }), i
  }
} const it = {
  zero: 0, one: 1, two: 2, few: 3, many: 4, other: 5,
}; const nt = { select: (n) => (n === 1 ? 'one' : 'other'), resolvedOptions: () => ({ pluralCategories: ['one', 'other'] }) }; class is {
  constructor(e, t = {}) {
    this.languageUtils = e, this.options = t, this.logger = H.create('pluralResolver'), this.pluralRulesCache = {}
  }

  addRule(e, t) {
    this.rules[e] = t
  }

  clearCache() {
    this.pluralRulesCache = {}
  }

  getRule(e, t = {}) {
    const s = ue(e === 'dev' ? 'en' : e); const i = t.ordinal ? 'ordinal' : 'cardinal'; const r = JSON.stringify({ cleanedCode: s, type: i }); if (r in this.pluralRulesCache) return this.pluralRulesCache[r]; let a; try {
      a = new Intl.PluralRules(s, { type: i })
    } catch {
      if (!Intl) return this.logger.error('No Intl support, please use an Intl polyfill!'), nt; if (!e.match(/-|_/)) return nt; const l = this.languageUtils.getLanguagePartFromCode(e); a = this.getRule(l, t)
    } return this.pluralRulesCache[r] = a, a
  }

  needsPlural(e, t = {}) {
    let s = this.getRule(e, t); return s || (s = this.getRule('dev', t)), (s == null ? void 0 : s.resolvedOptions().pluralCategories.length) > 1
  }

  getPluralFormsOfKey(e, t, s = {}) {
    return this.getSuffixes(e, s).map((i) => `${t}${i}`)
  }

  getSuffixes(e, t = {}) {
    let s = this.getRule(e, t); return s || (s = this.getRule('dev', t)), s ? s.resolvedOptions().pluralCategories.sort((i, r) => it[i] - it[r]).map((i) => `${this.options.prepend}${t.ordinal ? `ordinal${this.options.prepend}` : ''}${i}`) : []
  }

  getSuffix(e, t, s = {}) {
    const i = this.getRule(e, s); return i ? `${this.options.prepend}${s.ordinal ? `ordinal${this.options.prepend}` : ''}${i.select(t)}` : (this.logger.warn(`no plural rule found for: ${e}`), this.getSuffix('dev', t, s))
  }
} const rt = (n, e, t, s = '.', i = !0) => {
  let r = Gt(n, e, t); return !r && i && O(t) && (r = De(n, t, s), r === void 0 && (r = De(e, t, s))), r
}; const ke = (n) => n.replace(/\$/g, '$$$$'); class ns {
  constructor(e = {}) {
    let t; this.logger = H.create('interpolator'), this.options = e, this.format = ((t = e == null ? void 0 : e.interpolation) == null ? void 0 : t.format) || ((s) => s), this.init(e)
  }

  init(e = {}) {
    e.interpolation || (e.interpolation = { escapeValue: !0 }); const {
      escape: t, escapeValue: s, useRawValueToEscape: i, prefix: r, prefixEscaped: a, suffix: o, suffixEscaped: l, formatSeparator: u, unescapeSuffix: c, unescapePrefix: f, nestingPrefix: m, nestingPrefixEscaped: p, nestingSuffix: g, nestingSuffixEscaped: S, nestingOptionsSeparator: v, maxReplaces: b, alwaysFormat: w,
    } = e.interpolation; this.escape = t !== void 0 ? t : Zt, this.escapeValue = s !== void 0 ? s : !0, this.useRawValueToEscape = i !== void 0 ? i : !1, this.prefix = r ? te(r) : a || '{{', this.suffix = o ? te(o) : l || '}}', this.formatSeparator = u || ',', this.unescapePrefix = c ? '' : f || '-', this.unescapeSuffix = this.unescapePrefix ? '' : c || '', this.nestingPrefix = m ? te(m) : p || te('$t('), this.nestingSuffix = g ? te(g) : S || te(')'), this.nestingOptionsSeparator = v || ',', this.maxReplaces = b || 1e3, this.alwaysFormat = w !== void 0 ? w : !1, this.resetRegExp()
  }

  reset() {
    this.options && this.init(this.options)
  }

  resetRegExp() {
    const e = (t, s) => ((t == null ? void 0 : t.source) === s ? (t.lastIndex = 0, t) : new RegExp(s, 'g')); this.regexp = e(this.regexp, `${this.prefix}(.+?)${this.suffix}`), this.regexpUnescape = e(this.regexpUnescape, `${this.prefix}${this.unescapePrefix}(.+?)${this.unescapeSuffix}${this.suffix}`), this.nestingRegexp = e(this.nestingRegexp, `${this.nestingPrefix}(.+?)${this.nestingSuffix}`)
  }

  interpolate(e, t, s, i) {
    let p; let r; let a; let o; const l = this.options && this.options.interpolation && this.options.interpolation.defaultVariables || {}; const u = (g) => {
      if (g.indexOf(this.formatSeparator) < 0) {
        const w = rt(t, l, g, this.options.keySeparator, this.options.ignoreJSONStructure); return this.alwaysFormat ? this.format(w, void 0, s, { ...i, ...t, interpolationkey: g }) : w
      } const S = g.split(this.formatSeparator); const v = S.shift().trim(); const b = S.join(this.formatSeparator).trim(); return this.format(rt(t, l, v, this.options.keySeparator, this.options.ignoreJSONStructure), b, s, { ...i, ...t, interpolationkey: v })
    }; this.resetRegExp(); const c = (i == null ? void 0 : i.missingInterpolationHandler) || this.options.missingInterpolationHandler; const f = ((p = i == null ? void 0 : i.interpolation) == null ? void 0 : p.skipOnVariables) !== void 0 ? i.interpolation.skipOnVariables : this.options.interpolation.skipOnVariables; return [{ regex: this.regexpUnescape, safeValue: (g) => ke(g) }, { regex: this.regexp, safeValue: (g) => (this.escapeValue ? ke(this.escape(g)) : ke(g)) }].forEach((g) => {
      for (o = 0; r = g.regex.exec(e);) {
        const S = r[1].trim(); if (a = u(S), a === void 0) {
          if (typeof c === 'function') {
            const b = c(e, r, i); a = O(b) ? b : ''
          } else if (i && Object.prototype.hasOwnProperty.call(i, S))a = ''; else if (f) {
            a = r[0]; continue
          } else this.logger.warn(`missed to pass in variable ${S} for interpolating ${e}`), a = ''
        } else !O(a) && !this.useRawValueToEscape && (a = Ge(a)); const v = g.safeValue(a); if (e = e.replace(r[0], v), f ? (g.regex.lastIndex += a.length, g.regex.lastIndex -= r[0].length) : g.regex.lastIndex = 0, o++, o >= this.maxReplaces) break
      }
    }), e
  }

  nest(e, t, s = {}) {
    let i; let r; let a; const o = (l, u) => {
      const c = this.nestingOptionsSeparator; if (l.indexOf(c) < 0) return l; const f = l.split(new RegExp(`${c}[ ]*{`)); let m = `{${f[1]}`; l = f[0], m = this.interpolate(m, a); const p = m.match(/'/g); const g = m.match(/"/g); (((p == null ? void 0 : p.length) ?? 0) % 2 === 0 && !g || g.length % 2 !== 0) && (m = m.replace(/'/g, '"')); try {
        a = JSON.parse(m), u && (a = { ...u, ...a })
      } catch (S) {
        return this.logger.warn(`failed parsing options string in nesting for key ${l}`, S), `${l}${c}${m}`
      } return a.defaultValue && a.defaultValue.indexOf(this.prefix) > -1 && delete a.defaultValue, l
    }; for (;i = this.nestingRegexp.exec(e);) {
      let l = []; a = { ...s }, a = a.replace && !O(a.replace) ? a.replace : a, a.applyPostProcessor = !1, delete a.defaultValue; let u = !1; if (i[0].indexOf(this.formatSeparator) !== -1 && !/{.*}/.test(i[1])) {
        const c = i[1].split(this.formatSeparator).map((f) => f.trim()); i[1] = c.shift(), l = c, u = !0
      } if (r = t(o.call(this, i[1].trim(), a), a), r && i[0] === e && !O(r)) return r; O(r) || (r = Ge(r)), r || (this.logger.warn(`missed to resolve ${i[1]} for nesting ${e}`), r = ''), u && (r = l.reduce((c, f) => this.format(c, f, s.lng, { ...s, interpolationkey: i[1].trim() }), r.trim())), e = e.replace(i[0], r), this.regexp.lastIndex = 0
    } return e
  }
} const rs = (n) => {
  let e = n.toLowerCase().trim(); const t = {}; if (n.indexOf('(') > -1) {
    const s = n.split('('); e = s[0].toLowerCase().trim(); const i = s[1].substring(0, s[1].length - 1); e === 'currency' && i.indexOf(':') < 0 ? t.currency || (t.currency = i.trim()) : e === 'relativetime' && i.indexOf(':') < 0 ? t.range || (t.range = i.trim()) : i.split(';').forEach((a) => {
      if (a) {
        const [o, ...l] = a.split(':'); const u = l.join(':').trim().replace(/^'+|'+$/g, ''); const c = o.trim(); t[c] || (t[c] = u), u === 'false' && (t[c] = !1), u === 'true' && (t[c] = !0), isNaN(u) || (t[c] = parseInt(u, 10))
      }
    })
  } return { formatName: e, formatOptions: t }
}; const at = (n) => {
  const e = {}; return (t, s, i) => {
    let r = i; i && i.interpolationkey && i.formatParams && i.formatParams[i.interpolationkey] && i[i.interpolationkey] && (r = { ...r, [i.interpolationkey]: void 0 }); const a = s + JSON.stringify(r); let o = e[a]; return o || (o = n(ue(s), i), e[a] = o), o(t)
  }
}; const as = (n) => (e, t, s) => n(ue(t), s)(e); class os {
  constructor(e = {}) {
    this.logger = H.create('formatter'), this.options = e, this.init(e)
  }

  init(e, t = { interpolation: {} }) {
    this.formatSeparator = t.interpolation.formatSeparator || ','; const s = t.cacheInBuiltFormats ? at : as; this.formats = {
      number: s((i, r) => {
        const a = new Intl.NumberFormat(i, { ...r }); return (o) => a.format(o)
      }),
      currency: s((i, r) => {
        const a = new Intl.NumberFormat(i, { ...r, style: 'currency' }); return (o) => a.format(o)
      }),
      datetime: s((i, r) => {
        const a = new Intl.DateTimeFormat(i, { ...r }); return (o) => a.format(o)
      }),
      relativetime: s((i, r) => {
        const a = new Intl.RelativeTimeFormat(i, { ...r }); return (o) => a.format(o, r.range || 'day')
      }),
      list: s((i, r) => {
        const a = new Intl.ListFormat(i, { ...r }); return (o) => a.format(o)
      }),
    }
  }

  add(e, t) {
    this.formats[e.toLowerCase().trim()] = t
  }

  addCached(e, t) {
    this.formats[e.toLowerCase().trim()] = at(t)
  }

  format(e, t, s, i = {}) {
    const r = t.split(this.formatSeparator); if (r.length > 1 && r[0].indexOf('(') > 1 && r[0].indexOf(')') < 0 && r.find((o) => o.indexOf(')') > -1)) {
      const o = r.findIndex((l) => l.indexOf(')') > -1); r[0] = [r[0], ...r.splice(1, o)].join(this.formatSeparator)
    } return r.reduce((o, l) => {
      let f; const { formatName: u, formatOptions: c } = rs(l); if (this.formats[u]) {
        let m = o; try {
          const p = ((f = i == null ? void 0 : i.formatParams) == null ? void 0 : f[i.interpolationkey]) || {}; const g = p.locale || p.lng || i.locale || i.lng || s; m = this.formats[u](o, g, { ...c, ...i, ...p })
        } catch (p) {
          this.logger.warn(p)
        } return m
      } else this.logger.warn(`there was no format function for ${u}`); return o
    }, e)
  }
} const ls = (n, e) => {
  n.pending[e] !== void 0 && (delete n.pending[e], n.pendingCount--)
}; class us extends $e {
  constructor(e, t, s, i = {}) {
    let r; let a; super(), this.backend = e, this.store = t, this.services = s, this.languageUtils = s.languageUtils, this.options = i, this.logger = H.create('backendConnector'), this.waitingReads = [], this.maxParallelReads = i.maxParallelReads || 10, this.readingCalls = 0, this.maxRetries = i.maxRetries >= 0 ? i.maxRetries : 5, this.retryTimeout = i.retryTimeout >= 1 ? i.retryTimeout : 350, this.state = {}, this.queue = [], (a = (r = this.backend) == null ? void 0 : r.init) == null || a.call(r, s, i.backend, i)
  }

  queueLoad(e, t, s, i) {
    const r = {}; const a = {}; const o = {}; const l = {}; return e.forEach((u) => {
      let c = !0; t.forEach((f) => {
        const m = `${u}|${f}`; !s.reload && this.store.hasResourceBundle(u, f) ? this.state[m] = 2 : this.state[m] < 0 || (this.state[m] === 1 ? a[m] === void 0 && (a[m] = !0) : (this.state[m] = 1, c = !1, a[m] === void 0 && (a[m] = !0), r[m] === void 0 && (r[m] = !0), l[f] === void 0 && (l[f] = !0)))
      }), c || (o[u] = !0)
    }), (Object.keys(r).length || Object.keys(a).length) && this.queue.push({
      pending: a, pendingCount: Object.keys(a).length, loaded: {}, errors: [], callback: i,
    }), {
      toLoad: Object.keys(r), pending: Object.keys(a), toLoadLanguages: Object.keys(o), toLoadNamespaces: Object.keys(l),
    }
  }

  loaded(e, t, s) {
    const i = e.split('|'); const r = i[0]; const a = i[1]; t && this.emit('failedLoading', r, a, t), !t && s && this.store.addResourceBundle(r, a, s, void 0, void 0, { skipCopy: !0 }), this.state[e] = t ? -1 : 2, t && s && (this.state[e] = 0); const o = {}; this.queue.forEach((l) => {
      Jt(l.loaded, [r], a), ls(l, e), t && l.errors.push(t), l.pendingCount === 0 && !l.done && (Object.keys(l.loaded).forEach((u) => {
        o[u] || (o[u] = {}); const c = l.loaded[u]; c.length && c.forEach((f) => {
          o[u][f] === void 0 && (o[u][f] = !0)
        })
      }), l.done = !0, l.errors.length ? l.callback(l.errors) : l.callback())
    }), this.emit('loaded', o), this.queue = this.queue.filter((l) => !l.done)
  }

  read(e, t, s, i = 0, r = this.retryTimeout, a) {
    if (!e.length) return a(null, {}); if (this.readingCalls >= this.maxParallelReads) {
      this.waitingReads.push({
        lng: e, ns: t, fcName: s, tried: i, wait: r, callback: a,
      }); return
    } this.readingCalls++; const o = (u, c) => {
      if (this.readingCalls--, this.waitingReads.length > 0) {
        const f = this.waitingReads.shift(); this.read(f.lng, f.ns, f.fcName, f.tried, f.wait, f.callback)
      } if (u && c && i < this.maxRetries) {
        setTimeout(() => {
          this.read.call(this, e, t, s, i + 1, r * 2, a)
        }, r); return
      }a(u, c)
    }; const l = this.backend[s].bind(this.backend); if (l.length === 2) {
      try {
        const u = l(e, t); u && typeof u.then === 'function' ? u.then((c) => o(null, c)).catch(o) : o(null, u)
      } catch (u) {
        o(u)
      } return
    } return l(e, t, o)
  }

  prepareLoading(e, t, s = {}, i) {
    if (!this.backend) return this.logger.warn('No backend was added via i18next.use. Will not load resources.'), i && i(); O(e) && (e = this.languageUtils.toResolveHierarchy(e)), O(t) && (t = [t]); const r = this.queueLoad(e, t, s, i); if (!r.toLoad.length) return r.pending.length || i(), null; r.toLoad.forEach((a) => {
      this.loadOne(a)
    })
  }

  load(e, t, s) {
    this.prepareLoading(e, t, {}, s)
  }

  reload(e, t, s) {
    this.prepareLoading(e, t, { reload: !0 }, s)
  }

  loadOne(e, t = '') {
    const s = e.split('|'); const i = s[0]; const r = s[1]; this.read(i, r, 'read', void 0, void 0, (a, o) => {
      a && this.logger.warn(`${t}loading namespace ${r} for language ${i} failed`, a), !a && o && this.logger.log(`${t}loaded namespace ${r} for language ${i}`, o), this.loaded(e, a, o)
    })
  }

  saveMissing(e, t, s, i, r, a = {}, o = () => {}) {
    let l; let u; let c; let f; let m; if ((u = (l = this.services) == null ? void 0 : l.utils) != null && u.hasLoadedNamespace && !((f = (c = this.services) == null ? void 0 : c.utils) != null && f.hasLoadedNamespace(t))) {
      this.logger.warn(`did not save key "${s}" as the namespace "${t}" was not yet loaded`, 'This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!'); return
    } if (!(s == null || s === '')) {
      if ((m = this.backend) != null && m.create) {
        const p = { ...a, isUpdate: r }; const g = this.backend.create.bind(this.backend); if (g.length < 6) {
          try {
            let S; g.length === 5 ? S = g(e, t, s, i, p) : S = g(e, t, s, i), S && typeof S.then === 'function' ? S.then((v) => o(null, v)).catch(o) : o(null, S)
          } catch (S) {
            o(S)
          }
        } else g(e, t, s, i, o, p)
      }!e || !e[0] || this.store.addResource(e[0], t, s, i)
    }
  }
} const ot = () => ({
  debug: !1,
  initAsync: !0,
  ns: ['translation'],
  defaultNS: ['translation'],
  fallbackLng: ['dev'],
  fallbackNS: !1,
  supportedLngs: !1,
  nonExplicitSupportedLngs: !1,
  load: 'all',
  preload: !1,
  simplifyPluralSuffix: !0,
  keySeparator: '.',
  nsSeparator: ':',
  pluralSeparator: '_',
  contextSeparator: '_',
  partialBundledLanguages: !1,
  saveMissing: !1,
  updateMissing: !1,
  saveMissingTo: 'fallback',
  saveMissingPlurals: !0,
  missingKeyHandler: !1,
  missingInterpolationHandler: !1,
  postProcess: !1,
  postProcessPassResolved: !1,
  returnNull: !1,
  returnEmptyString: !0,
  returnObjects: !1,
  joinArrays: !1,
  returnedObjectHandler: !1,
  parseMissingKeyHandler: !1,
  appendNamespaceToMissingKey: !1,
  appendNamespaceToCIMode: !1,
  overloadTranslationOptionHandler: (n) => {
    let e = {}; if (typeof n[1] === 'object' && (e = n[1]), O(n[1]) && (e.defaultValue = n[1]), O(n[2]) && (e.tDescription = n[2]), typeof n[2] === 'object' || typeof n[3] === 'object') {
      const t = n[3] || n[2]; Object.keys(t).forEach((s) => {
        e[s] = t[s]
      })
    } return e
  },
  interpolation: {
    escapeValue: !0, format: (n) => n, prefix: '{{', suffix: '}}', formatSeparator: ',', unescapePrefix: '-', nestingPrefix: '$t(', nestingSuffix: ')', nestingOptionsSeparator: ',', maxReplaces: 1e3, skipOnVariables: !0,
  },
  cacheInBuiltFormats: !0,
}); const lt = (n) => {
  let e; let t; return O(n.ns) && (n.ns = [n.ns]), O(n.fallbackLng) && (n.fallbackLng = [n.fallbackLng]), O(n.fallbackNS) && (n.fallbackNS = [n.fallbackNS]), ((t = (e = n.supportedLngs) == null ? void 0 : e.indexOf) == null ? void 0 : t.call(e, 'cimode')) < 0 && (n.supportedLngs = n.supportedLngs.concat(['cimode'])), typeof n.initImmediate === 'boolean' && (n.initAsync = n.initImmediate), n
}; const me = () => {}; const cs = (n) => {
  Object.getOwnPropertyNames(Object.getPrototypeOf(n)).forEach((t) => {
    typeof n[t] === 'function' && (n[t] = n[t].bind(n))
  })
}; class ce extends $e {
  constructor(e = {}, t) {
    if (super(), this.options = lt(e), this.services = {}, this.logger = H, this.modules = { external: [] }, cs(this), t && !this.isInitialized && !e.isClone) {
      if (!this.options.initAsync) return this.init(e, t), this; setTimeout(() => {
        this.init(e, t)
      }, 0)
    }
  }

  init(e = {}, t) {
    this.isInitializing = !0, typeof e === 'function' && (t = e, e = {}), e.defaultNS == null && e.ns && (O(e.ns) ? e.defaultNS = e.ns : e.ns.indexOf('translation') < 0 && (e.defaultNS = e.ns[0])); const s = ot(); this.options = { ...s, ...this.options, ...lt(e) }, this.options.interpolation = { ...s.interpolation, ...this.options.interpolation }, e.keySeparator !== void 0 && (this.options.userDefinedKeySeparator = e.keySeparator), e.nsSeparator !== void 0 && (this.options.userDefinedNsSeparator = e.nsSeparator); const i = (u) => (u ? typeof u === 'function' ? new u() : u : null); if (!this.options.isClone) {
      this.modules.logger ? H.init(i(this.modules.logger), this.options) : H.init(null, this.options); let u; this.modules.formatter ? u = this.modules.formatter : u = os; const c = new st(this.options); this.store = new Xe(this.options.resources, this.options); const f = this.services; f.logger = H, f.resourceStore = this.store, f.languageUtils = c, f.pluralResolver = new is(c, { prepend: this.options.pluralSeparator, simplifyPluralSuffix: this.options.simplifyPluralSuffix }), u && (!this.options.interpolation.format || this.options.interpolation.format === s.interpolation.format) && (f.formatter = i(u), f.formatter.init(f, this.options), this.options.interpolation.format = f.formatter.format.bind(f.formatter)), f.interpolator = new ns(this.options), f.utils = { hasLoadedNamespace: this.hasLoadedNamespace.bind(this) }, f.backendConnector = new us(i(this.modules.backend), f.resourceStore, f, this.options), f.backendConnector.on('*', (m, ...p) => {
        this.emit(m, ...p)
      }), this.modules.languageDetector && (f.languageDetector = i(this.modules.languageDetector), f.languageDetector.init && f.languageDetector.init(f, this.options.detection, this.options)), this.modules.i18nFormat && (f.i18nFormat = i(this.modules.i18nFormat), f.i18nFormat.init && f.i18nFormat.init(this)), this.translator = new Oe(this.services, this.options), this.translator.on('*', (m, ...p) => {
        this.emit(m, ...p)
      }), this.modules.external.forEach((m) => {
        m.init && m.init(this)
      })
    } if (this.format = this.options.interpolation.format, t || (t = me), this.options.fallbackLng && !this.services.languageDetector && !this.options.lng) {
      const u = this.services.languageUtils.getFallbackCodes(this.options.fallbackLng); u.length > 0 && u[0] !== 'dev' && (this.options.lng = u[0])
    }!this.services.languageDetector && !this.options.lng && this.logger.warn('init: no languageDetector is used and no lng is defined'), ['getResource', 'hasResourceBundle', 'getResourceBundle', 'getDataByLanguage'].forEach((u) => {
      this[u] = (...c) => this.store[u](...c)
    }), ['addResource', 'addResources', 'addResourceBundle', 'removeResourceBundle'].forEach((u) => {
      this[u] = (...c) => (this.store[u](...c), this)
    }); const o = oe(); const l = () => {
      const u = (c, f) => {
        this.isInitializing = !1, this.isInitialized && !this.initializedStoreOnce && this.logger.warn('init: i18next is already initialized. You should call init just once!'), this.isInitialized = !0, this.options.isClone || this.logger.log('initialized', this.options), this.emit('initialized', this.options), o.resolve(f), t(c, f)
      }; if (this.languages && !this.isInitialized) return u(null, this.t.bind(this)); this.changeLanguage(this.options.lng, u)
    }; return this.options.resources || !this.options.initAsync ? l() : setTimeout(l, 0), o
  }

  loadResources(e, t = me) {
    let r; let a; let s = t; const i = O(e) ? e : this.language; if (typeof e === 'function' && (s = e), !this.options.resources || this.options.partialBundledLanguages) {
      if ((i == null ? void 0 : i.toLowerCase()) === 'cimode' && (!this.options.preload || this.options.preload.length === 0)) return s(); const o = []; const l = (u) => {
        if (!u || u === 'cimode') return; this.services.languageUtils.toResolveHierarchy(u).forEach((f) => {
          f !== 'cimode' && o.indexOf(f) < 0 && o.push(f)
        })
      }; i ? l(i) : this.services.languageUtils.getFallbackCodes(this.options.fallbackLng).forEach((c) => l(c)), (a = (r = this.options.preload) == null ? void 0 : r.forEach) == null || a.call(r, (u) => l(u)), this.services.backendConnector.load(o, this.options.ns, (u) => {
        !u && !this.resolvedLanguage && this.language && this.setResolvedLanguage(this.language), s(u)
      })
    } else s(null)
  }

  reloadResources(e, t, s) {
    const i = oe(); return typeof e === 'function' && (s = e, e = void 0), typeof t === 'function' && (s = t, t = void 0), e || (e = this.languages), t || (t = this.options.ns), s || (s = me), this.services.backendConnector.reload(e, t, (r) => {
      i.resolve(), s(r)
    }), i
  }

  use(e) {
    if (!e) throw new Error('You are passing an undefined module! Please check the object you are passing to i18next.use()'); if (!e.type) throw new Error('You are passing a wrong module! Please check the object you are passing to i18next.use()'); return e.type === 'backend' && (this.modules.backend = e), (e.type === 'logger' || e.log && e.warn && e.error) && (this.modules.logger = e), e.type === 'languageDetector' && (this.modules.languageDetector = e), e.type === 'i18nFormat' && (this.modules.i18nFormat = e), e.type === 'postProcessor' && Ot.addPostProcessor(e), e.type === 'formatter' && (this.modules.formatter = e), e.type === '3rdParty' && this.modules.external.push(e), this
  }

  setResolvedLanguage(e) {
    if (!(!e || !this.languages) && !(['cimode', 'dev'].indexOf(e) > -1)) {
      for (let t = 0; t < this.languages.length; t++) {
        const s = this.languages[t]; if (!(['cimode', 'dev'].indexOf(s) > -1) && this.store.hasLanguageSomeTranslations(s)) {
          this.resolvedLanguage = s; break
        }
      }!this.resolvedLanguage && this.languages.indexOf(e) < 0 && this.store.hasLanguageSomeTranslations(e) && (this.resolvedLanguage = e, this.languages.unshift(e))
    }
  }

  changeLanguage(e, t) {
    this.isLanguageChangingTo = e; const s = oe(); this.emit('languageChanging', e); const i = (o) => {
      this.language = o, this.languages = this.services.languageUtils.toResolveHierarchy(o), this.resolvedLanguage = void 0, this.setResolvedLanguage(o)
    }; const r = (o, l) => {
      l ? this.isLanguageChangingTo === e && (i(l), this.translator.changeLanguage(l), this.isLanguageChangingTo = void 0, this.emit('languageChanged', l), this.logger.log('languageChanged', l)) : this.isLanguageChangingTo = void 0, s.resolve((...u) => this.t(...u)), t && t(o, (...u) => this.t(...u))
    }; const a = (o) => {
      let c; let f; !e && !o && this.services.languageDetector && (o = []); const l = O(o) ? o : o && o[0]; const u = this.store.hasLanguageSomeTranslations(l) ? l : this.services.languageUtils.getBestMatchFromCodes(O(o) ? [o] : o); u && (this.language || i(u), this.translator.language || this.translator.changeLanguage(u), (f = (c = this.services.languageDetector) == null ? void 0 : c.cacheUserLanguage) == null || f.call(c, u)), this.loadResources(u, (m) => {
        r(m, u)
      })
    }; return !e && this.services.languageDetector && !this.services.languageDetector.async ? a(this.services.languageDetector.detect()) : !e && this.services.languageDetector && this.services.languageDetector.async ? this.services.languageDetector.detect.length === 0 ? this.services.languageDetector.detect().then(a) : this.services.languageDetector.detect(a) : a(e), s
  }

  getFixedT(e, t, s) {
    const i = (r, a, ...o) => {
      let l; typeof a !== 'object' ? l = this.options.overloadTranslationOptionHandler([r, a].concat(o)) : l = { ...a }, l.lng = l.lng || i.lng, l.lngs = l.lngs || i.lngs, l.ns = l.ns || i.ns, l.keyPrefix !== '' && (l.keyPrefix = l.keyPrefix || s || i.keyPrefix); const u = this.options.keySeparator || '.'; let c; return l.keyPrefix && Array.isArray(r) ? c = r.map((f) => `${l.keyPrefix}${u}${f}`) : c = l.keyPrefix ? `${l.keyPrefix}${u}${r}` : r, this.t(c, l)
    }; return O(e) ? i.lng = e : i.lngs = e, i.ns = t, i.keyPrefix = s, i
  }

  t(...e) {
    let t; return (t = this.translator) == null ? void 0 : t.translate(...e)
  }

  exists(...e) {
    let t; return (t = this.translator) == null ? void 0 : t.exists(...e)
  }

  setDefaultNamespace(e) {
    this.options.defaultNS = e
  }

  hasLoadedNamespace(e, t = {}) {
    if (!this.isInitialized) return this.logger.warn('hasLoadedNamespace: i18next was not initialized', this.languages), !1; if (!this.languages || !this.languages.length) return this.logger.warn('hasLoadedNamespace: i18n.languages were undefined or empty', this.languages), !1; const s = t.lng || this.resolvedLanguage || this.languages[0]; const i = this.options ? this.options.fallbackLng : !1; const r = this.languages[this.languages.length - 1]; if (s.toLowerCase() === 'cimode') return !0; const a = (o, l) => {
      const u = this.services.backendConnector.state[`${o}|${l}`]; return u === -1 || u === 0 || u === 2
    }; if (t.precheck) {
      const o = t.precheck(this, a); if (o !== void 0) return o
    } return !!(this.hasResourceBundle(s, e) || !this.services.backendConnector.backend || this.options.resources && !this.options.partialBundledLanguages || a(s, e) && (!i || a(r, e)))
  }

  loadNamespaces(e, t) {
    const s = oe(); return this.options.ns ? (O(e) && (e = [e]), e.forEach((i) => {
      this.options.ns.indexOf(i) < 0 && this.options.ns.push(i)
    }), this.loadResources((i) => {
      s.resolve(), t && t(i)
    }), s) : (t && t(), Promise.resolve())
  }

  loadLanguages(e, t) {
    const s = oe(); O(e) && (e = [e]); const i = this.options.preload || []; const r = e.filter((a) => i.indexOf(a) < 0 && this.services.languageUtils.isSupportedCode(a)); return r.length ? (this.options.preload = i.concat(r), this.loadResources((a) => {
      s.resolve(), t && t(a)
    }), s) : (t && t(), Promise.resolve())
  }

  dir(e) {
    let i; let r; if (e || (e = this.resolvedLanguage || (((i = this.languages) == null ? void 0 : i.length) > 0 ? this.languages[0] : this.language)), !e) return 'rtl'; const t = ['ar', 'shu', 'sqr', 'ssh', 'xaa', 'yhd', 'yud', 'aao', 'abh', 'abv', 'acm', 'acq', 'acw', 'acx', 'acy', 'adf', 'ads', 'aeb', 'aec', 'afb', 'ajp', 'apc', 'apd', 'arb', 'arq', 'ars', 'ary', 'arz', 'auz', 'avl', 'ayh', 'ayl', 'ayn', 'ayp', 'bbz', 'pga', 'he', 'iw', 'ps', 'pbt', 'pbu', 'pst', 'prp', 'prd', 'ug', 'ur', 'ydd', 'yds', 'yih', 'ji', 'yi', 'hbo', 'men', 'xmn', 'fa', 'jpr', 'peo', 'pes', 'prs', 'dv', 'sam', 'ckb']; const s = ((r = this.services) == null ? void 0 : r.languageUtils) || new st(ot()); return t.indexOf(s.getLanguagePartFromCode(e)) > -1 || e.toLowerCase().indexOf('-arab') > 1 ? 'rtl' : 'ltr'
  }

  static createInstance(e = {}, t) {
    return new ce(e, t)
  }

  cloneInstance(e = {}, t = me) {
    const s = e.forkResourceStore; s && delete e.forkResourceStore; const i = { ...this.options, ...e, isClone: !0 }; const r = new ce(i); if ((e.debug !== void 0 || e.prefix !== void 0) && (r.logger = r.logger.clone(e)), ['store', 'services', 'language'].forEach((o) => {
      r[o] = this[o]
    }), r.services = { ...this.services }, r.services.utils = { hasLoadedNamespace: r.hasLoadedNamespace.bind(r) }, s) {
      const o = Object.keys(this.store.data).reduce((l, u) => (l[u] = { ...this.store.data[u] }, l[u] = Object.keys(l[u]).reduce((c, f) => (c[f] = { ...l[u][f] }, c), l[u]), l), {}); r.store = new Xe(o, i), r.services.resourceStore = r.store
    } return r.translator = new Oe(r.services, i), r.translator.on('*', (o, ...l) => {
      r.emit(o, ...l)
    }), r.init(i, t), r.translator.options = i, r.translator.backendConnector.services.utils = { hasLoadedNamespace: r.hasLoadedNamespace.bind(r) }, r
  }

  toJSON() {
    return {
      options: this.options, store: this.store, language: this.language, languages: this.languages, resolvedLanguage: this.resolvedLanguage,
    }
  }
} const D = ce.createInstance(); D.createInstance = ce.createInstance; D.createInstance; D.dir; D.init; D.loadResources; D.reloadResources; D.use; D.changeLanguage; D.getFixedT; D.t; D.exists; D.setDefaultNamespace; D.hasLoadedNamespace; D.loadNamespaces; D.loadLanguages; const L = []; for (let n = 0; n < 256; ++n)L.push((n + 256).toString(16).slice(1)); function fs(n, e = 0) {
  return (`${L[n[e + 0]] + L[n[e + 1]] + L[n[e + 2]] + L[n[e + 3]]}-${L[n[e + 4]]}${L[n[e + 5]]}-${L[n[e + 6]]}${L[n[e + 7]]}-${L[n[e + 8]]}${L[n[e + 9]]}-${L[n[e + 10]]}${L[n[e + 11]]}${L[n[e + 12]]}${L[n[e + 13]]}${L[n[e + 14]]}${L[n[e + 15]]}`).toLowerCase()
} let _e; const hs = new Uint8Array(16); function ds() {
  if (!_e) {
    if (typeof crypto > 'u' || !crypto.getRandomValues) throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported'); _e = crypto.getRandomValues.bind(crypto)
  } return _e(hs)
} const ps = typeof crypto < 'u' && crypto.randomUUID && crypto.randomUUID.bind(crypto); const ut = { randomUUID: ps }; function Pe(n, e, t) {
  let i; if (ut.randomUUID && !n) return ut.randomUUID(); n = n || {}; const s = n.random ?? ((i = n.rng) == null ? void 0 : i.call(n)) ?? ds(); if (s.length < 16) throw new Error('Random bytes length must be >= 16'); return s[6] = s[6] & 15 | 64, s[8] = s[8] & 63 | 128, fs(s)
} const F = {
  data: { feeds: [], posts: [] }, form: { error: '', isValid: !1 }, process: { status: 'filling', error: '' }, uiState: { viewedPosts: new Set(), modal: { isOpen: !1, postId: null } },
}; const gs = {
  ru: {
    translation: {
      error: {
        required: 'Не должно быть пустым', invalid_url: 'Ссылка должна быть валидным URL', duplicate_url: 'RSS уже существует', network_error: 'Ошибка сети', no_rss: 'Ресурс не содержит валидный RSS',
      },
      process: { success: 'RSS успешно загружен' },
    },
  },
}; function Ct(n, e, t, s = Pe()) {
  let m; let p; const r = new DOMParser().parseFromString(n.contents, 'application/xml'); if (r.querySelector('parsererror')) throw new Error(t.t('error.no_rss')); const o = ((m = r.querySelector('title')) == null ? void 0 : m.textContent) || ''; const l = ((p = r.querySelector('description')) == null ? void 0 : p.textContent) || ''; const u = {
    title: o, description: l, id: s, url: e,
  }; const c = r.querySelectorAll('item'); const f = []; return c.forEach((g) => {
    let h; let d; let y; const S = ((h = g.querySelector('title')) == null ? void 0 : h.textContent) || ''; const v = ((d = g.querySelector('description')) == null ? void 0 : d.textContent) || ''; const b = Pe(); const w = ((y = g.querySelector('link')) == null ? void 0 : y.textContent) || ''; f.push({
      title: S, description: v, link: w, id: b, idFeed: s,
    })
  }), { feed: u, posts: f }
} let Fe; let ct; function ms() {
  if (ct) return Fe; ct = 1; function n(b) {
    this._maxSize = b, this.clear()
  }n.prototype.clear = function () {
    this._size = 0, this._values = Object.create(null)
  }, n.prototype.get = function (b) {
    return this._values[b]
  }, n.prototype.set = function (b, w) {
    return this._size >= this._maxSize && this.clear(), b in this._values || this._size++, this._values[b] = w
  }; const e = /[^.^\]^[]+|(?=\[\]|\.\.)/g; const t = /^\d+$/; const s = /^\d/; const i = /[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g; const r = /^\s*(['"]?)(.*?)(\1)\s*$/; const a = 512; const o = new n(a); const l = new n(a); const u = new n(a); Fe = {
    Cache: n,
    split: f,
    normalizePath: c,
    setter(b) {
      const w = c(b); return l.get(b) || l.set(b, (d, y) => {
        for (var x = 0, C = w.length, $ = d; x < C - 1;) {
          const E = w[x]; if (E === '__proto__' || E === 'constructor' || E === 'prototype') return d; $ = $[w[x++]]
        }$[w[x]] = y
      })
    },
    getter(b, w) {
      const h = c(b); return u.get(b) || u.set(b, (y) => {
        for (let x = 0, C = h.length; x < C;) if (y != null || !w)y = y[h[x++]]; else return; return y
      })
    },
    join(b) {
      return b.reduce((w, h) => w + (p(h) || t.test(h) ? `[${h}]` : (w ? '.' : '') + h), '')
    },
    forEach(b, w, h) {
      m(Array.isArray(b) ? b : f(b), w, h)
    },
  }; function c(b) {
    return o.get(b) || o.set(b, f(b).map((w) => w.replace(r, '$2')))
  } function f(b) {
    return b.match(e) || ['']
  } function m(b, w, h) {
    const d = b.length; let y; let x; let C; let $; for (x = 0; x < d; x++)y = b[x], y && (v(y) && (y = `"${y}"`), $ = p(y), C = !$ && /^\d+$/.test(y), w.call(h, y, $, C, x, b))
  } function p(b) {
    return typeof b === 'string' && b && ["'", '"'].indexOf(b.charAt(0)) !== -1
  } function g(b) {
    return b.match(s) && !b.match(t)
  } function S(b) {
    return i.test(b)
  } function v(b) {
    return !p(b) && (g(b) || S(b))
  } return Fe
} const Et = ms(); const ye = { exports: {} }; let ft; function ys() {
  if (ft) return ye.exports; ft = 1, ye.exports = function (i) {
    return n(e(i), i)
  }, ye.exports.array = n; function n(i, r) {
    let a = i.length; const o = new Array(a); const l = {}; let u = a; const c = t(r); const f = s(i); for (r.forEach((p) => {
      if (!f.has(p[0]) || !f.has(p[1])) throw new Error('Unknown node. There is an unknown node in the supplied edges.')
    }); u--;)l[u] || m(i[u], u, new Set()); return o; function m(p, g, S) {
      if (S.has(p)) {
        let v; try {
          v = `, node was:${JSON.stringify(p)}`
        } catch {
          v = ''
        } throw new Error(`Cyclic dependency${v}`)
      } if (!f.has(p)) throw new Error(`Found unknown node. Make sure to provided all involved nodes. Unknown node: ${JSON.stringify(p)}`); if (!l[g]) {
        l[g] = !0; let b = c.get(p) || new Set(); if (b = Array.from(b), g = b.length) {
          S.add(p); do {
            const w = b[--g]; m(w, f.get(w), S)
          } while (g); S.delete(p)
        }o[--a] = p
      }
    }
  } function e(i) {
    for (var r = new Set(), a = 0, o = i.length; a < o; a++) {
      const l = i[a]; r.add(l[0]), r.add(l[1])
    } return Array.from(r)
  } function t(i) {
    for (var r = new Map(), a = 0, o = i.length; a < o; a++) {
      const l = i[a]; r.has(l[0]) || r.set(l[0], new Set()), r.has(l[1]) || r.set(l[1], new Set()), r.get(l[0]).add(l[1])
    } return r
  } function s(i) {
    for (var r = new Map(), a = 0, o = i.length; a < o; a++)r.set(i[a], a); return r
  } return ye.exports
}ys(); const bs = Object.prototype.toString; const xs = Error.prototype.toString; const Ss = RegExp.prototype.toString; const ws = typeof Symbol < 'u' ? Symbol.prototype.toString : () => ''; const Os = /^Symbol\((.*)\)(.*)$/; function Cs(n) {
  return n != +n ? 'NaN' : n === 0 && 1 / n < 0 ? '-0' : `${n}`
} function ht(n, e = !1) {
  if (n == null || n === !0 || n === !1) return `${n}`; const t = typeof n; if (t === 'number') return Cs(n); if (t === 'string') return e ? `"${n}"` : n; if (t === 'function') return `[Function ${n.name || 'anonymous'}]`; if (t === 'symbol') return ws.call(n).replace(Os, 'Symbol($1)'); const s = bs.call(n).slice(8, -1); return s === 'Date' ? isNaN(n.getTime()) ? `${n}` : n.toISOString(n) : s === 'Error' || n instanceof Error ? `[${xs.call(n)}]` : s === 'RegExp' ? Ss.call(n) : null
} function J(n, e) {
  const t = ht(n, e); return t !== null ? t : JSON.stringify(n, function (s, i) {
    const r = ht(this[s], e); return r !== null ? r : i
  }, 2)
} function vt(n) {
  return n == null ? [] : [].concat(n)
} let $t; let kt; let _t; const Es = /\$\{\s*(\w+)\s*\}/g; $t = Symbol.toStringTag; class dt {
  constructor(e, t, s, i) {
    this.name = void 0, this.message = void 0, this.value = void 0, this.path = void 0, this.type = void 0, this.params = void 0, this.errors = void 0, this.inner = void 0, this[$t] = 'Error', this.name = 'ValidationError', this.value = t, this.path = s, this.type = i, this.errors = [], this.inner = [], vt(e).forEach((r) => {
      if (I.isError(r)) {
        this.errors.push(...r.errors); const a = r.inner.length ? r.inner : [r]; this.inner.push(...a)
      } else this.errors.push(r)
    }), this.message = this.errors.length > 1 ? `${this.errors.length} errors occurred` : this.errors[0]
  }
}kt = Symbol.hasInstance; _t = Symbol.toStringTag; class I extends Error {
  static formatError(e, t) {
    const s = t.label || t.path || 'this'; return t = { ...t, path: s, originalPath: t.path }, typeof e === 'string' ? e.replace(Es, (i, r) => J(t[r])) : typeof e === 'function' ? e(t) : e
  }

  static isError(e) {
    return e && e.name === 'ValidationError'
  }

  constructor(e, t, s, i, r) {
    const a = new dt(e, t, s, i); if (r) return a; super(), this.value = void 0, this.path = void 0, this.type = void 0, this.params = void 0, this.errors = [], this.inner = [], this[_t] = 'Error', this.name = a.name, this.message = a.message, this.type = a.type, this.value = a.value, this.path = a.path, this.errors = a.errors, this.inner = a.inner, Error.captureStackTrace && Error.captureStackTrace(this, I)
  }

  static [kt](e) {
    return dt[Symbol.hasInstance](e) || super[Symbol.hasInstance](e)
  }
} const U = {
  default: '${path} is invalid',
  required: '${path} is a required field',
  defined: '${path} must be defined',
  notNull: '${path} cannot be null',
  oneOf: '${path} must be one of the following values: ${values}',
  notOneOf: '${path} must not be one of the following values: ${values}',
  notType: ({
    path: n, type: e, value: t, originalValue: s,
  }) => {
    const i = s != null && s !== t ? ` (cast from the value \`${J(s, !0)}\`).` : '.'; return e !== 'mixed' ? `${n} must be a \`${e}\` type, but the final value was: \`${J(t, !0)}\`${i}` : `${n} must match the configured type. The validated value was: \`${J(t, !0)}\`${i}`
  },
}; const A = {
  length: '${path} must be exactly ${length} characters', min: '${path} must be at least ${min} characters', max: '${path} must be at most ${max} characters', matches: '${path} must match the following: "${regex}"', email: '${path} must be a valid email', url: '${path} must be a valid URL', uuid: '${path} must be a valid UUID', datetime: '${path} must be a valid ISO date-time', datetime_precision: '${path} must be a valid ISO date-time with a sub-second precision of exactly ${precision} digits', datetime_offset: '${path} must be a valid ISO date-time with UTC "Z" timezone', trim: '${path} must be a trimmed string', lowercase: '${path} must be a lowercase string', uppercase: '${path} must be a upper case string',
}; const vs = {
  min: '${path} must be greater than or equal to ${min}', max: '${path} must be less than or equal to ${max}', lessThan: '${path} must be less than ${less}', moreThan: '${path} must be greater than ${more}', positive: '${path} must be a positive number', negative: '${path} must be a negative number', integer: '${path} must be an integer',
}; const Ne = { min: '${path} field must be later than ${min}', max: '${path} field must be at earlier than ${max}' }; const $s = { isValue: '${path} field must be ${value}' }; const ks = { noUnknown: '${path} field has unspecified keys: ${unknown}', exact: '${path} object contains unknown properties: ${properties}' }; const _s = { min: '${path} field must have at least ${min} items', max: '${path} field must have less than or equal to ${max} items', length: '${path} must have ${length} items' }; const Fs = {
  notType: (n) => {
    const { path: e, value: t, spec: s } = n; const i = s.types.length; if (Array.isArray(t)) {
      if (t.length < i) return `${e} tuple value has too few items, expected a length of ${i} but got ${t.length} for value: \`${J(t, !0)}\``; if (t.length > i) return `${e} tuple value has too many items, expected a length of ${i} but got ${t.length} for value: \`${J(t, !0)}\``
    } return I.formatError(U.notType, n)
  },
}; const Ts = Object.assign(Object.create(null), {
  mixed: U, string: A, number: vs, date: Ne, object: ks, array: _s, boolean: $s, tuple: Fs,
}); const Ft = (n) => n && n.__isYupSchema__; class Ce {
  static fromOptions(e, t) {
    if (!t.then && !t.otherwise) throw new TypeError('either `then:` or `otherwise:` is required for `when()` conditions'); const { is: s, then: i, otherwise: r } = t; const a = typeof s === 'function' ? s : (...o) => o.every((l) => l === s); return new Ce(e, (o, l) => {
      let u; const c = a(...o) ? i : r; return (u = c == null ? void 0 : c(l)) != null ? u : l
    })
  }

  constructor(e, t) {
    this.fn = void 0, this.refs = e, this.refs = e, this.fn = t
  }

  resolve(e, t) {
    const s = this.refs.map((r) => r.getValue(t == null ? void 0 : t.value, t == null ? void 0 : t.parent, t == null ? void 0 : t.context)); const i = this.fn(s, e, t); if (i === void 0 || i === e) return e; if (!Ft(i)) throw new TypeError('conditions must return a schema object'); return i.resolve(t)
  }
} const be = { context: '$', value: '.' }; class fe {
  constructor(e, t = {}) {
    if (this.key = void 0, this.isContext = void 0, this.isValue = void 0, this.isSibling = void 0, this.path = void 0, this.getter = void 0, this.map = void 0, typeof e !== 'string') throw new TypeError(`ref must be a string, got: ${e}`); if (this.key = e.trim(), e === '') throw new TypeError('ref must be a non-empty string'); this.isContext = this.key[0] === be.context, this.isValue = this.key[0] === be.value, this.isSibling = !this.isContext && !this.isValue; const s = this.isContext ? be.context : this.isValue ? be.value : ''; this.path = this.key.slice(s.length), this.getter = this.path && Et.getter(this.path, !0), this.map = t.map
  }

  getValue(e, t, s) {
    let i = this.isContext ? s : this.isValue ? e : t; return this.getter && (i = this.getter(i || {})), this.map && (i = this.map(i)), i
  }

  cast(e, t) {
    return this.getValue(e, t == null ? void 0 : t.parent, t == null ? void 0 : t.context)
  }

  resolve() {
    return this
  }

  describe() {
    return { type: 'ref', key: this.key }
  }

  toString() {
    return `Ref(${this.key})`
  }

  static isRef(e) {
    return e && e.__isYupRef
  }
}fe.prototype.__isYupRef = !0; const X = (n) => n == null; function se(n) {
  function e({
    value: t, path: s = '', options: i, originalValue: r, schema: a,
  }, o, l) {
    const {
      name: u, test: c, params: f, message: m, skipAbsent: p,
    } = n; const {
      parent: g, context: S, abortEarly: v = a.spec.abortEarly, disableStackTrace: b = a.spec.disableStackTrace,
    } = i; function w(k) {
      return fe.isRef(k) ? k.getValue(t, g, S) : k
    } function h(k = {}) {
      const N = {
        value: t, originalValue: r, label: a.spec.label, path: k.path || s, spec: a.spec, disableStackTrace: k.disableStackTrace || b, ...f, ...k.params,
      }; for (const T of Object.keys(N))N[T] = w(N[T]); const R = new I(I.formatError(k.message || m, N), t, N.path, k.type || u, N.disableStackTrace); return R.params = N, R
    } const d = v ? o : l; const y = {
      path: s, parent: g, type: u, from: i.from, createError: h, resolve: w, options: i, originalValue: r, schema: a,
    }; const x = (k) => {
      I.isError(k) ? d(k) : k ? l(null) : d(h())
    }; const C = (k) => {
      I.isError(k) ? d(k) : o(k)
    }; if (p && X(t)) return x(!0); let E; try {
      let _; if (E = c.call(y, t, y), typeof ((_ = E) == null ? void 0 : _.then) === 'function') {
        if (i.sync) throw new Error(`Validation test of type: "${y.type}" returned a Promise during a synchronous validate. This test will finish after the validate call has returned`); return Promise.resolve(E).then(x, C)
      }
    } catch (k) {
      C(k); return
    }x(E)
  } return e.OPTIONS = n, e
} function Ls(n, e, t, s = t) {
  let i; let r; let a; return e ? (Et.forEach(e, (o, l, u) => {
    const c = l ? o.slice(1, o.length - 1) : o; n = n.resolve({ context: s, parent: i, value: t }); const f = n.type === 'tuple'; const m = u ? parseInt(c, 10) : 0; if (n.innerType || f) {
      if (f && !u) throw new Error(`Yup.reach cannot implicitly index into a tuple type. the path part "${a}" must contain an index to the tuple element, e.g. "${a}[0]"`); if (t && m >= t.length) throw new Error(`Yup.reach cannot resolve an array item at index: ${o}, in the path: ${e}. because there is no value at that index. `); i = t, t = t && t[m], n = f ? n.spec.types[m] : n.innerType
    } if (!u) {
      if (!n.fields || !n.fields[c]) throw new Error(`The schema does not contain the path: ${e}. (failed at: ${a} which is a type: "${n.type}")`); i = t, t = t && t[c], n = n.fields[c]
    }r = c, a = l ? `[${o}]` : `.${o}`
  }), { schema: n, parent: i, parentPath: r }) : { parent: i, parentPath: e, schema: n }
} class Ee extends Set {
  describe() {
    const e = []; for (const t of this.values())e.push(fe.isRef(t) ? t.describe() : t); return e
  }

  resolveAll(e) {
    const t = []; for (const s of this.values())t.push(e(s)); return t
  }

  clone() {
    return new Ee(this.values())
  }

  merge(e, t) {
    const s = this.clone(); return e.forEach((i) => s.add(i)), t.forEach((i) => s.delete(i)), s
  }
} function ie(n, e = new Map()) {
  if (Ft(n) || !n || typeof n !== 'object') return n; if (e.has(n)) return e.get(n); let t; if (n instanceof Date)t = new Date(n.getTime()), e.set(n, t); else if (n instanceof RegExp)t = new RegExp(n), e.set(n, t); else if (Array.isArray(n)) {
    t = new Array(n.length), e.set(n, t); for (let s = 0; s < n.length; s++)t[s] = ie(n[s], e)
  } else if (n instanceof Map) {
    t = new Map(), e.set(n, t); for (const [s, i] of n.entries())t.set(s, ie(i, e))
  } else if (n instanceof Set) {
    t = new Set(), e.set(n, t); for (const s of n)t.add(ie(s, e))
  } else if (n instanceof Object) {
    t = {}, e.set(n, t); for (const [s, i] of Object.entries(n))t[s] = ie(i, e)
  } else throw Error(`Unable to clone ${n}`); return t
} class Y {
  constructor(e) {
    this.type = void 0, this.deps = [], this.tests = void 0, this.transforms = void 0, this.conditions = [], this._mutate = void 0, this.internalTests = {}, this._whitelist = new Ee(), this._blacklist = new Ee(), this.exclusiveTests = Object.create(null), this._typeCheck = void 0, this.spec = void 0, this.tests = [], this.transforms = [], this.withMutation(() => {
      this.typeError(U.notType)
    }), this.type = e.type, this._typeCheck = e.check, this.spec = {
      strip: !1, strict: !1, abortEarly: !0, recursive: !0, disableStackTrace: !1, nullable: !1, optional: !0, coerce: !0, ...(e == null ? void 0 : e.spec),
    }, this.withMutation((t) => {
      t.nonNullable()
    })
  }

  get _type() {
    return this.type
  }

  clone(e) {
    if (this._mutate) return e && Object.assign(this.spec, e), this; const t = Object.create(Object.getPrototypeOf(this)); return t.type = this.type, t._typeCheck = this._typeCheck, t._whitelist = this._whitelist.clone(), t._blacklist = this._blacklist.clone(), t.internalTests = { ...this.internalTests }, t.exclusiveTests = { ...this.exclusiveTests }, t.deps = [...this.deps], t.conditions = [...this.conditions], t.tests = [...this.tests], t.transforms = [...this.transforms], t.spec = ie({ ...this.spec, ...e }), t
  }

  label(e) {
    const t = this.clone(); return t.spec.label = e, t
  }

  meta(...e) {
    if (e.length === 0) return this.spec.meta; const t = this.clone(); return t.spec.meta = Object.assign(t.spec.meta || {}, e[0]), t
  }

  withMutation(e) {
    const t = this._mutate; this._mutate = !0; const s = e(this); return this._mutate = t, s
  }

  concat(e) {
    if (!e || e === this) return this; if (e.type !== this.type && this.type !== 'mixed') throw new TypeError(`You cannot \`concat()\` schema's of different types: ${this.type} and ${e.type}`); const t = this; const s = e.clone(); const i = { ...t.spec, ...s.spec }; return s.spec = i, s.internalTests = { ...t.internalTests, ...s.internalTests }, s._whitelist = t._whitelist.merge(e._whitelist, e._blacklist), s._blacklist = t._blacklist.merge(e._blacklist, e._whitelist), s.tests = t.tests, s.exclusiveTests = t.exclusiveTests, s.withMutation((r) => {
      e.tests.forEach((a) => {
        r.test(a.OPTIONS)
      })
    }), s.transforms = [...t.transforms, ...s.transforms], s
  }

  isType(e) {
    return e == null ? !!(this.spec.nullable && e === null || this.spec.optional && e === void 0) : this._typeCheck(e)
  }

  resolve(e) {
    let t = this; if (t.conditions.length) {
      const s = t.conditions; t = t.clone(), t.conditions = [], t = s.reduce((i, r) => r.resolve(i, e), t), t = t.resolve(e)
    } return t
  }

  resolveOptions(e) {
    let t; let s; let i; let r; return {
      ...e, from: e.from || [], strict: (t = e.strict) != null ? t : this.spec.strict, abortEarly: (s = e.abortEarly) != null ? s : this.spec.abortEarly, recursive: (i = e.recursive) != null ? i : this.spec.recursive, disableStackTrace: (r = e.disableStackTrace) != null ? r : this.spec.disableStackTrace,
    }
  }

  cast(e, t = {}) {
    const s = this.resolve({ value: e, ...t }); const i = t.assert === 'ignore-optionality'; const r = s._cast(e, t); if (t.assert !== !1 && !s.isType(r)) {
      if (i && X(r)) return r; const a = J(e); const o = J(r); throw new TypeError(`The value of ${t.path || 'field'} could not be cast to a value that satisfies the schema type: "${s.type}". 

attempted value: ${a} 
${o !== a ? `result of cast: ${o}` : ''}`)
    } return r
  }

  _cast(e, t) {
    let s = e === void 0 ? e : this.transforms.reduce((i, r) => r.call(this, i, e, this), e); return s === void 0 && (s = this.getDefault(t)), s
  }

  _validate(e, t = {}, s, i) {
    const { path: r, originalValue: a = e, strict: o = this.spec.strict } = t; let l = e; o || (l = this._cast(l, { assert: !1, ...t })); const u = []; for (const c of Object.values(this.internalTests))c && u.push(c); this.runTests({
      path: r, value: l, originalValue: a, options: t, tests: u,
    }, s, (c) => {
      if (c.length) return i(c, l); this.runTests({
        path: r, value: l, originalValue: a, options: t, tests: this.tests,
      }, s, i)
    })
  }

  runTests(e, t, s) {
    let i = !1; const {
      tests: r, value: a, originalValue: o, path: l, options: u,
    } = e; const c = (S) => {
      i || (i = !0, t(S, a))
    }; const f = (S) => {
      i || (i = !0, s(S, a))
    }; let m = r.length; const p = []; if (!m) return f([]); const g = {
      value: a, originalValue: o, path: l, options: u, schema: this,
    }; for (let S = 0; S < r.length; S++) {
      const v = r[S]; v(g, c, (w) => {
        w && (Array.isArray(w) ? p.push(...w) : p.push(w)), --m <= 0 && f(p)
      })
    }
  }

  asNestedTest({
    key: e, index: t, parent: s, parentPath: i, originalParent: r, options: a,
  }) {
    const o = e ?? t; if (o == null) throw TypeError('Must include `key` or `index` for nested validations'); const l = typeof o === 'number'; const u = s[o]; const c = {
      ...a, strict: !0, parent: s, value: u, originalValue: r[o], key: void 0, [l ? 'index' : 'key']: o, path: l || o.includes('.') ? `${i || ''}[${l ? o : `"${o}"`}]` : (i ? `${i}.` : '') + e,
    }; return (f, m, p) => this.resolve(c)._validate(u, c, m, p)
  }

  validate(e, t) {
    let s; const i = this.resolve({ ...t, value: e }); const r = (s = t == null ? void 0 : t.disableStackTrace) != null ? s : i.spec.disableStackTrace; return new Promise((a, o) => i._validate(e, t, (l, u) => {
      I.isError(l) && (l.value = u), o(l)
    }, (l, u) => {
      l.length ? o(new I(l, u, void 0, void 0, r)) : a(u)
    }))
  }

  validateSync(e, t) {
    let s; const i = this.resolve({ ...t, value: e }); let r; const a = (s = t == null ? void 0 : t.disableStackTrace) != null ? s : i.spec.disableStackTrace; return i._validate(e, { ...t, sync: !0 }, (o, l) => {
      throw I.isError(o) && (o.value = l), o
    }, (o, l) => {
      if (o.length) throw new I(o, e, void 0, void 0, a); r = l
    }), r
  }

  isValid(e, t) {
    return this.validate(e, t).then(() => !0, (s) => {
      if (I.isError(s)) return !1; throw s
    })
  }

  isValidSync(e, t) {
    try {
      return this.validateSync(e, t), !0
    } catch (s) {
      if (I.isError(s)) return !1; throw s
    }
  }

  _getDefault(e) {
    const t = this.spec.default; return t == null ? t : typeof t === 'function' ? t.call(this, e) : ie(t)
  }

  getDefault(e) {
    return this.resolve(e || {})._getDefault(e)
  }

  default(e) {
    return arguments.length === 0 ? this._getDefault() : this.clone({ default: e })
  }

  strict(e = !0) {
    return this.clone({ strict: e })
  }

  nullability(e, t) {
    const s = this.clone({ nullable: e }); return s.internalTests.nullable = se({
      message: t,
      name: 'nullable',
      test(i) {
        return i === null ? this.schema.spec.nullable : !0
      },
    }), s
  }

  optionality(e, t) {
    const s = this.clone({ optional: e }); return s.internalTests.optionality = se({
      message: t,
      name: 'optionality',
      test(i) {
        return i === void 0 ? this.schema.spec.optional : !0
      },
    }), s
  }

  optional() {
    return this.optionality(!0)
  }

  defined(e = U.defined) {
    return this.optionality(!1, e)
  }

  nullable() {
    return this.nullability(!0)
  }

  nonNullable(e = U.notNull) {
    return this.nullability(!1, e)
  }

  required(e = U.required) {
    return this.clone().withMutation((t) => t.nonNullable(e).defined(e))
  }

  notRequired() {
    return this.clone().withMutation((e) => e.nullable().optional())
  }

  transform(e) {
    const t = this.clone(); return t.transforms.push(e), t
  }

  test(...e) {
    let t; if (e.length === 1 ? typeof e[0] === 'function' ? t = { test: e[0] } : t = e[0] : e.length === 2 ? t = { name: e[0], test: e[1] } : t = { name: e[0], message: e[1], test: e[2] }, t.message === void 0 && (t.message = U.default), typeof t.test !== 'function') throw new TypeError('`test` is a required parameters'); const s = this.clone(); const i = se(t); const r = t.exclusive || t.name && s.exclusiveTests[t.name] === !0; if (t.exclusive && !t.name) throw new TypeError('Exclusive tests must provide a unique `name` identifying the test'); return t.name && (s.exclusiveTests[t.name] = !!t.exclusive), s.tests = s.tests.filter((a) => !(a.OPTIONS.name === t.name && (r || a.OPTIONS.test === i.OPTIONS.test))), s.tests.push(i), s
  }

  when(e, t) {
    !Array.isArray(e) && typeof e !== 'string' && (t = e, e = '.'); const s = this.clone(); const i = vt(e).map((r) => new fe(r)); return i.forEach((r) => {
      r.isSibling && s.deps.push(r.key)
    }), s.conditions.push(typeof t === 'function' ? new Ce(i, t) : Ce.fromOptions(i, t)), s
  }

  typeError(e) {
    const t = this.clone(); return t.internalTests.typeError = se({
      message: e,
      name: 'typeError',
      skipAbsent: !0,
      test(s) {
        return this.schema._typeCheck(s) ? !0 : this.createError({ params: { type: this.schema.type } })
      },
    }), t
  }

  oneOf(e, t = U.oneOf) {
    const s = this.clone(); return e.forEach((i) => {
      s._whitelist.add(i), s._blacklist.delete(i)
    }), s.internalTests.whiteList = se({
      message: t,
      name: 'oneOf',
      skipAbsent: !0,
      test(i) {
        const r = this.schema._whitelist; const a = r.resolveAll(this.resolve); return a.includes(i) ? !0 : this.createError({ params: { values: Array.from(r).join(', '), resolved: a } })
      },
    }), s
  }

  notOneOf(e, t = U.notOneOf) {
    const s = this.clone(); return e.forEach((i) => {
      s._blacklist.add(i), s._whitelist.delete(i)
    }), s.internalTests.blacklist = se({
      message: t,
      name: 'notOneOf',
      test(i) {
        const r = this.schema._blacklist; const a = r.resolveAll(this.resolve); return a.includes(i) ? this.createError({ params: { values: Array.from(r).join(', '), resolved: a } }) : !0
      },
    }), s
  }

  strip(e = !0) {
    const t = this.clone(); return t.spec.strip = e, t
  }

  describe(e) {
    const t = (e ? this.resolve(e) : this).clone(); const {
      label: s, meta: i, optional: r, nullable: a,
    } = t.spec; return {
      meta: i, label: s, optional: r, nullable: a, default: t.getDefault(e), type: t.type, oneOf: t._whitelist.describe(), notOneOf: t._blacklist.describe(), tests: t.tests.map((l) => ({ name: l.OPTIONS.name, params: l.OPTIONS.params })).filter((l, u, c) => c.findIndex((f) => f.name === l.name) === u),
    }
  }
}Y.prototype.__isYupSchema__ = !0; for (const n of ['validate', 'validateSync']) {
  Y.prototype[`${n}At`] = function (e, t, s = {}) {
    const { parent: i, parentPath: r, schema: a } = Ls(this, e, t, s.context); return a[n](i && i[r], { ...s, parent: i, path: e })
  }
} for (const n of ['equals', 'is'])Y.prototype[n] = Y.prototype.oneOf; for (const n of ['not', 'nope'])Y.prototype[n] = Y.prototype.notOneOf; const Rs = /^(\d{4}|[+-]\d{6})(?:-?(\d{2})(?:-?(\d{2}))?)?(?:[ T]?(\d{2}):?(\d{2})(?::?(\d{2})(?:[,.](\d{1,}))?)?(?:(Z)|([+-])(\d{2})(?::?(\d{2}))?)?)?$/; function Ds(n) {
  const e = Ae(n); if (!e) return Date.parse ? Date.parse(n) : Number.NaN; if (e.z === void 0 && e.plusMinus === void 0) return new Date(e.year, e.month, e.day, e.hour, e.minute, e.second, e.millisecond).valueOf(); let t = 0; return e.z !== 'Z' && e.plusMinus !== void 0 && (t = e.hourOffset * 60 + e.minuteOffset, e.plusMinus === '+' && (t = 0 - t)), Date.UTC(e.year, e.month, e.day, e.hour, e.minute + t, e.second, e.millisecond)
} function Ae(n) {
  let e; let t; const s = Rs.exec(n); return s ? {
    year: K(s[1]), month: K(s[2], 1) - 1, day: K(s[3], 1), hour: K(s[4]), minute: K(s[5]), second: K(s[6]), millisecond: s[7] ? K(s[7].substring(0, 3)) : 0, precision: (e = (t = s[7]) == null ? void 0 : t.length) != null ? e : void 0, z: s[8] || void 0, plusMinus: s[9] || void 0, hourOffset: K(s[10]), minuteOffset: K(s[11]),
  } : null
} function K(n, e = 0) {
  return Number(n) || e
} const Ps = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/; const Ns = /^((https?|ftp):)?\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i; const As = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i; const Ms = '^\\d{4}-\\d{2}-\\d{2}'; const Is = '\\d{2}:\\d{2}:\\d{2}'; const js = '(([+-]\\d{2}(:?\\d{2})?)|Z)'; const Vs = new RegExp(`${Ms}T${Is}(\\.\\d+)?${js}$`); const Us = (n) => X(n) || n === n.trim(); const Hs = {}.toString(); function Tt() {
  return new Lt()
} class Lt extends Y {
  constructor() {
    super({
      type: 'string',
      check(e) {
        return e instanceof String && (e = e.valueOf()), typeof e === 'string'
      },
    }), this.withMutation(() => {
      this.transform((e, t, s) => {
        if (!s.spec.coerce || s.isType(e) || Array.isArray(e)) return e; const i = e != null && e.toString ? e.toString() : e; return i === Hs ? e : i
      })
    })
  }

  required(e) {
    return super.required(e).withMutation((t) => t.test({
      message: e || U.required, name: 'required', skipAbsent: !0, test: (s) => !!s.length,
    }))
  }

  notRequired() {
    return super.notRequired().withMutation((e) => (e.tests = e.tests.filter((t) => t.OPTIONS.name !== 'required'), e))
  }

  length(e, t = A.length) {
    return this.test({
      message: t,
      name: 'length',
      exclusive: !0,
      params: { length: e },
      skipAbsent: !0,
      test(s) {
        return s.length === this.resolve(e)
      },
    })
  }

  min(e, t = A.min) {
    return this.test({
      message: t,
      name: 'min',
      exclusive: !0,
      params: { min: e },
      skipAbsent: !0,
      test(s) {
        return s.length >= this.resolve(e)
      },
    })
  }

  max(e, t = A.max) {
    return this.test({
      name: 'max',
      exclusive: !0,
      message: t,
      params: { max: e },
      skipAbsent: !0,
      test(s) {
        return s.length <= this.resolve(e)
      },
    })
  }

  matches(e, t) {
    let s = !1; let i; let r; return t && (typeof t === 'object' ? { excludeEmptyString: s = !1, message: i, name: r } = t : i = t), this.test({
      name: r || 'matches', message: i || A.matches, params: { regex: e }, skipAbsent: !0, test: (a) => a === '' && s || a.search(e) !== -1,
    })
  }

  email(e = A.email) {
    return this.matches(Ps, { name: 'email', message: e, excludeEmptyString: !0 })
  }

  url(e = A.url) {
    return this.matches(Ns, { name: 'url', message: e, excludeEmptyString: !0 })
  }

  uuid(e = A.uuid) {
    return this.matches(As, { name: 'uuid', message: e, excludeEmptyString: !1 })
  }

  datetime(e) {
    let t = ''; let s; let i; return e && (typeof e === 'object' ? { message: t = '', allowOffset: s = !1, precision: i = void 0 } = e : t = e), this.matches(Vs, { name: 'datetime', message: t || A.datetime, excludeEmptyString: !0 }).test({
      name: 'datetime_offset',
      message: t || A.datetime_offset,
      params: { allowOffset: s },
      skipAbsent: !0,
      test: (r) => {
        if (!r || s) return !0; const a = Ae(r); return a ? !!a.z : !1
      },
    }).test({
      name: 'datetime_precision',
      message: t || A.datetime_precision,
      params: { precision: i },
      skipAbsent: !0,
      test: (r) => {
        if (!r || i == null) return !0; const a = Ae(r); return a ? a.precision === i : !1
      },
    })
  }

  ensure() {
    return this.default('').transform((e) => (e === null ? '' : e))
  }

  trim(e = A.trim) {
    return this.transform((t) => (t != null ? t.trim() : t)).test({ message: e, name: 'trim', test: Us })
  }

  lowercase(e = A.lowercase) {
    return this.transform((t) => (X(t) ? t : t.toLowerCase())).test({
      message: e, name: 'string_case', exclusive: !0, skipAbsent: !0, test: (t) => X(t) || t === t.toLowerCase(),
    })
  }

  uppercase(e = A.uppercase) {
    return this.transform((t) => (X(t) ? t : t.toUpperCase())).test({
      message: e, name: 'string_case', exclusive: !0, skipAbsent: !0, test: (t) => X(t) || t === t.toUpperCase(),
    })
  }
}Tt.prototype = Lt.prototype; const zs = new Date(''); const Ks = (n) => Object.prototype.toString.call(n) === '[object Date]'; class Ve extends Y {
  constructor() {
    super({
      type: 'date',
      check(e) {
        return Ks(e) && !isNaN(e.getTime())
      },
    }), this.withMutation(() => {
      this.transform((e, t, s) => (!s.spec.coerce || s.isType(e) || e === null ? e : (e = Ds(e), isNaN(e) ? Ve.INVALID_DATE : new Date(e))))
    })
  }

  prepareParam(e, t) {
    let s; if (fe.isRef(e))s = e; else {
      const i = this.cast(e); if (!this._typeCheck(i)) throw new TypeError(`\`${t}\` must be a Date or a value that can be \`cast()\` to a Date`); s = i
    } return s
  }

  min(e, t = Ne.min) {
    const s = this.prepareParam(e, 'min'); return this.test({
      message: t,
      name: 'min',
      exclusive: !0,
      params: { min: e },
      skipAbsent: !0,
      test(i) {
        return i >= this.resolve(s)
      },
    })
  }

  max(e, t = Ne.max) {
    const s = this.prepareParam(e, 'max'); return this.test({
      message: t,
      name: 'max',
      exclusive: !0,
      params: { max: e },
      skipAbsent: !0,
      test(i) {
        return i <= this.resolve(s)
      },
    })
  }
}Ve.INVALID_DATE = zs; function qs(n) {
  Object.keys(n).forEach((e) => {
    Object.keys(n[e]).forEach((t) => {
      Ts[e][t] = n[e][t]
    })
  })
} const Bs = (n, e) => new Promise((t) => {
  const s = e.some((i) => i.url === n); t(s)
}); const Ws = (n) => (qs({ mixed: { required: () => n.t('error.required') }, string: { url: () => n.t('error.invalid_url') } }), (e) => ({
  validate: (t) => {
    const { url: s } = t; return Tt().required().url().test('is-unique', () => n.t('error.duplicate_url'), (r) => (r ? Bs(r, e).then((a) => !a) : !0))
      .validate(s, { abortEarly: !1 })
      .then(() => ({ isValid: !0, error: null }))
      .catch((r) => ({ isValid: !1, error: r.errors }))
  },
})); const Rt = (n, e, t) => {
  const s = document.getElementById('url-input'); const i = document.querySelector('.feedback'); i.innerHTML = ''; const r = document.createElement('div'); switch (i.appendChild(r), s.classList.remove('is-invalid'), i.classList.remove('text-danger', 'text-success'), t) {
    case 'success': s.classList.remove('is-invalid'), i.classList.add('text-success'), r.textContent = e.t('process.success'); break; case 'failed': console.log(r), s.classList.remove('is-invalid'), i.classList.add('text-danger'), r.textContent = n; break; case 'filling': n && (s.classList.add('is-invalid'), i.classList.add('text-danger'), r.textContent = n); break
  }
}; const Js = (n, e = '.feeds') => {
  const t = document.querySelector(e); t.innerHTML = ''; const s = document.createElement('div'); s.className = 'card border-0'; const i = document.createElement('div'); i.className = 'card-body'; const r = document.createElement('h2'); r.className = 'card-title h4', r.textContent = 'Фиды', i.appendChild(r), s.appendChild(i); const a = document.createElement('ul'); a.className = 'list-group border-0 rounded-0', n.forEach((o) => {
    const l = document.createElement('li'); l.className = 'list-group-item border-0 border-end-0'; const u = document.createElement('h3'); u.className = 'h6 m-0', u.textContent = o.title; const c = document.createElement('p'); c.className = 'm-0 small text-black-50', c.textContent = o.description, l.appendChild(u), l.appendChild(c), a.appendChild(l)
  }), s.appendChild(a), t.appendChild(s)
}; const Gs = (n, e, t) => {
  const s = document.querySelector('.posts'); s.innerHTML = ''; const i = document.createElement('div'); i.className = 'card border-0'; const r = document.createElement('div'); r.className = 'card-body'; const a = document.createElement('h2'); a.className = 'card-title h4', a.textContent = 'Посты', r.appendChild(a), i.appendChild(r); const o = document.createElement('ul'); o.className = 'list-group border-0 rounded-0', n.forEach((l) => {
    const u = document.createElement('li'); u.className = 'list-group-item d-flex justify-content-between align-items-start border-0 border-end-0'; const c = document.createElement('a'); c.href = l.link, c.className = e.has(l.id) ? 'fw-normal link-secondary' : 'fw-bold', c.textContent = l.title, c.setAttribute('target', '_blank'), c.setAttribute('rel', 'noopener noreferrer'), c.dataset.id = l.id, c.addEventListener('click', () => t(l.id, !1)); const f = document.createElement('button'); f.type = 'button', f.className = 'btn btn-outline-primary btn-sm', f.textContent = 'Просмотр', f.dataset.id = l.id, f.dataset.bsToggle = 'modal', f.dataset.bsTarget = '#modal', f.addEventListener('click', () => t(l.id, !0)), u.appendChild(c), u.appendChild(f), o.appendChild(u)
  }), i.appendChild(o), s.appendChild(i)
}; const Ys = (n, e) => {
  const t = document.getElementById('modal'); if (!t) return; const s = e.find((i) => i.id === n.postId); s && (t.querySelector('.modal-title').textContent = s.title, t.querySelector('.modal-body').textContent = s.description, t.querySelector('.full-article').href = s.link, n.isOpen ? (t.classList.add('show'), t.style.display = 'block', t.setAttribute('aria-modal', 'true')) : (t.classList.remove('show'), t.style.display = 'none', t.setAttribute('aria-hidden', 'true'), t.querySelector('.modal-title').textContent = '', t.querySelector('.modal-body').textContent = ''))
}; const Zs = (n, e) => {
  n.forEach((t) => {
    const s = t.querySelector('a'); s && s.dataset.id === e && (s.classList.remove('fw-bold'), s.classList.add('fw-normal', 'link-secondary'))
  })
}; const q = D.createInstance(); q.init({ lng: 'ru', debug: !1, resources: gs }); const Qs = Ws(q); const Te = ne(F.form, (n, e) => {
  n === 'error' && Rt(e, q, F.process.status)
}); const ve = ne(F.uiState, (n) => {
  n.startsWith('modal') && Ys(F.uiState.modal, F.data.posts)
}); const Xs = () => {
  ve.modal.isOpen = !1, ve.modal.postId = null
}; const ei = (n, e = !0) => {
  ve.viewedPosts.add(n); const t = document.querySelectorAll('.list-group-item'); Zs(t, n), ve.modal = { isOpen: e, postId: n }
}; const Me = ne(F.data, (n, e) => {
  console.log('Data changed:', n, e), n === 'feeds' && Js(F.data.feeds), n === 'posts' && Gs(F.data.posts, F.uiState.viewedPosts, ei)
}); const B = ne(F.process, (n, e) => {
  const t = document.querySelector('.rss-form .btn-primary'); n === 'status' && (t.disabled = F.process.status === 'processing'), n === 'error' && Rt(e, q, F.process.status)
}); const ti = (n) => Qs(F.data.feeds).validate({ url: n }, { abortEarly: !1 }); const Ie = () => {
  if (F.data.feeds.length === 0) {
    setTimeout(Ie, 5e3); return
  } const n = F.data.feeds.map((e) => fetch(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(e.url)}`).then((t) => {
    if (t.ok) return t.json(); throw new Error('Network response was not ok.')
  }).then((t) => {
    const { posts: s } = Ct(t, e.url, q, e.id); const i = new Set(F.data.posts.filter((a) => a.idFeed === e.id).map((a) => a.link)); const r = s.filter((a) => !i.has(a.link)); r.length > 0 && (Me.posts = [...r, ...F.data.posts])
  }).catch((t) => console.error(`Ошибка обновления фида ${e.url}:`, t))); Promise.all(n).finally(() => setTimeout(Ie, 5e3))
}; const si = () => {
  const n = document.querySelector('.rss-form'); const e = document.getElementById('url-input'); const t = (i) => {
    i.preventDefault(); const { value: r } = e; const a = r.trim(); B.status = 'filling', B.error = '', Te.error = '', ti(a).then(({ isValid: o, error: l }) => {
      if (Te.isValid = o, Te.error = l, o) {
        return B.status = 'processing', fetch(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(a)}`).then((u) => {
          if (u.ok) return u.json(); throw new Error('Network response was not ok.')
        }).then((u) => {
          const c = Pe(); const { feed: f, posts: m } = Ct(u, a, q, c); B.status = 'success', Me.feeds = [f, ...F.data.feeds], Me.posts = [...m, ...F.data.posts], B.error = null, e.value = '', e.focus()
        }).catch((u) => {
          B.status = 'failed', u.message === q.t('error.no_rss') ? B.error = q.t('error.no_rss') : B.error = q.t('error.network_error')
        })
      }
    })
  }; n.addEventListener('submit', t), document.querySelectorAll('[data-bs-dismiss="modal"]').forEach((i) => {
    i.addEventListener('click', Xs)
  }), setTimeout(Ie, 5e3)
}; si()
