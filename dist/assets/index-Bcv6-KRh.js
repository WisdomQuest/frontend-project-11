(function () { const e = document.createElement('link').relList; if (e && e.supports && e.supports('modulepreload')) return; for (const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i); new MutationObserver((i) => { for (const r of i) if (r.type === 'childList') for (const a of r.addedNodes)a.tagName === 'LINK' && a.rel === 'modulepreload' && s(a); }).observe(document, { childList: !0, subtree: !0 }); function t(i) { const r = {}; return i.integrity && (r.integrity = i.integrity), i.referrerPolicy && (r.referrerPolicy = i.referrerPolicy), i.crossOrigin === 'use-credentials' ? r.credentials = 'include' : i.crossOrigin === 'anonymous' ? r.credentials = 'omit' : r.credentials = 'same-origin', r; } function s(i) { if (i.ep) return; i.ep = !0; const r = t(i); fetch(i.href, r); } }()); const B = '.'; const Ae = Symbol('target'); const ft = Symbol('unsubscribe'); function ke(n) { return n instanceof Date || n instanceof Set || n instanceof Map || n instanceof WeakSet || n instanceof WeakMap || ArrayBuffer.isView(n); } function Tt(n) { return (typeof n === 'object' ? n === null : typeof n !== 'function') || n instanceof RegExp; } const D = Array.isArray; function ye(n) { return typeof n === 'symbol'; } const A = {
  after(n, e) { return D(n) ? n.slice(e.length) : e === '' ? n : n.slice(e.length + 1); }, concat(n, e) { return D(n) ? (n = [...n], e && n.push(e), n) : e && e.toString !== void 0 ? (n !== '' && (n += B), ye(e) ? n + e.toString() : n + e) : n; }, initial(n) { if (D(n)) return n.slice(0, -1); if (n === '') return n; const e = n.lastIndexOf(B); return e === -1 ? '' : n.slice(0, e); }, last(n) { if (D(n)) return n.at(-1) ?? ''; if (n === '') return n; const e = n.lastIndexOf(B); return e === -1 ? n : n.slice(e + 1); }, walk(n, e) { if (D(n)) for (const t of n)e(t); else if (n !== '') { let t = 0; let s = n.indexOf(B); if (s === -1)e(n); else for (;t < n.length;)s === -1 && (s = n.length), e(n.slice(t, s)), t = s + 1, s = n.indexOf(B, t); } }, get(n, e) { return this.walk(e, (t) => { n && (n = n[t]); }), n; }, isSubPath(n, e) { if (D(n)) { if (n.length < e.length) return !1; for (let t = 0; t < e.length; t++) if (n[t] !== e[t]) return !1; return !0; } return n.length < e.length ? !1 : n === e ? !0 : n.startsWith(e) ? n[e.length] === B : !1; }, isRootPath(n) { return D(n) ? n.length === 0 : n === ''; },
}; function Lt(n) { return typeof n === 'object' && typeof n.next === 'function'; } function Rt(n, e, t, s, i) { const r = n.next; if (e.name === 'entries')n.next = function () { const a = r.call(this); return a.done === !1 && (a.value[0] = i(a.value[0], e, a.value[0], s), a.value[1] = i(a.value[1], e, a.value[0], s)), a; }; else if (e.name === 'values') { const a = t[Ae].keys(); n.next = function () { const o = r.call(this); return o.done === !1 && (o.value = i(o.value, e, a.next().value, s)), o; }; } else n.next = function () { const a = r.call(this); return a.done === !1 && (a.value = i(a.value, e, a.value, s)), a; }; return n; } function He(n, e, t) { return n.isUnsubscribed || e.ignoreSymbols && ye(t) || e.ignoreUnderscores && t.charAt(0) === '_' || 'ignoreKeys' in e && e.ignoreKeys.includes(t); } class Dt {
  constructor(e) { this._equals = e, this._proxyCache = new WeakMap(), this._pathCache = new WeakMap(), this.isUnsubscribed = !1; }

  _getDescriptorCache() { return this._descriptorCache === void 0 && (this._descriptorCache = new WeakMap()), this._descriptorCache; }

  _getProperties(e) { const t = this._getDescriptorCache(); let s = t.get(e); return s === void 0 && (s = {}, t.set(e, s)), s; }

  _getOwnPropertyDescriptor(e, t) { if (this.isUnsubscribed) return Reflect.getOwnPropertyDescriptor(e, t); const s = this._getProperties(e); let i = s[t]; return i === void 0 && (i = Reflect.getOwnPropertyDescriptor(e, t), s[t] = i), i; }

  getProxy(e, t, s, i) { if (this.isUnsubscribed) return e; const r = e[i]; const a = r ?? e; this._pathCache.set(a, t); let o = this._proxyCache.get(a); return o === void 0 && (o = r === void 0 ? new Proxy(e, s) : e, this._proxyCache.set(a, o)), o; }

  getPath(e) { return this.isUnsubscribed ? void 0 : this._pathCache.get(e); }

  isDetached(e, t) { return !Object.is(e, A.get(t, this.getPath(e))); }

  defineProperty(e, t, s) { return Reflect.defineProperty(e, t, s) ? (this.isUnsubscribed || (this._getProperties(e)[t] = s), !0) : !1; }

  setProperty(e, t, s, i, r) { if (!this._equals(r, s) || !(t in e)) { const a = this._getOwnPropertyDescriptor(e, t); return a !== void 0 && 'set' in a ? Reflect.set(e, t, s, i) : Reflect.set(e, t, s); } return !0; }

  deleteProperty(e, t, s) { if (Reflect.deleteProperty(e, t)) { if (!this.isUnsubscribed) { const i = this._getDescriptorCache().get(e); i && (delete i[t], this._pathCache.delete(s)); } return !0; } return !1; }

  isSameDescriptor(e, t, s) { const i = this._getOwnPropertyDescriptor(t, s); return e !== void 0 && i !== void 0 && Object.is(e.value, i.value) && (e.writable || !1) === (i.writable || !1) && (e.enumerable || !1) === (i.enumerable || !1) && (e.configurable || !1) === (i.configurable || !1) && e.get === i.get && e.set === i.set; }

  isGetInvariant(e, t) { const s = this._getOwnPropertyDescriptor(e, t); return s !== void 0 && s.configurable !== !0 && s.writable !== !0; }

  unsubscribe() { this._descriptorCache = null, this._pathCache = null, this._proxyCache = null, this.isUnsubscribed = !0; }
} function Fe(n) { return toString.call(n) === '[object Object]'; } function ce() { return !0; } function Q(n, e) { return n.length !== e.length || n.some((t, s) => e[s] !== t); } const ht = new Set(['hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'toLocaleString', 'toString', 'valueOf']); const Pt = new Set(['concat', 'includes', 'indexOf', 'join', 'keys', 'lastIndexOf']); const dt = {
  push: ce, pop: ce, shift: ce, unshift: ce, copyWithin: Q, reverse: Q, sort: Q, splice: Q, flat: Q, fill: Q,
}; const Nt = new Set([...ht, ...Pt, ...Object.keys(dt)]); function fe(n, e) { if (n.size !== e.size) return !0; for (const t of n) if (!e.has(t)) return !0; return !1; } const pt = ['keys', 'values', 'entries']; const gt = new Set(['has', 'toString']); const mt = {
  add: fe, clear: fe, delete: fe, forEach: fe,
}; const At = new Set([...gt, ...Object.keys(mt), ...pt]); function he(n, e) { if (n.size !== e.size) return !0; let t; for (const [s, i] of n) if (t = e.get(s), t !== i || t === void 0 && !e.has(s)) return !0; return !1; } const Mt = new Set([...gt, 'get']); const yt = {
  set: he, clear: he, delete: he, forEach: he,
}; const It = new Set([...Mt, ...Object.keys(yt), ...pt]); class W {
  constructor(e, t, s, i) { this._path = t, this._isChanged = !1, this._clonedCache = new Set(), this._hasOnValidate = i, this._changes = i ? [] : null, this.clone = t === void 0 ? e : this._shallowClone(e); }

  static isHandledMethod(e) { return ht.has(e); }

  _shallowClone(e) { let t = e; if (Fe(e))t = { ...e }; else if (D(e) || ArrayBuffer.isView(e))t = [...e]; else if (e instanceof Date)t = new Date(e); else if (e instanceof Set)t = new Set([...e].map((s) => this._shallowClone(s))); else if (e instanceof Map) { t = new Map(); for (const [s, i] of e.entries())t.set(s, this._shallowClone(i)); } return this._clonedCache.add(t), t; }

  preferredThisArg(e, t, s, i) { return e ? (D(i) ? this._onIsChanged = dt[t] : i instanceof Set ? this._onIsChanged = mt[t] : i instanceof Map && (this._onIsChanged = yt[t]), i) : s; }

  update(e, t, s) { const i = A.after(e, this._path); if (t !== 'length') { let r = this.clone; A.walk(i, (a) => { r != null && r[a] && (this._clonedCache.has(r[a]) || (r[a] = this._shallowClone(r[a])), r = r[a]); }), this._hasOnValidate && this._changes.push({ path: i, property: t, previous: s }), r != null && r[t] && (r[t] = s); } this._isChanged = !0; }

  undo(e) { let t; for (let s = this._changes.length - 1; s !== -1; s--)t = this._changes[s], A.get(e, t.path)[t.property] = t.previous; }

  isChanged(e) { return this._onIsChanged === void 0 ? this._isChanged : this._onIsChanged(this.clone, e); }

  isPathApplicable(e) { return A.isRootPath(this._path) || A.isSubPath(e, this._path); }
} class ze extends W {static isHandledMethod(e) { return Nt.has(e); }} class jt extends W {
  undo(e) { e.setTime(this.clone.getTime()); }

  isChanged(e, t) { return !t(this.clone.valueOf(), e.valueOf()); }
} class Ke extends W {
  static isHandledMethod(e) { return At.has(e); }

  undo(e) { for (const t of this.clone)e.add(t); for (const t of e) this.clone.has(t) || e.delete(t); }
} class Be extends W {
  static isHandledMethod(e) { return It.has(e); }

  undo(e) { for (const [t, s] of this.clone.entries())e.set(t, s); for (const t of e.keys()) this.clone.has(t) || e.delete(t); }
} class Vt extends W {
  constructor(e, t, s, i) { super(void 0, t, s, i), this._argument1 = s[0], this._weakValue = e.has(this._argument1); }

  isChanged(e) { return this._weakValue !== e.has(this._argument1); }

  undo(e) { this._weakValue && !e.has(this._argument1) ? e.add(this._argument1) : e.delete(this._argument1); }
} class Ut extends W {
  constructor(e, t, s, i) { super(void 0, t, s, i), this._weakKey = s[0], this._weakHas = e.has(this._weakKey), this._weakValue = e.get(this._weakKey); }

  isChanged(e) { return this._weakValue !== e.get(this._weakKey); }

  undo(e) { const t = e.has(this._weakKey); this._weakHas && !t ? e.set(this._weakKey, this._weakValue) : !this._weakHas && t ? e.delete(this._weakKey) : this._weakValue !== e.get(this._weakKey) && e.set(this._weakKey, this._weakValue); }
} class Y {
  constructor(e) { this._stack = [], this._hasOnValidate = e; }

  static isHandledType(e) { return Fe(e) || D(e) || ke(e); }

  static isHandledMethod(e, t) { return Fe(e) ? W.isHandledMethod(t) : D(e) ? ze.isHandledMethod(t) : e instanceof Set ? Ke.isHandledMethod(t) : e instanceof Map ? Be.isHandledMethod(t) : ke(e); }

  get isCloning() { return this._stack.length > 0; }

  start(e, t, s) { let i = W; D(e) ? i = ze : e instanceof Date ? i = jt : e instanceof Set ? i = Ke : e instanceof Map ? i = Be : e instanceof WeakSet ? i = Vt : e instanceof WeakMap && (i = Ut), this._stack.push(new i(e, t, s, this._hasOnValidate)); }

  update(e, t, s) { this._stack.at(-1).update(e, t, s); }

  preferredThisArg(e, t, s) { const { name: i } = e; const r = Y.isHandledMethod(s, i); return this._stack.at(-1).preferredThisArg(r, i, t, s); }

  isChanged(e, t, s) { return this._stack.at(-1).isChanged(e, t, s); }

  isPartOfClone(e) { return this._stack.at(-1).isPathApplicable(e); }

  undo(e) { this._previousClone !== void 0 && this._previousClone.undo(e); }

  stop() { return this._previousClone = this._stack.pop(), this._previousClone.clone; }
} const Ht = {
  equals: Object.is, isShallow: !1, pathAsArray: !1, ignoreSymbols: !1, ignoreUnderscores: !1, ignoreDetached: !1, details: !1,
}; const Ce = (n, e, t = {}) => {
  t = { ...Ht, ...t }; const s = Symbol('ProxyTarget'); const {
    equals: i, isShallow: r, ignoreDetached: a, details: o,
  } = t; const l = new Dt(i); const u = typeof t.onValidate === 'function'; const c = new Y(u); const f = (h, p, y, x, C) => !u || c.isCloning || t.onValidate(A.concat(l.getPath(h), p), y, x, C) === !0; const m = (h, p, y, x) => { !He(l, t, p) && !(a && l.isDetached(h, n)) && d(l.getPath(h), p, y, x); }; const d = (h, p, y, x, C) => { c.isCloning && c.isPartOfClone(h) ? c.update(h, p, x) : e(A.concat(h, p), y, x, C); }; const g = (h) => h && (h[s] ?? h); const S = (h, p, y, x) => { if (Tt(h) || y === 'constructor' || r && !Y.isHandledMethod(p, y) || He(l, t, y) || l.isGetInvariant(p, y) || a && l.isDetached(p, n)) return h; x === void 0 && (x = l.getPath(p)); const C = A.concat(x, y); const $ = l.getPath(h); return $ && v(C, $) ? l.getProxy(h, $, b, s) : l.getProxy(h, C, b, s); }; const v = (h, p) => { if (ye(h) || h.length <= p.length || D(p) && p.length === 0) return !1; const y = D(h) ? h : h.split(B); const x = D(p) ? p : p.split(B); return y.length <= x.length ? !1 : !x.some((C, $) => C !== y[$]); }; const b = {
    get(h, p, y) { if (ye(p)) { if (p === s || p === Ae) return h; if (p === ft && !l.isUnsubscribed && l.getPath(h).length === 0) return l.unsubscribe(), h; } const x = ke(h) ? Reflect.get(h, p) : Reflect.get(h, p, y); return S(x, h, p); }, set(h, p, y, x) { y = g(y); const C = h[s] ?? h; const $ = C[p]; if (i($, y) && p in h) return !0; const E = f(h, p, y, $); return E && l.setProperty(C, p, y, x, $) ? (m(h, p, h[p], $), !0) : !E; }, defineProperty(h, p, y) { if (!l.isSameDescriptor(y, h, p)) { const x = h[p]; f(h, p, y.value, x) && l.defineProperty(h, p, y, x) && m(h, p, y.value, x); } return !0; }, deleteProperty(h, p) { if (!Reflect.has(h, p)) return !0; const y = Reflect.get(h, p); const x = f(h, p, void 0, y); return x && l.deleteProperty(h, p, y) ? (m(h, p, void 0, y), !0) : !x; }, apply(h, p, y) { const x = p[s] ?? p; if (l.isUnsubscribed) return Reflect.apply(h, x, y); if ((o === !1 || o !== !0 && !o.includes(h.name)) && Y.isHandledType(x)) { let C = A.initial(l.getPath(h)); const $ = Y.isHandledMethod(x, h.name); c.start(x, C, y); let E = Reflect.apply(h, c.preferredThisArg(h, p, x), $ ? y.map((P) => g(P)) : y); const k = c.isChanged(x, i); const _ = c.stop(); if (Y.isHandledType(E) && $ && (p instanceof Map && h.name === 'get' && (C = A.concat(C, y[0])), E = l.getProxy(E, C, b)), k) { const P = { name: h.name, args: y, result: E }; const L = c.isCloning ? A.initial(C) : C; const F = c.isCloning ? A.last(C) : ''; f(A.get(n, L), F, x, _, P) ? d(L, F, x, _, P) : c.undo(x); } return (p instanceof Map || p instanceof Set) && Lt(E) ? Rt(E, h, p, C, S) : E; } return Reflect.apply(h, p, y); },
  }; const O = l.getProxy(n, t.pathAsArray ? [] : '', b); return e = e.bind(O), u && (t.onValidate = t.onValidate.bind(O)), O;
}; Ce.target = (n) => (n == null ? void 0 : n[Ae]) ?? n; Ce.unsubscribe = (n) => (n == null ? void 0 : n[ft]) ?? n; const w = (n) => typeof n === 'string'; const ne = () => { let n; let e; const t = new Promise((s, i) => { n = s, e = i; }); return t.resolve = n, t.reject = e, t; }; const qe = (n) => (n == null ? '' : `${n}`); const zt = (n, e, t) => { n.forEach((s) => { e[s] && (t[s] = e[s]); }); }; const Kt = /###/g; const We = (n) => (n && n.indexOf('###') > -1 ? n.replace(Kt, '.') : n); const Je = (n) => !n || w(n); const re = (n, e, t) => { const s = w(e) ? e.split('.') : e; let i = 0; for (;i < s.length - 1;) { if (Je(n)) return {}; const r = We(s[i]); !n[r] && t && (n[r] = new t()), Object.prototype.hasOwnProperty.call(n, r) ? n = n[r] : n = {}, ++i; } return Je(n) ? {} : { obj: n, k: We(s[i]) }; }; const Ge = (n, e, t) => { const { obj: s, k: i } = re(n, e, Object); if (s !== void 0 || e.length === 1) { s[i] = t; return; } let r = e[e.length - 1]; let a = e.slice(0, e.length - 1); let o = re(n, a, Object); for (;o.obj === void 0 && a.length;)r = `${a[a.length - 1]}.${r}`, a = a.slice(0, a.length - 1), o = re(n, a, Object), o != null && o.obj && typeof o.obj[`${o.k}.${r}`] < 'u' && (o.obj = void 0); o.obj[`${o.k}.${r}`] = t; }; const Bt = (n, e, t, s) => { const { obj: i, k: r } = re(n, e, Object); i[r] = i[r] || [], i[r].push(t); }; const be = (n, e) => { const { obj: t, k: s } = re(n, e); if (t && Object.prototype.hasOwnProperty.call(t, s)) return t[s]; }; const qt = (n, e, t) => { const s = be(n, t); return s !== void 0 ? s : be(e, t); }; const bt = (n, e, t) => { for (const s in e)s !== '__proto__' && s !== 'constructor' && (s in n ? w(n[s]) || n[s] instanceof String || w(e[s]) || e[s] instanceof String ? t && (n[s] = e[s]) : bt(n[s], e[s], t) : n[s] = e[s]); return n; }; const X = (n) => n.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&'); const Wt = {
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '/': '&#x2F;',
}; const Jt = (n) => (w(n) ? n.replace(/[&<>"'\/]/g, (e) => Wt[e]) : n); class Gt {
  constructor(e) { this.capacity = e, this.regExpMap = new Map(), this.regExpQueue = []; }

  getRegExp(e) { const t = this.regExpMap.get(e); if (t !== void 0) return t; const s = new RegExp(e); return this.regExpQueue.length === this.capacity && this.regExpMap.delete(this.regExpQueue.shift()), this.regExpMap.set(e, s), this.regExpQueue.push(e), s; }
} const Yt = [' ', ',', '?', '!', ';']; const Zt = new Gt(20); const Qt = (n, e, t) => { e = e || '', t = t || ''; const s = Yt.filter((a) => e.indexOf(a) < 0 && t.indexOf(a) < 0); if (s.length === 0) return !0; const i = Zt.getRegExp(`(${s.map((a) => (a === '?' ? '\\?' : a)).join('|')})`); let r = !i.test(n); if (!r) { const a = n.indexOf(t); a > 0 && !i.test(n.substring(0, a)) && (r = !0); } return r; }; const Te = (n, e, t = '.') => { if (!n) return; if (n[e]) return Object.prototype.hasOwnProperty.call(n, e) ? n[e] : void 0; const s = e.split(t); let i = n; for (let r = 0; r < s.length;) { if (!i || typeof i !== 'object') return; let a; let o = ''; for (let l = r; l < s.length; ++l) if (l !== r && (o += t), o += s[l], a = i[o], a !== void 0) { if (['string', 'number', 'boolean'].indexOf(typeof a) > -1 && l < s.length - 1) continue; r += l - r + 1; break; }i = a; } return i; }; const ae = (n) => (n == null ? void 0 : n.replace('_', '-')); const Xt = {
  type: 'logger', log(n) { this.output('log', n); }, warn(n) { this.output('warn', n); }, error(n) { this.output('error', n); }, output(n, e) { let t; let s; (s = (t = console == null ? void 0 : console[n]) == null ? void 0 : t.apply) == null || s.call(t, console, e); },
}; class xe {
  constructor(e, t = {}) { this.init(e, t); }

  init(e, t = {}) { this.prefix = t.prefix || 'i18next:', this.logger = e || Xt, this.options = t, this.debug = t.debug; }

  log(...e) { return this.forward(e, 'log', '', !0); }

  warn(...e) { return this.forward(e, 'warn', '', !0); }

  error(...e) { return this.forward(e, 'error', ''); }

  deprecate(...e) { return this.forward(e, 'warn', 'WARNING DEPRECATED: ', !0); }

  forward(e, t, s, i) { return i && !this.debug ? null : (w(e[0]) && (e[0] = `${s}${this.prefix} ${e[0]}`), this.logger[t](e)); }

  create(e) { return new xe(this.logger, { prefix: `${this.prefix}:${e}:`, ...this.options }); }

  clone(e) { return e = e || this.options, e.prefix = e.prefix || this.prefix, new xe(this.logger, e); }
} const H = new xe(); class Ee {
  constructor() { this.observers = {}; }

  on(e, t) { return e.split(' ').forEach((s) => { this.observers[s] || (this.observers[s] = new Map()); const i = this.observers[s].get(t) || 0; this.observers[s].set(t, i + 1); }), this; }

  off(e, t) { if (this.observers[e]) { if (!t) { delete this.observers[e]; return; } this.observers[e].delete(t); } }

  emit(e, ...t) { this.observers[e] && Array.from(this.observers[e].entries()).forEach(([i, r]) => { for (let a = 0; a < r; a++)i(...t); }), this.observers['*'] && Array.from(this.observers['*'].entries()).forEach(([i, r]) => { for (let a = 0; a < r; a++)i.apply(i, [e, ...t]); }); }
} class Ye extends Ee {
  constructor(e, t = { ns: ['translation'], defaultNS: 'translation' }) { super(), this.data = e || {}, this.options = t, this.options.keySeparator === void 0 && (this.options.keySeparator = '.'), this.options.ignoreJSONStructure === void 0 && (this.options.ignoreJSONStructure = !0); }

  addNamespaces(e) { this.options.ns.indexOf(e) < 0 && this.options.ns.push(e); }

  removeNamespaces(e) { const t = this.options.ns.indexOf(e); t > -1 && this.options.ns.splice(t, 1); }

  getResource(e, t, s, i = {}) { let u; let c; const r = i.keySeparator !== void 0 ? i.keySeparator : this.options.keySeparator; const a = i.ignoreJSONStructure !== void 0 ? i.ignoreJSONStructure : this.options.ignoreJSONStructure; let o; e.indexOf('.') > -1 ? o = e.split('.') : (o = [e, t], s && (Array.isArray(s) ? o.push(...s) : w(s) && r ? o.push(...s.split(r)) : o.push(s))); const l = be(this.data, o); return !l && !t && !s && e.indexOf('.') > -1 && (e = o[0], t = o[1], s = o.slice(2).join('.')), l || !a || !w(s) ? l : Te((c = (u = this.data) == null ? void 0 : u[e]) == null ? void 0 : c[t], s, r); }

  addResource(e, t, s, i, r = { silent: !1 }) { const a = r.keySeparator !== void 0 ? r.keySeparator : this.options.keySeparator; let o = [e, t]; s && (o = o.concat(a ? s.split(a) : s)), e.indexOf('.') > -1 && (o = e.split('.'), i = t, t = o[1]), this.addNamespaces(t), Ge(this.data, o, i), r.silent || this.emit('added', e, t, s, i); }

  addResources(e, t, s, i = { silent: !1 }) { for (const r in s)(w(s[r]) || Array.isArray(s[r])) && this.addResource(e, t, r, s[r], { silent: !0 }); i.silent || this.emit('added', e, t, s); }

  addResourceBundle(e, t, s, i, r, a = { silent: !1, skipCopy: !1 }) { let o = [e, t]; e.indexOf('.') > -1 && (o = e.split('.'), i = s, s = t, t = o[1]), this.addNamespaces(t); let l = be(this.data, o) || {}; a.skipCopy || (s = JSON.parse(JSON.stringify(s))), i ? bt(l, s, r) : l = { ...l, ...s }, Ge(this.data, o, l), a.silent || this.emit('added', e, t, s); }

  removeResourceBundle(e, t) { this.hasResourceBundle(e, t) && delete this.data[e][t], this.removeNamespaces(t), this.emit('removed', e, t); }

  hasResourceBundle(e, t) { return this.getResource(e, t) !== void 0; }

  getResourceBundle(e, t) { return t || (t = this.options.defaultNS), this.getResource(e, t); }

  getDataByLanguage(e) { return this.data[e]; }

  hasLanguageSomeTranslations(e) { const t = this.getDataByLanguage(e); return !!(t && Object.keys(t) || []).find((i) => t[i] && Object.keys(t[i]).length > 0); }

  toJSON() { return this.data; }
} const xt = { processors: {}, addPostProcessor(n) { this.processors[n.name] = n; }, handle(n, e, t, s, i) { return n.forEach((r) => { let a; e = ((a = this.processors[r]) == null ? void 0 : a.process(e, t, s, i)) ?? e; }), e; } }; const Ze = {}; const Qe = (n) => !w(n) && typeof n !== 'boolean' && typeof n !== 'number'; class Se extends Ee {
  constructor(e, t = {}) { super(), zt(['resourceStore', 'languageUtils', 'pluralResolver', 'interpolator', 'backendConnector', 'i18nFormat', 'utils'], e, this), this.options = t, this.options.keySeparator === void 0 && (this.options.keySeparator = '.'), this.logger = H.create('translator'); }

  changeLanguage(e) { e && (this.language = e); }

  exists(e, t = { interpolation: {} }) { const s = { ...t }; if (e == null) return !1; const i = this.resolve(e, s); return (i == null ? void 0 : i.res) !== void 0; }

  extractFromKey(e, t) { let s = t.nsSeparator !== void 0 ? t.nsSeparator : this.options.nsSeparator; s === void 0 && (s = ':'); const i = t.keySeparator !== void 0 ? t.keySeparator : this.options.keySeparator; let r = t.ns || this.options.defaultNS || []; const a = s && e.indexOf(s) > -1; const o = !this.options.userDefinedKeySeparator && !t.keySeparator && !this.options.userDefinedNsSeparator && !t.nsSeparator && !Qt(e, s, i); if (a && !o) { const l = e.match(this.interpolator.nestingRegexp); if (l && l.length > 0) return { key: e, namespaces: w(r) ? [r] : r }; const u = e.split(s); (s !== i || s === i && this.options.ns.indexOf(u[0]) > -1) && (r = u.shift()), e = u.join(i); } return { key: e, namespaces: w(r) ? [r] : r }; }

  translate(e, t, s) {
    let i = typeof t === 'object' ? { ...t } : t; if (typeof i !== 'object' && this.options.overloadTranslationOptionHandler && (i = this.options.overloadTranslationOptionHandler(arguments)), typeof options === 'object' && (i = { ...i }), i || (i = {}), e == null) return ''; Array.isArray(e) || (e = [String(e)]); const r = i.returnDetails !== void 0 ? i.returnDetails : this.options.returnDetails; const a = i.keySeparator !== void 0 ? i.keySeparator : this.options.keySeparator; const { key: o, namespaces: l } = this.extractFromKey(e[e.length - 1], i); const u = l[l.length - 1]; let c = i.nsSeparator !== void 0 ? i.nsSeparator : this.options.nsSeparator; c === void 0 && (c = ':'); const f = i.lng || this.language; const m = i.appendNamespaceToCIMode || this.options.appendNamespaceToCIMode; if ((f == null ? void 0 : f.toLowerCase()) === 'cimode') {
      return m ? r ? {
        res: `${u}${c}${o}`, usedKey: o, exactUsedKey: o, usedLng: f, usedNS: u, usedParams: this.getUsedParamsDetails(i),
      } : `${u}${c}${o}` : r ? {
        res: o, usedKey: o, exactUsedKey: o, usedLng: f, usedNS: u, usedParams: this.getUsedParamsDetails(i),
      } : o;
    } const d = this.resolve(e, i); let g = d == null ? void 0 : d.res; const S = (d == null ? void 0 : d.usedKey) || o; const v = (d == null ? void 0 : d.exactUsedKey) || o; const b = ['[object Number]', '[object Function]', '[object RegExp]']; const O = i.joinArrays !== void 0 ? i.joinArrays : this.options.joinArrays; const h = !this.i18nFormat || this.i18nFormat.handleAsObject; const p = i.count !== void 0 && !w(i.count); const y = Se.hasDefaultValue(i); const x = p ? this.pluralResolver.getSuffix(f, i.count, i) : ''; const C = i.ordinal && p ? this.pluralResolver.getSuffix(f, i.count, { ordinal: !1 }) : ''; const $ = p && !i.ordinal && i.count === 0; const E = $ && i[`defaultValue${this.options.pluralSeparator}zero`] || i[`defaultValue${x}`] || i[`defaultValue${C}`] || i.defaultValue; let k = g; h && !g && y && (k = E); const _ = Qe(k); const P = Object.prototype.toString.apply(k); if (h && k && _ && b.indexOf(P) < 0 && !(w(O) && Array.isArray(k))) {
      if (!i.returnObjects && !this.options.returnObjects) { this.options.returnedObjectHandler || this.logger.warn('accessing an object - but returnObjects options is not enabled!'); const L = this.options.returnedObjectHandler ? this.options.returnedObjectHandler(S, k, { ...i, ns: l }) : `key '${o} (${this.language})' returned an object instead of string.`; return r ? (d.res = L, d.usedParams = this.getUsedParamsDetails(i), d) : L; } if (a) {
        const L = Array.isArray(k); const F = L ? [] : {}; const Ie = L ? v : S; for (const V in k) {
          if (Object.prototype.hasOwnProperty.call(k, V)) {
            const z = `${Ie}${a}${V}`; y && !g ? F[V] = this.translate(z, {
              ...i, defaultValue: Qe(E) ? E[V] : void 0, joinArrays: !1, ns: l,
            }) : F[V] = this.translate(z, { ...i, joinArrays: !1, ns: l }), F[V] === z && (F[V] = k[V]);
          }
        }g = F;
      }
    } else if (h && w(O) && Array.isArray(g))g = g.join(O), g && (g = this.extendTranslation(g, e, i, s)); else { let L = !1; let F = !1; !this.isValidLookup(g) && y && (L = !0, g = E), this.isValidLookup(g) || (F = !0, g = o); const V = (i.missingKeyNoValueFallbackToKey || this.options.missingKeyNoValueFallbackToKey) && F ? void 0 : g; const z = y && E !== g && this.options.updateMissing; if (F || L || z) { if (this.logger.log(z ? 'updateKey' : 'missingKey', f, u, o, z ? E : g), a) { const I = this.resolve(o, { ...i, keySeparator: !1 }); I && I.res && this.logger.warn('Seems the loaded translations were in flat JSON format instead of nested. Either set keySeparator: false on init or make sure your translations are published in nested format.'); } let se = []; const ue = this.languageUtils.getFallbackCodes(this.options.fallbackLng, i.lng || this.language); if (this.options.saveMissingTo === 'fallback' && ue && ue[0]) for (let I = 0; I < ue.length; I++)se.push(ue[I]); else this.options.saveMissingTo === 'all' ? se = this.languageUtils.toResolveHierarchy(i.lng || this.language) : se.push(i.lng || this.language); const je = (I, G, ie) => { let Ue; const Ve = y && ie !== g ? ie : V; this.options.missingKeyHandler ? this.options.missingKeyHandler(I, u, G, Ve, z, i) : (Ue = this.backendConnector) != null && Ue.saveMissing && this.backendConnector.saveMissing(I, u, G, Ve, z, i), this.emit('missingKey', I, u, G, g); }; this.options.saveMissing && (this.options.saveMissingPlurals && p ? se.forEach((I) => { const G = this.pluralResolver.getSuffixes(I, i); $ && i[`defaultValue${this.options.pluralSeparator}zero`] && G.indexOf(`${this.options.pluralSeparator}zero`) < 0 && G.push(`${this.options.pluralSeparator}zero`), G.forEach((ie) => { je([I], o + ie, i[`defaultValue${ie}`] || E); }); }) : je(se, o, E)); }g = this.extendTranslation(g, e, i, d, s), F && g === o && this.options.appendNamespaceToMissingKey && (g = `${u}${c}${o}`), (F || L) && this.options.parseMissingKeyHandler && (g = this.options.parseMissingKeyHandler(this.options.appendNamespaceToMissingKey ? `${u}${c}${o}` : o, L ? g : void 0, i)); } return r ? (d.res = g, d.usedParams = this.getUsedParamsDetails(i), d) : g;
  }

  extendTranslation(e, t, s, i, r) { let l; let u; if ((l = this.i18nFormat) != null && l.parse)e = this.i18nFormat.parse(e, { ...this.options.interpolation.defaultVariables, ...s }, s.lng || this.language || i.usedLng, i.usedNS, i.usedKey, { resolved: i }); else if (!s.skipInterpolation) { s.interpolation && this.interpolator.init({ ...s, interpolation: { ...this.options.interpolation, ...s.interpolation } }); const c = w(e) && (((u = s == null ? void 0 : s.interpolation) == null ? void 0 : u.skipOnVariables) !== void 0 ? s.interpolation.skipOnVariables : this.options.interpolation.skipOnVariables); let f; if (c) { const d = e.match(this.interpolator.nestingRegexp); f = d && d.length; } let m = s.replace && !w(s.replace) ? s.replace : s; if (this.options.interpolation.defaultVariables && (m = { ...this.options.interpolation.defaultVariables, ...m }), e = this.interpolator.interpolate(e, m, s.lng || this.language || i.usedLng, s), c) { const d = e.match(this.interpolator.nestingRegexp); const g = d && d.length; f < g && (s.nest = !1); }!s.lng && i && i.res && (s.lng = this.language || i.usedLng), s.nest !== !1 && (e = this.interpolator.nest(e, (...d) => ((r == null ? void 0 : r[0]) === d[0] && !s.context ? (this.logger.warn(`It seems you are nesting recursively key: ${d[0]} in key: ${t[0]}`), null) : this.translate(...d, t)), s)), s.interpolation && this.interpolator.reset(); } const a = s.postProcess || this.options.postProcess; const o = w(a) ? [a] : a; return e != null && (o != null && o.length) && s.applyPostProcessor !== !1 && (e = xt.handle(o, e, t, this.options && this.options.postProcessPassResolved ? { i18nResolved: { ...i, usedParams: this.getUsedParamsDetails(s) }, ...s } : s, this)), e; }

  resolve(e, t = {}) {
    let s; let i; let r; let a; let o; return w(e) && (e = [e]), e.forEach((l) => { if (this.isValidLookup(s)) return; const u = this.extractFromKey(l, t); const c = u.key; i = c; let f = u.namespaces; this.options.fallbackNS && (f = f.concat(this.options.fallbackNS)); const m = t.count !== void 0 && !w(t.count); const d = m && !t.ordinal && t.count === 0; const g = t.context !== void 0 && (w(t.context) || typeof t.context === 'number') && t.context !== ''; const S = t.lngs ? t.lngs : this.languageUtils.toResolveHierarchy(t.lng || this.language, t.fallbackLng); f.forEach((v) => { let b; let O; this.isValidLookup(s) || (o = v, !Ze[`${S[0]}-${v}`] && ((b = this.utils) != null && b.hasLoadedNamespace) && !((O = this.utils) != null && O.hasLoadedNamespace(o)) && (Ze[`${S[0]}-${v}`] = !0, this.logger.warn(`key "${i}" for languages "${S.join(', ')}" won't get resolved as namespace "${o}" was not yet loaded`, 'This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!')), S.forEach((h) => { let x; if (this.isValidLookup(s)) return; a = h; const p = [c]; if ((x = this.i18nFormat) != null && x.addLookupKeys) this.i18nFormat.addLookupKeys(p, c, h, v, t); else { let C; m && (C = this.pluralResolver.getSuffix(h, t.count, t)); const $ = `${this.options.pluralSeparator}zero`; const E = `${this.options.pluralSeparator}ordinal${this.options.pluralSeparator}`; if (m && (p.push(c + C), t.ordinal && C.indexOf(E) === 0 && p.push(c + C.replace(E, this.options.pluralSeparator)), d && p.push(c + $)), g) { const k = `${c}${this.options.contextSeparator}${t.context}`; p.push(k), m && (p.push(k + C), t.ordinal && C.indexOf(E) === 0 && p.push(k + C.replace(E, this.options.pluralSeparator)), d && p.push(k + $)); } } let y; for (;y = p.pop();) this.isValidLookup(s) || (r = y, s = this.getResource(h, v, y, t)); })); }); }), {
      res: s, usedKey: i, exactUsedKey: r, usedLng: a, usedNS: o,
    };
  }

  isValidLookup(e) { return e !== void 0 && !(!this.options.returnNull && e === null) && !(!this.options.returnEmptyString && e === ''); }

  getResource(e, t, s, i = {}) { let r; return (r = this.i18nFormat) != null && r.getResource ? this.i18nFormat.getResource(e, t, s, i) : this.resourceStore.getResource(e, t, s, i); }

  getUsedParamsDetails(e = {}) { const t = ['defaultValue', 'ordinal', 'context', 'replace', 'lng', 'lngs', 'fallbackLng', 'ns', 'keySeparator', 'nsSeparator', 'returnObjects', 'returnDetails', 'joinArrays', 'postProcess', 'interpolation']; const s = e.replace && !w(e.replace); let i = s ? e.replace : e; if (s && typeof e.count < 'u' && (i.count = e.count), this.options.interpolation.defaultVariables && (i = { ...this.options.interpolation.defaultVariables, ...i }), !s) { i = { ...i }; for (const r of t) delete i[r]; } return i; }

  static hasDefaultValue(e) { const t = 'defaultValue'; for (const s in e) if (Object.prototype.hasOwnProperty.call(e, s) && t === s.substring(0, t.length) && e[s] !== void 0) return !0; return !1; }
} class Xe {
  constructor(e) { this.options = e, this.supportedLngs = this.options.supportedLngs || !1, this.logger = H.create('languageUtils'); }

  getScriptPartFromCode(e) { if (e = ae(e), !e || e.indexOf('-') < 0) return null; const t = e.split('-'); return t.length === 2 || (t.pop(), t[t.length - 1].toLowerCase() === 'x') ? null : this.formatLanguageCode(t.join('-')); }

  getLanguagePartFromCode(e) { if (e = ae(e), !e || e.indexOf('-') < 0) return e; const t = e.split('-'); return this.formatLanguageCode(t[0]); }

  formatLanguageCode(e) { if (w(e) && e.indexOf('-') > -1) { let t; try { t = Intl.getCanonicalLocales(e)[0]; } catch {} return t && this.options.lowerCaseLng && (t = t.toLowerCase()), t || (this.options.lowerCaseLng ? e.toLowerCase() : e); } return this.options.cleanCode || this.options.lowerCaseLng ? e.toLowerCase() : e; }

  isSupportedCode(e) { return (this.options.load === 'languageOnly' || this.options.nonExplicitSupportedLngs) && (e = this.getLanguagePartFromCode(e)), !this.supportedLngs || !this.supportedLngs.length || this.supportedLngs.indexOf(e) > -1; }

  getBestMatchFromCodes(e) { if (!e) return null; let t; return e.forEach((s) => { if (t) return; const i = this.formatLanguageCode(s); (!this.options.supportedLngs || this.isSupportedCode(i)) && (t = i); }), !t && this.options.supportedLngs && e.forEach((s) => { if (t) return; const i = this.getScriptPartFromCode(s); if (this.isSupportedCode(i)) return t = i; const r = this.getLanguagePartFromCode(s); if (this.isSupportedCode(r)) return t = r; t = this.options.supportedLngs.find((a) => { if (a === r) return a; if (!(a.indexOf('-') < 0 && r.indexOf('-') < 0) && (a.indexOf('-') > 0 && r.indexOf('-') < 0 && a.substring(0, a.indexOf('-')) === r || a.indexOf(r) === 0 && r.length > 1)) return a; }); }), t || (t = this.getFallbackCodes(this.options.fallbackLng)[0]), t; }

  getFallbackCodes(e, t) { if (!e) return []; if (typeof e === 'function' && (e = e(t)), w(e) && (e = [e]), Array.isArray(e)) return e; if (!t) return e.default || []; let s = e[t]; return s || (s = e[this.getScriptPartFromCode(t)]), s || (s = e[this.formatLanguageCode(t)]), s || (s = e[this.getLanguagePartFromCode(t)]), s || (s = e.default), s || []; }

  toResolveHierarchy(e, t) { const s = this.getFallbackCodes((t === !1 ? [] : t) || this.options.fallbackLng || [], e); const i = []; const r = (a) => { a && (this.isSupportedCode(a) ? i.push(a) : this.logger.warn(`rejecting language code not found in supportedLngs: ${a}`)); }; return w(e) && (e.indexOf('-') > -1 || e.indexOf('_') > -1) ? (this.options.load !== 'languageOnly' && r(this.formatLanguageCode(e)), this.options.load !== 'languageOnly' && this.options.load !== 'currentOnly' && r(this.getScriptPartFromCode(e)), this.options.load !== 'currentOnly' && r(this.getLanguagePartFromCode(e))) : w(e) && r(this.formatLanguageCode(e)), s.forEach((a) => { i.indexOf(a) < 0 && r(this.formatLanguageCode(a)); }), i; }
} const et = {
  zero: 0, one: 1, two: 2, few: 3, many: 4, other: 5,
}; const tt = { select: (n) => (n === 1 ? 'one' : 'other'), resolvedOptions: () => ({ pluralCategories: ['one', 'other'] }) }; class es {
  constructor(e, t = {}) { this.languageUtils = e, this.options = t, this.logger = H.create('pluralResolver'), this.pluralRulesCache = {}; }

  addRule(e, t) { this.rules[e] = t; }

  clearCache() { this.pluralRulesCache = {}; }

  getRule(e, t = {}) { const s = ae(e === 'dev' ? 'en' : e); const i = t.ordinal ? 'ordinal' : 'cardinal'; const r = JSON.stringify({ cleanedCode: s, type: i }); if (r in this.pluralRulesCache) return this.pluralRulesCache[r]; let a; try { a = new Intl.PluralRules(s, { type: i }); } catch { if (!Intl) return this.logger.error('No Intl support, please use an Intl polyfill!'), tt; if (!e.match(/-|_/)) return tt; const l = this.languageUtils.getLanguagePartFromCode(e); a = this.getRule(l, t); } return this.pluralRulesCache[r] = a, a; }

  needsPlural(e, t = {}) { let s = this.getRule(e, t); return s || (s = this.getRule('dev', t)), (s == null ? void 0 : s.resolvedOptions().pluralCategories.length) > 1; }

  getPluralFormsOfKey(e, t, s = {}) { return this.getSuffixes(e, s).map((i) => `${t}${i}`); }

  getSuffixes(e, t = {}) { let s = this.getRule(e, t); return s || (s = this.getRule('dev', t)), s ? s.resolvedOptions().pluralCategories.sort((i, r) => et[i] - et[r]).map((i) => `${this.options.prepend}${t.ordinal ? `ordinal${this.options.prepend}` : ''}${i}`) : []; }

  getSuffix(e, t, s = {}) { const i = this.getRule(e, s); return i ? `${this.options.prepend}${s.ordinal ? `ordinal${this.options.prepend}` : ''}${i.select(t)}` : (this.logger.warn(`no plural rule found for: ${e}`), this.getSuffix('dev', t, s)); }
} const st = (n, e, t, s = '.', i = !0) => { let r = qt(n, e, t); return !r && i && w(t) && (r = Te(n, t, s), r === void 0 && (r = Te(e, t, s))), r; }; const ve = (n) => n.replace(/\$/g, '$$$$'); class ts {
  constructor(e = {}) { let t; this.logger = H.create('interpolator'), this.options = e, this.format = ((t = e == null ? void 0 : e.interpolation) == null ? void 0 : t.format) || ((s) => s), this.init(e); }

  init(e = {}) {
    e.interpolation || (e.interpolation = { escapeValue: !0 }); const {
      escape: t, escapeValue: s, useRawValueToEscape: i, prefix: r, prefixEscaped: a, suffix: o, suffixEscaped: l, formatSeparator: u, unescapeSuffix: c, unescapePrefix: f, nestingPrefix: m, nestingPrefixEscaped: d, nestingSuffix: g, nestingSuffixEscaped: S, nestingOptionsSeparator: v, maxReplaces: b, alwaysFormat: O,
    } = e.interpolation; this.escape = t !== void 0 ? t : Jt, this.escapeValue = s !== void 0 ? s : !0, this.useRawValueToEscape = i !== void 0 ? i : !1, this.prefix = r ? X(r) : a || '{{', this.suffix = o ? X(o) : l || '}}', this.formatSeparator = u || ',', this.unescapePrefix = c ? '' : f || '-', this.unescapeSuffix = this.unescapePrefix ? '' : c || '', this.nestingPrefix = m ? X(m) : d || X('$t('), this.nestingSuffix = g ? X(g) : S || X(')'), this.nestingOptionsSeparator = v || ',', this.maxReplaces = b || 1e3, this.alwaysFormat = O !== void 0 ? O : !1, this.resetRegExp();
  }

  reset() { this.options && this.init(this.options); }

  resetRegExp() { const e = (t, s) => ((t == null ? void 0 : t.source) === s ? (t.lastIndex = 0, t) : new RegExp(s, 'g')); this.regexp = e(this.regexp, `${this.prefix}(.+?)${this.suffix}`), this.regexpUnescape = e(this.regexpUnescape, `${this.prefix}${this.unescapePrefix}(.+?)${this.unescapeSuffix}${this.suffix}`), this.nestingRegexp = e(this.nestingRegexp, `${this.nestingPrefix}(.+?)${this.nestingSuffix}`); }

  interpolate(e, t, s, i) { let d; let r; let a; let o; const l = this.options && this.options.interpolation && this.options.interpolation.defaultVariables || {}; const u = (g) => { if (g.indexOf(this.formatSeparator) < 0) { const O = st(t, l, g, this.options.keySeparator, this.options.ignoreJSONStructure); return this.alwaysFormat ? this.format(O, void 0, s, { ...i, ...t, interpolationkey: g }) : O; } const S = g.split(this.formatSeparator); const v = S.shift().trim(); const b = S.join(this.formatSeparator).trim(); return this.format(st(t, l, v, this.options.keySeparator, this.options.ignoreJSONStructure), b, s, { ...i, ...t, interpolationkey: v }); }; this.resetRegExp(); const c = (i == null ? void 0 : i.missingInterpolationHandler) || this.options.missingInterpolationHandler; const f = ((d = i == null ? void 0 : i.interpolation) == null ? void 0 : d.skipOnVariables) !== void 0 ? i.interpolation.skipOnVariables : this.options.interpolation.skipOnVariables; return [{ regex: this.regexpUnescape, safeValue: (g) => ve(g) }, { regex: this.regexp, safeValue: (g) => (this.escapeValue ? ve(this.escape(g)) : ve(g)) }].forEach((g) => { for (o = 0; r = g.regex.exec(e);) { const S = r[1].trim(); if (a = u(S), a === void 0) if (typeof c === 'function') { const b = c(e, r, i); a = w(b) ? b : ''; } else if (i && Object.prototype.hasOwnProperty.call(i, S))a = ''; else if (f) { a = r[0]; continue; } else this.logger.warn(`missed to pass in variable ${S} for interpolating ${e}`), a = ''; else !w(a) && !this.useRawValueToEscape && (a = qe(a)); const v = g.safeValue(a); if (e = e.replace(r[0], v), f ? (g.regex.lastIndex += a.length, g.regex.lastIndex -= r[0].length) : g.regex.lastIndex = 0, o++, o >= this.maxReplaces) break; } }), e; }

  nest(e, t, s = {}) { let i; let r; let a; const o = (l, u) => { const c = this.nestingOptionsSeparator; if (l.indexOf(c) < 0) return l; const f = l.split(new RegExp(`${c}[ ]*{`)); let m = `{${f[1]}`; l = f[0], m = this.interpolate(m, a); const d = m.match(/'/g); const g = m.match(/"/g); (((d == null ? void 0 : d.length) ?? 0) % 2 === 0 && !g || g.length % 2 !== 0) && (m = m.replace(/'/g, '"')); try { a = JSON.parse(m), u && (a = { ...u, ...a }); } catch (S) { return this.logger.warn(`failed parsing options string in nesting for key ${l}`, S), `${l}${c}${m}`; } return a.defaultValue && a.defaultValue.indexOf(this.prefix) > -1 && delete a.defaultValue, l; }; for (;i = this.nestingRegexp.exec(e);) { let l = []; a = { ...s }, a = a.replace && !w(a.replace) ? a.replace : a, a.applyPostProcessor = !1, delete a.defaultValue; let u = !1; if (i[0].indexOf(this.formatSeparator) !== -1 && !/{.*}/.test(i[1])) { const c = i[1].split(this.formatSeparator).map((f) => f.trim()); i[1] = c.shift(), l = c, u = !0; } if (r = t(o.call(this, i[1].trim(), a), a), r && i[0] === e && !w(r)) return r; w(r) || (r = qe(r)), r || (this.logger.warn(`missed to resolve ${i[1]} for nesting ${e}`), r = ''), u && (r = l.reduce((c, f) => this.format(c, f, s.lng, { ...s, interpolationkey: i[1].trim() }), r.trim())), e = e.replace(i[0], r), this.regexp.lastIndex = 0; } return e; }
} const ss = (n) => { let e = n.toLowerCase().trim(); const t = {}; if (n.indexOf('(') > -1) { const s = n.split('('); e = s[0].toLowerCase().trim(); const i = s[1].substring(0, s[1].length - 1); e === 'currency' && i.indexOf(':') < 0 ? t.currency || (t.currency = i.trim()) : e === 'relativetime' && i.indexOf(':') < 0 ? t.range || (t.range = i.trim()) : i.split(';').forEach((a) => { if (a) { const [o, ...l] = a.split(':'); const u = l.join(':').trim().replace(/^'+|'+$/g, ''); const c = o.trim(); t[c] || (t[c] = u), u === 'false' && (t[c] = !1), u === 'true' && (t[c] = !0), isNaN(u) || (t[c] = parseInt(u, 10)); } }); } return { formatName: e, formatOptions: t }; }; const it = (n) => { const e = {}; return (t, s, i) => { let r = i; i && i.interpolationkey && i.formatParams && i.formatParams[i.interpolationkey] && i[i.interpolationkey] && (r = { ...r, [i.interpolationkey]: void 0 }); const a = s + JSON.stringify(r); let o = e[a]; return o || (o = n(ae(s), i), e[a] = o), o(t); }; }; const is = (n) => (e, t, s) => n(ae(t), s)(e); class ns {
  constructor(e = {}) { this.logger = H.create('formatter'), this.options = e, this.init(e); }

  init(e, t = { interpolation: {} }) {
    this.formatSeparator = t.interpolation.formatSeparator || ','; const s = t.cacheInBuiltFormats ? it : is; this.formats = {
      number: s((i, r) => { const a = new Intl.NumberFormat(i, { ...r }); return (o) => a.format(o); }), currency: s((i, r) => { const a = new Intl.NumberFormat(i, { ...r, style: 'currency' }); return (o) => a.format(o); }), datetime: s((i, r) => { const a = new Intl.DateTimeFormat(i, { ...r }); return (o) => a.format(o); }), relativetime: s((i, r) => { const a = new Intl.RelativeTimeFormat(i, { ...r }); return (o) => a.format(o, r.range || 'day'); }), list: s((i, r) => { const a = new Intl.ListFormat(i, { ...r }); return (o) => a.format(o); }),
    };
  }

  add(e, t) { this.formats[e.toLowerCase().trim()] = t; }

  addCached(e, t) { this.formats[e.toLowerCase().trim()] = it(t); }

  format(e, t, s, i = {}) { const r = t.split(this.formatSeparator); if (r.length > 1 && r[0].indexOf('(') > 1 && r[0].indexOf(')') < 0 && r.find((o) => o.indexOf(')') > -1)) { const o = r.findIndex((l) => l.indexOf(')') > -1); r[0] = [r[0], ...r.splice(1, o)].join(this.formatSeparator); } return r.reduce((o, l) => { let f; const { formatName: u, formatOptions: c } = ss(l); if (this.formats[u]) { let m = o; try { const d = ((f = i == null ? void 0 : i.formatParams) == null ? void 0 : f[i.interpolationkey]) || {}; const g = d.locale || d.lng || i.locale || i.lng || s; m = this.formats[u](o, g, { ...c, ...i, ...d }); } catch (d) { this.logger.warn(d); } return m; } else this.logger.warn(`there was no format function for ${u}`); return o; }, e); }
} const rs = (n, e) => { n.pending[e] !== void 0 && (delete n.pending[e], n.pendingCount--); }; class as extends Ee {
  constructor(e, t, s, i = {}) { let r; let a; super(), this.backend = e, this.store = t, this.services = s, this.languageUtils = s.languageUtils, this.options = i, this.logger = H.create('backendConnector'), this.waitingReads = [], this.maxParallelReads = i.maxParallelReads || 10, this.readingCalls = 0, this.maxRetries = i.maxRetries >= 0 ? i.maxRetries : 5, this.retryTimeout = i.retryTimeout >= 1 ? i.retryTimeout : 350, this.state = {}, this.queue = [], (a = (r = this.backend) == null ? void 0 : r.init) == null || a.call(r, s, i.backend, i); }

  queueLoad(e, t, s, i) {
    const r = {}; const a = {}; const o = {}; const l = {}; return e.forEach((u) => { let c = !0; t.forEach((f) => { const m = `${u}|${f}`; !s.reload && this.store.hasResourceBundle(u, f) ? this.state[m] = 2 : this.state[m] < 0 || (this.state[m] === 1 ? a[m] === void 0 && (a[m] = !0) : (this.state[m] = 1, c = !1, a[m] === void 0 && (a[m] = !0), r[m] === void 0 && (r[m] = !0), l[f] === void 0 && (l[f] = !0))); }), c || (o[u] = !0); }), (Object.keys(r).length || Object.keys(a).length) && this.queue.push({
      pending: a, pendingCount: Object.keys(a).length, loaded: {}, errors: [], callback: i,
    }), {
      toLoad: Object.keys(r), pending: Object.keys(a), toLoadLanguages: Object.keys(o), toLoadNamespaces: Object.keys(l),
    };
  }

  loaded(e, t, s) { const i = e.split('|'); const r = i[0]; const a = i[1]; t && this.emit('failedLoading', r, a, t), !t && s && this.store.addResourceBundle(r, a, s, void 0, void 0, { skipCopy: !0 }), this.state[e] = t ? -1 : 2, t && s && (this.state[e] = 0); const o = {}; this.queue.forEach((l) => { Bt(l.loaded, [r], a), rs(l, e), t && l.errors.push(t), l.pendingCount === 0 && !l.done && (Object.keys(l.loaded).forEach((u) => { o[u] || (o[u] = {}); const c = l.loaded[u]; c.length && c.forEach((f) => { o[u][f] === void 0 && (o[u][f] = !0); }); }), l.done = !0, l.errors.length ? l.callback(l.errors) : l.callback()); }), this.emit('loaded', o), this.queue = this.queue.filter((l) => !l.done); }

  read(e, t, s, i = 0, r = this.retryTimeout, a) {
    if (!e.length) return a(null, {}); if (this.readingCalls >= this.maxParallelReads) {
      this.waitingReads.push({
        lng: e, ns: t, fcName: s, tried: i, wait: r, callback: a,
      }); return;
    } this.readingCalls++; const o = (u, c) => { if (this.readingCalls--, this.waitingReads.length > 0) { const f = this.waitingReads.shift(); this.read(f.lng, f.ns, f.fcName, f.tried, f.wait, f.callback); } if (u && c && i < this.maxRetries) { setTimeout(() => { this.read.call(this, e, t, s, i + 1, r * 2, a); }, r); return; }a(u, c); }; const l = this.backend[s].bind(this.backend); if (l.length === 2) { try { const u = l(e, t); u && typeof u.then === 'function' ? u.then((c) => o(null, c)).catch(o) : o(null, u); } catch (u) { o(u); } return; } return l(e, t, o);
  }

  prepareLoading(e, t, s = {}, i) { if (!this.backend) return this.logger.warn('No backend was added via i18next.use. Will not load resources.'), i && i(); w(e) && (e = this.languageUtils.toResolveHierarchy(e)), w(t) && (t = [t]); const r = this.queueLoad(e, t, s, i); if (!r.toLoad.length) return r.pending.length || i(), null; r.toLoad.forEach((a) => { this.loadOne(a); }); }

  load(e, t, s) { this.prepareLoading(e, t, {}, s); }

  reload(e, t, s) { this.prepareLoading(e, t, { reload: !0 }, s); }

  loadOne(e, t = '') { const s = e.split('|'); const i = s[0]; const r = s[1]; this.read(i, r, 'read', void 0, void 0, (a, o) => { a && this.logger.warn(`${t}loading namespace ${r} for language ${i} failed`, a), !a && o && this.logger.log(`${t}loaded namespace ${r} for language ${i}`, o), this.loaded(e, a, o); }); }

  saveMissing(e, t, s, i, r, a = {}, o = () => {}) { let l; let u; let c; let f; let m; if ((u = (l = this.services) == null ? void 0 : l.utils) != null && u.hasLoadedNamespace && !((f = (c = this.services) == null ? void 0 : c.utils) != null && f.hasLoadedNamespace(t))) { this.logger.warn(`did not save key "${s}" as the namespace "${t}" was not yet loaded`, 'This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!'); return; } if (!(s == null || s === '')) { if ((m = this.backend) != null && m.create) { const d = { ...a, isUpdate: r }; const g = this.backend.create.bind(this.backend); if (g.length < 6) try { let S; g.length === 5 ? S = g(e, t, s, i, d) : S = g(e, t, s, i), S && typeof S.then === 'function' ? S.then((v) => o(null, v)).catch(o) : o(null, S); } catch (S) { o(S); } else g(e, t, s, i, o, d); }!e || !e[0] || this.store.addResource(e[0], t, s, i); } }
} const nt = () => ({
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
  overloadTranslationOptionHandler: (n) => { let e = {}; if (typeof n[1] === 'object' && (e = n[1]), w(n[1]) && (e.defaultValue = n[1]), w(n[2]) && (e.tDescription = n[2]), typeof n[2] === 'object' || typeof n[3] === 'object') { const t = n[3] || n[2]; Object.keys(t).forEach((s) => { e[s] = t[s]; }); } return e; },
  interpolation: {
    escapeValue: !0, format: (n) => n, prefix: '{{', suffix: '}}', formatSeparator: ',', unescapePrefix: '-', nestingPrefix: '$t(', nestingSuffix: ')', nestingOptionsSeparator: ',', maxReplaces: 1e3, skipOnVariables: !0,
  },
  cacheInBuiltFormats: !0,
}); const rt = (n) => { let e; let t; return w(n.ns) && (n.ns = [n.ns]), w(n.fallbackLng) && (n.fallbackLng = [n.fallbackLng]), w(n.fallbackNS) && (n.fallbackNS = [n.fallbackNS]), ((t = (e = n.supportedLngs) == null ? void 0 : e.indexOf) == null ? void 0 : t.call(e, 'cimode')) < 0 && (n.supportedLngs = n.supportedLngs.concat(['cimode'])), typeof n.initImmediate === 'boolean' && (n.initAsync = n.initImmediate), n; }; const de = () => {}; const os = (n) => { Object.getOwnPropertyNames(Object.getPrototypeOf(n)).forEach((t) => { typeof n[t] === 'function' && (n[t] = n[t].bind(n)); }); }; class oe extends Ee {
  constructor(e = {}, t) { if (super(), this.options = rt(e), this.services = {}, this.logger = H, this.modules = { external: [] }, os(this), t && !this.isInitialized && !e.isClone) { if (!this.options.initAsync) return this.init(e, t), this; setTimeout(() => { this.init(e, t); }, 0); } }

  init(e = {}, t) { this.isInitializing = !0, typeof e === 'function' && (t = e, e = {}), e.defaultNS == null && e.ns && (w(e.ns) ? e.defaultNS = e.ns : e.ns.indexOf('translation') < 0 && (e.defaultNS = e.ns[0])); const s = nt(); this.options = { ...s, ...this.options, ...rt(e) }, this.options.interpolation = { ...s.interpolation, ...this.options.interpolation }, e.keySeparator !== void 0 && (this.options.userDefinedKeySeparator = e.keySeparator), e.nsSeparator !== void 0 && (this.options.userDefinedNsSeparator = e.nsSeparator); const i = (u) => (u ? typeof u === 'function' ? new u() : u : null); if (!this.options.isClone) { this.modules.logger ? H.init(i(this.modules.logger), this.options) : H.init(null, this.options); let u; this.modules.formatter ? u = this.modules.formatter : u = ns; const c = new Xe(this.options); this.store = new Ye(this.options.resources, this.options); const f = this.services; f.logger = H, f.resourceStore = this.store, f.languageUtils = c, f.pluralResolver = new es(c, { prepend: this.options.pluralSeparator, simplifyPluralSuffix: this.options.simplifyPluralSuffix }), u && (!this.options.interpolation.format || this.options.interpolation.format === s.interpolation.format) && (f.formatter = i(u), f.formatter.init(f, this.options), this.options.interpolation.format = f.formatter.format.bind(f.formatter)), f.interpolator = new ts(this.options), f.utils = { hasLoadedNamespace: this.hasLoadedNamespace.bind(this) }, f.backendConnector = new as(i(this.modules.backend), f.resourceStore, f, this.options), f.backendConnector.on('*', (m, ...d) => { this.emit(m, ...d); }), this.modules.languageDetector && (f.languageDetector = i(this.modules.languageDetector), f.languageDetector.init && f.languageDetector.init(f, this.options.detection, this.options)), this.modules.i18nFormat && (f.i18nFormat = i(this.modules.i18nFormat), f.i18nFormat.init && f.i18nFormat.init(this)), this.translator = new Se(this.services, this.options), this.translator.on('*', (m, ...d) => { this.emit(m, ...d); }), this.modules.external.forEach((m) => { m.init && m.init(this); }); } if (this.format = this.options.interpolation.format, t || (t = de), this.options.fallbackLng && !this.services.languageDetector && !this.options.lng) { const u = this.services.languageUtils.getFallbackCodes(this.options.fallbackLng); u.length > 0 && u[0] !== 'dev' && (this.options.lng = u[0]); }!this.services.languageDetector && !this.options.lng && this.logger.warn('init: no languageDetector is used and no lng is defined'), ['getResource', 'hasResourceBundle', 'getResourceBundle', 'getDataByLanguage'].forEach((u) => { this[u] = (...c) => this.store[u](...c); }), ['addResource', 'addResources', 'addResourceBundle', 'removeResourceBundle'].forEach((u) => { this[u] = (...c) => (this.store[u](...c), this); }); const o = ne(); const l = () => { const u = (c, f) => { this.isInitializing = !1, this.isInitialized && !this.initializedStoreOnce && this.logger.warn('init: i18next is already initialized. You should call init just once!'), this.isInitialized = !0, this.options.isClone || this.logger.log('initialized', this.options), this.emit('initialized', this.options), o.resolve(f), t(c, f); }; if (this.languages && !this.isInitialized) return u(null, this.t.bind(this)); this.changeLanguage(this.options.lng, u); }; return this.options.resources || !this.options.initAsync ? l() : setTimeout(l, 0), o; }

  loadResources(e, t = de) { let r; let a; let s = t; const i = w(e) ? e : this.language; if (typeof e === 'function' && (s = e), !this.options.resources || this.options.partialBundledLanguages) { if ((i == null ? void 0 : i.toLowerCase()) === 'cimode' && (!this.options.preload || this.options.preload.length === 0)) return s(); const o = []; const l = (u) => { if (!u || u === 'cimode') return; this.services.languageUtils.toResolveHierarchy(u).forEach((f) => { f !== 'cimode' && o.indexOf(f) < 0 && o.push(f); }); }; i ? l(i) : this.services.languageUtils.getFallbackCodes(this.options.fallbackLng).forEach((c) => l(c)), (a = (r = this.options.preload) == null ? void 0 : r.forEach) == null || a.call(r, (u) => l(u)), this.services.backendConnector.load(o, this.options.ns, (u) => { !u && !this.resolvedLanguage && this.language && this.setResolvedLanguage(this.language), s(u); }); } else s(null); }

  reloadResources(e, t, s) { const i = ne(); return typeof e === 'function' && (s = e, e = void 0), typeof t === 'function' && (s = t, t = void 0), e || (e = this.languages), t || (t = this.options.ns), s || (s = de), this.services.backendConnector.reload(e, t, (r) => { i.resolve(), s(r); }), i; }

  use(e) { if (!e) throw new Error('You are passing an undefined module! Please check the object you are passing to i18next.use()'); if (!e.type) throw new Error('You are passing a wrong module! Please check the object you are passing to i18next.use()'); return e.type === 'backend' && (this.modules.backend = e), (e.type === 'logger' || e.log && e.warn && e.error) && (this.modules.logger = e), e.type === 'languageDetector' && (this.modules.languageDetector = e), e.type === 'i18nFormat' && (this.modules.i18nFormat = e), e.type === 'postProcessor' && xt.addPostProcessor(e), e.type === 'formatter' && (this.modules.formatter = e), e.type === '3rdParty' && this.modules.external.push(e), this; }

  setResolvedLanguage(e) { if (!(!e || !this.languages) && !(['cimode', 'dev'].indexOf(e) > -1)) { for (let t = 0; t < this.languages.length; t++) { const s = this.languages[t]; if (!(['cimode', 'dev'].indexOf(s) > -1) && this.store.hasLanguageSomeTranslations(s)) { this.resolvedLanguage = s; break; } }!this.resolvedLanguage && this.languages.indexOf(e) < 0 && this.store.hasLanguageSomeTranslations(e) && (this.resolvedLanguage = e, this.languages.unshift(e)); } }

  changeLanguage(e, t) { this.isLanguageChangingTo = e; const s = ne(); this.emit('languageChanging', e); const i = (o) => { this.language = o, this.languages = this.services.languageUtils.toResolveHierarchy(o), this.resolvedLanguage = void 0, this.setResolvedLanguage(o); }; const r = (o, l) => { l ? this.isLanguageChangingTo === e && (i(l), this.translator.changeLanguage(l), this.isLanguageChangingTo = void 0, this.emit('languageChanged', l), this.logger.log('languageChanged', l)) : this.isLanguageChangingTo = void 0, s.resolve((...u) => this.t(...u)), t && t(o, (...u) => this.t(...u)); }; const a = (o) => { let c; let f; !e && !o && this.services.languageDetector && (o = []); const l = w(o) ? o : o && o[0]; const u = this.store.hasLanguageSomeTranslations(l) ? l : this.services.languageUtils.getBestMatchFromCodes(w(o) ? [o] : o); u && (this.language || i(u), this.translator.language || this.translator.changeLanguage(u), (f = (c = this.services.languageDetector) == null ? void 0 : c.cacheUserLanguage) == null || f.call(c, u)), this.loadResources(u, (m) => { r(m, u); }); }; return !e && this.services.languageDetector && !this.services.languageDetector.async ? a(this.services.languageDetector.detect()) : !e && this.services.languageDetector && this.services.languageDetector.async ? this.services.languageDetector.detect.length === 0 ? this.services.languageDetector.detect().then(a) : this.services.languageDetector.detect(a) : a(e), s; }

  getFixedT(e, t, s) { const i = (r, a, ...o) => { let l; typeof a !== 'object' ? l = this.options.overloadTranslationOptionHandler([r, a].concat(o)) : l = { ...a }, l.lng = l.lng || i.lng, l.lngs = l.lngs || i.lngs, l.ns = l.ns || i.ns, l.keyPrefix !== '' && (l.keyPrefix = l.keyPrefix || s || i.keyPrefix); const u = this.options.keySeparator || '.'; let c; return l.keyPrefix && Array.isArray(r) ? c = r.map((f) => `${l.keyPrefix}${u}${f}`) : c = l.keyPrefix ? `${l.keyPrefix}${u}${r}` : r, this.t(c, l); }; return w(e) ? i.lng = e : i.lngs = e, i.ns = t, i.keyPrefix = s, i; }

  t(...e) { let t; return (t = this.translator) == null ? void 0 : t.translate(...e); }

  exists(...e) { let t; return (t = this.translator) == null ? void 0 : t.exists(...e); }

  setDefaultNamespace(e) { this.options.defaultNS = e; }

  hasLoadedNamespace(e, t = {}) { if (!this.isInitialized) return this.logger.warn('hasLoadedNamespace: i18next was not initialized', this.languages), !1; if (!this.languages || !this.languages.length) return this.logger.warn('hasLoadedNamespace: i18n.languages were undefined or empty', this.languages), !1; const s = t.lng || this.resolvedLanguage || this.languages[0]; const i = this.options ? this.options.fallbackLng : !1; const r = this.languages[this.languages.length - 1]; if (s.toLowerCase() === 'cimode') return !0; const a = (o, l) => { const u = this.services.backendConnector.state[`${o}|${l}`]; return u === -1 || u === 0 || u === 2; }; if (t.precheck) { const o = t.precheck(this, a); if (o !== void 0) return o; } return !!(this.hasResourceBundle(s, e) || !this.services.backendConnector.backend || this.options.resources && !this.options.partialBundledLanguages || a(s, e) && (!i || a(r, e))); }

  loadNamespaces(e, t) { const s = ne(); return this.options.ns ? (w(e) && (e = [e]), e.forEach((i) => { this.options.ns.indexOf(i) < 0 && this.options.ns.push(i); }), this.loadResources((i) => { s.resolve(), t && t(i); }), s) : (t && t(), Promise.resolve()); }

  loadLanguages(e, t) { const s = ne(); w(e) && (e = [e]); const i = this.options.preload || []; const r = e.filter((a) => i.indexOf(a) < 0 && this.services.languageUtils.isSupportedCode(a)); return r.length ? (this.options.preload = i.concat(r), this.loadResources((a) => { s.resolve(), t && t(a); }), s) : (t && t(), Promise.resolve()); }

  dir(e) { let i; let r; if (e || (e = this.resolvedLanguage || (((i = this.languages) == null ? void 0 : i.length) > 0 ? this.languages[0] : this.language)), !e) return 'rtl'; const t = ['ar', 'shu', 'sqr', 'ssh', 'xaa', 'yhd', 'yud', 'aao', 'abh', 'abv', 'acm', 'acq', 'acw', 'acx', 'acy', 'adf', 'ads', 'aeb', 'aec', 'afb', 'ajp', 'apc', 'apd', 'arb', 'arq', 'ars', 'ary', 'arz', 'auz', 'avl', 'ayh', 'ayl', 'ayn', 'ayp', 'bbz', 'pga', 'he', 'iw', 'ps', 'pbt', 'pbu', 'pst', 'prp', 'prd', 'ug', 'ur', 'ydd', 'yds', 'yih', 'ji', 'yi', 'hbo', 'men', 'xmn', 'fa', 'jpr', 'peo', 'pes', 'prs', 'dv', 'sam', 'ckb']; const s = ((r = this.services) == null ? void 0 : r.languageUtils) || new Xe(nt()); return t.indexOf(s.getLanguagePartFromCode(e)) > -1 || e.toLowerCase().indexOf('-arab') > 1 ? 'rtl' : 'ltr'; }

  static createInstance(e = {}, t) { return new oe(e, t); }

  cloneInstance(e = {}, t = de) { const s = e.forkResourceStore; s && delete e.forkResourceStore; const i = { ...this.options, ...e, isClone: !0 }; const r = new oe(i); if ((e.debug !== void 0 || e.prefix !== void 0) && (r.logger = r.logger.clone(e)), ['store', 'services', 'language'].forEach((o) => { r[o] = this[o]; }), r.services = { ...this.services }, r.services.utils = { hasLoadedNamespace: r.hasLoadedNamespace.bind(r) }, s) { const o = Object.keys(this.store.data).reduce((l, u) => (l[u] = { ...this.store.data[u] }, l[u] = Object.keys(l[u]).reduce((c, f) => (c[f] = { ...l[u][f] }, c), l[u]), l), {}); r.store = new Ye(o, i), r.services.resourceStore = r.store; } return r.translator = new Se(r.services, i), r.translator.on('*', (o, ...l) => { r.emit(o, ...l); }), r.init(i, t), r.translator.options = i, r.translator.backendConnector.services.utils = { hasLoadedNamespace: r.hasLoadedNamespace.bind(r) }, r; }

  toJSON() {
    return {
      options: this.options, store: this.store, language: this.language, languages: this.languages, resolvedLanguage: this.resolvedLanguage,
    };
  }
} const R = oe.createInstance(); R.createInstance = oe.createInstance; R.createInstance; R.dir; R.init; R.loadResources; R.reloadResources; R.use; R.changeLanguage; R.getFixedT; R.t; R.exists; R.setDefaultNamespace; R.hasLoadedNamespace; R.loadNamespaces; R.loadLanguages; const T = []; for (let n = 0; n < 256; ++n)T.push((n + 256).toString(16).slice(1)); function ls(n, e = 0) { return (`${T[n[e + 0]] + T[n[e + 1]] + T[n[e + 2]] + T[n[e + 3]]}-${T[n[e + 4]]}${T[n[e + 5]]}-${T[n[e + 6]]}${T[n[e + 7]]}-${T[n[e + 8]]}${T[n[e + 9]]}-${T[n[e + 10]]}${T[n[e + 11]]}${T[n[e + 12]]}${T[n[e + 13]]}${T[n[e + 14]]}${T[n[e + 15]]}`).toLowerCase(); } let $e; const us = new Uint8Array(16); function cs() { if (!$e) { if (typeof crypto > 'u' || !crypto.getRandomValues) throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported'); $e = crypto.getRandomValues.bind(crypto); } return $e(us); } const fs = typeof crypto < 'u' && crypto.randomUUID && crypto.randomUUID.bind(crypto); const at = { randomUUID: fs }; function Le(n, e, t) { let i; if (at.randomUUID && !n) return at.randomUUID(); n = n || {}; const s = n.random ?? ((i = n.rng) == null ? void 0 : i.call(n)) ?? cs(); if (s.length < 16) throw new Error('Random bytes length must be >= 16'); return s[6] = s[6] & 15 | 64, s[8] = s[8] & 63 | 128, ls(s); } const j = { data: { feeds: [], posts: [] }, form: { error: '', isValid: !1 } }; const hs = {
  ru: {
    translation: {
      error: {
        required: 'Не должно быть пустым', invalid_url: 'Ссылка должна быть валидным URL', duplicate_url: 'RSS уже существует', network_error: 'Ошибка сети', no_rss: 'Ресурс не содержит валидный RSS',
      },
    },
  },
}; function St(n, e, t = Le()) {
  const i = new DOMParser().parseFromString(n.contents, 'application/xml'); if (i.querySelector('parsererror')) throw new Error('parser error.'); const a = i.querySelector('title').textContent; const o = i.querySelector('description').textContent; const l = {
    title: a, description: o, id: t, url: e,
  }; const u = i.querySelectorAll('item'); const c = []; return u.forEach((f) => {
    const m = f.querySelector('title').textContent; const d = f.querySelector('description').textContent; const g = Le(); const S = f.querySelector('link').textContent; c.push({
      title: m, description: d, link: S, id: g, idFeed: t,
    });
  }), { feed: l, posts: c };
} let _e; let ot; function ds() {
  if (ot) return _e; ot = 1; function n(b) { this._maxSize = b, this.clear(); }n.prototype.clear = function () { this._size = 0, this._values = Object.create(null); }, n.prototype.get = function (b) { return this._values[b]; }, n.prototype.set = function (b, O) { return this._size >= this._maxSize && this.clear(), b in this._values || this._size++, this._values[b] = O; }; const e = /[^.^\]^[]+|(?=\[\]|\.\.)/g; const t = /^\d+$/; const s = /^\d/; const i = /[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g; const r = /^\s*(['"]?)(.*?)(\1)\s*$/; const a = 512; const o = new n(a); const l = new n(a); const u = new n(a); _e = {
    Cache: n, split: f, normalizePath: c, setter(b) { const O = c(b); return l.get(b) || l.set(b, (p, y) => { for (var x = 0, C = O.length, $ = p; x < C - 1;) { const E = O[x]; if (E === '__proto__' || E === 'constructor' || E === 'prototype') return p; $ = $[O[x++]]; }$[O[x]] = y; }); }, getter(b, O) { const h = c(b); return u.get(b) || u.set(b, (y) => { for (let x = 0, C = h.length; x < C;) if (y != null || !O)y = y[h[x++]]; else return; return y; }); }, join(b) { return b.reduce((O, h) => O + (d(h) || t.test(h) ? `[${h}]` : (O ? '.' : '') + h), ''); }, forEach(b, O, h) { m(Array.isArray(b) ? b : f(b), O, h); },
  }; function c(b) { return o.get(b) || o.set(b, f(b).map((O) => O.replace(r, '$2'))); } function f(b) { return b.match(e) || ['']; } function m(b, O, h) { const p = b.length; let y; let x; let C; let $; for (x = 0; x < p; x++)y = b[x], y && (v(y) && (y = `"${y}"`), $ = d(y), C = !$ && /^\d+$/.test(y), O.call(h, y, $, C, x, b)); } function d(b) { return typeof b === 'string' && b && ["'", '"'].indexOf(b.charAt(0)) !== -1; } function g(b) { return b.match(s) && !b.match(t); } function S(b) { return i.test(b); } function v(b) { return !d(b) && (g(b) || S(b)); } return _e;
} const wt = ds(); const pe = { exports: {} }; let lt; function ps() { if (lt) return pe.exports; lt = 1, pe.exports = function (i) { return n(e(i), i); }, pe.exports.array = n; function n(i, r) { let a = i.length; const o = new Array(a); const l = {}; let u = a; const c = t(r); const f = s(i); for (r.forEach((d) => { if (!f.has(d[0]) || !f.has(d[1])) throw new Error('Unknown node. There is an unknown node in the supplied edges.'); }); u--;)l[u] || m(i[u], u, new Set()); return o; function m(d, g, S) { if (S.has(d)) { let v; try { v = `, node was:${JSON.stringify(d)}`; } catch { v = ''; } throw new Error(`Cyclic dependency${v}`); } if (!f.has(d)) throw new Error(`Found unknown node. Make sure to provided all involved nodes. Unknown node: ${JSON.stringify(d)}`); if (!l[g]) { l[g] = !0; let b = c.get(d) || new Set(); if (b = Array.from(b), g = b.length) { S.add(d); do { const O = b[--g]; m(O, f.get(O), S); } while (g); S.delete(d); }o[--a] = d; } } } function e(i) { for (var r = new Set(), a = 0, o = i.length; a < o; a++) { const l = i[a]; r.add(l[0]), r.add(l[1]); } return Array.from(r); } function t(i) { for (var r = new Map(), a = 0, o = i.length; a < o; a++) { const l = i[a]; r.has(l[0]) || r.set(l[0], new Set()), r.has(l[1]) || r.set(l[1], new Set()), r.get(l[0]).add(l[1]); } return r; } function s(i) { for (var r = new Map(), a = 0, o = i.length; a < o; a++)r.set(i[a], a); return r; } return pe.exports; }ps(); const gs = Object.prototype.toString; const ms = Error.prototype.toString; const ys = RegExp.prototype.toString; const bs = typeof Symbol < 'u' ? Symbol.prototype.toString : () => ''; const xs = /^Symbol\((.*)\)(.*)$/; function Ss(n) { return n != +n ? 'NaN' : n === 0 && 1 / n < 0 ? '-0' : `${n}`; } function ut(n, e = !1) { if (n == null || n === !0 || n === !1) return `${n}`; const t = typeof n; if (t === 'number') return Ss(n); if (t === 'string') return e ? `"${n}"` : n; if (t === 'function') return `[Function ${n.name || 'anonymous'}]`; if (t === 'symbol') return bs.call(n).replace(xs, 'Symbol($1)'); const s = gs.call(n).slice(8, -1); return s === 'Date' ? isNaN(n.getTime()) ? `${n}` : n.toISOString(n) : s === 'Error' || n instanceof Error ? `[${ms.call(n)}]` : s === 'RegExp' ? ys.call(n) : null; } function q(n, e) { const t = ut(n, e); return t !== null ? t : JSON.stringify(n, function (s, i) { const r = ut(this[s], e); return r !== null ? r : i; }, 2); } function Ot(n) { return n == null ? [] : [].concat(n); } let Ct; let Et; let vt; const ws = /\$\{\s*(\w+)\s*\}/g; Ct = Symbol.toStringTag; class ct {constructor(e, t, s, i) { this.name = void 0, this.message = void 0, this.value = void 0, this.path = void 0, this.type = void 0, this.params = void 0, this.errors = void 0, this.inner = void 0, this[Ct] = 'Error', this.name = 'ValidationError', this.value = t, this.path = s, this.type = i, this.errors = [], this.inner = [], Ot(e).forEach((r) => { if (M.isError(r)) { this.errors.push(...r.errors); const a = r.inner.length ? r.inner : [r]; this.inner.push(...a); } else this.errors.push(r); }), this.message = this.errors.length > 1 ? `${this.errors.length} errors occurred` : this.errors[0]; }}Et = Symbol.hasInstance; vt = Symbol.toStringTag; class M extends Error {
  static formatError(e, t) { const s = t.label || t.path || 'this'; return t = { ...t, path: s, originalPath: t.path }, typeof e === 'string' ? e.replace(ws, (i, r) => q(t[r])) : typeof e === 'function' ? e(t) : e; }

  static isError(e) { return e && e.name === 'ValidationError'; }

  constructor(e, t, s, i, r) { const a = new ct(e, t, s, i); if (r) return a; super(), this.value = void 0, this.path = void 0, this.type = void 0, this.params = void 0, this.errors = [], this.inner = [], this[vt] = 'Error', this.name = a.name, this.message = a.message, this.type = a.type, this.value = a.value, this.path = a.path, this.errors = a.errors, this.inner = a.inner, Error.captureStackTrace && Error.captureStackTrace(this, M); }

  static [Et](e) { return ct[Symbol.hasInstance](e) || super[Symbol.hasInstance](e); }
} const U = {
  default: '${path} is invalid',
  required: '${path} is a required field',
  defined: '${path} must be defined',
  notNull: '${path} cannot be null',
  oneOf: '${path} must be one of the following values: ${values}',
  notOneOf: '${path} must not be one of the following values: ${values}',
  notType: ({
    path: n, type: e, value: t, originalValue: s,
  }) => { const i = s != null && s !== t ? ` (cast from the value \`${q(s, !0)}\`).` : '.'; return e !== 'mixed' ? `${n} must be a \`${e}\` type, but the final value was: \`${q(t, !0)}\`${i}` : `${n} must match the configured type. The validated value was: \`${q(t, !0)}\`${i}`; },
}; const N = {
  length: '${path} must be exactly ${length} characters', min: '${path} must be at least ${min} characters', max: '${path} must be at most ${max} characters', matches: '${path} must match the following: "${regex}"', email: '${path} must be a valid email', url: '${path} must be a valid URL', uuid: '${path} must be a valid UUID', datetime: '${path} must be a valid ISO date-time', datetime_precision: '${path} must be a valid ISO date-time with a sub-second precision of exactly ${precision} digits', datetime_offset: '${path} must be a valid ISO date-time with UTC "Z" timezone', trim: '${path} must be a trimmed string', lowercase: '${path} must be a lowercase string', uppercase: '${path} must be a upper case string',
}; const Os = {
  min: '${path} must be greater than or equal to ${min}', max: '${path} must be less than or equal to ${max}', lessThan: '${path} must be less than ${less}', moreThan: '${path} must be greater than ${more}', positive: '${path} must be a positive number', negative: '${path} must be a negative number', integer: '${path} must be an integer',
}; const Re = { min: '${path} field must be later than ${min}', max: '${path} field must be at earlier than ${max}' }; const Cs = { isValue: '${path} field must be ${value}' }; const Es = { noUnknown: '${path} field has unspecified keys: ${unknown}', exact: '${path} object contains unknown properties: ${properties}' }; const vs = { min: '${path} field must have at least ${min} items', max: '${path} field must have less than or equal to ${max} items', length: '${path} must have ${length} items' }; const $s = { notType: (n) => { const { path: e, value: t, spec: s } = n; const i = s.types.length; if (Array.isArray(t)) { if (t.length < i) return `${e} tuple value has too few items, expected a length of ${i} but got ${t.length} for value: \`${q(t, !0)}\``; if (t.length > i) return `${e} tuple value has too many items, expected a length of ${i} but got ${t.length} for value: \`${q(t, !0)}\``; } return M.formatError(U.notType, n); } }; const _s = Object.assign(Object.create(null), {
  mixed: U, string: N, number: Os, date: Re, object: Es, array: vs, boolean: Cs, tuple: $s,
}); const $t = (n) => n && n.__isYupSchema__; class we {
  static fromOptions(e, t) { if (!t.then && !t.otherwise) throw new TypeError('either `then:` or `otherwise:` is required for `when()` conditions'); const { is: s, then: i, otherwise: r } = t; const a = typeof s === 'function' ? s : (...o) => o.every((l) => l === s); return new we(e, (o, l) => { let u; const c = a(...o) ? i : r; return (u = c == null ? void 0 : c(l)) != null ? u : l; }); }

  constructor(e, t) { this.fn = void 0, this.refs = e, this.refs = e, this.fn = t; }

  resolve(e, t) { const s = this.refs.map((r) => r.getValue(t == null ? void 0 : t.value, t == null ? void 0 : t.parent, t == null ? void 0 : t.context)); const i = this.fn(s, e, t); if (i === void 0 || i === e) return e; if (!$t(i)) throw new TypeError('conditions must return a schema object'); return i.resolve(t); }
} const ge = { context: '$', value: '.' }; class le {
  constructor(e, t = {}) { if (this.key = void 0, this.isContext = void 0, this.isValue = void 0, this.isSibling = void 0, this.path = void 0, this.getter = void 0, this.map = void 0, typeof e !== 'string') throw new TypeError(`ref must be a string, got: ${e}`); if (this.key = e.trim(), e === '') throw new TypeError('ref must be a non-empty string'); this.isContext = this.key[0] === ge.context, this.isValue = this.key[0] === ge.value, this.isSibling = !this.isContext && !this.isValue; const s = this.isContext ? ge.context : this.isValue ? ge.value : ''; this.path = this.key.slice(s.length), this.getter = this.path && wt.getter(this.path, !0), this.map = t.map; }

  getValue(e, t, s) { let i = this.isContext ? s : this.isValue ? e : t; return this.getter && (i = this.getter(i || {})), this.map && (i = this.map(i)), i; }

  cast(e, t) { return this.getValue(e, t == null ? void 0 : t.parent, t == null ? void 0 : t.context); }

  resolve() { return this; }

  describe() { return { type: 'ref', key: this.key }; }

  toString() { return `Ref(${this.key})`; }

  static isRef(e) { return e && e.__isYupRef; }
}le.prototype.__isYupRef = !0; const Z = (n) => n == null; function ee(n) {
  function e({
    value: t, path: s = '', options: i, originalValue: r, schema: a,
  }, o, l) {
    const {
      name: u, test: c, params: f, message: m, skipAbsent: d,
    } = n; const {
      parent: g, context: S, abortEarly: v = a.spec.abortEarly, disableStackTrace: b = a.spec.disableStackTrace,
    } = i; function O(_) { return le.isRef(_) ? _.getValue(t, g, S) : _; } function h(_ = {}) {
      const P = {
        value: t, originalValue: r, label: a.spec.label, path: _.path || s, spec: a.spec, disableStackTrace: _.disableStackTrace || b, ...f, ..._.params,
      }; for (const F of Object.keys(P))P[F] = O(P[F]); const L = new M(M.formatError(_.message || m, P), t, P.path, _.type || u, P.disableStackTrace); return L.params = P, L;
    } const p = v ? o : l; const y = {
      path: s, parent: g, type: u, from: i.from, createError: h, resolve: O, options: i, originalValue: r, schema: a,
    }; const x = (_) => { M.isError(_) ? p(_) : _ ? l(null) : p(h()); }; const C = (_) => { M.isError(_) ? p(_) : o(_); }; if (d && Z(t)) return x(!0); let E; try { let k; if (E = c.call(y, t, y), typeof ((k = E) == null ? void 0 : k.then) === 'function') { if (i.sync) throw new Error(`Validation test of type: "${y.type}" returned a Promise during a synchronous validate. This test will finish after the validate call has returned`); return Promise.resolve(E).then(x, C); } } catch (_) { C(_); return; }x(E);
  } return e.OPTIONS = n, e;
} function ks(n, e, t, s = t) { let i; let r; let a; return e ? (wt.forEach(e, (o, l, u) => { const c = l ? o.slice(1, o.length - 1) : o; n = n.resolve({ context: s, parent: i, value: t }); const f = n.type === 'tuple'; const m = u ? parseInt(c, 10) : 0; if (n.innerType || f) { if (f && !u) throw new Error(`Yup.reach cannot implicitly index into a tuple type. the path part "${a}" must contain an index to the tuple element, e.g. "${a}[0]"`); if (t && m >= t.length) throw new Error(`Yup.reach cannot resolve an array item at index: ${o}, in the path: ${e}. because there is no value at that index. `); i = t, t = t && t[m], n = f ? n.spec.types[m] : n.innerType; } if (!u) { if (!n.fields || !n.fields[c]) throw new Error(`The schema does not contain the path: ${e}. (failed at: ${a} which is a type: "${n.type}")`); i = t, t = t && t[c], n = n.fields[c]; }r = c, a = l ? `[${o}]` : `.${o}`; }), { schema: n, parent: i, parentPath: r }) : { parent: i, parentPath: e, schema: n }; } class Oe extends Set {
  describe() { const e = []; for (const t of this.values())e.push(le.isRef(t) ? t.describe() : t); return e; }

  resolveAll(e) { const t = []; for (const s of this.values())t.push(e(s)); return t; }

  clone() { return new Oe(this.values()); }

  merge(e, t) { const s = this.clone(); return e.forEach((i) => s.add(i)), t.forEach((i) => s.delete(i)), s; }
} function te(n, e = new Map()) { if ($t(n) || !n || typeof n !== 'object') return n; if (e.has(n)) return e.get(n); let t; if (n instanceof Date)t = new Date(n.getTime()), e.set(n, t); else if (n instanceof RegExp)t = new RegExp(n), e.set(n, t); else if (Array.isArray(n)) { t = new Array(n.length), e.set(n, t); for (let s = 0; s < n.length; s++)t[s] = te(n[s], e); } else if (n instanceof Map) { t = new Map(), e.set(n, t); for (const [s, i] of n.entries())t.set(s, te(i, e)); } else if (n instanceof Set) { t = new Set(), e.set(n, t); for (const s of n)t.add(te(s, e)); } else if (n instanceof Object) { t = {}, e.set(n, t); for (const [s, i] of Object.entries(n))t[s] = te(i, e); } else throw Error(`Unable to clone ${n}`); return t; } class J {
  constructor(e) {
    this.type = void 0, this.deps = [], this.tests = void 0, this.transforms = void 0, this.conditions = [], this._mutate = void 0, this.internalTests = {}, this._whitelist = new Oe(), this._blacklist = new Oe(), this.exclusiveTests = Object.create(null), this._typeCheck = void 0, this.spec = void 0, this.tests = [], this.transforms = [], this.withMutation(() => { this.typeError(U.notType); }), this.type = e.type, this._typeCheck = e.check, this.spec = {
      strip: !1, strict: !1, abortEarly: !0, recursive: !0, disableStackTrace: !1, nullable: !1, optional: !0, coerce: !0, ...(e == null ? void 0 : e.spec),
    }, this.withMutation((t) => { t.nonNullable(); });
  }

  get _type() { return this.type; }

  clone(e) { if (this._mutate) return e && Object.assign(this.spec, e), this; const t = Object.create(Object.getPrototypeOf(this)); return t.type = this.type, t._typeCheck = this._typeCheck, t._whitelist = this._whitelist.clone(), t._blacklist = this._blacklist.clone(), t.internalTests = { ...this.internalTests }, t.exclusiveTests = { ...this.exclusiveTests }, t.deps = [...this.deps], t.conditions = [...this.conditions], t.tests = [...this.tests], t.transforms = [...this.transforms], t.spec = te({ ...this.spec, ...e }), t; }

  label(e) { const t = this.clone(); return t.spec.label = e, t; }

  meta(...e) { if (e.length === 0) return this.spec.meta; const t = this.clone(); return t.spec.meta = Object.assign(t.spec.meta || {}, e[0]), t; }

  withMutation(e) { const t = this._mutate; this._mutate = !0; const s = e(this); return this._mutate = t, s; }

  concat(e) { if (!e || e === this) return this; if (e.type !== this.type && this.type !== 'mixed') throw new TypeError(`You cannot \`concat()\` schema's of different types: ${this.type} and ${e.type}`); const t = this; const s = e.clone(); const i = { ...t.spec, ...s.spec }; return s.spec = i, s.internalTests = { ...t.internalTests, ...s.internalTests }, s._whitelist = t._whitelist.merge(e._whitelist, e._blacklist), s._blacklist = t._blacklist.merge(e._blacklist, e._whitelist), s.tests = t.tests, s.exclusiveTests = t.exclusiveTests, s.withMutation((r) => { e.tests.forEach((a) => { r.test(a.OPTIONS); }); }), s.transforms = [...t.transforms, ...s.transforms], s; }

  isType(e) { return e == null ? !!(this.spec.nullable && e === null || this.spec.optional && e === void 0) : this._typeCheck(e); }

  resolve(e) { let t = this; if (t.conditions.length) { const s = t.conditions; t = t.clone(), t.conditions = [], t = s.reduce((i, r) => r.resolve(i, e), t), t = t.resolve(e); } return t; }

  resolveOptions(e) {
    let t; let s; let i; let r; return {
      ...e, from: e.from || [], strict: (t = e.strict) != null ? t : this.spec.strict, abortEarly: (s = e.abortEarly) != null ? s : this.spec.abortEarly, recursive: (i = e.recursive) != null ? i : this.spec.recursive, disableStackTrace: (r = e.disableStackTrace) != null ? r : this.spec.disableStackTrace,
    };
  }

  cast(e, t = {}) {
    const s = this.resolve({ value: e, ...t }); const i = t.assert === 'ignore-optionality'; const r = s._cast(e, t); if (t.assert !== !1 && !s.isType(r)) {
      if (i && Z(r)) return r; const a = q(e); const o = q(r); throw new TypeError(`The value of ${t.path || 'field'} could not be cast to a value that satisfies the schema type: "${s.type}". 

attempted value: ${a} 
${o !== a ? `result of cast: ${o}` : ''}`);
    } return r;
  }

  _cast(e, t) { let s = e === void 0 ? e : this.transforms.reduce((i, r) => r.call(this, i, e, this), e); return s === void 0 && (s = this.getDefault(t)), s; }

  _validate(e, t = {}, s, i) {
    const { path: r, originalValue: a = e, strict: o = this.spec.strict } = t; let l = e; o || (l = this._cast(l, { assert: !1, ...t })); const u = []; for (const c of Object.values(this.internalTests))c && u.push(c); this.runTests({
      path: r, value: l, originalValue: a, options: t, tests: u,
    }, s, (c) => {
      if (c.length) return i(c, l); this.runTests({
        path: r, value: l, originalValue: a, options: t, tests: this.tests,
      }, s, i);
    });
  }

  runTests(e, t, s) {
    let i = !1; const {
      tests: r, value: a, originalValue: o, path: l, options: u,
    } = e; const c = (S) => { i || (i = !0, t(S, a)); }; const f = (S) => { i || (i = !0, s(S, a)); }; let m = r.length; const d = []; if (!m) return f([]); const g = {
      value: a, originalValue: o, path: l, options: u, schema: this,
    }; for (let S = 0; S < r.length; S++) { const v = r[S]; v(g, c, (O) => { O && (Array.isArray(O) ? d.push(...O) : d.push(O)), --m <= 0 && f(d); }); }
  }

  asNestedTest({
    key: e, index: t, parent: s, parentPath: i, originalParent: r, options: a,
  }) {
    const o = e ?? t; if (o == null) throw TypeError('Must include `key` or `index` for nested validations'); const l = typeof o === 'number'; const u = s[o]; const c = {
      ...a, strict: !0, parent: s, value: u, originalValue: r[o], key: void 0, [l ? 'index' : 'key']: o, path: l || o.includes('.') ? `${i || ''}[${l ? o : `"${o}"`}]` : (i ? `${i}.` : '') + e,
    }; return (f, m, d) => this.resolve(c)._validate(u, c, m, d);
  }

  validate(e, t) { let s; const i = this.resolve({ ...t, value: e }); const r = (s = t == null ? void 0 : t.disableStackTrace) != null ? s : i.spec.disableStackTrace; return new Promise((a, o) => i._validate(e, t, (l, u) => { M.isError(l) && (l.value = u), o(l); }, (l, u) => { l.length ? o(new M(l, u, void 0, void 0, r)) : a(u); })); }

  validateSync(e, t) { let s; const i = this.resolve({ ...t, value: e }); let r; const a = (s = t == null ? void 0 : t.disableStackTrace) != null ? s : i.spec.disableStackTrace; return i._validate(e, { ...t, sync: !0 }, (o, l) => { throw M.isError(o) && (o.value = l), o; }, (o, l) => { if (o.length) throw new M(o, e, void 0, void 0, a); r = l; }), r; }

  isValid(e, t) { return this.validate(e, t).then(() => !0, (s) => { if (M.isError(s)) return !1; throw s; }); }

  isValidSync(e, t) { try { return this.validateSync(e, t), !0; } catch (s) { if (M.isError(s)) return !1; throw s; } }

  _getDefault(e) { const t = this.spec.default; return t == null ? t : typeof t === 'function' ? t.call(this, e) : te(t); }

  getDefault(e) { return this.resolve(e || {})._getDefault(e); }

  default(e) { return arguments.length === 0 ? this._getDefault() : this.clone({ default: e }); }

  strict(e = !0) { return this.clone({ strict: e }); }

  nullability(e, t) { const s = this.clone({ nullable: e }); return s.internalTests.nullable = ee({ message: t, name: 'nullable', test(i) { return i === null ? this.schema.spec.nullable : !0; } }), s; }

  optionality(e, t) { const s = this.clone({ optional: e }); return s.internalTests.optionality = ee({ message: t, name: 'optionality', test(i) { return i === void 0 ? this.schema.spec.optional : !0; } }), s; }

  optional() { return this.optionality(!0); }

  defined(e = U.defined) { return this.optionality(!1, e); }

  nullable() { return this.nullability(!0); }

  nonNullable(e = U.notNull) { return this.nullability(!1, e); }

  required(e = U.required) { return this.clone().withMutation((t) => t.nonNullable(e).defined(e)); }

  notRequired() { return this.clone().withMutation((e) => e.nullable().optional()); }

  transform(e) { const t = this.clone(); return t.transforms.push(e), t; }

  test(...e) { let t; if (e.length === 1 ? typeof e[0] === 'function' ? t = { test: e[0] } : t = e[0] : e.length === 2 ? t = { name: e[0], test: e[1] } : t = { name: e[0], message: e[1], test: e[2] }, t.message === void 0 && (t.message = U.default), typeof t.test !== 'function') throw new TypeError('`test` is a required parameters'); const s = this.clone(); const i = ee(t); const r = t.exclusive || t.name && s.exclusiveTests[t.name] === !0; if (t.exclusive && !t.name) throw new TypeError('Exclusive tests must provide a unique `name` identifying the test'); return t.name && (s.exclusiveTests[t.name] = !!t.exclusive), s.tests = s.tests.filter((a) => !(a.OPTIONS.name === t.name && (r || a.OPTIONS.test === i.OPTIONS.test))), s.tests.push(i), s; }

  when(e, t) { !Array.isArray(e) && typeof e !== 'string' && (t = e, e = '.'); const s = this.clone(); const i = Ot(e).map((r) => new le(r)); return i.forEach((r) => { r.isSibling && s.deps.push(r.key); }), s.conditions.push(typeof t === 'function' ? new we(i, t) : we.fromOptions(i, t)), s; }

  typeError(e) {
    const t = this.clone(); return t.internalTests.typeError = ee({
      message: e, name: 'typeError', skipAbsent: !0, test(s) { return this.schema._typeCheck(s) ? !0 : this.createError({ params: { type: this.schema.type } }); },
    }), t;
  }

  oneOf(e, t = U.oneOf) {
    const s = this.clone(); return e.forEach((i) => { s._whitelist.add(i), s._blacklist.delete(i); }), s.internalTests.whiteList = ee({
      message: t, name: 'oneOf', skipAbsent: !0, test(i) { const r = this.schema._whitelist; const a = r.resolveAll(this.resolve); return a.includes(i) ? !0 : this.createError({ params: { values: Array.from(r).join(', '), resolved: a } }); },
    }), s;
  }

  notOneOf(e, t = U.notOneOf) { const s = this.clone(); return e.forEach((i) => { s._blacklist.add(i), s._whitelist.delete(i); }), s.internalTests.blacklist = ee({ message: t, name: 'notOneOf', test(i) { const r = this.schema._blacklist; const a = r.resolveAll(this.resolve); return a.includes(i) ? this.createError({ params: { values: Array.from(r).join(', '), resolved: a } }) : !0; } }), s; }

  strip(e = !0) { const t = this.clone(); return t.spec.strip = e, t; }

  describe(e) {
    const t = (e ? this.resolve(e) : this).clone(); const {
      label: s, meta: i, optional: r, nullable: a,
    } = t.spec; return {
      meta: i, label: s, optional: r, nullable: a, default: t.getDefault(e), type: t.type, oneOf: t._whitelist.describe(), notOneOf: t._blacklist.describe(), tests: t.tests.map((l) => ({ name: l.OPTIONS.name, params: l.OPTIONS.params })).filter((l, u, c) => c.findIndex((f) => f.name === l.name) === u),
    };
  }
}J.prototype.__isYupSchema__ = !0; for (const n of ['validate', 'validateSync'])J.prototype[`${n}At`] = function (e, t, s = {}) { const { parent: i, parentPath: r, schema: a } = ks(this, e, t, s.context); return a[n](i && i[r], { ...s, parent: i, path: e }); }; for (const n of ['equals', 'is'])J.prototype[n] = J.prototype.oneOf; for (const n of ['not', 'nope'])J.prototype[n] = J.prototype.notOneOf; const Fs = /^(\d{4}|[+-]\d{6})(?:-?(\d{2})(?:-?(\d{2}))?)?(?:[ T]?(\d{2}):?(\d{2})(?::?(\d{2})(?:[,.](\d{1,}))?)?(?:(Z)|([+-])(\d{2})(?::?(\d{2}))?)?)?$/; function Ts(n) { const e = De(n); if (!e) return Date.parse ? Date.parse(n) : Number.NaN; if (e.z === void 0 && e.plusMinus === void 0) return new Date(e.year, e.month, e.day, e.hour, e.minute, e.second, e.millisecond).valueOf(); let t = 0; return e.z !== 'Z' && e.plusMinus !== void 0 && (t = e.hourOffset * 60 + e.minuteOffset, e.plusMinus === '+' && (t = 0 - t)), Date.UTC(e.year, e.month, e.day, e.hour, e.minute + t, e.second, e.millisecond); } function De(n) {
  let e; let t; const s = Fs.exec(n); return s ? {
    year: K(s[1]), month: K(s[2], 1) - 1, day: K(s[3], 1), hour: K(s[4]), minute: K(s[5]), second: K(s[6]), millisecond: s[7] ? K(s[7].substring(0, 3)) : 0, precision: (e = (t = s[7]) == null ? void 0 : t.length) != null ? e : void 0, z: s[8] || void 0, plusMinus: s[9] || void 0, hourOffset: K(s[10]), minuteOffset: K(s[11]),
  } : null;
} function K(n, e = 0) { return Number(n) || e; } const Ls = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/; const Rs = /^((https?|ftp):)?\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i; const Ds = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i; const Ps = '^\\d{4}-\\d{2}-\\d{2}'; const Ns = '\\d{2}:\\d{2}:\\d{2}'; const As = '(([+-]\\d{2}(:?\\d{2})?)|Z)'; const Ms = new RegExp(`${Ps}T${Ns}(\\.\\d+)?${As}$`); const Is = (n) => Z(n) || n === n.trim(); const js = {}.toString(); function _t() { return new kt(); } class kt extends J {
  constructor() { super({ type: 'string', check(e) { return e instanceof String && (e = e.valueOf()), typeof e === 'string'; } }), this.withMutation(() => { this.transform((e, t, s) => { if (!s.spec.coerce || s.isType(e) || Array.isArray(e)) return e; const i = e != null && e.toString ? e.toString() : e; return i === js ? e : i; }); }); }

  required(e) {
    return super.required(e).withMutation((t) => t.test({
      message: e || U.required, name: 'required', skipAbsent: !0, test: (s) => !!s.length,
    }));
  }

  notRequired() { return super.notRequired().withMutation((e) => (e.tests = e.tests.filter((t) => t.OPTIONS.name !== 'required'), e)); }

  length(e, t = N.length) {
    return this.test({
      message: t, name: 'length', exclusive: !0, params: { length: e }, skipAbsent: !0, test(s) { return s.length === this.resolve(e); },
    });
  }

  min(e, t = N.min) {
    return this.test({
      message: t, name: 'min', exclusive: !0, params: { min: e }, skipAbsent: !0, test(s) { return s.length >= this.resolve(e); },
    });
  }

  max(e, t = N.max) {
    return this.test({
      name: 'max', exclusive: !0, message: t, params: { max: e }, skipAbsent: !0, test(s) { return s.length <= this.resolve(e); },
    });
  }

  matches(e, t) {
    let s = !1; let i; let r; return t && (typeof t === 'object' ? { excludeEmptyString: s = !1, message: i, name: r } = t : i = t), this.test({
      name: r || 'matches', message: i || N.matches, params: { regex: e }, skipAbsent: !0, test: (a) => a === '' && s || a.search(e) !== -1,
    });
  }

  email(e = N.email) { return this.matches(Ls, { name: 'email', message: e, excludeEmptyString: !0 }); }

  url(e = N.url) { return this.matches(Rs, { name: 'url', message: e, excludeEmptyString: !0 }); }

  uuid(e = N.uuid) { return this.matches(Ds, { name: 'uuid', message: e, excludeEmptyString: !1 }); }

  datetime(e) {
    let t = ''; let s; let i; return e && (typeof e === 'object' ? { message: t = '', allowOffset: s = !1, precision: i = void 0 } = e : t = e), this.matches(Ms, { name: 'datetime', message: t || N.datetime, excludeEmptyString: !0 }).test({
      name: 'datetime_offset', message: t || N.datetime_offset, params: { allowOffset: s }, skipAbsent: !0, test: (r) => { if (!r || s) return !0; const a = De(r); return a ? !!a.z : !1; },
    }).test({
      name: 'datetime_precision', message: t || N.datetime_precision, params: { precision: i }, skipAbsent: !0, test: (r) => { if (!r || i == null) return !0; const a = De(r); return a ? a.precision === i : !1; },
    });
  }

  ensure() { return this.default('').transform((e) => (e === null ? '' : e)); }

  trim(e = N.trim) { return this.transform((t) => (t != null ? t.trim() : t)).test({ message: e, name: 'trim', test: Is }); }

  lowercase(e = N.lowercase) {
    return this.transform((t) => (Z(t) ? t : t.toLowerCase())).test({
      message: e, name: 'string_case', exclusive: !0, skipAbsent: !0, test: (t) => Z(t) || t === t.toLowerCase(),
    });
  }

  uppercase(e = N.uppercase) {
    return this.transform((t) => (Z(t) ? t : t.toUpperCase())).test({
      message: e, name: 'string_case', exclusive: !0, skipAbsent: !0, test: (t) => Z(t) || t === t.toUpperCase(),
    });
  }
}_t.prototype = kt.prototype; const Vs = new Date(''); const Us = (n) => Object.prototype.toString.call(n) === '[object Date]'; class Me extends J {
  constructor() { super({ type: 'date', check(e) { return Us(e) && !isNaN(e.getTime()); } }), this.withMutation(() => { this.transform((e, t, s) => (!s.spec.coerce || s.isType(e) || e === null ? e : (e = Ts(e), isNaN(e) ? Me.INVALID_DATE : new Date(e)))); }); }

  prepareParam(e, t) { let s; if (le.isRef(e))s = e; else { const i = this.cast(e); if (!this._typeCheck(i)) throw new TypeError(`\`${t}\` must be a Date or a value that can be \`cast()\` to a Date`); s = i; } return s; }

  min(e, t = Re.min) {
    const s = this.prepareParam(e, 'min'); return this.test({
      message: t, name: 'min', exclusive: !0, params: { min: e }, skipAbsent: !0, test(i) { return i >= this.resolve(s); },
    });
  }

  max(e, t = Re.max) {
    const s = this.prepareParam(e, 'max'); return this.test({
      message: t, name: 'max', exclusive: !0, params: { max: e }, skipAbsent: !0, test(i) { return i <= this.resolve(s); },
    });
  }
}Me.INVALID_DATE = Vs; function Hs(n) { Object.keys(n).forEach((e) => { Object.keys(n[e]).forEach((t) => { _s[e][t] = n[e][t]; }); }); } const zs = (n, e) => new Promise((t) => { const s = e.some((i) => i.url === n); t(s); }); const Ks = (n) => (Hs({ mixed: { required: () => n.t('error.required') }, string: { url: () => n.t('error.invalid_url') } }), (e) => ({
  validate: (t) => {
    const { url: s } = t; return _t().required().url().test('is-unique', () => n.t('error.duplicate_url'), (r) => (r ? zs(r, e).then((a) => !a) : !0))
      .validate(s, { abortEarly: !1 })
      .then(() => ({ isValid: !0, error: null }))
      .catch((r) => ({ isValid: !1, error: r.errors }));
  },
})); const Bs = (n, e = '.feedback') => { const t = document.querySelector(e); t.innerHTML = ''; const s = document.createElement('div'); s.textContent = n, t.appendChild(s); }; const qs = (n, e = '.feeds') => { const t = document.querySelector(e); t.innerHTML = ''; const s = document.createElement('div'); s.className = 'card border-0'; const i = document.createElement('div'); i.className = 'card-body'; const r = document.createElement('h2'); r.className = 'card-title h4', r.textContent = 'Фиды', i.appendChild(r), s.appendChild(i); const a = document.createElement('ul'); a.className = 'list-group border-0 rounded-0', n.forEach((o) => { const l = document.createElement('li'); l.className = 'list-group-item border-0 border-end-0'; const u = document.createElement('h3'); u.className = 'h6 m-0', u.textContent = o.title; const c = document.createElement('p'); c.className = 'm-0 small text-black-50', c.textContent = o.description, l.appendChild(u), l.appendChild(c), a.appendChild(l); }), s.appendChild(a), t.appendChild(s); }; const Ws = (n, e = '.posts') => { const t = document.querySelector(e); t.innerHTML = ''; const s = document.createElement('div'); s.className = 'card border-0'; const i = document.createElement('div'); i.className = 'card-body'; const r = document.createElement('h2'); r.className = 'card-title h4', r.textContent = 'Посты', i.appendChild(r), s.appendChild(i); const a = document.createElement('ul'); a.className = 'list-group border-0 rounded-0', n.forEach((o) => { const l = document.createElement('li'); l.className = 'list-group-item d-flex justify-content-between align-items-start border-0 border-end-0'; const u = document.createElement('a'); u.href = o.link, u.className = 'fw-bold', u.textContent = o.title, u.setAttribute('target', '_blank'), u.setAttribute('rel', 'noopener noreferrer'), u.dataset.id = o.id; const c = document.createElement('button'); c.type = 'button', c.className = 'btn btn-outline-primary btn-sm', c.textContent = 'Просмотр', c.dataset.id = o.id, c.dataset.bsToggle = 'modal', c.dataset.bsTarget = '#modal', l.appendChild(u), l.appendChild(c), a.appendChild(l); }), s.appendChild(a), t.appendChild(s); }; const Ft = R.createInstance(); Ft.init({ lng: 'ru', debug: !1, resources: hs }); const Js = Ks(Ft); const me = Ce(j.form, (n, e) => { n === 'error' && Bs(e); }); const Pe = Ce(j.data, (n) => { n === 'feeds' && qs(j.data.feeds), n === 'posts' && Ws(j.data.posts); }); const Gs = (n) => Js(j.data.feeds).validate({ url: n }, { abortEarly: !1 }); const Ne = () => { if (j.data.feeds.length === 0) { setTimeout(Ne, 5e3); return; } const n = j.data.feeds.map((e) => fetch(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(e.url)}`).then((t) => { if (t.ok) return t.json(); throw new Error('Network response was not ok.'); }).then((t) => { const { posts: s } = St(t, e.url, e.id); const i = new Set(j.data.posts.filter((a) => a.idFeed === e.id).map((a) => a.link)); const r = s.filter((a) => !i.has(a.link)); r.length > 0 && (Pe.posts = [...r, ...j.data.posts]); }).catch((t) => console.error(`Ошибка обновления фида ${e.url}:`, t))); Promise.all(n).finally(() => setTimeout(Ne, 5e3)); }; const Ys = () => { const n = document.querySelector('.rss-form'); const e = document.getElementById('url-input'); const t = (s) => { s.preventDefault(); const { value: i } = e; const r = i.trim(); Gs(r).then(({ isValid: a, error: o }) => { if (me.isValid = a, me.error = o, a) return fetch(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(r)}`).then((l) => { if (l.ok) return l.json(); throw new Error('Network response was not ok.'); }).then((l) => { const u = Le(); const { feed: c, posts: f } = St(l, r, u); console.log(2), Pe.feeds = [c, ...j.data.feeds], Pe.posts = [...f, ...j.data.posts]; }).catch((l) => { console.error(l), me.error = [l], me.isValid = !1; }); }); }; n.addEventListener('submit', t), setTimeout(Ne, 5e3); }; Ys();
