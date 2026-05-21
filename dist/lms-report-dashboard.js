var Sr = Object.defineProperty;
var kr = (i, t, e) => t in i ? Sr(i, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : i[t] = e;
var S = (i, t, e) => kr(i, typeof t != "symbol" ? t + "" : t, e);
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ji = "lit-localize-status";
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Mr = (i) => typeof i != "string" && "strTag" in i, fo = (i, t, e) => {
  let s = i[0];
  for (let n = 1; n < i.length; n++)
    s += t[e ? e[n - 1] : n - 1], s += i[n];
  return s;
};
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const po = (i) => Mr(i) ? fo(i.strings, i.values) : i;
let E = po, Os = !1;
function Ar(i) {
  if (Os)
    throw new Error("lit-localize can only be configured once");
  E = i, Os = !0;
}
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
class Pr {
  constructor(t) {
    this.__litLocalizeEventHandler = (e) => {
      e.detail.status === "ready" && this.host.requestUpdate();
    }, this.host = t;
  }
  hostConnected() {
    window.addEventListener(Ji, this.__litLocalizeEventHandler);
  }
  hostDisconnected() {
    window.removeEventListener(Ji, this.__litLocalizeEventHandler);
  }
}
const $r = (i) => i.addController(new Pr(i)), Ie = $r;
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
class go {
  constructor() {
    this.settled = !1, this.promise = new Promise((t, e) => {
      this._resolve = t, this._reject = e;
    });
  }
  resolve(t) {
    this.settled = !0, this._resolve(t);
  }
  reject(t) {
    this.settled = !0, this._reject(t);
  }
}
/**
 * @license
 * Copyright 2014 Travis Webb
 * SPDX-License-Identifier: MIT
 */
const dt = [];
for (let i = 0; i < 256; i++)
  dt[i] = (i >> 4 & 15).toString(16) + (i & 15).toString(16);
function Cr(i) {
  let t = 0, e = 8997, s = 0, n = 33826, o = 0, r = 40164, a = 0, l = 52210;
  for (let c = 0; c < i.length; c++)
    e ^= i.charCodeAt(c), t = e * 435, s = n * 435, o = r * 435, a = l * 435, o += e << 8, a += n << 8, s += t >>> 16, e = t & 65535, o += s >>> 16, n = s & 65535, l = a + (o >>> 16) & 65535, r = o & 65535;
  return dt[l >> 8] + dt[l & 255] + dt[r >> 8] + dt[r & 255] + dt[n >> 8] + dt[n & 255] + dt[e >> 8] + dt[e & 255];
}
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Or = "", Dr = "h", Tr = "s";
function Er(i, t) {
  return (t ? Dr : Tr) + Cr(typeof i == "string" ? i : i.join(Or));
}
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ds = /* @__PURE__ */ new WeakMap(), Ts = /* @__PURE__ */ new Map();
function Lr(i, t, e) {
  if (i) {
    const s = e?.id ?? Ir(t), n = i[s];
    if (n) {
      if (typeof n == "string")
        return n;
      if ("strTag" in n)
        return fo(
          n.strings,
          // Cast `template` because its type wasn't automatically narrowed (but
          // we know it must be the same type as `localized`).
          t.values,
          n.values
        );
      {
        let o = Ds.get(n);
        return o === void 0 && (o = n.values, Ds.set(n, o)), {
          ...n,
          values: o.map((r) => t.values[r])
        };
      }
    }
  }
  return po(t);
}
function Ir(i) {
  const t = typeof i == "string" ? i : i.strings;
  let e = Ts.get(t);
  return e === void 0 && (e = Er(t, typeof i != "string" && !("strTag" in i)), Ts.set(t, e)), e;
}
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function Ei(i) {
  window.dispatchEvent(new CustomEvent(Ji, { detail: i }));
}
let di = "", Li, mo, ui, ts, bo, Rt = new go();
Rt.resolve();
let Ve = 0;
const Rr = (i) => (Ar((t, e) => Lr(bo, t, e)), di = mo = i.sourceLocale, ui = new Set(i.targetLocales), ui.add(i.sourceLocale), ts = i.loadLocale, { getLocale: Fr, setLocale: zr }), Fr = () => di, zr = (i) => {
  if (i === (Li ?? di))
    return Rt.promise;
  if (!ui || !ts)
    throw new Error("Internal error");
  if (!ui.has(i))
    throw new Error("Invalid locale code");
  Ve++;
  const t = Ve;
  return Li = i, Rt.settled && (Rt = new go()), Ei({ status: "loading", loadingLocale: i }), (i === mo ? (
    // We could switch to the source locale synchronously, but we prefer to
    // queue it on a microtask so that switching locales is consistently
    // asynchronous.
    Promise.resolve({ templates: void 0 })
  ) : ts(i)).then((s) => {
    Ve === t && (di = i, Li = void 0, bo = s.templates, Ei({ status: "ready", readyLocale: i }), Rt.resolve());
  }, (s) => {
    Ve === t && (Ei({
      status: "error",
      errorLocale: i,
      errorMessage: s.toString()
    }), Rt.reject(s));
  }), Rt.promise;
};
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const si = globalThis, ds = si.ShadowRoot && (si.ShadyCSS === void 0 || si.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, us = Symbol(), Es = /* @__PURE__ */ new WeakMap();
let _o = class {
  constructor(t, e, s) {
    if (this._$cssResult$ = !0, s !== us) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (ds && t === void 0) {
      const s = e !== void 0 && e.length === 1;
      s && (t = Es.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), s && Es.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Br = (i) => new _o(typeof i == "string" ? i : i + "", void 0, us), ie = (i, ...t) => {
  const e = i.length === 1 ? i[0] : t.reduce((s, n, o) => s + ((r) => {
    if (r._$cssResult$ === !0) return r.cssText;
    if (typeof r == "number") return r;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + r + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(n) + i[o + 1], i[0]);
  return new _o(e, i, us);
}, Nr = (i, t) => {
  if (ds) i.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const s = document.createElement("style"), n = si.litNonce;
    n !== void 0 && s.setAttribute("nonce", n), s.textContent = e.cssText, i.appendChild(s);
  }
}, Ls = ds ? (i) => i : (i) => i instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const s of t.cssRules) e += s.cssText;
  return Br(e);
})(i) : i;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Hr, defineProperty: Vr, getOwnPropertyDescriptor: jr, getOwnPropertyNames: Wr, getOwnPropertySymbols: Ur, getPrototypeOf: Yr } = Object, St = globalThis, Is = St.trustedTypes, Kr = Is ? Is.emptyScript : "", Xr = St.reactiveElementPolyfillSupport, be = (i, t) => i, fi = { toAttribute(i, t) {
  switch (t) {
    case Boolean:
      i = i ? Kr : null;
      break;
    case Object:
    case Array:
      i = i == null ? i : JSON.stringify(i);
  }
  return i;
}, fromAttribute(i, t) {
  let e = i;
  switch (t) {
    case Boolean:
      e = i !== null;
      break;
    case Number:
      e = i === null ? null : Number(i);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(i);
      } catch {
        e = null;
      }
  }
  return e;
} }, fs = (i, t) => !Hr(i, t), Rs = { attribute: !0, type: String, converter: fi, reflect: !1, useDefault: !1, hasChanged: fs };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), St.litPropertyMetadata ?? (St.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let Gt = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = Rs) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const s = Symbol(), n = this.getPropertyDescriptor(t, s, e);
      n !== void 0 && Vr(this.prototype, t, n);
    }
  }
  static getPropertyDescriptor(t, e, s) {
    const { get: n, set: o } = jr(this.prototype, t) ?? { get() {
      return this[e];
    }, set(r) {
      this[e] = r;
    } };
    return { get: n, set(r) {
      const a = n?.call(this);
      o?.call(this, r), this.requestUpdate(t, a, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? Rs;
  }
  static _$Ei() {
    if (this.hasOwnProperty(be("elementProperties"))) return;
    const t = Yr(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(be("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(be("properties"))) {
      const e = this.properties, s = [...Wr(e), ...Ur(e)];
      for (const n of s) this.createProperty(n, e[n]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [s, n] of e) this.elementProperties.set(s, n);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, s] of this.elementProperties) {
      const n = this._$Eu(e, s);
      n !== void 0 && this._$Eh.set(n, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const s = new Set(t.flat(1 / 0).reverse());
      for (const n of s) e.unshift(Ls(n));
    } else t !== void 0 && e.push(Ls(t));
    return e;
  }
  static _$Eu(t, e) {
    const s = e.attribute;
    return s === !1 ? void 0 : typeof s == "string" ? s : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((t) => this.enableUpdating = t), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t) => t(this));
  }
  addController(t) {
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(t), this.renderRoot !== void 0 && this.isConnected && t.hostConnected?.();
  }
  removeController(t) {
    this._$EO?.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), e = this.constructor.elementProperties;
    for (const s of e.keys()) this.hasOwnProperty(s) && (t.set(s, this[s]), delete this[s]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Nr(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), this._$EO?.forEach((t) => t.hostConnected?.());
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t) => t.hostDisconnected?.());
  }
  attributeChangedCallback(t, e, s) {
    this._$AK(t, s);
  }
  _$ET(t, e) {
    const s = this.constructor.elementProperties.get(t), n = this.constructor._$Eu(t, s);
    if (n !== void 0 && s.reflect === !0) {
      const o = (s.converter?.toAttribute !== void 0 ? s.converter : fi).toAttribute(e, s.type);
      this._$Em = t, o == null ? this.removeAttribute(n) : this.setAttribute(n, o), this._$Em = null;
    }
  }
  _$AK(t, e) {
    const s = this.constructor, n = s._$Eh.get(t);
    if (n !== void 0 && this._$Em !== n) {
      const o = s.getPropertyOptions(n), r = typeof o.converter == "function" ? { fromAttribute: o.converter } : o.converter?.fromAttribute !== void 0 ? o.converter : fi;
      this._$Em = n;
      const a = r.fromAttribute(e, o.type);
      this[n] = a ?? this._$Ej?.get(n) ?? a, this._$Em = null;
    }
  }
  requestUpdate(t, e, s, n = !1, o) {
    if (t !== void 0) {
      const r = this.constructor;
      if (n === !1 && (o = this[t]), s ?? (s = r.getPropertyOptions(t)), !((s.hasChanged ?? fs)(o, e) || s.useDefault && s.reflect && o === this._$Ej?.get(t) && !this.hasAttribute(r._$Eu(t, s)))) return;
      this.C(t, e, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: s, reflect: n, wrapped: o }, r) {
    s && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, r ?? e ?? this[t]), o !== !0 || r !== void 0) || (this._$AL.has(t) || (this.hasUpdated || s || (e = void 0), this._$AL.set(t, e)), n === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (e) {
      Promise.reject(e);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [n, o] of this._$Ep) this[n] = o;
        this._$Ep = void 0;
      }
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [n, o] of s) {
        const { wrapped: r } = o, a = this[n];
        r !== !0 || this._$AL.has(n) || a === void 0 || this.C(n, void 0, o, a);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), this._$EO?.forEach((s) => s.hostUpdate?.()), this.update(e)) : this._$EM();
    } catch (s) {
      throw t = !1, this._$EM(), s;
    }
    t && this._$AE(e);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    this._$EO?.forEach((e) => e.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((e) => this._$ET(e, this[e]))), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
Gt.elementStyles = [], Gt.shadowRootOptions = { mode: "open" }, Gt[be("elementProperties")] = /* @__PURE__ */ new Map(), Gt[be("finalized")] = /* @__PURE__ */ new Map(), Xr?.({ ReactiveElement: Gt }), (St.reactiveElementVersions ?? (St.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const _e = globalThis, Fs = (i) => i, pi = _e.trustedTypes, zs = pi ? pi.createPolicy("lit-html", { createHTML: (i) => i }) : void 0, yo = "$lit$", _t = `lit$${Math.random().toFixed(9).slice(2)}$`, xo = "?" + _t, qr = `<${xo}>`, jt = document, Ae = () => jt.createComment(""), Pe = (i) => i === null || typeof i != "object" && typeof i != "function", ps = Array.isArray, Gr = (i) => ps(i) || typeof i?.[Symbol.iterator] == "function", Ii = `[ 	
\f\r]`, ae = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Bs = /-->/g, Ns = />/g, Dt = RegExp(`>|${Ii}(?:([^\\s"'>=/]+)(${Ii}*=${Ii}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Hs = /'/g, Vs = /"/g, vo = /^(?:script|style|textarea|title)$/i, Zr = (i) => (t, ...e) => ({ _$litType$: i, strings: t, values: e }), T = Zr(1), Wt = Symbol.for("lit-noChange"), D = Symbol.for("lit-nothing"), js = /* @__PURE__ */ new WeakMap(), Bt = jt.createTreeWalker(jt, 129);
function wo(i, t) {
  if (!ps(i) || !i.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return zs !== void 0 ? zs.createHTML(t) : t;
}
const Qr = (i, t) => {
  const e = i.length - 1, s = [];
  let n, o = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", r = ae;
  for (let a = 0; a < e; a++) {
    const l = i[a];
    let c, h, d = -1, u = 0;
    for (; u < l.length && (r.lastIndex = u, h = r.exec(l), h !== null); ) u = r.lastIndex, r === ae ? h[1] === "!--" ? r = Bs : h[1] !== void 0 ? r = Ns : h[2] !== void 0 ? (vo.test(h[2]) && (n = RegExp("</" + h[2], "g")), r = Dt) : h[3] !== void 0 && (r = Dt) : r === Dt ? h[0] === ">" ? (r = n ?? ae, d = -1) : h[1] === void 0 ? d = -2 : (d = r.lastIndex - h[2].length, c = h[1], r = h[3] === void 0 ? Dt : h[3] === '"' ? Vs : Hs) : r === Vs || r === Hs ? r = Dt : r === Bs || r === Ns ? r = ae : (r = Dt, n = void 0);
    const f = r === Dt && i[a + 1].startsWith("/>") ? " " : "";
    o += r === ae ? l + qr : d >= 0 ? (s.push(c), l.slice(0, d) + yo + l.slice(d) + _t + f) : l + _t + (d === -2 ? a : f);
  }
  return [wo(i, o + (i[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
};
class $e {
  constructor({ strings: t, _$litType$: e }, s) {
    let n;
    this.parts = [];
    let o = 0, r = 0;
    const a = t.length - 1, l = this.parts, [c, h] = Qr(t, e);
    if (this.el = $e.createElement(c, s), Bt.currentNode = this.el.content, e === 2 || e === 3) {
      const d = this.el.content.firstChild;
      d.replaceWith(...d.childNodes);
    }
    for (; (n = Bt.nextNode()) !== null && l.length < a; ) {
      if (n.nodeType === 1) {
        if (n.hasAttributes()) for (const d of n.getAttributeNames()) if (d.endsWith(yo)) {
          const u = h[r++], f = n.getAttribute(d).split(_t), g = /([.?@])?(.*)/.exec(u);
          l.push({ type: 1, index: o, name: g[2], strings: f, ctor: g[1] === "." ? ta : g[1] === "?" ? ea : g[1] === "@" ? ia : $i }), n.removeAttribute(d);
        } else d.startsWith(_t) && (l.push({ type: 6, index: o }), n.removeAttribute(d));
        if (vo.test(n.tagName)) {
          const d = n.textContent.split(_t), u = d.length - 1;
          if (u > 0) {
            n.textContent = pi ? pi.emptyScript : "";
            for (let f = 0; f < u; f++) n.append(d[f], Ae()), Bt.nextNode(), l.push({ type: 2, index: ++o });
            n.append(d[u], Ae());
          }
        }
      } else if (n.nodeType === 8) if (n.data === xo) l.push({ type: 2, index: o });
      else {
        let d = -1;
        for (; (d = n.data.indexOf(_t, d + 1)) !== -1; ) l.push({ type: 7, index: o }), d += _t.length - 1;
      }
      o++;
    }
  }
  static createElement(t, e) {
    const s = jt.createElement("template");
    return s.innerHTML = t, s;
  }
}
function Qt(i, t, e = i, s) {
  if (t === Wt) return t;
  let n = s !== void 0 ? e._$Co?.[s] : e._$Cl;
  const o = Pe(t) ? void 0 : t._$litDirective$;
  return n?.constructor !== o && (n?._$AO?.(!1), o === void 0 ? n = void 0 : (n = new o(i), n._$AT(i, e, s)), s !== void 0 ? (e._$Co ?? (e._$Co = []))[s] = n : e._$Cl = n), n !== void 0 && (t = Qt(i, n._$AS(i, t.values), n, s)), t;
}
class Jr {
  constructor(t, e) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = e;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: e }, parts: s } = this._$AD, n = (t?.creationScope ?? jt).importNode(e, !0);
    Bt.currentNode = n;
    let o = Bt.nextNode(), r = 0, a = 0, l = s[0];
    for (; l !== void 0; ) {
      if (r === l.index) {
        let c;
        l.type === 2 ? c = new se(o, o.nextSibling, this, t) : l.type === 1 ? c = new l.ctor(o, l.name, l.strings, this, t) : l.type === 6 && (c = new sa(o, this, t)), this._$AV.push(c), l = s[++a];
      }
      r !== l?.index && (o = Bt.nextNode(), r++);
    }
    return Bt.currentNode = jt, n;
  }
  p(t) {
    let e = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(t, s, e), e += s.strings.length - 2) : s._$AI(t[e])), e++;
  }
}
class se {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, e, s, n) {
    this.type = 2, this._$AH = D, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = s, this.options = n, this._$Cv = n?.isConnected ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const e = this._$AM;
    return e !== void 0 && t?.nodeType === 11 && (t = e.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, e = this) {
    t = Qt(this, t, e), Pe(t) ? t === D || t == null || t === "" ? (this._$AH !== D && this._$AR(), this._$AH = D) : t !== this._$AH && t !== Wt && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Gr(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== D && Pe(this._$AH) ? this._$AA.nextSibling.data = t : this.T(jt.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: e, _$litType$: s } = t, n = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = $e.createElement(wo(s.h, s.h[0]), this.options)), s);
    if (this._$AH?._$AD === n) this._$AH.p(e);
    else {
      const o = new Jr(n, this), r = o.u(this.options);
      o.p(e), this.T(r), this._$AH = o;
    }
  }
  _$AC(t) {
    let e = js.get(t.strings);
    return e === void 0 && js.set(t.strings, e = new $e(t)), e;
  }
  k(t) {
    ps(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let s, n = 0;
    for (const o of t) n === e.length ? e.push(s = new se(this.O(Ae()), this.O(Ae()), this, this.options)) : s = e[n], s._$AI(o), n++;
    n < e.length && (this._$AR(s && s._$AB.nextSibling, n), e.length = n);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    for (this._$AP?.(!1, !0, e); t !== this._$AB; ) {
      const s = Fs(t).nextSibling;
      Fs(t).remove(), t = s;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class $i {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, s, n, o) {
    this.type = 1, this._$AH = D, this._$AN = void 0, this.element = t, this.name = e, this._$AM = n, this.options = o, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = D;
  }
  _$AI(t, e = this, s, n) {
    const o = this.strings;
    let r = !1;
    if (o === void 0) t = Qt(this, t, e, 0), r = !Pe(t) || t !== this._$AH && t !== Wt, r && (this._$AH = t);
    else {
      const a = t;
      let l, c;
      for (t = o[0], l = 0; l < o.length - 1; l++) c = Qt(this, a[s + l], e, l), c === Wt && (c = this._$AH[l]), r || (r = !Pe(c) || c !== this._$AH[l]), c === D ? t = D : t !== D && (t += (c ?? "") + o[l + 1]), this._$AH[l] = c;
    }
    r && !n && this.j(t);
  }
  j(t) {
    t === D ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class ta extends $i {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === D ? void 0 : t;
  }
}
class ea extends $i {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== D);
  }
}
class ia extends $i {
  constructor(t, e, s, n, o) {
    super(t, e, s, n, o), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = Qt(this, t, e, 0) ?? D) === Wt) return;
    const s = this._$AH, n = t === D && s !== D || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, o = t !== D && (s === D || n);
    n && this.element.removeEventListener(this.name, this, s), o && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class sa {
  constructor(t, e, s) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    Qt(this, t);
  }
}
const na = { I: se }, oa = _e.litHtmlPolyfillSupport;
oa?.($e, se), (_e.litHtmlVersions ?? (_e.litHtmlVersions = [])).push("3.3.3");
const ra = (i, t, e) => {
  const s = e?.renderBefore ?? t;
  let n = s._$litPart$;
  if (n === void 0) {
    const o = e?.renderBefore ?? null;
    s._$litPart$ = n = new se(t.insertBefore(Ae(), o), o, void 0, e ?? {});
  }
  return n._$AI(i), n;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ye = globalThis;
let gt = class extends Gt {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var e;
    const t = super.createRenderRoot();
    return (e = this.renderOptions).renderBefore ?? (e.renderBefore = t.firstChild), t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = ra(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return Wt;
  }
};
gt._$litElement$ = !0, gt.finalized = !0, ye.litElementHydrateSupport?.({ LitElement: gt });
const aa = ye.litElementPolyfillSupport;
aa?.({ LitElement: gt });
(ye.litElementVersions ?? (ye.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Re = (i) => (t, e) => {
  e !== void 0 ? e.addInitializer(() => {
    customElements.define(i, t);
  }) : customElements.define(i, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const la = { attribute: !0, type: String, converter: fi, reflect: !1, hasChanged: fs }, ca = (i = la, t, e) => {
  const { kind: s, metadata: n } = e;
  let o = globalThis.litPropertyMetadata.get(n);
  if (o === void 0 && globalThis.litPropertyMetadata.set(n, o = /* @__PURE__ */ new Map()), s === "setter" && ((i = Object.create(i)).wrapped = !0), o.set(e.name, i), s === "accessor") {
    const { name: r } = e;
    return { set(a) {
      const l = t.get.call(this);
      t.set.call(this, a), this.requestUpdate(r, l, i, !0, a);
    }, init(a) {
      return a !== void 0 && this.C(r, void 0, i, a), a;
    } };
  }
  if (s === "setter") {
    const { name: r } = e;
    return function(a) {
      const l = this[r];
      t.call(this, a), this.requestUpdate(r, l, i, !0, a);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function Y(i) {
  return (t, e) => typeof e == "object" ? ca(i, t, e) : ((s, n, o) => {
    const r = n.hasOwnProperty(o);
    return n.constructor.createProperty(o, s), r ? Object.getOwnPropertyDescriptor(n, o) : void 0;
  })(i, t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function q(i) {
  return Y({ ...i, state: !0, attribute: !1 });
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ha = (i, t, e) => (e.configurable = !0, e.enumerable = !0, Reflect.decorate && typeof t != "object" && Object.defineProperty(i, t, e), e);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function da(i, t) {
  return (e, s, n) => {
    const o = (r) => r.renderRoot?.querySelector(i) ?? null;
    return ha(e, s, { get() {
      return o(this);
    } });
  };
}
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function* ni(i, t) {
  if (i !== void 0) {
    let e = 0;
    for (const s of i) yield t(s, e++);
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const So = { CHILD: 2 }, ko = (i) => (...t) => ({ _$litDirective$: i, values: t });
let Mo = class {
  constructor(t) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(t, e, s) {
    this._$Ct = t, this._$AM = e, this._$Ci = s;
  }
  _$AS(t, e) {
    return this.update(t, e);
  }
  update(t, e) {
    return this.render(...e);
  }
};
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { I: ua } = na, Ws = (i) => i, fa = (i) => i.strings === void 0, Us = () => document.createComment(""), le = (i, t, e) => {
  const s = i._$AA.parentNode, n = t === void 0 ? i._$AB : t._$AA;
  if (e === void 0) {
    const o = s.insertBefore(Us(), n), r = s.insertBefore(Us(), n);
    e = new ua(o, r, i, i.options);
  } else {
    const o = e._$AB.nextSibling, r = e._$AM, a = r !== i;
    if (a) {
      let l;
      e._$AQ?.(i), e._$AM = i, e._$AP !== void 0 && (l = i._$AU) !== r._$AU && e._$AP(l);
    }
    if (o !== n || a) {
      let l = e._$AA;
      for (; l !== o; ) {
        const c = Ws(l).nextSibling;
        Ws(s).insertBefore(l, n), l = c;
      }
    }
  }
  return e;
}, Tt = (i, t, e = i) => (i._$AI(t, e), i), pa = {}, ga = (i, t = pa) => i._$AH = t, ma = (i) => i._$AH, Ri = (i) => {
  i._$AR(), i._$AA.remove();
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ys = (i, t, e) => {
  const s = /* @__PURE__ */ new Map();
  for (let n = t; n <= e; n++) s.set(i[n], n);
  return s;
}, ba = ko(class extends Mo {
  constructor(i) {
    if (super(i), i.type !== So.CHILD) throw Error("repeat() can only be used in text expressions");
  }
  dt(i, t, e) {
    let s;
    e === void 0 ? e = t : t !== void 0 && (s = t);
    const n = [], o = [];
    let r = 0;
    for (const a of i) n[r] = s ? s(a, r) : r, o[r] = e(a, r), r++;
    return { values: o, keys: n };
  }
  render(i, t, e) {
    return this.dt(i, t, e).values;
  }
  update(i, [t, e, s]) {
    const n = ma(i), { values: o, keys: r } = this.dt(t, e, s);
    if (!Array.isArray(n)) return this.ut = r, o;
    const a = this.ut ?? (this.ut = []), l = [];
    let c, h, d = 0, u = n.length - 1, f = 0, g = o.length - 1;
    for (; d <= u && f <= g; ) if (n[d] === null) d++;
    else if (n[u] === null) u--;
    else if (a[d] === r[f]) l[f] = Tt(n[d], o[f]), d++, f++;
    else if (a[u] === r[g]) l[g] = Tt(n[u], o[g]), u--, g--;
    else if (a[d] === r[g]) l[g] = Tt(n[d], o[g]), le(i, l[g + 1], n[d]), d++, g--;
    else if (a[u] === r[f]) l[f] = Tt(n[u], o[f]), le(i, n[d], n[u]), u--, f++;
    else if (c === void 0 && (c = Ys(r, f, g), h = Ys(a, d, u)), c.has(a[d])) if (c.has(a[u])) {
      const p = h.get(r[f]), m = p !== void 0 ? n[p] : null;
      if (m === null) {
        const b = le(i, n[d]);
        Tt(b, o[f]), l[f] = b;
      } else l[f] = Tt(m, o[f]), le(i, n[d], m), n[p] = null;
      f++;
    } else Ri(n[u]), u--;
    else Ri(n[d]), d++;
    for (; f <= g; ) {
      const p = le(i, l[g + 1]);
      Tt(p, o[f]), l[f++] = p;
    }
    for (; d <= u; ) {
      const p = n[d++];
      p !== null && Ri(p);
    }
    return this.ut = r, ga(i, l), Wt;
  }
}), _a = {
  s059ab0c93ac06045: "Kein Endpunkt konfiguriert.",
  s099b18e1bd8a1154: "Stunden",
  s1e118319b5202c41: "Mo",
  s397e5e9f566d2434: "Keine Daten im ausgewählten Zeitraum.",
  s5cf1605225daef5f: "Bericht konnte nicht geladen werden.",
  s6cfed919e21ac6ac: "Do",
  s6d24cd19e23b8185: "Di",
  s6ebc9bd6feae62a3: "Wird geladen…",
  s74aa0319e62b2eb7: "Mi",
  s8837e7420b616a47: "Bericht wird geladen…",
  s9836b719fa8ef857: "Sa",
  s987ac119fac8d621: "So",
  sa47b660ae8e7a832: "Wochentage",
  sad8f83df9312b389: "Zweigstellen",
  sae1c7f13b7c0c47f: "Start",
  sb8f855b49234b81b: "Anwenden",
  sd8f923198e0c5c6a: "Ende",
  sf295af199c723ec8: "Fr",
  sfcc627c0017112af: "Benutzerkategorien"
}, ya = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  templates: _a
}, Symbol.toStringTag, { value: "Module" })), xa = {
  s059ab0c93ac06045: "Kein Endpunkt konfiguriert.",
  s099b18e1bd8a1154: "Stunden",
  s1e118319b5202c41: "Mo",
  s397e5e9f566d2434: "Keine Daten im ausgewählten Zeitraum.",
  s5cf1605225daef5f: "Bericht konnte nicht geladen werden.",
  s6cfed919e21ac6ac: "Do",
  s6d24cd19e23b8185: "Di",
  s6ebc9bd6feae62a3: "Wird geladen…",
  s74aa0319e62b2eb7: "Mi",
  s8837e7420b616a47: "Bericht wird geladen…",
  s9836b719fa8ef857: "Sa",
  s987ac119fac8d621: "So",
  sa47b660ae8e7a832: "Wochentage",
  sad8f83df9312b389: "Zweigstellen",
  sae1c7f13b7c0c47f: "Start",
  sb8f855b49234b81b: "Anwenden",
  sd8f923198e0c5c6a: "Ende",
  sf295af199c723ec8: "Fr",
  sfcc627c0017112af: "Benutzerkategorien"
}, va = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  templates: xa
}, Symbol.toStringTag, { value: "Module" })), Ao = "en", Po = [
  "de",
  "de-DE"
], wa = {
  de: ya,
  "de-DE": va
}, { setLocale: Sa } = Rr({
  sourceLocale: Ao,
  targetLocales: Po,
  loadLocale: (i) => {
    const t = wa[i];
    return t ? Promise.resolve(t) : Promise.reject(new Error(`Unknown locale: ${i}`));
  }
});
async function ka() {
  const i = (document.documentElement.lang || "").trim();
  if (!i) return;
  const t = [i, i.split("-")[0]].filter(
    (e, s, n) => e && n.indexOf(e) === s
  );
  for (const e of t) {
    if (e === Ao) return;
    if (Po.includes(e)) {
      await Sa(e);
      return;
    }
  }
}
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function kt(i, t, e) {
  return i ? t(i) : e?.(i);
}
const Fe = ie`
  :host {
    /* Chart / counter accent — Koha intranet brand green. */
    --lms-report-accent: #408540;
    --lms-report-accent-fg: #ffffff;
    --lms-report-accent-soft: #6faf44;

    /* Koha primary action color (intranet btn-primary). */
    --lms-report-button-bg: #ffc32b;
    --lms-report-button-bg-hover: #ffd15e;
    --lms-report-button-border: #ffc32b;
    --lms-report-button-fg: #000000;
    --lms-report-button-radius: 4px;

    --lms-report-fg: #000000;
    --lms-report-muted: #555555;
    --lms-report-font: -apple-system, "Segoe UI", Roboto,
      "Helvetica Neue", "Noto Sans", "Liberation Sans", Arial, sans-serif;

    --lms-report-card-bg: #ffffff;
    --lms-report-card-fg: var(--lms-report-fg);
    --lms-report-card-border: #d6d6d6;
    --lms-report-card-radius: 0.5rem;
    --lms-report-card-padding: 1.25rem;

    --lms-report-filters-bg: #f4f8f9;
    --lms-report-filters-border: #b9d8d9;
    --lms-report-input-bg: #ffffff;
    --lms-report-input-border: #bcbcbc;
    --lms-report-input-radius: 4px;

    --lms-report-chart-height: 16rem;

    --lms-report-counter-size: 2.5rem;
    --lms-report-counter-fg: var(--lms-report-accent);

    --lms-report-error-bg: #fdecea;
    --lms-report-error-border: #f5a8a0;
    --lms-report-error-fg: #842029;

    color: var(--lms-report-fg);
    font-family: var(--lms-report-font);
  }
`, gs = ie`
  :host {
    display: block;
    padding: var(--lms-report-card-padding);
    background: var(--lms-report-card-bg);
    border: 1px solid var(--lms-report-card-border);
    border-radius: var(--lms-report-card-radius);
    color: var(--lms-report-card-fg);
  }

  .label {
    margin: 0 0 0.25rem;
    font-size: 1rem;
    font-weight: 600;
  }

  .description {
    margin: 0 0 0.75rem;
    font-size: 0.85rem;
    color: var(--lms-report-muted);
  }

  .empty {
    padding: 1.5rem 0;
    text-align: center;
    color: var(--lms-report-muted);
    font-size: 0.9rem;
  }

  .chart-wrap {
    position: relative;
    height: var(--lms-report-chart-height);
  }
`, $o = ie`
  .field {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    font-size: 0.85rem;
  }
  .field label {
    font-weight: normal;
    color: var(--lms-report-fg);
  }
  .field input,
  .field select {
    font: inherit;
    padding: 0.35rem 0.55rem;
    border: 1px solid var(--lms-report-input-border);
    border-radius: var(--lms-report-input-radius);
    background: var(--lms-report-input-bg);
    color: inherit;
    min-width: 9rem;
    line-height: 1.42857143;
  }
  .field select[multiple] {
    min-height: 5.5rem;
  }
`;
var Ma = Object.defineProperty, Aa = Object.getOwnPropertyDescriptor, Co = (i, t, e, s) => {
  for (var n = s > 1 ? void 0 : s ? Aa(t, e) : t, o = i.length - 1, r; o >= 0; o--)
    (r = i[o]) && (n = (s ? r(t, e, n) : r(n)) || n);
  return s && n && Ma(t, e, n), n;
};
let gi = class extends gt {
  constructor() {
    super(), Ie(this);
  }
  render() {
    return kt(
      this.metric,
      (i) => T`
        <div class="value" aria-label=${i.label}>
          ${this._formatValue(i.value)}
        </div>
        <div class="label">${i.label}</div>
        ${kt(
        i.description,
        () => T`<div class="description">${i.description}</div>`
      )}
      `,
      () => D
    );
  }
  _formatValue(i) {
    try {
      return new Intl.NumberFormat(this._locale()).format(i);
    } catch {
      return String(i);
    }
  }
  _locale() {
    return document.documentElement.lang || navigator.language || "en";
  }
};
gi.styles = [
  Fe,
  gs,
  ie`
      .value {
        font-size: var(--lms-report-counter-size);
        font-weight: 600;
        line-height: 1.1;
        color: var(--lms-report-counter-fg);
      }
      .label {
        margin-top: 0.5rem;
      }
      .description {
        margin: 0.25rem 0 0;
      }
    `
];
Co([
  Y({ attribute: !1 })
], gi.prototype, "metric", 2);
gi = Co([
  Re("lms-report-counter")
], gi);
var Pa = Object.defineProperty, $a = Object.getOwnPropertyDescriptor, mt = (i, t, e, s) => {
  for (var n = s > 1 ? void 0 : s ? $a(t, e) : t, o = i.length - 1, r; o >= 0; o--)
    (r = i[o]) && (n = (s ? r(t, e, n) : r(n)) || n);
  return s && n && Pa(t, e, n), n;
};
let et = class extends gt {
  constructor() {
    super(), this.name = "", this.label = "", this.endpoint = "", this.valueKey = "", this.labelKey = "name", this.selected = "", this._options = [], this._pending = [], Ie(this);
  }
  connectedCallback() {
    super.connectedCallback(), this._pending = this.selected ? this.selected.split(",").filter((i) => i.length > 0) : [], this.endpoint && this._fetchOptions();
  }
  get filterName() {
    return this.name;
  }
  filterValues() {
    return [...this._pending];
  }
  filterReset() {
    this._pending = [];
  }
  render() {
    return this.name ? T`
      <div class="field" part="field">
        <label for="select">${this.label || this.name}</label>
        <select
          id="select"
          multiple
          @change=${this._onChange}
          ?disabled=${this._options.length === 0}
        >
          ${ni(
      this._options,
      (i) => T`
              <option
                value=${i.value}
                ?selected=${this._pending.includes(i.value)}
              >
                ${i.label}
              </option>
            `
    )}
        </select>
        ${this._options.length === 0 && this.endpoint ? T`<small>${E("Loading…")}</small>` : D}
      </div>
    ` : D;
  }
  _onChange(i) {
    const t = i.target;
    this._pending = Array.from(t.selectedOptions, (e) => e.value), this.dispatchEvent(
      new CustomEvent("lms-filter-change", {
        detail: { name: this.name, values: this._pending },
        bubbles: !0,
        composed: !0
      })
    );
  }
  async _fetchOptions() {
    try {
      const i = await fetch(this.endpoint, {
        method: "GET",
        credentials: "include",
        headers: { Accept: "application/json" }
      });
      if (!i.ok) return;
      const t = await i.json(), e = this.valueKey || this.name;
      this._options = t.map((s) => ({
        value: String(s[e] ?? ""),
        label: String(s[this.labelKey] ?? s[e] ?? "")
      })).filter((s) => s.value !== "").sort((s, n) => s.label.localeCompare(n.label));
    } catch {
    }
  }
};
et.styles = [
  Fe,
  $o,
  ie`
      :host {
        display: contents;
      }
    `
];
mt([
  Y({ type: String })
], et.prototype, "name", 2);
mt([
  Y({ type: String })
], et.prototype, "label", 2);
mt([
  Y({ type: String })
], et.prototype, "endpoint", 2);
mt([
  Y({ type: String, attribute: "value-key" })
], et.prototype, "valueKey", 2);
mt([
  Y({ type: String, attribute: "label-key" })
], et.prototype, "labelKey", 2);
mt([
  Y({ type: String })
], et.prototype, "selected", 2);
mt([
  q()
], et.prototype, "_options", 2);
mt([
  q()
], et.prototype, "_pending", 2);
et = mt([
  Re("lms-report-filter-multiselect")
], et);
/*!
 * @kurkle/color v0.3.4
 * https://github.com/kurkle/color#readme
 * (c) 2024 Jukka Kurkela
 * Released under the MIT License
 */
function ze(i) {
  return i + 0.5 | 0;
}
const yt = (i, t, e) => Math.max(Math.min(i, e), t);
function pe(i) {
  return yt(ze(i * 2.55), 0, 255);
}
function Mt(i) {
  return yt(ze(i * 255), 0, 255);
}
function pt(i) {
  return yt(ze(i / 2.55) / 100, 0, 1);
}
function Ks(i) {
  return yt(ze(i * 100), 0, 100);
}
const Q = { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, A: 10, B: 11, C: 12, D: 13, E: 14, F: 15, a: 10, b: 11, c: 12, d: 13, e: 14, f: 15 }, es = [..."0123456789ABCDEF"], Ca = (i) => es[i & 15], Oa = (i) => es[(i & 240) >> 4] + es[i & 15], je = (i) => (i & 240) >> 4 === (i & 15), Da = (i) => je(i.r) && je(i.g) && je(i.b) && je(i.a);
function Ta(i) {
  var t = i.length, e;
  return i[0] === "#" && (t === 4 || t === 5 ? e = {
    r: 255 & Q[i[1]] * 17,
    g: 255 & Q[i[2]] * 17,
    b: 255 & Q[i[3]] * 17,
    a: t === 5 ? Q[i[4]] * 17 : 255
  } : (t === 7 || t === 9) && (e = {
    r: Q[i[1]] << 4 | Q[i[2]],
    g: Q[i[3]] << 4 | Q[i[4]],
    b: Q[i[5]] << 4 | Q[i[6]],
    a: t === 9 ? Q[i[7]] << 4 | Q[i[8]] : 255
  })), e;
}
const Ea = (i, t) => i < 255 ? t(i) : "";
function La(i) {
  var t = Da(i) ? Ca : Oa;
  return i ? "#" + t(i.r) + t(i.g) + t(i.b) + Ea(i.a, t) : void 0;
}
const Ia = /^(hsla?|hwb|hsv)\(\s*([-+.e\d]+)(?:deg)?[\s,]+([-+.e\d]+)%[\s,]+([-+.e\d]+)%(?:[\s,]+([-+.e\d]+)(%)?)?\s*\)$/;
function Oo(i, t, e) {
  const s = t * Math.min(e, 1 - e), n = (o, r = (o + i / 30) % 12) => e - s * Math.max(Math.min(r - 3, 9 - r, 1), -1);
  return [n(0), n(8), n(4)];
}
function Ra(i, t, e) {
  const s = (n, o = (n + i / 60) % 6) => e - e * t * Math.max(Math.min(o, 4 - o, 1), 0);
  return [s(5), s(3), s(1)];
}
function Fa(i, t, e) {
  const s = Oo(i, 1, 0.5);
  let n;
  for (t + e > 1 && (n = 1 / (t + e), t *= n, e *= n), n = 0; n < 3; n++)
    s[n] *= 1 - t - e, s[n] += t;
  return s;
}
function za(i, t, e, s, n) {
  return i === n ? (t - e) / s + (t < e ? 6 : 0) : t === n ? (e - i) / s + 2 : (i - t) / s + 4;
}
function ms(i) {
  const e = i.r / 255, s = i.g / 255, n = i.b / 255, o = Math.max(e, s, n), r = Math.min(e, s, n), a = (o + r) / 2;
  let l, c, h;
  return o !== r && (h = o - r, c = a > 0.5 ? h / (2 - o - r) : h / (o + r), l = za(e, s, n, h, o), l = l * 60 + 0.5), [l | 0, c || 0, a];
}
function bs(i, t, e, s) {
  return (Array.isArray(t) ? i(t[0], t[1], t[2]) : i(t, e, s)).map(Mt);
}
function _s(i, t, e) {
  return bs(Oo, i, t, e);
}
function Ba(i, t, e) {
  return bs(Fa, i, t, e);
}
function Na(i, t, e) {
  return bs(Ra, i, t, e);
}
function Do(i) {
  return (i % 360 + 360) % 360;
}
function Ha(i) {
  const t = Ia.exec(i);
  let e = 255, s;
  if (!t)
    return;
  t[5] !== s && (e = t[6] ? pe(+t[5]) : Mt(+t[5]));
  const n = Do(+t[2]), o = +t[3] / 100, r = +t[4] / 100;
  return t[1] === "hwb" ? s = Ba(n, o, r) : t[1] === "hsv" ? s = Na(n, o, r) : s = _s(n, o, r), {
    r: s[0],
    g: s[1],
    b: s[2],
    a: e
  };
}
function Va(i, t) {
  var e = ms(i);
  e[0] = Do(e[0] + t), e = _s(e), i.r = e[0], i.g = e[1], i.b = e[2];
}
function ja(i) {
  if (!i)
    return;
  const t = ms(i), e = t[0], s = Ks(t[1]), n = Ks(t[2]);
  return i.a < 255 ? `hsla(${e}, ${s}%, ${n}%, ${pt(i.a)})` : `hsl(${e}, ${s}%, ${n}%)`;
}
const Xs = {
  x: "dark",
  Z: "light",
  Y: "re",
  X: "blu",
  W: "gr",
  V: "medium",
  U: "slate",
  A: "ee",
  T: "ol",
  S: "or",
  B: "ra",
  C: "lateg",
  D: "ights",
  R: "in",
  Q: "turquois",
  E: "hi",
  P: "ro",
  O: "al",
  N: "le",
  M: "de",
  L: "yello",
  F: "en",
  K: "ch",
  G: "arks",
  H: "ea",
  I: "ightg",
  J: "wh"
}, qs = {
  OiceXe: "f0f8ff",
  antiquewEte: "faebd7",
  aqua: "ffff",
  aquamarRe: "7fffd4",
  azuY: "f0ffff",
  beige: "f5f5dc",
  bisque: "ffe4c4",
  black: "0",
  blanKedOmond: "ffebcd",
  Xe: "ff",
  XeviTet: "8a2be2",
  bPwn: "a52a2a",
  burlywood: "deb887",
  caMtXe: "5f9ea0",
  KartYuse: "7fff00",
  KocTate: "d2691e",
  cSO: "ff7f50",
  cSnflowerXe: "6495ed",
  cSnsilk: "fff8dc",
  crimson: "dc143c",
  cyan: "ffff",
  xXe: "8b",
  xcyan: "8b8b",
  xgTMnPd: "b8860b",
  xWay: "a9a9a9",
  xgYF: "6400",
  xgYy: "a9a9a9",
  xkhaki: "bdb76b",
  xmagFta: "8b008b",
  xTivegYF: "556b2f",
  xSange: "ff8c00",
  xScEd: "9932cc",
  xYd: "8b0000",
  xsOmon: "e9967a",
  xsHgYF: "8fbc8f",
  xUXe: "483d8b",
  xUWay: "2f4f4f",
  xUgYy: "2f4f4f",
  xQe: "ced1",
  xviTet: "9400d3",
  dAppRk: "ff1493",
  dApskyXe: "bfff",
  dimWay: "696969",
  dimgYy: "696969",
  dodgerXe: "1e90ff",
  fiYbrick: "b22222",
  flSOwEte: "fffaf0",
  foYstWAn: "228b22",
  fuKsia: "ff00ff",
  gaRsbSo: "dcdcdc",
  ghostwEte: "f8f8ff",
  gTd: "ffd700",
  gTMnPd: "daa520",
  Way: "808080",
  gYF: "8000",
  gYFLw: "adff2f",
  gYy: "808080",
  honeyMw: "f0fff0",
  hotpRk: "ff69b4",
  RdianYd: "cd5c5c",
  Rdigo: "4b0082",
  ivSy: "fffff0",
  khaki: "f0e68c",
  lavFMr: "e6e6fa",
  lavFMrXsh: "fff0f5",
  lawngYF: "7cfc00",
  NmoncEffon: "fffacd",
  ZXe: "add8e6",
  ZcSO: "f08080",
  Zcyan: "e0ffff",
  ZgTMnPdLw: "fafad2",
  ZWay: "d3d3d3",
  ZgYF: "90ee90",
  ZgYy: "d3d3d3",
  ZpRk: "ffb6c1",
  ZsOmon: "ffa07a",
  ZsHgYF: "20b2aa",
  ZskyXe: "87cefa",
  ZUWay: "778899",
  ZUgYy: "778899",
  ZstAlXe: "b0c4de",
  ZLw: "ffffe0",
  lime: "ff00",
  limegYF: "32cd32",
  lRF: "faf0e6",
  magFta: "ff00ff",
  maPon: "800000",
  VaquamarRe: "66cdaa",
  VXe: "cd",
  VScEd: "ba55d3",
  VpurpN: "9370db",
  VsHgYF: "3cb371",
  VUXe: "7b68ee",
  VsprRggYF: "fa9a",
  VQe: "48d1cc",
  VviTetYd: "c71585",
  midnightXe: "191970",
  mRtcYam: "f5fffa",
  mistyPse: "ffe4e1",
  moccasR: "ffe4b5",
  navajowEte: "ffdead",
  navy: "80",
  Tdlace: "fdf5e6",
  Tive: "808000",
  TivedBb: "6b8e23",
  Sange: "ffa500",
  SangeYd: "ff4500",
  ScEd: "da70d6",
  pOegTMnPd: "eee8aa",
  pOegYF: "98fb98",
  pOeQe: "afeeee",
  pOeviTetYd: "db7093",
  papayawEp: "ffefd5",
  pHKpuff: "ffdab9",
  peru: "cd853f",
  pRk: "ffc0cb",
  plum: "dda0dd",
  powMrXe: "b0e0e6",
  purpN: "800080",
  YbeccapurpN: "663399",
  Yd: "ff0000",
  Psybrown: "bc8f8f",
  PyOXe: "4169e1",
  saddNbPwn: "8b4513",
  sOmon: "fa8072",
  sandybPwn: "f4a460",
  sHgYF: "2e8b57",
  sHshell: "fff5ee",
  siFna: "a0522d",
  silver: "c0c0c0",
  skyXe: "87ceeb",
  UXe: "6a5acd",
  UWay: "708090",
  UgYy: "708090",
  snow: "fffafa",
  sprRggYF: "ff7f",
  stAlXe: "4682b4",
  tan: "d2b48c",
  teO: "8080",
  tEstN: "d8bfd8",
  tomato: "ff6347",
  Qe: "40e0d0",
  viTet: "ee82ee",
  JHt: "f5deb3",
  wEte: "ffffff",
  wEtesmoke: "f5f5f5",
  Lw: "ffff00",
  LwgYF: "9acd32"
};
function Wa() {
  const i = {}, t = Object.keys(qs), e = Object.keys(Xs);
  let s, n, o, r, a;
  for (s = 0; s < t.length; s++) {
    for (r = a = t[s], n = 0; n < e.length; n++)
      o = e[n], a = a.replace(o, Xs[o]);
    o = parseInt(qs[r], 16), i[a] = [o >> 16 & 255, o >> 8 & 255, o & 255];
  }
  return i;
}
let We;
function Ua(i) {
  We || (We = Wa(), We.transparent = [0, 0, 0, 0]);
  const t = We[i.toLowerCase()];
  return t && {
    r: t[0],
    g: t[1],
    b: t[2],
    a: t.length === 4 ? t[3] : 255
  };
}
const Ya = /^rgba?\(\s*([-+.\d]+)(%)?[\s,]+([-+.e\d]+)(%)?[\s,]+([-+.e\d]+)(%)?(?:[\s,/]+([-+.e\d]+)(%)?)?\s*\)$/;
function Ka(i) {
  const t = Ya.exec(i);
  let e = 255, s, n, o;
  if (t) {
    if (t[7] !== s) {
      const r = +t[7];
      e = t[8] ? pe(r) : yt(r * 255, 0, 255);
    }
    return s = +t[1], n = +t[3], o = +t[5], s = 255 & (t[2] ? pe(s) : yt(s, 0, 255)), n = 255 & (t[4] ? pe(n) : yt(n, 0, 255)), o = 255 & (t[6] ? pe(o) : yt(o, 0, 255)), {
      r: s,
      g: n,
      b: o,
      a: e
    };
  }
}
function Xa(i) {
  return i && (i.a < 255 ? `rgba(${i.r}, ${i.g}, ${i.b}, ${pt(i.a)})` : `rgb(${i.r}, ${i.g}, ${i.b})`);
}
const Fi = (i) => i <= 31308e-7 ? i * 12.92 : Math.pow(i, 1 / 2.4) * 1.055 - 0.055, qt = (i) => i <= 0.04045 ? i / 12.92 : Math.pow((i + 0.055) / 1.055, 2.4);
function qa(i, t, e) {
  const s = qt(pt(i.r)), n = qt(pt(i.g)), o = qt(pt(i.b));
  return {
    r: Mt(Fi(s + e * (qt(pt(t.r)) - s))),
    g: Mt(Fi(n + e * (qt(pt(t.g)) - n))),
    b: Mt(Fi(o + e * (qt(pt(t.b)) - o))),
    a: i.a + e * (t.a - i.a)
  };
}
function Ue(i, t, e) {
  if (i) {
    let s = ms(i);
    s[t] = Math.max(0, Math.min(s[t] + s[t] * e, t === 0 ? 360 : 1)), s = _s(s), i.r = s[0], i.g = s[1], i.b = s[2];
  }
}
function To(i, t) {
  return i && Object.assign(t || {}, i);
}
function Gs(i) {
  var t = { r: 0, g: 0, b: 0, a: 255 };
  return Array.isArray(i) ? i.length >= 3 && (t = { r: i[0], g: i[1], b: i[2], a: 255 }, i.length > 3 && (t.a = Mt(i[3]))) : (t = To(i, { r: 0, g: 0, b: 0, a: 1 }), t.a = Mt(t.a)), t;
}
function Ga(i) {
  return i.charAt(0) === "r" ? Ka(i) : Ha(i);
}
class Ce {
  constructor(t) {
    if (t instanceof Ce)
      return t;
    const e = typeof t;
    let s;
    e === "object" ? s = Gs(t) : e === "string" && (s = Ta(t) || Ua(t) || Ga(t)), this._rgb = s, this._valid = !!s;
  }
  get valid() {
    return this._valid;
  }
  get rgb() {
    var t = To(this._rgb);
    return t && (t.a = pt(t.a)), t;
  }
  set rgb(t) {
    this._rgb = Gs(t);
  }
  rgbString() {
    return this._valid ? Xa(this._rgb) : void 0;
  }
  hexString() {
    return this._valid ? La(this._rgb) : void 0;
  }
  hslString() {
    return this._valid ? ja(this._rgb) : void 0;
  }
  mix(t, e) {
    if (t) {
      const s = this.rgb, n = t.rgb;
      let o;
      const r = e === o ? 0.5 : e, a = 2 * r - 1, l = s.a - n.a, c = ((a * l === -1 ? a : (a + l) / (1 + a * l)) + 1) / 2;
      o = 1 - c, s.r = 255 & c * s.r + o * n.r + 0.5, s.g = 255 & c * s.g + o * n.g + 0.5, s.b = 255 & c * s.b + o * n.b + 0.5, s.a = r * s.a + (1 - r) * n.a, this.rgb = s;
    }
    return this;
  }
  interpolate(t, e) {
    return t && (this._rgb = qa(this._rgb, t._rgb, e)), this;
  }
  clone() {
    return new Ce(this.rgb);
  }
  alpha(t) {
    return this._rgb.a = Mt(t), this;
  }
  clearer(t) {
    const e = this._rgb;
    return e.a *= 1 - t, this;
  }
  greyscale() {
    const t = this._rgb, e = ze(t.r * 0.3 + t.g * 0.59 + t.b * 0.11);
    return t.r = t.g = t.b = e, this;
  }
  opaquer(t) {
    const e = this._rgb;
    return e.a *= 1 + t, this;
  }
  negate() {
    const t = this._rgb;
    return t.r = 255 - t.r, t.g = 255 - t.g, t.b = 255 - t.b, this;
  }
  lighten(t) {
    return Ue(this._rgb, 2, t), this;
  }
  darken(t) {
    return Ue(this._rgb, 2, -t), this;
  }
  saturate(t) {
    return Ue(this._rgb, 1, t), this;
  }
  desaturate(t) {
    return Ue(this._rgb, 1, -t), this;
  }
  rotate(t) {
    return Va(this._rgb, t), this;
  }
}
/*!
 * Chart.js v4.5.1
 * https://www.chartjs.org
 * (c) 2025 Chart.js Contributors
 * Released under the MIT License
 */
function ht() {
}
const Za = /* @__PURE__ */ (() => {
  let i = 0;
  return () => i++;
})();
function C(i) {
  return i == null;
}
function H(i) {
  if (Array.isArray && Array.isArray(i))
    return !0;
  const t = Object.prototype.toString.call(i);
  return t.slice(0, 7) === "[object" && t.slice(-6) === "Array]";
}
function A(i) {
  return i !== null && Object.prototype.toString.call(i) === "[object Object]";
}
function U(i) {
  return (typeof i == "number" || i instanceof Number) && isFinite(+i);
}
function st(i, t) {
  return U(i) ? i : t;
}
function $(i, t) {
  return typeof i > "u" ? t : i;
}
const Qa = (i, t) => typeof i == "string" && i.endsWith("%") ? parseFloat(i) / 100 * t : +i;
function F(i, t, e) {
  if (i && typeof i.call == "function")
    return i.apply(e, t);
}
function O(i, t, e, s) {
  let n, o, r;
  if (H(i))
    for (o = i.length, n = 0; n < o; n++)
      t.call(e, i[n], n);
  else if (A(i))
    for (r = Object.keys(i), o = r.length, n = 0; n < o; n++)
      t.call(e, i[r[n]], r[n]);
}
function mi(i, t) {
  let e, s, n, o;
  if (!i || !t || i.length !== t.length)
    return !1;
  for (e = 0, s = i.length; e < s; ++e)
    if (n = i[e], o = t[e], n.datasetIndex !== o.datasetIndex || n.index !== o.index)
      return !1;
  return !0;
}
function bi(i) {
  if (H(i))
    return i.map(bi);
  if (A(i)) {
    const t = /* @__PURE__ */ Object.create(null), e = Object.keys(i), s = e.length;
    let n = 0;
    for (; n < s; ++n)
      t[e[n]] = bi(i[e[n]]);
    return t;
  }
  return i;
}
function Eo(i) {
  return [
    "__proto__",
    "prototype",
    "constructor"
  ].indexOf(i) === -1;
}
function Ja(i, t, e, s) {
  if (!Eo(i))
    return;
  const n = t[i], o = e[i];
  A(n) && A(o) ? Oe(n, o, s) : t[i] = bi(o);
}
function Oe(i, t, e) {
  const s = H(t) ? t : [
    t
  ], n = s.length;
  if (!A(i))
    return i;
  e = e || {};
  const o = e.merger || Ja;
  let r;
  for (let a = 0; a < n; ++a) {
    if (r = s[a], !A(r))
      continue;
    const l = Object.keys(r);
    for (let c = 0, h = l.length; c < h; ++c)
      o(l[c], i, r, e);
  }
  return i;
}
function xe(i, t) {
  return Oe(i, t, {
    merger: tl
  });
}
function tl(i, t, e) {
  if (!Eo(i))
    return;
  const s = t[i], n = e[i];
  A(s) && A(n) ? xe(s, n) : Object.prototype.hasOwnProperty.call(t, i) || (t[i] = bi(n));
}
const Zs = {
  // Chart.helpers.core resolveObjectKey should resolve empty key to root object
  "": (i) => i,
  // default resolvers
  x: (i) => i.x,
  y: (i) => i.y
};
function el(i) {
  const t = i.split("."), e = [];
  let s = "";
  for (const n of t)
    s += n, s.endsWith("\\") ? s = s.slice(0, -1) + "." : (e.push(s), s = "");
  return e;
}
function il(i) {
  const t = el(i);
  return (e) => {
    for (const s of t) {
      if (s === "")
        break;
      e = e && e[s];
    }
    return e;
  };
}
function Jt(i, t) {
  return (Zs[t] || (Zs[t] = il(t)))(i);
}
function ys(i) {
  return i.charAt(0).toUpperCase() + i.slice(1);
}
const De = (i) => typeof i < "u", At = (i) => typeof i == "function", Qs = (i, t) => {
  if (i.size !== t.size)
    return !1;
  for (const e of i)
    if (!t.has(e))
      return !1;
  return !0;
};
function sl(i) {
  return i.type === "mouseup" || i.type === "click" || i.type === "contextmenu";
}
const W = Math.PI, lt = 2 * W, nl = lt + W, _i = Number.POSITIVE_INFINITY, ol = W / 180, tt = W / 2, Et = W / 4, Js = W * 2 / 3, Lo = Math.log10, ct = Math.sign;
function ve(i, t, e) {
  return Math.abs(i - t) < e;
}
function tn(i) {
  const t = Math.round(i);
  i = ve(i, t, i / 1e3) ? t : i;
  const e = Math.pow(10, Math.floor(Lo(i))), s = i / e;
  return (s <= 1 ? 1 : s <= 2 ? 2 : s <= 5 ? 5 : 10) * e;
}
function rl(i) {
  const t = [], e = Math.sqrt(i);
  let s;
  for (s = 1; s < e; s++)
    i % s === 0 && (t.push(s), t.push(i / s));
  return e === (e | 0) && t.push(e), t.sort((n, o) => n - o).pop(), t;
}
function al(i) {
  return typeof i == "symbol" || typeof i == "object" && i !== null && !(Symbol.toPrimitive in i || "toString" in i || "valueOf" in i);
}
function Te(i) {
  return !al(i) && !isNaN(parseFloat(i)) && isFinite(i);
}
function ll(i, t) {
  const e = Math.round(i);
  return e - t <= i && e + t >= i;
}
function cl(i, t, e) {
  let s, n, o;
  for (s = 0, n = i.length; s < n; s++)
    o = i[s][e], isNaN(o) || (t.min = Math.min(t.min, o), t.max = Math.max(t.max, o));
}
function Nt(i) {
  return i * (W / 180);
}
function hl(i) {
  return i * (180 / W);
}
function en(i) {
  if (!U(i))
    return;
  let t = 1, e = 0;
  for (; Math.round(i * t) / t !== i; )
    t *= 10, e++;
  return e;
}
function dl(i, t) {
  const e = t.x - i.x, s = t.y - i.y, n = Math.sqrt(e * e + s * s);
  let o = Math.atan2(s, e);
  return o < -0.5 * W && (o += lt), {
    angle: o,
    distance: n
  };
}
function is(i, t) {
  return Math.sqrt(Math.pow(t.x - i.x, 2) + Math.pow(t.y - i.y, 2));
}
function ul(i, t) {
  return (i - t + nl) % lt - W;
}
function rt(i) {
  return (i % lt + lt) % lt;
}
function Io(i, t, e, s) {
  const n = rt(i), o = rt(t), r = rt(e), a = rt(o - n), l = rt(r - n), c = rt(n - o), h = rt(n - r);
  return n === o || n === r || s && o === r || a > l && c < h;
}
function G(i, t, e) {
  return Math.max(t, Math.min(e, i));
}
function fl(i) {
  return G(i, -32768, 32767);
}
function yi(i, t, e, s = 1e-6) {
  return i >= Math.min(t, e) - s && i <= Math.max(t, e) + s;
}
function xs(i, t, e) {
  e = e || ((r) => i[r] < t);
  let s = i.length - 1, n = 0, o;
  for (; s - n > 1; )
    o = n + s >> 1, e(o) ? n = o : s = o;
  return {
    lo: n,
    hi: s
  };
}
const Ht = (i, t, e, s) => xs(i, e, s ? (n) => {
  const o = i[n][t];
  return o < e || o === e && i[n + 1][t] === e;
} : (n) => i[n][t] < e), pl = (i, t, e) => xs(i, e, (s) => i[s][t] >= e);
function gl(i, t, e) {
  let s = 0, n = i.length;
  for (; s < n && i[s] < t; )
    s++;
  for (; n > s && i[n - 1] > e; )
    n--;
  return s > 0 || n < i.length ? i.slice(s, n) : i;
}
const Ro = [
  "push",
  "pop",
  "shift",
  "splice",
  "unshift"
];
function ml(i, t) {
  if (i._chartjs) {
    i._chartjs.listeners.push(t);
    return;
  }
  Object.defineProperty(i, "_chartjs", {
    configurable: !0,
    enumerable: !1,
    value: {
      listeners: [
        t
      ]
    }
  }), Ro.forEach((e) => {
    const s = "_onData" + ys(e), n = i[e];
    Object.defineProperty(i, e, {
      configurable: !0,
      enumerable: !1,
      value(...o) {
        const r = n.apply(this, o);
        return i._chartjs.listeners.forEach((a) => {
          typeof a[s] == "function" && a[s](...o);
        }), r;
      }
    });
  });
}
function sn(i, t) {
  const e = i._chartjs;
  if (!e)
    return;
  const s = e.listeners, n = s.indexOf(t);
  n !== -1 && s.splice(n, 1), !(s.length > 0) && (Ro.forEach((o) => {
    delete i[o];
  }), delete i._chartjs);
}
function Fo(i) {
  const t = new Set(i);
  return t.size === i.length ? i : Array.from(t);
}
const zo = function() {
  return typeof window > "u" ? function(i) {
    return i();
  } : window.requestAnimationFrame;
}();
function Bo(i, t) {
  let e = [], s = !1;
  return function(...n) {
    e = n, s || (s = !0, zo.call(window, () => {
      s = !1, i.apply(t, e);
    }));
  };
}
function bl(i, t) {
  let e;
  return function(...s) {
    return t ? (clearTimeout(e), e = setTimeout(i, t, s)) : i.apply(this, s), t;
  };
}
const _l = (i) => i === "start" ? "left" : i === "end" ? "right" : "center", nn = (i, t, e) => i === "start" ? t : i === "end" ? e : (t + e) / 2;
function yl(i, t, e) {
  const s = t.length;
  let n = 0, o = s;
  if (i._sorted) {
    const { iScale: r, vScale: a, _parsed: l } = i, c = i.dataset && i.dataset.options ? i.dataset.options.spanGaps : null, h = r.axis, { min: d, max: u, minDefined: f, maxDefined: g } = r.getUserBounds();
    if (f) {
      if (n = Math.min(
        // @ts-expect-error Need to type _parsed
        Ht(l, h, d).lo,
        // @ts-expect-error Need to fix types on _lookupByKey
        e ? s : Ht(t, h, r.getPixelForValue(d)).lo
      ), c) {
        const p = l.slice(0, n + 1).reverse().findIndex((m) => !C(m[a.axis]));
        n -= Math.max(0, p);
      }
      n = G(n, 0, s - 1);
    }
    if (g) {
      let p = Math.max(
        // @ts-expect-error Need to type _parsed
        Ht(l, r.axis, u, !0).hi + 1,
        // @ts-expect-error Need to fix types on _lookupByKey
        e ? 0 : Ht(t, h, r.getPixelForValue(u), !0).hi + 1
      );
      if (c) {
        const m = l.slice(p - 1).findIndex((b) => !C(b[a.axis]));
        p += Math.max(0, m);
      }
      o = G(p, n, s) - n;
    } else
      o = s - n;
  }
  return {
    start: n,
    count: o
  };
}
function xl(i) {
  const { xScale: t, yScale: e, _scaleRanges: s } = i, n = {
    xmin: t.min,
    xmax: t.max,
    ymin: e.min,
    ymax: e.max
  };
  if (!s)
    return i._scaleRanges = n, !0;
  const o = s.xmin !== t.min || s.xmax !== t.max || s.ymin !== e.min || s.ymax !== e.max;
  return Object.assign(s, n), o;
}
const Ye = (i) => i === 0 || i === 1, on = (i, t, e) => -(Math.pow(2, 10 * (i -= 1)) * Math.sin((i - t) * lt / e)), rn = (i, t, e) => Math.pow(2, -10 * i) * Math.sin((i - t) * lt / e) + 1, we = {
  linear: (i) => i,
  easeInQuad: (i) => i * i,
  easeOutQuad: (i) => -i * (i - 2),
  easeInOutQuad: (i) => (i /= 0.5) < 1 ? 0.5 * i * i : -0.5 * (--i * (i - 2) - 1),
  easeInCubic: (i) => i * i * i,
  easeOutCubic: (i) => (i -= 1) * i * i + 1,
  easeInOutCubic: (i) => (i /= 0.5) < 1 ? 0.5 * i * i * i : 0.5 * ((i -= 2) * i * i + 2),
  easeInQuart: (i) => i * i * i * i,
  easeOutQuart: (i) => -((i -= 1) * i * i * i - 1),
  easeInOutQuart: (i) => (i /= 0.5) < 1 ? 0.5 * i * i * i * i : -0.5 * ((i -= 2) * i * i * i - 2),
  easeInQuint: (i) => i * i * i * i * i,
  easeOutQuint: (i) => (i -= 1) * i * i * i * i + 1,
  easeInOutQuint: (i) => (i /= 0.5) < 1 ? 0.5 * i * i * i * i * i : 0.5 * ((i -= 2) * i * i * i * i + 2),
  easeInSine: (i) => -Math.cos(i * tt) + 1,
  easeOutSine: (i) => Math.sin(i * tt),
  easeInOutSine: (i) => -0.5 * (Math.cos(W * i) - 1),
  easeInExpo: (i) => i === 0 ? 0 : Math.pow(2, 10 * (i - 1)),
  easeOutExpo: (i) => i === 1 ? 1 : -Math.pow(2, -10 * i) + 1,
  easeInOutExpo: (i) => Ye(i) ? i : i < 0.5 ? 0.5 * Math.pow(2, 10 * (i * 2 - 1)) : 0.5 * (-Math.pow(2, -10 * (i * 2 - 1)) + 2),
  easeInCirc: (i) => i >= 1 ? i : -(Math.sqrt(1 - i * i) - 1),
  easeOutCirc: (i) => Math.sqrt(1 - (i -= 1) * i),
  easeInOutCirc: (i) => (i /= 0.5) < 1 ? -0.5 * (Math.sqrt(1 - i * i) - 1) : 0.5 * (Math.sqrt(1 - (i -= 2) * i) + 1),
  easeInElastic: (i) => Ye(i) ? i : on(i, 0.075, 0.3),
  easeOutElastic: (i) => Ye(i) ? i : rn(i, 0.075, 0.3),
  easeInOutElastic(i) {
    return Ye(i) ? i : i < 0.5 ? 0.5 * on(i * 2, 0.1125, 0.45) : 0.5 + 0.5 * rn(i * 2 - 1, 0.1125, 0.45);
  },
  easeInBack(i) {
    return i * i * ((1.70158 + 1) * i - 1.70158);
  },
  easeOutBack(i) {
    return (i -= 1) * i * ((1.70158 + 1) * i + 1.70158) + 1;
  },
  easeInOutBack(i) {
    let t = 1.70158;
    return (i /= 0.5) < 1 ? 0.5 * (i * i * (((t *= 1.525) + 1) * i - t)) : 0.5 * ((i -= 2) * i * (((t *= 1.525) + 1) * i + t) + 2);
  },
  easeInBounce: (i) => 1 - we.easeOutBounce(1 - i),
  easeOutBounce(i) {
    return i < 1 / 2.75 ? 7.5625 * i * i : i < 2 / 2.75 ? 7.5625 * (i -= 1.5 / 2.75) * i + 0.75 : i < 2.5 / 2.75 ? 7.5625 * (i -= 2.25 / 2.75) * i + 0.9375 : 7.5625 * (i -= 2.625 / 2.75) * i + 0.984375;
  },
  easeInOutBounce: (i) => i < 0.5 ? we.easeInBounce(i * 2) * 0.5 : we.easeOutBounce(i * 2 - 1) * 0.5 + 0.5
};
function vs(i) {
  if (i && typeof i == "object") {
    const t = i.toString();
    return t === "[object CanvasPattern]" || t === "[object CanvasGradient]";
  }
  return !1;
}
function an(i) {
  return vs(i) ? i : new Ce(i);
}
function zi(i) {
  return vs(i) ? i : new Ce(i).saturate(0.5).darken(0.1).hexString();
}
const vl = [
  "x",
  "y",
  "borderWidth",
  "radius",
  "tension"
], wl = [
  "color",
  "borderColor",
  "backgroundColor"
];
function Sl(i) {
  i.set("animation", {
    delay: void 0,
    duration: 1e3,
    easing: "easeOutQuart",
    fn: void 0,
    from: void 0,
    loop: void 0,
    to: void 0,
    type: void 0
  }), i.describe("animation", {
    _fallback: !1,
    _indexable: !1,
    _scriptable: (t) => t !== "onProgress" && t !== "onComplete" && t !== "fn"
  }), i.set("animations", {
    colors: {
      type: "color",
      properties: wl
    },
    numbers: {
      type: "number",
      properties: vl
    }
  }), i.describe("animations", {
    _fallback: "animation"
  }), i.set("transitions", {
    active: {
      animation: {
        duration: 400
      }
    },
    resize: {
      animation: {
        duration: 0
      }
    },
    show: {
      animations: {
        colors: {
          from: "transparent"
        },
        visible: {
          type: "boolean",
          duration: 0
        }
      }
    },
    hide: {
      animations: {
        colors: {
          to: "transparent"
        },
        visible: {
          type: "boolean",
          easing: "linear",
          fn: (t) => t | 0
        }
      }
    }
  });
}
function kl(i) {
  i.set("layout", {
    autoPadding: !0,
    padding: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    }
  });
}
const ln = /* @__PURE__ */ new Map();
function Ml(i, t) {
  t = t || {};
  const e = i + JSON.stringify(t);
  let s = ln.get(e);
  return s || (s = new Intl.NumberFormat(i, t), ln.set(e, s)), s;
}
function No(i, t, e) {
  return Ml(t, e).format(i);
}
const Al = {
  values(i) {
    return H(i) ? i : "" + i;
  },
  numeric(i, t, e) {
    if (i === 0)
      return "0";
    const s = this.chart.options.locale;
    let n, o = i;
    if (e.length > 1) {
      const c = Math.max(Math.abs(e[0].value), Math.abs(e[e.length - 1].value));
      (c < 1e-4 || c > 1e15) && (n = "scientific"), o = Pl(i, e);
    }
    const r = Lo(Math.abs(o)), a = isNaN(r) ? 1 : Math.max(Math.min(-1 * Math.floor(r), 20), 0), l = {
      notation: n,
      minimumFractionDigits: a,
      maximumFractionDigits: a
    };
    return Object.assign(l, this.options.ticks.format), No(i, s, l);
  }
};
function Pl(i, t) {
  let e = t.length > 3 ? t[2].value - t[1].value : t[1].value - t[0].value;
  return Math.abs(e) >= 1 && i !== Math.floor(i) && (e = i - Math.floor(i)), e;
}
var Ho = {
  formatters: Al
};
function $l(i) {
  i.set("scale", {
    display: !0,
    offset: !1,
    reverse: !1,
    beginAtZero: !1,
    bounds: "ticks",
    clip: !0,
    grace: 0,
    grid: {
      display: !0,
      lineWidth: 1,
      drawOnChartArea: !0,
      drawTicks: !0,
      tickLength: 8,
      tickWidth: (t, e) => e.lineWidth,
      tickColor: (t, e) => e.color,
      offset: !1
    },
    border: {
      display: !0,
      dash: [],
      dashOffset: 0,
      width: 1
    },
    title: {
      display: !1,
      text: "",
      padding: {
        top: 4,
        bottom: 4
      }
    },
    ticks: {
      minRotation: 0,
      maxRotation: 50,
      mirror: !1,
      textStrokeWidth: 0,
      textStrokeColor: "",
      padding: 3,
      display: !0,
      autoSkip: !0,
      autoSkipPadding: 3,
      labelOffset: 0,
      callback: Ho.formatters.values,
      minor: {},
      major: {},
      align: "center",
      crossAlign: "near",
      showLabelBackdrop: !1,
      backdropColor: "rgba(255, 255, 255, 0.75)",
      backdropPadding: 2
    }
  }), i.route("scale.ticks", "color", "", "color"), i.route("scale.grid", "color", "", "borderColor"), i.route("scale.border", "color", "", "borderColor"), i.route("scale.title", "color", "", "color"), i.describe("scale", {
    _fallback: !1,
    _scriptable: (t) => !t.startsWith("before") && !t.startsWith("after") && t !== "callback" && t !== "parser",
    _indexable: (t) => t !== "borderDash" && t !== "tickBorderDash" && t !== "dash"
  }), i.describe("scales", {
    _fallback: "scale"
  }), i.describe("scale.ticks", {
    _scriptable: (t) => t !== "backdropPadding" && t !== "callback",
    _indexable: (t) => t !== "backdropPadding"
  });
}
const Ut = /* @__PURE__ */ Object.create(null), ss = /* @__PURE__ */ Object.create(null);
function Se(i, t) {
  if (!t)
    return i;
  const e = t.split(".");
  for (let s = 0, n = e.length; s < n; ++s) {
    const o = e[s];
    i = i[o] || (i[o] = /* @__PURE__ */ Object.create(null));
  }
  return i;
}
function Bi(i, t, e) {
  return typeof t == "string" ? Oe(Se(i, t), e) : Oe(Se(i, ""), t);
}
class Cl {
  constructor(t, e) {
    this.animation = void 0, this.backgroundColor = "rgba(0,0,0,0.1)", this.borderColor = "rgba(0,0,0,0.1)", this.color = "#666", this.datasets = {}, this.devicePixelRatio = (s) => s.chart.platform.getDevicePixelRatio(), this.elements = {}, this.events = [
      "mousemove",
      "mouseout",
      "click",
      "touchstart",
      "touchmove"
    ], this.font = {
      family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
      size: 12,
      style: "normal",
      lineHeight: 1.2,
      weight: null
    }, this.hover = {}, this.hoverBackgroundColor = (s, n) => zi(n.backgroundColor), this.hoverBorderColor = (s, n) => zi(n.borderColor), this.hoverColor = (s, n) => zi(n.color), this.indexAxis = "x", this.interaction = {
      mode: "nearest",
      intersect: !0,
      includeInvisible: !1
    }, this.maintainAspectRatio = !0, this.onHover = null, this.onClick = null, this.parsing = !0, this.plugins = {}, this.responsive = !0, this.scale = void 0, this.scales = {}, this.showLine = !0, this.drawActiveElementsOnTop = !0, this.describe(t), this.apply(e);
  }
  set(t, e) {
    return Bi(this, t, e);
  }
  get(t) {
    return Se(this, t);
  }
  describe(t, e) {
    return Bi(ss, t, e);
  }
  override(t, e) {
    return Bi(Ut, t, e);
  }
  route(t, e, s, n) {
    const o = Se(this, t), r = Se(this, s), a = "_" + e;
    Object.defineProperties(o, {
      [a]: {
        value: o[e],
        writable: !0
      },
      [e]: {
        enumerable: !0,
        get() {
          const l = this[a], c = r[n];
          return A(l) ? Object.assign({}, c, l) : $(l, c);
        },
        set(l) {
          this[a] = l;
        }
      }
    });
  }
  apply(t) {
    t.forEach((e) => e(this));
  }
}
var B = /* @__PURE__ */ new Cl({
  _scriptable: (i) => !i.startsWith("on"),
  _indexable: (i) => i !== "events",
  hover: {
    _fallback: "interaction"
  },
  interaction: {
    _scriptable: !1,
    _indexable: !1
  }
}, [
  Sl,
  kl,
  $l
]);
function Ol(i) {
  return !i || C(i.size) || C(i.family) ? null : (i.style ? i.style + " " : "") + (i.weight ? i.weight + " " : "") + i.size + "px " + i.family;
}
function cn(i, t, e, s, n) {
  let o = t[n];
  return o || (o = t[n] = i.measureText(n).width, e.push(n)), o > s && (s = o), s;
}
function Lt(i, t, e) {
  const s = i.currentDevicePixelRatio, n = e !== 0 ? Math.max(e / 2, 0.5) : 0;
  return Math.round((t - n) * s) / s + n;
}
function hn(i, t) {
  !t && !i || (t = t || i.getContext("2d"), t.save(), t.resetTransform(), t.clearRect(0, 0, i.width, i.height), t.restore());
}
function ns(i, t, e, s) {
  Dl(i, t, e, s);
}
function Dl(i, t, e, s, n) {
  let o, r, a, l, c, h, d, u;
  const f = t.pointStyle, g = t.rotation, p = t.radius;
  let m = (g || 0) * ol;
  if (f && typeof f == "object" && (o = f.toString(), o === "[object HTMLImageElement]" || o === "[object HTMLCanvasElement]")) {
    i.save(), i.translate(e, s), i.rotate(m), i.drawImage(f, -f.width / 2, -f.height / 2, f.width, f.height), i.restore();
    return;
  }
  if (!(isNaN(p) || p <= 0)) {
    switch (i.beginPath(), f) {
      default:
        i.arc(e, s, p, 0, lt), i.closePath();
        break;
      case "triangle":
        h = p, i.moveTo(e + Math.sin(m) * h, s - Math.cos(m) * p), m += Js, i.lineTo(e + Math.sin(m) * h, s - Math.cos(m) * p), m += Js, i.lineTo(e + Math.sin(m) * h, s - Math.cos(m) * p), i.closePath();
        break;
      case "rectRounded":
        c = p * 0.516, l = p - c, r = Math.cos(m + Et) * l, d = Math.cos(m + Et) * l, a = Math.sin(m + Et) * l, u = Math.sin(m + Et) * l, i.arc(e - d, s - a, c, m - W, m - tt), i.arc(e + u, s - r, c, m - tt, m), i.arc(e + d, s + a, c, m, m + tt), i.arc(e - u, s + r, c, m + tt, m + W), i.closePath();
        break;
      case "rect":
        if (!g) {
          l = Math.SQRT1_2 * p, h = l, i.rect(e - h, s - l, 2 * h, 2 * l);
          break;
        }
        m += Et;
      case "rectRot":
        d = Math.cos(m) * p, r = Math.cos(m) * p, a = Math.sin(m) * p, u = Math.sin(m) * p, i.moveTo(e - d, s - a), i.lineTo(e + u, s - r), i.lineTo(e + d, s + a), i.lineTo(e - u, s + r), i.closePath();
        break;
      case "crossRot":
        m += Et;
      case "cross":
        d = Math.cos(m) * p, r = Math.cos(m) * p, a = Math.sin(m) * p, u = Math.sin(m) * p, i.moveTo(e - d, s - a), i.lineTo(e + d, s + a), i.moveTo(e + u, s - r), i.lineTo(e - u, s + r);
        break;
      case "star":
        d = Math.cos(m) * p, r = Math.cos(m) * p, a = Math.sin(m) * p, u = Math.sin(m) * p, i.moveTo(e - d, s - a), i.lineTo(e + d, s + a), i.moveTo(e + u, s - r), i.lineTo(e - u, s + r), m += Et, d = Math.cos(m) * p, r = Math.cos(m) * p, a = Math.sin(m) * p, u = Math.sin(m) * p, i.moveTo(e - d, s - a), i.lineTo(e + d, s + a), i.moveTo(e + u, s - r), i.lineTo(e - u, s + r);
        break;
      case "line":
        r = Math.cos(m) * p, a = Math.sin(m) * p, i.moveTo(e - r, s - a), i.lineTo(e + r, s + a);
        break;
      case "dash":
        i.moveTo(e, s), i.lineTo(e + Math.cos(m) * p, s + Math.sin(m) * p);
        break;
      case !1:
        i.closePath();
        break;
    }
    i.fill(), t.borderWidth > 0 && i.stroke();
  }
}
function Ee(i, t, e) {
  return e = e || 0.5, !t || i && i.x > t.left - e && i.x < t.right + e && i.y > t.top - e && i.y < t.bottom + e;
}
function ws(i, t) {
  i.save(), i.beginPath(), i.rect(t.left, t.top, t.right - t.left, t.bottom - t.top), i.clip();
}
function Ss(i) {
  i.restore();
}
function Tl(i, t, e, s, n) {
  if (!t)
    return i.lineTo(e.x, e.y);
  if (n === "middle") {
    const o = (t.x + e.x) / 2;
    i.lineTo(o, t.y), i.lineTo(o, e.y);
  } else n === "after" != !!s ? i.lineTo(t.x, e.y) : i.lineTo(e.x, t.y);
  i.lineTo(e.x, e.y);
}
function El(i, t, e, s) {
  if (!t)
    return i.lineTo(e.x, e.y);
  i.bezierCurveTo(s ? t.cp1x : t.cp2x, s ? t.cp1y : t.cp2y, s ? e.cp2x : e.cp1x, s ? e.cp2y : e.cp1y, e.x, e.y);
}
function Ll(i, t) {
  t.translation && i.translate(t.translation[0], t.translation[1]), C(t.rotation) || i.rotate(t.rotation), t.color && (i.fillStyle = t.color), t.textAlign && (i.textAlign = t.textAlign), t.textBaseline && (i.textBaseline = t.textBaseline);
}
function Il(i, t, e, s, n) {
  if (n.strikethrough || n.underline) {
    const o = i.measureText(s), r = t - o.actualBoundingBoxLeft, a = t + o.actualBoundingBoxRight, l = e - o.actualBoundingBoxAscent, c = e + o.actualBoundingBoxDescent, h = n.strikethrough ? (l + c) / 2 : c;
    i.strokeStyle = i.fillStyle, i.beginPath(), i.lineWidth = n.decorationWidth || 2, i.moveTo(r, h), i.lineTo(a, h), i.stroke();
  }
}
function Rl(i, t) {
  const e = i.fillStyle;
  i.fillStyle = t.color, i.fillRect(t.left, t.top, t.width, t.height), i.fillStyle = e;
}
function dn(i, t, e, s, n, o = {}) {
  const r = H(t) ? t : [
    t
  ], a = o.strokeWidth > 0 && o.strokeColor !== "";
  let l, c;
  for (i.save(), i.font = n.string, Ll(i, o), l = 0; l < r.length; ++l)
    c = r[l], o.backdrop && Rl(i, o.backdrop), a && (o.strokeColor && (i.strokeStyle = o.strokeColor), C(o.strokeWidth) || (i.lineWidth = o.strokeWidth), i.strokeText(c, e, s, o.maxWidth)), i.fillText(c, e, s, o.maxWidth), Il(i, e, s, c, o), s += Number(n.lineHeight);
  i.restore();
}
function os(i, t) {
  const { x: e, y: s, w: n, h: o, radius: r } = t;
  i.arc(e + r.topLeft, s + r.topLeft, r.topLeft, 1.5 * W, W, !0), i.lineTo(e, s + o - r.bottomLeft), i.arc(e + r.bottomLeft, s + o - r.bottomLeft, r.bottomLeft, W, tt, !0), i.lineTo(e + n - r.bottomRight, s + o), i.arc(e + n - r.bottomRight, s + o - r.bottomRight, r.bottomRight, tt, 0, !0), i.lineTo(e + n, s + r.topRight), i.arc(e + n - r.topRight, s + r.topRight, r.topRight, 0, -tt, !0), i.lineTo(e + r.topLeft, s);
}
const Fl = /^(normal|(\d+(?:\.\d+)?)(px|em|%)?)$/, zl = /^(normal|italic|initial|inherit|unset|(oblique( -?[0-9]?[0-9]deg)?))$/;
function Bl(i, t) {
  const e = ("" + i).match(Fl);
  if (!e || e[1] === "normal")
    return t * 1.2;
  switch (i = +e[2], e[3]) {
    case "px":
      return i;
    case "%":
      i /= 100;
      break;
  }
  return t * i;
}
const Nl = (i) => +i || 0;
function Vo(i, t) {
  const e = {}, s = A(t), n = s ? Object.keys(t) : t, o = A(i) ? s ? (r) => $(i[r], i[t[r]]) : (r) => i[r] : () => i;
  for (const r of n)
    e[r] = Nl(o(r));
  return e;
}
function jo(i) {
  return Vo(i, {
    top: "y",
    right: "x",
    bottom: "y",
    left: "x"
  });
}
function ke(i) {
  return Vo(i, [
    "topLeft",
    "topRight",
    "bottomLeft",
    "bottomRight"
  ]);
}
function Pt(i) {
  const t = jo(i);
  return t.width = t.left + t.right, t.height = t.top + t.bottom, t;
}
function at(i, t) {
  i = i || {}, t = t || B.font;
  let e = $(i.size, t.size);
  typeof e == "string" && (e = parseInt(e, 10));
  let s = $(i.style, t.style);
  s && !("" + s).match(zl) && (console.warn('Invalid font style specified: "' + s + '"'), s = void 0);
  const n = {
    family: $(i.family, t.family),
    lineHeight: Bl($(i.lineHeight, t.lineHeight), e),
    size: e,
    style: s,
    weight: $(i.weight, t.weight),
    string: ""
  };
  return n.string = Ol(n), n;
}
function Ke(i, t, e, s) {
  let n, o, r;
  for (n = 0, o = i.length; n < o; ++n)
    if (r = i[n], r !== void 0 && r !== void 0)
      return r;
}
function Hl(i, t, e) {
  const { min: s, max: n } = i, o = Qa(t, (n - s) / 2), r = (a, l) => e && a === 0 ? 0 : a + l;
  return {
    min: r(s, -Math.abs(o)),
    max: r(n, o)
  };
}
function Yt(i, t) {
  return Object.assign(Object.create(i), t);
}
function ks(i, t = [
  ""
], e, s, n = () => i[0]) {
  const o = e || i;
  typeof s > "u" && (s = Ko("_fallback", i));
  const r = {
    [Symbol.toStringTag]: "Object",
    _cacheable: !0,
    _scopes: i,
    _rootScopes: o,
    _fallback: s,
    _getTarget: n,
    override: (a) => ks([
      a,
      ...i
    ], t, o, s)
  };
  return new Proxy(r, {
    /**
    * A trap for the delete operator.
    */
    deleteProperty(a, l) {
      return delete a[l], delete a._keys, delete i[0][l], !0;
    },
    /**
    * A trap for getting property values.
    */
    get(a, l) {
      return Uo(a, l, () => ql(l, t, i, a));
    },
    /**
    * A trap for Object.getOwnPropertyDescriptor.
    * Also used by Object.hasOwnProperty.
    */
    getOwnPropertyDescriptor(a, l) {
      return Reflect.getOwnPropertyDescriptor(a._scopes[0], l);
    },
    /**
    * A trap for Object.getPrototypeOf.
    */
    getPrototypeOf() {
      return Reflect.getPrototypeOf(i[0]);
    },
    /**
    * A trap for the in operator.
    */
    has(a, l) {
      return fn(a).includes(l);
    },
    /**
    * A trap for Object.getOwnPropertyNames and Object.getOwnPropertySymbols.
    */
    ownKeys(a) {
      return fn(a);
    },
    /**
    * A trap for setting property values.
    */
    set(a, l, c) {
      const h = a._storage || (a._storage = n());
      return a[l] = h[l] = c, delete a._keys, !0;
    }
  });
}
function te(i, t, e, s) {
  const n = {
    _cacheable: !1,
    _proxy: i,
    _context: t,
    _subProxy: e,
    _stack: /* @__PURE__ */ new Set(),
    _descriptors: Wo(i, s),
    setContext: (o) => te(i, o, e, s),
    override: (o) => te(i.override(o), t, e, s)
  };
  return new Proxy(n, {
    /**
    * A trap for the delete operator.
    */
    deleteProperty(o, r) {
      return delete o[r], delete i[r], !0;
    },
    /**
    * A trap for getting property values.
    */
    get(o, r, a) {
      return Uo(o, r, () => jl(o, r, a));
    },
    /**
    * A trap for Object.getOwnPropertyDescriptor.
    * Also used by Object.hasOwnProperty.
    */
    getOwnPropertyDescriptor(o, r) {
      return o._descriptors.allKeys ? Reflect.has(i, r) ? {
        enumerable: !0,
        configurable: !0
      } : void 0 : Reflect.getOwnPropertyDescriptor(i, r);
    },
    /**
    * A trap for Object.getPrototypeOf.
    */
    getPrototypeOf() {
      return Reflect.getPrototypeOf(i);
    },
    /**
    * A trap for the in operator.
    */
    has(o, r) {
      return Reflect.has(i, r);
    },
    /**
    * A trap for Object.getOwnPropertyNames and Object.getOwnPropertySymbols.
    */
    ownKeys() {
      return Reflect.ownKeys(i);
    },
    /**
    * A trap for setting property values.
    */
    set(o, r, a) {
      return i[r] = a, delete o[r], !0;
    }
  });
}
function Wo(i, t = {
  scriptable: !0,
  indexable: !0
}) {
  const { _scriptable: e = t.scriptable, _indexable: s = t.indexable, _allKeys: n = t.allKeys } = i;
  return {
    allKeys: n,
    scriptable: e,
    indexable: s,
    isScriptable: At(e) ? e : () => e,
    isIndexable: At(s) ? s : () => s
  };
}
const Vl = (i, t) => i ? i + ys(t) : t, Ms = (i, t) => A(t) && i !== "adapters" && (Object.getPrototypeOf(t) === null || t.constructor === Object);
function Uo(i, t, e) {
  if (Object.prototype.hasOwnProperty.call(i, t) || t === "constructor")
    return i[t];
  const s = e();
  return i[t] = s, s;
}
function jl(i, t, e) {
  const { _proxy: s, _context: n, _subProxy: o, _descriptors: r } = i;
  let a = s[t];
  return At(a) && r.isScriptable(t) && (a = Wl(t, a, i, e)), H(a) && a.length && (a = Ul(t, a, i, r.isIndexable)), Ms(t, a) && (a = te(a, n, o && o[t], r)), a;
}
function Wl(i, t, e, s) {
  const { _proxy: n, _context: o, _subProxy: r, _stack: a } = e;
  if (a.has(i))
    throw new Error("Recursion detected: " + Array.from(a).join("->") + "->" + i);
  a.add(i);
  let l = t(o, r || s);
  return a.delete(i), Ms(i, l) && (l = As(n._scopes, n, i, l)), l;
}
function Ul(i, t, e, s) {
  const { _proxy: n, _context: o, _subProxy: r, _descriptors: a } = e;
  if (typeof o.index < "u" && s(i))
    return t[o.index % t.length];
  if (A(t[0])) {
    const l = t, c = n._scopes.filter((h) => h !== l);
    t = [];
    for (const h of l) {
      const d = As(c, n, i, h);
      t.push(te(d, o, r && r[i], a));
    }
  }
  return t;
}
function Yo(i, t, e) {
  return At(i) ? i(t, e) : i;
}
const Yl = (i, t) => i === !0 ? t : typeof i == "string" ? Jt(t, i) : void 0;
function Kl(i, t, e, s, n) {
  for (const o of t) {
    const r = Yl(e, o);
    if (r) {
      i.add(r);
      const a = Yo(r._fallback, e, n);
      if (typeof a < "u" && a !== e && a !== s)
        return a;
    } else if (r === !1 && typeof s < "u" && e !== s)
      return null;
  }
  return !1;
}
function As(i, t, e, s) {
  const n = t._rootScopes, o = Yo(t._fallback, e, s), r = [
    ...i,
    ...n
  ], a = /* @__PURE__ */ new Set();
  a.add(s);
  let l = un(a, r, e, o || e, s);
  return l === null || typeof o < "u" && o !== e && (l = un(a, r, o, l, s), l === null) ? !1 : ks(Array.from(a), [
    ""
  ], n, o, () => Xl(t, e, s));
}
function un(i, t, e, s, n) {
  for (; e; )
    e = Kl(i, t, e, s, n);
  return e;
}
function Xl(i, t, e) {
  const s = i._getTarget();
  t in s || (s[t] = {});
  const n = s[t];
  return H(n) && A(e) ? e : n || {};
}
function ql(i, t, e, s) {
  let n;
  for (const o of t)
    if (n = Ko(Vl(o, i), e), typeof n < "u")
      return Ms(i, n) ? As(e, s, i, n) : n;
}
function Ko(i, t) {
  for (const e of t) {
    if (!e)
      continue;
    const s = e[i];
    if (typeof s < "u")
      return s;
  }
}
function fn(i) {
  let t = i._keys;
  return t || (t = i._keys = Gl(i._scopes)), t;
}
function Gl(i) {
  const t = /* @__PURE__ */ new Set();
  for (const e of i)
    for (const s of Object.keys(e).filter((n) => !n.startsWith("_")))
      t.add(s);
  return Array.from(t);
}
const Zl = Number.EPSILON || 1e-14, ee = (i, t) => t < i.length && !i[t].skip && i[t], Xo = (i) => i === "x" ? "y" : "x";
function Ql(i, t, e, s) {
  const n = i.skip ? t : i, o = t, r = e.skip ? t : e, a = is(o, n), l = is(r, o);
  let c = a / (a + l), h = l / (a + l);
  c = isNaN(c) ? 0 : c, h = isNaN(h) ? 0 : h;
  const d = s * c, u = s * h;
  return {
    previous: {
      x: o.x - d * (r.x - n.x),
      y: o.y - d * (r.y - n.y)
    },
    next: {
      x: o.x + u * (r.x - n.x),
      y: o.y + u * (r.y - n.y)
    }
  };
}
function Jl(i, t, e) {
  const s = i.length;
  let n, o, r, a, l, c = ee(i, 0);
  for (let h = 0; h < s - 1; ++h)
    if (l = c, c = ee(i, h + 1), !(!l || !c)) {
      if (ve(t[h], 0, Zl)) {
        e[h] = e[h + 1] = 0;
        continue;
      }
      n = e[h] / t[h], o = e[h + 1] / t[h], a = Math.pow(n, 2) + Math.pow(o, 2), !(a <= 9) && (r = 3 / Math.sqrt(a), e[h] = n * r * t[h], e[h + 1] = o * r * t[h]);
    }
}
function tc(i, t, e = "x") {
  const s = Xo(e), n = i.length;
  let o, r, a, l = ee(i, 0);
  for (let c = 0; c < n; ++c) {
    if (r = a, a = l, l = ee(i, c + 1), !a)
      continue;
    const h = a[e], d = a[s];
    r && (o = (h - r[e]) / 3, a[`cp1${e}`] = h - o, a[`cp1${s}`] = d - o * t[c]), l && (o = (l[e] - h) / 3, a[`cp2${e}`] = h + o, a[`cp2${s}`] = d + o * t[c]);
  }
}
function ec(i, t = "x") {
  const e = Xo(t), s = i.length, n = Array(s).fill(0), o = Array(s);
  let r, a, l, c = ee(i, 0);
  for (r = 0; r < s; ++r)
    if (a = l, l = c, c = ee(i, r + 1), !!l) {
      if (c) {
        const h = c[t] - l[t];
        n[r] = h !== 0 ? (c[e] - l[e]) / h : 0;
      }
      o[r] = a ? c ? ct(n[r - 1]) !== ct(n[r]) ? 0 : (n[r - 1] + n[r]) / 2 : n[r - 1] : n[r];
    }
  Jl(i, n, o), tc(i, o, t);
}
function Xe(i, t, e) {
  return Math.max(Math.min(i, e), t);
}
function ic(i, t) {
  let e, s, n, o, r, a = Ee(i[0], t);
  for (e = 0, s = i.length; e < s; ++e)
    r = o, o = a, a = e < s - 1 && Ee(i[e + 1], t), o && (n = i[e], r && (n.cp1x = Xe(n.cp1x, t.left, t.right), n.cp1y = Xe(n.cp1y, t.top, t.bottom)), a && (n.cp2x = Xe(n.cp2x, t.left, t.right), n.cp2y = Xe(n.cp2y, t.top, t.bottom)));
}
function sc(i, t, e, s, n) {
  let o, r, a, l;
  if (t.spanGaps && (i = i.filter((c) => !c.skip)), t.cubicInterpolationMode === "monotone")
    ec(i, n);
  else {
    let c = s ? i[i.length - 1] : i[0];
    for (o = 0, r = i.length; o < r; ++o)
      a = i[o], l = Ql(c, a, i[Math.min(o + 1, r - (s ? 0 : 1)) % r], t.tension), a.cp1x = l.previous.x, a.cp1y = l.previous.y, a.cp2x = l.next.x, a.cp2y = l.next.y, c = a;
  }
  t.capBezierPoints && ic(i, e);
}
function Ps() {
  return typeof window < "u" && typeof document < "u";
}
function $s(i) {
  let t = i.parentNode;
  return t && t.toString() === "[object ShadowRoot]" && (t = t.host), t;
}
function xi(i, t, e) {
  let s;
  return typeof i == "string" ? (s = parseInt(i, 10), i.indexOf("%") !== -1 && (s = s / 100 * t.parentNode[e])) : s = i, s;
}
const Ci = (i) => i.ownerDocument.defaultView.getComputedStyle(i, null);
function nc(i, t) {
  return Ci(i).getPropertyValue(t);
}
const oc = [
  "top",
  "right",
  "bottom",
  "left"
];
function Vt(i, t, e) {
  const s = {};
  e = e ? "-" + e : "";
  for (let n = 0; n < 4; n++) {
    const o = oc[n];
    s[o] = parseFloat(i[t + "-" + o + e]) || 0;
  }
  return s.width = s.left + s.right, s.height = s.top + s.bottom, s;
}
const rc = (i, t, e) => (i > 0 || t > 0) && (!e || !e.shadowRoot);
function ac(i, t) {
  const e = i.touches, s = e && e.length ? e[0] : i, { offsetX: n, offsetY: o } = s;
  let r = !1, a, l;
  if (rc(n, o, i.target))
    a = n, l = o;
  else {
    const c = t.getBoundingClientRect();
    a = s.clientX - c.left, l = s.clientY - c.top, r = !0;
  }
  return {
    x: a,
    y: l,
    box: r
  };
}
function Ft(i, t) {
  if ("native" in i)
    return i;
  const { canvas: e, currentDevicePixelRatio: s } = t, n = Ci(e), o = n.boxSizing === "border-box", r = Vt(n, "padding"), a = Vt(n, "border", "width"), { x: l, y: c, box: h } = ac(i, e), d = r.left + (h && a.left), u = r.top + (h && a.top);
  let { width: f, height: g } = t;
  return o && (f -= r.width + a.width, g -= r.height + a.height), {
    x: Math.round((l - d) / f * e.width / s),
    y: Math.round((c - u) / g * e.height / s)
  };
}
function lc(i, t, e) {
  let s, n;
  if (t === void 0 || e === void 0) {
    const o = i && $s(i);
    if (!o)
      t = i.clientWidth, e = i.clientHeight;
    else {
      const r = o.getBoundingClientRect(), a = Ci(o), l = Vt(a, "border", "width"), c = Vt(a, "padding");
      t = r.width - c.width - l.width, e = r.height - c.height - l.height, s = xi(a.maxWidth, o, "clientWidth"), n = xi(a.maxHeight, o, "clientHeight");
    }
  }
  return {
    width: t,
    height: e,
    maxWidth: s || _i,
    maxHeight: n || _i
  };
}
const xt = (i) => Math.round(i * 10) / 10;
function cc(i, t, e, s) {
  const n = Ci(i), o = Vt(n, "margin"), r = xi(n.maxWidth, i, "clientWidth") || _i, a = xi(n.maxHeight, i, "clientHeight") || _i, l = lc(i, t, e);
  let { width: c, height: h } = l;
  if (n.boxSizing === "content-box") {
    const u = Vt(n, "border", "width"), f = Vt(n, "padding");
    c -= f.width + u.width, h -= f.height + u.height;
  }
  return c = Math.max(0, c - o.width), h = Math.max(0, s ? c / s : h - o.height), c = xt(Math.min(c, r, l.maxWidth)), h = xt(Math.min(h, a, l.maxHeight)), c && !h && (h = xt(c / 2)), (t !== void 0 || e !== void 0) && s && l.height && h > l.height && (h = l.height, c = xt(Math.floor(h * s))), {
    width: c,
    height: h
  };
}
function pn(i, t, e) {
  const s = t || 1, n = xt(i.height * s), o = xt(i.width * s);
  i.height = xt(i.height), i.width = xt(i.width);
  const r = i.canvas;
  return r.style && (e || !r.style.height && !r.style.width) && (r.style.height = `${i.height}px`, r.style.width = `${i.width}px`), i.currentDevicePixelRatio !== s || r.height !== n || r.width !== o ? (i.currentDevicePixelRatio = s, r.height = n, r.width = o, i.ctx.setTransform(s, 0, 0, s, 0, 0), !0) : !1;
}
const hc = function() {
  let i = !1;
  try {
    const t = {
      get passive() {
        return i = !0, !1;
      }
    };
    Ps() && (window.addEventListener("test", null, t), window.removeEventListener("test", null, t));
  } catch {
  }
  return i;
}();
function gn(i, t) {
  const e = nc(i, t), s = e && e.match(/^(\d+)(\.\d+)?px$/);
  return s ? +s[1] : void 0;
}
function zt(i, t, e, s) {
  return {
    x: i.x + e * (t.x - i.x),
    y: i.y + e * (t.y - i.y)
  };
}
function dc(i, t, e, s) {
  return {
    x: i.x + e * (t.x - i.x),
    y: s === "middle" ? e < 0.5 ? i.y : t.y : s === "after" ? e < 1 ? i.y : t.y : e > 0 ? t.y : i.y
  };
}
function uc(i, t, e, s) {
  const n = {
    x: i.cp2x,
    y: i.cp2y
  }, o = {
    x: t.cp1x,
    y: t.cp1y
  }, r = zt(i, n, e), a = zt(n, o, e), l = zt(o, t, e), c = zt(r, a, e), h = zt(a, l, e);
  return zt(c, h, e);
}
const fc = function(i, t) {
  return {
    x(e) {
      return i + i + t - e;
    },
    setWidth(e) {
      t = e;
    },
    textAlign(e) {
      return e === "center" ? e : e === "right" ? "left" : "right";
    },
    xPlus(e, s) {
      return e - s;
    },
    leftForLtr(e, s) {
      return e - s;
    }
  };
}, pc = function() {
  return {
    x(i) {
      return i;
    },
    setWidth(i) {
    },
    textAlign(i) {
      return i;
    },
    xPlus(i, t) {
      return i + t;
    },
    leftForLtr(i, t) {
      return i;
    }
  };
};
function Ni(i, t, e) {
  return i ? fc(t, e) : pc();
}
function gc(i, t) {
  let e, s;
  (t === "ltr" || t === "rtl") && (e = i.canvas.style, s = [
    e.getPropertyValue("direction"),
    e.getPropertyPriority("direction")
  ], e.setProperty("direction", t, "important"), i.prevTextDirection = s);
}
function mc(i, t) {
  t !== void 0 && (delete i.prevTextDirection, i.canvas.style.setProperty("direction", t[0], t[1]));
}
function qo(i) {
  return i === "angle" ? {
    between: Io,
    compare: ul,
    normalize: rt
  } : {
    between: yi,
    compare: (t, e) => t - e,
    normalize: (t) => t
  };
}
function mn({ start: i, end: t, count: e, loop: s, style: n }) {
  return {
    start: i % e,
    end: t % e,
    loop: s && (t - i + 1) % e === 0,
    style: n
  };
}
function bc(i, t, e) {
  const { property: s, start: n, end: o } = e, { between: r, normalize: a } = qo(s), l = t.length;
  let { start: c, end: h, loop: d } = i, u, f;
  if (d) {
    for (c += l, h += l, u = 0, f = l; u < f && r(a(t[c % l][s]), n, o); ++u)
      c--, h--;
    c %= l, h %= l;
  }
  return h < c && (h += l), {
    start: c,
    end: h,
    loop: d,
    style: i.style
  };
}
function Go(i, t, e) {
  if (!e)
    return [
      i
    ];
  const { property: s, start: n, end: o } = e, r = t.length, { compare: a, between: l, normalize: c } = qo(s), { start: h, end: d, loop: u, style: f } = bc(i, t, e), g = [];
  let p = !1, m = null, b, y, v;
  const x = () => l(n, v, b) && a(n, v) !== 0, _ = () => a(o, b) === 0 || l(o, v, b), M = () => p || x(), w = () => !p || _();
  for (let k = h, P = h; k <= d; ++k)
    y = t[k % r], !y.skip && (b = c(y[s]), b !== v && (p = l(b, n, o), m === null && M() && (m = a(b, n) === 0 ? k : P), m !== null && w() && (g.push(mn({
      start: m,
      end: k,
      loop: u,
      count: r,
      style: f
    })), m = null), P = k, v = b));
  return m !== null && g.push(mn({
    start: m,
    end: d,
    loop: u,
    count: r,
    style: f
  })), g;
}
function Zo(i, t) {
  const e = [], s = i.segments;
  for (let n = 0; n < s.length; n++) {
    const o = Go(s[n], i.points, t);
    o.length && e.push(...o);
  }
  return e;
}
function _c(i, t, e, s) {
  let n = 0, o = t - 1;
  if (e && !s)
    for (; n < t && !i[n].skip; )
      n++;
  for (; n < t && i[n].skip; )
    n++;
  for (n %= t, e && (o += n); o > n && i[o % t].skip; )
    o--;
  return o %= t, {
    start: n,
    end: o
  };
}
function yc(i, t, e, s) {
  const n = i.length, o = [];
  let r = t, a = i[t], l;
  for (l = t + 1; l <= e; ++l) {
    const c = i[l % n];
    c.skip || c.stop ? a.skip || (s = !1, o.push({
      start: t % n,
      end: (l - 1) % n,
      loop: s
    }), t = r = c.stop ? l : null) : (r = l, a.skip && (t = l)), a = c;
  }
  return r !== null && o.push({
    start: t % n,
    end: r % n,
    loop: s
  }), o;
}
function xc(i, t) {
  const e = i.points, s = i.options.spanGaps, n = e.length;
  if (!n)
    return [];
  const o = !!i._loop, { start: r, end: a } = _c(e, n, o, s);
  if (s === !0)
    return bn(i, [
      {
        start: r,
        end: a,
        loop: o
      }
    ], e, t);
  const l = a < r ? a + n : a, c = !!i._fullLoop && r === 0 && a === n - 1;
  return bn(i, yc(e, r, l, c), e, t);
}
function bn(i, t, e, s) {
  return !s || !s.setContext || !e ? t : vc(i, t, e, s);
}
function vc(i, t, e, s) {
  const n = i._chart.getContext(), o = _n(i.options), { _datasetIndex: r, options: { spanGaps: a } } = i, l = e.length, c = [];
  let h = o, d = t[0].start, u = d;
  function f(g, p, m, b) {
    const y = a ? -1 : 1;
    if (g !== p) {
      for (g += l; e[g % l].skip; )
        g -= y;
      for (; e[p % l].skip; )
        p += y;
      g % l !== p % l && (c.push({
        start: g % l,
        end: p % l,
        loop: m,
        style: b
      }), h = b, d = p % l);
    }
  }
  for (const g of t) {
    d = a ? d : g.start;
    let p = e[d % l], m;
    for (u = d + 1; u <= g.end; u++) {
      const b = e[u % l];
      m = _n(s.setContext(Yt(n, {
        type: "segment",
        p0: p,
        p1: b,
        p0DataIndex: (u - 1) % l,
        p1DataIndex: u % l,
        datasetIndex: r
      }))), wc(m, h) && f(d, u - 1, g.loop, h), p = b, h = m;
    }
    d < u - 1 && f(d, u - 1, g.loop, h);
  }
  return c;
}
function _n(i) {
  return {
    backgroundColor: i.backgroundColor,
    borderCapStyle: i.borderCapStyle,
    borderDash: i.borderDash,
    borderDashOffset: i.borderDashOffset,
    borderJoinStyle: i.borderJoinStyle,
    borderWidth: i.borderWidth,
    borderColor: i.borderColor
  };
}
function wc(i, t) {
  if (!t)
    return !1;
  const e = [], s = function(n, o) {
    return vs(o) ? (e.includes(o) || e.push(o), e.indexOf(o)) : o;
  };
  return JSON.stringify(i, s) !== JSON.stringify(t, s);
}
function qe(i, t, e) {
  return i.options.clip ? i[e] : t[e];
}
function Sc(i, t) {
  const { xScale: e, yScale: s } = i;
  return e && s ? {
    left: qe(e, t, "left"),
    right: qe(e, t, "right"),
    top: qe(s, t, "top"),
    bottom: qe(s, t, "bottom")
  } : t;
}
function Qo(i, t) {
  const e = t._clip;
  if (e.disabled)
    return !1;
  const s = Sc(t, i.chartArea);
  return {
    left: e.left === !1 ? 0 : s.left - (e.left === !0 ? 0 : e.left),
    right: e.right === !1 ? i.width : s.right + (e.right === !0 ? 0 : e.right),
    top: e.top === !1 ? 0 : s.top - (e.top === !0 ? 0 : e.top),
    bottom: e.bottom === !1 ? i.height : s.bottom + (e.bottom === !0 ? 0 : e.bottom)
  };
}
/*!
 * Chart.js v4.5.1
 * https://www.chartjs.org
 * (c) 2025 Chart.js Contributors
 * Released under the MIT License
 */
class kc {
  constructor() {
    this._request = null, this._charts = /* @__PURE__ */ new Map(), this._running = !1, this._lastDate = void 0;
  }
  _notify(t, e, s, n) {
    const o = e.listeners[n], r = e.duration;
    o.forEach((a) => a({
      chart: t,
      initial: e.initial,
      numSteps: r,
      currentStep: Math.min(s - e.start, r)
    }));
  }
  _refresh() {
    this._request || (this._running = !0, this._request = zo.call(window, () => {
      this._update(), this._request = null, this._running && this._refresh();
    }));
  }
  _update(t = Date.now()) {
    let e = 0;
    this._charts.forEach((s, n) => {
      if (!s.running || !s.items.length)
        return;
      const o = s.items;
      let r = o.length - 1, a = !1, l;
      for (; r >= 0; --r)
        l = o[r], l._active ? (l._total > s.duration && (s.duration = l._total), l.tick(t), a = !0) : (o[r] = o[o.length - 1], o.pop());
      a && (n.draw(), this._notify(n, s, t, "progress")), o.length || (s.running = !1, this._notify(n, s, t, "complete"), s.initial = !1), e += o.length;
    }), this._lastDate = t, e === 0 && (this._running = !1);
  }
  _getAnims(t) {
    const e = this._charts;
    let s = e.get(t);
    return s || (s = {
      running: !1,
      initial: !0,
      items: [],
      listeners: {
        complete: [],
        progress: []
      }
    }, e.set(t, s)), s;
  }
  listen(t, e, s) {
    this._getAnims(t).listeners[e].push(s);
  }
  add(t, e) {
    !e || !e.length || this._getAnims(t).items.push(...e);
  }
  has(t) {
    return this._getAnims(t).items.length > 0;
  }
  start(t) {
    const e = this._charts.get(t);
    e && (e.running = !0, e.start = Date.now(), e.duration = e.items.reduce((s, n) => Math.max(s, n._duration), 0), this._refresh());
  }
  running(t) {
    if (!this._running)
      return !1;
    const e = this._charts.get(t);
    return !(!e || !e.running || !e.items.length);
  }
  stop(t) {
    const e = this._charts.get(t);
    if (!e || !e.items.length)
      return;
    const s = e.items;
    let n = s.length - 1;
    for (; n >= 0; --n)
      s[n].cancel();
    e.items = [], this._notify(t, e, Date.now(), "complete");
  }
  remove(t) {
    return this._charts.delete(t);
  }
}
var ut = /* @__PURE__ */ new kc();
const yn = "transparent", Mc = {
  boolean(i, t, e) {
    return e > 0.5 ? t : i;
  },
  color(i, t, e) {
    const s = an(i || yn), n = s.valid && an(t || yn);
    return n && n.valid ? n.mix(s, e).hexString() : t;
  },
  number(i, t, e) {
    return i + (t - i) * e;
  }
};
class Ac {
  constructor(t, e, s, n) {
    const o = e[s];
    n = Ke([
      t.to,
      n,
      o,
      t.from
    ]);
    const r = Ke([
      t.from,
      o,
      n
    ]);
    this._active = !0, this._fn = t.fn || Mc[t.type || typeof r], this._easing = we[t.easing] || we.linear, this._start = Math.floor(Date.now() + (t.delay || 0)), this._duration = this._total = Math.floor(t.duration), this._loop = !!t.loop, this._target = e, this._prop = s, this._from = r, this._to = n, this._promises = void 0;
  }
  active() {
    return this._active;
  }
  update(t, e, s) {
    if (this._active) {
      this._notify(!1);
      const n = this._target[this._prop], o = s - this._start, r = this._duration - o;
      this._start = s, this._duration = Math.floor(Math.max(r, t.duration)), this._total += o, this._loop = !!t.loop, this._to = Ke([
        t.to,
        e,
        n,
        t.from
      ]), this._from = Ke([
        t.from,
        n,
        e
      ]);
    }
  }
  cancel() {
    this._active && (this.tick(Date.now()), this._active = !1, this._notify(!1));
  }
  tick(t) {
    const e = t - this._start, s = this._duration, n = this._prop, o = this._from, r = this._loop, a = this._to;
    let l;
    if (this._active = o !== a && (r || e < s), !this._active) {
      this._target[n] = a, this._notify(!0);
      return;
    }
    if (e < 0) {
      this._target[n] = o;
      return;
    }
    l = e / s % 2, l = r && l > 1 ? 2 - l : l, l = this._easing(Math.min(1, Math.max(0, l))), this._target[n] = this._fn(o, a, l);
  }
  wait() {
    const t = this._promises || (this._promises = []);
    return new Promise((e, s) => {
      t.push({
        res: e,
        rej: s
      });
    });
  }
  _notify(t) {
    const e = t ? "res" : "rej", s = this._promises || [];
    for (let n = 0; n < s.length; n++)
      s[n][e]();
  }
}
class Jo {
  constructor(t, e) {
    this._chart = t, this._properties = /* @__PURE__ */ new Map(), this.configure(e);
  }
  configure(t) {
    if (!A(t))
      return;
    const e = Object.keys(B.animation), s = this._properties;
    Object.getOwnPropertyNames(t).forEach((n) => {
      const o = t[n];
      if (!A(o))
        return;
      const r = {};
      for (const a of e)
        r[a] = o[a];
      (H(o.properties) && o.properties || [
        n
      ]).forEach((a) => {
        (a === n || !s.has(a)) && s.set(a, r);
      });
    });
  }
  _animateOptions(t, e) {
    const s = e.options, n = $c(t, s);
    if (!n)
      return [];
    const o = this._createAnimations(n, s);
    return s.$shared && Pc(t.options.$animations, s).then(() => {
      t.options = s;
    }, () => {
    }), o;
  }
  _createAnimations(t, e) {
    const s = this._properties, n = [], o = t.$animations || (t.$animations = {}), r = Object.keys(e), a = Date.now();
    let l;
    for (l = r.length - 1; l >= 0; --l) {
      const c = r[l];
      if (c.charAt(0) === "$")
        continue;
      if (c === "options") {
        n.push(...this._animateOptions(t, e));
        continue;
      }
      const h = e[c];
      let d = o[c];
      const u = s.get(c);
      if (d)
        if (u && d.active()) {
          d.update(u, h, a);
          continue;
        } else
          d.cancel();
      if (!u || !u.duration) {
        t[c] = h;
        continue;
      }
      o[c] = d = new Ac(u, t, c, h), n.push(d);
    }
    return n;
  }
  update(t, e) {
    if (this._properties.size === 0) {
      Object.assign(t, e);
      return;
    }
    const s = this._createAnimations(t, e);
    if (s.length)
      return ut.add(this._chart, s), !0;
  }
}
function Pc(i, t) {
  const e = [], s = Object.keys(t);
  for (let n = 0; n < s.length; n++) {
    const o = i[s[n]];
    o && o.active() && e.push(o.wait());
  }
  return Promise.all(e);
}
function $c(i, t) {
  if (!t)
    return;
  let e = i.options;
  if (!e) {
    i.options = t;
    return;
  }
  return e.$shared && (i.options = e = Object.assign({}, e, {
    $shared: !1,
    $animations: {}
  })), e;
}
function xn(i, t) {
  const e = i && i.options || {}, s = e.reverse, n = e.min === void 0 ? t : 0, o = e.max === void 0 ? t : 0;
  return {
    start: s ? o : n,
    end: s ? n : o
  };
}
function Cc(i, t, e) {
  if (e === !1)
    return !1;
  const s = xn(i, e), n = xn(t, e);
  return {
    top: n.end,
    right: s.end,
    bottom: n.start,
    left: s.start
  };
}
function Oc(i) {
  let t, e, s, n;
  return A(i) ? (t = i.top, e = i.right, s = i.bottom, n = i.left) : t = e = s = n = i, {
    top: t,
    right: e,
    bottom: s,
    left: n,
    disabled: i === !1
  };
}
function tr(i, t) {
  const e = [], s = i._getSortedDatasetMetas(t);
  let n, o;
  for (n = 0, o = s.length; n < o; ++n)
    e.push(s[n].index);
  return e;
}
function vn(i, t, e, s = {}) {
  const n = i.keys, o = s.mode === "single";
  let r, a, l, c;
  if (t === null)
    return;
  let h = !1;
  for (r = 0, a = n.length; r < a; ++r) {
    if (l = +n[r], l === e) {
      if (h = !0, s.all)
        continue;
      break;
    }
    c = i.values[l], U(c) && (o || t === 0 || ct(t) === ct(c)) && (t += c);
  }
  return !h && !s.all ? 0 : t;
}
function Dc(i, t) {
  const { iScale: e, vScale: s } = t, n = e.axis === "x" ? "x" : "y", o = s.axis === "x" ? "x" : "y", r = Object.keys(i), a = new Array(r.length);
  let l, c, h;
  for (l = 0, c = r.length; l < c; ++l)
    h = r[l], a[l] = {
      [n]: h,
      [o]: i[h]
    };
  return a;
}
function Hi(i, t) {
  const e = i && i.options.stacked;
  return e || e === void 0 && t.stack !== void 0;
}
function Tc(i, t, e) {
  return `${i.id}.${t.id}.${e.stack || e.type}`;
}
function Ec(i) {
  const { min: t, max: e, minDefined: s, maxDefined: n } = i.getUserBounds();
  return {
    min: s ? t : Number.NEGATIVE_INFINITY,
    max: n ? e : Number.POSITIVE_INFINITY
  };
}
function Lc(i, t, e) {
  const s = i[t] || (i[t] = {});
  return s[e] || (s[e] = {});
}
function wn(i, t, e, s) {
  for (const n of t.getMatchingVisibleMetas(s).reverse()) {
    const o = i[n.index];
    if (e && o > 0 || !e && o < 0)
      return n.index;
  }
  return null;
}
function Sn(i, t) {
  const { chart: e, _cachedMeta: s } = i, n = e._stacks || (e._stacks = {}), { iScale: o, vScale: r, index: a } = s, l = o.axis, c = r.axis, h = Tc(o, r, s), d = t.length;
  let u;
  for (let f = 0; f < d; ++f) {
    const g = t[f], { [l]: p, [c]: m } = g, b = g._stacks || (g._stacks = {});
    u = b[c] = Lc(n, h, p), u[a] = m, u._top = wn(u, r, !0, s.type), u._bottom = wn(u, r, !1, s.type);
    const y = u._visualValues || (u._visualValues = {});
    y[a] = m;
  }
}
function Vi(i, t) {
  const e = i.scales;
  return Object.keys(e).filter((s) => e[s].axis === t).shift();
}
function Ic(i, t) {
  return Yt(i, {
    active: !1,
    dataset: void 0,
    datasetIndex: t,
    index: t,
    mode: "default",
    type: "dataset"
  });
}
function Rc(i, t, e) {
  return Yt(i, {
    active: !1,
    dataIndex: t,
    parsed: void 0,
    raw: void 0,
    element: e,
    index: t,
    mode: "default",
    type: "data"
  });
}
function ce(i, t) {
  const e = i.controller.index, s = i.vScale && i.vScale.axis;
  if (s) {
    t = t || i._parsed;
    for (const n of t) {
      const o = n._stacks;
      if (!o || o[s] === void 0 || o[s][e] === void 0)
        return;
      delete o[s][e], o[s]._visualValues !== void 0 && o[s]._visualValues[e] !== void 0 && delete o[s]._visualValues[e];
    }
  }
}
const ji = (i) => i === "reset" || i === "none", kn = (i, t) => t ? i : Object.assign({}, i), Fc = (i, t, e) => i && !t.hidden && t._stacked && {
  keys: tr(e, !0),
  values: null
};
class Zt {
  constructor(t, e) {
    this.chart = t, this._ctx = t.ctx, this.index = e, this._cachedDataOpts = {}, this._cachedMeta = this.getMeta(), this._type = this._cachedMeta.type, this.options = void 0, this._parsing = !1, this._data = void 0, this._objectData = void 0, this._sharedOptions = void 0, this._drawStart = void 0, this._drawCount = void 0, this.enableOptionSharing = !1, this.supportsDecimation = !1, this.$context = void 0, this._syncList = [], this.datasetElementType = new.target.datasetElementType, this.dataElementType = new.target.dataElementType, this.initialize();
  }
  initialize() {
    const t = this._cachedMeta;
    this.configure(), this.linkScales(), t._stacked = Hi(t.vScale, t), this.addElements(), this.options.fill && !this.chart.isPluginEnabled("filler") && console.warn("Tried to use the 'fill' option without the 'Filler' plugin enabled. Please import and register the 'Filler' plugin and make sure it is not disabled in the options");
  }
  updateIndex(t) {
    this.index !== t && ce(this._cachedMeta), this.index = t;
  }
  linkScales() {
    const t = this.chart, e = this._cachedMeta, s = this.getDataset(), n = (d, u, f, g) => d === "x" ? u : d === "r" ? g : f, o = e.xAxisID = $(s.xAxisID, Vi(t, "x")), r = e.yAxisID = $(s.yAxisID, Vi(t, "y")), a = e.rAxisID = $(s.rAxisID, Vi(t, "r")), l = e.indexAxis, c = e.iAxisID = n(l, o, r, a), h = e.vAxisID = n(l, r, o, a);
    e.xScale = this.getScaleForId(o), e.yScale = this.getScaleForId(r), e.rScale = this.getScaleForId(a), e.iScale = this.getScaleForId(c), e.vScale = this.getScaleForId(h);
  }
  getDataset() {
    return this.chart.data.datasets[this.index];
  }
  getMeta() {
    return this.chart.getDatasetMeta(this.index);
  }
  getScaleForId(t) {
    return this.chart.scales[t];
  }
  _getOtherScale(t) {
    const e = this._cachedMeta;
    return t === e.iScale ? e.vScale : e.iScale;
  }
  reset() {
    this._update("reset");
  }
  _destroy() {
    const t = this._cachedMeta;
    this._data && sn(this._data, this), t._stacked && ce(t);
  }
  _dataCheck() {
    const t = this.getDataset(), e = t.data || (t.data = []), s = this._data;
    if (A(e)) {
      const n = this._cachedMeta;
      this._data = Dc(e, n);
    } else if (s !== e) {
      if (s) {
        sn(s, this);
        const n = this._cachedMeta;
        ce(n), n._parsed = [];
      }
      e && Object.isExtensible(e) && ml(e, this), this._syncList = [], this._data = e;
    }
  }
  addElements() {
    const t = this._cachedMeta;
    this._dataCheck(), this.datasetElementType && (t.dataset = new this.datasetElementType());
  }
  buildOrUpdateElements(t) {
    const e = this._cachedMeta, s = this.getDataset();
    let n = !1;
    this._dataCheck();
    const o = e._stacked;
    e._stacked = Hi(e.vScale, e), e.stack !== s.stack && (n = !0, ce(e), e.stack = s.stack), this._resyncElements(t), (n || o !== e._stacked) && (Sn(this, e._parsed), e._stacked = Hi(e.vScale, e));
  }
  configure() {
    const t = this.chart.config, e = t.datasetScopeKeys(this._type), s = t.getOptionScopes(this.getDataset(), e, !0);
    this.options = t.createResolver(s, this.getContext()), this._parsing = this.options.parsing, this._cachedDataOpts = {};
  }
  parse(t, e) {
    const { _cachedMeta: s, _data: n } = this, { iScale: o, _stacked: r } = s, a = o.axis;
    let l = t === 0 && e === n.length ? !0 : s._sorted, c = t > 0 && s._parsed[t - 1], h, d, u;
    if (this._parsing === !1)
      s._parsed = n, s._sorted = !0, u = n;
    else {
      H(n[t]) ? u = this.parseArrayData(s, n, t, e) : A(n[t]) ? u = this.parseObjectData(s, n, t, e) : u = this.parsePrimitiveData(s, n, t, e);
      const f = () => d[a] === null || c && d[a] < c[a];
      for (h = 0; h < e; ++h)
        s._parsed[h + t] = d = u[h], l && (f() && (l = !1), c = d);
      s._sorted = l;
    }
    r && Sn(this, u);
  }
  parsePrimitiveData(t, e, s, n) {
    const { iScale: o, vScale: r } = t, a = o.axis, l = r.axis, c = o.getLabels(), h = o === r, d = new Array(n);
    let u, f, g;
    for (u = 0, f = n; u < f; ++u)
      g = u + s, d[u] = {
        [a]: h || o.parse(c[g], g),
        [l]: r.parse(e[g], g)
      };
    return d;
  }
  parseArrayData(t, e, s, n) {
    const { xScale: o, yScale: r } = t, a = new Array(n);
    let l, c, h, d;
    for (l = 0, c = n; l < c; ++l)
      h = l + s, d = e[h], a[l] = {
        x: o.parse(d[0], h),
        y: r.parse(d[1], h)
      };
    return a;
  }
  parseObjectData(t, e, s, n) {
    const { xScale: o, yScale: r } = t, { xAxisKey: a = "x", yAxisKey: l = "y" } = this._parsing, c = new Array(n);
    let h, d, u, f;
    for (h = 0, d = n; h < d; ++h)
      u = h + s, f = e[u], c[h] = {
        x: o.parse(Jt(f, a), u),
        y: r.parse(Jt(f, l), u)
      };
    return c;
  }
  getParsed(t) {
    return this._cachedMeta._parsed[t];
  }
  getDataElement(t) {
    return this._cachedMeta.data[t];
  }
  applyStack(t, e, s) {
    const n = this.chart, o = this._cachedMeta, r = e[t.axis], a = {
      keys: tr(n, !0),
      values: e._stacks[t.axis]._visualValues
    };
    return vn(a, r, o.index, {
      mode: s
    });
  }
  updateRangeFromParsed(t, e, s, n) {
    const o = s[e.axis];
    let r = o === null ? NaN : o;
    const a = n && s._stacks[e.axis];
    n && a && (n.values = a, r = vn(n, o, this._cachedMeta.index)), t.min = Math.min(t.min, r), t.max = Math.max(t.max, r);
  }
  getMinMax(t, e) {
    const s = this._cachedMeta, n = s._parsed, o = s._sorted && t === s.iScale, r = n.length, a = this._getOtherScale(t), l = Fc(e, s, this.chart), c = {
      min: Number.POSITIVE_INFINITY,
      max: Number.NEGATIVE_INFINITY
    }, { min: h, max: d } = Ec(a);
    let u, f;
    function g() {
      f = n[u];
      const p = f[a.axis];
      return !U(f[t.axis]) || h > p || d < p;
    }
    for (u = 0; u < r && !(!g() && (this.updateRangeFromParsed(c, t, f, l), o)); ++u)
      ;
    if (o) {
      for (u = r - 1; u >= 0; --u)
        if (!g()) {
          this.updateRangeFromParsed(c, t, f, l);
          break;
        }
    }
    return c;
  }
  getAllParsedValues(t) {
    const e = this._cachedMeta._parsed, s = [];
    let n, o, r;
    for (n = 0, o = e.length; n < o; ++n)
      r = e[n][t.axis], U(r) && s.push(r);
    return s;
  }
  getMaxOverflow() {
    return !1;
  }
  getLabelAndValue(t) {
    const e = this._cachedMeta, s = e.iScale, n = e.vScale, o = this.getParsed(t);
    return {
      label: s ? "" + s.getLabelForValue(o[s.axis]) : "",
      value: n ? "" + n.getLabelForValue(o[n.axis]) : ""
    };
  }
  _update(t) {
    const e = this._cachedMeta;
    this.update(t || "default"), e._clip = Oc($(this.options.clip, Cc(e.xScale, e.yScale, this.getMaxOverflow())));
  }
  update(t) {
  }
  draw() {
    const t = this._ctx, e = this.chart, s = this._cachedMeta, n = s.data || [], o = e.chartArea, r = [], a = this._drawStart || 0, l = this._drawCount || n.length - a, c = this.options.drawActiveElementsOnTop;
    let h;
    for (s.dataset && s.dataset.draw(t, o, a, l), h = a; h < a + l; ++h) {
      const d = n[h];
      d.hidden || (d.active && c ? r.push(d) : d.draw(t, o));
    }
    for (h = 0; h < r.length; ++h)
      r[h].draw(t, o);
  }
  getStyle(t, e) {
    const s = e ? "active" : "default";
    return t === void 0 && this._cachedMeta.dataset ? this.resolveDatasetElementOptions(s) : this.resolveDataElementOptions(t || 0, s);
  }
  getContext(t, e, s) {
    const n = this.getDataset();
    let o;
    if (t >= 0 && t < this._cachedMeta.data.length) {
      const r = this._cachedMeta.data[t];
      o = r.$context || (r.$context = Rc(this.getContext(), t, r)), o.parsed = this.getParsed(t), o.raw = n.data[t], o.index = o.dataIndex = t;
    } else
      o = this.$context || (this.$context = Ic(this.chart.getContext(), this.index)), o.dataset = n, o.index = o.datasetIndex = this.index;
    return o.active = !!e, o.mode = s, o;
  }
  resolveDatasetElementOptions(t) {
    return this._resolveElementOptions(this.datasetElementType.id, t);
  }
  resolveDataElementOptions(t, e) {
    return this._resolveElementOptions(this.dataElementType.id, e, t);
  }
  _resolveElementOptions(t, e = "default", s) {
    const n = e === "active", o = this._cachedDataOpts, r = t + "-" + e, a = o[r], l = this.enableOptionSharing && De(s);
    if (a)
      return kn(a, l);
    const c = this.chart.config, h = c.datasetElementScopeKeys(this._type, t), d = n ? [
      `${t}Hover`,
      "hover",
      t,
      ""
    ] : [
      t,
      ""
    ], u = c.getOptionScopes(this.getDataset(), h), f = Object.keys(B.elements[t]), g = () => this.getContext(s, n, e), p = c.resolveNamedOptions(u, f, g, d);
    return p.$shared && (p.$shared = l, o[r] = Object.freeze(kn(p, l))), p;
  }
  _resolveAnimations(t, e, s) {
    const n = this.chart, o = this._cachedDataOpts, r = `animation-${e}`, a = o[r];
    if (a)
      return a;
    let l;
    if (n.options.animation !== !1) {
      const h = this.chart.config, d = h.datasetAnimationScopeKeys(this._type, e), u = h.getOptionScopes(this.getDataset(), d);
      l = h.createResolver(u, this.getContext(t, s, e));
    }
    const c = new Jo(n, l && l.animations);
    return l && l._cacheable && (o[r] = Object.freeze(c)), c;
  }
  getSharedOptions(t) {
    if (t.$shared)
      return this._sharedOptions || (this._sharedOptions = Object.assign({}, t));
  }
  includeOptions(t, e) {
    return !e || ji(t) || this.chart._animationsDisabled;
  }
  _getSharedOptions(t, e) {
    const s = this.resolveDataElementOptions(t, e), n = this._sharedOptions, o = this.getSharedOptions(s), r = this.includeOptions(e, o) || o !== n;
    return this.updateSharedOptions(o, e, s), {
      sharedOptions: o,
      includeOptions: r
    };
  }
  updateElement(t, e, s, n) {
    ji(n) ? Object.assign(t, s) : this._resolveAnimations(e, n).update(t, s);
  }
  updateSharedOptions(t, e, s) {
    t && !ji(e) && this._resolveAnimations(void 0, e).update(t, s);
  }
  _setStyle(t, e, s, n) {
    t.active = n;
    const o = this.getStyle(e, n);
    this._resolveAnimations(e, s, n).update(t, {
      options: !n && this.getSharedOptions(o) || o
    });
  }
  removeHoverStyle(t, e, s) {
    this._setStyle(t, s, "active", !1);
  }
  setHoverStyle(t, e, s) {
    this._setStyle(t, s, "active", !0);
  }
  _removeDatasetHoverStyle() {
    const t = this._cachedMeta.dataset;
    t && this._setStyle(t, void 0, "active", !1);
  }
  _setDatasetHoverStyle() {
    const t = this._cachedMeta.dataset;
    t && this._setStyle(t, void 0, "active", !0);
  }
  _resyncElements(t) {
    const e = this._data, s = this._cachedMeta.data;
    for (const [a, l, c] of this._syncList)
      this[a](l, c);
    this._syncList = [];
    const n = s.length, o = e.length, r = Math.min(o, n);
    r && this.parse(0, r), o > n ? this._insertElements(n, o - n, t) : o < n && this._removeElements(o, n - o);
  }
  _insertElements(t, e, s = !0) {
    const n = this._cachedMeta, o = n.data, r = t + e;
    let a;
    const l = (c) => {
      for (c.length += e, a = c.length - 1; a >= r; a--)
        c[a] = c[a - e];
    };
    for (l(o), a = t; a < r; ++a)
      o[a] = new this.dataElementType();
    this._parsing && l(n._parsed), this.parse(t, e), s && this.updateElements(o, t, e, "reset");
  }
  updateElements(t, e, s, n) {
  }
  _removeElements(t, e) {
    const s = this._cachedMeta;
    if (this._parsing) {
      const n = s._parsed.splice(t, e);
      s._stacked && ce(s, n);
    }
    s.data.splice(t, e);
  }
  _sync(t) {
    if (this._parsing)
      this._syncList.push(t);
    else {
      const [e, s, n] = t;
      this[e](s, n);
    }
    this.chart._dataChanges.push([
      this.index,
      ...t
    ]);
  }
  _onDataPush() {
    const t = arguments.length;
    this._sync([
      "_insertElements",
      this.getDataset().data.length - t,
      t
    ]);
  }
  _onDataPop() {
    this._sync([
      "_removeElements",
      this._cachedMeta.data.length - 1,
      1
    ]);
  }
  _onDataShift() {
    this._sync([
      "_removeElements",
      0,
      1
    ]);
  }
  _onDataSplice(t, e) {
    e && this._sync([
      "_removeElements",
      t,
      e
    ]);
    const s = arguments.length - 2;
    s && this._sync([
      "_insertElements",
      t,
      s
    ]);
  }
  _onDataUnshift() {
    this._sync([
      "_insertElements",
      0,
      arguments.length
    ]);
  }
}
S(Zt, "defaults", {}), S(Zt, "datasetElementType", null), S(Zt, "dataElementType", null);
function zc(i, t) {
  if (!i._cache.$bar) {
    const e = i.getMatchingVisibleMetas(t);
    let s = [];
    for (let n = 0, o = e.length; n < o; n++)
      s = s.concat(e[n].controller.getAllParsedValues(i));
    i._cache.$bar = Fo(s.sort((n, o) => n - o));
  }
  return i._cache.$bar;
}
function Bc(i) {
  const t = i.iScale, e = zc(t, i.type);
  let s = t._length, n, o, r, a;
  const l = () => {
    r === 32767 || r === -32768 || (De(a) && (s = Math.min(s, Math.abs(r - a) || s)), a = r);
  };
  for (n = 0, o = e.length; n < o; ++n)
    r = t.getPixelForValue(e[n]), l();
  for (a = void 0, n = 0, o = t.ticks.length; n < o; ++n)
    r = t.getPixelForTick(n), l();
  return s;
}
function Nc(i, t, e, s) {
  const n = e.barThickness;
  let o, r;
  return C(n) ? (o = t.min * e.categoryPercentage, r = e.barPercentage) : (o = n * s, r = 1), {
    chunk: o / s,
    ratio: r,
    start: t.pixels[i] - o / 2
  };
}
function Hc(i, t, e, s) {
  const n = t.pixels, o = n[i];
  let r = i > 0 ? n[i - 1] : null, a = i < n.length - 1 ? n[i + 1] : null;
  const l = e.categoryPercentage;
  r === null && (r = o - (a === null ? t.end - t.start : a - o)), a === null && (a = o + o - r);
  const c = o - (o - Math.min(r, a)) / 2 * l;
  return {
    chunk: Math.abs(a - r) / 2 * l / s,
    ratio: e.barPercentage,
    start: c
  };
}
function Vc(i, t, e, s) {
  const n = e.parse(i[0], s), o = e.parse(i[1], s), r = Math.min(n, o), a = Math.max(n, o);
  let l = r, c = a;
  Math.abs(r) > Math.abs(a) && (l = a, c = r), t[e.axis] = c, t._custom = {
    barStart: l,
    barEnd: c,
    start: n,
    end: o,
    min: r,
    max: a
  };
}
function er(i, t, e, s) {
  return H(i) ? Vc(i, t, e, s) : t[e.axis] = e.parse(i, s), t;
}
function Mn(i, t, e, s) {
  const n = i.iScale, o = i.vScale, r = n.getLabels(), a = n === o, l = [];
  let c, h, d, u;
  for (c = e, h = e + s; c < h; ++c)
    u = t[c], d = {}, d[n.axis] = a || n.parse(r[c], c), l.push(er(u, d, o, c));
  return l;
}
function Wi(i) {
  return i && i.barStart !== void 0 && i.barEnd !== void 0;
}
function jc(i, t, e) {
  return i !== 0 ? ct(i) : (t.isHorizontal() ? 1 : -1) * (t.min >= e ? 1 : -1);
}
function Wc(i) {
  let t, e, s, n, o;
  return i.horizontal ? (t = i.base > i.x, e = "left", s = "right") : (t = i.base < i.y, e = "bottom", s = "top"), t ? (n = "end", o = "start") : (n = "start", o = "end"), {
    start: e,
    end: s,
    reverse: t,
    top: n,
    bottom: o
  };
}
function Uc(i, t, e, s) {
  let n = t.borderSkipped;
  const o = {};
  if (!n) {
    i.borderSkipped = o;
    return;
  }
  if (n === !0) {
    i.borderSkipped = {
      top: !0,
      right: !0,
      bottom: !0,
      left: !0
    };
    return;
  }
  const { start: r, end: a, reverse: l, top: c, bottom: h } = Wc(i);
  n === "middle" && e && (i.enableBorderRadius = !0, (e._top || 0) === s ? n = c : (e._bottom || 0) === s ? n = h : (o[An(h, r, a, l)] = !0, n = c)), o[An(n, r, a, l)] = !0, i.borderSkipped = o;
}
function An(i, t, e, s) {
  return s ? (i = Yc(i, t, e), i = Pn(i, e, t)) : i = Pn(i, t, e), i;
}
function Yc(i, t, e) {
  return i === t ? e : i === e ? t : i;
}
function Pn(i, t, e) {
  return i === "start" ? t : i === "end" ? e : i;
}
function Kc(i, { inflateAmount: t }, e) {
  i.inflateAmount = t === "auto" ? e === 1 ? 0.33 : 0 : t;
}
class oi extends Zt {
  parsePrimitiveData(t, e, s, n) {
    return Mn(t, e, s, n);
  }
  parseArrayData(t, e, s, n) {
    return Mn(t, e, s, n);
  }
  parseObjectData(t, e, s, n) {
    const { iScale: o, vScale: r } = t, { xAxisKey: a = "x", yAxisKey: l = "y" } = this._parsing, c = o.axis === "x" ? a : l, h = r.axis === "x" ? a : l, d = [];
    let u, f, g, p;
    for (u = s, f = s + n; u < f; ++u)
      p = e[u], g = {}, g[o.axis] = o.parse(Jt(p, c), u), d.push(er(Jt(p, h), g, r, u));
    return d;
  }
  updateRangeFromParsed(t, e, s, n) {
    super.updateRangeFromParsed(t, e, s, n);
    const o = s._custom;
    o && e === this._cachedMeta.vScale && (t.min = Math.min(t.min, o.min), t.max = Math.max(t.max, o.max));
  }
  getMaxOverflow() {
    return 0;
  }
  getLabelAndValue(t) {
    const e = this._cachedMeta, { iScale: s, vScale: n } = e, o = this.getParsed(t), r = o._custom, a = Wi(r) ? "[" + r.start + ", " + r.end + "]" : "" + n.getLabelForValue(o[n.axis]);
    return {
      label: "" + s.getLabelForValue(o[s.axis]),
      value: a
    };
  }
  initialize() {
    this.enableOptionSharing = !0, super.initialize();
    const t = this._cachedMeta;
    t.stack = this.getDataset().stack;
  }
  update(t) {
    const e = this._cachedMeta;
    this.updateElements(e.data, 0, e.data.length, t);
  }
  updateElements(t, e, s, n) {
    const o = n === "reset", { index: r, _cachedMeta: { vScale: a } } = this, l = a.getBasePixel(), c = a.isHorizontal(), h = this._getRuler(), { sharedOptions: d, includeOptions: u } = this._getSharedOptions(e, n);
    for (let f = e; f < e + s; f++) {
      const g = this.getParsed(f), p = o || C(g[a.axis]) ? {
        base: l,
        head: l
      } : this._calculateBarValuePixels(f), m = this._calculateBarIndexPixels(f, h), b = (g._stacks || {})[a.axis], y = {
        horizontal: c,
        base: p.base,
        enableBorderRadius: !b || Wi(g._custom) || r === b._top || r === b._bottom,
        x: c ? p.head : m.center,
        y: c ? m.center : p.head,
        height: c ? m.size : Math.abs(p.size),
        width: c ? Math.abs(p.size) : m.size
      };
      u && (y.options = d || this.resolveDataElementOptions(f, t[f].active ? "active" : n));
      const v = y.options || t[f].options;
      Uc(y, v, b, r), Kc(y, v, h.ratio), this.updateElement(t[f], f, y, n);
    }
  }
  _getStacks(t, e) {
    const { iScale: s } = this._cachedMeta, n = s.getMatchingVisibleMetas(this._type).filter((h) => h.controller.options.grouped), o = s.options.stacked, r = [], a = this._cachedMeta.controller.getParsed(e), l = a && a[s.axis], c = (h) => {
      const d = h._parsed.find((f) => f[s.axis] === l), u = d && d[h.vScale.axis];
      if (C(u) || isNaN(u))
        return !0;
    };
    for (const h of n)
      if (!(e !== void 0 && c(h)) && ((o === !1 || r.indexOf(h.stack) === -1 || o === void 0 && h.stack === void 0) && r.push(h.stack), h.index === t))
        break;
    return r.length || r.push(void 0), r;
  }
  _getStackCount(t) {
    return this._getStacks(void 0, t).length;
  }
  _getAxisCount() {
    return this._getAxis().length;
  }
  getFirstScaleIdForIndexAxis() {
    const t = this.chart.scales, e = this.chart.options.indexAxis;
    return Object.keys(t).filter((s) => t[s].axis === e).shift();
  }
  _getAxis() {
    const t = {}, e = this.getFirstScaleIdForIndexAxis();
    for (const s of this.chart.data.datasets)
      t[$(this.chart.options.indexAxis === "x" ? s.xAxisID : s.yAxisID, e)] = !0;
    return Object.keys(t);
  }
  _getStackIndex(t, e, s) {
    const n = this._getStacks(t, s), o = e !== void 0 ? n.indexOf(e) : -1;
    return o === -1 ? n.length - 1 : o;
  }
  _getRuler() {
    const t = this.options, e = this._cachedMeta, s = e.iScale, n = [];
    let o, r;
    for (o = 0, r = e.data.length; o < r; ++o)
      n.push(s.getPixelForValue(this.getParsed(o)[s.axis], o));
    const a = t.barThickness;
    return {
      min: a || Bc(e),
      pixels: n,
      start: s._startPixel,
      end: s._endPixel,
      stackCount: this._getStackCount(),
      scale: s,
      grouped: t.grouped,
      ratio: a ? 1 : t.categoryPercentage * t.barPercentage
    };
  }
  _calculateBarValuePixels(t) {
    const { _cachedMeta: { vScale: e, _stacked: s, index: n }, options: { base: o, minBarLength: r } } = this, a = o || 0, l = this.getParsed(t), c = l._custom, h = Wi(c);
    let d = l[e.axis], u = 0, f = s ? this.applyStack(e, l, s) : d, g, p;
    f !== d && (u = f - d, f = d), h && (d = c.barStart, f = c.barEnd - c.barStart, d !== 0 && ct(d) !== ct(c.barEnd) && (u = 0), u += d);
    const m = !C(o) && !h ? o : u;
    let b = e.getPixelForValue(m);
    if (this.chart.getDataVisibility(t) ? g = e.getPixelForValue(u + f) : g = b, p = g - b, Math.abs(p) < r) {
      p = jc(p, e, a) * r, d === a && (b -= p / 2);
      const y = e.getPixelForDecimal(0), v = e.getPixelForDecimal(1), x = Math.min(y, v), _ = Math.max(y, v);
      b = Math.max(Math.min(b, _), x), g = b + p, s && !h && (l._stacks[e.axis]._visualValues[n] = e.getValueForPixel(g) - e.getValueForPixel(b));
    }
    if (b === e.getPixelForValue(a)) {
      const y = ct(p) * e.getLineWidthForValue(a) / 2;
      b += y, p -= y;
    }
    return {
      size: p,
      base: b,
      head: g,
      center: g + p / 2
    };
  }
  _calculateBarIndexPixels(t, e) {
    const s = e.scale, n = this.options, o = n.skipNull, r = $(n.maxBarThickness, 1 / 0);
    let a, l;
    const c = this._getAxisCount();
    if (e.grouped) {
      const h = o ? this._getStackCount(t) : e.stackCount, d = n.barThickness === "flex" ? Hc(t, e, n, h * c) : Nc(t, e, n, h * c), u = this.chart.options.indexAxis === "x" ? this.getDataset().xAxisID : this.getDataset().yAxisID, f = this._getAxis().indexOf($(u, this.getFirstScaleIdForIndexAxis())), g = this._getStackIndex(this.index, this._cachedMeta.stack, o ? t : void 0) + f;
      a = d.start + d.chunk * g + d.chunk / 2, l = Math.min(r, d.chunk * d.ratio);
    } else
      a = s.getPixelForValue(this.getParsed(t)[s.axis], t), l = Math.min(r, e.min * e.ratio);
    return {
      base: a - l / 2,
      head: a + l / 2,
      center: a,
      size: l
    };
  }
  draw() {
    const t = this._cachedMeta, e = t.vScale, s = t.data, n = s.length;
    let o = 0;
    for (; o < n; ++o)
      this.getParsed(o)[e.axis] !== null && !s[o].hidden && s[o].draw(this._ctx);
  }
}
S(oi, "id", "bar"), S(oi, "defaults", {
  datasetElementType: !1,
  dataElementType: "bar",
  categoryPercentage: 0.8,
  barPercentage: 0.9,
  grouped: !0,
  animations: {
    numbers: {
      type: "number",
      properties: [
        "x",
        "y",
        "base",
        "width",
        "height"
      ]
    }
  }
}), S(oi, "overrides", {
  scales: {
    _index_: {
      type: "category",
      offset: !0,
      grid: {
        offset: !0
      }
    },
    _value_: {
      type: "linear",
      beginAtZero: !0
    }
  }
});
class ri extends Zt {
  initialize() {
    this.enableOptionSharing = !0, this.supportsDecimation = !0, super.initialize();
  }
  update(t) {
    const e = this._cachedMeta, { dataset: s, data: n = [], _dataset: o } = e, r = this.chart._animationsDisabled;
    let { start: a, count: l } = yl(e, n, r);
    this._drawStart = a, this._drawCount = l, xl(e) && (a = 0, l = n.length), s._chart = this.chart, s._datasetIndex = this.index, s._decimated = !!o._decimated, s.points = n;
    const c = this.resolveDatasetElementOptions(t);
    this.options.showLine || (c.borderWidth = 0), c.segment = this.options.segment, this.updateElement(s, void 0, {
      animated: !r,
      options: c
    }, t), this.updateElements(n, a, l, t);
  }
  updateElements(t, e, s, n) {
    const o = n === "reset", { iScale: r, vScale: a, _stacked: l, _dataset: c } = this._cachedMeta, { sharedOptions: h, includeOptions: d } = this._getSharedOptions(e, n), u = r.axis, f = a.axis, { spanGaps: g, segment: p } = this.options, m = Te(g) ? g : Number.POSITIVE_INFINITY, b = this.chart._animationsDisabled || o || n === "none", y = e + s, v = t.length;
    let x = e > 0 && this.getParsed(e - 1);
    for (let _ = 0; _ < v; ++_) {
      const M = t[_], w = b ? M : {};
      if (_ < e || _ >= y) {
        w.skip = !0;
        continue;
      }
      const k = this.getParsed(_), P = C(k[f]), L = w[u] = r.getPixelForValue(k[u], _), I = w[f] = o || P ? a.getBasePixel() : a.getPixelForValue(l ? this.applyStack(a, k, l) : k[f], _);
      w.skip = isNaN(L) || isNaN(I) || P, w.stop = _ > 0 && Math.abs(k[u] - x[u]) > m, p && (w.parsed = k, w.raw = c.data[_]), d && (w.options = h || this.resolveDataElementOptions(_, M.active ? "active" : n)), b || this.updateElement(M, _, w, n), x = k;
    }
  }
  getMaxOverflow() {
    const t = this._cachedMeta, e = t.dataset, s = e.options && e.options.borderWidth || 0, n = t.data || [];
    if (!n.length)
      return s;
    const o = n[0].size(this.resolveDataElementOptions(0)), r = n[n.length - 1].size(this.resolveDataElementOptions(n.length - 1));
    return Math.max(s, o, r) / 2;
  }
  draw() {
    const t = this._cachedMeta;
    t.dataset.updateControlPoints(this.chart.chartArea, t.iScale.axis), super.draw();
  }
}
S(ri, "id", "line"), S(ri, "defaults", {
  datasetElementType: "line",
  dataElementType: "point",
  showLine: !0,
  spanGaps: !1
}), S(ri, "overrides", {
  scales: {
    _index_: {
      type: "category"
    },
    _value_: {
      type: "linear"
    }
  }
});
function It() {
  throw new Error("This method is not implemented: Check that a complete date adapter is provided.");
}
class Cs {
  constructor(t) {
    S(this, "options");
    this.options = t || {};
  }
  /**
  * Override default date adapter methods.
  * Accepts type parameter to define options type.
  * @example
  * Chart._adapters._date.override<{myAdapterOption: string}>({
  *   init() {
  *     console.log(this.options.myAdapterOption);
  *   }
  * })
  */
  static override(t) {
    Object.assign(Cs.prototype, t);
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  init() {
  }
  formats() {
    return It();
  }
  parse() {
    return It();
  }
  format() {
    return It();
  }
  add() {
    return It();
  }
  diff() {
    return It();
  }
  startOf() {
    return It();
  }
  endOf() {
    return It();
  }
}
var Xc = {
  _date: Cs
};
function qc(i, t, e, s) {
  const { controller: n, data: o, _sorted: r } = i, a = n._cachedMeta.iScale, l = i.dataset && i.dataset.options ? i.dataset.options.spanGaps : null;
  if (a && t === a.axis && t !== "r" && r && o.length) {
    const c = a._reversePixels ? pl : Ht;
    if (s) {
      if (n._sharedOptions) {
        const h = o[0], d = typeof h.getRange == "function" && h.getRange(t);
        if (d) {
          const u = c(o, t, e - d), f = c(o, t, e + d);
          return {
            lo: u.lo,
            hi: f.hi
          };
        }
      }
    } else {
      const h = c(o, t, e);
      if (l) {
        const { vScale: d } = n._cachedMeta, { _parsed: u } = i, f = u.slice(0, h.lo + 1).reverse().findIndex((p) => !C(p[d.axis]));
        h.lo -= Math.max(0, f);
        const g = u.slice(h.hi).findIndex((p) => !C(p[d.axis]));
        h.hi += Math.max(0, g);
      }
      return h;
    }
  }
  return {
    lo: 0,
    hi: o.length - 1
  };
}
function Oi(i, t, e, s, n) {
  const o = i.getSortedVisibleDatasetMetas(), r = e[t];
  for (let a = 0, l = o.length; a < l; ++a) {
    const { index: c, data: h } = o[a], { lo: d, hi: u } = qc(o[a], t, r, n);
    for (let f = d; f <= u; ++f) {
      const g = h[f];
      g.skip || s(g, c, f);
    }
  }
}
function Gc(i) {
  const t = i.indexOf("x") !== -1, e = i.indexOf("y") !== -1;
  return function(s, n) {
    const o = t ? Math.abs(s.x - n.x) : 0, r = e ? Math.abs(s.y - n.y) : 0;
    return Math.sqrt(Math.pow(o, 2) + Math.pow(r, 2));
  };
}
function Ui(i, t, e, s, n) {
  const o = [];
  return !n && !i.isPointInArea(t) || Oi(i, e, t, function(a, l, c) {
    !n && !Ee(a, i.chartArea, 0) || a.inRange(t.x, t.y, s) && o.push({
      element: a,
      datasetIndex: l,
      index: c
    });
  }, !0), o;
}
function Zc(i, t, e, s) {
  let n = [];
  function o(r, a, l) {
    const { startAngle: c, endAngle: h } = r.getProps([
      "startAngle",
      "endAngle"
    ], s), { angle: d } = dl(r, {
      x: t.x,
      y: t.y
    });
    Io(d, c, h) && n.push({
      element: r,
      datasetIndex: a,
      index: l
    });
  }
  return Oi(i, e, t, o), n;
}
function Qc(i, t, e, s, n, o) {
  let r = [];
  const a = Gc(e);
  let l = Number.POSITIVE_INFINITY;
  function c(h, d, u) {
    const f = h.inRange(t.x, t.y, n);
    if (s && !f)
      return;
    const g = h.getCenterPoint(n);
    if (!(!!o || i.isPointInArea(g)) && !f)
      return;
    const m = a(t, g);
    m < l ? (r = [
      {
        element: h,
        datasetIndex: d,
        index: u
      }
    ], l = m) : m === l && r.push({
      element: h,
      datasetIndex: d,
      index: u
    });
  }
  return Oi(i, e, t, c), r;
}
function Yi(i, t, e, s, n, o) {
  return !o && !i.isPointInArea(t) ? [] : e === "r" && !s ? Zc(i, t, e, n) : Qc(i, t, e, s, n, o);
}
function $n(i, t, e, s, n) {
  const o = [], r = e === "x" ? "inXRange" : "inYRange";
  let a = !1;
  return Oi(i, e, t, (l, c, h) => {
    l[r] && l[r](t[e], n) && (o.push({
      element: l,
      datasetIndex: c,
      index: h
    }), a = a || l.inRange(t.x, t.y, n));
  }), s && !a ? [] : o;
}
var Jc = {
  modes: {
    index(i, t, e, s) {
      const n = Ft(t, i), o = e.axis || "x", r = e.includeInvisible || !1, a = e.intersect ? Ui(i, n, o, s, r) : Yi(i, n, o, !1, s, r), l = [];
      return a.length ? (i.getSortedVisibleDatasetMetas().forEach((c) => {
        const h = a[0].index, d = c.data[h];
        d && !d.skip && l.push({
          element: d,
          datasetIndex: c.index,
          index: h
        });
      }), l) : [];
    },
    dataset(i, t, e, s) {
      const n = Ft(t, i), o = e.axis || "xy", r = e.includeInvisible || !1;
      let a = e.intersect ? Ui(i, n, o, s, r) : Yi(i, n, o, !1, s, r);
      if (a.length > 0) {
        const l = a[0].datasetIndex, c = i.getDatasetMeta(l).data;
        a = [];
        for (let h = 0; h < c.length; ++h)
          a.push({
            element: c[h],
            datasetIndex: l,
            index: h
          });
      }
      return a;
    },
    point(i, t, e, s) {
      const n = Ft(t, i), o = e.axis || "xy", r = e.includeInvisible || !1;
      return Ui(i, n, o, s, r);
    },
    nearest(i, t, e, s) {
      const n = Ft(t, i), o = e.axis || "xy", r = e.includeInvisible || !1;
      return Yi(i, n, o, e.intersect, s, r);
    },
    x(i, t, e, s) {
      const n = Ft(t, i);
      return $n(i, n, "x", e.intersect, s);
    },
    y(i, t, e, s) {
      const n = Ft(t, i);
      return $n(i, n, "y", e.intersect, s);
    }
  }
};
const ir = [
  "left",
  "top",
  "right",
  "bottom"
];
function he(i, t) {
  return i.filter((e) => e.pos === t);
}
function Cn(i, t) {
  return i.filter((e) => ir.indexOf(e.pos) === -1 && e.box.axis === t);
}
function de(i, t) {
  return i.sort((e, s) => {
    const n = t ? s : e, o = t ? e : s;
    return n.weight === o.weight ? n.index - o.index : n.weight - o.weight;
  });
}
function th(i) {
  const t = [];
  let e, s, n, o, r, a;
  for (e = 0, s = (i || []).length; e < s; ++e)
    n = i[e], { position: o, options: { stack: r, stackWeight: a = 1 } } = n, t.push({
      index: e,
      box: n,
      pos: o,
      horizontal: n.isHorizontal(),
      weight: n.weight,
      stack: r && o + r,
      stackWeight: a
    });
  return t;
}
function eh(i) {
  const t = {};
  for (const e of i) {
    const { stack: s, pos: n, stackWeight: o } = e;
    if (!s || !ir.includes(n))
      continue;
    const r = t[s] || (t[s] = {
      count: 0,
      placed: 0,
      weight: 0,
      size: 0
    });
    r.count++, r.weight += o;
  }
  return t;
}
function ih(i, t) {
  const e = eh(i), { vBoxMaxWidth: s, hBoxMaxHeight: n } = t;
  let o, r, a;
  for (o = 0, r = i.length; o < r; ++o) {
    a = i[o];
    const { fullSize: l } = a.box, c = e[a.stack], h = c && a.stackWeight / c.weight;
    a.horizontal ? (a.width = h ? h * s : l && t.availableWidth, a.height = n) : (a.width = s, a.height = h ? h * n : l && t.availableHeight);
  }
  return e;
}
function sh(i) {
  const t = th(i), e = de(t.filter((c) => c.box.fullSize), !0), s = de(he(t, "left"), !0), n = de(he(t, "right")), o = de(he(t, "top"), !0), r = de(he(t, "bottom")), a = Cn(t, "x"), l = Cn(t, "y");
  return {
    fullSize: e,
    leftAndTop: s.concat(o),
    rightAndBottom: n.concat(l).concat(r).concat(a),
    chartArea: he(t, "chartArea"),
    vertical: s.concat(n).concat(l),
    horizontal: o.concat(r).concat(a)
  };
}
function On(i, t, e, s) {
  return Math.max(i[e], t[e]) + Math.max(i[s], t[s]);
}
function sr(i, t) {
  i.top = Math.max(i.top, t.top), i.left = Math.max(i.left, t.left), i.bottom = Math.max(i.bottom, t.bottom), i.right = Math.max(i.right, t.right);
}
function nh(i, t, e, s) {
  const { pos: n, box: o } = e, r = i.maxPadding;
  if (!A(n)) {
    e.size && (i[n] -= e.size);
    const d = s[e.stack] || {
      size: 0,
      count: 1
    };
    d.size = Math.max(d.size, e.horizontal ? o.height : o.width), e.size = d.size / d.count, i[n] += e.size;
  }
  o.getPadding && sr(r, o.getPadding());
  const a = Math.max(0, t.outerWidth - On(r, i, "left", "right")), l = Math.max(0, t.outerHeight - On(r, i, "top", "bottom")), c = a !== i.w, h = l !== i.h;
  return i.w = a, i.h = l, e.horizontal ? {
    same: c,
    other: h
  } : {
    same: h,
    other: c
  };
}
function oh(i) {
  const t = i.maxPadding;
  function e(s) {
    const n = Math.max(t[s] - i[s], 0);
    return i[s] += n, n;
  }
  i.y += e("top"), i.x += e("left"), e("right"), e("bottom");
}
function rh(i, t) {
  const e = t.maxPadding;
  function s(n) {
    const o = {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0
    };
    return n.forEach((r) => {
      o[r] = Math.max(t[r], e[r]);
    }), o;
  }
  return s(i ? [
    "left",
    "right"
  ] : [
    "top",
    "bottom"
  ]);
}
function ge(i, t, e, s) {
  const n = [];
  let o, r, a, l, c, h;
  for (o = 0, r = i.length, c = 0; o < r; ++o) {
    a = i[o], l = a.box, l.update(a.width || t.w, a.height || t.h, rh(a.horizontal, t));
    const { same: d, other: u } = nh(t, e, a, s);
    c |= d && n.length, h = h || u, l.fullSize || n.push(a);
  }
  return c && ge(n, t, e, s) || h;
}
function Ge(i, t, e, s, n) {
  i.top = e, i.left = t, i.right = t + s, i.bottom = e + n, i.width = s, i.height = n;
}
function Dn(i, t, e, s) {
  const n = e.padding;
  let { x: o, y: r } = t;
  for (const a of i) {
    const l = a.box, c = s[a.stack] || {
      placed: 0,
      weight: 1
    }, h = a.stackWeight / c.weight || 1;
    if (a.horizontal) {
      const d = t.w * h, u = c.size || l.height;
      De(c.start) && (r = c.start), l.fullSize ? Ge(l, n.left, r, e.outerWidth - n.right - n.left, u) : Ge(l, t.left + c.placed, r, d, u), c.start = r, c.placed += d, r = l.bottom;
    } else {
      const d = t.h * h, u = c.size || l.width;
      De(c.start) && (o = c.start), l.fullSize ? Ge(l, o, n.top, u, e.outerHeight - n.bottom - n.top) : Ge(l, o, t.top + c.placed, u, d), c.start = o, c.placed += d, o = l.right;
    }
  }
  t.x = o, t.y = r;
}
var Ze = {
  addBox(i, t) {
    i.boxes || (i.boxes = []), t.fullSize = t.fullSize || !1, t.position = t.position || "top", t.weight = t.weight || 0, t._layers = t._layers || function() {
      return [
        {
          z: 0,
          draw(e) {
            t.draw(e);
          }
        }
      ];
    }, i.boxes.push(t);
  },
  removeBox(i, t) {
    const e = i.boxes ? i.boxes.indexOf(t) : -1;
    e !== -1 && i.boxes.splice(e, 1);
  },
  configure(i, t, e) {
    t.fullSize = e.fullSize, t.position = e.position, t.weight = e.weight;
  },
  update(i, t, e, s) {
    if (!i)
      return;
    const n = Pt(i.options.layout.padding), o = Math.max(t - n.width, 0), r = Math.max(e - n.height, 0), a = sh(i.boxes), l = a.vertical, c = a.horizontal;
    O(i.boxes, (p) => {
      typeof p.beforeLayout == "function" && p.beforeLayout();
    });
    const h = l.reduce((p, m) => m.box.options && m.box.options.display === !1 ? p : p + 1, 0) || 1, d = Object.freeze({
      outerWidth: t,
      outerHeight: e,
      padding: n,
      availableWidth: o,
      availableHeight: r,
      vBoxMaxWidth: o / 2 / h,
      hBoxMaxHeight: r / 2
    }), u = Object.assign({}, n);
    sr(u, Pt(s));
    const f = Object.assign({
      maxPadding: u,
      w: o,
      h: r,
      x: n.left,
      y: n.top
    }, n), g = ih(l.concat(c), d);
    ge(a.fullSize, f, d, g), ge(l, f, d, g), ge(c, f, d, g) && ge(l, f, d, g), oh(f), Dn(a.leftAndTop, f, d, g), f.x += f.w, f.y += f.h, Dn(a.rightAndBottom, f, d, g), i.chartArea = {
      left: f.left,
      top: f.top,
      right: f.left + f.w,
      bottom: f.top + f.h,
      height: f.h,
      width: f.w
    }, O(a.chartArea, (p) => {
      const m = p.box;
      Object.assign(m, i.chartArea), m.update(f.w, f.h, {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
      });
    });
  }
};
class nr {
  acquireContext(t, e) {
  }
  releaseContext(t) {
    return !1;
  }
  addEventListener(t, e, s) {
  }
  removeEventListener(t, e, s) {
  }
  getDevicePixelRatio() {
    return 1;
  }
  getMaximumSize(t, e, s, n) {
    return e = Math.max(0, e || t.width), s = s || t.height, {
      width: e,
      height: Math.max(0, n ? Math.floor(e / n) : s)
    };
  }
  isAttached(t) {
    return !0;
  }
  updateConfig(t) {
  }
}
class ah extends nr {
  acquireContext(t) {
    return t && t.getContext && t.getContext("2d") || null;
  }
  updateConfig(t) {
    t.options.animation = !1;
  }
}
const ai = "$chartjs", lh = {
  touchstart: "mousedown",
  touchmove: "mousemove",
  touchend: "mouseup",
  pointerenter: "mouseenter",
  pointerdown: "mousedown",
  pointermove: "mousemove",
  pointerup: "mouseup",
  pointerleave: "mouseout",
  pointerout: "mouseout"
}, Tn = (i) => i === null || i === "";
function ch(i, t) {
  const e = i.style, s = i.getAttribute("height"), n = i.getAttribute("width");
  if (i[ai] = {
    initial: {
      height: s,
      width: n,
      style: {
        display: e.display,
        height: e.height,
        width: e.width
      }
    }
  }, e.display = e.display || "block", e.boxSizing = e.boxSizing || "border-box", Tn(n)) {
    const o = gn(i, "width");
    o !== void 0 && (i.width = o);
  }
  if (Tn(s))
    if (i.style.height === "")
      i.height = i.width / (t || 2);
    else {
      const o = gn(i, "height");
      o !== void 0 && (i.height = o);
    }
  return i;
}
const or = hc ? {
  passive: !0
} : !1;
function hh(i, t, e) {
  i && i.addEventListener(t, e, or);
}
function dh(i, t, e) {
  i && i.canvas && i.canvas.removeEventListener(t, e, or);
}
function uh(i, t) {
  const e = lh[i.type] || i.type, { x: s, y: n } = Ft(i, t);
  return {
    type: e,
    chart: t,
    native: i,
    x: s !== void 0 ? s : null,
    y: n !== void 0 ? n : null
  };
}
function vi(i, t) {
  for (const e of i)
    if (e === t || e.contains(t))
      return !0;
}
function fh(i, t, e) {
  const s = i.canvas, n = new MutationObserver((o) => {
    let r = !1;
    for (const a of o)
      r = r || vi(a.addedNodes, s), r = r && !vi(a.removedNodes, s);
    r && e();
  });
  return n.observe(document, {
    childList: !0,
    subtree: !0
  }), n;
}
function ph(i, t, e) {
  const s = i.canvas, n = new MutationObserver((o) => {
    let r = !1;
    for (const a of o)
      r = r || vi(a.removedNodes, s), r = r && !vi(a.addedNodes, s);
    r && e();
  });
  return n.observe(document, {
    childList: !0,
    subtree: !0
  }), n;
}
const Le = /* @__PURE__ */ new Map();
let En = 0;
function rr() {
  const i = window.devicePixelRatio;
  i !== En && (En = i, Le.forEach((t, e) => {
    e.currentDevicePixelRatio !== i && t();
  }));
}
function gh(i, t) {
  Le.size || window.addEventListener("resize", rr), Le.set(i, t);
}
function mh(i) {
  Le.delete(i), Le.size || window.removeEventListener("resize", rr);
}
function bh(i, t, e) {
  const s = i.canvas, n = s && $s(s);
  if (!n)
    return;
  const o = Bo((a, l) => {
    const c = n.clientWidth;
    e(a, l), c < n.clientWidth && e();
  }, window), r = new ResizeObserver((a) => {
    const l = a[0], c = l.contentRect.width, h = l.contentRect.height;
    c === 0 && h === 0 || o(c, h);
  });
  return r.observe(n), gh(i, o), r;
}
function Ki(i, t, e) {
  e && e.disconnect(), t === "resize" && mh(i);
}
function _h(i, t, e) {
  const s = i.canvas, n = Bo((o) => {
    i.ctx !== null && e(uh(o, i));
  }, i);
  return hh(s, t, n), n;
}
class yh extends nr {
  acquireContext(t, e) {
    const s = t && t.getContext && t.getContext("2d");
    return s && s.canvas === t ? (ch(t, e), s) : null;
  }
  releaseContext(t) {
    const e = t.canvas;
    if (!e[ai])
      return !1;
    const s = e[ai].initial;
    [
      "height",
      "width"
    ].forEach((o) => {
      const r = s[o];
      C(r) ? e.removeAttribute(o) : e.setAttribute(o, r);
    });
    const n = s.style || {};
    return Object.keys(n).forEach((o) => {
      e.style[o] = n[o];
    }), e.width = e.width, delete e[ai], !0;
  }
  addEventListener(t, e, s) {
    this.removeEventListener(t, e);
    const n = t.$proxies || (t.$proxies = {}), r = {
      attach: fh,
      detach: ph,
      resize: bh
    }[e] || _h;
    n[e] = r(t, e, s);
  }
  removeEventListener(t, e) {
    const s = t.$proxies || (t.$proxies = {}), n = s[e];
    if (!n)
      return;
    ({
      attach: Ki,
      detach: Ki,
      resize: Ki
    }[e] || dh)(t, e, n), s[e] = void 0;
  }
  getDevicePixelRatio() {
    return window.devicePixelRatio;
  }
  getMaximumSize(t, e, s, n) {
    return cc(t, e, s, n);
  }
  isAttached(t) {
    const e = t && $s(t);
    return !!(e && e.isConnected);
  }
}
function xh(i) {
  return !Ps() || typeof OffscreenCanvas < "u" && i instanceof OffscreenCanvas ? ah : yh;
}
class $t {
  constructor() {
    S(this, "x");
    S(this, "y");
    S(this, "active", !1);
    S(this, "options");
    S(this, "$animations");
  }
  tooltipPosition(t) {
    const { x: e, y: s } = this.getProps([
      "x",
      "y"
    ], t);
    return {
      x: e,
      y: s
    };
  }
  hasValue() {
    return Te(this.x) && Te(this.y);
  }
  getProps(t, e) {
    const s = this.$animations;
    if (!e || !s)
      return this;
    const n = {};
    return t.forEach((o) => {
      n[o] = s[o] && s[o].active() ? s[o]._to : this[o];
    }), n;
  }
}
S($t, "defaults", {}), S($t, "defaultRoutes");
function vh(i, t) {
  const e = i.options.ticks, s = wh(i), n = Math.min(e.maxTicksLimit || s, s), o = e.major.enabled ? kh(t) : [], r = o.length, a = o[0], l = o[r - 1], c = [];
  if (r > n)
    return Mh(t, c, o, r / n), c;
  const h = Sh(o, t, n);
  if (r > 0) {
    let d, u;
    const f = r > 1 ? Math.round((l - a) / (r - 1)) : null;
    for (Qe(t, c, h, C(f) ? 0 : a - f, a), d = 0, u = r - 1; d < u; d++)
      Qe(t, c, h, o[d], o[d + 1]);
    return Qe(t, c, h, l, C(f) ? t.length : l + f), c;
  }
  return Qe(t, c, h), c;
}
function wh(i) {
  const t = i.options.offset, e = i._tickSize(), s = i._length / e + (t ? 0 : 1), n = i._maxLength / e;
  return Math.floor(Math.min(s, n));
}
function Sh(i, t, e) {
  const s = Ah(i), n = t.length / e;
  if (!s)
    return Math.max(n, 1);
  const o = rl(s);
  for (let r = 0, a = o.length - 1; r < a; r++) {
    const l = o[r];
    if (l > n)
      return l;
  }
  return Math.max(n, 1);
}
function kh(i) {
  const t = [];
  let e, s;
  for (e = 0, s = i.length; e < s; e++)
    i[e].major && t.push(e);
  return t;
}
function Mh(i, t, e, s) {
  let n = 0, o = e[0], r;
  for (s = Math.ceil(s), r = 0; r < i.length; r++)
    r === o && (t.push(i[r]), n++, o = e[n * s]);
}
function Qe(i, t, e, s, n) {
  const o = $(s, 0), r = Math.min($(n, i.length), i.length);
  let a = 0, l, c, h;
  for (e = Math.ceil(e), n && (l = n - s, e = l / Math.floor(l / e)), h = o; h < 0; )
    a++, h = Math.round(o + a * e);
  for (c = Math.max(o, 0); c < r; c++)
    c === h && (t.push(i[c]), a++, h = Math.round(o + a * e));
}
function Ah(i) {
  const t = i.length;
  let e, s;
  if (t < 2)
    return !1;
  for (s = i[0], e = 1; e < t; ++e)
    if (i[e] - i[e - 1] !== s)
      return !1;
  return s;
}
const Ph = (i) => i === "left" ? "right" : i === "right" ? "left" : i, Ln = (i, t, e) => t === "top" || t === "left" ? i[t] + e : i[t] - e, In = (i, t) => Math.min(t || i, i);
function Rn(i, t) {
  const e = [], s = i.length / t, n = i.length;
  let o = 0;
  for (; o < n; o += s)
    e.push(i[Math.floor(o)]);
  return e;
}
function $h(i, t, e) {
  const s = i.ticks.length, n = Math.min(t, s - 1), o = i._startPixel, r = i._endPixel, a = 1e-6;
  let l = i.getPixelForTick(n), c;
  if (!(e && (s === 1 ? c = Math.max(l - o, r - l) : t === 0 ? c = (i.getPixelForTick(1) - l) / 2 : c = (l - i.getPixelForTick(n - 1)) / 2, l += n < t ? c : -c, l < o - a || l > r + a)))
    return l;
}
function Ch(i, t) {
  O(i, (e) => {
    const s = e.gc, n = s.length / 2;
    let o;
    if (n > t) {
      for (o = 0; o < n; ++o)
        delete e.data[s[o]];
      s.splice(0, n);
    }
  });
}
function ue(i) {
  return i.drawTicks ? i.tickLength : 0;
}
function Fn(i, t) {
  if (!i.display)
    return 0;
  const e = at(i.font, t), s = Pt(i.padding);
  return (H(i.text) ? i.text.length : 1) * e.lineHeight + s.height;
}
function Oh(i, t) {
  return Yt(i, {
    scale: t,
    type: "scale"
  });
}
function Dh(i, t, e) {
  return Yt(i, {
    tick: e,
    index: t,
    type: "tick"
  });
}
function Th(i, t, e) {
  let s = _l(i);
  return (e && t !== "right" || !e && t === "right") && (s = Ph(s)), s;
}
function Eh(i, t, e, s) {
  const { top: n, left: o, bottom: r, right: a, chart: l } = i, { chartArea: c, scales: h } = l;
  let d = 0, u, f, g;
  const p = r - n, m = a - o;
  if (i.isHorizontal()) {
    if (f = nn(s, o, a), A(e)) {
      const b = Object.keys(e)[0], y = e[b];
      g = h[b].getPixelForValue(y) + p - t;
    } else e === "center" ? g = (c.bottom + c.top) / 2 + p - t : g = Ln(i, e, t);
    u = a - o;
  } else {
    if (A(e)) {
      const b = Object.keys(e)[0], y = e[b];
      f = h[b].getPixelForValue(y) - m + t;
    } else e === "center" ? f = (c.left + c.right) / 2 - m + t : f = Ln(i, e, t);
    g = nn(s, r, n), d = e === "left" ? -tt : tt;
  }
  return {
    titleX: f,
    titleY: g,
    maxWidth: u,
    rotation: d
  };
}
class ne extends $t {
  constructor(t) {
    super(), this.id = t.id, this.type = t.type, this.options = void 0, this.ctx = t.ctx, this.chart = t.chart, this.top = void 0, this.bottom = void 0, this.left = void 0, this.right = void 0, this.width = void 0, this.height = void 0, this._margins = {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    }, this.maxWidth = void 0, this.maxHeight = void 0, this.paddingTop = void 0, this.paddingBottom = void 0, this.paddingLeft = void 0, this.paddingRight = void 0, this.axis = void 0, this.labelRotation = void 0, this.min = void 0, this.max = void 0, this._range = void 0, this.ticks = [], this._gridLineItems = null, this._labelItems = null, this._labelSizes = null, this._length = 0, this._maxLength = 0, this._longestTextCache = {}, this._startPixel = void 0, this._endPixel = void 0, this._reversePixels = !1, this._userMax = void 0, this._userMin = void 0, this._suggestedMax = void 0, this._suggestedMin = void 0, this._ticksLength = 0, this._borderValue = 0, this._cache = {}, this._dataLimitsCached = !1, this.$context = void 0;
  }
  init(t) {
    this.options = t.setContext(this.getContext()), this.axis = t.axis, this._userMin = this.parse(t.min), this._userMax = this.parse(t.max), this._suggestedMin = this.parse(t.suggestedMin), this._suggestedMax = this.parse(t.suggestedMax);
  }
  parse(t, e) {
    return t;
  }
  getUserBounds() {
    let { _userMin: t, _userMax: e, _suggestedMin: s, _suggestedMax: n } = this;
    return t = st(t, Number.POSITIVE_INFINITY), e = st(e, Number.NEGATIVE_INFINITY), s = st(s, Number.POSITIVE_INFINITY), n = st(n, Number.NEGATIVE_INFINITY), {
      min: st(t, s),
      max: st(e, n),
      minDefined: U(t),
      maxDefined: U(e)
    };
  }
  getMinMax(t) {
    let { min: e, max: s, minDefined: n, maxDefined: o } = this.getUserBounds(), r;
    if (n && o)
      return {
        min: e,
        max: s
      };
    const a = this.getMatchingVisibleMetas();
    for (let l = 0, c = a.length; l < c; ++l)
      r = a[l].controller.getMinMax(this, t), n || (e = Math.min(e, r.min)), o || (s = Math.max(s, r.max));
    return e = o && e > s ? s : e, s = n && e > s ? e : s, {
      min: st(e, st(s, e)),
      max: st(s, st(e, s))
    };
  }
  getPadding() {
    return {
      left: this.paddingLeft || 0,
      top: this.paddingTop || 0,
      right: this.paddingRight || 0,
      bottom: this.paddingBottom || 0
    };
  }
  getTicks() {
    return this.ticks;
  }
  getLabels() {
    const t = this.chart.data;
    return this.options.labels || (this.isHorizontal() ? t.xLabels : t.yLabels) || t.labels || [];
  }
  getLabelItems(t = this.chart.chartArea) {
    return this._labelItems || (this._labelItems = this._computeLabelItems(t));
  }
  beforeLayout() {
    this._cache = {}, this._dataLimitsCached = !1;
  }
  beforeUpdate() {
    F(this.options.beforeUpdate, [
      this
    ]);
  }
  update(t, e, s) {
    const { beginAtZero: n, grace: o, ticks: r } = this.options, a = r.sampleSize;
    this.beforeUpdate(), this.maxWidth = t, this.maxHeight = e, this._margins = s = Object.assign({
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    }, s), this.ticks = null, this._labelSizes = null, this._gridLineItems = null, this._labelItems = null, this.beforeSetDimensions(), this.setDimensions(), this.afterSetDimensions(), this._maxLength = this.isHorizontal() ? this.width + s.left + s.right : this.height + s.top + s.bottom, this._dataLimitsCached || (this.beforeDataLimits(), this.determineDataLimits(), this.afterDataLimits(), this._range = Hl(this, o, n), this._dataLimitsCached = !0), this.beforeBuildTicks(), this.ticks = this.buildTicks() || [], this.afterBuildTicks();
    const l = a < this.ticks.length;
    this._convertTicksToLabels(l ? Rn(this.ticks, a) : this.ticks), this.configure(), this.beforeCalculateLabelRotation(), this.calculateLabelRotation(), this.afterCalculateLabelRotation(), r.display && (r.autoSkip || r.source === "auto") && (this.ticks = vh(this, this.ticks), this._labelSizes = null, this.afterAutoSkip()), l && this._convertTicksToLabels(this.ticks), this.beforeFit(), this.fit(), this.afterFit(), this.afterUpdate();
  }
  configure() {
    let t = this.options.reverse, e, s;
    this.isHorizontal() ? (e = this.left, s = this.right) : (e = this.top, s = this.bottom, t = !t), this._startPixel = e, this._endPixel = s, this._reversePixels = t, this._length = s - e, this._alignToPixels = this.options.alignToPixels;
  }
  afterUpdate() {
    F(this.options.afterUpdate, [
      this
    ]);
  }
  beforeSetDimensions() {
    F(this.options.beforeSetDimensions, [
      this
    ]);
  }
  setDimensions() {
    this.isHorizontal() ? (this.width = this.maxWidth, this.left = 0, this.right = this.width) : (this.height = this.maxHeight, this.top = 0, this.bottom = this.height), this.paddingLeft = 0, this.paddingTop = 0, this.paddingRight = 0, this.paddingBottom = 0;
  }
  afterSetDimensions() {
    F(this.options.afterSetDimensions, [
      this
    ]);
  }
  _callHooks(t) {
    this.chart.notifyPlugins(t, this.getContext()), F(this.options[t], [
      this
    ]);
  }
  beforeDataLimits() {
    this._callHooks("beforeDataLimits");
  }
  determineDataLimits() {
  }
  afterDataLimits() {
    this._callHooks("afterDataLimits");
  }
  beforeBuildTicks() {
    this._callHooks("beforeBuildTicks");
  }
  buildTicks() {
    return [];
  }
  afterBuildTicks() {
    this._callHooks("afterBuildTicks");
  }
  beforeTickToLabelConversion() {
    F(this.options.beforeTickToLabelConversion, [
      this
    ]);
  }
  generateTickLabels(t) {
    const e = this.options.ticks;
    let s, n, o;
    for (s = 0, n = t.length; s < n; s++)
      o = t[s], o.label = F(e.callback, [
        o.value,
        s,
        t
      ], this);
  }
  afterTickToLabelConversion() {
    F(this.options.afterTickToLabelConversion, [
      this
    ]);
  }
  beforeCalculateLabelRotation() {
    F(this.options.beforeCalculateLabelRotation, [
      this
    ]);
  }
  calculateLabelRotation() {
    const t = this.options, e = t.ticks, s = In(this.ticks.length, t.ticks.maxTicksLimit), n = e.minRotation || 0, o = e.maxRotation;
    let r = n, a, l, c;
    if (!this._isVisible() || !e.display || n >= o || s <= 1 || !this.isHorizontal()) {
      this.labelRotation = n;
      return;
    }
    const h = this._getLabelSizes(), d = h.widest.width, u = h.highest.height, f = G(this.chart.width - d, 0, this.maxWidth);
    a = t.offset ? this.maxWidth / s : f / (s - 1), d + 6 > a && (a = f / (s - (t.offset ? 0.5 : 1)), l = this.maxHeight - ue(t.grid) - e.padding - Fn(t.title, this.chart.options.font), c = Math.sqrt(d * d + u * u), r = hl(Math.min(Math.asin(G((h.highest.height + 6) / a, -1, 1)), Math.asin(G(l / c, -1, 1)) - Math.asin(G(u / c, -1, 1)))), r = Math.max(n, Math.min(o, r))), this.labelRotation = r;
  }
  afterCalculateLabelRotation() {
    F(this.options.afterCalculateLabelRotation, [
      this
    ]);
  }
  afterAutoSkip() {
  }
  beforeFit() {
    F(this.options.beforeFit, [
      this
    ]);
  }
  fit() {
    const t = {
      width: 0,
      height: 0
    }, { chart: e, options: { ticks: s, title: n, grid: o } } = this, r = this._isVisible(), a = this.isHorizontal();
    if (r) {
      const l = Fn(n, e.options.font);
      if (a ? (t.width = this.maxWidth, t.height = ue(o) + l) : (t.height = this.maxHeight, t.width = ue(o) + l), s.display && this.ticks.length) {
        const { first: c, last: h, widest: d, highest: u } = this._getLabelSizes(), f = s.padding * 2, g = Nt(this.labelRotation), p = Math.cos(g), m = Math.sin(g);
        if (a) {
          const b = s.mirror ? 0 : m * d.width + p * u.height;
          t.height = Math.min(this.maxHeight, t.height + b + f);
        } else {
          const b = s.mirror ? 0 : p * d.width + m * u.height;
          t.width = Math.min(this.maxWidth, t.width + b + f);
        }
        this._calculatePadding(c, h, m, p);
      }
    }
    this._handleMargins(), a ? (this.width = this._length = e.width - this._margins.left - this._margins.right, this.height = t.height) : (this.width = t.width, this.height = this._length = e.height - this._margins.top - this._margins.bottom);
  }
  _calculatePadding(t, e, s, n) {
    const { ticks: { align: o, padding: r }, position: a } = this.options, l = this.labelRotation !== 0, c = a !== "top" && this.axis === "x";
    if (this.isHorizontal()) {
      const h = this.getPixelForTick(0) - this.left, d = this.right - this.getPixelForTick(this.ticks.length - 1);
      let u = 0, f = 0;
      l ? c ? (u = n * t.width, f = s * e.height) : (u = s * t.height, f = n * e.width) : o === "start" ? f = e.width : o === "end" ? u = t.width : o !== "inner" && (u = t.width / 2, f = e.width / 2), this.paddingLeft = Math.max((u - h + r) * this.width / (this.width - h), 0), this.paddingRight = Math.max((f - d + r) * this.width / (this.width - d), 0);
    } else {
      let h = e.height / 2, d = t.height / 2;
      o === "start" ? (h = 0, d = t.height) : o === "end" && (h = e.height, d = 0), this.paddingTop = h + r, this.paddingBottom = d + r;
    }
  }
  _handleMargins() {
    this._margins && (this._margins.left = Math.max(this.paddingLeft, this._margins.left), this._margins.top = Math.max(this.paddingTop, this._margins.top), this._margins.right = Math.max(this.paddingRight, this._margins.right), this._margins.bottom = Math.max(this.paddingBottom, this._margins.bottom));
  }
  afterFit() {
    F(this.options.afterFit, [
      this
    ]);
  }
  isHorizontal() {
    const { axis: t, position: e } = this.options;
    return e === "top" || e === "bottom" || t === "x";
  }
  isFullSize() {
    return this.options.fullSize;
  }
  _convertTicksToLabels(t) {
    this.beforeTickToLabelConversion(), this.generateTickLabels(t);
    let e, s;
    for (e = 0, s = t.length; e < s; e++)
      C(t[e].label) && (t.splice(e, 1), s--, e--);
    this.afterTickToLabelConversion();
  }
  _getLabelSizes() {
    let t = this._labelSizes;
    if (!t) {
      const e = this.options.ticks.sampleSize;
      let s = this.ticks;
      e < s.length && (s = Rn(s, e)), this._labelSizes = t = this._computeLabelSizes(s, s.length, this.options.ticks.maxTicksLimit);
    }
    return t;
  }
  _computeLabelSizes(t, e, s) {
    const { ctx: n, _longestTextCache: o } = this, r = [], a = [], l = Math.floor(e / In(e, s));
    let c = 0, h = 0, d, u, f, g, p, m, b, y, v, x, _;
    for (d = 0; d < e; d += l) {
      if (g = t[d].label, p = this._resolveTickFontOptions(d), n.font = m = p.string, b = o[m] = o[m] || {
        data: {},
        gc: []
      }, y = p.lineHeight, v = x = 0, !C(g) && !H(g))
        v = cn(n, b.data, b.gc, v, g), x = y;
      else if (H(g))
        for (u = 0, f = g.length; u < f; ++u)
          _ = g[u], !C(_) && !H(_) && (v = cn(n, b.data, b.gc, v, _), x += y);
      r.push(v), a.push(x), c = Math.max(v, c), h = Math.max(x, h);
    }
    Ch(o, e);
    const M = r.indexOf(c), w = a.indexOf(h), k = (P) => ({
      width: r[P] || 0,
      height: a[P] || 0
    });
    return {
      first: k(0),
      last: k(e - 1),
      widest: k(M),
      highest: k(w),
      widths: r,
      heights: a
    };
  }
  getLabelForValue(t) {
    return t;
  }
  getPixelForValue(t, e) {
    return NaN;
  }
  getValueForPixel(t) {
  }
  getPixelForTick(t) {
    const e = this.ticks;
    return t < 0 || t > e.length - 1 ? null : this.getPixelForValue(e[t].value);
  }
  getPixelForDecimal(t) {
    this._reversePixels && (t = 1 - t);
    const e = this._startPixel + t * this._length;
    return fl(this._alignToPixels ? Lt(this.chart, e, 0) : e);
  }
  getDecimalForPixel(t) {
    const e = (t - this._startPixel) / this._length;
    return this._reversePixels ? 1 - e : e;
  }
  getBasePixel() {
    return this.getPixelForValue(this.getBaseValue());
  }
  getBaseValue() {
    const { min: t, max: e } = this;
    return t < 0 && e < 0 ? e : t > 0 && e > 0 ? t : 0;
  }
  getContext(t) {
    const e = this.ticks || [];
    if (t >= 0 && t < e.length) {
      const s = e[t];
      return s.$context || (s.$context = Dh(this.getContext(), t, s));
    }
    return this.$context || (this.$context = Oh(this.chart.getContext(), this));
  }
  _tickSize() {
    const t = this.options.ticks, e = Nt(this.labelRotation), s = Math.abs(Math.cos(e)), n = Math.abs(Math.sin(e)), o = this._getLabelSizes(), r = t.autoSkipPadding || 0, a = o ? o.widest.width + r : 0, l = o ? o.highest.height + r : 0;
    return this.isHorizontal() ? l * s > a * n ? a / s : l / n : l * n < a * s ? l / s : a / n;
  }
  _isVisible() {
    const t = this.options.display;
    return t !== "auto" ? !!t : this.getMatchingVisibleMetas().length > 0;
  }
  _computeGridLineItems(t) {
    const e = this.axis, s = this.chart, n = this.options, { grid: o, position: r, border: a } = n, l = o.offset, c = this.isHorizontal(), d = this.ticks.length + (l ? 1 : 0), u = ue(o), f = [], g = a.setContext(this.getContext()), p = g.display ? g.width : 0, m = p / 2, b = function(j) {
      return Lt(s, j, p);
    };
    let y, v, x, _, M, w, k, P, L, I, N, it;
    if (r === "top")
      y = b(this.bottom), w = this.bottom - u, P = y - m, I = b(t.top) + m, it = t.bottom;
    else if (r === "bottom")
      y = b(this.top), I = t.top, it = b(t.bottom) - m, w = y + m, P = this.top + u;
    else if (r === "left")
      y = b(this.right), M = this.right - u, k = y - m, L = b(t.left) + m, N = t.right;
    else if (r === "right")
      y = b(this.left), L = t.left, N = b(t.right) - m, M = y + m, k = this.left + u;
    else if (e === "x") {
      if (r === "center")
        y = b((t.top + t.bottom) / 2 + 0.5);
      else if (A(r)) {
        const j = Object.keys(r)[0], Z = r[j];
        y = b(this.chart.scales[j].getPixelForValue(Z));
      }
      I = t.top, it = t.bottom, w = y + m, P = w + u;
    } else if (e === "y") {
      if (r === "center")
        y = b((t.left + t.right) / 2);
      else if (A(r)) {
        const j = Object.keys(r)[0], Z = r[j];
        y = b(this.chart.scales[j].getPixelForValue(Z));
      }
      M = y - m, k = M - u, L = t.left, N = t.right;
    }
    const bt = $(n.ticks.maxTicksLimit, d), R = Math.max(1, Math.ceil(d / bt));
    for (v = 0; v < d; v += R) {
      const j = this.getContext(v), Z = o.setContext(j), Be = a.setContext(j), Ne = Z.lineWidth, Kt = Z.color, He = Be.dash || [], Xt = Be.dashOffset, oe = Z.tickWidth, Ct = Z.tickColor, re = Z.tickBorderDash || [], Ot = Z.tickBorderDashOffset;
      x = $h(this, v, l), x !== void 0 && (_ = Lt(s, x, Ne), c ? M = k = L = N = _ : w = P = I = it = _, f.push({
        tx1: M,
        ty1: w,
        tx2: k,
        ty2: P,
        x1: L,
        y1: I,
        x2: N,
        y2: it,
        width: Ne,
        color: Kt,
        borderDash: He,
        borderDashOffset: Xt,
        tickWidth: oe,
        tickColor: Ct,
        tickBorderDash: re,
        tickBorderDashOffset: Ot
      }));
    }
    return this._ticksLength = d, this._borderValue = y, f;
  }
  _computeLabelItems(t) {
    const e = this.axis, s = this.options, { position: n, ticks: o } = s, r = this.isHorizontal(), a = this.ticks, { align: l, crossAlign: c, padding: h, mirror: d } = o, u = ue(s.grid), f = u + h, g = d ? -h : f, p = -Nt(this.labelRotation), m = [];
    let b, y, v, x, _, M, w, k, P, L, I, N, it = "middle";
    if (n === "top")
      M = this.bottom - g, w = this._getXAxisLabelAlignment();
    else if (n === "bottom")
      M = this.top + g, w = this._getXAxisLabelAlignment();
    else if (n === "left") {
      const R = this._getYAxisLabelAlignment(u);
      w = R.textAlign, _ = R.x;
    } else if (n === "right") {
      const R = this._getYAxisLabelAlignment(u);
      w = R.textAlign, _ = R.x;
    } else if (e === "x") {
      if (n === "center")
        M = (t.top + t.bottom) / 2 + f;
      else if (A(n)) {
        const R = Object.keys(n)[0], j = n[R];
        M = this.chart.scales[R].getPixelForValue(j) + f;
      }
      w = this._getXAxisLabelAlignment();
    } else if (e === "y") {
      if (n === "center")
        _ = (t.left + t.right) / 2 - f;
      else if (A(n)) {
        const R = Object.keys(n)[0], j = n[R];
        _ = this.chart.scales[R].getPixelForValue(j);
      }
      w = this._getYAxisLabelAlignment(u).textAlign;
    }
    e === "y" && (l === "start" ? it = "top" : l === "end" && (it = "bottom"));
    const bt = this._getLabelSizes();
    for (b = 0, y = a.length; b < y; ++b) {
      v = a[b], x = v.label;
      const R = o.setContext(this.getContext(b));
      k = this.getPixelForTick(b) + o.labelOffset, P = this._resolveTickFontOptions(b), L = P.lineHeight, I = H(x) ? x.length : 1;
      const j = I / 2, Z = R.color, Be = R.textStrokeColor, Ne = R.textStrokeWidth;
      let Kt = w;
      r ? (_ = k, w === "inner" && (b === y - 1 ? Kt = this.options.reverse ? "left" : "right" : b === 0 ? Kt = this.options.reverse ? "right" : "left" : Kt = "center"), n === "top" ? c === "near" || p !== 0 ? N = -I * L + L / 2 : c === "center" ? N = -bt.highest.height / 2 - j * L + L : N = -bt.highest.height + L / 2 : c === "near" || p !== 0 ? N = L / 2 : c === "center" ? N = bt.highest.height / 2 - j * L : N = bt.highest.height - I * L, d && (N *= -1), p !== 0 && !R.showLabelBackdrop && (_ += L / 2 * Math.sin(p))) : (M = k, N = (1 - I) * L / 2);
      let He;
      if (R.showLabelBackdrop) {
        const Xt = Pt(R.backdropPadding), oe = bt.heights[b], Ct = bt.widths[b];
        let re = N - Xt.top, Ot = 0 - Xt.left;
        switch (it) {
          case "middle":
            re -= oe / 2;
            break;
          case "bottom":
            re -= oe;
            break;
        }
        switch (w) {
          case "center":
            Ot -= Ct / 2;
            break;
          case "right":
            Ot -= Ct;
            break;
          case "inner":
            b === y - 1 ? Ot -= Ct : b > 0 && (Ot -= Ct / 2);
            break;
        }
        He = {
          left: Ot,
          top: re,
          width: Ct + Xt.width,
          height: oe + Xt.height,
          color: R.backdropColor
        };
      }
      m.push({
        label: x,
        font: P,
        textOffset: N,
        options: {
          rotation: p,
          color: Z,
          strokeColor: Be,
          strokeWidth: Ne,
          textAlign: Kt,
          textBaseline: it,
          translation: [
            _,
            M
          ],
          backdrop: He
        }
      });
    }
    return m;
  }
  _getXAxisLabelAlignment() {
    const { position: t, ticks: e } = this.options;
    if (-Nt(this.labelRotation))
      return t === "top" ? "left" : "right";
    let n = "center";
    return e.align === "start" ? n = "left" : e.align === "end" ? n = "right" : e.align === "inner" && (n = "inner"), n;
  }
  _getYAxisLabelAlignment(t) {
    const { position: e, ticks: { crossAlign: s, mirror: n, padding: o } } = this.options, r = this._getLabelSizes(), a = t + o, l = r.widest.width;
    let c, h;
    return e === "left" ? n ? (h = this.right + o, s === "near" ? c = "left" : s === "center" ? (c = "center", h += l / 2) : (c = "right", h += l)) : (h = this.right - a, s === "near" ? c = "right" : s === "center" ? (c = "center", h -= l / 2) : (c = "left", h = this.left)) : e === "right" ? n ? (h = this.left + o, s === "near" ? c = "right" : s === "center" ? (c = "center", h -= l / 2) : (c = "left", h -= l)) : (h = this.left + a, s === "near" ? c = "left" : s === "center" ? (c = "center", h += l / 2) : (c = "right", h = this.right)) : c = "right", {
      textAlign: c,
      x: h
    };
  }
  _computeLabelArea() {
    if (this.options.ticks.mirror)
      return;
    const t = this.chart, e = this.options.position;
    if (e === "left" || e === "right")
      return {
        top: 0,
        left: this.left,
        bottom: t.height,
        right: this.right
      };
    if (e === "top" || e === "bottom")
      return {
        top: this.top,
        left: 0,
        bottom: this.bottom,
        right: t.width
      };
  }
  drawBackground() {
    const { ctx: t, options: { backgroundColor: e }, left: s, top: n, width: o, height: r } = this;
    e && (t.save(), t.fillStyle = e, t.fillRect(s, n, o, r), t.restore());
  }
  getLineWidthForValue(t) {
    const e = this.options.grid;
    if (!this._isVisible() || !e.display)
      return 0;
    const n = this.ticks.findIndex((o) => o.value === t);
    return n >= 0 ? e.setContext(this.getContext(n)).lineWidth : 0;
  }
  drawGrid(t) {
    const e = this.options.grid, s = this.ctx, n = this._gridLineItems || (this._gridLineItems = this._computeGridLineItems(t));
    let o, r;
    const a = (l, c, h) => {
      !h.width || !h.color || (s.save(), s.lineWidth = h.width, s.strokeStyle = h.color, s.setLineDash(h.borderDash || []), s.lineDashOffset = h.borderDashOffset, s.beginPath(), s.moveTo(l.x, l.y), s.lineTo(c.x, c.y), s.stroke(), s.restore());
    };
    if (e.display)
      for (o = 0, r = n.length; o < r; ++o) {
        const l = n[o];
        e.drawOnChartArea && a({
          x: l.x1,
          y: l.y1
        }, {
          x: l.x2,
          y: l.y2
        }, l), e.drawTicks && a({
          x: l.tx1,
          y: l.ty1
        }, {
          x: l.tx2,
          y: l.ty2
        }, {
          color: l.tickColor,
          width: l.tickWidth,
          borderDash: l.tickBorderDash,
          borderDashOffset: l.tickBorderDashOffset
        });
      }
  }
  drawBorder() {
    const { chart: t, ctx: e, options: { border: s, grid: n } } = this, o = s.setContext(this.getContext()), r = s.display ? o.width : 0;
    if (!r)
      return;
    const a = n.setContext(this.getContext(0)).lineWidth, l = this._borderValue;
    let c, h, d, u;
    this.isHorizontal() ? (c = Lt(t, this.left, r) - r / 2, h = Lt(t, this.right, a) + a / 2, d = u = l) : (d = Lt(t, this.top, r) - r / 2, u = Lt(t, this.bottom, a) + a / 2, c = h = l), e.save(), e.lineWidth = o.width, e.strokeStyle = o.color, e.beginPath(), e.moveTo(c, d), e.lineTo(h, u), e.stroke(), e.restore();
  }
  drawLabels(t) {
    if (!this.options.ticks.display)
      return;
    const s = this.ctx, n = this._computeLabelArea();
    n && ws(s, n);
    const o = this.getLabelItems(t);
    for (const r of o) {
      const a = r.options, l = r.font, c = r.label, h = r.textOffset;
      dn(s, c, 0, h, l, a);
    }
    n && Ss(s);
  }
  drawTitle() {
    const { ctx: t, options: { position: e, title: s, reverse: n } } = this;
    if (!s.display)
      return;
    const o = at(s.font), r = Pt(s.padding), a = s.align;
    let l = o.lineHeight / 2;
    e === "bottom" || e === "center" || A(e) ? (l += r.bottom, H(s.text) && (l += o.lineHeight * (s.text.length - 1))) : l += r.top;
    const { titleX: c, titleY: h, maxWidth: d, rotation: u } = Eh(this, l, e, a);
    dn(t, s.text, 0, 0, o, {
      color: s.color,
      maxWidth: d,
      rotation: u,
      textAlign: Th(a, e, n),
      textBaseline: "middle",
      translation: [
        c,
        h
      ]
    });
  }
  draw(t) {
    this._isVisible() && (this.drawBackground(), this.drawGrid(t), this.drawBorder(), this.drawTitle(), this.drawLabels(t));
  }
  _layers() {
    const t = this.options, e = t.ticks && t.ticks.z || 0, s = $(t.grid && t.grid.z, -1), n = $(t.border && t.border.z, 0);
    return !this._isVisible() || this.draw !== ne.prototype.draw ? [
      {
        z: e,
        draw: (o) => {
          this.draw(o);
        }
      }
    ] : [
      {
        z: s,
        draw: (o) => {
          this.drawBackground(), this.drawGrid(o), this.drawTitle();
        }
      },
      {
        z: n,
        draw: () => {
          this.drawBorder();
        }
      },
      {
        z: e,
        draw: (o) => {
          this.drawLabels(o);
        }
      }
    ];
  }
  getMatchingVisibleMetas(t) {
    const e = this.chart.getSortedVisibleDatasetMetas(), s = this.axis + "AxisID", n = [];
    let o, r;
    for (o = 0, r = e.length; o < r; ++o) {
      const a = e[o];
      a[s] === this.id && (!t || a.type === t) && n.push(a);
    }
    return n;
  }
  _resolveTickFontOptions(t) {
    const e = this.options.ticks.setContext(this.getContext(t));
    return at(e.font);
  }
  _maxDigits() {
    const t = this._resolveTickFontOptions(0).lineHeight;
    return (this.isHorizontal() ? this.width : this.height) / t;
  }
}
class Je {
  constructor(t, e, s) {
    this.type = t, this.scope = e, this.override = s, this.items = /* @__PURE__ */ Object.create(null);
  }
  isForType(t) {
    return Object.prototype.isPrototypeOf.call(this.type.prototype, t.prototype);
  }
  register(t) {
    const e = Object.getPrototypeOf(t);
    let s;
    Rh(e) && (s = this.register(e));
    const n = this.items, o = t.id, r = this.scope + "." + o;
    if (!o)
      throw new Error("class does not have id: " + t);
    return o in n || (n[o] = t, Lh(t, r, s), this.override && B.override(t.id, t.overrides)), r;
  }
  get(t) {
    return this.items[t];
  }
  unregister(t) {
    const e = this.items, s = t.id, n = this.scope;
    s in e && delete e[s], n && s in B[n] && (delete B[n][s], this.override && delete Ut[s]);
  }
}
function Lh(i, t, e) {
  const s = Oe(/* @__PURE__ */ Object.create(null), [
    e ? B.get(e) : {},
    B.get(t),
    i.defaults
  ]);
  B.set(t, s), i.defaultRoutes && Ih(t, i.defaultRoutes), i.descriptors && B.describe(t, i.descriptors);
}
function Ih(i, t) {
  Object.keys(t).forEach((e) => {
    const s = e.split("."), n = s.pop(), o = [
      i
    ].concat(s).join("."), r = t[e].split("."), a = r.pop(), l = r.join(".");
    B.route(o, n, l, a);
  });
}
function Rh(i) {
  return "id" in i && "defaults" in i;
}
class Fh {
  constructor() {
    this.controllers = new Je(Zt, "datasets", !0), this.elements = new Je($t, "elements"), this.plugins = new Je(Object, "plugins"), this.scales = new Je(ne, "scales"), this._typedRegistries = [
      this.controllers,
      this.scales,
      this.elements
    ];
  }
  add(...t) {
    this._each("register", t);
  }
  remove(...t) {
    this._each("unregister", t);
  }
  addControllers(...t) {
    this._each("register", t, this.controllers);
  }
  addElements(...t) {
    this._each("register", t, this.elements);
  }
  addPlugins(...t) {
    this._each("register", t, this.plugins);
  }
  addScales(...t) {
    this._each("register", t, this.scales);
  }
  getController(t) {
    return this._get(t, this.controllers, "controller");
  }
  getElement(t) {
    return this._get(t, this.elements, "element");
  }
  getPlugin(t) {
    return this._get(t, this.plugins, "plugin");
  }
  getScale(t) {
    return this._get(t, this.scales, "scale");
  }
  removeControllers(...t) {
    this._each("unregister", t, this.controllers);
  }
  removeElements(...t) {
    this._each("unregister", t, this.elements);
  }
  removePlugins(...t) {
    this._each("unregister", t, this.plugins);
  }
  removeScales(...t) {
    this._each("unregister", t, this.scales);
  }
  _each(t, e, s) {
    [
      ...e
    ].forEach((n) => {
      const o = s || this._getRegistryForType(n);
      s || o.isForType(n) || o === this.plugins && n.id ? this._exec(t, o, n) : O(n, (r) => {
        const a = s || this._getRegistryForType(r);
        this._exec(t, a, r);
      });
    });
  }
  _exec(t, e, s) {
    const n = ys(t);
    F(s["before" + n], [], s), e[t](s), F(s["after" + n], [], s);
  }
  _getRegistryForType(t) {
    for (let e = 0; e < this._typedRegistries.length; e++) {
      const s = this._typedRegistries[e];
      if (s.isForType(t))
        return s;
    }
    return this.plugins;
  }
  _get(t, e, s) {
    const n = e.get(t);
    if (n === void 0)
      throw new Error('"' + t + '" is not a registered ' + s + ".");
    return n;
  }
}
var ot = /* @__PURE__ */ new Fh();
class zh {
  constructor() {
    this._init = void 0;
  }
  notify(t, e, s, n) {
    if (e === "beforeInit" && (this._init = this._createDescriptors(t, !0), this._notify(this._init, t, "install")), this._init === void 0)
      return;
    const o = n ? this._descriptors(t).filter(n) : this._descriptors(t), r = this._notify(o, t, e, s);
    return e === "afterDestroy" && (this._notify(o, t, "stop"), this._notify(this._init, t, "uninstall"), this._init = void 0), r;
  }
  _notify(t, e, s, n) {
    n = n || {};
    for (const o of t) {
      const r = o.plugin, a = r[s], l = [
        e,
        n,
        o.options
      ];
      if (F(a, l, r) === !1 && n.cancelable)
        return !1;
    }
    return !0;
  }
  invalidate() {
    C(this._cache) || (this._oldCache = this._cache, this._cache = void 0);
  }
  _descriptors(t) {
    if (this._cache)
      return this._cache;
    const e = this._cache = this._createDescriptors(t);
    return this._notifyStateChanges(t), e;
  }
  _createDescriptors(t, e) {
    const s = t && t.config, n = $(s.options && s.options.plugins, {}), o = Bh(s);
    return n === !1 && !e ? [] : Hh(t, o, n, e);
  }
  _notifyStateChanges(t) {
    const e = this._oldCache || [], s = this._cache, n = (o, r) => o.filter((a) => !r.some((l) => a.plugin.id === l.plugin.id));
    this._notify(n(e, s), t, "stop"), this._notify(n(s, e), t, "start");
  }
}
function Bh(i) {
  const t = {}, e = [], s = Object.keys(ot.plugins.items);
  for (let o = 0; o < s.length; o++)
    e.push(ot.getPlugin(s[o]));
  const n = i.plugins || [];
  for (let o = 0; o < n.length; o++) {
    const r = n[o];
    e.indexOf(r) === -1 && (e.push(r), t[r.id] = !0);
  }
  return {
    plugins: e,
    localIds: t
  };
}
function Nh(i, t) {
  return !t && i === !1 ? null : i === !0 ? {} : i;
}
function Hh(i, { plugins: t, localIds: e }, s, n) {
  const o = [], r = i.getContext();
  for (const a of t) {
    const l = a.id, c = Nh(s[l], n);
    c !== null && o.push({
      plugin: a,
      options: Vh(i.config, {
        plugin: a,
        local: e[l]
      }, c, r)
    });
  }
  return o;
}
function Vh(i, { plugin: t, local: e }, s, n) {
  const o = i.pluginScopeKeys(t), r = i.getOptionScopes(s, o);
  return e && t.defaults && r.push(t.defaults), i.createResolver(r, n, [
    ""
  ], {
    scriptable: !1,
    indexable: !1,
    allKeys: !0
  });
}
function rs(i, t) {
  const e = B.datasets[i] || {};
  return ((t.datasets || {})[i] || {}).indexAxis || t.indexAxis || e.indexAxis || "x";
}
function jh(i, t) {
  let e = i;
  return i === "_index_" ? e = t : i === "_value_" && (e = t === "x" ? "y" : "x"), e;
}
function Wh(i, t) {
  return i === t ? "_index_" : "_value_";
}
function zn(i) {
  if (i === "x" || i === "y" || i === "r")
    return i;
}
function Uh(i) {
  if (i === "top" || i === "bottom")
    return "x";
  if (i === "left" || i === "right")
    return "y";
}
function as(i, ...t) {
  if (zn(i))
    return i;
  for (const e of t) {
    const s = e.axis || Uh(e.position) || i.length > 1 && zn(i[0].toLowerCase());
    if (s)
      return s;
  }
  throw new Error(`Cannot determine type of '${i}' axis. Please provide 'axis' or 'position' option.`);
}
function Bn(i, t, e) {
  if (e[t + "AxisID"] === i)
    return {
      axis: t
    };
}
function Yh(i, t) {
  if (t.data && t.data.datasets) {
    const e = t.data.datasets.filter((s) => s.xAxisID === i || s.yAxisID === i);
    if (e.length)
      return Bn(i, "x", e[0]) || Bn(i, "y", e[0]);
  }
  return {};
}
function Kh(i, t) {
  const e = Ut[i.type] || {
    scales: {}
  }, s = t.scales || {}, n = rs(i.type, t), o = /* @__PURE__ */ Object.create(null);
  return Object.keys(s).forEach((r) => {
    const a = s[r];
    if (!A(a))
      return console.error(`Invalid scale configuration for scale: ${r}`);
    if (a._proxy)
      return console.warn(`Ignoring resolver passed as options for scale: ${r}`);
    const l = as(r, a, Yh(r, i), B.scales[a.type]), c = Wh(l, n), h = e.scales || {};
    o[r] = xe(/* @__PURE__ */ Object.create(null), [
      {
        axis: l
      },
      a,
      h[l],
      h[c]
    ]);
  }), i.data.datasets.forEach((r) => {
    const a = r.type || i.type, l = r.indexAxis || rs(a, t), h = (Ut[a] || {}).scales || {};
    Object.keys(h).forEach((d) => {
      const u = jh(d, l), f = r[u + "AxisID"] || u;
      o[f] = o[f] || /* @__PURE__ */ Object.create(null), xe(o[f], [
        {
          axis: u
        },
        s[f],
        h[d]
      ]);
    });
  }), Object.keys(o).forEach((r) => {
    const a = o[r];
    xe(a, [
      B.scales[a.type],
      B.scale
    ]);
  }), o;
}
function ar(i) {
  const t = i.options || (i.options = {});
  t.plugins = $(t.plugins, {}), t.scales = Kh(i, t);
}
function lr(i) {
  return i = i || {}, i.datasets = i.datasets || [], i.labels = i.labels || [], i;
}
function Xh(i) {
  return i = i || {}, i.data = lr(i.data), ar(i), i;
}
const Nn = /* @__PURE__ */ new Map(), cr = /* @__PURE__ */ new Set();
function ti(i, t) {
  let e = Nn.get(i);
  return e || (e = t(), Nn.set(i, e), cr.add(e)), e;
}
const fe = (i, t, e) => {
  const s = Jt(t, e);
  s !== void 0 && i.add(s);
};
class qh {
  constructor(t) {
    this._config = Xh(t), this._scopeCache = /* @__PURE__ */ new Map(), this._resolverCache = /* @__PURE__ */ new Map();
  }
  get platform() {
    return this._config.platform;
  }
  get type() {
    return this._config.type;
  }
  set type(t) {
    this._config.type = t;
  }
  get data() {
    return this._config.data;
  }
  set data(t) {
    this._config.data = lr(t);
  }
  get options() {
    return this._config.options;
  }
  set options(t) {
    this._config.options = t;
  }
  get plugins() {
    return this._config.plugins;
  }
  update() {
    const t = this._config;
    this.clearCache(), ar(t);
  }
  clearCache() {
    this._scopeCache.clear(), this._resolverCache.clear();
  }
  datasetScopeKeys(t) {
    return ti(t, () => [
      [
        `datasets.${t}`,
        ""
      ]
    ]);
  }
  datasetAnimationScopeKeys(t, e) {
    return ti(`${t}.transition.${e}`, () => [
      [
        `datasets.${t}.transitions.${e}`,
        `transitions.${e}`
      ],
      [
        `datasets.${t}`,
        ""
      ]
    ]);
  }
  datasetElementScopeKeys(t, e) {
    return ti(`${t}-${e}`, () => [
      [
        `datasets.${t}.elements.${e}`,
        `datasets.${t}`,
        `elements.${e}`,
        ""
      ]
    ]);
  }
  pluginScopeKeys(t) {
    const e = t.id, s = this.type;
    return ti(`${s}-plugin-${e}`, () => [
      [
        `plugins.${e}`,
        ...t.additionalOptionScopes || []
      ]
    ]);
  }
  _cachedScopes(t, e) {
    const s = this._scopeCache;
    let n = s.get(t);
    return (!n || e) && (n = /* @__PURE__ */ new Map(), s.set(t, n)), n;
  }
  getOptionScopes(t, e, s) {
    const { options: n, type: o } = this, r = this._cachedScopes(t, s), a = r.get(e);
    if (a)
      return a;
    const l = /* @__PURE__ */ new Set();
    e.forEach((h) => {
      t && (l.add(t), h.forEach((d) => fe(l, t, d))), h.forEach((d) => fe(l, n, d)), h.forEach((d) => fe(l, Ut[o] || {}, d)), h.forEach((d) => fe(l, B, d)), h.forEach((d) => fe(l, ss, d));
    });
    const c = Array.from(l);
    return c.length === 0 && c.push(/* @__PURE__ */ Object.create(null)), cr.has(e) && r.set(e, c), c;
  }
  chartOptionScopes() {
    const { options: t, type: e } = this;
    return [
      t,
      Ut[e] || {},
      B.datasets[e] || {},
      {
        type: e
      },
      B,
      ss
    ];
  }
  resolveNamedOptions(t, e, s, n = [
    ""
  ]) {
    const o = {
      $shared: !0
    }, { resolver: r, subPrefixes: a } = Hn(this._resolverCache, t, n);
    let l = r;
    if (Zh(r, e)) {
      o.$shared = !1, s = At(s) ? s() : s;
      const c = this.createResolver(t, s, a);
      l = te(r, s, c);
    }
    for (const c of e)
      o[c] = l[c];
    return o;
  }
  createResolver(t, e, s = [
    ""
  ], n) {
    const { resolver: o } = Hn(this._resolverCache, t, s);
    return A(e) ? te(o, e, void 0, n) : o;
  }
}
function Hn(i, t, e) {
  let s = i.get(t);
  s || (s = /* @__PURE__ */ new Map(), i.set(t, s));
  const n = e.join();
  let o = s.get(n);
  return o || (o = {
    resolver: ks(t, e),
    subPrefixes: e.filter((a) => !a.toLowerCase().includes("hover"))
  }, s.set(n, o)), o;
}
const Gh = (i) => A(i) && Object.getOwnPropertyNames(i).some((t) => At(i[t]));
function Zh(i, t) {
  const { isScriptable: e, isIndexable: s } = Wo(i);
  for (const n of t) {
    const o = e(n), r = s(n), a = (r || o) && i[n];
    if (o && (At(a) || Gh(a)) || r && H(a))
      return !0;
  }
  return !1;
}
var Qh = "4.5.1";
const Jh = [
  "top",
  "bottom",
  "left",
  "right",
  "chartArea"
];
function Vn(i, t) {
  return i === "top" || i === "bottom" || Jh.indexOf(i) === -1 && t === "x";
}
function jn(i, t) {
  return function(e, s) {
    return e[i] === s[i] ? e[t] - s[t] : e[i] - s[i];
  };
}
function Wn(i) {
  const t = i.chart, e = t.options.animation;
  t.notifyPlugins("afterRender"), F(e && e.onComplete, [
    i
  ], t);
}
function td(i) {
  const t = i.chart, e = t.options.animation;
  F(e && e.onProgress, [
    i
  ], t);
}
function hr(i) {
  return Ps() && typeof i == "string" ? i = document.getElementById(i) : i && i.length && (i = i[0]), i && i.canvas && (i = i.canvas), i;
}
const li = {}, Un = (i) => {
  const t = hr(i);
  return Object.values(li).filter((e) => e.canvas === t).pop();
};
function ed(i, t, e) {
  const s = Object.keys(i);
  for (const n of s) {
    const o = +n;
    if (o >= t) {
      const r = i[n];
      delete i[n], (e > 0 || o > t) && (i[o + e] = r);
    }
  }
}
function id(i, t, e, s) {
  return !e || i.type === "mouseout" ? null : s ? t : i;
}
class J {
  static register(...t) {
    ot.add(...t), Yn();
  }
  static unregister(...t) {
    ot.remove(...t), Yn();
  }
  constructor(t, e) {
    const s = this.config = new qh(e), n = hr(t), o = Un(n);
    if (o)
      throw new Error("Canvas is already in use. Chart with ID '" + o.id + "' must be destroyed before the canvas with ID '" + o.canvas.id + "' can be reused.");
    const r = s.createResolver(s.chartOptionScopes(), this.getContext());
    this.platform = new (s.platform || xh(n))(), this.platform.updateConfig(s);
    const a = this.platform.acquireContext(n, r.aspectRatio), l = a && a.canvas, c = l && l.height, h = l && l.width;
    if (this.id = Za(), this.ctx = a, this.canvas = l, this.width = h, this.height = c, this._options = r, this._aspectRatio = this.aspectRatio, this._layers = [], this._metasets = [], this._stacks = void 0, this.boxes = [], this.currentDevicePixelRatio = void 0, this.chartArea = void 0, this._active = [], this._lastEvent = void 0, this._listeners = {}, this._responsiveListeners = void 0, this._sortedMetasets = [], this.scales = {}, this._plugins = new zh(), this.$proxies = {}, this._hiddenIndices = {}, this.attached = !1, this._animationsDisabled = void 0, this.$context = void 0, this._doResize = bl((d) => this.update(d), r.resizeDelay || 0), this._dataChanges = [], li[this.id] = this, !a || !l) {
      console.error("Failed to create chart: can't acquire context from the given item");
      return;
    }
    ut.listen(this, "complete", Wn), ut.listen(this, "progress", td), this._initialize(), this.attached && this.update();
  }
  get aspectRatio() {
    const { options: { aspectRatio: t, maintainAspectRatio: e }, width: s, height: n, _aspectRatio: o } = this;
    return C(t) ? e && o ? o : n ? s / n : null : t;
  }
  get data() {
    return this.config.data;
  }
  set data(t) {
    this.config.data = t;
  }
  get options() {
    return this._options;
  }
  set options(t) {
    this.config.options = t;
  }
  get registry() {
    return ot;
  }
  _initialize() {
    return this.notifyPlugins("beforeInit"), this.options.responsive ? this.resize() : pn(this, this.options.devicePixelRatio), this.bindEvents(), this.notifyPlugins("afterInit"), this;
  }
  clear() {
    return hn(this.canvas, this.ctx), this;
  }
  stop() {
    return ut.stop(this), this;
  }
  resize(t, e) {
    ut.running(this) ? this._resizeBeforeDraw = {
      width: t,
      height: e
    } : this._resize(t, e);
  }
  _resize(t, e) {
    const s = this.options, n = this.canvas, o = s.maintainAspectRatio && this.aspectRatio, r = this.platform.getMaximumSize(n, t, e, o), a = s.devicePixelRatio || this.platform.getDevicePixelRatio(), l = this.width ? "resize" : "attach";
    this.width = r.width, this.height = r.height, this._aspectRatio = this.aspectRatio, pn(this, a, !0) && (this.notifyPlugins("resize", {
      size: r
    }), F(s.onResize, [
      this,
      r
    ], this), this.attached && this._doResize(l) && this.render());
  }
  ensureScalesHaveIDs() {
    const e = this.options.scales || {};
    O(e, (s, n) => {
      s.id = n;
    });
  }
  buildOrUpdateScales() {
    const t = this.options, e = t.scales, s = this.scales, n = Object.keys(s).reduce((r, a) => (r[a] = !1, r), {});
    let o = [];
    e && (o = o.concat(Object.keys(e).map((r) => {
      const a = e[r], l = as(r, a), c = l === "r", h = l === "x";
      return {
        options: a,
        dposition: c ? "chartArea" : h ? "bottom" : "left",
        dtype: c ? "radialLinear" : h ? "category" : "linear"
      };
    }))), O(o, (r) => {
      const a = r.options, l = a.id, c = as(l, a), h = $(a.type, r.dtype);
      (a.position === void 0 || Vn(a.position, c) !== Vn(r.dposition)) && (a.position = r.dposition), n[l] = !0;
      let d = null;
      if (l in s && s[l].type === h)
        d = s[l];
      else {
        const u = ot.getScale(h);
        d = new u({
          id: l,
          type: h,
          ctx: this.ctx,
          chart: this
        }), s[d.id] = d;
      }
      d.init(a, t);
    }), O(n, (r, a) => {
      r || delete s[a];
    }), O(s, (r) => {
      Ze.configure(this, r, r.options), Ze.addBox(this, r);
    });
  }
  _updateMetasets() {
    const t = this._metasets, e = this.data.datasets.length, s = t.length;
    if (t.sort((n, o) => n.index - o.index), s > e) {
      for (let n = e; n < s; ++n)
        this._destroyDatasetMeta(n);
      t.splice(e, s - e);
    }
    this._sortedMetasets = t.slice(0).sort(jn("order", "index"));
  }
  _removeUnreferencedMetasets() {
    const { _metasets: t, data: { datasets: e } } = this;
    t.length > e.length && delete this._stacks, t.forEach((s, n) => {
      e.filter((o) => o === s._dataset).length === 0 && this._destroyDatasetMeta(n);
    });
  }
  buildOrUpdateControllers() {
    const t = [], e = this.data.datasets;
    let s, n;
    for (this._removeUnreferencedMetasets(), s = 0, n = e.length; s < n; s++) {
      const o = e[s];
      let r = this.getDatasetMeta(s);
      const a = o.type || this.config.type;
      if (r.type && r.type !== a && (this._destroyDatasetMeta(s), r = this.getDatasetMeta(s)), r.type = a, r.indexAxis = o.indexAxis || rs(a, this.options), r.order = o.order || 0, r.index = s, r.label = "" + o.label, r.visible = this.isDatasetVisible(s), r.controller)
        r.controller.updateIndex(s), r.controller.linkScales();
      else {
        const l = ot.getController(a), { datasetElementType: c, dataElementType: h } = B.datasets[a];
        Object.assign(l, {
          dataElementType: ot.getElement(h),
          datasetElementType: c && ot.getElement(c)
        }), r.controller = new l(this, s), t.push(r.controller);
      }
    }
    return this._updateMetasets(), t;
  }
  _resetElements() {
    O(this.data.datasets, (t, e) => {
      this.getDatasetMeta(e).controller.reset();
    }, this);
  }
  reset() {
    this._resetElements(), this.notifyPlugins("reset");
  }
  update(t) {
    const e = this.config;
    e.update();
    const s = this._options = e.createResolver(e.chartOptionScopes(), this.getContext()), n = this._animationsDisabled = !s.animation;
    if (this._updateScales(), this._checkEventBindings(), this._updateHiddenIndices(), this._plugins.invalidate(), this.notifyPlugins("beforeUpdate", {
      mode: t,
      cancelable: !0
    }) === !1)
      return;
    const o = this.buildOrUpdateControllers();
    this.notifyPlugins("beforeElementsUpdate");
    let r = 0;
    for (let c = 0, h = this.data.datasets.length; c < h; c++) {
      const { controller: d } = this.getDatasetMeta(c), u = !n && o.indexOf(d) === -1;
      d.buildOrUpdateElements(u), r = Math.max(+d.getMaxOverflow(), r);
    }
    r = this._minPadding = s.layout.autoPadding ? r : 0, this._updateLayout(r), n || O(o, (c) => {
      c.reset();
    }), this._updateDatasets(t), this.notifyPlugins("afterUpdate", {
      mode: t
    }), this._layers.sort(jn("z", "_idx"));
    const { _active: a, _lastEvent: l } = this;
    l ? this._eventHandler(l, !0) : a.length && this._updateHoverStyles(a, a, !0), this.render();
  }
  _updateScales() {
    O(this.scales, (t) => {
      Ze.removeBox(this, t);
    }), this.ensureScalesHaveIDs(), this.buildOrUpdateScales();
  }
  _checkEventBindings() {
    const t = this.options, e = new Set(Object.keys(this._listeners)), s = new Set(t.events);
    (!Qs(e, s) || !!this._responsiveListeners !== t.responsive) && (this.unbindEvents(), this.bindEvents());
  }
  _updateHiddenIndices() {
    const { _hiddenIndices: t } = this, e = this._getUniformDataChanges() || [];
    for (const { method: s, start: n, count: o } of e) {
      const r = s === "_removeElements" ? -o : o;
      ed(t, n, r);
    }
  }
  _getUniformDataChanges() {
    const t = this._dataChanges;
    if (!t || !t.length)
      return;
    this._dataChanges = [];
    const e = this.data.datasets.length, s = (o) => new Set(t.filter((r) => r[0] === o).map((r, a) => a + "," + r.splice(1).join(","))), n = s(0);
    for (let o = 1; o < e; o++)
      if (!Qs(n, s(o)))
        return;
    return Array.from(n).map((o) => o.split(",")).map((o) => ({
      method: o[1],
      start: +o[2],
      count: +o[3]
    }));
  }
  _updateLayout(t) {
    if (this.notifyPlugins("beforeLayout", {
      cancelable: !0
    }) === !1)
      return;
    Ze.update(this, this.width, this.height, t);
    const e = this.chartArea, s = e.width <= 0 || e.height <= 0;
    this._layers = [], O(this.boxes, (n) => {
      s && n.position === "chartArea" || (n.configure && n.configure(), this._layers.push(...n._layers()));
    }, this), this._layers.forEach((n, o) => {
      n._idx = o;
    }), this.notifyPlugins("afterLayout");
  }
  _updateDatasets(t) {
    if (this.notifyPlugins("beforeDatasetsUpdate", {
      mode: t,
      cancelable: !0
    }) !== !1) {
      for (let e = 0, s = this.data.datasets.length; e < s; ++e)
        this.getDatasetMeta(e).controller.configure();
      for (let e = 0, s = this.data.datasets.length; e < s; ++e)
        this._updateDataset(e, At(t) ? t({
          datasetIndex: e
        }) : t);
      this.notifyPlugins("afterDatasetsUpdate", {
        mode: t
      });
    }
  }
  _updateDataset(t, e) {
    const s = this.getDatasetMeta(t), n = {
      meta: s,
      index: t,
      mode: e,
      cancelable: !0
    };
    this.notifyPlugins("beforeDatasetUpdate", n) !== !1 && (s.controller._update(e), n.cancelable = !1, this.notifyPlugins("afterDatasetUpdate", n));
  }
  render() {
    this.notifyPlugins("beforeRender", {
      cancelable: !0
    }) !== !1 && (ut.has(this) ? this.attached && !ut.running(this) && ut.start(this) : (this.draw(), Wn({
      chart: this
    })));
  }
  draw() {
    let t;
    if (this._resizeBeforeDraw) {
      const { width: s, height: n } = this._resizeBeforeDraw;
      this._resizeBeforeDraw = null, this._resize(s, n);
    }
    if (this.clear(), this.width <= 0 || this.height <= 0 || this.notifyPlugins("beforeDraw", {
      cancelable: !0
    }) === !1)
      return;
    const e = this._layers;
    for (t = 0; t < e.length && e[t].z <= 0; ++t)
      e[t].draw(this.chartArea);
    for (this._drawDatasets(); t < e.length; ++t)
      e[t].draw(this.chartArea);
    this.notifyPlugins("afterDraw");
  }
  _getSortedDatasetMetas(t) {
    const e = this._sortedMetasets, s = [];
    let n, o;
    for (n = 0, o = e.length; n < o; ++n) {
      const r = e[n];
      (!t || r.visible) && s.push(r);
    }
    return s;
  }
  getSortedVisibleDatasetMetas() {
    return this._getSortedDatasetMetas(!0);
  }
  _drawDatasets() {
    if (this.notifyPlugins("beforeDatasetsDraw", {
      cancelable: !0
    }) === !1)
      return;
    const t = this.getSortedVisibleDatasetMetas();
    for (let e = t.length - 1; e >= 0; --e)
      this._drawDataset(t[e]);
    this.notifyPlugins("afterDatasetsDraw");
  }
  _drawDataset(t) {
    const e = this.ctx, s = {
      meta: t,
      index: t.index,
      cancelable: !0
    }, n = Qo(this, t);
    this.notifyPlugins("beforeDatasetDraw", s) !== !1 && (n && ws(e, n), t.controller.draw(), n && Ss(e), s.cancelable = !1, this.notifyPlugins("afterDatasetDraw", s));
  }
  isPointInArea(t) {
    return Ee(t, this.chartArea, this._minPadding);
  }
  getElementsAtEventForMode(t, e, s, n) {
    const o = Jc.modes[e];
    return typeof o == "function" ? o(this, t, s, n) : [];
  }
  getDatasetMeta(t) {
    const e = this.data.datasets[t], s = this._metasets;
    let n = s.filter((o) => o && o._dataset === e).pop();
    return n || (n = {
      type: null,
      data: [],
      dataset: null,
      controller: null,
      hidden: null,
      xAxisID: null,
      yAxisID: null,
      order: e && e.order || 0,
      index: t,
      _dataset: e,
      _parsed: [],
      _sorted: !1
    }, s.push(n)), n;
  }
  getContext() {
    return this.$context || (this.$context = Yt(null, {
      chart: this,
      type: "chart"
    }));
  }
  getVisibleDatasetCount() {
    return this.getSortedVisibleDatasetMetas().length;
  }
  isDatasetVisible(t) {
    const e = this.data.datasets[t];
    if (!e)
      return !1;
    const s = this.getDatasetMeta(t);
    return typeof s.hidden == "boolean" ? !s.hidden : !e.hidden;
  }
  setDatasetVisibility(t, e) {
    const s = this.getDatasetMeta(t);
    s.hidden = !e;
  }
  toggleDataVisibility(t) {
    this._hiddenIndices[t] = !this._hiddenIndices[t];
  }
  getDataVisibility(t) {
    return !this._hiddenIndices[t];
  }
  _updateVisibility(t, e, s) {
    const n = s ? "show" : "hide", o = this.getDatasetMeta(t), r = o.controller._resolveAnimations(void 0, n);
    De(e) ? (o.data[e].hidden = !s, this.update()) : (this.setDatasetVisibility(t, s), r.update(o, {
      visible: s
    }), this.update((a) => a.datasetIndex === t ? n : void 0));
  }
  hide(t, e) {
    this._updateVisibility(t, e, !1);
  }
  show(t, e) {
    this._updateVisibility(t, e, !0);
  }
  _destroyDatasetMeta(t) {
    const e = this._metasets[t];
    e && e.controller && e.controller._destroy(), delete this._metasets[t];
  }
  _stop() {
    let t, e;
    for (this.stop(), ut.remove(this), t = 0, e = this.data.datasets.length; t < e; ++t)
      this._destroyDatasetMeta(t);
  }
  destroy() {
    this.notifyPlugins("beforeDestroy");
    const { canvas: t, ctx: e } = this;
    this._stop(), this.config.clearCache(), t && (this.unbindEvents(), hn(t, e), this.platform.releaseContext(e), this.canvas = null, this.ctx = null), delete li[this.id], this.notifyPlugins("afterDestroy");
  }
  toBase64Image(...t) {
    return this.canvas.toDataURL(...t);
  }
  bindEvents() {
    this.bindUserEvents(), this.options.responsive ? this.bindResponsiveEvents() : this.attached = !0;
  }
  bindUserEvents() {
    const t = this._listeners, e = this.platform, s = (o, r) => {
      e.addEventListener(this, o, r), t[o] = r;
    }, n = (o, r, a) => {
      o.offsetX = r, o.offsetY = a, this._eventHandler(o);
    };
    O(this.options.events, (o) => s(o, n));
  }
  bindResponsiveEvents() {
    this._responsiveListeners || (this._responsiveListeners = {});
    const t = this._responsiveListeners, e = this.platform, s = (l, c) => {
      e.addEventListener(this, l, c), t[l] = c;
    }, n = (l, c) => {
      t[l] && (e.removeEventListener(this, l, c), delete t[l]);
    }, o = (l, c) => {
      this.canvas && this.resize(l, c);
    };
    let r;
    const a = () => {
      n("attach", a), this.attached = !0, this.resize(), s("resize", o), s("detach", r);
    };
    r = () => {
      this.attached = !1, n("resize", o), this._stop(), this._resize(0, 0), s("attach", a);
    }, e.isAttached(this.canvas) ? a() : r();
  }
  unbindEvents() {
    O(this._listeners, (t, e) => {
      this.platform.removeEventListener(this, e, t);
    }), this._listeners = {}, O(this._responsiveListeners, (t, e) => {
      this.platform.removeEventListener(this, e, t);
    }), this._responsiveListeners = void 0;
  }
  updateHoverStyle(t, e, s) {
    const n = s ? "set" : "remove";
    let o, r, a, l;
    for (e === "dataset" && (o = this.getDatasetMeta(t[0].datasetIndex), o.controller["_" + n + "DatasetHoverStyle"]()), a = 0, l = t.length; a < l; ++a) {
      r = t[a];
      const c = r && this.getDatasetMeta(r.datasetIndex).controller;
      c && c[n + "HoverStyle"](r.element, r.datasetIndex, r.index);
    }
  }
  getActiveElements() {
    return this._active || [];
  }
  setActiveElements(t) {
    const e = this._active || [], s = t.map(({ datasetIndex: o, index: r }) => {
      const a = this.getDatasetMeta(o);
      if (!a)
        throw new Error("No dataset found at index " + o);
      return {
        datasetIndex: o,
        element: a.data[r],
        index: r
      };
    });
    !mi(s, e) && (this._active = s, this._lastEvent = null, this._updateHoverStyles(s, e));
  }
  notifyPlugins(t, e, s) {
    return this._plugins.notify(this, t, e, s);
  }
  isPluginEnabled(t) {
    return this._plugins._cache.filter((e) => e.plugin.id === t).length === 1;
  }
  _updateHoverStyles(t, e, s) {
    const n = this.options.hover, o = (l, c) => l.filter((h) => !c.some((d) => h.datasetIndex === d.datasetIndex && h.index === d.index)), r = o(e, t), a = s ? t : o(t, e);
    r.length && this.updateHoverStyle(r, n.mode, !1), a.length && n.mode && this.updateHoverStyle(a, n.mode, !0);
  }
  _eventHandler(t, e) {
    const s = {
      event: t,
      replay: e,
      cancelable: !0,
      inChartArea: this.isPointInArea(t)
    }, n = (r) => (r.options.events || this.options.events).includes(t.native.type);
    if (this.notifyPlugins("beforeEvent", s, n) === !1)
      return;
    const o = this._handleEvent(t, e, s.inChartArea);
    return s.cancelable = !1, this.notifyPlugins("afterEvent", s, n), (o || s.changed) && this.render(), this;
  }
  _handleEvent(t, e, s) {
    const { _active: n = [], options: o } = this, r = e, a = this._getActiveElements(t, n, s, r), l = sl(t), c = id(t, this._lastEvent, s, l);
    s && (this._lastEvent = null, F(o.onHover, [
      t,
      a,
      this
    ], this), l && F(o.onClick, [
      t,
      a,
      this
    ], this));
    const h = !mi(a, n);
    return (h || e) && (this._active = a, this._updateHoverStyles(a, n, e)), this._lastEvent = c, h;
  }
  _getActiveElements(t, e, s, n) {
    if (t.type === "mouseout")
      return [];
    if (!s)
      return e;
    const o = this.options.hover;
    return this.getElementsAtEventForMode(t, o.mode, o, n);
  }
}
S(J, "defaults", B), S(J, "instances", li), S(J, "overrides", Ut), S(J, "registry", ot), S(J, "version", Qh), S(J, "getChart", Un);
function Yn() {
  return O(J.instances, (i) => i._plugins.invalidate());
}
function dr(i, t, e = t) {
  i.lineCap = $(e.borderCapStyle, t.borderCapStyle), i.setLineDash($(e.borderDash, t.borderDash)), i.lineDashOffset = $(e.borderDashOffset, t.borderDashOffset), i.lineJoin = $(e.borderJoinStyle, t.borderJoinStyle), i.lineWidth = $(e.borderWidth, t.borderWidth), i.strokeStyle = $(e.borderColor, t.borderColor);
}
function sd(i, t, e) {
  i.lineTo(e.x, e.y);
}
function nd(i) {
  return i.stepped ? Tl : i.tension || i.cubicInterpolationMode === "monotone" ? El : sd;
}
function ur(i, t, e = {}) {
  const s = i.length, { start: n = 0, end: o = s - 1 } = e, { start: r, end: a } = t, l = Math.max(n, r), c = Math.min(o, a), h = n < r && o < r || n > a && o > a;
  return {
    count: s,
    start: l,
    loop: t.loop,
    ilen: c < l && !h ? s + c - l : c - l
  };
}
function od(i, t, e, s) {
  const { points: n, options: o } = t, { count: r, start: a, loop: l, ilen: c } = ur(n, e, s), h = nd(o);
  let { move: d = !0, reverse: u } = s || {}, f, g, p;
  for (f = 0; f <= c; ++f)
    g = n[(a + (u ? c - f : f)) % r], !g.skip && (d ? (i.moveTo(g.x, g.y), d = !1) : h(i, p, g, u, o.stepped), p = g);
  return l && (g = n[(a + (u ? c : 0)) % r], h(i, p, g, u, o.stepped)), !!l;
}
function rd(i, t, e, s) {
  const n = t.points, { count: o, start: r, ilen: a } = ur(n, e, s), { move: l = !0, reverse: c } = s || {};
  let h = 0, d = 0, u, f, g, p, m, b;
  const y = (x) => (r + (c ? a - x : x)) % o, v = () => {
    p !== m && (i.lineTo(h, m), i.lineTo(h, p), i.lineTo(h, b));
  };
  for (l && (f = n[y(0)], i.moveTo(f.x, f.y)), u = 0; u <= a; ++u) {
    if (f = n[y(u)], f.skip)
      continue;
    const x = f.x, _ = f.y, M = x | 0;
    M === g ? (_ < p ? p = _ : _ > m && (m = _), h = (d * h + x) / ++d) : (v(), i.lineTo(x, _), g = M, d = 0, p = m = _), b = _;
  }
  v();
}
function ls(i) {
  const t = i.options, e = t.borderDash && t.borderDash.length;
  return !i._decimated && !i._loop && !t.tension && t.cubicInterpolationMode !== "monotone" && !t.stepped && !e ? rd : od;
}
function ad(i) {
  return i.stepped ? dc : i.tension || i.cubicInterpolationMode === "monotone" ? uc : zt;
}
function ld(i, t, e, s) {
  let n = t._path;
  n || (n = t._path = new Path2D(), t.path(n, e, s) && n.closePath()), dr(i, t.options), i.stroke(n);
}
function cd(i, t, e, s) {
  const { segments: n, options: o } = t, r = ls(t);
  for (const a of n)
    dr(i, o, a.style), i.beginPath(), r(i, t, a, {
      start: e,
      end: e + s - 1
    }) && i.closePath(), i.stroke();
}
const hd = typeof Path2D == "function";
function dd(i, t, e, s) {
  hd && !t.options.segment ? ld(i, t, e, s) : cd(i, t, e, s);
}
class vt extends $t {
  constructor(t) {
    super(), this.animated = !0, this.options = void 0, this._chart = void 0, this._loop = void 0, this._fullLoop = void 0, this._path = void 0, this._points = void 0, this._segments = void 0, this._decimated = !1, this._pointsUpdated = !1, this._datasetIndex = void 0, t && Object.assign(this, t);
  }
  updateControlPoints(t, e) {
    const s = this.options;
    if ((s.tension || s.cubicInterpolationMode === "monotone") && !s.stepped && !this._pointsUpdated) {
      const n = s.spanGaps ? this._loop : this._fullLoop;
      sc(this._points, s, t, n, e), this._pointsUpdated = !0;
    }
  }
  set points(t) {
    this._points = t, delete this._segments, delete this._path, this._pointsUpdated = !1;
  }
  get points() {
    return this._points;
  }
  get segments() {
    return this._segments || (this._segments = xc(this, this.options.segment));
  }
  first() {
    const t = this.segments, e = this.points;
    return t.length && e[t[0].start];
  }
  last() {
    const t = this.segments, e = this.points, s = t.length;
    return s && e[t[s - 1].end];
  }
  interpolate(t, e) {
    const s = this.options, n = t[e], o = this.points, r = Zo(this, {
      property: e,
      start: n,
      end: n
    });
    if (!r.length)
      return;
    const a = [], l = ad(s);
    let c, h;
    for (c = 0, h = r.length; c < h; ++c) {
      const { start: d, end: u } = r[c], f = o[d], g = o[u];
      if (f === g) {
        a.push(f);
        continue;
      }
      const p = Math.abs((n - f[e]) / (g[e] - f[e])), m = l(f, g, p, s.stepped);
      m[e] = t[e], a.push(m);
    }
    return a.length === 1 ? a[0] : a;
  }
  pathSegment(t, e, s) {
    return ls(this)(t, this, e, s);
  }
  path(t, e, s) {
    const n = this.segments, o = ls(this);
    let r = this._loop;
    e = e || 0, s = s || this.points.length - e;
    for (const a of n)
      r &= o(t, this, a, {
        start: e,
        end: e + s - 1
      });
    return !!r;
  }
  draw(t, e, s, n) {
    const o = this.options || {};
    (this.points || []).length && o.borderWidth && (t.save(), dd(t, this, s, n), t.restore()), this.animated && (this._pointsUpdated = !1, this._path = void 0);
  }
}
S(vt, "id", "line"), S(vt, "defaults", {
  borderCapStyle: "butt",
  borderDash: [],
  borderDashOffset: 0,
  borderJoinStyle: "miter",
  borderWidth: 3,
  capBezierPoints: !0,
  cubicInterpolationMode: "default",
  fill: !1,
  spanGaps: !1,
  stepped: !1,
  tension: 0
}), S(vt, "defaultRoutes", {
  backgroundColor: "backgroundColor",
  borderColor: "borderColor"
}), S(vt, "descriptors", {
  _scriptable: !0,
  _indexable: (t) => t !== "borderDash" && t !== "fill"
});
function Kn(i, t, e, s) {
  const n = i.options, { [e]: o } = i.getProps([
    e
  ], s);
  return Math.abs(t - o) < n.radius + n.hitRadius;
}
class ci extends $t {
  constructor(e) {
    super();
    S(this, "parsed");
    S(this, "skip");
    S(this, "stop");
    this.options = void 0, this.parsed = void 0, this.skip = void 0, this.stop = void 0, e && Object.assign(this, e);
  }
  inRange(e, s, n) {
    const o = this.options, { x: r, y: a } = this.getProps([
      "x",
      "y"
    ], n);
    return Math.pow(e - r, 2) + Math.pow(s - a, 2) < Math.pow(o.hitRadius + o.radius, 2);
  }
  inXRange(e, s) {
    return Kn(this, e, "x", s);
  }
  inYRange(e, s) {
    return Kn(this, e, "y", s);
  }
  getCenterPoint(e) {
    const { x: s, y: n } = this.getProps([
      "x",
      "y"
    ], e);
    return {
      x: s,
      y: n
    };
  }
  size(e) {
    e = e || this.options || {};
    let s = e.radius || 0;
    s = Math.max(s, s && e.hoverRadius || 0);
    const n = s && e.borderWidth || 0;
    return (s + n) * 2;
  }
  draw(e, s) {
    const n = this.options;
    this.skip || n.radius < 0.1 || !Ee(this, s, this.size(n) / 2) || (e.strokeStyle = n.borderColor, e.lineWidth = n.borderWidth, e.fillStyle = n.backgroundColor, ns(e, n, this.x, this.y));
  }
  getRange() {
    const e = this.options || {};
    return e.radius + e.hitRadius;
  }
}
S(ci, "id", "point"), /**
* @type {any}
*/
S(ci, "defaults", {
  borderWidth: 1,
  hitRadius: 1,
  hoverBorderWidth: 1,
  hoverRadius: 4,
  pointStyle: "circle",
  radius: 3,
  rotation: 0
}), /**
* @type {any}
*/
S(ci, "defaultRoutes", {
  backgroundColor: "backgroundColor",
  borderColor: "borderColor"
});
function fr(i, t) {
  const { x: e, y: s, base: n, width: o, height: r } = i.getProps([
    "x",
    "y",
    "base",
    "width",
    "height"
  ], t);
  let a, l, c, h, d;
  return i.horizontal ? (d = r / 2, a = Math.min(e, n), l = Math.max(e, n), c = s - d, h = s + d) : (d = o / 2, a = e - d, l = e + d, c = Math.min(s, n), h = Math.max(s, n)), {
    left: a,
    top: c,
    right: l,
    bottom: h
  };
}
function wt(i, t, e, s) {
  return i ? 0 : G(t, e, s);
}
function ud(i, t, e) {
  const s = i.options.borderWidth, n = i.borderSkipped, o = jo(s);
  return {
    t: wt(n.top, o.top, 0, e),
    r: wt(n.right, o.right, 0, t),
    b: wt(n.bottom, o.bottom, 0, e),
    l: wt(n.left, o.left, 0, t)
  };
}
function fd(i, t, e) {
  const { enableBorderRadius: s } = i.getProps([
    "enableBorderRadius"
  ]), n = i.options.borderRadius, o = ke(n), r = Math.min(t, e), a = i.borderSkipped, l = s || A(n);
  return {
    topLeft: wt(!l || a.top || a.left, o.topLeft, 0, r),
    topRight: wt(!l || a.top || a.right, o.topRight, 0, r),
    bottomLeft: wt(!l || a.bottom || a.left, o.bottomLeft, 0, r),
    bottomRight: wt(!l || a.bottom || a.right, o.bottomRight, 0, r)
  };
}
function pd(i) {
  const t = fr(i), e = t.right - t.left, s = t.bottom - t.top, n = ud(i, e / 2, s / 2), o = fd(i, e / 2, s / 2);
  return {
    outer: {
      x: t.left,
      y: t.top,
      w: e,
      h: s,
      radius: o
    },
    inner: {
      x: t.left + n.l,
      y: t.top + n.t,
      w: e - n.l - n.r,
      h: s - n.t - n.b,
      radius: {
        topLeft: Math.max(0, o.topLeft - Math.max(n.t, n.l)),
        topRight: Math.max(0, o.topRight - Math.max(n.t, n.r)),
        bottomLeft: Math.max(0, o.bottomLeft - Math.max(n.b, n.l)),
        bottomRight: Math.max(0, o.bottomRight - Math.max(n.b, n.r))
      }
    }
  };
}
function Xi(i, t, e, s) {
  const n = t === null, o = e === null, a = i && !(n && o) && fr(i, s);
  return a && (n || yi(t, a.left, a.right)) && (o || yi(e, a.top, a.bottom));
}
function gd(i) {
  return i.topLeft || i.topRight || i.bottomLeft || i.bottomRight;
}
function md(i, t) {
  i.rect(t.x, t.y, t.w, t.h);
}
function qi(i, t, e = {}) {
  const s = i.x !== e.x ? -t : 0, n = i.y !== e.y ? -t : 0, o = (i.x + i.w !== e.x + e.w ? t : 0) - s, r = (i.y + i.h !== e.y + e.h ? t : 0) - n;
  return {
    x: i.x + s,
    y: i.y + n,
    w: i.w + o,
    h: i.h + r,
    radius: i.radius
  };
}
class hi extends $t {
  constructor(t) {
    super(), this.options = void 0, this.horizontal = void 0, this.base = void 0, this.width = void 0, this.height = void 0, this.inflateAmount = void 0, t && Object.assign(this, t);
  }
  draw(t) {
    const { inflateAmount: e, options: { borderColor: s, backgroundColor: n } } = this, { inner: o, outer: r } = pd(this), a = gd(r.radius) ? os : md;
    t.save(), (r.w !== o.w || r.h !== o.h) && (t.beginPath(), a(t, qi(r, e, o)), t.clip(), a(t, qi(o, -e, r)), t.fillStyle = s, t.fill("evenodd")), t.beginPath(), a(t, qi(o, e)), t.fillStyle = n, t.fill(), t.restore();
  }
  inRange(t, e, s) {
    return Xi(this, t, e, s);
  }
  inXRange(t, e) {
    return Xi(this, t, null, e);
  }
  inYRange(t, e) {
    return Xi(this, null, t, e);
  }
  getCenterPoint(t) {
    const { x: e, y: s, base: n, horizontal: o } = this.getProps([
      "x",
      "y",
      "base",
      "horizontal"
    ], t);
    return {
      x: o ? (e + n) / 2 : e,
      y: o ? s : (s + n) / 2
    };
  }
  getRange(t) {
    return t === "x" ? this.width / 2 : this.height / 2;
  }
}
S(hi, "id", "bar"), S(hi, "defaults", {
  borderSkipped: "start",
  borderWidth: 0,
  borderRadius: 0,
  inflateAmount: "auto",
  pointStyle: void 0
}), S(hi, "defaultRoutes", {
  backgroundColor: "backgroundColor",
  borderColor: "borderColor"
});
function bd(i, t, e) {
  const s = i.segments, n = i.points, o = t.points, r = [];
  for (const a of s) {
    let { start: l, end: c } = a;
    c = Di(l, c, n);
    const h = cs(e, n[l], n[c], a.loop);
    if (!t.segments) {
      r.push({
        source: a,
        target: h,
        start: n[l],
        end: n[c]
      });
      continue;
    }
    const d = Zo(t, h);
    for (const u of d) {
      const f = cs(e, o[u.start], o[u.end], u.loop), g = Go(a, n, f);
      for (const p of g)
        r.push({
          source: p,
          target: u,
          start: {
            [e]: Xn(h, f, "start", Math.max)
          },
          end: {
            [e]: Xn(h, f, "end", Math.min)
          }
        });
    }
  }
  return r;
}
function cs(i, t, e, s) {
  if (s)
    return;
  let n = t[i], o = e[i];
  return i === "angle" && (n = rt(n), o = rt(o)), {
    property: i,
    start: n,
    end: o
  };
}
function _d(i, t) {
  const { x: e = null, y: s = null } = i || {}, n = t.points, o = [];
  return t.segments.forEach(({ start: r, end: a }) => {
    a = Di(r, a, n);
    const l = n[r], c = n[a];
    s !== null ? (o.push({
      x: l.x,
      y: s
    }), o.push({
      x: c.x,
      y: s
    })) : e !== null && (o.push({
      x: e,
      y: l.y
    }), o.push({
      x: e,
      y: c.y
    }));
  }), o;
}
function Di(i, t, e) {
  for (; t > i; t--) {
    const s = e[t];
    if (!isNaN(s.x) && !isNaN(s.y))
      break;
  }
  return t;
}
function Xn(i, t, e, s) {
  return i && t ? s(i[e], t[e]) : i ? i[e] : t ? t[e] : 0;
}
function pr(i, t) {
  let e = [], s = !1;
  return H(i) ? (s = !0, e = i) : e = _d(i, t), e.length ? new vt({
    points: e,
    options: {
      tension: 0
    },
    _loop: s,
    _fullLoop: s
  }) : null;
}
function qn(i) {
  return i && i.fill !== !1;
}
function yd(i, t, e) {
  let n = i[t].fill;
  const o = [
    t
  ];
  let r;
  if (!e)
    return n;
  for (; n !== !1 && o.indexOf(n) === -1; ) {
    if (!U(n))
      return n;
    if (r = i[n], !r)
      return !1;
    if (r.visible)
      return n;
    o.push(n), n = r.fill;
  }
  return !1;
}
function xd(i, t, e) {
  const s = kd(i);
  if (A(s))
    return isNaN(s.value) ? !1 : s;
  let n = parseFloat(s);
  return U(n) && Math.floor(n) === n ? vd(s[0], t, n, e) : [
    "origin",
    "start",
    "end",
    "stack",
    "shape"
  ].indexOf(s) >= 0 && s;
}
function vd(i, t, e, s) {
  return (i === "-" || i === "+") && (e = t + e), e === t || e < 0 || e >= s ? !1 : e;
}
function wd(i, t) {
  let e = null;
  return i === "start" ? e = t.bottom : i === "end" ? e = t.top : A(i) ? e = t.getPixelForValue(i.value) : t.getBasePixel && (e = t.getBasePixel()), e;
}
function Sd(i, t, e) {
  let s;
  return i === "start" ? s = e : i === "end" ? s = t.options.reverse ? t.min : t.max : A(i) ? s = i.value : s = t.getBaseValue(), s;
}
function kd(i) {
  const t = i.options, e = t.fill;
  let s = $(e && e.target, e);
  return s === void 0 && (s = !!t.backgroundColor), s === !1 || s === null ? !1 : s === !0 ? "origin" : s;
}
function Md(i) {
  const { scale: t, index: e, line: s } = i, n = [], o = s.segments, r = s.points, a = Ad(t, e);
  a.push(pr({
    x: null,
    y: t.bottom
  }, s));
  for (let l = 0; l < o.length; l++) {
    const c = o[l];
    for (let h = c.start; h <= c.end; h++)
      Pd(n, r[h], a);
  }
  return new vt({
    points: n,
    options: {}
  });
}
function Ad(i, t) {
  const e = [], s = i.getMatchingVisibleMetas("line");
  for (let n = 0; n < s.length; n++) {
    const o = s[n];
    if (o.index === t)
      break;
    o.hidden || e.unshift(o.dataset);
  }
  return e;
}
function Pd(i, t, e) {
  const s = [];
  for (let n = 0; n < e.length; n++) {
    const o = e[n], { first: r, last: a, point: l } = $d(o, t, "x");
    if (!(!l || r && a)) {
      if (r)
        s.unshift(l);
      else if (i.push(l), !a)
        break;
    }
  }
  i.push(...s);
}
function $d(i, t, e) {
  const s = i.interpolate(t, e);
  if (!s)
    return {};
  const n = s[e], o = i.segments, r = i.points;
  let a = !1, l = !1;
  for (let c = 0; c < o.length; c++) {
    const h = o[c], d = r[h.start][e], u = r[h.end][e];
    if (yi(n, d, u)) {
      a = n === d, l = n === u;
      break;
    }
  }
  return {
    first: a,
    last: l,
    point: s
  };
}
class gr {
  constructor(t) {
    this.x = t.x, this.y = t.y, this.radius = t.radius;
  }
  pathSegment(t, e, s) {
    const { x: n, y: o, radius: r } = this;
    return e = e || {
      start: 0,
      end: lt
    }, t.arc(n, o, r, e.end, e.start, !0), !s.bounds;
  }
  interpolate(t) {
    const { x: e, y: s, radius: n } = this, o = t.angle;
    return {
      x: e + Math.cos(o) * n,
      y: s + Math.sin(o) * n,
      angle: o
    };
  }
}
function Cd(i) {
  const { chart: t, fill: e, line: s } = i;
  if (U(e))
    return Od(t, e);
  if (e === "stack")
    return Md(i);
  if (e === "shape")
    return !0;
  const n = Dd(i);
  return n instanceof gr ? n : pr(n, s);
}
function Od(i, t) {
  const e = i.getDatasetMeta(t);
  return e && i.isDatasetVisible(t) ? e.dataset : null;
}
function Dd(i) {
  return (i.scale || {}).getPointPositionForValue ? Ed(i) : Td(i);
}
function Td(i) {
  const { scale: t = {}, fill: e } = i, s = wd(e, t);
  if (U(s)) {
    const n = t.isHorizontal();
    return {
      x: n ? s : null,
      y: n ? null : s
    };
  }
  return null;
}
function Ed(i) {
  const { scale: t, fill: e } = i, s = t.options, n = t.getLabels().length, o = s.reverse ? t.max : t.min, r = Sd(e, t, o), a = [];
  if (s.grid.circular) {
    const l = t.getPointPositionForValue(0, o);
    return new gr({
      x: l.x,
      y: l.y,
      radius: t.getDistanceFromCenterForValue(r)
    });
  }
  for (let l = 0; l < n; ++l)
    a.push(t.getPointPositionForValue(l, r));
  return a;
}
function Gi(i, t, e) {
  const s = Cd(t), { chart: n, index: o, line: r, scale: a, axis: l } = t, c = r.options, h = c.fill, d = c.backgroundColor, { above: u = d, below: f = d } = h || {}, g = n.getDatasetMeta(o), p = Qo(n, g);
  s && r.points.length && (ws(i, e), Ld(i, {
    line: r,
    target: s,
    above: u,
    below: f,
    area: e,
    scale: a,
    axis: l,
    clip: p
  }), Ss(i));
}
function Ld(i, t) {
  const { line: e, target: s, above: n, below: o, area: r, scale: a, clip: l } = t, c = e._loop ? "angle" : t.axis;
  i.save();
  let h = o;
  o !== n && (c === "x" ? (Gn(i, s, r.top), Zi(i, {
    line: e,
    target: s,
    color: n,
    scale: a,
    property: c,
    clip: l
  }), i.restore(), i.save(), Gn(i, s, r.bottom)) : c === "y" && (Zn(i, s, r.left), Zi(i, {
    line: e,
    target: s,
    color: o,
    scale: a,
    property: c,
    clip: l
  }), i.restore(), i.save(), Zn(i, s, r.right), h = n)), Zi(i, {
    line: e,
    target: s,
    color: h,
    scale: a,
    property: c,
    clip: l
  }), i.restore();
}
function Gn(i, t, e) {
  const { segments: s, points: n } = t;
  let o = !0, r = !1;
  i.beginPath();
  for (const a of s) {
    const { start: l, end: c } = a, h = n[l], d = n[Di(l, c, n)];
    o ? (i.moveTo(h.x, h.y), o = !1) : (i.lineTo(h.x, e), i.lineTo(h.x, h.y)), r = !!t.pathSegment(i, a, {
      move: r
    }), r ? i.closePath() : i.lineTo(d.x, e);
  }
  i.lineTo(t.first().x, e), i.closePath(), i.clip();
}
function Zn(i, t, e) {
  const { segments: s, points: n } = t;
  let o = !0, r = !1;
  i.beginPath();
  for (const a of s) {
    const { start: l, end: c } = a, h = n[l], d = n[Di(l, c, n)];
    o ? (i.moveTo(h.x, h.y), o = !1) : (i.lineTo(e, h.y), i.lineTo(h.x, h.y)), r = !!t.pathSegment(i, a, {
      move: r
    }), r ? i.closePath() : i.lineTo(e, d.y);
  }
  i.lineTo(e, t.first().y), i.closePath(), i.clip();
}
function Zi(i, t) {
  const { line: e, target: s, property: n, color: o, scale: r, clip: a } = t, l = bd(e, s, n);
  for (const { source: c, target: h, start: d, end: u } of l) {
    const { style: { backgroundColor: f = o } = {} } = c, g = s !== !0;
    i.save(), i.fillStyle = f, Id(i, r, a, g && cs(n, d, u)), i.beginPath();
    const p = !!e.pathSegment(i, c);
    let m;
    if (g) {
      p ? i.closePath() : Qn(i, s, u, n);
      const b = !!s.pathSegment(i, h, {
        move: p,
        reverse: !0
      });
      m = p && b, m || Qn(i, s, d, n);
    }
    i.closePath(), i.fill(m ? "evenodd" : "nonzero"), i.restore();
  }
}
function Id(i, t, e, s) {
  const n = t.chart.chartArea, { property: o, start: r, end: a } = s || {};
  if (o === "x" || o === "y") {
    let l, c, h, d;
    o === "x" ? (l = r, c = n.top, h = a, d = n.bottom) : (l = n.left, c = r, h = n.right, d = a), i.beginPath(), e && (l = Math.max(l, e.left), h = Math.min(h, e.right), c = Math.max(c, e.top), d = Math.min(d, e.bottom)), i.rect(l, c, h - l, d - c), i.clip();
  }
}
function Qn(i, t, e, s) {
  const n = t.interpolate(e, s);
  n && i.lineTo(n.x, n.y);
}
var Rd = {
  id: "filler",
  afterDatasetsUpdate(i, t, e) {
    const s = (i.data.datasets || []).length, n = [];
    let o, r, a, l;
    for (r = 0; r < s; ++r)
      o = i.getDatasetMeta(r), a = o.dataset, l = null, a && a.options && a instanceof vt && (l = {
        visible: i.isDatasetVisible(r),
        index: r,
        fill: xd(a, r, s),
        chart: i,
        axis: o.controller.options.indexAxis,
        scale: o.vScale,
        line: a
      }), o.$filler = l, n.push(l);
    for (r = 0; r < s; ++r)
      l = n[r], !(!l || l.fill === !1) && (l.fill = yd(n, r, e.propagate));
  },
  beforeDraw(i, t, e) {
    const s = e.drawTime === "beforeDraw", n = i.getSortedVisibleDatasetMetas(), o = i.chartArea;
    for (let r = n.length - 1; r >= 0; --r) {
      const a = n[r].$filler;
      a && (a.line.updateControlPoints(o, a.axis), s && a.fill && Gi(i.ctx, a, o));
    }
  },
  beforeDatasetsDraw(i, t, e) {
    if (e.drawTime !== "beforeDatasetsDraw")
      return;
    const s = i.getSortedVisibleDatasetMetas();
    for (let n = s.length - 1; n >= 0; --n) {
      const o = s[n].$filler;
      qn(o) && Gi(i.ctx, o, i.chartArea);
    }
  },
  beforeDatasetDraw(i, t, e) {
    const s = t.meta.$filler;
    !qn(s) || e.drawTime !== "beforeDatasetDraw" || Gi(i.ctx, s, i.chartArea);
  },
  defaults: {
    propagate: !0,
    drawTime: "beforeDatasetDraw"
  }
};
const me = {
  average(i) {
    if (!i.length)
      return !1;
    let t, e, s = /* @__PURE__ */ new Set(), n = 0, o = 0;
    for (t = 0, e = i.length; t < e; ++t) {
      const a = i[t].element;
      if (a && a.hasValue()) {
        const l = a.tooltipPosition();
        s.add(l.x), n += l.y, ++o;
      }
    }
    return o === 0 || s.size === 0 ? !1 : {
      x: [
        ...s
      ].reduce((a, l) => a + l) / s.size,
      y: n / o
    };
  },
  nearest(i, t) {
    if (!i.length)
      return !1;
    let e = t.x, s = t.y, n = Number.POSITIVE_INFINITY, o, r, a;
    for (o = 0, r = i.length; o < r; ++o) {
      const l = i[o].element;
      if (l && l.hasValue()) {
        const c = l.getCenterPoint(), h = is(t, c);
        h < n && (n = h, a = l);
      }
    }
    if (a) {
      const l = a.tooltipPosition();
      e = l.x, s = l.y;
    }
    return {
      x: e,
      y: s
    };
  }
};
function nt(i, t) {
  return t && (H(t) ? Array.prototype.push.apply(i, t) : i.push(t)), i;
}
function ft(i) {
  return (typeof i == "string" || i instanceof String) && i.indexOf(`
`) > -1 ? i.split(`
`) : i;
}
function Fd(i, t) {
  const { element: e, datasetIndex: s, index: n } = t, o = i.getDatasetMeta(s).controller, { label: r, value: a } = o.getLabelAndValue(n);
  return {
    chart: i,
    label: r,
    parsed: o.getParsed(n),
    raw: i.data.datasets[s].data[n],
    formattedValue: a,
    dataset: o.getDataset(),
    dataIndex: n,
    datasetIndex: s,
    element: e
  };
}
function Jn(i, t) {
  const e = i.chart.ctx, { body: s, footer: n, title: o } = i, { boxWidth: r, boxHeight: a } = t, l = at(t.bodyFont), c = at(t.titleFont), h = at(t.footerFont), d = o.length, u = n.length, f = s.length, g = Pt(t.padding);
  let p = g.height, m = 0, b = s.reduce((x, _) => x + _.before.length + _.lines.length + _.after.length, 0);
  if (b += i.beforeBody.length + i.afterBody.length, d && (p += d * c.lineHeight + (d - 1) * t.titleSpacing + t.titleMarginBottom), b) {
    const x = t.displayColors ? Math.max(a, l.lineHeight) : l.lineHeight;
    p += f * x + (b - f) * l.lineHeight + (b - 1) * t.bodySpacing;
  }
  u && (p += t.footerMarginTop + u * h.lineHeight + (u - 1) * t.footerSpacing);
  let y = 0;
  const v = function(x) {
    m = Math.max(m, e.measureText(x).width + y);
  };
  return e.save(), e.font = c.string, O(i.title, v), e.font = l.string, O(i.beforeBody.concat(i.afterBody), v), y = t.displayColors ? r + 2 + t.boxPadding : 0, O(s, (x) => {
    O(x.before, v), O(x.lines, v), O(x.after, v);
  }), y = 0, e.font = h.string, O(i.footer, v), e.restore(), m += g.width, {
    width: m,
    height: p
  };
}
function zd(i, t) {
  const { y: e, height: s } = t;
  return e < s / 2 ? "top" : e > i.height - s / 2 ? "bottom" : "center";
}
function Bd(i, t, e, s) {
  const { x: n, width: o } = s, r = e.caretSize + e.caretPadding;
  if (i === "left" && n + o + r > t.width || i === "right" && n - o - r < 0)
    return !0;
}
function Nd(i, t, e, s) {
  const { x: n, width: o } = e, { width: r, chartArea: { left: a, right: l } } = i;
  let c = "center";
  return s === "center" ? c = n <= (a + l) / 2 ? "left" : "right" : n <= o / 2 ? c = "left" : n >= r - o / 2 && (c = "right"), Bd(c, i, t, e) && (c = "center"), c;
}
function to(i, t, e) {
  const s = e.yAlign || t.yAlign || zd(i, e);
  return {
    xAlign: e.xAlign || t.xAlign || Nd(i, t, e, s),
    yAlign: s
  };
}
function Hd(i, t) {
  let { x: e, width: s } = i;
  return t === "right" ? e -= s : t === "center" && (e -= s / 2), e;
}
function Vd(i, t, e) {
  let { y: s, height: n } = i;
  return t === "top" ? s += e : t === "bottom" ? s -= n + e : s -= n / 2, s;
}
function eo(i, t, e, s) {
  const { caretSize: n, caretPadding: o, cornerRadius: r } = i, { xAlign: a, yAlign: l } = e, c = n + o, { topLeft: h, topRight: d, bottomLeft: u, bottomRight: f } = ke(r);
  let g = Hd(t, a);
  const p = Vd(t, l, c);
  return l === "center" ? a === "left" ? g += c : a === "right" && (g -= c) : a === "left" ? g -= Math.max(h, u) + n : a === "right" && (g += Math.max(d, f) + n), {
    x: G(g, 0, s.width - t.width),
    y: G(p, 0, s.height - t.height)
  };
}
function ei(i, t, e) {
  const s = Pt(e.padding);
  return t === "center" ? i.x + i.width / 2 : t === "right" ? i.x + i.width - s.right : i.x + s.left;
}
function io(i) {
  return nt([], ft(i));
}
function jd(i, t, e) {
  return Yt(i, {
    tooltip: t,
    tooltipItems: e,
    type: "tooltip"
  });
}
function so(i, t) {
  const e = t && t.dataset && t.dataset.tooltip && t.dataset.tooltip.callbacks;
  return e ? i.override(e) : i;
}
const mr = {
  beforeTitle: ht,
  title(i) {
    if (i.length > 0) {
      const t = i[0], e = t.chart.data.labels, s = e ? e.length : 0;
      if (this && this.options && this.options.mode === "dataset")
        return t.dataset.label || "";
      if (t.label)
        return t.label;
      if (s > 0 && t.dataIndex < s)
        return e[t.dataIndex];
    }
    return "";
  },
  afterTitle: ht,
  beforeBody: ht,
  beforeLabel: ht,
  label(i) {
    if (this && this.options && this.options.mode === "dataset")
      return i.label + ": " + i.formattedValue || i.formattedValue;
    let t = i.dataset.label || "";
    t && (t += ": ");
    const e = i.formattedValue;
    return C(e) || (t += e), t;
  },
  labelColor(i) {
    const e = i.chart.getDatasetMeta(i.datasetIndex).controller.getStyle(i.dataIndex);
    return {
      borderColor: e.borderColor,
      backgroundColor: e.backgroundColor,
      borderWidth: e.borderWidth,
      borderDash: e.borderDash,
      borderDashOffset: e.borderDashOffset,
      borderRadius: 0
    };
  },
  labelTextColor() {
    return this.options.bodyColor;
  },
  labelPointStyle(i) {
    const e = i.chart.getDatasetMeta(i.datasetIndex).controller.getStyle(i.dataIndex);
    return {
      pointStyle: e.pointStyle,
      rotation: e.rotation
    };
  },
  afterLabel: ht,
  afterBody: ht,
  beforeFooter: ht,
  footer: ht,
  afterFooter: ht
};
function K(i, t, e, s) {
  const n = i[t].call(e, s);
  return typeof n > "u" ? mr[t].call(e, s) : n;
}
class hs extends $t {
  constructor(t) {
    super(), this.opacity = 0, this._active = [], this._eventPosition = void 0, this._size = void 0, this._cachedAnimations = void 0, this._tooltipItems = [], this.$animations = void 0, this.$context = void 0, this.chart = t.chart, this.options = t.options, this.dataPoints = void 0, this.title = void 0, this.beforeBody = void 0, this.body = void 0, this.afterBody = void 0, this.footer = void 0, this.xAlign = void 0, this.yAlign = void 0, this.x = void 0, this.y = void 0, this.height = void 0, this.width = void 0, this.caretX = void 0, this.caretY = void 0, this.labelColors = void 0, this.labelPointStyles = void 0, this.labelTextColors = void 0;
  }
  initialize(t) {
    this.options = t, this._cachedAnimations = void 0, this.$context = void 0;
  }
  _resolveAnimations() {
    const t = this._cachedAnimations;
    if (t)
      return t;
    const e = this.chart, s = this.options.setContext(this.getContext()), n = s.enabled && e.options.animation && s.animations, o = new Jo(this.chart, n);
    return n._cacheable && (this._cachedAnimations = Object.freeze(o)), o;
  }
  getContext() {
    return this.$context || (this.$context = jd(this.chart.getContext(), this, this._tooltipItems));
  }
  getTitle(t, e) {
    const { callbacks: s } = e, n = K(s, "beforeTitle", this, t), o = K(s, "title", this, t), r = K(s, "afterTitle", this, t);
    let a = [];
    return a = nt(a, ft(n)), a = nt(a, ft(o)), a = nt(a, ft(r)), a;
  }
  getBeforeBody(t, e) {
    return io(K(e.callbacks, "beforeBody", this, t));
  }
  getBody(t, e) {
    const { callbacks: s } = e, n = [];
    return O(t, (o) => {
      const r = {
        before: [],
        lines: [],
        after: []
      }, a = so(s, o);
      nt(r.before, ft(K(a, "beforeLabel", this, o))), nt(r.lines, K(a, "label", this, o)), nt(r.after, ft(K(a, "afterLabel", this, o))), n.push(r);
    }), n;
  }
  getAfterBody(t, e) {
    return io(K(e.callbacks, "afterBody", this, t));
  }
  getFooter(t, e) {
    const { callbacks: s } = e, n = K(s, "beforeFooter", this, t), o = K(s, "footer", this, t), r = K(s, "afterFooter", this, t);
    let a = [];
    return a = nt(a, ft(n)), a = nt(a, ft(o)), a = nt(a, ft(r)), a;
  }
  _createItems(t) {
    const e = this._active, s = this.chart.data, n = [], o = [], r = [];
    let a = [], l, c;
    for (l = 0, c = e.length; l < c; ++l)
      a.push(Fd(this.chart, e[l]));
    return t.filter && (a = a.filter((h, d, u) => t.filter(h, d, u, s))), t.itemSort && (a = a.sort((h, d) => t.itemSort(h, d, s))), O(a, (h) => {
      const d = so(t.callbacks, h);
      n.push(K(d, "labelColor", this, h)), o.push(K(d, "labelPointStyle", this, h)), r.push(K(d, "labelTextColor", this, h));
    }), this.labelColors = n, this.labelPointStyles = o, this.labelTextColors = r, this.dataPoints = a, a;
  }
  update(t, e) {
    const s = this.options.setContext(this.getContext()), n = this._active;
    let o, r = [];
    if (!n.length)
      this.opacity !== 0 && (o = {
        opacity: 0
      });
    else {
      const a = me[s.position].call(this, n, this._eventPosition);
      r = this._createItems(s), this.title = this.getTitle(r, s), this.beforeBody = this.getBeforeBody(r, s), this.body = this.getBody(r, s), this.afterBody = this.getAfterBody(r, s), this.footer = this.getFooter(r, s);
      const l = this._size = Jn(this, s), c = Object.assign({}, a, l), h = to(this.chart, s, c), d = eo(s, c, h, this.chart);
      this.xAlign = h.xAlign, this.yAlign = h.yAlign, o = {
        opacity: 1,
        x: d.x,
        y: d.y,
        width: l.width,
        height: l.height,
        caretX: a.x,
        caretY: a.y
      };
    }
    this._tooltipItems = r, this.$context = void 0, o && this._resolveAnimations().update(this, o), t && s.external && s.external.call(this, {
      chart: this.chart,
      tooltip: this,
      replay: e
    });
  }
  drawCaret(t, e, s, n) {
    const o = this.getCaretPosition(t, s, n);
    e.lineTo(o.x1, o.y1), e.lineTo(o.x2, o.y2), e.lineTo(o.x3, o.y3);
  }
  getCaretPosition(t, e, s) {
    const { xAlign: n, yAlign: o } = this, { caretSize: r, cornerRadius: a } = s, { topLeft: l, topRight: c, bottomLeft: h, bottomRight: d } = ke(a), { x: u, y: f } = t, { width: g, height: p } = e;
    let m, b, y, v, x, _;
    return o === "center" ? (x = f + p / 2, n === "left" ? (m = u, b = m - r, v = x + r, _ = x - r) : (m = u + g, b = m + r, v = x - r, _ = x + r), y = m) : (n === "left" ? b = u + Math.max(l, h) + r : n === "right" ? b = u + g - Math.max(c, d) - r : b = this.caretX, o === "top" ? (v = f, x = v - r, m = b - r, y = b + r) : (v = f + p, x = v + r, m = b + r, y = b - r), _ = v), {
      x1: m,
      x2: b,
      x3: y,
      y1: v,
      y2: x,
      y3: _
    };
  }
  drawTitle(t, e, s) {
    const n = this.title, o = n.length;
    let r, a, l;
    if (o) {
      const c = Ni(s.rtl, this.x, this.width);
      for (t.x = ei(this, s.titleAlign, s), e.textAlign = c.textAlign(s.titleAlign), e.textBaseline = "middle", r = at(s.titleFont), a = s.titleSpacing, e.fillStyle = s.titleColor, e.font = r.string, l = 0; l < o; ++l)
        e.fillText(n[l], c.x(t.x), t.y + r.lineHeight / 2), t.y += r.lineHeight + a, l + 1 === o && (t.y += s.titleMarginBottom - a);
    }
  }
  _drawColorBox(t, e, s, n, o) {
    const r = this.labelColors[s], a = this.labelPointStyles[s], { boxHeight: l, boxWidth: c } = o, h = at(o.bodyFont), d = ei(this, "left", o), u = n.x(d), f = l < h.lineHeight ? (h.lineHeight - l) / 2 : 0, g = e.y + f;
    if (o.usePointStyle) {
      const p = {
        radius: Math.min(c, l) / 2,
        pointStyle: a.pointStyle,
        rotation: a.rotation,
        borderWidth: 1
      }, m = n.leftForLtr(u, c) + c / 2, b = g + l / 2;
      t.strokeStyle = o.multiKeyBackground, t.fillStyle = o.multiKeyBackground, ns(t, p, m, b), t.strokeStyle = r.borderColor, t.fillStyle = r.backgroundColor, ns(t, p, m, b);
    } else {
      t.lineWidth = A(r.borderWidth) ? Math.max(...Object.values(r.borderWidth)) : r.borderWidth || 1, t.strokeStyle = r.borderColor, t.setLineDash(r.borderDash || []), t.lineDashOffset = r.borderDashOffset || 0;
      const p = n.leftForLtr(u, c), m = n.leftForLtr(n.xPlus(u, 1), c - 2), b = ke(r.borderRadius);
      Object.values(b).some((y) => y !== 0) ? (t.beginPath(), t.fillStyle = o.multiKeyBackground, os(t, {
        x: p,
        y: g,
        w: c,
        h: l,
        radius: b
      }), t.fill(), t.stroke(), t.fillStyle = r.backgroundColor, t.beginPath(), os(t, {
        x: m,
        y: g + 1,
        w: c - 2,
        h: l - 2,
        radius: b
      }), t.fill()) : (t.fillStyle = o.multiKeyBackground, t.fillRect(p, g, c, l), t.strokeRect(p, g, c, l), t.fillStyle = r.backgroundColor, t.fillRect(m, g + 1, c - 2, l - 2));
    }
    t.fillStyle = this.labelTextColors[s];
  }
  drawBody(t, e, s) {
    const { body: n } = this, { bodySpacing: o, bodyAlign: r, displayColors: a, boxHeight: l, boxWidth: c, boxPadding: h } = s, d = at(s.bodyFont);
    let u = d.lineHeight, f = 0;
    const g = Ni(s.rtl, this.x, this.width), p = function(k) {
      e.fillText(k, g.x(t.x + f), t.y + u / 2), t.y += u + o;
    }, m = g.textAlign(r);
    let b, y, v, x, _, M, w;
    for (e.textAlign = r, e.textBaseline = "middle", e.font = d.string, t.x = ei(this, m, s), e.fillStyle = s.bodyColor, O(this.beforeBody, p), f = a && m !== "right" ? r === "center" ? c / 2 + h : c + 2 + h : 0, x = 0, M = n.length; x < M; ++x) {
      for (b = n[x], y = this.labelTextColors[x], e.fillStyle = y, O(b.before, p), v = b.lines, a && v.length && (this._drawColorBox(e, t, x, g, s), u = Math.max(d.lineHeight, l)), _ = 0, w = v.length; _ < w; ++_)
        p(v[_]), u = d.lineHeight;
      O(b.after, p);
    }
    f = 0, u = d.lineHeight, O(this.afterBody, p), t.y -= o;
  }
  drawFooter(t, e, s) {
    const n = this.footer, o = n.length;
    let r, a;
    if (o) {
      const l = Ni(s.rtl, this.x, this.width);
      for (t.x = ei(this, s.footerAlign, s), t.y += s.footerMarginTop, e.textAlign = l.textAlign(s.footerAlign), e.textBaseline = "middle", r = at(s.footerFont), e.fillStyle = s.footerColor, e.font = r.string, a = 0; a < o; ++a)
        e.fillText(n[a], l.x(t.x), t.y + r.lineHeight / 2), t.y += r.lineHeight + s.footerSpacing;
    }
  }
  drawBackground(t, e, s, n) {
    const { xAlign: o, yAlign: r } = this, { x: a, y: l } = t, { width: c, height: h } = s, { topLeft: d, topRight: u, bottomLeft: f, bottomRight: g } = ke(n.cornerRadius);
    e.fillStyle = n.backgroundColor, e.strokeStyle = n.borderColor, e.lineWidth = n.borderWidth, e.beginPath(), e.moveTo(a + d, l), r === "top" && this.drawCaret(t, e, s, n), e.lineTo(a + c - u, l), e.quadraticCurveTo(a + c, l, a + c, l + u), r === "center" && o === "right" && this.drawCaret(t, e, s, n), e.lineTo(a + c, l + h - g), e.quadraticCurveTo(a + c, l + h, a + c - g, l + h), r === "bottom" && this.drawCaret(t, e, s, n), e.lineTo(a + f, l + h), e.quadraticCurveTo(a, l + h, a, l + h - f), r === "center" && o === "left" && this.drawCaret(t, e, s, n), e.lineTo(a, l + d), e.quadraticCurveTo(a, l, a + d, l), e.closePath(), e.fill(), n.borderWidth > 0 && e.stroke();
  }
  _updateAnimationTarget(t) {
    const e = this.chart, s = this.$animations, n = s && s.x, o = s && s.y;
    if (n || o) {
      const r = me[t.position].call(this, this._active, this._eventPosition);
      if (!r)
        return;
      const a = this._size = Jn(this, t), l = Object.assign({}, r, this._size), c = to(e, t, l), h = eo(t, l, c, e);
      (n._to !== h.x || o._to !== h.y) && (this.xAlign = c.xAlign, this.yAlign = c.yAlign, this.width = a.width, this.height = a.height, this.caretX = r.x, this.caretY = r.y, this._resolveAnimations().update(this, h));
    }
  }
  _willRender() {
    return !!this.opacity;
  }
  draw(t) {
    const e = this.options.setContext(this.getContext());
    let s = this.opacity;
    if (!s)
      return;
    this._updateAnimationTarget(e);
    const n = {
      width: this.width,
      height: this.height
    }, o = {
      x: this.x,
      y: this.y
    };
    s = Math.abs(s) < 1e-3 ? 0 : s;
    const r = Pt(e.padding), a = this.title.length || this.beforeBody.length || this.body.length || this.afterBody.length || this.footer.length;
    e.enabled && a && (t.save(), t.globalAlpha = s, this.drawBackground(o, t, n, e), gc(t, e.textDirection), o.y += r.top, this.drawTitle(o, t, e), this.drawBody(o, t, e), this.drawFooter(o, t, e), mc(t, e.textDirection), t.restore());
  }
  getActiveElements() {
    return this._active || [];
  }
  setActiveElements(t, e) {
    const s = this._active, n = t.map(({ datasetIndex: a, index: l }) => {
      const c = this.chart.getDatasetMeta(a);
      if (!c)
        throw new Error("Cannot find a dataset at index " + a);
      return {
        datasetIndex: a,
        element: c.data[l],
        index: l
      };
    }), o = !mi(s, n), r = this._positionChanged(n, e);
    (o || r) && (this._active = n, this._eventPosition = e, this._ignoreReplayEvents = !0, this.update(!0));
  }
  handleEvent(t, e, s = !0) {
    if (e && this._ignoreReplayEvents)
      return !1;
    this._ignoreReplayEvents = !1;
    const n = this.options, o = this._active || [], r = this._getActiveElements(t, o, e, s), a = this._positionChanged(r, t), l = e || !mi(r, o) || a;
    return l && (this._active = r, (n.enabled || n.external) && (this._eventPosition = {
      x: t.x,
      y: t.y
    }, this.update(!0, e))), l;
  }
  _getActiveElements(t, e, s, n) {
    const o = this.options;
    if (t.type === "mouseout")
      return [];
    if (!n)
      return e.filter((a) => this.chart.data.datasets[a.datasetIndex] && this.chart.getDatasetMeta(a.datasetIndex).controller.getParsed(a.index) !== void 0);
    const r = this.chart.getElementsAtEventForMode(t, o.mode, o, s);
    return o.reverse && r.reverse(), r;
  }
  _positionChanged(t, e) {
    const { caretX: s, caretY: n, options: o } = this, r = me[o.position].call(this, t, e);
    return r !== !1 && (s !== r.x || n !== r.y);
  }
}
S(hs, "positioners", me);
var br = {
  id: "tooltip",
  _element: hs,
  positioners: me,
  afterInit(i, t, e) {
    e && (i.tooltip = new hs({
      chart: i,
      options: e
    }));
  },
  beforeUpdate(i, t, e) {
    i.tooltip && i.tooltip.initialize(e);
  },
  reset(i, t, e) {
    i.tooltip && i.tooltip.initialize(e);
  },
  afterDraw(i) {
    const t = i.tooltip;
    if (t && t._willRender()) {
      const e = {
        tooltip: t
      };
      if (i.notifyPlugins("beforeTooltipDraw", {
        ...e,
        cancelable: !0
      }) === !1)
        return;
      t.draw(i.ctx), i.notifyPlugins("afterTooltipDraw", e);
    }
  },
  afterEvent(i, t) {
    if (i.tooltip) {
      const e = t.replay;
      i.tooltip.handleEvent(t.event, e, t.inChartArea) && (t.changed = !0);
    }
  },
  defaults: {
    enabled: !0,
    external: null,
    position: "average",
    backgroundColor: "rgba(0,0,0,0.8)",
    titleColor: "#fff",
    titleFont: {
      weight: "bold"
    },
    titleSpacing: 2,
    titleMarginBottom: 6,
    titleAlign: "left",
    bodyColor: "#fff",
    bodySpacing: 2,
    bodyFont: {},
    bodyAlign: "left",
    footerColor: "#fff",
    footerSpacing: 2,
    footerMarginTop: 6,
    footerFont: {
      weight: "bold"
    },
    footerAlign: "left",
    padding: 6,
    caretPadding: 2,
    caretSize: 5,
    cornerRadius: 6,
    boxHeight: (i, t) => t.bodyFont.size,
    boxWidth: (i, t) => t.bodyFont.size,
    multiKeyBackground: "#fff",
    displayColors: !0,
    boxPadding: 0,
    borderColor: "rgba(0,0,0,0)",
    borderWidth: 0,
    animation: {
      duration: 400,
      easing: "easeOutQuart"
    },
    animations: {
      numbers: {
        type: "number",
        properties: [
          "x",
          "y",
          "width",
          "height",
          "caretX",
          "caretY"
        ]
      },
      opacity: {
        easing: "linear",
        duration: 200
      }
    },
    callbacks: mr
  },
  defaultRoutes: {
    bodyFont: "font",
    footerFont: "font",
    titleFont: "font"
  },
  descriptors: {
    _scriptable: (i) => i !== "filter" && i !== "itemSort" && i !== "external",
    _indexable: !1,
    callbacks: {
      _scriptable: !1,
      _indexable: !1
    },
    animation: {
      _fallback: !1
    },
    animations: {
      _fallback: "animation"
    }
  },
  additionalOptionScopes: [
    "interaction"
  ]
};
const Wd = (i, t, e, s) => (typeof t == "string" ? (e = i.push(t) - 1, s.unshift({
  index: e,
  label: t
})) : isNaN(t) && (e = null), e);
function Ud(i, t, e, s) {
  const n = i.indexOf(t);
  if (n === -1)
    return Wd(i, t, e, s);
  const o = i.lastIndexOf(t);
  return n !== o ? e : n;
}
const Yd = (i, t) => i === null ? null : G(Math.round(i), 0, t);
function no(i) {
  const t = this.getLabels();
  return i >= 0 && i < t.length ? t[i] : i;
}
class wi extends ne {
  constructor(t) {
    super(t), this._startValue = void 0, this._valueRange = 0, this._addedLabels = [];
  }
  init(t) {
    const e = this._addedLabels;
    if (e.length) {
      const s = this.getLabels();
      for (const { index: n, label: o } of e)
        s[n] === o && s.splice(n, 1);
      this._addedLabels = [];
    }
    super.init(t);
  }
  parse(t, e) {
    if (C(t))
      return null;
    const s = this.getLabels();
    return e = isFinite(e) && s[e] === t ? e : Ud(s, t, $(e, t), this._addedLabels), Yd(e, s.length - 1);
  }
  determineDataLimits() {
    const { minDefined: t, maxDefined: e } = this.getUserBounds();
    let { min: s, max: n } = this.getMinMax(!0);
    this.options.bounds === "ticks" && (t || (s = 0), e || (n = this.getLabels().length - 1)), this.min = s, this.max = n;
  }
  buildTicks() {
    const t = this.min, e = this.max, s = this.options.offset, n = [];
    let o = this.getLabels();
    o = t === 0 && e === o.length - 1 ? o : o.slice(t, e + 1), this._valueRange = Math.max(o.length - (s ? 0 : 1), 1), this._startValue = this.min - (s ? 0.5 : 0);
    for (let r = t; r <= e; r++)
      n.push({
        value: r
      });
    return n;
  }
  getLabelForValue(t) {
    return no.call(this, t);
  }
  configure() {
    super.configure(), this.isHorizontal() || (this._reversePixels = !this._reversePixels);
  }
  getPixelForValue(t) {
    return typeof t != "number" && (t = this.parse(t)), t === null ? NaN : this.getPixelForDecimal((t - this._startValue) / this._valueRange);
  }
  getPixelForTick(t) {
    const e = this.ticks;
    return t < 0 || t > e.length - 1 ? null : this.getPixelForValue(e[t].value);
  }
  getValueForPixel(t) {
    return Math.round(this._startValue + this.getDecimalForPixel(t) * this._valueRange);
  }
  getBasePixel() {
    return this.bottom;
  }
}
S(wi, "id", "category"), S(wi, "defaults", {
  ticks: {
    callback: no
  }
});
function Kd(i, t) {
  const e = [], { bounds: n, step: o, min: r, max: a, precision: l, count: c, maxTicks: h, maxDigits: d, includeBounds: u } = i, f = o || 1, g = h - 1, { min: p, max: m } = t, b = !C(r), y = !C(a), v = !C(c), x = (m - p) / (d + 1);
  let _ = tn((m - p) / g / f) * f, M, w, k, P;
  if (_ < 1e-14 && !b && !y)
    return [
      {
        value: p
      },
      {
        value: m
      }
    ];
  P = Math.ceil(m / _) - Math.floor(p / _), P > g && (_ = tn(P * _ / g / f) * f), C(l) || (M = Math.pow(10, l), _ = Math.ceil(_ * M) / M), n === "ticks" ? (w = Math.floor(p / _) * _, k = Math.ceil(m / _) * _) : (w = p, k = m), b && y && o && ll((a - r) / o, _ / 1e3) ? (P = Math.round(Math.min((a - r) / _, h)), _ = (a - r) / P, w = r, k = a) : v ? (w = b ? r : w, k = y ? a : k, P = c - 1, _ = (k - w) / P) : (P = (k - w) / _, ve(P, Math.round(P), _ / 1e3) ? P = Math.round(P) : P = Math.ceil(P));
  const L = Math.max(en(_), en(w));
  M = Math.pow(10, C(l) ? L : l), w = Math.round(w * M) / M, k = Math.round(k * M) / M;
  let I = 0;
  for (b && (u && w !== r ? (e.push({
    value: r
  }), w < r && I++, ve(Math.round((w + I * _) * M) / M, r, oo(r, x, i)) && I++) : w < r && I++); I < P; ++I) {
    const N = Math.round((w + I * _) * M) / M;
    if (y && N > a)
      break;
    e.push({
      value: N
    });
  }
  return y && u && k !== a ? e.length && ve(e[e.length - 1].value, a, oo(a, x, i)) ? e[e.length - 1].value = a : e.push({
    value: a
  }) : (!y || k === a) && e.push({
    value: k
  }), e;
}
function oo(i, t, { horizontal: e, minRotation: s }) {
  const n = Nt(s), o = (e ? Math.sin(n) : Math.cos(n)) || 1e-3, r = 0.75 * t * ("" + i).length;
  return Math.min(t / o, r);
}
class Xd extends ne {
  constructor(t) {
    super(t), this.start = void 0, this.end = void 0, this._startValue = void 0, this._endValue = void 0, this._valueRange = 0;
  }
  parse(t, e) {
    return C(t) || (typeof t == "number" || t instanceof Number) && !isFinite(+t) ? null : +t;
  }
  handleTickRangeOptions() {
    const { beginAtZero: t } = this.options, { minDefined: e, maxDefined: s } = this.getUserBounds();
    let { min: n, max: o } = this;
    const r = (l) => n = e ? n : l, a = (l) => o = s ? o : l;
    if (t) {
      const l = ct(n), c = ct(o);
      l < 0 && c < 0 ? a(0) : l > 0 && c > 0 && r(0);
    }
    if (n === o) {
      let l = o === 0 ? 1 : Math.abs(o * 0.05);
      a(o + l), t || r(n - l);
    }
    this.min = n, this.max = o;
  }
  getTickLimit() {
    const t = this.options.ticks;
    let { maxTicksLimit: e, stepSize: s } = t, n;
    return s ? (n = Math.ceil(this.max / s) - Math.floor(this.min / s) + 1, n > 1e3 && (console.warn(`scales.${this.id}.ticks.stepSize: ${s} would result generating up to ${n} ticks. Limiting to 1000.`), n = 1e3)) : (n = this.computeTickLimit(), e = e || 11), e && (n = Math.min(e, n)), n;
  }
  computeTickLimit() {
    return Number.POSITIVE_INFINITY;
  }
  buildTicks() {
    const t = this.options, e = t.ticks;
    let s = this.getTickLimit();
    s = Math.max(2, s);
    const n = {
      maxTicks: s,
      bounds: t.bounds,
      min: t.min,
      max: t.max,
      precision: e.precision,
      step: e.stepSize,
      count: e.count,
      maxDigits: this._maxDigits(),
      horizontal: this.isHorizontal(),
      minRotation: e.minRotation || 0,
      includeBounds: e.includeBounds !== !1
    }, o = this._range || this, r = Kd(n, o);
    return t.bounds === "ticks" && cl(r, this, "value"), t.reverse ? (r.reverse(), this.start = this.max, this.end = this.min) : (this.start = this.min, this.end = this.max), r;
  }
  configure() {
    const t = this.ticks;
    let e = this.min, s = this.max;
    if (super.configure(), this.options.offset && t.length) {
      const n = (s - e) / Math.max(t.length - 1, 1) / 2;
      e -= n, s += n;
    }
    this._startValue = e, this._endValue = s, this._valueRange = s - e;
  }
  getLabelForValue(t) {
    return No(t, this.chart.options.locale, this.options.ticks.format);
  }
}
class Si extends Xd {
  determineDataLimits() {
    const { min: t, max: e } = this.getMinMax(!0);
    this.min = U(t) ? t : 0, this.max = U(e) ? e : 1, this.handleTickRangeOptions();
  }
  computeTickLimit() {
    const t = this.isHorizontal(), e = t ? this.width : this.height, s = Nt(this.options.ticks.minRotation), n = (t ? Math.sin(s) : Math.cos(s)) || 1e-3, o = this._resolveTickFontOptions(0);
    return Math.ceil(e / Math.min(40, o.lineHeight / n));
  }
  getPixelForValue(t) {
    return t === null ? NaN : this.getPixelForDecimal((t - this._startValue) / this._valueRange);
  }
  getValueForPixel(t) {
    return this._startValue + this.getDecimalForPixel(t) * this._valueRange;
  }
}
S(Si, "id", "linear"), S(Si, "defaults", {
  ticks: {
    callback: Ho.formatters.numeric
  }
});
const Ti = {
  millisecond: {
    common: !0,
    size: 1,
    steps: 1e3
  },
  second: {
    common: !0,
    size: 1e3,
    steps: 60
  },
  minute: {
    common: !0,
    size: 6e4,
    steps: 60
  },
  hour: {
    common: !0,
    size: 36e5,
    steps: 24
  },
  day: {
    common: !0,
    size: 864e5,
    steps: 30
  },
  week: {
    common: !1,
    size: 6048e5,
    steps: 4
  },
  month: {
    common: !0,
    size: 2628e6,
    steps: 12
  },
  quarter: {
    common: !1,
    size: 7884e6,
    steps: 4
  },
  year: {
    common: !0,
    size: 3154e7
  }
}, X = /* @__PURE__ */ Object.keys(Ti);
function ro(i, t) {
  return i - t;
}
function ao(i, t) {
  if (C(t))
    return null;
  const e = i._adapter, { parser: s, round: n, isoWeekday: o } = i._parseOpts;
  let r = t;
  return typeof s == "function" && (r = s(r)), U(r) || (r = typeof s == "string" ? e.parse(r, s) : e.parse(r)), r === null ? null : (n && (r = n === "week" && (Te(o) || o === !0) ? e.startOf(r, "isoWeek", o) : e.startOf(r, n)), +r);
}
function lo(i, t, e, s) {
  const n = X.length;
  for (let o = X.indexOf(i); o < n - 1; ++o) {
    const r = Ti[X[o]], a = r.steps ? r.steps : Number.MAX_SAFE_INTEGER;
    if (r.common && Math.ceil((e - t) / (a * r.size)) <= s)
      return X[o];
  }
  return X[n - 1];
}
function qd(i, t, e, s, n) {
  for (let o = X.length - 1; o >= X.indexOf(e); o--) {
    const r = X[o];
    if (Ti[r].common && i._adapter.diff(n, s, r) >= t - 1)
      return r;
  }
  return X[e ? X.indexOf(e) : 0];
}
function Gd(i) {
  for (let t = X.indexOf(i) + 1, e = X.length; t < e; ++t)
    if (Ti[X[t]].common)
      return X[t];
}
function co(i, t, e) {
  if (!e)
    i[t] = !0;
  else if (e.length) {
    const { lo: s, hi: n } = xs(e, t), o = e[s] >= t ? e[s] : e[n];
    i[o] = !0;
  }
}
function Zd(i, t, e, s) {
  const n = i._adapter, o = +n.startOf(t[0].value, s), r = t[t.length - 1].value;
  let a, l;
  for (a = o; a <= r; a = +n.add(a, 1, s))
    l = e[a], l >= 0 && (t[l].major = !0);
  return t;
}
function ho(i, t, e) {
  const s = [], n = {}, o = t.length;
  let r, a;
  for (r = 0; r < o; ++r)
    a = t[r], n[a] = r, s.push({
      value: a,
      major: !1
    });
  return o === 0 || !e ? s : Zd(i, s, n, e);
}
class ki extends ne {
  constructor(t) {
    super(t), this._cache = {
      data: [],
      labels: [],
      all: []
    }, this._unit = "day", this._majorUnit = void 0, this._offsets = {}, this._normalized = !1, this._parseOpts = void 0;
  }
  init(t, e = {}) {
    const s = t.time || (t.time = {}), n = this._adapter = new Xc._date(t.adapters.date);
    n.init(e), xe(s.displayFormats, n.formats()), this._parseOpts = {
      parser: s.parser,
      round: s.round,
      isoWeekday: s.isoWeekday
    }, super.init(t), this._normalized = e.normalized;
  }
  parse(t, e) {
    return t === void 0 ? null : ao(this, t);
  }
  beforeLayout() {
    super.beforeLayout(), this._cache = {
      data: [],
      labels: [],
      all: []
    };
  }
  determineDataLimits() {
    const t = this.options, e = this._adapter, s = t.time.unit || "day";
    let { min: n, max: o, minDefined: r, maxDefined: a } = this.getUserBounds();
    function l(c) {
      !r && !isNaN(c.min) && (n = Math.min(n, c.min)), !a && !isNaN(c.max) && (o = Math.max(o, c.max));
    }
    (!r || !a) && (l(this._getLabelBounds()), (t.bounds !== "ticks" || t.ticks.source !== "labels") && l(this.getMinMax(!1))), n = U(n) && !isNaN(n) ? n : +e.startOf(Date.now(), s), o = U(o) && !isNaN(o) ? o : +e.endOf(Date.now(), s) + 1, this.min = Math.min(n, o - 1), this.max = Math.max(n + 1, o);
  }
  _getLabelBounds() {
    const t = this.getLabelTimestamps();
    let e = Number.POSITIVE_INFINITY, s = Number.NEGATIVE_INFINITY;
    return t.length && (e = t[0], s = t[t.length - 1]), {
      min: e,
      max: s
    };
  }
  buildTicks() {
    const t = this.options, e = t.time, s = t.ticks, n = s.source === "labels" ? this.getLabelTimestamps() : this._generate();
    t.bounds === "ticks" && n.length && (this.min = this._userMin || n[0], this.max = this._userMax || n[n.length - 1]);
    const o = this.min, r = this.max, a = gl(n, o, r);
    return this._unit = e.unit || (s.autoSkip ? lo(e.minUnit, this.min, this.max, this._getLabelCapacity(o)) : qd(this, a.length, e.minUnit, this.min, this.max)), this._majorUnit = !s.major.enabled || this._unit === "year" ? void 0 : Gd(this._unit), this.initOffsets(n), t.reverse && a.reverse(), ho(this, a, this._majorUnit);
  }
  afterAutoSkip() {
    this.options.offsetAfterAutoskip && this.initOffsets(this.ticks.map((t) => +t.value));
  }
  initOffsets(t = []) {
    let e = 0, s = 0, n, o;
    this.options.offset && t.length && (n = this.getDecimalForValue(t[0]), t.length === 1 ? e = 1 - n : e = (this.getDecimalForValue(t[1]) - n) / 2, o = this.getDecimalForValue(t[t.length - 1]), t.length === 1 ? s = o : s = (o - this.getDecimalForValue(t[t.length - 2])) / 2);
    const r = t.length < 3 ? 0.5 : 0.25;
    e = G(e, 0, r), s = G(s, 0, r), this._offsets = {
      start: e,
      end: s,
      factor: 1 / (e + 1 + s)
    };
  }
  _generate() {
    const t = this._adapter, e = this.min, s = this.max, n = this.options, o = n.time, r = o.unit || lo(o.minUnit, e, s, this._getLabelCapacity(e)), a = $(n.ticks.stepSize, 1), l = r === "week" ? o.isoWeekday : !1, c = Te(l) || l === !0, h = {};
    let d = e, u, f;
    if (c && (d = +t.startOf(d, "isoWeek", l)), d = +t.startOf(d, c ? "day" : r), t.diff(s, e, r) > 1e5 * a)
      throw new Error(e + " and " + s + " are too far apart with stepSize of " + a + " " + r);
    const g = n.ticks.source === "data" && this.getDataTimestamps();
    for (u = d, f = 0; u < s; u = +t.add(u, a, r), f++)
      co(h, u, g);
    return (u === s || n.bounds === "ticks" || f === 1) && co(h, u, g), Object.keys(h).sort(ro).map((p) => +p);
  }
  getLabelForValue(t) {
    const e = this._adapter, s = this.options.time;
    return s.tooltipFormat ? e.format(t, s.tooltipFormat) : e.format(t, s.displayFormats.datetime);
  }
  format(t, e) {
    const n = this.options.time.displayFormats, o = this._unit, r = e || n[o];
    return this._adapter.format(t, r);
  }
  _tickFormatFunction(t, e, s, n) {
    const o = this.options, r = o.ticks.callback;
    if (r)
      return F(r, [
        t,
        e,
        s
      ], this);
    const a = o.time.displayFormats, l = this._unit, c = this._majorUnit, h = l && a[l], d = c && a[c], u = s[e], f = c && d && u && u.major;
    return this._adapter.format(t, n || (f ? d : h));
  }
  generateTickLabels(t) {
    let e, s, n;
    for (e = 0, s = t.length; e < s; ++e)
      n = t[e], n.label = this._tickFormatFunction(n.value, e, t);
  }
  getDecimalForValue(t) {
    return t === null ? NaN : (t - this.min) / (this.max - this.min);
  }
  getPixelForValue(t) {
    const e = this._offsets, s = this.getDecimalForValue(t);
    return this.getPixelForDecimal((e.start + s) * e.factor);
  }
  getValueForPixel(t) {
    const e = this._offsets, s = this.getDecimalForPixel(t) / e.factor - e.end;
    return this.min + s * (this.max - this.min);
  }
  _getLabelSize(t) {
    const e = this.options.ticks, s = this.ctx.measureText(t).width, n = Nt(this.isHorizontal() ? e.maxRotation : e.minRotation), o = Math.cos(n), r = Math.sin(n), a = this._resolveTickFontOptions(0).size;
    return {
      w: s * o + a * r,
      h: s * r + a * o
    };
  }
  _getLabelCapacity(t) {
    const e = this.options.time, s = e.displayFormats, n = s[e.unit] || s.millisecond, o = this._tickFormatFunction(t, 0, ho(this, [
      t
    ], this._majorUnit), n), r = this._getLabelSize(o), a = Math.floor(this.isHorizontal() ? this.width / r.w : this.height / r.h) - 1;
    return a > 0 ? a : 1;
  }
  getDataTimestamps() {
    let t = this._cache.data || [], e, s;
    if (t.length)
      return t;
    const n = this.getMatchingVisibleMetas();
    if (this._normalized && n.length)
      return this._cache.data = n[0].controller.getAllParsedValues(this);
    for (e = 0, s = n.length; e < s; ++e)
      t = t.concat(n[e].controller.getAllParsedValues(this));
    return this._cache.data = this.normalize(t);
  }
  getLabelTimestamps() {
    const t = this._cache.labels || [];
    let e, s;
    if (t.length)
      return t;
    const n = this.getLabels();
    for (e = 0, s = n.length; e < s; ++e)
      t.push(ao(this, n[e]));
    return this._cache.labels = this._normalized ? t : this.normalize(t);
  }
  normalize(t) {
    return Fo(t.sort(ro));
  }
}
S(ki, "id", "time"), S(ki, "defaults", {
  bounds: "data",
  adapters: {},
  time: {
    parser: !1,
    unit: !1,
    round: !1,
    isoWeekday: !1,
    minUnit: "millisecond",
    displayFormats: {}
  },
  ticks: {
    source: "auto",
    callback: !1,
    major: {
      enabled: !1
    }
  }
});
function ii(i, t, e) {
  let s = 0, n = i.length - 1, o, r, a, l;
  e ? (t >= i[s].pos && t <= i[n].pos && ({ lo: s, hi: n } = Ht(i, "pos", t)), { pos: o, time: a } = i[s], { pos: r, time: l } = i[n]) : (t >= i[s].time && t <= i[n].time && ({ lo: s, hi: n } = Ht(i, "time", t)), { time: o, pos: a } = i[s], { time: r, pos: l } = i[n]);
  const c = r - o;
  return c ? a + (l - a) * (t - o) / c : a;
}
class uo extends ki {
  constructor(t) {
    super(t), this._table = [], this._minPos = void 0, this._tableRange = void 0;
  }
  initOffsets() {
    const t = this._getTimestampsForTable(), e = this._table = this.buildLookupTable(t);
    this._minPos = ii(e, this.min), this._tableRange = ii(e, this.max) - this._minPos, super.initOffsets(t);
  }
  buildLookupTable(t) {
    const { min: e, max: s } = this, n = [], o = [];
    let r, a, l, c, h;
    for (r = 0, a = t.length; r < a; ++r)
      c = t[r], c >= e && c <= s && n.push(c);
    if (n.length < 2)
      return [
        {
          time: e,
          pos: 0
        },
        {
          time: s,
          pos: 1
        }
      ];
    for (r = 0, a = n.length; r < a; ++r)
      h = n[r + 1], l = n[r - 1], c = n[r], Math.round((h + l) / 2) !== c && o.push({
        time: c,
        pos: r / (a - 1)
      });
    return o;
  }
  _generate() {
    const t = this.min, e = this.max;
    let s = super.getDataTimestamps();
    return (!s.includes(t) || !s.length) && s.splice(0, 0, t), (!s.includes(e) || s.length === 1) && s.push(e), s.sort((n, o) => n - o);
  }
  _getTimestampsForTable() {
    let t = this._cache.all || [];
    if (t.length)
      return t;
    const e = this.getDataTimestamps(), s = this.getLabelTimestamps();
    return e.length && s.length ? t = this.normalize(e.concat(s)) : t = e.length ? e : s, t = this._cache.all = t, t;
  }
  getDecimalForValue(t) {
    return (ii(this._table, t) - this._minPos) / this._tableRange;
  }
  getValueForPixel(t) {
    const e = this._offsets, s = this.getDecimalForPixel(t) / e.factor - e.end;
    return ii(this._table, s * this._tableRange + this._minPos, !0);
  }
}
S(uo, "id", "timeseries"), S(uo, "defaults", ki.defaults);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Me = (i, t) => {
  const e = i._$AN;
  if (e === void 0) return !1;
  for (const s of e) s._$AO?.(t, !1), Me(s, t);
  return !0;
}, Mi = (i) => {
  let t, e;
  do {
    if ((t = i._$AM) === void 0) break;
    e = t._$AN, e.delete(i), i = t;
  } while (e?.size === 0);
}, _r = (i) => {
  for (let t; t = i._$AM; i = t) {
    let e = t._$AN;
    if (e === void 0) t._$AN = e = /* @__PURE__ */ new Set();
    else if (e.has(i)) break;
    e.add(i), tu(t);
  }
};
function Qd(i) {
  this._$AN !== void 0 ? (Mi(this), this._$AM = i, _r(this)) : this._$AM = i;
}
function Jd(i, t = !1, e = 0) {
  const s = this._$AH, n = this._$AN;
  if (n !== void 0 && n.size !== 0) if (t) if (Array.isArray(s)) for (let o = e; o < s.length; o++) Me(s[o], !1), Mi(s[o]);
  else s != null && (Me(s, !1), Mi(s));
  else Me(this, i);
}
const tu = (i) => {
  i.type == So.CHILD && (i._$AP ?? (i._$AP = Jd), i._$AQ ?? (i._$AQ = Qd));
};
class eu extends Mo {
  constructor() {
    super(...arguments), this._$AN = void 0;
  }
  _$AT(t, e, s) {
    super._$AT(t, e, s), _r(this), this.isConnected = t._$AU;
  }
  _$AO(t, e = !0) {
    t !== this.isConnected && (this.isConnected = t, t ? this.reconnected?.() : this.disconnected?.()), e && (Me(this, t), Mi(this));
  }
  setValue(t) {
    if (fa(this._$Ct)) this._$Ct._$AI(t, this);
    else {
      const e = [...this._$Ct._$AH];
      e[this._$Ci] = t, this._$Ct._$AI(e, this, 0);
    }
  }
  disconnected() {
  }
  reconnected() {
  }
}
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const yr = () => new iu();
class iu {
}
const Qi = /* @__PURE__ */ new WeakMap(), xr = ko(class extends eu {
  render(i) {
    return D;
  }
  update(i, [t]) {
    const e = t !== this.G;
    return e && this.rt(void 0), (e || this.lt !== this.ct) && (this.G = t, this.ht = i.options?.host, this.rt(this.ct = i.element)), D;
  }
  rt(i) {
    if (this.G !== void 0) if (this.isConnected || (i = void 0), typeof this.G == "function") {
      const t = this.ht ?? globalThis;
      let e = Qi.get(t);
      e === void 0 && (e = /* @__PURE__ */ new WeakMap(), Qi.set(t, e)), e.get(this.G) !== void 0 && this.G.call(this.ht, void 0), e.set(this.G, i), i !== void 0 && this.G.call(this.ht, i);
    } else this.G.value = i;
  }
  get lt() {
    return typeof this.G == "function" ? Qi.get(this.ht ?? globalThis)?.get(this.G) : this.G?.value;
  }
  disconnected() {
    this.lt === this.ct && this.rt(void 0);
  }
  reconnected() {
    this.rt(this.ct);
  }
});
var su = Object.defineProperty, nu = Object.getOwnPropertyDescriptor, vr = (i, t, e, s) => {
  for (var n = s > 1 ? void 0 : s ? nu(t, e) : t, o = i.length - 1, r; o >= 0; o--)
    (r = i[o]) && (n = (s ? r(t, e, n) : r(n)) || n);
  return s && n && su(t, e, n), n;
};
J.register(
  ri,
  vt,
  ci,
  Si,
  wi,
  Rd,
  br
);
let Ai = class extends gt {
  constructor() {
    super(), this._canvasRef = yr(), this._chart = null, Ie(this);
  }
  updated() {
    if (!this.metric) return;
    const i = this._canvasRef.value;
    if (!i || this.metric.series.length === 0) {
      this._destroyChart();
      return;
    }
    this._chart && this._chart.canvas !== i && this._destroyChart(), this._renderChart();
  }
  disconnectedCallback() {
    this._destroyChart(), super.disconnectedCallback();
  }
  render() {
    return kt(
      this.metric,
      (i) => T`
        <div class="label">${i.label}</div>
        ${kt(
        i.description,
        () => T`<div class="description">${i.description}</div>`
      )}
        ${kt(
        i.series.length > 0,
        () => T`
            <div class="chart-wrap">
              <canvas ${xr(this._canvasRef)}></canvas>
            </div>
          `,
        () => T`<div class="empty">
              ${E("No data in the selected range.")}
            </div>`
      )}
      `,
      () => D
    );
  }
  _renderChart() {
    const i = this._canvasRef.value;
    if (!i || !this.metric) return;
    const t = this.metric.series.map((n) => n.bucket), e = this.metric.series.map((n) => n.value), s = this._readToken("--lms-report-accent", "#0a58ca");
    if (this._chart) {
      this._chart.data.labels = t, this._chart.data.datasets[0].data = e, this._chart.update();
      return;
    }
    this._chart = new J(i, {
      type: "line",
      data: {
        labels: t,
        datasets: [
          {
            label: this.metric.label,
            data: e,
            borderColor: s,
            backgroundColor: ou(s, 0.15),
            fill: !0,
            tension: 0.25,
            pointRadius: 2,
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: !0,
        maintainAspectRatio: !1,
        plugins: { legend: { display: !1 } },
        scales: {
          y: { beginAtZero: !0, ticks: { precision: 0 } },
          x: { ticks: { maxRotation: 0, autoSkipPadding: 12 } }
        }
      }
    });
  }
  _destroyChart() {
    this._chart && (this._chart.destroy(), this._chart = null);
  }
  _readToken(i, t) {
    const e = getComputedStyle(this).getPropertyValue(i).trim();
    return e.length > 0 ? e : t;
  }
};
Ai.styles = [Fe, gs];
vr([
  Y({ attribute: !1 })
], Ai.prototype, "metric", 2);
Ai = vr([
  Re("lms-report-time-series")
], Ai);
function ou(i, t) {
  const e = i.match(/^#([0-9a-f]{6})$/i);
  if (!e) return i;
  const s = parseInt(e[1].slice(0, 2), 16), n = parseInt(e[1].slice(2, 4), 16), o = parseInt(e[1].slice(4, 6), 16);
  return `rgba(${s}, ${n}, ${o}, ${t})`;
}
var ru = Object.defineProperty, au = Object.getOwnPropertyDescriptor, wr = (i, t, e, s) => {
  for (var n = s > 1 ? void 0 : s ? au(t, e) : t, o = i.length - 1, r; o >= 0; o--)
    (r = i[o]) && (n = (s ? r(t, e, n) : r(n)) || n);
  return s && n && ru(t, e, n), n;
};
J.register(oi, hi, Si, wi, br);
let Pi = class extends gt {
  constructor() {
    super(), this._canvasRef = yr(), this._chart = null, Ie(this);
  }
  updated() {
    if (!this.metric) return;
    const i = this._canvasRef.value;
    if (!i || this.metric.items.length === 0) {
      this._destroyChart();
      return;
    }
    this._chart && this._chart.canvas !== i && this._destroyChart(), this._renderChart();
  }
  disconnectedCallback() {
    this._destroyChart(), super.disconnectedCallback();
  }
  render() {
    return kt(
      this.metric,
      (i) => T`
        <div class="label">${i.label}</div>
        ${kt(
        i.description,
        () => T`<div class="description">${i.description}</div>`
      )}
        ${kt(
        i.items.length > 0,
        () => T`
            <div class="chart-wrap">
              <canvas ${xr(this._canvasRef)}></canvas>
            </div>
          `,
        () => T`<div class="empty">
              ${E("No data in the selected range.")}
            </div>`
      )}
      `,
      () => D
    );
  }
  _renderChart() {
    const i = this._canvasRef.value;
    if (!i || !this.metric) return;
    const t = this.metric.items.map((r) => r.label), e = this.metric.items.map((r) => r.value), s = this._readToken("--lms-report-accent", "#0a58ca"), n = this.metric.items.map(
      (r) => r.color || s
    ), o = this.metric.orientation === "vertical";
    if (this._chart) {
      this._chart.data.labels = t, this._chart.data.datasets[0].data = e, this._chart.data.datasets[0].backgroundColor = n, this._chart.update();
      return;
    }
    this._chart = new J(i, {
      type: "bar",
      data: {
        labels: t,
        datasets: [
          {
            label: this.metric.label,
            data: e,
            backgroundColor: n,
            borderRadius: 4
          }
        ]
      },
      options: {
        responsive: !0,
        maintainAspectRatio: !1,
        indexAxis: o ? "x" : "y",
        plugins: { legend: { display: !1 } },
        scales: o ? {
          x: { ticks: { autoSkip: !1 } },
          y: { beginAtZero: !0, ticks: { precision: 0 } }
        } : {
          x: { beginAtZero: !0, ticks: { precision: 0 } },
          y: { ticks: { autoSkip: !1 } }
        }
      }
    });
  }
  _destroyChart() {
    this._chart && (this._chart.destroy(), this._chart = null);
  }
  _readToken(i, t) {
    const e = getComputedStyle(this).getPropertyValue(i).trim();
    return e.length > 0 ? e : t;
  }
};
Pi.styles = [Fe, gs];
wr([
  Y({ attribute: !1 })
], Pi.prototype, "metric", 2);
Pi = wr([
  Re("lms-report-top-n")
], Pi);
function lu(i) {
  return "filterName" in i && typeof i.filterName == "string" && typeof i.filterValues == "function";
}
var cu = Object.defineProperty, hu = Object.getOwnPropertyDescriptor, V = (i, t, e, s) => {
  for (var n = s > 1 ? void 0 : s ? hu(t, e) : t, o = i.length - 1, r; o >= 0; o--)
    (r = i[o]) && (n = (s ? r(t, e, n) : r(n)) || n);
  return s && n && cu(t, e, n), n;
};
let z = class extends gt {
  constructor() {
    super(), this.endpoint = "", this.librariesEndpoint = "", this.categoriesEndpoint = "", this.start = "", this.end = "", this._envelope = null, this._loading = !1, this._error = null, this._pendingStart = "", this._pendingEnd = "", this._pendingBranchcodes = [], this._pendingCategorycodes = [], this._pendingWeekdays = /* @__PURE__ */ new Set(), this._pendingHourStart = null, this._pendingHourEnd = null, this._libraries = [], this._categories = [], this._abort = null, Ie(this);
  }
  connectedCallback() {
    super.connectedCallback(), this.start || (this.start = uu()), this.end || (this.end = du()), this._pendingStart = this.start, this._pendingEnd = this.end, ka(), this.librariesEndpoint && this._fetchLibraries(), this.categoriesEndpoint && this._fetchCategories(), this.endpoint && this._fetchReport();
  }
  disconnectedCallback() {
    this._abort?.abort(), super.disconnectedCallback();
  }
  render() {
    return T`
      <form class="filters" @submit=${this._onSubmit}>
        <div class="field">
          <label for="start">${E("Start")}</label>
          <input
            id="start"
            type="date"
            .value=${this._pendingStart}
            @input=${(i) => this._pendingStart = i.target.value}
            required
          />
        </div>
        <div class="field">
          <label for="end">${E("End")}</label>
          <input
            id="end"
            type="date"
            .value=${this._pendingEnd}
            @input=${(i) => this._pendingEnd = i.target.value}
            required
          />
        </div>
        ${this._renderLibrariesField()} ${this._renderCategoriesField()}
        <slot name="filters"></slot>
        ${this._renderWeekdayField()} ${this._renderHourRangeField()}
        <button class="apply" type="submit" ?disabled=${this._loading}>
          ${this._loading ? E("Loading…") : E("Apply")}
        </button>
      </form>
      ${this._renderBody()}
    `;
  }
  _renderLibrariesField() {
    return this._libraries.length === 0 ? D : T`
      <div class="field">
        <label for="branchcode">${E("Branches")}</label>
        <select
          id="branchcode"
          multiple
          @change=${(i) => {
      const t = i.target;
      this._pendingBranchcodes = Array.from(
        t.selectedOptions,
        (e) => e.value
      );
    }}
        >
          ${ni(
      this._libraries,
      (i) => T`
              <option
                value=${i.library_id}
                ?selected=${this._pendingBranchcodes.includes(i.library_id)}
              >
                ${i.name}
              </option>
            `
    )}
        </select>
      </div>
    `;
  }
  _renderCategoriesField() {
    return this._categories.length === 0 ? D : T`
      <div class="field">
        <label for="categorycode">${E("Patron categories")}</label>
        <select
          id="categorycode"
          multiple
          @change=${(i) => {
      const t = i.target;
      this._pendingCategorycodes = Array.from(
        t.selectedOptions,
        (e) => e.value
      );
    }}
        >
          ${ni(
      this._categories,
      (i) => T`
              <option
                value=${i.patron_category_id}
                ?selected=${this._pendingCategorycodes.includes(
        i.patron_category_id
      )}
              >
                ${i.name}
              </option>
            `
    )}
        </select>
      </div>
    `;
  }
  _renderWeekdayField() {
    const i = [
      E("Mon"),
      E("Tue"),
      E("Wed"),
      E("Thu"),
      E("Fri"),
      E("Sat"),
      E("Sun")
    ];
    return T`
      <div class="field">
        <label>${E("Weekdays")}</label>
        <div class="weekday-chips" role="group" aria-label=${E("Weekdays")}>
          ${ni(
      i,
      (t, e) => T`
              <button
                type="button"
                aria-pressed=${this._pendingWeekdays.has(e) ? "true" : "false"}
                @click=${() => this._toggleWeekday(e)}
              >
                ${t}
              </button>
            `
    )}
        </div>
      </div>
    `;
  }
  _renderHourRangeField() {
    return T`
      <div class="field">
        <label for="hour-start">${E("Hours")}</label>
        <div class="field--row">
          <input
            id="hour-start"
            type="number"
            min="0"
            max="23"
            placeholder="0"
            .value=${this._pendingHourStart === null ? "" : String(this._pendingHourStart)}
            @input=${(i) => {
      const t = i.target.value;
      this._pendingHourStart = t === "" ? null : Number(t);
    }}
          />
          <span aria-hidden="true">–</span>
          <input
            id="hour-end"
            type="number"
            min="0"
            max="23"
            placeholder="23"
            .value=${this._pendingHourEnd === null ? "" : String(this._pendingHourEnd)}
            @input=${(i) => {
      const t = i.target.value;
      this._pendingHourEnd = t === "" ? null : Number(t);
    }}
          />
        </div>
      </div>
    `;
  }
  _renderBody() {
    const i = this._view();
    switch (i.kind) {
      case "error":
        return T`<div class="status error" role="alert">
          ${i.message}
        </div>`;
      case "loading":
        return T`<div class="status">${E("Loading report…")}</div>`;
      case "data":
        return T`
          <div class="grid">
            ${ba(
          i.envelope.metrics,
          (t) => t.id,
          (t) => this._renderMetric(t)
        )}
          </div>
        `;
      case "empty":
        return D;
    }
  }
  _view() {
    return this._error ? { kind: "error", message: this._error } : this._loading && !this._envelope ? { kind: "loading" } : this._envelope ? { kind: "data", envelope: this._envelope } : { kind: "empty" };
  }
  _renderMetric(i) {
    switch (i.type) {
      case "counter":
        return T`<lms-report-counter
          .metric=${i}
        ></lms-report-counter>`;
      case "time_series":
        return T`<div class="wide">
          <lms-report-time-series
            .metric=${i}
          ></lms-report-time-series>
        </div>`;
      case "top_n":
        return T`<div class="wide">
          <lms-report-top-n .metric=${i}></lms-report-top-n>
        </div>`;
    }
  }
  _toggleWeekday(i) {
    const t = new Set(this._pendingWeekdays);
    t.has(i) ? t.delete(i) : t.add(i), this._pendingWeekdays = t;
  }
  _onSubmit(i) {
    i.preventDefault(), this.start = this._pendingStart, this.end = this._pendingEnd, this._fetchReport();
  }
  _slottedFilters() {
    const i = this._filtersSlot;
    return i ? i.assignedElements({ flatten: !0 }).filter((t) => lu(t)) : [];
  }
  async _fetchLibraries() {
    try {
      const i = await fetch(this.librariesEndpoint, {
        method: "GET",
        credentials: "include",
        headers: { Accept: "application/json" }
      });
      if (!i.ok) return;
      const t = await i.json();
      this._libraries = t.map((e) => ({
        library_id: e.library_id ?? e.branchcode ?? "",
        name: e.name ?? e.branchname ?? e.library_id ?? ""
      })).filter((e) => e.library_id !== "").sort((e, s) => e.name.localeCompare(s.name));
    } catch {
    }
  }
  async _fetchCategories() {
    try {
      const i = await fetch(this.categoriesEndpoint, {
        method: "GET",
        credentials: "include",
        headers: { Accept: "application/json" }
      });
      if (!i.ok) return;
      const t = await i.json();
      this._categories = t.map((e) => ({
        patron_category_id: e.patron_category_id ?? e.categorycode ?? "",
        name: e.description ?? e.name ?? e.patron_category_id ?? ""
      })).filter((e) => e.patron_category_id !== "").sort((e, s) => e.name.localeCompare(s.name));
    } catch {
    }
  }
  async _fetchReport() {
    if (!this.endpoint) {
      this._error = E("No endpoint configured.");
      return;
    }
    this._abort?.abort();
    const i = new AbortController();
    this._abort = i;
    const t = new URL(this.endpoint, window.location.origin);
    t.searchParams.set("start", this.start), t.searchParams.set("end", this.end);
    for (const e of this._pendingBranchcodes)
      t.searchParams.append("branchcode", e);
    for (const e of this._pendingCategorycodes)
      t.searchParams.append("categorycode", e);
    for (const e of [...this._pendingWeekdays].sort((s, n) => s - n))
      t.searchParams.append("weekday", String(e));
    this._pendingHourStart !== null && this._pendingHourEnd !== null && (t.searchParams.set("hour_start", String(this._pendingHourStart)), t.searchParams.set("hour_end", String(this._pendingHourEnd)));
    for (const e of this._slottedFilters())
      for (const s of e.filterValues())
        t.searchParams.append(e.filterName, s);
    this._loading = !0, this._error = null;
    try {
      const e = await fetch(t.toString(), {
        method: "GET",
        credentials: "include",
        headers: { Accept: "application/json" },
        signal: i.signal
      });
      if (!e.ok)
        throw new Error(`${e.status} ${e.statusText}`);
      const s = await e.json();
      this._envelope = s, this.dispatchEvent(
        new CustomEvent("lms-report-loaded", {
          detail: s,
          bubbles: !0,
          composed: !0
        })
      );
    } catch (e) {
      if (e.name === "AbortError") return;
      this._error = e.message || E("Failed to load report.");
    } finally {
      this._abort === i && (this._abort = null), this._loading = !1;
    }
  }
};
z.styles = [
  Fe,
  $o,
  ie`
      .filters {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem 1rem;
        align-items: flex-end;
        margin-bottom: 1rem;
        padding: 0.5rem 0.75rem;
        background: var(--lms-report-filters-bg);
        border: 1px solid var(--lms-report-filters-border);
        border-radius: 5px;
      }
      .field input[type="number"] {
        min-width: 5rem;
        width: 5rem;
      }
      .field--row {
        flex-direction: row;
        align-items: center;
        gap: 0.4rem;
      }
      .weekday-chips {
        display: flex;
        flex-wrap: wrap;
        gap: 0.25rem;
      }
      .weekday-chips button {
        font: inherit;
        font-size: 0.8rem;
        padding: 0.3rem 0.55rem;
        border: 1px solid var(--lms-report-input-border);
        border-radius: 999px;
        background: var(--lms-report-input-bg);
        color: inherit;
        cursor: pointer;
        line-height: 1;
      }
      .weekday-chips button[aria-pressed="true"] {
        background: var(--lms-report-accent);
        border-color: var(--lms-report-accent);
        color: var(--lms-report-accent-fg);
      }
      .weekday-chips button:focus {
        outline: 2px solid var(--lms-report-accent-soft);
        outline-offset: 1px;
      }
      button.apply {
        font: inherit;
        line-height: 1.42857143;
        padding: 0.35rem 0.85rem;
        background: var(--lms-report-button-bg);
        color: var(--lms-report-button-fg);
        border: 1px solid var(--lms-report-button-border);
        border-radius: var(--lms-report-button-radius);
        font-weight: normal;
        cursor: pointer;
        margin-left: auto;
      }
      button.apply:hover {
        background: var(--lms-report-button-bg-hover);
      }
      button.apply:active,
      button.apply:focus {
        box-shadow: inset 0 0 0 1px #edb423;
        outline: none;
      }
      button.apply:disabled {
        cursor: not-allowed;
        opacity: 0.6;
      }
      .grid {
        display: grid;
        gap: 1rem;
        grid-template-columns: repeat(auto-fit, minmax(min(100%, 18rem), 1fr));
      }
      .grid > .wide {
        grid-column: 1 / -1;
      }
      .status {
        padding: 1rem 1.25rem;
        border: 1px solid var(--lms-report-card-border);
        border-radius: var(--lms-report-card-radius);
        background: var(--lms-report-card-bg);
        text-align: center;
      }
      .status.error {
        background: var(--lms-report-error-bg);
        border-color: var(--lms-report-error-border);
        color: var(--lms-report-error-fg);
      }
    `
];
V([
  Y({ type: String })
], z.prototype, "endpoint", 2);
V([
  Y({ type: String, attribute: "libraries-endpoint" })
], z.prototype, "librariesEndpoint", 2);
V([
  Y({ type: String, attribute: "categories-endpoint" })
], z.prototype, "categoriesEndpoint", 2);
V([
  Y({ type: String })
], z.prototype, "start", 2);
V([
  Y({ type: String })
], z.prototype, "end", 2);
V([
  q()
], z.prototype, "_envelope", 2);
V([
  q()
], z.prototype, "_loading", 2);
V([
  q()
], z.prototype, "_error", 2);
V([
  q()
], z.prototype, "_pendingStart", 2);
V([
  q()
], z.prototype, "_pendingEnd", 2);
V([
  q()
], z.prototype, "_pendingBranchcodes", 2);
V([
  q()
], z.prototype, "_pendingCategorycodes", 2);
V([
  q()
], z.prototype, "_pendingWeekdays", 2);
V([
  q()
], z.prototype, "_pendingHourStart", 2);
V([
  q()
], z.prototype, "_pendingHourEnd", 2);
V([
  q()
], z.prototype, "_libraries", 2);
V([
  q()
], z.prototype, "_categories", 2);
V([
  da('slot[name="filters"]')
], z.prototype, "_filtersSlot", 2);
z = V([
  Re("lms-report-dashboard")
], z);
function du() {
  return (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
}
function uu() {
  const i = /* @__PURE__ */ new Date();
  return new Date(i.getFullYear(), i.getMonth(), 1).toISOString().slice(0, 10);
}
export {
  z as LMSReportDashboard,
  et as LMSReportFilterMultiselect
};
//# sourceMappingURL=lms-report-dashboard.js.map
