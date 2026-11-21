// \0rolldown/runtime.js
var e = Object.create, t = Object.defineProperty, n = Object.getOwnPropertyDescriptor, r = Object.getOwnPropertyNames, i = Object.getPrototypeOf, a = Object.prototype.hasOwnProperty, o = (e, t) => () => (t || (e((t = { exports: {} }).exports, t, t.exports), e = null), t.exports), s = (e, i, o, s) => {
	if (i && typeof i == "object" || typeof i == "function") for (var c = r(i), l = 0, u = c.length, d; l < u; l++) d = c[l], !a.call(e, d) && d !== o && t(e, d, {
		get: ((e) => i[e]).bind(null, d),
		enumerable: !(s = n(i, d)) || s.enumerable
	});
	return e;
}, c = (n, r, o) => (o = n == null ? {} : e(i(n)), s(r || !n || !n.__esModule || !a.call(n, "default") ? t(o, "default", {
	value: n,
	enumerable: !0
}) : o, n)), l = /* @__PURE__ */ o(((e) => {
	function t(e, t) {
		var n = e.length;
		e.push(t);
		a: for (; 0 < n;) {
			var r = n - 1 >>> 1, a = e[r];
			if (0 < i(a, t)) e[r] = t, e[n] = a, n = r;
			else break a;
		}
	}
	function n(e) {
		return e.length === 0 ? null : e[0];
	}
	function r(e) {
		if (e.length === 0) return null;
		var t = e[0], n = e.pop();
		if (n !== t) {
			e[0] = n;
			a: for (var r = 0, a = e.length, o = a >>> 1; r < o;) {
				var s = 2 * (r + 1) - 1, c = e[s], l = s + 1, u = e[l];
				if (0 > i(c, n)) l < a && 0 > i(u, c) ? (e[r] = u, e[l] = n, r = l) : (e[r] = c, e[s] = n, r = s);
				else if (l < a && 0 > i(u, n)) e[r] = u, e[l] = n, r = l;
				else break a;
			}
		}
		return t;
	}
	function i(e, t) {
		var n = e.sortIndex - t.sortIndex;
		return n === 0 ? e.id - t.id : n;
	}
	if (e.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
		var a = performance;
		e.unstable_now = function() {
			return a.now();
		};
	} else {
		var o = Date, s = o.now();
		e.unstable_now = function() {
			return o.now() - s;
		};
	}
	var c = [], l = [], u = 1, d = null, f = 3, p = !1, m = !1, h = !1, g = !1, _ = typeof setTimeout == "function" ? setTimeout : null, v = typeof clearTimeout == "function" ? clearTimeout : null, y = typeof setImmediate < "u" ? setImmediate : null;
	function b(e) {
		for (var i = n(l); i !== null;) {
			if (i.callback === null) r(l);
			else if (i.startTime <= e) r(l), i.sortIndex = i.expirationTime, t(c, i);
			else break;
			i = n(l);
		}
	}
	function x(e) {
		if (h = !1, b(e), !m) {
			if (n(c) !== null) m = !0, S || (S = !0, O());
			else {
				var t = n(l);
				t !== null && j(x, t.startTime - e);
			}
		}
	}
	var S = !1, C = -1, w = 5, T = -1;
	function E() {
		return g ? !0 : !(e.unstable_now() - T < w);
	}
	function D() {
		if (g = !1, S) {
			var t = e.unstable_now();
			T = t;
			var i = !0;
			try {
				a: {
					m = !1, h && (h = !1, v(C), C = -1), p = !0;
					var a = f;
					try {
						b: {
							for (b(t), d = n(c); d !== null && !(d.expirationTime > t && E());) {
								var o = d.callback;
								if (typeof o == "function") {
									d.callback = null, f = d.priorityLevel;
									var s = o(d.expirationTime <= t);
									if (t = e.unstable_now(), typeof s == "function") {
										d.callback = s, b(t), i = !0;
										break b;
									}
									d === n(c) && r(c), b(t);
								} else r(c);
								d = n(c);
							}
							if (d !== null) i = !0;
							else {
								var u = n(l);
								u !== null && j(x, u.startTime - t), i = !1;
							}
						}
						break a;
					} finally {
						d = null, f = a, p = !1;
					}
					i = void 0;
				}
			} finally {
				i ? O() : S = !1;
			}
		}
	}
	var O;
	if (typeof y == "function") O = function() {
		y(D);
	};
	else if (typeof MessageChannel < "u") {
		var k = new MessageChannel(), A = k.port2;
		k.port1.onmessage = D, O = function() {
			A.postMessage(null);
		};
	} else O = function() {
		_(D, 0);
	};
	function j(t, n) {
		C = _(function() {
			t(e.unstable_now());
		}, n);
	}
	e.unstable_IdlePriority = 5, e.unstable_ImmediatePriority = 1, e.unstable_LowPriority = 4, e.unstable_NormalPriority = 3, e.unstable_Profiling = null, e.unstable_UserBlockingPriority = 2, e.unstable_cancelCallback = function(e) {
		e.callback = null;
	}, e.unstable_forceFrameRate = function(e) {
		0 > e || 125 < e ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : w = 0 < e ? Math.floor(1e3 / e) : 5;
	}, e.unstable_getCurrentPriorityLevel = function() {
		return f;
	}, e.unstable_next = function(e) {
		switch (f) {
			case 1:
			case 2:
			case 3:
				var t = 3;
				break;
			default: t = f;
		}
		var n = f;
		f = t;
		try {
			return e();
		} finally {
			f = n;
		}
	}, e.unstable_requestPaint = function() {
		g = !0;
	}, e.unstable_runWithPriority = function(e, t) {
		switch (e) {
			case 1:
			case 2:
			case 3:
			case 4:
			case 5: break;
			default: e = 3;
		}
		var n = f;
		f = e;
		try {
			return t();
		} finally {
			f = n;
		}
	}, e.unstable_scheduleCallback = function(r, i, a) {
		var o = e.unstable_now();
		switch (typeof a == "object" && a ? (a = a.delay, a = typeof a == "number" && 0 < a ? o + a : o) : a = o, r) {
			case 1:
				var s = -1;
				break;
			case 2:
				s = 250;
				break;
			case 5:
				s = 1073741823;
				break;
			case 4:
				s = 1e4;
				break;
			default: s = 5e3;
		}
		return s = a + s, r = {
			id: u++,
			callback: i,
			priorityLevel: r,
			startTime: a,
			expirationTime: s,
			sortIndex: -1
		}, a > o ? (r.sortIndex = a, t(l, r), n(c) === null && r === n(l) && (h ? (v(C), C = -1) : h = !0, j(x, a - o))) : (r.sortIndex = s, t(c, r), m || p || (m = !0, S || (S = !0, O()))), r;
	}, e.unstable_shouldYield = E, e.unstable_wrapCallback = function(e) {
		var t = f;
		return function() {
			var n = f;
			f = t;
			try {
				return e.apply(this, arguments);
			} finally {
				f = n;
			}
		};
	};
})), u = /* @__PURE__ */ o(((e, t) => {
	t.exports = l();
})), d = /* @__PURE__ */ o(((e) => {
	var t = Symbol.for("react.transitional.element"), n = Symbol.for("react.portal"), r = Symbol.for("react.fragment"), i = Symbol.for("react.strict_mode"), a = Symbol.for("react.profiler"), o = Symbol.for("react.consumer"), s = Symbol.for("react.context"), c = Symbol.for("react.forward_ref"), l = Symbol.for("react.suspense"), u = Symbol.for("react.memo"), d = Symbol.for("react.lazy"), f = Symbol.for("react.activity"), p = Symbol.for("react.view_transition"), m = Symbol.iterator;
	function h(e) {
		return typeof e != "object" || !e ? null : (e = m && e[m] || e["@@iterator"], typeof e == "function" ? e : null);
	}
	var g = {
		isMounted: function() {
			return !1;
		},
		enqueueForceUpdate: function() {},
		enqueueReplaceState: function() {},
		enqueueSetState: function() {}
	}, _ = Object.assign, v = {};
	function y(e, t, n) {
		this.props = e, this.context = t, this.refs = v, this.updater = n || g;
	}
	y.prototype.isReactComponent = {}, y.prototype.setState = function(e, t) {
		if (typeof e != "object" && typeof e != "function" && e != null) throw Error("takes an object of state variables to update or a function which returns an object of state variables.");
		this.updater.enqueueSetState(this, e, t, "setState");
	}, y.prototype.forceUpdate = function(e) {
		this.updater.enqueueForceUpdate(this, e, "forceUpdate");
	};
	function b() {}
	b.prototype = y.prototype;
	function x(e, t, n) {
		this.props = e, this.context = t, this.refs = v, this.updater = n || g;
	}
	var S = x.prototype = new b();
	S.constructor = x, _(S, y.prototype), S.isPureReactComponent = !0;
	var C = Array.isArray;
	function w() {}
	var T = {
		H: null,
		A: null,
		T: null,
		S: null
	}, E = Object.prototype.hasOwnProperty;
	function D(e, n, r) {
		var i = r.ref;
		return {
			$$typeof: t,
			type: e,
			key: n,
			ref: i === void 0 ? null : i,
			props: r
		};
	}
	function O(e, t) {
		return D(e.type, t, e.props);
	}
	function k(e) {
		return typeof e == "object" && !!e && e.$$typeof === t;
	}
	function A(e) {
		var t = {
			"=": "=0",
			":": "=2"
		};
		return "$" + e.replace(/[=:]/g, function(e) {
			return t[e];
		});
	}
	var j = /\/+/g;
	function M(e, t) {
		return typeof e == "object" && e && e.key != null ? A("" + e.key) : t.toString(36);
	}
	function N(e) {
		switch (e.status) {
			case "fulfilled": return e.value;
			case "rejected": throw e.reason;
			default: switch (typeof e.status == "string" ? e.then(w, w) : (e.status = "pending", e.then(function(t) {
				e.status === "pending" && (e.status = "fulfilled", e.value = t);
			}, function(t) {
				e.status === "pending" && (e.status = "rejected", e.reason = t);
			})), e.status) {
				case "fulfilled": return e.value;
				case "rejected": throw e.reason;
			}
		}
		throw e;
	}
	function P(e, r, i, a, o) {
		var s = typeof e;
		(s === "undefined" || s === "boolean") && (e = null);
		var c = !1;
		if (e === null) c = !0;
		else switch (s) {
			case "bigint":
			case "string":
			case "number":
				c = !0;
				break;
			case "object": switch (e.$$typeof) {
				case t:
				case n:
					c = !0;
					break;
				case d: return c = e._init, P(c(e._payload), r, i, a, o);
			}
		}
		if (c) return o = o(e), c = a === "" ? "." + M(e, 0) : a, C(o) ? (i = "", c != null && (i = c.replace(j, "$&/") + "/"), P(o, r, i, "", function(e) {
			return e;
		})) : o != null && (k(o) && (o = O(o, i + (o.key == null || e && e.key === o.key ? "" : ("" + o.key).replace(j, "$&/") + "/") + c)), r.push(o)), 1;
		c = 0;
		var l = a === "" ? "." : a + ":";
		if (C(e)) for (var u = 0; u < e.length; u++) a = e[u], s = l + M(a, u), c += P(a, r, i, s, o);
		else if (u = h(e), typeof u == "function") for (e = u.call(e), u = 0; !(a = e.next()).done;) a = a.value, s = l + M(a, u++), c += P(a, r, i, s, o);
		else if (s === "object") {
			if (typeof e.then == "function") return P(N(e), r, i, a, o);
			throw r = String(e), Error("Objects are not valid as a React child (found: " + (r === "[object Object]" ? "object with keys {" + Object.keys(e).join(", ") + "}" : r) + "). If you meant to render a collection of children, use an array instead.");
		}
		return c;
	}
	function F(e, t, n) {
		if (e == null) return e;
		var r = [], i = 0;
		return P(e, r, "", "", function(e) {
			return t.call(n, e, i++);
		}), r;
	}
	function I(e) {
		if (e._status === -1) {
			var t = e._result, n = t();
			n.then(function(t) {
				(e._status === 0 || e._status === -1) && (e._status = 1, e._result = t, n.status === void 0 && (n.status = "fulfilled", n.value = t));
			}, function(t) {
				(e._status === 0 || e._status === -1) && (e._status = 2, e._result = t, n.status === void 0 && (n.status = "rejected", n.reason = t));
			}), e._status === -1 && (e._status = 0, e._result = n);
		}
		if (e._status === 1) return e._result.default;
		throw e._result;
	}
	var L = typeof reportError == "function" ? reportError : function(e) {
		if (typeof window == "object" && typeof window.ErrorEvent == "function") {
			var t = new window.ErrorEvent("error", {
				bubbles: !0,
				cancelable: !0,
				message: typeof e == "object" && e && typeof e.message == "string" ? String(e.message) : String(e),
				error: e
			});
			if (!window.dispatchEvent(t)) return;
		} else if (typeof process == "object" && typeof process.emit == "function") {
			process.emit("uncaughtException", e);
			return;
		}
		console.error(e);
	};
	function ee(e) {
		var t = T.T, n = {};
		n.types = t === null ? null : t.types, T.T = n;
		try {
			var r = e(), i = T.S;
			i !== null && i(n, r), typeof r == "object" && r && typeof r.then == "function" && r.then(w, L);
		} catch (e) {
			L(e);
		} finally {
			t !== null && n.types !== null && (t.types = n.types), T.T = t;
		}
	}
	function te(e) {
		var t = T.T;
		if (t !== null) {
			var n = t.types;
			n === null ? t.types = [e] : n.indexOf(e) === -1 && n.push(e);
		} else ee(te.bind(null, e));
	}
	var R = {
		map: F,
		forEach: function(e, t, n) {
			F(e, function() {
				t.apply(this, arguments);
			}, n);
		},
		count: function(e) {
			var t = 0;
			return F(e, function() {
				t++;
			}), t;
		},
		toArray: function(e) {
			return F(e, function(e) {
				return e;
			}) || [];
		},
		only: function(e) {
			if (!k(e)) throw Error("React.Children.only expected to receive a single React element child.");
			return e;
		}
	};
	e.Activity = f, e.Children = R, e.Component = y, e.Fragment = r, e.Profiler = a, e.PureComponent = x, e.StrictMode = i, e.Suspense = l, e.ViewTransition = p, e.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = T, e.__COMPILER_RUNTIME = {
		__proto__: null,
		c: function(e) {
			return T.H.useMemoCache(e);
		}
	}, e.addTransitionType = te, e.cache = function(e) {
		return function() {
			return e.apply(null, arguments);
		};
	}, e.cacheSignal = function() {
		return null;
	}, e.cloneElement = function(e, t, n) {
		if (e == null) throw Error("The argument must be a React element, but you passed " + e + ".");
		var r = _({}, e.props), i = e.key;
		if (t != null) for (a in t.key !== void 0 && (i = "" + t.key), t) !E.call(t, a) || a === "key" || a === "__self" || a === "__source" || a === "ref" && t.ref === void 0 || (r[a] = t[a]);
		var a = arguments.length - 2;
		if (a === 1) r.children = n;
		else if (1 < a) {
			for (var o = Array(a), s = 0; s < a; s++) o[s] = arguments[s + 2];
			r.children = o;
		}
		return D(e.type, i, r);
	}, e.createContext = function(e) {
		return e = {
			$$typeof: s,
			_currentValue: e,
			_currentValue2: e,
			_threadCount: 0,
			Provider: null,
			Consumer: null
		}, e.Provider = e, e.Consumer = {
			$$typeof: o,
			_context: e
		}, e;
	}, e.createElement = function(e, t, n) {
		var r, i = {}, a = null;
		if (t != null) for (r in t.key !== void 0 && (a = "" + t.key), t) E.call(t, r) && r !== "key" && r !== "__self" && r !== "__source" && (i[r] = t[r]);
		var o = arguments.length - 2;
		if (o === 1) i.children = n;
		else if (1 < o) {
			for (var s = Array(o), c = 0; c < o; c++) s[c] = arguments[c + 2];
			i.children = s;
		}
		if (e && e.defaultProps) for (r in o = e.defaultProps, o) i[r] === void 0 && (i[r] = o[r]);
		return D(e, a, i);
	}, e.createRef = function() {
		return { current: null };
	}, e.forwardRef = function(e) {
		return {
			$$typeof: c,
			render: e
		};
	}, e.isValidElement = k, e.lazy = function(e) {
		return {
			$$typeof: d,
			_payload: {
				_status: -1,
				_result: e
			},
			_init: I
		};
	}, e.memo = function(e, t) {
		return {
			$$typeof: u,
			type: e,
			compare: t === void 0 ? null : t
		};
	}, e.startTransition = ee, e.unstable_useCacheRefresh = function() {
		return T.H.useCacheRefresh();
	}, e.use = function(e) {
		return T.H.use(e);
	}, e.useActionState = function(e, t, n) {
		return T.H.useActionState(e, t, n);
	}, e.useCallback = function(e, t) {
		return T.H.useCallback(e, t);
	}, e.useContext = function(e) {
		return T.H.useContext(e);
	}, e.useDebugValue = function() {}, e.useDeferredValue = function(e, t) {
		return T.H.useDeferredValue(e, t);
	}, e.useEffect = function(e, t) {
		return T.H.useEffect(e, t);
	}, e.useEffectEvent = function(e) {
		return T.H.useEffectEvent(e);
	}, e.useId = function() {
		return T.H.useId();
	}, e.useImperativeHandle = function(e, t, n) {
		return T.H.useImperativeHandle(e, t, n);
	}, e.useInsertionEffect = function(e, t) {
		return T.H.useInsertionEffect(e, t);
	}, e.useLayoutEffect = function(e, t) {
		return T.H.useLayoutEffect(e, t);
	}, e.useMemo = function(e, t) {
		return T.H.useMemo(e, t);
	}, e.useOptimistic = function(e, t) {
		return T.H.useOptimistic(e, t);
	}, e.useReducer = function(e, t, n) {
		return T.H.useReducer(e, t, n);
	}, e.useRef = function(e) {
		return T.H.useRef(e);
	}, e.useState = function(e) {
		return T.H.useState(e);
	}, e.useSyncExternalStore = function(e, t, n) {
		return T.H.useSyncExternalStore(e, t, n);
	}, e.useTransition = function() {
		return T.H.useTransition();
	}, e.version = "19.3.1";
})), f = /* @__PURE__ */ o(((e, t) => {
	t.exports = d();
})), p = /* @__PURE__ */ o(((e) => {
	var t = f();
	function n(e) {
		var t = "https://react.dev/errors/" + e;
		if (1 < arguments.length) {
			t += "?args[]=" + encodeURIComponent(arguments[1]);
			for (var n = 2; n < arguments.length; n++) t += "&args[]=" + encodeURIComponent(arguments[n]);
		}
		return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
	}
	function r() {}
	var i = {
		d: {
			f: r,
			r: function() {
				throw Error(n(522));
			},
			D: r,
			C: r,
			L: r,
			m: r,
			X: r,
			S: r,
			M: r
		},
		p: 0,
		findDOMNode: null
	}, a = Symbol.for("react.portal"), o = Symbol.for("react.recoverable"), s = Symbol.for("react.optimistic_key");
	function c(e, t, n) {
		var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
		return {
			$$typeof: a,
			key: r == null ? null : r === s ? s : "" + r,
			children: e,
			containerInfo: t,
			implementation: n
		};
	}
	var l = t.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
	function u(e, t) {
		if (e === "font") return "";
		if (typeof t == "string") return t === "use-credentials" ? t : "";
	}
	e.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = i, e.browser = function(e) {
		return {
			$$typeof: o,
			_reason: e
		};
	}, e.createPortal = function(e, t) {
		var r = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
		if (!t || t.nodeType !== 1 && t.nodeType !== 9 && t.nodeType !== 11) throw Error(n(299));
		return c(e, t, null, r);
	}, e.flushSync = function(e) {
		var t = l.T, n = i.p;
		try {
			if (l.T = null, i.p = 2, e) return e();
		} finally {
			l.T = t, i.p = n, i.d.f();
		}
	}, e.preconnect = function(e, t) {
		typeof e == "string" && (t ? (t = t.crossOrigin, t = typeof t == "string" ? t === "use-credentials" ? t : "" : void 0) : t = null, i.d.C(e, t));
	}, e.prefetchDNS = function(e) {
		typeof e == "string" && i.d.D(e);
	}, e.preinit = function(e, t) {
		if (typeof e == "string" && t && typeof t.as == "string") {
			var n = t.as, r = u(n, t.crossOrigin), a = typeof t.integrity == "string" ? t.integrity : void 0, o = typeof t.fetchPriority == "string" ? t.fetchPriority : void 0;
			n === "style" ? i.d.S(e, typeof t.precedence == "string" ? t.precedence : void 0, {
				crossOrigin: r,
				integrity: a,
				fetchPriority: o
			}) : n === "script" && i.d.X(e, {
				crossOrigin: r,
				integrity: a,
				fetchPriority: o,
				nonce: typeof t.nonce == "string" ? t.nonce : void 0
			});
		}
	}, e.preinitModule = function(e, t) {
		if (typeof e == "string") {
			if (typeof t == "object" && t) {
				if (t.as == null || t.as === "script") {
					var n = u(t.as, t.crossOrigin);
					i.d.M(e, {
						crossOrigin: n,
						integrity: typeof t.integrity == "string" ? t.integrity : void 0,
						nonce: typeof t.nonce == "string" ? t.nonce : void 0,
						fetchPriority: typeof t.fetchPriority == "string" ? t.fetchPriority : void 0
					});
				}
			} else t ?? i.d.M(e);
		}
	}, e.preload = function(e, t) {
		if (typeof e == "string" && typeof t == "object" && t && typeof t.as == "string") {
			var n = t.as, r = u(n, t.crossOrigin);
			i.d.L(e, n, {
				crossOrigin: r,
				integrity: typeof t.integrity == "string" ? t.integrity : void 0,
				nonce: typeof t.nonce == "string" ? t.nonce : void 0,
				type: typeof t.type == "string" ? t.type : void 0,
				fetchPriority: typeof t.fetchPriority == "string" ? t.fetchPriority : void 0,
				referrerPolicy: typeof t.referrerPolicy == "string" ? t.referrerPolicy : void 0,
				imageSrcSet: typeof t.imageSrcSet == "string" ? t.imageSrcSet : void 0,
				imageSizes: typeof t.imageSizes == "string" ? t.imageSizes : void 0,
				media: typeof t.media == "string" ? t.media : void 0
			});
		}
	}, e.preloadModule = function(e, t) {
		if (typeof e == "string") {
			if (t) {
				var n = u(t.as, t.crossOrigin);
				i.d.m(e, {
					as: typeof t.as == "string" && t.as !== "script" ? t.as : void 0,
					crossOrigin: n,
					integrity: typeof t.integrity == "string" ? t.integrity : void 0,
					nonce: typeof t.nonce == "string" ? t.nonce : void 0,
					fetchPriority: typeof t.fetchPriority == "string" ? t.fetchPriority : void 0
				});
			} else i.d.m(e);
		}
	}, e.requestFormReset = function(e) {
		i.d.r(e);
	}, e.unstable_batchedUpdates = function(e, t) {
		return e(t);
	}, e.useFormState = function(e, t, n) {
		return l.H.useFormState(e, t, n);
	}, e.useFormStatus = function() {
		return l.H.useHostTransitionStatus();
	}, e.version = "19.3.1";
})), m = /* @__PURE__ */ o(((e, t) => {
	function n() {
		if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE == "function") try {
			__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n);
		} catch (e) {
			console.error(e);
		}
	}
	n(), t.exports = p();
})), h = /* @__PURE__ */ o(((e) => {
	var t = u(), n = f(), r = m();
	function i(e) {
		var t = "https://react.dev/errors/" + e;
		if (1 < arguments.length) {
			t += "?args[]=" + encodeURIComponent(arguments[1]);
			for (var n = 2; n < arguments.length; n++) t += "&args[]=" + encodeURIComponent(arguments[n]);
		}
		return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
	}
	function a(e) {
		return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
	}
	function o(e) {
		for (var t = e, n = t; n && !n.alternate;) t = n, t.flags & 4098 && (e = t.return), n = t.return;
		for (; t.return;) t = t.return;
		return t.tag === 3 ? e : null;
	}
	function s(e) {
		if (e.tag === 13) {
			var t = e.memoizedState;
			if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
		}
		return null;
	}
	function c(e) {
		if (e.tag === 31) {
			var t = e.memoizedState;
			if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
		}
		return null;
	}
	function l(e) {
		if (o(e) !== e) throw Error(i(188));
	}
	function d(e) {
		var t = e.alternate;
		if (!t) {
			if (t = o(e), t === null) throw Error(i(188));
			return t === e ? e : null;
		}
		for (var n = e, r = t;;) {
			var a = n.return;
			if (a === null) break;
			var s = a.alternate;
			if (s === null) {
				if (r = a.return, r !== null) {
					n = r;
					continue;
				}
				break;
			}
			if (a.child === s.child) {
				for (s = a.child; s;) {
					if (s === n) return l(a), e;
					if (s === r) return l(a), t;
					s = s.sibling;
				}
				throw Error(i(188));
			}
			if (n.return !== r.return) n = a, r = s;
			else {
				for (var c = !1, u = a.child; u;) {
					if (u === n) {
						c = !0, n = a, r = s;
						break;
					}
					if (u === r) {
						c = !0, r = a, n = s;
						break;
					}
					u = u.sibling;
				}
				if (!c) {
					for (u = s.child; u;) {
						if (u === n) {
							c = !0, n = s, r = a;
							break;
						}
						if (u === r) {
							c = !0, r = s, n = a;
							break;
						}
						u = u.sibling;
					}
					if (!c) throw Error(i(189));
				}
			}
			if (n.alternate !== r) throw Error(i(190));
		}
		if (n.tag !== 3) throw Error(i(188));
		return n.stateNode.current === n ? e : t;
	}
	function p(e) {
		var t = e.tag;
		if (t === 5 || t === 26 || t === 27 || t === 6) return e;
		for (e = e.child; e !== null;) {
			if (t = p(e), t !== null) return t;
			e = e.sibling;
		}
		return null;
	}
	function h(e, t, n, r, i, a) {
		for (; e !== null;) {
			if ((e.tag === 5 || e.tag === 27 || e.tag === 6) && n(e, r, i, a) || (e.tag !== 22 || e.memoizedState === null) && (t || e.tag !== 5 && e.tag !== 27) && h(e.child, t, n, r, i, a)) return !0;
			e = e.sibling;
		}
		return !1;
	}
	function g(e) {
		for (e = e.return; e !== null;) {
			if (e.tag === 3 || e.tag === 5 || e.tag === 27) return e;
			e = e.return;
		}
		return null;
	}
	function _(e) {
		var t = !1;
		for (e = e.return; e !== null && (e.tag === 4 && (t = !0), e.tag !== 3 && e.tag !== 5 && e.tag !== 27);) e = e.return;
		return t;
	}
	function v(e) {
		var t = [null, null], n = g(e);
		return n === null || y(t, e, n.child, { foundSelf: !1 }), t;
	}
	function y(e, t, n, r) {
		for (; n !== null;) {
			if (n === t) r.foundSelf = !0;
			else if (n.tag === 5 || n.tag === 27 || n.tag === 6) {
				if (r.foundSelf) return e[1] = n, !0;
				e[0] = n;
			} else if ((n.tag !== 22 || n.memoizedState === null) && y(e, t, n.child, r)) return !0;
			n = n.sibling;
		}
		return !1;
	}
	function b(e) {
		switch (e.tag) {
			case 5:
			case 27:
			case 6: return e.stateNode;
			case 3: return e.stateNode.containerInfo;
			default: throw Error(i(559));
		}
	}
	var x = null, S = null;
	function C(e, t, n) {
		return e === n || e === t && (x = e, !0);
	}
	function w(e, t, n) {
		return e === n ? (S = e, !1) : e === t && (S !== null && (x = e), !0);
	}
	function T(e) {
		if (e === null) return null;
		do
			e = e === null ? null : e.return;
		while (e && e.tag !== 5 && e.tag !== 27 && e.tag !== 3);
		return e || null;
	}
	function E(e, t, n) {
		for (var r = 0, i = e; i; i = n(i)) r++;
		i = 0;
		for (var a = t; a; a = n(a)) i++;
		for (; 0 < r - i;) e = n(e), r--;
		for (; 0 < i - r;) t = n(t), i--;
		for (; r--;) {
			if (e === t || t !== null && e === t.alternate) return e;
			e = n(e), t = n(t);
		}
		return null;
	}
	var D = Object.assign, O = Symbol.for("react.element"), k = Symbol.for("react.transitional.element"), A = Symbol.for("react.portal"), j = Symbol.for("react.fragment"), M = Symbol.for("react.strict_mode"), N = Symbol.for("react.profiler"), P = Symbol.for("react.consumer"), F = Symbol.for("react.context"), I = Symbol.for("react.forward_ref"), L = Symbol.for("react.suspense"), ee = Symbol.for("react.suspense_list"), te = Symbol.for("react.memo"), R = Symbol.for("react.lazy"), ne = Symbol.for("react.activity"), re = Symbol.for("react.legacy_hidden"), z = Symbol.for("react.memo_cache_sentinel"), ie = Symbol.for("react.view_transition"), ae = Symbol.for("react.recoverable"), oe = Symbol.iterator;
	function B(e) {
		return typeof e != "object" || !e ? null : (e = oe && e[oe] || e["@@iterator"], typeof e == "function" ? e : null);
	}
	var se = Symbol.for("react.client.reference");
	function ce(e) {
		if (e == null) return null;
		if (typeof e == "function") return e.$$typeof === se ? null : e.displayName || e.name || null;
		if (typeof e == "string") return e;
		switch (e) {
			case j: return "Fragment";
			case N: return "Profiler";
			case M: return "StrictMode";
			case L: return "Suspense";
			case ee: return "SuspenseList";
			case ne: return "Activity";
			case ie: return "ViewTransition";
		}
		if (typeof e == "object") switch (e.$$typeof) {
			case A: return "Portal";
			case F: return e.displayName || "Context";
			case P: return (e._context.displayName || "Context") + ".Consumer";
			case I:
				var t = e.render;
				return e = e.displayName, e ||= (e = t.displayName || t.name || "", e === "" ? "ForwardRef" : "ForwardRef(" + e + ")"), e;
			case te: return t = e.displayName || null, t === null ? ce(e.type) || "Memo" : t;
			case R:
				t = e._payload, e = e._init;
				try {
					return ce(e(t));
				} catch {}
		}
		return null;
	}
	var V = Array.isArray, H = n.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, U = r.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, le = {
		pending: !1,
		data: null,
		method: null,
		action: null
	}, ue = [], de = -1;
	function fe(e) {
		return { current: e };
	}
	function pe(e) {
		0 > de || (e.current = ue[de], ue[de] = null, de--);
	}
	function W(e, t) {
		de++, ue[de] = e.current, e.current = t;
	}
	var me = fe(null), G = fe(null), K = fe(null), q = fe(null);
	function he(e, t) {
		switch (W(K, t), W(G, e), W(me, null), t.nodeType) {
			case 9:
			case 11:
				e = (e = t.documentElement) && (e = e.namespaceURI) ? dp(e) : 0;
				break;
			default: if (e = t.tagName, t = t.namespaceURI) t = dp(t), e = fp(t, e);
			else switch (e) {
				case "svg":
					e = 1;
					break;
				case "math":
					e = 2;
					break;
				default: e = 0;
			}
		}
		pe(me), W(me, e);
	}
	function ge() {
		pe(me), pe(G), pe(K);
	}
	function _e(e) {
		var t = e.memoizedState;
		t !== null && (ch._currentValue = t.memoizedState, W(q, e)), t = me.current;
		var n = fp(t, e.type);
		t !== n && (W(G, e), W(me, n));
	}
	function ve(e) {
		G.current === e && (pe(me), pe(G)), q.current === e && (pe(q), ch._currentValue = le);
	}
	var ye, be;
	function xe(e) {
		if (ye === void 0) try {
			throw Error();
		} catch (e) {
			var t = e.stack.trim().match(/\n( *(at )?)/);
			ye = t && t[1] || "", be = -1 < e.stack.indexOf("\n    at") ? " (<anonymous>)" : -1 < e.stack.indexOf("@") ? "@unknown:0:0" : "";
		}
		return "\n" + ye + e + be;
	}
	var Se = !1;
	function Ce(e, t) {
		if (!e || Se) return "";
		Se = !0;
		var n = Error.prepareStackTrace;
		Error.prepareStackTrace = void 0;
		try {
			var r = { DetermineComponentFrameRoot: function() {
				try {
					if (t) {
						var n = function() {
							throw Error();
						};
						if (Object.defineProperty(n.prototype, "props", { set: function() {
							throw Error();
						} }), typeof Reflect == "object" && Reflect.construct) {
							try {
								Reflect.construct(n, []);
							} catch (e) {
								var r = e;
							}
							Reflect.construct(e, [], n);
						} else {
							try {
								n.call();
							} catch (e) {
								r = e;
							}
							n = !1;
							try {
								var i = Object.getOwnPropertyDescriptor(e.prototype, "props");
								Object.defineProperty(e.prototype, "props", {
									configurable: !0,
									set: function() {
										throw Error();
									}
								}), n = !0, new e();
							} finally {
								n && (i === void 0 ? delete e.prototype.props : Object.defineProperty(e.prototype, "props", i));
							}
						}
					} else {
						try {
							throw Error();
						} catch (e) {
							r = e;
						}
						(n = e()) && typeof n.catch == "function" && n.catch(function() {});
					}
				} catch (e) {
					if (e && r && typeof e.stack == "string") return [e.stack, r.stack];
				}
				return [null, null];
			} };
			r.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
			var i = Object.getOwnPropertyDescriptor(r.DetermineComponentFrameRoot, "name");
			i && i.configurable && Object.defineProperty(r.DetermineComponentFrameRoot, "name", { value: "DetermineComponentFrameRoot" });
			var a = r.DetermineComponentFrameRoot(), o = a[0], s = a[1];
			if (o && s) {
				var c = o.split("\n"), l = s.split("\n");
				for (i = r = 0; r < c.length && !c[r].includes("DetermineComponentFrameRoot");) r++;
				for (; i < l.length && !l[i].includes("DetermineComponentFrameRoot");) i++;
				if (r === c.length || i === l.length) for (r = c.length - 1, i = l.length - 1; 1 <= r && 0 <= i && c[r] !== l[i];) i--;
				for (; 1 <= r && 0 <= i; r--, i--) if (c[r] !== l[i]) {
					if (r !== 1 || i !== 1) do
						if (r--, i--, 0 > i || c[r] !== l[i]) {
							var u = "\n" + c[r].replace(" at new ", " at ");
							return e.displayName && u.includes("<anonymous>") && (u = u.replace("<anonymous>", e.displayName)), u;
						}
					while (1 <= r && 0 <= i);
					break;
				}
			}
		} finally {
			Se = !1, Error.prepareStackTrace = n;
		}
		return (n = e ? e.displayName || e.name : "") ? xe(n) : "";
	}
	function we(e, t) {
		switch (e.tag) {
			case 26:
			case 27:
			case 5: return xe(e.type);
			case 16: return xe("Lazy");
			case 13: return e.child !== t && t !== null ? xe("Suspense Fallback") : xe("Suspense");
			case 19: return xe("SuspenseList");
			case 0:
			case 15: return Ce(e.type, !1);
			case 11: return Ce(e.type.render, !1);
			case 1: return Ce(e.type, !0);
			case 31: return xe("Activity");
			case 30: return xe("ViewTransition");
			default: return "";
		}
	}
	function Te(e) {
		try {
			var t = "", n = null;
			do
				t += we(e, n), n = e, e = e.return;
			while (e);
			return t;
		} catch (e) {
			return "\nError generating stack: " + e.message + "\n" + e.stack;
		}
	}
	var Ee = Object.prototype.hasOwnProperty, De = t.unstable_scheduleCallback, Oe = t.unstable_cancelCallback, ke = t.unstable_shouldYield, Ae = t.unstable_requestPaint, je = t.unstable_now, Me = t.unstable_getCurrentPriorityLevel, Ne = t.unstable_ImmediatePriority, Pe = t.unstable_UserBlockingPriority, Fe = t.unstable_NormalPriority, Ie = t.unstable_LowPriority, J = t.unstable_IdlePriority, Le = t.log, Re = t.unstable_setDisableYieldValue, ze = null, Be = null;
	function Ve(e) {
		if (typeof Le == "function" && Re(e), Be && typeof Be.setStrictMode == "function") try {
			Be.setStrictMode(ze, e);
		} catch {}
	}
	var He = Math.clz32 ? Math.clz32 : Ge, Ue = Math.log, We = Math.LN2;
	function Ge(e) {
		return e >>>= 0, e === 0 ? 32 : 31 - (Ue(e) / We | 0) | 0;
	}
	var Ke = 256, qe = 262144, Je = 4194304;
	function Ye(e) {
		var t = e & 42;
		if (t !== 0) return t;
		switch (e & -e) {
			case 1: return 1;
			case 2: return 2;
			case 4: return 4;
			case 8: return 8;
			case 16: return 16;
			case 32: return 32;
			case 64: return 64;
			case 128: return 128;
			case 256:
			case 512:
			case 1024:
			case 2048:
			case 4096:
			case 8192:
			case 16384:
			case 32768:
			case 65536:
			case 131072: return e & -e;
			case 262144:
			case 524288:
			case 1048576:
			case 2097152: return e & 3932160;
			case 4194304:
			case 8388608:
			case 16777216:
			case 33554432: return e & 62914560;
			case 67108864: return 67108864;
			case 134217728: return 134217728;
			case 268435456: return 268435456;
			case 536870912: return 536870912;
			case 1073741824: return 0;
			default: return e;
		}
	}
	function Xe(e, t, n) {
		var r = e.pendingLanes;
		if (r === 0) return 0;
		var i = 0, a = e.suspendedLanes, o = e.pingedLanes;
		e = e.warmLanes;
		var s = r & 134217727;
		return s === 0 ? (s = r & ~a, s === 0 ? o === 0 ? n || (n = r & ~e, n !== 0 && (i = Ye(n))) : i = Ye(o) : i = Ye(s)) : (r = s & ~a, r === 0 ? (o &= s, o === 0 ? n || (n = s & ~e, n !== 0 && (i = Ye(n))) : i = Ye(o)) : i = Ye(r)), i === 0 ? 0 : t !== 0 && t !== i && (t & a) === 0 && (a = i & -i, n = t & -t, a >= n || a === 32 && n & 4194048) ? t : i;
	}
	function Ze(e, t) {
		return (e.pendingLanes & ~(e.suspendedLanes & ~e.pingedLanes) & t) === 0;
	}
	function Qe(e, t) {
		t & 8 && (t |= t & 32);
		var n = e.entangledLanes;
		if (n !== 0) for (e = e.entanglements, n &= t; 0 < n;) {
			var r = 31 - He(n), i = 1 << r;
			t |= e[r], n &= ~i;
		}
		return t;
	}
	function $e(e, t) {
		switch (e) {
			case 1:
			case 2:
			case 4:
			case 8:
			case 64: return t + 250;
			case 16:
			case 32:
			case 128:
			case 256:
			case 512:
			case 1024:
			case 2048:
			case 4096:
			case 8192:
			case 16384:
			case 32768:
			case 65536:
			case 131072:
			case 262144:
			case 524288:
			case 1048576:
			case 2097152: return t + 5e3;
			case 4194304:
			case 8388608:
			case 16777216:
			case 33554432: return -1;
			case 67108864:
			case 134217728:
			case 268435456:
			case 536870912:
			case 1073741824: return -1;
			default: return -1;
		}
	}
	function et() {
		var e = Je;
		return Je <<= 1, !(Je & 62914560) && (Je = 4194304), e;
	}
	function tt(e) {
		for (var t = [], n = 0; 31 > n; n++) t.push(e);
		return t;
	}
	function nt(e, t) {
		e.pendingLanes |= t, t !== 268435456 && (e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0);
	}
	function rt(e, t, n, r, i, a) {
		var o = e.pendingLanes;
		e.pendingLanes = n, e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0, e.expiredLanes &= n, e.entangledLanes &= n, e.errorRecoveryDisabledLanes &= n, e.shellSuspendCounter = 0;
		var s = e.entanglements, c = e.expirationTimes, l = e.hiddenUpdates;
		for (n = o & ~n; 0 < n;) {
			var u = 31 - He(n), d = 1 << u;
			s[u] = 0, c[u] = -1;
			var f = l[u];
			if (f !== null) for (l[u] = null, u = 0; u < f.length; u++) {
				var p = f[u];
				p !== null && (p.lane &= -536870913);
			}
			n &= ~d;
		}
		r !== 0 && it(e, r, 0), a !== 0 && i === 0 && e.tag !== 0 && (e.suspendedLanes |= a & ~(o & ~t));
	}
	function it(e, t, n) {
		e.pendingLanes |= t, e.suspendedLanes &= ~t;
		var r = 31 - He(t);
		e.entangledLanes |= t, e.entanglements[r] = e.entanglements[r] | 1073741824 | n & 261930;
	}
	function at(e, t) {
		var n = e.entangledLanes |= t;
		for (e = e.entanglements; n;) {
			var r = 31 - He(n), i = 1 << r;
			i & t | e[r] & t && (e[r] |= t), n &= ~i;
		}
	}
	function ot(e, t) {
		var n = t & -t;
		return n = n & 42 ? 1 : st(n), (n & (e.suspendedLanes | t)) === 0 ? n : 0;
	}
	function st(e) {
		switch (e) {
			case 2:
				e = 1;
				break;
			case 8:
				e = 4;
				break;
			case 32:
				e = 16;
				break;
			case 256:
			case 512:
			case 1024:
			case 2048:
			case 4096:
			case 8192:
			case 16384:
			case 32768:
			case 65536:
			case 131072:
			case 262144:
			case 524288:
			case 1048576:
			case 2097152:
			case 4194304:
			case 8388608:
			case 16777216:
			case 33554432:
				e = 128;
				break;
			case 268435456:
				e = 134217728;
				break;
			default: e = 0;
		}
		return e;
	}
	function ct(e) {
		return e &= -e, 2 < e ? 8 < e ? e & 134217727 ? 32 : 268435456 : 8 : 2;
	}
	function lt() {
		var e = U.p;
		return e === 0 ? (e = window.event, e === void 0 ? 32 : wh(e.type)) : e;
	}
	function ut(e, t) {
		var n = U.p;
		try {
			return U.p = e, t();
		} finally {
			U.p = n;
		}
	}
	var dt = Math.random().toString(36).slice(2), ft = "__reactFiber$" + dt, pt = "__reactProps$" + dt, mt = "__reactContainer$" + dt, ht = "__reactEvents$" + dt, gt = "__reactListeners$" + dt, _t = "__reactHandles$" + dt, vt = "__reactResources$" + dt, yt = "__reactMarker$" + dt, bt = "__reactLoad$" + dt;
	function xt(e) {
		delete e[ft], delete e[pt], delete e[gt], delete e[_t];
	}
	function St(e) {
		var t;
		if (t = e[ft]) return t;
		for (var n = e.parentNode; n;) {
			if (t = n[mt] || n[ft]) {
				if (n = t.alternate, t.child !== null || n !== null && n.child !== null) for (e = pm(e); e !== null;) {
					if (n = e[ft]) return n;
					e = pm(e);
				}
				return t;
			}
			e = n, n = e.parentNode;
		}
		return null;
	}
	function Ct(e) {
		if (e = e[ft] || e[mt]) {
			var t = e.tag;
			if (t === 5 || t === 6 || t === 13 || t === 31 || t === 26 || t === 27 || t === 3) return e;
		}
		return null;
	}
	function wt(e) {
		var t = e.tag;
		if (t === 5 || t === 26 || t === 27 || t === 6) return e.stateNode;
		throw Error(i(33));
	}
	function Tt(e) {
		var t = e[vt];
		return t ||= e[vt] = {
			hoistableStyles: /* @__PURE__ */ new Map(),
			hoistableScripts: /* @__PURE__ */ new Map()
		}, t;
	}
	function Et(e) {
		e[yt] = !0;
	}
	function Dt(e) {
		e[bt] = void 0;
	}
	var Ot = /* @__PURE__ */ new Set(), kt = {};
	function At(e, t) {
		jt(e, t), jt(e + "Capture", t);
	}
	function jt(e, t) {
		for (kt[e] = t, e = 0; e < t.length; e++) Ot.add(t[e]);
	}
	var Mt = RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"), Nt = {}, Pt = {};
	function Ft(e) {
		return Ee.call(Pt, e) ? !0 : Ee.call(Nt, e) ? !1 : Mt.test(e) ? Pt[e] = !0 : (Nt[e] = !0, !1);
	}
	var It = !1;
	function Lt() {
		var e = It;
		return It = !1, e;
	}
	function Rt(e, t, n) {
		if (Ft(t)) {
			if (n === null) e.removeAttribute(t);
			else {
				switch (typeof n) {
					case "undefined":
					case "function":
					case "symbol":
						e.removeAttribute(t);
						return;
					case "boolean":
						var r = t.toLowerCase().slice(0, 5);
						if (r !== "data-" && r !== "aria-") {
							e.removeAttribute(t);
							return;
						}
				}
				e.setAttribute(t, n);
			}
		}
	}
	function zt(e, t, n) {
		if (n === null) e.removeAttribute(t);
		else {
			switch (typeof n) {
				case "undefined":
				case "function":
				case "symbol":
				case "boolean":
					e.removeAttribute(t);
					return;
			}
			e.setAttribute(t, n);
		}
	}
	function Bt(e, t, n, r) {
		if (r === null) e.removeAttribute(n);
		else {
			switch (typeof r) {
				case "undefined":
				case "function":
				case "symbol":
				case "boolean":
					e.removeAttribute(n);
					return;
			}
			e.setAttributeNS(t, n, r);
		}
	}
	function Vt(e) {
		switch (typeof e) {
			case "bigint":
			case "boolean":
			case "number":
			case "string":
			case "undefined": return e;
			case "object": return e;
			default: return "";
		}
	}
	function Ht(e) {
		var t = e.type;
		return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
	}
	function Ut(e, t, n) {
		var r = Object.getOwnPropertyDescriptor(e.constructor.prototype, t);
		if (!e.hasOwnProperty(t) && r !== void 0 && typeof r.get == "function" && typeof r.set == "function") {
			var i = r.get, a = r.set;
			return Object.defineProperty(e, t, {
				configurable: !0,
				get: function() {
					return i.call(this);
				},
				set: function(e) {
					n = "" + e, a.call(this, e);
				}
			}), Object.defineProperty(e, t, { enumerable: r.enumerable }), {
				getValue: function() {
					return n;
				},
				setValue: function(e) {
					n = "" + e;
				},
				stopTracking: function() {
					e._valueTracker = null, delete e[t];
				}
			};
		}
	}
	function Wt(e) {
		if (!e._valueTracker) {
			var t = Ht(e) ? "checked" : "value";
			e._valueTracker = Ut(e, t, "" + e[t]);
		}
	}
	function Gt(e) {
		if (!e) return !1;
		var t = e._valueTracker;
		if (!t) return !0;
		var n = t.getValue(), r = "";
		return e && (r = Ht(e) ? e.checked ? "true" : "false" : e.value), e = r, e !== n && (t.setValue(e), !0);
	}
	var Kt = /[\n"\\]/g;
	function qt(e) {
		return e.replace(Kt, function(e) {
			return "\\" + e.charCodeAt(0).toString(16) + " ";
		});
	}
	function Jt(e, t, n, r, i, a, o, s) {
		e.name = "", o != null && typeof o != "function" && typeof o != "symbol" && typeof o != "boolean" ? e.type = o : e.removeAttribute("type"), t == null ? o !== "submit" && o !== "reset" || e.removeAttribute("value") : o === "number" ? (t === 0 && e.value === "" || e.value != t) && (e.value = "" + Vt(t)) : e.value !== "" + Vt(t) && (e.value = "" + Vt(t)), t == null ? n == null ? r != null && e.removeAttribute("value") : Xt(e, Vt(n)) : o === "number" && e.value == t ? Xt(e, Vt(e.value)) : Xt(e, Vt(t)), i == null && a != null && (e.defaultChecked = !!a), i != null && (e.checked = i && typeof i != "function" && typeof i != "symbol"), s != null && typeof s != "function" && typeof s != "symbol" && typeof s != "boolean" ? e.name = "" + Vt(s) : e.removeAttribute("name");
	}
	function Yt(e, t, n, r, i, a, o, s) {
		if (a != null && typeof a != "function" && typeof a != "symbol" && typeof a != "boolean" && (e.type = a), t != null || n != null) {
			if (!(a !== "submit" && a !== "reset" || t != null)) {
				Wt(e);
				return;
			}
			n = n == null ? "" : "" + Vt(n), t = t == null ? n : "" + Vt(t), s || t === e.value || (e.value = t), e.defaultValue = t;
		}
		r ??= i, r = typeof r != "function" && typeof r != "symbol" && !!r, e.checked = s ? e.checked : !!r, e.defaultChecked = !!r, o != null && typeof o != "function" && typeof o != "symbol" && typeof o != "boolean" && (e.name = o), Wt(e);
	}
	function Xt(e, t) {
		e.defaultValue !== "" + t && (e.defaultValue = "" + t);
	}
	function Zt(e, t, n, r) {
		if (e = e.options, t) {
			t = {};
			for (var i = 0; i < n.length; i++) t["$" + n[i]] = !0;
			for (n = 0; n < e.length; n++) i = t.hasOwnProperty("$" + e[n].value), e[n].selected !== i && (e[n].selected = i), i && r && (e[n].defaultSelected = !0);
		} else {
			for (n = "" + Vt(n), t = null, i = 0; i < e.length; i++) {
				if (e[i].value === n) {
					e[i].selected = !0, r && (e[i].defaultSelected = !0);
					return;
				}
				t !== null || e[i].disabled || (t = e[i]);
			}
			t !== null && (t.selected = !0);
		}
	}
	function Qt(e, t, n) {
		t != null && (t = "" + Vt(t), t !== e.value && (e.value = t), n == null) ? e.defaultValue !== t && (e.defaultValue = t) : e.defaultValue = n == null ? "" : "" + Vt(n);
	}
	function $t(e, t, n, r) {
		if (t == null) {
			if (r != null) {
				if (n != null) throw Error(i(92));
				if (V(r)) {
					if (1 < r.length) throw Error(i(93));
					r = r[0];
				}
				n = r;
			}
			n ??= "", t = n;
		}
		n = Vt(t), e.defaultValue = n, r = e.textContent, r === n && r !== "" && r !== null && (e.value = r), Wt(e);
	}
	function en(e, t) {
		if (t) {
			var n = e.firstChild;
			if (n && n === e.lastChild && n.nodeType === 3) {
				n.nodeValue = t;
				return;
			}
		}
		e.textContent = t;
	}
	var tn = new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));
	function nn(e, t, n) {
		var r = t.indexOf("--") === 0;
		n == null || typeof n == "boolean" || n === "" ? r ? e.setProperty(t, "") : t === "float" ? e.cssFloat = "" : e[t] = "" : r ? e.setProperty(t, n) : typeof n != "number" || n === 0 || tn.has(t) ? t === "float" ? e.cssFloat = n : e[t] = ("" + n).trim() : e[t] = n + "px";
	}
	function rn(e, t, n) {
		if (t != null && typeof t != "object") throw Error(i(62));
		if (e = e.style, n != null) {
			for (var r in n) !n.hasOwnProperty(r) || t != null && t.hasOwnProperty(r) || (r.indexOf("--") === 0 ? e.setProperty(r, "") : r === "float" ? e.cssFloat = "" : e[r] = "", It = !0);
			for (var a in t) r = t[a], t.hasOwnProperty(a) && n[a] !== r && (nn(e, a, r), It = !0);
		} else for (var o in t) t.hasOwnProperty(o) && nn(e, o, t[o]);
	}
	function an(e) {
		if (e.indexOf("-") === -1) return !1;
		switch (e) {
			case "annotation-xml":
			case "color-profile":
			case "font-face":
			case "font-face-src":
			case "font-face-uri":
			case "font-face-format":
			case "font-face-name":
			case "missing-glyph": return !1;
			default: return !0;
		}
	}
	var on = /* @__PURE__ */ new Map([
		["acceptCharset", "accept-charset"],
		["htmlFor", "for"],
		["httpEquiv", "http-equiv"],
		["crossOrigin", "crossorigin"],
		["accentHeight", "accent-height"],
		["alignmentBaseline", "alignment-baseline"],
		["arabicForm", "arabic-form"],
		["baselineShift", "baseline-shift"],
		["capHeight", "cap-height"],
		["clipPath", "clip-path"],
		["clipRule", "clip-rule"],
		["colorInterpolation", "color-interpolation"],
		["colorInterpolationFilters", "color-interpolation-filters"],
		["colorProfile", "color-profile"],
		["colorRendering", "color-rendering"],
		["dominantBaseline", "dominant-baseline"],
		["enableBackground", "enable-background"],
		["fillOpacity", "fill-opacity"],
		["fillRule", "fill-rule"],
		["floodColor", "flood-color"],
		["floodOpacity", "flood-opacity"],
		["fontFamily", "font-family"],
		["fontSize", "font-size"],
		["fontSizeAdjust", "font-size-adjust"],
		["fontStretch", "font-stretch"],
		["fontStyle", "font-style"],
		["fontVariant", "font-variant"],
		["fontWeight", "font-weight"],
		["glyphName", "glyph-name"],
		["glyphOrientationHorizontal", "glyph-orientation-horizontal"],
		["glyphOrientationVertical", "glyph-orientation-vertical"],
		["horizAdvX", "horiz-adv-x"],
		["horizOriginX", "horiz-origin-x"],
		["imageRendering", "image-rendering"],
		["letterSpacing", "letter-spacing"],
		["lightingColor", "lighting-color"],
		["markerEnd", "marker-end"],
		["markerMid", "marker-mid"],
		["markerStart", "marker-start"],
		["maskType", "mask-type"],
		["overlinePosition", "overline-position"],
		["overlineThickness", "overline-thickness"],
		["paintOrder", "paint-order"],
		["panose-1", "panose-1"],
		["pointerEvents", "pointer-events"],
		["renderingIntent", "rendering-intent"],
		["shapeRendering", "shape-rendering"],
		["stopColor", "stop-color"],
		["stopOpacity", "stop-opacity"],
		["strikethroughPosition", "strikethrough-position"],
		["strikethroughThickness", "strikethrough-thickness"],
		["strokeDasharray", "stroke-dasharray"],
		["strokeDashoffset", "stroke-dashoffset"],
		["strokeLinecap", "stroke-linecap"],
		["strokeLinejoin", "stroke-linejoin"],
		["strokeMiterlimit", "stroke-miterlimit"],
		["strokeOpacity", "stroke-opacity"],
		["strokeWidth", "stroke-width"],
		["textAnchor", "text-anchor"],
		["textDecoration", "text-decoration"],
		["textRendering", "text-rendering"],
		["transformOrigin", "transform-origin"],
		["underlinePosition", "underline-position"],
		["underlineThickness", "underline-thickness"],
		["unicodeBidi", "unicode-bidi"],
		["unicodeRange", "unicode-range"],
		["unitsPerEm", "units-per-em"],
		["vAlphabetic", "v-alphabetic"],
		["vHanging", "v-hanging"],
		["vIdeographic", "v-ideographic"],
		["vMathematical", "v-mathematical"],
		["vectorEffect", "vector-effect"],
		["vertAdvY", "vert-adv-y"],
		["vertOriginX", "vert-origin-x"],
		["vertOriginY", "vert-origin-y"],
		["wordSpacing", "word-spacing"],
		["writingMode", "writing-mode"],
		["xmlnsXlink", "xmlns:xlink"],
		["xHeight", "x-height"]
	]), sn = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
	function cn(e) {
		return sn.test("" + e) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : e;
	}
	function ln() {}
	var un = null;
	function dn(e) {
		return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
	}
	var fn = null, pn = null;
	function mn(e) {
		var t = Ct(e);
		if (t && (e = t.stateNode)) {
			var n = e[pt] || null;
			a: switch (e = t.stateNode, t.type) {
				case "input":
					if (Jt(e, n.value, n.defaultValue, n.defaultValue, n.checked, n.defaultChecked, n.type, n.name), t = n.name, n.type === "radio" && t != null) {
						for (n = e; n.parentNode;) n = n.parentNode;
						for (n = n.querySelectorAll("input[name=\"" + qt("" + t) + "\"][type=\"radio\"]"), t = 0; t < n.length; t++) {
							var r = n[t];
							if (r !== e && r.form === e.form) {
								var a = r[pt] || null;
								if (!a) throw Error(i(90));
								Jt(r, a.value, a.defaultValue, a.defaultValue, a.checked, a.defaultChecked, a.type, a.name);
							}
						}
						for (t = 0; t < n.length; t++) r = n[t], r.form === e.form && Gt(r);
					}
					break a;
				case "textarea":
					Qt(e, n.value, n.defaultValue);
					break a;
				case "select": t = n.value, t != null && Zt(e, !!n.multiple, t, !1);
			}
		}
	}
	var hn = !1;
	function gn(e, t, n) {
		if (hn) return e(t, n);
		hn = !0;
		try {
			return e(t);
		} finally {
			if (hn = !1, (fn !== null || pn !== null) && (Ld(), fn && (t = fn, e = pn, pn = fn = null, mn(t), e))) for (t = 0; t < e.length; t++) mn(e[t]);
		}
	}
	function _n(e, t) {
		var n = e.stateNode;
		if (n === null) return null;
		var r = n[pt] || null;
		if (r === null) return null;
		n = r[t];
		a: switch (t) {
			case "onClick":
			case "onClickCapture":
			case "onDoubleClick":
			case "onDoubleClickCapture":
			case "onMouseDown":
			case "onMouseDownCapture":
			case "onMouseMove":
			case "onMouseMoveCapture":
			case "onMouseUp":
			case "onMouseUpCapture":
			case "onMouseEnter":
				(r = !r.disabled) || (e = e.type, r = e !== "button" && e !== "input" && e !== "select" && e !== "textarea"), e = !r;
				break a;
			default: e = !1;
		}
		if (e) return null;
		if (n && typeof n != "function") throw Error(i(231, t, typeof n));
		return n;
	}
	var vn = typeof window < "u" && window.document !== void 0 && window.document.createElement !== void 0, yn = !1;
	if (vn) try {
		var bn = {};
		Object.defineProperty(bn, "passive", { get: function() {
			yn = !0;
		} }), window.addEventListener("test", bn, bn), window.removeEventListener("test", bn, bn);
	} catch {
		yn = !1;
	}
	var xn = null, Sn = null, Cn = null;
	function wn() {
		if (Cn) return Cn;
		var e, t = Sn, n = t.length, r, i = "value" in xn ? xn.value : xn.textContent, a = i.length;
		for (e = 0; e < n && t[e] === i[e]; e++);
		var o = n - e;
		for (r = 1; r <= o && t[n - r] === i[a - r]; r++);
		return Cn = i.slice(e, 1 < r ? 1 - r : void 0);
	}
	function Tn(e) {
		var t = e.keyCode;
		return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
	}
	function En() {
		return !0;
	}
	function Dn() {
		return !1;
	}
	function On(e) {
		function t(t, n, r, i, a) {
			for (var o in this._reactName = t, this._targetInst = r, this.type = n, this.nativeEvent = i, this.target = a, this.currentTarget = null, e) e.hasOwnProperty(o) && (t = e[o], this[o] = t ? t(i) : i[o]);
			return this.isDefaultPrevented = (i.defaultPrevented == null ? !1 === i.returnValue : i.defaultPrevented) ? En : Dn, this.isPropagationStopped = Dn, this;
		}
		return D(t.prototype, {
			preventDefault: function() {
				this.defaultPrevented = !0;
				var e = this.nativeEvent;
				e && (e.preventDefault ? e.preventDefault() : typeof e.returnValue != "unknown" && (e.returnValue = !1), this.isDefaultPrevented = En);
			},
			stopPropagation: function() {
				var e = this.nativeEvent;
				e && (e.stopPropagation ? e.stopPropagation() : typeof e.cancelBubble != "unknown" && (e.cancelBubble = !0), this.isPropagationStopped = En);
			},
			persist: function() {},
			isPersistent: En
		}), t;
	}
	var kn = {
		eventPhase: 0,
		bubbles: 0,
		cancelable: 0,
		timeStamp: function(e) {
			return e.timeStamp || Date.now();
		},
		defaultPrevented: 0,
		isTrusted: 0
	}, An = On(kn), jn = D({}, kn, {
		view: 0,
		detail: 0
	}), Mn = On(jn), Nn, Pn, Fn, In = D({}, jn, {
		screenX: 0,
		screenY: 0,
		clientX: 0,
		clientY: 0,
		pageX: 0,
		pageY: 0,
		ctrlKey: 0,
		shiftKey: 0,
		altKey: 0,
		metaKey: 0,
		getModifierState: qn,
		button: 0,
		buttons: 0,
		relatedTarget: function(e) {
			return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
		},
		movementX: function(e) {
			return "movementX" in e ? e.movementX : (e !== Fn && (Fn && e.type === "mousemove" ? (Nn = e.screenX - Fn.screenX, Pn = e.screenY - Fn.screenY) : Pn = Nn = 0, Fn = e), Nn);
		},
		movementY: function(e) {
			return "movementY" in e ? e.movementY : Pn;
		}
	}), Ln = On(In), Rn = On(D({}, In, { dataTransfer: 0 })), zn = On(D({}, jn, { relatedTarget: 0 })), Bn = On(D({}, kn, {
		animationName: 0,
		elapsedTime: 0,
		pseudoElement: 0
	})), Vn = On(D({}, kn, { clipboardData: function(e) {
		return "clipboardData" in e ? e.clipboardData : window.clipboardData;
	} })), Hn = On(D({}, kn, { data: 0 })), Un = {
		Esc: "Escape",
		Spacebar: " ",
		Left: "ArrowLeft",
		Up: "ArrowUp",
		Right: "ArrowRight",
		Down: "ArrowDown",
		Del: "Delete",
		Win: "OS",
		Menu: "ContextMenu",
		Apps: "ContextMenu",
		Scroll: "ScrollLock",
		MozPrintableKey: "Unidentified"
	}, Wn = {
		8: "Backspace",
		9: "Tab",
		12: "Clear",
		13: "Enter",
		16: "Shift",
		17: "Control",
		18: "Alt",
		19: "Pause",
		20: "CapsLock",
		27: "Escape",
		32: " ",
		33: "PageUp",
		34: "PageDown",
		35: "End",
		36: "Home",
		37: "ArrowLeft",
		38: "ArrowUp",
		39: "ArrowRight",
		40: "ArrowDown",
		45: "Insert",
		46: "Delete",
		112: "F1",
		113: "F2",
		114: "F3",
		115: "F4",
		116: "F5",
		117: "F6",
		118: "F7",
		119: "F8",
		120: "F9",
		121: "F10",
		122: "F11",
		123: "F12",
		144: "NumLock",
		145: "ScrollLock",
		224: "Meta"
	}, Gn = {
		Alt: "altKey",
		Control: "ctrlKey",
		Meta: "metaKey",
		Shift: "shiftKey"
	};
	function Kn(e) {
		var t = this.nativeEvent;
		return t.getModifierState ? t.getModifierState(e) : (e = Gn[e]) ? !!t[e] : !1;
	}
	function qn() {
		return Kn;
	}
	var Jn = On(D({}, jn, {
		key: function(e) {
			if (e.key) {
				var t = Un[e.key] || e.key;
				if (t !== "Unidentified") return t;
			}
			return e.type === "keypress" ? (e = Tn(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? Wn[e.keyCode] || "Unidentified" : "";
		},
		code: 0,
		location: 0,
		ctrlKey: 0,
		shiftKey: 0,
		altKey: 0,
		metaKey: 0,
		repeat: 0,
		locale: 0,
		getModifierState: qn,
		charCode: function(e) {
			return e.type === "keypress" ? Tn(e) : 0;
		},
		keyCode: function(e) {
			return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
		},
		which: function(e) {
			return e.type === "keypress" ? Tn(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
		}
	})), Yn = On(D({}, In, {
		pointerId: 0,
		width: 0,
		height: 0,
		pressure: 0,
		tangentialPressure: 0,
		tiltX: 0,
		tiltY: 0,
		twist: 0,
		pointerType: 0,
		isPrimary: 0
	})), Xn = On(D({}, kn, { submitter: 0 })), Zn = On(D({}, jn, {
		touches: 0,
		targetTouches: 0,
		changedTouches: 0,
		altKey: 0,
		metaKey: 0,
		ctrlKey: 0,
		shiftKey: 0,
		getModifierState: qn
	})), Qn = On(D({}, kn, {
		propertyName: 0,
		elapsedTime: 0,
		pseudoElement: 0
	})), $n = On(D({}, In, {
		deltaX: function(e) {
			return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
		},
		deltaY: function(e) {
			return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
		},
		deltaZ: 0,
		deltaMode: 0
	})), er = On(D({}, kn, {
		newState: 0,
		oldState: 0,
		source: 0
	})), tr = [
		9,
		13,
		27,
		32
	], nr = vn && "CompositionEvent" in window, rr = null;
	vn && "documentMode" in document && (rr = document.documentMode);
	var ir = vn && "TextEvent" in window && !rr, ar = vn && (!nr || rr && 8 < rr && 11 >= rr), or = " ", sr = !1;
	function cr(e, t) {
		switch (e) {
			case "keyup": return tr.indexOf(t.keyCode) !== -1;
			case "keydown": return t.keyCode !== 229;
			case "keypress":
			case "mousedown":
			case "focusout": return !0;
			default: return !1;
		}
	}
	function lr(e) {
		return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
	}
	var ur = !1;
	function dr(e, t) {
		switch (e) {
			case "compositionend": return lr(t);
			case "keypress": return t.which === 32 ? (sr = !0, or) : null;
			case "textInput": return e = t.data, e === or && sr ? null : e;
			default: return null;
		}
	}
	function fr(e, t) {
		if (ur) return e === "compositionend" || !nr && cr(e, t) ? (e = wn(), Cn = Sn = xn = null, ur = !1, e) : null;
		switch (e) {
			case "paste": return null;
			case "keypress":
				if (!(t.ctrlKey || t.altKey || t.metaKey) || t.ctrlKey && t.altKey) {
					if (t.char && 1 < t.char.length) return t.char;
					if (t.which) return String.fromCharCode(t.which);
				}
				return null;
			case "compositionend": return ar && t.locale !== "ko" ? null : t.data;
			default: return null;
		}
	}
	var pr = {
		color: !0,
		date: !0,
		datetime: !0,
		"datetime-local": !0,
		email: !0,
		month: !0,
		number: !0,
		password: !0,
		range: !0,
		search: !0,
		tel: !0,
		text: !0,
		time: !0,
		url: !0,
		week: !0
	};
	function mr(e) {
		var t = e && e.nodeName && e.nodeName.toLowerCase();
		return t === "input" ? !!pr[e.type] : t === "textarea";
	}
	function hr(e, t, n, r) {
		fn ? pn ? pn.push(r) : pn = [r] : fn = r, t = Jf(t, "onChange"), 0 < t.length && (n = new An("onChange", "change", null, n, r), e.push({
			event: n,
			listeners: t
		}));
	}
	var gr = null, _r = null;
	function vr(e) {
		Bf(e, 0);
	}
	function yr(e) {
		if (Gt(wt(e))) return e;
	}
	function br(e, t) {
		if (e === "change") return t;
	}
	var xr = !1;
	if (vn) {
		var Sr;
		if (vn) {
			var Cr = "oninput" in document;
			if (!Cr) {
				var wr = document.createElement("div");
				wr.setAttribute("oninput", "return;"), Cr = typeof wr.oninput == "function";
			}
			Sr = Cr;
		} else Sr = !1;
		xr = Sr && (!document.documentMode || 9 < document.documentMode);
	}
	function Tr() {
		gr && (gr.detachEvent("onpropertychange", Er), _r = gr = null);
	}
	function Er(e) {
		if (e.propertyName === "value" && yr(_r)) {
			var t = [];
			hr(t, _r, e, dn(e)), gn(vr, t);
		}
	}
	function Dr(e, t, n) {
		e === "focusin" ? (Tr(), gr = t, _r = n, gr.attachEvent("onpropertychange", Er)) : e === "focusout" && Tr();
	}
	function Or(e) {
		if (e === "selectionchange" || e === "keyup" || e === "keydown") return yr(_r);
	}
	function kr(e, t) {
		if (e === "click") return yr(t);
	}
	function Ar(e, t) {
		if (e === "input" || e === "change") return yr(t);
	}
	function jr(e, t) {
		return e === t && (e !== 0 || 1 / e == 1 / t) || e !== e && t !== t;
	}
	var Mr = typeof Object.is == "function" ? Object.is : jr;
	function Nr(e, t) {
		if (Mr(e, t)) return !0;
		if (typeof e != "object" || !e || typeof t != "object" || !t) return !1;
		var n = Object.keys(e), r = Object.keys(t);
		if (n.length !== r.length) return !1;
		for (r = 0; r < n.length; r++) {
			var i = n[r];
			if (!Ee.call(t, i) || !Mr(e[i], t[i])) return !1;
		}
		return !0;
	}
	function Pr(e) {
		if (e ||= typeof document < "u" ? document : void 0, e === void 0) return null;
		try {
			return e.activeElement || e.body;
		} catch {
			return e.body;
		}
	}
	function Fr(e) {
		for (; e && e.firstChild;) e = e.firstChild;
		return e;
	}
	function Ir(e, t) {
		var n = Fr(e);
		e = 0;
		for (var r; n;) {
			if (n.nodeType === 3) {
				if (r = e + n.textContent.length, e <= t && r >= t) return {
					node: n,
					offset: t - e
				};
				e = r;
			}
			a: {
				for (; n;) {
					if (n.nextSibling) {
						n = n.nextSibling;
						break a;
					}
					n = n.parentNode;
				}
				n = void 0;
			}
			n = Fr(n);
		}
	}
	function Lr(e, t) {
		return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? Lr(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
	}
	function Rr(e) {
		e = e != null && e.ownerDocument != null && e.ownerDocument.defaultView != null ? e.ownerDocument.defaultView : window;
		for (var t = Pr(e.document); t instanceof e.HTMLIFrameElement;) {
			try {
				var n = typeof t.contentWindow.location.href == "string";
			} catch {
				n = !1;
			}
			if (n) e = t.contentWindow;
			else break;
			t = Pr(e.document);
		}
		return t;
	}
	function zr(e) {
		var t = e && e.nodeName && e.nodeName.toLowerCase();
		return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
	}
	var Br = vn && "documentMode" in document && 11 >= document.documentMode, Vr = null, Hr = null, Ur = null, Wr = !1;
	function Gr(e, t, n) {
		var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
		Wr || Vr == null || Vr !== Pr(r) || (r = Vr, "selectionStart" in r && zr(r) ? r = {
			start: r.selectionStart,
			end: r.selectionEnd
		} : (r = (r.ownerDocument && r.ownerDocument.defaultView || window).getSelection(), r = {
			anchorNode: r.anchorNode,
			anchorOffset: r.anchorOffset,
			focusNode: r.focusNode,
			focusOffset: r.focusOffset
		}), Ur && Nr(Ur, r) || (Ur = r, r = Jf(Hr, "onSelect"), 0 < r.length && (t = new An("onSelect", "select", null, t, n), e.push({
			event: t,
			listeners: r
		}), t.target = Vr)));
	}
	function Kr(e, t) {
		var n = {};
		return n[e.toLowerCase()] = t.toLowerCase(), n["Webkit" + e] = "webkit" + t, n["Moz" + e] = "moz" + t, n;
	}
	var qr = {
		animationend: Kr("Animation", "AnimationEnd"),
		animationiteration: Kr("Animation", "AnimationIteration"),
		animationstart: Kr("Animation", "AnimationStart"),
		transitionrun: Kr("Transition", "TransitionRun"),
		transitionstart: Kr("Transition", "TransitionStart"),
		transitioncancel: Kr("Transition", "TransitionCancel"),
		transitionend: Kr("Transition", "TransitionEnd")
	}, Jr = {}, Yr = {};
	vn && (Yr = document.createElement("div").style, "AnimationEvent" in window || (delete qr.animationend.animation, delete qr.animationiteration.animation, delete qr.animationstart.animation), "TransitionEvent" in window || delete qr.transitionend.transition);
	function Xr(e) {
		if (Jr[e]) return Jr[e];
		if (!qr[e]) return e;
		var t = qr[e], n;
		for (n in t) if (t.hasOwnProperty(n) && n in Yr) return Jr[e] = t[n];
		return e;
	}
	var Zr = Xr("animationend"), Qr = Xr("animationiteration"), $r = Xr("animationstart"), ei = Xr("transitionrun"), ti = Xr("transitionstart"), ni = Xr("transitioncancel"), ri = Xr("transitionend"), ii = /* @__PURE__ */ new Map(), ai = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error fullscreenChange fullscreenError gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
	ai.push("scrollEnd");
	function oi(e, t) {
		ii.set(e, t), At(t, [e]);
	}
	var si = 0;
	function ci(e, t) {
		if (e.name != null && e.name !== "auto") return e.name;
		if (t.autoName !== null) return t.autoName;
		e = vd.identifierPrefix;
		var n = si++;
		return e = "_" + e + "t_" + n.toString(32) + "_", t.autoName = e;
	}
	function li(e) {
		if (e == null || typeof e == "string") return e;
		var t = null, n = Ed;
		if (n !== null) for (var r = 0; r < n.length; r++) {
			var i = e[n[r]];
			if (i != null) {
				if (i === "none") return "none";
				t = t == null ? i : t + (" " + i);
			}
		}
		return t ?? e.default;
	}
	function ui(e, t) {
		return e = li(e), t = li(t), t == null ? e === "auto" ? null : e : t === "auto" ? null : t;
	}
	var di = typeof reportError == "function" ? reportError : function(e) {
		if (typeof window == "object" && typeof window.ErrorEvent == "function") {
			var t = new window.ErrorEvent("error", {
				bubbles: !0,
				cancelable: !0,
				message: typeof e == "object" && e && typeof e.message == "string" ? String(e.message) : String(e),
				error: e
			});
			if (!window.dispatchEvent(t)) return;
		} else if (typeof process == "object" && typeof process.emit == "function") {
			process.emit("uncaughtException", e);
			return;
		}
		console.error(e);
	}, fi = [], pi = 0, mi = 0;
	function hi() {
		for (var e = pi, t = mi = pi = 0; t < e;) {
			var n = fi[t];
			fi[t++] = null;
			var r = fi[t];
			fi[t++] = null;
			var i = fi[t];
			fi[t++] = null;
			var a = fi[t];
			if (fi[t++] = null, r !== null && i !== null) {
				var o = r.pending;
				o === null ? i.next = i : (i.next = o.next, o.next = i), r.pending = i;
			}
			a !== 0 && yi(n, i, a);
		}
	}
	function gi(e, t, n, r) {
		fi[pi++] = e, fi[pi++] = t, fi[pi++] = n, fi[pi++] = r, mi |= r, e.lanes |= r, e = e.alternate, e !== null && (e.lanes |= r);
	}
	function _i(e, t, n, r) {
		return gi(e, t, n, r), bi(e);
	}
	function vi(e, t) {
		return gi(e, null, null, t), bi(e);
	}
	function yi(e, t, n) {
		e.lanes |= n;
		var r = e.alternate;
		r !== null && (r.lanes |= n);
		for (var i = !1, a = e.return; a !== null;) a.childLanes |= n, r = a.alternate, r !== null && (r.childLanes |= n), a.tag === 22 && (e = a.stateNode, e === null || e._visibility & 1 || (i = !0)), e = a, a = a.return;
		return e.tag === 3 ? (a = e.stateNode, i && t !== null && (i = 31 - He(n), e = a.hiddenUpdates, r = e[i], r === null ? e[i] = [t] : r.push(t), t.lane = n | 536870912), a) : null;
	}
	function bi(e) {
		if (50 < Dd) throw Dd = 0, Od = null, Error(i(185));
		for (var t = e.return; t !== null;) e = t, t = e.return;
		return e.tag === 3 ? e.stateNode : null;
	}
	var xi = {};
	function Si(e, t, n, r) {
		this.tag = e, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = r, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
	}
	function Ci(e, t, n, r) {
		return new Si(e, t, n, r);
	}
	function wi(e) {
		return e = e.prototype, !(!e || !e.isReactComponent);
	}
	function Ti(e, t) {
		var n = e.alternate;
		return n === null ? (n = Ci(e.tag, t, e.key, e.mode), n.elementType = e.elementType, n.type = e.type, n.stateNode = e.stateNode, n.alternate = e, e.alternate = n) : (n.pendingProps = t, n.type = e.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null), n.flags = e.flags & 1206910976, n.childLanes = e.childLanes, n.lanes = e.lanes, n.child = e.child, n.memoizedProps = e.memoizedProps, n.memoizedState = e.memoizedState, n.updateQueue = e.updateQueue, t = e.dependencies, n.dependencies = t === null ? null : {
			lanes: t.lanes,
			firstContext: t.firstContext
		}, n.sibling = e.sibling, n.index = e.index, n.ref = e.ref, n.refCleanup = e.refCleanup, n;
	}
	function Ei(e, t) {
		e.flags &= 1206910978;
		var n = e.alternate;
		return n === null ? (e.childLanes = 0, e.lanes = t, e.child = null, e.subtreeFlags = 0, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null) : (e.childLanes = n.childLanes, e.lanes = n.lanes, e.child = n.child, e.subtreeFlags = 0, e.deletions = null, e.memoizedProps = n.memoizedProps, e.memoizedState = n.memoizedState, e.updateQueue = n.updateQueue, e.type = n.type, t = n.dependencies, e.dependencies = t === null ? null : {
			lanes: t.lanes,
			firstContext: t.firstContext
		}), e;
	}
	function Di(e, t, n, r, a, o) {
		var s = 0;
		if (r = e, typeof r == "function") wi(r) && (s = 1);
		else if (typeof r == "string") s = Jm(e, n, me.current) ? 26 : e === "html" || e === "head" || e === "body" ? 27 : 5;
		else a: switch (r) {
			case ne: return e = Ci(31, n, t, a), e.elementType = ne, e.lanes = o, e;
			case j: return Oi(n.children, a, o, t);
			case M:
				s = 8, a |= 24;
				break;
			case N: return e = Ci(12, n, t, a | 2), e.elementType = N, e.lanes = o, e;
			case L: return e = Ci(13, n, t, a), e.elementType = L, e.lanes = o, e;
			case ee: return e = Ci(19, n, t, a), e.elementType = ee, e.lanes = o, e;
			case re:
			case ie: return e = a | 32, e = Ci(30, n, t, e), e.elementType = ie, e.lanes = o, e.stateNode = {
				autoName: null,
				paired: null,
				clones: null,
				ref: null
			}, e;
			default:
				if (typeof r == "object" && r) switch (r.$$typeof) {
					case F:
						s = 10;
						break a;
					case P:
						s = 9;
						break a;
					case I:
						s = 11;
						break a;
					case te:
						s = 14;
						break a;
					case R:
						s = 16, r = null;
						break a;
				}
				s = 29, n = Error(i(130, e === null ? "null" : typeof e, "")), r = null;
		}
		return t = Ci(s, n, t, a), t.elementType = e, t.type = r, t.lanes = o, t;
	}
	function Oi(e, t, n, r) {
		return e = Ci(7, e, r, t), e.lanes = n, e;
	}
	function ki(e, t, n) {
		return e = Ci(6, e, null, t), e.lanes = n, e;
	}
	function Ai(e) {
		var t = Ci(18, null, null, 0);
		return t.stateNode = e, t;
	}
	function ji(e, t, n) {
		return t = Ci(4, e.children === null ? [] : e.children, e.key, t), t.lanes = n, t.stateNode = {
			containerInfo: e.containerInfo,
			pendingChildren: null,
			implementation: e.implementation
		}, t;
	}
	var Mi = /* @__PURE__ */ new WeakMap();
	function Ni(e, t) {
		if (typeof e == "object" && e) {
			var n = Mi.get(e);
			return n === void 0 ? (t = {
				value: e,
				source: t,
				stack: Te(t)
			}, Mi.set(e, t), t) : n;
		}
		return {
			value: e,
			source: t,
			stack: Te(t)
		};
	}
	var Pi = [], Fi = 0, Ii = null, Li = 0, Ri = [], zi = 0, Bi = null, Vi = 1, Hi = "";
	function Ui(e, t) {
		Pi[Fi++] = Li, Pi[Fi++] = Ii, Ii = e, Li = t;
	}
	function Wi(e, t, n) {
		Ri[zi++] = Vi, Ri[zi++] = Hi, Ri[zi++] = Bi, Bi = e;
		var r = Vi;
		e = Hi;
		var i = 32 - He(r) - 1;
		r &= ~(1 << i), n += 1;
		var a = 32 - He(t) + i;
		if (30 < a) {
			var o = i - i % 5;
			a = (r & (1 << o) - 1).toString(32), r >>= o, i -= o, Vi = 1 << 32 - He(t) + i | n << i | r, Hi = a + e;
		} else Vi = 1 << a | n << i | r, Hi = e;
	}
	function Gi(e) {
		e.return !== null && (Ui(e, 1), Wi(e, 1, 0));
	}
	function Ki(e) {
		for (; e === Ii;) Ii = Pi[--Fi], Pi[Fi] = null, Li = Pi[--Fi], Pi[Fi] = null;
		for (; e === Bi;) Bi = Ri[--zi], Ri[zi] = null, Hi = Ri[--zi], Ri[zi] = null, Vi = Ri[--zi], Ri[zi] = null;
	}
	function qi(e, t) {
		Ri[zi++] = Vi, Ri[zi++] = Hi, Ri[zi++] = Bi, Vi = t.id, Hi = t.overflow, Bi = e;
	}
	var Ji = null, Yi = null, Y = !1, Xi = null, Zi = !1, Qi = Error(i(519));
	function $i(e) {
		throw aa(Ni(Error(i(418, 1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML", "")), e)), Qi;
	}
	function ea(e) {
		var t = e.stateNode, n = e.type, r = e.memoizedProps;
		switch (t[ft] = e, t[pt] = r, n) {
			case "dialog":
				Vf("cancel", t), Vf("close", t);
				break;
			case "iframe":
			case "object":
			case "embed":
				Vf("load", t);
				break;
			case "video":
			case "audio":
				for (n = 0; n < Rf.length; n++) Vf(Rf[n], t);
				break;
			case "source":
				Vf("error", t);
				break;
			case "img":
			case "image":
			case "link":
				Vf("error", t), Vf("load", t);
				break;
			case "details":
				Vf("toggle", t);
				break;
			case "input":
				Vf("invalid", t), Yt(t, r.value, r.defaultValue, r.checked, r.defaultChecked, r.type, r.name, !0);
				break;
			case "select":
				Vf("invalid", t);
				break;
			case "textarea": Vf("invalid", t), $t(t, r.value, r.defaultValue, r.children);
		}
		n = r.children, typeof n != "string" && typeof n != "number" && typeof n != "bigint" || t.textContent === "" + n || !0 === r.suppressHydrationWarning || ep(t.textContent, n) ? (r.popover != null && (Vf("beforetoggle", t), Vf("toggle", t)), r.onScroll != null && Vf("scroll", t), r.onScrollEnd != null && Vf("scrollend", t), r.onClick != null && (t.onclick = ln), t = !0) : t = !1, t || $i(e, !0);
	}
	function ta(e) {
		for (Ji = e.return; Ji;) switch (Ji.tag) {
			case 5:
			case 31:
			case 13:
				Zi = !1;
				return;
			case 27:
			case 3:
				Zi = !0;
				return;
			default: Ji = Ji.return;
		}
	}
	function na(e) {
		if (e !== Ji) return !1;
		if (!Y) return ta(e), Y = !0, !1;
		var t = e.tag, n;
		if ((n = t !== 3 && t !== 27) && ((n = t === 5) && (n = e.type, n = n === "form" || n === "button" || mp(e.type, e.memoizedProps)), n = !n), n && Yi && $i(e), ta(e), t === 13) {
			if (e = e.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(i(317));
			Yi = fm(e);
		} else if (t === 31) {
			if (e = e.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(i(317));
			Yi = fm(e);
		} else t === 27 ? (t = Yi, Cp(e.type) ? (e = dm, dm = null, Yi = e) : Yi = t) : Yi = Ji ? um(e.stateNode.nextSibling) : null;
		return !0;
	}
	function ra() {
		Yi = Ji = null, Y = !1;
	}
	function ia() {
		var e = Xi;
		return e !== null && (ud === null ? ud = e : ud.push.apply(ud, e), Xi = null), e;
	}
	function aa(e) {
		Xi === null ? Xi = [e] : Xi.push(e);
	}
	var oa = fe(null), sa = null, ca = null;
	function la(e, t, n) {
		W(oa, t._currentValue), t._currentValue = n;
	}
	function ua(e) {
		e._currentValue = oa.current, pe(oa);
	}
	function da(e, t, n) {
		for (; e !== null;) {
			var r = e.alternate;
			if ((e.childLanes & t) === t ? r !== null && (r.childLanes & t) !== t && (r.childLanes |= t) : (e.childLanes |= t, r !== null && (r.childLanes |= t)), e === n) break;
			e = e.return;
		}
	}
	function fa(e, t, n, r) {
		var a = e.child;
		for (a !== null && (a.return = e); a !== null;) {
			var o = a.dependencies;
			if (o !== null) {
				var s = a.child;
				o = o.firstContext;
				a: for (; o !== null;) {
					var c = o;
					o = a;
					for (var l = 0; l < t.length; l++) if (c.context === t[l]) {
						o.lanes |= n, c = o.alternate, c !== null && (c.lanes |= n), da(o.return, n, e), r || (s = null);
						break a;
					}
					o = c.next;
				}
			} else if (a.tag === 18) {
				if (s = a.return, s === null) throw Error(i(341));
				s.lanes |= n, o = s.alternate, o !== null && (o.lanes |= n), da(s, n, e), s = null;
			} else a.tag === 13 && a.memoizedState !== null && a.memoizedState.dehydrated === null ? (a.lanes |= n, s = a.alternate, s !== null && (s.lanes |= n), da(a.return, n, e), s = a.child, s = s === null ? null : s.sibling) : s = a.child;
			if (s !== null) s.return = a;
			else for (s = a; s !== null;) {
				if (s === e) {
					s = null;
					break;
				}
				if (a = s.sibling, a !== null) {
					a.return = s.return, s = a;
					break;
				}
				s = s.return;
			}
			a = s;
		}
	}
	function pa(e, t, n, r) {
		e = null;
		for (var a = t, o = !1; a !== null;) {
			if (!o) {
				if (a.flags & 524288) o = !0;
				else if (a.flags & 262144) break;
			}
			if (a.tag === 10) {
				var s = a.alternate;
				if (s === null) throw Error(i(387));
				if (s = s.memoizedProps, s !== null) {
					var c = a.type;
					Mr(a.pendingProps.value, s.value) || (e === null ? e = [c] : e.push(c));
				}
			} else if (a === q.current) {
				if (s = a.alternate, s === null) throw Error(i(387));
				s.memoizedState.memoizedState !== a.memoizedState.memoizedState && (e === null ? e = [ch] : e.push(ch));
			}
			a = a.return;
		}
		return e !== null && fa(t, e, n, r), t.flags |= 262144, e !== null;
	}
	function ma(e) {
		for (e = e.firstContext; e !== null;) {
			if (!Mr(e.context._currentValue, e.memoizedValue)) return !0;
			e = e.next;
		}
		return !1;
	}
	function ha(e) {
		sa = e, ca = null, e = e.dependencies, e !== null && (e.firstContext = null);
	}
	function ga(e) {
		return va(sa, e);
	}
	function _a(e, t) {
		return sa === null && ha(e), va(e, t);
	}
	function va(e, t) {
		var n = t._currentValue;
		if (t = {
			context: t,
			memoizedValue: n,
			next: null
		}, ca === null) {
			if (e === null) throw Error(i(308));
			ca = t, e.dependencies = {
				lanes: 0,
				firstContext: t
			}, e.flags |= 524288;
		} else ca = ca.next = t;
		return n;
	}
	var ya = typeof AbortController < "u" ? AbortController : function() {
		var e = [], t = this.signal = {
			aborted: !1,
			addEventListener: function(t, n) {
				e.push(n);
			}
		};
		this.abort = function() {
			t.aborted = !0, e.forEach(function(e) {
				return e();
			});
		};
	}, ba = t.unstable_scheduleCallback, xa = t.unstable_NormalPriority, Sa = {
		$$typeof: F,
		Consumer: null,
		Provider: null,
		_currentValue: null,
		_currentValue2: null,
		_threadCount: 0
	};
	function Ca() {
		return {
			controller: new ya(),
			data: /* @__PURE__ */ new Map(),
			refCount: 0
		};
	}
	function wa(e) {
		e.refCount--, e.refCount === 0 && ba(xa, function() {
			e.controller.abort();
		});
	}
	function Ta(e, t) {
		if (e.pendingLanes & 4194048) {
			var n = e.transitionTypes;
			for (n === null && (n = e.transitionTypes = []), e = 0; e < t.length; e++) {
				var r = t[e];
				n.indexOf(r) === -1 && n.push(r);
			}
		}
	}
	var Ea = null;
	function Da(e) {
		var t = e.transitionTypes;
		return e.transitionTypes = null, t;
	}
	var Oa = null, ka = 0, Aa = 0, ja = null;
	function Ma(e, t) {
		if (Oa === null) {
			var n = Oa = [];
			ka = 0, Aa = Nf(), ja = {
				status: "pending",
				value: void 0,
				then: function(e) {
					n.push(e);
				}
			};
		}
		return ka++, t.then(Na, Na), t;
	}
	function Na() {
		if (--ka === 0 && (Ea = null, Oa !== null)) {
			ja !== null && (ja.status = "fulfilled");
			var e = Oa;
			Oa = null, Aa = 0, ja = null;
			for (var t = 0; t < e.length; t++) (0, e[t])();
		}
	}
	function Pa(e, t) {
		var n = [], r = {
			status: "pending",
			value: null,
			reason: null,
			then: function(e) {
				n.push(e);
			}
		};
		return e.then(function() {
			r.status = "fulfilled", r.value = t;
			for (var e = 0; e < n.length; e++) (0, n[e])(t);
		}, function(e) {
			for (r.status = "rejected", r.reason = e, e = 0; e < n.length; e++) (0, n[e])(void 0);
		}), r;
	}
	var Fa = H.S;
	H.S = function(e, t) {
		if (pd = je(), typeof t == "object" && t && typeof t.then == "function" && Ma(e, t), Ea !== null) for (var n = yf; n !== null;) Ta(n, Ea), n = n.next;
		if (n = e.types, n !== null) {
			for (var r = yf; r !== null;) Ta(r, n), r = r.next;
			if (Aa !== 0) {
				r = Ea, r === null && (r = Ea = []);
				for (var i = 0; i < n.length; i++) {
					var a = n[i];
					r.indexOf(a) === -1 && r.push(a);
				}
			}
		}
		Fa !== null && Fa(e, t);
	};
	var Ia = fe(null);
	function La() {
		var e = Ia.current;
		return e === null ? Ju.pooledCache : e;
	}
	function Ra(e, t) {
		t === null ? W(Ia, Ia.current) : W(Ia, t.pool);
	}
	function za() {
		var e = La();
		return e === null ? null : {
			parent: Sa._currentValue,
			pool: e
		};
	}
	var Ba = Error(i(460)), Va = Error(i(474)), Ha = Error(i(542)), Ua = { then: function() {} };
	function Wa(e) {
		return e = e.status, e === "fulfilled" || e === "rejected";
	}
	function Ga(e, t, n) {
		switch (n = e[n], n === void 0 ? e.push(t) : n !== t && (t.then(ln, ln), t = n), t.status) {
			case "fulfilled": return t.value;
			case "rejected": throw e = t.reason, Ya(e), e === void 0 && !("reason" in t) ? Error(i(600)) : e;
			default:
				if (typeof t.status == "string") t.then(ln, ln);
				else {
					if (e = Ju, e !== null && 100 < e.shellSuspendCounter) throw Error(i(482));
					e = t, e.status = "pending", e.then(function(e) {
						if (t.status === "pending") {
							var n = t;
							n.status = "fulfilled", n.value = e;
						}
					}, function(e) {
						if (t.status === "pending") {
							var n = t;
							n.status = "rejected", n.reason = e;
						}
					});
				}
				switch (t.status) {
					case "fulfilled": return t.value;
					case "rejected": throw e = t.reason, Ya(e), e;
				}
				throw qa = t, Ba;
		}
	}
	function Ka(e) {
		try {
			var t = e._init;
			return t(e._payload);
		} catch (e) {
			throw typeof e == "object" && e && typeof e.then == "function" ? (qa = e, Ba) : e;
		}
	}
	var qa = null;
	function Ja() {
		if (qa === null) throw Error(i(459));
		var e = qa;
		return qa = null, e;
	}
	function Ya(e) {
		if (e === Ba || e === Ha) throw Error(i(483));
	}
	var Xa = null, Za = 0;
	function Qa(e) {
		var t = Za;
		return Za += 1, Xa === null && (Xa = []), Ga(Xa, e, t);
	}
	function $a(e, t) {
		t = t.props.ref, e.ref = t === void 0 ? null : t;
	}
	function eo(e, t) {
		throw t.$$typeof === O ? Error(i(525)) : (e = Object.prototype.toString.call(t), Error(i(31, e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e)));
	}
	function to(e) {
		function t(t, n) {
			if (e) {
				var r = t.deletions;
				r === null ? (t.deletions = [n], t.flags |= 16) : r.push(n);
			}
		}
		function n(n, r) {
			if (!e) return null;
			for (; r !== null;) t(n, r), r = r.sibling;
			return null;
		}
		function r(e) {
			for (var t = /* @__PURE__ */ new Map(); e !== null;) e.key === null ? t.set(e.index, e) : t.set(e.key, e), e = e.sibling;
			return t;
		}
		function a(e, t) {
			return e = Ti(e, t), e.index = 0, e.sibling = null, e;
		}
		function o(t, n, r) {
			return t.index = r, e ? (r = t.alternate, r === null ? (t.flags |= 134217730, n) : (r = r.index, r < n ? (t.flags |= 2, n) : r)) : (t.flags |= 1048576, n);
		}
		function s(t) {
			return e && t.alternate === null && (t.flags |= 134217730), t;
		}
		function c(e, t, n, r) {
			return t === null || t.tag !== 6 ? (t = ki(n, e.mode, r), t.return = e, t) : (t = a(t, n), t.return = e, t);
		}
		function l(e, t, n, r) {
			var i = n.type;
			return i === j ? (e = d(e, t, n.props.children, r, n.key), $a(e, n), e) : t !== null && (t.elementType === i || typeof i == "object" && i && i.$$typeof === R && Ka(i) === t.type) ? (t = a(t, n.props), $a(t, n), t.return = e, t) : (t = Di(n.type, n.key, n.props, null, e.mode, r), $a(t, n), t.return = e, t);
		}
		function u(e, t, n, r) {
			return t === null || t.tag !== 4 || t.stateNode.containerInfo !== n.containerInfo || t.stateNode.implementation !== n.implementation ? (t = ji(n, e.mode, r), t.return = e, t) : (t = a(t, n.children || []), t.return = e, t);
		}
		function d(e, t, n, r, i) {
			return t === null || t.tag !== 7 ? (t = Oi(n, e.mode, r, i), t.return = e, t) : (t = a(t, n), t.return = e, t);
		}
		function f(e, t, n) {
			if (typeof t == "string" && t !== "" || typeof t == "number" || typeof t == "bigint") return t = ki("" + t, e.mode, n), t.return = e, t;
			if (typeof t == "object" && t) {
				switch (t.$$typeof) {
					case k: return n = Di(t.type, t.key, t.props, null, e.mode, n), $a(n, t), n.return = e, n;
					case A: return t = ji(t, e.mode, n), t.return = e, t;
					case R: return t = Ka(t), f(e, t, n);
				}
				if (V(t) || B(t)) return t = Oi(t, e.mode, n, null), t.return = e, t;
				if (typeof t.then == "function") return f(e, Qa(t), n);
				if (t.$$typeof === F) return f(e, _a(e, t), n);
				eo(e, t);
			}
			return null;
		}
		function p(e, t, n, r) {
			var i = t === null ? null : t.key;
			if (typeof n == "string" && n !== "" || typeof n == "number" || typeof n == "bigint") return i === null ? c(e, t, "" + n, r) : null;
			if (typeof n == "object" && n) {
				switch (n.$$typeof) {
					case k: return n.key === i ? l(e, t, n, r) : null;
					case A: return n.key === i ? u(e, t, n, r) : null;
					case R: return n = Ka(n), p(e, t, n, r);
				}
				if (V(n) || B(n)) return i === null ? d(e, t, n, r, null) : null;
				if (typeof n.then == "function") return p(e, t, Qa(n), r);
				if (n.$$typeof === F) return p(e, t, _a(e, n), r);
				eo(e, n);
			}
			return null;
		}
		function m(e, t, n, r, i) {
			if (typeof r == "string" && r !== "" || typeof r == "number" || typeof r == "bigint") return e = e.get(n) || null, c(t, e, "" + r, i);
			if (typeof r == "object" && r) {
				switch (r.$$typeof) {
					case k: return e = e.get(r.key === null ? n : r.key) || null, l(t, e, r, i);
					case A: return e = e.get(r.key === null ? n : r.key) || null, u(t, e, r, i);
					case R: return r = Ka(r), m(e, t, n, r, i);
				}
				if (V(r) || B(r)) return e = e.get(n) || null, d(t, e, r, i, null);
				if (typeof r.then == "function") return m(e, t, n, Qa(r), i);
				if (r.$$typeof === F) return m(e, t, n, _a(t, r), i);
				eo(t, r);
			}
			return null;
		}
		function h(i, a, s, c) {
			for (var l = null, u = null, d = a, h = a = 0, g = null; d !== null && h < s.length; h++) {
				d.index > h ? (g = d, d = null) : g = d.sibling;
				var _ = p(i, d, s[h], c);
				if (_ === null) {
					d === null && (d = g);
					break;
				}
				e && d && _.alternate === null && t(i, d), a = o(_, a, h), u === null ? l = _ : u.sibling = _, u = _, d = g;
			}
			if (h === s.length) return n(i, d), Y && Ui(i, h), l;
			if (d === null) {
				for (; h < s.length; h++) d = f(i, s[h], c), d !== null && (a = o(d, a, h), u === null ? l = d : u.sibling = d, u = d);
				return Y && Ui(i, h), l;
			}
			for (d = r(d); h < s.length; h++) g = m(d, i, h, s[h], c), g !== null && (e && (_ = g.alternate, _ !== null && d.delete(_.key === null ? h : _.key)), a = o(g, a, h), u === null ? l = g : u.sibling = g, u = g);
			return e && d.forEach(function(e) {
				return t(i, e);
			}), Y && Ui(i, h), l;
		}
		function g(a, s, c, l) {
			if (c == null) throw Error(i(151));
			for (var u = null, d = null, h = s, g = s = 0, _ = null, v = c.next(); h !== null && !v.done; g++, v = c.next()) {
				h.index > g ? (_ = h, h = null) : _ = h.sibling;
				var y = p(a, h, v.value, l);
				if (y === null) {
					h === null && (h = _);
					break;
				}
				e && h && y.alternate === null && t(a, h), s = o(y, s, g), d === null ? u = y : d.sibling = y, d = y, h = _;
			}
			if (v.done) return n(a, h), Y && Ui(a, g), u;
			if (h === null) {
				for (; !v.done; g++, v = c.next()) v = f(a, v.value, l), v !== null && (s = o(v, s, g), d === null ? u = v : d.sibling = v, d = v);
				return Y && Ui(a, g), u;
			}
			for (h = r(h); !v.done; g++, v = c.next()) v = m(h, a, g, v.value, l), v !== null && (e && (_ = v.alternate, _ !== null && h.delete(_.key === null ? g : _.key)), s = o(v, s, g), d === null ? u = v : d.sibling = v, d = v);
			return e && h.forEach(function(e) {
				return t(a, e);
			}), Y && Ui(a, g), u;
		}
		function _(e, r, o, c) {
			if (typeof o == "object" && o && o.type === j && o.key === null && o.props.ref === void 0 && (o = o.props.children), typeof o == "object" && o) {
				switch (o.$$typeof) {
					case k:
						a: {
							for (var l = o.key; r !== null;) {
								if (r.key === l) {
									if (l = o.type, l === j) {
										if (r.tag === 7) {
											n(e, r.sibling), c = a(r, o.props.children), $a(c, o), c.return = e, e = c;
											break a;
										}
									} else if (r.elementType === l || typeof l == "object" && l && l.$$typeof === R && Ka(l) === r.type) {
										n(e, r.sibling), c = a(r, o.props), $a(c, o), c.return = e, e = c;
										break a;
									}
									n(e, r);
									break;
								}
								t(e, r), r = r.sibling;
							}
							o.type === j ? (c = Oi(o.props.children, e.mode, c, o.key), $a(c, o), c.return = e, e = c) : (c = Di(o.type, o.key, o.props, null, e.mode, c), $a(c, o), c.return = e, e = c);
						}
						return s(e);
					case A:
						a: {
							for (l = o.key; r !== null;) {
								if (r.key === l) {
									if (r.tag === 4 && r.stateNode.containerInfo === o.containerInfo && r.stateNode.implementation === o.implementation) {
										n(e, r.sibling), c = a(r, o.children || []), c.return = e, e = c;
										break a;
									}
									n(e, r);
									break;
								}
								t(e, r), r = r.sibling;
							}
							c = ji(o, e.mode, c), c.return = e, e = c;
						}
						return s(e);
					case R: return o = Ka(o), _(e, r, o, c);
				}
				if (V(o)) return h(e, r, o, c);
				if (B(o)) {
					if (l = B(o), typeof l != "function") throw Error(i(150));
					return o = l.call(o), g(e, r, o, c);
				}
				if (typeof o.then == "function") return _(e, r, Qa(o), c);
				if (o.$$typeof === F) return _(e, r, _a(e, o), c);
				eo(e, o);
			}
			return typeof o == "string" && o !== "" || typeof o == "number" || typeof o == "bigint" ? (o = "" + o, r !== null && r.tag === 6 ? (n(e, r.sibling), c = a(r, o), c.return = e, e = c) : (n(e, r), c = ki(o, e.mode, c), c.return = e, e = c), s(e)) : n(e, r);
		}
		return function(e, t, n, r) {
			try {
				Za = 0;
				var i = _(e, t, n, r);
				return Xa = null, i;
			} catch (t) {
				if (t === Ba || t === Ha) throw t;
				var a = Ci(29, t, null, e.mode);
				return a.lanes = r, a.return = e, a;
			}
		};
	}
	var no = to(!0), ro = to(!1), io = !1;
	function ao(e) {
		e.updateQueue = {
			baseState: e.memoizedState,
			firstBaseUpdate: null,
			lastBaseUpdate: null,
			shared: {
				pending: null,
				lanes: 0,
				hiddenCallbacks: null
			},
			callbacks: null
		};
	}
	function oo(e, t) {
		e = e.updateQueue, t.updateQueue === e && (t.updateQueue = {
			baseState: e.baseState,
			firstBaseUpdate: e.firstBaseUpdate,
			lastBaseUpdate: e.lastBaseUpdate,
			shared: e.shared,
			callbacks: null
		});
	}
	function so(e) {
		return {
			lane: e,
			tag: 0,
			payload: null,
			callback: null,
			next: null
		};
	}
	function co(e, t, n) {
		var r = e.updateQueue;
		if (r === null) return null;
		if (r = r.shared, Q & 2) {
			var i = r.pending;
			return i === null ? t.next = t : (t.next = i.next, i.next = t), r.pending = t, t = bi(e), yi(e, null, n), t;
		}
		return gi(e, r, t, n), bi(e);
	}
	function lo(e, t, n) {
		if (t = t.updateQueue, t !== null && (t = t.shared, n & 4194048)) {
			var r = t.lanes;
			r &= e.pendingLanes, n |= r, t.lanes = n, at(e, n);
		}
	}
	function uo(e, t) {
		var n = e.updateQueue, r = e.alternate;
		if (r !== null && (r = r.updateQueue, n === r)) {
			var i = null, a = null;
			if (n = n.firstBaseUpdate, n !== null) {
				do {
					var o = {
						lane: n.lane,
						tag: n.tag,
						payload: n.payload,
						callback: null,
						next: null
					};
					a === null ? i = a = o : a = a.next = o, n = n.next;
				} while (n !== null);
				a === null ? i = a = t : a = a.next = t;
			} else i = a = t;
			n = {
				baseState: r.baseState,
				firstBaseUpdate: i,
				lastBaseUpdate: a,
				shared: r.shared,
				callbacks: r.callbacks
			}, e.updateQueue = n;
		} else e = n.lastBaseUpdate, e === null ? n.firstBaseUpdate = t : e.next = t, n.lastBaseUpdate = t;
	}
	var fo = !1;
	function po() {
		if (fo) {
			var e = ja;
			if (e !== null) throw e;
		}
	}
	function mo(e, t, n, r) {
		fo = !1;
		var i = e.updateQueue;
		io = !1;
		var a = i.firstBaseUpdate, o = i.lastBaseUpdate, s = i.shared.pending;
		if (s !== null) {
			i.shared.pending = null;
			var c = s, l = c.next;
			c.next = null, o === null ? a = l : o.next = l, o = c;
			var u = e.alternate;
			u !== null && (u = u.updateQueue, s = u.lastBaseUpdate, s !== o && (s === null ? u.firstBaseUpdate = l : s.next = l, u.lastBaseUpdate = c));
		}
		if (a !== null) {
			var d = i.baseState;
			o = 0, u = l = c = null, s = a;
			do {
				var f = s.lane & -536870913, p = f !== s.lane;
				if (p ? (Xu & f) === f : (r & f) === f) {
					f !== 0 && f === Aa && (fo = !0), u !== null && (u = u.next = {
						lane: 0,
						tag: s.tag,
						payload: s.payload,
						callback: null,
						next: null
					});
					a: {
						var m = e, h = s;
						f = t;
						var g = n;
						switch (h.tag) {
							case 1:
								if (m = h.payload, typeof m == "function") {
									d = m.call(g, d, f);
									break a;
								}
								d = m;
								break a;
							case 3: m.flags = m.flags & -65537 | 128;
							case 0:
								if (m = h.payload, f = typeof m == "function" ? m.call(g, d, f) : m, f == null) break a;
								d = D({}, d, f);
								break a;
							case 2: io = !0;
						}
					}
					f = s.callback, f !== null && (e.flags |= 64, p && (e.flags |= 8192), p = i.callbacks, p === null ? i.callbacks = [f] : p.push(f));
				} else p = {
					lane: f,
					tag: s.tag,
					payload: s.payload,
					callback: s.callback,
					next: null
				}, u === null ? (l = u = p, c = d) : u = u.next = p, o |= f;
				if (s = s.next, s === null) {
					if (s = i.shared.pending, s === null) break;
					p = s, s = p.next, p.next = null, i.lastBaseUpdate = p, i.shared.pending = null;
				}
			} while (1);
			u === null && (c = d), i.baseState = c, i.firstBaseUpdate = l, i.lastBaseUpdate = u, a === null && (i.shared.lanes = 0), id |= o, e.lanes = o, e.memoizedState = d;
		}
	}
	function ho(e, t) {
		if (typeof e != "function") throw Error(i(191, e));
		e.call(t);
	}
	function go(e, t) {
		var n = e.callbacks;
		if (n !== null) for (e.callbacks = null, e = 0; e < n.length; e++) ho(n[e], t);
	}
	var _o = fe(null), vo = fe(0);
	function yo(e, t) {
		e = nd, W(vo, e), W(_o, t), nd = e | t.baseLanes;
	}
	function bo() {
		W(vo, nd), W(_o, _o.current);
	}
	function xo() {
		nd = vo.current, pe(_o), pe(vo);
	}
	var So = fe(null), Co = null;
	function wo(e) {
		var t = e.alternate;
		W(ko, ko.current & 1), W(So, e), Co === null && (t === null || _o.current !== null || t.memoizedState !== null) && (Co = e);
	}
	function To(e) {
		W(ko, ko.current), W(So, e), Co === null && (Co = e);
	}
	function Eo(e) {
		e.tag === 22 ? (W(ko, ko.current), W(So, e), Co === null && (Co = e)) : Do();
	}
	function Do() {
		W(ko, ko.current), W(So, So.current);
	}
	function Oo(e) {
		pe(So), Co === e && (Co = null), pe(ko);
	}
	var ko = fe(0);
	function Ao(e, t) {
		W(So, So.current), W(ko, t);
	}
	function jo(e) {
		pe(ko), pe(So), Co === e && (Co = null);
	}
	function Mo(e) {
		for (var t = e; t !== null;) {
			if (t.tag === 13) {
				var n = t.memoizedState;
				if (n !== null && (n = n.dehydrated, n === null || sm(n) || cm(n))) return t;
			} else if (t.tag === 19 && t.memoizedProps.revealOrder !== "independent") {
				if (t.flags & 128) return t;
			} else if (t.child !== null) {
				t.child.return = t, t = t.child;
				continue;
			}
			if (t === e) break;
			for (; t.sibling === null;) {
				if (t.return === null || t.return === e) return null;
				t = t.return;
			}
			t.sibling.return = t.return, t = t.sibling;
		}
		return null;
	}
	var No = 0, X = null, Po = null, Fo = null, Io = !1, Lo = !1, Ro = !1, zo = 0, Bo = 0, Vo = null, Ho = 0;
	function Uo() {
		throw Error(i(321));
	}
	function Wo(e, t) {
		if (t === null) return !1;
		for (var n = 0; n < t.length && n < e.length; n++) if (!Mr(e[n], t[n])) return !1;
		return !0;
	}
	function Go(e, t, n, r, i, a) {
		return No = a, X = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, H.H = e === null || e.memoizedState === null ? cc : lc, Ro = !1, a = n(r, i), Ro = !1, Lo && (a = qo(t, n, r, i)), Ko(e), a;
	}
	function Ko(e) {
		H.H = sc;
		var t = Po !== null && Po.next !== null;
		if (No = 0, Fo = Po = X = null, Io = !1, Bo = 0, Vo = null, t) throw Error(i(300));
		e === null || Ec || (e = e.dependencies, e !== null && ma(e) && (Ec = !0));
	}
	function qo(e, t, n, r) {
		X = e;
		var a = 0;
		do {
			if (Lo && (Vo = null), Bo = 0, Lo = !1, 25 <= a) throw Error(i(301));
			if (a += 1, Fo = Po = null, e.updateQueue != null) {
				var o = e.updateQueue;
				o.lastEffect = null, o.events = null, o.stores = null, o.memoCache != null && (o.memoCache.index = 0);
			}
			H.H = uc, o = t(n, r);
		} while (Lo);
		return o;
	}
	function Jo() {
		var e = H.H, t = e.useState()[0];
		return t = typeof t.then == "function" ? ts(t) : t, e = e.useState()[0], (Po === null ? null : Po.memoizedState) !== e && (X.flags |= 1024), t;
	}
	function Yo() {
		var e = zo !== 0;
		return zo = 0, e;
	}
	function Xo(e, t, n) {
		t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~n;
	}
	function Zo(e) {
		if (Io) {
			for (e = e.memoizedState; e !== null;) {
				var t = e.queue;
				t !== null && (t.pending = null), e = e.next;
			}
			Io = !1;
		}
		No = 0, Fo = Po = X = null, Lo = !1, Bo = zo = 0, Vo = null;
	}
	function Qo() {
		var e = {
			memoizedState: null,
			baseState: null,
			baseQueue: null,
			queue: null,
			next: null
		};
		return Fo === null ? X.memoizedState = Fo = e : Fo = Fo.next = e, Fo;
	}
	function $o() {
		if (Po === null) {
			var e = X.alternate;
			e = e === null ? null : e.memoizedState;
		} else e = Po.next;
		var t = Fo === null ? X.memoizedState : Fo.next;
		if (t !== null) Fo = t, Po = e;
		else {
			if (e === null) throw X.alternate === null ? Error(i(467)) : Error(i(310));
			Po = e, e = {
				memoizedState: Po.memoizedState,
				baseState: Po.baseState,
				baseQueue: Po.baseQueue,
				queue: Po.queue,
				next: null
			}, Fo === null ? X.memoizedState = Fo = e : Fo = Fo.next = e;
		}
		return Fo;
	}
	function es() {
		return {
			lastEffect: null,
			events: null,
			stores: null,
			memoCache: null
		};
	}
	function ts(e) {
		var t = Bo;
		return Bo += 1, Vo === null && (Vo = []), e = Ga(Vo, e, t), t = X, (Fo === null ? t.memoizedState : Fo.next) === null && (t = t.alternate, H.H = t === null || t.memoizedState === null ? cc : lc), e;
	}
	function ns(e) {
		if (typeof e == "object" && e) {
			if (typeof e.then == "function") return ts(e);
			if (e.$$typeof === ae) return;
			if (e.$$typeof === F) return ga(e);
		}
		throw Error(i(438, String(e)));
	}
	function rs(e) {
		var t = null, n = X.updateQueue;
		if (n !== null && (t = n.memoCache), t == null) {
			var r = X.alternate;
			r !== null && (r = r.updateQueue, r !== null && (r = r.memoCache, r != null && (t = {
				data: r.data.map(function(e) {
					return e.slice();
				}),
				index: 0
			})));
		}
		if (t ??= {
			data: [],
			index: 0
		}, n === null && (n = es(), X.updateQueue = n), n.memoCache = t, n = t.data[t.index], n === void 0) for (n = t.data[t.index] = Array(e), r = 0; r < e; r++) n[r] = z;
		return t.index++, n;
	}
	function is(e, t) {
		return typeof t == "function" ? t(e) : t;
	}
	function as(e) {
		return os($o(), Po, e);
	}
	function os(e, t, n) {
		var r = e.queue;
		if (r === null) throw Error(i(311));
		r.lastRenderedReducer = n;
		var a = e.baseQueue, o = r.pending;
		if (o !== null) {
			if (a !== null) {
				var s = a.next;
				a.next = o.next, o.next = s;
			}
			t.baseQueue = a = o, r.pending = null;
		}
		if (o = e.baseState, a === null) e.memoizedState = o;
		else {
			t = a.next;
			var c = s = null, l = null, u = t, d = !1;
			do {
				var f = u.lane & -536870913;
				if (f === u.lane ? (No & f) === f : (Xu & f) === f) {
					var p = u.revertLane;
					if (p === 0) l !== null && (l = l.next = {
						lane: 0,
						revertLane: 0,
						gesture: null,
						action: u.action,
						hasEagerState: u.hasEagerState,
						eagerState: u.eagerState,
						next: null
					}), f === Aa && (d = !0);
					else if ((No & p) === p) {
						u = u.next, p === Aa && (d = !0);
						continue;
					} else f = {
						lane: 0,
						revertLane: u.revertLane,
						gesture: null,
						action: u.action,
						hasEagerState: u.hasEagerState,
						eagerState: u.eagerState,
						next: null
					}, l === null ? (c = l = f, s = o) : l = l.next = f, X.lanes |= p, id |= p;
					f = u.action, Ro && n(o, f), o = u.hasEagerState ? u.eagerState : n(o, f);
				} else p = {
					lane: f,
					revertLane: u.revertLane,
					gesture: u.gesture,
					action: u.action,
					hasEagerState: u.hasEagerState,
					eagerState: u.eagerState,
					next: null
				}, l === null ? (c = l = p, s = o) : l = l.next = p, X.lanes |= f, id |= f;
				u = u.next;
			} while (u !== null && u !== t);
			if (l === null ? s = o : l.next = c, !Mr(o, e.memoizedState) && (Ec = !0, d && (n = ja, n !== null))) throw n;
			e.memoizedState = o, e.baseState = s, e.baseQueue = l, r.lastRenderedState = o;
		}
		return a === null && (r.lanes = 0), [e.memoizedState, r.dispatch];
	}
	function ss(e) {
		var t = $o(), n = t.queue;
		if (n === null) throw Error(i(311));
		n.lastRenderedReducer = e;
		var r = n.dispatch, a = n.pending, o = t.memoizedState;
		if (a !== null) {
			n.pending = null;
			var s = a = a.next;
			do
				o = e(o, s.action), s = s.next;
			while (s !== a);
			Mr(o, t.memoizedState) || (Ec = !0), t.memoizedState = o, t.baseQueue === null && (t.baseState = o), n.lastRenderedState = o;
		}
		return [o, r];
	}
	function cs(e, t, n) {
		var r = X, a = $o(), o = Y;
		if (o) {
			if (n === void 0) throw Error(i(407));
			n = n();
		} else n = t();
		var s = !Mr((Po || a).memoizedState, n);
		if (s && (a.memoizedState = n, Ec = !0), a = a.queue, Ns(ds.bind(null, r, a, e), [e]), e = a.getSnapshot !== t || s || Fo !== null && !!(Fo.memoizedState.tag & 1), Os(e ? 9 : 8, { destroy: void 0 }, us.bind(null, r, a, n, t), null), e) {
			if (r.flags |= 2048, Ju === null) throw Error(i(349));
			o || No & 127 || ls(r, t, n);
		}
		return n;
	}
	function ls(e, t, n) {
		e.flags |= 16384, e = {
			getSnapshot: t,
			value: n
		}, t = X.updateQueue, t === null ? (t = es(), X.updateQueue = t, t.stores = [e]) : (n = t.stores, n === null ? t.stores = [e] : n.push(e));
	}
	function us(e, t, n, r) {
		t.value = n, t.getSnapshot = r, fs(t) && ps(e);
	}
	function ds(e, t, n) {
		return n(function() {
			fs(t) && ps(e);
		});
	}
	function fs(e) {
		var t = e.getSnapshot;
		e = e.value;
		try {
			var n = t();
			return !Mr(e, n);
		} catch {
			return !0;
		}
	}
	function ps(e) {
		var t = vi(e, 2);
		t !== null && Md(t, e, 2);
	}
	function ms(e) {
		var t = Qo();
		if (typeof e == "function") {
			var n = e;
			if (e = n(), Ro) {
				Ve(!0);
				try {
					n();
				} finally {
					Ve(!1);
				}
			}
		}
		return t.memoizedState = t.baseState = e, t.queue = {
			pending: null,
			lanes: 0,
			dispatch: null,
			lastRenderedReducer: is,
			lastRenderedState: e
		}, t;
	}
	function hs(e, t, n, r) {
		return e.baseState = n, os(e, Po, typeof r == "function" ? r : is);
	}
	function gs(e, t, n, r, a) {
		if (ic(e)) throw Error(i(485));
		if (e = t.action, e !== null) {
			var o = {
				payload: a,
				action: e,
				next: null,
				isTransition: !0,
				status: "pending",
				value: null,
				reason: null,
				listeners: [],
				then: function(e) {
					o.listeners.push(e);
				}
			};
			H.T === null ? o.isTransition = !1 : n(!0), r(o), n = t.pending, n === null ? (o.next = t.pending = o, _s(t, o)) : (o.next = n.next, t.pending = n.next = o);
		}
	}
	function _s(e, t) {
		var n = t.action, r = t.payload, i = e.state;
		if (t.isTransition) {
			var a = H.T, o = {};
			o.types = a === null ? null : a.types, H.T = o;
			try {
				var s = n(i, r), c = H.S;
				c !== null && c(o, s), vs(e, t, s);
			} catch (n) {
				bs(e, t, n);
			} finally {
				a !== null && o.types !== null && (a.types = o.types), H.T = a;
			}
		} else try {
			a = n(i, r), vs(e, t, a);
		} catch (n) {
			bs(e, t, n);
		}
	}
	function vs(e, t, n) {
		typeof n == "object" && n && typeof n.then == "function" ? n.then(function(n) {
			ys(e, t, n);
		}, function(n) {
			return bs(e, t, n);
		}) : ys(e, t, n);
	}
	function ys(e, t, n) {
		t.status = "fulfilled", t.value = n, xs(t), e.state = n, t = e.pending, t !== null && (n = t.next, n === t ? e.pending = null : (n = n.next, t.next = n, _s(e, n)));
	}
	function bs(e, t, n) {
		var r = e.pending;
		if (e.pending = null, r !== null) {
			r = r.next;
			do
				t.status = "rejected", t.reason = n, xs(t), t = t.next;
			while (t !== r);
		}
		e.action = null;
	}
	function xs(e) {
		e = e.listeners;
		for (var t = 0; t < e.length; t++) (0, e[t])();
	}
	function Ss(e, t) {
		return t;
	}
	function Cs(e, t) {
		if (Y) {
			var n = Ju.formState;
			if (n !== null) {
				a: {
					var r = X;
					if (Y) {
						if (Yi) {
							b: {
								for (var i = Yi, a = Zi; i.nodeType !== 8;) if (!a || (i = um(i.nextSibling), i === null)) {
									i = null;
									break b;
								}
								a = i.data, i = a === "F!" || a === "F" ? i : null;
							}
							if (i) {
								Yi = um(i.nextSibling), r = i.data === "F!";
								break a;
							}
						}
						$i(r);
					}
					r = !1;
				}
				r && (t = n[0]);
			}
		}
		return n = Qo(), n.memoizedState = n.baseState = t, r = {
			pending: null,
			lanes: 0,
			dispatch: null,
			lastRenderedReducer: Ss,
			lastRenderedState: t
		}, n.queue = r, n = tc.bind(null, X, r), r.dispatch = n, r = ms(!1), a = rc.bind(null, X, !1, r.queue), r = Qo(), i = {
			state: t,
			dispatch: null,
			action: e,
			pending: null
		}, r.queue = i, n = gs.bind(null, X, i, a, n), i.dispatch = n, r.memoizedState = e, [
			t,
			n,
			!1
		];
	}
	function ws(e) {
		return Ts($o(), Po, e);
	}
	function Ts(e, t, n) {
		if (t = os(e, t, Ss)[0], e = as(is)[0], typeof t == "object" && t && typeof t.then == "function") try {
			var r = ts(t);
		} catch (e) {
			throw e === Ba ? Ha : e;
		}
		else r = t;
		t = $o();
		var i = t.queue, a = i.dispatch;
		return n !== t.memoizedState && (X.flags |= 2048, Os(9, { destroy: void 0 }, Es.bind(null, i, n), null)), [
			r,
			a,
			e
		];
	}
	function Es(e, t) {
		e.action = t;
	}
	function Ds(e) {
		var t = $o(), n = Po;
		if (n !== null) return Ts(t, n, e);
		$o(), t = t.memoizedState, n = $o();
		var r = n.queue.dispatch;
		return n.memoizedState = e, [
			t,
			r,
			!1
		];
	}
	function Os(e, t, n, r) {
		return e = {
			tag: e,
			create: n,
			deps: r,
			inst: t,
			next: null
		}, t = X.updateQueue, t === null && (t = es(), X.updateQueue = t), n = t.lastEffect, n === null ? t.lastEffect = e.next = e : (r = n.next, n.next = e, e.next = r, t.lastEffect = e), e;
	}
	function ks() {
		return $o().memoizedState;
	}
	function As(e, t, n, r) {
		var i = Qo();
		X.flags |= e, i.memoizedState = Os(1 | t, { destroy: void 0 }, n, r === void 0 ? null : r);
	}
	function js(e, t, n, r) {
		var i = $o();
		r = r === void 0 ? null : r;
		var a = i.memoizedState.inst;
		Po !== null && r !== null && Wo(r, Po.memoizedState.deps) ? i.memoizedState = Os(t, a, n, r) : (X.flags |= e, i.memoizedState = Os(1 | t, a, n, r));
	}
	function Ms(e, t) {
		As(8390656, 8, e, t);
	}
	function Ns(e, t) {
		js(2048, 8, e, t);
	}
	function Ps(e) {
		X.flags |= 4;
		var t = X.updateQueue;
		if (t === null) t = es(), X.updateQueue = t, t.events = [e];
		else {
			var n = t.events;
			n === null ? t.events = [e] : n.push(e);
		}
	}
	function Fs(e) {
		var t = $o().memoizedState;
		return Ps({
			ref: t,
			nextImpl: e
		}), function() {
			if (Q & 2) throw Error(i(440));
			return t.impl.apply(void 0, arguments);
		};
	}
	function Is(e, t) {
		return js(4, 2, e, t);
	}
	function Ls(e, t) {
		return js(4, 4, e, t);
	}
	function Rs(e, t) {
		if (typeof t == "function") {
			e = e();
			var n = t(e);
			return function() {
				typeof n == "function" ? n() : t(null);
			};
		}
		if (t != null) return e = e(), t.current = e, function() {
			t.current = null;
		};
	}
	function zs(e, t, n) {
		n = n == null ? null : n.concat([e]), js(4, 4, Rs.bind(null, t, e), n);
	}
	function Bs() {}
	function Vs(e, t) {
		var n = $o();
		t = t === void 0 ? null : t;
		var r = n.memoizedState;
		return t !== null && Wo(t, r[1]) ? r[0] : (n.memoizedState = [e, t], e);
	}
	function Hs(e, t) {
		var n = $o();
		t = t === void 0 ? null : t;
		var r = n.memoizedState;
		if (t !== null && Wo(t, r[1])) return r[0];
		if (r = e(), Ro) {
			Ve(!0);
			try {
				e();
			} finally {
				Ve(!1);
			}
		}
		return n.memoizedState = [r, t], r;
	}
	function Us(e, t, n) {
		return n === void 0 || No & 1073741824 && !(Xu & 261930) ? e.memoizedState = t : (e.memoizedState = n, e = Ad(), X.lanes |= e, id |= e, n);
	}
	function Ws(e, t, n, r) {
		return Mr(n, t) ? n : _o.current === null ? !(No & 106) || No & 1073741824 && !(Xu & 261930) ? (Ec = !0, e.memoizedState = n) : (e = Ad(), X.lanes |= e, id |= e, t) : (e = Us(e, n, r), Mr(e, t) || (Ec = !0), e);
	}
	function Gs(e, t, n, r, i) {
		var a = U.p;
		U.p = a !== 0 && 8 > a ? a : 8;
		var o = H.T, s = {};
		s.types = o === null ? null : o.types, H.T = s, rc(e, !1, t, n);
		try {
			var c = i(), l = H.S;
			l !== null && l(s, c), typeof c == "object" && c && typeof c.then == "function" ? nc(e, t, Pa(c, r), kd(e)) : nc(e, t, r, kd(e));
		} catch (n) {
			nc(e, t, {
				then: function() {},
				status: "rejected",
				reason: n
			}, kd());
		} finally {
			U.p = a, o !== null && s.types !== null && (o.types = s.types), H.T = o;
		}
	}
	function Ks() {}
	function qs(e, t, n, r) {
		if (e.tag !== 5) throw Error(i(476));
		var a = Js(e).queue;
		Gs(e, a, t, le, n === null ? Ks : function() {
			return Ys(e), n(r);
		});
	}
	function Js(e) {
		var t = e.memoizedState;
		if (t !== null) return t;
		t = {
			memoizedState: le,
			baseState: le,
			baseQueue: null,
			queue: {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: is,
				lastRenderedState: le
			},
			next: null
		};
		var n = {};
		return t.next = {
			memoizedState: n,
			baseState: n,
			baseQueue: null,
			queue: {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: is,
				lastRenderedState: n
			},
			next: null
		}, e.memoizedState = t, e = e.alternate, e !== null && (e.memoizedState = t), t;
	}
	function Ys(e) {
		var t = Js(e);
		t.next === null && (t = e.alternate.memoizedState), nc(e, t.next.queue, {}, kd());
	}
	function Xs() {
		return ga(ch);
	}
	function Zs() {
		return $o().memoizedState;
	}
	function Qs() {
		return $o().memoizedState;
	}
	function $s(e) {
		for (var t = e.return; t !== null;) {
			switch (t.tag) {
				case 24:
				case 3:
					var n = kd();
					e = so(n);
					var r = co(t, e, n);
					r !== null && (Md(r, t, n), lo(r, t, n)), t = { cache: Ca() }, e.payload = t;
					return;
			}
			t = t.return;
		}
	}
	function ec(e, t, n) {
		var r = kd();
		n = {
			lane: r,
			revertLane: 0,
			gesture: null,
			action: n,
			hasEagerState: !1,
			eagerState: null,
			next: null
		}, ic(e) ? ac(t, n) : (n = _i(e, t, n, r), n !== null && (Md(n, e, r), oc(n, t, r)));
	}
	function tc(e, t, n) {
		nc(e, t, n, kd());
	}
	function nc(e, t, n, r) {
		var i = {
			lane: r,
			revertLane: 0,
			gesture: null,
			action: n,
			hasEagerState: !1,
			eagerState: null,
			next: null
		};
		if (ic(e)) ac(t, i);
		else {
			var a = e.alternate;
			if (e.lanes === 0 && (a === null || a.lanes === 0) && (a = t.lastRenderedReducer, a !== null)) try {
				var o = t.lastRenderedState, s = a(o, n);
				if (i.hasEagerState = !0, i.eagerState = s, Mr(s, o)) return gi(e, t, i, 0), Ju === null && hi(), !1;
			} catch {}
			if (n = _i(e, t, i, r), n !== null) return Md(n, e, r), oc(n, t, r), !0;
		}
		return !1;
	}
	function rc(e, t, n, r) {
		if (r = {
			lane: 2,
			revertLane: Nf(),
			gesture: null,
			action: r,
			hasEagerState: !1,
			eagerState: null,
			next: null
		}, ic(e)) {
			if (t) throw Error(i(479));
		} else t = _i(e, n, r, 2), t !== null && Md(t, e, 2);
	}
	function ic(e) {
		var t = e.alternate;
		return e === X || t !== null && t === X;
	}
	function ac(e, t) {
		Lo = Io = !0;
		var n = e.pending;
		n === null ? t.next = t : (t.next = n.next, n.next = t), e.pending = t;
	}
	function oc(e, t, n) {
		if (n & 4194048) {
			var r = t.lanes;
			r &= e.pendingLanes, n |= r, t.lanes = n, at(e, n);
		}
	}
	var sc = {
		readContext: ga,
		use: ns,
		useCallback: Uo,
		useContext: Uo,
		useEffect: Uo,
		useImperativeHandle: Uo,
		useLayoutEffect: Uo,
		useInsertionEffect: Uo,
		useMemo: Uo,
		useReducer: Uo,
		useRef: Uo,
		useState: Uo,
		useDebugValue: Uo,
		useDeferredValue: Uo,
		useTransition: Uo,
		useSyncExternalStore: Uo,
		useId: Uo,
		useHostTransitionStatus: Uo,
		useFormState: Uo,
		useActionState: Uo,
		useOptimistic: Uo,
		useMemoCache: Uo,
		useCacheRefresh: Uo,
		useEffectEvent: Uo
	}, cc = {
		readContext: ga,
		use: ns,
		useCallback: function(e, t) {
			return Qo().memoizedState = [e, t === void 0 ? null : t], e;
		},
		useContext: ga,
		useEffect: Ms,
		useImperativeHandle: function(e, t, n) {
			n = n == null ? null : n.concat([e]), As(4194308, 4, Rs.bind(null, t, e), n);
		},
		useLayoutEffect: function(e, t) {
			return As(4194308, 4, e, t);
		},
		useInsertionEffect: function(e, t) {
			As(4, 2, e, t);
		},
		useMemo: function(e, t) {
			var n = Qo();
			t = t === void 0 ? null : t;
			var r = e();
			if (Ro) {
				Ve(!0);
				try {
					e();
				} finally {
					Ve(!1);
				}
			}
			return n.memoizedState = [r, t], r;
		},
		useReducer: function(e, t, n) {
			var r = Qo();
			if (n !== void 0) {
				var i = n(t);
				if (Ro) {
					Ve(!0);
					try {
						n(t);
					} finally {
						Ve(!1);
					}
				}
			} else i = t;
			return r.memoizedState = r.baseState = i, e = {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: e,
				lastRenderedState: i
			}, r.queue = e, e = e.dispatch = ec.bind(null, X, e), [r.memoizedState, e];
		},
		useRef: function(e) {
			var t = Qo();
			return e = { current: e }, t.memoizedState = e;
		},
		useState: function(e) {
			e = ms(e);
			var t = e.queue, n = tc.bind(null, X, t);
			return t.dispatch = n, [e.memoizedState, n];
		},
		useDebugValue: Bs,
		useDeferredValue: function(e, t) {
			return Us(Qo(), e, t);
		},
		useTransition: function() {
			var e = ms(!1);
			return e = Gs.bind(null, X, e.queue, !0, !1), Qo().memoizedState = e, [!1, e];
		},
		useSyncExternalStore: function(e, t, n) {
			var r = X, a = Qo();
			if (Y) {
				if (n === void 0) throw Error(i(407));
				n = n();
			} else {
				if (n = t(), Ju === null) throw Error(i(349));
				Xu & 127 || ls(r, t, n);
			}
			a.memoizedState = n;
			var o = {
				value: n,
				getSnapshot: t
			};
			return a.queue = o, Ms(ds.bind(null, r, o, e), [e]), r.flags |= 2048, Os(9, { destroy: void 0 }, us.bind(null, r, o, n, t), null), n;
		},
		useId: function() {
			var e = Qo(), t = Ju.identifierPrefix;
			if (Y) {
				var n = Hi, r = Vi;
				n = (r & ~(1 << 32 - He(r) - 1)).toString(32) + n, t = "_" + t + "R_" + n, n = zo++, 0 < n && (t += "H" + n.toString(32)), t += "_";
			} else n = Ho++, t = "_" + t + "r_" + n.toString(32) + "_";
			return e.memoizedState = t;
		},
		useHostTransitionStatus: Xs,
		useFormState: Cs,
		useActionState: Cs,
		useOptimistic: function(e) {
			var t = Qo();
			t.memoizedState = t.baseState = e;
			var n = {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: null,
				lastRenderedState: null
			};
			return t.queue = n, t = rc.bind(null, X, !0, n), n.dispatch = t, [e, t];
		},
		useMemoCache: rs,
		useCacheRefresh: function() {
			return Qo().memoizedState = $s.bind(null, X);
		},
		useEffectEvent: function(e) {
			var t = Qo(), n = { impl: e };
			return t.memoizedState = n, function() {
				if (Q & 2) throw Error(i(440));
				return n.impl.apply(void 0, arguments);
			};
		}
	}, lc = {
		readContext: ga,
		use: ns,
		useCallback: Vs,
		useContext: ga,
		useEffect: Ns,
		useImperativeHandle: zs,
		useInsertionEffect: Is,
		useLayoutEffect: Ls,
		useMemo: Hs,
		useReducer: as,
		useRef: ks,
		useState: function() {
			return as(is);
		},
		useDebugValue: Bs,
		useDeferredValue: function(e, t) {
			return Ws($o(), Po.memoizedState, e, t);
		},
		useTransition: function() {
			var e = as(is)[0], t = $o().memoizedState;
			return [typeof e == "boolean" ? e : ts(e), t];
		},
		useSyncExternalStore: cs,
		useId: Zs,
		useHostTransitionStatus: Xs,
		useFormState: ws,
		useActionState: ws,
		useOptimistic: function(e, t) {
			return hs($o(), Po, e, t);
		},
		useMemoCache: rs,
		useCacheRefresh: Qs,
		useEffectEvent: Fs
	}, uc = {
		readContext: ga,
		use: ns,
		useCallback: Vs,
		useContext: ga,
		useEffect: Ns,
		useImperativeHandle: zs,
		useInsertionEffect: Is,
		useLayoutEffect: Ls,
		useMemo: Hs,
		useReducer: ss,
		useRef: ks,
		useState: function() {
			return ss(is);
		},
		useDebugValue: Bs,
		useDeferredValue: function(e, t) {
			var n = $o();
			return Po === null ? Us(n, e, t) : Ws(n, Po.memoizedState, e, t);
		},
		useTransition: function() {
			var e = ss(is)[0], t = $o().memoizedState;
			return [typeof e == "boolean" ? e : ts(e), t];
		},
		useSyncExternalStore: cs,
		useId: Zs,
		useHostTransitionStatus: Xs,
		useFormState: Ds,
		useActionState: Ds,
		useOptimistic: function(e, t) {
			var n = $o();
			return Po === null ? (n.baseState = e, [e, n.queue.dispatch]) : hs(n, Po, e, t);
		},
		useMemoCache: rs,
		useCacheRefresh: Qs,
		useEffectEvent: Fs
	};
	function dc(e, t, n, r) {
		t = e.memoizedState, n = n(r, t), n = n == null ? t : D({}, t, n), e.memoizedState = n, e.lanes === 0 && (e.updateQueue.baseState = n);
	}
	var fc = {
		enqueueSetState: function(e, t, n) {
			e = e._reactInternals;
			var r = kd(), i = so(r);
			i.payload = t, n != null && (i.callback = n), t = co(e, i, r), t !== null && (Md(t, e, r), lo(t, e, r));
		},
		enqueueReplaceState: function(e, t, n) {
			e = e._reactInternals;
			var r = kd(), i = so(r);
			i.tag = 1, i.payload = t, n != null && (i.callback = n), t = co(e, i, r), t !== null && (Md(t, e, r), lo(t, e, r));
		},
		enqueueForceUpdate: function(e, t) {
			e = e._reactInternals;
			var n = kd(), r = so(n);
			r.tag = 2, t != null && (r.callback = t), t = co(e, r, n), t !== null && (Md(t, e, n), lo(t, e, n));
		}
	};
	function pc(e, t, n, r, i, a, o) {
		return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(r, a, o) : t.prototype && t.prototype.isPureReactComponent ? !Nr(n, r) || !Nr(i, a) : !0;
	}
	function mc(e, t, n, r) {
		e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(n, r), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(n, r), t.state !== e && fc.enqueueReplaceState(t, t.state, null);
	}
	function hc(e, t) {
		var n = t;
		if ("ref" in t) for (var r in n = {}, t) r !== "ref" && (n[r] = t[r]);
		if (e = e.defaultProps) for (var i in n === t && (n = D({}, n)), e) n[i] === void 0 && (n[i] = e[i]);
		return n;
	}
	function gc(e) {
		di(e);
	}
	function _c(e) {
		console.error(e);
	}
	function vc(e) {
		di(e);
	}
	function yc(e, t) {
		try {
			var n = e.onUncaughtError;
			n(t.value, { componentStack: t.stack });
		} catch (e) {
			setTimeout(function() {
				throw e;
			});
		}
	}
	function bc(e, t, n) {
		try {
			var r = e.onCaughtError;
			r(n.value, {
				componentStack: n.stack,
				errorBoundary: t.tag === 1 ? t.stateNode : null
			});
		} catch (e) {
			setTimeout(function() {
				throw e;
			});
		}
	}
	function xc(e, t, n) {
		return n = so(n), n.tag = 3, n.payload = { element: null }, n.callback = function() {
			yc(e, t);
		}, n;
	}
	function Sc(e) {
		return e = so(e), e.tag = 3, e;
	}
	function Cc(e, t, n, r) {
		var i = n.type.getDerivedStateFromError;
		if (typeof i == "function") {
			var a = r.value;
			e.payload = function() {
				return i(a);
			}, e.callback = function() {
				bc(t, n, r);
			};
		}
		var o = n.stateNode;
		o !== null && typeof o.componentDidCatch == "function" && (e.callback = function() {
			bc(t, n, r), typeof i != "function" && (gd === null ? gd = /* @__PURE__ */ new Set([this]) : gd.add(this));
			var e = r.stack;
			this.componentDidCatch(r.value, { componentStack: e === null ? "" : e });
		});
	}
	function wc(e, t, n, r, a) {
		if (n.flags |= 32768, typeof r == "object" && r && typeof r.then == "function") {
			if (t = n.alternate, t !== null && pa(t, n, a, !0), n = So.current, n !== null) {
				switch (n.tag) {
					case 31:
					case 13:
					case 19: return Co === null ? Wd() : n.alternate === null && rd === 0 && (rd = 3), n.flags &= -257, n.flags |= 65536, n.lanes = a, r === Ua ? n.flags |= 16384 : (t = n.updateQueue, t === null ? n.updateQueue = /* @__PURE__ */ new Set([r]) : t.add(r), pf(e, r, a)), !1;
					case 22: return n.flags |= 65536, r === Ua ? n.flags |= 16384 : (t = n.updateQueue, t === null ? (t = {
						transitions: null,
						markerInstances: null,
						retryQueue: /* @__PURE__ */ new Set([r])
					}, n.updateQueue = t) : (n = t.retryQueue, n === null ? t.retryQueue = /* @__PURE__ */ new Set([r]) : n.add(r)), pf(e, r, a)), !1;
				}
				throw Error(i(435, n.tag));
			}
			return pf(e, r, a), Wd(), !1;
		}
		if (Y) return t = So.current, t === null ? (r !== Qi && (t = Error(i(423), { cause: r }), aa(Ni(t, n))), e = e.current.alternate, e.flags |= 65536, a &= -a, e.lanes |= a, r = Ni(r, n), a = xc(e.stateNode, r, a), uo(e, a), rd !== 4 && (rd = 2)) : (!(t.flags & 65536) && (t.flags |= 256), t.flags |= 65536, t.lanes = a, r !== Qi && (e = Error(i(422), { cause: r }), aa(Ni(e, n)))), !1;
		var o = Error(i(520), { cause: r });
		if (o = Ni(o, n), ld === null ? ld = [o] : ld.push(o), rd !== 4 && (rd = 2), t === null) return !0;
		r = Ni(r, n), n = t;
		do {
			switch (n.tag) {
				case 3: return n.flags |= 65536, e = a & -a, n.lanes |= e, e = xc(n.stateNode, r, e), uo(n, e), !1;
				case 1:
					if (t = n.type, o = n.stateNode, !(n.flags & 128) && (typeof t.getDerivedStateFromError == "function" || o !== null && typeof o.componentDidCatch == "function" && (gd === null || !gd.has(o)))) return n.flags |= 65536, a &= -a, n.lanes |= a, a = Sc(a), Cc(a, e, n, r), uo(n, a), !1;
					break;
				case 22: if (n.memoizedState !== null) return n.flags |= 65536, !1;
			}
			n = n.return;
		} while (n !== null);
		return !1;
	}
	var Tc = Error(i(461)), Ec = !1;
	function Dc(e, t, n, r) {
		t.child = e === null ? ro(t, null, n, r) : no(t, e.child, n, r);
	}
	function Oc(e, t, n, r, i) {
		n = n.render;
		var a = t.ref;
		if ("ref" in r) {
			var o = {};
			for (var s in r) s !== "ref" && (o[s] = r[s]);
		} else o = r;
		return ha(t), r = Go(e, t, n, o, a, i), s = Yo(), e !== null && !Ec ? (Xo(e, t, i), nl(e, t, i)) : (Y && s && Gi(t), t.flags |= 1, Dc(e, t, r, i), t.child);
	}
	function kc(e, t, n, r, i) {
		if (e === null) {
			var a = n.type;
			return typeof a == "function" && !wi(a) && a.defaultProps === void 0 && n.compare === null ? (t.tag = 15, t.type = a, Ac(e, t, a, r, i)) : (e = Di(n.type, null, r, t, t.mode, i), e.ref = t.ref, e.return = t, t.child = e);
		}
		if (a = e.child, !rl(e, i)) {
			var o = a.memoizedProps;
			if (n = n.compare, n = n === null ? Nr : n, n(o, r) && e.ref === t.ref) return nl(e, t, i);
		}
		return t.flags |= 1, e = Ti(a, r), e.ref = t.ref, e.return = t, t.child = e;
	}
	function Ac(e, t, n, r, i) {
		if (e !== null) {
			var a = e.memoizedProps;
			if (Nr(a, r) && e.ref === t.ref) {
				if (Ec = !1, t.pendingProps = r = a, rl(e, i)) e.flags & 131072 && (Ec = !0);
				else return t.lanes = e.lanes, nl(e, t, i);
			}
		}
		return Rc(e, t, n, r, i);
	}
	function jc(e, t, n, r) {
		var i = r.children, a = e === null ? null : e.memoizedState;
		if (e === null && t.stateNode === null && (t.stateNode = {
			_visibility: 1,
			_pendingMarkers: null,
			_retryCache: null,
			_transitions: null
		}), r.mode === "hidden") {
			if (t.flags & 128) {
				if (a = a === null ? n : a.baseLanes | n, e !== null) {
					for (r = t.child = e.child, i = 0; r !== null;) i = i | r.lanes | r.childLanes, r = r.sibling;
					r = i & ~a;
				} else r = 0, t.child = null;
				return Nc(e, t, a, n, r);
			}
			if (n & 536870912) t.memoizedState = {
				baseLanes: 0,
				cachePool: null
			}, e !== null && Ra(t, a === null ? null : a.cachePool), a === null ? bo() : yo(t, a), Eo(t);
			else return r = t.lanes = 536870912, Nc(e, t, a === null ? n : a.baseLanes | n, n, r);
		} else a === null ? (e !== null && Ra(t, null), bo(), Do()) : (Ra(t, a.cachePool), yo(t, a), Do(), t.memoizedState = null);
		return Dc(e, t, i, n), t.child;
	}
	function Mc(e, t) {
		return e !== null && e.tag === 22 || t.stateNode !== null || (t.stateNode = {
			_visibility: 1,
			_pendingMarkers: null,
			_retryCache: null,
			_transitions: null
		}), t.sibling;
	}
	function Nc(e, t, n, r, i) {
		var a = La();
		return a = a === null ? null : {
			parent: Sa._currentValue,
			pool: a
		}, t.memoizedState = {
			baseLanes: n,
			cachePool: a
		}, e !== null && Ra(t, null), bo(), Eo(t), e !== null && pa(e, t, r, !0), t.childLanes = i, null;
	}
	function Pc(e, t) {
		return t = qc({
			mode: t.mode,
			children: t.children
		}, e.mode), t.ref = e.ref, e.child = t, t.return = e, t;
	}
	function Fc(e, t, n) {
		return no(t, e.child, null, n), e = Pc(t, t.pendingProps), e.flags |= 2, Oo(t), t.memoizedState = null, e;
	}
	function Ic(e, t, n) {
		var r = t.pendingProps, a = !!(t.flags & 128);
		if (t.flags &= -129, e === null) {
			if (Y) {
				if (r.mode === "hidden") return e = Pc(t, r), t.lanes = 536870912, e.memoizedState = {
					baseLanes: 0,
					cachePool: null
				}, Mc(null, e);
				if (To(t), (e = Yi) ? (e = om(e, Zi), e = e !== null && e.data === "&" ? e : null, e !== null && (t.memoizedState = {
					dehydrated: e,
					treeContext: Bi === null ? null : {
						id: Vi,
						overflow: Hi
					},
					retryLane: 536870912,
					hydrationErrors: null
				}, n = Ai(e), n.return = t, t.child = n, Ji = t, Yi = null)) : e = null, e === null) throw $i(t);
				return t.lanes = 536870912, null;
			}
			return Pc(t, r);
		}
		var o = e.memoizedState;
		if (o !== null) {
			var s = o.dehydrated;
			if (To(t), a) {
				if (t.flags & 256) t.flags &= -257, t = Fc(e, t, n);
				else if (t.memoizedState !== null) t.child = e.child, t.flags |= 128, t = null;
				else throw Error(i(558));
			} else if (Ec || pa(e, t, n, !1), a = (n & e.childLanes) !== 0, Ec || a) {
				if (_o.current === null) {
					if (r = Ju, r !== null && (s = ot(r, n), s !== 0 && s !== o.retryLane)) throw o.retryLane = s, vi(e, s), Md(r, e, s), Tc;
					Wd();
				}
				t = Fc(e, t, n);
			} else e = o.treeContext, Yi = um(s.nextSibling), Ji = t, Y = !0, Xi = null, Zi = !1, e !== null && qi(t, e), t = Pc(t, r), t.flags |= 134221824;
			return t;
		}
		return e = Ti(e.child, {
			mode: r.mode,
			children: r.children
		}), e.ref = t.ref, t.child = e, e.return = t, e;
	}
	function Lc(e, t) {
		var n = t.ref;
		if (n === null) e !== null && e.ref !== null && (t.flags |= 4194816);
		else {
			if (typeof n != "function" && typeof n != "object") throw Error(i(284));
			(e === null || e.ref !== n) && (t.flags |= 4194816);
		}
	}
	function Rc(e, t, n, r, i) {
		return ha(t), n = Go(e, t, n, r, void 0, i), r = Yo(), e !== null && !Ec ? (Xo(e, t, i), nl(e, t, i)) : (Y && r && Gi(t), t.flags |= 1, Dc(e, t, n, i), t.child);
	}
	function zc(e, t, n, r, i, a) {
		return ha(t), t.updateQueue = null, n = qo(t, r, n, i), Ko(e), r = Yo(), e !== null && !Ec ? (Xo(e, t, a), nl(e, t, a)) : (Y && r && Gi(t), t.flags |= 1, Dc(e, t, n, a), t.child);
	}
	function Bc(e, t, n, r, i) {
		if (ha(t), t.stateNode === null) {
			var a = xi, o = n.contextType;
			typeof o == "object" && o && (a = ga(o)), a = new n(r, a), t.memoizedState = a.state !== null && a.state !== void 0 ? a.state : null, a.updater = fc, t.stateNode = a, a._reactInternals = t, a = t.stateNode, a.props = r, a.state = t.memoizedState, a.refs = {}, ao(t), o = n.contextType, a.context = typeof o == "object" && o ? ga(o) : xi, a.state = t.memoizedState, o = n.getDerivedStateFromProps, typeof o == "function" && (dc(t, n, o, r), a.state = t.memoizedState), typeof n.getDerivedStateFromProps == "function" || typeof a.getSnapshotBeforeUpdate == "function" || typeof a.UNSAFE_componentWillMount != "function" && typeof a.componentWillMount != "function" || (o = a.state, typeof a.componentWillMount == "function" && a.componentWillMount(), typeof a.UNSAFE_componentWillMount == "function" && a.UNSAFE_componentWillMount(), o !== a.state && fc.enqueueReplaceState(a, a.state, null), mo(t, r, a, i), po(), a.state = t.memoizedState), typeof a.componentDidMount == "function" && (t.flags |= 4194308), r = !0;
		} else if (e === null) {
			a = t.stateNode;
			var s = t.memoizedProps, c = hc(n, s);
			a.props = c;
			var l = a.context, u = n.contextType;
			o = xi, typeof u == "object" && u && (o = ga(u));
			var d = n.getDerivedStateFromProps;
			u = typeof d == "function" || typeof a.getSnapshotBeforeUpdate == "function", s = t.pendingProps !== s, u || typeof a.UNSAFE_componentWillReceiveProps != "function" && typeof a.componentWillReceiveProps != "function" || (s || l !== o) && mc(t, a, r, o), io = !1;
			var f = t.memoizedState;
			a.state = f, mo(t, r, a, i), po(), l = t.memoizedState, s || f !== l || io ? (typeof d == "function" && (dc(t, n, d, r), l = t.memoizedState), (c = io || pc(t, n, c, r, f, l, o)) ? (u || typeof a.UNSAFE_componentWillMount != "function" && typeof a.componentWillMount != "function" || (typeof a.componentWillMount == "function" && a.componentWillMount(), typeof a.UNSAFE_componentWillMount == "function" && a.UNSAFE_componentWillMount()), typeof a.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof a.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = r, t.memoizedState = l), a.props = r, a.state = l, a.context = o, r = c) : (typeof a.componentDidMount == "function" && (t.flags |= 4194308), r = !1);
		} else {
			a = t.stateNode, oo(e, t), o = t.memoizedProps, u = hc(n, o), a.props = u, d = t.pendingProps, f = a.context, l = n.contextType, c = xi, typeof l == "object" && l && (c = ga(l)), s = n.getDerivedStateFromProps, (l = typeof s == "function" || typeof a.getSnapshotBeforeUpdate == "function") || typeof a.UNSAFE_componentWillReceiveProps != "function" && typeof a.componentWillReceiveProps != "function" || (o !== d || f !== c) && mc(t, a, r, c), io = !1, f = t.memoizedState, a.state = f, mo(t, r, a, i), po();
			var p = t.memoizedState;
			o !== d || f !== p || io || e !== null && e.dependencies !== null && ma(e.dependencies) ? (typeof s == "function" && (dc(t, n, s, r), p = t.memoizedState), (u = io || pc(t, n, u, r, f, p, c) || e !== null && e.dependencies !== null && ma(e.dependencies)) ? (l || typeof a.UNSAFE_componentWillUpdate != "function" && typeof a.componentWillUpdate != "function" || (typeof a.componentWillUpdate == "function" && a.componentWillUpdate(r, p, c), typeof a.UNSAFE_componentWillUpdate == "function" && a.UNSAFE_componentWillUpdate(r, p, c)), typeof a.componentDidUpdate == "function" && (t.flags |= 4), typeof a.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof a.componentDidUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 4), typeof a.getSnapshotBeforeUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 1024), t.memoizedProps = r, t.memoizedState = p), a.props = r, a.state = p, a.context = c, r = u) : (typeof a.componentDidUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 4), typeof a.getSnapshotBeforeUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 1024), r = !1);
		}
		return a = r, Lc(e, t), r = !!(t.flags & 128), a || r ? (a = t.stateNode, n = r && typeof n.getDerivedStateFromError != "function" ? null : a.render(), t.flags |= 1, e !== null && r ? (t.child = no(t, e.child, null, i), t.child = no(t, null, n, i)) : Dc(e, t, n, i), t.memoizedState = a.state, e = t.child) : e = nl(e, t, i), e;
	}
	function Vc(e, t, n, r) {
		return ra(), t.flags |= 256, Dc(e, t, n, r), t.child;
	}
	var Hc = {
		dehydrated: null,
		treeContext: null,
		retryLane: 0,
		hydrationErrors: null
	};
	function Uc(e) {
		return {
			baseLanes: e,
			cachePool: za()
		};
	}
	function Wc(e, t, n) {
		return e = e === null ? 0 : e.childLanes & ~n, t && (e |= sd), e;
	}
	function Gc(e, t, n) {
		var r = t.pendingProps, i = !1, a = !!(t.flags & 128), o;
		if ((o = a) || (o = e !== null && e.memoizedState === null ? !1 : !!(ko.current & 2)), o && (i = !0, t.flags &= -129), o = !!(t.flags & 32), t.flags &= -33, e === null) {
			if (Y) {
				if (i ? wo(t) : Do(), (e = Yi) ? (e = om(e, Zi), e = e !== null && e.data !== "&" ? e : null, e !== null && (t.memoizedState = {
					dehydrated: e,
					treeContext: Bi === null ? null : {
						id: Vi,
						overflow: Hi
					},
					retryLane: 536870912,
					hydrationErrors: null
				}, n = Ai(e), n.return = t, t.child = n, Ji = t, Yi = null)) : e = null, e === null) throw $i(t);
				return t.lanes = cm(e) ? 32 : 536870912, null;
			}
			return a = r.children, r = r.fallback, i ? (Do(), i = t.mode, a = qc({
				mode: "hidden",
				children: a
			}, i), r = Oi(r, i, n, null), a.return = t, r.return = t, a.sibling = r, t.child = a, r = t.child, r.memoizedState = Uc(n), r.childLanes = Wc(e, o, n), t.memoizedState = Hc, Mc(null, r)) : (wo(t), Kc(t, a));
		}
		var s = e.memoizedState;
		if (s !== null) {
			var c = s.dehydrated;
			if (c !== null) return Yc(e, t, a, o, r, c, s, n);
		}
		return i ? (Do(), i = r.fallback, a = t.mode, s = e.child, c = s.sibling, r = Ti(s, {
			mode: "hidden",
			children: r.children
		}), r.subtreeFlags = s.subtreeFlags & 1206910976, c === null ? (i = Oi(i, a, n, null), i.flags |= 2) : i = Ti(c, i), i.return = t, r.return = t, r.sibling = i, t.child = r, Mc(null, r), r = t.child, i = e.child.memoizedState, i === null ? i = Uc(n) : (a = i.cachePool, a === null ? a = za() : (s = Sa._currentValue, a = a.parent === s ? a : {
			parent: s,
			pool: s
		}), i = {
			baseLanes: i.baseLanes | n,
			cachePool: a
		}), r.memoizedState = i, r.childLanes = Wc(e, o, n), t.memoizedState = Hc, Mc(e.child, r)) : (wo(t), n = e.child, e = n.sibling, n = Ti(n, {
			mode: "visible",
			children: r.children
		}), n.return = t, n.sibling = null, e !== null && (o = t.deletions, o === null ? (t.deletions = [e], t.flags |= 16) : o.push(e)), t.child = n, t.memoizedState = null, n);
	}
	function Kc(e, t) {
		return t = qc({
			mode: "visible",
			children: t
		}, e.mode), t.return = e, e.child = t;
	}
	function qc(e, t) {
		return e = Ci(22, e, null, t), e.lanes = 0, e;
	}
	function Jc(e, t, n) {
		return no(t, e.child, null, n), e = Kc(t, t.pendingProps.children), e.flags |= 2, t.memoizedState = null, e;
	}
	function Yc(e, t, n, r, a, o, s, c) {
		if (n) return t.flags & 256 ? (wo(t), t.flags &= -257, Jc(e, t, c)) : t.memoizedState === null ? (Do(), o = a.fallback, s = t.mode, a = qc({
			mode: "visible",
			children: a.children
		}, s), o = Oi(o, s, c, null), o.flags |= 2, a.return = t, o.return = t, a.sibling = o, t.child = a, no(t, e.child, null, c), a = t.child, a.memoizedState = Uc(c), a.childLanes = Wc(e, r, c), t.memoizedState = Hc, Mc(null, a)) : (Do(), t.child = e.child, t.flags |= 128, null);
		if (wo(t), cm(o)) {
			if (r = o.nextSibling && o.nextSibling.dataset, r) var l = r.dgst;
			return r = l, r !== "" && (a = Error(i(419)), a.stack = "", a.digest = r, aa({
				value: a,
				source: null,
				stack: null
			})), Jc(e, t, c);
		}
		if (Ec || pa(e, t, c, !1), r = (c & e.childLanes) !== 0, Ec || r) {
			if (_o.current !== null) return Jc(e, t, c);
			if (r = Ju, r !== null && (a = ot(r, c), a !== 0 && a !== s.retryLane)) throw s.retryLane = a, vi(e, a), Md(r, e, a), Tc;
			return sm(o) || Wd(), Jc(e, t, c);
		}
		return sm(o) ? (t.flags |= 192, t.child = e.child, null) : (e = s.treeContext, Yi = um(o.nextSibling), Ji = t, Y = !0, Xi = null, Zi = !1, e !== null && qi(t, e), t = Kc(t, a.children), t.flags |= 134221824, t);
	}
	function Xc(e, t, n) {
		e.lanes |= t;
		var r = e.alternate;
		r !== null && (r.lanes |= t), da(e.return, t, n);
	}
	function Zc(e) {
		for (var t = null; e !== null;) {
			var n = e.alternate;
			n !== null && Mo(n) === null && (t = e), e = e.sibling;
		}
		return t;
	}
	function Qc(e, t, n, r, i, a) {
		var o = e.memoizedState;
		o === null ? e.memoizedState = {
			isBackwards: t,
			rendering: null,
			renderingStartTime: 0,
			last: r,
			tail: n,
			tailMode: i,
			treeForkCount: a
		} : (o.isBackwards = t, o.rendering = null, o.renderingStartTime = 0, o.last = r, o.tail = n, o.tailMode = i, o.treeForkCount = a);
	}
	function $c(e) {
		var t = e.child;
		for (e.child = null; t !== null;) {
			var n = t.sibling;
			t.sibling = e.child, e.child = t, t = n;
		}
	}
	function el(e, t, n) {
		var r = t.pendingProps, i = r.revealOrder, a = r.tail;
		r = r.children;
		var o = ko.current;
		if (t.flags & 128) return Ao(t, o), null;
		var s = !!(o & 2);
		if (s ? (o = o & 1 | 2, t.flags |= 128) : o &= 1, Ao(t, o), i === "backwards" && e !== null ? ($c(e), Dc(e, t, r, n), $c(e)) : Dc(e, t, r, n), r = Y ? Li : 0, !s && e !== null && e.flags & 128) a: for (e = t.child; e !== null;) {
			if (e.tag === 13) e.memoizedState !== null && Xc(e, n, t);
			else if (e.tag === 19) Xc(e, n, t);
			else if (e.child !== null) {
				e.child.return = e, e = e.child;
				continue;
			}
			if (e === t) break a;
			for (; e.sibling === null;) {
				if (e.return === null || e.return === t) break a;
				e = e.return;
			}
			e.sibling.return = e.return, e = e.sibling;
		}
		switch (i) {
			case "backwards":
				n = Zc(t.child), n === null ? (i = t.child, t.child = null) : (i = n.sibling, n.sibling = null, $c(t)), Qc(t, !0, i, null, a, r);
				break;
			case "unstable_legacy-backwards":
				for (n = null, i = t.child, t.child = null; i !== null;) {
					if (e = i.alternate, e !== null && Mo(e) === null) {
						t.child = i;
						break;
					}
					e = i.sibling, i.sibling = n, n = i, i = e;
				}
				Qc(t, !0, n, null, a, r);
				break;
			case "together":
				Qc(t, !1, null, null, void 0, r);
				break;
			case "independent":
				t.memoizedState = null;
				break;
			default: n = Zc(t.child), n === null ? (i = t.child, t.child = null) : (i = n.sibling, n.sibling = null), Qc(t, !1, i, n, a, r);
		}
		return t.child;
	}
	function tl(e, t, n) {
		var r = t.pendingProps;
		return la(t, t.type, r.value), Dc(e, t, r.children, n), t.child;
	}
	function nl(e, t, n) {
		if (e !== null && (t.dependencies = e.dependencies), id |= t.lanes, (n & t.childLanes) === 0) {
			if (e !== null) {
				if (pa(e, t, n, !1), (n & t.childLanes) === 0) return null;
			} else return null;
		}
		if (e !== null && t.child !== e.child) throw Error(i(153));
		if (t.child !== null) {
			for (e = t.child, n = Ti(e, e.pendingProps), t.child = n, n.return = t; e.sibling !== null;) e = e.sibling, n = n.sibling = Ti(e, e.pendingProps), n.return = t;
			n.sibling = null;
		}
		return t.child;
	}
	function rl(e, t) {
		return (e.lanes & t) !== 0 || (e = e.dependencies, !!(e !== null && ma(e)));
	}
	function il(e, t, n) {
		switch (t.tag) {
			case 3:
				he(t, t.stateNode.containerInfo), la(t, Sa, e.memoizedState.cache), ra();
				break;
			case 27:
			case 5:
				_e(t);
				break;
			case 4:
				he(t, t.stateNode.containerInfo);
				break;
			case 10:
				la(t, t.type, t.memoizedProps.value);
				break;
			case 31:
				if (t.memoizedState !== null) return t.flags |= 128, To(t), null;
				break;
			case 13:
				var r = t.memoizedState;
				if (r !== null) {
					if (r.dehydrated !== null) return wo(t), t.flags |= 128, null;
					r = pa(e, t, n, !1);
					var i = t.child.childLanes;
					return r || (n & i) !== 0 ? Gc(e, t, n) : (wo(t), e = nl(e, t, n), e === null ? null : e.sibling);
				}
				wo(t);
				break;
			case 19:
				if (t.flags & 128) return el(e, t, n);
				if (i = !!(e.flags & 128), r = (n & t.childLanes) !== 0, r ||= (pa(e, t, n, !1), (n & t.childLanes) !== 0), i) {
					if (r) return el(e, t, n);
					t.flags |= 128;
				}
				if (i = t.memoizedState, i !== null && (i.rendering = null, i.tail = null, i.lastEffect = null), Ao(t, ko.current), r) break;
				return null;
			case 22: return t.lanes = 0, jc(e, t, n, t.pendingProps);
			case 24: la(t, Sa, e.memoizedState.cache);
		}
		return nl(e, t, n);
	}
	function al(e, t, n) {
		if (e !== null) {
			if (e.memoizedProps !== t.pendingProps) Ec = !0;
			else {
				if (!rl(e, n) && !(t.flags & 128)) return Ec = !1, il(e, t, n);
				Ec = !!(e.flags & 131072);
			}
		} else Ec = !1, Y && t.flags & 1048576 && Wi(t, Li, t.index);
		switch (t.lanes = 0, t.tag) {
			case 16:
				a: {
					var r = t.pendingProps;
					if (e = Ka(t.elementType), t.type = e, typeof e == "function") wi(e) ? (r = hc(e, r), t.tag = 1, t = Bc(null, t, e, r, n)) : (t.tag = 0, t = Rc(null, t, e, r, n));
					else {
						if (e != null) {
							var a = e.$$typeof;
							if (a === I) {
								t.tag = 11, t = Oc(null, t, e, r, n);
								break a;
							}
							if (a === te) {
								t.tag = 14, t = kc(null, t, e, r, n);
								break a;
							}
							if (a === F) {
								t.tag = 10, t.type = e, t = tl(null, t, n);
								break a;
							}
						}
						throw t = ce(e) || e, Error(i(306, t, ""));
					}
				}
				return t;
			case 0: return Rc(e, t, t.type, t.pendingProps, n);
			case 1: return r = t.type, a = hc(r, t.pendingProps), Bc(e, t, r, a, n);
			case 3:
				a: {
					if (he(t, t.stateNode.containerInfo), e === null) throw Error(i(387));
					r = t.pendingProps;
					var o = t.memoizedState;
					a = o.element, oo(e, t), mo(t, r, null, n);
					var s = t.memoizedState;
					if (r = s.cache, la(t, Sa, r), r !== o.cache && fa(t, [Sa], n, !0), po(), r = s.element, o.isDehydrated) {
						if (o = {
							element: r,
							isDehydrated: !1,
							cache: s.cache
						}, t.updateQueue.baseState = o, t.memoizedState = o, t.flags & 256) {
							t = Vc(e, t, r, n);
							break a;
						}
						if (r !== a) {
							a = Ni(Error(i(424)), t), aa(a), t = Vc(e, t, r, n);
							break a;
						}
						switch (e = t.stateNode.containerInfo, e.nodeType) {
							case 9:
								e = e.body;
								break;
							default: e = e.nodeName === "HTML" ? e.ownerDocument.body : e;
						}
						for (Yi = um(e.firstChild), Ji = t, Y = !0, Xi = null, Zi = !0, n = ro(t, null, r, n), t.child = n; n;) n.flags = n.flags & -3 | 134221824, n = n.sibling;
					} else {
						if (ra(), r === a) {
							t = nl(e, t, n);
							break a;
						}
						Dc(e, t, r, n);
					}
					t = t.child;
				}
				return t;
			case 26: return Lc(e, t), e === null ? (n = Pm(t.type, null, t.pendingProps, null)) ? t.memoizedState = n : Y || (t.stateNode = pp(t.type, t.pendingProps, K.current, t)) : t.memoizedState = Pm(t.type, e.memoizedProps, t.pendingProps, e.memoizedState), null;
			case 27: return _e(t), e === null && Y && (r = t.stateNode = gm(t.type, t.pendingProps, K.current), Ji = t, Zi = !0, a = Yi, Cp(t.type) ? (dm = a, Yi = um(r.firstChild)) : Yi = a), Dc(e, t, t.pendingProps.children, n), Lc(e, t), e === null && (t.flags |= 4194304), t.child;
			case 5: return e === null && Y && ((a = r = Yi) && (r = im(r, t.type, t.pendingProps, Zi), r === null ? a = !1 : (t.stateNode = r, Ji = t, Yi = um(r.firstChild), Zi = !1, a = !0)), a || $i(t)), _e(t), a = t.type, o = t.pendingProps, s = e === null ? null : e.memoizedProps, r = o.children, mp(a, o) ? r = null : s !== null && mp(a, s) && (t.flags |= 32), t.memoizedState !== null && (a = Go(e, t, Jo, null, null, n), ch._currentValue = a), Lc(e, t), Dc(e, t, r, n), t.child;
			case 6: return e === null && Y && ((e = n = Yi) && (n = am(n, t.pendingProps, Zi), n === null ? e = !1 : (t.stateNode = n, Ji = t, Yi = null, e = !0)), e || $i(t)), null;
			case 13: return Gc(e, t, n);
			case 4: return he(t, t.stateNode.containerInfo), r = t.pendingProps, e === null ? t.child = no(t, null, r, n) : Dc(e, t, r, n), t.child;
			case 11: return Oc(e, t, t.type, t.pendingProps, n);
			case 7: return r = t.pendingProps, Lc(e, t), Dc(e, t, r, n), t.child;
			case 8: return Dc(e, t, t.pendingProps.children, n), t.child;
			case 12: return Dc(e, t, t.pendingProps.children, n), t.child;
			case 10: return tl(e, t, n);
			case 9: return a = t.type._context, r = t.pendingProps.children, ha(t), a = ga(a), r = r(a), t.flags |= 1, Dc(e, t, r, n), t.child;
			case 14: return kc(e, t, t.type, t.pendingProps, n);
			case 15: return Ac(e, t, t.type, t.pendingProps, n);
			case 19: return el(e, t, n);
			case 31: return Ic(e, t, n);
			case 22: return jc(e, t, n, t.pendingProps);
			case 24: return ha(t), r = ga(Sa), e === null ? (a = La(), a === null && (a = Ju, o = Ca(), a.pooledCache = o, o.refCount++, o !== null && (a.pooledCacheLanes |= n), a = o), t.memoizedState = {
				parent: r,
				cache: a
			}, ao(t), la(t, Sa, a)) : ((e.lanes & n) !== 0 && (oo(e, t), mo(t, null, null, n), po()), a = e.memoizedState, o = t.memoizedState, a.parent === r ? (r = o.cache, la(t, Sa, r), r !== a.cache && fa(t, [Sa], n, !0)) : (a = {
				parent: r,
				cache: r
			}, t.memoizedState = a, t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = a), la(t, Sa, r))), Dc(e, t, t.pendingProps.children, n), t.child;
			case 30: return t.stateNode === null && (t.stateNode = {
				autoName: null,
				paired: null,
				clones: null,
				ref: null
			}), r = t.pendingProps, r.name != null && r.name !== "auto" ? t.flags |= e === null ? 18882560 : 18874368 : Y && Gi(t), e !== null && e.memoizedProps.name !== r.name ? t.flags |= 4194816 : Lc(e, t), Dc(e, t, r.children, n), t.child;
			case 29: throw t.pendingProps;
		}
		throw Error(i(156, t.tag));
	}
	function ol(e) {
		e.flags |= 4;
	}
	function sl(e, t, n, r, i) {
		var a;
		if ((a = !!(e.mode & 32)) && (a = n === null ? Ym(t, r) : Ym(t, r) && (r.src !== n.src || r.srcSet !== n.srcSet)), a) {
			if (e.flags |= 16777216, (i & 335544128) === i) {
				if (e.stateNode.complete) e.flags |= 8192;
				else if (Vd()) e.flags |= 8192;
				else throw qa = Ua, Va;
			}
		} else e.flags &= -16777217;
	}
	function cl(e, t) {
		if (t.type !== "stylesheet" || t.state.loading & 4) e.flags &= -16777217;
		else if (e.flags |= 16777216, !Xm(t)) {
			if (Vd()) e.flags |= 8192;
			else throw qa = Ua, Va;
		}
	}
	function ll(e, t) {
		t !== null && (e.flags |= 4), e.flags & 16384 && (t = e.tag === 22 ? 536870912 : et(), e.lanes |= t, cd |= t);
	}
	function ul(e, t) {
		if (!Y) switch (e.tailMode) {
			case "visible": break;
			case "collapsed":
				for (var n = e.tail, r = null; n !== null;) n.alternate !== null && (r = n), n = n.sibling;
				r === null ? t || e.tail === null ? e.tail = null : e.tail.sibling = null : r.sibling = null;
				break;
			default:
				for (t = e.tail, n = null; t !== null;) t.alternate !== null && (n = t), t = t.sibling;
				n === null ? e.tail = null : n.sibling = null;
		}
	}
	function dl(e) {
		var t = e.alternate !== null && e.alternate.child === e.child, n = 0, r = 0;
		if (t) for (var i = e.child; i !== null;) n |= i.lanes | i.childLanes, r |= i.subtreeFlags & 1206910976, r |= i.flags & 1206910976, i.return = e, i = i.sibling;
		else for (i = e.child; i !== null;) n |= i.lanes | i.childLanes, r |= i.subtreeFlags, r |= i.flags, i.return = e, i = i.sibling;
		return e.subtreeFlags |= r, e.childLanes = n, t;
	}
	function fl(e, t, n) {
		var r = t.pendingProps;
		switch (Ki(t), t.tag) {
			case 16:
			case 15:
			case 0:
			case 11:
			case 7:
			case 8:
			case 12:
			case 9:
			case 14: return dl(t), null;
			case 1: return dl(t), null;
			case 3: return n = t.stateNode, r = null, e !== null && (r = e.memoizedState.cache), t.memoizedState.cache !== r && (t.flags |= 2048), ua(Sa), ge(), n.pendingContext && (n.context = n.pendingContext, n.pendingContext = null), (e === null || e.child === null) && (na(t) ? ol(t) : e === null || e.memoizedState.isDehydrated && !(t.flags & 256) || (t.flags |= 1024, ia())), dl(t), null;
			case 26:
				var a = t.type, o = t.memoizedState;
				return e === null ? (ol(t), o === null ? (dl(t), sl(t, a, null, r, n)) : (dl(t), cl(t, o))) : o ? o === e.memoizedState ? (dl(t), t.flags &= -16777217) : (ol(t), dl(t), cl(t, o)) : (e = e.memoizedProps, e !== r && ol(t), dl(t), sl(t, a, e, r, n)), null;
			case 27:
				if (ve(t), n = K.current, a = t.type, e !== null && t.stateNode != null) e.memoizedProps !== r && ol(t);
				else {
					if (!r) {
						if (t.stateNode === null) throw Error(i(166));
						return dl(t), t.subtreeFlags &= -33554433, null;
					}
					e = me.current, na(t) ? ea(t, e) : (e = gm(a, r, n), t.stateNode = e, ol(t));
				}
				return dl(t), t.subtreeFlags &= -33554433, null;
			case 5:
				if (ve(t), a = t.type, e !== null && t.stateNode != null) e.memoizedProps !== r && ol(t);
				else {
					if (!r) {
						if (t.stateNode === null) throw Error(i(166));
						return dl(t), t.subtreeFlags &= -33554433, null;
					}
					if (o = me.current, na(t)) ea(t, o);
					else {
						var s = up(K.current);
						switch (o) {
							case 1:
								o = s.createElementNS("http://www.w3.org/2000/svg", a);
								break;
							case 2:
								o = s.createElementNS("http://www.w3.org/1998/Math/MathML", a);
								break;
							default: switch (a) {
								case "svg":
									o = s.createElementNS("http://www.w3.org/2000/svg", a);
									break;
								case "math":
									o = s.createElementNS("http://www.w3.org/1998/Math/MathML", a);
									break;
								case "script":
									o = s.createElement("div"), o.innerHTML = "<script><\/script>", o = o.removeChild(o.firstChild);
									break;
								case "select":
									o = typeof r.is == "string" ? s.createElement("select", { is: r.is }) : s.createElement("select"), r.multiple ? o.multiple = !0 : r.size && (o.size = r.size);
									break;
								default: o = typeof r.is == "string" ? s.createElement(a, { is: r.is }) : s.createElement(a);
							}
						}
						o[ft] = t, o[pt] = r;
						a: for (s = t.child; s !== null;) {
							if (s.tag === 5 || s.tag === 6) o.appendChild(s.stateNode);
							else if (s.tag !== 4 && s.tag !== 27 && s.child !== null) {
								s.child.return = s, s = s.child;
								continue;
							}
							if (s === t) break a;
							for (; s.sibling === null;) {
								if (s.return === null || s.return === t) break a;
								s = s.return;
							}
							s.sibling.return = s.return, s = s.sibling;
						}
						t.stateNode = o;
						a: switch (rp(o, a, r), a) {
							case "button":
							case "input":
							case "select":
							case "textarea":
								r = !!r.autoFocus;
								break a;
							case "img":
								r = !0;
								break a;
							default: r = !1;
						}
						r && ol(t);
					}
				}
				return dl(t), t.subtreeFlags &= -33554433, sl(t, t.type, e === null ? null : e.memoizedProps, t.pendingProps, n), null;
			case 6:
				if (e && t.stateNode != null) e.memoizedProps !== r && ol(t);
				else {
					if (typeof r != "string" && t.stateNode === null) throw Error(i(166));
					if (e = K.current, na(t)) {
						if (e = t.stateNode, n = t.memoizedProps, r = null, a = Ji, a !== null) switch (a.tag) {
							case 27:
							case 5: r = a.memoizedProps;
						}
						e[ft] = t, e = !!(e.nodeValue === n || r !== null && !0 === r.suppressHydrationWarning || ep(e.nodeValue, n)), e || $i(t, !0);
					} else e = up(e).createTextNode(r), e[ft] = t, t.stateNode = e;
				}
				return dl(t), null;
			case 31:
				if (n = t.memoizedState, e === null || e.memoizedState !== null) {
					if (r = na(t), n !== null) {
						if (e === null) {
							if (!r) throw Error(i(318));
							if (e = t.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(i(557));
							e[ft] = t;
						} else ra(), !(t.flags & 128) && (t.memoizedState = null), t.flags |= 4;
						dl(t), e = !1;
					} else n = ia(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = n), e = !0;
					if (!e) return t.flags & 256 ? (Oo(t), t) : (Oo(t), null);
					if (t.flags & 128) throw Error(i(558));
				}
				return dl(t), null;
			case 13:
				if (r = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
					if (a = na(t), r !== null && r.dehydrated !== null) {
						if (e === null) {
							if (!a) throw Error(i(318));
							if (a = t.memoizedState, a = a === null ? null : a.dehydrated, !a) throw Error(i(317));
							a[ft] = t;
						} else ra(), !(t.flags & 128) && (t.memoizedState = null), t.flags |= 4;
						dl(t), a = !1;
					} else a = ia(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = a), a = !0;
					if (!a) return t.flags & 256 ? (Oo(t), t) : (Oo(t), null);
				}
				return Oo(t), t.flags & 128 ? (t.lanes = n, t) : (n = r !== null, e = e !== null && e.memoizedState !== null, n && (r = t.child, a = null, r.alternate !== null && r.alternate.memoizedState !== null && r.alternate.memoizedState.cachePool !== null && (a = r.alternate.memoizedState.cachePool.pool), o = null, r.memoizedState !== null && r.memoizedState.cachePool !== null && (o = r.memoizedState.cachePool.pool), o !== a && (r.flags |= 2048)), n !== e && n && (t.child.flags |= 8192), ll(t, t.updateQueue), dl(t), null);
			case 4: return ge(), e === null && Wf(t.stateNode.containerInfo), t.flags |= 67108864, dl(t), null;
			case 10: return ua(t.type), dl(t), null;
			case 19:
				if (jo(t), r = t.memoizedState, r === null) return dl(t), null;
				if (a = !!(t.flags & 128), o = r.rendering, o === null) {
					if (a) ul(r, !1);
					else {
						if (rd !== 0 || e !== null && e.flags & 128) for (e = t.child; e !== null;) {
							if (o = Mo(e), o !== null) {
								for (t.flags |= 128, ul(r, !1), e = o.updateQueue, t.updateQueue = e, ll(t, e), t.subtreeFlags = 0, e = n, n = t.child; n !== null;) Ei(n, e), n = n.sibling;
								return Ao(t, ko.current & 1 | 2), Y && Ui(t, r.treeForkCount), t.child;
							}
							e = e.sibling;
						}
						r.tail !== null && je() > md && (t.flags |= 128, a = !0, ul(r, !1), t.lanes = 4194304);
					}
				} else {
					if (!a) {
						if (e = Mo(o), e !== null) {
							if (t.flags |= 128, a = !0, e = e.updateQueue, t.updateQueue = e, ll(t, e), ul(r, !0), r.tail === null && r.tailMode !== "collapsed" && r.tailMode !== "visible" && !o.alternate && !Y) return dl(t), null;
						} else 2 * je() - r.renderingStartTime > md && n !== 536870912 && (t.flags |= 128, a = !0, ul(r, !1), t.lanes = 4194304);
					}
					r.isBackwards ? (o.sibling = t.child, t.child = o) : (e = r.last, e === null ? t.child = o : e.sibling = o, r.last = o);
				}
				if (r.tail !== null) {
					e = r.tail;
					a: {
						for (n = e; n !== null;) {
							if (n.alternate !== null) {
								n = !1;
								break a;
							}
							n = n.sibling;
						}
						n = !0;
					}
					return r.rendering = e, r.tail = e.sibling, r.renderingStartTime = je(), e.sibling = null, o = ko.current, o = a ? o & 1 | 2 : o & 1, r.tailMode === "visible" || r.tailMode === "collapsed" || !n || Y ? Ao(t, o) : (n = o, W(So, t), W(ko, n), Co === null && (Co = t)), Y && Ui(t, r.treeForkCount), e;
				}
				return dl(t), null;
			case 22:
			case 23: return Oo(t), xo(), r = t.memoizedState !== null, e === null ? r && (t.flags |= 8192) : e.memoizedState !== null !== r && (t.flags |= 8192), r ? n & 536870912 && !(t.flags & 128) && (dl(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : dl(t), n = t.updateQueue, n !== null && ll(t, n.retryQueue), n = null, e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), r = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (r = t.memoizedState.cachePool.pool), r !== n && (t.flags |= 2048), e !== null && pe(Ia), null;
			case 24: return n = null, e !== null && (n = e.memoizedState.cache), t.memoizedState.cache !== n && (t.flags |= 2048), ua(Sa), dl(t), null;
			case 25: return null;
			case 30: return t.flags |= 33554432, dl(t), null;
		}
		throw Error(i(156, t.tag));
	}
	function pl(e, t) {
		switch (Ki(t), t.tag) {
			case 1: return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 3: return ua(Sa), ge(), e = t.flags, e & 65536 && !(e & 128) ? (t.flags = e & -65537 | 128, t) : null;
			case 26:
			case 27:
			case 5: return ve(t), null;
			case 31:
				if (t.memoizedState !== null) {
					if (Oo(t), t.alternate === null) throw Error(i(340));
					ra();
				}
				return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 13:
				if (Oo(t), e = t.memoizedState, e !== null && e.dehydrated !== null) {
					if (t.alternate === null) throw Error(i(340));
					ra();
				}
				return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 19: return jo(t), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, e = t.memoizedState, e !== null && (e.rendering = null, e.tail = null), t.flags |= 4, t) : null;
			case 4: return ge(), null;
			case 10: return ua(t.type), null;
			case 22:
			case 23: return Oo(t), xo(), e !== null && pe(Ia), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 24: return ua(Sa), null;
			case 25: return null;
			default: return null;
		}
	}
	function ml(e, t) {
		switch (Ki(t), t.tag) {
			case 3:
				ua(Sa), ge();
				break;
			case 26:
			case 27:
			case 5:
				ve(t);
				break;
			case 4:
				ge();
				break;
			case 31:
				t.memoizedState !== null && Oo(t);
				break;
			case 13:
				Oo(t);
				break;
			case 19:
				jo(t);
				break;
			case 10:
				ua(t.type);
				break;
			case 22:
			case 23:
				Oo(t), xo(), e !== null && pe(Ia);
				break;
			case 24: ua(Sa);
		}
	}
	function hl(e, t) {
		try {
			var n = t.updateQueue, r = n === null ? null : n.lastEffect;
			if (r !== null) {
				var i = r.next;
				n = i;
				do {
					if ((n.tag & e) === e) {
						r = void 0;
						var a = n.create, o = n.inst;
						r = a(), o.destroy = r;
					}
					n = n.next;
				} while (n !== i);
			}
		} catch (e) {
			ff(t, t.return, e);
		}
	}
	function gl(e, t, n) {
		try {
			var r = t.updateQueue, i = r === null ? null : r.lastEffect;
			if (i !== null) {
				var a = i.next;
				r = a;
				do {
					if ((r.tag & e) === e) {
						var o = r.inst, s = o.destroy;
						if (s !== void 0) {
							o.destroy = void 0, i = t;
							var c = n, l = s;
							try {
								l();
							} catch (e) {
								ff(i, c, e);
							}
						}
					}
					r = r.next;
				} while (r !== a);
			}
		} catch (e) {
			ff(t, t.return, e);
		}
	}
	function _l(e) {
		var t = e.updateQueue;
		if (t !== null) {
			var n = e.stateNode;
			try {
				go(t, n);
			} catch (t) {
				ff(e, e.return, t);
			}
		}
	}
	function vl(e, t, n) {
		n.props = hc(e.type, e.memoizedProps), n.state = e.memoizedState;
		try {
			n.componentWillUnmount();
		} catch (n) {
			ff(e, t, n);
		}
	}
	function yl(e, t) {
		try {
			var n = e.ref;
			if (n !== null) {
				switch (e.tag) {
					case 26:
					case 27:
					case 5:
						var r = e.stateNode;
						break;
					case 30:
						var i = e.stateNode, a = ci(e.memoizedProps, i);
						(i.ref === null || i.ref.name !== a) && (i.ref = Fp(a)), r = i.ref;
						break;
					case 7:
						if (e.stateNode === null) {
							var o = new Ip(e);
							h(e.child, !1, $p, o, void 0, void 0), e.stateNode = o;
						}
						r = e.stateNode;
						break;
					default: r = e.stateNode;
				}
				typeof n == "function" ? e.refCleanup = n(r) : n.current = r;
			}
		} catch (n) {
			ff(e, t, n);
		}
	}
	function bl(e, t) {
		var n = e.ref, r = e.refCleanup;
		if (n !== null) {
			if (typeof r == "function") try {
				r();
			} catch (n) {
				ff(e, t, n);
			} finally {
				e.refCleanup = null, e = e.alternate, e != null && (e.refCleanup = null);
			}
			else if (typeof n == "function") try {
				n(null);
			} catch (n) {
				ff(e, t, n);
			}
			else n.current = null;
		}
	}
	function xl(e, t) {
		if ((e.tag === 5 || e.tag === 27 || e.tag === 6) && e.alternate === null && t !== null) for (var n = 0; n < t.length; n++) tm(e.stateNode, t[n]);
	}
	function Sl(e) {
		for (var t = e.return; t !== null && (wl(t) && tm(e.stateNode, t.stateNode), !Cl(t));) t = t.return;
	}
	function Z(e) {
		for (var t = e.return; t !== null && (wl(t) && nm(e.stateNode, t.stateNode), !Cl(t));) t = t.return;
	}
	function Cl(e) {
		return e.tag === 5 || e.tag === 3 || e.tag === 27;
	}
	function wl(e) {
		return e && e.tag === 7 && e.stateNode !== null;
	}
	function Tl(e) {
		var t = e.type, n = e.memoizedProps, r = e.stateNode;
		try {
			a: switch (t) {
				case "button":
				case "input":
				case "select":
				case "textarea":
					n.autoFocus && r.focus();
					break a;
				case "img": n.src ? r.src = n.src : n.srcSet && (r.srcset = n.srcSet);
			}
		} catch (t) {
			ff(e, e.return, t);
		}
	}
	function El(e, t, n) {
		try {
			var r = e.stateNode;
			ap(r, e.type, n, t), r[pt] = t;
		} catch (t) {
			ff(e, e.return, t);
		}
	}
	function Dl(e) {
		return e.tag === 5 || e.tag === 3 || e.tag === 26 || e.tag === 27 && Cp(e.type) || e.tag === 4;
	}
	function Ol(e) {
		a: for (;;) {
			for (; e.sibling === null;) {
				if (e.return === null || Dl(e.return)) return null;
				e = e.return;
			}
			for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18;) {
				if (e.tag === 27 && Cp(e.type) || e.flags & 2 || e.child === null || e.tag === 4) continue a;
				e.child.return = e, e = e.child;
			}
			if (!(e.flags & 2)) return e.stateNode;
		}
	}
	function kl(e, t, n, r) {
		var i = e.tag;
		if (i === 5 || i === 6) i = e.stateNode, t ? (n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n).insertBefore(i, t) : (t = n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n, t.appendChild(i), n = n._reactRootContainer, n != null || t.onclick !== null || (t.onclick = ln)), xl(e, r), It = !0;
		else if (i !== 4 && (i === 27 && (xl(e, r), r = null, Cp(e.type) && (n = e.stateNode, t = null)), e = e.child, e !== null)) for (kl(e, t, n, r), e = e.sibling; e !== null;) kl(e, t, n, r), e = e.sibling;
	}
	function Al(e, t, n, r) {
		var i = e.tag;
		if (i === 5 || i === 6) i = e.stateNode, t ? n.insertBefore(i, t) : n.appendChild(i), xl(e, r), It = !0;
		else if (i !== 4 && (i === 27 && (xl(e, r), r = null, Cp(e.type) && (n = e.stateNode)), e = e.child, e !== null)) for (Al(e, t, n, r), e = e.sibling; e !== null;) Al(e, t, n, r), e = e.sibling;
	}
	function jl(e) {
		var t = e.stateNode, n = e.memoizedProps;
		try {
			for (var r = e.type, i = t.attributes; i.length;) t.removeAttributeNode(i[0]);
			rp(t, r, n), t[ft] = e, t[pt] = n;
		} catch (t) {
			ff(e, e.return, t);
		}
	}
	var Ml = !1, Nl = null;
	function Pl(e) {
		(e.tag === 30 || e.subtreeFlags & 33554432) && (Ml = !0);
	}
	var Fl = null;
	function Il() {
		var e = Fl;
		return Fl = null, e;
	}
	var Ll = 0;
	function Rl(e, t, n, r, i) {
		return Ll = 0, zl(e.child, t, n, r, i);
	}
	function zl(e, t, n, r, i) {
		for (var a = !1; e !== null;) {
			if (e.tag === 5) {
				var o = e.stateNode;
				if (r !== null) {
					var s = kp(o);
					r.push(s), s.view && (a = !0);
				} else a || kp(o).view && (a = !0);
				Ml = !0, Ep(o, Ll === 0 ? t : t + "_" + Ll, n), Ll++;
			} else e.tag === 22 && e.memoizedState !== null || e.tag === 30 && i || zl(e.child, t, n, r, i) && (a = !0);
			e = e.sibling;
		}
		return a;
	}
	function Bl(e, t) {
		for (; e !== null;) e.tag === 5 ? Dp(e.stateNode, e.memoizedProps) : e.tag === 22 && e.memoizedState !== null || e.tag === 30 && t || Bl(e.child, t), e = e.sibling;
	}
	function Vl(e) {
		if (e.subtreeFlags & 18874368) for (e = e.child; e !== null;) {
			if ((e.tag !== 22 || e.memoizedState === null) && (Vl(e), e.tag === 30 && e.flags & 18874368 && e.stateNode.paired)) {
				var t = e.memoizedProps;
				if (t.name == null || t.name === "auto") throw Error(i(544));
				var n = t.name;
				t = ui(t.default, t.share), t !== "none" && (Rl(e, n, t, null, !1) || Bl(e.child, !1));
			}
			e = e.sibling;
		}
	}
	function Hl(e, t) {
		if (e.tag === 30) {
			var n = e.stateNode, r = e.memoizedProps, i = ci(r, n), a = ui(r.default, n.paired ? r.share : r.enter);
			a === "none" ? Vl(e) : Rl(e, i, a, null, !1) ? (Vl(e), n.paired || t || jd(e, r.onEnter)) : Bl(e.child, !1);
		} else if (e.subtreeFlags & 33554432) for (e = e.child; e !== null;) Hl(e, t), e = e.sibling;
		else Vl(e);
	}
	function Ul(e) {
		if (Nl !== null && Nl.size !== 0) {
			var t = Nl;
			if (e.subtreeFlags & 18874368) for (e = e.child; e !== null;) {
				if (e.tag !== 22 || e.memoizedState === null) {
					if (e.tag === 30 && e.flags & 18874368) {
						var n = e.memoizedProps, r = n.name;
						if (r != null && r !== "auto") {
							var i = t.get(r);
							if (i !== void 0) {
								var a = ui(n.default, n.share);
								if (a !== "none" && (Rl(e, r, a, null, !1) ? (a = e.stateNode, i.paired = a, a.paired = i, jd(e, n.onShare)) : Bl(e.child, !1)), t.delete(r), t.size === 0) break;
							}
						}
					}
					Ul(e);
				}
				e = e.sibling;
			}
		}
	}
	function Wl(e) {
		if (e.tag === 30) {
			var t = e.memoizedProps, n = ci(t, e.stateNode), r = Nl === null ? void 0 : Nl.get(n), i = ui(t.default, r === void 0 ? t.exit : t.share);
			i !== "none" && (Rl(e, n, i, null, !1) ? r === void 0 ? jd(e, t.onExit) : (i = e.stateNode, r.paired = i, i.paired = r, Nl.delete(n), jd(e, t.onShare)) : Bl(e.child, !1)), Nl !== null && Ul(e);
		} else if (e.subtreeFlags & 33554432) for (e = e.child; e !== null;) Wl(e), e = e.sibling;
		else Nl !== null && Ul(e);
	}
	function Gl(e) {
		for (e = e.child; e !== null;) {
			if (e.tag === 30) {
				var t = e.memoizedProps, n = ci(t, e.stateNode);
				t = ui(t.default, t.update), e.flags &= -5, t !== "none" && Rl(e, n, t, e.memoizedState = [], !1);
			} else e.subtreeFlags & 33554432 && Gl(e);
			e = e.sibling;
		}
	}
	function Kl(e) {
		if (e.subtreeFlags & 18874368) for (e = e.child; e !== null;) {
			if (e.tag !== 22 || e.memoizedState === null) {
				if (e.tag === 30 && e.flags & 18874368) {
					var t = e.stateNode;
					t.paired !== null && (t.paired = null, Bl(e.child, !1));
				}
				Kl(e);
			}
			e = e.sibling;
		}
	}
	function ql(e) {
		if (e.tag === 30) e.stateNode.paired = null, Bl(e.child, !1), Kl(e);
		else if (e.subtreeFlags & 33554432) for (e = e.child; e !== null;) ql(e), e = e.sibling;
		else Kl(e);
	}
	function Jl(e) {
		for (e = e.child; e !== null;) e.tag === 30 ? Bl(e.child, !1) : e.subtreeFlags & 33554432 && Jl(e), e = e.sibling;
	}
	function Yl(e, t, n, r, i, a, o) {
		for (var s = !1; t !== null;) {
			if (t.tag === 5) {
				var c = t.stateNode;
				if (a !== null && Ll < a.length) {
					var l = a[Ll], u = kp(c);
					(l.view || u.view) && (s = !0);
					var d;
					if (d = !(e.flags & 4)) {
						if (u.clip) d = !0;
						else {
							d = l.rect;
							var f = u.rect;
							d = d.y !== f.y || d.x !== f.x || d.height !== f.height || d.width !== f.width;
						}
					}
					d && (e.flags |= 4), u.abs ? u = !l.abs : (l = l.rect, u = u.rect, u = l.height !== u.height || l.width !== u.width), u && (e.flags |= 32);
				} else e.flags |= 32;
				e.flags & 4 && Ep(c, Ll === 0 ? n : n + "_" + Ll, i), s && e.flags & 4 || (Fl === null && (Fl = []), Fl.push(c, Ll === 0 ? r : r + "_" + Ll, t.memoizedProps)), Ll++;
			} else (t.tag !== 22 || t.memoizedState === null) && (t.tag === 30 && o ? e.flags |= t.flags & 32 : Yl(e, t.child, n, r, i, a, o) && (s = !0));
			t = t.sibling;
		}
		return s;
	}
	function Xl(e, t) {
		for (e = e.child; e !== null;) {
			if (e.tag === 30) {
				var n = e.memoizedProps, r = e.stateNode, i = ci(n, r), a = ui(n.default, n.update);
				if (t) {
					r = r.clones;
					var o = r === null ? null : r.map(Ap);
				} else o = e.memoizedState, e.memoizedState = null;
				r = e;
				var s = e.child;
				Ll = 0, i = Yl(r, s, i, i, a, o, !1), e.flags & 4 && i && (t || jd(e, n.onUpdate));
			} else e.subtreeFlags & 33554432 && Xl(e, t);
			e = e.sibling;
		}
	}
	var Zl = !1, Ql = !1, $l = !1, eu = !1, tu = typeof WeakSet == "function" ? WeakSet : Set, nu = null, ru = !1, iu = !1, au = !1, ou = !1;
	function su(e, t, n) {
		if (e = e.containerInfo, cp = _h, e = Rr(e), zr(e)) {
			if ("selectionStart" in e) var r = {
				start: e.selectionStart,
				end: e.selectionEnd
			};
			else a: {
				r = (r = e.ownerDocument) && r.defaultView || window;
				var i = r.getSelection && r.getSelection();
				if (i && i.rangeCount !== 0) {
					r = i.anchorNode;
					var a = i.anchorOffset, o = i.focusNode;
					i = i.focusOffset;
					try {
						r.nodeType, o.nodeType;
					} catch {
						r = null;
						break a;
					}
					var s = 0, c = -1, l = -1, u = 0, d = 0, f = e, p = null;
					b: for (;;) {
						for (var m; f !== r || a !== 0 && f.nodeType !== 3 || (c = s + a), f !== o || i !== 0 && f.nodeType !== 3 || (l = s + i), f.nodeType === 3 && (s += f.nodeValue.length), (m = f.firstChild) !== null;) p = f, f = m;
						for (;;) {
							if (f === e) break b;
							if (p === r && ++u === a && (c = s), p === o && ++d === i && (l = s), (m = f.nextSibling) !== null) break;
							f = p, p = f.parentNode;
						}
						f = m;
					}
					r = c === -1 || l === -1 ? null : {
						start: c,
						end: l
					};
				} else r = null;
			}
			r ||= {
				start: 0,
				end: 0
			};
		} else r = null;
		for (lp = {
			focusedElem: e,
			selectionRange: r
		}, _h = !1, n = (n & 335544064) === n, nu = t, t = n ? 9270 : 1024; nu !== null;) {
			if (e = nu, n && (r = e.deletions, r !== null)) for (a = 0; a < r.length; a++) n && Wl(r[a]);
			if (e.alternate === null && e.flags & 2) n && Pl(e), cu(n);
			else {
				if (e.tag === 22) {
					if (r = e.alternate, e.memoizedState !== null) {
						r !== null && r.memoizedState === null && n && Wl(r), cu(n);
						continue;
					}
					if (r !== null && r.memoizedState !== null) {
						n && Pl(e), cu(n);
						continue;
					}
				}
				r = e.child, (e.subtreeFlags & t) !== 0 && r !== null ? (r.return = e, nu = r) : (n && Gl(e), cu(n));
			}
		}
		Nl = null;
	}
	function cu(e) {
		for (; nu !== null;) {
			var t = nu, n = e, r = t.alternate, a = t.flags;
			switch (t.tag) {
				case 0:
				case 11:
				case 15: break;
				case 1:
					if (a & 1024 && r !== null) {
						n = void 0, a = r.memoizedProps, r = r.memoizedState;
						var o = t.stateNode;
						try {
							var s = hc(t.type, a);
							n = o.getSnapshotBeforeUpdate(s, r), o.__reactInternalSnapshotBeforeUpdate = n;
						} catch (e) {
							ff(t, t.return, e);
						}
					}
					break;
				case 3:
					if (a & 1024) {
						if (r = t.stateNode.containerInfo, n = r.nodeType, n === 9) rm(r);
						else if (n === 1) switch (r.nodeName) {
							case "HEAD":
							case "HTML":
							case "BODY":
								rm(r);
								break;
							default: r.textContent = "";
						}
					}
					break;
				case 5:
				case 26:
				case 27:
				case 6:
				case 4:
				case 17: break;
				case 30:
					n && r !== null && (n = ci(r.memoizedProps, r.stateNode), a = t.memoizedProps, a = ui(a.default, a.update), a !== "none" && Rl(r, n, a, r.memoizedState = [], !0));
					break;
				default: if (a & 1024) throw Error(i(163));
			}
			if (r = t.sibling, r !== null) {
				r.return = t.return, nu = r;
				break;
			}
			nu = t.return;
		}
	}
	function lu(e, t, n) {
		var r = n.flags;
		switch (n.tag) {
			case 0:
			case 11:
			case 15:
				ku(e, n), r & 4 && hl(5, n);
				break;
			case 1:
				if (ku(e, n), r & 4) {
					if (e = n.stateNode, t === null) try {
						e.componentDidMount();
					} catch (e) {
						ff(n, n.return, e);
					}
					else {
						var i = hc(n.type, t.memoizedProps);
						t = t.memoizedState;
						try {
							e.componentDidUpdate(i, t, e.__reactInternalSnapshotBeforeUpdate);
						} catch (e) {
							ff(n, n.return, e);
						}
					}
				}
				r & 64 && _l(n), r & 512 && yl(n, n.return);
				break;
			case 3:
				if (ku(e, n), r & 64 && (e = n.updateQueue, e !== null)) {
					if (t = null, n.child !== null) switch (n.child.tag) {
						case 27:
						case 5:
							t = n.child.stateNode;
							break;
						case 1: t = n.child.stateNode;
					}
					try {
						go(e, t);
					} catch (e) {
						ff(n, n.return, e);
					}
				}
				break;
			case 27: t === null && r & 4 && jl(n);
			case 26:
			case 5:
				ku(e, n), t === null && r & 4 && Tl(n), r & 512 && yl(n, n.return);
				break;
			case 12:
				ku(e, n);
				break;
			case 31:
				ku(e, n), r & 4 && vu(e, n);
				break;
			case 13:
				ku(e, n), r & 4 && yu(e, n), r & 64 && (e = n.memoizedState, e !== null && (e = e.dehydrated, e !== null && (n = gf.bind(null, n), lm(e, n))));
				break;
			case 22:
				if (r = n.memoizedState !== null || Zl, !r) {
					var a = t !== null && t.memoizedState !== null || Ql;
					t = Zl, i = Ql, Zl = r, (Ql = a) && !i ? (r = 2, n.subtreeFlags & 8772 && (r |= 1), ju(e, n, r)) : ku(e, n), Zl = t, Ql = i;
				}
				break;
			case 30:
				ku(e, n), r & 512 && yl(n, n.return);
				break;
			case 7: r & 512 && yl(n, n.return);
			default: ku(e, n);
		}
	}
	function uu(e, t) {
		for (e = e.child; e !== null;) du(e, t), e = e.sibling;
	}
	function du(e, t) {
		switch (e.tag) {
			case 5:
			case 26:
				try {
					var n = e.stateNode;
					if (t) {
						var r = n.style;
						typeof r.setProperty == "function" ? r.setProperty("display", "none", "important") : r.display = "none";
					} else {
						var i = e.stateNode, a = e.memoizedProps.style, o = a != null && a.hasOwnProperty("display") ? a.display : null;
						i.style.display = o == null || typeof o == "boolean" ? "" : ("" + o).trim();
					}
				} catch (t) {
					ff(e, e.return, t);
				}
				fu(e, t);
				break;
			case 6:
				try {
					e.stateNode.nodeValue = t ? "" : e.memoizedProps, It = !0;
				} catch (t) {
					ff(e, e.return, t);
				}
				break;
			case 18:
				try {
					var s = e.stateNode;
					t ? Tp(s, !0) : Tp(e.stateNode, !1);
				} catch (t) {
					ff(e, e.return, t);
				}
				break;
			case 22:
			case 23:
				e.memoizedState === null && uu(e, t);
				break;
			default: uu(e, t);
		}
	}
	function fu(e, t) {
		if (e.subtreeFlags & 67108864) for (e = e.child; e !== null;) {
			a: {
				var n = e, r = t;
				switch (n.tag) {
					case 4:
						du(n, r);
						break a;
					case 22:
						n.memoizedState === null && fu(n, r);
						break a;
					default: fu(n, r);
				}
			}
			e = e.sibling;
		}
	}
	function pu(e) {
		var t = e.alternate;
		t !== null && (e.alternate = null, pu(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && xt(t)), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
	}
	var mu = null, hu = !1;
	function gu(e, t, n) {
		for (n = n.child; n !== null;) _u(e, t, n), n = n.sibling;
	}
	function _u(e, t, n) {
		if (Be && typeof Be.onCommitFiberUnmount == "function") try {
			Be.onCommitFiberUnmount(ze, n);
		} catch {}
		switch (n.tag) {
			case 26:
				Ql || bl(n, t), gu(e, t, n), n.memoizedState ? n.memoizedState.count-- : n.stateNode && !Ql && (n = n.stateNode, n.parentNode.removeChild(n));
				break;
			case 27:
				Ql || bl(n, t), Z(n);
				var r = mu, i = hu;
				Cp(n.type) && (mu = n.stateNode, hu = !1), gu(e, t, n), _m(n.stateNode, n.type, n.memoizedProps), mu = r, hu = i;
				break;
			case 5: Ql || bl(n, t), Z(n);
			case 6:
				if (n.tag === 6 && Z(n), r = mu, i = hu, mu = null, gu(e, t, n), mu = r, hu = i, mu !== null) {
					if (hu) try {
						(mu.nodeType === 9 ? mu.body : mu.nodeName === "HTML" ? mu.ownerDocument.body : mu).removeChild(n.stateNode), It = !0;
					} catch (e) {
						ff(n, t, e);
					}
					else try {
						mu.removeChild(n.stateNode), It = !0;
					} catch (e) {
						ff(n, t, e);
					}
				}
				break;
			case 18:
				mu !== null && (hu ? (e = mu, wp(e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e, n.stateNode), Uh(e)) : wp(mu, n.stateNode));
				break;
			case 4:
				r = mu, i = hu, mu = n.stateNode.containerInfo, hu = !0, gu(e, t, n), mu = r, hu = i;
				break;
			case 0:
			case 11:
			case 14:
			case 15:
				gl(2, n, t), Ql || gl(4, n, t), gu(e, t, n);
				break;
			case 1:
				Ql || (bl(n, t), r = n.stateNode, typeof r.componentWillUnmount == "function" && vl(n, t, r)), gu(e, t, n);
				break;
			case 21:
				gu(e, t, n);
				break;
			case 22:
				Ql = (r = Ql) || n.memoizedState !== null, gu(e, t, n), Ql = r;
				break;
			case 30:
				bl(n, t), gu(e, t, n);
				break;
			case 7:
				Ql || bl(n, t), gu(e, t, n);
				break;
			default: gu(e, t, n);
		}
	}
	function vu(e, t) {
		if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null))) {
			e = e.dehydrated;
			try {
				Uh(e);
			} catch (e) {
				ff(t, t.return, e);
			}
		}
	}
	function yu(e, t) {
		if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null && (e = e.dehydrated, e !== null)))) try {
			Uh(e);
		} catch (e) {
			ff(t, t.return, e);
		}
	}
	function bu(e) {
		switch (e.tag) {
			case 31:
			case 13:
			case 19:
				var t = e.stateNode;
				return t === null && (t = e.stateNode = new tu()), t;
			case 22: return e = e.stateNode, t = e._retryCache, t === null && (t = e._retryCache = new tu()), t;
			default: throw Error(i(435, e.tag));
		}
	}
	function xu(e, t) {
		var n = bu(e);
		t.forEach(function(t) {
			if (!n.has(t)) {
				n.add(t);
				var r = _f.bind(null, e, t);
				t.then(r, r);
			}
		});
	}
	function Su(e, t, n) {
		var r = t.deletions;
		if (r !== null) for (var a = 0; a < r.length; a++) {
			var o = r[a], s = e, c = t, l = c;
			a: for (; l !== null;) {
				switch (l.tag) {
					case 27:
						if (Cp(l.type)) {
							mu = l.stateNode, hu = !1;
							break a;
						}
						break;
					case 5:
						mu = l.stateNode, hu = !1;
						break a;
					case 3:
					case 4:
						mu = l.stateNode.containerInfo, hu = !0;
						break a;
				}
				l = l.return;
			}
			if (mu === null) throw Error(i(160));
			_u(s, c, o), mu = null, hu = !1, s = o.alternate, s !== null && (s.return = null), o.return = null;
		}
		if (t.subtreeFlags & 13886) for (t = t.child; t !== null;) wu(t, e, n), t = t.sibling;
	}
	var Cu = null;
	function wu(e, t, n) {
		var r = e.alternate, a = e.flags;
		switch (e.tag) {
			case 0:
			case 11:
			case 14:
			case 15:
				if (a & 4 && (r = e.updateQueue, r = r === null ? null : r.events, r !== null)) for (var o = 0; o < r.length; o++) {
					var s = r[o];
					s.ref.impl = s.nextImpl;
				}
				Su(t, e, n), Tu(e), a & 4 && (gl(3, e, e.return), hl(3, e), gl(5, e, e.return));
				break;
			case 1:
				Su(t, e, n), Tu(e), a & 512 && (Ql || r === null || bl(r, r.return)), a & 64 && Zl && (e = e.updateQueue, e !== null && (t = e.callbacks, t !== null && (n = e.shared.hiddenCallbacks, e.shared.hiddenCallbacks = n === null ? t : n.concat(t))));
				break;
			case 26:
				if (o = Cu, Su(t, e, n), Tu(e), a & 512 && (Ql || r === null || bl(r, r.return)), a & 4) {
					if (a = r === null ? null : r.memoizedState, n = e.memoizedState, r === null) {
						if (n === null) {
							if (e.stateNode === null) {
								if (Zl) e.stateNode = pp(e.type, e.memoizedProps, t.containerInfo, e);
								else {
									a: {
										t = e.type, n = e.memoizedProps, a = o.ownerDocument || o;
										b: switch (t) {
											case "title":
												r = a.getElementsByTagName("title")[0], (!r || r[yt] || r[ft] || r.namespaceURI === "http://www.w3.org/2000/svg" || r.hasAttribute("itemprop")) && (r = a.createElement(t), a.head.insertBefore(r, a.querySelector("head > title"))), rp(r, t, n), r[ft] = e, Et(r), t = r;
												break a;
											case "link":
												if (o = Km("link", "href", a).get(t + (n.href || ""))) {
													for (s = 0; s < o.length; s++) if (r = o[s], r.getAttribute("href") === (n.href == null || n.href === "" ? null : n.href) && r.getAttribute("rel") === (n.rel == null ? null : n.rel) && r.getAttribute("title") === (n.title == null ? null : n.title) && r.getAttribute("crossorigin") === (n.crossOrigin == null ? null : n.crossOrigin)) {
														o.splice(s, 1);
														break b;
													}
												}
												r = a.createElement(t), rp(r, t, n), a.head.appendChild(r);
												break;
											case "meta":
												if (o = Km("meta", "content", a).get(t + (n.content || ""))) {
													for (s = 0; s < o.length; s++) if (r = o[s], r.getAttribute("content") === (n.content == null ? null : "" + n.content) && r.getAttribute("name") === (n.name == null ? null : n.name) && r.getAttribute("property") === (n.property == null ? null : n.property) && r.getAttribute("http-equiv") === (n.httpEquiv == null ? null : n.httpEquiv) && r.getAttribute("charset") === (n.charSet == null ? null : n.charSet)) {
														o.splice(s, 1);
														break b;
													}
												}
												r = a.createElement(t), rp(r, t, n), a.head.appendChild(r);
												break;
											default: throw Error(i(468, t));
										}
										r[ft] = e, Et(r), t = r;
									}
									e.stateNode = t;
								}
							} else Zl || qm(o, e.type, e.stateNode);
						} else e.stateNode = Vm(o, n, e.memoizedProps);
					} else a === n ? n === null && e.stateNode !== null && El(e, e.memoizedProps, r.memoizedProps) : (a === null ? (t = r.stateNode, t === null || Ql || t.parentNode.removeChild(t)) : a.count--, n === null ? Zl || qm(o, e.type, e.stateNode) : Vm(o, n, e.memoizedProps));
				}
				break;
			case 27:
				Su(t, e, n), Tu(e), a & 512 && (Ql || r === null || bl(r, r.return)), r !== null && a & 4 && El(e, e.memoizedProps, r.memoizedProps);
				break;
			case 5:
				if (o = $l, $l = !1, Su(t, e, n), $l = o, Tu(e), a & 512 && (Ql || r === null || bl(r, r.return)), e.flags & 32) {
					t = e.stateNode;
					try {
						en(t, ""), It = !0;
					} catch (t) {
						ff(e, e.return, t);
					}
				}
				a & 4 && e.stateNode != null && (t = e.memoizedProps, El(e, t, r === null ? t : r.memoizedProps)), a & 1024 && (eu = !0);
				break;
			case 6:
				if (Su(t, e, n), Tu(e), a & 4) {
					if (e.stateNode === null) throw Error(i(162));
					t = e.memoizedProps, n = e.stateNode;
					try {
						n.nodeValue = t, It = !0;
					} catch (t) {
						ff(e, e.return, t);
					}
				}
				break;
			case 3:
				if (It = !1, Gm = null, o = Cu, Cu = xm(t.containerInfo), Su(t, e, n), Cu = o, Tu(e), a & 4 && r !== null && r.memoizedState.isDehydrated) try {
					Uh(t.containerInfo);
				} catch (t) {
					ff(e, e.return, t);
				}
				eu && (eu = !1, Eu(e)), It = !1;
				break;
			case 4:
				a = $l, $l = Zl, r = Lt(), o = Cu, Cu = xm(e.stateNode.containerInfo), Su(t, e, n), Tu(e), Cu = o, It && iu && (au = !0), It = r, $l = a;
				break;
			case 12:
				Su(t, e, n), Tu(e);
				break;
			case 31:
				Su(t, e, n), Tu(e), a & 4 && (t = e.updateQueue, t !== null && (e.updateQueue = null, xu(e, t)));
				break;
			case 13:
				Su(t, e, n), Tu(e), e.child.flags & 8192 && e.memoizedState !== null != (r !== null && r.memoizedState !== null) && (fd = je()), a & 4 && (t = e.updateQueue, t !== null && (e.updateQueue = null, xu(e, t)));
				break;
			case 22:
				o = e.memoizedState !== null, s = r !== null && r.memoizedState !== null;
				var c = Zl, l = Ql, u = $l;
				Zl = c || o, $l = u || o, Ql = l || s, Su(t, e, n), Ql = l, $l = u, Zl = c, Tu(e), a & 8192 && (t = e.stateNode, t._visibility = o ? t._visibility & -2 : t._visibility | 1, !o || r === null || s || Zl || Ql || (t = s || Ql, n = Zl, r = Ql, Zl = o || Zl, Ql = t, Au(e, 2), Zl = n, Ql = r), !o && $l || uu(e, o)), a & 4 && (t = e.updateQueue, t !== null && (n = t.retryQueue, n !== null && (t.retryQueue = null, xu(e, n))));
				break;
			case 19:
				Su(t, e, n), Tu(e), a & 4 && (t = e.updateQueue, t !== null && (e.updateQueue = null, xu(e, t)));
				break;
			case 30:
				a & 512 && (Ql || r === null || bl(r, r.return)), a = Lt(), o = iu, s = (n & 335544064) === n, c = e.memoizedProps, iu = s && ui(c.default, c.update) !== "none", Su(t, e, n), Tu(e), s && r !== null && It && (e.flags |= 4), iu = o, It = a;
				break;
			case 21: break;
			case 7: a & 512 && (Ql || r === null || bl(r, r.return)), r && r.stateNode !== null && (r.stateNode._fragmentFiber = e);
			default: Su(t, e, n), Tu(e);
		}
	}
	function Tu(e) {
		var t = e.flags;
		if (t & 2) {
			try {
				for (var n, r = e.return; r !== null;) {
					if (Dl(r)) {
						n = r;
						break;
					}
					r = r.return;
				}
				r = null;
				for (var a = e.return; a !== null;) {
					if (wl(a)) {
						var o = a.stateNode;
						r === null ? r = [o] : r.push(o);
					}
					if (Cl(a)) break;
					a = a.return;
				}
				var s = r;
				if (n == null) throw Error(i(160));
				switch (n.tag) {
					case 27:
						var c = n.stateNode;
						Al(e, Ol(e), c, s);
						break;
					case 5:
						var l = n.stateNode;
						n.flags & 32 && (en(l, ""), n.flags &= -33), Al(e, Ol(e), l, s);
						break;
					case 3:
					case 4:
						var u = n.stateNode.containerInfo;
						kl(e, Ol(e), u, s);
						break;
					default: throw Error(i(161));
				}
			} catch (t) {
				ff(e, e.return, t);
			}
			e.flags &= -3;
		}
		t & 4096 && (e.flags &= -4097);
	}
	function Eu(e) {
		if (e.subtreeFlags & 1024) for (e = e.child; e !== null;) {
			var t = e;
			Eu(t), t.tag === 5 && t.flags & 1024 && (t = t.stateNode, _h = !0, t.reset(), _h = !1), e = e.sibling;
		}
	}
	function Du(e, t) {
		if (t.subtreeFlags & 9270) for (t = t.child; t !== null;) Ou(t, e), t = t.sibling;
		else Xl(t, !1);
	}
	function Ou(e, t) {
		var n = e.alternate;
		if (n === null) Hl(e, !1);
		else switch (e.tag) {
			case 3:
				if (ou = ru = !1, Il(), Du(t, e), !ru && !au) {
					if (e = Fl, e !== null) for (var r = 0; r < e.length; r += 3) {
						n = e[r];
						var i = e[r + 1];
						Dp(n, e[r + 2]), n = n.ownerDocument.documentElement, n !== null && n.animate({
							opacity: [0, 0],
							pointerEvents: ["none", "none"]
						}, {
							duration: 0,
							fill: "forwards",
							pseudoElement: "::view-transition-group(" + i + ")"
						});
					}
					e = t.containerInfo, e = e.nodeType === 9 ? e.documentElement : e.ownerDocument.documentElement, e !== null && e.style.viewTransitionName === "" && (e.style.viewTransitionName = "none", e.animate({
						opacity: [0, 0],
						pointerEvents: ["none", "none"]
					}, {
						duration: 0,
						fill: "forwards",
						pseudoElement: "::view-transition-group(root)"
					}), e.animate({
						width: [0, 0],
						height: [0, 0]
					}, {
						duration: 0,
						fill: "forwards",
						pseudoElement: "::view-transition"
					})), ou = !0;
				}
				Fl = null;
				break;
			case 5:
				Du(t, e);
				break;
			case 4:
				r = ru, ru = !1, Du(t, e), ru && (au = !0), ru = r;
				break;
			case 22:
				e.memoizedState === null && (n.memoizedState === null ? Du(t, e) : Hl(e, !1));
				break;
			case 30:
				r = ru, i = Il(), ru = !1, Du(t, e), ru && (e.flags |= 4);
				var a = e.memoizedProps, o = e.stateNode;
				t = ci(a, o), o = ci(n.memoizedProps, o);
				var s = ui(a.default, a.update);
				s === "none" ? t = !1 : (a = n.memoizedState, n.memoizedState = null, n = e.child, Ll = 0, t = Yl(e, n, t, o, s, a, !0), Ll !== (a === null ? 0 : a.length) && (e.flags |= 32)), e.flags & 4 && t ? (jd(e, e.memoizedProps.onUpdate), Fl = i) : i !== null && (i.push.apply(i, Fl), Fl = i), ru = e.flags & 32 ? !0 : r;
				break;
			default: Du(t, e);
		}
	}
	function ku(e, t) {
		if (t.subtreeFlags & 8772) for (t = t.child; t !== null;) lu(e, t.alternate, t), t = t.sibling;
	}
	function Au(e, t) {
		for (e = e.child; e !== null;) {
			var n = e, r = t;
			switch (n.tag) {
				case 0:
				case 11:
				case 14:
				case 15:
					gl(4, n, n.return), Au(n, r);
					break;
				case 1:
					bl(n, n.return);
					var i = n.stateNode;
					typeof i.componentWillUnmount == "function" && vl(n, n.return, i), Au(n, r);
					break;
				case 27: r & 2 && _m(n.stateNode, n.type, n.memoizedProps);
				case 5:
					bl(n, n.return), n.tag !== 5 && n.tag !== 27 || Z(n), Au(n, r);
					break;
				case 6:
					Z(n);
					break;
				case 26:
					bl(n, n.return), i = n.stateNode, n.memoizedState !== null || i === null || Ql || i.parentNode.removeChild(i), Au(n, r);
					break;
				case 22:
					n.memoizedState === null && Au(n, r);
					break;
				case 30:
					bl(n, n.return), Au(n, r);
					break;
				case 7: bl(n, n.return);
				default: Au(n, r);
			}
			e = e.sibling;
		}
	}
	function ju(e, t, n) {
		for (n = t.subtreeFlags & 8772 ? n : n & -2, t = t.child; t !== null;) {
			var r = t.alternate, i = e, a = t, o = a.flags, s = !!(n & 1);
			switch (a.tag) {
				case 0:
				case 11:
				case 15:
					ju(i, a, n), hl(4, a);
					break;
				case 1:
					if (ju(i, a, n), r = a, i = r.stateNode, typeof i.componentDidMount == "function") try {
						i.componentDidMount();
					} catch (e) {
						ff(r, r.return, e);
					}
					if (r = a, i = r.updateQueue, i !== null) {
						var c = r.stateNode;
						try {
							var l = i.shared.hiddenCallbacks;
							if (l !== null) for (i.shared.hiddenCallbacks = null, i = 0; i < l.length; i++) ho(l[i], c);
						} catch (e) {
							ff(r, r.return, e);
						}
					}
					s && o & 64 && _l(a), yl(a, a.return);
					break;
				case 27: n & 2 && jl(a);
				case 5:
					a.tag !== 5 && a.tag !== 27 || Sl(a), ju(i, a, n), s && r === null && o & 4 && Tl(a), yl(a, a.return);
					break;
				case 6:
					Sl(a);
					break;
				case 26:
					c = a.stateNode, a.memoizedState !== null || c === null || Zl || qm(xm(c.ownerDocument), a.type, c), ju(i, a, n), s && r === null && o & 4 && Tl(a), yl(a, a.return);
					break;
				case 12:
					ju(i, a, n);
					break;
				case 31:
					ju(i, a, n), s && o & 4 && vu(i, a);
					break;
				case 13:
					ju(i, a, n), s && o & 4 && yu(i, a);
					break;
				case 22:
					a.memoizedState === null && ju(i, a, n), yl(a, a.return);
					break;
				case 30:
					ju(i, a, n), yl(a, a.return);
					break;
				case 7: yl(a, a.return);
				default: ju(i, a, n);
			}
			t = t.sibling;
		}
	}
	function Mu(e, t) {
		var n = null;
		e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), e = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (e = t.memoizedState.cachePool.pool), e !== n && (e != null && e.refCount++, n != null && wa(n));
	}
	function Nu(e, t) {
		e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && wa(e));
	}
	function Pu(e, t, n, r) {
		var i = (n & 335544064) === n;
		if (t.subtreeFlags & (i ? 10262 : 10256)) for (t = t.child; t !== null;) Fu(e, t, n, r), t = t.sibling;
		else i && Jl(t);
	}
	function Fu(e, t, n, r) {
		var i = (n & 335544064) === n;
		i && t.alternate === null && t.return !== null && t.return.alternate !== null && ql(t);
		var a = t.flags;
		switch (t.tag) {
			case 0:
			case 11:
			case 15:
				Pu(e, t, n, r), a & 2048 && hl(9, t);
				break;
			case 1:
				Pu(e, t, n, r);
				break;
			case 3:
				Pu(e, t, n, r), i && ou && (e = e.containerInfo, e = e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e, e.style.viewTransitionName === "root" && (e.style.viewTransitionName = ""), e = e.ownerDocument.documentElement, e !== null && e.style.viewTransitionName === "none" && (e.style.viewTransitionName = "")), a & 2048 && (a = null, t.alternate !== null && (a = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== a && (t.refCount++, a != null && wa(a)));
				break;
			case 12:
				if (a & 2048) {
					Pu(e, t, n, r), a = t.stateNode;
					try {
						var o = t.memoizedProps, s = o.id, c = o.onPostCommit;
						typeof c == "function" && c(s, t.alternate === null ? "mount" : "update", a.passiveEffectDuration, -0);
					} catch (e) {
						ff(t, t.return, e);
					}
				} else Pu(e, t, n, r);
				break;
			case 31:
				Pu(e, t, n, r);
				break;
			case 13:
				Pu(e, t, n, r);
				break;
			case 23: break;
			case 22:
				o = t.stateNode, s = t.alternate, t.memoizedState === null ? (i && s !== null && s.memoizedState !== null && ql(t), o._visibility & 2 ? Pu(e, t, n, r) : (o._visibility |= 2, Iu(e, t, n, r, !!(t.subtreeFlags & 10256) || !1))) : (i && s !== null && s.memoizedState === null && ql(s), o._visibility & 2 ? Pu(e, t, n, r) : Lu(e, t)), a & 2048 && Mu(s, t);
				break;
			case 24:
				Pu(e, t, n, r), a & 2048 && Nu(t.alternate, t);
				break;
			case 30:
				i && (a = t.alternate, a !== null && (Bl(a.child, !0), Bl(t.child, !0))), Pu(e, t, n, r);
				break;
			default: Pu(e, t, n, r);
		}
	}
	function Iu(e, t, n, r, i) {
		for (i &&= !!(t.subtreeFlags & 10256) || !1, t = t.child; t !== null;) {
			var a = e, o = t, s = n, c = r, l = o.flags;
			switch (o.tag) {
				case 0:
				case 11:
				case 15:
					Iu(a, o, s, c, i), hl(8, o);
					break;
				case 23: break;
				case 22:
					var u = o.stateNode;
					o.memoizedState === null ? (u._visibility |= 2, Iu(a, o, s, c, i)) : u._visibility & 2 ? Iu(a, o, s, c, i) : Lu(a, o), i && l & 2048 && Mu(o.alternate, o);
					break;
				case 24:
					Iu(a, o, s, c, i), i && l & 2048 && Nu(o.alternate, o);
					break;
				default: Iu(a, o, s, c, i);
			}
			t = t.sibling;
		}
	}
	function Lu(e, t) {
		if (t.subtreeFlags & 10256) for (t = t.child; t !== null;) {
			var n = e, r = t, i = r.flags;
			switch (r.tag) {
				case 22:
					Lu(n, r), i & 2048 && Mu(r.alternate, r);
					break;
				case 24:
					Lu(n, r), i & 2048 && Nu(r.alternate, r);
					break;
				default: Lu(n, r);
			}
			t = t.sibling;
		}
	}
	var Ru = 8192;
	function zu(e, t, n) {
		if (e.subtreeFlags & Ru) for (e = e.child; e !== null;) Bu(e, t, n), e = e.sibling;
	}
	function Bu(e, t, n) {
		switch (e.tag) {
			case 26:
				zu(e, t, n), e.flags & Ru && (e.memoizedState === null ? (e = e.stateNode, (t & 335544128) === t && Qm(n, e)) : $m(n, Cu, e.memoizedState, e.memoizedProps));
				break;
			case 5:
				zu(e, t, n), e.flags & Ru && (e = e.stateNode, (t & 335544128) === t && Qm(n, e));
				break;
			case 3:
			case 4:
				var r = Cu;
				Cu = xm(e.stateNode.containerInfo), zu(e, t, n), Cu = r;
				break;
			case 22:
				e.memoizedState === null && (r = e.alternate, r !== null && r.memoizedState !== null ? (r = Ru, Ru = 16777216, zu(e, t, n), Ru = r) : zu(e, t, n));
				break;
			case 30:
				if ((e.flags & Ru) !== 0 && (r = e.memoizedProps.name, r != null && r !== "auto")) {
					var i = e.stateNode;
					i.paired = null, Nl === null && (Nl = /* @__PURE__ */ new Map()), Nl.set(r, i);
				}
				zu(e, t, n);
				break;
			default: zu(e, t, n);
		}
	}
	function Vu(e) {
		var t = e.alternate;
		if (t !== null && (e = t.child, e !== null)) {
			t.child = null;
			do
				t = e.sibling, e.sibling = null, e = t;
			while (e !== null);
		}
	}
	function Hu(e) {
		var t = e.deletions;
		if (e.flags & 16) {
			if (t !== null) for (var n = 0; n < t.length; n++) {
				var r = t[n];
				nu = r, Gu(r, e);
			}
			Vu(e);
		}
		if (e.subtreeFlags & 10256) for (e = e.child; e !== null;) Uu(e), e = e.sibling;
	}
	function Uu(e) {
		switch (e.tag) {
			case 0:
			case 11:
			case 15:
				Hu(e), e.flags & 2048 && gl(9, e, e.return);
				break;
			case 3:
				Hu(e);
				break;
			case 12:
				Hu(e);
				break;
			case 22:
				var t = e.stateNode;
				e.memoizedState !== null && t._visibility & 2 && (e.return === null || e.return.tag !== 13) ? (t._visibility &= -3, Wu(e)) : Hu(e);
				break;
			default: Hu(e);
		}
	}
	function Wu(e) {
		var t = e.deletions;
		if (e.flags & 16) {
			if (t !== null) for (var n = 0; n < t.length; n++) {
				var r = t[n];
				nu = r, Gu(r, e);
			}
			Vu(e);
		}
		for (e = e.child; e !== null;) {
			switch (t = e, t.tag) {
				case 0:
				case 11:
				case 15:
					gl(8, t, t.return), Wu(t);
					break;
				case 22:
					n = t.stateNode, n._visibility & 2 && (n._visibility &= -3, Wu(t));
					break;
				default: Wu(t);
			}
			e = e.sibling;
		}
	}
	function Gu(e, t) {
		for (; nu !== null;) {
			var n = nu;
			switch (n.tag) {
				case 0:
				case 11:
				case 15:
					gl(8, n, t);
					break;
				case 23:
				case 22:
					if (n.memoizedState !== null && n.memoizedState.cachePool !== null) {
						var r = n.memoizedState.cachePool.pool;
						r != null && r.refCount++;
					}
					break;
				case 24: wa(n.memoizedState.cache);
			}
			if (r = n.child, r !== null) r.return = n, nu = r;
			else a: for (n = e; nu !== null;) {
				r = nu;
				var i = r.sibling, a = r.return;
				if (pu(r), r === n) {
					nu = null;
					break a;
				}
				if (i !== null) {
					i.return = a, nu = i;
					break a;
				}
				nu = a;
			}
		}
	}
	var Ku = {
		getCacheForType: function(e) {
			var t = ga(Sa), n = t.data.get(e);
			return n === void 0 && (n = e(), t.data.set(e, n)), n;
		},
		cacheSignal: function() {
			return ga(Sa).controller.signal;
		}
	}, qu = typeof WeakMap == "function" ? WeakMap : Map, Q = 0, Ju = null, Yu = null, Xu = 0, Zu = 0, Qu = null, $u = !1, ed = !1, td = !1, nd = 0, rd = 0, id = 0, ad = 0, od = 0, sd = 0, cd = 0, ld = null, ud = null, dd = !1, fd = 0, pd = 0, md = Infinity, hd = null, gd = null, _d = 0, vd = null, yd = null, bd = 0, xd = 0, Sd = null, Cd = null, wd = null, Td = null, Ed = null, Dd = 0, Od = null;
	function kd() {
		return Q & 2 && Xu !== 0 ? Xu & -Xu : H.T === null ? lt() : Nf();
	}
	function Ad() {
		if (sd === 0) {
			if (!(Xu & 536870912) || Y) {
				var e = qe;
				qe <<= 1, !(qe & 3932160) && (qe = 262144), sd = e;
			} else sd = 536870912;
		}
		return e = So.current, e !== null && (e.flags |= 32), sd;
	}
	function jd(e, t) {
		if (t != null) {
			var n = e.stateNode, r = n.ref;
			r === null && (r = n.ref = Fp(ci(e.memoizedProps, n))), Td === null && (Td = []), Td.push(t.bind(null, r));
		}
	}
	function Md(e, t, n) {
		(e === Ju && (Zu === 2 || Zu === 9) || e.cancelPendingCommit !== null) && (zd(e, 0), Id(e, Xu, sd, !1)), nt(e, n), Q & 2 && e === Ju || (e === Ju && (!(Q & 2) && (ad |= n), rd === 4 && Id(e, Xu, sd, !1)), Tf(e));
	}
	function Nd(e, t, n) {
		if (Q & 6) throw Error(i(327));
		var r = !n && !(t & 127) && (t & e.expiredLanes) === 0 || Ze(e, t), a = r ? qd(e, t) : Gd(e, t, !0), o = r;
		do {
			if (a === 0) {
				ed && !r && Id(e, t, 0, !1);
				break;
			}
			if (n = e.current.alternate, o && !Fd(n)) a = Gd(e, t, !1), o = !1;
			else {
				if (a === 2) {
					if (o = t, e.errorRecoveryDisabledLanes & o) var s = 0;
					else s = e.pendingLanes & -536870913, s = s === 0 ? s & 536870912 ? 536870912 : 0 : s;
					if (s !== 0) {
						t = s;
						a: {
							var c = e;
							a = ld;
							var l = c.current.memoizedState.isDehydrated;
							if (l && (zd(c, s).flags |= 256), s = Gd(c, s, !1), s !== 2 && s !== 6) {
								if (td && !l) {
									c.errorRecoveryDisabledLanes |= o, ad |= o, a = 4;
									break a;
								}
								o = ud, ud = a, o !== null && (ud === null ? ud = o : ud.push.apply(ud, o));
							}
							a = s;
						}
						if (o = !1, a !== 2) continue;
					}
				}
				if (a === 1) {
					zd(e, 0), Id(e, t, 0, !0);
					break;
				}
				a: {
					switch (r = e, o = a, o) {
						case 0:
						case 1: throw Error(i(345));
						case 4: if ((t & 4194048) !== t && (t & 62914560) !== t) break;
						case 6:
							Id(r, t, sd, !$u);
							break a;
						case 2:
							ud = null;
							break;
						case 3:
						case 5: break;
						default: throw Error(i(329));
					}
					if ((t & 62914560) === t && (a = fd + 300 - je(), 10 < a)) {
						if (Id(r, t, sd, !$u), Xe(r, 0, !0) !== 0) break a;
						bd = t, r.timeoutHandle = _p(Pd.bind(null, r, n, ud, hd, dd, t, sd, ad, cd, $u, o, "Throttled", -0, 0), a);
						break a;
					}
					Pd(r, n, ud, hd, dd, t, sd, ad, cd, $u, o, null, -0, 0);
				}
				break;
			}
		} while (1);
		Tf(e);
	}
	function Pd(e, t, n, r, i, a, o, s, c, l, u, d, f, p) {
		e.timeoutHandle = -1;
		var m = t.subtreeFlags, h = (a & 335544064) === a;
		d = null, (h || m & 8192 || (m & 16785408) == 16785408) && (d = {
			stylesheets: null,
			count: 0,
			imgCount: 0,
			imgBytes: 0,
			suspenseyImages: [],
			waitingForImages: !0,
			waitingForViewTransition: !1,
			unsuspend: ln
		}, Nl = null, Bu(t, a, d), h && (m = d, h = e.containerInfo, h = (h.nodeType === 9 ? h : h.ownerDocument).__reactViewTransition, h != null && (m.count++, m.waitingForViewTransition = !0, m = rh.bind(m), h.finished.then(m, m))), m = (a & 62914560) === a ? fd - je() : (a & 4194048) === a ? pd - je() : 0, m = th(d, m), m !== null) ? (bd = a, e.cancelPendingCommit = m(ef.bind(null, e, t, a, n, r, i, o, s, c, l, u, d, null, f, p)), Id(e, a, o, !l)) : ef(e, t, a, n, r, i, o, s, c, l, u, d);
	}
	function Fd(e) {
		for (var t = e;;) {
			var n = t.tag;
			if ((n === 0 || n === 11 || n === 15) && t.flags & 16384 && (n = t.updateQueue, n !== null && (n = n.stores, n !== null))) for (var r = 0; r < n.length; r++) {
				var i = n[r], a = i.getSnapshot;
				i = i.value;
				try {
					if (!Mr(a(), i)) return !1;
				} catch {
					return !1;
				}
			}
			if (n = t.child, t.subtreeFlags & 16384 && n !== null) n.return = t, t = n;
			else {
				if (t === e) break;
				for (; t.sibling === null;) {
					if (t.return === null || t.return === e) return !0;
					t = t.return;
				}
				t.sibling.return = t.return, t = t.sibling;
			}
		}
		return !0;
	}
	function Id(e, t, n, r) {
		t = Qe(e, t), t &= ~od, t &= ~ad, e.suspendedLanes |= t, e.pingedLanes &= ~t, r && (e.warmLanes |= t), r = e.expirationTimes;
		for (var i = t; 0 < i;) {
			var a = 31 - He(i), o = 1 << a;
			r[a] = -1, i &= ~o;
		}
		n !== 0 && it(e, n, t);
	}
	function Ld() {
		return Q & 6 ? !0 : (Ef(0, !1), !1);
	}
	function Rd() {
		if (Yu !== null) {
			if (Zu === 0) var e = Yu.return;
			else e = Yu, ca = sa = null, Zo(e), Xa = null, Za = 0, e = Yu;
			for (; e !== null;) ml(e.alternate, e), e = e.return;
			Yu = null;
		}
	}
	function zd(e, t) {
		var n = e.timeoutHandle;
		return n !== -1 && (e.timeoutHandle = -1, vp(n)), n = e.cancelPendingCommit, n !== null && (e.cancelPendingCommit = null, n()), bd = 0, Rd(), Ju = e, Yu = n = Ti(e.current, null), Xu = t, Zu = 0, Qu = null, $u = !1, ed = Ze(e, t), td = !1, cd = sd = od = ad = id = rd = 0, ud = ld = null, dd = !1, nd = Qe(e, t), hi(), n;
	}
	function Bd(e, t) {
		X = null, H.H = sc, t === Ba || t === Ha ? (t = Ja(), Zu = 3) : t === Va ? (t = Ja(), Zu = 4) : Zu = t === Tc ? 8 : typeof t == "object" && t && typeof t.then == "function" ? 6 : 1, Qu = t, Yu === null && (rd = 1, yc(e, Ni(t, e.current)));
	}
	function Vd() {
		var e = So.current;
		return e === null ? !0 : (Xu & 4194048) === Xu ? Co === null : (Xu & 62914560) === Xu || Xu & 536870912 ? e === Co : !1;
	}
	function Hd() {
		var e = H.H;
		return H.H = sc, e === null ? sc : e;
	}
	function Ud() {
		var e = H.A;
		return H.A = Ku, e;
	}
	function Wd() {
		rd = 4, $u || (Xu & 4194048) !== Xu && So.current !== null || (ed = !0), !(id & 134217727) && !(ad & 134217727) || Ju === null || Id(Ju, Xu, sd, !1);
	}
	function Gd(e, t, n) {
		var r = Q;
		Q |= 2;
		var i = Hd(), a = Ud();
		(Ju !== e || Xu !== t) && (hd = null, zd(e, t)), t = !1;
		var o = rd;
		a: do
			try {
				if (Zu !== 0 && Yu !== null) {
					var s = Yu, c = Qu;
					switch (Zu) {
						case 8:
							Rd(), o = 6;
							break a;
						case 3:
						case 2:
						case 9:
						case 6:
							So.current === null && (t = !0);
							var l = Zu;
							if (Zu = 0, Qu = null, Zd(e, s, c, l), n && ed) {
								o = 0;
								break a;
							}
							break;
						default: l = Zu, Zu = 0, Qu = null, Zd(e, s, c, l);
					}
				}
				Kd(), o = rd;
				break;
			} catch (t) {
				Bd(e, t);
			}
		while (1);
		return t && e.shellSuspendCounter++, ca = sa = null, Q = r, H.H = i, H.A = a, Yu === null && (Ju = null, Xu = 0, hi()), o;
	}
	function Kd() {
		for (; Yu !== null;) Yd(Yu);
	}
	function qd(e, t) {
		var n = Q;
		Q |= 2;
		var r = Hd(), a = Ud();
		Ju !== e || Xu !== t ? (hd = null, md = je() + 500, zd(e, t)) : ed = Ze(e, t);
		a: do
			try {
				if (Zu !== 0 && Yu !== null) {
					t = Yu;
					var o = Qu;
					b: switch (Zu) {
						case 1:
							Zu = 0, Qu = null, Zd(e, t, o, 1);
							break;
						case 2:
						case 9:
							if (Wa(o)) {
								Zu = 0, Qu = null, Xd(t);
								break;
							}
							t = function() {
								Zu !== 2 && Zu !== 9 || Ju !== e || (Zu = 7), Tf(e);
							}, o.then(t, t);
							break a;
						case 3:
							Zu = 7;
							break a;
						case 4:
							Zu = 5;
							break a;
						case 7:
							Wa(o) ? (Zu = 0, Qu = null, Xd(t)) : (Zu = 0, Qu = null, Zd(e, t, o, 7));
							break;
						case 5:
							var s = null;
							switch (Yu.tag) {
								case 26: s = Yu.memoizedState;
								case 5:
								case 27:
									var c = Yu;
									if (s ? Xm(s) : c.stateNode.complete) {
										Zu = 0, Qu = null;
										var l = c.sibling;
										if (l !== null) Yu = l;
										else {
											var u = c.return;
											u === null ? Yu = null : (Yu = u, Qd(u));
										}
										break b;
									}
							}
							Zu = 0, Qu = null, Zd(e, t, o, 5);
							break;
						case 6:
							Zu = 0, Qu = null, Zd(e, t, o, 6);
							break;
						case 8:
							Rd(), rd = 6;
							break a;
						default: throw Error(i(462));
					}
				}
				Jd();
				break;
			} catch (t) {
				Bd(e, t);
			}
		while (1);
		return ca = sa = null, H.H = r, H.A = a, Q = n, Yu === null ? (Ju = null, Xu = 0, hi(), rd) : 0;
	}
	function Jd() {
		for (; Yu !== null && !ke();) Yd(Yu);
	}
	function Yd(e) {
		var t = al(e.alternate, e, nd);
		e.memoizedProps = e.pendingProps, t === null ? Qd(e) : Yu = t;
	}
	function Xd(e) {
		var t = e, n = t.alternate;
		switch (t.tag) {
			case 15:
			case 0:
				t = zc(n, t, t.pendingProps, t.type, void 0, Xu);
				break;
			case 11:
				t = zc(n, t, t.pendingProps, t.type.render, t.ref, Xu);
				break;
			case 5:
				Zo(t);
				var r = t;
				r === Ji && (Y ? (ta(r), r.tag === 5 && r.stateNode != null && (Yi = r.stateNode)) : (ta(r), Y = !0));
			default: ml(n, t), t = Yu = Ei(t, nd), t = al(n, t, nd);
		}
		e.memoizedProps = e.pendingProps, t === null ? Qd(e) : Yu = t;
	}
	function Zd(e, t, n, r) {
		ca = sa = null, Zo(t), Xa = null, Za = 0;
		var i = t.return;
		try {
			if (wc(e, i, t, n, Xu)) {
				rd = 1, yc(e, Ni(n, e.current)), Yu = null;
				return;
			}
		} catch (t) {
			if (i !== null) throw Yu = i, t;
			rd = 1, yc(e, Ni(n, e.current)), Yu = null;
			return;
		}
		t.flags & 32768 ? (Y || r === 1 ? e = !0 : ed || Xu & 536870912 ? e = !1 : ($u = e = !0, (r === 2 || r === 9 || r === 3 || r === 6) && (r = So.current, r !== null && r.tag === 13 && (r.flags |= 16384))), $d(t, e)) : Qd(t);
	}
	function Qd(e) {
		var t = e;
		do {
			if (t.flags & 32768) {
				$d(t, $u);
				return;
			}
			e = t.return;
			var n = fl(t.alternate, t, nd);
			if (n !== null) {
				Yu = n;
				return;
			}
			if (t = t.sibling, t !== null) {
				Yu = t;
				return;
			}
			Yu = t = e;
		} while (t !== null);
		rd === 0 && (rd = 5);
	}
	function $d(e, t) {
		do {
			var n = pl(e.alternate, e);
			if (n !== null) {
				n.flags &= 32767, Yu = n;
				return;
			}
			if (n = e.return, n !== null && (n.flags |= 32768, n.subtreeFlags = 0, n.deletions = null), !t && (e = e.sibling, e !== null)) {
				Yu = e;
				return;
			}
			Yu = e = n;
		} while (e !== null);
		rd = 6, Yu = null;
	}
	function ef(e, t, n, r, a, o, s, c, l, u, d, f) {
		e.cancelPendingCommit = null;
		do
			lf();
		while (_d !== 0);
		if (Q & 6) throw Error(i(327));
		if (t !== null) {
			if (t === e.current) throw Error(i(177));
			e === Ju && (Yu = Ju = null, Xu = 0), yd = t, vd = e, bd = n, Sd = a, Cd = r, tf(e, t, n, s, c, l, f);
		}
	}
	function tf(e, t, n, r, i, a, o) {
		var s = t.lanes | t.childLanes;
		if (xd = s, s |= mi, rt(e, n, s, r, i, a), Td = null, (n & 335544064) === n ? (Ed = Da(e), r = 10262) : (Ed = null, r = 10256), (t.subtreeFlags & r) !== 0 || (t.flags & r) !== 0 ? (e.callbackNode = null, e.callbackPriority = 0, vf(Fe, function() {
			return uf(), null;
		})) : (e.callbackNode = null, e.callbackPriority = 0), Ml = !1, r = !!(t.flags & 13878), t.subtreeFlags & 13878 || r) {
			r = H.T, H.T = null, i = U.p, U.p = 2, a = Q, Q |= 4;
			try {
				su(e, t, n);
			} finally {
				Q = a, U.p = i, H.T = r;
			}
		}
		_d = 1, Ml ? wd = Np(o, e.containerInfo, Ed, af, of, rf, sf, uf, nf, null, null) : (af(), of(), sf());
	}
	function nf(e) {
		if (_d !== 0) {
			var t = vd.onRecoverableError;
			t(e, { componentStack: null });
		}
	}
	function rf() {
		_d === 3 && (_d = 0, Ou(yd, vd), _d = 4);
	}
	function af() {
		if (_d === 1) {
			_d = 0;
			var e = vd, t = yd, n = bd, r = !!(t.flags & 13878);
			if (t.subtreeFlags & 13878 || r) {
				r = H.T, H.T = null;
				var i = U.p;
				U.p = 2;
				var a = Q;
				Q |= 4;
				try {
					iu = au = !1, wu(t, e, n), n = lp;
					var o = Rr(e.containerInfo), s = n.focusedElem, c = n.selectionRange;
					if (o !== s && s && s.ownerDocument && Lr(s.ownerDocument.documentElement, s)) {
						if (c !== null && zr(s)) {
							var l = c.start, u = c.end;
							if (u === void 0 && (u = l), "selectionStart" in s) s.selectionStart = l, s.selectionEnd = Math.min(u, s.value.length);
							else {
								var d = s.ownerDocument || document, f = d && d.defaultView || window;
								if (f.getSelection) {
									var p = f.getSelection(), m = s.textContent.length, h = Math.min(c.start, m), g = c.end === void 0 ? h : Math.min(c.end, m);
									!p.extend && h > g && (o = g, g = h, h = o);
									var _ = Ir(s, h), v = Ir(s, g);
									if (_ && v && (p.rangeCount !== 1 || p.anchorNode !== _.node || p.anchorOffset !== _.offset || p.focusNode !== v.node || p.focusOffset !== v.offset)) {
										var y = d.createRange();
										y.setStart(_.node, _.offset), p.removeAllRanges(), h > g ? (p.addRange(y), p.extend(v.node, v.offset)) : (y.setEnd(v.node, v.offset), p.addRange(y));
									}
								}
							}
						}
						for (d = [], p = s; p = p.parentNode;) p.nodeType === 1 && d.push({
							element: p,
							left: p.scrollLeft,
							top: p.scrollTop
						});
						for (typeof s.focus == "function" && s.focus(), s = 0; s < d.length; s++) {
							var b = d[s];
							b.element.scrollLeft = b.left, b.element.scrollTop = b.top;
						}
					}
					_h = !!cp, lp = cp = null;
				} finally {
					Q = a, U.p = i, H.T = r;
				}
			}
			e.current = t, _d = 2;
		}
	}
	function of() {
		if (_d === 2) {
			_d = 0;
			var e = vd, t = yd, n = !!(t.flags & 8772);
			if (t.subtreeFlags & 8772 || n) {
				n = H.T, H.T = null;
				var r = U.p;
				U.p = 2;
				var i = Q;
				Q |= 4;
				try {
					lu(e, t.alternate, t);
				} finally {
					Q = i, U.p = r, H.T = n;
				}
			}
			_d = 3;
		}
	}
	function sf() {
		if (_d === 4 || _d === 3) {
			_d = 0;
			var e = wd;
			wd = null, Ae();
			var t = vd, n = yd, r = bd, i = Cd, a = (r & 335544064) === r ? 10262 : 10256;
			if ((n.subtreeFlags & a) !== 0 || (n.flags & a) !== 0 ? _d = 5 : (_d = 0, yd = vd = null, cf(t, t.pendingLanes)), a = t.pendingLanes, a === 0 && (gd = null), ct(r), n = n.stateNode, Be && typeof Be.onCommitFiberRoot == "function") try {
				Be.onCommitFiberRoot(ze, n, void 0, (n.current.flags & 128) == 128);
			} catch {}
			if (i !== null) {
				n = H.T, a = U.p, U.p = 2, H.T = null;
				try {
					for (var o = t.onRecoverableError, s = 0; s < i.length; s++) {
						var c = i[s];
						o(c.value, { componentStack: c.stack });
					}
				} finally {
					H.T = n, U.p = a;
				}
			}
			if (i = Td, o = Ed, Ed = null, i !== null && (Td = null, o === null && (o = []), e !== null)) for (c = 0; c < i.length; c++) n = (0, i[c])(o), n !== void 0 && e.finished.finally(n);
			bd & 3 && lf(), Tf(t), a = t.pendingLanes, r & 261930 && a & 42 ? t === Od ? Dd++ : (Dd = 0, Od = t) : (Dd = 0, Od = null), Ef(0, !1);
		}
	}
	function cf(e, t) {
		(e.pooledCacheLanes &= t) === 0 && (t = e.pooledCache, t != null && (e.pooledCache = null, wa(t)));
	}
	function lf() {
		return wd !== null && (wd.skipTransition(), wd = null), af(), of(), sf(), uf();
	}
	function uf() {
		if (_d !== 5) return !1;
		var e = vd, t = xd;
		xd = 0;
		var n = ct(bd), r = H.T, a = U.p;
		try {
			U.p = 32 > n ? 32 : n, H.T = null, n = Sd, Sd = null;
			var o = vd, s = bd;
			if (_d = 0, yd = vd = null, bd = 0, Q & 6) throw Error(i(331));
			var c = Q;
			if (Q |= 4, Uu(o.current), Fu(o, o.current, s, n), Q = c, Ef(0, !1), Be && typeof Be.onPostCommitFiberRoot == "function") try {
				Be.onPostCommitFiberRoot(ze, o);
			} catch {}
			return !0;
		} finally {
			U.p = a, H.T = r, cf(e, t);
		}
	}
	function df(e, t, n) {
		t = Ni(n, t), t = xc(e.stateNode, t, 2), e = co(e, t, 2), e !== null && (nt(e, 2), Tf(e));
	}
	function ff(e, t, n) {
		if (e.tag === 3) df(e, e, n);
		else for (; t !== null;) {
			if (t.tag === 3) {
				df(t, e, n);
				break;
			}
			if (t.tag === 1) {
				var r = t.stateNode;
				if (typeof t.type.getDerivedStateFromError == "function" || typeof r.componentDidCatch == "function" && (gd === null || !gd.has(r))) {
					e = Ni(n, e), n = Sc(2), r = co(t, n, 2), r !== null && (Cc(n, r, t, e), nt(r, 2), Tf(r));
					break;
				}
			}
			t = t.return;
		}
	}
	function pf(e, t, n) {
		var r = e.pingCache;
		if (r === null) {
			r = e.pingCache = new qu();
			var i = /* @__PURE__ */ new Set();
			r.set(t, i);
		} else i = r.get(t), i === void 0 && (i = /* @__PURE__ */ new Set(), r.set(t, i));
		i.has(n) || (td = !0, i.add(n), e = mf.bind(null, e, t, n), t.then(e, e));
	}
	function mf(e, t, n) {
		var r = e.pingCache;
		r !== null && r.delete(t), e.pingedLanes |= e.suspendedLanes & n, e.warmLanes &= ~n, Ju === e && (Xu & n) === n && (rd === 4 || rd === 3 && (Xu & 62914560) === Xu && 300 > je() - fd ? Q & 2 ? od |= n : zd(e, 0) : od |= n, cd === Xu && (cd = 0)), Tf(e);
	}
	function hf(e, t) {
		t === 0 && (t = et()), e = vi(e, t), e !== null && (nt(e, t), Tf(e));
	}
	function gf(e) {
		var t = e.memoizedState, n = 0;
		t !== null && (n = t.retryLane), hf(e, n);
	}
	function _f(e, t) {
		var n = 0;
		switch (e.tag) {
			case 31:
			case 13:
				var r = e.stateNode, a = e.memoizedState;
				a !== null && (n = a.retryLane);
				break;
			case 19:
				r = e.stateNode;
				break;
			case 22:
				r = e.stateNode._retryCache;
				break;
			default: throw Error(i(314));
		}
		r !== null && r.delete(t), hf(e, n);
	}
	function vf(e, t) {
		return De(e, t);
	}
	var yf = null, bf = null, xf = !1, Sf = !1, Cf = !1, wf = 0;
	function Tf(e) {
		e !== bf && e.next === null && (bf === null ? yf = bf = e : bf = bf.next = e), Sf = !0, xf || (xf = !0, Mf());
	}
	function Ef(e, t) {
		if (!Cf && Sf) {
			Cf = !0;
			do
				for (var n = !1, r = yf; r !== null;) {
					if (!t) {
						if (e !== 0) {
							var i = r.pendingLanes;
							if (i === 0) var a = 0;
							else {
								var o = r.suspendedLanes, s = r.pingedLanes;
								a = (1 << 31 - He(42 | e) + 1) - 1, a &= i & ~(o & ~s), a = a & 201326741 ? a & 201326741 | 1 : a ? a | 2 : 0;
							}
							a !== 0 && (n = !0, jf(r, a));
						} else a = Xu, a = Xe(r, r === Ju ? a : 0, r.cancelPendingCommit !== null || r.timeoutHandle !== -1), !(a & 3) || Ze(r, a) || (n = !0, jf(r, a));
					}
					r = r.next;
				}
			while (n);
			Cf = !1;
		}
	}
	function Df() {
		Of();
	}
	function Of() {
		Sf = xf = !1;
		var e = 0;
		wf !== 0 && gp() && (e = wf);
		for (var t = je(), n = null, r = yf; r !== null;) {
			var i = r.next, a = kf(r, t);
			a === 0 ? (r.next = null, n === null ? yf = i : n.next = i, i === null && (bf = n)) : (n = r, (e !== 0 || a & 3) && (Sf = !0)), r = i;
		}
		_d !== 0 && _d !== 5 || Ef(e, !1), wf !== 0 && (wf = 0);
	}
	function kf(e, t) {
		for (var n = e.suspendedLanes, r = e.pingedLanes, i = e.expirationTimes, a = e.pendingLanes & -62914561; 0 < a;) {
			var o = 31 - He(a), s = 1 << o, c = i[o];
			c === -1 ? ((s & n) === 0 || (s & r) !== 0) && (i[o] = $e(s, t)) : c <= t && (e.expiredLanes |= s), a &= ~s;
		}
		if (t = Ju, n = Xu, n = Xe(e, e === t ? n : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1), r = e.callbackNode, n === 0 || e === t && (Zu === 2 || Zu === 9) || e.cancelPendingCommit !== null) return r !== null && r !== null && Oe(r), e.callbackNode = null, e.callbackPriority = 0;
		if (!(n & 3) || Ze(e, n)) {
			if (t = n & -n, t === e.callbackPriority) return t;
			switch (r !== null && Oe(r), ct(n)) {
				case 2:
				case 8:
					n = Pe;
					break;
				case 32:
					n = Fe;
					break;
				case 268435456:
					n = J;
					break;
				default: n = Fe;
			}
			return r = Af.bind(null, e), n = De(n, r), e.callbackPriority = t, e.callbackNode = n, t;
		}
		return r !== null && r !== null && Oe(r), e.callbackPriority = 2, e.callbackNode = null, 2;
	}
	function Af(e, t) {
		if (_d !== 0 && _d !== 5) return e.callbackNode = null, e.callbackPriority = 0, null;
		var n = e.callbackNode;
		if (lf() && e.callbackNode !== n) return null;
		var r = Xu;
		return r = Xe(e, e === Ju ? r : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1), r === 0 ? null : (Nd(e, r, t), kf(e, je()), e.callbackNode != null && e.callbackNode === n ? Af.bind(null, e) : null);
	}
	function jf(e, t) {
		if (lf()) return null;
		Nd(e, t, !0);
	}
	function Mf() {
		xp(function() {
			Q & 6 ? De(Ne, Df) : Of();
		});
	}
	function Nf() {
		if (wf === 0) {
			var e = Aa;
			e === 0 && (e = Ke, Ke <<= 1, !(Ke & 261888) && (Ke = 256)), wf = e;
		}
		return wf;
	}
	function Pf(e) {
		return e == null || typeof e == "symbol" || typeof e == "boolean" ? null : typeof e == "function" ? e : cn(e);
	}
	function Ff(e, t, n, r, i) {
		if (t === "submit" && n && n.stateNode === i) {
			var a = Pf((i[pt] || null).action), o = r.submitter;
			o && (t = (t = o[pt] || null) ? Pf(t.formAction) : o.getAttribute("formAction"), t !== null && (a = t, o = null));
			var s = new An("action", "action", null, r, i);
			e.push({
				event: s,
				listeners: [{
					instance: null,
					listener: function() {
						if (r.defaultPrevented) {
							if (wf !== 0) {
								var e = new FormData(i, o);
								qs(n, {
									pending: !0,
									data: e,
									method: i.method,
									action: a
								}, null, e);
							}
						} else typeof a == "function" && (s.preventDefault(), e = new FormData(i, o), qs(n, {
							pending: !0,
							data: e,
							method: i.method,
							action: a
						}, a, e));
					},
					currentTarget: i
				}]
			});
		}
	}
	for (var If = 0; If < ai.length; If++) {
		var Lf = ai[If];
		oi(Lf.toLowerCase(), "on" + (Lf[0].toUpperCase() + Lf.slice(1)));
	}
	oi(Zr, "onAnimationEnd"), oi(Qr, "onAnimationIteration"), oi($r, "onAnimationStart"), oi("dblclick", "onDoubleClick"), oi("focusin", "onFocus"), oi("focusout", "onBlur"), oi(ei, "onTransitionRun"), oi(ti, "onTransitionStart"), oi(ni, "onTransitionCancel"), oi(ri, "onTransitionEnd"), jt("onMouseEnter", ["mouseout", "mouseover"]), jt("onMouseLeave", ["mouseout", "mouseover"]), jt("onPointerEnter", ["pointerout", "pointerover"]), jt("onPointerLeave", ["pointerout", "pointerover"]), At("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), At("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), At("onBeforeInput", [
		"compositionend",
		"keypress",
		"textInput",
		"paste"
	]), At("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), At("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), At("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
	var Rf = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), zf = new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(Rf));
	function Bf(e, t) {
		t = !!(t & 4);
		for (var n = 0; n < e.length; n++) {
			var r = e[n], i = r.event;
			r = r.listeners;
			a: {
				var a = void 0;
				if (t) for (var o = r.length - 1; 0 <= o; o--) {
					var s = r[o], c = s.instance, l = s.currentTarget;
					if (s = s.listener, c !== a && i.isPropagationStopped()) break a;
					a = s, i.currentTarget = l;
					try {
						a(i);
					} catch (e) {
						di(e);
					}
					i.currentTarget = null, a = c;
				}
				else for (o = 0; o < r.length; o++) {
					if (s = r[o], c = s.instance, l = s.currentTarget, s = s.listener, c !== a && i.isPropagationStopped()) break a;
					a = s, i.currentTarget = l;
					try {
						a(i);
					} catch (e) {
						di(e);
					}
					i.currentTarget = null, a = c;
				}
			}
		}
	}
	function Vf(e, t) {
		var n = t[ht];
		n === void 0 && (n = t[ht] = /* @__PURE__ */ new Set());
		var r = e + "__bubble";
		n.has(r) || (Gf(t, e, 2, !1), n.add(r));
	}
	function Hf(e, t, n) {
		var r = 0;
		t && (r |= 4), Gf(n, e, r, t);
	}
	var Uf = "_reactListening" + Math.random().toString(36).slice(2);
	function Wf(e) {
		if (!e[Uf]) {
			e[Uf] = !0, Ot.forEach(function(t) {
				t !== "selectionchange" && (zf.has(t) || Hf(t, !1, e), Hf(t, !0, e));
			});
			var t = e.nodeType === 9 ? e : e.ownerDocument;
			t === null || t[Uf] || (t[Uf] = !0, Hf("selectionchange", !1, t));
		}
	}
	function Gf(e, t, n, r) {
		switch (wh(t)) {
			case 2:
				var i = vh;
				break;
			case 8:
				i = yh;
				break;
			default: i = bh;
		}
		n = i.bind(null, t, n, e), i = void 0, !yn || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (i = !0), r ? i === void 0 ? e.addEventListener(t, n, !0) : e.addEventListener(t, n, {
			capture: !0,
			passive: i
		}) : i === void 0 ? e.addEventListener(t, n, !1) : e.addEventListener(t, n, { passive: i });
	}
	function Kf(e, t, n, r, i) {
		var a = r;
		if (!(t & 1) && !(t & 2) && r !== null) a: for (;;) {
			if (r === null) return;
			var s = r.tag;
			if (s === 3 || s === 4) {
				var c = r.stateNode.containerInfo;
				if (c === i) break;
				if (s === 4) for (s = r.return; s !== null;) {
					var l = s.tag;
					if ((l === 3 || l === 4) && s.stateNode.containerInfo === i) return;
					s = s.return;
				}
				for (; c !== null;) {
					if (s = St(c), s === null) return;
					if (l = s.tag, l === 5 || l === 6 || l === 26 || l === 27) {
						r = a = s;
						continue a;
					}
					c = c.parentNode;
				}
			}
			r = r.return;
		}
		gn(function() {
			var r = a, i = dn(n), s = [];
			a: {
				var c = ii.get(e);
				if (c !== void 0) {
					var l = An, u = e;
					switch (e) {
						case "keypress": if (Tn(n) === 0) break a;
						case "keydown":
						case "keyup":
							l = Jn;
							break;
						case "focusin":
							u = "focus", l = zn;
							break;
						case "focusout":
							u = "blur", l = zn;
							break;
						case "beforeblur":
						case "afterblur":
							l = zn;
							break;
						case "click": if (n.button === 2) break a;
						case "auxclick":
						case "dblclick":
						case "mousedown":
						case "mousemove":
						case "mouseup":
						case "mouseout":
						case "mouseover":
						case "contextmenu":
							l = Ln;
							break;
						case "drag":
						case "dragend":
						case "dragenter":
						case "dragexit":
						case "dragleave":
						case "dragover":
						case "dragstart":
						case "drop":
							l = Rn;
							break;
						case "touchcancel":
						case "touchend":
						case "touchmove":
						case "touchstart":
							l = Zn;
							break;
						case Zr:
						case Qr:
						case $r:
							l = Bn;
							break;
						case ri:
							l = Qn;
							break;
						case "scroll":
						case "scrollend":
							l = Mn;
							break;
						case "wheel":
							l = $n;
							break;
						case "copy":
						case "cut":
						case "paste":
							l = Vn;
							break;
						case "gotpointercapture":
						case "lostpointercapture":
						case "pointercancel":
						case "pointerdown":
						case "pointermove":
						case "pointerout":
						case "pointerover":
						case "pointerup":
							l = Yn;
							break;
						case "submit":
							l = Xn;
							break;
						case "toggle":
						case "beforetoggle": l = er;
					}
					var d = !!(t & 4), f = !d && (e === "scroll" || e === "scrollend"), p = d ? c === null ? null : c + "Capture" : c;
					d = [];
					for (var m = r, h; m !== null;) {
						var g = m;
						if (h = g.stateNode, g = g.tag, g !== 5 && g !== 26 && g !== 27 || h === null || p === null || (g = _n(m, p), g != null && d.push(qf(m, g, h))), f) break;
						m = m.return;
					}
					0 < d.length && (c = new l(c, u, null, n, i), s.push({
						event: c,
						listeners: d
					}));
				}
			}
			if (!(t & 7)) {
				a: {
					if (l = e === "mouseover" || e === "pointerover", c = e === "mouseout" || e === "pointerout", l && n !== un && (u = n.relatedTarget || n.fromElement) && (St(u) || u[mt])) break a;
					(c || l) && (u = i.window === i ? i : (l = i.ownerDocument) ? l.defaultView || l.parentWindow : window, c ? (l = n.relatedTarget || n.toElement, c = r, l = l ? St(l) : null, l !== null && (f = o(l), d = l.tag, l !== f || d !== 5 && d !== 27 && d !== 6) && (l = null)) : (c = null, l = r), c !== l && (d = Ln, g = "onMouseLeave", p = "onMouseEnter", m = "mouse", (e === "pointerout" || e === "pointerover") && (d = Yn, g = "onPointerLeave", p = "onPointerEnter", m = "pointer"), f = c == null ? u : wt(c), h = l == null ? u : wt(l), u = new d(g, m + "leave", c, n, i), u.target = f, u.relatedTarget = h, g = null, St(i) === r && (d = new d(p, m + "enter", l, n, i), d.target = h, d.relatedTarget = f, g = d), f = g, d = c && l ? E(c, l, Yf) : null, c !== null && Xf(s, u, c, d, !1), l !== null && f !== null && Xf(s, f, l, d, !0)));
				}
				a: {
					if (c = r ? wt(r) : window, l = c.nodeName && c.nodeName.toLowerCase(), l === "select" || l === "input" && c.type === "file") var _ = br;
					else if (mr(c)) {
						if (xr) _ = Ar;
						else {
							_ = Or;
							var v = Dr;
						}
					} else l = c.nodeName, !l || l.toLowerCase() !== "input" || c.type !== "checkbox" && c.type !== "radio" ? r && an(r.elementType) && (_ = br) : _ = kr;
					if (_ &&= _(e, r)) {
						hr(s, _, n, i);
						break a;
					}
					v && v(e, c, r);
				}
				switch (v = r ? wt(r) : window, e) {
					case "focusin":
						(mr(v) || v.contentEditable === "true") && (Vr = v, Hr = r, Ur = null);
						break;
					case "focusout":
						Ur = Hr = Vr = null;
						break;
					case "mousedown":
						Wr = !0;
						break;
					case "contextmenu":
					case "mouseup":
					case "dragend":
						Wr = !1, Gr(s, n, i);
						break;
					case "selectionchange": if (Br) break;
					case "keydown":
					case "keyup": Gr(s, n, i);
				}
				var y;
				if (nr) b: {
					switch (e) {
						case "compositionstart":
							var b = "onCompositionStart";
							break b;
						case "compositionend":
							b = "onCompositionEnd";
							break b;
						case "compositionupdate":
							b = "onCompositionUpdate";
							break b;
					}
					b = void 0;
				}
				else ur ? cr(e, n) && (b = "onCompositionEnd") : e === "keydown" && n.keyCode === 229 && (b = "onCompositionStart");
				b && (ar && n.locale !== "ko" && (ur || b !== "onCompositionStart" ? b === "onCompositionEnd" && ur && (y = wn()) : (xn = i, Sn = "value" in xn ? xn.value : xn.textContent, ur = !0)), v = Jf(r, b), 0 < v.length && (b = new Hn(b, e, null, n, i), s.push({
					event: b,
					listeners: v
				}), y ? b.data = y : (y = lr(n), y !== null && (b.data = y)))), (y = ir ? dr(e, n) : fr(e, n)) && (b = Jf(r, "onBeforeInput"), 0 < b.length && (v = new Hn("onBeforeInput", "beforeinput", null, n, i), s.push({
					event: v,
					listeners: b
				}), v.data = y)), Ff(s, e, r, n, i);
			}
			Bf(s, t);
		});
	}
	function qf(e, t, n) {
		return {
			instance: e,
			listener: t,
			currentTarget: n
		};
	}
	function Jf(e, t) {
		for (var n = t + "Capture", r = []; e !== null;) {
			var i = e, a = i.stateNode;
			if (i = i.tag, i !== 5 && i !== 26 && i !== 27 || a === null || (i = _n(e, n), i != null && r.unshift(qf(e, i, a)), i = _n(e, t), i != null && r.push(qf(e, i, a))), e.tag === 3) return r;
			e = e.return;
		}
		return [];
	}
	function Yf(e) {
		if (e === null) return null;
		do
			e = e.return;
		while (e && e.tag !== 5 && e.tag !== 27);
		return e || null;
	}
	function Xf(e, t, n, r, i) {
		for (var a = t._reactName, o = []; n !== null && n !== r;) {
			var s = n, c = s.alternate, l = s.stateNode;
			if (s = s.tag, c !== null && c === r) break;
			s !== 5 && s !== 26 && s !== 27 || l === null || (c = l, i ? (l = _n(n, a), l != null && o.unshift(qf(n, l, c))) : i || (l = _n(n, a), l != null && o.push(qf(n, l, c)))), n = n.return;
		}
		o.length !== 0 && e.push({
			event: t,
			listeners: o
		});
	}
	var Zf = /\r\n?/g, Qf = /\u0000|\uFFFD/g;
	function $f(e) {
		return (typeof e == "string" ? e : "" + e).replace(Zf, "\n").replace(Qf, "");
	}
	function ep(e, t) {
		return t = $f(t), $f(e) === t;
	}
	function tp(e, t, n, r, a, o) {
		switch (n) {
			case "children":
				if (typeof r == "string") t === "body" || t === "textarea" && r === "" || en(e, r);
				else if (typeof r == "number" || typeof r == "bigint") t !== "body" && en(e, "" + r);
				else return;
				break;
			case "className":
				zt(e, "class", r);
				break;
			case "tabIndex":
				zt(e, "tabindex", r);
				break;
			case "dir":
			case "role":
			case "viewBox":
			case "width":
			case "height":
				zt(e, n, r);
				break;
			case "style":
				rn(e, r, o);
				return;
			case "data": if (t !== "object") {
				zt(e, "data", r);
				break;
			}
			case "src":
			case "href":
				if (r === "" && (t !== "a" || n !== "href") || r == null || typeof r == "function" || typeof r == "symbol" || typeof r == "boolean") {
					e.removeAttribute(n);
					break;
				}
				r = cn(r), e.setAttribute(n, r);
				break;
			case "action":
			case "formAction":
				if (typeof r == "function") {
					e.setAttribute(n, "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");
					break;
				}
				if (typeof o == "function" && (n === "formAction" ? (t !== "input" && tp(e, t, "name", a.name, a, null), tp(e, t, "formEncType", a.formEncType, a, null), tp(e, t, "formMethod", a.formMethod, a, null), tp(e, t, "formTarget", a.formTarget, a, null)) : (tp(e, t, "encType", a.encType, a, null), tp(e, t, "method", a.method, a, null), tp(e, t, "target", a.target, a, null))), r == null || typeof r == "symbol" || typeof r == "boolean") {
					e.removeAttribute(n);
					break;
				}
				r = cn(r), e.setAttribute(n, r);
				break;
			case "onClick":
				r != null && (e.onclick = ln);
				return;
			case "onScroll":
				r != null && Vf("scroll", e);
				return;
			case "onScrollEnd":
				r != null && Vf("scrollend", e);
				return;
			case "dangerouslySetInnerHTML":
				if (r != null) {
					if (typeof r != "object" || !("__html" in r)) throw Error(i(61));
					if (n = r.__html, n != null) {
						if (a.children != null) throw Error(i(60));
						o?.__html !== n && (e.innerHTML = n);
					}
				}
				break;
			case "multiple":
				e.multiple = r && typeof r != "function" && typeof r != "symbol";
				break;
			case "muted":
				e.muted = r && typeof r != "function" && typeof r != "symbol";
				break;
			case "suppressContentEditableWarning":
			case "suppressHydrationWarning":
			case "defaultValue":
			case "defaultChecked":
			case "innerHTML":
			case "ref": break;
			case "autoFocus": break;
			case "xlinkHref":
				if (r == null || typeof r == "function" || typeof r == "boolean" || typeof r == "symbol") {
					e.removeAttribute("xlink:href");
					break;
				}
				n = cn(r), e.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", n);
				break;
			case "contentEditable":
			case "spellCheck":
			case "draggable":
			case "value":
			case "autoReverse":
			case "externalResourcesRequired":
			case "focusable":
			case "preserveAlpha":
				r != null && typeof r != "function" && typeof r != "symbol" ? e.setAttribute(n, r) : e.removeAttribute(n);
				break;
			case "inert":
			case "allowFullScreen":
			case "async":
			case "autoPlay":
			case "controls":
			case "credentialless":
			case "default":
			case "defer":
			case "disabled":
			case "disablePictureInPicture":
			case "disableRemotePlayback":
			case "formNoValidate":
			case "hidden":
			case "loop":
			case "noModule":
			case "noValidate":
			case "open":
			case "playsInline":
			case "readOnly":
			case "required":
			case "reversed":
			case "scoped":
			case "seamless":
			case "itemScope":
				r && typeof r != "function" && typeof r != "symbol" ? e.setAttribute(n, "") : e.removeAttribute(n);
				break;
			case "capture":
			case "download":
				!0 === r ? e.setAttribute(n, "") : !1 !== r && r != null && typeof r != "function" && typeof r != "symbol" ? e.setAttribute(n, r) : e.removeAttribute(n);
				break;
			case "cols":
			case "rows":
			case "size":
			case "span":
				r != null && typeof r != "function" && typeof r != "symbol" && !isNaN(r) && 1 <= r ? e.setAttribute(n, r) : e.removeAttribute(n);
				break;
			case "rowSpan":
			case "start":
				r == null || typeof r == "function" || typeof r == "symbol" || isNaN(r) ? e.removeAttribute(n) : e.setAttribute(n, r);
				break;
			case "popover":
				Vf("beforetoggle", e), Vf("toggle", e), Rt(e, "popover", r);
				break;
			case "xlinkActuate":
				Bt(e, "http://www.w3.org/1999/xlink", "xlink:actuate", r);
				break;
			case "xlinkArcrole":
				Bt(e, "http://www.w3.org/1999/xlink", "xlink:arcrole", r);
				break;
			case "xlinkRole":
				Bt(e, "http://www.w3.org/1999/xlink", "xlink:role", r);
				break;
			case "xlinkShow":
				Bt(e, "http://www.w3.org/1999/xlink", "xlink:show", r);
				break;
			case "xlinkTitle":
				Bt(e, "http://www.w3.org/1999/xlink", "xlink:title", r);
				break;
			case "xlinkType":
				Bt(e, "http://www.w3.org/1999/xlink", "xlink:type", r);
				break;
			case "xmlBase":
				Bt(e, "http://www.w3.org/XML/1998/namespace", "xml:base", r);
				break;
			case "xmlLang":
				Bt(e, "http://www.w3.org/XML/1998/namespace", "xml:lang", r);
				break;
			case "xmlSpace":
				Bt(e, "http://www.w3.org/XML/1998/namespace", "xml:space", r);
				break;
			case "is":
				Rt(e, "is", r);
				break;
			case "innerText":
			case "textContent": return;
			default: if (!(2 < n.length) || n[0] !== "o" && n[0] !== "O" || n[1] !== "n" && n[1] !== "N") n = on.get(n) || n, Rt(e, n, r);
			else return;
		}
		It = !0;
	}
	function np(e, t, n, r, a, o) {
		switch (n) {
			case "style":
				rn(e, r, o);
				return;
			case "dangerouslySetInnerHTML":
				if (r != null) {
					if (typeof r != "object" || !("__html" in r)) throw Error(i(61));
					if (n = r.__html, n != null) {
						if (a.children != null) throw Error(i(60));
						o?.__html !== n && (e.innerHTML = n);
					}
				}
				break;
			case "children":
				if (typeof r == "string") en(e, r);
				else if (typeof r == "number" || typeof r == "bigint") en(e, "" + r);
				else return;
				break;
			case "onScroll":
				r != null && Vf("scroll", e);
				return;
			case "onScrollEnd":
				r != null && Vf("scrollend", e);
				return;
			case "onClick":
				r != null && (e.onclick = ln);
				return;
			case "suppressContentEditableWarning":
			case "suppressHydrationWarning":
			case "innerHTML":
			case "ref": return;
			case "innerText":
			case "textContent": return;
			default:
				if (!kt.hasOwnProperty(n)) a: {
					if (n[0] === "o" && n[1] === "n" && (a = n.endsWith("Capture"), o = n.slice(2, a ? n.length - 7 : void 0), t = e[pt] || null, t = t == null ? null : t[n], typeof t == "function" && e.removeEventListener(o, t, a), typeof r == "function")) {
						typeof t != "function" && t !== null && (n in e ? e[n] = null : e.hasAttribute(n) && e.removeAttribute(n)), e.addEventListener(o, r, a);
						break a;
					}
					It = !0, n in e ? e[n] = r : !0 === r ? e.setAttribute(n, "") : Rt(e, n, r);
				}
				return;
		}
		It = !0;
	}
	function rp(e, t, n) {
		switch (t) {
			case "div":
			case "span":
			case "svg":
			case "path":
			case "a":
			case "g":
			case "p":
			case "li": break;
			case "img":
				Vf("error", e), Vf("load", e);
				var r = !1, a = !1, o;
				for (o in n) if (n.hasOwnProperty(o)) {
					var s = n[o];
					if (s != null) switch (o) {
						case "src":
							r = !0;
							break;
						case "srcSet":
							a = !0;
							break;
						case "children":
						case "dangerouslySetInnerHTML": throw Error(i(137, t));
						default: tp(e, t, o, s, n, null);
					}
				}
				a && tp(e, t, "srcSet", n.srcSet, n, null), r && tp(e, t, "src", n.src, n, null);
				return;
			case "input":
				Vf("invalid", e);
				var c = o = s = a = null, l = null, u = null;
				for (r in n) if (n.hasOwnProperty(r)) {
					var d = n[r];
					if (d != null) switch (r) {
						case "name":
							a = d;
							break;
						case "type":
							s = d;
							break;
						case "checked":
							l = d;
							break;
						case "defaultChecked":
							u = d;
							break;
						case "value":
							o = d;
							break;
						case "defaultValue":
							c = d;
							break;
						case "children":
						case "dangerouslySetInnerHTML":
							if (d != null) throw Error(i(137, t));
							break;
						default: tp(e, t, r, d, n, null);
					}
				}
				Yt(e, o, c, l, u, s, a, !1);
				return;
			case "select":
				for (a in Vf("invalid", e), r = s = o = null, n) if (n.hasOwnProperty(a) && (c = n[a], c != null)) switch (a) {
					case "value":
						o = c;
						break;
					case "defaultValue":
						s = c;
						break;
					case "multiple": r = c;
					default: tp(e, t, a, c, n, null);
				}
				t = o, n = s, e.multiple = !!r, t == null ? n != null && Zt(e, !!r, n, !0) : Zt(e, !!r, t, !1);
				return;
			case "textarea":
				for (s in Vf("invalid", e), o = a = r = null, n) if (n.hasOwnProperty(s) && (c = n[s], c != null)) switch (s) {
					case "value":
						r = c;
						break;
					case "defaultValue":
						a = c;
						break;
					case "children":
						o = c;
						break;
					case "dangerouslySetInnerHTML":
						if (c != null) throw Error(i(91));
						break;
					default: tp(e, t, s, c, n, null);
				}
				$t(e, r, a, o);
				return;
			case "option":
				for (l in n) if (n.hasOwnProperty(l) && (r = n[l], r != null)) switch (l) {
					case "selected":
						e.selected = r && typeof r != "function" && typeof r != "symbol";
						break;
					default: tp(e, t, l, r, n, null);
				}
				return;
			case "dialog":
				Vf("beforetoggle", e), Vf("toggle", e), Vf("cancel", e), Vf("close", e);
				break;
			case "iframe":
			case "object":
				Vf("load", e);
				break;
			case "video":
			case "audio":
				for (r = 0; r < Rf.length; r++) Vf(Rf[r], e);
				break;
			case "image":
				Vf("error", e), Vf("load", e);
				break;
			case "details":
				Vf("toggle", e);
				break;
			case "embed":
			case "source":
			case "link": Vf("error", e), Vf("load", e);
			case "area":
			case "base":
			case "br":
			case "col":
			case "hr":
			case "keygen":
			case "meta":
			case "param":
			case "track":
			case "wbr":
			case "menuitem":
				for (u in n) if (n.hasOwnProperty(u) && (r = n[u], r != null)) switch (u) {
					case "children":
					case "dangerouslySetInnerHTML": throw Error(i(137, t));
					default: tp(e, t, u, r, n, null);
				}
				return;
			default: if (an(t)) {
				for (d in n) n.hasOwnProperty(d) && (r = n[d], r !== void 0 && np(e, t, d, r, n, void 0));
				return;
			}
		}
		for (c in n) n.hasOwnProperty(c) && (r = n[c], r != null && tp(e, t, c, r, n, null));
	}
	var ip = {};
	function ap(e, t, n, r) {
		switch (t) {
			case "div":
			case "span":
			case "svg":
			case "path":
			case "a":
			case "g":
			case "p":
			case "li": break;
			case "input":
				var a = null, o = null, s = null, c = null, l = null, u = null, d = null;
				for (m in n) {
					var f = n[m];
					if (n.hasOwnProperty(m) && f != null) switch (m) {
						case "checked": break;
						case "value": break;
						case "defaultValue": l = f;
						default: r.hasOwnProperty(m) || tp(e, t, m, null, r, f);
					}
				}
				for (var p in r) {
					var m = r[p];
					if (f = n[p], r.hasOwnProperty(p) && (m != null || f != null)) switch (p) {
						case "type":
							m !== f && (It = !0), o = m;
							break;
						case "name":
							m !== f && (It = !0), a = m;
							break;
						case "checked":
							m !== f && (It = !0), u = m;
							break;
						case "defaultChecked":
							m !== f && (It = !0), d = m;
							break;
						case "value":
							m !== f && (It = !0), s = m;
							break;
						case "defaultValue":
							m !== f && (It = !0), c = m;
							break;
						case "children":
						case "dangerouslySetInnerHTML":
							if (m != null) throw Error(i(137, t));
							break;
						default: m !== f && tp(e, t, p, m, r, f);
					}
				}
				Jt(e, s, c, l, u, d, o, a);
				return;
			case "select":
				for (o in m = s = c = p = null, n) if (l = n[o], n.hasOwnProperty(o) && l != null) switch (o) {
					case "value": break;
					case "multiple": m = l;
					default: r.hasOwnProperty(o) || tp(e, t, o, null, r, l);
				}
				for (a in r) if (o = r[a], l = n[a], r.hasOwnProperty(a) && (o != null || l != null)) switch (a) {
					case "value":
						o !== l && (It = !0), p = o;
						break;
					case "defaultValue":
						o !== l && (It = !0), c = o;
						break;
					case "multiple": o !== l && (It = !0), s = o;
					default: o !== l && tp(e, t, a, o, r, l);
				}
				t = c, n = s, r = m, p == null ? !!r != !!n && (t == null ? Zt(e, !!n, n ? [] : "", !1) : Zt(e, !!n, t, !0)) : Zt(e, !!n, p, !1);
				return;
			case "textarea":
				for (c in m = p = null, n) if (a = n[c], n.hasOwnProperty(c) && a != null && !r.hasOwnProperty(c)) switch (c) {
					case "value": break;
					case "children": break;
					default: tp(e, t, c, null, r, a);
				}
				for (s in r) if (a = r[s], o = n[s], r.hasOwnProperty(s) && (a != null || o != null)) switch (s) {
					case "value":
						a !== o && (It = !0), p = a;
						break;
					case "defaultValue":
						a !== o && (It = !0), m = a;
						break;
					case "children": break;
					case "dangerouslySetInnerHTML":
						if (a != null) throw Error(i(91));
						break;
					default: a !== o && tp(e, t, s, a, r, o);
				}
				Qt(e, p, m);
				return;
			case "option":
				for (var h in n) if (p = n[h], n.hasOwnProperty(h) && p != null && !r.hasOwnProperty(h)) switch (h) {
					case "selected":
						e.selected = !1;
						break;
					default: tp(e, t, h, null, r, p);
				}
				for (l in r) if (p = r[l], m = n[l], r.hasOwnProperty(l) && p !== m && (p != null || m != null)) switch (l) {
					case "selected":
						p !== m && (It = !0), e.selected = p && typeof p != "function" && typeof p != "symbol";
						break;
					default: tp(e, t, l, p, r, m);
				}
				return;
			case "img":
			case "link":
			case "area":
			case "base":
			case "br":
			case "col":
			case "embed":
			case "hr":
			case "keygen":
			case "meta":
			case "param":
			case "source":
			case "track":
			case "wbr":
			case "menuitem":
				for (var g in n) p = n[g], n.hasOwnProperty(g) && p != null && !r.hasOwnProperty(g) && tp(e, t, g, null, r, p);
				for (u in r) if (p = r[u], m = n[u], r.hasOwnProperty(u) && p !== m && (p != null || m != null)) switch (u) {
					case "children":
					case "dangerouslySetInnerHTML":
						if (p != null) throw Error(i(137, t));
						break;
					default: tp(e, t, u, p, r, m);
				}
				return;
			default: if (an(t)) {
				for (var _ in n) p = n[_], n.hasOwnProperty(_) && p !== void 0 && !r.hasOwnProperty(_) && np(e, t, _, void 0, r, p);
				for (d in r) p = r[d], m = n[d], !r.hasOwnProperty(d) || p === m || p === void 0 && m === void 0 || np(e, t, d, p, r, m);
				return;
			}
		}
		for (var v in n) p = n[v], n.hasOwnProperty(v) && p != null && !r.hasOwnProperty(v) && tp(e, t, v, null, r, p);
		for (f in r) p = r[f], m = n[f], !r.hasOwnProperty(f) || p === m || p == null && m == null || tp(e, t, f, p, r, m);
	}
	function op(e) {
		switch (e) {
			case "css":
			case "script":
			case "font":
			case "img":
			case "image":
			case "input":
			case "link": return !0;
			default: return !1;
		}
	}
	function sp() {
		if (typeof performance.getEntriesByType == "function") {
			for (var e = 0, t = 0, n = performance.getEntriesByType("resource"), r = 0; r < n.length; r++) {
				var i = n[r], a = i.transferSize, o = i.initiatorType, s = i.duration;
				if (a && s && op(o)) {
					for (o = 0, s = i.responseEnd, r += 1; r < n.length; r++) {
						var c = n[r], l = c.startTime;
						if (l > s) break;
						var u = c.transferSize, d = c.initiatorType;
						u && op(d) && (c = c.responseEnd, o += u * (c < s ? 1 : (s - l) / (c - l)));
					}
					if (--r, t += 8 * (a + o) / (i.duration / 1e3), e++, 10 < e) break;
				}
			}
			if (0 < e) return t / e / 1e6;
		}
		return navigator.connection && (e = navigator.connection.downlink, typeof e == "number") ? e : 5;
	}
	var cp = null, lp = null;
	function up(e) {
		return e.nodeType === 9 ? e : e.ownerDocument;
	}
	function dp(e) {
		switch (e) {
			case "http://www.w3.org/2000/svg": return 1;
			case "http://www.w3.org/1998/Math/MathML": return 2;
			default: return 0;
		}
	}
	function fp(e, t) {
		if (e === 0) switch (t) {
			case "svg": return 1;
			case "math": return 2;
			default: return 0;
		}
		return e === 1 && t === "foreignObject" ? 0 : e;
	}
	function pp(e, t, n, r) {
		return n = up(n).createElement(e), n[ft] = r, n[pt] = t, rp(n, e, t), Et(n), n;
	}
	function mp(e, t) {
		return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.children == "bigint" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
	}
	var hp = null;
	function gp() {
		var e = window.event;
		return e && e.type === "popstate" ? e !== hp && (hp = e, !0) : (hp = null, !1);
	}
	var _p = typeof setTimeout == "function" ? setTimeout : void 0, vp = typeof clearTimeout == "function" ? clearTimeout : void 0, yp = typeof Promise == "function" ? Promise : void 0, bp = typeof requestAnimationFrame == "function" ? requestAnimationFrame : _p, xp = typeof queueMicrotask == "function" ? queueMicrotask : yp === void 0 ? _p : function(e) {
		return yp.resolve(null).then(e).catch(Sp);
	};
	function Sp(e) {
		setTimeout(function() {
			throw e;
		});
	}
	function Cp(e) {
		return e === "head";
	}
	function wp(e, t) {
		var n = t, r = 0;
		do {
			var i = n.nextSibling;
			if (e.removeChild(n), i && i.nodeType === 8) {
				if (n = i.data, n === "/$" || n === "/&") {
					if (r === 0) {
						e.removeChild(i), Uh(t);
						return;
					}
					r--;
				} else if (n === "$" || n === "$?" || n === "$~" || n === "$!" || n === "&") r++;
				else if (n === "html") vm(e.ownerDocument.documentElement);
				else if (n === "head") {
					n = e.ownerDocument.head, vm(n);
					for (var a = n.firstChild; a;) {
						var o = a.nextSibling, s = a.nodeName;
						a[yt] || s === "SCRIPT" || s === "STYLE" || s === "LINK" && a.rel.toLowerCase() === "stylesheet" || n.removeChild(a), a = o;
					}
				} else n === "body" && vm(e.ownerDocument.body);
			}
			n = i;
		} while (n);
		Uh(t);
	}
	function Tp(e, t) {
		var n = e;
		e = 0;
		do {
			var r = n.nextSibling;
			if (n.nodeType === 1 ? t ? (n._stashedDisplay = n.style.display, n.style.display = "none") : (n.style.display = n._stashedDisplay || "", n.getAttribute("style") === "" && n.removeAttribute("style")) : n.nodeType === 3 && (t ? (n._stashedText = n.nodeValue, n.nodeValue = "") : n.nodeValue = n._stashedText || ""), r && r.nodeType === 8) {
				if (n = r.data, n === "/$") {
					if (e === 0) break;
					e--;
				} else n !== "$" && n !== "$?" && n !== "$~" && n !== "$!" || e++;
			}
			n = r;
		} while (n);
	}
	function Ep(e, t, n) {
		if (t = CSS.escape(t) === t ? t : "r-" + btoa(t).replace(/=/g, ""), e.style.viewTransitionName = t, n != null && (e.style.viewTransitionClass = n), n = getComputedStyle(e), n.display === "inline") {
			if (t = e.getClientRects(), t.length === 1) var r = 1;
			else for (var i = r = 0; i < t.length; i++) {
				var a = t[i];
				0 < a.width && 0 < a.height && r++;
			}
			r === 1 && (e = e.style, e.display = t.length === 1 ? "inline-block" : "block", e.marginTop = "-" + n.paddingTop, e.marginBottom = "-" + n.paddingBottom);
		}
	}
	function Dp(e, t) {
		e = e.style, t = t.style;
		var n = t == null ? null : t.hasOwnProperty("viewTransitionName") ? t.viewTransitionName : t.hasOwnProperty("view-transition-name") ? t["view-transition-name"] : null;
		e.viewTransitionName = n == null || typeof n == "boolean" ? "" : ("" + n).trim(), n = t == null ? null : t.hasOwnProperty("viewTransitionClass") ? t.viewTransitionClass : t.hasOwnProperty("view-transition-class") ? t["view-transition-class"] : null, e.viewTransitionClass = n == null || typeof n == "boolean" ? "" : ("" + n).trim(), e.display === "inline-block" && (t == null ? e.display = e.margin = "" : (n = t.display, e.display = n == null || typeof n == "boolean" ? "" : n, n = t.margin, n == null ? (n = t.hasOwnProperty("marginTop") ? t.marginTop : t["margin-top"], e.marginTop = n == null || typeof n == "boolean" ? "" : n, t = t.hasOwnProperty("marginBottom") ? t.marginBottom : t["margin-bottom"], e.marginBottom = t == null || typeof t == "boolean" ? "" : t) : e.margin = n));
	}
	function Op(e, t, n) {
		return n = n.ownerDocument.defaultView, {
			rect: e,
			abs: t.position === "absolute" || t.position === "fixed",
			clip: t.clipPath !== "none" || t.overflow !== "visible" || t.filter !== "none" || t.mask !== "none" || t.mask !== "none" || t.borderRadius !== "0px",
			view: 0 <= e.bottom && 0 <= e.right && e.top <= n.innerHeight && e.left <= n.innerWidth
		};
	}
	function kp(e) {
		return Op(e.getBoundingClientRect(), getComputedStyle(e), e);
	}
	function Ap(e) {
		var t = e.getBoundingClientRect();
		t = new DOMRect(t.x + 2e4, t.y + 2e4, t.width, t.height);
		var n = getComputedStyle(e);
		return Op(t, n, e);
	}
	function jp(e) {
		return e.documentElement.clientHeight;
	}
	function Mp(e) {
		this.addEventListener("load", e), this.addEventListener("error", e);
	}
	function Np(e, t, n, r, i, a, o, s, c) {
		var l = t.nodeType === 9 ? t : t.ownerDocument;
		try {
			var u = l.startViewTransition({
				update: function() {
					var t = l.defaultView, n = t.navigation && t.navigation.transition, o = l.fonts.status;
					r();
					var s = [];
					if (o === "loaded" && (jp(l), l.fonts.status === "loading" && s.push(l.fonts.ready)), o = s.length, e !== null) for (var c = e.suspenseyImages, u = 0, d = 0; d < c.length; d++) {
						var f = c[d];
						if (!f.complete) {
							var p = f.getBoundingClientRect();
							if (0 < p.bottom && 0 < p.right && p.top < t.innerHeight && p.left < t.innerWidth) {
								if (u += Zm(f), u > eh) {
									s.length = o;
									break;
								}
								f = new Promise(Mp.bind(f)), s.push(f);
							}
						}
					}
					if (0 < s.length) return t = Promise.race([Promise.all(s), new Promise(function(e) {
						return setTimeout(e, 500);
					})]).then(i, i), (n ? Promise.allSettled([n.finished, t]) : t).then(a, a);
					if (i(), n) return n.finished.then(a, a);
					a();
				},
				types: n
			});
			l.__reactViewTransition = u;
			var d = [];
			return u.ready.then(function() {
				for (var e = l.documentElement.getAnimations({ subtree: !0 }), t = 0; t < e.length; t++) {
					var n = e[t], r = n.effect, i = r.pseudoElement;
					if (i != null && i.startsWith("::view-transition")) {
						d.push(n), n = r.getKeyframes();
						for (var a = i = void 0, s = !0, c = 0; c < n.length; c++) {
							var u = n[c], f = u.width;
							if (i === void 0) i = f;
							else if (i !== f) {
								s = !1;
								break;
							}
							if (f = u.height, a === void 0) a = f;
							else if (a !== f) {
								s = !1;
								break;
							}
							delete u.width, delete u.height, u.transform === "none" && delete u.transform;
						}
						s && i !== void 0 && a !== void 0 && (r.setKeyframes(n), s = getComputedStyle(r.target, r.pseudoElement), s.width !== i || s.height !== a) && (s = n[0], s.width = i, s.height = a, s = n[n.length - 1], s.width = i, s.height = a, r.setKeyframes(n));
					}
				}
				o();
			}, function(e) {
				l.__reactViewTransition === u && (l.__reactViewTransition = null);
				try {
					if (typeof e == "object" && e) switch (e.name) {
						case "InvalidStateError": (e.message === "View transition was skipped because document visibility state is hidden." || e.message === "Skipping view transition because document visibility state has become hidden." || e.message === "Skipping view transition because viewport size changed." || e.message === "Transition was aborted because of invalid state") && (e = null);
					}
					e !== null && c(e);
				} finally {
					r(), i(), o();
				}
			}), u.finished.finally(function() {
				for (var e = 0; e < d.length; e++) d[e].cancel();
				l.__reactViewTransition === u && (l.__reactViewTransition = null), s();
			}), u;
		} catch {
			return r(), i(), o(), null;
		}
	}
	function Pp(e, t) {
		this._scope = document.documentElement, this._selector = "::view-transition-" + e + "(" + t + ")";
	}
	Pp.prototype.animate = function(e, t) {
		return t = typeof t == "number" ? { duration: t } : D({}, t), t.pseudoElement = this._selector, this._scope.animate(e, t);
	}, Pp.prototype.getAnimations = function() {
		for (var e = this._scope, t = this._selector, n = e.getAnimations({ subtree: !0 }), r = [], i = 0; i < n.length; i++) {
			var a = n[i].effect;
			a !== null && a.target === e && a.pseudoElement === t && r.push(n[i]);
		}
		return r;
	}, Pp.prototype.getComputedStyle = function() {
		return getComputedStyle(this._scope, this._selector);
	};
	function Fp(e) {
		return {
			name: e,
			group: new Pp("group", e),
			imagePair: new Pp("image-pair", e),
			old: new Pp("old", e),
			new: new Pp("new", e)
		};
	}
	function Ip(e) {
		this._fragmentFiber = e, this._observers = this._eventListeners = null;
	}
	Ip.prototype.addEventListener = function(e, t, n) {
		var r = null, i = null;
		if (!(n != null && typeof n != "boolean" && (r = n.signal || null, r !== null && r.aborted))) {
			this._eventListeners === null && (this._eventListeners = []);
			var a = this._eventListeners;
			if (Vp(a, e, t, n) === -1) {
				var o = this, s = t;
				n != null && typeof n != "boolean" && !0 === n.once && (s = function(r) {
					o.removeEventListener(e, t, n), typeof t == "function" ? t.call(this, r) : t.handleEvent(r);
				}), r !== null && (i = o.removeEventListener.bind(o, e, t, n), r.addEventListener("abort", i, { once: !0 }), i = r.removeEventListener.bind(r, "abort", i)), r = zp(n), a.push({
					type: e,
					listener: t,
					optionsOrUseCapture: n,
					attachedListener: s,
					cleanup: i
				}), h(this._fragmentFiber.child, !1, Lp, e, s, r);
			}
			this._eventListeners = a;
		}
	};
	function Lp(e, t, n, r) {
		return b(e).addEventListener(t, n, r), !1;
	}
	Ip.prototype.removeEventListener = function(e, t, n) {
		var r = this._eventListeners;
		if (r !== null && (t = Vp(r, e, t, n), t !== -1)) {
			var i = r[t];
			n = i.attachedListener;
			var a = i.cleanup;
			i = zp(i.optionsOrUseCapture), h(this._fragmentFiber.child, !1, Rp, e, n, i), r.splice(t, 1), a !== null && a();
		}
	};
	function Rp(e, t, n, r) {
		return b(e).removeEventListener(t, n, r), !1;
	}
	function zp(e) {
		return e != null && typeof e != "boolean" && (!0 === e.once || e.signal instanceof AbortSignal) ? {
			capture: e.capture,
			passive: e.passive
		} : e;
	}
	function Bp(e) {
		return e == null ? "c=0" : typeof e == "boolean" ? "c=" + (e ? "1" : "0") : "c=" + (e.capture ? "1" : "0");
	}
	function Vp(e, t, n, r) {
		if (e.length === 0) return -1;
		r = Bp(r);
		for (var i = 0; i < e.length; i++) {
			var a = e[i];
			if (a.type === t && a.listener === n && Bp(a.optionsOrUseCapture) === r) return i;
		}
		return -1;
	}
	Ip.prototype.dispatchEvent = function(e) {
		var t = g(this._fragmentFiber);
		if (t === null) return !0;
		t = b(t);
		var n = this._eventListeners;
		if (n !== null && 0 < n.length || !e.bubbles) {
			var r = t.nodeType === 9 ? t.createComment("") : document.createTextNode("");
			if (n) for (var i = 0; i < n.length; i++) {
				var a = n[i];
				r.addEventListener(a.type, a.attachedListener, zp(a.optionsOrUseCapture));
			}
			if (t.appendChild(r), e = r.dispatchEvent(e), n) for (i = 0; i < n.length; i++) a = n[i], r.removeEventListener(a.type, a.attachedListener, zp(a.optionsOrUseCapture));
			return t.removeChild(r), e;
		}
		return t.dispatchEvent(e);
	}, Ip.prototype.focus = function(e) {
		h(this._fragmentFiber.child, !0, Hp, e, void 0, void 0);
	};
	function Hp(e, t) {
		return e.tag !== 6 && (e = b(e), mm(e, t));
	}
	Ip.prototype.focusLast = function(e) {
		var t = [];
		h(this._fragmentFiber.child, !0, Up, t, void 0, void 0);
		for (var n = t.length - 1; 0 <= n && !Hp(t[n], e); n--);
	};
	function Up(e, t) {
		return t.push(e), !1;
	}
	Ip.prototype.blur = function() {
		var e = g(this._fragmentFiber);
		e !== null && (e = b(e), e = up(e).activeElement, e !== null && h(this._fragmentFiber.child, !1, Wp, e, void 0, void 0));
	};
	function Wp(e, t) {
		return e.tag !== 6 && (e = b(e), e === t || e.contains(t) ? (t.blur(), !0) : !1);
	}
	Ip.prototype.observeUsing = function(e) {
		this._observers === null && (this._observers = /* @__PURE__ */ new Set()), this._observers.add(e), h(this._fragmentFiber.child, !1, Gp, e, void 0, void 0);
	};
	function Gp(e, t) {
		return e.tag === 6 || (e = b(e), t.observe(e)), !1;
	}
	Ip.prototype.unobserveUsing = function(e) {
		var t = this._observers;
		if (t !== null && t.has(e)) {
			t.delete(e), h(this._fragmentFiber.child, !1, Kp, e, void 0, void 0);
			for (var n = t = 0; n < qp.length; n++) {
				var r = qp[n];
				r.fragmentInstance === this && r.observer === e ? e.unobserve(r.instance) : qp[t++] = r;
			}
			qp.length = t;
		}
	};
	function Kp(e, t) {
		return e.tag === 6 || (e = b(e), t.unobserve(e)), !1;
	}
	var qp = [], Jp = !1;
	function Yp(e, t, n) {
		qp.push({
			fragmentInstance: e,
			observer: t,
			instance: n
		}), Jp || (Jp = !0, hm(function() {
			Jp = !1;
			var e = qp;
			qp = [];
			for (var t = 0; t < e.length; t++) {
				var n = e[t];
				n.observer.unobserve(n.instance);
			}
		}));
	}
	Ip.prototype.getClientRects = function() {
		var e = [];
		return h(this._fragmentFiber.child, !1, Xp, e, void 0, void 0), e;
	};
	function Xp(e, t) {
		if (e.tag === 6) {
			e = e.stateNode;
			var n = e.ownerDocument.createRange();
			n.selectNodeContents(e), t.push.apply(t, n.getClientRects());
		} else e = b(e), t.push.apply(t, e.getClientRects());
		return !1;
	}
	Ip.prototype.getRootNode = function(e) {
		var t = g(this._fragmentFiber);
		return t === null ? this : b(t).getRootNode(e);
	}, Ip.prototype.compareDocumentPosition = function(e) {
		var t = g(this._fragmentFiber);
		if (t === null) return Node.DOCUMENT_POSITION_DISCONNECTED;
		var n = [];
		h(this._fragmentFiber.child, !1, Up, n, void 0, void 0);
		var r = b(t);
		if (n.length === 0) {
			if (n = r, _(this._fragmentFiber)) {
				a: {
					for (t = this._fragmentFiber.return; t !== null;) {
						if (t.tag === 4) {
							t = t.stateNode.containerInfo;
							break a;
						}
						if (t.tag === 3 || t.tag === 5 || t.tag === 27) break;
						t = t.return;
					}
					t = null;
				}
				t != null && (n = t);
			}
			t = this._fragmentFiber;
			var i = r = n.compareDocumentPosition(e);
			return n === e ? i = Node.DOCUMENT_POSITION_CONTAINS : r & Node.DOCUMENT_POSITION_CONTAINED_BY && (n = v(t)[1], n === null ? i = Node.DOCUMENT_POSITION_PRECEDING : (e = b(n).compareDocumentPosition(e), i = e === 0 || e & Node.DOCUMENT_POSITION_FOLLOWING ? Node.DOCUMENT_POSITION_FOLLOWING : Node.DOCUMENT_POSITION_PRECEDING)), i |= Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC;
		}
		t = b(n[0]), i = b(n[n.length - 1]);
		var a = _(this._fragmentFiber) ? t.parentElement : r;
		if (a == null) return Node.DOCUMENT_POSITION_DISCONNECTED;
		r = a.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_CONTAINED_BY, a = a.compareDocumentPosition(i) & Node.DOCUMENT_POSITION_CONTAINED_BY;
		var o = t.compareDocumentPosition(e), s = i.compareDocumentPosition(e), c = o & Node.DOCUMENT_POSITION_CONTAINED_BY || s & Node.DOCUMENT_POSITION_CONTAINED_BY;
		return s = r && a && o & Node.DOCUMENT_POSITION_FOLLOWING && s & Node.DOCUMENT_POSITION_PRECEDING, t = r && t === e || a && i === e || c || s ? Node.DOCUMENT_POSITION_CONTAINED_BY : !r && t === e || !a && i === e ? Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC : o, t & Node.DOCUMENT_POSITION_DISCONNECTED || t & Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC || Zp(t, this._fragmentFiber, n[0], n[n.length - 1], e) ? t : Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC;
	};
	function Zp(e, t, n, r, i) {
		var a = St(i);
		if (e & Node.DOCUMENT_POSITION_CONTAINED_BY) {
			if (n = !!a) a: {
				for (; a !== null;) {
					if (a.tag === 7 && (a === t || a.alternate === t)) {
						n = !0;
						break a;
					}
					a = a.return;
				}
				n = !1;
			}
			return n;
		}
		if (e & Node.DOCUMENT_POSITION_CONTAINS) {
			if (a === null) return a = i.ownerDocument, i === a || i === a.documentElement || i === a.body;
			a: {
				for (a = t, t = g(t); a !== null;) {
					if (!(a.tag !== 5 && a.tag !== 3 && a.tag !== 27 || a !== t && a.alternate !== t)) {
						a = !0;
						break a;
					}
					a = a.return;
				}
				a = !1;
			}
			return a;
		}
		return e & Node.DOCUMENT_POSITION_PRECEDING ? ((t = !!a) && !(t = a === n) && (t = E(n, a, T), t === null ? t = !1 : (h(t, !0, C, a, n), a = x, x = null, t = a !== null)), t) : e & Node.DOCUMENT_POSITION_FOLLOWING ? ((t = !!a) && !(t = a === r) && (t = E(r, a, T), t === null ? t = !1 : (h(t, !0, w, a, r), a = x, S = x = null, t = a !== null)), t) : !1;
	}
	function Qp(e, t) {
		var n = e.ownerDocument.createRange();
		n.selectNodeContents(e), e = n.getBoundingClientRect(), window.scrollTo(window.scrollX + e.left, t ? window.scrollY + e.top : window.scrollY + e.bottom - window.innerHeight);
	}
	Ip.prototype.scrollIntoView = function(e) {
		if (typeof e == "object") throw Error(i(566));
		var t = [];
		h(this._fragmentFiber.child, !1, Up, t, void 0, void 0);
		var n = !1 !== e;
		if (t.length === 0) {
			var r = v(this._fragmentFiber);
			if (r = n ? r[1] || r[0] || g(this._fragmentFiber) : r[0] || r[1], r === null) return;
			if (r.tag === 6) {
				e = b(r), Qp(e, n);
				return;
			}
			if (r = b(r), r.nodeType !== 9) {
				if (r.nodeType === 11) {
					n = "host" in r ? r.host : null, n !== null && n.scrollIntoView(e);
					return;
				}
				r.scrollIntoView(e);
			}
		}
		for (r = n ? t.length - 1 : 0; r !== (n ? -1 : t.length);) {
			var a = t[r];
			a.tag === 6 ? (a = b(a), Qp(a, n)) : b(a).scrollIntoView(e), r += n ? -1 : 1;
		}
	};
	function $p(e, t) {
		return e = b(e), em(e, t), !1;
	}
	function em(e, t) {
		e.reactFragments ??= /* @__PURE__ */ new Set(), e.reactFragments.add(t);
	}
	function tm(e, t) {
		var n = t._eventListeners;
		if (n !== null) for (var r = 0; r < n.length; r++) {
			var i = n[r];
			e.addEventListener(i.type, i.attachedListener, zp(i.optionsOrUseCapture));
		}
		e.nodeType !== 3 && (n = t._observers, n !== null && n.forEach(function(n) {
			for (var r = 0, i = 0; i < qp.length; i++) {
				var a = qp[i];
				(a.fragmentInstance !== t || a.observer !== n || a.instance !== e) && (qp[r++] = a);
			}
			qp.length = r, n.observe(e);
		}), em(e, t));
	}
	function nm(e, t) {
		var n = t._eventListeners;
		if (n !== null) for (var r = 0; r < n.length; r++) {
			var i = n[r];
			e.removeEventListener(i.type, i.attachedListener, zp(i.optionsOrUseCapture));
		}
		e.nodeType !== 3 && (n = t._observers, n !== null && n.forEach(function(n) {
			typeof n.rootMargin == "string" ? Yp(t, n, e) : n.unobserve(e);
		}), e.reactFragments != null && e.reactFragments.delete(t));
	}
	function rm(e) {
		var t = e.firstChild;
		for (t && t.nodeType === 10 && (t = t.nextSibling); t;) {
			var n = t;
			switch (t = t.nextSibling, n.nodeName) {
				case "HTML":
				case "HEAD":
				case "BODY":
					rm(n), xt(n);
					continue;
				case "SCRIPT":
				case "STYLE": continue;
				case "LINK": if (n.rel.toLowerCase() === "stylesheet") continue;
			}
			e.removeChild(n);
		}
	}
	function im(e, t, n, r) {
		for (; e.nodeType === 1;) {
			var i = n;
			if (e.nodeName.toLowerCase() !== t.toLowerCase()) {
				if (!r && (e.nodeName !== "INPUT" || e.type !== "hidden")) break;
			} else if (!r) {
				if (t === "input" && e.type === "hidden") {
					var a = i.name == null ? null : "" + i.name;
					if (i.type === "hidden" && e.getAttribute("name") === a) return e;
				} else return e;
			} else if (!e[yt]) switch (t) {
				case "meta":
					if (!e.hasAttribute("itemprop")) break;
					return e;
				case "link":
					if (a = e.getAttribute("rel"), a === "stylesheet" && e.hasAttribute("data-precedence") || a !== i.rel || e.getAttribute("href") !== (i.href == null || i.href === "" ? null : i.href) || e.getAttribute("crossorigin") !== (i.crossOrigin == null ? null : i.crossOrigin) || e.getAttribute("title") !== (i.title == null ? null : i.title)) break;
					return e;
				case "style":
					if (e.hasAttribute("data-precedence")) break;
					return e;
				case "script":
					if (a = e.getAttribute("src"), (a !== (i.src == null ? null : i.src) || e.getAttribute("type") !== (i.type == null ? null : i.type) || e.getAttribute("crossorigin") !== (i.crossOrigin == null ? null : i.crossOrigin)) && a && e.hasAttribute("async") && !e.hasAttribute("itemprop")) break;
					return e;
				default: return e;
			}
			if (e = um(e.nextSibling), e === null) break;
		}
		return null;
	}
	function am(e, t, n) {
		if (t === "") return null;
		for (; e.nodeType !== 3;) if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !n || (e = um(e.nextSibling), e === null)) return null;
		return e;
	}
	function om(e, t) {
		for (; e.nodeType !== 8;) if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !t || (e = um(e.nextSibling), e === null)) return null;
		return e;
	}
	function sm(e) {
		return e.data === "$?" || e.data === "$~";
	}
	function cm(e) {
		return e.data === "$!" || e.data === "$?" && e.ownerDocument.readyState !== "loading";
	}
	function lm(e, t) {
		var n = e.ownerDocument;
		if (e.data === "$~") e._reactRetry = t;
		else if (e.data !== "$?" || n.readyState !== "loading") t();
		else {
			var r = function() {
				t(), n.removeEventListener("DOMContentLoaded", r);
			};
			n.addEventListener("DOMContentLoaded", r), e._reactRetry = r;
		}
	}
	function um(e) {
		for (; e != null; e = e.nextSibling) {
			var t = e.nodeType;
			if (t === 1 || t === 3) break;
			if (t === 8) {
				if (t = e.data, t === "$" || t === "$!" || t === "$?" || t === "$~" || t === "&" || t === "F!" || t === "F") break;
				if (t === "/$" || t === "/&") return null;
			}
		}
		return e;
	}
	var dm = null;
	function fm(e) {
		e = e.nextSibling;
		for (var t = 0; e;) {
			if (e.nodeType === 8) {
				var n = e.data;
				if (n === "/$" || n === "/&") {
					if (t === 0) return um(e.nextSibling);
					t--;
				} else n !== "$" && n !== "$!" && n !== "$?" && n !== "$~" && n !== "&" || t++;
			}
			e = e.nextSibling;
		}
		return null;
	}
	function pm(e) {
		e = e.previousSibling;
		for (var t = 0; e;) {
			if (e.nodeType === 8) {
				var n = e.data;
				if (n === "$" || n === "$!" || n === "$?" || n === "$~" || n === "&") {
					if (t === 0) return e;
					t--;
				} else n !== "/$" && n !== "/&" || t++;
			}
			e = e.previousSibling;
		}
		return null;
	}
	function mm(e, t) {
		function n() {
			r = !0;
		}
		if (e.ownerDocument.activeElement === e) return !0;
		var r = !1;
		try {
			e.ownerDocument.addEventListener("focus", n, !0), (e.focus || HTMLElement.prototype.focus).call(e, t);
		} finally {
			e.ownerDocument.removeEventListener("focus", n, !0);
		}
		return r;
	}
	function hm(e) {
		bp(function() {
			bp(function(t) {
				return e(t);
			});
		});
	}
	function gm(e, t, n) {
		switch (t = up(n), e) {
			case "html":
				if (e = t.documentElement, !e) throw Error(i(452));
				return e;
			case "head":
				if (e = t.head, !e) throw Error(i(453));
				return e;
			case "body":
				if (e = t.body, !e) throw Error(i(454));
				return e;
			default: throw Error(i(451));
		}
	}
	function _m(e, t, n) {
		for (var r in n) {
			var i = n[r];
			n.hasOwnProperty(r) && i != null && tp(e, t, r, null, ip, i);
		}
		n.dangerouslySetInnerHTML != null && (e.textContent = ""), e.onclick === ln && (e.onclick = null), xt(e);
	}
	function vm(e) {
		for (var t = e.attributes; t.length;) e.removeAttributeNode(t[0]);
		xt(e);
	}
	var ym = /* @__PURE__ */ new Map(), bm = /* @__PURE__ */ new Set();
	function xm(e) {
		if (typeof e.getRootNode == "function") {
			var t = e.getRootNode();
			if (t.nodeType === 9 || t.nodeType === 11) return t;
		}
		return e.nodeType === 9 ? e : e.ownerDocument;
	}
	var Sm = U.d;
	U.d = {
		f: Cm,
		r: wm,
		D: Dm,
		C: Om,
		L: km,
		m: Am,
		X: Mm,
		S: jm,
		M: Nm
	};
	function Cm() {
		var e = Sm.f(), t = Ld();
		return e || t;
	}
	function wm(e) {
		var t = Ct(e);
		t !== null && t.tag === 5 && t.type === "form" ? Ys(t) : Sm.r(e);
	}
	var Tm = typeof document > "u" ? null : document;
	function Em(e, t, n) {
		var r = Tm;
		if (r && typeof t == "string" && t) {
			var i = qt(t);
			i = "link[rel=\"" + e + "\"][href=\"" + i + "\"]", typeof n == "string" && (i += "[crossorigin=\"" + n + "\"]"), bm.has(i) || (bm.add(i), e = {
				rel: e,
				crossOrigin: n,
				href: t
			}, r.querySelector(i) === null && (t = r.createElement("link"), rp(t, "link", e), Et(t), r.head.appendChild(t)));
		}
	}
	function Dm(e) {
		Sm.D(e), Em("dns-prefetch", e, null);
	}
	function Om(e, t) {
		Sm.C(e, t), Em("preconnect", e, t);
	}
	function km(e, t, n) {
		Sm.L(e, t, n);
		var r = Tm;
		if (r && e && t) {
			var i = "link[rel=\"preload\"][as=\"" + qt(t) + "\"]";
			t === "image" && n && n.imageSrcSet ? (i += "[imagesrcset=\"" + qt(n.imageSrcSet) + "\"]", typeof n.imageSizes == "string" && (i += "[imagesizes=\"" + qt(n.imageSizes) + "\"]")) : i += "[href=\"" + qt(e) + "\"]";
			var a = i;
			switch (t) {
				case "style":
					a = Fm(e);
					break;
				case "script": a = zm(e);
			}
			if (!(ym.has(a) || (e = D({
				rel: "preload",
				href: t === "image" && n && n.imageSrcSet ? void 0 : e,
				as: t
			}, n), ym.set(a, e), r.querySelector(i) !== null || t === "style" && r.querySelector(Im(a)) || t === "script" && r.querySelector(Bm(a))))) {
				var o = r.createElement("link");
				rp(o, "link", e), t === "style" && (o[bt] = !0, o.onload = o.onerror = function() {
					Dt(o);
				}), Et(o), r.head.appendChild(o);
			}
		}
	}
	function Am(e, t) {
		Sm.m(e, t);
		var n = Tm;
		if (n && e) {
			var r = t && typeof t.as == "string" ? t.as : "script", i = "link[rel=\"modulepreload\"][as=\"" + qt(r) + "\"][href=\"" + qt(e) + "\"]", a = i;
			switch (r) {
				case "audioworklet":
				case "paintworklet":
				case "serviceworker":
				case "sharedworker":
				case "worker":
				case "script": a = zm(e);
			}
			if (!ym.has(a) && (e = D({
				rel: "modulepreload",
				href: e
			}, t), ym.set(a, e), n.querySelector(i) === null)) {
				switch (r) {
					case "audioworklet":
					case "paintworklet":
					case "serviceworker":
					case "sharedworker":
					case "worker":
					case "script": if (n.querySelector(Bm(a))) return;
				}
				r = n.createElement("link"), rp(r, "link", e), Et(r), n.head.appendChild(r);
			}
		}
	}
	function jm(e, t, n) {
		Sm.S(e, t, n);
		var r = Tm;
		if (r && e) {
			var i = Tt(r).hoistableStyles, a = Fm(e);
			t ||= "default";
			var o = i.get(a);
			if (!o) {
				var s = {
					loading: 0,
					preload: null
				};
				if (o = r.querySelector(Im(a))) s.loading = 5;
				else {
					e = D({
						rel: "stylesheet",
						href: e,
						"data-precedence": t
					}, n), (n = ym.get(a)) && Um(e, n);
					var c = o = r.createElement("link");
					Et(c), rp(c, "link", e), c._p = new Promise(function(e, t) {
						c.onload = e, c.onerror = t;
					}), c.addEventListener("load", function() {
						s.loading |= 1;
					}), c.addEventListener("error", function() {
						s.loading |= 2;
					}), s.loading |= 4, Hm(o, t, r);
				}
				o = {
					type: "stylesheet",
					instance: o,
					count: 1,
					state: s
				}, i.set(a, o);
			}
		}
	}
	function Mm(e, t) {
		Sm.X(e, t);
		var n = Tm;
		if (n && e) {
			var r = Tt(n).hoistableScripts, i = zm(e), a = r.get(i);
			a || (a = n.querySelector(Bm(i)), a || (e = D({
				src: e,
				async: !0
			}, t), (t = ym.get(i)) && Wm(e, t), a = n.createElement("script"), Et(a), rp(a, "link", e), n.head.appendChild(a)), a = {
				type: "script",
				instance: a,
				count: 1,
				state: null
			}, r.set(i, a));
		}
	}
	function Nm(e, t) {
		Sm.M(e, t);
		var n = Tm;
		if (n && e) {
			var r = Tt(n).hoistableScripts, i = zm(e), a = r.get(i);
			a || (a = n.querySelector(Bm(i)), a || (e = D({
				src: e,
				async: !0,
				type: "module"
			}, t), (t = ym.get(i)) && Wm(e, t), a = n.createElement("script"), Et(a), rp(a, "link", e), n.head.appendChild(a)), a = {
				type: "script",
				instance: a,
				count: 1,
				state: null
			}, r.set(i, a));
		}
	}
	function Pm(e, t, n, r) {
		var a = (a = K.current) ? xm(a) : null;
		if (!a) throw Error(i(446));
		switch (e) {
			case "meta":
			case "title": return null;
			case "style": return typeof n.precedence == "string" && typeof n.href == "string" ? (n = Fm(n.href), t = Tt(a).hoistableStyles, r = t.get(n), r || (r = {
				type: "style",
				instance: null,
				count: 0,
				state: null
			}, t.set(n, r)), r) : {
				type: "void",
				instance: null,
				count: 0,
				state: null
			};
			case "link":
				if (n.rel === "stylesheet" && typeof n.href == "string" && typeof n.precedence == "string") {
					e = Fm(n.href);
					var o = Tt(a).hoistableStyles, s = o.get(e);
					if (s || (a = a.ownerDocument || a, s = {
						type: "stylesheet",
						instance: null,
						count: 0,
						state: {
							loading: 0,
							preload: null
						}
					}, o.set(e, s), (o = a.querySelector(Im(e))) ? o._p || (s.instance = o, s.state.loading = 5) : (o = ym.get(e), o || (o = {
						rel: "preload",
						as: "style",
						href: n.href,
						crossOrigin: n.crossOrigin,
						integrity: n.integrity,
						media: n.media,
						hrefLang: n.hrefLang,
						referrerPolicy: n.referrerPolicy
					}, ym.set(e, o)), Rm(a, e, o, s.state))), t && r === null) throw Error(i(528, ""));
					return s;
				}
				if (t && r !== null) throw Error(i(529, ""));
				return null;
			case "script": return t = n.async, n = n.src, typeof n == "string" && t && typeof t != "function" && typeof t != "symbol" ? (n = zm(n), t = Tt(a).hoistableScripts, r = t.get(n), r || (r = {
				type: "script",
				instance: null,
				count: 0,
				state: null
			}, t.set(n, r)), r) : {
				type: "void",
				instance: null,
				count: 0,
				state: null
			};
			default: throw Error(i(444, e));
		}
	}
	function Fm(e) {
		return "href=\"" + qt(e) + "\"";
	}
	function Im(e) {
		return "link[rel=\"stylesheet\"][" + e + "]";
	}
	function Lm(e) {
		return D({}, e, {
			"data-precedence": e.precedence,
			precedence: null
		});
	}
	function Rm(e, t, n, r) {
		if (t = e.querySelector("link[rel=\"preload\"][as=\"style\"][" + t + "]")) {
			if (!0 !== t[bt]) {
				r.loading = 1;
				return;
			}
		} else t = e.createElement("link"), t[bt] = !0, t.onload = t.onerror = Dt.bind(null, t), rp(t, "link", n), Et(t), e.head.appendChild(t);
		r.preload = t, t.addEventListener("load", function() {
			return r.loading |= 1;
		}), t.addEventListener("error", function() {
			return r.loading |= 2;
		});
	}
	function zm(e) {
		return "[src=\"" + qt(e) + "\"]";
	}
	function Bm(e) {
		return "script[async]" + e;
	}
	function Vm(e, t, n) {
		if (t.count++, t.instance === null) switch (t.type) {
			case "style":
				var r = e.querySelector("style[data-href~=\"" + qt(n.href) + "\"]");
				if (r) return t.instance = r, Et(r), r;
				var a = D({}, n, {
					"data-href": n.href,
					"data-precedence": n.precedence,
					href: null,
					precedence: null
				});
				return r = (e.ownerDocument || e).createElement("style"), Et(r), rp(r, "style", a), Hm(r, n.precedence, e), t.instance = r;
			case "stylesheet":
				a = Fm(n.href);
				var o = e.querySelector(Im(a));
				if (o) return t.state.loading |= 4, t.instance = o, Et(o), o;
				r = Lm(n), (a = ym.get(a)) && Um(r, a), o = (e.ownerDocument || e).createElement("link"), Et(o);
				var s = o;
				return s._p = new Promise(function(e, t) {
					s.onload = e, s.onerror = t;
				}), rp(o, "link", r), t.state.loading |= 4, Hm(o, n.precedence, e), t.instance = o;
			case "script": return o = zm(n.src), (a = e.querySelector(Bm(o))) ? (t.instance = a, Et(a), a) : (r = n, (a = ym.get(o)) && (r = D({}, n), Wm(r, a)), e = e.ownerDocument || e, a = e.createElement("script"), Et(a), rp(a, "link", r), e.head.appendChild(a), t.instance = a);
			case "void": return null;
			default: throw Error(i(443, t.type));
		}
		else t.type === "stylesheet" && !(t.state.loading & 4) && (r = t.instance, t.state.loading |= 4, Hm(r, n.precedence, e));
		return t.instance;
	}
	function Hm(e, t, n) {
		for (var r = n.querySelectorAll("link[rel=\"stylesheet\"][data-precedence],style[data-precedence]"), i = r.length ? r[r.length - 1] : null, a = i, o = 0; o < r.length; o++) {
			var s = r[o];
			if (s.dataset.precedence === t) a = s;
			else if (a !== i) break;
		}
		a ? a.parentNode.insertBefore(e, a.nextSibling) : (t = n.nodeType === 9 ? n.head : n, t.insertBefore(e, t.firstChild));
	}
	function Um(e, t) {
		e.crossOrigin ??= t.crossOrigin, e.referrerPolicy ??= t.referrerPolicy, e.title ??= t.title;
	}
	function Wm(e, t) {
		e.crossOrigin ??= t.crossOrigin, e.referrerPolicy ??= t.referrerPolicy, e.integrity ??= t.integrity;
	}
	var Gm = null;
	function Km(e, t, n) {
		if (Gm === null) {
			var r = /* @__PURE__ */ new Map(), i = Gm = /* @__PURE__ */ new Map();
			i.set(n, r);
		} else i = Gm, r = i.get(n), r || (r = /* @__PURE__ */ new Map(), i.set(n, r));
		if (r.has(e)) return r;
		for (r.set(e, null), n = n.getElementsByTagName(e), i = 0; i < n.length; i++) {
			var a = n[i];
			if (!(a[yt] || a[ft] || e === "link" && a.getAttribute("rel") === "stylesheet") && a.namespaceURI !== "http://www.w3.org/2000/svg") {
				var o = a.getAttribute(t) || "";
				o = e + o;
				var s = r.get(o);
				s ? s.push(a) : r.set(o, [a]);
			}
		}
		return r;
	}
	function qm(e, t, n) {
		e = e.ownerDocument || e, e.head.insertBefore(n, t === "title" ? e.querySelector("head > title") : null);
	}
	function Jm(e, t, n) {
		if (n === 1 || t.itemProp != null) return !1;
		switch (e) {
			case "meta":
			case "title": return !0;
			case "style":
				if (typeof t.precedence != "string" || typeof t.href != "string" || t.href === "") break;
				return !0;
			case "link":
				if (typeof t.rel != "string" || typeof t.href != "string" || t.href === "" || t.onLoad || t.onError) break;
				switch (t.rel) {
					case "stylesheet": return e = t.disabled, typeof t.precedence == "string" && e == null;
					default: return !0;
				}
			case "script": if (t.async && typeof t.async != "function" && typeof t.async != "symbol" && !t.onLoad && !t.onError && t.src && typeof t.src == "string") return !0;
		}
		return !1;
	}
	function Ym(e, t) {
		return e === "img" && t.src != null && t.src !== "" && t.onLoad == null && t.loading !== "lazy";
	}
	function Xm(e) {
		return !(e.type === "stylesheet" && !(e.state.loading & 3));
	}
	function Zm(e) {
		return (e.width || 100) * (e.height || 100) * (typeof devicePixelRatio == "number" ? devicePixelRatio : 1) * .25;
	}
	function Qm(e, t) {
		typeof t.decode == "function" && (e.imgCount++, t.complete || (e.imgBytes += Zm(t), e.suspenseyImages.push(t)), e = ih.bind(e), t.decode().then(e, e));
	}
	function $m(e, t, n, r) {
		if (n.type === "stylesheet" && (typeof r.media != "string" || !1 !== matchMedia(r.media).matches) && !(n.state.loading & 4)) {
			if (n.instance === null) {
				var i = Fm(r.href), a = t.querySelector(Im(i));
				if (a) {
					t = a._p, typeof t == "object" && t && typeof t.then == "function" && (e.count++, e = rh.bind(e), t.then(e, e)), n.state.loading |= 4, n.instance = a, Et(a);
					return;
				}
				a = t.ownerDocument || t, r = Lm(r), (i = ym.get(i)) && Um(r, i), a = a.createElement("link"), Et(a);
				var o = a;
				o._p = new Promise(function(e, t) {
					o.onload = e, o.onerror = t;
				}), rp(a, "link", r), n.instance = a;
			}
			e.stylesheets === null && (e.stylesheets = /* @__PURE__ */ new Map()), e.stylesheets.set(n, t), (t = n.state.preload) && !(n.state.loading & 3) && (e.count++, n = rh.bind(e), t.addEventListener("load", n), t.addEventListener("error", n));
		}
	}
	var eh = 0;
	function th(e, t) {
		return e.stylesheets && e.count === 0 && oh(e, e.stylesheets), 0 < e.count || 0 < e.imgCount ? function(n) {
			var r = setTimeout(function() {
				if (e.stylesheets && oh(e, e.stylesheets), e.unsuspend) {
					var t = e.unsuspend;
					e.unsuspend = null, t();
				}
			}, 6e4 + t);
			0 < e.imgBytes && eh === 0 && (eh = 62500 * sp());
			var i = setTimeout(function() {
				if (e.waitingForImages = !1, e.count === 0 && (e.stylesheets && oh(e, e.stylesheets), e.unsuspend)) {
					var t = e.unsuspend;
					e.unsuspend = null, t();
				}
			}, (e.imgBytes > eh ? 50 : 800) + t);
			return e.unsuspend = n, function() {
				e.unsuspend = null, clearTimeout(r), clearTimeout(i);
			};
		} : null;
	}
	function nh(e) {
		if (e.count === 0 && (e.imgCount === 0 || !e.waitingForImages)) {
			if (e.stylesheets) oh(e, e.stylesheets);
			else if (e.unsuspend) {
				var t = e.unsuspend;
				e.unsuspend = null, t();
			}
		}
	}
	function rh() {
		this.count--, nh(this);
	}
	function ih() {
		this.imgCount--, nh(this);
	}
	var ah = null;
	function oh(e, t) {
		e.stylesheets = null, e.unsuspend !== null && (e.count++, ah = /* @__PURE__ */ new Map(), t.forEach(sh, e), ah = null, rh.call(e));
	}
	function sh(e, t) {
		if (!(t.state.loading & 4)) {
			var n = ah.get(e);
			if (n) var r = n.get(null);
			else {
				n = /* @__PURE__ */ new Map(), ah.set(e, n);
				for (var i = e.querySelectorAll("link[data-precedence],style[data-precedence]"), a = 0; a < i.length; a++) {
					var o = i[a];
					(o.nodeName === "LINK" || o.getAttribute("media") !== "not all") && (n.set(o.dataset.precedence, o), r = o);
				}
				r && n.set(null, r);
			}
			i = t.instance, o = i.getAttribute("data-precedence"), a = n.get(o) || r, a === r && n.set(null, i), n.set(o, i), this.count++, r = rh.bind(this), i.addEventListener("load", r), i.addEventListener("error", r), a ? a.parentNode.insertBefore(i, a.nextSibling) : (e = e.nodeType === 9 ? e.head : e, e.insertBefore(i, e.firstChild)), t.state.loading |= 4;
		}
	}
	var ch = {
		$$typeof: F,
		Provider: null,
		Consumer: null,
		_currentValue: le,
		_currentValue2: le,
		_threadCount: 0
	};
	function lh(e, t, n, r, i, a, o, s, c) {
		this.tag = 1, this.containerInfo = e, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = tt(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = tt(0), this.hiddenUpdates = tt(null), this.identifierPrefix = r, this.onUncaughtError = i, this.onCaughtError = a, this.onRecoverableError = o, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = c, this.transitionTypes = null, this.incompleteTransitions = /* @__PURE__ */ new Map();
	}
	function uh(e, t, n, r, i, a, o, s, c, l, u, d) {
		return e = new lh(e, t, n, o, c, l, u, d, s), t = 1, !0 === a && (t |= 24), a = Ci(3, null, null, t), e.current = a, a.stateNode = e, t = Ca(), t.refCount++, e.pooledCache = t, t.refCount++, a.memoizedState = {
			element: r,
			isDehydrated: n,
			cache: t
		}, ao(a), e;
	}
	function dh(e) {
		return e ? (e = xi, e) : xi;
	}
	function fh(e, t, n, r, i, a) {
		i = dh(i), r.context === null ? r.context = i : r.pendingContext = i, r = so(t), r.payload = { element: n }, a = a === void 0 ? null : a, a !== null && (r.callback = a), n = co(e, r, t), n !== null && (Md(n, e, t), lo(n, e, t));
	}
	function ph(e, t) {
		if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
			var n = e.retryLane;
			e.retryLane = n !== 0 && n < t ? n : t;
		}
	}
	function mh(e, t) {
		ph(e, t), (e = e.alternate) && ph(e, t);
	}
	function hh(e) {
		if (e.tag === 13 || e.tag === 31) {
			var t = vi(e, 67108864);
			t !== null && Md(t, e, 67108864), mh(e, 67108864);
		}
	}
	function gh(e) {
		if (e.tag === 13 || e.tag === 31) {
			var t = kd();
			t = st(t);
			var n = vi(e, t);
			n !== null && Md(n, e, t), mh(e, t);
		}
	}
	var _h = !0;
	function vh(e, t, n, r) {
		var i = H.T;
		H.T = null;
		var a = U.p;
		try {
			U.p = 2, bh(e, t, n, r);
		} finally {
			U.p = a, H.T = i;
		}
	}
	function yh(e, t, n, r) {
		var i = H.T;
		H.T = null;
		var a = U.p;
		try {
			U.p = 8, bh(e, t, n, r);
		} finally {
			U.p = a, H.T = i;
		}
	}
	function bh(e, t, n, r) {
		if (_h) {
			var i = xh(r);
			if (i === null) Kf(e, t, r, Sh, n), Nh(e, r);
			else if (Fh(i, e, t, n, r)) r.stopPropagation();
			else if (Nh(e, r), t & 4 && -1 < Mh.indexOf(e)) {
				for (; i !== null;) {
					var a = Ct(i);
					if (a !== null) switch (a.tag) {
						case 3:
							if (a = a.stateNode, a.current.memoizedState.isDehydrated) {
								var o = Ye(a.pendingLanes);
								if (o !== 0) {
									var s = a;
									for (s.pendingLanes |= 2, s.entangledLanes |= 2; o;) {
										var c = 1 << 31 - He(o);
										s.entanglements[1] |= c, o &= ~c;
									}
									Tf(a), !(Q & 6) && (md = je() + 500, Ef(0, !1));
								}
							}
							break;
						case 31:
						case 13: s = vi(a, 2), s !== null && Md(s, a, 2), Ld(), mh(a, 2);
					}
					if (a = xh(r), a === null && Kf(e, t, r, Sh, n), a === i) break;
					i = a;
				}
				i !== null && r.stopPropagation();
			} else Kf(e, t, r, null, n);
		}
	}
	function xh(e) {
		return e = dn(e), Ch(e);
	}
	var Sh = null;
	function Ch(e) {
		if (Sh = null, e = St(e), e !== null) {
			var t = o(e);
			if (t === null) e = null;
			else {
				var n = t.tag;
				if (n === 13) {
					if (e = s(t), e !== null) return e;
					e = null;
				} else if (n === 31) {
					if (e = c(t), e !== null) return e;
					e = null;
				} else if (n === 3) {
					if (t.stateNode.current.memoizedState.isDehydrated) return t.tag === 3 ? t.stateNode.containerInfo : null;
					e = null;
				} else t !== e && (e = null);
			}
		}
		return Sh = e, null;
	}
	function wh(e) {
		switch (e) {
			case "beforetoggle":
			case "cancel":
			case "click":
			case "close":
			case "contextmenu":
			case "copy":
			case "cut":
			case "auxclick":
			case "dblclick":
			case "dragend":
			case "dragstart":
			case "drop":
			case "focusin":
			case "focusout":
			case "input":
			case "invalid":
			case "keydown":
			case "keypress":
			case "keyup":
			case "mousedown":
			case "mouseup":
			case "paste":
			case "pause":
			case "play":
			case "pointercancel":
			case "pointerdown":
			case "pointerup":
			case "ratechange":
			case "reset":
			case "seeked":
			case "submit":
			case "toggle":
			case "touchcancel":
			case "touchend":
			case "touchstart":
			case "volumechange":
			case "change":
			case "selectionchange":
			case "textInput":
			case "compositionstart":
			case "compositionend":
			case "compositionupdate":
			case "beforeblur":
			case "afterblur":
			case "beforeinput":
			case "blur":
			case "fullscreenchange":
			case "fullscreenerror":
			case "focus":
			case "hashchange":
			case "popstate":
			case "select":
			case "selectstart": return 2;
			case "drag":
			case "dragenter":
			case "dragexit":
			case "dragleave":
			case "dragover":
			case "mousemove":
			case "mouseout":
			case "mouseover":
			case "pointermove":
			case "pointerout":
			case "pointerover":
			case "resize":
			case "scroll":
			case "touchmove":
			case "wheel":
			case "mouseenter":
			case "mouseleave":
			case "pointerenter":
			case "pointerleave": return 8;
			case "message": switch (Me()) {
				case Ne: return 2;
				case Pe: return 8;
				case Fe:
				case Ie: return 32;
				case J: return 268435456;
				default: return 32;
			}
			default: return 32;
		}
	}
	var Th = !1, Eh = null, Dh = null, Oh = null, kh = /* @__PURE__ */ new Map(), Ah = /* @__PURE__ */ new Map(), jh = [], Mh = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");
	function Nh(e, t) {
		switch (e) {
			case "focusin":
			case "focusout":
				Eh = null;
				break;
			case "dragenter":
			case "dragleave":
				Dh = null;
				break;
			case "mouseover":
			case "mouseout":
				Oh = null;
				break;
			case "pointerover":
			case "pointerout":
				kh.delete(t.pointerId);
				break;
			case "gotpointercapture":
			case "lostpointercapture": Ah.delete(t.pointerId);
		}
	}
	function Ph(e, t, n, r, i, a) {
		return e === null || e.nativeEvent !== a ? (e = {
			blockedOn: t,
			domEventName: n,
			eventSystemFlags: r,
			nativeEvent: a,
			targetContainers: [i]
		}, t !== null && (t = Ct(t), t !== null && hh(t)), e) : (e.eventSystemFlags |= r, t = e.targetContainers, i !== null && t.indexOf(i) === -1 && t.push(i), e);
	}
	function Fh(e, t, n, r, i) {
		switch (t) {
			case "focusin": return Eh = Ph(Eh, e, t, n, r, i), !0;
			case "dragenter": return Dh = Ph(Dh, e, t, n, r, i), !0;
			case "mouseover": return Oh = Ph(Oh, e, t, n, r, i), !0;
			case "pointerover":
				var a = i.pointerId;
				return kh.set(a, Ph(kh.get(a) || null, e, t, n, r, i)), !0;
			case "gotpointercapture": return a = i.pointerId, Ah.set(a, Ph(Ah.get(a) || null, e, t, n, r, i)), !0;
		}
		return !1;
	}
	function Ih(e) {
		var t = St(e.target);
		if (t !== null) {
			var n = o(t);
			if (n !== null) {
				if (t = n.tag, t === 13) {
					if (t = s(n), t !== null) {
						e.blockedOn = t, ut(e.priority, function() {
							gh(n);
						});
						return;
					}
				} else if (t === 31) {
					if (t = c(n), t !== null) {
						e.blockedOn = t, ut(e.priority, function() {
							gh(n);
						});
						return;
					}
				} else if (t === 3 && n.stateNode.current.memoizedState.isDehydrated) {
					e.blockedOn = n.tag === 3 ? n.stateNode.containerInfo : null;
					return;
				}
			}
		}
		e.blockedOn = null;
	}
	function Lh(e) {
		if (e.blockedOn !== null) return !1;
		for (var t = e.targetContainers; 0 < t.length;) {
			var n = xh(e.nativeEvent);
			if (n === null) {
				n = e.nativeEvent;
				var r = new n.constructor(n.type, n);
				un = r, n.target.dispatchEvent(r), un = null;
			} else return t = Ct(n), t !== null && hh(t), e.blockedOn = n, !1;
			t.shift();
		}
		return !0;
	}
	function Rh(e, t, n) {
		Lh(e) && n.delete(t);
	}
	function zh() {
		Th = !1, Eh !== null && Lh(Eh) && (Eh = null), Dh !== null && Lh(Dh) && (Dh = null), Oh !== null && Lh(Oh) && (Oh = null), kh.forEach(Rh), Ah.forEach(Rh);
	}
	function Bh(e, n) {
		e.blockedOn === n && (e.blockedOn = null, Th || (Th = !0, t.unstable_scheduleCallback(t.unstable_NormalPriority, zh)));
	}
	var Vh = null;
	function Hh(e) {
		Vh !== e && (Vh = e, t.unstable_scheduleCallback(t.unstable_NormalPriority, function() {
			Vh === e && (Vh = null);
			for (var t = 0; t < e.length; t += 3) {
				var n = e[t], r = e[t + 1], i = e[t + 2];
				if (typeof r != "function") {
					if (Ch(r || n) === null) continue;
					break;
				}
				var a = Ct(n);
				a !== null && (e.splice(t, 3), t -= 3, qs(a, {
					pending: !0,
					data: i,
					method: n.method,
					action: r
				}, r, i));
			}
		}));
	}
	function Uh(e) {
		function t(t) {
			return Bh(t, e);
		}
		Eh !== null && Bh(Eh, e), Dh !== null && Bh(Dh, e), Oh !== null && Bh(Oh, e), kh.forEach(t), Ah.forEach(t);
		for (var n = 0; n < jh.length; n++) {
			var r = jh[n];
			r.blockedOn === e && (r.blockedOn = null);
		}
		for (; 0 < jh.length && (n = jh[0], n.blockedOn === null);) Ih(n), n.blockedOn === null && jh.shift();
		if (n = (e.ownerDocument || e).$$reactFormReplay, n != null) for (r = 0; r < n.length; r += 3) {
			var i = n[r], a = n[r + 1], o = i[pt] || null;
			if (typeof a == "function") o || Hh(n);
			else if (o) {
				var s = null;
				if (a && a.hasAttribute("formAction")) {
					if (i = a, o = a[pt] || null) s = o.formAction;
					else if (Ch(i) !== null) continue;
				} else s = o.action;
				typeof s == "function" ? n[r + 1] = s : (n.splice(r, 3), r -= 3), Hh(n);
			}
		}
	}
	function Wh() {
		function e(e) {
			e.canIntercept && e.info === "react-transition" && e.intercept({
				handler: function() {
					return new Promise(function(e) {
						return i = e;
					});
				},
				focusReset: "manual",
				scroll: "manual"
			});
		}
		function t() {
			i !== null && (i(), i = null), r || setTimeout(n, 20);
		}
		function n() {
			if (!r && !navigation.transition) {
				var e = navigation.currentEntry;
				e && e.url != null && navigation.navigate(e.url, {
					state: e.getState(),
					info: "react-transition",
					history: "replace"
				});
			}
		}
		if (typeof navigation == "object") {
			var r = !1, i = null;
			return navigation.addEventListener("navigate", e), navigation.addEventListener("navigatesuccess", t), navigation.addEventListener("navigateerror", t), setTimeout(n, 100), function() {
				r = !0, navigation.removeEventListener("navigate", e), navigation.removeEventListener("navigatesuccess", t), navigation.removeEventListener("navigateerror", t), i !== null && (i(), i = null);
			};
		}
	}
	function Gh(e) {
		this._internalRoot = e;
	}
	Kh.prototype.render = Gh.prototype.render = function(e) {
		var t = this._internalRoot;
		if (t === null) throw Error(i(409));
		var n = t.current;
		fh(n, kd(), e, t, null, null);
	}, Kh.prototype.unmount = Gh.prototype.unmount = function() {
		var e = this._internalRoot;
		if (e !== null) {
			this._internalRoot = null;
			var t = e.containerInfo;
			fh(e.current, 2, null, e, null, null), Ld(), t[mt] = null;
		}
	};
	function Kh(e) {
		this._internalRoot = e;
	}
	Kh.prototype.unstable_scheduleHydration = function(e) {
		if (e) {
			var t = lt();
			e = {
				blockedOn: null,
				target: e,
				priority: t
			};
			for (var n = 0; n < jh.length && t !== 0 && t < jh[n].priority; n++);
			jh.splice(n, 0, e), n === 0 && Ih(e);
		}
	};
	var qh = n.version;
	if (qh !== "19.3.1") throw Error(i(527, qh, "19.3.1"));
	U.findDOMNode = function(e) {
		var t = e._reactInternals;
		if (t === void 0) throw typeof e.render == "function" ? Error(i(188)) : (e = Object.keys(e).join(","), Error(i(268, e)));
		return e = d(t), e = e === null ? null : p(e), e = e === null ? null : e.stateNode, e;
	};
	var Jh = {
		bundleType: 0,
		version: "19.3.1",
		rendererPackageName: "react-dom",
		currentDispatcherRef: H,
		reconcilerVersion: "19.3.1"
	};
	if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
		var Yh = __REACT_DEVTOOLS_GLOBAL_HOOK__;
		if (!Yh.isDisabled && Yh.supportsFiber) try {
			ze = Yh.inject(Jh), Be = Yh;
		} catch {}
	}
	e.createRoot = function(e, t) {
		if (!a(e)) throw Error(i(299));
		var n = !1, r = "", o = gc, s = _c, c = vc;
		return t != null && (!0 === t.unstable_strictMode && (n = !0), t.identifierPrefix !== void 0 && (r = t.identifierPrefix), t.onUncaughtError !== void 0 && (o = t.onUncaughtError), t.onCaughtError !== void 0 && (s = t.onCaughtError), t.onRecoverableError !== void 0 && (c = t.onRecoverableError)), t = uh(e, 1, !1, null, null, n, r, null, o, s, c, Wh), e[mt] = t.current, Wf(e), new Gh(t);
	};
})), g = /* @__PURE__ */ o(((e, t) => {
	function n() {
		if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE == "function") try {
			__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n);
		} catch (e) {
			console.error(e);
		}
	}
	n(), t.exports = h();
})), _ = /* @__PURE__ */ o(((e) => {
	var t = Symbol.for("react.transitional.element"), n = Symbol.for("react.fragment");
	function r(e, n, r) {
		var i = null;
		if (r !== void 0 && (i = "" + r), n.key !== void 0 && (i = "" + n.key), "key" in n) for (var a in r = {}, n) a !== "key" && (r[a] = n[a]);
		else r = n;
		return n = r.ref, {
			$$typeof: t,
			type: e,
			key: i,
			ref: n === void 0 ? null : n,
			props: r
		};
	}
	e.Fragment = n, e.jsx = r, e.jsxs = r;
})), v = /* @__PURE__ */ o(((e, t) => {
	t.exports = _();
})), y = /* @__PURE__ */ c(f(), 1), b = /* @__PURE__ */ (0, y.createContext)({});
// node_modules/framer-motion/dist/es/utils/use-constant.mjs
function x(e) {
	let t = (0, y.useRef)(null);
	return t.current === null && (t.current = e()), t.current;
}
// node_modules/framer-motion/dist/es/utils/use-isomorphic-effect.mjs
var S = typeof window < "u" ? y.useLayoutEffect : y.useEffect, C = /* @__PURE__ */ (0, y.createContext)(null);
// node_modules/motion-utils/dist/es/array.mjs
function w(e, t) {
	e.indexOf(t) === -1 && e.push(t);
}
function T(e, t) {
	let n = e.indexOf(t);
	n > -1 && e.splice(n, 1);
}
// node_modules/motion-utils/dist/es/clamp.mjs
var E = (e, t, n) => n > t ? t : n < e ? e : n, D = {}, O = (e) => /^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(e), k = (e) => typeof e == "object" && !!e, A = (e) => /^0[^.\s]+$/u.test(e);
// node_modules/motion-utils/dist/es/memo.mjs
/*#__NO_SIDE_EFFECTS__*/
function j(e) {
	let t;
	return () => (t === void 0 && (t = e()), t);
}
// node_modules/motion-utils/dist/es/noop.mjs
var M = /* @__NO_SIDE_EFFECTS__ */ (e) => e, N = (...e) => e.reduce((e, t) => (n) => t(e(n))), P = /* @__NO_SIDE_EFFECTS__ */ (e, t, n) => {
	let r = t - e;
	return r ? (n - e) / r : 1;
}, F = class {
	constructor() {
		this.subscriptions = [];
	}
	add(e) {
		return w(this.subscriptions, e), () => this.remove(e);
	}
	remove(e) {
		T(this.subscriptions, e);
	}
	notify(e, t, n) {
		let r = this.subscriptions.length;
		if (r) {
			if (r === 1) this.subscriptions[0](e, t, n);
			else for (let i = 0; i < r; i++) {
				let r = this.subscriptions[i];
				r && r(e, t, n);
			}
		}
	}
	getSize() {
		return this.subscriptions.length;
	}
	clear() {
		this.subscriptions.length = 0;
	}
}, I = /* @__NO_SIDE_EFFECTS__ */ (e) => e * 1e3, L = /* @__NO_SIDE_EFFECTS__ */ (e) => e / 1e3, ee = /* @__NO_SIDE_EFFECTS__ */ (e, t) => t ? 1e3 / t * e : 0, te = (e, t, n) => e * (3 * (1 - e) * ((1 - e) * t + e * n) + e * e);
/*#__NO_SIDE_EFFECTS__*/
function R(e, t, n, r) {
	return e === t && n === r ? M : (i) => {
		let a = 0, o = 1, s = i;
		for (let t = 0;; t++) {
			s >= a && s <= o || (s = (a + o) / 2);
			let r = te(s, e, n) - i;
			if (r * r < 1e-28 || t === 40) break;
			r > 0 ? o = s : a = s, s -= r * 1e-7 / (te(s + 1e-7, e, n) - i - r);
		}
		return te(s, t, r);
	};
}
// node_modules/motion-utils/dist/es/easing/modifiers/mirror.mjs
var ne = /* @__NO_SIDE_EFFECTS__ */ (e) => (t) => t <= .5 ? e(2 * t) / 2 : (2 - e(2 * (1 - t))) / 2, re = /* @__NO_SIDE_EFFECTS__ */ (e) => (t) => 1 - e(1 - t), z = /*@__PURE__*/ R(.33, 1.53, .69, .99), ie = /*@__PURE__*/ re(z), ae = /*@__PURE__*/ ne(ie), oe = (e) => e >= 1 ? 1 : (e *= 2) < 1 ? .5 * ie(e) : .5 * (2 - 2 ** (-10 * (e - 1))), B = (e) => 1 - Math.sin(Math.acos(e)), se = /* @__PURE__ */ re(B), ce = /* @__PURE__ */ ne(B), V = /*@__PURE__*/ R(.42, 0, 1, 1), H = /*@__PURE__*/ R(0, 0, .58, 1), U = /*@__PURE__*/ R(.42, 0, .58, 1), le = /* @__NO_SIDE_EFFECTS__ */ (e) => Array.isArray(e) && typeof e[0] != "number", ue = /* @__NO_SIDE_EFFECTS__ */ (e) => Array.isArray(e) && typeof e[0] == "number", de = {
	linear: M,
	easeIn: V,
	easeInOut: U,
	easeOut: H,
	circIn: B,
	circInOut: ce,
	circOut: se,
	backIn: ie,
	backInOut: ae,
	backOut: z,
	anticipate: oe
}, fe = (e) => typeof e == "string", pe = (e) => {
	if (/* @__PURE__ */ ue(e)) {
		e.length;
		let [t, n, r, i] = e;
		return /* @__PURE__ */ R(t, n, r, i);
	}
	return fe(e) ? (de[e], `${e}`, de[e]) : e;
}, W = {
	delta: 0,
	timestamp: 0,
	isProcessing: !1
}, me;
function G() {
	me = void 0;
}
var K = {
	now: () => (me === void 0 && K.set(W.isProcessing || D.useManualTiming ? W.timestamp : performance.now()), me),
	set: (e) => {
		me = e, queueMicrotask(G);
	}
}, q = (e) => Math.round(e * 1e5) / 1e5, he = (e) => (t) => typeof t == "string" && t.startsWith(e), ge = /*@__PURE__*/ he("--"), _e = /*@__PURE__*/ he("var(--"), ve = (e) => _e(e) ? ye.test(e.split("/*")[0].trim()) : !1, ye = /var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu;
function be(e) {
	return typeof e == "string" && e.split("/*")[0].includes("var(--");
}
// node_modules/motion-dom/dist/es/value/types/numbers/index.mjs
var xe = {
	test: (e) => typeof e == "number",
	parse: parseFloat,
	transform: (e) => e
}, Se = {
	...xe,
	transform: (e) => E(0, 1, e)
}, Ce = {
	...xe,
	default: 1
}, we = /-?(?:\d+(?:\.\d+)?|\.\d+)/gu;
// node_modules/motion-dom/dist/es/value/types/utils/is-nullish.mjs
function Te(e) {
	return e == null;
}
// node_modules/motion-dom/dist/es/value/types/utils/single-color-regex.mjs
var Ee = /^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu, De = (e, t) => (n) => !!(typeof n == "string" && Ee.test(n) && n.startsWith(e) || t && !Te(n) && Object.prototype.hasOwnProperty.call(n, t)), Oe = (e, t, n) => (r) => {
	if (typeof r != "string") return r;
	let [i, a, o, s] = r.match(we);
	return {
		[e]: parseFloat(i),
		[t]: parseFloat(a),
		[n]: parseFloat(o),
		alpha: s === void 0 ? 1 : parseFloat(s)
	};
}, ke = (e) => E(0, 255, e), Ae = {
	...xe,
	transform: (e) => Math.round(ke(e))
}, je = {
	test: /*@__PURE__*/ De("rgb", "red"),
	parse: /*@__PURE__*/ Oe("red", "green", "blue"),
	transform: ({ red: e, green: t, blue: n, alpha: r = 1 }) => "rgba(" + Ae.transform(e) + ", " + Ae.transform(t) + ", " + Ae.transform(n) + ", " + q(Se.transform(r)) + ")"
};
// node_modules/motion-dom/dist/es/value/types/color/hex.mjs
function Me(e) {
	let t = "", n = "", r = "", i = "";
	return e.length > 5 ? (t = e.substring(1, 3), n = e.substring(3, 5), r = e.substring(5, 7), i = e.substring(7, 9)) : (t = e.substring(1, 2), n = e.substring(2, 3), r = e.substring(3, 4), i = e.substring(4, 5), t += t, n += n, r += r, i += i), {
		red: parseInt(t, 16),
		green: parseInt(n, 16),
		blue: parseInt(r, 16),
		alpha: i ? parseInt(i, 16) / 255 : 1
	};
}
var Ne = {
	test: /*@__PURE__*/ De("#"),
	parse: Me,
	transform: je.transform
}, Pe = /* @__NO_SIDE_EFFECTS__ */ (e) => ({
	test: (t) => typeof t == "string" && t.endsWith(e) && t.split(" ").length === 1,
	parse: parseFloat,
	transform: (t) => `${t}${e}`
}), Fe = /*@__PURE__*/ Pe("deg"), Ie = /*@__PURE__*/ Pe("%"), J = /*@__PURE__*/ Pe("px"), Le = /*@__PURE__*/ Pe("vh"), Re = /*@__PURE__*/ Pe("vw"), ze = {
	...Ie,
	parse: (e) => Ie.parse(e) / 100,
	transform: (e) => Ie.transform(e * 100)
}, Be = {
	test: /*@__PURE__*/ De("hsl", "hue"),
	parse: /*@__PURE__*/ Oe("hue", "saturation", "lightness"),
	transform: ({ hue: e, saturation: t, lightness: n, alpha: r = 1 }) => "hsla(" + Math.round(e) + ", " + Ie.transform(q(t)) + ", " + Ie.transform(q(n)) + ", " + q(Se.transform(r)) + ")"
}, Ve = {
	test: (e) => je.test(e) || Ne.test(e) || Be.test(e),
	parse: (e) => je.test(e) ? je.parse(e) : Be.test(e) ? Be.parse(e) : Ne.parse(e),
	transform: (e) => typeof e == "string" ? e : e.hasOwnProperty("red") ? je.transform(e) : Be.transform(e),
	getAnimatableNone: (e) => {
		let t = Ve.parse(e);
		return t.alpha = 0, Ve.transform(t);
	}
}, He = /(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu, Ue = /*@__PURE__*/ new RegExp(we.source), We = /*@__PURE__*/ new RegExp(He.source, "i");
function Ge(e) {
	return isNaN(e) && typeof e == "string" && (Ue.test(e) || We.test(e));
}
var Ke = "number", qe = "color", Je = "var", Ye = "var(", Xe = "${}", Ze = /var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)(?![a-z]*\()/giu;
function Qe(e) {
	let t = e.toString();
	return Ue.test(t) || We.test(t);
}
function $e(e) {
	let t = e.toString(), n = [], r = {
		color: [],
		number: [],
		var: []
	}, i = [], a = 0;
	return {
		values: n,
		split: t.replace(Ze, (e) => (Ve.test(e) ? (r.color.push(a), i.push(qe), n.push(Ve.parse(e))) : e.startsWith(Ye) ? (r.var.push(a), i.push(Je), n.push(e)) : (r.number.push(a), i.push(Ke), n.push(parseFloat(e))), ++a, Xe)).split(Xe),
		indexes: r,
		types: i
	};
}
function et(e) {
	return $e(e).values;
}
function tt({ split: e, types: t }) {
	let n = e.length;
	return (r) => {
		let i = "";
		for (let a = 0; a < n; a++) if (i += e[a], r[a] !== void 0) {
			let e = t[a];
			i += e === Ke ? q(r[a]) : e === qe ? Ve.transform(r[a]) : r[a];
		}
		return i;
	};
}
function nt(e) {
	return tt($e(e));
}
var rt = (e) => typeof e == "number" ? 0 : Ve.test(e) ? Ve.getAnimatableNone(e) : e, it = (e, t) => typeof e == "number" ? t?.trim().endsWith("/") ? e : 0 : rt(e);
function at(e) {
	let t = $e(e);
	return tt(t)(t.values.map((e, n) => it(e, t.split[n])));
}
var ot = {
	test: Ge,
	parse: et,
	createTransformer: nt,
	getAnimatableNone: at
};
// node_modules/motion-dom/dist/es/value/types/color/hsla-to-rgba.mjs
function st(e, t, n) {
	return n < 0 && (n += 1), n > 1 && --n, n < 1 / 6 ? e + (t - e) * 6 * n : n < 1 / 2 ? t : n < 2 / 3 ? e + (t - e) * (2 / 3 - n) * 6 : e;
}
function ct({ hue: e, saturation: t, lightness: n, alpha: r }) {
	e /= 360, t /= 100, n /= 100;
	let i = 0, a = 0, o = 0;
	if (!t) i = a = o = n;
	else {
		let r = n < .5 ? n * (1 + t) : n + t - n * t, s = 2 * n - r;
		i = st(s, r, e + 1 / 3), a = st(s, r, e), o = st(s, r, e - 1 / 3);
	}
	return {
		red: Math.round(i * 255),
		green: Math.round(a * 255),
		blue: Math.round(o * 255),
		alpha: r
	};
}
// node_modules/motion-dom/dist/es/utils/mix/immediate.mjs
function lt(e, t) {
	return (n) => n > 0 ? t : e;
}
// node_modules/motion-dom/dist/es/utils/mix/number.mjs
var ut = (e, t, n) => e + (t - e) * n, dt = (e, t, n) => {
	let r = e * e, i = n * (t * t - r) + r;
	return i < 0 ? 0 : Math.sqrt(i);
}, ft = [
	Ne,
	je,
	Be
], pt = (e) => ft.find((t) => t.test(e));
function mt(e) {
	let t = pt(e);
	if (!t) return `${e}`, !1;
	let n = t.parse(e);
	return t === Be && (n = ct(n)), n;
}
var ht = (e, t) => {
	let n = mt(e), r = mt(t);
	if (!n || !r) return lt(e, t);
	let i = { ...n };
	return (e) => (i.red = dt(n.red, r.red, e), i.green = dt(n.green, r.green, e), i.blue = dt(n.blue, r.blue, e), i.alpha = ut(n.alpha, r.alpha, e), je.transform(i));
}, gt = /* @__PURE__ */ new Set(["none", "hidden"]);
function _t(e, t) {
	return gt.has(e) ? (n) => n <= 0 ? e : t : (n) => n >= 1 ? t : e;
}
// node_modules/motion-dom/dist/es/utils/mix/complex.mjs
function vt(e, t) {
	return (n) => ut(e, t, n);
}
function yt(e) {
	return typeof e == "number" ? vt : typeof e == "string" ? ve(e) ? lt : Ve.test(e) ? ht : Ct : Array.isArray(e) ? bt : typeof e == "object" ? Ve.test(e) ? ht : xt : lt;
}
function bt(e, t) {
	let n = [...e], r = n.length, i = e.map((e, n) => yt(e)(e, t[n]));
	return (e) => {
		for (let t = 0; t < r; t++) n[t] = i[t](e);
		return n;
	};
}
function xt(e, t) {
	let n = {
		...e,
		...t
	}, r = {};
	for (let i in n) e[i] !== void 0 && t[i] !== void 0 && (r[i] = yt(e[i])(e[i], t[i]));
	return (e) => {
		for (let t in r) n[t] = r[t](e);
		return n;
	};
}
function St(e, t) {
	let n = [], r = {
		color: 0,
		var: 0,
		number: 0
	};
	for (let i = 0; i < t.values.length; i++) {
		let a = t.types[i], o = e.indexes[a][r[a]], s = e.values[o] ?? 0;
		n[i] = s, r[a]++;
	}
	return n;
}
var Ct = (e, t) => {
	let n = ot.createTransformer(t), r = $e(e), i = $e(t);
	return r.indexes.var.length === i.indexes.var.length && r.indexes.color.length === i.indexes.color.length && r.indexes.number.length >= i.indexes.number.length ? gt.has(e) && !i.values.length || gt.has(t) && !r.values.length ? _t(e, t) : N(bt(St(r, i), i.values), n) : (`${e}${t}`, lt(e, t));
}, wt = /^(-?(?:\d+(?:\.\d*)?|\.\d+))([a-z%]*)$/iu;
function Tt(e, t) {
	let n = wt.exec(e);
	if (!n) return;
	let r = wt.exec(t);
	if (!r || n[2] !== r[2]) return;
	let i = n[2], a = parseFloat(n[1]), o = parseFloat(r[1]);
	return (e) => q(ut(a, o, e)) + i;
}
function Et(e, t, n) {
	if (typeof e == "number" && typeof t == "number" && typeof n == "number") return ut(e, t, n);
	if (typeof e == "string" && typeof t == "string") {
		let n = Tt(e, t);
		if (n) return n;
	}
	return yt(e)(e, t);
}
// node_modules/motion-dom/dist/es/frameloop/order.mjs
var Dt = [
	"setup",
	"read",
	"resolveKeyframes",
	"preUpdate",
	"update",
	"preRender",
	"render",
	"postRender"
];
// node_modules/motion-dom/dist/es/frameloop/render-step.mjs
function Ot(e) {
	let t = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Set(), r = !1, i = !1, a, o = /* @__PURE__ */ new Set(), s = {
		delta: 0,
		timestamp: 0,
		isProcessing: !1
	};
	function c(t) {
		o.has(t) && (n.add(t), e()), (a = t)(s);
	}
	let l = {
		schedule: (e, i = !1, s = !1) => {
			let c = s && r, l = c ? t : n;
			return i && o.add(e), c && e !== a && l.delete(e), l.add(e), e;
		},
		cancel: (e) => {
			n.delete(e), o.delete(e);
		},
		process: (e) => {
			if (s = e, r) {
				i = !0;
				return;
			}
			r = !0;
			let o = t;
			t = n, n = o, t.forEach(c), t.clear(), a = void 0, r = !1, i && (i = !1, l.process(e));
		}
	};
	return l;
}
// node_modules/motion-dom/dist/es/frameloop/batcher.mjs
var kt = 40;
function At(e, t, n = {
	delta: 0,
	timestamp: 0,
	isProcessing: !1
}) {
	let r = !1, i = !0, a = () => r = !0, o = Dt.reduce((e, t) => (e[t] = Ot(a), e), {}), { setup: s, read: c, resolveKeyframes: l, preUpdate: u, update: d, preRender: f, render: p, postRender: m } = o, h = () => {
		let a = D.useManualTiming, o = a ? n.timestamp : performance.now();
		r = !1, a || (n.delta = i ? 1e3 / 60 : Math.max(Math.min(o - n.timestamp, kt), 1)), n.timestamp = o, n.isProcessing = !0, s.process(n), c.process(n), l.process(n), u.process(n), d.process(n), f.process(n), p.process(n), m.process(n), n.isProcessing = !1, r && t && (i = !1, e(h));
	}, g = () => {
		r = !0, i = !0, n.isProcessing || e(h);
	};
	return {
		schedule: Dt.reduce((e, t) => {
			let n = o[t];
			return e[t] = (e, t = !1, i = !1) => (r || g(), n.schedule(e, t, i)), e;
		}, {}),
		cancel: (e) => {
			for (let t = 0; t < Dt.length; t++) o[Dt[t]].cancel(e);
		},
		state: n,
		steps: o
	};
}
// node_modules/motion-dom/dist/es/frameloop/frame.mjs
var { schedule: jt, cancel: Mt, steps: Nt } = /* @__PURE__ */ At(typeof requestAnimationFrame < "u" ? requestAnimationFrame : M, !0, W), Pt = (e) => {
	let t = ({ timestamp: t }) => e(t);
	return {
		start: (e = !0) => jt.update(t, e),
		stop: () => Mt(t),
		now: () => W.isProcessing ? W.timestamp : K.now()
	};
}, Ft = (e, t, n = 10) => {
	let r = "", i = Math.max(Math.round(t / n), 2);
	for (let t = 0; t < i; t++) r += Math.round(e(t / (i - 1)) * 1e4) / 1e4 + ", ";
	return `linear(${r.substring(0, r.length - 2)})`;
}, It = 2e4;
function Lt(e, t = 50, n = It, r) {
	let i = 0, a = e.next(i);
	for (r?.push(a.value); !a.done && i < n;) i += t, a = e.next(i), r?.push(a.value);
	return i >= n ? Infinity : i;
}
// node_modules/motion-dom/dist/es/animation/generators/utils/create-generator-easing.mjs
function Rt(e, t = 100, n) {
	let { keyframes: r, velocity: i } = e, a = r && r[r.length - 1] - r[0], o = n({
		...e,
		velocity: i && a ? i * t / a : i,
		keyframes: [0, t]
	}), s = Math.min(Lt(o), It);
	return {
		type: "keyframes",
		ease: (e) => o.next(s * e).value / t,
		duration: /* @__PURE__ */ L(s)
	};
}
// node_modules/motion-dom/dist/es/animation/generators/spring.mjs
var zt = {
	stiffness: 100,
	damping: 10,
	mass: 1,
	duration: 800,
	bounce: .3,
	visualDuration: .3,
	restSpeed: {
		granular: .01,
		default: 2
	},
	restDelta: {
		granular: .005,
		default: .5
	},
	minDuration: .01,
	maxDuration: 10,
	minDamping: .05
}, Bt = (e) => e < 0 ? 1 / Math.max(1 + e, zt.minDamping) : Math.max(1 - e, zt.minDamping);
function Vt(e, t) {
	if (!(e > 1)) return 1;
	let n = Math.sqrt(e * e - 1), r = e - n, i = e + n, a = 2 * n * Math.exp(-t) * (1 + t);
	return Wt((e) => i * Math.exp(-r * e) - r * Math.exp(-i * e) - a, (e) => Math.exp(-i * e) - Math.exp(-r * e), t) / t;
}
function Ht(e, t) {
	return e * Math.sqrt(1 - t * t);
}
var Ut = 12;
function Wt(e, t, n) {
	let r = n;
	for (let n = 1; n < Ut; n++) r -= e(r) / t(r);
	return r;
}
var Gt = .001;
function Kt({ duration: e = zt.duration, bounce: t = zt.bounce }) {
	let n, r;
	zt.maxDuration;
	let i = Bt(t);
	e = E(zt.minDuration, zt.maxDuration, /* @__PURE__ */ L(e)), i < 1 ? (n = (t) => {
		let n = t * i, r = n * e, a = Ht(t, i), o = Math.exp(-r);
		return Gt - n / a * o;
	}, r = (t) => {
		let r = t * i * e, a = i * i * t * t * e, o = Math.exp(-r), s = Ht(t * t, i);
		return (-n(t) + Gt > 0 ? -1 : 1) * -a * o / s;
	}) : (n = (t) => -.001 + Math.exp(-t * e) * (t * e + 1), r = (t) => Math.exp(-t * e) * (-t * (e * e)));
	let a = 5 / e, o = Wt(n, r, a), s = o * Vt(i, o * e), c = s * s;
	return {
		stiffness: c,
		damping: i * 2 * Math.sqrt(c),
		duration: /* @__PURE__ */ I(e)
	};
}
var qt = (e, t) => (t ? e >= 0 : e > 0) && e < Infinity;
function Jt(e, t) {
	if (qt(e, t)) return e;
}
function Yt(e) {
	let t = Jt(e.stiffness), n = Jt(e.damping, !0), r = Jt(e.mass), i = {
		...e,
		stiffness: t ?? zt.stiffness,
		damping: n ?? zt.damping,
		mass: r ?? zt.mass,
		isResolvedFromDuration: !1,
		isTimeDefined: (t ?? n ?? r) === void 0 && (e.duration !== void 0 || e.bounce !== void 0)
	};
	if (i.isTimeDefined) {
		if (e.visualDuration) {
			let t = Bt(e.bounce || 0), n = 2 * Math.PI / (e.visualDuration * 1.2) * Vt(t, 2 * Math.PI / 1.2);
			i.stiffness = n * n, i.damping = 2 * t * Math.sqrt(i.stiffness);
		} else Object.assign(i, Kt(i)), i.isResolvedFromDuration = !0;
		qt(i.stiffness) && qt(i.damping, !0) || (i.stiffness = zt.stiffness, i.damping = zt.damping);
	}
	return i;
}
function Xt(e = zt.visualDuration, t = zt.bounce) {
	let n = typeof e == "object" ? e : {
		visualDuration: e,
		keyframes: [0, 1],
		bounce: t
	}, r = n.keyframes[0], i = n.keyframes[n.keyframes.length - 1], a = {
		done: !1,
		value: r
	}, { stiffness: o, damping: s, mass: c, duration: l, isResolvedFromDuration: u, isTimeDefined: d } = Yt({ ...n }), f = (e) => d ? 0 : -/* @__PURE__ */ L(e), p = s / (2 * Math.sqrt(o * c)), m = /* @__PURE__ */ L(Math.sqrt(o / c)), h = p * m, g = {
		target: i,
		delta: i - r,
		velocity: f(n.velocity || 0) || 0,
		restSpeed: 0,
		restDelta: 0
	}, _ = () => {
		let e = Math.abs(g.delta) < 5;
		g.restSpeed = n.restSpeed || (e ? zt.restSpeed.granular : zt.restSpeed.default), g.restDelta = n.restDelta || (e ? zt.restDelta.granular : zt.restDelta.default);
	};
	_();
	let v, y, b;
	if (p < 1) {
		let e = Ht(m, p), t = {
			A: 0,
			sinC: 0,
			cosC: 0,
			t: -1,
			env: 0,
			sin: 0,
			cos: 0
		};
		b = () => {
			t.A = (g.velocity + h * g.delta) / e, t.sinC = h * t.A + g.delta * e, t.cosC = h * g.delta - t.A * e;
		};
		let n = (n) => {
			n !== t.t && (t.t = n, t.env = Math.exp(-h * n), t.sin = Math.sin(e * n), t.cos = Math.cos(e * n));
		};
		v = (e) => (n(e), g.target - t.env * (t.A * t.sin + g.delta * t.cos)), y = (e) => (n(e), t.env * (t.sinC * t.sin + t.cosC * t.cos));
	} else if (p === 1) {
		v = (e) => g.target - Math.exp(-m * e) * (g.delta + (g.velocity + m * g.delta) * e);
		let e = { C: 0 };
		b = () => {
			e.C = g.velocity + m * g.delta;
		}, y = (t) => Math.exp(-m * t) * (m * e.C * t - g.velocity);
	} else {
		let e = m * Math.sqrt(p * p - 1), t = h - e, n = h + e, r = d ? Infinity : 300 / e, i = (e, t) => Math.exp(t > r ? -e * r - h * (t - r) : -e * t), a = {
			S: 0,
			F: 0
		};
		b = () => {
			let t = (g.velocity + h * g.delta) / e;
			a.S = (g.delta + t) / 2, a.F = (g.delta - t) / 2;
		}, v = (e) => g.target - a.S * i(t, e) - a.F * i(n, e), y = (e) => t * a.S * i(t, e) + n * a.F * i(n, e);
	}
	b();
	let x = u && l || null, S = {
		calculatedDuration: x,
		retarget: (e, t) => {
			g.target = e[e.length - 1], g.delta = g.target - e[0], g.velocity = f(t), n.restSpeed && n.restDelta || _(), S.calculatedDuration = x, a.done = !1, b();
		},
		velocity: (e) => /* @__PURE__ */ I(y(e)),
		next: (e) => {
			let t = v(e);
			if (u) a.done = e >= l;
			else {
				let n = /* @__PURE__ */ I(y(e));
				a.done = Math.abs(n) <= g.restSpeed && Math.abs(g.target - t) <= g.restDelta;
			}
			return a.value = a.done ? g.target : t, a;
		},
		toString: () => {
			let e = Math.min(Lt(S), It), t = Ft((t) => S.next(e * t).value, e, 30);
			return e + "ms " + t;
		},
		toTransition: () => {}
	};
	return S;
}
var Zt = /* @__PURE__ */ Object.assign(Xt, { applyToOptions: (e) => {
	let t = Rt(e, 100, Xt);
	return e.ease = t.ease, e.duration = /* @__PURE__ */ I(t.duration), e.type = "keyframes", e;
} });
// node_modules/motion-dom/dist/es/animation/generators/inertia.mjs
function Qt({ keyframes: e, velocity: t = 0, power: n = .8, timeConstant: r = 325, bounceDamping: i = 10, bounceStiffness: a = 500, modifyTarget: o, min: s, max: c, restDelta: l = .5, restSpeed: u }) {
	let d = e[0], f = {
		done: !1,
		value: d
	}, p = (e) => e < s || e > c, m = (e) => s === void 0 ? c : c === void 0 || Math.abs(s - e) < Math.abs(c - e) ? s : c, h = n * t, g = d + h, _ = o === void 0 ? g : o(g);
	_ !== g && (h = _ - d);
	let v = (e) => -h * Math.exp(-e / r), y = (e) => {
		let t = v(e);
		f.done = Math.abs(t) <= l, f.value = f.done ? _ : _ + t;
	}, b, x, S = (e) => {
		p(f.value) && (b = e, x = Zt({
			keyframes: [f.value, m(f.value)],
			velocity: -v(e) / r * 1e3,
			damping: i,
			stiffness: a,
			restDelta: l,
			restSpeed: u
		}));
	};
	return S(0), {
		calculatedDuration: null,
		next: (e) => {
			let t = !1;
			return !x && b === void 0 && (t = !0, y(e), S(e)), b !== void 0 && e >= b ? x.next(e - b) : (!t && y(e), f);
		}
	};
}
// node_modules/motion-dom/dist/es/utils/interpolate.mjs
function $t(e, t, n) {
	let r = [], i = n || D.mix || Et, a = e.length - 1;
	for (let n = 0; n < a; n++) {
		let a = i(e[n], e[n + 1]);
		t && (a = N(Array.isArray(t) ? t[n] || M : t, a)), r.push(a);
	}
	return r;
}
function en(e, t, { clamp: n = !0, ease: r, mixer: i } = {}) {
	let a = e.length;
	if (t.length, a === 1) return () => t[0];
	if (a === 2 && t[0] === t[1]) return () => t[1];
	let o = e[0] === e[1];
	e[0] > e[a - 1] && (e = [...e].reverse(), t = [...t].reverse());
	let s = $t(t, r, i), c = s.length, l = (n) => {
		if (o && n < e[0]) return t[0];
		let r = 0;
		if (c > 1) for (; r < e.length - 2 && !(n < e[r + 1]); r++);
		let i = /* @__PURE__ */ P(e[r], e[r + 1], n);
		return s[r](i);
	};
	return n ? (t) => l(E(e[0], e[a - 1], t)) : l;
}
// node_modules/motion-dom/dist/es/animation/keyframes/offsets/fill.mjs
function tn(e, t) {
	let n = e[e.length - 1];
	for (let r = 1; r <= t; r++) {
		let i = /* @__PURE__ */ P(0, t, r);
		e.push(ut(n, 1, i));
	}
}
// node_modules/motion-dom/dist/es/animation/keyframes/offsets/default.mjs
function nn(e) {
	let t = [0];
	return tn(t, e.length - 1), t;
}
// node_modules/motion-dom/dist/es/animation/keyframes/offsets/time.mjs
function rn(e, t) {
	return e.map((e) => e * t);
}
// node_modules/motion-dom/dist/es/animation/generators/keyframes.mjs
function an(e, t) {
	return e.map(() => t || U).splice(0, e.length - 1);
}
function on({ duration: e = 300, keyframes: t, times: n, ease: r = "easeInOut" }) {
	let i = /* @__PURE__ */ le(r) ? r.map(pe) : pe(r) || U, a = {
		done: !1,
		value: t[0]
	};
	if (t.length === 2 && !Array.isArray(i) && (!n || n.length !== 2 || n[0] === 0 && n[1] === 1)) {
		let [n, r] = t, o = n === r ? void 0 : (D.mix || Et)(n, r);
		return {
			calculatedDuration: e,
			next: (t) => (a.value = o ? o(i(e > 0 ? E(0, 1, t / e) : 1)) : r, a.done = t >= e, a)
		};
	}
	let o = en(rn(n && n.length === t.length ? n : nn(t), e), t, { ease: Array.isArray(i) ? i : an(t, i) });
	return {
		calculatedDuration: e,
		next: (t) => (a.value = o(t), a.done = t >= e, a)
	};
}
// node_modules/motion-dom/dist/es/animation/generators/utils/velocity.mjs
var sn = 5;
function cn(e, t, n) {
	let r = Math.max(t - sn, 0);
	return /* @__PURE__ */ ee(n - e(r), t - r);
}
function ln(e, t, n = 0) {
	return t <= 0 ? n : e.velocity ? e.velocity(t) : cn((t) => e.next(t).value, t, e.next(t).value);
}
// node_modules/motion-dom/dist/es/animation/keyframes/get-final.mjs
var un = (e) => e !== null;
function dn(e, { repeat: t, repeatType: n = "loop" }, r, i = 1) {
	let a = e.filter(un), o = i < 0 || t && n !== "loop" && t % 2 == 1 ? 0 : a.length - 1;
	return !o || r === void 0 ? a[o] : r;
}
// node_modules/motion-dom/dist/es/animation/utils/replace-transition-type.mjs
var fn = {
	decay: Qt,
	inertia: Qt,
	tween: on,
	keyframes: on,
	spring: Zt
};
function pn(e) {
	typeof e.type == "string" && (e.type = fn[e.type]);
}
// node_modules/motion-dom/dist/es/animation/utils/resolve-start-time.mjs
var mn = 40, hn = (e, t) => t - e > mn && !D.useManualTiming ? t : e;
// node_modules/motion-dom/dist/es/animation/utils/notify-inspector.mjs
function gn(e, t) {
	return {
		kind: e,
		animation: t,
		timestamp: K.now(),
		frameTimestamp: W.timestamp,
		frameIsProcessing: W.isProcessing
	};
}
function _n(e, t, n) {
	let r = globalThis.__MOTION_INSPECT__;
	if (r) try {
		r({
			...gn("animation-start", e),
			options: n ? {
				...t,
				...n
			} : t
		});
	} catch {}
}
function vn(e, t) {
	let n = globalThis.__MOTION_INSPECT__;
	if (n) try {
		n({
			...gn("layout-animation-start", e),
			node: t
		});
	} catch {}
}
// node_modules/motion-dom/dist/es/animation/utils/WithPromise.mjs
var yn = class {
	constructor() {
		this.isResolved = !1;
	}
	get finished() {
		return this._finished ||= this.isResolved ? Promise.resolve() : new Promise((e) => {
			this._resolve = e;
		}), this._finished;
	}
	updateFinished() {
		this._finished = this._resolve = void 0, this.isResolved = !1;
	}
	notifyFinished() {
		this.isResolved = !0, this._resolve?.();
	}
	then(e, t) {
		return this.finished.then(e, t);
	}
}, bn = (e) => e / 100, xn = (e) => Math.round(e * 1e4) / 1e4, Sn = class extends yn {
	constructor(e) {
		super(), this.state = "idle", this.startTime = null, this.isStopped = !1, this.currentTime = 0, this.holdTime = null, this.playbackSpeed = 1, this.delayState = {
			done: !1,
			value: void 0
		}, this.stop = () => {
			let { motionValue: e } = this.options;
			e && e.updatedAt !== K.now() && this.tick(K.now()), this.isStopped = !0, this.state !== "idle" && (this.teardown(), this.options.onStop?.());
		}, this.options = e, this.initAnimation(), this.play(), e.autoplay === !1 && this.pause(), _n(this, this.options);
	}
	initAnimation() {
		let { options: e } = this;
		pn(e);
		let { type: t = on, repeat: n = 0, repeatDelay: r = 0, repeatType: i, velocity: a = 0 } = e, { keyframes: o } = e, s = t || on;
		s !== on && typeof o[0] != "number" && (this.mixKeyframes = N(bn, Et(o[0], o[1])), o = [0, 100]);
		let c = s(o === e.keyframes ? e : {
			...e,
			keyframes: o
		});
		i === "mirror" && (this.mirroredGenerator = s({
			...e,
			keyframes: [...o].reverse(),
			velocity: -a
		})), c.calculatedDuration === null && (c.calculatedDuration = Lt(c));
		let { calculatedDuration: l } = c;
		this.calculatedDuration = l, this.resolvedDuration = l + r, this.totalDuration = this.resolvedDuration * (n + 1) - r, this.generator = c;
	}
	updateTime(e) {
		let t = Math.round(e - this.startTime) * this.playbackSpeed;
		this.currentTime = this.holdTime === null ? t : this.holdTime;
	}
	tick(e, t = !1) {
		let { generator: n, totalDuration: r, calculatedDuration: i } = this;
		if (this.startTime === null) return n.next(0);
		let { delay: a = 0, keyframes: o, type: s, onUpdate: c, finalKeyframe: l } = this.options;
		this.startTime === this.pendingStartTime && (this.startTime = hn(this.startTime, e)), this.pendingStartTime = void 0, this.speed > 0 ? this.startTime = Math.min(this.startTime, e) : this.speed < 0 && (this.startTime = Math.min(e - r / this.speed, this.startTime)), t ? this.currentTime = e : this.updateTime(e);
		let u = this.currentTime - a * (this.playbackSpeed >= 0 ? 1 : -1), d = this.playbackSpeed >= 0 ? u < 0 : u > r;
		this.currentTime = Math.max(u, 0), this.state === "finished" && this.holdTime === null && (this.currentTime = r);
		let f = this.generate(this.currentTime, d), { done: p } = f;
		!d && i !== null && (p = this.playbackSpeed >= 0 ? this.currentTime >= r : this.currentTime <= 0);
		let m = this.holdTime === null && (this.state === "finished" || this.state === "running" && p);
		return m && s !== Qt && (f.value = dn(o, this.options, l, this.speed)), c && c(f.value), m && this.finish(), f;
	}
	at(e) {
		return this.holdTime ?? xn((e - this.startTime) * this.playbackSpeed);
	}
	sampleAt(e, t) {
		let { options: n, totalDuration: r } = this, i = this.at(e) - (n.delay || 0);
		return i >= r && n.type !== Qt ? dn(n.keyframes, n, t ? void 0 : n.finalKeyframe) : this.generate(Math.max(i, 0), i < 0).value;
	}
	generate(e, t) {
		let { generator: n, totalDuration: r, mixKeyframes: i, mirroredGenerator: a, resolvedDuration: o } = this, { keyframes: s, repeat: c, repeatType: l, repeatDelay: u } = this.options, d = e, f = n;
		if (c) {
			let t = Math.min(e, r) / o, n = Math.floor(t), i = t % 1;
			!i && t >= 1 && (i = 1), i === 1 && n--, n = Math.min(n, c + 1), n % 2 && (l === "reverse" ? (i = 1 - i, u && (i -= u / o)) : l === "mirror" && (f = a)), d = E(0, 1, i) * o;
		}
		let p;
		return t ? (this.delayState.value = s[0], p = this.delayState) : p = f.next(d), i && !t && (p.value = i(p.value)), p;
	}
	then(e, t) {
		return this.finished.then(e, t);
	}
	get duration() {
		return /* @__PURE__ */ L(this.calculatedDuration);
	}
	get iterationDuration() {
		let { delay: e = 0 } = this.options || {};
		return this.duration + /* @__PURE__ */ L(e);
	}
	get time() {
		return /* @__PURE__ */ L(this.currentTime);
	}
	set time(e) {
		e = /* @__PURE__ */ I(e), this.currentTime = e, this.startTime === null || this.holdTime !== null || this.playbackSpeed === 0 ? this.holdTime = e : this.driver && (this.startTime = this.driver.now() - e / this.playbackSpeed), this.driver ? this.driver.start(!1) : (this.startTime = 0, this.state = "paused", this.holdTime = e, this.tick(e));
	}
	getGeneratorVelocity() {
		return ln(this.generator, this.currentTime, this.options.velocity);
	}
	get speed() {
		return this.playbackSpeed;
	}
	set speed(e) {
		let t = this.playbackSpeed !== e;
		t && this.driver && this.updateTime(K.now()), this.playbackSpeed = e, t && this.driver && (this.time = /* @__PURE__ */ L(this.currentTime));
	}
	play() {
		if (this.isStopped) return;
		let { driver: e = Pt, startTime: t } = this.options;
		this.driver ||= e((e) => this.tick(e)), this.options.onPlay?.();
		let n = this.driver.now();
		this.state === "finished" ? (this.updateFinished(), this.startTime = n) : this.holdTime === null ? this.startTime ||= t ?? (this.pendingStartTime = n) : this.startTime = n - this.holdTime / (this.playbackSpeed || 1), this.state === "finished" && this.speed < 0 && (this.startTime += this.calculatedDuration), this.holdTime = null, this.state = "running", this.driver.start();
	}
	pause() {
		this.state = "paused", this.updateTime(K.now()), this.holdTime = this.currentTime;
	}
	complete() {
		this.state !== "running" && this.play(), this.state = "finished", this.holdTime = null;
	}
	finish() {
		this.notifyFinished(), this.teardown(), this.state = "finished", this.options.onComplete?.();
	}
	cancel() {
		this.holdTime = null, this.startTime = 0, this.tick(0), this.teardown(), this.options.onCancel?.();
	}
	teardown() {
		this.state = "idle", this.stopDriver(), this.startTime = this.holdTime = null;
	}
	stopDriver() {
		this.driver &&= (this.driver.stop(), void 0);
	}
	sample(e) {
		return this.startTime = 0, this.tick(e, !0);
	}
	attachTimeline(e) {
		return this.options.allowFlatten && (this.options.type = "keyframes", this.options.ease = "linear", this.initAnimation()), this.driver?.stop(), e.observe(this);
	}
}, Cn = /* @__PURE__ */ new Set([
	"brightness",
	"contrast",
	"saturate",
	"opacity"
]);
function wn(e) {
	let [t, n] = e.slice(0, -1).split("(");
	if (t === "drop-shadow") return e;
	let [r] = n.match(we) || [];
	if (!r) return e;
	let i = n.replace(r, ""), a = +!!Cn.has(t);
	return r !== n && (a *= 100), t + "(" + a + i + ")";
}
var Tn = /\b([a-z-]*)\(.*?\)/gu, En = {
	...ot,
	getAnimatableNone: (e) => {
		let t = e.match(Tn);
		return t ? t.map(wn).join(" ") : e;
	}
}, Dn = {
	...ot,
	getAnimatableNone: (e) => {
		let t = ot.parse(e);
		return ot.createTransformer(e)(t.map((e) => typeof e == "number" ? 0 : typeof e == "object" ? {
			...e,
			alpha: 1
		} : e));
	}
}, On = {
	...xe,
	transform: Math.round
}, kn = {
	borderWidth: J,
	borderTopWidth: J,
	borderRightWidth: J,
	borderBottomWidth: J,
	borderLeftWidth: J,
	borderRadius: J,
	borderTopLeftRadius: J,
	borderTopRightRadius: J,
	borderBottomRightRadius: J,
	borderBottomLeftRadius: J,
	width: J,
	maxWidth: J,
	height: J,
	maxHeight: J,
	top: J,
	right: J,
	bottom: J,
	left: J,
	inset: J,
	insetBlock: J,
	insetBlockStart: J,
	insetBlockEnd: J,
	insetInline: J,
	insetInlineStart: J,
	insetInlineEnd: J,
	padding: J,
	paddingTop: J,
	paddingRight: J,
	paddingBottom: J,
	paddingLeft: J,
	paddingBlock: J,
	paddingBlockStart: J,
	paddingBlockEnd: J,
	paddingInline: J,
	paddingInlineStart: J,
	paddingInlineEnd: J,
	margin: J,
	marginTop: J,
	marginRight: J,
	marginBottom: J,
	marginLeft: J,
	marginBlock: J,
	marginBlockStart: J,
	marginBlockEnd: J,
	marginInline: J,
	marginInlineStart: J,
	marginInlineEnd: J,
	fontSize: J,
	backgroundPositionX: J,
	backgroundPositionY: J,
	rotate: Fe,
	pathRotation: Fe,
	rotateX: Fe,
	rotateY: Fe,
	rotateZ: Fe,
	scale: Ce,
	scaleX: Ce,
	scaleY: Ce,
	scaleZ: Ce,
	skew: Fe,
	skewX: Fe,
	skewY: Fe,
	distance: J,
	translateX: J,
	translateY: J,
	translateZ: J,
	x: J,
	y: J,
	z: J,
	perspective: J,
	transformPerspective: J,
	opacity: Se,
	originX: ze,
	originY: ze,
	originZ: J,
	zIndex: On,
	fillOpacity: Se,
	strokeOpacity: Se,
	numOctaves: On
}, An = {
	...kn,
	color: Ve,
	backgroundColor: Ve,
	outlineColor: Ve,
	fill: Ve,
	stroke: Ve,
	borderColor: Ve,
	borderTopColor: Ve,
	borderRightColor: Ve,
	borderBottomColor: Ve,
	borderLeftColor: Ve,
	filter: En,
	WebkitFilter: En,
	mask: Dn,
	WebkitMask: Dn
}, jn = (e) => An[e], Mn = /*@__PURE__*/ new Set([En, Dn]);
function Nn(e, t) {
	let n = jn(e);
	return Mn.has(n) || (n = ot), n.getAnimatableNone ? n.getAnimatableNone(t) : void 0;
}
// node_modules/motion-dom/dist/es/animation/keyframes/utils/fill-wildcards.mjs
function Pn(e) {
	for (let t = 1; t < e.length; t++) e[t] ?? (e[t] = e[t - 1]);
}
// node_modules/motion-dom/dist/es/render/dom/parse-transform.mjs
var Fn = (e) => e * 180 / Math.PI, In = (e) => Rn(Fn(Math.atan2(e[1], e[0]))), Ln = {
	x: 4,
	y: 5,
	translateX: 4,
	translateY: 5,
	scaleX: 0,
	scaleY: 3,
	scaleZ: () => 1,
	scale: (e) => (Math.abs(e[0]) + Math.abs(e[3])) / 2,
	rotate: In,
	rotateZ: In,
	skewX: (e) => Fn(Math.atan(e[1])),
	skewY: (e) => Fn(Math.atan(e[2])),
	skew: (e) => (Math.abs(e[1]) + Math.abs(e[2])) / 2
}, Rn = (e) => (e %= 360, e < 0 && (e += 360), e), zn = In, Bn = (e) => Math.hypot(e[0], e[1]), Vn = (e) => Math.hypot(e[4], e[5]), Hn = {
	x: 12,
	y: 13,
	z: 14,
	translateX: 12,
	translateY: 13,
	translateZ: 14,
	scaleX: Bn,
	scaleY: Vn,
	scaleZ: (e) => Math.hypot(e[8], e[9], e[10]),
	scale: (e) => (Bn(e) + Vn(e)) / 2,
	rotateX: (e) => Rn(Fn(Math.atan2(e[6], e[5]))),
	rotateY: (e) => Rn(Fn(Math.atan2(-e[2], e[0]))),
	rotateZ: zn,
	rotate: zn,
	skewX: (e) => Fn(Math.atan(e[4])),
	skewY: (e) => Fn(Math.atan(e[1])),
	skew: (e) => (Math.abs(e[1]) + Math.abs(e[4])) / 2
};
function Un(e) {
	return +!!e.includes("scale");
}
function Wn(e, t) {
	if (!e || e === "none") return Un(t);
	let n = e.match(/^matrix3d\(([-\d.e\s,]+)\)$/u), r, i;
	if (n) r = Hn, i = n;
	else {
		let t = e.match(/^matrix\(([-\d.e\s,]+)\)$/u);
		r = Ln, i = t;
	}
	if (!i) return Un(t);
	let a = r[t], o = i[1].split(",").map(Kn);
	return typeof a == "function" ? a(o) : o[a];
}
var Gn = (e, t) => {
	let { transform: n = "none" } = getComputedStyle(e);
	return Wn(n, t);
};
function Kn(e) {
	return parseFloat(e.trim());
}
// node_modules/motion-dom/dist/es/render/utils/keys-transform.mjs
var qn = [
	"transformPerspective",
	"x",
	"y",
	"z",
	"translateX",
	"translateY",
	"translateZ",
	"scale",
	"scaleX",
	"scaleY",
	"scaleZ",
	"rotate",
	"rotateX",
	"rotateY",
	"rotateZ",
	"skew",
	"skewX",
	"skewY"
], Jn = /* @__PURE__ */ new Set([...qn, "pathRotation"]), Yn = (e) => e === xe || e === J, Xn = /* @__PURE__ */ new Set([
	"x",
	"y",
	"z"
]), Zn = /* @__PURE__ */ qn.filter((e) => !Xn.has(e));
function Qn(e) {
	let t = [];
	return Zn.forEach((n) => {
		let r = e.getValue(n);
		if (r !== void 0) {
			let e = r.get(), i = +!!n.startsWith("scale");
			if (e === i) return;
			t.push([n, e]), r.set(i);
		}
	}), t;
}
var $n = /* @__PURE__ */ new Set(["bottom", "right"]);
function er(e, t, n, r, i, a) {
	let o = parseFloat(e);
	if (!isNaN(o)) return o;
	let { min: s, max: c } = t()[n], l = c - s;
	return a === "border-box" ? l : l - parseFloat(r) - parseFloat(i);
}
var tr = ({ transform: e }) => Wn(e, "x"), nr = ({ transform: e }) => Wn(e, "y"), rr = {
	width: ({ width: e, paddingLeft: t = "0", paddingRight: n = "0", boxSizing: r }, i) => er(e, i, "x", t, n, r),
	height: ({ height: e, paddingTop: t = "0", paddingBottom: n = "0", boxSizing: r }, i) => er(e, i, "y", t, n, r),
	top: ({ top: e }) => parseFloat(e),
	left: ({ left: e }) => parseFloat(e),
	bottom: ({ top: e }, t) => {
		let { y: n } = t();
		return parseFloat(e) + (n.max - n.min);
	},
	right: ({ left: e }, t) => {
		let { x: n } = t();
		return parseFloat(e) + (n.max - n.min);
	},
	x: tr,
	y: nr,
	translateX: tr,
	translateY: nr
}, ir = /* @__PURE__ */ new Set(), ar = !1, or = !1, sr = !1;
function cr() {
	if (or) {
		let e = [], t = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Set();
		ir.forEach((r) => {
			r.needsMeasurement && (e.push(r), t.add(r.element), $n.has(r.name) && n.add(r.element));
		});
		let r = /* @__PURE__ */ new Map();
		n.forEach((e) => {
			let t = Qn(e);
			t.length && (r.set(e, t), e.render());
		}), e.forEach((e) => e.measureInitialState()), t.forEach((e) => {
			e.render();
			let t = r.get(e);
			t && t.forEach(([t, n]) => {
				e.getValue(t)?.set(n);
			});
		}), e.forEach((e) => e.measureEndState()), e.forEach((e) => {
			e.suspendedScrollY !== void 0 && window.scrollTo(0, e.suspendedScrollY);
		});
	}
	or = !1, ar = !1, ir.forEach((e) => e.complete(sr)), ir.clear();
}
function lr() {
	ir.forEach((e) => {
		e.readKeyframes(), e.needsMeasurement && (or = !0);
	});
}
function ur() {
	sr = !0, lr(), cr(), sr = !1;
}
function dr(e, t, n) {
	if (typeof e == "string") {
		if (O(e) || A(e)) return parseFloat(e);
		if (!ot.test(e) && ot.test(n)) return Nn(t, n);
	}
	return e ?? void 0;
}
var fr = class {
	constructor(e, t, n, r, i, a = !1) {
		this.state = "pending", this.isAsync = !1, this.needsMeasurement = !1, this.unresolvedKeyframes = [...e], this.onComplete = t, this.name = n, this.motionValue = r, this.element = i, this.isAsync = a;
	}
	scheduleResolve() {
		this.state = "scheduled", this.isAsync ? (ir.add(this), ar || (ar = !0, jt.read(lr), jt.resolveKeyframes(cr))) : (this.readKeyframes(), this.complete());
	}
	readKeyframes() {
		let { unresolvedKeyframes: e, name: t, element: n, motionValue: r } = this;
		if (e[0] === null) {
			let i = r?.get(), a = e[e.length - 1];
			if (i !== void 0) e[0] = i;
			else if (n && t) {
				let r = dr(n.readValue(t, a), t, a);
				r !== void 0 && (e[0] = r);
			}
			e[0] === void 0 && (e[0] = a), r && i === void 0 && r.set(e[0]);
		}
		Pn(e);
	}
	setFinalKeyframe() {}
	measureInitialState() {}
	renderEndStyles() {}
	measureEndState() {}
	complete(e = !1) {
		this.state = "complete", this.onComplete(this.unresolvedKeyframes, this.finalKeyframe, e), ir.delete(this);
	}
	cancel() {
		this.state === "scheduled" && (ir.delete(this), this.state = "pending");
	}
	resume() {
		this.state === "pending" && this.scheduleResolve();
	}
}, pr = (e) => e.startsWith("--");
// node_modules/motion-dom/dist/es/render/dom/style-set.mjs
function mr(e, t, n) {
	pr(t) ? e.style.setProperty(t, n) : e.style[t] = n;
}
// node_modules/motion-dom/dist/es/utils/supports/flags.mjs
var hr = {};
// node_modules/motion-dom/dist/es/utils/supports/memo.mjs
function gr(e, t) {
	let n = /* @__PURE__ */ j(e);
	return () => hr[t] ?? n();
}
// node_modules/motion-dom/dist/es/utils/supports/scroll-timeline.mjs
var _r = /* @__PURE__ */ gr(() => window.ScrollTimeline !== void 0, "scrollTimeline"), vr = /*@__PURE__*/ gr(() => {
	try {
		document.createElement("div").animate({ opacity: 0 }, { easing: "linear(0, 1)" });
	} catch {
		return !1;
	}
	return !0;
}, "linearEasing"), yr = ([e, t, n, r]) => `cubic-bezier(${e}, ${t}, ${n}, ${r})`, br = {
	linear: "linear",
	ease: "ease",
	easeIn: "ease-in",
	easeOut: "ease-out",
	easeInOut: "ease-in-out",
	circIn: /*@__PURE__*/ yr([
		0,
		.65,
		.55,
		1
	]),
	circOut: /*@__PURE__*/ yr([
		.55,
		0,
		1,
		.45
	]),
	backIn: /*@__PURE__*/ yr([
		.31,
		.01,
		.66,
		-.59
	]),
	backOut: /*@__PURE__*/ yr([
		.33,
		1.53,
		.69,
		.99
	])
};
// node_modules/motion-dom/dist/es/animation/waapi/easing/map-easing.mjs
function xr(e, t) {
	if (e) return typeof e == "function" ? vr() ? Ft(e, t) : "ease-out" : /* @__PURE__ */ ue(e) ? yr(e) : Array.isArray(e) ? e.map((e) => xr(e, t) || br.easeOut) : br[e];
}
// node_modules/motion-dom/dist/es/animation/waapi/start-waapi-animation.mjs
function Sr(e, t, n, { delay: r = 0, duration: i = 300, repeat: a = 0, repeatType: o = "loop", ease: s = "easeOut", times: c } = {}, l = void 0) {
	let u = { [t]: n };
	c && (u.offset = c);
	let d = xr(s, i);
	Array.isArray(d) && (u.easing = d);
	let f = {
		delay: r,
		duration: i,
		easing: Array.isArray(d) ? "linear" : d,
		fill: "both",
		iterations: a + 1,
		direction: o === "reverse" ? "alternate" : "normal"
	};
	return l && (f.pseudoElement = l), e.animate(u, f);
}
// node_modules/motion-dom/dist/es/animation/generators/utils/is-generator.mjs
function Cr(e) {
	return typeof e == "function" && "applyToOptions" in e;
}
// node_modules/motion-dom/dist/es/animation/waapi/utils/apply-generator.mjs
function wr({ type: e, ...t }) {
	return Cr(e) && vr() ? e.applyToOptions(t) : (t.duration ??= 300, t.ease ??= "easeOut", t);
}
// node_modules/motion-dom/dist/es/animation/NativeAnimation.mjs
var Tr = class extends yn {
	constructor(e) {
		if (super(), this.finishedTime = null, this.isStopped = !1, this.manualStartTime = null, !e) return;
		let { element: t, name: n, keyframes: r, pseudoElement: i, allowFlatten: a = !1, finalKeyframe: o, onComplete: s } = e;
		this.isPseudoElement = !!i, this.allowFlatten = a, this.options = e, e.type;
		let c = wr(e);
		this.animation = Sr(t, n, r, c, i), c.autoplay === !1 && this.animation.pause(), this.animation.onfinish = () => {
			if (this.finishedTime = this.time, !i) {
				let e = dn(r, this.options, o, this.speed);
				this.updateMotionValue && this.updateMotionValue(e), mr(t, n, e), this.animation.cancel();
			}
			s?.(), this.notifyFinished();
		}, _n(this, e, c);
	}
	play() {
		this.isStopped || (this.manualStartTime = null, this.animation.play(), this.state === "finished" && this.updateFinished());
	}
	pause() {
		this.animation.pause();
	}
	complete() {
		this.animation.finish?.();
	}
	cancel() {
		try {
			this.animation.cancel();
		} catch {}
	}
	stop() {
		this.isStopped || (this.isStopped = !0, this.state !== "idle" && this.finishedTime === null && (this.updateMotionValue ? this.updateMotionValue() : this.commitStyles(), this.isPseudoElement || (this.animation.onfinish = null, this.cancel())));
	}
	commitStyles() {
		let e = this.options?.element;
		!this.isPseudoElement && e?.isConnected && this.animation.commitStyles?.();
	}
	get duration() {
		let e = this.animation.effect?.getComputedTiming?.().duration || 0;
		return /* @__PURE__ */ L(Number(e));
	}
	get iterationDuration() {
		let { delay: e = 0 } = this.options || {};
		return this.duration + /* @__PURE__ */ L(e);
	}
	get time() {
		return /* @__PURE__ */ L(Number(this.animation.currentTime) || 0);
	}
	set time(e) {
		let t = this.finishedTime !== null;
		this.manualStartTime = null, this.finishedTime = null, this.animation.currentTime = /* @__PURE__ */ I(e), t && this.animation.pause();
	}
	get speed() {
		return this.animation.playbackRate;
	}
	set speed(e) {
		e < 0 && (this.finishedTime = null), this.animation.playbackRate = e;
	}
	get state() {
		return this.finishedTime === null ? this.animation.playState : "finished";
	}
	get startTime() {
		return this.manualStartTime ?? Number(this.animation.startTime);
	}
	set startTime(e) {
		this.manualStartTime = this.animation.startTime = e;
	}
	attachTimeline({ timeline: e, onAttach: t, observe: n }) {
		return this.allowFlatten && this.animation.effect?.updateTiming({ easing: "linear" }), this.animation.onfinish = null, e && _r() ? (this.animation.timeline = e, t?.(this.animation), M) : n(this);
	}
}, Er = {
	anticipate: oe,
	backInOut: ae,
	circInOut: ce
};
function Dr(e) {
	return e in Er;
}
function Or(e) {
	typeof e.ease == "string" && Dr(e.ease) && (e.ease = Er[e.ease]);
}
var kr = class extends Tr {
	constructor(e) {
		Or(e), pn(e), super(e), e.startTime !== void 0 && e.autoplay !== !1 && (this.startTime = e.startTime), this.options = e;
	}
	elapsed() {
		return this.state === "running" ? (K.now() - this.startTime) * this.speed : this.time * 1e3;
	}
	sample(e) {
		if (!this.sampler) {
			let { motionValue: e, onUpdate: t, onComplete: n, onPlay: r, onStop: i, element: a, ...o } = this.options;
			this.sampler = new Sn({
				...o,
				autoplay: !1
			}), this.sampler.stop();
		}
		return this.sampler.sample(Math.max(0, e)).value;
	}
	liveValue() {
		let { state: e } = this;
		if (e === "running" || e === "paused") return this.sample(this.elapsed());
	}
	updateMotionValue(e) {
		let { motionValue: t, element: n, name: r } = this.options;
		if (!t) return;
		if (e !== void 0) {
			t.set(e);
			return;
		}
		let { speed: i } = this, a = this.elapsed(), o = this.state === "running" && i ? E(0, 10, a) : 0, s = this.sample(a);
		n && r && mr(n, r, s), t.setWithVelocity(this.sample(a - o * Math.sign(i)), s, o / Math.abs(i || 1));
	}
}, Ar = (e, t) => t !== "zIndex" && !!(typeof e == "number" || Array.isArray(e) || typeof e == "string" && (ot.test(e) || e === "0") && !e.startsWith("url("));
// node_modules/motion-dom/dist/es/animation/utils/can-animate.mjs
function jr(e) {
	let t = e[0];
	if (e.length === 1) return !0;
	for (let n = 0; n < e.length; n++) if (e[n] !== t) return !0;
}
function Mr(e, t, n, r) {
	let i = e[0];
	if (i === null) return !1;
	if (t === "display" || t === "visibility") return !0;
	let a = e[e.length - 1], o = Ar(i, t), s = Ar(a, t);
	return !o || !s ? (o !== s && `${t}${i}${a}${o ? a : i}`, !1) : jr(e) || (n === "spring" || Cr(n)) && r;
}
// node_modules/motion-dom/dist/es/animation/utils/make-animation-instant.mjs
function Nr(e) {
	e.duration = 0, e.type = "keyframes";
}
// node_modules/motion-dom/dist/es/animation/waapi/utils/accelerated-values.mjs
var Pr = /* @__PURE__ */ new Set([
	"opacity",
	"clipPath",
	"filter",
	"transform",
	"backgroundColor"
]), Fr = /^(?:oklch|oklab|lab|lch|color|color-mix|light-dark)\(/;
function Ir(e) {
	for (let t = 0; t < e.length; t++) if (typeof e[t] == "string" && Fr.test(e[t])) return !0;
	return !1;
}
// node_modules/motion-dom/dist/es/animation/waapi/supports/waapi.mjs
var Lr = /* @__PURE__ */ new Set([
	"color",
	"backgroundColor",
	"outlineColor",
	"fill",
	"stroke",
	"borderColor",
	"borderTopColor",
	"borderRightColor",
	"borderBottomColor",
	"borderLeftColor"
]), Rr = () => !D.useManualTiming && Object.hasOwnProperty.call(Element.prototype, "animate");
function zr(e) {
	let { motionValue: t, name: n, repeatDelay: r, repeatType: i, damping: a, type: o, keyframes: s } = e;
	if (!n || !(Pr.has(n) || Lr.has(n))) return !1;
	let c = t?.owner?.current;
	if (!(c instanceof HTMLElement) && !(c instanceof SVGElement)) return !1;
	let { onUpdate: l, transformTemplate: u } = t.owner.getProps();
	return Rr() && (Pr.has(n) || Lr.has(n) && Ir(s)) && (n !== "transform" || !u) && !l && !r && i !== "mirror" && a !== 0 && o !== "inertia";
}
// node_modules/motion-dom/dist/es/value/types/utils/get-as-type.mjs
var Br = (e, t) => t && typeof e == "number" ? t.transform(e) : e, Vr = {
	x: "translateX",
	y: "translateY",
	z: "translateZ",
	transformPerspective: "perspective"
}, Hr = qn.length;
function Ur(e, t, n) {
	let r = "", i = !0;
	for (let a = 0; a < Hr; a++) {
		let o = qn[a], s = e[o];
		if (s === void 0) continue;
		let c = !0;
		if (typeof s == "number") c = s === +!!o.startsWith("scale");
		else {
			let e = parseFloat(s);
			c = o.startsWith("scale") ? e === 1 : e === 0;
		}
		if (!c || n) {
			let e = Br(s, kn[o]);
			if (!c) {
				i = !1;
				let t = Vr[o] || o;
				r += `${t}(${e}) `;
			}
			n && (t[o] = e);
		}
	}
	let a = e.pathRotation;
	return a && (i = !1, r += `rotate(${Br(a, kn.pathRotation)}) `), r = r.trim(), n ? r = n(t, i ? "" : r) : i && (r = "none"), r;
}
// node_modules/motion-dom/dist/es/animation/waapi/transforms/groups.mjs
var Wr = /* @__PURE__ */ new WeakMap(), Gr = 200, Kr = .001, qr = .1, Jr = .001, Yr = 100, Xr = (e) => /^(linear|ease(In|Out|InOut))$/.test(e), Zr = (e, t) => e - t, Qr = (e, t, n) => {
	let r = [];
	for (let i = 0; i <= n; i++) r.push(ut(e, t, i / n));
	return r;
}, $r = (e) => e.motionValue.owner, ei = (e) => Wr.get(e), ti = (e, t) => e.latestValues ? e.latestValues[t] : e.getValue(t)?.get(), ni = ({ name: e, motionValue: t }) => e && qn.includes(e) && t?.owner?.current instanceof HTMLElement && Rr() && vr();
function ri(e) {
	let t = $r(e), { onUpdate: n, transformTemplate: r } = t.getProps();
	return !e.isHandoff && !n && !e.hasOnUpdate && !r && e.type !== "inertia" && (ti(t, "transform") || "none") === "none" && !ti(t, "pathRotation") && !t.projection?.isProjecting();
}
var ii = class extends Sn {
	constructor(e) {
		let t = $r(e).current, { driver: n = Pt } = e, r, i = ri(e);
		e.driver = (e) => {
			let i = n(e);
			return {
				js: i,
				now: i.now,
				start: (e = !0) => {
					let n = ei(t);
					!n || n.isJS ? i.start(e) : n.schedule(!1, !e);
				},
				stop: () => {
					i.stop();
					let e = ei(t);
					e && !e.isFinishing && e.release(r);
				}
			};
		}, super(e), r = this, this.canAccelerate = i;
		let { stop: a } = this;
		this.stop = () => {
			this.isAccelerated() && this.sync(), a();
		};
	}
	get group() {
		return ei($r(this.options).current);
	}
	get js() {
		return this.driver?.js;
	}
	get name() {
		return this.options.name;
	}
	timing() {
		let { startTime: e, speed: t, totalDuration: n } = this, { delay: r = 0, repeatType: i } = this.options;
		return this.holdTime === null ? n === Infinity ? [e + r / t, this.resolvedDuration * (i === "loop" ? 1 : 2) / t || 1] : [e + (r + n) / t, 0] : [Infinity, 0];
	}
	isAccelerated() {
		let { group: e, state: t } = this;
		return e?.tracks.has(this) && !e.isJS && this.canAccelerate && (t === "running" || t === "paused");
	}
	liveValue() {
		return this.isAccelerated() ? this.sampleAt(K.now()) : void 0;
	}
	tween() {
		let { keyframes: e, type: t, ease: n, times: r, repeat: i, delay: a = 0 } = this.options, o = /* @__PURE__ */ ue(n) ? yr(n) : Xr(n) && br[n];
		if (o && !i && !r && e.length === 2 && t === on && this.holdTime === null) {
			let e = this.startTime + a / this.speed;
			return [
				e,
				e + this.resolvedDuration / this.speed,
				o
			];
		}
	}
	boundaries(e, t) {
		let { startTime: n, speed: r, resolvedDuration: i, options: a } = this, { delay: o = 0, repeat: s = 0, repeatDelay: c = 0, repeatType: l, times: u, keyframes: d, type: f } = a, p = (f || on) === on ? u || nn(d) : [0, 1], m = n + o / r, h = [];
		if (this.holdTime !== null || !(i > 0)) return h;
		for (let n = Math.max(0, Math.floor((e - m) * r / i)); n <= s; n++) {
			let a = m + n * i / r;
			if (a > t) break;
			for (let o of p) {
				let s = a + (n % 2 && l && l !== "loop" ? 1 - o : o) * (i - c) / r;
				s > e && s < t && h.push(s);
			}
		}
		return h;
	}
	numberAt(e) {
		return parseFloat(this.sampleAt(e, !0));
	}
	sync() {
		let e = K.now();
		this.options.motionValue.setWithVelocity(this.sampleAt(e - 10, !0), this.sampleAt(e, !0), 10);
	}
	play() {
		this.isStopped || ((this.group || ai($r(this.options))).tracks.add(this), super.play());
	}
	pause() {
		super.pause(), this.isAccelerated() && (this.sync(), this.group.schedule(!1));
	}
	complete() {
		super.complete();
		let { group: e } = this;
		e && !e.isJS && this.canAccelerate && this.tick(K.now());
	}
	get time() {
		return this.isAccelerated() ? /* @__PURE__ */ L(E(0, this.totalDuration, this.at(K.now()) - (this.options.delay || 0))) : super.time;
	}
	set time(e) {
		super.time = e, this.isAccelerated() && this.sync();
	}
	attachTimeline(e) {
		return this.canAccelerate = !1, this.group?.demote(!0), super.attachTimeline(e);
	}
};
function ai(e) {
	let t = e.current, n = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Map(), i = {}, a = [], o = /* @__PURE__ */ new Map(), s = [], c = !1, l = !1, u = !1, d = !1, f = -Infinity, p = (e) => {
		for (let t of n) if (t.name === e) return !0;
	}, m = (t, n) => {
		let o = {};
		for (let s of t === void 0 ? qn : a) {
			let a = r.get(s), c = t === void 0 ? ti(e, s) : a ? a.sampleAt(n > t && !a.timing()[1] ? n : t) : i[s];
			c !== void 0 && (o[s] = c);
		}
		return o;
	}, h = (e, t) => {
		let n = "", r = m(e, t);
		for (let e in r) n += (Vr[e] || e) + "(" + Br(r[e], kn[e]) + ") ";
		return n || "none";
	}, g = (e = m()) => {
		t.style.transform = Ur(e, {});
	}, _ = (e = !0) => {
		e && g(), s.forEach(({ animation: e }) => e.cancel()), s = [];
	}, v = (e, t, n = Infinity) => {
		let r = {
			animation: e,
			offset: t,
			end: n
		};
		e.startTime = K.now() + t, n < Infinity && (e.onfinish = () => {
			r.isDone = !0, s.some((e) => e.end === Infinity) && (e.cancel(), s = s.filter((e) => e !== r)), O.schedule(!1);
		}), e.oncancel = () => s.includes(r) && O.demote(), s.push(r);
	}, y = (e, t, n) => {
		let r = (t, n) => Math.abs(e(n) - e(t)), i = r(t, n);
		for (; n - t > .01;) {
			let e = (t + n) / 2;
			r(t, e) > r(e, n) ? n = e : t = e;
		}
		return r(t, n) > i / 2 ? [t, n] : [];
	}, b = (e, t, n, r) => {
		let i = Math.min(Gr, Math.max(2, Math.ceil((n - t) / 10)));
		if (r.length * 4 > i) return;
		let a = Qr(t, n, i).concat(r).sort(Zr), o = (e) => /* @__PURE__ */ P(t, n, e), s, c;
		for (let t of e) {
			let e = a.map((e) => t.numberAt(e)), [n] = e, r = e.map((e) => e - n), i = r[r.length - 1], o = r.some((e) => Math.abs(e) * Kr > Math.abs(i)) ? 0 : i, l = r.map((e) => o ? e / o : e);
			if (!o) {
				if (l.some((e) => !(Math.abs(e) <= Kr))) return;
			} else if (!s) s = l, c = (e) => (t.numberAt(e) - n) / o;
			else if (l.some((e, t) => !(Math.abs(e - s[t]) <= Kr))) return;
		}
		if (!s || s.every((e, t) => Math.abs(e - o(a[t])) <= Kr)) return "linear";
		let l = [], u = (e, t = c(e)) => l.push(xn(t) + " " + xn(o(e) * 100) + "%");
		return s.forEach((e, t) => {
			t && Math.abs(e - s[t - 1]) > .2 && y(c, a[t - 1], a[t]).forEach((e) => u(e)), u(a[t], e);
		}), "linear(" + l + ")";
	}, x = (e, t, n, r) => {
		let i = [t], a = (t, n) => e.every((e) => !(Math.abs(e.numberAt((t + n) / 2) - (e.numberAt(t) + e.numberAt(n)) / 2) > (e.name.startsWith("scale") ? Jr : qr))), o = (t, n, r) => {
			if (n - t < 1 || a(t, n)) i.push(n);
			else if (r < 4) o(t, (t + n) / 2, r + 1), o((t + n) / 2, n, r + 1);
			else {
				for (let r of e) i.push(...y((e) => r.numberAt(e), t, n));
				i.push(n);
			}
		}, s = Qr(t, n, Math.ceil((n - t) / 100));
		for (let e of r) s.push(e, Math.min(e + .01, n));
		let c = t;
		for (let e of s.sort(Zr)) e > c && o(c, e, 0), c = e;
		return i.sort(Zr);
	}, S = (e) => {
		let t;
		for (let n of e) {
			let e = n.tween();
			if (!e || t?.some((t, n) => n < 2 ? Math.abs(e[n] - t) > 1 : e[n] !== t)) return;
			t = e;
		}
		return t;
	}, C = (e, n, r, i = { fill: "both" }, a, o) => {
		let s = e.flatMap((e) => e.boundaries(n, r)), c = o || b(e, n, r, s), l = c ? [n, r] : x(e, n, r, s), u = l.map((e) => h(e, a)), d = { transform: u };
		return c || (d.offset = l.map((e) => /* @__PURE__ */ P(n, r, e))), u.every((e) => e === u[0]) && (g(m(n, a)), d = null), t.animate(d, {
			...i,
			duration: r - n,
			easing: c || "linear"
		});
	}, w = (c) => {
		let l = c, u = 0, d = 0, f = [], p = [], m = /* @__PURE__ */ new Set();
		r.clear(), o = /* @__PURE__ */ new Map();
		for (let e of n) {
			r.set(e.name, e);
			let [t, n] = e.timing(), i = t === Infinity;
			if (o.set(e, [
				e.at(c),
				e.speed,
				i
			]), i) e.sync();
			else {
				if (e.speed < 0) return;
				if (n) {
					if (u) {
						let e = (t - d) / n;
						if (Math.abs(n - u) > 1 || Math.abs(e - Math.round(e)) * u > 1) return;
					} else u = n, d = t;
					p.push(e);
				} else m.add(t);
				f.push(e), l = Math.max(l, t);
			}
		}
		i = {}, a = qn.filter((t) => {
			if (r.has(t)) return !0;
			let n = i[t] = ti(e, t);
			return n !== void 0 && parseFloat(n) !== +!!t.startsWith("scale");
		}), _(!1);
		let h = !u && S(f);
		try {
			if (h && h[1] > c) {
				let [e, t, n] = h;
				v(C(f, e, t, void 0, void 0, n), e - c, t - e);
			} else l > c && (v(C(f, c, l), 0, l - c), m.forEach((e) => e < l - 1 && v(t.animate(null, { duration: e - c }), 0, e - c)));
			if (u) {
				let e = d + Math.floor((l - d) / u) * u;
				v(C(p, e, e + u, {
					iterations: Infinity,
					iterationStart: (l - e) / u,
					fill: "forwards"
				}, l), l - c);
			}
		} catch {
			return;
		}
		return s.length || _(), !0;
	}, T = (e) => {
		let t, r = 0;
		for (let i of n) {
			let n = o.get(i);
			if (!n) return !1;
			let [a, s, c] = n, l = i.at(e), u = i.timing()[0] === Infinity;
			if (c) {
				if (u && l === a) continue;
				return !1;
			}
			let d = (l - a) / s, f = u ? 0 : i.speed / s;
			if (t === void 0) t = d, r = f;
			else if (Math.abs(d - t) > 1 || f !== r) return !1;
		}
		if (t === void 0) return !0;
		if (!s.length) return !1;
		for (let { offset: e, end: n, isDone: r } of s) {
			let i = t - e;
			if (n < Infinity && (r ? i < n - 1 : i < 0 || i >= n)) return !1;
		}
		for (let { animation: n, offset: i, isDone: a } of s) {
			if (a) continue;
			let o = t - i;
			r ? (n.playbackRate = r, n.startTime = e - o / r) : (n.pause(), n.currentTime = o);
		}
		return !0;
	}, E = () => !n.size && (u = !0, ei(t) === O && Wr.delete(t), O.isJS || _(), !0), D = () => {
		let t = K.now();
		if (O.isJS || (O.isFinishing = !0, n.forEach((n) => {
			let [r, a] = n.timing();
			n.state === "running" && n.speed > 0 && !a && r <= t + 1 && (n.complete(), i[n.name] = ti(e, n.name), o.has(n) || (c = !0));
		}), O.isFinishing = !1), l = !1, u || (n.forEach(({ state: e }, t) => {
			(e === "idle" || e === "finished") && n.delete(t);
		}), E())) return;
		for (let e of n) if (!e.canAccelerate) return O.demote(!0);
		O.isJS && (O.isJS = !1, c = !0, n.forEach((e) => e.js?.stop()));
		let r = c, a = d;
		if (c = d = !1, r || !T(t)) {
			if (a) {
				if (t - f < Yr) return O.demote();
				f = t;
			}
			if (!w(t)) return O.demote();
		}
	}, O = {
		tracks: n,
		isJS: !1,
		isFinishing: !1,
		schedule(e, t) {
			u || (c ||= e, d ||= !!t, l || (l = !0, W.isProcessing ? jt.render(D, !1, !0) : queueMicrotask(D)));
		},
		release(e) {
			let { state: t } = e;
			(t === "idle" || t === "finished") && n.delete(e), E() || O.schedule(!0);
		},
		check() {
			if (!O.isJS) {
				for (let t in i) if (ti(e, t) !== i[t] && !p(t)) return O.schedule(!0, !0);
			}
		},
		demote(e) {
			O.isJS || u || (n.forEach((t) => {
				t.isAccelerated() && t.sync(), e || (t.canAccelerate = !1);
			}), O.isJS = !0, o = /* @__PURE__ */ new Map(), _(), n.forEach((e) => e.state === "running" && e.js?.start()));
		}
	};
	return Wr.set(t, O), O;
}
// node_modules/motion-dom/dist/es/animation/AsyncMotionValueAnimation.mjs
var oi = class extends yn {
	constructor(e) {
		super(), this.stop = () => {
			this._animation && (this._animation.stop(), this.stopTimeline?.()), this.keyframeResolver?.cancel();
		}, this.createdAt = K.now();
		let { keyframes: t, name: n, motionValue: r, element: i } = e, a = e;
		a.autoplay ??= !0, a.delay ??= 0, a.type ??= "keyframes", a.repeat ??= 0, a.repeatDelay ??= 0, a.repeatType ??= "loop";
		let o = i?.KeyframeResolver || fr;
		this.keyframeResolver = new o(t, (e, t, n) => this.onKeyframesResolved(e, t, a, !n), n, r, i), this.keyframeResolver?.scheduleResolve();
	}
	onKeyframesResolved(e, t, n, r) {
		this.keyframeResolver = void 0;
		let { name: i, type: a, velocity: o, delay: s, isHandoff: c, onUpdate: l } = n;
		this.resolvedAt = K.now();
		let u = !0;
		Mr(e, i, a, o) || (u = !1, (D.instantAnimations || !s) && l?.(dn(e, n, t)), e[0] = e[e.length - 1], Nr(n), n.repeat = 0);
		let { onComplete: d } = n;
		n.finalKeyframe = t, n.keyframes = e, n.onComplete = () => {
			d?.(), this.notifyFinished();
		};
		let f = u && !c && zr(n), p = !f && ni(n);
		r && (f || p || this.resolvedAt !== this.createdAt) && (n.startTime ??= hn(this.createdAt, this.resolvedAt));
		let m;
		if (f) {
			n.element = n.motionValue?.owner?.current;
			try {
				m = new kr(n);
			} catch {
				m = new Sn(n);
			}
		} else m = p ? new ii(n) : new Sn(n);
		this.pendingTimeline &&= (this.stopTimeline = m.attachTimeline(this.pendingTimeline), void 0), this._animation = m;
	}
	get finished() {
		return this._animation ? this._animation.finished : super.finished;
	}
	then(e, t) {
		return this.finished.finally(e).then(() => {});
	}
	liveValue() {
		return this._animation?.liveValue?.();
	}
	get animation() {
		return this._animation || (this.keyframeResolver?.resume(), ur()), this._animation;
	}
	get duration() {
		return this.animation.duration;
	}
	get iterationDuration() {
		return this.animation.iterationDuration;
	}
	get time() {
		return this.animation.time;
	}
	set time(e) {
		this.animation.time = e;
	}
	get speed() {
		return this.animation.speed;
	}
	get state() {
		return this.animation.state;
	}
	set speed(e) {
		this.animation.speed = e;
	}
	get startTime() {
		return this.animation.startTime;
	}
	attachTimeline(e) {
		return this._animation ? this.stopTimeline = this.animation.attachTimeline(e) : this.pendingTimeline = e, () => this.stop();
	}
	play() {
		this.animation.play();
	}
	pause() {
		this.animation.pause();
	}
	complete() {
		this.animation.complete();
	}
	cancel() {
		this._animation && this.animation.cancel(), this.keyframeResolver?.cancel();
	}
};
// node_modules/motion-dom/dist/es/animation/utils/calc-child-stagger.mjs
function si(e, t, n, r = 0, i = 1) {
	let a = Array.from(e).sort((e, t) => e.sortNodePosition(t)).indexOf(t), o = e.size, s = (o - 1) * r;
	return typeof n == "function" ? n(a, o) : i === 1 ? a * r : s - a * r;
}
// node_modules/motion-dom/dist/es/value/index.mjs
var ci = 30, li = (e) => !isNaN(parseFloat(e)), ui = { current: void 0 }, di = class {
	constructor(e, t = {}) {
		this.canTrackVelocity = null, this.events = {}, this.updateAndNotify = (e) => {
			let t = K.now();
			if (this.updatedAt !== t && this.setPrevFrameValue(), this.prev = this.current, this.setCurrent(e), this.current !== this.prev && (this.notifyChange(), this.dependents)) for (let e of this.dependents) e.dirty();
		}, this.hasAnimated = !1, this.setCurrent(e), this.owner = t.owner;
	}
	setCurrent(e) {
		this.current = e, this.updatedAt = K.now(), this.canTrackVelocity === null && e !== void 0 && (this.canTrackVelocity = li(this.current));
	}
	setPrevFrameValue(e = this.current) {
		this.prevFrameValue = e, this.prevUpdatedAt = this.updatedAt;
	}
	onChange(e) {
		return this.on("change", e);
	}
	on(e, t) {
		var n;
		return e === "change" ? this.onChangeSubscribe(t) : ((n = this.events)[e] || (n[e] = new F())).add(t);
	}
	onChangeSubscribe(e) {
		let { events: t } = this;
		return !t.change && !this.changeSubscriber ? this.changeSubscriber = e : (t.change || (t.change = new F(), t.change.add(this.changeSubscriber), this.changeSubscriber = void 0), t.change.add(e)), () => {
			this.changeSubscriber === e ? this.changeSubscriber = void 0 : t.change?.remove(e), this.stopIfUnobserved();
		};
	}
	stopIfUnobserved() {
		jt.read(() => {
			!this.changeSubscriber && !this.events.change?.getSize() && this.stop();
		});
	}
	clearListeners() {
		this.changeSubscriber = void 0;
		for (let e in this.events) this.events[e].clear();
	}
	attach(e, t) {
		this.passiveEffect = e, this.stopPassiveEffect = t;
	}
	set(e) {
		this.passiveEffect ? this.passiveEffect(e, this.updateAndNotify) : this.updateAndNotify(e);
	}
	setWithVelocity(e, t, n) {
		this.set(t), this.prev = void 0, this.prevFrameValue = e, this.prevUpdatedAt = this.updatedAt - n;
	}
	jump(e, t = !0) {
		this.updateAndNotify(e), this.prev = e, this.prevUpdatedAt = this.prevFrameValue = void 0, t && this.stop(), this.stopPassiveEffect && this.stopPassiveEffect();
	}
	dirty() {
		this.notifyChange();
	}
	notifyChange() {
		let { current: e, changeSubscriber: t } = this;
		t ? t(e) : this.events.change?.notify(e);
	}
	addDependent(e) {
		this.dependents ||= /* @__PURE__ */ new Set(), this.dependents.add(e);
	}
	removeDependent(e) {
		this.dependents && this.dependents.delete(e);
	}
	get() {
		ui.current && ui.current.push(this);
		let e = this.animation?.liveValue?.();
		return e === void 0 ? this.current : e;
	}
	getCurrent() {
		return this.current;
	}
	getPrevious() {
		return this.prev;
	}
	getVelocity() {
		let e = K.now();
		if (!this.canTrackVelocity || this.prevFrameValue === void 0 || e - this.updatedAt > ci) return 0;
		let t = Math.min(this.updatedAt - this.prevUpdatedAt, ci);
		return /* @__PURE__ */ ee(parseFloat(this.current) - parseFloat(this.prevFrameValue), t);
	}
	start(e) {
		return this.stop(), new Promise((t) => {
			this.hasAnimated = !0;
			let n = !1, r;
			r = e(() => {
				n = !0, this.events.animationComplete?.notify(), this.animation === r && this.clearAnimation(), t();
			}), n || (this.animation = r), this.events.animationStart?.notify();
		});
	}
	stop() {
		this.animation && (this.animation.stop(), this.events.animationCancel && this.events.animationCancel.notify()), this.clearAnimation();
	}
	isAnimating() {
		return !!this.animation;
	}
	clearAnimation() {
		this.animation = void 0;
	}
	destroy() {
		this.dependents?.clear(), this.events.destroy?.notify(), this.clearListeners(), this.stop(), this.stopPassiveEffect && this.stopPassiveEffect();
	}
};
function fi(e, t) {
	return new di(e, t);
}
// node_modules/motion-dom/dist/es/animation/utils/resolve-transition.mjs
function pi(e, t) {
	if (e?.inherit && t) {
		let { inherit: n, ...r } = e;
		return {
			...t,
			...r
		};
	}
	return e;
}
// node_modules/motion-dom/dist/es/animation/utils/get-value-transition.mjs
function mi(e, t) {
	let n = e?.[t] ?? e?.default ?? e;
	return n === e ? n : pi(n, e);
}
// node_modules/motion-dom/dist/es/animation/utils/default-transitions.mjs
var hi = {
	type: "spring",
	stiffness: 500,
	damping: 25,
	restSpeed: 10
}, gi = (e) => ({
	type: "spring",
	stiffness: 550,
	damping: e === 0 ? 2 * Math.sqrt(550) : 30,
	restSpeed: 10
}), _i = {
	type: "keyframes",
	duration: .8
}, vi = {
	type: "keyframes",
	ease: [
		.25,
		.1,
		.35,
		1
	],
	duration: .3
}, yi = (e, { keyframes: t }) => t.length > 2 ? _i : Jn.has(e) ? e.startsWith("scale") ? gi(t[1]) : hi : vi, bi = /* @__PURE__ */ new Set([
	"when",
	"delay",
	"delayChildren",
	"staggerChildren",
	"staggerDirection",
	"repeat",
	"repeatType",
	"repeatDelay",
	"from",
	"elapsed"
]);
function xi(e) {
	for (let t in e) if (!bi.has(t)) return !0;
	return !1;
}
// node_modules/motion-dom/dist/es/animation/interfaces/motion-value.mjs
var Si = (e, t, n, r = {}, i, a) => (o) => {
	let s = mi(r, e) || {}, c = s.delay || r.delay || 0, { elapsed: l = 0 } = r;
	l -= /* @__PURE__ */ I(c);
	let u = {
		keyframes: Array.isArray(n) ? n : [null, n],
		ease: "easeOut",
		velocity: t.getVelocity(),
		...s,
		delay: -l,
		onUpdate: (e) => {
			t.set(e), s.onUpdate && s.onUpdate(e);
		},
		onComplete: () => {
			o(), s.onComplete && s.onComplete();
		},
		name: e,
		motionValue: t,
		element: a ? void 0 : i,
		hasOnUpdate: !!s.onUpdate
	};
	xi(s) || Object.assign(u, yi(e, u)), u.duration &&= /* @__PURE__ */ I(u.duration), u.repeatDelay &&= /* @__PURE__ */ I(u.repeatDelay), u.from !== void 0 && (u.keyframes[0] = u.from);
	let d = !1;
	if ((u.type === !1 || u.duration === 0 && !u.repeatDelay) && (Nr(u), u.delay === 0 && (d = !0)), (D.instantAnimations || D.skipAnimations || i?.shouldSkipAnimations || s.skipAnimations) && (d = !0, Nr(u), u.delay = 0), u.allowFlatten = !s.type && !s.ease, d && !a && t.get() !== void 0) {
		let e = dn(u.keyframes, s);
		if (e !== void 0) {
			jt.update(() => {
				u.onUpdate(e), u.onComplete();
			});
			return;
		}
	}
	return s.isSync ? new Sn(u) : new oi(u);
}, Ci = /^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u;
function wi(e) {
	let t = Ci.exec(e);
	if (!t) return [,];
	let [, n, r, i] = t;
	return [`--${n ?? r}`, i];
}
function Ti(e, t, n = 1) {
	`${e}`;
	let [r, i] = wi(e);
	if (!r) return;
	let a = window.getComputedStyle(t).getPropertyValue(r);
	if (a) {
		let e = a.trim();
		return O(e) ? parseFloat(e) : e;
	}
	return ve(i) ? Ti(i, t, n + 1) : i;
}
// node_modules/motion-dom/dist/es/render/utils/resolve-variants.mjs
function Ei(e) {
	let t = [{}, {}];
	return e?.values.forEach((e, n) => {
		t[0][n] = e.get(), t[1][n] = e.getVelocity();
	}), t;
}
function Di(e, t, n, r) {
	let i = (t) => typeof t == "function" ? t(n === void 0 ? e.custom : n, ...Ei(r)) : t;
	return t = i(t), typeof t == "string" && (t = e.variants && e.variants[t]), i(t);
}
// node_modules/motion-dom/dist/es/render/utils/resolve-dynamic-variants.mjs
function Oi(e, t, n) {
	return Di(e.getProps(), t, n, e);
}
var ki = (e, t) => t === "exit" ? e.presenceContext?.custom : void 0, Ai = /* @__PURE__ */ new Set([
	"width",
	"height",
	"top",
	"left",
	"right",
	"bottom",
	...qn
]), ji = (e) => Array.isArray(e);
// node_modules/motion-dom/dist/es/render/utils/setters.mjs
function Mi(e, t, n) {
	e.hasValue(t) ? e.getValue(t).set(n) : e.addValue(t, fi(n));
}
function Ni(e) {
	return ji(e) ? e[e.length - 1] || 0 : e;
}
function Pi(e, t) {
	let { transitionEnd: n = {}, transition: r = {}, ...i } = Oi(e, t) || {};
	i = {
		...i,
		...n
	};
	for (let t in i) Mi(e, t, Ni(i[t]));
}
// node_modules/motion-dom/dist/es/value/utils/is-motion-value.mjs
var Fi = (e) => !!(e && e.getVelocity);
// node_modules/motion-dom/dist/es/value/will-change/is.mjs
function Ii(e) {
	return !!(Fi(e) && e.add);
}
// node_modules/motion-dom/dist/es/value/will-change/add-will-change.mjs
function Li(e, t) {
	let n = e.getValue("willChange");
	if (Ii(n)) return n.add(t);
	if (!n && D.WillChange) {
		let n = new D.WillChange("auto");
		e.addValue("willChange", n), n.add(t);
	}
}
// node_modules/motion-dom/dist/es/animation/optimized-appear/data-id.mjs
var Ri = "data-framer-appear-id";
// node_modules/motion-dom/dist/es/animation/optimized-appear/get-appear-id.mjs
function zi(e) {
	return e.props[Ri];
}
// node_modules/motion-dom/dist/es/animation/interfaces/visual-element-target.mjs
var Bi = typeof window < "u";
function Vi({ protectedKeys: e, needsAnimating: t }, n) {
	let r = n in e && !t[n];
	return t[n] = !1, r;
}
function Hi(e, t, { delay: n = 0, transitionOverride: r, type: i } = {}) {
	let { transition: a, transitionEnd: o, ...s } = t, c = e.getDefaultTransition();
	a = a ? pi(a, c) : c;
	let l = a?.reduceMotion, u = a?.skipAnimations;
	r && (a = r);
	let d = [], f = i && e.animationState?.getState()[i], p = a?.path;
	p && (p.animateValues ? p.animateValues((t) => e.getValue(t, e.latestValues[t] ?? 0), s, a, n, d) : p.animateVisualElement?.(e, s, a, n, d));
	for (let t in s) {
		let r = e.getValue(t, e.latestValues[t] ?? null), i = s[t];
		if (i === void 0 || f && Vi(f, t)) continue;
		let o = {
			delay: n,
			...mi(a || {}, t)
		};
		u && (o.skipAnimations = !0);
		let c = r.get();
		if (c !== void 0 && !r.isAnimating() && !Array.isArray(i) && i === c && !o.velocity) {
			jt.update(() => r.set(i));
			continue;
		}
		let p = !1;
		if (Bi && window.MotionHandoffAnimation) {
			let n = zi(e);
			if (n) {
				let e = window.MotionHandoffAnimation(n, t, jt);
				e !== null && (o.startTime = e, p = !0);
			}
		}
		Li(e, t);
		let m = l ?? e.shouldReduceMotion;
		r.start(Si(t, r, i, m && Ai.has(t) ? { type: !1 } : o, e, p));
		let h = r.animation;
		h && d.push(h);
	}
	if (o) {
		let t = () => jt.update(() => {
			o && Pi(e, o);
		});
		d.length ? Promise.all(d).then(t) : t();
	}
	return d;
}
// node_modules/motion-dom/dist/es/animation/interfaces/visual-element-variant.mjs
function Ui(e, t, n = {}) {
	let r = Oi(e, t, ki(e, n.type)), i = n.transitionOverride || (r?.transition ?? (e.getDefaultTransition() || {})), a = () => Promise.all(r ? Hi(e, r, n) : []), o = (r = 0) => {
		let { variantChildren: a } = e, { delayChildren: o = 0, staggerChildren: s, staggerDirection: c } = i, l = [];
		return a?.forEach((e) => {
			e.notify("AnimationStart", t), l.push(Ui(e, t, {
				...n,
				delay: r + (typeof o == "function" ? 0 : o) + si(a, e, o, s, c)
			}).then(() => e.notify("AnimationComplete", t)));
		}), Promise.all(l);
	}, { when: s } = i;
	return s ? s === "beforeChildren" ? a().then(() => o()) : o().then(a) : Promise.all([a(), o(n.delay)]);
}
// node_modules/motion-dom/dist/es/animation/interfaces/visual-element.mjs
function Wi(e, t, n = {}) {
	return e.notify("AnimationStart", t), (Array.isArray(t) ? Promise.all(t.map((t) => Ui(e, t, n))) : typeof t == "string" ? Ui(e, t, n) : Promise.all(Hi(e, Oi(e, t, n.custom), n))).then(() => {
		e.notify("AnimationComplete", t);
	});
}
// node_modules/motion-dom/dist/es/value/types/auto.mjs
var Gi = {
	test: (e) => e === "auto",
	parse: (e) => e
}, Ki = (e) => (t) => t.test(e), qi = [
	xe,
	J,
	Ie,
	Fe,
	Re,
	Le,
	Gi
], Ji = (e) => qi.find(Ki(e));
// node_modules/motion-dom/dist/es/animation/keyframes/utils/is-none.mjs
function Yi(e) {
	return typeof e == "number" ? e === 0 : e === null || e === "none" || e === "0" || A(e);
}
// node_modules/motion-dom/dist/es/animation/keyframes/utils/make-none-animatable.mjs
var Y = /* @__PURE__ */ new Set([
	"auto",
	"none",
	"0"
]);
function Xi(e, t, n) {
	let r = 0, i;
	for (; r < e.length && !i;) {
		let t = e[r];
		typeof t == "string" && !Y.has(t) && Qe(t) && (i = e[r]), r++;
	}
	if (i && n) for (let r of t) e[r] !== i && (e[r] = Nn(n, i));
}
// node_modules/motion-dom/dist/es/animation/keyframes/DOMKeyframesResolver.mjs
var Zi = class extends fr {
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i, !0);
	}
	scheduleResolve() {
		if (this.canReadNow() && (this.readKeyframes(), !this.needsMeasurement)) return this.complete();
		super.scheduleResolve();
	}
	canReadNow() {
		let { unresolvedKeyframes: e, element: t, motionValue: n } = this, r = e[0] ?? n?.get();
		if (!t?.current || r === void 0) return !1;
		for (let t = 0; t < e.length; t++) if (be(t ? e[t] : r)) return !1;
		return !0;
	}
	readKeyframes() {
		let { unresolvedKeyframes: e, element: t, name: n } = this;
		if (!t || !t.current) return;
		super.readKeyframes();
		for (let n = 0; n < e.length; n++) {
			let r = e[n];
			if (typeof r == "string" && (r = r.trim(), ve(r))) {
				let i = Ti(r, t.current);
				i !== void 0 && (e[n] = i), n === e.length - 1 && (this.finalKeyframe = r);
			}
		}
		if (this.resolveNoneKeyframes(), !Ai.has(n) || e.length !== 2) return;
		let [r, i] = e;
		if (typeof r == "number" && typeof i == "number") return;
		let a = Ji(r), o = Ji(i);
		if (be(r) !== be(i) && rr[n]) this.needsMeasurement = !0;
		else if (a !== o) {
			if (Yn(a) && Yn(o)) for (let t = 0; t < e.length; t++) {
				let n = e[t];
				typeof n == "string" && (e[t] = parseFloat(n));
			}
			else rr[n] && (this.needsMeasurement = !0);
		}
	}
	resolveNoneKeyframes() {
		let { unresolvedKeyframes: e, name: t } = this, n = [];
		for (let t = 0; t < e.length; t++) (e[t] === null || Yi(e[t])) && n.push(t);
		n.length && Xi(e, n, t);
	}
	measure() {
		let { element: e, name: t } = this;
		return rr[t](window.getComputedStyle(e.current), () => e.measureViewportBox());
	}
	measureInitialState() {
		let { element: e, unresolvedKeyframes: t, name: n } = this;
		if (!e || !e.current) return;
		n === "height" && (this.suspendedScrollY = window.pageYOffset), this.measuredOrigin = this.measure(), t[0] = this.measuredOrigin;
		let r = t[t.length - 1];
		r !== void 0 && this.motionValue?.jump(r, !1);
	}
	measureEndState() {
		let { element: e, unresolvedKeyframes: t } = this;
		if (!e || !e.current) return;
		this.motionValue?.jump(this.measuredOrigin, !1);
		let n = t.length - 1, r = t[n];
		t[n] = this.measure(), r !== null && this.finalKeyframe === void 0 && (this.finalKeyframe = r), this.removedTransforms?.length && this.removedTransforms.forEach(([t, n]) => {
			e.getValue(t).set(n);
		}), this.resolveNoneKeyframes();
	}
}, Qi = [
	"borderTopLeftRadius",
	"borderTopRightRadius",
	"borderBottomRightRadius",
	"borderBottomLeftRadius"
];
// node_modules/motion-dom/dist/es/utils/is-html-element.mjs
function $i(e) {
	return k(e) && "offsetHeight" in e && !("ownerSVGElement" in e);
}
// node_modules/motion-dom/dist/es/utils/is-svg-element.mjs
function ea(e) {
	return k(e) && "ownerSVGElement" in e;
}
// node_modules/motion-dom/dist/es/scope/active.mjs
var ta = {};
function na(e) {
	return ta.current?.add(e), e;
}
var ra = (e) => ta.current ? ta.current.bind(e) : e;
// node_modules/motion-dom/dist/es/utils/resolve-elements.mjs
function ia(e, t, n) {
	if (e == null) return [];
	if (e instanceof EventTarget) return [e];
	if (typeof e == "string") {
		let r = t ? t.current : ta.current?.root || document, i = n?.[e] ?? r.querySelectorAll(e);
		return i ? Array.from(i) : [];
	}
	return Array.from(e).filter((e) => e != null);
}
// node_modules/motion-dom/dist/es/render/dom/utils/camel-to-dash.mjs
function aa(e) {
	return e.replace(/([A-Z])/g, (e) => `-${e.toLowerCase()}`);
}
// node_modules/motion-dom/dist/es/render/html/utils/build-styles.mjs
function oa(e, t, n) {
	let { style: r, vars: i, transformOrigin: a } = e, o = !1, s = !1;
	for (let e in t) {
		let n = t[e];
		if (Jn.has(e)) o = !0;
		else if (ge(e)) i[e] = n;
		else {
			let t = Br(n, kn[e]);
			e.startsWith("origin") ? (s = !0, a[e] = t) : r[e] = t;
		}
	}
	if (t.transform || (o || n ? r.transform = Ur(t, e.transform, n) : r.transform &&= "none"), s) {
		let { originX: e = "50%", originY: t = "50%", originZ: n = 0 } = a;
		r.transformOrigin = `${e} ${t} ${n}`;
	}
}
// node_modules/motion-dom/dist/es/render/svg/utils/path.mjs
var sa = {
	offset: "stroke-dashoffset",
	array: "stroke-dasharray"
}, ca = {
	offset: "strokeDashoffset",
	array: "strokeDasharray"
};
function la(e, t, n = 1, r = 0, i = !0) {
	e.pathLength = 1;
	let a = i ? sa : ca;
	e[a.offset] = `${-r}`, e[a.array] = `${t} ${n}`;
}
// node_modules/motion-dom/dist/es/render/svg/utils/build-attrs.mjs
var ua = [
	"transform",
	"opacity",
	"clipPath",
	"filter",
	"offsetDistance",
	"offsetPath",
	"offsetRotate",
	"offsetAnchor"
];
function da(e, { attrX: t, attrY: n, attrScale: r, pathLength: i, pathSpacing: a = 1, pathOffset: o = 0, ...s }, c, l, u) {
	if (oa(e, s, l), c) {
		e.style.viewBox && (e.attrs.viewBox = e.style.viewBox);
		return;
	}
	e.attrs = e.style, e.style = {};
	let { attrs: d, style: f } = e;
	for (let e of ua) d[e] !== void 0 && (f[e] = d[e], delete d[e]);
	(f.transform || d.transformOrigin) && (f.transformOrigin = d.transformOrigin ?? "50% 50%", delete d.transformOrigin), f.transform && (f.transformBox = u?.transformBox ?? "fill-box", delete d.transformBox), t !== void 0 && (d.x = t), n !== void 0 && (d.y = n), r !== void 0 && (d.scale = r), i !== void 0 && la(d, i, a, o, !1);
}
// node_modules/motion-dom/dist/es/projection/geometry/conversion.mjs
function fa({ top: e, left: t, right: n, bottom: r }) {
	return {
		x: {
			min: t,
			max: n
		},
		y: {
			min: e,
			max: r
		}
	};
}
function pa({ x: e, y: t }) {
	return {
		top: t.min,
		right: e.max,
		bottom: t.max,
		left: e.min
	};
}
function ma(e, t) {
	if (!t) return e;
	let n = t({
		x: e.left,
		y: e.top
	}), r = t({
		x: e.right,
		y: e.bottom
	});
	return {
		top: n.y,
		left: n.x,
		bottom: r.y,
		right: r.x
	};
}
// node_modules/motion-dom/dist/es/projection/utils/has-transform.mjs
function ha(e) {
	return e === void 0 || e === 1;
}
function ga({ scale: e, scaleX: t, scaleY: n }) {
	return !ha(e) || !ha(t) || !ha(n);
}
function _a(e) {
	return ga(e) || va(e) || e.z || e.rotate || e.rotateX || e.rotateY || e.rotateZ || e.skewX || e.skewY;
}
function va(e) {
	return ya(e.x) || ya(e.y);
}
function ya(e) {
	return e && e !== "0%";
}
// node_modules/motion-dom/dist/es/projection/geometry/delta-apply.mjs
function ba(e, t, n) {
	return n + t * (e - n);
}
function xa(e, t, n, r, i) {
	return i !== void 0 && (e = ba(e, i, r)), ba(e, n, r) + t;
}
function Sa(e, t = 0, n = 1, r, i) {
	e.min = xa(e.min, t, n, r, i), e.max = xa(e.max, t, n, r, i);
}
function Ca(e, { x: t, y: n }) {
	Sa(e.x, t.translate, t.scale, t.originPoint), Sa(e.y, n.translate, n.scale, n.originPoint);
}
var wa = .999999999999, Ta = 1.0000000000001;
function Ea(e, t, n, r = !1) {
	let i = n.length;
	if (!i) return;
	t.x = t.y = 1;
	let a, o;
	for (let s = 0; s < i; s++) {
		a = n[s], o = a.projectionDelta;
		let { visualElement: i } = a.options;
		i && i.props.style && i.props.style.display === "contents" || (r && a.options.layoutScroll && a.scroll && a !== a.root && (Da(e.x, -a.scroll.offset.x), Da(e.y, -a.scroll.offset.y)), o && (t.x *= o.x.scale, t.y *= o.y.scale, Ca(e, o)), r && _a(a.latestValues) && Aa(e, a.latestValues, a.layout?.layoutBox));
	}
	t.x < Ta && t.x > wa && (t.x = 1), t.y < Ta && t.y > wa && (t.y = 1);
}
function Da(e, t) {
	e.min += t, e.max += t;
}
function Oa(e, t, n, r, i = .5) {
	Sa(e, t, n, ut(e.min, e.max, i), r);
}
function ka(e, t) {
	return typeof e == "string" ? parseFloat(e) / 100 * (t.max - t.min) : e;
}
function Aa(e, t, n) {
	let r = n ?? e;
	Oa(e.x, ka(t.x, r.x), t.scaleX, t.scale, t.originX), Oa(e.y, ka(t.y, r.y), t.scaleY, t.scale, t.originY);
}
// node_modules/motion-dom/dist/es/projection/utils/measure.mjs
function ja(e, t) {
	return fa(ma(e.getBoundingClientRect(), t));
}
function Ma(e, t, n) {
	let r = ja(e, n), { scroll: i } = t;
	return i && (Da(r.x, i.offset.x), Da(r.y, i.offset.y)), r;
}
// node_modules/motion-dom/dist/es/frameloop/microtask.mjs
var { schedule: Na, cancel: Pa } = /* @__PURE__ */ At(queueMicrotask, !1);
// node_modules/motion-dom/dist/es/animation/animate/single-value.mjs
function Fa(e, t, n) {
	let r = Fi(e) ? e : fi(e);
	return r.start(Si("", r, t, n)), r.animation;
}
// node_modules/motion-dom/dist/es/projection/styles/scale-correction.mjs
var Ia = {}, La = {
	value: null,
	addProjectionMetrics: null
};
// node_modules/motion-dom/dist/es/utils/delay.mjs
function Ra(e, t) {
	let n = K.now();
	e = ra(e);
	let r = ({ timestamp: i }) => {
		let a = i - n;
		a >= t && (Mt(r), e(a - t));
	};
	return jt.setup(r, !0), na(() => Mt(r));
}
// node_modules/motion-dom/dist/es/utils/is-svg-svg-element.mjs
function za(e) {
	return ea(e) && e.tagName === "svg";
}
// node_modules/motion-dom/dist/es/value/utils/resolve-motion-value.mjs
function Ba(e) {
	return Fi(e) ? e.get() : e;
}
// node_modules/motion-dom/dist/es/value/utils/as-number.mjs
var Va = (e) => typeof e == "number" ? e : parseFloat(e), Ha = Qi.length, Ua = [
	"rotate",
	"rotateX",
	"rotateY",
	"rotateZ",
	"skewX",
	"skewY"
], Wa = Ua.length, Ga = (e) => typeof e == "number" || J.test(e);
function Ka(e, t, n, r, i, a) {
	i ? (e.opacity = ut(0, n.opacity ?? 1, Ja(r)), e.opacityExit = ut(t.opacity ?? 1, 0, Ya(r))) : a && (e.opacity = ut(t.opacity ?? 1, n.opacity ?? 1, r));
	for (let i = 0; i < Ha; i++) {
		let a = Qi[i], o = qa(t, a), s = qa(n, a);
		(o !== void 0 || s !== void 0) && (o ||= 0, s ||= 0, o === 0 || s === 0 || Ga(o) === Ga(s) ? (e[a] = Math.max(ut(Va(o), Va(s), r), 0), (Ie.test(s) || Ie.test(o)) && (e[a] += "%")) : e[a] = s);
	}
	for (let i = 0; i < Wa; i++) {
		let a = Ua[i];
		(t[a] || n[a]) && (e[a] = ut(t[a] || 0, n[a] || 0, r));
	}
}
function qa(e, t) {
	return e[t] === void 0 ? e.borderRadius : e[t];
}
var Ja = /*@__PURE__*/ Xa(0, .5, se), Ya = /*@__PURE__*/ Xa(.5, .95, M);
function Xa(e, t, n) {
	return (r) => r < e ? 0 : r > t ? 1 : n(/* @__PURE__ */ P(e, t, r));
}
// node_modules/motion-dom/dist/es/projection/geometry/copy.mjs
function Za(e, t) {
	e.min = t.min, e.max = t.max;
}
function Qa(e, t) {
	Za(e.x, t.x), Za(e.y, t.y);
}
function $a(e, t) {
	e.translate = t.translate, e.scale = t.scale, e.originPoint = t.originPoint, e.origin = t.origin;
}
// node_modules/motion-dom/dist/es/projection/geometry/delta-calc.mjs
var eo = .9999, to = 1.0001, no = -.01, ro = .01;
function io(e) {
	return e.max - e.min;
}
function ao(e, t, n) {
	return Math.abs(e - t) <= n;
}
function oo(e, t, n, r = .5) {
	e.origin = r, e.originPoint = ut(t.min, t.max, e.origin), e.scale = io(n) / io(t), e.translate = ut(n.min, n.max, e.origin) - e.originPoint, (e.scale >= eo && e.scale <= to || isNaN(e.scale)) && (e.scale = 1), (e.translate >= no && e.translate <= ro || isNaN(e.translate)) && (e.translate = 0);
}
function so(e, t, n, r) {
	oo(e.x, t.x, n.x, r ? r.originX : void 0), oo(e.y, t.y, n.y, r ? r.originY : void 0);
}
function co(e, t, n, r = 0) {
	e.min = (r ? ut(n.min, n.max, r) : n.min) + t.min, e.max = e.min + io(t);
}
function lo(e, t, n, r) {
	co(e.x, t.x, n.x, r?.x), co(e.y, t.y, n.y, r?.y);
}
function uo(e, t, n, r = 0) {
	let i = r ? ut(n.min, n.max, r) : n.min;
	e.min = t.min - i, e.max = e.min + io(t);
}
function fo(e, t, n, r) {
	uo(e.x, t.x, n.x, r?.x), uo(e.y, t.y, n.y, r?.y);
}
// node_modules/motion-dom/dist/es/projection/geometry/delta-remove.mjs
function po(e, t, n, r, i) {
	return e -= t, e = ba(e, 1 / n, r), i !== void 0 && (e = ba(e, 1 / i, r)), e;
}
function mo(e, t = 0, n = 1, r = .5, i, a = e, o = e) {
	if (Ie.test(t) && (t = parseFloat(t), t = ut(o.min, o.max, t / 100) - o.min), typeof t != "number") return;
	let s = ut(a.min, a.max, r);
	e === a && (s -= t), e.min = po(e.min, t, n, s, i), e.max = po(e.max, t, n, s, i);
}
function ho(e, t, [n, r, i], a, o) {
	mo(e, t[n], t[r], t[i], t.scale, a, o);
}
var go = [
	"x",
	"scaleX",
	"originX"
], _o = [
	"y",
	"scaleY",
	"originY"
];
function vo(e, t, n, r) {
	ho(e.x, t, go, n ? n.x : void 0, r ? r.x : void 0), ho(e.y, t, _o, n ? n.y : void 0, r ? r.y : void 0);
}
// node_modules/motion-dom/dist/es/projection/geometry/models.mjs
var yo = () => ({
	translate: 0,
	scale: 1,
	origin: 0,
	originPoint: 0
}), bo = () => ({
	x: yo(),
	y: yo()
}), xo = () => ({
	min: 0,
	max: 0
}), So = () => ({
	x: xo(),
	y: xo()
});
// node_modules/motion-dom/dist/es/projection/geometry/utils.mjs
function Co(e) {
	return e.translate === 0 && e.scale === 1;
}
function wo(e) {
	return Co(e.x) && Co(e.y);
}
function To(e, t) {
	return e.min === t.min && e.max === t.max;
}
function Eo(e, t) {
	return To(e.x, t.x) && To(e.y, t.y);
}
function Do(e, t) {
	return Math.round(e.min) === Math.round(t.min) && Math.round(e.max) === Math.round(t.max);
}
function Oo(e, t) {
	return Do(e.x, t.x) && Do(e.y, t.y);
}
function ko(e) {
	return io(e.x) / io(e.y);
}
function Ao(e, t) {
	return e.translate === t.translate && e.scale === t.scale && e.originPoint === t.originPoint;
}
// node_modules/motion-dom/dist/es/projection/shared/stack.mjs
var jo = class {
	constructor() {
		this.members = [];
	}
	add(e) {
		w(this.members, e);
		for (let t = this.members.length - 1; t >= 0; t--) {
			let n = this.members[t];
			if (n === e || n === this.lead || n === this.prevLead) continue;
			let r = n.instance;
			r && r.isConnected !== !1 || n.snapshot || (T(this.members, n), n.unmount());
		}
		e.scheduleRender();
	}
	remove(e) {
		if (T(this.members, e), e === this.prevLead && (this.prevLead = void 0), e === this.lead) {
			let e = this.members[this.members.length - 1];
			e && this.promote(e);
		}
	}
	relegate(e) {
		for (let t = this.members.indexOf(e) - 1; t >= 0; t--) {
			let e = this.members[t];
			if (e.isPresent !== !1 && e.instance?.isConnected !== !1) return this.promote(e), !0;
		}
		return !1;
	}
	promote(e, t) {
		let n = this.lead;
		if (e !== n && (this.prevLead = n, this.lead = e, e.show(), n)) {
			n.updateSnapshot(), e.scheduleRender();
			let { layoutDependency: r } = n.options, { layoutDependency: i } = e.options;
			(r === void 0 || r !== i) && (e.resumeFrom = n, t && (n.preserveOpacity = !0), n.snapshot && (e.snapshot = n.snapshot, e.snapshot.latestValues = n.animationValues || n.latestValues), e.root?.isUpdating && (e.isLayoutDirty = !0)), e.options.crossfade === !1 && n.hide();
		}
	}
	exitAnimationComplete() {
		this.members.forEach((e) => {
			e.options.onExitComplete?.(), e.resumingFrom?.options.onExitComplete?.();
		});
	}
	scheduleRender() {
		this.members.forEach((e) => e.instance && e.scheduleRender(!1));
	}
	removeLeadSnapshot() {
		this.lead?.snapshot && (this.lead.snapshot = void 0);
	}
};
// node_modules/motion-dom/dist/es/projection/styles/scale-border-radius.mjs
function Mo(e, t) {
	return t.max === t.min ? 0 : e / (t.max - t.min) * 100;
}
var No = { correct: (e, t) => {
	if (!t.target) return e;
	if (typeof e == "string") {
		if (J.test(e)) e = parseFloat(e);
		else return e;
	}
	return `${Mo(e, t.target.x)}% ${Mo(e, t.target.y)}%`;
} }, X = {
	borderRadius: /* @__PURE__ */ Object.assign({}, No, { applyTo: /* @__PURE__ */ Qi.slice() }),
	borderTopLeftRadius: No,
	borderTopRightRadius: No,
	borderBottomLeftRadius: No,
	borderBottomRightRadius: No,
	boxShadow: { correct: (e, { treeScale: t, projectionDelta: n }) => {
		let r = e, i = ot.parse(e);
		if (i.length > 5) return r;
		let a = ot.createTransformer(e), o = typeof i[0] == "number" ? 0 : 1, s = n.x.scale * t.x, c = n.y.scale * t.y;
		i[0 + o] /= s, i[1 + o] /= c;
		let l = ut(s, c, .5);
		return typeof i[2 + o] == "number" && (i[2 + o] /= l), typeof i[3 + o] == "number" && (i[3 + o] /= l), a(i);
	} }
};
// node_modules/motion-dom/dist/es/projection/styles/transform.mjs
function Po(e, t, n) {
	let r = "", i = e.x.translate / t.x, a = e.y.translate / t.y, o = n?.z || 0;
	if ((i || a || o) && (r = `translate3d(${i}px, ${a}px, ${o}px) `), (t.x !== 1 || t.y !== 1) && (r += `scale(${1 / t.x}, ${1 / t.y}) `), n) {
		let { transformPerspective: e, rotate: t, pathRotation: i, rotateX: a, rotateY: o, rotateZ: s, skewX: c, skewY: l } = n;
		e && (r = `perspective(${e}px) ${r}`), t && (r += `rotate(${t}deg) `), i && (r += `rotate(${i}deg) `), a && (r += `rotateX(${a}deg) `), o && (r += `rotateY(${o}deg) `), s && (r += `rotateZ(${s}deg) `), c && (r += `skewX(${c}deg) `), l && (r += `skewY(${l}deg) `);
	}
	let s = e.x.scale * t.x, c = e.y.scale * t.y;
	return (s !== 1 || c !== 1) && (r += `scale(${s}, ${c})`), r || "none";
}
// node_modules/motion-dom/dist/es/projection/utils/each-axis.mjs
function Fo(e) {
	return [e("x"), e("y")];
}
// node_modules/motion-dom/dist/es/projection/utils/compare-by-depth.mjs
var Io = (e, t) => e.depth - t.depth, Lo = class {
	constructor() {
		this.children = [], this.isDirty = !1;
	}
	add(e) {
		w(this.children, e), this.isDirty = !0;
	}
	remove(e) {
		T(this.children, e), this.isDirty = !0;
	}
	forEach(e) {
		this.isDirty && this.children.sort(Io), this.isDirty = !1, this.children.forEach(e);
	}
}, Ro = {
	hasAnimatedSinceResize: !0,
	hasEverUpdated: !1
}, zo = {
	nodes: 0,
	calculatedTargetDeltas: 0,
	calculatedProjections: 0
}, Bo = [
	"",
	"X",
	"Y",
	"Z"
], Vo = 1e3, Ho = 0;
function Uo(e, t, n, r) {
	let { latestValues: i } = t;
	i[e] && (n[e] = i[e], t.setStaticValue(e, 0), r && (r[e] = 0));
}
var Wo = ({ instance: e }) => e && Wr.get(e)?.demote();
function Go(e) {
	if (e.hasCheckedOptimisedAppear = !0, e.root === e) return;
	let { visualElement: t } = e.options;
	if (!t) return;
	let n = zi(t);
	if (window.MotionHasOptimisedAnimation(n, "transform")) {
		let { layout: t, layoutId: r } = e.options;
		window.MotionCancelOptimisedAnimation(n, "transform", jt, !(t || r));
	}
	let { parent: r } = e;
	r && !r.hasCheckedOptimisedAppear && Go(r);
}
function Ko({ attachResizeListener: e, defaultParent: t, measureScroll: n, checkIsScrollRoot: r, resetTransform: i }) {
	return Object.assign(Ia, {
		...X,
		...Ia
	}), class {
		constructor(e = {}, n = t?.()) {
			this.id = Ho++, this.animationId = 0, this.animationCommitId = 0, this.children = /* @__PURE__ */ new Set(), this.options = {}, this.isTreeAnimating = !1, this.isAnimationBlocked = !1, this.isLayoutDirty = !1, this.isProjectionDirty = !1, this.isSharedProjectionDirty = !1, this.isTransformDirty = !1, this.updateManuallyBlocked = !1, this.updateBlockedByResize = !1, this.isUpdating = !1, this.isSVG = !1, this.needsReset = !1, this.shouldResetTransform = !1, this.hasCheckedOptimisedAppear = !1, this.treeScale = {
				x: 1,
				y: 1
			}, this.eventHandlers = /* @__PURE__ */ new Map(), this.hasTreeAnimated = !1, this.updateScheduled = !1, this.scheduleUpdate = () => this.update(), this.projectionUpdateScheduled = !1, this.checkUpdateFailed = () => {
				this.isUpdating && (this.isUpdating = !1, this.clearAllSnapshots());
			}, this.updateProjection = () => {
				this.projectionUpdateScheduled = !1, La.value && (zo.nodes = zo.calculatedTargetDeltas = zo.calculatedProjections = 0), this.nodes.forEach(Yo), this.nodes.forEach(os), this.nodes.forEach(ss), this.nodes.forEach(Xo), La.addProjectionMetrics && La.addProjectionMetrics(zo);
			}, this.resolvedRelativeTargetAt = 0, this.hasProjected = !1, this.isVisible = !0, this.animationProgress = 0, this.sharedNodes = /* @__PURE__ */ new Map(), this.latestValues = e, this.root = n ? n.root || n : this, this.path = n ? [...n.path, n] : [], this.parent = n, this.depth = n ? n.depth + 1 : 0;
			for (let e = 0; e < this.path.length; e++) this.path[e].shouldResetTransform = !0;
			this.root === this && (this.nodes = new Lo());
		}
		addEventListener(e, t) {
			return this.eventHandlers.has(e) || this.eventHandlers.set(e, new F()), this.eventHandlers.get(e).add(t);
		}
		notifyListeners(e, ...t) {
			let n = this.eventHandlers.get(e);
			n && n.notify(...t);
		}
		hasListeners(e) {
			return this.eventHandlers.has(e);
		}
		mount(t) {
			if (this.instance) return;
			this.isSVG = ea(t) && !za(t), this.instance = t;
			let { layoutId: n, layout: r, visualElement: i } = this.options;
			if (i && !i.current && i.mount(t), this.root.nodes.add(this), this.parent && this.parent.children.add(this), this.root.hasTreeAnimated && (r || n) && (this.isLayoutDirty = !0), e) {
				let n, r = 0, i = () => this.root.updateBlockedByResize = !1;
				jt.read(() => {
					r = window.innerWidth;
				}), e(t, () => {
					let e = window.innerWidth;
					e !== r && (r = e, this.root.updateBlockedByResize = !0, n && n(), n = Ra(i, 250), Ro.hasAnimatedSinceResize && (Ro.hasAnimatedSinceResize = !1, this.nodes.forEach(as)));
				});
			}
			n && this.root.registerSharedNode(n, this), this.addLayoutListener();
		}
		addLayoutListener() {
			let { layoutId: e, layout: t, visualElement: n, animate: r } = this.options;
			this.instance && !this.hasLayoutListener && r !== !1 && n && (e || t) && (this.hasLayoutListener = !0, this.addEventListener("didUpdate", ({ delta: e, hasLayoutChanged: t, hasRelativeLayoutChanged: r, layout: i }) => {
				if (this.isAnimationBlocked) {
					this.target = void 0, this.relativeTarget = void 0;
					return;
				}
				let a = this.options.transition || n.getDefaultTransition() || ps, { onLayoutAnimationStart: o, onLayoutAnimationComplete: s } = n.getProps(), c = !this.targetLayout || !Oo(this.targetLayout, i), l = !t && r;
				if (this.options.layoutRoot || this.resumeFrom || l || t && (c || !this.currentAnimation)) {
					this.resumeFrom && (this.resumingFrom = this.resumeFrom, this.resumingFrom.resumingFrom = void 0);
					let t = {
						...mi(a, "layout"),
						onPlay: o,
						onComplete: s
					};
					(n.shouldReduceMotion || this.options.layoutRoot) && (t.delay = 0, t.type = !1), this.startAnimation(t), this.setAnimationOrigin(e, l, t.path);
				} else t || as(this), this.isLead() && this.options.onExitComplete && this.options.onExitComplete();
				this.targetLayout = i;
			}));
		}
		unmount() {
			this.options.layoutId && this.willUpdate(), this.root.nodes.remove(this);
			let e = this.getStack();
			e && e.remove(this), this.parent && this.parent.children.delete(this), this.instance = void 0, this.eventHandlers.clear(), this.hasLayoutListener = !1, Mt(this.updateProjection);
		}
		blockUpdate() {
			this.updateManuallyBlocked = !0;
		}
		unblockUpdate() {
			this.updateManuallyBlocked = !1;
		}
		isUpdateBlocked() {
			return this.updateManuallyBlocked || this.updateBlockedByResize;
		}
		startUpdate() {
			this.isUpdateBlocked() || (this.isUpdating = !0, this.nodes && this.nodes.forEach(cs), this.animationId++);
		}
		getTransformTemplate() {
			let { visualElement: e } = this.options;
			return e && e.getProps().transformTemplate;
		}
		willUpdate(e = !0) {
			if (this.root.hasTreeAnimated = !0, this.root.isUpdateBlocked()) {
				this.options.onExitComplete && this.options.onExitComplete();
				return;
			}
			if (window.MotionCancelOptimisedAnimation && !this.hasCheckedOptimisedAppear && Go(this), !this.root.isUpdating && this.root.startUpdate(), this.isLayoutDirty) return;
			Wo(this), this.isLayoutDirty = !0;
			for (let e = 0; e < this.path.length; e++) {
				let t = this.path[e];
				t.shouldResetTransform = !0, Wo(t), (typeof t.latestValues.x == "string" || typeof t.latestValues.y == "string") && (t.isLayoutDirty = !0), t.updateScroll("snapshot"), t.options.layoutRoot && t.willUpdate(!1), t.isAnimationBlocked && (t.dragSnapshot ||= t.measure(), this.dragAncestor = t);
			}
			let { layoutId: t, layout: n } = this.options;
			if (t === void 0 && !n) return;
			let r = this.getTransformTemplate();
			this.prevTransformTemplateValue = r ? r(this.latestValues, "") : void 0, this.updateSnapshot(), e && this.notifyListeners("willUpdate");
		}
		update() {
			if (this.updateScheduled = !1, this.isUpdateBlocked()) {
				let e = this.updateBlockedByResize;
				this.unblockUpdate(), this.updateBlockedByResize = !1, this.clearAllSnapshots(), e && this.nodes.forEach($o), this.nodes.forEach(Qo);
				return;
			}
			if (this.animationId <= this.animationCommitId) {
				this.nodes.forEach(es);
				return;
			}
			this.animationCommitId = this.animationId, this.isUpdating ? (this.isUpdating = !1, this.nodes.forEach(ns), this.nodes.forEach(rs), this.nodes.forEach(is), this.nodes.forEach(qo), this.nodes.forEach(Jo)) : this.nodes.forEach(es), this.clearAllSnapshots();
			let e = K.now();
			W.delta = E(0, 1e3 / 60, e - W.timestamp), W.timestamp = e, W.isProcessing = !0, Nt.update.process(W), Nt.preRender.process(W), Nt.render.process(W), W.isProcessing = !1;
		}
		didUpdate() {
			this.updateScheduled || (this.updateScheduled = !0, Na.read(this.scheduleUpdate));
		}
		clearAllSnapshots() {
			this.nodes.forEach(Zo), this.sharedNodes.forEach((e, t) => e.members.length ? e.removeLeadSnapshot() : this.sharedNodes.delete(t));
		}
		scheduleUpdateProjection() {
			this.projectionUpdateScheduled || (this.projectionUpdateScheduled = !0, jt.preRender(this.updateProjection, !1, !0));
		}
		scheduleCheckAfterUnmount() {
			jt.postRender(() => {
				this.isLayoutDirty ? this.root.didUpdate() : this.root.checkUpdateFailed();
			});
		}
		updateSnapshot() {
			!this.snapshot && this.instance && (this.snapshot = this.measure(), this.snapshot && !io(this.snapshot.measuredBox.x) && !io(this.snapshot.measuredBox.y) && (this.snapshot = void 0));
		}
		updateLayout() {
			if (!this.instance || (this.updateScroll(), !(this.options.alwaysMeasureLayout && this.isLead()) && !this.isLayoutDirty)) return;
			if (this.resumeFrom && !this.resumeFrom.instance) for (let e = 0; e < this.path.length; e++) this.path[e].updateScroll();
			let e = this.layout;
			this.layout = this.measure(!1), this.layoutCorrected ||= So(), this.isLayoutDirty = !1, this.projectionDelta = void 0, this.notifyListeners("measure", this.layout.layoutBox);
			let { visualElement: t } = this.options;
			t && t.notify("LayoutMeasure", this.layout.layoutBox, e ? e.layoutBox : void 0);
		}
		updateScroll(e = "measure") {
			let t = !!(this.options.layoutScroll && this.instance);
			if (this.scroll && this.scroll.animationId === this.root.animationId && this.scroll.phase === e && (t = !1), t && this.instance) {
				let t = r(this.instance);
				this.scroll = {
					animationId: this.root.animationId,
					phase: e,
					isRoot: t,
					offset: n(this.instance),
					wasRoot: this.scroll ? this.scroll.isRoot : t
				};
			}
		}
		resetTransform() {
			if (!i) return;
			let e = this.isLayoutDirty || this.shouldResetTransform || this.options.alwaysMeasureLayout;
			e && Wo(this);
			let t = this.projectionDelta && !wo(this.projectionDelta), n = this.getTransformTemplate(), r = n ? n(this.latestValues, "") : void 0, a = r !== this.prevTransformTemplateValue;
			e && this.instance && (t || _a(this.latestValues) || a) && (i(this.instance, r), this.shouldResetTransform = !1, this.scheduleRender());
		}
		measure(e = !0) {
			let t = this.measurePageBox(), n = this.removeElementScroll(t);
			return e && (n = this.removeTransform(n)), _s(n), {
				animationId: this.root.animationId,
				measuredBox: t,
				layoutBox: n,
				latestValues: {},
				source: this.id
			};
		}
		measurePageBox() {
			let { visualElement: e } = this.options;
			if (!e) return So();
			let t = e.measureViewportBox();
			if (!(this.scroll?.wasRoot || this.path.some(ys))) {
				let { scroll: e } = this.root;
				e && (Da(t.x, e.offset.x), Da(t.y, e.offset.y));
			}
			return t;
		}
		removeElementScroll(e) {
			let t = So();
			if (Qa(t, e), this.scroll?.wasRoot) return t;
			for (let n = 0; n < this.path.length; n++) {
				let r = this.path[n], { scroll: i, options: a } = r;
				r !== this.root && i && a.layoutScroll && (i.wasRoot && Qa(t, e), Da(t.x, i.offset.x), Da(t.y, i.offset.y));
			}
			return t;
		}
		applyTransform(e, t = !1, n, r) {
			let i = n || So();
			Qa(i, e);
			for (let e = 0; e < this.path.length; e++) {
				let n = this.path[e];
				!t && n.options.layoutScroll && n.scroll && n !== n.root && (Da(i.x, -n.scroll.offset.x), Da(i.y, -n.scroll.offset.y)), _a(n.latestValues) && Aa(i, n.latestValues, n.layout?.layoutBox);
			}
			return !r && _a(this.latestValues) && Aa(i, this.latestValues, this.layout?.layoutBox), i;
		}
		removeTransform(e) {
			let t = So();
			Qa(t, e);
			for (let e = 0; e < this.path.length; e++) {
				let n = this.path[e];
				if (!_a(n.latestValues)) continue;
				let r;
				n.instance && (ga(n.latestValues) && n.updateSnapshot(), r = So(), Qa(r, n.measurePageBox())), vo(t, n.latestValues, n.snapshot?.layoutBox, r);
			}
			return _a(this.latestValues) && vo(t, this.latestValues), t;
		}
		setTargetDelta(e) {
			this.targetDelta = e, this.root.scheduleUpdateProjection(), this.isProjectionDirty = !0;
		}
		setOptions(e) {
			this.options = {
				...this.options,
				...e,
				crossfade: e.crossfade === void 0 || e.crossfade
			}, this.addLayoutListener();
		}
		clearMeasurements() {
			this.scroll = void 0, this.layout = void 0, this.snapshot = void 0, this.prevTransformTemplateValue = void 0, this.targetDelta = void 0, this.target = void 0, this.isLayoutDirty = !1;
		}
		forceRelativeParentToResolveTarget() {
			this.relativeParent && this.relativeParent.resolvedRelativeTargetAt !== W.timestamp && this.relativeParent.resolveTargetDelta(!0);
		}
		resolveTargetDelta(e = !1) {
			let t = this.getLead();
			this.isProjectionDirty ||= t.isProjectionDirty, this.isTransformDirty ||= t.isTransformDirty, this.isSharedProjectionDirty ||= t.isSharedProjectionDirty;
			let n = !!this.resumingFrom || this !== t;
			if (!(e || n && this.isSharedProjectionDirty || this.isProjectionDirty || this.parent?.isProjectionDirty || this.attemptToResolveRelativeTarget || this.root.updateBlockedByResize)) return;
			let { layout: r, layoutId: i } = this.options;
			if (!this.layout || !(r || i)) return;
			this.resolvedRelativeTargetAt = W.timestamp;
			let a = this.getClosestProjectingParent();
			!this.targetDelta && !this.relativeTarget && (this.options.layoutAnchor !== !1 && a && a.layout ? this.createRelativeTarget(a, this.layout.layoutBox, a.layout.layoutBox) : this.removeRelativeTarget()), (this.relativeTarget || this.targetDelta) && (this.target || (this.target = So(), this.targetWithTransforms = So()), this.relativeTarget && this.relativeTargetOrigin && this.relativeParent && this.relativeParent.target ? (this.forceRelativeParentToResolveTarget(), lo(this.target, this.relativeTarget, this.relativeParent.target, this.options.layoutAnchor || void 0)) : this.targetDelta ? (this.resumingFrom ? this.applyTransform(this.layout.layoutBox, !1, this.target, !0) : Qa(this.target, this.layout.layoutBox), Ca(this.target, this.targetDelta)) : Qa(this.target, this.layout.layoutBox), this.attemptToResolveRelativeTarget && (this.attemptToResolveRelativeTarget = !1, this.options.layoutAnchor !== !1 && a && !!a.resumingFrom == !!this.resumingFrom && !a.options.layoutScroll && a.target && this.animationProgress !== 1 ? this.createRelativeTarget(a, this.target, a.target) : this.relativeParent = this.relativeTarget = void 0), La.value && zo.calculatedTargetDeltas++);
		}
		getClosestProjectingParent() {
			if (!(!this.parent || ga(this.parent.latestValues) || va(this.parent.latestValues))) return this.parent.isProjecting() ? this.parent : this.parent.getClosestProjectingParent();
		}
		isProjecting() {
			return !!((this.relativeTarget || this.targetDelta || this.options.layoutRoot) && this.layout);
		}
		createRelativeTarget(e, t, n) {
			this.relativeParent = e, this.forceRelativeParentToResolveTarget(), this.relativeTarget = So(), this.relativeTargetOrigin = So(), fo(this.relativeTargetOrigin, t, n, this.options.layoutAnchor || void 0), Qa(this.relativeTarget, this.relativeTargetOrigin);
		}
		removeRelativeTarget() {
			this.relativeParent = this.relativeTarget = void 0;
		}
		calcProjection() {
			let e = this.getLead(), t = !!this.resumingFrom || this !== e, n = !0;
			if ((this.isProjectionDirty || this.parent?.isProjectionDirty) && (n = !1), t && (this.isSharedProjectionDirty || this.isTransformDirty) && (n = !1), this.resolvedRelativeTargetAt === W.timestamp && (n = !1), n) return;
			let { layout: r, layoutId: i } = this.options;
			if (this.isTreeAnimating = !!(this.parent && this.parent.isTreeAnimating || this.currentAnimation || this.pendingAnimation), this.isTreeAnimating || (this.targetDelta = this.relativeTarget = void 0), !this.layout || !(r || i)) return;
			Qa(this.layoutCorrected, this.layout.layoutBox);
			let a = this.treeScale.x, o = this.treeScale.y;
			Ea(this.layoutCorrected, this.treeScale, this.path, t), e.layout && !e.target && (this.treeScale.x !== 1 || this.treeScale.y !== 1) && (e.target = e.layout.layoutBox, e.targetWithTransforms = So());
			let { target: s } = e;
			s ? (!this.projectionDelta || !this.prevProjectionDelta ? this.createProjectionDeltas() : ($a(this.prevProjectionDelta.x, this.projectionDelta.x), $a(this.prevProjectionDelta.y, this.projectionDelta.y)), so(this.projectionDelta, this.layoutCorrected, s, this.latestValues), this.treeScale.x === a && this.treeScale.y === o && Ao(this.projectionDelta.x, this.prevProjectionDelta.x) && Ao(this.projectionDelta.y, this.prevProjectionDelta.y) || (this.hasProjected = !0, this.scheduleRender(), this.notifyListeners("projectionUpdate", s)), La.value && zo.calculatedProjections++) : this.prevProjectionDelta && (this.createProjectionDeltas(), this.scheduleRender());
		}
		hide() {
			this.isVisible = !1;
		}
		show() {
			this.isVisible = !0;
		}
		scheduleRender(e = !0) {
			if (this.options.visualElement?.scheduleRender(), e) {
				let e = this.getStack();
				e && e.scheduleRender();
			}
			this.resumingFrom && !this.resumingFrom.instance && (this.resumingFrom = void 0);
		}
		createProjectionDeltas() {
			this.prevProjectionDelta = bo(), this.projectionDelta = bo(), this.projectionDeltaWithTransform = bo();
		}
		setAnimationOrigin(e, t = !1, n) {
			let r = this.snapshot, i = r ? r.latestValues : {}, a = { ...this.latestValues }, o = bo();
			this.relativeParent && this.relativeParent.options.layoutRoot || (this.relativeTarget = this.relativeTargetOrigin = void 0), this.attemptToResolveRelativeTarget = !t;
			let s = So(), c = (r ? r.source : void 0) !== (this.layout ? this.layout.source : void 0), l = this.getStack(), u = !l || l.members.length <= 1, d = !(!c || u || this.options.crossfade !== !0 || this.path.some(fs));
			this.animationProgress = 0;
			let f, p = n?.interpolateProjection(e);
			this.mixTargetDelta = (t) => {
				let n = t / 1e3, r = p?.(n);
				r ? (o.x.translate = r.x, o.x.scale = ut(e.x.scale, 1, n), o.x.origin = e.x.origin, o.x.originPoint = e.x.originPoint, o.y.translate = r.y, o.y.scale = ut(e.y.scale, 1, n), o.y.origin = e.y.origin, o.y.originPoint = e.y.originPoint) : (ls(o.x, e.x, n), ls(o.y, e.y, n)), this.setTargetDelta(o), this.relativeTarget && this.relativeTargetOrigin && this.layout && this.relativeParent && this.relativeParent.layout && (fo(s, this.layout.layoutBox, this.relativeParent.layout.layoutBox, this.options.layoutAnchor || void 0), ds(this.relativeTarget, this.relativeTargetOrigin, s, n), f && Eo(this.relativeTarget, f) && (this.isProjectionDirty = !1), f ||= So(), Qa(f, this.relativeTarget)), c && (this.animationValues = a, Ka(a, i, this.latestValues, n, d, u)), r && r.rotate !== void 0 && (this.animationValues ||= a, this.animationValues.pathRotation = r.rotate), this.root.scheduleUpdateProjection(), this.scheduleRender(), this.animationProgress = n;
			}, this.mixTargetDelta(this.options.layoutRoot ? 1e3 : 0);
		}
		startAnimation(e) {
			this.notifyListeners("animationStart"), this.currentAnimation?.stop(), this.resumingFrom?.currentAnimation?.stop(), this.pendingAnimation &&= (Mt(this.pendingAnimation), void 0), this.pendingAnimation = jt.update(() => {
				Ro.hasAnimatedSinceResize = !0, this.motionValue ||= fi(0), this.motionValue.jump(0, !1), this.currentAnimation = Fa(this.motionValue, [0, 1e3], {
					...e,
					velocity: 0,
					isSync: !0,
					onUpdate: (t) => {
						this.mixTargetDelta(t), e.onUpdate && e.onUpdate(t);
					},
					onComplete: () => {
						e.onComplete && e.onComplete(), this.completeAnimation();
					}
				}), vn(this.currentAnimation, this), this.resumingFrom && (this.resumingFrom.currentAnimation = this.currentAnimation), this.pendingAnimation = void 0;
			});
		}
		completeAnimation() {
			this.resumingFrom && (this.resumingFrom.currentAnimation = void 0, this.resumingFrom.preserveOpacity = void 0);
			let e = this.getStack();
			e && e.exitAnimationComplete(), this.resumingFrom = this.currentAnimation = this.animationValues = void 0, this.notifyListeners("animationComplete");
		}
		finishAnimation() {
			this.currentAnimation && (this.mixTargetDelta && this.mixTargetDelta(Vo), this.currentAnimation.stop()), this.completeAnimation();
		}
		applyTransformsToTarget() {
			let e = this.getLead(), { targetWithTransforms: t, layout: n, latestValues: r } = e, { target: i } = e;
			if (t && i && n) {
				if (this !== e && this.layout && n && vs(this.options.animationType, this.layout.layoutBox, n.layoutBox)) {
					i = this.target || So();
					let t = io(this.layout.layoutBox.x);
					i.x.min = e.target.x.min, i.x.max = i.x.min + t;
					let n = io(this.layout.layoutBox.y);
					i.y.min = e.target.y.min, i.y.max = i.y.min + n;
				}
				Qa(t, i), Aa(t, r), so(this.projectionDeltaWithTransform, this.layoutCorrected, t, r);
			}
		}
		registerSharedNode(e, t) {
			this.sharedNodes.has(e) || this.sharedNodes.set(e, new jo()), this.sharedNodes.get(e).add(t);
			let n = t.options.initialPromotionConfig;
			t.promote({
				transition: n ? n.transition : void 0,
				preserveFollowOpacity: n && n.shouldPreserveFollowOpacity ? n.shouldPreserveFollowOpacity(t) : void 0
			});
		}
		isLead() {
			let e = this.getStack();
			return !e || e.lead === this;
		}
		getLead() {
			let { layoutId: e } = this.options;
			return e && this.getStack()?.lead || this;
		}
		getPrevLead() {
			let { layoutId: e } = this.options;
			return e ? this.getStack()?.prevLead : void 0;
		}
		getStack() {
			let { layoutId: e } = this.options;
			if (e) return this.root.sharedNodes.get(e);
		}
		promote({ needsReset: e, transition: t, preserveFollowOpacity: n } = {}) {
			let r = this.getStack();
			r && r.promote(this, n), e && (this.projectionDelta = void 0, this.needsReset = !0), t && this.setOptions({ transition: t });
		}
		relegate() {
			let e = this.getStack();
			return e ? e.relegate(this) : !1;
		}
		resetSkewAndRotation() {
			let { visualElement: e } = this.options;
			if (!e) return;
			let t = !1, { latestValues: n } = e;
			if ((n.z || n.rotate || n.rotateX || n.rotateY || n.rotateZ || n.skewX || n.skewY) && (t = !0), !t) return;
			let r = {};
			n.z && Uo("z", e, r, this.animationValues);
			for (let t = 0; t < Bo.length; t++) Uo(`rotate${Bo[t]}`, e, r, this.animationValues), Uo(`skew${Bo[t]}`, e, r, this.animationValues);
			e.render();
			for (let t in r) e.setStaticValue(t, r[t]), this.animationValues && (this.animationValues[t] = r[t]);
			e.scheduleRender();
		}
		applyProjectionStyles(e, t) {
			if (!this.instance || this.isSVG) return;
			if (!this.isVisible) {
				e.visibility = "hidden";
				return;
			}
			let n = this.getTransformTemplate();
			if (this.needsReset) {
				this.needsReset = !1, e.visibility = "", e.opacity = "", e.pointerEvents = Ba(t?.pointerEvents) || "", e.transform = n ? n(this.latestValues, "") : "none";
				return;
			}
			let r = this.getLead();
			if (!this.projectionDelta || !this.layout || !r.target) {
				this.options.layoutId && (e.opacity = this.latestValues.opacity === void 0 ? 1 : this.latestValues.opacity, e.pointerEvents = Ba(t?.pointerEvents) || ""), this.hasProjected && !_a(this.latestValues) && (e.transform = n ? n({}, "") : "none", this.hasProjected = !1);
				return;
			}
			e.visibility = "";
			let i = r.animationValues || r.latestValues;
			this.applyTransformsToTarget();
			let a = Po(this.projectionDeltaWithTransform, this.treeScale, i);
			n && (a = n(i, a)), e.transform = a;
			let { x: o, y: s } = this.projectionDelta;
			e.transformOrigin = `${o.origin * 100}% ${s.origin * 100}% 0`, e.opacity = r.animationValues ? r === this ? i.opacity ?? this.latestValues.opacity ?? 1 : this.preserveOpacity ? this.latestValues.opacity : i.opacityExit : r === this ? i.opacity === void 0 ? "" : i.opacity : i.opacityExit === void 0 ? 0 : i.opacityExit;
			for (let t in Ia) {
				if (i[t] === void 0) continue;
				let { correct: n, applyTo: o, isCSSVariable: s } = Ia[t], c = a === "none" ? i[t] : n(i[t], r);
				if (o) {
					let t = o.length;
					for (let n = 0; n < t; n++) e[o[n]] = c;
				} else s ? this.options.visualElement.renderState.vars[t] = c : e[t] = c;
			}
			this.options.layoutId && (e.pointerEvents = r === this ? Ba(t?.pointerEvents) || "" : "none");
		}
		clearSnapshot() {
			this.resumeFrom = this.snapshot = this.dragSnapshot = this.dragAncestor = void 0;
		}
		resetTree() {
			this.root.nodes.forEach((e) => e.currentAnimation?.stop()), this.root.nodes.forEach(Qo), this.root.sharedNodes.clear();
		}
	};
}
function qo(e) {
	e.updateLayout(), ts(e);
}
function Jo(e) {
	let t = e.resumeFrom?.snapshot || e.snapshot;
	if (e.isLead() && e.layout && t && e.hasListeners("didUpdate")) {
		let { layoutBox: n, measuredBox: r } = e.layout, { animationType: i } = e.options, a = t.source !== e.layout.source;
		if (i === "size") Fo((e) => {
			let r = a ? t.measuredBox[e] : t.layoutBox[e], i = io(r);
			r.min = n[e].min, r.max = r.min + i;
		});
		else if (i === "x" || i === "y") {
			let e = i === "x" ? "y" : "x";
			Za(a ? t.measuredBox[e] : t.layoutBox[e], n[e]);
		} else vs(i, t.layoutBox, n) && Fo((r) => {
			let i = a ? t.measuredBox[r] : t.layoutBox[r], o = io(n[r]);
			i.max = i.min + o, e.relativeTarget && !e.currentAnimation && (e.isProjectionDirty = !0, e.relativeTarget[r].max = e.relativeTarget[r].min + o);
		});
		let o = bo();
		so(o, n, t.layoutBox);
		let s = bo();
		a ? so(s, e.applyTransform(r, !0), t.measuredBox) : so(s, n, t.layoutBox);
		let c = !wo(o), l = !1;
		if (!e.resumeFrom) {
			let r = e.getClosestProjectingParent();
			if (r && !r.resumeFrom) {
				let { snapshot: i, layout: a } = r;
				if (i && a) {
					let o = e.options.layoutAnchor || void 0, s = So();
					fo(s, t.layoutBox, i.layoutBox, o);
					let c = So();
					fo(c, n, a.layoutBox, o), Oo(s, c) || (l = !0), r.options.layoutRoot && (e.relativeTarget = c, e.relativeTargetOrigin = s, e.relativeParent = r);
				}
			}
		}
		e.notifyListeners("didUpdate", {
			layout: n,
			snapshot: t,
			delta: s,
			layoutDelta: o,
			hasLayoutChanged: c,
			hasRelativeLayoutChanged: l
		});
	} else if (e.isLead()) {
		let { onExitComplete: t } = e.options;
		t && t();
	}
	e.options.transition = void 0;
}
function Yo(e) {
	La.value && zo.nodes++, e.parent && (e.isProjecting() || (e.isProjectionDirty = e.parent.isProjectionDirty), e.isSharedProjectionDirty ||= !!(e.isProjectionDirty || e.parent.isProjectionDirty || e.parent.isSharedProjectionDirty), e.isTransformDirty ||= e.parent.isTransformDirty);
}
function Xo(e) {
	e.isProjectionDirty = e.isSharedProjectionDirty = e.isTransformDirty = !1;
}
function Zo(e) {
	e.clearSnapshot();
}
function Qo(e) {
	e.clearMeasurements();
}
function $o(e) {
	e.isLayoutDirty = !0, e.updateLayout();
}
function es(e) {
	e.isLayoutDirty = !1;
}
function ts(e) {
	let { snapshot: t, dragAncestor: n } = e, r = n?.isAnimationBlocked && n.layout;
	if (!t || !r || e.resumeFrom || e.isAnimationBlocked) return;
	let i = n.dragSnapshot;
	Fo((e) => Da(t.layoutBox[e], r.layoutBox[e].min - i.layoutBox[e].min));
}
function ns(e) {
	e.isAnimationBlocked && e.layout && !e.isLayoutDirty && (e.snapshot = e.dragSnapshot || e.layout, e.isLayoutDirty = !0);
}
function rs(e) {
	e.relativeTarget && e.relativeParent?.isLayoutDirty && (e.currentAnimation ? e.isLayoutDirty = !0 : (e.targetDelta = void 0, e.removeRelativeTarget()));
}
function is(e) {
	let { visualElement: t } = e.options;
	t && t.getProps().onBeforeLayoutMeasure && t.notify("BeforeLayoutMeasure"), e.resetTransform();
}
function as(e) {
	e.finishAnimation(), e.targetDelta = e.relativeTarget = e.target = void 0, e.isProjectionDirty = !0;
}
function os(e) {
	e.resolveTargetDelta();
}
function ss(e) {
	e.calcProjection();
}
function cs(e) {
	e.resetSkewAndRotation();
}
function ls(e, t, n) {
	e.translate = ut(t.translate, 0, n), e.scale = ut(t.scale, 1, n), e.origin = t.origin, e.originPoint = t.originPoint;
}
function us(e, t, n, r) {
	e.min = ut(t.min, n.min, r), e.max = ut(t.max, n.max, r);
}
function ds(e, t, n, r) {
	us(e.x, t.x, n.x, r), us(e.y, t.y, n.y, r);
}
function fs(e) {
	return e.animationValues && e.animationValues.opacityExit !== void 0;
}
var ps = {
	duration: .45,
	ease: [
		.4,
		0,
		.1,
		1
	]
}, ms = (e) => typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().includes(e), hs = ms("applewebkit/") && !ms("chrome/") ? Math.round : M;
function gs(e) {
	e.min = hs(e.min), e.max = hs(e.max);
}
function _s(e) {
	gs(e.x), gs(e.y);
}
function vs(e, t, n) {
	return e === "position" || e === "preserve-aspect" && !ao(ko(t), ko(n), .2);
}
function ys(e) {
	return e !== e.root && e.scroll?.wasRoot;
}
// node_modules/motion-dom/dist/es/events/add-dom-event.mjs
function bs(e, t, n, r = { passive: !0 }) {
	return e.addEventListener(t, n, r), () => e.removeEventListener(t, n, r);
}
// node_modules/motion-dom/dist/es/projection/node/DocumentProjectionNode.mjs
var xs = /* @__PURE__ */ Ko({
	attachResizeListener: (e, t) => bs(e, "resize", t),
	measureScroll: () => ({
		x: document.documentElement.scrollLeft || document.body?.scrollLeft || 0,
		y: document.documentElement.scrollTop || document.body?.scrollTop || 0
	}),
	checkIsScrollRoot: () => !0
}), Ss = { current: void 0 }, Cs = /* @__PURE__ */ Ko({
	measureScroll: (e) => ({
		x: e.scrollLeft,
		y: e.scrollTop
	}),
	defaultParent: () => {
		if (!Ss.current) {
			let e = new xs({});
			e.mount(window), e.setOptions({ layoutScroll: !0 }), Ss.current = e;
		}
		return Ss.current;
	},
	resetTransform: (e, t) => {
		e.style.transform = t === void 0 ? "none" : t;
	},
	checkIsScrollRoot: (e) => window.getComputedStyle(e).position === "fixed"
}), ws = /* @__PURE__ */ new WeakMap();
// node_modules/motion-dom/dist/es/render/utils/is-animation-controls.mjs
function Ts(e) {
	return typeof e == "object" && !!e && typeof e.start == "function";
}
// node_modules/motion-dom/dist/es/render/utils/is-variant-label.mjs
function Es(e) {
	return typeof e == "string" || Array.isArray(e);
}
// node_modules/motion-dom/dist/es/render/utils/variant-props.mjs
var Ds = [
	"animate",
	"whileInView",
	"whileFocus",
	"whileHover",
	"whileTap",
	"whileDrag",
	"exit"
], Os = /* @__PURE__ */ ["initial"].concat(Ds);
// node_modules/motion-dom/dist/es/render/utils/is-controlling-variants.mjs
function ks(e) {
	if (Ts(e.animate)) return !0;
	for (let t = 0; t < Os.length; t++) if (Es(e[Os[t]])) return !0;
	return !1;
}
function As(e) {
	return !!(ks(e) || e.variants);
}
// node_modules/motion-dom/dist/es/render/utils/motion-values.mjs
function js(e, t, n) {
	for (let r in t) {
		let i = t[r], a = n[r];
		if (Fi(i)) e.addValue(r, i);
		else if (Fi(a)) e.addValue(r, fi(i, { owner: e }));
		else if (a !== i) {
			if (e.hasValue(r)) {
				let t = e.getValue(r);
				t.liveStyle === !0 ? t.jump(i) : t.hasAnimated || t.set(i);
			} else {
				let t = e.getStaticValue(r);
				e.addValue(r, fi(t === void 0 ? i : t, { owner: e }));
			}
		}
	}
	for (let r in n) t[r] === void 0 && e.removeValue(r);
	return t;
}
// node_modules/motion-dom/dist/es/render/utils/reduced-motion/state.mjs
var Ms = { current: null }, Ns = { current: !1 }, Ps = typeof window < "u";
function Fs() {
	if (Ns.current = !0, Ps) {
		if (window.matchMedia) {
			let e = window.matchMedia("(prefers-reduced-motion)"), t = () => Ms.current = e.matches;
			e.addEventListener("change", t), t();
		} else Ms.current = !1;
	}
}
// node_modules/motion-dom/dist/es/render/VisualElement.mjs
var Is = [
	"AnimationStart",
	"AnimationComplete",
	"Update",
	"BeforeLayoutMeasure",
	"LayoutMeasure",
	"LayoutAnimationStart",
	"LayoutAnimationComplete"
], Ls = {};
function Rs(e) {
	Ls = e;
}
function zs() {
	return Ls;
}
var Bs = class {
	scrapeMotionValuesFromProps(e, t, n) {
		return {};
	}
	constructor({ parent: e, props: t, presenceContext: n, reducedMotionConfig: r, skipAnimations: i, blockInitialAnimation: a, visualState: o }, s = {}) {
		this.current = null, this.children = /* @__PURE__ */ new Set(), this.isVariantNode = !1, this.isControllingVariants = !1, this.shouldReduceMotion = null, this.shouldSkipAnimations = !1, this.values = /* @__PURE__ */ new Map(), this.KeyframeResolver = fr, this.features = {}, this.valueSubscriptions = /* @__PURE__ */ new Map(), this.prevMotionValues = {}, this.hasBeenMounted = !1, this.events = {}, this.propEventSubscriptions = {}, this.notifyUpdate = () => this.notify("Update", this.latestValues), this.render = () => {
			this.current && (this.triggerBuild(), this.renderInstance(this.current, this.renderState, this.props.style, this.projection));
		}, this.renderScheduledAt = 0, this.scheduleRender = () => {
			let e = K.now();
			this.renderScheduledAt < e && (this.renderScheduledAt = e, jt.render(this.render, !1, !0));
		};
		let { latestValues: c, renderState: l } = o;
		this.latestValues = c, this.baseTarget = { ...c }, this.initialValues = t.initial ? { ...c } : {}, this.renderState = l, this.parent = e, this.props = t, this.presenceContext = n, this.depth = e ? e.depth + 1 : 0, this.reducedMotionConfig = r, this.skipAnimationsConfig = i, this.options = s, this.blockInitialAnimation = !!a, this.isControllingVariants = ks(t), this.isVariantNode = As(t), this.isVariantNode && (this.variantChildren = /* @__PURE__ */ new Set()), this.manuallyAnimateOnMount = !!(e && e.current);
		let { willChange: u, ...d } = this.scrapeMotionValuesFromProps(t, {}, this);
		for (let e in d) {
			let t = d[e];
			c[e] !== void 0 && Fi(t) && t.set(c[e]);
		}
	}
	mount(e) {
		if (this.hasBeenMounted) for (let e in this.initialValues) this.values.get(e)?.jump(this.initialValues[e]), this.latestValues[e] = this.initialValues[e];
		if (this.current = e, ws.set(e, this), this.projection && !this.projection.instance && this.projection.mount(e), this.isVariantNode && !this.isControllingVariants) {
			let e = this;
			do
				e = e.props.inherit !== !1 && e.parent;
			while (e && !e.isVariantNode);
			if (e) {
				let { variantChildren: t } = e;
				t.add(this), this.removeFromVariantTree = () => t.delete(this);
			}
		}
		this.values.forEach((e, t) => this.bindToMotionValue(t, e)), this.reducedMotionConfig === "never" ? this.shouldReduceMotion = !1 : this.reducedMotionConfig === "always" ? this.shouldReduceMotion = !0 : (Ns.current || Fs(), this.shouldReduceMotion = Ms.current), this.shouldSkipAnimations = this.skipAnimationsConfig ?? !1, this.parent?.addChild(this), this.update(this.props, this.presenceContext), this.hasBeenMounted = !0;
	}
	unmount() {
		this.projection && this.projection.unmount(), Mt(this.notifyUpdate), Mt(this.render), this.valueSubscriptions.forEach((e) => e()), this.valueSubscriptions.clear(), this.removeFromVariantTree && this.removeFromVariantTree(), this.parent?.removeChild(this);
		for (let e in this.events) this.events[e].clear();
		for (let e in this.features) {
			let t = this.features[e];
			t && (t.unmount(), t.isMounted = !1);
		}
		this.current = null;
	}
	addChild(e) {
		this.children.add(e), this.enteringChildren ??= /* @__PURE__ */ new Set(), this.enteringChildren.add(e);
	}
	removeChild(e) {
		this.children.delete(e), this.enteringChildren && this.enteringChildren.delete(e);
	}
	bindToMotionValue(e, t) {
		if (this.valueSubscriptions.has(e) && this.valueSubscriptions.get(e)(), t.accelerate && Pr.has(e) && this.current instanceof HTMLElement) {
			let { factory: n, keyframes: r, times: i, ease: a, duration: o } = t.accelerate, s = new Tr({
				element: this.current,
				name: e,
				keyframes: r,
				times: i,
				ease: a,
				duration: /* @__PURE__ */ I(o)
			}), c = n(s);
			this.valueSubscriptions.set(e, () => {
				c(), s.cancel();
			});
			return;
		}
		let n = Jn.has(e);
		n && this.onBindTransform && this.onBindTransform();
		let r = t.on("change", (t) => {
			this.latestValues[e] = t, this.props.onUpdate && jt.preRender(this.notifyUpdate), n && (this.projection && (this.projection.isTransformDirty = !0), Wr.get(this.current)?.check()), this.scheduleRender();
		}), i;
		typeof window < "u" && window.MotionCheckAppearSync && (i = window.MotionCheckAppearSync(this, e, t)), this.valueSubscriptions.set(e, () => {
			r(), i && i();
		});
	}
	sortNodePosition(e) {
		return !this.current || !e.current || !this.sortInstanceNodePosition || this.type !== e.type ? 0 : this.sortInstanceNodePosition(this.current, e.current);
	}
	updateFeatures() {
		let e = "animation";
		for (e in Ls) {
			let t = Ls[e];
			if (!t) continue;
			let { isEnabled: n, Feature: r } = t;
			if (!this.features[e] && r && n(this.props) && (this.features[e] = new r(this)), this.features[e]) {
				let t = this.features[e];
				t.isMounted ? t.update() : (t.mount(), t.isMounted = !0);
			}
		}
	}
	triggerBuild() {
		this.build(this.renderState, this.latestValues, this.props);
	}
	measureViewportBox() {
		return this.current ? this.measureInstanceViewportBox(this.current, this.props) : So();
	}
	getStaticValue(e) {
		return this.latestValues[e];
	}
	setStaticValue(e, t) {
		this.latestValues[e] = t;
	}
	update(e, t) {
		let { transformTemplate: n, onUpdate: r } = this.props;
		(e.transformTemplate || n) && this.scheduleRender(), (e.transformTemplate && !n || e.onUpdate && !r) && Wr.get(this.current)?.demote(), this.prevProps = this.props, this.props = e, this.prevPresenceContext = this.presenceContext, this.presenceContext = t;
		for (let t = 0; t < Is.length; t++) {
			let n = Is[t];
			this.propEventSubscriptions[n] && (this.propEventSubscriptions[n](), delete this.propEventSubscriptions[n]);
			let r = e["on" + n];
			r && (this.propEventSubscriptions[n] = this.on(n, r));
		}
		this.prevMotionValues = js(this, this.scrapeMotionValuesFromProps(e, this.prevProps || {}, this), this.prevMotionValues), this.handleChildMotionValue && this.handleChildMotionValue();
	}
	getProps() {
		return this.props;
	}
	getVariant(e) {
		return this.props.variants ? this.props.variants[e] : void 0;
	}
	getDefaultTransition() {
		return this.props.transition;
	}
	getTransformPagePoint() {
		return this.props.transformPagePoint;
	}
	addValue(e, t) {
		let n = this.values.get(e);
		if (t !== n) {
			n && this.removeValue(e), this.bindToMotionValue(e, t), this.values.set(e, t);
			let r = t.get();
			r !== void 0 && (this.latestValues[e] = r);
		}
	}
	removeValue(e) {
		this.values.delete(e);
		let t = this.valueSubscriptions.get(e);
		t && (t(), this.valueSubscriptions.delete(e)), delete this.latestValues[e], this.removeValueFromRenderState(e, this.renderState);
	}
	hasValue(e) {
		return this.values.has(e);
	}
	getValue(e, t) {
		if (this.props.values && this.props.values[e]) return this.props.values[e];
		let n = this.values.get(e);
		return n === void 0 && t !== void 0 && (n = fi(t ?? this.getDefaultValue?.(e), { owner: this }), this.addValue(e, n)), n;
	}
	readValue(e, t) {
		let n = this.latestValues[e] !== void 0 || !this.current ? this.latestValues[e] : this.getBaseTargetFromProps(this.props, e) ?? this.readValueFromInstance(this.current, e, this.options);
		return n != null && (typeof n == "string" && (O(n) || A(n)) ? n = parseFloat(n) : typeof n != "number" && !ot.test(n) && ot.test(t) && (n = Nn(e, t)), this.setBaseTarget(e, Fi(n) ? n.get() : n)), Fi(n) ? n.get() : n;
	}
	setBaseTarget(e, t) {
		this.baseTarget[e] = t;
	}
	on(e, t) {
		return this.events[e] || (this.events[e] = new F()), this.events[e].add(t);
	}
	notify(e, ...t) {
		this.events[e] && this.events[e].notify(...t);
	}
	scheduleRenderMicrotask() {
		Na.render(this.render);
	}
}, Vs = class extends Bs {
	constructor() {
		super(...arguments), this.KeyframeResolver = Zi;
	}
	sortInstanceNodePosition(e, t) {
		return e.compareDocumentPosition(t) & 2 ? 1 : -1;
	}
	getBaseTargetFromProps(e, t) {
		let n = e.style;
		return n ? n[t] : void 0;
	}
	removeValueFromRenderState(e, { vars: t, style: n }) {
		delete t[e], delete n[e];
	}
	handleChildMotionValue() {
		this.childSubscription && (this.childSubscription(), delete this.childSubscription);
		let { children: e } = this.props;
		Fi(e) && (this.childSubscription = e.on("change", (e) => {
			this.current && (this.current.textContent = `${e}`);
		}));
	}
};
// node_modules/motion-dom/dist/es/render/html/utils/render.mjs
function Hs(e, { style: t, vars: n }, r, i) {
	let a = e.style, o;
	for (o in t) a[o] = t[o];
	for (o in i?.applyProjectionStyles(a, r), n) a.setProperty(o, n[o]);
}
// node_modules/motion-dom/dist/es/render/utils/is-forced-motion-value.mjs
function Us(e, { layout: t, layoutId: n }) {
	return Jn.has(e) || e.startsWith("origin") || (t || n !== void 0) && (!!Ia[e] || e === "opacity");
}
// node_modules/motion-dom/dist/es/render/html/utils/scrape-motion-values.mjs
function Ws(e, t, n) {
	let r = e.style, i = t?.style, a = {};
	if (!r) return a;
	for (let t in r) (Fi(r[t]) || i && Fi(i[t]) || Us(t, e) || n?.getValue(t)?.liveStyle !== void 0) && (a[t] = r[t]);
	return a;
}
// node_modules/motion-dom/dist/es/render/html/HTMLVisualElement.mjs
function Gs(e) {
	return window.getComputedStyle(e);
}
var Ks = class extends Vs {
	constructor() {
		super(...arguments), this.type = "html", this.renderInstance = Hs;
	}
	mount(e) {
		e.style, super.mount(e);
	}
	readValueFromInstance(e, t) {
		if (Jn.has(t)) return this.projection?.isProjecting ? Un(t) : Gn(e, t);
		{
			let n = Gs(e), r = (ge(t) ? n.getPropertyValue(t) : n[t]) || 0;
			return typeof r == "string" ? r.trim() : r;
		}
	}
	measureInstanceViewportBox(e, { transformPagePoint: t }) {
		return ja(e, t);
	}
	build(e, t, n) {
		oa(e, t, n.transformTemplate);
	}
	scrapeMotionValuesFromProps(e, t, n) {
		return Ws(e, t, n);
	}
}, qs = (e) => e.pointerType === "mouse" ? typeof e.button != "number" || e.button <= 0 : e.isPrimary !== !1;
// node_modules/motion-dom/dist/es/events/event-info.mjs
function Js(e) {
	return { point: {
		x: e.pageX,
		y: e.pageY
	} };
}
var Ys = (e) => (t) => qs(t) && e(t, Js(t));
// node_modules/motion-dom/dist/es/events/add-pointer-event.mjs
function Xs(e, t, n, r) {
	return bs(e, t, Ys(n), r);
}
// node_modules/motion-dom/dist/es/resize/handle-element.mjs
var Zs = /* @__PURE__ */ new WeakMap(), Qs, $s = (e, t, n) => (r, i) => i && i[0] ? i[0][e + "Size"] : ea(r) && "getBBox" in r ? r.getBBox()[t] : r[n], ec = /*@__PURE__*/ $s("inline", "width", "offsetWidth"), tc = /*@__PURE__*/ $s("block", "height", "offsetHeight");
function nc({ target: e, borderBoxSize: t }) {
	Zs.get(e)?.forEach((n) => {
		n(e, {
			get width() {
				return ec(e, t);
			},
			get height() {
				return tc(e, t);
			}
		});
	});
}
function rc(e) {
	e.forEach(nc);
}
function ic() {
	typeof ResizeObserver < "u" && (Qs = new ResizeObserver(rc));
}
function ac(e, t) {
	Qs || ic();
	let n = ia(e);
	return n.forEach((e) => {
		let n = Zs.get(e);
		n || (n = /* @__PURE__ */ new Set(), Zs.set(e, n)), n.add(t), Qs?.observe(e);
	}), () => {
		n.forEach((e) => {
			let n = Zs.get(e);
			n?.delete(t), n?.size || Qs?.unobserve(e);
		});
	};
}
// node_modules/motion-dom/dist/es/resize/handle-window.mjs
var oc = /* @__PURE__ */ new Set(), sc;
function cc() {
	sc = () => {
		let e = {
			get width() {
				return window.innerWidth;
			},
			get height() {
				return window.innerHeight;
			}
		};
		oc.forEach((t) => t(e));
	}, window.addEventListener("resize", sc);
}
function lc(e) {
	return oc.add(e), sc || cc(), () => {
		oc.delete(e), !oc.size && typeof sc == "function" && (window.removeEventListener("resize", sc), sc = void 0);
	};
}
// node_modules/motion-dom/dist/es/resize/index.mjs
function uc(e, t) {
	return na(typeof e == "function" ? lc(e) : ac(e, t));
}
// node_modules/motion-dom/dist/es/utils/distance.mjs
var dc = (e, t) => Math.abs(e - t);
function fc(e, t) {
	let n = dc(e.x, t.x), r = dc(e.y, t.y);
	return Math.sqrt(n ** 2 + r ** 2);
}
// node_modules/motion-dom/dist/es/gestures/pan/PanSession.mjs
var pc = /*#__PURE__*/ new Set(["auto", "scroll"]), mc = class {
	constructor(e, t, { transformPagePoint: n, contextWindow: r = window, dragSnapToOrigin: i = !1, distanceThreshold: a = 3, element: o } = {}) {
		if (this.startEvent = null, this.lastMoveEvent = null, this.lastMoveEventInfo = null, this.lastRawMoveEventInfo = null, this.handlers = {}, this.contextWindow = window, this.scrollPositions = /* @__PURE__ */ new Map(), this.removeScrollListeners = null, this.onElementScroll = (e) => {
			this.handleScroll(e.target);
		}, this.onWindowScroll = () => {
			this.handleScroll(window);
		}, this.updatePoint = () => {
			if (!(this.lastMoveEvent && this.lastMoveEventInfo)) return;
			this.hasPendingMove = !1, this.lastRawMoveEventInfo && (this.lastMoveEventInfo = hc(this.lastRawMoveEventInfo, this.transformPagePoint));
			let e = _c(this.lastMoveEventInfo, this.history), t = this.startEvent !== null, n = fc(e.offset, {
				x: 0,
				y: 0
			}) >= this.distanceThreshold;
			if (!t && !n) return;
			let { point: r } = e;
			this.history.push({
				...r,
				timestamp: K.now()
			});
			let { onStart: i, onMove: a } = this.handlers;
			t || (i && i(this.lastMoveEvent, e), this.startEvent = this.lastMoveEvent), a && a(this.lastMoveEvent, e);
		}, this.handlePointerMove = (e, t) => {
			this.handleScroll(window), this.lastMoveEvent = e, this.lastRawMoveEventInfo = t, this.lastMoveEventInfo = hc(t, this.transformPagePoint), this.hasPendingMove = !0, jt.update(this.updatePoint, !0);
		}, this.handlePointerUp = (e, t) => {
			this.hasPendingMove && this.updatePoint(), this.end();
			let { onEnd: n, onSessionEnd: r, resumeAnimation: i } = this.handlers;
			if ((this.dragSnapToOrigin || !this.startEvent) && i && i(), !(this.lastMoveEvent && this.lastMoveEventInfo)) return;
			let a = _c(e.type === "pointercancel" ? this.lastMoveEventInfo : hc(t, this.transformPagePoint), this.history);
			this.startEvent && n && n(e, a), r && r(e, a);
		}, !qs(e)) return;
		this.dragSnapToOrigin = i, this.handlers = t, this.transformPagePoint = n, this.distanceThreshold = a, this.contextWindow = r || window;
		let s = hc(Js(e), this.transformPagePoint), { point: c } = s, { timestamp: l } = W;
		this.history = [{
			...c,
			timestamp: l
		}];
		let { onSessionStart: u } = t;
		u && u(e, _c(s, this.history));
		let d = {
			passive: !0,
			capture: !0
		};
		this.removeListeners = N(Xs(this.contextWindow, "pointermove", this.handlePointerMove, d), Xs(this.contextWindow, "pointerup", this.handlePointerUp, d), Xs(this.contextWindow, "pointercancel", this.handlePointerUp, d)), o && this.startScrollTracking(o);
	}
	startScrollTracking(e) {
		let t = e.parentElement;
		for (; t;) {
			let e = getComputedStyle(t);
			(pc.has(e.overflowX) || pc.has(e.overflowY)) && this.scrollPositions.set(t, {
				x: t.scrollLeft,
				y: t.scrollTop
			}), t = t.parentElement;
		}
		this.scrollPositions.set(window, {
			x: window.scrollX,
			y: window.scrollY
		}), window.addEventListener("scroll", this.onElementScroll, { capture: !0 }), window.addEventListener("scroll", this.onWindowScroll), this.removeScrollListeners = () => {
			window.removeEventListener("scroll", this.onElementScroll, { capture: !0 }), window.removeEventListener("scroll", this.onWindowScroll);
		};
	}
	handleScroll(e) {
		let t = this.scrollPositions.get(e);
		if (!t) return;
		let n = e === window, r = n ? {
			x: window.scrollX,
			y: window.scrollY
		} : {
			x: e.scrollLeft,
			y: e.scrollTop
		}, i = {
			x: r.x - t.x,
			y: r.y - t.y
		};
		(i.x !== 0 || i.y !== 0) && (n ? this.lastMoveEventInfo && (this.lastMoveEventInfo.point.x += i.x, this.lastMoveEventInfo.point.y += i.y) : this.history.length > 0 && (this.history[0].x -= i.x, this.history[0].y -= i.y), this.scrollPositions.set(e, r), jt.update(this.updatePoint, !0));
	}
	updateHandlers(e) {
		this.handlers = e;
	}
	end() {
		this.removeListeners && this.removeListeners(), this.removeScrollListeners && this.removeScrollListeners(), this.scrollPositions.clear(), Mt(this.updatePoint);
	}
};
function hc(e, t) {
	return t ? { point: t(e.point) } : e;
}
function gc(e, t) {
	return {
		x: e.x - t.x,
		y: e.y - t.y
	};
}
function _c({ point: e }, t) {
	return {
		point: e,
		delta: gc(e, yc(t)),
		offset: gc(e, vc(t)),
		velocity: bc(t, .1)
	};
}
function vc(e) {
	return e[0];
}
function yc(e) {
	return e[e.length - 1];
}
function bc(e, t) {
	if (e.length < 2) return {
		x: 0,
		y: 0
	};
	let n = e.length - 1, r = null, i = yc(e);
	for (; n >= 0 && (r = e[n], !(i.timestamp - r.timestamp > /* @__PURE__ */ I(t)));) n--;
	if (!r) return {
		x: 0,
		y: 0
	};
	r === e[0] && e.length > 2 && i.timestamp - r.timestamp > /* @__PURE__ */ I(t) * 2 && (r = e[1]);
	let a = /* @__PURE__ */ L(i.timestamp - r.timestamp);
	if (a === 0) return {
		x: 0,
		y: 0
	};
	let o = {
		x: (i.x - r.x) / a,
		y: (i.y - r.y) / a
	};
	return o.x === Infinity && (o.x = 0), o.y === Infinity && (o.y = 0), o;
}
// node_modules/motion-dom/dist/es/gestures/press/utils/is-keyboard-accessible.mjs
var xc = /* @__PURE__ */ new Set([
	"BUTTON",
	"INPUT",
	"SELECT",
	"TEXTAREA",
	"A"
]);
function Sc(e) {
	return xc.has(e.tagName) || e.isContentEditable === !0;
}
var Cc = /* @__PURE__ */ new Set([
	"INPUT",
	"SELECT",
	"TEXTAREA"
]);
function wc(e) {
	return Cc.has(e.tagName) || e.isContentEditable === !0;
}
// node_modules/motion-dom/dist/es/gestures/drag/state/is-active.mjs
var Tc = {
	x: !1,
	y: !1
};
function Ec() {
	return Tc.x || Tc.y;
}
// node_modules/motion-dom/dist/es/gestures/drag/state/set-active.mjs
function Dc(e) {
	return e === "x" || e === "y" ? Tc[e] ? null : (Tc[e] = !0, () => {
		Tc[e] = !1;
	}) : Tc.x || Tc.y ? null : (Tc.x = Tc.y = !0, () => {
		Tc.x = Tc.y = !1;
	});
}
// node_modules/motion-dom/dist/es/gestures/drag/utils/constraints.mjs
function Oc(e, { min: t, max: n }, r) {
	return t !== void 0 && e < t ? e = r ? ut(t, e, r.min) : Math.max(e, t) : n !== void 0 && e > n && (e = r ? ut(n, e, r.max) : Math.min(e, n)), e;
}
function kc(e, t, n) {
	return {
		min: t === void 0 ? void 0 : e.min + t,
		max: n === void 0 ? void 0 : e.max + n - (e.max - e.min)
	};
}
function Ac(e, { top: t, left: n, bottom: r, right: i }) {
	return {
		x: kc(e.x, n, i),
		y: kc(e.y, t, r)
	};
}
function jc(e, t) {
	let n = t.min - e.min, r = t.max - e.max;
	return t.max - t.min < e.max - e.min && ([n, r] = [r, n]), {
		min: n,
		max: r
	};
}
function Mc(e, t) {
	return {
		x: jc(e.x, t.x),
		y: jc(e.y, t.y)
	};
}
function Nc(e, t) {
	let n = .5, r = io(e), i = io(t);
	return i > r ? n = /* @__PURE__ */ P(t.min, t.max - r, e.min) : r > i && (n = /* @__PURE__ */ P(e.min, e.max - i, t.min)), E(0, 1, n);
}
function Pc(e, t) {
	let n = {};
	return t.min !== void 0 && (n.min = t.min - e.min), t.max !== void 0 && (n.max = t.max - e.min), n;
}
var Fc = .35;
function Ic(e = Fc) {
	return e === !1 ? e = 0 : e === !0 && (e = Fc), {
		x: Lc(e, "left", "right"),
		y: Lc(e, "top", "bottom")
	};
}
function Lc(e, t, n) {
	return {
		min: Rc(e, t),
		max: Rc(e, n)
	};
}
function Rc(e, t) {
	return typeof e == "number" ? e : e[t] || 0;
}
// node_modules/motion-dom/dist/es/gestures/drag/VisualElementDragControls.mjs
var zc = /* @__PURE__ */ new WeakMap(), Bc = class {
	constructor(e, t = () => e.getProps()) {
		this.openDragLock = null, this.isDragging = !1, this.currentDirection = null, this.originPoint = {
			x: 0,
			y: 0
		}, this.constraints = !1, this.hasMutatedConstraints = !1, this.elastic = So(), this.latestPointerEvent = null, this.latestPanInfo = null, this.visualElement = e, this.readProps = t;
	}
	start(e, { snapToCursor: t = !1, distanceThreshold: n } = {}) {
		let { presenceContext: r } = this.visualElement;
		if (r && r.isPresent === !1) return;
		let i = (e) => {
			t && this.snapToCursor(e), this.stopAnimation();
		}, a = (e, t) => {
			let { drag: n, dragPropagation: r, onDragStart: i } = this.getProps();
			if (n && !r && (this.openDragLock && this.openDragLock(), this.openDragLock = Dc(n), !this.openDragLock)) return;
			this.latestPointerEvent = e, this.latestPanInfo = t, this.isDragging = !0, this.currentDirection = null, this.resolveConstraints(), this.visualElement.projection && (this.visualElement.projection.isAnimationBlocked = !0, this.visualElement.projection.target = void 0), Fo((e) => {
				let t = this.getAxisMotionValue(e).get() || 0;
				if (ve(t) && (t = Ti(t, this.visualElement.current) || 0), J.test(t)) t = parseFloat(t);
				else if (Ie.test(t)) {
					let { projection: n } = this.visualElement;
					if (n && n.layout) {
						let r = n.layout.layoutBox[e];
						r && (t = io(r) * (parseFloat(t) / 100));
					}
				}
				this.originPoint[e] = t;
			}), i && jt.update(() => i(e, t), !1, !0), Li(this.visualElement, "transform");
			let { animationState: a } = this.visualElement;
			a && a.setActive("whileDrag", !0);
		}, o = (e, t) => {
			this.latestPointerEvent = e, this.latestPanInfo = t;
			let { dragPropagation: n, dragDirectionLock: r, onDirectionLock: i, onDrag: a } = this.getProps();
			if (!n && !this.openDragLock) return;
			let { offset: o } = t;
			if (r && this.currentDirection === null) {
				if (this.currentDirection = Kc(o), this.currentDirection === null) return;
				i && i(this.currentDirection);
			}
			this.updateAxis("x", t.point, o), this.updateAxis("y", t.point, o), this.visualElement.render(), a && jt.update(() => a(e, t), !1, !0);
		}, s = (e, t) => {
			this.latestPointerEvent = e, this.latestPanInfo = t, this.stop(e, t), this.latestPointerEvent = null, this.latestPanInfo = null;
		}, c = () => {
			let { dragSnapToOrigin: e } = this.getProps();
			(e || this.constraints) && this.startAnimation({
				x: 0,
				y: 0
			});
		}, { dragSnapToOrigin: l } = this.getProps();
		this.panSession = new mc(e, {
			onSessionStart: i,
			onStart: a,
			onMove: o,
			onSessionEnd: s,
			resumeAnimation: c
		}, {
			transformPagePoint: this.visualElement.getTransformPagePoint(),
			dragSnapToOrigin: l,
			distanceThreshold: n,
			contextWindow: this.visualElement.current?.ownerDocument.defaultView,
			element: this.visualElement.current
		});
	}
	stop(e, t, n) {
		let r = e || this.latestPointerEvent, i = t || this.latestPanInfo, a = this.isDragging;
		if (this.cancel(), !a || !i || !r) return;
		let { velocity: o } = i;
		this.startAnimation(o, n);
		let { onDragEnd: s } = this.getProps();
		s && jt.postRender(() => s(r, i));
	}
	cancel() {
		this.isDragging = !1;
		let { projection: e, animationState: t } = this.visualElement;
		e && (e.isAnimationBlocked = !1), this.endPanSession();
		let { dragPropagation: n } = this.getProps();
		!n && this.openDragLock && (this.openDragLock(), this.openDragLock = null), t && t.setActive("whileDrag", !1);
	}
	endPanSession() {
		this.panSession && this.panSession.end(), this.panSession = void 0;
	}
	updateAxis(e, t, n) {
		let { drag: r } = this.getProps();
		if (!n || !Gc(e, r, this.currentDirection)) return;
		let i = this.getAxisMotionValue(e), a = this.originPoint[e] + n[e];
		this.constraints && this.constraints[e] && (a = Oc(a, this.constraints[e], this.elastic[e])), i.set(a);
	}
	resolveConstraints() {
		let { dragConstraints: e, dragElastic: t } = this.getProps(), n = this.visualElement.projection && !this.visualElement.projection.layout ? this.visualElement.projection.measure(!1) : this.visualElement.projection?.layout, r = this.constraints;
		Vc(e) ? this.constraints ||= this.resolveRefConstraints() : this.constraints = e && n ? Ac(n.layoutBox, e) : !1, this.elastic = Ic(t), r !== this.constraints && !Vc(e) && n && this.constraints && !this.hasMutatedConstraints && Fo((e) => {
			this.constraints !== !1 && this.getAxisMotionValue(e) && (this.constraints[e] = Pc(n.layoutBox[e], this.constraints[e]));
		});
	}
	resolveRefConstraints() {
		let { dragConstraints: e, onMeasureDragConstraints: t } = this.getProps();
		if (!Vc(e)) return !1;
		let n = Hc(e), { projection: r } = this.visualElement;
		if (!r || !r.layout) return !1;
		r.root && (r.root.scroll = void 0, r.root.updateScroll());
		let i = Ma(n, r.root, this.visualElement.getTransformPagePoint()), a = Mc(r.layout.layoutBox, i);
		if (t) {
			let e = t(pa(a));
			this.hasMutatedConstraints = !!e, e && (a = fa(e));
		}
		return a;
	}
	startAnimation(e, t) {
		let { drag: n, dragMomentum: r, dragElastic: i, dragTransition: a, dragSnapToOrigin: o, onDragTransitionEnd: s } = this.getProps(), c = this.constraints || {}, l = Fo((s) => {
			if (!Gc(s, t || n, this.currentDirection)) return;
			let l = c && c[s] || {};
			(o === !0 || o === s) && (l = {
				min: 0,
				max: 0
			});
			let u = i ? 200 : 1e6, d = i ? 40 : 1e7, f = {
				type: "inertia",
				velocity: r ? e[s] : 0,
				bounceStiffness: u,
				bounceDamping: d,
				timeConstant: 750,
				restDelta: 1,
				restSpeed: 10,
				...a,
				...l
			};
			return this.startAxisValueAnimation(s, f);
		});
		return Promise.all(l).then(s);
	}
	startAxisValueAnimation(e, t) {
		let n = this.getAxisMotionValue(e);
		return Li(this.visualElement, e), n.start(Si(e, n, 0, t, this.visualElement, !1));
	}
	stopAnimation() {
		Fo((e) => this.getAxisMotionValue(e).stop());
	}
	getAxisMotionValue(e) {
		let t = `_drag${e.toUpperCase()}`;
		return this.readProps()[t] || this.visualElement.getValue(e, this.visualElement.latestValues[e] ?? 0);
	}
	snapToCursor({ clientX: e, clientY: t }) {
		let { drag: n } = this.getProps(), r = {
			x: e,
			y: t
		}, i = this.visualElement.getTransformPagePoint()?.(r) || r, a = this.visualElement.measureViewportBox();
		Fo((e) => {
			if (!Gc(e, n, this.currentDirection)) return;
			let t = this.getAxisMotionValue(e), { min: r, max: o } = a[e];
			t.set((t.get() || 0) + i[e] - ut(r, o, .5));
		});
	}
	scalePositionWithinConstraints() {
		if (!this.visualElement.current) return;
		let { drag: e, dragConstraints: t } = this.getProps(), { projection: n } = this.visualElement;
		if (!Vc(t) || !n || !this.constraints) return;
		this.stopAnimation();
		let r = this.constraints, i = {
			x: 0,
			y: 0
		};
		Fo((e) => {
			let t = this.getAxisMotionValue(e).get();
			i[e] = Nc({
				min: t,
				max: t
			}, r[e]);
		});
		let { transformTemplate: a } = this.visualElement.getProps();
		this.visualElement.current.style.transform = a ? a({}, "") : "none", n.root && n.root.updateScroll(), n.updateLayout(), this.constraints = !1, this.resolveConstraints(), Fo((t) => {
			let n = this.getAxisMotionValue(t);
			if (!Gc(t, e, null) || !n.get()) return;
			let { min: r, max: a } = this.constraints[t];
			n.set(ut(r, a, i[t]));
		}), this.visualElement.render();
	}
	addListeners() {
		if (!this.visualElement.current) return;
		zc.set(this.visualElement, this);
		let e = this.visualElement.current, t = Xs(e, "pointerdown", (t) => {
			let { drag: n, dragListener: r = !0 } = this.getProps(), i = t.target, a = i !== e && wc(i);
			n && r && !a && this.start(t);
		}), n, r = () => {
			let { dragConstraints: t } = this.getProps(), r = Vc(t) && Hc(t);
			r && (this.constraints = this.resolveRefConstraints(), n ||= Wc(e, r, () => this.scalePositionWithinConstraints()));
		}, { projection: i } = this.visualElement, a = i.addEventListener("measure", r);
		i && !i.layout && (i.root && i.root.updateScroll(), i.updateLayout()), jt.read(r);
		let o = bs(window, "resize", () => this.scalePositionWithinConstraints()), s = i.addEventListener("didUpdate", (({ delta: e, hasLayoutChanged: t }) => {
			this.isDragging && t && (Fo((t) => {
				if (!Gc(t, this.getProps().drag, this.currentDirection)) return;
				let n = this.getAxisMotionValue(t);
				this.originPoint[t] += e[t].translate, n.set(n.get() + e[t].translate);
			}), this.visualElement.render());
		}));
		return () => {
			o(), t(), a(), s && s(), n && n();
		};
	}
	getProps() {
		let e = this.readProps(), { drag: t = !1, dragDirectionLock: n = !1, dragPropagation: r = !1, dragConstraints: i = !1, dragElastic: a = Fc, dragMomentum: o = !0 } = e;
		return {
			...e,
			drag: t,
			dragDirectionLock: n,
			dragPropagation: r,
			dragConstraints: i,
			dragElastic: a,
			dragMomentum: o
		};
	}
};
function Vc(e) {
	return !!e && typeof e == "object" && ("current" in e || "nodeType" in e);
}
var Hc = (e) => "current" in e ? e.current : e;
function Uc(e) {
	let t = !0;
	return () => {
		t ? t = !1 : e();
	};
}
function Wc(e, t, n) {
	let r = uc(e, Uc(n)), i = uc(t, Uc(n));
	return () => {
		r(), i();
	};
}
function Gc(e, t, n) {
	return (t === !0 || t === e) && (n === null || n === e);
}
function Kc(e, t = 10) {
	let n = null;
	return Math.abs(e.y) > t ? n = "y" : Math.abs(e.x) > t && (n = "x"), n;
}
// node_modules/motion-dom/dist/es/gestures/utils/setup.mjs
function qc(e, t) {
	let n = ia(e), r = new AbortController();
	return [
		n,
		{
			passive: !0,
			...t,
			signal: r.signal
		},
		na(() => r.abort())
	];
}
// node_modules/motion-dom/dist/es/gestures/hover.mjs
function Jc(e) {
	return !(e.pointerType === "touch" || Ec());
}
function Yc(e, t, n = {}) {
	t = ra(t);
	let [r, i, a] = qc(e, n);
	return r.forEach((e) => {
		let n = !1, r = !1, a, o = () => {
			e.removeEventListener("pointerleave", u);
		}, s = (e) => {
			a &&= (a(e), void 0), o();
		}, c = (e) => {
			n = !1, window.removeEventListener("pointerup", c), window.removeEventListener("pointercancel", c), r && (r = !1, s(e));
		}, l = () => {
			n = !0, window.addEventListener("pointerup", c, i), window.addEventListener("pointercancel", c, i);
		}, u = (e) => {
			e.pointerType !== "touch" && (n ? r = !0 : s(e));
		};
		e.addEventListener("pointerenter", (n) => {
			if (!Jc(n)) return;
			r = !1;
			let o = t(e, n);
			typeof o == "function" && (a = o, e.addEventListener("pointerleave", u, i));
		}, i), e.addEventListener("pointerdown", l, i);
	}), a;
}
// node_modules/motion-dom/dist/es/gestures/utils/is-node-or-child.mjs
var Xc = (e, t) => t ? e === t || Xc(e, t.parentElement) : !1, Zc = /* @__PURE__ */ new WeakSet();
// node_modules/motion-dom/dist/es/gestures/press/utils/keyboard.mjs
function Qc(e) {
	return (t) => {
		t.key === "Enter" && e(t);
	};
}
function $c(e, t) {
	e.dispatchEvent(new PointerEvent("pointer" + t, {
		isPrimary: !0,
		bubbles: !0
	}));
}
var el = (e, t) => {
	let n = !1, r = Qc(() => {
		Zc.has(e) || (n = !0, $c(e, "down"));
	}), i = Qc(() => {
		n && (n = !1, $c(e, "up"));
	});
	e.addEventListener("keydown", r, t), e.addEventListener("keyup", i, t), e.addEventListener("blur", () => {
		e.removeEventListener("keydown", r), e.removeEventListener("keyup", i), n && $c(e, "cancel");
	}, {
		...t,
		once: !0
	});
};
// node_modules/motion-dom/dist/es/gestures/press/index.mjs
function tl(e) {
	return qs(e) && !Ec();
}
var nl = /* @__PURE__ */ new WeakSet();
function rl(e, t, n = {}) {
	t = ra(t);
	let [r, i, a] = qc(e, n), o = (e) => {
		let r = e.currentTarget;
		if (!tl(e) || nl.has(e)) return;
		Zc.add(r), n.stopPropagation && nl.add(e);
		let a = t(r, e), o = {
			...i,
			capture: !0
		}, s = (e, t) => {
			window.removeEventListener("pointerup", c, o), window.removeEventListener("pointercancel", l, o), Zc.has(r) && Zc.delete(r), tl(e) && typeof a == "function" && a(e, { success: t });
		}, c = (e) => {
			s(e, r === window || r === document || n.useGlobalTarget || Xc(r, e.target));
		}, l = (e) => {
			s(e, !1);
		};
		window.addEventListener("pointerup", c, o), window.addEventListener("pointercancel", l, o);
	};
	return r.forEach((e) => {
		(n.useGlobalTarget ? window : e).addEventListener("pointerdown", o, i), $i(e) && (e.addEventListener("focus", () => el(e, i), i), !Sc(e) && !e.hasAttribute("tabindex") && (e.tabIndex = 0));
	}), a;
}
// node_modules/motion-dom/dist/es/render/Feature.mjs
var il = class {
	constructor(e) {
		this.isMounted = !1, this.node = e;
	}
	update() {}
}, al = /* @__PURE__ */ new Set([
	"baseFrequency",
	"diffuseConstant",
	"kernelMatrix",
	"kernelUnitLength",
	"keySplines",
	"keyTimes",
	"limitingConeAngle",
	"markerHeight",
	"markerWidth",
	"numOctaves",
	"targetX",
	"targetY",
	"surfaceScale",
	"specularConstant",
	"specularExponent",
	"stdDeviation",
	"tableValues",
	"viewBox",
	"gradientTransform",
	"pathLength",
	"startOffset",
	"textLength",
	"lengthAdjust"
]), ol = (e) => typeof e == "string" && e.toLowerCase() === "svg";
// node_modules/motion-dom/dist/es/render/svg/utils/render.mjs
function sl(e, t, n, r) {
	Hs(e, t, void 0, r);
	for (let n in t.attrs) e.setAttribute(al.has(n) ? n : aa(n), t.attrs[n]);
}
// node_modules/motion-dom/dist/es/render/svg/utils/scrape-motion-values.mjs
function cl(e, t, n) {
	let r = Ws(e, t, n);
	for (let n in e) if (n !== "children" && (Fi(e[n]) || Fi(t[n]))) {
		let t = qn.indexOf(n) === -1 ? n : "attr" + n.charAt(0).toUpperCase() + n.substring(1);
		r[t] = e[n];
	}
	return r;
}
// node_modules/motion-dom/dist/es/render/svg/SVGVisualElement.mjs
var ll = class extends Vs {
	constructor() {
		super(...arguments), this.type = "svg", this.isSVGTag = !1, this.measureInstanceViewportBox = So;
	}
	getBaseTargetFromProps(e, t) {
		return Jn.has(t) ? super.getBaseTargetFromProps(e, t) ?? Un(t) : e[t];
	}
	getDefaultValue(e) {
		return Jn.has(e) ? this.latestValues[e] ?? Un(e) : void 0;
	}
	readValueFromInstance(e, t) {
		if (Jn.has(t)) {
			let e = jn(t);
			return e && e.default || 0;
		}
		if (ua.includes(t)) {
			let n = getComputedStyle(e)[t];
			if (typeof n == "string" && n) return n.trim();
		}
		return t = al.has(t) ? t : aa(t), e.getAttribute(t);
	}
	scrapeMotionValuesFromProps(e, t, n) {
		return cl(e, t, n);
	}
	build(e, t, n) {
		da(e, t, this.isSVGTag, n.transformTemplate, n.style);
	}
	renderInstance(e, t, n, r) {
		sl(e, t, n, r);
	}
	mount(e) {
		this.isSVGTag = ol(e.tagName), super.mount(e);
	}
};
// node_modules/motion-dom/dist/es/render/utils/shallow-compare.mjs
function ul(e, t) {
	if (!Array.isArray(t)) return !1;
	let n = t.length;
	if (n !== e.length) return !1;
	for (let r = 0; r < n; r++) if (t[r] !== e[r]) return !1;
	return !0;
}
// node_modules/motion-dom/dist/es/render/utils/animation-state.mjs
var dl = [...Ds].reverse();
function fl(e) {
	let t = (t) => Promise.all(t.map(({ animation: t, options: n }) => Wi(e, t, n))), n = ml(), r = !0, i = !1;
	function a(a) {
		let { props: o, parent: s, manuallyAnimateOnMount: c } = e, l = r || i, u = [], d = /* @__PURE__ */ new Set(), f = {}, p = Infinity, m = e;
		do
			m = m.props.inherit !== !1 && m.parent;
		while (m && !m.isControllingVariants);
		if (dl.forEach((t, r) => {
			let i = n[t], h = o[t], g = m && m.props[t], _ = h === void 0 ? Es(g) || g === !1 ? g : void 0 : h, v = Es(_), y = t === a ? i.isActive : null;
			y === !1 && (p = r);
			let b = v && h === void 0 && !(l && c);
			if (i.protectedKeys = { ...f }, !i.isActive && y === null || !_ && !i.prevProp || Ts(_) || typeof _ == "boolean") return;
			if (t === "exit" && i.isActive && y !== !0) {
				f = {
					...f,
					...i.prevResolvedValues
				};
				return;
			}
			let x = pl(i.prevProp, _), S = x || v && (y && !b || r > p), C = !1, w = Array.isArray(_) ? _ : [_], T = {};
			if (y !== !1) for (let n of w) {
				let { transition: r, transitionEnd: i, ...a } = Oi(e, n, ki(e, t)) || {};
				T = {
					...T,
					...a,
					...i
				};
			}
			let { prevResolvedValues: E } = i;
			for (let t in {
				...E,
				...T
			}) {
				if (t in f) continue;
				let n = T[t], r = E[t], a = Array.isArray(n) && Array.isArray(r) ? !ul(n, r) || x : n !== r;
				if (a && n == null) d.add(t);
				else if (a || n !== void 0 && d.has(t)) {
					S = !0, d.delete(t) && (C = !0), i.needsAnimating[t] = !0;
					let n = e.getValue(t);
					n && (n.liveStyle = !1);
				} else i.protectedKeys[t] = !0;
			}
			if (i.prevProp = _, i.prevResolvedValues = T, i.isActive && (f = {
				...f,
				...T
			}), S && (!(b && x) || C)) for (let n of w) {
				let r = { type: t };
				if (typeof n == "string" && l && c && s?.enteringChildren) {
					let t = Oi(s, n)?.transition?.delayChildren;
					r.delay = si(s.enteringChildren, e, t);
				}
				u.push({
					animation: n,
					options: r
				});
			}
		}), d.size) {
			let { initial: t } = o, n = {}, r = typeof t != "boolean" && Oi(e, Array.isArray(t) ? t[0] : t, e.presenceContext?.custom);
			r && r.transition && (n.transition = r.transition), d.forEach((i) => {
				let a = e.getValue(i);
				a && (a.liveStyle = !0);
				let s = r && !Array.isArray(t) ? r[i] : void 0, c = e.getBaseTargetFromProps(o, i);
				n[i] = (s === void 0 ? c !== void 0 && !Fi(c) ? c : e.initialValues[i] === void 0 ? e.baseTarget[i] : void 0 : s) ?? null;
			}), u.push({ animation: n });
		}
		let h = l && e.blockInitialAnimation || r && !c && (o.initial === !1 || o.initial === o.animate);
		return r = i = !1, !h && u.length ? t(u) : Promise.resolve();
	}
	function o(t, r) {
		if (n[t].isActive === r) return Promise.resolve();
		e.variantChildren?.forEach((e) => e.animationState?.setActive(t, r)), n[t].isActive = r;
		let i = a(t);
		for (let e in n) n[e].protectedKeys = {};
		return i;
	}
	return {
		animateChanges: a,
		setActive: o,
		setAnimateFunction: (n) => {
			t = n(e);
		},
		getState: () => n,
		reset: () => {
			n = ml(), i = !0;
		}
	};
}
function pl(e, t) {
	return typeof t == "string" ? t !== e : Array.isArray(t) ? !ul(t, e) : !1;
}
function ml() {
	let e = {};
	for (let t of Ds) e[t] = {
		isActive: t === "animate",
		protectedKeys: {},
		needsAnimating: {},
		prevResolvedValues: {}
	};
	return e;
}
// node_modules/framer-motion/dist/es/context/MotionConfigContext.mjs
var hl = /* @__PURE__ */ (0, y.createContext)({
	transformPagePoint: (e) => e,
	isStatic: !1,
	reducedMotion: "never"
});
// node_modules/framer-motion/dist/es/components/AnimatePresence/use-presence.mjs
function gl(e = !0) {
	let t = (0, y.useContext)(C);
	if (t === null) return [!0, null];
	let { isPresent: n, onExitComplete: r, register: i } = t, a = (0, y.useId)();
	(0, y.useEffect)(() => {
		if (e) return i(a);
	}, [e]);
	let o = (0, y.useCallback)(() => e && r && r(a), [
		a,
		r,
		e
	]);
	return !n && r ? [!1, o] : [!0];
}
// node_modules/framer-motion/dist/es/context/LazyContext.mjs
var _l = /* @__PURE__ */ (0, y.createContext)({ strict: !1 }), vl = {
	animation: [
		"animate",
		"variants",
		"whileHover",
		"whileTap",
		"exit",
		"whileInView",
		"whileFocus",
		"whileDrag"
	],
	exit: ["exit"],
	drag: ["drag", "dragControls"],
	focus: ["whileFocus"],
	hover: [
		"whileHover",
		"onHoverStart",
		"onHoverEnd"
	],
	tap: [
		"whileTap",
		"onTap",
		"onTapStart",
		"onTapCancel"
	],
	pan: [
		"onPan",
		"onPanStart",
		"onPanSessionStart",
		"onPanEnd"
	],
	inView: [
		"whileInView",
		"onViewportEnter",
		"onViewportLeave"
	],
	layout: ["layout", "layoutId"]
}, yl = !1;
function bl() {
	if (yl) return;
	let e = {};
	for (let t in vl) e[t] = { isEnabled: (e) => vl[t].some((t) => !!e[t]) };
	Rs(e), yl = !0;
}
function xl() {
	return bl(), zs();
}
// node_modules/framer-motion/dist/es/motion/features/load-features.mjs
function Sl(e) {
	let t = xl();
	for (let n in e) t[n] = {
		...t[n],
		...e[n]
	};
	Rs(t);
}
// node_modules/framer-motion/dist/es/components/MotionConfig/index.mjs
var Z = v();
function Cl({ children: e, ...t }) {
	let n = (0, y.useContext)(hl);
	t = {
		...n,
		...t
	}, t.transition = pi(t.transition, n.transition), t.isStatic = x(() => t.isStatic);
	let r = (0, y.useMemo)(() => t, [
		JSON.stringify(t.transition),
		t.transformPagePoint,
		t.reducedMotion,
		t.skipAnimations,
		t.isValidProp
	]);
	return (0, Z.jsx)(hl.Provider, {
		value: r,
		children: e
	});
}
// node_modules/framer-motion/dist/es/context/MotionContext/index.mjs
var wl = /* @__PURE__ */ (0, y.createContext)({});
// node_modules/framer-motion/dist/es/context/MotionContext/utils.mjs
function Tl(e, t) {
	if (ks(e)) {
		let { initial: t, animate: n } = e;
		return {
			initial: t === !1 || Es(t) ? t : void 0,
			animate: Es(n) ? n : void 0
		};
	}
	return e.inherit === !1 ? {} : t;
}
// node_modules/framer-motion/dist/es/context/MotionContext/create.mjs
function El(e) {
	let { initial: t, animate: n } = Tl(e, (0, y.useContext)(wl));
	return (0, y.useMemo)(() => ({
		initial: t,
		animate: n
	}), [Dl(t), Dl(n)]);
}
function Dl(e) {
	return Array.isArray(e) ? e.join(" ") : e;
}
// node_modules/framer-motion/dist/es/render/html/utils/create-render-state.mjs
var Ol = () => ({
	style: {},
	transform: {},
	transformOrigin: {},
	vars: {}
});
// node_modules/framer-motion/dist/es/render/html/use-props.mjs
function kl(e, t, n) {
	for (let r in t) !Fi(t[r]) && !Us(r, n) && (e[r] = t[r]);
}
function Al({ transformTemplate: e }, t) {
	return (0, y.useMemo)(() => {
		let n = Ol();
		return oa(n, t, e), Object.assign({}, n.vars, n.style);
	}, [t]);
}
function jl(e, t) {
	let n = e.style || {}, r = {};
	return kl(r, n, e), Object.assign(r, Al(e, t)), r;
}
function Ml(e, t) {
	let n = {}, r = jl(e, t);
	return e.drag && e.dragListener !== !1 && (n.draggable = !1, r.userSelect = r.WebkitUserSelect = r.WebkitTouchCallout = "none", r.touchAction = e.drag === !0 ? "none" : `pan-${e.drag === "x" ? "y" : "x"}`), e.tabIndex === void 0 && (e.onTap || e.onTapStart || e.whileTap) && (n.tabIndex = 0), n.style = r, n;
}
// node_modules/framer-motion/dist/es/render/svg/utils/create-render-state.mjs
var Nl = () => ({
	...Ol(),
	attrs: {}
});
// node_modules/framer-motion/dist/es/render/svg/use-props.mjs
function Pl(e, t, n, r) {
	let i = (0, y.useMemo)(() => {
		let n = Nl();
		return da(n, t, ol(r), e.transformTemplate, e.style), {
			...n.attrs,
			style: { ...n.style }
		};
	}, [t]);
	if (e.style) {
		let t = {};
		return kl(t, e.style, e), {
			...i,
			style: {
				...t,
				...i.style
			}
		};
	}
	return i;
}
// node_modules/framer-motion/dist/es/motion/utils/valid-prop.mjs
var Fl = /* @__PURE__ */ new Set(/* @__PURE__ */ "animate.exit.variants.initial.style.values.transition.transformTemplate.custom.inherit.onBeforeLayoutMeasure.onAnimationStart.onAnimationComplete.onUpdate.onDragStart.onDrag.onDragEnd.onMeasureDragConstraints.onDirectionLock.onDragTransitionEnd._dragX._dragY.onHoverStart.onHoverEnd.onViewportEnter.onViewportLeave.globalTapTarget.propagate.ignoreStrict.viewport".split("."));
function Il(e) {
	return e.startsWith("while") || e.startsWith("drag") && e !== "draggable" || e.startsWith("layout") || e.startsWith("onTap") || e.startsWith("onPan") || e.startsWith("onLayout") || Fl.has(e);
}
// node_modules/framer-motion/dist/es/render/dom/utils/filter-props.mjs
function Ll(e, t) {
	return e.startsWith("on") ? !Il(e) : t?.(e) ?? !Il(e);
}
function Rl(e, t, n, r) {
	let i = {};
	for (let a in e) a === "values" && typeof e.values == "object" || Fi(e[a]) || (Ll(a, r) || n === !0 && Il(a) || !t && !Il(a) || e.draggable && a.startsWith("onDrag")) && (i[a] = e[a]);
	return i;
}
// node_modules/framer-motion/dist/es/render/svg/lowercase-elements.mjs
var zl = [
	"animate",
	"circle",
	"defs",
	"desc",
	"ellipse",
	"g",
	"image",
	"line",
	"filter",
	"marker",
	"mask",
	"metadata",
	"path",
	"pattern",
	"polygon",
	"polyline",
	"rect",
	"stop",
	"switch",
	"symbol",
	"svg",
	"text",
	"tspan",
	"use",
	"view"
];
// node_modules/framer-motion/dist/es/render/dom/utils/is-svg-component.mjs
function Bl(e) {
	return typeof e != "string" || e.includes("-") ? !1 : !!(zl.indexOf(e) > -1 || /[A-Z]/u.test(e));
}
// node_modules/framer-motion/dist/es/render/dom/use-render.mjs
function Vl(e, t, n, { latestValues: r }, i, a = !1, o, s) {
	let c = (o ?? Bl(e) ? Pl : Ml)(t, r, i, e), l = Rl(t, typeof e == "string", a, s), u = e === y.Fragment ? {} : {
		...l,
		...c,
		ref: n
	}, { children: d } = t, f = (0, y.useMemo)(() => Fi(d) ? d.get() : d, [d]);
	return (0, y.createElement)(e, {
		...u,
		children: f
	});
}
// node_modules/framer-motion/dist/es/motion/utils/use-visual-state.mjs
function Hl({ scrapeMotionValuesFromProps: e, createRenderState: t }, n, r, i) {
	return {
		latestValues: Ul(n, r, i, e),
		renderState: t()
	};
}
function Ul(e, t, n, r) {
	let i = {}, a = r(e, {});
	for (let e in a) i[e] = Ba(a[e]);
	let { initial: o, animate: s } = e, c = ks(e), l = As(e);
	t && l && !c && e.inherit !== !1 && (o === void 0 && (o = t.initial), s === void 0 && (s = t.animate));
	let u = n ? n.initial === !1 : !1;
	u ||= o === !1;
	let d = u ? s : o;
	if (d && typeof d != "boolean" && !Ts(d)) {
		let t = Array.isArray(d) ? d : [d];
		for (let n = 0; n < t.length; n++) {
			let r = Di(e, t[n]);
			if (r) {
				let { transitionEnd: e, transition: t, ...n } = r;
				for (let e in n) {
					let t = n[e];
					if (Array.isArray(t)) {
						let e = u ? t.length - 1 : 0;
						t = t[e];
					}
					t !== null && (i[e] = t);
				}
				for (let t in e) i[t] = e[t];
			}
		}
	}
	return i;
}
var Wl = (e) => (t, n) => {
	let r = (0, y.useContext)(wl), i = (0, y.useContext)(C), a = () => Hl(e, t, r, i);
	return n ? a() : x(a);
}, Gl = /*@__PURE__*/ Wl({
	scrapeMotionValuesFromProps: Ws,
	createRenderState: Ol
}), Kl = /*@__PURE__*/ Wl({
	scrapeMotionValuesFromProps: cl,
	createRenderState: Nl
}), ql = /* @__PURE__ */ Symbol.for("motionComponentSymbol");
// node_modules/framer-motion/dist/es/motion/utils/use-motion-ref.mjs
function Jl(e, t, n) {
	let r = (0, y.useRef)(n);
	(0, y.useInsertionEffect)(() => {
		r.current = n;
	});
	let i = (0, y.useRef)(null);
	return (0, y.useCallback)((n) => {
		n && e.onMount?.(n), t && (n ? t.mount(n) : t.unmount());
		let a = r.current;
		if (typeof a == "function") {
			if (n) {
				let e = a(n);
				typeof e == "function" && (i.current = e);
			} else i.current ? (i.current(), i.current = null) : a(n);
		} else a && (a.current = n);
	}, [t]);
}
// node_modules/framer-motion/dist/es/context/SwitchLayoutGroupContext.mjs
var Yl = /* @__PURE__ */ (0, y.createContext)({});
// node_modules/framer-motion/dist/es/utils/is-ref-object.mjs
function Xl(e) {
	return e && typeof e == "object" && Object.prototype.hasOwnProperty.call(e, "current");
}
// node_modules/framer-motion/dist/es/motion/utils/use-visual-element.mjs
function Zl(e, t, n, r, i, a) {
	let { visualElement: o } = (0, y.useContext)(wl), s = (0, y.useContext)(_l), c = (0, y.useContext)(C), l = (0, y.useContext)(hl), u = l.reducedMotion, d = l.skipAnimations, f = (0, y.useRef)(null), p = (0, y.useRef)(!1);
	r ||= s.renderer, !f.current && r && (f.current = r(e, {
		visualState: t,
		parent: o,
		props: n,
		presenceContext: c,
		blockInitialAnimation: c ? c.initial === !1 : !1,
		reducedMotionConfig: u,
		skipAnimations: d,
		isSVG: a
	}), p.current && f.current && (f.current.manuallyAnimateOnMount = !0));
	let m = f.current, h = (0, y.useContext)(Yl);
	m && !m.projection && i && (m.type === "html" || m.type === "svg") && Ql(f.current, n, i, h), (0, y.useInsertionEffect)(() => {
		m && m.props !== n && m.update(n, c);
	});
	let g = n[Ri], _ = (0, y.useRef)(!!g && typeof window < "u" && !window.MotionHandoffIsComplete?.(g) && window.MotionHasOptimisedAnimation?.(g));
	return S(() => {
		p.current && m && (m.animationState?.animateChanges(), m.enteringChildren = void 0);
	}, []), S(() => {
		p.current = !0, m && (window.MotionIsMounted = !0, m.updateFeatures(), m.scheduleRenderMicrotask(), _.current && m.animationState && m.animationState.animateChanges());
	}), (0, y.useEffect)(() => {
		m && (!_.current && m.animationState && m.animationState.animateChanges(), _.current &&= (queueMicrotask(() => {
			window.MotionHandoffMarkAsComplete?.(g);
		}), !1), m.enteringChildren = void 0);
	}), m;
}
function Ql(e, t, n, r) {
	let { layoutId: i, layout: a, drag: o, dragConstraints: s, layoutScroll: c, layoutRoot: l, layoutAnchor: u, layoutCrossfade: d } = t, f = e.projection = new n(e.latestValues, t["data-framer-portal-id"] ? void 0 : $l(e.parent));
	f.setOptions({
		layoutId: i,
		layout: a,
		alwaysMeasureLayout: !!o || s && Xl(s),
		visualElement: e,
		animationType: typeof a == "string" ? a : "both",
		initialPromotionConfig: r,
		crossfade: d,
		layoutScroll: c,
		layoutRoot: l,
		layoutAnchor: u
	});
	let p = f.getStack()?.lead;
	p && !f.root.isUpdateBlocked() && (p.willUpdate(), p.scheduleCheckAfterUnmount());
}
function $l(e) {
	if (e) return e.options.allowProjection === !1 ? $l(e.parent) : e.projection;
}
// node_modules/framer-motion/dist/es/motion/index.mjs
function eu(e, { forwardMotionProps: t = !1, type: n } = {}, r, i) {
	r && Sl(r);
	let a = n ? n === "svg" : Bl(e), o = a ? Kl : Gl;
	function s(n, s) {
		let c, l = tu(n);
		x(() => !!Ss.current?.sharedNodes.get(l)?.lead && n.initial) && (n = {
			...n,
			initial: !1
		});
		let u = {
			...(0, y.useContext)(hl),
			...n,
			layoutId: l
		}, { isStatic: d, isValidProp: f } = u, p = El(n), m = o(n, d);
		if (!d && typeof window < "u") {
			nu(u, r);
			let t = ru(u);
			c = t.MeasureLayout, p.visualElement = Zl(e, m, u, i, t.ProjectionNode, a);
		}
		return (0, Z.jsxs)(wl.Provider, {
			value: p,
			children: [c && p.visualElement ? (0, Z.jsx)(c, {
				visualElement: p.visualElement,
				...u
			}) : null, Vl(e, n, Jl(m, p.visualElement, s), m, d, t, a, f)]
		});
	}
	s.displayName = `motion.${typeof e == "string" ? e : `create(${e.displayName ?? e.name ?? ""})`}`;
	let c = (0, y.forwardRef)(s);
	return c[ql] = e, c;
}
function tu({ layoutId: e }) {
	let t = (0, y.useContext)(b).id;
	return t && e !== void 0 ? t + "-" + e : e;
}
function nu(e, t) {
	(0, y.useContext)(_l).strict;
}
function ru(e) {
	let { drag: t, layout: n } = xl();
	if (!t && !n) return {};
	let r = {
		...t,
		...n
	};
	return {
		MeasureLayout: t?.isEnabled(e) || n?.isEnabled(e) ? r.MeasureLayout : void 0,
		ProjectionNode: r.ProjectionNode
	};
}
// node_modules/framer-motion/dist/es/render/components/create-proxy.mjs
function iu(e, t) {
	if (typeof Proxy > "u") return eu;
	let n = /* @__PURE__ */ new Map(), r = (n, r) => eu(n, r, e, t);
	return new Proxy((e, t) => r(e, t), { get: (i, a) => a === "create" ? r : (n.has(a) || n.set(a, eu(a, void 0, e, t)), n.get(a)) });
}
// node_modules/framer-motion/dist/es/render/dom/create-visual-element.mjs
var au = (e, t) => t.isSVG ?? Bl(e) ? new ll(t) : new Ks(t, { allowProjection: e !== y.Fragment }), ou = class extends il {
	constructor(e) {
		super(e), e.animationState ||= fl(e);
	}
	updateAnimationControlsSubscription() {
		let { animate: e } = this.node.getProps();
		Ts(e) && (this.unmountControls = e.subscribe(this.node));
	}
	mount() {
		this.updateAnimationControlsSubscription();
	}
	update() {
		let { animate: e } = this.node.getProps(), { animate: t } = this.node.prevProps || {};
		e !== t && this.updateAnimationControlsSubscription();
	}
	unmount() {
		this.node.animationState.reset(), this.unmountControls?.();
	}
}, su = 0, cu = {
	animation: { Feature: ou },
	exit: { Feature: class extends il {
		constructor() {
			super(...arguments), this.id = su++;
		}
		update() {
			let { presenceContext: e, prevPresenceContext: t, animationState: n } = this.node;
			if (!e || !n) return;
			let { isPresent: r, onExitComplete: i } = e, a = t?.isPresent;
			if (r === a) return;
			if (r && a === !1) {
				if (this.exit === !0) {
					let { initial: e } = this.node.getProps();
					if (e && !Array.isArray(e)) {
						let { transition: t, transitionEnd: n, ...r } = Oi(this.node, e) || {};
						for (let e in r) this.node.getValue(e)?.jump(r[e]);
					}
					this.node.blockInitialAnimation = !1, n.reset(), n.animateChanges();
				} else n.setActive("exit", !1);
				this.exit = void 0;
				return;
			}
			let o = this.exit = n.setActive("exit", !r);
			i && !r && o.then(() => {
				this.exit === o && (this.exit = !0, i(this.id));
			});
		}
		mount() {
			let { register: e, onExitComplete: t } = this.node.presenceContext || {};
			t && t(this.id), e && (this.unmount = e(this.id, this.node));
		}
		unmount() {}
	} }
}, lu = class extends il {
	constructor(e) {
		super(e), this.removeGroupControls = M, this.removeListeners = M, this.controls = new Bc(e);
	}
	mount() {
		let { dragControls: e } = this.node.getProps();
		e && (this.removeGroupControls = e.subscribe(this.controls)), this.removeListeners = this.controls.addListeners() || M;
	}
	update() {
		let { dragControls: e, drag: t } = this.node.getProps(), { dragControls: n, drag: r } = this.node.prevProps || {};
		e !== n && (this.removeGroupControls(), e && (this.removeGroupControls = e.subscribe(this.controls))), r && !t && this.controls.stop(void 0, void 0, r);
	}
	unmount() {
		this.removeGroupControls(), this.removeListeners(), this.controls.isDragging || this.controls.endPanSession();
	}
}, uu = ({ current: e }) => e ? e.ownerDocument.defaultView : null, du = (e) => (t, n) => {
	e && jt.update(() => e(t, n), !1, !0);
}, fu = class extends il {
	constructor() {
		super(...arguments), this.removePointerDownListener = M;
	}
	onPointerDown(e) {
		this.session = new mc(e, this.createPanHandlers(), {
			transformPagePoint: this.node.getTransformPagePoint(),
			contextWindow: uu(this.node)
		});
	}
	createPanHandlers() {
		let { onPanSessionStart: e, onPanStart: t, onPan: n, onPanEnd: r } = this.node.getProps();
		return {
			onSessionStart: du(e),
			onStart: du(t),
			onMove: du(n),
			onEnd: (e, t) => {
				delete this.session, r && jt.postRender(() => r(e, t));
			}
		};
	}
	mount() {
		this.removePointerDownListener = Xs(this.node.current, "pointerdown", (e) => this.onPointerDown(e));
	}
	update() {
		this.session && this.session.updateHandlers(this.createPanHandlers());
	}
	unmount() {
		this.removePointerDownListener(), this.session && this.session.end();
	}
}, pu = !1, mu = ({ layout: e, layoutDependency: t }) => ({
	layout: e,
	layoutDependency: t,
	animationType: typeof e == "string" ? e : "both"
}), hu = class extends y.Component {
	componentDidMount() {
		let { visualElement: e, layoutGroup: t, switchLayoutGroup: n, layoutId: r } = this.props, { projection: i } = e;
		i && (t.group && t.group.add(i), n && n.register && r && n.register(i), pu && i.root.didUpdate(), i.addEventListener("animationComplete", () => {
			this.safeToRemove();
		}), i.setOptions({
			...i.options,
			...mu(this.props),
			onExitComplete: () => this.safeToRemove()
		})), Ro.hasEverUpdated = !0;
	}
	getSnapshotBeforeUpdate(e) {
		let { layout: t, layoutDependency: n, visualElement: r, drag: i, isPresent: a } = this.props, { projection: o } = r;
		return o && (o.isPresent = a, (e.layoutDependency !== n || e.layout !== t) && o.setOptions({
			...o.options,
			...mu(this.props)
		}), pu = !0, i || e.layoutDependency !== n || n === void 0 || e.isPresent !== a ? o.willUpdate() : this.safeToRemove(), e.isPresent !== a && (a ? o.promote() : o.relegate() || jt.postRender(() => {
			let e = o.getStack();
			e && e.members.length || this.safeToRemove();
		}))), null;
	}
	componentDidUpdate() {
		let { visualElement: e, layoutAnchor: t } = this.props, { projection: n } = e;
		n && (n.options.layoutAnchor = t, n.root.didUpdate(), Na.postRender(() => {
			!n.currentAnimation && n.isLead() && this.safeToRemove();
		}));
	}
	componentWillUnmount() {
		let { visualElement: e, layoutGroup: t, switchLayoutGroup: n } = this.props, { projection: r } = e;
		pu = !0, r && (r.scheduleCheckAfterUnmount(), t && t.group && t.group.remove(r), n && n.deregister && n.deregister(r));
	}
	safeToRemove() {
		let { safeToRemove: e } = this.props;
		e && e();
	}
	render() {
		return null;
	}
};
function gu(e) {
	let [t, n] = gl(), r = (0, y.useContext)(b);
	return (0, Z.jsx)(hu, {
		...e,
		layoutGroup: r,
		switchLayoutGroup: (0, y.useContext)(Yl),
		isPresent: t,
		safeToRemove: n
	});
}
// node_modules/framer-motion/dist/es/motion/features/drag.mjs
var _u = {
	pan: { Feature: fu },
	drag: {
		Feature: lu,
		ProjectionNode: Cs,
		MeasureLayout: gu
	}
};
// node_modules/framer-motion/dist/es/gestures/hover.mjs
function vu(e, t, n) {
	let { props: r } = e;
	e.animationState && r.whileHover && e.animationState.setActive("whileHover", n === "Start");
	let i = r["onHover" + n];
	i && jt.postRender(() => i(t, Js(t)));
}
var yu = class extends il {
	mount() {
		let { current: e } = this.node;
		e && (this.unmount = Yc(e, (e, t) => (vu(this.node, t, "Start"), (e) => vu(this.node, e, "End"))));
	}
	unmount() {}
}, bu = class extends il {
	constructor() {
		super(...arguments), this.isActive = !1;
	}
	onFocus() {
		let e = !1;
		try {
			e = this.node.current.matches(":focus-visible");
		} catch {
			e = !0;
		}
		e && this.node.animationState && (this.node.animationState.setActive("whileFocus", !0), this.isActive = !0);
	}
	onBlur() {
		this.isActive && this.node.animationState && (this.node.animationState.setActive("whileFocus", !1), this.isActive = !1);
	}
	mount() {
		this.unmount = N(bs(this.node.current, "focus", () => this.onFocus()), bs(this.node.current, "blur", () => this.onBlur()));
	}
	unmount() {}
};
// node_modules/framer-motion/dist/es/gestures/press.mjs
function xu(e, t, n) {
	let { props: r } = e;
	if (e.current instanceof HTMLButtonElement && e.current.disabled) return;
	e.animationState && r.whileTap && e.animationState.setActive("whileTap", n === "Start");
	let i = r["onTap" + (n === "End" ? "" : n)];
	i && jt.postRender(() => i(t, Js(t)));
}
var Su = class extends il {
	mount() {
		let { current: e } = this.node;
		if (!e) return;
		let { globalTapTarget: t, propagate: n } = this.node.props;
		this.unmount = rl(e, (e, t) => (xu(this.node, t, "Start"), (e, { success: t }) => xu(this.node, e, t ? "End" : "Cancel")), {
			useGlobalTarget: t,
			stopPropagation: n?.tap === !1
		});
	}
	unmount() {}
}, Cu = /* @__PURE__ */ new WeakMap(), wu = /* @__PURE__ */ new WeakMap(), Tu = (e) => {
	let t = Cu.get(e.target);
	t && t(e);
}, Eu = (e) => {
	e.forEach(Tu);
};
function Du({ root: e, ...t }) {
	let n = e || document;
	wu.has(n) || wu.set(n, {});
	let r = wu.get(n), i = JSON.stringify(t);
	return r[i] || (r[i] = new IntersectionObserver(Eu, {
		root: e,
		...t
	})), r[i];
}
function Ou(e, t, n) {
	let r = Du(t);
	return Cu.set(e, n), r.observe(e), () => {
		Cu.delete(e), r.unobserve(e);
	};
}
// node_modules/framer-motion/dist/es/motion/features/viewport/index.mjs
var ku = {
	some: 0,
	all: 1
}, Au = class extends il {
	constructor() {
		super(...arguments), this.hasEnteredView = !1, this.isInView = !1;
	}
	startObserver() {
		this.stopObserver?.();
		let { viewport: e = {} } = this.node.getProps(), { root: t, margin: n, amount: r = "some", once: i } = e, a = {
			root: t ? t.current : void 0,
			rootMargin: n,
			threshold: typeof r == "number" ? r : ku[r]
		}, o = (e) => {
			let { isIntersecting: t } = e;
			if (this.isInView === t || (this.isInView = t, i && !t && this.hasEnteredView)) return;
			t && (this.hasEnteredView = !0), this.node.animationState && this.node.animationState.setActive("whileInView", t);
			let { onViewportEnter: n, onViewportLeave: r } = this.node.getProps(), a = t ? n : r;
			a && a(e);
		};
		this.stopObserver = Ou(this.node.current, a, o);
	}
	mount() {
		this.startObserver();
	}
	update() {
		if (typeof IntersectionObserver > "u") return;
		let { props: e, prevProps: t } = this.node;
		[
			"amount",
			"margin",
			"root"
		].some(ju(e, t)) && this.startObserver();
	}
	unmount() {
		this.stopObserver?.(), this.hasEnteredView = !1, this.isInView = !1;
	}
};
function ju({ viewport: e = {} }, { viewport: t = {} } = {}) {
	return (n) => e[n] !== t[n];
}
// node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs
var Mu = /*@__PURE__*/ iu(/* @__PURE__ */ Object.assign({}, cu, {
	inView: { Feature: Au },
	tap: { Feature: Su },
	focus: { Feature: bu },
	hover: { Feature: yu }
}, _u, { layout: {
	ProjectionNode: Cs,
	MeasureLayout: gu
} }), au);
// node_modules/framer-motion/dist/es/utils/reduced-motion/use-reduced-motion.mjs
function Nu() {
	!Ns.current && Fs();
	let [e] = (0, y.useState)(Ms.current);
	return e;
}
// node_modules/framer-motion/dist/es/render/dom/viewport/index.mjs
var Pu = {
	some: 0,
	all: 1
};
function Fu(e, t, { root: n, margin: r, amount: i = "some" } = {}) {
	let a = ia(e);
	t = ra(t);
	let o = /* @__PURE__ */ new WeakMap(), s = new IntersectionObserver((e) => {
		e.forEach((e) => {
			let n = o.get(e.target);
			if (e.isIntersecting !== !!n) {
				if (e.isIntersecting) {
					let n = t(e.target, e);
					typeof n == "function" ? o.set(e.target, n) : s.unobserve(e.target);
				} else typeof n == "function" && (n(e), o.delete(e.target));
			}
		});
	}, {
		root: n,
		rootMargin: r,
		threshold: typeof i == "number" ? i : Pu[i]
	});
	return a.forEach((e) => s.observe(e)), na(() => s.disconnect());
}
// node_modules/framer-motion/dist/es/utils/use-in-view.mjs
function Iu(e, { root: t, margin: n, amount: r, once: i = !1, initial: a = !1 } = {}) {
	let [o, s] = (0, y.useState)(a), [c, l] = (0, y.useState)({});
	return (0, y.useEffect)(() => {
		let a = c.current = e.current;
		return !a || i && o ? void 0 : Fu(a, () => (s(!0), i ? void 0 : () => s(!1)), {
			root: t && t.current || void 0,
			margin: n,
			amount: r
		});
	}, [
		t,
		e,
		n,
		i,
		r,
		c
	]), (0, y.useEffect)(() => {
		e.current !== c.current && (i || s(!1), l({}));
	}), o;
}
// node_modules/motion/dist/es/react.mjs
var Lu = m(), Ru = g(), zu = Mu;
// node_modules/gsap/gsap-core.js
function Bu(e) {
	if (e === void 0) throw ReferenceError("this hasn't been initialised - super() hasn't been called");
	return e;
}
function Vu(e, t) {
	e.prototype = Object.create(t.prototype), e.prototype.constructor = e, e.__proto__ = t;
}
var Hu = {
	autoSleep: 120,
	force3D: "auto",
	nullTargetWarn: 1,
	units: { lineHeight: "" }
}, Uu = {
	duration: .5,
	overwrite: !1,
	delay: 0
}, Wu, Gu, Ku, qu = 1e8, Q = 1 / qu, Ju = Math.PI * 2, Yu = Ju / 4, Xu = 0, Zu = Math.sqrt, Qu = Math.cos, $u = Math.sin, ed = function(e) {
	return typeof e == "string";
}, td = function(e) {
	return typeof e == "function";
}, nd = function(e) {
	return typeof e == "number";
}, rd = function(e) {
	return e === void 0;
}, id = function(e) {
	return typeof e == "object";
}, ad = function(e) {
	return e !== !1;
}, od = function() {
	return typeof window < "u";
}, sd = function(e) {
	return td(e) || ed(e);
}, cd = typeof ArrayBuffer == "function" && ArrayBuffer.isView || function() {}, ld = Array.isArray, ud = /random\([^)]+\)/g, dd = /,\s*/g, fd = /(?:-?\.?\d|\.)+/gi, pd = /[-+=.]*\d+[.e\-+]*\d*[e\-+]*\d*/g, md = /[-+=.]*\d+[.e-]*\d*[a-z%]*/g, hd = /[-+=.]*\d+\.?\d*(?:e-|e\+)?\d*/gi, gd = /[+-]=-?[.\d]+/, _d = /[^,'"\[\]\s]+/gi, vd = /^[+\-=e\s\d]*\d+[.\d]*([a-z]*|%)\s*$/i, yd, bd, xd, Sd, Cd = {}, wd = {}, Td, Ed = function(e) {
	return (wd = af(e, Cd)) && wm;
}, Dd = function(e, t) {
	return console.warn("Invalid property", e, "set to", t, "Missing plugin? gsap.registerPlugin()");
}, Od = function(e, t) {
	return !t && console.warn(e);
}, kd = function(e, t) {
	return e && (Cd[e] = t) && wd && (wd[e] = t) || Cd;
}, Ad = function() {
	return 0;
}, jd = {
	suppressEvents: !0,
	isStart: !0,
	kill: !1
}, Md = {
	suppressEvents: !0,
	kill: !1
}, Nd = { suppressEvents: !0 }, Pd = {}, Fd = [], Id = {}, Ld, Rd = {}, zd = {}, Bd = 30, Vd = [], Hd = "", Ud = function(e) {
	var t = e[0], n, r;
	if (id(t) || td(t) || (e = [e]), !(n = (t._gsap || {}).harness)) {
		for (r = Vd.length; r-- && !Vd[r].targetTest(t););
		n = Vd[r];
	}
	for (r = e.length; r--;) e[r] && (e[r]._gsap || (e[r]._gsap = new Pp(e[r], n))) || e.splice(r, 1);
	return e;
}, Wd = function(e) {
	return e._gsap || Ud(Hf(e))[0]._gsap;
}, Gd = function(e, t, n) {
	return (n = e[t]) && td(n) ? e[t]() : rd(n) && e.getAttribute && e.getAttribute(t) || n;
}, Kd = function(e, t) {
	return (e = e.split(",")).forEach(t) || e;
}, qd = function(e) {
	return Math.round(e * 1e5) / 1e5 || 0;
}, Jd = function(e) {
	return Math.round(e * 1e7) / 1e7 || 0;
}, Yd = function(e, t) {
	var n = t.charAt(0), r = parseFloat(t.substr(2));
	return e = parseFloat(e), n === "+" ? e + r : n === "-" ? e - r : n === "*" ? e * r : e / r;
}, Xd = function(e, t) {
	for (var n = t.length, r = 0; e.indexOf(t[r]) < 0 && ++r < n;);
	return r < n;
}, Zd = function() {
	var e = Fd.length, t = Fd.slice(0), n, r;
	for (Id = {}, Fd.length = 0, n = 0; n < e; n++) r = t[n], r && r._lazy && (r.render(r._lazy[0], r._lazy[1], !0)._lazy = 0);
}, Qd = function(e) {
	return !!(e._initted || e._startAt || e.add);
}, $d = function(e, t, n, r) {
	Fd.length && !Gu && Zd(), e.render(t, n, r || !!(Gu && t < 0 && Qd(e))), Fd.length && !Gu && Zd();
}, ef = function(e) {
	var t = parseFloat(e);
	return (t || t === 0) && (e + "").match(_d).length < 2 ? t : ed(e) ? e.trim() : e;
}, tf = function(e) {
	return e;
}, nf = function(e, t) {
	for (var n in t) n in e || (e[n] = t[n]);
	return e;
}, rf = function(e) {
	return function(t, n) {
		for (var r in n) r in t || r === "duration" && e || r === "ease" || (t[r] = n[r]);
	};
}, af = function(e, t) {
	for (var n in t) e[n] = t[n];
	return e;
}, of = function e(t, n) {
	for (var r in n) r !== "__proto__" && r !== "constructor" && r !== "prototype" && (t[r] = id(n[r]) ? e(t[r] || (t[r] = {}), n[r]) : n[r]);
	return t;
}, sf = function(e, t) {
	var n = {}, r;
	for (r in e) r in t || (n[r] = e[r]);
	return n;
}, cf = function(e) {
	var t = e.parent || yd, n = e.keyframes ? rf(ld(e.keyframes)) : nf;
	if (ad(e.inherit)) for (; t;) n(e, t.vars.defaults), t = t.parent || t._dp;
	return e;
}, lf = function(e, t) {
	for (var n = e.length, r = n === t.length; r && n-- && e[n] === t[n];);
	return n < 0;
}, uf = function(e, t, n, r, i) {
	n === void 0 && (n = "_first"), r === void 0 && (r = "_last");
	var a = e[r], o;
	if (i) for (o = t[i]; a && a[i] > o;) a = a._prev;
	return a ? (t._next = a._next, a._next = t) : (t._next = e[n], e[n] = t), t._next ? t._next._prev = t : e[r] = t, t._prev = a, t.parent = t._dp = e, t;
}, df = function(e, t, n, r) {
	n === void 0 && (n = "_first"), r === void 0 && (r = "_last");
	var i = t._prev, a = t._next;
	i ? i._next = a : e[n] === t && (e[n] = a), a ? a._prev = i : e[r] === t && (e[r] = i), t._next = t._prev = t.parent = null;
}, ff = function(e, t) {
	e.parent && (!t || e.parent.autoRemoveChildren) && e.parent.remove && e.parent.remove(e), e._act = 0;
}, pf = function(e, t) {
	if (e && (!t || t._end > e._dur || t._start < 0)) for (var n = e; n;) n._dirty = 1, n = n.parent;
	return e;
}, mf = function(e) {
	for (var t = e.parent; t && t.parent;) t._dirty = 1, t.totalDuration(), t = t.parent;
	return e;
}, hf = function(e, t, n, r) {
	return e._startAt && (Gu ? e._startAt.revert(Md) : e.vars.immediateRender && !e.vars.autoRevert || e._startAt.render(t, !0, r));
}, gf = function e(t) {
	return !t || t._ts && e(t.parent);
}, _f = function(e) {
	return e._repeat ? vf(e._tTime, e = e.duration() + e._rDelay) * e : 0;
}, vf = function(e, t) {
	var n = Math.floor(e = Jd(e / t));
	return e && n === e ? n - 1 : n;
}, yf = function(e, t) {
	return (e - t._start) * t._ts + (t._ts >= 0 ? 0 : t._dirty ? t.totalDuration() : t._tDur);
}, bf = function(e) {
	return e._end = Jd(e._start + (e._tDur / Math.abs(e._ts || e._rts || Q) || 0));
}, xf = function(e, t) {
	var n = e._dp;
	return n && n.smoothChildTiming && e._ts && (e._start = Jd(n._time - (e._ts > 0 ? t / e._ts : ((e._dirty ? e.totalDuration() : e._tDur) - t) / -e._ts)), bf(e), n._dirty || pf(n, e)), e;
}, Sf = function(e, t) {
	var n;
	if ((t._time || !t._dur && t._initted || t._start < e._time && (t._dur || !t.add)) && (n = yf(e.rawTime(), t), (!t._dur || If(0, t.totalDuration(), n) - t._tTime > Q) && t.render(n, !0)), pf(e, t)._dp && e._initted && e._time >= e._dur && e._ts) {
		if (e._dur < e.duration()) for (n = e; n._dp;) n.rawTime() >= 0 && n.totalTime(n._tTime), n = n._dp;
		e._zTime = -Q;
	}
}, Cf = function(e, t, n, r) {
	return t.parent && ff(t), t._start = Jd((nd(n) ? n : !n && Df(t) && (!e._last || e._last._start >= e._time) ? e._last ? e._last._start : e._time : n || e !== yd ? Nf(e, n, t) : e._time) + t._delay), t._end = Jd(t._start + (t.totalDuration() / Math.abs(t.timeScale()) || 0)), uf(e, t, "_first", "_last", e._sort ? "_start" : 0), Df(t) || (e._recent = t), r || Sf(e, t), e._ts < 0 && xf(e, e._tTime), e;
}, wf = function(e, t) {
	return (Cd.ScrollTrigger || Dd("scrollTrigger", t)) && Cd.ScrollTrigger.create(t, e);
}, Tf = function(e, t, n, r, i) {
	if (Up(e, t, i), !e._initted) return 1;
	if (!n && e._pt && !Gu && (e._dur && e.vars.lazy !== !1 || !e._dur && e.vars.lazy) && Ld !== bp.frame) return Fd.push(e), e._lazy = [i, r], 1;
}, Ef = function e(t) {
	var n = t.parent;
	return n && n._ts && n._initted && !n._lock && (n.rawTime() < 0 || e(n));
}, Df = function(e) {
	var t = e.data;
	return t === "isFromStart" || t === "isStart";
}, Of = function(e, t, n, r) {
	var i = e.ratio, a = t < 0 || !t && (!e._start && Ef(e) && (e._initted || !Df(e)) || (e._ts < 0 || e._dp._ts < 0) && !Df(e)) ? 0 : 1, o = e._rDelay, s = 0, c, l, u;
	if (o && e._repeat && (s = If(0, e._tDur, t), l = vf(s, o), e._yoyo && l & 1 && (a = 1 - a), l !== vf(e._tTime, o) && (i = 1 - a, e.vars.repeatRefresh && e._initted && e.invalidate())), a !== i || Gu || r || e._zTime === Q || !t && e._zTime) {
		if (!e._initted && Tf(e, t, r, n, s)) return;
		for (u = e._zTime, e._zTime = t || (n ? Q : 0), n ||= t && !u, e.ratio = a, e._from && (a = 1 - a), e._time = 0, e._tTime = s, c = e._pt; c;) c.r(a, c.d), c = c._next;
		t < 0 && hf(e, t, n, !0), e._onUpdate && !n && ap(e, "onUpdate"), s && e._repeat && !n && e.parent && ap(e, "onRepeat"), (t >= e._tDur || t < 0) && e.ratio === a && (a && ff(e, 1), !n && !Gu && (ap(e, a ? "onComplete" : "onReverseComplete", !0), e._prom && e._prom()));
	} else e._zTime ||= t;
}, kf = function(e, t, n) {
	var r;
	if (n > t) for (r = e._first; r && r._start <= n;) {
		if (r.data === "isPause" && r._start > t) return r;
		r = r._next;
	}
	else for (r = e._last; r && r._start >= n;) {
		if (r.data === "isPause" && r._start < t) return r;
		r = r._prev;
	}
}, Af = function(e, t, n, r) {
	var i = e._repeat, a = Jd(t) || 0, o = e._tTime / e._tDur;
	return o && !r && (e._time *= a / e._dur), e._dur = a, e._tDur = i ? i < 0 ? 1e10 : Jd(a * (i + 1) + e._rDelay * i) : a, o > 0 && !r && xf(e, e._tTime = e._tDur * o), e.parent && bf(e), n || pf(e.parent, e), e;
}, jf = function(e) {
	return e instanceof Ip ? pf(e) : Af(e, e._dur);
}, Mf = {
	_start: 0,
	endTime: Ad,
	totalDuration: Ad
}, Nf = function e(t, n, r) {
	var i = t.labels, a = t._recent || Mf, o = t.duration() >= qu ? a.endTime(!1) : t._dur, s, c, l;
	return ed(n) && (isNaN(n) || n in i) ? (c = n.charAt(0), l = n.substr(-1) === "%", s = n.indexOf("="), c === "<" || c === ">" ? (s >= 0 && (n = n.replace(/=/, "")), (c === "<" ? a._start : a.endTime(a._repeat >= 0)) + (parseFloat(n.substr(1)) || 0) * (l ? (s < 0 ? a : r).totalDuration() / 100 : 1)) : s < 0 ? (n in i || (i[n] = o), i[n]) : (c = parseFloat(n.charAt(s - 1) + n.substr(s + 1)), l && r && (c = c / 100 * (ld(r) ? r[0] : r).totalDuration()), s > 1 ? e(t, n.substr(0, s - 1), r) + c : o + c)) : n == null ? o : +n;
}, Pf = function(e, t, n) {
	var r = nd(t[1]), i = (r ? 2 : 1) + (e < 2 ? 0 : 1), a = t[i], o, s;
	if (r && (a.duration = t[1]), a.parent = n, e) {
		for (o = a, s = n; s && !("immediateRender" in o);) o = s.vars.defaults || {}, s = ad(s.vars.inherit) && s.parent;
		a.immediateRender = ad(o.immediateRender), e < 2 ? a.runBackwards = 1 : a.startAt = t[i - 1];
	}
	return new Xp(t[0], a, t[i + 1]);
}, Ff = function(e, t) {
	return e || e === 0 ? t(e) : t;
}, If = function(e, t, n) {
	return n < e ? e : n > t ? t : n;
}, Lf = function(e, t) {
	return !ed(e) || !(t = vd.exec(e)) ? "" : t[1];
}, Rf = function(e, t, n) {
	return Ff(n, function(n) {
		return If(e, t, n);
	});
}, zf = [].slice, Bf = function(e, t) {
	return e && id(e) && "length" in e && (!t && !e.length || e.length - 1 in e && id(e[0])) && !e.nodeType && e !== bd;
}, Vf = function(e, t, n) {
	return n === void 0 && (n = []), e.forEach(function(e) {
		var r;
		return ed(e) && !t || Bf(e, 1) ? (r = n).push.apply(r, Hf(e)) : n.push(e);
	}) || n;
}, Hf = function(e, t, n) {
	return Ku && !t && Ku.selector ? Ku.selector(e) : ed(e) && !n && (xd || !xp()) ? zf.call((t || Sd).querySelectorAll(e), 0) : ld(e) ? Vf(e, n) : Bf(e) ? zf.call(e, 0) : e ? [e] : [];
}, Uf = function(e) {
	return e = Hf(e)[0] || Od("Invalid scope") || {}, function(t) {
		var n = e.current || e.nativeElement || e;
		return Hf(t, n.querySelectorAll ? n : n === e ? Od("Invalid scope") || Sd.createElement("div") : e);
	};
}, Wf = function(e) {
	return e.sort(function() {
		return .5 - Math.random();
	});
}, Gf = function(e) {
	if (td(e)) return e;
	var t = id(e) ? e : { each: e }, n = kp(t.ease), r = t.from || 0, i = parseFloat(t.base) || 0, a = {}, o = r > 0 && r < 1, s = isNaN(r) || o, c = t.axis, l = r, u = r;
	return ed(r) ? l = u = {
		center: .5,
		edges: .5,
		end: 1
	}[r] || 0 : !o && s && (l = r[0], u = r[1]), function(e, o, d) {
		var f = (d || t).length, p = a[f], m, h, g, _, v, y, b, x, S;
		if (!p) {
			if (S = t.grid === "auto" ? 0 : (t.grid || [1, qu])[1], !S) {
				for (b = -qu; b < (b = d[S++].getBoundingClientRect().left) && S < f;);
				S < f && S--;
			}
			for (p = a[f] = [], m = s ? Math.min(S, f) * l - .5 : r % S, h = S === qu ? 0 : s ? f * u / S - .5 : r / S | 0, b = 0, x = qu, y = 0; y < f; y++) g = y % S - m, _ = h - (y / S | 0), p[y] = v = c ? Math.abs(c === "y" ? _ : g) : Zu(g * g + _ * _), v > b && (b = v), v < x && (x = v);
			r === "random" && Wf(p), p.max = b - x, p.min = x, p.v = f = (parseFloat(t.amount) || parseFloat(t.each) * (S > f ? f - 1 : c ? c === "y" ? f / S : S : Math.max(S, f / S)) || 0) * (r === "edges" ? -1 : 1), p.b = f < 0 ? i - f : i, p.u = Lf(t.amount || t.each) || 0, n = n && f < 0 ? Op(n) : n;
		}
		return f = (p[e] - p.min) / p.max || 0, Jd(p.b + (n ? n(f) : f) * p.v) + p.u;
	};
}, Kf = function(e) {
	var t = 10 ** ((e + "").split(".")[1] || "").length;
	return function(n) {
		var r = Jd(Math.round(parseFloat(n) / e) * e * t);
		return (r - r % 1) / t + (nd(n) ? 0 : Lf(n));
	};
}, qf = function(e, t) {
	var n = ld(e), r, i;
	return !n && id(e) && (r = n = e.radius || qu, e.values ? (e = Hf(e.values), (i = !nd(e[0])) && (r *= r)) : e = Kf(e.increment)), Ff(t, n ? td(e) ? function(t) {
		return i = e(t), Math.abs(i - t) <= r ? i : t;
	} : function(t) {
		for (var n = parseFloat(i ? t.x : t), a = parseFloat(i ? t.y : 0), o = qu, s = 0, c = e.length, l, u; c--;) i ? (l = e[c].x - n, u = e[c].y - a, l = l * l + u * u) : l = Math.abs(e[c] - n), l < o && (o = l, s = c);
		return s = !r || o <= r ? e[s] : t, i || s === t || nd(t) ? s : s + Lf(t);
	} : Kf(e));
}, Jf = function(e, t, n, r) {
	return Ff(ld(e) ? !t : n === !0 ? !!(n = 0) : !r, function() {
		return ld(e) ? e[~~(Math.random() * e.length)] : (n ||= 1e-5) && (r = n < 1 ? 10 ** ((n + "").length - 2) : 1) && Math.floor(Math.round((e - n / 2 + Math.random() * (t - e + n * .99)) / n) * n * r) / r;
	});
}, Yf = function() {
	var e = [...arguments];
	return function(t) {
		return e.reduce(function(e, t) {
			return t(e);
		}, t);
	};
}, Xf = function(e, t) {
	return function(n) {
		return e(parseFloat(n)) + (t || Lf(n));
	};
}, Zf = function(e, t, n) {
	return np(e, t, 0, 1, n);
}, Qf = function(e, t, n) {
	return Ff(n, function(n) {
		return e[~~t(n)];
	});
}, $f = function e(t, n, r) {
	var i = n - t;
	return ld(t) ? Qf(t, e(0, t.length), n) : Ff(r, function(e) {
		return (i + (e - t) % i) % i + t;
	});
}, ep = function e(t, n, r) {
	var i = n - t, a = i * 2;
	return ld(t) ? Qf(t, e(0, t.length - 1), n) : Ff(r, function(e) {
		return e = (a + (e - t) % a) % a || 0, t + (e > i ? a - e : e);
	});
}, tp = function(e) {
	return e.replace(ud, function(e) {
		var t = e.indexOf("[") + 1, n = e.substring(t || 7, t ? e.indexOf("]") : e.length - 1).split(dd);
		return Jf(t ? n : +n[0], t ? 0 : +n[1], +n[2] || 1e-5);
	});
}, np = function(e, t, n, r, i) {
	var a = t - e, o = r - n;
	return Ff(i, function(t) {
		return n + ((t - e) / a * o || 0);
	});
}, rp = function e(t, n, r, i) {
	var a = isNaN(t + n) ? 0 : function(e) {
		return (1 - e) * t + e * n;
	};
	if (!a) {
		var o = ed(t), s = {}, c, l, u, d, f;
		if (r === !0 && (i = 1) && (r = null), o) t = { p: t }, n = { p: n };
		else if (ld(t) && !ld(n)) {
			for (u = [], d = t.length, f = d - 2, l = 1; l < d; l++) u.push(e(t[l - 1], t[l]));
			d--, a = function(e) {
				e *= d;
				var t = Math.min(f, ~~e);
				return u[t](e - t);
			}, r = n;
		} else i || (t = af(ld(t) ? [] : {}, t));
		if (!u) {
			for (c in n) Rp.call(s, t, c, "get", n[c]);
			a = function(e) {
				return am(e, s) || (o ? t.p : t);
			};
		}
	}
	return Ff(r, a);
}, ip = function(e, t, n) {
	var r = e.labels, i = qu, a, o, s;
	for (a in r) o = r[a] - t, o < 0 == !!n && o && i > (o = Math.abs(o)) && (s = a, i = o);
	return s;
}, ap = function(e, t, n) {
	var r = e.vars, i = r[t], a = Ku, o = e._ctx, s, c, l;
	if (i) return s = r[t + "Params"], c = r.callbackScope || e, n && Fd.length && Zd(), o && (Ku = o), l = s ? i.apply(c, s) : i.call(c), Ku = a, l;
}, op = function(e) {
	return ff(e), e.scrollTrigger && e.scrollTrigger.kill(!!Gu), e.progress() < 1 && ap(e, "onInterrupt"), e;
}, sp, cp = [], lp = function(e) {
	if (e) {
		if (e = !e.name && e.default || e, od() || e.headless) {
			var t = e.name, n = td(e), r = t && !n && e.init ? function() {
				this._props = [];
			} : e, i = {
				init: Ad,
				render: am,
				add: Rp,
				kill: sm,
				modifier: om,
				rawVars: 0
			}, a = {
				targetTest: 0,
				get: 0,
				getSetter: tm,
				aliases: {},
				register: 0
			};
			if (xp(), e !== r) {
				if (Rd[t]) return;
				nf(r, nf(sf(e, i), a)), af(r.prototype, af(i, sf(e, a))), Rd[r.prop = t] = r, e.targetTest && (Vd.push(r), Pd[t] = 1), t = (t === "css" ? "CSS" : t.charAt(0).toUpperCase() + t.substr(1)) + "Plugin";
			}
			kd(t, r), e.register && e.register(wm, r, um);
		} else cp.push(e);
	}
}, up = 255, dp = {
	aqua: [
		0,
		up,
		up
	],
	lime: [
		0,
		up,
		0
	],
	silver: [
		192,
		192,
		192
	],
	black: [
		0,
		0,
		0
	],
	maroon: [
		128,
		0,
		0
	],
	teal: [
		0,
		128,
		128
	],
	blue: [
		0,
		0,
		up
	],
	navy: [
		0,
		0,
		128
	],
	white: [
		up,
		up,
		up
	],
	olive: [
		128,
		128,
		0
	],
	yellow: [
		up,
		up,
		0
	],
	orange: [
		up,
		165,
		0
	],
	gray: [
		128,
		128,
		128
	],
	purple: [
		128,
		0,
		128
	],
	green: [
		0,
		128,
		0
	],
	red: [
		up,
		0,
		0
	],
	pink: [
		up,
		192,
		203
	],
	cyan: [
		0,
		up,
		up
	],
	transparent: [
		up,
		up,
		up,
		0
	]
}, fp = function(e, t, n) {
	return e += e < 0 ? 1 : e > 1 ? -1 : 0, (e * 6 < 1 ? t + (n - t) * e * 6 : e < .5 ? n : e * 3 < 2 ? t + (n - t) * (2 / 3 - e) * 6 : t) * up + .5 | 0;
}, pp = function(e, t, n) {
	var r = e ? nd(e) ? [
		e >> 16,
		e >> 8 & up,
		e & up
	] : 0 : dp.black, i, a, o, s, c, l, u, d, f, p;
	if (!r) {
		if (e.substr(-1) === "," && (e = e.substr(0, e.length - 1)), dp[e]) r = dp[e];
		else if (e.charAt(0) === "#") {
			if (e.length < 6 && (i = e.charAt(1), a = e.charAt(2), o = e.charAt(3), e = "#" + i + i + a + a + o + o + (e.length === 5 ? e.charAt(4) + e.charAt(4) : "")), e.length === 9) return r = parseInt(e.substr(1, 6), 16), [
				r >> 16,
				r >> 8 & up,
				r & up,
				parseInt(e.substr(7), 16) / 255
			];
			e = parseInt(e.substr(1), 16), r = [
				e >> 16,
				e >> 8 & up,
				e & up
			];
		} else if (e.substr(0, 3) === "hsl") {
			if (r = p = e.match(fd), !t) s = r[0] % 360 / 360, c = r[1] / 100, l = r[2] / 100, a = l <= .5 ? l * (c + 1) : l + c - l * c, i = l * 2 - a, r.length > 3 && (r[3] *= 1), r[0] = fp(s + 1 / 3, i, a), r[1] = fp(s, i, a), r[2] = fp(s - 1 / 3, i, a);
			else if (~e.indexOf("=")) return r = e.match(pd), n && r.length < 4 && (r[3] = 1), r;
		} else r = e.match(fd) || dp.transparent;
		r = r.map(Number);
	}
	return t && !p && (i = r[0] / up, a = r[1] / up, o = r[2] / up, u = Math.max(i, a, o), d = Math.min(i, a, o), l = (u + d) / 2, u === d ? s = c = 0 : (f = u - d, c = l > .5 ? f / (2 - u - d) : f / (u + d), s = u === i ? (a - o) / f + (a < o ? 6 : 0) : u === a ? (o - i) / f + 2 : (i - a) / f + 4, s *= 60), r[0] = ~~(s + .5), r[1] = ~~(c * 100 + .5), r[2] = ~~(l * 100 + .5)), n && r.length < 4 && (r[3] = 1), r;
}, mp = function(e) {
	var t = [], n = [], r = -1;
	return e.split(gp).forEach(function(e) {
		var i = e.match(md) || [];
		t.push.apply(t, i), n.push(r += i.length + 1);
	}), t.c = n, t;
}, hp = function(e, t, n) {
	var r = "", i = (e + r).match(gp), a = t ? "hsla(" : "rgba(", o = 0, s, c, l, u;
	if (!i) return e;
	if (i = i.map(function(e) {
		return (e = pp(e, t, 1)) && a + (t ? e[0] + "," + e[1] + "%," + e[2] + "%," + e[3] : e.join(",")) + ")";
	}), n && (l = mp(e), s = n.c, s.join(r) !== l.c.join(r))) for (c = e.replace(gp, "1").split(md), u = c.length - 1; o < u; o++) r += c[o] + (~s.indexOf(o) ? i.shift() || a + "0,0,0,0)" : (l.length ? l : i.length ? i : n).shift());
	if (!c) for (c = e.split(gp), u = c.length - 1; o < u; o++) r += c[o] + i[o];
	return r + c[u];
}, gp = function() {
	var e = "(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3,4}){1,2}\\b", t;
	for (t in dp) e += "|" + t + "\\b";
	return RegExp(e + ")", "gi");
}(), _p = /hsl[a]?\(/, vp = function(e) {
	var t = e.join(" "), n;
	if (gp.lastIndex = 0, gp.test(t)) return n = _p.test(t), e[1] = hp(e[1], n), e[0] = hp(e[0], n, mp(e[1])), !0;
}, yp, bp = function() {
	var e = Date.now, t = 500, n = 33, r = e(), i = r, a = 1e3 / 240, o = a, s = [], c, l, u, d, f, p, m = function u(m) {
		var h = e() - i, g = m === !0, _, v, y, b;
		if ((h > t || h < 0) && (r += h - n), i += h, y = i - r, _ = y - o, (_ > 0 || g) && (b = ++d.frame, f = y - d.time * 1e3, d.time = y /= 1e3, o += _ + (_ >= a ? 0 : a - _), v = 1), g || (c = l(u)), v) for (p = 0; p < s.length; p++) s[p](y, f, b, m);
	};
	return d = {
		time: 0,
		frame: 0,
		tick: function() {
			m(!0);
		},
		deltaRatio: function(e) {
			return f / (1e3 / (e || 60));
		},
		wake: function() {
			Td && (!xd && od() && (bd = xd = window, Sd = bd.document || {}, Cd.gsap = wm, (bd.gsapVersions || (bd.gsapVersions = [])).push(wm.version), Ed(wd || bd.GreenSockGlobals || !bd.gsap && bd || {}), cp.forEach(lp)), u = typeof requestAnimationFrame < "u" && requestAnimationFrame, c && d.sleep(), l = u || function(e) {
				return setTimeout(e, o - d.time * 1e3 + 1 | 0);
			}, yp = 1, m(2));
		},
		sleep: function() {
			(u ? cancelAnimationFrame : clearTimeout)(c), yp = 0, l = Ad;
		},
		lagSmoothing: function(e, r) {
			t = e || Infinity, n = Math.min(r || 33, t);
		},
		fps: function(e) {
			a = 1e3 / (e || 240), o = d.time * 1e3 + a;
		},
		add: function(e, t, n) {
			var r = t ? function(t, n, i, a) {
				e(t, n, i, a), d.remove(r);
			} : e;
			return d.remove(e), s[n ? "unshift" : "push"](r), xp(), r;
		},
		remove: function(e, t) {
			~(t = s.indexOf(e)) && s.splice(t, 1) && p >= t && p--;
		},
		_listeners: s
	}, d;
}(), xp = function() {
	return !yp && bp.wake();
}, Sp = {}, Cp = /^[\d.\-M][\d.\-,\s]/, wp = /["']/g, Tp = function(e) {
	for (var t = {}, n = e.substr(1, e.length - 3).split(":"), r = n[0], i = 1, a = n.length, o, s, c; i < a; i++) s = n[i], o = i === a - 1 ? s.length : s.lastIndexOf(","), c = s.substr(0, o), t[r] = isNaN(c) ? c.replace(wp, "").trim() : +c, r = s.substr(o + 1).trim();
	return t;
}, Ep = function(e) {
	var t = e.indexOf("(") + 1, n = e.indexOf(")"), r = e.indexOf("(", t);
	return e.substring(t, ~r && r < n ? e.indexOf(")", n + 1) : n);
}, Dp = function(e) {
	var t = (e + "").split("("), n = Sp[t[0]];
	return n && t.length > 1 && n.config ? n.config.apply(null, ~e.indexOf("{") ? [Tp(t[1])] : Ep(e).split(",").map(ef)) : Sp._CE && Cp.test(e) ? Sp._CE("", e) : n;
}, Op = function(e) {
	return function(t) {
		return 1 - e(1 - t);
	};
}, kp = function(e, t) {
	return e && (td(e) ? e : Sp[e] || Dp(e)) || t;
}, Ap = function(e, t, n, r) {
	n === void 0 && (n = function(e) {
		return 1 - t(1 - e);
	}), r === void 0 && (r = function(e) {
		return e < .5 ? t(e * 2) / 2 : 1 - t((1 - e) * 2) / 2;
	});
	var i = {
		easeIn: t,
		easeOut: n,
		easeInOut: r
	}, a;
	return Kd(e, function(e) {
		for (var t in Sp[e] = Cd[e] = i, Sp[a = e.toLowerCase()] = n, i) Sp[a + (t === "easeIn" ? ".in" : t === "easeOut" ? ".out" : ".inOut")] = Sp[e + "." + t] = i[t];
	}), i;
}, jp = function(e) {
	return function(t) {
		return t < .5 ? (1 - e(1 - t * 2)) / 2 : .5 + e((t - .5) * 2) / 2;
	};
}, Mp = function e(t, n, r) {
	var i = n >= 1 ? n : 1, a = (r || (t ? .3 : .45)) / (n < 1 ? n : 1), o = a / Ju * (Math.asin(1 / i) || 0), s = function(e) {
		return e === 1 ? 1 : i * 2 ** (-10 * e) * $u((e - o) * a) + 1;
	}, c = t === "out" ? s : t === "in" ? function(e) {
		return 1 - s(1 - e);
	} : jp(s);
	return a = Ju / a, c.config = function(n, r) {
		return e(t, n, r);
	}, c;
}, Np = function e(t, n) {
	n === void 0 && (n = 1.70158);
	var r = function(e) {
		return e ? --e * e * ((n + 1) * e + n) + 1 : 0;
	}, i = t === "out" ? r : t === "in" ? function(e) {
		return 1 - r(1 - e);
	} : jp(r);
	return i.config = function(n) {
		return e(t, n);
	}, i;
};
Kd("Linear,Quad,Cubic,Quart,Quint,Strong", function(e, t) {
	var n = t < 5 ? t + 1 : t;
	Ap(e + ",Power" + (n - 1), t ? function(e) {
		return e ** +n;
	} : function(e) {
		return e;
	}, function(e) {
		return 1 - (1 - e) ** n;
	}, function(e) {
		return e < .5 ? (e * 2) ** n / 2 : 1 - ((1 - e) * 2) ** n / 2;
	});
}), Sp.Linear.easeNone = Sp.none = Sp.Linear.easeIn, Ap("Elastic", Mp("in"), Mp("out"), Mp()), (function(e, t) {
	var n = 1 / t, r = 2 * n, i = 2.5 * n, a = function(a) {
		return a < n ? e * a * a : a < r ? e * (a - 1.5 / t) ** 2 + .75 : a < i ? e * (a -= 2.25 / t) * a + .9375 : e * (a - 2.625 / t) ** 2 + .984375;
	};
	Ap("Bounce", function(e) {
		return 1 - a(1 - e);
	}, a);
})(7.5625, 2.75), Ap("Expo", function(e) {
	return 2 ** (10 * (e - 1)) * e + e * e * e * e * e * e * (1 - e);
}), Ap("Circ", function(e) {
	return -(Zu(1 - e * e) - 1);
}), Ap("Sine", function(e) {
	return e === 1 ? 1 : -Qu(e * Yu) + 1;
}), Ap("Back", Np("in"), Np("out"), Np()), Sp.SteppedEase = Sp.steps = Cd.SteppedEase = { config: function(e, t) {
	e === void 0 && (e = 1);
	var n = 1 / e, r = e + +!t, i = +!!t, a = 1 - Q;
	return function(e) {
		return ((r * If(0, a, e) | 0) + i) * n;
	};
} }, Uu.ease = Sp["quad.out"], Kd("onComplete,onUpdate,onStart,onRepeat,onReverseComplete,onInterrupt", function(e) {
	return Hd += e + "," + e + "Params,";
});
var Pp = function(e, t) {
	this.id = Xu++, e._gsap = this, this.target = e, this.harness = t, this.get = t ? t.get : Gd, this.set = t ? t.getSetter : tm;
}, Fp = /*#__PURE__*/ function() {
	function e(e) {
		this.vars = e, this._delay = +e.delay || 0, (this._repeat = e.repeat === Infinity ? -2 : e.repeat || 0) && (this._rDelay = e.repeatDelay || 0, this._yoyo = !!e.yoyo || !!e.yoyoEase), this._ts = 1, Af(this, +e.duration, 1, 1), this.data = e.data, Ku && (this._ctx = Ku, Ku.data.push(this)), yp || bp.wake();
	}
	var t = e.prototype;
	return t.delay = function(e) {
		return e || e === 0 ? (this.parent && this.parent.smoothChildTiming && this.startTime(this._start + e - this._delay), this._delay = e, this) : this._delay;
	}, t.duration = function(e) {
		return arguments.length ? this.totalDuration(this._repeat > 0 ? e + (e + this._rDelay) * this._repeat : e) : this.totalDuration() && this._dur;
	}, t.totalDuration = function(e) {
		return arguments.length ? (this._dirty = 0, Af(this, this._repeat < 0 ? e : (e - this._repeat * this._rDelay) / (this._repeat + 1))) : this._tDur;
	}, t.totalTime = function(e, t) {
		if (xp(), !arguments.length) return this._tTime;
		var n = this._dp;
		if (n && n.smoothChildTiming && this._ts) {
			for (xf(this, e), !n._dp || n.parent || Sf(n, this); n && n.parent;) n.parent._time !== n._start + (n._ts >= 0 ? n._tTime / n._ts : (n.totalDuration() - n._tTime) / -n._ts) && n.totalTime(n._tTime, !0), n = n.parent;
			!this.parent && this._dp.autoRemoveChildren && (this._ts > 0 && e < this._tDur || this._ts < 0 && e > 0 || !this._tDur && !e) && Cf(this._dp, this, this._start - this._delay);
		}
		return (this._tTime !== e || !this._dur && !t || this._initted && Math.abs(this._zTime) === Q || !this._initted && this._dur && e || !e && !this._initted && (this.add || this._ptLookup)) && (this._ts || (this._pTime = e), $d(this, e, t)), this;
	}, t.time = function(e, t) {
		return arguments.length ? this.totalTime(Math.min(this.totalDuration(), e + _f(this)) % (this._dur + this._rDelay) || (e ? this._dur : 0), t) : this._time;
	}, t.totalProgress = function(e, t) {
		return arguments.length ? this.totalTime(this.totalDuration() * e, t) : this.totalDuration() ? Math.min(1, this._tTime / this._tDur) : this.rawTime() >= 0 && this._initted ? 1 : 0;
	}, t.progress = function(e, t) {
		return arguments.length ? this.totalTime(this.duration() * (this._yoyo && !(this.iteration() & 1) ? 1 - e : e) + _f(this), t) : this.duration() ? Math.min(1, this._time / this._dur) : +(this.rawTime() > 0);
	}, t.iteration = function(e, t) {
		var n = this.duration() + this._rDelay;
		return arguments.length ? this.totalTime(this._time + (e - 1) * n, t) : this._repeat ? vf(this._tTime, n) + 1 : 1;
	}, t.timeScale = function(e, t) {
		if (!arguments.length) return this._rts === -Q ? 0 : this._rts;
		if (this._rts === e) return this;
		var n = this.parent && this._ts ? yf(this.parent._time, this) : this._tTime, r = this._rts < 0;
		this._rts = +e || 0, this._ts = this._ps || e === -Q ? 0 : this._rts;
		var i = this.totalDuration();
		return (r !== this._rts < 0 || n > 0 && n < i) && this.totalTime(If(-Math.abs(this._delay), i, n), t !== !1), bf(this), mf(this);
	}, t.paused = function(e) {
		if (!arguments.length) return this._ps;
		if (this._ps !== e) {
			if (this._ps = e, e) this._pTime = this._tTime || Math.max(-this._delay, this.rawTime()), this._ts = this._act = 0;
			else {
				xp(), this._ts = this._rts;
				var t = this.parent && !this.parent.smoothChildTiming ? this.rawTime() : this._tTime || this._pTime, n = this.progress() === 1 && Math.abs(this._zTime) !== Q, r;
				if (n) for (this._tTime -= Q, r = this._first; r;) {
					if (!r._dur && r._zTime < 0 && r._ts && r._start <= t + Q) {
						n = !1;
						break;
					}
					r = r._next;
				}
				this.totalTime(t, n);
			}
		}
		return this;
	}, t.startTime = function(e) {
		if (arguments.length) {
			this._start = Jd(e);
			var t = this.parent || this._dp;
			return t && (t._sort || !this.parent) && Cf(t, this, this._start - this._delay), this;
		}
		return this._start;
	}, t.endTime = function(e) {
		return this._start + (ad(e) ? this.totalDuration() : this.duration()) / Math.abs(this._ts || 1);
	}, t.rawTime = function(e) {
		var t = this.parent || this._dp;
		return t ? e && (!this._ts || this._repeat && this._time && this.totalProgress() < 1) ? this._tTime % (this._dur + this._rDelay) : this._ts ? yf(t.rawTime(e), this) : this._tTime : this._tTime;
	}, t.revert = function(e) {
		e === void 0 && (e = Nd);
		var t = Gu;
		return Gu = e, Qd(this) && (this.timeline && this.timeline.revert(e), this.totalTime(-.01, e.suppressEvents)), this.data !== "nested" && e.kill !== !1 && this.kill(), Gu = t, this;
	}, t.globalTime = function(e) {
		for (var t = this, n = arguments.length ? e : t.rawTime(); t;) n = t._start + n / (Math.abs(t._ts) || 1), t = t._dp;
		return !this.parent && this._sat ? this._sat.globalTime(e) : n;
	}, t.repeat = function(e) {
		return arguments.length ? (this._repeat = e === Infinity ? -2 : e, jf(this)) : this._repeat === -2 ? Infinity : this._repeat;
	}, t.repeatDelay = function(e) {
		if (arguments.length) {
			var t = this._time;
			return this._rDelay = e, jf(this), t ? this.time(t) : this;
		}
		return this._rDelay;
	}, t.yoyo = function(e) {
		return arguments.length ? (this._yoyo = e, this) : this._yoyo;
	}, t.seek = function(e, t) {
		return this.totalTime(Nf(this, e), ad(t));
	}, t.restart = function(e, t) {
		return this.play().totalTime(e ? -this._delay : 0, ad(t)), this._dur || (this._zTime = -Q), this;
	}, t.play = function(e, t) {
		return e != null && this.seek(e, t), this.reversed(!1).paused(!1);
	}, t.reverse = function(e, t) {
		return e != null && this.seek(e || this.totalDuration(), t), this.reversed(!0).paused(!1);
	}, t.pause = function(e, t) {
		return e != null && this.seek(e, t), this.paused(!0);
	}, t.resume = function() {
		return this.paused(!1);
	}, t.reversed = function(e) {
		return arguments.length ? (!!e !== this.reversed() && this.timeScale(-this._rts || (e ? -Q : 0)), this) : this._rts < 0;
	}, t.invalidate = function() {
		return this._initted = this._act = 0, this._zTime = -Q, this;
	}, t.isActive = function() {
		var e = this.parent || this._dp, t = this._start, n;
		return !!(!e || this._ts && this._initted && e.isActive() && (n = e.rawTime(!0)) >= t && n < this.endTime(!0) - Q);
	}, t.eventCallback = function(e, t, n) {
		var r = this.vars;
		return arguments.length > 1 ? (t ? (r[e] = t, n && (r[e + "Params"] = n), e === "onUpdate" && (this._onUpdate = t)) : delete r[e], this) : r[e];
	}, t.then = function(e) {
		var t = this, n = t._prom;
		return new Promise(function(r) {
			var i = td(e) ? e : tf, a = function() {
				var e = t.then;
				t.then = null, n && n(), td(i) && (i = i(t)) && (i.then || i === t) && (t.then = e), r(i), t.then = e;
			};
			t._initted && t.totalProgress() === 1 && t._ts >= 0 || !t._tTime && t._ts < 0 ? a() : t._prom = a;
		});
	}, t.kill = function() {
		op(this);
	}, e;
}();
nf(Fp.prototype, {
	_time: 0,
	_start: 0,
	_end: 0,
	_tTime: 0,
	_tDur: 0,
	_dirty: 0,
	_repeat: 0,
	_yoyo: !1,
	parent: null,
	_initted: !1,
	_rDelay: 0,
	_ts: 1,
	_dp: 0,
	ratio: 0,
	_zTime: -Q,
	_prom: 0,
	_ps: !1,
	_rts: 1
});
var Ip = /*#__PURE__*/ function(e) {
	Vu(t, e);
	function t(t, n) {
		var r;
		return t === void 0 && (t = {}), r = e.call(this, t) || this, r.labels = {}, r.smoothChildTiming = !!t.smoothChildTiming, r.autoRemoveChildren = !!t.autoRemoveChildren, r._sort = ad(t.sortChildren), yd && Cf(t.parent || yd, Bu(r), n), t.reversed && r.reverse(), t.paused && r.paused(!0), t.scrollTrigger && wf(Bu(r), t.scrollTrigger), r;
	}
	var n = t.prototype;
	return n.to = function(e, t, n) {
		return Pf(0, arguments, this), this;
	}, n.from = function(e, t, n) {
		return Pf(1, arguments, this), this;
	}, n.fromTo = function(e, t, n, r) {
		return Pf(2, arguments, this), this;
	}, n.set = function(e, t, n) {
		return t.duration = 0, t.parent = this, cf(t).repeatDelay || (t.repeat = 0), t.immediateRender = !!t.immediateRender, new Xp(e, t, Nf(this, n), 1), this;
	}, n.call = function(e, t, n) {
		return Cf(this, Xp.delayedCall(0, e, t), n);
	}, n.staggerTo = function(e, t, n, r, i, a, o) {
		return n.duration = t, n.stagger = n.stagger || r, n.onComplete = a, n.onCompleteParams = o, n.parent = this, new Xp(e, n, Nf(this, i)), this;
	}, n.staggerFrom = function(e, t, n, r, i, a, o) {
		return n.runBackwards = 1, cf(n).immediateRender = ad(n.immediateRender), this.staggerTo(e, t, n, r, i, a, o);
	}, n.staggerFromTo = function(e, t, n, r, i, a, o, s) {
		return r.startAt = n, cf(r).immediateRender = ad(r.immediateRender), this.staggerTo(e, t, r, i, a, o, s);
	}, n.render = function(e, t, n) {
		var r = this._time, i = this._dirty ? this.totalDuration() : this._tDur, a = this._dur, o = e <= 0 ? 0 : Jd(e), s = this._zTime < 0 != e < 0 && (this._initted || !a), c, l, u, d, f, p, m, h, g, _, v, y;
		if (this !== yd && o > i && e >= 0 && (o = i), o !== this._tTime || n || s) {
			if (r !== this._time && a && (o += this._time - r, e += this._time - r), c = o, g = this._start, h = this._ts, p = !h, s && (a || (r = this._zTime), (e || !t) && (this._zTime = e)), this._repeat) {
				if (v = this._yoyo, f = a + this._rDelay, this._repeat < -1 && e < 0) return this.totalTime(f * 100 + e, t, n);
				if (c = Jd(o % f), o === i ? (d = this._repeat, c = a) : (_ = Jd(o / f), d = ~~_, d && d === _ && (c = a, d--), c > a && (c = a)), _ = vf(this._tTime, f), !r && this._tTime && _ !== d && this._tTime - _ * f - this._dur <= 0 && (_ = d), v && d & 1 && (c = a - c, y = 1), d !== _ && !this._lock) {
					var b = v && _ & 1, x = b === (v && d & 1);
					if (d < _ && (b = !b), r = b ? 0 : o % a ? a : o, this._lock = 1, this.render(r || (y ? 0 : Jd(d * f)), t, !a)._lock = 0, this._tTime = o, !t && this.parent && ap(this, "onRepeat"), this.vars.repeatRefresh && !y && (this.invalidate()._lock = 1, _ = d), r && r !== this._time || p !== !this._ts || this.vars.onRepeat && !this.parent && !this._act || (a = this._dur, i = this._tDur, x && (this._lock = 2, r = b ? a : -1e-4, this.render(r, !0), this.vars.repeatRefresh && !y && this.invalidate()), this._lock = 0, !this._ts && !p)) return this;
				}
			}
			if (this._hasPause && !this._forcing && this._lock < 2 && (m = kf(this, Jd(r), Jd(c)), m && (o -= c - (c = m._start))), this._tTime = o, this._time = c, this._act = !!h, this._initted || (this._onUpdate = this.vars.onUpdate, this._initted = 1, this._zTime = e, r = 0), !r && o && a && !t && !_ && (ap(this, "onStart"), this._tTime !== o)) return this;
			if (c >= r && e >= 0) for (l = this._first; l;) {
				if (u = l._next, (l._act || c >= l._start) && l._ts && m !== l) {
					if (l.parent !== this) return this.render(e, t, n);
					if (l.render(l._ts > 0 ? (c - l._start) * l._ts : (l._dirty ? l.totalDuration() : l._tDur) + (c - l._start) * l._ts, t, n), c !== this._time || !this._ts && !p) {
						m = 0, u && (o += this._zTime = -Q);
						break;
					}
				}
				l = u;
			}
			else {
				l = this._last;
				for (var S = e < 0 ? e : c; l;) {
					if (u = l._prev, (l._act || S <= l._end) && l._ts && m !== l) {
						if (l.parent !== this) return this.render(e, t, n);
						if (l.render(l._ts > 0 ? (S - l._start) * l._ts : (l._dirty ? l.totalDuration() : l._tDur) + (S - l._start) * l._ts, t, n || Gu && Qd(l)), c !== this._time || !this._ts && !p) {
							m = 0, u && (o += this._zTime = S ? -Q : Q);
							break;
						}
					}
					l = u;
				}
			}
			if (m && !t && (this.pause(), m.render(c >= r ? 0 : -Q)._zTime = c >= r ? 1 : -1, this._ts)) return this._start = g, bf(this), this.render(e, t, n);
			this._onUpdate && !t && ap(this, "onUpdate", !0), (o === i && this._tTime >= this.totalDuration() || !o && r) && (g !== this._start && Math.abs(h) === Math.abs(this._ts) || this._lock || ((e || !a) && (o === i && this._ts > 0 || !o && this._ts < 0) && ff(this, 1), t || e < 0 && !r || !o && !r && i || (ap(this, o === i && e >= 0 ? "onComplete" : "onReverseComplete", !0), this._prom && !(o < i && this.timeScale() > 0) && this._prom())));
		}
		return this;
	}, n.add = function(e, t) {
		var n = this;
		if (nd(t) || (t = Nf(this, t, e)), !(e instanceof Fp)) {
			if (ld(e)) return e.forEach(function(e) {
				return n.add(e, t);
			}), this;
			if (ed(e)) return this.addLabel(e, t);
			if (td(e)) e = Xp.delayedCall(0, e);
			else return this;
		}
		return this === e ? this : Cf(this, e, t);
	}, n.getChildren = function(e, t, n, r) {
		e === void 0 && (e = !0), t === void 0 && (t = !0), n === void 0 && (n = !0), r === void 0 && (r = -qu);
		for (var i = [], a = this._first; a;) a._start >= r && (a instanceof Xp ? t && i.push(a) : (n && i.push(a), e && i.push.apply(i, a.getChildren(!0, t, n)))), a = a._next;
		return i;
	}, n.getById = function(e) {
		for (var t = this.getChildren(1, 1, 1), n = t.length; n--;) if (t[n].vars.id === e) return t[n];
	}, n.remove = function(e) {
		return ed(e) ? this.removeLabel(e) : td(e) ? this.killTweensOf(e) : (e.parent === this && df(this, e), e === this._recent && (this._recent = this._last), pf(this));
	}, n.totalTime = function(t, n) {
		return arguments.length ? (this._forcing = 1, !this._dp && this._ts && (this._start = Jd(bp.time - (this._ts > 0 ? t / this._ts : (this.totalDuration() - t) / -this._ts))), e.prototype.totalTime.call(this, t, n), this._forcing = 0, this) : this._tTime;
	}, n.addLabel = function(e, t) {
		return this.labels[e] = Nf(this, t), this;
	}, n.removeLabel = function(e) {
		return delete this.labels[e], this;
	}, n.addPause = function(e, t, n) {
		var r = Xp.delayedCall(0, t || Ad, n);
		return r.data = "isPause", this._hasPause = 1, Cf(this, r, Nf(this, e));
	}, n.removePause = function(e) {
		var t = this._first;
		for (e = Nf(this, e); t;) t._start === e && t.data === "isPause" && ff(t), t = t._next;
	}, n.killTweensOf = function(e, t, n) {
		for (var r = this.getTweensOf(e, n), i = r.length; i--;) Vp !== r[i] && r[i].kill(e, t);
		return this;
	}, n.getTweensOf = function(e, t) {
		for (var n = [], r = Hf(e), i = this._first, a = nd(t), o; i;) i instanceof Xp ? Xd(i._targets, r) && (a ? (!Vp || i._initted && i._ts) && i.globalTime(0) <= t && i.globalTime(i.totalDuration()) > t : !t || i.isActive()) && n.push(i) : (o = i.getTweensOf(r, t)).length && n.push.apply(n, o), i = i._next;
		return n;
	}, n.tweenTo = function(e, t) {
		t ||= {};
		var n = this, r = Nf(n, e), i = t, a = i.startAt, o = i.onStart, s = i.onStartParams, c = i.immediateRender, l, u = Xp.to(n, nf({
			ease: t.ease || "none",
			lazy: !1,
			immediateRender: !1,
			time: r,
			overwrite: "auto",
			duration: t.duration || Math.abs((r - (a && "time" in a ? a.time : n._time)) / n.timeScale()) || Q,
			onStart: function() {
				if (n.pause(), !l) {
					var e = t.duration || Math.abs((r - (a && "time" in a ? a.time : n._time)) / n.timeScale());
					u._dur !== e && Af(u, e, 0, 1).render(u._time, !0, !0), l = 1;
				}
				o && o.apply(u, s || []);
			}
		}, t));
		return c ? u.render(0) : u;
	}, n.tweenFromTo = function(e, t, n) {
		return this.tweenTo(t, nf({ startAt: { time: Nf(this, e) } }, n));
	}, n.recent = function() {
		return this._recent;
	}, n.nextLabel = function(e) {
		return e === void 0 && (e = this._time), ip(this, Nf(this, e));
	}, n.previousLabel = function(e) {
		return e === void 0 && (e = this._time), ip(this, Nf(this, e), 1);
	}, n.currentLabel = function(e) {
		return arguments.length ? this.seek(e, !0) : this.previousLabel(this._time + Q);
	}, n.shiftChildren = function(e, t, n) {
		n === void 0 && (n = 0);
		var r = this._first, i = this.labels, a;
		for (e = Jd(e); r;) r._start >= n && (r._start += e, r._end += e), r = r._next;
		if (t) for (a in i) i[a] >= n && (i[a] += e);
		return pf(this);
	}, n.invalidate = function(t) {
		var n = this._first;
		for (this._lock = 0; n;) n.invalidate(t), n = n._next;
		return e.prototype.invalidate.call(this, t);
	}, n.clear = function(e) {
		e === void 0 && (e = !0);
		for (var t = this._first, n; t;) n = t._next, this.remove(t), t = n;
		return this._dp && (this._time = this._tTime = this._pTime = 0), e && (this.labels = {}), pf(this);
	}, n.totalDuration = function(e) {
		var t = 0, n = this, r = n._last, i = qu, a, o, s;
		if (arguments.length) return n.timeScale((n._repeat < 0 ? n.duration() : n.totalDuration()) / (n.reversed() ? -e : e));
		if (n._dirty) {
			for (s = n.parent; r;) a = r._prev, r._dirty && r.totalDuration(), o = r._start, o > i && n._sort && r._ts && !n._lock ? (n._lock = 1, Cf(n, r, o - r._delay, 1)._lock = 0) : i = o, o < 0 && r._ts && (t -= o, (!s && !n._dp || s && s.smoothChildTiming) && (n._start += Jd(o / n._ts), n._time -= o, n._tTime -= o), n.shiftChildren(-o, !1, -Infinity), i = 0), r._end > t && r._ts && (t = r._end), r = a;
			Af(n, n === yd && n._time > t ? n._time : t, 1, 1), n._dirty = 0;
		}
		return n._tDur;
	}, t.updateRoot = function(e) {
		if (yd._ts && ($d(yd, yf(e, yd)), Ld = bp.frame), bp.frame >= Bd) {
			Bd += Hu.autoSleep || 120;
			var t = yd._first;
			if ((!t || !t._ts) && Hu.autoSleep && bp._listeners.length < 2) {
				for (; t && !t._ts;) t = t._next;
				t || bp.sleep();
			}
		}
	}, t;
}(Fp);
nf(Ip.prototype, {
	_lock: 0,
	_hasPause: 0,
	_forcing: 0
});
var Lp = function(e, t, n, r, i, a, o) {
	var s = new um(this._pt, e, t, 0, 1, im, null, i), c = 0, l = 0, u, d, f, p, m, h, g, _;
	for (s.b = n, s.e = r, n += "", r += "", (g = ~r.indexOf("random(")) && (r = tp(r)), a && (_ = [n, r], a(_, e, t), n = _[0], r = _[1]), d = n.match(hd) || []; u = hd.exec(r);) p = u[0], m = r.substring(c, u.index), f ? f = (f + 1) % 5 : m.substr(-5) === "rgba(" && (f = 1), p !== d[l++] && (h = parseFloat(d[l - 1]) || 0, s._pt = {
		_next: s._pt,
		p: m || l === 1 ? m : ",",
		s: h,
		c: p.charAt(1) === "=" ? Yd(h, p) - h : parseFloat(p) - h,
		m: f && f < 4 ? Math.round : 0
	}, c = hd.lastIndex);
	return s.c = c < r.length ? r.substring(c, r.length) : "", s.fp = o, (gd.test(r) || g) && (s.e = 0), this._pt = s, s;
}, Rp = function(e, t, n, r, i, a, o, s, c, l) {
	td(r) && (r = r(i || 0, e, a));
	var u = e[t], d = n === "get" ? td(u) ? c ? e[t.indexOf("set") || !td(e["get" + t.substr(3)]) ? t : "get" + t.substr(3)](c) : e[t]() : u : n, f = td(u) ? c ? $p : Qp : Zp, p;
	if (ed(r) && (~r.indexOf("random(") && (r = tp(r)), r.charAt(1) === "=" && (p = Yd(d, r) + (Lf(d) || 0), (p || p === 0) && (r = p))), !l || d !== r || Hp) return !isNaN(d * r) && r !== "" ? (p = new um(this._pt, e, t, +d || 0, r - (d || 0), typeof u == "boolean" ? rm : nm, 0, f), c && (p.fp = c), o && p.modifier(o, this, e), this._pt = p) : (!u && !(t in e) && Dd(t, r), Lp.call(this, e, t, d, r, f, s || Hu.stringFilter, c));
}, zp = function(e, t, n, r, i) {
	if (td(e) && (e = qp(e, i, t, n, r)), !id(e) || e.style && e.nodeType || ld(e) || cd(e)) return ed(e) ? qp(e, i, t, n, r) : e;
	var a = {}, o;
	for (o in e) a[o] = qp(e[o], i, t, n, r);
	return a;
}, Bp = function(e, t, n, r, i, a) {
	var o, s, c, l;
	if (Rd[e] && (o = new Rd[e]()).init(i, o.rawVars ? t[e] : zp(t[e], r, i, a, n), n, r, a) !== !1 && (n._pt = s = new um(n._pt, i, e, 0, 1, o.render, o, 0, o.priority), n !== sp)) for (c = n._ptLookup[n._targets.indexOf(i)], l = o._props.length; l--;) c[o._props[l]] = s;
	return o;
}, Vp, Hp, Up = function e(t, n, r) {
	var i = t.vars, a = i.ease, o = i.startAt, s = i.immediateRender, c = i.lazy, l = i.onUpdate, u = i.runBackwards, d = i.yoyoEase, f = i.keyframes, p = i.autoRevert, m = t._dur, h = t._startAt, g = t._targets, _ = t.parent, v = _ && _.data === "nested" ? _.vars.targets : g, y = t._overwrite === "auto" && !Wu, b = t.timeline, x = i.easeReverse || d, S, C, w, T, E, D, O, k, A, j, M, N, P;
	if (!b || f && a || (a = "none"), t._ease = kp(a, Uu.ease), t._rEase = x && (kp(x) || t._ease), t._from = !b && !!i.runBackwards, t._from && (t.ratio = 1), !b || f && !i.stagger) {
		if (k = g[0] ? Wd(g[0]).harness : 0, N = k && i[k.prop], S = sf(i, Pd), h && (h._zTime < 0 && h.progress(1), n < 0 && u && s && !p ? h.render(-1, !0) : h.revert(u && m ? Md : jd), h._lazy = 0), o) {
			if (ff(t._startAt = Xp.set(g, nf({
				data: "isStart",
				overwrite: !1,
				parent: _,
				immediateRender: !0,
				lazy: !h && ad(c),
				startAt: null,
				delay: 0,
				onUpdate: l && function() {
					return ap(t, "onUpdate");
				},
				stagger: 0
			}, o))), t._startAt._dp = 0, t._startAt._sat = t, n < 0 && (Gu || !s && !p) && t._startAt.revert(Md), s && m && n <= 0 && r <= 0) {
				n && (t._zTime = n);
				return;
			}
		} else if (u && m && !h) {
			if (n && (s = !1), w = nf({
				overwrite: !1,
				data: "isFromStart",
				lazy: s && !h && ad(c),
				immediateRender: s,
				stagger: 0,
				parent: _
			}, S), N && (w[k.prop] = N), ff(t._startAt = Xp.set(g, w)), t._startAt._dp = 0, t._startAt._sat = t, n < 0 && (Gu ? t._startAt.revert(Md) : t._startAt.render(-1, !0)), t._zTime = n, !s) e(t._startAt, Q, Q);
			else if (!n) return;
		}
		for (t._pt = t._ptCache = 0, c = m && ad(c) || c && !m, C = 0; C < g.length; C++) {
			if (E = g[C], O = E._gsap || Ud(g)[C]._gsap, t._ptLookup[C] = j = {}, Id[O.id] && Fd.length && Zd(), M = v === g ? C : v.indexOf(E), k && (A = new k()).init(E, N || S, t, M, v) !== !1 && (t._pt = T = new um(t._pt, E, A.name, 0, 1, A.render, A, 0, A.priority), A._props.forEach(function(e) {
				j[e] = T;
			}), A.priority && (D = 1)), !k || N) for (w in S) Rd[w] && (A = Bp(w, S, t, M, E, v)) ? A.priority && (D = 1) : j[w] = T = Rp.call(t, E, w, "get", S[w], M, v, 0, i.stringFilter);
			t._op && t._op[C] && t.kill(E, t._op[C]), y && t._pt && (Vp = t, yd.killTweensOf(E, j, t.globalTime(n)), P = !t.parent, Vp = 0), t._pt && c && (Id[O.id] = 1);
		}
		D && lm(t), t._onInit && t._onInit(t);
	}
	t._onUpdate = l, t._initted = (!t._op || t._pt) && !P, f && n <= 0 && b.render(qu, !0, !0);
}, Wp = function(e, t, n, r, i, a, o, s) {
	var c = (e._pt && e._ptCache || (e._ptCache = {}))[t], l, u, d, f;
	if (!c) for (c = e._ptCache[t] = [], d = e._ptLookup, f = e._targets.length; f--;) {
		if (l = d[f][t], l && l.d && l.d._pt) for (l = l.d._pt; l && l.p !== t && l.fp !== t;) l = l._next;
		if (!l) return Hp = 1, e.vars[t] = "+=0", Up(e, o), Hp = 0, s ? Od(t + " not eligible for reset. Try splitting into individual properties") : 1;
		c.push(l);
	}
	for (f = c.length; f--;) u = c[f], l = u._pt || u, l.s = (r || r === 0) && !i ? r : l.s + (r || 0) + a * l.c, l.c = n - l.s, u.e && (u.e = qd(n) + Lf(u.e)), u.b && (u.b = l.s + Lf(u.b));
}, Gp = function(e, t) {
	var n = e[0] ? Wd(e[0]).harness : 0, r = n && n.aliases, i, a, o, s;
	if (!r) return t;
	for (a in i = af({}, t), r) if (a in i) for (s = r[a].split(","), o = s.length; o--;) i[s[o]] = i[a];
	return i;
}, Kp = function(e, t, n, r) {
	var i = t.ease || r || "power1.inOut", a, o;
	if (ld(t)) o = n[e] || (n[e] = []), t.forEach(function(e, n) {
		return o.push({
			t: n / (t.length - 1) * 100,
			v: e,
			e: i
		});
	});
	else for (a in t) o = n[a] || (n[a] = []), a === "ease" || o.push({
		t: parseFloat(e),
		v: t[a],
		e: i
	});
}, qp = function(e, t, n, r, i) {
	return td(e) ? e.call(t, n, r, i) : ed(e) && ~e.indexOf("random(") ? tp(e) : e;
}, Jp = Hd + "repeat,repeatDelay,yoyo,repeatRefresh,yoyoEase,easeReverse,autoRevert", Yp = {};
Kd(Jp + ",id,stagger,delay,duration,paused,scrollTrigger", function(e) {
	return Yp[e] = 1;
}), Jp = Jp.split(",");
var Xp = /*#__PURE__*/ function(e) {
	Vu(t, e);
	function t(t, n, r, i) {
		var a;
		typeof n == "number" && (r.duration = n, n = r, r = null), a = e.call(this, i ? n : cf(n)) || this;
		var o = a.vars, s = o.duration, c = o.delay, l = o.immediateRender, u = o.stagger, d = o.overwrite, f = o.keyframes, p = o.defaults, m = o.scrollTrigger, h = n.parent || yd, g = (ld(t) || cd(t) ? nd(t[0]) : "length" in n) ? [t] : Hf(t), _, v, y, b, x, S, C, w;
		if (a._targets = g.length ? Ud(g) : Od("GSAP target " + t + " not found. https://gsap.com", !Hu.nullTargetWarn) || [], a._ptLookup = [], a._overwrite = d, f || u || sd(s) || sd(c)) {
			n = a.vars;
			var T = n.easeReverse || n.yoyoEase;
			if (_ = a.timeline = new Ip({
				data: "nested",
				defaults: p || {},
				targets: h && h.data === "nested" ? h.vars.targets : g
			}), _.kill(), _.parent = _._dp = Bu(a), _._start = 0, u || sd(s) || sd(c)) {
				if (b = g.length, C = u && Gf(u), id(u)) for (x in u) ~Jp.indexOf(x) && (w ||= {}, w[x] = u[x]);
				for (v = 0; v < b; v++) y = sf(n, Yp), y.stagger = 0, T && (y.easeReverse = T), w && af(y, w), S = g[v], y.duration = +qp(s, Bu(a), v, S, g), y.delay = (+qp(c, Bu(a), v, S, g) || 0) - a._delay, !u && b === 1 && y.delay && (a._delay = c = y.delay, a._start += c, y.delay = 0), _.to(S, y, C ? C(v, S, g) : 0), _._ease = Sp.none;
				_.duration() ? s = c = 0 : a.timeline = 0;
			} else if (f) {
				cf(nf(_.vars.defaults, { ease: "none" })), _._ease = kp(f.ease || n.ease || "none");
				var E = 0, D, O, k;
				if (ld(f)) f.forEach(function(e) {
					return _.to(g, e, ">");
				}), _.duration();
				else {
					for (x in y = {}, f) x === "ease" || x === "easeEach" || Kp(x, f[x], y, f.easeEach);
					for (x in y) for (D = y[x].sort(function(e, t) {
						return e.t - t.t;
					}), E = 0, v = 0; v < D.length; v++) O = D[v], k = {
						ease: O.e,
						duration: (O.t - (v ? D[v - 1].t : 0)) / 100 * s
					}, k[x] = O.v, _.to(g, k, E), E += k.duration;
					_.duration() < s && _.to({}, { duration: s - _.duration() });
				}
			}
			s || a.duration(s = _.duration());
		} else a.timeline = 0;
		return d === !0 && !Wu && (Vp = Bu(a), yd.killTweensOf(g), Vp = 0), Cf(h, Bu(a), r), n.reversed && a.reverse(), n.paused && a.paused(!0), (l || !s && !f && a._start === Jd(h._time) && ad(l) && gf(Bu(a)) && h.data !== "nested") && (a._tTime = -Q, a.render(Math.max(0, -c) || 0)), m && wf(Bu(a), m), a;
	}
	var n = t.prototype;
	return n.render = function(e, t, n) {
		var r = this._time, i = this._tDur, a = this._dur, o = e < 0, s = e > i - Q && !o ? i : e < Q ? 0 : e, c, l, u, d, f, p, m, h;
		if (!a) Of(this, e, t, n);
		else if (s !== this._tTime || !e || n || !this._initted && this._tTime || this._startAt && this._zTime < 0 !== o || this._lazy) {
			if (c = s, h = this.timeline, this._repeat) {
				if (d = a + this._rDelay, this._repeat < -1 && o) return this.totalTime(d * 100 + e, t, n);
				if (c = Jd(s % d), s === i ? (u = this._repeat, c = a) : (f = Jd(s / d), u = ~~f, u && u === f ? (c = a, u--) : c > a && (c = a)), p = this._yoyo && u & 1, p && (c = a - c), f = vf(this._tTime, d), c === r && !n && this._initted && u === f) return this._tTime = s, this;
				u !== f && this.vars.repeatRefresh && !p && !this._lock && c !== d && this._initted && (this._lock = n = 1, this.render(Jd(d * u), !0).invalidate()._lock = 0);
			}
			if (!this._initted) {
				if (Tf(this, o ? e : c, n, t, s)) return this._tTime = 0, this;
				if (r !== this._time && !(n && this.vars.repeatRefresh && u !== f)) return this;
				if (a !== this._dur) return this.render(e, t, n);
			}
			if (this._rEase) {
				var g = c < r;
				if (g !== this._inv) {
					var _ = g ? r : a - r;
					this._inv = g, this._from && (this.ratio = 1 - this.ratio), this._invRatio = this.ratio, this._invTime = r, this._invRecip = _ ? (g ? -1 : 1) / _ : 0, this._invScale = g ? -this.ratio : 1 - this.ratio, this._invEase = g ? this._rEase : this._ease;
				}
				this.ratio = m = this._invRatio + this._invScale * this._invEase((c - this._invTime) * this._invRecip);
			} else this.ratio = m = this._ease(c / a);
			if (this._from && (this.ratio = m = 1 - m), this._tTime = s, this._time = c, !this._act && this._ts && (this._act = 1, this._lazy = 0), !r && s && !t && !f && (ap(this, "onStart"), this._tTime !== s)) return this;
			for (l = this._pt; l;) l.r(m, l.d), l = l._next;
			h && h.render(e < 0 ? e : h._dur * h._ease(c / this._dur), t, n) || this._startAt && (this._zTime = e), this._onUpdate && !t && (o && hf(this, e, t, n), ap(this, "onUpdate")), this._repeat && u !== f && this.vars.onRepeat && !t && this.parent && ap(this, "onRepeat"), s !== this._tDur && s || this._tTime !== s || (o && !this._onUpdate && hf(this, e, !0, !0), (e || !a) && (s === this._tDur && this._ts > 0 || !s && this._ts < 0) && ff(this, 1), !t && (!o || r) && (s || r || p) && (ap(this, s === i ? "onComplete" : "onReverseComplete", !0), this._prom && !(s < i && this.timeScale() > 0) && this._prom()));
		}
		return this;
	}, n.targets = function() {
		return this._targets;
	}, n.invalidate = function(t) {
		return t && this.vars.runBackwards || (this._startAt = 0), this._pt = this._op = this._onUpdate = this._lazy = this.ratio = 0, this._ptLookup = [], this.timeline && this.timeline.invalidate(t), e.prototype.invalidate.call(this, t);
	}, n.resetTo = function(e, t, n, r, i) {
		yp || bp.wake(), this._ts || this.play();
		var a = Math.min(this._dur, (this._dp._time - this._start) * this._ts), o;
		return this._initted || Up(this, a), o = this._ease(a / this._dur), Wp(this, e, t, n, r, o, a, i) ? this.resetTo(e, t, n, r, 1) : (xf(this, 0), this.parent || uf(this._dp, this, "_first", "_last", this._dp._sort ? "_start" : 0), this.render(0));
	}, n.kill = function(e, t) {
		if (t === void 0 && (t = "all"), !e && (!t || t === "all")) return this._lazy = this._pt = 0, this.parent ? op(this) : this.scrollTrigger && this.scrollTrigger.kill(!!Gu), this;
		if (this.timeline) {
			var n = this.timeline.totalDuration();
			return this.timeline.killTweensOf(e, t, Vp && Vp.vars.overwrite !== !0)._first || op(this), this.parent && n !== this.timeline.totalDuration() && Af(this, this._dur * this.timeline._tDur / n, 0, 1), this;
		}
		var r = this._targets, i = e ? Hf(e) : r, a = this._ptLookup, o = this._pt, s, c, l, u, d, f, p;
		if ((!t || t === "all") && lf(r, i)) return t === "all" && (this._pt = 0), op(this);
		for (s = this._op = this._op || [], t !== "all" && (ed(t) && (d = {}, Kd(t, function(e) {
			return d[e] = 1;
		}), t = d), t = Gp(r, t)), p = r.length; p--;) if (~i.indexOf(r[p])) for (d in c = a[p], t === "all" ? (s[p] = t, u = c, l = {}) : (l = s[p] = s[p] || {}, u = t), u) f = c && c[d], f && ("kill" in f.d && f.d.kill(d) !== !0 || df(this, f, "_pt"), delete c[d]), l !== "all" && (l[d] = 1);
		return this._initted && !this._pt && o && op(this), this;
	}, t.to = function(e, n) {
		return new t(e, n, arguments[2]);
	}, t.from = function(e, t) {
		return Pf(1, arguments);
	}, t.delayedCall = function(e, n, r, i) {
		return new t(n, 0, {
			immediateRender: !1,
			lazy: !1,
			overwrite: !1,
			delay: e,
			onComplete: n,
			onReverseComplete: n,
			onCompleteParams: r,
			onReverseCompleteParams: r,
			callbackScope: i
		});
	}, t.fromTo = function(e, t, n) {
		return Pf(2, arguments);
	}, t.set = function(e, n) {
		return n.duration = 0, n.repeatDelay || (n.repeat = 0), new t(e, n);
	}, t.killTweensOf = function(e, t, n) {
		return yd.killTweensOf(e, t, n);
	}, t;
}(Fp);
nf(Xp.prototype, {
	_targets: [],
	_lazy: 0,
	_startAt: 0,
	_op: 0,
	_onInit: 0
}), Kd("staggerTo,staggerFrom,staggerFromTo", function(e) {
	Xp[e] = function() {
		var t = new Ip(), n = zf.call(arguments, 0);
		return n.splice(e === "staggerFromTo" ? 5 : 4, 0, 0), t[e].apply(t, n);
	};
});
var Zp = function(e, t, n) {
	return e[t] = n;
}, Qp = function(e, t, n) {
	return e[t](n);
}, $p = function(e, t, n, r) {
	return e[t](r.fp, n);
}, em = function(e, t, n) {
	return e.setAttribute(t, n);
}, tm = function(e, t) {
	return td(e[t]) ? Qp : rd(e[t]) && e.setAttribute ? em : Zp;
}, nm = function(e, t) {
	return t.set(t.t, t.p, Math.round((t.s + t.c * e) * 1e6) / 1e6, t);
}, rm = function(e, t) {
	return t.set(t.t, t.p, !!(t.s + t.c * e), t);
}, im = function(e, t) {
	var n = t._pt, r = "";
	if (!e && t.b) r = t.b;
	else if (e === 1 && t.e) r = t.e;
	else {
		for (; n;) r = n.p + (n.m ? n.m(n.s + n.c * e) : Math.round((n.s + n.c * e) * 1e4) / 1e4) + r, n = n._next;
		r += t.c;
	}
	t.set(t.t, t.p, r, t);
}, am = function(e, t) {
	for (var n = t._pt; n;) n.r(e, n.d), n = n._next;
}, om = function(e, t, n, r) {
	for (var i = this._pt, a; i;) a = i._next, i.p === r && i.modifier(e, t, n), i = a;
}, sm = function(e) {
	for (var t = this._pt, n, r; t;) r = t._next, t.p === e && !t.op || t.op === e ? df(this, t, "_pt") : t.dep || (n = 1), t = r;
	return !n;
}, cm = function(e, t, n, r) {
	r.mSet(e, t, r.m.call(r.tween, n, r.mt), r);
}, lm = function(e) {
	for (var t = e._pt, n, r, i, a; t;) {
		for (n = t._next, r = i; r && r.pr > t.pr;) r = r._next;
		(t._prev = r ? r._prev : a) ? t._prev._next = t : i = t, (t._next = r) ? r._prev = t : a = t, t = n;
	}
	e._pt = i;
}, um = /*#__PURE__*/ function() {
	function e(e, t, n, r, i, a, o, s, c) {
		this.t = t, this.s = r, this.c = i, this.p = n, this.r = a || nm, this.d = o || this, this.set = s || Zp, this.pr = c || 0, this._next = e, e && (e._prev = this);
	}
	var t = e.prototype;
	return t.modifier = function(e, t, n) {
		this.mSet = this.mSet || this.set, this.set = cm, this.m = e, this.mt = n, this.tween = t;
	}, e;
}();
Kd(Hd + "parent,duration,ease,delay,overwrite,runBackwards,startAt,yoyo,immediateRender,repeat,repeatDelay,data,paused,reversed,lazy,callbackScope,stringFilter,id,yoyoEase,stagger,inherit,repeatRefresh,keyframes,autoRevert,scrollTrigger,easeReverse", function(e) {
	return Pd[e] = 1;
}), Cd.TweenMax = Cd.TweenLite = Xp, Cd.TimelineLite = Cd.TimelineMax = Ip, yd = new Ip({
	sortChildren: !1,
	defaults: Uu,
	autoRemoveChildren: !0,
	id: "root",
	smoothChildTiming: !0
}), Hu.stringFilter = vp;
var dm = [], fm = {}, pm = [], mm = 0, hm = 0, gm = function(e) {
	return (fm[e] || pm).map(function(e) {
		return e();
	});
}, _m = function() {
	var e = Date.now(), t = [];
	e - mm > 2 && (gm("matchMediaInit"), dm.forEach(function(e) {
		var n = e.queries, r = e.conditions, i, a, o, s;
		for (a in n) i = bd.matchMedia(n[a]).matches, i && (o = 1), i !== r[a] && (r[a] = i, s = 1);
		s && (e.revert(), o && t.push(e));
	}), gm("matchMediaRevert"), t.forEach(function(e) {
		return e.onMatch(e, function(t) {
			return e.add(null, t);
		});
	}), mm = e, gm("matchMedia"));
}, vm = /*#__PURE__*/ function() {
	function e(e, t) {
		this.selector = t && Uf(t), this.data = [], this._r = [], this.isReverted = !1, this.id = hm++, e && this.add(e);
	}
	var t = e.prototype;
	return t.add = function(e, t, n) {
		td(e) && (n = t, t = e, e = td);
		var r = this, i = function() {
			var e = Ku, i = r.selector, a;
			return e && e !== r && e.data.push(r), n && (r.selector = Uf(n)), Ku = r, a = t.apply(r, arguments), td(a) && r._r.push(a), Ku = e, r.selector = i, r.isReverted = !1, a;
		};
		return r.last = i, e === td ? i(r, function(e) {
			return r.add(null, e);
		}) : e ? r[e] = i : i;
	}, t.ignore = function(e) {
		var t = Ku;
		Ku = null, e(this), Ku = t;
	}, t.getTweens = function() {
		var t = [];
		return this.data.forEach(function(n) {
			return n instanceof e ? t.push.apply(t, n.getTweens()) : n instanceof Xp && !(n.parent && n.parent.data === "nested") && t.push(n);
		}), t;
	}, t.clear = function() {
		this._r.length = this.data.length = 0;
	}, t.kill = function(e, t) {
		var n = this;
		if (e ? (function() {
			for (var t = n.getTweens(), r = n.data.length, i; r--;) i = n.data[r], i.data === "isFlip" && (i.revert(), i.getChildren(!0, !0, !1).forEach(function(e) {
				return t.splice(t.indexOf(e), 1);
			}));
			for (t.map(function(e) {
				return {
					g: e._dur || e._delay || e._sat && !e._sat.vars.immediateRender ? e.globalTime(0) : -Infinity,
					t: e
				};
			}).sort(function(e, t) {
				return t.g - e.g || -Infinity;
			}).forEach(function(t) {
				return t.t.revert(e);
			}), r = n.data.length; r--;) i = n.data[r], i instanceof Ip ? i.data !== "nested" && (i.scrollTrigger && i.scrollTrigger.revert(), i.kill()) : !(i instanceof Xp) && i.revert && i.revert(e);
			n._r.forEach(function(t) {
				return t(e, n);
			}), n.isReverted = !0;
		})() : this.data.forEach(function(e) {
			return e.kill && e.kill();
		}), this.clear(), t) {
			for (var r = dm.length; r--;) dm[r].id === this.id && dm.splice(r, 1);
			this._mqs && this._mqs.forEach(function(e) {
				return e.removeListener ? e.removeListener(_m) : e.removeEventListener("change", _m);
			}), this._mqs = null;
		}
	}, t.revert = function(e) {
		this.kill(e || {});
	}, e;
}(), ym = /*#__PURE__*/ function() {
	function e(e) {
		this.contexts = [], this.scope = e, Ku && Ku.data.push(this);
	}
	var t = e.prototype;
	return t.add = function(e, t, n) {
		id(e) || (e = { matches: e });
		var r = new vm(0, n || this.scope), i = r.conditions = {}, a, o, s;
		for (o in Ku && !r.selector && (r.selector = Ku.selector), this.contexts.push(r), t = r.add("onMatch", t), r.queries = e, e) o === "all" ? s = 1 : (a = bd.matchMedia(e[o]), a && (dm.indexOf(r) < 0 && dm.push(r), (i[o] = a.matches) && (s = 1), a.addListener ? a.addListener(_m) : a.addEventListener("change", _m), (r._mqs ||= []).push(a)));
		return s && t(r, function(e) {
			return r.add(null, e);
		}), this;
	}, t.revert = function(e) {
		this.kill(e || {});
	}, t.kill = function(e) {
		this.contexts.forEach(function(t) {
			return t.kill(e, !0);
		});
	}, e;
}(), bm = {
	registerPlugin: function() {
		[...arguments].forEach(function(e) {
			return lp(e);
		});
	},
	timeline: function(e) {
		return new Ip(e);
	},
	getTweensOf: function(e, t) {
		return yd.getTweensOf(e, t);
	},
	getProperty: function(e, t, n, r) {
		ed(e) && (e = Hf(e)[0]);
		var i = Wd(e || {}).get, a = n ? tf : ef;
		return n === "native" && (n = ""), e && (t ? a((Rd[t] && Rd[t].get || i)(e, t, n, r)) : function(t, n, r) {
			return a((Rd[t] && Rd[t].get || i)(e, t, n, r));
		});
	},
	quickSetter: function(e, t, n) {
		if (e = Hf(e), e.length > 1) {
			var r = e.map(function(e) {
				return wm.quickSetter(e, t, n);
			}), i = r.length;
			return function(e) {
				for (var t = i; t--;) r[t](e);
			};
		}
		e = e[0] || {};
		var a = Rd[t], o = Wd(e), s = o.harness && (o.harness.aliases || {})[t] || t, c = a ? function(t) {
			var r = new a();
			sp._pt = 0, r.init(e, n ? t + n : t, sp, 0, [e]), r.render(1, r), sp._pt && am(1, sp);
		} : o.set(e, s);
		return a ? c : function(t) {
			return c(e, s, n ? t + n : t, o, 1);
		};
	},
	quickTo: function(e, t, n) {
		var r, i = wm.to(e, nf((r = {}, r[t] = "+=0.1", r.paused = !0, r.stagger = 0, r), n || {})), a = function(e, n, r) {
			return i.resetTo(t, e, n, r);
		};
		return a.tween = i, a;
	},
	isTweening: function(e) {
		return yd.getTweensOf(e, !0).length > 0;
	},
	defaults: function(e) {
		return e && e.ease && (e.ease = kp(e.ease, Uu.ease)), of(Uu, e || {});
	},
	config: function(e) {
		return of(Hu, e || {});
	},
	registerEffect: function(e) {
		var t = e.name, n = e.effect, r = e.plugins, i = e.defaults, a = e.extendTimeline;
		(r || "").split(",").forEach(function(e) {
			return e && !Rd[e] && !Cd[e] && Od(t + " effect requires " + e + " plugin.");
		}), zd[t] = function(e, t, r) {
			return n(Hf(e), nf(t || {}, i), r);
		}, a && (Ip.prototype[t] = function(e, n, r) {
			return this.add(zd[t](e, id(n) ? n : (r = n) && {}, this), r);
		});
	},
	registerEase: function(e, t) {
		Sp[e] = kp(t);
	},
	parseEase: function(e, t) {
		return arguments.length ? kp(e, t) : Sp;
	},
	getById: function(e) {
		return yd.getById(e);
	},
	exportRoot: function(e, t) {
		e === void 0 && (e = {});
		var n = new Ip(e), r, i;
		for (n.smoothChildTiming = ad(e.smoothChildTiming), yd.remove(n), n._dp = 0, n._time = n._tTime = yd._time, r = yd._first; r;) i = r._next, (t || !(!r._dur && r instanceof Xp && r.vars.onComplete === r._targets[0])) && Cf(n, r, r._start - r._delay), r = i;
		return Cf(yd, n, 0), n;
	},
	context: function(e, t) {
		return e ? new vm(e, t) : Ku;
	},
	matchMedia: function(e) {
		return new ym(e);
	},
	matchMediaRefresh: function() {
		return dm.forEach(function(e) {
			var t = e.conditions, n, r;
			for (r in t) t[r] && (t[r] = !1, n = 1);
			n && e.revert();
		}) || _m();
	},
	addEventListener: function(e, t) {
		var n = fm[e] || (fm[e] = []);
		~n.indexOf(t) || n.push(t);
	},
	removeEventListener: function(e, t) {
		var n = fm[e], r = n && n.indexOf(t);
		r >= 0 && n.splice(r, 1);
	},
	utils: {
		wrap: $f,
		wrapYoyo: ep,
		distribute: Gf,
		random: Jf,
		snap: qf,
		normalize: Zf,
		getUnit: Lf,
		clamp: Rf,
		splitColor: pp,
		toArray: Hf,
		selector: Uf,
		mapRange: np,
		pipe: Yf,
		unitize: Xf,
		interpolate: rp,
		shuffle: Wf
	},
	install: Ed,
	effects: zd,
	ticker: bp,
	updateRoot: Ip.updateRoot,
	plugins: Rd,
	globalTimeline: yd,
	core: {
		PropTween: um,
		globals: kd,
		Tween: Xp,
		Timeline: Ip,
		Animation: Fp,
		getCache: Wd,
		_removeLinkedListItem: df,
		reverting: function() {
			return Gu;
		},
		context: function(e) {
			return e && Ku && (Ku.data.push(e), e._ctx = Ku), Ku;
		},
		suppressOverwrites: function(e) {
			return Wu = e;
		}
	}
};
Kd("to,from,fromTo,delayedCall,set,killTweensOf", function(e) {
	return bm[e] = Xp[e];
}), bp.add(Ip.updateRoot), sp = bm.to({}, { duration: 0 });
var xm = function(e, t) {
	for (var n = e._pt; n && n.p !== t && n.op !== t && n.fp !== t;) n = n._next;
	return n;
}, Sm = function(e, t) {
	var n = e._targets, r, i, a;
	for (r in t) for (i = n.length; i--;) a = e._ptLookup[i][r], (a &&= a.d) && (a._pt && (a = xm(a, r)), a && a.modifier && a.modifier(t[r], e, n[i], r));
}, Cm = function(e, t) {
	return {
		name: e,
		headless: 1,
		rawVars: 1,
		init: function(e, n, r) {
			r._onInit = function(e) {
				var r, i;
				if (ed(n) && (r = {}, Kd(n, function(e) {
					return r[e] = 1;
				}), n = r), t) {
					for (i in r = {}, n) r[i] = t(n[i]);
					n = r;
				}
				Sm(e, n);
			};
		}
	};
}, wm = bm.registerPlugin({
	name: "attr",
	init: function(e, t, n, r, i) {
		var a, o, s;
		for (a in this.tween = n, t) s = e.getAttribute(a) || "", o = this.add(e, "setAttribute", (s || 0) + "", t[a], r, i, 0, 0, a), o.op = a, o.b = s, this._props.push(a);
	},
	render: function(e, t) {
		for (var n = t._pt; n;) Gu ? n.set(n.t, n.p, n.b, n) : n.r(e, n.d), n = n._next;
	}
}, {
	name: "endArray",
	headless: 1,
	init: function(e, t) {
		for (var n = t.length; n--;) this.add(e, n, e[n] || 0, t[n], 0, 0, 0, 0, 0, 1);
	}
}, Cm("roundProps", Kf), Cm("modifiers"), Cm("snap", qf)) || bm;
Xp.version = Ip.version = wm.version = "3.15.1", Td = 1, od() && xp(), Sp.Power0, Sp.Power1, Sp.Power2, Sp.Power3, Sp.Power4, Sp.Linear, Sp.Quad, Sp.Cubic, Sp.Quart, Sp.Quint, Sp.Strong, Sp.Elastic, Sp.Back, Sp.SteppedEase, Sp.Bounce, Sp.Sine, Sp.Expo, Sp.Circ;
// node_modules/gsap/CSSPlugin.js
var Tm, Em, Dm, Om, km, Am, jm, Mm = function() {
	return typeof window < "u";
}, Nm = {}, Pm = 180 / Math.PI, Fm = Math.PI / 180, Im = Math.atan2, Lm = 1e8, Rm = /([A-Z])/g, zm = /(left|right|width|margin|padding|x)/i, Bm = /[\s,\(]\S/, Vm = {
	autoAlpha: "opacity,visibility",
	scale: "scaleX,scaleY",
	alpha: "opacity"
}, Hm = function(e, t) {
	return t.set(t.t, t.p, Math.round((t.s + t.c * e) * 1e4) / 1e4 + t.u, t);
}, Um = function(e, t) {
	return t.set(t.t, t.p, e === 1 ? t.e : Math.round((t.s + t.c * e) * 1e4) / 1e4 + t.u, t);
}, Wm = function(e, t) {
	return t.set(t.t, t.p, e ? Math.round((t.s + t.c * e) * 1e4) / 1e4 + t.u : t.b, t);
}, Gm = function(e, t) {
	return t.set(t.t, t.p, e === 1 ? t.e : e ? Math.round((t.s + t.c * e) * 1e4) / 1e4 + t.u : t.b, t);
}, Km = function(e, t) {
	var n = t.s + t.c * e;
	t.set(t.t, t.p, ~~(n + (n < 0 ? -.5 : .5)) + t.u, t);
}, qm = function(e, t) {
	return t.set(t.t, t.p, e ? t.e : t.b, t);
}, Jm = function(e, t) {
	return t.set(t.t, t.p, e === 1 ? t.e : t.b, t);
}, Ym = function(e, t, n) {
	return e.style[t] = n;
}, Xm = function(e, t, n) {
	return e.style.setProperty(t, n);
}, Zm = function(e, t, n) {
	return e._gsap[t] = n;
}, Qm = function(e, t, n) {
	return e._gsap.scaleX = e._gsap.scaleY = n;
}, $m = function(e, t, n, r, i) {
	var a = e._gsap;
	a.scaleX = a.scaleY = n, a.renderTransform(i, a);
}, eh = function(e, t, n, r, i) {
	var a = e._gsap;
	a[t] = n, a.renderTransform(i, a);
}, th = "transform", nh = th + "Origin", rh = function e(t, n) {
	var r = this, i = this.target, a = i.style, o = i._gsap;
	if (t in Nm && a) {
		if (this.tfm = this.tfm || {}, t !== "transform") t = Vm[t] || t, ~t.indexOf(",") ? t.split(",").forEach(function(e) {
			return r.tfm[e] = Sh(i, e);
		}) : this.tfm[t] = o.x ? o[t] : Sh(i, t), t === nh && (this.tfm.zOrigin = o.zOrigin);
		else return Vm.transform.split(",").forEach(function(t) {
			return e.call(r, t, n);
		});
		if (this.props.indexOf(th) >= 0) return;
		o.svg && (this.svgo = i.getAttribute("data-svg-origin"), this.props.push(nh, n, "")), t = th;
	}
	(a || n) && this.props.push(t, n, a[t]);
}, ih = function(e) {
	e.translate && (e.removeProperty("translate"), e.removeProperty("scale"), e.removeProperty("rotate"));
}, ah = function() {
	for (var e = this.props, t = this.target, n = t.style, r = t._gsap, i = 0, a; i < e.length; i += 3) e[i + 1] ? e[i + 1] === 2 ? t[e[i]](e[i + 2]) : t[e[i]] = e[i + 2] : e[i + 2] ? n[e[i]] = e[i + 2] : n.removeProperty(e[i].substr(0, 2) === "--" ? e[i] : e[i].replace(Rm, "-$1").toLowerCase());
	if (this.tfm) {
		for (a in this.tfm) r[a] = this.tfm[a];
		r.svg && (r.renderTransform(), t.setAttribute("data-svg-origin", this.svgo || "")), i = jm(), i && i.isStart || n[th] || (ih(n), r.zOrigin && n[nh] && (n[nh] += " " + r.zOrigin + "px", r.zOrigin = 0, r.renderTransform()), r.uncache = 1);
	}
}, oh = function(e, t) {
	var n = {
		target: e,
		props: [],
		revert: ah,
		save: rh
	};
	return e._gsap || wm.core.getCache(e), t && e.style && e.nodeType && t.split(",").forEach(function(e) {
		return n.save(e);
	}), n;
}, sh, ch = function(e, t) {
	var n = Em.createElementNS ? Em.createElementNS((t || "http://www.w3.org/1999/xhtml").replace(/^https/, "http"), e) : Em.createElement(e);
	return n && n.style ? n : Em.createElement(e);
}, lh = function e(t, n, r) {
	var i = getComputedStyle(t);
	return i[n] || i.getPropertyValue(n.replace(Rm, "-$1").toLowerCase()) || i.getPropertyValue(n) || !r && e(t, dh(n) || n, 1) || "";
}, uh = "O,Moz,ms,Ms,Webkit".split(","), dh = function(e, t, n) {
	var r = (t || km).style, i = 5;
	if (e in r && !n) return e;
	for (e = e.charAt(0).toUpperCase() + e.substr(1); i-- && !(uh[i] + e in r););
	return i < 0 ? null : (i === 3 ? "ms" : i >= 0 ? uh[i] : "") + e;
}, fh = function() {
	Mm() && window.document && (Tm = window, Em = Tm.document, Dm = Em.documentElement, km = ch("div") || { style: {} }, ch("div"), th = dh(th), nh = th + "Origin", km.style.cssText = "border-width:0;line-height:0;position:absolute;padding:0", sh = !!dh("perspective"), jm = wm.core.reverting, Om = 1);
}, ph = function(e) {
	var t = e.ownerSVGElement, n = ch("svg", t && t.getAttribute("xmlns") || "http://www.w3.org/2000/svg"), r = e.cloneNode(!0), i;
	r.style.display = "block", n.appendChild(r), Dm.appendChild(n);
	try {
		i = r.getBBox();
	} catch {}
	return n.removeChild(r), Dm.removeChild(n), i;
}, mh = function(e, t) {
	for (var n = t.length; n--;) if (e.hasAttribute(t[n])) return e.getAttribute(t[n]);
}, hh = function(e) {
	var t, n;
	try {
		t = e.getBBox();
	} catch {
		t = ph(e), n = 1;
	}
	return t && (t.width || t.height) || n || (t = ph(e)), t && !t.width && !t.x && !t.y ? {
		x: +mh(e, [
			"x",
			"cx",
			"x1"
		]) || 0,
		y: +mh(e, [
			"y",
			"cy",
			"y1"
		]) || 0,
		width: 0,
		height: 0
	} : t;
}, gh = function(e) {
	return !(!e.getCTM || e.parentNode && !e.ownerSVGElement || !hh(e));
}, _h = function(e, t) {
	if (t) {
		var n = e.style, r;
		t in Nm && t !== nh && (t = th), n.removeProperty ? (r = t.substr(0, 2), (r === "ms" || t.substr(0, 6) === "webkit") && (t = "-" + t), n.removeProperty(r === "--" ? t : t.replace(Rm, "-$1").toLowerCase())) : n.removeAttribute(t);
	}
}, vh = function(e, t, n, r, i, a) {
	var o = new um(e._pt, t, n, 0, 1, a ? Jm : qm);
	return e._pt = o, o.b = r, o.e = i, e._props.push(n), o;
}, yh = {
	deg: 1,
	rad: 1,
	turn: 1
}, bh = {
	grid: 1,
	flex: 1
}, xh = function e(t, n, r, i) {
	var a = parseFloat(r) || 0, o = (r + "").trim().substr((a + "").length) || "px", s = km.style, c = zm.test(n), l = t.tagName.toLowerCase() === "svg", u = (l ? "client" : "offset") + (c ? "Width" : "Height"), d = 100, f = i === "px", p = i === "%", m, h, g, _;
	if (i === o || !a || yh[i] || yh[o]) return a;
	if (o !== "px" && !f && (a = e(t, n, r, "px")), _ = t.getCTM && gh(t), (p || o === "%") && (Nm[n] || ~n.indexOf("adius"))) return m = _ ? t.getBBox()[c ? "width" : "height"] : t[u], qd(p ? a / m * d : a / 100 * m);
	if (s[c ? "width" : "height"] = d + (f ? o : i), h = i !== "rem" && ~n.indexOf("adius") || i === "em" && t.appendChild && !l ? t : t.parentNode, _ && (h = (t.ownerSVGElement || {}).parentNode), h && h !== Em && h.appendChild || (h = Em.body), g = h._gsap, g && p && g.width && c && g.time === bp.time && !g.uncache) return qd(a / g.width * d);
	if (p && (n === "height" || n === "width")) {
		var v = t.style[n];
		t.style[n] = d + i, m = t[u], v ? t.style[n] = v : _h(t, n);
	} else (p || o === "%") && !bh[lh(h, "display")] && (s.position = lh(t, "position")), h === t && (s.position = "static"), h.appendChild(km), m = km[u], h.removeChild(km), s.position = "absolute";
	return c && p && (g = Wd(h), g.time = bp.time, g.width = h[u]), qd(f ? m * a / d : m && a ? d / m * a : 0);
}, Sh = function(e, t, n, r) {
	var i;
	return Om || fh(), t in Vm && t !== "transform" && (t = Vm[t], ~t.indexOf(",") && (t = t.split(",")[0])), Nm[t] && t !== "transform" ? (i = Ph(e, r), i = t === "transformOrigin" ? i.svg ? i.origin : Fh(lh(e, nh)) + " " + i.zOrigin + "px" : i[t]) : (i = e.style[t], (!i || i === "auto" || r || ~(i + "").indexOf("calc(")) && (i = Dh[t] && Dh[t](e, t, n) || lh(e, t) || Gd(e, t) || +(t === "opacity"))), n && !~(i + "").trim().indexOf(" ") ? xh(e, t, i, n) + n : i;
}, Ch = function(e, t, n, r) {
	if (!n || n === "none") {
		var i = dh(t, e, 1), a = i && lh(e, i, 1);
		a && a !== n ? (t = i, n = a) : t === "borderColor" && (n = lh(e, "borderTopColor"));
	}
	var o = new um(this._pt, e.style, t, 0, 1, im), s = 0, c = 0, l, u, d, f, p, m, h, g, _, v, y, b;
	if (o.b = n, o.e = r, n += "", r += "", r.substring(0, 6) === "var(--" && (r = lh(e, r.substring(4, r.indexOf(")")))), r === "auto" && (m = e.style[t], e.style[t] = r, r = lh(e, t) || r, m ? e.style[t] = m : _h(e, t)), l = [n, r], vp(l), n = l[0], r = l[1], d = n.match(md) || [], b = r.match(md) || [], b.length) {
		for (; u = md.exec(r);) h = u[0], _ = r.substring(s, u.index), p ? p = (p + 1) % 5 : (_.substr(-5) === "rgba(" || _.substr(-5) === "hsla(") && (p = 1), h !== (m = d[c++] || "") && (f = parseFloat(m) || 0, y = m.substr((f + "").length), h.charAt(1) === "=" && (h = Yd(f, h) + y), g = parseFloat(h), v = h.substr((g + "").length), s = md.lastIndex - v.length, v || (v = v || Hu.units[t] || y, s === r.length && (r += v, o.e += v)), y !== v && (f = xh(e, t, m, v) || 0), o._pt = {
			_next: o._pt,
			p: _ || c === 1 ? _ : ",",
			s: f,
			c: g - f,
			m: p && p < 4 || t === "zIndex" ? Math.round : 0
		});
		o.c = s < r.length ? r.substring(s, r.length) : "";
	} else o.r = t === "display" && r === "none" ? Jm : qm;
	return gd.test(r) && (o.e = 0), this._pt = o, o;
}, wh = {
	top: "0%",
	bottom: "100%",
	left: "0%",
	right: "100%",
	center: "50%"
}, Th = function(e) {
	var t = e.split(" "), n = t[0], r = t[1] || "50%";
	return (n === "top" || n === "bottom" || r === "left" || r === "right") && (e = n, n = r, r = e), t[0] = wh[n] || n, t[1] = wh[r] || r, t.join(" ");
}, Eh = function(e, t) {
	if (t.tween && t.tween._time === t.tween._dur) {
		var n = t.t, r = n.style, i = t.u, a = n._gsap, o, s, c;
		if (i === "all" || i === !0) r.cssText = "", s = 1;
		else for (i = i.split(","), c = i.length; --c > -1;) o = i[c], Nm[o] && (s = 1, o = o === "transformOrigin" ? nh : th), _h(n, o);
		s && (_h(n, th), a && (a.svg && n.removeAttribute("transform"), r.scale = r.rotate = r.translate = "none", Ph(n, 1), a.uncache = 1, ih(r)));
	}
}, Dh = { clearProps: function(e, t, n, r, i) {
	if (i.data !== "isFromStart") {
		var a = e._pt = new um(e._pt, t, n, 0, 0, Eh);
		return a.u = r, a.pr = -10, a.tween = i, e._props.push(n), 1;
	}
} }, Oh = [
	1,
	0,
	0,
	1,
	0,
	0
], kh = {}, Ah = function(e) {
	return e === "matrix(1, 0, 0, 1, 0, 0)" || e === "none" || !e;
}, jh = function(e) {
	var t = lh(e, th);
	return Ah(t) ? Oh : t.substr(7).match(pd).map(qd);
}, Mh = function(e, t) {
	var n = e._gsap || Wd(e), r = e.style, i = jh(e), a, o, s, c;
	return n.svg && e.getAttribute("transform") ? (s = e.transform.baseVal.consolidate().matrix, i = [
		s.a,
		s.b,
		s.c,
		s.d,
		s.e,
		s.f
	], i.join(",") === "1,0,0,1,0,0" ? Oh : i) : (i === Oh && !e.offsetParent && e !== Dm && !n.svg && (s = r.display, r.display = "block", a = e.parentNode, a && (e.offsetParent || e.getBoundingClientRect().width) || (c = 1, o = e.nextElementSibling, Dm.appendChild(e)), i = jh(e), s ? r.display = s : _h(e, "display"), c && (o ? a.insertBefore(e, o) : a ? a.appendChild(e) : Dm.removeChild(e))), t && i.length > 6 ? [
		i[0],
		i[1],
		i[4],
		i[5],
		i[12],
		i[13]
	] : i);
}, Nh = function(e, t, n, r, i, a) {
	var o = e._gsap, s = i || Mh(e, !0), c = o.xOrigin || 0, l = o.yOrigin || 0, u = o.xOffset || 0, d = o.yOffset || 0, f = s[0], p = s[1], m = s[2], h = s[3], g = s[4], _ = s[5], v = t.split(" "), y = parseFloat(v[0]) || 0, b = parseFloat(v[1]) || 0, x, S, C, w;
	n ? s !== Oh && (S = f * h - p * m) && (C = h / S * y + b * (-m / S) + (m * _ - h * g) / S, w = y * (-p / S) + f / S * b - (f * _ - p * g) / S, y = C, b = w) : (x = hh(e), y = x.x + (~v[0].indexOf("%") ? y / 100 * x.width : y), b = x.y + (~(v[1] || v[0]).indexOf("%") ? b / 100 * x.height : b)), r || r !== !1 && o.smooth ? (g = y - c, _ = b - l, o.xOffset = u + (g * f + _ * m) - g, o.yOffset = d + (g * p + _ * h) - _) : o.xOffset = o.yOffset = 0, o.xOrigin = y, o.yOrigin = b, o.smooth = !!r, o.origin = t, o.originIsAbsolute = !!n, e.style[nh] = "0px 0px", a && (vh(a, o, "xOrigin", c, y), vh(a, o, "yOrigin", l, b), vh(a, o, "xOffset", u, o.xOffset), vh(a, o, "yOffset", d, o.yOffset)), e.setAttribute("data-svg-origin", y + " " + b);
}, Ph = function(e, t) {
	var n = e._gsap || new Pp(e);
	if ("x" in n && !t && !n.uncache) return n;
	var r = e.style, i = n.scaleX < 0, a = "px", o = "deg", s = getComputedStyle(e), c = lh(e, nh) || "0", l = u = d = m = h = g = _ = v = y = 0, u, d, f = p = 1, p, m, h, g, _, v, y, b, x, S, C, w, T, E, D, O, k, A, j, M, N, P, F, I, L, ee, te, R;
	return n.svg = !!(e.getCTM && gh(e)), s.translate && ((s.translate !== "none" || s.scale !== "none" || s.rotate !== "none") && (r[th] = (s.translate === "none" ? "" : "translate3d(" + (s.translate + " 0 0").split(" ").slice(0, 3).join(", ") + ") ") + (s.rotate === "none" ? "" : "rotate(" + s.rotate + ") ") + (s.scale === "none" ? "" : "scale(" + s.scale.split(" ").join(",") + ") ") + (s[th] === "none" ? "" : s[th])), r.scale = r.rotate = r.translate = "none"), S = Mh(e, n.svg), n.svg && (n.uncache ? (N = e.getBBox(), c = n.xOrigin - N.x + "px " + (n.yOrigin - N.y) + "px", M = "") : M = !t && e.getAttribute("data-svg-origin"), Nh(e, M || c, !!M || n.originIsAbsolute, n.smooth !== !1, S)), b = n.xOrigin || 0, x = n.yOrigin || 0, S !== Oh && (E = S[0], D = S[1], O = S[2], k = S[3], l = A = S[4], u = j = S[5], S.length === 6 ? (f = Math.sqrt(E * E + D * D), p = Math.sqrt(k * k + O * O), m = E || D ? Im(D, E) * Pm : 0, _ = O || k ? Im(O, k) * Pm + m : 0, _ && (p *= Math.abs(Math.cos(_ * Fm))), n.svg && (l -= b - (b * E + x * O), u -= x - (b * D + x * k))) : (R = S[6], ee = S[7], F = S[8], I = S[9], L = S[10], te = S[11], l = S[12], u = S[13], d = S[14], C = Im(R, L), h = C * Pm, C && (w = Math.cos(-C), T = Math.sin(-C), M = A * w + F * T, N = j * w + I * T, P = R * w + L * T, F = A * -T + F * w, I = j * -T + I * w, L = R * -T + L * w, te = ee * -T + te * w, A = M, j = N, R = P), C = Im(-O, L), g = C * Pm, C && (w = Math.cos(-C), T = Math.sin(-C), M = E * w - F * T, N = D * w - I * T, P = O * w - L * T, te = k * T + te * w, E = M, D = N, O = P), C = Im(D, E), m = C * Pm, C && (w = Math.cos(C), T = Math.sin(C), M = E * w + D * T, N = A * w + j * T, D = D * w - E * T, j = j * w - A * T, E = M, A = N), h && Math.abs(h) + Math.abs(m) > 359.9 && (h = m = 0, g = 180 - g), f = qd(Math.sqrt(E * E + D * D + O * O)), p = qd(Math.sqrt(j * j + R * R)), C = Im(A, j), _ = Math.abs(C) > 2e-4 ? C * Pm : 0, y = te ? 1 / (te < 0 ? -te : te) : 0), n.svg && (M = e.getAttribute("transform"), n.forceCSS = e.setAttribute("transform", "") || !Ah(lh(e, th)), M && e.setAttribute("transform", M))), Math.abs(_) > 90 && Math.abs(_) < 270 && (i ? (f *= -1, _ += m <= 0 ? 180 : -180, m += m <= 0 ? 180 : -180) : (p *= -1, _ += _ <= 0 ? 180 : -180)), t ||= n.uncache, n.x = l - ((n.xPercent = l && (!t && n.xPercent || (Math.round(e.offsetWidth / 2) === Math.round(-l) ? -50 : 0))) ? e.offsetWidth * n.xPercent / 100 : 0) + a, n.y = u - ((n.yPercent = u && (!t && n.yPercent || (Math.round(e.offsetHeight / 2) === Math.round(-u) ? -50 : 0))) ? e.offsetHeight * n.yPercent / 100 : 0) + a, n.z = d + a, n.scaleX = qd(f), n.scaleY = qd(p), n.rotation = qd(m) + o, n.rotationX = qd(h) + o, n.rotationY = qd(g) + o, n.skewX = _ + o, n.skewY = v + o, n.transformPerspective = y + a, (n.zOrigin = parseFloat(c.split(" ")[2]) || !t && n.zOrigin || 0) && (r[nh] = Fh(c)), n.xOffset = n.yOffset = 0, n.force3D = Hu.force3D, n.renderTransform = n.svg ? Hh : sh ? Vh : Lh, n.uncache = 0, n;
}, Fh = function(e) {
	return (e = e.split(" "))[0] + " " + e[1];
}, Ih = function(e, t, n) {
	var r = Lf(t);
	return qd(parseFloat(t) + parseFloat(xh(e, "x", n + "px", r))) + r;
}, Lh = function(e, t) {
	t.z = "0px", t.rotationY = t.rotationX = "0deg", t.force3D = 0, Vh(e, t);
}, Rh = "0deg", zh = "0px", Bh = ") ", Vh = function(e, t) {
	var n = t || this, r = n.xPercent, i = n.yPercent, a = n.x, o = n.y, s = n.z, c = n.rotation, l = n.rotationY, u = n.rotationX, d = n.skewX, f = n.skewY, p = n.scaleX, m = n.scaleY, h = n.transformPerspective, g = n.force3D, _ = n.target, v = n.zOrigin, y = "", b = g === "auto" && e && e !== 1 || g === !0;
	if (v && (u !== Rh || l !== Rh)) {
		var x = parseFloat(l) * Fm, S = Math.sin(x), C = Math.cos(x), w;
		x = parseFloat(u) * Fm, w = Math.cos(x), a = Ih(_, a, S * w * -v), o = Ih(_, o, -Math.sin(x) * -v), s = Ih(_, s, C * w * -v + v);
	}
	h !== zh && (y += "perspective(" + h + Bh), (r || i) && (y += "translate(" + r + "%, " + i + "%) "), (b || a !== zh || o !== zh || s !== zh) && (y += s !== zh || b ? "translate3d(" + a + ", " + o + ", " + s + ") " : "translate(" + a + ", " + o + Bh), c !== Rh && (y += "rotate(" + c + Bh), l !== Rh && (y += "rotateY(" + l + Bh), u !== Rh && (y += "rotateX(" + u + Bh), (d !== Rh || f !== Rh) && (y += "skew(" + d + ", " + f + Bh), (p !== 1 || m !== 1) && (y += "scale(" + p + ", " + m + Bh), _.style[th] = y || "translate(0, 0)";
}, Hh = function(e, t) {
	var n = t || this, r = n.xPercent, i = n.yPercent, a = n.x, o = n.y, s = n.rotation, c = n.skewX, l = n.skewY, u = n.scaleX, d = n.scaleY, f = n.target, p = n.xOrigin, m = n.yOrigin, h = n.xOffset, g = n.yOffset, _ = n.forceCSS, v = parseFloat(a), y = parseFloat(o), b, x, S, C, w;
	s = parseFloat(s), c = parseFloat(c), l = parseFloat(l), l && (l = parseFloat(l), c += l, s += l), s || c ? (s *= Fm, c *= Fm, b = Math.cos(s) * u, x = Math.sin(s) * u, S = Math.sin(s - c) * -d, C = Math.cos(s - c) * d, c && (l *= Fm, w = Math.tan(c - l), w = Math.sqrt(1 + w * w), S *= w, C *= w, l && (w = Math.tan(l), w = Math.sqrt(1 + w * w), b *= w, x *= w)), b = qd(b), x = qd(x), S = qd(S), C = qd(C)) : (b = u, C = d, x = S = 0), (v && !~(a + "").indexOf("px") || y && !~(o + "").indexOf("px")) && (v = xh(f, "x", a, "px"), y = xh(f, "y", o, "px")), (p || m || h || g) && (v = qd(v + p - (p * b + m * S) + h), y = qd(y + m - (p * x + m * C) + g)), (r || i) && (w = f.getBBox(), v = qd(v + r / 100 * w.width), y = qd(y + i / 100 * w.height)), w = "matrix(" + b + "," + x + "," + S + "," + C + "," + v + "," + y + ")", f.setAttribute("transform", w), _ && (f.style[th] = w);
}, Uh = function(e, t, n, r, i) {
	var a = 360, o = ed(i), s = parseFloat(i) * (o && ~i.indexOf("rad") ? Pm : 1) - r, c = r + s + "deg", l, u;
	return o && (l = i.split("_")[1], l === "short" && (s %= a, s !== s % (a / 2) && (s += s < 0 ? a : -a)), l === "cw" && s < 0 ? s = (s + a * Lm) % a - ~~(s / a) * a : l === "ccw" && s > 0 && (s = (s - a * Lm) % a - ~~(s / a) * a)), e._pt = u = new um(e._pt, t, n, r, s, Um), u.e = c, u.u = "deg", e._props.push(n), u;
}, Wh = function(e, t) {
	for (var n in t) e[n] = t[n];
	return e;
}, Gh = function(e, t, n) {
	var r = Wh({}, n._gsap), i = "perspective,force3D,transformOrigin,svgOrigin", a = n.style, o, s, c, l, u, d, f, p;
	for (s in r.svg ? (c = n.getAttribute("transform"), n.setAttribute("transform", ""), a[th] = t, o = Ph(n, 1), _h(n, th), n.setAttribute("transform", c)) : (c = getComputedStyle(n)[th], a[th] = t, o = Ph(n, 1), a[th] = c), Nm) c = r[s], l = o[s], c !== l && i.indexOf(s) < 0 && (f = Lf(c), p = Lf(l), u = f === p ? parseFloat(c) : xh(n, s, c, p), d = parseFloat(l), e._pt = new um(e._pt, o, s, u, d - u, Hm), e._pt.u = p || 0, e._props.push(s));
	Wh(o, r);
};
Kd("padding,margin,Width,Radius", function(e, t) {
	var n = "Top", r = "Right", i = "Bottom", a = "Left", o = (t < 3 ? [
		n,
		r,
		i,
		a
	] : [
		n + a,
		n + r,
		i + r,
		i + a
	]).map(function(n) {
		return t < 2 ? e + n : "border" + n + e;
	});
	Dh[t > 1 ? "border" + e : e] = function(e, t, n, r, i) {
		var a, s;
		if (arguments.length < 4) return a = o.map(function(t) {
			return Sh(e, t, n);
		}), s = a.join(" "), s.split(a[0]).length === 5 ? a[0] : s;
		a = (r + "").split(" "), s = {}, o.forEach(function(e, t) {
			return s[e] = a[t] = a[t] || a[(t - 1) / 2 | 0];
		}), e.init(t, s, i);
	};
});
var Kh = {
	name: "css",
	register: fh,
	targetTest: function(e) {
		return e.style && e.nodeType;
	},
	init: function(e, t, n, r, i) {
		var a = this._props, o = e.style, s = n.vars.startAt, c, l, u, d, f, p, m, h, g, _, v, y, b, x, S, C, w;
		for (m in Om || fh(), this.styles = this.styles || oh(e), C = this.styles.props, this.tween = n, t) if (m !== "autoRound" && (l = t[m], !(Rd[m] && Bp(m, t, n, r, e, i)))) {
			if (f = typeof l, p = Dh[m], f === "function" && (l = l.call(n, r, e, i), f = typeof l), f === "string" && ~l.indexOf("random(") && (l = tp(l)), p) p(this, e, m, l, n) && (S = 1);
			else if (m.substr(0, 2) === "--") c = (getComputedStyle(e).getPropertyValue(m) + "").trim(), l += "", gp.lastIndex = 0, gp.test(c) || (h = Lf(c), g = Lf(l), g ? h !== g && (c = xh(e, m, c, g) + g) : h && (l += h)), this.add(o, "setProperty", c, l, r, i, 0, 0, m), a.push(m), C.push(m, 0, o[m]);
			else if (f !== "undefined") {
				if (s && m in s ? (c = typeof s[m] == "function" ? s[m].call(n, r, e, i) : s[m], ed(c) && ~c.indexOf("random(") && (c = tp(c)), Lf(c + "") || c === "auto" || (c += Hu.units[m] || Lf(Sh(e, m)) || ""), (c + "").charAt(1) === "=" && (c = Sh(e, m))) : c = Sh(e, m), d = parseFloat(c), _ = f === "string" && l.charAt(1) === "=" && l.substr(0, 2), _ && (l = l.substr(2)), u = parseFloat(l), m in Vm && (m === "autoAlpha" && (d === 1 && Sh(e, "visibility") === "hidden" && u && (d = 0), C.push("visibility", 0, o.visibility), vh(this, o, "visibility", d ? "inherit" : "hidden", u ? "inherit" : "hidden", !u)), m !== "scale" && m !== "transform" && (m = Vm[m], ~m.indexOf(",") && (m = m.split(",")[0]))), v = m in Nm, v) {
					if (this.styles.save(m), w = l, f === "string" && l.substring(0, 6) === "var(--") {
						if (l = lh(e, l.substring(4, l.indexOf(")"))), l.substring(0, 5) === "calc(") {
							var T = e.style.perspective;
							e.style.perspective = l, l = lh(e, "perspective"), T ? e.style.perspective = T : _h(e, "perspective");
						}
						u = parseFloat(l);
					}
					if (y || (b = e._gsap, b.renderTransform && !t.parseTransform || Ph(e, t.parseTransform), x = t.smoothOrigin !== !1 && b.smooth, y = this._pt = new um(this._pt, o, th, 0, 1, b.renderTransform, b, 0, -1), y.dep = 1), m === "scale") this._pt = new um(this._pt, b, "scaleY", b.scaleY, (_ ? Yd(b.scaleY, _ + u) : u) - b.scaleY || 0, Hm), this._pt.u = 0, a.push("scaleY", m), m += "X";
					else if (m === "transformOrigin") {
						C.push(nh, 0, o[nh]), l = Th(l), b.svg ? Nh(e, l, 0, x, 0, this) : (g = parseFloat(l.split(" ")[2]) || 0, g !== b.zOrigin && vh(this, b, "zOrigin", b.zOrigin, g), vh(this, o, m, Fh(c), Fh(l)));
						continue;
					} else if (m === "svgOrigin") {
						Nh(e, l, 1, x, 0, this);
						continue;
					} else if (m in kh) {
						Uh(this, b, m, d, _ ? Yd(d, _ + l) : l);
						continue;
					} else if (m === "smoothOrigin") {
						vh(this, b, "smooth", b.smooth, l);
						continue;
					} else if (m === "force3D") {
						b[m] = l;
						continue;
					} else if (m === "transform") {
						Gh(this, l, e);
						continue;
					}
				} else m in o || (m = dh(m) || m);
				if (v || (u || u === 0) && (d || d === 0) && !Bm.test(l) && m in o) h = (c + "").substr((d + "").length), u ||= 0, g = Lf(l) || (m in Hu.units ? Hu.units[m] : h), h !== g && (d = xh(e, m, c, g)), this._pt = new um(this._pt, v ? b : o, m, d, (_ ? Yd(d, _ + u) : u) - d, !v && (g === "px" || m === "zIndex") && t.autoRound !== !1 ? Km : Hm), this._pt.u = g || 0, v && w !== l ? (this._pt.b = c, this._pt.e = w, this._pt.r = Gm) : h !== g && g !== "%" && (this._pt.b = c, this._pt.r = Wm);
				else if (m in o) Ch.call(this, e, m, c, _ ? _ + l : l);
				else if (m in e) this.add(e, m, c || e[m], _ ? _ + l : l, r, i);
				else if (m !== "parseTransform") {
					Dd(m, l);
					continue;
				}
				v || (m in o ? C.push(m, 0, o[m]) : typeof e[m] == "function" ? C.push(m, 2, e[m]()) : C.push(m, 1, c || e[m])), a.push(m);
			}
		}
		S && lm(this);
	},
	render: function(e, t) {
		if (t.tween._time || !jm()) for (var n = t._pt; n;) n.r(e, n.d), n = n._next;
		else t.styles.revert();
	},
	get: Sh,
	aliases: Vm,
	getSetter: function(e, t, n) {
		var r = Vm[t];
		return r && r.indexOf(",") < 0 && (t = r), t in Nm && t !== nh && (e._gsap.x || Sh(e, "x")) ? n && Am === n ? t === "scale" ? Qm : Zm : (Am = n || {}) && (t === "scale" ? $m : eh) : e.style && !rd(e.style[t]) ? Ym : ~t.indexOf("-") ? Xm : tm(e, t);
	},
	core: {
		_removeProperty: _h,
		_getMatrix: Mh
	}
};
wm.utils.checkPrefix = dh, wm.core.getStyleSaver = oh, (function(e, t, n, r) {
	var i = Kd(e + "," + t + "," + n, function(e) {
		Nm[e] = 1;
	});
	Kd(t, function(e) {
		Hu.units[e] = "deg", kh[e] = 1;
	}), Vm[i[13]] = e + "," + t, Kd(r, function(e) {
		var t = e.split(":");
		Vm[t[1]] = i[t[0]];
	});
})("x,y,z,scale,scaleX,scaleY,xPercent,yPercent", "rotation,rotationX,rotationY,skewX,skewY", "transform,transformOrigin,svgOrigin,force3D,smoothOrigin,transformPerspective", "0:translateX,1:translateY,2:translateZ,8:rotate,8:rotationZ,8:rotateZ,9:rotateX,10:rotateY"), Kd("x,y,z,top,right,bottom,left,width,height,fontSize,padding,margin,perspective", function(e) {
	Hu.units[e] = "px";
}), wm.registerPlugin(Kh);
// node_modules/gsap/index.js
var qh = wm.registerPlugin(Kh) || wm;
qh.core.Tween;
// node_modules/@gsap/react/src/index.js
var Jh = typeof document < "u" ? y.useLayoutEffect : y.useEffect, Yh = (e) => e && !Array.isArray(e) && typeof e == "object", Xh = [], Zh = {}, Qh = qh, $h = (e, t = Xh) => {
	let n = Zh;
	Yh(e) ? (n = e, e = null, t = "dependencies" in n ? n.dependencies : Xh) : Yh(t) && (n = t, t = "dependencies" in n ? n.dependencies : Xh), e && typeof e != "function" && console.warn("First parameter must be a function or config object");
	let { scope: r, revertOnUpdate: i } = n, a = (0, y.useRef)(!1), o = (0, y.useRef)(Qh.context(() => {}, r)), s = (0, y.useRef)((e) => o.current.add(null, e)), c = t && t.length && !i;
	return c && Jh(() => (a.current = !0, () => o.current.revert()), Xh), Jh(() => {
		if (e && o.current.add(e, r), !c || !a.current) return () => o.current.revert();
	}, t), {
		context: o.current,
		contextSafe: s.current
	};
};
$h.register = (e) => {
	Qh = e;
}, $h.headless = !0;
// node_modules/lucide-react/dist/esm/shared/src/utils/toKebabCase.mjs
var eg = (e) => e?.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
// node_modules/lucide-react/dist/esm/shared/src/utils/toLucideIconData.mjs
function tg(e, t, n = []) {
	if (t == null) throw Error("[lucide]: iconNode is required when icon name is used");
	return {
		name: eg(e),
		size: 24,
		node: t,
		...n.length > 0 ? { aliases: n } : {}
	};
}
// node_modules/lucide-react/dist/esm/shared/src/utils/toCamelCase.mjs
var ng = (e) => {
	let t = "", n = !1;
	for (let r of e) r === "-" || r === "_" || r <= " " ? n = t.length > 0 : (t.length === 0 ? t += r.toLowerCase() : t += n ? r.toUpperCase() : r, n = !1);
	return t;
}, rg = (e) => {
	let t = ng(e);
	return t.charAt(0).toUpperCase() + t.slice(1);
}, ig = (...e) => e.filter((e, t, n) => !!e && e.trim() !== "" && n.indexOf(e) === t).join(" ").trim(), ag = {
	xmlns: "http://www.w3.org/2000/svg",
	width: 24,
	height: 24,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": 2,
	"stroke-linecap": "round",
	"stroke-linejoin": "round"
};
// node_modules/lucide-react/dist/esm/shared/src/build/buildLucideIconNode.mjs
function og(e) {
	return e != null;
}
function sg(e, t = {}) {
	let n = t.attributeNames ?? {}, r = (e) => n[e] ?? e, i = e.size ?? e.width ?? ag.width, a = e.size ?? e.height ?? ag.height, o = e.aliases?.filter((e) => typeof e == "string" && e.trim() !== "").map((e) => `lucide-${e}`) ?? [], s = [...e.name ? [`lucide-${e.name}`] : [], ...o], c = t.className?.split(" ").filter(Boolean) ?? [], l = t.includeDefaultClasses === !1 ? ig(...c) : ig("lucide", ...s, ...c), u = t.absoluteStrokeWidth ? Number(t.strokeWidth ?? ag["stroke-width"]) * Number(e.size ?? e.width ?? ag.width) / Number(t.size ?? t.width ?? ag.width) : t.strokeWidth ?? ag["stroke-width"];
	return [
		"svg",
		{
			...Object.entries(ag).reduce((e, [t, n]) => (e[r(t)] = n, e), {}),
			..."color" in t && t.color && { [r("stroke")]: t.color },
			..."size" in t && og(t.size) && {
				[r("width")]: t.size,
				[r("height")]: t.size
			},
			..."width" in t && og(t.width) && { [r("width")]: t.width },
			..."height" in t && og(t.height) && { [r("height")]: t.height },
			[r("stroke-width")]: u,
			...l && { [r("class")]: l },
			[r("viewBox")]: `0 0 ${i} ${a}`,
			...t.hasA11yProp === !1 ? { [r("aria-hidden")]: "true" } : {},
			..."attributes" in t && t.attributes
		},
		e.node.map((e) => {
			let [n, i, a] = e, o = t.nonScalingStroke ? {
				[r("vector-effect")]: "non-scaling-stroke",
				...i
			} : i;
			return a ? [
				n,
				o,
				a
			] : [n, o];
		})
	];
}
// node_modules/lucide-react/dist/esm/shared/src/build/buildLucideIconForReact.mjs
function cg(e, t = {}) {
	return sg(e, {
		...t,
		attributeNames: {
			...t.attributeNames,
			class: "className",
			"stroke-width": "strokeWidth",
			"stroke-linecap": "strokeLinecap",
			"stroke-linejoin": "strokeLinejoin",
			"vector-effect": "vectorEffect"
		}
	});
}
// node_modules/lucide-react/dist/esm/shared/src/utils/hasA11yProp.mjs
var lg = (e) => {
	for (let t in e) if (t.startsWith("aria-") || t === "role" || t === "title") return !0;
	return !1;
}, ug = (0, y.createContext)({}), dg = () => (0, y.useContext)(ug), fg = (0, y.forwardRef)(({ color: e, size: t, width: n, height: r, strokeWidth: i, absoluteStrokeWidth: a, nonScalingStroke: o, className: s = "", children: c, iconNode: l = [], icon: u = {
	node: l,
	aliases: [],
	size: 24
}, ...d }, f) => {
	let { size: p = 24, strokeWidth: m = 2, absoluteStrokeWidth: h = !1, nonScalingStroke: g = !1, color: _ = "currentColor", className: v = "" } = dg() ?? {}, b = !!c || lg(d), [x, S, C = []] = cg(u, {
		color: e ?? _,
		width: n ?? t ?? p,
		height: r ?? t ?? p,
		strokeWidth: i ?? m,
		absoluteStrokeWidth: a ?? h,
		nonScalingStroke: o ?? g,
		className: ig(v, s),
		hasA11yProp: b,
		attributes: d
	});
	return (0, y.createElement)(x, {
		ref: f,
		...S
	}, [...C.map(([e, t]) => (0, y.createElement)(e, t)), ...Array.isArray(c) ? c : [c]]);
});
// node_modules/lucide-react/dist/esm/createLucideIcon.mjs
function pg(e, t = [], n = []) {
	let r = typeof e == "string" ? tg(e, t, n) : e, i = (0, y.forwardRef)(({ className: e, ...t }, n) => (0, y.createElement)(fg, {
		ref: n,
		icon: r,
		className: e,
		...t
	}));
	return r.name && (i.displayName = rg(r.name)), i;
}
// node_modules/lucide-react/dist/esm/icons/arrow-right.mjs
var mg = {
	name: "arrow-right",
	size: 24,
	node: [["path", {
		d: "M5 12h14",
		key: "1ays0h"
	}], ["path", {
		d: "m12 5 7 7-7 7",
		key: "xquz4c"
	}]]
};
mg.node;
var hg = pg(mg), gg = {
	name: "arrow-up-right",
	size: 24,
	node: [["path", {
		d: "M7 7h10v10",
		key: "1tivn9"
	}], ["path", {
		d: "M7 17 17 7",
		key: "1vkiza"
	}]]
};
gg.node;
var _g = pg(gg), vg = {
	name: "chart-no-axes-combined",
	size: 24,
	node: [
		["path", {
			d: "M12 16v5",
			key: "zza2cw"
		}],
		["path", {
			d: "M16 14.639V21",
			key: "1s85h0"
		}],
		["path", {
			d: "M20 10.656V21",
			key: "q45596"
		}],
		["path", {
			d: "m22 3-8.646 8.646a.5.5 0 0 1-.708 0L9.354 8.354a.5.5 0 0 0-.707 0L2 15",
			key: "1fw8x9"
		}],
		["path", {
			d: "M4 18.463V21",
			key: "1otddq"
		}],
		["path", {
			d: "M8 14.656V21",
			key: "1t2idw"
		}]
	]
};
vg.node;
var yg = pg(vg), bg = {
	name: "check",
	size: 24,
	node: [["path", {
		d: "M20 6 9 17l-5-5",
		key: "1gmf2c"
	}]]
};
bg.node;
var xg = pg(bg), Sg = {
	name: "chevron-down",
	size: 24,
	node: [["path", {
		d: "m6 9 6 6 6-6",
		key: "qrunsl"
	}]]
};
Sg.node;
var Cg = pg(Sg), wg = {
	name: "clipboard-check",
	size: 24,
	node: [
		["rect", {
			width: "8",
			height: "4",
			x: "8",
			y: "2",
			rx: "1",
			ry: "1",
			key: "tgr4d6"
		}],
		["path", {
			d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",
			key: "116196"
		}],
		["path", {
			d: "m9 14 2 2 4-4",
			key: "df797q"
		}]
	]
};
wg.node;
var Tg = pg(wg), Eg = {
	name: "eye-off",
	size: 24,
	node: [
		["path", {
			d: "M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",
			key: "ct8e1f"
		}],
		["path", {
			d: "M14.084 14.158a3 3 0 0 1-4.242-4.242",
			key: "151rxh"
		}],
		["path", {
			d: "M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",
			key: "13bj9a"
		}],
		["path", {
			d: "m2 2 20 20",
			key: "1ooewy"
		}]
	]
};
Eg.node;
var Dg = pg(Eg), Og = {
	name: "eye",
	size: 24,
	node: [["path", {
		d: "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",
		key: "1nclc0"
	}], ["circle", {
		cx: "12",
		cy: "12",
		r: "3",
		key: "1v7zrd"
	}]]
};
Og.node;
var kg = pg(Og), Ag = {
	name: "file-text",
	size: 24,
	node: [
		["path", {
			d: "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",
			key: "1oefj6"
		}],
		["path", {
			d: "M14 2v5a1 1 0 0 0 1 1h5",
			key: "wfsgrz"
		}],
		["path", {
			d: "M10 9H8",
			key: "b1mrlr"
		}],
		["path", {
			d: "M16 13H8",
			key: "t4e002"
		}],
		["path", {
			d: "M16 17H8",
			key: "z1uh3a"
		}]
	]
};
Ag.node;
var jg = pg(Ag), Mg = {
	name: "layers",
	size: 24,
	node: [
		["path", {
			d: "M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z",
			key: "zw3jo"
		}],
		["path", {
			d: "M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12",
			key: "1wduqc"
		}],
		["path", {
			d: "M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17",
			key: "kqbvx6"
		}]
	],
	aliases: ["layers-3"]
};
Mg.node;
var Ng = pg(Mg), Pg = {
	name: "menu",
	size: 24,
	node: [
		["path", {
			d: "M4 5h16",
			key: "1tepv9"
		}],
		["path", {
			d: "M4 12h16",
			key: "1lakjw"
		}],
		["path", {
			d: "M4 19h16",
			key: "1djgab"
		}]
	]
};
Pg.node;
var Fg = pg(Pg), Ig = {
	name: "package-check",
	size: 24,
	node: [
		["path", {
			d: "M12 22V12",
			key: "d0xqtd"
		}],
		["path", {
			d: "m16 17 2 2 4-4",
			key: "uh5qu3"
		}],
		["path", {
			d: "M21 11.127V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.729l7 4a2 2 0 0 0 2 .001l1.32-.753",
			key: "kpkbpo"
		}],
		["path", {
			d: "M3.29 7 12 12l8.71-5",
			key: "19ckod"
		}],
		["path", {
			d: "m7.5 4.27 8.997 5.148",
			key: "9yrvtv"
		}]
	]
};
Ig.node;
var Lg = pg(Ig), Rg = {
	name: "package",
	size: 24,
	node: [
		["path", {
			d: "M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z",
			key: "1a0edw"
		}],
		["path", {
			d: "M12 22V12",
			key: "d0xqtd"
		}],
		["polyline", {
			points: "3.29 7 12 12 20.71 7",
			key: "ousv84"
		}],
		["path", {
			d: "m7.5 4.27 9 5.15",
			key: "1c824w"
		}]
	]
};
Rg.node;
var zg = pg(Rg), Bg = {
	name: "plus",
	size: 24,
	node: [["path", {
		d: "M5 12h14",
		key: "1ays0h"
	}], ["path", {
		d: "M12 5v14",
		key: "s699le"
	}]]
};
Bg.node;
var Vg = pg(Bg), Hg = {
	name: "table-2",
	size: 24,
	node: [
		["path", {
			d: "M3 9h18",
			key: "1pudct"
		}],
		["path", {
			d: "M9 3v18",
			key: "fh3hqa"
		}],
		["rect", {
			x: "3",
			y: "3",
			width: "18",
			height: "18",
			rx: "2",
			key: "h1oib"
		}]
	]
};
Hg.node;
var Ug = pg(Hg), Wg = {
	name: "x",
	size: 24,
	node: [["path", {
		d: "M18 6 6 18",
		key: "1bl5f8"
	}], ["path", {
		d: "m6 6 12 12",
		key: "d8bk6v"
	}]]
};
Wg.node;
var Gg = pg(Wg), Kg = Object.freeze({
	publicHome: "/",
	publicAbout: "/quem-somos",
	publicPlatform: "/plataforma",
	publicFaq: "/duvidas",
	access: "/acesso",
	context: "/app/contexto",
	buyerHome: "/app/comprador/inicio",
	buyerSuppliers: "/app/comprador/fornecedores",
	buyerReviews: "/app/comprador/avaliacoes",
	supplierHome: "/app/fornecedor/inicio",
	adminHome: "/app/administracao/inicio"
}), qg = (e) => Object.freeze(e);
Object.freeze([
	qg({
		id: "public-home",
		path: "/",
		surface: "public",
		access: "public",
		title: "SIVI — Vendas industriais"
	}),
	qg({
		id: "public-about",
		path: Kg.publicAbout,
		surface: "public",
		access: "public",
		title: "Quem somos — SIVI"
	}),
	qg({
		id: "public-platform",
		path: Kg.publicPlatform,
		surface: "public",
		access: "public",
		title: "O que fazemos — SIVI"
	}),
	qg({
		id: "public-faq",
		path: Kg.publicFaq,
		surface: "public",
		access: "public",
		title: "Perguntas frequentes — SIVI"
	}),
	...[
		[
			"buyer",
			"comprador",
			"demands",
			"demandas",
			"Minhas demandas"
		],
		[
			"buyer",
			"comprador",
			"proposals",
			"propostas",
			"Propostas recebidas"
		],
		[
			"buyer",
			"comprador",
			"orders",
			"pedidos",
			"Meus pedidos"
		],
		[
			"supplier",
			"fornecedor",
			"demands",
			"oportunidades",
			"Oportunidades"
		],
		[
			"supplier",
			"fornecedor",
			"proposals",
			"propostas",
			"Minhas propostas"
		],
		[
			"supplier",
			"fornecedor",
			"orders",
			"pedidos",
			"Pedidos recebidos"
		]
	].map(([e, t, n, r, i]) => qg({
		id: `${e}-${n}`,
		path: `/app/${t}/${r}`,
		surface: "app",
		access: "authenticated",
		workspaceRole: e,
		section: n,
		title: i
	})),
	qg({
		id: "supplier-profile",
		path: "/app/fornecedor/perfil",
		surface: "app",
		access: "authenticated",
		workspaceRole: "supplier",
		section: "profile",
		title: "Perfil industrial"
	}),
	qg({
		id: "access",
		path: Kg.access,
		surface: "auth",
		access: "public",
		title: "Acesso"
	}),
	qg({
		id: "context",
		path: Kg.context,
		surface: "app",
		access: "authenticated",
		title: "Empresas e atuação"
	}),
	qg({
		id: "buyer-home",
		path: Kg.buyerHome,
		surface: "app",
		access: "authenticated",
		workspaceRole: "buyer",
		title: "Visão geral"
	}),
	qg({
		id: "buyer-suppliers",
		path: Kg.buyerSuppliers,
		surface: "app",
		access: "authenticated",
		workspaceRole: "buyer",
		title: "Fornecedores"
	}),
	qg({
		id: "buyer-reviews",
		path: Kg.buyerReviews,
		surface: "app",
		access: "authenticated",
		workspaceRole: "buyer",
		title: "Avaliações"
	}),
	qg({
		id: "supplier-home",
		path: Kg.supplierHome,
		surface: "app",
		access: "authenticated",
		workspaceRole: "supplier",
		title: "Visão do fornecedor"
	}),
	qg({
		id: "admin-home",
		path: Kg.adminHome,
		surface: "app",
		access: "authenticated",
		workspaceRole: "administration",
		title: "Visão administrativa"
	})
]);
// src/public/components.tsx
var Jg = {
	home: Kg.publicHome,
	about: Kg.publicAbout,
	platform: Kg.publicPlatform,
	faq: Kg.publicFaq
}, Yg = (e) => `#${Jg[e]}`, Xg = (e, t) => `${Yg(e)}?secao=${encodeURIComponent(t)}`, Zg = (e) => e === "funcionamento" || e === "compras" || e === "fornecimento", Qg = (e) => Xg(Zg(e) ? "platform" : "home", e), $g = (e) => `${Qg("funcionamento")}&etapa=${e}`, e_ = (e) => e === "sobre" ? Yg("about") : `#/?pagina=${encodeURIComponent(e)}`, t_ = (e) => `#/acesso?modo=register${e ? `&atuacao=${e}` : ""}`, n_ = [
	["about", "Quem somos"],
	["platform", "O que fazemos"],
	["faq", "FAQ"]
];
function r_({ back: e = !1, home: t = !1 }) {
	return /* @__PURE__ */ (0, Z.jsxs)("a", {
		className: "sv-brand",
		href: "#/",
		"aria-label": t ? "SIVI, voltar ao topo" : e ? "SIVI, voltar à página inicial" : "SIVI, início",
		onClick: t ? (e) => {
			if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || location.hash && location.hash !== Yg("home")) return;
			e.preventDefault();
			let t = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
			document.getElementById("public-title")?.focus({ preventScroll: !0 }), window.scrollTo({
				top: 0,
				behavior: t ? "instant" : "smooth"
			});
		} : void 0,
		children: [
			/* @__PURE__ */ (0, Z.jsx)("img", {
				src: "./src/assets/brand/raposa.svg",
				width: "36",
				height: "36",
				alt: ""
			}),
			/* @__PURE__ */ (0, Z.jsx)("span", { children: "SIVI" }),
			/* @__PURE__ */ (0, Z.jsxs)("small", { children: [
				"VENDAS",
				/* @__PURE__ */ (0, Z.jsx)("br", {}),
				"INDUSTRIAIS"
			] })
		]
	});
}
function i_() {
	return /* @__PURE__ */ (0, Z.jsx)(_g, {
		className: "t-learn-chevron",
		size: 19,
		"aria-hidden": "true"
	});
}
function a_() {
	return /* @__PURE__ */ (0, Z.jsxs)("svg", {
		className: "t-learn-chevron",
		width: "19",
		height: "19",
		viewBox: "0 0 16 16",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "1.6",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		"aria-hidden": "true",
		children: [/* @__PURE__ */ (0, Z.jsx)("path", {
			className: "t-learn-arm t-learn-arm-top",
			d: "M6 4L10 8"
		}), /* @__PURE__ */ (0, Z.jsx)("path", {
			className: "t-learn-arm t-learn-arm-bot",
			d: "M10 8L6 12"
		})]
	});
}
function o_({ children: e, href: t = t_(), secondary: n = !1, className: r = "" }) {
	return /* @__PURE__ */ (0, Z.jsxs)("a", {
		href: t,
		className: `sv-button t-learn ${n ? "sv-button--secondary" : ""} ${r}`,
		children: [e, /* @__PURE__ */ (0, Z.jsx)(a_, {})]
	});
}
function s_({ current: e, editorial: t = !1 }) {
	let [n, r] = (0, y.useState)(!1), i = (0, y.useRef)(null), a = e === "home", o = a || t, s = n_.map(([t, n]) => /* @__PURE__ */ (0, Z.jsx)("a", {
		href: Yg(t),
		"aria-current": t === e ? "page" : void 0,
		children: n
	}, t)), c = /* @__PURE__ */ (0, Z.jsxs)(Z.Fragment, { children: [!o && /* @__PURE__ */ (0, Z.jsxs)("a", {
		href: "#/acesso?modo=login",
		className: "sv-login-link",
		children: ["Entrar ", /* @__PURE__ */ (0, Z.jsx)(i_, {})]
	}), /* @__PURE__ */ (0, Z.jsxs)("a", {
		className: "sv-nav-cta",
		href: o ? "#/acesso?modo=login" : t_(),
		children: [
			o ? "Acessar sistema" : "Cadastrar empresa",
			" ",
			/* @__PURE__ */ (0, Z.jsx)(i_, {})
		]
	})] });
	return (0, y.useEffect)(() => {
		if (!n) return;
		let e = (e) => {
			e.key === "Escape" && (r(!1), i.current?.focus());
		};
		return window.addEventListener("keydown", e), () => window.removeEventListener("keydown", e);
	}, [n]), /* @__PURE__ */ (0, Z.jsxs)(Z.Fragment, { children: [/* @__PURE__ */ (0, Z.jsx)("a", {
		className: "sv-skip",
		href: "#conteudo",
		onClick: (e) => {
			let t = document.getElementById("conteudo");
			t && (e.preventDefault(), t.focus({ preventScroll: !0 }), t.scrollIntoView({
				block: "start",
				behavior: "instant"
			}));
		},
		children: "Ir para o conteúdo"
	}), /* @__PURE__ */ (0, Z.jsx)("header", {
		className: "sv-header",
		"data-menu-open": n || void 0,
		children: /* @__PURE__ */ (0, Z.jsxs)("div", {
			className: "sv-nav sv-shell",
			children: [
				/* @__PURE__ */ (0, Z.jsx)(r_, { home: a }),
				/* @__PURE__ */ (0, Z.jsx)("button", {
					className: "sv-menu",
					ref: i,
					"aria-label": n ? "Fechar menu" : "Abrir menu",
					"aria-expanded": n,
					"aria-controls": "sv-navigation",
					onClick: () => r(!n),
					children: n ? /* @__PURE__ */ (0, Z.jsx)(Gg, {}) : /* @__PURE__ */ (0, Z.jsx)(Fg, {})
				}),
				/* @__PURE__ */ (0, Z.jsx)("nav", {
					id: "sv-navigation",
					"aria-label": "Navegação principal",
					className: n ? "is-open" : "",
					onClick: () => r(!1),
					children: o ? /* @__PURE__ */ (0, Z.jsxs)(Z.Fragment, { children: [/* @__PURE__ */ (0, Z.jsx)("div", {
						className: "sv-home-nav-pages",
						children: s
					}), /* @__PURE__ */ (0, Z.jsx)("div", {
						className: "sv-home-nav-account",
						children: c
					})] }) : /* @__PURE__ */ (0, Z.jsxs)(Z.Fragment, { children: [s, c] })
				})
			]
		})
	})] });
}
var c_ = {
	name: "Sua conta",
	links: [["Entrar na minha conta", "#/acesso?modo=login"], ["Cadastrar empresa", t_()]]
}, l_ = [["Privacidade", e_("privacidade")], ["Condições de uso", e_("condicoes")]], u_ = e_("creditos"), d_ = "info@sivi.com", f_ = [{
	name: "Plataforma",
	links: [
		["Como funciona", Qg("funcionamento")],
		["Para compradores", Qg("compras")],
		["Para fornecedores", Qg("fornecimento")]
	]
}, {
	name: "Conheça o SIVI",
	links: [
		["Quem somos", Yg("about")],
		["Segurança e dados", e_("seguranca")],
		["Ajuda e acesso", e_("ajuda")],
		["Dúvidas sobre o cadastro", Yg("faq")]
	]
}];
function p_() {
	let [e, t] = (0, y.useState)(!1);
	function n(e) {
		e.preventDefault();
		let n = new FormData(e.currentTarget).get("email"), r = encodeURIComponent(`Olá! Gostaria de receber as novidades do SIVI neste e-mail: ${n}`);
		window.location.href = `mailto:${d_}?subject=Inscri%C3%A7%C3%A3o%20nas%20novidades%20do%20SIVI&body=${r}`, t(!0);
	}
	return /* @__PURE__ */ (0, Z.jsxs)("form", {
		className: "sv-footer-newsletter",
		"aria-labelledby": "sv-footer-newsletter-title",
		onSubmit: n,
		children: [
			/* @__PURE__ */ (0, Z.jsx)("h2", {
				id: "sv-footer-newsletter-title",
				children: "Receba novidades do SIVI"
			}),
			/* @__PURE__ */ (0, Z.jsxs)("div", {
				className: "sv-footer-newsletter-fields",
				children: [/* @__PURE__ */ (0, Z.jsx)("input", {
					type: "email",
					name: "email",
					"aria-label": "Seu e-mail",
					placeholder: "Seu e-mail",
					autoComplete: "email",
					required: !0,
					onChange: () => t(!1)
				}), /* @__PURE__ */ (0, Z.jsx)("button", {
					type: "submit",
					children: "Inscrever"
				})]
			}),
			/* @__PURE__ */ (0, Z.jsx)("p", {
				className: "sv-footer-newsletter-status",
				role: "status",
				children: e && "Envie a mensagem no seu aplicativo de e-mail para concluir o pedido."
			})
		]
	});
}
function m_({ home: e = !1, editorial: t = !1 }) {
	let n = `© ${(/* @__PURE__ */ new Date()).getFullYear()} SIVI`, r = e || t, i = r ? f_ : [...f_, {
		...c_,
		links: [...c_.links, ...l_]
	}];
	return /* @__PURE__ */ (0, Z.jsx)("footer", {
		className: r ? "sv-footer public-footer sv-footer--home" : "sv-footer public-footer",
		children: /* @__PURE__ */ (0, Z.jsxs)("div", {
			className: "sv-shell",
			children: [/* @__PURE__ */ (0, Z.jsxs)("div", {
				className: "sv-footer-top",
				children: [
					/* @__PURE__ */ (0, Z.jsxs)("div", {
						className: "sv-footer-brand",
						children: [/* @__PURE__ */ (0, Z.jsx)(r_, { home: e }), /* @__PURE__ */ (0, Z.jsx)("small", { children: "Sistema Integrado de Vendas Industriais" })]
					}),
					i.map((e) => /* @__PURE__ */ (0, Z.jsxs)("nav", {
						"aria-label": e.name,
						children: [/* @__PURE__ */ (0, Z.jsx)("h2", { children: e.name }), e.links.map(([e, t]) => /* @__PURE__ */ (0, Z.jsx)("a", {
							href: t,
							children: r ? /* @__PURE__ */ (0, Z.jsx)("span", { children: e }) : e
						}, e))]
					}, e.name)),
					r && /* @__PURE__ */ (0, Z.jsxs)("div", {
						className: "sv-footer-contact-column",
						children: [/* @__PURE__ */ (0, Z.jsxs)("section", {
							className: "sv-footer-contact",
							"aria-labelledby": "sv-footer-contact-title",
							children: [/* @__PURE__ */ (0, Z.jsx)("h2", {
								id: "sv-footer-contact-title",
								children: "Contato"
							}), /* @__PURE__ */ (0, Z.jsxs)("address", { children: [
								/* @__PURE__ */ (0, Z.jsxs)("p", { children: [
									"SENAI Manuel Garcia Filho",
									/* @__PURE__ */ (0, Z.jsx)("br", {}),
									"Rua Guatemala, 19",
									/* @__PURE__ */ (0, Z.jsx)("br", {}),
									"Jardim Canhema"
								] }),
								/* @__PURE__ */ (0, Z.jsx)("a", {
									href: `mailto:${d_}`,
									children: /* @__PURE__ */ (0, Z.jsx)("span", { children: d_ })
								}),
								/* @__PURE__ */ (0, Z.jsx)("p", { children: "(11) 0000-0000" })
							] })]
						}), /* @__PURE__ */ (0, Z.jsx)(p_, {})]
					})
				]
			}), r ? /* @__PURE__ */ (0, Z.jsxs)("div", {
				className: "sv-footer-bottom",
				children: [/* @__PURE__ */ (0, Z.jsxs)("div", {
					className: "sv-footer-legal",
					children: [/* @__PURE__ */ (0, Z.jsx)("span", { children: n }), /* @__PURE__ */ (0, Z.jsxs)("nav", {
						"aria-label": "Informações legais e créditos",
						children: [l_.map(([e, t]) => /* @__PURE__ */ (0, Z.jsx)("a", {
							href: t,
							children: /* @__PURE__ */ (0, Z.jsx)("span", { children: e })
						}, t)), /* @__PURE__ */ (0, Z.jsx)("a", {
							href: u_,
							children: /* @__PURE__ */ (0, Z.jsx)("span", { children: "Créditos de imagem e vídeo" })
						})]
					})]
				}), /* @__PURE__ */ (0, Z.jsx)("span", {
					className: "sv-footer-locale",
					children: "Português · Brasil"
				})]
			}) : /* @__PURE__ */ (0, Z.jsxs)("div", {
				className: "sv-footer-bottom",
				children: [
					/* @__PURE__ */ (0, Z.jsx)("span", { children: n }),
					/* @__PURE__ */ (0, Z.jsx)("a", {
						href: u_,
						children: "Créditos de imagem e vídeo"
					}),
					/* @__PURE__ */ (0, Z.jsx)("span", { children: "Português · Brasil" }),
					/* @__PURE__ */ (0, Z.jsx)("a", {
						href: Qg("topo"),
						children: "Voltar ao início ↑"
					})
				]
			})]
		})
	});
}
function h_({ focusTitle: e = !1 }) {
	return (0, y.useLayoutEffect)(() => {
		let t = new URLSearchParams(location.hash.split("?")[1]).get("secao"), n = t && t !== "topo" ? document.getElementById(t) : null;
		n ? (n.focus({ preventScroll: !0 }), n.scrollIntoView({
			block: "start",
			behavior: "instant"
		})) : ((t === "topo" || e) && document.getElementById("public-title")?.focus({ preventScroll: !0 }), window.scrollTo({
			top: 0,
			behavior: "instant"
		}));
	}, [e]), null;
}
// node_modules/gsap/Observer.js
function g_(e, t) {
	for (var n = 0; n < t.length; n++) {
		var r = t[n];
		r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r);
	}
}
function __(e, t, n) {
	return t && g_(e.prototype, t), n && g_(e, n), e;
}
var v_, y_, b_, x_, S_, C_, w_, T_, E_, D_, O_, k_, A_, j_ = function() {
	return v_ || typeof window < "u" && (v_ = window.gsap) && v_.registerPlugin && v_;
}, M_ = 1, N_ = [], P_ = [], F_ = [], I_ = Date.now, L_ = function(e, t) {
	return t;
}, R_ = function() {
	var e = E_.core, t = e.bridge || {}, n = e._scrollers, r = e._proxies;
	n.push.apply(n, P_), r.push.apply(r, F_), P_ = n, F_ = r, L_ = function(e, n) {
		return t[e](n);
	};
}, z_ = function(e, t) {
	return ~F_.indexOf(e) && F_[F_.indexOf(e) + 1][t];
}, B_ = function(e) {
	return !!~D_.indexOf(e);
}, V_ = function(e, t, n, r, i) {
	return e.addEventListener(t, n, {
		passive: r !== !1,
		capture: !!i
	});
}, H_ = function(e, t, n, r) {
	return e.removeEventListener(t, n, !!r);
}, U_ = "scrollLeft", W_ = "scrollTop", G_ = function() {
	return O_ && O_.isPressed || P_.cache++;
}, K_ = function(e, t) {
	var n = function n(r) {
		if (r || r === 0) {
			M_ && b_.history.scrollRestoration !== "manual" && (b_.history.scrollRestoration = "manual");
			var i = O_ && O_.isPressed;
			r = n.v = Math.round(r) || (O_ && O_.iOS ? 1 : 0), e(r), n.cacheID = P_.cache, i && L_("ss", r);
		} else (t || P_.cache !== n.cacheID || L_("ref")) && (n.cacheID = P_.cache, n.v = e());
		return n.v + n.offset;
	};
	return n.offset = 0, e && n;
}, q_ = {
	s: U_,
	p: "left",
	p2: "Left",
	os: "right",
	os2: "Right",
	d: "width",
	d2: "Width",
	a: "x",
	sc: K_(function(e) {
		return arguments.length ? b_.scrollTo(e, J_.sc()) : b_.pageXOffset || x_[U_] || S_[U_] || C_[U_] || 0;
	})
}, J_ = {
	s: W_,
	p: "top",
	p2: "Top",
	os: "bottom",
	os2: "Bottom",
	d: "height",
	d2: "Height",
	a: "y",
	op: q_,
	sc: K_(function(e) {
		return arguments.length ? b_.scrollTo(q_.sc(), e) : b_.pageYOffset || x_[W_] || S_[W_] || C_[W_] || 0;
	})
}, Y_ = function(e, t) {
	return (t && t._ctx && t._ctx.selector || v_.utils.toArray)(e)[0] || (typeof e == "string" && v_.config().nullTargetWarn !== !1 ? console.warn("Element not found:", e) : null);
}, X_ = function(e, t) {
	for (var n = t.length; n--;) if (t[n] === e || t[n].contains(e)) return !0;
	return !1;
}, Z_ = function(e, t) {
	var n = t.s, r = t.sc;
	B_(e) && (e = x_.scrollingElement || S_);
	var i = P_.indexOf(e), a = r === J_.sc ? 1 : 2;
	!~i && (i = P_.push(e) - 1), P_[i + a] || V_(e, "scroll", G_);
	var o = P_[i + a], s = o || (P_[i + a] = K_(z_(e, n), !0) || (B_(e) ? r : K_(function(t) {
		return arguments.length ? e[n] = t : e[n];
	})));
	return s.target = e, o || (s.smooth = v_.getProperty(e, "scrollBehavior") === "smooth"), s;
}, Q_ = function(e, t, n) {
	var r = e, i = e, a = I_(), o = a, s = t || 50, c = Math.max(500, s * 3), l = function(e, t) {
		var c = I_();
		t || c - a > s ? (i = r, r = e, o = a, a = c) : n ? r += e : r = i + (e - i) / (c - o) * (a - o);
	};
	return {
		update: l,
		reset: function() {
			i = r = n ? 0 : r, o = a = 0;
		},
		getVelocity: function(e) {
			var t = o, s = i, u = I_();
			return (e || e === 0) && e !== r && l(e), a === o || u - o > c ? 0 : (r + (n ? s : -s)) / ((n ? u : a) - t) * 1e3;
		}
	};
}, $_ = function(e, t) {
	return t && !e._gsapAllow && e.cancelable !== !1 && e.preventDefault(), e.changedTouches ? e.changedTouches[0] : e;
}, ev = function(e) {
	var t = Math.max.apply(Math, e), n = Math.min.apply(Math, e);
	return Math.abs(t) >= Math.abs(n) ? t : n;
}, tv = function() {
	E_ = v_.core.globals().ScrollTrigger, E_ && E_.core && R_();
}, nv = function(e) {
	return v_ = e || j_(), !y_ && v_ && typeof document < "u" && document.body && (b_ = window, x_ = document, S_ = x_.documentElement, C_ = x_.body, D_ = [
		b_,
		x_,
		S_,
		C_
	], v_.utils.clamp, A_ = v_.core.context || function() {}, T_ = "onpointerenter" in C_ ? "pointer" : "mouse", w_ = rv.isTouch = b_.matchMedia && b_.matchMedia("(hover: none), (pointer: coarse)").matches ? 1 : "ontouchstart" in b_ || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0 ? 2 : 0, k_ = rv.eventTypes = ("ontouchstart" in S_ ? "touchstart,touchmove,touchcancel,touchend" : "onpointerdown" in S_ ? "pointerdown,pointermove,pointercancel,pointerup" : "mousedown,mousemove,mouseup,mouseup").split(","), setTimeout(function() {
		return M_ = 0;
	}, 500), y_ = 1), E_ || tv(), y_;
};
q_.op = J_, P_.cache = 0;
var rv = /*#__PURE__*/ function() {
	function e(e) {
		this.init(e);
	}
	var t = e.prototype;
	return t.init = function(e) {
		y_ || nv(v_) || console.warn("Please gsap.registerPlugin(Observer)"), E_ || tv();
		var t = e.tolerance, n = e.dragMinimum, r = e.type, i = e.target, a = e.lineHeight, o = e.debounce, s = e.preventDefault, c = e.onStop, l = e.onStopDelay, u = e.ignore, d = e.wheelSpeed, f = e.event, p = e.onDragStart, m = e.onDragEnd, h = e.onDrag, g = e.onPress, _ = e.onRelease, v = e.onRight, y = e.onLeft, b = e.onUp, x = e.onDown, S = e.onChangeX, C = e.onChangeY, w = e.onChange, T = e.onToggleX, E = e.onToggleY, D = e.onHover, O = e.onHoverEnd, k = e.onMove, A = e.ignoreCheck, j = e.isNormalizer, M = e.onGestureStart, N = e.onGestureEnd, P = e.onWheel, F = e.onEnable, I = e.onDisable, L = e.onClick, ee = e.scrollSpeed, te = e.capture, R = e.allowClicks, ne = e.lockAxis, re = e.onLockAxis;
		this.target = i = Y_(i) || S_, this.vars = e, u &&= v_.utils.toArray(u), t ||= 1e-9, n ||= 0, d ||= 1, ee ||= 1, r ||= "wheel,touch,pointer", o = o !== !1, a ||= parseFloat(b_.getComputedStyle(C_).lineHeight) || 22;
		var z, ie, ae, oe, B, se, ce, V = this, H = 0, U = 0, le = e.passive || !s && e.passive !== !1, ue = Z_(i, q_), de = Z_(i, J_), fe = ue(), pe = de(), W = ~r.indexOf("touch") && !~r.indexOf("pointer") && k_[0] === "pointerdown", me = B_(i), G = i.ownerDocument || x_, K = [
			0,
			0,
			0
		], q = [
			0,
			0,
			0
		], he = 0, ge = function() {
			return he = I_();
		}, _e = function(e, t) {
			return (V.event = e) && u && X_(e.target, u) || t && W && e.pointerType !== "touch" || A && A(e, t);
		}, ve = function() {
			V._vx.reset(), V._vy.reset(), ie.pause(), c && c(V);
		}, ye = function() {
			var e = V.deltaX = ev(K), n = V.deltaY = ev(q), r = Math.abs(e) >= t, i = Math.abs(n) >= t;
			w && (r || i) && w(V, e, n, K, q), r && (v && V.deltaX > 0 && v(V), y && V.deltaX < 0 && y(V), S && S(V), T && V.deltaX < 0 != H < 0 && T(V), H = V.deltaX, K[0] = K[1] = K[2] = 0), i && (x && V.deltaY > 0 && x(V), b && V.deltaY < 0 && b(V), C && C(V), E && V.deltaY < 0 != U < 0 && E(V), U = V.deltaY, q[0] = q[1] = q[2] = 0), (oe || ae) && (k && k(V), ae &&= (p && ae === 1 && p(V), h && h(V), 0), oe = !1), se && !(se = !1) && re && re(V), B &&= (P(V), !1), z = 0;
		}, be = function(e, t, n) {
			K[n] += e, q[n] += t, V._vx.update(e), V._vy.update(t), o ? z ||= requestAnimationFrame(ye) : ye();
		}, xe = function(e, t) {
			ne && !ce && (V.axis = ce = Math.abs(e) > Math.abs(t) ? "x" : "y", se = !0), ce !== "y" && (K[2] += e, V._vx.update(e, !0)), ce !== "x" && (q[2] += t, V._vy.update(t, !0)), o ? z ||= requestAnimationFrame(ye) : ye();
		}, Se = function(e) {
			if (!_e(e, 1)) {
				e = $_(e, s);
				var t = e.clientX, r = e.clientY, i = t - V.x, a = r - V.y, o = V.isDragging;
				V.x = t, V.y = r, (o || (i || a) && (Math.abs(V.startX - t) >= n || Math.abs(V.startY - r) >= n)) && (ae ||= o ? 2 : 1, o || (V.isDragging = !0), xe(i, a));
			}
		}, Ce = V.onPress = function(e) {
			_e(e, 1) || e && e.button || (V.axis = ce = null, ie.pause(), V.isPressed = !0, e = $_(e), H = U = 0, V.startX = V.x = e.clientX, V.startY = V.y = e.clientY, V._vx.reset(), V._vy.reset(), V_(j ? i : G, k_[1], Se, le, !0), V.deltaX = V.deltaY = 0, g && g(V));
		}, we = V.onRelease = function(e) {
			if (!_e(e, 1)) {
				H_(j ? i : G, k_[1], Se, !0);
				var t = !isNaN(V.y - V.startY), n = V.isDragging, r = n && (Math.abs(V.x - V.startX) > 3 || Math.abs(V.y - V.startY) > 3), a = $_(e);
				!r && t && (V._vx.reset(), V._vy.reset(), s && R && v_.delayedCall(.08, function() {
					if (I_() - he > 300 && !e.defaultPrevented) {
						if (e.target.click) e.target.click();
						else if (G.createEvent) {
							var t = G.createEvent("MouseEvents");
							t.initMouseEvent("click", !0, !0, b_, 1, a.screenX, a.screenY, a.clientX, a.clientY, !1, !1, !1, !1, 0, null), e.target.dispatchEvent(t);
						}
					}
				})), V.isDragging = V.isGesturing = V.isPressed = !1, c && n && !j && ie.restart(!0), ae && ye(), m && n && m(V), _ && _(V, r);
			}
		}, Te = function(e) {
			return e.touches && e.touches.length > 1 && (V.isGesturing = !0) && M(e, V.isDragging);
		}, Ee = function() {
			return (V.isGesturing = !1) || N(V);
		}, De = function(e) {
			if (!_e(e)) {
				var t = ue(), n = de();
				be((t - fe) * ee, (n - pe) * ee, 1), fe = t, pe = n, c && ie.restart(!0);
			}
		}, Oe = function(e) {
			if (!_e(e)) {
				e = $_(e, s), P && (B = !0);
				var t = (e.deltaMode === 1 ? a : e.deltaMode === 2 ? b_.innerHeight : 1) * d;
				be(e.deltaX * t, e.deltaY * t, 0), c && !j && ie.restart(!0);
			}
		}, ke = function(e) {
			if (!_e(e)) {
				var t = e.clientX, n = e.clientY, r = t - V.x, i = n - V.y;
				V.x = t, V.y = n, oe = !0, c && ie.restart(!0), (r || i) && xe(r, i);
			}
		}, Ae = function(e) {
			V.event = e, D(V);
		}, je = function(e) {
			V.event = e, O(V);
		}, Me = function(e) {
			return _e(e) || $_(e, s) && L(V);
		};
		ie = V._dc = v_.delayedCall(l || .25, ve).pause(), V.deltaX = V.deltaY = 0, V._vx = Q_(0, 50, !0), V._vy = Q_(0, 50, !0), V.scrollX = ue, V.scrollY = de, V.isDragging = V.isGesturing = V.isPressed = !1, A_(this), V.enable = function(e) {
			return V.isEnabled || (V_(me ? G : i, "scroll", G_), r.indexOf("scroll") >= 0 && V_(me ? G : i, "scroll", De, le, te), r.indexOf("wheel") >= 0 && V_(i, "wheel", Oe, le, te), (r.indexOf("touch") >= 0 && w_ || r.indexOf("pointer") >= 0) && (V_(i, k_[0], Ce, le, te), V_(G, k_[2], we), V_(G, k_[3], we), R && V_(i, "click", ge, !0, !0), L && V_(i, "click", Me), M && V_(G, "gesturestart", Te), N && V_(G, "gestureend", Ee), D && V_(i, T_ + "enter", Ae), O && V_(i, T_ + "leave", je), k && V_(i, T_ + "move", ke)), V.isEnabled = !0, V.isDragging = V.isGesturing = V.isPressed = oe = ae = !1, V._vx.reset(), V._vy.reset(), fe = ue(), pe = de(), e && e.type && Ce(e), F && F(V)), V;
		}, V.disable = function() {
			V.isEnabled && (N_.filter(function(e) {
				return e !== V && B_(e.target);
			}).length || H_(me ? G : i, "scroll", G_), V.isPressed && (V._vx.reset(), V._vy.reset(), H_(j ? i : G, k_[1], Se, !0)), H_(me ? G : i, "scroll", De, te), H_(i, "wheel", Oe, te), H_(i, k_[0], Ce, te), H_(G, k_[2], we), H_(G, k_[3], we), H_(i, "click", ge, !0), H_(i, "click", Me), H_(G, "gesturestart", Te), H_(G, "gestureend", Ee), H_(i, T_ + "enter", Ae), H_(i, T_ + "leave", je), H_(i, T_ + "move", ke), V.isEnabled = V.isPressed = V.isDragging = !1, I && I(V));
		}, V.kill = V.revert = function() {
			V.disable();
			var e = N_.indexOf(V);
			e >= 0 && N_.splice(e, 1), O_ === V && (O_ = 0);
		}, N_.push(V), j && B_(i) && (O_ = V), V.enable(f);
	}, __(e, [{
		key: "velocityX",
		get: function() {
			return this._vx.getVelocity();
		}
	}, {
		key: "velocityY",
		get: function() {
			return this._vy.getVelocity();
		}
	}]), e;
}();
rv.version = "3.15.1", rv.create = function(e) {
	return new rv(e);
}, rv.register = nv, rv.getAll = function() {
	return N_.slice();
}, rv.getById = function(e) {
	return N_.filter(function(t) {
		return t.vars.id === e;
	})[0];
}, j_() && v_.registerPlugin(rv);
// node_modules/gsap/ScrollTrigger.js
var $, iv, av, ov, sv, cv, lv, uv, dv, fv, pv, mv, hv, gv, _v, vv, yv, bv, xv, Sv, Cv, wv, Tv, Ev, Dv, Ov, kv, Av, jv, Mv, Nv, Pv, Fv, Iv, Lv = 1, Rv = Date.now, zv = Rv(), Bv = 0, Vv = 0, Hv = function(e, t, n) {
	var r = iy(e) && (e.substr(0, 6) === "clamp(" || e.indexOf("max") > -1);
	return n["_" + t + "Clamp"] = r, r ? e.substr(6, e.length - 7) : e;
}, Uv = function(e, t) {
	return t && (!iy(e) || e.substr(0, 6) !== "clamp(") ? "clamp(" + e + ")" : e;
}, Wv = function e() {
	return Vv && requestAnimationFrame(e);
}, Gv = function() {
	return gv = 1;
}, Kv = function() {
	return gv = 0;
}, qv = function(e) {
	return e;
}, Jv = function(e) {
	return Math.round(e * 1e5) / 1e5 || 0;
}, Yv = function() {
	return typeof window < "u";
}, Xv = function() {
	return $ || Yv() && ($ = window.gsap) && $.registerPlugin && $;
}, Zv = function(e) {
	return !!~lv.indexOf(e);
}, Qv = function(e) {
	return (e === "Height" ? Nv : av["inner" + e]) || sv["client" + e] || cv["client" + e];
}, $v = function(e) {
	return z_(e, "getBoundingClientRect") || (Zv(e) ? function() {
		return Eb.width = av.innerWidth, Eb.height = Nv, Eb;
	} : function() {
		return ky(e);
	});
}, ey = function(e, t, n) {
	var r = n.d, i = n.d2, a = n.a;
	return (a = z_(e, "getBoundingClientRect")) ? function() {
		return a()[r];
	} : function() {
		return (t ? Qv(i) : e["client" + i]) || 0;
	};
}, ty = function(e, t) {
	return !t || ~F_.indexOf(e) ? $v(e) : function() {
		return Eb;
	};
}, ny = function(e, t) {
	var n = t.s, r = t.d2, i = t.d, a = t.a;
	return Math.max(0, (n = "scroll" + r) && (a = z_(e, n)) ? a() - $v(e)()[i] : Zv(e) ? (sv[n] || cv[n]) - Qv(r) : e[n] - e["offset" + r]);
}, ry = function(e, t) {
	for (var n = 0; n < xv.length; n += 3) (!t || ~t.indexOf(xv[n + 1])) && e(xv[n], xv[n + 1], xv[n + 2]);
}, iy = function(e) {
	return typeof e == "string";
}, ay = function(e) {
	return typeof e == "function";
}, oy = function(e) {
	return typeof e == "number";
}, sy = function(e) {
	return typeof e == "object";
}, cy = function(e, t, n) {
	return e && e.progress(+!t) && n && e.pause();
}, ly = function(e, t, n) {
	if (e.enabled) {
		var r = e._ctx ? e._ctx.add(function() {
			return t(e, n);
		}) : t(e, n);
		r && r.totalTime && (e.callbackAnimation = r);
	}
}, uy = Math.abs, dy = "left", fy = "top", py = "right", my = "bottom", hy = "width", gy = "height", _y = "Right", vy = "Left", yy = "Top", by = "Bottom", xy = "padding", Sy = "margin", Cy = "Width", wy = "Height", Ty = "px", Ey = function(e) {
	return av.getComputedStyle(e.nodeType === Node.DOCUMENT_NODE ? e.scrollingElement : e);
}, Dy = function(e) {
	var t = Ey(e).position;
	e.style.position = t === "absolute" || t === "fixed" ? t : "relative";
}, Oy = function(e, t) {
	for (var n in t) n in e || (e[n] = t[n]);
	return e;
}, ky = function(e, t) {
	var n = t && Ey(e)[_v] !== "matrix(1, 0, 0, 1, 0, 0)" && $.to(e, {
		x: 0,
		y: 0,
		xPercent: 0,
		yPercent: 0,
		rotation: 0,
		rotationX: 0,
		rotationY: 0,
		scale: 1,
		skewX: 0,
		skewY: 0
	}).progress(1), r = e.getBoundingClientRect ? e.getBoundingClientRect() : e.scrollingElement.getBoundingClientRect();
	return n && n.progress(0).kill(), r;
}, Ay = function(e, t) {
	var n = t.d2;
	return e["offset" + n] || e["client" + n] || 0;
}, jy = function(e) {
	var t = [], n = e.labels, r = e.duration(), i;
	for (i in n) t.push(n[i] / r);
	return t;
}, My = function(e) {
	return function(t) {
		return $.utils.snap(jy(e), t);
	};
}, Ny = function(e) {
	var t = $.utils.snap(e), n = Array.isArray(e) && e.slice(0).sort(function(e, t) {
		return e - t;
	});
	return n ? function(e, r, i) {
		i === void 0 && (i = .001);
		var a;
		if (!r) return t(e);
		if (r > 0) {
			for (e -= i, a = 0; a < n.length; a++) if (n[a] >= e) return n[a];
			return n[a - 1];
		}
		for (a = n.length, e += i; a--;) if (n[a] <= e) return n[a];
		return n[0];
	} : function(n, r, i) {
		i === void 0 && (i = .001);
		var a = t(n);
		return !r || Math.abs(a - n) < i || a - n < 0 == r < 0 ? a : t(r < 0 ? n - e : n + e);
	};
}, Py = function(e) {
	return function(t, n) {
		return Ny(jy(e))(t, n.direction);
	};
}, Fy = function(e, t, n, r) {
	return n.split(",").forEach(function(n) {
		return e(t, n, r);
	});
}, Iy = function(e, t, n, r, i) {
	return e.addEventListener(t, n, {
		passive: !r,
		capture: !!i
	});
}, Ly = function(e, t, n, r) {
	return e.removeEventListener(t, n, !!r);
}, Ry = function(e, t, n) {
	n &&= n.wheelHandler, n && (e(t, "wheel", n), e(t, "touchmove", n));
}, zy = {
	startColor: "green",
	endColor: "red",
	indent: 0,
	fontSize: "16px",
	fontWeight: "normal"
}, By = {
	toggleActions: "play",
	anticipatePin: 0
}, Vy = {
	top: 0,
	left: 0,
	center: .5,
	bottom: 1,
	right: 1
}, Hy = function(e, t) {
	if (iy(e)) {
		var n = e.indexOf("="), r = ~n ? +(e.charAt(n - 1) + 1) * parseFloat(e.substr(n + 1)) : 0;
		~n && (e.indexOf("%") > n && (r *= t / 100), e = e.substr(0, n - 1)), e = r + (e in Vy ? Vy[e] * t : ~e.indexOf("%") ? parseFloat(e) * t / 100 : parseFloat(e) || 0);
	}
	return e;
}, Uy = function(e, t, n, r, i, a, o, s) {
	var c = i.startColor, l = i.endColor, u = i.fontSize, d = i.indent, f = i.fontWeight, p = ov.createElement("div"), m = Zv(n) || z_(n, "pinType") === "fixed", h = e.indexOf("scroller") !== -1, g = m ? cv : n.tagName === "IFRAME" ? n.contentDocument.body : n, _ = e.indexOf("start") !== -1, v = _ ? c : l, y = "border-color:" + v + ";font-size:" + u + ";color:" + v + ";font-weight:" + f + ";pointer-events:none;white-space:nowrap;font-family:sans-serif,Arial;z-index:1000;padding:4px 8px;border-width:0;border-style:solid;";
	return y += "position:" + ((h || s) && m ? "fixed;" : "absolute;"), (h || s || !m) && (y += (r === J_ ? py : my) + ":" + (a + parseFloat(d)) + "px;"), o && (y += "box-sizing:border-box;text-align:left;width:" + o.offsetWidth + "px;"), p._isStart = _, p.setAttribute("class", "gsap-marker-" + e + (t ? " marker-" + t : "")), p.style.cssText = y, p.innerText = t || t === 0 ? e + "-" + t : e, g.children[0] ? g.insertBefore(p, g.children[0]) : g.appendChild(p), p._offset = p["offset" + r.op.d2], Wy(p, 0, r, _), p;
}, Wy = function(e, t, n, r) {
	var i = { display: "block" }, a = n[r ? "os2" : "p2"], o = n[r ? "p2" : "os2"];
	e._isFlipped = r, i[n.a + "Percent"] = r ? -100 : 0, i[n.a] = r ? "1px" : 0, i["border" + a + Cy] = 1, i["border" + o + Cy] = 0, i[n.p] = t + "px", $.set(e, i);
}, Gy = [], Ky = {}, qy, Jy = function() {
	return Rv() - Bv > 34 && (qy ||= requestAnimationFrame(_b));
}, Yy = function() {
	(!Tv || !Tv.isPressed || Tv.startX > cv.clientWidth) && (P_.cache++, Tv ? qy ||= requestAnimationFrame(_b) : _b(), Bv || tb("scrollStart"), Bv = Rv());
}, Xy = function() {
	Ov = av.innerWidth, Dv = av.innerHeight;
}, Zy = function(e) {
	P_.cache++, (e === !0 || !hv && !wv && !ov.fullscreenElement && !ov.webkitFullscreenElement && (!Ev || Ov !== av.innerWidth || Math.abs(av.innerHeight - Dv) > av.innerHeight * .25)) && uv.restart(!0);
}, Qy = {}, $y = [], eb = function e() {
	return Ly(Nb, "scrollEnd", e) || pb(!0);
}, tb = function(e) {
	return Qy[e] && Qy[e].map(function(e) {
		return e();
	}) || $y;
}, nb = [], rb = function(e) {
	for (var t = 0; t < nb.length; t += 5) (!e || nb[t + 4] && nb[t + 4].query === e) && (nb[t].style.cssText = nb[t + 1], nb[t].getBBox && nb[t].setAttribute("transform", nb[t + 2] || ""), nb[t + 3].uncache = 1);
}, ib = function() {
	P_.cache++, P_.forEach(function(e) {
		return ay(e) && (e.rec = e());
	});
}, ab = function(e, t) {
	var n;
	for (vv = 0; vv < Gy.length; vv++) n = Gy[vv], n && (!t || n._ctx === t) && (e ? n.kill(1) : n.revert(!0, !0));
	Pv = !0, t && rb(t), t || tb("revert");
}, ob = function(e, t) {
	P_.cache++, (t || !sb) && P_.forEach(function(e) {
		return ay(e) && e.cacheID++ && (e.rec = 0);
	}), iy(e) && (jv = e, av.history.scrollRestoration !== e && (av.history.scrollRestoration = e));
}, sb, cb = 0, lb, ub = function() {
	if (lb !== cb) {
		var e = lb = cb;
		requestAnimationFrame(function() {
			return e === cb && pb(!0);
		});
	}
}, db = function() {
	cv.appendChild(Mv), Nv = !Tv && Mv.offsetHeight || av.innerHeight, cv.removeChild(Mv);
}, fb = function(e) {
	return dv(".gsap-marker-start, .gsap-marker-end, .gsap-marker-scroller-start, .gsap-marker-scroller-end").forEach(function(t) {
		return t.style.display = e ? "none" : "block";
	});
}, pb = function(e, t) {
	if (sv = ov.documentElement, cv = ov.body, lv = [
		av,
		ov,
		sv,
		cv
	], Bv && !e && !Pv) Iy(Nb, "scrollEnd", eb);
	else {
		db(), sb = Nb.isRefreshing = !0, Pv || ib();
		var n = tb("refreshInit");
		Sv && Nb.sort(), t || ab(), P_.forEach(function(e) {
			ay(e) && (e.smooth && (e.target.style.scrollBehavior = "auto"), e(0));
		}), Gy.slice(0).forEach(function(e) {
			return e.refresh();
		}), Pv = !1, Gy.forEach(function(e) {
			if (e._subPinOffset && e.pin) {
				var t = e.vars.horizontal ? "offsetWidth" : "offsetHeight", n = e.pin[t];
				e.revert(!0, 1), e.adjustPinSpacing(e.pin[t] - n), e.refresh();
			}
		}), Fv = 1, fb(!0), Gy.forEach(function(e) {
			var t = ny(e.scroller, e._dir), n = e.vars.end === "max" || e._endClamp && e.end > t, r = e._startClamp && e.start >= t;
			(n || r) && e.setPositions(r ? t - 1 : e.start, n ? Math.max(r ? t : e.start + 1, t) : e.end, !0);
		}), fb(!1), Fv = 0, n.forEach(function(e) {
			return e && e.render && e.render(-1);
		}), P_.forEach(function(e) {
			ay(e) && (e.smooth && requestAnimationFrame(function() {
				return e.target.style.scrollBehavior = "smooth";
			}), e.rec && e(e.rec));
		}), ob(jv, 1), uv.pause(), cb++, sb = 2, _b(2), Gy.forEach(function(e) {
			return ay(e.vars.onRefresh) && e.vars.onRefresh(e);
		}), sb = Nb.isRefreshing = !1, tb("refresh");
	}
}, mb = 0, hb = 1, gb, _b = function(e) {
	if (e === 2 || !sb && !Pv) {
		Nb.isUpdating = !0, gb && gb.update(0);
		var t = Gy.length, n = Rv(), r = n - zv >= 50, i = t && Gy[0].scroll();
		if (hb = mb > i ? -1 : 1, sb || (mb = i), r && (Bv && !gv && n - Bv > 200 && (Bv = 0, tb("scrollEnd")), pv = zv, zv = n), hb < 0) {
			for (vv = t; vv-- > 0;) Gy[vv] && Gy[vv].update(0, r);
			hb = 1;
		} else for (vv = 0; vv < t; vv++) Gy[vv] && Gy[vv].update(0, r);
		Nb.isUpdating = !1;
	}
	qy = 0;
}, vb = [
	dy,
	fy,
	my,
	py,
	Sy + by,
	Sy + _y,
	Sy + yy,
	Sy + vy,
	"display",
	"flexShrink",
	"float",
	"zIndex",
	"gridColumnStart",
	"gridColumnEnd",
	"gridRowStart",
	"gridRowEnd",
	"gridArea",
	"justifySelf",
	"alignSelf",
	"placeSelf",
	"order"
], yb = vb.concat([
	hy,
	gy,
	"boxSizing",
	"max" + Cy,
	"max" + wy,
	"position",
	Sy,
	xy,
	xy + yy,
	xy + _y,
	xy + by,
	xy + vy
]), bb = function(e, t, n) {
	Cb(n);
	var r = e._gsap;
	if (r.spacerIsNative) Cb(r.spacerState);
	else if (e._gsap.swappedIn) {
		var i = t.parentNode;
		i && (i.insertBefore(e, t), i.removeChild(t));
	}
	e._gsap.swappedIn = !1;
}, xb = function(e, t, n, r) {
	if (!e._gsap.swappedIn) {
		for (var i = vb.length, a = t.style, o = e.style, s; i--;) s = vb[i], a[s] = n[s];
		a.position = n.position === "absolute" ? "absolute" : "relative", n.display === "inline" && (a.display = "inline-block"), o[my] = o[py] = "auto", a.flexBasis = n.flexBasis || "auto", a.overflow = "visible", a.boxSizing = "border-box", a[hy] = Ay(e, q_) + Ty, a[gy] = Ay(e, J_) + Ty, a[xy] = o[Sy] = o[fy] = o[dy] = "0", Cb(r), o[hy] = o["max" + Cy] = n[hy], o[gy] = o["max" + wy] = n[gy], o[xy] = n[xy], e.parentNode !== t && (e.parentNode.insertBefore(t, e), t.appendChild(e)), e._gsap.swappedIn = !0;
	}
}, Sb = /([A-Z])/g, Cb = function(e) {
	if (e) {
		var t = e.t.style, n = e.length, r = 0, i, a;
		for ((e.t._gsap || $.core.getCache(e.t)).uncache = 1; r < n; r += 2) a = e[r + 1], i = e[r], a ? t[i] = a : t[i] && t.removeProperty(i.replace(Sb, "-$1").toLowerCase());
	}
}, wb = function(e) {
	for (var t = yb.length, n = e.style, r = [], i = 0; i < t; i++) r.push(yb[i], n[yb[i]]);
	return r.t = e, r;
}, Tb = function(e, t, n) {
	for (var r = [], i = e.length, a = n ? 8 : 0, o; a < i; a += 2) o = e[a], r.push(o, o in t ? t[o] : e[a + 1]);
	return r.t = e.t, r;
}, Eb = {
	left: 0,
	top: 0
}, Db = function(e, t, n, r, i, a, o, s, c, l, u, d, f, p) {
	ay(e) && (e = e(s)), iy(e) && e.substr(0, 3) === "max" && (e = d + (e.charAt(4) === "=" ? Hy("0" + e.substr(3), n) : 0));
	var m = f ? f.time() : 0, h, g, _;
	if (f && f.seek(0), isNaN(e) || (e = +e), oy(e)) f && (e = $.utils.mapRange(f.scrollTrigger.start, f.scrollTrigger.end, 0, d, e)), o && Wy(o, n, r, !0);
	else {
		ay(t) && (t = t(s));
		var v = (e || "0").split(" "), y, b, x, S;
		_ = Y_(t, s) || cv, y = ky(_) || {}, y && (y.left || y.top) || Ey(_).display !== "none" || (S = _.style.display, _.style.display = "block", y = ky(_), S ? _.style.display = S : _.style.removeProperty("display")), b = Hy(v[0], y[r.d]), x = Hy(v[1] || "0", n), e = y[r.p] - c[r.p] - l + b + i - x, o && Wy(o, x, r, n - x < 20 || o._isStart && x > 20), n -= n - x;
	}
	if (p && (s[p] = e || -.001, e < 0 && (e = 0)), a) {
		var C = e + n, w = a._isStart;
		h = "scroll" + r.d2, Wy(a, C, r, w && C > 20 || !w && (u ? Math.max(cv[h], sv[h]) : a.parentNode[h]) <= C + 1), u && (c = ky(o), u && (a.style[r.op.p] = c[r.op.p] - r.op.m - a._offset + Ty));
	}
	return f && _ && (h = ky(_), f.seek(d), g = ky(_), f._caScrollDist = h[r.p] - g[r.p], e = e / f._caScrollDist * d), f && f.seek(m), f ? e : Math.round(e);
}, Ob = /(webkit|moz|length|cssText|inset)/i, kb = function(e, t, n, r) {
	if (e.parentNode !== t) {
		var i = e.style, a, o;
		if (t === cv) {
			for (a in e._stOrig = i.cssText, o = Ey(e), o) !+a && !Ob.test(a) && o[a] && typeof i[a] == "string" && a !== "0" && (i[a] = o[a]);
			i.top = n, i.left = r;
		} else i.cssText = e._stOrig;
		$.core.getCache(e).uncache = 1, t.appendChild(e);
	}
}, Ab = function(e, t, n) {
	var r = t, i = r;
	return function(t) {
		var a = Math.round(e());
		return a !== r && a !== i && Math.abs(a - r) > 3 && Math.abs(a - i) > 3 && (t = a, n && n()), i = r, r = Math.round(t), r;
	};
}, jb = function(e, t, n) {
	var r = {};
	r[t.p] = "+=" + n, $.set(e, r);
}, Mb = function(e, t) {
	var n = Z_(e, t), r = "_scroll" + t.p2, i = function t(i, a, o, s, c) {
		var l = t.tween, u = a.onComplete, d = {};
		o ||= n();
		var f = Ab(n, o, function() {
			l.kill(), t.tween = 0;
		});
		return c = s && c || 0, s ||= i - o, l && l.kill(), a[r] = i, a.inherit = !1, a.modifiers = d, d[r] = function() {
			return f(o + s * l.ratio + c * l.ratio * l.ratio);
		}, a.onUpdate = function() {
			P_.cache++, t.tween && _b();
		}, a.onComplete = function() {
			t.tween = 0, u && u.call(l);
		}, l = t.tween = $.to(e, a), l;
	};
	return e[r] = n, n.wheelHandler = function() {
		return i.tween && i.tween.kill() && (i.tween = 0);
	}, Iy(e, "wheel", n.wheelHandler), Nb.isTouch && Iy(e, "touchmove", n.wheelHandler), i;
}, Nb = /*#__PURE__*/ function() {
	function e(t, n) {
		iv || e.register($) || console.warn("Please gsap.registerPlugin(ScrollTrigger)"), Av(this), this.init(t, n);
	}
	var t = e.prototype;
	return t.init = function(t, n) {
		if (this.progress = this.start = 0, this.vars && this.kill(!0, !0), !Vv) this.update = this.refresh = this.kill = qv;
		else {
			t = Oy(iy(t) || oy(t) || t.nodeType ? { trigger: t } : t, By);
			var r = t, i = r.onUpdate, a = r.toggleClass, o = r.id, s = r.onToggle, c = r.onRefresh, l = r.scrub, u = r.trigger, d = r.pin, f = r.pinSpacing, p = r.invalidateOnRefresh, m = r.anticipatePin, h = r.onScrubComplete, g = r.onSnapComplete, _ = r.once, v = r.snap, y = r.pinReparent, b = r.pinSpacer, x = r.containerAnimation, S = r.fastScrollEnd, C = r.preventOverlaps, w = t.horizontal || t.containerAnimation && t.horizontal !== !1 ? q_ : J_, T = !l && l !== 0, E = Y_(t.scroller || av), D = $.core.getCache(E), O = Zv(E), k = ("pinType" in t ? t.pinType : z_(E, "pinType") || O && "fixed") === "fixed", A = [
				t.onEnter,
				t.onLeave,
				t.onEnterBack,
				t.onLeaveBack
			], j = T && t.toggleActions.split(" "), M = "markers" in t ? t.markers : By.markers, N = O ? 0 : parseFloat(Ey(E)["border" + w.p2 + Cy]) || 0, P = this, F = t.onRefreshInit && function() {
				return t.onRefreshInit(P);
			}, I = ey(E, O, w), L = ty(E, O), ee = 0, te = 0, R = 0, ne = Z_(E, w), re, z, ie, ae, oe, B, se, ce, V, H, U, le, ue, de, fe, pe, W, me, G, K, q, he, ge, _e, ve, ye, be, xe, Se, Ce, we, Te, Ee, De, Oe, ke, Ae, je, Me;
			if (P._startClamp = P._endClamp = !1, P._dir = w, m *= 45, P.scroller = E, P.scroll = x ? x.time.bind(x) : ne, ae = ne(), Pv && ne.rec == null && (ne.rec = ae), P.vars = t, n ||= t.animation, "refreshPriority" in t && (Sv = 1, t.refreshPriority === -9999 && (gb = P)), D.tweenScroll = D.tweenScroll || {
				top: Mb(E, J_),
				left: Mb(E, q_)
			}, P.tweenTo = re = D.tweenScroll[w.p], P.scrubDuration = function(e) {
				Ee = oy(e) && e, Ee ? Te ? Te.duration(e) : Te = $.to(n, {
					ease: "expo",
					totalProgress: "+=0",
					inherit: !1,
					duration: Ee,
					paused: !0,
					onComplete: function() {
						return h && h(P);
					}
				}) : (Te && Te.progress(1).kill(), Te = 0);
			}, n && (n.vars.lazy = !1, n._initted && !P.isReverted || n.vars.immediateRender !== !1 && t.immediateRender !== !1 && n.duration() && n.render(0, !0, !0), P.animation = n.pause(), n.scrollTrigger = P, P.scrubDuration(l), Ce = 0, o ||= n.vars.id), v && ((!sy(v) || v.push) && (v = { snapTo: v }), "scrollBehavior" in cv.style && $.set(O ? [cv, sv] : E, { scrollBehavior: "auto" }), P_.forEach(function(e) {
				return ay(e) && e.target === (O ? ov.scrollingElement || sv : E) && (e.smooth = !1);
			}), ie = ay(v.snapTo) ? v.snapTo : v.snapTo === "labels" ? My(n) : v.snapTo === "labelsDirectional" ? Py(n) : v.directional === !1 ? $.utils.snap(v.snapTo) : function(e, t) {
				return Ny(v.snapTo)(e, Rv() - te < 500 ? 0 : t.direction);
			}, De = v.duration || {
				min: .1,
				max: 2
			}, De = sy(De) ? fv(De.min, De.max) : fv(De, De), Oe = $.delayedCall(v.delay || Ee / 2 || .1, function() {
				var e = ne(), t = Rv() - te < 500, r = re.tween;
				if ((t || Math.abs(P.getVelocity()) < 10) && !r && !gv && ee !== e) {
					var i = (e - B) / de, a = n && !T ? n.totalProgress() : i, o = t ? 0 : (a - we) / (Rv() - pv) * 1e3 || 0, s = $.utils.clamp(-i, 1 - i, uy(o / 2) * o / .185), c = i + (v.inertia === !1 ? 0 : s), l, u, d = v, f = d.onStart, p = d.onInterrupt, m = d.onComplete;
					if (l = ie(c, P), oy(l) || (l = c), u = Math.max(0, Math.round(B + l * de)), e <= se && e >= B && u !== e) {
						if (r && !r._initted && r.data <= uy(u - e)) return;
						v.inertia === !1 && (s = l - i), re(u, {
							duration: De(uy(Math.max(uy(c - a), uy(l - a)) * .185 / o / .05 || 0)),
							ease: v.ease || "power3",
							data: uy(u - e),
							onInterrupt: function() {
								return Oe.restart(!0) && p && ly(P, p);
							},
							onComplete: function() {
								P.update(), ee = ne(), n && !T && (Te ? Te.resetTo("totalProgress", l, n._tTime / n._tDur) : n.progress(l)), Ce = we = n && !T ? n.totalProgress() : P.progress, g && g(P), m && ly(P, m);
							}
						}, e, s * de, u - e - s * de), f && ly(P, f, re.tween);
					}
				} else P.isActive && ee !== e && Oe.restart(!0);
			}).pause()), o && (Ky[o] = P), u = P.trigger = Y_(u || d !== !0 && d), Me = u && u._gsap && u._gsap.stRevert, Me &&= Me(P), d = d === !0 ? u : Y_(d), iy(a) && (a = {
				targets: u,
				className: a
			}), d && (f === !1 || f === Sy || (f = !f && d.parentNode && d.parentNode.style && Ey(d.parentNode).display === "flex" ? !1 : xy), P.pin = d, z = $.core.getCache(d), z.spacer ? fe = z.pinState : (b && (b = Y_(b), b && !b.nodeType && (b = b.current || b.nativeElement), z.spacerIsNative = !!b, b && (z.spacerState = wb(b))), z.spacer = me = b || ov.createElement("div"), me.classList.add("pin-spacer"), o && me.classList.add("pin-spacer-" + o), z.pinState = fe = wb(d)), t.force3D !== !1 && $.set(d, { force3D: !0 }), P.spacer = me = z.spacer, Se = Ey(d), _e = Se[f + w.os2], K = $.getProperty(d), q = $.quickSetter(d, w.a, Ty), xb(d, me, Se), W = wb(d)), M) {
				le = sy(M) ? Oy(M, zy) : zy, H = Uy("scroller-start", o, E, w, le, 0), U = Uy("scroller-end", o, E, w, le, 0, H), G = H["offset" + w.op.d2];
				var Ne = Y_(z_(E, "content") || E);
				ce = this.markerStart = Uy("start", o, Ne, w, le, G, 0, x), V = this.markerEnd = Uy("end", o, Ne, w, le, G, 0, x), x && (je = $.quickSetter([ce, V], w.a, Ty)), !k && !(F_.length && z_(E, "fixedMarkers") === !0) && (Dy(O ? cv : E), $.set([H, U], { force3D: !0 }), ye = $.quickSetter(H, w.a, Ty), xe = $.quickSetter(U, w.a, Ty));
			}
			if (x) {
				var Pe = x.vars.onUpdate, Fe = x.vars.onUpdateParams;
				x.eventCallback("onUpdate", function() {
					P.update(0, 0, 1), Pe && Pe.apply(x, Fe || []);
				});
			}
			if (P.previous = function() {
				return Gy[Gy.indexOf(P) - 1];
			}, P.next = function() {
				return Gy[Gy.indexOf(P) + 1];
			}, P.revert = function(e, t) {
				if (!t) return P.kill(!0);
				var r = e !== !1 || !P.enabled, i = hv;
				r !== P.isReverted && (r && (ke = Math.max(ne(), P.scroll.rec || 0), R = P.progress, Ae = n && n.progress()), ce && [
					ce,
					V,
					H,
					U
				].forEach(function(e) {
					return e.style.display = r ? "none" : "block";
				}), r && (hv = P, P.update(r)), !d || y && P.isActive || (r ? bb(d, me, fe) : xb(d, me, Ey(d), ve)), r || P.update(r), hv = i, P.isReverted = r);
			}, P.refresh = function(r, i, a, o) {
				if (!hv && P.enabled || i) {
					if (d && r && Bv) Iy(e, "scrollEnd", eb);
					else {
						!sb && F && F(P), hv = P, re.tween && !a && (re.tween.kill(), re.tween = 0), Te && Te.pause(), p && n && (n.revert({ kill: !1 }).invalidate(), n.getChildren ? n.getChildren(!0, !0, !1).forEach(function(e) {
							return e.vars.immediateRender && e.render(0, !0, !0);
						}) : n.vars.immediateRender && n.render(0, !0, !0)), P.isReverted || P.revert(!0, !0), P._subPinOffset = !1;
						var s = I(), l = L(), m = x ? x.duration() : ny(E, w), h = de <= .01 || !de, g = 0, _ = o || 0, v = sy(a) ? a.end : t.end, b = t.endTrigger || u, S = sy(a) ? a.start : t.start || (t.start === 0 || !u ? 0 : d ? "0 0" : "0 100%"), C = P.pinnedContainer = t.pinnedContainer && Y_(t.pinnedContainer, P), D = u && Math.max(0, Gy.indexOf(P)) || 0, A = D, j, z, ie, le, G, q, _e, ye, xe, Se, Ce, we, Ee;
						for (M && sy(a) && (we = $.getProperty(H, w.p), Ee = $.getProperty(U, w.p)); A-- > 0;) q = Gy[A], q.end || q.refresh(0, 1) || (hv = P), _e = q.pin, _e && (_e === u || _e === d || _e === C) && !q.isReverted && (Se ||= [], Se.unshift(q), q.revert(!0, !0)), q !== Gy[A] && (D--, A--);
						for (ay(S) && (S = S(P)), S = Hv(S, "start", P), B = Db(S, u, s, w, ne(), ce, H, P, l, N, k, m, x, P._startClamp && "_startClamp") || (d ? -.001 : 0), ay(v) && (v = v(P)), iy(v) && !v.indexOf("+=") && (~v.indexOf(" ") ? v = (iy(S) ? S.split(" ")[0] : "") + v : (g = Hy(v.substr(2), s), v = iy(S) ? S : (x ? $.utils.mapRange(0, x.duration(), x.scrollTrigger.start, x.scrollTrigger.end, B) : B) + g, b = u)), v = Hv(v, "end", P), se = Math.max(B, Db(v || (b ? "100% 0" : m), b, s, w, ne() + g, V, U, P, l, N, k, m, x, P._endClamp && "_endClamp")) || -.001, g = 0, A = D; A--;) q = Gy[A] || {}, _e = q.pin, _e && q.start - q._pinPush <= B && !x && q.end > 0 && (j = q.end - (P._startClamp ? Math.max(0, q.start) : q.start), (_e === u && q.start - q._pinPush < B || _e === C) && isNaN(S) && (g += j * (1 - q.progress)), _e === d && (_ += j));
						if (B += g, se += g, P._startClamp && (P._startClamp += g), P._endClamp && !sb && (P._endClamp = se || -.001, se = Math.min(se, ny(E, w))), de = se - B || (B -= .01) && .001, h && (R = $.utils.clamp(0, 1, $.utils.normalize(B, se, ke))), P._pinPush = _, ce && g && (j = {}, j[w.a] = "+=" + g, C && (j[w.p] = "-=" + ne()), $.set([ce, V], j)), d && !(Fv && P.end >= ny(E, w))) j = Ey(d), le = w === J_, ie = ne(), he = parseFloat(K(w.a)) + _, !m && se > 1 && (Ce = (O ? ov.scrollingElement || sv : E).style, Ce = {
							style: Ce,
							value: Ce["overflow" + w.a.toUpperCase()]
						}, O && Ey(cv)["overflow" + w.a.toUpperCase()] !== "scroll" && (Ce.style["overflow" + w.a.toUpperCase()] = "scroll")), xb(d, me, j), W = wb(d), z = ky(d, !0), ye = k && Z_(E, le ? q_ : J_)(), f ? (ve = [f + w.os2, de + _ + Ty], ve.t = me, A = f === xy ? Ay(d, w) + de + _ : 0, A && (ve.push(w.d, A + Ty), me.style.flexBasis !== "auto" && (me.style.flexBasis = A + Ty)), Cb(ve), C && Gy.forEach(function(e) {
							e.pin === C && e.vars.pinSpacing !== !1 && (e._subPinOffset = !0);
						}), k && ne(ke)) : (A = Ay(d, w), A && me.style.flexBasis !== "auto" && (me.style.flexBasis = A + Ty)), k && (G = {
							top: z.top + (le ? ie - B : ye) + Ty,
							left: z.left + (le ? ye : ie - B) + Ty,
							boxSizing: "border-box",
							position: "fixed"
						}, G[hy] = G["max" + Cy] = Math.ceil(z.width) + Ty, G[gy] = G["max" + wy] = Math.ceil(z.height) + Ty, G[Sy] = G[Sy + yy] = G[Sy + _y] = G[Sy + by] = G[Sy + vy] = "0", G[xy] = j[xy], G[xy + yy] = j[xy + yy], G[xy + _y] = j[xy + _y], G[xy + by] = j[xy + by], G[xy + vy] = j[xy + vy], pe = Tb(fe, G, y), sb && ne(0)), n ? (xe = n._initted, Cv(1), n.render(n.duration(), !0, !0), ge = K(w.a) - he + de + _, be = Math.abs(de - ge) > 1, k && be && pe.splice(pe.length - 2, 2), n.render(0, !0, !0), xe || n.invalidate(!0), n.parent || n.totalTime(n.totalTime()), Cv(0)) : ge = de, Ce && (Ce.value ? Ce.style["overflow" + w.a.toUpperCase()] = Ce.value : Ce.style.removeProperty("overflow-" + w.a));
						else if (u && ne() && !x) for (z = u.parentNode; z && z !== cv;) z._pinOffset && (B -= z._pinOffset, se -= z._pinOffset), z = z.parentNode;
						Se && Se.forEach(function(e) {
							return e.revert(!1, !0);
						}), P.start = B, P.end = se, ae = oe = sb ? ke : ne(), x || sb || Pv || (ae < ke && ne(ke), P.scroll.rec = 0), P.revert(!1, !0), te = Rv(), Oe && (ee = -1, Oe.restart(!0)), hv = 0, n && T && (n._initted || Ae) && n.progress() !== Ae && n.progress(Ae || 0, !0).render(n.time(), !0, !0), (h || R !== P.progress || x || p || n && !n._initted) && (n && !T && (n._initted || R || n.vars.immediateRender !== !1) && n.totalProgress(x && B < -.001 && !R ? $.utils.normalize(B, se, 0) : R, !0), P.progress = h || (ae - B) / de === R ? 0 : R), d && f && (me._pinOffset = Math.round(P.progress * ge)), Te && Te.invalidate(), isNaN(we) || (we -= $.getProperty(H, w.p), Ee -= $.getProperty(U, w.p), jb(H, w, we), jb(ce, w, we - (o || 0)), jb(U, w, Ee), jb(V, w, Ee - (o || 0))), h && !sb && P.update(), c && !sb && !ue && (ue = !0, c(P), ue = !1);
					}
				}
			}, P.getVelocity = function() {
				return (ne() - oe) / (Rv() - pv) * 1e3 || 0;
			}, P.endAnimation = function() {
				cy(P.callbackAnimation), n && (Te ? Te.progress(1) : n.paused() ? T || cy(n, P.direction < 0, 1) : cy(n, n.reversed()));
			}, P.labelToScroll = function(e) {
				return n && n.labels && (B || P.refresh() || B) + n.labels[e] / n.duration() * de || 0;
			}, P.getTrailing = function(e) {
				var t = Gy.indexOf(P), n = P.direction > 0 ? Gy.slice(0, t).reverse() : Gy.slice(t + 1);
				return (iy(e) ? n.filter(function(t) {
					return t.vars.preventOverlaps === e;
				}) : n).filter(function(e) {
					return P.direction > 0 ? e.end <= B : e.start >= se;
				});
			}, P.update = function(e, t, r) {
				if (!x || r || e) {
					var o = sb === !0 ? ke : P.scroll(), c = e ? 0 : (o - B) / de, u = c < 0 ? 0 : c > 1 ? 1 : c || 0, p = P.progress, h, g, b, D, O, M, N, F;
					if (t && (oe = ae, ae = x ? ne() : o, v && (we = Ce, Ce = n && !T ? n.totalProgress() : u)), m && d && !hv && !Lv && Bv && (!u && B < o + (o - oe) / (Rv() - pv) * m ? u = 1e-4 : u === 1 && se > o + (o - oe) / (Rv() - pv) * m && (u = .9999)), u !== p && P.enabled) {
						if (h = P.isActive = !!u && u < 1, g = !!p && p < 1, M = h !== g, O = M || !!u != !!p, P.direction = u > p ? 1 : -1, P.progress = u, O && !hv && (b = u && !p ? 0 : u === 1 ? 1 : p === 1 ? 2 : 3, T && (D = !M && j[b + 1] !== "none" && j[b + 1] || j[b], F = n && (D === "complete" || D === "reset" || D in n))), C && (M || F) && (F || l || !n) && (ay(C) ? C(P) : P.getTrailing(C).forEach(function(e) {
							return e.endAnimation();
						})), T || (Te && !hv && !Lv ? (Te._dp._time - Te._start !== Te._time && Te.render(Te._dp._time - Te._start), Te.resetTo ? Te.resetTo("totalProgress", u, n._tTime / n._tDur) : (Te.vars.totalProgress = u, Te.invalidate().restart())) : n && n.totalProgress(u, !!(hv && (te || e)))), d) {
							if (e && f && (me.style[f + w.os2] = _e), !k) q(Jv(he + ge * u));
							else if (O) {
								if (N = !e && u > p && se + 1 > o && o + 1 >= ny(E, w), y) {
									if (!e && (h || N)) {
										var I = ky(d, !0), L = o - B;
										kb(d, cv, I.top + (w === J_ ? L : 0) + Ty, I.left + (w === J_ ? 0 : L) + Ty);
									} else kb(d, me);
								}
								Cb(h || N ? pe : W), be && u < 1 && h || q(he + (u === 1 && !N ? ge : 0));
							}
						}
						v && !re.tween && !hv && !Lv && Oe.restart(!0), a && (M || _ && u && (u < 1 || !Iv)) && dv(a.targets).forEach(function(e) {
							return e.classList[h || _ ? "add" : "remove"](a.className);
						}), i && !T && !e && i(P), O && !hv ? (T && (F && (D === "complete" ? n.pause().totalProgress(1) : D === "reset" ? n.restart(!0).pause() : D === "restart" ? n.restart(!0) : n[D]()), i && i(P)), (M || !Iv) && (s && M && ly(P, s), A[b] && ly(P, A[b]), _ && (u === 1 ? P.kill(!1, 1) : A[b] = 0), M || (b = u === 1 ? 1 : 3, A[b] && ly(P, A[b]))), S && !h && Math.abs(P.getVelocity()) > (oy(S) ? S : 2500) && (cy(P.callbackAnimation), Te ? Te.progress(1) : cy(n, D === "reverse" ? 1 : !u, 1))) : T && i && !hv && i(P);
					}
					if (xe) {
						var ee = x ? o / x.duration() * (x._caScrollDist || 0) : o;
						ye(ee + +!!H._isFlipped), xe(ee);
					}
					je && je(-o / x.duration() * (x._caScrollDist || 0));
				}
			}, P.enable = function(t, n) {
				P.enabled || (P.enabled = !0, Iy(E, "resize", Zy), O || Iy(E, "scroll", Yy), F && Iy(e, "refreshInit", F), t !== !1 && (P.progress = R = 0, ae = oe = ee = ne()), n !== !1 && P.refresh());
			}, P.getTween = function(e) {
				return e && re ? re.tween : Te;
			}, P.setPositions = function(e, t, n, r) {
				if (x) {
					var i = x.scrollTrigger, a = x.duration(), o = i.end - i.start;
					e = i.start + o * e / a, t = i.start + o * t / a;
				}
				P.refresh(!1, !1, {
					start: Uv(e, n && !!P._startClamp),
					end: Uv(t, n && !!P._endClamp)
				}, r), P.update();
			}, P.adjustPinSpacing = function(e) {
				if (ve && e) {
					var t = ve.indexOf(w.d) + 1;
					ve[t] = parseFloat(ve[t]) + e + Ty, ve[1] = parseFloat(ve[1]) + e + Ty, Cb(ve);
				}
			}, P.disable = function(t, n) {
				if (t !== !1 && P.revert(!0, !0), P.enabled && (P.enabled = P.isActive = !1, n || Te && Te.pause(), ke = 0, z && (z.uncache = 1), F && Ly(e, "refreshInit", F), Oe && (Oe.pause(), re.tween && re.tween.kill() && (re.tween = 0)), !O)) {
					for (var r = Gy.length; r--;) if (Gy[r].scroller === E && Gy[r] !== P) return;
					Ly(E, "resize", Zy), O || Ly(E, "scroll", Yy);
				}
			}, P.kill = function(e, r) {
				P.disable(e, r), Te && !r && Te.kill(), o && delete Ky[o];
				var i = Gy.indexOf(P);
				i >= 0 && Gy.splice(i, 1), i === vv && hb > 0 && vv--, i = 0, Gy.forEach(function(e) {
					return e.scroller === P.scroller && (i = 1);
				}), i || sb || Pv || (P.scroll.rec = 0), n && (n.scrollTrigger = null, e && n.revert({ kill: !1 }), r || n.kill()), ce && [
					ce,
					V,
					H,
					U
				].forEach(function(e) {
					return e.parentNode && e.parentNode.removeChild(e);
				}), gb === P && (gb = 0), d && (z && (z.uncache = 1), i = 0, Gy.forEach(function(e) {
					return e.pin === d && i++;
				}), i || (z.spacer = 0)), t.onKill && t.onKill(P);
			}, Gy.push(P), P.enable(!1, !1), Me && Me(P), n && n.add && !de) {
				var Ie = P.update;
				P.update = function() {
					P.update = Ie, P_.cache++, B || se || P.refresh();
				}, $.delayedCall(.01, P.update), de = .01, B = se = 0;
			} else P.refresh();
			d && ub();
		}
	}, e.register = function(t) {
		return iv ||= ($ = t || Xv(), Yv() && window.document && e.enable(), Vv), iv;
	}, e.defaults = function(e) {
		if (e) for (var t in e) By[t] = e[t];
		return By;
	}, e.disable = function(e, t) {
		Vv = 0, Gy.forEach(function(n) {
			return n[t ? "kill" : "disable"](e);
		}), Ly(av, "wheel", Yy), Ly(ov, "scroll", Yy), clearInterval(mv), Ly(ov, "touchcancel", qv), Ly(cv, "touchstart", qv), Fy(Ly, ov, "pointerdown,touchstart,mousedown", Gv), Fy(Ly, ov, "pointerup,touchend,mouseup", Kv), uv.kill(), ry(Ly);
		for (var n = 0; n < P_.length; n += 3) Ry(Ly, P_[n], P_[n + 1]), Ry(Ly, P_[n], P_[n + 2]);
	}, e.enable = function() {
		if (av = window, ov = document, sv = ov.documentElement, cv = ov.body, $) {
			if (dv = $.utils.toArray, fv = $.utils.clamp, Av = $.core.context || qv, Cv = $.core.suppressOverwrites || qv, jv = av.history.scrollRestoration || "auto", mb = av.pageYOffset || 0, $.core.globals("ScrollTrigger", e), cv) {
				Vv = 1, Mv = document.createElement("div"), Mv.style.height = "100vh", Mv.style.position = "absolute", db(), Wv(), rv.register($), e.isTouch = rv.isTouch, kv = rv.isTouch && /(iPad|iPhone|iPod|Mac)/g.test(navigator.userAgent), Ev = rv.isTouch === 1, Iy(av, "wheel", Yy), lv = [
					av,
					ov,
					sv,
					cv
				], $.matchMedia ? (e.matchMedia = function(e) {
					var t = $.matchMedia(), n;
					for (n in e) t.add(n, e[n]);
					return t;
				}, $.addEventListener("matchMediaInit", function() {
					ib(), ab();
				}), $.addEventListener("matchMediaRevert", function() {
					return rb();
				}), $.addEventListener("matchMedia", function() {
					pb(0, 1), tb("matchMedia");
				}), $.matchMedia().add("(orientation: portrait)", function() {
					return Xy(), Xy;
				})) : console.warn("Requires GSAP 3.11.0 or later"), Xy(), Iy(ov, "scroll", Yy);
				var t = cv.hasAttribute("style"), n = cv.style, r = n.borderTopStyle, i = $.core.Animation.prototype, a, o;
				for (i.revert || Object.defineProperty(i, "revert", { value: function() {
					return this.time(-.01, !0);
				} }), n.borderTopStyle = "solid", a = ky(cv), J_.m = Math.round(a.top + J_.sc()) || 0, q_.m = Math.round(a.left + q_.sc()) || 0, r ? n.borderTopStyle = r : n.removeProperty("border-top-style"), t || (cv.setAttribute("style", ""), cv.removeAttribute("style")), mv = setInterval(Jy, 250), $.delayedCall(.5, function() {
					return Lv = 0;
				}), Iy(ov, "touchcancel", qv), Iy(cv, "touchstart", qv), Fy(Iy, ov, "pointerdown,touchstart,mousedown", Gv), Fy(Iy, ov, "pointerup,touchend,mouseup", Kv), _v = $.utils.checkPrefix("transform"), yb.push(_v), iv = Rv(), uv = $.delayedCall(.2, pb).pause(), xv = [
					ov,
					"visibilitychange",
					function() {
						var e = av.innerWidth, t = av.innerHeight;
						ov.hidden ? (yv = e, bv = t) : (yv !== e || bv !== t) && Zy();
					},
					ov,
					"DOMContentLoaded",
					pb,
					av,
					"load",
					pb,
					av,
					"resize",
					Zy
				], ry(Iy), Gy.forEach(function(e) {
					return e.enable(0, 1);
				}), o = 0; o < P_.length; o += 3) Ry(Ly, P_[o], P_[o + 1]), Ry(Ly, P_[o], P_[o + 2]);
			} else ov && ov.addEventListener("DOMContentLoaded", function t() {
				e.enable(), ov.removeEventListener("DOMContentLoaded", t);
			});
		}
	}, e.config = function(t) {
		"limitCallbacks" in t && (Iv = !!t.limitCallbacks);
		var n = t.syncInterval;
		n && clearInterval(mv) || (mv = n) && setInterval(Jy, n), "ignoreMobileResize" in t && (Ev = e.isTouch === 1 && t.ignoreMobileResize), "autoRefreshEvents" in t && (ry(Ly) || ry(Iy, t.autoRefreshEvents || "none"), wv = (t.autoRefreshEvents + "").indexOf("resize") === -1);
	}, e.scrollerProxy = function(e, t) {
		var n = Y_(e), r = P_.indexOf(n), i = Zv(n);
		~r && P_.splice(r, i ? 6 : 2), t && (i ? F_.unshift(av, t, cv, t, sv, t) : F_.unshift(n, t));
	}, e.clearMatchMedia = function(e) {
		Gy.forEach(function(t) {
			return t._ctx && t._ctx.query === e && t._ctx.kill(!0, !0);
		});
	}, e.isInViewport = function(e, t, n) {
		var r = (iy(e) ? Y_(e) : e).getBoundingClientRect(), i = r[n ? hy : gy] * t || 0;
		return n ? r.right - i > 0 && r.left + i < av.innerWidth : r.bottom - i > 0 && r.top + i < av.innerHeight;
	}, e.positionInViewport = function(e, t, n) {
		iy(e) && (e = Y_(e));
		var r = e.getBoundingClientRect(), i = r[n ? hy : gy], a = t == null ? i / 2 : t in Vy ? Vy[t] * i : ~t.indexOf("%") ? parseFloat(t) * i / 100 : parseFloat(t) || 0;
		return n ? (r.left + a) / av.innerWidth : (r.top + a) / av.innerHeight;
	}, e.killAll = function(e) {
		if (Gy.slice(0).forEach(function(e) {
			return e.vars.id !== "ScrollSmoother" && e.kill();
		}), e !== !0) {
			var t = Qy.killAll || [];
			Qy = {}, t.forEach(function(e) {
				return e();
			});
		}
	}, e;
}();
Nb.version = "3.15.1", Nb.saveStyles = function(e) {
	return e ? dv(e).forEach(function(e) {
		if (e && e.style) {
			var t = nb.indexOf(e);
			t >= 0 && nb.splice(t, 5), nb.push(e, e.style.cssText, e.getBBox && e.getAttribute("transform"), $.core.getCache(e), Av());
		}
	}) : nb;
}, Nb.revert = function(e, t) {
	return ab(!e, t);
}, Nb.create = function(e, t) {
	return new Nb(e, t);
}, Nb.refresh = function(e) {
	return e ? Zy(!0) : (iv || Nb.register()) && pb(!0);
}, Nb.update = function(e) {
	return ++P_.cache && _b(e === !0 ? 2 : 0);
}, Nb.clearScrollMemory = ob, Nb.maxScroll = function(e, t) {
	return ny(e, t ? q_ : J_);
}, Nb.getScrollFunc = function(e, t) {
	return Z_(Y_(e), t ? q_ : J_);
}, Nb.getById = function(e) {
	return Ky[e];
}, Nb.getAll = function() {
	return Gy.filter(function(e) {
		return e.vars.id !== "ScrollSmoother";
	});
}, Nb.isScrolling = function() {
	return !!Bv;
}, Nb.snapDirectional = Ny, Nb.addEventListener = function(e, t) {
	var n = Qy[e] || (Qy[e] = []);
	~n.indexOf(t) || n.push(t);
}, Nb.removeEventListener = function(e, t) {
	var n = Qy[e], r = n && n.indexOf(t);
	r >= 0 && n.splice(r, 1);
}, Nb.batch = function(e, t) {
	var n = [], r = {}, i = t.interval || .016, a = t.batchMax || 1e9, o = function(e, t) {
		var n = [], r = [], o = $.delayedCall(i, function() {
			t(n, r), n = [], r = [];
		}).pause();
		return function(e) {
			n.length || o.restart(!0), n.push(e.trigger), r.push(e), a <= n.length && o.progress(1);
		};
	}, s;
	for (s in t) r[s] = s.substr(0, 2) === "on" && ay(t[s]) && s !== "onRefreshInit" ? o(s, t[s]) : t[s];
	return ay(a) && (a = a(), Iy(Nb, "refresh", function() {
		return a = t.batchMax();
	})), dv(e).forEach(function(e) {
		var t = {};
		for (s in r) t[s] = r[s];
		t.trigger = e, n.push(Nb.create(t));
	}), n;
};
var Pb = function(e, t, n, r) {
	return t > r ? e(r) : t < 0 && e(0), n > r ? (r - t) / (n - t) : n < 0 ? t / (t - n) : 1;
}, Fb = function e(t, n) {
	n === !0 ? t.style.removeProperty("touch-action") : t.style.touchAction = n === !0 ? "auto" : n ? "pan-" + n + (rv.isTouch ? " pinch-zoom" : "") : "none", t === sv && e(cv, n);
}, Ib = {
	auto: 1,
	scroll: 1
}, Lb = function(e) {
	var t = e.event, n = e.target, r = e.axis, i = (t.changedTouches ? t.changedTouches[0] : t).target, a = i._gsap || $.core.getCache(i), o = Rv(), s;
	if (!a._isScrollT || o - a._isScrollT > 2e3) {
		for (; i && i !== cv && (i.scrollHeight <= i.clientHeight && i.scrollWidth <= i.clientWidth || !(Ib[(s = Ey(i)).overflowY] || Ib[s.overflowX]));) i = i.parentNode;
		a._isScroll = i && i !== n && !Zv(i) && (Ib[(s = Ey(i)).overflowY] || Ib[s.overflowX]), a._isScrollT = o;
	}
	(a._isScroll || r === "x") && (t.stopPropagation(), t._gsapAllow = !0);
}, Rb = function(e, t, n, r) {
	return rv.create({
		target: e,
		capture: !0,
		debounce: !1,
		lockAxis: !0,
		type: t,
		onWheel: r &&= Lb,
		onPress: r,
		onDrag: r,
		onScroll: r,
		onEnable: function() {
			return n && Iy(ov, rv.eventTypes[0], Vb, !1, !0);
		},
		onDisable: function() {
			return Ly(ov, rv.eventTypes[0], Vb, !0);
		}
	});
}, zb = /(input|label|select|textarea)/i, Bb, Vb = function(e) {
	var t = zb.test(e.target.tagName);
	(t || Bb) && (e._gsapAllow = !0, Bb = t);
}, Hb = function(e) {
	sy(e) || (e = {}), e.preventDefault = e.isNormalizer = e.allowClicks = !0, e.type || (e.type = "wheel,touch"), e.debounce = !!e.debounce, e.id = e.id || "normalizer";
	var t = e, n = t.normalizeScrollX, r = t.momentum, i = t.allowNestedScroll, a = t.onRelease, o, s, c = Y_(e.target) || sv, l = $.core.globals().ScrollSmoother, u = l && l.get(), d = kv && (e.content && Y_(e.content) || u && e.content !== !1 && !u.smooth() && u.content()), f = Z_(c, J_), p = Z_(c, q_), m = 1, h = (rv.isTouch && av.visualViewport ? av.visualViewport.scale * av.visualViewport.width : av.outerWidth) / av.innerWidth, g = 0, _ = ay(r) ? function() {
		return r(o);
	} : function() {
		return r || 2.8;
	}, v, y, b = Rb(c, e.type, !0, i), x = function() {
		return y = !1;
	}, S = qv, C = qv, w = function() {
		s = ny(c, J_), C = fv(+!!kv, s), n && (S = fv(0, ny(c, q_))), v = cb;
	}, T = function() {
		d._gsap.y = Jv(parseFloat(d._gsap.y) + f.offset) + "px", d.style.transform = "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, " + parseFloat(d._gsap.y) + ", 0, 1)", f.offset = f.cacheID = 0;
	}, E = function() {
		if (y) {
			requestAnimationFrame(x);
			var e = Jv(o.deltaY / 2), t = C(f.v - e);
			if (d && t !== f.v + f.offset) {
				f.offset = t - f.v;
				var n = Jv((parseFloat(d && d._gsap.y) || 0) - f.offset);
				d.style.transform = "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, " + n + ", 0, 1)", d._gsap.y = n + "px", f.cacheID = P_.cache, _b();
			}
			return !0;
		}
		f.offset && T(), y = !0;
	}, D, O, k, A, j = function() {
		w(), D.isActive() && D.vars.scrollY > s && (f() > s ? D.progress(1) && f(s) : D.resetTo("scrollY", s));
	};
	return d && $.set(d, { y: "+=0" }), e.ignoreCheck = function(e) {
		return kv && e.type === "touchmove" && E(e) || m > 1.05 && e.type !== "touchstart" || o.isGesturing || e.touches && e.touches.length > 1;
	}, e.onPress = function() {
		y = !1;
		var e = m;
		m = Jv((av.visualViewport && av.visualViewport.scale || 1) / h), D.pause(), e !== m && Fb(c, m > 1.01 || !n && "x"), O = p(), k = f(), w(), v = cb;
	}, e.onRelease = e.onGestureStart = function(e, t) {
		if (f.offset && T(), !t) A.restart(!0);
		else {
			P_.cache++;
			var r = _(), i, o;
			n && (i = p(), o = i + r * .05 * -e.velocityX / .227, r *= Pb(p, i, o, ny(c, q_)), D.vars.scrollX = S(o)), i = f(), o = i + r * .05 * -e.velocityY / .227, r *= Pb(f, i, o, ny(c, J_)), D.vars.scrollY = C(o), D.invalidate().duration(r).play(.01), (kv && D.vars.scrollY >= s || i >= s - 1) && $.to({}, {
				onUpdate: j,
				duration: r
			});
		}
		a && a(e);
	}, e.onWheel = function() {
		D._ts && D.pause(), Rv() - g > 1e3 && (v = 0, g = Rv());
	}, e.onChange = function(e, t, r, i, a) {
		if (cb !== v && w(), t && n && p(S(i[2] === t ? O + (e.startX - e.x) : p() + t - i[1])), r) {
			f.offset && T();
			var o = a[2] === r, s = o ? k + e.startY - e.y : f() + r - a[1], c = C(s);
			o && s !== c && (k += c - s), f(c);
		}
		(r || t) && _b();
	}, e.onEnable = function() {
		Fb(c, !n && "x"), Nb.addEventListener("refresh", j), Iy(av, "resize", j), f.smooth &&= (f.target.style.scrollBehavior = "auto", p.smooth = !1), b.enable();
	}, e.onDisable = function() {
		Fb(c, !0), Ly(av, "resize", j), Nb.removeEventListener("refresh", j), b.kill();
	}, e.lockAxis = e.lockAxis !== !1, o = new rv(e), o.iOS = kv, kv && !f() && f(1), kv && $.ticker.add(qv), A = o._dc, D = $.to(o, {
		ease: "power4",
		paused: !0,
		inherit: !1,
		scrollX: n ? "+=0.1" : "+=0",
		scrollY: "+=0.1",
		modifiers: { scrollY: Ab(f, f(), function() {
			return D.pause();
		}) },
		onUpdate: _b,
		onComplete: A.vars.onComplete
	}), o;
};
Nb.sort = function(e) {
	if (ay(e)) return Gy.sort(e);
	var t = av.pageYOffset || 0;
	return Nb.getAll().forEach(function(e) {
		return e._sortY = e.trigger ? t + e.trigger.getBoundingClientRect().top : e.start + av.innerHeight;
	}), Gy.sort(e || function(e, t) {
		return (e.vars.refreshPriority || 0) * -1e6 + (e.vars.containerAnimation ? 1e6 : e._sortY) - ((t.vars.containerAnimation ? 1e6 : t._sortY) + (t.vars.refreshPriority || 0) * -1e6);
	});
}, Nb.observe = function(e) {
	return new rv(e);
}, Nb.normalizeScroll = function(e) {
	if (e === void 0) return Tv;
	if (e === !0 && Tv) return Tv.enable();
	if (e === !1) Tv && Tv.kill(), Tv = e;
	else {
		var t = e instanceof rv ? e : Hb(e);
		return Tv && Tv.target === t.target && Tv.kill(), Zv(t.target) && (Tv = t), t;
	}
}, Nb.core = {
	_getVelocityProp: Q_,
	_inputObserver: Rb,
	_scrollers: P_,
	_proxies: F_,
	bridge: {
		ss: function() {
			Bv || tb("scrollStart"), Bv = Rv();
		},
		ref: function() {
			return hv;
		}
	}
}, Xv() && $.registerPlugin(Nb);
// src/public/purchase-examples.tsx
var Ub = [
	{
		id: "ficha-de-demanda",
		step: 1,
		Icon: jg,
		title: "Ficha de demanda",
		fields: [
			["Material", "Alumínio 6061"],
			["Processo", "Usinagem CNC"],
			["Quantidade", "240 peças"]
		]
	},
	{
		id: "comparacao-de-propostas",
		step: 3,
		Icon: Ng,
		title: "Comparação de propostas",
		fields: [
			["Preço", "Valor da proposta"],
			["Prazo", "Dias para entrega"],
			["Condições", "Frete e pagamento"]
		]
	},
	{
		id: "registro-de-inspecao",
		step: 5,
		Icon: Tg,
		title: "Registro de inspeção",
		fields: [
			["Verificação", "Plano de inspeção"],
			["Resultado", "Quantidade aprovada"],
			["Pendências", "Por item"]
		]
	},
	{
		id: "recebimento-do-pedido",
		step: 7,
		Icon: Lg,
		title: "Recebimento do pedido",
		fields: [
			["Fornecedor", "Registra a expedição"],
			["Comprador", "Confirma o recebimento"],
			["Histórico", "Pedido e avaliação"]
		]
	}
];
function Wb({ example: e }) {
	let { Icon: t, title: n, fields: r } = e;
	return /* @__PURE__ */ (0, Z.jsxs)("div", {
		className: "sv-quote sv-editorial-record",
		children: [/* @__PURE__ */ (0, Z.jsxs)("div", {
			className: "sv-quote-heading",
			children: [/* @__PURE__ */ (0, Z.jsxs)("span", { children: [
				/* @__PURE__ */ (0, Z.jsx)(t, {
					size: 18,
					"aria-hidden": "true"
				}),
				" ",
				n
			] }), /* @__PURE__ */ (0, Z.jsx)("small", { children: "Exemplo" })]
		}), /* @__PURE__ */ (0, Z.jsx)("dl", { children: r.map(([e, t]) => /* @__PURE__ */ (0, Z.jsxs)("div", { children: [/* @__PURE__ */ (0, Z.jsx)("dt", { children: e }), /* @__PURE__ */ (0, Z.jsx)("dd", { children: t })] }, e)) })]
	});
}
// node_modules/gsap/SplitText.js
var Gb, Kb, qb = typeof Symbol == "function" ? Symbol() : "_split", Jb, Yb = () => Jb || mx.register(window.gsap), Xb = typeof Intl < "u" && "Segmenter" in Intl ? new Intl.Segmenter() : 0, Zb = (e) => e ? typeof e == "string" ? Zb(document.querySelectorAll(e)) : "length" in e ? Array.from(e).reduce((e, t) => (typeof t == "string" ? e.push(...Zb(t)) : e.push(t), e), []) : [e] : [], Qb = (e) => Zb(e).filter((e) => e && e.nodeType === 1), $b = [], ex = function() {}, tx = { add: (e) => e() }, nx = /\s+/g, rx = /* @__PURE__ */ RegExp("\\p{RI}\\p{RI}|\\p{Emoji}(\\p{EMod}|\\u{FE0F}\\u{20E3}?|[\\u{E0020}-\\u{E007E}]+\\u{E007F})?(\\u{200D}\\p{Emoji}(\\p{EMod}|\\u{FE0F}\\u{20E3}?|[\\u{E0020}-\\u{E007E}]+\\u{E007F})?)*|.", "gu"), ix = {
	left: 0,
	top: 0,
	width: 0,
	height: 0
}, ax = (e, t) => {
	for (; ++t < e.length && e[t] === ix;);
	return e[t] || ix;
}, ox = ({ element: e, html: t, ariaL: n, ariaH: r }) => {
	e.innerHTML = t, n ? e.setAttribute("aria-label", n) : e.removeAttribute("aria-label"), r ? e.setAttribute("aria-hidden", r) : e.removeAttribute("aria-hidden");
}, sx = (e, t) => {
	if (t) {
		let n = new Set(e.join("").match(t) || $b), r = e.length, i, a, o, s;
		if (n.size) for (; --r > -1;) {
			a = e[r];
			for (o of n) if (o.startsWith(a) && o.length > a.length) {
				for (i = 0, s = a; o.startsWith(s += e[r + ++i]) && s.length < o.length;);
				if (i && s.length === o.length) {
					e[r] = o, e.splice(r + 1, i);
					break;
				}
			}
		}
	}
	return e;
}, cx = (e) => window.getComputedStyle(e).display === "inline" && (e.style.display = "inline-block"), lx = (e, t, n) => t.insertBefore(typeof e == "string" ? document.createTextNode(e) : e, n), ux = (e, t, n) => {
	let r = t[e + "sClass"] || "", { tag: i = "div", aria: a = "auto", propIndex: o = !1 } = t, s = e === "line" ? "block" : "inline-block", c = r.indexOf("++") > -1, l = (t) => {
		let l = document.createElement(i), u = n.length + 1;
		return r && (l.className = r + (c ? " " + r + u : "")), o && l.style.setProperty("--" + e, u + ""), a !== "none" && l.setAttribute("aria-hidden", "true"), i !== "span" && (l.style.position = "relative", l.style.display = s), l.textContent = t, n.push(l), l;
	};
	return c && (r = r.replace("++", "")), l.collection = n, l;
}, dx = (e, t, n, r) => {
	let i = ux("line", n, r), a = window.getComputedStyle(e).textAlign || "left";
	return (n, r) => {
		let o = i("");
		for (o.style.textAlign = a, e.insertBefore(o, t[n]); n < r; n++) o.appendChild(t[n]);
		o.normalize();
	};
}, fx = (e, t, n, r, i, a, o, s, c, l) => {
	var u;
	let d = Array.from(e.childNodes), f = 0, { wordDelimiter: p, reduceWhiteSpace: m = !0, prepareText: h } = t, g = e.getBoundingClientRect(), _ = g, v = !m && window.getComputedStyle(e).whiteSpace.substring(0, 3) === "pre", y = a && l && window.getComputedStyle(e).direction === "rtl", b = 0, x = n.collection, S, C, w, T, E, D, O, k, A, j, M, N, P, F, I, L, ee, te;
	for (typeof p == "object" ? (w = p.delimiter || p, C = p.replaceWith || "") : C = p === "" ? "" : p || " ", S = C !== " "; f < d.length; f++) if (T = d[f], T.nodeType === 3) {
		for (I = T.textContent || "", m ? I = I.replace(nx, " ") : v && (I = I.replace(/\n/g, C + "\n")), h && (I = h(I, e)), T.textContent = I, E = C || w ? I.split(w || C) : I.match(s) || $b, ee = E[E.length - 1], k = S ? ee.slice(-1) === " " : !ee, ee || E.pop(), _ = g, O = S ? E[0].charAt(0) === " " : !E[0], O && lx(" ", e, T), E[0] || E.shift(), sx(E, c), a && l || (T.textContent = ""), A = 1; A <= E.length; A++) if (L = E[A - 1], !m && v && L.charAt(0) === "\n" && ((u = T.previousSibling) == null || u.remove(), lx(document.createElement("br"), e, T), L = L.slice(1)), !m && L === "") lx(C, e, T);
		else if (L === " ") e.insertBefore(document.createTextNode(" "), T);
		else {
			if (S && L.charAt(0) === " " && lx(" ", e, T), b && A === 1 && !O && x.indexOf(b.parentNode) > -1 ? (D = x[x.length - 1], D.appendChild(document.createTextNode(r ? "" : L))) : (D = n(r ? "" : L), lx(D, e, T), b && A === 1 && !O && D.insertBefore(b, D.firstChild)), r) {
				if (M = Xb ? sx([...Xb.segment(L)].map((e) => e.segment), c) : L.match(s) || $b, c) {
					let e = L.match(c);
					e && e.some((e) => M.indexOf(e) < 0) && (M = L.match(s) || $b);
				}
				for (te = 0; te < M.length; te++) D.appendChild(M[te] === " " ? document.createTextNode(" ") : r(M[te]));
			}
			if (a && l) {
				if (I = T.textContent = I.substring(L.length + 1, I.length), j = D.getBoundingClientRect(), j.top > _.top && (y ? j.left >= _.left : j.left <= _.left)) {
					for (N = e.cloneNode(), P = e.childNodes[0]; P && P !== D;) F = P, P = P.nextSibling, N.appendChild(F);
					e.parentNode.insertBefore(N, e), i && cx(N);
				}
				_ = j;
			}
			(A < E.length || k) && lx(A >= E.length ? " " : S && L.slice(-1) === " " ? " " + C : C, e, T);
		}
		e.removeChild(T), b = 0;
	} else T.nodeType === 1 && (o && o.indexOf(T) > -1 ? (x.indexOf(T.previousSibling) > -1 && x[x.length - 1].appendChild(T), b = T) : (fx(T, t, n, r, i, a, o, s, c, !0), b = 0), i && cx(T));
}, px = class e {
	constructor(e, t) {
		this.isSplit = !1, Yb(), this.elements = Qb(e), this.chars = [], this.words = [], this.lines = [], this.masks = [], this.vars = t, this.elements.forEach((e) => {
			var n;
			t.overwrite !== !1 && ((n = e[qb]) == null || n._data.orig.filter(({ element: t }) => t === e).forEach(ox)), e[qb] = this;
		}), this._split = () => this.isSplit && this.split(this.vars);
		let n = [], r = () => {
			let e = n.length, t;
			for (; e--;) {
				t = n[e];
				let r = t.element.offsetWidth;
				if (r !== t.width) {
					t.width = r, this._split();
					return;
				}
			}
		};
		this._data = {
			orig: n,
			obs: typeof ResizeObserver < "u" && new ResizeObserver(() => {
				clearTimeout(this._data.t), this._data.t = setTimeout(r, 200);
			})
		}, ex(this), this.split(t);
	}
	split(e) {
		return (this._ctx || tx).add(() => {
			this.isSplit && this.revert(), this.vars = e = e || this.vars || {};
			let { type: t = "chars,words,lines", aria: n = "auto", deepSlice: r = !0, smartWrap: i, onSplit: a, autoSplit: o = !1, specialChars: s, mask: c } = this.vars, l = t.indexOf("lines") > -1, u = t.indexOf("chars") > -1, d = t.indexOf("words") > -1, f = u && !d && !l, p = s && ("push" in s ? RegExp("(?:" + s.join("|") + ")", "gu") : s), m = p ? RegExp(p.source + "|" + rx.source, "gu") : rx, h = !!e.ignore && Qb(e.ignore), { orig: g, animTime: _, obs: v } = this._data, y;
			(u || d || l) && (this.elements.forEach((t, a) => {
				g[a] = {
					element: t,
					html: t.innerHTML,
					ariaL: t.getAttribute("aria-label"),
					ariaH: t.getAttribute("aria-hidden")
				}, n === "auto" ? t.setAttribute("aria-label", (t.textContent || "").trim()) : n === "hidden" && t.setAttribute("aria-hidden", "true");
				let o = [], s = [], c = [], _ = u ? ux("char", e, o) : null, v = ux("word", e, s), y, b, x, S;
				if (fx(t, e, v, _, f, r && (l || f), h, m, p, !1), l) {
					let n = Zb(t.childNodes), r = dx(t, n, e, c), i, a = [], o = 0, s = window.getComputedStyle(t).direction === "rtl", l = n.map((e) => e.nodeType === 1 ? e.getBoundingClientRect() : ix), u = ix, d;
					for (y = 0; y < n.length; y++) i = n[y], i.nodeType === 1 && (i.nodeName === "BR" ? (y && n[y - 1].nodeName === "BR" || (a.push(i), r(o, y + 1)), o = y + 1, u = ax(l, y)) : (d = l[y], y && d.top > u.top && (s ? d.left + d.width > u.left + 1 : d.left < u.left + u.width - 1) && (r(o, y), o = y), u = d));
					o < y && r(o, y), a.forEach((e) => e.parentNode?.removeChild(e));
				}
				if (!d) {
					for (y = 0; y < s.length; y++) if (b = s[y], u || !b.nextSibling || b.nextSibling.nodeType !== 3) {
						if (i && !l) {
							for (x = document.createElement("span"), x.style.whiteSpace = "nowrap"; b.firstChild;) x.appendChild(b.firstChild);
							b.replaceWith(x);
						} else b.replaceWith(...b.childNodes);
					} else S = b.nextSibling, S && S.nodeType === 3 && (S.textContent = (b.textContent || "") + (S.textContent || ""), b.remove());
					s.length = 0, t.normalize();
				}
				this.lines.push(...c), this.words.push(...s), this.chars.push(...o);
			}), c && this[c] && this.masks.push(...this[c].map((e) => {
				let t = e.cloneNode();
				return e.replaceWith(t), t.appendChild(e), e.className && (t.className = e.className.trim().split(" ").map((e) => e + "-mask").join(" ")), t.style.overflow = "clip", t.style.verticalAlign = "top", t;
			}))), this.isSplit = !0, Kb && l && o && Kb.addEventListener("loadingdone", this._split), (y = a && a(this)) && y.totalTime && (this._data.anim = _ ? y.totalTime(_) : y), l && o && this.elements.forEach((e, t) => {
				g[t].width = e.offsetWidth, v && v.observe(e);
			});
		}), this;
	}
	kill() {
		let { obs: e, t } = this._data;
		e && e.disconnect(), clearTimeout(t), Kb?.removeEventListener("loadingdone", this._split);
	}
	revert() {
		var e, t;
		if (this.isSplit) {
			let { orig: n, anim: r } = this._data;
			this.kill(), n.forEach(ox), this.chars.length = this.words.length = this.lines.length = n.length = this.masks.length = 0, this.isSplit = !1, r && (this._data.animTime = r.totalTime(), r.revert()), (t = (e = this.vars).onRevert) == null || t.call(e, this);
		}
		return this;
	}
	static create(t, n) {
		return new e(t, n);
	}
	static register(e) {
		Gb = Gb || e || window.gsap, Gb && (Zb = Gb.utils.toArray, ex = Gb.core.context || ex), !Jb && window.innerWidth > 0 && (Kb = document.fonts, Jb = !0);
	}
};
px.version = "3.15.1";
var mx = px;
// src/public/motion/SplitText.tsx
qh.registerPlugin(Nb, mx, $h);
var hx = {
	opacity: 0,
	y: 40
}, gx = {
	opacity: 1,
	y: 0
}, _x = 180, vx = 19, yx = .024, bx = typeof window < "u" ? y.useLayoutEffect : y.useEffect, xx = () => typeof document < "u" && (!document.fonts || document.fonts.status === "loaded"), Sx = (e) => 1 - Math.cos(e * Math.PI * 1.5) * (1 - e) ** 1.2, Cx = (e, t) => {
	switch (e) {
		case "fade": return {
			from: { opacity: 0 },
			to: { opacity: 1 },
			ease: "power2.inOut"
		};
		case "blur": return {
			from: {
				opacity: 0,
				filter: `blur(${Math.round(t * 1.4) / 10}px)`
			},
			to: {
				opacity: 1,
				filter: "blur(0px)"
			},
			ease: "power2.out"
		};
		case "flip": {
			let e = {
				transformPerspective: t * 6,
				transformOrigin: "50% 100%"
			};
			return {
				from: {
					...e,
					opacity: 0,
					rotationX: -90
				},
				to: {
					...e,
					opacity: 1,
					rotationX: 0
				},
				ease: "power3.out"
			};
		}
		case "pop": return {
			from: {
				opacity: 0,
				scale: 0
			},
			to: {
				opacity: 1,
				scale: 1
			},
			ease: "back.out(1.6)"
		};
		case "skew": return {
			from: {
				transformOrigin: "50% 100%",
				opacity: 0,
				x: -t * .4,
				skewX: -24
			},
			to: {
				transformOrigin: "50% 100%",
				opacity: 1,
				x: 0,
				skewX: 0
			},
			ease: "expo.out"
		};
		case "wave": return {
			from: {
				opacity: 0,
				y: t * .45
			},
			to: {
				opacity: 1,
				y: 0
			},
			ease: Sx
		};
		default: return {
			from: { ...hx },
			to: { ...gx },
			ease: "power3.out"
		};
	}
}, wx = ({ text: e, id: t, tabIndex: n, className: r = "", delay: i = 50, startDelay: a = 0, duration: o = 1.25, ease: s, splitType: c = "chars", from: l, to: u, threshold: d = .1, rootMargin: f = "-100px", textAlign: p = "center", tag: m = "p", staggerFrom: h = "start", mask: g = !1, effect: _ = "rise", trigger: v = "view", loop: b = !1, loopDelay: x = 1.5, hoverEffect: S = "none", color: C, accentColor: w, onLetterAnimationComplete: T }) => {
	let E = (0, y.useRef)(null), [D, O] = (0, y.useState)(() => typeof window < "u" && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
	(0, y.useEffect)(() => {
		let e = window.matchMedia("(prefers-reduced-motion: reduce)"), t = () => O(e.matches);
		return e.addEventListener("change", t), t(), () => e.removeEventListener("change", t);
	}, []);
	let k = (0, y.useRef)(null), A = (0, y.useRef)(T), j = (0, y.useRef)({
		trigger: v,
		hoverEffect: S,
		accentColor: w
	}), [M, N] = (0, y.useState)(xx), [P, F] = (0, y.useState)(!1);
	bx(() => {
		A.current = T, j.current = {
			trigger: v,
			hoverEffect: S,
			accentColor: w
		};
	}), (0, y.useEffect)(() => {
		if (M) return;
		let e = !0;
		return document.fonts.ready.then(() => {
			e && N(!0);
		}), () => {
			e = !1;
		};
	}, [M]), $h(() => {
		let t = E.current;
		if (!t || !e || !M) return;
		if (t.getBoundingClientRect(), !xx()) {
			N(!1);
			return;
		}
		let n = () => {
			k.current !== e && (k.current = e, A.current?.());
		};
		if (D) {
			F(!0), n();
			return;
		}
		let r = (1 - d) * 100, p = /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(f), m = p ? parseFloat(p[1]) : 0, y = p && p[2] || "px", S = `top ${r}%${m === 0 ? "" : m < 0 ? `-=${Math.abs(m)}${y}` : `+=${m}${y}`}`, C = c.includes("chars") ? "chars" : c.includes("words") ? "words" : "lines", w = parseFloat(getComputedStyle(t).fontSize) || 16, T = l !== void 0 || u !== void 0, O = Cx(_, w), P = T ? { ...l || hx } : O.from, I = T ? { ...u || gx } : O.to, L = s || (T ? "power3.out" : O.ease), ee = T ? "willChange" : "transform,filter,willChange", te = Math.max(.35, o * .55), R = [], ne = [], re = qh.utils.distribute({
			each: i / 1e3,
			from: h
		}), z = k.current === e, ie = null, ae = null, oe = null, B = 0, se = 0, ce = null, V = w * .2, H = [], U = [], le = {
			x: 0,
			y: 0,
			inside: !1
		}, ue = (e, n) => {
			let r = j.current.accentColor, i = qh.timeline(n);
			return i.fromTo(R, {
				...P,
				willChange: "transform, opacity"
			}, {
				...I,
				duration: o,
				ease: L,
				stagger: re,
				immediateRender: e
			}, 0), r && i.fromTo(R, { color: r }, {
				color: getComputedStyle(t).color,
				duration: o * .7,
				ease: "power1.inOut",
				stagger: re,
				immediateRender: e
			}, o * .3), i.set(R, { clearProps: r ? `${ee},color` : ee }), i;
		}, de = () => {
			let e = j.current.accentColor, t = qh.timeline();
			return t.fromTo(R, {
				...I,
				willChange: "transform, opacity"
			}, {
				...P,
				duration: te,
				ease: "power2.in",
				stagger: re,
				immediateRender: !1
			}, 0), e && t.to(R, {
				color: e,
				duration: te,
				ease: "power1.in",
				stagger: re
			}, 0), t;
		}, fe = () => {
			!ae && z && R.length && (oe?.kill(), oe = null, ae = qh.timeline({ onComplete: () => {
				ae = null, pe();
			} }).add(de(), 0).add(ue(!1), te));
		}, pe = () => {
			oe?.kill(), oe = b ? qh.delayedCall(x, fe) : null;
		}, W = () => {
			let e = t.getBoundingClientRect();
			ce = ne.map((t, n) => {
				let r = t.getBoundingClientRect();
				return {
					x: r.left + r.width / 2 - e.left,
					y: r.top + r.height / 2 - e.top - (H[n]?.y || 0)
				};
			});
		}, me = (e) => {
			B = 0;
			let t = Math.min(.032, Math.max(.001, (e - se) / 1e3));
			se = e;
			let n = j.current.hoverEffect === "lift" && le.inside && z ? ce : null, r = w * 1.15, i = !1;
			for (let t = U.length - 1; t >= 0; t--) {
				if (e < U[t].at) continue;
				let n = H[U[t].index];
				n && (n.v -= U[t].velocity), U.splice(t, 1);
			}
			ne.forEach((e, a) => {
				let o = H[a] || (H[a] = {
					y: 0,
					v: 0
				}), s = n?.[a], c = 0;
				if (s) {
					let e = (s.x - le.x) / r, t = (s.y - le.y) / (r * 1.4);
					c = -V * Math.exp(-(e * e + t * t) * .5);
				}
				o.v += (_x * (c - o.y) - vx * o.v) * t, o.y += o.v * t, Math.abs(c - o.y) < .02 && Math.abs(o.v) < .05 ? (o.y = c, o.v = 0) : i = !0, e.style.translate = Math.abs(o.y) > .01 ? `0 ${o.y.toFixed(2)}px` : "";
			}), (i || U.length) && (B = requestAnimationFrame(me));
		}, G = () => {
			B ||= (se = performance.now(), requestAnimationFrame(me));
		}, K = (e) => {
			let n = t.getBoundingClientRect();
			le.x = e.clientX - n.left, le.y = e.clientY - n.top;
		}, q = (e) => {
			if (e.pointerType === "touch" || !matchMedia("(hover: hover) and (pointer: fine)").matches || (K(e), le.inside = !0, !z)) return;
			let t = j.current;
			if (t.trigger === "hover" && fe(), t.hoverEffect !== "none") {
				if (W(), t.hoverEffect === "wave") {
					let e = performance.now(), t = w * 9, n = w * .16 / yx;
					ce?.forEach((r, i) => {
						U.push({
							index: i,
							velocity: n,
							at: e + Math.abs(r.x - le.x) / t * 1e3
						});
					});
				}
				G();
			}
		}, he = (e) => {
			e.pointerType !== "touch" && matchMedia("(hover: hover) and (pointer: fine)").matches && (K(e), le.inside = !0, z && j.current.hoverEffect === "lift" && (ce || W(), G()));
		}, ge = () => {
			le.inside = !1, G();
		}, _e = () => {
			j.current.trigger === "click" && fe();
		}, ve = new mx(t, {
			type: c,
			smartWrap: !0,
			autoSplit: c === "lines",
			mask: g ? C : void 0,
			linesClass: "split-line",
			wordsClass: "split-word",
			charsClass: "split-char",
			reduceWhiteSpace: !1,
			onSplit: (e) => {
				if (R = [
					e[C],
					e.chars,
					e.words,
					e.lines
				].find((e) => e.length) || [], ne = g && e.masks?.length === R.length ? e.masks : R, re = qh.utils.distribute({
					each: i / 1e3,
					from: h
				}), ce = null, H.length = 0, U.length = 0, ae && ae !== ie && (ae.kill(), ae = null), !z) return ie = ue(!0, {
					delay: a,
					scrollTrigger: v === "load" ? void 0 : {
						trigger: t,
						start: S,
						once: !0,
						fastScrollEnd: !0,
						anticipatePin: .4
					},
					onComplete: () => {
						z = !0, ie = null, ae = null, n(), pe();
					}
				}), ae = ie, ie;
			}
		}), ye = () => {
			v !== "load" && (ie?.progress(1), oe?.kill(), qh.set(R, {
				...I,
				clearProps: "transform,filter,willChange"
			}), z = !0, n());
		};
		return t.addEventListener("focus", ye), t === document.activeElement && ye(), F(!0), z && t !== document.activeElement && pe(), t.addEventListener("pointerenter", q), t.addEventListener("pointermove", he), t.addEventListener("pointerleave", ge), t.addEventListener("click", _e), () => {
			cancelAnimationFrame(B), oe?.kill(), ae?.kill(), t.removeEventListener("focus", ye), t.removeEventListener("pointerenter", q), t.removeEventListener("pointermove", he), t.removeEventListener("pointerleave", ge), t.removeEventListener("click", _e), ne.forEach((e) => {
				e.style.translate = "";
			}), Nb.getAll().forEach((e) => {
				e.trigger === t && e.kill();
			}), ve.revert();
		};
	}, {
		dependencies: [
			e,
			i,
			a,
			o,
			s,
			c,
			JSON.stringify(l),
			JSON.stringify(u),
			d,
			f,
			h,
			g,
			_,
			v,
			b,
			x,
			M,
			D
		],
		scope: E,
		revertOnUpdate: !0
	});
	let I = m || "p", L = S === "none" && (l !== void 0 || u !== void 0 || _ === "rise" || _ === "fade");
	return /* @__PURE__ */ (0, Z.jsx)(I, {
		ref: E,
		id: t,
		tabIndex: n,
		"data-split-ready": P || void 0,
		className: `sv-split-text ${r}`,
		style: {
			textAlign: p,
			overflow: L ? "hidden" : "visible",
			display: "block",
			whiteSpace: "normal",
			wordWrap: "break-word",
			color: C,
			cursor: v === "click" ? "pointer" : void 0
		},
		children: e
	}, e);
};
// src/public/home-content.tsx
qh.registerPlugin($h, Nb);
var Tx = [
	{
		label: "Publicar uma demanda",
		description: "Material, processo, quantidade e prazo ficam reunidos na ficha de cada item.",
		example: Ub[0]
	},
	{
		label: "Comparar propostas",
		description: "Consulte preço, prazo, frete e pagamento. Quando o fornecedor revisa a proposta, a versão anterior continua disponível.",
		example: Ub[1]
	},
	{
		label: "Acompanhar o pedido",
		description: "O pedido preserva as condições aceitas. Nele, as empresas acompanham inspeção, expedição e recebimento.",
		example: Ub[3]
	}
], Ex = [{
	example: Ub[1],
	image: "./assets/home-comparison.webp",
	description: "Duas cotações para a mesma peça. O que pesa mais na decisão, preço ou prazo?"
}, {
	example: Ub[2],
	image: "./assets/home-inspection.webp",
	description: "Veja como documentar a inspeção de cada item antes de liberar a expedição."
}], Dx = [
	{
		step: 2,
		title: "Como encontrar fornecedores compatíveis?",
		description: "O SIVI indica quais requisitos da demanda correspondem ao perfil do fornecedor e quais ainda precisam ser confirmados."
	},
	{
		step: 4,
		title: "Quais condições ficam no pedido?",
		description: "Preço, prazo, frete e pagamento são registrados com os itens e as condições da versão aceita."
	},
	{
		step: 5,
		title: "Como o fornecedor registra a inspeção?",
		description: "O fornecedor informa o plano de inspeção, as evidências e a quantidade aprovada por item. A expedição depende da liberação da qualidade."
	},
	{
		step: 7,
		title: "Quem confirma o recebimento?",
		description: "O comprador confirma a chegada do pedido e pode avaliar o fornecimento. As duas empresas podem consultar o histórico."
	}
], Ox = [
	{
		href: Yg("faq"),
		title: "Cadastro da empresa"
	},
	{
		href: e_("ajuda"),
		title: "Primeiro acesso"
	},
	{
		href: e_("seguranca"),
		title: "Acessos e dados"
	}
], kx = {
	rise: {
		splitType: "words",
		mask: !0,
		from: {
			yPercent: 112,
			opacity: 0
		},
		to: {
			yPercent: 0,
			opacity: 1
		},
		duration: .78,
		delay: 75
	},
	slide: {
		splitType: "lines",
		mask: !0,
		from: {
			xPercent: -18,
			opacity: 0
		},
		to: {
			xPercent: 0,
			opacity: 1
		},
		duration: .82,
		delay: 125
	},
	flip: {
		splitType: "words",
		effect: "flip",
		duration: .76,
		delay: 90
	},
	focus: {
		splitType: "lines",
		effect: "blur",
		duration: .73,
		delay: 110
	}
};
function Ax({ id: e, text: t, animation: n = "rise" }) {
	return /* @__PURE__ */ (0, Z.jsx)(wx, {
		id: e,
		text: t,
		tag: "h2",
		tabIndex: -1,
		textAlign: "start",
		threshold: .16,
		rootMargin: "0px",
		...kx[n]
	});
}
function jx() {
	let [e, t] = (0, y.useState)(0), [n, r] = (0, y.useState)("");
	function i(e) {
		t(e), r(`${Tx[e].example.title}. ${Tx[e].description}`);
	}
	return /* @__PURE__ */ (0, Z.jsx)("section", {
		className: "sv-home-content sv-home-flow",
		"aria-labelledby": "solucoes-inicio",
		children: /* @__PURE__ */ (0, Z.jsxs)("div", {
			className: "sv-shell",
			children: [
				/* @__PURE__ */ (0, Z.jsx)("div", {
					className: "sv-home-flow-head",
					children: /* @__PURE__ */ (0, Z.jsx)(Ax, {
						id: "solucoes-inicio",
						text: "Uma compra, do começo ao fim.",
						animation: "slide"
					})
				}),
				/* @__PURE__ */ (0, Z.jsxs)("div", {
					className: "sv-home-flow-layout",
					id: "criterios-inicio",
					tabIndex: -1,
					children: [/* @__PURE__ */ (0, Z.jsx)("ol", {
						className: "sv-home-steps",
						"aria-label": "Etapas da compra",
						children: Tx.map(({ label: t }, n) => /* @__PURE__ */ (0, Z.jsx)("li", { children: /* @__PURE__ */ (0, Z.jsxs)("button", {
							type: "button",
							"aria-controls": "sv-home-stage",
							"aria-pressed": n === e,
							onClick: () => i(n),
							children: [
								/* @__PURE__ */ (0, Z.jsx)("span", {
									className: "sv-home-step-index",
									"aria-hidden": "true",
									children: String(n + 1).padStart(2, "0")
								}),
								t,
								/* @__PURE__ */ (0, Z.jsx)(hg, {
									"aria-hidden": "true",
									size: 18
								})
							]
						}) }, t))
					}), /* @__PURE__ */ (0, Z.jsxs)("div", {
						className: "app-frame",
						id: "sv-home-stage",
						role: "group",
						"aria-label": "Exemplo de compra industrial",
						"data-visual": !0,
						children: [/* @__PURE__ */ (0, Z.jsxs)("div", {
							className: "sv-home-stage-top",
							children: [/* @__PURE__ */ (0, Z.jsx)("img", {
								src: "./src/assets/brand/raposa.svg",
								width: "22",
								height: "22",
								alt: ""
							}), /* @__PURE__ */ (0, Z.jsx)("span", { children: "Compra industrial" })]
						}), Tx.map(({ label: t, example: n, description: r }, i) => /* @__PURE__ */ (0, Z.jsxs)("div", {
							className: "sv-home-stage-record",
							"aria-hidden": i !== e,
							children: [/* @__PURE__ */ (0, Z.jsx)(Wb, { example: n }), /* @__PURE__ */ (0, Z.jsx)("p", { children: r })]
						}, t))]
					})]
				}),
				/* @__PURE__ */ (0, Z.jsxs)("div", {
					className: "sv-home-flow-links",
					children: [/* @__PURE__ */ (0, Z.jsxs)("div", {
						className: "sv-home-audiences",
						children: [/* @__PURE__ */ (0, Z.jsxs)("a", {
							className: "sv-home-link",
							href: Qg("compras"),
							children: ["Para compradores ", /* @__PURE__ */ (0, Z.jsx)(_g, {
								"aria-hidden": "true",
								size: 16
							})]
						}), /* @__PURE__ */ (0, Z.jsxs)("a", {
							className: "sv-home-link",
							href: Qg("fornecimento"),
							children: ["Para fornecedores ", /* @__PURE__ */ (0, Z.jsx)(_g, {
								"aria-hidden": "true",
								size: 16
							})]
						})]
					}), /* @__PURE__ */ (0, Z.jsxs)("a", {
						className: "sv-home-link",
						href: Qg("funcionamento"),
						children: ["Ver o fluxo completo ", /* @__PURE__ */ (0, Z.jsx)(_g, {
							"aria-hidden": "true",
							size: 18
						})]
					})]
				}),
				/* @__PURE__ */ (0, Z.jsx)("span", {
					className: "sv-home-stage-announcement",
					role: "status",
					children: n
				})
			]
		})
	});
}
function Mx() {
	let e = (0, y.useRef)(null);
	return $h(() => {
		let t = e.current, n = t?.parentElement;
		if (!t || !n) return;
		let r = qh.matchMedia();
		return r.add("(prefers-reduced-motion: no-preference)", () => {
			let e = window.matchMedia("(max-width: 760px)").matches, r = new AbortController(), i = t.querySelector(".sv-home-intro-art"), a = i?.querySelector(".sv-home-part-ground"), o = i?.querySelector("img");
			return i && a && o && qh.timeline({
				defaults: {
					ease: "power3.out",
					clearProps: "transform,opacity"
				},
				scrollTrigger: {
					trigger: i,
					start: "top 87%",
					once: !0,
					fastScrollEnd: !0
				}
			}).from(a, {
				scaleX: .22,
				opacity: .35,
				transformOrigin: "left center",
				duration: .86
			}, 0).from(o, {
				y: e ? 32 : 58,
				scale: .82,
				rotation: -5,
				opacity: .35,
				duration: 1
			}, .08), n.querySelectorAll(".sv-home-use-photo").forEach((t, n) => {
				let i = t.querySelector("img"), a = t.querySelector(".sv-home-photo-shutter");
				if (!i || !a) return;
				let o = qh.timeline({
					defaults: {
						ease: "power3.out",
						clearProps: "transform"
					},
					delay: e ? 0 : n * .13,
					scrollTrigger: {
						trigger: t,
						start: "top 89%",
						once: !0,
						fastScrollEnd: !0
					}
				}).from(i, {
					scale: 1.12,
					duration: 1
				}, 0).fromTo(a, { scaleX: 1 }, {
					scaleX: 0,
					ease: "power2.inOut",
					duration: .78
				}, 0);
				t.closest("a")?.addEventListener("focus", () => {
					o.progress(1);
				}, {
					once: !0,
					signal: r.signal
				});
			}), () => r.abort();
		}), () => r.revert();
	}, { scope: e }), /* @__PURE__ */ (0, Z.jsxs)(Z.Fragment, { children: [
		/* @__PURE__ */ (0, Z.jsx)("section", {
			ref: e,
			className: "sv-home-content sv-home-intro",
			"aria-labelledby": "explorar",
			children: /* @__PURE__ */ (0, Z.jsxs)("div", {
				className: "sv-shell sv-home-intro-grid",
				children: [/* @__PURE__ */ (0, Z.jsxs)("div", {
					className: "sv-home-intro-copy",
					children: [
						/* @__PURE__ */ (0, Z.jsx)(Ax, {
							id: "explorar",
							text: "Da necessidade de compra ao pedido entregue."
						}),
						/* @__PURE__ */ (0, Z.jsx)("p", { children: "O SIVI reúne quem compra e quem fornece para a indústria. Compradores publicam o que precisam, fornecedores enviam propostas e as duas empresas acompanham o pedido até o recebimento." }),
						/* @__PURE__ */ (0, Z.jsx)(o_, {
							className: "sv-home-body-action",
							href: Yg("about"),
							children: /* @__PURE__ */ (0, Z.jsx)("span", { children: "Conheça melhor a equipe por trás do SIVI" })
						})
					]
				}), /* @__PURE__ */ (0, Z.jsxs)("div", {
					className: "sv-home-intro-art",
					"aria-hidden": "true",
					children: [/* @__PURE__ */ (0, Z.jsx)("div", { className: "sv-home-part-ground" }), /* @__PURE__ */ (0, Z.jsx)("img", {
						src: "./assets/home-machined-part.webp",
						width: "1120",
						height: "1120",
						alt: "",
						loading: "lazy"
					})]
				})]
			})
		}),
		/* @__PURE__ */ (0, Z.jsx)(jx, {}),
		/* @__PURE__ */ (0, Z.jsx)("section", {
			className: "sv-home-content sv-home-uses",
			"aria-labelledby": "casos-inicio",
			children: /* @__PURE__ */ (0, Z.jsxs)("div", {
				className: "sv-shell",
				children: [/* @__PURE__ */ (0, Z.jsxs)("div", {
					className: "sv-home-section-head",
					children: [/* @__PURE__ */ (0, Z.jsxs)("div", { children: [/* @__PURE__ */ (0, Z.jsx)(Ax, {
						id: "casos-inicio",
						text: "Casos de compra industrial",
						animation: "flip"
					}), /* @__PURE__ */ (0, Z.jsx)("p", { children: "Veja como o SIVI organiza decisões e registros em exemplos de compras industriais." })] }), /* @__PURE__ */ (0, Z.jsxs)("a", {
						className: "sv-home-link",
						href: Qg("funcionamento"),
						children: ["Ver as etapas da compra ", /* @__PURE__ */ (0, Z.jsx)(_g, {
							"aria-hidden": "true",
							size: 18
						})]
					})]
				}), /* @__PURE__ */ (0, Z.jsx)("div", {
					className: "sv-home-use-grid",
					children: Ex.map(({ example: e, image: t, description: n }) => /* @__PURE__ */ (0, Z.jsxs)("article", { children: [/* @__PURE__ */ (0, Z.jsxs)("a", {
						className: "sv-home-use",
						href: $g(e.step),
						children: [/* @__PURE__ */ (0, Z.jsxs)("div", {
							className: "sv-home-use-photo",
							children: [/* @__PURE__ */ (0, Z.jsx)("img", {
								src: t,
								width: "1200",
								height: "800",
								alt: "",
								loading: "lazy"
							}), /* @__PURE__ */ (0, Z.jsx)("span", {
								className: "sv-home-photo-shutter",
								"aria-hidden": "true"
							})]
						}), /* @__PURE__ */ (0, Z.jsxs)("div", {
							className: "sv-home-use-title",
							children: [/* @__PURE__ */ (0, Z.jsx)("h3", { children: e.title }), /* @__PURE__ */ (0, Z.jsx)(_g, {
								"aria-hidden": "true",
								size: 21
							})]
						})]
					}), /* @__PURE__ */ (0, Z.jsx)("p", { children: n })] }, e.id))
				})]
			})
		}),
		/* @__PURE__ */ (0, Z.jsx)("section", {
			className: "sv-home-content sv-home-resources",
			"aria-labelledby": "recursos-inicio",
			children: /* @__PURE__ */ (0, Z.jsxs)("div", {
				className: "sv-shell sv-home-resources-grid",
				children: [/* @__PURE__ */ (0, Z.jsxs)("div", { children: [
					/* @__PURE__ */ (0, Z.jsx)("h2", {
						id: "recursos-inicio",
						tabIndex: -1,
						children: "Registros da compra"
					}),
					/* @__PURE__ */ (0, Z.jsx)("p", { children: "Do perfil do fornecedor à entrega, veja onde consultar as informações da compra." }),
					/* @__PURE__ */ (0, Z.jsx)("ul", {
						className: "sv-home-guides",
						id: "guias-inicio",
						tabIndex: -1,
						children: Ox.map(({ href: e, title: t }) => /* @__PURE__ */ (0, Z.jsx)("li", { children: /* @__PURE__ */ (0, Z.jsxs)("a", {
							className: "sv-home-link",
							href: e,
							children: [t, /* @__PURE__ */ (0, Z.jsx)(_g, {
								"aria-hidden": "true",
								size: 16
							})]
						}) }, e))
					})
				] }), /* @__PURE__ */ (0, Z.jsx)("div", {
					className: "sv-home-disclosures",
					id: "acordo-inicio",
					tabIndex: -1,
					children: Dx.map(({ step: e, title: t, description: n }) => /* @__PURE__ */ (0, Z.jsxs)("details", { children: [/* @__PURE__ */ (0, Z.jsxs)("summary", { children: [t, /* @__PURE__ */ (0, Z.jsx)(Cg, {
						"aria-hidden": "true",
						size: 20
					})] }), /* @__PURE__ */ (0, Z.jsxs)("div", { children: [/* @__PURE__ */ (0, Z.jsx)("p", { children: n }), /* @__PURE__ */ (0, Z.jsxs)("a", {
						className: "sv-home-link",
						href: $g(e),
						children: ["Ver na plataforma ", /* @__PURE__ */ (0, Z.jsx)(_g, {
							"aria-hidden": "true",
							size: 16
						})]
					})] })] }, e))
				})]
			})
		}),
		/* @__PURE__ */ (0, Z.jsx)("section", {
			className: "sv-home-content sv-home-start",
			"aria-labelledby": "comecar-title",
			children: /* @__PURE__ */ (0, Z.jsxs)("div", {
				className: "sv-shell",
				children: [/* @__PURE__ */ (0, Z.jsx)(Ax, {
					id: "comecar-title",
					text: "Sua empresa na rede industrial.",
					animation: "focus"
				}), /* @__PURE__ */ (0, Z.jsxs)("div", { children: [/* @__PURE__ */ (0, Z.jsx)("p", { children: "Cadastre sua empresa para comprar, fornecer ou atuar dos dois lados da plataforma." }), /* @__PURE__ */ (0, Z.jsx)(o_, {
					className: "sv-home-body-action",
					children: "Cadastrar empresa"
				})] })]
			})
		})
	] });
}
// src/public/landing-motion.ts
function Nx(e) {
	(0, y.useEffect)(() => {
		let t = e.current;
		if (!t) return;
		let n = window.matchMedia("(prefers-reduced-motion: reduce)"), r = t.querySelector(".sv-hero"), i = t.querySelector(".sv-header"), a = window.scrollY, o = 0;
		function s() {
			if (!t) return;
			if (o = 0, r && i) {
				let e = r.getBoundingClientRect().bottom <= i.getBoundingClientRect().bottom;
				t.toggleAttribute("data-header-solid", e);
				return;
			}
			let e = Math.max(0, window.scrollY), s = e > 72;
			t.toggleAttribute("data-header-solid", s), e <= 168 || n.matches ? (t.removeAttribute("data-header-hidden"), a = e) : Math.abs(e - a) >= 5 && (t.toggleAttribute("data-header-hidden", e > a), a = e);
		}
		function c() {
			o ||= requestAnimationFrame(s);
		}
		return c(), window.addEventListener("scroll", c, { passive: !0 }), r && window.addEventListener("resize", c), n.addEventListener("change", c), () => {
			cancelAnimationFrame(o), window.removeEventListener("scroll", c), r && window.removeEventListener("resize", c), n.removeEventListener("change", c);
		};
	}, [e]);
}
// src/public/public-layout.tsx
function Px({ page: e, lightHeader: t = !1, editorial: n = !1, children: r }) {
	let i = (0, y.useRef)(null);
	return Nx(i), /* @__PURE__ */ (0, Z.jsxs)("div", {
		className: "sv-landing",
		ref: i,
		"data-header-light": t || void 0,
		"data-home-opening": e === "home" || void 0,
		"data-public-editorial": n || void 0,
		children: [
			/* @__PURE__ */ (0, Z.jsx)(s_, {
				current: e,
				editorial: n
			}),
			/* @__PURE__ */ (0, Z.jsx)("main", {
				id: "conteudo",
				tabIndex: -1,
				children: r
			}),
			/* @__PURE__ */ (0, Z.jsx)(m_, {
				home: e === "home",
				editorial: n
			}),
			/* @__PURE__ */ (0, Z.jsx)(h_, { focusTitle: e !== "home" })
		]
	});
}
// src/public/home.tsx
var Fx = "./assets/home-industrial.webm", Ix = "./assets/home-industrial-poster.webp", Lx = "./assets/home-b2b.webm", Rx = "./assets/home-b2b-poster.webp", zx = "./assets/home-hero-opening.webp", Bx = "(prefers-reduced-motion: reduce)", Vx = !1, Hx = () => navigator.connection, Ux = () => window.matchMedia(Bx).matches || !!Hx()?.saveData;
function Wx() {
	let e = (0, y.useRef)(null), t = (0, y.useRef)(null), n = (0, y.useRef)(null), r = (0, y.useRef)(null), [i] = (0, y.useState)(() => {
		let e = new URLSearchParams(location.hash.split("?")[1]).get("secao");
		return !Vx && (!e || e === "topo");
	}), [a, o] = (0, y.useState)(Ux), [s, c] = (0, y.useState)(i && !a), [l, u] = (0, y.useState)(s ? "industrial" : "business"), [d, f] = (0, y.useState)(!1), [p, m] = (0, y.useState)(!1);
	return $h(() => {
		if (Vx = !0, !s || !t.current) return;
		let e = window.matchMedia("(max-width: 760px)").matches;
		qh.timeline({
			defaults: { ease: "power2.out" },
			onComplete: () => c(!1)
		}).fromTo(".sv-hero-opening-brand", {
			opacity: .72,
			y: 5
		}, {
			opacity: 0,
			y: -7,
			duration: .32
		}, 0).fromTo(".sv-hero-opening-photo", { scale: 1.035 }, {
			scale: 1,
			duration: .76
		}, 0).to(t.current, {
			opacity: 0,
			duration: .64
		}, .08).fromTo("h1 > span", {
			y: e ? 16 : 30,
			opacity: .68,
			clipPath: "inset(0 0 27% 0)"
		}, {
			y: 0,
			opacity: 1,
			clipPath: "inset(0 0 0% 0)",
			duration: .63,
			stagger: .12,
			ease: "power3.out"
		}, .04).fromTo(".sv-hero-description", {
			opacity: .8,
			y: 12
		}, {
			opacity: 1,
			y: 0,
			duration: .56
		}, .12);
	}, {
		scope: e,
		dependencies: [s],
		revertOnUpdate: !0
	}), (0, y.useEffect)(() => {
		let e = window.matchMedia(Bx), t = Hx(), n = () => {
			let e = Ux();
			o(e), e && (c(!1), u("business"));
		};
		return e.addEventListener("change", n), t?.addEventListener("change", n), () => {
			e.removeEventListener("change", n), t?.removeEventListener("change", n);
		};
	}, []), (0, y.useEffect)(() => {
		let t = e.current, i = r.current, o = l === "business" ? i : n.current;
		if (!t || !o || !i || a) return;
		let s = !0, c = !1, d = !1, f = () => {
			s && (document.hidden || !c || d ? o.pause() : o.error || o.ended ? l === "industrial" && u("business") : (o.hasAttribute("src") || (o.src = l === "business" ? Lx : Fx), o.play().catch((e) => {
				s && e.name !== "AbortError" && (d = !0, l === "industrial" ? u("business") : m(!1));
			})));
		}, p = new IntersectionObserver((e) => {
			c = e[0].intersectionRatio >= .15, f();
		}, { threshold: .15 });
		return p.observe(t), document.addEventListener("visibilitychange", f), () => {
			s = !1, p.disconnect(), document.removeEventListener("visibilitychange", f), o.pause();
		};
	}, [l, a]), /* @__PURE__ */ (0, Z.jsxs)("section", {
		ref: e,
		className: "sv-hero",
		"data-hero-phase": l,
		"data-hero-still": a || void 0,
		"aria-labelledby": "public-title",
		children: [/* @__PURE__ */ (0, Z.jsxs)("div", {
			className: "sv-hero-media",
			"aria-hidden": "true",
			children: [
				/* @__PURE__ */ (0, Z.jsx)("img", {
					src: Ix,
					alt: "",
					width: 1920,
					height: 1080
				}),
				/* @__PURE__ */ (0, Z.jsx)("video", {
					ref: n,
					className: "sv-hero-industrial-video",
					muted: !0,
					playsInline: !0,
					preload: "auto",
					"data-playing-frame": d || void 0,
					onPlaying: () => f(!0),
					onEnded: () => u("business"),
					onError: () => {
						f(!1), u((e) => e === "industrial" ? "business" : e);
					}
				}),
				/* @__PURE__ */ (0, Z.jsx)("img", {
					className: "sv-hero-business-poster",
					src: Rx,
					alt: "",
					width: 1920,
					height: 1080
				}),
				/* @__PURE__ */ (0, Z.jsx)("video", {
					ref: r,
					className: "sv-hero-business-video",
					muted: !0,
					playsInline: !0,
					loop: !0,
					preload: "auto",
					"data-playing-frame": p || void 0,
					onPlaying: () => m(!0),
					onError: () => m(!1)
				}),
				s && /* @__PURE__ */ (0, Z.jsxs)("div", {
					ref: t,
					className: "sv-hero-opening",
					children: [/* @__PURE__ */ (0, Z.jsx)("img", {
						className: "sv-hero-opening-photo",
						src: zx,
						width: 1600,
						height: 1200,
						alt: "",
						fetchPriority: "high",
						onLoad: (e) => e.currentTarget.setAttribute("data-ready", "")
					}), /* @__PURE__ */ (0, Z.jsxs)("div", {
						className: "sv-hero-opening-brand",
						children: [/* @__PURE__ */ (0, Z.jsx)("img", {
							src: "./src/assets/brand/raposa.svg",
							width: 96,
							height: 96,
							alt: ""
						}), /* @__PURE__ */ (0, Z.jsx)("span", { children: "SIVI" })]
					})]
				})
			]
		}), /* @__PURE__ */ (0, Z.jsx)("div", {
			className: "sv-shell sv-landing-hero",
			children: /* @__PURE__ */ (0, Z.jsxs)("div", {
				className: "sv-landing-lead",
				children: [
					/* @__PURE__ */ (0, Z.jsxs)("h1", {
						id: "public-title",
						tabIndex: -1,
						children: [
							/* @__PURE__ */ (0, Z.jsx)("span", { children: "A indústria" }),
							" ",
							/* @__PURE__ */ (0, Z.jsxs)("span", { children: ["se conecta", /* @__PURE__ */ (0, Z.jsx)("span", {
								className: "sv-hero-period",
								children: "."
							})] })
						]
					}),
					/* @__PURE__ */ (0, Z.jsx)("p", {
						className: "sv-hero-description",
						children: "Marketplace B2B de compras e fornecimento industrial, da cotação ao recebimento."
					}),
					/* @__PURE__ */ (0, Z.jsx)(o_, {
						className: "sv-hero-action",
						children: "Cadastrar empresa"
					})
				]
			})
		})]
	});
}
function Gx() {
	return /* @__PURE__ */ (0, Z.jsxs)(Px, {
		page: "home",
		children: [/* @__PURE__ */ (0, Z.jsx)(Wx, {}), /* @__PURE__ */ (0, Z.jsx)(Mx, {})]
	});
}
// src/public/platform.tsx
var Kx = {
	hidden: {},
	visible: { transition: { staggerChildren: .045 } }
}, qx = {
	hidden: {
		x: 15,
		opacity: 0,
		clipPath: "inset(0 0 30% 0)"
	},
	visible: {
		x: 0,
		opacity: 1,
		clipPath: "inset(0 0 0% 0)",
		transition: {
			duration: .38,
			ease: "easeOut"
		}
	},
	settled: {
		x: 0,
		opacity: 1,
		clipPath: "inset(0)",
		transition: { duration: 0 }
	}
}, Jx = [{
	id: "buyer",
	label: "Quero comprar",
	anchor: "compras",
	panelLabel: "Comprador"
}, {
	id: "supplier",
	label: "Quero fornecer",
	anchor: "fornecimento",
	panelLabel: "Fornecedor"
}], Yx = {
	demand: {
		label: "Demanda",
		status: "Publicada",
		buyer: {
			title: "Especifique os itens da compra.",
			description: "Publique os requisitos da peça e informe quando precisa recebê-la.",
			rows: [
				...Ub[0].fields,
				["Prazo desejado", "12 dias"],
				["Compatibilidade", "Confira os requisitos atendidos e os itens que ainda precisam de confirmação."]
			]
		},
		supplier: {
			title: "Confira se a demanda é compatível.",
			description: "Consulte os requisitos e compare o que foi pedido com o perfil industrial da sua empresa.",
			rows: [...Ub[0].fields, ["Compatibilidade", "O material e a usinagem constam no perfil. Confirme a disponibilidade para o prazo."]]
		}
	},
	proposals: {
		label: "Propostas",
		status: "Em cotação",
		buyer: {
			title: "Compare as condições da compra.",
			description: "Confira preço, prazo, frete e pagamento. As versões anteriores ficam disponíveis no histórico.",
			rows: [
				["Proposta A", "R$ 4.800 · 12 dias · frete a combinar"],
				["Proposta B", "R$ 5.280 · 8 dias · frete incluso"],
				["Versão da proposta B", "2 · pagamento em 30 dias"]
			]
		},
		supplier: {
			title: "Envie suas condições de fornecimento.",
			description: "Registre uma proposta por item. Se as condições mudarem, envie uma nova versão.",
			rows: [
				["Proposta", "B · versão 2"],
				["Valor", "R$ 5.280"],
				["Prazo, frete e pagamento", "8 dias · frete incluso · 30 dias"]
			]
		}
	},
	order: {
		label: "Pedido",
		status: "Aceito",
		buyer: {
			title: "Consulte o que foi aceito.",
			description: "O aceite da proposta gera um pedido com os itens e as condições daquela versão.",
			rows: [
				["Origem", "Proposta B · versão 2"],
				["Itens", "240 peças em alumínio 6061"],
				["Condições aceitas", "R$ 5.280 · 8 dias · frete incluso · pagamento em 30 dias"]
			]
		},
		supplier: {
			title: "Execute o fornecimento pelo pedido.",
			description: "Use a versão aceita como referência para preparar os itens e acompanhar as próximas ações.",
			rows: [
				["Origem", "Proposta B · versão 2"],
				["Itens", "240 peças em alumínio 6061"],
				["Condições aceitas", "R$ 5.280 · 8 dias · frete incluso · pagamento em 30 dias"]
			]
		}
	},
	inspection: {
		label: "Inspeção e expedição",
		status: "Expedido",
		buyer: {
			title: "Acompanhe a inspeção e a expedição.",
			description: "Consulte a liberação das peças e o registro de saída no histórico do pedido.",
			rows: [
				["Inspeção", "240 de 240 peças aprovadas"],
				["Evidências", "Resultado da inspeção por item"],
				["Expedição", "Registrada após a liberação"]
			]
		},
		supplier: {
			title: "Registre a qualidade e a saída.",
			description: "Informe a inspeção por item e registre a expedição quando o pedido estiver liberado.",
			rows: [
				["Inspeção", "Plano, evidências e 240 peças aprovadas"],
				["Liberação", "Pedido liberado para expedição"],
				["Expedição", "Saída registrada pelo fornecedor"]
			]
		}
	},
	receipt: {
		label: "Recebimento",
		status: "Recebido",
		buyer: {
			title: "Confirme que o pedido chegou.",
			description: "Registre o recebimento e, se desejar, avalie o fornecimento.",
			rows: [
				["Recebimento", "240 peças recebidas"],
				["Confirmação", "Registrada pelo comprador"],
				["Histórico", "O pedido permanece disponível para consulta"]
			]
		},
		supplier: {
			title: "Confira a confirmação do comprador.",
			description: "Acompanhe a conclusão do pedido e consulte a avaliação quando estiver disponível.",
			rows: [
				["Recebimento", "240 peças recebidas"],
				["Confirmação", "Registrada pelo comprador"],
				["Histórico", "Expedição, recebimento e avaliação vinculados ao pedido"]
			]
		}
	}
}, Xx = [
	"demand",
	"demand",
	"proposals",
	"order",
	"inspection",
	"inspection",
	"receipt"
], Zx = Object.keys(Yx);
function Qx(e) {
	let t = Number(e.get("etapa"));
	return {
		role: e.get("secao") === "fornecimento" ? "supplier" : "buyer",
		step: Number.isInteger(t) ? Xx[t - 1] ?? "demand" : "demand"
	};
}
function $x() {
	let [e, t] = (0, y.useState)(() => Qx(new URLSearchParams(location.hash.split("?")[1]))), n = (0, y.useRef)(null), r = Iu(n, {
		once: !0,
		margin: "0px 0px -8% 0px"
	}), i = Nu(), a = Yx[e.step], o = a[e.role], s = Jx.find(({ id: t }) => t === e.role)?.panelLabel;
	return /* @__PURE__ */ (0, Z.jsxs)(Px, {
		page: "platform",
		lightHeader: !0,
		editorial: !0,
		children: [/* @__PURE__ */ (0, Z.jsxs)("section", {
			className: "sv-shell sv-editorial-intro sv-editorial-platform",
			"aria-labelledby": "public-title",
			children: [/* @__PURE__ */ (0, Z.jsxs)("div", { children: [
				/* @__PURE__ */ (0, Z.jsx)(wx, {
					id: "public-title",
					className: "sv-editorial-title",
					tag: "h1",
					tabIndex: -1,
					text: "Uma compra industrial, da demanda ao recebimento",
					textAlign: "start",
					trigger: "load",
					splitType: "words, chars",
					duration: .78,
					delay: 16,
					from: {
						opacity: 0,
						yPercent: 62,
						rotationX: -48,
						transformPerspective: 480,
						transformOrigin: "50% 100%"
					},
					to: {
						opacity: 1,
						yPercent: 0,
						rotationX: 0
					}
				}),
				/* @__PURE__ */ (0, Z.jsx)(wx, {
					className: "sv-editorial-lead",
					textAlign: "start",
					trigger: "load",
					splitType: "lines",
					text: "Explore a mesma negociação pelos dois lados e veja o que cada empresa faz em cada etapa.",
					effect: "fade",
					startDelay: .26,
					duration: .58,
					delay: 80
				}),
				/* @__PURE__ */ (0, Z.jsx)("div", {
					className: "sv-purchase-preview-roles",
					role: "group",
					"aria-label": "Perspectiva da compra",
					children: Jx.map(({ id: n, label: r, anchor: i }) => /* @__PURE__ */ (0, Z.jsx)("button", {
						id: i,
						type: "button",
						"aria-pressed": e.role === n,
						"aria-controls": "registro-de-compra",
						onClick: () => t((e) => ({
							...e,
							role: n
						})),
						children: r
					}, n))
				}),
				/* @__PURE__ */ (0, Z.jsx)(o_, {
					className: "sv-editorial-action",
					href: t_(e.role),
					children: "Cadastrar empresa"
				})
			] }), /* @__PURE__ */ (0, Z.jsxs)("section", {
				id: "funcionamento",
				className: "sv-editorial-demo",
				"aria-label": "Etapas da demonstração",
				tabIndex: -1,
				children: [
					/* @__PURE__ */ (0, Z.jsxs)("div", {
						className: "sv-purchase-preview-bar",
						children: [/* @__PURE__ */ (0, Z.jsx)("strong", { children: "Exemplo de compra" }), /* @__PURE__ */ (0, Z.jsx)("span", { children: s })]
					}),
					/* @__PURE__ */ (0, Z.jsx)("div", {
						className: "sv-purchase-preview-steps",
						role: "group",
						"aria-label": "Etapas da compra",
						children: Zx.map((n, r) => /* @__PURE__ */ (0, Z.jsxs)("button", {
							type: "button",
							"aria-pressed": e.step === n,
							"aria-controls": "registro-de-compra",
							onClick: () => t((e) => ({
								...e,
								step: n
							})),
							children: [/* @__PURE__ */ (0, Z.jsx)("span", {
								"aria-hidden": "true",
								children: String(r + 1).padStart(2, "0")
							}), Yx[n].label]
						}, n))
					}),
					/* @__PURE__ */ (0, Z.jsx)("div", {
						ref: n,
						id: "registro-de-compra",
						className: "sv-purchase-preview-record",
						"data-demo-step": e.step,
						"data-demo-role": e.role,
						"aria-live": "polite",
						children: /* @__PURE__ */ (0, Z.jsxs)(zu.div, {
							initial: !i && "hidden",
							animate: i ? "settled" : r ? "visible" : "hidden",
							variants: Kx,
							children: [
								/* @__PURE__ */ (0, Z.jsx)(zu.p, {
									className: "sv-purchase-preview-status",
									variants: qx,
									children: a.status
								}),
								/* @__PURE__ */ (0, Z.jsx)(zu.h2, {
									variants: qx,
									children: o.title
								}),
								/* @__PURE__ */ (0, Z.jsx)(zu.p, {
									className: "sv-purchase-preview-description",
									variants: qx,
									children: o.description
								}),
								/* @__PURE__ */ (0, Z.jsx)("dl", { children: o.rows.map(([e, t]) => /* @__PURE__ */ (0, Z.jsxs)(zu.div, {
									variants: qx,
									children: [/* @__PURE__ */ (0, Z.jsx)("dt", { children: e }), /* @__PURE__ */ (0, Z.jsx)("dd", { children: t })]
								}, e)) })
							]
						}, e.role + e.step)
					})
				]
			})]
		}), /* @__PURE__ */ (0, Z.jsx)("section", {
			className: "sv-editorial-section sv-editorial-story",
			"aria-labelledby": "proximo-passo",
			children: /* @__PURE__ */ (0, Z.jsxs)("div", {
				className: "sv-shell sv-editorial-close sv-platform-next",
				children: [/* @__PURE__ */ (0, Z.jsxs)("div", {
					className: "sv-editorial-copy",
					children: [/* @__PURE__ */ (0, Z.jsx)(wx, {
						id: "proximo-passo",
						className: "sv-editorial-subtitle",
						tag: "h2",
						textAlign: "start",
						splitType: "lines",
						mask: !0,
						text: "Da conta à primeira negociação.",
						duration: .84,
						delay: 110,
						threshold: .14,
						rootMargin: "0px",
						from: {
							xPercent: -35,
							opacity: 0
						},
						to: {
							xPercent: 0,
							opacity: 1
						}
					}), /* @__PURE__ */ (0, Z.jsx)(wx, {
						textAlign: "start",
						splitType: "lines",
						effect: "blur",
						startDelay: .16,
						duration: .7,
						delay: 72,
						text: "Crie seu acesso, confirme o e-mail e envie os dados da empresa para análise. A atuação escolhida define o que sua empresa pode fazer na plataforma."
					})]
				}), /* @__PURE__ */ (0, Z.jsxs)("a", {
					className: "sv-editorial-link",
					href: Yg("faq"),
					children: ["Consultar perguntas frequentes ", /* @__PURE__ */ (0, Z.jsx)(i_, {})]
				})]
			})
		})]
	});
}
// src/public/site-pages.tsx
qh.registerPlugin(Nb);
function eS() {
	let e = (0, y.useRef)(null), t = (0, y.useRef)(null), n = (0, y.useRef)(null);
	return $h(() => {
		let r = t.current;
		if (!r) return;
		let i = qh.matchMedia();
		return i.add("(prefers-reduced-motion: no-preference)", () => {
			e.current && qh.fromTo(e.current, { clipPath: "inset(4% 0 96% 0 round 14px)" }, {
				clipPath: "inset(0% 0 0% 0 round 14px)",
				delay: .17,
				duration: 1,
				ease: "power3.inOut",
				clearProps: "clipPath"
			}), qh.timeline({
				defaults: { ease: "power3.out" },
				scrollTrigger: {
					trigger: r,
					start: "top 87%",
					once: !0,
					fastScrollEnd: !0
				}
			}).fromTo(r, { clipPath: "inset(0 100% 0 0 round 14px)" }, {
				clipPath: "inset(0 0% 0 0 round 14px)",
				duration: 1.05,
				clearProps: "clipPath"
			}).from(n.current?.querySelectorAll("p") ?? [], {
				y: 24,
				opacity: .1,
				duration: .68,
				stagger: .13,
				clearProps: "transform,opacity"
			}, .26);
		}), () => i.revert();
	}, { scope: t }), /* @__PURE__ */ (0, Z.jsxs)(Px, {
		page: "about",
		lightHeader: !0,
		editorial: !0,
		children: [
			/* @__PURE__ */ (0, Z.jsxs)("section", {
				className: "sv-shell sv-editorial-intro sv-editorial-about",
				"aria-labelledby": "public-title",
				children: [/* @__PURE__ */ (0, Z.jsxs)("div", { children: [/* @__PURE__ */ (0, Z.jsx)(wx, {
					id: "public-title",
					className: "sv-editorial-title",
					tag: "h1",
					tabIndex: -1,
					text: "Por que o SIVI existe",
					textAlign: "start",
					trigger: "load",
					splitType: "lines",
					mask: !0,
					from: {
						yPercent: 112,
						opacity: 0
					},
					to: {
						yPercent: 0,
						opacity: 1
					},
					duration: .87,
					delay: 125
				}), /* @__PURE__ */ (0, Z.jsx)(wx, {
					className: "sv-editorial-lead",
					textAlign: "start",
					trigger: "load",
					splitType: "lines",
					mask: !0,
					text: "O SIVI aproxima quem precisa comprar de quem pode fornecer para a indústria e registra cada etapa da negociação.",
					from: {
						yPercent: 60,
						opacity: 0
					},
					to: {
						yPercent: 0,
						opacity: 1
					},
					startDelay: .23,
					duration: .67,
					delay: 65
				})] }), /* @__PURE__ */ (0, Z.jsx)("figure", {
					ref: e,
					className: "sv-editorial-photo",
					children: /* @__PURE__ */ (0, Z.jsx)("img", {
						src: "./assets/operador-torno.jpg",
						alt: "Operador conferindo uma peça no torno de uma oficina",
						width: "1920",
						height: "1280",
						fetchPriority: "high"
					})
				})]
			}),
			/* @__PURE__ */ (0, Z.jsx)("section", {
				className: "sv-editorial-section sv-editorial-story",
				"aria-labelledby": "visao-geral",
				children: /* @__PURE__ */ (0, Z.jsxs)("div", {
					className: "sv-shell sv-editorial-story-grid",
					children: [/* @__PURE__ */ (0, Z.jsx)("figure", {
						ref: t,
						className: "sv-editorial-photo",
						children: /* @__PURE__ */ (0, Z.jsx)("img", {
							src: "./assets/detalhe-torno.jpg",
							alt: "Detalhe do comando de uma máquina de usinagem",
							width: "1920",
							height: "1280",
							loading: "lazy"
						})
					}), /* @__PURE__ */ (0, Z.jsxs)("div", {
						ref: n,
						className: "sv-editorial-copy",
						children: [
							/* @__PURE__ */ (0, Z.jsx)(wx, {
								id: "visao-geral",
								className: "sv-editorial-subtitle",
								tag: "h2",
								tabIndex: -1,
								text: "O que foi combinado fica no pedido.",
								textAlign: "start",
								splitType: "words",
								effect: "skew",
								duration: .78,
								delay: 86,
								threshold: .12,
								rootMargin: "0px"
							}),
							/* @__PURE__ */ (0, Z.jsx)("p", { children: "Num pedido industrial, material, medidas, prazo e condições precisam estar claros para as duas empresas. Se a cotação muda, é preciso identificar qual versão foi aceita." }),
							/* @__PURE__ */ (0, Z.jsx)("p", { children: "O SIVI reúne os requisitos, as propostas e o pedido no mesmo histórico. Quem fornece registra a inspeção e a expedição. Quem compra confirma o recebimento." })
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, Z.jsxs)("section", {
				className: "sv-shell sv-editorial-close",
				"aria-labelledby": "sobre-plataforma",
				children: [/* @__PURE__ */ (0, Z.jsx)(wx, {
					id: "sobre-plataforma",
					className: "sv-editorial-subtitle",
					tag: "h2",
					text: "Uma compra vista pelos dois lados.",
					textAlign: "start",
					splitType: "lines",
					effect: "blur",
					duration: .73,
					delay: 95,
					threshold: .13,
					rootMargin: "0px"
				}), /* @__PURE__ */ (0, Z.jsx)(o_, {
					className: "sv-editorial-action",
					href: Yg("platform"),
					children: "Ver como o SIVI funciona"
				})]
			})
		]
	});
}
var tS = [
	{
		id: "duvidas-cadastro",
		title: "Conta e cadastro",
		questions: [
			{
				question: "Quem pode usar o SIVI?",
				answer: "Responsáveis por empresas compradoras ou fornecedoras no setor industrial. Uma mesma empresa pode solicitar as duas atuações."
			},
			{
				question: "Quais dados preciso informar no cadastro?",
				answer: "Para criar a conta, informe nome, sobrenome, e-mail e senha. Na etapa da empresa, informe nome, CNPJ, cidade, UF, telefone ou e-mail de contato e a atuação desejada."
			},
			{
				question: "O que acontece depois de criar a conta?",
				answer: "Confirme o e-mail, entre no SIVI e revise os dados empresariais para enviar à análise. Se houver solicitação de correção, consulte o motivo em Empresas e atuação antes de reenviar.",
				link: {
					label: "Ver orientações de acesso",
					href: e_("ajuda")
				}
			},
			{
				question: "Como recupero minha senha?",
				answer: "Na tela de acesso, selecione Esqueci minha senha e informe o e-mail cadastrado. Confira também a caixa de spam.",
				link: {
					label: "Abrir a tela de acesso",
					href: "#/acesso?modo=login"
				}
			}
		]
	},
	{
		id: "duvidas-compras",
		title: "Compras",
		questions: [{
			question: "Como encontro fornecedores compatíveis?",
			answer: "Compare os requisitos da demanda com o perfil industrial dos fornecedores. O SIVI indica os critérios compatíveis e os que ainda precisam de confirmação.",
			link: {
				label: "Ver a perspectiva de compras",
				href: Qg("compras")
			}
		}, {
			question: "Como comparo propostas para a mesma demanda?",
			answer: "Compare as condições registradas, como preço, prazo, frete e pagamento. Ao aceitar uma proposta, a versão escolhida dá origem ao pedido.",
			link: {
				label: "Explorar a comparação de propostas",
				href: $g(3)
			}
		}]
	},
	{
		id: "duvidas-fornecimento",
		title: "Fornecimento",
		questions: [{
			question: "O que posso informar no perfil da empresa?",
			answer: "Registre materiais, processos industriais e regiões atendidas. Essas informações ajudam a identificar demandas que correspondem ao que sua empresa oferece.",
			link: {
				label: "Ver a perspectiva de fornecimento",
				href: Qg("fornecimento")
			}
		}, {
			question: "Posso revisar uma proposta enviada?",
			answer: "Sim. Uma revisão registra uma nova versão com as condições atualizadas. A versão anterior continua disponível para consulta."
		}]
	},
	{
		id: "duvidas-pedidos",
		title: "Pedidos e inspeção",
		questions: [
			{
				question: "Quais condições ficam registradas no pedido?",
				answer: "O pedido preserva os itens e as condições da proposta aceita. As duas empresas podem consultar esse histórico de acordo com suas permissões."
			},
			{
				question: "Quem registra a inspeção e a expedição?",
				answer: "O fornecedor registra a inspeção por item, com evidências e quantidades aprovadas. Depois da liberação, pode registrar a expedição.",
				link: {
					label: "Ver um exemplo de inspeção",
					href: $g(5)
				}
			},
			{
				question: "Quem confirma o recebimento?",
				answer: "O comprador confirma que o pedido chegou e pode avaliar o fornecimento. O fornecedor acompanha a confirmação pelo pedido."
			},
			{
				question: "Como são combinados a entrega e o pagamento?",
				answer: "Comprador e fornecedor acertam entre si as condições de entrega e de pagamento. O SIVI registra o que foi acordado na proposta aceita."
			}
		]
	}
];
function nS() {
	return /* @__PURE__ */ (0, Z.jsx)(Px, {
		page: "faq",
		lightHeader: !0,
		editorial: !0,
		children: /* @__PURE__ */ (0, Z.jsxs)("section", {
			className: "sv-shell sv-editorial-intro sv-editorial-faq",
			"aria-labelledby": "public-title",
			children: [/* @__PURE__ */ (0, Z.jsxs)("header", {
				id: "duvidas",
				tabIndex: -1,
				className: "sv-faq-intro",
				children: [/* @__PURE__ */ (0, Z.jsx)("h1", {
					id: "public-title",
					className: "sv-editorial-title",
					tabIndex: -1,
					children: "Perguntas frequentes"
				}), /* @__PURE__ */ (0, Z.jsx)("p", {
					className: "sv-editorial-lead",
					children: "Da criação da conta à confirmação do recebimento."
				})]
			}), /* @__PURE__ */ (0, Z.jsxs)("div", {
				className: "sv-faq-layout",
				children: [/* @__PURE__ */ (0, Z.jsx)("nav", {
					className: "sv-faq-index",
					"aria-label": "Assuntos das perguntas frequentes",
					children: tS.map(({ id: e, title: t }) => /* @__PURE__ */ (0, Z.jsx)("a", {
						href: Xg("faq", e),
						children: t
					}, e))
				}), /* @__PURE__ */ (0, Z.jsx)("div", {
					className: "sv-faq-answers",
					children: tS.map(({ id: e, title: t, questions: n }) => /* @__PURE__ */ (0, Z.jsxs)("section", {
						"aria-labelledby": e,
						children: [/* @__PURE__ */ (0, Z.jsx)("h2", {
							id: e,
							tabIndex: -1,
							children: t
						}), n.map(({ question: e, answer: t, link: n }) => /* @__PURE__ */ (0, Z.jsxs)("details", { children: [/* @__PURE__ */ (0, Z.jsxs)("summary", { children: [e, /* @__PURE__ */ (0, Z.jsx)(Vg, {
							size: 18,
							"aria-hidden": "true"
						})] }), /* @__PURE__ */ (0, Z.jsxs)("div", {
							className: "sv-faq-answer",
							children: [/* @__PURE__ */ (0, Z.jsx)("p", { children: t }), n && /* @__PURE__ */ (0, Z.jsxs)("a", {
								className: "sv-editorial-link",
								href: n.href,
								children: [
									n.label,
									" ",
									/* @__PURE__ */ (0, Z.jsx)(i_, {})
								]
							})]
						})] }, e))]
					}, e))
				})]
			})]
		})
	});
}
// src/public/information.tsx
var rS = {
	privacidade: {
		title: "Política de privacidade",
		intro: "Esta política explica quais dados são usados para criar sua conta, cadastrar sua empresa e registrar negociações no SIVI.",
		sections: [
			["Conta e autenticação", "Nome, sobrenome, e-mail e credenciais são usados para criar e acessar a conta com Firebase Authentication. A senha é encaminhada ao serviço de autenticação; não integra o rascunho empresarial salvo no navegador."],
			["Dados empresariais e negociações", "Nome da empresa, CNPJ, cidade, UF, contato e atuação compõem o cadastro para análise. Demandas, propostas, pedidos e seus registros são armazenados no Firebase Realtime Database e disponibilizados conforme as permissões e a relação comercial."],
			["Armazenamento no navegador", "O cadastro integrado pode salvar um rascunho empresarial neste navegador por até sete dias, associado à conta. Ele permite retomar a revisão após confirmar o e-mail. Preferências de aparência e contexto também usam armazenamento local ou de sessão. Não há publicidade ou analytics adicionados nesta repaginação."],
			["Responsável e atendimento", "Esta apresentação usa SIVI Tecnologia, São Paulo/SP, e CNPJ 00.000.000/0000-00 como identificação fictícia. contato@sivi.example é somente um exemplo, sem atendimento. Não há canal real para solicitações de dados configurado nesta versão. Antes de operação comercial, o responsável e esse canal precisam ser substituídos por dados reais."]
		]
	},
	condicoes: {
		title: "Condições de uso",
		intro: "Estas condições explicam como usar a versão demonstrativa do SIVI e quais são as responsabilidades de quem compra e de quem fornece.",
		sections: [
			["O papel da plataforma", "O SIVI organiza o relacionamento e os registros comerciais entre empresas. Não fabrica, transporta nem processa o pagamento dos produtos negociados. Capacidade, requisitos, frete, prazos e pagamento devem ser verificados e acordados pelos participantes."],
			["Conta e cadastro empresarial", "A conclusão do formulário cria uma conta real. O acesso operacional requer confirmação de e-mail e análise da empresa. Informe dados corretos de uma empresa que você está autorizado a representar; não use o CNPJ fictício do SIVI como identificação de uma empresa real."],
			["Planos e ausência de cobrança", "Os valores exibidos são uma proposta de oferta comercial. Nesta versão não existe assinatura financeira ativa, débito, renovação automática, fatura ou captura de pagamento. Os planos não estabelecem limites financeiros de acesso implementados. Não há contratação paga pelo envio do formulário."],
			["Responsabilidades dos participantes", "Revise as especificações e condições antes de aceitar propostas. Mantenha as informações de capacidade atualizadas. Registre inspeção, expedição e recebimento conforme os fatos. Não apresente dados de terceiros sem autorização nem compartilhe sua conta."],
			["Identidade demonstrativa", "SIVI Tecnologia, o CNPJ fictício 00.000.000/0000-00 e o e-mail contato@sivi.example são dados de apresentação, sem registro ou atendimento declarado. Estas condições descrevem o produto atual; a operação comercial exige a identificação real do responsável e a formalização das condições comerciais."]
		]
	}
}, iS = {
	sobre: {
		eyebrow: "Sobre o SIVI",
		title: "A indústria se move por boas conexões.",
		intro: "O SIVI aproxima a necessidade de quem compra da capacidade de quem fornece. E mantém cada acordo registrado ao longo do caminho.",
		sections: [
			["O que fazemos", "Somos uma plataforma B2B para organizar demandas industriais, avaliar compatibilidade, comparar propostas e acompanhar pedidos, inspeção, expedição, recebimento e avaliação."],
			["Para quem existe", "Empresas que compram itens industriais e empresas que fornecem materiais, processos ou serviços descritos nas demandas. Uma mesma empresa pode atuar nos dois lados."],
			["Onde começa a confiança", "Requisitos claros, versões das propostas e condições aceitas consultáveis. O cadastro empresarial passa por análise; isso não constitui certificação técnica nem garantia sobre a capacidade declarada."],
			["Quem apresenta esta versão", "SIVI Tecnologia · São Paulo/SP. Identidade demonstrativa definida para esta apresentação. CNPJ fictício: 00.000.000/0000-00. O nome e o documento não representam pessoa jurídica registrada."]
		]
	},
	seguranca: {
		eyebrow: "Segurança e dados",
		title: "Cada acesso tem seu contexto.",
		intro: "Conta pessoal, empresa e atuação são etapas diferentes. Entenda como isso se conecta no SIVI.",
		sections: [
			["Confirmação do e-mail", "A conta usa Firebase Authentication. Antes de solicitar o cadastro da empresa, confirme o endereço pelo link enviado ao seu e-mail. Não compartilhe senha ou links de confirmação."],
			["Análise empresarial", "O cadastro entra em análise administrativa. Quando houver correção solicitada, consulte a justificativa e reenvie. As permissões operacionais dependem da empresa, da atuação e da situação do cadastro."],
			["Limites claros", "A análise cadastral não substitui a diligência comercial e técnica entre empresas. O SIVI não anuncia certificações de segurança, garantia de entrega ou garantia de fornecimento que não tenham sido comprovadas."]
		]
	},
	ajuda: {
		eyebrow: "Ajuda e acesso",
		title: "Um caminho claro para começar.",
		intro: "Orientações para criar sua conta, confirmar o e-mail e acompanhar a empresa.",
		sections: [
			["1. Escolha a sua atuação", "Compras para publicar demandas e comparar propostas; Fornecimento para apresentar capacidade e enviar condições; Integrado para os dois lados. A seleção aparece no cadastro e pode ser revista antes de criar a conta."],
			["2. Conclua o cadastro", "Preencha seus dados e os da empresa. Depois, leia as condições de uso e selecione Criar conta."],
			["3. Confirme o e-mail", "Procure a mensagem de verificação, inclusive em spam. Abra o link e depois entre na conta. Uma tentativa de entrar com e-mail ainda não confirmado pode reenviar a verificação."],
			["4. Revise a empresa", "No mesmo navegador, os dados empresariais podem ser retomados por até sete dias. Revise e envie para análise. Se o rascunho não estiver disponível, apresente a empresa no contexto da sua conta."],
			["5. Acompanhe a análise", "Em Empresas e atuação, consulte o cadastro e use Atualizar situação. Se houver pedido de correção, leia o motivo, ajuste e reenvie. O acesso comercial é liberado após aprovação."],
			["Esqueceu a senha?", "Na página Entrar, informe o e-mail e use Esqueci minha senha. Por segurança, o retorno não confirma se o endereço possui conta. Procure a mensagem na caixa de entrada e em spam."],
			["Precisa de atendimento?", "O contato@sivi.example exibido nesta apresentação é fictício e não recebe mensagens. Esta página oferece as orientações disponíveis; um canal real de atendimento ainda precisa ser configurado."]
		]
	},
	creditos: {
		eyebrow: "Créditos",
		title: "Indústria real, em cada imagem.",
		intro: "As fotografias e o vídeo utilizados nesta apresentação foram produzidos por pessoas, com origem identificada.",
		sections: []
	}
};
function aS({ page: e }) {
	let { title: t, intro: n, sections: r } = rS[e], i = e === "privacidade" ? "condicoes" : "privacidade";
	return /* @__PURE__ */ (0, Z.jsxs)("div", {
		className: "sv-legal-document",
		children: [
			/* @__PURE__ */ (0, Z.jsx)(s_, {}),
			/* @__PURE__ */ (0, Z.jsxs)("main", {
				id: "conteudo",
				tabIndex: -1,
				children: [/* @__PURE__ */ (0, Z.jsxs)("header", {
					className: "sv-legal-heading",
					children: [/* @__PURE__ */ (0, Z.jsx)("h1", {
						id: "public-title",
						tabIndex: -1,
						children: t
					}), /* @__PURE__ */ (0, Z.jsxs)("p", { children: ["Última atualização em ", /* @__PURE__ */ (0, Z.jsx)("time", {
						dateTime: "2026-10-23",
						children: "23 de outubro de 2026"
					})] })]
				}), /* @__PURE__ */ (0, Z.jsxs)("div", {
					className: "sv-legal-reading",
					children: [/* @__PURE__ */ (0, Z.jsx)("p", { children: n }), r.map(([e, t], n) => /* @__PURE__ */ (0, Z.jsxs)("section", { children: [/* @__PURE__ */ (0, Z.jsxs)("h2", {
						id: `info-${n}`,
						tabIndex: -1,
						children: [
							n + 1,
							". ",
							e
						]
					}), /* @__PURE__ */ (0, Z.jsx)("p", { children: t })] }, e))]
				})]
			}),
			/* @__PURE__ */ (0, Z.jsx)("footer", {
				className: "sv-legal-footer",
				children: /* @__PURE__ */ (0, Z.jsx)("a", {
					href: e_(i),
					children: rS[i].title
				})
			}),
			/* @__PURE__ */ (0, Z.jsx)(h_, {})
		]
	});
}
function oS({ page: e }) {
	if (e === "privacidade" || e === "condicoes") return /* @__PURE__ */ (0, Z.jsx)(aS, { page: e });
	let t = iS[e] ?? iS.sobre;
	return /* @__PURE__ */ (0, Z.jsxs)(Z.Fragment, { children: [
		/* @__PURE__ */ (0, Z.jsx)(s_, {}),
		/* @__PURE__ */ (0, Z.jsxs)("main", {
			id: "conteudo",
			className: "sv-information sv-shell",
			tabIndex: -1,
			children: [
				/* @__PURE__ */ (0, Z.jsx)("a", {
					className: "sv-back",
					href: "#/",
					children: "← Voltar à página inicial"
				}),
				/* @__PURE__ */ (0, Z.jsx)("p", {
					className: "sv-eyebrow",
					children: t.eyebrow
				}),
				/* @__PURE__ */ (0, Z.jsx)("h1", {
					id: "public-title",
					tabIndex: -1,
					children: t.title
				}),
				/* @__PURE__ */ (0, Z.jsx)("p", {
					className: "sv-information-intro",
					children: t.intro
				}),
				/* @__PURE__ */ (0, Z.jsxs)("div", {
					className: "sv-information-grid",
					children: [/* @__PURE__ */ (0, Z.jsxs)("aside", { children: [
						/* @__PURE__ */ (0, Z.jsx)("span", { children: "Nesta página" }),
						t.sections.map(([t], n) => /* @__PURE__ */ (0, Z.jsx)("a", {
							href: `#/?pagina=${e}&secao=info-${n}`,
							children: t
						}, t)),
						/* @__PURE__ */ (0, Z.jsxs)("a", {
							href: e_("ajuda"),
							children: ["Ajuda e acesso ", /* @__PURE__ */ (0, Z.jsx)(i_, {})]
						})
					] }), /* @__PURE__ */ (0, Z.jsxs)("div", { children: [t.sections.map(([e, t], n) => /* @__PURE__ */ (0, Z.jsxs)("section", { children: [/* @__PURE__ */ (0, Z.jsx)("h2", {
						id: `info-${n}`,
						tabIndex: -1,
						children: e
					}), /* @__PURE__ */ (0, Z.jsx)("p", { children: t })] }, e)), e === "creditos" && /* @__PURE__ */ (0, Z.jsxs)(Z.Fragment, { children: [
						/* @__PURE__ */ (0, Z.jsxs)("section", { children: [
							/* @__PURE__ */ (0, Z.jsx)("h2", { children: "Vídeo: CNC lathe" }),
							/* @__PURE__ */ (0, Z.jsx)("p", { children: "Vandurit inserti, via Wikimedia Commons. Licença CC BY 3.0. Vídeo recortado e apresentado sem áudio." }),
							/* @__PURE__ */ (0, Z.jsxs)("a", {
								href: "https://commons.wikimedia.org/wiki/File:CNC_lathe.webm",
								target: "_blank",
								rel: "noreferrer",
								children: ["Ver vídeo e autoria ", /* @__PURE__ */ (0, Z.jsx)(i_, {})]
							}),
							" ",
							"·",
							" ",
							/* @__PURE__ */ (0, Z.jsxs)("a", {
								href: "https://creativecommons.org/licenses/by/3.0/",
								target: "_blank",
								rel: "noreferrer",
								children: ["Licença ", /* @__PURE__ */ (0, Z.jsx)(i_, {})]
							})
						] }),
						/* @__PURE__ */ (0, Z.jsxs)("section", { children: [
							/* @__PURE__ */ (0, Z.jsx)("h2", { children: "Fotografias industriais" }),
							/* @__PURE__ */ (0, Z.jsx)("p", { children: "Tima Miroshnichenko, via Pexels. Fotografias recortadas para a composição." }),
							/* @__PURE__ */ (0, Z.jsxs)("a", {
								href: "https://www.pexels.com/photo/a-man-using-a-turning-machine-5846270/",
								target: "_blank",
								rel: "noreferrer",
								children: ["Operador no torno ", /* @__PURE__ */ (0, Z.jsx)(i_, {})]
							}),
							/* @__PURE__ */ (0, Z.jsx)("br", {}),
							/* @__PURE__ */ (0, Z.jsxs)("a", {
								href: "https://www.pexels.com/photo/black-metal-machine-on-brown-wooden-table-5846125/",
								target: "_blank",
								rel: "noreferrer",
								children: ["Detalhe do torno ", /* @__PURE__ */ (0, Z.jsx)(i_, {})]
							}),
							" ",
							"·",
							" ",
							/* @__PURE__ */ (0, Z.jsxs)("a", {
								href: "https://www.pexels.com/license/",
								target: "_blank",
								rel: "noreferrer",
								children: ["Licença Pexels ", /* @__PURE__ */ (0, Z.jsx)(i_, {})]
							})
						] }),
						/* @__PURE__ */ (0, Z.jsxs)("section", { children: [/* @__PURE__ */ (0, Z.jsx)("h2", { children: "Componentes e identidade" }), /* @__PURE__ */ (0, Z.jsx)("p", { children: "Raposa original do SIVI preservada. Gráfico e preços adaptados dos dois componentes de referência do 21st.dev fornecidos pelo responsável. Ícones Lucide e movimento com Motion." })] })
					] })] })]
				}),
				/* @__PURE__ */ (0, Z.jsxs)("div", {
					className: "sv-information-cta",
					children: [/* @__PURE__ */ (0, Z.jsx)("h2", { children: "Pronto para o próximo acordo?" }), /* @__PURE__ */ (0, Z.jsx)(o_, { children: "Conhecer o cadastro" })]
				})
			]
		}),
		/* @__PURE__ */ (0, Z.jsx)(m_, {}),
		/* @__PURE__ */ (0, Z.jsx)(h_, {})
	] });
}
Object.freeze([
	"pending",
	"changes_requested",
	"rejected",
	"active",
	"blocked"
]);
var sS = Object.freeze(["buyer", "supplier"]);
Object.freeze({
	buyer: Object.freeze({
		homeRoute: Kg.buyerHome,
		userRoles: Object.freeze(["buyer", "owner"]),
		permissions: Object.freeze([
			"demands:write",
			"proposals:compare",
			"orders:read"
		])
	}),
	supplier: Object.freeze({
		homeRoute: Kg.supplierHome,
		userRoles: Object.freeze(["supplier", "owner"]),
		permissions: Object.freeze([
			"opportunities:read",
			"proposals:write-own",
			"orders:execute"
		])
	}),
	administration: Object.freeze({
		homeRoute: Kg.adminHome,
		userRoles: Object.freeze(["platform-admin"]),
		permissions: Object.freeze(["organizations:review"])
	})
});
function cS(e) {
	let t = typeof e == "string" ? e.trim().replace(/\s+/g, " ") : "";
	if (t.length < 2 || t.length > 120) throw Error("Informe o nome da empresa (2 a 120 caracteres).");
	return t;
}
function lS(e) {
	let t = Array.isArray(e) ? e : e && typeof e == "object" ? Object.entries(e).filter(([, e]) => e === !0).map(([e]) => e) : typeof e == "string" ? [e] : [], n = [...new Set(t.filter((e) => sS.includes(e)))];
	if (!n.length) throw Error("Escolha Comprador, Fornecedor ou ambas as atuações.");
	return n;
}
Object.freeze({
	pending: "Em análise",
	changes_requested: "Correção solicitada",
	rejected: "Cadastro recusado",
	active: "Empresa ativa",
	blocked: "Acesso suspenso"
});
var uS = "AC AL AP AM BA CE DF ES GO MA MT MS MG PA PB PR PE PI RJ RN RS RO RR SC SP SE TO".split(" ");
function dS(e) {
	let t = cS(e?.name), n = lS(e?.roles), r = String(e?.cnpj ?? "").replace(/[.\s/\-]/g, "").toUpperCase(), i = String(e?.city ?? "").trim(), a = String(e?.state ?? "").trim().toUpperCase(), o = String(e?.contact ?? "").trim();
	if (!/^[A-Z0-9]{12}[0-9]{2}$/.test(r)) throw Error("Informe o CNPJ com 14 caracteres.");
	if (i.length < 2 || i.length > 100) throw Error("Informe a cidade (2 a 100 caracteres).");
	if (!uS.includes(a)) throw Error("Selecione a UF da empresa.");
	if (o.length < 8 || o.length > 120) throw Error("Informe um telefone ou e-mail de contato (8 a 120 caracteres).");
	return {
		name: t,
		roles: n,
		cnpj: r,
		city: i,
		state: a,
		contact: o,
		onboardingVersion: 1
	};
}
// src/pages/auth/auth-validation.js
function fS(e) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}
function pS(e) {
	let t = {
		length: e.length >= 8,
		uppercase: /[A-ZÀ-Ý]/.test(e),
		lowercase: /[a-zà-ÿ]/.test(e),
		number: /\d/.test(e)
	};
	return {
		checks: t,
		score: Object.values(t).filter(Boolean).length
	};
}
// src/domain/public-signup.js
var mS = Object.freeze([
	{
		id: "compras",
		name: "Compras",
		price: 99,
		annual: 79,
		roles: ["buyer"],
		subtitle: "Encontre quem atende à sua necessidade.",
		features: [
			"Demandas com requisitos por item",
			"Comparação de propostas e revisões",
			"Pedidos, recebimentos e avaliações"
		]
	},
	{
		id: "fornecimento",
		name: "Fornecimento",
		price: 149,
		annual: 119,
		roles: ["supplier"],
		subtitle: "Transforme sua capacidade em novos acordos.",
		features: [
			"Perfil de capacidade industrial",
			"Propostas com histórico de versões",
			"Inspeção e expedição dos pedidos"
		]
	},
	{
		id: "integrado",
		name: "Integrado",
		price: 199,
		annual: 159,
		roles: ["buyer", "supplier"],
		subtitle: "Compre e forneça no mesmo lugar.",
		features: [
			"Todos os recursos de Compras",
			"Todos os recursos de Fornecimento",
			"Alternância entre as duas atuações"
		]
	}
]), hS = (e) => mS.find((t) => t.id === e) ?? mS[2];
function gS(e, t) {
	let n = hS(e), r = t === "anual";
	return {
		monthly: r ? n.annual : n.price,
		total: r ? n.annual * 12 : n.price,
		period: r ? "anual" : "mensal"
	};
}
function _S(e, t) {
	let n = {};
	if (t === 0 && ((String(e.firstName ?? "").trim().length < 2 || String(e.firstName).length > 60) && (n.firstName = "Informe seu nome (2 a 60 caracteres)."), (String(e.lastName ?? "").trim().length < 2 || String(e.lastName).length > 80) && (n.lastName = "Informe seu sobrenome (2 a 80 caracteres)."), fS(String(e.email ?? "").trim()) || (n.email = "Informe um e-mail válido."), (pS(String(e.password ?? "")).score !== 4 || String(e.password).length > 128) && (n.password = "Use de 8 a 128 caracteres, com maiúscula, minúscula e número."), e.password !== e.confirmPassword && (n.confirmPassword = "As senhas precisam ser iguais.")), t === 1) {
		try {
			cS(e.name);
		} catch (e) {
			n.name = e.message;
		}
		try {
			lS(e.roles);
		} catch (e) {
			n.roles = e.message;
		}
		/^[A-Z0-9]{12}[0-9]{2}$/.test(String(e.cnpj ?? "").replace(/[.\s/\-]/g, "").toUpperCase()) || (n.cnpj = "Informe o CNPJ com 14 caracteres.");
		let t = String(e.city ?? "").trim(), r = String(e.contact ?? "").trim();
		(t.length < 2 || t.length > 100) && (n.city = "Informe a cidade (2 a 100 caracteres)."), uS.includes(String(e.state ?? "").toUpperCase()) || (n.state = "Selecione a UF da empresa."), (r.length < 8 || r.length > 120) && (n.contact = "Informe um telefone ou e-mail de contato (8 a 120 caracteres).");
	}
	return n;
}
// src/core/signup-draft-store.js
var vS = "sivi.signup-drafts.v1", yS = 6048e5, bS = (e) => String(e ?? "").trim().toLowerCase();
function xS({ storage: e, now: t = Date.now, idFactory: n = () => globalThis.crypto.randomUUID() } = {}) {
	let r = !!e, i = [];
	try {
		let t = JSON.parse(e?.getItem(vS) ?? "[]");
		Array.isArray(t) && (i = t);
	} catch {
		r = !1;
	}
	let a = () => {
		if (r) try {
			let n = JSON.parse(e.getItem(vS) ?? "[]");
			i = (Array.isArray(n) ? n : []).filter((e) => e && typeof e.id == "string" && typeof e.email == "string" && Number.isFinite(e.expiresAt) && e.expiresAt > t()).flatMap((e) => {
				try {
					return [{
						id: e.id,
						email: bS(e.email),
						uid: typeof e.uid == "string" ? e.uid : void 0,
						organization: dS(e.organization),
						plan: hS(e.plan).id,
						period: gS(e.plan, e.period).period,
						expiresAt: e.expiresAt,
						organizationId: typeof e.organizationId == "string" ? e.organizationId : void 0
					}];
				} catch {
					return [];
				}
			});
		} catch {
			r = !1;
		}
	}, o = () => {
		i = i.filter((e) => e.expiresAt > t());
		try {
			e?.setItem(vS, JSON.stringify(i));
		} catch {
			r = !1;
		}
	}, s = (e, n) => e && e.expiresAt > t() && n?.uid && bS(n.email) === e.email && (!e.uid || e.uid === n.uid);
	return {
		get persistent() {
			return r;
		},
		stage({ email: e, organization: r, plan: s, period: c }) {
			a();
			let l = dS(r), u = bS(e);
			i = i.filter((e) => e.email !== u);
			let d = {
				id: n(),
				email: u,
				organization: l,
				plan: hS(s).id,
				period: gS(s, c).period,
				expiresAt: t() + yS
			};
			return i.push(d), o(), d.id;
		},
		bind(e, t) {
			a();
			let n = i.find((t) => t.id === e);
			return s(n, t) ? (n.uid = t.uid, o(), !0) : !1;
		},
		read(e) {
			a();
			let t = i.find((t) => s(t, e));
			return t ? (t.uid || (t.uid = e.uid, o()), structuredClone(t)) : (o(), null);
		},
		ensureAttempt(e, t) {
			a();
			let n = i.find((t) => t.id === e);
			if (!s(n, t)) throw Error("O rascunho expirou ou pertence a outra conta.");
			return n.uid = t.uid, n.organizationId ??= `signup-${n.id}`, o(), n.organizationId;
		},
		remove(e, t) {
			a(), i = i.filter((n) => !(n.id === e && s(n, t))), o();
		}
	};
}
var SS;
function CS() {
	if (!SS) {
		let e;
		try {
			e = window.localStorage;
		} catch {}
		SS = xS({ storage: e });
	}
	return SS;
}
// src/services/auth-errors.js
function wS(e) {
	return {
		"auth/account-exists-with-different-credential": "Este e-mail já está ligado a outro método de acesso.",
		"auth/email-already-in-use": "Já existe uma conta cadastrada com este e-mail.",
		"auth/email-not-verified": "Confirme seu e-mail antes de entrar no SIVI.",
		"auth/email-not-verified-verification-sent": "Seu e-mail ainda não foi confirmado. Enviamos um novo link de verificação.",
		"auth/invalid-credential": "E-mail ou senha incorretos.",
		"auth/invalid-email": "Informe um endereço de e-mail válido.",
		"auth/network-request-failed": "Não foi possível conectar ao Firebase. Verifique sua internet.",
		"auth/operation-not-allowed": "Este método de acesso ainda não foi habilitado no Firebase.",
		"auth/password-does-not-meet-requirements": "A senha informada não atende à política configurada no Firebase.",
		"auth/popup-blocked": "O navegador bloqueou a janela de autenticação.",
		"auth/popup-closed-by-user": "A autenticação foi cancelada antes de terminar.",
		"auth/sdk-unavailable": "A autenticação não pôde ser carregada. Verifique sua conexão e tente novamente.",
		"auth/too-many-requests": "Muitas tentativas seguidas. Aguarde um pouco e tente novamente.",
		"auth/user-disabled": "Esta conta está desativada. Procure o suporte do SIVI.",
		"auth/user-not-found": "E-mail ou senha incorretos.",
		"auth/unauthorized-domain": "Este domínio ainda não foi autorizado no Firebase.",
		"auth/invalid-api-key": "A configuração pública do Firebase precisa ser revisada.",
		"auth/unsupported-provider": "Este provedor de acesso não é suportado.",
		"auth/weak-password": "A senha informada ainda não atende aos requisitos de segurança.",
		"auth/wrong-password": "E-mail ou senha incorretos."
	}[e?.code] ?? "Não foi possível concluir a operação. Tente novamente.";
}
// src/public/auth.tsx
function TS({ label: e, labelAction: t, name: n, id: r, type: i = "text", value: a, onChange: o, error: s, hint: c, autoComplete: l, maxLength: u, ...d }) {
	let [f, p] = (0, y.useState)(!1);
	return /* @__PURE__ */ (0, Z.jsxs)("div", {
		className: "sa-field",
		children: [
			/* @__PURE__ */ (0, Z.jsxs)("div", {
				className: "sa-field-heading",
				children: [/* @__PURE__ */ (0, Z.jsx)("label", {
					htmlFor: r,
					children: e
				}), t]
			}),
			/* @__PURE__ */ (0, Z.jsxs)("div", {
				className: "sa-input-wrap",
				children: [/* @__PURE__ */ (0, Z.jsx)("input", {
					...d,
					id: r,
					name: n,
					type: i === "password" && f ? "text" : i,
					value: a,
					onChange: (e) => o(n, e.target.value),
					maxLength: u,
					autoComplete: l,
					"aria-invalid": !!s,
					"aria-describedby": s ? `${r}-error` : c ? `${r}-hint` : void 0
				}), i === "password" && /* @__PURE__ */ (0, Z.jsx)("button", {
					type: "button",
					className: "sa-password",
					"aria-label": f ? `Ocultar ${e.toLowerCase()}` : `Mostrar ${e.toLowerCase()}`,
					"aria-pressed": f,
					"aria-controls": r,
					onClick: () => p(!f),
					children: f ? /* @__PURE__ */ (0, Z.jsx)(Dg, { size: 18 }) : /* @__PURE__ */ (0, Z.jsx)(kg, { size: 18 })
				})]
			}),
			c && !s && /* @__PURE__ */ (0, Z.jsx)("small", {
				id: `${r}-hint`,
				children: c
			}),
			s && /* @__PURE__ */ (0, Z.jsx)("small", {
				className: "sa-error",
				id: `${r}-error`,
				children: s
			})
		]
	});
}
var ES = {
	firstName: "",
	lastName: "",
	email: "",
	password: "",
	confirmPassword: ""
}, DS = 14, OS = (e) => e.toUpperCase().replace(/[^A-Z0-9]/g, ""), kS = [
	["Publicar demandas", "Informe o que sua empresa precisa comprar e receba propostas."],
	["Encontrar oportunidades", "Consulte demandas compatíveis com o que sua empresa fornece."],
	["Acompanhar pedidos", "Consulte as condições do pedido e os registros de inspeção, expedição e recebimento."]
];
function AS({ register: e }) {
	return e ? /* @__PURE__ */ (0, Z.jsxs)("aside", {
		className: "sa-story sa-story--benefits",
		"aria-labelledby": "signup-benefits",
		children: [/* @__PURE__ */ (0, Z.jsx)("img", {
			className: "sa-story-photo",
			src: "./assets/home-inspection.webp",
			width: 1200,
			height: 800,
			alt: ""
		}), /* @__PURE__ */ (0, Z.jsxs)("div", {
			className: "sa-benefits",
			children: [
				/* @__PURE__ */ (0, Z.jsx)("h2", {
					id: "signup-benefits",
					children: "O que sua empresa pode fazer no SIVI"
				}),
				/* @__PURE__ */ (0, Z.jsx)("p", { children: "A conta é gratuita. Os recursos ficam disponíveis após a aprovação da empresa." }),
				/* @__PURE__ */ (0, Z.jsx)("ul", { children: kS.map(([e, t]) => /* @__PURE__ */ (0, Z.jsxs)("li", { children: [/* @__PURE__ */ (0, Z.jsx)(xg, {
					size: 18,
					"aria-hidden": "true"
				}), /* @__PURE__ */ (0, Z.jsxs)("div", { children: [/* @__PURE__ */ (0, Z.jsx)("strong", { children: e }), /* @__PURE__ */ (0, Z.jsx)("p", { children: t })] })] }, e)) })
			]
		})]
	}) : /* @__PURE__ */ (0, Z.jsxs)("aside", {
		className: "sa-story",
		children: [/* @__PURE__ */ (0, Z.jsx)("img", {
			className: "sa-story-photo",
			src: "./assets/operador-torno.jpg",
			width: 1920,
			height: 1280,
			alt: "",
			fetchPriority: "high"
		}), /* @__PURE__ */ (0, Z.jsxs)("div", {
			className: "sa-story-content",
			children: [/* @__PURE__ */ (0, Z.jsxs)("h2", { children: [
				"Da cotação",
				/* @__PURE__ */ (0, Z.jsx)("br", {}),
				"ao recebimento."
			] }), /* @__PURE__ */ (0, Z.jsx)("p", { children: "Compradores e fornecedores no mesmo lugar, com cada etapa da negociação registrada." })]
		})]
	});
}
function jS({ bridge: e }) {
	let t = new URLSearchParams(location.hash.split("?")[1]), n = t.get("modo") !== "login", [r, i] = (0, y.useState)(() => hS(t.get("plano") ?? (t.get("atuacao") === "supplier" ? "fornecimento" : "compras")).id), a = t.get("periodo") === "anual" ? "anual" : "mensal", [o, s] = (0, y.useState)(0), [c, l] = (0, y.useState)({
		...ES,
		name: "",
		cnpj: "",
		city: "",
		state: "SP",
		contact: ""
	}), [u, d] = (0, y.useState)({}), [f, p] = (0, y.useState)(!1), [m, h] = (0, y.useState)(""), [g, _] = (0, y.useState)(null), [v, b] = (0, y.useState)(!1), [x, S] = (0, y.useState)(""), [C, w] = (0, y.useState)(""), T = (0, y.useRef)(!1), E = (0, y.useRef)(!0), D = (0, y.useRef)(null), O = (0, y.useRef)(null), k = hS(r), A = CS();
	(0, y.useEffect)(() => () => {
		E.current = !1;
	}, []), (0, y.useEffect)(() => {
		D.current?.focus({ preventScroll: !0 });
	}, [
		o,
		g,
		v
	]);
	let j = (e, t) => {
		l((n) => ({
			...n,
			[e]: e === "cnpj" ? OS(t).slice(0, DS) : t
		})), d((t) => ({
			...t,
			[e]: void 0,
			company: void 0
		}));
	};
	function M(e) {
		e.preventDefault();
		let t = OS(e.clipboardData.getData("text"));
		if (!t) return;
		let n = e.currentTarget, r = n.selectionStart ?? n.value.length, i = n.selectionEnd ?? r, a = DS - n.value.length + i - r, o = t.slice(0, a);
		j("cnpj", n.value.slice(0, r) + o + n.value.slice(i)), requestAnimationFrame(() => n.setSelectionRange(r + o.length, r + o.length));
	}
	let N = (e) => {
		h(e), requestAnimationFrame(() => O.current?.focus());
	}, P = (e) => {
		d(e), N("Confira os campos indicados antes de continuar."), requestAnimationFrame(() => document.querySelector(".sivi-auth-ui [aria-invalid=\"true\"]")?.focus());
	}, F = /* @__PURE__ */ (0, Z.jsxs)("p", {
		id: "access-terms",
		className: "sa-terms",
		children: [
			"Ao continuar, você concorda com as ",
			/* @__PURE__ */ (0, Z.jsx)("a", {
				href: e_("condicoes"),
				children: "condições de uso"
			}),
			" e com a ",
			/* @__PURE__ */ (0, Z.jsx)("a", {
				href: e_("privacidade"),
				children: "política de privacidade"
			}),
			"."
		]
	});
	async function I(t) {
		if (t.preventDefault(), T.current) return;
		let n = {
			...c,
			roles: k.roles
		}, i = _S(n, o);
		if (Object.keys(i).length) {
			P(i);
			return;
		}
		if (o === 0) {
			s(1), h(""), d({}), window.scrollTo(0, 0);
			return;
		}
		let u = _S(n, 0);
		if (Object.keys(u).length) {
			s(0), P(u);
			return;
		}
		T.current = !0, p(!0), h("Criando sua conta. Aguarde a confirmação.");
		let f;
		try {
			f = A.stage({
				email: c.email,
				organization: dS(n),
				plan: r,
				period: a
			});
			let t = await (await e.loadAuth()).registerWithEmail({
				firstName: c.firstName.trim(),
				lastName: c.lastName.trim(),
				email: c.email.trim(),
				password: c.password
			});
			if (A.bind(f, {
				uid: t.user.uid,
				email: t.user.email ?? c.email
			}), !E.current) return;
			_({
				...t,
				email: c.email.trim(),
				persistent: A.persistent
			}), l((e) => ({
				...e,
				password: "",
				confirmPassword: ""
			})), h("");
		} catch (e) {
			E.current && N(e.code === "auth/email-already-in-use" ? "Este e-mail já tem uma conta. Entre ou recupere sua senha para continuar." : wS(e));
		} finally {
			T.current = !1, E.current && p(!1);
		}
	}
	async function L(t) {
		if (t.preventDefault(), !T.current) {
			if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(x.trim())) N("Informe um e-mail válido.");
			else if (!v && !C) N("Informe sua senha.");
			else {
				T.current = !0, p(!0), h(v ? "Preparando as orientações…" : "Entrando na sua conta…");
				try {
					let t = await e.loadAuth();
					v ? (await t.requestPasswordReset(x.trim()), N("Se houver uma conta com este e-mail, você receberá as orientações para redefinir a senha. Confira também o spam.")) : await t.loginWithEmail({
						email: x.trim(),
						password: C
					});
				} catch (e) {
					E.current && N(wS(e));
				} finally {
					T.current = !1, E.current && p(!1);
				}
			}
		}
	}
	async function ee(t) {
		if (!T.current) {
			T.current = !0, p(!0), h(t === "apple" ? "Abrindo o acesso com Apple…" : "Abrindo o acesso com Google…");
			try {
				await (await e.loadAuth()).loginWithProvider(t);
			} catch (e) {
				if (E.current) {
					let n = e?.code;
					N(t === "apple" && (n === "auth/operation-not-allowed" || n === "auth/invalid-oauth-client-id") ? "O acesso com Apple está indisponível. Entre com Google ou e-mail." : wS(e));
				}
			} finally {
				T.current = !1, E.current && p(!1);
			}
		}
	}
	let te = (e, t, n = "text", r, i) => /* @__PURE__ */ (0, Z.jsx)(TS, {
		id: {
			firstName: "first-name",
			lastName: "last-name",
			email: "register-email",
			password: "register-password",
			confirmPassword: "confirm-password"
		}[e],
		name: e,
		label: t,
		placeholder: i,
		type: n,
		autoComplete: r,
		maxLength: e.includes("assword") ? 128 : e === "email" ? 254 : 80,
		value: c[e],
		onChange: j,
		error: u[e],
		hint: e === "password" ? "8 ou mais caracteres, com maiúscula, minúscula e número." : void 0
	}, e), R = /* @__PURE__ */ (0, Z.jsxs)("p", {
		className: "sa-switch-mode",
		children: [
			n ? "Já tem conta?" : "Ainda não tem conta?",
			" ",
			/* @__PURE__ */ (0, Z.jsx)("a", {
				href: n ? "#/acesso?modo=login" : "#/acesso?modo=register",
				"data-switch-mode": n ? "login" : "register",
				children: n ? "Entrar" : "Cadastre-se"
			})
		]
	}), ne = /* @__PURE__ */ (0, Z.jsx)("div", {
		ref: O,
		className: `sa-feedback ${m ? "is-visible" : ""}`,
		role: "status",
		tabIndex: -1,
		"data-status": n ? "register" : "login",
		children: m
	});
	return /* @__PURE__ */ (0, Z.jsxs)("div", {
		className: "sa-layout auth-shell",
		"data-mode": n ? "register" : "login",
		"data-ui-ready": "true",
		"aria-busy": f,
		children: [/* @__PURE__ */ (0, Z.jsx)("main", {
			className: "sa-main",
			children: /* @__PURE__ */ (0, Z.jsxs)("div", {
				className: "sa-content form-view is-active",
				children: [/* @__PURE__ */ (0, Z.jsx)("div", {
					className: "sa-brand",
					children: /* @__PURE__ */ (0, Z.jsx)(r_, { back: !0 })
				}), g ? /* @__PURE__ */ (0, Z.jsxs)("section", {
					className: "sa-success",
					children: [
						/* @__PURE__ */ (0, Z.jsx)("span", {
							className: "sa-success-symbol",
							children: /* @__PURE__ */ (0, Z.jsx)(xg, {
								size: 22,
								"aria-hidden": "true"
							})
						}),
						/* @__PURE__ */ (0, Z.jsx)("h1", {
							ref: D,
							tabIndex: -1,
							children: "Sua conta foi criada."
						}),
						/* @__PURE__ */ (0, Z.jsx)("p", { children: g.verificationSent ? /* @__PURE__ */ (0, Z.jsxs)(Z.Fragment, { children: [
							"Enviamos um link para ",
							/* @__PURE__ */ (0, Z.jsx)("strong", { children: g.email }),
							". Confirme seu e-mail para continuar."
						] }) : "Entre com sua conta para solicitar um novo e-mail de verificação." }),
						/* @__PURE__ */ (0, Z.jsx)("p", { children: g.persistent ? "Depois de confirmar o e-mail, entre para revisar e enviar os dados da empresa para análise." : "Depois de confirmar o e-mail, entre e preencha novamente os dados da empresa neste navegador." }),
						(!g.profileSaved || !g.displayNameSaved) && /* @__PURE__ */ (0, Z.jsx)("p", {
							className: "sa-notice",
							children: "Confira os dados do perfil após entrar. Parte deles não pôde ser salva."
						}),
						/* @__PURE__ */ (0, Z.jsx)("a", {
							className: "sa-submit",
							href: "#/acesso?modo=login",
							children: "Ir para o login"
						})
					]
				}) : n ? /* @__PURE__ */ (0, Z.jsxs)(Z.Fragment, { children: [
					/* @__PURE__ */ (0, Z.jsxs)("div", {
						className: "sa-form-heading",
						children: [/* @__PURE__ */ (0, Z.jsx)("h1", {
							ref: D,
							tabIndex: -1,
							children: o === 0 ? "Crie sua conta" : "Dados da empresa"
						}), o === 0 && /* @__PURE__ */ (0, Z.jsx)("p", { children: "Informe seus dados para começar." })]
					}),
					/* @__PURE__ */ (0, Z.jsxs)("ol", {
						className: "sa-steps",
						"aria-label": "Etapas do cadastro",
						children: [/* @__PURE__ */ (0, Z.jsx)("li", {
							"aria-current": o === 0 ? "step" : void 0,
							children: o === 0 ? /* @__PURE__ */ (0, Z.jsxs)("span", {
								className: "sa-step",
								children: [/* @__PURE__ */ (0, Z.jsx)("span", {
									className: "sa-step-number",
									"aria-hidden": "true",
									children: "1"
								}), " Conta"]
							}) : /* @__PURE__ */ (0, Z.jsxs)("button", {
								type: "button",
								className: "sa-step",
								"aria-label": "Voltar à etapa 1, Conta",
								disabled: f,
								onClick: () => {
									s(0), h(""), d({}), window.scrollTo(0, 0);
								},
								children: [/* @__PURE__ */ (0, Z.jsx)("span", {
									className: "sa-step-number",
									"aria-hidden": "true",
									children: "1"
								}), " Conta"]
							})
						}), /* @__PURE__ */ (0, Z.jsx)("li", {
							"aria-current": o === 1 ? "step" : void 0,
							children: /* @__PURE__ */ (0, Z.jsxs)("span", {
								className: "sa-step",
								children: [/* @__PURE__ */ (0, Z.jsx)("span", {
									className: "sa-step-number",
									"aria-hidden": "true",
									children: "2"
								}), " Empresa"]
							})
						})]
					}),
					/* @__PURE__ */ (0, Z.jsx)("form", {
						id: "register-form",
						noValidate: !0,
						onSubmit: I,
						children: /* @__PURE__ */ (0, Z.jsxs)("fieldset", {
							disabled: f,
							children: [
								o === 0 ? /* @__PURE__ */ (0, Z.jsxs)(Z.Fragment, { children: [
									/* @__PURE__ */ (0, Z.jsxs)("div", {
										className: "sa-row",
										children: [te("firstName", "Nome", "text", "given-name"), te("lastName", "Sobrenome", "text", "family-name")]
									}),
									te("email", "E-mail", "email", "email", "nome@empresa.com"),
									te("password", "Senha", "password", "new-password", "Crie uma senha"),
									te("confirmPassword", "Confirmar senha", "password", "new-password", "Repita a senha")
								] }) : /* @__PURE__ */ (0, Z.jsxs)(Z.Fragment, { children: [
									/* @__PURE__ */ (0, Z.jsx)(TS, {
										label: "Nome da empresa",
										id: "company-name",
										name: "name",
										placeholder: "Ex.: Metalúrgica Horizonte",
										autoComplete: "organization",
										maxLength: 120,
										value: c.name,
										onChange: j,
										error: u.name
									}),
									/* @__PURE__ */ (0, Z.jsx)(TS, {
										label: "CNPJ",
										id: "company-cnpj",
										name: "cnpj",
										placeholder: "14 caracteres",
										autoComplete: "off",
										maxLength: DS,
										value: c.cnpj,
										onChange: j,
										onPaste: M,
										error: u.cnpj
									}),
									/* @__PURE__ */ (0, Z.jsxs)("div", {
										className: "sa-row sa-row--city",
										children: [/* @__PURE__ */ (0, Z.jsx)(TS, {
											label: "Cidade",
											id: "company-city",
											name: "city",
											placeholder: "Ex.: Diadema",
											autoComplete: "address-level2",
											maxLength: 100,
											value: c.city,
											onChange: j,
											error: u.city
										}), /* @__PURE__ */ (0, Z.jsxs)("div", {
											className: "sa-field",
											children: [
												/* @__PURE__ */ (0, Z.jsx)("label", {
													htmlFor: "company-state",
													children: "UF"
												}),
												/* @__PURE__ */ (0, Z.jsx)("select", {
													id: "company-state",
													name: "state",
													autoComplete: "address-level1",
													value: c.state,
													onChange: (e) => j("state", e.target.value),
													"aria-invalid": !!u.state,
													"aria-describedby": u.state ? "company-state-error" : void 0,
													children: uS.map((e) => /* @__PURE__ */ (0, Z.jsx)("option", { children: e }, e))
												}),
												u.state && /* @__PURE__ */ (0, Z.jsx)("small", {
													className: "sa-error",
													id: "company-state-error",
													children: u.state
												})
											]
										})]
									}),
									/* @__PURE__ */ (0, Z.jsx)(TS, {
										label: "Telefone ou e-mail de contato",
										id: "company-contact",
										name: "contact",
										placeholder: "contato@empresa.com",
										maxLength: 120,
										value: c.contact,
										onChange: j,
										error: u.contact
									}),
									/* @__PURE__ */ (0, Z.jsxs)("div", {
										className: "sa-field",
										children: [/* @__PURE__ */ (0, Z.jsx)("label", {
											htmlFor: "signup-plan",
											children: "Atuação da empresa"
										}), /* @__PURE__ */ (0, Z.jsx)("select", {
											id: "signup-plan",
											value: r,
											onChange: (e) => i(e.target.value),
											children: mS.map(({ id: e, roles: t }) => /* @__PURE__ */ (0, Z.jsx)("option", {
												value: e,
												children: t.length === 2 ? "Comprar e fornecer" : t[0] === "buyer" ? "Comprar" : "Fornecer"
											}, e))
										})]
									})
								] }),
								ne,
								/* @__PURE__ */ (0, Z.jsx)("button", {
									type: "submit",
									className: "sa-submit",
									"aria-describedby": "access-terms",
									children: f ? "Criando sua conta…" : o === 0 ? "Continuar para dados da empresa" : "Criar conta"
								})
							]
						})
					}),
					R,
					F
				] }) : /* @__PURE__ */ (0, Z.jsxs)(Z.Fragment, { children: [
					/* @__PURE__ */ (0, Z.jsxs)("div", {
						className: "sa-form-heading",
						children: [/* @__PURE__ */ (0, Z.jsx)("h1", {
							ref: D,
							tabIndex: -1,
							children: v ? "Recupere seu acesso" : "Bem-vindo de volta ao SIVI!"
						}), v && /* @__PURE__ */ (0, Z.jsx)("p", { children: "Informe o e-mail usado no cadastro." })]
					}),
					/* @__PURE__ */ (0, Z.jsx)("form", {
						id: "login-form",
						noValidate: !0,
						onSubmit: L,
						children: /* @__PURE__ */ (0, Z.jsxs)("fieldset", {
							disabled: f,
							children: [
								/* @__PURE__ */ (0, Z.jsx)(TS, {
									id: "login-email",
									label: "E-mail",
									name: "email",
									type: "email",
									placeholder: "nome@empresa.com",
									autoComplete: "username",
									maxLength: 254,
									value: x,
									onChange: (e, t) => S(t)
								}),
								!v && /* @__PURE__ */ (0, Z.jsx)(Z.Fragment, { children: /* @__PURE__ */ (0, Z.jsx)(TS, {
									id: "login-password",
									label: "Senha",
									name: "password",
									type: "password",
									placeholder: "Sua senha",
									autoComplete: "current-password",
									maxLength: 128,
									value: C,
									onChange: (e, t) => w(t),
									labelAction: /* @__PURE__ */ (0, Z.jsx)("button", {
										className: "sa-reset",
										type: "button",
										"data-reset-password": !0,
										onClick: () => {
											b(!0), h("");
										},
										children: "Esqueci minha senha"
									})
								}) }),
								ne,
								/* @__PURE__ */ (0, Z.jsx)("button", {
									type: "submit",
									className: "sa-submit",
									"aria-describedby": v ? void 0 : "access-terms",
									children: f ? "Aguarde…" : v ? "Enviar orientações" : "Entrar"
								}),
								v && /* @__PURE__ */ (0, Z.jsx)("button", {
									className: "sa-reset sa-reset--return",
									type: "button",
									"data-reset-password": !0,
									onClick: () => {
										b(!1), h("");
									},
									children: "Voltar ao login"
								})
							]
						})
					}),
					!v && /* @__PURE__ */ (0, Z.jsxs)(Z.Fragment, { children: [
						/* @__PURE__ */ (0, Z.jsx)("div", {
							className: "sa-divider",
							children: /* @__PURE__ */ (0, Z.jsx)("span", { children: "ou" })
						}),
						/* @__PURE__ */ (0, Z.jsxs)("div", {
							className: "sa-providers",
							children: [/* @__PURE__ */ (0, Z.jsxs)("button", {
								type: "button",
								disabled: f,
								"data-provider": "google",
								"aria-describedby": "access-terms",
								onClick: () => ee("google"),
								children: [/* @__PURE__ */ (0, Z.jsx)("img", {
									src: "./assets/sign-in-google.png",
									width: 18,
									height: 18,
									alt: ""
								}), "Entrar com Google"]
							}), /* @__PURE__ */ (0, Z.jsxs)("button", {
								type: "button",
								disabled: f,
								"data-provider": "apple",
								"aria-describedby": "access-terms",
								onClick: () => ee("apple"),
								children: [/* @__PURE__ */ (0, Z.jsx)("svg", {
									width: "18",
									height: "18",
									viewBox: "0 0 24 24",
									fill: "currentColor",
									"aria-hidden": "true",
									children: /* @__PURE__ */ (0, Z.jsx)("path", { d: "M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" })
								}), "Entrar com Apple"]
							})]
						}),
						R,
						F
					] })
				] })]
			})
		}), /* @__PURE__ */ (0, Z.jsx)(AS, { register: n })]
	});
}
String.raw;
// node_modules/number-flow/dist/ssr-DvIINv8w.mjs
var MS = String.raw, NS = (() => {
	try {
		document.createElement("div").animate({ opacity: 0 }, { easing: "linear(0, 1)" });
	} catch {
		return !1;
	}
	return !0;
})(), PS = typeof CSS < "u" && CSS.supports && CSS.supports("line-height", "mod(1,1)"), FS = typeof matchMedia < "u" ? matchMedia("(prefers-reduced-motion: reduce)") : null, IS = "--_number-flow-d-opacity", LS = "--_number-flow-d-width", RS = "--_number-flow-dx", zS = "--_number-flow-d", BS = (() => {
	try {
		return CSS.registerProperty({
			name: IS,
			syntax: "<number>",
			inherits: !1,
			initialValue: "0"
		}), CSS.registerProperty({
			name: RS,
			syntax: "<length>",
			inherits: !0,
			initialValue: "0px"
		}), CSS.registerProperty({
			name: LS,
			syntax: "<number>",
			inherits: !1,
			initialValue: "0"
		}), CSS.registerProperty({
			name: zS,
			syntax: "<number>",
			inherits: !0,
			initialValue: "0"
		}), !0;
	} catch {
		return !1;
	}
})(), VS = "round(nearest, calc(var(--number-flow-mask-height, 0.25em) / 2), 1px)", HS = `calc(${VS} * 2)`, US = "var(--number-flow-mask-width, 0.5em)", WS = `calc(${US} / var(--scale-x))`, GS = "#000 0, transparent 71%", KS = MS`:host{display:inline-block;direction:ltr;white-space:nowrap;isolation:isolate;line-height:1}.number,.number__inner{display:inline-block;transform-origin:left top}:host([data-will-change]) :is(.number,.number__inner,.section,.digit,.digit__num,.symbol){will-change:transform}.number{--scale-x:calc(1 + var(${LS}) / var(--width));transform:translateX(var(${RS})) scaleX(var(--scale-x));margin:0 calc(-1 * ${US});position:relative;-webkit-mask-image:linear-gradient(to right,transparent 0,#000 ${WS},#000 calc(100% - ${WS}),transparent ),linear-gradient(to bottom,transparent 0,#000 ${HS},#000 calc(100% - ${HS}),transparent 100% ),radial-gradient(at bottom right,${GS}),radial-gradient(at bottom left,${GS}),radial-gradient(at top left,${GS}),radial-gradient(at top right,${GS});-webkit-mask-size:100% calc(100% - ${HS} * 2),calc(100% - ${WS} * 2) 100%,${WS} ${HS},${WS} ${HS},${WS} ${HS},${WS} ${HS};-webkit-mask-position:center,center,top left,top right,bottom right,bottom left;-webkit-mask-repeat:no-repeat}.number__inner{padding:${VS} ${US};transform:scaleX(calc(1 / var(--scale-x))) translateX(calc(-1 * var(${RS})))}:host > :not(.number){z-index:5}.section,.symbol{display:inline-block;position:relative;isolation:isolate}.section::after{content:'\200b';display:inline-block}.section--justify-left{transform-origin:center left}.section--justify-right{transform-origin:center right}.section > [inert],.symbol > [inert]{margin:0 !important;position:absolute !important;z-index:-1}.digit{display:inline-block;position:relative;--c:var(--current) + var(${zS})}.digit__num,.number .section::after{padding:${VS} 0}.digit__num{display:inline-block;--offset-raw:mod(var(--length) + var(--n) - mod(var(--c),var(--length)),var(--length));--offset:calc( var(--offset-raw) - var(--length) * round(down,var(--offset-raw) / (var(--length) / 2),1) );--y:clamp(-100%,var(--offset) * 100%,100%);transform:translateY(var(--y))}.digit__num[inert]{position:absolute;top:0;left:50%;transform:translateX(-50%) translateY(var(--y))}.digit:not(.is-spinning) .digit__num[inert]{display:none}.symbol__value{display:inline-block;mix-blend-mode:plus-lighter;white-space:pre}.section--justify-left .symbol > [inert]{left:0}.section--justify-right .symbol > [inert]{right:0}.animate-presence{opacity:calc(1 + var(${IS}))}`, qS = typeof HTMLElement < "u" ? HTMLElement : class {}, JS = MS`:host{display:inline-block;direction:ltr;white-space:nowrap;line-height:1}span{display:inline-block}:host([data-will-change]) span{will-change:transform}.number,.digit{padding:${VS} 0}.symbol{white-space:pre}`, YS = (e = "") => MS`:where(number-flow${e}){line-height:1}number-flow${e} > span{font-kerning:none;display:inline-block;padding:${HS} 0}`, XS = (e, t, n) => {
	let r = document.createElement(e), [i, a] = Array.isArray(t) ? [void 0, t] : [t, n];
	return i && Object.assign(r, i), a?.forEach((e) => r.appendChild(e)), r;
}, ZS = (e, t) => t === "left" ? e.offsetLeft : ((e.offsetParent instanceof HTMLElement ? e.offsetParent : null)?.offsetWidth ?? 0) - e.offsetWidth - e.offsetLeft, QS = (e) => e.offsetWidth > 0 && e.offsetHeight > 0, $S = (e, t) => {
	typeof HTMLElement < "u" && typeof customElements < "u" && !customElements.get(e) && customElements.define(e, t);
};
function eC(e, t, { reverse: n = !1 } = {}) {
	let r = e.length;
	for (let i = n ? r - 1 : 0; n ? i >= 0 : i < r; n ? i-- : i++) t(e[i], i);
}
function tC(e, t, n, r) {
	let i = t.formatToParts(e);
	n && i.unshift({
		type: "prefix",
		value: n
	}), r && i.push({
		type: "suffix",
		value: r
	});
	let a = [], o = [], s = [], c = [], l = {}, u = (e) => `${e}:${l[e] = (l[e] ?? -1) + 1}`, d = "", f = !1, p = !1;
	for (let e of i) {
		d += e.value;
		let t = e.type === "minusSign" || e.type === "plusSign" ? "sign" : e.type;
		t === "integer" ? (f = !0, o.push(...e.value.split("").map((e) => ({
			type: t,
			value: parseInt(e)
		})))) : t === "group" ? o.push({
			type: t,
			value: e.value
		}) : t === "decimal" ? (p = !0, s.push({
			type: t,
			value: e.value,
			key: u(t)
		})) : t === "fraction" ? s.push(...e.value.split("").map((e) => ({
			type: t,
			value: parseInt(e),
			key: u(t),
			pos: -1 - l[t]
		}))) : (f || p ? c : a).push({
			type: t,
			value: e.value,
			key: u(t)
		});
	}
	let m = [];
	for (let e = o.length - 1; e >= 0; e--) {
		let t = o[e];
		m.unshift(t.type === "integer" ? {
			...t,
			key: u(t.type),
			pos: l[t.type]
		} : {
			...t,
			key: u(t.type)
		});
	}
	return {
		pre: a,
		integer: m,
		fraction: s,
		post: c,
		valueAsString: d,
		value: typeof e == "string" ? parseFloat(e) : e
	};
}
var nC = PS && NS && BS, rC = class extends qS {
	constructor() {
		super(), this.created = !1, this.batched = !1, this._preUpdated = !1;
		let { animated: e, ...t } = this.constructor.defaultProps;
		this._animated = this.computedAnimated = e, Object.assign(this, t);
	}
	get animated() {
		return this._animated;
	}
	set animated(e) {
		var t;
		this.animated !== e && (this._animated = e, (t = this.shadowRoot) == null || t.getAnimations().forEach((e) => e.finish()));
	}
	set data(e) {
		var t, n;
		if (e == null || e === this._data) return;
		let { pre: r, integer: i, fraction: a, post: o, value: s } = e;
		if (this.created) {
			let c = this._data;
			this._data = e, this.computedTrend = typeof this.trend == "function" ? this.trend(c.value, s) : this.trend, this.computedAnimated = nC && this._animated && (!this.respectMotionPreference || !((t = FS) != null && t.matches)) && QS(this) && this.ownerDocument.visibilityState === "visible", (n = this.plugins) == null || n.forEach((t) => t.onUpdate?.call(t, e, c, this)), this.batched || this.willUpdate(), this._pre.update(r), this._num.update({
				integer: i,
				fraction: a
			}), this._post.update(o), this.batched || this.didUpdate();
		} else {
			this._data = e, this.attachShadow({ mode: "open" });
			try {
				this._internals ??= this.attachInternals(), this._internals.role = "img";
			} catch {}
			let t = document.createElement("style");
			this.nonce && (t.nonce = this.nonce), t.textContent = KS, this.shadowRoot.appendChild(t), this._pre = new sC(this, r, {
				justify: "right",
				part: "left"
			}), this.shadowRoot.appendChild(this._pre.el), this._num = new iC(this, i, a), this.shadowRoot.appendChild(this._num.el), this._post = new sC(this, o, {
				justify: "left",
				part: "right"
			}), this.shadowRoot.appendChild(this._post.el), this.created = !0;
		}
		try {
			this._internals.ariaLabel = e.valueAsString;
		} catch {}
	}
	willUpdate() {
		var e;
		this._preUpdated = nC && this._animated && (!this.respectMotionPreference || !((e = FS) != null && e.matches)) && this.ownerDocument.visibilityState === "visible", this._preUpdated && (this._pre.willUpdate(), this._num.willUpdate(), this._post.willUpdate());
	}
	didUpdate() {
		if (!this.computedAnimated || !this._preUpdated) return;
		this._abortAnimationsFinish ? this._abortAnimationsFinish.abort() : this.dispatchEvent(new Event("animationsstart")), this._pre.didUpdate(), this._num.didUpdate(), this._post.didUpdate();
		let e = new AbortController();
		Promise.all(this.shadowRoot.getAnimations().map((e) => e.finished)).then(() => {
			e.signal.aborted || (this.dispatchEvent(new Event("animationsfinish")), this._abortAnimationsFinish = void 0);
		}), this._abortAnimationsFinish = e;
	}
};
rC.defaultProps = {
	transformTiming: {
		duration: 900,
		easing: "linear(0,.005,.019,.039,.066,.096,.129,.165,.202,.24,.278,.316,.354,.39,.426,.461,.494,.526,.557,.586,.614,.64,.665,.689,.711,.731,.751,.769,.786,.802,.817,.831,.844,.856,.867,.877,.887,.896,.904,.912,.919,.925,.931,.937,.942,.947,.951,.955,.959,.962,.965,.968,.971,.973,.976,.978,.98,.981,.983,.984,.986,.987,.988,.989,.99,.991,.992,.992,.993,.994,.994,.995,.995,.996,.996,.9963,.9967,.9969,.9972,.9975,.9977,.9979,.9981,.9982,.9984,.9985,.9987,.9988,.9989,1)"
	},
	spinTiming: void 0,
	opacityTiming: {
		duration: 450,
		easing: "ease-out"
	},
	animated: !0,
	trend: (e, t) => Math.sign(t - e),
	respectMotionPreference: !0,
	plugins: void 0,
	digits: void 0
};
var iC = class {
	constructor(e, t, n, { className: r, ...i } = {}) {
		this.flow = e, this._integer = new oC(e, t, {
			justify: "right",
			part: "integer"
		}), this._fraction = new oC(e, n, {
			justify: "left",
			part: "fraction"
		}), this._inner = XS("span", { className: "number__inner" }, [this._integer.el, this._fraction.el]), this.el = XS("span", {
			...i,
			part: "number",
			className: `number ${r ?? ""}`
		}, [this._inner]);
	}
	willUpdate() {
		this._prevWidth = this.el.offsetWidth, this._prevLeft = this.el.getBoundingClientRect().left, this._integer.willUpdate(), this._fraction.willUpdate();
	}
	update({ integer: e, fraction: t }) {
		this._integer.update(e), this._fraction.update(t);
	}
	didUpdate() {
		let e = this.el.getBoundingClientRect();
		this._integer.didUpdate(), this._fraction.didUpdate();
		let t = this._prevLeft - e.left, n = this.el.offsetWidth, r = this._prevWidth - n;
		this.el.style.setProperty("--width", String(n)), this.el.animate({
			[RS]: [`${t}px`, "0px"],
			[LS]: [r, 0]
		}, {
			...this.flow.transformTiming,
			composite: "accumulate"
		});
	}
}, aC = class {
	constructor(e, t, { justify: n, className: r, ...i }, a) {
		this.flow = e, this.children = /* @__PURE__ */ new Map(), this.onCharRemove = (e) => () => {
			this.children.delete(e);
		}, this.justify = n;
		let o = t.map((e) => this.addChar(e).el);
		this.el = XS("span", {
			...i,
			className: `section section--justify-${n} ${r ?? ""}`
		}, a ? a(o) : o);
	}
	addChar(e, { startDigitsAtZero: t = !1, ...n } = {}) {
		let r = e.type === "integer" || e.type === "fraction" ? new uC(this, e.type, t ? 0 : e.value, e.pos, {
			...n,
			onRemove: this.onCharRemove(e.key)
		}) : new dC(this, e.type, e.value, {
			...n,
			onRemove: this.onCharRemove(e.key)
		});
		return this.children.set(e.key, r), r;
	}
	unpop(e) {
		e.el.removeAttribute("inert"), e.el.style.top = "", e.el.style[this.justify] = "";
	}
	pop(e) {
		e.forEach((e) => {
			e.el.style.top = `${e.el.offsetTop}px`, e.el.style[this.justify] = `${ZS(e.el, this.justify)}px`;
		}), e.forEach((e) => {
			e.el.setAttribute("inert", ""), e.present = !1;
		});
	}
	addNewAndUpdateExisting(e) {
		let t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map(), r = this.justify === "left", i = r ? "prepend" : "append";
		if (eC(e, (e) => {
			let r;
			this.children.has(e.key) ? (r = this.children.get(e.key), n.set(e, r), this.unpop(r), r.present = !0) : (r = this.addChar(e, {
				startDigitsAtZero: !0,
				animateIn: !0
			}), t.set(e, r)), this.el[i](r.el);
		}, { reverse: r }), this.flow.computedAnimated) {
			let e = this.el.getBoundingClientRect();
			t.forEach((t) => {
				t.willUpdate(e);
			});
		}
		t.forEach((e, t) => {
			e.update(t.value);
		}), n.forEach((e, t) => {
			e.update(t.value);
		});
	}
	willUpdate() {
		let e = this.el.getBoundingClientRect();
		this._prevOffset = e[this.justify], this.children.forEach((t) => t.willUpdate(e));
	}
	didUpdate() {
		let e = this.el.getBoundingClientRect();
		this.children.forEach((t) => t.didUpdate(e));
		let t = e[this.justify], n = this._prevOffset - t;
		n && this.children.size && this.el.animate({ transform: [`translateX(${n}px)`, "none"] }, {
			...this.flow.transformTiming,
			composite: "accumulate"
		});
	}
}, oC = class extends aC {
	update(e) {
		let t = /* @__PURE__ */ new Map();
		this.children.forEach((n, r) => {
			e.find((e) => e.key === r) || t.set(r, n), this.unpop(n);
		}), this.addNewAndUpdateExisting(e), t.forEach((e) => {
			e instanceof uC && e.update(0);
		}), this.pop(t);
	}
}, sC = class extends aC {
	update(e) {
		let t = /* @__PURE__ */ new Map();
		this.children.forEach((n, r) => {
			e.find((e) => e.key === r) || t.set(r, n);
		}), this.pop(t), this.addNewAndUpdateExisting(e);
	}
}, cC = class {
	constructor(e, t, { onRemove: n, animateIn: r = !1 } = {}) {
		this.flow = e, this.el = t, this._present = !0, this._remove = () => {
			var e;
			this.el.remove(), (e = this._onRemove) == null || e.call(this);
		}, this.el.classList.add("animate-presence"), this.flow.computedAnimated && r && this.el.animate({ "--_number-flow-d-opacity": [-.9999, 0] }, {
			...this.flow.opacityTiming,
			composite: "accumulate"
		}), this._onRemove = n;
	}
	get present() {
		return this._present;
	}
	set present(e) {
		if (this._present !== e) {
			if (this._present = e, e ? this.el.removeAttribute("inert") : this.el.setAttribute("inert", ""), !this.flow.computedAnimated) {
				e || this._remove();
				return;
			}
			this.el.style.setProperty("--_number-flow-d-opacity", e ? "0" : "-.999"), this.el.animate({ [IS]: e ? [-.9999, 0] : [.999, 0] }, {
				...this.flow.opacityTiming,
				composite: "accumulate"
			}), e ? this.flow.removeEventListener("animationsfinish", this._remove) : this.flow.addEventListener("animationsfinish", this._remove, { once: !0 });
		}
	}
}, lC = class extends cC {
	constructor(e, t, n, r) {
		super(e.flow, n, r), this.section = e, this.value = t, this.el = n;
	}
}, uC = class extends lC {
	constructor(e, t, n, r, i) {
		let a = (e.flow.digits?.[r]?.max ?? 9) + 1, o = Array.from({ length: a }).map((e, t) => {
			let r = XS("span", { className: "digit__num" }, [document.createTextNode(String(t))]);
			return t !== n && r.setAttribute("inert", ""), r.style.setProperty("--n", String(t)), r;
		}), s = XS("span", {
			part: `digit ${t}-digit`,
			className: "digit"
		}, o);
		s.style.setProperty("--current", String(n)), s.style.setProperty("--length", String(a)), super(e, n, s, i), this.pos = r, this._onAnimationsFinish = () => {
			this.el.classList.remove("is-spinning");
		}, this._numbers = o, this.length = a;
	}
	willUpdate(e) {
		let t = this.el.getBoundingClientRect();
		this._prevValue = this.value;
		let n = t[this.section.justify] - e[this.section.justify], r = t.width / 2;
		this._prevCenter = this.section.justify === "left" ? n + r : n - r;
	}
	update(e) {
		this.el.style.setProperty("--current", String(e)), this._numbers.forEach((t, n) => n === e ? t.removeAttribute("inert") : t.setAttribute("inert", "")), this.value = e;
	}
	didUpdate(e) {
		let t = this.el.getBoundingClientRect(), n = t[this.section.justify] - e[this.section.justify], r = t.width / 2, i = this.section.justify === "left" ? n + r : n - r, a = this._prevCenter - i;
		a && this.el.animate({ transform: [`translateX(${a}px)`, "none"] }, {
			...this.flow.transformTiming,
			composite: "accumulate"
		});
		let o = this.getDelta();
		o && (this.el.classList.add("is-spinning"), this.el.animate({ "--_number-flow-d": [-o, 0] }, {
			...this.flow.spinTiming ?? this.flow.transformTiming,
			composite: "accumulate"
		}), this.flow.addEventListener("animationsfinish", this._onAnimationsFinish, { once: !0 }));
	}
	getDelta() {
		if (this.flow.plugins) for (let e of this.flow.plugins) {
			let t = e.getDelta?.call(e, this.value, this._prevValue, this);
			if (t != null) return t;
		}
		let e = this.value - this._prevValue, t = this.flow.computedTrend || Math.sign(e);
		return t < 0 && this.value > this._prevValue ? this.value - this.length - this._prevValue : t > 0 && this.value < this._prevValue ? this.length - this._prevValue + this.value : e;
	}
}, dC = class extends lC {
	constructor(e, t, n, r) {
		let i = XS("span", {
			className: "symbol__value",
			textContent: n
		});
		super(e, n, XS("span", {
			part: `symbol ${t}`,
			className: "symbol"
		}, [i]), r), this.type = t, this._children = /* @__PURE__ */ new Map(), this._onChildRemove = (e) => () => {
			this._children.delete(e);
		}, this._children.set(n, new cC(this.flow, i, { onRemove: this._onChildRemove(n) }));
	}
	willUpdate(e) {
		if (this.type === "decimal") return;
		let t = this.el.getBoundingClientRect();
		this._prevOffset = t[this.section.justify] - e[this.section.justify];
	}
	update(e) {
		if (this.value !== e) {
			let t = this._children.get(this.value);
			t && (t.present = !1);
			let n = this._children.get(e);
			if (n) n.present = !0;
			else {
				let t = XS("span", {
					className: "symbol__value",
					textContent: e
				});
				this.el.appendChild(t), this._children.set(e, new cC(this.flow, t, {
					animateIn: !0,
					onRemove: this._onChildRemove(e)
				}));
			}
		}
		this.value = e;
	}
	didUpdate(e) {
		if (this.type === "decimal") return;
		let t = this.el.getBoundingClientRect()[this.section.justify] - e[this.section.justify], n = this._prevOffset - t;
		n && this.el.animate({ transform: [`translateX(${n}px)`, "none"] }, {
			...this.flow.transformTiming,
			composite: "accumulate"
		});
	}
}, fC = (e) => [
	JS,
	YS(e),
	KS
], pC = parseInt("19.3.1".match(/^(\d+)\./)?.[1]) >= 19, mC = ["data", "digits"], hC = class extends rC {
	attributeChangedCallback(e, t, n) {
		this[e] = JSON.parse(n);
	}
};
hC.observedAttributes = pC ? [] : mC, $S("number-flow-react", hC);
var gC = {};
function _C(e) {
	return e;
}
var vC = pC ? _C : JSON.stringify;
function yC(e) {
	let { transformTiming: t, spinTiming: n, opacityTiming: r, animated: i, respectMotionPreference: a, trend: o, plugins: s, ...c } = e;
	return [{
		transformTiming: t,
		spinTiming: n,
		opacityTiming: r,
		animated: i,
		respectMotionPreference: a,
		trend: o,
		plugins: s
	}, c];
}
var bC = class extends y.Component {
	updateProperties(e) {
		if (!this.el) return;
		this.el.batched = !this.props.isolate;
		let [t] = yC(this.props);
		Object.entries(t).forEach(([e, t]) => {
			this.el[e] = t ?? hC.defaultProps[e];
		}), e?.onAnimationsStart && this.el.removeEventListener("animationsstart", e.onAnimationsStart), this.props.onAnimationsStart && this.el.addEventListener("animationsstart", this.props.onAnimationsStart), e?.onAnimationsFinish && this.el.removeEventListener("animationsfinish", e.onAnimationsFinish), this.props.onAnimationsFinish && this.el.addEventListener("animationsfinish", this.props.onAnimationsFinish);
	}
	componentDidMount() {
		this.updateProperties(), pC && this.el && (this.el.digits = this.props.digits, this.el.data = this.props.data);
	}
	getSnapshotBeforeUpdate(e) {
		if (this.updateProperties(e), e.data !== this.props.data) {
			if (this.props.group) return this.props.group.willUpdate(), () => this.props.group?.didUpdate();
			if (!this.props.isolate) return this.el?.willUpdate(), () => this.el?.didUpdate();
		}
		return null;
	}
	componentDidUpdate(e, t, n) {
		n?.();
	}
	handleRef(e) {
		this.props.innerRef && (this.props.innerRef.current = e), this.el = e;
	}
	render() {
		let [e, { innerRef: t, className: n, data: r, nonce: i, willChange: a, isolate: o, group: s, digits: c, onAnimationsStart: l, onAnimationsFinish: u, ...d }] = yC(this.props);
		return /*#__PURE__*/ y.createElement("number-flow-react", {
			ref: this.handleRef,
			"data-will-change": a ? "" : void 0,
			class: n,
			nonce: i,
			...d,
			dangerouslySetInnerHTML: { __html: "" },
			suppressHydrationWarning: !0,
			digits: vC(c),
			data: vC(r)
		});
	}
	constructor(e) {
		super(e), this.handleRef = this.handleRef.bind(this);
	}
}, xC = /*#__PURE__*/ y.forwardRef(function({ value: e, locales: t, format: n, prefix: r, suffix: i, ...a }, o) {
	y.useImperativeHandle(o, () => s.current, []);
	let s = y.useRef(void 0), c = y.useContext(SC);
	c?.useRegister(s);
	let l = y.useMemo(() => t ? JSON.stringify(t) : "", [t]), u = y.useMemo(() => n ? JSON.stringify(n) : "", [n]), d = y.useMemo(() => tC(e, gC[`${l}:${u}`] ??= new Intl.NumberFormat(t, n), r, i), [
		e,
		l,
		u,
		r,
		i
	]);
	return /*#__PURE__*/ y.createElement(bC, {
		...a,
		group: c,
		data: d,
		innerRef: s
	});
}), SC = /*#__PURE__*/ y.createContext(void 0);
fC("-react");
// src/domain/workspace-insights.js
var CC = new Intl.DateTimeFormat("en-CA", {
	timeZone: "America/Sao_Paulo",
	year: "numeric",
	month: "2-digit",
	day: "2-digit"
}), wC = 864e5, TC = (e) => {
	let t = Object.fromEntries(CC.formatToParts(e).map((e) => [e.type, e.value]));
	return `${t.year}-${t.month}-${t.day}`;
}, EC = (e) => Date.parse(`${e}T12:00:00Z`) / wC, DC = (e) => (/* @__PURE__ */ new Date(e * wC)).toISOString().slice(0, 10), OC = (e) => `${e.slice(8, 10)}/${e.slice(5, 7)}`, kC = (e) => {
	if (typeof e == "number" && Number.isFinite(e) && e > 0) return e;
	if (typeof e == "string" && /^\d{4}-\d{2}-\d{2}T/.test(e)) {
		let t = Date.parse(e);
		if (Number.isFinite(t)) return t;
	}
	return null;
}, AC = [
	[
		"accepted",
		"Em execução",
		"execution"
	],
	[
		"blocked",
		"Reinspeção",
		"blocked"
	],
	[
		"released",
		"Prontos para expedir",
		"released"
	],
	[
		"dispatched",
		"Expedidos",
		"dispatched"
	],
	[
		"delivered",
		"Recebidos",
		"delivered"
	],
	[
		"other",
		"Outros estados",
		"other"
	]
];
function jC(e = {}, { role: t = "buyer", days: n = 90, now: r = Date.now() } = {}) {
	if (!Number.isFinite(r)) throw Error("Informe um instante válido para os indicadores.");
	n = [
		30,
		60,
		90
	].includes(n) ? n : 90;
	let i = TC(r), a = EC(i) - n + 1, o = Array.from({ length: 6 }, (e, t) => {
		let r = DC(a + Math.ceil(t * n / 6)), i = DC(a + Math.ceil((t + 1) * n / 6) - 1);
		return {
			start: r,
			end: i,
			label: `${OC(r)}–${OC(i)}`,
			demands: 0,
			proposals: 0,
			orders: 0
		};
	}), s = {
		demands: 0,
		proposals: 0,
		orders: 0
	}, c = {
		demands: 0,
		proposals: 0,
		orders: 0
	};
	for (let t of Object.keys(s)) for (let i of e[t] ?? []) {
		let e = kC(i.createdAt);
		if (e === null && t === "proposals") {
			let t = (i.versions ?? []).map((e) => kC(e.createdAt)).filter((e) => e !== null);
			t.length && (e = Math.min(...t));
		}
		if (e === null) {
			c[t] += 1;
			continue;
		}
		if (e > r) continue;
		let l = EC(TC(e)) - a;
		if (l < 0 || l >= n) continue;
		let u = Math.min(5, Math.floor(l * 6 / n));
		o[u][t] += 1, s[t] += 1;
	}
	let l = AC.map(([e, t, n]) => ({
		id: e,
		label: t,
		tone: n,
		count: 0
	})), u = 0, d = 0;
	for (let t of e.orders ?? []) {
		let e = l.find((e) => e.id === t.status) ?? l.at(-1);
		e.count += 1;
		let n = t.version?.totalCents, r = t.version?.freightCents;
		![n, r].every((e) => Number.isSafeInteger(e) && e >= 0) || !Number.isSafeInteger(n + r) || !Number.isSafeInteger(u + n + r) ? d += 1 : u += n + r;
	}
	return {
		role: t,
		period: {
			days: n,
			start: DC(a),
			end: i
		},
		series: o,
		totals: s,
		omitted: c,
		portfolio: l.filter((e) => e.id !== "other" || e.count),
		orderValueCents: u,
		incompleteOrderValues: d
	};
}
// src/workspace/analytics.tsx
var MC = new Intl.NumberFormat("pt-BR", {
	style: "currency",
	currency: "BRL"
}), NC = (e) => [
	{
		id: "proposals",
		label: "Propostas",
		detail: e === "supplier" ? "propostas enviadas" : "propostas recebidas"
	},
	{
		id: "orders",
		label: "Pedidos",
		detail: "pedidos criados"
	},
	{
		id: "demands",
		label: e === "supplier" ? "Oportunidades" : "Demandas",
		detail: e === "supplier" ? "oportunidades acessíveis criadas" : "demandas criadas"
	}
], PC = (e) => e.reduce((t, n, r) => {
	if (!r) return `M ${n[0]} ${n[1]}`;
	let i = e[r - 1], a = (i[0] + n[0]) / 2;
	return `${t} C ${a} ${i[1]}, ${a} ${n[1]}, ${n[0]} ${n[1]}`;
}, "");
function FC({ records: e, role: t = "buyer", now: n }) {
	let [r, i] = (0, y.useState)(90), [a, o] = (0, y.useState)("proposals"), [s, c] = (0, y.useState)(null), [l] = (0, y.useState)(() => n ?? Date.now()), u = Nu(), d = (0, y.useId)(), f = (0, y.useId)(), p = (0, y.useMemo)(() => jC(e, {
		role: t,
		days: r,
		now: l
	}), [
		e,
		t,
		r,
		l
	]), m = NC(t), h = m.find((e) => e.id === a), g = p.totals[a], _ = Math.max(4, Math.ceil(Math.max(...p.series.map((e) => e[a])) / 4) * 4), v = p.series.map((e, t) => [4 + t * 126.4, 170 - e[a] / _ * 140]), b = s ?? 5, x = v[b], S = p.portfolio.reduce((e, t) => e + t.count, 0), C = p.omitted[a], w = t === "supplier" ? "#/app/fornecedor/oportunidades" : "#/app/comprador/demandas", T = 0;
	return /* @__PURE__ */ (0, Z.jsxs)("section", {
		className: "workspace-insights",
		"data-workspace-insights": !0,
		"aria-label": "Indicadores da operação",
		children: [/* @__PURE__ */ (0, Z.jsxs)("section", {
			className: "workspace-insights__movement",
			"aria-labelledby": d,
			children: [
				/* @__PURE__ */ (0, Z.jsxs)("div", {
					className: "workspace-insights__heading",
					children: [/* @__PURE__ */ (0, Z.jsxs)("div", { children: [/* @__PURE__ */ (0, Z.jsx)("h2", {
						id: d,
						children: "O movimento da sua operação"
					}), /* @__PURE__ */ (0, Z.jsx)("p", { children: "Registros criados no período · horário de São Paulo" })] }), /* @__PURE__ */ (0, Z.jsx)("div", {
						className: "workspace-insights__period",
						"aria-label": "Período dos indicadores",
						children: [
							30,
							60,
							90
						].map((e) => /* @__PURE__ */ (0, Z.jsxs)("button", {
							type: "button",
							"aria-pressed": r === e,
							onClick: () => {
								i(e), c(null);
							},
							children: [e, " dias"]
						}, e))
					})]
				}),
				/* @__PURE__ */ (0, Z.jsx)("div", {
					className: "workspace-insights__tabs",
					"aria-label": "Tipo de atividade",
					children: m.map((e) => /* @__PURE__ */ (0, Z.jsxs)("button", {
						type: "button",
						"aria-label": e.label,
						"aria-pressed": a === e.id,
						onClick: () => {
							o(e.id), c(null);
						},
						children: [/* @__PURE__ */ (0, Z.jsx)("span", { children: e.label }), /* @__PURE__ */ (0, Z.jsx)("span", {
							"aria-hidden": "true",
							children: p.totals[e.id]
						})]
					}, e.id))
				}),
				/* @__PURE__ */ (0, Z.jsxs)("div", {
					className: "workspace-insights__figure",
					children: [
						/* @__PURE__ */ (0, Z.jsx)("output", {
							"data-insight-total": !0,
							"aria-label": `${h.detail}: ${g}`,
							"aria-live": "polite",
							children: /* @__PURE__ */ (0, Z.jsx)(xC, {
								value: g,
								locales: "pt-BR",
								animated: !u,
								"aria-hidden": "true"
							})
						}),
						/* @__PURE__ */ (0, Z.jsxs)("div", { children: [/* @__PURE__ */ (0, Z.jsx)("span", { children: h.detail }), /* @__PURE__ */ (0, Z.jsxs)("small", { children: [
							p.period.start.split("-").reverse().join("/"),
							" a ",
							p.period.end.split("-").reverse().join("/")
						] })] }),
						/* @__PURE__ */ (0, Z.jsx)(yg, {
							size: 24,
							"aria-hidden": "true"
						})
					]
				}),
				/* @__PURE__ */ (0, Z.jsxs)("div", {
					className: "workspace-insights__plot",
					onPointerLeave: () => c(null),
					children: [
						/* @__PURE__ */ (0, Z.jsxs)("svg", {
							viewBox: "0 0 640 200",
							role: "img",
							"aria-label": `${g} ${h.detail} em seis intervalos. Dados na tabela abaixo.`,
							preserveAspectRatio: "none",
							children: [
								[
									0,
									1,
									2,
									3,
									4
								].map((e) => /* @__PURE__ */ (0, Z.jsx)("line", {
									x1: "0",
									x2: "640",
									y1: 30 + e * 35,
									y2: 30 + e * 35,
									className: "workspace-insights__grid"
								}, e)),
								/* @__PURE__ */ (0, Z.jsx)(zu.path, {
									d: PC(v),
									className: "workspace-insights__curve",
									initial: !1,
									animate: { d: PC(v) },
									transition: { duration: u ? 0 : .35 }
								}),
								/* @__PURE__ */ (0, Z.jsx)("line", {
									x1: x[0],
									x2: x[0],
									y1: "25",
									y2: "170",
									className: "workspace-insights__guide"
								}),
								v.map((e, t) => /* @__PURE__ */ (0, Z.jsx)("circle", {
									cx: e[0],
									cy: e[1],
									r: t === b ? 5 : 3,
									className: "workspace-insights__point"
								}, t))
							]
						}),
						/* @__PURE__ */ (0, Z.jsx)("div", {
							className: "workspace-insights__y-axis",
							"aria-hidden": "true",
							children: [
								0,
								1,
								2,
								3,
								4
							].map((e) => /* @__PURE__ */ (0, Z.jsx)("span", {
								style: { top: `${15 + e * 17.5}%` },
								children: _ - e * _ / 4
							}, e))
						}),
						/* @__PURE__ */ (0, Z.jsx)("div", {
							className: "workspace-insights__hit-targets",
							children: p.series.map((e, t) => /* @__PURE__ */ (0, Z.jsx)("button", {
								type: "button",
								"aria-label": `${e.label}: ${e[a]} ${h.detail}`,
								onPointerEnter: () => c(t),
								onFocus: () => c(t),
								onBlur: () => c(null),
								onClick: () => c(t)
							}, e.start))
						})
					]
				}),
				/* @__PURE__ */ (0, Z.jsxs)("div", {
					className: "workspace-insights__axis",
					children: [
						/* @__PURE__ */ (0, Z.jsx)("span", { children: p.series[0].start.split("-").reverse().slice(0, 2).join("/") }),
						/* @__PURE__ */ (0, Z.jsxs)("span", { children: [
							p.series[b].label,
							" ",
							/* @__PURE__ */ (0, Z.jsxs)("strong", { children: [
								p.series[b][a],
								" ",
								h.label.toLocaleLowerCase("pt-BR")
							] })
						] }),
						/* @__PURE__ */ (0, Z.jsx)("span", { children: p.series[5].end.split("-").reverse().slice(0, 2).join("/") })
					]
				}),
				g === 0 && /* @__PURE__ */ (0, Z.jsx)("p", {
					className: "workspace-insights__empty",
					children: "Nenhuma criação registrada neste período."
				}),
				C > 0 && /* @__PURE__ */ (0, Z.jsxs)("p", {
					className: "workspace-insights__note",
					children: [
						C,
						" ",
						h.label.toLocaleLowerCase("pt-BR"),
						" sem data de criação válida não entram nesta série."
					]
				}),
				t === "supplier" && a === "demands" && /* @__PURE__ */ (0, Z.jsx)("p", {
					className: "workspace-insights__note",
					children: "Data de criação das oportunidades atualmente acessíveis; não mede quando foram liberadas."
				}),
				/* @__PURE__ */ (0, Z.jsxs)("details", {
					className: "workspace-insights__data",
					children: [/* @__PURE__ */ (0, Z.jsxs)("summary", { children: [/* @__PURE__ */ (0, Z.jsx)(Ug, {
						size: 15,
						"aria-hidden": "true"
					}), "Consultar dados do período"] }), /* @__PURE__ */ (0, Z.jsx)("div", { children: /* @__PURE__ */ (0, Z.jsxs)("table", { children: [
						/* @__PURE__ */ (0, Z.jsxs)("caption", { children: [
							"Criações por intervalo · ",
							r,
							" dias"
						] }),
						/* @__PURE__ */ (0, Z.jsx)("thead", { children: /* @__PURE__ */ (0, Z.jsxs)("tr", { children: [/* @__PURE__ */ (0, Z.jsx)("th", {
							scope: "col",
							children: "Intervalo"
						}), m.map((e) => /* @__PURE__ */ (0, Z.jsx)("th", {
							scope: "col",
							children: e.label
						}, e.id))] }) }),
						/* @__PURE__ */ (0, Z.jsx)("tbody", { children: p.series.map((e) => /* @__PURE__ */ (0, Z.jsxs)("tr", { children: [/* @__PURE__ */ (0, Z.jsx)("th", {
							scope: "row",
							children: e.label
						}), m.map((t) => /* @__PURE__ */ (0, Z.jsx)("td", { children: e[t.id] }, t.id))] }, e.start)) })
					] }) })]
				})
			]
		}), /* @__PURE__ */ (0, Z.jsxs)("section", {
			className: "workspace-insights__portfolio",
			"aria-labelledby": f,
			children: [
				/* @__PURE__ */ (0, Z.jsxs)("div", {
					className: "workspace-insights__heading",
					children: [/* @__PURE__ */ (0, Z.jsxs)("div", { children: [/* @__PURE__ */ (0, Z.jsx)("h2", {
						id: f,
						children: "Carteira de pedidos"
					}), /* @__PURE__ */ (0, Z.jsx)("p", { children: "Estado atual · todos os períodos" })] }), /* @__PURE__ */ (0, Z.jsx)(zg, {
						size: 19,
						"aria-hidden": "true"
					})]
				}),
				/* @__PURE__ */ (0, Z.jsxs)("div", {
					className: "workspace-insights__donut",
					role: "img",
					"aria-label": `${S} pedidos. ${p.portfolio.map((e) => `${e.label}: ${e.count}`).join(". ")}`,
					children: [/* @__PURE__ */ (0, Z.jsxs)("svg", {
						viewBox: "0 0 140 140",
						"aria-hidden": "true",
						children: [/* @__PURE__ */ (0, Z.jsx)("circle", {
							cx: "70",
							cy: "70",
							r: "55",
							className: "workspace-insights__track"
						}), p.portfolio.filter((e) => e.count).map((e) => {
							let t = e.count / S * 345.575, n = T;
							return T += t, /* @__PURE__ */ (0, Z.jsx)("circle", {
								cx: "70",
								cy: "70",
								r: "55",
								pathLength: "345.575",
								strokeDasharray: `${Math.max(0, t - (p.portfolio.filter((e) => e.count).length > 1 ? 3 : 0))} 345.575`,
								strokeDashoffset: -n,
								className: `workspace-insights__segment workspace-insights__segment--${e.tone}`
							}, e.id);
						})]
					}), /* @__PURE__ */ (0, Z.jsxs)("div", { children: [/* @__PURE__ */ (0, Z.jsx)("strong", {
						"data-portfolio-total": !0,
						children: S
					}), /* @__PURE__ */ (0, Z.jsx)("span", { children: "pedidos" })] })]
				}),
				S ? /* @__PURE__ */ (0, Z.jsx)("ul", {
					className: "workspace-insights__legend",
					children: p.portfolio.filter((e) => e.count).map((e) => /* @__PURE__ */ (0, Z.jsxs)("li", { children: [
						/* @__PURE__ */ (0, Z.jsx)("i", {
							className: `workspace-insights__swatch workspace-insights__swatch--${e.tone}`,
							"aria-hidden": "true"
						}),
						/* @__PURE__ */ (0, Z.jsx)("span", { children: e.label }),
						/* @__PURE__ */ (0, Z.jsx)("strong", { children: e.count })
					] }, e.id))
				}) : /* @__PURE__ */ (0, Z.jsx)("p", {
					className: "workspace-insights__empty",
					children: "Seus pedidos aparecerão aqui após o aceite."
				}),
				/* @__PURE__ */ (0, Z.jsxs)("div", {
					className: "workspace-insights__value",
					children: [
						/* @__PURE__ */ (0, Z.jsx)("span", { children: "Valor registrado em pedidos" }),
						/* @__PURE__ */ (0, Z.jsx)("strong", { children: MC.format(p.orderValueCents / 100) }),
						/* @__PURE__ */ (0, Z.jsxs)("small", { children: [p.incompleteOrderValues ? `${p.incompleteOrderValues} pedido(s) com valor incompleto fora da soma. ` : "", "Inclui frete. Não representa pagamento recebido."] })
					]
				}),
				/* @__PURE__ */ (0, Z.jsxs)("a", {
					className: "workspace-insights__link",
					href: S ? `#/app/${t === "supplier" ? "fornecedor" : "comprador"}/pedidos` : w,
					children: [S ? "Acompanhar pedidos" : t === "supplier" ? "Ver oportunidades" : "Ver minhas demandas", /* @__PURE__ */ (0, Z.jsx)(_g, {
						size: 16,
						"aria-hidden": "true"
					})]
				})
			]
		})]
	});
}
// src/public/entry.tsx
function IC(e, t, n) {
	e.replaceChildren();
	let r = (0, Ru.createRoot)(e);
	return (0, Lu.flushSync)(() => r.render(/* @__PURE__ */ (0, Z.jsx)(Cl, {
		reducedMotion: "user",
		children: /* @__PURE__ */ (0, Z.jsx)("div", {
			className: n,
			children: t
		})
	}))), () => r.unmount();
}
var LC = {
	home: {
		Page: Gx,
		title: "SIVI — O próximo acordo começa aqui."
	},
	about: {
		Page: eS,
		title: "Quem somos — SIVI"
	},
	platform: {
		Page: $x,
		title: "O que fazemos — SIVI"
	},
	faq: {
		Page: nS,
		title: "Perguntas frequentes — SIVI"
	}
};
function RC(e, t = "home") {
	let n = new URLSearchParams(location.hash.split("?")[1]), r = t === "home" ? n.get("pagina") : null, i = n.get("secao"), a = {
		seguranca: "Segurança e dados",
		privacidade: "Política de privacidade",
		condicoes: "Condições de uso",
		ajuda: "Ajuda e acesso",
		creditos: "Créditos"
	};
	if (r && r !== "sobre") return document.title = `${a[r] ?? "Sobre a plataforma"} — SIVI`, IC(e, /* @__PURE__ */ (0, Z.jsx)(oS, { page: r }), "sivi-public-ui");
	(r === "sobre" || t === "home" && i === "visao-geral") && (t = "about"), t === "home" && Zg(i) && (t = "platform"), t === "home" && i === "duvidas" && (t = "faq");
	let { Page: o, title: s } = LC[t];
	return document.title = s, IC(e, /* @__PURE__ */ (0, Z.jsx)(o, {}), "sivi-public-ui");
}
function zC(e, t) {
	return document.title = new URLSearchParams(location.hash.split("?")[1]).get("modo") === "login" ? "Entrar — SIVI" : "Cadastro — SIVI", IC(e, /* @__PURE__ */ (0, Z.jsx)(jS, { bridge: t }), "sivi-auth-ui");
}
function BC(e, t) {
	return IC(e, /* @__PURE__ */ (0, Z.jsx)(FC, { ...t }), "sivi-workspace-ui");
}
export { zC as mountAuthExperience, RC as mountPublicExperience, BC as mountWorkspaceAnalytics };
