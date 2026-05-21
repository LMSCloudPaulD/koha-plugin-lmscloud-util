var Br = Object.defineProperty;
var Hr = (i, t, e) => t in i ? Br(i, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : i[t] = e;
var M = (i, t, e) => Hr(i, typeof t != "symbol" ? t + "" : t, e);
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const hs = "lit-localize-status";
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Nr = (i, ...t) => ({
  strTag: !0,
  strings: i,
  values: t
}), vs = Nr, Wr = (i) => typeof i != "string" && "strTag" in i, Po = (i, t, e) => {
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
const Ao = (i) => Wr(i) ? Po(i.strings, i.values) : i;
let D = Ao, Ws = !1;
function jr(i) {
  if (Ws)
    throw new Error("lit-localize can only be configured once");
  D = i, Ws = !0;
}
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
class Vr {
  constructor(t) {
    this.__litLocalizeEventHandler = (e) => {
      e.detail.status === "ready" && this.host.requestUpdate();
    }, this.host = t;
  }
  hostConnected() {
    window.addEventListener(hs, this.__litLocalizeEventHandler);
  }
  hostDisconnected() {
    window.removeEventListener(hs, this.__litLocalizeEventHandler);
  }
}
const Ur = (i) => i.addController(new Vr(i)), Tt = Ur;
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
class $o {
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
const mt = [];
for (let i = 0; i < 256; i++)
  mt[i] = (i >> 4 & 15).toString(16) + (i & 15).toString(16);
function Yr(i) {
  let t = 0, e = 8997, s = 0, n = 33826, o = 0, r = 40164, a = 0, l = 52210;
  for (let c = 0; c < i.length; c++)
    e ^= i.charCodeAt(c), t = e * 435, s = n * 435, o = r * 435, a = l * 435, o += e << 8, a += n << 8, s += t >>> 16, e = t & 65535, o += s >>> 16, n = s & 65535, l = a + (o >>> 16) & 65535, r = o & 65535;
  return mt[l >> 8] + mt[l & 255] + mt[r >> 8] + mt[r & 255] + mt[n >> 8] + mt[n & 255] + mt[e >> 8] + mt[e & 255];
}
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Kr = "", Xr = "h", qr = "s";
function Gr(i, t) {
  return (t ? Xr : qr) + Yr(typeof i == "string" ? i : i.join(Kr));
}
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const js = /* @__PURE__ */ new WeakMap(), Vs = /* @__PURE__ */ new Map();
function Zr(i, t, e) {
  if (i) {
    const s = e?.id ?? Qr(t), n = i[s];
    if (n) {
      if (typeof n == "string")
        return n;
      if ("strTag" in n)
        return Po(
          n.strings,
          // Cast `template` because its type wasn't automatically narrowed (but
          // we know it must be the same type as `localized`).
          t.values,
          n.values
        );
      {
        let o = js.get(n);
        return o === void 0 && (o = n.values, js.set(n, o)), {
          ...n,
          values: o.map((r) => t.values[r])
        };
      }
    }
  }
  return Ao(t);
}
function Qr(i) {
  const t = typeof i == "string" ? i : i.strings;
  let e = Vs.get(t);
  return e === void 0 && (e = Gr(t, typeof i != "string" && !("strTag" in i)), Vs.set(t, e)), e;
}
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function Vi(i) {
  window.dispatchEvent(new CustomEvent(hs, { detail: i }));
}
let yi = "", Ui, Co, xi, ds, Oo, Vt = new $o();
Vt.resolve();
let ti = 0;
const Jr = (i) => (jr((t, e) => Zr(Oo, t, e)), yi = Co = i.sourceLocale, xi = new Set(i.targetLocales), xi.add(i.sourceLocale), ds = i.loadLocale, { getLocale: ta, setLocale: ea }), ta = () => yi, ea = (i) => {
  if (i === (Ui ?? yi))
    return Vt.promise;
  if (!xi || !ds)
    throw new Error("Internal error");
  if (!xi.has(i))
    throw new Error("Invalid locale code");
  ti++;
  const t = ti;
  return Ui = i, Vt.settled && (Vt = new $o()), Vi({ status: "loading", loadingLocale: i }), (i === Co ? (
    // We could switch to the source locale synchronously, but we prefer to
    // queue it on a microtask so that switching locales is consistently
    // asynchronous.
    Promise.resolve({ templates: void 0 })
  ) : ds(i)).then((s) => {
    ti === t && (yi = i, Ui = void 0, Oo = s.templates, Vi({ status: "ready", readyLocale: i }), Vt.resolve());
  }, (s) => {
    ti === t && (Vi({
      status: "error",
      errorLocale: i,
      errorMessage: s.toString()
    }), Vt.reject(s));
  }), Vt.promise;
};
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const pi = globalThis, ws = pi.ShadowRoot && (pi.ShadyCSS === void 0 || pi.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Ss = Symbol(), Us = /* @__PURE__ */ new WeakMap();
let Do = class {
  constructor(t, e, s) {
    if (this._$cssResult$ = !0, s !== Ss) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (ws && t === void 0) {
      const s = e !== void 0 && e.length === 1;
      s && (t = Us.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), s && Us.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const ia = (i) => new Do(typeof i == "string" ? i : i + "", void 0, Ss), Et = (i, ...t) => {
  const e = i.length === 1 ? i[0] : t.reduce((s, n, o) => s + ((r) => {
    if (r._$cssResult$ === !0) return r.cssText;
    if (typeof r == "number") return r;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + r + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(n) + i[o + 1], i[0]);
  return new Do(e, i, Ss);
}, sa = (i, t) => {
  if (ws) i.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const s = document.createElement("style"), n = pi.litNonce;
    n !== void 0 && s.setAttribute("nonce", n), s.textContent = e.cssText, i.appendChild(s);
  }
}, Ys = ws ? (i) => i : (i) => i instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const s of t.cssRules) e += s.cssText;
  return ia(e);
})(i) : i;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: na, defineProperty: oa, getOwnPropertyDescriptor: ra, getOwnPropertyNames: aa, getOwnPropertySymbols: la, getPrototypeOf: ca } = Object, $t = globalThis, Ks = $t.trustedTypes, ha = Ks ? Ks.emptyScript : "", da = $t.reactiveElementPolyfillSupport, Ae = (i, t) => i, vi = { toAttribute(i, t) {
  switch (t) {
    case Boolean:
      i = i ? ha : null;
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
} }, ks = (i, t) => !na(i, t), Xs = { attribute: !0, type: String, converter: vi, reflect: !1, useDefault: !1, hasChanged: ks };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), $t.litPropertyMetadata ?? ($t.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let ne = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = Xs) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const s = Symbol(), n = this.getPropertyDescriptor(t, s, e);
      n !== void 0 && oa(this.prototype, t, n);
    }
  }
  static getPropertyDescriptor(t, e, s) {
    const { get: n, set: o } = ra(this.prototype, t) ?? { get() {
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
    return this.elementProperties.get(t) ?? Xs;
  }
  static _$Ei() {
    if (this.hasOwnProperty(Ae("elementProperties"))) return;
    const t = ca(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(Ae("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(Ae("properties"))) {
      const e = this.properties, s = [...aa(e), ...la(e)];
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
      for (const n of s) e.unshift(Ys(n));
    } else t !== void 0 && e.push(Ys(t));
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
    return sa(t, this.constructor.elementStyles), t;
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
      const o = (s.converter?.toAttribute !== void 0 ? s.converter : vi).toAttribute(e, s.type);
      this._$Em = t, o == null ? this.removeAttribute(n) : this.setAttribute(n, o), this._$Em = null;
    }
  }
  _$AK(t, e) {
    const s = this.constructor, n = s._$Eh.get(t);
    if (n !== void 0 && this._$Em !== n) {
      const o = s.getPropertyOptions(n), r = typeof o.converter == "function" ? { fromAttribute: o.converter } : o.converter?.fromAttribute !== void 0 ? o.converter : vi;
      this._$Em = n;
      const a = r.fromAttribute(e, o.type);
      this[n] = a ?? this._$Ej?.get(n) ?? a, this._$Em = null;
    }
  }
  requestUpdate(t, e, s, n = !1, o) {
    if (t !== void 0) {
      const r = this.constructor;
      if (n === !1 && (o = this[t]), s ?? (s = r.getPropertyOptions(t)), !((s.hasChanged ?? ks)(o, e) || s.useDefault && s.reflect && o === this._$Ej?.get(t) && !this.hasAttribute(r._$Eu(t, s)))) return;
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
ne.elementStyles = [], ne.shadowRootOptions = { mode: "open" }, ne[Ae("elementProperties")] = /* @__PURE__ */ new Map(), ne[Ae("finalized")] = /* @__PURE__ */ new Map(), da?.({ ReactiveElement: ne }), ($t.reactiveElementVersions ?? ($t.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const $e = globalThis, qs = (i) => i, wi = $e.trustedTypes, Gs = wi ? wi.createPolicy("lit-html", { createHTML: (i) => i }) : void 0, To = "$lit$", vt = `lit$${Math.random().toFixed(9).slice(2)}$`, Eo = "?" + vt, ua = `<${Eo}>`, Zt = document, ze = () => Zt.createComment(""), Be = (i) => i === null || typeof i != "object" && typeof i != "function", Ms = Array.isArray, fa = (i) => Ms(i) || typeof i?.[Symbol.iterator] == "function", Yi = `[ 	
\f\r]`, be = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Zs = /-->/g, Qs = />/g, Bt = RegExp(`>|${Yi}(?:([^\\s"'>=/]+)(${Yi}*=${Yi}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Js = /'/g, tn = /"/g, Lo = /^(?:script|style|textarea|title)$/i, pa = (i) => (t, ...e) => ({ _$litType$: i, strings: t, values: e }), P = pa(1), Qt = Symbol.for("lit-noChange"), L = Symbol.for("lit-nothing"), en = /* @__PURE__ */ new WeakMap(), Kt = Zt.createTreeWalker(Zt, 129);
function Ro(i, t) {
  if (!Ms(i) || !i.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Gs !== void 0 ? Gs.createHTML(t) : t;
}
const ga = (i, t) => {
  const e = i.length - 1, s = [];
  let n, o = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", r = be;
  for (let a = 0; a < e; a++) {
    const l = i[a];
    let c, h, d = -1, u = 0;
    for (; u < l.length && (r.lastIndex = u, h = r.exec(l), h !== null); ) u = r.lastIndex, r === be ? h[1] === "!--" ? r = Zs : h[1] !== void 0 ? r = Qs : h[2] !== void 0 ? (Lo.test(h[2]) && (n = RegExp("</" + h[2], "g")), r = Bt) : h[3] !== void 0 && (r = Bt) : r === Bt ? h[0] === ">" ? (r = n ?? be, d = -1) : h[1] === void 0 ? d = -2 : (d = r.lastIndex - h[2].length, c = h[1], r = h[3] === void 0 ? Bt : h[3] === '"' ? tn : Js) : r === tn || r === Js ? r = Bt : r === Zs || r === Qs ? r = be : (r = Bt, n = void 0);
    const f = r === Bt && i[a + 1].startsWith("/>") ? " " : "";
    o += r === be ? l + ua : d >= 0 ? (s.push(c), l.slice(0, d) + To + l.slice(d) + vt + f) : l + vt + (d === -2 ? a : f);
  }
  return [Ro(i, o + (i[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
};
class He {
  constructor({ strings: t, _$litType$: e }, s) {
    let n;
    this.parts = [];
    let o = 0, r = 0;
    const a = t.length - 1, l = this.parts, [c, h] = ga(t, e);
    if (this.el = He.createElement(c, s), Kt.currentNode = this.el.content, e === 2 || e === 3) {
      const d = this.el.content.firstChild;
      d.replaceWith(...d.childNodes);
    }
    for (; (n = Kt.nextNode()) !== null && l.length < a; ) {
      if (n.nodeType === 1) {
        if (n.hasAttributes()) for (const d of n.getAttributeNames()) if (d.endsWith(To)) {
          const u = h[r++], f = n.getAttribute(d).split(vt), g = /([.?@])?(.*)/.exec(u);
          l.push({ type: 1, index: o, name: g[2], strings: f, ctor: g[1] === "." ? ba : g[1] === "?" ? _a : g[1] === "@" ? ya : Fi }), n.removeAttribute(d);
        } else d.startsWith(vt) && (l.push({ type: 6, index: o }), n.removeAttribute(d));
        if (Lo.test(n.tagName)) {
          const d = n.textContent.split(vt), u = d.length - 1;
          if (u > 0) {
            n.textContent = wi ? wi.emptyScript : "";
            for (let f = 0; f < u; f++) n.append(d[f], ze()), Kt.nextNode(), l.push({ type: 2, index: ++o });
            n.append(d[u], ze());
          }
        }
      } else if (n.nodeType === 8) if (n.data === Eo) l.push({ type: 2, index: o });
      else {
        let d = -1;
        for (; (d = n.data.indexOf(vt, d + 1)) !== -1; ) l.push({ type: 7, index: o }), d += vt.length - 1;
      }
      o++;
    }
  }
  static createElement(t, e) {
    const s = Zt.createElement("template");
    return s.innerHTML = t, s;
  }
}
function le(i, t, e = i, s) {
  if (t === Qt) return t;
  let n = s !== void 0 ? e._$Co?.[s] : e._$Cl;
  const o = Be(t) ? void 0 : t._$litDirective$;
  return n?.constructor !== o && (n?._$AO?.(!1), o === void 0 ? n = void 0 : (n = new o(i), n._$AT(i, e, s)), s !== void 0 ? (e._$Co ?? (e._$Co = []))[s] = n : e._$Cl = n), n !== void 0 && (t = le(i, n._$AS(i, t.values), n, s)), t;
}
class ma {
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
    const { el: { content: e }, parts: s } = this._$AD, n = (t?.creationScope ?? Zt).importNode(e, !0);
    Kt.currentNode = n;
    let o = Kt.nextNode(), r = 0, a = 0, l = s[0];
    for (; l !== void 0; ) {
      if (r === l.index) {
        let c;
        l.type === 2 ? c = new ue(o, o.nextSibling, this, t) : l.type === 1 ? c = new l.ctor(o, l.name, l.strings, this, t) : l.type === 6 && (c = new xa(o, this, t)), this._$AV.push(c), l = s[++a];
      }
      r !== l?.index && (o = Kt.nextNode(), r++);
    }
    return Kt.currentNode = Zt, n;
  }
  p(t) {
    let e = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(t, s, e), e += s.strings.length - 2) : s._$AI(t[e])), e++;
  }
}
class ue {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, e, s, n) {
    this.type = 2, this._$AH = L, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = s, this.options = n, this._$Cv = n?.isConnected ?? !0;
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
    t = le(this, t, e), Be(t) ? t === L || t == null || t === "" ? (this._$AH !== L && this._$AR(), this._$AH = L) : t !== this._$AH && t !== Qt && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : fa(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== L && Be(this._$AH) ? this._$AA.nextSibling.data = t : this.T(Zt.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: e, _$litType$: s } = t, n = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = He.createElement(Ro(s.h, s.h[0]), this.options)), s);
    if (this._$AH?._$AD === n) this._$AH.p(e);
    else {
      const o = new ma(n, this), r = o.u(this.options);
      o.p(e), this.T(r), this._$AH = o;
    }
  }
  _$AC(t) {
    let e = en.get(t.strings);
    return e === void 0 && en.set(t.strings, e = new He(t)), e;
  }
  k(t) {
    Ms(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let s, n = 0;
    for (const o of t) n === e.length ? e.push(s = new ue(this.O(ze()), this.O(ze()), this, this.options)) : s = e[n], s._$AI(o), n++;
    n < e.length && (this._$AR(s && s._$AB.nextSibling, n), e.length = n);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    for (this._$AP?.(!1, !0, e); t !== this._$AB; ) {
      const s = qs(t).nextSibling;
      qs(t).remove(), t = s;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class Fi {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, s, n, o) {
    this.type = 1, this._$AH = L, this._$AN = void 0, this.element = t, this.name = e, this._$AM = n, this.options = o, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = L;
  }
  _$AI(t, e = this, s, n) {
    const o = this.strings;
    let r = !1;
    if (o === void 0) t = le(this, t, e, 0), r = !Be(t) || t !== this._$AH && t !== Qt, r && (this._$AH = t);
    else {
      const a = t;
      let l, c;
      for (t = o[0], l = 0; l < o.length - 1; l++) c = le(this, a[s + l], e, l), c === Qt && (c = this._$AH[l]), r || (r = !Be(c) || c !== this._$AH[l]), c === L ? t = L : t !== L && (t += (c ?? "") + o[l + 1]), this._$AH[l] = c;
    }
    r && !n && this.j(t);
  }
  j(t) {
    t === L ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class ba extends Fi {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === L ? void 0 : t;
  }
}
class _a extends Fi {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== L);
  }
}
class ya extends Fi {
  constructor(t, e, s, n, o) {
    super(t, e, s, n, o), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = le(this, t, e, 0) ?? L) === Qt) return;
    const s = this._$AH, n = t === L && s !== L || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, o = t !== L && (s === L || n);
    n && this.element.removeEventListener(this.name, this, s), o && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class xa {
  constructor(t, e, s) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    le(this, t);
  }
}
const va = { I: ue }, wa = $e.litHtmlPolyfillSupport;
wa?.(He, ue), ($e.litHtmlVersions ?? ($e.litHtmlVersions = [])).push("3.3.3");
const Sa = (i, t, e) => {
  const s = e?.renderBefore ?? t;
  let n = s._$litPart$;
  if (n === void 0) {
    const o = e?.renderBefore ?? null;
    s._$litPart$ = n = new ue(t.insertBefore(ze(), o), o, void 0, e ?? {});
  }
  return n._$AI(i), n;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ce = globalThis;
let nt = class extends ne {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Sa(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return Qt;
  }
};
nt._$litElement$ = !0, nt.finalized = !0, Ce.litElementHydrateSupport?.({ LitElement: nt });
const ka = Ce.litElementPolyfillSupport;
ka?.({ LitElement: nt });
(Ce.litElementVersions ?? (Ce.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Lt = (i) => (t, e) => {
  e !== void 0 ? e.addInitializer(() => {
    customElements.define(i, t);
  }) : customElements.define(i, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ma = { attribute: !0, type: String, converter: vi, reflect: !1, hasChanged: ks }, Pa = (i = Ma, t, e) => {
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
function N(i) {
  return (t, e) => typeof e == "object" ? Pa(i, t, e) : ((s, n, o) => {
    const r = n.hasOwnProperty(o);
    return n.constructor.createProperty(o, s), r ? Object.getOwnPropertyDescriptor(n, o) : void 0;
  })(i, t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function K(i) {
  return N({ ...i, state: !0, attribute: !1 });
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Aa = (i, t, e) => (e.configurable = !0, e.enumerable = !0, Reflect.decorate && typeof t != "object" && Object.defineProperty(i, t, e), e);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function $a(i, t) {
  return (e, s, n) => {
    const o = (r) => r.renderRoot?.querySelector(i) ?? null;
    return Aa(e, s, { get() {
      return o(this);
    } });
  };
}
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function* Oe(i, t) {
  if (i !== void 0) {
    let e = 0;
    for (const s of i) yield t(s, e++);
  }
}
const Rt = Et`
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
    /* Shared height for every toolbar control so the row aligns crisply
       regardless of which native widget is rendered (date picker, number
       spinner, dropdown trigger, chip button). */
    --lms-report-control-height: 2rem;

    --lms-report-chart-height: 16rem;

    --lms-report-counter-size: 2.5rem;
    --lms-report-counter-fg: var(--lms-report-accent);

    --lms-report-error-bg: #fdecea;
    --lms-report-error-border: #f5a8a0;
    --lms-report-error-fg: #842029;

    color: var(--lms-report-fg);
    font-family: var(--lms-report-font);
  }
`, qe = Et`
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
`, Ps = Et`
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
    box-sizing: border-box;
    height: var(--lms-report-control-height);
    padding: 0 0.55rem;
    border: 1px solid var(--lms-report-input-border);
    border-radius: var(--lms-report-input-radius);
    background: var(--lms-report-input-bg);
    color: inherit;
    min-width: 9rem;
    line-height: 1.42857143;
  }
`;
var Ca = Object.defineProperty, Oa = Object.getOwnPropertyDescriptor, fe = (i, t, e, s) => {
  for (var n = s > 1 ? void 0 : s ? Oa(t, e) : t, o = i.length - 1, r; o >= 0; o--)
    (r = i[o]) && (n = (s ? r(t, e, n) : r(n)) || n);
  return s && n && Ca(t, e, n), n;
};
let Ot = class extends nt {
  constructor() {
    super(), this.label = "", this.options = [], this.selected = [], this.placeholder = "", this._open = !1, this._onDocClick = (i) => {
      if (!this._open) return;
      i.composedPath().includes(this) || (this._open = !1);
    }, this._onKey = (i) => {
      i.key === "Escape" && this._open && (this._open = !1, this.renderRoot.querySelector(".trigger")?.focus());
    }, Tt(this);
  }
  connectedCallback() {
    super.connectedCallback(), document.addEventListener("click", this._onDocClick, !0), this.addEventListener("keydown", this._onKey);
  }
  disconnectedCallback() {
    document.removeEventListener("click", this._onDocClick, !0), this.removeEventListener("keydown", this._onKey), super.disconnectedCallback();
  }
  render() {
    const i = this.placeholder || D("Choose…"), t = this.selected.length === 0 ? P`<span class="placeholder">${i}</span>` : P`<span>${D(vs`${this.selected.length} selected`)}</span>`;
    return P`
      <button
        class="trigger"
        type="button"
        aria-haspopup="listbox"
        aria-expanded=${this._open ? "true" : "false"}
        aria-label=${this.label || i}
        @click=${this._toggle}
      >
        ${t}
        <span class="caret" aria-hidden="true">▾</span>
      </button>
      ${this._open ? this._renderPanel() : L}
    `;
  }
  _renderPanel() {
    return this.options.length === 0 ? P`<div class="panel" role="listbox">
        <div class="panel-empty">${D("No options available.")}</div>
      </div>` : P`
      <div class="panel" role="listbox">
        ${Oe(this.options, (i) => {
      const t = this.selected.includes(i.value);
      return P`
            <label class="panel-option">
              <input
                type="checkbox"
                .checked=${t}
                @change=${(e) => this._toggleOption(i.value, e.target.checked)}
              />
              <span>${i.label}</span>
            </label>
          `;
    })}
        <button
          class="panel-clear"
          type="button"
          ?disabled=${this.selected.length === 0}
          @click=${this._clear}
        >
          ${D("Clear selection")}
        </button>
      </div>
    `;
  }
  _toggle() {
    this._open = !this._open;
  }
  _toggleOption(i, t) {
    const e = t ? this.selected.includes(i) ? this.selected : [...this.selected, i] : this.selected.filter((s) => s !== i);
    this._emit(e);
  }
  _clear() {
    this.selected.length !== 0 && this._emit([]);
  }
  _emit(i) {
    this.selected = i, this.dispatchEvent(
      new CustomEvent("change", {
        detail: { selected: [...i] },
        bubbles: !0,
        composed: !0
      })
    );
  }
};
Ot.styles = [
  Rt,
  Ps,
  Et`
      :host {
        display: block;
        position: relative;
      }
      .trigger {
        font: inherit;
        text-align: left;
        box-sizing: border-box;
        height: var(--lms-report-control-height);
        padding: 0 0.55rem;
        border: 1px solid var(--lms-report-input-border);
        border-radius: var(--lms-report-input-radius);
        background: var(--lms-report-input-bg);
        color: inherit;
        min-width: 12rem;
        line-height: 1.42857143;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.5rem;
      }
      .trigger:focus,
      .trigger:focus-visible {
        outline: 2px solid var(--lms-report-accent-soft);
        outline-offset: 1px;
      }
      .trigger[aria-expanded="true"] {
        border-color: var(--lms-report-accent);
      }
      .trigger .caret {
        font-size: 0.7em;
        color: var(--lms-report-muted);
      }
      .trigger .placeholder {
        color: var(--lms-report-muted);
      }
      .panel {
        position: absolute;
        z-index: 20;
        top: calc(100% + 0.2rem);
        left: 0;
        min-width: 100%;
        max-width: 24rem;
        max-height: 16rem;
        overflow-y: auto;
        padding: 0.4rem 0;
        background: var(--lms-report-card-bg);
        border: 1px solid var(--lms-report-card-border);
        border-radius: var(--lms-report-card-radius);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      }
      .panel-option {
        display: flex;
        gap: 0.4rem;
        padding: 0.35rem 0.7rem;
        cursor: pointer;
        align-items: center;
      }
      .panel-option:hover {
        background: var(--lms-report-filters-bg);
      }
      .panel-option input {
        cursor: pointer;
      }
      .panel-empty {
        padding: 0.5rem 0.7rem;
        color: var(--lms-report-muted);
        font-size: 0.85rem;
      }
      .panel-clear {
        display: block;
        width: 100%;
        text-align: left;
        padding: 0.4rem 0.7rem;
        border: none;
        border-top: 1px solid var(--lms-report-card-border);
        background: transparent;
        color: var(--lms-report-accent);
        cursor: pointer;
        font: inherit;
        font-size: 0.85rem;
      }
      .panel-clear:hover {
        background: var(--lms-report-filters-bg);
      }
      .panel-clear:disabled {
        color: var(--lms-report-muted);
        cursor: not-allowed;
      }
    `
];
fe([
  N({ type: String })
], Ot.prototype, "label", 2);
fe([
  N({ attribute: !1 })
], Ot.prototype, "options", 2);
fe([
  N({ attribute: !1 })
], Ot.prototype, "selected", 2);
fe([
  N({ type: String })
], Ot.prototype, "placeholder", 2);
fe([
  K()
], Ot.prototype, "_open", 2);
Ot = fe([
  Lt("lms-report-chip-picker")
], Ot);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Io = { CHILD: 2 }, Fo = (i) => (...t) => ({ _$litDirective$: i, values: t });
let zo = class {
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
const { I: Da } = va, sn = (i) => i, Ta = (i) => i.strings === void 0, nn = () => document.createComment(""), _e = (i, t, e) => {
  const s = i._$AA.parentNode, n = t === void 0 ? i._$AB : t._$AA;
  if (e === void 0) {
    const o = s.insertBefore(nn(), n), r = s.insertBefore(nn(), n);
    e = new Da(o, r, i, i.options);
  } else {
    const o = e._$AB.nextSibling, r = e._$AM, a = r !== i;
    if (a) {
      let l;
      e._$AQ?.(i), e._$AM = i, e._$AP !== void 0 && (l = i._$AU) !== r._$AU && e._$AP(l);
    }
    if (o !== n || a) {
      let l = e._$AA;
      for (; l !== o; ) {
        const c = sn(l).nextSibling;
        sn(s).insertBefore(l, n), l = c;
      }
    }
  }
  return e;
}, Ht = (i, t, e = i) => (i._$AI(t, e), i), Ea = {}, La = (i, t = Ea) => i._$AH = t, Ra = (i) => i._$AH, Ki = (i) => {
  i._$AR(), i._$AA.remove();
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const on = (i, t, e) => {
  const s = /* @__PURE__ */ new Map();
  for (let n = t; n <= e; n++) s.set(i[n], n);
  return s;
}, Ia = Fo(class extends zo {
  constructor(i) {
    if (super(i), i.type !== Io.CHILD) throw Error("repeat() can only be used in text expressions");
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
    const n = Ra(i), { values: o, keys: r } = this.dt(t, e, s);
    if (!Array.isArray(n)) return this.ut = r, o;
    const a = this.ut ?? (this.ut = []), l = [];
    let c, h, d = 0, u = n.length - 1, f = 0, g = o.length - 1;
    for (; d <= u && f <= g; ) if (n[d] === null) d++;
    else if (n[u] === null) u--;
    else if (a[d] === r[f]) l[f] = Ht(n[d], o[f]), d++, f++;
    else if (a[u] === r[g]) l[g] = Ht(n[u], o[g]), u--, g--;
    else if (a[d] === r[g]) l[g] = Ht(n[d], o[g]), _e(i, l[g + 1], n[d]), d++, g--;
    else if (a[u] === r[f]) l[f] = Ht(n[u], o[f]), _e(i, n[d], n[u]), u--, f++;
    else if (c === void 0 && (c = on(r, f, g), h = on(a, d, u)), c.has(a[d])) if (c.has(a[u])) {
      const p = h.get(r[f]), m = p !== void 0 ? n[p] : null;
      if (m === null) {
        const b = _e(i, n[d]);
        Ht(b, o[f]), l[f] = b;
      } else l[f] = Ht(m, o[f]), _e(i, n[d], m), n[p] = null;
      f++;
    } else Ki(n[u]), u--;
    else Ki(n[d]), d++;
    for (; f <= g; ) {
      const p = _e(i, l[g + 1]);
      Ht(p, o[f]), l[f++] = p;
    }
    for (; d <= u; ) {
      const p = n[d++];
      p !== null && Ki(p);
    }
    return this.ut = r, La(i, l), Qt;
  }
}), Fa = {
  s059ab0c93ac06045: "Kein Endpunkt konfiguriert.",
  s099b18e1bd8a1154: "Stunden",
  s1e118319b5202c41: "Mo",
  s255857544a9d5ec0: "Zurücksetzen",
  s397e5e9f566d2434: "Keine Daten im ausgewählten Zeitraum.",
  s58bfb494feb8eb02: vs`${0} ausgewählt`,
  s5cf1605225daef5f: "Bericht konnte nicht geladen werden.",
  s6cfed919e21ac6ac: "Do",
  s6d24cd19e23b8185: "Di",
  s6ebc9bd6feae62a3: "Wird geladen…",
  s74aa0319e62b2eb7: "Mi",
  s873da987b495ea5f: "Keine Auswahl verfügbar.",
  s8837e7420b616a47: "Bericht wird geladen…",
  s8f18916860db5d80: "Auswahl löschen",
  s9836b719fa8ef857: "Sa",
  s987ac119fac8d621: "So",
  sa47b660ae8e7a832: "Wochentage",
  sad8f83df9312b389: "Zweigstellen",
  sae1c7f13b7c0c47f: "Start",
  sb8f855b49234b81b: "Anwenden",
  sd8f923198e0c5c6a: "Ende",
  seef0ce71f86fbe92: "Auswählen…",
  sf295af199c723ec8: "Fr",
  sfcc627c0017112af: "Benutzerkategorien"
}, za = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  templates: Fa
}, Symbol.toStringTag, { value: "Module" })), Ba = {
  s059ab0c93ac06045: "Kein Endpunkt konfiguriert.",
  s099b18e1bd8a1154: "Stunden",
  s1e118319b5202c41: "Mo",
  s255857544a9d5ec0: "Zurücksetzen",
  s397e5e9f566d2434: "Keine Daten im ausgewählten Zeitraum.",
  s58bfb494feb8eb02: vs`${0} ausgewählt`,
  s5cf1605225daef5f: "Bericht konnte nicht geladen werden.",
  s6cfed919e21ac6ac: "Do",
  s6d24cd19e23b8185: "Di",
  s6ebc9bd6feae62a3: "Wird geladen…",
  s74aa0319e62b2eb7: "Mi",
  s873da987b495ea5f: "Keine Auswahl verfügbar.",
  s8837e7420b616a47: "Bericht wird geladen…",
  s8f18916860db5d80: "Auswahl löschen",
  s9836b719fa8ef857: "Sa",
  s987ac119fac8d621: "So",
  sa47b660ae8e7a832: "Wochentage",
  sad8f83df9312b389: "Zweigstellen",
  sae1c7f13b7c0c47f: "Start",
  sb8f855b49234b81b: "Anwenden",
  sd8f923198e0c5c6a: "Ende",
  seef0ce71f86fbe92: "Auswählen…",
  sf295af199c723ec8: "Fr",
  sfcc627c0017112af: "Benutzerkategorien"
}, Ha = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  templates: Ba
}, Symbol.toStringTag, { value: "Module" })), Bo = "en", Ho = [
  "de",
  "de-DE"
], Na = {
  de: za,
  "de-DE": Ha
}, { setLocale: Wa } = Jr({
  sourceLocale: Bo,
  targetLocales: Ho,
  loadLocale: (i) => {
    const t = Na[i];
    return t ? Promise.resolve(t) : Promise.reject(new Error(`Unknown locale: ${i}`));
  }
});
async function ja() {
  const i = (document.documentElement.lang || "").trim();
  if (!i) return;
  const t = [i, i.split("-")[0]].filter(
    (e, s, n) => e && n.indexOf(e) === s
  );
  for (const e of t) {
    if (e === Bo) return;
    if (Ho.includes(e)) {
      await Wa(e);
      return;
    }
  }
}
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function Q(i, t, e) {
  return i ? t(i) : e?.(i);
}
var Va = Object.defineProperty, Ua = Object.getOwnPropertyDescriptor, No = (i, t, e, s) => {
  for (var n = s > 1 ? void 0 : s ? Ua(t, e) : t, o = i.length - 1, r; o >= 0; o--)
    (r = i[o]) && (n = (s ? r(t, e, n) : r(n)) || n);
  return s && n && Va(t, e, n), n;
};
let Si = class extends nt {
  constructor() {
    super(), Tt(this);
  }
  render() {
    return Q(
      this.metric,
      (i) => P`
        <div class="value" aria-label=${i.label}>
          ${this._formatValue(i.value)}
        </div>
        <div class="label">${i.label}</div>
        ${Q(
        i.description,
        () => P`<div class="description">${i.description}</div>`
      )}
      `,
      () => L
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
Si.styles = [
  Rt,
  qe,
  Et`
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
No([
  N({ attribute: !1 })
], Si.prototype, "metric", 2);
Si = No([
  Lt("lms-report-counter")
], Si);
var Ya = Object.defineProperty, Ka = Object.getOwnPropertyDescriptor, It = (i, t, e, s) => {
  for (var n = s > 1 ? void 0 : s ? Ka(t, e) : t, o = i.length - 1, r; o >= 0; o--)
    (r = i[o]) && (n = (s ? r(t, e, n) : r(n)) || n);
  return s && n && Ya(t, e, n), n;
};
let pt = class extends nt {
  constructor() {
    super(), this.name = "", this.label = "", this.endpoint = "", this.valueKey = "", this.labelKey = "name", this._options = [], this._selected = [], Tt(this);
  }
  connectedCallback() {
    super.connectedCallback(), this.endpoint && this._fetchOptions();
  }
  get filterName() {
    return this.name;
  }
  filterValues() {
    return [...this._selected];
  }
  filterReset() {
    this._selected = [];
  }
  render() {
    return P`
      <div class="field" part="field">
        <label>${this.label || this.name}</label>
        <lms-report-chip-picker
          .label=${this.label || this.name}
          .options=${this._options}
          .selected=${this._selected}
          .placeholder=${this._options.length === 0 && this.endpoint ? D("Loading…") : D("Choose…")}
          @change=${(i) => {
      this._selected = i.detail.selected;
    }}
        ></lms-report-chip-picker>
      </div>
    `;
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
pt.styles = [
  Rt,
  Ps,
  Et`
      :host {
        display: contents;
      }
    `
];
It([
  N({ type: String })
], pt.prototype, "name", 2);
It([
  N({ type: String })
], pt.prototype, "label", 2);
It([
  N({ type: String })
], pt.prototype, "endpoint", 2);
It([
  N({ type: String, attribute: "value-key" })
], pt.prototype, "valueKey", 2);
It([
  N({ type: String, attribute: "label-key" })
], pt.prototype, "labelKey", 2);
It([
  K()
], pt.prototype, "_options", 2);
It([
  K()
], pt.prototype, "_selected", 2);
pt = It([
  Lt("lms-report-filter-multiselect")
], pt);
var Xa = Object.defineProperty, qa = Object.getOwnPropertyDescriptor, Wo = (i, t, e, s) => {
  for (var n = s > 1 ? void 0 : s ? qa(t, e) : t, o = i.length - 1, r; o >= 0; o--)
    (r = i[o]) && (n = (s ? r(t, e, n) : r(n)) || n);
  return s && n && Xa(t, e, n), n;
};
let ki = class extends nt {
  constructor() {
    super(), Tt(this);
  }
  render() {
    return Q(
      this.metric,
      (i) => P`
        <div class="label">${i.label}</div>
        ${Q(
        i.description,
        () => P`<div class="description">${i.description}</div>`
      )}
        ${Q(
        i.rows.length > 0 && i.cols.length > 0,
        () => this._renderTable(i),
        () => P`<div class="empty">
              ${D("No data in the selected range.")}
            </div>`
      )}
      `,
      () => L
    );
  }
  _renderTable(i) {
    const t = i.grid.reduce(
      (r, a) => a.reduce((l, c) => c > l ? c : l, r),
      0
    ), e = this._readToken("--lms-report-accent", "#408540"), s = this._readToken("--lms-report-card-bg", "#ffffff"), n = rn(e) ?? { r: 64, g: 133, b: 64 }, o = rn(s) ?? { r: 255, g: 255, b: 255 };
    return P`
      <div class="heatmap-wrap">
        <table>
          <thead>
            <tr>
              <th></th>
              ${Oe(
      i.cols,
      (r) => P`
                  <th>
                    ${r.color ? P`<span
                          class="swatch"
                          style="background:${r.color}"
                        ></span>` : L}${r.label}
                  </th>
                `
    )}
            </tr>
          </thead>
          <tbody>
            ${Oe(
      i.rows,
      (r, a) => P`
                <tr>
                  <th class="row">${r.label}</th>
                  ${Oe(i.cols, (l, c) => {
        const h = i.grid[a]?.[c] ?? 0, d = t > 0 ? h / t : 0, { bg: u, fg: f } = Za(o, n, d);
        return P`
                      <td style="background:${u};color:${f}">${h}</td>
                    `;
      })}
                </tr>
              `
    )}
          </tbody>
        </table>
      </div>
    `;
  }
  _readToken(i, t) {
    const e = getComputedStyle(this).getPropertyValue(i).trim();
    return e.length > 0 ? e : t;
  }
};
ki.styles = [
  Rt,
  qe,
  Et`
      .heatmap-wrap {
        overflow-x: auto;
      }
      table {
        border-collapse: collapse;
        font-size: 0.85rem;
        margin-top: 0.25rem;
      }
      th,
      td {
        padding: 0.35rem 0.55rem;
        text-align: center;
        border: 1px solid var(--lms-report-card-border);
        min-width: 3.5rem;
        white-space: nowrap;
      }
      th.row {
        text-align: left;
        font-weight: 600;
        background: var(--lms-report-filters-bg);
      }
      thead th {
        background: var(--lms-report-filters-bg);
        font-weight: 600;
      }
      thead th .swatch {
        display: inline-block;
        width: 0.65rem;
        height: 0.65rem;
        border-radius: 2px;
        margin-right: 0.3rem;
        vertical-align: -1px;
      }
    `
];
Wo([
  N({ attribute: !1 })
], ki.prototype, "metric", 2);
ki = Wo([
  Lt("lms-report-heatmap")
], ki);
function rn(i) {
  const t = i.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (!t) return null;
  let e = t[1];
  return e.length === 3 && (e = e.split("").map((s) => s + s).join("")), {
    r: parseInt(e.slice(0, 2), 16),
    g: parseInt(e.slice(2, 4), 16),
    b: parseInt(e.slice(4, 6), 16)
  };
}
function Xi(i, t, e) {
  return Math.round(i + (t - i) * e);
}
function Ga({ r: i, g: t, b: e }) {
  const s = (n) => {
    const o = n / 255;
    return o <= 0.03928 ? o / 12.92 : Math.pow((o + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * s(i) + 0.7152 * s(t) + 0.0722 * s(e);
}
function Za(i, t, e) {
  const s = {
    r: Xi(i.r, t.r, e),
    g: Xi(i.g, t.g, e),
    b: Xi(i.b, t.b, e)
  }, n = Ga(s) < 0.55 ? "#ffffff" : "#000000";
  return { bg: `rgb(${s.r}, ${s.g}, ${s.b})`, fg: n };
}
/*!
 * @kurkle/color v0.3.4
 * https://github.com/kurkle/color#readme
 * (c) 2024 Jukka Kurkela
 * Released under the MIT License
 */
function Ge(i) {
  return i + 0.5 | 0;
}
const wt = (i, t, e) => Math.max(Math.min(i, e), t);
function ke(i) {
  return wt(Ge(i * 2.55), 0, 255);
}
function Ct(i) {
  return wt(Ge(i * 255), 0, 255);
}
function yt(i) {
  return wt(Ge(i / 2.55) / 100, 0, 1);
}
function an(i) {
  return wt(Ge(i * 100), 0, 100);
}
const st = { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, A: 10, B: 11, C: 12, D: 13, E: 14, F: 15, a: 10, b: 11, c: 12, d: 13, e: 14, f: 15 }, us = [..."0123456789ABCDEF"], Qa = (i) => us[i & 15], Ja = (i) => us[(i & 240) >> 4] + us[i & 15], ei = (i) => (i & 240) >> 4 === (i & 15), tl = (i) => ei(i.r) && ei(i.g) && ei(i.b) && ei(i.a);
function el(i) {
  var t = i.length, e;
  return i[0] === "#" && (t === 4 || t === 5 ? e = {
    r: 255 & st[i[1]] * 17,
    g: 255 & st[i[2]] * 17,
    b: 255 & st[i[3]] * 17,
    a: t === 5 ? st[i[4]] * 17 : 255
  } : (t === 7 || t === 9) && (e = {
    r: st[i[1]] << 4 | st[i[2]],
    g: st[i[3]] << 4 | st[i[4]],
    b: st[i[5]] << 4 | st[i[6]],
    a: t === 9 ? st[i[7]] << 4 | st[i[8]] : 255
  })), e;
}
const il = (i, t) => i < 255 ? t(i) : "";
function sl(i) {
  var t = tl(i) ? Qa : Ja;
  return i ? "#" + t(i.r) + t(i.g) + t(i.b) + il(i.a, t) : void 0;
}
const nl = /^(hsla?|hwb|hsv)\(\s*([-+.e\d]+)(?:deg)?[\s,]+([-+.e\d]+)%[\s,]+([-+.e\d]+)%(?:[\s,]+([-+.e\d]+)(%)?)?\s*\)$/;
function jo(i, t, e) {
  const s = t * Math.min(e, 1 - e), n = (o, r = (o + i / 30) % 12) => e - s * Math.max(Math.min(r - 3, 9 - r, 1), -1);
  return [n(0), n(8), n(4)];
}
function ol(i, t, e) {
  const s = (n, o = (n + i / 60) % 6) => e - e * t * Math.max(Math.min(o, 4 - o, 1), 0);
  return [s(5), s(3), s(1)];
}
function rl(i, t, e) {
  const s = jo(i, 1, 0.5);
  let n;
  for (t + e > 1 && (n = 1 / (t + e), t *= n, e *= n), n = 0; n < 3; n++)
    s[n] *= 1 - t - e, s[n] += t;
  return s;
}
function al(i, t, e, s, n) {
  return i === n ? (t - e) / s + (t < e ? 6 : 0) : t === n ? (e - i) / s + 2 : (i - t) / s + 4;
}
function As(i) {
  const e = i.r / 255, s = i.g / 255, n = i.b / 255, o = Math.max(e, s, n), r = Math.min(e, s, n), a = (o + r) / 2;
  let l, c, h;
  return o !== r && (h = o - r, c = a > 0.5 ? h / (2 - o - r) : h / (o + r), l = al(e, s, n, h, o), l = l * 60 + 0.5), [l | 0, c || 0, a];
}
function $s(i, t, e, s) {
  return (Array.isArray(t) ? i(t[0], t[1], t[2]) : i(t, e, s)).map(Ct);
}
function Cs(i, t, e) {
  return $s(jo, i, t, e);
}
function ll(i, t, e) {
  return $s(rl, i, t, e);
}
function cl(i, t, e) {
  return $s(ol, i, t, e);
}
function Vo(i) {
  return (i % 360 + 360) % 360;
}
function hl(i) {
  const t = nl.exec(i);
  let e = 255, s;
  if (!t)
    return;
  t[5] !== s && (e = t[6] ? ke(+t[5]) : Ct(+t[5]));
  const n = Vo(+t[2]), o = +t[3] / 100, r = +t[4] / 100;
  return t[1] === "hwb" ? s = ll(n, o, r) : t[1] === "hsv" ? s = cl(n, o, r) : s = Cs(n, o, r), {
    r: s[0],
    g: s[1],
    b: s[2],
    a: e
  };
}
function dl(i, t) {
  var e = As(i);
  e[0] = Vo(e[0] + t), e = Cs(e), i.r = e[0], i.g = e[1], i.b = e[2];
}
function ul(i) {
  if (!i)
    return;
  const t = As(i), e = t[0], s = an(t[1]), n = an(t[2]);
  return i.a < 255 ? `hsla(${e}, ${s}%, ${n}%, ${yt(i.a)})` : `hsl(${e}, ${s}%, ${n}%)`;
}
const ln = {
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
}, cn = {
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
function fl() {
  const i = {}, t = Object.keys(cn), e = Object.keys(ln);
  let s, n, o, r, a;
  for (s = 0; s < t.length; s++) {
    for (r = a = t[s], n = 0; n < e.length; n++)
      o = e[n], a = a.replace(o, ln[o]);
    o = parseInt(cn[r], 16), i[a] = [o >> 16 & 255, o >> 8 & 255, o & 255];
  }
  return i;
}
let ii;
function pl(i) {
  ii || (ii = fl(), ii.transparent = [0, 0, 0, 0]);
  const t = ii[i.toLowerCase()];
  return t && {
    r: t[0],
    g: t[1],
    b: t[2],
    a: t.length === 4 ? t[3] : 255
  };
}
const gl = /^rgba?\(\s*([-+.\d]+)(%)?[\s,]+([-+.e\d]+)(%)?[\s,]+([-+.e\d]+)(%)?(?:[\s,/]+([-+.e\d]+)(%)?)?\s*\)$/;
function ml(i) {
  const t = gl.exec(i);
  let e = 255, s, n, o;
  if (t) {
    if (t[7] !== s) {
      const r = +t[7];
      e = t[8] ? ke(r) : wt(r * 255, 0, 255);
    }
    return s = +t[1], n = +t[3], o = +t[5], s = 255 & (t[2] ? ke(s) : wt(s, 0, 255)), n = 255 & (t[4] ? ke(n) : wt(n, 0, 255)), o = 255 & (t[6] ? ke(o) : wt(o, 0, 255)), {
      r: s,
      g: n,
      b: o,
      a: e
    };
  }
}
function bl(i) {
  return i && (i.a < 255 ? `rgba(${i.r}, ${i.g}, ${i.b}, ${yt(i.a)})` : `rgb(${i.r}, ${i.g}, ${i.b})`);
}
const qi = (i) => i <= 31308e-7 ? i * 12.92 : Math.pow(i, 1 / 2.4) * 1.055 - 0.055, se = (i) => i <= 0.04045 ? i / 12.92 : Math.pow((i + 0.055) / 1.055, 2.4);
function _l(i, t, e) {
  const s = se(yt(i.r)), n = se(yt(i.g)), o = se(yt(i.b));
  return {
    r: Ct(qi(s + e * (se(yt(t.r)) - s))),
    g: Ct(qi(n + e * (se(yt(t.g)) - n))),
    b: Ct(qi(o + e * (se(yt(t.b)) - o))),
    a: i.a + e * (t.a - i.a)
  };
}
function si(i, t, e) {
  if (i) {
    let s = As(i);
    s[t] = Math.max(0, Math.min(s[t] + s[t] * e, t === 0 ? 360 : 1)), s = Cs(s), i.r = s[0], i.g = s[1], i.b = s[2];
  }
}
function Uo(i, t) {
  return i && Object.assign(t || {}, i);
}
function hn(i) {
  var t = { r: 0, g: 0, b: 0, a: 255 };
  return Array.isArray(i) ? i.length >= 3 && (t = { r: i[0], g: i[1], b: i[2], a: 255 }, i.length > 3 && (t.a = Ct(i[3]))) : (t = Uo(i, { r: 0, g: 0, b: 0, a: 1 }), t.a = Ct(t.a)), t;
}
function yl(i) {
  return i.charAt(0) === "r" ? ml(i) : hl(i);
}
class Ne {
  constructor(t) {
    if (t instanceof Ne)
      return t;
    const e = typeof t;
    let s;
    e === "object" ? s = hn(t) : e === "string" && (s = el(t) || pl(t) || yl(t)), this._rgb = s, this._valid = !!s;
  }
  get valid() {
    return this._valid;
  }
  get rgb() {
    var t = Uo(this._rgb);
    return t && (t.a = yt(t.a)), t;
  }
  set rgb(t) {
    this._rgb = hn(t);
  }
  rgbString() {
    return this._valid ? bl(this._rgb) : void 0;
  }
  hexString() {
    return this._valid ? sl(this._rgb) : void 0;
  }
  hslString() {
    return this._valid ? ul(this._rgb) : void 0;
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
    return t && (this._rgb = _l(this._rgb, t._rgb, e)), this;
  }
  clone() {
    return new Ne(this.rgb);
  }
  alpha(t) {
    return this._rgb.a = Ct(t), this;
  }
  clearer(t) {
    const e = this._rgb;
    return e.a *= 1 - t, this;
  }
  greyscale() {
    const t = this._rgb, e = Ge(t.r * 0.3 + t.g * 0.59 + t.b * 0.11);
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
    return si(this._rgb, 2, t), this;
  }
  darken(t) {
    return si(this._rgb, 2, -t), this;
  }
  saturate(t) {
    return si(this._rgb, 1, t), this;
  }
  desaturate(t) {
    return si(this._rgb, 1, -t), this;
  }
  rotate(t) {
    return dl(this._rgb, t), this;
  }
}
/*!
 * Chart.js v4.5.1
 * https://www.chartjs.org
 * (c) 2025 Chart.js Contributors
 * Released under the MIT License
 */
function gt() {
}
const xl = /* @__PURE__ */ (() => {
  let i = 0;
  return () => i++;
})();
function R(i) {
  return i == null;
}
function W(i) {
  if (Array.isArray && Array.isArray(i))
    return !0;
  const t = Object.prototype.toString.call(i);
  return t.slice(0, 7) === "[object" && t.slice(-6) === "Array]";
}
function O(i) {
  return i !== null && Object.prototype.toString.call(i) === "[object Object]";
}
function Y(i) {
  return (typeof i == "number" || i instanceof Number) && isFinite(+i);
}
function ct(i, t) {
  return Y(i) ? i : t;
}
function $(i, t) {
  return typeof i > "u" ? t : i;
}
const vl = (i, t) => typeof i == "string" && i.endsWith("%") ? parseFloat(i) / 100 * t : +i;
function F(i, t, e) {
  if (i && typeof i.call == "function")
    return i.apply(e, t);
}
function I(i, t, e, s) {
  let n, o, r;
  if (W(i))
    for (o = i.length, n = 0; n < o; n++)
      t.call(e, i[n], n);
  else if (O(i))
    for (r = Object.keys(i), o = r.length, n = 0; n < o; n++)
      t.call(e, i[r[n]], r[n]);
}
function Mi(i, t) {
  let e, s, n, o;
  if (!i || !t || i.length !== t.length)
    return !1;
  for (e = 0, s = i.length; e < s; ++e)
    if (n = i[e], o = t[e], n.datasetIndex !== o.datasetIndex || n.index !== o.index)
      return !1;
  return !0;
}
function Pi(i) {
  if (W(i))
    return i.map(Pi);
  if (O(i)) {
    const t = /* @__PURE__ */ Object.create(null), e = Object.keys(i), s = e.length;
    let n = 0;
    for (; n < s; ++n)
      t[e[n]] = Pi(i[e[n]]);
    return t;
  }
  return i;
}
function Yo(i) {
  return [
    "__proto__",
    "prototype",
    "constructor"
  ].indexOf(i) === -1;
}
function wl(i, t, e, s) {
  if (!Yo(i))
    return;
  const n = t[i], o = e[i];
  O(n) && O(o) ? We(n, o, s) : t[i] = Pi(o);
}
function We(i, t, e) {
  const s = W(t) ? t : [
    t
  ], n = s.length;
  if (!O(i))
    return i;
  e = e || {};
  const o = e.merger || wl;
  let r;
  for (let a = 0; a < n; ++a) {
    if (r = s[a], !O(r))
      continue;
    const l = Object.keys(r);
    for (let c = 0, h = l.length; c < h; ++c)
      o(l[c], i, r, e);
  }
  return i;
}
function De(i, t) {
  return We(i, t, {
    merger: Sl
  });
}
function Sl(i, t, e) {
  if (!Yo(i))
    return;
  const s = t[i], n = e[i];
  O(s) && O(n) ? De(s, n) : Object.prototype.hasOwnProperty.call(t, i) || (t[i] = Pi(n));
}
const dn = {
  // Chart.helpers.core resolveObjectKey should resolve empty key to root object
  "": (i) => i,
  // default resolvers
  x: (i) => i.x,
  y: (i) => i.y
};
function kl(i) {
  const t = i.split("."), e = [];
  let s = "";
  for (const n of t)
    s += n, s.endsWith("\\") ? s = s.slice(0, -1) + "." : (e.push(s), s = "");
  return e;
}
function Ml(i) {
  const t = kl(i);
  return (e) => {
    for (const s of t) {
      if (s === "")
        break;
      e = e && e[s];
    }
    return e;
  };
}
function ce(i, t) {
  return (dn[t] || (dn[t] = Ml(t)))(i);
}
function Os(i) {
  return i.charAt(0).toUpperCase() + i.slice(1);
}
const je = (i) => typeof i < "u", Dt = (i) => typeof i == "function", un = (i, t) => {
  if (i.size !== t.size)
    return !1;
  for (const e of i)
    if (!t.has(e))
      return !1;
  return !0;
};
function Pl(i) {
  return i.type === "mouseup" || i.type === "click" || i.type === "contextmenu";
}
const U = Math.PI, rt = 2 * U, Al = rt + U, Ai = Number.POSITIVE_INFINITY, $l = U / 180, ot = U / 2, Nt = U / 4, fn = U * 2 / 3, Ko = Math.log10, ft = Math.sign;
function Te(i, t, e) {
  return Math.abs(i - t) < e;
}
function pn(i) {
  const t = Math.round(i);
  i = Te(i, t, i / 1e3) ? t : i;
  const e = Math.pow(10, Math.floor(Ko(i))), s = i / e;
  return (s <= 1 ? 1 : s <= 2 ? 2 : s <= 5 ? 5 : 10) * e;
}
function Cl(i) {
  const t = [], e = Math.sqrt(i);
  let s;
  for (s = 1; s < e; s++)
    i % s === 0 && (t.push(s), t.push(i / s));
  return e === (e | 0) && t.push(e), t.sort((n, o) => n - o).pop(), t;
}
function Ol(i) {
  return typeof i == "symbol" || typeof i == "object" && i !== null && !(Symbol.toPrimitive in i || "toString" in i || "valueOf" in i);
}
function Ve(i) {
  return !Ol(i) && !isNaN(parseFloat(i)) && isFinite(i);
}
function Dl(i, t) {
  const e = Math.round(i);
  return e - t <= i && e + t >= i;
}
function Tl(i, t, e) {
  let s, n, o;
  for (s = 0, n = i.length; s < n; s++)
    o = i[s][e], isNaN(o) || (t.min = Math.min(t.min, o), t.max = Math.max(t.max, o));
}
function Xt(i) {
  return i * (U / 180);
}
function El(i) {
  return i * (180 / U);
}
function gn(i) {
  if (!Y(i))
    return;
  let t = 1, e = 0;
  for (; Math.round(i * t) / t !== i; )
    t *= 10, e++;
  return e;
}
function Ll(i, t) {
  const e = t.x - i.x, s = t.y - i.y, n = Math.sqrt(e * e + s * s);
  let o = Math.atan2(s, e);
  return o < -0.5 * U && (o += rt), {
    angle: o,
    distance: n
  };
}
function fs(i, t) {
  return Math.sqrt(Math.pow(t.x - i.x, 2) + Math.pow(t.y - i.y, 2));
}
function Rl(i, t) {
  return (i - t + Al) % rt - U;
}
function ut(i) {
  return (i % rt + rt) % rt;
}
function Xo(i, t, e, s) {
  const n = ut(i), o = ut(t), r = ut(e), a = ut(o - n), l = ut(r - n), c = ut(n - o), h = ut(n - r);
  return n === o || n === r || s && o === r || a > l && c < h;
}
function et(i, t, e) {
  return Math.max(t, Math.min(e, i));
}
function Il(i) {
  return et(i, -32768, 32767);
}
function St(i, t, e, s = 1e-6) {
  return i >= Math.min(t, e) - s && i <= Math.max(t, e) + s;
}
function Ds(i, t, e) {
  e = e || ((r) => i[r] < t);
  let s = i.length - 1, n = 0, o;
  for (; s - n > 1; )
    o = n + s >> 1, e(o) ? n = o : s = o;
  return {
    lo: n,
    hi: s
  };
}
const qt = (i, t, e, s) => Ds(i, e, s ? (n) => {
  const o = i[n][t];
  return o < e || o === e && i[n + 1][t] === e;
} : (n) => i[n][t] < e), Fl = (i, t, e) => Ds(i, e, (s) => i[s][t] >= e);
function zl(i, t, e) {
  let s = 0, n = i.length;
  for (; s < n && i[s] < t; )
    s++;
  for (; n > s && i[n - 1] > e; )
    n--;
  return s > 0 || n < i.length ? i.slice(s, n) : i;
}
const qo = [
  "push",
  "pop",
  "shift",
  "splice",
  "unshift"
];
function Bl(i, t) {
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
  }), qo.forEach((e) => {
    const s = "_onData" + Os(e), n = i[e];
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
function mn(i, t) {
  const e = i._chartjs;
  if (!e)
    return;
  const s = e.listeners, n = s.indexOf(t);
  n !== -1 && s.splice(n, 1), !(s.length > 0) && (qo.forEach((o) => {
    delete i[o];
  }), delete i._chartjs);
}
function Go(i) {
  const t = new Set(i);
  return t.size === i.length ? i : Array.from(t);
}
const Zo = function() {
  return typeof window > "u" ? function(i) {
    return i();
  } : window.requestAnimationFrame;
}();
function Qo(i, t) {
  let e = [], s = !1;
  return function(...n) {
    e = n, s || (s = !0, Zo.call(window, () => {
      s = !1, i.apply(t, e);
    }));
  };
}
function Hl(i, t) {
  let e;
  return function(...s) {
    return t ? (clearTimeout(e), e = setTimeout(i, t, s)) : i.apply(this, s), t;
  };
}
const Jo = (i) => i === "start" ? "left" : i === "end" ? "right" : "center", J = (i, t, e) => i === "start" ? t : i === "end" ? e : (t + e) / 2, Nl = (i, t, e, s) => i === (s ? "left" : "right") ? e : i === "center" ? (t + e) / 2 : t;
function Wl(i, t, e) {
  const s = t.length;
  let n = 0, o = s;
  if (i._sorted) {
    const { iScale: r, vScale: a, _parsed: l } = i, c = i.dataset && i.dataset.options ? i.dataset.options.spanGaps : null, h = r.axis, { min: d, max: u, minDefined: f, maxDefined: g } = r.getUserBounds();
    if (f) {
      if (n = Math.min(
        // @ts-expect-error Need to type _parsed
        qt(l, h, d).lo,
        // @ts-expect-error Need to fix types on _lookupByKey
        e ? s : qt(t, h, r.getPixelForValue(d)).lo
      ), c) {
        const p = l.slice(0, n + 1).reverse().findIndex((m) => !R(m[a.axis]));
        n -= Math.max(0, p);
      }
      n = et(n, 0, s - 1);
    }
    if (g) {
      let p = Math.max(
        // @ts-expect-error Need to type _parsed
        qt(l, r.axis, u, !0).hi + 1,
        // @ts-expect-error Need to fix types on _lookupByKey
        e ? 0 : qt(t, h, r.getPixelForValue(u), !0).hi + 1
      );
      if (c) {
        const m = l.slice(p - 1).findIndex((b) => !R(b[a.axis]));
        p += Math.max(0, m);
      }
      o = et(p, n, s) - n;
    } else
      o = s - n;
  }
  return {
    start: n,
    count: o
  };
}
function jl(i) {
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
const ni = (i) => i === 0 || i === 1, bn = (i, t, e) => -(Math.pow(2, 10 * (i -= 1)) * Math.sin((i - t) * rt / e)), _n = (i, t, e) => Math.pow(2, -10 * i) * Math.sin((i - t) * rt / e) + 1, Ee = {
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
  easeInSine: (i) => -Math.cos(i * ot) + 1,
  easeOutSine: (i) => Math.sin(i * ot),
  easeInOutSine: (i) => -0.5 * (Math.cos(U * i) - 1),
  easeInExpo: (i) => i === 0 ? 0 : Math.pow(2, 10 * (i - 1)),
  easeOutExpo: (i) => i === 1 ? 1 : -Math.pow(2, -10 * i) + 1,
  easeInOutExpo: (i) => ni(i) ? i : i < 0.5 ? 0.5 * Math.pow(2, 10 * (i * 2 - 1)) : 0.5 * (-Math.pow(2, -10 * (i * 2 - 1)) + 2),
  easeInCirc: (i) => i >= 1 ? i : -(Math.sqrt(1 - i * i) - 1),
  easeOutCirc: (i) => Math.sqrt(1 - (i -= 1) * i),
  easeInOutCirc: (i) => (i /= 0.5) < 1 ? -0.5 * (Math.sqrt(1 - i * i) - 1) : 0.5 * (Math.sqrt(1 - (i -= 2) * i) + 1),
  easeInElastic: (i) => ni(i) ? i : bn(i, 0.075, 0.3),
  easeOutElastic: (i) => ni(i) ? i : _n(i, 0.075, 0.3),
  easeInOutElastic(i) {
    return ni(i) ? i : i < 0.5 ? 0.5 * bn(i * 2, 0.1125, 0.45) : 0.5 + 0.5 * _n(i * 2 - 1, 0.1125, 0.45);
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
  easeInBounce: (i) => 1 - Ee.easeOutBounce(1 - i),
  easeOutBounce(i) {
    return i < 1 / 2.75 ? 7.5625 * i * i : i < 2 / 2.75 ? 7.5625 * (i -= 1.5 / 2.75) * i + 0.75 : i < 2.5 / 2.75 ? 7.5625 * (i -= 2.25 / 2.75) * i + 0.9375 : 7.5625 * (i -= 2.625 / 2.75) * i + 0.984375;
  },
  easeInOutBounce: (i) => i < 0.5 ? Ee.easeInBounce(i * 2) * 0.5 : Ee.easeOutBounce(i * 2 - 1) * 0.5 + 0.5
};
function Ts(i) {
  if (i && typeof i == "object") {
    const t = i.toString();
    return t === "[object CanvasPattern]" || t === "[object CanvasGradient]";
  }
  return !1;
}
function yn(i) {
  return Ts(i) ? i : new Ne(i);
}
function Gi(i) {
  return Ts(i) ? i : new Ne(i).saturate(0.5).darken(0.1).hexString();
}
const Vl = [
  "x",
  "y",
  "borderWidth",
  "radius",
  "tension"
], Ul = [
  "color",
  "borderColor",
  "backgroundColor"
];
function Yl(i) {
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
      properties: Ul
    },
    numbers: {
      type: "number",
      properties: Vl
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
function Kl(i) {
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
const xn = /* @__PURE__ */ new Map();
function Xl(i, t) {
  t = t || {};
  const e = i + JSON.stringify(t);
  let s = xn.get(e);
  return s || (s = new Intl.NumberFormat(i, t), xn.set(e, s)), s;
}
function tr(i, t, e) {
  return Xl(t, e).format(i);
}
const ql = {
  values(i) {
    return W(i) ? i : "" + i;
  },
  numeric(i, t, e) {
    if (i === 0)
      return "0";
    const s = this.chart.options.locale;
    let n, o = i;
    if (e.length > 1) {
      const c = Math.max(Math.abs(e[0].value), Math.abs(e[e.length - 1].value));
      (c < 1e-4 || c > 1e15) && (n = "scientific"), o = Gl(i, e);
    }
    const r = Ko(Math.abs(o)), a = isNaN(r) ? 1 : Math.max(Math.min(-1 * Math.floor(r), 20), 0), l = {
      notation: n,
      minimumFractionDigits: a,
      maximumFractionDigits: a
    };
    return Object.assign(l, this.options.ticks.format), tr(i, s, l);
  }
};
function Gl(i, t) {
  let e = t.length > 3 ? t[2].value - t[1].value : t[1].value - t[0].value;
  return Math.abs(e) >= 1 && i !== Math.floor(i) && (e = i - Math.floor(i)), e;
}
var er = {
  formatters: ql
};
function Zl(i) {
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
      callback: er.formatters.values,
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
const Jt = /* @__PURE__ */ Object.create(null), ps = /* @__PURE__ */ Object.create(null);
function Le(i, t) {
  if (!t)
    return i;
  const e = t.split(".");
  for (let s = 0, n = e.length; s < n; ++s) {
    const o = e[s];
    i = i[o] || (i[o] = /* @__PURE__ */ Object.create(null));
  }
  return i;
}
function Zi(i, t, e) {
  return typeof t == "string" ? We(Le(i, t), e) : We(Le(i, ""), t);
}
class Ql {
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
    }, this.hover = {}, this.hoverBackgroundColor = (s, n) => Gi(n.backgroundColor), this.hoverBorderColor = (s, n) => Gi(n.borderColor), this.hoverColor = (s, n) => Gi(n.color), this.indexAxis = "x", this.interaction = {
      mode: "nearest",
      intersect: !0,
      includeInvisible: !1
    }, this.maintainAspectRatio = !0, this.onHover = null, this.onClick = null, this.parsing = !0, this.plugins = {}, this.responsive = !0, this.scale = void 0, this.scales = {}, this.showLine = !0, this.drawActiveElementsOnTop = !0, this.describe(t), this.apply(e);
  }
  set(t, e) {
    return Zi(this, t, e);
  }
  get(t) {
    return Le(this, t);
  }
  describe(t, e) {
    return Zi(ps, t, e);
  }
  override(t, e) {
    return Zi(Jt, t, e);
  }
  route(t, e, s, n) {
    const o = Le(this, t), r = Le(this, s), a = "_" + e;
    Object.defineProperties(o, {
      [a]: {
        value: o[e],
        writable: !0
      },
      [e]: {
        enumerable: !0,
        get() {
          const l = this[a], c = r[n];
          return O(l) ? Object.assign({}, c, l) : $(l, c);
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
var B = /* @__PURE__ */ new Ql({
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
  Yl,
  Kl,
  Zl
]);
function Jl(i) {
  return !i || R(i.size) || R(i.family) ? null : (i.style ? i.style + " " : "") + (i.weight ? i.weight + " " : "") + i.size + "px " + i.family;
}
function vn(i, t, e, s, n) {
  let o = t[n];
  return o || (o = t[n] = i.measureText(n).width, e.push(n)), o > s && (s = o), s;
}
function Wt(i, t, e) {
  const s = i.currentDevicePixelRatio, n = e !== 0 ? Math.max(e / 2, 0.5) : 0;
  return Math.round((t - n) * s) / s + n;
}
function wn(i, t) {
  !t && !i || (t = t || i.getContext("2d"), t.save(), t.resetTransform(), t.clearRect(0, 0, i.width, i.height), t.restore());
}
function gs(i, t, e, s) {
  ir(i, t, e, s, null);
}
function ir(i, t, e, s, n) {
  let o, r, a, l, c, h, d, u;
  const f = t.pointStyle, g = t.rotation, p = t.radius;
  let m = (g || 0) * $l;
  if (f && typeof f == "object" && (o = f.toString(), o === "[object HTMLImageElement]" || o === "[object HTMLCanvasElement]")) {
    i.save(), i.translate(e, s), i.rotate(m), i.drawImage(f, -f.width / 2, -f.height / 2, f.width, f.height), i.restore();
    return;
  }
  if (!(isNaN(p) || p <= 0)) {
    switch (i.beginPath(), f) {
      default:
        n ? i.ellipse(e, s, n / 2, p, 0, 0, rt) : i.arc(e, s, p, 0, rt), i.closePath();
        break;
      case "triangle":
        h = n ? n / 2 : p, i.moveTo(e + Math.sin(m) * h, s - Math.cos(m) * p), m += fn, i.lineTo(e + Math.sin(m) * h, s - Math.cos(m) * p), m += fn, i.lineTo(e + Math.sin(m) * h, s - Math.cos(m) * p), i.closePath();
        break;
      case "rectRounded":
        c = p * 0.516, l = p - c, r = Math.cos(m + Nt) * l, d = Math.cos(m + Nt) * (n ? n / 2 - c : l), a = Math.sin(m + Nt) * l, u = Math.sin(m + Nt) * (n ? n / 2 - c : l), i.arc(e - d, s - a, c, m - U, m - ot), i.arc(e + u, s - r, c, m - ot, m), i.arc(e + d, s + a, c, m, m + ot), i.arc(e - u, s + r, c, m + ot, m + U), i.closePath();
        break;
      case "rect":
        if (!g) {
          l = Math.SQRT1_2 * p, h = n ? n / 2 : l, i.rect(e - h, s - l, 2 * h, 2 * l);
          break;
        }
        m += Nt;
      case "rectRot":
        d = Math.cos(m) * (n ? n / 2 : p), r = Math.cos(m) * p, a = Math.sin(m) * p, u = Math.sin(m) * (n ? n / 2 : p), i.moveTo(e - d, s - a), i.lineTo(e + u, s - r), i.lineTo(e + d, s + a), i.lineTo(e - u, s + r), i.closePath();
        break;
      case "crossRot":
        m += Nt;
      case "cross":
        d = Math.cos(m) * (n ? n / 2 : p), r = Math.cos(m) * p, a = Math.sin(m) * p, u = Math.sin(m) * (n ? n / 2 : p), i.moveTo(e - d, s - a), i.lineTo(e + d, s + a), i.moveTo(e + u, s - r), i.lineTo(e - u, s + r);
        break;
      case "star":
        d = Math.cos(m) * (n ? n / 2 : p), r = Math.cos(m) * p, a = Math.sin(m) * p, u = Math.sin(m) * (n ? n / 2 : p), i.moveTo(e - d, s - a), i.lineTo(e + d, s + a), i.moveTo(e + u, s - r), i.lineTo(e - u, s + r), m += Nt, d = Math.cos(m) * (n ? n / 2 : p), r = Math.cos(m) * p, a = Math.sin(m) * p, u = Math.sin(m) * (n ? n / 2 : p), i.moveTo(e - d, s - a), i.lineTo(e + d, s + a), i.moveTo(e + u, s - r), i.lineTo(e - u, s + r);
        break;
      case "line":
        r = n ? n / 2 : Math.cos(m) * p, a = Math.sin(m) * p, i.moveTo(e - r, s - a), i.lineTo(e + r, s + a);
        break;
      case "dash":
        i.moveTo(e, s), i.lineTo(e + Math.cos(m) * (n ? n / 2 : p), s + Math.sin(m) * p);
        break;
      case !1:
        i.closePath();
        break;
    }
    i.fill(), t.borderWidth > 0 && i.stroke();
  }
}
function Ue(i, t, e) {
  return e = e || 0.5, !t || i && i.x > t.left - e && i.x < t.right + e && i.y > t.top - e && i.y < t.bottom + e;
}
function zi(i, t) {
  i.save(), i.beginPath(), i.rect(t.left, t.top, t.right - t.left, t.bottom - t.top), i.clip();
}
function Bi(i) {
  i.restore();
}
function tc(i, t, e, s, n) {
  if (!t)
    return i.lineTo(e.x, e.y);
  if (n === "middle") {
    const o = (t.x + e.x) / 2;
    i.lineTo(o, t.y), i.lineTo(o, e.y);
  } else n === "after" != !!s ? i.lineTo(t.x, e.y) : i.lineTo(e.x, t.y);
  i.lineTo(e.x, e.y);
}
function ec(i, t, e, s) {
  if (!t)
    return i.lineTo(e.x, e.y);
  i.bezierCurveTo(s ? t.cp1x : t.cp2x, s ? t.cp1y : t.cp2y, s ? e.cp2x : e.cp1x, s ? e.cp2y : e.cp1y, e.x, e.y);
}
function ic(i, t) {
  t.translation && i.translate(t.translation[0], t.translation[1]), R(t.rotation) || i.rotate(t.rotation), t.color && (i.fillStyle = t.color), t.textAlign && (i.textAlign = t.textAlign), t.textBaseline && (i.textBaseline = t.textBaseline);
}
function sc(i, t, e, s, n) {
  if (n.strikethrough || n.underline) {
    const o = i.measureText(s), r = t - o.actualBoundingBoxLeft, a = t + o.actualBoundingBoxRight, l = e - o.actualBoundingBoxAscent, c = e + o.actualBoundingBoxDescent, h = n.strikethrough ? (l + c) / 2 : c;
    i.strokeStyle = i.fillStyle, i.beginPath(), i.lineWidth = n.decorationWidth || 2, i.moveTo(r, h), i.lineTo(a, h), i.stroke();
  }
}
function nc(i, t) {
  const e = i.fillStyle;
  i.fillStyle = t.color, i.fillRect(t.left, t.top, t.width, t.height), i.fillStyle = e;
}
function $i(i, t, e, s, n, o = {}) {
  const r = W(t) ? t : [
    t
  ], a = o.strokeWidth > 0 && o.strokeColor !== "";
  let l, c;
  for (i.save(), i.font = n.string, ic(i, o), l = 0; l < r.length; ++l)
    c = r[l], o.backdrop && nc(i, o.backdrop), a && (o.strokeColor && (i.strokeStyle = o.strokeColor), R(o.strokeWidth) || (i.lineWidth = o.strokeWidth), i.strokeText(c, e, s, o.maxWidth)), i.fillText(c, e, s, o.maxWidth), sc(i, e, s, c, o), s += Number(n.lineHeight);
  i.restore();
}
function Ci(i, t) {
  const { x: e, y: s, w: n, h: o, radius: r } = t;
  i.arc(e + r.topLeft, s + r.topLeft, r.topLeft, 1.5 * U, U, !0), i.lineTo(e, s + o - r.bottomLeft), i.arc(e + r.bottomLeft, s + o - r.bottomLeft, r.bottomLeft, U, ot, !0), i.lineTo(e + n - r.bottomRight, s + o), i.arc(e + n - r.bottomRight, s + o - r.bottomRight, r.bottomRight, ot, 0, !0), i.lineTo(e + n, s + r.topRight), i.arc(e + n - r.topRight, s + r.topRight, r.topRight, 0, -ot, !0), i.lineTo(e + r.topLeft, s);
}
const oc = /^(normal|(\d+(?:\.\d+)?)(px|em|%)?)$/, rc = /^(normal|italic|initial|inherit|unset|(oblique( -?[0-9]?[0-9]deg)?))$/;
function ac(i, t) {
  const e = ("" + i).match(oc);
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
const lc = (i) => +i || 0;
function sr(i, t) {
  const e = {}, s = O(t), n = s ? Object.keys(t) : t, o = O(i) ? s ? (r) => $(i[r], i[t[r]]) : (r) => i[r] : () => i;
  for (const r of n)
    e[r] = lc(o(r));
  return e;
}
function nr(i) {
  return sr(i, {
    top: "y",
    right: "x",
    bottom: "y",
    left: "x"
  });
}
function oe(i) {
  return sr(i, [
    "topLeft",
    "topRight",
    "bottomLeft",
    "bottomRight"
  ]);
}
function at(i) {
  const t = nr(i);
  return t.width = t.left + t.right, t.height = t.top + t.bottom, t;
}
function Z(i, t) {
  i = i || {}, t = t || B.font;
  let e = $(i.size, t.size);
  typeof e == "string" && (e = parseInt(e, 10));
  let s = $(i.style, t.style);
  s && !("" + s).match(rc) && (console.warn('Invalid font style specified: "' + s + '"'), s = void 0);
  const n = {
    family: $(i.family, t.family),
    lineHeight: ac($(i.lineHeight, t.lineHeight), e),
    size: e,
    style: s,
    weight: $(i.weight, t.weight),
    string: ""
  };
  return n.string = Jl(n), n;
}
function oi(i, t, e, s) {
  let n, o, r;
  for (n = 0, o = i.length; n < o; ++n)
    if (r = i[n], r !== void 0 && r !== void 0)
      return r;
}
function cc(i, t, e) {
  const { min: s, max: n } = i, o = vl(t, (n - s) / 2), r = (a, l) => e && a === 0 ? 0 : a + l;
  return {
    min: r(s, -Math.abs(o)),
    max: r(n, o)
  };
}
function te(i, t) {
  return Object.assign(Object.create(i), t);
}
function Es(i, t = [
  ""
], e, s, n = () => i[0]) {
  const o = e || i;
  typeof s > "u" && (s = lr("_fallback", i));
  const r = {
    [Symbol.toStringTag]: "Object",
    _cacheable: !0,
    _scopes: i,
    _rootScopes: o,
    _fallback: s,
    _getTarget: n,
    override: (a) => Es([
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
      return rr(a, l, () => bc(l, t, i, a));
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
      return kn(a).includes(l);
    },
    /**
    * A trap for Object.getOwnPropertyNames and Object.getOwnPropertySymbols.
    */
    ownKeys(a) {
      return kn(a);
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
function he(i, t, e, s) {
  const n = {
    _cacheable: !1,
    _proxy: i,
    _context: t,
    _subProxy: e,
    _stack: /* @__PURE__ */ new Set(),
    _descriptors: or(i, s),
    setContext: (o) => he(i, o, e, s),
    override: (o) => he(i.override(o), t, e, s)
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
      return rr(o, r, () => dc(o, r, a));
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
function or(i, t = {
  scriptable: !0,
  indexable: !0
}) {
  const { _scriptable: e = t.scriptable, _indexable: s = t.indexable, _allKeys: n = t.allKeys } = i;
  return {
    allKeys: n,
    scriptable: e,
    indexable: s,
    isScriptable: Dt(e) ? e : () => e,
    isIndexable: Dt(s) ? s : () => s
  };
}
const hc = (i, t) => i ? i + Os(t) : t, Ls = (i, t) => O(t) && i !== "adapters" && (Object.getPrototypeOf(t) === null || t.constructor === Object);
function rr(i, t, e) {
  if (Object.prototype.hasOwnProperty.call(i, t) || t === "constructor")
    return i[t];
  const s = e();
  return i[t] = s, s;
}
function dc(i, t, e) {
  const { _proxy: s, _context: n, _subProxy: o, _descriptors: r } = i;
  let a = s[t];
  return Dt(a) && r.isScriptable(t) && (a = uc(t, a, i, e)), W(a) && a.length && (a = fc(t, a, i, r.isIndexable)), Ls(t, a) && (a = he(a, n, o && o[t], r)), a;
}
function uc(i, t, e, s) {
  const { _proxy: n, _context: o, _subProxy: r, _stack: a } = e;
  if (a.has(i))
    throw new Error("Recursion detected: " + Array.from(a).join("->") + "->" + i);
  a.add(i);
  let l = t(o, r || s);
  return a.delete(i), Ls(i, l) && (l = Rs(n._scopes, n, i, l)), l;
}
function fc(i, t, e, s) {
  const { _proxy: n, _context: o, _subProxy: r, _descriptors: a } = e;
  if (typeof o.index < "u" && s(i))
    return t[o.index % t.length];
  if (O(t[0])) {
    const l = t, c = n._scopes.filter((h) => h !== l);
    t = [];
    for (const h of l) {
      const d = Rs(c, n, i, h);
      t.push(he(d, o, r && r[i], a));
    }
  }
  return t;
}
function ar(i, t, e) {
  return Dt(i) ? i(t, e) : i;
}
const pc = (i, t) => i === !0 ? t : typeof i == "string" ? ce(t, i) : void 0;
function gc(i, t, e, s, n) {
  for (const o of t) {
    const r = pc(e, o);
    if (r) {
      i.add(r);
      const a = ar(r._fallback, e, n);
      if (typeof a < "u" && a !== e && a !== s)
        return a;
    } else if (r === !1 && typeof s < "u" && e !== s)
      return null;
  }
  return !1;
}
function Rs(i, t, e, s) {
  const n = t._rootScopes, o = ar(t._fallback, e, s), r = [
    ...i,
    ...n
  ], a = /* @__PURE__ */ new Set();
  a.add(s);
  let l = Sn(a, r, e, o || e, s);
  return l === null || typeof o < "u" && o !== e && (l = Sn(a, r, o, l, s), l === null) ? !1 : Es(Array.from(a), [
    ""
  ], n, o, () => mc(t, e, s));
}
function Sn(i, t, e, s, n) {
  for (; e; )
    e = gc(i, t, e, s, n);
  return e;
}
function mc(i, t, e) {
  const s = i._getTarget();
  t in s || (s[t] = {});
  const n = s[t];
  return W(n) && O(e) ? e : n || {};
}
function bc(i, t, e, s) {
  let n;
  for (const o of t)
    if (n = lr(hc(o, i), e), typeof n < "u")
      return Ls(i, n) ? Rs(e, s, i, n) : n;
}
function lr(i, t) {
  for (const e of t) {
    if (!e)
      continue;
    const s = e[i];
    if (typeof s < "u")
      return s;
  }
}
function kn(i) {
  let t = i._keys;
  return t || (t = i._keys = _c(i._scopes)), t;
}
function _c(i) {
  const t = /* @__PURE__ */ new Set();
  for (const e of i)
    for (const s of Object.keys(e).filter((n) => !n.startsWith("_")))
      t.add(s);
  return Array.from(t);
}
const yc = Number.EPSILON || 1e-14, de = (i, t) => t < i.length && !i[t].skip && i[t], cr = (i) => i === "x" ? "y" : "x";
function xc(i, t, e, s) {
  const n = i.skip ? t : i, o = t, r = e.skip ? t : e, a = fs(o, n), l = fs(r, o);
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
function vc(i, t, e) {
  const s = i.length;
  let n, o, r, a, l, c = de(i, 0);
  for (let h = 0; h < s - 1; ++h)
    if (l = c, c = de(i, h + 1), !(!l || !c)) {
      if (Te(t[h], 0, yc)) {
        e[h] = e[h + 1] = 0;
        continue;
      }
      n = e[h] / t[h], o = e[h + 1] / t[h], a = Math.pow(n, 2) + Math.pow(o, 2), !(a <= 9) && (r = 3 / Math.sqrt(a), e[h] = n * r * t[h], e[h + 1] = o * r * t[h]);
    }
}
function wc(i, t, e = "x") {
  const s = cr(e), n = i.length;
  let o, r, a, l = de(i, 0);
  for (let c = 0; c < n; ++c) {
    if (r = a, a = l, l = de(i, c + 1), !a)
      continue;
    const h = a[e], d = a[s];
    r && (o = (h - r[e]) / 3, a[`cp1${e}`] = h - o, a[`cp1${s}`] = d - o * t[c]), l && (o = (l[e] - h) / 3, a[`cp2${e}`] = h + o, a[`cp2${s}`] = d + o * t[c]);
  }
}
function Sc(i, t = "x") {
  const e = cr(t), s = i.length, n = Array(s).fill(0), o = Array(s);
  let r, a, l, c = de(i, 0);
  for (r = 0; r < s; ++r)
    if (a = l, l = c, c = de(i, r + 1), !!l) {
      if (c) {
        const h = c[t] - l[t];
        n[r] = h !== 0 ? (c[e] - l[e]) / h : 0;
      }
      o[r] = a ? c ? ft(n[r - 1]) !== ft(n[r]) ? 0 : (n[r - 1] + n[r]) / 2 : n[r - 1] : n[r];
    }
  vc(i, n, o), wc(i, o, t);
}
function ri(i, t, e) {
  return Math.max(Math.min(i, e), t);
}
function kc(i, t) {
  let e, s, n, o, r, a = Ue(i[0], t);
  for (e = 0, s = i.length; e < s; ++e)
    r = o, o = a, a = e < s - 1 && Ue(i[e + 1], t), o && (n = i[e], r && (n.cp1x = ri(n.cp1x, t.left, t.right), n.cp1y = ri(n.cp1y, t.top, t.bottom)), a && (n.cp2x = ri(n.cp2x, t.left, t.right), n.cp2y = ri(n.cp2y, t.top, t.bottom)));
}
function Mc(i, t, e, s, n) {
  let o, r, a, l;
  if (t.spanGaps && (i = i.filter((c) => !c.skip)), t.cubicInterpolationMode === "monotone")
    Sc(i, n);
  else {
    let c = s ? i[i.length - 1] : i[0];
    for (o = 0, r = i.length; o < r; ++o)
      a = i[o], l = xc(c, a, i[Math.min(o + 1, r - (s ? 0 : 1)) % r], t.tension), a.cp1x = l.previous.x, a.cp1y = l.previous.y, a.cp2x = l.next.x, a.cp2y = l.next.y, c = a;
  }
  t.capBezierPoints && kc(i, e);
}
function Is() {
  return typeof window < "u" && typeof document < "u";
}
function Fs(i) {
  let t = i.parentNode;
  return t && t.toString() === "[object ShadowRoot]" && (t = t.host), t;
}
function Oi(i, t, e) {
  let s;
  return typeof i == "string" ? (s = parseInt(i, 10), i.indexOf("%") !== -1 && (s = s / 100 * t.parentNode[e])) : s = i, s;
}
const Hi = (i) => i.ownerDocument.defaultView.getComputedStyle(i, null);
function Pc(i, t) {
  return Hi(i).getPropertyValue(t);
}
const Ac = [
  "top",
  "right",
  "bottom",
  "left"
];
function Gt(i, t, e) {
  const s = {};
  e = e ? "-" + e : "";
  for (let n = 0; n < 4; n++) {
    const o = Ac[n];
    s[o] = parseFloat(i[t + "-" + o + e]) || 0;
  }
  return s.width = s.left + s.right, s.height = s.top + s.bottom, s;
}
const $c = (i, t, e) => (i > 0 || t > 0) && (!e || !e.shadowRoot);
function Cc(i, t) {
  const e = i.touches, s = e && e.length ? e[0] : i, { offsetX: n, offsetY: o } = s;
  let r = !1, a, l;
  if ($c(n, o, i.target))
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
function Ut(i, t) {
  if ("native" in i)
    return i;
  const { canvas: e, currentDevicePixelRatio: s } = t, n = Hi(e), o = n.boxSizing === "border-box", r = Gt(n, "padding"), a = Gt(n, "border", "width"), { x: l, y: c, box: h } = Cc(i, e), d = r.left + (h && a.left), u = r.top + (h && a.top);
  let { width: f, height: g } = t;
  return o && (f -= r.width + a.width, g -= r.height + a.height), {
    x: Math.round((l - d) / f * e.width / s),
    y: Math.round((c - u) / g * e.height / s)
  };
}
function Oc(i, t, e) {
  let s, n;
  if (t === void 0 || e === void 0) {
    const o = i && Fs(i);
    if (!o)
      t = i.clientWidth, e = i.clientHeight;
    else {
      const r = o.getBoundingClientRect(), a = Hi(o), l = Gt(a, "border", "width"), c = Gt(a, "padding");
      t = r.width - c.width - l.width, e = r.height - c.height - l.height, s = Oi(a.maxWidth, o, "clientWidth"), n = Oi(a.maxHeight, o, "clientHeight");
    }
  }
  return {
    width: t,
    height: e,
    maxWidth: s || Ai,
    maxHeight: n || Ai
  };
}
const kt = (i) => Math.round(i * 10) / 10;
function Dc(i, t, e, s) {
  const n = Hi(i), o = Gt(n, "margin"), r = Oi(n.maxWidth, i, "clientWidth") || Ai, a = Oi(n.maxHeight, i, "clientHeight") || Ai, l = Oc(i, t, e);
  let { width: c, height: h } = l;
  if (n.boxSizing === "content-box") {
    const u = Gt(n, "border", "width"), f = Gt(n, "padding");
    c -= f.width + u.width, h -= f.height + u.height;
  }
  return c = Math.max(0, c - o.width), h = Math.max(0, s ? c / s : h - o.height), c = kt(Math.min(c, r, l.maxWidth)), h = kt(Math.min(h, a, l.maxHeight)), c && !h && (h = kt(c / 2)), (t !== void 0 || e !== void 0) && s && l.height && h > l.height && (h = l.height, c = kt(Math.floor(h * s))), {
    width: c,
    height: h
  };
}
function Mn(i, t, e) {
  const s = t || 1, n = kt(i.height * s), o = kt(i.width * s);
  i.height = kt(i.height), i.width = kt(i.width);
  const r = i.canvas;
  return r.style && (e || !r.style.height && !r.style.width) && (r.style.height = `${i.height}px`, r.style.width = `${i.width}px`), i.currentDevicePixelRatio !== s || r.height !== n || r.width !== o ? (i.currentDevicePixelRatio = s, r.height = n, r.width = o, i.ctx.setTransform(s, 0, 0, s, 0, 0), !0) : !1;
}
const Tc = function() {
  let i = !1;
  try {
    const t = {
      get passive() {
        return i = !0, !1;
      }
    };
    Is() && (window.addEventListener("test", null, t), window.removeEventListener("test", null, t));
  } catch {
  }
  return i;
}();
function Pn(i, t) {
  const e = Pc(i, t), s = e && e.match(/^(\d+)(\.\d+)?px$/);
  return s ? +s[1] : void 0;
}
function Yt(i, t, e, s) {
  return {
    x: i.x + e * (t.x - i.x),
    y: i.y + e * (t.y - i.y)
  };
}
function Ec(i, t, e, s) {
  return {
    x: i.x + e * (t.x - i.x),
    y: s === "middle" ? e < 0.5 ? i.y : t.y : s === "after" ? e < 1 ? i.y : t.y : e > 0 ? t.y : i.y
  };
}
function Lc(i, t, e, s) {
  const n = {
    x: i.cp2x,
    y: i.cp2y
  }, o = {
    x: t.cp1x,
    y: t.cp1y
  }, r = Yt(i, n, e), a = Yt(n, o, e), l = Yt(o, t, e), c = Yt(r, a, e), h = Yt(a, l, e);
  return Yt(c, h, e);
}
const Rc = function(i, t) {
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
}, Ic = function() {
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
function re(i, t, e) {
  return i ? Rc(t, e) : Ic();
}
function hr(i, t) {
  let e, s;
  (t === "ltr" || t === "rtl") && (e = i.canvas.style, s = [
    e.getPropertyValue("direction"),
    e.getPropertyPriority("direction")
  ], e.setProperty("direction", t, "important"), i.prevTextDirection = s);
}
function dr(i, t) {
  t !== void 0 && (delete i.prevTextDirection, i.canvas.style.setProperty("direction", t[0], t[1]));
}
function ur(i) {
  return i === "angle" ? {
    between: Xo,
    compare: Rl,
    normalize: ut
  } : {
    between: St,
    compare: (t, e) => t - e,
    normalize: (t) => t
  };
}
function An({ start: i, end: t, count: e, loop: s, style: n }) {
  return {
    start: i % e,
    end: t % e,
    loop: s && (t - i + 1) % e === 0,
    style: n
  };
}
function Fc(i, t, e) {
  const { property: s, start: n, end: o } = e, { between: r, normalize: a } = ur(s), l = t.length;
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
function fr(i, t, e) {
  if (!e)
    return [
      i
    ];
  const { property: s, start: n, end: o } = e, r = t.length, { compare: a, between: l, normalize: c } = ur(s), { start: h, end: d, loop: u, style: f } = Fc(i, t, e), g = [];
  let p = !1, m = null, b, _, x;
  const v = () => l(n, x, b) && a(n, x) !== 0, y = () => a(o, b) === 0 || l(o, x, b), k = () => p || v(), S = () => !p || y();
  for (let w = h, A = h; w <= d; ++w)
    _ = t[w % r], !_.skip && (b = c(_[s]), b !== x && (p = l(b, n, o), m === null && k() && (m = a(b, n) === 0 ? w : A), m !== null && S() && (g.push(An({
      start: m,
      end: w,
      loop: u,
      count: r,
      style: f
    })), m = null), A = w, x = b));
  return m !== null && g.push(An({
    start: m,
    end: d,
    loop: u,
    count: r,
    style: f
  })), g;
}
function pr(i, t) {
  const e = [], s = i.segments;
  for (let n = 0; n < s.length; n++) {
    const o = fr(s[n], i.points, t);
    o.length && e.push(...o);
  }
  return e;
}
function zc(i, t, e, s) {
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
function Bc(i, t, e, s) {
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
function Hc(i, t) {
  const e = i.points, s = i.options.spanGaps, n = e.length;
  if (!n)
    return [];
  const o = !!i._loop, { start: r, end: a } = zc(e, n, o, s);
  if (s === !0)
    return $n(i, [
      {
        start: r,
        end: a,
        loop: o
      }
    ], e, t);
  const l = a < r ? a + n : a, c = !!i._fullLoop && r === 0 && a === n - 1;
  return $n(i, Bc(e, r, l, c), e, t);
}
function $n(i, t, e, s) {
  return !s || !s.setContext || !e ? t : Nc(i, t, e, s);
}
function Nc(i, t, e, s) {
  const n = i._chart.getContext(), o = Cn(i.options), { _datasetIndex: r, options: { spanGaps: a } } = i, l = e.length, c = [];
  let h = o, d = t[0].start, u = d;
  function f(g, p, m, b) {
    const _ = a ? -1 : 1;
    if (g !== p) {
      for (g += l; e[g % l].skip; )
        g -= _;
      for (; e[p % l].skip; )
        p += _;
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
      m = Cn(s.setContext(te(n, {
        type: "segment",
        p0: p,
        p1: b,
        p0DataIndex: (u - 1) % l,
        p1DataIndex: u % l,
        datasetIndex: r
      }))), Wc(m, h) && f(d, u - 1, g.loop, h), p = b, h = m;
    }
    d < u - 1 && f(d, u - 1, g.loop, h);
  }
  return c;
}
function Cn(i) {
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
function Wc(i, t) {
  if (!t)
    return !1;
  const e = [], s = function(n, o) {
    return Ts(o) ? (e.includes(o) || e.push(o), e.indexOf(o)) : o;
  };
  return JSON.stringify(i, s) !== JSON.stringify(t, s);
}
function ai(i, t, e) {
  return i.options.clip ? i[e] : t[e];
}
function jc(i, t) {
  const { xScale: e, yScale: s } = i;
  return e && s ? {
    left: ai(e, t, "left"),
    right: ai(e, t, "right"),
    top: ai(s, t, "top"),
    bottom: ai(s, t, "bottom")
  } : t;
}
function gr(i, t) {
  const e = t._clip;
  if (e.disabled)
    return !1;
  const s = jc(t, i.chartArea);
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
class Vc {
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
    this._request || (this._running = !0, this._request = Zo.call(window, () => {
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
var bt = /* @__PURE__ */ new Vc();
const On = "transparent", Uc = {
  boolean(i, t, e) {
    return e > 0.5 ? t : i;
  },
  color(i, t, e) {
    const s = yn(i || On), n = s.valid && yn(t || On);
    return n && n.valid ? n.mix(s, e).hexString() : t;
  },
  number(i, t, e) {
    return i + (t - i) * e;
  }
};
class Yc {
  constructor(t, e, s, n) {
    const o = e[s];
    n = oi([
      t.to,
      n,
      o,
      t.from
    ]);
    const r = oi([
      t.from,
      o,
      n
    ]);
    this._active = !0, this._fn = t.fn || Uc[t.type || typeof r], this._easing = Ee[t.easing] || Ee.linear, this._start = Math.floor(Date.now() + (t.delay || 0)), this._duration = this._total = Math.floor(t.duration), this._loop = !!t.loop, this._target = e, this._prop = s, this._from = r, this._to = n, this._promises = void 0;
  }
  active() {
    return this._active;
  }
  update(t, e, s) {
    if (this._active) {
      this._notify(!1);
      const n = this._target[this._prop], o = s - this._start, r = this._duration - o;
      this._start = s, this._duration = Math.floor(Math.max(r, t.duration)), this._total += o, this._loop = !!t.loop, this._to = oi([
        t.to,
        e,
        n,
        t.from
      ]), this._from = oi([
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
class mr {
  constructor(t, e) {
    this._chart = t, this._properties = /* @__PURE__ */ new Map(), this.configure(e);
  }
  configure(t) {
    if (!O(t))
      return;
    const e = Object.keys(B.animation), s = this._properties;
    Object.getOwnPropertyNames(t).forEach((n) => {
      const o = t[n];
      if (!O(o))
        return;
      const r = {};
      for (const a of e)
        r[a] = o[a];
      (W(o.properties) && o.properties || [
        n
      ]).forEach((a) => {
        (a === n || !s.has(a)) && s.set(a, r);
      });
    });
  }
  _animateOptions(t, e) {
    const s = e.options, n = Xc(t, s);
    if (!n)
      return [];
    const o = this._createAnimations(n, s);
    return s.$shared && Kc(t.options.$animations, s).then(() => {
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
      o[c] = d = new Yc(u, t, c, h), n.push(d);
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
      return bt.add(this._chart, s), !0;
  }
}
function Kc(i, t) {
  const e = [], s = Object.keys(t);
  for (let n = 0; n < s.length; n++) {
    const o = i[s[n]];
    o && o.active() && e.push(o.wait());
  }
  return Promise.all(e);
}
function Xc(i, t) {
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
function Dn(i, t) {
  const e = i && i.options || {}, s = e.reverse, n = e.min === void 0 ? t : 0, o = e.max === void 0 ? t : 0;
  return {
    start: s ? o : n,
    end: s ? n : o
  };
}
function qc(i, t, e) {
  if (e === !1)
    return !1;
  const s = Dn(i, e), n = Dn(t, e);
  return {
    top: n.end,
    right: s.end,
    bottom: n.start,
    left: s.start
  };
}
function Gc(i) {
  let t, e, s, n;
  return O(i) ? (t = i.top, e = i.right, s = i.bottom, n = i.left) : t = e = s = n = i, {
    top: t,
    right: e,
    bottom: s,
    left: n,
    disabled: i === !1
  };
}
function br(i, t) {
  const e = [], s = i._getSortedDatasetMetas(t);
  let n, o;
  for (n = 0, o = s.length; n < o; ++n)
    e.push(s[n].index);
  return e;
}
function Tn(i, t, e, s = {}) {
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
    c = i.values[l], Y(c) && (o || t === 0 || ft(t) === ft(c)) && (t += c);
  }
  return !h && !s.all ? 0 : t;
}
function Zc(i, t) {
  const { iScale: e, vScale: s } = t, n = e.axis === "x" ? "x" : "y", o = s.axis === "x" ? "x" : "y", r = Object.keys(i), a = new Array(r.length);
  let l, c, h;
  for (l = 0, c = r.length; l < c; ++l)
    h = r[l], a[l] = {
      [n]: h,
      [o]: i[h]
    };
  return a;
}
function Qi(i, t) {
  const e = i && i.options.stacked;
  return e || e === void 0 && t.stack !== void 0;
}
function Qc(i, t, e) {
  return `${i.id}.${t.id}.${e.stack || e.type}`;
}
function Jc(i) {
  const { min: t, max: e, minDefined: s, maxDefined: n } = i.getUserBounds();
  return {
    min: s ? t : Number.NEGATIVE_INFINITY,
    max: n ? e : Number.POSITIVE_INFINITY
  };
}
function th(i, t, e) {
  const s = i[t] || (i[t] = {});
  return s[e] || (s[e] = {});
}
function En(i, t, e, s) {
  for (const n of t.getMatchingVisibleMetas(s).reverse()) {
    const o = i[n.index];
    if (e && o > 0 || !e && o < 0)
      return n.index;
  }
  return null;
}
function Ln(i, t) {
  const { chart: e, _cachedMeta: s } = i, n = e._stacks || (e._stacks = {}), { iScale: o, vScale: r, index: a } = s, l = o.axis, c = r.axis, h = Qc(o, r, s), d = t.length;
  let u;
  for (let f = 0; f < d; ++f) {
    const g = t[f], { [l]: p, [c]: m } = g, b = g._stacks || (g._stacks = {});
    u = b[c] = th(n, h, p), u[a] = m, u._top = En(u, r, !0, s.type), u._bottom = En(u, r, !1, s.type);
    const _ = u._visualValues || (u._visualValues = {});
    _[a] = m;
  }
}
function Ji(i, t) {
  const e = i.scales;
  return Object.keys(e).filter((s) => e[s].axis === t).shift();
}
function eh(i, t) {
  return te(i, {
    active: !1,
    dataset: void 0,
    datasetIndex: t,
    index: t,
    mode: "default",
    type: "dataset"
  });
}
function ih(i, t, e) {
  return te(i, {
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
function ye(i, t) {
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
const ts = (i) => i === "reset" || i === "none", Rn = (i, t) => t ? i : Object.assign({}, i), sh = (i, t, e) => i && !t.hidden && t._stacked && {
  keys: br(e, !0),
  values: null
};
class ae {
  constructor(t, e) {
    this.chart = t, this._ctx = t.ctx, this.index = e, this._cachedDataOpts = {}, this._cachedMeta = this.getMeta(), this._type = this._cachedMeta.type, this.options = void 0, this._parsing = !1, this._data = void 0, this._objectData = void 0, this._sharedOptions = void 0, this._drawStart = void 0, this._drawCount = void 0, this.enableOptionSharing = !1, this.supportsDecimation = !1, this.$context = void 0, this._syncList = [], this.datasetElementType = new.target.datasetElementType, this.dataElementType = new.target.dataElementType, this.initialize();
  }
  initialize() {
    const t = this._cachedMeta;
    this.configure(), this.linkScales(), t._stacked = Qi(t.vScale, t), this.addElements(), this.options.fill && !this.chart.isPluginEnabled("filler") && console.warn("Tried to use the 'fill' option without the 'Filler' plugin enabled. Please import and register the 'Filler' plugin and make sure it is not disabled in the options");
  }
  updateIndex(t) {
    this.index !== t && ye(this._cachedMeta), this.index = t;
  }
  linkScales() {
    const t = this.chart, e = this._cachedMeta, s = this.getDataset(), n = (d, u, f, g) => d === "x" ? u : d === "r" ? g : f, o = e.xAxisID = $(s.xAxisID, Ji(t, "x")), r = e.yAxisID = $(s.yAxisID, Ji(t, "y")), a = e.rAxisID = $(s.rAxisID, Ji(t, "r")), l = e.indexAxis, c = e.iAxisID = n(l, o, r, a), h = e.vAxisID = n(l, r, o, a);
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
    this._data && mn(this._data, this), t._stacked && ye(t);
  }
  _dataCheck() {
    const t = this.getDataset(), e = t.data || (t.data = []), s = this._data;
    if (O(e)) {
      const n = this._cachedMeta;
      this._data = Zc(e, n);
    } else if (s !== e) {
      if (s) {
        mn(s, this);
        const n = this._cachedMeta;
        ye(n), n._parsed = [];
      }
      e && Object.isExtensible(e) && Bl(e, this), this._syncList = [], this._data = e;
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
    e._stacked = Qi(e.vScale, e), e.stack !== s.stack && (n = !0, ye(e), e.stack = s.stack), this._resyncElements(t), (n || o !== e._stacked) && (Ln(this, e._parsed), e._stacked = Qi(e.vScale, e));
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
      W(n[t]) ? u = this.parseArrayData(s, n, t, e) : O(n[t]) ? u = this.parseObjectData(s, n, t, e) : u = this.parsePrimitiveData(s, n, t, e);
      const f = () => d[a] === null || c && d[a] < c[a];
      for (h = 0; h < e; ++h)
        s._parsed[h + t] = d = u[h], l && (f() && (l = !1), c = d);
      s._sorted = l;
    }
    r && Ln(this, u);
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
        x: o.parse(ce(f, a), u),
        y: r.parse(ce(f, l), u)
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
      keys: br(n, !0),
      values: e._stacks[t.axis]._visualValues
    };
    return Tn(a, r, o.index, {
      mode: s
    });
  }
  updateRangeFromParsed(t, e, s, n) {
    const o = s[e.axis];
    let r = o === null ? NaN : o;
    const a = n && s._stacks[e.axis];
    n && a && (n.values = a, r = Tn(n, o, this._cachedMeta.index)), t.min = Math.min(t.min, r), t.max = Math.max(t.max, r);
  }
  getMinMax(t, e) {
    const s = this._cachedMeta, n = s._parsed, o = s._sorted && t === s.iScale, r = n.length, a = this._getOtherScale(t), l = sh(e, s, this.chart), c = {
      min: Number.POSITIVE_INFINITY,
      max: Number.NEGATIVE_INFINITY
    }, { min: h, max: d } = Jc(a);
    let u, f;
    function g() {
      f = n[u];
      const p = f[a.axis];
      return !Y(f[t.axis]) || h > p || d < p;
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
      r = e[n][t.axis], Y(r) && s.push(r);
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
    this.update(t || "default"), e._clip = Gc($(this.options.clip, qc(e.xScale, e.yScale, this.getMaxOverflow())));
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
      o = r.$context || (r.$context = ih(this.getContext(), t, r)), o.parsed = this.getParsed(t), o.raw = n.data[t], o.index = o.dataIndex = t;
    } else
      o = this.$context || (this.$context = eh(this.chart.getContext(), this.index)), o.dataset = n, o.index = o.datasetIndex = this.index;
    return o.active = !!e, o.mode = s, o;
  }
  resolveDatasetElementOptions(t) {
    return this._resolveElementOptions(this.datasetElementType.id, t);
  }
  resolveDataElementOptions(t, e) {
    return this._resolveElementOptions(this.dataElementType.id, e, t);
  }
  _resolveElementOptions(t, e = "default", s) {
    const n = e === "active", o = this._cachedDataOpts, r = t + "-" + e, a = o[r], l = this.enableOptionSharing && je(s);
    if (a)
      return Rn(a, l);
    const c = this.chart.config, h = c.datasetElementScopeKeys(this._type, t), d = n ? [
      `${t}Hover`,
      "hover",
      t,
      ""
    ] : [
      t,
      ""
    ], u = c.getOptionScopes(this.getDataset(), h), f = Object.keys(B.elements[t]), g = () => this.getContext(s, n, e), p = c.resolveNamedOptions(u, f, g, d);
    return p.$shared && (p.$shared = l, o[r] = Object.freeze(Rn(p, l))), p;
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
    const c = new mr(n, l && l.animations);
    return l && l._cacheable && (o[r] = Object.freeze(c)), c;
  }
  getSharedOptions(t) {
    if (t.$shared)
      return this._sharedOptions || (this._sharedOptions = Object.assign({}, t));
  }
  includeOptions(t, e) {
    return !e || ts(t) || this.chart._animationsDisabled;
  }
  _getSharedOptions(t, e) {
    const s = this.resolveDataElementOptions(t, e), n = this._sharedOptions, o = this.getSharedOptions(s), r = this.includeOptions(e, o) || o !== n;
    return this.updateSharedOptions(o, e, s), {
      sharedOptions: o,
      includeOptions: r
    };
  }
  updateElement(t, e, s, n) {
    ts(n) ? Object.assign(t, s) : this._resolveAnimations(e, n).update(t, s);
  }
  updateSharedOptions(t, e, s) {
    t && !ts(e) && this._resolveAnimations(void 0, e).update(t, s);
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
      s._stacked && ye(s, n);
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
M(ae, "defaults", {}), M(ae, "datasetElementType", null), M(ae, "dataElementType", null);
function nh(i, t) {
  if (!i._cache.$bar) {
    const e = i.getMatchingVisibleMetas(t);
    let s = [];
    for (let n = 0, o = e.length; n < o; n++)
      s = s.concat(e[n].controller.getAllParsedValues(i));
    i._cache.$bar = Go(s.sort((n, o) => n - o));
  }
  return i._cache.$bar;
}
function oh(i) {
  const t = i.iScale, e = nh(t, i.type);
  let s = t._length, n, o, r, a;
  const l = () => {
    r === 32767 || r === -32768 || (je(a) && (s = Math.min(s, Math.abs(r - a) || s)), a = r);
  };
  for (n = 0, o = e.length; n < o; ++n)
    r = t.getPixelForValue(e[n]), l();
  for (a = void 0, n = 0, o = t.ticks.length; n < o; ++n)
    r = t.getPixelForTick(n), l();
  return s;
}
function rh(i, t, e, s) {
  const n = e.barThickness;
  let o, r;
  return R(n) ? (o = t.min * e.categoryPercentage, r = e.barPercentage) : (o = n * s, r = 1), {
    chunk: o / s,
    ratio: r,
    start: t.pixels[i] - o / 2
  };
}
function ah(i, t, e, s) {
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
function lh(i, t, e, s) {
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
function _r(i, t, e, s) {
  return W(i) ? lh(i, t, e, s) : t[e.axis] = e.parse(i, s), t;
}
function In(i, t, e, s) {
  const n = i.iScale, o = i.vScale, r = n.getLabels(), a = n === o, l = [];
  let c, h, d, u;
  for (c = e, h = e + s; c < h; ++c)
    u = t[c], d = {}, d[n.axis] = a || n.parse(r[c], c), l.push(_r(u, d, o, c));
  return l;
}
function es(i) {
  return i && i.barStart !== void 0 && i.barEnd !== void 0;
}
function ch(i, t, e) {
  return i !== 0 ? ft(i) : (t.isHorizontal() ? 1 : -1) * (t.min >= e ? 1 : -1);
}
function hh(i) {
  let t, e, s, n, o;
  return i.horizontal ? (t = i.base > i.x, e = "left", s = "right") : (t = i.base < i.y, e = "bottom", s = "top"), t ? (n = "end", o = "start") : (n = "start", o = "end"), {
    start: e,
    end: s,
    reverse: t,
    top: n,
    bottom: o
  };
}
function dh(i, t, e, s) {
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
  const { start: r, end: a, reverse: l, top: c, bottom: h } = hh(i);
  n === "middle" && e && (i.enableBorderRadius = !0, (e._top || 0) === s ? n = c : (e._bottom || 0) === s ? n = h : (o[Fn(h, r, a, l)] = !0, n = c)), o[Fn(n, r, a, l)] = !0, i.borderSkipped = o;
}
function Fn(i, t, e, s) {
  return s ? (i = uh(i, t, e), i = zn(i, e, t)) : i = zn(i, t, e), i;
}
function uh(i, t, e) {
  return i === t ? e : i === e ? t : i;
}
function zn(i, t, e) {
  return i === "start" ? t : i === "end" ? e : i;
}
function fh(i, { inflateAmount: t }, e) {
  i.inflateAmount = t === "auto" ? e === 1 ? 0.33 : 0 : t;
}
class Re extends ae {
  parsePrimitiveData(t, e, s, n) {
    return In(t, e, s, n);
  }
  parseArrayData(t, e, s, n) {
    return In(t, e, s, n);
  }
  parseObjectData(t, e, s, n) {
    const { iScale: o, vScale: r } = t, { xAxisKey: a = "x", yAxisKey: l = "y" } = this._parsing, c = o.axis === "x" ? a : l, h = r.axis === "x" ? a : l, d = [];
    let u, f, g, p;
    for (u = s, f = s + n; u < f; ++u)
      p = e[u], g = {}, g[o.axis] = o.parse(ce(p, c), u), d.push(_r(ce(p, h), g, r, u));
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
    const e = this._cachedMeta, { iScale: s, vScale: n } = e, o = this.getParsed(t), r = o._custom, a = es(r) ? "[" + r.start + ", " + r.end + "]" : "" + n.getLabelForValue(o[n.axis]);
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
      const g = this.getParsed(f), p = o || R(g[a.axis]) ? {
        base: l,
        head: l
      } : this._calculateBarValuePixels(f), m = this._calculateBarIndexPixels(f, h), b = (g._stacks || {})[a.axis], _ = {
        horizontal: c,
        base: p.base,
        enableBorderRadius: !b || es(g._custom) || r === b._top || r === b._bottom,
        x: c ? p.head : m.center,
        y: c ? m.center : p.head,
        height: c ? m.size : Math.abs(p.size),
        width: c ? Math.abs(p.size) : m.size
      };
      u && (_.options = d || this.resolveDataElementOptions(f, t[f].active ? "active" : n));
      const x = _.options || t[f].options;
      dh(_, x, b, r), fh(_, x, h.ratio), this.updateElement(t[f], f, _, n);
    }
  }
  _getStacks(t, e) {
    const { iScale: s } = this._cachedMeta, n = s.getMatchingVisibleMetas(this._type).filter((h) => h.controller.options.grouped), o = s.options.stacked, r = [], a = this._cachedMeta.controller.getParsed(e), l = a && a[s.axis], c = (h) => {
      const d = h._parsed.find((f) => f[s.axis] === l), u = d && d[h.vScale.axis];
      if (R(u) || isNaN(u))
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
      min: a || oh(e),
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
    const { _cachedMeta: { vScale: e, _stacked: s, index: n }, options: { base: o, minBarLength: r } } = this, a = o || 0, l = this.getParsed(t), c = l._custom, h = es(c);
    let d = l[e.axis], u = 0, f = s ? this.applyStack(e, l, s) : d, g, p;
    f !== d && (u = f - d, f = d), h && (d = c.barStart, f = c.barEnd - c.barStart, d !== 0 && ft(d) !== ft(c.barEnd) && (u = 0), u += d);
    const m = !R(o) && !h ? o : u;
    let b = e.getPixelForValue(m);
    if (this.chart.getDataVisibility(t) ? g = e.getPixelForValue(u + f) : g = b, p = g - b, Math.abs(p) < r) {
      p = ch(p, e, a) * r, d === a && (b -= p / 2);
      const _ = e.getPixelForDecimal(0), x = e.getPixelForDecimal(1), v = Math.min(_, x), y = Math.max(_, x);
      b = Math.max(Math.min(b, y), v), g = b + p, s && !h && (l._stacks[e.axis]._visualValues[n] = e.getValueForPixel(g) - e.getValueForPixel(b));
    }
    if (b === e.getPixelForValue(a)) {
      const _ = ft(p) * e.getLineWidthForValue(a) / 2;
      b += _, p -= _;
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
      const h = o ? this._getStackCount(t) : e.stackCount, d = n.barThickness === "flex" ? ah(t, e, n, h * c) : rh(t, e, n, h * c), u = this.chart.options.indexAxis === "x" ? this.getDataset().xAxisID : this.getDataset().yAxisID, f = this._getAxis().indexOf($(u, this.getFirstScaleIdForIndexAxis())), g = this._getStackIndex(this.index, this._cachedMeta.stack, o ? t : void 0) + f;
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
M(Re, "id", "bar"), M(Re, "defaults", {
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
}), M(Re, "overrides", {
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
class gi extends ae {
  initialize() {
    this.enableOptionSharing = !0, this.supportsDecimation = !0, super.initialize();
  }
  update(t) {
    const e = this._cachedMeta, { dataset: s, data: n = [], _dataset: o } = e, r = this.chart._animationsDisabled;
    let { start: a, count: l } = Wl(e, n, r);
    this._drawStart = a, this._drawCount = l, jl(e) && (a = 0, l = n.length), s._chart = this.chart, s._datasetIndex = this.index, s._decimated = !!o._decimated, s.points = n;
    const c = this.resolveDatasetElementOptions(t);
    this.options.showLine || (c.borderWidth = 0), c.segment = this.options.segment, this.updateElement(s, void 0, {
      animated: !r,
      options: c
    }, t), this.updateElements(n, a, l, t);
  }
  updateElements(t, e, s, n) {
    const o = n === "reset", { iScale: r, vScale: a, _stacked: l, _dataset: c } = this._cachedMeta, { sharedOptions: h, includeOptions: d } = this._getSharedOptions(e, n), u = r.axis, f = a.axis, { spanGaps: g, segment: p } = this.options, m = Ve(g) ? g : Number.POSITIVE_INFINITY, b = this.chart._animationsDisabled || o || n === "none", _ = e + s, x = t.length;
    let v = e > 0 && this.getParsed(e - 1);
    for (let y = 0; y < x; ++y) {
      const k = t[y], S = b ? k : {};
      if (y < e || y >= _) {
        S.skip = !0;
        continue;
      }
      const w = this.getParsed(y), A = R(w[f]), T = S[u] = r.getPixelForValue(w[u], y), C = S[f] = o || A ? a.getBasePixel() : a.getPixelForValue(l ? this.applyStack(a, w, l) : w[f], y);
      S.skip = isNaN(T) || isNaN(C) || A, S.stop = y > 0 && Math.abs(w[u] - v[u]) > m, p && (S.parsed = w, S.raw = c.data[y]), d && (S.options = h || this.resolveDataElementOptions(y, k.active ? "active" : n)), b || this.updateElement(k, y, S, n), v = w;
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
M(gi, "id", "line"), M(gi, "defaults", {
  datasetElementType: "line",
  dataElementType: "point",
  showLine: !0,
  spanGaps: !1
}), M(gi, "overrides", {
  scales: {
    _index_: {
      type: "category"
    },
    _value_: {
      type: "linear"
    }
  }
});
function jt() {
  throw new Error("This method is not implemented: Check that a complete date adapter is provided.");
}
class zs {
  constructor(t) {
    M(this, "options");
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
    Object.assign(zs.prototype, t);
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  init() {
  }
  formats() {
    return jt();
  }
  parse() {
    return jt();
  }
  format() {
    return jt();
  }
  add() {
    return jt();
  }
  diff() {
    return jt();
  }
  startOf() {
    return jt();
  }
  endOf() {
    return jt();
  }
}
var ph = {
  _date: zs
};
function gh(i, t, e, s) {
  const { controller: n, data: o, _sorted: r } = i, a = n._cachedMeta.iScale, l = i.dataset && i.dataset.options ? i.dataset.options.spanGaps : null;
  if (a && t === a.axis && t !== "r" && r && o.length) {
    const c = a._reversePixels ? Fl : qt;
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
        const { vScale: d } = n._cachedMeta, { _parsed: u } = i, f = u.slice(0, h.lo + 1).reverse().findIndex((p) => !R(p[d.axis]));
        h.lo -= Math.max(0, f);
        const g = u.slice(h.hi).findIndex((p) => !R(p[d.axis]));
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
function Ni(i, t, e, s, n) {
  const o = i.getSortedVisibleDatasetMetas(), r = e[t];
  for (let a = 0, l = o.length; a < l; ++a) {
    const { index: c, data: h } = o[a], { lo: d, hi: u } = gh(o[a], t, r, n);
    for (let f = d; f <= u; ++f) {
      const g = h[f];
      g.skip || s(g, c, f);
    }
  }
}
function mh(i) {
  const t = i.indexOf("x") !== -1, e = i.indexOf("y") !== -1;
  return function(s, n) {
    const o = t ? Math.abs(s.x - n.x) : 0, r = e ? Math.abs(s.y - n.y) : 0;
    return Math.sqrt(Math.pow(o, 2) + Math.pow(r, 2));
  };
}
function is(i, t, e, s, n) {
  const o = [];
  return !n && !i.isPointInArea(t) || Ni(i, e, t, function(a, l, c) {
    !n && !Ue(a, i.chartArea, 0) || a.inRange(t.x, t.y, s) && o.push({
      element: a,
      datasetIndex: l,
      index: c
    });
  }, !0), o;
}
function bh(i, t, e, s) {
  let n = [];
  function o(r, a, l) {
    const { startAngle: c, endAngle: h } = r.getProps([
      "startAngle",
      "endAngle"
    ], s), { angle: d } = Ll(r, {
      x: t.x,
      y: t.y
    });
    Xo(d, c, h) && n.push({
      element: r,
      datasetIndex: a,
      index: l
    });
  }
  return Ni(i, e, t, o), n;
}
function _h(i, t, e, s, n, o) {
  let r = [];
  const a = mh(e);
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
  return Ni(i, e, t, c), r;
}
function ss(i, t, e, s, n, o) {
  return !o && !i.isPointInArea(t) ? [] : e === "r" && !s ? bh(i, t, e, n) : _h(i, t, e, s, n, o);
}
function Bn(i, t, e, s, n) {
  const o = [], r = e === "x" ? "inXRange" : "inYRange";
  let a = !1;
  return Ni(i, e, t, (l, c, h) => {
    l[r] && l[r](t[e], n) && (o.push({
      element: l,
      datasetIndex: c,
      index: h
    }), a = a || l.inRange(t.x, t.y, n));
  }), s && !a ? [] : o;
}
var yh = {
  modes: {
    index(i, t, e, s) {
      const n = Ut(t, i), o = e.axis || "x", r = e.includeInvisible || !1, a = e.intersect ? is(i, n, o, s, r) : ss(i, n, o, !1, s, r), l = [];
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
      const n = Ut(t, i), o = e.axis || "xy", r = e.includeInvisible || !1;
      let a = e.intersect ? is(i, n, o, s, r) : ss(i, n, o, !1, s, r);
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
      const n = Ut(t, i), o = e.axis || "xy", r = e.includeInvisible || !1;
      return is(i, n, o, s, r);
    },
    nearest(i, t, e, s) {
      const n = Ut(t, i), o = e.axis || "xy", r = e.includeInvisible || !1;
      return ss(i, n, o, e.intersect, s, r);
    },
    x(i, t, e, s) {
      const n = Ut(t, i);
      return Bn(i, n, "x", e.intersect, s);
    },
    y(i, t, e, s) {
      const n = Ut(t, i);
      return Bn(i, n, "y", e.intersect, s);
    }
  }
};
const yr = [
  "left",
  "top",
  "right",
  "bottom"
];
function xe(i, t) {
  return i.filter((e) => e.pos === t);
}
function Hn(i, t) {
  return i.filter((e) => yr.indexOf(e.pos) === -1 && e.box.axis === t);
}
function ve(i, t) {
  return i.sort((e, s) => {
    const n = t ? s : e, o = t ? e : s;
    return n.weight === o.weight ? n.index - o.index : n.weight - o.weight;
  });
}
function xh(i) {
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
function vh(i) {
  const t = {};
  for (const e of i) {
    const { stack: s, pos: n, stackWeight: o } = e;
    if (!s || !yr.includes(n))
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
function wh(i, t) {
  const e = vh(i), { vBoxMaxWidth: s, hBoxMaxHeight: n } = t;
  let o, r, a;
  for (o = 0, r = i.length; o < r; ++o) {
    a = i[o];
    const { fullSize: l } = a.box, c = e[a.stack], h = c && a.stackWeight / c.weight;
    a.horizontal ? (a.width = h ? h * s : l && t.availableWidth, a.height = n) : (a.width = s, a.height = h ? h * n : l && t.availableHeight);
  }
  return e;
}
function Sh(i) {
  const t = xh(i), e = ve(t.filter((c) => c.box.fullSize), !0), s = ve(xe(t, "left"), !0), n = ve(xe(t, "right")), o = ve(xe(t, "top"), !0), r = ve(xe(t, "bottom")), a = Hn(t, "x"), l = Hn(t, "y");
  return {
    fullSize: e,
    leftAndTop: s.concat(o),
    rightAndBottom: n.concat(l).concat(r).concat(a),
    chartArea: xe(t, "chartArea"),
    vertical: s.concat(n).concat(l),
    horizontal: o.concat(r).concat(a)
  };
}
function Nn(i, t, e, s) {
  return Math.max(i[e], t[e]) + Math.max(i[s], t[s]);
}
function xr(i, t) {
  i.top = Math.max(i.top, t.top), i.left = Math.max(i.left, t.left), i.bottom = Math.max(i.bottom, t.bottom), i.right = Math.max(i.right, t.right);
}
function kh(i, t, e, s) {
  const { pos: n, box: o } = e, r = i.maxPadding;
  if (!O(n)) {
    e.size && (i[n] -= e.size);
    const d = s[e.stack] || {
      size: 0,
      count: 1
    };
    d.size = Math.max(d.size, e.horizontal ? o.height : o.width), e.size = d.size / d.count, i[n] += e.size;
  }
  o.getPadding && xr(r, o.getPadding());
  const a = Math.max(0, t.outerWidth - Nn(r, i, "left", "right")), l = Math.max(0, t.outerHeight - Nn(r, i, "top", "bottom")), c = a !== i.w, h = l !== i.h;
  return i.w = a, i.h = l, e.horizontal ? {
    same: c,
    other: h
  } : {
    same: h,
    other: c
  };
}
function Mh(i) {
  const t = i.maxPadding;
  function e(s) {
    const n = Math.max(t[s] - i[s], 0);
    return i[s] += n, n;
  }
  i.y += e("top"), i.x += e("left"), e("right"), e("bottom");
}
function Ph(i, t) {
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
function Me(i, t, e, s) {
  const n = [];
  let o, r, a, l, c, h;
  for (o = 0, r = i.length, c = 0; o < r; ++o) {
    a = i[o], l = a.box, l.update(a.width || t.w, a.height || t.h, Ph(a.horizontal, t));
    const { same: d, other: u } = kh(t, e, a, s);
    c |= d && n.length, h = h || u, l.fullSize || n.push(a);
  }
  return c && Me(n, t, e, s) || h;
}
function li(i, t, e, s, n) {
  i.top = e, i.left = t, i.right = t + s, i.bottom = e + n, i.width = s, i.height = n;
}
function Wn(i, t, e, s) {
  const n = e.padding;
  let { x: o, y: r } = t;
  for (const a of i) {
    const l = a.box, c = s[a.stack] || {
      placed: 0,
      weight: 1
    }, h = a.stackWeight / c.weight || 1;
    if (a.horizontal) {
      const d = t.w * h, u = c.size || l.height;
      je(c.start) && (r = c.start), l.fullSize ? li(l, n.left, r, e.outerWidth - n.right - n.left, u) : li(l, t.left + c.placed, r, d, u), c.start = r, c.placed += d, r = l.bottom;
    } else {
      const d = t.h * h, u = c.size || l.width;
      je(c.start) && (o = c.start), l.fullSize ? li(l, o, n.top, u, e.outerHeight - n.bottom - n.top) : li(l, o, t.top + c.placed, u, d), c.start = o, c.placed += d, o = l.right;
    }
  }
  t.x = o, t.y = r;
}
var Mt = {
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
    const n = at(i.options.layout.padding), o = Math.max(t - n.width, 0), r = Math.max(e - n.height, 0), a = Sh(i.boxes), l = a.vertical, c = a.horizontal;
    I(i.boxes, (p) => {
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
    xr(u, at(s));
    const f = Object.assign({
      maxPadding: u,
      w: o,
      h: r,
      x: n.left,
      y: n.top
    }, n), g = wh(l.concat(c), d);
    Me(a.fullSize, f, d, g), Me(l, f, d, g), Me(c, f, d, g) && Me(l, f, d, g), Mh(f), Wn(a.leftAndTop, f, d, g), f.x += f.w, f.y += f.h, Wn(a.rightAndBottom, f, d, g), i.chartArea = {
      left: f.left,
      top: f.top,
      right: f.left + f.w,
      bottom: f.top + f.h,
      height: f.h,
      width: f.w
    }, I(a.chartArea, (p) => {
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
class vr {
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
class Ah extends vr {
  acquireContext(t) {
    return t && t.getContext && t.getContext("2d") || null;
  }
  updateConfig(t) {
    t.options.animation = !1;
  }
}
const mi = "$chartjs", $h = {
  touchstart: "mousedown",
  touchmove: "mousemove",
  touchend: "mouseup",
  pointerenter: "mouseenter",
  pointerdown: "mousedown",
  pointermove: "mousemove",
  pointerup: "mouseup",
  pointerleave: "mouseout",
  pointerout: "mouseout"
}, jn = (i) => i === null || i === "";
function Ch(i, t) {
  const e = i.style, s = i.getAttribute("height"), n = i.getAttribute("width");
  if (i[mi] = {
    initial: {
      height: s,
      width: n,
      style: {
        display: e.display,
        height: e.height,
        width: e.width
      }
    }
  }, e.display = e.display || "block", e.boxSizing = e.boxSizing || "border-box", jn(n)) {
    const o = Pn(i, "width");
    o !== void 0 && (i.width = o);
  }
  if (jn(s))
    if (i.style.height === "")
      i.height = i.width / (t || 2);
    else {
      const o = Pn(i, "height");
      o !== void 0 && (i.height = o);
    }
  return i;
}
const wr = Tc ? {
  passive: !0
} : !1;
function Oh(i, t, e) {
  i && i.addEventListener(t, e, wr);
}
function Dh(i, t, e) {
  i && i.canvas && i.canvas.removeEventListener(t, e, wr);
}
function Th(i, t) {
  const e = $h[i.type] || i.type, { x: s, y: n } = Ut(i, t);
  return {
    type: e,
    chart: t,
    native: i,
    x: s !== void 0 ? s : null,
    y: n !== void 0 ? n : null
  };
}
function Di(i, t) {
  for (const e of i)
    if (e === t || e.contains(t))
      return !0;
}
function Eh(i, t, e) {
  const s = i.canvas, n = new MutationObserver((o) => {
    let r = !1;
    for (const a of o)
      r = r || Di(a.addedNodes, s), r = r && !Di(a.removedNodes, s);
    r && e();
  });
  return n.observe(document, {
    childList: !0,
    subtree: !0
  }), n;
}
function Lh(i, t, e) {
  const s = i.canvas, n = new MutationObserver((o) => {
    let r = !1;
    for (const a of o)
      r = r || Di(a.removedNodes, s), r = r && !Di(a.addedNodes, s);
    r && e();
  });
  return n.observe(document, {
    childList: !0,
    subtree: !0
  }), n;
}
const Ye = /* @__PURE__ */ new Map();
let Vn = 0;
function Sr() {
  const i = window.devicePixelRatio;
  i !== Vn && (Vn = i, Ye.forEach((t, e) => {
    e.currentDevicePixelRatio !== i && t();
  }));
}
function Rh(i, t) {
  Ye.size || window.addEventListener("resize", Sr), Ye.set(i, t);
}
function Ih(i) {
  Ye.delete(i), Ye.size || window.removeEventListener("resize", Sr);
}
function Fh(i, t, e) {
  const s = i.canvas, n = s && Fs(s);
  if (!n)
    return;
  const o = Qo((a, l) => {
    const c = n.clientWidth;
    e(a, l), c < n.clientWidth && e();
  }, window), r = new ResizeObserver((a) => {
    const l = a[0], c = l.contentRect.width, h = l.contentRect.height;
    c === 0 && h === 0 || o(c, h);
  });
  return r.observe(n), Rh(i, o), r;
}
function ns(i, t, e) {
  e && e.disconnect(), t === "resize" && Ih(i);
}
function zh(i, t, e) {
  const s = i.canvas, n = Qo((o) => {
    i.ctx !== null && e(Th(o, i));
  }, i);
  return Oh(s, t, n), n;
}
class Bh extends vr {
  acquireContext(t, e) {
    const s = t && t.getContext && t.getContext("2d");
    return s && s.canvas === t ? (Ch(t, e), s) : null;
  }
  releaseContext(t) {
    const e = t.canvas;
    if (!e[mi])
      return !1;
    const s = e[mi].initial;
    [
      "height",
      "width"
    ].forEach((o) => {
      const r = s[o];
      R(r) ? e.removeAttribute(o) : e.setAttribute(o, r);
    });
    const n = s.style || {};
    return Object.keys(n).forEach((o) => {
      e.style[o] = n[o];
    }), e.width = e.width, delete e[mi], !0;
  }
  addEventListener(t, e, s) {
    this.removeEventListener(t, e);
    const n = t.$proxies || (t.$proxies = {}), r = {
      attach: Eh,
      detach: Lh,
      resize: Fh
    }[e] || zh;
    n[e] = r(t, e, s);
  }
  removeEventListener(t, e) {
    const s = t.$proxies || (t.$proxies = {}), n = s[e];
    if (!n)
      return;
    ({
      attach: ns,
      detach: ns,
      resize: ns
    }[e] || Dh)(t, e, n), s[e] = void 0;
  }
  getDevicePixelRatio() {
    return window.devicePixelRatio;
  }
  getMaximumSize(t, e, s, n) {
    return Dc(t, e, s, n);
  }
  isAttached(t) {
    const e = t && Fs(t);
    return !!(e && e.isConnected);
  }
}
function Hh(i) {
  return !Is() || typeof OffscreenCanvas < "u" && i instanceof OffscreenCanvas ? Ah : Bh;
}
class xt {
  constructor() {
    M(this, "x");
    M(this, "y");
    M(this, "active", !1);
    M(this, "options");
    M(this, "$animations");
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
    return Ve(this.x) && Ve(this.y);
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
M(xt, "defaults", {}), M(xt, "defaultRoutes");
function Nh(i, t) {
  const e = i.options.ticks, s = Wh(i), n = Math.min(e.maxTicksLimit || s, s), o = e.major.enabled ? Vh(t) : [], r = o.length, a = o[0], l = o[r - 1], c = [];
  if (r > n)
    return Uh(t, c, o, r / n), c;
  const h = jh(o, t, n);
  if (r > 0) {
    let d, u;
    const f = r > 1 ? Math.round((l - a) / (r - 1)) : null;
    for (ci(t, c, h, R(f) ? 0 : a - f, a), d = 0, u = r - 1; d < u; d++)
      ci(t, c, h, o[d], o[d + 1]);
    return ci(t, c, h, l, R(f) ? t.length : l + f), c;
  }
  return ci(t, c, h), c;
}
function Wh(i) {
  const t = i.options.offset, e = i._tickSize(), s = i._length / e + (t ? 0 : 1), n = i._maxLength / e;
  return Math.floor(Math.min(s, n));
}
function jh(i, t, e) {
  const s = Yh(i), n = t.length / e;
  if (!s)
    return Math.max(n, 1);
  const o = Cl(s);
  for (let r = 0, a = o.length - 1; r < a; r++) {
    const l = o[r];
    if (l > n)
      return l;
  }
  return Math.max(n, 1);
}
function Vh(i) {
  const t = [];
  let e, s;
  for (e = 0, s = i.length; e < s; e++)
    i[e].major && t.push(e);
  return t;
}
function Uh(i, t, e, s) {
  let n = 0, o = e[0], r;
  for (s = Math.ceil(s), r = 0; r < i.length; r++)
    r === o && (t.push(i[r]), n++, o = e[n * s]);
}
function ci(i, t, e, s, n) {
  const o = $(s, 0), r = Math.min($(n, i.length), i.length);
  let a = 0, l, c, h;
  for (e = Math.ceil(e), n && (l = n - s, e = l / Math.floor(l / e)), h = o; h < 0; )
    a++, h = Math.round(o + a * e);
  for (c = Math.max(o, 0); c < r; c++)
    c === h && (t.push(i[c]), a++, h = Math.round(o + a * e));
}
function Yh(i) {
  const t = i.length;
  let e, s;
  if (t < 2)
    return !1;
  for (s = i[0], e = 1; e < t; ++e)
    if (i[e] - i[e - 1] !== s)
      return !1;
  return s;
}
const Kh = (i) => i === "left" ? "right" : i === "right" ? "left" : i, Un = (i, t, e) => t === "top" || t === "left" ? i[t] + e : i[t] - e, Yn = (i, t) => Math.min(t || i, i);
function Kn(i, t) {
  const e = [], s = i.length / t, n = i.length;
  let o = 0;
  for (; o < n; o += s)
    e.push(i[Math.floor(o)]);
  return e;
}
function Xh(i, t, e) {
  const s = i.ticks.length, n = Math.min(t, s - 1), o = i._startPixel, r = i._endPixel, a = 1e-6;
  let l = i.getPixelForTick(n), c;
  if (!(e && (s === 1 ? c = Math.max(l - o, r - l) : t === 0 ? c = (i.getPixelForTick(1) - l) / 2 : c = (l - i.getPixelForTick(n - 1)) / 2, l += n < t ? c : -c, l < o - a || l > r + a)))
    return l;
}
function qh(i, t) {
  I(i, (e) => {
    const s = e.gc, n = s.length / 2;
    let o;
    if (n > t) {
      for (o = 0; o < n; ++o)
        delete e.data[s[o]];
      s.splice(0, n);
    }
  });
}
function we(i) {
  return i.drawTicks ? i.tickLength : 0;
}
function Xn(i, t) {
  if (!i.display)
    return 0;
  const e = Z(i.font, t), s = at(i.padding);
  return (W(i.text) ? i.text.length : 1) * e.lineHeight + s.height;
}
function Gh(i, t) {
  return te(i, {
    scale: t,
    type: "scale"
  });
}
function Zh(i, t, e) {
  return te(i, {
    tick: e,
    index: t,
    type: "tick"
  });
}
function Qh(i, t, e) {
  let s = Jo(i);
  return (e && t !== "right" || !e && t === "right") && (s = Kh(s)), s;
}
function Jh(i, t, e, s) {
  const { top: n, left: o, bottom: r, right: a, chart: l } = i, { chartArea: c, scales: h } = l;
  let d = 0, u, f, g;
  const p = r - n, m = a - o;
  if (i.isHorizontal()) {
    if (f = J(s, o, a), O(e)) {
      const b = Object.keys(e)[0], _ = e[b];
      g = h[b].getPixelForValue(_) + p - t;
    } else e === "center" ? g = (c.bottom + c.top) / 2 + p - t : g = Un(i, e, t);
    u = a - o;
  } else {
    if (O(e)) {
      const b = Object.keys(e)[0], _ = e[b];
      f = h[b].getPixelForValue(_) - m + t;
    } else e === "center" ? f = (c.left + c.right) / 2 - m + t : f = Un(i, e, t);
    g = J(s, r, n), d = e === "left" ? -ot : ot;
  }
  return {
    titleX: f,
    titleY: g,
    maxWidth: u,
    rotation: d
  };
}
class pe extends xt {
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
    return t = ct(t, Number.POSITIVE_INFINITY), e = ct(e, Number.NEGATIVE_INFINITY), s = ct(s, Number.POSITIVE_INFINITY), n = ct(n, Number.NEGATIVE_INFINITY), {
      min: ct(t, s),
      max: ct(e, n),
      minDefined: Y(t),
      maxDefined: Y(e)
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
      min: ct(e, ct(s, e)),
      max: ct(s, ct(e, s))
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
    }, s), this.ticks = null, this._labelSizes = null, this._gridLineItems = null, this._labelItems = null, this.beforeSetDimensions(), this.setDimensions(), this.afterSetDimensions(), this._maxLength = this.isHorizontal() ? this.width + s.left + s.right : this.height + s.top + s.bottom, this._dataLimitsCached || (this.beforeDataLimits(), this.determineDataLimits(), this.afterDataLimits(), this._range = cc(this, o, n), this._dataLimitsCached = !0), this.beforeBuildTicks(), this.ticks = this.buildTicks() || [], this.afterBuildTicks();
    const l = a < this.ticks.length;
    this._convertTicksToLabels(l ? Kn(this.ticks, a) : this.ticks), this.configure(), this.beforeCalculateLabelRotation(), this.calculateLabelRotation(), this.afterCalculateLabelRotation(), r.display && (r.autoSkip || r.source === "auto") && (this.ticks = Nh(this, this.ticks), this._labelSizes = null, this.afterAutoSkip()), l && this._convertTicksToLabels(this.ticks), this.beforeFit(), this.fit(), this.afterFit(), this.afterUpdate();
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
    const t = this.options, e = t.ticks, s = Yn(this.ticks.length, t.ticks.maxTicksLimit), n = e.minRotation || 0, o = e.maxRotation;
    let r = n, a, l, c;
    if (!this._isVisible() || !e.display || n >= o || s <= 1 || !this.isHorizontal()) {
      this.labelRotation = n;
      return;
    }
    const h = this._getLabelSizes(), d = h.widest.width, u = h.highest.height, f = et(this.chart.width - d, 0, this.maxWidth);
    a = t.offset ? this.maxWidth / s : f / (s - 1), d + 6 > a && (a = f / (s - (t.offset ? 0.5 : 1)), l = this.maxHeight - we(t.grid) - e.padding - Xn(t.title, this.chart.options.font), c = Math.sqrt(d * d + u * u), r = El(Math.min(Math.asin(et((h.highest.height + 6) / a, -1, 1)), Math.asin(et(l / c, -1, 1)) - Math.asin(et(u / c, -1, 1)))), r = Math.max(n, Math.min(o, r))), this.labelRotation = r;
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
      const l = Xn(n, e.options.font);
      if (a ? (t.width = this.maxWidth, t.height = we(o) + l) : (t.height = this.maxHeight, t.width = we(o) + l), s.display && this.ticks.length) {
        const { first: c, last: h, widest: d, highest: u } = this._getLabelSizes(), f = s.padding * 2, g = Xt(this.labelRotation), p = Math.cos(g), m = Math.sin(g);
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
      R(t[e].label) && (t.splice(e, 1), s--, e--);
    this.afterTickToLabelConversion();
  }
  _getLabelSizes() {
    let t = this._labelSizes;
    if (!t) {
      const e = this.options.ticks.sampleSize;
      let s = this.ticks;
      e < s.length && (s = Kn(s, e)), this._labelSizes = t = this._computeLabelSizes(s, s.length, this.options.ticks.maxTicksLimit);
    }
    return t;
  }
  _computeLabelSizes(t, e, s) {
    const { ctx: n, _longestTextCache: o } = this, r = [], a = [], l = Math.floor(e / Yn(e, s));
    let c = 0, h = 0, d, u, f, g, p, m, b, _, x, v, y;
    for (d = 0; d < e; d += l) {
      if (g = t[d].label, p = this._resolveTickFontOptions(d), n.font = m = p.string, b = o[m] = o[m] || {
        data: {},
        gc: []
      }, _ = p.lineHeight, x = v = 0, !R(g) && !W(g))
        x = vn(n, b.data, b.gc, x, g), v = _;
      else if (W(g))
        for (u = 0, f = g.length; u < f; ++u)
          y = g[u], !R(y) && !W(y) && (x = vn(n, b.data, b.gc, x, y), v += _);
      r.push(x), a.push(v), c = Math.max(x, c), h = Math.max(v, h);
    }
    qh(o, e);
    const k = r.indexOf(c), S = a.indexOf(h), w = (A) => ({
      width: r[A] || 0,
      height: a[A] || 0
    });
    return {
      first: w(0),
      last: w(e - 1),
      widest: w(k),
      highest: w(S),
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
    return Il(this._alignToPixels ? Wt(this.chart, e, 0) : e);
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
      return s.$context || (s.$context = Zh(this.getContext(), t, s));
    }
    return this.$context || (this.$context = Gh(this.chart.getContext(), this));
  }
  _tickSize() {
    const t = this.options.ticks, e = Xt(this.labelRotation), s = Math.abs(Math.cos(e)), n = Math.abs(Math.sin(e)), o = this._getLabelSizes(), r = t.autoSkipPadding || 0, a = o ? o.widest.width + r : 0, l = o ? o.highest.height + r : 0;
    return this.isHorizontal() ? l * s > a * n ? a / s : l / n : l * n < a * s ? l / s : a / n;
  }
  _isVisible() {
    const t = this.options.display;
    return t !== "auto" ? !!t : this.getMatchingVisibleMetas().length > 0;
  }
  _computeGridLineItems(t) {
    const e = this.axis, s = this.chart, n = this.options, { grid: o, position: r, border: a } = n, l = o.offset, c = this.isHorizontal(), d = this.ticks.length + (l ? 1 : 0), u = we(o), f = [], g = a.setContext(this.getContext()), p = g.display ? g.width : 0, m = p / 2, b = function(V) {
      return Wt(s, V, p);
    };
    let _, x, v, y, k, S, w, A, T, C, E, X;
    if (r === "top")
      _ = b(this.bottom), S = this.bottom - u, A = _ - m, C = b(t.top) + m, X = t.bottom;
    else if (r === "bottom")
      _ = b(this.top), C = t.top, X = b(t.bottom) - m, S = _ + m, A = this.top + u;
    else if (r === "left")
      _ = b(this.right), k = this.right - u, w = _ - m, T = b(t.left) + m, E = t.right;
    else if (r === "right")
      _ = b(this.left), T = t.left, E = b(t.right) - m, k = _ + m, w = this.left + u;
    else if (e === "x") {
      if (r === "center")
        _ = b((t.top + t.bottom) / 2 + 0.5);
      else if (O(r)) {
        const V = Object.keys(r)[0], it = r[V];
        _ = b(this.chart.scales[V].getPixelForValue(it));
      }
      C = t.top, X = t.bottom, S = _ + m, A = S + u;
    } else if (e === "y") {
      if (r === "center")
        _ = b((t.left + t.right) / 2);
      else if (O(r)) {
        const V = Object.keys(r)[0], it = r[V];
        _ = b(this.chart.scales[V].getPixelForValue(it));
      }
      k = _ - m, w = k - u, T = t.left, E = t.right;
    }
    const lt = $(n.ticks.maxTicksLimit, d), z = Math.max(1, Math.ceil(d / lt));
    for (x = 0; x < d; x += z) {
      const V = this.getContext(x), it = o.setContext(V), Ze = a.setContext(V), Qe = it.lineWidth, ee = it.color, Je = Ze.dash || [], ie = Ze.dashOffset, ge = it.tickWidth, Ft = it.tickColor, me = it.tickBorderDash || [], zt = it.tickBorderDashOffset;
      v = Xh(this, x, l), v !== void 0 && (y = Wt(s, v, Qe), c ? k = w = T = E = y : S = A = C = X = y, f.push({
        tx1: k,
        ty1: S,
        tx2: w,
        ty2: A,
        x1: T,
        y1: C,
        x2: E,
        y2: X,
        width: Qe,
        color: ee,
        borderDash: Je,
        borderDashOffset: ie,
        tickWidth: ge,
        tickColor: Ft,
        tickBorderDash: me,
        tickBorderDashOffset: zt
      }));
    }
    return this._ticksLength = d, this._borderValue = _, f;
  }
  _computeLabelItems(t) {
    const e = this.axis, s = this.options, { position: n, ticks: o } = s, r = this.isHorizontal(), a = this.ticks, { align: l, crossAlign: c, padding: h, mirror: d } = o, u = we(s.grid), f = u + h, g = d ? -h : f, p = -Xt(this.labelRotation), m = [];
    let b, _, x, v, y, k, S, w, A, T, C, E, X = "middle";
    if (n === "top")
      k = this.bottom - g, S = this._getXAxisLabelAlignment();
    else if (n === "bottom")
      k = this.top + g, S = this._getXAxisLabelAlignment();
    else if (n === "left") {
      const z = this._getYAxisLabelAlignment(u);
      S = z.textAlign, y = z.x;
    } else if (n === "right") {
      const z = this._getYAxisLabelAlignment(u);
      S = z.textAlign, y = z.x;
    } else if (e === "x") {
      if (n === "center")
        k = (t.top + t.bottom) / 2 + f;
      else if (O(n)) {
        const z = Object.keys(n)[0], V = n[z];
        k = this.chart.scales[z].getPixelForValue(V) + f;
      }
      S = this._getXAxisLabelAlignment();
    } else if (e === "y") {
      if (n === "center")
        y = (t.left + t.right) / 2 - f;
      else if (O(n)) {
        const z = Object.keys(n)[0], V = n[z];
        y = this.chart.scales[z].getPixelForValue(V);
      }
      S = this._getYAxisLabelAlignment(u).textAlign;
    }
    e === "y" && (l === "start" ? X = "top" : l === "end" && (X = "bottom"));
    const lt = this._getLabelSizes();
    for (b = 0, _ = a.length; b < _; ++b) {
      x = a[b], v = x.label;
      const z = o.setContext(this.getContext(b));
      w = this.getPixelForTick(b) + o.labelOffset, A = this._resolveTickFontOptions(b), T = A.lineHeight, C = W(v) ? v.length : 1;
      const V = C / 2, it = z.color, Ze = z.textStrokeColor, Qe = z.textStrokeWidth;
      let ee = S;
      r ? (y = w, S === "inner" && (b === _ - 1 ? ee = this.options.reverse ? "left" : "right" : b === 0 ? ee = this.options.reverse ? "right" : "left" : ee = "center"), n === "top" ? c === "near" || p !== 0 ? E = -C * T + T / 2 : c === "center" ? E = -lt.highest.height / 2 - V * T + T : E = -lt.highest.height + T / 2 : c === "near" || p !== 0 ? E = T / 2 : c === "center" ? E = lt.highest.height / 2 - V * T : E = lt.highest.height - C * T, d && (E *= -1), p !== 0 && !z.showLabelBackdrop && (y += T / 2 * Math.sin(p))) : (k = w, E = (1 - C) * T / 2);
      let Je;
      if (z.showLabelBackdrop) {
        const ie = at(z.backdropPadding), ge = lt.heights[b], Ft = lt.widths[b];
        let me = E - ie.top, zt = 0 - ie.left;
        switch (X) {
          case "middle":
            me -= ge / 2;
            break;
          case "bottom":
            me -= ge;
            break;
        }
        switch (S) {
          case "center":
            zt -= Ft / 2;
            break;
          case "right":
            zt -= Ft;
            break;
          case "inner":
            b === _ - 1 ? zt -= Ft : b > 0 && (zt -= Ft / 2);
            break;
        }
        Je = {
          left: zt,
          top: me,
          width: Ft + ie.width,
          height: ge + ie.height,
          color: z.backdropColor
        };
      }
      m.push({
        label: v,
        font: A,
        textOffset: E,
        options: {
          rotation: p,
          color: it,
          strokeColor: Ze,
          strokeWidth: Qe,
          textAlign: ee,
          textBaseline: X,
          translation: [
            y,
            k
          ],
          backdrop: Je
        }
      });
    }
    return m;
  }
  _getXAxisLabelAlignment() {
    const { position: t, ticks: e } = this.options;
    if (-Xt(this.labelRotation))
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
    this.isHorizontal() ? (c = Wt(t, this.left, r) - r / 2, h = Wt(t, this.right, a) + a / 2, d = u = l) : (d = Wt(t, this.top, r) - r / 2, u = Wt(t, this.bottom, a) + a / 2, c = h = l), e.save(), e.lineWidth = o.width, e.strokeStyle = o.color, e.beginPath(), e.moveTo(c, d), e.lineTo(h, u), e.stroke(), e.restore();
  }
  drawLabels(t) {
    if (!this.options.ticks.display)
      return;
    const s = this.ctx, n = this._computeLabelArea();
    n && zi(s, n);
    const o = this.getLabelItems(t);
    for (const r of o) {
      const a = r.options, l = r.font, c = r.label, h = r.textOffset;
      $i(s, c, 0, h, l, a);
    }
    n && Bi(s);
  }
  drawTitle() {
    const { ctx: t, options: { position: e, title: s, reverse: n } } = this;
    if (!s.display)
      return;
    const o = Z(s.font), r = at(s.padding), a = s.align;
    let l = o.lineHeight / 2;
    e === "bottom" || e === "center" || O(e) ? (l += r.bottom, W(s.text) && (l += o.lineHeight * (s.text.length - 1))) : l += r.top;
    const { titleX: c, titleY: h, maxWidth: d, rotation: u } = Jh(this, l, e, a);
    $i(t, s.text, 0, 0, o, {
      color: s.color,
      maxWidth: d,
      rotation: u,
      textAlign: Qh(a, e, n),
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
    return !this._isVisible() || this.draw !== pe.prototype.draw ? [
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
    return Z(e.font);
  }
  _maxDigits() {
    const t = this._resolveTickFontOptions(0).lineHeight;
    return (this.isHorizontal() ? this.width : this.height) / t;
  }
}
class hi {
  constructor(t, e, s) {
    this.type = t, this.scope = e, this.override = s, this.items = /* @__PURE__ */ Object.create(null);
  }
  isForType(t) {
    return Object.prototype.isPrototypeOf.call(this.type.prototype, t.prototype);
  }
  register(t) {
    const e = Object.getPrototypeOf(t);
    let s;
    id(e) && (s = this.register(e));
    const n = this.items, o = t.id, r = this.scope + "." + o;
    if (!o)
      throw new Error("class does not have id: " + t);
    return o in n || (n[o] = t, td(t, r, s), this.override && B.override(t.id, t.overrides)), r;
  }
  get(t) {
    return this.items[t];
  }
  unregister(t) {
    const e = this.items, s = t.id, n = this.scope;
    s in e && delete e[s], n && s in B[n] && (delete B[n][s], this.override && delete Jt[s]);
  }
}
function td(i, t, e) {
  const s = We(/* @__PURE__ */ Object.create(null), [
    e ? B.get(e) : {},
    B.get(t),
    i.defaults
  ]);
  B.set(t, s), i.defaultRoutes && ed(t, i.defaultRoutes), i.descriptors && B.describe(t, i.descriptors);
}
function ed(i, t) {
  Object.keys(t).forEach((e) => {
    const s = e.split("."), n = s.pop(), o = [
      i
    ].concat(s).join("."), r = t[e].split("."), a = r.pop(), l = r.join(".");
    B.route(o, n, l, a);
  });
}
function id(i) {
  return "id" in i && "defaults" in i;
}
class sd {
  constructor() {
    this.controllers = new hi(ae, "datasets", !0), this.elements = new hi(xt, "elements"), this.plugins = new hi(Object, "plugins"), this.scales = new hi(pe, "scales"), this._typedRegistries = [
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
      s || o.isForType(n) || o === this.plugins && n.id ? this._exec(t, o, n) : I(n, (r) => {
        const a = s || this._getRegistryForType(r);
        this._exec(t, a, r);
      });
    });
  }
  _exec(t, e, s) {
    const n = Os(t);
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
var dt = /* @__PURE__ */ new sd();
class nd {
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
    R(this._cache) || (this._oldCache = this._cache, this._cache = void 0);
  }
  _descriptors(t) {
    if (this._cache)
      return this._cache;
    const e = this._cache = this._createDescriptors(t);
    return this._notifyStateChanges(t), e;
  }
  _createDescriptors(t, e) {
    const s = t && t.config, n = $(s.options && s.options.plugins, {}), o = od(s);
    return n === !1 && !e ? [] : ad(t, o, n, e);
  }
  _notifyStateChanges(t) {
    const e = this._oldCache || [], s = this._cache, n = (o, r) => o.filter((a) => !r.some((l) => a.plugin.id === l.plugin.id));
    this._notify(n(e, s), t, "stop"), this._notify(n(s, e), t, "start");
  }
}
function od(i) {
  const t = {}, e = [], s = Object.keys(dt.plugins.items);
  for (let o = 0; o < s.length; o++)
    e.push(dt.getPlugin(s[o]));
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
function rd(i, t) {
  return !t && i === !1 ? null : i === !0 ? {} : i;
}
function ad(i, { plugins: t, localIds: e }, s, n) {
  const o = [], r = i.getContext();
  for (const a of t) {
    const l = a.id, c = rd(s[l], n);
    c !== null && o.push({
      plugin: a,
      options: ld(i.config, {
        plugin: a,
        local: e[l]
      }, c, r)
    });
  }
  return o;
}
function ld(i, { plugin: t, local: e }, s, n) {
  const o = i.pluginScopeKeys(t), r = i.getOptionScopes(s, o);
  return e && t.defaults && r.push(t.defaults), i.createResolver(r, n, [
    ""
  ], {
    scriptable: !1,
    indexable: !1,
    allKeys: !0
  });
}
function ms(i, t) {
  const e = B.datasets[i] || {};
  return ((t.datasets || {})[i] || {}).indexAxis || t.indexAxis || e.indexAxis || "x";
}
function cd(i, t) {
  let e = i;
  return i === "_index_" ? e = t : i === "_value_" && (e = t === "x" ? "y" : "x"), e;
}
function hd(i, t) {
  return i === t ? "_index_" : "_value_";
}
function qn(i) {
  if (i === "x" || i === "y" || i === "r")
    return i;
}
function dd(i) {
  if (i === "top" || i === "bottom")
    return "x";
  if (i === "left" || i === "right")
    return "y";
}
function bs(i, ...t) {
  if (qn(i))
    return i;
  for (const e of t) {
    const s = e.axis || dd(e.position) || i.length > 1 && qn(i[0].toLowerCase());
    if (s)
      return s;
  }
  throw new Error(`Cannot determine type of '${i}' axis. Please provide 'axis' or 'position' option.`);
}
function Gn(i, t, e) {
  if (e[t + "AxisID"] === i)
    return {
      axis: t
    };
}
function ud(i, t) {
  if (t.data && t.data.datasets) {
    const e = t.data.datasets.filter((s) => s.xAxisID === i || s.yAxisID === i);
    if (e.length)
      return Gn(i, "x", e[0]) || Gn(i, "y", e[0]);
  }
  return {};
}
function fd(i, t) {
  const e = Jt[i.type] || {
    scales: {}
  }, s = t.scales || {}, n = ms(i.type, t), o = /* @__PURE__ */ Object.create(null);
  return Object.keys(s).forEach((r) => {
    const a = s[r];
    if (!O(a))
      return console.error(`Invalid scale configuration for scale: ${r}`);
    if (a._proxy)
      return console.warn(`Ignoring resolver passed as options for scale: ${r}`);
    const l = bs(r, a, ud(r, i), B.scales[a.type]), c = hd(l, n), h = e.scales || {};
    o[r] = De(/* @__PURE__ */ Object.create(null), [
      {
        axis: l
      },
      a,
      h[l],
      h[c]
    ]);
  }), i.data.datasets.forEach((r) => {
    const a = r.type || i.type, l = r.indexAxis || ms(a, t), h = (Jt[a] || {}).scales || {};
    Object.keys(h).forEach((d) => {
      const u = cd(d, l), f = r[u + "AxisID"] || u;
      o[f] = o[f] || /* @__PURE__ */ Object.create(null), De(o[f], [
        {
          axis: u
        },
        s[f],
        h[d]
      ]);
    });
  }), Object.keys(o).forEach((r) => {
    const a = o[r];
    De(a, [
      B.scales[a.type],
      B.scale
    ]);
  }), o;
}
function kr(i) {
  const t = i.options || (i.options = {});
  t.plugins = $(t.plugins, {}), t.scales = fd(i, t);
}
function Mr(i) {
  return i = i || {}, i.datasets = i.datasets || [], i.labels = i.labels || [], i;
}
function pd(i) {
  return i = i || {}, i.data = Mr(i.data), kr(i), i;
}
const Zn = /* @__PURE__ */ new Map(), Pr = /* @__PURE__ */ new Set();
function di(i, t) {
  let e = Zn.get(i);
  return e || (e = t(), Zn.set(i, e), Pr.add(e)), e;
}
const Se = (i, t, e) => {
  const s = ce(t, e);
  s !== void 0 && i.add(s);
};
class gd {
  constructor(t) {
    this._config = pd(t), this._scopeCache = /* @__PURE__ */ new Map(), this._resolverCache = /* @__PURE__ */ new Map();
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
    this._config.data = Mr(t);
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
    this.clearCache(), kr(t);
  }
  clearCache() {
    this._scopeCache.clear(), this._resolverCache.clear();
  }
  datasetScopeKeys(t) {
    return di(t, () => [
      [
        `datasets.${t}`,
        ""
      ]
    ]);
  }
  datasetAnimationScopeKeys(t, e) {
    return di(`${t}.transition.${e}`, () => [
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
    return di(`${t}-${e}`, () => [
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
    return di(`${s}-plugin-${e}`, () => [
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
      t && (l.add(t), h.forEach((d) => Se(l, t, d))), h.forEach((d) => Se(l, n, d)), h.forEach((d) => Se(l, Jt[o] || {}, d)), h.forEach((d) => Se(l, B, d)), h.forEach((d) => Se(l, ps, d));
    });
    const c = Array.from(l);
    return c.length === 0 && c.push(/* @__PURE__ */ Object.create(null)), Pr.has(e) && r.set(e, c), c;
  }
  chartOptionScopes() {
    const { options: t, type: e } = this;
    return [
      t,
      Jt[e] || {},
      B.datasets[e] || {},
      {
        type: e
      },
      B,
      ps
    ];
  }
  resolveNamedOptions(t, e, s, n = [
    ""
  ]) {
    const o = {
      $shared: !0
    }, { resolver: r, subPrefixes: a } = Qn(this._resolverCache, t, n);
    let l = r;
    if (bd(r, e)) {
      o.$shared = !1, s = Dt(s) ? s() : s;
      const c = this.createResolver(t, s, a);
      l = he(r, s, c);
    }
    for (const c of e)
      o[c] = l[c];
    return o;
  }
  createResolver(t, e, s = [
    ""
  ], n) {
    const { resolver: o } = Qn(this._resolverCache, t, s);
    return O(e) ? he(o, e, void 0, n) : o;
  }
}
function Qn(i, t, e) {
  let s = i.get(t);
  s || (s = /* @__PURE__ */ new Map(), i.set(t, s));
  const n = e.join();
  let o = s.get(n);
  return o || (o = {
    resolver: Es(t, e),
    subPrefixes: e.filter((a) => !a.toLowerCase().includes("hover"))
  }, s.set(n, o)), o;
}
const md = (i) => O(i) && Object.getOwnPropertyNames(i).some((t) => Dt(i[t]));
function bd(i, t) {
  const { isScriptable: e, isIndexable: s } = or(i);
  for (const n of t) {
    const o = e(n), r = s(n), a = (r || o) && i[n];
    if (o && (Dt(a) || md(a)) || r && W(a))
      return !0;
  }
  return !1;
}
var _d = "4.5.1";
const yd = [
  "top",
  "bottom",
  "left",
  "right",
  "chartArea"
];
function Jn(i, t) {
  return i === "top" || i === "bottom" || yd.indexOf(i) === -1 && t === "x";
}
function to(i, t) {
  return function(e, s) {
    return e[i] === s[i] ? e[t] - s[t] : e[i] - s[i];
  };
}
function eo(i) {
  const t = i.chart, e = t.options.animation;
  t.notifyPlugins("afterRender"), F(e && e.onComplete, [
    i
  ], t);
}
function xd(i) {
  const t = i.chart, e = t.options.animation;
  F(e && e.onProgress, [
    i
  ], t);
}
function Ar(i) {
  return Is() && typeof i == "string" ? i = document.getElementById(i) : i && i.length && (i = i[0]), i && i.canvas && (i = i.canvas), i;
}
const bi = {}, io = (i) => {
  const t = Ar(i);
  return Object.values(bi).filter((e) => e.canvas === t).pop();
};
function vd(i, t, e) {
  const s = Object.keys(i);
  for (const n of s) {
    const o = +n;
    if (o >= t) {
      const r = i[n];
      delete i[n], (e > 0 || o > t) && (i[o + e] = r);
    }
  }
}
function wd(i, t, e, s) {
  return !e || i.type === "mouseout" ? null : s ? t : i;
}
class tt {
  static register(...t) {
    dt.add(...t), so();
  }
  static unregister(...t) {
    dt.remove(...t), so();
  }
  constructor(t, e) {
    const s = this.config = new gd(e), n = Ar(t), o = io(n);
    if (o)
      throw new Error("Canvas is already in use. Chart with ID '" + o.id + "' must be destroyed before the canvas with ID '" + o.canvas.id + "' can be reused.");
    const r = s.createResolver(s.chartOptionScopes(), this.getContext());
    this.platform = new (s.platform || Hh(n))(), this.platform.updateConfig(s);
    const a = this.platform.acquireContext(n, r.aspectRatio), l = a && a.canvas, c = l && l.height, h = l && l.width;
    if (this.id = xl(), this.ctx = a, this.canvas = l, this.width = h, this.height = c, this._options = r, this._aspectRatio = this.aspectRatio, this._layers = [], this._metasets = [], this._stacks = void 0, this.boxes = [], this.currentDevicePixelRatio = void 0, this.chartArea = void 0, this._active = [], this._lastEvent = void 0, this._listeners = {}, this._responsiveListeners = void 0, this._sortedMetasets = [], this.scales = {}, this._plugins = new nd(), this.$proxies = {}, this._hiddenIndices = {}, this.attached = !1, this._animationsDisabled = void 0, this.$context = void 0, this._doResize = Hl((d) => this.update(d), r.resizeDelay || 0), this._dataChanges = [], bi[this.id] = this, !a || !l) {
      console.error("Failed to create chart: can't acquire context from the given item");
      return;
    }
    bt.listen(this, "complete", eo), bt.listen(this, "progress", xd), this._initialize(), this.attached && this.update();
  }
  get aspectRatio() {
    const { options: { aspectRatio: t, maintainAspectRatio: e }, width: s, height: n, _aspectRatio: o } = this;
    return R(t) ? e && o ? o : n ? s / n : null : t;
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
    return dt;
  }
  _initialize() {
    return this.notifyPlugins("beforeInit"), this.options.responsive ? this.resize() : Mn(this, this.options.devicePixelRatio), this.bindEvents(), this.notifyPlugins("afterInit"), this;
  }
  clear() {
    return wn(this.canvas, this.ctx), this;
  }
  stop() {
    return bt.stop(this), this;
  }
  resize(t, e) {
    bt.running(this) ? this._resizeBeforeDraw = {
      width: t,
      height: e
    } : this._resize(t, e);
  }
  _resize(t, e) {
    const s = this.options, n = this.canvas, o = s.maintainAspectRatio && this.aspectRatio, r = this.platform.getMaximumSize(n, t, e, o), a = s.devicePixelRatio || this.platform.getDevicePixelRatio(), l = this.width ? "resize" : "attach";
    this.width = r.width, this.height = r.height, this._aspectRatio = this.aspectRatio, Mn(this, a, !0) && (this.notifyPlugins("resize", {
      size: r
    }), F(s.onResize, [
      this,
      r
    ], this), this.attached && this._doResize(l) && this.render());
  }
  ensureScalesHaveIDs() {
    const e = this.options.scales || {};
    I(e, (s, n) => {
      s.id = n;
    });
  }
  buildOrUpdateScales() {
    const t = this.options, e = t.scales, s = this.scales, n = Object.keys(s).reduce((r, a) => (r[a] = !1, r), {});
    let o = [];
    e && (o = o.concat(Object.keys(e).map((r) => {
      const a = e[r], l = bs(r, a), c = l === "r", h = l === "x";
      return {
        options: a,
        dposition: c ? "chartArea" : h ? "bottom" : "left",
        dtype: c ? "radialLinear" : h ? "category" : "linear"
      };
    }))), I(o, (r) => {
      const a = r.options, l = a.id, c = bs(l, a), h = $(a.type, r.dtype);
      (a.position === void 0 || Jn(a.position, c) !== Jn(r.dposition)) && (a.position = r.dposition), n[l] = !0;
      let d = null;
      if (l in s && s[l].type === h)
        d = s[l];
      else {
        const u = dt.getScale(h);
        d = new u({
          id: l,
          type: h,
          ctx: this.ctx,
          chart: this
        }), s[d.id] = d;
      }
      d.init(a, t);
    }), I(n, (r, a) => {
      r || delete s[a];
    }), I(s, (r) => {
      Mt.configure(this, r, r.options), Mt.addBox(this, r);
    });
  }
  _updateMetasets() {
    const t = this._metasets, e = this.data.datasets.length, s = t.length;
    if (t.sort((n, o) => n.index - o.index), s > e) {
      for (let n = e; n < s; ++n)
        this._destroyDatasetMeta(n);
      t.splice(e, s - e);
    }
    this._sortedMetasets = t.slice(0).sort(to("order", "index"));
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
      if (r.type && r.type !== a && (this._destroyDatasetMeta(s), r = this.getDatasetMeta(s)), r.type = a, r.indexAxis = o.indexAxis || ms(a, this.options), r.order = o.order || 0, r.index = s, r.label = "" + o.label, r.visible = this.isDatasetVisible(s), r.controller)
        r.controller.updateIndex(s), r.controller.linkScales();
      else {
        const l = dt.getController(a), { datasetElementType: c, dataElementType: h } = B.datasets[a];
        Object.assign(l, {
          dataElementType: dt.getElement(h),
          datasetElementType: c && dt.getElement(c)
        }), r.controller = new l(this, s), t.push(r.controller);
      }
    }
    return this._updateMetasets(), t;
  }
  _resetElements() {
    I(this.data.datasets, (t, e) => {
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
    r = this._minPadding = s.layout.autoPadding ? r : 0, this._updateLayout(r), n || I(o, (c) => {
      c.reset();
    }), this._updateDatasets(t), this.notifyPlugins("afterUpdate", {
      mode: t
    }), this._layers.sort(to("z", "_idx"));
    const { _active: a, _lastEvent: l } = this;
    l ? this._eventHandler(l, !0) : a.length && this._updateHoverStyles(a, a, !0), this.render();
  }
  _updateScales() {
    I(this.scales, (t) => {
      Mt.removeBox(this, t);
    }), this.ensureScalesHaveIDs(), this.buildOrUpdateScales();
  }
  _checkEventBindings() {
    const t = this.options, e = new Set(Object.keys(this._listeners)), s = new Set(t.events);
    (!un(e, s) || !!this._responsiveListeners !== t.responsive) && (this.unbindEvents(), this.bindEvents());
  }
  _updateHiddenIndices() {
    const { _hiddenIndices: t } = this, e = this._getUniformDataChanges() || [];
    for (const { method: s, start: n, count: o } of e) {
      const r = s === "_removeElements" ? -o : o;
      vd(t, n, r);
    }
  }
  _getUniformDataChanges() {
    const t = this._dataChanges;
    if (!t || !t.length)
      return;
    this._dataChanges = [];
    const e = this.data.datasets.length, s = (o) => new Set(t.filter((r) => r[0] === o).map((r, a) => a + "," + r.splice(1).join(","))), n = s(0);
    for (let o = 1; o < e; o++)
      if (!un(n, s(o)))
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
    Mt.update(this, this.width, this.height, t);
    const e = this.chartArea, s = e.width <= 0 || e.height <= 0;
    this._layers = [], I(this.boxes, (n) => {
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
        this._updateDataset(e, Dt(t) ? t({
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
    }) !== !1 && (bt.has(this) ? this.attached && !bt.running(this) && bt.start(this) : (this.draw(), eo({
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
    }, n = gr(this, t);
    this.notifyPlugins("beforeDatasetDraw", s) !== !1 && (n && zi(e, n), t.controller.draw(), n && Bi(e), s.cancelable = !1, this.notifyPlugins("afterDatasetDraw", s));
  }
  isPointInArea(t) {
    return Ue(t, this.chartArea, this._minPadding);
  }
  getElementsAtEventForMode(t, e, s, n) {
    const o = yh.modes[e];
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
    return this.$context || (this.$context = te(null, {
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
    je(e) ? (o.data[e].hidden = !s, this.update()) : (this.setDatasetVisibility(t, s), r.update(o, {
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
    for (this.stop(), bt.remove(this), t = 0, e = this.data.datasets.length; t < e; ++t)
      this._destroyDatasetMeta(t);
  }
  destroy() {
    this.notifyPlugins("beforeDestroy");
    const { canvas: t, ctx: e } = this;
    this._stop(), this.config.clearCache(), t && (this.unbindEvents(), wn(t, e), this.platform.releaseContext(e), this.canvas = null, this.ctx = null), delete bi[this.id], this.notifyPlugins("afterDestroy");
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
    I(this.options.events, (o) => s(o, n));
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
    I(this._listeners, (t, e) => {
      this.platform.removeEventListener(this, e, t);
    }), this._listeners = {}, I(this._responsiveListeners, (t, e) => {
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
    !Mi(s, e) && (this._active = s, this._lastEvent = null, this._updateHoverStyles(s, e));
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
    const { _active: n = [], options: o } = this, r = e, a = this._getActiveElements(t, n, s, r), l = Pl(t), c = wd(t, this._lastEvent, s, l);
    s && (this._lastEvent = null, F(o.onHover, [
      t,
      a,
      this
    ], this), l && F(o.onClick, [
      t,
      a,
      this
    ], this));
    const h = !Mi(a, n);
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
M(tt, "defaults", B), M(tt, "instances", bi), M(tt, "overrides", Jt), M(tt, "registry", dt), M(tt, "version", _d), M(tt, "getChart", io);
function so() {
  return I(tt.instances, (i) => i._plugins.invalidate());
}
function $r(i, t, e = t) {
  i.lineCap = $(e.borderCapStyle, t.borderCapStyle), i.setLineDash($(e.borderDash, t.borderDash)), i.lineDashOffset = $(e.borderDashOffset, t.borderDashOffset), i.lineJoin = $(e.borderJoinStyle, t.borderJoinStyle), i.lineWidth = $(e.borderWidth, t.borderWidth), i.strokeStyle = $(e.borderColor, t.borderColor);
}
function Sd(i, t, e) {
  i.lineTo(e.x, e.y);
}
function kd(i) {
  return i.stepped ? tc : i.tension || i.cubicInterpolationMode === "monotone" ? ec : Sd;
}
function Cr(i, t, e = {}) {
  const s = i.length, { start: n = 0, end: o = s - 1 } = e, { start: r, end: a } = t, l = Math.max(n, r), c = Math.min(o, a), h = n < r && o < r || n > a && o > a;
  return {
    count: s,
    start: l,
    loop: t.loop,
    ilen: c < l && !h ? s + c - l : c - l
  };
}
function Md(i, t, e, s) {
  const { points: n, options: o } = t, { count: r, start: a, loop: l, ilen: c } = Cr(n, e, s), h = kd(o);
  let { move: d = !0, reverse: u } = s || {}, f, g, p;
  for (f = 0; f <= c; ++f)
    g = n[(a + (u ? c - f : f)) % r], !g.skip && (d ? (i.moveTo(g.x, g.y), d = !1) : h(i, p, g, u, o.stepped), p = g);
  return l && (g = n[(a + (u ? c : 0)) % r], h(i, p, g, u, o.stepped)), !!l;
}
function Pd(i, t, e, s) {
  const n = t.points, { count: o, start: r, ilen: a } = Cr(n, e, s), { move: l = !0, reverse: c } = s || {};
  let h = 0, d = 0, u, f, g, p, m, b;
  const _ = (v) => (r + (c ? a - v : v)) % o, x = () => {
    p !== m && (i.lineTo(h, m), i.lineTo(h, p), i.lineTo(h, b));
  };
  for (l && (f = n[_(0)], i.moveTo(f.x, f.y)), u = 0; u <= a; ++u) {
    if (f = n[_(u)], f.skip)
      continue;
    const v = f.x, y = f.y, k = v | 0;
    k === g ? (y < p ? p = y : y > m && (m = y), h = (d * h + v) / ++d) : (x(), i.lineTo(v, y), g = k, d = 0, p = m = y), b = y;
  }
  x();
}
function _s(i) {
  const t = i.options, e = t.borderDash && t.borderDash.length;
  return !i._decimated && !i._loop && !t.tension && t.cubicInterpolationMode !== "monotone" && !t.stepped && !e ? Pd : Md;
}
function Ad(i) {
  return i.stepped ? Ec : i.tension || i.cubicInterpolationMode === "monotone" ? Lc : Yt;
}
function $d(i, t, e, s) {
  let n = t._path;
  n || (n = t._path = new Path2D(), t.path(n, e, s) && n.closePath()), $r(i, t.options), i.stroke(n);
}
function Cd(i, t, e, s) {
  const { segments: n, options: o } = t, r = _s(t);
  for (const a of n)
    $r(i, o, a.style), i.beginPath(), r(i, t, a, {
      start: e,
      end: e + s - 1
    }) && i.closePath(), i.stroke();
}
const Od = typeof Path2D == "function";
function Dd(i, t, e, s) {
  Od && !t.options.segment ? $d(i, t, e, s) : Cd(i, t, e, s);
}
class Pt extends xt {
  constructor(t) {
    super(), this.animated = !0, this.options = void 0, this._chart = void 0, this._loop = void 0, this._fullLoop = void 0, this._path = void 0, this._points = void 0, this._segments = void 0, this._decimated = !1, this._pointsUpdated = !1, this._datasetIndex = void 0, t && Object.assign(this, t);
  }
  updateControlPoints(t, e) {
    const s = this.options;
    if ((s.tension || s.cubicInterpolationMode === "monotone") && !s.stepped && !this._pointsUpdated) {
      const n = s.spanGaps ? this._loop : this._fullLoop;
      Mc(this._points, s, t, n, e), this._pointsUpdated = !0;
    }
  }
  set points(t) {
    this._points = t, delete this._segments, delete this._path, this._pointsUpdated = !1;
  }
  get points() {
    return this._points;
  }
  get segments() {
    return this._segments || (this._segments = Hc(this, this.options.segment));
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
    const s = this.options, n = t[e], o = this.points, r = pr(this, {
      property: e,
      start: n,
      end: n
    });
    if (!r.length)
      return;
    const a = [], l = Ad(s);
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
    return _s(this)(t, this, e, s);
  }
  path(t, e, s) {
    const n = this.segments, o = _s(this);
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
    (this.points || []).length && o.borderWidth && (t.save(), Dd(t, this, s, n), t.restore()), this.animated && (this._pointsUpdated = !1, this._path = void 0);
  }
}
M(Pt, "id", "line"), M(Pt, "defaults", {
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
}), M(Pt, "defaultRoutes", {
  backgroundColor: "backgroundColor",
  borderColor: "borderColor"
}), M(Pt, "descriptors", {
  _scriptable: !0,
  _indexable: (t) => t !== "borderDash" && t !== "fill"
});
function no(i, t, e, s) {
  const n = i.options, { [e]: o } = i.getProps([
    e
  ], s);
  return Math.abs(t - o) < n.radius + n.hitRadius;
}
class _i extends xt {
  constructor(e) {
    super();
    M(this, "parsed");
    M(this, "skip");
    M(this, "stop");
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
    return no(this, e, "x", s);
  }
  inYRange(e, s) {
    return no(this, e, "y", s);
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
    this.skip || n.radius < 0.1 || !Ue(this, s, this.size(n) / 2) || (e.strokeStyle = n.borderColor, e.lineWidth = n.borderWidth, e.fillStyle = n.backgroundColor, gs(e, n, this.x, this.y));
  }
  getRange() {
    const e = this.options || {};
    return e.radius + e.hitRadius;
  }
}
M(_i, "id", "point"), /**
* @type {any}
*/
M(_i, "defaults", {
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
M(_i, "defaultRoutes", {
  backgroundColor: "backgroundColor",
  borderColor: "borderColor"
});
function Or(i, t) {
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
function At(i, t, e, s) {
  return i ? 0 : et(t, e, s);
}
function Td(i, t, e) {
  const s = i.options.borderWidth, n = i.borderSkipped, o = nr(s);
  return {
    t: At(n.top, o.top, 0, e),
    r: At(n.right, o.right, 0, t),
    b: At(n.bottom, o.bottom, 0, e),
    l: At(n.left, o.left, 0, t)
  };
}
function Ed(i, t, e) {
  const { enableBorderRadius: s } = i.getProps([
    "enableBorderRadius"
  ]), n = i.options.borderRadius, o = oe(n), r = Math.min(t, e), a = i.borderSkipped, l = s || O(n);
  return {
    topLeft: At(!l || a.top || a.left, o.topLeft, 0, r),
    topRight: At(!l || a.top || a.right, o.topRight, 0, r),
    bottomLeft: At(!l || a.bottom || a.left, o.bottomLeft, 0, r),
    bottomRight: At(!l || a.bottom || a.right, o.bottomRight, 0, r)
  };
}
function Ld(i) {
  const t = Or(i), e = t.right - t.left, s = t.bottom - t.top, n = Td(i, e / 2, s / 2), o = Ed(i, e / 2, s / 2);
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
function os(i, t, e, s) {
  const n = t === null, o = e === null, a = i && !(n && o) && Or(i, s);
  return a && (n || St(t, a.left, a.right)) && (o || St(e, a.top, a.bottom));
}
function Rd(i) {
  return i.topLeft || i.topRight || i.bottomLeft || i.bottomRight;
}
function Id(i, t) {
  i.rect(t.x, t.y, t.w, t.h);
}
function rs(i, t, e = {}) {
  const s = i.x !== e.x ? -t : 0, n = i.y !== e.y ? -t : 0, o = (i.x + i.w !== e.x + e.w ? t : 0) - s, r = (i.y + i.h !== e.y + e.h ? t : 0) - n;
  return {
    x: i.x + s,
    y: i.y + n,
    w: i.w + o,
    h: i.h + r,
    radius: i.radius
  };
}
class Ie extends xt {
  constructor(t) {
    super(), this.options = void 0, this.horizontal = void 0, this.base = void 0, this.width = void 0, this.height = void 0, this.inflateAmount = void 0, t && Object.assign(this, t);
  }
  draw(t) {
    const { inflateAmount: e, options: { borderColor: s, backgroundColor: n } } = this, { inner: o, outer: r } = Ld(this), a = Rd(r.radius) ? Ci : Id;
    t.save(), (r.w !== o.w || r.h !== o.h) && (t.beginPath(), a(t, rs(r, e, o)), t.clip(), a(t, rs(o, -e, r)), t.fillStyle = s, t.fill("evenodd")), t.beginPath(), a(t, rs(o, e)), t.fillStyle = n, t.fill(), t.restore();
  }
  inRange(t, e, s) {
    return os(this, t, e, s);
  }
  inXRange(t, e) {
    return os(this, t, null, e);
  }
  inYRange(t, e) {
    return os(this, null, t, e);
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
M(Ie, "id", "bar"), M(Ie, "defaults", {
  borderSkipped: "start",
  borderWidth: 0,
  borderRadius: 0,
  inflateAmount: "auto",
  pointStyle: void 0
}), M(Ie, "defaultRoutes", {
  backgroundColor: "backgroundColor",
  borderColor: "borderColor"
});
function Fd(i, t, e) {
  const s = i.segments, n = i.points, o = t.points, r = [];
  for (const a of s) {
    let { start: l, end: c } = a;
    c = Wi(l, c, n);
    const h = ys(e, n[l], n[c], a.loop);
    if (!t.segments) {
      r.push({
        source: a,
        target: h,
        start: n[l],
        end: n[c]
      });
      continue;
    }
    const d = pr(t, h);
    for (const u of d) {
      const f = ys(e, o[u.start], o[u.end], u.loop), g = fr(a, n, f);
      for (const p of g)
        r.push({
          source: p,
          target: u,
          start: {
            [e]: oo(h, f, "start", Math.max)
          },
          end: {
            [e]: oo(h, f, "end", Math.min)
          }
        });
    }
  }
  return r;
}
function ys(i, t, e, s) {
  if (s)
    return;
  let n = t[i], o = e[i];
  return i === "angle" && (n = ut(n), o = ut(o)), {
    property: i,
    start: n,
    end: o
  };
}
function zd(i, t) {
  const { x: e = null, y: s = null } = i || {}, n = t.points, o = [];
  return t.segments.forEach(({ start: r, end: a }) => {
    a = Wi(r, a, n);
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
function Wi(i, t, e) {
  for (; t > i; t--) {
    const s = e[t];
    if (!isNaN(s.x) && !isNaN(s.y))
      break;
  }
  return t;
}
function oo(i, t, e, s) {
  return i && t ? s(i[e], t[e]) : i ? i[e] : t ? t[e] : 0;
}
function Dr(i, t) {
  let e = [], s = !1;
  return W(i) ? (s = !0, e = i) : e = zd(i, t), e.length ? new Pt({
    points: e,
    options: {
      tension: 0
    },
    _loop: s,
    _fullLoop: s
  }) : null;
}
function ro(i) {
  return i && i.fill !== !1;
}
function Bd(i, t, e) {
  let n = i[t].fill;
  const o = [
    t
  ];
  let r;
  if (!e)
    return n;
  for (; n !== !1 && o.indexOf(n) === -1; ) {
    if (!Y(n))
      return n;
    if (r = i[n], !r)
      return !1;
    if (r.visible)
      return n;
    o.push(n), n = r.fill;
  }
  return !1;
}
function Hd(i, t, e) {
  const s = Vd(i);
  if (O(s))
    return isNaN(s.value) ? !1 : s;
  let n = parseFloat(s);
  return Y(n) && Math.floor(n) === n ? Nd(s[0], t, n, e) : [
    "origin",
    "start",
    "end",
    "stack",
    "shape"
  ].indexOf(s) >= 0 && s;
}
function Nd(i, t, e, s) {
  return (i === "-" || i === "+") && (e = t + e), e === t || e < 0 || e >= s ? !1 : e;
}
function Wd(i, t) {
  let e = null;
  return i === "start" ? e = t.bottom : i === "end" ? e = t.top : O(i) ? e = t.getPixelForValue(i.value) : t.getBasePixel && (e = t.getBasePixel()), e;
}
function jd(i, t, e) {
  let s;
  return i === "start" ? s = e : i === "end" ? s = t.options.reverse ? t.min : t.max : O(i) ? s = i.value : s = t.getBaseValue(), s;
}
function Vd(i) {
  const t = i.options, e = t.fill;
  let s = $(e && e.target, e);
  return s === void 0 && (s = !!t.backgroundColor), s === !1 || s === null ? !1 : s === !0 ? "origin" : s;
}
function Ud(i) {
  const { scale: t, index: e, line: s } = i, n = [], o = s.segments, r = s.points, a = Yd(t, e);
  a.push(Dr({
    x: null,
    y: t.bottom
  }, s));
  for (let l = 0; l < o.length; l++) {
    const c = o[l];
    for (let h = c.start; h <= c.end; h++)
      Kd(n, r[h], a);
  }
  return new Pt({
    points: n,
    options: {}
  });
}
function Yd(i, t) {
  const e = [], s = i.getMatchingVisibleMetas("line");
  for (let n = 0; n < s.length; n++) {
    const o = s[n];
    if (o.index === t)
      break;
    o.hidden || e.unshift(o.dataset);
  }
  return e;
}
function Kd(i, t, e) {
  const s = [];
  for (let n = 0; n < e.length; n++) {
    const o = e[n], { first: r, last: a, point: l } = Xd(o, t, "x");
    if (!(!l || r && a)) {
      if (r)
        s.unshift(l);
      else if (i.push(l), !a)
        break;
    }
  }
  i.push(...s);
}
function Xd(i, t, e) {
  const s = i.interpolate(t, e);
  if (!s)
    return {};
  const n = s[e], o = i.segments, r = i.points;
  let a = !1, l = !1;
  for (let c = 0; c < o.length; c++) {
    const h = o[c], d = r[h.start][e], u = r[h.end][e];
    if (St(n, d, u)) {
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
class Tr {
  constructor(t) {
    this.x = t.x, this.y = t.y, this.radius = t.radius;
  }
  pathSegment(t, e, s) {
    const { x: n, y: o, radius: r } = this;
    return e = e || {
      start: 0,
      end: rt
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
function qd(i) {
  const { chart: t, fill: e, line: s } = i;
  if (Y(e))
    return Gd(t, e);
  if (e === "stack")
    return Ud(i);
  if (e === "shape")
    return !0;
  const n = Zd(i);
  return n instanceof Tr ? n : Dr(n, s);
}
function Gd(i, t) {
  const e = i.getDatasetMeta(t);
  return e && i.isDatasetVisible(t) ? e.dataset : null;
}
function Zd(i) {
  return (i.scale || {}).getPointPositionForValue ? Jd(i) : Qd(i);
}
function Qd(i) {
  const { scale: t = {}, fill: e } = i, s = Wd(e, t);
  if (Y(s)) {
    const n = t.isHorizontal();
    return {
      x: n ? s : null,
      y: n ? null : s
    };
  }
  return null;
}
function Jd(i) {
  const { scale: t, fill: e } = i, s = t.options, n = t.getLabels().length, o = s.reverse ? t.max : t.min, r = jd(e, t, o), a = [];
  if (s.grid.circular) {
    const l = t.getPointPositionForValue(0, o);
    return new Tr({
      x: l.x,
      y: l.y,
      radius: t.getDistanceFromCenterForValue(r)
    });
  }
  for (let l = 0; l < n; ++l)
    a.push(t.getPointPositionForValue(l, r));
  return a;
}
function as(i, t, e) {
  const s = qd(t), { chart: n, index: o, line: r, scale: a, axis: l } = t, c = r.options, h = c.fill, d = c.backgroundColor, { above: u = d, below: f = d } = h || {}, g = n.getDatasetMeta(o), p = gr(n, g);
  s && r.points.length && (zi(i, e), tu(i, {
    line: r,
    target: s,
    above: u,
    below: f,
    area: e,
    scale: a,
    axis: l,
    clip: p
  }), Bi(i));
}
function tu(i, t) {
  const { line: e, target: s, above: n, below: o, area: r, scale: a, clip: l } = t, c = e._loop ? "angle" : t.axis;
  i.save();
  let h = o;
  o !== n && (c === "x" ? (ao(i, s, r.top), ls(i, {
    line: e,
    target: s,
    color: n,
    scale: a,
    property: c,
    clip: l
  }), i.restore(), i.save(), ao(i, s, r.bottom)) : c === "y" && (lo(i, s, r.left), ls(i, {
    line: e,
    target: s,
    color: o,
    scale: a,
    property: c,
    clip: l
  }), i.restore(), i.save(), lo(i, s, r.right), h = n)), ls(i, {
    line: e,
    target: s,
    color: h,
    scale: a,
    property: c,
    clip: l
  }), i.restore();
}
function ao(i, t, e) {
  const { segments: s, points: n } = t;
  let o = !0, r = !1;
  i.beginPath();
  for (const a of s) {
    const { start: l, end: c } = a, h = n[l], d = n[Wi(l, c, n)];
    o ? (i.moveTo(h.x, h.y), o = !1) : (i.lineTo(h.x, e), i.lineTo(h.x, h.y)), r = !!t.pathSegment(i, a, {
      move: r
    }), r ? i.closePath() : i.lineTo(d.x, e);
  }
  i.lineTo(t.first().x, e), i.closePath(), i.clip();
}
function lo(i, t, e) {
  const { segments: s, points: n } = t;
  let o = !0, r = !1;
  i.beginPath();
  for (const a of s) {
    const { start: l, end: c } = a, h = n[l], d = n[Wi(l, c, n)];
    o ? (i.moveTo(h.x, h.y), o = !1) : (i.lineTo(e, h.y), i.lineTo(h.x, h.y)), r = !!t.pathSegment(i, a, {
      move: r
    }), r ? i.closePath() : i.lineTo(e, d.y);
  }
  i.lineTo(e, t.first().y), i.closePath(), i.clip();
}
function ls(i, t) {
  const { line: e, target: s, property: n, color: o, scale: r, clip: a } = t, l = Fd(e, s, n);
  for (const { source: c, target: h, start: d, end: u } of l) {
    const { style: { backgroundColor: f = o } = {} } = c, g = s !== !0;
    i.save(), i.fillStyle = f, eu(i, r, a, g && ys(n, d, u)), i.beginPath();
    const p = !!e.pathSegment(i, c);
    let m;
    if (g) {
      p ? i.closePath() : co(i, s, u, n);
      const b = !!s.pathSegment(i, h, {
        move: p,
        reverse: !0
      });
      m = p && b, m || co(i, s, d, n);
    }
    i.closePath(), i.fill(m ? "evenodd" : "nonzero"), i.restore();
  }
}
function eu(i, t, e, s) {
  const n = t.chart.chartArea, { property: o, start: r, end: a } = s || {};
  if (o === "x" || o === "y") {
    let l, c, h, d;
    o === "x" ? (l = r, c = n.top, h = a, d = n.bottom) : (l = n.left, c = r, h = n.right, d = a), i.beginPath(), e && (l = Math.max(l, e.left), h = Math.min(h, e.right), c = Math.max(c, e.top), d = Math.min(d, e.bottom)), i.rect(l, c, h - l, d - c), i.clip();
  }
}
function co(i, t, e, s) {
  const n = t.interpolate(e, s);
  n && i.lineTo(n.x, n.y);
}
var iu = {
  id: "filler",
  afterDatasetsUpdate(i, t, e) {
    const s = (i.data.datasets || []).length, n = [];
    let o, r, a, l;
    for (r = 0; r < s; ++r)
      o = i.getDatasetMeta(r), a = o.dataset, l = null, a && a.options && a instanceof Pt && (l = {
        visible: i.isDatasetVisible(r),
        index: r,
        fill: Hd(a, r, s),
        chart: i,
        axis: o.controller.options.indexAxis,
        scale: o.vScale,
        line: a
      }), o.$filler = l, n.push(l);
    for (r = 0; r < s; ++r)
      l = n[r], !(!l || l.fill === !1) && (l.fill = Bd(n, r, e.propagate));
  },
  beforeDraw(i, t, e) {
    const s = e.drawTime === "beforeDraw", n = i.getSortedVisibleDatasetMetas(), o = i.chartArea;
    for (let r = n.length - 1; r >= 0; --r) {
      const a = n[r].$filler;
      a && (a.line.updateControlPoints(o, a.axis), s && a.fill && as(i.ctx, a, o));
    }
  },
  beforeDatasetsDraw(i, t, e) {
    if (e.drawTime !== "beforeDatasetsDraw")
      return;
    const s = i.getSortedVisibleDatasetMetas();
    for (let n = s.length - 1; n >= 0; --n) {
      const o = s[n].$filler;
      ro(o) && as(i.ctx, o, i.chartArea);
    }
  },
  beforeDatasetDraw(i, t, e) {
    const s = t.meta.$filler;
    !ro(s) || e.drawTime !== "beforeDatasetDraw" || as(i.ctx, s, i.chartArea);
  },
  defaults: {
    propagate: !0,
    drawTime: "beforeDatasetDraw"
  }
};
const ho = (i, t) => {
  let { boxHeight: e = t, boxWidth: s = t } = i;
  return i.usePointStyle && (e = Math.min(e, t), s = i.pointStyleWidth || Math.min(s, t)), {
    boxWidth: s,
    boxHeight: e,
    itemHeight: Math.max(t, e)
  };
}, su = (i, t) => i !== null && t !== null && i.datasetIndex === t.datasetIndex && i.index === t.index;
class uo extends xt {
  constructor(t) {
    super(), this._added = !1, this.legendHitBoxes = [], this._hoveredItem = null, this.doughnutMode = !1, this.chart = t.chart, this.options = t.options, this.ctx = t.ctx, this.legendItems = void 0, this.columnSizes = void 0, this.lineWidths = void 0, this.maxHeight = void 0, this.maxWidth = void 0, this.top = void 0, this.bottom = void 0, this.left = void 0, this.right = void 0, this.height = void 0, this.width = void 0, this._margins = void 0, this.position = void 0, this.weight = void 0, this.fullSize = void 0;
  }
  update(t, e, s) {
    this.maxWidth = t, this.maxHeight = e, this._margins = s, this.setDimensions(), this.buildLabels(), this.fit();
  }
  setDimensions() {
    this.isHorizontal() ? (this.width = this.maxWidth, this.left = this._margins.left, this.right = this.width) : (this.height = this.maxHeight, this.top = this._margins.top, this.bottom = this.height);
  }
  buildLabels() {
    const t = this.options.labels || {};
    let e = F(t.generateLabels, [
      this.chart
    ], this) || [];
    t.filter && (e = e.filter((s) => t.filter(s, this.chart.data))), t.sort && (e = e.sort((s, n) => t.sort(s, n, this.chart.data))), this.options.reverse && e.reverse(), this.legendItems = e;
  }
  fit() {
    const { options: t, ctx: e } = this;
    if (!t.display) {
      this.width = this.height = 0;
      return;
    }
    const s = t.labels, n = Z(s.font), o = n.size, r = this._computeTitleHeight(), { boxWidth: a, itemHeight: l } = ho(s, o);
    let c, h;
    e.font = n.string, this.isHorizontal() ? (c = this.maxWidth, h = this._fitRows(r, o, a, l) + 10) : (h = this.maxHeight, c = this._fitCols(r, n, a, l) + 10), this.width = Math.min(c, t.maxWidth || this.maxWidth), this.height = Math.min(h, t.maxHeight || this.maxHeight);
  }
  _fitRows(t, e, s, n) {
    const { ctx: o, maxWidth: r, options: { labels: { padding: a } } } = this, l = this.legendHitBoxes = [], c = this.lineWidths = [
      0
    ], h = n + a;
    let d = t;
    o.textAlign = "left", o.textBaseline = "middle";
    let u = -1, f = -h;
    return this.legendItems.forEach((g, p) => {
      const m = s + e / 2 + o.measureText(g.text).width;
      (p === 0 || c[c.length - 1] + m + 2 * a > r) && (d += h, c[c.length - (p > 0 ? 0 : 1)] = 0, f += h, u++), l[p] = {
        left: 0,
        top: f,
        row: u,
        width: m,
        height: n
      }, c[c.length - 1] += m + a;
    }), d;
  }
  _fitCols(t, e, s, n) {
    const { ctx: o, maxHeight: r, options: { labels: { padding: a } } } = this, l = this.legendHitBoxes = [], c = this.columnSizes = [], h = r - t;
    let d = a, u = 0, f = 0, g = 0, p = 0;
    return this.legendItems.forEach((m, b) => {
      const { itemWidth: _, itemHeight: x } = nu(s, e, o, m, n);
      b > 0 && f + x + 2 * a > h && (d += u + a, c.push({
        width: u,
        height: f
      }), g += u + a, p++, u = f = 0), l[b] = {
        left: g,
        top: f,
        col: p,
        width: _,
        height: x
      }, u = Math.max(u, _), f += x + a;
    }), d += u, c.push({
      width: u,
      height: f
    }), d;
  }
  adjustHitBoxes() {
    if (!this.options.display)
      return;
    const t = this._computeTitleHeight(), { legendHitBoxes: e, options: { align: s, labels: { padding: n }, rtl: o } } = this, r = re(o, this.left, this.width);
    if (this.isHorizontal()) {
      let a = 0, l = J(s, this.left + n, this.right - this.lineWidths[a]);
      for (const c of e)
        a !== c.row && (a = c.row, l = J(s, this.left + n, this.right - this.lineWidths[a])), c.top += this.top + t + n, c.left = r.leftForLtr(r.x(l), c.width), l += c.width + n;
    } else {
      let a = 0, l = J(s, this.top + t + n, this.bottom - this.columnSizes[a].height);
      for (const c of e)
        c.col !== a && (a = c.col, l = J(s, this.top + t + n, this.bottom - this.columnSizes[a].height)), c.top = l, c.left += this.left + n, c.left = r.leftForLtr(r.x(c.left), c.width), l += c.height + n;
    }
  }
  isHorizontal() {
    return this.options.position === "top" || this.options.position === "bottom";
  }
  draw() {
    if (this.options.display) {
      const t = this.ctx;
      zi(t, this), this._draw(), Bi(t);
    }
  }
  _draw() {
    const { options: t, columnSizes: e, lineWidths: s, ctx: n } = this, { align: o, labels: r } = t, a = B.color, l = re(t.rtl, this.left, this.width), c = Z(r.font), { padding: h } = r, d = c.size, u = d / 2;
    let f;
    this.drawTitle(), n.textAlign = l.textAlign("left"), n.textBaseline = "middle", n.lineWidth = 0.5, n.font = c.string;
    const { boxWidth: g, boxHeight: p, itemHeight: m } = ho(r, d), b = function(k, S, w) {
      if (isNaN(g) || g <= 0 || isNaN(p) || p < 0)
        return;
      n.save();
      const A = $(w.lineWidth, 1);
      if (n.fillStyle = $(w.fillStyle, a), n.lineCap = $(w.lineCap, "butt"), n.lineDashOffset = $(w.lineDashOffset, 0), n.lineJoin = $(w.lineJoin, "miter"), n.lineWidth = A, n.strokeStyle = $(w.strokeStyle, a), n.setLineDash($(w.lineDash, [])), r.usePointStyle) {
        const T = {
          radius: p * Math.SQRT2 / 2,
          pointStyle: w.pointStyle,
          rotation: w.rotation,
          borderWidth: A
        }, C = l.xPlus(k, g / 2), E = S + u;
        ir(n, T, C, E, r.pointStyleWidth && g);
      } else {
        const T = S + Math.max((d - p) / 2, 0), C = l.leftForLtr(k, g), E = oe(w.borderRadius);
        n.beginPath(), Object.values(E).some((X) => X !== 0) ? Ci(n, {
          x: C,
          y: T,
          w: g,
          h: p,
          radius: E
        }) : n.rect(C, T, g, p), n.fill(), A !== 0 && n.stroke();
      }
      n.restore();
    }, _ = function(k, S, w) {
      $i(n, w.text, k, S + m / 2, c, {
        strikethrough: w.hidden,
        textAlign: l.textAlign(w.textAlign)
      });
    }, x = this.isHorizontal(), v = this._computeTitleHeight();
    x ? f = {
      x: J(o, this.left + h, this.right - s[0]),
      y: this.top + h + v,
      line: 0
    } : f = {
      x: this.left + h,
      y: J(o, this.top + v + h, this.bottom - e[0].height),
      line: 0
    }, hr(this.ctx, t.textDirection);
    const y = m + h;
    this.legendItems.forEach((k, S) => {
      n.strokeStyle = k.fontColor, n.fillStyle = k.fontColor;
      const w = n.measureText(k.text).width, A = l.textAlign(k.textAlign || (k.textAlign = r.textAlign)), T = g + u + w;
      let C = f.x, E = f.y;
      l.setWidth(this.width), x ? S > 0 && C + T + h > this.right && (E = f.y += y, f.line++, C = f.x = J(o, this.left + h, this.right - s[f.line])) : S > 0 && E + y > this.bottom && (C = f.x = C + e[f.line].width + h, f.line++, E = f.y = J(o, this.top + v + h, this.bottom - e[f.line].height));
      const X = l.x(C);
      if (b(X, E, k), C = Nl(A, C + g + u, x ? C + T : this.right, t.rtl), _(l.x(C), E, k), x)
        f.x += T + h;
      else if (typeof k.text != "string") {
        const lt = c.lineHeight;
        f.y += Er(k, lt) + h;
      } else
        f.y += y;
    }), dr(this.ctx, t.textDirection);
  }
  drawTitle() {
    const t = this.options, e = t.title, s = Z(e.font), n = at(e.padding);
    if (!e.display)
      return;
    const o = re(t.rtl, this.left, this.width), r = this.ctx, a = e.position, l = s.size / 2, c = n.top + l;
    let h, d = this.left, u = this.width;
    if (this.isHorizontal())
      u = Math.max(...this.lineWidths), h = this.top + c, d = J(t.align, d, this.right - u);
    else {
      const g = this.columnSizes.reduce((p, m) => Math.max(p, m.height), 0);
      h = c + J(t.align, this.top, this.bottom - g - t.labels.padding - this._computeTitleHeight());
    }
    const f = J(a, d, d + u);
    r.textAlign = o.textAlign(Jo(a)), r.textBaseline = "middle", r.strokeStyle = e.color, r.fillStyle = e.color, r.font = s.string, $i(r, e.text, f, h, s);
  }
  _computeTitleHeight() {
    const t = this.options.title, e = Z(t.font), s = at(t.padding);
    return t.display ? e.lineHeight + s.height : 0;
  }
  _getLegendItemAt(t, e) {
    let s, n, o;
    if (St(t, this.left, this.right) && St(e, this.top, this.bottom)) {
      for (o = this.legendHitBoxes, s = 0; s < o.length; ++s)
        if (n = o[s], St(t, n.left, n.left + n.width) && St(e, n.top, n.top + n.height))
          return this.legendItems[s];
    }
    return null;
  }
  handleEvent(t) {
    const e = this.options;
    if (!au(t.type, e))
      return;
    const s = this._getLegendItemAt(t.x, t.y);
    if (t.type === "mousemove" || t.type === "mouseout") {
      const n = this._hoveredItem, o = su(n, s);
      n && !o && F(e.onLeave, [
        t,
        n,
        this
      ], this), this._hoveredItem = s, s && !o && F(e.onHover, [
        t,
        s,
        this
      ], this);
    } else s && F(e.onClick, [
      t,
      s,
      this
    ], this);
  }
}
function nu(i, t, e, s, n) {
  const o = ou(s, i, t, e), r = ru(n, s, t.lineHeight);
  return {
    itemWidth: o,
    itemHeight: r
  };
}
function ou(i, t, e, s) {
  let n = i.text;
  return n && typeof n != "string" && (n = n.reduce((o, r) => o.length > r.length ? o : r)), t + e.size / 2 + s.measureText(n).width;
}
function ru(i, t, e) {
  let s = i;
  return typeof t.text != "string" && (s = Er(t, e)), s;
}
function Er(i, t) {
  const e = i.text ? i.text.length : 0;
  return t * e;
}
function au(i, t) {
  return !!((i === "mousemove" || i === "mouseout") && (t.onHover || t.onLeave) || t.onClick && (i === "click" || i === "mouseup"));
}
var lu = {
  id: "legend",
  _element: uo,
  start(i, t, e) {
    const s = i.legend = new uo({
      ctx: i.ctx,
      options: e,
      chart: i
    });
    Mt.configure(i, s, e), Mt.addBox(i, s);
  },
  stop(i) {
    Mt.removeBox(i, i.legend), delete i.legend;
  },
  beforeUpdate(i, t, e) {
    const s = i.legend;
    Mt.configure(i, s, e), s.options = e;
  },
  afterUpdate(i) {
    const t = i.legend;
    t.buildLabels(), t.adjustHitBoxes();
  },
  afterEvent(i, t) {
    t.replay || i.legend.handleEvent(t.event);
  },
  defaults: {
    display: !0,
    position: "top",
    align: "center",
    fullSize: !0,
    reverse: !1,
    weight: 1e3,
    onClick(i, t, e) {
      const s = t.datasetIndex, n = e.chart;
      n.isDatasetVisible(s) ? (n.hide(s), t.hidden = !0) : (n.show(s), t.hidden = !1);
    },
    onHover: null,
    onLeave: null,
    labels: {
      color: (i) => i.chart.options.color,
      boxWidth: 40,
      padding: 10,
      generateLabels(i) {
        const t = i.data.datasets, { labels: { usePointStyle: e, pointStyle: s, textAlign: n, color: o, useBorderRadius: r, borderRadius: a } } = i.legend.options;
        return i._getSortedDatasetMetas().map((l) => {
          const c = l.controller.getStyle(e ? 0 : void 0), h = at(c.borderWidth);
          return {
            text: t[l.index].label,
            fillStyle: c.backgroundColor,
            fontColor: o,
            hidden: !l.visible,
            lineCap: c.borderCapStyle,
            lineDash: c.borderDash,
            lineDashOffset: c.borderDashOffset,
            lineJoin: c.borderJoinStyle,
            lineWidth: (h.width + h.height) / 4,
            strokeStyle: c.borderColor,
            pointStyle: s || c.pointStyle,
            rotation: c.rotation,
            textAlign: n || c.textAlign,
            borderRadius: r && (a || c.borderRadius),
            datasetIndex: l.index
          };
        }, this);
      }
    },
    title: {
      color: (i) => i.chart.options.color,
      display: !1,
      position: "center",
      text: ""
    }
  },
  descriptors: {
    _scriptable: (i) => !i.startsWith("on"),
    labels: {
      _scriptable: (i) => ![
        "generateLabels",
        "filter",
        "sort"
      ].includes(i)
    }
  }
};
const Pe = {
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
        const c = l.getCenterPoint(), h = fs(t, c);
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
function ht(i, t) {
  return t && (W(t) ? Array.prototype.push.apply(i, t) : i.push(t)), i;
}
function _t(i) {
  return (typeof i == "string" || i instanceof String) && i.indexOf(`
`) > -1 ? i.split(`
`) : i;
}
function cu(i, t) {
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
function fo(i, t) {
  const e = i.chart.ctx, { body: s, footer: n, title: o } = i, { boxWidth: r, boxHeight: a } = t, l = Z(t.bodyFont), c = Z(t.titleFont), h = Z(t.footerFont), d = o.length, u = n.length, f = s.length, g = at(t.padding);
  let p = g.height, m = 0, b = s.reduce((v, y) => v + y.before.length + y.lines.length + y.after.length, 0);
  if (b += i.beforeBody.length + i.afterBody.length, d && (p += d * c.lineHeight + (d - 1) * t.titleSpacing + t.titleMarginBottom), b) {
    const v = t.displayColors ? Math.max(a, l.lineHeight) : l.lineHeight;
    p += f * v + (b - f) * l.lineHeight + (b - 1) * t.bodySpacing;
  }
  u && (p += t.footerMarginTop + u * h.lineHeight + (u - 1) * t.footerSpacing);
  let _ = 0;
  const x = function(v) {
    m = Math.max(m, e.measureText(v).width + _);
  };
  return e.save(), e.font = c.string, I(i.title, x), e.font = l.string, I(i.beforeBody.concat(i.afterBody), x), _ = t.displayColors ? r + 2 + t.boxPadding : 0, I(s, (v) => {
    I(v.before, x), I(v.lines, x), I(v.after, x);
  }), _ = 0, e.font = h.string, I(i.footer, x), e.restore(), m += g.width, {
    width: m,
    height: p
  };
}
function hu(i, t) {
  const { y: e, height: s } = t;
  return e < s / 2 ? "top" : e > i.height - s / 2 ? "bottom" : "center";
}
function du(i, t, e, s) {
  const { x: n, width: o } = s, r = e.caretSize + e.caretPadding;
  if (i === "left" && n + o + r > t.width || i === "right" && n - o - r < 0)
    return !0;
}
function uu(i, t, e, s) {
  const { x: n, width: o } = e, { width: r, chartArea: { left: a, right: l } } = i;
  let c = "center";
  return s === "center" ? c = n <= (a + l) / 2 ? "left" : "right" : n <= o / 2 ? c = "left" : n >= r - o / 2 && (c = "right"), du(c, i, t, e) && (c = "center"), c;
}
function po(i, t, e) {
  const s = e.yAlign || t.yAlign || hu(i, e);
  return {
    xAlign: e.xAlign || t.xAlign || uu(i, t, e, s),
    yAlign: s
  };
}
function fu(i, t) {
  let { x: e, width: s } = i;
  return t === "right" ? e -= s : t === "center" && (e -= s / 2), e;
}
function pu(i, t, e) {
  let { y: s, height: n } = i;
  return t === "top" ? s += e : t === "bottom" ? s -= n + e : s -= n / 2, s;
}
function go(i, t, e, s) {
  const { caretSize: n, caretPadding: o, cornerRadius: r } = i, { xAlign: a, yAlign: l } = e, c = n + o, { topLeft: h, topRight: d, bottomLeft: u, bottomRight: f } = oe(r);
  let g = fu(t, a);
  const p = pu(t, l, c);
  return l === "center" ? a === "left" ? g += c : a === "right" && (g -= c) : a === "left" ? g -= Math.max(h, u) + n : a === "right" && (g += Math.max(d, f) + n), {
    x: et(g, 0, s.width - t.width),
    y: et(p, 0, s.height - t.height)
  };
}
function ui(i, t, e) {
  const s = at(e.padding);
  return t === "center" ? i.x + i.width / 2 : t === "right" ? i.x + i.width - s.right : i.x + s.left;
}
function mo(i) {
  return ht([], _t(i));
}
function gu(i, t, e) {
  return te(i, {
    tooltip: t,
    tooltipItems: e,
    type: "tooltip"
  });
}
function bo(i, t) {
  const e = t && t.dataset && t.dataset.tooltip && t.dataset.tooltip.callbacks;
  return e ? i.override(e) : i;
}
const Lr = {
  beforeTitle: gt,
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
  afterTitle: gt,
  beforeBody: gt,
  beforeLabel: gt,
  label(i) {
    if (this && this.options && this.options.mode === "dataset")
      return i.label + ": " + i.formattedValue || i.formattedValue;
    let t = i.dataset.label || "";
    t && (t += ": ");
    const e = i.formattedValue;
    return R(e) || (t += e), t;
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
  afterLabel: gt,
  afterBody: gt,
  beforeFooter: gt,
  footer: gt,
  afterFooter: gt
};
function q(i, t, e, s) {
  const n = i[t].call(e, s);
  return typeof n > "u" ? Lr[t].call(e, s) : n;
}
class xs extends xt {
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
    const e = this.chart, s = this.options.setContext(this.getContext()), n = s.enabled && e.options.animation && s.animations, o = new mr(this.chart, n);
    return n._cacheable && (this._cachedAnimations = Object.freeze(o)), o;
  }
  getContext() {
    return this.$context || (this.$context = gu(this.chart.getContext(), this, this._tooltipItems));
  }
  getTitle(t, e) {
    const { callbacks: s } = e, n = q(s, "beforeTitle", this, t), o = q(s, "title", this, t), r = q(s, "afterTitle", this, t);
    let a = [];
    return a = ht(a, _t(n)), a = ht(a, _t(o)), a = ht(a, _t(r)), a;
  }
  getBeforeBody(t, e) {
    return mo(q(e.callbacks, "beforeBody", this, t));
  }
  getBody(t, e) {
    const { callbacks: s } = e, n = [];
    return I(t, (o) => {
      const r = {
        before: [],
        lines: [],
        after: []
      }, a = bo(s, o);
      ht(r.before, _t(q(a, "beforeLabel", this, o))), ht(r.lines, q(a, "label", this, o)), ht(r.after, _t(q(a, "afterLabel", this, o))), n.push(r);
    }), n;
  }
  getAfterBody(t, e) {
    return mo(q(e.callbacks, "afterBody", this, t));
  }
  getFooter(t, e) {
    const { callbacks: s } = e, n = q(s, "beforeFooter", this, t), o = q(s, "footer", this, t), r = q(s, "afterFooter", this, t);
    let a = [];
    return a = ht(a, _t(n)), a = ht(a, _t(o)), a = ht(a, _t(r)), a;
  }
  _createItems(t) {
    const e = this._active, s = this.chart.data, n = [], o = [], r = [];
    let a = [], l, c;
    for (l = 0, c = e.length; l < c; ++l)
      a.push(cu(this.chart, e[l]));
    return t.filter && (a = a.filter((h, d, u) => t.filter(h, d, u, s))), t.itemSort && (a = a.sort((h, d) => t.itemSort(h, d, s))), I(a, (h) => {
      const d = bo(t.callbacks, h);
      n.push(q(d, "labelColor", this, h)), o.push(q(d, "labelPointStyle", this, h)), r.push(q(d, "labelTextColor", this, h));
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
      const a = Pe[s.position].call(this, n, this._eventPosition);
      r = this._createItems(s), this.title = this.getTitle(r, s), this.beforeBody = this.getBeforeBody(r, s), this.body = this.getBody(r, s), this.afterBody = this.getAfterBody(r, s), this.footer = this.getFooter(r, s);
      const l = this._size = fo(this, s), c = Object.assign({}, a, l), h = po(this.chart, s, c), d = go(s, c, h, this.chart);
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
    const { xAlign: n, yAlign: o } = this, { caretSize: r, cornerRadius: a } = s, { topLeft: l, topRight: c, bottomLeft: h, bottomRight: d } = oe(a), { x: u, y: f } = t, { width: g, height: p } = e;
    let m, b, _, x, v, y;
    return o === "center" ? (v = f + p / 2, n === "left" ? (m = u, b = m - r, x = v + r, y = v - r) : (m = u + g, b = m + r, x = v - r, y = v + r), _ = m) : (n === "left" ? b = u + Math.max(l, h) + r : n === "right" ? b = u + g - Math.max(c, d) - r : b = this.caretX, o === "top" ? (x = f, v = x - r, m = b - r, _ = b + r) : (x = f + p, v = x + r, m = b + r, _ = b - r), y = x), {
      x1: m,
      x2: b,
      x3: _,
      y1: x,
      y2: v,
      y3: y
    };
  }
  drawTitle(t, e, s) {
    const n = this.title, o = n.length;
    let r, a, l;
    if (o) {
      const c = re(s.rtl, this.x, this.width);
      for (t.x = ui(this, s.titleAlign, s), e.textAlign = c.textAlign(s.titleAlign), e.textBaseline = "middle", r = Z(s.titleFont), a = s.titleSpacing, e.fillStyle = s.titleColor, e.font = r.string, l = 0; l < o; ++l)
        e.fillText(n[l], c.x(t.x), t.y + r.lineHeight / 2), t.y += r.lineHeight + a, l + 1 === o && (t.y += s.titleMarginBottom - a);
    }
  }
  _drawColorBox(t, e, s, n, o) {
    const r = this.labelColors[s], a = this.labelPointStyles[s], { boxHeight: l, boxWidth: c } = o, h = Z(o.bodyFont), d = ui(this, "left", o), u = n.x(d), f = l < h.lineHeight ? (h.lineHeight - l) / 2 : 0, g = e.y + f;
    if (o.usePointStyle) {
      const p = {
        radius: Math.min(c, l) / 2,
        pointStyle: a.pointStyle,
        rotation: a.rotation,
        borderWidth: 1
      }, m = n.leftForLtr(u, c) + c / 2, b = g + l / 2;
      t.strokeStyle = o.multiKeyBackground, t.fillStyle = o.multiKeyBackground, gs(t, p, m, b), t.strokeStyle = r.borderColor, t.fillStyle = r.backgroundColor, gs(t, p, m, b);
    } else {
      t.lineWidth = O(r.borderWidth) ? Math.max(...Object.values(r.borderWidth)) : r.borderWidth || 1, t.strokeStyle = r.borderColor, t.setLineDash(r.borderDash || []), t.lineDashOffset = r.borderDashOffset || 0;
      const p = n.leftForLtr(u, c), m = n.leftForLtr(n.xPlus(u, 1), c - 2), b = oe(r.borderRadius);
      Object.values(b).some((_) => _ !== 0) ? (t.beginPath(), t.fillStyle = o.multiKeyBackground, Ci(t, {
        x: p,
        y: g,
        w: c,
        h: l,
        radius: b
      }), t.fill(), t.stroke(), t.fillStyle = r.backgroundColor, t.beginPath(), Ci(t, {
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
    const { body: n } = this, { bodySpacing: o, bodyAlign: r, displayColors: a, boxHeight: l, boxWidth: c, boxPadding: h } = s, d = Z(s.bodyFont);
    let u = d.lineHeight, f = 0;
    const g = re(s.rtl, this.x, this.width), p = function(w) {
      e.fillText(w, g.x(t.x + f), t.y + u / 2), t.y += u + o;
    }, m = g.textAlign(r);
    let b, _, x, v, y, k, S;
    for (e.textAlign = r, e.textBaseline = "middle", e.font = d.string, t.x = ui(this, m, s), e.fillStyle = s.bodyColor, I(this.beforeBody, p), f = a && m !== "right" ? r === "center" ? c / 2 + h : c + 2 + h : 0, v = 0, k = n.length; v < k; ++v) {
      for (b = n[v], _ = this.labelTextColors[v], e.fillStyle = _, I(b.before, p), x = b.lines, a && x.length && (this._drawColorBox(e, t, v, g, s), u = Math.max(d.lineHeight, l)), y = 0, S = x.length; y < S; ++y)
        p(x[y]), u = d.lineHeight;
      I(b.after, p);
    }
    f = 0, u = d.lineHeight, I(this.afterBody, p), t.y -= o;
  }
  drawFooter(t, e, s) {
    const n = this.footer, o = n.length;
    let r, a;
    if (o) {
      const l = re(s.rtl, this.x, this.width);
      for (t.x = ui(this, s.footerAlign, s), t.y += s.footerMarginTop, e.textAlign = l.textAlign(s.footerAlign), e.textBaseline = "middle", r = Z(s.footerFont), e.fillStyle = s.footerColor, e.font = r.string, a = 0; a < o; ++a)
        e.fillText(n[a], l.x(t.x), t.y + r.lineHeight / 2), t.y += r.lineHeight + s.footerSpacing;
    }
  }
  drawBackground(t, e, s, n) {
    const { xAlign: o, yAlign: r } = this, { x: a, y: l } = t, { width: c, height: h } = s, { topLeft: d, topRight: u, bottomLeft: f, bottomRight: g } = oe(n.cornerRadius);
    e.fillStyle = n.backgroundColor, e.strokeStyle = n.borderColor, e.lineWidth = n.borderWidth, e.beginPath(), e.moveTo(a + d, l), r === "top" && this.drawCaret(t, e, s, n), e.lineTo(a + c - u, l), e.quadraticCurveTo(a + c, l, a + c, l + u), r === "center" && o === "right" && this.drawCaret(t, e, s, n), e.lineTo(a + c, l + h - g), e.quadraticCurveTo(a + c, l + h, a + c - g, l + h), r === "bottom" && this.drawCaret(t, e, s, n), e.lineTo(a + f, l + h), e.quadraticCurveTo(a, l + h, a, l + h - f), r === "center" && o === "left" && this.drawCaret(t, e, s, n), e.lineTo(a, l + d), e.quadraticCurveTo(a, l, a + d, l), e.closePath(), e.fill(), n.borderWidth > 0 && e.stroke();
  }
  _updateAnimationTarget(t) {
    const e = this.chart, s = this.$animations, n = s && s.x, o = s && s.y;
    if (n || o) {
      const r = Pe[t.position].call(this, this._active, this._eventPosition);
      if (!r)
        return;
      const a = this._size = fo(this, t), l = Object.assign({}, r, this._size), c = po(e, t, l), h = go(t, l, c, e);
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
    const r = at(e.padding), a = this.title.length || this.beforeBody.length || this.body.length || this.afterBody.length || this.footer.length;
    e.enabled && a && (t.save(), t.globalAlpha = s, this.drawBackground(o, t, n, e), hr(t, e.textDirection), o.y += r.top, this.drawTitle(o, t, e), this.drawBody(o, t, e), this.drawFooter(o, t, e), dr(t, e.textDirection), t.restore());
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
    }), o = !Mi(s, n), r = this._positionChanged(n, e);
    (o || r) && (this._active = n, this._eventPosition = e, this._ignoreReplayEvents = !0, this.update(!0));
  }
  handleEvent(t, e, s = !0) {
    if (e && this._ignoreReplayEvents)
      return !1;
    this._ignoreReplayEvents = !1;
    const n = this.options, o = this._active || [], r = this._getActiveElements(t, o, e, s), a = this._positionChanged(r, t), l = e || !Mi(r, o) || a;
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
    const { caretX: s, caretY: n, options: o } = this, r = Pe[o.position].call(this, t, e);
    return r !== !1 && (s !== r.x || n !== r.y);
  }
}
M(xs, "positioners", Pe);
var Bs = {
  id: "tooltip",
  _element: xs,
  positioners: Pe,
  afterInit(i, t, e) {
    e && (i.tooltip = new xs({
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
    callbacks: Lr
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
const mu = (i, t, e, s) => (typeof t == "string" ? (e = i.push(t) - 1, s.unshift({
  index: e,
  label: t
})) : isNaN(t) && (e = null), e);
function bu(i, t, e, s) {
  const n = i.indexOf(t);
  if (n === -1)
    return mu(i, t, e, s);
  const o = i.lastIndexOf(t);
  return n !== o ? e : n;
}
const _u = (i, t) => i === null ? null : et(Math.round(i), 0, t);
function _o(i) {
  const t = this.getLabels();
  return i >= 0 && i < t.length ? t[i] : i;
}
class Ke extends pe {
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
    if (R(t))
      return null;
    const s = this.getLabels();
    return e = isFinite(e) && s[e] === t ? e : bu(s, t, $(e, t), this._addedLabels), _u(e, s.length - 1);
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
    return _o.call(this, t);
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
M(Ke, "id", "category"), M(Ke, "defaults", {
  ticks: {
    callback: _o
  }
});
function yu(i, t) {
  const e = [], { bounds: n, step: o, min: r, max: a, precision: l, count: c, maxTicks: h, maxDigits: d, includeBounds: u } = i, f = o || 1, g = h - 1, { min: p, max: m } = t, b = !R(r), _ = !R(a), x = !R(c), v = (m - p) / (d + 1);
  let y = pn((m - p) / g / f) * f, k, S, w, A;
  if (y < 1e-14 && !b && !_)
    return [
      {
        value: p
      },
      {
        value: m
      }
    ];
  A = Math.ceil(m / y) - Math.floor(p / y), A > g && (y = pn(A * y / g / f) * f), R(l) || (k = Math.pow(10, l), y = Math.ceil(y * k) / k), n === "ticks" ? (S = Math.floor(p / y) * y, w = Math.ceil(m / y) * y) : (S = p, w = m), b && _ && o && Dl((a - r) / o, y / 1e3) ? (A = Math.round(Math.min((a - r) / y, h)), y = (a - r) / A, S = r, w = a) : x ? (S = b ? r : S, w = _ ? a : w, A = c - 1, y = (w - S) / A) : (A = (w - S) / y, Te(A, Math.round(A), y / 1e3) ? A = Math.round(A) : A = Math.ceil(A));
  const T = Math.max(gn(y), gn(S));
  k = Math.pow(10, R(l) ? T : l), S = Math.round(S * k) / k, w = Math.round(w * k) / k;
  let C = 0;
  for (b && (u && S !== r ? (e.push({
    value: r
  }), S < r && C++, Te(Math.round((S + C * y) * k) / k, r, yo(r, v, i)) && C++) : S < r && C++); C < A; ++C) {
    const E = Math.round((S + C * y) * k) / k;
    if (_ && E > a)
      break;
    e.push({
      value: E
    });
  }
  return _ && u && w !== a ? e.length && Te(e[e.length - 1].value, a, yo(a, v, i)) ? e[e.length - 1].value = a : e.push({
    value: a
  }) : (!_ || w === a) && e.push({
    value: w
  }), e;
}
function yo(i, t, { horizontal: e, minRotation: s }) {
  const n = Xt(s), o = (e ? Math.sin(n) : Math.cos(n)) || 1e-3, r = 0.75 * t * ("" + i).length;
  return Math.min(t / o, r);
}
class xu extends pe {
  constructor(t) {
    super(t), this.start = void 0, this.end = void 0, this._startValue = void 0, this._endValue = void 0, this._valueRange = 0;
  }
  parse(t, e) {
    return R(t) || (typeof t == "number" || t instanceof Number) && !isFinite(+t) ? null : +t;
  }
  handleTickRangeOptions() {
    const { beginAtZero: t } = this.options, { minDefined: e, maxDefined: s } = this.getUserBounds();
    let { min: n, max: o } = this;
    const r = (l) => n = e ? n : l, a = (l) => o = s ? o : l;
    if (t) {
      const l = ft(n), c = ft(o);
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
    }, o = this._range || this, r = yu(n, o);
    return t.bounds === "ticks" && Tl(r, this, "value"), t.reverse ? (r.reverse(), this.start = this.max, this.end = this.min) : (this.start = this.min, this.end = this.max), r;
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
    return tr(t, this.chart.options.locale, this.options.ticks.format);
  }
}
class Xe extends xu {
  determineDataLimits() {
    const { min: t, max: e } = this.getMinMax(!0);
    this.min = Y(t) ? t : 0, this.max = Y(e) ? e : 1, this.handleTickRangeOptions();
  }
  computeTickLimit() {
    const t = this.isHorizontal(), e = t ? this.width : this.height, s = Xt(this.options.ticks.minRotation), n = (t ? Math.sin(s) : Math.cos(s)) || 1e-3, o = this._resolveTickFontOptions(0);
    return Math.ceil(e / Math.min(40, o.lineHeight / n));
  }
  getPixelForValue(t) {
    return t === null ? NaN : this.getPixelForDecimal((t - this._startValue) / this._valueRange);
  }
  getValueForPixel(t) {
    return this._startValue + this.getDecimalForPixel(t) * this._valueRange;
  }
}
M(Xe, "id", "linear"), M(Xe, "defaults", {
  ticks: {
    callback: er.formatters.numeric
  }
});
const ji = {
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
}, G = /* @__PURE__ */ Object.keys(ji);
function xo(i, t) {
  return i - t;
}
function vo(i, t) {
  if (R(t))
    return null;
  const e = i._adapter, { parser: s, round: n, isoWeekday: o } = i._parseOpts;
  let r = t;
  return typeof s == "function" && (r = s(r)), Y(r) || (r = typeof s == "string" ? e.parse(r, s) : e.parse(r)), r === null ? null : (n && (r = n === "week" && (Ve(o) || o === !0) ? e.startOf(r, "isoWeek", o) : e.startOf(r, n)), +r);
}
function wo(i, t, e, s) {
  const n = G.length;
  for (let o = G.indexOf(i); o < n - 1; ++o) {
    const r = ji[G[o]], a = r.steps ? r.steps : Number.MAX_SAFE_INTEGER;
    if (r.common && Math.ceil((e - t) / (a * r.size)) <= s)
      return G[o];
  }
  return G[n - 1];
}
function vu(i, t, e, s, n) {
  for (let o = G.length - 1; o >= G.indexOf(e); o--) {
    const r = G[o];
    if (ji[r].common && i._adapter.diff(n, s, r) >= t - 1)
      return r;
  }
  return G[e ? G.indexOf(e) : 0];
}
function wu(i) {
  for (let t = G.indexOf(i) + 1, e = G.length; t < e; ++t)
    if (ji[G[t]].common)
      return G[t];
}
function So(i, t, e) {
  if (!e)
    i[t] = !0;
  else if (e.length) {
    const { lo: s, hi: n } = Ds(e, t), o = e[s] >= t ? e[s] : e[n];
    i[o] = !0;
  }
}
function Su(i, t, e, s) {
  const n = i._adapter, o = +n.startOf(t[0].value, s), r = t[t.length - 1].value;
  let a, l;
  for (a = o; a <= r; a = +n.add(a, 1, s))
    l = e[a], l >= 0 && (t[l].major = !0);
  return t;
}
function ko(i, t, e) {
  const s = [], n = {}, o = t.length;
  let r, a;
  for (r = 0; r < o; ++r)
    a = t[r], n[a] = r, s.push({
      value: a,
      major: !1
    });
  return o === 0 || !e ? s : Su(i, s, n, e);
}
class Ti extends pe {
  constructor(t) {
    super(t), this._cache = {
      data: [],
      labels: [],
      all: []
    }, this._unit = "day", this._majorUnit = void 0, this._offsets = {}, this._normalized = !1, this._parseOpts = void 0;
  }
  init(t, e = {}) {
    const s = t.time || (t.time = {}), n = this._adapter = new ph._date(t.adapters.date);
    n.init(e), De(s.displayFormats, n.formats()), this._parseOpts = {
      parser: s.parser,
      round: s.round,
      isoWeekday: s.isoWeekday
    }, super.init(t), this._normalized = e.normalized;
  }
  parse(t, e) {
    return t === void 0 ? null : vo(this, t);
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
    (!r || !a) && (l(this._getLabelBounds()), (t.bounds !== "ticks" || t.ticks.source !== "labels") && l(this.getMinMax(!1))), n = Y(n) && !isNaN(n) ? n : +e.startOf(Date.now(), s), o = Y(o) && !isNaN(o) ? o : +e.endOf(Date.now(), s) + 1, this.min = Math.min(n, o - 1), this.max = Math.max(n + 1, o);
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
    const o = this.min, r = this.max, a = zl(n, o, r);
    return this._unit = e.unit || (s.autoSkip ? wo(e.minUnit, this.min, this.max, this._getLabelCapacity(o)) : vu(this, a.length, e.minUnit, this.min, this.max)), this._majorUnit = !s.major.enabled || this._unit === "year" ? void 0 : wu(this._unit), this.initOffsets(n), t.reverse && a.reverse(), ko(this, a, this._majorUnit);
  }
  afterAutoSkip() {
    this.options.offsetAfterAutoskip && this.initOffsets(this.ticks.map((t) => +t.value));
  }
  initOffsets(t = []) {
    let e = 0, s = 0, n, o;
    this.options.offset && t.length && (n = this.getDecimalForValue(t[0]), t.length === 1 ? e = 1 - n : e = (this.getDecimalForValue(t[1]) - n) / 2, o = this.getDecimalForValue(t[t.length - 1]), t.length === 1 ? s = o : s = (o - this.getDecimalForValue(t[t.length - 2])) / 2);
    const r = t.length < 3 ? 0.5 : 0.25;
    e = et(e, 0, r), s = et(s, 0, r), this._offsets = {
      start: e,
      end: s,
      factor: 1 / (e + 1 + s)
    };
  }
  _generate() {
    const t = this._adapter, e = this.min, s = this.max, n = this.options, o = n.time, r = o.unit || wo(o.minUnit, e, s, this._getLabelCapacity(e)), a = $(n.ticks.stepSize, 1), l = r === "week" ? o.isoWeekday : !1, c = Ve(l) || l === !0, h = {};
    let d = e, u, f;
    if (c && (d = +t.startOf(d, "isoWeek", l)), d = +t.startOf(d, c ? "day" : r), t.diff(s, e, r) > 1e5 * a)
      throw new Error(e + " and " + s + " are too far apart with stepSize of " + a + " " + r);
    const g = n.ticks.source === "data" && this.getDataTimestamps();
    for (u = d, f = 0; u < s; u = +t.add(u, a, r), f++)
      So(h, u, g);
    return (u === s || n.bounds === "ticks" || f === 1) && So(h, u, g), Object.keys(h).sort(xo).map((p) => +p);
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
    const e = this.options.ticks, s = this.ctx.measureText(t).width, n = Xt(this.isHorizontal() ? e.maxRotation : e.minRotation), o = Math.cos(n), r = Math.sin(n), a = this._resolveTickFontOptions(0).size;
    return {
      w: s * o + a * r,
      h: s * r + a * o
    };
  }
  _getLabelCapacity(t) {
    const e = this.options.time, s = e.displayFormats, n = s[e.unit] || s.millisecond, o = this._tickFormatFunction(t, 0, ko(this, [
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
      t.push(vo(this, n[e]));
    return this._cache.labels = this._normalized ? t : this.normalize(t);
  }
  normalize(t) {
    return Go(t.sort(xo));
  }
}
M(Ti, "id", "time"), M(Ti, "defaults", {
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
function fi(i, t, e) {
  let s = 0, n = i.length - 1, o, r, a, l;
  e ? (t >= i[s].pos && t <= i[n].pos && ({ lo: s, hi: n } = qt(i, "pos", t)), { pos: o, time: a } = i[s], { pos: r, time: l } = i[n]) : (t >= i[s].time && t <= i[n].time && ({ lo: s, hi: n } = qt(i, "time", t)), { time: o, pos: a } = i[s], { time: r, pos: l } = i[n]);
  const c = r - o;
  return c ? a + (l - a) * (t - o) / c : a;
}
class Mo extends Ti {
  constructor(t) {
    super(t), this._table = [], this._minPos = void 0, this._tableRange = void 0;
  }
  initOffsets() {
    const t = this._getTimestampsForTable(), e = this._table = this.buildLookupTable(t);
    this._minPos = fi(e, this.min), this._tableRange = fi(e, this.max) - this._minPos, super.initOffsets(t);
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
    return (fi(this._table, t) - this._minPos) / this._tableRange;
  }
  getValueForPixel(t) {
    const e = this._offsets, s = this.getDecimalForPixel(t) / e.factor - e.end;
    return fi(this._table, s * this._tableRange + this._minPos, !0);
  }
}
M(Mo, "id", "timeseries"), M(Mo, "defaults", Ti.defaults);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Fe = (i, t) => {
  const e = i._$AN;
  if (e === void 0) return !1;
  for (const s of e) s._$AO?.(t, !1), Fe(s, t);
  return !0;
}, Ei = (i) => {
  let t, e;
  do {
    if ((t = i._$AM) === void 0) break;
    e = t._$AN, e.delete(i), i = t;
  } while (e?.size === 0);
}, Rr = (i) => {
  for (let t; t = i._$AM; i = t) {
    let e = t._$AN;
    if (e === void 0) t._$AN = e = /* @__PURE__ */ new Set();
    else if (e.has(i)) break;
    e.add(i), Pu(t);
  }
};
function ku(i) {
  this._$AN !== void 0 ? (Ei(this), this._$AM = i, Rr(this)) : this._$AM = i;
}
function Mu(i, t = !1, e = 0) {
  const s = this._$AH, n = this._$AN;
  if (n !== void 0 && n.size !== 0) if (t) if (Array.isArray(s)) for (let o = e; o < s.length; o++) Fe(s[o], !1), Ei(s[o]);
  else s != null && (Fe(s, !1), Ei(s));
  else Fe(this, i);
}
const Pu = (i) => {
  i.type == Io.CHILD && (i._$AP ?? (i._$AP = Mu), i._$AQ ?? (i._$AQ = ku));
};
class Au extends zo {
  constructor() {
    super(...arguments), this._$AN = void 0;
  }
  _$AT(t, e, s) {
    super._$AT(t, e, s), Rr(this), this.isConnected = t._$AU;
  }
  _$AO(t, e = !0) {
    t !== this.isConnected && (this.isConnected = t, t ? this.reconnected?.() : this.disconnected?.()), e && (Fe(this, t), Ei(this));
  }
  setValue(t) {
    if (Ta(this._$Ct)) this._$Ct._$AI(t, this);
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
const Hs = () => new $u();
class $u {
}
const cs = /* @__PURE__ */ new WeakMap(), Ns = Fo(class extends Au {
  render(i) {
    return L;
  }
  update(i, [t]) {
    const e = t !== this.G;
    return e && this.rt(void 0), (e || this.lt !== this.ct) && (this.G = t, this.ht = i.options?.host, this.rt(this.ct = i.element)), L;
  }
  rt(i) {
    if (this.G !== void 0) if (this.isConnected || (i = void 0), typeof this.G == "function") {
      const t = this.ht ?? globalThis;
      let e = cs.get(t);
      e === void 0 && (e = /* @__PURE__ */ new WeakMap(), cs.set(t, e)), e.get(this.G) !== void 0 && this.G.call(this.ht, void 0), e.set(this.G, i), i !== void 0 && this.G.call(this.ht, i);
    } else this.G.value = i;
  }
  get lt() {
    return typeof this.G == "function" ? cs.get(this.ht ?? globalThis)?.get(this.G) : this.G?.value;
  }
  disconnected() {
    this.lt === this.ct && this.rt(void 0);
  }
  reconnected() {
    this.rt(this.ct);
  }
});
var Cu = Object.defineProperty, Ou = Object.getOwnPropertyDescriptor, Ir = (i, t, e, s) => {
  for (var n = s > 1 ? void 0 : s ? Ou(t, e) : t, o = i.length - 1, r; o >= 0; o--)
    (r = i[o]) && (n = (s ? r(t, e, n) : r(n)) || n);
  return s && n && Cu(t, e, n), n;
};
tt.register(
  Re,
  Ie,
  Ke,
  Xe,
  lu,
  Bs
);
let Li = class extends nt {
  constructor() {
    super(), this._canvasRef = Hs(), this._chart = null, Tt(this);
  }
  updated() {
    if (!this.metric) return;
    const i = this._canvasRef.value;
    if (!i || this.metric.buckets.length === 0) {
      this._destroyChart();
      return;
    }
    this._chart && this._chart.canvas !== i && this._destroyChart(), this._renderChart();
  }
  disconnectedCallback() {
    this._destroyChart(), super.disconnectedCallback();
  }
  render() {
    return Q(
      this.metric,
      (i) => P`
        <div class="label">${i.label}</div>
        ${Q(
        i.description,
        () => P`<div class="description">${i.description}</div>`
      )}
        ${Q(
        i.buckets.length > 0 && i.series.length > 0,
        () => P`
            <div class="chart-wrap">
              <canvas ${Ns(this._canvasRef)}></canvas>
            </div>
          `,
        () => P`<div class="empty">
              ${D("No data in the selected range.")}
            </div>`
      )}
      `,
      () => L
    );
  }
  _renderChart() {
    const i = this._canvasRef.value;
    if (!i || !this.metric) return;
    const t = this._readToken("--lms-report-accent", "#408540"), e = this.metric.series.map((s) => ({
      label: s.label,
      data: s.values,
      backgroundColor: s.color || t
    }));
    if (this._chart) {
      this._chart.data.labels = this.metric.buckets, this._chart.data.datasets = e, this._chart.update();
      return;
    }
    this._chart = new tt(i, {
      type: "bar",
      data: { labels: this.metric.buckets, datasets: e },
      options: {
        responsive: !0,
        maintainAspectRatio: !1,
        plugins: {
          legend: { position: "bottom", labels: { boxWidth: 12 } },
          tooltip: { mode: "index", intersect: !1 }
        },
        scales: {
          x: { stacked: !0, ticks: { maxRotation: 0, autoSkipPadding: 8 } },
          y: { stacked: !0, beginAtZero: !0, ticks: { precision: 0 } }
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
Li.styles = [Rt, qe];
Ir([
  N({ attribute: !1 })
], Li.prototype, "metric", 2);
Li = Ir([
  Lt("lms-report-stacked-bar")
], Li);
var Du = Object.defineProperty, Tu = Object.getOwnPropertyDescriptor, Fr = (i, t, e, s) => {
  for (var n = s > 1 ? void 0 : s ? Tu(t, e) : t, o = i.length - 1, r; o >= 0; o--)
    (r = i[o]) && (n = (s ? r(t, e, n) : r(n)) || n);
  return s && n && Du(t, e, n), n;
};
tt.register(
  gi,
  Pt,
  _i,
  Xe,
  Ke,
  iu,
  Bs
);
let Ri = class extends nt {
  constructor() {
    super(), this._canvasRef = Hs(), this._chart = null, Tt(this);
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
    return Q(
      this.metric,
      (i) => P`
        <div class="label">${i.label}</div>
        ${Q(
        i.description,
        () => P`<div class="description">${i.description}</div>`
      )}
        ${Q(
        i.series.length > 0,
        () => P`
            <div class="chart-wrap">
              <canvas ${Ns(this._canvasRef)}></canvas>
            </div>
          `,
        () => P`<div class="empty">
              ${D("No data in the selected range.")}
            </div>`
      )}
      `,
      () => L
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
    this._chart = new tt(i, {
      type: "line",
      data: {
        labels: t,
        datasets: [
          {
            label: this.metric.label,
            data: e,
            borderColor: s,
            backgroundColor: Eu(s, 0.15),
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
Ri.styles = [Rt, qe];
Fr([
  N({ attribute: !1 })
], Ri.prototype, "metric", 2);
Ri = Fr([
  Lt("lms-report-time-series")
], Ri);
function Eu(i, t) {
  const e = i.match(/^#([0-9a-f]{6})$/i);
  if (!e) return i;
  const s = parseInt(e[1].slice(0, 2), 16), n = parseInt(e[1].slice(2, 4), 16), o = parseInt(e[1].slice(4, 6), 16);
  return `rgba(${s}, ${n}, ${o}, ${t})`;
}
var Lu = Object.defineProperty, Ru = Object.getOwnPropertyDescriptor, zr = (i, t, e, s) => {
  for (var n = s > 1 ? void 0 : s ? Ru(t, e) : t, o = i.length - 1, r; o >= 0; o--)
    (r = i[o]) && (n = (s ? r(t, e, n) : r(n)) || n);
  return s && n && Lu(t, e, n), n;
};
tt.register(Re, Ie, Xe, Ke, Bs);
let Ii = class extends nt {
  constructor() {
    super(), this._canvasRef = Hs(), this._chart = null, Tt(this);
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
    return Q(
      this.metric,
      (i) => P`
        <div class="label">${i.label}</div>
        ${Q(
        i.description,
        () => P`<div class="description">${i.description}</div>`
      )}
        ${Q(
        i.items.length > 0,
        () => P`
            <div class="chart-wrap">
              <canvas ${Ns(this._canvasRef)}></canvas>
            </div>
          `,
        () => P`<div class="empty">
              ${D("No data in the selected range.")}
            </div>`
      )}
      `,
      () => L
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
    this._chart = new tt(i, {
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
Ii.styles = [Rt, qe];
zr([
  N({ attribute: !1 })
], Ii.prototype, "metric", 2);
Ii = zr([
  Lt("lms-report-top-n")
], Ii);
function Iu(i) {
  return "filterName" in i && typeof i.filterName == "string" && typeof i.filterValues == "function";
}
var Fu = Object.defineProperty, zu = Object.getOwnPropertyDescriptor, j = (i, t, e, s) => {
  for (var n = s > 1 ? void 0 : s ? zu(t, e) : t, o = i.length - 1, r; o >= 0; o--)
    (r = i[o]) && (n = (s ? r(t, e, n) : r(n)) || n);
  return s && n && Fu(t, e, n), n;
};
let H = class extends nt {
  constructor() {
    super(), this.endpoint = "", this.librariesEndpoint = "", this.categoriesEndpoint = "", this.start = "", this.end = "", this._envelope = null, this._loading = !1, this._error = null, this._pendingStart = "", this._pendingEnd = "", this._pendingBranchcodes = [], this._pendingCategorycodes = [], this._pendingWeekdays = /* @__PURE__ */ new Set(), this._pendingHourStart = null, this._pendingHourEnd = null, this._libraries = [], this._categories = [], this._abort = null, Tt(this);
  }
  connectedCallback() {
    super.connectedCallback(), this.start || (this.start = Hu()), this.end || (this.end = Bu()), this._pendingStart = this.start, this._pendingEnd = this.end, ja(), this.librariesEndpoint && this._fetchLibraries(), this.categoriesEndpoint && this._fetchCategories(), this.endpoint && this._fetchReport();
  }
  disconnectedCallback() {
    this._abort?.abort(), super.disconnectedCallback();
  }
  render() {
    return P`
      <form class="filters" @submit=${this._onSubmit}>
        <div class="field">
          <label for="start">${D("Start")}</label>
          <input
            id="start"
            type="date"
            .value=${this._pendingStart}
            @input=${(i) => this._pendingStart = i.target.value}
            required
          />
        </div>
        <div class="field">
          <label for="end">${D("End")}</label>
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
        <div class="actions">
          <button class="reset" type="button" @click=${this._onReset}>
            ${D("Reset")}
          </button>
          <button class="apply" type="submit" ?disabled=${this._loading}>
            ${this._loading ? D("Loading…") : D("Apply")}
          </button>
        </div>
      </form>
      ${this._renderBody()}
    `;
  }
  _renderLibrariesField() {
    return this._libraries.length === 0 ? L : P`
      <div class="field">
        <label>${D("Branches")}</label>
        <lms-report-chip-picker
          .label=${D("Branches")}
          .options=${this._libraries.map((i) => ({
      value: i.library_id,
      label: i.name
    }))}
          .selected=${this._pendingBranchcodes}
          @change=${(i) => {
      this._pendingBranchcodes = i.detail.selected;
    }}
        ></lms-report-chip-picker>
      </div>
    `;
  }
  _renderCategoriesField() {
    return this._categories.length === 0 ? L : P`
      <div class="field">
        <label>${D("Patron categories")}</label>
        <lms-report-chip-picker
          .label=${D("Patron categories")}
          .options=${this._categories.map((i) => ({
      value: i.patron_category_id,
      label: i.name
    }))}
          .selected=${this._pendingCategorycodes}
          @change=${(i) => {
      this._pendingCategorycodes = i.detail.selected;
    }}
        ></lms-report-chip-picker>
      </div>
    `;
  }
  _renderWeekdayField() {
    const i = [
      D("Mon"),
      D("Tue"),
      D("Wed"),
      D("Thu"),
      D("Fri"),
      D("Sat"),
      D("Sun")
    ];
    return P`
      <div class="field">
        <label>${D("Weekdays")}</label>
        <div class="weekday-chips" role="group" aria-label=${D("Weekdays")}>
          ${Oe(
      i,
      (t, e) => P`
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
    return P`
      <div class="field">
        <label for="hour-start">${D("Hours")}</label>
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
        return P`<div class="status error" role="alert">
          ${i.message}
        </div>`;
      case "loading":
        return P`<div class="status">${D("Loading report…")}</div>`;
      case "data":
        return P`
          <div class="grid">
            ${Ia(
          i.envelope.metrics,
          (t) => t.id,
          (t) => this._renderMetric(t)
        )}
          </div>
        `;
      case "empty":
        return L;
    }
  }
  _view() {
    return this._error ? { kind: "error", message: this._error } : this._loading && !this._envelope ? { kind: "loading" } : this._envelope ? { kind: "data", envelope: this._envelope } : { kind: "empty" };
  }
  _renderMetric(i) {
    switch (i.type) {
      case "counter":
        return P`<div class="counter">
          <lms-report-counter .metric=${i}></lms-report-counter>
        </div>`;
      case "time_series":
        return P`<div class="wide">
          <lms-report-time-series
            .metric=${i}
          ></lms-report-time-series>
        </div>`;
      case "top_n": {
        const t = i.orientation === "vertical";
        return P`<div class=${t ? "wide" : "medium"}>
          <lms-report-top-n .metric=${i}></lms-report-top-n>
        </div>`;
      }
      case "stacked_bar":
        return P`<div class="wide">
          <lms-report-stacked-bar .metric=${i}></lms-report-stacked-bar>
        </div>`;
      case "heatmap":
        return P`<div class="wide">
          <lms-report-heatmap .metric=${i}></lms-report-heatmap>
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
  _onReset() {
    this._pendingBranchcodes = [], this._pendingCategorycodes = [], this._pendingWeekdays = /* @__PURE__ */ new Set(), this._pendingHourStart = null, this._pendingHourEnd = null;
    for (const i of this._slottedFilters())
      i.filterReset?.();
    this._fetchReport();
  }
  _slottedFilters() {
    const i = this._filtersSlot;
    return i ? i.assignedElements({ flatten: !0 }).filter((t) => Iu(t)) : [];
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
      this._error = D("No endpoint configured.");
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
      this._error = e.message || D("Failed to load report.");
    } finally {
      this._abort === i && (this._abort = null), this._loading = !1;
    }
  }
};
H.styles = [
  Rt,
  Ps,
  Et`
      .filters {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem 1rem;
        align-items: flex-end;
        margin-bottom: 1rem;
        padding: 0.6rem 0.75rem;
        background: var(--lms-report-filters-bg);
        border: 1px solid var(--lms-report-filters-border);
        border-radius: 5px;
      }
      .filters .actions {
        display: flex;
        gap: 0.5rem;
        margin-left: auto;
      }
      .field input[type="number"] {
        min-width: 4rem;
        width: 4.5rem;
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
        box-sizing: border-box;
        height: var(--lms-report-control-height);
        padding: 0 0.7rem;
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
      button.apply,
      button.reset {
        font: inherit;
        line-height: 1.42857143;
        box-sizing: border-box;
        height: var(--lms-report-control-height);
        padding: 0 0.85rem;
        border-radius: var(--lms-report-button-radius);
        font-weight: normal;
        cursor: pointer;
      }
      button.apply {
        background: var(--lms-report-button-bg);
        color: var(--lms-report-button-fg);
        border: 1px solid var(--lms-report-button-border);
      }
      button.apply:hover {
        background: var(--lms-report-button-bg-hover);
      }
      button.apply:active,
      button.apply:focus {
        box-shadow: inset 0 0 0 1px #edb423;
        outline: none;
      }
      button.apply:disabled,
      button.reset:disabled {
        cursor: not-allowed;
        opacity: 0.6;
      }
      button.reset {
        background: transparent;
        color: var(--lms-report-fg);
        border: 1px solid var(--lms-report-input-border);
      }
      button.reset:hover {
        background: var(--lms-report-input-bg);
      }
      button.reset:focus {
        outline: 2px solid var(--lms-report-accent-soft);
        outline-offset: 1px;
      }
      .grid {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        align-items: stretch;
      }
      .grid > * {
        min-width: 0;
      }
      .grid > .counter {
        flex: 1 1 14rem;
        max-width: 22rem;
      }
      .grid > .medium {
        flex: 1 1 26rem;
      }
      .grid > .wide {
        flex: 1 1 100%;
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
j([
  N({ type: String })
], H.prototype, "endpoint", 2);
j([
  N({ type: String, attribute: "libraries-endpoint" })
], H.prototype, "librariesEndpoint", 2);
j([
  N({ type: String, attribute: "categories-endpoint" })
], H.prototype, "categoriesEndpoint", 2);
j([
  N({ type: String })
], H.prototype, "start", 2);
j([
  N({ type: String })
], H.prototype, "end", 2);
j([
  K()
], H.prototype, "_envelope", 2);
j([
  K()
], H.prototype, "_loading", 2);
j([
  K()
], H.prototype, "_error", 2);
j([
  K()
], H.prototype, "_pendingStart", 2);
j([
  K()
], H.prototype, "_pendingEnd", 2);
j([
  K()
], H.prototype, "_pendingBranchcodes", 2);
j([
  K()
], H.prototype, "_pendingCategorycodes", 2);
j([
  K()
], H.prototype, "_pendingWeekdays", 2);
j([
  K()
], H.prototype, "_pendingHourStart", 2);
j([
  K()
], H.prototype, "_pendingHourEnd", 2);
j([
  K()
], H.prototype, "_libraries", 2);
j([
  K()
], H.prototype, "_categories", 2);
j([
  $a('slot[name="filters"]')
], H.prototype, "_filtersSlot", 2);
H = j([
  Lt("lms-report-dashboard")
], H);
function Bu() {
  return (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
}
function Hu() {
  const i = /* @__PURE__ */ new Date();
  return new Date(i.getFullYear(), i.getMonth(), 1).toISOString().slice(0, 10);
}
export {
  Ot as LMSReportChipPicker,
  H as LMSReportDashboard,
  pt as LMSReportFilterMultiselect,
  ki as LMSReportHeatmap,
  Li as LMSReportStackedBar
};
//# sourceMappingURL=lms-report-dashboard.js.map
