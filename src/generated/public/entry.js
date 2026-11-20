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
	function ee(e) {
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
	function N(e, r, i, a, o) {
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
				case d: return c = e._init, N(c(e._payload), r, i, a, o);
			}
		}
		if (c) return o = o(e), c = a === "" ? "." + M(e, 0) : a, C(o) ? (i = "", c != null && (i = c.replace(j, "$&/") + "/"), N(o, r, i, "", function(e) {
			return e;
		})) : o != null && (k(o) && (o = O(o, i + (o.key == null || e && e.key === o.key ? "" : ("" + o.key).replace(j, "$&/") + "/") + c)), r.push(o)), 1;
		c = 0;
		var l = a === "" ? "." : a + ":";
		if (C(e)) for (var u = 0; u < e.length; u++) a = e[u], s = l + M(a, u), c += N(a, r, i, s, o);
		else if (u = h(e), typeof u == "function") for (e = u.call(e), u = 0; !(a = e.next()).done;) a = a.value, s = l + M(a, u++), c += N(a, r, i, s, o);
		else if (s === "object") {
			if (typeof e.then == "function") return N(ee(e), r, i, a, o);
			throw r = String(e), Error("Objects are not valid as a React child (found: " + (r === "[object Object]" ? "object with keys {" + Object.keys(e).join(", ") + "}" : r) + "). If you meant to render a collection of children, use an array instead.");
		}
		return c;
	}
	function P(e, t, n) {
		if (e == null) return e;
		var r = [], i = 0;
		return N(e, r, "", "", function(e) {
			return t.call(n, e, i++);
		}), r;
	}
	function F(e) {
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
	var I = typeof reportError == "function" ? reportError : function(e) {
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
	function te(e) {
		var t = T.T, n = {};
		n.types = t === null ? null : t.types, T.T = n;
		try {
			var r = e(), i = T.S;
			i !== null && i(n, r), typeof r == "object" && r && typeof r.then == "function" && r.then(w, I);
		} catch (e) {
			I(e);
		} finally {
			t !== null && n.types !== null && (t.types = n.types), T.T = t;
		}
	}
	function L(e) {
		var t = T.T;
		if (t !== null) {
			var n = t.types;
			n === null ? t.types = [e] : n.indexOf(e) === -1 && n.push(e);
		} else te(L.bind(null, e));
	}
	var ne = {
		map: P,
		forEach: function(e, t, n) {
			P(e, function() {
				t.apply(this, arguments);
			}, n);
		},
		count: function(e) {
			var t = 0;
			return P(e, function() {
				t++;
			}), t;
		},
		toArray: function(e) {
			return P(e, function(e) {
				return e;
			}) || [];
		},
		only: function(e) {
			if (!k(e)) throw Error("React.Children.only expected to receive a single React element child.");
			return e;
		}
	};
	e.Activity = f, e.Children = ne, e.Component = y, e.Fragment = r, e.Profiler = a, e.PureComponent = x, e.StrictMode = i, e.Suspense = l, e.ViewTransition = p, e.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = T, e.__COMPILER_RUNTIME = {
		__proto__: null,
		c: function(e) {
			return T.H.useMemoCache(e);
		}
	}, e.addTransitionType = L, e.cache = function(e) {
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
			_init: F
		};
	}, e.memo = function(e, t) {
		return {
			$$typeof: u,
			type: e,
			compare: t === void 0 ? null : t
		};
	}, e.startTransition = te, e.unstable_useCacheRefresh = function() {
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
	var D = Object.assign, O = Symbol.for("react.element"), k = Symbol.for("react.transitional.element"), A = Symbol.for("react.portal"), j = Symbol.for("react.fragment"), M = Symbol.for("react.strict_mode"), ee = Symbol.for("react.profiler"), N = Symbol.for("react.consumer"), P = Symbol.for("react.context"), F = Symbol.for("react.forward_ref"), I = Symbol.for("react.suspense"), te = Symbol.for("react.suspense_list"), L = Symbol.for("react.memo"), ne = Symbol.for("react.lazy"), re = Symbol.for("react.activity"), ie = Symbol.for("react.legacy_hidden"), ae = Symbol.for("react.memo_cache_sentinel"), oe = Symbol.for("react.view_transition"), se = Symbol.for("react.recoverable"), ce = Symbol.iterator;
	function R(e) {
		return typeof e != "object" || !e ? null : (e = ce && e[ce] || e["@@iterator"], typeof e == "function" ? e : null);
	}
	var le = Symbol.for("react.client.reference");
	function ue(e) {
		if (e == null) return null;
		if (typeof e == "function") return e.$$typeof === le ? null : e.displayName || e.name || null;
		if (typeof e == "string") return e;
		switch (e) {
			case j: return "Fragment";
			case ee: return "Profiler";
			case M: return "StrictMode";
			case I: return "Suspense";
			case te: return "SuspenseList";
			case re: return "Activity";
			case oe: return "ViewTransition";
		}
		if (typeof e == "object") switch (e.$$typeof) {
			case A: return "Portal";
			case P: return e.displayName || "Context";
			case N: return (e._context.displayName || "Context") + ".Consumer";
			case F:
				var t = e.render;
				return e = e.displayName, e ||= (e = t.displayName || t.name || "", e === "" ? "ForwardRef" : "ForwardRef(" + e + ")"), e;
			case L: return t = e.displayName || null, t === null ? ue(e.type) || "Memo" : t;
			case ne:
				t = e._payload, e = e._init;
				try {
					return ue(e(t));
				} catch {}
		}
		return null;
	}
	var z = Array.isArray, B = n.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, V = r.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, de = {
		pending: !1,
		data: null,
		method: null,
		action: null
	}, fe = [], pe = -1;
	function me(e) {
		return { current: e };
	}
	function he(e) {
		0 > pe || (e.current = fe[pe], fe[pe] = null, pe--);
	}
	function H(e, t) {
		pe++, fe[pe] = e.current, e.current = t;
	}
	var ge = me(null), U = me(null), W = me(null), G = me(null);
	function _e(e, t) {
		switch (H(W, t), H(U, e), H(ge, null), t.nodeType) {
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
		he(ge), H(ge, e);
	}
	function ve() {
		he(ge), he(U), he(W);
	}
	function ye(e) {
		var t = e.memoizedState;
		t !== null && (ch._currentValue = t.memoizedState, H(G, e)), t = ge.current;
		var n = fp(t, e.type);
		t !== n && (H(U, e), H(ge, n));
	}
	function be(e) {
		U.current === e && (he(ge), he(U)), G.current === e && (he(G), ch._currentValue = de);
	}
	var xe, Se;
	function Ce(e) {
		if (xe === void 0) try {
			throw Error();
		} catch (e) {
			var t = e.stack.trim().match(/\n( *(at )?)/);
			xe = t && t[1] || "", Se = -1 < e.stack.indexOf("\n    at") ? " (<anonymous>)" : -1 < e.stack.indexOf("@") ? "@unknown:0:0" : "";
		}
		return "\n" + xe + e + Se;
	}
	var we = !1;
	function Te(e, t) {
		if (!e || we) return "";
		we = !0;
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
			we = !1, Error.prepareStackTrace = n;
		}
		return (n = e ? e.displayName || e.name : "") ? Ce(n) : "";
	}
	function Ee(e, t) {
		switch (e.tag) {
			case 26:
			case 27:
			case 5: return Ce(e.type);
			case 16: return Ce("Lazy");
			case 13: return e.child !== t && t !== null ? Ce("Suspense Fallback") : Ce("Suspense");
			case 19: return Ce("SuspenseList");
			case 0:
			case 15: return Te(e.type, !1);
			case 11: return Te(e.type.render, !1);
			case 1: return Te(e.type, !0);
			case 31: return Ce("Activity");
			case 30: return Ce("ViewTransition");
			default: return "";
		}
	}
	function De(e) {
		try {
			var t = "", n = null;
			do
				t += Ee(e, n), n = e, e = e.return;
			while (e);
			return t;
		} catch (e) {
			return "\nError generating stack: " + e.message + "\n" + e.stack;
		}
	}
	var Oe = Object.prototype.hasOwnProperty, ke = t.unstable_scheduleCallback, Ae = t.unstable_cancelCallback, je = t.unstable_shouldYield, Me = t.unstable_requestPaint, Ne = t.unstable_now, Pe = t.unstable_getCurrentPriorityLevel, Fe = t.unstable_ImmediatePriority, Ie = t.unstable_UserBlockingPriority, Le = t.unstable_NormalPriority, Re = t.unstable_LowPriority, K = t.unstable_IdlePriority, ze = t.log, Be = t.unstable_setDisableYieldValue, Ve = null, He = null;
	function Ue(e) {
		if (typeof ze == "function" && Be(e), He && typeof He.setStrictMode == "function") try {
			He.setStrictMode(Ve, e);
		} catch {}
	}
	var We = Math.clz32 ? Math.clz32 : qe, Ge = Math.log, Ke = Math.LN2;
	function qe(e) {
		return e >>>= 0, e === 0 ? 32 : 31 - (Ge(e) / Ke | 0) | 0;
	}
	var Je = 256, Ye = 262144, Xe = 4194304;
	function Ze(e) {
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
	function Qe(e, t, n) {
		var r = e.pendingLanes;
		if (r === 0) return 0;
		var i = 0, a = e.suspendedLanes, o = e.pingedLanes;
		e = e.warmLanes;
		var s = r & 134217727;
		return s === 0 ? (s = r & ~a, s === 0 ? o === 0 ? n || (n = r & ~e, n !== 0 && (i = Ze(n))) : i = Ze(o) : i = Ze(s)) : (r = s & ~a, r === 0 ? (o &= s, o === 0 ? n || (n = s & ~e, n !== 0 && (i = Ze(n))) : i = Ze(o)) : i = Ze(r)), i === 0 ? 0 : t !== 0 && t !== i && (t & a) === 0 && (a = i & -i, n = t & -t, a >= n || a === 32 && n & 4194048) ? t : i;
	}
	function $e(e, t) {
		return (e.pendingLanes & ~(e.suspendedLanes & ~e.pingedLanes) & t) === 0;
	}
	function et(e, t) {
		t & 8 && (t |= t & 32);
		var n = e.entangledLanes;
		if (n !== 0) for (e = e.entanglements, n &= t; 0 < n;) {
			var r = 31 - We(n), i = 1 << r;
			t |= e[r], n &= ~i;
		}
		return t;
	}
	function tt(e, t) {
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
	function nt() {
		var e = Xe;
		return Xe <<= 1, !(Xe & 62914560) && (Xe = 4194304), e;
	}
	function rt(e) {
		for (var t = [], n = 0; 31 > n; n++) t.push(e);
		return t;
	}
	function it(e, t) {
		e.pendingLanes |= t, t !== 268435456 && (e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0);
	}
	function at(e, t, n, r, i, a) {
		var o = e.pendingLanes;
		e.pendingLanes = n, e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0, e.expiredLanes &= n, e.entangledLanes &= n, e.errorRecoveryDisabledLanes &= n, e.shellSuspendCounter = 0;
		var s = e.entanglements, c = e.expirationTimes, l = e.hiddenUpdates;
		for (n = o & ~n; 0 < n;) {
			var u = 31 - We(n), d = 1 << u;
			s[u] = 0, c[u] = -1;
			var f = l[u];
			if (f !== null) for (l[u] = null, u = 0; u < f.length; u++) {
				var p = f[u];
				p !== null && (p.lane &= -536870913);
			}
			n &= ~d;
		}
		r !== 0 && ot(e, r, 0), a !== 0 && i === 0 && e.tag !== 0 && (e.suspendedLanes |= a & ~(o & ~t));
	}
	function ot(e, t, n) {
		e.pendingLanes |= t, e.suspendedLanes &= ~t;
		var r = 31 - We(t);
		e.entangledLanes |= t, e.entanglements[r] = e.entanglements[r] | 1073741824 | n & 261930;
	}
	function st(e, t) {
		var n = e.entangledLanes |= t;
		for (e = e.entanglements; n;) {
			var r = 31 - We(n), i = 1 << r;
			i & t | e[r] & t && (e[r] |= t), n &= ~i;
		}
	}
	function ct(e, t) {
		var n = t & -t;
		return n = n & 42 ? 1 : lt(n), (n & (e.suspendedLanes | t)) === 0 ? n : 0;
	}
	function lt(e) {
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
	function ut(e) {
		return e &= -e, 2 < e ? 8 < e ? e & 134217727 ? 32 : 268435456 : 8 : 2;
	}
	function dt() {
		var e = V.p;
		return e === 0 ? (e = window.event, e === void 0 ? 32 : wh(e.type)) : e;
	}
	function ft(e, t) {
		var n = V.p;
		try {
			return V.p = e, t();
		} finally {
			V.p = n;
		}
	}
	var pt = Math.random().toString(36).slice(2), mt = "__reactFiber$" + pt, ht = "__reactProps$" + pt, gt = "__reactContainer$" + pt, _t = "__reactEvents$" + pt, vt = "__reactListeners$" + pt, yt = "__reactHandles$" + pt, bt = "__reactResources$" + pt, xt = "__reactMarker$" + pt, St = "__reactLoad$" + pt;
	function Ct(e) {
		delete e[mt], delete e[ht], delete e[vt], delete e[yt];
	}
	function wt(e) {
		var t;
		if (t = e[mt]) return t;
		for (var n = e.parentNode; n;) {
			if (t = n[gt] || n[mt]) {
				if (n = t.alternate, t.child !== null || n !== null && n.child !== null) for (e = pm(e); e !== null;) {
					if (n = e[mt]) return n;
					e = pm(e);
				}
				return t;
			}
			e = n, n = e.parentNode;
		}
		return null;
	}
	function Tt(e) {
		if (e = e[mt] || e[gt]) {
			var t = e.tag;
			if (t === 5 || t === 6 || t === 13 || t === 31 || t === 26 || t === 27 || t === 3) return e;
		}
		return null;
	}
	function Et(e) {
		var t = e.tag;
		if (t === 5 || t === 26 || t === 27 || t === 6) return e.stateNode;
		throw Error(i(33));
	}
	function Dt(e) {
		var t = e[bt];
		return t ||= e[bt] = {
			hoistableStyles: /* @__PURE__ */ new Map(),
			hoistableScripts: /* @__PURE__ */ new Map()
		}, t;
	}
	function Ot(e) {
		e[xt] = !0;
	}
	function kt(e) {
		e[St] = void 0;
	}
	var At = /* @__PURE__ */ new Set(), jt = {};
	function Mt(e, t) {
		Nt(e, t), Nt(e + "Capture", t);
	}
	function Nt(e, t) {
		for (jt[e] = t, e = 0; e < t.length; e++) At.add(t[e]);
	}
	var Pt = RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"), Ft = {}, It = {};
	function Lt(e) {
		return Oe.call(It, e) ? !0 : Oe.call(Ft, e) ? !1 : Pt.test(e) ? It[e] = !0 : (Ft[e] = !0, !1);
	}
	var Rt = !1;
	function zt() {
		var e = Rt;
		return Rt = !1, e;
	}
	function Bt(e, t, n) {
		if (Lt(t)) {
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
	function Vt(e, t, n) {
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
	function Ht(e, t, n, r) {
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
	function Ut(e) {
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
	function Wt(e) {
		var t = e.type;
		return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
	}
	function Gt(e, t, n) {
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
	function Kt(e) {
		if (!e._valueTracker) {
			var t = Wt(e) ? "checked" : "value";
			e._valueTracker = Gt(e, t, "" + e[t]);
		}
	}
	function qt(e) {
		if (!e) return !1;
		var t = e._valueTracker;
		if (!t) return !0;
		var n = t.getValue(), r = "";
		return e && (r = Wt(e) ? e.checked ? "true" : "false" : e.value), e = r, e !== n && (t.setValue(e), !0);
	}
	var Jt = /[\n"\\]/g;
	function Yt(e) {
		return e.replace(Jt, function(e) {
			return "\\" + e.charCodeAt(0).toString(16) + " ";
		});
	}
	function Xt(e, t, n, r, i, a, o, s) {
		e.name = "", o != null && typeof o != "function" && typeof o != "symbol" && typeof o != "boolean" ? e.type = o : e.removeAttribute("type"), t == null ? o !== "submit" && o !== "reset" || e.removeAttribute("value") : o === "number" ? (t === 0 && e.value === "" || e.value != t) && (e.value = "" + Ut(t)) : e.value !== "" + Ut(t) && (e.value = "" + Ut(t)), t == null ? n == null ? r != null && e.removeAttribute("value") : Qt(e, Ut(n)) : o === "number" && e.value == t ? Qt(e, Ut(e.value)) : Qt(e, Ut(t)), i == null && a != null && (e.defaultChecked = !!a), i != null && (e.checked = i && typeof i != "function" && typeof i != "symbol"), s != null && typeof s != "function" && typeof s != "symbol" && typeof s != "boolean" ? e.name = "" + Ut(s) : e.removeAttribute("name");
	}
	function Zt(e, t, n, r, i, a, o, s) {
		if (a != null && typeof a != "function" && typeof a != "symbol" && typeof a != "boolean" && (e.type = a), t != null || n != null) {
			if (!(a !== "submit" && a !== "reset" || t != null)) {
				Kt(e);
				return;
			}
			n = n == null ? "" : "" + Ut(n), t = t == null ? n : "" + Ut(t), s || t === e.value || (e.value = t), e.defaultValue = t;
		}
		r ??= i, r = typeof r != "function" && typeof r != "symbol" && !!r, e.checked = s ? e.checked : !!r, e.defaultChecked = !!r, o != null && typeof o != "function" && typeof o != "symbol" && typeof o != "boolean" && (e.name = o), Kt(e);
	}
	function Qt(e, t) {
		e.defaultValue !== "" + t && (e.defaultValue = "" + t);
	}
	function $t(e, t, n, r) {
		if (e = e.options, t) {
			t = {};
			for (var i = 0; i < n.length; i++) t["$" + n[i]] = !0;
			for (n = 0; n < e.length; n++) i = t.hasOwnProperty("$" + e[n].value), e[n].selected !== i && (e[n].selected = i), i && r && (e[n].defaultSelected = !0);
		} else {
			for (n = "" + Ut(n), t = null, i = 0; i < e.length; i++) {
				if (e[i].value === n) {
					e[i].selected = !0, r && (e[i].defaultSelected = !0);
					return;
				}
				t !== null || e[i].disabled || (t = e[i]);
			}
			t !== null && (t.selected = !0);
		}
	}
	function en(e, t, n) {
		t != null && (t = "" + Ut(t), t !== e.value && (e.value = t), n == null) ? e.defaultValue !== t && (e.defaultValue = t) : e.defaultValue = n == null ? "" : "" + Ut(n);
	}
	function tn(e, t, n, r) {
		if (t == null) {
			if (r != null) {
				if (n != null) throw Error(i(92));
				if (z(r)) {
					if (1 < r.length) throw Error(i(93));
					r = r[0];
				}
				n = r;
			}
			n ??= "", t = n;
		}
		n = Ut(t), e.defaultValue = n, r = e.textContent, r === n && r !== "" && r !== null && (e.value = r), Kt(e);
	}
	function nn(e, t) {
		if (t) {
			var n = e.firstChild;
			if (n && n === e.lastChild && n.nodeType === 3) {
				n.nodeValue = t;
				return;
			}
		}
		e.textContent = t;
	}
	var rn = new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));
	function an(e, t, n) {
		var r = t.indexOf("--") === 0;
		n == null || typeof n == "boolean" || n === "" ? r ? e.setProperty(t, "") : t === "float" ? e.cssFloat = "" : e[t] = "" : r ? e.setProperty(t, n) : typeof n != "number" || n === 0 || rn.has(t) ? t === "float" ? e.cssFloat = n : e[t] = ("" + n).trim() : e[t] = n + "px";
	}
	function on(e, t, n) {
		if (t != null && typeof t != "object") throw Error(i(62));
		if (e = e.style, n != null) {
			for (var r in n) !n.hasOwnProperty(r) || t != null && t.hasOwnProperty(r) || (r.indexOf("--") === 0 ? e.setProperty(r, "") : r === "float" ? e.cssFloat = "" : e[r] = "", Rt = !0);
			for (var a in t) r = t[a], t.hasOwnProperty(a) && n[a] !== r && (an(e, a, r), Rt = !0);
		} else for (var o in t) t.hasOwnProperty(o) && an(e, o, t[o]);
	}
	function sn(e) {
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
	var cn = /* @__PURE__ */ new Map([
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
	]), ln = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
	function un(e) {
		return ln.test("" + e) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : e;
	}
	function dn() {}
	var fn = null;
	function pn(e) {
		return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
	}
	var mn = null, hn = null;
	function gn(e) {
		var t = Tt(e);
		if (t && (e = t.stateNode)) {
			var n = e[ht] || null;
			a: switch (e = t.stateNode, t.type) {
				case "input":
					if (Xt(e, n.value, n.defaultValue, n.defaultValue, n.checked, n.defaultChecked, n.type, n.name), t = n.name, n.type === "radio" && t != null) {
						for (n = e; n.parentNode;) n = n.parentNode;
						for (n = n.querySelectorAll("input[name=\"" + Yt("" + t) + "\"][type=\"radio\"]"), t = 0; t < n.length; t++) {
							var r = n[t];
							if (r !== e && r.form === e.form) {
								var a = r[ht] || null;
								if (!a) throw Error(i(90));
								Xt(r, a.value, a.defaultValue, a.defaultValue, a.checked, a.defaultChecked, a.type, a.name);
							}
						}
						for (t = 0; t < n.length; t++) r = n[t], r.form === e.form && qt(r);
					}
					break a;
				case "textarea":
					en(e, n.value, n.defaultValue);
					break a;
				case "select": t = n.value, t != null && $t(e, !!n.multiple, t, !1);
			}
		}
	}
	var _n = !1;
	function vn(e, t, n) {
		if (_n) return e(t, n);
		_n = !0;
		try {
			return e(t);
		} finally {
			if (_n = !1, (mn !== null || hn !== null) && (zd(), mn && (t = mn, e = hn, hn = mn = null, gn(t), e))) for (t = 0; t < e.length; t++) gn(e[t]);
		}
	}
	function yn(e, t) {
		var n = e.stateNode;
		if (n === null) return null;
		var r = n[ht] || null;
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
	var bn = typeof window < "u" && window.document !== void 0 && window.document.createElement !== void 0, xn = !1;
	if (bn) try {
		var Sn = {};
		Object.defineProperty(Sn, "passive", { get: function() {
			xn = !0;
		} }), window.addEventListener("test", Sn, Sn), window.removeEventListener("test", Sn, Sn);
	} catch {
		xn = !1;
	}
	var Cn = null, wn = null, Tn = null;
	function En() {
		if (Tn) return Tn;
		var e, t = wn, n = t.length, r, i = "value" in Cn ? Cn.value : Cn.textContent, a = i.length;
		for (e = 0; e < n && t[e] === i[e]; e++);
		var o = n - e;
		for (r = 1; r <= o && t[n - r] === i[a - r]; r++);
		return Tn = i.slice(e, 1 < r ? 1 - r : void 0);
	}
	function Dn(e) {
		var t = e.keyCode;
		return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
	}
	function On() {
		return !0;
	}
	function kn() {
		return !1;
	}
	function An(e) {
		function t(t, n, r, i, a) {
			for (var o in this._reactName = t, this._targetInst = r, this.type = n, this.nativeEvent = i, this.target = a, this.currentTarget = null, e) e.hasOwnProperty(o) && (t = e[o], this[o] = t ? t(i) : i[o]);
			return this.isDefaultPrevented = (i.defaultPrevented == null ? !1 === i.returnValue : i.defaultPrevented) ? On : kn, this.isPropagationStopped = kn, this;
		}
		return D(t.prototype, {
			preventDefault: function() {
				this.defaultPrevented = !0;
				var e = this.nativeEvent;
				e && (e.preventDefault ? e.preventDefault() : typeof e.returnValue != "unknown" && (e.returnValue = !1), this.isDefaultPrevented = On);
			},
			stopPropagation: function() {
				var e = this.nativeEvent;
				e && (e.stopPropagation ? e.stopPropagation() : typeof e.cancelBubble != "unknown" && (e.cancelBubble = !0), this.isPropagationStopped = On);
			},
			persist: function() {},
			isPersistent: On
		}), t;
	}
	var jn = {
		eventPhase: 0,
		bubbles: 0,
		cancelable: 0,
		timeStamp: function(e) {
			return e.timeStamp || Date.now();
		},
		defaultPrevented: 0,
		isTrusted: 0
	}, Mn = An(jn), Nn = D({}, jn, {
		view: 0,
		detail: 0
	}), Pn = An(Nn), Fn, In, Ln, Rn = D({}, Nn, {
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
		getModifierState: Yn,
		button: 0,
		buttons: 0,
		relatedTarget: function(e) {
			return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
		},
		movementX: function(e) {
			return "movementX" in e ? e.movementX : (e !== Ln && (Ln && e.type === "mousemove" ? (Fn = e.screenX - Ln.screenX, In = e.screenY - Ln.screenY) : In = Fn = 0, Ln = e), Fn);
		},
		movementY: function(e) {
			return "movementY" in e ? e.movementY : In;
		}
	}), zn = An(Rn), Bn = An(D({}, Rn, { dataTransfer: 0 })), Vn = An(D({}, Nn, { relatedTarget: 0 })), Hn = An(D({}, jn, {
		animationName: 0,
		elapsedTime: 0,
		pseudoElement: 0
	})), Un = An(D({}, jn, { clipboardData: function(e) {
		return "clipboardData" in e ? e.clipboardData : window.clipboardData;
	} })), Wn = An(D({}, jn, { data: 0 })), Gn = {
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
	}, Kn = {
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
	}, qn = {
		Alt: "altKey",
		Control: "ctrlKey",
		Meta: "metaKey",
		Shift: "shiftKey"
	};
	function Jn(e) {
		var t = this.nativeEvent;
		return t.getModifierState ? t.getModifierState(e) : (e = qn[e]) ? !!t[e] : !1;
	}
	function Yn() {
		return Jn;
	}
	var Xn = An(D({}, Nn, {
		key: function(e) {
			if (e.key) {
				var t = Gn[e.key] || e.key;
				if (t !== "Unidentified") return t;
			}
			return e.type === "keypress" ? (e = Dn(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? Kn[e.keyCode] || "Unidentified" : "";
		},
		code: 0,
		location: 0,
		ctrlKey: 0,
		shiftKey: 0,
		altKey: 0,
		metaKey: 0,
		repeat: 0,
		locale: 0,
		getModifierState: Yn,
		charCode: function(e) {
			return e.type === "keypress" ? Dn(e) : 0;
		},
		keyCode: function(e) {
			return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
		},
		which: function(e) {
			return e.type === "keypress" ? Dn(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
		}
	})), Zn = An(D({}, Rn, {
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
	})), Qn = An(D({}, jn, { submitter: 0 })), $n = An(D({}, Nn, {
		touches: 0,
		targetTouches: 0,
		changedTouches: 0,
		altKey: 0,
		metaKey: 0,
		ctrlKey: 0,
		shiftKey: 0,
		getModifierState: Yn
	})), er = An(D({}, jn, {
		propertyName: 0,
		elapsedTime: 0,
		pseudoElement: 0
	})), tr = An(D({}, Rn, {
		deltaX: function(e) {
			return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
		},
		deltaY: function(e) {
			return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
		},
		deltaZ: 0,
		deltaMode: 0
	})), nr = An(D({}, jn, {
		newState: 0,
		oldState: 0,
		source: 0
	})), rr = [
		9,
		13,
		27,
		32
	], ir = bn && "CompositionEvent" in window, ar = null;
	bn && "documentMode" in document && (ar = document.documentMode);
	var or = bn && "TextEvent" in window && !ar, sr = bn && (!ir || ar && 8 < ar && 11 >= ar), cr = " ", lr = !1;
	function ur(e, t) {
		switch (e) {
			case "keyup": return rr.indexOf(t.keyCode) !== -1;
			case "keydown": return t.keyCode !== 229;
			case "keypress":
			case "mousedown":
			case "focusout": return !0;
			default: return !1;
		}
	}
	function dr(e) {
		return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
	}
	var fr = !1;
	function pr(e, t) {
		switch (e) {
			case "compositionend": return dr(t);
			case "keypress": return t.which === 32 ? (lr = !0, cr) : null;
			case "textInput": return e = t.data, e === cr && lr ? null : e;
			default: return null;
		}
	}
	function mr(e, t) {
		if (fr) return e === "compositionend" || !ir && ur(e, t) ? (e = En(), Tn = wn = Cn = null, fr = !1, e) : null;
		switch (e) {
			case "paste": return null;
			case "keypress":
				if (!(t.ctrlKey || t.altKey || t.metaKey) || t.ctrlKey && t.altKey) {
					if (t.char && 1 < t.char.length) return t.char;
					if (t.which) return String.fromCharCode(t.which);
				}
				return null;
			case "compositionend": return sr && t.locale !== "ko" ? null : t.data;
			default: return null;
		}
	}
	var hr = {
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
	function gr(e) {
		var t = e && e.nodeName && e.nodeName.toLowerCase();
		return t === "input" ? !!hr[e.type] : t === "textarea";
	}
	function _r(e, t, n, r) {
		mn ? hn ? hn.push(r) : hn = [r] : mn = r, t = Yf(t, "onChange"), 0 < t.length && (n = new Mn("onChange", "change", null, n, r), e.push({
			event: n,
			listeners: t
		}));
	}
	var vr = null, yr = null;
	function br(e) {
		Hf(e, 0);
	}
	function xr(e) {
		if (qt(Et(e))) return e;
	}
	function Sr(e, t) {
		if (e === "change") return t;
	}
	var Cr = !1;
	if (bn) {
		var wr;
		if (bn) {
			var Tr = "oninput" in document;
			if (!Tr) {
				var Er = document.createElement("div");
				Er.setAttribute("oninput", "return;"), Tr = typeof Er.oninput == "function";
			}
			wr = Tr;
		} else wr = !1;
		Cr = wr && (!document.documentMode || 9 < document.documentMode);
	}
	function Dr() {
		vr && (vr.detachEvent("onpropertychange", Or), yr = vr = null);
	}
	function Or(e) {
		if (e.propertyName === "value" && xr(yr)) {
			var t = [];
			_r(t, yr, e, pn(e)), vn(br, t);
		}
	}
	function kr(e, t, n) {
		e === "focusin" ? (Dr(), vr = t, yr = n, vr.attachEvent("onpropertychange", Or)) : e === "focusout" && Dr();
	}
	function Ar(e) {
		if (e === "selectionchange" || e === "keyup" || e === "keydown") return xr(yr);
	}
	function jr(e, t) {
		if (e === "click") return xr(t);
	}
	function Mr(e, t) {
		if (e === "input" || e === "change") return xr(t);
	}
	function Nr(e, t) {
		return e === t && (e !== 0 || 1 / e == 1 / t) || e !== e && t !== t;
	}
	var Pr = typeof Object.is == "function" ? Object.is : Nr;
	function Fr(e, t) {
		if (Pr(e, t)) return !0;
		if (typeof e != "object" || !e || typeof t != "object" || !t) return !1;
		var n = Object.keys(e), r = Object.keys(t);
		if (n.length !== r.length) return !1;
		for (r = 0; r < n.length; r++) {
			var i = n[r];
			if (!Oe.call(t, i) || !Pr(e[i], t[i])) return !1;
		}
		return !0;
	}
	function Ir(e) {
		if (e ||= typeof document < "u" ? document : void 0, e === void 0) return null;
		try {
			return e.activeElement || e.body;
		} catch {
			return e.body;
		}
	}
	function Lr(e) {
		for (; e && e.firstChild;) e = e.firstChild;
		return e;
	}
	function Rr(e, t) {
		var n = Lr(e);
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
			n = Lr(n);
		}
	}
	function zr(e, t) {
		return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? zr(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
	}
	function Br(e) {
		e = e != null && e.ownerDocument != null && e.ownerDocument.defaultView != null ? e.ownerDocument.defaultView : window;
		for (var t = Ir(e.document); t instanceof e.HTMLIFrameElement;) {
			try {
				var n = typeof t.contentWindow.location.href == "string";
			} catch {
				n = !1;
			}
			if (n) e = t.contentWindow;
			else break;
			t = Ir(e.document);
		}
		return t;
	}
	function Vr(e) {
		var t = e && e.nodeName && e.nodeName.toLowerCase();
		return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
	}
	var Hr = bn && "documentMode" in document && 11 >= document.documentMode, Ur = null, Wr = null, Gr = null, Kr = !1;
	function qr(e, t, n) {
		var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
		Kr || Ur == null || Ur !== Ir(r) || (r = Ur, "selectionStart" in r && Vr(r) ? r = {
			start: r.selectionStart,
			end: r.selectionEnd
		} : (r = (r.ownerDocument && r.ownerDocument.defaultView || window).getSelection(), r = {
			anchorNode: r.anchorNode,
			anchorOffset: r.anchorOffset,
			focusNode: r.focusNode,
			focusOffset: r.focusOffset
		}), Gr && Fr(Gr, r) || (Gr = r, r = Yf(Wr, "onSelect"), 0 < r.length && (t = new Mn("onSelect", "select", null, t, n), e.push({
			event: t,
			listeners: r
		}), t.target = Ur)));
	}
	function Jr(e, t) {
		var n = {};
		return n[e.toLowerCase()] = t.toLowerCase(), n["Webkit" + e] = "webkit" + t, n["Moz" + e] = "moz" + t, n;
	}
	var Yr = {
		animationend: Jr("Animation", "AnimationEnd"),
		animationiteration: Jr("Animation", "AnimationIteration"),
		animationstart: Jr("Animation", "AnimationStart"),
		transitionrun: Jr("Transition", "TransitionRun"),
		transitionstart: Jr("Transition", "TransitionStart"),
		transitioncancel: Jr("Transition", "TransitionCancel"),
		transitionend: Jr("Transition", "TransitionEnd")
	}, Xr = {}, Zr = {};
	bn && (Zr = document.createElement("div").style, "AnimationEvent" in window || (delete Yr.animationend.animation, delete Yr.animationiteration.animation, delete Yr.animationstart.animation), "TransitionEvent" in window || delete Yr.transitionend.transition);
	function Qr(e) {
		if (Xr[e]) return Xr[e];
		if (!Yr[e]) return e;
		var t = Yr[e], n;
		for (n in t) if (t.hasOwnProperty(n) && n in Zr) return Xr[e] = t[n];
		return e;
	}
	var $r = Qr("animationend"), ei = Qr("animationiteration"), ti = Qr("animationstart"), ni = Qr("transitionrun"), ri = Qr("transitionstart"), ii = Qr("transitioncancel"), ai = Qr("transitionend"), oi = /* @__PURE__ */ new Map(), si = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error fullscreenChange fullscreenError gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
	si.push("scrollEnd");
	function ci(e, t) {
		oi.set(e, t), Mt(t, [e]);
	}
	var li = 0;
	function ui(e, t) {
		if (e.name != null && e.name !== "auto") return e.name;
		if (t.autoName !== null) return t.autoName;
		e = bd.identifierPrefix;
		var n = li++;
		return e = "_" + e + "t_" + n.toString(32) + "_", t.autoName = e;
	}
	function di(e) {
		if (e == null || typeof e == "string") return e;
		var t = null, n = Od;
		if (n !== null) for (var r = 0; r < n.length; r++) {
			var i = e[n[r]];
			if (i != null) {
				if (i === "none") return "none";
				t = t == null ? i : t + (" " + i);
			}
		}
		return t ?? e.default;
	}
	function fi(e, t) {
		return e = di(e), t = di(t), t == null ? e === "auto" ? null : e : t === "auto" ? null : t;
	}
	var pi = typeof reportError == "function" ? reportError : function(e) {
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
	}, mi = [], hi = 0, gi = 0;
	function _i() {
		for (var e = hi, t = gi = hi = 0; t < e;) {
			var n = mi[t];
			mi[t++] = null;
			var r = mi[t];
			mi[t++] = null;
			var i = mi[t];
			mi[t++] = null;
			var a = mi[t];
			if (mi[t++] = null, r !== null && i !== null) {
				var o = r.pending;
				o === null ? i.next = i : (i.next = o.next, o.next = i), r.pending = i;
			}
			a !== 0 && xi(n, i, a);
		}
	}
	function vi(e, t, n, r) {
		mi[hi++] = e, mi[hi++] = t, mi[hi++] = n, mi[hi++] = r, gi |= r, e.lanes |= r, e = e.alternate, e !== null && (e.lanes |= r);
	}
	function yi(e, t, n, r) {
		return vi(e, t, n, r), Si(e);
	}
	function bi(e, t) {
		return vi(e, null, null, t), Si(e);
	}
	function xi(e, t, n) {
		e.lanes |= n;
		var r = e.alternate;
		r !== null && (r.lanes |= n);
		for (var i = !1, a = e.return; a !== null;) a.childLanes |= n, r = a.alternate, r !== null && (r.childLanes |= n), a.tag === 22 && (e = a.stateNode, e === null || e._visibility & 1 || (i = !0)), e = a, a = a.return;
		return e.tag === 3 ? (a = e.stateNode, i && t !== null && (i = 31 - We(n), e = a.hiddenUpdates, r = e[i], r === null ? e[i] = [t] : r.push(t), t.lane = n | 536870912), a) : null;
	}
	function Si(e) {
		if (50 < kd) throw kd = 0, Ad = null, Error(i(185));
		for (var t = e.return; t !== null;) e = t, t = e.return;
		return e.tag === 3 ? e.stateNode : null;
	}
	var Ci = {};
	function wi(e, t, n, r) {
		this.tag = e, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = r, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
	}
	function Ti(e, t, n, r) {
		return new wi(e, t, n, r);
	}
	function Ei(e) {
		return e = e.prototype, !(!e || !e.isReactComponent);
	}
	function Di(e, t) {
		var n = e.alternate;
		return n === null ? (n = Ti(e.tag, t, e.key, e.mode), n.elementType = e.elementType, n.type = e.type, n.stateNode = e.stateNode, n.alternate = e, e.alternate = n) : (n.pendingProps = t, n.type = e.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null), n.flags = e.flags & 1206910976, n.childLanes = e.childLanes, n.lanes = e.lanes, n.child = e.child, n.memoizedProps = e.memoizedProps, n.memoizedState = e.memoizedState, n.updateQueue = e.updateQueue, t = e.dependencies, n.dependencies = t === null ? null : {
			lanes: t.lanes,
			firstContext: t.firstContext
		}, n.sibling = e.sibling, n.index = e.index, n.ref = e.ref, n.refCleanup = e.refCleanup, n;
	}
	function Oi(e, t) {
		e.flags &= 1206910978;
		var n = e.alternate;
		return n === null ? (e.childLanes = 0, e.lanes = t, e.child = null, e.subtreeFlags = 0, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null) : (e.childLanes = n.childLanes, e.lanes = n.lanes, e.child = n.child, e.subtreeFlags = 0, e.deletions = null, e.memoizedProps = n.memoizedProps, e.memoizedState = n.memoizedState, e.updateQueue = n.updateQueue, e.type = n.type, t = n.dependencies, e.dependencies = t === null ? null : {
			lanes: t.lanes,
			firstContext: t.firstContext
		}), e;
	}
	function ki(e, t, n, r, a, o) {
		var s = 0;
		if (r = e, typeof r == "function") Ei(r) && (s = 1);
		else if (typeof r == "string") s = Jm(e, n, ge.current) ? 26 : e === "html" || e === "head" || e === "body" ? 27 : 5;
		else a: switch (r) {
			case re: return e = Ti(31, n, t, a), e.elementType = re, e.lanes = o, e;
			case j: return Ai(n.children, a, o, t);
			case M:
				s = 8, a |= 24;
				break;
			case ee: return e = Ti(12, n, t, a | 2), e.elementType = ee, e.lanes = o, e;
			case I: return e = Ti(13, n, t, a), e.elementType = I, e.lanes = o, e;
			case te: return e = Ti(19, n, t, a), e.elementType = te, e.lanes = o, e;
			case ie:
			case oe: return e = a | 32, e = Ti(30, n, t, e), e.elementType = oe, e.lanes = o, e.stateNode = {
				autoName: null,
				paired: null,
				clones: null,
				ref: null
			}, e;
			default:
				if (typeof r == "object" && r) switch (r.$$typeof) {
					case P:
						s = 10;
						break a;
					case N:
						s = 9;
						break a;
					case F:
						s = 11;
						break a;
					case L:
						s = 14;
						break a;
					case ne:
						s = 16, r = null;
						break a;
				}
				s = 29, n = Error(i(130, e === null ? "null" : typeof e, "")), r = null;
		}
		return t = Ti(s, n, t, a), t.elementType = e, t.type = r, t.lanes = o, t;
	}
	function Ai(e, t, n, r) {
		return e = Ti(7, e, r, t), e.lanes = n, e;
	}
	function ji(e, t, n) {
		return e = Ti(6, e, null, t), e.lanes = n, e;
	}
	function Mi(e) {
		var t = Ti(18, null, null, 0);
		return t.stateNode = e, t;
	}
	function Ni(e, t, n) {
		return t = Ti(4, e.children === null ? [] : e.children, e.key, t), t.lanes = n, t.stateNode = {
			containerInfo: e.containerInfo,
			pendingChildren: null,
			implementation: e.implementation
		}, t;
	}
	var Pi = /* @__PURE__ */ new WeakMap();
	function Fi(e, t) {
		if (typeof e == "object" && e) {
			var n = Pi.get(e);
			return n === void 0 ? (t = {
				value: e,
				source: t,
				stack: De(t)
			}, Pi.set(e, t), t) : n;
		}
		return {
			value: e,
			source: t,
			stack: De(t)
		};
	}
	var Ii = [], Li = 0, Ri = null, zi = 0, Bi = [], Vi = 0, Hi = null, Ui = 1, Wi = "";
	function Gi(e, t) {
		Ii[Li++] = zi, Ii[Li++] = Ri, Ri = e, zi = t;
	}
	function Ki(e, t, n) {
		Bi[Vi++] = Ui, Bi[Vi++] = Wi, Bi[Vi++] = Hi, Hi = e;
		var r = Ui;
		e = Wi;
		var i = 32 - We(r) - 1;
		r &= ~(1 << i), n += 1;
		var a = 32 - We(t) + i;
		if (30 < a) {
			var o = i - i % 5;
			a = (r & (1 << o) - 1).toString(32), r >>= o, i -= o, Ui = 1 << 32 - We(t) + i | n << i | r, Wi = a + e;
		} else Ui = 1 << a | n << i | r, Wi = e;
	}
	function qi(e) {
		e.return !== null && (Gi(e, 1), Ki(e, 1, 0));
	}
	function Ji(e) {
		for (; e === Ri;) Ri = Ii[--Li], Ii[Li] = null, zi = Ii[--Li], Ii[Li] = null;
		for (; e === Hi;) Hi = Bi[--Vi], Bi[Vi] = null, Wi = Bi[--Vi], Bi[Vi] = null, Ui = Bi[--Vi], Bi[Vi] = null;
	}
	function Yi(e, t) {
		Bi[Vi++] = Ui, Bi[Vi++] = Wi, Bi[Vi++] = Hi, Ui = t.id, Wi = t.overflow, Hi = e;
	}
	var Xi = null, Zi = null, q = !1, Qi = null, $i = !1, ea = Error(i(519));
	function ta(e) {
		throw sa(Fi(Error(i(418, 1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML", "")), e)), ea;
	}
	function na(e) {
		var t = e.stateNode, n = e.type, r = e.memoizedProps;
		switch (t[mt] = e, t[ht] = r, n) {
			case "dialog":
				Z("cancel", t), Z("close", t);
				break;
			case "iframe":
			case "object":
			case "embed":
				Z("load", t);
				break;
			case "video":
			case "audio":
				for (n = 0; n < Bf.length; n++) Z(Bf[n], t);
				break;
			case "source":
				Z("error", t);
				break;
			case "img":
			case "image":
			case "link":
				Z("error", t), Z("load", t);
				break;
			case "details":
				Z("toggle", t);
				break;
			case "input":
				Z("invalid", t), Zt(t, r.value, r.defaultValue, r.checked, r.defaultChecked, r.type, r.name, !0);
				break;
			case "select":
				Z("invalid", t);
				break;
			case "textarea": Z("invalid", t), tn(t, r.value, r.defaultValue, r.children);
		}
		n = r.children, typeof n != "string" && typeof n != "number" && typeof n != "bigint" || t.textContent === "" + n || !0 === r.suppressHydrationWarning || tp(t.textContent, n) ? (r.popover != null && (Z("beforetoggle", t), Z("toggle", t)), r.onScroll != null && Z("scroll", t), r.onScrollEnd != null && Z("scrollend", t), r.onClick != null && (t.onclick = dn), t = !0) : t = !1, t || ta(e, !0);
	}
	function ra(e) {
		for (Xi = e.return; Xi;) switch (Xi.tag) {
			case 5:
			case 31:
			case 13:
				$i = !1;
				return;
			case 27:
			case 3:
				$i = !0;
				return;
			default: Xi = Xi.return;
		}
	}
	function ia(e) {
		if (e !== Xi) return !1;
		if (!q) return ra(e), q = !0, !1;
		var t = e.tag, n;
		if ((n = t !== 3 && t !== 27) && ((n = t === 5) && (n = e.type, n = n === "form" || n === "button" || mp(e.type, e.memoizedProps)), n = !n), n && Zi && ta(e), ra(e), t === 13) {
			if (e = e.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(i(317));
			Zi = fm(e);
		} else if (t === 31) {
			if (e = e.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(i(317));
			Zi = fm(e);
		} else t === 27 ? (t = Zi, Cp(e.type) ? (e = dm, dm = null, Zi = e) : Zi = t) : Zi = Xi ? um(e.stateNode.nextSibling) : null;
		return !0;
	}
	function aa() {
		Zi = Xi = null, q = !1;
	}
	function oa() {
		var e = Qi;
		return e !== null && (fd === null ? fd = e : fd.push.apply(fd, e), Qi = null), e;
	}
	function sa(e) {
		Qi === null ? Qi = [e] : Qi.push(e);
	}
	var ca = me(null), la = null, ua = null;
	function da(e, t, n) {
		H(ca, t._currentValue), t._currentValue = n;
	}
	function fa(e) {
		e._currentValue = ca.current, he(ca);
	}
	function pa(e, t, n) {
		for (; e !== null;) {
			var r = e.alternate;
			if ((e.childLanes & t) === t ? r !== null && (r.childLanes & t) !== t && (r.childLanes |= t) : (e.childLanes |= t, r !== null && (r.childLanes |= t)), e === n) break;
			e = e.return;
		}
	}
	function ma(e, t, n, r) {
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
						o.lanes |= n, c = o.alternate, c !== null && (c.lanes |= n), pa(o.return, n, e), r || (s = null);
						break a;
					}
					o = c.next;
				}
			} else if (a.tag === 18) {
				if (s = a.return, s === null) throw Error(i(341));
				s.lanes |= n, o = s.alternate, o !== null && (o.lanes |= n), pa(s, n, e), s = null;
			} else a.tag === 13 && a.memoizedState !== null && a.memoizedState.dehydrated === null ? (a.lanes |= n, s = a.alternate, s !== null && (s.lanes |= n), pa(a.return, n, e), s = a.child, s = s === null ? null : s.sibling) : s = a.child;
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
	function ha(e, t, n, r) {
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
					Pr(a.pendingProps.value, s.value) || (e === null ? e = [c] : e.push(c));
				}
			} else if (a === G.current) {
				if (s = a.alternate, s === null) throw Error(i(387));
				s.memoizedState.memoizedState !== a.memoizedState.memoizedState && (e === null ? e = [ch] : e.push(ch));
			}
			a = a.return;
		}
		return e !== null && ma(t, e, n, r), t.flags |= 262144, e !== null;
	}
	function ga(e) {
		for (e = e.firstContext; e !== null;) {
			if (!Pr(e.context._currentValue, e.memoizedValue)) return !0;
			e = e.next;
		}
		return !1;
	}
	function _a(e) {
		la = e, ua = null, e = e.dependencies, e !== null && (e.firstContext = null);
	}
	function va(e) {
		return ba(la, e);
	}
	function ya(e, t) {
		return la === null && _a(e), ba(e, t);
	}
	function ba(e, t) {
		var n = t._currentValue;
		if (t = {
			context: t,
			memoizedValue: n,
			next: null
		}, ua === null) {
			if (e === null) throw Error(i(308));
			ua = t, e.dependencies = {
				lanes: 0,
				firstContext: t
			}, e.flags |= 524288;
		} else ua = ua.next = t;
		return n;
	}
	var xa = typeof AbortController < "u" ? AbortController : function() {
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
	}, Sa = t.unstable_scheduleCallback, Ca = t.unstable_NormalPriority, wa = {
		$$typeof: P,
		Consumer: null,
		Provider: null,
		_currentValue: null,
		_currentValue2: null,
		_threadCount: 0
	};
	function Ta() {
		return {
			controller: new xa(),
			data: /* @__PURE__ */ new Map(),
			refCount: 0
		};
	}
	function Ea(e) {
		e.refCount--, e.refCount === 0 && Sa(Ca, function() {
			e.controller.abort();
		});
	}
	function Da(e, t) {
		if (e.pendingLanes & 4194048) {
			var n = e.transitionTypes;
			for (n === null && (n = e.transitionTypes = []), e = 0; e < t.length; e++) {
				var r = t[e];
				n.indexOf(r) === -1 && n.push(r);
			}
		}
	}
	var Oa = null;
	function ka(e) {
		var t = e.transitionTypes;
		return e.transitionTypes = null, t;
	}
	var Aa = null, ja = 0, Ma = 0, Na = null;
	function Pa(e, t) {
		if (Aa === null) {
			var n = Aa = [];
			ja = 0, Ma = Ff(), Na = {
				status: "pending",
				value: void 0,
				then: function(e) {
					n.push(e);
				}
			};
		}
		return ja++, t.then(Fa, Fa), t;
	}
	function Fa() {
		if (--ja === 0 && (Oa = null, Aa !== null)) {
			Na !== null && (Na.status = "fulfilled");
			var e = Aa;
			Aa = null, Ma = 0, Na = null;
			for (var t = 0; t < e.length; t++) (0, e[t])();
		}
	}
	function Ia(e, t) {
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
	var La = B.S;
	B.S = function(e, t) {
		if (hd = Ne(), typeof t == "object" && t && typeof t.then == "function" && Pa(e, t), Oa !== null) for (var n = xf; n !== null;) Da(n, Oa), n = n.next;
		if (n = e.types, n !== null) {
			for (var r = xf; r !== null;) Da(r, n), r = r.next;
			if (Ma !== 0) {
				r = Oa, r === null && (r = Oa = []);
				for (var i = 0; i < n.length; i++) {
					var a = n[i];
					r.indexOf(a) === -1 && r.push(a);
				}
			}
		}
		La !== null && La(e, t);
	};
	var Ra = me(null);
	function za() {
		var e = Ra.current;
		return e === null ? Zu.pooledCache : e;
	}
	function Ba(e, t) {
		t === null ? H(Ra, Ra.current) : H(Ra, t.pool);
	}
	function Va() {
		var e = za();
		return e === null ? null : {
			parent: wa._currentValue,
			pool: e
		};
	}
	var Ha = Error(i(460)), Ua = Error(i(474)), Wa = Error(i(542)), Ga = { then: function() {} };
	function Ka(e) {
		return e = e.status, e === "fulfilled" || e === "rejected";
	}
	function qa(e, t, n) {
		switch (n = e[n], n === void 0 ? e.push(t) : n !== t && (t.then(dn, dn), t = n), t.status) {
			case "fulfilled": return t.value;
			case "rejected": throw e = t.reason, Za(e), e === void 0 && !("reason" in t) ? Error(i(600)) : e;
			default:
				if (typeof t.status == "string") t.then(dn, dn);
				else {
					if (e = Zu, e !== null && 100 < e.shellSuspendCounter) throw Error(i(482));
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
					case "rejected": throw e = t.reason, Za(e), e;
				}
				throw Ya = t, Ha;
		}
	}
	function Ja(e) {
		try {
			var t = e._init;
			return t(e._payload);
		} catch (e) {
			throw typeof e == "object" && e && typeof e.then == "function" ? (Ya = e, Ha) : e;
		}
	}
	var Ya = null;
	function Xa() {
		if (Ya === null) throw Error(i(459));
		var e = Ya;
		return Ya = null, e;
	}
	function Za(e) {
		if (e === Ha || e === Wa) throw Error(i(483));
	}
	var Qa = null, $a = 0;
	function eo(e) {
		var t = $a;
		return $a += 1, Qa === null && (Qa = []), qa(Qa, e, t);
	}
	function to(e, t) {
		t = t.props.ref, e.ref = t === void 0 ? null : t;
	}
	function no(e, t) {
		throw t.$$typeof === O ? Error(i(525)) : (e = Object.prototype.toString.call(t), Error(i(31, e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e)));
	}
	function ro(e) {
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
			return e = Di(e, t), e.index = 0, e.sibling = null, e;
		}
		function o(t, n, r) {
			return t.index = r, e ? (r = t.alternate, r === null ? (t.flags |= 134217730, n) : (r = r.index, r < n ? (t.flags |= 2, n) : r)) : (t.flags |= 1048576, n);
		}
		function s(t) {
			return e && t.alternate === null && (t.flags |= 134217730), t;
		}
		function c(e, t, n, r) {
			return t === null || t.tag !== 6 ? (t = ji(n, e.mode, r), t.return = e, t) : (t = a(t, n), t.return = e, t);
		}
		function l(e, t, n, r) {
			var i = n.type;
			return i === j ? (e = d(e, t, n.props.children, r, n.key), to(e, n), e) : t !== null && (t.elementType === i || typeof i == "object" && i && i.$$typeof === ne && Ja(i) === t.type) ? (t = a(t, n.props), to(t, n), t.return = e, t) : (t = ki(n.type, n.key, n.props, null, e.mode, r), to(t, n), t.return = e, t);
		}
		function u(e, t, n, r) {
			return t === null || t.tag !== 4 || t.stateNode.containerInfo !== n.containerInfo || t.stateNode.implementation !== n.implementation ? (t = Ni(n, e.mode, r), t.return = e, t) : (t = a(t, n.children || []), t.return = e, t);
		}
		function d(e, t, n, r, i) {
			return t === null || t.tag !== 7 ? (t = Ai(n, e.mode, r, i), t.return = e, t) : (t = a(t, n), t.return = e, t);
		}
		function f(e, t, n) {
			if (typeof t == "string" && t !== "" || typeof t == "number" || typeof t == "bigint") return t = ji("" + t, e.mode, n), t.return = e, t;
			if (typeof t == "object" && t) {
				switch (t.$$typeof) {
					case k: return n = ki(t.type, t.key, t.props, null, e.mode, n), to(n, t), n.return = e, n;
					case A: return t = Ni(t, e.mode, n), t.return = e, t;
					case ne: return t = Ja(t), f(e, t, n);
				}
				if (z(t) || R(t)) return t = Ai(t, e.mode, n, null), t.return = e, t;
				if (typeof t.then == "function") return f(e, eo(t), n);
				if (t.$$typeof === P) return f(e, ya(e, t), n);
				no(e, t);
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
					case ne: return n = Ja(n), p(e, t, n, r);
				}
				if (z(n) || R(n)) return i === null ? d(e, t, n, r, null) : null;
				if (typeof n.then == "function") return p(e, t, eo(n), r);
				if (n.$$typeof === P) return p(e, t, ya(e, n), r);
				no(e, n);
			}
			return null;
		}
		function m(e, t, n, r, i) {
			if (typeof r == "string" && r !== "" || typeof r == "number" || typeof r == "bigint") return e = e.get(n) || null, c(t, e, "" + r, i);
			if (typeof r == "object" && r) {
				switch (r.$$typeof) {
					case k: return e = e.get(r.key === null ? n : r.key) || null, l(t, e, r, i);
					case A: return e = e.get(r.key === null ? n : r.key) || null, u(t, e, r, i);
					case ne: return r = Ja(r), m(e, t, n, r, i);
				}
				if (z(r) || R(r)) return e = e.get(n) || null, d(t, e, r, i, null);
				if (typeof r.then == "function") return m(e, t, n, eo(r), i);
				if (r.$$typeof === P) return m(e, t, n, ya(t, r), i);
				no(t, r);
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
			if (h === s.length) return n(i, d), q && Gi(i, h), l;
			if (d === null) {
				for (; h < s.length; h++) d = f(i, s[h], c), d !== null && (a = o(d, a, h), u === null ? l = d : u.sibling = d, u = d);
				return q && Gi(i, h), l;
			}
			for (d = r(d); h < s.length; h++) g = m(d, i, h, s[h], c), g !== null && (e && (_ = g.alternate, _ !== null && d.delete(_.key === null ? h : _.key)), a = o(g, a, h), u === null ? l = g : u.sibling = g, u = g);
			return e && d.forEach(function(e) {
				return t(i, e);
			}), q && Gi(i, h), l;
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
			if (v.done) return n(a, h), q && Gi(a, g), u;
			if (h === null) {
				for (; !v.done; g++, v = c.next()) v = f(a, v.value, l), v !== null && (s = o(v, s, g), d === null ? u = v : d.sibling = v, d = v);
				return q && Gi(a, g), u;
			}
			for (h = r(h); !v.done; g++, v = c.next()) v = m(h, a, g, v.value, l), v !== null && (e && (_ = v.alternate, _ !== null && h.delete(_.key === null ? g : _.key)), s = o(v, s, g), d === null ? u = v : d.sibling = v, d = v);
			return e && h.forEach(function(e) {
				return t(a, e);
			}), q && Gi(a, g), u;
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
											n(e, r.sibling), c = a(r, o.props.children), to(c, o), c.return = e, e = c;
											break a;
										}
									} else if (r.elementType === l || typeof l == "object" && l && l.$$typeof === ne && Ja(l) === r.type) {
										n(e, r.sibling), c = a(r, o.props), to(c, o), c.return = e, e = c;
										break a;
									}
									n(e, r);
									break;
								}
								t(e, r), r = r.sibling;
							}
							o.type === j ? (c = Ai(o.props.children, e.mode, c, o.key), to(c, o), c.return = e, e = c) : (c = ki(o.type, o.key, o.props, null, e.mode, c), to(c, o), c.return = e, e = c);
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
							c = Ni(o, e.mode, c), c.return = e, e = c;
						}
						return s(e);
					case ne: return o = Ja(o), _(e, r, o, c);
				}
				if (z(o)) return h(e, r, o, c);
				if (R(o)) {
					if (l = R(o), typeof l != "function") throw Error(i(150));
					return o = l.call(o), g(e, r, o, c);
				}
				if (typeof o.then == "function") return _(e, r, eo(o), c);
				if (o.$$typeof === P) return _(e, r, ya(e, o), c);
				no(e, o);
			}
			return typeof o == "string" && o !== "" || typeof o == "number" || typeof o == "bigint" ? (o = "" + o, r !== null && r.tag === 6 ? (n(e, r.sibling), c = a(r, o), c.return = e, e = c) : (n(e, r), c = ji(o, e.mode, c), c.return = e, e = c), s(e)) : n(e, r);
		}
		return function(e, t, n, r) {
			try {
				$a = 0;
				var i = _(e, t, n, r);
				return Qa = null, i;
			} catch (t) {
				if (t === Ha || t === Wa) throw t;
				var a = Ti(29, t, null, e.mode);
				return a.lanes = r, a.return = e, a;
			}
		};
	}
	var io = ro(!0), ao = ro(!1), oo = !1;
	function so(e) {
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
	function co(e, t) {
		e = e.updateQueue, t.updateQueue === e && (t.updateQueue = {
			baseState: e.baseState,
			firstBaseUpdate: e.firstBaseUpdate,
			lastBaseUpdate: e.lastBaseUpdate,
			shared: e.shared,
			callbacks: null
		});
	}
	function lo(e) {
		return {
			lane: e,
			tag: 0,
			payload: null,
			callback: null,
			next: null
		};
	}
	function uo(e, t, n) {
		var r = e.updateQueue;
		if (r === null) return null;
		if (r = r.shared, Xu & 2) {
			var i = r.pending;
			return i === null ? t.next = t : (t.next = i.next, i.next = t), r.pending = t, t = Si(e), xi(e, null, n), t;
		}
		return vi(e, r, t, n), Si(e);
	}
	function fo(e, t, n) {
		if (t = t.updateQueue, t !== null && (t = t.shared, n & 4194048)) {
			var r = t.lanes;
			r &= e.pendingLanes, n |= r, t.lanes = n, st(e, n);
		}
	}
	function po(e, t) {
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
	var mo = !1;
	function ho() {
		if (mo) {
			var e = Na;
			if (e !== null) throw e;
		}
	}
	function go(e, t, n, r) {
		mo = !1;
		var i = e.updateQueue;
		oo = !1;
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
				if (p ? (Qu & f) === f : (r & f) === f) {
					f !== 0 && f === Ma && (mo = !0), u !== null && (u = u.next = {
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
							case 2: oo = !0;
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
			u === null && (c = d), i.baseState = c, i.firstBaseUpdate = l, i.lastBaseUpdate = u, a === null && (i.shared.lanes = 0), od |= o, e.lanes = o, e.memoizedState = d;
		}
	}
	function _o(e, t) {
		if (typeof e != "function") throw Error(i(191, e));
		e.call(t);
	}
	function vo(e, t) {
		var n = e.callbacks;
		if (n !== null) for (e.callbacks = null, e = 0; e < n.length; e++) _o(n[e], t);
	}
	var yo = me(null), bo = me(0);
	function xo(e, t) {
		e = id, H(bo, e), H(yo, t), id = e | t.baseLanes;
	}
	function So() {
		H(bo, id), H(yo, yo.current);
	}
	function Co() {
		id = bo.current, he(yo), he(bo);
	}
	var wo = me(null), To = null;
	function Eo(e) {
		var t = e.alternate;
		H(jo, jo.current & 1), H(wo, e), To === null && (t === null || yo.current !== null || t.memoizedState !== null) && (To = e);
	}
	function Do(e) {
		H(jo, jo.current), H(wo, e), To === null && (To = e);
	}
	function Oo(e) {
		e.tag === 22 ? (H(jo, jo.current), H(wo, e), To === null && (To = e)) : ko();
	}
	function ko() {
		H(jo, jo.current), H(wo, wo.current);
	}
	function Ao(e) {
		he(wo), To === e && (To = null), he(jo);
	}
	var jo = me(0);
	function Mo(e, t) {
		H(wo, wo.current), H(jo, t);
	}
	function No(e) {
		he(jo), he(wo), To === e && (To = null);
	}
	function Po(e) {
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
	var Fo = 0, J = null, Io = null, Lo = null, Ro = !1, zo = !1, Bo = !1, Vo = 0, Ho = 0, Uo = null, Wo = 0;
	function Go() {
		throw Error(i(321));
	}
	function Ko(e, t) {
		if (t === null) return !1;
		for (var n = 0; n < t.length && n < e.length; n++) if (!Pr(e[n], t[n])) return !1;
		return !0;
	}
	function qo(e, t, n, r, i, a) {
		return Fo = a, J = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, B.H = e === null || e.memoizedState === null ? uc : dc, Bo = !1, a = n(r, i), Bo = !1, zo && (a = Yo(t, n, r, i)), Jo(e), a;
	}
	function Jo(e) {
		B.H = lc;
		var t = Io !== null && Io.next !== null;
		if (Fo = 0, Lo = Io = J = null, Ro = !1, Ho = 0, Uo = null, t) throw Error(i(300));
		e === null || Oc || (e = e.dependencies, e !== null && ga(e) && (Oc = !0));
	}
	function Yo(e, t, n, r) {
		J = e;
		var a = 0;
		do {
			if (zo && (Uo = null), Ho = 0, zo = !1, 25 <= a) throw Error(i(301));
			if (a += 1, Lo = Io = null, e.updateQueue != null) {
				var o = e.updateQueue;
				o.lastEffect = null, o.events = null, o.stores = null, o.memoCache != null && (o.memoCache.index = 0);
			}
			B.H = fc, o = t(n, r);
		} while (zo);
		return o;
	}
	function Xo() {
		var e = B.H, t = e.useState()[0];
		return t = typeof t.then == "function" ? rs(t) : t, e = e.useState()[0], (Io === null ? null : Io.memoizedState) !== e && (J.flags |= 1024), t;
	}
	function Zo() {
		var e = Vo !== 0;
		return Vo = 0, e;
	}
	function Qo(e, t, n) {
		t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~n;
	}
	function $o(e) {
		if (Ro) {
			for (e = e.memoizedState; e !== null;) {
				var t = e.queue;
				t !== null && (t.pending = null), e = e.next;
			}
			Ro = !1;
		}
		Fo = 0, Lo = Io = J = null, zo = !1, Ho = Vo = 0, Uo = null;
	}
	function es() {
		var e = {
			memoizedState: null,
			baseState: null,
			baseQueue: null,
			queue: null,
			next: null
		};
		return Lo === null ? J.memoizedState = Lo = e : Lo = Lo.next = e, Lo;
	}
	function ts() {
		if (Io === null) {
			var e = J.alternate;
			e = e === null ? null : e.memoizedState;
		} else e = Io.next;
		var t = Lo === null ? J.memoizedState : Lo.next;
		if (t !== null) Lo = t, Io = e;
		else {
			if (e === null) throw J.alternate === null ? Error(i(467)) : Error(i(310));
			Io = e, e = {
				memoizedState: Io.memoizedState,
				baseState: Io.baseState,
				baseQueue: Io.baseQueue,
				queue: Io.queue,
				next: null
			}, Lo === null ? J.memoizedState = Lo = e : Lo = Lo.next = e;
		}
		return Lo;
	}
	function ns() {
		return {
			lastEffect: null,
			events: null,
			stores: null,
			memoCache: null
		};
	}
	function rs(e) {
		var t = Ho;
		return Ho += 1, Uo === null && (Uo = []), e = qa(Uo, e, t), t = J, (Lo === null ? t.memoizedState : Lo.next) === null && (t = t.alternate, B.H = t === null || t.memoizedState === null ? uc : dc), e;
	}
	function is(e) {
		if (typeof e == "object" && e) {
			if (typeof e.then == "function") return rs(e);
			if (e.$$typeof === se) return;
			if (e.$$typeof === P) return va(e);
		}
		throw Error(i(438, String(e)));
	}
	function as(e) {
		var t = null, n = J.updateQueue;
		if (n !== null && (t = n.memoCache), t == null) {
			var r = J.alternate;
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
		}, n === null && (n = ns(), J.updateQueue = n), n.memoCache = t, n = t.data[t.index], n === void 0) for (n = t.data[t.index] = Array(e), r = 0; r < e; r++) n[r] = ae;
		return t.index++, n;
	}
	function os(e, t) {
		return typeof t == "function" ? t(e) : t;
	}
	function ss(e) {
		return cs(ts(), Io, e);
	}
	function cs(e, t, n) {
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
				if (f === u.lane ? (Fo & f) === f : (Qu & f) === f) {
					var p = u.revertLane;
					if (p === 0) l !== null && (l = l.next = {
						lane: 0,
						revertLane: 0,
						gesture: null,
						action: u.action,
						hasEagerState: u.hasEagerState,
						eagerState: u.eagerState,
						next: null
					}), f === Ma && (d = !0);
					else if ((Fo & p) === p) {
						u = u.next, p === Ma && (d = !0);
						continue;
					} else f = {
						lane: 0,
						revertLane: u.revertLane,
						gesture: null,
						action: u.action,
						hasEagerState: u.hasEagerState,
						eagerState: u.eagerState,
						next: null
					}, l === null ? (c = l = f, s = o) : l = l.next = f, J.lanes |= p, od |= p;
					f = u.action, Bo && n(o, f), o = u.hasEagerState ? u.eagerState : n(o, f);
				} else p = {
					lane: f,
					revertLane: u.revertLane,
					gesture: u.gesture,
					action: u.action,
					hasEagerState: u.hasEagerState,
					eagerState: u.eagerState,
					next: null
				}, l === null ? (c = l = p, s = o) : l = l.next = p, J.lanes |= f, od |= f;
				u = u.next;
			} while (u !== null && u !== t);
			if (l === null ? s = o : l.next = c, !Pr(o, e.memoizedState) && (Oc = !0, d && (n = Na, n !== null))) throw n;
			e.memoizedState = o, e.baseState = s, e.baseQueue = l, r.lastRenderedState = o;
		}
		return a === null && (r.lanes = 0), [e.memoizedState, r.dispatch];
	}
	function ls(e) {
		var t = ts(), n = t.queue;
		if (n === null) throw Error(i(311));
		n.lastRenderedReducer = e;
		var r = n.dispatch, a = n.pending, o = t.memoizedState;
		if (a !== null) {
			n.pending = null;
			var s = a = a.next;
			do
				o = e(o, s.action), s = s.next;
			while (s !== a);
			Pr(o, t.memoizedState) || (Oc = !0), t.memoizedState = o, t.baseQueue === null && (t.baseState = o), n.lastRenderedState = o;
		}
		return [o, r];
	}
	function us(e, t, n) {
		var r = J, a = ts(), o = q;
		if (o) {
			if (n === void 0) throw Error(i(407));
			n = n();
		} else n = t();
		var s = !Pr((Io || a).memoizedState, n);
		if (s && (a.memoizedState = n, Oc = !0), a = a.queue, Fs(ps.bind(null, r, a, e), [e]), e = a.getSnapshot !== t || s || Lo !== null && !!(Lo.memoizedState.tag & 1), As(e ? 9 : 8, { destroy: void 0 }, fs.bind(null, r, a, n, t), null), e) {
			if (r.flags |= 2048, Zu === null) throw Error(i(349));
			o || Fo & 127 || ds(r, t, n);
		}
		return n;
	}
	function ds(e, t, n) {
		e.flags |= 16384, e = {
			getSnapshot: t,
			value: n
		}, t = J.updateQueue, t === null ? (t = ns(), J.updateQueue = t, t.stores = [e]) : (n = t.stores, n === null ? t.stores = [e] : n.push(e));
	}
	function fs(e, t, n, r) {
		t.value = n, t.getSnapshot = r, ms(t) && hs(e);
	}
	function ps(e, t, n) {
		return n(function() {
			ms(t) && hs(e);
		});
	}
	function ms(e) {
		var t = e.getSnapshot;
		e = e.value;
		try {
			var n = t();
			return !Pr(e, n);
		} catch {
			return !0;
		}
	}
	function hs(e) {
		var t = bi(e, 2);
		t !== null && Pd(t, e, 2);
	}
	function gs(e) {
		var t = es();
		if (typeof e == "function") {
			var n = e;
			if (e = n(), Bo) {
				Ue(!0);
				try {
					n();
				} finally {
					Ue(!1);
				}
			}
		}
		return t.memoizedState = t.baseState = e, t.queue = {
			pending: null,
			lanes: 0,
			dispatch: null,
			lastRenderedReducer: os,
			lastRenderedState: e
		}, t;
	}
	function _s(e, t, n, r) {
		return e.baseState = n, cs(e, Io, typeof r == "function" ? r : os);
	}
	function vs(e, t, n, r, a) {
		if (oc(e)) throw Error(i(485));
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
			B.T === null ? o.isTransition = !1 : n(!0), r(o), n = t.pending, n === null ? (o.next = t.pending = o, ys(t, o)) : (o.next = n.next, t.pending = n.next = o);
		}
	}
	function ys(e, t) {
		var n = t.action, r = t.payload, i = e.state;
		if (t.isTransition) {
			var a = B.T, o = {};
			o.types = a === null ? null : a.types, B.T = o;
			try {
				var s = n(i, r), c = B.S;
				c !== null && c(o, s), bs(e, t, s);
			} catch (n) {
				Ss(e, t, n);
			} finally {
				a !== null && o.types !== null && (a.types = o.types), B.T = a;
			}
		} else try {
			a = n(i, r), bs(e, t, a);
		} catch (n) {
			Ss(e, t, n);
		}
	}
	function bs(e, t, n) {
		typeof n == "object" && n && typeof n.then == "function" ? n.then(function(n) {
			xs(e, t, n);
		}, function(n) {
			return Ss(e, t, n);
		}) : xs(e, t, n);
	}
	function xs(e, t, n) {
		t.status = "fulfilled", t.value = n, Cs(t), e.state = n, t = e.pending, t !== null && (n = t.next, n === t ? e.pending = null : (n = n.next, t.next = n, ys(e, n)));
	}
	function Ss(e, t, n) {
		var r = e.pending;
		if (e.pending = null, r !== null) {
			r = r.next;
			do
				t.status = "rejected", t.reason = n, Cs(t), t = t.next;
			while (t !== r);
		}
		e.action = null;
	}
	function Cs(e) {
		e = e.listeners;
		for (var t = 0; t < e.length; t++) (0, e[t])();
	}
	function ws(e, t) {
		return t;
	}
	function Ts(e, t) {
		if (q) {
			var n = Zu.formState;
			if (n !== null) {
				a: {
					var r = J;
					if (q) {
						if (Zi) {
							b: {
								for (var i = Zi, a = $i; i.nodeType !== 8;) if (!a || (i = um(i.nextSibling), i === null)) {
									i = null;
									break b;
								}
								a = i.data, i = a === "F!" || a === "F" ? i : null;
							}
							if (i) {
								Zi = um(i.nextSibling), r = i.data === "F!";
								break a;
							}
						}
						ta(r);
					}
					r = !1;
				}
				r && (t = n[0]);
			}
		}
		return n = es(), n.memoizedState = n.baseState = t, r = {
			pending: null,
			lanes: 0,
			dispatch: null,
			lastRenderedReducer: ws,
			lastRenderedState: t
		}, n.queue = r, n = rc.bind(null, J, r), r.dispatch = n, r = gs(!1), a = ac.bind(null, J, !1, r.queue), r = es(), i = {
			state: t,
			dispatch: null,
			action: e,
			pending: null
		}, r.queue = i, n = vs.bind(null, J, i, a, n), i.dispatch = n, r.memoizedState = e, [
			t,
			n,
			!1
		];
	}
	function Es(e) {
		return Ds(ts(), Io, e);
	}
	function Ds(e, t, n) {
		if (t = cs(e, t, ws)[0], e = ss(os)[0], typeof t == "object" && t && typeof t.then == "function") try {
			var r = rs(t);
		} catch (e) {
			throw e === Ha ? Wa : e;
		}
		else r = t;
		t = ts();
		var i = t.queue, a = i.dispatch;
		return n !== t.memoizedState && (J.flags |= 2048, As(9, { destroy: void 0 }, Os.bind(null, i, n), null)), [
			r,
			a,
			e
		];
	}
	function Os(e, t) {
		e.action = t;
	}
	function ks(e) {
		var t = ts(), n = Io;
		if (n !== null) return Ds(t, n, e);
		ts(), t = t.memoizedState, n = ts();
		var r = n.queue.dispatch;
		return n.memoizedState = e, [
			t,
			r,
			!1
		];
	}
	function As(e, t, n, r) {
		return e = {
			tag: e,
			create: n,
			deps: r,
			inst: t,
			next: null
		}, t = J.updateQueue, t === null && (t = ns(), J.updateQueue = t), n = t.lastEffect, n === null ? t.lastEffect = e.next = e : (r = n.next, n.next = e, e.next = r, t.lastEffect = e), e;
	}
	function js() {
		return ts().memoizedState;
	}
	function Ms(e, t, n, r) {
		var i = es();
		J.flags |= e, i.memoizedState = As(1 | t, { destroy: void 0 }, n, r === void 0 ? null : r);
	}
	function Ns(e, t, n, r) {
		var i = ts();
		r = r === void 0 ? null : r;
		var a = i.memoizedState.inst;
		Io !== null && r !== null && Ko(r, Io.memoizedState.deps) ? i.memoizedState = As(t, a, n, r) : (J.flags |= e, i.memoizedState = As(1 | t, a, n, r));
	}
	function Ps(e, t) {
		Ms(8390656, 8, e, t);
	}
	function Fs(e, t) {
		Ns(2048, 8, e, t);
	}
	function Is(e) {
		J.flags |= 4;
		var t = J.updateQueue;
		if (t === null) t = ns(), J.updateQueue = t, t.events = [e];
		else {
			var n = t.events;
			n === null ? t.events = [e] : n.push(e);
		}
	}
	function Ls(e) {
		var t = ts().memoizedState;
		return Is({
			ref: t,
			nextImpl: e
		}), function() {
			if (Xu & 2) throw Error(i(440));
			return t.impl.apply(void 0, arguments);
		};
	}
	function Rs(e, t) {
		return Ns(4, 2, e, t);
	}
	function zs(e, t) {
		return Ns(4, 4, e, t);
	}
	function Bs(e, t) {
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
	function Vs(e, t, n) {
		n = n == null ? null : n.concat([e]), Ns(4, 4, Bs.bind(null, t, e), n);
	}
	function Hs() {}
	function Us(e, t) {
		var n = ts();
		t = t === void 0 ? null : t;
		var r = n.memoizedState;
		return t !== null && Ko(t, r[1]) ? r[0] : (n.memoizedState = [e, t], e);
	}
	function Ws(e, t) {
		var n = ts();
		t = t === void 0 ? null : t;
		var r = n.memoizedState;
		if (t !== null && Ko(t, r[1])) return r[0];
		if (r = e(), Bo) {
			Ue(!0);
			try {
				e();
			} finally {
				Ue(!1);
			}
		}
		return n.memoizedState = [r, t], r;
	}
	function Gs(e, t, n) {
		return n === void 0 || Fo & 1073741824 && !(Qu & 261930) ? e.memoizedState = t : (e.memoizedState = n, e = Md(), J.lanes |= e, od |= e, n);
	}
	function Ks(e, t, n, r) {
		return Pr(n, t) ? n : yo.current === null ? !(Fo & 106) || Fo & 1073741824 && !(Qu & 261930) ? (Oc = !0, e.memoizedState = n) : (e = Md(), J.lanes |= e, od |= e, t) : (e = Gs(e, n, r), Pr(e, t) || (Oc = !0), e);
	}
	function qs(e, t, n, r, i) {
		var a = V.p;
		V.p = a !== 0 && 8 > a ? a : 8;
		var o = B.T, s = {};
		s.types = o === null ? null : o.types, B.T = s, ac(e, !1, t, n);
		try {
			var c = i(), l = B.S;
			l !== null && l(s, c), typeof c == "object" && c && typeof c.then == "function" ? ic(e, t, Ia(c, r), jd(e)) : ic(e, t, r, jd(e));
		} catch (n) {
			ic(e, t, {
				then: function() {},
				status: "rejected",
				reason: n
			}, jd());
		} finally {
			V.p = a, o !== null && s.types !== null && (o.types = s.types), B.T = o;
		}
	}
	function Js() {}
	function Ys(e, t, n, r) {
		if (e.tag !== 5) throw Error(i(476));
		var a = Xs(e).queue;
		qs(e, a, t, de, n === null ? Js : function() {
			return Zs(e), n(r);
		});
	}
	function Xs(e) {
		var t = e.memoizedState;
		if (t !== null) return t;
		t = {
			memoizedState: de,
			baseState: de,
			baseQueue: null,
			queue: {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: os,
				lastRenderedState: de
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
				lastRenderedReducer: os,
				lastRenderedState: n
			},
			next: null
		}, e.memoizedState = t, e = e.alternate, e !== null && (e.memoizedState = t), t;
	}
	function Zs(e) {
		var t = Xs(e);
		t.next === null && (t = e.alternate.memoizedState), ic(e, t.next.queue, {}, jd());
	}
	function Qs() {
		return va(ch);
	}
	function $s() {
		return ts().memoizedState;
	}
	function ec() {
		return ts().memoizedState;
	}
	function tc(e) {
		for (var t = e.return; t !== null;) {
			switch (t.tag) {
				case 24:
				case 3:
					var n = jd();
					e = lo(n);
					var r = uo(t, e, n);
					r !== null && (Pd(r, t, n), fo(r, t, n)), t = { cache: Ta() }, e.payload = t;
					return;
			}
			t = t.return;
		}
	}
	function nc(e, t, n) {
		var r = jd();
		n = {
			lane: r,
			revertLane: 0,
			gesture: null,
			action: n,
			hasEagerState: !1,
			eagerState: null,
			next: null
		}, oc(e) ? sc(t, n) : (n = yi(e, t, n, r), n !== null && (Pd(n, e, r), cc(n, t, r)));
	}
	function rc(e, t, n) {
		ic(e, t, n, jd());
	}
	function ic(e, t, n, r) {
		var i = {
			lane: r,
			revertLane: 0,
			gesture: null,
			action: n,
			hasEagerState: !1,
			eagerState: null,
			next: null
		};
		if (oc(e)) sc(t, i);
		else {
			var a = e.alternate;
			if (e.lanes === 0 && (a === null || a.lanes === 0) && (a = t.lastRenderedReducer, a !== null)) try {
				var o = t.lastRenderedState, s = a(o, n);
				if (i.hasEagerState = !0, i.eagerState = s, Pr(s, o)) return vi(e, t, i, 0), Zu === null && _i(), !1;
			} catch {}
			if (n = yi(e, t, i, r), n !== null) return Pd(n, e, r), cc(n, t, r), !0;
		}
		return !1;
	}
	function ac(e, t, n, r) {
		if (r = {
			lane: 2,
			revertLane: Ff(),
			gesture: null,
			action: r,
			hasEagerState: !1,
			eagerState: null,
			next: null
		}, oc(e)) {
			if (t) throw Error(i(479));
		} else t = yi(e, n, r, 2), t !== null && Pd(t, e, 2);
	}
	function oc(e) {
		var t = e.alternate;
		return e === J || t !== null && t === J;
	}
	function sc(e, t) {
		zo = Ro = !0;
		var n = e.pending;
		n === null ? t.next = t : (t.next = n.next, n.next = t), e.pending = t;
	}
	function cc(e, t, n) {
		if (n & 4194048) {
			var r = t.lanes;
			r &= e.pendingLanes, n |= r, t.lanes = n, st(e, n);
		}
	}
	var lc = {
		readContext: va,
		use: is,
		useCallback: Go,
		useContext: Go,
		useEffect: Go,
		useImperativeHandle: Go,
		useLayoutEffect: Go,
		useInsertionEffect: Go,
		useMemo: Go,
		useReducer: Go,
		useRef: Go,
		useState: Go,
		useDebugValue: Go,
		useDeferredValue: Go,
		useTransition: Go,
		useSyncExternalStore: Go,
		useId: Go,
		useHostTransitionStatus: Go,
		useFormState: Go,
		useActionState: Go,
		useOptimistic: Go,
		useMemoCache: Go,
		useCacheRefresh: Go,
		useEffectEvent: Go
	}, uc = {
		readContext: va,
		use: is,
		useCallback: function(e, t) {
			return es().memoizedState = [e, t === void 0 ? null : t], e;
		},
		useContext: va,
		useEffect: Ps,
		useImperativeHandle: function(e, t, n) {
			n = n == null ? null : n.concat([e]), Ms(4194308, 4, Bs.bind(null, t, e), n);
		},
		useLayoutEffect: function(e, t) {
			return Ms(4194308, 4, e, t);
		},
		useInsertionEffect: function(e, t) {
			Ms(4, 2, e, t);
		},
		useMemo: function(e, t) {
			var n = es();
			t = t === void 0 ? null : t;
			var r = e();
			if (Bo) {
				Ue(!0);
				try {
					e();
				} finally {
					Ue(!1);
				}
			}
			return n.memoizedState = [r, t], r;
		},
		useReducer: function(e, t, n) {
			var r = es();
			if (n !== void 0) {
				var i = n(t);
				if (Bo) {
					Ue(!0);
					try {
						n(t);
					} finally {
						Ue(!1);
					}
				}
			} else i = t;
			return r.memoizedState = r.baseState = i, e = {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: e,
				lastRenderedState: i
			}, r.queue = e, e = e.dispatch = nc.bind(null, J, e), [r.memoizedState, e];
		},
		useRef: function(e) {
			var t = es();
			return e = { current: e }, t.memoizedState = e;
		},
		useState: function(e) {
			e = gs(e);
			var t = e.queue, n = rc.bind(null, J, t);
			return t.dispatch = n, [e.memoizedState, n];
		},
		useDebugValue: Hs,
		useDeferredValue: function(e, t) {
			return Gs(es(), e, t);
		},
		useTransition: function() {
			var e = gs(!1);
			return e = qs.bind(null, J, e.queue, !0, !1), es().memoizedState = e, [!1, e];
		},
		useSyncExternalStore: function(e, t, n) {
			var r = J, a = es();
			if (q) {
				if (n === void 0) throw Error(i(407));
				n = n();
			} else {
				if (n = t(), Zu === null) throw Error(i(349));
				Qu & 127 || ds(r, t, n);
			}
			a.memoizedState = n;
			var o = {
				value: n,
				getSnapshot: t
			};
			return a.queue = o, Ps(ps.bind(null, r, o, e), [e]), r.flags |= 2048, As(9, { destroy: void 0 }, fs.bind(null, r, o, n, t), null), n;
		},
		useId: function() {
			var e = es(), t = Zu.identifierPrefix;
			if (q) {
				var n = Wi, r = Ui;
				n = (r & ~(1 << 32 - We(r) - 1)).toString(32) + n, t = "_" + t + "R_" + n, n = Vo++, 0 < n && (t += "H" + n.toString(32)), t += "_";
			} else n = Wo++, t = "_" + t + "r_" + n.toString(32) + "_";
			return e.memoizedState = t;
		},
		useHostTransitionStatus: Qs,
		useFormState: Ts,
		useActionState: Ts,
		useOptimistic: function(e) {
			var t = es();
			t.memoizedState = t.baseState = e;
			var n = {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: null,
				lastRenderedState: null
			};
			return t.queue = n, t = ac.bind(null, J, !0, n), n.dispatch = t, [e, t];
		},
		useMemoCache: as,
		useCacheRefresh: function() {
			return es().memoizedState = tc.bind(null, J);
		},
		useEffectEvent: function(e) {
			var t = es(), n = { impl: e };
			return t.memoizedState = n, function() {
				if (Xu & 2) throw Error(i(440));
				return n.impl.apply(void 0, arguments);
			};
		}
	}, dc = {
		readContext: va,
		use: is,
		useCallback: Us,
		useContext: va,
		useEffect: Fs,
		useImperativeHandle: Vs,
		useInsertionEffect: Rs,
		useLayoutEffect: zs,
		useMemo: Ws,
		useReducer: ss,
		useRef: js,
		useState: function() {
			return ss(os);
		},
		useDebugValue: Hs,
		useDeferredValue: function(e, t) {
			return Ks(ts(), Io.memoizedState, e, t);
		},
		useTransition: function() {
			var e = ss(os)[0], t = ts().memoizedState;
			return [typeof e == "boolean" ? e : rs(e), t];
		},
		useSyncExternalStore: us,
		useId: $s,
		useHostTransitionStatus: Qs,
		useFormState: Es,
		useActionState: Es,
		useOptimistic: function(e, t) {
			return _s(ts(), Io, e, t);
		},
		useMemoCache: as,
		useCacheRefresh: ec,
		useEffectEvent: Ls
	}, fc = {
		readContext: va,
		use: is,
		useCallback: Us,
		useContext: va,
		useEffect: Fs,
		useImperativeHandle: Vs,
		useInsertionEffect: Rs,
		useLayoutEffect: zs,
		useMemo: Ws,
		useReducer: ls,
		useRef: js,
		useState: function() {
			return ls(os);
		},
		useDebugValue: Hs,
		useDeferredValue: function(e, t) {
			var n = ts();
			return Io === null ? Gs(n, e, t) : Ks(n, Io.memoizedState, e, t);
		},
		useTransition: function() {
			var e = ls(os)[0], t = ts().memoizedState;
			return [typeof e == "boolean" ? e : rs(e), t];
		},
		useSyncExternalStore: us,
		useId: $s,
		useHostTransitionStatus: Qs,
		useFormState: ks,
		useActionState: ks,
		useOptimistic: function(e, t) {
			var n = ts();
			return Io === null ? (n.baseState = e, [e, n.queue.dispatch]) : _s(n, Io, e, t);
		},
		useMemoCache: as,
		useCacheRefresh: ec,
		useEffectEvent: Ls
	};
	function pc(e, t, n, r) {
		t = e.memoizedState, n = n(r, t), n = n == null ? t : D({}, t, n), e.memoizedState = n, e.lanes === 0 && (e.updateQueue.baseState = n);
	}
	var mc = {
		enqueueSetState: function(e, t, n) {
			e = e._reactInternals;
			var r = jd(), i = lo(r);
			i.payload = t, n != null && (i.callback = n), t = uo(e, i, r), t !== null && (Pd(t, e, r), fo(t, e, r));
		},
		enqueueReplaceState: function(e, t, n) {
			e = e._reactInternals;
			var r = jd(), i = lo(r);
			i.tag = 1, i.payload = t, n != null && (i.callback = n), t = uo(e, i, r), t !== null && (Pd(t, e, r), fo(t, e, r));
		},
		enqueueForceUpdate: function(e, t) {
			e = e._reactInternals;
			var n = jd(), r = lo(n);
			r.tag = 2, t != null && (r.callback = t), t = uo(e, r, n), t !== null && (Pd(t, e, n), fo(t, e, n));
		}
	};
	function hc(e, t, n, r, i, a, o) {
		return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(r, a, o) : t.prototype && t.prototype.isPureReactComponent ? !Fr(n, r) || !Fr(i, a) : !0;
	}
	function gc(e, t, n, r) {
		e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(n, r), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(n, r), t.state !== e && mc.enqueueReplaceState(t, t.state, null);
	}
	function _c(e, t) {
		var n = t;
		if ("ref" in t) for (var r in n = {}, t) r !== "ref" && (n[r] = t[r]);
		if (e = e.defaultProps) for (var i in n === t && (n = D({}, n)), e) n[i] === void 0 && (n[i] = e[i]);
		return n;
	}
	function vc(e) {
		pi(e);
	}
	function yc(e) {
		console.error(e);
	}
	function bc(e) {
		pi(e);
	}
	function xc(e, t) {
		try {
			var n = e.onUncaughtError;
			n(t.value, { componentStack: t.stack });
		} catch (e) {
			setTimeout(function() {
				throw e;
			});
		}
	}
	function Sc(e, t, n) {
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
	function Cc(e, t, n) {
		return n = lo(n), n.tag = 3, n.payload = { element: null }, n.callback = function() {
			xc(e, t);
		}, n;
	}
	function wc(e) {
		return e = lo(e), e.tag = 3, e;
	}
	function Tc(e, t, n, r) {
		var i = n.type.getDerivedStateFromError;
		if (typeof i == "function") {
			var a = r.value;
			e.payload = function() {
				return i(a);
			}, e.callback = function() {
				Sc(t, n, r);
			};
		}
		var o = n.stateNode;
		o !== null && typeof o.componentDidCatch == "function" && (e.callback = function() {
			Sc(t, n, r), typeof i != "function" && (vd === null ? vd = /* @__PURE__ */ new Set([this]) : vd.add(this));
			var e = r.stack;
			this.componentDidCatch(r.value, { componentStack: e === null ? "" : e });
		});
	}
	function Ec(e, t, n, r, a) {
		if (n.flags |= 32768, typeof r == "object" && r && typeof r.then == "function") {
			if (t = n.alternate, t !== null && ha(t, n, a, !0), n = wo.current, n !== null) {
				switch (n.tag) {
					case 31:
					case 13:
					case 19: return To === null ? Kd() : n.alternate === null && ad === 0 && (ad = 3), n.flags &= -257, n.flags |= 65536, n.lanes = a, r === Ga ? n.flags |= 16384 : (t = n.updateQueue, t === null ? n.updateQueue = /* @__PURE__ */ new Set([r]) : t.add(r), hf(e, r, a)), !1;
					case 22: return n.flags |= 65536, r === Ga ? n.flags |= 16384 : (t = n.updateQueue, t === null ? (t = {
						transitions: null,
						markerInstances: null,
						retryQueue: /* @__PURE__ */ new Set([r])
					}, n.updateQueue = t) : (n = t.retryQueue, n === null ? t.retryQueue = /* @__PURE__ */ new Set([r]) : n.add(r)), hf(e, r, a)), !1;
				}
				throw Error(i(435, n.tag));
			}
			return hf(e, r, a), Kd(), !1;
		}
		if (q) return t = wo.current, t === null ? (r !== ea && (t = Error(i(423), { cause: r }), sa(Fi(t, n))), e = e.current.alternate, e.flags |= 65536, a &= -a, e.lanes |= a, r = Fi(r, n), a = Cc(e.stateNode, r, a), po(e, a), ad !== 4 && (ad = 2)) : (!(t.flags & 65536) && (t.flags |= 256), t.flags |= 65536, t.lanes = a, r !== ea && (e = Error(i(422), { cause: r }), sa(Fi(e, n)))), !1;
		var o = Error(i(520), { cause: r });
		if (o = Fi(o, n), dd === null ? dd = [o] : dd.push(o), ad !== 4 && (ad = 2), t === null) return !0;
		r = Fi(r, n), n = t;
		do {
			switch (n.tag) {
				case 3: return n.flags |= 65536, e = a & -a, n.lanes |= e, e = Cc(n.stateNode, r, e), po(n, e), !1;
				case 1:
					if (t = n.type, o = n.stateNode, !(n.flags & 128) && (typeof t.getDerivedStateFromError == "function" || o !== null && typeof o.componentDidCatch == "function" && (vd === null || !vd.has(o)))) return n.flags |= 65536, a &= -a, n.lanes |= a, a = wc(a), Tc(a, e, n, r), po(n, a), !1;
					break;
				case 22: if (n.memoizedState !== null) return n.flags |= 65536, !1;
			}
			n = n.return;
		} while (n !== null);
		return !1;
	}
	var Dc = Error(i(461)), Oc = !1;
	function kc(e, t, n, r) {
		t.child = e === null ? ao(t, null, n, r) : io(t, e.child, n, r);
	}
	function Ac(e, t, n, r, i) {
		n = n.render;
		var a = t.ref;
		if ("ref" in r) {
			var o = {};
			for (var s in r) s !== "ref" && (o[s] = r[s]);
		} else o = r;
		return _a(t), r = qo(e, t, n, o, a, i), s = Zo(), e !== null && !Oc ? (Qo(e, t, i), il(e, t, i)) : (q && s && qi(t), t.flags |= 1, kc(e, t, r, i), t.child);
	}
	function jc(e, t, n, r, i) {
		if (e === null) {
			var a = n.type;
			return typeof a == "function" && !Ei(a) && a.defaultProps === void 0 && n.compare === null ? (t.tag = 15, t.type = a, Mc(e, t, a, r, i)) : (e = ki(n.type, null, r, t, t.mode, i), e.ref = t.ref, e.return = t, t.child = e);
		}
		if (a = e.child, !al(e, i)) {
			var o = a.memoizedProps;
			if (n = n.compare, n = n === null ? Fr : n, n(o, r) && e.ref === t.ref) return il(e, t, i);
		}
		return t.flags |= 1, e = Di(a, r), e.ref = t.ref, e.return = t, t.child = e;
	}
	function Mc(e, t, n, r, i) {
		if (e !== null) {
			var a = e.memoizedProps;
			if (Fr(a, r) && e.ref === t.ref) {
				if (Oc = !1, t.pendingProps = r = a, al(e, i)) e.flags & 131072 && (Oc = !0);
				else return t.lanes = e.lanes, il(e, t, i);
			}
		}
		return Bc(e, t, n, r, i);
	}
	function Nc(e, t, n, r) {
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
				return Fc(e, t, a, n, r);
			}
			if (n & 536870912) t.memoizedState = {
				baseLanes: 0,
				cachePool: null
			}, e !== null && Ba(t, a === null ? null : a.cachePool), a === null ? So() : xo(t, a), Oo(t);
			else return r = t.lanes = 536870912, Fc(e, t, a === null ? n : a.baseLanes | n, n, r);
		} else a === null ? (e !== null && Ba(t, null), So(), ko()) : (Ba(t, a.cachePool), xo(t, a), ko(), t.memoizedState = null);
		return kc(e, t, i, n), t.child;
	}
	function Pc(e, t) {
		return e !== null && e.tag === 22 || t.stateNode !== null || (t.stateNode = {
			_visibility: 1,
			_pendingMarkers: null,
			_retryCache: null,
			_transitions: null
		}), t.sibling;
	}
	function Fc(e, t, n, r, i) {
		var a = za();
		return a = a === null ? null : {
			parent: wa._currentValue,
			pool: a
		}, t.memoizedState = {
			baseLanes: n,
			cachePool: a
		}, e !== null && Ba(t, null), So(), Oo(t), e !== null && ha(e, t, r, !0), t.childLanes = i, null;
	}
	function Ic(e, t) {
		return t = Yc({
			mode: t.mode,
			children: t.children
		}, e.mode), t.ref = e.ref, e.child = t, t.return = e, t;
	}
	function Lc(e, t, n) {
		return io(t, e.child, null, n), e = Ic(t, t.pendingProps), e.flags |= 2, Ao(t), t.memoizedState = null, e;
	}
	function Rc(e, t, n) {
		var r = t.pendingProps, a = !!(t.flags & 128);
		if (t.flags &= -129, e === null) {
			if (q) {
				if (r.mode === "hidden") return e = Ic(t, r), t.lanes = 536870912, e.memoizedState = {
					baseLanes: 0,
					cachePool: null
				}, Pc(null, e);
				if (Do(t), (e = Zi) ? (e = om(e, $i), e = e !== null && e.data === "&" ? e : null, e !== null && (t.memoizedState = {
					dehydrated: e,
					treeContext: Hi === null ? null : {
						id: Ui,
						overflow: Wi
					},
					retryLane: 536870912,
					hydrationErrors: null
				}, n = Mi(e), n.return = t, t.child = n, Xi = t, Zi = null)) : e = null, e === null) throw ta(t);
				return t.lanes = 536870912, null;
			}
			return Ic(t, r);
		}
		var o = e.memoizedState;
		if (o !== null) {
			var s = o.dehydrated;
			if (Do(t), a) {
				if (t.flags & 256) t.flags &= -257, t = Lc(e, t, n);
				else if (t.memoizedState !== null) t.child = e.child, t.flags |= 128, t = null;
				else throw Error(i(558));
			} else if (Oc || ha(e, t, n, !1), a = (n & e.childLanes) !== 0, Oc || a) {
				if (yo.current === null) {
					if (r = Zu, r !== null && (s = ct(r, n), s !== 0 && s !== o.retryLane)) throw o.retryLane = s, bi(e, s), Pd(r, e, s), Dc;
					Kd();
				}
				t = Lc(e, t, n);
			} else e = o.treeContext, Zi = um(s.nextSibling), Xi = t, q = !0, Qi = null, $i = !1, e !== null && Yi(t, e), t = Ic(t, r), t.flags |= 134221824;
			return t;
		}
		return e = Di(e.child, {
			mode: r.mode,
			children: r.children
		}), e.ref = t.ref, t.child = e, e.return = t, e;
	}
	function zc(e, t) {
		var n = t.ref;
		if (n === null) e !== null && e.ref !== null && (t.flags |= 4194816);
		else {
			if (typeof n != "function" && typeof n != "object") throw Error(i(284));
			(e === null || e.ref !== n) && (t.flags |= 4194816);
		}
	}
	function Bc(e, t, n, r, i) {
		return _a(t), n = qo(e, t, n, r, void 0, i), r = Zo(), e !== null && !Oc ? (Qo(e, t, i), il(e, t, i)) : (q && r && qi(t), t.flags |= 1, kc(e, t, n, i), t.child);
	}
	function Vc(e, t, n, r, i, a) {
		return _a(t), t.updateQueue = null, n = Yo(t, r, n, i), Jo(e), r = Zo(), e !== null && !Oc ? (Qo(e, t, a), il(e, t, a)) : (q && r && qi(t), t.flags |= 1, kc(e, t, n, a), t.child);
	}
	function Hc(e, t, n, r, i) {
		if (_a(t), t.stateNode === null) {
			var a = Ci, o = n.contextType;
			typeof o == "object" && o && (a = va(o)), a = new n(r, a), t.memoizedState = a.state !== null && a.state !== void 0 ? a.state : null, a.updater = mc, t.stateNode = a, a._reactInternals = t, a = t.stateNode, a.props = r, a.state = t.memoizedState, a.refs = {}, so(t), o = n.contextType, a.context = typeof o == "object" && o ? va(o) : Ci, a.state = t.memoizedState, o = n.getDerivedStateFromProps, typeof o == "function" && (pc(t, n, o, r), a.state = t.memoizedState), typeof n.getDerivedStateFromProps == "function" || typeof a.getSnapshotBeforeUpdate == "function" || typeof a.UNSAFE_componentWillMount != "function" && typeof a.componentWillMount != "function" || (o = a.state, typeof a.componentWillMount == "function" && a.componentWillMount(), typeof a.UNSAFE_componentWillMount == "function" && a.UNSAFE_componentWillMount(), o !== a.state && mc.enqueueReplaceState(a, a.state, null), go(t, r, a, i), ho(), a.state = t.memoizedState), typeof a.componentDidMount == "function" && (t.flags |= 4194308), r = !0;
		} else if (e === null) {
			a = t.stateNode;
			var s = t.memoizedProps, c = _c(n, s);
			a.props = c;
			var l = a.context, u = n.contextType;
			o = Ci, typeof u == "object" && u && (o = va(u));
			var d = n.getDerivedStateFromProps;
			u = typeof d == "function" || typeof a.getSnapshotBeforeUpdate == "function", s = t.pendingProps !== s, u || typeof a.UNSAFE_componentWillReceiveProps != "function" && typeof a.componentWillReceiveProps != "function" || (s || l !== o) && gc(t, a, r, o), oo = !1;
			var f = t.memoizedState;
			a.state = f, go(t, r, a, i), ho(), l = t.memoizedState, s || f !== l || oo ? (typeof d == "function" && (pc(t, n, d, r), l = t.memoizedState), (c = oo || hc(t, n, c, r, f, l, o)) ? (u || typeof a.UNSAFE_componentWillMount != "function" && typeof a.componentWillMount != "function" || (typeof a.componentWillMount == "function" && a.componentWillMount(), typeof a.UNSAFE_componentWillMount == "function" && a.UNSAFE_componentWillMount()), typeof a.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof a.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = r, t.memoizedState = l), a.props = r, a.state = l, a.context = o, r = c) : (typeof a.componentDidMount == "function" && (t.flags |= 4194308), r = !1);
		} else {
			a = t.stateNode, co(e, t), o = t.memoizedProps, u = _c(n, o), a.props = u, d = t.pendingProps, f = a.context, l = n.contextType, c = Ci, typeof l == "object" && l && (c = va(l)), s = n.getDerivedStateFromProps, (l = typeof s == "function" || typeof a.getSnapshotBeforeUpdate == "function") || typeof a.UNSAFE_componentWillReceiveProps != "function" && typeof a.componentWillReceiveProps != "function" || (o !== d || f !== c) && gc(t, a, r, c), oo = !1, f = t.memoizedState, a.state = f, go(t, r, a, i), ho();
			var p = t.memoizedState;
			o !== d || f !== p || oo || e !== null && e.dependencies !== null && ga(e.dependencies) ? (typeof s == "function" && (pc(t, n, s, r), p = t.memoizedState), (u = oo || hc(t, n, u, r, f, p, c) || e !== null && e.dependencies !== null && ga(e.dependencies)) ? (l || typeof a.UNSAFE_componentWillUpdate != "function" && typeof a.componentWillUpdate != "function" || (typeof a.componentWillUpdate == "function" && a.componentWillUpdate(r, p, c), typeof a.UNSAFE_componentWillUpdate == "function" && a.UNSAFE_componentWillUpdate(r, p, c)), typeof a.componentDidUpdate == "function" && (t.flags |= 4), typeof a.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof a.componentDidUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 4), typeof a.getSnapshotBeforeUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 1024), t.memoizedProps = r, t.memoizedState = p), a.props = r, a.state = p, a.context = c, r = u) : (typeof a.componentDidUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 4), typeof a.getSnapshotBeforeUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 1024), r = !1);
		}
		return a = r, zc(e, t), r = !!(t.flags & 128), a || r ? (a = t.stateNode, n = r && typeof n.getDerivedStateFromError != "function" ? null : a.render(), t.flags |= 1, e !== null && r ? (t.child = io(t, e.child, null, i), t.child = io(t, null, n, i)) : kc(e, t, n, i), t.memoizedState = a.state, e = t.child) : e = il(e, t, i), e;
	}
	function Uc(e, t, n, r) {
		return aa(), t.flags |= 256, kc(e, t, n, r), t.child;
	}
	var Wc = {
		dehydrated: null,
		treeContext: null,
		retryLane: 0,
		hydrationErrors: null
	};
	function Gc(e) {
		return {
			baseLanes: e,
			cachePool: Va()
		};
	}
	function Kc(e, t, n) {
		return e = e === null ? 0 : e.childLanes & ~n, t && (e |= ld), e;
	}
	function qc(e, t, n) {
		var r = t.pendingProps, i = !1, a = !!(t.flags & 128), o;
		if ((o = a) || (o = e !== null && e.memoizedState === null ? !1 : !!(jo.current & 2)), o && (i = !0, t.flags &= -129), o = !!(t.flags & 32), t.flags &= -33, e === null) {
			if (q) {
				if (i ? Eo(t) : ko(), (e = Zi) ? (e = om(e, $i), e = e !== null && e.data !== "&" ? e : null, e !== null && (t.memoizedState = {
					dehydrated: e,
					treeContext: Hi === null ? null : {
						id: Ui,
						overflow: Wi
					},
					retryLane: 536870912,
					hydrationErrors: null
				}, n = Mi(e), n.return = t, t.child = n, Xi = t, Zi = null)) : e = null, e === null) throw ta(t);
				return t.lanes = cm(e) ? 32 : 536870912, null;
			}
			return a = r.children, r = r.fallback, i ? (ko(), i = t.mode, a = Yc({
				mode: "hidden",
				children: a
			}, i), r = Ai(r, i, n, null), a.return = t, r.return = t, a.sibling = r, t.child = a, r = t.child, r.memoizedState = Gc(n), r.childLanes = Kc(e, o, n), t.memoizedState = Wc, Pc(null, r)) : (Eo(t), Jc(t, a));
		}
		var s = e.memoizedState;
		if (s !== null) {
			var c = s.dehydrated;
			if (c !== null) return Zc(e, t, a, o, r, c, s, n);
		}
		return i ? (ko(), i = r.fallback, a = t.mode, s = e.child, c = s.sibling, r = Di(s, {
			mode: "hidden",
			children: r.children
		}), r.subtreeFlags = s.subtreeFlags & 1206910976, c === null ? (i = Ai(i, a, n, null), i.flags |= 2) : i = Di(c, i), i.return = t, r.return = t, r.sibling = i, t.child = r, Pc(null, r), r = t.child, i = e.child.memoizedState, i === null ? i = Gc(n) : (a = i.cachePool, a === null ? a = Va() : (s = wa._currentValue, a = a.parent === s ? a : {
			parent: s,
			pool: s
		}), i = {
			baseLanes: i.baseLanes | n,
			cachePool: a
		}), r.memoizedState = i, r.childLanes = Kc(e, o, n), t.memoizedState = Wc, Pc(e.child, r)) : (Eo(t), n = e.child, e = n.sibling, n = Di(n, {
			mode: "visible",
			children: r.children
		}), n.return = t, n.sibling = null, e !== null && (o = t.deletions, o === null ? (t.deletions = [e], t.flags |= 16) : o.push(e)), t.child = n, t.memoizedState = null, n);
	}
	function Jc(e, t) {
		return t = Yc({
			mode: "visible",
			children: t
		}, e.mode), t.return = e, e.child = t;
	}
	function Yc(e, t) {
		return e = Ti(22, e, null, t), e.lanes = 0, e;
	}
	function Xc(e, t, n) {
		return io(t, e.child, null, n), e = Jc(t, t.pendingProps.children), e.flags |= 2, t.memoizedState = null, e;
	}
	function Zc(e, t, n, r, a, o, s, c) {
		if (n) return t.flags & 256 ? (Eo(t), t.flags &= -257, Xc(e, t, c)) : t.memoizedState === null ? (ko(), o = a.fallback, s = t.mode, a = Yc({
			mode: "visible",
			children: a.children
		}, s), o = Ai(o, s, c, null), o.flags |= 2, a.return = t, o.return = t, a.sibling = o, t.child = a, io(t, e.child, null, c), a = t.child, a.memoizedState = Gc(c), a.childLanes = Kc(e, r, c), t.memoizedState = Wc, Pc(null, a)) : (ko(), t.child = e.child, t.flags |= 128, null);
		if (Eo(t), cm(o)) {
			if (r = o.nextSibling && o.nextSibling.dataset, r) var l = r.dgst;
			return r = l, r !== "" && (a = Error(i(419)), a.stack = "", a.digest = r, sa({
				value: a,
				source: null,
				stack: null
			})), Xc(e, t, c);
		}
		if (Oc || ha(e, t, c, !1), r = (c & e.childLanes) !== 0, Oc || r) {
			if (yo.current !== null) return Xc(e, t, c);
			if (r = Zu, r !== null && (a = ct(r, c), a !== 0 && a !== s.retryLane)) throw s.retryLane = a, bi(e, a), Pd(r, e, a), Dc;
			return sm(o) || Kd(), Xc(e, t, c);
		}
		return sm(o) ? (t.flags |= 192, t.child = e.child, null) : (e = s.treeContext, Zi = um(o.nextSibling), Xi = t, q = !0, Qi = null, $i = !1, e !== null && Yi(t, e), t = Jc(t, a.children), t.flags |= 134221824, t);
	}
	function Qc(e, t, n) {
		e.lanes |= t;
		var r = e.alternate;
		r !== null && (r.lanes |= t), pa(e.return, t, n);
	}
	function $c(e) {
		for (var t = null; e !== null;) {
			var n = e.alternate;
			n !== null && Po(n) === null && (t = e), e = e.sibling;
		}
		return t;
	}
	function el(e, t, n, r, i, a) {
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
	function tl(e) {
		var t = e.child;
		for (e.child = null; t !== null;) {
			var n = t.sibling;
			t.sibling = e.child, e.child = t, t = n;
		}
	}
	function nl(e, t, n) {
		var r = t.pendingProps, i = r.revealOrder, a = r.tail;
		r = r.children;
		var o = jo.current;
		if (t.flags & 128) return Mo(t, o), null;
		var s = !!(o & 2);
		if (s ? (o = o & 1 | 2, t.flags |= 128) : o &= 1, Mo(t, o), i === "backwards" && e !== null ? (tl(e), kc(e, t, r, n), tl(e)) : kc(e, t, r, n), r = q ? zi : 0, !s && e !== null && e.flags & 128) a: for (e = t.child; e !== null;) {
			if (e.tag === 13) e.memoizedState !== null && Qc(e, n, t);
			else if (e.tag === 19) Qc(e, n, t);
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
				n = $c(t.child), n === null ? (i = t.child, t.child = null) : (i = n.sibling, n.sibling = null, tl(t)), el(t, !0, i, null, a, r);
				break;
			case "unstable_legacy-backwards":
				for (n = null, i = t.child, t.child = null; i !== null;) {
					if (e = i.alternate, e !== null && Po(e) === null) {
						t.child = i;
						break;
					}
					e = i.sibling, i.sibling = n, n = i, i = e;
				}
				el(t, !0, n, null, a, r);
				break;
			case "together":
				el(t, !1, null, null, void 0, r);
				break;
			case "independent":
				t.memoizedState = null;
				break;
			default: n = $c(t.child), n === null ? (i = t.child, t.child = null) : (i = n.sibling, n.sibling = null), el(t, !1, i, n, a, r);
		}
		return t.child;
	}
	function rl(e, t, n) {
		var r = t.pendingProps;
		return da(t, t.type, r.value), kc(e, t, r.children, n), t.child;
	}
	function il(e, t, n) {
		if (e !== null && (t.dependencies = e.dependencies), od |= t.lanes, (n & t.childLanes) === 0) {
			if (e !== null) {
				if (ha(e, t, n, !1), (n & t.childLanes) === 0) return null;
			} else return null;
		}
		if (e !== null && t.child !== e.child) throw Error(i(153));
		if (t.child !== null) {
			for (e = t.child, n = Di(e, e.pendingProps), t.child = n, n.return = t; e.sibling !== null;) e = e.sibling, n = n.sibling = Di(e, e.pendingProps), n.return = t;
			n.sibling = null;
		}
		return t.child;
	}
	function al(e, t) {
		return (e.lanes & t) !== 0 || (e = e.dependencies, !!(e !== null && ga(e)));
	}
	function ol(e, t, n) {
		switch (t.tag) {
			case 3:
				_e(t, t.stateNode.containerInfo), da(t, wa, e.memoizedState.cache), aa();
				break;
			case 27:
			case 5:
				ye(t);
				break;
			case 4:
				_e(t, t.stateNode.containerInfo);
				break;
			case 10:
				da(t, t.type, t.memoizedProps.value);
				break;
			case 31:
				if (t.memoizedState !== null) return t.flags |= 128, Do(t), null;
				break;
			case 13:
				var r = t.memoizedState;
				if (r !== null) {
					if (r.dehydrated !== null) return Eo(t), t.flags |= 128, null;
					r = ha(e, t, n, !1);
					var i = t.child.childLanes;
					return r || (n & i) !== 0 ? qc(e, t, n) : (Eo(t), e = il(e, t, n), e === null ? null : e.sibling);
				}
				Eo(t);
				break;
			case 19:
				if (t.flags & 128) return nl(e, t, n);
				if (i = !!(e.flags & 128), r = (n & t.childLanes) !== 0, r ||= (ha(e, t, n, !1), (n & t.childLanes) !== 0), i) {
					if (r) return nl(e, t, n);
					t.flags |= 128;
				}
				if (i = t.memoizedState, i !== null && (i.rendering = null, i.tail = null, i.lastEffect = null), Mo(t, jo.current), r) break;
				return null;
			case 22: return t.lanes = 0, Nc(e, t, n, t.pendingProps);
			case 24: da(t, wa, e.memoizedState.cache);
		}
		return il(e, t, n);
	}
	function sl(e, t, n) {
		if (e !== null) {
			if (e.memoizedProps !== t.pendingProps) Oc = !0;
			else {
				if (!al(e, n) && !(t.flags & 128)) return Oc = !1, ol(e, t, n);
				Oc = !!(e.flags & 131072);
			}
		} else Oc = !1, q && t.flags & 1048576 && Ki(t, zi, t.index);
		switch (t.lanes = 0, t.tag) {
			case 16:
				a: {
					var r = t.pendingProps;
					if (e = Ja(t.elementType), t.type = e, typeof e == "function") Ei(e) ? (r = _c(e, r), t.tag = 1, t = Hc(null, t, e, r, n)) : (t.tag = 0, t = Bc(null, t, e, r, n));
					else {
						if (e != null) {
							var a = e.$$typeof;
							if (a === F) {
								t.tag = 11, t = Ac(null, t, e, r, n);
								break a;
							}
							if (a === L) {
								t.tag = 14, t = jc(null, t, e, r, n);
								break a;
							}
							if (a === P) {
								t.tag = 10, t.type = e, t = rl(null, t, n);
								break a;
							}
						}
						throw t = ue(e) || e, Error(i(306, t, ""));
					}
				}
				return t;
			case 0: return Bc(e, t, t.type, t.pendingProps, n);
			case 1: return r = t.type, a = _c(r, t.pendingProps), Hc(e, t, r, a, n);
			case 3:
				a: {
					if (_e(t, t.stateNode.containerInfo), e === null) throw Error(i(387));
					r = t.pendingProps;
					var o = t.memoizedState;
					a = o.element, co(e, t), go(t, r, null, n);
					var s = t.memoizedState;
					if (r = s.cache, da(t, wa, r), r !== o.cache && ma(t, [wa], n, !0), ho(), r = s.element, o.isDehydrated) {
						if (o = {
							element: r,
							isDehydrated: !1,
							cache: s.cache
						}, t.updateQueue.baseState = o, t.memoizedState = o, t.flags & 256) {
							t = Uc(e, t, r, n);
							break a;
						}
						if (r !== a) {
							a = Fi(Error(i(424)), t), sa(a), t = Uc(e, t, r, n);
							break a;
						}
						switch (e = t.stateNode.containerInfo, e.nodeType) {
							case 9:
								e = e.body;
								break;
							default: e = e.nodeName === "HTML" ? e.ownerDocument.body : e;
						}
						for (Zi = um(e.firstChild), Xi = t, q = !0, Qi = null, $i = !0, n = ao(t, null, r, n), t.child = n; n;) n.flags = n.flags & -3 | 134221824, n = n.sibling;
					} else {
						if (aa(), r === a) {
							t = il(e, t, n);
							break a;
						}
						kc(e, t, r, n);
					}
					t = t.child;
				}
				return t;
			case 26: return zc(e, t), e === null ? (n = Pm(t.type, null, t.pendingProps, null)) ? t.memoizedState = n : q || (t.stateNode = pp(t.type, t.pendingProps, W.current, t)) : t.memoizedState = Pm(t.type, e.memoizedProps, t.pendingProps, e.memoizedState), null;
			case 27: return ye(t), e === null && q && (r = t.stateNode = gm(t.type, t.pendingProps, W.current), Xi = t, $i = !0, a = Zi, Cp(t.type) ? (dm = a, Zi = um(r.firstChild)) : Zi = a), kc(e, t, t.pendingProps.children, n), zc(e, t), e === null && (t.flags |= 4194304), t.child;
			case 5: return e === null && q && ((a = r = Zi) && (r = im(r, t.type, t.pendingProps, $i), r === null ? a = !1 : (t.stateNode = r, Xi = t, Zi = um(r.firstChild), $i = !1, a = !0)), a || ta(t)), ye(t), a = t.type, o = t.pendingProps, s = e === null ? null : e.memoizedProps, r = o.children, mp(a, o) ? r = null : s !== null && mp(a, s) && (t.flags |= 32), t.memoizedState !== null && (a = qo(e, t, Xo, null, null, n), ch._currentValue = a), zc(e, t), kc(e, t, r, n), t.child;
			case 6: return e === null && q && ((e = n = Zi) && (n = am(n, t.pendingProps, $i), n === null ? e = !1 : (t.stateNode = n, Xi = t, Zi = null, e = !0)), e || ta(t)), null;
			case 13: return qc(e, t, n);
			case 4: return _e(t, t.stateNode.containerInfo), r = t.pendingProps, e === null ? t.child = io(t, null, r, n) : kc(e, t, r, n), t.child;
			case 11: return Ac(e, t, t.type, t.pendingProps, n);
			case 7: return r = t.pendingProps, zc(e, t), kc(e, t, r, n), t.child;
			case 8: return kc(e, t, t.pendingProps.children, n), t.child;
			case 12: return kc(e, t, t.pendingProps.children, n), t.child;
			case 10: return rl(e, t, n);
			case 9: return a = t.type._context, r = t.pendingProps.children, _a(t), a = va(a), r = r(a), t.flags |= 1, kc(e, t, r, n), t.child;
			case 14: return jc(e, t, t.type, t.pendingProps, n);
			case 15: return Mc(e, t, t.type, t.pendingProps, n);
			case 19: return nl(e, t, n);
			case 31: return Rc(e, t, n);
			case 22: return Nc(e, t, n, t.pendingProps);
			case 24: return _a(t), r = va(wa), e === null ? (a = za(), a === null && (a = Zu, o = Ta(), a.pooledCache = o, o.refCount++, o !== null && (a.pooledCacheLanes |= n), a = o), t.memoizedState = {
				parent: r,
				cache: a
			}, so(t), da(t, wa, a)) : ((e.lanes & n) !== 0 && (co(e, t), go(t, null, null, n), ho()), a = e.memoizedState, o = t.memoizedState, a.parent === r ? (r = o.cache, da(t, wa, r), r !== a.cache && ma(t, [wa], n, !0)) : (a = {
				parent: r,
				cache: r
			}, t.memoizedState = a, t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = a), da(t, wa, r))), kc(e, t, t.pendingProps.children, n), t.child;
			case 30: return t.stateNode === null && (t.stateNode = {
				autoName: null,
				paired: null,
				clones: null,
				ref: null
			}), r = t.pendingProps, r.name != null && r.name !== "auto" ? t.flags |= e === null ? 18882560 : 18874368 : q && qi(t), e !== null && e.memoizedProps.name !== r.name ? t.flags |= 4194816 : zc(e, t), kc(e, t, r.children, n), t.child;
			case 29: throw t.pendingProps;
		}
		throw Error(i(156, t.tag));
	}
	function cl(e) {
		e.flags |= 4;
	}
	function ll(e, t, n, r, i) {
		var a;
		if ((a = !!(e.mode & 32)) && (a = n === null ? Ym(t, r) : Ym(t, r) && (r.src !== n.src || r.srcSet !== n.srcSet)), a) {
			if (e.flags |= 16777216, (i & 335544128) === i) {
				if (e.stateNode.complete) e.flags |= 8192;
				else if (Ud()) e.flags |= 8192;
				else throw Ya = Ga, Ua;
			}
		} else e.flags &= -16777217;
	}
	function ul(e, t) {
		if (t.type !== "stylesheet" || t.state.loading & 4) e.flags &= -16777217;
		else if (e.flags |= 16777216, !Xm(t)) {
			if (Ud()) e.flags |= 8192;
			else throw Ya = Ga, Ua;
		}
	}
	function dl(e, t) {
		t !== null && (e.flags |= 4), e.flags & 16384 && (t = e.tag === 22 ? 536870912 : nt(), e.lanes |= t, ud |= t);
	}
	function fl(e, t) {
		if (!q) switch (e.tailMode) {
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
	function pl(e) {
		var t = e.alternate !== null && e.alternate.child === e.child, n = 0, r = 0;
		if (t) for (var i = e.child; i !== null;) n |= i.lanes | i.childLanes, r |= i.subtreeFlags & 1206910976, r |= i.flags & 1206910976, i.return = e, i = i.sibling;
		else for (i = e.child; i !== null;) n |= i.lanes | i.childLanes, r |= i.subtreeFlags, r |= i.flags, i.return = e, i = i.sibling;
		return e.subtreeFlags |= r, e.childLanes = n, t;
	}
	function ml(e, t, n) {
		var r = t.pendingProps;
		switch (Ji(t), t.tag) {
			case 16:
			case 15:
			case 0:
			case 11:
			case 7:
			case 8:
			case 12:
			case 9:
			case 14: return pl(t), null;
			case 1: return pl(t), null;
			case 3: return n = t.stateNode, r = null, e !== null && (r = e.memoizedState.cache), t.memoizedState.cache !== r && (t.flags |= 2048), fa(wa), ve(), n.pendingContext && (n.context = n.pendingContext, n.pendingContext = null), (e === null || e.child === null) && (ia(t) ? cl(t) : e === null || e.memoizedState.isDehydrated && !(t.flags & 256) || (t.flags |= 1024, oa())), pl(t), null;
			case 26:
				var a = t.type, o = t.memoizedState;
				return e === null ? (cl(t), o === null ? (pl(t), ll(t, a, null, r, n)) : (pl(t), ul(t, o))) : o ? o === e.memoizedState ? (pl(t), t.flags &= -16777217) : (cl(t), pl(t), ul(t, o)) : (e = e.memoizedProps, e !== r && cl(t), pl(t), ll(t, a, e, r, n)), null;
			case 27:
				if (be(t), n = W.current, a = t.type, e !== null && t.stateNode != null) e.memoizedProps !== r && cl(t);
				else {
					if (!r) {
						if (t.stateNode === null) throw Error(i(166));
						return pl(t), t.subtreeFlags &= -33554433, null;
					}
					e = ge.current, ia(t) ? na(t, e) : (e = gm(a, r, n), t.stateNode = e, cl(t));
				}
				return pl(t), t.subtreeFlags &= -33554433, null;
			case 5:
				if (be(t), a = t.type, e !== null && t.stateNode != null) e.memoizedProps !== r && cl(t);
				else {
					if (!r) {
						if (t.stateNode === null) throw Error(i(166));
						return pl(t), t.subtreeFlags &= -33554433, null;
					}
					if (o = ge.current, ia(t)) na(t, o);
					else {
						var s = up(W.current);
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
						o[mt] = t, o[ht] = r;
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
						a: switch (Q(o, a, r), a) {
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
						r && cl(t);
					}
				}
				return pl(t), t.subtreeFlags &= -33554433, ll(t, t.type, e === null ? null : e.memoizedProps, t.pendingProps, n), null;
			case 6:
				if (e && t.stateNode != null) e.memoizedProps !== r && cl(t);
				else {
					if (typeof r != "string" && t.stateNode === null) throw Error(i(166));
					if (e = W.current, ia(t)) {
						if (e = t.stateNode, n = t.memoizedProps, r = null, a = Xi, a !== null) switch (a.tag) {
							case 27:
							case 5: r = a.memoizedProps;
						}
						e[mt] = t, e = !!(e.nodeValue === n || r !== null && !0 === r.suppressHydrationWarning || tp(e.nodeValue, n)), e || ta(t, !0);
					} else e = up(e).createTextNode(r), e[mt] = t, t.stateNode = e;
				}
				return pl(t), null;
			case 31:
				if (n = t.memoizedState, e === null || e.memoizedState !== null) {
					if (r = ia(t), n !== null) {
						if (e === null) {
							if (!r) throw Error(i(318));
							if (e = t.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(i(557));
							e[mt] = t;
						} else aa(), !(t.flags & 128) && (t.memoizedState = null), t.flags |= 4;
						pl(t), e = !1;
					} else n = oa(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = n), e = !0;
					if (!e) return t.flags & 256 ? (Ao(t), t) : (Ao(t), null);
					if (t.flags & 128) throw Error(i(558));
				}
				return pl(t), null;
			case 13:
				if (r = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
					if (a = ia(t), r !== null && r.dehydrated !== null) {
						if (e === null) {
							if (!a) throw Error(i(318));
							if (a = t.memoizedState, a = a === null ? null : a.dehydrated, !a) throw Error(i(317));
							a[mt] = t;
						} else aa(), !(t.flags & 128) && (t.memoizedState = null), t.flags |= 4;
						pl(t), a = !1;
					} else a = oa(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = a), a = !0;
					if (!a) return t.flags & 256 ? (Ao(t), t) : (Ao(t), null);
				}
				return Ao(t), t.flags & 128 ? (t.lanes = n, t) : (n = r !== null, e = e !== null && e.memoizedState !== null, n && (r = t.child, a = null, r.alternate !== null && r.alternate.memoizedState !== null && r.alternate.memoizedState.cachePool !== null && (a = r.alternate.memoizedState.cachePool.pool), o = null, r.memoizedState !== null && r.memoizedState.cachePool !== null && (o = r.memoizedState.cachePool.pool), o !== a && (r.flags |= 2048)), n !== e && n && (t.child.flags |= 8192), dl(t, t.updateQueue), pl(t), null);
			case 4: return ve(), e === null && Gf(t.stateNode.containerInfo), t.flags |= 67108864, pl(t), null;
			case 10: return fa(t.type), pl(t), null;
			case 19:
				if (No(t), r = t.memoizedState, r === null) return pl(t), null;
				if (a = !!(t.flags & 128), o = r.rendering, o === null) {
					if (a) fl(r, !1);
					else {
						if (ad !== 0 || e !== null && e.flags & 128) for (e = t.child; e !== null;) {
							if (o = Po(e), o !== null) {
								for (t.flags |= 128, fl(r, !1), e = o.updateQueue, t.updateQueue = e, dl(t, e), t.subtreeFlags = 0, e = n, n = t.child; n !== null;) Oi(n, e), n = n.sibling;
								return Mo(t, jo.current & 1 | 2), q && Gi(t, r.treeForkCount), t.child;
							}
							e = e.sibling;
						}
						r.tail !== null && Ne() > gd && (t.flags |= 128, a = !0, fl(r, !1), t.lanes = 4194304);
					}
				} else {
					if (!a) {
						if (e = Po(o), e !== null) {
							if (t.flags |= 128, a = !0, e = e.updateQueue, t.updateQueue = e, dl(t, e), fl(r, !0), r.tail === null && r.tailMode !== "collapsed" && r.tailMode !== "visible" && !o.alternate && !q) return pl(t), null;
						} else 2 * Ne() - r.renderingStartTime > gd && n !== 536870912 && (t.flags |= 128, a = !0, fl(r, !1), t.lanes = 4194304);
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
					return r.rendering = e, r.tail = e.sibling, r.renderingStartTime = Ne(), e.sibling = null, o = jo.current, o = a ? o & 1 | 2 : o & 1, r.tailMode === "visible" || r.tailMode === "collapsed" || !n || q ? Mo(t, o) : (n = o, H(wo, t), H(jo, n), To === null && (To = t)), q && Gi(t, r.treeForkCount), e;
				}
				return pl(t), null;
			case 22:
			case 23: return Ao(t), Co(), r = t.memoizedState !== null, e === null ? r && (t.flags |= 8192) : e.memoizedState !== null !== r && (t.flags |= 8192), r ? n & 536870912 && !(t.flags & 128) && (pl(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : pl(t), n = t.updateQueue, n !== null && dl(t, n.retryQueue), n = null, e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), r = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (r = t.memoizedState.cachePool.pool), r !== n && (t.flags |= 2048), e !== null && he(Ra), null;
			case 24: return n = null, e !== null && (n = e.memoizedState.cache), t.memoizedState.cache !== n && (t.flags |= 2048), fa(wa), pl(t), null;
			case 25: return null;
			case 30: return t.flags |= 33554432, pl(t), null;
		}
		throw Error(i(156, t.tag));
	}
	function hl(e, t) {
		switch (Ji(t), t.tag) {
			case 1: return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 3: return fa(wa), ve(), e = t.flags, e & 65536 && !(e & 128) ? (t.flags = e & -65537 | 128, t) : null;
			case 26:
			case 27:
			case 5: return be(t), null;
			case 31:
				if (t.memoizedState !== null) {
					if (Ao(t), t.alternate === null) throw Error(i(340));
					aa();
				}
				return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 13:
				if (Ao(t), e = t.memoizedState, e !== null && e.dehydrated !== null) {
					if (t.alternate === null) throw Error(i(340));
					aa();
				}
				return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 19: return No(t), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, e = t.memoizedState, e !== null && (e.rendering = null, e.tail = null), t.flags |= 4, t) : null;
			case 4: return ve(), null;
			case 10: return fa(t.type), null;
			case 22:
			case 23: return Ao(t), Co(), e !== null && he(Ra), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 24: return fa(wa), null;
			case 25: return null;
			default: return null;
		}
	}
	function gl(e, t) {
		switch (Ji(t), t.tag) {
			case 3:
				fa(wa), ve();
				break;
			case 26:
			case 27:
			case 5:
				be(t);
				break;
			case 4:
				ve();
				break;
			case 31:
				t.memoizedState !== null && Ao(t);
				break;
			case 13:
				Ao(t);
				break;
			case 19:
				No(t);
				break;
			case 10:
				fa(t.type);
				break;
			case 22:
			case 23:
				Ao(t), Co(), e !== null && he(Ra);
				break;
			case 24: fa(wa);
		}
	}
	function _l(e, t) {
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
			mf(t, t.return, e);
		}
	}
	function vl(e, t, n) {
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
								mf(i, c, e);
							}
						}
					}
					r = r.next;
				} while (r !== a);
			}
		} catch (e) {
			mf(t, t.return, e);
		}
	}
	function yl(e) {
		var t = e.updateQueue;
		if (t !== null) {
			var n = e.stateNode;
			try {
				vo(t, n);
			} catch (t) {
				mf(e, e.return, t);
			}
		}
	}
	function bl(e, t, n) {
		n.props = _c(e.type, e.memoizedProps), n.state = e.memoizedState;
		try {
			n.componentWillUnmount();
		} catch (n) {
			mf(e, t, n);
		}
	}
	function xl(e, t) {
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
						var i = e.stateNode, a = ui(e.memoizedProps, i);
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
			mf(e, t, n);
		}
	}
	function Sl(e, t) {
		var n = e.ref, r = e.refCleanup;
		if (n !== null) {
			if (typeof r == "function") try {
				r();
			} catch (n) {
				mf(e, t, n);
			} finally {
				e.refCleanup = null, e = e.alternate, e != null && (e.refCleanup = null);
			}
			else if (typeof n == "function") try {
				n(null);
			} catch (n) {
				mf(e, t, n);
			}
			else n.current = null;
		}
	}
	function Cl(e, t) {
		if ((e.tag === 5 || e.tag === 27 || e.tag === 6) && e.alternate === null && t !== null) for (var n = 0; n < t.length; n++) tm(e.stateNode, t[n]);
	}
	function wl(e) {
		for (var t = e.return; t !== null && (El(t) && tm(e.stateNode, t.stateNode), !Tl(t));) t = t.return;
	}
	function Y(e) {
		for (var t = e.return; t !== null && (El(t) && nm(e.stateNode, t.stateNode), !Tl(t));) t = t.return;
	}
	function Tl(e) {
		return e.tag === 5 || e.tag === 3 || e.tag === 27;
	}
	function El(e) {
		return e && e.tag === 7 && e.stateNode !== null;
	}
	function Dl(e) {
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
			mf(e, e.return, t);
		}
	}
	function Ol(e, t, n) {
		try {
			var r = e.stateNode;
			ap(r, e.type, n, t), r[ht] = t;
		} catch (t) {
			mf(e, e.return, t);
		}
	}
	function kl(e) {
		return e.tag === 5 || e.tag === 3 || e.tag === 26 || e.tag === 27 && Cp(e.type) || e.tag === 4;
	}
	function Al(e) {
		a: for (;;) {
			for (; e.sibling === null;) {
				if (e.return === null || kl(e.return)) return null;
				e = e.return;
			}
			for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18;) {
				if (e.tag === 27 && Cp(e.type) || e.flags & 2 || e.child === null || e.tag === 4) continue a;
				e.child.return = e, e = e.child;
			}
			if (!(e.flags & 2)) return e.stateNode;
		}
	}
	function jl(e, t, n, r) {
		var i = e.tag;
		if (i === 5 || i === 6) i = e.stateNode, t ? (n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n).insertBefore(i, t) : (t = n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n, t.appendChild(i), n = n._reactRootContainer, n != null || t.onclick !== null || (t.onclick = dn)), Cl(e, r), Rt = !0;
		else if (i !== 4 && (i === 27 && (Cl(e, r), r = null, Cp(e.type) && (n = e.stateNode, t = null)), e = e.child, e !== null)) for (jl(e, t, n, r), e = e.sibling; e !== null;) jl(e, t, n, r), e = e.sibling;
	}
	function Ml(e, t, n, r) {
		var i = e.tag;
		if (i === 5 || i === 6) i = e.stateNode, t ? n.insertBefore(i, t) : n.appendChild(i), Cl(e, r), Rt = !0;
		else if (i !== 4 && (i === 27 && (Cl(e, r), r = null, Cp(e.type) && (n = e.stateNode)), e = e.child, e !== null)) for (Ml(e, t, n, r), e = e.sibling; e !== null;) Ml(e, t, n, r), e = e.sibling;
	}
	function Nl(e) {
		var t = e.stateNode, n = e.memoizedProps;
		try {
			for (var r = e.type, i = t.attributes; i.length;) t.removeAttributeNode(i[0]);
			Q(t, r, n), t[mt] = e, t[ht] = n;
		} catch (t) {
			mf(e, e.return, t);
		}
	}
	var Pl = !1, Fl = null;
	function Il(e) {
		(e.tag === 30 || e.subtreeFlags & 33554432) && (Pl = !0);
	}
	var Ll = null;
	function Rl() {
		var e = Ll;
		return Ll = null, e;
	}
	var zl = 0;
	function Bl(e, t, n, r, i) {
		return zl = 0, Vl(e.child, t, n, r, i);
	}
	function Vl(e, t, n, r, i) {
		for (var a = !1; e !== null;) {
			if (e.tag === 5) {
				var o = e.stateNode;
				if (r !== null) {
					var s = kp(o);
					r.push(s), s.view && (a = !0);
				} else a || kp(o).view && (a = !0);
				Pl = !0, Ep(o, zl === 0 ? t : t + "_" + zl, n), zl++;
			} else e.tag === 22 && e.memoizedState !== null || e.tag === 30 && i || Vl(e.child, t, n, r, i) && (a = !0);
			e = e.sibling;
		}
		return a;
	}
	function Hl(e, t) {
		for (; e !== null;) e.tag === 5 ? Dp(e.stateNode, e.memoizedProps) : e.tag === 22 && e.memoizedState !== null || e.tag === 30 && t || Hl(e.child, t), e = e.sibling;
	}
	function Ul(e) {
		if (e.subtreeFlags & 18874368) for (e = e.child; e !== null;) {
			if ((e.tag !== 22 || e.memoizedState === null) && (Ul(e), e.tag === 30 && e.flags & 18874368 && e.stateNode.paired)) {
				var t = e.memoizedProps;
				if (t.name == null || t.name === "auto") throw Error(i(544));
				var n = t.name;
				t = fi(t.default, t.share), t !== "none" && (Bl(e, n, t, null, !1) || Hl(e.child, !1));
			}
			e = e.sibling;
		}
	}
	function Wl(e, t) {
		if (e.tag === 30) {
			var n = e.stateNode, r = e.memoizedProps, i = ui(r, n), a = fi(r.default, n.paired ? r.share : r.enter);
			a === "none" ? Ul(e) : Bl(e, i, a, null, !1) ? (Ul(e), n.paired || t || Nd(e, r.onEnter)) : Hl(e.child, !1);
		} else if (e.subtreeFlags & 33554432) for (e = e.child; e !== null;) Wl(e, t), e = e.sibling;
		else Ul(e);
	}
	function Gl(e) {
		if (Fl !== null && Fl.size !== 0) {
			var t = Fl;
			if (e.subtreeFlags & 18874368) for (e = e.child; e !== null;) {
				if (e.tag !== 22 || e.memoizedState === null) {
					if (e.tag === 30 && e.flags & 18874368) {
						var n = e.memoizedProps, r = n.name;
						if (r != null && r !== "auto") {
							var i = t.get(r);
							if (i !== void 0) {
								var a = fi(n.default, n.share);
								if (a !== "none" && (Bl(e, r, a, null, !1) ? (a = e.stateNode, i.paired = a, a.paired = i, Nd(e, n.onShare)) : Hl(e.child, !1)), t.delete(r), t.size === 0) break;
							}
						}
					}
					Gl(e);
				}
				e = e.sibling;
			}
		}
	}
	function Kl(e) {
		if (e.tag === 30) {
			var t = e.memoizedProps, n = ui(t, e.stateNode), r = Fl === null ? void 0 : Fl.get(n), i = fi(t.default, r === void 0 ? t.exit : t.share);
			i !== "none" && (Bl(e, n, i, null, !1) ? r === void 0 ? Nd(e, t.onExit) : (i = e.stateNode, r.paired = i, i.paired = r, Fl.delete(n), Nd(e, t.onShare)) : Hl(e.child, !1)), Fl !== null && Gl(e);
		} else if (e.subtreeFlags & 33554432) for (e = e.child; e !== null;) Kl(e), e = e.sibling;
		else Fl !== null && Gl(e);
	}
	function ql(e) {
		for (e = e.child; e !== null;) {
			if (e.tag === 30) {
				var t = e.memoizedProps, n = ui(t, e.stateNode);
				t = fi(t.default, t.update), e.flags &= -5, t !== "none" && Bl(e, n, t, e.memoizedState = [], !1);
			} else e.subtreeFlags & 33554432 && ql(e);
			e = e.sibling;
		}
	}
	function Jl(e) {
		if (e.subtreeFlags & 18874368) for (e = e.child; e !== null;) {
			if (e.tag !== 22 || e.memoizedState === null) {
				if (e.tag === 30 && e.flags & 18874368) {
					var t = e.stateNode;
					t.paired !== null && (t.paired = null, Hl(e.child, !1));
				}
				Jl(e);
			}
			e = e.sibling;
		}
	}
	function Yl(e) {
		if (e.tag === 30) e.stateNode.paired = null, Hl(e.child, !1), Jl(e);
		else if (e.subtreeFlags & 33554432) for (e = e.child; e !== null;) Yl(e), e = e.sibling;
		else Jl(e);
	}
	function Xl(e) {
		for (e = e.child; e !== null;) e.tag === 30 ? Hl(e.child, !1) : e.subtreeFlags & 33554432 && Xl(e), e = e.sibling;
	}
	function Zl(e, t, n, r, i, a, o) {
		for (var s = !1; t !== null;) {
			if (t.tag === 5) {
				var c = t.stateNode;
				if (a !== null && zl < a.length) {
					var l = a[zl], u = kp(c);
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
				e.flags & 4 && Ep(c, zl === 0 ? n : n + "_" + zl, i), s && e.flags & 4 || (Ll === null && (Ll = []), Ll.push(c, zl === 0 ? r : r + "_" + zl, t.memoizedProps)), zl++;
			} else (t.tag !== 22 || t.memoizedState === null) && (t.tag === 30 && o ? e.flags |= t.flags & 32 : Zl(e, t.child, n, r, i, a, o) && (s = !0));
			t = t.sibling;
		}
		return s;
	}
	function Ql(e, t) {
		for (e = e.child; e !== null;) {
			if (e.tag === 30) {
				var n = e.memoizedProps, r = e.stateNode, i = ui(n, r), a = fi(n.default, n.update);
				if (t) {
					r = r.clones;
					var o = r === null ? null : r.map(Ap);
				} else o = e.memoizedState, e.memoizedState = null;
				r = e;
				var s = e.child;
				zl = 0, i = Zl(r, s, i, i, a, o, !1), e.flags & 4 && i && (t || Nd(e, n.onUpdate));
			} else e.subtreeFlags & 33554432 && Ql(e, t);
			e = e.sibling;
		}
	}
	var $l = !1, eu = !1, tu = !1, nu = !1, ru = typeof WeakSet == "function" ? WeakSet : Set, iu = null, au = !1, ou = !1, su = !1, cu = !1;
	function lu(e, t, n) {
		if (e = e.containerInfo, cp = _h, e = Br(e), Vr(e)) {
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
		}, _h = !1, n = (n & 335544064) === n, iu = t, t = n ? 9270 : 1024; iu !== null;) {
			if (e = iu, n && (r = e.deletions, r !== null)) for (a = 0; a < r.length; a++) n && Kl(r[a]);
			if (e.alternate === null && e.flags & 2) n && Il(e), uu(n);
			else {
				if (e.tag === 22) {
					if (r = e.alternate, e.memoizedState !== null) {
						r !== null && r.memoizedState === null && n && Kl(r), uu(n);
						continue;
					}
					if (r !== null && r.memoizedState !== null) {
						n && Il(e), uu(n);
						continue;
					}
				}
				r = e.child, (e.subtreeFlags & t) !== 0 && r !== null ? (r.return = e, iu = r) : (n && ql(e), uu(n));
			}
		}
		Fl = null;
	}
	function uu(e) {
		for (; iu !== null;) {
			var t = iu, n = e, r = t.alternate, a = t.flags;
			switch (t.tag) {
				case 0:
				case 11:
				case 15: break;
				case 1:
					if (a & 1024 && r !== null) {
						n = void 0, a = r.memoizedProps, r = r.memoizedState;
						var o = t.stateNode;
						try {
							var s = _c(t.type, a);
							n = o.getSnapshotBeforeUpdate(s, r), o.__reactInternalSnapshotBeforeUpdate = n;
						} catch (e) {
							mf(t, t.return, e);
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
					n && r !== null && (n = ui(r.memoizedProps, r.stateNode), a = t.memoizedProps, a = fi(a.default, a.update), a !== "none" && Bl(r, n, a, r.memoizedState = [], !0));
					break;
				default: if (a & 1024) throw Error(i(163));
			}
			if (r = t.sibling, r !== null) {
				r.return = t.return, iu = r;
				break;
			}
			iu = t.return;
		}
	}
	function du(e, t, n) {
		var r = n.flags;
		switch (n.tag) {
			case 0:
			case 11:
			case 15:
				ju(e, n), r & 4 && _l(5, n);
				break;
			case 1:
				if (ju(e, n), r & 4) {
					if (e = n.stateNode, t === null) try {
						e.componentDidMount();
					} catch (e) {
						mf(n, n.return, e);
					}
					else {
						var i = _c(n.type, t.memoizedProps);
						t = t.memoizedState;
						try {
							e.componentDidUpdate(i, t, e.__reactInternalSnapshotBeforeUpdate);
						} catch (e) {
							mf(n, n.return, e);
						}
					}
				}
				r & 64 && yl(n), r & 512 && xl(n, n.return);
				break;
			case 3:
				if (ju(e, n), r & 64 && (e = n.updateQueue, e !== null)) {
					if (t = null, n.child !== null) switch (n.child.tag) {
						case 27:
						case 5:
							t = n.child.stateNode;
							break;
						case 1: t = n.child.stateNode;
					}
					try {
						vo(e, t);
					} catch (e) {
						mf(n, n.return, e);
					}
				}
				break;
			case 27: t === null && r & 4 && Nl(n);
			case 26:
			case 5:
				ju(e, n), t === null && r & 4 && Dl(n), r & 512 && xl(n, n.return);
				break;
			case 12:
				ju(e, n);
				break;
			case 31:
				ju(e, n), r & 4 && bu(e, n);
				break;
			case 13:
				ju(e, n), r & 4 && xu(e, n), r & 64 && (e = n.memoizedState, e !== null && (e = e.dehydrated, e !== null && (n = vf.bind(null, n), lm(e, n))));
				break;
			case 22:
				if (r = n.memoizedState !== null || $l, !r) {
					var a = t !== null && t.memoizedState !== null || eu;
					t = $l, i = eu, $l = r, (eu = a) && !i ? (r = 2, n.subtreeFlags & 8772 && (r |= 1), Nu(e, n, r)) : ju(e, n), $l = t, eu = i;
				}
				break;
			case 30:
				ju(e, n), r & 512 && xl(n, n.return);
				break;
			case 7: r & 512 && xl(n, n.return);
			default: ju(e, n);
		}
	}
	function fu(e, t) {
		for (e = e.child; e !== null;) pu(e, t), e = e.sibling;
	}
	function pu(e, t) {
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
					mf(e, e.return, t);
				}
				mu(e, t);
				break;
			case 6:
				try {
					e.stateNode.nodeValue = t ? "" : e.memoizedProps, Rt = !0;
				} catch (t) {
					mf(e, e.return, t);
				}
				break;
			case 18:
				try {
					var s = e.stateNode;
					t ? Tp(s, !0) : Tp(e.stateNode, !1);
				} catch (t) {
					mf(e, e.return, t);
				}
				break;
			case 22:
			case 23:
				e.memoizedState === null && fu(e, t);
				break;
			default: fu(e, t);
		}
	}
	function mu(e, t) {
		if (e.subtreeFlags & 67108864) for (e = e.child; e !== null;) {
			a: {
				var n = e, r = t;
				switch (n.tag) {
					case 4:
						pu(n, r);
						break a;
					case 22:
						n.memoizedState === null && mu(n, r);
						break a;
					default: mu(n, r);
				}
			}
			e = e.sibling;
		}
	}
	function hu(e) {
		var t = e.alternate;
		t !== null && (e.alternate = null, hu(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && Ct(t)), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
	}
	var gu = null, _u = !1;
	function vu(e, t, n) {
		for (n = n.child; n !== null;) yu(e, t, n), n = n.sibling;
	}
	function yu(e, t, n) {
		if (He && typeof He.onCommitFiberUnmount == "function") try {
			He.onCommitFiberUnmount(Ve, n);
		} catch {}
		switch (n.tag) {
			case 26:
				eu || Sl(n, t), vu(e, t, n), n.memoizedState ? n.memoizedState.count-- : n.stateNode && !eu && (n = n.stateNode, n.parentNode.removeChild(n));
				break;
			case 27:
				eu || Sl(n, t), Y(n);
				var r = gu, i = _u;
				Cp(n.type) && (gu = n.stateNode, _u = !1), vu(e, t, n), _m(n.stateNode, n.type, n.memoizedProps), gu = r, _u = i;
				break;
			case 5: eu || Sl(n, t), Y(n);
			case 6:
				if (n.tag === 6 && Y(n), r = gu, i = _u, gu = null, vu(e, t, n), gu = r, _u = i, gu !== null) {
					if (_u) try {
						(gu.nodeType === 9 ? gu.body : gu.nodeName === "HTML" ? gu.ownerDocument.body : gu).removeChild(n.stateNode), Rt = !0;
					} catch (e) {
						mf(n, t, e);
					}
					else try {
						gu.removeChild(n.stateNode), Rt = !0;
					} catch (e) {
						mf(n, t, e);
					}
				}
				break;
			case 18:
				gu !== null && (_u ? (e = gu, wp(e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e, n.stateNode), Uh(e)) : wp(gu, n.stateNode));
				break;
			case 4:
				r = gu, i = _u, gu = n.stateNode.containerInfo, _u = !0, vu(e, t, n), gu = r, _u = i;
				break;
			case 0:
			case 11:
			case 14:
			case 15:
				vl(2, n, t), eu || vl(4, n, t), vu(e, t, n);
				break;
			case 1:
				eu || (Sl(n, t), r = n.stateNode, typeof r.componentWillUnmount == "function" && bl(n, t, r)), vu(e, t, n);
				break;
			case 21:
				vu(e, t, n);
				break;
			case 22:
				eu = (r = eu) || n.memoizedState !== null, vu(e, t, n), eu = r;
				break;
			case 30:
				Sl(n, t), vu(e, t, n);
				break;
			case 7:
				eu || Sl(n, t), vu(e, t, n);
				break;
			default: vu(e, t, n);
		}
	}
	function bu(e, t) {
		if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null))) {
			e = e.dehydrated;
			try {
				Uh(e);
			} catch (e) {
				mf(t, t.return, e);
			}
		}
	}
	function xu(e, t) {
		if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null && (e = e.dehydrated, e !== null)))) try {
			Uh(e);
		} catch (e) {
			mf(t, t.return, e);
		}
	}
	function Su(e) {
		switch (e.tag) {
			case 31:
			case 13:
			case 19:
				var t = e.stateNode;
				return t === null && (t = e.stateNode = new ru()), t;
			case 22: return e = e.stateNode, t = e._retryCache, t === null && (t = e._retryCache = new ru()), t;
			default: throw Error(i(435, e.tag));
		}
	}
	function Cu(e, t) {
		var n = Su(e);
		t.forEach(function(t) {
			if (!n.has(t)) {
				n.add(t);
				var r = yf.bind(null, e, t);
				t.then(r, r);
			}
		});
	}
	function wu(e, t, n) {
		var r = t.deletions;
		if (r !== null) for (var a = 0; a < r.length; a++) {
			var o = r[a], s = e, c = t, l = c;
			a: for (; l !== null;) {
				switch (l.tag) {
					case 27:
						if (Cp(l.type)) {
							gu = l.stateNode, _u = !1;
							break a;
						}
						break;
					case 5:
						gu = l.stateNode, _u = !1;
						break a;
					case 3:
					case 4:
						gu = l.stateNode.containerInfo, _u = !0;
						break a;
				}
				l = l.return;
			}
			if (gu === null) throw Error(i(160));
			yu(s, c, o), gu = null, _u = !1, s = o.alternate, s !== null && (s.return = null), o.return = null;
		}
		if (t.subtreeFlags & 13886) for (t = t.child; t !== null;) Eu(t, e, n), t = t.sibling;
	}
	var Tu = null;
	function Eu(e, t, n) {
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
				wu(t, e, n), Du(e), a & 4 && (vl(3, e, e.return), _l(3, e), vl(5, e, e.return));
				break;
			case 1:
				wu(t, e, n), Du(e), a & 512 && (eu || r === null || Sl(r, r.return)), a & 64 && $l && (e = e.updateQueue, e !== null && (t = e.callbacks, t !== null && (n = e.shared.hiddenCallbacks, e.shared.hiddenCallbacks = n === null ? t : n.concat(t))));
				break;
			case 26:
				if (o = Tu, wu(t, e, n), Du(e), a & 512 && (eu || r === null || Sl(r, r.return)), a & 4) {
					if (a = r === null ? null : r.memoizedState, n = e.memoizedState, r === null) {
						if (n === null) {
							if (e.stateNode === null) {
								if ($l) e.stateNode = pp(e.type, e.memoizedProps, t.containerInfo, e);
								else {
									a: {
										t = e.type, n = e.memoizedProps, a = o.ownerDocument || o;
										b: switch (t) {
											case "title":
												r = a.getElementsByTagName("title")[0], (!r || r[xt] || r[mt] || r.namespaceURI === "http://www.w3.org/2000/svg" || r.hasAttribute("itemprop")) && (r = a.createElement(t), a.head.insertBefore(r, a.querySelector("head > title"))), Q(r, t, n), r[mt] = e, Ot(r), t = r;
												break a;
											case "link":
												if (o = Km("link", "href", a).get(t + (n.href || ""))) {
													for (s = 0; s < o.length; s++) if (r = o[s], r.getAttribute("href") === (n.href == null || n.href === "" ? null : n.href) && r.getAttribute("rel") === (n.rel == null ? null : n.rel) && r.getAttribute("title") === (n.title == null ? null : n.title) && r.getAttribute("crossorigin") === (n.crossOrigin == null ? null : n.crossOrigin)) {
														o.splice(s, 1);
														break b;
													}
												}
												r = a.createElement(t), Q(r, t, n), a.head.appendChild(r);
												break;
											case "meta":
												if (o = Km("meta", "content", a).get(t + (n.content || ""))) {
													for (s = 0; s < o.length; s++) if (r = o[s], r.getAttribute("content") === (n.content == null ? null : "" + n.content) && r.getAttribute("name") === (n.name == null ? null : n.name) && r.getAttribute("property") === (n.property == null ? null : n.property) && r.getAttribute("http-equiv") === (n.httpEquiv == null ? null : n.httpEquiv) && r.getAttribute("charset") === (n.charSet == null ? null : n.charSet)) {
														o.splice(s, 1);
														break b;
													}
												}
												r = a.createElement(t), Q(r, t, n), a.head.appendChild(r);
												break;
											default: throw Error(i(468, t));
										}
										r[mt] = e, Ot(r), t = r;
									}
									e.stateNode = t;
								}
							} else $l || qm(o, e.type, e.stateNode);
						} else e.stateNode = Vm(o, n, e.memoizedProps);
					} else a === n ? n === null && e.stateNode !== null && Ol(e, e.memoizedProps, r.memoizedProps) : (a === null ? (t = r.stateNode, t === null || eu || t.parentNode.removeChild(t)) : a.count--, n === null ? $l || qm(o, e.type, e.stateNode) : Vm(o, n, e.memoizedProps));
				}
				break;
			case 27:
				wu(t, e, n), Du(e), a & 512 && (eu || r === null || Sl(r, r.return)), r !== null && a & 4 && Ol(e, e.memoizedProps, r.memoizedProps);
				break;
			case 5:
				if (o = tu, tu = !1, wu(t, e, n), tu = o, Du(e), a & 512 && (eu || r === null || Sl(r, r.return)), e.flags & 32) {
					t = e.stateNode;
					try {
						nn(t, ""), Rt = !0;
					} catch (t) {
						mf(e, e.return, t);
					}
				}
				a & 4 && e.stateNode != null && (t = e.memoizedProps, Ol(e, t, r === null ? t : r.memoizedProps)), a & 1024 && (nu = !0);
				break;
			case 6:
				if (wu(t, e, n), Du(e), a & 4) {
					if (e.stateNode === null) throw Error(i(162));
					t = e.memoizedProps, n = e.stateNode;
					try {
						n.nodeValue = t, Rt = !0;
					} catch (t) {
						mf(e, e.return, t);
					}
				}
				break;
			case 3:
				if (Rt = !1, Gm = null, o = Tu, Tu = xm(t.containerInfo), wu(t, e, n), Tu = o, Du(e), a & 4 && r !== null && r.memoizedState.isDehydrated) try {
					Uh(t.containerInfo);
				} catch (t) {
					mf(e, e.return, t);
				}
				nu && (nu = !1, Ou(e)), Rt = !1;
				break;
			case 4:
				a = tu, tu = $l, r = zt(), o = Tu, Tu = xm(e.stateNode.containerInfo), wu(t, e, n), Du(e), Tu = o, Rt && ou && (su = !0), Rt = r, tu = a;
				break;
			case 12:
				wu(t, e, n), Du(e);
				break;
			case 31:
				wu(t, e, n), Du(e), a & 4 && (t = e.updateQueue, t !== null && (e.updateQueue = null, Cu(e, t)));
				break;
			case 13:
				wu(t, e, n), Du(e), e.child.flags & 8192 && e.memoizedState !== null != (r !== null && r.memoizedState !== null) && (md = Ne()), a & 4 && (t = e.updateQueue, t !== null && (e.updateQueue = null, Cu(e, t)));
				break;
			case 22:
				o = e.memoizedState !== null, s = r !== null && r.memoizedState !== null;
				var c = $l, l = eu, u = tu;
				$l = c || o, tu = u || o, eu = l || s, wu(t, e, n), eu = l, tu = u, $l = c, Du(e), a & 8192 && (t = e.stateNode, t._visibility = o ? t._visibility & -2 : t._visibility | 1, !o || r === null || s || $l || eu || (t = s || eu, n = $l, r = eu, $l = o || $l, eu = t, Mu(e, 2), $l = n, eu = r), !o && tu || fu(e, o)), a & 4 && (t = e.updateQueue, t !== null && (n = t.retryQueue, n !== null && (t.retryQueue = null, Cu(e, n))));
				break;
			case 19:
				wu(t, e, n), Du(e), a & 4 && (t = e.updateQueue, t !== null && (e.updateQueue = null, Cu(e, t)));
				break;
			case 30:
				a & 512 && (eu || r === null || Sl(r, r.return)), a = zt(), o = ou, s = (n & 335544064) === n, c = e.memoizedProps, ou = s && fi(c.default, c.update) !== "none", wu(t, e, n), Du(e), s && r !== null && Rt && (e.flags |= 4), ou = o, Rt = a;
				break;
			case 21: break;
			case 7: a & 512 && (eu || r === null || Sl(r, r.return)), r && r.stateNode !== null && (r.stateNode._fragmentFiber = e);
			default: wu(t, e, n), Du(e);
		}
	}
	function Du(e) {
		var t = e.flags;
		if (t & 2) {
			try {
				for (var n, r = e.return; r !== null;) {
					if (kl(r)) {
						n = r;
						break;
					}
					r = r.return;
				}
				r = null;
				for (var a = e.return; a !== null;) {
					if (El(a)) {
						var o = a.stateNode;
						r === null ? r = [o] : r.push(o);
					}
					if (Tl(a)) break;
					a = a.return;
				}
				var s = r;
				if (n == null) throw Error(i(160));
				switch (n.tag) {
					case 27:
						var c = n.stateNode;
						Ml(e, Al(e), c, s);
						break;
					case 5:
						var l = n.stateNode;
						n.flags & 32 && (nn(l, ""), n.flags &= -33), Ml(e, Al(e), l, s);
						break;
					case 3:
					case 4:
						var u = n.stateNode.containerInfo;
						jl(e, Al(e), u, s);
						break;
					default: throw Error(i(161));
				}
			} catch (t) {
				mf(e, e.return, t);
			}
			e.flags &= -3;
		}
		t & 4096 && (e.flags &= -4097);
	}
	function Ou(e) {
		if (e.subtreeFlags & 1024) for (e = e.child; e !== null;) {
			var t = e;
			Ou(t), t.tag === 5 && t.flags & 1024 && (t = t.stateNode, _h = !0, t.reset(), _h = !1), e = e.sibling;
		}
	}
	function ku(e, t) {
		if (t.subtreeFlags & 9270) for (t = t.child; t !== null;) Au(t, e), t = t.sibling;
		else Ql(t, !1);
	}
	function Au(e, t) {
		var n = e.alternate;
		if (n === null) Wl(e, !1);
		else switch (e.tag) {
			case 3:
				if (cu = au = !1, Rl(), ku(t, e), !au && !su) {
					if (e = Ll, e !== null) for (var r = 0; r < e.length; r += 3) {
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
					})), cu = !0;
				}
				Ll = null;
				break;
			case 5:
				ku(t, e);
				break;
			case 4:
				r = au, au = !1, ku(t, e), au && (su = !0), au = r;
				break;
			case 22:
				e.memoizedState === null && (n.memoizedState === null ? ku(t, e) : Wl(e, !1));
				break;
			case 30:
				r = au, i = Rl(), au = !1, ku(t, e), au && (e.flags |= 4);
				var a = e.memoizedProps, o = e.stateNode;
				t = ui(a, o), o = ui(n.memoizedProps, o);
				var s = fi(a.default, a.update);
				s === "none" ? t = !1 : (a = n.memoizedState, n.memoizedState = null, n = e.child, zl = 0, t = Zl(e, n, t, o, s, a, !0), zl !== (a === null ? 0 : a.length) && (e.flags |= 32)), e.flags & 4 && t ? (Nd(e, e.memoizedProps.onUpdate), Ll = i) : i !== null && (i.push.apply(i, Ll), Ll = i), au = e.flags & 32 ? !0 : r;
				break;
			default: ku(t, e);
		}
	}
	function ju(e, t) {
		if (t.subtreeFlags & 8772) for (t = t.child; t !== null;) du(e, t.alternate, t), t = t.sibling;
	}
	function Mu(e, t) {
		for (e = e.child; e !== null;) {
			var n = e, r = t;
			switch (n.tag) {
				case 0:
				case 11:
				case 14:
				case 15:
					vl(4, n, n.return), Mu(n, r);
					break;
				case 1:
					Sl(n, n.return);
					var i = n.stateNode;
					typeof i.componentWillUnmount == "function" && bl(n, n.return, i), Mu(n, r);
					break;
				case 27: r & 2 && _m(n.stateNode, n.type, n.memoizedProps);
				case 5:
					Sl(n, n.return), n.tag !== 5 && n.tag !== 27 || Y(n), Mu(n, r);
					break;
				case 6:
					Y(n);
					break;
				case 26:
					Sl(n, n.return), i = n.stateNode, n.memoizedState !== null || i === null || eu || i.parentNode.removeChild(i), Mu(n, r);
					break;
				case 22:
					n.memoizedState === null && Mu(n, r);
					break;
				case 30:
					Sl(n, n.return), Mu(n, r);
					break;
				case 7: Sl(n, n.return);
				default: Mu(n, r);
			}
			e = e.sibling;
		}
	}
	function Nu(e, t, n) {
		for (n = t.subtreeFlags & 8772 ? n : n & -2, t = t.child; t !== null;) {
			var r = t.alternate, i = e, a = t, o = a.flags, s = !!(n & 1);
			switch (a.tag) {
				case 0:
				case 11:
				case 15:
					Nu(i, a, n), _l(4, a);
					break;
				case 1:
					if (Nu(i, a, n), r = a, i = r.stateNode, typeof i.componentDidMount == "function") try {
						i.componentDidMount();
					} catch (e) {
						mf(r, r.return, e);
					}
					if (r = a, i = r.updateQueue, i !== null) {
						var c = r.stateNode;
						try {
							var l = i.shared.hiddenCallbacks;
							if (l !== null) for (i.shared.hiddenCallbacks = null, i = 0; i < l.length; i++) _o(l[i], c);
						} catch (e) {
							mf(r, r.return, e);
						}
					}
					s && o & 64 && yl(a), xl(a, a.return);
					break;
				case 27: n & 2 && Nl(a);
				case 5:
					a.tag !== 5 && a.tag !== 27 || wl(a), Nu(i, a, n), s && r === null && o & 4 && Dl(a), xl(a, a.return);
					break;
				case 6:
					wl(a);
					break;
				case 26:
					c = a.stateNode, a.memoizedState !== null || c === null || $l || qm(xm(c.ownerDocument), a.type, c), Nu(i, a, n), s && r === null && o & 4 && Dl(a), xl(a, a.return);
					break;
				case 12:
					Nu(i, a, n);
					break;
				case 31:
					Nu(i, a, n), s && o & 4 && bu(i, a);
					break;
				case 13:
					Nu(i, a, n), s && o & 4 && xu(i, a);
					break;
				case 22:
					a.memoizedState === null && Nu(i, a, n), xl(a, a.return);
					break;
				case 30:
					Nu(i, a, n), xl(a, a.return);
					break;
				case 7: xl(a, a.return);
				default: Nu(i, a, n);
			}
			t = t.sibling;
		}
	}
	function Pu(e, t) {
		var n = null;
		e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), e = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (e = t.memoizedState.cachePool.pool), e !== n && (e != null && e.refCount++, n != null && Ea(n));
	}
	function Fu(e, t) {
		e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && Ea(e));
	}
	function Iu(e, t, n, r) {
		var i = (n & 335544064) === n;
		if (t.subtreeFlags & (i ? 10262 : 10256)) for (t = t.child; t !== null;) Lu(e, t, n, r), t = t.sibling;
		else i && Xl(t);
	}
	function Lu(e, t, n, r) {
		var i = (n & 335544064) === n;
		i && t.alternate === null && t.return !== null && t.return.alternate !== null && Yl(t);
		var a = t.flags;
		switch (t.tag) {
			case 0:
			case 11:
			case 15:
				Iu(e, t, n, r), a & 2048 && _l(9, t);
				break;
			case 1:
				Iu(e, t, n, r);
				break;
			case 3:
				Iu(e, t, n, r), i && cu && (e = e.containerInfo, e = e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e, e.style.viewTransitionName === "root" && (e.style.viewTransitionName = ""), e = e.ownerDocument.documentElement, e !== null && e.style.viewTransitionName === "none" && (e.style.viewTransitionName = "")), a & 2048 && (a = null, t.alternate !== null && (a = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== a && (t.refCount++, a != null && Ea(a)));
				break;
			case 12:
				if (a & 2048) {
					Iu(e, t, n, r), a = t.stateNode;
					try {
						var o = t.memoizedProps, s = o.id, c = o.onPostCommit;
						typeof c == "function" && c(s, t.alternate === null ? "mount" : "update", a.passiveEffectDuration, -0);
					} catch (e) {
						mf(t, t.return, e);
					}
				} else Iu(e, t, n, r);
				break;
			case 31:
				Iu(e, t, n, r);
				break;
			case 13:
				Iu(e, t, n, r);
				break;
			case 23: break;
			case 22:
				o = t.stateNode, s = t.alternate, t.memoizedState === null ? (i && s !== null && s.memoizedState !== null && Yl(t), o._visibility & 2 ? Iu(e, t, n, r) : (o._visibility |= 2, Ru(e, t, n, r, !!(t.subtreeFlags & 10256) || !1))) : (i && s !== null && s.memoizedState === null && Yl(s), o._visibility & 2 ? Iu(e, t, n, r) : zu(e, t)), a & 2048 && Pu(s, t);
				break;
			case 24:
				Iu(e, t, n, r), a & 2048 && Fu(t.alternate, t);
				break;
			case 30:
				i && (a = t.alternate, a !== null && (Hl(a.child, !0), Hl(t.child, !0))), Iu(e, t, n, r);
				break;
			default: Iu(e, t, n, r);
		}
	}
	function Ru(e, t, n, r, i) {
		for (i &&= !!(t.subtreeFlags & 10256) || !1, t = t.child; t !== null;) {
			var a = e, o = t, s = n, c = r, l = o.flags;
			switch (o.tag) {
				case 0:
				case 11:
				case 15:
					Ru(a, o, s, c, i), _l(8, o);
					break;
				case 23: break;
				case 22:
					var u = o.stateNode;
					o.memoizedState === null ? (u._visibility |= 2, Ru(a, o, s, c, i)) : u._visibility & 2 ? Ru(a, o, s, c, i) : zu(a, o), i && l & 2048 && Pu(o.alternate, o);
					break;
				case 24:
					Ru(a, o, s, c, i), i && l & 2048 && Fu(o.alternate, o);
					break;
				default: Ru(a, o, s, c, i);
			}
			t = t.sibling;
		}
	}
	function zu(e, t) {
		if (t.subtreeFlags & 10256) for (t = t.child; t !== null;) {
			var n = e, r = t, i = r.flags;
			switch (r.tag) {
				case 22:
					zu(n, r), i & 2048 && Pu(r.alternate, r);
					break;
				case 24:
					zu(n, r), i & 2048 && Fu(r.alternate, r);
					break;
				default: zu(n, r);
			}
			t = t.sibling;
		}
	}
	var Bu = 8192;
	function Vu(e, t, n) {
		if (e.subtreeFlags & Bu) for (e = e.child; e !== null;) Hu(e, t, n), e = e.sibling;
	}
	function Hu(e, t, n) {
		switch (e.tag) {
			case 26:
				Vu(e, t, n), e.flags & Bu && (e.memoizedState === null ? (e = e.stateNode, (t & 335544128) === t && Qm(n, e)) : $m(n, Tu, e.memoizedState, e.memoizedProps));
				break;
			case 5:
				Vu(e, t, n), e.flags & Bu && (e = e.stateNode, (t & 335544128) === t && Qm(n, e));
				break;
			case 3:
			case 4:
				var r = Tu;
				Tu = xm(e.stateNode.containerInfo), Vu(e, t, n), Tu = r;
				break;
			case 22:
				e.memoizedState === null && (r = e.alternate, r !== null && r.memoizedState !== null ? (r = Bu, Bu = 16777216, Vu(e, t, n), Bu = r) : Vu(e, t, n));
				break;
			case 30:
				if ((e.flags & Bu) !== 0 && (r = e.memoizedProps.name, r != null && r !== "auto")) {
					var i = e.stateNode;
					i.paired = null, Fl === null && (Fl = /* @__PURE__ */ new Map()), Fl.set(r, i);
				}
				Vu(e, t, n);
				break;
			default: Vu(e, t, n);
		}
	}
	function Uu(e) {
		var t = e.alternate;
		if (t !== null && (e = t.child, e !== null)) {
			t.child = null;
			do
				t = e.sibling, e.sibling = null, e = t;
			while (e !== null);
		}
	}
	function Wu(e) {
		var t = e.deletions;
		if (e.flags & 16) {
			if (t !== null) for (var n = 0; n < t.length; n++) {
				var r = t[n];
				iu = r, qu(r, e);
			}
			Uu(e);
		}
		if (e.subtreeFlags & 10256) for (e = e.child; e !== null;) Gu(e), e = e.sibling;
	}
	function Gu(e) {
		switch (e.tag) {
			case 0:
			case 11:
			case 15:
				Wu(e), e.flags & 2048 && vl(9, e, e.return);
				break;
			case 3:
				Wu(e);
				break;
			case 12:
				Wu(e);
				break;
			case 22:
				var t = e.stateNode;
				e.memoizedState !== null && t._visibility & 2 && (e.return === null || e.return.tag !== 13) ? (t._visibility &= -3, Ku(e)) : Wu(e);
				break;
			default: Wu(e);
		}
	}
	function Ku(e) {
		var t = e.deletions;
		if (e.flags & 16) {
			if (t !== null) for (var n = 0; n < t.length; n++) {
				var r = t[n];
				iu = r, qu(r, e);
			}
			Uu(e);
		}
		for (e = e.child; e !== null;) {
			switch (t = e, t.tag) {
				case 0:
				case 11:
				case 15:
					vl(8, t, t.return), Ku(t);
					break;
				case 22:
					n = t.stateNode, n._visibility & 2 && (n._visibility &= -3, Ku(t));
					break;
				default: Ku(t);
			}
			e = e.sibling;
		}
	}
	function qu(e, t) {
		for (; iu !== null;) {
			var n = iu;
			switch (n.tag) {
				case 0:
				case 11:
				case 15:
					vl(8, n, t);
					break;
				case 23:
				case 22:
					if (n.memoizedState !== null && n.memoizedState.cachePool !== null) {
						var r = n.memoizedState.cachePool.pool;
						r != null && r.refCount++;
					}
					break;
				case 24: Ea(n.memoizedState.cache);
			}
			if (r = n.child, r !== null) r.return = n, iu = r;
			else a: for (n = e; iu !== null;) {
				r = iu;
				var i = r.sibling, a = r.return;
				if (hu(r), r === n) {
					iu = null;
					break a;
				}
				if (i !== null) {
					i.return = a, iu = i;
					break a;
				}
				iu = a;
			}
		}
	}
	var Ju = {
		getCacheForType: function(e) {
			var t = va(wa), n = t.data.get(e);
			return n === void 0 && (n = e(), t.data.set(e, n)), n;
		},
		cacheSignal: function() {
			return va(wa).controller.signal;
		}
	}, Yu = typeof WeakMap == "function" ? WeakMap : Map, Xu = 0, Zu = null, X = null, Qu = 0, $u = 0, ed = null, td = !1, nd = !1, rd = !1, id = 0, ad = 0, od = 0, sd = 0, cd = 0, ld = 0, ud = 0, dd = null, fd = null, pd = !1, md = 0, hd = 0, gd = Infinity, _d = null, vd = null, yd = 0, bd = null, xd = null, Sd = 0, Cd = 0, wd = null, Td = null, Ed = null, Dd = null, Od = null, kd = 0, Ad = null;
	function jd() {
		return Xu & 2 && Qu !== 0 ? Qu & -Qu : B.T === null ? dt() : Ff();
	}
	function Md() {
		if (ld === 0) {
			if (!(Qu & 536870912) || q) {
				var e = Ye;
				Ye <<= 1, !(Ye & 3932160) && (Ye = 262144), ld = e;
			} else ld = 536870912;
		}
		return e = wo.current, e !== null && (e.flags |= 32), ld;
	}
	function Nd(e, t) {
		if (t != null) {
			var n = e.stateNode, r = n.ref;
			r === null && (r = n.ref = Fp(ui(e.memoizedProps, n))), Dd === null && (Dd = []), Dd.push(t.bind(null, r));
		}
	}
	function Pd(e, t, n) {
		(e === Zu && ($u === 2 || $u === 9) || e.cancelPendingCommit !== null) && (Vd(e, 0), Rd(e, Qu, ld, !1)), it(e, n), Xu & 2 && e === Zu || (e === Zu && (!(Xu & 2) && (sd |= n), ad === 4 && Rd(e, Qu, ld, !1)), Df(e));
	}
	function Fd(e, t, n) {
		if (Xu & 6) throw Error(i(327));
		var r = !n && !(t & 127) && (t & e.expiredLanes) === 0 || $e(e, t), a = r ? Yd(e, t) : qd(e, t, !0), o = r;
		do {
			if (a === 0) {
				nd && !r && Rd(e, t, 0, !1);
				break;
			}
			if (n = e.current.alternate, o && !Ld(n)) a = qd(e, t, !1), o = !1;
			else {
				if (a === 2) {
					if (o = t, e.errorRecoveryDisabledLanes & o) var s = 0;
					else s = e.pendingLanes & -536870913, s = s === 0 ? s & 536870912 ? 536870912 : 0 : s;
					if (s !== 0) {
						t = s;
						a: {
							var c = e;
							a = dd;
							var l = c.current.memoizedState.isDehydrated;
							if (l && (Vd(c, s).flags |= 256), s = qd(c, s, !1), s !== 2 && s !== 6) {
								if (rd && !l) {
									c.errorRecoveryDisabledLanes |= o, sd |= o, a = 4;
									break a;
								}
								o = fd, fd = a, o !== null && (fd === null ? fd = o : fd.push.apply(fd, o));
							}
							a = s;
						}
						if (o = !1, a !== 2) continue;
					}
				}
				if (a === 1) {
					Vd(e, 0), Rd(e, t, 0, !0);
					break;
				}
				a: {
					switch (r = e, o = a, o) {
						case 0:
						case 1: throw Error(i(345));
						case 4: if ((t & 4194048) !== t && (t & 62914560) !== t) break;
						case 6:
							Rd(r, t, ld, !td);
							break a;
						case 2:
							fd = null;
							break;
						case 3:
						case 5: break;
						default: throw Error(i(329));
					}
					if ((t & 62914560) === t && (a = md + 300 - Ne(), 10 < a)) {
						if (Rd(r, t, ld, !td), Qe(r, 0, !0) !== 0) break a;
						Sd = t, r.timeoutHandle = _p(Id.bind(null, r, n, fd, _d, pd, t, ld, sd, ud, td, o, "Throttled", -0, 0), a);
						break a;
					}
					Id(r, n, fd, _d, pd, t, ld, sd, ud, td, o, null, -0, 0);
				}
				break;
			}
		} while (1);
		Df(e);
	}
	function Id(e, t, n, r, i, a, o, s, c, l, u, d, f, p) {
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
			unsuspend: dn
		}, Fl = null, Hu(t, a, d), h && (m = d, h = e.containerInfo, h = (h.nodeType === 9 ? h : h.ownerDocument).__reactViewTransition, h != null && (m.count++, m.waitingForViewTransition = !0, m = rh.bind(m), h.finished.then(m, m))), m = (a & 62914560) === a ? md - Ne() : (a & 4194048) === a ? hd - Ne() : 0, m = th(d, m), m !== null) ? (Sd = a, e.cancelPendingCommit = m(nf.bind(null, e, t, a, n, r, i, o, s, c, l, u, d, null, f, p)), Rd(e, a, o, !l)) : nf(e, t, a, n, r, i, o, s, c, l, u, d);
	}
	function Ld(e) {
		for (var t = e;;) {
			var n = t.tag;
			if ((n === 0 || n === 11 || n === 15) && t.flags & 16384 && (n = t.updateQueue, n !== null && (n = n.stores, n !== null))) for (var r = 0; r < n.length; r++) {
				var i = n[r], a = i.getSnapshot;
				i = i.value;
				try {
					if (!Pr(a(), i)) return !1;
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
	function Rd(e, t, n, r) {
		t = et(e, t), t &= ~cd, t &= ~sd, e.suspendedLanes |= t, e.pingedLanes &= ~t, r && (e.warmLanes |= t), r = e.expirationTimes;
		for (var i = t; 0 < i;) {
			var a = 31 - We(i), o = 1 << a;
			r[a] = -1, i &= ~o;
		}
		n !== 0 && ot(e, n, t);
	}
	function zd() {
		return Xu & 6 ? !0 : (Of(0, !1), !1);
	}
	function Bd() {
		if (X !== null) {
			if ($u === 0) var e = X.return;
			else e = X, ua = la = null, $o(e), Qa = null, $a = 0, e = X;
			for (; e !== null;) gl(e.alternate, e), e = e.return;
			X = null;
		}
	}
	function Vd(e, t) {
		var n = e.timeoutHandle;
		return n !== -1 && (e.timeoutHandle = -1, vp(n)), n = e.cancelPendingCommit, n !== null && (e.cancelPendingCommit = null, n()), Sd = 0, Bd(), Zu = e, X = n = Di(e.current, null), Qu = t, $u = 0, ed = null, td = !1, nd = $e(e, t), rd = !1, ud = ld = cd = sd = od = ad = 0, fd = dd = null, pd = !1, id = et(e, t), _i(), n;
	}
	function Hd(e, t) {
		J = null, B.H = lc, t === Ha || t === Wa ? (t = Xa(), $u = 3) : t === Ua ? (t = Xa(), $u = 4) : $u = t === Dc ? 8 : typeof t == "object" && t && typeof t.then == "function" ? 6 : 1, ed = t, X === null && (ad = 1, xc(e, Fi(t, e.current)));
	}
	function Ud() {
		var e = wo.current;
		return e === null ? !0 : (Qu & 4194048) === Qu ? To === null : (Qu & 62914560) === Qu || Qu & 536870912 ? e === To : !1;
	}
	function Wd() {
		var e = B.H;
		return B.H = lc, e === null ? lc : e;
	}
	function Gd() {
		var e = B.A;
		return B.A = Ju, e;
	}
	function Kd() {
		ad = 4, td || (Qu & 4194048) !== Qu && wo.current !== null || (nd = !0), !(od & 134217727) && !(sd & 134217727) || Zu === null || Rd(Zu, Qu, ld, !1);
	}
	function qd(e, t, n) {
		var r = Xu;
		Xu |= 2;
		var i = Wd(), a = Gd();
		(Zu !== e || Qu !== t) && (_d = null, Vd(e, t)), t = !1;
		var o = ad;
		a: do
			try {
				if ($u !== 0 && X !== null) {
					var s = X, c = ed;
					switch ($u) {
						case 8:
							Bd(), o = 6;
							break a;
						case 3:
						case 2:
						case 9:
						case 6:
							wo.current === null && (t = !0);
							var l = $u;
							if ($u = 0, ed = null, $d(e, s, c, l), n && nd) {
								o = 0;
								break a;
							}
							break;
						default: l = $u, $u = 0, ed = null, $d(e, s, c, l);
					}
				}
				Jd(), o = ad;
				break;
			} catch (t) {
				Hd(e, t);
			}
		while (1);
		return t && e.shellSuspendCounter++, ua = la = null, Xu = r, B.H = i, B.A = a, X === null && (Zu = null, Qu = 0, _i()), o;
	}
	function Jd() {
		for (; X !== null;) Zd(X);
	}
	function Yd(e, t) {
		var n = Xu;
		Xu |= 2;
		var r = Wd(), a = Gd();
		Zu !== e || Qu !== t ? (_d = null, gd = Ne() + 500, Vd(e, t)) : nd = $e(e, t);
		a: do
			try {
				if ($u !== 0 && X !== null) {
					t = X;
					var o = ed;
					b: switch ($u) {
						case 1:
							$u = 0, ed = null, $d(e, t, o, 1);
							break;
						case 2:
						case 9:
							if (Ka(o)) {
								$u = 0, ed = null, Qd(t);
								break;
							}
							t = function() {
								$u !== 2 && $u !== 9 || Zu !== e || ($u = 7), Df(e);
							}, o.then(t, t);
							break a;
						case 3:
							$u = 7;
							break a;
						case 4:
							$u = 5;
							break a;
						case 7:
							Ka(o) ? ($u = 0, ed = null, Qd(t)) : ($u = 0, ed = null, $d(e, t, o, 7));
							break;
						case 5:
							var s = null;
							switch (X.tag) {
								case 26: s = X.memoizedState;
								case 5:
								case 27:
									var c = X;
									if (s ? Xm(s) : c.stateNode.complete) {
										$u = 0, ed = null;
										var l = c.sibling;
										if (l !== null) X = l;
										else {
											var u = c.return;
											u === null ? X = null : (X = u, ef(u));
										}
										break b;
									}
							}
							$u = 0, ed = null, $d(e, t, o, 5);
							break;
						case 6:
							$u = 0, ed = null, $d(e, t, o, 6);
							break;
						case 8:
							Bd(), ad = 6;
							break a;
						default: throw Error(i(462));
					}
				}
				Xd();
				break;
			} catch (t) {
				Hd(e, t);
			}
		while (1);
		return ua = la = null, B.H = r, B.A = a, Xu = n, X === null ? (Zu = null, Qu = 0, _i(), ad) : 0;
	}
	function Xd() {
		for (; X !== null && !je();) Zd(X);
	}
	function Zd(e) {
		var t = sl(e.alternate, e, id);
		e.memoizedProps = e.pendingProps, t === null ? ef(e) : X = t;
	}
	function Qd(e) {
		var t = e, n = t.alternate;
		switch (t.tag) {
			case 15:
			case 0:
				t = Vc(n, t, t.pendingProps, t.type, void 0, Qu);
				break;
			case 11:
				t = Vc(n, t, t.pendingProps, t.type.render, t.ref, Qu);
				break;
			case 5:
				$o(t);
				var r = t;
				r === Xi && (q ? (ra(r), r.tag === 5 && r.stateNode != null && (Zi = r.stateNode)) : (ra(r), q = !0));
			default: gl(n, t), t = X = Oi(t, id), t = sl(n, t, id);
		}
		e.memoizedProps = e.pendingProps, t === null ? ef(e) : X = t;
	}
	function $d(e, t, n, r) {
		ua = la = null, $o(t), Qa = null, $a = 0;
		var i = t.return;
		try {
			if (Ec(e, i, t, n, Qu)) {
				ad = 1, xc(e, Fi(n, e.current)), X = null;
				return;
			}
		} catch (t) {
			if (i !== null) throw X = i, t;
			ad = 1, xc(e, Fi(n, e.current)), X = null;
			return;
		}
		t.flags & 32768 ? (q || r === 1 ? e = !0 : nd || Qu & 536870912 ? e = !1 : (td = e = !0, (r === 2 || r === 9 || r === 3 || r === 6) && (r = wo.current, r !== null && r.tag === 13 && (r.flags |= 16384))), tf(t, e)) : ef(t);
	}
	function ef(e) {
		var t = e;
		do {
			if (t.flags & 32768) {
				tf(t, td);
				return;
			}
			e = t.return;
			var n = ml(t.alternate, t, id);
			if (n !== null) {
				X = n;
				return;
			}
			if (t = t.sibling, t !== null) {
				X = t;
				return;
			}
			X = t = e;
		} while (t !== null);
		ad === 0 && (ad = 5);
	}
	function tf(e, t) {
		do {
			var n = hl(e.alternate, e);
			if (n !== null) {
				n.flags &= 32767, X = n;
				return;
			}
			if (n = e.return, n !== null && (n.flags |= 32768, n.subtreeFlags = 0, n.deletions = null), !t && (e = e.sibling, e !== null)) {
				X = e;
				return;
			}
			X = e = n;
		} while (e !== null);
		ad = 6, X = null;
	}
	function nf(e, t, n, r, a, o, s, c, l, u, d, f) {
		e.cancelPendingCommit = null;
		do
			df();
		while (yd !== 0);
		if (Xu & 6) throw Error(i(327));
		if (t !== null) {
			if (t === e.current) throw Error(i(177));
			e === Zu && (X = Zu = null, Qu = 0), xd = t, bd = e, Sd = n, wd = a, Td = r, rf(e, t, n, s, c, l, f);
		}
	}
	function rf(e, t, n, r, i, a, o) {
		var s = t.lanes | t.childLanes;
		if (Cd = s, s |= gi, at(e, n, s, r, i, a), Dd = null, (n & 335544064) === n ? (Od = ka(e), r = 10262) : (Od = null, r = 10256), (t.subtreeFlags & r) !== 0 || (t.flags & r) !== 0 ? (e.callbackNode = null, e.callbackPriority = 0, bf(Le, function() {
			return ff(), null;
		})) : (e.callbackNode = null, e.callbackPriority = 0), Pl = !1, r = !!(t.flags & 13878), t.subtreeFlags & 13878 || r) {
			r = B.T, B.T = null, i = V.p, V.p = 2, a = Xu, Xu |= 4;
			try {
				lu(e, t, n);
			} finally {
				Xu = a, V.p = i, B.T = r;
			}
		}
		yd = 1, Pl ? Ed = Np(o, e.containerInfo, Od, sf, cf, of, lf, ff, af, null, null) : (sf(), cf(), lf());
	}
	function af(e) {
		if (yd !== 0) {
			var t = bd.onRecoverableError;
			t(e, { componentStack: null });
		}
	}
	function of() {
		yd === 3 && (yd = 0, Au(xd, bd), yd = 4);
	}
	function sf() {
		if (yd === 1) {
			yd = 0;
			var e = bd, t = xd, n = Sd, r = !!(t.flags & 13878);
			if (t.subtreeFlags & 13878 || r) {
				r = B.T, B.T = null;
				var i = V.p;
				V.p = 2;
				var a = Xu;
				Xu |= 4;
				try {
					ou = su = !1, Eu(t, e, n), n = lp;
					var o = Br(e.containerInfo), s = n.focusedElem, c = n.selectionRange;
					if (o !== s && s && s.ownerDocument && zr(s.ownerDocument.documentElement, s)) {
						if (c !== null && Vr(s)) {
							var l = c.start, u = c.end;
							if (u === void 0 && (u = l), "selectionStart" in s) s.selectionStart = l, s.selectionEnd = Math.min(u, s.value.length);
							else {
								var d = s.ownerDocument || document, f = d && d.defaultView || window;
								if (f.getSelection) {
									var p = f.getSelection(), m = s.textContent.length, h = Math.min(c.start, m), g = c.end === void 0 ? h : Math.min(c.end, m);
									!p.extend && h > g && (o = g, g = h, h = o);
									var _ = Rr(s, h), v = Rr(s, g);
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
					Xu = a, V.p = i, B.T = r;
				}
			}
			e.current = t, yd = 2;
		}
	}
	function cf() {
		if (yd === 2) {
			yd = 0;
			var e = bd, t = xd, n = !!(t.flags & 8772);
			if (t.subtreeFlags & 8772 || n) {
				n = B.T, B.T = null;
				var r = V.p;
				V.p = 2;
				var i = Xu;
				Xu |= 4;
				try {
					du(e, t.alternate, t);
				} finally {
					Xu = i, V.p = r, B.T = n;
				}
			}
			yd = 3;
		}
	}
	function lf() {
		if (yd === 4 || yd === 3) {
			yd = 0;
			var e = Ed;
			Ed = null, Me();
			var t = bd, n = xd, r = Sd, i = Td, a = (r & 335544064) === r ? 10262 : 10256;
			if ((n.subtreeFlags & a) !== 0 || (n.flags & a) !== 0 ? yd = 5 : (yd = 0, xd = bd = null, uf(t, t.pendingLanes)), a = t.pendingLanes, a === 0 && (vd = null), ut(r), n = n.stateNode, He && typeof He.onCommitFiberRoot == "function") try {
				He.onCommitFiberRoot(Ve, n, void 0, (n.current.flags & 128) == 128);
			} catch {}
			if (i !== null) {
				n = B.T, a = V.p, V.p = 2, B.T = null;
				try {
					for (var o = t.onRecoverableError, s = 0; s < i.length; s++) {
						var c = i[s];
						o(c.value, { componentStack: c.stack });
					}
				} finally {
					B.T = n, V.p = a;
				}
			}
			if (i = Dd, o = Od, Od = null, i !== null && (Dd = null, o === null && (o = []), e !== null)) for (c = 0; c < i.length; c++) n = (0, i[c])(o), n !== void 0 && e.finished.finally(n);
			Sd & 3 && df(), Df(t), a = t.pendingLanes, r & 261930 && a & 42 ? t === Ad ? kd++ : (kd = 0, Ad = t) : (kd = 0, Ad = null), Of(0, !1);
		}
	}
	function uf(e, t) {
		(e.pooledCacheLanes &= t) === 0 && (t = e.pooledCache, t != null && (e.pooledCache = null, Ea(t)));
	}
	function df() {
		return Ed !== null && (Ed.skipTransition(), Ed = null), sf(), cf(), lf(), ff();
	}
	function ff() {
		if (yd !== 5) return !1;
		var e = bd, t = Cd;
		Cd = 0;
		var n = ut(Sd), r = B.T, a = V.p;
		try {
			V.p = 32 > n ? 32 : n, B.T = null, n = wd, wd = null;
			var o = bd, s = Sd;
			if (yd = 0, xd = bd = null, Sd = 0, Xu & 6) throw Error(i(331));
			var c = Xu;
			if (Xu |= 4, Gu(o.current), Lu(o, o.current, s, n), Xu = c, Of(0, !1), He && typeof He.onPostCommitFiberRoot == "function") try {
				He.onPostCommitFiberRoot(Ve, o);
			} catch {}
			return !0;
		} finally {
			V.p = a, B.T = r, uf(e, t);
		}
	}
	function pf(e, t, n) {
		t = Fi(n, t), t = Cc(e.stateNode, t, 2), e = uo(e, t, 2), e !== null && (it(e, 2), Df(e));
	}
	function mf(e, t, n) {
		if (e.tag === 3) pf(e, e, n);
		else for (; t !== null;) {
			if (t.tag === 3) {
				pf(t, e, n);
				break;
			}
			if (t.tag === 1) {
				var r = t.stateNode;
				if (typeof t.type.getDerivedStateFromError == "function" || typeof r.componentDidCatch == "function" && (vd === null || !vd.has(r))) {
					e = Fi(n, e), n = wc(2), r = uo(t, n, 2), r !== null && (Tc(n, r, t, e), it(r, 2), Df(r));
					break;
				}
			}
			t = t.return;
		}
	}
	function hf(e, t, n) {
		var r = e.pingCache;
		if (r === null) {
			r = e.pingCache = new Yu();
			var i = /* @__PURE__ */ new Set();
			r.set(t, i);
		} else i = r.get(t), i === void 0 && (i = /* @__PURE__ */ new Set(), r.set(t, i));
		i.has(n) || (rd = !0, i.add(n), e = gf.bind(null, e, t, n), t.then(e, e));
	}
	function gf(e, t, n) {
		var r = e.pingCache;
		r !== null && r.delete(t), e.pingedLanes |= e.suspendedLanes & n, e.warmLanes &= ~n, Zu === e && (Qu & n) === n && (ad === 4 || ad === 3 && (Qu & 62914560) === Qu && 300 > Ne() - md ? Xu & 2 ? cd |= n : Vd(e, 0) : cd |= n, ud === Qu && (ud = 0)), Df(e);
	}
	function _f(e, t) {
		t === 0 && (t = nt()), e = bi(e, t), e !== null && (it(e, t), Df(e));
	}
	function vf(e) {
		var t = e.memoizedState, n = 0;
		t !== null && (n = t.retryLane), _f(e, n);
	}
	function yf(e, t) {
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
		r !== null && r.delete(t), _f(e, n);
	}
	function bf(e, t) {
		return ke(e, t);
	}
	var xf = null, Sf = null, Cf = !1, wf = !1, Tf = !1, Ef = 0;
	function Df(e) {
		e !== Sf && e.next === null && (Sf === null ? xf = Sf = e : Sf = Sf.next = e), wf = !0, Cf || (Cf = !0, Pf());
	}
	function Of(e, t) {
		if (!Tf && wf) {
			Tf = !0;
			do
				for (var n = !1, r = xf; r !== null;) {
					if (!t) {
						if (e !== 0) {
							var i = r.pendingLanes;
							if (i === 0) var a = 0;
							else {
								var o = r.suspendedLanes, s = r.pingedLanes;
								a = (1 << 31 - We(42 | e) + 1) - 1, a &= i & ~(o & ~s), a = a & 201326741 ? a & 201326741 | 1 : a ? a | 2 : 0;
							}
							a !== 0 && (n = !0, Nf(r, a));
						} else a = Qu, a = Qe(r, r === Zu ? a : 0, r.cancelPendingCommit !== null || r.timeoutHandle !== -1), !(a & 3) || $e(r, a) || (n = !0, Nf(r, a));
					}
					r = r.next;
				}
			while (n);
			Tf = !1;
		}
	}
	function kf() {
		Af();
	}
	function Af() {
		wf = Cf = !1;
		var e = 0;
		Ef !== 0 && gp() && (e = Ef);
		for (var t = Ne(), n = null, r = xf; r !== null;) {
			var i = r.next, a = jf(r, t);
			a === 0 ? (r.next = null, n === null ? xf = i : n.next = i, i === null && (Sf = n)) : (n = r, (e !== 0 || a & 3) && (wf = !0)), r = i;
		}
		yd !== 0 && yd !== 5 || Of(e, !1), Ef !== 0 && (Ef = 0);
	}
	function jf(e, t) {
		for (var n = e.suspendedLanes, r = e.pingedLanes, i = e.expirationTimes, a = e.pendingLanes & -62914561; 0 < a;) {
			var o = 31 - We(a), s = 1 << o, c = i[o];
			c === -1 ? ((s & n) === 0 || (s & r) !== 0) && (i[o] = tt(s, t)) : c <= t && (e.expiredLanes |= s), a &= ~s;
		}
		if (t = Zu, n = Qu, n = Qe(e, e === t ? n : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1), r = e.callbackNode, n === 0 || e === t && ($u === 2 || $u === 9) || e.cancelPendingCommit !== null) return r !== null && r !== null && Ae(r), e.callbackNode = null, e.callbackPriority = 0;
		if (!(n & 3) || $e(e, n)) {
			if (t = n & -n, t === e.callbackPriority) return t;
			switch (r !== null && Ae(r), ut(n)) {
				case 2:
				case 8:
					n = Ie;
					break;
				case 32:
					n = Le;
					break;
				case 268435456:
					n = K;
					break;
				default: n = Le;
			}
			return r = Mf.bind(null, e), n = ke(n, r), e.callbackPriority = t, e.callbackNode = n, t;
		}
		return r !== null && r !== null && Ae(r), e.callbackPriority = 2, e.callbackNode = null, 2;
	}
	function Mf(e, t) {
		if (yd !== 0 && yd !== 5) return e.callbackNode = null, e.callbackPriority = 0, null;
		var n = e.callbackNode;
		if (df() && e.callbackNode !== n) return null;
		var r = Qu;
		return r = Qe(e, e === Zu ? r : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1), r === 0 ? null : (Fd(e, r, t), jf(e, Ne()), e.callbackNode != null && e.callbackNode === n ? Mf.bind(null, e) : null);
	}
	function Nf(e, t) {
		if (df()) return null;
		Fd(e, t, !0);
	}
	function Pf() {
		xp(function() {
			Xu & 6 ? ke(Fe, kf) : Af();
		});
	}
	function Ff() {
		if (Ef === 0) {
			var e = Ma;
			e === 0 && (e = Je, Je <<= 1, !(Je & 261888) && (Je = 256)), Ef = e;
		}
		return Ef;
	}
	function If(e) {
		return e == null || typeof e == "symbol" || typeof e == "boolean" ? null : typeof e == "function" ? e : un(e);
	}
	function Lf(e, t, n, r, i) {
		if (t === "submit" && n && n.stateNode === i) {
			var a = If((i[ht] || null).action), o = r.submitter;
			o && (t = (t = o[ht] || null) ? If(t.formAction) : o.getAttribute("formAction"), t !== null && (a = t, o = null));
			var s = new Mn("action", "action", null, r, i);
			e.push({
				event: s,
				listeners: [{
					instance: null,
					listener: function() {
						if (r.defaultPrevented) {
							if (Ef !== 0) {
								var e = new FormData(i, o);
								Ys(n, {
									pending: !0,
									data: e,
									method: i.method,
									action: a
								}, null, e);
							}
						} else typeof a == "function" && (s.preventDefault(), e = new FormData(i, o), Ys(n, {
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
	for (var Rf = 0; Rf < si.length; Rf++) {
		var zf = si[Rf];
		ci(zf.toLowerCase(), "on" + (zf[0].toUpperCase() + zf.slice(1)));
	}
	ci($r, "onAnimationEnd"), ci(ei, "onAnimationIteration"), ci(ti, "onAnimationStart"), ci("dblclick", "onDoubleClick"), ci("focusin", "onFocus"), ci("focusout", "onBlur"), ci(ni, "onTransitionRun"), ci(ri, "onTransitionStart"), ci(ii, "onTransitionCancel"), ci(ai, "onTransitionEnd"), Nt("onMouseEnter", ["mouseout", "mouseover"]), Nt("onMouseLeave", ["mouseout", "mouseover"]), Nt("onPointerEnter", ["pointerout", "pointerover"]), Nt("onPointerLeave", ["pointerout", "pointerover"]), Mt("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), Mt("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), Mt("onBeforeInput", [
		"compositionend",
		"keypress",
		"textInput",
		"paste"
	]), Mt("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), Mt("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), Mt("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
	var Bf = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), Vf = new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(Bf));
	function Hf(e, t) {
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
						pi(e);
					}
					i.currentTarget = null, a = c;
				}
				else for (o = 0; o < r.length; o++) {
					if (s = r[o], c = s.instance, l = s.currentTarget, s = s.listener, c !== a && i.isPropagationStopped()) break a;
					a = s, i.currentTarget = l;
					try {
						a(i);
					} catch (e) {
						pi(e);
					}
					i.currentTarget = null, a = c;
				}
			}
		}
	}
	function Z(e, t) {
		var n = t[_t];
		n === void 0 && (n = t[_t] = /* @__PURE__ */ new Set());
		var r = e + "__bubble";
		n.has(r) || (Kf(t, e, 2, !1), n.add(r));
	}
	function Uf(e, t, n) {
		var r = 0;
		t && (r |= 4), Kf(n, e, r, t);
	}
	var Wf = "_reactListening" + Math.random().toString(36).slice(2);
	function Gf(e) {
		if (!e[Wf]) {
			e[Wf] = !0, At.forEach(function(t) {
				t !== "selectionchange" && (Vf.has(t) || Uf(t, !1, e), Uf(t, !0, e));
			});
			var t = e.nodeType === 9 ? e : e.ownerDocument;
			t === null || t[Wf] || (t[Wf] = !0, Uf("selectionchange", !1, t));
		}
	}
	function Kf(e, t, n, r) {
		switch (wh(t)) {
			case 2:
				var i = vh;
				break;
			case 8:
				i = yh;
				break;
			default: i = bh;
		}
		n = i.bind(null, t, n, e), i = void 0, !xn || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (i = !0), r ? i === void 0 ? e.addEventListener(t, n, !0) : e.addEventListener(t, n, {
			capture: !0,
			passive: i
		}) : i === void 0 ? e.addEventListener(t, n, !1) : e.addEventListener(t, n, { passive: i });
	}
	function qf(e, t, n, r, i) {
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
					if (s = wt(c), s === null) return;
					if (l = s.tag, l === 5 || l === 6 || l === 26 || l === 27) {
						r = a = s;
						continue a;
					}
					c = c.parentNode;
				}
			}
			r = r.return;
		}
		vn(function() {
			var r = a, i = pn(n), s = [];
			a: {
				var c = oi.get(e);
				if (c !== void 0) {
					var l = Mn, u = e;
					switch (e) {
						case "keypress": if (Dn(n) === 0) break a;
						case "keydown":
						case "keyup":
							l = Xn;
							break;
						case "focusin":
							u = "focus", l = Vn;
							break;
						case "focusout":
							u = "blur", l = Vn;
							break;
						case "beforeblur":
						case "afterblur":
							l = Vn;
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
							l = zn;
							break;
						case "drag":
						case "dragend":
						case "dragenter":
						case "dragexit":
						case "dragleave":
						case "dragover":
						case "dragstart":
						case "drop":
							l = Bn;
							break;
						case "touchcancel":
						case "touchend":
						case "touchmove":
						case "touchstart":
							l = $n;
							break;
						case $r:
						case ei:
						case ti:
							l = Hn;
							break;
						case ai:
							l = er;
							break;
						case "scroll":
						case "scrollend":
							l = Pn;
							break;
						case "wheel":
							l = tr;
							break;
						case "copy":
						case "cut":
						case "paste":
							l = Un;
							break;
						case "gotpointercapture":
						case "lostpointercapture":
						case "pointercancel":
						case "pointerdown":
						case "pointermove":
						case "pointerout":
						case "pointerover":
						case "pointerup":
							l = Zn;
							break;
						case "submit":
							l = Qn;
							break;
						case "toggle":
						case "beforetoggle": l = nr;
					}
					var d = !!(t & 4), f = !d && (e === "scroll" || e === "scrollend"), p = d ? c === null ? null : c + "Capture" : c;
					d = [];
					for (var m = r, h; m !== null;) {
						var g = m;
						if (h = g.stateNode, g = g.tag, g !== 5 && g !== 26 && g !== 27 || h === null || p === null || (g = yn(m, p), g != null && d.push(Jf(m, g, h))), f) break;
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
					if (l = e === "mouseover" || e === "pointerover", c = e === "mouseout" || e === "pointerout", l && n !== fn && (u = n.relatedTarget || n.fromElement) && (wt(u) || u[gt])) break a;
					(c || l) && (u = i.window === i ? i : (l = i.ownerDocument) ? l.defaultView || l.parentWindow : window, c ? (l = n.relatedTarget || n.toElement, c = r, l = l ? wt(l) : null, l !== null && (f = o(l), d = l.tag, l !== f || d !== 5 && d !== 27 && d !== 6) && (l = null)) : (c = null, l = r), c !== l && (d = zn, g = "onMouseLeave", p = "onMouseEnter", m = "mouse", (e === "pointerout" || e === "pointerover") && (d = Zn, g = "onPointerLeave", p = "onPointerEnter", m = "pointer"), f = c == null ? u : Et(c), h = l == null ? u : Et(l), u = new d(g, m + "leave", c, n, i), u.target = f, u.relatedTarget = h, g = null, wt(i) === r && (d = new d(p, m + "enter", l, n, i), d.target = h, d.relatedTarget = f, g = d), f = g, d = c && l ? E(c, l, Xf) : null, c !== null && Zf(s, u, c, d, !1), l !== null && f !== null && Zf(s, f, l, d, !0)));
				}
				a: {
					if (c = r ? Et(r) : window, l = c.nodeName && c.nodeName.toLowerCase(), l === "select" || l === "input" && c.type === "file") var _ = Sr;
					else if (gr(c)) {
						if (Cr) _ = Mr;
						else {
							_ = Ar;
							var v = kr;
						}
					} else l = c.nodeName, !l || l.toLowerCase() !== "input" || c.type !== "checkbox" && c.type !== "radio" ? r && sn(r.elementType) && (_ = Sr) : _ = jr;
					if (_ &&= _(e, r)) {
						_r(s, _, n, i);
						break a;
					}
					v && v(e, c, r);
				}
				switch (v = r ? Et(r) : window, e) {
					case "focusin":
						(gr(v) || v.contentEditable === "true") && (Ur = v, Wr = r, Gr = null);
						break;
					case "focusout":
						Gr = Wr = Ur = null;
						break;
					case "mousedown":
						Kr = !0;
						break;
					case "contextmenu":
					case "mouseup":
					case "dragend":
						Kr = !1, qr(s, n, i);
						break;
					case "selectionchange": if (Hr) break;
					case "keydown":
					case "keyup": qr(s, n, i);
				}
				var y;
				if (ir) b: {
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
				else fr ? ur(e, n) && (b = "onCompositionEnd") : e === "keydown" && n.keyCode === 229 && (b = "onCompositionStart");
				b && (sr && n.locale !== "ko" && (fr || b !== "onCompositionStart" ? b === "onCompositionEnd" && fr && (y = En()) : (Cn = i, wn = "value" in Cn ? Cn.value : Cn.textContent, fr = !0)), v = Yf(r, b), 0 < v.length && (b = new Wn(b, e, null, n, i), s.push({
					event: b,
					listeners: v
				}), y ? b.data = y : (y = dr(n), y !== null && (b.data = y)))), (y = or ? pr(e, n) : mr(e, n)) && (b = Yf(r, "onBeforeInput"), 0 < b.length && (v = new Wn("onBeforeInput", "beforeinput", null, n, i), s.push({
					event: v,
					listeners: b
				}), v.data = y)), Lf(s, e, r, n, i);
			}
			Hf(s, t);
		});
	}
	function Jf(e, t, n) {
		return {
			instance: e,
			listener: t,
			currentTarget: n
		};
	}
	function Yf(e, t) {
		for (var n = t + "Capture", r = []; e !== null;) {
			var i = e, a = i.stateNode;
			if (i = i.tag, i !== 5 && i !== 26 && i !== 27 || a === null || (i = yn(e, n), i != null && r.unshift(Jf(e, i, a)), i = yn(e, t), i != null && r.push(Jf(e, i, a))), e.tag === 3) return r;
			e = e.return;
		}
		return [];
	}
	function Xf(e) {
		if (e === null) return null;
		do
			e = e.return;
		while (e && e.tag !== 5 && e.tag !== 27);
		return e || null;
	}
	function Zf(e, t, n, r, i) {
		for (var a = t._reactName, o = []; n !== null && n !== r;) {
			var s = n, c = s.alternate, l = s.stateNode;
			if (s = s.tag, c !== null && c === r) break;
			s !== 5 && s !== 26 && s !== 27 || l === null || (c = l, i ? (l = yn(n, a), l != null && o.unshift(Jf(n, l, c))) : i || (l = yn(n, a), l != null && o.push(Jf(n, l, c)))), n = n.return;
		}
		o.length !== 0 && e.push({
			event: t,
			listeners: o
		});
	}
	var Qf = /\r\n?/g, $f = /\u0000|\uFFFD/g;
	function ep(e) {
		return (typeof e == "string" ? e : "" + e).replace(Qf, "\n").replace($f, "");
	}
	function tp(e, t) {
		return t = ep(t), ep(e) === t;
	}
	function np(e, t, n, r, a, o) {
		switch (n) {
			case "children":
				if (typeof r == "string") t === "body" || t === "textarea" && r === "" || nn(e, r);
				else if (typeof r == "number" || typeof r == "bigint") t !== "body" && nn(e, "" + r);
				else return;
				break;
			case "className":
				Vt(e, "class", r);
				break;
			case "tabIndex":
				Vt(e, "tabindex", r);
				break;
			case "dir":
			case "role":
			case "viewBox":
			case "width":
			case "height":
				Vt(e, n, r);
				break;
			case "style":
				on(e, r, o);
				return;
			case "data": if (t !== "object") {
				Vt(e, "data", r);
				break;
			}
			case "src":
			case "href":
				if (r === "" && (t !== "a" || n !== "href") || r == null || typeof r == "function" || typeof r == "symbol" || typeof r == "boolean") {
					e.removeAttribute(n);
					break;
				}
				r = un(r), e.setAttribute(n, r);
				break;
			case "action":
			case "formAction":
				if (typeof r == "function") {
					e.setAttribute(n, "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");
					break;
				}
				if (typeof o == "function" && (n === "formAction" ? (t !== "input" && np(e, t, "name", a.name, a, null), np(e, t, "formEncType", a.formEncType, a, null), np(e, t, "formMethod", a.formMethod, a, null), np(e, t, "formTarget", a.formTarget, a, null)) : (np(e, t, "encType", a.encType, a, null), np(e, t, "method", a.method, a, null), np(e, t, "target", a.target, a, null))), r == null || typeof r == "symbol" || typeof r == "boolean") {
					e.removeAttribute(n);
					break;
				}
				r = un(r), e.setAttribute(n, r);
				break;
			case "onClick":
				r != null && (e.onclick = dn);
				return;
			case "onScroll":
				r != null && Z("scroll", e);
				return;
			case "onScrollEnd":
				r != null && Z("scrollend", e);
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
				n = un(r), e.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", n);
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
				Z("beforetoggle", e), Z("toggle", e), Bt(e, "popover", r);
				break;
			case "xlinkActuate":
				Ht(e, "http://www.w3.org/1999/xlink", "xlink:actuate", r);
				break;
			case "xlinkArcrole":
				Ht(e, "http://www.w3.org/1999/xlink", "xlink:arcrole", r);
				break;
			case "xlinkRole":
				Ht(e, "http://www.w3.org/1999/xlink", "xlink:role", r);
				break;
			case "xlinkShow":
				Ht(e, "http://www.w3.org/1999/xlink", "xlink:show", r);
				break;
			case "xlinkTitle":
				Ht(e, "http://www.w3.org/1999/xlink", "xlink:title", r);
				break;
			case "xlinkType":
				Ht(e, "http://www.w3.org/1999/xlink", "xlink:type", r);
				break;
			case "xmlBase":
				Ht(e, "http://www.w3.org/XML/1998/namespace", "xml:base", r);
				break;
			case "xmlLang":
				Ht(e, "http://www.w3.org/XML/1998/namespace", "xml:lang", r);
				break;
			case "xmlSpace":
				Ht(e, "http://www.w3.org/XML/1998/namespace", "xml:space", r);
				break;
			case "is":
				Bt(e, "is", r);
				break;
			case "innerText":
			case "textContent": return;
			default: if (!(2 < n.length) || n[0] !== "o" && n[0] !== "O" || n[1] !== "n" && n[1] !== "N") n = cn.get(n) || n, Bt(e, n, r);
			else return;
		}
		Rt = !0;
	}
	function rp(e, t, n, r, a, o) {
		switch (n) {
			case "style":
				on(e, r, o);
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
				if (typeof r == "string") nn(e, r);
				else if (typeof r == "number" || typeof r == "bigint") nn(e, "" + r);
				else return;
				break;
			case "onScroll":
				r != null && Z("scroll", e);
				return;
			case "onScrollEnd":
				r != null && Z("scrollend", e);
				return;
			case "onClick":
				r != null && (e.onclick = dn);
				return;
			case "suppressContentEditableWarning":
			case "suppressHydrationWarning":
			case "innerHTML":
			case "ref": return;
			case "innerText":
			case "textContent": return;
			default:
				if (!jt.hasOwnProperty(n)) a: {
					if (n[0] === "o" && n[1] === "n" && (a = n.endsWith("Capture"), o = n.slice(2, a ? n.length - 7 : void 0), t = e[ht] || null, t = t == null ? null : t[n], typeof t == "function" && e.removeEventListener(o, t, a), typeof r == "function")) {
						typeof t != "function" && t !== null && (n in e ? e[n] = null : e.hasAttribute(n) && e.removeAttribute(n)), e.addEventListener(o, r, a);
						break a;
					}
					Rt = !0, n in e ? e[n] = r : !0 === r ? e.setAttribute(n, "") : Bt(e, n, r);
				}
				return;
		}
		Rt = !0;
	}
	function Q(e, t, n) {
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
				Z("error", e), Z("load", e);
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
						default: np(e, t, o, s, n, null);
					}
				}
				a && np(e, t, "srcSet", n.srcSet, n, null), r && np(e, t, "src", n.src, n, null);
				return;
			case "input":
				Z("invalid", e);
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
						default: np(e, t, r, d, n, null);
					}
				}
				Zt(e, o, c, l, u, s, a, !1);
				return;
			case "select":
				for (a in Z("invalid", e), r = s = o = null, n) if (n.hasOwnProperty(a) && (c = n[a], c != null)) switch (a) {
					case "value":
						o = c;
						break;
					case "defaultValue":
						s = c;
						break;
					case "multiple": r = c;
					default: np(e, t, a, c, n, null);
				}
				t = o, n = s, e.multiple = !!r, t == null ? n != null && $t(e, !!r, n, !0) : $t(e, !!r, t, !1);
				return;
			case "textarea":
				for (s in Z("invalid", e), o = a = r = null, n) if (n.hasOwnProperty(s) && (c = n[s], c != null)) switch (s) {
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
					default: np(e, t, s, c, n, null);
				}
				tn(e, r, a, o);
				return;
			case "option":
				for (l in n) if (n.hasOwnProperty(l) && (r = n[l], r != null)) switch (l) {
					case "selected":
						e.selected = r && typeof r != "function" && typeof r != "symbol";
						break;
					default: np(e, t, l, r, n, null);
				}
				return;
			case "dialog":
				Z("beforetoggle", e), Z("toggle", e), Z("cancel", e), Z("close", e);
				break;
			case "iframe":
			case "object":
				Z("load", e);
				break;
			case "video":
			case "audio":
				for (r = 0; r < Bf.length; r++) Z(Bf[r], e);
				break;
			case "image":
				Z("error", e), Z("load", e);
				break;
			case "details":
				Z("toggle", e);
				break;
			case "embed":
			case "source":
			case "link": Z("error", e), Z("load", e);
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
					default: np(e, t, u, r, n, null);
				}
				return;
			default: if (sn(t)) {
				for (d in n) n.hasOwnProperty(d) && (r = n[d], r !== void 0 && rp(e, t, d, r, n, void 0));
				return;
			}
		}
		for (c in n) n.hasOwnProperty(c) && (r = n[c], r != null && np(e, t, c, r, n, null));
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
						default: r.hasOwnProperty(m) || np(e, t, m, null, r, f);
					}
				}
				for (var p in r) {
					var m = r[p];
					if (f = n[p], r.hasOwnProperty(p) && (m != null || f != null)) switch (p) {
						case "type":
							m !== f && (Rt = !0), o = m;
							break;
						case "name":
							m !== f && (Rt = !0), a = m;
							break;
						case "checked":
							m !== f && (Rt = !0), u = m;
							break;
						case "defaultChecked":
							m !== f && (Rt = !0), d = m;
							break;
						case "value":
							m !== f && (Rt = !0), s = m;
							break;
						case "defaultValue":
							m !== f && (Rt = !0), c = m;
							break;
						case "children":
						case "dangerouslySetInnerHTML":
							if (m != null) throw Error(i(137, t));
							break;
						default: m !== f && np(e, t, p, m, r, f);
					}
				}
				Xt(e, s, c, l, u, d, o, a);
				return;
			case "select":
				for (o in m = s = c = p = null, n) if (l = n[o], n.hasOwnProperty(o) && l != null) switch (o) {
					case "value": break;
					case "multiple": m = l;
					default: r.hasOwnProperty(o) || np(e, t, o, null, r, l);
				}
				for (a in r) if (o = r[a], l = n[a], r.hasOwnProperty(a) && (o != null || l != null)) switch (a) {
					case "value":
						o !== l && (Rt = !0), p = o;
						break;
					case "defaultValue":
						o !== l && (Rt = !0), c = o;
						break;
					case "multiple": o !== l && (Rt = !0), s = o;
					default: o !== l && np(e, t, a, o, r, l);
				}
				t = c, n = s, r = m, p == null ? !!r != !!n && (t == null ? $t(e, !!n, n ? [] : "", !1) : $t(e, !!n, t, !0)) : $t(e, !!n, p, !1);
				return;
			case "textarea":
				for (c in m = p = null, n) if (a = n[c], n.hasOwnProperty(c) && a != null && !r.hasOwnProperty(c)) switch (c) {
					case "value": break;
					case "children": break;
					default: np(e, t, c, null, r, a);
				}
				for (s in r) if (a = r[s], o = n[s], r.hasOwnProperty(s) && (a != null || o != null)) switch (s) {
					case "value":
						a !== o && (Rt = !0), p = a;
						break;
					case "defaultValue":
						a !== o && (Rt = !0), m = a;
						break;
					case "children": break;
					case "dangerouslySetInnerHTML":
						if (a != null) throw Error(i(91));
						break;
					default: a !== o && np(e, t, s, a, r, o);
				}
				en(e, p, m);
				return;
			case "option":
				for (var h in n) if (p = n[h], n.hasOwnProperty(h) && p != null && !r.hasOwnProperty(h)) switch (h) {
					case "selected":
						e.selected = !1;
						break;
					default: np(e, t, h, null, r, p);
				}
				for (l in r) if (p = r[l], m = n[l], r.hasOwnProperty(l) && p !== m && (p != null || m != null)) switch (l) {
					case "selected":
						p !== m && (Rt = !0), e.selected = p && typeof p != "function" && typeof p != "symbol";
						break;
					default: np(e, t, l, p, r, m);
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
				for (var g in n) p = n[g], n.hasOwnProperty(g) && p != null && !r.hasOwnProperty(g) && np(e, t, g, null, r, p);
				for (u in r) if (p = r[u], m = n[u], r.hasOwnProperty(u) && p !== m && (p != null || m != null)) switch (u) {
					case "children":
					case "dangerouslySetInnerHTML":
						if (p != null) throw Error(i(137, t));
						break;
					default: np(e, t, u, p, r, m);
				}
				return;
			default: if (sn(t)) {
				for (var _ in n) p = n[_], n.hasOwnProperty(_) && p !== void 0 && !r.hasOwnProperty(_) && rp(e, t, _, void 0, r, p);
				for (d in r) p = r[d], m = n[d], !r.hasOwnProperty(d) || p === m || p === void 0 && m === void 0 || rp(e, t, d, p, r, m);
				return;
			}
		}
		for (var v in n) p = n[v], n.hasOwnProperty(v) && p != null && !r.hasOwnProperty(v) && np(e, t, v, null, r, p);
		for (f in r) p = r[f], m = n[f], !r.hasOwnProperty(f) || p === m || p == null && m == null || np(e, t, f, p, r, m);
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
		return n = up(n).createElement(e), n[mt] = r, n[ht] = t, Q(n, e, t), Ot(n), n;
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
						a[xt] || s === "SCRIPT" || s === "STYLE" || s === "LINK" && a.rel.toLowerCase() === "stylesheet" || n.removeChild(a), a = o;
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
		var a = wt(i);
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
					rm(n), Ct(n);
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
			} else if (!e[xt]) switch (t) {
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
			n.hasOwnProperty(r) && i != null && np(e, t, r, null, ip, i);
		}
		n.dangerouslySetInnerHTML != null && (e.textContent = ""), e.onclick === dn && (e.onclick = null), Ct(e);
	}
	function vm(e) {
		for (var t = e.attributes; t.length;) e.removeAttributeNode(t[0]);
		Ct(e);
	}
	var ym = /* @__PURE__ */ new Map(), bm = /* @__PURE__ */ new Set();
	function xm(e) {
		if (typeof e.getRootNode == "function") {
			var t = e.getRootNode();
			if (t.nodeType === 9 || t.nodeType === 11) return t;
		}
		return e.nodeType === 9 ? e : e.ownerDocument;
	}
	var Sm = V.d;
	V.d = {
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
		var e = Sm.f(), t = zd();
		return e || t;
	}
	function wm(e) {
		var t = Tt(e);
		t !== null && t.tag === 5 && t.type === "form" ? Zs(t) : Sm.r(e);
	}
	var Tm = typeof document > "u" ? null : document;
	function Em(e, t, n) {
		var r = Tm;
		if (r && typeof t == "string" && t) {
			var i = Yt(t);
			i = "link[rel=\"" + e + "\"][href=\"" + i + "\"]", typeof n == "string" && (i += "[crossorigin=\"" + n + "\"]"), bm.has(i) || (bm.add(i), e = {
				rel: e,
				crossOrigin: n,
				href: t
			}, r.querySelector(i) === null && (t = r.createElement("link"), Q(t, "link", e), Ot(t), r.head.appendChild(t)));
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
			var i = "link[rel=\"preload\"][as=\"" + Yt(t) + "\"]";
			t === "image" && n && n.imageSrcSet ? (i += "[imagesrcset=\"" + Yt(n.imageSrcSet) + "\"]", typeof n.imageSizes == "string" && (i += "[imagesizes=\"" + Yt(n.imageSizes) + "\"]")) : i += "[href=\"" + Yt(e) + "\"]";
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
				Q(o, "link", e), t === "style" && (o[St] = !0, o.onload = o.onerror = function() {
					kt(o);
				}), Ot(o), r.head.appendChild(o);
			}
		}
	}
	function Am(e, t) {
		Sm.m(e, t);
		var n = Tm;
		if (n && e) {
			var r = t && typeof t.as == "string" ? t.as : "script", i = "link[rel=\"modulepreload\"][as=\"" + Yt(r) + "\"][href=\"" + Yt(e) + "\"]", a = i;
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
				r = n.createElement("link"), Q(r, "link", e), Ot(r), n.head.appendChild(r);
			}
		}
	}
	function jm(e, t, n) {
		Sm.S(e, t, n);
		var r = Tm;
		if (r && e) {
			var i = Dt(r).hoistableStyles, a = Fm(e);
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
					Ot(c), Q(c, "link", e), c._p = new Promise(function(e, t) {
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
			var r = Dt(n).hoistableScripts, i = zm(e), a = r.get(i);
			a || (a = n.querySelector(Bm(i)), a || (e = D({
				src: e,
				async: !0
			}, t), (t = ym.get(i)) && Wm(e, t), a = n.createElement("script"), Ot(a), Q(a, "link", e), n.head.appendChild(a)), a = {
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
			var r = Dt(n).hoistableScripts, i = zm(e), a = r.get(i);
			a || (a = n.querySelector(Bm(i)), a || (e = D({
				src: e,
				async: !0,
				type: "module"
			}, t), (t = ym.get(i)) && Wm(e, t), a = n.createElement("script"), Ot(a), Q(a, "link", e), n.head.appendChild(a)), a = {
				type: "script",
				instance: a,
				count: 1,
				state: null
			}, r.set(i, a));
		}
	}
	function Pm(e, t, n, r) {
		var a = (a = W.current) ? xm(a) : null;
		if (!a) throw Error(i(446));
		switch (e) {
			case "meta":
			case "title": return null;
			case "style": return typeof n.precedence == "string" && typeof n.href == "string" ? (n = Fm(n.href), t = Dt(a).hoistableStyles, r = t.get(n), r || (r = {
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
					var o = Dt(a).hoistableStyles, s = o.get(e);
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
			case "script": return t = n.async, n = n.src, typeof n == "string" && t && typeof t != "function" && typeof t != "symbol" ? (n = zm(n), t = Dt(a).hoistableScripts, r = t.get(n), r || (r = {
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
		return "href=\"" + Yt(e) + "\"";
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
			if (!0 !== t[St]) {
				r.loading = 1;
				return;
			}
		} else t = e.createElement("link"), t[St] = !0, t.onload = t.onerror = kt.bind(null, t), Q(t, "link", n), Ot(t), e.head.appendChild(t);
		r.preload = t, t.addEventListener("load", function() {
			return r.loading |= 1;
		}), t.addEventListener("error", function() {
			return r.loading |= 2;
		});
	}
	function zm(e) {
		return "[src=\"" + Yt(e) + "\"]";
	}
	function Bm(e) {
		return "script[async]" + e;
	}
	function Vm(e, t, n) {
		if (t.count++, t.instance === null) switch (t.type) {
			case "style":
				var r = e.querySelector("style[data-href~=\"" + Yt(n.href) + "\"]");
				if (r) return t.instance = r, Ot(r), r;
				var a = D({}, n, {
					"data-href": n.href,
					"data-precedence": n.precedence,
					href: null,
					precedence: null
				});
				return r = (e.ownerDocument || e).createElement("style"), Ot(r), Q(r, "style", a), Hm(r, n.precedence, e), t.instance = r;
			case "stylesheet":
				a = Fm(n.href);
				var o = e.querySelector(Im(a));
				if (o) return t.state.loading |= 4, t.instance = o, Ot(o), o;
				r = Lm(n), (a = ym.get(a)) && Um(r, a), o = (e.ownerDocument || e).createElement("link"), Ot(o);
				var s = o;
				return s._p = new Promise(function(e, t) {
					s.onload = e, s.onerror = t;
				}), Q(o, "link", r), t.state.loading |= 4, Hm(o, n.precedence, e), t.instance = o;
			case "script": return o = zm(n.src), (a = e.querySelector(Bm(o))) ? (t.instance = a, Ot(a), a) : (r = n, (a = ym.get(o)) && (r = D({}, n), Wm(r, a)), e = e.ownerDocument || e, a = e.createElement("script"), Ot(a), Q(a, "link", r), e.head.appendChild(a), t.instance = a);
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
			if (!(a[xt] || a[mt] || e === "link" && a.getAttribute("rel") === "stylesheet") && a.namespaceURI !== "http://www.w3.org/2000/svg") {
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
					t = a._p, typeof t == "object" && t && typeof t.then == "function" && (e.count++, e = rh.bind(e), t.then(e, e)), n.state.loading |= 4, n.instance = a, Ot(a);
					return;
				}
				a = t.ownerDocument || t, r = Lm(r), (i = ym.get(i)) && Um(r, i), a = a.createElement("link"), Ot(a);
				var o = a;
				o._p = new Promise(function(e, t) {
					o.onload = e, o.onerror = t;
				}), Q(a, "link", r), n.instance = a;
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
		$$typeof: P,
		Provider: null,
		Consumer: null,
		_currentValue: de,
		_currentValue2: de,
		_threadCount: 0
	};
	function lh(e, t, n, r, i, a, o, s, c) {
		this.tag = 1, this.containerInfo = e, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = rt(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = rt(0), this.hiddenUpdates = rt(null), this.identifierPrefix = r, this.onUncaughtError = i, this.onCaughtError = a, this.onRecoverableError = o, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = c, this.transitionTypes = null, this.incompleteTransitions = /* @__PURE__ */ new Map();
	}
	function uh(e, t, n, r, i, a, o, s, c, l, u, d) {
		return e = new lh(e, t, n, o, c, l, u, d, s), t = 1, !0 === a && (t |= 24), a = Ti(3, null, null, t), e.current = a, a.stateNode = e, t = Ta(), t.refCount++, e.pooledCache = t, t.refCount++, a.memoizedState = {
			element: r,
			isDehydrated: n,
			cache: t
		}, so(a), e;
	}
	function dh(e) {
		return e ? (e = Ci, e) : Ci;
	}
	function fh(e, t, n, r, i, a) {
		i = dh(i), r.context === null ? r.context = i : r.pendingContext = i, r = lo(t), r.payload = { element: n }, a = a === void 0 ? null : a, a !== null && (r.callback = a), n = uo(e, r, t), n !== null && (Pd(n, e, t), fo(n, e, t));
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
			var t = bi(e, 67108864);
			t !== null && Pd(t, e, 67108864), mh(e, 67108864);
		}
	}
	function gh(e) {
		if (e.tag === 13 || e.tag === 31) {
			var t = jd();
			t = lt(t);
			var n = bi(e, t);
			n !== null && Pd(n, e, t), mh(e, t);
		}
	}
	var _h = !0;
	function vh(e, t, n, r) {
		var i = B.T;
		B.T = null;
		var a = V.p;
		try {
			V.p = 2, bh(e, t, n, r);
		} finally {
			V.p = a, B.T = i;
		}
	}
	function yh(e, t, n, r) {
		var i = B.T;
		B.T = null;
		var a = V.p;
		try {
			V.p = 8, bh(e, t, n, r);
		} finally {
			V.p = a, B.T = i;
		}
	}
	function bh(e, t, n, r) {
		if (_h) {
			var i = xh(r);
			if (i === null) qf(e, t, r, Sh, n), Nh(e, r);
			else if (Fh(i, e, t, n, r)) r.stopPropagation();
			else if (Nh(e, r), t & 4 && -1 < Mh.indexOf(e)) {
				for (; i !== null;) {
					var a = Tt(i);
					if (a !== null) switch (a.tag) {
						case 3:
							if (a = a.stateNode, a.current.memoizedState.isDehydrated) {
								var o = Ze(a.pendingLanes);
								if (o !== 0) {
									var s = a;
									for (s.pendingLanes |= 2, s.entangledLanes |= 2; o;) {
										var c = 1 << 31 - We(o);
										s.entanglements[1] |= c, o &= ~c;
									}
									Df(a), !(Xu & 6) && (gd = Ne() + 500, Of(0, !1));
								}
							}
							break;
						case 31:
						case 13: s = bi(a, 2), s !== null && Pd(s, a, 2), zd(), mh(a, 2);
					}
					if (a = xh(r), a === null && qf(e, t, r, Sh, n), a === i) break;
					i = a;
				}
				i !== null && r.stopPropagation();
			} else qf(e, t, r, null, n);
		}
	}
	function xh(e) {
		return e = pn(e), Ch(e);
	}
	var Sh = null;
	function Ch(e) {
		if (Sh = null, e = wt(e), e !== null) {
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
			case "message": switch (Pe()) {
				case Fe: return 2;
				case Ie: return 8;
				case Le:
				case Re: return 32;
				case K: return 268435456;
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
		}, t !== null && (t = Tt(t), t !== null && hh(t)), e) : (e.eventSystemFlags |= r, t = e.targetContainers, i !== null && t.indexOf(i) === -1 && t.push(i), e);
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
		var t = wt(e.target);
		if (t !== null) {
			var n = o(t);
			if (n !== null) {
				if (t = n.tag, t === 13) {
					if (t = s(n), t !== null) {
						e.blockedOn = t, ft(e.priority, function() {
							gh(n);
						});
						return;
					}
				} else if (t === 31) {
					if (t = c(n), t !== null) {
						e.blockedOn = t, ft(e.priority, function() {
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
				fn = r, n.target.dispatchEvent(r), fn = null;
			} else return t = Tt(n), t !== null && hh(t), e.blockedOn = n, !1;
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
				var a = Tt(n);
				a !== null && (e.splice(t, 3), t -= 3, Ys(a, {
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
			var i = n[r], a = n[r + 1], o = i[ht] || null;
			if (typeof a == "function") o || Hh(n);
			else if (o) {
				var s = null;
				if (a && a.hasAttribute("formAction")) {
					if (i = a, o = a[ht] || null) s = o.formAction;
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
		fh(n, jd(), e, t, null, null);
	}, Kh.prototype.unmount = Gh.prototype.unmount = function() {
		var e = this._internalRoot;
		if (e !== null) {
			this._internalRoot = null;
			var t = e.containerInfo;
			fh(e.current, 2, null, e, null, null), zd(), t[gt] = null;
		}
	};
	function Kh(e) {
		this._internalRoot = e;
	}
	Kh.prototype.unstable_scheduleHydration = function(e) {
		if (e) {
			var t = dt();
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
	V.findDOMNode = function(e) {
		var t = e._reactInternals;
		if (t === void 0) throw typeof e.render == "function" ? Error(i(188)) : (e = Object.keys(e).join(","), Error(i(268, e)));
		return e = d(t), e = e === null ? null : p(e), e = e === null ? null : e.stateNode, e;
	};
	var Jh = {
		bundleType: 0,
		version: "19.3.1",
		rendererPackageName: "react-dom",
		currentDispatcherRef: B,
		reconcilerVersion: "19.3.1"
	};
	if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
		var Yh = __REACT_DEVTOOLS_GLOBAL_HOOK__;
		if (!Yh.isDisabled && Yh.supportsFiber) try {
			Ve = Yh.inject(Jh), He = Yh;
		} catch {}
	}
	e.createRoot = function(e, t) {
		if (!a(e)) throw Error(i(299));
		var n = !1, r = "", o = vc, s = yc, c = bc;
		return t != null && (!0 === t.unstable_strictMode && (n = !0), t.identifierPrefix !== void 0 && (r = t.identifierPrefix), t.onUncaughtError !== void 0 && (o = t.onUncaughtError), t.onCaughtError !== void 0 && (s = t.onCaughtError), t.onRecoverableError !== void 0 && (c = t.onRecoverableError)), t = uh(e, 1, !1, null, null, n, r, null, o, s, c, Wh), e[gt] = t.current, Gf(e), new Gh(t);
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
var M = /* @__NO_SIDE_EFFECTS__ */ (e) => e, ee = (...e) => e.reduce((e, t) => (n) => t(e(n))), N = /* @__NO_SIDE_EFFECTS__ */ (e, t, n) => {
	let r = t - e;
	return r ? (n - e) / r : 1;
}, P = class {
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
}, F = /* @__NO_SIDE_EFFECTS__ */ (e) => e * 1e3, I = /* @__NO_SIDE_EFFECTS__ */ (e) => e / 1e3, te = /* @__NO_SIDE_EFFECTS__ */ (e, t) => t ? 1e3 / t * e : 0, L = (e, t, n) => e * (3 * (1 - e) * ((1 - e) * t + e * n) + e * e);
/*#__NO_SIDE_EFFECTS__*/
function ne(e, t, n, r) {
	return e === t && n === r ? M : (i) => {
		let a = 0, o = 1, s = i;
		for (let t = 0;; t++) {
			s >= a && s <= o || (s = (a + o) / 2);
			let r = L(s, e, n) - i;
			if (r * r < 1e-28 || t === 40) break;
			r > 0 ? o = s : a = s, s -= r * 1e-7 / (L(s + 1e-7, e, n) - i - r);
		}
		return L(s, t, r);
	};
}
// node_modules/motion-utils/dist/es/easing/modifiers/mirror.mjs
var re = /* @__NO_SIDE_EFFECTS__ */ (e) => (t) => t <= .5 ? e(2 * t) / 2 : (2 - e(2 * (1 - t))) / 2, ie = /* @__NO_SIDE_EFFECTS__ */ (e) => (t) => 1 - e(1 - t), ae = /*@__PURE__*/ ne(.33, 1.53, .69, .99), oe = /*@__PURE__*/ ie(ae), se = /*@__PURE__*/ re(oe), ce = (e) => e >= 1 ? 1 : (e *= 2) < 1 ? .5 * oe(e) : .5 * (2 - 2 ** (-10 * (e - 1))), R = (e) => 1 - Math.sin(Math.acos(e)), le = /* @__PURE__ */ ie(R), ue = /* @__PURE__ */ re(R), z = /*@__PURE__*/ ne(.42, 0, 1, 1), B = /*@__PURE__*/ ne(0, 0, .58, 1), V = /*@__PURE__*/ ne(.42, 0, .58, 1), de = /* @__NO_SIDE_EFFECTS__ */ (e) => Array.isArray(e) && typeof e[0] != "number", fe = /* @__NO_SIDE_EFFECTS__ */ (e) => Array.isArray(e) && typeof e[0] == "number", pe = {
	linear: M,
	easeIn: z,
	easeInOut: V,
	easeOut: B,
	circIn: R,
	circInOut: ue,
	circOut: le,
	backIn: oe,
	backInOut: se,
	backOut: ae,
	anticipate: ce
}, me = (e) => typeof e == "string", he = (e) => {
	if (/* @__PURE__ */ fe(e)) {
		e.length;
		let [t, n, r, i] = e;
		return /* @__PURE__ */ ne(t, n, r, i);
	}
	return me(e) ? (pe[e], `${e}`, pe[e]) : e;
}, H = {
	delta: 0,
	timestamp: 0,
	isProcessing: !1
}, ge;
function U() {
	ge = void 0;
}
var W = {
	now: () => (ge === void 0 && W.set(H.isProcessing || D.useManualTiming ? H.timestamp : performance.now()), ge),
	set: (e) => {
		ge = e, queueMicrotask(U);
	}
}, G = (e) => Math.round(e * 1e5) / 1e5, _e = (e) => (t) => typeof t == "string" && t.startsWith(e), ve = /*@__PURE__*/ _e("--"), ye = /*@__PURE__*/ _e("var(--"), be = (e) => ye(e) ? xe.test(e.split("/*")[0].trim()) : !1, xe = /var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu;
function Se(e) {
	return typeof e == "string" && e.split("/*")[0].includes("var(--");
}
// node_modules/motion-dom/dist/es/value/types/numbers/index.mjs
var Ce = {
	test: (e) => typeof e == "number",
	parse: parseFloat,
	transform: (e) => e
}, we = {
	...Ce,
	transform: (e) => E(0, 1, e)
}, Te = {
	...Ce,
	default: 1
}, Ee = /-?(?:\d+(?:\.\d+)?|\.\d+)/gu;
// node_modules/motion-dom/dist/es/value/types/utils/is-nullish.mjs
function De(e) {
	return e == null;
}
// node_modules/motion-dom/dist/es/value/types/utils/single-color-regex.mjs
var Oe = /^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu, ke = (e, t) => (n) => !!(typeof n == "string" && Oe.test(n) && n.startsWith(e) || t && !De(n) && Object.prototype.hasOwnProperty.call(n, t)), Ae = (e, t, n) => (r) => {
	if (typeof r != "string") return r;
	let [i, a, o, s] = r.match(Ee);
	return {
		[e]: parseFloat(i),
		[t]: parseFloat(a),
		[n]: parseFloat(o),
		alpha: s === void 0 ? 1 : parseFloat(s)
	};
}, je = (e) => E(0, 255, e), Me = {
	...Ce,
	transform: (e) => Math.round(je(e))
}, Ne = {
	test: /*@__PURE__*/ ke("rgb", "red"),
	parse: /*@__PURE__*/ Ae("red", "green", "blue"),
	transform: ({ red: e, green: t, blue: n, alpha: r = 1 }) => "rgba(" + Me.transform(e) + ", " + Me.transform(t) + ", " + Me.transform(n) + ", " + G(we.transform(r)) + ")"
};
// node_modules/motion-dom/dist/es/value/types/color/hex.mjs
function Pe(e) {
	let t = "", n = "", r = "", i = "";
	return e.length > 5 ? (t = e.substring(1, 3), n = e.substring(3, 5), r = e.substring(5, 7), i = e.substring(7, 9)) : (t = e.substring(1, 2), n = e.substring(2, 3), r = e.substring(3, 4), i = e.substring(4, 5), t += t, n += n, r += r, i += i), {
		red: parseInt(t, 16),
		green: parseInt(n, 16),
		blue: parseInt(r, 16),
		alpha: i ? parseInt(i, 16) / 255 : 1
	};
}
var Fe = {
	test: /*@__PURE__*/ ke("#"),
	parse: Pe,
	transform: Ne.transform
}, Ie = /* @__NO_SIDE_EFFECTS__ */ (e) => ({
	test: (t) => typeof t == "string" && t.endsWith(e) && t.split(" ").length === 1,
	parse: parseFloat,
	transform: (t) => `${t}${e}`
}), Le = /*@__PURE__*/ Ie("deg"), Re = /*@__PURE__*/ Ie("%"), K = /*@__PURE__*/ Ie("px"), ze = /*@__PURE__*/ Ie("vh"), Be = /*@__PURE__*/ Ie("vw"), Ve = {
	...Re,
	parse: (e) => Re.parse(e) / 100,
	transform: (e) => Re.transform(e * 100)
}, He = {
	test: /*@__PURE__*/ ke("hsl", "hue"),
	parse: /*@__PURE__*/ Ae("hue", "saturation", "lightness"),
	transform: ({ hue: e, saturation: t, lightness: n, alpha: r = 1 }) => "hsla(" + Math.round(e) + ", " + Re.transform(G(t)) + ", " + Re.transform(G(n)) + ", " + G(we.transform(r)) + ")"
}, Ue = {
	test: (e) => Ne.test(e) || Fe.test(e) || He.test(e),
	parse: (e) => Ne.test(e) ? Ne.parse(e) : He.test(e) ? He.parse(e) : Fe.parse(e),
	transform: (e) => typeof e == "string" ? e : e.hasOwnProperty("red") ? Ne.transform(e) : He.transform(e),
	getAnimatableNone: (e) => {
		let t = Ue.parse(e);
		return t.alpha = 0, Ue.transform(t);
	}
}, We = /(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu, Ge = /*@__PURE__*/ new RegExp(Ee.source), Ke = /*@__PURE__*/ new RegExp(We.source, "i");
function qe(e) {
	return isNaN(e) && typeof e == "string" && (Ge.test(e) || Ke.test(e));
}
var Je = "number", Ye = "color", Xe = "var", Ze = "var(", Qe = "${}", $e = /var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)(?![a-z]*\()/giu;
function et(e) {
	let t = e.toString();
	return Ge.test(t) || Ke.test(t);
}
function tt(e) {
	let t = e.toString(), n = [], r = {
		color: [],
		number: [],
		var: []
	}, i = [], a = 0;
	return {
		values: n,
		split: t.replace($e, (e) => (Ue.test(e) ? (r.color.push(a), i.push(Ye), n.push(Ue.parse(e))) : e.startsWith(Ze) ? (r.var.push(a), i.push(Xe), n.push(e)) : (r.number.push(a), i.push(Je), n.push(parseFloat(e))), ++a, Qe)).split(Qe),
		indexes: r,
		types: i
	};
}
function nt(e) {
	return tt(e).values;
}
function rt({ split: e, types: t }) {
	let n = e.length;
	return (r) => {
		let i = "";
		for (let a = 0; a < n; a++) if (i += e[a], r[a] !== void 0) {
			let e = t[a];
			i += e === Je ? G(r[a]) : e === Ye ? Ue.transform(r[a]) : r[a];
		}
		return i;
	};
}
function it(e) {
	return rt(tt(e));
}
var at = (e) => typeof e == "number" ? 0 : Ue.test(e) ? Ue.getAnimatableNone(e) : e, ot = (e, t) => typeof e == "number" ? t?.trim().endsWith("/") ? e : 0 : at(e);
function st(e) {
	let t = tt(e);
	return rt(t)(t.values.map((e, n) => ot(e, t.split[n])));
}
var ct = {
	test: qe,
	parse: nt,
	createTransformer: it,
	getAnimatableNone: st
};
// node_modules/motion-dom/dist/es/value/types/color/hsla-to-rgba.mjs
function lt(e, t, n) {
	return n < 0 && (n += 1), n > 1 && --n, n < 1 / 6 ? e + (t - e) * 6 * n : n < 1 / 2 ? t : n < 2 / 3 ? e + (t - e) * (2 / 3 - n) * 6 : e;
}
function ut({ hue: e, saturation: t, lightness: n, alpha: r }) {
	e /= 360, t /= 100, n /= 100;
	let i = 0, a = 0, o = 0;
	if (!t) i = a = o = n;
	else {
		let r = n < .5 ? n * (1 + t) : n + t - n * t, s = 2 * n - r;
		i = lt(s, r, e + 1 / 3), a = lt(s, r, e), o = lt(s, r, e - 1 / 3);
	}
	return {
		red: Math.round(i * 255),
		green: Math.round(a * 255),
		blue: Math.round(o * 255),
		alpha: r
	};
}
// node_modules/motion-dom/dist/es/utils/mix/immediate.mjs
function dt(e, t) {
	return (n) => n > 0 ? t : e;
}
// node_modules/motion-dom/dist/es/utils/mix/number.mjs
var ft = (e, t, n) => e + (t - e) * n, pt = (e, t, n) => {
	let r = e * e, i = n * (t * t - r) + r;
	return i < 0 ? 0 : Math.sqrt(i);
}, mt = [
	Fe,
	Ne,
	He
], ht = (e) => mt.find((t) => t.test(e));
function gt(e) {
	let t = ht(e);
	if (!t) return `${e}`, !1;
	let n = t.parse(e);
	return t === He && (n = ut(n)), n;
}
var _t = (e, t) => {
	let n = gt(e), r = gt(t);
	if (!n || !r) return dt(e, t);
	let i = { ...n };
	return (e) => (i.red = pt(n.red, r.red, e), i.green = pt(n.green, r.green, e), i.blue = pt(n.blue, r.blue, e), i.alpha = ft(n.alpha, r.alpha, e), Ne.transform(i));
}, vt = /* @__PURE__ */ new Set(["none", "hidden"]);
function yt(e, t) {
	return vt.has(e) ? (n) => n <= 0 ? e : t : (n) => n >= 1 ? t : e;
}
// node_modules/motion-dom/dist/es/utils/mix/complex.mjs
function bt(e, t) {
	return (n) => ft(e, t, n);
}
function xt(e) {
	return typeof e == "number" ? bt : typeof e == "string" ? be(e) ? dt : Ue.test(e) ? _t : Tt : Array.isArray(e) ? St : typeof e == "object" ? Ue.test(e) ? _t : Ct : dt;
}
function St(e, t) {
	let n = [...e], r = n.length, i = e.map((e, n) => xt(e)(e, t[n]));
	return (e) => {
		for (let t = 0; t < r; t++) n[t] = i[t](e);
		return n;
	};
}
function Ct(e, t) {
	let n = {
		...e,
		...t
	}, r = {};
	for (let i in n) e[i] !== void 0 && t[i] !== void 0 && (r[i] = xt(e[i])(e[i], t[i]));
	return (e) => {
		for (let t in r) n[t] = r[t](e);
		return n;
	};
}
function wt(e, t) {
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
var Tt = (e, t) => {
	let n = ct.createTransformer(t), r = tt(e), i = tt(t);
	return r.indexes.var.length === i.indexes.var.length && r.indexes.color.length === i.indexes.color.length && r.indexes.number.length >= i.indexes.number.length ? vt.has(e) && !i.values.length || vt.has(t) && !r.values.length ? yt(e, t) : ee(St(wt(r, i), i.values), n) : (`${e}${t}`, dt(e, t));
}, Et = /^(-?(?:\d+(?:\.\d*)?|\.\d+))([a-z%]*)$/iu;
function Dt(e, t) {
	let n = Et.exec(e);
	if (!n) return;
	let r = Et.exec(t);
	if (!r || n[2] !== r[2]) return;
	let i = n[2], a = parseFloat(n[1]), o = parseFloat(r[1]);
	return (e) => G(ft(a, o, e)) + i;
}
function Ot(e, t, n) {
	if (typeof e == "number" && typeof t == "number" && typeof n == "number") return ft(e, t, n);
	if (typeof e == "string" && typeof t == "string") {
		let n = Dt(e, t);
		if (n) return n;
	}
	return xt(e)(e, t);
}
// node_modules/motion-dom/dist/es/frameloop/order.mjs
var kt = [
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
function At(e) {
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
var jt = 40;
function Mt(e, t, n = {
	delta: 0,
	timestamp: 0,
	isProcessing: !1
}) {
	let r = !1, i = !0, a = () => r = !0, o = kt.reduce((e, t) => (e[t] = At(a), e), {}), { setup: s, read: c, resolveKeyframes: l, preUpdate: u, update: d, preRender: f, render: p, postRender: m } = o, h = () => {
		let a = D.useManualTiming, o = a ? n.timestamp : performance.now();
		r = !1, a || (n.delta = i ? 1e3 / 60 : Math.max(Math.min(o - n.timestamp, jt), 1)), n.timestamp = o, n.isProcessing = !0, s.process(n), c.process(n), l.process(n), u.process(n), d.process(n), f.process(n), p.process(n), m.process(n), n.isProcessing = !1, r && t && (i = !1, e(h));
	}, g = () => {
		r = !0, i = !0, n.isProcessing || e(h);
	};
	return {
		schedule: kt.reduce((e, t) => {
			let n = o[t];
			return e[t] = (e, t = !1, i = !1) => (r || g(), n.schedule(e, t, i)), e;
		}, {}),
		cancel: (e) => {
			for (let t = 0; t < kt.length; t++) o[kt[t]].cancel(e);
		},
		state: n,
		steps: o
	};
}
// node_modules/motion-dom/dist/es/frameloop/frame.mjs
var { schedule: Nt, cancel: Pt, steps: Ft } = /* @__PURE__ */ Mt(typeof requestAnimationFrame < "u" ? requestAnimationFrame : M, !0, H), It = (e) => {
	let t = ({ timestamp: t }) => e(t);
	return {
		start: (e = !0) => Nt.update(t, e),
		stop: () => Pt(t),
		now: () => H.isProcessing ? H.timestamp : W.now()
	};
}, Lt = (e, t, n = 10) => {
	let r = "", i = Math.max(Math.round(t / n), 2);
	for (let t = 0; t < i; t++) r += Math.round(e(t / (i - 1)) * 1e4) / 1e4 + ", ";
	return `linear(${r.substring(0, r.length - 2)})`;
}, Rt = 2e4;
function zt(e, t = 50, n = Rt, r) {
	let i = 0, a = e.next(i);
	for (r?.push(a.value); !a.done && i < n;) i += t, a = e.next(i), r?.push(a.value);
	return i >= n ? Infinity : i;
}
// node_modules/motion-dom/dist/es/animation/generators/utils/create-generator-easing.mjs
function Bt(e, t = 100, n) {
	let { keyframes: r, velocity: i } = e, a = r && r[r.length - 1] - r[0], o = n({
		...e,
		velocity: i && a ? i * t / a : i,
		keyframes: [0, t]
	}), s = Math.min(zt(o), Rt);
	return {
		type: "keyframes",
		ease: (e) => o.next(s * e).value / t,
		duration: /* @__PURE__ */ I(s)
	};
}
// node_modules/motion-dom/dist/es/animation/generators/spring.mjs
var Vt = {
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
}, Ht = (e) => e < 0 ? 1 / Math.max(1 + e, Vt.minDamping) : Math.max(1 - e, Vt.minDamping);
function Ut(e, t) {
	if (!(e > 1)) return 1;
	let n = Math.sqrt(e * e - 1), r = e - n, i = e + n, a = 2 * n * Math.exp(-t) * (1 + t);
	return Kt((e) => i * Math.exp(-r * e) - r * Math.exp(-i * e) - a, (e) => Math.exp(-i * e) - Math.exp(-r * e), t) / t;
}
function Wt(e, t) {
	return e * Math.sqrt(1 - t * t);
}
var Gt = 12;
function Kt(e, t, n) {
	let r = n;
	for (let n = 1; n < Gt; n++) r -= e(r) / t(r);
	return r;
}
var qt = .001;
function Jt({ duration: e = Vt.duration, bounce: t = Vt.bounce }) {
	let n, r;
	Vt.maxDuration;
	let i = Ht(t);
	e = E(Vt.minDuration, Vt.maxDuration, /* @__PURE__ */ I(e)), i < 1 ? (n = (t) => {
		let n = t * i, r = n * e, a = Wt(t, i), o = Math.exp(-r);
		return qt - n / a * o;
	}, r = (t) => {
		let r = t * i * e, a = i * i * t * t * e, o = Math.exp(-r), s = Wt(t * t, i);
		return (-n(t) + qt > 0 ? -1 : 1) * -a * o / s;
	}) : (n = (t) => -.001 + Math.exp(-t * e) * (t * e + 1), r = (t) => Math.exp(-t * e) * (-t * (e * e)));
	let a = 5 / e, o = Kt(n, r, a), s = o * Ut(i, o * e), c = s * s;
	return {
		stiffness: c,
		damping: i * 2 * Math.sqrt(c),
		duration: /* @__PURE__ */ F(e)
	};
}
var Yt = (e, t) => (t ? e >= 0 : e > 0) && e < Infinity;
function Xt(e, t) {
	if (Yt(e, t)) return e;
}
function Zt(e) {
	let t = Xt(e.stiffness), n = Xt(e.damping, !0), r = Xt(e.mass), i = {
		...e,
		stiffness: t ?? Vt.stiffness,
		damping: n ?? Vt.damping,
		mass: r ?? Vt.mass,
		isResolvedFromDuration: !1,
		isTimeDefined: (t ?? n ?? r) === void 0 && (e.duration !== void 0 || e.bounce !== void 0)
	};
	if (i.isTimeDefined) {
		if (e.visualDuration) {
			let t = Ht(e.bounce || 0), n = 2 * Math.PI / (e.visualDuration * 1.2) * Ut(t, 2 * Math.PI / 1.2);
			i.stiffness = n * n, i.damping = 2 * t * Math.sqrt(i.stiffness);
		} else Object.assign(i, Jt(i)), i.isResolvedFromDuration = !0;
		Yt(i.stiffness) && Yt(i.damping, !0) || (i.stiffness = Vt.stiffness, i.damping = Vt.damping);
	}
	return i;
}
function Qt(e = Vt.visualDuration, t = Vt.bounce) {
	let n = typeof e == "object" ? e : {
		visualDuration: e,
		keyframes: [0, 1],
		bounce: t
	}, r = n.keyframes[0], i = n.keyframes[n.keyframes.length - 1], a = {
		done: !1,
		value: r
	}, { stiffness: o, damping: s, mass: c, duration: l, isResolvedFromDuration: u, isTimeDefined: d } = Zt({ ...n }), f = (e) => d ? 0 : -/* @__PURE__ */ I(e), p = s / (2 * Math.sqrt(o * c)), m = /* @__PURE__ */ I(Math.sqrt(o / c)), h = p * m, g = {
		target: i,
		delta: i - r,
		velocity: f(n.velocity || 0) || 0,
		restSpeed: 0,
		restDelta: 0
	}, _ = () => {
		let e = Math.abs(g.delta) < 5;
		g.restSpeed = n.restSpeed || (e ? Vt.restSpeed.granular : Vt.restSpeed.default), g.restDelta = n.restDelta || (e ? Vt.restDelta.granular : Vt.restDelta.default);
	};
	_();
	let v, y, b;
	if (p < 1) {
		let e = Wt(m, p), t = {
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
		velocity: (e) => /* @__PURE__ */ F(y(e)),
		next: (e) => {
			let t = v(e);
			if (u) a.done = e >= l;
			else {
				let n = /* @__PURE__ */ F(y(e));
				a.done = Math.abs(n) <= g.restSpeed && Math.abs(g.target - t) <= g.restDelta;
			}
			return a.value = a.done ? g.target : t, a;
		},
		toString: () => {
			let e = Math.min(zt(S), Rt), t = Lt((t) => S.next(e * t).value, e, 30);
			return e + "ms " + t;
		},
		toTransition: () => {}
	};
	return S;
}
var $t = /* @__PURE__ */ Object.assign(Qt, { applyToOptions: (e) => {
	let t = Bt(e, 100, Qt);
	return e.ease = t.ease, e.duration = /* @__PURE__ */ F(t.duration), e.type = "keyframes", e;
} });
// node_modules/motion-dom/dist/es/animation/generators/inertia.mjs
function en({ keyframes: e, velocity: t = 0, power: n = .8, timeConstant: r = 325, bounceDamping: i = 10, bounceStiffness: a = 500, modifyTarget: o, min: s, max: c, restDelta: l = .5, restSpeed: u }) {
	let d = e[0], f = {
		done: !1,
		value: d
	}, p = (e) => e < s || e > c, m = (e) => s === void 0 ? c : c === void 0 || Math.abs(s - e) < Math.abs(c - e) ? s : c, h = n * t, g = d + h, _ = o === void 0 ? g : o(g);
	_ !== g && (h = _ - d);
	let v = (e) => -h * Math.exp(-e / r), y = (e) => {
		let t = v(e);
		f.done = Math.abs(t) <= l, f.value = f.done ? _ : _ + t;
	}, b, x, S = (e) => {
		p(f.value) && (b = e, x = $t({
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
function tn(e, t, n) {
	let r = [], i = n || D.mix || Ot, a = e.length - 1;
	for (let n = 0; n < a; n++) {
		let a = i(e[n], e[n + 1]);
		t && (a = ee(Array.isArray(t) ? t[n] || M : t, a)), r.push(a);
	}
	return r;
}
function nn(e, t, { clamp: n = !0, ease: r, mixer: i } = {}) {
	let a = e.length;
	if (t.length, a === 1) return () => t[0];
	if (a === 2 && t[0] === t[1]) return () => t[1];
	let o = e[0] === e[1];
	e[0] > e[a - 1] && (e = [...e].reverse(), t = [...t].reverse());
	let s = tn(t, r, i), c = s.length, l = (n) => {
		if (o && n < e[0]) return t[0];
		let r = 0;
		if (c > 1) for (; r < e.length - 2 && !(n < e[r + 1]); r++);
		let i = /* @__PURE__ */ N(e[r], e[r + 1], n);
		return s[r](i);
	};
	return n ? (t) => l(E(e[0], e[a - 1], t)) : l;
}
// node_modules/motion-dom/dist/es/animation/keyframes/offsets/fill.mjs
function rn(e, t) {
	let n = e[e.length - 1];
	for (let r = 1; r <= t; r++) {
		let i = /* @__PURE__ */ N(0, t, r);
		e.push(ft(n, 1, i));
	}
}
// node_modules/motion-dom/dist/es/animation/keyframes/offsets/default.mjs
function an(e) {
	let t = [0];
	return rn(t, e.length - 1), t;
}
// node_modules/motion-dom/dist/es/animation/keyframes/offsets/time.mjs
function on(e, t) {
	return e.map((e) => e * t);
}
// node_modules/motion-dom/dist/es/animation/generators/keyframes.mjs
function sn(e, t) {
	return e.map(() => t || V).splice(0, e.length - 1);
}
function cn({ duration: e = 300, keyframes: t, times: n, ease: r = "easeInOut" }) {
	let i = /* @__PURE__ */ de(r) ? r.map(he) : he(r) || V, a = {
		done: !1,
		value: t[0]
	};
	if (t.length === 2 && !Array.isArray(i) && (!n || n.length !== 2 || n[0] === 0 && n[1] === 1)) {
		let [n, r] = t, o = n === r ? void 0 : (D.mix || Ot)(n, r);
		return {
			calculatedDuration: e,
			next: (t) => (a.value = o ? o(i(e > 0 ? E(0, 1, t / e) : 1)) : r, a.done = t >= e, a)
		};
	}
	let o = nn(on(n && n.length === t.length ? n : an(t), e), t, { ease: Array.isArray(i) ? i : sn(t, i) });
	return {
		calculatedDuration: e,
		next: (t) => (a.value = o(t), a.done = t >= e, a)
	};
}
// node_modules/motion-dom/dist/es/animation/generators/utils/velocity.mjs
var ln = 5;
function un(e, t, n) {
	let r = Math.max(t - ln, 0);
	return /* @__PURE__ */ te(n - e(r), t - r);
}
function dn(e, t, n = 0) {
	return t <= 0 ? n : e.velocity ? e.velocity(t) : un((t) => e.next(t).value, t, e.next(t).value);
}
// node_modules/motion-dom/dist/es/animation/keyframes/get-final.mjs
var fn = (e) => e !== null;
function pn(e, { repeat: t, repeatType: n = "loop" }, r, i = 1) {
	let a = e.filter(fn), o = i < 0 || t && n !== "loop" && t % 2 == 1 ? 0 : a.length - 1;
	return !o || r === void 0 ? a[o] : r;
}
// node_modules/motion-dom/dist/es/animation/utils/replace-transition-type.mjs
var mn = {
	decay: en,
	inertia: en,
	tween: cn,
	keyframes: cn,
	spring: $t
};
function hn(e) {
	typeof e.type == "string" && (e.type = mn[e.type]);
}
// node_modules/motion-dom/dist/es/animation/utils/resolve-start-time.mjs
var gn = 40, _n = (e, t) => t - e > gn && !D.useManualTiming ? t : e;
// node_modules/motion-dom/dist/es/animation/utils/notify-inspector.mjs
function vn(e, t) {
	return {
		kind: e,
		animation: t,
		timestamp: W.now(),
		frameTimestamp: H.timestamp,
		frameIsProcessing: H.isProcessing
	};
}
function yn(e, t, n) {
	let r = globalThis.__MOTION_INSPECT__;
	if (r) try {
		r({
			...vn("animation-start", e),
			options: n ? {
				...t,
				...n
			} : t
		});
	} catch {}
}
function bn(e, t) {
	let n = globalThis.__MOTION_INSPECT__;
	if (n) try {
		n({
			...vn("layout-animation-start", e),
			node: t
		});
	} catch {}
}
// node_modules/motion-dom/dist/es/animation/utils/WithPromise.mjs
var xn = class {
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
}, Sn = (e) => e / 100, Cn = (e) => Math.round(e * 1e4) / 1e4, wn = class extends xn {
	constructor(e) {
		super(), this.state = "idle", this.startTime = null, this.isStopped = !1, this.currentTime = 0, this.holdTime = null, this.playbackSpeed = 1, this.delayState = {
			done: !1,
			value: void 0
		}, this.stop = () => {
			let { motionValue: e } = this.options;
			e && e.updatedAt !== W.now() && this.tick(W.now()), this.isStopped = !0, this.state !== "idle" && (this.teardown(), this.options.onStop?.());
		}, this.options = e, this.initAnimation(), this.play(), e.autoplay === !1 && this.pause(), yn(this, this.options);
	}
	initAnimation() {
		let { options: e } = this;
		hn(e);
		let { type: t = cn, repeat: n = 0, repeatDelay: r = 0, repeatType: i, velocity: a = 0 } = e, { keyframes: o } = e, s = t || cn;
		s !== cn && typeof o[0] != "number" && (this.mixKeyframes = ee(Sn, Ot(o[0], o[1])), o = [0, 100]);
		let c = s(o === e.keyframes ? e : {
			...e,
			keyframes: o
		});
		i === "mirror" && (this.mirroredGenerator = s({
			...e,
			keyframes: [...o].reverse(),
			velocity: -a
		})), c.calculatedDuration === null && (c.calculatedDuration = zt(c));
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
		this.startTime === this.pendingStartTime && (this.startTime = _n(this.startTime, e)), this.pendingStartTime = void 0, this.speed > 0 ? this.startTime = Math.min(this.startTime, e) : this.speed < 0 && (this.startTime = Math.min(e - r / this.speed, this.startTime)), t ? this.currentTime = e : this.updateTime(e);
		let u = this.currentTime - a * (this.playbackSpeed >= 0 ? 1 : -1), d = this.playbackSpeed >= 0 ? u < 0 : u > r;
		this.currentTime = Math.max(u, 0), this.state === "finished" && this.holdTime === null && (this.currentTime = r);
		let f = this.generate(this.currentTime, d), { done: p } = f;
		!d && i !== null && (p = this.playbackSpeed >= 0 ? this.currentTime >= r : this.currentTime <= 0);
		let m = this.holdTime === null && (this.state === "finished" || this.state === "running" && p);
		return m && s !== en && (f.value = pn(o, this.options, l, this.speed)), c && c(f.value), m && this.finish(), f;
	}
	at(e) {
		return this.holdTime ?? Cn((e - this.startTime) * this.playbackSpeed);
	}
	sampleAt(e, t) {
		let { options: n, totalDuration: r } = this, i = this.at(e) - (n.delay || 0);
		return i >= r && n.type !== en ? pn(n.keyframes, n, t ? void 0 : n.finalKeyframe) : this.generate(Math.max(i, 0), i < 0).value;
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
		return /* @__PURE__ */ I(this.calculatedDuration);
	}
	get iterationDuration() {
		let { delay: e = 0 } = this.options || {};
		return this.duration + /* @__PURE__ */ I(e);
	}
	get time() {
		return /* @__PURE__ */ I(this.currentTime);
	}
	set time(e) {
		e = /* @__PURE__ */ F(e), this.currentTime = e, this.startTime === null || this.holdTime !== null || this.playbackSpeed === 0 ? this.holdTime = e : this.driver && (this.startTime = this.driver.now() - e / this.playbackSpeed), this.driver ? this.driver.start(!1) : (this.startTime = 0, this.state = "paused", this.holdTime = e, this.tick(e));
	}
	getGeneratorVelocity() {
		return dn(this.generator, this.currentTime, this.options.velocity);
	}
	get speed() {
		return this.playbackSpeed;
	}
	set speed(e) {
		let t = this.playbackSpeed !== e;
		t && this.driver && this.updateTime(W.now()), this.playbackSpeed = e, t && this.driver && (this.time = /* @__PURE__ */ I(this.currentTime));
	}
	play() {
		if (this.isStopped) return;
		let { driver: e = It, startTime: t } = this.options;
		this.driver ||= e((e) => this.tick(e)), this.options.onPlay?.();
		let n = this.driver.now();
		this.state === "finished" ? (this.updateFinished(), this.startTime = n) : this.holdTime === null ? this.startTime ||= t ?? (this.pendingStartTime = n) : this.startTime = n - this.holdTime / (this.playbackSpeed || 1), this.state === "finished" && this.speed < 0 && (this.startTime += this.calculatedDuration), this.holdTime = null, this.state = "running", this.driver.start();
	}
	pause() {
		this.state = "paused", this.updateTime(W.now()), this.holdTime = this.currentTime;
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
}, Tn = /* @__PURE__ */ new Set([
	"brightness",
	"contrast",
	"saturate",
	"opacity"
]);
function En(e) {
	let [t, n] = e.slice(0, -1).split("(");
	if (t === "drop-shadow") return e;
	let [r] = n.match(Ee) || [];
	if (!r) return e;
	let i = n.replace(r, ""), a = +!!Tn.has(t);
	return r !== n && (a *= 100), t + "(" + a + i + ")";
}
var Dn = /\b([a-z-]*)\(.*?\)/gu, On = {
	...ct,
	getAnimatableNone: (e) => {
		let t = e.match(Dn);
		return t ? t.map(En).join(" ") : e;
	}
}, kn = {
	...ct,
	getAnimatableNone: (e) => {
		let t = ct.parse(e);
		return ct.createTransformer(e)(t.map((e) => typeof e == "number" ? 0 : typeof e == "object" ? {
			...e,
			alpha: 1
		} : e));
	}
}, An = {
	...Ce,
	transform: Math.round
}, jn = {
	borderWidth: K,
	borderTopWidth: K,
	borderRightWidth: K,
	borderBottomWidth: K,
	borderLeftWidth: K,
	borderRadius: K,
	borderTopLeftRadius: K,
	borderTopRightRadius: K,
	borderBottomRightRadius: K,
	borderBottomLeftRadius: K,
	width: K,
	maxWidth: K,
	height: K,
	maxHeight: K,
	top: K,
	right: K,
	bottom: K,
	left: K,
	inset: K,
	insetBlock: K,
	insetBlockStart: K,
	insetBlockEnd: K,
	insetInline: K,
	insetInlineStart: K,
	insetInlineEnd: K,
	padding: K,
	paddingTop: K,
	paddingRight: K,
	paddingBottom: K,
	paddingLeft: K,
	paddingBlock: K,
	paddingBlockStart: K,
	paddingBlockEnd: K,
	paddingInline: K,
	paddingInlineStart: K,
	paddingInlineEnd: K,
	margin: K,
	marginTop: K,
	marginRight: K,
	marginBottom: K,
	marginLeft: K,
	marginBlock: K,
	marginBlockStart: K,
	marginBlockEnd: K,
	marginInline: K,
	marginInlineStart: K,
	marginInlineEnd: K,
	fontSize: K,
	backgroundPositionX: K,
	backgroundPositionY: K,
	rotate: Le,
	pathRotation: Le,
	rotateX: Le,
	rotateY: Le,
	rotateZ: Le,
	scale: Te,
	scaleX: Te,
	scaleY: Te,
	scaleZ: Te,
	skew: Le,
	skewX: Le,
	skewY: Le,
	distance: K,
	translateX: K,
	translateY: K,
	translateZ: K,
	x: K,
	y: K,
	z: K,
	perspective: K,
	transformPerspective: K,
	opacity: we,
	originX: Ve,
	originY: Ve,
	originZ: K,
	zIndex: An,
	fillOpacity: we,
	strokeOpacity: we,
	numOctaves: An
}, Mn = {
	...jn,
	color: Ue,
	backgroundColor: Ue,
	outlineColor: Ue,
	fill: Ue,
	stroke: Ue,
	borderColor: Ue,
	borderTopColor: Ue,
	borderRightColor: Ue,
	borderBottomColor: Ue,
	borderLeftColor: Ue,
	filter: On,
	WebkitFilter: On,
	mask: kn,
	WebkitMask: kn
}, Nn = (e) => Mn[e], Pn = /*@__PURE__*/ new Set([On, kn]);
function Fn(e, t) {
	let n = Nn(e);
	return Pn.has(n) || (n = ct), n.getAnimatableNone ? n.getAnimatableNone(t) : void 0;
}
// node_modules/motion-dom/dist/es/animation/keyframes/utils/fill-wildcards.mjs
function In(e) {
	for (let t = 1; t < e.length; t++) e[t] ?? (e[t] = e[t - 1]);
}
// node_modules/motion-dom/dist/es/render/dom/parse-transform.mjs
var Ln = (e) => e * 180 / Math.PI, Rn = (e) => Bn(Ln(Math.atan2(e[1], e[0]))), zn = {
	x: 4,
	y: 5,
	translateX: 4,
	translateY: 5,
	scaleX: 0,
	scaleY: 3,
	scaleZ: () => 1,
	scale: (e) => (Math.abs(e[0]) + Math.abs(e[3])) / 2,
	rotate: Rn,
	rotateZ: Rn,
	skewX: (e) => Ln(Math.atan(e[1])),
	skewY: (e) => Ln(Math.atan(e[2])),
	skew: (e) => (Math.abs(e[1]) + Math.abs(e[2])) / 2
}, Bn = (e) => (e %= 360, e < 0 && (e += 360), e), Vn = Rn, Hn = (e) => Math.hypot(e[0], e[1]), Un = (e) => Math.hypot(e[4], e[5]), Wn = {
	x: 12,
	y: 13,
	z: 14,
	translateX: 12,
	translateY: 13,
	translateZ: 14,
	scaleX: Hn,
	scaleY: Un,
	scaleZ: (e) => Math.hypot(e[8], e[9], e[10]),
	scale: (e) => (Hn(e) + Un(e)) / 2,
	rotateX: (e) => Bn(Ln(Math.atan2(e[6], e[5]))),
	rotateY: (e) => Bn(Ln(Math.atan2(-e[2], e[0]))),
	rotateZ: Vn,
	rotate: Vn,
	skewX: (e) => Ln(Math.atan(e[4])),
	skewY: (e) => Ln(Math.atan(e[1])),
	skew: (e) => (Math.abs(e[1]) + Math.abs(e[4])) / 2
};
function Gn(e) {
	return +!!e.includes("scale");
}
function Kn(e, t) {
	if (!e || e === "none") return Gn(t);
	let n = e.match(/^matrix3d\(([-\d.e\s,]+)\)$/u), r, i;
	if (n) r = Wn, i = n;
	else {
		let t = e.match(/^matrix\(([-\d.e\s,]+)\)$/u);
		r = zn, i = t;
	}
	if (!i) return Gn(t);
	let a = r[t], o = i[1].split(",").map(Jn);
	return typeof a == "function" ? a(o) : o[a];
}
var qn = (e, t) => {
	let { transform: n = "none" } = getComputedStyle(e);
	return Kn(n, t);
};
function Jn(e) {
	return parseFloat(e.trim());
}
// node_modules/motion-dom/dist/es/render/utils/keys-transform.mjs
var Yn = [
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
], Xn = /* @__PURE__ */ new Set([...Yn, "pathRotation"]), Zn = (e) => e === Ce || e === K, Qn = /* @__PURE__ */ new Set([
	"x",
	"y",
	"z"
]), $n = /* @__PURE__ */ Yn.filter((e) => !Qn.has(e));
function er(e) {
	let t = [];
	return $n.forEach((n) => {
		let r = e.getValue(n);
		if (r !== void 0) {
			let e = r.get(), i = +!!n.startsWith("scale");
			if (e === i) return;
			t.push([n, e]), r.set(i);
		}
	}), t;
}
var tr = /* @__PURE__ */ new Set(["bottom", "right"]);
function nr(e, t, n, r, i, a) {
	let o = parseFloat(e);
	if (!isNaN(o)) return o;
	let { min: s, max: c } = t()[n], l = c - s;
	return a === "border-box" ? l : l - parseFloat(r) - parseFloat(i);
}
var rr = ({ transform: e }) => Kn(e, "x"), ir = ({ transform: e }) => Kn(e, "y"), ar = {
	width: ({ width: e, paddingLeft: t = "0", paddingRight: n = "0", boxSizing: r }, i) => nr(e, i, "x", t, n, r),
	height: ({ height: e, paddingTop: t = "0", paddingBottom: n = "0", boxSizing: r }, i) => nr(e, i, "y", t, n, r),
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
	x: rr,
	y: ir,
	translateX: rr,
	translateY: ir
}, or = /* @__PURE__ */ new Set(), sr = !1, cr = !1, lr = !1;
function ur() {
	if (cr) {
		let e = [], t = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Set();
		or.forEach((r) => {
			r.needsMeasurement && (e.push(r), t.add(r.element), tr.has(r.name) && n.add(r.element));
		});
		let r = /* @__PURE__ */ new Map();
		n.forEach((e) => {
			let t = er(e);
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
	cr = !1, sr = !1, or.forEach((e) => e.complete(lr)), or.clear();
}
function dr() {
	or.forEach((e) => {
		e.readKeyframes(), e.needsMeasurement && (cr = !0);
	});
}
function fr() {
	lr = !0, dr(), ur(), lr = !1;
}
function pr(e, t, n) {
	if (typeof e == "string") {
		if (O(e) || A(e)) return parseFloat(e);
		if (!ct.test(e) && ct.test(n)) return Fn(t, n);
	}
	return e ?? void 0;
}
var mr = class {
	constructor(e, t, n, r, i, a = !1) {
		this.state = "pending", this.isAsync = !1, this.needsMeasurement = !1, this.unresolvedKeyframes = [...e], this.onComplete = t, this.name = n, this.motionValue = r, this.element = i, this.isAsync = a;
	}
	scheduleResolve() {
		this.state = "scheduled", this.isAsync ? (or.add(this), sr || (sr = !0, Nt.read(dr), Nt.resolveKeyframes(ur))) : (this.readKeyframes(), this.complete());
	}
	readKeyframes() {
		let { unresolvedKeyframes: e, name: t, element: n, motionValue: r } = this;
		if (e[0] === null) {
			let i = r?.get(), a = e[e.length - 1];
			if (i !== void 0) e[0] = i;
			else if (n && t) {
				let r = pr(n.readValue(t, a), t, a);
				r !== void 0 && (e[0] = r);
			}
			e[0] === void 0 && (e[0] = a), r && i === void 0 && r.set(e[0]);
		}
		In(e);
	}
	setFinalKeyframe() {}
	measureInitialState() {}
	renderEndStyles() {}
	measureEndState() {}
	complete(e = !1) {
		this.state = "complete", this.onComplete(this.unresolvedKeyframes, this.finalKeyframe, e), or.delete(this);
	}
	cancel() {
		this.state === "scheduled" && (or.delete(this), this.state = "pending");
	}
	resume() {
		this.state === "pending" && this.scheduleResolve();
	}
}, hr = (e) => e.startsWith("--");
// node_modules/motion-dom/dist/es/render/dom/style-set.mjs
function gr(e, t, n) {
	hr(t) ? e.style.setProperty(t, n) : e.style[t] = n;
}
// node_modules/motion-dom/dist/es/utils/supports/flags.mjs
var _r = {};
// node_modules/motion-dom/dist/es/utils/supports/memo.mjs
function vr(e, t) {
	let n = /* @__PURE__ */ j(e);
	return () => _r[t] ?? n();
}
// node_modules/motion-dom/dist/es/utils/supports/scroll-timeline.mjs
var yr = /* @__PURE__ */ vr(() => window.ScrollTimeline !== void 0, "scrollTimeline"), br = /*@__PURE__*/ vr(() => {
	try {
		document.createElement("div").animate({ opacity: 0 }, { easing: "linear(0, 1)" });
	} catch {
		return !1;
	}
	return !0;
}, "linearEasing"), xr = ([e, t, n, r]) => `cubic-bezier(${e}, ${t}, ${n}, ${r})`, Sr = {
	linear: "linear",
	ease: "ease",
	easeIn: "ease-in",
	easeOut: "ease-out",
	easeInOut: "ease-in-out",
	circIn: /*@__PURE__*/ xr([
		0,
		.65,
		.55,
		1
	]),
	circOut: /*@__PURE__*/ xr([
		.55,
		0,
		1,
		.45
	]),
	backIn: /*@__PURE__*/ xr([
		.31,
		.01,
		.66,
		-.59
	]),
	backOut: /*@__PURE__*/ xr([
		.33,
		1.53,
		.69,
		.99
	])
};
// node_modules/motion-dom/dist/es/animation/waapi/easing/map-easing.mjs
function Cr(e, t) {
	if (e) return typeof e == "function" ? br() ? Lt(e, t) : "ease-out" : /* @__PURE__ */ fe(e) ? xr(e) : Array.isArray(e) ? e.map((e) => Cr(e, t) || Sr.easeOut) : Sr[e];
}
// node_modules/motion-dom/dist/es/animation/waapi/start-waapi-animation.mjs
function wr(e, t, n, { delay: r = 0, duration: i = 300, repeat: a = 0, repeatType: o = "loop", ease: s = "easeOut", times: c } = {}, l = void 0) {
	let u = { [t]: n };
	c && (u.offset = c);
	let d = Cr(s, i);
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
function Tr(e) {
	return typeof e == "function" && "applyToOptions" in e;
}
// node_modules/motion-dom/dist/es/animation/waapi/utils/apply-generator.mjs
function Er({ type: e, ...t }) {
	return Tr(e) && br() ? e.applyToOptions(t) : (t.duration ??= 300, t.ease ??= "easeOut", t);
}
// node_modules/motion-dom/dist/es/animation/NativeAnimation.mjs
var Dr = class extends xn {
	constructor(e) {
		if (super(), this.finishedTime = null, this.isStopped = !1, this.manualStartTime = null, !e) return;
		let { element: t, name: n, keyframes: r, pseudoElement: i, allowFlatten: a = !1, finalKeyframe: o, onComplete: s } = e;
		this.isPseudoElement = !!i, this.allowFlatten = a, this.options = e, e.type;
		let c = Er(e);
		this.animation = wr(t, n, r, c, i), c.autoplay === !1 && this.animation.pause(), this.animation.onfinish = () => {
			if (this.finishedTime = this.time, !i) {
				let e = pn(r, this.options, o, this.speed);
				this.updateMotionValue && this.updateMotionValue(e), gr(t, n, e), this.animation.cancel();
			}
			s?.(), this.notifyFinished();
		}, yn(this, e, c);
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
		return /* @__PURE__ */ I(Number(e));
	}
	get iterationDuration() {
		let { delay: e = 0 } = this.options || {};
		return this.duration + /* @__PURE__ */ I(e);
	}
	get time() {
		return /* @__PURE__ */ I(Number(this.animation.currentTime) || 0);
	}
	set time(e) {
		let t = this.finishedTime !== null;
		this.manualStartTime = null, this.finishedTime = null, this.animation.currentTime = /* @__PURE__ */ F(e), t && this.animation.pause();
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
		return this.allowFlatten && this.animation.effect?.updateTiming({ easing: "linear" }), this.animation.onfinish = null, e && yr() ? (this.animation.timeline = e, t?.(this.animation), M) : n(this);
	}
}, Or = {
	anticipate: ce,
	backInOut: se,
	circInOut: ue
};
function kr(e) {
	return e in Or;
}
function Ar(e) {
	typeof e.ease == "string" && kr(e.ease) && (e.ease = Or[e.ease]);
}
var jr = class extends Dr {
	constructor(e) {
		Ar(e), hn(e), super(e), e.startTime !== void 0 && e.autoplay !== !1 && (this.startTime = e.startTime), this.options = e;
	}
	elapsed() {
		return this.state === "running" ? (W.now() - this.startTime) * this.speed : this.time * 1e3;
	}
	sample(e) {
		if (!this.sampler) {
			let { motionValue: e, onUpdate: t, onComplete: n, onPlay: r, onStop: i, element: a, ...o } = this.options;
			this.sampler = new wn({
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
		n && r && gr(n, r, s), t.setWithVelocity(this.sample(a - o * Math.sign(i)), s, o / Math.abs(i || 1));
	}
}, Mr = (e, t) => t !== "zIndex" && !!(typeof e == "number" || Array.isArray(e) || typeof e == "string" && (ct.test(e) || e === "0") && !e.startsWith("url("));
// node_modules/motion-dom/dist/es/animation/utils/can-animate.mjs
function Nr(e) {
	let t = e[0];
	if (e.length === 1) return !0;
	for (let n = 0; n < e.length; n++) if (e[n] !== t) return !0;
}
function Pr(e, t, n, r) {
	let i = e[0];
	if (i === null) return !1;
	if (t === "display" || t === "visibility") return !0;
	let a = e[e.length - 1], o = Mr(i, t), s = Mr(a, t);
	return !o || !s ? (o !== s && `${t}${i}${a}${o ? a : i}`, !1) : Nr(e) || (n === "spring" || Tr(n)) && r;
}
// node_modules/motion-dom/dist/es/animation/utils/make-animation-instant.mjs
function Fr(e) {
	e.duration = 0, e.type = "keyframes";
}
// node_modules/motion-dom/dist/es/animation/waapi/utils/accelerated-values.mjs
var Ir = /* @__PURE__ */ new Set([
	"opacity",
	"clipPath",
	"filter",
	"transform",
	"backgroundColor"
]), Lr = /^(?:oklch|oklab|lab|lch|color|color-mix|light-dark)\(/;
function Rr(e) {
	for (let t = 0; t < e.length; t++) if (typeof e[t] == "string" && Lr.test(e[t])) return !0;
	return !1;
}
// node_modules/motion-dom/dist/es/animation/waapi/supports/waapi.mjs
var zr = /* @__PURE__ */ new Set([
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
]), Br = () => !D.useManualTiming && Object.hasOwnProperty.call(Element.prototype, "animate");
function Vr(e) {
	let { motionValue: t, name: n, repeatDelay: r, repeatType: i, damping: a, type: o, keyframes: s } = e;
	if (!n || !(Ir.has(n) || zr.has(n))) return !1;
	let c = t?.owner?.current;
	if (!(c instanceof HTMLElement) && !(c instanceof SVGElement)) return !1;
	let { onUpdate: l, transformTemplate: u } = t.owner.getProps();
	return Br() && (Ir.has(n) || zr.has(n) && Rr(s)) && (n !== "transform" || !u) && !l && !r && i !== "mirror" && a !== 0 && o !== "inertia";
}
// node_modules/motion-dom/dist/es/value/types/utils/get-as-type.mjs
var Hr = (e, t) => t && typeof e == "number" ? t.transform(e) : e, Ur = {
	x: "translateX",
	y: "translateY",
	z: "translateZ",
	transformPerspective: "perspective"
}, Wr = Yn.length;
function Gr(e, t, n) {
	let r = "", i = !0;
	for (let a = 0; a < Wr; a++) {
		let o = Yn[a], s = e[o];
		if (s === void 0) continue;
		let c = !0;
		if (typeof s == "number") c = s === +!!o.startsWith("scale");
		else {
			let e = parseFloat(s);
			c = o.startsWith("scale") ? e === 1 : e === 0;
		}
		if (!c || n) {
			let e = Hr(s, jn[o]);
			if (!c) {
				i = !1;
				let t = Ur[o] || o;
				r += `${t}(${e}) `;
			}
			n && (t[o] = e);
		}
	}
	let a = e.pathRotation;
	return a && (i = !1, r += `rotate(${Hr(a, jn.pathRotation)}) `), r = r.trim(), n ? r = n(t, i ? "" : r) : i && (r = "none"), r;
}
// node_modules/motion-dom/dist/es/animation/waapi/transforms/groups.mjs
var Kr = /* @__PURE__ */ new WeakMap(), qr = 200, Jr = .001, Yr = .1, Xr = .001, Zr = 100, Qr = (e) => /^(linear|ease(In|Out|InOut))$/.test(e), $r = (e, t) => e - t, ei = (e, t, n) => {
	let r = [];
	for (let i = 0; i <= n; i++) r.push(ft(e, t, i / n));
	return r;
}, ti = (e) => e.motionValue.owner, ni = (e) => Kr.get(e), ri = (e, t) => e.latestValues ? e.latestValues[t] : e.getValue(t)?.get(), ii = ({ name: e, motionValue: t }) => e && Yn.includes(e) && t?.owner?.current instanceof HTMLElement && Br() && br();
function ai(e) {
	let t = ti(e), { onUpdate: n, transformTemplate: r } = t.getProps();
	return !e.isHandoff && !n && !e.hasOnUpdate && !r && e.type !== "inertia" && (ri(t, "transform") || "none") === "none" && !ri(t, "pathRotation") && !t.projection?.isProjecting();
}
var oi = class extends wn {
	constructor(e) {
		let t = ti(e).current, { driver: n = It } = e, r, i = ai(e);
		e.driver = (e) => {
			let i = n(e);
			return {
				js: i,
				now: i.now,
				start: (e = !0) => {
					let n = ni(t);
					!n || n.isJS ? i.start(e) : n.schedule(!1, !e);
				},
				stop: () => {
					i.stop();
					let e = ni(t);
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
		return ni(ti(this.options).current);
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
		return this.isAccelerated() ? this.sampleAt(W.now()) : void 0;
	}
	tween() {
		let { keyframes: e, type: t, ease: n, times: r, repeat: i, delay: a = 0 } = this.options, o = /* @__PURE__ */ fe(n) ? xr(n) : Qr(n) && Sr[n];
		if (o && !i && !r && e.length === 2 && t === cn && this.holdTime === null) {
			let e = this.startTime + a / this.speed;
			return [
				e,
				e + this.resolvedDuration / this.speed,
				o
			];
		}
	}
	boundaries(e, t) {
		let { startTime: n, speed: r, resolvedDuration: i, options: a } = this, { delay: o = 0, repeat: s = 0, repeatDelay: c = 0, repeatType: l, times: u, keyframes: d, type: f } = a, p = (f || cn) === cn ? u || an(d) : [0, 1], m = n + o / r, h = [];
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
		let e = W.now();
		this.options.motionValue.setWithVelocity(this.sampleAt(e - 10, !0), this.sampleAt(e, !0), 10);
	}
	play() {
		this.isStopped || ((this.group || si(ti(this.options))).tracks.add(this), super.play());
	}
	pause() {
		super.pause(), this.isAccelerated() && (this.sync(), this.group.schedule(!1));
	}
	complete() {
		super.complete();
		let { group: e } = this;
		e && !e.isJS && this.canAccelerate && this.tick(W.now());
	}
	get time() {
		return this.isAccelerated() ? /* @__PURE__ */ I(E(0, this.totalDuration, this.at(W.now()) - (this.options.delay || 0))) : super.time;
	}
	set time(e) {
		super.time = e, this.isAccelerated() && this.sync();
	}
	attachTimeline(e) {
		return this.canAccelerate = !1, this.group?.demote(!0), super.attachTimeline(e);
	}
};
function si(e) {
	let t = e.current, n = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Map(), i = {}, a = [], o = /* @__PURE__ */ new Map(), s = [], c = !1, l = !1, u = !1, d = !1, f = -Infinity, p = (e) => {
		for (let t of n) if (t.name === e) return !0;
	}, m = (t, n) => {
		let o = {};
		for (let s of t === void 0 ? Yn : a) {
			let a = r.get(s), c = t === void 0 ? ri(e, s) : a ? a.sampleAt(n > t && !a.timing()[1] ? n : t) : i[s];
			c !== void 0 && (o[s] = c);
		}
		return o;
	}, h = (e, t) => {
		let n = "", r = m(e, t);
		for (let e in r) n += (Ur[e] || e) + "(" + Hr(r[e], jn[e]) + ") ";
		return n || "none";
	}, g = (e = m()) => {
		t.style.transform = Gr(e, {});
	}, _ = (e = !0) => {
		e && g(), s.forEach(({ animation: e }) => e.cancel()), s = [];
	}, v = (e, t, n = Infinity) => {
		let r = {
			animation: e,
			offset: t,
			end: n
		};
		e.startTime = W.now() + t, n < Infinity && (e.onfinish = () => {
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
		let i = Math.min(qr, Math.max(2, Math.ceil((n - t) / 10)));
		if (r.length * 4 > i) return;
		let a = ei(t, n, i).concat(r).sort($r), o = (e) => /* @__PURE__ */ N(t, n, e), s, c;
		for (let t of e) {
			let e = a.map((e) => t.numberAt(e)), [n] = e, r = e.map((e) => e - n), i = r[r.length - 1], o = r.some((e) => Math.abs(e) * Jr > Math.abs(i)) ? 0 : i, l = r.map((e) => o ? e / o : e);
			if (!o) {
				if (l.some((e) => !(Math.abs(e) <= Jr))) return;
			} else if (!s) s = l, c = (e) => (t.numberAt(e) - n) / o;
			else if (l.some((e, t) => !(Math.abs(e - s[t]) <= Jr))) return;
		}
		if (!s || s.every((e, t) => Math.abs(e - o(a[t])) <= Jr)) return "linear";
		let l = [], u = (e, t = c(e)) => l.push(Cn(t) + " " + Cn(o(e) * 100) + "%");
		return s.forEach((e, t) => {
			t && Math.abs(e - s[t - 1]) > .2 && y(c, a[t - 1], a[t]).forEach((e) => u(e)), u(a[t], e);
		}), "linear(" + l + ")";
	}, x = (e, t, n, r) => {
		let i = [t], a = (t, n) => e.every((e) => !(Math.abs(e.numberAt((t + n) / 2) - (e.numberAt(t) + e.numberAt(n)) / 2) > (e.name.startsWith("scale") ? Xr : Yr))), o = (t, n, r) => {
			if (n - t < 1 || a(t, n)) i.push(n);
			else if (r < 4) o(t, (t + n) / 2, r + 1), o((t + n) / 2, n, r + 1);
			else {
				for (let r of e) i.push(...y((e) => r.numberAt(e), t, n));
				i.push(n);
			}
		}, s = ei(t, n, Math.ceil((n - t) / 100));
		for (let e of r) s.push(e, Math.min(e + .01, n));
		let c = t;
		for (let e of s.sort($r)) e > c && o(c, e, 0), c = e;
		return i.sort($r);
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
		return c || (d.offset = l.map((e) => /* @__PURE__ */ N(n, r, e))), u.every((e) => e === u[0]) && (g(m(n, a)), d = null), t.animate(d, {
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
		i = {}, a = Yn.filter((t) => {
			if (r.has(t)) return !0;
			let n = i[t] = ri(e, t);
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
	}, E = () => !n.size && (u = !0, ni(t) === O && Kr.delete(t), O.isJS || _(), !0), D = () => {
		let t = W.now();
		if (O.isJS || (O.isFinishing = !0, n.forEach((n) => {
			let [r, a] = n.timing();
			n.state === "running" && n.speed > 0 && !a && r <= t + 1 && (n.complete(), i[n.name] = ri(e, n.name), o.has(n) || (c = !0));
		}), O.isFinishing = !1), l = !1, u || (n.forEach(({ state: e }, t) => {
			(e === "idle" || e === "finished") && n.delete(t);
		}), E())) return;
		for (let e of n) if (!e.canAccelerate) return O.demote(!0);
		O.isJS && (O.isJS = !1, c = !0, n.forEach((e) => e.js?.stop()));
		let r = c, a = d;
		if (c = d = !1, r || !T(t)) {
			if (a) {
				if (t - f < Zr) return O.demote();
				f = t;
			}
			if (!w(t)) return O.demote();
		}
	}, O = {
		tracks: n,
		isJS: !1,
		isFinishing: !1,
		schedule(e, t) {
			u || (c ||= e, d ||= !!t, l || (l = !0, H.isProcessing ? Nt.render(D, !1, !0) : queueMicrotask(D)));
		},
		release(e) {
			let { state: t } = e;
			(t === "idle" || t === "finished") && n.delete(e), E() || O.schedule(!0);
		},
		check() {
			if (!O.isJS) {
				for (let t in i) if (ri(e, t) !== i[t] && !p(t)) return O.schedule(!0, !0);
			}
		},
		demote(e) {
			O.isJS || u || (n.forEach((t) => {
				t.isAccelerated() && t.sync(), e || (t.canAccelerate = !1);
			}), O.isJS = !0, o = /* @__PURE__ */ new Map(), _(), n.forEach((e) => e.state === "running" && e.js?.start()));
		}
	};
	return Kr.set(t, O), O;
}
// node_modules/motion-dom/dist/es/animation/AsyncMotionValueAnimation.mjs
var ci = class extends xn {
	constructor(e) {
		super(), this.stop = () => {
			this._animation && (this._animation.stop(), this.stopTimeline?.()), this.keyframeResolver?.cancel();
		}, this.createdAt = W.now();
		let { keyframes: t, name: n, motionValue: r, element: i } = e, a = e;
		a.autoplay ??= !0, a.delay ??= 0, a.type ??= "keyframes", a.repeat ??= 0, a.repeatDelay ??= 0, a.repeatType ??= "loop";
		let o = i?.KeyframeResolver || mr;
		this.keyframeResolver = new o(t, (e, t, n) => this.onKeyframesResolved(e, t, a, !n), n, r, i), this.keyframeResolver?.scheduleResolve();
	}
	onKeyframesResolved(e, t, n, r) {
		this.keyframeResolver = void 0;
		let { name: i, type: a, velocity: o, delay: s, isHandoff: c, onUpdate: l } = n;
		this.resolvedAt = W.now();
		let u = !0;
		Pr(e, i, a, o) || (u = !1, (D.instantAnimations || !s) && l?.(pn(e, n, t)), e[0] = e[e.length - 1], Fr(n), n.repeat = 0);
		let { onComplete: d } = n;
		n.finalKeyframe = t, n.keyframes = e, n.onComplete = () => {
			d?.(), this.notifyFinished();
		};
		let f = u && !c && Vr(n), p = !f && ii(n);
		r && (f || p || this.resolvedAt !== this.createdAt) && (n.startTime ??= _n(this.createdAt, this.resolvedAt));
		let m;
		if (f) {
			n.element = n.motionValue?.owner?.current;
			try {
				m = new jr(n);
			} catch {
				m = new wn(n);
			}
		} else m = p ? new oi(n) : new wn(n);
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
		return this._animation || (this.keyframeResolver?.resume(), fr()), this._animation;
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
function li(e, t, n, r = 0, i = 1) {
	let a = Array.from(e).sort((e, t) => e.sortNodePosition(t)).indexOf(t), o = e.size, s = (o - 1) * r;
	return typeof n == "function" ? n(a, o) : i === 1 ? a * r : s - a * r;
}
// node_modules/motion-dom/dist/es/value/index.mjs
var ui = 30, di = (e) => !isNaN(parseFloat(e)), fi = { current: void 0 }, pi = class {
	constructor(e, t = {}) {
		this.canTrackVelocity = null, this.events = {}, this.updateAndNotify = (e) => {
			let t = W.now();
			if (this.updatedAt !== t && this.setPrevFrameValue(), this.prev = this.current, this.setCurrent(e), this.current !== this.prev && (this.notifyChange(), this.dependents)) for (let e of this.dependents) e.dirty();
		}, this.hasAnimated = !1, this.setCurrent(e), this.owner = t.owner;
	}
	setCurrent(e) {
		this.current = e, this.updatedAt = W.now(), this.canTrackVelocity === null && e !== void 0 && (this.canTrackVelocity = di(this.current));
	}
	setPrevFrameValue(e = this.current) {
		this.prevFrameValue = e, this.prevUpdatedAt = this.updatedAt;
	}
	onChange(e) {
		return this.on("change", e);
	}
	on(e, t) {
		var n;
		return e === "change" ? this.onChangeSubscribe(t) : ((n = this.events)[e] || (n[e] = new P())).add(t);
	}
	onChangeSubscribe(e) {
		let { events: t } = this;
		return !t.change && !this.changeSubscriber ? this.changeSubscriber = e : (t.change || (t.change = new P(), t.change.add(this.changeSubscriber), this.changeSubscriber = void 0), t.change.add(e)), () => {
			this.changeSubscriber === e ? this.changeSubscriber = void 0 : t.change?.remove(e), this.stopIfUnobserved();
		};
	}
	stopIfUnobserved() {
		Nt.read(() => {
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
		fi.current && fi.current.push(this);
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
		let e = W.now();
		if (!this.canTrackVelocity || this.prevFrameValue === void 0 || e - this.updatedAt > ui) return 0;
		let t = Math.min(this.updatedAt - this.prevUpdatedAt, ui);
		return /* @__PURE__ */ te(parseFloat(this.current) - parseFloat(this.prevFrameValue), t);
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
function mi(e, t) {
	return new pi(e, t);
}
// node_modules/motion-dom/dist/es/animation/utils/resolve-transition.mjs
function hi(e, t) {
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
function gi(e, t) {
	let n = e?.[t] ?? e?.default ?? e;
	return n === e ? n : hi(n, e);
}
// node_modules/motion-dom/dist/es/animation/utils/default-transitions.mjs
var _i = {
	type: "spring",
	stiffness: 500,
	damping: 25,
	restSpeed: 10
}, vi = (e) => ({
	type: "spring",
	stiffness: 550,
	damping: e === 0 ? 2 * Math.sqrt(550) : 30,
	restSpeed: 10
}), yi = {
	type: "keyframes",
	duration: .8
}, bi = {
	type: "keyframes",
	ease: [
		.25,
		.1,
		.35,
		1
	],
	duration: .3
}, xi = (e, { keyframes: t }) => t.length > 2 ? yi : Xn.has(e) ? e.startsWith("scale") ? vi(t[1]) : _i : bi, Si = /* @__PURE__ */ new Set([
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
function Ci(e) {
	for (let t in e) if (!Si.has(t)) return !0;
	return !1;
}
// node_modules/motion-dom/dist/es/animation/interfaces/motion-value.mjs
var wi = (e, t, n, r = {}, i, a) => (o) => {
	let s = gi(r, e) || {}, c = s.delay || r.delay || 0, { elapsed: l = 0 } = r;
	l -= /* @__PURE__ */ F(c);
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
	Ci(s) || Object.assign(u, xi(e, u)), u.duration &&= /* @__PURE__ */ F(u.duration), u.repeatDelay &&= /* @__PURE__ */ F(u.repeatDelay), u.from !== void 0 && (u.keyframes[0] = u.from);
	let d = !1;
	if ((u.type === !1 || u.duration === 0 && !u.repeatDelay) && (Fr(u), u.delay === 0 && (d = !0)), (D.instantAnimations || D.skipAnimations || i?.shouldSkipAnimations || s.skipAnimations) && (d = !0, Fr(u), u.delay = 0), u.allowFlatten = !s.type && !s.ease, d && !a && t.get() !== void 0) {
		let e = pn(u.keyframes, s);
		if (e !== void 0) {
			Nt.update(() => {
				u.onUpdate(e), u.onComplete();
			});
			return;
		}
	}
	return s.isSync ? new wn(u) : new ci(u);
}, Ti = /^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u;
function Ei(e) {
	let t = Ti.exec(e);
	if (!t) return [,];
	let [, n, r, i] = t;
	return [`--${n ?? r}`, i];
}
function Di(e, t, n = 1) {
	`${e}`;
	let [r, i] = Ei(e);
	if (!r) return;
	let a = window.getComputedStyle(t).getPropertyValue(r);
	if (a) {
		let e = a.trim();
		return O(e) ? parseFloat(e) : e;
	}
	return be(i) ? Di(i, t, n + 1) : i;
}
// node_modules/motion-dom/dist/es/render/utils/resolve-variants.mjs
function Oi(e) {
	let t = [{}, {}];
	return e?.values.forEach((e, n) => {
		t[0][n] = e.get(), t[1][n] = e.getVelocity();
	}), t;
}
function ki(e, t, n, r) {
	let i = (t) => typeof t == "function" ? t(n === void 0 ? e.custom : n, ...Oi(r)) : t;
	return t = i(t), typeof t == "string" && (t = e.variants && e.variants[t]), i(t);
}
// node_modules/motion-dom/dist/es/render/utils/resolve-dynamic-variants.mjs
function Ai(e, t, n) {
	return ki(e.getProps(), t, n, e);
}
var ji = (e, t) => t === "exit" ? e.presenceContext?.custom : void 0, Mi = /* @__PURE__ */ new Set([
	"width",
	"height",
	"top",
	"left",
	"right",
	"bottom",
	...Yn
]), Ni = (e) => Array.isArray(e);
// node_modules/motion-dom/dist/es/render/utils/setters.mjs
function Pi(e, t, n) {
	e.hasValue(t) ? e.getValue(t).set(n) : e.addValue(t, mi(n));
}
function Fi(e) {
	return Ni(e) ? e[e.length - 1] || 0 : e;
}
function Ii(e, t) {
	let { transitionEnd: n = {}, transition: r = {}, ...i } = Ai(e, t) || {};
	i = {
		...i,
		...n
	};
	for (let t in i) Pi(e, t, Fi(i[t]));
}
// node_modules/motion-dom/dist/es/value/utils/is-motion-value.mjs
var Li = (e) => !!(e && e.getVelocity);
// node_modules/motion-dom/dist/es/value/will-change/is.mjs
function Ri(e) {
	return !!(Li(e) && e.add);
}
// node_modules/motion-dom/dist/es/value/will-change/add-will-change.mjs
function zi(e, t) {
	let n = e.getValue("willChange");
	if (Ri(n)) return n.add(t);
	if (!n && D.WillChange) {
		let n = new D.WillChange("auto");
		e.addValue("willChange", n), n.add(t);
	}
}
// node_modules/motion-dom/dist/es/animation/optimized-appear/data-id.mjs
var Bi = "data-framer-appear-id";
// node_modules/motion-dom/dist/es/animation/optimized-appear/get-appear-id.mjs
function Vi(e) {
	return e.props[Bi];
}
// node_modules/motion-dom/dist/es/animation/interfaces/visual-element-target.mjs
var Hi = typeof window < "u";
function Ui({ protectedKeys: e, needsAnimating: t }, n) {
	let r = n in e && !t[n];
	return t[n] = !1, r;
}
function Wi(e, t, { delay: n = 0, transitionOverride: r, type: i } = {}) {
	let { transition: a, transitionEnd: o, ...s } = t, c = e.getDefaultTransition();
	a = a ? hi(a, c) : c;
	let l = a?.reduceMotion, u = a?.skipAnimations;
	r && (a = r);
	let d = [], f = i && e.animationState?.getState()[i], p = a?.path;
	p && (p.animateValues ? p.animateValues((t) => e.getValue(t, e.latestValues[t] ?? 0), s, a, n, d) : p.animateVisualElement?.(e, s, a, n, d));
	for (let t in s) {
		let r = e.getValue(t, e.latestValues[t] ?? null), i = s[t];
		if (i === void 0 || f && Ui(f, t)) continue;
		let o = {
			delay: n,
			...gi(a || {}, t)
		};
		u && (o.skipAnimations = !0);
		let c = r.get();
		if (c !== void 0 && !r.isAnimating() && !Array.isArray(i) && i === c && !o.velocity) {
			Nt.update(() => r.set(i));
			continue;
		}
		let p = !1;
		if (Hi && window.MotionHandoffAnimation) {
			let n = Vi(e);
			if (n) {
				let e = window.MotionHandoffAnimation(n, t, Nt);
				e !== null && (o.startTime = e, p = !0);
			}
		}
		zi(e, t);
		let m = l ?? e.shouldReduceMotion;
		r.start(wi(t, r, i, m && Mi.has(t) ? { type: !1 } : o, e, p));
		let h = r.animation;
		h && d.push(h);
	}
	if (o) {
		let t = () => Nt.update(() => {
			o && Ii(e, o);
		});
		d.length ? Promise.all(d).then(t) : t();
	}
	return d;
}
// node_modules/motion-dom/dist/es/animation/interfaces/visual-element-variant.mjs
function Gi(e, t, n = {}) {
	let r = Ai(e, t, ji(e, n.type)), i = n.transitionOverride || (r?.transition ?? (e.getDefaultTransition() || {})), a = () => Promise.all(r ? Wi(e, r, n) : []), o = (r = 0) => {
		let { variantChildren: a } = e, { delayChildren: o = 0, staggerChildren: s, staggerDirection: c } = i, l = [];
		return a?.forEach((e) => {
			e.notify("AnimationStart", t), l.push(Gi(e, t, {
				...n,
				delay: r + (typeof o == "function" ? 0 : o) + li(a, e, o, s, c)
			}).then(() => e.notify("AnimationComplete", t)));
		}), Promise.all(l);
	}, { when: s } = i;
	return s ? s === "beforeChildren" ? a().then(() => o()) : o().then(a) : Promise.all([a(), o(n.delay)]);
}
// node_modules/motion-dom/dist/es/animation/interfaces/visual-element.mjs
function Ki(e, t, n = {}) {
	return e.notify("AnimationStart", t), (Array.isArray(t) ? Promise.all(t.map((t) => Gi(e, t, n))) : typeof t == "string" ? Gi(e, t, n) : Promise.all(Wi(e, Ai(e, t, n.custom), n))).then(() => {
		e.notify("AnimationComplete", t);
	});
}
// node_modules/motion-dom/dist/es/value/types/auto.mjs
var qi = {
	test: (e) => e === "auto",
	parse: (e) => e
}, Ji = (e) => (t) => t.test(e), Yi = [
	Ce,
	K,
	Re,
	Le,
	Be,
	ze,
	qi
], Xi = (e) => Yi.find(Ji(e));
// node_modules/motion-dom/dist/es/animation/keyframes/utils/is-none.mjs
function Zi(e) {
	return typeof e == "number" ? e === 0 : e === null || e === "none" || e === "0" || A(e);
}
// node_modules/motion-dom/dist/es/animation/keyframes/utils/make-none-animatable.mjs
var q = /* @__PURE__ */ new Set([
	"auto",
	"none",
	"0"
]);
function Qi(e, t, n) {
	let r = 0, i;
	for (; r < e.length && !i;) {
		let t = e[r];
		typeof t == "string" && !q.has(t) && et(t) && (i = e[r]), r++;
	}
	if (i && n) for (let r of t) e[r] !== i && (e[r] = Fn(n, i));
}
// node_modules/motion-dom/dist/es/animation/keyframes/DOMKeyframesResolver.mjs
var $i = class extends mr {
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
		for (let t = 0; t < e.length; t++) if (Se(t ? e[t] : r)) return !1;
		return !0;
	}
	readKeyframes() {
		let { unresolvedKeyframes: e, element: t, name: n } = this;
		if (!t || !t.current) return;
		super.readKeyframes();
		for (let n = 0; n < e.length; n++) {
			let r = e[n];
			if (typeof r == "string" && (r = r.trim(), be(r))) {
				let i = Di(r, t.current);
				i !== void 0 && (e[n] = i), n === e.length - 1 && (this.finalKeyframe = r);
			}
		}
		if (this.resolveNoneKeyframes(), !Mi.has(n) || e.length !== 2) return;
		let [r, i] = e;
		if (typeof r == "number" && typeof i == "number") return;
		let a = Xi(r), o = Xi(i);
		if (Se(r) !== Se(i) && ar[n]) this.needsMeasurement = !0;
		else if (a !== o) {
			if (Zn(a) && Zn(o)) for (let t = 0; t < e.length; t++) {
				let n = e[t];
				typeof n == "string" && (e[t] = parseFloat(n));
			}
			else ar[n] && (this.needsMeasurement = !0);
		}
	}
	resolveNoneKeyframes() {
		let { unresolvedKeyframes: e, name: t } = this, n = [];
		for (let t = 0; t < e.length; t++) (e[t] === null || Zi(e[t])) && n.push(t);
		n.length && Qi(e, n, t);
	}
	measure() {
		let { element: e, name: t } = this;
		return ar[t](window.getComputedStyle(e.current), () => e.measureViewportBox());
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
}, ea = [
	"borderTopLeftRadius",
	"borderTopRightRadius",
	"borderBottomRightRadius",
	"borderBottomLeftRadius"
];
// node_modules/motion-dom/dist/es/utils/is-html-element.mjs
function ta(e) {
	return k(e) && "offsetHeight" in e && !("ownerSVGElement" in e);
}
// node_modules/motion-dom/dist/es/utils/is-svg-element.mjs
function na(e) {
	return k(e) && "ownerSVGElement" in e;
}
// node_modules/motion-dom/dist/es/scope/active.mjs
var ra = {};
function ia(e) {
	return ra.current?.add(e), e;
}
var aa = (e) => ra.current ? ra.current.bind(e) : e;
// node_modules/motion-dom/dist/es/utils/resolve-elements.mjs
function oa(e, t, n) {
	if (e == null) return [];
	if (e instanceof EventTarget) return [e];
	if (typeof e == "string") {
		let r = t ? t.current : ra.current?.root || document, i = n?.[e] ?? r.querySelectorAll(e);
		return i ? Array.from(i) : [];
	}
	return Array.from(e).filter((e) => e != null);
}
// node_modules/motion-dom/dist/es/render/dom/utils/camel-to-dash.mjs
function sa(e) {
	return e.replace(/([A-Z])/g, (e) => `-${e.toLowerCase()}`);
}
// node_modules/motion-dom/dist/es/render/html/utils/build-styles.mjs
function ca(e, t, n) {
	let { style: r, vars: i, transformOrigin: a } = e, o = !1, s = !1;
	for (let e in t) {
		let n = t[e];
		if (Xn.has(e)) o = !0;
		else if (ve(e)) i[e] = n;
		else {
			let t = Hr(n, jn[e]);
			e.startsWith("origin") ? (s = !0, a[e] = t) : r[e] = t;
		}
	}
	if (t.transform || (o || n ? r.transform = Gr(t, e.transform, n) : r.transform &&= "none"), s) {
		let { originX: e = "50%", originY: t = "50%", originZ: n = 0 } = a;
		r.transformOrigin = `${e} ${t} ${n}`;
	}
}
// node_modules/motion-dom/dist/es/render/svg/utils/path.mjs
var la = {
	offset: "stroke-dashoffset",
	array: "stroke-dasharray"
}, ua = {
	offset: "strokeDashoffset",
	array: "strokeDasharray"
};
function da(e, t, n = 1, r = 0, i = !0) {
	e.pathLength = 1;
	let a = i ? la : ua;
	e[a.offset] = `${-r}`, e[a.array] = `${t} ${n}`;
}
// node_modules/motion-dom/dist/es/render/svg/utils/build-attrs.mjs
var fa = [
	"transform",
	"opacity",
	"clipPath",
	"filter",
	"offsetDistance",
	"offsetPath",
	"offsetRotate",
	"offsetAnchor"
];
function pa(e, { attrX: t, attrY: n, attrScale: r, pathLength: i, pathSpacing: a = 1, pathOffset: o = 0, ...s }, c, l, u) {
	if (ca(e, s, l), c) {
		e.style.viewBox && (e.attrs.viewBox = e.style.viewBox);
		return;
	}
	e.attrs = e.style, e.style = {};
	let { attrs: d, style: f } = e;
	for (let e of fa) d[e] !== void 0 && (f[e] = d[e], delete d[e]);
	(f.transform || d.transformOrigin) && (f.transformOrigin = d.transformOrigin ?? "50% 50%", delete d.transformOrigin), f.transform && (f.transformBox = u?.transformBox ?? "fill-box", delete d.transformBox), t !== void 0 && (d.x = t), n !== void 0 && (d.y = n), r !== void 0 && (d.scale = r), i !== void 0 && da(d, i, a, o, !1);
}
// node_modules/motion-dom/dist/es/projection/geometry/conversion.mjs
function ma({ top: e, left: t, right: n, bottom: r }) {
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
function ha({ x: e, y: t }) {
	return {
		top: t.min,
		right: e.max,
		bottom: t.max,
		left: e.min
	};
}
function ga(e, t) {
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
function _a(e) {
	return e === void 0 || e === 1;
}
function va({ scale: e, scaleX: t, scaleY: n }) {
	return !_a(e) || !_a(t) || !_a(n);
}
function ya(e) {
	return va(e) || ba(e) || e.z || e.rotate || e.rotateX || e.rotateY || e.rotateZ || e.skewX || e.skewY;
}
function ba(e) {
	return xa(e.x) || xa(e.y);
}
function xa(e) {
	return e && e !== "0%";
}
// node_modules/motion-dom/dist/es/projection/geometry/delta-apply.mjs
function Sa(e, t, n) {
	return n + t * (e - n);
}
function Ca(e, t, n, r, i) {
	return i !== void 0 && (e = Sa(e, i, r)), Sa(e, n, r) + t;
}
function wa(e, t = 0, n = 1, r, i) {
	e.min = Ca(e.min, t, n, r, i), e.max = Ca(e.max, t, n, r, i);
}
function Ta(e, { x: t, y: n }) {
	wa(e.x, t.translate, t.scale, t.originPoint), wa(e.y, n.translate, n.scale, n.originPoint);
}
var Ea = .999999999999, Da = 1.0000000000001;
function Oa(e, t, n, r = !1) {
	let i = n.length;
	if (!i) return;
	t.x = t.y = 1;
	let a, o;
	for (let s = 0; s < i; s++) {
		a = n[s], o = a.projectionDelta;
		let { visualElement: i } = a.options;
		i && i.props.style && i.props.style.display === "contents" || (r && a.options.layoutScroll && a.scroll && a !== a.root && (ka(e.x, -a.scroll.offset.x), ka(e.y, -a.scroll.offset.y)), o && (t.x *= o.x.scale, t.y *= o.y.scale, Ta(e, o)), r && ya(a.latestValues) && Ma(e, a.latestValues, a.layout?.layoutBox));
	}
	t.x < Da && t.x > Ea && (t.x = 1), t.y < Da && t.y > Ea && (t.y = 1);
}
function ka(e, t) {
	e.min += t, e.max += t;
}
function Aa(e, t, n, r, i = .5) {
	wa(e, t, n, ft(e.min, e.max, i), r);
}
function ja(e, t) {
	return typeof e == "string" ? parseFloat(e) / 100 * (t.max - t.min) : e;
}
function Ma(e, t, n) {
	let r = n ?? e;
	Aa(e.x, ja(t.x, r.x), t.scaleX, t.scale, t.originX), Aa(e.y, ja(t.y, r.y), t.scaleY, t.scale, t.originY);
}
// node_modules/motion-dom/dist/es/projection/utils/measure.mjs
function Na(e, t) {
	return ma(ga(e.getBoundingClientRect(), t));
}
function Pa(e, t, n) {
	let r = Na(e, n), { scroll: i } = t;
	return i && (ka(r.x, i.offset.x), ka(r.y, i.offset.y)), r;
}
// node_modules/motion-dom/dist/es/frameloop/microtask.mjs
var { schedule: Fa, cancel: Ia } = /* @__PURE__ */ Mt(queueMicrotask, !1);
// node_modules/motion-dom/dist/es/animation/animate/single-value.mjs
function La(e, t, n) {
	let r = Li(e) ? e : mi(e);
	return r.start(wi("", r, t, n)), r.animation;
}
// node_modules/motion-dom/dist/es/projection/styles/scale-correction.mjs
var Ra = {}, za = {
	value: null,
	addProjectionMetrics: null
};
// node_modules/motion-dom/dist/es/utils/delay.mjs
function Ba(e, t) {
	let n = W.now();
	e = aa(e);
	let r = ({ timestamp: i }) => {
		let a = i - n;
		a >= t && (Pt(r), e(a - t));
	};
	return Nt.setup(r, !0), ia(() => Pt(r));
}
// node_modules/motion-dom/dist/es/utils/is-svg-svg-element.mjs
function Va(e) {
	return na(e) && e.tagName === "svg";
}
// node_modules/motion-dom/dist/es/value/utils/resolve-motion-value.mjs
function Ha(e) {
	return Li(e) ? e.get() : e;
}
// node_modules/motion-dom/dist/es/value/utils/as-number.mjs
var Ua = (e) => typeof e == "number" ? e : parseFloat(e), Wa = ea.length, Ga = [
	"rotate",
	"rotateX",
	"rotateY",
	"rotateZ",
	"skewX",
	"skewY"
], Ka = Ga.length, qa = (e) => typeof e == "number" || K.test(e);
function Ja(e, t, n, r, i, a) {
	i ? (e.opacity = ft(0, n.opacity ?? 1, Xa(r)), e.opacityExit = ft(t.opacity ?? 1, 0, Za(r))) : a && (e.opacity = ft(t.opacity ?? 1, n.opacity ?? 1, r));
	for (let i = 0; i < Wa; i++) {
		let a = ea[i], o = Ya(t, a), s = Ya(n, a);
		(o !== void 0 || s !== void 0) && (o ||= 0, s ||= 0, o === 0 || s === 0 || qa(o) === qa(s) ? (e[a] = Math.max(ft(Ua(o), Ua(s), r), 0), (Re.test(s) || Re.test(o)) && (e[a] += "%")) : e[a] = s);
	}
	for (let i = 0; i < Ka; i++) {
		let a = Ga[i];
		(t[a] || n[a]) && (e[a] = ft(t[a] || 0, n[a] || 0, r));
	}
}
function Ya(e, t) {
	return e[t] === void 0 ? e.borderRadius : e[t];
}
var Xa = /*@__PURE__*/ Qa(0, .5, le), Za = /*@__PURE__*/ Qa(.5, .95, M);
function Qa(e, t, n) {
	return (r) => r < e ? 0 : r > t ? 1 : n(/* @__PURE__ */ N(e, t, r));
}
// node_modules/motion-dom/dist/es/projection/geometry/copy.mjs
function $a(e, t) {
	e.min = t.min, e.max = t.max;
}
function eo(e, t) {
	$a(e.x, t.x), $a(e.y, t.y);
}
function to(e, t) {
	e.translate = t.translate, e.scale = t.scale, e.originPoint = t.originPoint, e.origin = t.origin;
}
// node_modules/motion-dom/dist/es/projection/geometry/delta-calc.mjs
var no = .9999, ro = 1.0001, io = -.01, ao = .01;
function oo(e) {
	return e.max - e.min;
}
function so(e, t, n) {
	return Math.abs(e - t) <= n;
}
function co(e, t, n, r = .5) {
	e.origin = r, e.originPoint = ft(t.min, t.max, e.origin), e.scale = oo(n) / oo(t), e.translate = ft(n.min, n.max, e.origin) - e.originPoint, (e.scale >= no && e.scale <= ro || isNaN(e.scale)) && (e.scale = 1), (e.translate >= io && e.translate <= ao || isNaN(e.translate)) && (e.translate = 0);
}
function lo(e, t, n, r) {
	co(e.x, t.x, n.x, r ? r.originX : void 0), co(e.y, t.y, n.y, r ? r.originY : void 0);
}
function uo(e, t, n, r = 0) {
	e.min = (r ? ft(n.min, n.max, r) : n.min) + t.min, e.max = e.min + oo(t);
}
function fo(e, t, n, r) {
	uo(e.x, t.x, n.x, r?.x), uo(e.y, t.y, n.y, r?.y);
}
function po(e, t, n, r = 0) {
	let i = r ? ft(n.min, n.max, r) : n.min;
	e.min = t.min - i, e.max = e.min + oo(t);
}
function mo(e, t, n, r) {
	po(e.x, t.x, n.x, r?.x), po(e.y, t.y, n.y, r?.y);
}
// node_modules/motion-dom/dist/es/projection/geometry/delta-remove.mjs
function ho(e, t, n, r, i) {
	return e -= t, e = Sa(e, 1 / n, r), i !== void 0 && (e = Sa(e, 1 / i, r)), e;
}
function go(e, t = 0, n = 1, r = .5, i, a = e, o = e) {
	if (Re.test(t) && (t = parseFloat(t), t = ft(o.min, o.max, t / 100) - o.min), typeof t != "number") return;
	let s = ft(a.min, a.max, r);
	e === a && (s -= t), e.min = ho(e.min, t, n, s, i), e.max = ho(e.max, t, n, s, i);
}
function _o(e, t, [n, r, i], a, o) {
	go(e, t[n], t[r], t[i], t.scale, a, o);
}
var vo = [
	"x",
	"scaleX",
	"originX"
], yo = [
	"y",
	"scaleY",
	"originY"
];
function bo(e, t, n, r) {
	_o(e.x, t, vo, n ? n.x : void 0, r ? r.x : void 0), _o(e.y, t, yo, n ? n.y : void 0, r ? r.y : void 0);
}
// node_modules/motion-dom/dist/es/projection/geometry/models.mjs
var xo = () => ({
	translate: 0,
	scale: 1,
	origin: 0,
	originPoint: 0
}), So = () => ({
	x: xo(),
	y: xo()
}), Co = () => ({
	min: 0,
	max: 0
}), wo = () => ({
	x: Co(),
	y: Co()
});
// node_modules/motion-dom/dist/es/projection/geometry/utils.mjs
function To(e) {
	return e.translate === 0 && e.scale === 1;
}
function Eo(e) {
	return To(e.x) && To(e.y);
}
function Do(e, t) {
	return e.min === t.min && e.max === t.max;
}
function Oo(e, t) {
	return Do(e.x, t.x) && Do(e.y, t.y);
}
function ko(e, t) {
	return Math.round(e.min) === Math.round(t.min) && Math.round(e.max) === Math.round(t.max);
}
function Ao(e, t) {
	return ko(e.x, t.x) && ko(e.y, t.y);
}
function jo(e) {
	return oo(e.x) / oo(e.y);
}
function Mo(e, t) {
	return e.translate === t.translate && e.scale === t.scale && e.originPoint === t.originPoint;
}
// node_modules/motion-dom/dist/es/projection/shared/stack.mjs
var No = class {
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
function Po(e, t) {
	return t.max === t.min ? 0 : e / (t.max - t.min) * 100;
}
var Fo = { correct: (e, t) => {
	if (!t.target) return e;
	if (typeof e == "string") {
		if (K.test(e)) e = parseFloat(e);
		else return e;
	}
	return `${Po(e, t.target.x)}% ${Po(e, t.target.y)}%`;
} }, J = {
	borderRadius: /* @__PURE__ */ Object.assign({}, Fo, { applyTo: /* @__PURE__ */ ea.slice() }),
	borderTopLeftRadius: Fo,
	borderTopRightRadius: Fo,
	borderBottomLeftRadius: Fo,
	borderBottomRightRadius: Fo,
	boxShadow: { correct: (e, { treeScale: t, projectionDelta: n }) => {
		let r = e, i = ct.parse(e);
		if (i.length > 5) return r;
		let a = ct.createTransformer(e), o = typeof i[0] == "number" ? 0 : 1, s = n.x.scale * t.x, c = n.y.scale * t.y;
		i[0 + o] /= s, i[1 + o] /= c;
		let l = ft(s, c, .5);
		return typeof i[2 + o] == "number" && (i[2 + o] /= l), typeof i[3 + o] == "number" && (i[3 + o] /= l), a(i);
	} }
};
// node_modules/motion-dom/dist/es/projection/styles/transform.mjs
function Io(e, t, n) {
	let r = "", i = e.x.translate / t.x, a = e.y.translate / t.y, o = n?.z || 0;
	if ((i || a || o) && (r = `translate3d(${i}px, ${a}px, ${o}px) `), (t.x !== 1 || t.y !== 1) && (r += `scale(${1 / t.x}, ${1 / t.y}) `), n) {
		let { transformPerspective: e, rotate: t, pathRotation: i, rotateX: a, rotateY: o, rotateZ: s, skewX: c, skewY: l } = n;
		e && (r = `perspective(${e}px) ${r}`), t && (r += `rotate(${t}deg) `), i && (r += `rotate(${i}deg) `), a && (r += `rotateX(${a}deg) `), o && (r += `rotateY(${o}deg) `), s && (r += `rotateZ(${s}deg) `), c && (r += `skewX(${c}deg) `), l && (r += `skewY(${l}deg) `);
	}
	let s = e.x.scale * t.x, c = e.y.scale * t.y;
	return (s !== 1 || c !== 1) && (r += `scale(${s}, ${c})`), r || "none";
}
// node_modules/motion-dom/dist/es/projection/utils/each-axis.mjs
function Lo(e) {
	return [e("x"), e("y")];
}
// node_modules/motion-dom/dist/es/projection/utils/compare-by-depth.mjs
var Ro = (e, t) => e.depth - t.depth, zo = class {
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
		this.isDirty && this.children.sort(Ro), this.isDirty = !1, this.children.forEach(e);
	}
}, Bo = {
	hasAnimatedSinceResize: !0,
	hasEverUpdated: !1
}, Vo = {
	nodes: 0,
	calculatedTargetDeltas: 0,
	calculatedProjections: 0
}, Ho = [
	"",
	"X",
	"Y",
	"Z"
], Uo = 1e3, Wo = 0;
function Go(e, t, n, r) {
	let { latestValues: i } = t;
	i[e] && (n[e] = i[e], t.setStaticValue(e, 0), r && (r[e] = 0));
}
var Ko = ({ instance: e }) => e && Kr.get(e)?.demote();
function qo(e) {
	if (e.hasCheckedOptimisedAppear = !0, e.root === e) return;
	let { visualElement: t } = e.options;
	if (!t) return;
	let n = Vi(t);
	if (window.MotionHasOptimisedAnimation(n, "transform")) {
		let { layout: t, layoutId: r } = e.options;
		window.MotionCancelOptimisedAnimation(n, "transform", Nt, !(t || r));
	}
	let { parent: r } = e;
	r && !r.hasCheckedOptimisedAppear && qo(r);
}
function Jo({ attachResizeListener: e, defaultParent: t, measureScroll: n, checkIsScrollRoot: r, resetTransform: i }) {
	return Object.assign(Ra, {
		...J,
		...Ra
	}), class {
		constructor(e = {}, n = t?.()) {
			this.id = Wo++, this.animationId = 0, this.animationCommitId = 0, this.children = /* @__PURE__ */ new Set(), this.options = {}, this.isTreeAnimating = !1, this.isAnimationBlocked = !1, this.isLayoutDirty = !1, this.isProjectionDirty = !1, this.isSharedProjectionDirty = !1, this.isTransformDirty = !1, this.updateManuallyBlocked = !1, this.updateBlockedByResize = !1, this.isUpdating = !1, this.isSVG = !1, this.needsReset = !1, this.shouldResetTransform = !1, this.hasCheckedOptimisedAppear = !1, this.treeScale = {
				x: 1,
				y: 1
			}, this.eventHandlers = /* @__PURE__ */ new Map(), this.hasTreeAnimated = !1, this.updateScheduled = !1, this.scheduleUpdate = () => this.update(), this.projectionUpdateScheduled = !1, this.checkUpdateFailed = () => {
				this.isUpdating && (this.isUpdating = !1, this.clearAllSnapshots());
			}, this.updateProjection = () => {
				this.projectionUpdateScheduled = !1, za.value && (Vo.nodes = Vo.calculatedTargetDeltas = Vo.calculatedProjections = 0), this.nodes.forEach(Zo), this.nodes.forEach(cs), this.nodes.forEach(ls), this.nodes.forEach(Qo), za.addProjectionMetrics && za.addProjectionMetrics(Vo);
			}, this.resolvedRelativeTargetAt = 0, this.hasProjected = !1, this.isVisible = !0, this.animationProgress = 0, this.sharedNodes = /* @__PURE__ */ new Map(), this.latestValues = e, this.root = n ? n.root || n : this, this.path = n ? [...n.path, n] : [], this.parent = n, this.depth = n ? n.depth + 1 : 0;
			for (let e = 0; e < this.path.length; e++) this.path[e].shouldResetTransform = !0;
			this.root === this && (this.nodes = new zo());
		}
		addEventListener(e, t) {
			return this.eventHandlers.has(e) || this.eventHandlers.set(e, new P()), this.eventHandlers.get(e).add(t);
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
			this.isSVG = na(t) && !Va(t), this.instance = t;
			let { layoutId: n, layout: r, visualElement: i } = this.options;
			if (i && !i.current && i.mount(t), this.root.nodes.add(this), this.parent && this.parent.children.add(this), this.root.hasTreeAnimated && (r || n) && (this.isLayoutDirty = !0), e) {
				let n, r = 0, i = () => this.root.updateBlockedByResize = !1;
				Nt.read(() => {
					r = window.innerWidth;
				}), e(t, () => {
					let e = window.innerWidth;
					e !== r && (r = e, this.root.updateBlockedByResize = !0, n && n(), n = Ba(i, 250), Bo.hasAnimatedSinceResize && (Bo.hasAnimatedSinceResize = !1, this.nodes.forEach(ss)));
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
				let a = this.options.transition || n.getDefaultTransition() || hs, { onLayoutAnimationStart: o, onLayoutAnimationComplete: s } = n.getProps(), c = !this.targetLayout || !Ao(this.targetLayout, i), l = !t && r;
				if (this.options.layoutRoot || this.resumeFrom || l || t && (c || !this.currentAnimation)) {
					this.resumeFrom && (this.resumingFrom = this.resumeFrom, this.resumingFrom.resumingFrom = void 0);
					let t = {
						...gi(a, "layout"),
						onPlay: o,
						onComplete: s
					};
					(n.shouldReduceMotion || this.options.layoutRoot) && (t.delay = 0, t.type = !1), this.startAnimation(t), this.setAnimationOrigin(e, l, t.path);
				} else t || ss(this), this.isLead() && this.options.onExitComplete && this.options.onExitComplete();
				this.targetLayout = i;
			}));
		}
		unmount() {
			this.options.layoutId && this.willUpdate(), this.root.nodes.remove(this);
			let e = this.getStack();
			e && e.remove(this), this.parent && this.parent.children.delete(this), this.instance = void 0, this.eventHandlers.clear(), this.hasLayoutListener = !1, Pt(this.updateProjection);
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
			this.isUpdateBlocked() || (this.isUpdating = !0, this.nodes && this.nodes.forEach(us), this.animationId++);
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
			if (window.MotionCancelOptimisedAnimation && !this.hasCheckedOptimisedAppear && qo(this), !this.root.isUpdating && this.root.startUpdate(), this.isLayoutDirty) return;
			Ko(this), this.isLayoutDirty = !0;
			for (let e = 0; e < this.path.length; e++) {
				let t = this.path[e];
				t.shouldResetTransform = !0, Ko(t), (typeof t.latestValues.x == "string" || typeof t.latestValues.y == "string") && (t.isLayoutDirty = !0), t.updateScroll("snapshot"), t.options.layoutRoot && t.willUpdate(!1), t.isAnimationBlocked && (t.dragSnapshot ||= t.measure(), this.dragAncestor = t);
			}
			let { layoutId: t, layout: n } = this.options;
			if (t === void 0 && !n) return;
			let r = this.getTransformTemplate();
			this.prevTransformTemplateValue = r ? r(this.latestValues, "") : void 0, this.updateSnapshot(), e && this.notifyListeners("willUpdate");
		}
		update() {
			if (this.updateScheduled = !1, this.isUpdateBlocked()) {
				let e = this.updateBlockedByResize;
				this.unblockUpdate(), this.updateBlockedByResize = !1, this.clearAllSnapshots(), e && this.nodes.forEach(ts), this.nodes.forEach(es);
				return;
			}
			if (this.animationId <= this.animationCommitId) {
				this.nodes.forEach(ns);
				return;
			}
			this.animationCommitId = this.animationId, this.isUpdating ? (this.isUpdating = !1, this.nodes.forEach(is), this.nodes.forEach(as), this.nodes.forEach(os), this.nodes.forEach(Yo), this.nodes.forEach(Xo)) : this.nodes.forEach(ns), this.clearAllSnapshots();
			let e = W.now();
			H.delta = E(0, 1e3 / 60, e - H.timestamp), H.timestamp = e, H.isProcessing = !0, Ft.update.process(H), Ft.preRender.process(H), Ft.render.process(H), H.isProcessing = !1;
		}
		didUpdate() {
			this.updateScheduled || (this.updateScheduled = !0, Fa.read(this.scheduleUpdate));
		}
		clearAllSnapshots() {
			this.nodes.forEach($o), this.sharedNodes.forEach((e, t) => e.members.length ? e.removeLeadSnapshot() : this.sharedNodes.delete(t));
		}
		scheduleUpdateProjection() {
			this.projectionUpdateScheduled || (this.projectionUpdateScheduled = !0, Nt.preRender(this.updateProjection, !1, !0));
		}
		scheduleCheckAfterUnmount() {
			Nt.postRender(() => {
				this.isLayoutDirty ? this.root.didUpdate() : this.root.checkUpdateFailed();
			});
		}
		updateSnapshot() {
			!this.snapshot && this.instance && (this.snapshot = this.measure(), this.snapshot && !oo(this.snapshot.measuredBox.x) && !oo(this.snapshot.measuredBox.y) && (this.snapshot = void 0));
		}
		updateLayout() {
			if (!this.instance || (this.updateScroll(), !(this.options.alwaysMeasureLayout && this.isLead()) && !this.isLayoutDirty)) return;
			if (this.resumeFrom && !this.resumeFrom.instance) for (let e = 0; e < this.path.length; e++) this.path[e].updateScroll();
			let e = this.layout;
			this.layout = this.measure(!1), this.layoutCorrected ||= wo(), this.isLayoutDirty = !1, this.projectionDelta = void 0, this.notifyListeners("measure", this.layout.layoutBox);
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
			e && Ko(this);
			let t = this.projectionDelta && !Eo(this.projectionDelta), n = this.getTransformTemplate(), r = n ? n(this.latestValues, "") : void 0, a = r !== this.prevTransformTemplateValue;
			e && this.instance && (t || ya(this.latestValues) || a) && (i(this.instance, r), this.shouldResetTransform = !1, this.scheduleRender());
		}
		measure(e = !0) {
			let t = this.measurePageBox(), n = this.removeElementScroll(t);
			return e && (n = this.removeTransform(n)), ys(n), {
				animationId: this.root.animationId,
				measuredBox: t,
				layoutBox: n,
				latestValues: {},
				source: this.id
			};
		}
		measurePageBox() {
			let { visualElement: e } = this.options;
			if (!e) return wo();
			let t = e.measureViewportBox();
			if (!(this.scroll?.wasRoot || this.path.some(xs))) {
				let { scroll: e } = this.root;
				e && (ka(t.x, e.offset.x), ka(t.y, e.offset.y));
			}
			return t;
		}
		removeElementScroll(e) {
			let t = wo();
			if (eo(t, e), this.scroll?.wasRoot) return t;
			for (let n = 0; n < this.path.length; n++) {
				let r = this.path[n], { scroll: i, options: a } = r;
				r !== this.root && i && a.layoutScroll && (i.wasRoot && eo(t, e), ka(t.x, i.offset.x), ka(t.y, i.offset.y));
			}
			return t;
		}
		applyTransform(e, t = !1, n, r) {
			let i = n || wo();
			eo(i, e);
			for (let e = 0; e < this.path.length; e++) {
				let n = this.path[e];
				!t && n.options.layoutScroll && n.scroll && n !== n.root && (ka(i.x, -n.scroll.offset.x), ka(i.y, -n.scroll.offset.y)), ya(n.latestValues) && Ma(i, n.latestValues, n.layout?.layoutBox);
			}
			return !r && ya(this.latestValues) && Ma(i, this.latestValues, this.layout?.layoutBox), i;
		}
		removeTransform(e) {
			let t = wo();
			eo(t, e);
			for (let e = 0; e < this.path.length; e++) {
				let n = this.path[e];
				if (!ya(n.latestValues)) continue;
				let r;
				n.instance && (va(n.latestValues) && n.updateSnapshot(), r = wo(), eo(r, n.measurePageBox())), bo(t, n.latestValues, n.snapshot?.layoutBox, r);
			}
			return ya(this.latestValues) && bo(t, this.latestValues), t;
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
			this.relativeParent && this.relativeParent.resolvedRelativeTargetAt !== H.timestamp && this.relativeParent.resolveTargetDelta(!0);
		}
		resolveTargetDelta(e = !1) {
			let t = this.getLead();
			this.isProjectionDirty ||= t.isProjectionDirty, this.isTransformDirty ||= t.isTransformDirty, this.isSharedProjectionDirty ||= t.isSharedProjectionDirty;
			let n = !!this.resumingFrom || this !== t;
			if (!(e || n && this.isSharedProjectionDirty || this.isProjectionDirty || this.parent?.isProjectionDirty || this.attemptToResolveRelativeTarget || this.root.updateBlockedByResize)) return;
			let { layout: r, layoutId: i } = this.options;
			if (!this.layout || !(r || i)) return;
			this.resolvedRelativeTargetAt = H.timestamp;
			let a = this.getClosestProjectingParent();
			!this.targetDelta && !this.relativeTarget && (this.options.layoutAnchor !== !1 && a && a.layout ? this.createRelativeTarget(a, this.layout.layoutBox, a.layout.layoutBox) : this.removeRelativeTarget()), (this.relativeTarget || this.targetDelta) && (this.target || (this.target = wo(), this.targetWithTransforms = wo()), this.relativeTarget && this.relativeTargetOrigin && this.relativeParent && this.relativeParent.target ? (this.forceRelativeParentToResolveTarget(), fo(this.target, this.relativeTarget, this.relativeParent.target, this.options.layoutAnchor || void 0)) : this.targetDelta ? (this.resumingFrom ? this.applyTransform(this.layout.layoutBox, !1, this.target, !0) : eo(this.target, this.layout.layoutBox), Ta(this.target, this.targetDelta)) : eo(this.target, this.layout.layoutBox), this.attemptToResolveRelativeTarget && (this.attemptToResolveRelativeTarget = !1, this.options.layoutAnchor !== !1 && a && !!a.resumingFrom == !!this.resumingFrom && !a.options.layoutScroll && a.target && this.animationProgress !== 1 ? this.createRelativeTarget(a, this.target, a.target) : this.relativeParent = this.relativeTarget = void 0), za.value && Vo.calculatedTargetDeltas++);
		}
		getClosestProjectingParent() {
			if (!(!this.parent || va(this.parent.latestValues) || ba(this.parent.latestValues))) return this.parent.isProjecting() ? this.parent : this.parent.getClosestProjectingParent();
		}
		isProjecting() {
			return !!((this.relativeTarget || this.targetDelta || this.options.layoutRoot) && this.layout);
		}
		createRelativeTarget(e, t, n) {
			this.relativeParent = e, this.forceRelativeParentToResolveTarget(), this.relativeTarget = wo(), this.relativeTargetOrigin = wo(), mo(this.relativeTargetOrigin, t, n, this.options.layoutAnchor || void 0), eo(this.relativeTarget, this.relativeTargetOrigin);
		}
		removeRelativeTarget() {
			this.relativeParent = this.relativeTarget = void 0;
		}
		calcProjection() {
			let e = this.getLead(), t = !!this.resumingFrom || this !== e, n = !0;
			if ((this.isProjectionDirty || this.parent?.isProjectionDirty) && (n = !1), t && (this.isSharedProjectionDirty || this.isTransformDirty) && (n = !1), this.resolvedRelativeTargetAt === H.timestamp && (n = !1), n) return;
			let { layout: r, layoutId: i } = this.options;
			if (this.isTreeAnimating = !!(this.parent && this.parent.isTreeAnimating || this.currentAnimation || this.pendingAnimation), this.isTreeAnimating || (this.targetDelta = this.relativeTarget = void 0), !this.layout || !(r || i)) return;
			eo(this.layoutCorrected, this.layout.layoutBox);
			let a = this.treeScale.x, o = this.treeScale.y;
			Oa(this.layoutCorrected, this.treeScale, this.path, t), e.layout && !e.target && (this.treeScale.x !== 1 || this.treeScale.y !== 1) && (e.target = e.layout.layoutBox, e.targetWithTransforms = wo());
			let { target: s } = e;
			s ? (!this.projectionDelta || !this.prevProjectionDelta ? this.createProjectionDeltas() : (to(this.prevProjectionDelta.x, this.projectionDelta.x), to(this.prevProjectionDelta.y, this.projectionDelta.y)), lo(this.projectionDelta, this.layoutCorrected, s, this.latestValues), this.treeScale.x === a && this.treeScale.y === o && Mo(this.projectionDelta.x, this.prevProjectionDelta.x) && Mo(this.projectionDelta.y, this.prevProjectionDelta.y) || (this.hasProjected = !0, this.scheduleRender(), this.notifyListeners("projectionUpdate", s)), za.value && Vo.calculatedProjections++) : this.prevProjectionDelta && (this.createProjectionDeltas(), this.scheduleRender());
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
			this.prevProjectionDelta = So(), this.projectionDelta = So(), this.projectionDeltaWithTransform = So();
		}
		setAnimationOrigin(e, t = !1, n) {
			let r = this.snapshot, i = r ? r.latestValues : {}, a = { ...this.latestValues }, o = So();
			this.relativeParent && this.relativeParent.options.layoutRoot || (this.relativeTarget = this.relativeTargetOrigin = void 0), this.attemptToResolveRelativeTarget = !t;
			let s = wo(), c = (r ? r.source : void 0) !== (this.layout ? this.layout.source : void 0), l = this.getStack(), u = !l || l.members.length <= 1, d = !(!c || u || this.options.crossfade !== !0 || this.path.some(ms));
			this.animationProgress = 0;
			let f, p = n?.interpolateProjection(e);
			this.mixTargetDelta = (t) => {
				let n = t / 1e3, r = p?.(n);
				r ? (o.x.translate = r.x, o.x.scale = ft(e.x.scale, 1, n), o.x.origin = e.x.origin, o.x.originPoint = e.x.originPoint, o.y.translate = r.y, o.y.scale = ft(e.y.scale, 1, n), o.y.origin = e.y.origin, o.y.originPoint = e.y.originPoint) : (ds(o.x, e.x, n), ds(o.y, e.y, n)), this.setTargetDelta(o), this.relativeTarget && this.relativeTargetOrigin && this.layout && this.relativeParent && this.relativeParent.layout && (mo(s, this.layout.layoutBox, this.relativeParent.layout.layoutBox, this.options.layoutAnchor || void 0), ps(this.relativeTarget, this.relativeTargetOrigin, s, n), f && Oo(this.relativeTarget, f) && (this.isProjectionDirty = !1), f ||= wo(), eo(f, this.relativeTarget)), c && (this.animationValues = a, Ja(a, i, this.latestValues, n, d, u)), r && r.rotate !== void 0 && (this.animationValues ||= a, this.animationValues.pathRotation = r.rotate), this.root.scheduleUpdateProjection(), this.scheduleRender(), this.animationProgress = n;
			}, this.mixTargetDelta(this.options.layoutRoot ? 1e3 : 0);
		}
		startAnimation(e) {
			this.notifyListeners("animationStart"), this.currentAnimation?.stop(), this.resumingFrom?.currentAnimation?.stop(), this.pendingAnimation &&= (Pt(this.pendingAnimation), void 0), this.pendingAnimation = Nt.update(() => {
				Bo.hasAnimatedSinceResize = !0, this.motionValue ||= mi(0), this.motionValue.jump(0, !1), this.currentAnimation = La(this.motionValue, [0, 1e3], {
					...e,
					velocity: 0,
					isSync: !0,
					onUpdate: (t) => {
						this.mixTargetDelta(t), e.onUpdate && e.onUpdate(t);
					},
					onComplete: () => {
						e.onComplete && e.onComplete(), this.completeAnimation();
					}
				}), bn(this.currentAnimation, this), this.resumingFrom && (this.resumingFrom.currentAnimation = this.currentAnimation), this.pendingAnimation = void 0;
			});
		}
		completeAnimation() {
			this.resumingFrom && (this.resumingFrom.currentAnimation = void 0, this.resumingFrom.preserveOpacity = void 0);
			let e = this.getStack();
			e && e.exitAnimationComplete(), this.resumingFrom = this.currentAnimation = this.animationValues = void 0, this.notifyListeners("animationComplete");
		}
		finishAnimation() {
			this.currentAnimation && (this.mixTargetDelta && this.mixTargetDelta(Uo), this.currentAnimation.stop()), this.completeAnimation();
		}
		applyTransformsToTarget() {
			let e = this.getLead(), { targetWithTransforms: t, layout: n, latestValues: r } = e, { target: i } = e;
			if (t && i && n) {
				if (this !== e && this.layout && n && bs(this.options.animationType, this.layout.layoutBox, n.layoutBox)) {
					i = this.target || wo();
					let t = oo(this.layout.layoutBox.x);
					i.x.min = e.target.x.min, i.x.max = i.x.min + t;
					let n = oo(this.layout.layoutBox.y);
					i.y.min = e.target.y.min, i.y.max = i.y.min + n;
				}
				eo(t, i), Ma(t, r), lo(this.projectionDeltaWithTransform, this.layoutCorrected, t, r);
			}
		}
		registerSharedNode(e, t) {
			this.sharedNodes.has(e) || this.sharedNodes.set(e, new No()), this.sharedNodes.get(e).add(t);
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
			n.z && Go("z", e, r, this.animationValues);
			for (let t = 0; t < Ho.length; t++) Go(`rotate${Ho[t]}`, e, r, this.animationValues), Go(`skew${Ho[t]}`, e, r, this.animationValues);
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
				this.needsReset = !1, e.visibility = "", e.opacity = "", e.pointerEvents = Ha(t?.pointerEvents) || "", e.transform = n ? n(this.latestValues, "") : "none";
				return;
			}
			let r = this.getLead();
			if (!this.projectionDelta || !this.layout || !r.target) {
				this.options.layoutId && (e.opacity = this.latestValues.opacity === void 0 ? 1 : this.latestValues.opacity, e.pointerEvents = Ha(t?.pointerEvents) || ""), this.hasProjected && !ya(this.latestValues) && (e.transform = n ? n({}, "") : "none", this.hasProjected = !1);
				return;
			}
			e.visibility = "";
			let i = r.animationValues || r.latestValues;
			this.applyTransformsToTarget();
			let a = Io(this.projectionDeltaWithTransform, this.treeScale, i);
			n && (a = n(i, a)), e.transform = a;
			let { x: o, y: s } = this.projectionDelta;
			e.transformOrigin = `${o.origin * 100}% ${s.origin * 100}% 0`, e.opacity = r.animationValues ? r === this ? i.opacity ?? this.latestValues.opacity ?? 1 : this.preserveOpacity ? this.latestValues.opacity : i.opacityExit : r === this ? i.opacity === void 0 ? "" : i.opacity : i.opacityExit === void 0 ? 0 : i.opacityExit;
			for (let t in Ra) {
				if (i[t] === void 0) continue;
				let { correct: n, applyTo: o, isCSSVariable: s } = Ra[t], c = a === "none" ? i[t] : n(i[t], r);
				if (o) {
					let t = o.length;
					for (let n = 0; n < t; n++) e[o[n]] = c;
				} else s ? this.options.visualElement.renderState.vars[t] = c : e[t] = c;
			}
			this.options.layoutId && (e.pointerEvents = r === this ? Ha(t?.pointerEvents) || "" : "none");
		}
		clearSnapshot() {
			this.resumeFrom = this.snapshot = this.dragSnapshot = this.dragAncestor = void 0;
		}
		resetTree() {
			this.root.nodes.forEach((e) => e.currentAnimation?.stop()), this.root.nodes.forEach(es), this.root.sharedNodes.clear();
		}
	};
}
function Yo(e) {
	e.updateLayout(), rs(e);
}
function Xo(e) {
	let t = e.resumeFrom?.snapshot || e.snapshot;
	if (e.isLead() && e.layout && t && e.hasListeners("didUpdate")) {
		let { layoutBox: n, measuredBox: r } = e.layout, { animationType: i } = e.options, a = t.source !== e.layout.source;
		if (i === "size") Lo((e) => {
			let r = a ? t.measuredBox[e] : t.layoutBox[e], i = oo(r);
			r.min = n[e].min, r.max = r.min + i;
		});
		else if (i === "x" || i === "y") {
			let e = i === "x" ? "y" : "x";
			$a(a ? t.measuredBox[e] : t.layoutBox[e], n[e]);
		} else bs(i, t.layoutBox, n) && Lo((r) => {
			let i = a ? t.measuredBox[r] : t.layoutBox[r], o = oo(n[r]);
			i.max = i.min + o, e.relativeTarget && !e.currentAnimation && (e.isProjectionDirty = !0, e.relativeTarget[r].max = e.relativeTarget[r].min + o);
		});
		let o = So();
		lo(o, n, t.layoutBox);
		let s = So();
		a ? lo(s, e.applyTransform(r, !0), t.measuredBox) : lo(s, n, t.layoutBox);
		let c = !Eo(o), l = !1;
		if (!e.resumeFrom) {
			let r = e.getClosestProjectingParent();
			if (r && !r.resumeFrom) {
				let { snapshot: i, layout: a } = r;
				if (i && a) {
					let o = e.options.layoutAnchor || void 0, s = wo();
					mo(s, t.layoutBox, i.layoutBox, o);
					let c = wo();
					mo(c, n, a.layoutBox, o), Ao(s, c) || (l = !0), r.options.layoutRoot && (e.relativeTarget = c, e.relativeTargetOrigin = s, e.relativeParent = r);
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
function Zo(e) {
	za.value && Vo.nodes++, e.parent && (e.isProjecting() || (e.isProjectionDirty = e.parent.isProjectionDirty), e.isSharedProjectionDirty ||= !!(e.isProjectionDirty || e.parent.isProjectionDirty || e.parent.isSharedProjectionDirty), e.isTransformDirty ||= e.parent.isTransformDirty);
}
function Qo(e) {
	e.isProjectionDirty = e.isSharedProjectionDirty = e.isTransformDirty = !1;
}
function $o(e) {
	e.clearSnapshot();
}
function es(e) {
	e.clearMeasurements();
}
function ts(e) {
	e.isLayoutDirty = !0, e.updateLayout();
}
function ns(e) {
	e.isLayoutDirty = !1;
}
function rs(e) {
	let { snapshot: t, dragAncestor: n } = e, r = n?.isAnimationBlocked && n.layout;
	if (!t || !r || e.resumeFrom || e.isAnimationBlocked) return;
	let i = n.dragSnapshot;
	Lo((e) => ka(t.layoutBox[e], r.layoutBox[e].min - i.layoutBox[e].min));
}
function is(e) {
	e.isAnimationBlocked && e.layout && !e.isLayoutDirty && (e.snapshot = e.dragSnapshot || e.layout, e.isLayoutDirty = !0);
}
function as(e) {
	e.relativeTarget && e.relativeParent?.isLayoutDirty && (e.currentAnimation ? e.isLayoutDirty = !0 : (e.targetDelta = void 0, e.removeRelativeTarget()));
}
function os(e) {
	let { visualElement: t } = e.options;
	t && t.getProps().onBeforeLayoutMeasure && t.notify("BeforeLayoutMeasure"), e.resetTransform();
}
function ss(e) {
	e.finishAnimation(), e.targetDelta = e.relativeTarget = e.target = void 0, e.isProjectionDirty = !0;
}
function cs(e) {
	e.resolveTargetDelta();
}
function ls(e) {
	e.calcProjection();
}
function us(e) {
	e.resetSkewAndRotation();
}
function ds(e, t, n) {
	e.translate = ft(t.translate, 0, n), e.scale = ft(t.scale, 1, n), e.origin = t.origin, e.originPoint = t.originPoint;
}
function fs(e, t, n, r) {
	e.min = ft(t.min, n.min, r), e.max = ft(t.max, n.max, r);
}
function ps(e, t, n, r) {
	fs(e.x, t.x, n.x, r), fs(e.y, t.y, n.y, r);
}
function ms(e) {
	return e.animationValues && e.animationValues.opacityExit !== void 0;
}
var hs = {
	duration: .45,
	ease: [
		.4,
		0,
		.1,
		1
	]
}, gs = (e) => typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().includes(e), _s = gs("applewebkit/") && !gs("chrome/") ? Math.round : M;
function vs(e) {
	e.min = _s(e.min), e.max = _s(e.max);
}
function ys(e) {
	vs(e.x), vs(e.y);
}
function bs(e, t, n) {
	return e === "position" || e === "preserve-aspect" && !so(jo(t), jo(n), .2);
}
function xs(e) {
	return e !== e.root && e.scroll?.wasRoot;
}
// node_modules/motion-dom/dist/es/events/add-dom-event.mjs
function Ss(e, t, n, r = { passive: !0 }) {
	return e.addEventListener(t, n, r), () => e.removeEventListener(t, n, r);
}
// node_modules/motion-dom/dist/es/projection/node/DocumentProjectionNode.mjs
var Cs = /* @__PURE__ */ Jo({
	attachResizeListener: (e, t) => Ss(e, "resize", t),
	measureScroll: () => ({
		x: document.documentElement.scrollLeft || document.body?.scrollLeft || 0,
		y: document.documentElement.scrollTop || document.body?.scrollTop || 0
	}),
	checkIsScrollRoot: () => !0
}), ws = { current: void 0 }, Ts = /* @__PURE__ */ Jo({
	measureScroll: (e) => ({
		x: e.scrollLeft,
		y: e.scrollTop
	}),
	defaultParent: () => {
		if (!ws.current) {
			let e = new Cs({});
			e.mount(window), e.setOptions({ layoutScroll: !0 }), ws.current = e;
		}
		return ws.current;
	},
	resetTransform: (e, t) => {
		e.style.transform = t === void 0 ? "none" : t;
	},
	checkIsScrollRoot: (e) => window.getComputedStyle(e).position === "fixed"
}), Es = /* @__PURE__ */ new WeakMap();
// node_modules/motion-dom/dist/es/render/utils/is-animation-controls.mjs
function Ds(e) {
	return typeof e == "object" && !!e && typeof e.start == "function";
}
// node_modules/motion-dom/dist/es/render/utils/is-variant-label.mjs
function Os(e) {
	return typeof e == "string" || Array.isArray(e);
}
// node_modules/motion-dom/dist/es/render/utils/variant-props.mjs
var ks = [
	"animate",
	"whileInView",
	"whileFocus",
	"whileHover",
	"whileTap",
	"whileDrag",
	"exit"
], As = /* @__PURE__ */ ["initial"].concat(ks);
// node_modules/motion-dom/dist/es/render/utils/is-controlling-variants.mjs
function js(e) {
	if (Ds(e.animate)) return !0;
	for (let t = 0; t < As.length; t++) if (Os(e[As[t]])) return !0;
	return !1;
}
function Ms(e) {
	return !!(js(e) || e.variants);
}
// node_modules/motion-dom/dist/es/render/utils/motion-values.mjs
function Ns(e, t, n) {
	for (let r in t) {
		let i = t[r], a = n[r];
		if (Li(i)) e.addValue(r, i);
		else if (Li(a)) e.addValue(r, mi(i, { owner: e }));
		else if (a !== i) {
			if (e.hasValue(r)) {
				let t = e.getValue(r);
				t.liveStyle === !0 ? t.jump(i) : t.hasAnimated || t.set(i);
			} else {
				let t = e.getStaticValue(r);
				e.addValue(r, mi(t === void 0 ? i : t, { owner: e }));
			}
		}
	}
	for (let r in n) t[r] === void 0 && e.removeValue(r);
	return t;
}
// node_modules/motion-dom/dist/es/render/utils/reduced-motion/state.mjs
var Ps = { current: null }, Fs = { current: !1 }, Is = typeof window < "u";
function Ls() {
	if (Fs.current = !0, Is) {
		if (window.matchMedia) {
			let e = window.matchMedia("(prefers-reduced-motion)"), t = () => Ps.current = e.matches;
			e.addEventListener("change", t), t();
		} else Ps.current = !1;
	}
}
// node_modules/motion-dom/dist/es/render/VisualElement.mjs
var Rs = [
	"AnimationStart",
	"AnimationComplete",
	"Update",
	"BeforeLayoutMeasure",
	"LayoutMeasure",
	"LayoutAnimationStart",
	"LayoutAnimationComplete"
], zs = {};
function Bs(e) {
	zs = e;
}
function Vs() {
	return zs;
}
var Hs = class {
	scrapeMotionValuesFromProps(e, t, n) {
		return {};
	}
	constructor({ parent: e, props: t, presenceContext: n, reducedMotionConfig: r, skipAnimations: i, blockInitialAnimation: a, visualState: o }, s = {}) {
		this.current = null, this.children = /* @__PURE__ */ new Set(), this.isVariantNode = !1, this.isControllingVariants = !1, this.shouldReduceMotion = null, this.shouldSkipAnimations = !1, this.values = /* @__PURE__ */ new Map(), this.KeyframeResolver = mr, this.features = {}, this.valueSubscriptions = /* @__PURE__ */ new Map(), this.prevMotionValues = {}, this.hasBeenMounted = !1, this.events = {}, this.propEventSubscriptions = {}, this.notifyUpdate = () => this.notify("Update", this.latestValues), this.render = () => {
			this.current && (this.triggerBuild(), this.renderInstance(this.current, this.renderState, this.props.style, this.projection));
		}, this.renderScheduledAt = 0, this.scheduleRender = () => {
			let e = W.now();
			this.renderScheduledAt < e && (this.renderScheduledAt = e, Nt.render(this.render, !1, !0));
		};
		let { latestValues: c, renderState: l } = o;
		this.latestValues = c, this.baseTarget = { ...c }, this.initialValues = t.initial ? { ...c } : {}, this.renderState = l, this.parent = e, this.props = t, this.presenceContext = n, this.depth = e ? e.depth + 1 : 0, this.reducedMotionConfig = r, this.skipAnimationsConfig = i, this.options = s, this.blockInitialAnimation = !!a, this.isControllingVariants = js(t), this.isVariantNode = Ms(t), this.isVariantNode && (this.variantChildren = /* @__PURE__ */ new Set()), this.manuallyAnimateOnMount = !!(e && e.current);
		let { willChange: u, ...d } = this.scrapeMotionValuesFromProps(t, {}, this);
		for (let e in d) {
			let t = d[e];
			c[e] !== void 0 && Li(t) && t.set(c[e]);
		}
	}
	mount(e) {
		if (this.hasBeenMounted) for (let e in this.initialValues) this.values.get(e)?.jump(this.initialValues[e]), this.latestValues[e] = this.initialValues[e];
		if (this.current = e, Es.set(e, this), this.projection && !this.projection.instance && this.projection.mount(e), this.isVariantNode && !this.isControllingVariants) {
			let e = this;
			do
				e = e.props.inherit !== !1 && e.parent;
			while (e && !e.isVariantNode);
			if (e) {
				let { variantChildren: t } = e;
				t.add(this), this.removeFromVariantTree = () => t.delete(this);
			}
		}
		this.values.forEach((e, t) => this.bindToMotionValue(t, e)), this.reducedMotionConfig === "never" ? this.shouldReduceMotion = !1 : this.reducedMotionConfig === "always" ? this.shouldReduceMotion = !0 : (Fs.current || Ls(), this.shouldReduceMotion = Ps.current), this.shouldSkipAnimations = this.skipAnimationsConfig ?? !1, this.parent?.addChild(this), this.update(this.props, this.presenceContext), this.hasBeenMounted = !0;
	}
	unmount() {
		this.projection && this.projection.unmount(), Pt(this.notifyUpdate), Pt(this.render), this.valueSubscriptions.forEach((e) => e()), this.valueSubscriptions.clear(), this.removeFromVariantTree && this.removeFromVariantTree(), this.parent?.removeChild(this);
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
		if (this.valueSubscriptions.has(e) && this.valueSubscriptions.get(e)(), t.accelerate && Ir.has(e) && this.current instanceof HTMLElement) {
			let { factory: n, keyframes: r, times: i, ease: a, duration: o } = t.accelerate, s = new Dr({
				element: this.current,
				name: e,
				keyframes: r,
				times: i,
				ease: a,
				duration: /* @__PURE__ */ F(o)
			}), c = n(s);
			this.valueSubscriptions.set(e, () => {
				c(), s.cancel();
			});
			return;
		}
		let n = Xn.has(e);
		n && this.onBindTransform && this.onBindTransform();
		let r = t.on("change", (t) => {
			this.latestValues[e] = t, this.props.onUpdate && Nt.preRender(this.notifyUpdate), n && (this.projection && (this.projection.isTransformDirty = !0), Kr.get(this.current)?.check()), this.scheduleRender();
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
		for (e in zs) {
			let t = zs[e];
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
		return this.current ? this.measureInstanceViewportBox(this.current, this.props) : wo();
	}
	getStaticValue(e) {
		return this.latestValues[e];
	}
	setStaticValue(e, t) {
		this.latestValues[e] = t;
	}
	update(e, t) {
		let { transformTemplate: n, onUpdate: r } = this.props;
		(e.transformTemplate || n) && this.scheduleRender(), (e.transformTemplate && !n || e.onUpdate && !r) && Kr.get(this.current)?.demote(), this.prevProps = this.props, this.props = e, this.prevPresenceContext = this.presenceContext, this.presenceContext = t;
		for (let t = 0; t < Rs.length; t++) {
			let n = Rs[t];
			this.propEventSubscriptions[n] && (this.propEventSubscriptions[n](), delete this.propEventSubscriptions[n]);
			let r = e["on" + n];
			r && (this.propEventSubscriptions[n] = this.on(n, r));
		}
		this.prevMotionValues = Ns(this, this.scrapeMotionValuesFromProps(e, this.prevProps || {}, this), this.prevMotionValues), this.handleChildMotionValue && this.handleChildMotionValue();
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
		return n === void 0 && t !== void 0 && (n = mi(t ?? this.getDefaultValue?.(e), { owner: this }), this.addValue(e, n)), n;
	}
	readValue(e, t) {
		let n = this.latestValues[e] !== void 0 || !this.current ? this.latestValues[e] : this.getBaseTargetFromProps(this.props, e) ?? this.readValueFromInstance(this.current, e, this.options);
		return n != null && (typeof n == "string" && (O(n) || A(n)) ? n = parseFloat(n) : typeof n != "number" && !ct.test(n) && ct.test(t) && (n = Fn(e, t)), this.setBaseTarget(e, Li(n) ? n.get() : n)), Li(n) ? n.get() : n;
	}
	setBaseTarget(e, t) {
		this.baseTarget[e] = t;
	}
	on(e, t) {
		return this.events[e] || (this.events[e] = new P()), this.events[e].add(t);
	}
	notify(e, ...t) {
		this.events[e] && this.events[e].notify(...t);
	}
	scheduleRenderMicrotask() {
		Fa.render(this.render);
	}
}, Us = class extends Hs {
	constructor() {
		super(...arguments), this.KeyframeResolver = $i;
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
		Li(e) && (this.childSubscription = e.on("change", (e) => {
			this.current && (this.current.textContent = `${e}`);
		}));
	}
};
// node_modules/motion-dom/dist/es/render/html/utils/render.mjs
function Ws(e, { style: t, vars: n }, r, i) {
	let a = e.style, o;
	for (o in t) a[o] = t[o];
	for (o in i?.applyProjectionStyles(a, r), n) a.setProperty(o, n[o]);
}
// node_modules/motion-dom/dist/es/render/utils/is-forced-motion-value.mjs
function Gs(e, { layout: t, layoutId: n }) {
	return Xn.has(e) || e.startsWith("origin") || (t || n !== void 0) && (!!Ra[e] || e === "opacity");
}
// node_modules/motion-dom/dist/es/render/html/utils/scrape-motion-values.mjs
function Ks(e, t, n) {
	let r = e.style, i = t?.style, a = {};
	if (!r) return a;
	for (let t in r) (Li(r[t]) || i && Li(i[t]) || Gs(t, e) || n?.getValue(t)?.liveStyle !== void 0) && (a[t] = r[t]);
	return a;
}
// node_modules/motion-dom/dist/es/render/html/HTMLVisualElement.mjs
function qs(e) {
	return window.getComputedStyle(e);
}
var Js = class extends Us {
	constructor() {
		super(...arguments), this.type = "html", this.renderInstance = Ws;
	}
	mount(e) {
		e.style, super.mount(e);
	}
	readValueFromInstance(e, t) {
		if (Xn.has(t)) return this.projection?.isProjecting ? Gn(t) : qn(e, t);
		{
			let n = qs(e), r = (ve(t) ? n.getPropertyValue(t) : n[t]) || 0;
			return typeof r == "string" ? r.trim() : r;
		}
	}
	measureInstanceViewportBox(e, { transformPagePoint: t }) {
		return Na(e, t);
	}
	build(e, t, n) {
		ca(e, t, n.transformTemplate);
	}
	scrapeMotionValuesFromProps(e, t, n) {
		return Ks(e, t, n);
	}
}, Ys = (e) => e.pointerType === "mouse" ? typeof e.button != "number" || e.button <= 0 : e.isPrimary !== !1;
// node_modules/motion-dom/dist/es/events/event-info.mjs
function Xs(e) {
	return { point: {
		x: e.pageX,
		y: e.pageY
	} };
}
var Zs = (e) => (t) => Ys(t) && e(t, Xs(t));
// node_modules/motion-dom/dist/es/events/add-pointer-event.mjs
function Qs(e, t, n, r) {
	return Ss(e, t, Zs(n), r);
}
// node_modules/motion-dom/dist/es/resize/handle-element.mjs
var $s = /* @__PURE__ */ new WeakMap(), ec, tc = (e, t, n) => (r, i) => i && i[0] ? i[0][e + "Size"] : na(r) && "getBBox" in r ? r.getBBox()[t] : r[n], nc = /*@__PURE__*/ tc("inline", "width", "offsetWidth"), rc = /*@__PURE__*/ tc("block", "height", "offsetHeight");
function ic({ target: e, borderBoxSize: t }) {
	$s.get(e)?.forEach((n) => {
		n(e, {
			get width() {
				return nc(e, t);
			},
			get height() {
				return rc(e, t);
			}
		});
	});
}
function ac(e) {
	e.forEach(ic);
}
function oc() {
	typeof ResizeObserver < "u" && (ec = new ResizeObserver(ac));
}
function sc(e, t) {
	ec || oc();
	let n = oa(e);
	return n.forEach((e) => {
		let n = $s.get(e);
		n || (n = /* @__PURE__ */ new Set(), $s.set(e, n)), n.add(t), ec?.observe(e);
	}), () => {
		n.forEach((e) => {
			let n = $s.get(e);
			n?.delete(t), n?.size || ec?.unobserve(e);
		});
	};
}
// node_modules/motion-dom/dist/es/resize/handle-window.mjs
var cc = /* @__PURE__ */ new Set(), lc;
function uc() {
	lc = () => {
		let e = {
			get width() {
				return window.innerWidth;
			},
			get height() {
				return window.innerHeight;
			}
		};
		cc.forEach((t) => t(e));
	}, window.addEventListener("resize", lc);
}
function dc(e) {
	return cc.add(e), lc || uc(), () => {
		cc.delete(e), !cc.size && typeof lc == "function" && (window.removeEventListener("resize", lc), lc = void 0);
	};
}
// node_modules/motion-dom/dist/es/resize/index.mjs
function fc(e, t) {
	return ia(typeof e == "function" ? dc(e) : sc(e, t));
}
// node_modules/motion-dom/dist/es/utils/distance.mjs
var pc = (e, t) => Math.abs(e - t);
function mc(e, t) {
	let n = pc(e.x, t.x), r = pc(e.y, t.y);
	return Math.sqrt(n ** 2 + r ** 2);
}
// node_modules/motion-dom/dist/es/gestures/pan/PanSession.mjs
var hc = /*#__PURE__*/ new Set(["auto", "scroll"]), gc = class {
	constructor(e, t, { transformPagePoint: n, contextWindow: r = window, dragSnapToOrigin: i = !1, distanceThreshold: a = 3, element: o } = {}) {
		if (this.startEvent = null, this.lastMoveEvent = null, this.lastMoveEventInfo = null, this.lastRawMoveEventInfo = null, this.handlers = {}, this.contextWindow = window, this.scrollPositions = /* @__PURE__ */ new Map(), this.removeScrollListeners = null, this.onElementScroll = (e) => {
			this.handleScroll(e.target);
		}, this.onWindowScroll = () => {
			this.handleScroll(window);
		}, this.updatePoint = () => {
			if (!(this.lastMoveEvent && this.lastMoveEventInfo)) return;
			this.hasPendingMove = !1, this.lastRawMoveEventInfo && (this.lastMoveEventInfo = _c(this.lastRawMoveEventInfo, this.transformPagePoint));
			let e = yc(this.lastMoveEventInfo, this.history), t = this.startEvent !== null, n = mc(e.offset, {
				x: 0,
				y: 0
			}) >= this.distanceThreshold;
			if (!t && !n) return;
			let { point: r } = e;
			this.history.push({
				...r,
				timestamp: W.now()
			});
			let { onStart: i, onMove: a } = this.handlers;
			t || (i && i(this.lastMoveEvent, e), this.startEvent = this.lastMoveEvent), a && a(this.lastMoveEvent, e);
		}, this.handlePointerMove = (e, t) => {
			this.handleScroll(window), this.lastMoveEvent = e, this.lastRawMoveEventInfo = t, this.lastMoveEventInfo = _c(t, this.transformPagePoint), this.hasPendingMove = !0, Nt.update(this.updatePoint, !0);
		}, this.handlePointerUp = (e, t) => {
			this.hasPendingMove && this.updatePoint(), this.end();
			let { onEnd: n, onSessionEnd: r, resumeAnimation: i } = this.handlers;
			if ((this.dragSnapToOrigin || !this.startEvent) && i && i(), !(this.lastMoveEvent && this.lastMoveEventInfo)) return;
			let a = yc(e.type === "pointercancel" ? this.lastMoveEventInfo : _c(t, this.transformPagePoint), this.history);
			this.startEvent && n && n(e, a), r && r(e, a);
		}, !Ys(e)) return;
		this.dragSnapToOrigin = i, this.handlers = t, this.transformPagePoint = n, this.distanceThreshold = a, this.contextWindow = r || window;
		let s = _c(Xs(e), this.transformPagePoint), { point: c } = s, { timestamp: l } = H;
		this.history = [{
			...c,
			timestamp: l
		}];
		let { onSessionStart: u } = t;
		u && u(e, yc(s, this.history));
		let d = {
			passive: !0,
			capture: !0
		};
		this.removeListeners = ee(Qs(this.contextWindow, "pointermove", this.handlePointerMove, d), Qs(this.contextWindow, "pointerup", this.handlePointerUp, d), Qs(this.contextWindow, "pointercancel", this.handlePointerUp, d)), o && this.startScrollTracking(o);
	}
	startScrollTracking(e) {
		let t = e.parentElement;
		for (; t;) {
			let e = getComputedStyle(t);
			(hc.has(e.overflowX) || hc.has(e.overflowY)) && this.scrollPositions.set(t, {
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
		(i.x !== 0 || i.y !== 0) && (n ? this.lastMoveEventInfo && (this.lastMoveEventInfo.point.x += i.x, this.lastMoveEventInfo.point.y += i.y) : this.history.length > 0 && (this.history[0].x -= i.x, this.history[0].y -= i.y), this.scrollPositions.set(e, r), Nt.update(this.updatePoint, !0));
	}
	updateHandlers(e) {
		this.handlers = e;
	}
	end() {
		this.removeListeners && this.removeListeners(), this.removeScrollListeners && this.removeScrollListeners(), this.scrollPositions.clear(), Pt(this.updatePoint);
	}
};
function _c(e, t) {
	return t ? { point: t(e.point) } : e;
}
function vc(e, t) {
	return {
		x: e.x - t.x,
		y: e.y - t.y
	};
}
function yc({ point: e }, t) {
	return {
		point: e,
		delta: vc(e, xc(t)),
		offset: vc(e, bc(t)),
		velocity: Sc(t, .1)
	};
}
function bc(e) {
	return e[0];
}
function xc(e) {
	return e[e.length - 1];
}
function Sc(e, t) {
	if (e.length < 2) return {
		x: 0,
		y: 0
	};
	let n = e.length - 1, r = null, i = xc(e);
	for (; n >= 0 && (r = e[n], !(i.timestamp - r.timestamp > /* @__PURE__ */ F(t)));) n--;
	if (!r) return {
		x: 0,
		y: 0
	};
	r === e[0] && e.length > 2 && i.timestamp - r.timestamp > /* @__PURE__ */ F(t) * 2 && (r = e[1]);
	let a = /* @__PURE__ */ I(i.timestamp - r.timestamp);
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
var Cc = /* @__PURE__ */ new Set([
	"BUTTON",
	"INPUT",
	"SELECT",
	"TEXTAREA",
	"A"
]);
function wc(e) {
	return Cc.has(e.tagName) || e.isContentEditable === !0;
}
var Tc = /* @__PURE__ */ new Set([
	"INPUT",
	"SELECT",
	"TEXTAREA"
]);
function Ec(e) {
	return Tc.has(e.tagName) || e.isContentEditable === !0;
}
// node_modules/motion-dom/dist/es/gestures/drag/state/is-active.mjs
var Dc = {
	x: !1,
	y: !1
};
function Oc() {
	return Dc.x || Dc.y;
}
// node_modules/motion-dom/dist/es/gestures/drag/state/set-active.mjs
function kc(e) {
	return e === "x" || e === "y" ? Dc[e] ? null : (Dc[e] = !0, () => {
		Dc[e] = !1;
	}) : Dc.x || Dc.y ? null : (Dc.x = Dc.y = !0, () => {
		Dc.x = Dc.y = !1;
	});
}
// node_modules/motion-dom/dist/es/gestures/drag/utils/constraints.mjs
function Ac(e, { min: t, max: n }, r) {
	return t !== void 0 && e < t ? e = r ? ft(t, e, r.min) : Math.max(e, t) : n !== void 0 && e > n && (e = r ? ft(n, e, r.max) : Math.min(e, n)), e;
}
function jc(e, t, n) {
	return {
		min: t === void 0 ? void 0 : e.min + t,
		max: n === void 0 ? void 0 : e.max + n - (e.max - e.min)
	};
}
function Mc(e, { top: t, left: n, bottom: r, right: i }) {
	return {
		x: jc(e.x, n, i),
		y: jc(e.y, t, r)
	};
}
function Nc(e, t) {
	let n = t.min - e.min, r = t.max - e.max;
	return t.max - t.min < e.max - e.min && ([n, r] = [r, n]), {
		min: n,
		max: r
	};
}
function Pc(e, t) {
	return {
		x: Nc(e.x, t.x),
		y: Nc(e.y, t.y)
	};
}
function Fc(e, t) {
	let n = .5, r = oo(e), i = oo(t);
	return i > r ? n = /* @__PURE__ */ N(t.min, t.max - r, e.min) : r > i && (n = /* @__PURE__ */ N(e.min, e.max - i, t.min)), E(0, 1, n);
}
function Ic(e, t) {
	let n = {};
	return t.min !== void 0 && (n.min = t.min - e.min), t.max !== void 0 && (n.max = t.max - e.min), n;
}
var Lc = .35;
function Rc(e = Lc) {
	return e === !1 ? e = 0 : e === !0 && (e = Lc), {
		x: zc(e, "left", "right"),
		y: zc(e, "top", "bottom")
	};
}
function zc(e, t, n) {
	return {
		min: Bc(e, t),
		max: Bc(e, n)
	};
}
function Bc(e, t) {
	return typeof e == "number" ? e : e[t] || 0;
}
// node_modules/motion-dom/dist/es/gestures/drag/VisualElementDragControls.mjs
var Vc = /* @__PURE__ */ new WeakMap(), Hc = class {
	constructor(e, t = () => e.getProps()) {
		this.openDragLock = null, this.isDragging = !1, this.currentDirection = null, this.originPoint = {
			x: 0,
			y: 0
		}, this.constraints = !1, this.hasMutatedConstraints = !1, this.elastic = wo(), this.latestPointerEvent = null, this.latestPanInfo = null, this.visualElement = e, this.readProps = t;
	}
	start(e, { snapToCursor: t = !1, distanceThreshold: n } = {}) {
		let { presenceContext: r } = this.visualElement;
		if (r && r.isPresent === !1) return;
		let i = (e) => {
			t && this.snapToCursor(e), this.stopAnimation();
		}, a = (e, t) => {
			let { drag: n, dragPropagation: r, onDragStart: i } = this.getProps();
			if (n && !r && (this.openDragLock && this.openDragLock(), this.openDragLock = kc(n), !this.openDragLock)) return;
			this.latestPointerEvent = e, this.latestPanInfo = t, this.isDragging = !0, this.currentDirection = null, this.resolveConstraints(), this.visualElement.projection && (this.visualElement.projection.isAnimationBlocked = !0, this.visualElement.projection.target = void 0), Lo((e) => {
				let t = this.getAxisMotionValue(e).get() || 0;
				if (be(t) && (t = Di(t, this.visualElement.current) || 0), K.test(t)) t = parseFloat(t);
				else if (Re.test(t)) {
					let { projection: n } = this.visualElement;
					if (n && n.layout) {
						let r = n.layout.layoutBox[e];
						r && (t = oo(r) * (parseFloat(t) / 100));
					}
				}
				this.originPoint[e] = t;
			}), i && Nt.update(() => i(e, t), !1, !0), zi(this.visualElement, "transform");
			let { animationState: a } = this.visualElement;
			a && a.setActive("whileDrag", !0);
		}, o = (e, t) => {
			this.latestPointerEvent = e, this.latestPanInfo = t;
			let { dragPropagation: n, dragDirectionLock: r, onDirectionLock: i, onDrag: a } = this.getProps();
			if (!n && !this.openDragLock) return;
			let { offset: o } = t;
			if (r && this.currentDirection === null) {
				if (this.currentDirection = Jc(o), this.currentDirection === null) return;
				i && i(this.currentDirection);
			}
			this.updateAxis("x", t.point, o), this.updateAxis("y", t.point, o), this.visualElement.render(), a && Nt.update(() => a(e, t), !1, !0);
		}, s = (e, t) => {
			this.latestPointerEvent = e, this.latestPanInfo = t, this.stop(e, t), this.latestPointerEvent = null, this.latestPanInfo = null;
		}, c = () => {
			let { dragSnapToOrigin: e } = this.getProps();
			(e || this.constraints) && this.startAnimation({
				x: 0,
				y: 0
			});
		}, { dragSnapToOrigin: l } = this.getProps();
		this.panSession = new gc(e, {
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
		s && Nt.postRender(() => s(r, i));
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
		if (!n || !qc(e, r, this.currentDirection)) return;
		let i = this.getAxisMotionValue(e), a = this.originPoint[e] + n[e];
		this.constraints && this.constraints[e] && (a = Ac(a, this.constraints[e], this.elastic[e])), i.set(a);
	}
	resolveConstraints() {
		let { dragConstraints: e, dragElastic: t } = this.getProps(), n = this.visualElement.projection && !this.visualElement.projection.layout ? this.visualElement.projection.measure(!1) : this.visualElement.projection?.layout, r = this.constraints;
		Uc(e) ? this.constraints ||= this.resolveRefConstraints() : this.constraints = e && n ? Mc(n.layoutBox, e) : !1, this.elastic = Rc(t), r !== this.constraints && !Uc(e) && n && this.constraints && !this.hasMutatedConstraints && Lo((e) => {
			this.constraints !== !1 && this.getAxisMotionValue(e) && (this.constraints[e] = Ic(n.layoutBox[e], this.constraints[e]));
		});
	}
	resolveRefConstraints() {
		let { dragConstraints: e, onMeasureDragConstraints: t } = this.getProps();
		if (!Uc(e)) return !1;
		let n = Wc(e), { projection: r } = this.visualElement;
		if (!r || !r.layout) return !1;
		r.root && (r.root.scroll = void 0, r.root.updateScroll());
		let i = Pa(n, r.root, this.visualElement.getTransformPagePoint()), a = Pc(r.layout.layoutBox, i);
		if (t) {
			let e = t(ha(a));
			this.hasMutatedConstraints = !!e, e && (a = ma(e));
		}
		return a;
	}
	startAnimation(e, t) {
		let { drag: n, dragMomentum: r, dragElastic: i, dragTransition: a, dragSnapToOrigin: o, onDragTransitionEnd: s } = this.getProps(), c = this.constraints || {}, l = Lo((s) => {
			if (!qc(s, t || n, this.currentDirection)) return;
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
		return zi(this.visualElement, e), n.start(wi(e, n, 0, t, this.visualElement, !1));
	}
	stopAnimation() {
		Lo((e) => this.getAxisMotionValue(e).stop());
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
		Lo((e) => {
			if (!qc(e, n, this.currentDirection)) return;
			let t = this.getAxisMotionValue(e), { min: r, max: o } = a[e];
			t.set((t.get() || 0) + i[e] - ft(r, o, .5));
		});
	}
	scalePositionWithinConstraints() {
		if (!this.visualElement.current) return;
		let { drag: e, dragConstraints: t } = this.getProps(), { projection: n } = this.visualElement;
		if (!Uc(t) || !n || !this.constraints) return;
		this.stopAnimation();
		let r = this.constraints, i = {
			x: 0,
			y: 0
		};
		Lo((e) => {
			let t = this.getAxisMotionValue(e).get();
			i[e] = Fc({
				min: t,
				max: t
			}, r[e]);
		});
		let { transformTemplate: a } = this.visualElement.getProps();
		this.visualElement.current.style.transform = a ? a({}, "") : "none", n.root && n.root.updateScroll(), n.updateLayout(), this.constraints = !1, this.resolveConstraints(), Lo((t) => {
			let n = this.getAxisMotionValue(t);
			if (!qc(t, e, null) || !n.get()) return;
			let { min: r, max: a } = this.constraints[t];
			n.set(ft(r, a, i[t]));
		}), this.visualElement.render();
	}
	addListeners() {
		if (!this.visualElement.current) return;
		Vc.set(this.visualElement, this);
		let e = this.visualElement.current, t = Qs(e, "pointerdown", (t) => {
			let { drag: n, dragListener: r = !0 } = this.getProps(), i = t.target, a = i !== e && Ec(i);
			n && r && !a && this.start(t);
		}), n, r = () => {
			let { dragConstraints: t } = this.getProps(), r = Uc(t) && Wc(t);
			r && (this.constraints = this.resolveRefConstraints(), n ||= Kc(e, r, () => this.scalePositionWithinConstraints()));
		}, { projection: i } = this.visualElement, a = i.addEventListener("measure", r);
		i && !i.layout && (i.root && i.root.updateScroll(), i.updateLayout()), Nt.read(r);
		let o = Ss(window, "resize", () => this.scalePositionWithinConstraints()), s = i.addEventListener("didUpdate", (({ delta: e, hasLayoutChanged: t }) => {
			this.isDragging && t && (Lo((t) => {
				if (!qc(t, this.getProps().drag, this.currentDirection)) return;
				let n = this.getAxisMotionValue(t);
				this.originPoint[t] += e[t].translate, n.set(n.get() + e[t].translate);
			}), this.visualElement.render());
		}));
		return () => {
			o(), t(), a(), s && s(), n && n();
		};
	}
	getProps() {
		let e = this.readProps(), { drag: t = !1, dragDirectionLock: n = !1, dragPropagation: r = !1, dragConstraints: i = !1, dragElastic: a = Lc, dragMomentum: o = !0 } = e;
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
function Uc(e) {
	return !!e && typeof e == "object" && ("current" in e || "nodeType" in e);
}
var Wc = (e) => "current" in e ? e.current : e;
function Gc(e) {
	let t = !0;
	return () => {
		t ? t = !1 : e();
	};
}
function Kc(e, t, n) {
	let r = fc(e, Gc(n)), i = fc(t, Gc(n));
	return () => {
		r(), i();
	};
}
function qc(e, t, n) {
	return (t === !0 || t === e) && (n === null || n === e);
}
function Jc(e, t = 10) {
	let n = null;
	return Math.abs(e.y) > t ? n = "y" : Math.abs(e.x) > t && (n = "x"), n;
}
// node_modules/motion-dom/dist/es/gestures/utils/setup.mjs
function Yc(e, t) {
	let n = oa(e), r = new AbortController();
	return [
		n,
		{
			passive: !0,
			...t,
			signal: r.signal
		},
		ia(() => r.abort())
	];
}
// node_modules/motion-dom/dist/es/gestures/hover.mjs
function Xc(e) {
	return !(e.pointerType === "touch" || Oc());
}
function Zc(e, t, n = {}) {
	t = aa(t);
	let [r, i, a] = Yc(e, n);
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
			if (!Xc(n)) return;
			r = !1;
			let o = t(e, n);
			typeof o == "function" && (a = o, e.addEventListener("pointerleave", u, i));
		}, i), e.addEventListener("pointerdown", l, i);
	}), a;
}
// node_modules/motion-dom/dist/es/gestures/utils/is-node-or-child.mjs
var Qc = (e, t) => t ? e === t || Qc(e, t.parentElement) : !1, $c = /* @__PURE__ */ new WeakSet();
// node_modules/motion-dom/dist/es/gestures/press/utils/keyboard.mjs
function el(e) {
	return (t) => {
		t.key === "Enter" && e(t);
	};
}
function tl(e, t) {
	e.dispatchEvent(new PointerEvent("pointer" + t, {
		isPrimary: !0,
		bubbles: !0
	}));
}
var nl = (e, t) => {
	let n = !1, r = el(() => {
		$c.has(e) || (n = !0, tl(e, "down"));
	}), i = el(() => {
		n && (n = !1, tl(e, "up"));
	});
	e.addEventListener("keydown", r, t), e.addEventListener("keyup", i, t), e.addEventListener("blur", () => {
		e.removeEventListener("keydown", r), e.removeEventListener("keyup", i), n && tl(e, "cancel");
	}, {
		...t,
		once: !0
	});
};
// node_modules/motion-dom/dist/es/gestures/press/index.mjs
function rl(e) {
	return Ys(e) && !Oc();
}
var il = /* @__PURE__ */ new WeakSet();
function al(e, t, n = {}) {
	t = aa(t);
	let [r, i, a] = Yc(e, n), o = (e) => {
		let r = e.currentTarget;
		if (!rl(e) || il.has(e)) return;
		$c.add(r), n.stopPropagation && il.add(e);
		let a = t(r, e), o = {
			...i,
			capture: !0
		}, s = (e, t) => {
			window.removeEventListener("pointerup", c, o), window.removeEventListener("pointercancel", l, o), $c.has(r) && $c.delete(r), rl(e) && typeof a == "function" && a(e, { success: t });
		}, c = (e) => {
			s(e, r === window || r === document || n.useGlobalTarget || Qc(r, e.target));
		}, l = (e) => {
			s(e, !1);
		};
		window.addEventListener("pointerup", c, o), window.addEventListener("pointercancel", l, o);
	};
	return r.forEach((e) => {
		(n.useGlobalTarget ? window : e).addEventListener("pointerdown", o, i), ta(e) && (e.addEventListener("focus", () => nl(e, i), i), !wc(e) && !e.hasAttribute("tabindex") && (e.tabIndex = 0));
	}), a;
}
// node_modules/motion-dom/dist/es/render/Feature.mjs
var ol = class {
	constructor(e) {
		this.isMounted = !1, this.node = e;
	}
	update() {}
}, sl = /* @__PURE__ */ new Set([
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
]), cl = (e) => typeof e == "string" && e.toLowerCase() === "svg";
// node_modules/motion-dom/dist/es/render/svg/utils/render.mjs
function ll(e, t, n, r) {
	Ws(e, t, void 0, r);
	for (let n in t.attrs) e.setAttribute(sl.has(n) ? n : sa(n), t.attrs[n]);
}
// node_modules/motion-dom/dist/es/render/svg/utils/scrape-motion-values.mjs
function ul(e, t, n) {
	let r = Ks(e, t, n);
	for (let n in e) if (n !== "children" && (Li(e[n]) || Li(t[n]))) {
		let t = Yn.indexOf(n) === -1 ? n : "attr" + n.charAt(0).toUpperCase() + n.substring(1);
		r[t] = e[n];
	}
	return r;
}
// node_modules/motion-dom/dist/es/render/svg/SVGVisualElement.mjs
var dl = class extends Us {
	constructor() {
		super(...arguments), this.type = "svg", this.isSVGTag = !1, this.measureInstanceViewportBox = wo;
	}
	getBaseTargetFromProps(e, t) {
		return Xn.has(t) ? super.getBaseTargetFromProps(e, t) ?? Gn(t) : e[t];
	}
	getDefaultValue(e) {
		return Xn.has(e) ? this.latestValues[e] ?? Gn(e) : void 0;
	}
	readValueFromInstance(e, t) {
		if (Xn.has(t)) {
			let e = Nn(t);
			return e && e.default || 0;
		}
		if (fa.includes(t)) {
			let n = getComputedStyle(e)[t];
			if (typeof n == "string" && n) return n.trim();
		}
		return t = sl.has(t) ? t : sa(t), e.getAttribute(t);
	}
	scrapeMotionValuesFromProps(e, t, n) {
		return ul(e, t, n);
	}
	build(e, t, n) {
		pa(e, t, this.isSVGTag, n.transformTemplate, n.style);
	}
	renderInstance(e, t, n, r) {
		ll(e, t, n, r);
	}
	mount(e) {
		this.isSVGTag = cl(e.tagName), super.mount(e);
	}
};
// node_modules/motion-dom/dist/es/render/utils/shallow-compare.mjs
function fl(e, t) {
	if (!Array.isArray(t)) return !1;
	let n = t.length;
	if (n !== e.length) return !1;
	for (let r = 0; r < n; r++) if (t[r] !== e[r]) return !1;
	return !0;
}
// node_modules/motion-dom/dist/es/render/utils/animation-state.mjs
var pl = [...ks].reverse();
function ml(e) {
	let t = (t) => Promise.all(t.map(({ animation: t, options: n }) => Ki(e, t, n))), n = gl(), r = !0, i = !1;
	function a(a) {
		let { props: o, parent: s, manuallyAnimateOnMount: c } = e, l = r || i, u = [], d = /* @__PURE__ */ new Set(), f = {}, p = Infinity, m = e;
		do
			m = m.props.inherit !== !1 && m.parent;
		while (m && !m.isControllingVariants);
		if (pl.forEach((t, r) => {
			let i = n[t], h = o[t], g = m && m.props[t], _ = h === void 0 ? Os(g) || g === !1 ? g : void 0 : h, v = Os(_), y = t === a ? i.isActive : null;
			y === !1 && (p = r);
			let b = v && h === void 0 && !(l && c);
			if (i.protectedKeys = { ...f }, !i.isActive && y === null || !_ && !i.prevProp || Ds(_) || typeof _ == "boolean") return;
			if (t === "exit" && i.isActive && y !== !0) {
				f = {
					...f,
					...i.prevResolvedValues
				};
				return;
			}
			let x = hl(i.prevProp, _), S = x || v && (y && !b || r > p), C = !1, w = Array.isArray(_) ? _ : [_], T = {};
			if (y !== !1) for (let n of w) {
				let { transition: r, transitionEnd: i, ...a } = Ai(e, n, ji(e, t)) || {};
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
				let n = T[t], r = E[t], a = Array.isArray(n) && Array.isArray(r) ? !fl(n, r) || x : n !== r;
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
					let t = Ai(s, n)?.transition?.delayChildren;
					r.delay = li(s.enteringChildren, e, t);
				}
				u.push({
					animation: n,
					options: r
				});
			}
		}), d.size) {
			let { initial: t } = o, n = {}, r = typeof t != "boolean" && Ai(e, Array.isArray(t) ? t[0] : t, e.presenceContext?.custom);
			r && r.transition && (n.transition = r.transition), d.forEach((i) => {
				let a = e.getValue(i);
				a && (a.liveStyle = !0);
				let s = r && !Array.isArray(t) ? r[i] : void 0, c = e.getBaseTargetFromProps(o, i);
				n[i] = (s === void 0 ? c !== void 0 && !Li(c) ? c : e.initialValues[i] === void 0 ? e.baseTarget[i] : void 0 : s) ?? null;
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
			n = gl(), i = !0;
		}
	};
}
function hl(e, t) {
	return typeof t == "string" ? t !== e : Array.isArray(t) ? !fl(t, e) : !1;
}
function gl() {
	let e = {};
	for (let t of ks) e[t] = {
		isActive: t === "animate",
		protectedKeys: {},
		needsAnimating: {},
		prevResolvedValues: {}
	};
	return e;
}
// node_modules/framer-motion/dist/es/context/MotionConfigContext.mjs
var _l = /* @__PURE__ */ (0, y.createContext)({
	transformPagePoint: (e) => e,
	isStatic: !1,
	reducedMotion: "never"
});
// node_modules/framer-motion/dist/es/components/AnimatePresence/use-presence.mjs
function vl(e = !0) {
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
var yl = /* @__PURE__ */ (0, y.createContext)({ strict: !1 }), bl = {
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
}, xl = !1;
function Sl() {
	if (xl) return;
	let e = {};
	for (let t in bl) e[t] = { isEnabled: (e) => bl[t].some((t) => !!e[t]) };
	Bs(e), xl = !0;
}
function Cl() {
	return Sl(), Vs();
}
// node_modules/framer-motion/dist/es/motion/features/load-features.mjs
function wl(e) {
	let t = Cl();
	for (let n in e) t[n] = {
		...t[n],
		...e[n]
	};
	Bs(t);
}
// node_modules/framer-motion/dist/es/components/MotionConfig/index.mjs
var Y = v();
function Tl({ children: e, ...t }) {
	let n = (0, y.useContext)(_l);
	t = {
		...n,
		...t
	}, t.transition = hi(t.transition, n.transition), t.isStatic = x(() => t.isStatic);
	let r = (0, y.useMemo)(() => t, [
		JSON.stringify(t.transition),
		t.transformPagePoint,
		t.reducedMotion,
		t.skipAnimations,
		t.isValidProp
	]);
	return (0, Y.jsx)(_l.Provider, {
		value: r,
		children: e
	});
}
// node_modules/framer-motion/dist/es/context/MotionContext/index.mjs
var El = /* @__PURE__ */ (0, y.createContext)({});
// node_modules/framer-motion/dist/es/context/MotionContext/utils.mjs
function Dl(e, t) {
	if (js(e)) {
		let { initial: t, animate: n } = e;
		return {
			initial: t === !1 || Os(t) ? t : void 0,
			animate: Os(n) ? n : void 0
		};
	}
	return e.inherit === !1 ? {} : t;
}
// node_modules/framer-motion/dist/es/context/MotionContext/create.mjs
function Ol(e) {
	let { initial: t, animate: n } = Dl(e, (0, y.useContext)(El));
	return (0, y.useMemo)(() => ({
		initial: t,
		animate: n
	}), [kl(t), kl(n)]);
}
function kl(e) {
	return Array.isArray(e) ? e.join(" ") : e;
}
// node_modules/framer-motion/dist/es/render/html/utils/create-render-state.mjs
var Al = () => ({
	style: {},
	transform: {},
	transformOrigin: {},
	vars: {}
});
// node_modules/framer-motion/dist/es/render/html/use-props.mjs
function jl(e, t, n) {
	for (let r in t) !Li(t[r]) && !Gs(r, n) && (e[r] = t[r]);
}
function Ml({ transformTemplate: e }, t) {
	return (0, y.useMemo)(() => {
		let n = Al();
		return ca(n, t, e), Object.assign({}, n.vars, n.style);
	}, [t]);
}
function Nl(e, t) {
	let n = e.style || {}, r = {};
	return jl(r, n, e), Object.assign(r, Ml(e, t)), r;
}
function Pl(e, t) {
	let n = {}, r = Nl(e, t);
	return e.drag && e.dragListener !== !1 && (n.draggable = !1, r.userSelect = r.WebkitUserSelect = r.WebkitTouchCallout = "none", r.touchAction = e.drag === !0 ? "none" : `pan-${e.drag === "x" ? "y" : "x"}`), e.tabIndex === void 0 && (e.onTap || e.onTapStart || e.whileTap) && (n.tabIndex = 0), n.style = r, n;
}
// node_modules/framer-motion/dist/es/render/svg/utils/create-render-state.mjs
var Fl = () => ({
	...Al(),
	attrs: {}
});
// node_modules/framer-motion/dist/es/render/svg/use-props.mjs
function Il(e, t, n, r) {
	let i = (0, y.useMemo)(() => {
		let n = Fl();
		return pa(n, t, cl(r), e.transformTemplate, e.style), {
			...n.attrs,
			style: { ...n.style }
		};
	}, [t]);
	if (e.style) {
		let t = {};
		return jl(t, e.style, e), {
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
var Ll = /* @__PURE__ */ new Set(/* @__PURE__ */ "animate.exit.variants.initial.style.values.transition.transformTemplate.custom.inherit.onBeforeLayoutMeasure.onAnimationStart.onAnimationComplete.onUpdate.onDragStart.onDrag.onDragEnd.onMeasureDragConstraints.onDirectionLock.onDragTransitionEnd._dragX._dragY.onHoverStart.onHoverEnd.onViewportEnter.onViewportLeave.globalTapTarget.propagate.ignoreStrict.viewport".split("."));
function Rl(e) {
	return e.startsWith("while") || e.startsWith("drag") && e !== "draggable" || e.startsWith("layout") || e.startsWith("onTap") || e.startsWith("onPan") || e.startsWith("onLayout") || Ll.has(e);
}
// node_modules/framer-motion/dist/es/render/dom/utils/filter-props.mjs
function zl(e, t) {
	return e.startsWith("on") ? !Rl(e) : t?.(e) ?? !Rl(e);
}
function Bl(e, t, n, r) {
	let i = {};
	for (let a in e) a === "values" && typeof e.values == "object" || Li(e[a]) || (zl(a, r) || n === !0 && Rl(a) || !t && !Rl(a) || e.draggable && a.startsWith("onDrag")) && (i[a] = e[a]);
	return i;
}
// node_modules/framer-motion/dist/es/render/svg/lowercase-elements.mjs
var Vl = [
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
function Hl(e) {
	return typeof e != "string" || e.includes("-") ? !1 : !!(Vl.indexOf(e) > -1 || /[A-Z]/u.test(e));
}
// node_modules/framer-motion/dist/es/render/dom/use-render.mjs
function Ul(e, t, n, { latestValues: r }, i, a = !1, o, s) {
	let c = (o ?? Hl(e) ? Il : Pl)(t, r, i, e), l = Bl(t, typeof e == "string", a, s), u = e === y.Fragment ? {} : {
		...l,
		...c,
		ref: n
	}, { children: d } = t, f = (0, y.useMemo)(() => Li(d) ? d.get() : d, [d]);
	return (0, y.createElement)(e, {
		...u,
		children: f
	});
}
// node_modules/framer-motion/dist/es/motion/utils/use-visual-state.mjs
function Wl({ scrapeMotionValuesFromProps: e, createRenderState: t }, n, r, i) {
	return {
		latestValues: Gl(n, r, i, e),
		renderState: t()
	};
}
function Gl(e, t, n, r) {
	let i = {}, a = r(e, {});
	for (let e in a) i[e] = Ha(a[e]);
	let { initial: o, animate: s } = e, c = js(e), l = Ms(e);
	t && l && !c && e.inherit !== !1 && (o === void 0 && (o = t.initial), s === void 0 && (s = t.animate));
	let u = n ? n.initial === !1 : !1;
	u ||= o === !1;
	let d = u ? s : o;
	if (d && typeof d != "boolean" && !Ds(d)) {
		let t = Array.isArray(d) ? d : [d];
		for (let n = 0; n < t.length; n++) {
			let r = ki(e, t[n]);
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
var Kl = (e) => (t, n) => {
	let r = (0, y.useContext)(El), i = (0, y.useContext)(C), a = () => Wl(e, t, r, i);
	return n ? a() : x(a);
}, ql = /*@__PURE__*/ Kl({
	scrapeMotionValuesFromProps: Ks,
	createRenderState: Al
}), Jl = /*@__PURE__*/ Kl({
	scrapeMotionValuesFromProps: ul,
	createRenderState: Fl
}), Yl = /* @__PURE__ */ Symbol.for("motionComponentSymbol");
// node_modules/framer-motion/dist/es/motion/utils/use-motion-ref.mjs
function Xl(e, t, n) {
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
var Zl = /* @__PURE__ */ (0, y.createContext)({});
// node_modules/framer-motion/dist/es/utils/is-ref-object.mjs
function Ql(e) {
	return e && typeof e == "object" && Object.prototype.hasOwnProperty.call(e, "current");
}
// node_modules/framer-motion/dist/es/motion/utils/use-visual-element.mjs
function $l(e, t, n, r, i, a) {
	let { visualElement: o } = (0, y.useContext)(El), s = (0, y.useContext)(yl), c = (0, y.useContext)(C), l = (0, y.useContext)(_l), u = l.reducedMotion, d = l.skipAnimations, f = (0, y.useRef)(null), p = (0, y.useRef)(!1);
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
	let m = f.current, h = (0, y.useContext)(Zl);
	m && !m.projection && i && (m.type === "html" || m.type === "svg") && eu(f.current, n, i, h), (0, y.useInsertionEffect)(() => {
		m && m.props !== n && m.update(n, c);
	});
	let g = n[Bi], _ = (0, y.useRef)(!!g && typeof window < "u" && !window.MotionHandoffIsComplete?.(g) && window.MotionHasOptimisedAnimation?.(g));
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
function eu(e, t, n, r) {
	let { layoutId: i, layout: a, drag: o, dragConstraints: s, layoutScroll: c, layoutRoot: l, layoutAnchor: u, layoutCrossfade: d } = t, f = e.projection = new n(e.latestValues, t["data-framer-portal-id"] ? void 0 : tu(e.parent));
	f.setOptions({
		layoutId: i,
		layout: a,
		alwaysMeasureLayout: !!o || s && Ql(s),
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
function tu(e) {
	if (e) return e.options.allowProjection === !1 ? tu(e.parent) : e.projection;
}
// node_modules/framer-motion/dist/es/motion/index.mjs
function nu(e, { forwardMotionProps: t = !1, type: n } = {}, r, i) {
	r && wl(r);
	let a = n ? n === "svg" : Hl(e), o = a ? Jl : ql;
	function s(n, s) {
		let c, l = ru(n);
		x(() => !!ws.current?.sharedNodes.get(l)?.lead && n.initial) && (n = {
			...n,
			initial: !1
		});
		let u = {
			...(0, y.useContext)(_l),
			...n,
			layoutId: l
		}, { isStatic: d, isValidProp: f } = u, p = Ol(n), m = o(n, d);
		if (!d && typeof window < "u") {
			iu(u, r);
			let t = au(u);
			c = t.MeasureLayout, p.visualElement = $l(e, m, u, i, t.ProjectionNode, a);
		}
		return (0, Y.jsxs)(El.Provider, {
			value: p,
			children: [c && p.visualElement ? (0, Y.jsx)(c, {
				visualElement: p.visualElement,
				...u
			}) : null, Ul(e, n, Xl(m, p.visualElement, s), m, d, t, a, f)]
		});
	}
	s.displayName = `motion.${typeof e == "string" ? e : `create(${e.displayName ?? e.name ?? ""})`}`;
	let c = (0, y.forwardRef)(s);
	return c[Yl] = e, c;
}
function ru({ layoutId: e }) {
	let t = (0, y.useContext)(b).id;
	return t && e !== void 0 ? t + "-" + e : e;
}
function iu(e, t) {
	(0, y.useContext)(yl).strict;
}
function au(e) {
	let { drag: t, layout: n } = Cl();
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
function ou(e, t) {
	if (typeof Proxy > "u") return nu;
	let n = /* @__PURE__ */ new Map(), r = (n, r) => nu(n, r, e, t);
	return new Proxy((e, t) => r(e, t), { get: (i, a) => a === "create" ? r : (n.has(a) || n.set(a, nu(a, void 0, e, t)), n.get(a)) });
}
// node_modules/framer-motion/dist/es/render/dom/create-visual-element.mjs
var su = (e, t) => t.isSVG ?? Hl(e) ? new dl(t) : new Js(t, { allowProjection: e !== y.Fragment }), cu = class extends ol {
	constructor(e) {
		super(e), e.animationState ||= ml(e);
	}
	updateAnimationControlsSubscription() {
		let { animate: e } = this.node.getProps();
		Ds(e) && (this.unmountControls = e.subscribe(this.node));
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
}, lu = 0, uu = {
	animation: { Feature: cu },
	exit: { Feature: class extends ol {
		constructor() {
			super(...arguments), this.id = lu++;
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
						let { transition: t, transitionEnd: n, ...r } = Ai(this.node, e) || {};
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
}, du = class extends ol {
	constructor(e) {
		super(e), this.removeGroupControls = M, this.removeListeners = M, this.controls = new Hc(e);
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
}, fu = ({ current: e }) => e ? e.ownerDocument.defaultView : null, pu = (e) => (t, n) => {
	e && Nt.update(() => e(t, n), !1, !0);
}, mu = class extends ol {
	constructor() {
		super(...arguments), this.removePointerDownListener = M;
	}
	onPointerDown(e) {
		this.session = new gc(e, this.createPanHandlers(), {
			transformPagePoint: this.node.getTransformPagePoint(),
			contextWindow: fu(this.node)
		});
	}
	createPanHandlers() {
		let { onPanSessionStart: e, onPanStart: t, onPan: n, onPanEnd: r } = this.node.getProps();
		return {
			onSessionStart: pu(e),
			onStart: pu(t),
			onMove: pu(n),
			onEnd: (e, t) => {
				delete this.session, r && Nt.postRender(() => r(e, t));
			}
		};
	}
	mount() {
		this.removePointerDownListener = Qs(this.node.current, "pointerdown", (e) => this.onPointerDown(e));
	}
	update() {
		this.session && this.session.updateHandlers(this.createPanHandlers());
	}
	unmount() {
		this.removePointerDownListener(), this.session && this.session.end();
	}
}, hu = !1, gu = ({ layout: e, layoutDependency: t }) => ({
	layout: e,
	layoutDependency: t,
	animationType: typeof e == "string" ? e : "both"
}), _u = class extends y.Component {
	componentDidMount() {
		let { visualElement: e, layoutGroup: t, switchLayoutGroup: n, layoutId: r } = this.props, { projection: i } = e;
		i && (t.group && t.group.add(i), n && n.register && r && n.register(i), hu && i.root.didUpdate(), i.addEventListener("animationComplete", () => {
			this.safeToRemove();
		}), i.setOptions({
			...i.options,
			...gu(this.props),
			onExitComplete: () => this.safeToRemove()
		})), Bo.hasEverUpdated = !0;
	}
	getSnapshotBeforeUpdate(e) {
		let { layout: t, layoutDependency: n, visualElement: r, drag: i, isPresent: a } = this.props, { projection: o } = r;
		return o && (o.isPresent = a, (e.layoutDependency !== n || e.layout !== t) && o.setOptions({
			...o.options,
			...gu(this.props)
		}), hu = !0, i || e.layoutDependency !== n || n === void 0 || e.isPresent !== a ? o.willUpdate() : this.safeToRemove(), e.isPresent !== a && (a ? o.promote() : o.relegate() || Nt.postRender(() => {
			let e = o.getStack();
			e && e.members.length || this.safeToRemove();
		}))), null;
	}
	componentDidUpdate() {
		let { visualElement: e, layoutAnchor: t } = this.props, { projection: n } = e;
		n && (n.options.layoutAnchor = t, n.root.didUpdate(), Fa.postRender(() => {
			!n.currentAnimation && n.isLead() && this.safeToRemove();
		}));
	}
	componentWillUnmount() {
		let { visualElement: e, layoutGroup: t, switchLayoutGroup: n } = this.props, { projection: r } = e;
		hu = !0, r && (r.scheduleCheckAfterUnmount(), t && t.group && t.group.remove(r), n && n.deregister && n.deregister(r));
	}
	safeToRemove() {
		let { safeToRemove: e } = this.props;
		e && e();
	}
	render() {
		return null;
	}
};
function vu(e) {
	let [t, n] = vl(), r = (0, y.useContext)(b);
	return (0, Y.jsx)(_u, {
		...e,
		layoutGroup: r,
		switchLayoutGroup: (0, y.useContext)(Zl),
		isPresent: t,
		safeToRemove: n
	});
}
// node_modules/framer-motion/dist/es/motion/features/drag.mjs
var yu = {
	pan: { Feature: mu },
	drag: {
		Feature: du,
		ProjectionNode: Ts,
		MeasureLayout: vu
	}
};
// node_modules/framer-motion/dist/es/gestures/hover.mjs
function bu(e, t, n) {
	let { props: r } = e;
	e.animationState && r.whileHover && e.animationState.setActive("whileHover", n === "Start");
	let i = r["onHover" + n];
	i && Nt.postRender(() => i(t, Xs(t)));
}
var xu = class extends ol {
	mount() {
		let { current: e } = this.node;
		e && (this.unmount = Zc(e, (e, t) => (bu(this.node, t, "Start"), (e) => bu(this.node, e, "End"))));
	}
	unmount() {}
}, Su = class extends ol {
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
		this.unmount = ee(Ss(this.node.current, "focus", () => this.onFocus()), Ss(this.node.current, "blur", () => this.onBlur()));
	}
	unmount() {}
};
// node_modules/framer-motion/dist/es/gestures/press.mjs
function Cu(e, t, n) {
	let { props: r } = e;
	if (e.current instanceof HTMLButtonElement && e.current.disabled) return;
	e.animationState && r.whileTap && e.animationState.setActive("whileTap", n === "Start");
	let i = r["onTap" + (n === "End" ? "" : n)];
	i && Nt.postRender(() => i(t, Xs(t)));
}
var wu = class extends ol {
	mount() {
		let { current: e } = this.node;
		if (!e) return;
		let { globalTapTarget: t, propagate: n } = this.node.props;
		this.unmount = al(e, (e, t) => (Cu(this.node, t, "Start"), (e, { success: t }) => Cu(this.node, e, t ? "End" : "Cancel")), {
			useGlobalTarget: t,
			stopPropagation: n?.tap === !1
		});
	}
	unmount() {}
}, Tu = /* @__PURE__ */ new WeakMap(), Eu = /* @__PURE__ */ new WeakMap(), Du = (e) => {
	let t = Tu.get(e.target);
	t && t(e);
}, Ou = (e) => {
	e.forEach(Du);
};
function ku({ root: e, ...t }) {
	let n = e || document;
	Eu.has(n) || Eu.set(n, {});
	let r = Eu.get(n), i = JSON.stringify(t);
	return r[i] || (r[i] = new IntersectionObserver(Ou, {
		root: e,
		...t
	})), r[i];
}
function Au(e, t, n) {
	let r = ku(t);
	return Tu.set(e, n), r.observe(e), () => {
		Tu.delete(e), r.unobserve(e);
	};
}
// node_modules/framer-motion/dist/es/motion/features/viewport/index.mjs
var ju = {
	some: 0,
	all: 1
}, Mu = class extends ol {
	constructor() {
		super(...arguments), this.hasEnteredView = !1, this.isInView = !1;
	}
	startObserver() {
		this.stopObserver?.();
		let { viewport: e = {} } = this.node.getProps(), { root: t, margin: n, amount: r = "some", once: i } = e, a = {
			root: t ? t.current : void 0,
			rootMargin: n,
			threshold: typeof r == "number" ? r : ju[r]
		}, o = (e) => {
			let { isIntersecting: t } = e;
			if (this.isInView === t || (this.isInView = t, i && !t && this.hasEnteredView)) return;
			t && (this.hasEnteredView = !0), this.node.animationState && this.node.animationState.setActive("whileInView", t);
			let { onViewportEnter: n, onViewportLeave: r } = this.node.getProps(), a = t ? n : r;
			a && a(e);
		};
		this.stopObserver = Au(this.node.current, a, o);
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
		].some(Nu(e, t)) && this.startObserver();
	}
	unmount() {
		this.stopObserver?.(), this.hasEnteredView = !1, this.isInView = !1;
	}
};
function Nu({ viewport: e = {} }, { viewport: t = {} } = {}) {
	return (n) => e[n] !== t[n];
}
// node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs
var Pu = /*@__PURE__*/ ou(/* @__PURE__ */ Object.assign({}, uu, {
	inView: { Feature: Mu },
	tap: { Feature: wu },
	focus: { Feature: Su },
	hover: { Feature: xu }
}, yu, { layout: {
	ProjectionNode: Ts,
	MeasureLayout: vu
} }), su);
// node_modules/framer-motion/dist/es/utils/reduced-motion/use-reduced-motion.mjs
function Fu() {
	!Fs.current && Ls();
	let [e] = (0, y.useState)(Ps.current);
	return e;
}
// node_modules/motion/dist/es/react.mjs
var Iu = m(), Lu = g(), Ru = Pu, zu = (e) => e?.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
// node_modules/lucide-react/dist/esm/shared/src/utils/toLucideIconData.mjs
function Bu(e, t, n = []) {
	if (t == null) throw Error("[lucide]: iconNode is required when icon name is used");
	return {
		name: zu(e),
		size: 24,
		node: t,
		...n.length > 0 ? { aliases: n } : {}
	};
}
// node_modules/lucide-react/dist/esm/shared/src/utils/toCamelCase.mjs
var Vu = (e) => {
	let t = "", n = !1;
	for (let r of e) r === "-" || r === "_" || r <= " " ? n = t.length > 0 : (t.length === 0 ? t += r.toLowerCase() : t += n ? r.toUpperCase() : r, n = !1);
	return t;
}, Hu = (e) => {
	let t = Vu(e);
	return t.charAt(0).toUpperCase() + t.slice(1);
}, Uu = (...e) => e.filter((e, t, n) => !!e && e.trim() !== "" && n.indexOf(e) === t).join(" ").trim(), Wu = {
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
function Gu(e) {
	return e != null;
}
function Ku(e, t = {}) {
	let n = t.attributeNames ?? {}, r = (e) => n[e] ?? e, i = e.size ?? e.width ?? Wu.width, a = e.size ?? e.height ?? Wu.height, o = e.aliases?.filter((e) => typeof e == "string" && e.trim() !== "").map((e) => `lucide-${e}`) ?? [], s = [...e.name ? [`lucide-${e.name}`] : [], ...o], c = t.className?.split(" ").filter(Boolean) ?? [], l = t.includeDefaultClasses === !1 ? Uu(...c) : Uu("lucide", ...s, ...c), u = t.absoluteStrokeWidth ? Number(t.strokeWidth ?? Wu["stroke-width"]) * Number(e.size ?? e.width ?? Wu.width) / Number(t.size ?? t.width ?? Wu.width) : t.strokeWidth ?? Wu["stroke-width"];
	return [
		"svg",
		{
			...Object.entries(Wu).reduce((e, [t, n]) => (e[r(t)] = n, e), {}),
			..."color" in t && t.color && { [r("stroke")]: t.color },
			..."size" in t && Gu(t.size) && {
				[r("width")]: t.size,
				[r("height")]: t.size
			},
			..."width" in t && Gu(t.width) && { [r("width")]: t.width },
			..."height" in t && Gu(t.height) && { [r("height")]: t.height },
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
function qu(e, t = {}) {
	return Ku(e, {
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
var Ju = (e) => {
	for (let t in e) if (t.startsWith("aria-") || t === "role" || t === "title") return !0;
	return !1;
}, Yu = (0, y.createContext)({}), Xu = () => (0, y.useContext)(Yu), Zu = (0, y.forwardRef)(({ color: e, size: t, width: n, height: r, strokeWidth: i, absoluteStrokeWidth: a, nonScalingStroke: o, className: s = "", children: c, iconNode: l = [], icon: u = {
	node: l,
	aliases: [],
	size: 24
}, ...d }, f) => {
	let { size: p = 24, strokeWidth: m = 2, absoluteStrokeWidth: h = !1, nonScalingStroke: g = !1, color: _ = "currentColor", className: v = "" } = Xu() ?? {}, b = !!c || Ju(d), [x, S, C = []] = qu(u, {
		color: e ?? _,
		width: n ?? t ?? p,
		height: r ?? t ?? p,
		strokeWidth: i ?? m,
		absoluteStrokeWidth: a ?? h,
		nonScalingStroke: o ?? g,
		className: Uu(v, s),
		hasA11yProp: b,
		attributes: d
	});
	return (0, y.createElement)(x, {
		ref: f,
		...S
	}, [...C.map(([e, t]) => (0, y.createElement)(e, t)), ...Array.isArray(c) ? c : [c]]);
});
// node_modules/lucide-react/dist/esm/createLucideIcon.mjs
function X(e, t = [], n = []) {
	let r = typeof e == "string" ? Bu(e, t, n) : e, i = (0, y.forwardRef)(({ className: e, ...t }, n) => (0, y.createElement)(Zu, {
		ref: n,
		icon: r,
		className: e,
		...t
	}));
	return r.name && (i.displayName = Hu(r.name)), i;
}
// node_modules/lucide-react/dist/esm/icons/arrow-left.mjs
var Qu = {
	name: "arrow-left",
	size: 24,
	node: [["path", {
		d: "m12 19-7-7 7-7",
		key: "1l729n"
	}], ["path", {
		d: "M19 12H5",
		key: "x3x0zl"
	}]]
};
Qu.node;
var $u = X(Qu), ed = {
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
ed.node;
var td = X(ed), nd = {
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
nd.node;
var rd = X(nd), id = {
	name: "chart-no-axes-column",
	size: 24,
	node: [
		["path", {
			d: "M5 21v-6",
			key: "1hz6c0"
		}],
		["path", {
			d: "M12 21V3",
			key: "1lcnhd"
		}],
		["path", {
			d: "M19 21V9",
			key: "unv183"
		}]
	],
	aliases: ["bar-chart-2"]
};
id.node;
var ad = X(id), od = {
	name: "check",
	size: 24,
	node: [["path", {
		d: "M20 6 9 17l-5-5",
		key: "1gmf2c"
	}]]
};
od.node;
var sd = X(od), cd = {
	name: "chevron-down",
	size: 24,
	node: [["path", {
		d: "m6 9 6 6 6-6",
		key: "qrunsl"
	}]]
};
cd.node;
var ld = X(cd), ud = {
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
ud.node;
var dd = X(ud), fd = {
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
fd.node;
var pd = X(fd), md = {
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
md.node;
var hd = X(md), gd = {
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
gd.node;
var _d = X(gd), vd = {
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
vd.node;
var yd = X(vd), bd = {
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
bd.node;
var xd = X(bd), Sd = {
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
Sd.node;
var Cd = X(Sd), wd = {
	name: "scan-search",
	size: 24,
	node: [
		["path", {
			d: "M3 7V5a2 2 0 0 1 2-2h2",
			key: "aa7l1z"
		}],
		["path", {
			d: "M17 3h2a2 2 0 0 1 2 2v2",
			key: "4qcy5o"
		}],
		["path", {
			d: "M21 17v2a2 2 0 0 1-2 2h-2",
			key: "6vwrx8"
		}],
		["path", {
			d: "M7 21H5a2 2 0 0 1-2-2v-2",
			key: "ioqczr"
		}],
		["circle", {
			cx: "12",
			cy: "12",
			r: "3",
			key: "1v7zrd"
		}],
		["path", {
			d: "m16 16-1.9-1.9",
			key: "1dq9hf"
		}]
	]
};
wd.node;
var Td = X(wd), Ed = {
	name: "shield-check",
	size: 24,
	node: [["path", {
		d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
		key: "oel41y"
	}], ["path", {
		d: "m9 12 2 2 4-4",
		key: "dzmm74"
	}]]
};
Ed.node;
var Dd = X(Ed), Od = {
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
Od.node;
var kd = X(Od), Ad = {
	name: "truck",
	size: 24,
	node: [
		["path", {
			d: "M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2",
			key: "wrbu53"
		}],
		["path", {
			d: "M15 18H9",
			key: "1lyqi6"
		}],
		["path", {
			d: "M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14",
			key: "lysw3i"
		}],
		["circle", {
			cx: "17",
			cy: "18",
			r: "2",
			key: "332jqn"
		}],
		["circle", {
			cx: "7",
			cy: "18",
			r: "2",
			key: "19iecd"
		}]
	]
};
Ad.node;
var jd = X(Ad), Md = {
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
Md.node;
var Nd = X(Md), Pd = Object.freeze({
	publicHome: "/",
	publicAbout: "/quem-somos",
	publicPlatform: "/plataforma",
	publicCases: "/casos",
	publicFaq: "/duvidas",
	access: "/acesso",
	context: "/app/contexto",
	buyerHome: "/app/comprador/inicio",
	buyerSuppliers: "/app/comprador/fornecedores",
	buyerSupplierProfile: "/app/comprador/fornecedores/perfil",
	buyerReviews: "/app/comprador/avaliacoes",
	buyerConversations: "/app/comprador/conversas",
	supplierHome: "/app/fornecedor/inicio",
	supplierConversations: "/app/fornecedor/conversas",
	adminHome: "/app/administracao/inicio"
}), Fd = (e) => Object.freeze(e);
Object.freeze([
	Fd({
		id: "public-home",
		path: "/",
		surface: "public",
		access: "public",
		title: "SIVI — Vendas industriais"
	}),
	Fd({
		id: "public-about",
		path: Pd.publicAbout,
		surface: "public",
		access: "public",
		title: "Quem somos — SIVI"
	}),
	Fd({
		id: "public-platform",
		path: Pd.publicPlatform,
		surface: "public",
		access: "public",
		title: "Plataforma — SIVI"
	}),
	Fd({
		id: "public-cases",
		path: Pd.publicCases,
		surface: "public",
		access: "public",
		title: "Casos de uso — SIVI"
	}),
	Fd({
		id: "public-faq",
		path: Pd.publicFaq,
		surface: "public",
		access: "public",
		title: "Dúvidas — SIVI"
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
	].map(([e, t, n, r, i]) => Fd({
		id: `${e}-${n}`,
		path: `/app/${t}/${r}`,
		surface: "app",
		access: "authenticated",
		workspaceRole: e,
		section: n,
		title: i
	})),
	Fd({
		id: "supplier-profile",
		path: "/app/fornecedor/perfil",
		surface: "app",
		access: "authenticated",
		workspaceRole: "supplier",
		section: "profile",
		title: "Perfil industrial"
	}),
	Fd({
		id: "access",
		path: Pd.access,
		surface: "auth",
		access: "public",
		title: "Acesso"
	}),
	Fd({
		id: "context",
		path: Pd.context,
		surface: "app",
		access: "authenticated",
		title: "Empresas e atuação"
	}),
	Fd({
		id: "buyer-home",
		path: Pd.buyerHome,
		surface: "app",
		access: "authenticated",
		workspaceRole: "buyer",
		title: "Visão geral"
	}),
	Fd({
		id: "buyer-suppliers",
		path: Pd.buyerSuppliers,
		surface: "app",
		access: "authenticated",
		workspaceRole: "buyer",
		title: "Fornecedores"
	}),
	Fd({
		id: "buyer-supplier-profile",
		path: Pd.buyerSupplierProfile,
		surface: "app",
		access: "authenticated",
		workspaceRole: "buyer",
		title: "Perfil do fornecedor"
	}),
	Fd({
		id: "buyer-reviews",
		path: Pd.buyerReviews,
		surface: "app",
		access: "authenticated",
		workspaceRole: "buyer",
		title: "Avaliações"
	}),
	Fd({
		id: "buyer-conversations",
		path: Pd.buyerConversations,
		surface: "app",
		access: "authenticated",
		workspaceRole: "buyer",
		title: "Conversas"
	}),
	Fd({
		id: "supplier-home",
		path: Pd.supplierHome,
		surface: "app",
		access: "authenticated",
		workspaceRole: "supplier",
		title: "Visão do fornecedor"
	}),
	Fd({
		id: "supplier-conversations",
		path: Pd.supplierConversations,
		surface: "app",
		access: "authenticated",
		workspaceRole: "supplier",
		title: "Conversas"
	}),
	Fd({
		id: "admin-home",
		path: Pd.adminHome,
		surface: "app",
		access: "authenticated",
		workspaceRole: "administration",
		title: "Visão administrativa"
	})
]);
// src/public/components.tsx
var Id = {
	home: Pd.publicHome,
	about: Pd.publicAbout,
	platform: Pd.publicPlatform,
	cases: Pd.publicCases,
	faq: Pd.publicFaq
}, Ld = (e) => `#${Id[e]}`, Rd = (e, t) => `${Ld(e)}?secao=${encodeURIComponent(t)}`, zd = (e) => e === "funcionamento" || e === "compras" || e === "fornecimento", Bd = (e) => Rd(zd(e) ? "platform" : "home", e), Vd = (e) => `${Bd("funcionamento")}&etapa=${e}`, Hd = (e) => e === "sobre" ? Ld("about") : `#/?pagina=${encodeURIComponent(e)}`, Ud = (e) => `#/acesso?modo=register${e ? `&atuacao=${e}` : ""}`, Wd = [
	["about", "Quem somos"],
	["platform", "Plataforma"],
	["cases", "Casos de uso"],
	["faq", "Dúvidas"]
];
function Gd({ back: e = !1 }) {
	return /* @__PURE__ */ (0, Y.jsxs)("a", {
		className: "sv-brand",
		href: "#/",
		"aria-label": e ? "SIVI, voltar à página inicial" : "SIVI, início",
		children: [
			/* @__PURE__ */ (0, Y.jsx)("img", {
				src: "./src/assets/brand/raposa.svg",
				width: "36",
				height: "36",
				alt: ""
			}),
			/* @__PURE__ */ (0, Y.jsx)("span", { children: "SIVI" }),
			/* @__PURE__ */ (0, Y.jsxs)("small", { children: [
				"VENDAS",
				/* @__PURE__ */ (0, Y.jsx)("br", {}),
				"INDUSTRIAIS"
			] })
		]
	});
}
function Kd() {
	return /* @__PURE__ */ (0, Y.jsx)(rd, {
		className: "t-learn-chevron",
		size: 19,
		"aria-hidden": "true"
	});
}
function qd() {
	return /* @__PURE__ */ (0, Y.jsxs)("svg", {
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
		children: [/* @__PURE__ */ (0, Y.jsx)("path", {
			className: "t-learn-arm t-learn-arm-top",
			d: "M6 4L10 8"
		}), /* @__PURE__ */ (0, Y.jsx)("path", {
			className: "t-learn-arm t-learn-arm-bot",
			d: "M10 8L6 12"
		})]
	});
}
function Jd({ children: e, href: t = Ud(), secondary: n = !1, className: r = "" }) {
	return /* @__PURE__ */ (0, Y.jsxs)("a", {
		href: t,
		className: `sv-button t-learn ${n ? "sv-button--secondary" : ""} ${r}`,
		children: [e, /* @__PURE__ */ (0, Y.jsx)(qd, {})]
	});
}
function Yd({ current: e }) {
	let [t, n] = (0, y.useState)(!1), r = (0, y.useRef)(null), i = Wd.map(([t, n]) => /* @__PURE__ */ (0, Y.jsx)("a", {
		href: Ld(t),
		"aria-current": t === e ? "page" : void 0,
		children: n
	}, t)), a = /* @__PURE__ */ (0, Y.jsxs)(Y.Fragment, { children: [/* @__PURE__ */ (0, Y.jsxs)("a", {
		href: "#/acesso?modo=login",
		className: "sv-login-link",
		children: ["Entrar ", /* @__PURE__ */ (0, Y.jsx)(Kd, {})]
	}), /* @__PURE__ */ (0, Y.jsxs)("a", {
		className: "sv-nav-cta",
		href: Ud(),
		children: ["Cadastrar empresa ", /* @__PURE__ */ (0, Y.jsx)(Kd, {})]
	})] });
	return (0, y.useEffect)(() => {
		if (!t) return;
		let e = (e) => {
			e.key === "Escape" && (n(!1), r.current?.focus());
		};
		return window.addEventListener("keydown", e), () => window.removeEventListener("keydown", e);
	}, [t]), /* @__PURE__ */ (0, Y.jsxs)(Y.Fragment, { children: [/* @__PURE__ */ (0, Y.jsx)("a", {
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
	}), /* @__PURE__ */ (0, Y.jsx)("header", {
		className: "sv-header",
		"data-menu-open": t || void 0,
		children: /* @__PURE__ */ (0, Y.jsxs)("div", {
			className: "sv-nav sv-shell",
			children: [
				/* @__PURE__ */ (0, Y.jsx)(Gd, {}),
				/* @__PURE__ */ (0, Y.jsx)("button", {
					className: "sv-menu",
					ref: r,
					"aria-label": t ? "Fechar menu" : "Abrir menu",
					"aria-expanded": t,
					"aria-controls": "sv-navigation",
					onClick: () => n(!t),
					children: t ? /* @__PURE__ */ (0, Y.jsx)(Nd, {}) : /* @__PURE__ */ (0, Y.jsx)(xd, {})
				}),
				/* @__PURE__ */ (0, Y.jsx)("nav", {
					id: "sv-navigation",
					"aria-label": "Navegação principal",
					className: t ? "is-open" : "",
					onClick: () => n(!1),
					children: e === "home" ? /* @__PURE__ */ (0, Y.jsxs)(Y.Fragment, { children: [/* @__PURE__ */ (0, Y.jsx)("div", {
						className: "sv-home-nav-pages",
						children: i
					}), /* @__PURE__ */ (0, Y.jsx)("div", {
						className: "sv-home-nav-account",
						children: a
					})] }) : /* @__PURE__ */ (0, Y.jsxs)(Y.Fragment, { children: [i, a] })
				})
			]
		})
	})] });
}
var Xd = {
	name: "Sua conta",
	links: [["Entrar na minha conta", "#/acesso?modo=login"], ["Cadastrar empresa", Ud()]]
}, Zd = [["Privacidade", Hd("privacidade")], ["Condições de uso", Hd("condicoes")]], Qd = Hd("creditos"), $d = "info@sivi.com", ef = [{
	name: "Plataforma",
	links: [
		["Como funciona", Bd("funcionamento")],
		["Para compradores", Bd("compras")],
		["Para fornecedores", Bd("fornecimento")],
		["Casos de uso", Ld("cases")]
	]
}, {
	name: "Conheça o SIVI",
	links: [
		["Quem somos", Ld("about")],
		["Segurança e dados", Hd("seguranca")],
		["Ajuda e acesso", Hd("ajuda")],
		["Dúvidas sobre o cadastro", Ld("faq")]
	]
}];
function tf() {
	let [e, t] = (0, y.useState)(!1);
	function n(e) {
		e.preventDefault();
		let n = new FormData(e.currentTarget).get("email"), r = encodeURIComponent(`Olá! Gostaria de receber as novidades do SIVI neste e-mail: ${n}`);
		window.location.href = `mailto:${$d}?subject=Inscri%C3%A7%C3%A3o%20nas%20novidades%20do%20SIVI&body=${r}`, t(!0);
	}
	return /* @__PURE__ */ (0, Y.jsxs)("form", {
		className: "sv-footer-newsletter",
		"aria-labelledby": "sv-footer-newsletter-title",
		onSubmit: n,
		children: [
			/* @__PURE__ */ (0, Y.jsx)("h2", {
				id: "sv-footer-newsletter-title",
				children: "Receba novidades do SIVI"
			}),
			/* @__PURE__ */ (0, Y.jsxs)("div", {
				className: "sv-footer-newsletter-fields",
				children: [/* @__PURE__ */ (0, Y.jsx)("input", {
					type: "email",
					name: "email",
					"aria-label": "Seu e-mail",
					placeholder: "Seu e-mail",
					autoComplete: "email",
					required: !0,
					onChange: () => t(!1)
				}), /* @__PURE__ */ (0, Y.jsx)("button", {
					type: "submit",
					children: "Inscrever"
				})]
			}),
			/* @__PURE__ */ (0, Y.jsx)("p", {
				className: "sv-footer-newsletter-status",
				role: "status",
				children: e && "Envie a mensagem no seu aplicativo de e-mail para concluir o pedido."
			})
		]
	});
}
function nf({ home: e = !1 }) {
	let t = `© ${(/* @__PURE__ */ new Date()).getFullYear()} SIVI`, n = e ? ef : [...ef, {
		...Xd,
		links: [...Xd.links, ...Zd]
	}];
	return /* @__PURE__ */ (0, Y.jsx)("footer", {
		className: e ? "sv-footer public-footer sv-footer--home" : "sv-footer public-footer",
		children: /* @__PURE__ */ (0, Y.jsxs)("div", {
			className: "sv-shell",
			children: [/* @__PURE__ */ (0, Y.jsxs)("div", {
				className: "sv-footer-top",
				children: [
					/* @__PURE__ */ (0, Y.jsxs)("div", {
						className: "sv-footer-brand",
						children: [/* @__PURE__ */ (0, Y.jsx)(Gd, {}), /* @__PURE__ */ (0, Y.jsx)("small", { children: "Sistema Integrado de Vendas Industriais" })]
					}),
					n.map((t) => /* @__PURE__ */ (0, Y.jsxs)("nav", {
						"aria-label": t.name,
						children: [/* @__PURE__ */ (0, Y.jsx)("h2", { children: t.name }), t.links.map(([t, n]) => /* @__PURE__ */ (0, Y.jsx)("a", {
							href: n,
							children: e ? /* @__PURE__ */ (0, Y.jsx)("span", { children: t }) : t
						}, t))]
					}, t.name)),
					e && /* @__PURE__ */ (0, Y.jsxs)("div", {
						className: "sv-footer-contact-column",
						children: [/* @__PURE__ */ (0, Y.jsxs)("section", {
							className: "sv-footer-contact",
							"aria-labelledby": "sv-footer-contact-title",
							children: [/* @__PURE__ */ (0, Y.jsx)("h2", {
								id: "sv-footer-contact-title",
								children: "Contato"
							}), /* @__PURE__ */ (0, Y.jsxs)("address", { children: [
								/* @__PURE__ */ (0, Y.jsxs)("p", { children: [
									"SENAI Manuel Garcia Filho",
									/* @__PURE__ */ (0, Y.jsx)("br", {}),
									"Rua Guatemala, 19",
									/* @__PURE__ */ (0, Y.jsx)("br", {}),
									"Jardim Canhema"
								] }),
								/* @__PURE__ */ (0, Y.jsx)("a", {
									href: `mailto:${$d}`,
									children: /* @__PURE__ */ (0, Y.jsx)("span", { children: $d })
								}),
								/* @__PURE__ */ (0, Y.jsx)("p", { children: "(11) 0000-0000" })
							] })]
						}), /* @__PURE__ */ (0, Y.jsx)(tf, {})]
					})
				]
			}), e ? /* @__PURE__ */ (0, Y.jsxs)("div", {
				className: "sv-footer-bottom",
				children: [/* @__PURE__ */ (0, Y.jsxs)("div", {
					className: "sv-footer-legal",
					children: [/* @__PURE__ */ (0, Y.jsx)("span", { children: t }), /* @__PURE__ */ (0, Y.jsxs)("nav", {
						"aria-label": "Informações legais e créditos",
						children: [Zd.map(([e, t]) => /* @__PURE__ */ (0, Y.jsx)("a", {
							href: t,
							children: /* @__PURE__ */ (0, Y.jsx)("span", { children: e })
						}, t)), /* @__PURE__ */ (0, Y.jsx)("a", {
							href: Qd,
							children: /* @__PURE__ */ (0, Y.jsx)("span", { children: "Créditos de imagem e vídeo" })
						})]
					})]
				}), /* @__PURE__ */ (0, Y.jsx)("span", {
					className: "sv-footer-locale",
					children: "Português · Brasil"
				})]
			}) : /* @__PURE__ */ (0, Y.jsxs)("div", {
				className: "sv-footer-bottom",
				children: [
					/* @__PURE__ */ (0, Y.jsx)("span", { children: t }),
					/* @__PURE__ */ (0, Y.jsx)("a", {
						href: Qd,
						children: "Créditos de imagem e vídeo"
					}),
					/* @__PURE__ */ (0, Y.jsx)("span", { children: "Português · Brasil" }),
					/* @__PURE__ */ (0, Y.jsx)("a", {
						href: Bd("topo"),
						children: "Voltar ao início ↑"
					})
				]
			})]
		})
	});
}
function rf({ focusTitle: e = !1 }) {
	return (0, y.useEffect)(() => {
		let t = new URLSearchParams(location.hash.split("?")[1]).get("secao"), n = requestAnimationFrame(() => {
			let n = document.getElementById("public-title"), r = t && t !== "topo" ? document.getElementById(t) : null;
			r ? (r.focus({ preventScroll: !0 }), r.scrollIntoView({
				block: "start",
				behavior: "instant"
			})) : ((t === "topo" || e) && n?.focus({ preventScroll: !0 }), window.scrollTo(0, 0));
		});
		return () => cancelAnimationFrame(n);
	}, [e]), null;
}
// src/public/purchase-examples.tsx
var af = [
	{
		id: "ficha-de-demanda",
		step: 1,
		Icon: _d,
		title: "Ficha de demanda",
		context: "Uma empresa precisa encomendar 240 peças em alumínio. Para cotar corretamente, o fornecedor precisa saber qual liga usar e qual processo está previsto.",
		walkthrough: "O comprador descreve o item, indica material, processo e quantidade e publica a demanda. O fornecedor consulta a especificação antes de preparar a proposta.",
		record: "Os requisitos ficam disponíveis no contexto da demanda que deu origem à negociação.",
		fields: [
			["Material", "Alumínio 6061"],
			["Processo", "Usinagem CNC"],
			["Quantidade", "240 peças"]
		]
	},
	{
		id: "comparacao-de-propostas",
		step: 3,
		Icon: yd,
		title: "Comparação de propostas",
		context: "Uma cotação tem o menor preço e outra atende a um prazo mais curto. A escolha também depende do frete e das condições de pagamento.",
		walkthrough: "O comprador compara as propostas da mesma demanda. Se o fornecedor ajustar preço ou prazo, envia uma revisão e a versão anterior continua disponível.",
		record: "Quando a proposta é aceita, o pedido preserva os itens e as condições daquela versão.",
		fields: [
			["Preço", "Valor da proposta"],
			["Prazo", "Dias para entrega"],
			["Condições", "Frete e pagamento"]
		]
	},
	{
		id: "registro-de-inspecao",
		step: 5,
		Icon: dd,
		title: "Registro de inspeção",
		context: "Antes da expedição, o fornecedor precisa registrar o que foi conferido e o que ainda está pendente em cada item do pedido.",
		walkthrough: "O fornecedor informa o plano de inspeção, as evidências e a quantidade aprovada. As pendências precisam ser resolvidas antes da liberação.",
		record: "O pedido mantém o resultado da inspeção por item para consulta das duas empresas.",
		fields: [
			["Verificação", "Plano de inspeção"],
			["Resultado", "Quantidade aprovada"],
			["Pendências", "Por item"]
		]
	},
	{
		id: "recebimento-do-pedido",
		step: 7,
		Icon: Cd,
		title: "Recebimento do pedido",
		context: "O fornecedor registrou a expedição. A compradora ainda precisa conferir se o material chegou antes de encerrar a compra.",
		walkthrough: "Depois de receber os itens, o comprador confirma o recebimento e pode avaliar o fornecimento. O fornecedor acompanha a confirmação pelo pedido.",
		record: "A expedição, o recebimento e a avaliação ficam associados ao pedido já concluído.",
		fields: [
			["Fornecedor", "Registra a expedição"],
			["Comprador", "Confirma o recebimento"],
			["Histórico", "Pedido e avaliação"]
		]
	}
];
function of({ example: e }) {
	let { Icon: t, title: n, fields: r } = e;
	return /* @__PURE__ */ (0, Y.jsxs)("div", {
		className: "sv-quote sv-editorial-record",
		children: [/* @__PURE__ */ (0, Y.jsxs)("div", {
			className: "sv-quote-heading",
			children: [/* @__PURE__ */ (0, Y.jsxs)("span", { children: [
				/* @__PURE__ */ (0, Y.jsx)(t, {
					size: 18,
					"aria-hidden": "true"
				}),
				" ",
				n
			] }), /* @__PURE__ */ (0, Y.jsx)("small", { children: "Exemplo" })]
		}), /* @__PURE__ */ (0, Y.jsx)("dl", { children: r.map(([e, t]) => /* @__PURE__ */ (0, Y.jsxs)("div", { children: [/* @__PURE__ */ (0, Y.jsx)("dt", { children: e }), /* @__PURE__ */ (0, Y.jsx)("dd", { children: t })] }, e)) })]
	});
}
// src/public/home-content.tsx
var sf = [
	{
		label: "Publicar uma demanda",
		description: "Material, processo, quantidade e prazo ficam reunidos na ficha de cada item.",
		example: af[0]
	},
	{
		label: "Comparar propostas",
		description: "Consulte preço, prazo, frete e pagamento. Quando o fornecedor revisa a proposta, a versão anterior continua disponível.",
		example: af[1]
	},
	{
		label: "Acompanhar o pedido",
		description: "O pedido preserva as condições aceitas. Nele, as empresas acompanham inspeção, expedição e recebimento.",
		example: af[3]
	}
], cf = [{
	example: af[1],
	image: "./assets/home-comparison.webp",
	description: "Duas cotações para a mesma peça. O que pesa mais na decisão, preço ou prazo?"
}, {
	example: af[2],
	image: "./assets/home-inspection.webp",
	description: "Veja como documentar a inspeção de cada item antes de liberar a expedição."
}], lf = [
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
], uf = [
	{
		href: Ld("faq"),
		title: "Cadastro da empresa"
	},
	{
		href: Hd("ajuda"),
		title: "Primeiro acesso"
	},
	{
		href: Hd("seguranca"),
		title: "Acessos e dados"
	}
];
function df() {
	let [e, t] = (0, y.useState)(0), n = sf[e];
	return /* @__PURE__ */ (0, Y.jsx)("section", {
		className: "sv-home-content sv-home-flow",
		"aria-labelledby": "solucoes-inicio",
		children: /* @__PURE__ */ (0, Y.jsxs)("div", {
			className: "sv-shell",
			children: [/* @__PURE__ */ (0, Y.jsxs)("div", {
				className: "sv-home-section-head",
				children: [/* @__PURE__ */ (0, Y.jsx)("h2", {
					id: "solucoes-inicio",
					tabIndex: -1,
					children: "Uma compra, do começo ao fim."
				}), /* @__PURE__ */ (0, Y.jsxs)("a", {
					className: "sv-home-link",
					href: Bd("funcionamento"),
					children: ["Ver o fluxo completo ", /* @__PURE__ */ (0, Y.jsx)(rd, {
						"aria-hidden": "true",
						size: 18
					})]
				})]
			}), /* @__PURE__ */ (0, Y.jsxs)("div", {
				className: "sv-home-flow-layout",
				id: "criterios-inicio",
				tabIndex: -1,
				children: [/* @__PURE__ */ (0, Y.jsxs)("div", { children: [/* @__PURE__ */ (0, Y.jsx)("ol", {
					className: "sv-home-steps",
					"aria-label": "Etapas da compra",
					children: sf.map(({ label: n }, r) => /* @__PURE__ */ (0, Y.jsx)("li", { children: /* @__PURE__ */ (0, Y.jsxs)("button", {
						type: "button",
						"aria-controls": "sv-home-stage",
						"aria-pressed": r === e,
						onClick: () => t(r),
						children: [
							/* @__PURE__ */ (0, Y.jsx)("span", {
								className: "sv-home-step-index",
								"aria-hidden": "true",
								children: String(r + 1).padStart(2, "0")
							}),
							n,
							/* @__PURE__ */ (0, Y.jsx)(td, {
								"aria-hidden": "true",
								size: 19
							})
						]
					}) }, n))
				}), /* @__PURE__ */ (0, Y.jsxs)("div", {
					className: "sv-home-audiences",
					children: [/* @__PURE__ */ (0, Y.jsxs)("a", {
						className: "sv-home-link",
						href: Bd("compras"),
						children: ["Para compradores ", /* @__PURE__ */ (0, Y.jsx)(rd, {
							"aria-hidden": "true",
							size: 16
						})]
					}), /* @__PURE__ */ (0, Y.jsxs)("a", {
						className: "sv-home-link",
						href: Bd("fornecimento"),
						children: ["Para fornecedores ", /* @__PURE__ */ (0, Y.jsx)(rd, {
							"aria-hidden": "true",
							size: 16
						})]
					})]
				})] }), /* @__PURE__ */ (0, Y.jsxs)("div", {
					className: "app-frame",
					id: "sv-home-stage",
					role: "group",
					"aria-label": "Exemplo de compra industrial",
					"aria-live": "polite",
					"data-visual": !0,
					children: [/* @__PURE__ */ (0, Y.jsxs)("div", {
						className: "sv-home-stage-top",
						children: [/* @__PURE__ */ (0, Y.jsx)("img", {
							src: "./src/assets/brand/raposa.svg",
							width: "22",
							height: "22",
							alt: ""
						}), /* @__PURE__ */ (0, Y.jsx)("span", { children: "Compra industrial" })]
					}), /* @__PURE__ */ (0, Y.jsxs)("div", {
						className: "sv-home-stage-record",
						children: [/* @__PURE__ */ (0, Y.jsx)(of, { example: n.example }), /* @__PURE__ */ (0, Y.jsx)("p", { children: n.description })]
					}, n.label)]
				})]
			})]
		})
	});
}
function ff() {
	return /* @__PURE__ */ (0, Y.jsxs)(Y.Fragment, { children: [
		/* @__PURE__ */ (0, Y.jsx)("section", {
			className: "sv-home-content sv-home-intro",
			"aria-labelledby": "explorar",
			children: /* @__PURE__ */ (0, Y.jsxs)("div", {
				className: "sv-shell sv-home-intro-grid",
				children: [/* @__PURE__ */ (0, Y.jsxs)("div", {
					className: "sv-home-intro-copy",
					children: [
						/* @__PURE__ */ (0, Y.jsx)("h2", {
							id: "explorar",
							tabIndex: -1,
							children: "Da necessidade de compra ao pedido entregue."
						}),
						/* @__PURE__ */ (0, Y.jsx)("p", { children: "O SIVI reúne quem compra e quem fornece para a indústria. Compradores publicam o que precisam, fornecedores enviam propostas e as duas empresas acompanham o pedido até o recebimento." }),
						/* @__PURE__ */ (0, Y.jsx)(Jd, {
							className: "sv-home-body-action",
							href: Ld("about"),
							children: /* @__PURE__ */ (0, Y.jsx)("span", { children: "Conheça melhor a equipe por trás do SIVI" })
						})
					]
				}), /* @__PURE__ */ (0, Y.jsxs)("div", {
					className: "sv-home-intro-art",
					"aria-hidden": "true",
					children: [/* @__PURE__ */ (0, Y.jsx)("div", { className: "sv-home-part-ground" }), /* @__PURE__ */ (0, Y.jsx)("img", {
						src: "./assets/home-machined-part.webp",
						width: "1120",
						height: "1120",
						alt: "",
						loading: "lazy"
					})]
				})]
			})
		}),
		/* @__PURE__ */ (0, Y.jsx)(df, {}),
		/* @__PURE__ */ (0, Y.jsx)("section", {
			className: "sv-home-content sv-home-uses",
			"aria-labelledby": "casos-inicio",
			children: /* @__PURE__ */ (0, Y.jsxs)("div", {
				className: "sv-shell",
				children: [/* @__PURE__ */ (0, Y.jsxs)("div", {
					className: "sv-home-section-head",
					children: [/* @__PURE__ */ (0, Y.jsxs)("div", { children: [/* @__PURE__ */ (0, Y.jsx)("h2", {
						id: "casos-inicio",
						tabIndex: -1,
						children: "Casos de compra industrial"
					}), /* @__PURE__ */ (0, Y.jsx)("p", { children: "Veja como o SIVI organiza decisões e registros em exemplos de compras industriais." })] }), /* @__PURE__ */ (0, Y.jsxs)("a", {
						className: "sv-home-link",
						href: Ld("cases"),
						children: ["Ver todos os casos ", /* @__PURE__ */ (0, Y.jsx)(rd, {
							"aria-hidden": "true",
							size: 18
						})]
					})]
				}), /* @__PURE__ */ (0, Y.jsx)("div", {
					className: "sv-home-use-grid",
					children: cf.map(({ example: e, image: t, description: n }) => /* @__PURE__ */ (0, Y.jsxs)("article", { children: [/* @__PURE__ */ (0, Y.jsxs)("a", {
						className: "sv-home-use",
						href: Rd("cases", e.id),
						children: [/* @__PURE__ */ (0, Y.jsx)("div", {
							className: "sv-home-use-photo",
							children: /* @__PURE__ */ (0, Y.jsx)("img", {
								src: t,
								width: "1200",
								height: "800",
								alt: "",
								loading: "lazy"
							})
						}), /* @__PURE__ */ (0, Y.jsxs)("div", {
							className: "sv-home-use-title",
							children: [/* @__PURE__ */ (0, Y.jsx)("h3", { children: e.title }), /* @__PURE__ */ (0, Y.jsx)(rd, {
								"aria-hidden": "true",
								size: 21
							})]
						})]
					}), /* @__PURE__ */ (0, Y.jsx)("p", { children: n })] }, e.id))
				})]
			})
		}),
		/* @__PURE__ */ (0, Y.jsx)("section", {
			className: "sv-home-content sv-home-resources",
			"aria-labelledby": "recursos-inicio",
			children: /* @__PURE__ */ (0, Y.jsxs)("div", {
				className: "sv-shell sv-home-resources-grid",
				children: [
					/* @__PURE__ */ (0, Y.jsxs)("div", { children: [/* @__PURE__ */ (0, Y.jsx)("h2", {
						id: "recursos-inicio",
						tabIndex: -1,
						children: "Registros da compra"
					}), /* @__PURE__ */ (0, Y.jsx)("p", { children: "Do perfil do fornecedor à entrega, veja onde consultar as informações da compra." })] }),
					/* @__PURE__ */ (0, Y.jsx)("div", {
						className: "sv-home-disclosures",
						id: "acordo-inicio",
						tabIndex: -1,
						children: lf.map(({ step: e, title: t, description: n }) => /* @__PURE__ */ (0, Y.jsxs)("details", { children: [/* @__PURE__ */ (0, Y.jsxs)("summary", { children: [t, /* @__PURE__ */ (0, Y.jsx)(ld, {
							"aria-hidden": "true",
							size: 20
						})] }), /* @__PURE__ */ (0, Y.jsxs)("div", { children: [/* @__PURE__ */ (0, Y.jsx)("p", { children: n }), /* @__PURE__ */ (0, Y.jsxs)("a", {
							className: "sv-home-link",
							href: Vd(e),
							children: ["Ver na plataforma ", /* @__PURE__ */ (0, Y.jsx)(rd, {
								"aria-hidden": "true",
								size: 16
							})]
						})] })] }, e))
					}),
					/* @__PURE__ */ (0, Y.jsxs)("div", {
						className: "sv-home-guides",
						children: [/* @__PURE__ */ (0, Y.jsx)("h3", {
							id: "guias-inicio",
							tabIndex: -1,
							children: "Guias de acesso"
						}), /* @__PURE__ */ (0, Y.jsx)("ul", { children: uf.map(({ href: e, title: t }) => /* @__PURE__ */ (0, Y.jsx)("li", { children: /* @__PURE__ */ (0, Y.jsxs)("a", {
							className: "sv-home-link",
							href: e,
							children: [t, /* @__PURE__ */ (0, Y.jsx)(rd, {
								"aria-hidden": "true",
								size: 16
							})]
						}) }, e)) })]
					})
				]
			})
		}),
		/* @__PURE__ */ (0, Y.jsx)("section", {
			className: "sv-home-content sv-home-start",
			"aria-labelledby": "comecar-title",
			children: /* @__PURE__ */ (0, Y.jsxs)("div", {
				className: "sv-shell",
				children: [/* @__PURE__ */ (0, Y.jsx)("h2", {
					id: "comecar-title",
					tabIndex: -1,
					children: "Sua empresa na rede industrial."
				}), /* @__PURE__ */ (0, Y.jsxs)("div", { children: [/* @__PURE__ */ (0, Y.jsx)("p", { children: "Cadastre sua empresa para comprar, fornecer ou atuar dos dois lados da plataforma." }), /* @__PURE__ */ (0, Y.jsx)(Jd, {
					className: "sv-home-body-action",
					children: "Cadastrar empresa"
				})] })]
			})
		})
	] });
}
// src/public/landing-motion.ts
function pf(e) {
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
		let l = t.querySelectorAll("[data-landing-reveal]"), u = (e) => {
			e.removeAttribute("data-awaiting-view"), e.setAttribute("data-in-view", "");
		}, d = typeof IntersectionObserver == "function" ? new IntersectionObserver((e) => {
			for (let t of e) t.isIntersecting && (u(t.target), d?.unobserve(t.target));
		}, { threshold: .08 }) : null;
		function f() {
			d?.disconnect();
			for (let e of l) n.matches || !d ? (e.removeAttribute("data-awaiting-view"), e.removeAttribute("data-in-view")) : e.hasAttribute("data-in-view") || (e.getBoundingClientRect().bottom <= 0 || e.contains(document.activeElement) ? e.removeAttribute("data-awaiting-view") : (e.setAttribute("data-awaiting-view", ""), d.observe(e)));
			c();
		}
		function p(e) {
			let t = e.target.closest("[data-awaiting-view]");
			for (; t;) u(t), d?.unobserve(t), t = t.parentElement?.closest("[data-awaiting-view]") ?? null;
		}
		let m = window.matchMedia("(hover: hover) and (pointer: fine)"), h = t.querySelectorAll("[data-landing-pointer]");
		function g(e) {
			if (n.matches || !m.matches || e.pointerType === "touch") return;
			let t = e.currentTarget, r = t.getBoundingClientRect(), i = ((e.clientX - r.left) / r.width - .5) * 2, a = ((e.clientY - r.top) / r.height - .5) * 2;
			t.style.setProperty("--pointer-x", i.toFixed(3)), t.style.setProperty("--pointer-y", a.toFixed(3));
		}
		function _(e) {
			let t = e.currentTarget;
			t.style.removeProperty("--pointer-x"), t.style.removeProperty("--pointer-y");
		}
		for (let e of h) e.addEventListener("pointermove", g), e.addEventListener("pointerleave", _);
		return f(), window.addEventListener("scroll", c, { passive: !0 }), r && window.addEventListener("resize", c), n.addEventListener("change", f), t.addEventListener("focusin", p), () => {
			d?.disconnect(), cancelAnimationFrame(o), window.removeEventListener("scroll", c), r && window.removeEventListener("resize", c), n.removeEventListener("change", f), t.removeEventListener("focusin", p);
			for (let e of h) e.removeEventListener("pointermove", g), e.removeEventListener("pointerleave", _);
		};
	}, [e]);
}
// src/public/public-layout.tsx
function mf({ page: e, lightHeader: t = !1, children: n }) {
	let r = (0, y.useRef)(null);
	return pf(r), /* @__PURE__ */ (0, Y.jsxs)("div", {
		className: "sv-landing",
		ref: r,
		"data-header-light": t || void 0,
		"data-home-opening": e === "home" || void 0,
		children: [
			/* @__PURE__ */ (0, Y.jsx)(Yd, { current: e }),
			/* @__PURE__ */ (0, Y.jsx)("main", {
				id: "conteudo",
				tabIndex: -1,
				children: n
			}),
			/* @__PURE__ */ (0, Y.jsx)(nf, { home: e === "home" }),
			/* @__PURE__ */ (0, Y.jsx)(rf, { focusTitle: e !== "home" })
		]
	});
}
// src/public/home.tsx
var hf = "./assets/home-industrial.webm", gf = "./assets/home-industrial-poster.webp", _f = "./assets/home-b2b.webm", vf = "./assets/home-b2b-poster.webp", yf = "./assets/home-hero-opening.webp", bf = "(prefers-reduced-motion: reduce)", xf = !1;
function Sf() {
	let e = navigator.connection;
	return window.matchMedia(bf).matches || !!e?.saveData;
}
function Cf() {
	let e = (0, y.useRef)(null), t = (0, y.useRef)(null), n = (0, y.useRef)(null), [r] = (0, y.useState)(() => {
		let e = new URLSearchParams(location.hash.split("?")[1]).get("secao");
		return !xf && (!e || e === "topo");
	}), [i, a] = (0, y.useState)(r ? "opening" : "business"), [o, s] = (0, y.useState)(!1), [c, l] = (0, y.useState)(!1), [u, d] = (0, y.useState)(!1);
	return (0, y.useEffect)(() => {
		if (i !== "opening") return;
		xf = !0;
		let e = window.setTimeout(() => {
			a(Sf() ? "business" : "industrial");
		}, o ? 1150 : 2200);
		return () => window.clearTimeout(e);
	}, [i, o]), (0, y.useEffect)(() => {
		let r = e.current, o = n.current, s = i === "business" ? o : t.current;
		if (!r || !s || !o) return;
		let c = window.matchMedia(bf), l = !0, u = !1, f = !1, p = () => {
			l && (Sf() || document.hidden || !u || f ? s.pause() : s.error || s.ended ? i === "industrial" && a("business") : (s.hasAttribute("src") || (s.src = i === "business" ? _f : hf), i !== "opening" && (i === "industrial" && !o.hasAttribute("src") && (o.src = _f), s.play().catch((e) => {
				l && e.name !== "AbortError" && (f = !0, i === "industrial" ? a("business") : d(!1));
			}))));
		}, m = () => {
			c.matches && i === "industrial" && a("business"), p();
		}, h = new IntersectionObserver((e) => {
			u = e[0].intersectionRatio >= .15, p();
		}, { threshold: .15 });
		return h.observe(r), c.addEventListener("change", m), document.addEventListener("visibilitychange", p), () => {
			l = !1, h.disconnect(), c.removeEventListener("change", m), document.removeEventListener("visibilitychange", p), s.pause();
		};
	}, [i]), /* @__PURE__ */ (0, Y.jsxs)("section", {
		ref: e,
		className: "sv-hero",
		"data-hero-phase": i,
		"aria-labelledby": "public-title",
		children: [
			/* @__PURE__ */ (0, Y.jsxs)("div", {
				className: "sv-hero-media",
				"aria-hidden": "true",
				children: [
					/* @__PURE__ */ (0, Y.jsx)("img", {
						src: gf,
						alt: "",
						width: 1440,
						height: 810
					}),
					/* @__PURE__ */ (0, Y.jsx)("video", {
						ref: t,
						className: "sv-hero-industrial-video",
						muted: !0,
						playsInline: !0,
						preload: "auto",
						"data-playing-frame": c || void 0,
						onPlaying: () => l(!0),
						onEnded: () => a("business"),
						onError: () => {
							l(!1), a((e) => e === "industrial" ? "business" : e);
						}
					}),
					/* @__PURE__ */ (0, Y.jsx)("img", {
						className: "sv-hero-business-poster",
						src: vf,
						alt: "",
						width: 1280,
						height: 720
					}),
					/* @__PURE__ */ (0, Y.jsx)("video", {
						ref: n,
						className: "sv-hero-business-video",
						muted: !0,
						playsInline: !0,
						loop: !0,
						preload: "auto",
						"data-playing-frame": u || void 0,
						onPlaying: () => d(!0),
						onError: () => d(!1)
					})
				]
			}),
			r && /* @__PURE__ */ (0, Y.jsxs)("div", {
				className: "sv-hero-opening",
				"aria-hidden": "true",
				children: [/* @__PURE__ */ (0, Y.jsx)("img", {
					className: "sv-hero-opening-photo",
					src: yf,
					width: 1600,
					height: 1200,
					alt: "",
					fetchPriority: "high",
					onLoad: () => s(!0),
					onError: () => s(!0)
				}), /* @__PURE__ */ (0, Y.jsxs)("div", {
					className: "sv-hero-opening-brand",
					children: [/* @__PURE__ */ (0, Y.jsx)("img", {
						src: "./src/assets/brand/raposa.svg",
						width: 96,
						height: 96,
						alt: ""
					}), /* @__PURE__ */ (0, Y.jsx)("span", { children: "SIVI" })]
				})]
			}),
			/* @__PURE__ */ (0, Y.jsx)("div", {
				className: "sv-shell sv-landing-hero",
				children: /* @__PURE__ */ (0, Y.jsxs)("div", {
					className: "sv-landing-lead",
					children: [
						/* @__PURE__ */ (0, Y.jsxs)("h1", {
							id: "public-title",
							tabIndex: -1,
							children: [
								/* @__PURE__ */ (0, Y.jsx)("span", { children: "A indústria" }),
								" ",
								/* @__PURE__ */ (0, Y.jsxs)("span", { children: ["se conecta", /* @__PURE__ */ (0, Y.jsx)("span", {
									className: "sv-hero-period",
									children: "."
								})] })
							]
						}),
						/* @__PURE__ */ (0, Y.jsx)("p", {
							className: "sv-hero-description",
							children: "Marketplace B2B de compras e fornecimento industrial, da cotação ao recebimento."
						}),
						/* @__PURE__ */ (0, Y.jsx)(Jd, {
							className: "sv-hero-action",
							children: "Cadastrar empresa"
						})
					]
				})
			})
		]
	});
}
function wf() {
	return /* @__PURE__ */ (0, Y.jsxs)(mf, {
		page: "home",
		children: [/* @__PURE__ */ (0, Y.jsx)(Cf, {}), /* @__PURE__ */ (0, Y.jsx)(ff, {})]
	});
}
// node_modules/gsap/gsap-core.js
function Tf(e) {
	if (e === void 0) throw ReferenceError("this hasn't been initialised - super() hasn't been called");
	return e;
}
function Ef(e, t) {
	e.prototype = Object.create(t.prototype), e.prototype.constructor = e, e.__proto__ = t;
}
var Df = {
	autoSleep: 120,
	force3D: "auto",
	nullTargetWarn: 1,
	units: { lineHeight: "" }
}, Of = {
	duration: .5,
	overwrite: !1,
	delay: 0
}, kf, Af, jf, Mf = 1e8, Nf = 1 / Mf, Pf = Math.PI * 2, Ff = Pf / 4, If = 0, Lf = Math.sqrt, Rf = Math.cos, zf = Math.sin, Bf = function(e) {
	return typeof e == "string";
}, Vf = function(e) {
	return typeof e == "function";
}, Hf = function(e) {
	return typeof e == "number";
}, Z = function(e) {
	return e === void 0;
}, Uf = function(e) {
	return typeof e == "object";
}, Wf = function(e) {
	return e !== !1;
}, Gf = function() {
	return typeof window < "u";
}, Kf = function(e) {
	return Vf(e) || Bf(e);
}, qf = typeof ArrayBuffer == "function" && ArrayBuffer.isView || function() {}, Jf = Array.isArray, Yf = /random\([^)]+\)/g, Xf = /,\s*/g, Zf = /(?:-?\.?\d|\.)+/gi, Qf = /[-+=.]*\d+[.e\-+]*\d*[e\-+]*\d*/g, $f = /[-+=.]*\d+[.e-]*\d*[a-z%]*/g, ep = /[-+=.]*\d+\.?\d*(?:e-|e\+)?\d*/gi, tp = /[+-]=-?[.\d]+/, np = /[^,'"\[\]\s]+/gi, rp = /^[+\-=e\s\d]*\d+[.\d]*([a-z]*|%)\s*$/i, Q, ip, ap, op, sp = {}, cp = {}, lp, up = function(e) {
	return (cp = Hp(e, sp)) && sg;
}, dp = function(e, t) {
	return console.warn("Invalid property", e, "set to", t, "Missing plugin? gsap.registerPlugin()");
}, fp = function(e, t) {
	return !t && console.warn(e);
}, pp = function(e, t) {
	return e && (sp[e] = t) && cp && (cp[e] = t) || sp;
}, mp = function() {
	return 0;
}, hp = {
	suppressEvents: !0,
	isStart: !0,
	kill: !1
}, gp = {
	suppressEvents: !0,
	kill: !1
}, _p = { suppressEvents: !0 }, vp = {}, yp = [], bp = {}, xp, Sp = {}, Cp = {}, wp = 30, Tp = [], Ep = "", Dp = function(e) {
	var t = e[0], n, r;
	if (Uf(t) || Vf(t) || (e = [e]), !(n = (t._gsap || {}).harness)) {
		for (r = Tp.length; r-- && !Tp[r].targetTest(t););
		n = Tp[r];
	}
	for (r = e.length; r--;) e[r] && (e[r]._gsap || (e[r]._gsap = new _h(e[r], n))) || e.splice(r, 1);
	return e;
}, Op = function(e) {
	return e._gsap || Dp(Tm(e))[0]._gsap;
}, kp = function(e, t, n) {
	return (n = e[t]) && Vf(n) ? e[t]() : Z(n) && e.getAttribute && e.getAttribute(t) || n;
}, Ap = function(e, t) {
	return (e = e.split(",")).forEach(t) || e;
}, jp = function(e) {
	return Math.round(e * 1e5) / 1e5 || 0;
}, Mp = function(e) {
	return Math.round(e * 1e7) / 1e7 || 0;
}, Np = function(e, t) {
	var n = t.charAt(0), r = parseFloat(t.substr(2));
	return e = parseFloat(e), n === "+" ? e + r : n === "-" ? e - r : n === "*" ? e * r : e / r;
}, Pp = function(e, t) {
	for (var n = t.length, r = 0; e.indexOf(t[r]) < 0 && ++r < n;);
	return r < n;
}, Fp = function() {
	var e = yp.length, t = yp.slice(0), n, r;
	for (bp = {}, yp.length = 0, n = 0; n < e; n++) r = t[n], r && r._lazy && (r.render(r._lazy[0], r._lazy[1], !0)._lazy = 0);
}, Ip = function(e) {
	return !!(e._initted || e._startAt || e.add);
}, Lp = function(e, t, n, r) {
	yp.length && !Af && Fp(), e.render(t, n, r || !!(Af && t < 0 && Ip(e))), yp.length && !Af && Fp();
}, Rp = function(e) {
	var t = parseFloat(e);
	return (t || t === 0) && (e + "").match(np).length < 2 ? t : Bf(e) ? e.trim() : e;
}, zp = function(e) {
	return e;
}, Bp = function(e, t) {
	for (var n in t) n in e || (e[n] = t[n]);
	return e;
}, Vp = function(e) {
	return function(t, n) {
		for (var r in n) r in t || r === "duration" && e || r === "ease" || (t[r] = n[r]);
	};
}, Hp = function(e, t) {
	for (var n in t) e[n] = t[n];
	return e;
}, Up = function e(t, n) {
	for (var r in n) r !== "__proto__" && r !== "constructor" && r !== "prototype" && (t[r] = Uf(n[r]) ? e(t[r] || (t[r] = {}), n[r]) : n[r]);
	return t;
}, Wp = function(e, t) {
	var n = {}, r;
	for (r in e) r in t || (n[r] = e[r]);
	return n;
}, Gp = function(e) {
	var t = e.parent || Q, n = e.keyframes ? Vp(Jf(e.keyframes)) : Bp;
	if (Wf(e.inherit)) for (; t;) n(e, t.vars.defaults), t = t.parent || t._dp;
	return e;
}, Kp = function(e, t) {
	for (var n = e.length, r = n === t.length; r && n-- && e[n] === t[n];);
	return n < 0;
}, qp = function(e, t, n, r, i) {
	n === void 0 && (n = "_first"), r === void 0 && (r = "_last");
	var a = e[r], o;
	if (i) for (o = t[i]; a && a[i] > o;) a = a._prev;
	return a ? (t._next = a._next, a._next = t) : (t._next = e[n], e[n] = t), t._next ? t._next._prev = t : e[r] = t, t._prev = a, t.parent = t._dp = e, t;
}, Jp = function(e, t, n, r) {
	n === void 0 && (n = "_first"), r === void 0 && (r = "_last");
	var i = t._prev, a = t._next;
	i ? i._next = a : e[n] === t && (e[n] = a), a ? a._prev = i : e[r] === t && (e[r] = i), t._next = t._prev = t.parent = null;
}, Yp = function(e, t) {
	e.parent && (!t || e.parent.autoRemoveChildren) && e.parent.remove && e.parent.remove(e), e._act = 0;
}, Xp = function(e, t) {
	if (e && (!t || t._end > e._dur || t._start < 0)) for (var n = e; n;) n._dirty = 1, n = n.parent;
	return e;
}, Zp = function(e) {
	for (var t = e.parent; t && t.parent;) t._dirty = 1, t.totalDuration(), t = t.parent;
	return e;
}, Qp = function(e, t, n, r) {
	return e._startAt && (Af ? e._startAt.revert(gp) : e.vars.immediateRender && !e.vars.autoRevert || e._startAt.render(t, !0, r));
}, $p = function e(t) {
	return !t || t._ts && e(t.parent);
}, em = function(e) {
	return e._repeat ? tm(e._tTime, e = e.duration() + e._rDelay) * e : 0;
}, tm = function(e, t) {
	var n = Math.floor(e = Mp(e / t));
	return e && n === e ? n - 1 : n;
}, nm = function(e, t) {
	return (e - t._start) * t._ts + (t._ts >= 0 ? 0 : t._dirty ? t.totalDuration() : t._tDur);
}, rm = function(e) {
	return e._end = Mp(e._start + (e._tDur / Math.abs(e._ts || e._rts || Nf) || 0));
}, im = function(e, t) {
	var n = e._dp;
	return n && n.smoothChildTiming && e._ts && (e._start = Mp(n._time - (e._ts > 0 ? t / e._ts : ((e._dirty ? e.totalDuration() : e._tDur) - t) / -e._ts)), rm(e), n._dirty || Xp(n, e)), e;
}, am = function(e, t) {
	var n;
	if ((t._time || !t._dur && t._initted || t._start < e._time && (t._dur || !t.add)) && (n = nm(e.rawTime(), t), (!t._dur || ym(0, t.totalDuration(), n) - t._tTime > Nf) && t.render(n, !0)), Xp(e, t)._dp && e._initted && e._time >= e._dur && e._ts) {
		if (e._dur < e.duration()) for (n = e; n._dp;) n.rawTime() >= 0 && n.totalTime(n._tTime), n = n._dp;
		e._zTime = -Nf;
	}
}, om = function(e, t, n, r) {
	return t.parent && Yp(t), t._start = Mp((Hf(n) ? n : !n && um(t) && (!e._last || e._last._start >= e._time) ? e._last ? e._last._start : e._time : n || e !== Q ? gm(e, n, t) : e._time) + t._delay), t._end = Mp(t._start + (t.totalDuration() / Math.abs(t.timeScale()) || 0)), qp(e, t, "_first", "_last", e._sort ? "_start" : 0), um(t) || (e._recent = t), r || am(e, t), e._ts < 0 && im(e, e._tTime), e;
}, sm = function(e, t) {
	return (sp.ScrollTrigger || dp("scrollTrigger", t)) && sp.ScrollTrigger.create(t, e);
}, cm = function(e, t, n, r, i) {
	if (Eh(e, t, i), !e._initted) return 1;
	if (!n && e._pt && !Af && (e._dur && e.vars.lazy !== !1 || !e._dur && e.vars.lazy) && xp !== rh.frame) return yp.push(e), e._lazy = [i, r], 1;
}, lm = function e(t) {
	var n = t.parent;
	return n && n._ts && n._initted && !n._lock && (n.rawTime() < 0 || e(n));
}, um = function(e) {
	var t = e.data;
	return t === "isFromStart" || t === "isStart";
}, dm = function(e, t, n, r) {
	var i = e.ratio, a = t < 0 || !t && (!e._start && lm(e) && (e._initted || !um(e)) || (e._ts < 0 || e._dp._ts < 0) && !um(e)) ? 0 : 1, o = e._rDelay, s = 0, c, l, u;
	if (o && e._repeat && (s = ym(0, e._tDur, t), l = tm(s, o), e._yoyo && l & 1 && (a = 1 - a), l !== tm(e._tTime, o) && (i = 1 - a, e.vars.repeatRefresh && e._initted && e.invalidate())), a !== i || Af || r || e._zTime === Nf || !t && e._zTime) {
		if (!e._initted && cm(e, t, r, n, s)) return;
		for (u = e._zTime, e._zTime = t || (n ? Nf : 0), n ||= t && !u, e.ratio = a, e._from && (a = 1 - a), e._time = 0, e._tTime = s, c = e._pt; c;) c.r(a, c.d), c = c._next;
		t < 0 && Qp(e, t, n, !0), e._onUpdate && !n && Hm(e, "onUpdate"), s && e._repeat && !n && e.parent && Hm(e, "onRepeat"), (t >= e._tDur || t < 0) && e.ratio === a && (a && Yp(e, 1), !n && !Af && (Hm(e, a ? "onComplete" : "onReverseComplete", !0), e._prom && e._prom()));
	} else e._zTime ||= t;
}, fm = function(e, t, n) {
	var r;
	if (n > t) for (r = e._first; r && r._start <= n;) {
		if (r.data === "isPause" && r._start > t) return r;
		r = r._next;
	}
	else for (r = e._last; r && r._start >= n;) {
		if (r.data === "isPause" && r._start < t) return r;
		r = r._prev;
	}
}, pm = function(e, t, n, r) {
	var i = e._repeat, a = Mp(t) || 0, o = e._tTime / e._tDur;
	return o && !r && (e._time *= a / e._dur), e._dur = a, e._tDur = i ? i < 0 ? 1e10 : Mp(a * (i + 1) + e._rDelay * i) : a, o > 0 && !r && im(e, e._tTime = e._tDur * o), e.parent && rm(e), n || Xp(e.parent, e), e;
}, mm = function(e) {
	return e instanceof yh ? Xp(e) : pm(e, e._dur);
}, hm = {
	_start: 0,
	endTime: mp,
	totalDuration: mp
}, gm = function e(t, n, r) {
	var i = t.labels, a = t._recent || hm, o = t.duration() >= Mf ? a.endTime(!1) : t._dur, s, c, l;
	return Bf(n) && (isNaN(n) || n in i) ? (c = n.charAt(0), l = n.substr(-1) === "%", s = n.indexOf("="), c === "<" || c === ">" ? (s >= 0 && (n = n.replace(/=/, "")), (c === "<" ? a._start : a.endTime(a._repeat >= 0)) + (parseFloat(n.substr(1)) || 0) * (l ? (s < 0 ? a : r).totalDuration() / 100 : 1)) : s < 0 ? (n in i || (i[n] = o), i[n]) : (c = parseFloat(n.charAt(s - 1) + n.substr(s + 1)), l && r && (c = c / 100 * (Jf(r) ? r[0] : r).totalDuration()), s > 1 ? e(t, n.substr(0, s - 1), r) + c : o + c)) : n == null ? o : +n;
}, _m = function(e, t, n) {
	var r = Hf(t[1]), i = (r ? 2 : 1) + (e < 2 ? 0 : 1), a = t[i], o, s;
	if (r && (a.duration = t[1]), a.parent = n, e) {
		for (o = a, s = n; s && !("immediateRender" in o);) o = s.vars.defaults || {}, s = Wf(s.vars.inherit) && s.parent;
		a.immediateRender = Wf(o.immediateRender), e < 2 ? a.runBackwards = 1 : a.startAt = t[i - 1];
	}
	return new Nh(t[0], a, t[i + 1]);
}, vm = function(e, t) {
	return e || e === 0 ? t(e) : t;
}, ym = function(e, t, n) {
	return n < e ? e : n > t ? t : n;
}, bm = function(e, t) {
	return !Bf(e) || !(t = rp.exec(e)) ? "" : t[1];
}, xm = function(e, t, n) {
	return vm(n, function(n) {
		return ym(e, t, n);
	});
}, Sm = [].slice, Cm = function(e, t) {
	return e && Uf(e) && "length" in e && (!t && !e.length || e.length - 1 in e && Uf(e[0])) && !e.nodeType && e !== ip;
}, wm = function(e, t, n) {
	return n === void 0 && (n = []), e.forEach(function(e) {
		var r;
		return Bf(e) && !t || Cm(e, 1) ? (r = n).push.apply(r, Tm(e)) : n.push(e);
	}) || n;
}, Tm = function(e, t, n) {
	return jf && !t && jf.selector ? jf.selector(e) : Bf(e) && !n && (ap || !ih()) ? Sm.call((t || op).querySelectorAll(e), 0) : Jf(e) ? wm(e, n) : Cm(e) ? Sm.call(e, 0) : e ? [e] : [];
}, Em = function(e) {
	return e = Tm(e)[0] || fp("Invalid scope") || {}, function(t) {
		var n = e.current || e.nativeElement || e;
		return Tm(t, n.querySelectorAll ? n : n === e ? fp("Invalid scope") || op.createElement("div") : e);
	};
}, Dm = function(e) {
	return e.sort(function() {
		return .5 - Math.random();
	});
}, Om = function(e) {
	if (Vf(e)) return e;
	var t = Uf(e) ? e : { each: e }, n = fh(t.ease), r = t.from || 0, i = parseFloat(t.base) || 0, a = {}, o = r > 0 && r < 1, s = isNaN(r) || o, c = t.axis, l = r, u = r;
	return Bf(r) ? l = u = {
		center: .5,
		edges: .5,
		end: 1
	}[r] || 0 : !o && s && (l = r[0], u = r[1]), function(e, o, d) {
		var f = (d || t).length, p = a[f], m, h, g, _, v, y, b, x, S;
		if (!p) {
			if (S = t.grid === "auto" ? 0 : (t.grid || [1, Mf])[1], !S) {
				for (b = -Mf; b < (b = d[S++].getBoundingClientRect().left) && S < f;);
				S < f && S--;
			}
			for (p = a[f] = [], m = s ? Math.min(S, f) * l - .5 : r % S, h = S === Mf ? 0 : s ? f * u / S - .5 : r / S | 0, b = 0, x = Mf, y = 0; y < f; y++) g = y % S - m, _ = h - (y / S | 0), p[y] = v = c ? Math.abs(c === "y" ? _ : g) : Lf(g * g + _ * _), v > b && (b = v), v < x && (x = v);
			r === "random" && Dm(p), p.max = b - x, p.min = x, p.v = f = (parseFloat(t.amount) || parseFloat(t.each) * (S > f ? f - 1 : c ? c === "y" ? f / S : S : Math.max(S, f / S)) || 0) * (r === "edges" ? -1 : 1), p.b = f < 0 ? i - f : i, p.u = bm(t.amount || t.each) || 0, n = n && f < 0 ? dh(n) : n;
		}
		return f = (p[e] - p.min) / p.max || 0, Mp(p.b + (n ? n(f) : f) * p.v) + p.u;
	};
}, km = function(e) {
	var t = 10 ** ((e + "").split(".")[1] || "").length;
	return function(n) {
		var r = Mp(Math.round(parseFloat(n) / e) * e * t);
		return (r - r % 1) / t + (Hf(n) ? 0 : bm(n));
	};
}, Am = function(e, t) {
	var n = Jf(e), r, i;
	return !n && Uf(e) && (r = n = e.radius || Mf, e.values ? (e = Tm(e.values), (i = !Hf(e[0])) && (r *= r)) : e = km(e.increment)), vm(t, n ? Vf(e) ? function(t) {
		return i = e(t), Math.abs(i - t) <= r ? i : t;
	} : function(t) {
		for (var n = parseFloat(i ? t.x : t), a = parseFloat(i ? t.y : 0), o = Mf, s = 0, c = e.length, l, u; c--;) i ? (l = e[c].x - n, u = e[c].y - a, l = l * l + u * u) : l = Math.abs(e[c] - n), l < o && (o = l, s = c);
		return s = !r || o <= r ? e[s] : t, i || s === t || Hf(t) ? s : s + bm(t);
	} : km(e));
}, jm = function(e, t, n, r) {
	return vm(Jf(e) ? !t : n === !0 ? !!(n = 0) : !r, function() {
		return Jf(e) ? e[~~(Math.random() * e.length)] : (n ||= 1e-5) && (r = n < 1 ? 10 ** ((n + "").length - 2) : 1) && Math.floor(Math.round((e - n / 2 + Math.random() * (t - e + n * .99)) / n) * n * r) / r;
	});
}, Mm = function() {
	var e = [...arguments];
	return function(t) {
		return e.reduce(function(e, t) {
			return t(e);
		}, t);
	};
}, Nm = function(e, t) {
	return function(n) {
		return e(parseFloat(n)) + (t || bm(n));
	};
}, Pm = function(e, t, n) {
	return zm(e, t, 0, 1, n);
}, Fm = function(e, t, n) {
	return vm(n, function(n) {
		return e[~~t(n)];
	});
}, Im = function e(t, n, r) {
	var i = n - t;
	return Jf(t) ? Fm(t, e(0, t.length), n) : vm(r, function(e) {
		return (i + (e - t) % i) % i + t;
	});
}, Lm = function e(t, n, r) {
	var i = n - t, a = i * 2;
	return Jf(t) ? Fm(t, e(0, t.length - 1), n) : vm(r, function(e) {
		return e = (a + (e - t) % a) % a || 0, t + (e > i ? a - e : e);
	});
}, Rm = function(e) {
	return e.replace(Yf, function(e) {
		var t = e.indexOf("[") + 1, n = e.substring(t || 7, t ? e.indexOf("]") : e.length - 1).split(Xf);
		return jm(t ? n : +n[0], t ? 0 : +n[1], +n[2] || 1e-5);
	});
}, zm = function(e, t, n, r, i) {
	var a = t - e, o = r - n;
	return vm(i, function(t) {
		return n + ((t - e) / a * o || 0);
	});
}, Bm = function e(t, n, r, i) {
	var a = isNaN(t + n) ? 0 : function(e) {
		return (1 - e) * t + e * n;
	};
	if (!a) {
		var o = Bf(t), s = {}, c, l, u, d, f;
		if (r === !0 && (i = 1) && (r = null), o) t = { p: t }, n = { p: n };
		else if (Jf(t) && !Jf(n)) {
			for (u = [], d = t.length, f = d - 2, l = 1; l < d; l++) u.push(e(t[l - 1], t[l]));
			d--, a = function(e) {
				e *= d;
				var t = Math.min(f, ~~e);
				return u[t](e - t);
			}, r = n;
		} else i || (t = Hp(Jf(t) ? [] : {}, t));
		if (!u) {
			for (c in n) xh.call(s, t, c, "get", n[c]);
			a = function(e) {
				return Hh(e, s) || (o ? t.p : t);
			};
		}
	}
	return vm(r, a);
}, Vm = function(e, t, n) {
	var r = e.labels, i = Mf, a, o, s;
	for (a in r) o = r[a] - t, o < 0 == !!n && o && i > (o = Math.abs(o)) && (s = a, i = o);
	return s;
}, Hm = function(e, t, n) {
	var r = e.vars, i = r[t], a = jf, o = e._ctx, s, c, l;
	if (i) return s = r[t + "Params"], c = r.callbackScope || e, n && yp.length && Fp(), o && (jf = o), l = s ? i.apply(c, s) : i.call(c), jf = a, l;
}, Um = function(e) {
	return Yp(e), e.scrollTrigger && e.scrollTrigger.kill(!!Af), e.progress() < 1 && Hm(e, "onInterrupt"), e;
}, Wm, Gm = [], Km = function(e) {
	if (e) {
		if (e = !e.name && e.default || e, Gf() || e.headless) {
			var t = e.name, n = Vf(e), r = t && !n && e.init ? function() {
				this._props = [];
			} : e, i = {
				init: mp,
				render: Hh,
				add: xh,
				kill: Wh,
				modifier: Uh,
				rawVars: 0
			}, a = {
				targetTest: 0,
				get: 0,
				getSetter: Rh,
				aliases: {},
				register: 0
			};
			if (ih(), e !== r) {
				if (Sp[t]) return;
				Bp(r, Bp(Wp(e, i), a)), Hp(r.prototype, Hp(i, Wp(e, a))), Sp[r.prop = t] = r, e.targetTest && (Tp.push(r), vp[t] = 1), t = (t === "css" ? "CSS" : t.charAt(0).toUpperCase() + t.substr(1)) + "Plugin";
			}
			pp(t, r), e.register && e.register(sg, r, qh);
		} else Gm.push(e);
	}
}, qm = 255, Jm = {
	aqua: [
		0,
		qm,
		qm
	],
	lime: [
		0,
		qm,
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
		qm
	],
	navy: [
		0,
		0,
		128
	],
	white: [
		qm,
		qm,
		qm
	],
	olive: [
		128,
		128,
		0
	],
	yellow: [
		qm,
		qm,
		0
	],
	orange: [
		qm,
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
		qm,
		0,
		0
	],
	pink: [
		qm,
		192,
		203
	],
	cyan: [
		0,
		qm,
		qm
	],
	transparent: [
		qm,
		qm,
		qm,
		0
	]
}, Ym = function(e, t, n) {
	return e += e < 0 ? 1 : e > 1 ? -1 : 0, (e * 6 < 1 ? t + (n - t) * e * 6 : e < .5 ? n : e * 3 < 2 ? t + (n - t) * (2 / 3 - e) * 6 : t) * qm + .5 | 0;
}, Xm = function(e, t, n) {
	var r = e ? Hf(e) ? [
		e >> 16,
		e >> 8 & qm,
		e & qm
	] : 0 : Jm.black, i, a, o, s, c, l, u, d, f, p;
	if (!r) {
		if (e.substr(-1) === "," && (e = e.substr(0, e.length - 1)), Jm[e]) r = Jm[e];
		else if (e.charAt(0) === "#") {
			if (e.length < 6 && (i = e.charAt(1), a = e.charAt(2), o = e.charAt(3), e = "#" + i + i + a + a + o + o + (e.length === 5 ? e.charAt(4) + e.charAt(4) : "")), e.length === 9) return r = parseInt(e.substr(1, 6), 16), [
				r >> 16,
				r >> 8 & qm,
				r & qm,
				parseInt(e.substr(7), 16) / 255
			];
			e = parseInt(e.substr(1), 16), r = [
				e >> 16,
				e >> 8 & qm,
				e & qm
			];
		} else if (e.substr(0, 3) === "hsl") {
			if (r = p = e.match(Zf), !t) s = r[0] % 360 / 360, c = r[1] / 100, l = r[2] / 100, a = l <= .5 ? l * (c + 1) : l + c - l * c, i = l * 2 - a, r.length > 3 && (r[3] *= 1), r[0] = Ym(s + 1 / 3, i, a), r[1] = Ym(s, i, a), r[2] = Ym(s - 1 / 3, i, a);
			else if (~e.indexOf("=")) return r = e.match(Qf), n && r.length < 4 && (r[3] = 1), r;
		} else r = e.match(Zf) || Jm.transparent;
		r = r.map(Number);
	}
	return t && !p && (i = r[0] / qm, a = r[1] / qm, o = r[2] / qm, u = Math.max(i, a, o), d = Math.min(i, a, o), l = (u + d) / 2, u === d ? s = c = 0 : (f = u - d, c = l > .5 ? f / (2 - u - d) : f / (u + d), s = u === i ? (a - o) / f + (a < o ? 6 : 0) : u === a ? (o - i) / f + 2 : (i - a) / f + 4, s *= 60), r[0] = ~~(s + .5), r[1] = ~~(c * 100 + .5), r[2] = ~~(l * 100 + .5)), n && r.length < 4 && (r[3] = 1), r;
}, Zm = function(e) {
	var t = [], n = [], r = -1;
	return e.split($m).forEach(function(e) {
		var i = e.match($f) || [];
		t.push.apply(t, i), n.push(r += i.length + 1);
	}), t.c = n, t;
}, Qm = function(e, t, n) {
	var r = "", i = (e + r).match($m), a = t ? "hsla(" : "rgba(", o = 0, s, c, l, u;
	if (!i) return e;
	if (i = i.map(function(e) {
		return (e = Xm(e, t, 1)) && a + (t ? e[0] + "," + e[1] + "%," + e[2] + "%," + e[3] : e.join(",")) + ")";
	}), n && (l = Zm(e), s = n.c, s.join(r) !== l.c.join(r))) for (c = e.replace($m, "1").split($f), u = c.length - 1; o < u; o++) r += c[o] + (~s.indexOf(o) ? i.shift() || a + "0,0,0,0)" : (l.length ? l : i.length ? i : n).shift());
	if (!c) for (c = e.split($m), u = c.length - 1; o < u; o++) r += c[o] + i[o];
	return r + c[u];
}, $m = function() {
	var e = "(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3,4}){1,2}\\b", t;
	for (t in Jm) e += "|" + t + "\\b";
	return RegExp(e + ")", "gi");
}(), eh = /hsl[a]?\(/, th = function(e) {
	var t = e.join(" "), n;
	if ($m.lastIndex = 0, $m.test(t)) return n = eh.test(t), e[1] = Qm(e[1], n), e[0] = Qm(e[0], n, Zm(e[1])), !0;
}, nh, rh = function() {
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
			lp && (!ap && Gf() && (ip = ap = window, op = ip.document || {}, sp.gsap = sg, (ip.gsapVersions || (ip.gsapVersions = [])).push(sg.version), up(cp || ip.GreenSockGlobals || !ip.gsap && ip || {}), Gm.forEach(Km)), u = typeof requestAnimationFrame < "u" && requestAnimationFrame, c && d.sleep(), l = u || function(e) {
				return setTimeout(e, o - d.time * 1e3 + 1 | 0);
			}, nh = 1, m(2));
		},
		sleep: function() {
			(u ? cancelAnimationFrame : clearTimeout)(c), nh = 0, l = mp;
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
			return d.remove(e), s[n ? "unshift" : "push"](r), ih(), r;
		},
		remove: function(e, t) {
			~(t = s.indexOf(e)) && s.splice(t, 1) && p >= t && p--;
		},
		_listeners: s
	}, d;
}(), ih = function() {
	return !nh && rh.wake();
}, ah = {}, oh = /^[\d.\-M][\d.\-,\s]/, sh = /["']/g, ch = function(e) {
	for (var t = {}, n = e.substr(1, e.length - 3).split(":"), r = n[0], i = 1, a = n.length, o, s, c; i < a; i++) s = n[i], o = i === a - 1 ? s.length : s.lastIndexOf(","), c = s.substr(0, o), t[r] = isNaN(c) ? c.replace(sh, "").trim() : +c, r = s.substr(o + 1).trim();
	return t;
}, lh = function(e) {
	var t = e.indexOf("(") + 1, n = e.indexOf(")"), r = e.indexOf("(", t);
	return e.substring(t, ~r && r < n ? e.indexOf(")", n + 1) : n);
}, uh = function(e) {
	var t = (e + "").split("("), n = ah[t[0]];
	return n && t.length > 1 && n.config ? n.config.apply(null, ~e.indexOf("{") ? [ch(t[1])] : lh(e).split(",").map(Rp)) : ah._CE && oh.test(e) ? ah._CE("", e) : n;
}, dh = function(e) {
	return function(t) {
		return 1 - e(1 - t);
	};
}, fh = function(e, t) {
	return e && (Vf(e) ? e : ah[e] || uh(e)) || t;
}, ph = function(e, t, n, r) {
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
	return Ap(e, function(e) {
		for (var t in ah[e] = sp[e] = i, ah[a = e.toLowerCase()] = n, i) ah[a + (t === "easeIn" ? ".in" : t === "easeOut" ? ".out" : ".inOut")] = ah[e + "." + t] = i[t];
	}), i;
}, mh = function(e) {
	return function(t) {
		return t < .5 ? (1 - e(1 - t * 2)) / 2 : .5 + e((t - .5) * 2) / 2;
	};
}, hh = function e(t, n, r) {
	var i = n >= 1 ? n : 1, a = (r || (t ? .3 : .45)) / (n < 1 ? n : 1), o = a / Pf * (Math.asin(1 / i) || 0), s = function(e) {
		return e === 1 ? 1 : i * 2 ** (-10 * e) * zf((e - o) * a) + 1;
	}, c = t === "out" ? s : t === "in" ? function(e) {
		return 1 - s(1 - e);
	} : mh(s);
	return a = Pf / a, c.config = function(n, r) {
		return e(t, n, r);
	}, c;
}, gh = function e(t, n) {
	n === void 0 && (n = 1.70158);
	var r = function(e) {
		return e ? --e * e * ((n + 1) * e + n) + 1 : 0;
	}, i = t === "out" ? r : t === "in" ? function(e) {
		return 1 - r(1 - e);
	} : mh(r);
	return i.config = function(n) {
		return e(t, n);
	}, i;
};
Ap("Linear,Quad,Cubic,Quart,Quint,Strong", function(e, t) {
	var n = t < 5 ? t + 1 : t;
	ph(e + ",Power" + (n - 1), t ? function(e) {
		return e ** +n;
	} : function(e) {
		return e;
	}, function(e) {
		return 1 - (1 - e) ** n;
	}, function(e) {
		return e < .5 ? (e * 2) ** n / 2 : 1 - ((1 - e) * 2) ** n / 2;
	});
}), ah.Linear.easeNone = ah.none = ah.Linear.easeIn, ph("Elastic", hh("in"), hh("out"), hh()), (function(e, t) {
	var n = 1 / t, r = 2 * n, i = 2.5 * n, a = function(a) {
		return a < n ? e * a * a : a < r ? e * (a - 1.5 / t) ** 2 + .75 : a < i ? e * (a -= 2.25 / t) * a + .9375 : e * (a - 2.625 / t) ** 2 + .984375;
	};
	ph("Bounce", function(e) {
		return 1 - a(1 - e);
	}, a);
})(7.5625, 2.75), ph("Expo", function(e) {
	return 2 ** (10 * (e - 1)) * e + e * e * e * e * e * e * (1 - e);
}), ph("Circ", function(e) {
	return -(Lf(1 - e * e) - 1);
}), ph("Sine", function(e) {
	return e === 1 ? 1 : -Rf(e * Ff) + 1;
}), ph("Back", gh("in"), gh("out"), gh()), ah.SteppedEase = ah.steps = sp.SteppedEase = { config: function(e, t) {
	e === void 0 && (e = 1);
	var n = 1 / e, r = e + +!t, i = +!!t, a = 1 - Nf;
	return function(e) {
		return ((r * ym(0, a, e) | 0) + i) * n;
	};
} }, Of.ease = ah["quad.out"], Ap("onComplete,onUpdate,onStart,onRepeat,onReverseComplete,onInterrupt", function(e) {
	return Ep += e + "," + e + "Params,";
});
var _h = function(e, t) {
	this.id = If++, e._gsap = this, this.target = e, this.harness = t, this.get = t ? t.get : kp, this.set = t ? t.getSetter : Rh;
}, vh = /*#__PURE__*/ function() {
	function e(e) {
		this.vars = e, this._delay = +e.delay || 0, (this._repeat = e.repeat === Infinity ? -2 : e.repeat || 0) && (this._rDelay = e.repeatDelay || 0, this._yoyo = !!e.yoyo || !!e.yoyoEase), this._ts = 1, pm(this, +e.duration, 1, 1), this.data = e.data, jf && (this._ctx = jf, jf.data.push(this)), nh || rh.wake();
	}
	var t = e.prototype;
	return t.delay = function(e) {
		return e || e === 0 ? (this.parent && this.parent.smoothChildTiming && this.startTime(this._start + e - this._delay), this._delay = e, this) : this._delay;
	}, t.duration = function(e) {
		return arguments.length ? this.totalDuration(this._repeat > 0 ? e + (e + this._rDelay) * this._repeat : e) : this.totalDuration() && this._dur;
	}, t.totalDuration = function(e) {
		return arguments.length ? (this._dirty = 0, pm(this, this._repeat < 0 ? e : (e - this._repeat * this._rDelay) / (this._repeat + 1))) : this._tDur;
	}, t.totalTime = function(e, t) {
		if (ih(), !arguments.length) return this._tTime;
		var n = this._dp;
		if (n && n.smoothChildTiming && this._ts) {
			for (im(this, e), !n._dp || n.parent || am(n, this); n && n.parent;) n.parent._time !== n._start + (n._ts >= 0 ? n._tTime / n._ts : (n.totalDuration() - n._tTime) / -n._ts) && n.totalTime(n._tTime, !0), n = n.parent;
			!this.parent && this._dp.autoRemoveChildren && (this._ts > 0 && e < this._tDur || this._ts < 0 && e > 0 || !this._tDur && !e) && om(this._dp, this, this._start - this._delay);
		}
		return (this._tTime !== e || !this._dur && !t || this._initted && Math.abs(this._zTime) === Nf || !this._initted && this._dur && e || !e && !this._initted && (this.add || this._ptLookup)) && (this._ts || (this._pTime = e), Lp(this, e, t)), this;
	}, t.time = function(e, t) {
		return arguments.length ? this.totalTime(Math.min(this.totalDuration(), e + em(this)) % (this._dur + this._rDelay) || (e ? this._dur : 0), t) : this._time;
	}, t.totalProgress = function(e, t) {
		return arguments.length ? this.totalTime(this.totalDuration() * e, t) : this.totalDuration() ? Math.min(1, this._tTime / this._tDur) : this.rawTime() >= 0 && this._initted ? 1 : 0;
	}, t.progress = function(e, t) {
		return arguments.length ? this.totalTime(this.duration() * (this._yoyo && !(this.iteration() & 1) ? 1 - e : e) + em(this), t) : this.duration() ? Math.min(1, this._time / this._dur) : +(this.rawTime() > 0);
	}, t.iteration = function(e, t) {
		var n = this.duration() + this._rDelay;
		return arguments.length ? this.totalTime(this._time + (e - 1) * n, t) : this._repeat ? tm(this._tTime, n) + 1 : 1;
	}, t.timeScale = function(e, t) {
		if (!arguments.length) return this._rts === -Nf ? 0 : this._rts;
		if (this._rts === e) return this;
		var n = this.parent && this._ts ? nm(this.parent._time, this) : this._tTime, r = this._rts < 0;
		this._rts = +e || 0, this._ts = this._ps || e === -Nf ? 0 : this._rts;
		var i = this.totalDuration();
		return (r !== this._rts < 0 || n > 0 && n < i) && this.totalTime(ym(-Math.abs(this._delay), i, n), t !== !1), rm(this), Zp(this);
	}, t.paused = function(e) {
		if (!arguments.length) return this._ps;
		if (this._ps !== e) {
			if (this._ps = e, e) this._pTime = this._tTime || Math.max(-this._delay, this.rawTime()), this._ts = this._act = 0;
			else {
				ih(), this._ts = this._rts;
				var t = this.parent && !this.parent.smoothChildTiming ? this.rawTime() : this._tTime || this._pTime, n = this.progress() === 1 && Math.abs(this._zTime) !== Nf, r;
				if (n) for (this._tTime -= Nf, r = this._first; r;) {
					if (!r._dur && r._zTime < 0 && r._ts && r._start <= t + Nf) {
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
			this._start = Mp(e);
			var t = this.parent || this._dp;
			return t && (t._sort || !this.parent) && om(t, this, this._start - this._delay), this;
		}
		return this._start;
	}, t.endTime = function(e) {
		return this._start + (Wf(e) ? this.totalDuration() : this.duration()) / Math.abs(this._ts || 1);
	}, t.rawTime = function(e) {
		var t = this.parent || this._dp;
		return t ? e && (!this._ts || this._repeat && this._time && this.totalProgress() < 1) ? this._tTime % (this._dur + this._rDelay) : this._ts ? nm(t.rawTime(e), this) : this._tTime : this._tTime;
	}, t.revert = function(e) {
		e === void 0 && (e = _p);
		var t = Af;
		return Af = e, Ip(this) && (this.timeline && this.timeline.revert(e), this.totalTime(-.01, e.suppressEvents)), this.data !== "nested" && e.kill !== !1 && this.kill(), Af = t, this;
	}, t.globalTime = function(e) {
		for (var t = this, n = arguments.length ? e : t.rawTime(); t;) n = t._start + n / (Math.abs(t._ts) || 1), t = t._dp;
		return !this.parent && this._sat ? this._sat.globalTime(e) : n;
	}, t.repeat = function(e) {
		return arguments.length ? (this._repeat = e === Infinity ? -2 : e, mm(this)) : this._repeat === -2 ? Infinity : this._repeat;
	}, t.repeatDelay = function(e) {
		if (arguments.length) {
			var t = this._time;
			return this._rDelay = e, mm(this), t ? this.time(t) : this;
		}
		return this._rDelay;
	}, t.yoyo = function(e) {
		return arguments.length ? (this._yoyo = e, this) : this._yoyo;
	}, t.seek = function(e, t) {
		return this.totalTime(gm(this, e), Wf(t));
	}, t.restart = function(e, t) {
		return this.play().totalTime(e ? -this._delay : 0, Wf(t)), this._dur || (this._zTime = -Nf), this;
	}, t.play = function(e, t) {
		return e != null && this.seek(e, t), this.reversed(!1).paused(!1);
	}, t.reverse = function(e, t) {
		return e != null && this.seek(e || this.totalDuration(), t), this.reversed(!0).paused(!1);
	}, t.pause = function(e, t) {
		return e != null && this.seek(e, t), this.paused(!0);
	}, t.resume = function() {
		return this.paused(!1);
	}, t.reversed = function(e) {
		return arguments.length ? (!!e !== this.reversed() && this.timeScale(-this._rts || (e ? -Nf : 0)), this) : this._rts < 0;
	}, t.invalidate = function() {
		return this._initted = this._act = 0, this._zTime = -Nf, this;
	}, t.isActive = function() {
		var e = this.parent || this._dp, t = this._start, n;
		return !!(!e || this._ts && this._initted && e.isActive() && (n = e.rawTime(!0)) >= t && n < this.endTime(!0) - Nf);
	}, t.eventCallback = function(e, t, n) {
		var r = this.vars;
		return arguments.length > 1 ? (t ? (r[e] = t, n && (r[e + "Params"] = n), e === "onUpdate" && (this._onUpdate = t)) : delete r[e], this) : r[e];
	}, t.then = function(e) {
		var t = this, n = t._prom;
		return new Promise(function(r) {
			var i = Vf(e) ? e : zp, a = function() {
				var e = t.then;
				t.then = null, n && n(), Vf(i) && (i = i(t)) && (i.then || i === t) && (t.then = e), r(i), t.then = e;
			};
			t._initted && t.totalProgress() === 1 && t._ts >= 0 || !t._tTime && t._ts < 0 ? a() : t._prom = a;
		});
	}, t.kill = function() {
		Um(this);
	}, e;
}();
Bp(vh.prototype, {
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
	_zTime: -Nf,
	_prom: 0,
	_ps: !1,
	_rts: 1
});
var yh = /*#__PURE__*/ function(e) {
	Ef(t, e);
	function t(t, n) {
		var r;
		return t === void 0 && (t = {}), r = e.call(this, t) || this, r.labels = {}, r.smoothChildTiming = !!t.smoothChildTiming, r.autoRemoveChildren = !!t.autoRemoveChildren, r._sort = Wf(t.sortChildren), Q && om(t.parent || Q, Tf(r), n), t.reversed && r.reverse(), t.paused && r.paused(!0), t.scrollTrigger && sm(Tf(r), t.scrollTrigger), r;
	}
	var n = t.prototype;
	return n.to = function(e, t, n) {
		return _m(0, arguments, this), this;
	}, n.from = function(e, t, n) {
		return _m(1, arguments, this), this;
	}, n.fromTo = function(e, t, n, r) {
		return _m(2, arguments, this), this;
	}, n.set = function(e, t, n) {
		return t.duration = 0, t.parent = this, Gp(t).repeatDelay || (t.repeat = 0), t.immediateRender = !!t.immediateRender, new Nh(e, t, gm(this, n), 1), this;
	}, n.call = function(e, t, n) {
		return om(this, Nh.delayedCall(0, e, t), n);
	}, n.staggerTo = function(e, t, n, r, i, a, o) {
		return n.duration = t, n.stagger = n.stagger || r, n.onComplete = a, n.onCompleteParams = o, n.parent = this, new Nh(e, n, gm(this, i)), this;
	}, n.staggerFrom = function(e, t, n, r, i, a, o) {
		return n.runBackwards = 1, Gp(n).immediateRender = Wf(n.immediateRender), this.staggerTo(e, t, n, r, i, a, o);
	}, n.staggerFromTo = function(e, t, n, r, i, a, o, s) {
		return r.startAt = n, Gp(r).immediateRender = Wf(r.immediateRender), this.staggerTo(e, t, r, i, a, o, s);
	}, n.render = function(e, t, n) {
		var r = this._time, i = this._dirty ? this.totalDuration() : this._tDur, a = this._dur, o = e <= 0 ? 0 : Mp(e), s = this._zTime < 0 != e < 0 && (this._initted || !a), c, l, u, d, f, p, m, h, g, _, v, y;
		if (this !== Q && o > i && e >= 0 && (o = i), o !== this._tTime || n || s) {
			if (r !== this._time && a && (o += this._time - r, e += this._time - r), c = o, g = this._start, h = this._ts, p = !h, s && (a || (r = this._zTime), (e || !t) && (this._zTime = e)), this._repeat) {
				if (v = this._yoyo, f = a + this._rDelay, this._repeat < -1 && e < 0) return this.totalTime(f * 100 + e, t, n);
				if (c = Mp(o % f), o === i ? (d = this._repeat, c = a) : (_ = Mp(o / f), d = ~~_, d && d === _ && (c = a, d--), c > a && (c = a)), _ = tm(this._tTime, f), !r && this._tTime && _ !== d && this._tTime - _ * f - this._dur <= 0 && (_ = d), v && d & 1 && (c = a - c, y = 1), d !== _ && !this._lock) {
					var b = v && _ & 1, x = b === (v && d & 1);
					if (d < _ && (b = !b), r = b ? 0 : o % a ? a : o, this._lock = 1, this.render(r || (y ? 0 : Mp(d * f)), t, !a)._lock = 0, this._tTime = o, !t && this.parent && Hm(this, "onRepeat"), this.vars.repeatRefresh && !y && (this.invalidate()._lock = 1, _ = d), r && r !== this._time || p !== !this._ts || this.vars.onRepeat && !this.parent && !this._act || (a = this._dur, i = this._tDur, x && (this._lock = 2, r = b ? a : -1e-4, this.render(r, !0), this.vars.repeatRefresh && !y && this.invalidate()), this._lock = 0, !this._ts && !p)) return this;
				}
			}
			if (this._hasPause && !this._forcing && this._lock < 2 && (m = fm(this, Mp(r), Mp(c)), m && (o -= c - (c = m._start))), this._tTime = o, this._time = c, this._act = !!h, this._initted || (this._onUpdate = this.vars.onUpdate, this._initted = 1, this._zTime = e, r = 0), !r && o && a && !t && !_ && (Hm(this, "onStart"), this._tTime !== o)) return this;
			if (c >= r && e >= 0) for (l = this._first; l;) {
				if (u = l._next, (l._act || c >= l._start) && l._ts && m !== l) {
					if (l.parent !== this) return this.render(e, t, n);
					if (l.render(l._ts > 0 ? (c - l._start) * l._ts : (l._dirty ? l.totalDuration() : l._tDur) + (c - l._start) * l._ts, t, n), c !== this._time || !this._ts && !p) {
						m = 0, u && (o += this._zTime = -Nf);
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
						if (l.render(l._ts > 0 ? (S - l._start) * l._ts : (l._dirty ? l.totalDuration() : l._tDur) + (S - l._start) * l._ts, t, n || Af && Ip(l)), c !== this._time || !this._ts && !p) {
							m = 0, u && (o += this._zTime = S ? -Nf : Nf);
							break;
						}
					}
					l = u;
				}
			}
			if (m && !t && (this.pause(), m.render(c >= r ? 0 : -Nf)._zTime = c >= r ? 1 : -1, this._ts)) return this._start = g, rm(this), this.render(e, t, n);
			this._onUpdate && !t && Hm(this, "onUpdate", !0), (o === i && this._tTime >= this.totalDuration() || !o && r) && (g !== this._start && Math.abs(h) === Math.abs(this._ts) || this._lock || ((e || !a) && (o === i && this._ts > 0 || !o && this._ts < 0) && Yp(this, 1), t || e < 0 && !r || !o && !r && i || (Hm(this, o === i && e >= 0 ? "onComplete" : "onReverseComplete", !0), this._prom && !(o < i && this.timeScale() > 0) && this._prom())));
		}
		return this;
	}, n.add = function(e, t) {
		var n = this;
		if (Hf(t) || (t = gm(this, t, e)), !(e instanceof vh)) {
			if (Jf(e)) return e.forEach(function(e) {
				return n.add(e, t);
			}), this;
			if (Bf(e)) return this.addLabel(e, t);
			if (Vf(e)) e = Nh.delayedCall(0, e);
			else return this;
		}
		return this === e ? this : om(this, e, t);
	}, n.getChildren = function(e, t, n, r) {
		e === void 0 && (e = !0), t === void 0 && (t = !0), n === void 0 && (n = !0), r === void 0 && (r = -Mf);
		for (var i = [], a = this._first; a;) a._start >= r && (a instanceof Nh ? t && i.push(a) : (n && i.push(a), e && i.push.apply(i, a.getChildren(!0, t, n)))), a = a._next;
		return i;
	}, n.getById = function(e) {
		for (var t = this.getChildren(1, 1, 1), n = t.length; n--;) if (t[n].vars.id === e) return t[n];
	}, n.remove = function(e) {
		return Bf(e) ? this.removeLabel(e) : Vf(e) ? this.killTweensOf(e) : (e.parent === this && Jp(this, e), e === this._recent && (this._recent = this._last), Xp(this));
	}, n.totalTime = function(t, n) {
		return arguments.length ? (this._forcing = 1, !this._dp && this._ts && (this._start = Mp(rh.time - (this._ts > 0 ? t / this._ts : (this.totalDuration() - t) / -this._ts))), e.prototype.totalTime.call(this, t, n), this._forcing = 0, this) : this._tTime;
	}, n.addLabel = function(e, t) {
		return this.labels[e] = gm(this, t), this;
	}, n.removeLabel = function(e) {
		return delete this.labels[e], this;
	}, n.addPause = function(e, t, n) {
		var r = Nh.delayedCall(0, t || mp, n);
		return r.data = "isPause", this._hasPause = 1, om(this, r, gm(this, e));
	}, n.removePause = function(e) {
		var t = this._first;
		for (e = gm(this, e); t;) t._start === e && t.data === "isPause" && Yp(t), t = t._next;
	}, n.killTweensOf = function(e, t, n) {
		for (var r = this.getTweensOf(e, n), i = r.length; i--;) wh !== r[i] && r[i].kill(e, t);
		return this;
	}, n.getTweensOf = function(e, t) {
		for (var n = [], r = Tm(e), i = this._first, a = Hf(t), o; i;) i instanceof Nh ? Pp(i._targets, r) && (a ? (!wh || i._initted && i._ts) && i.globalTime(0) <= t && i.globalTime(i.totalDuration()) > t : !t || i.isActive()) && n.push(i) : (o = i.getTweensOf(r, t)).length && n.push.apply(n, o), i = i._next;
		return n;
	}, n.tweenTo = function(e, t) {
		t ||= {};
		var n = this, r = gm(n, e), i = t, a = i.startAt, o = i.onStart, s = i.onStartParams, c = i.immediateRender, l, u = Nh.to(n, Bp({
			ease: t.ease || "none",
			lazy: !1,
			immediateRender: !1,
			time: r,
			overwrite: "auto",
			duration: t.duration || Math.abs((r - (a && "time" in a ? a.time : n._time)) / n.timeScale()) || Nf,
			onStart: function() {
				if (n.pause(), !l) {
					var e = t.duration || Math.abs((r - (a && "time" in a ? a.time : n._time)) / n.timeScale());
					u._dur !== e && pm(u, e, 0, 1).render(u._time, !0, !0), l = 1;
				}
				o && o.apply(u, s || []);
			}
		}, t));
		return c ? u.render(0) : u;
	}, n.tweenFromTo = function(e, t, n) {
		return this.tweenTo(t, Bp({ startAt: { time: gm(this, e) } }, n));
	}, n.recent = function() {
		return this._recent;
	}, n.nextLabel = function(e) {
		return e === void 0 && (e = this._time), Vm(this, gm(this, e));
	}, n.previousLabel = function(e) {
		return e === void 0 && (e = this._time), Vm(this, gm(this, e), 1);
	}, n.currentLabel = function(e) {
		return arguments.length ? this.seek(e, !0) : this.previousLabel(this._time + Nf);
	}, n.shiftChildren = function(e, t, n) {
		n === void 0 && (n = 0);
		var r = this._first, i = this.labels, a;
		for (e = Mp(e); r;) r._start >= n && (r._start += e, r._end += e), r = r._next;
		if (t) for (a in i) i[a] >= n && (i[a] += e);
		return Xp(this);
	}, n.invalidate = function(t) {
		var n = this._first;
		for (this._lock = 0; n;) n.invalidate(t), n = n._next;
		return e.prototype.invalidate.call(this, t);
	}, n.clear = function(e) {
		e === void 0 && (e = !0);
		for (var t = this._first, n; t;) n = t._next, this.remove(t), t = n;
		return this._dp && (this._time = this._tTime = this._pTime = 0), e && (this.labels = {}), Xp(this);
	}, n.totalDuration = function(e) {
		var t = 0, n = this, r = n._last, i = Mf, a, o, s;
		if (arguments.length) return n.timeScale((n._repeat < 0 ? n.duration() : n.totalDuration()) / (n.reversed() ? -e : e));
		if (n._dirty) {
			for (s = n.parent; r;) a = r._prev, r._dirty && r.totalDuration(), o = r._start, o > i && n._sort && r._ts && !n._lock ? (n._lock = 1, om(n, r, o - r._delay, 1)._lock = 0) : i = o, o < 0 && r._ts && (t -= o, (!s && !n._dp || s && s.smoothChildTiming) && (n._start += Mp(o / n._ts), n._time -= o, n._tTime -= o), n.shiftChildren(-o, !1, -Infinity), i = 0), r._end > t && r._ts && (t = r._end), r = a;
			pm(n, n === Q && n._time > t ? n._time : t, 1, 1), n._dirty = 0;
		}
		return n._tDur;
	}, t.updateRoot = function(e) {
		if (Q._ts && (Lp(Q, nm(e, Q)), xp = rh.frame), rh.frame >= wp) {
			wp += Df.autoSleep || 120;
			var t = Q._first;
			if ((!t || !t._ts) && Df.autoSleep && rh._listeners.length < 2) {
				for (; t && !t._ts;) t = t._next;
				t || rh.sleep();
			}
		}
	}, t;
}(vh);
Bp(yh.prototype, {
	_lock: 0,
	_hasPause: 0,
	_forcing: 0
});
var bh = function(e, t, n, r, i, a, o) {
	var s = new qh(this._pt, e, t, 0, 1, Vh, null, i), c = 0, l = 0, u, d, f, p, m, h, g, _;
	for (s.b = n, s.e = r, n += "", r += "", (g = ~r.indexOf("random(")) && (r = Rm(r)), a && (_ = [n, r], a(_, e, t), n = _[0], r = _[1]), d = n.match(ep) || []; u = ep.exec(r);) p = u[0], m = r.substring(c, u.index), f ? f = (f + 1) % 5 : m.substr(-5) === "rgba(" && (f = 1), p !== d[l++] && (h = parseFloat(d[l - 1]) || 0, s._pt = {
		_next: s._pt,
		p: m || l === 1 ? m : ",",
		s: h,
		c: p.charAt(1) === "=" ? Np(h, p) - h : parseFloat(p) - h,
		m: f && f < 4 ? Math.round : 0
	}, c = ep.lastIndex);
	return s.c = c < r.length ? r.substring(c, r.length) : "", s.fp = o, (tp.test(r) || g) && (s.e = 0), this._pt = s, s;
}, xh = function(e, t, n, r, i, a, o, s, c, l) {
	Vf(r) && (r = r(i || 0, e, a));
	var u = e[t], d = n === "get" ? Vf(u) ? c ? e[t.indexOf("set") || !Vf(e["get" + t.substr(3)]) ? t : "get" + t.substr(3)](c) : e[t]() : u : n, f = Vf(u) ? c ? Ih : Fh : Ph, p;
	if (Bf(r) && (~r.indexOf("random(") && (r = Rm(r)), r.charAt(1) === "=" && (p = Np(d, r) + (bm(d) || 0), (p || p === 0) && (r = p))), !l || d !== r || Th) return !isNaN(d * r) && r !== "" ? (p = new qh(this._pt, e, t, +d || 0, r - (d || 0), typeof u == "boolean" ? Bh : zh, 0, f), c && (p.fp = c), o && p.modifier(o, this, e), this._pt = p) : (!u && !(t in e) && dp(t, r), bh.call(this, e, t, d, r, f, s || Df.stringFilter, c));
}, Sh = function(e, t, n, r, i) {
	if (Vf(e) && (e = Ah(e, i, t, n, r)), !Uf(e) || e.style && e.nodeType || Jf(e) || qf(e)) return Bf(e) ? Ah(e, i, t, n, r) : e;
	var a = {}, o;
	for (o in e) a[o] = Ah(e[o], i, t, n, r);
	return a;
}, Ch = function(e, t, n, r, i, a) {
	var o, s, c, l;
	if (Sp[e] && (o = new Sp[e]()).init(i, o.rawVars ? t[e] : Sh(t[e], r, i, a, n), n, r, a) !== !1 && (n._pt = s = new qh(n._pt, i, e, 0, 1, o.render, o, 0, o.priority), n !== Wm)) for (c = n._ptLookup[n._targets.indexOf(i)], l = o._props.length; l--;) c[o._props[l]] = s;
	return o;
}, wh, Th, Eh = function e(t, n, r) {
	var i = t.vars, a = i.ease, o = i.startAt, s = i.immediateRender, c = i.lazy, l = i.onUpdate, u = i.runBackwards, d = i.yoyoEase, f = i.keyframes, p = i.autoRevert, m = t._dur, h = t._startAt, g = t._targets, _ = t.parent, v = _ && _.data === "nested" ? _.vars.targets : g, y = t._overwrite === "auto" && !kf, b = t.timeline, x = i.easeReverse || d, S, C, w, T, E, D, O, k, A, j, M, ee, N;
	if (!b || f && a || (a = "none"), t._ease = fh(a, Of.ease), t._rEase = x && (fh(x) || t._ease), t._from = !b && !!i.runBackwards, t._from && (t.ratio = 1), !b || f && !i.stagger) {
		if (k = g[0] ? Op(g[0]).harness : 0, ee = k && i[k.prop], S = Wp(i, vp), h && (h._zTime < 0 && h.progress(1), n < 0 && u && s && !p ? h.render(-1, !0) : h.revert(u && m ? gp : hp), h._lazy = 0), o) {
			if (Yp(t._startAt = Nh.set(g, Bp({
				data: "isStart",
				overwrite: !1,
				parent: _,
				immediateRender: !0,
				lazy: !h && Wf(c),
				startAt: null,
				delay: 0,
				onUpdate: l && function() {
					return Hm(t, "onUpdate");
				},
				stagger: 0
			}, o))), t._startAt._dp = 0, t._startAt._sat = t, n < 0 && (Af || !s && !p) && t._startAt.revert(gp), s && m && n <= 0 && r <= 0) {
				n && (t._zTime = n);
				return;
			}
		} else if (u && m && !h) {
			if (n && (s = !1), w = Bp({
				overwrite: !1,
				data: "isFromStart",
				lazy: s && !h && Wf(c),
				immediateRender: s,
				stagger: 0,
				parent: _
			}, S), ee && (w[k.prop] = ee), Yp(t._startAt = Nh.set(g, w)), t._startAt._dp = 0, t._startAt._sat = t, n < 0 && (Af ? t._startAt.revert(gp) : t._startAt.render(-1, !0)), t._zTime = n, !s) e(t._startAt, Nf, Nf);
			else if (!n) return;
		}
		for (t._pt = t._ptCache = 0, c = m && Wf(c) || c && !m, C = 0; C < g.length; C++) {
			if (E = g[C], O = E._gsap || Dp(g)[C]._gsap, t._ptLookup[C] = j = {}, bp[O.id] && yp.length && Fp(), M = v === g ? C : v.indexOf(E), k && (A = new k()).init(E, ee || S, t, M, v) !== !1 && (t._pt = T = new qh(t._pt, E, A.name, 0, 1, A.render, A, 0, A.priority), A._props.forEach(function(e) {
				j[e] = T;
			}), A.priority && (D = 1)), !k || ee) for (w in S) Sp[w] && (A = Ch(w, S, t, M, E, v)) ? A.priority && (D = 1) : j[w] = T = xh.call(t, E, w, "get", S[w], M, v, 0, i.stringFilter);
			t._op && t._op[C] && t.kill(E, t._op[C]), y && t._pt && (wh = t, Q.killTweensOf(E, j, t.globalTime(n)), N = !t.parent, wh = 0), t._pt && c && (bp[O.id] = 1);
		}
		D && Kh(t), t._onInit && t._onInit(t);
	}
	t._onUpdate = l, t._initted = (!t._op || t._pt) && !N, f && n <= 0 && b.render(Mf, !0, !0);
}, Dh = function(e, t, n, r, i, a, o, s) {
	var c = (e._pt && e._ptCache || (e._ptCache = {}))[t], l, u, d, f;
	if (!c) for (c = e._ptCache[t] = [], d = e._ptLookup, f = e._targets.length; f--;) {
		if (l = d[f][t], l && l.d && l.d._pt) for (l = l.d._pt; l && l.p !== t && l.fp !== t;) l = l._next;
		if (!l) return Th = 1, e.vars[t] = "+=0", Eh(e, o), Th = 0, s ? fp(t + " not eligible for reset. Try splitting into individual properties") : 1;
		c.push(l);
	}
	for (f = c.length; f--;) u = c[f], l = u._pt || u, l.s = (r || r === 0) && !i ? r : l.s + (r || 0) + a * l.c, l.c = n - l.s, u.e && (u.e = jp(n) + bm(u.e)), u.b && (u.b = l.s + bm(u.b));
}, Oh = function(e, t) {
	var n = e[0] ? Op(e[0]).harness : 0, r = n && n.aliases, i, a, o, s;
	if (!r) return t;
	for (a in i = Hp({}, t), r) if (a in i) for (s = r[a].split(","), o = s.length; o--;) i[s[o]] = i[a];
	return i;
}, kh = function(e, t, n, r) {
	var i = t.ease || r || "power1.inOut", a, o;
	if (Jf(t)) o = n[e] || (n[e] = []), t.forEach(function(e, n) {
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
}, Ah = function(e, t, n, r, i) {
	return Vf(e) ? e.call(t, n, r, i) : Bf(e) && ~e.indexOf("random(") ? Rm(e) : e;
}, jh = Ep + "repeat,repeatDelay,yoyo,repeatRefresh,yoyoEase,easeReverse,autoRevert", Mh = {};
Ap(jh + ",id,stagger,delay,duration,paused,scrollTrigger", function(e) {
	return Mh[e] = 1;
}), jh = jh.split(",");
var Nh = /*#__PURE__*/ function(e) {
	Ef(t, e);
	function t(t, n, r, i) {
		var a;
		typeof n == "number" && (r.duration = n, n = r, r = null), a = e.call(this, i ? n : Gp(n)) || this;
		var o = a.vars, s = o.duration, c = o.delay, l = o.immediateRender, u = o.stagger, d = o.overwrite, f = o.keyframes, p = o.defaults, m = o.scrollTrigger, h = n.parent || Q, g = (Jf(t) || qf(t) ? Hf(t[0]) : "length" in n) ? [t] : Tm(t), _, v, y, b, x, S, C, w;
		if (a._targets = g.length ? Dp(g) : fp("GSAP target " + t + " not found. https://gsap.com", !Df.nullTargetWarn) || [], a._ptLookup = [], a._overwrite = d, f || u || Kf(s) || Kf(c)) {
			n = a.vars;
			var T = n.easeReverse || n.yoyoEase;
			if (_ = a.timeline = new yh({
				data: "nested",
				defaults: p || {},
				targets: h && h.data === "nested" ? h.vars.targets : g
			}), _.kill(), _.parent = _._dp = Tf(a), _._start = 0, u || Kf(s) || Kf(c)) {
				if (b = g.length, C = u && Om(u), Uf(u)) for (x in u) ~jh.indexOf(x) && (w ||= {}, w[x] = u[x]);
				for (v = 0; v < b; v++) y = Wp(n, Mh), y.stagger = 0, T && (y.easeReverse = T), w && Hp(y, w), S = g[v], y.duration = +Ah(s, Tf(a), v, S, g), y.delay = (+Ah(c, Tf(a), v, S, g) || 0) - a._delay, !u && b === 1 && y.delay && (a._delay = c = y.delay, a._start += c, y.delay = 0), _.to(S, y, C ? C(v, S, g) : 0), _._ease = ah.none;
				_.duration() ? s = c = 0 : a.timeline = 0;
			} else if (f) {
				Gp(Bp(_.vars.defaults, { ease: "none" })), _._ease = fh(f.ease || n.ease || "none");
				var E = 0, D, O, k;
				if (Jf(f)) f.forEach(function(e) {
					return _.to(g, e, ">");
				}), _.duration();
				else {
					for (x in y = {}, f) x === "ease" || x === "easeEach" || kh(x, f[x], y, f.easeEach);
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
		return d === !0 && !kf && (wh = Tf(a), Q.killTweensOf(g), wh = 0), om(h, Tf(a), r), n.reversed && a.reverse(), n.paused && a.paused(!0), (l || !s && !f && a._start === Mp(h._time) && Wf(l) && $p(Tf(a)) && h.data !== "nested") && (a._tTime = -Nf, a.render(Math.max(0, -c) || 0)), m && sm(Tf(a), m), a;
	}
	var n = t.prototype;
	return n.render = function(e, t, n) {
		var r = this._time, i = this._tDur, a = this._dur, o = e < 0, s = e > i - Nf && !o ? i : e < Nf ? 0 : e, c, l, u, d, f, p, m, h;
		if (!a) dm(this, e, t, n);
		else if (s !== this._tTime || !e || n || !this._initted && this._tTime || this._startAt && this._zTime < 0 !== o || this._lazy) {
			if (c = s, h = this.timeline, this._repeat) {
				if (d = a + this._rDelay, this._repeat < -1 && o) return this.totalTime(d * 100 + e, t, n);
				if (c = Mp(s % d), s === i ? (u = this._repeat, c = a) : (f = Mp(s / d), u = ~~f, u && u === f ? (c = a, u--) : c > a && (c = a)), p = this._yoyo && u & 1, p && (c = a - c), f = tm(this._tTime, d), c === r && !n && this._initted && u === f) return this._tTime = s, this;
				u !== f && this.vars.repeatRefresh && !p && !this._lock && c !== d && this._initted && (this._lock = n = 1, this.render(Mp(d * u), !0).invalidate()._lock = 0);
			}
			if (!this._initted) {
				if (cm(this, o ? e : c, n, t, s)) return this._tTime = 0, this;
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
			if (this._from && (this.ratio = m = 1 - m), this._tTime = s, this._time = c, !this._act && this._ts && (this._act = 1, this._lazy = 0), !r && s && !t && !f && (Hm(this, "onStart"), this._tTime !== s)) return this;
			for (l = this._pt; l;) l.r(m, l.d), l = l._next;
			h && h.render(e < 0 ? e : h._dur * h._ease(c / this._dur), t, n) || this._startAt && (this._zTime = e), this._onUpdate && !t && (o && Qp(this, e, t, n), Hm(this, "onUpdate")), this._repeat && u !== f && this.vars.onRepeat && !t && this.parent && Hm(this, "onRepeat"), s !== this._tDur && s || this._tTime !== s || (o && !this._onUpdate && Qp(this, e, !0, !0), (e || !a) && (s === this._tDur && this._ts > 0 || !s && this._ts < 0) && Yp(this, 1), !t && (!o || r) && (s || r || p) && (Hm(this, s === i ? "onComplete" : "onReverseComplete", !0), this._prom && !(s < i && this.timeScale() > 0) && this._prom()));
		}
		return this;
	}, n.targets = function() {
		return this._targets;
	}, n.invalidate = function(t) {
		return t && this.vars.runBackwards || (this._startAt = 0), this._pt = this._op = this._onUpdate = this._lazy = this.ratio = 0, this._ptLookup = [], this.timeline && this.timeline.invalidate(t), e.prototype.invalidate.call(this, t);
	}, n.resetTo = function(e, t, n, r, i) {
		nh || rh.wake(), this._ts || this.play();
		var a = Math.min(this._dur, (this._dp._time - this._start) * this._ts), o;
		return this._initted || Eh(this, a), o = this._ease(a / this._dur), Dh(this, e, t, n, r, o, a, i) ? this.resetTo(e, t, n, r, 1) : (im(this, 0), this.parent || qp(this._dp, this, "_first", "_last", this._dp._sort ? "_start" : 0), this.render(0));
	}, n.kill = function(e, t) {
		if (t === void 0 && (t = "all"), !e && (!t || t === "all")) return this._lazy = this._pt = 0, this.parent ? Um(this) : this.scrollTrigger && this.scrollTrigger.kill(!!Af), this;
		if (this.timeline) {
			var n = this.timeline.totalDuration();
			return this.timeline.killTweensOf(e, t, wh && wh.vars.overwrite !== !0)._first || Um(this), this.parent && n !== this.timeline.totalDuration() && pm(this, this._dur * this.timeline._tDur / n, 0, 1), this;
		}
		var r = this._targets, i = e ? Tm(e) : r, a = this._ptLookup, o = this._pt, s, c, l, u, d, f, p;
		if ((!t || t === "all") && Kp(r, i)) return t === "all" && (this._pt = 0), Um(this);
		for (s = this._op = this._op || [], t !== "all" && (Bf(t) && (d = {}, Ap(t, function(e) {
			return d[e] = 1;
		}), t = d), t = Oh(r, t)), p = r.length; p--;) if (~i.indexOf(r[p])) for (d in c = a[p], t === "all" ? (s[p] = t, u = c, l = {}) : (l = s[p] = s[p] || {}, u = t), u) f = c && c[d], f && ("kill" in f.d && f.d.kill(d) !== !0 || Jp(this, f, "_pt"), delete c[d]), l !== "all" && (l[d] = 1);
		return this._initted && !this._pt && o && Um(this), this;
	}, t.to = function(e, n) {
		return new t(e, n, arguments[2]);
	}, t.from = function(e, t) {
		return _m(1, arguments);
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
		return _m(2, arguments);
	}, t.set = function(e, n) {
		return n.duration = 0, n.repeatDelay || (n.repeat = 0), new t(e, n);
	}, t.killTweensOf = function(e, t, n) {
		return Q.killTweensOf(e, t, n);
	}, t;
}(vh);
Bp(Nh.prototype, {
	_targets: [],
	_lazy: 0,
	_startAt: 0,
	_op: 0,
	_onInit: 0
}), Ap("staggerTo,staggerFrom,staggerFromTo", function(e) {
	Nh[e] = function() {
		var t = new yh(), n = Sm.call(arguments, 0);
		return n.splice(e === "staggerFromTo" ? 5 : 4, 0, 0), t[e].apply(t, n);
	};
});
var Ph = function(e, t, n) {
	return e[t] = n;
}, Fh = function(e, t, n) {
	return e[t](n);
}, Ih = function(e, t, n, r) {
	return e[t](r.fp, n);
}, Lh = function(e, t, n) {
	return e.setAttribute(t, n);
}, Rh = function(e, t) {
	return Vf(e[t]) ? Fh : Z(e[t]) && e.setAttribute ? Lh : Ph;
}, zh = function(e, t) {
	return t.set(t.t, t.p, Math.round((t.s + t.c * e) * 1e6) / 1e6, t);
}, Bh = function(e, t) {
	return t.set(t.t, t.p, !!(t.s + t.c * e), t);
}, Vh = function(e, t) {
	var n = t._pt, r = "";
	if (!e && t.b) r = t.b;
	else if (e === 1 && t.e) r = t.e;
	else {
		for (; n;) r = n.p + (n.m ? n.m(n.s + n.c * e) : Math.round((n.s + n.c * e) * 1e4) / 1e4) + r, n = n._next;
		r += t.c;
	}
	t.set(t.t, t.p, r, t);
}, Hh = function(e, t) {
	for (var n = t._pt; n;) n.r(e, n.d), n = n._next;
}, Uh = function(e, t, n, r) {
	for (var i = this._pt, a; i;) a = i._next, i.p === r && i.modifier(e, t, n), i = a;
}, Wh = function(e) {
	for (var t = this._pt, n, r; t;) r = t._next, t.p === e && !t.op || t.op === e ? Jp(this, t, "_pt") : t.dep || (n = 1), t = r;
	return !n;
}, Gh = function(e, t, n, r) {
	r.mSet(e, t, r.m.call(r.tween, n, r.mt), r);
}, Kh = function(e) {
	for (var t = e._pt, n, r, i, a; t;) {
		for (n = t._next, r = i; r && r.pr > t.pr;) r = r._next;
		(t._prev = r ? r._prev : a) ? t._prev._next = t : i = t, (t._next = r) ? r._prev = t : a = t, t = n;
	}
	e._pt = i;
}, qh = /*#__PURE__*/ function() {
	function e(e, t, n, r, i, a, o, s, c) {
		this.t = t, this.s = r, this.c = i, this.p = n, this.r = a || zh, this.d = o || this, this.set = s || Ph, this.pr = c || 0, this._next = e, e && (e._prev = this);
	}
	var t = e.prototype;
	return t.modifier = function(e, t, n) {
		this.mSet = this.mSet || this.set, this.set = Gh, this.m = e, this.mt = n, this.tween = t;
	}, e;
}();
Ap(Ep + "parent,duration,ease,delay,overwrite,runBackwards,startAt,yoyo,immediateRender,repeat,repeatDelay,data,paused,reversed,lazy,callbackScope,stringFilter,id,yoyoEase,stagger,inherit,repeatRefresh,keyframes,autoRevert,scrollTrigger,easeReverse", function(e) {
	return vp[e] = 1;
}), sp.TweenMax = sp.TweenLite = Nh, sp.TimelineLite = sp.TimelineMax = yh, Q = new yh({
	sortChildren: !1,
	defaults: Of,
	autoRemoveChildren: !0,
	id: "root",
	smoothChildTiming: !0
}), Df.stringFilter = th;
var Jh = [], Yh = {}, Xh = [], Zh = 0, Qh = 0, $h = function(e) {
	return (Yh[e] || Xh).map(function(e) {
		return e();
	});
}, eg = function() {
	var e = Date.now(), t = [];
	e - Zh > 2 && ($h("matchMediaInit"), Jh.forEach(function(e) {
		var n = e.queries, r = e.conditions, i, a, o, s;
		for (a in n) i = ip.matchMedia(n[a]).matches, i && (o = 1), i !== r[a] && (r[a] = i, s = 1);
		s && (e.revert(), o && t.push(e));
	}), $h("matchMediaRevert"), t.forEach(function(e) {
		return e.onMatch(e, function(t) {
			return e.add(null, t);
		});
	}), Zh = e, $h("matchMedia"));
}, tg = /*#__PURE__*/ function() {
	function e(e, t) {
		this.selector = t && Em(t), this.data = [], this._r = [], this.isReverted = !1, this.id = Qh++, e && this.add(e);
	}
	var t = e.prototype;
	return t.add = function(e, t, n) {
		Vf(e) && (n = t, t = e, e = Vf);
		var r = this, i = function() {
			var e = jf, i = r.selector, a;
			return e && e !== r && e.data.push(r), n && (r.selector = Em(n)), jf = r, a = t.apply(r, arguments), Vf(a) && r._r.push(a), jf = e, r.selector = i, r.isReverted = !1, a;
		};
		return r.last = i, e === Vf ? i(r, function(e) {
			return r.add(null, e);
		}) : e ? r[e] = i : i;
	}, t.ignore = function(e) {
		var t = jf;
		jf = null, e(this), jf = t;
	}, t.getTweens = function() {
		var t = [];
		return this.data.forEach(function(n) {
			return n instanceof e ? t.push.apply(t, n.getTweens()) : n instanceof Nh && !(n.parent && n.parent.data === "nested") && t.push(n);
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
			}), r = n.data.length; r--;) i = n.data[r], i instanceof yh ? i.data !== "nested" && (i.scrollTrigger && i.scrollTrigger.revert(), i.kill()) : !(i instanceof Nh) && i.revert && i.revert(e);
			n._r.forEach(function(t) {
				return t(e, n);
			}), n.isReverted = !0;
		})() : this.data.forEach(function(e) {
			return e.kill && e.kill();
		}), this.clear(), t) {
			for (var r = Jh.length; r--;) Jh[r].id === this.id && Jh.splice(r, 1);
			this._mqs && this._mqs.forEach(function(e) {
				return e.removeListener ? e.removeListener(eg) : e.removeEventListener("change", eg);
			}), this._mqs = null;
		}
	}, t.revert = function(e) {
		this.kill(e || {});
	}, e;
}(), ng = /*#__PURE__*/ function() {
	function e(e) {
		this.contexts = [], this.scope = e, jf && jf.data.push(this);
	}
	var t = e.prototype;
	return t.add = function(e, t, n) {
		Uf(e) || (e = { matches: e });
		var r = new tg(0, n || this.scope), i = r.conditions = {}, a, o, s;
		for (o in jf && !r.selector && (r.selector = jf.selector), this.contexts.push(r), t = r.add("onMatch", t), r.queries = e, e) o === "all" ? s = 1 : (a = ip.matchMedia(e[o]), a && (Jh.indexOf(r) < 0 && Jh.push(r), (i[o] = a.matches) && (s = 1), a.addListener ? a.addListener(eg) : a.addEventListener("change", eg), (r._mqs ||= []).push(a)));
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
}(), rg = {
	registerPlugin: function() {
		[...arguments].forEach(function(e) {
			return Km(e);
		});
	},
	timeline: function(e) {
		return new yh(e);
	},
	getTweensOf: function(e, t) {
		return Q.getTweensOf(e, t);
	},
	getProperty: function(e, t, n, r) {
		Bf(e) && (e = Tm(e)[0]);
		var i = Op(e || {}).get, a = n ? zp : Rp;
		return n === "native" && (n = ""), e && (t ? a((Sp[t] && Sp[t].get || i)(e, t, n, r)) : function(t, n, r) {
			return a((Sp[t] && Sp[t].get || i)(e, t, n, r));
		});
	},
	quickSetter: function(e, t, n) {
		if (e = Tm(e), e.length > 1) {
			var r = e.map(function(e) {
				return sg.quickSetter(e, t, n);
			}), i = r.length;
			return function(e) {
				for (var t = i; t--;) r[t](e);
			};
		}
		e = e[0] || {};
		var a = Sp[t], o = Op(e), s = o.harness && (o.harness.aliases || {})[t] || t, c = a ? function(t) {
			var r = new a();
			Wm._pt = 0, r.init(e, n ? t + n : t, Wm, 0, [e]), r.render(1, r), Wm._pt && Hh(1, Wm);
		} : o.set(e, s);
		return a ? c : function(t) {
			return c(e, s, n ? t + n : t, o, 1);
		};
	},
	quickTo: function(e, t, n) {
		var r, i = sg.to(e, Bp((r = {}, r[t] = "+=0.1", r.paused = !0, r.stagger = 0, r), n || {})), a = function(e, n, r) {
			return i.resetTo(t, e, n, r);
		};
		return a.tween = i, a;
	},
	isTweening: function(e) {
		return Q.getTweensOf(e, !0).length > 0;
	},
	defaults: function(e) {
		return e && e.ease && (e.ease = fh(e.ease, Of.ease)), Up(Of, e || {});
	},
	config: function(e) {
		return Up(Df, e || {});
	},
	registerEffect: function(e) {
		var t = e.name, n = e.effect, r = e.plugins, i = e.defaults, a = e.extendTimeline;
		(r || "").split(",").forEach(function(e) {
			return e && !Sp[e] && !sp[e] && fp(t + " effect requires " + e + " plugin.");
		}), Cp[t] = function(e, t, r) {
			return n(Tm(e), Bp(t || {}, i), r);
		}, a && (yh.prototype[t] = function(e, n, r) {
			return this.add(Cp[t](e, Uf(n) ? n : (r = n) && {}, this), r);
		});
	},
	registerEase: function(e, t) {
		ah[e] = fh(t);
	},
	parseEase: function(e, t) {
		return arguments.length ? fh(e, t) : ah;
	},
	getById: function(e) {
		return Q.getById(e);
	},
	exportRoot: function(e, t) {
		e === void 0 && (e = {});
		var n = new yh(e), r, i;
		for (n.smoothChildTiming = Wf(e.smoothChildTiming), Q.remove(n), n._dp = 0, n._time = n._tTime = Q._time, r = Q._first; r;) i = r._next, (t || !(!r._dur && r instanceof Nh && r.vars.onComplete === r._targets[0])) && om(n, r, r._start - r._delay), r = i;
		return om(Q, n, 0), n;
	},
	context: function(e, t) {
		return e ? new tg(e, t) : jf;
	},
	matchMedia: function(e) {
		return new ng(e);
	},
	matchMediaRefresh: function() {
		return Jh.forEach(function(e) {
			var t = e.conditions, n, r;
			for (r in t) t[r] && (t[r] = !1, n = 1);
			n && e.revert();
		}) || eg();
	},
	addEventListener: function(e, t) {
		var n = Yh[e] || (Yh[e] = []);
		~n.indexOf(t) || n.push(t);
	},
	removeEventListener: function(e, t) {
		var n = Yh[e], r = n && n.indexOf(t);
		r >= 0 && n.splice(r, 1);
	},
	utils: {
		wrap: Im,
		wrapYoyo: Lm,
		distribute: Om,
		random: jm,
		snap: Am,
		normalize: Pm,
		getUnit: bm,
		clamp: xm,
		splitColor: Xm,
		toArray: Tm,
		selector: Em,
		mapRange: zm,
		pipe: Mm,
		unitize: Nm,
		interpolate: Bm,
		shuffle: Dm
	},
	install: up,
	effects: Cp,
	ticker: rh,
	updateRoot: yh.updateRoot,
	plugins: Sp,
	globalTimeline: Q,
	core: {
		PropTween: qh,
		globals: pp,
		Tween: Nh,
		Timeline: yh,
		Animation: vh,
		getCache: Op,
		_removeLinkedListItem: Jp,
		reverting: function() {
			return Af;
		},
		context: function(e) {
			return e && jf && (jf.data.push(e), e._ctx = jf), jf;
		},
		suppressOverwrites: function(e) {
			return kf = e;
		}
	}
};
Ap("to,from,fromTo,delayedCall,set,killTweensOf", function(e) {
	return rg[e] = Nh[e];
}), rh.add(yh.updateRoot), Wm = rg.to({}, { duration: 0 });
var ig = function(e, t) {
	for (var n = e._pt; n && n.p !== t && n.op !== t && n.fp !== t;) n = n._next;
	return n;
}, ag = function(e, t) {
	var n = e._targets, r, i, a;
	for (r in t) for (i = n.length; i--;) a = e._ptLookup[i][r], (a &&= a.d) && (a._pt && (a = ig(a, r)), a && a.modifier && a.modifier(t[r], e, n[i], r));
}, og = function(e, t) {
	return {
		name: e,
		headless: 1,
		rawVars: 1,
		init: function(e, n, r) {
			r._onInit = function(e) {
				var r, i;
				if (Bf(n) && (r = {}, Ap(n, function(e) {
					return r[e] = 1;
				}), n = r), t) {
					for (i in r = {}, n) r[i] = t(n[i]);
					n = r;
				}
				ag(e, n);
			};
		}
	};
}, sg = rg.registerPlugin({
	name: "attr",
	init: function(e, t, n, r, i) {
		var a, o, s;
		for (a in this.tween = n, t) s = e.getAttribute(a) || "", o = this.add(e, "setAttribute", (s || 0) + "", t[a], r, i, 0, 0, a), o.op = a, o.b = s, this._props.push(a);
	},
	render: function(e, t) {
		for (var n = t._pt; n;) Af ? n.set(n.t, n.p, n.b, n) : n.r(e, n.d), n = n._next;
	}
}, {
	name: "endArray",
	headless: 1,
	init: function(e, t) {
		for (var n = t.length; n--;) this.add(e, n, e[n] || 0, t[n], 0, 0, 0, 0, 0, 1);
	}
}, og("roundProps", km), og("modifiers"), og("snap", Am)) || rg;
Nh.version = yh.version = sg.version = "3.15.1", lp = 1, Gf() && ih(), ah.Power0, ah.Power1, ah.Power2, ah.Power3, ah.Power4, ah.Linear, ah.Quad, ah.Cubic, ah.Quart, ah.Quint, ah.Strong, ah.Elastic, ah.Back, ah.SteppedEase, ah.Bounce, ah.Sine, ah.Expo, ah.Circ;
// node_modules/gsap/CSSPlugin.js
var cg, lg, ug, dg, fg, pg, mg, hg = function() {
	return typeof window < "u";
}, gg = {}, _g = 180 / Math.PI, vg = Math.PI / 180, yg = Math.atan2, bg = 1e8, xg = /([A-Z])/g, Sg = /(left|right|width|margin|padding|x)/i, Cg = /[\s,\(]\S/, wg = {
	autoAlpha: "opacity,visibility",
	scale: "scaleX,scaleY",
	alpha: "opacity"
}, Tg = function(e, t) {
	return t.set(t.t, t.p, Math.round((t.s + t.c * e) * 1e4) / 1e4 + t.u, t);
}, Eg = function(e, t) {
	return t.set(t.t, t.p, e === 1 ? t.e : Math.round((t.s + t.c * e) * 1e4) / 1e4 + t.u, t);
}, Dg = function(e, t) {
	return t.set(t.t, t.p, e ? Math.round((t.s + t.c * e) * 1e4) / 1e4 + t.u : t.b, t);
}, Og = function(e, t) {
	return t.set(t.t, t.p, e === 1 ? t.e : e ? Math.round((t.s + t.c * e) * 1e4) / 1e4 + t.u : t.b, t);
}, kg = function(e, t) {
	var n = t.s + t.c * e;
	t.set(t.t, t.p, ~~(n + (n < 0 ? -.5 : .5)) + t.u, t);
}, Ag = function(e, t) {
	return t.set(t.t, t.p, e ? t.e : t.b, t);
}, jg = function(e, t) {
	return t.set(t.t, t.p, e === 1 ? t.e : t.b, t);
}, Mg = function(e, t, n) {
	return e.style[t] = n;
}, Ng = function(e, t, n) {
	return e.style.setProperty(t, n);
}, Pg = function(e, t, n) {
	return e._gsap[t] = n;
}, Fg = function(e, t, n) {
	return e._gsap.scaleX = e._gsap.scaleY = n;
}, Ig = function(e, t, n, r, i) {
	var a = e._gsap;
	a.scaleX = a.scaleY = n, a.renderTransform(i, a);
}, Lg = function(e, t, n, r, i) {
	var a = e._gsap;
	a[t] = n, a.renderTransform(i, a);
}, Rg = "transform", zg = Rg + "Origin", Bg = function e(t, n) {
	var r = this, i = this.target, a = i.style, o = i._gsap;
	if (t in gg && a) {
		if (this.tfm = this.tfm || {}, t !== "transform") t = wg[t] || t, ~t.indexOf(",") ? t.split(",").forEach(function(e) {
			return r.tfm[e] = a_(i, e);
		}) : this.tfm[t] = o.x ? o[t] : a_(i, t), t === zg && (this.tfm.zOrigin = o.zOrigin);
		else return wg.transform.split(",").forEach(function(t) {
			return e.call(r, t, n);
		});
		if (this.props.indexOf(Rg) >= 0) return;
		o.svg && (this.svgo = i.getAttribute("data-svg-origin"), this.props.push(zg, n, "")), t = Rg;
	}
	(a || n) && this.props.push(t, n, a[t]);
}, Vg = function(e) {
	e.translate && (e.removeProperty("translate"), e.removeProperty("scale"), e.removeProperty("rotate"));
}, Hg = function() {
	for (var e = this.props, t = this.target, n = t.style, r = t._gsap, i = 0, a; i < e.length; i += 3) e[i + 1] ? e[i + 1] === 2 ? t[e[i]](e[i + 2]) : t[e[i]] = e[i + 2] : e[i + 2] ? n[e[i]] = e[i + 2] : n.removeProperty(e[i].substr(0, 2) === "--" ? e[i] : e[i].replace(xg, "-$1").toLowerCase());
	if (this.tfm) {
		for (a in this.tfm) r[a] = this.tfm[a];
		r.svg && (r.renderTransform(), t.setAttribute("data-svg-origin", this.svgo || "")), i = mg(), i && i.isStart || n[Rg] || (Vg(n), r.zOrigin && n[zg] && (n[zg] += " " + r.zOrigin + "px", r.zOrigin = 0, r.renderTransform()), r.uncache = 1);
	}
}, Ug = function(e, t) {
	var n = {
		target: e,
		props: [],
		revert: Hg,
		save: Bg
	};
	return e._gsap || sg.core.getCache(e), t && e.style && e.nodeType && t.split(",").forEach(function(e) {
		return n.save(e);
	}), n;
}, Wg, Gg = function(e, t) {
	var n = lg.createElementNS ? lg.createElementNS((t || "http://www.w3.org/1999/xhtml").replace(/^https/, "http"), e) : lg.createElement(e);
	return n && n.style ? n : lg.createElement(e);
}, Kg = function e(t, n, r) {
	var i = getComputedStyle(t);
	return i[n] || i.getPropertyValue(n.replace(xg, "-$1").toLowerCase()) || i.getPropertyValue(n) || !r && e(t, Jg(n) || n, 1) || "";
}, qg = "O,Moz,ms,Ms,Webkit".split(","), Jg = function(e, t, n) {
	var r = (t || fg).style, i = 5;
	if (e in r && !n) return e;
	for (e = e.charAt(0).toUpperCase() + e.substr(1); i-- && !(qg[i] + e in r););
	return i < 0 ? null : (i === 3 ? "ms" : i >= 0 ? qg[i] : "") + e;
}, Yg = function() {
	hg() && window.document && (cg = window, lg = cg.document, ug = lg.documentElement, fg = Gg("div") || { style: {} }, Gg("div"), Rg = Jg(Rg), zg = Rg + "Origin", fg.style.cssText = "border-width:0;line-height:0;position:absolute;padding:0", Wg = !!Jg("perspective"), mg = sg.core.reverting, dg = 1);
}, Xg = function(e) {
	var t = e.ownerSVGElement, n = Gg("svg", t && t.getAttribute("xmlns") || "http://www.w3.org/2000/svg"), r = e.cloneNode(!0), i;
	r.style.display = "block", n.appendChild(r), ug.appendChild(n);
	try {
		i = r.getBBox();
	} catch {}
	return n.removeChild(r), ug.removeChild(n), i;
}, Zg = function(e, t) {
	for (var n = t.length; n--;) if (e.hasAttribute(t[n])) return e.getAttribute(t[n]);
}, Qg = function(e) {
	var t, n;
	try {
		t = e.getBBox();
	} catch {
		t = Xg(e), n = 1;
	}
	return t && (t.width || t.height) || n || (t = Xg(e)), t && !t.width && !t.x && !t.y ? {
		x: +Zg(e, [
			"x",
			"cx",
			"x1"
		]) || 0,
		y: +Zg(e, [
			"y",
			"cy",
			"y1"
		]) || 0,
		width: 0,
		height: 0
	} : t;
}, $g = function(e) {
	return !(!e.getCTM || e.parentNode && !e.ownerSVGElement || !Qg(e));
}, e_ = function(e, t) {
	if (t) {
		var n = e.style, r;
		t in gg && t !== zg && (t = Rg), n.removeProperty ? (r = t.substr(0, 2), (r === "ms" || t.substr(0, 6) === "webkit") && (t = "-" + t), n.removeProperty(r === "--" ? t : t.replace(xg, "-$1").toLowerCase())) : n.removeAttribute(t);
	}
}, t_ = function(e, t, n, r, i, a) {
	var o = new qh(e._pt, t, n, 0, 1, a ? jg : Ag);
	return e._pt = o, o.b = r, o.e = i, e._props.push(n), o;
}, n_ = {
	deg: 1,
	rad: 1,
	turn: 1
}, r_ = {
	grid: 1,
	flex: 1
}, i_ = function e(t, n, r, i) {
	var a = parseFloat(r) || 0, o = (r + "").trim().substr((a + "").length) || "px", s = fg.style, c = Sg.test(n), l = t.tagName.toLowerCase() === "svg", u = (l ? "client" : "offset") + (c ? "Width" : "Height"), d = 100, f = i === "px", p = i === "%", m, h, g, _;
	if (i === o || !a || n_[i] || n_[o]) return a;
	if (o !== "px" && !f && (a = e(t, n, r, "px")), _ = t.getCTM && $g(t), (p || o === "%") && (gg[n] || ~n.indexOf("adius"))) return m = _ ? t.getBBox()[c ? "width" : "height"] : t[u], jp(p ? a / m * d : a / 100 * m);
	if (s[c ? "width" : "height"] = d + (f ? o : i), h = i !== "rem" && ~n.indexOf("adius") || i === "em" && t.appendChild && !l ? t : t.parentNode, _ && (h = (t.ownerSVGElement || {}).parentNode), h && h !== lg && h.appendChild || (h = lg.body), g = h._gsap, g && p && g.width && c && g.time === rh.time && !g.uncache) return jp(a / g.width * d);
	if (p && (n === "height" || n === "width")) {
		var v = t.style[n];
		t.style[n] = d + i, m = t[u], v ? t.style[n] = v : e_(t, n);
	} else (p || o === "%") && !r_[Kg(h, "display")] && (s.position = Kg(t, "position")), h === t && (s.position = "static"), h.appendChild(fg), m = fg[u], h.removeChild(fg), s.position = "absolute";
	return c && p && (g = Op(h), g.time = rh.time, g.width = h[u]), jp(f ? m * a / d : m && a ? d / m * a : 0);
}, a_ = function(e, t, n, r) {
	var i;
	return dg || Yg(), t in wg && t !== "transform" && (t = wg[t], ~t.indexOf(",") && (t = t.split(",")[0])), gg[t] && t !== "transform" ? (i = __(e, r), i = t === "transformOrigin" ? i.svg ? i.origin : v_(Kg(e, zg)) + " " + i.zOrigin + "px" : i[t]) : (i = e.style[t], (!i || i === "auto" || r || ~(i + "").indexOf("calc(")) && (i = u_[t] && u_[t](e, t, n) || Kg(e, t) || kp(e, t) || +(t === "opacity"))), n && !~(i + "").trim().indexOf(" ") ? i_(e, t, i, n) + n : i;
}, o_ = function(e, t, n, r) {
	if (!n || n === "none") {
		var i = Jg(t, e, 1), a = i && Kg(e, i, 1);
		a && a !== n ? (t = i, n = a) : t === "borderColor" && (n = Kg(e, "borderTopColor"));
	}
	var o = new qh(this._pt, e.style, t, 0, 1, Vh), s = 0, c = 0, l, u, d, f, p, m, h, g, _, v, y, b;
	if (o.b = n, o.e = r, n += "", r += "", r.substring(0, 6) === "var(--" && (r = Kg(e, r.substring(4, r.indexOf(")")))), r === "auto" && (m = e.style[t], e.style[t] = r, r = Kg(e, t) || r, m ? e.style[t] = m : e_(e, t)), l = [n, r], th(l), n = l[0], r = l[1], d = n.match($f) || [], b = r.match($f) || [], b.length) {
		for (; u = $f.exec(r);) h = u[0], _ = r.substring(s, u.index), p ? p = (p + 1) % 5 : (_.substr(-5) === "rgba(" || _.substr(-5) === "hsla(") && (p = 1), h !== (m = d[c++] || "") && (f = parseFloat(m) || 0, y = m.substr((f + "").length), h.charAt(1) === "=" && (h = Np(f, h) + y), g = parseFloat(h), v = h.substr((g + "").length), s = $f.lastIndex - v.length, v || (v = v || Df.units[t] || y, s === r.length && (r += v, o.e += v)), y !== v && (f = i_(e, t, m, v) || 0), o._pt = {
			_next: o._pt,
			p: _ || c === 1 ? _ : ",",
			s: f,
			c: g - f,
			m: p && p < 4 || t === "zIndex" ? Math.round : 0
		});
		o.c = s < r.length ? r.substring(s, r.length) : "";
	} else o.r = t === "display" && r === "none" ? jg : Ag;
	return tp.test(r) && (o.e = 0), this._pt = o, o;
}, s_ = {
	top: "0%",
	bottom: "100%",
	left: "0%",
	right: "100%",
	center: "50%"
}, c_ = function(e) {
	var t = e.split(" "), n = t[0], r = t[1] || "50%";
	return (n === "top" || n === "bottom" || r === "left" || r === "right") && (e = n, n = r, r = e), t[0] = s_[n] || n, t[1] = s_[r] || r, t.join(" ");
}, l_ = function(e, t) {
	if (t.tween && t.tween._time === t.tween._dur) {
		var n = t.t, r = n.style, i = t.u, a = n._gsap, o, s, c;
		if (i === "all" || i === !0) r.cssText = "", s = 1;
		else for (i = i.split(","), c = i.length; --c > -1;) o = i[c], gg[o] && (s = 1, o = o === "transformOrigin" ? zg : Rg), e_(n, o);
		s && (e_(n, Rg), a && (a.svg && n.removeAttribute("transform"), r.scale = r.rotate = r.translate = "none", __(n, 1), a.uncache = 1, Vg(r)));
	}
}, u_ = { clearProps: function(e, t, n, r, i) {
	if (i.data !== "isFromStart") {
		var a = e._pt = new qh(e._pt, t, n, 0, 0, l_);
		return a.u = r, a.pr = -10, a.tween = i, e._props.push(n), 1;
	}
} }, d_ = [
	1,
	0,
	0,
	1,
	0,
	0
], f_ = {}, p_ = function(e) {
	return e === "matrix(1, 0, 0, 1, 0, 0)" || e === "none" || !e;
}, m_ = function(e) {
	var t = Kg(e, Rg);
	return p_(t) ? d_ : t.substr(7).match(Qf).map(jp);
}, h_ = function(e, t) {
	var n = e._gsap || Op(e), r = e.style, i = m_(e), a, o, s, c;
	return n.svg && e.getAttribute("transform") ? (s = e.transform.baseVal.consolidate().matrix, i = [
		s.a,
		s.b,
		s.c,
		s.d,
		s.e,
		s.f
	], i.join(",") === "1,0,0,1,0,0" ? d_ : i) : (i === d_ && !e.offsetParent && e !== ug && !n.svg && (s = r.display, r.display = "block", a = e.parentNode, a && (e.offsetParent || e.getBoundingClientRect().width) || (c = 1, o = e.nextElementSibling, ug.appendChild(e)), i = m_(e), s ? r.display = s : e_(e, "display"), c && (o ? a.insertBefore(e, o) : a ? a.appendChild(e) : ug.removeChild(e))), t && i.length > 6 ? [
		i[0],
		i[1],
		i[4],
		i[5],
		i[12],
		i[13]
	] : i);
}, g_ = function(e, t, n, r, i, a) {
	var o = e._gsap, s = i || h_(e, !0), c = o.xOrigin || 0, l = o.yOrigin || 0, u = o.xOffset || 0, d = o.yOffset || 0, f = s[0], p = s[1], m = s[2], h = s[3], g = s[4], _ = s[5], v = t.split(" "), y = parseFloat(v[0]) || 0, b = parseFloat(v[1]) || 0, x, S, C, w;
	n ? s !== d_ && (S = f * h - p * m) && (C = h / S * y + b * (-m / S) + (m * _ - h * g) / S, w = y * (-p / S) + f / S * b - (f * _ - p * g) / S, y = C, b = w) : (x = Qg(e), y = x.x + (~v[0].indexOf("%") ? y / 100 * x.width : y), b = x.y + (~(v[1] || v[0]).indexOf("%") ? b / 100 * x.height : b)), r || r !== !1 && o.smooth ? (g = y - c, _ = b - l, o.xOffset = u + (g * f + _ * m) - g, o.yOffset = d + (g * p + _ * h) - _) : o.xOffset = o.yOffset = 0, o.xOrigin = y, o.yOrigin = b, o.smooth = !!r, o.origin = t, o.originIsAbsolute = !!n, e.style[zg] = "0px 0px", a && (t_(a, o, "xOrigin", c, y), t_(a, o, "yOrigin", l, b), t_(a, o, "xOffset", u, o.xOffset), t_(a, o, "yOffset", d, o.yOffset)), e.setAttribute("data-svg-origin", y + " " + b);
}, __ = function(e, t) {
	var n = e._gsap || new _h(e);
	if ("x" in n && !t && !n.uncache) return n;
	var r = e.style, i = n.scaleX < 0, a = "px", o = "deg", s = getComputedStyle(e), c = Kg(e, zg) || "0", l = u = d = m = h = g = _ = v = y = 0, u, d, f = p = 1, p, m, h, g, _, v, y, b, x, S, C, w, T, E, D, O, k, A, j, M, ee, N, P, F, I, te, L, ne;
	return n.svg = !!(e.getCTM && $g(e)), s.translate && ((s.translate !== "none" || s.scale !== "none" || s.rotate !== "none") && (r[Rg] = (s.translate === "none" ? "" : "translate3d(" + (s.translate + " 0 0").split(" ").slice(0, 3).join(", ") + ") ") + (s.rotate === "none" ? "" : "rotate(" + s.rotate + ") ") + (s.scale === "none" ? "" : "scale(" + s.scale.split(" ").join(",") + ") ") + (s[Rg] === "none" ? "" : s[Rg])), r.scale = r.rotate = r.translate = "none"), S = h_(e, n.svg), n.svg && (n.uncache ? (ee = e.getBBox(), c = n.xOrigin - ee.x + "px " + (n.yOrigin - ee.y) + "px", M = "") : M = !t && e.getAttribute("data-svg-origin"), g_(e, M || c, !!M || n.originIsAbsolute, n.smooth !== !1, S)), b = n.xOrigin || 0, x = n.yOrigin || 0, S !== d_ && (E = S[0], D = S[1], O = S[2], k = S[3], l = A = S[4], u = j = S[5], S.length === 6 ? (f = Math.sqrt(E * E + D * D), p = Math.sqrt(k * k + O * O), m = E || D ? yg(D, E) * _g : 0, _ = O || k ? yg(O, k) * _g + m : 0, _ && (p *= Math.abs(Math.cos(_ * vg))), n.svg && (l -= b - (b * E + x * O), u -= x - (b * D + x * k))) : (ne = S[6], te = S[7], P = S[8], F = S[9], I = S[10], L = S[11], l = S[12], u = S[13], d = S[14], C = yg(ne, I), h = C * _g, C && (w = Math.cos(-C), T = Math.sin(-C), M = A * w + P * T, ee = j * w + F * T, N = ne * w + I * T, P = A * -T + P * w, F = j * -T + F * w, I = ne * -T + I * w, L = te * -T + L * w, A = M, j = ee, ne = N), C = yg(-O, I), g = C * _g, C && (w = Math.cos(-C), T = Math.sin(-C), M = E * w - P * T, ee = D * w - F * T, N = O * w - I * T, L = k * T + L * w, E = M, D = ee, O = N), C = yg(D, E), m = C * _g, C && (w = Math.cos(C), T = Math.sin(C), M = E * w + D * T, ee = A * w + j * T, D = D * w - E * T, j = j * w - A * T, E = M, A = ee), h && Math.abs(h) + Math.abs(m) > 359.9 && (h = m = 0, g = 180 - g), f = jp(Math.sqrt(E * E + D * D + O * O)), p = jp(Math.sqrt(j * j + ne * ne)), C = yg(A, j), _ = Math.abs(C) > 2e-4 ? C * _g : 0, y = L ? 1 / (L < 0 ? -L : L) : 0), n.svg && (M = e.getAttribute("transform"), n.forceCSS = e.setAttribute("transform", "") || !p_(Kg(e, Rg)), M && e.setAttribute("transform", M))), Math.abs(_) > 90 && Math.abs(_) < 270 && (i ? (f *= -1, _ += m <= 0 ? 180 : -180, m += m <= 0 ? 180 : -180) : (p *= -1, _ += _ <= 0 ? 180 : -180)), t ||= n.uncache, n.x = l - ((n.xPercent = l && (!t && n.xPercent || (Math.round(e.offsetWidth / 2) === Math.round(-l) ? -50 : 0))) ? e.offsetWidth * n.xPercent / 100 : 0) + a, n.y = u - ((n.yPercent = u && (!t && n.yPercent || (Math.round(e.offsetHeight / 2) === Math.round(-u) ? -50 : 0))) ? e.offsetHeight * n.yPercent / 100 : 0) + a, n.z = d + a, n.scaleX = jp(f), n.scaleY = jp(p), n.rotation = jp(m) + o, n.rotationX = jp(h) + o, n.rotationY = jp(g) + o, n.skewX = _ + o, n.skewY = v + o, n.transformPerspective = y + a, (n.zOrigin = parseFloat(c.split(" ")[2]) || !t && n.zOrigin || 0) && (r[zg] = v_(c)), n.xOffset = n.yOffset = 0, n.force3D = Df.force3D, n.renderTransform = n.svg ? T_ : Wg ? w_ : b_, n.uncache = 0, n;
}, v_ = function(e) {
	return (e = e.split(" "))[0] + " " + e[1];
}, y_ = function(e, t, n) {
	var r = bm(t);
	return jp(parseFloat(t) + parseFloat(i_(e, "x", n + "px", r))) + r;
}, b_ = function(e, t) {
	t.z = "0px", t.rotationY = t.rotationX = "0deg", t.force3D = 0, w_(e, t);
}, x_ = "0deg", S_ = "0px", C_ = ") ", w_ = function(e, t) {
	var n = t || this, r = n.xPercent, i = n.yPercent, a = n.x, o = n.y, s = n.z, c = n.rotation, l = n.rotationY, u = n.rotationX, d = n.skewX, f = n.skewY, p = n.scaleX, m = n.scaleY, h = n.transformPerspective, g = n.force3D, _ = n.target, v = n.zOrigin, y = "", b = g === "auto" && e && e !== 1 || g === !0;
	if (v && (u !== x_ || l !== x_)) {
		var x = parseFloat(l) * vg, S = Math.sin(x), C = Math.cos(x), w;
		x = parseFloat(u) * vg, w = Math.cos(x), a = y_(_, a, S * w * -v), o = y_(_, o, -Math.sin(x) * -v), s = y_(_, s, C * w * -v + v);
	}
	h !== S_ && (y += "perspective(" + h + C_), (r || i) && (y += "translate(" + r + "%, " + i + "%) "), (b || a !== S_ || o !== S_ || s !== S_) && (y += s !== S_ || b ? "translate3d(" + a + ", " + o + ", " + s + ") " : "translate(" + a + ", " + o + C_), c !== x_ && (y += "rotate(" + c + C_), l !== x_ && (y += "rotateY(" + l + C_), u !== x_ && (y += "rotateX(" + u + C_), (d !== x_ || f !== x_) && (y += "skew(" + d + ", " + f + C_), (p !== 1 || m !== 1) && (y += "scale(" + p + ", " + m + C_), _.style[Rg] = y || "translate(0, 0)";
}, T_ = function(e, t) {
	var n = t || this, r = n.xPercent, i = n.yPercent, a = n.x, o = n.y, s = n.rotation, c = n.skewX, l = n.skewY, u = n.scaleX, d = n.scaleY, f = n.target, p = n.xOrigin, m = n.yOrigin, h = n.xOffset, g = n.yOffset, _ = n.forceCSS, v = parseFloat(a), y = parseFloat(o), b, x, S, C, w;
	s = parseFloat(s), c = parseFloat(c), l = parseFloat(l), l && (l = parseFloat(l), c += l, s += l), s || c ? (s *= vg, c *= vg, b = Math.cos(s) * u, x = Math.sin(s) * u, S = Math.sin(s - c) * -d, C = Math.cos(s - c) * d, c && (l *= vg, w = Math.tan(c - l), w = Math.sqrt(1 + w * w), S *= w, C *= w, l && (w = Math.tan(l), w = Math.sqrt(1 + w * w), b *= w, x *= w)), b = jp(b), x = jp(x), S = jp(S), C = jp(C)) : (b = u, C = d, x = S = 0), (v && !~(a + "").indexOf("px") || y && !~(o + "").indexOf("px")) && (v = i_(f, "x", a, "px"), y = i_(f, "y", o, "px")), (p || m || h || g) && (v = jp(v + p - (p * b + m * S) + h), y = jp(y + m - (p * x + m * C) + g)), (r || i) && (w = f.getBBox(), v = jp(v + r / 100 * w.width), y = jp(y + i / 100 * w.height)), w = "matrix(" + b + "," + x + "," + S + "," + C + "," + v + "," + y + ")", f.setAttribute("transform", w), _ && (f.style[Rg] = w);
}, E_ = function(e, t, n, r, i) {
	var a = 360, o = Bf(i), s = parseFloat(i) * (o && ~i.indexOf("rad") ? _g : 1) - r, c = r + s + "deg", l, u;
	return o && (l = i.split("_")[1], l === "short" && (s %= a, s !== s % (a / 2) && (s += s < 0 ? a : -a)), l === "cw" && s < 0 ? s = (s + a * bg) % a - ~~(s / a) * a : l === "ccw" && s > 0 && (s = (s - a * bg) % a - ~~(s / a) * a)), e._pt = u = new qh(e._pt, t, n, r, s, Eg), u.e = c, u.u = "deg", e._props.push(n), u;
}, D_ = function(e, t) {
	for (var n in t) e[n] = t[n];
	return e;
}, O_ = function(e, t, n) {
	var r = D_({}, n._gsap), i = "perspective,force3D,transformOrigin,svgOrigin", a = n.style, o, s, c, l, u, d, f, p;
	for (s in r.svg ? (c = n.getAttribute("transform"), n.setAttribute("transform", ""), a[Rg] = t, o = __(n, 1), e_(n, Rg), n.setAttribute("transform", c)) : (c = getComputedStyle(n)[Rg], a[Rg] = t, o = __(n, 1), a[Rg] = c), gg) c = r[s], l = o[s], c !== l && i.indexOf(s) < 0 && (f = bm(c), p = bm(l), u = f === p ? parseFloat(c) : i_(n, s, c, p), d = parseFloat(l), e._pt = new qh(e._pt, o, s, u, d - u, Tg), e._pt.u = p || 0, e._props.push(s));
	D_(o, r);
};
Ap("padding,margin,Width,Radius", function(e, t) {
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
	u_[t > 1 ? "border" + e : e] = function(e, t, n, r, i) {
		var a, s;
		if (arguments.length < 4) return a = o.map(function(t) {
			return a_(e, t, n);
		}), s = a.join(" "), s.split(a[0]).length === 5 ? a[0] : s;
		a = (r + "").split(" "), s = {}, o.forEach(function(e, t) {
			return s[e] = a[t] = a[t] || a[(t - 1) / 2 | 0];
		}), e.init(t, s, i);
	};
});
var k_ = {
	name: "css",
	register: Yg,
	targetTest: function(e) {
		return e.style && e.nodeType;
	},
	init: function(e, t, n, r, i) {
		var a = this._props, o = e.style, s = n.vars.startAt, c, l, u, d, f, p, m, h, g, _, v, y, b, x, S, C, w;
		for (m in dg || Yg(), this.styles = this.styles || Ug(e), C = this.styles.props, this.tween = n, t) if (m !== "autoRound" && (l = t[m], !(Sp[m] && Ch(m, t, n, r, e, i)))) {
			if (f = typeof l, p = u_[m], f === "function" && (l = l.call(n, r, e, i), f = typeof l), f === "string" && ~l.indexOf("random(") && (l = Rm(l)), p) p(this, e, m, l, n) && (S = 1);
			else if (m.substr(0, 2) === "--") c = (getComputedStyle(e).getPropertyValue(m) + "").trim(), l += "", $m.lastIndex = 0, $m.test(c) || (h = bm(c), g = bm(l), g ? h !== g && (c = i_(e, m, c, g) + g) : h && (l += h)), this.add(o, "setProperty", c, l, r, i, 0, 0, m), a.push(m), C.push(m, 0, o[m]);
			else if (f !== "undefined") {
				if (s && m in s ? (c = typeof s[m] == "function" ? s[m].call(n, r, e, i) : s[m], Bf(c) && ~c.indexOf("random(") && (c = Rm(c)), bm(c + "") || c === "auto" || (c += Df.units[m] || bm(a_(e, m)) || ""), (c + "").charAt(1) === "=" && (c = a_(e, m))) : c = a_(e, m), d = parseFloat(c), _ = f === "string" && l.charAt(1) === "=" && l.substr(0, 2), _ && (l = l.substr(2)), u = parseFloat(l), m in wg && (m === "autoAlpha" && (d === 1 && a_(e, "visibility") === "hidden" && u && (d = 0), C.push("visibility", 0, o.visibility), t_(this, o, "visibility", d ? "inherit" : "hidden", u ? "inherit" : "hidden", !u)), m !== "scale" && m !== "transform" && (m = wg[m], ~m.indexOf(",") && (m = m.split(",")[0]))), v = m in gg, v) {
					if (this.styles.save(m), w = l, f === "string" && l.substring(0, 6) === "var(--") {
						if (l = Kg(e, l.substring(4, l.indexOf(")"))), l.substring(0, 5) === "calc(") {
							var T = e.style.perspective;
							e.style.perspective = l, l = Kg(e, "perspective"), T ? e.style.perspective = T : e_(e, "perspective");
						}
						u = parseFloat(l);
					}
					if (y || (b = e._gsap, b.renderTransform && !t.parseTransform || __(e, t.parseTransform), x = t.smoothOrigin !== !1 && b.smooth, y = this._pt = new qh(this._pt, o, Rg, 0, 1, b.renderTransform, b, 0, -1), y.dep = 1), m === "scale") this._pt = new qh(this._pt, b, "scaleY", b.scaleY, (_ ? Np(b.scaleY, _ + u) : u) - b.scaleY || 0, Tg), this._pt.u = 0, a.push("scaleY", m), m += "X";
					else if (m === "transformOrigin") {
						C.push(zg, 0, o[zg]), l = c_(l), b.svg ? g_(e, l, 0, x, 0, this) : (g = parseFloat(l.split(" ")[2]) || 0, g !== b.zOrigin && t_(this, b, "zOrigin", b.zOrigin, g), t_(this, o, m, v_(c), v_(l)));
						continue;
					} else if (m === "svgOrigin") {
						g_(e, l, 1, x, 0, this);
						continue;
					} else if (m in f_) {
						E_(this, b, m, d, _ ? Np(d, _ + l) : l);
						continue;
					} else if (m === "smoothOrigin") {
						t_(this, b, "smooth", b.smooth, l);
						continue;
					} else if (m === "force3D") {
						b[m] = l;
						continue;
					} else if (m === "transform") {
						O_(this, l, e);
						continue;
					}
				} else m in o || (m = Jg(m) || m);
				if (v || (u || u === 0) && (d || d === 0) && !Cg.test(l) && m in o) h = (c + "").substr((d + "").length), u ||= 0, g = bm(l) || (m in Df.units ? Df.units[m] : h), h !== g && (d = i_(e, m, c, g)), this._pt = new qh(this._pt, v ? b : o, m, d, (_ ? Np(d, _ + u) : u) - d, !v && (g === "px" || m === "zIndex") && t.autoRound !== !1 ? kg : Tg), this._pt.u = g || 0, v && w !== l ? (this._pt.b = c, this._pt.e = w, this._pt.r = Og) : h !== g && g !== "%" && (this._pt.b = c, this._pt.r = Dg);
				else if (m in o) o_.call(this, e, m, c, _ ? _ + l : l);
				else if (m in e) this.add(e, m, c || e[m], _ ? _ + l : l, r, i);
				else if (m !== "parseTransform") {
					dp(m, l);
					continue;
				}
				v || (m in o ? C.push(m, 0, o[m]) : typeof e[m] == "function" ? C.push(m, 2, e[m]()) : C.push(m, 1, c || e[m])), a.push(m);
			}
		}
		S && Kh(this);
	},
	render: function(e, t) {
		if (t.tween._time || !mg()) for (var n = t._pt; n;) n.r(e, n.d), n = n._next;
		else t.styles.revert();
	},
	get: a_,
	aliases: wg,
	getSetter: function(e, t, n) {
		var r = wg[t];
		return r && r.indexOf(",") < 0 && (t = r), t in gg && t !== zg && (e._gsap.x || a_(e, "x")) ? n && pg === n ? t === "scale" ? Fg : Pg : (pg = n || {}) && (t === "scale" ? Ig : Lg) : e.style && !Z(e.style[t]) ? Mg : ~t.indexOf("-") ? Ng : Rh(e, t);
	},
	core: {
		_removeProperty: e_,
		_getMatrix: h_
	}
};
sg.utils.checkPrefix = Jg, sg.core.getStyleSaver = Ug, (function(e, t, n, r) {
	var i = Ap(e + "," + t + "," + n, function(e) {
		gg[e] = 1;
	});
	Ap(t, function(e) {
		Df.units[e] = "deg", f_[e] = 1;
	}), wg[i[13]] = e + "," + t, Ap(r, function(e) {
		var t = e.split(":");
		wg[t[1]] = i[t[0]];
	});
})("x,y,z,scale,scaleX,scaleY,xPercent,yPercent", "rotation,rotationX,rotationY,skewX,skewY", "transform,transformOrigin,svgOrigin,force3D,smoothOrigin,transformPerspective", "0:translateX,1:translateY,2:translateZ,8:rotate,8:rotationZ,8:rotateZ,9:rotateX,10:rotateY"), Ap("x,y,z,top,right,bottom,left,width,height,fontSize,padding,margin,perspective", function(e) {
	Df.units[e] = "px";
}), sg.registerPlugin(k_);
// node_modules/gsap/index.js
var A_ = sg.registerPlugin(k_) || sg;
A_.core.Tween;
// node_modules/gsap/Observer.js
function j_(e, t) {
	for (var n = 0; n < t.length; n++) {
		var r = t[n];
		r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r);
	}
}
function M_(e, t, n) {
	return t && j_(e.prototype, t), n && j_(e, n), e;
}
var N_, P_, F_, I_, L_, R_, z_, B_, V_, H_, U_, W_, G_, K_ = function() {
	return N_ || typeof window < "u" && (N_ = window.gsap) && N_.registerPlugin && N_;
}, q_ = 1, J_ = [], Y_ = [], X_ = [], Z_ = Date.now, Q_ = function(e, t) {
	return t;
}, $_ = function() {
	var e = V_.core, t = e.bridge || {}, n = e._scrollers, r = e._proxies;
	n.push.apply(n, Y_), r.push.apply(r, X_), Y_ = n, X_ = r, Q_ = function(e, n) {
		return t[e](n);
	};
}, ev = function(e, t) {
	return ~X_.indexOf(e) && X_[X_.indexOf(e) + 1][t];
}, tv = function(e) {
	return !!~H_.indexOf(e);
}, nv = function(e, t, n, r, i) {
	return e.addEventListener(t, n, {
		passive: r !== !1,
		capture: !!i
	});
}, rv = function(e, t, n, r) {
	return e.removeEventListener(t, n, !!r);
}, iv = "scrollLeft", av = "scrollTop", ov = function() {
	return U_ && U_.isPressed || Y_.cache++;
}, sv = function(e, t) {
	var n = function n(r) {
		if (r || r === 0) {
			q_ && F_.history.scrollRestoration !== "manual" && (F_.history.scrollRestoration = "manual");
			var i = U_ && U_.isPressed;
			r = n.v = Math.round(r) || (U_ && U_.iOS ? 1 : 0), e(r), n.cacheID = Y_.cache, i && Q_("ss", r);
		} else (t || Y_.cache !== n.cacheID || Q_("ref")) && (n.cacheID = Y_.cache, n.v = e());
		return n.v + n.offset;
	};
	return n.offset = 0, e && n;
}, cv = {
	s: iv,
	p: "left",
	p2: "Left",
	os: "right",
	os2: "Right",
	d: "width",
	d2: "Width",
	a: "x",
	sc: sv(function(e) {
		return arguments.length ? F_.scrollTo(e, lv.sc()) : F_.pageXOffset || I_[iv] || L_[iv] || R_[iv] || 0;
	})
}, lv = {
	s: av,
	p: "top",
	p2: "Top",
	os: "bottom",
	os2: "Bottom",
	d: "height",
	d2: "Height",
	a: "y",
	op: cv,
	sc: sv(function(e) {
		return arguments.length ? F_.scrollTo(cv.sc(), e) : F_.pageYOffset || I_[av] || L_[av] || R_[av] || 0;
	})
}, uv = function(e, t) {
	return (t && t._ctx && t._ctx.selector || N_.utils.toArray)(e)[0] || (typeof e == "string" && N_.config().nullTargetWarn !== !1 ? console.warn("Element not found:", e) : null);
}, dv = function(e, t) {
	for (var n = t.length; n--;) if (t[n] === e || t[n].contains(e)) return !0;
	return !1;
}, fv = function(e, t) {
	var n = t.s, r = t.sc;
	tv(e) && (e = I_.scrollingElement || L_);
	var i = Y_.indexOf(e), a = r === lv.sc ? 1 : 2;
	!~i && (i = Y_.push(e) - 1), Y_[i + a] || nv(e, "scroll", ov);
	var o = Y_[i + a], s = o || (Y_[i + a] = sv(ev(e, n), !0) || (tv(e) ? r : sv(function(t) {
		return arguments.length ? e[n] = t : e[n];
	})));
	return s.target = e, o || (s.smooth = N_.getProperty(e, "scrollBehavior") === "smooth"), s;
}, pv = function(e, t, n) {
	var r = e, i = e, a = Z_(), o = a, s = t || 50, c = Math.max(500, s * 3), l = function(e, t) {
		var c = Z_();
		t || c - a > s ? (i = r, r = e, o = a, a = c) : n ? r += e : r = i + (e - i) / (c - o) * (a - o);
	};
	return {
		update: l,
		reset: function() {
			i = r = n ? 0 : r, o = a = 0;
		},
		getVelocity: function(e) {
			var t = o, s = i, u = Z_();
			return (e || e === 0) && e !== r && l(e), a === o || u - o > c ? 0 : (r + (n ? s : -s)) / ((n ? u : a) - t) * 1e3;
		}
	};
}, mv = function(e, t) {
	return t && !e._gsapAllow && e.cancelable !== !1 && e.preventDefault(), e.changedTouches ? e.changedTouches[0] : e;
}, hv = function(e) {
	var t = Math.max.apply(Math, e), n = Math.min.apply(Math, e);
	return Math.abs(t) >= Math.abs(n) ? t : n;
}, gv = function() {
	V_ = N_.core.globals().ScrollTrigger, V_ && V_.core && $_();
}, _v = function(e) {
	return N_ = e || K_(), !P_ && N_ && typeof document < "u" && document.body && (F_ = window, I_ = document, L_ = I_.documentElement, R_ = I_.body, H_ = [
		F_,
		I_,
		L_,
		R_
	], N_.utils.clamp, G_ = N_.core.context || function() {}, B_ = "onpointerenter" in R_ ? "pointer" : "mouse", z_ = vv.isTouch = F_.matchMedia && F_.matchMedia("(hover: none), (pointer: coarse)").matches ? 1 : "ontouchstart" in F_ || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0 ? 2 : 0, W_ = vv.eventTypes = ("ontouchstart" in L_ ? "touchstart,touchmove,touchcancel,touchend" : "onpointerdown" in L_ ? "pointerdown,pointermove,pointercancel,pointerup" : "mousedown,mousemove,mouseup,mouseup").split(","), setTimeout(function() {
		return q_ = 0;
	}, 500), P_ = 1), V_ || gv(), P_;
};
cv.op = lv, Y_.cache = 0;
var vv = /*#__PURE__*/ function() {
	function e(e) {
		this.init(e);
	}
	var t = e.prototype;
	return t.init = function(e) {
		P_ || _v(N_) || console.warn("Please gsap.registerPlugin(Observer)"), V_ || gv();
		var t = e.tolerance, n = e.dragMinimum, r = e.type, i = e.target, a = e.lineHeight, o = e.debounce, s = e.preventDefault, c = e.onStop, l = e.onStopDelay, u = e.ignore, d = e.wheelSpeed, f = e.event, p = e.onDragStart, m = e.onDragEnd, h = e.onDrag, g = e.onPress, _ = e.onRelease, v = e.onRight, y = e.onLeft, b = e.onUp, x = e.onDown, S = e.onChangeX, C = e.onChangeY, w = e.onChange, T = e.onToggleX, E = e.onToggleY, D = e.onHover, O = e.onHoverEnd, k = e.onMove, A = e.ignoreCheck, j = e.isNormalizer, M = e.onGestureStart, ee = e.onGestureEnd, N = e.onWheel, P = e.onEnable, F = e.onDisable, I = e.onClick, te = e.scrollSpeed, L = e.capture, ne = e.allowClicks, re = e.lockAxis, ie = e.onLockAxis;
		this.target = i = uv(i) || L_, this.vars = e, u &&= N_.utils.toArray(u), t ||= 1e-9, n ||= 0, d ||= 1, te ||= 1, r ||= "wheel,touch,pointer", o = o !== !1, a ||= parseFloat(F_.getComputedStyle(R_).lineHeight) || 22;
		var ae, oe, se, ce, R, le, ue, z = this, B = 0, V = 0, de = e.passive || !s && e.passive !== !1, fe = fv(i, cv), pe = fv(i, lv), me = fe(), he = pe(), H = ~r.indexOf("touch") && !~r.indexOf("pointer") && W_[0] === "pointerdown", ge = tv(i), U = i.ownerDocument || I_, W = [
			0,
			0,
			0
		], G = [
			0,
			0,
			0
		], _e = 0, ve = function() {
			return _e = Z_();
		}, ye = function(e, t) {
			return (z.event = e) && u && dv(e.target, u) || t && H && e.pointerType !== "touch" || A && A(e, t);
		}, be = function() {
			z._vx.reset(), z._vy.reset(), oe.pause(), c && c(z);
		}, xe = function() {
			var e = z.deltaX = hv(W), n = z.deltaY = hv(G), r = Math.abs(e) >= t, i = Math.abs(n) >= t;
			w && (r || i) && w(z, e, n, W, G), r && (v && z.deltaX > 0 && v(z), y && z.deltaX < 0 && y(z), S && S(z), T && z.deltaX < 0 != B < 0 && T(z), B = z.deltaX, W[0] = W[1] = W[2] = 0), i && (x && z.deltaY > 0 && x(z), b && z.deltaY < 0 && b(z), C && C(z), E && z.deltaY < 0 != V < 0 && E(z), V = z.deltaY, G[0] = G[1] = G[2] = 0), (ce || se) && (k && k(z), se &&= (p && se === 1 && p(z), h && h(z), 0), ce = !1), le && !(le = !1) && ie && ie(z), R &&= (N(z), !1), ae = 0;
		}, Se = function(e, t, n) {
			W[n] += e, G[n] += t, z._vx.update(e), z._vy.update(t), o ? ae ||= requestAnimationFrame(xe) : xe();
		}, Ce = function(e, t) {
			re && !ue && (z.axis = ue = Math.abs(e) > Math.abs(t) ? "x" : "y", le = !0), ue !== "y" && (W[2] += e, z._vx.update(e, !0)), ue !== "x" && (G[2] += t, z._vy.update(t, !0)), o ? ae ||= requestAnimationFrame(xe) : xe();
		}, we = function(e) {
			if (!ye(e, 1)) {
				e = mv(e, s);
				var t = e.clientX, r = e.clientY, i = t - z.x, a = r - z.y, o = z.isDragging;
				z.x = t, z.y = r, (o || (i || a) && (Math.abs(z.startX - t) >= n || Math.abs(z.startY - r) >= n)) && (se ||= o ? 2 : 1, o || (z.isDragging = !0), Ce(i, a));
			}
		}, Te = z.onPress = function(e) {
			ye(e, 1) || e && e.button || (z.axis = ue = null, oe.pause(), z.isPressed = !0, e = mv(e), B = V = 0, z.startX = z.x = e.clientX, z.startY = z.y = e.clientY, z._vx.reset(), z._vy.reset(), nv(j ? i : U, W_[1], we, de, !0), z.deltaX = z.deltaY = 0, g && g(z));
		}, Ee = z.onRelease = function(e) {
			if (!ye(e, 1)) {
				rv(j ? i : U, W_[1], we, !0);
				var t = !isNaN(z.y - z.startY), n = z.isDragging, r = n && (Math.abs(z.x - z.startX) > 3 || Math.abs(z.y - z.startY) > 3), a = mv(e);
				!r && t && (z._vx.reset(), z._vy.reset(), s && ne && N_.delayedCall(.08, function() {
					if (Z_() - _e > 300 && !e.defaultPrevented) {
						if (e.target.click) e.target.click();
						else if (U.createEvent) {
							var t = U.createEvent("MouseEvents");
							t.initMouseEvent("click", !0, !0, F_, 1, a.screenX, a.screenY, a.clientX, a.clientY, !1, !1, !1, !1, 0, null), e.target.dispatchEvent(t);
						}
					}
				})), z.isDragging = z.isGesturing = z.isPressed = !1, c && n && !j && oe.restart(!0), se && xe(), m && n && m(z), _ && _(z, r);
			}
		}, De = function(e) {
			return e.touches && e.touches.length > 1 && (z.isGesturing = !0) && M(e, z.isDragging);
		}, Oe = function() {
			return (z.isGesturing = !1) || ee(z);
		}, ke = function(e) {
			if (!ye(e)) {
				var t = fe(), n = pe();
				Se((t - me) * te, (n - he) * te, 1), me = t, he = n, c && oe.restart(!0);
			}
		}, Ae = function(e) {
			if (!ye(e)) {
				e = mv(e, s), N && (R = !0);
				var t = (e.deltaMode === 1 ? a : e.deltaMode === 2 ? F_.innerHeight : 1) * d;
				Se(e.deltaX * t, e.deltaY * t, 0), c && !j && oe.restart(!0);
			}
		}, je = function(e) {
			if (!ye(e)) {
				var t = e.clientX, n = e.clientY, r = t - z.x, i = n - z.y;
				z.x = t, z.y = n, ce = !0, c && oe.restart(!0), (r || i) && Ce(r, i);
			}
		}, Me = function(e) {
			z.event = e, D(z);
		}, Ne = function(e) {
			z.event = e, O(z);
		}, Pe = function(e) {
			return ye(e) || mv(e, s) && I(z);
		};
		oe = z._dc = N_.delayedCall(l || .25, be).pause(), z.deltaX = z.deltaY = 0, z._vx = pv(0, 50, !0), z._vy = pv(0, 50, !0), z.scrollX = fe, z.scrollY = pe, z.isDragging = z.isGesturing = z.isPressed = !1, G_(this), z.enable = function(e) {
			return z.isEnabled || (nv(ge ? U : i, "scroll", ov), r.indexOf("scroll") >= 0 && nv(ge ? U : i, "scroll", ke, de, L), r.indexOf("wheel") >= 0 && nv(i, "wheel", Ae, de, L), (r.indexOf("touch") >= 0 && z_ || r.indexOf("pointer") >= 0) && (nv(i, W_[0], Te, de, L), nv(U, W_[2], Ee), nv(U, W_[3], Ee), ne && nv(i, "click", ve, !0, !0), I && nv(i, "click", Pe), M && nv(U, "gesturestart", De), ee && nv(U, "gestureend", Oe), D && nv(i, B_ + "enter", Me), O && nv(i, B_ + "leave", Ne), k && nv(i, B_ + "move", je)), z.isEnabled = !0, z.isDragging = z.isGesturing = z.isPressed = ce = se = !1, z._vx.reset(), z._vy.reset(), me = fe(), he = pe(), e && e.type && Te(e), P && P(z)), z;
		}, z.disable = function() {
			z.isEnabled && (J_.filter(function(e) {
				return e !== z && tv(e.target);
			}).length || rv(ge ? U : i, "scroll", ov), z.isPressed && (z._vx.reset(), z._vy.reset(), rv(j ? i : U, W_[1], we, !0)), rv(ge ? U : i, "scroll", ke, L), rv(i, "wheel", Ae, L), rv(i, W_[0], Te, L), rv(U, W_[2], Ee), rv(U, W_[3], Ee), rv(i, "click", ve, !0), rv(i, "click", Pe), rv(U, "gesturestart", De), rv(U, "gestureend", Oe), rv(i, B_ + "enter", Me), rv(i, B_ + "leave", Ne), rv(i, B_ + "move", je), z.isEnabled = z.isPressed = z.isDragging = !1, F && F(z));
		}, z.kill = z.revert = function() {
			z.disable();
			var e = J_.indexOf(z);
			e >= 0 && J_.splice(e, 1), U_ === z && (U_ = 0);
		}, J_.push(z), j && tv(i) && (U_ = z), z.enable(f);
	}, M_(e, [{
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
vv.version = "3.15.1", vv.create = function(e) {
	return new vv(e);
}, vv.register = _v, vv.getAll = function() {
	return J_.slice();
}, vv.getById = function(e) {
	return J_.filter(function(t) {
		return t.vars.id === e;
	})[0];
}, K_() && N_.registerPlugin(vv);
// node_modules/gsap/ScrollTrigger.js
var $, yv, bv, xv, Sv, Cv, wv, Tv, Ev, Dv, Ov, kv, Av, jv, Mv, Nv, Pv, Fv, Iv, Lv, Rv, zv, Bv, Vv, Hv, Uv, Wv, Gv, Kv, qv, Jv, Yv, Xv, Zv, Qv = 1, $v = Date.now, ey = $v(), ty = 0, ny = 0, ry = function(e, t, n) {
	var r = yy(e) && (e.substr(0, 6) === "clamp(" || e.indexOf("max") > -1);
	return n["_" + t + "Clamp"] = r, r ? e.substr(6, e.length - 7) : e;
}, iy = function(e, t) {
	return t && (!yy(e) || e.substr(0, 6) !== "clamp(") ? "clamp(" + e + ")" : e;
}, ay = function e() {
	return ny && requestAnimationFrame(e);
}, oy = function() {
	return jv = 1;
}, sy = function() {
	return jv = 0;
}, cy = function(e) {
	return e;
}, ly = function(e) {
	return Math.round(e * 1e5) / 1e5 || 0;
}, uy = function() {
	return typeof window < "u";
}, dy = function() {
	return $ || uy() && ($ = window.gsap) && $.registerPlugin && $;
}, fy = function(e) {
	return !!~wv.indexOf(e);
}, py = function(e) {
	return (e === "Height" ? Jv : bv["inner" + e]) || Sv["client" + e] || Cv["client" + e];
}, my = function(e) {
	return ev(e, "getBoundingClientRect") || (fy(e) ? function() {
		return Vb.width = bv.innerWidth, Vb.height = Jv, Vb;
	} : function() {
		return Wy(e);
	});
}, hy = function(e, t, n) {
	var r = n.d, i = n.d2, a = n.a;
	return (a = ev(e, "getBoundingClientRect")) ? function() {
		return a()[r];
	} : function() {
		return (t ? py(i) : e["client" + i]) || 0;
	};
}, gy = function(e, t) {
	return !t || ~X_.indexOf(e) ? my(e) : function() {
		return Vb;
	};
}, _y = function(e, t) {
	var n = t.s, r = t.d2, i = t.d, a = t.a;
	return Math.max(0, (n = "scroll" + r) && (a = ev(e, n)) ? a() - my(e)()[i] : fy(e) ? (Sv[n] || Cv[n]) - py(r) : e[n] - e["offset" + r]);
}, vy = function(e, t) {
	for (var n = 0; n < Iv.length; n += 3) (!t || ~t.indexOf(Iv[n + 1])) && e(Iv[n], Iv[n + 1], Iv[n + 2]);
}, yy = function(e) {
	return typeof e == "string";
}, by = function(e) {
	return typeof e == "function";
}, xy = function(e) {
	return typeof e == "number";
}, Sy = function(e) {
	return typeof e == "object";
}, Cy = function(e, t, n) {
	return e && e.progress(+!t) && n && e.pause();
}, wy = function(e, t, n) {
	if (e.enabled) {
		var r = e._ctx ? e._ctx.add(function() {
			return t(e, n);
		}) : t(e, n);
		r && r.totalTime && (e.callbackAnimation = r);
	}
}, Ty = Math.abs, Ey = "left", Dy = "top", Oy = "right", ky = "bottom", Ay = "width", jy = "height", My = "Right", Ny = "Left", Py = "Top", Fy = "Bottom", Iy = "padding", Ly = "margin", Ry = "Width", zy = "Height", By = "px", Vy = function(e) {
	return bv.getComputedStyle(e.nodeType === Node.DOCUMENT_NODE ? e.scrollingElement : e);
}, Hy = function(e) {
	var t = Vy(e).position;
	e.style.position = t === "absolute" || t === "fixed" ? t : "relative";
}, Uy = function(e, t) {
	for (var n in t) n in e || (e[n] = t[n]);
	return e;
}, Wy = function(e, t) {
	var n = t && Vy(e)[Mv] !== "matrix(1, 0, 0, 1, 0, 0)" && $.to(e, {
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
}, Gy = function(e, t) {
	var n = t.d2;
	return e["offset" + n] || e["client" + n] || 0;
}, Ky = function(e) {
	var t = [], n = e.labels, r = e.duration(), i;
	for (i in n) t.push(n[i] / r);
	return t;
}, qy = function(e) {
	return function(t) {
		return $.utils.snap(Ky(e), t);
	};
}, Jy = function(e) {
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
}, Yy = function(e) {
	return function(t, n) {
		return Jy(Ky(e))(t, n.direction);
	};
}, Xy = function(e, t, n, r) {
	return n.split(",").forEach(function(n) {
		return e(t, n, r);
	});
}, Zy = function(e, t, n, r, i) {
	return e.addEventListener(t, n, {
		passive: !r,
		capture: !!i
	});
}, Qy = function(e, t, n, r) {
	return e.removeEventListener(t, n, !!r);
}, $y = function(e, t, n) {
	n &&= n.wheelHandler, n && (e(t, "wheel", n), e(t, "touchmove", n));
}, eb = {
	startColor: "green",
	endColor: "red",
	indent: 0,
	fontSize: "16px",
	fontWeight: "normal"
}, tb = {
	toggleActions: "play",
	anticipatePin: 0
}, nb = {
	top: 0,
	left: 0,
	center: .5,
	bottom: 1,
	right: 1
}, rb = function(e, t) {
	if (yy(e)) {
		var n = e.indexOf("="), r = ~n ? +(e.charAt(n - 1) + 1) * parseFloat(e.substr(n + 1)) : 0;
		~n && (e.indexOf("%") > n && (r *= t / 100), e = e.substr(0, n - 1)), e = r + (e in nb ? nb[e] * t : ~e.indexOf("%") ? parseFloat(e) * t / 100 : parseFloat(e) || 0);
	}
	return e;
}, ib = function(e, t, n, r, i, a, o, s) {
	var c = i.startColor, l = i.endColor, u = i.fontSize, d = i.indent, f = i.fontWeight, p = xv.createElement("div"), m = fy(n) || ev(n, "pinType") === "fixed", h = e.indexOf("scroller") !== -1, g = m ? Cv : n.tagName === "IFRAME" ? n.contentDocument.body : n, _ = e.indexOf("start") !== -1, v = _ ? c : l, y = "border-color:" + v + ";font-size:" + u + ";color:" + v + ";font-weight:" + f + ";pointer-events:none;white-space:nowrap;font-family:sans-serif,Arial;z-index:1000;padding:4px 8px;border-width:0;border-style:solid;";
	return y += "position:" + ((h || s) && m ? "fixed;" : "absolute;"), (h || s || !m) && (y += (r === lv ? Oy : ky) + ":" + (a + parseFloat(d)) + "px;"), o && (y += "box-sizing:border-box;text-align:left;width:" + o.offsetWidth + "px;"), p._isStart = _, p.setAttribute("class", "gsap-marker-" + e + (t ? " marker-" + t : "")), p.style.cssText = y, p.innerText = t || t === 0 ? e + "-" + t : e, g.children[0] ? g.insertBefore(p, g.children[0]) : g.appendChild(p), p._offset = p["offset" + r.op.d2], ab(p, 0, r, _), p;
}, ab = function(e, t, n, r) {
	var i = { display: "block" }, a = n[r ? "os2" : "p2"], o = n[r ? "p2" : "os2"];
	e._isFlipped = r, i[n.a + "Percent"] = r ? -100 : 0, i[n.a] = r ? "1px" : 0, i["border" + a + Ry] = 1, i["border" + o + Ry] = 0, i[n.p] = t + "px", $.set(e, i);
}, ob = [], sb = {}, cb, lb = function() {
	return $v() - ty > 34 && (cb ||= requestAnimationFrame(Mb));
}, ub = function() {
	(!Bv || !Bv.isPressed || Bv.startX > Cv.clientWidth) && (Y_.cache++, Bv ? cb ||= requestAnimationFrame(Mb) : Mb(), ty || gb("scrollStart"), ty = $v());
}, db = function() {
	Uv = bv.innerWidth, Hv = bv.innerHeight;
}, fb = function(e) {
	Y_.cache++, (e === !0 || !Av && !zv && !xv.fullscreenElement && !xv.webkitFullscreenElement && (!Vv || Uv !== bv.innerWidth || Math.abs(bv.innerHeight - Hv) > bv.innerHeight * .25)) && Tv.restart(!0);
}, pb = {}, mb = [], hb = function e() {
	return Qy(Jb, "scrollEnd", e) || Ob(!0);
}, gb = function(e) {
	return pb[e] && pb[e].map(function(e) {
		return e();
	}) || mb;
}, _b = [], vb = function(e) {
	for (var t = 0; t < _b.length; t += 5) (!e || _b[t + 4] && _b[t + 4].query === e) && (_b[t].style.cssText = _b[t + 1], _b[t].getBBox && _b[t].setAttribute("transform", _b[t + 2] || ""), _b[t + 3].uncache = 1);
}, yb = function() {
	Y_.cache++, Y_.forEach(function(e) {
		return by(e) && (e.rec = e());
	});
}, bb = function(e, t) {
	var n;
	for (Nv = 0; Nv < ob.length; Nv++) n = ob[Nv], n && (!t || n._ctx === t) && (e ? n.kill(1) : n.revert(!0, !0));
	Yv = !0, t && vb(t), t || gb("revert");
}, xb = function(e, t) {
	Y_.cache++, (t || !Sb) && Y_.forEach(function(e) {
		return by(e) && e.cacheID++ && (e.rec = 0);
	}), yy(e) && (Kv = e, bv.history.scrollRestoration !== e && (bv.history.scrollRestoration = e));
}, Sb, Cb = 0, wb, Tb = function() {
	if (wb !== Cb) {
		var e = wb = Cb;
		requestAnimationFrame(function() {
			return e === Cb && Ob(!0);
		});
	}
}, Eb = function() {
	Cv.appendChild(qv), Jv = !Bv && qv.offsetHeight || bv.innerHeight, Cv.removeChild(qv);
}, Db = function(e) {
	return Ev(".gsap-marker-start, .gsap-marker-end, .gsap-marker-scroller-start, .gsap-marker-scroller-end").forEach(function(t) {
		return t.style.display = e ? "none" : "block";
	});
}, Ob = function(e, t) {
	if (Sv = xv.documentElement, Cv = xv.body, wv = [
		bv,
		xv,
		Sv,
		Cv
	], ty && !e && !Yv) Zy(Jb, "scrollEnd", hb);
	else {
		Eb(), Sb = Jb.isRefreshing = !0, Yv || yb();
		var n = gb("refreshInit");
		Lv && Jb.sort(), t || bb(), Y_.forEach(function(e) {
			by(e) && (e.smooth && (e.target.style.scrollBehavior = "auto"), e(0));
		}), ob.slice(0).forEach(function(e) {
			return e.refresh();
		}), Yv = !1, ob.forEach(function(e) {
			if (e._subPinOffset && e.pin) {
				var t = e.vars.horizontal ? "offsetWidth" : "offsetHeight", n = e.pin[t];
				e.revert(!0, 1), e.adjustPinSpacing(e.pin[t] - n), e.refresh();
			}
		}), Xv = 1, Db(!0), ob.forEach(function(e) {
			var t = _y(e.scroller, e._dir), n = e.vars.end === "max" || e._endClamp && e.end > t, r = e._startClamp && e.start >= t;
			(n || r) && e.setPositions(r ? t - 1 : e.start, n ? Math.max(r ? t : e.start + 1, t) : e.end, !0);
		}), Db(!1), Xv = 0, n.forEach(function(e) {
			return e && e.render && e.render(-1);
		}), Y_.forEach(function(e) {
			by(e) && (e.smooth && requestAnimationFrame(function() {
				return e.target.style.scrollBehavior = "smooth";
			}), e.rec && e(e.rec));
		}), xb(Kv, 1), Tv.pause(), Cb++, Sb = 2, Mb(2), ob.forEach(function(e) {
			return by(e.vars.onRefresh) && e.vars.onRefresh(e);
		}), Sb = Jb.isRefreshing = !1, gb("refresh");
	}
}, kb = 0, Ab = 1, jb, Mb = function(e) {
	if (e === 2 || !Sb && !Yv) {
		Jb.isUpdating = !0, jb && jb.update(0);
		var t = ob.length, n = $v(), r = n - ey >= 50, i = t && ob[0].scroll();
		if (Ab = kb > i ? -1 : 1, Sb || (kb = i), r && (ty && !jv && n - ty > 200 && (ty = 0, gb("scrollEnd")), Ov = ey, ey = n), Ab < 0) {
			for (Nv = t; Nv-- > 0;) ob[Nv] && ob[Nv].update(0, r);
			Ab = 1;
		} else for (Nv = 0; Nv < t; Nv++) ob[Nv] && ob[Nv].update(0, r);
		Jb.isUpdating = !1;
	}
	cb = 0;
}, Nb = [
	Ey,
	Dy,
	ky,
	Oy,
	Ly + Fy,
	Ly + My,
	Ly + Py,
	Ly + Ny,
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
], Pb = Nb.concat([
	Ay,
	jy,
	"boxSizing",
	"max" + Ry,
	"max" + zy,
	"position",
	Ly,
	Iy,
	Iy + Py,
	Iy + My,
	Iy + Fy,
	Iy + Ny
]), Fb = function(e, t, n) {
	Rb(n);
	var r = e._gsap;
	if (r.spacerIsNative) Rb(r.spacerState);
	else if (e._gsap.swappedIn) {
		var i = t.parentNode;
		i && (i.insertBefore(e, t), i.removeChild(t));
	}
	e._gsap.swappedIn = !1;
}, Ib = function(e, t, n, r) {
	if (!e._gsap.swappedIn) {
		for (var i = Nb.length, a = t.style, o = e.style, s; i--;) s = Nb[i], a[s] = n[s];
		a.position = n.position === "absolute" ? "absolute" : "relative", n.display === "inline" && (a.display = "inline-block"), o[ky] = o[Oy] = "auto", a.flexBasis = n.flexBasis || "auto", a.overflow = "visible", a.boxSizing = "border-box", a[Ay] = Gy(e, cv) + By, a[jy] = Gy(e, lv) + By, a[Iy] = o[Ly] = o[Dy] = o[Ey] = "0", Rb(r), o[Ay] = o["max" + Ry] = n[Ay], o[jy] = o["max" + zy] = n[jy], o[Iy] = n[Iy], e.parentNode !== t && (e.parentNode.insertBefore(t, e), t.appendChild(e)), e._gsap.swappedIn = !0;
	}
}, Lb = /([A-Z])/g, Rb = function(e) {
	if (e) {
		var t = e.t.style, n = e.length, r = 0, i, a;
		for ((e.t._gsap || $.core.getCache(e.t)).uncache = 1; r < n; r += 2) a = e[r + 1], i = e[r], a ? t[i] = a : t[i] && t.removeProperty(i.replace(Lb, "-$1").toLowerCase());
	}
}, zb = function(e) {
	for (var t = Pb.length, n = e.style, r = [], i = 0; i < t; i++) r.push(Pb[i], n[Pb[i]]);
	return r.t = e, r;
}, Bb = function(e, t, n) {
	for (var r = [], i = e.length, a = n ? 8 : 0, o; a < i; a += 2) o = e[a], r.push(o, o in t ? t[o] : e[a + 1]);
	return r.t = e.t, r;
}, Vb = {
	left: 0,
	top: 0
}, Hb = function(e, t, n, r, i, a, o, s, c, l, u, d, f, p) {
	by(e) && (e = e(s)), yy(e) && e.substr(0, 3) === "max" && (e = d + (e.charAt(4) === "=" ? rb("0" + e.substr(3), n) : 0));
	var m = f ? f.time() : 0, h, g, _;
	if (f && f.seek(0), isNaN(e) || (e = +e), xy(e)) f && (e = $.utils.mapRange(f.scrollTrigger.start, f.scrollTrigger.end, 0, d, e)), o && ab(o, n, r, !0);
	else {
		by(t) && (t = t(s));
		var v = (e || "0").split(" "), y, b, x, S;
		_ = uv(t, s) || Cv, y = Wy(_) || {}, y && (y.left || y.top) || Vy(_).display !== "none" || (S = _.style.display, _.style.display = "block", y = Wy(_), S ? _.style.display = S : _.style.removeProperty("display")), b = rb(v[0], y[r.d]), x = rb(v[1] || "0", n), e = y[r.p] - c[r.p] - l + b + i - x, o && ab(o, x, r, n - x < 20 || o._isStart && x > 20), n -= n - x;
	}
	if (p && (s[p] = e || -.001, e < 0 && (e = 0)), a) {
		var C = e + n, w = a._isStart;
		h = "scroll" + r.d2, ab(a, C, r, w && C > 20 || !w && (u ? Math.max(Cv[h], Sv[h]) : a.parentNode[h]) <= C + 1), u && (c = Wy(o), u && (a.style[r.op.p] = c[r.op.p] - r.op.m - a._offset + By));
	}
	return f && _ && (h = Wy(_), f.seek(d), g = Wy(_), f._caScrollDist = h[r.p] - g[r.p], e = e / f._caScrollDist * d), f && f.seek(m), f ? e : Math.round(e);
}, Ub = /(webkit|moz|length|cssText|inset)/i, Wb = function(e, t, n, r) {
	if (e.parentNode !== t) {
		var i = e.style, a, o;
		if (t === Cv) {
			for (a in e._stOrig = i.cssText, o = Vy(e), o) !+a && !Ub.test(a) && o[a] && typeof i[a] == "string" && a !== "0" && (i[a] = o[a]);
			i.top = n, i.left = r;
		} else i.cssText = e._stOrig;
		$.core.getCache(e).uncache = 1, t.appendChild(e);
	}
}, Gb = function(e, t, n) {
	var r = t, i = r;
	return function(t) {
		var a = Math.round(e());
		return a !== r && a !== i && Math.abs(a - r) > 3 && Math.abs(a - i) > 3 && (t = a, n && n()), i = r, r = Math.round(t), r;
	};
}, Kb = function(e, t, n) {
	var r = {};
	r[t.p] = "+=" + n, $.set(e, r);
}, qb = function(e, t) {
	var n = fv(e, t), r = "_scroll" + t.p2, i = function t(i, a, o, s, c) {
		var l = t.tween, u = a.onComplete, d = {};
		o ||= n();
		var f = Gb(n, o, function() {
			l.kill(), t.tween = 0;
		});
		return c = s && c || 0, s ||= i - o, l && l.kill(), a[r] = i, a.inherit = !1, a.modifiers = d, d[r] = function() {
			return f(o + s * l.ratio + c * l.ratio * l.ratio);
		}, a.onUpdate = function() {
			Y_.cache++, t.tween && Mb();
		}, a.onComplete = function() {
			t.tween = 0, u && u.call(l);
		}, l = t.tween = $.to(e, a), l;
	};
	return e[r] = n, n.wheelHandler = function() {
		return i.tween && i.tween.kill() && (i.tween = 0);
	}, Zy(e, "wheel", n.wheelHandler), Jb.isTouch && Zy(e, "touchmove", n.wheelHandler), i;
}, Jb = /*#__PURE__*/ function() {
	function e(t, n) {
		yv || e.register($) || console.warn("Please gsap.registerPlugin(ScrollTrigger)"), Gv(this), this.init(t, n);
	}
	var t = e.prototype;
	return t.init = function(t, n) {
		if (this.progress = this.start = 0, this.vars && this.kill(!0, !0), !ny) this.update = this.refresh = this.kill = cy;
		else {
			t = Uy(yy(t) || xy(t) || t.nodeType ? { trigger: t } : t, tb);
			var r = t, i = r.onUpdate, a = r.toggleClass, o = r.id, s = r.onToggle, c = r.onRefresh, l = r.scrub, u = r.trigger, d = r.pin, f = r.pinSpacing, p = r.invalidateOnRefresh, m = r.anticipatePin, h = r.onScrubComplete, g = r.onSnapComplete, _ = r.once, v = r.snap, y = r.pinReparent, b = r.pinSpacer, x = r.containerAnimation, S = r.fastScrollEnd, C = r.preventOverlaps, w = t.horizontal || t.containerAnimation && t.horizontal !== !1 ? cv : lv, T = !l && l !== 0, E = uv(t.scroller || bv), D = $.core.getCache(E), O = fy(E), k = ("pinType" in t ? t.pinType : ev(E, "pinType") || O && "fixed") === "fixed", A = [
				t.onEnter,
				t.onLeave,
				t.onEnterBack,
				t.onLeaveBack
			], j = T && t.toggleActions.split(" "), M = "markers" in t ? t.markers : tb.markers, ee = O ? 0 : parseFloat(Vy(E)["border" + w.p2 + Ry]) || 0, N = this, P = t.onRefreshInit && function() {
				return t.onRefreshInit(N);
			}, F = hy(E, O, w), I = gy(E, O), te = 0, L = 0, ne = 0, re = fv(E, w), ie, ae, oe, se, ce, R, le, ue, z, B, V, de, fe, pe, me, he, H, ge, U, W, G, _e, ve, ye, be, xe, Se, Ce, we, Te, Ee, De, Oe, ke, Ae, je, Me, Ne, Pe;
			if (N._startClamp = N._endClamp = !1, N._dir = w, m *= 45, N.scroller = E, N.scroll = x ? x.time.bind(x) : re, se = re(), Yv && re.rec == null && (re.rec = se), N.vars = t, n ||= t.animation, "refreshPriority" in t && (Lv = 1, t.refreshPriority === -9999 && (jb = N)), D.tweenScroll = D.tweenScroll || {
				top: qb(E, lv),
				left: qb(E, cv)
			}, N.tweenTo = ie = D.tweenScroll[w.p], N.scrubDuration = function(e) {
				Oe = xy(e) && e, Oe ? De ? De.duration(e) : De = $.to(n, {
					ease: "expo",
					totalProgress: "+=0",
					inherit: !1,
					duration: Oe,
					paused: !0,
					onComplete: function() {
						return h && h(N);
					}
				}) : (De && De.progress(1).kill(), De = 0);
			}, n && (n.vars.lazy = !1, n._initted && !N.isReverted || n.vars.immediateRender !== !1 && t.immediateRender !== !1 && n.duration() && n.render(0, !0, !0), N.animation = n.pause(), n.scrollTrigger = N, N.scrubDuration(l), Te = 0, o ||= n.vars.id), v && ((!Sy(v) || v.push) && (v = { snapTo: v }), "scrollBehavior" in Cv.style && $.set(O ? [Cv, Sv] : E, { scrollBehavior: "auto" }), Y_.forEach(function(e) {
				return by(e) && e.target === (O ? xv.scrollingElement || Sv : E) && (e.smooth = !1);
			}), oe = by(v.snapTo) ? v.snapTo : v.snapTo === "labels" ? qy(n) : v.snapTo === "labelsDirectional" ? Yy(n) : v.directional === !1 ? $.utils.snap(v.snapTo) : function(e, t) {
				return Jy(v.snapTo)(e, $v() - L < 500 ? 0 : t.direction);
			}, ke = v.duration || {
				min: .1,
				max: 2
			}, ke = Sy(ke) ? Dv(ke.min, ke.max) : Dv(ke, ke), Ae = $.delayedCall(v.delay || Oe / 2 || .1, function() {
				var e = re(), t = $v() - L < 500, r = ie.tween;
				if ((t || Math.abs(N.getVelocity()) < 10) && !r && !jv && te !== e) {
					var i = (e - R) / pe, a = n && !T ? n.totalProgress() : i, o = t ? 0 : (a - Ee) / ($v() - Ov) * 1e3 || 0, s = $.utils.clamp(-i, 1 - i, Ty(o / 2) * o / .185), c = i + (v.inertia === !1 ? 0 : s), l, u, d = v, f = d.onStart, p = d.onInterrupt, m = d.onComplete;
					if (l = oe(c, N), xy(l) || (l = c), u = Math.max(0, Math.round(R + l * pe)), e <= le && e >= R && u !== e) {
						if (r && !r._initted && r.data <= Ty(u - e)) return;
						v.inertia === !1 && (s = l - i), ie(u, {
							duration: ke(Ty(Math.max(Ty(c - a), Ty(l - a)) * .185 / o / .05 || 0)),
							ease: v.ease || "power3",
							data: Ty(u - e),
							onInterrupt: function() {
								return Ae.restart(!0) && p && wy(N, p);
							},
							onComplete: function() {
								N.update(), te = re(), n && !T && (De ? De.resetTo("totalProgress", l, n._tTime / n._tDur) : n.progress(l)), Te = Ee = n && !T ? n.totalProgress() : N.progress, g && g(N), m && wy(N, m);
							}
						}, e, s * pe, u - e - s * pe), f && wy(N, f, ie.tween);
					}
				} else N.isActive && te !== e && Ae.restart(!0);
			}).pause()), o && (sb[o] = N), u = N.trigger = uv(u || d !== !0 && d), Pe = u && u._gsap && u._gsap.stRevert, Pe &&= Pe(N), d = d === !0 ? u : uv(d), yy(a) && (a = {
				targets: u,
				className: a
			}), d && (f === !1 || f === Ly || (f = !f && d.parentNode && d.parentNode.style && Vy(d.parentNode).display === "flex" ? !1 : Iy), N.pin = d, ae = $.core.getCache(d), ae.spacer ? me = ae.pinState : (b && (b = uv(b), b && !b.nodeType && (b = b.current || b.nativeElement), ae.spacerIsNative = !!b, b && (ae.spacerState = zb(b))), ae.spacer = ge = b || xv.createElement("div"), ge.classList.add("pin-spacer"), o && ge.classList.add("pin-spacer-" + o), ae.pinState = me = zb(d)), t.force3D !== !1 && $.set(d, { force3D: !0 }), N.spacer = ge = ae.spacer, we = Vy(d), ye = we[f + w.os2], W = $.getProperty(d), G = $.quickSetter(d, w.a, By), Ib(d, ge, we), H = zb(d)), M) {
				de = Sy(M) ? Uy(M, eb) : eb, B = ib("scroller-start", o, E, w, de, 0), V = ib("scroller-end", o, E, w, de, 0, B), U = B["offset" + w.op.d2];
				var Fe = uv(ev(E, "content") || E);
				ue = this.markerStart = ib("start", o, Fe, w, de, U, 0, x), z = this.markerEnd = ib("end", o, Fe, w, de, U, 0, x), x && (Ne = $.quickSetter([ue, z], w.a, By)), !k && !(X_.length && ev(E, "fixedMarkers") === !0) && (Hy(O ? Cv : E), $.set([B, V], { force3D: !0 }), xe = $.quickSetter(B, w.a, By), Ce = $.quickSetter(V, w.a, By));
			}
			if (x) {
				var Ie = x.vars.onUpdate, Le = x.vars.onUpdateParams;
				x.eventCallback("onUpdate", function() {
					N.update(0, 0, 1), Ie && Ie.apply(x, Le || []);
				});
			}
			if (N.previous = function() {
				return ob[ob.indexOf(N) - 1];
			}, N.next = function() {
				return ob[ob.indexOf(N) + 1];
			}, N.revert = function(e, t) {
				if (!t) return N.kill(!0);
				var r = e !== !1 || !N.enabled, i = Av;
				r !== N.isReverted && (r && (je = Math.max(re(), N.scroll.rec || 0), ne = N.progress, Me = n && n.progress()), ue && [
					ue,
					z,
					B,
					V
				].forEach(function(e) {
					return e.style.display = r ? "none" : "block";
				}), r && (Av = N, N.update(r)), !d || y && N.isActive || (r ? Fb(d, ge, me) : Ib(d, ge, Vy(d), be)), r || N.update(r), Av = i, N.isReverted = r);
			}, N.refresh = function(r, i, a, o) {
				if (!Av && N.enabled || i) {
					if (d && r && ty) Zy(e, "scrollEnd", hb);
					else {
						!Sb && P && P(N), Av = N, ie.tween && !a && (ie.tween.kill(), ie.tween = 0), De && De.pause(), p && n && (n.revert({ kill: !1 }).invalidate(), n.getChildren ? n.getChildren(!0, !0, !1).forEach(function(e) {
							return e.vars.immediateRender && e.render(0, !0, !0);
						}) : n.vars.immediateRender && n.render(0, !0, !0)), N.isReverted || N.revert(!0, !0), N._subPinOffset = !1;
						var s = F(), l = I(), m = x ? x.duration() : _y(E, w), h = pe <= .01 || !pe, g = 0, _ = o || 0, v = Sy(a) ? a.end : t.end, b = t.endTrigger || u, S = Sy(a) ? a.start : t.start || (t.start === 0 || !u ? 0 : d ? "0 0" : "0 100%"), C = N.pinnedContainer = t.pinnedContainer && uv(t.pinnedContainer, N), D = u && Math.max(0, ob.indexOf(N)) || 0, A = D, j, ae, oe, de, U, G, ye, xe, Ce, we, Te, Ee, Oe;
						for (M && Sy(a) && (Ee = $.getProperty(B, w.p), Oe = $.getProperty(V, w.p)); A-- > 0;) G = ob[A], G.end || G.refresh(0, 1) || (Av = N), ye = G.pin, ye && (ye === u || ye === d || ye === C) && !G.isReverted && (we ||= [], we.unshift(G), G.revert(!0, !0)), G !== ob[A] && (D--, A--);
						for (by(S) && (S = S(N)), S = ry(S, "start", N), R = Hb(S, u, s, w, re(), ue, B, N, l, ee, k, m, x, N._startClamp && "_startClamp") || (d ? -.001 : 0), by(v) && (v = v(N)), yy(v) && !v.indexOf("+=") && (~v.indexOf(" ") ? v = (yy(S) ? S.split(" ")[0] : "") + v : (g = rb(v.substr(2), s), v = yy(S) ? S : (x ? $.utils.mapRange(0, x.duration(), x.scrollTrigger.start, x.scrollTrigger.end, R) : R) + g, b = u)), v = ry(v, "end", N), le = Math.max(R, Hb(v || (b ? "100% 0" : m), b, s, w, re() + g, z, V, N, l, ee, k, m, x, N._endClamp && "_endClamp")) || -.001, g = 0, A = D; A--;) G = ob[A] || {}, ye = G.pin, ye && G.start - G._pinPush <= R && !x && G.end > 0 && (j = G.end - (N._startClamp ? Math.max(0, G.start) : G.start), (ye === u && G.start - G._pinPush < R || ye === C) && isNaN(S) && (g += j * (1 - G.progress)), ye === d && (_ += j));
						if (R += g, le += g, N._startClamp && (N._startClamp += g), N._endClamp && !Sb && (N._endClamp = le || -.001, le = Math.min(le, _y(E, w))), pe = le - R || (R -= .01) && .001, h && (ne = $.utils.clamp(0, 1, $.utils.normalize(R, le, je))), N._pinPush = _, ue && g && (j = {}, j[w.a] = "+=" + g, C && (j[w.p] = "-=" + re()), $.set([ue, z], j)), d && !(Xv && N.end >= _y(E, w))) j = Vy(d), de = w === lv, oe = re(), _e = parseFloat(W(w.a)) + _, !m && le > 1 && (Te = (O ? xv.scrollingElement || Sv : E).style, Te = {
							style: Te,
							value: Te["overflow" + w.a.toUpperCase()]
						}, O && Vy(Cv)["overflow" + w.a.toUpperCase()] !== "scroll" && (Te.style["overflow" + w.a.toUpperCase()] = "scroll")), Ib(d, ge, j), H = zb(d), ae = Wy(d, !0), xe = k && fv(E, de ? cv : lv)(), f ? (be = [f + w.os2, pe + _ + By], be.t = ge, A = f === Iy ? Gy(d, w) + pe + _ : 0, A && (be.push(w.d, A + By), ge.style.flexBasis !== "auto" && (ge.style.flexBasis = A + By)), Rb(be), C && ob.forEach(function(e) {
							e.pin === C && e.vars.pinSpacing !== !1 && (e._subPinOffset = !0);
						}), k && re(je)) : (A = Gy(d, w), A && ge.style.flexBasis !== "auto" && (ge.style.flexBasis = A + By)), k && (U = {
							top: ae.top + (de ? oe - R : xe) + By,
							left: ae.left + (de ? xe : oe - R) + By,
							boxSizing: "border-box",
							position: "fixed"
						}, U[Ay] = U["max" + Ry] = Math.ceil(ae.width) + By, U[jy] = U["max" + zy] = Math.ceil(ae.height) + By, U[Ly] = U[Ly + Py] = U[Ly + My] = U[Ly + Fy] = U[Ly + Ny] = "0", U[Iy] = j[Iy], U[Iy + Py] = j[Iy + Py], U[Iy + My] = j[Iy + My], U[Iy + Fy] = j[Iy + Fy], U[Iy + Ny] = j[Iy + Ny], he = Bb(me, U, y), Sb && re(0)), n ? (Ce = n._initted, Rv(1), n.render(n.duration(), !0, !0), ve = W(w.a) - _e + pe + _, Se = Math.abs(pe - ve) > 1, k && Se && he.splice(he.length - 2, 2), n.render(0, !0, !0), Ce || n.invalidate(!0), n.parent || n.totalTime(n.totalTime()), Rv(0)) : ve = pe, Te && (Te.value ? Te.style["overflow" + w.a.toUpperCase()] = Te.value : Te.style.removeProperty("overflow-" + w.a));
						else if (u && re() && !x) for (ae = u.parentNode; ae && ae !== Cv;) ae._pinOffset && (R -= ae._pinOffset, le -= ae._pinOffset), ae = ae.parentNode;
						we && we.forEach(function(e) {
							return e.revert(!1, !0);
						}), N.start = R, N.end = le, se = ce = Sb ? je : re(), x || Sb || Yv || (se < je && re(je), N.scroll.rec = 0), N.revert(!1, !0), L = $v(), Ae && (te = -1, Ae.restart(!0)), Av = 0, n && T && (n._initted || Me) && n.progress() !== Me && n.progress(Me || 0, !0).render(n.time(), !0, !0), (h || ne !== N.progress || x || p || n && !n._initted) && (n && !T && (n._initted || ne || n.vars.immediateRender !== !1) && n.totalProgress(x && R < -.001 && !ne ? $.utils.normalize(R, le, 0) : ne, !0), N.progress = h || (se - R) / pe === ne ? 0 : ne), d && f && (ge._pinOffset = Math.round(N.progress * ve)), De && De.invalidate(), isNaN(Ee) || (Ee -= $.getProperty(B, w.p), Oe -= $.getProperty(V, w.p), Kb(B, w, Ee), Kb(ue, w, Ee - (o || 0)), Kb(V, w, Oe), Kb(z, w, Oe - (o || 0))), h && !Sb && N.update(), c && !Sb && !fe && (fe = !0, c(N), fe = !1);
					}
				}
			}, N.getVelocity = function() {
				return (re() - ce) / ($v() - Ov) * 1e3 || 0;
			}, N.endAnimation = function() {
				Cy(N.callbackAnimation), n && (De ? De.progress(1) : n.paused() ? T || Cy(n, N.direction < 0, 1) : Cy(n, n.reversed()));
			}, N.labelToScroll = function(e) {
				return n && n.labels && (R || N.refresh() || R) + n.labels[e] / n.duration() * pe || 0;
			}, N.getTrailing = function(e) {
				var t = ob.indexOf(N), n = N.direction > 0 ? ob.slice(0, t).reverse() : ob.slice(t + 1);
				return (yy(e) ? n.filter(function(t) {
					return t.vars.preventOverlaps === e;
				}) : n).filter(function(e) {
					return N.direction > 0 ? e.end <= R : e.start >= le;
				});
			}, N.update = function(e, t, r) {
				if (!x || r || e) {
					var o = Sb === !0 ? je : N.scroll(), c = e ? 0 : (o - R) / pe, u = c < 0 ? 0 : c > 1 ? 1 : c || 0, p = N.progress, h, g, b, D, O, M, ee, P;
					if (t && (ce = se, se = x ? re() : o, v && (Ee = Te, Te = n && !T ? n.totalProgress() : u)), m && d && !Av && !Qv && ty && (!u && R < o + (o - ce) / ($v() - Ov) * m ? u = 1e-4 : u === 1 && le > o + (o - ce) / ($v() - Ov) * m && (u = .9999)), u !== p && N.enabled) {
						if (h = N.isActive = !!u && u < 1, g = !!p && p < 1, M = h !== g, O = M || !!u != !!p, N.direction = u > p ? 1 : -1, N.progress = u, O && !Av && (b = u && !p ? 0 : u === 1 ? 1 : p === 1 ? 2 : 3, T && (D = !M && j[b + 1] !== "none" && j[b + 1] || j[b], P = n && (D === "complete" || D === "reset" || D in n))), C && (M || P) && (P || l || !n) && (by(C) ? C(N) : N.getTrailing(C).forEach(function(e) {
							return e.endAnimation();
						})), T || (De && !Av && !Qv ? (De._dp._time - De._start !== De._time && De.render(De._dp._time - De._start), De.resetTo ? De.resetTo("totalProgress", u, n._tTime / n._tDur) : (De.vars.totalProgress = u, De.invalidate().restart())) : n && n.totalProgress(u, !!(Av && (L || e)))), d) {
							if (e && f && (ge.style[f + w.os2] = ye), !k) G(ly(_e + ve * u));
							else if (O) {
								if (ee = !e && u > p && le + 1 > o && o + 1 >= _y(E, w), y) {
									if (!e && (h || ee)) {
										var F = Wy(d, !0), I = o - R;
										Wb(d, Cv, F.top + (w === lv ? I : 0) + By, F.left + (w === lv ? 0 : I) + By);
									} else Wb(d, ge);
								}
								Rb(h || ee ? he : H), Se && u < 1 && h || G(_e + (u === 1 && !ee ? ve : 0));
							}
						}
						v && !ie.tween && !Av && !Qv && Ae.restart(!0), a && (M || _ && u && (u < 1 || !Zv)) && Ev(a.targets).forEach(function(e) {
							return e.classList[h || _ ? "add" : "remove"](a.className);
						}), i && !T && !e && i(N), O && !Av ? (T && (P && (D === "complete" ? n.pause().totalProgress(1) : D === "reset" ? n.restart(!0).pause() : D === "restart" ? n.restart(!0) : n[D]()), i && i(N)), (M || !Zv) && (s && M && wy(N, s), A[b] && wy(N, A[b]), _ && (u === 1 ? N.kill(!1, 1) : A[b] = 0), M || (b = u === 1 ? 1 : 3, A[b] && wy(N, A[b]))), S && !h && Math.abs(N.getVelocity()) > (xy(S) ? S : 2500) && (Cy(N.callbackAnimation), De ? De.progress(1) : Cy(n, D === "reverse" ? 1 : !u, 1))) : T && i && !Av && i(N);
					}
					if (Ce) {
						var te = x ? o / x.duration() * (x._caScrollDist || 0) : o;
						xe(te + +!!B._isFlipped), Ce(te);
					}
					Ne && Ne(-o / x.duration() * (x._caScrollDist || 0));
				}
			}, N.enable = function(t, n) {
				N.enabled || (N.enabled = !0, Zy(E, "resize", fb), O || Zy(E, "scroll", ub), P && Zy(e, "refreshInit", P), t !== !1 && (N.progress = ne = 0, se = ce = te = re()), n !== !1 && N.refresh());
			}, N.getTween = function(e) {
				return e && ie ? ie.tween : De;
			}, N.setPositions = function(e, t, n, r) {
				if (x) {
					var i = x.scrollTrigger, a = x.duration(), o = i.end - i.start;
					e = i.start + o * e / a, t = i.start + o * t / a;
				}
				N.refresh(!1, !1, {
					start: iy(e, n && !!N._startClamp),
					end: iy(t, n && !!N._endClamp)
				}, r), N.update();
			}, N.adjustPinSpacing = function(e) {
				if (be && e) {
					var t = be.indexOf(w.d) + 1;
					be[t] = parseFloat(be[t]) + e + By, be[1] = parseFloat(be[1]) + e + By, Rb(be);
				}
			}, N.disable = function(t, n) {
				if (t !== !1 && N.revert(!0, !0), N.enabled && (N.enabled = N.isActive = !1, n || De && De.pause(), je = 0, ae && (ae.uncache = 1), P && Qy(e, "refreshInit", P), Ae && (Ae.pause(), ie.tween && ie.tween.kill() && (ie.tween = 0)), !O)) {
					for (var r = ob.length; r--;) if (ob[r].scroller === E && ob[r] !== N) return;
					Qy(E, "resize", fb), O || Qy(E, "scroll", ub);
				}
			}, N.kill = function(e, r) {
				N.disable(e, r), De && !r && De.kill(), o && delete sb[o];
				var i = ob.indexOf(N);
				i >= 0 && ob.splice(i, 1), i === Nv && Ab > 0 && Nv--, i = 0, ob.forEach(function(e) {
					return e.scroller === N.scroller && (i = 1);
				}), i || Sb || Yv || (N.scroll.rec = 0), n && (n.scrollTrigger = null, e && n.revert({ kill: !1 }), r || n.kill()), ue && [
					ue,
					z,
					B,
					V
				].forEach(function(e) {
					return e.parentNode && e.parentNode.removeChild(e);
				}), jb === N && (jb = 0), d && (ae && (ae.uncache = 1), i = 0, ob.forEach(function(e) {
					return e.pin === d && i++;
				}), i || (ae.spacer = 0)), t.onKill && t.onKill(N);
			}, ob.push(N), N.enable(!1, !1), Pe && Pe(N), n && n.add && !pe) {
				var Re = N.update;
				N.update = function() {
					N.update = Re, Y_.cache++, R || le || N.refresh();
				}, $.delayedCall(.01, N.update), pe = .01, R = le = 0;
			} else N.refresh();
			d && Tb();
		}
	}, e.register = function(t) {
		return yv ||= ($ = t || dy(), uy() && window.document && e.enable(), ny), yv;
	}, e.defaults = function(e) {
		if (e) for (var t in e) tb[t] = e[t];
		return tb;
	}, e.disable = function(e, t) {
		ny = 0, ob.forEach(function(n) {
			return n[t ? "kill" : "disable"](e);
		}), Qy(bv, "wheel", ub), Qy(xv, "scroll", ub), clearInterval(kv), Qy(xv, "touchcancel", cy), Qy(Cv, "touchstart", cy), Xy(Qy, xv, "pointerdown,touchstart,mousedown", oy), Xy(Qy, xv, "pointerup,touchend,mouseup", sy), Tv.kill(), vy(Qy);
		for (var n = 0; n < Y_.length; n += 3) $y(Qy, Y_[n], Y_[n + 1]), $y(Qy, Y_[n], Y_[n + 2]);
	}, e.enable = function() {
		if (bv = window, xv = document, Sv = xv.documentElement, Cv = xv.body, $) {
			if (Ev = $.utils.toArray, Dv = $.utils.clamp, Gv = $.core.context || cy, Rv = $.core.suppressOverwrites || cy, Kv = bv.history.scrollRestoration || "auto", kb = bv.pageYOffset || 0, $.core.globals("ScrollTrigger", e), Cv) {
				ny = 1, qv = document.createElement("div"), qv.style.height = "100vh", qv.style.position = "absolute", Eb(), ay(), vv.register($), e.isTouch = vv.isTouch, Wv = vv.isTouch && /(iPad|iPhone|iPod|Mac)/g.test(navigator.userAgent), Vv = vv.isTouch === 1, Zy(bv, "wheel", ub), wv = [
					bv,
					xv,
					Sv,
					Cv
				], $.matchMedia ? (e.matchMedia = function(e) {
					var t = $.matchMedia(), n;
					for (n in e) t.add(n, e[n]);
					return t;
				}, $.addEventListener("matchMediaInit", function() {
					yb(), bb();
				}), $.addEventListener("matchMediaRevert", function() {
					return vb();
				}), $.addEventListener("matchMedia", function() {
					Ob(0, 1), gb("matchMedia");
				}), $.matchMedia().add("(orientation: portrait)", function() {
					return db(), db;
				})) : console.warn("Requires GSAP 3.11.0 or later"), db(), Zy(xv, "scroll", ub);
				var t = Cv.hasAttribute("style"), n = Cv.style, r = n.borderTopStyle, i = $.core.Animation.prototype, a, o;
				for (i.revert || Object.defineProperty(i, "revert", { value: function() {
					return this.time(-.01, !0);
				} }), n.borderTopStyle = "solid", a = Wy(Cv), lv.m = Math.round(a.top + lv.sc()) || 0, cv.m = Math.round(a.left + cv.sc()) || 0, r ? n.borderTopStyle = r : n.removeProperty("border-top-style"), t || (Cv.setAttribute("style", ""), Cv.removeAttribute("style")), kv = setInterval(lb, 250), $.delayedCall(.5, function() {
					return Qv = 0;
				}), Zy(xv, "touchcancel", cy), Zy(Cv, "touchstart", cy), Xy(Zy, xv, "pointerdown,touchstart,mousedown", oy), Xy(Zy, xv, "pointerup,touchend,mouseup", sy), Mv = $.utils.checkPrefix("transform"), Pb.push(Mv), yv = $v(), Tv = $.delayedCall(.2, Ob).pause(), Iv = [
					xv,
					"visibilitychange",
					function() {
						var e = bv.innerWidth, t = bv.innerHeight;
						xv.hidden ? (Pv = e, Fv = t) : (Pv !== e || Fv !== t) && fb();
					},
					xv,
					"DOMContentLoaded",
					Ob,
					bv,
					"load",
					Ob,
					bv,
					"resize",
					fb
				], vy(Zy), ob.forEach(function(e) {
					return e.enable(0, 1);
				}), o = 0; o < Y_.length; o += 3) $y(Qy, Y_[o], Y_[o + 1]), $y(Qy, Y_[o], Y_[o + 2]);
			} else xv && xv.addEventListener("DOMContentLoaded", function t() {
				e.enable(), xv.removeEventListener("DOMContentLoaded", t);
			});
		}
	}, e.config = function(t) {
		"limitCallbacks" in t && (Zv = !!t.limitCallbacks);
		var n = t.syncInterval;
		n && clearInterval(kv) || (kv = n) && setInterval(lb, n), "ignoreMobileResize" in t && (Vv = e.isTouch === 1 && t.ignoreMobileResize), "autoRefreshEvents" in t && (vy(Qy) || vy(Zy, t.autoRefreshEvents || "none"), zv = (t.autoRefreshEvents + "").indexOf("resize") === -1);
	}, e.scrollerProxy = function(e, t) {
		var n = uv(e), r = Y_.indexOf(n), i = fy(n);
		~r && Y_.splice(r, i ? 6 : 2), t && (i ? X_.unshift(bv, t, Cv, t, Sv, t) : X_.unshift(n, t));
	}, e.clearMatchMedia = function(e) {
		ob.forEach(function(t) {
			return t._ctx && t._ctx.query === e && t._ctx.kill(!0, !0);
		});
	}, e.isInViewport = function(e, t, n) {
		var r = (yy(e) ? uv(e) : e).getBoundingClientRect(), i = r[n ? Ay : jy] * t || 0;
		return n ? r.right - i > 0 && r.left + i < bv.innerWidth : r.bottom - i > 0 && r.top + i < bv.innerHeight;
	}, e.positionInViewport = function(e, t, n) {
		yy(e) && (e = uv(e));
		var r = e.getBoundingClientRect(), i = r[n ? Ay : jy], a = t == null ? i / 2 : t in nb ? nb[t] * i : ~t.indexOf("%") ? parseFloat(t) * i / 100 : parseFloat(t) || 0;
		return n ? (r.left + a) / bv.innerWidth : (r.top + a) / bv.innerHeight;
	}, e.killAll = function(e) {
		if (ob.slice(0).forEach(function(e) {
			return e.vars.id !== "ScrollSmoother" && e.kill();
		}), e !== !0) {
			var t = pb.killAll || [];
			pb = {}, t.forEach(function(e) {
				return e();
			});
		}
	}, e;
}();
Jb.version = "3.15.1", Jb.saveStyles = function(e) {
	return e ? Ev(e).forEach(function(e) {
		if (e && e.style) {
			var t = _b.indexOf(e);
			t >= 0 && _b.splice(t, 5), _b.push(e, e.style.cssText, e.getBBox && e.getAttribute("transform"), $.core.getCache(e), Gv());
		}
	}) : _b;
}, Jb.revert = function(e, t) {
	return bb(!e, t);
}, Jb.create = function(e, t) {
	return new Jb(e, t);
}, Jb.refresh = function(e) {
	return e ? fb(!0) : (yv || Jb.register()) && Ob(!0);
}, Jb.update = function(e) {
	return ++Y_.cache && Mb(e === !0 ? 2 : 0);
}, Jb.clearScrollMemory = xb, Jb.maxScroll = function(e, t) {
	return _y(e, t ? cv : lv);
}, Jb.getScrollFunc = function(e, t) {
	return fv(uv(e), t ? cv : lv);
}, Jb.getById = function(e) {
	return sb[e];
}, Jb.getAll = function() {
	return ob.filter(function(e) {
		return e.vars.id !== "ScrollSmoother";
	});
}, Jb.isScrolling = function() {
	return !!ty;
}, Jb.snapDirectional = Jy, Jb.addEventListener = function(e, t) {
	var n = pb[e] || (pb[e] = []);
	~n.indexOf(t) || n.push(t);
}, Jb.removeEventListener = function(e, t) {
	var n = pb[e], r = n && n.indexOf(t);
	r >= 0 && n.splice(r, 1);
}, Jb.batch = function(e, t) {
	var n = [], r = {}, i = t.interval || .016, a = t.batchMax || 1e9, o = function(e, t) {
		var n = [], r = [], o = $.delayedCall(i, function() {
			t(n, r), n = [], r = [];
		}).pause();
		return function(e) {
			n.length || o.restart(!0), n.push(e.trigger), r.push(e), a <= n.length && o.progress(1);
		};
	}, s;
	for (s in t) r[s] = s.substr(0, 2) === "on" && by(t[s]) && s !== "onRefreshInit" ? o(s, t[s]) : t[s];
	return by(a) && (a = a(), Zy(Jb, "refresh", function() {
		return a = t.batchMax();
	})), Ev(e).forEach(function(e) {
		var t = {};
		for (s in r) t[s] = r[s];
		t.trigger = e, n.push(Jb.create(t));
	}), n;
};
var Yb = function(e, t, n, r) {
	return t > r ? e(r) : t < 0 && e(0), n > r ? (r - t) / (n - t) : n < 0 ? t / (t - n) : 1;
}, Xb = function e(t, n) {
	n === !0 ? t.style.removeProperty("touch-action") : t.style.touchAction = n === !0 ? "auto" : n ? "pan-" + n + (vv.isTouch ? " pinch-zoom" : "") : "none", t === Sv && e(Cv, n);
}, Zb = {
	auto: 1,
	scroll: 1
}, Qb = function(e) {
	var t = e.event, n = e.target, r = e.axis, i = (t.changedTouches ? t.changedTouches[0] : t).target, a = i._gsap || $.core.getCache(i), o = $v(), s;
	if (!a._isScrollT || o - a._isScrollT > 2e3) {
		for (; i && i !== Cv && (i.scrollHeight <= i.clientHeight && i.scrollWidth <= i.clientWidth || !(Zb[(s = Vy(i)).overflowY] || Zb[s.overflowX]));) i = i.parentNode;
		a._isScroll = i && i !== n && !fy(i) && (Zb[(s = Vy(i)).overflowY] || Zb[s.overflowX]), a._isScrollT = o;
	}
	(a._isScroll || r === "x") && (t.stopPropagation(), t._gsapAllow = !0);
}, $b = function(e, t, n, r) {
	return vv.create({
		target: e,
		capture: !0,
		debounce: !1,
		lockAxis: !0,
		type: t,
		onWheel: r &&= Qb,
		onPress: r,
		onDrag: r,
		onScroll: r,
		onEnable: function() {
			return n && Zy(xv, vv.eventTypes[0], nx, !1, !0);
		},
		onDisable: function() {
			return Qy(xv, vv.eventTypes[0], nx, !0);
		}
	});
}, ex = /(input|label|select|textarea)/i, tx, nx = function(e) {
	var t = ex.test(e.target.tagName);
	(t || tx) && (e._gsapAllow = !0, tx = t);
}, rx = function(e) {
	Sy(e) || (e = {}), e.preventDefault = e.isNormalizer = e.allowClicks = !0, e.type || (e.type = "wheel,touch"), e.debounce = !!e.debounce, e.id = e.id || "normalizer";
	var t = e, n = t.normalizeScrollX, r = t.momentum, i = t.allowNestedScroll, a = t.onRelease, o, s, c = uv(e.target) || Sv, l = $.core.globals().ScrollSmoother, u = l && l.get(), d = Wv && (e.content && uv(e.content) || u && e.content !== !1 && !u.smooth() && u.content()), f = fv(c, lv), p = fv(c, cv), m = 1, h = (vv.isTouch && bv.visualViewport ? bv.visualViewport.scale * bv.visualViewport.width : bv.outerWidth) / bv.innerWidth, g = 0, _ = by(r) ? function() {
		return r(o);
	} : function() {
		return r || 2.8;
	}, v, y, b = $b(c, e.type, !0, i), x = function() {
		return y = !1;
	}, S = cy, C = cy, w = function() {
		s = _y(c, lv), C = Dv(+!!Wv, s), n && (S = Dv(0, _y(c, cv))), v = Cb;
	}, T = function() {
		d._gsap.y = ly(parseFloat(d._gsap.y) + f.offset) + "px", d.style.transform = "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, " + parseFloat(d._gsap.y) + ", 0, 1)", f.offset = f.cacheID = 0;
	}, E = function() {
		if (y) {
			requestAnimationFrame(x);
			var e = ly(o.deltaY / 2), t = C(f.v - e);
			if (d && t !== f.v + f.offset) {
				f.offset = t - f.v;
				var n = ly((parseFloat(d && d._gsap.y) || 0) - f.offset);
				d.style.transform = "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, " + n + ", 0, 1)", d._gsap.y = n + "px", f.cacheID = Y_.cache, Mb();
			}
			return !0;
		}
		f.offset && T(), y = !0;
	}, D, O, k, A, j = function() {
		w(), D.isActive() && D.vars.scrollY > s && (f() > s ? D.progress(1) && f(s) : D.resetTo("scrollY", s));
	};
	return d && $.set(d, { y: "+=0" }), e.ignoreCheck = function(e) {
		return Wv && e.type === "touchmove" && E(e) || m > 1.05 && e.type !== "touchstart" || o.isGesturing || e.touches && e.touches.length > 1;
	}, e.onPress = function() {
		y = !1;
		var e = m;
		m = ly((bv.visualViewport && bv.visualViewport.scale || 1) / h), D.pause(), e !== m && Xb(c, m > 1.01 || !n && "x"), O = p(), k = f(), w(), v = Cb;
	}, e.onRelease = e.onGestureStart = function(e, t) {
		if (f.offset && T(), !t) A.restart(!0);
		else {
			Y_.cache++;
			var r = _(), i, o;
			n && (i = p(), o = i + r * .05 * -e.velocityX / .227, r *= Yb(p, i, o, _y(c, cv)), D.vars.scrollX = S(o)), i = f(), o = i + r * .05 * -e.velocityY / .227, r *= Yb(f, i, o, _y(c, lv)), D.vars.scrollY = C(o), D.invalidate().duration(r).play(.01), (Wv && D.vars.scrollY >= s || i >= s - 1) && $.to({}, {
				onUpdate: j,
				duration: r
			});
		}
		a && a(e);
	}, e.onWheel = function() {
		D._ts && D.pause(), $v() - g > 1e3 && (v = 0, g = $v());
	}, e.onChange = function(e, t, r, i, a) {
		if (Cb !== v && w(), t && n && p(S(i[2] === t ? O + (e.startX - e.x) : p() + t - i[1])), r) {
			f.offset && T();
			var o = a[2] === r, s = o ? k + e.startY - e.y : f() + r - a[1], c = C(s);
			o && s !== c && (k += c - s), f(c);
		}
		(r || t) && Mb();
	}, e.onEnable = function() {
		Xb(c, !n && "x"), Jb.addEventListener("refresh", j), Zy(bv, "resize", j), f.smooth &&= (f.target.style.scrollBehavior = "auto", p.smooth = !1), b.enable();
	}, e.onDisable = function() {
		Xb(c, !0), Qy(bv, "resize", j), Jb.removeEventListener("refresh", j), b.kill();
	}, e.lockAxis = e.lockAxis !== !1, o = new vv(e), o.iOS = Wv, Wv && !f() && f(1), Wv && $.ticker.add(cy), A = o._dc, D = $.to(o, {
		ease: "power4",
		paused: !0,
		inherit: !1,
		scrollX: n ? "+=0.1" : "+=0",
		scrollY: "+=0.1",
		modifiers: { scrollY: Gb(f, f(), function() {
			return D.pause();
		}) },
		onUpdate: Mb,
		onComplete: A.vars.onComplete
	}), o;
};
Jb.sort = function(e) {
	if (by(e)) return ob.sort(e);
	var t = bv.pageYOffset || 0;
	return Jb.getAll().forEach(function(e) {
		return e._sortY = e.trigger ? t + e.trigger.getBoundingClientRect().top : e.start + bv.innerHeight;
	}), ob.sort(e || function(e, t) {
		return (e.vars.refreshPriority || 0) * -1e6 + (e.vars.containerAnimation ? 1e6 : e._sortY) - ((t.vars.containerAnimation ? 1e6 : t._sortY) + (t.vars.refreshPriority || 0) * -1e6);
	});
}, Jb.observe = function(e) {
	return new vv(e);
}, Jb.normalizeScroll = function(e) {
	if (e === void 0) return Bv;
	if (e === !0 && Bv) return Bv.enable();
	if (e === !1) Bv && Bv.kill(), Bv = e;
	else {
		var t = e instanceof vv ? e : rx(e);
		return Bv && Bv.target === t.target && Bv.kill(), fy(t.target) && (Bv = t), t;
	}
}, Jb.core = {
	_getVelocityProp: pv,
	_inputObserver: $b,
	_scrollers: Y_,
	_proxies: X_,
	bridge: {
		ss: function() {
			ty || gb("scrollStart"), ty = $v();
		},
		ref: function() {
			return Av;
		}
	}
}, dy() && $.registerPlugin(Jb);
// node_modules/gsap/SplitText.js
var ix, ax, ox = typeof Symbol == "function" ? Symbol() : "_split", sx, cx = () => sx || Dx.register(window.gsap), lx = typeof Intl < "u" && "Segmenter" in Intl ? new Intl.Segmenter() : 0, ux = (e) => e ? typeof e == "string" ? ux(document.querySelectorAll(e)) : "length" in e ? Array.from(e).reduce((e, t) => (typeof t == "string" ? e.push(...ux(t)) : e.push(t), e), []) : [e] : [], dx = (e) => ux(e).filter((e) => e && e.nodeType === 1), fx = [], px = function() {}, mx = { add: (e) => e() }, hx = /\s+/g, gx = /* @__PURE__ */ RegExp("\\p{RI}\\p{RI}|\\p{Emoji}(\\p{EMod}|\\u{FE0F}\\u{20E3}?|[\\u{E0020}-\\u{E007E}]+\\u{E007F})?(\\u{200D}\\p{Emoji}(\\p{EMod}|\\u{FE0F}\\u{20E3}?|[\\u{E0020}-\\u{E007E}]+\\u{E007F})?)*|.", "gu"), _x = {
	left: 0,
	top: 0,
	width: 0,
	height: 0
}, vx = (e, t) => {
	for (; ++t < e.length && e[t] === _x;);
	return e[t] || _x;
}, yx = ({ element: e, html: t, ariaL: n, ariaH: r }) => {
	e.innerHTML = t, n ? e.setAttribute("aria-label", n) : e.removeAttribute("aria-label"), r ? e.setAttribute("aria-hidden", r) : e.removeAttribute("aria-hidden");
}, bx = (e, t) => {
	if (t) {
		let n = new Set(e.join("").match(t) || fx), r = e.length, i, a, o, s;
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
}, xx = (e) => window.getComputedStyle(e).display === "inline" && (e.style.display = "inline-block"), Sx = (e, t, n) => t.insertBefore(typeof e == "string" ? document.createTextNode(e) : e, n), Cx = (e, t, n) => {
	let r = t[e + "sClass"] || "", { tag: i = "div", aria: a = "auto", propIndex: o = !1 } = t, s = e === "line" ? "block" : "inline-block", c = r.indexOf("++") > -1, l = (t) => {
		let l = document.createElement(i), u = n.length + 1;
		return r && (l.className = r + (c ? " " + r + u : "")), o && l.style.setProperty("--" + e, u + ""), a !== "none" && l.setAttribute("aria-hidden", "true"), i !== "span" && (l.style.position = "relative", l.style.display = s), l.textContent = t, n.push(l), l;
	};
	return c && (r = r.replace("++", "")), l.collection = n, l;
}, wx = (e, t, n, r) => {
	let i = Cx("line", n, r), a = window.getComputedStyle(e).textAlign || "left";
	return (n, r) => {
		let o = i("");
		for (o.style.textAlign = a, e.insertBefore(o, t[n]); n < r; n++) o.appendChild(t[n]);
		o.normalize();
	};
}, Tx = (e, t, n, r, i, a, o, s, c, l) => {
	var u;
	let d = Array.from(e.childNodes), f = 0, { wordDelimiter: p, reduceWhiteSpace: m = !0, prepareText: h } = t, g = e.getBoundingClientRect(), _ = g, v = !m && window.getComputedStyle(e).whiteSpace.substring(0, 3) === "pre", y = a && l && window.getComputedStyle(e).direction === "rtl", b = 0, x = n.collection, S, C, w, T, E, D, O, k, A, j, M, ee, N, P, F, I, te, L;
	for (typeof p == "object" ? (w = p.delimiter || p, C = p.replaceWith || "") : C = p === "" ? "" : p || " ", S = C !== " "; f < d.length; f++) if (T = d[f], T.nodeType === 3) {
		for (F = T.textContent || "", m ? F = F.replace(hx, " ") : v && (F = F.replace(/\n/g, C + "\n")), h && (F = h(F, e)), T.textContent = F, E = C || w ? F.split(w || C) : F.match(s) || fx, te = E[E.length - 1], k = S ? te.slice(-1) === " " : !te, te || E.pop(), _ = g, O = S ? E[0].charAt(0) === " " : !E[0], O && Sx(" ", e, T), E[0] || E.shift(), bx(E, c), a && l || (T.textContent = ""), A = 1; A <= E.length; A++) if (I = E[A - 1], !m && v && I.charAt(0) === "\n" && ((u = T.previousSibling) == null || u.remove(), Sx(document.createElement("br"), e, T), I = I.slice(1)), !m && I === "") Sx(C, e, T);
		else if (I === " ") e.insertBefore(document.createTextNode(" "), T);
		else {
			if (S && I.charAt(0) === " " && Sx(" ", e, T), b && A === 1 && !O && x.indexOf(b.parentNode) > -1 ? (D = x[x.length - 1], D.appendChild(document.createTextNode(r ? "" : I))) : (D = n(r ? "" : I), Sx(D, e, T), b && A === 1 && !O && D.insertBefore(b, D.firstChild)), r) {
				if (M = lx ? bx([...lx.segment(I)].map((e) => e.segment), c) : I.match(s) || fx, c) {
					let e = I.match(c);
					e && e.some((e) => M.indexOf(e) < 0) && (M = I.match(s) || fx);
				}
				for (L = 0; L < M.length; L++) D.appendChild(M[L] === " " ? document.createTextNode(" ") : r(M[L]));
			}
			if (a && l) {
				if (F = T.textContent = F.substring(I.length + 1, F.length), j = D.getBoundingClientRect(), j.top > _.top && (y ? j.left >= _.left : j.left <= _.left)) {
					for (ee = e.cloneNode(), N = e.childNodes[0]; N && N !== D;) P = N, N = N.nextSibling, ee.appendChild(P);
					e.parentNode.insertBefore(ee, e), i && xx(ee);
				}
				_ = j;
			}
			(A < E.length || k) && Sx(A >= E.length ? " " : S && I.slice(-1) === " " ? " " + C : C, e, T);
		}
		e.removeChild(T), b = 0;
	} else T.nodeType === 1 && (o && o.indexOf(T) > -1 ? (x.indexOf(T.previousSibling) > -1 && x[x.length - 1].appendChild(T), b = T) : (Tx(T, t, n, r, i, a, o, s, c, !0), b = 0), i && xx(T));
}, Ex = class e {
	constructor(e, t) {
		this.isSplit = !1, cx(), this.elements = dx(e), this.chars = [], this.words = [], this.lines = [], this.masks = [], this.vars = t, this.elements.forEach((e) => {
			var n;
			t.overwrite !== !1 && ((n = e[ox]) == null || n._data.orig.filter(({ element: t }) => t === e).forEach(yx)), e[ox] = this;
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
		}, px(this), this.split(t);
	}
	split(e) {
		return (this._ctx || mx).add(() => {
			this.isSplit && this.revert(), this.vars = e = e || this.vars || {};
			let { type: t = "chars,words,lines", aria: n = "auto", deepSlice: r = !0, smartWrap: i, onSplit: a, autoSplit: o = !1, specialChars: s, mask: c } = this.vars, l = t.indexOf("lines") > -1, u = t.indexOf("chars") > -1, d = t.indexOf("words") > -1, f = u && !d && !l, p = s && ("push" in s ? RegExp("(?:" + s.join("|") + ")", "gu") : s), m = p ? RegExp(p.source + "|" + gx.source, "gu") : gx, h = !!e.ignore && dx(e.ignore), { orig: g, animTime: _, obs: v } = this._data, y;
			(u || d || l) && (this.elements.forEach((t, a) => {
				g[a] = {
					element: t,
					html: t.innerHTML,
					ariaL: t.getAttribute("aria-label"),
					ariaH: t.getAttribute("aria-hidden")
				}, n === "auto" ? t.setAttribute("aria-label", (t.textContent || "").trim()) : n === "hidden" && t.setAttribute("aria-hidden", "true");
				let o = [], s = [], c = [], _ = u ? Cx("char", e, o) : null, v = Cx("word", e, s), y, b, x, S;
				if (Tx(t, e, v, _, f, r && (l || f), h, m, p, !1), l) {
					let n = ux(t.childNodes), r = wx(t, n, e, c), i, a = [], o = 0, s = window.getComputedStyle(t).direction === "rtl", l = n.map((e) => e.nodeType === 1 ? e.getBoundingClientRect() : _x), u = _x, d;
					for (y = 0; y < n.length; y++) i = n[y], i.nodeType === 1 && (i.nodeName === "BR" ? (y && n[y - 1].nodeName === "BR" || (a.push(i), r(o, y + 1)), o = y + 1, u = vx(l, y)) : (d = l[y], y && d.top > u.top && (s ? d.left + d.width > u.left + 1 : d.left < u.left + u.width - 1) && (r(o, y), o = y), u = d));
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
			}))), this.isSplit = !0, ax && l && o && ax.addEventListener("loadingdone", this._split), (y = a && a(this)) && y.totalTime && (this._data.anim = _ ? y.totalTime(_) : y), l && o && this.elements.forEach((e, t) => {
				g[t].width = e.offsetWidth, v && v.observe(e);
			});
		}), this;
	}
	kill() {
		let { obs: e, t } = this._data;
		e && e.disconnect(), clearTimeout(t), ax?.removeEventListener("loadingdone", this._split);
	}
	revert() {
		var e, t;
		if (this.isSplit) {
			let { orig: n, anim: r } = this._data;
			this.kill(), n.forEach(yx), this.chars.length = this.words.length = this.lines.length = n.length = this.masks.length = 0, this.isSplit = !1, r && (this._data.animTime = r.totalTime(), r.revert()), (t = (e = this.vars).onRevert) == null || t.call(e, this);
		}
		return this;
	}
	static create(t, n) {
		return new e(t, n);
	}
	static register(e) {
		ix = ix || e || window.gsap, ix && (ux = ix.utils.toArray, px = ix.core.context || px), !sx && window.innerWidth > 0 && (ax = document.fonts, sx = !0);
	}
};
Ex.version = "3.15.1";
var Dx = Ex, Ox = typeof document < "u" ? y.useLayoutEffect : y.useEffect, kx = (e) => e && !Array.isArray(e) && typeof e == "object", Ax = [], jx = {}, Mx = A_, Nx = (e, t = Ax) => {
	let n = jx;
	kx(e) ? (n = e, e = null, t = "dependencies" in n ? n.dependencies : Ax) : kx(t) && (n = t, t = "dependencies" in n ? n.dependencies : Ax), e && typeof e != "function" && console.warn("First parameter must be a function or config object");
	let { scope: r, revertOnUpdate: i } = n, a = (0, y.useRef)(!1), o = (0, y.useRef)(Mx.context(() => {}, r)), s = (0, y.useRef)((e) => o.current.add(null, e)), c = t && t.length && !i;
	return c && Ox(() => (a.current = !0, () => o.current.revert()), Ax), Ox(() => {
		if (e && o.current.add(e, r), !c || !a.current) return () => o.current.revert();
	}, t), {
		context: o.current,
		contextSafe: s.current
	};
};
// src/public/motion/SplitText.tsx
Nx.register = (e) => {
	Mx = e;
}, Nx.headless = !0, A_.registerPlugin(Jb, Dx, Nx);
var Px = {
	opacity: 0,
	y: 40
}, Fx = {
	opacity: 1,
	y: 0
}, Ix = 180, Lx = 19, Rx = .024, zx = typeof window < "u" ? y.useLayoutEffect : y.useEffect, Bx = () => typeof document < "u" && (!document.fonts || document.fonts.status === "loaded"), Vx = (e) => 1 - Math.cos(e * Math.PI * 1.5) * (1 - e) ** 1.2, Hx = (e, t) => {
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
			ease: Vx
		};
		default: return {
			from: { ...Px },
			to: { ...Fx },
			ease: "power3.out"
		};
	}
}, Ux = ({ text: e, id: t, tabIndex: n, className: r = "", delay: i = 50, duration: a = 1.25, ease: o, splitType: s = "chars", from: c, to: l, threshold: u = .1, rootMargin: d = "-100px", textAlign: f = "center", tag: p = "p", staggerFrom: m = "start", mask: h = !1, effect: g = "rise", trigger: _ = "view", loop: v = !1, loopDelay: b = 1.5, hoverEffect: x = "none", color: S, accentColor: C, onLetterAnimationComplete: w }) => {
	let T = (0, y.useRef)(null), [E, D] = (0, y.useState)(() => typeof window < "u" && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
	(0, y.useEffect)(() => {
		let e = window.matchMedia("(prefers-reduced-motion: reduce)"), t = () => D(e.matches);
		return e.addEventListener("change", t), t(), () => e.removeEventListener("change", t);
	}, []);
	let O = (0, y.useRef)(null), k = (0, y.useRef)(w), A = (0, y.useRef)({
		trigger: _,
		hoverEffect: x,
		accentColor: C
	}), [j, M] = (0, y.useState)(Bx), [ee, N] = (0, y.useState)(!1);
	zx(() => {
		k.current = w, A.current = {
			trigger: _,
			hoverEffect: x,
			accentColor: C
		};
	}), (0, y.useEffect)(() => {
		if (j) return;
		let e = !0;
		return document.fonts.ready.then(() => {
			e && M(!0);
		}), () => {
			e = !1;
		};
	}, [j]), Nx(() => {
		let t = T.current;
		if (!t || !e || !j) return;
		if (t.getBoundingClientRect(), !Bx()) {
			M(!1);
			return;
		}
		let n = () => {
			O.current !== e && (O.current = e, k.current?.());
		};
		if (E) {
			N(!0), n();
			return;
		}
		let r = (1 - u) * 100, f = /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(d), p = f ? parseFloat(f[1]) : 0, y = f && f[2] || "px", x = `top ${r}%${p === 0 ? "" : p < 0 ? `-=${Math.abs(p)}${y}` : `+=${p}${y}`}`, S = s.includes("chars") ? "chars" : s.includes("words") ? "words" : "lines", C = parseFloat(getComputedStyle(t).fontSize) || 16, w = c !== void 0 || l !== void 0, D = Hx(g, C), ee = w ? { ...c || Px } : D.from, P = w ? { ...l || Fx } : D.to, F = o || (w ? "power3.out" : D.ease), I = w ? "willChange" : "transform,filter,willChange", te = Math.max(.35, a * .55), L = [], ne = [], re = A_.utils.distribute({
			each: i / 1e3,
			from: m
		}), ie = O.current === e, ae = null, oe = null, se = null, ce = 0, R = 0, le = null, ue = C * .2, z = [], B = [], V = {
			x: 0,
			y: 0,
			inside: !1
		}, de = (e, n) => {
			let r = A.current.accentColor, i = A_.timeline(n);
			return i.fromTo(L, {
				...ee,
				willChange: "transform, opacity"
			}, {
				...P,
				duration: a,
				ease: F,
				stagger: re,
				immediateRender: e
			}, 0), r && i.fromTo(L, { color: r }, {
				color: getComputedStyle(t).color,
				duration: a * .7,
				ease: "power1.inOut",
				stagger: re,
				immediateRender: e
			}, a * .3), i.set(L, { clearProps: r ? `${I},color` : I }), i;
		}, fe = () => {
			let e = A.current.accentColor, t = A_.timeline();
			return t.fromTo(L, {
				...P,
				willChange: "transform, opacity"
			}, {
				...ee,
				duration: te,
				ease: "power2.in",
				stagger: re,
				immediateRender: !1
			}, 0), e && t.to(L, {
				color: e,
				duration: te,
				ease: "power1.in",
				stagger: re
			}, 0), t;
		}, pe = () => {
			!oe && ie && L.length && (se?.kill(), se = null, oe = A_.timeline({ onComplete: () => {
				oe = null, me();
			} }).add(fe(), 0).add(de(!1), te));
		}, me = () => {
			se?.kill(), se = v ? A_.delayedCall(b, pe) : null;
		}, he = () => {
			let e = t.getBoundingClientRect();
			le = ne.map((t, n) => {
				let r = t.getBoundingClientRect();
				return {
					x: r.left + r.width / 2 - e.left,
					y: r.top + r.height / 2 - e.top - (z[n]?.y || 0)
				};
			});
		}, H = (e) => {
			ce = 0;
			let t = Math.min(.032, Math.max(.001, (e - R) / 1e3));
			R = e;
			let n = A.current.hoverEffect === "lift" && V.inside && ie ? le : null, r = C * 1.15, i = !1;
			for (let t = B.length - 1; t >= 0; t--) {
				if (e < B[t].at) continue;
				let n = z[B[t].index];
				n && (n.v -= B[t].velocity), B.splice(t, 1);
			}
			ne.forEach((e, a) => {
				let o = z[a] || (z[a] = {
					y: 0,
					v: 0
				}), s = n?.[a], c = 0;
				if (s) {
					let e = (s.x - V.x) / r, t = (s.y - V.y) / (r * 1.4);
					c = -ue * Math.exp(-(e * e + t * t) * .5);
				}
				o.v += (Ix * (c - o.y) - Lx * o.v) * t, o.y += o.v * t, Math.abs(c - o.y) < .02 && Math.abs(o.v) < .05 ? (o.y = c, o.v = 0) : i = !0, e.style.translate = Math.abs(o.y) > .01 ? `0 ${o.y.toFixed(2)}px` : "";
			}), (i || B.length) && (ce = requestAnimationFrame(H));
		}, ge = () => {
			ce ||= (R = performance.now(), requestAnimationFrame(H));
		}, U = (e) => {
			let n = t.getBoundingClientRect();
			V.x = e.clientX - n.left, V.y = e.clientY - n.top;
		}, W = (e) => {
			if (e.pointerType === "touch" || !matchMedia("(hover: hover) and (pointer: fine)").matches || (U(e), V.inside = !0, !ie)) return;
			let t = A.current;
			if (t.trigger === "hover" && pe(), t.hoverEffect !== "none") {
				if (he(), t.hoverEffect === "wave") {
					let e = performance.now(), t = C * 9, n = C * .16 / Rx;
					le?.forEach((r, i) => {
						B.push({
							index: i,
							velocity: n,
							at: e + Math.abs(r.x - V.x) / t * 1e3
						});
					});
				}
				ge();
			}
		}, G = (e) => {
			e.pointerType !== "touch" && matchMedia("(hover: hover) and (pointer: fine)").matches && (U(e), V.inside = !0, ie && A.current.hoverEffect === "lift" && (le || he(), ge()));
		}, _e = () => {
			V.inside = !1, ge();
		}, ve = () => {
			A.current.trigger === "click" && pe();
		}, ye = new Dx(t, {
			type: s,
			smartWrap: !0,
			autoSplit: s === "lines",
			mask: h ? S : void 0,
			linesClass: "split-line",
			wordsClass: "split-word",
			charsClass: "split-char",
			reduceWhiteSpace: !1,
			onSplit: (e) => {
				if (L = [
					e[S],
					e.chars,
					e.words,
					e.lines
				].find((e) => e.length) || [], ne = h && e.masks?.length === L.length ? e.masks : L, re = A_.utils.distribute({
					each: i / 1e3,
					from: m
				}), le = null, z.length = 0, B.length = 0, oe && oe !== ae && (oe.kill(), oe = null), !ie) return ae = de(!0, {
					scrollTrigger: _ === "load" ? void 0 : {
						trigger: t,
						start: x,
						once: !0,
						fastScrollEnd: !0,
						anticipatePin: .4
					},
					onComplete: () => {
						ie = !0, ae = null, oe = null, n(), me();
					}
				}), oe = ae, ae;
			}
		}), be = () => {
			ae?.progress(1), se?.kill(), A_.set(L, {
				...P,
				clearProps: "transform,filter,willChange"
			}), ie = !0, n();
		};
		return t.addEventListener("focus", be), t === document.activeElement && be(), N(!0), ie && t !== document.activeElement && me(), t.addEventListener("pointerenter", W), t.addEventListener("pointermove", G), t.addEventListener("pointerleave", _e), t.addEventListener("click", ve), () => {
			cancelAnimationFrame(ce), se?.kill(), oe?.kill(), t.removeEventListener("focus", be), t.removeEventListener("pointerenter", W), t.removeEventListener("pointermove", G), t.removeEventListener("pointerleave", _e), t.removeEventListener("click", ve), ne.forEach((e) => {
				e.style.translate = "";
			}), Jb.getAll().forEach((e) => {
				e.trigger === t && e.kill();
			}), ye.revert();
		};
	}, {
		dependencies: [
			e,
			i,
			a,
			o,
			s,
			JSON.stringify(c),
			JSON.stringify(l),
			u,
			d,
			m,
			h,
			g,
			_,
			v,
			b,
			j,
			E
		],
		scope: T,
		revertOnUpdate: !0
	});
	let P = p || "p", F = x === "none" && (c !== void 0 || l !== void 0 || g === "rise" || g === "fade");
	return /* @__PURE__ */ (0, Y.jsx)(P, {
		ref: T,
		id: t,
		tabIndex: n,
		"data-split-ready": ee || void 0,
		className: `sv-split-text ${r}`,
		style: {
			textAlign: f,
			overflow: F ? "hidden" : "visible",
			display: "block",
			whiteSpace: "normal",
			wordWrap: "break-word",
			color: S,
			cursor: _ === "click" ? "pointer" : void 0
		},
		children: e
	}, e);
};
// src/public/motion/SlidingIndicator.tsx
function Wx({ selected: e }) {
	let t = (0, y.useRef)(null), n = (0, y.useRef)(!0);
	return (0, y.useLayoutEffect)(() => {
		let e = t.current, r = e?.parentElement;
		if (!e || !r) return;
		let i = !0, a = (t) => {
			let n = r.querySelector("[aria-pressed=\"true\"]");
			n && (t || (e.style.transition = "none"), e.style.transform = `translate(${n.offsetLeft}px, ${n.offsetTop}px)`, e.style.width = `${n.offsetWidth}px`, e.style.height = `${n.offsetHeight}px`, r.setAttribute("data-tabs-ready", ""), t || (e.offsetWidth, e.style.transition = ""));
		};
		a(!n.current), n.current = !1;
		let o = new ResizeObserver(() => a(!1));
		return o.observe(r), r.querySelectorAll("button").forEach((e) => o.observe(e)), document.fonts?.ready.then(() => {
			i && a(!1);
		}), () => {
			i = !1, o.disconnect();
		};
	}, [e]), /* @__PURE__ */ (0, Y.jsx)("span", {
		ref: t,
		className: "t-tabs-pill",
		"aria-hidden": "true"
	});
}
String.raw;
// node_modules/number-flow/dist/ssr-DvIINv8w.mjs
var Gx = String.raw, Kx = (() => {
	try {
		document.createElement("div").animate({ opacity: 0 }, { easing: "linear(0, 1)" });
	} catch {
		return !1;
	}
	return !0;
})(), qx = typeof CSS < "u" && CSS.supports && CSS.supports("line-height", "mod(1,1)"), Jx = typeof matchMedia < "u" ? matchMedia("(prefers-reduced-motion: reduce)") : null, Yx = "--_number-flow-d-opacity", Xx = "--_number-flow-d-width", Zx = "--_number-flow-dx", Qx = "--_number-flow-d", $x = (() => {
	try {
		return CSS.registerProperty({
			name: Yx,
			syntax: "<number>",
			inherits: !1,
			initialValue: "0"
		}), CSS.registerProperty({
			name: Zx,
			syntax: "<length>",
			inherits: !0,
			initialValue: "0px"
		}), CSS.registerProperty({
			name: Xx,
			syntax: "<number>",
			inherits: !1,
			initialValue: "0"
		}), CSS.registerProperty({
			name: Qx,
			syntax: "<number>",
			inherits: !0,
			initialValue: "0"
		}), !0;
	} catch {
		return !1;
	}
})(), eS = "round(nearest, calc(var(--number-flow-mask-height, 0.25em) / 2), 1px)", tS = `calc(${eS} * 2)`, nS = "var(--number-flow-mask-width, 0.5em)", rS = `calc(${nS} / var(--scale-x))`, iS = "#000 0, transparent 71%", aS = Gx`:host{display:inline-block;direction:ltr;white-space:nowrap;isolation:isolate;line-height:1}.number,.number__inner{display:inline-block;transform-origin:left top}:host([data-will-change]) :is(.number,.number__inner,.section,.digit,.digit__num,.symbol){will-change:transform}.number{--scale-x:calc(1 + var(${Xx}) / var(--width));transform:translateX(var(${Zx})) scaleX(var(--scale-x));margin:0 calc(-1 * ${nS});position:relative;-webkit-mask-image:linear-gradient(to right,transparent 0,#000 ${rS},#000 calc(100% - ${rS}),transparent ),linear-gradient(to bottom,transparent 0,#000 ${tS},#000 calc(100% - ${tS}),transparent 100% ),radial-gradient(at bottom right,${iS}),radial-gradient(at bottom left,${iS}),radial-gradient(at top left,${iS}),radial-gradient(at top right,${iS});-webkit-mask-size:100% calc(100% - ${tS} * 2),calc(100% - ${rS} * 2) 100%,${rS} ${tS},${rS} ${tS},${rS} ${tS},${rS} ${tS};-webkit-mask-position:center,center,top left,top right,bottom right,bottom left;-webkit-mask-repeat:no-repeat}.number__inner{padding:${eS} ${nS};transform:scaleX(calc(1 / var(--scale-x))) translateX(calc(-1 * var(${Zx})))}:host > :not(.number){z-index:5}.section,.symbol{display:inline-block;position:relative;isolation:isolate}.section::after{content:'\200b';display:inline-block}.section--justify-left{transform-origin:center left}.section--justify-right{transform-origin:center right}.section > [inert],.symbol > [inert]{margin:0 !important;position:absolute !important;z-index:-1}.digit{display:inline-block;position:relative;--c:var(--current) + var(${Qx})}.digit__num,.number .section::after{padding:${eS} 0}.digit__num{display:inline-block;--offset-raw:mod(var(--length) + var(--n) - mod(var(--c),var(--length)),var(--length));--offset:calc( var(--offset-raw) - var(--length) * round(down,var(--offset-raw) / (var(--length) / 2),1) );--y:clamp(-100%,var(--offset) * 100%,100%);transform:translateY(var(--y))}.digit__num[inert]{position:absolute;top:0;left:50%;transform:translateX(-50%) translateY(var(--y))}.digit:not(.is-spinning) .digit__num[inert]{display:none}.symbol__value{display:inline-block;mix-blend-mode:plus-lighter;white-space:pre}.section--justify-left .symbol > [inert]{left:0}.section--justify-right .symbol > [inert]{right:0}.animate-presence{opacity:calc(1 + var(${Yx}))}`, oS = typeof HTMLElement < "u" ? HTMLElement : class {}, sS = Gx`:host{display:inline-block;direction:ltr;white-space:nowrap;line-height:1}span{display:inline-block}:host([data-will-change]) span{will-change:transform}.number,.digit{padding:${eS} 0}.symbol{white-space:pre}`, cS = (e = "") => Gx`:where(number-flow${e}){line-height:1}number-flow${e} > span{font-kerning:none;display:inline-block;padding:${tS} 0}`, lS = (e, t, n) => {
	let r = document.createElement(e), [i, a] = Array.isArray(t) ? [void 0, t] : [t, n];
	return i && Object.assign(r, i), a?.forEach((e) => r.appendChild(e)), r;
}, uS = (e, t) => t === "left" ? e.offsetLeft : ((e.offsetParent instanceof HTMLElement ? e.offsetParent : null)?.offsetWidth ?? 0) - e.offsetWidth - e.offsetLeft, dS = (e) => e.offsetWidth > 0 && e.offsetHeight > 0, fS = (e, t) => {
	typeof HTMLElement < "u" && typeof customElements < "u" && !customElements.get(e) && customElements.define(e, t);
};
function pS(e, t, { reverse: n = !1 } = {}) {
	let r = e.length;
	for (let i = n ? r - 1 : 0; n ? i >= 0 : i < r; n ? i-- : i++) t(e[i], i);
}
function mS(e, t, n, r) {
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
var hS = qx && Kx && $x, gS = class extends oS {
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
			this._data = e, this.computedTrend = typeof this.trend == "function" ? this.trend(c.value, s) : this.trend, this.computedAnimated = hS && this._animated && (!this.respectMotionPreference || !((t = Jx) != null && t.matches)) && dS(this) && this.ownerDocument.visibilityState === "visible", (n = this.plugins) == null || n.forEach((t) => t.onUpdate?.call(t, e, c, this)), this.batched || this.willUpdate(), this._pre.update(r), this._num.update({
				integer: i,
				fraction: a
			}), this._post.update(o), this.batched || this.didUpdate();
		} else {
			this._data = e, this.attachShadow({ mode: "open" });
			try {
				this._internals ??= this.attachInternals(), this._internals.role = "img";
			} catch {}
			let t = document.createElement("style");
			this.nonce && (t.nonce = this.nonce), t.textContent = aS, this.shadowRoot.appendChild(t), this._pre = new bS(this, r, {
				justify: "right",
				part: "left"
			}), this.shadowRoot.appendChild(this._pre.el), this._num = new _S(this, i, a), this.shadowRoot.appendChild(this._num.el), this._post = new bS(this, o, {
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
		this._preUpdated = hS && this._animated && (!this.respectMotionPreference || !((e = Jx) != null && e.matches)) && this.ownerDocument.visibilityState === "visible", this._preUpdated && (this._pre.willUpdate(), this._num.willUpdate(), this._post.willUpdate());
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
gS.defaultProps = {
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
var _S = class {
	constructor(e, t, n, { className: r, ...i } = {}) {
		this.flow = e, this._integer = new yS(e, t, {
			justify: "right",
			part: "integer"
		}), this._fraction = new yS(e, n, {
			justify: "left",
			part: "fraction"
		}), this._inner = lS("span", { className: "number__inner" }, [this._integer.el, this._fraction.el]), this.el = lS("span", {
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
			[Zx]: [`${t}px`, "0px"],
			[Xx]: [r, 0]
		}, {
			...this.flow.transformTiming,
			composite: "accumulate"
		});
	}
}, vS = class {
	constructor(e, t, { justify: n, className: r, ...i }, a) {
		this.flow = e, this.children = /* @__PURE__ */ new Map(), this.onCharRemove = (e) => () => {
			this.children.delete(e);
		}, this.justify = n;
		let o = t.map((e) => this.addChar(e).el);
		this.el = lS("span", {
			...i,
			className: `section section--justify-${n} ${r ?? ""}`
		}, a ? a(o) : o);
	}
	addChar(e, { startDigitsAtZero: t = !1, ...n } = {}) {
		let r = e.type === "integer" || e.type === "fraction" ? new CS(this, e.type, t ? 0 : e.value, e.pos, {
			...n,
			onRemove: this.onCharRemove(e.key)
		}) : new wS(this, e.type, e.value, {
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
			e.el.style.top = `${e.el.offsetTop}px`, e.el.style[this.justify] = `${uS(e.el, this.justify)}px`;
		}), e.forEach((e) => {
			e.el.setAttribute("inert", ""), e.present = !1;
		});
	}
	addNewAndUpdateExisting(e) {
		let t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map(), r = this.justify === "left", i = r ? "prepend" : "append";
		if (pS(e, (e) => {
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
}, yS = class extends vS {
	update(e) {
		let t = /* @__PURE__ */ new Map();
		this.children.forEach((n, r) => {
			e.find((e) => e.key === r) || t.set(r, n), this.unpop(n);
		}), this.addNewAndUpdateExisting(e), t.forEach((e) => {
			e instanceof CS && e.update(0);
		}), this.pop(t);
	}
}, bS = class extends vS {
	update(e) {
		let t = /* @__PURE__ */ new Map();
		this.children.forEach((n, r) => {
			e.find((e) => e.key === r) || t.set(r, n);
		}), this.pop(t), this.addNewAndUpdateExisting(e);
	}
}, xS = class {
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
			this.el.style.setProperty("--_number-flow-d-opacity", e ? "0" : "-.999"), this.el.animate({ [Yx]: e ? [-.9999, 0] : [.999, 0] }, {
				...this.flow.opacityTiming,
				composite: "accumulate"
			}), e ? this.flow.removeEventListener("animationsfinish", this._remove) : this.flow.addEventListener("animationsfinish", this._remove, { once: !0 });
		}
	}
}, SS = class extends xS {
	constructor(e, t, n, r) {
		super(e.flow, n, r), this.section = e, this.value = t, this.el = n;
	}
}, CS = class extends SS {
	constructor(e, t, n, r, i) {
		let a = (e.flow.digits?.[r]?.max ?? 9) + 1, o = Array.from({ length: a }).map((e, t) => {
			let r = lS("span", { className: "digit__num" }, [document.createTextNode(String(t))]);
			return t !== n && r.setAttribute("inert", ""), r.style.setProperty("--n", String(t)), r;
		}), s = lS("span", {
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
}, wS = class extends SS {
	constructor(e, t, n, r) {
		let i = lS("span", {
			className: "symbol__value",
			textContent: n
		});
		super(e, n, lS("span", {
			part: `symbol ${t}`,
			className: "symbol"
		}, [i]), r), this.type = t, this._children = /* @__PURE__ */ new Map(), this._onChildRemove = (e) => () => {
			this._children.delete(e);
		}, this._children.set(n, new xS(this.flow, i, { onRemove: this._onChildRemove(n) }));
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
				let t = lS("span", {
					className: "symbol__value",
					textContent: e
				});
				this.el.appendChild(t), this._children.set(e, new xS(this.flow, t, {
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
}, TS = (e) => [
	sS,
	cS(e),
	aS
], ES = parseInt("19.3.1".match(/^(\d+)\./)?.[1]) >= 19, DS = ["data", "digits"], OS = class extends gS {
	attributeChangedCallback(e, t, n) {
		this[e] = JSON.parse(n);
	}
};
OS.observedAttributes = ES ? [] : DS, fS("number-flow-react", OS);
var kS = {};
function AS(e) {
	return e;
}
var jS = ES ? AS : JSON.stringify;
function MS(e) {
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
var NS = class extends y.Component {
	updateProperties(e) {
		if (!this.el) return;
		this.el.batched = !this.props.isolate;
		let [t] = MS(this.props);
		Object.entries(t).forEach(([e, t]) => {
			this.el[e] = t ?? OS.defaultProps[e];
		}), e?.onAnimationsStart && this.el.removeEventListener("animationsstart", e.onAnimationsStart), this.props.onAnimationsStart && this.el.addEventListener("animationsstart", this.props.onAnimationsStart), e?.onAnimationsFinish && this.el.removeEventListener("animationsfinish", e.onAnimationsFinish), this.props.onAnimationsFinish && this.el.addEventListener("animationsfinish", this.props.onAnimationsFinish);
	}
	componentDidMount() {
		this.updateProperties(), ES && this.el && (this.el.digits = this.props.digits, this.el.data = this.props.data);
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
		let [e, { innerRef: t, className: n, data: r, nonce: i, willChange: a, isolate: o, group: s, digits: c, onAnimationsStart: l, onAnimationsFinish: u, ...d }] = MS(this.props);
		return /*#__PURE__*/ y.createElement("number-flow-react", {
			ref: this.handleRef,
			"data-will-change": a ? "" : void 0,
			class: n,
			nonce: i,
			...d,
			dangerouslySetInnerHTML: { __html: "" },
			suppressHydrationWarning: !0,
			digits: jS(c),
			data: jS(r)
		});
	}
	constructor(e) {
		super(e), this.handleRef = this.handleRef.bind(this);
	}
}, PS = /*#__PURE__*/ y.forwardRef(function({ value: e, locales: t, format: n, prefix: r, suffix: i, ...a }, o) {
	y.useImperativeHandle(o, () => s.current, []);
	let s = y.useRef(void 0), c = y.useContext(FS);
	c?.useRegister(s);
	let l = y.useMemo(() => t ? JSON.stringify(t) : "", [t]), u = y.useMemo(() => n ? JSON.stringify(n) : "", [n]), d = y.useMemo(() => mS(e, kS[`${l}:${u}`] ??= new Intl.NumberFormat(t, n), r, i), [
		e,
		l,
		u,
		r,
		i
	]);
	return /*#__PURE__*/ y.createElement(NS, {
		...a,
		group: c,
		data: d,
		innerRef: s
	});
}), FS = /*#__PURE__*/ y.createContext(void 0);
TS("-react"), Object.freeze([
	"pending",
	"changes_requested",
	"rejected",
	"active",
	"blocked"
]);
var IS = Object.freeze(["buyer", "supplier"]);
Object.freeze({
	buyer: Object.freeze({
		homeRoute: Pd.buyerHome,
		userRoles: Object.freeze(["buyer", "owner"]),
		permissions: Object.freeze([
			"demands:write",
			"proposals:compare",
			"orders:read"
		])
	}),
	supplier: Object.freeze({
		homeRoute: Pd.supplierHome,
		userRoles: Object.freeze(["supplier", "owner"]),
		permissions: Object.freeze([
			"opportunities:read",
			"proposals:write-own",
			"orders:execute"
		])
	}),
	administration: Object.freeze({
		homeRoute: Pd.adminHome,
		userRoles: Object.freeze(["platform-admin"]),
		permissions: Object.freeze(["organizations:review"])
	})
});
function LS(e) {
	let t = typeof e == "string" ? e.trim().replace(/\s+/g, " ") : "";
	if (t.length < 2 || t.length > 120) throw Error("Informe o nome da empresa (2 a 120 caracteres).");
	return t;
}
function RS(e) {
	let t = Array.isArray(e) ? e : e && typeof e == "object" ? Object.entries(e).filter(([, e]) => e === !0).map(([e]) => e) : typeof e == "string" ? [e] : [], n = [...new Set(t.filter((e) => IS.includes(e)))];
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
var zS = "AC AL AP AM BA CE DF ES GO MA MT MS MG PA PB PR PE PI RJ RN RS RO RR SC SP SE TO".split(" ");
function BS(e) {
	let t = Object.fromEntries([
		"cnpj",
		"city",
		"state",
		"contact"
	].map((t) => [t, String(e?.[t] ?? "").trim()]));
	t.cnpj = t.cnpj.replace(/[.\s/\-]/g, "").toUpperCase(), t.state = t.state.toUpperCase();
	let n = {};
	for (let [e, r, i] of [
		[
			"cnpj",
			"CNPJ",
			18
		],
		[
			"city",
			"Cidade",
			100
		],
		[
			"contact",
			"Contato",
			120
		]
	]) t[e].length > i && (n[e] = `${r} deve ter até ${i} caracteres.`);
	return t.state && !zS.includes(t.state) && (n.state = "Selecione uma UF válida."), {
		fields: t,
		errors: n
	};
}
function VS(e) {
	let t = LS(e?.name), n = RS(e?.roles), { fields: r, errors: i } = BS(e), a = Object.values(i)[0];
	if (a) throw Error(a);
	return {
		name: t,
		roles: n,
		...r,
		onboardingVersion: 1
	};
}
// src/pages/auth/auth-validation.js
function HS(e) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}
function US(e) {
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
var WS = Object.freeze([
	{
		id: "buyer",
		label: "Compradora",
		roles: ["buyer"]
	},
	{
		id: "supplier",
		label: "Fornecedora",
		roles: ["supplier"]
	},
	{
		id: "both",
		label: "Compradora e fornecedora",
		roles: ["buyer", "supplier"]
	}
]), GS = /* @__PURE__ */ new Map([
	["compras", "buyer"],
	["fornecimento", "supplier"],
	["integrado", "both"]
]);
function KS(e, t) {
	let n = e ?? GS.get(t);
	return WS.find((e) => e.id === n) ?? WS[0];
}
var qS = (e) => new Intl.NumberFormat("pt-BR", {
	style: "currency",
	currency: "BRL",
	maximumFractionDigits: 0
}).format(e);
function JS(e, t = "buyer") {
	let n = (t === "supplier" ? [
		3,
		5,
		4,
		7,
		5,
		8,
		6,
		9,
		11,
		8,
		13,
		10
	] : [
		4,
		7,
		5,
		9,
		6,
		12,
		8,
		10,
		14,
		11,
		16,
		13
	]).slice(e === "30" ? -4 : e === "60" ? -8 : 0);
	return {
		values: n,
		total: n.reduce((e, t) => e + t, 0)
	};
}
function YS(e, t = "buyer") {
	let n = JS(e, t), r = [
		"Em execução",
		"Em inspeção",
		"Expedido",
		"Recebido"
	], i = Array.from({ length: 24 }, (e, n) => ({
		id: `example-${t}-${n}`,
		week: Math.floor(n / 2),
		stage: (n + +(t === "supplier")) % 4
	})).filter((e) => e.week >= 12 - n.values.length);
	return {
		series: n,
		orders: i,
		stages: r.map((e, t) => ({
			name: e,
			count: i.filter((e) => e.stage === t).length
		})),
		quotes: t === "supplier" ? [
			{
				label: "Versão 1",
				amount: 21120,
				days: 18
			},
			{
				label: "Versão 2",
				amount: 20160,
				days: 16
			},
			{
				label: "Versão 3",
				amount: 19680,
				days: 14
			}
		] : [
			{
				label: "Fornecedor A",
				amount: 18600,
				days: 18
			},
			{
				label: "Fornecedor B",
				amount: 19800,
				days: 14
			},
			{
				label: "Fornecedor C",
				amount: 20400,
				days: 12
			}
		]
	};
}
function XS(e, t) {
	let n = {};
	if (t === 0 && ((String(e.firstName ?? "").trim().length < 2 || String(e.firstName).length > 60) && (n.firstName = "Informe seu nome (2 a 60 caracteres)."), (String(e.lastName ?? "").trim().length < 2 || String(e.lastName).length > 80) && (n.lastName = "Informe seu sobrenome (2 a 80 caracteres)."), HS(String(e.email ?? "").trim()) || (n.email = "Informe um e-mail válido."), (US(String(e.password ?? "")).score !== 4 || String(e.password).length > 128) && (n.password = "Use de 8 a 128 caracteres, com maiúscula, minúscula e número."), e.password !== e.confirmPassword && (n.confirmPassword = "As senhas precisam ser iguais.")), t === 1) {
		try {
			LS(e.name);
		} catch (e) {
			n.name = e.message;
		}
		try {
			RS(e.roles);
		} catch (e) {
			n.roles = e.message;
		}
		Object.assign(n, BS(e).errors);
	}
	return n;
}
// src/components/ui/web3-bento.tsx
var ZS = [
	"var(--sv-orange)",
	"color-mix(in srgb, var(--sv-dark), var(--sv-paper) 55%)",
	"var(--sv-dark)",
	"var(--sv-ink)"
];
function QS() {
	let [e, t] = (0, y.useState)("90"), [n, r] = (0, y.useState)(null), [i, a] = (0, y.useState)("buyer"), o = Fu(), s = (0, y.useId)().replace(/:/g, ""), c = YS(e, i), l = c.series, u = i === "buyer", d = u ? "recebidas" : "enviadas", f = l.values.map((e, t) => [t / (l.values.length - 1) * 600, 160 - e / 18 * 145]), p = f.map(([e, t], n) => `${n ? "L" : "M"}${e},${t}`).join(" "), m = n ?? l.values.length - 1;
	return /* @__PURE__ */ (0, Y.jsxs)("div", {
		className: "sv-demo",
		"data-ui": "industrial-demo",
		children: [
			/* @__PURE__ */ (0, Y.jsxs)("div", {
				className: "sv-demo-header",
				children: [/* @__PURE__ */ (0, Y.jsxs)("div", { children: [/* @__PURE__ */ (0, Y.jsx)("img", {
					src: "./src/assets/brand/raposa.svg",
					alt: "",
					width: "23",
					height: "23"
				}), /* @__PURE__ */ (0, Y.jsxs)("strong", { children: [
					"SIVI",
					" ",
					/* @__PURE__ */ (0, Y.jsxs)("span", { children: ["/ ", u ? "Visão de compras" : "Visão de fornecimento"] })
				] })] }), /* @__PURE__ */ (0, Y.jsx)("span", {
					className: "sv-example-label",
					children: "Demonstração · dados ilustrativos"
				})]
			}),
			/* @__PURE__ */ (0, Y.jsxs)("div", {
				className: "sv-demo-body",
				children: [/* @__PURE__ */ (0, Y.jsxs)("div", {
					className: "sv-demo-sidebar",
					"aria-hidden": "true",
					children: [
						/* @__PURE__ */ (0, Y.jsx)("span", {
							className: "is-active",
							children: "Visão geral"
						}),
						/* @__PURE__ */ (0, Y.jsx)("span", { children: "Demandas" }),
						/* @__PURE__ */ (0, Y.jsx)("span", { children: "Propostas" }),
						/* @__PURE__ */ (0, Y.jsx)("span", { children: "Pedidos" }),
						/* @__PURE__ */ (0, Y.jsx)("span", { children: "Fornecedores" }),
						/* @__PURE__ */ (0, Y.jsxs)("div", { children: [
							"METALÚRGICA EXEMPLO",
							/* @__PURE__ */ (0, Y.jsx)("br", {}),
							/* @__PURE__ */ (0, Y.jsxs)("small", { children: ["Atuação ", u ? "compradora" : "fornecedora"] })
						] })
					]
				}), /* @__PURE__ */ (0, Y.jsxs)("div", {
					className: "sv-demo-main",
					children: [
						/* @__PURE__ */ (0, Y.jsxs)("div", {
							className: "sv-demo-title",
							children: [/* @__PURE__ */ (0, Y.jsxs)("div", { children: [/* @__PURE__ */ (0, Y.jsx)("small", { children: "Acordos que viram registros" }), /* @__PURE__ */ (0, Y.jsx)("h3", { children: u ? "O movimento da sua compra." : "Sua capacidade em movimento." })] }), /* @__PURE__ */ (0, Y.jsxs)("div", {
								className: "sv-demo-role t-tabs",
								role: "group",
								"aria-label": "Atuação da demonstração",
								children: [/* @__PURE__ */ (0, Y.jsx)(Wx, { selected: i }), [["buyer", "Comprador"], ["supplier", "Fornecedor"]].map(([e, t]) => /* @__PURE__ */ (0, Y.jsx)("button", {
									"aria-pressed": i === e,
									onClick: () => {
										a(e), r(null);
									},
									children: t
								}, e))]
							})]
						}),
						/* @__PURE__ */ (0, Y.jsxs)("div", {
							className: "sv-demo-cards",
							children: [
								/* @__PURE__ */ (0, Y.jsxs)("div", { children: [
									/* @__PURE__ */ (0, Y.jsxs)("span", { children: ["Propostas ", d] }),
									/* @__PURE__ */ (0, Y.jsx)("strong", { children: /* @__PURE__ */ (0, Y.jsx)(PS, {
										value: l.total,
										animated: !o
									}) }),
									/* @__PURE__ */ (0, Y.jsx)("small", { children: "No período ilustrativo selecionado" })
								] }),
								/* @__PURE__ */ (0, Y.jsxs)("div", { children: [
									/* @__PURE__ */ (0, Y.jsx)("span", { children: "Demanda em destaque" }),
									/* @__PURE__ */ (0, Y.jsx)("strong", { children: "Usinagem CNC" }),
									/* @__PURE__ */ (0, Y.jsx)("small", { children: "Alumínio 6061 · 240 peças" })
								] }),
								/* @__PURE__ */ (0, Y.jsxs)("div", { children: [
									/* @__PURE__ */ (0, Y.jsx)("span", { children: "Pedido de exemplo" }),
									/* @__PURE__ */ (0, Y.jsxs)("strong", {
										className: "sv-status",
										children: [/* @__PURE__ */ (0, Y.jsx)("i", {}), "Em inspeção"]
									}),
									/* @__PURE__ */ (0, Y.jsx)("small", { children: "Condições aceitas preservadas" })
								] })
							]
						}),
						/* @__PURE__ */ (0, Y.jsxs)("div", {
							className: "sv-chart",
							children: [
								/* @__PURE__ */ (0, Y.jsxs)("div", {
									className: "sv-chart-top",
									children: [/* @__PURE__ */ (0, Y.jsxs)("div", { children: [/* @__PURE__ */ (0, Y.jsxs)("h4", { children: [
										"Propostas ",
										d,
										" por semana"
									] }), /* @__PURE__ */ (0, Y.jsxs)("p", { children: [
										l.total,
										" propostas em ",
										l.values.length,
										" semanas de exemplo"
									] })] }), /* @__PURE__ */ (0, Y.jsxs)("div", {
										className: "sv-chart-filter t-tabs",
										role: "group",
										"aria-label": "Período do gráfico",
										children: [/* @__PURE__ */ (0, Y.jsx)(Wx, { selected: e }), [
											"30",
											"60",
											"90"
										].map((n) => /* @__PURE__ */ (0, Y.jsxs)("button", {
											"aria-pressed": e === n,
											onClick: () => {
												t(n), r(null);
											},
											children: [n, " dias"]
										}, n))]
									})]
								}),
								/* @__PURE__ */ (0, Y.jsx)("div", {
									className: "sv-chart-area",
									onPointerMove: (e) => {
										let t = e.currentTarget.getBoundingClientRect();
										r(Math.max(0, Math.min(l.values.length - 1, Math.round((e.clientX - t.left) / t.width * (l.values.length - 1)))));
									},
									onPointerLeave: () => r(null),
									children: /* @__PURE__ */ (0, Y.jsxs)("svg", {
										viewBox: "0 0 600 180",
										preserveAspectRatio: "none",
										role: "img",
										"aria-label": `${l.total} propostas ilustrativas, distribuídas por ${l.values.length} semanas`,
										children: [
											/* @__PURE__ */ (0, Y.jsx)("defs", { children: /* @__PURE__ */ (0, Y.jsxs)("linearGradient", {
												id: `${s}fill`,
												x1: "0",
												x2: "0",
												y1: "0",
												y2: "1",
												children: [/* @__PURE__ */ (0, Y.jsx)("stop", {
													offset: "0",
													stopColor: "var(--sv-orange)",
													stopOpacity: ".25"
												}), /* @__PURE__ */ (0, Y.jsx)("stop", {
													offset: "1",
													stopColor: "var(--sv-orange)",
													stopOpacity: "0"
												})]
											}) }),
											[
												.25,
												.5,
												.75
											].map((e) => /* @__PURE__ */ (0, Y.jsx)("line", {
												x1: "0",
												x2: 600,
												y1: 180 * e,
												y2: 180 * e,
												stroke: "var(--sv-line)",
												strokeDasharray: "2 5"
											}, e)),
											/* @__PURE__ */ (0, Y.jsx)("path", {
												d: `${p} L600,180 L0,180 Z`,
												fill: `url(#${s}fill)`
											}),
											/* @__PURE__ */ (0, Y.jsx)(Ru.path, {
												d: p,
												fill: "none",
												stroke: "color-mix(in srgb, var(--sv-orange), var(--sv-ink) 25%)",
												strokeWidth: "2.5",
												vectorEffect: "non-scaling-stroke",
												initial: !o && { opacity: 0 },
												whileInView: { opacity: 1 },
												viewport: { once: !0 },
												transition: { duration: o ? 0 : .45 }
											}, `${i}-${e}`),
											/* @__PURE__ */ (0, Y.jsx)("circle", {
												cx: f[m][0],
												cy: f[m][1],
												r: "5",
												fill: "color-mix(in srgb, var(--sv-orange), var(--sv-ink) 25%)",
												stroke: "white",
												strokeWidth: "3"
											})
										]
									})
								}),
								/* @__PURE__ */ (0, Y.jsxs)("div", {
									className: "sv-chart-axis",
									children: [
										/* @__PURE__ */ (0, Y.jsx)("span", { children: "Início do período" }),
										/* @__PURE__ */ (0, Y.jsxs)("span", {
											"aria-live": "polite",
											children: [
												"Semana ",
												m + 1,
												": ",
												l.values[m],
												" propostas"
											]
										}),
										/* @__PURE__ */ (0, Y.jsx)("span", { children: "Final" })
									]
								}),
								/* @__PURE__ */ (0, Y.jsxs)("details", {
									className: "sv-data-table",
									children: [/* @__PURE__ */ (0, Y.jsx)("summary", { children: "Consultar dados do gráfico" }), /* @__PURE__ */ (0, Y.jsxs)("table", { children: [
										/* @__PURE__ */ (0, Y.jsx)("caption", { children: "Valores ilustrativos por semana" }),
										/* @__PURE__ */ (0, Y.jsx)("thead", { children: /* @__PURE__ */ (0, Y.jsxs)("tr", { children: [/* @__PURE__ */ (0, Y.jsx)("th", { children: "Semana" }), /* @__PURE__ */ (0, Y.jsx)("th", { children: "Propostas" })] }) }),
										/* @__PURE__ */ (0, Y.jsx)("tbody", { children: l.values.map((e, t) => /* @__PURE__ */ (0, Y.jsxs)("tr", { children: [/* @__PURE__ */ (0, Y.jsx)("td", { children: t + 1 }), /* @__PURE__ */ (0, Y.jsx)("td", { children: e })] }, t)) })
									] })]
								})
							]
						}),
						/* @__PURE__ */ (0, Y.jsxs)("div", {
							className: "sv-demo-detail-grid",
							children: [/* @__PURE__ */ (0, Y.jsxs)("section", {
								className: "sv-demo-comparison",
								"aria-label": u ? "Comparação ilustrativa de propostas" : "Revisões ilustrativas da proposta",
								children: [
									/* @__PURE__ */ (0, Y.jsx)("h4", { children: u ? "Condições em comparação" : "Versões da proposta" }),
									/* @__PURE__ */ (0, Y.jsx)("p", { children: "240 peças · usinagem CNC · valores de exemplo" }),
									/* @__PURE__ */ (0, Y.jsx)("ul", { children: c.quotes.map((e) => /* @__PURE__ */ (0, Y.jsxs)("li", { children: [/* @__PURE__ */ (0, Y.jsxs)("div", { children: [/* @__PURE__ */ (0, Y.jsx)("strong", { children: e.label }), /* @__PURE__ */ (0, Y.jsxs)("span", { children: [
										qS(e.amount),
										" ",
										/* @__PURE__ */ (0, Y.jsxs)("small", { children: [
											"· ",
											e.days,
											" dias"
										] })
									] })] }), /* @__PURE__ */ (0, Y.jsx)("span", {
										className: "sv-quote-track",
										"aria-hidden": "true",
										children: /* @__PURE__ */ (0, Y.jsx)(Ru.i, {
											initial: !1,
											animate: { width: `${e.amount / 24e3 * 100}%` },
											transition: { duration: o ? 0 : .5 }
										})
									})] }, e.label)) }),
									/* @__PURE__ */ (0, Y.jsx)("small", { children: u ? "Compare também frete e pagamento antes do aceite." : "Cada revisão mantém a versão anterior no histórico." })
								]
							}), /* @__PURE__ */ (0, Y.jsxs)("section", {
								className: "sv-demo-distribution",
								"aria-label": "Distribuição ilustrativa dos pedidos",
								children: [
									/* @__PURE__ */ (0, Y.jsx)("h4", { children: "Pedidos por etapa" }),
									/* @__PURE__ */ (0, Y.jsxs)("p", { children: [c.orders.length, " pedidos ilustrativos no período selecionado"] }),
									/* @__PURE__ */ (0, Y.jsx)("div", {
										className: "sv-stage-bar",
										"aria-hidden": "true",
										children: c.stages.map((e, t) => /* @__PURE__ */ (0, Y.jsx)(Ru.span, {
											style: { background: ZS[t] },
											animate: { flexBasis: `${e.count / c.orders.length * 100}%` },
											transition: { duration: o ? 0 : .5 }
										}, e.name))
									}),
									/* @__PURE__ */ (0, Y.jsx)("ul", { children: c.stages.map((e, t) => /* @__PURE__ */ (0, Y.jsxs)("li", { children: [/* @__PURE__ */ (0, Y.jsxs)("span", { children: [/* @__PURE__ */ (0, Y.jsx)("i", {
										"aria-hidden": "true",
										style: { background: ZS[t] }
									}), e.name] }), /* @__PURE__ */ (0, Y.jsx)("strong", { children: e.count })] }, e.name)) }),
									/* @__PURE__ */ (0, Y.jsx)("small", { children: "A distribuição acompanha o período e a atuação." })
								]
							})]
						}),
						/* @__PURE__ */ (0, Y.jsxs)("div", {
							className: "sv-demo-record",
							children: [
								/* @__PURE__ */ (0, Y.jsx)(_d, { size: 19 }),
								/* @__PURE__ */ (0, Y.jsxs)("div", { children: [/* @__PURE__ */ (0, Y.jsx)("strong", { children: "Uma referência para os dois lados" }), /* @__PURE__ */ (0, Y.jsx)("span", { children: "Especificações e condições registradas no pedido." })] }),
								/* @__PURE__ */ (0, Y.jsx)(sd, { size: 18 })
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, Y.jsxs)("div", {
				className: "sv-demo-foot",
				children: [/* @__PURE__ */ (0, Y.jsx)("span", { children: "Exemplo de uso: os números não representam atividade real do SIVI." }), /* @__PURE__ */ (0, Y.jsx)(rd, { size: 16 })]
			})
		]
	});
}
// src/public/platform.tsx
var $S = [
	[
		"Demanda",
		"Tudo começa com uma necessidade.",
		"Material, processo, quantidade e prazo. Reúna os requisitos por item para que a outra empresa saiba exatamente o que precisa atender.",
		"Comprador publica os requisitos.",
		"Fornecedor consulta as especificações.",
		"Requisitos técnicos por item"
	],
	[
		"Compatibilidade",
		"Capacidade encontra necessidade.",
		"Confira os critérios de compatibilidade entre a demanda e o perfil do fornecedor. O que precisa de confirmação permanece à vista.",
		"Confere os critérios e as pendências.",
		"Mantém seu perfil industrial atualizado.",
		"Critérios atendidos e pendentes"
	],
	[
		"Propostas",
		"Condições à vista. Decisão informada.",
		"Preço, prazo, frete e pagamento no mesmo contexto. Uma revisão cria uma nova versão e preserva a anterior.",
		"Compara e escolhe as condições.",
		"Prepara e revisa sua proposta.",
		"Histórico de versões da proposta"
	],
	[
		"Pedido",
		"O combinado vira referência.",
		"A proposta aceita dá origem ao pedido com os itens e as condições acordadas preservados para as duas empresas.",
		"Aceita a proposta e acompanha o pedido.",
		"Consulta o acordo para executar o fornecimento.",
		"Condições aceitas no pedido"
	],
	[
		"Inspeção",
		"Qualidade registrada por item.",
		"Registre plano, evidências e quantidades aprovadas. As pendências de qualidade precisam ser resolvidas antes da liberação.",
		"Acompanha os registros de qualidade.",
		"Registra a inspeção e os resultados.",
		"Plano e resultado da inspeção"
	],
	[
		"Expedição",
		"Saída registrada. Próximo destino: entrega.",
		"Após a liberação, o fornecedor registra a expedição. O pedido passa a aguardar a confirmação do recebimento.",
		"Acompanha a situação do pedido.",
		"Registra a saída após a liberação.",
		"Data e situação da expedição"
	],
	[
		"Recebimento",
		"Um acordo concluído. Um histórico disponível.",
		"Confirme a chegada dos itens e avalie o fornecimento. A negociação continua disponível para consulta.",
		"Confirma o recebimento e avalia.",
		"Consulta a confirmação e a avaliação.",
		"Recebimento e avaliação do fornecedor"
	]
];
function eC() {
	let [e, t] = (0, y.useState)(() => {
		let e = new URLSearchParams(location.hash.split("?")[1]), t = Number(e.get("etapa"));
		return Number.isInteger(t) && t > 0 && t <= $S.length ? t - 1 : 0;
	}), [n, r] = (0, y.useState)(!1), i = $S[e], a = String(e + 1).padStart(2, "0");
	return /* @__PURE__ */ (0, Y.jsxs)("section", {
		className: "sv-workflow sv-shell",
		"aria-labelledby": "funcionamento",
		children: [/* @__PURE__ */ (0, Y.jsxs)("div", {
			className: "sv-section-heading sv-display-heading",
			children: [/* @__PURE__ */ (0, Y.jsxs)("div", { children: [/* @__PURE__ */ (0, Y.jsx)("p", {
				className: "sv-landing-label",
				children: "Como funciona"
			}), /* @__PURE__ */ (0, Y.jsx)(Ux, {
				id: "funcionamento",
				tabIndex: -1,
				tag: "h2",
				text: "Da demanda à entrega.",
				splitType: "words",
				effect: "skew",
				delay: 85,
				duration: .75,
				textAlign: "left"
			})] }), /* @__PURE__ */ (0, Y.jsx)("p", {
				"data-landing-reveal": "fade",
				children: "As duas empresas acompanham o mesmo acordo. Explore o que acontece em cada momento."
			})]
		}), /* @__PURE__ */ (0, Y.jsxs)("div", {
			className: "sv-workflow-layout",
			"data-landing-reveal": "fade",
			children: [/* @__PURE__ */ (0, Y.jsx)("ol", {
				"aria-label": "Etapas da compra",
				children: $S.map(([n], i) => /* @__PURE__ */ (0, Y.jsx)("li", { children: /* @__PURE__ */ (0, Y.jsxs)("button", {
					"aria-pressed": e === i,
					"aria-controls": "sv-workflow-panel",
					onClick: () => {
						i !== e && (t(i), r(!0));
					},
					children: [n, /* @__PURE__ */ (0, Y.jsx)(rd, {
						size: 18,
						"aria-hidden": "true"
					})]
				}) }, n))
			}), /* @__PURE__ */ (0, Y.jsxs)("div", {
				id: "sv-workflow-panel",
				className: "sv-workflow-panel",
				"aria-live": "polite",
				children: [/* @__PURE__ */ (0, Y.jsxs)("div", {
					className: "sv-workflow-sample",
					"data-visual": !0,
					children: [
						/* @__PURE__ */ (0, Y.jsx)("span", { children: "PEDIDO 0248 · EXEMPLO" }),
						/* @__PURE__ */ (0, Y.jsxs)("span", {
							className: "sv-status",
							children: [/* @__PURE__ */ (0, Y.jsx)("i", {}), i[0]]
						}),
						/* @__PURE__ */ (0, Y.jsxs)("div", {
							className: "sv-record-sheet",
							children: [
								/* @__PURE__ */ (0, Y.jsxs)("div", { children: [
									/* @__PURE__ */ (0, Y.jsx)(_d, { size: 24 }),
									/* @__PURE__ */ (0, Y.jsxs)("span", { children: [
										"Peça de conexão",
										/* @__PURE__ */ (0, Y.jsx)("br", {}),
										/* @__PURE__ */ (0, Y.jsx)("strong", { children: "Alumínio 6061" })
									] }),
									/* @__PURE__ */ (0, Y.jsxs)("strong", { children: ["240 ", /* @__PURE__ */ (0, Y.jsx)("small", { children: "un." })] })
								] }),
								/* @__PURE__ */ (0, Y.jsxs)("div", { children: [/* @__PURE__ */ (0, Y.jsxs)("span", { children: ["Material definido ", /* @__PURE__ */ (0, Y.jsx)(sd, { size: 14 })] }), /* @__PURE__ */ (0, Y.jsxs)("span", { children: ["Processo: CNC ", /* @__PURE__ */ (0, Y.jsx)(sd, { size: 14 })] })] }),
								/* @__PURE__ */ (0, Y.jsxs)("div", {
									className: "sv-stage-record t-panel-enter",
									children: [/* @__PURE__ */ (0, Y.jsx)("small", { children: "REGISTRO EM DESTAQUE" }), /* @__PURE__ */ (0, Y.jsx)("p", { children: i[5] })]
								}, a)
							]
						})
					]
				}), /* @__PURE__ */ (0, Y.jsxs)("div", {
					className: "sv-workflow-copy",
					children: [
						/* @__PURE__ */ (0, Y.jsxs)("p", {
							className: "sv-eyebrow",
							children: [
								"Etapa",
								" ",
								/* @__PURE__ */ (0, Y.jsx)("span", {
									className: "sr-only",
									children: a
								}),
								/* @__PURE__ */ (0, Y.jsx)("span", {
									"aria-hidden": "true",
									className: `t-digit-group${n ? " is-animating" : ""}`,
									children: [...a].map((e, t) => /* @__PURE__ */ (0, Y.jsx)("span", {
										className: "t-digit",
										"data-stagger": t,
										children: e
									}, t))
								}, a),
								" ",
								"/ ",
								String($S.length).padStart(2, "0")
							]
						}),
						/* @__PURE__ */ (0, Y.jsx)("h3", {
							className: "sv-stage-record t-panel-enter",
							children: i[1]
						}, `title-${a}`),
						/* @__PURE__ */ (0, Y.jsx)("p", {
							className: "sv-stage-record t-panel-enter",
							children: i[2]
						}, `copy-${a}`),
						/* @__PURE__ */ (0, Y.jsxs)("dl", {
							className: "sv-stage-record t-panel-enter",
							children: [/* @__PURE__ */ (0, Y.jsxs)("div", { children: [/* @__PURE__ */ (0, Y.jsx)("dt", { children: "Comprador" }), /* @__PURE__ */ (0, Y.jsx)("dd", { children: i[3] })] }), /* @__PURE__ */ (0, Y.jsxs)("div", { children: [/* @__PURE__ */ (0, Y.jsx)("dt", { children: "Fornecedor" }), /* @__PURE__ */ (0, Y.jsx)("dd", { children: i[4] })] })]
						}, `roles-${a}`)
					]
				})]
			})]
		})]
	});
}
function tC() {
	let e = YS("90").quotes;
	return /* @__PURE__ */ (0, Y.jsx)("section", {
		className: "sv-solutions",
		"aria-labelledby": "solucoes-title",
		children: /* @__PURE__ */ (0, Y.jsxs)("div", {
			className: "sv-shell",
			children: [/* @__PURE__ */ (0, Y.jsxs)("div", {
				className: "sv-display-heading sv-display-heading--center",
				children: [/* @__PURE__ */ (0, Y.jsx)("p", {
					className: "sv-landing-label",
					children: "Soluções"
				}), /* @__PURE__ */ (0, Y.jsx)("h2", {
					id: "solucoes-title",
					children: "Dois lados da mesma compra."
				})]
			}), /* @__PURE__ */ (0, Y.jsxs)("div", {
				className: "sv-solution-list",
				children: [
					/* @__PURE__ */ (0, Y.jsxs)("article", {
						className: "sv-solution",
						children: [/* @__PURE__ */ (0, Y.jsxs)("div", {
							className: "sv-solution-copy",
							children: [
								/* @__PURE__ */ (0, Y.jsx)("h3", {
									id: "compras",
									tabIndex: -1,
									children: "Para compradores"
								}),
								/* @__PURE__ */ (0, Y.jsx)("p", { children: "Publique sua demanda com requisitos por item e compare as condições antes de fechar o pedido." }),
								/* @__PURE__ */ (0, Y.jsxs)("ul", { children: [
									/* @__PURE__ */ (0, Y.jsxs)("li", { children: [/* @__PURE__ */ (0, Y.jsx)(sd, { "aria-hidden": "true" }), " Compatibilidade com os requisitos da compra"] }),
									/* @__PURE__ */ (0, Y.jsxs)("li", { children: [/* @__PURE__ */ (0, Y.jsx)(sd, { "aria-hidden": "true" }), " Comparação de preço, prazo, frete e pagamento"] }),
									/* @__PURE__ */ (0, Y.jsxs)("li", { children: [/* @__PURE__ */ (0, Y.jsx)(sd, { "aria-hidden": "true" }), " Acompanhamento até o recebimento e a avaliação"] })
								] }),
								/* @__PURE__ */ (0, Y.jsx)(Jd, {
									href: Ud("buyer"),
									children: "Cadastrar como comprador"
								})
							]
						}), /* @__PURE__ */ (0, Y.jsx)("div", {
							className: "sv-solution-visual sv-quote-visual",
							"data-landing-reveal": "lift",
							"data-landing-pointer": "tilt",
							children: /* @__PURE__ */ (0, Y.jsxs)("div", {
								className: "sv-quote",
								children: [
									/* @__PURE__ */ (0, Y.jsxs)("div", {
										className: "sv-quote-heading",
										children: [/* @__PURE__ */ (0, Y.jsxs)("span", { children: [/* @__PURE__ */ (0, Y.jsx)(_d, {
											size: 17,
											"aria-hidden": "true"
										}), " Compras / Propostas"] }), /* @__PURE__ */ (0, Y.jsx)("small", { children: "Exemplo" })]
									}),
									/* @__PURE__ */ (0, Y.jsx)("strong", { children: "Peça de conexão" }),
									/* @__PURE__ */ (0, Y.jsx)("p", { children: "Alumínio 6061 · Usinagem CNC · 240 peças" }),
									/* @__PURE__ */ (0, Y.jsxs)("table", {
										"aria-label": "Exemplo de comparação de propostas",
										children: [/* @__PURE__ */ (0, Y.jsx)("thead", { children: /* @__PURE__ */ (0, Y.jsxs)("tr", { children: [
											/* @__PURE__ */ (0, Y.jsx)("th", {
												scope: "col",
												children: "Proposta"
											}),
											/* @__PURE__ */ (0, Y.jsx)("th", {
												scope: "col",
												children: "Valor"
											}),
											/* @__PURE__ */ (0, Y.jsx)("th", {
												scope: "col",
												children: "Prazo"
											})
										] }) }), /* @__PURE__ */ (0, Y.jsx)("tbody", { children: e.map(({ label: e, amount: t, days: n }) => /* @__PURE__ */ (0, Y.jsxs)("tr", { children: [
											/* @__PURE__ */ (0, Y.jsx)("th", {
												scope: "row",
												children: e
											}),
											/* @__PURE__ */ (0, Y.jsx)("td", { children: qS(t) }),
											/* @__PURE__ */ (0, Y.jsxs)("td", { children: [n, " dias"] })
										] }, e)) })]
									})
								]
							})
						})]
					}),
					/* @__PURE__ */ (0, Y.jsxs)("article", {
						className: "sv-solution sv-solution--reverse",
						children: [/* @__PURE__ */ (0, Y.jsxs)("div", {
							className: "sv-solution-copy",
							children: [
								/* @__PURE__ */ (0, Y.jsx)("h3", {
									id: "fornecimento",
									tabIndex: -1,
									children: "Para fornecedores"
								}),
								/* @__PURE__ */ (0, Y.jsx)("p", { children: "Apresente sua capacidade industrial, encontre demandas compatíveis e acompanhe o fornecimento." }),
								/* @__PURE__ */ (0, Y.jsxs)("ul", { children: [
									/* @__PURE__ */ (0, Y.jsxs)("li", { children: [/* @__PURE__ */ (0, Y.jsx)(sd, { "aria-hidden": "true" }), " Perfil com materiais, processos e regiões"] }),
									/* @__PURE__ */ (0, Y.jsxs)("li", { children: [/* @__PURE__ */ (0, Y.jsx)(sd, { "aria-hidden": "true" }), " Propostas com histórico de revisões"] }),
									/* @__PURE__ */ (0, Y.jsxs)("li", { children: [/* @__PURE__ */ (0, Y.jsx)(sd, { "aria-hidden": "true" }), " Registros de inspeção e expedição"] })
								] }),
								/* @__PURE__ */ (0, Y.jsx)(Jd, {
									href: Ud("supplier"),
									children: "Cadastrar como fornecedor"
								})
							]
						}), /* @__PURE__ */ (0, Y.jsx)("div", {
							className: "sv-solution-visual sv-solution-photo",
							"data-landing-reveal": "curtain",
							"data-landing-pointer": "photo",
							children: /* @__PURE__ */ (0, Y.jsx)("img", {
								src: "./assets/detalhe-torno.jpg",
								alt: "Detalhe de uma ferramenta de usinagem",
								loading: "lazy",
								width: "960",
								height: "640"
							})
						})]
					}),
					/* @__PURE__ */ (0, Y.jsxs)("article", {
						className: "sv-solution",
						children: [/* @__PURE__ */ (0, Y.jsxs)("div", {
							className: "sv-solution-copy",
							children: [
								/* @__PURE__ */ (0, Y.jsx)("h3", { children: "Um pedido para as duas empresas" }),
								/* @__PURE__ */ (0, Y.jsx)("p", { children: "O aceite transforma a proposta em pedido. As duas empresas consultam os mesmos itens, valores e condições durante o fornecimento." }),
								/* @__PURE__ */ (0, Y.jsxs)("ul", { children: [
									/* @__PURE__ */ (0, Y.jsxs)("li", { children: [/* @__PURE__ */ (0, Y.jsx)(sd, { "aria-hidden": "true" }), " Inspeção e liberação antes da expedição"] }),
									/* @__PURE__ */ (0, Y.jsxs)("li", { children: [/* @__PURE__ */ (0, Y.jsx)(sd, { "aria-hidden": "true" }), " Registro da saída pelo fornecedor"] }),
									/* @__PURE__ */ (0, Y.jsxs)("li", { children: [/* @__PURE__ */ (0, Y.jsx)(sd, { "aria-hidden": "true" }), " Confirmação de recebimento pelo comprador"] })
								] }),
								/* @__PURE__ */ (0, Y.jsx)(Jd, {
									href: Vd(4),
									children: "Ver a etapa do pedido"
								})
							]
						}), /* @__PURE__ */ (0, Y.jsx)("div", {
							className: "sv-solution-visual sv-quote-visual",
							"data-landing-reveal": "lift",
							children: /* @__PURE__ */ (0, Y.jsx)(of, { example: af[3] })
						})]
					})
				]
			})]
		})
	});
}
var nC = [
	{
		step: 1,
		Icon: _d,
		label: "Especificar materiais"
	},
	{
		step: 2,
		Icon: Td,
		label: "Conferir compatibilidade"
	},
	{
		step: 3,
		Icon: yd,
		label: "Comparar propostas"
	},
	{
		step: 5,
		Icon: dd,
		label: "Registrar inspeção"
	},
	{
		step: 6,
		Icon: jd,
		label: "Acompanhar expedição"
	},
	{
		step: 7,
		Icon: Cd,
		label: "Confirmar recebimento"
	}
];
function rC() {
	return /* @__PURE__ */ (0, Y.jsx)("section", {
		className: "sv-purchase-actions",
		"aria-labelledby": "recursos-title",
		children: /* @__PURE__ */ (0, Y.jsxs)("div", {
			className: "sv-shell",
			children: [/* @__PURE__ */ (0, Y.jsx)("div", {
				className: "sv-display-heading",
				children: /* @__PURE__ */ (0, Y.jsx)("h2", {
					id: "recursos-title",
					children: "O que você pode fazer no SIVI."
				})
			}), /* @__PURE__ */ (0, Y.jsx)("ul", {
				className: "sv-purchase-grid",
				"data-landing-reveal": "fade",
				children: nC.map(({ step: e, Icon: t, label: n }) => /* @__PURE__ */ (0, Y.jsx)("li", { children: /* @__PURE__ */ (0, Y.jsxs)("a", {
					href: Vd(e),
					children: [
						/* @__PURE__ */ (0, Y.jsx)(t, { "aria-hidden": "true" }),
						/* @__PURE__ */ (0, Y.jsx)("span", { children: n }),
						/* @__PURE__ */ (0, Y.jsx)(Kd, {})
					]
				}) }, e))
			})]
		})
	});
}
function iC() {
	return /* @__PURE__ */ (0, Y.jsxs)(mf, {
		page: "platform",
		children: [
			/* @__PURE__ */ (0, Y.jsx)("section", {
				className: "sv-page-banner",
				children: /* @__PURE__ */ (0, Y.jsxs)("div", {
					className: "sv-shell sv-display-heading",
					children: [
						/* @__PURE__ */ (0, Y.jsx)("h1", {
							id: "public-title",
							tabIndex: -1,
							children: "Plataforma industrial"
						}),
						/* @__PURE__ */ (0, Y.jsx)("p", { children: "Publique demandas, compare propostas e acompanhe pedidos. Cada empresa vê o que precisa fazer em sua etapa da compra." }),
						/* @__PURE__ */ (0, Y.jsx)(Jd, {
							href: Bd("funcionamento"),
							children: "Ver as etapas da compra"
						})
					]
				})
			}),
			/* @__PURE__ */ (0, Y.jsx)(tC, {}),
			/* @__PURE__ */ (0, Y.jsx)("section", {
				className: "sv-platform",
				"aria-labelledby": "plataforma-title",
				children: /* @__PURE__ */ (0, Y.jsxs)("div", {
					className: "sv-shell",
					children: [/* @__PURE__ */ (0, Y.jsxs)("div", {
						className: "sv-display-heading",
						children: [
							/* @__PURE__ */ (0, Y.jsx)("p", {
								className: "sv-landing-label",
								children: "Demonstração"
							}),
							/* @__PURE__ */ (0, Y.jsx)("h2", {
								id: "plataforma-title",
								children: "A plataforma por dentro."
							}),
							/* @__PURE__ */ (0, Y.jsx)("p", {
								"data-landing-reveal": "fade",
								children: "Alterne entre Comprador e Fornecedor para explorar como cada empresa acompanha propostas e pedidos."
							})
						]
					}), /* @__PURE__ */ (0, Y.jsx)("div", {
						"data-landing-reveal": "fade",
						children: /* @__PURE__ */ (0, Y.jsx)(QS, {})
					})]
				})
			}),
			/* @__PURE__ */ (0, Y.jsx)(eC, {}),
			/* @__PURE__ */ (0, Y.jsx)(rC, {}),
			/* @__PURE__ */ (0, Y.jsx)("section", {
				className: "sv-agreement",
				"aria-labelledby": "historico-title",
				children: /* @__PURE__ */ (0, Y.jsxs)("div", {
					className: "sv-shell",
					children: [/* @__PURE__ */ (0, Y.jsxs)("div", {
						className: "sv-display-heading",
						children: [
							/* @__PURE__ */ (0, Y.jsx)("h2", {
								id: "historico-title",
								children: "O acordo fica registrado."
							}),
							/* @__PURE__ */ (0, Y.jsx)("p", {
								"data-landing-reveal": "fade",
								children: "Consulte o histórico de propostas, condições aceitas e registros do pedido durante a compra."
							}),
							/* @__PURE__ */ (0, Y.jsxs)("a", {
								className: "sv-text-link",
								href: Hd("seguranca"),
								children: ["Como o SIVI trata os dados ", /* @__PURE__ */ (0, Y.jsx)(Kd, {})]
							})
						]
					}), /* @__PURE__ */ (0, Y.jsxs)("dl", { children: [
						/* @__PURE__ */ (0, Y.jsxs)("div", { children: [/* @__PURE__ */ (0, Y.jsx)("dt", { children: "Etapas da compra" }), /* @__PURE__ */ (0, Y.jsx)("dd", {
							"data-landing-reveal": "number",
							children: String($S.length).padStart(2, "0")
						})] }),
						/* @__PURE__ */ (0, Y.jsxs)("div", { children: [/* @__PURE__ */ (0, Y.jsx)("dt", { children: "Formas de atuação" }), /* @__PURE__ */ (0, Y.jsx)("dd", {
							"data-landing-reveal": "number",
							children: "02"
						})] }),
						/* @__PURE__ */ (0, Y.jsxs)("div", { children: [/* @__PURE__ */ (0, Y.jsx)("dt", { children: "Histórico por pedido" }), /* @__PURE__ */ (0, Y.jsx)("dd", {
							"data-landing-reveal": "number",
							children: "01"
						})] })
					] })]
				})
			}),
			/* @__PURE__ */ (0, Y.jsx)("section", {
				className: "sv-home-agreement sv-home-agreement--dark",
				"aria-labelledby": "plataforma-exemplos",
				children: /* @__PURE__ */ (0, Y.jsxs)("div", {
					className: "sv-shell sv-display-heading",
					children: [
						/* @__PURE__ */ (0, Y.jsx)("h2", {
							id: "plataforma-exemplos",
							children: "Veja os registros em uma compra."
						}),
						/* @__PURE__ */ (0, Y.jsx)("p", { children: "Os casos de uso mostram o que cada empresa faz e o que fica disponível para consulta em cada etapa." }),
						/* @__PURE__ */ (0, Y.jsx)(Jd, {
							href: Ld("cases"),
							children: "Explorar casos de uso"
						})
					]
				})
			})
		]
	});
}
// src/public/site-pages.tsx
var aC = [
	{
		Icon: _d,
		title: "Requisitos por item",
		description: "Cada fornecedor consulta o que foi especificado para a peça ou o material que vai cotar."
	},
	{
		Icon: yd,
		title: "Versões consultáveis",
		description: "As revisões da proposta formam um histórico. O pedido preserva a versão aceita."
	},
	{
		Icon: dd,
		title: "Responsabilidade por etapa",
		description: "Quem fornece registra a inspeção e a expedição. Quem compra confirma o recebimento."
	},
	{
		Icon: Dd,
		title: "Acesso por empresa",
		description: "A confirmação do e-mail e a análise do cadastro precedem o acesso operacional."
	}
];
function oC() {
	return /* @__PURE__ */ (0, Y.jsxs)(mf, {
		page: "about",
		children: [
			/* @__PURE__ */ (0, Y.jsx)("section", {
				className: "sv-page-banner",
				children: /* @__PURE__ */ (0, Y.jsxs)("div", {
					className: "sv-shell sv-page-split",
					children: [/* @__PURE__ */ (0, Y.jsxs)("div", {
						className: "sv-display-heading",
						children: [
							/* @__PURE__ */ (0, Y.jsx)("h1", {
								id: "public-title",
								tabIndex: -1,
								children: "Quem somos"
							}),
							/* @__PURE__ */ (0, Y.jsx)("p", { children: "Somos o Sistema Integrado de Vendas Industriais. Reunimos compradores e fornecedores em um só lugar para organizar as condições da compra e acompanhar o pedido até a entrega." }),
							/* @__PURE__ */ (0, Y.jsx)(Jd, {
								href: Ld("platform"),
								children: "Conhecer a plataforma"
							})
						]
					}), /* @__PURE__ */ (0, Y.jsx)("video", {
						className: "sv-about-video",
						controls: !0,
						playsInline: !0,
						preload: "none",
						poster: "./assets/cnc-lathe-poster.jpg",
						muted: !0,
						"aria-label": "Vídeo de uma operação de usinagem CNC",
						children: /* @__PURE__ */ (0, Y.jsx)("source", {
							src: "./assets/cnc-lathe.webm",
							type: "video/webm"
						})
					})]
				})
			}),
			/* @__PURE__ */ (0, Y.jsx)("section", {
				className: "sv-about-purpose",
				"aria-labelledby": "visao-geral",
				children: /* @__PURE__ */ (0, Y.jsxs)("div", {
					className: "sv-shell sv-about-details",
					children: [
						/* @__PURE__ */ (0, Y.jsxs)("div", {
							className: "sv-display-heading",
							children: [/* @__PURE__ */ (0, Y.jsx)(Ux, {
								id: "visao-geral",
								tabIndex: -1,
								tag: "h2",
								text: "Quem compra encontra quem fabrica.",
								splitType: "words",
								effect: "flip",
								delay: 85,
								duration: .85,
								textAlign: "left"
							}), /* @__PURE__ */ (0, Y.jsx)("p", { children: "O SIVI organiza a negociação e os registros. Fabricação, transporte e pagamento são combinados entre as empresas." })]
						}),
						/* @__PURE__ */ (0, Y.jsx)("img", {
							className: "sv-purpose-mark",
							src: "./src/assets/brand/raposa.svg",
							width: "160",
							height: "160",
							alt: ""
						}),
						/* @__PURE__ */ (0, Y.jsxs)("dl", { children: [
							/* @__PURE__ */ (0, Y.jsxs)("div", {
								"data-landing-reveal": "fade",
								children: [/* @__PURE__ */ (0, Y.jsx)("dt", { children: "Por que existe" }), /* @__PURE__ */ (0, Y.jsx)("dd", { children: "Uma compra industrial depende de especificações que vão além de preço e quantidade. As duas partes precisam trabalhar com os mesmos requisitos." })]
							}),
							/* @__PURE__ */ (0, Y.jsxs)("div", {
								"data-landing-reveal": "fade",
								children: [/* @__PURE__ */ (0, Y.jsx)("dt", { children: "Como funciona" }), /* @__PURE__ */ (0, Y.jsx)("dd", { children: "O comprador descreve os requisitos e compara propostas. O fornecedor apresenta sua capacidade e registra o que foi acordado." })]
							}),
							/* @__PURE__ */ (0, Y.jsxs)("div", {
								"data-landing-reveal": "fade",
								children: [/* @__PURE__ */ (0, Y.jsx)("dt", { children: "O que fica registrado" }), /* @__PURE__ */ (0, Y.jsx)("dd", { children: "As propostas e suas versões, as condições aceitas e o andamento do pedido até o recebimento e a avaliação." })]
							})
						] })
					]
				})
			}),
			/* @__PURE__ */ (0, Y.jsx)("section", {
				className: "sv-about-audiences",
				"aria-labelledby": "quem-usa",
				children: /* @__PURE__ */ (0, Y.jsxs)("div", {
					className: "sv-shell",
					children: [/* @__PURE__ */ (0, Y.jsx)("div", {
						className: "sv-display-heading sv-display-heading--center",
						children: /* @__PURE__ */ (0, Y.jsx)("h2", {
							id: "quem-usa",
							children: "Quem usa o SIVI."
						})
					}), /* @__PURE__ */ (0, Y.jsxs)("div", {
						className: "sv-audience-grid",
						children: [/* @__PURE__ */ (0, Y.jsxs)("article", { children: [
							/* @__PURE__ */ (0, Y.jsx)("img", {
								src: "./assets/operador-torno.jpg",
								"data-landing-reveal": "curtain",
								alt: "Operador conferindo uma operação de usinagem",
								loading: "lazy",
								width: "960",
								height: "640"
							}),
							/* @__PURE__ */ (0, Y.jsx)("h3", { children: "Empresas compradoras" }),
							/* @__PURE__ */ (0, Y.jsx)("p", { children: "Equipes que precisam descrever peças, materiais ou serviços, comparar cotações e acompanhar o que foi combinado até o recebimento." }),
							/* @__PURE__ */ (0, Y.jsxs)("a", {
								className: "sv-text-link",
								href: Bd("compras"),
								children: ["Ver como funciona para compras ", /* @__PURE__ */ (0, Y.jsx)(Kd, {})]
							})
						] }), /* @__PURE__ */ (0, Y.jsxs)("article", { children: [
							/* @__PURE__ */ (0, Y.jsx)("img", {
								src: "./assets/detalhe-torno.jpg",
								"data-landing-reveal": "curtain",
								alt: "Detalhe de uma máquina de usinagem",
								loading: "lazy",
								width: "960",
								height: "640"
							}),
							/* @__PURE__ */ (0, Y.jsx)("h3", { children: "Empresas fornecedoras" }),
							/* @__PURE__ */ (0, Y.jsx)("p", { children: "Empresas que apresentam seus materiais, processos e regiões atendidas, cotam demandas e registram o andamento do fornecimento." }),
							/* @__PURE__ */ (0, Y.jsxs)("a", {
								className: "sv-text-link",
								href: Bd("fornecimento"),
								children: ["Ver como funciona para fornecimento ", /* @__PURE__ */ (0, Y.jsx)(Kd, {})]
							})
						] })]
					})]
				})
			}),
			/* @__PURE__ */ (0, Y.jsx)("section", {
				className: "sv-account-journey",
				"aria-labelledby": "conta-operacao",
				children: /* @__PURE__ */ (0, Y.jsxs)("div", {
					className: "sv-shell",
					children: [
						/* @__PURE__ */ (0, Y.jsxs)("div", {
							className: "sv-display-heading",
							children: [/* @__PURE__ */ (0, Y.jsx)("h2", {
								id: "conta-operacao",
								children: "Da conta ao acesso da empresa."
							}), /* @__PURE__ */ (0, Y.jsx)("p", { children: "Uma empresa pode comprar, fornecer ou exercer as duas atuações." })]
						}),
						/* @__PURE__ */ (0, Y.jsxs)("ol", { children: [
							/* @__PURE__ */ (0, Y.jsxs)("li", { children: [/* @__PURE__ */ (0, Y.jsx)("strong", { children: "Confirme seu e-mail." }), /* @__PURE__ */ (0, Y.jsx)("p", { children: "Use o link enviado para validar a sua conta pessoal." })] }),
							/* @__PURE__ */ (0, Y.jsxs)("li", { children: [/* @__PURE__ */ (0, Y.jsx)("strong", { children: "Apresente a empresa." }), /* @__PURE__ */ (0, Y.jsx)("p", { children: "Informe os dados empresariais e escolha como ela vai atuar." })] }),
							/* @__PURE__ */ (0, Y.jsxs)("li", { children: [/* @__PURE__ */ (0, Y.jsx)("strong", { children: "Acompanhe a análise." }), /* @__PURE__ */ (0, Y.jsx)("p", { children: "Consulte o cadastro e responda a eventuais pedidos de correção." })] })
						] }),
						/* @__PURE__ */ (0, Y.jsx)(Jd, {
							href: Ld("faq"),
							children: "Entender o cadastro"
						})
					]
				})
			}),
			/* @__PURE__ */ (0, Y.jsx)("section", {
				className: "sv-about-principles",
				"aria-labelledby": "principios",
				children: /* @__PURE__ */ (0, Y.jsxs)("div", {
					className: "sv-shell",
					children: [
						/* @__PURE__ */ (0, Y.jsx)("div", {
							className: "sv-display-heading sv-display-heading--center",
							children: /* @__PURE__ */ (0, Y.jsx)("h2", {
								id: "principios",
								children: "Princípios da plataforma."
							})
						}),
						/* @__PURE__ */ (0, Y.jsx)("div", {
							className: "sv-principle-grid",
							children: aC.map(({ Icon: e, title: t, description: n }) => /* @__PURE__ */ (0, Y.jsxs)("article", {
								"data-landing-reveal": "fade",
								children: [
									/* @__PURE__ */ (0, Y.jsx)(e, { "aria-hidden": "true" }),
									/* @__PURE__ */ (0, Y.jsx)("h3", { children: t }),
									/* @__PURE__ */ (0, Y.jsx)("p", { children: n })
								]
							}, t))
						}),
						/* @__PURE__ */ (0, Y.jsx)(Jd, {
							href: Ld("cases"),
							children: "Ver os princípios em exemplos"
						})
					]
				})
			})
		]
	});
}
function sC() {
	return /* @__PURE__ */ (0, Y.jsxs)(mf, {
		page: "cases",
		lightHeader: !0,
		children: [
			/* @__PURE__ */ (0, Y.jsx)("section", {
				className: "sv-page-banner sv-page-banner--light sv-page-banner--center",
				children: /* @__PURE__ */ (0, Y.jsxs)("div", {
					className: "sv-shell sv-display-heading",
					children: [
						/* @__PURE__ */ (0, Y.jsx)("h1", {
							id: "public-title",
							tabIndex: -1,
							children: "Casos de uso"
						}),
						/* @__PURE__ */ (0, Y.jsx)("p", { children: "Acompanhe uma compra ilustrativa de 240 peças, da primeira especificação à confirmação do recebimento." }),
						/* @__PURE__ */ (0, Y.jsx)("nav", {
							className: "sv-section-index",
							"aria-label": "Casos nesta página",
							children: af.map(({ id: e, title: t }) => /* @__PURE__ */ (0, Y.jsx)("a", {
								href: Rd("cases", e),
								children: t
							}, e))
						})
					]
				})
			}),
			/* @__PURE__ */ (0, Y.jsx)("div", {
				className: "sv-shell sv-cases-list",
				children: af.map((e) => /* @__PURE__ */ (0, Y.jsxs)("article", {
					className: "sv-example-entry sv-case-row",
					children: [/* @__PURE__ */ (0, Y.jsxs)("div", {
						className: "sv-case-body sv-display-heading",
						children: [
							/* @__PURE__ */ (0, Y.jsx)("h2", {
								id: e.id,
								tabIndex: -1,
								children: e.title
							}),
							/* @__PURE__ */ (0, Y.jsx)("p", { children: e.context }),
							/* @__PURE__ */ (0, Y.jsxs)("dl", { children: [/* @__PURE__ */ (0, Y.jsxs)("div", { children: [/* @__PURE__ */ (0, Y.jsx)("dt", { children: "Como usar o SIVI" }), /* @__PURE__ */ (0, Y.jsx)("dd", { children: e.walkthrough })] }), /* @__PURE__ */ (0, Y.jsxs)("div", { children: [/* @__PURE__ */ (0, Y.jsx)("dt", { children: "O que fica registrado" }), /* @__PURE__ */ (0, Y.jsx)("dd", { children: e.record })] })] }),
							/* @__PURE__ */ (0, Y.jsxs)(Jd, {
								href: Vd(e.step),
								className: "sv-case-action",
								children: ["Explorar etapa", /* @__PURE__ */ (0, Y.jsxs)("span", {
									className: "sr-only",
									children: [" de ", e.title.toLowerCase()]
								})]
							})
						]
					}), /* @__PURE__ */ (0, Y.jsx)("div", {
						className: "sv-example-art",
						"data-landing-reveal": "record",
						children: /* @__PURE__ */ (0, Y.jsx)(of, { example: e })
					})]
				}, e.id))
			}),
			/* @__PURE__ */ (0, Y.jsx)("section", {
				className: "sv-home-agreement sv-home-agreement--dark",
				"aria-labelledby": "casos-jornada",
				children: /* @__PURE__ */ (0, Y.jsxs)("div", {
					className: "sv-shell sv-display-heading",
					children: [
						/* @__PURE__ */ (0, Y.jsx)("h2", {
							id: "casos-jornada",
							children: "Veja a jornada completa."
						}),
						/* @__PURE__ */ (0, Y.jsx)("p", { children: "Explore os sete passos da compra e confira o papel de cada empresa em cada etapa." }),
						/* @__PURE__ */ (0, Y.jsx)(Jd, {
							href: Bd("funcionamento"),
							children: "Abrir a jornada de compra"
						})
					]
				})
			})
		]
	});
}
var cC = [{
	id: "duvidas-cadastro",
	title: "Cadastro e acesso",
	questions: [
		["Quem pode usar o SIVI?", "Responsáveis por empresas compradoras ou fornecedoras do setor industrial. Crie uma conta, informe o nome e a atuação da empresa e envie o cadastro para análise."],
		["Minha empresa pode comprar e fornecer?", "Sim. Selecione Compradora e fornecedora no campo Atuação da empresa. Depois da aprovação, você poderá alternar entre os dois contextos."],
		["O que acontece depois do cadastro?", "Confirme o e-mail pelo link recebido e entre na conta. Revise os dados empresariais para enviá-los à análise. No mesmo navegador, o rascunho pode ser retomado por até sete dias."],
		["Onde acompanho a aprovação?", "Em Empresas e atuação, use Atualizar situação e Consultar cadastro. Se houver correção solicitada, leia o motivo, ajuste os dados e reenvie."],
		["Quais dados preciso informar?", "O cadastro da conta pede os dados pessoais. Para a empresa, informe o nome e a atuação. CNPJ, cidade, UF e contato são dados complementares opcionais."],
		["Posso mudar a atuação escolhida no cadastro?", "Sim. Antes de criar a conta, revise a atuação na etapa Apresente sua empresa."],
		["Esqueci a senha. Como recupero o acesso?", "Na tela Entrar, selecione Esqueci minha senha, informe o e-mail da conta e verifique a caixa de entrada e o spam."]
	]
}, {
	id: "duvidas-compras",
	title: "Compra e fornecimento",
	questions: [
		["Como sei se um fornecedor atende à demanda?", "Consulte na demanda os critérios comparados com o perfil do fornecedor, como materiais e processos. Verifique diretamente com a empresa os critérios que ainda precisam de confirmação."],
		["O que acontece quando uma proposta é revisada?", "Cada revisão fica disponível no histórico. Ao aceitar a proposta, o comprador gera um pedido com os itens e condições da versão aceita."],
		["Qual é o próximo passo antes da expedição?", "O fornecedor registra a inspeção por item e resolve eventuais pendências para liberar o pedido. Em seguida pode registrar a expedição."],
		["Quem fabrica, entrega e recebe o pagamento dos pedidos?", "O fornecedor é responsável pela fabricação ou fornecimento. As empresas negociam entrega e pagamento entre si. O SIVI organiza a negociação e seus registros."],
		["Onde consulto o que foi combinado?", "Abra o pedido para consultar os itens, as condições aceitas e os registros vinculados à compra, de acordo com as permissões da sua empresa."]
	]
}];
function lC() {
	return /* @__PURE__ */ (0, Y.jsxs)(mf, {
		page: "faq",
		lightHeader: !0,
		children: [
			/* @__PURE__ */ (0, Y.jsx)("section", {
				className: "sv-page-banner sv-page-banner--light",
				children: /* @__PURE__ */ (0, Y.jsxs)("div", {
					className: "sv-shell sv-display-heading",
					children: [
						/* @__PURE__ */ (0, Y.jsx)("h1", {
							id: "public-title",
							tabIndex: -1,
							children: "Dúvidas"
						}),
						/* @__PURE__ */ (0, Y.jsx)("p", { children: "Encontre orientações para cadastrar a empresa, recuperar o acesso e acompanhar uma compra no SIVI." }),
						/* @__PURE__ */ (0, Y.jsx)("nav", {
							className: "sv-section-index",
							"aria-label": "Temas de ajuda",
							children: cC.map(({ id: e, title: t }) => /* @__PURE__ */ (0, Y.jsx)("a", {
								href: Rd("faq", e),
								children: t
							}, e))
						})
					]
				})
			}),
			/* @__PURE__ */ (0, Y.jsxs)("section", {
				className: "sv-faq sv-shell sv-faq-page",
				"aria-labelledby": "duvidas",
				children: [/* @__PURE__ */ (0, Y.jsxs)("div", {
					className: "sv-display-heading",
					children: [/* @__PURE__ */ (0, Y.jsx)("h2", {
						id: "duvidas",
						tabIndex: -1,
						children: "Perguntas frequentes."
					}), /* @__PURE__ */ (0, Y.jsxs)("a", {
						className: "sv-text-link",
						href: Hd("ajuda"),
						children: ["Ver orientações de acesso ", /* @__PURE__ */ (0, Y.jsx)(Kd, {})]
					})]
				}), /* @__PURE__ */ (0, Y.jsx)("div", {
					className: "sv-faq-topics",
					children: cC.map(({ id: e, title: t, questions: n }) => /* @__PURE__ */ (0, Y.jsxs)("section", {
						"aria-labelledby": e,
						children: [/* @__PURE__ */ (0, Y.jsx)("h3", {
							id: e,
							tabIndex: -1,
							children: t
						}), n.map(([e, t]) => /* @__PURE__ */ (0, Y.jsxs)("details", { children: [/* @__PURE__ */ (0, Y.jsxs)("summary", { children: [e, /* @__PURE__ */ (0, Y.jsx)("span", {
							"aria-hidden": "true",
							children: "+"
						})] }), /* @__PURE__ */ (0, Y.jsx)("p", { children: t })] }, e))]
					}, e))
				})]
			}),
			/* @__PURE__ */ (0, Y.jsx)("section", {
				className: "sv-home-agreement sv-home-agreement--dark",
				"aria-labelledby": "duvidas-comecar",
				children: /* @__PURE__ */ (0, Y.jsxs)("div", {
					className: "sv-shell sv-display-heading",
					children: [
						/* @__PURE__ */ (0, Y.jsx)("h2", {
							id: "duvidas-comecar",
							children: "Pronto para cadastrar sua empresa?"
						}),
						/* @__PURE__ */ (0, Y.jsx)("p", { children: "Crie sua conta e escolha como a sua empresa vai atuar no SIVI." }),
						/* @__PURE__ */ (0, Y.jsx)(Jd, { children: "Cadastrar empresa" })
					]
				})
			})
		]
	});
}
// src/public/information.tsx
var uC = {
	seguranca: {
		eyebrow: "Segurança e dados",
		title: "Cada acesso tem seu contexto.",
		intro: "Conta pessoal, empresa e atuação são etapas diferentes. Entenda como isso se conecta no SIVI.",
		sections: [
			["Confirmação do e-mail", "A conta usa Firebase Authentication. Antes de solicitar o cadastro da empresa, confirme o endereço pelo link enviado ao seu e-mail. Não compartilhe senha ou links de confirmação."],
			["Análise empresarial", "O cadastro entra em análise administrativa. Quando houver correção solicitada, consulte a justificativa e reenvie. As permissões operacionais dependem da empresa, da atuação e da situação do cadastro."],
			["Acesso acadêmico gratuito", "O cadastro pede dados da conta, nome da empresa e atuação. Os demais dados empresariais são opcionais."],
			["Limites claros", "A análise cadastral não substitui a diligência comercial e técnica entre empresas. O SIVI não anuncia certificações de segurança, garantia de entrega ou garantia de fornecimento que não tenham sido comprovadas."]
		]
	},
	privacidade: {
		eyebrow: "Privacidade",
		title: "Seus dados, com clareza.",
		intro: "Esta página descreve o uso de dados na versão atual. Atualizada em 23 de outubro de 2026.",
		sections: [
			["Conta e autenticação", "Nome, sobrenome, e-mail e credenciais são usados para criar e acessar a conta com Firebase Authentication. A senha é encaminhada ao serviço de autenticação; não integra o rascunho empresarial salvo no navegador."],
			["Dados empresariais e negociações", "Nome e atuação compõem o cadastro para análise. CNPJ, cidade, UF e contato são opcionais. Demandas, propostas, pedidos e seus registros são armazenados no Firebase Realtime Database e disponibilizados conforme as permissões e a relação comercial."],
			["Armazenamento no navegador", "O cadastro integrado pode salvar um rascunho empresarial neste navegador por até sete dias, associado à conta. Ele permite retomar a revisão após confirmar o e-mail. Preferências de aparência e contexto também usam armazenamento local ou de sessão. Não há publicidade ou analytics adicionados nesta repaginação."],
			["Dados de pagamento", "O cadastro acadêmico é gratuito e dispensa dados de pagamento."],
			["Responsável e atendimento", "Esta apresentação usa SIVI Tecnologia, São Paulo/SP, e CNPJ 00.000.000/0000-00 como identificação fictícia. contato@sivi.example é somente um exemplo, sem atendimento. Não há canal real para solicitações de dados configurado nesta versão. Antes de operação comercial, o responsável e esse canal precisam ser substituídos por dados reais."]
		]
	},
	condicoes: {
		eyebrow: "Condições de uso",
		title: "O acordo começa com clareza.",
		intro: "Condições da versão demonstrativa, atualizadas em 23 de outubro de 2026.",
		sections: [
			["O papel da plataforma", "O SIVI organiza o relacionamento e os registros comerciais entre empresas. Não fabrica, transporta nem processa o pagamento dos produtos negociados. Capacidade, requisitos, frete, prazos e pagamento devem ser verificados e acordados pelos participantes."],
			["Conta e cadastro empresarial", "A conclusão do formulário cria uma conta real. O acesso operacional requer confirmação de e-mail e análise da empresa. Informe dados corretos de uma empresa que você está autorizado a representar; não use o CNPJ fictício do rodapé como identificação de uma empresa real."],
			["Cadastro e pagamentos", "O cadastro não solicita dados de pagamento. As condições e o pagamento de cada pedido são combinados entre as empresas."],
			["Responsabilidades dos participantes", "Revise as especificações e condições antes de aceitar propostas. Mantenha as informações de capacidade atualizadas. Registre inspeção, expedição e recebimento conforme os fatos. Não apresente dados de terceiros sem autorização nem compartilhe sua conta."],
			["Identidade demonstrativa", "SIVI Tecnologia, o CNPJ fictício 00.000.000/0000-00 e o e-mail contato@sivi.example são dados de apresentação, sem registro ou atendimento declarado. Estas condições descrevem o produto atual; a operação comercial exige a identificação real do responsável e a formalização das condições comerciais."]
		]
	},
	ajuda: {
		eyebrow: "Ajuda e acesso",
		title: "Um caminho claro para começar.",
		intro: "Orientações para criar sua conta, confirmar o e-mail e acompanhar a empresa.",
		sections: [
			["1. Escolha a sua atuação", "Escolha Compradora para publicar demandas e comparar propostas, Fornecedora para apresentar capacidade e enviar propostas ou Compradora e fornecedora para atuar nos dois lados. Você pode revisar a escolha antes de criar a conta."],
			["2. Conclua o cadastro", "Preencha seus dados, o nome da empresa e escolha a atuação. CNPJ, cidade, UF e contato são opcionais."],
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
function dC({ page: e }) {
	let t = uC[e] ?? uC.ajuda;
	return /* @__PURE__ */ (0, Y.jsx)(mf, {
		lightHeader: !0,
		children: /* @__PURE__ */ (0, Y.jsxs)("div", {
			className: "sv-information sv-shell",
			children: [
				/* @__PURE__ */ (0, Y.jsx)("a", {
					className: "sv-back",
					href: "#/",
					children: "← Voltar à página inicial"
				}),
				/* @__PURE__ */ (0, Y.jsx)("p", {
					className: "sv-eyebrow",
					children: t.eyebrow
				}),
				/* @__PURE__ */ (0, Y.jsx)("h1", {
					id: "public-title",
					tabIndex: -1,
					children: t.title
				}),
				/* @__PURE__ */ (0, Y.jsx)("p", {
					className: "sv-information-intro",
					children: t.intro
				}),
				/* @__PURE__ */ (0, Y.jsxs)("div", {
					className: "sv-information-grid",
					children: [/* @__PURE__ */ (0, Y.jsxs)("aside", { children: [
						/* @__PURE__ */ (0, Y.jsx)("span", { children: "Nesta página" }),
						t.sections.map(([t], n) => /* @__PURE__ */ (0, Y.jsx)("a", {
							href: `#/?pagina=${e}&secao=info-${n}`,
							children: t
						}, t)),
						/* @__PURE__ */ (0, Y.jsxs)("a", {
							href: Hd("ajuda"),
							children: ["Ajuda e acesso ", /* @__PURE__ */ (0, Y.jsx)(Kd, {})]
						})
					] }), /* @__PURE__ */ (0, Y.jsxs)("div", { children: [t.sections.map(([e, t], n) => /* @__PURE__ */ (0, Y.jsxs)("section", { children: [/* @__PURE__ */ (0, Y.jsx)("h2", {
						id: `info-${n}`,
						tabIndex: -1,
						children: e
					}), /* @__PURE__ */ (0, Y.jsx)("p", { children: t })] }, e)), e === "creditos" && /* @__PURE__ */ (0, Y.jsxs)(Y.Fragment, { children: [
						/* @__PURE__ */ (0, Y.jsxs)("section", { children: [
							/* @__PURE__ */ (0, Y.jsx)("h2", { children: "Vídeo: CNC lathe" }),
							/* @__PURE__ */ (0, Y.jsx)("p", { children: "Vandurit inserti, via Wikimedia Commons. Licença CC BY 3.0. Vídeo recortado e apresentado sem áudio." }),
							/* @__PURE__ */ (0, Y.jsxs)("a", {
								href: "https://commons.wikimedia.org/wiki/File:CNC_lathe.webm",
								target: "_blank",
								rel: "noreferrer",
								children: ["Ver vídeo e autoria ", /* @__PURE__ */ (0, Y.jsx)(Kd, {})]
							}),
							" ",
							"·",
							" ",
							/* @__PURE__ */ (0, Y.jsxs)("a", {
								href: "https://creativecommons.org/licenses/by/3.0/",
								target: "_blank",
								rel: "noreferrer",
								children: ["Licença ", /* @__PURE__ */ (0, Y.jsx)(Kd, {})]
							})
						] }),
						/* @__PURE__ */ (0, Y.jsxs)("section", { children: [
							/* @__PURE__ */ (0, Y.jsx)("h2", { children: "Fotografias industriais" }),
							/* @__PURE__ */ (0, Y.jsx)("p", { children: "Tima Miroshnichenko, via Pexels. Fotografias recortadas para a composição." }),
							/* @__PURE__ */ (0, Y.jsxs)("a", {
								href: "https://www.pexels.com/photo/a-man-using-a-turning-machine-5846270/",
								target: "_blank",
								rel: "noreferrer",
								children: ["Operador no torno ", /* @__PURE__ */ (0, Y.jsx)(Kd, {})]
							}),
							/* @__PURE__ */ (0, Y.jsx)("br", {}),
							/* @__PURE__ */ (0, Y.jsxs)("a", {
								href: "https://www.pexels.com/photo/black-metal-machine-on-brown-wooden-table-5846125/",
								target: "_blank",
								rel: "noreferrer",
								children: ["Detalhe do torno ", /* @__PURE__ */ (0, Y.jsx)(Kd, {})]
							}),
							" ",
							"·",
							" ",
							/* @__PURE__ */ (0, Y.jsxs)("a", {
								href: "https://www.pexels.com/license/",
								target: "_blank",
								rel: "noreferrer",
								children: ["Licença Pexels ", /* @__PURE__ */ (0, Y.jsx)(Kd, {})]
							})
						] }),
						/* @__PURE__ */ (0, Y.jsxs)("section", { children: [
							/* @__PURE__ */ (0, Y.jsx)("h2", { children: "Componentes e identidade" }),
							/* @__PURE__ */ (0, Y.jsx)("p", { children: "Raposa original do SIVI preservada. Gráfico adaptado do componente de referência do 21st.dev fornecido pelo responsável. Ícones Lucide e movimento com Motion e GSAP. SplitText e ScrollReveal adaptados do React Bits, de David Haz. Indicadores, painéis e setas adaptados das receitas do Transitions.dev, de Jakub Antalik." }),
							/* @__PURE__ */ (0, Y.jsxs)("a", {
								href: "https://reactbits.dev/",
								target: "_blank",
								rel: "noreferrer",
								children: ["React Bits ", /* @__PURE__ */ (0, Y.jsx)(Kd, {})]
							}),
							" ",
							"·",
							" ",
							/* @__PURE__ */ (0, Y.jsxs)("a", {
								href: "./assets/licenses/react-bits.txt",
								target: "_blank",
								rel: "noreferrer",
								children: ["Licença React Bits ", /* @__PURE__ */ (0, Y.jsx)(Kd, {})]
							}),
							/* @__PURE__ */ (0, Y.jsx)("br", {}),
							/* @__PURE__ */ (0, Y.jsxs)("a", {
								href: "https://transitions.dev/",
								target: "_blank",
								rel: "noreferrer",
								children: ["Transitions.dev ", /* @__PURE__ */ (0, Y.jsx)(Kd, {})]
							}),
							" ",
							"·",
							" ",
							/* @__PURE__ */ (0, Y.jsxs)("a", {
								href: "./assets/licenses/transitions-dev.txt",
								target: "_blank",
								rel: "noreferrer",
								children: ["Licença Transitions.dev ", /* @__PURE__ */ (0, Y.jsx)(Kd, {})]
							})
						] })
					] })] })]
				}),
				/* @__PURE__ */ (0, Y.jsxs)("div", {
					className: "sv-information-cta",
					children: [/* @__PURE__ */ (0, Y.jsx)("h2", { children: "Pronto para o próximo acordo?" }), /* @__PURE__ */ (0, Y.jsx)(Jd, { children: "Conhecer o cadastro" })]
				})
			]
		})
	});
}
// src/core/signup-draft-store.js
var fC = "sivi.signup-drafts.v1", pC = 6048e5, mC = (e) => String(e ?? "").trim().toLowerCase();
function hC({ storage: e, now: t = Date.now, idFactory: n = () => globalThis.crypto.randomUUID() } = {}) {
	let r = !!e, i = [];
	try {
		let t = JSON.parse(e?.getItem(fC) ?? "[]");
		Array.isArray(t) && (i = t);
	} catch {
		r = !1;
	}
	let a = () => {
		if (r) try {
			let n = JSON.parse(e.getItem(fC) ?? "[]");
			i = (Array.isArray(n) ? n : []).filter((e) => e && typeof e.id == "string" && typeof e.email == "string" && Number.isFinite(e.expiresAt) && e.expiresAt > t()).flatMap((e) => {
				try {
					return [{
						id: e.id,
						email: mC(e.email),
						uid: typeof e.uid == "string" ? e.uid : void 0,
						organization: VS(e.organization),
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
			e?.setItem(fC, JSON.stringify(i));
		} catch {
			r = !1;
		}
	}, s = (e, n) => e && e.expiresAt > t() && n?.uid && mC(n.email) === e.email && (!e.uid || e.uid === n.uid);
	return {
		get persistent() {
			return r;
		},
		stage({ email: e, organization: r }) {
			a();
			let s = VS(r), c = mC(e);
			i = i.filter((e) => e.email !== c);
			let l = {
				id: n(),
				email: c,
				organization: s,
				expiresAt: t() + pC
			};
			return i.push(l), o(), l.id;
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
var gC;
function _C() {
	if (!gC) {
		let e;
		try {
			e = window.localStorage;
		} catch {}
		gC = hC({ storage: e });
	}
	return gC;
}
// src/services/auth-errors.js
function vC(e) {
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
function yC({ label: e, name: t, id: n, type: r = "text", value: i, onChange: a, error: o, hint: s, autoComplete: c, maxLength: l, ...u }) {
	let [d, f] = (0, y.useState)(!1);
	return /* @__PURE__ */ (0, Y.jsxs)("div", {
		className: "sa-field",
		children: [
			/* @__PURE__ */ (0, Y.jsx)("label", {
				htmlFor: n,
				children: e
			}),
			/* @__PURE__ */ (0, Y.jsxs)("div", {
				className: "sa-input-wrap",
				children: [/* @__PURE__ */ (0, Y.jsx)("input", {
					...u,
					id: n,
					name: t,
					type: r === "password" && d ? "text" : r,
					value: i,
					onChange: (e) => a(t, e.target.value),
					maxLength: l,
					autoComplete: c,
					"aria-invalid": !!o,
					"aria-describedby": o ? `${n}-error` : s ? `${n}-hint` : void 0
				}), r === "password" && /* @__PURE__ */ (0, Y.jsx)("button", {
					type: "button",
					className: "sa-password",
					"aria-label": d ? `Ocultar ${e.toLowerCase()}` : `Mostrar ${e.toLowerCase()}`,
					"aria-pressed": d,
					"aria-controls": n,
					onClick: () => f(!d),
					children: d ? /* @__PURE__ */ (0, Y.jsx)(pd, { size: 18 }) : /* @__PURE__ */ (0, Y.jsx)(hd, { size: 18 })
				})]
			}),
			s && !o && /* @__PURE__ */ (0, Y.jsx)("small", {
				id: `${n}-hint`,
				children: s
			}),
			o && /* @__PURE__ */ (0, Y.jsx)("small", {
				className: "sa-error",
				id: `${n}-error`,
				children: o
			})
		]
	});
}
var bC = {
	firstName: "",
	lastName: "",
	email: "",
	password: "",
	confirmPassword: ""
};
function xC({ bridge: e }) {
	let t = new URLSearchParams(location.hash.split("?")[1]), n = t.get("modo") !== "login", [r, i] = (0, y.useState)(() => KS(t.get("atuacao"), t.get("plano")).id), [a, o] = (0, y.useState)(0), [s, c] = (0, y.useState)({
		...bC,
		name: "",
		cnpj: "",
		city: "",
		state: "",
		contact: ""
	}), [l, u] = (0, y.useState)({}), [d, f] = (0, y.useState)(!1), [p, m] = (0, y.useState)(""), [h, g] = (0, y.useState)(null), [_, v] = (0, y.useState)(!1), [b, x] = (0, y.useState)(""), [S, C] = (0, y.useState)(""), w = (0, y.useRef)(!1), T = (0, y.useRef)(!0), E = (0, y.useRef)(null), D = (0, y.useRef)(null), O = KS(r), k = _C();
	(0, y.useEffect)(() => () => {
		T.current = !1;
	}, []), (0, y.useEffect)(() => {
		E.current?.focus({ preventScroll: !0 });
	}, [
		a,
		h,
		_
	]);
	let A = (e, t) => {
		c((n) => ({
			...n,
			[e]: t
		})), u((t) => ({
			...t,
			[e]: void 0,
			company: void 0
		}));
	}, j = (e) => {
		m(e), requestAnimationFrame(() => D.current?.focus());
	}, M = (e) => {
		u(e), j("Confira os campos indicados antes de continuar."), requestAnimationFrame(() => document.querySelector(".sivi-auth-ui [aria-invalid=\"true\"]")?.focus());
	};
	async function ee(t) {
		if (t.preventDefault(), w.current) return;
		let n = {
			...s,
			roles: O.roles
		}, r = XS(n, a);
		if (Object.keys(r).length) {
			M(r);
			return;
		}
		if (a === 0) {
			o(a + 1), m(""), u({}), window.scrollTo(0, 0);
			return;
		}
		let i = {
			...XS(n, 0),
			...r
		};
		if (Object.keys(i).length) {
			o(+!Object.keys(XS(n, 0)).length), M(i);
			return;
		}
		w.current = !0, f(!0), m("Criando sua conta. Aguarde a confirmação.");
		let l;
		try {
			l = k.stage({
				email: s.email,
				organization: VS(n)
			});
			let t = await (await e.loadAuth()).registerWithEmail({
				firstName: s.firstName.trim(),
				lastName: s.lastName.trim(),
				email: s.email.trim(),
				password: s.password
			});
			if (k.bind(l, {
				uid: t.user.uid,
				email: t.user.email ?? s.email
			}), !T.current) return;
			g({
				...t,
				email: s.email.trim(),
				persistent: k.persistent
			}), c((e) => ({
				...e,
				password: "",
				confirmPassword: ""
			})), m("");
		} catch (e) {
			T.current && j(e.code === "auth/email-already-in-use" ? "Este e-mail já tem uma conta. Entre ou recupere sua senha para continuar." : vC(e));
		} finally {
			w.current = !1, T.current && f(!1);
		}
	}
	async function N(t) {
		if (t.preventDefault(), !w.current) {
			if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.trim())) j("Informe um e-mail válido.");
			else if (!_ && !S) j("Informe sua senha.");
			else {
				w.current = !0, f(!0), m(_ ? "Preparando as orientações…" : "Entrando na sua conta…");
				try {
					let t = await e.loadAuth();
					_ ? (await t.requestPasswordReset(b.trim()), j("Se houver uma conta com este e-mail, você receberá as orientações para redefinir a senha. Confira também o spam.")) : await t.loginWithEmail({
						email: b.trim(),
						password: S
					});
				} catch (e) {
					T.current && j(vC(e));
				} finally {
					w.current = !1, T.current && f(!1);
				}
			}
		}
	}
	async function P(t) {
		if (!w.current) {
			w.current = !0, f(!0), m("Abrindo o provedor de acesso…");
			try {
				await (await e.loadAuth()).loginWithProvider(t);
			} catch (e) {
				T.current && j(vC(e));
			} finally {
				w.current = !1, T.current && f(!1);
			}
		}
	}
	let F = (e, t, n = "text", r) => /* @__PURE__ */ (0, Y.jsx)(yC, {
		id: {
			firstName: "first-name",
			lastName: "last-name",
			email: "register-email",
			password: "register-password",
			confirmPassword: "confirm-password"
		}[e],
		name: e,
		label: t,
		type: n,
		autoComplete: r,
		maxLength: e.includes("assword") ? 128 : e === "email" ? 254 : 80,
		value: s[e],
		onChange: A,
		error: l[e],
		hint: e === "password" ? "8 ou mais caracteres, com maiúscula, minúscula e número." : void 0
	}, e);
	return /* @__PURE__ */ (0, Y.jsxs)("div", {
		className: "sa-layout auth-shell",
		"data-mode": n ? "register" : "login",
		"data-ui-ready": "true",
		"aria-busy": d,
		children: [/* @__PURE__ */ (0, Y.jsxs)("aside", {
			className: "sa-story",
			children: [
				/* @__PURE__ */ (0, Y.jsx)("img", {
					className: "sa-story-photo",
					src: "./assets/operador-torno.jpg",
					alt: "Operador trabalhando em uma máquina industrial"
				}),
				/* @__PURE__ */ (0, Y.jsx)("div", { className: "sa-story-shade" }),
				/* @__PURE__ */ (0, Y.jsxs)("div", {
					className: "sa-story-top",
					children: [/* @__PURE__ */ (0, Y.jsx)(Gd, { back: !0 }), /* @__PURE__ */ (0, Y.jsxs)("span", { children: [
						"DA NECESSIDADE",
						/* @__PURE__ */ (0, Y.jsx)("br", {}),
						"AO ACORDO."
					] })]
				}),
				/* @__PURE__ */ (0, Y.jsxs)("div", {
					className: "sa-story-copy",
					children: [
						/* @__PURE__ */ (0, Y.jsx)("p", {
							className: "sv-eyebrow",
							children: "Boas conexões movem a indústria"
						}),
						/* @__PURE__ */ (0, Y.jsxs)("h2", { children: [
							"O próximo acordo",
							/* @__PURE__ */ (0, Y.jsx)("br", {}),
							"tem uma empresa",
							/* @__PURE__ */ (0, Y.jsx)("br", {}),
							"como a sua."
						] }),
						/* @__PURE__ */ (0, Y.jsxs)("p", { children: [
							"Requisitos claros. Condições registradas.",
							/* @__PURE__ */ (0, Y.jsx)("br", {}),
							"Um caminho compartilhado até o recebimento."
						] }),
						/* @__PURE__ */ (0, Y.jsxs)("div", {
							className: "sa-story-proof",
							children: [/* @__PURE__ */ (0, Y.jsx)(Dd, { size: 20 }), /* @__PURE__ */ (0, Y.jsxs)("span", { children: [
								"E-mail confirmado.",
								/* @__PURE__ */ (0, Y.jsx)("br", {}),
								"Empresa sujeita à análise."
							] })]
						})
					]
				}),
				/* @__PURE__ */ (0, Y.jsx)("small", {
					className: "sa-story-credit",
					children: "Fotografia real · Tima Miroshnichenko / Pexels"
				})
			]
		}), /* @__PURE__ */ (0, Y.jsxs)("main", {
			className: "sa-main",
			children: [
				/* @__PURE__ */ (0, Y.jsx)("div", {
					className: "sa-mobile-brand",
					children: /* @__PURE__ */ (0, Y.jsx)(Gd, { back: !0 })
				}),
				/* @__PURE__ */ (0, Y.jsxs)("div", {
					className: "sa-top",
					children: [/* @__PURE__ */ (0, Y.jsxs)("a", {
						href: "#/",
						className: "sa-back",
						children: [/* @__PURE__ */ (0, Y.jsx)($u, { size: 16 }), " Voltar ao início"]
					}), /* @__PURE__ */ (0, Y.jsxs)("span", { children: [
						n ? "Já tem conta?" : "Primeiro acesso?",
						" ",
						/* @__PURE__ */ (0, Y.jsxs)("a", {
							href: n ? "#/acesso?modo=login" : "#/acesso?modo=register",
							"data-switch-mode": n ? "login" : "register",
							children: [
								n ? "Entrar" : "Criar conta",
								" ",
								/* @__PURE__ */ (0, Y.jsx)(rd, { size: 14 })
							]
						})
					] })]
				}),
				/* @__PURE__ */ (0, Y.jsx)("div", {
					className: "sa-content form-view is-active",
					children: h ? /* @__PURE__ */ (0, Y.jsxs)("section", {
						className: "sa-success",
						children: [
							/* @__PURE__ */ (0, Y.jsx)("div", {
								className: "sa-success-symbol",
								children: /* @__PURE__ */ (0, Y.jsx)(sd, { size: 30 })
							}),
							/* @__PURE__ */ (0, Y.jsx)("p", {
								className: "sv-eyebrow",
								children: "Seu primeiro passo está concluído"
							}),
							/* @__PURE__ */ (0, Y.jsx)("h1", {
								ref: E,
								tabIndex: -1,
								children: "Sua conta foi criada."
							}),
							/* @__PURE__ */ (0, Y.jsxs)("p", { children: [
								"Agora confirme o e-mail ",
								/* @__PURE__ */ (0, Y.jsx)("strong", { children: h.email }),
								" para continuar."
							] }),
							/* @__PURE__ */ (0, Y.jsxs)("ol", { children: [
								/* @__PURE__ */ (0, Y.jsxs)("li", { children: [/* @__PURE__ */ (0, Y.jsx)("strong", { children: "Abra a mensagem de verificação." }), /* @__PURE__ */ (0, Y.jsx)("span", { children: h.verificationSent ? "O link foi enviado. Confira a caixa de entrada e o spam." : "Não foi possível enviar a mensagem agora. Tente entrar para solicitar um novo envio." })] }),
								/* @__PURE__ */ (0, Y.jsxs)("li", { children: [/* @__PURE__ */ (0, Y.jsx)("strong", { children: "Entre e revise a empresa." }), /* @__PURE__ */ (0, Y.jsx)("span", { children: h.persistent ? "Os dados empresariais ficam neste navegador por até sete dias para você retomar a revisão." : "Este navegador não permitiu salvar o rascunho. Ao entrar, apresente novamente os dados da empresa." })] }),
								/* @__PURE__ */ (0, Y.jsxs)("li", { children: [/* @__PURE__ */ (0, Y.jsx)("strong", { children: "Envie para análise." }), /* @__PURE__ */ (0, Y.jsx)("span", { children: "O acesso comercial será liberado após a aprovação do cadastro empresarial." })] })
							] }),
							(!h.profileSaved || !h.displayNameSaved) && /* @__PURE__ */ (0, Y.jsx)("p", {
								className: "sa-notice",
								children: "A conta existe, mas parte dos dados do perfil não pôde ser salva. Confira seu perfil após entrar."
							}),
							/* @__PURE__ */ (0, Y.jsxs)("a", {
								className: "sa-submit",
								href: "#/acesso?modo=login",
								children: ["Ir para entrar ", /* @__PURE__ */ (0, Y.jsx)(rd, { size: 18 })]
							})
						]
					}) : n ? /* @__PURE__ */ (0, Y.jsxs)(Y.Fragment, { children: [
						/* @__PURE__ */ (0, Y.jsxs)("div", {
							className: "sa-form-heading",
							children: [
								/* @__PURE__ */ (0, Y.jsx)("p", {
									className: "sv-eyebrow",
									children: "Sua empresa no SIVI"
								}),
								/* @__PURE__ */ (0, Y.jsx)("h1", {
									ref: E,
									tabIndex: -1,
									children: ["Comece uma nova conexão.", "Apresente sua empresa."][a]
								}),
								/* @__PURE__ */ (0, Y.jsx)("p", { children: ["Preencha seus dados para criar um acesso acadêmico.", "Informe o nome e a atuação da empresa. Os dados complementares são opcionais."][a] })
							]
						}),
						/* @__PURE__ */ (0, Y.jsx)("ol", {
							className: "sa-steps",
							"aria-label": "Etapas do cadastro",
							children: ["Seu acesso", "Sua empresa"].map((e, t) => /* @__PURE__ */ (0, Y.jsx)("li", {
								"aria-current": t === a ? "step" : void 0,
								className: t <= a ? "is-active" : "",
								children: /* @__PURE__ */ (0, Y.jsxs)("button", {
									type: "button",
									disabled: t > a || d,
									onClick: () => {
										o(t), m(""), u({});
									},
									children: [/* @__PURE__ */ (0, Y.jsx)("span", { children: t < a ? /* @__PURE__ */ (0, Y.jsx)(sd, { size: 13 }) : t + 1 }), e]
								})
							}, e))
						}),
						/* @__PURE__ */ (0, Y.jsx)("form", {
							id: "register-form",
							noValidate: !0,
							onSubmit: ee,
							children: /* @__PURE__ */ (0, Y.jsxs)("fieldset", {
								disabled: d,
								children: [
									a === 0 && /* @__PURE__ */ (0, Y.jsxs)(Y.Fragment, { children: [
										/* @__PURE__ */ (0, Y.jsxs)("div", {
											className: "sa-row",
											children: [F("firstName", "Nome", "text", "given-name"), F("lastName", "Sobrenome", "text", "family-name")]
										}),
										F("email", "E-mail", "email", "email"),
										F("password", "Senha", "password", "new-password"),
										F("confirmPassword", "Confirmar senha", "password", "new-password")
									] }),
									a === 1 && /* @__PURE__ */ (0, Y.jsxs)(Y.Fragment, { children: [
										/* @__PURE__ */ (0, Y.jsx)(yC, {
											label: "Nome da empresa",
											id: "company-name",
											name: "name",
											autoComplete: "organization",
											maxLength: 120,
											value: s.name,
											onChange: A,
											error: l.name
										}),
										/* @__PURE__ */ (0, Y.jsx)(yC, {
											label: "CNPJ",
											id: "company-cnpj",
											error: l.cnpj,
											name: "cnpj",
											maxLength: 18,
											value: s.cnpj,
											onChange: A
										}),
										/* @__PURE__ */ (0, Y.jsxs)("div", {
											className: "sa-row sa-row--city",
											children: [/* @__PURE__ */ (0, Y.jsx)(yC, {
												label: "Cidade",
												id: "company-city",
												error: l.city,
												name: "city",
												autoComplete: "address-level2",
												maxLength: 100,
												value: s.city,
												onChange: A
											}), /* @__PURE__ */ (0, Y.jsxs)("div", {
												className: "sa-field",
												children: [
													/* @__PURE__ */ (0, Y.jsx)("label", {
														htmlFor: "company-state",
														children: "UF"
													}),
													/* @__PURE__ */ (0, Y.jsxs)("select", {
														id: "company-state",
														"aria-invalid": !!l.state,
														"aria-describedby": l.state ? "company-state-error" : void 0,
														name: "state",
														value: s.state,
														onChange: (e) => A("state", e.target.value),
														children: [/* @__PURE__ */ (0, Y.jsx)("option", {
															value: "",
															children: "Selecione"
														}), zS.map((e) => /* @__PURE__ */ (0, Y.jsx)("option", { children: e }, e))]
													}),
													l.state && /* @__PURE__ */ (0, Y.jsx)("small", {
														id: "company-state-error",
														className: "sa-error",
														children: l.state
													})
												]
											})]
										}),
										/* @__PURE__ */ (0, Y.jsx)(yC, {
											label: "Telefone ou e-mail de contato",
											id: "company-contact",
											error: l.contact,
											name: "contact",
											maxLength: 120,
											value: s.contact,
											onChange: A
										}),
										/* @__PURE__ */ (0, Y.jsxs)("div", {
											className: "sa-field",
											children: [/* @__PURE__ */ (0, Y.jsx)("label", {
												htmlFor: "signup-activity",
												children: "Atuação da empresa"
											}), /* @__PURE__ */ (0, Y.jsx)("select", {
												id: "signup-activity",
												value: r,
												onChange: (e) => i(e.target.value),
												children: WS.map((e) => /* @__PURE__ */ (0, Y.jsx)("option", {
													value: e.id,
													children: e.label
												}, e.id))
											})]
										})
									] }),
									/* @__PURE__ */ (0, Y.jsx)("div", {
										ref: D,
										className: `sa-feedback ${p ? "is-visible" : ""}`,
										role: "status",
										tabIndex: -1,
										"data-status": "register",
										children: p
									}),
									/* @__PURE__ */ (0, Y.jsxs)("button", {
										type: "submit",
										className: "sa-submit",
										children: [d ? "Criando sua conta…" : a === 0 ? "Continuar para empresa" : "Criar conta", !d && /* @__PURE__ */ (0, Y.jsx)(rd, { size: 18 })]
									}),
									a > 0 && /* @__PURE__ */ (0, Y.jsx)("button", {
										className: "sa-previous",
										type: "button",
										onClick: () => {
											o(a - 1), m(""), u({});
										},
										children: "← Voltar e revisar"
									}),
									/* @__PURE__ */ (0, Y.jsxs)("p", {
										className: "sa-legal",
										children: [
											"Ao criar a conta, você declara estar autorizado a representar a empresa. Conheça as",
											" ",
											/* @__PURE__ */ (0, Y.jsx)("a", {
												href: Hd("condicoes"),
												target: "_blank",
												rel: "noopener noreferrer",
												children: "condições de uso"
											}),
											" ",
											"e o uso de dados na",
											" ",
											/* @__PURE__ */ (0, Y.jsx)("a", {
												href: Hd("privacidade"),
												target: "_blank",
												rel: "noopener noreferrer",
												children: "privacidade"
											}),
											"."
										]
									})
								]
							})
						})
					] }) : /* @__PURE__ */ (0, Y.jsxs)(Y.Fragment, { children: [
						/* @__PURE__ */ (0, Y.jsxs)("div", {
							className: "sa-form-heading",
							children: [
								/* @__PURE__ */ (0, Y.jsx)("p", {
									className: "sv-eyebrow",
									children: "Bem-vindo de volta"
								}),
								/* @__PURE__ */ (0, Y.jsx)("h1", {
									ref: E,
									tabIndex: -1,
									children: _ ? "Recupere seu acesso." : "Seu próximo acordo espera."
								}),
								/* @__PURE__ */ (0, Y.jsx)("p", { children: _ ? "Informe o e-mail usado no cadastro para receber as orientações." : "Entre para acompanhar sua empresa e continuar de onde parou." })
							]
						}),
						/* @__PURE__ */ (0, Y.jsx)("form", {
							id: "login-form",
							noValidate: !0,
							onSubmit: N,
							children: /* @__PURE__ */ (0, Y.jsxs)("fieldset", {
								disabled: d,
								children: [
									/* @__PURE__ */ (0, Y.jsx)(yC, {
										id: "login-email",
										label: "E-mail",
										name: "email",
										type: "email",
										autoComplete: "username",
										value: b,
										onChange: (e, t) => x(t)
									}),
									!_ && /* @__PURE__ */ (0, Y.jsx)(yC, {
										id: "login-password",
										label: "Senha",
										name: "password",
										type: "password",
										autoComplete: "current-password",
										value: S,
										onChange: (e, t) => C(t)
									}),
									/* @__PURE__ */ (0, Y.jsx)("div", {
										ref: D,
										className: `sa-feedback ${p ? "is-visible" : ""}`,
										role: "status",
										tabIndex: -1,
										"data-status": "login",
										children: p
									}),
									/* @__PURE__ */ (0, Y.jsxs)("button", {
										type: "submit",
										className: "sa-submit",
										children: [d ? "Aguarde…" : _ ? "Enviar orientações" : "Entrar na minha conta", !d && /* @__PURE__ */ (0, Y.jsx)(rd, { size: 18 })]
									}),
									/* @__PURE__ */ (0, Y.jsx)("button", {
										className: "sa-previous",
										type: "button",
										"data-reset-password": !0,
										onClick: () => {
											v(!_), m("");
										},
										children: _ ? "← Voltar para entrar" : "Esqueci minha senha"
									})
								]
							})
						}),
						!_ && /* @__PURE__ */ (0, Y.jsxs)(Y.Fragment, { children: [/* @__PURE__ */ (0, Y.jsx)("div", {
							className: "sa-divider",
							children: /* @__PURE__ */ (0, Y.jsx)("span", { children: "ou entre com" })
						}), /* @__PURE__ */ (0, Y.jsxs)("div", {
							className: "sa-providers",
							children: [/* @__PURE__ */ (0, Y.jsxs)("button", {
								disabled: d,
								"data-provider": "google",
								onClick: () => P("google"),
								children: [/* @__PURE__ */ (0, Y.jsx)("span", {
									"aria-hidden": "true",
									className: "sa-google",
									children: "G"
								}), "Google"]
							}), /* @__PURE__ */ (0, Y.jsxs)("button", {
								disabled: d,
								"data-provider": "github",
								onClick: () => P("github"),
								children: [/* @__PURE__ */ (0, Y.jsx)("svg", {
									width: "18",
									height: "18",
									viewBox: "0 0 24 24",
									fill: "currentColor",
									"aria-hidden": "true",
									children: /* @__PURE__ */ (0, Y.jsx)("path", { d: "M12 .8a11.2 11.2 0 0 0-3.54 21.83c.56.1.77-.24.77-.54v-2.1c-3.13.68-3.8-1.33-3.8-1.33-.51-1.3-1.25-1.65-1.25-1.65-1.02-.7.08-.68.08-.68 1.13.08 1.72 1.16 1.72 1.16 1 1.71 2.63 1.22 3.27.93.1-.73.39-1.22.71-1.5-2.5-.28-5.13-1.25-5.13-5.56 0-1.23.44-2.23 1.16-3.02-.12-.28-.5-1.43.11-2.98 0 0 .94-.3 3.08 1.15a10.7 10.7 0 0 1 5.6 0c2.14-1.45 3.08-1.15 3.08-1.15.61 1.55.23 2.7.11 2.98.72.79 1.16 1.79 1.16 3.02 0 4.32-2.64 5.27-5.15 5.55.4.35.76 1.03.76 2.08v3.1c0 .3.2.65.77.54A11.2 11.2 0 0 0 12 .8Z" })
								}), "GitHub"]
							})]
						})] }),
						/* @__PURE__ */ (0, Y.jsxs)("p", {
							className: "sa-login-help",
							children: [
								"O acesso da empresa depende da confirmação de e-mail e da análise cadastral.",
								" ",
								/* @__PURE__ */ (0, Y.jsx)("a", {
									href: Hd("ajuda"),
									children: "Precisa de orientação?"
								})
							]
						})
					] })
				}),
				/* @__PURE__ */ (0, Y.jsxs)("footer", {
					className: "sa-footer",
					children: [
						/* @__PURE__ */ (0, Y.jsxs)("span", { children: [
							"© ",
							(/* @__PURE__ */ new Date()).getFullYear(),
							" SIVI"
						] }),
						/* @__PURE__ */ (0, Y.jsx)("a", {
							href: Hd("privacidade"),
							children: "Privacidade"
						}),
						/* @__PURE__ */ (0, Y.jsx)("a", {
							href: Hd("condicoes"),
							children: "Condições"
						}),
						/* @__PURE__ */ (0, Y.jsx)("a", {
							href: Hd("ajuda"),
							children: "Ajuda"
						})
					]
				})
			]
		})]
	});
}
// src/domain/workspace-insights.js
var SC = new Intl.DateTimeFormat("en-CA", {
	timeZone: "America/Sao_Paulo",
	year: "numeric",
	month: "2-digit",
	day: "2-digit"
}), CC = 864e5, wC = (e) => {
	let t = Object.fromEntries(SC.formatToParts(e).map((e) => [e.type, e.value]));
	return `${t.year}-${t.month}-${t.day}`;
}, TC = (e) => Date.parse(`${e}T12:00:00Z`) / CC, EC = (e) => (/* @__PURE__ */ new Date(e * CC)).toISOString().slice(0, 10), DC = (e) => `${e.slice(8, 10)}/${e.slice(5, 7)}`, OC = (e) => {
	if (typeof e == "number" && Number.isFinite(e) && e > 0) return e;
	if (typeof e == "string" && /^\d{4}-\d{2}-\d{2}T/.test(e)) {
		let t = Date.parse(e);
		if (Number.isFinite(t)) return t;
	}
	return null;
}, kC = [
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
function AC(e = {}, { role: t = "buyer", days: n = 90, now: r = Date.now() } = {}) {
	if (!Number.isFinite(r)) throw Error("Informe um instante válido para os indicadores.");
	n = [
		30,
		60,
		90
	].includes(n) ? n : 90;
	let i = wC(r), a = TC(i) - n + 1, o = Array.from({ length: 6 }, (e, t) => {
		let r = EC(a + Math.ceil(t * n / 6)), i = EC(a + Math.ceil((t + 1) * n / 6) - 1);
		return {
			start: r,
			end: i,
			label: `${DC(r)}–${DC(i)}`,
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
		let e = OC(i.createdAt);
		if (e === null && t === "proposals") {
			let t = (i.versions ?? []).map((e) => OC(e.createdAt)).filter((e) => e !== null);
			t.length && (e = Math.min(...t));
		}
		if (e === null) {
			c[t] += 1;
			continue;
		}
		if (e > r) continue;
		let l = TC(wC(e)) - a;
		if (l < 0 || l >= n) continue;
		let u = Math.min(5, Math.floor(l * 6 / n));
		o[u][t] += 1, s[t] += 1;
	}
	let l = kC.map(([e, t, n]) => ({
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
			start: EC(a),
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
var jC = new Intl.NumberFormat("pt-BR", {
	style: "currency",
	currency: "BRL"
}), MC = new Intl.NumberFormat("pt-BR"), NC = new Intl.NumberFormat("pt-BR", {
	notation: "compact",
	maximumFractionDigits: 1
}), PC = [
	30,
	60,
	90
], FC = [
	4,
	3,
	2,
	1,
	0
], IC = (e) => e.slice(8, 10) + "/" + e.slice(5, 7), LC = (e) => IC(e) + "/" + e.slice(0, 4), RC = (e) => [
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
];
function zC({ records: e, role: t = "buyer", now: n }) {
	let [r, i] = (0, y.useState)(90), [a, o] = (0, y.useState)("proposals"), [s, c] = (0, y.useState)(null), [l] = (0, y.useState)(() => n ?? Date.now()), u = Fu(), d = (0, y.useId)(), f = (0, y.useId)(), p = (0, y.useMemo)(() => AC(e, {
		role: t,
		days: r,
		now: l
	}), [
		e,
		t,
		r,
		l
	]), m = RC(t), h = m.find((e) => e.id === a), g = p.totals[a], _ = Math.max(1, Math.ceil(Math.max(...p.series.map((e) => e[a])) / 4)), v = p.series.find((e) => e.start === s) ?? p.series.reduce((e, t) => t[a] > 0 ? t : e, p.series[0]), b = p.portfolio.filter((e) => e.count > 0), x = b.reduce((e, t) => e + t.count, 0), S = p.omitted[a], C = t === "supplier" ? "#/app/fornecedor/oportunidades" : "#/app/comprador/demandas", w = t === "supplier" ? "#/app/fornecedor/pedidos" : "#/app/comprador/pedidos";
	return /* @__PURE__ */ (0, Y.jsxs)("section", {
		className: "workspace-insights",
		"data-workspace-insights": !0,
		"aria-label": "Indicadores da operação",
		children: [/* @__PURE__ */ (0, Y.jsxs)("section", {
			className: "workspace-insights__movement",
			"aria-labelledby": d,
			children: [
				/* @__PURE__ */ (0, Y.jsxs)("div", {
					className: "workspace-insights__heading",
					children: [/* @__PURE__ */ (0, Y.jsxs)("div", { children: [/* @__PURE__ */ (0, Y.jsx)("h2", {
						id: d,
						children: "Atividade da operação"
					}), /* @__PURE__ */ (0, Y.jsxs)("p", { children: [
						LC(p.period.start),
						" a ",
						LC(p.period.end),
						" · horário de São Paulo"
					] })] }), /* @__PURE__ */ (0, Y.jsx)("div", {
						className: "workspace-insights__period",
						role: "group",
						"aria-label": "Período dos indicadores",
						children: PC.map((e) => /* @__PURE__ */ (0, Y.jsxs)("button", {
							type: "button",
							"aria-pressed": r === e,
							onClick: () => {
								i(e), c(null);
							},
							children: [e, " dias"]
						}, e))
					})]
				}),
				/* @__PURE__ */ (0, Y.jsx)("div", {
					className: "workspace-insights__tabs",
					role: "group",
					"aria-label": "Tipo de atividade",
					children: m.map((e) => /* @__PURE__ */ (0, Y.jsx)("button", {
						type: "button",
						"aria-pressed": a === e.id,
						onClick: () => {
							o(e.id), c(null);
						},
						children: e.label
					}, e.id))
				}),
				/* @__PURE__ */ (0, Y.jsxs)("div", {
					className: "workspace-insights__figure",
					children: [/* @__PURE__ */ (0, Y.jsx)("output", {
						"data-insight-total": !0,
						"aria-label": h.detail + ": " + g,
						"aria-live": "polite",
						children: /* @__PURE__ */ (0, Y.jsx)(PS, {
							value: g,
							locales: "pt-BR",
							animated: !u,
							"aria-hidden": "true"
						})
					}), /* @__PURE__ */ (0, Y.jsxs)("span", { children: [h.detail, " no período"] })]
				}),
				g > 0 ? /* @__PURE__ */ (0, Y.jsxs)(Y.Fragment, { children: [/* @__PURE__ */ (0, Y.jsxs)("div", {
					className: "workspace-insights__plot",
					children: [/* @__PURE__ */ (0, Y.jsx)("div", {
						className: "workspace-insights__y-axis",
						"aria-hidden": "true",
						children: FC.map((e) => /* @__PURE__ */ (0, Y.jsx)("span", { children: NC.format(e * _) }, e))
					}), /* @__PURE__ */ (0, Y.jsx)("div", {
						className: "workspace-insights__columns",
						role: "group",
						"aria-label": "Criações por intervalo",
						children: p.series.map((e) => /* @__PURE__ */ (0, Y.jsxs)("button", {
							type: "button",
							"aria-label": e.label + ": " + MC.format(e[a]) + " · " + h.detail,
							"aria-pressed": e.start === v.start,
							onClick: () => c(e.start),
							children: [/* @__PURE__ */ (0, Y.jsx)("span", {
								className: "workspace-insights__bar-track",
								"aria-hidden": "true",
								children: /* @__PURE__ */ (0, Y.jsx)("span", {
									className: "workspace-insights__bar",
									"data-zero": e[a] === 0,
									style: { height: e[a] / (_ * 4) * 100 + "%" }
								})
							}), /* @__PURE__ */ (0, Y.jsx)("span", { children: IC(e.start) })]
						}, e.start))
					})]
				}), /* @__PURE__ */ (0, Y.jsxs)("p", {
					className: "workspace-insights__interval",
					role: "status",
					children: [/* @__PURE__ */ (0, Y.jsx)("span", { children: v.label }), /* @__PURE__ */ (0, Y.jsxs)("strong", { children: [MC.format(v[a]), " no intervalo"] })]
				})] }) : /* @__PURE__ */ (0, Y.jsxs)("div", {
					className: "workspace-insights__empty",
					children: [/* @__PURE__ */ (0, Y.jsx)(ad, {
						size: 20,
						"aria-hidden": "true"
					}), /* @__PURE__ */ (0, Y.jsx)("p", { children: "Nenhuma criação registrada neste período." })]
				}),
				S > 0 && /* @__PURE__ */ (0, Y.jsxs)("p", {
					className: "workspace-insights__note",
					children: [
						S,
						" ",
						h.label.toLocaleLowerCase("pt-BR"),
						" sem data de criação válida não entram nesta série."
					]
				}),
				t === "supplier" && a === "demands" && /* @__PURE__ */ (0, Y.jsx)("p", {
					className: "workspace-insights__note",
					children: "Data de criação das oportunidades atualmente acessíveis; não mede quando foram liberadas."
				}),
				/* @__PURE__ */ (0, Y.jsxs)("details", {
					className: "workspace-insights__data",
					children: [/* @__PURE__ */ (0, Y.jsxs)("summary", { children: [
						/* @__PURE__ */ (0, Y.jsx)(kd, {
							size: 16,
							"aria-hidden": "true"
						}),
						"Consultar dados do período",
						/* @__PURE__ */ (0, Y.jsx)(ld, {
							size: 16,
							"aria-hidden": "true"
						})
					] }), /* @__PURE__ */ (0, Y.jsx)("div", { children: /* @__PURE__ */ (0, Y.jsxs)("table", { children: [
						/* @__PURE__ */ (0, Y.jsxs)("caption", { children: [
							"Criações por intervalo · ",
							r,
							" dias"
						] }),
						/* @__PURE__ */ (0, Y.jsx)("thead", { children: /* @__PURE__ */ (0, Y.jsxs)("tr", { children: [/* @__PURE__ */ (0, Y.jsx)("th", {
							scope: "col",
							children: "Intervalo"
						}), m.map((e) => /* @__PURE__ */ (0, Y.jsx)("th", {
							scope: "col",
							children: e.label
						}, e.id))] }) }),
						/* @__PURE__ */ (0, Y.jsx)("tbody", { children: p.series.map((e) => /* @__PURE__ */ (0, Y.jsxs)("tr", { children: [/* @__PURE__ */ (0, Y.jsx)("th", {
							scope: "row",
							children: e.label
						}), m.map((t) => /* @__PURE__ */ (0, Y.jsx)("td", { children: MC.format(e[t.id]) }, t.id))] }, e.start)) })
					] }) })]
				})
			]
		}), /* @__PURE__ */ (0, Y.jsxs)("section", {
			className: "workspace-insights__portfolio",
			"aria-labelledby": f,
			children: [
				/* @__PURE__ */ (0, Y.jsx)("div", {
					className: "workspace-insights__heading",
					children: /* @__PURE__ */ (0, Y.jsxs)("div", { children: [/* @__PURE__ */ (0, Y.jsx)("h2", {
						id: f,
						children: "Carteira de pedidos"
					}), /* @__PURE__ */ (0, Y.jsx)("p", { children: "Estado atual · todos os períodos" })] })
				}),
				/* @__PURE__ */ (0, Y.jsxs)("div", {
					className: "workspace-insights__order-summary",
					children: [/* @__PURE__ */ (0, Y.jsxs)("div", { children: [/* @__PURE__ */ (0, Y.jsx)("span", { children: "Total de pedidos" }), /* @__PURE__ */ (0, Y.jsx)("strong", {
						"data-portfolio-total": !0,
						children: MC.format(x)
					})] }), /* @__PURE__ */ (0, Y.jsxs)("div", { children: [/* @__PURE__ */ (0, Y.jsx)("span", { children: "Valor registrado" }), /* @__PURE__ */ (0, Y.jsx)("strong", { children: jC.format(p.orderValueCents / 100) })] })]
				}),
				x > 0 ? /* @__PURE__ */ (0, Y.jsxs)(Y.Fragment, { children: [/* @__PURE__ */ (0, Y.jsx)("div", {
					className: "workspace-insights__distribution",
					"aria-hidden": "true",
					children: b.map((e) => /* @__PURE__ */ (0, Y.jsx)("span", {
						className: "workspace-insights__status--" + e.tone,
						style: { flexGrow: e.count }
					}, e.id))
				}), /* @__PURE__ */ (0, Y.jsx)("ul", {
					className: "workspace-insights__legend",
					"aria-label": "Pedidos por status",
					children: b.map((e) => /* @__PURE__ */ (0, Y.jsxs)("li", { children: [
						/* @__PURE__ */ (0, Y.jsx)("i", {
							className: "workspace-insights__status--" + e.tone,
							"aria-hidden": "true"
						}),
						/* @__PURE__ */ (0, Y.jsx)("span", { children: e.label }),
						/* @__PURE__ */ (0, Y.jsx)("strong", { children: MC.format(e.count) })
					] }, e.id))
				})] }) : /* @__PURE__ */ (0, Y.jsx)("p", {
					className: "workspace-insights__portfolio-empty",
					children: "Seus pedidos aparecerão aqui após o aceite."
				}),
				/* @__PURE__ */ (0, Y.jsxs)("p", {
					className: "workspace-insights__value-note",
					children: [p.incompleteOrderValues ? p.incompleteOrderValues + " pedido(s) com valor incompleto fora da soma. " : "", "Inclui frete. Não representa pagamento recebido."]
				}),
				/* @__PURE__ */ (0, Y.jsxs)("a", {
					className: "workspace-insights__link",
					href: x ? w : C,
					children: [x ? "Acompanhar pedidos" : t === "supplier" ? "Ver oportunidades" : "Ver minhas demandas", /* @__PURE__ */ (0, Y.jsx)(rd, {
						size: 16,
						"aria-hidden": "true"
					})]
				})
			]
		})]
	});
}
// src/public/entry.tsx
function BC(e, t, n) {
	e.replaceChildren();
	let r = (0, Lu.createRoot)(e);
	return (0, Iu.flushSync)(() => r.render(/* @__PURE__ */ (0, Y.jsx)(Tl, {
		reducedMotion: "user",
		children: /* @__PURE__ */ (0, Y.jsx)("div", {
			className: n,
			children: t
		})
	}))), () => r.unmount();
}
var VC = {
	home: {
		Component: wf,
		title: "SIVI — Marketplace industrial B2B"
	},
	about: {
		Component: oC,
		title: "Quem somos — SIVI"
	},
	platform: {
		Component: iC,
		title: "Plataforma — SIVI"
	},
	cases: {
		Component: sC,
		title: "Casos de uso — SIVI"
	},
	faq: {
		Component: lC,
		title: "Dúvidas — SIVI"
	}
};
function HC(e, t = "home") {
	let n = new URLSearchParams(location.hash.split("?")[1]), r = t === "home" ? n.get("pagina") : null, i = n.get("secao"), a = {
		seguranca: "Segurança e dados",
		privacidade: "Privacidade",
		condicoes: "Condições de uso",
		ajuda: "Ajuda e acesso",
		creditos: "Créditos"
	};
	if (r && r !== "sobre") {
		let t = Object.hasOwn(a, r) ? r : "ajuda";
		return document.title = `${a[t]} — SIVI`, BC(e, /* @__PURE__ */ (0, Y.jsx)(dC, { page: t }), "sivi-public-ui");
	}
	(r === "sobre" || t === "home" && i === "visao-geral") && (t = "about"), t === "home" && zd(i) && (t = "platform"), t === "home" && i === "duvidas" && (t = "faq");
	let { Component: o, title: s } = VC[t];
	return document.title = s, BC(e, /* @__PURE__ */ (0, Y.jsx)(o, {}), "sivi-public-ui");
}
function UC(e, t) {
	return document.title = new URLSearchParams(location.hash.split("?")[1]).get("modo") === "login" ? "Entrar — SIVI" : "Cadastro — SIVI", BC(e, /* @__PURE__ */ (0, Y.jsx)(xC, { bridge: t }), "sivi-auth-ui");
}
function WC(e, t) {
	return BC(e, /* @__PURE__ */ (0, Y.jsx)(zC, { ...t }), "sivi-workspace-ui");
}
export { UC as mountAuthExperience, HC as mountPublicExperience, WC as mountWorkspaceAnalytics };
