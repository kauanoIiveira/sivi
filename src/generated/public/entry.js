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
	function R(e) {
		var t = T.T;
		if (t !== null) {
			var n = t.types;
			n === null ? t.types = [e] : n.indexOf(e) === -1 && n.push(e);
		} else ee(R.bind(null, e));
	}
	var te = {
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
	e.Activity = f, e.Children = te, e.Component = y, e.Fragment = r, e.Profiler = a, e.PureComponent = x, e.StrictMode = i, e.Suspense = l, e.ViewTransition = p, e.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = T, e.__COMPILER_RUNTIME = {
		__proto__: null,
		c: function(e) {
			return T.H.useMemoCache(e);
		}
	}, e.addTransitionType = R, e.cache = function(e) {
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
	var D = Object.assign, O = Symbol.for("react.element"), k = Symbol.for("react.transitional.element"), A = Symbol.for("react.portal"), j = Symbol.for("react.fragment"), M = Symbol.for("react.strict_mode"), N = Symbol.for("react.profiler"), P = Symbol.for("react.consumer"), F = Symbol.for("react.context"), I = Symbol.for("react.forward_ref"), L = Symbol.for("react.suspense"), ee = Symbol.for("react.suspense_list"), R = Symbol.for("react.memo"), te = Symbol.for("react.lazy"), ne = Symbol.for("react.activity"), re = Symbol.for("react.legacy_hidden"), ie = Symbol.for("react.memo_cache_sentinel"), ae = Symbol.for("react.view_transition"), oe = Symbol.for("react.recoverable"), se = Symbol.iterator;
	function z(e) {
		return typeof e != "object" || !e ? null : (e = se && e[se] || e["@@iterator"], typeof e == "function" ? e : null);
	}
	var ce = Symbol.for("react.client.reference");
	function le(e) {
		if (e == null) return null;
		if (typeof e == "function") return e.$$typeof === ce ? null : e.displayName || e.name || null;
		if (typeof e == "string") return e;
		switch (e) {
			case j: return "Fragment";
			case N: return "Profiler";
			case M: return "StrictMode";
			case L: return "Suspense";
			case ee: return "SuspenseList";
			case ne: return "Activity";
			case ae: return "ViewTransition";
		}
		if (typeof e == "object") switch (e.$$typeof) {
			case A: return "Portal";
			case F: return e.displayName || "Context";
			case P: return (e._context.displayName || "Context") + ".Consumer";
			case I:
				var t = e.render;
				return e = e.displayName, e ||= (e = t.displayName || t.name || "", e === "" ? "ForwardRef" : "ForwardRef(" + e + ")"), e;
			case R: return t = e.displayName || null, t === null ? le(e.type) || "Memo" : t;
			case te:
				t = e._payload, e = e._init;
				try {
					return le(e(t));
				} catch {}
		}
		return null;
	}
	var B = Array.isArray, V = n.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, H = r.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, ue = {
		pending: !1,
		data: null,
		method: null,
		action: null
	}, de = [], fe = -1;
	function pe(e) {
		return { current: e };
	}
	function me(e) {
		0 > fe || (e.current = de[fe], de[fe] = null, fe--);
	}
	function U(e, t) {
		fe++, de[fe] = e.current, e.current = t;
	}
	var he = pe(null), W = pe(null), G = pe(null), K = pe(null);
	function ge(e, t) {
		switch (U(G, t), U(W, e), U(he, null), t.nodeType) {
			case 9:
			case 11:
				e = (e = t.documentElement) && (e = e.namespaceURI) ? fp(e) : 0;
				break;
			default: if (e = t.tagName, t = t.namespaceURI) t = fp(t), e = pp(t, e);
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
		me(he), U(he, e);
	}
	function _e() {
		me(he), me(W), me(G);
	}
	function ve(e) {
		var t = e.memoizedState;
		t !== null && (lh._currentValue = t.memoizedState, U(K, e)), t = he.current;
		var n = pp(t, e.type);
		t !== n && (U(W, e), U(he, n));
	}
	function ye(e) {
		W.current === e && (me(he), me(W)), K.current === e && (me(K), lh._currentValue = ue);
	}
	var be, xe;
	function Se(e) {
		if (be === void 0) try {
			throw Error();
		} catch (e) {
			var t = e.stack.trim().match(/\n( *(at )?)/);
			be = t && t[1] || "", xe = -1 < e.stack.indexOf("\n    at") ? " (<anonymous>)" : -1 < e.stack.indexOf("@") ? "@unknown:0:0" : "";
		}
		return "\n" + be + e + xe;
	}
	var Ce = !1;
	function we(e, t) {
		if (!e || Ce) return "";
		Ce = !0;
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
			Ce = !1, Error.prepareStackTrace = n;
		}
		return (n = e ? e.displayName || e.name : "") ? Se(n) : "";
	}
	function Te(e, t) {
		switch (e.tag) {
			case 26:
			case 27:
			case 5: return Se(e.type);
			case 16: return Se("Lazy");
			case 13: return e.child !== t && t !== null ? Se("Suspense Fallback") : Se("Suspense");
			case 19: return Se("SuspenseList");
			case 0:
			case 15: return we(e.type, !1);
			case 11: return we(e.type.render, !1);
			case 1: return we(e.type, !0);
			case 31: return Se("Activity");
			case 30: return Se("ViewTransition");
			default: return "";
		}
	}
	function Ee(e) {
		try {
			var t = "", n = null;
			do
				t += Te(e, n), n = e, e = e.return;
			while (e);
			return t;
		} catch (e) {
			return "\nError generating stack: " + e.message + "\n" + e.stack;
		}
	}
	var De = Object.prototype.hasOwnProperty, Oe = t.unstable_scheduleCallback, ke = t.unstable_cancelCallback, Ae = t.unstable_shouldYield, je = t.unstable_requestPaint, Me = t.unstable_now, Ne = t.unstable_getCurrentPriorityLevel, Pe = t.unstable_ImmediatePriority, Fe = t.unstable_UserBlockingPriority, Ie = t.unstable_NormalPriority, Le = t.unstable_LowPriority, q = t.unstable_IdlePriority, Re = t.log, ze = t.unstable_setDisableYieldValue, Be = null, Ve = null;
	function He(e) {
		if (typeof Re == "function" && ze(e), Ve && typeof Ve.setStrictMode == "function") try {
			Ve.setStrictMode(Be, e);
		} catch {}
	}
	var Ue = Math.clz32 ? Math.clz32 : Ke, We = Math.log, Ge = Math.LN2;
	function Ke(e) {
		return e >>>= 0, e === 0 ? 32 : 31 - (We(e) / Ge | 0) | 0;
	}
	var qe = 256, Je = 262144, Ye = 4194304;
	function Xe(e) {
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
	function Ze(e, t, n) {
		var r = e.pendingLanes;
		if (r === 0) return 0;
		var i = 0, a = e.suspendedLanes, o = e.pingedLanes;
		e = e.warmLanes;
		var s = r & 134217727;
		return s === 0 ? (s = r & ~a, s === 0 ? o === 0 ? n || (n = r & ~e, n !== 0 && (i = Xe(n))) : i = Xe(o) : i = Xe(s)) : (r = s & ~a, r === 0 ? (o &= s, o === 0 ? n || (n = s & ~e, n !== 0 && (i = Xe(n))) : i = Xe(o)) : i = Xe(r)), i === 0 ? 0 : t !== 0 && t !== i && (t & a) === 0 && (a = i & -i, n = t & -t, a >= n || a === 32 && n & 4194048) ? t : i;
	}
	function Qe(e, t) {
		return (e.pendingLanes & ~(e.suspendedLanes & ~e.pingedLanes) & t) === 0;
	}
	function $e(e, t) {
		t & 8 && (t |= t & 32);
		var n = e.entangledLanes;
		if (n !== 0) for (e = e.entanglements, n &= t; 0 < n;) {
			var r = 31 - Ue(n), i = 1 << r;
			t |= e[r], n &= ~i;
		}
		return t;
	}
	function et(e, t) {
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
	function tt() {
		var e = Ye;
		return Ye <<= 1, !(Ye & 62914560) && (Ye = 4194304), e;
	}
	function nt(e) {
		for (var t = [], n = 0; 31 > n; n++) t.push(e);
		return t;
	}
	function rt(e, t) {
		e.pendingLanes |= t, t !== 268435456 && (e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0);
	}
	function it(e, t, n, r, i, a) {
		var o = e.pendingLanes;
		e.pendingLanes = n, e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0, e.expiredLanes &= n, e.entangledLanes &= n, e.errorRecoveryDisabledLanes &= n, e.shellSuspendCounter = 0;
		var s = e.entanglements, c = e.expirationTimes, l = e.hiddenUpdates;
		for (n = o & ~n; 0 < n;) {
			var u = 31 - Ue(n), d = 1 << u;
			s[u] = 0, c[u] = -1;
			var f = l[u];
			if (f !== null) for (l[u] = null, u = 0; u < f.length; u++) {
				var p = f[u];
				p !== null && (p.lane &= -536870913);
			}
			n &= ~d;
		}
		r !== 0 && at(e, r, 0), a !== 0 && i === 0 && e.tag !== 0 && (e.suspendedLanes |= a & ~(o & ~t));
	}
	function at(e, t, n) {
		e.pendingLanes |= t, e.suspendedLanes &= ~t;
		var r = 31 - Ue(t);
		e.entangledLanes |= t, e.entanglements[r] = e.entanglements[r] | 1073741824 | n & 261930;
	}
	function ot(e, t) {
		var n = e.entangledLanes |= t;
		for (e = e.entanglements; n;) {
			var r = 31 - Ue(n), i = 1 << r;
			i & t | e[r] & t && (e[r] |= t), n &= ~i;
		}
	}
	function st(e, t) {
		var n = t & -t;
		return n = n & 42 ? 1 : ct(n), (n & (e.suspendedLanes | t)) === 0 ? n : 0;
	}
	function ct(e) {
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
	function lt(e) {
		return e &= -e, 2 < e ? 8 < e ? e & 134217727 ? 32 : 268435456 : 8 : 2;
	}
	function ut() {
		var e = H.p;
		return e === 0 ? (e = window.event, e === void 0 ? 32 : Th(e.type)) : e;
	}
	function dt(e, t) {
		var n = H.p;
		try {
			return H.p = e, t();
		} finally {
			H.p = n;
		}
	}
	var ft = Math.random().toString(36).slice(2), pt = "__reactFiber$" + ft, mt = "__reactProps$" + ft, ht = "__reactContainer$" + ft, gt = "__reactEvents$" + ft, _t = "__reactListeners$" + ft, vt = "__reactHandles$" + ft, yt = "__reactResources$" + ft, bt = "__reactMarker$" + ft, xt = "__reactLoad$" + ft;
	function St(e) {
		delete e[pt], delete e[mt], delete e[_t], delete e[vt];
	}
	function Ct(e) {
		var t;
		if (t = e[pt]) return t;
		for (var n = e.parentNode; n;) {
			if (t = n[ht] || n[pt]) {
				if (n = t.alternate, t.child !== null || n !== null && n.child !== null) for (e = mm(e); e !== null;) {
					if (n = e[pt]) return n;
					e = mm(e);
				}
				return t;
			}
			e = n, n = e.parentNode;
		}
		return null;
	}
	function wt(e) {
		if (e = e[pt] || e[ht]) {
			var t = e.tag;
			if (t === 5 || t === 6 || t === 13 || t === 31 || t === 26 || t === 27 || t === 3) return e;
		}
		return null;
	}
	function Tt(e) {
		var t = e.tag;
		if (t === 5 || t === 26 || t === 27 || t === 6) return e.stateNode;
		throw Error(i(33));
	}
	function Et(e) {
		var t = e[yt];
		return t ||= e[yt] = {
			hoistableStyles: /* @__PURE__ */ new Map(),
			hoistableScripts: /* @__PURE__ */ new Map()
		}, t;
	}
	function Dt(e) {
		e[bt] = !0;
	}
	function Ot(e) {
		e[xt] = void 0;
	}
	var kt = /* @__PURE__ */ new Set(), At = {};
	function jt(e, t) {
		Mt(e, t), Mt(e + "Capture", t);
	}
	function Mt(e, t) {
		for (At[e] = t, e = 0; e < t.length; e++) kt.add(t[e]);
	}
	var Nt = RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"), Pt = {}, Ft = {};
	function It(e) {
		return De.call(Ft, e) ? !0 : De.call(Pt, e) ? !1 : Nt.test(e) ? Ft[e] = !0 : (Pt[e] = !0, !1);
	}
	var Lt = !1;
	function Rt() {
		var e = Lt;
		return Lt = !1, e;
	}
	function zt(e, t, n) {
		if (It(t)) {
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
	function Bt(e, t, n) {
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
	function Vt(e, t, n, r) {
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
	function Ht(e) {
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
	function Ut(e) {
		var t = e.type;
		return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
	}
	function Wt(e, t, n) {
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
	function Gt(e) {
		if (!e._valueTracker) {
			var t = Ut(e) ? "checked" : "value";
			e._valueTracker = Wt(e, t, "" + e[t]);
		}
	}
	function Kt(e) {
		if (!e) return !1;
		var t = e._valueTracker;
		if (!t) return !0;
		var n = t.getValue(), r = "";
		return e && (r = Ut(e) ? e.checked ? "true" : "false" : e.value), e = r, e !== n && (t.setValue(e), !0);
	}
	var qt = /[\n"\\]/g;
	function Jt(e) {
		return e.replace(qt, function(e) {
			return "\\" + e.charCodeAt(0).toString(16) + " ";
		});
	}
	function Yt(e, t, n, r, i, a, o, s) {
		e.name = "", o != null && typeof o != "function" && typeof o != "symbol" && typeof o != "boolean" ? e.type = o : e.removeAttribute("type"), t == null ? o !== "submit" && o !== "reset" || e.removeAttribute("value") : o === "number" ? (t === 0 && e.value === "" || e.value != t) && (e.value = "" + Ht(t)) : e.value !== "" + Ht(t) && (e.value = "" + Ht(t)), t == null ? n == null ? r != null && e.removeAttribute("value") : Zt(e, Ht(n)) : o === "number" && e.value == t ? Zt(e, Ht(e.value)) : Zt(e, Ht(t)), i == null && a != null && (e.defaultChecked = !!a), i != null && (e.checked = i && typeof i != "function" && typeof i != "symbol"), s != null && typeof s != "function" && typeof s != "symbol" && typeof s != "boolean" ? e.name = "" + Ht(s) : e.removeAttribute("name");
	}
	function Xt(e, t, n, r, i, a, o, s) {
		if (a != null && typeof a != "function" && typeof a != "symbol" && typeof a != "boolean" && (e.type = a), t != null || n != null) {
			if (!(a !== "submit" && a !== "reset" || t != null)) {
				Gt(e);
				return;
			}
			n = n == null ? "" : "" + Ht(n), t = t == null ? n : "" + Ht(t), s || t === e.value || (e.value = t), e.defaultValue = t;
		}
		r ??= i, r = typeof r != "function" && typeof r != "symbol" && !!r, e.checked = s ? e.checked : !!r, e.defaultChecked = !!r, o != null && typeof o != "function" && typeof o != "symbol" && typeof o != "boolean" && (e.name = o), Gt(e);
	}
	function Zt(e, t) {
		e.defaultValue !== "" + t && (e.defaultValue = "" + t);
	}
	function Qt(e, t, n, r) {
		if (e = e.options, t) {
			t = {};
			for (var i = 0; i < n.length; i++) t["$" + n[i]] = !0;
			for (n = 0; n < e.length; n++) i = t.hasOwnProperty("$" + e[n].value), e[n].selected !== i && (e[n].selected = i), i && r && (e[n].defaultSelected = !0);
		} else {
			for (n = "" + Ht(n), t = null, i = 0; i < e.length; i++) {
				if (e[i].value === n) {
					e[i].selected = !0, r && (e[i].defaultSelected = !0);
					return;
				}
				t !== null || e[i].disabled || (t = e[i]);
			}
			t !== null && (t.selected = !0);
		}
	}
	function $t(e, t, n) {
		t != null && (t = "" + Ht(t), t !== e.value && (e.value = t), n == null) ? e.defaultValue !== t && (e.defaultValue = t) : e.defaultValue = n == null ? "" : "" + Ht(n);
	}
	function en(e, t, n, r) {
		if (t == null) {
			if (r != null) {
				if (n != null) throw Error(i(92));
				if (B(r)) {
					if (1 < r.length) throw Error(i(93));
					r = r[0];
				}
				n = r;
			}
			n ??= "", t = n;
		}
		n = Ht(t), e.defaultValue = n, r = e.textContent, r === n && r !== "" && r !== null && (e.value = r), Gt(e);
	}
	function tn(e, t) {
		if (t) {
			var n = e.firstChild;
			if (n && n === e.lastChild && n.nodeType === 3) {
				n.nodeValue = t;
				return;
			}
		}
		e.textContent = t;
	}
	var nn = new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));
	function rn(e, t, n) {
		var r = t.indexOf("--") === 0;
		n == null || typeof n == "boolean" || n === "" ? r ? e.setProperty(t, "") : t === "float" ? e.cssFloat = "" : e[t] = "" : r ? e.setProperty(t, n) : typeof n != "number" || n === 0 || nn.has(t) ? t === "float" ? e.cssFloat = n : e[t] = ("" + n).trim() : e[t] = n + "px";
	}
	function an(e, t, n) {
		if (t != null && typeof t != "object") throw Error(i(62));
		if (e = e.style, n != null) {
			for (var r in n) !n.hasOwnProperty(r) || t != null && t.hasOwnProperty(r) || (r.indexOf("--") === 0 ? e.setProperty(r, "") : r === "float" ? e.cssFloat = "" : e[r] = "", Lt = !0);
			for (var a in t) r = t[a], t.hasOwnProperty(a) && n[a] !== r && (rn(e, a, r), Lt = !0);
		} else for (var o in t) t.hasOwnProperty(o) && rn(e, o, t[o]);
	}
	function on(e) {
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
	var sn = /* @__PURE__ */ new Map([
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
	]), cn = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
	function ln(e) {
		return cn.test("" + e) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : e;
	}
	function un() {}
	var dn = null;
	function fn(e) {
		return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
	}
	var pn = null, mn = null;
	function hn(e) {
		var t = wt(e);
		if (t && (e = t.stateNode)) {
			var n = e[mt] || null;
			a: switch (e = t.stateNode, t.type) {
				case "input":
					if (Yt(e, n.value, n.defaultValue, n.defaultValue, n.checked, n.defaultChecked, n.type, n.name), t = n.name, n.type === "radio" && t != null) {
						for (n = e; n.parentNode;) n = n.parentNode;
						for (n = n.querySelectorAll("input[name=\"" + Jt("" + t) + "\"][type=\"radio\"]"), t = 0; t < n.length; t++) {
							var r = n[t];
							if (r !== e && r.form === e.form) {
								var a = r[mt] || null;
								if (!a) throw Error(i(90));
								Yt(r, a.value, a.defaultValue, a.defaultValue, a.checked, a.defaultChecked, a.type, a.name);
							}
						}
						for (t = 0; t < n.length; t++) r = n[t], r.form === e.form && Kt(r);
					}
					break a;
				case "textarea":
					$t(e, n.value, n.defaultValue);
					break a;
				case "select": t = n.value, t != null && Qt(e, !!n.multiple, t, !1);
			}
		}
	}
	var gn = !1;
	function _n(e, t, n) {
		if (gn) return e(t, n);
		gn = !0;
		try {
			return e(t);
		} finally {
			if (gn = !1, (pn !== null || mn !== null) && (Rd(), pn && (t = pn, e = mn, mn = pn = null, hn(t), e))) for (t = 0; t < e.length; t++) hn(e[t]);
		}
	}
	function vn(e, t) {
		var n = e.stateNode;
		if (n === null) return null;
		var r = n[mt] || null;
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
	var yn = typeof window < "u" && window.document !== void 0 && window.document.createElement !== void 0, bn = !1;
	if (yn) try {
		var xn = {};
		Object.defineProperty(xn, "passive", { get: function() {
			bn = !0;
		} }), window.addEventListener("test", xn, xn), window.removeEventListener("test", xn, xn);
	} catch {
		bn = !1;
	}
	var Sn = null, Cn = null, wn = null;
	function Tn() {
		if (wn) return wn;
		var e, t = Cn, n = t.length, r, i = "value" in Sn ? Sn.value : Sn.textContent, a = i.length;
		for (e = 0; e < n && t[e] === i[e]; e++);
		var o = n - e;
		for (r = 1; r <= o && t[n - r] === i[a - r]; r++);
		return wn = i.slice(e, 1 < r ? 1 - r : void 0);
	}
	function En(e) {
		var t = e.keyCode;
		return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
	}
	function Dn() {
		return !0;
	}
	function On() {
		return !1;
	}
	function kn(e) {
		function t(t, n, r, i, a) {
			for (var o in this._reactName = t, this._targetInst = r, this.type = n, this.nativeEvent = i, this.target = a, this.currentTarget = null, e) e.hasOwnProperty(o) && (t = e[o], this[o] = t ? t(i) : i[o]);
			return this.isDefaultPrevented = (i.defaultPrevented == null ? !1 === i.returnValue : i.defaultPrevented) ? Dn : On, this.isPropagationStopped = On, this;
		}
		return D(t.prototype, {
			preventDefault: function() {
				this.defaultPrevented = !0;
				var e = this.nativeEvent;
				e && (e.preventDefault ? e.preventDefault() : typeof e.returnValue != "unknown" && (e.returnValue = !1), this.isDefaultPrevented = Dn);
			},
			stopPropagation: function() {
				var e = this.nativeEvent;
				e && (e.stopPropagation ? e.stopPropagation() : typeof e.cancelBubble != "unknown" && (e.cancelBubble = !0), this.isPropagationStopped = Dn);
			},
			persist: function() {},
			isPersistent: Dn
		}), t;
	}
	var An = {
		eventPhase: 0,
		bubbles: 0,
		cancelable: 0,
		timeStamp: function(e) {
			return e.timeStamp || Date.now();
		},
		defaultPrevented: 0,
		isTrusted: 0
	}, jn = kn(An), Mn = D({}, An, {
		view: 0,
		detail: 0
	}), Nn = kn(Mn), Pn, Fn, In, Ln = D({}, Mn, {
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
		getModifierState: Jn,
		button: 0,
		buttons: 0,
		relatedTarget: function(e) {
			return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
		},
		movementX: function(e) {
			return "movementX" in e ? e.movementX : (e !== In && (In && e.type === "mousemove" ? (Pn = e.screenX - In.screenX, Fn = e.screenY - In.screenY) : Fn = Pn = 0, In = e), Pn);
		},
		movementY: function(e) {
			return "movementY" in e ? e.movementY : Fn;
		}
	}), Rn = kn(Ln), zn = kn(D({}, Ln, { dataTransfer: 0 })), Bn = kn(D({}, Mn, { relatedTarget: 0 })), Vn = kn(D({}, An, {
		animationName: 0,
		elapsedTime: 0,
		pseudoElement: 0
	})), Hn = kn(D({}, An, { clipboardData: function(e) {
		return "clipboardData" in e ? e.clipboardData : window.clipboardData;
	} })), Un = kn(D({}, An, { data: 0 })), Wn = {
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
	}, Gn = {
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
	}, Kn = {
		Alt: "altKey",
		Control: "ctrlKey",
		Meta: "metaKey",
		Shift: "shiftKey"
	};
	function qn(e) {
		var t = this.nativeEvent;
		return t.getModifierState ? t.getModifierState(e) : (e = Kn[e]) ? !!t[e] : !1;
	}
	function Jn() {
		return qn;
	}
	var Yn = kn(D({}, Mn, {
		key: function(e) {
			if (e.key) {
				var t = Wn[e.key] || e.key;
				if (t !== "Unidentified") return t;
			}
			return e.type === "keypress" ? (e = En(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? Gn[e.keyCode] || "Unidentified" : "";
		},
		code: 0,
		location: 0,
		ctrlKey: 0,
		shiftKey: 0,
		altKey: 0,
		metaKey: 0,
		repeat: 0,
		locale: 0,
		getModifierState: Jn,
		charCode: function(e) {
			return e.type === "keypress" ? En(e) : 0;
		},
		keyCode: function(e) {
			return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
		},
		which: function(e) {
			return e.type === "keypress" ? En(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
		}
	})), Xn = kn(D({}, Ln, {
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
	})), Zn = kn(D({}, An, { submitter: 0 })), Qn = kn(D({}, Mn, {
		touches: 0,
		targetTouches: 0,
		changedTouches: 0,
		altKey: 0,
		metaKey: 0,
		ctrlKey: 0,
		shiftKey: 0,
		getModifierState: Jn
	})), $n = kn(D({}, An, {
		propertyName: 0,
		elapsedTime: 0,
		pseudoElement: 0
	})), er = kn(D({}, Ln, {
		deltaX: function(e) {
			return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
		},
		deltaY: function(e) {
			return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
		},
		deltaZ: 0,
		deltaMode: 0
	})), tr = kn(D({}, An, {
		newState: 0,
		oldState: 0,
		source: 0
	})), nr = [
		9,
		13,
		27,
		32
	], rr = yn && "CompositionEvent" in window, ir = null;
	yn && "documentMode" in document && (ir = document.documentMode);
	var ar = yn && "TextEvent" in window && !ir, or = yn && (!rr || ir && 8 < ir && 11 >= ir), sr = " ", cr = !1;
	function lr(e, t) {
		switch (e) {
			case "keyup": return nr.indexOf(t.keyCode) !== -1;
			case "keydown": return t.keyCode !== 229;
			case "keypress":
			case "mousedown":
			case "focusout": return !0;
			default: return !1;
		}
	}
	function ur(e) {
		return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
	}
	var dr = !1;
	function fr(e, t) {
		switch (e) {
			case "compositionend": return ur(t);
			case "keypress": return t.which === 32 ? (cr = !0, sr) : null;
			case "textInput": return e = t.data, e === sr && cr ? null : e;
			default: return null;
		}
	}
	function pr(e, t) {
		if (dr) return e === "compositionend" || !rr && lr(e, t) ? (e = Tn(), wn = Cn = Sn = null, dr = !1, e) : null;
		switch (e) {
			case "paste": return null;
			case "keypress":
				if (!(t.ctrlKey || t.altKey || t.metaKey) || t.ctrlKey && t.altKey) {
					if (t.char && 1 < t.char.length) return t.char;
					if (t.which) return String.fromCharCode(t.which);
				}
				return null;
			case "compositionend": return or && t.locale !== "ko" ? null : t.data;
			default: return null;
		}
	}
	var mr = {
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
	function hr(e) {
		var t = e && e.nodeName && e.nodeName.toLowerCase();
		return t === "input" ? !!mr[e.type] : t === "textarea";
	}
	function gr(e, t, n, r) {
		pn ? mn ? mn.push(r) : mn = [r] : pn = r, t = Yf(t, "onChange"), 0 < t.length && (n = new jn("onChange", "change", null, n, r), e.push({
			event: n,
			listeners: t
		}));
	}
	var _r = null, vr = null;
	function yr(e) {
		Vf(e, 0);
	}
	function br(e) {
		if (Kt(Tt(e))) return e;
	}
	function xr(e, t) {
		if (e === "change") return t;
	}
	var Sr = !1;
	if (yn) {
		var Cr;
		if (yn) {
			var wr = "oninput" in document;
			if (!wr) {
				var Tr = document.createElement("div");
				Tr.setAttribute("oninput", "return;"), wr = typeof Tr.oninput == "function";
			}
			Cr = wr;
		} else Cr = !1;
		Sr = Cr && (!document.documentMode || 9 < document.documentMode);
	}
	function Er() {
		_r && (_r.detachEvent("onpropertychange", Dr), vr = _r = null);
	}
	function Dr(e) {
		if (e.propertyName === "value" && br(vr)) {
			var t = [];
			gr(t, vr, e, fn(e)), _n(yr, t);
		}
	}
	function Or(e, t, n) {
		e === "focusin" ? (Er(), _r = t, vr = n, _r.attachEvent("onpropertychange", Dr)) : e === "focusout" && Er();
	}
	function kr(e) {
		if (e === "selectionchange" || e === "keyup" || e === "keydown") return br(vr);
	}
	function Ar(e, t) {
		if (e === "click") return br(t);
	}
	function jr(e, t) {
		if (e === "input" || e === "change") return br(t);
	}
	function Mr(e, t) {
		return e === t && (e !== 0 || 1 / e == 1 / t) || e !== e && t !== t;
	}
	var Nr = typeof Object.is == "function" ? Object.is : Mr;
	function Pr(e, t) {
		if (Nr(e, t)) return !0;
		if (typeof e != "object" || !e || typeof t != "object" || !t) return !1;
		var n = Object.keys(e), r = Object.keys(t);
		if (n.length !== r.length) return !1;
		for (r = 0; r < n.length; r++) {
			var i = n[r];
			if (!De.call(t, i) || !Nr(e[i], t[i])) return !1;
		}
		return !0;
	}
	function Fr(e) {
		if (e ||= typeof document < "u" ? document : void 0, e === void 0) return null;
		try {
			return e.activeElement || e.body;
		} catch {
			return e.body;
		}
	}
	function Ir(e) {
		for (; e && e.firstChild;) e = e.firstChild;
		return e;
	}
	function Lr(e, t) {
		var n = Ir(e);
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
			n = Ir(n);
		}
	}
	function Rr(e, t) {
		return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? Rr(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
	}
	function zr(e) {
		e = e != null && e.ownerDocument != null && e.ownerDocument.defaultView != null ? e.ownerDocument.defaultView : window;
		for (var t = Fr(e.document); t instanceof e.HTMLIFrameElement;) {
			try {
				var n = typeof t.contentWindow.location.href == "string";
			} catch {
				n = !1;
			}
			if (n) e = t.contentWindow;
			else break;
			t = Fr(e.document);
		}
		return t;
	}
	function Br(e) {
		var t = e && e.nodeName && e.nodeName.toLowerCase();
		return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
	}
	var Vr = yn && "documentMode" in document && 11 >= document.documentMode, Hr = null, Ur = null, Wr = null, Gr = !1;
	function Kr(e, t, n) {
		var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
		Gr || Hr == null || Hr !== Fr(r) || (r = Hr, "selectionStart" in r && Br(r) ? r = {
			start: r.selectionStart,
			end: r.selectionEnd
		} : (r = (r.ownerDocument && r.ownerDocument.defaultView || window).getSelection(), r = {
			anchorNode: r.anchorNode,
			anchorOffset: r.anchorOffset,
			focusNode: r.focusNode,
			focusOffset: r.focusOffset
		}), Wr && Pr(Wr, r) || (Wr = r, r = Yf(Ur, "onSelect"), 0 < r.length && (t = new jn("onSelect", "select", null, t, n), e.push({
			event: t,
			listeners: r
		}), t.target = Hr)));
	}
	function qr(e, t) {
		var n = {};
		return n[e.toLowerCase()] = t.toLowerCase(), n["Webkit" + e] = "webkit" + t, n["Moz" + e] = "moz" + t, n;
	}
	var Jr = {
		animationend: qr("Animation", "AnimationEnd"),
		animationiteration: qr("Animation", "AnimationIteration"),
		animationstart: qr("Animation", "AnimationStart"),
		transitionrun: qr("Transition", "TransitionRun"),
		transitionstart: qr("Transition", "TransitionStart"),
		transitioncancel: qr("Transition", "TransitionCancel"),
		transitionend: qr("Transition", "TransitionEnd")
	}, Yr = {}, Xr = {};
	yn && (Xr = document.createElement("div").style, "AnimationEvent" in window || (delete Jr.animationend.animation, delete Jr.animationiteration.animation, delete Jr.animationstart.animation), "TransitionEvent" in window || delete Jr.transitionend.transition);
	function Zr(e) {
		if (Yr[e]) return Yr[e];
		if (!Jr[e]) return e;
		var t = Jr[e], n;
		for (n in t) if (t.hasOwnProperty(n) && n in Xr) return Yr[e] = t[n];
		return e;
	}
	var Qr = Zr("animationend"), $r = Zr("animationiteration"), ei = Zr("animationstart"), ti = Zr("transitionrun"), ni = Zr("transitionstart"), ri = Zr("transitioncancel"), ii = Zr("transitionend"), ai = /* @__PURE__ */ new Map(), oi = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error fullscreenChange fullscreenError gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
	oi.push("scrollEnd");
	function si(e, t) {
		ai.set(e, t), jt(t, [e]);
	}
	var ci = 0;
	function li(e, t) {
		if (e.name != null && e.name !== "auto") return e.name;
		if (t.autoName !== null) return t.autoName;
		e = yd.identifierPrefix;
		var n = ci++;
		return e = "_" + e + "t_" + n.toString(32) + "_", t.autoName = e;
	}
	function ui(e) {
		if (e == null || typeof e == "string") return e;
		var t = null, n = Dd;
		if (n !== null) for (var r = 0; r < n.length; r++) {
			var i = e[n[r]];
			if (i != null) {
				if (i === "none") return "none";
				t = t == null ? i : t + (" " + i);
			}
		}
		return t ?? e.default;
	}
	function di(e, t) {
		return e = ui(e), t = ui(t), t == null ? e === "auto" ? null : e : t === "auto" ? null : t;
	}
	var fi = typeof reportError == "function" ? reportError : function(e) {
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
	}, pi = [], mi = 0, hi = 0;
	function gi() {
		for (var e = mi, t = hi = mi = 0; t < e;) {
			var n = pi[t];
			pi[t++] = null;
			var r = pi[t];
			pi[t++] = null;
			var i = pi[t];
			pi[t++] = null;
			var a = pi[t];
			if (pi[t++] = null, r !== null && i !== null) {
				var o = r.pending;
				o === null ? i.next = i : (i.next = o.next, o.next = i), r.pending = i;
			}
			a !== 0 && bi(n, i, a);
		}
	}
	function _i(e, t, n, r) {
		pi[mi++] = e, pi[mi++] = t, pi[mi++] = n, pi[mi++] = r, hi |= r, e.lanes |= r, e = e.alternate, e !== null && (e.lanes |= r);
	}
	function vi(e, t, n, r) {
		return _i(e, t, n, r), xi(e);
	}
	function yi(e, t) {
		return _i(e, null, null, t), xi(e);
	}
	function bi(e, t, n) {
		e.lanes |= n;
		var r = e.alternate;
		r !== null && (r.lanes |= n);
		for (var i = !1, a = e.return; a !== null;) a.childLanes |= n, r = a.alternate, r !== null && (r.childLanes |= n), a.tag === 22 && (e = a.stateNode, e === null || e._visibility & 1 || (i = !0)), e = a, a = a.return;
		return e.tag === 3 ? (a = e.stateNode, i && t !== null && (i = 31 - Ue(n), e = a.hiddenUpdates, r = e[i], r === null ? e[i] = [t] : r.push(t), t.lane = n | 536870912), a) : null;
	}
	function xi(e) {
		if (50 < Od) throw Od = 0, kd = null, Error(i(185));
		for (var t = e.return; t !== null;) e = t, t = e.return;
		return e.tag === 3 ? e.stateNode : null;
	}
	var Si = {};
	function Ci(e, t, n, r) {
		this.tag = e, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = r, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
	}
	function wi(e, t, n, r) {
		return new Ci(e, t, n, r);
	}
	function Ti(e) {
		return e = e.prototype, !(!e || !e.isReactComponent);
	}
	function Ei(e, t) {
		var n = e.alternate;
		return n === null ? (n = wi(e.tag, t, e.key, e.mode), n.elementType = e.elementType, n.type = e.type, n.stateNode = e.stateNode, n.alternate = e, e.alternate = n) : (n.pendingProps = t, n.type = e.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null), n.flags = e.flags & 1206910976, n.childLanes = e.childLanes, n.lanes = e.lanes, n.child = e.child, n.memoizedProps = e.memoizedProps, n.memoizedState = e.memoizedState, n.updateQueue = e.updateQueue, t = e.dependencies, n.dependencies = t === null ? null : {
			lanes: t.lanes,
			firstContext: t.firstContext
		}, n.sibling = e.sibling, n.index = e.index, n.ref = e.ref, n.refCleanup = e.refCleanup, n;
	}
	function Di(e, t) {
		e.flags &= 1206910978;
		var n = e.alternate;
		return n === null ? (e.childLanes = 0, e.lanes = t, e.child = null, e.subtreeFlags = 0, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null) : (e.childLanes = n.childLanes, e.lanes = n.lanes, e.child = n.child, e.subtreeFlags = 0, e.deletions = null, e.memoizedProps = n.memoizedProps, e.memoizedState = n.memoizedState, e.updateQueue = n.updateQueue, e.type = n.type, t = n.dependencies, e.dependencies = t === null ? null : {
			lanes: t.lanes,
			firstContext: t.firstContext
		}), e;
	}
	function Oi(e, t, n, r, a, o) {
		var s = 0;
		if (r = e, typeof r == "function") Ti(r) && (s = 1);
		else if (typeof r == "string") s = Ym(e, n, he.current) ? 26 : e === "html" || e === "head" || e === "body" ? 27 : 5;
		else a: switch (r) {
			case ne: return e = wi(31, n, t, a), e.elementType = ne, e.lanes = o, e;
			case j: return ki(n.children, a, o, t);
			case M:
				s = 8, a |= 24;
				break;
			case N: return e = wi(12, n, t, a | 2), e.elementType = N, e.lanes = o, e;
			case L: return e = wi(13, n, t, a), e.elementType = L, e.lanes = o, e;
			case ee: return e = wi(19, n, t, a), e.elementType = ee, e.lanes = o, e;
			case re:
			case ae: return e = a | 32, e = wi(30, n, t, e), e.elementType = ae, e.lanes = o, e.stateNode = {
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
					case R:
						s = 14;
						break a;
					case te:
						s = 16, r = null;
						break a;
				}
				s = 29, n = Error(i(130, e === null ? "null" : typeof e, "")), r = null;
		}
		return t = wi(s, n, t, a), t.elementType = e, t.type = r, t.lanes = o, t;
	}
	function ki(e, t, n, r) {
		return e = wi(7, e, r, t), e.lanes = n, e;
	}
	function Ai(e, t, n) {
		return e = wi(6, e, null, t), e.lanes = n, e;
	}
	function ji(e) {
		var t = wi(18, null, null, 0);
		return t.stateNode = e, t;
	}
	function Mi(e, t, n) {
		return t = wi(4, e.children === null ? [] : e.children, e.key, t), t.lanes = n, t.stateNode = {
			containerInfo: e.containerInfo,
			pendingChildren: null,
			implementation: e.implementation
		}, t;
	}
	var Ni = /* @__PURE__ */ new WeakMap();
	function Pi(e, t) {
		if (typeof e == "object" && e) {
			var n = Ni.get(e);
			return n === void 0 ? (t = {
				value: e,
				source: t,
				stack: Ee(t)
			}, Ni.set(e, t), t) : n;
		}
		return {
			value: e,
			source: t,
			stack: Ee(t)
		};
	}
	var Fi = [], Ii = 0, Li = null, Ri = 0, zi = [], Bi = 0, Vi = null, Hi = 1, Ui = "";
	function Wi(e, t) {
		Fi[Ii++] = Ri, Fi[Ii++] = Li, Li = e, Ri = t;
	}
	function Gi(e, t, n) {
		zi[Bi++] = Hi, zi[Bi++] = Ui, zi[Bi++] = Vi, Vi = e;
		var r = Hi;
		e = Ui;
		var i = 32 - Ue(r) - 1;
		r &= ~(1 << i), n += 1;
		var a = 32 - Ue(t) + i;
		if (30 < a) {
			var o = i - i % 5;
			a = (r & (1 << o) - 1).toString(32), r >>= o, i -= o, Hi = 1 << 32 - Ue(t) + i | n << i | r, Ui = a + e;
		} else Hi = 1 << a | n << i | r, Ui = e;
	}
	function Ki(e) {
		e.return !== null && (Wi(e, 1), Gi(e, 1, 0));
	}
	function qi(e) {
		for (; e === Li;) Li = Fi[--Ii], Fi[Ii] = null, Ri = Fi[--Ii], Fi[Ii] = null;
		for (; e === Vi;) Vi = zi[--Bi], zi[Bi] = null, Ui = zi[--Bi], zi[Bi] = null, Hi = zi[--Bi], zi[Bi] = null;
	}
	function Ji(e, t) {
		zi[Bi++] = Hi, zi[Bi++] = Ui, zi[Bi++] = Vi, Hi = t.id, Ui = t.overflow, Vi = e;
	}
	var Yi = null, Xi = null, J = !1, Zi = null, Qi = !1, $i = Error(i(519));
	function ea(e) {
		throw oa(Pi(Error(i(418, 1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML", "")), e)), $i;
	}
	function ta(e) {
		var t = e.stateNode, n = e.type, r = e.memoizedProps;
		switch (t[pt] = e, t[mt] = r, n) {
			case "dialog":
				Hf("cancel", t), Hf("close", t);
				break;
			case "iframe":
			case "object":
			case "embed":
				Hf("load", t);
				break;
			case "video":
			case "audio":
				for (n = 0; n < zf.length; n++) Hf(zf[n], t);
				break;
			case "source":
				Hf("error", t);
				break;
			case "img":
			case "image":
			case "link":
				Hf("error", t), Hf("load", t);
				break;
			case "details":
				Hf("toggle", t);
				break;
			case "input":
				Hf("invalid", t), Xt(t, r.value, r.defaultValue, r.checked, r.defaultChecked, r.type, r.name, !0);
				break;
			case "select":
				Hf("invalid", t);
				break;
			case "textarea": Hf("invalid", t), en(t, r.value, r.defaultValue, r.children);
		}
		n = r.children, typeof n != "string" && typeof n != "number" && typeof n != "bigint" || t.textContent === "" + n || !0 === r.suppressHydrationWarning || tp(t.textContent, n) ? (r.popover != null && (Hf("beforetoggle", t), Hf("toggle", t)), r.onScroll != null && Hf("scroll", t), r.onScrollEnd != null && Hf("scrollend", t), r.onClick != null && (t.onclick = un), t = !0) : t = !1, t || ea(e, !0);
	}
	function na(e) {
		for (Yi = e.return; Yi;) switch (Yi.tag) {
			case 5:
			case 31:
			case 13:
				Qi = !1;
				return;
			case 27:
			case 3:
				Qi = !0;
				return;
			default: Yi = Yi.return;
		}
	}
	function ra(e) {
		if (e !== Yi) return !1;
		if (!J) return na(e), J = !0, !1;
		var t = e.tag, n;
		if ((n = t !== 3 && t !== 27) && ((n = t === 5) && (n = e.type, n = n === "form" || n === "button" || hp(e.type, e.memoizedProps)), n = !n), n && Xi && ea(e), na(e), t === 13) {
			if (e = e.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(i(317));
			Xi = pm(e);
		} else if (t === 31) {
			if (e = e.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(i(317));
			Xi = pm(e);
		} else t === 27 ? (t = Xi, wp(e.type) ? (e = fm, fm = null, Xi = e) : Xi = t) : Xi = Yi ? dm(e.stateNode.nextSibling) : null;
		return !0;
	}
	function ia() {
		Xi = Yi = null, J = !1;
	}
	function aa() {
		var e = Zi;
		return e !== null && (dd === null ? dd = e : dd.push.apply(dd, e), Zi = null), e;
	}
	function oa(e) {
		Zi === null ? Zi = [e] : Zi.push(e);
	}
	var sa = pe(null), ca = null, la = null;
	function ua(e, t, n) {
		U(sa, t._currentValue), t._currentValue = n;
	}
	function da(e) {
		e._currentValue = sa.current, me(sa);
	}
	function fa(e, t, n) {
		for (; e !== null;) {
			var r = e.alternate;
			if ((e.childLanes & t) === t ? r !== null && (r.childLanes & t) !== t && (r.childLanes |= t) : (e.childLanes |= t, r !== null && (r.childLanes |= t)), e === n) break;
			e = e.return;
		}
	}
	function pa(e, t, n, r) {
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
						o.lanes |= n, c = o.alternate, c !== null && (c.lanes |= n), fa(o.return, n, e), r || (s = null);
						break a;
					}
					o = c.next;
				}
			} else if (a.tag === 18) {
				if (s = a.return, s === null) throw Error(i(341));
				s.lanes |= n, o = s.alternate, o !== null && (o.lanes |= n), fa(s, n, e), s = null;
			} else a.tag === 13 && a.memoizedState !== null && a.memoizedState.dehydrated === null ? (a.lanes |= n, s = a.alternate, s !== null && (s.lanes |= n), fa(a.return, n, e), s = a.child, s = s === null ? null : s.sibling) : s = a.child;
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
	function ma(e, t, n, r) {
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
					Nr(a.pendingProps.value, s.value) || (e === null ? e = [c] : e.push(c));
				}
			} else if (a === K.current) {
				if (s = a.alternate, s === null) throw Error(i(387));
				s.memoizedState.memoizedState !== a.memoizedState.memoizedState && (e === null ? e = [lh] : e.push(lh));
			}
			a = a.return;
		}
		return e !== null && pa(t, e, n, r), t.flags |= 262144, e !== null;
	}
	function ha(e) {
		for (e = e.firstContext; e !== null;) {
			if (!Nr(e.context._currentValue, e.memoizedValue)) return !0;
			e = e.next;
		}
		return !1;
	}
	function ga(e) {
		ca = e, la = null, e = e.dependencies, e !== null && (e.firstContext = null);
	}
	function _a(e) {
		return ya(ca, e);
	}
	function va(e, t) {
		return ca === null && ga(e), ya(e, t);
	}
	function ya(e, t) {
		var n = t._currentValue;
		if (t = {
			context: t,
			memoizedValue: n,
			next: null
		}, la === null) {
			if (e === null) throw Error(i(308));
			la = t, e.dependencies = {
				lanes: 0,
				firstContext: t
			}, e.flags |= 524288;
		} else la = la.next = t;
		return n;
	}
	var ba = typeof AbortController < "u" ? AbortController : function() {
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
	}, xa = t.unstable_scheduleCallback, Sa = t.unstable_NormalPriority, Ca = {
		$$typeof: F,
		Consumer: null,
		Provider: null,
		_currentValue: null,
		_currentValue2: null,
		_threadCount: 0
	};
	function wa() {
		return {
			controller: new ba(),
			data: /* @__PURE__ */ new Map(),
			refCount: 0
		};
	}
	function Ta(e) {
		e.refCount--, e.refCount === 0 && xa(Sa, function() {
			e.controller.abort();
		});
	}
	function Ea(e, t) {
		if (e.pendingLanes & 4194048) {
			var n = e.transitionTypes;
			for (n === null && (n = e.transitionTypes = []), e = 0; e < t.length; e++) {
				var r = t[e];
				n.indexOf(r) === -1 && n.push(r);
			}
		}
	}
	var Da = null;
	function Oa(e) {
		var t = e.transitionTypes;
		return e.transitionTypes = null, t;
	}
	var ka = null, Aa = 0, ja = 0, Ma = null;
	function Na(e, t) {
		if (ka === null) {
			var n = ka = [];
			Aa = 0, ja = Pf(), Ma = {
				status: "pending",
				value: void 0,
				then: function(e) {
					n.push(e);
				}
			};
		}
		return Aa++, t.then(Pa, Pa), t;
	}
	function Pa() {
		if (--Aa === 0 && (Da = null, ka !== null)) {
			Ma !== null && (Ma.status = "fulfilled");
			var e = ka;
			ka = null, ja = 0, Ma = null;
			for (var t = 0; t < e.length; t++) (0, e[t])();
		}
	}
	function Fa(e, t) {
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
	var Ia = V.S;
	V.S = function(e, t) {
		if (md = Me(), typeof t == "object" && t && typeof t.then == "function" && Na(e, t), Da !== null) for (var n = bf; n !== null;) Ea(n, Da), n = n.next;
		if (n = e.types, n !== null) {
			for (var r = bf; r !== null;) Ea(r, n), r = r.next;
			if (ja !== 0) {
				r = Da, r === null && (r = Da = []);
				for (var i = 0; i < n.length; i++) {
					var a = n[i];
					r.indexOf(a) === -1 && r.push(a);
				}
			}
		}
		Ia !== null && Ia(e, t);
	};
	var La = pe(null);
	function Ra() {
		var e = La.current;
		return e === null ? Xu.pooledCache : e;
	}
	function za(e, t) {
		t === null ? U(La, La.current) : U(La, t.pool);
	}
	function Ba() {
		var e = Ra();
		return e === null ? null : {
			parent: Ca._currentValue,
			pool: e
		};
	}
	var Va = Error(i(460)), Ha = Error(i(474)), Ua = Error(i(542)), Wa = { then: function() {} };
	function Ga(e) {
		return e = e.status, e === "fulfilled" || e === "rejected";
	}
	function Ka(e, t, n) {
		switch (n = e[n], n === void 0 ? e.push(t) : n !== t && (t.then(un, un), t = n), t.status) {
			case "fulfilled": return t.value;
			case "rejected": throw e = t.reason, Xa(e), e === void 0 && !("reason" in t) ? Error(i(600)) : e;
			default:
				if (typeof t.status == "string") t.then(un, un);
				else {
					if (e = Xu, e !== null && 100 < e.shellSuspendCounter) throw Error(i(482));
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
					case "rejected": throw e = t.reason, Xa(e), e;
				}
				throw Ja = t, Va;
		}
	}
	function qa(e) {
		try {
			var t = e._init;
			return t(e._payload);
		} catch (e) {
			throw typeof e == "object" && e && typeof e.then == "function" ? (Ja = e, Va) : e;
		}
	}
	var Ja = null;
	function Ya() {
		if (Ja === null) throw Error(i(459));
		var e = Ja;
		return Ja = null, e;
	}
	function Xa(e) {
		if (e === Va || e === Ua) throw Error(i(483));
	}
	var Za = null, Qa = 0;
	function $a(e) {
		var t = Qa;
		return Qa += 1, Za === null && (Za = []), Ka(Za, e, t);
	}
	function eo(e, t) {
		t = t.props.ref, e.ref = t === void 0 ? null : t;
	}
	function to(e, t) {
		throw t.$$typeof === O ? Error(i(525)) : (e = Object.prototype.toString.call(t), Error(i(31, e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e)));
	}
	function no(e) {
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
			return e = Ei(e, t), e.index = 0, e.sibling = null, e;
		}
		function o(t, n, r) {
			return t.index = r, e ? (r = t.alternate, r === null ? (t.flags |= 134217730, n) : (r = r.index, r < n ? (t.flags |= 2, n) : r)) : (t.flags |= 1048576, n);
		}
		function s(t) {
			return e && t.alternate === null && (t.flags |= 134217730), t;
		}
		function c(e, t, n, r) {
			return t === null || t.tag !== 6 ? (t = Ai(n, e.mode, r), t.return = e, t) : (t = a(t, n), t.return = e, t);
		}
		function l(e, t, n, r) {
			var i = n.type;
			return i === j ? (e = d(e, t, n.props.children, r, n.key), eo(e, n), e) : t !== null && (t.elementType === i || typeof i == "object" && i && i.$$typeof === te && qa(i) === t.type) ? (t = a(t, n.props), eo(t, n), t.return = e, t) : (t = Oi(n.type, n.key, n.props, null, e.mode, r), eo(t, n), t.return = e, t);
		}
		function u(e, t, n, r) {
			return t === null || t.tag !== 4 || t.stateNode.containerInfo !== n.containerInfo || t.stateNode.implementation !== n.implementation ? (t = Mi(n, e.mode, r), t.return = e, t) : (t = a(t, n.children || []), t.return = e, t);
		}
		function d(e, t, n, r, i) {
			return t === null || t.tag !== 7 ? (t = ki(n, e.mode, r, i), t.return = e, t) : (t = a(t, n), t.return = e, t);
		}
		function f(e, t, n) {
			if (typeof t == "string" && t !== "" || typeof t == "number" || typeof t == "bigint") return t = Ai("" + t, e.mode, n), t.return = e, t;
			if (typeof t == "object" && t) {
				switch (t.$$typeof) {
					case k: return n = Oi(t.type, t.key, t.props, null, e.mode, n), eo(n, t), n.return = e, n;
					case A: return t = Mi(t, e.mode, n), t.return = e, t;
					case te: return t = qa(t), f(e, t, n);
				}
				if (B(t) || z(t)) return t = ki(t, e.mode, n, null), t.return = e, t;
				if (typeof t.then == "function") return f(e, $a(t), n);
				if (t.$$typeof === F) return f(e, va(e, t), n);
				to(e, t);
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
					case te: return n = qa(n), p(e, t, n, r);
				}
				if (B(n) || z(n)) return i === null ? d(e, t, n, r, null) : null;
				if (typeof n.then == "function") return p(e, t, $a(n), r);
				if (n.$$typeof === F) return p(e, t, va(e, n), r);
				to(e, n);
			}
			return null;
		}
		function m(e, t, n, r, i) {
			if (typeof r == "string" && r !== "" || typeof r == "number" || typeof r == "bigint") return e = e.get(n) || null, c(t, e, "" + r, i);
			if (typeof r == "object" && r) {
				switch (r.$$typeof) {
					case k: return e = e.get(r.key === null ? n : r.key) || null, l(t, e, r, i);
					case A: return e = e.get(r.key === null ? n : r.key) || null, u(t, e, r, i);
					case te: return r = qa(r), m(e, t, n, r, i);
				}
				if (B(r) || z(r)) return e = e.get(n) || null, d(t, e, r, i, null);
				if (typeof r.then == "function") return m(e, t, n, $a(r), i);
				if (r.$$typeof === F) return m(e, t, n, va(t, r), i);
				to(t, r);
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
			if (h === s.length) return n(i, d), J && Wi(i, h), l;
			if (d === null) {
				for (; h < s.length; h++) d = f(i, s[h], c), d !== null && (a = o(d, a, h), u === null ? l = d : u.sibling = d, u = d);
				return J && Wi(i, h), l;
			}
			for (d = r(d); h < s.length; h++) g = m(d, i, h, s[h], c), g !== null && (e && (_ = g.alternate, _ !== null && d.delete(_.key === null ? h : _.key)), a = o(g, a, h), u === null ? l = g : u.sibling = g, u = g);
			return e && d.forEach(function(e) {
				return t(i, e);
			}), J && Wi(i, h), l;
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
			if (v.done) return n(a, h), J && Wi(a, g), u;
			if (h === null) {
				for (; !v.done; g++, v = c.next()) v = f(a, v.value, l), v !== null && (s = o(v, s, g), d === null ? u = v : d.sibling = v, d = v);
				return J && Wi(a, g), u;
			}
			for (h = r(h); !v.done; g++, v = c.next()) v = m(h, a, g, v.value, l), v !== null && (e && (_ = v.alternate, _ !== null && h.delete(_.key === null ? g : _.key)), s = o(v, s, g), d === null ? u = v : d.sibling = v, d = v);
			return e && h.forEach(function(e) {
				return t(a, e);
			}), J && Wi(a, g), u;
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
											n(e, r.sibling), c = a(r, o.props.children), eo(c, o), c.return = e, e = c;
											break a;
										}
									} else if (r.elementType === l || typeof l == "object" && l && l.$$typeof === te && qa(l) === r.type) {
										n(e, r.sibling), c = a(r, o.props), eo(c, o), c.return = e, e = c;
										break a;
									}
									n(e, r);
									break;
								}
								t(e, r), r = r.sibling;
							}
							o.type === j ? (c = ki(o.props.children, e.mode, c, o.key), eo(c, o), c.return = e, e = c) : (c = Oi(o.type, o.key, o.props, null, e.mode, c), eo(c, o), c.return = e, e = c);
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
							c = Mi(o, e.mode, c), c.return = e, e = c;
						}
						return s(e);
					case te: return o = qa(o), _(e, r, o, c);
				}
				if (B(o)) return h(e, r, o, c);
				if (z(o)) {
					if (l = z(o), typeof l != "function") throw Error(i(150));
					return o = l.call(o), g(e, r, o, c);
				}
				if (typeof o.then == "function") return _(e, r, $a(o), c);
				if (o.$$typeof === F) return _(e, r, va(e, o), c);
				to(e, o);
			}
			return typeof o == "string" && o !== "" || typeof o == "number" || typeof o == "bigint" ? (o = "" + o, r !== null && r.tag === 6 ? (n(e, r.sibling), c = a(r, o), c.return = e, e = c) : (n(e, r), c = Ai(o, e.mode, c), c.return = e, e = c), s(e)) : n(e, r);
		}
		return function(e, t, n, r) {
			try {
				Qa = 0;
				var i = _(e, t, n, r);
				return Za = null, i;
			} catch (t) {
				if (t === Va || t === Ua) throw t;
				var a = wi(29, t, null, e.mode);
				return a.lanes = r, a.return = e, a;
			}
		};
	}
	var ro = no(!0), io = no(!1), ao = !1;
	function oo(e) {
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
	function so(e, t) {
		e = e.updateQueue, t.updateQueue === e && (t.updateQueue = {
			baseState: e.baseState,
			firstBaseUpdate: e.firstBaseUpdate,
			lastBaseUpdate: e.lastBaseUpdate,
			shared: e.shared,
			callbacks: null
		});
	}
	function co(e) {
		return {
			lane: e,
			tag: 0,
			payload: null,
			callback: null,
			next: null
		};
	}
	function lo(e, t, n) {
		var r = e.updateQueue;
		if (r === null) return null;
		if (r = r.shared, Yu & 2) {
			var i = r.pending;
			return i === null ? t.next = t : (t.next = i.next, i.next = t), r.pending = t, t = xi(e), bi(e, null, n), t;
		}
		return _i(e, r, t, n), xi(e);
	}
	function uo(e, t, n) {
		if (t = t.updateQueue, t !== null && (t = t.shared, n & 4194048)) {
			var r = t.lanes;
			r &= e.pendingLanes, n |= r, t.lanes = n, ot(e, n);
		}
	}
	function fo(e, t) {
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
	var po = !1;
	function mo() {
		if (po) {
			var e = Ma;
			if (e !== null) throw e;
		}
	}
	function ho(e, t, n, r) {
		po = !1;
		var i = e.updateQueue;
		ao = !1;
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
				if (p ? (Zu & f) === f : (r & f) === f) {
					f !== 0 && f === ja && (po = !0), u !== null && (u = u.next = {
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
							case 2: ao = !0;
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
			u === null && (c = d), i.baseState = c, i.firstBaseUpdate = l, i.lastBaseUpdate = u, a === null && (i.shared.lanes = 0), ad |= o, e.lanes = o, e.memoizedState = d;
		}
	}
	function go(e, t) {
		if (typeof e != "function") throw Error(i(191, e));
		e.call(t);
	}
	function _o(e, t) {
		var n = e.callbacks;
		if (n !== null) for (e.callbacks = null, e = 0; e < n.length; e++) go(n[e], t);
	}
	var vo = pe(null), yo = pe(0);
	function bo(e, t) {
		e = rd, U(yo, e), U(vo, t), rd = e | t.baseLanes;
	}
	function xo() {
		U(yo, rd), U(vo, vo.current);
	}
	function So() {
		rd = yo.current, me(vo), me(yo);
	}
	var Co = pe(null), wo = null;
	function To(e) {
		var t = e.alternate;
		U(Ao, Ao.current & 1), U(Co, e), wo === null && (t === null || vo.current !== null || t.memoizedState !== null) && (wo = e);
	}
	function Eo(e) {
		U(Ao, Ao.current), U(Co, e), wo === null && (wo = e);
	}
	function Do(e) {
		e.tag === 22 ? (U(Ao, Ao.current), U(Co, e), wo === null && (wo = e)) : Oo();
	}
	function Oo() {
		U(Ao, Ao.current), U(Co, Co.current);
	}
	function ko(e) {
		me(Co), wo === e && (wo = null), me(Ao);
	}
	var Ao = pe(0);
	function jo(e, t) {
		U(Co, Co.current), U(Ao, t);
	}
	function Mo(e) {
		me(Ao), me(Co), wo === e && (wo = null);
	}
	function No(e) {
		for (var t = e; t !== null;) {
			if (t.tag === 13) {
				var n = t.memoizedState;
				if (n !== null && (n = n.dehydrated, n === null || cm(n) || lm(n))) return t;
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
	var Po = 0, Y = null, Fo = null, Io = null, Lo = !1, Ro = !1, zo = !1, Bo = 0, Vo = 0, Ho = null, Uo = 0;
	function Wo() {
		throw Error(i(321));
	}
	function Go(e, t) {
		if (t === null) return !1;
		for (var n = 0; n < t.length && n < e.length; n++) if (!Nr(e[n], t[n])) return !1;
		return !0;
	}
	function Ko(e, t, n, r, i, a) {
		return Po = a, Y = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, V.H = e === null || e.memoizedState === null ? lc : uc, zo = !1, a = n(r, i), zo = !1, Ro && (a = Jo(t, n, r, i)), qo(e), a;
	}
	function qo(e) {
		V.H = cc;
		var t = Fo !== null && Fo.next !== null;
		if (Po = 0, Io = Fo = Y = null, Lo = !1, Vo = 0, Ho = null, t) throw Error(i(300));
		e === null || Dc || (e = e.dependencies, e !== null && ha(e) && (Dc = !0));
	}
	function Jo(e, t, n, r) {
		Y = e;
		var a = 0;
		do {
			if (Ro && (Ho = null), Vo = 0, Ro = !1, 25 <= a) throw Error(i(301));
			if (a += 1, Io = Fo = null, e.updateQueue != null) {
				var o = e.updateQueue;
				o.lastEffect = null, o.events = null, o.stores = null, o.memoCache != null && (o.memoCache.index = 0);
			}
			V.H = dc, o = t(n, r);
		} while (Ro);
		return o;
	}
	function Yo() {
		var e = V.H, t = e.useState()[0];
		return t = typeof t.then == "function" ? ns(t) : t, e = e.useState()[0], (Fo === null ? null : Fo.memoizedState) !== e && (Y.flags |= 1024), t;
	}
	function Xo() {
		var e = Bo !== 0;
		return Bo = 0, e;
	}
	function Zo(e, t, n) {
		t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~n;
	}
	function Qo(e) {
		if (Lo) {
			for (e = e.memoizedState; e !== null;) {
				var t = e.queue;
				t !== null && (t.pending = null), e = e.next;
			}
			Lo = !1;
		}
		Po = 0, Io = Fo = Y = null, Ro = !1, Vo = Bo = 0, Ho = null;
	}
	function $o() {
		var e = {
			memoizedState: null,
			baseState: null,
			baseQueue: null,
			queue: null,
			next: null
		};
		return Io === null ? Y.memoizedState = Io = e : Io = Io.next = e, Io;
	}
	function es() {
		if (Fo === null) {
			var e = Y.alternate;
			e = e === null ? null : e.memoizedState;
		} else e = Fo.next;
		var t = Io === null ? Y.memoizedState : Io.next;
		if (t !== null) Io = t, Fo = e;
		else {
			if (e === null) throw Y.alternate === null ? Error(i(467)) : Error(i(310));
			Fo = e, e = {
				memoizedState: Fo.memoizedState,
				baseState: Fo.baseState,
				baseQueue: Fo.baseQueue,
				queue: Fo.queue,
				next: null
			}, Io === null ? Y.memoizedState = Io = e : Io = Io.next = e;
		}
		return Io;
	}
	function ts() {
		return {
			lastEffect: null,
			events: null,
			stores: null,
			memoCache: null
		};
	}
	function ns(e) {
		var t = Vo;
		return Vo += 1, Ho === null && (Ho = []), e = Ka(Ho, e, t), t = Y, (Io === null ? t.memoizedState : Io.next) === null && (t = t.alternate, V.H = t === null || t.memoizedState === null ? lc : uc), e;
	}
	function rs(e) {
		if (typeof e == "object" && e) {
			if (typeof e.then == "function") return ns(e);
			if (e.$$typeof === oe) return;
			if (e.$$typeof === F) return _a(e);
		}
		throw Error(i(438, String(e)));
	}
	function is(e) {
		var t = null, n = Y.updateQueue;
		if (n !== null && (t = n.memoCache), t == null) {
			var r = Y.alternate;
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
		}, n === null && (n = ts(), Y.updateQueue = n), n.memoCache = t, n = t.data[t.index], n === void 0) for (n = t.data[t.index] = Array(e), r = 0; r < e; r++) n[r] = ie;
		return t.index++, n;
	}
	function as(e, t) {
		return typeof t == "function" ? t(e) : t;
	}
	function os(e) {
		return ss(es(), Fo, e);
	}
	function ss(e, t, n) {
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
				if (f === u.lane ? (Po & f) === f : (Zu & f) === f) {
					var p = u.revertLane;
					if (p === 0) l !== null && (l = l.next = {
						lane: 0,
						revertLane: 0,
						gesture: null,
						action: u.action,
						hasEagerState: u.hasEagerState,
						eagerState: u.eagerState,
						next: null
					}), f === ja && (d = !0);
					else if ((Po & p) === p) {
						u = u.next, p === ja && (d = !0);
						continue;
					} else f = {
						lane: 0,
						revertLane: u.revertLane,
						gesture: null,
						action: u.action,
						hasEagerState: u.hasEagerState,
						eagerState: u.eagerState,
						next: null
					}, l === null ? (c = l = f, s = o) : l = l.next = f, Y.lanes |= p, ad |= p;
					f = u.action, zo && n(o, f), o = u.hasEagerState ? u.eagerState : n(o, f);
				} else p = {
					lane: f,
					revertLane: u.revertLane,
					gesture: u.gesture,
					action: u.action,
					hasEagerState: u.hasEagerState,
					eagerState: u.eagerState,
					next: null
				}, l === null ? (c = l = p, s = o) : l = l.next = p, Y.lanes |= f, ad |= f;
				u = u.next;
			} while (u !== null && u !== t);
			if (l === null ? s = o : l.next = c, !Nr(o, e.memoizedState) && (Dc = !0, d && (n = Ma, n !== null))) throw n;
			e.memoizedState = o, e.baseState = s, e.baseQueue = l, r.lastRenderedState = o;
		}
		return a === null && (r.lanes = 0), [e.memoizedState, r.dispatch];
	}
	function cs(e) {
		var t = es(), n = t.queue;
		if (n === null) throw Error(i(311));
		n.lastRenderedReducer = e;
		var r = n.dispatch, a = n.pending, o = t.memoizedState;
		if (a !== null) {
			n.pending = null;
			var s = a = a.next;
			do
				o = e(o, s.action), s = s.next;
			while (s !== a);
			Nr(o, t.memoizedState) || (Dc = !0), t.memoizedState = o, t.baseQueue === null && (t.baseState = o), n.lastRenderedState = o;
		}
		return [o, r];
	}
	function ls(e, t, n) {
		var r = Y, a = es(), o = J;
		if (o) {
			if (n === void 0) throw Error(i(407));
			n = n();
		} else n = t();
		var s = !Nr((Fo || a).memoizedState, n);
		if (s && (a.memoizedState = n, Dc = !0), a = a.queue, Ps(fs.bind(null, r, a, e), [e]), e = a.getSnapshot !== t || s || Io !== null && !!(Io.memoizedState.tag & 1), ks(e ? 9 : 8, { destroy: void 0 }, ds.bind(null, r, a, n, t), null), e) {
			if (r.flags |= 2048, Xu === null) throw Error(i(349));
			o || Po & 127 || us(r, t, n);
		}
		return n;
	}
	function us(e, t, n) {
		e.flags |= 16384, e = {
			getSnapshot: t,
			value: n
		}, t = Y.updateQueue, t === null ? (t = ts(), Y.updateQueue = t, t.stores = [e]) : (n = t.stores, n === null ? t.stores = [e] : n.push(e));
	}
	function ds(e, t, n, r) {
		t.value = n, t.getSnapshot = r, ps(t) && ms(e);
	}
	function fs(e, t, n) {
		return n(function() {
			ps(t) && ms(e);
		});
	}
	function ps(e) {
		var t = e.getSnapshot;
		e = e.value;
		try {
			var n = t();
			return !Nr(e, n);
		} catch {
			return !0;
		}
	}
	function ms(e) {
		var t = yi(e, 2);
		t !== null && Nd(t, e, 2);
	}
	function hs(e) {
		var t = $o();
		if (typeof e == "function") {
			var n = e;
			if (e = n(), zo) {
				He(!0);
				try {
					n();
				} finally {
					He(!1);
				}
			}
		}
		return t.memoizedState = t.baseState = e, t.queue = {
			pending: null,
			lanes: 0,
			dispatch: null,
			lastRenderedReducer: as,
			lastRenderedState: e
		}, t;
	}
	function gs(e, t, n, r) {
		return e.baseState = n, ss(e, Fo, typeof r == "function" ? r : as);
	}
	function _s(e, t, n, r, a) {
		if (ac(e)) throw Error(i(485));
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
			V.T === null ? o.isTransition = !1 : n(!0), r(o), n = t.pending, n === null ? (o.next = t.pending = o, vs(t, o)) : (o.next = n.next, t.pending = n.next = o);
		}
	}
	function vs(e, t) {
		var n = t.action, r = t.payload, i = e.state;
		if (t.isTransition) {
			var a = V.T, o = {};
			o.types = a === null ? null : a.types, V.T = o;
			try {
				var s = n(i, r), c = V.S;
				c !== null && c(o, s), ys(e, t, s);
			} catch (n) {
				xs(e, t, n);
			} finally {
				a !== null && o.types !== null && (a.types = o.types), V.T = a;
			}
		} else try {
			a = n(i, r), ys(e, t, a);
		} catch (n) {
			xs(e, t, n);
		}
	}
	function ys(e, t, n) {
		typeof n == "object" && n && typeof n.then == "function" ? n.then(function(n) {
			bs(e, t, n);
		}, function(n) {
			return xs(e, t, n);
		}) : bs(e, t, n);
	}
	function bs(e, t, n) {
		t.status = "fulfilled", t.value = n, Ss(t), e.state = n, t = e.pending, t !== null && (n = t.next, n === t ? e.pending = null : (n = n.next, t.next = n, vs(e, n)));
	}
	function xs(e, t, n) {
		var r = e.pending;
		if (e.pending = null, r !== null) {
			r = r.next;
			do
				t.status = "rejected", t.reason = n, Ss(t), t = t.next;
			while (t !== r);
		}
		e.action = null;
	}
	function Ss(e) {
		e = e.listeners;
		for (var t = 0; t < e.length; t++) (0, e[t])();
	}
	function Cs(e, t) {
		return t;
	}
	function ws(e, t) {
		if (J) {
			var n = Xu.formState;
			if (n !== null) {
				a: {
					var r = Y;
					if (J) {
						if (Xi) {
							b: {
								for (var i = Xi, a = Qi; i.nodeType !== 8;) if (!a || (i = dm(i.nextSibling), i === null)) {
									i = null;
									break b;
								}
								a = i.data, i = a === "F!" || a === "F" ? i : null;
							}
							if (i) {
								Xi = dm(i.nextSibling), r = i.data === "F!";
								break a;
							}
						}
						ea(r);
					}
					r = !1;
				}
				r && (t = n[0]);
			}
		}
		return n = $o(), n.memoizedState = n.baseState = t, r = {
			pending: null,
			lanes: 0,
			dispatch: null,
			lastRenderedReducer: Cs,
			lastRenderedState: t
		}, n.queue = r, n = nc.bind(null, Y, r), r.dispatch = n, r = hs(!1), a = ic.bind(null, Y, !1, r.queue), r = $o(), i = {
			state: t,
			dispatch: null,
			action: e,
			pending: null
		}, r.queue = i, n = _s.bind(null, Y, i, a, n), i.dispatch = n, r.memoizedState = e, [
			t,
			n,
			!1
		];
	}
	function Ts(e) {
		return Es(es(), Fo, e);
	}
	function Es(e, t, n) {
		if (t = ss(e, t, Cs)[0], e = os(as)[0], typeof t == "object" && t && typeof t.then == "function") try {
			var r = ns(t);
		} catch (e) {
			throw e === Va ? Ua : e;
		}
		else r = t;
		t = es();
		var i = t.queue, a = i.dispatch;
		return n !== t.memoizedState && (Y.flags |= 2048, ks(9, { destroy: void 0 }, Ds.bind(null, i, n), null)), [
			r,
			a,
			e
		];
	}
	function Ds(e, t) {
		e.action = t;
	}
	function Os(e) {
		var t = es(), n = Fo;
		if (n !== null) return Es(t, n, e);
		es(), t = t.memoizedState, n = es();
		var r = n.queue.dispatch;
		return n.memoizedState = e, [
			t,
			r,
			!1
		];
	}
	function ks(e, t, n, r) {
		return e = {
			tag: e,
			create: n,
			deps: r,
			inst: t,
			next: null
		}, t = Y.updateQueue, t === null && (t = ts(), Y.updateQueue = t), n = t.lastEffect, n === null ? t.lastEffect = e.next = e : (r = n.next, n.next = e, e.next = r, t.lastEffect = e), e;
	}
	function As() {
		return es().memoizedState;
	}
	function js(e, t, n, r) {
		var i = $o();
		Y.flags |= e, i.memoizedState = ks(1 | t, { destroy: void 0 }, n, r === void 0 ? null : r);
	}
	function Ms(e, t, n, r) {
		var i = es();
		r = r === void 0 ? null : r;
		var a = i.memoizedState.inst;
		Fo !== null && r !== null && Go(r, Fo.memoizedState.deps) ? i.memoizedState = ks(t, a, n, r) : (Y.flags |= e, i.memoizedState = ks(1 | t, a, n, r));
	}
	function Ns(e, t) {
		js(8390656, 8, e, t);
	}
	function Ps(e, t) {
		Ms(2048, 8, e, t);
	}
	function Fs(e) {
		Y.flags |= 4;
		var t = Y.updateQueue;
		if (t === null) t = ts(), Y.updateQueue = t, t.events = [e];
		else {
			var n = t.events;
			n === null ? t.events = [e] : n.push(e);
		}
	}
	function Is(e) {
		var t = es().memoizedState;
		return Fs({
			ref: t,
			nextImpl: e
		}), function() {
			if (Yu & 2) throw Error(i(440));
			return t.impl.apply(void 0, arguments);
		};
	}
	function Ls(e, t) {
		return Ms(4, 2, e, t);
	}
	function Rs(e, t) {
		return Ms(4, 4, e, t);
	}
	function zs(e, t) {
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
	function Bs(e, t, n) {
		n = n == null ? null : n.concat([e]), Ms(4, 4, zs.bind(null, t, e), n);
	}
	function Vs() {}
	function Hs(e, t) {
		var n = es();
		t = t === void 0 ? null : t;
		var r = n.memoizedState;
		return t !== null && Go(t, r[1]) ? r[0] : (n.memoizedState = [e, t], e);
	}
	function Us(e, t) {
		var n = es();
		t = t === void 0 ? null : t;
		var r = n.memoizedState;
		if (t !== null && Go(t, r[1])) return r[0];
		if (r = e(), zo) {
			He(!0);
			try {
				e();
			} finally {
				He(!1);
			}
		}
		return n.memoizedState = [r, t], r;
	}
	function Ws(e, t, n) {
		return n === void 0 || Po & 1073741824 && !(Zu & 261930) ? e.memoizedState = t : (e.memoizedState = n, e = jd(), Y.lanes |= e, ad |= e, n);
	}
	function Gs(e, t, n, r) {
		return Nr(n, t) ? n : vo.current === null ? !(Po & 106) || Po & 1073741824 && !(Zu & 261930) ? (Dc = !0, e.memoizedState = n) : (e = jd(), Y.lanes |= e, ad |= e, t) : (e = Ws(e, n, r), Nr(e, t) || (Dc = !0), e);
	}
	function Ks(e, t, n, r, i) {
		var a = H.p;
		H.p = a !== 0 && 8 > a ? a : 8;
		var o = V.T, s = {};
		s.types = o === null ? null : o.types, V.T = s, ic(e, !1, t, n);
		try {
			var c = i(), l = V.S;
			l !== null && l(s, c), typeof c == "object" && c && typeof c.then == "function" ? rc(e, t, Fa(c, r), Ad(e)) : rc(e, t, r, Ad(e));
		} catch (n) {
			rc(e, t, {
				then: function() {},
				status: "rejected",
				reason: n
			}, Ad());
		} finally {
			H.p = a, o !== null && s.types !== null && (o.types = s.types), V.T = o;
		}
	}
	function qs() {}
	function Js(e, t, n, r) {
		if (e.tag !== 5) throw Error(i(476));
		var a = Ys(e).queue;
		Ks(e, a, t, ue, n === null ? qs : function() {
			return Xs(e), n(r);
		});
	}
	function Ys(e) {
		var t = e.memoizedState;
		if (t !== null) return t;
		t = {
			memoizedState: ue,
			baseState: ue,
			baseQueue: null,
			queue: {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: as,
				lastRenderedState: ue
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
				lastRenderedReducer: as,
				lastRenderedState: n
			},
			next: null
		}, e.memoizedState = t, e = e.alternate, e !== null && (e.memoizedState = t), t;
	}
	function Xs(e) {
		var t = Ys(e);
		t.next === null && (t = e.alternate.memoizedState), rc(e, t.next.queue, {}, Ad());
	}
	function Zs() {
		return _a(lh);
	}
	function Qs() {
		return es().memoizedState;
	}
	function $s() {
		return es().memoizedState;
	}
	function ec(e) {
		for (var t = e.return; t !== null;) {
			switch (t.tag) {
				case 24:
				case 3:
					var n = Ad();
					e = co(n);
					var r = lo(t, e, n);
					r !== null && (Nd(r, t, n), uo(r, t, n)), t = { cache: wa() }, e.payload = t;
					return;
			}
			t = t.return;
		}
	}
	function tc(e, t, n) {
		var r = Ad();
		n = {
			lane: r,
			revertLane: 0,
			gesture: null,
			action: n,
			hasEagerState: !1,
			eagerState: null,
			next: null
		}, ac(e) ? oc(t, n) : (n = vi(e, t, n, r), n !== null && (Nd(n, e, r), sc(n, t, r)));
	}
	function nc(e, t, n) {
		rc(e, t, n, Ad());
	}
	function rc(e, t, n, r) {
		var i = {
			lane: r,
			revertLane: 0,
			gesture: null,
			action: n,
			hasEagerState: !1,
			eagerState: null,
			next: null
		};
		if (ac(e)) oc(t, i);
		else {
			var a = e.alternate;
			if (e.lanes === 0 && (a === null || a.lanes === 0) && (a = t.lastRenderedReducer, a !== null)) try {
				var o = t.lastRenderedState, s = a(o, n);
				if (i.hasEagerState = !0, i.eagerState = s, Nr(s, o)) return _i(e, t, i, 0), Xu === null && gi(), !1;
			} catch {}
			if (n = vi(e, t, i, r), n !== null) return Nd(n, e, r), sc(n, t, r), !0;
		}
		return !1;
	}
	function ic(e, t, n, r) {
		if (r = {
			lane: 2,
			revertLane: Pf(),
			gesture: null,
			action: r,
			hasEagerState: !1,
			eagerState: null,
			next: null
		}, ac(e)) {
			if (t) throw Error(i(479));
		} else t = vi(e, n, r, 2), t !== null && Nd(t, e, 2);
	}
	function ac(e) {
		var t = e.alternate;
		return e === Y || t !== null && t === Y;
	}
	function oc(e, t) {
		Ro = Lo = !0;
		var n = e.pending;
		n === null ? t.next = t : (t.next = n.next, n.next = t), e.pending = t;
	}
	function sc(e, t, n) {
		if (n & 4194048) {
			var r = t.lanes;
			r &= e.pendingLanes, n |= r, t.lanes = n, ot(e, n);
		}
	}
	var cc = {
		readContext: _a,
		use: rs,
		useCallback: Wo,
		useContext: Wo,
		useEffect: Wo,
		useImperativeHandle: Wo,
		useLayoutEffect: Wo,
		useInsertionEffect: Wo,
		useMemo: Wo,
		useReducer: Wo,
		useRef: Wo,
		useState: Wo,
		useDebugValue: Wo,
		useDeferredValue: Wo,
		useTransition: Wo,
		useSyncExternalStore: Wo,
		useId: Wo,
		useHostTransitionStatus: Wo,
		useFormState: Wo,
		useActionState: Wo,
		useOptimistic: Wo,
		useMemoCache: Wo,
		useCacheRefresh: Wo,
		useEffectEvent: Wo
	}, lc = {
		readContext: _a,
		use: rs,
		useCallback: function(e, t) {
			return $o().memoizedState = [e, t === void 0 ? null : t], e;
		},
		useContext: _a,
		useEffect: Ns,
		useImperativeHandle: function(e, t, n) {
			n = n == null ? null : n.concat([e]), js(4194308, 4, zs.bind(null, t, e), n);
		},
		useLayoutEffect: function(e, t) {
			return js(4194308, 4, e, t);
		},
		useInsertionEffect: function(e, t) {
			js(4, 2, e, t);
		},
		useMemo: function(e, t) {
			var n = $o();
			t = t === void 0 ? null : t;
			var r = e();
			if (zo) {
				He(!0);
				try {
					e();
				} finally {
					He(!1);
				}
			}
			return n.memoizedState = [r, t], r;
		},
		useReducer: function(e, t, n) {
			var r = $o();
			if (n !== void 0) {
				var i = n(t);
				if (zo) {
					He(!0);
					try {
						n(t);
					} finally {
						He(!1);
					}
				}
			} else i = t;
			return r.memoizedState = r.baseState = i, e = {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: e,
				lastRenderedState: i
			}, r.queue = e, e = e.dispatch = tc.bind(null, Y, e), [r.memoizedState, e];
		},
		useRef: function(e) {
			var t = $o();
			return e = { current: e }, t.memoizedState = e;
		},
		useState: function(e) {
			e = hs(e);
			var t = e.queue, n = nc.bind(null, Y, t);
			return t.dispatch = n, [e.memoizedState, n];
		},
		useDebugValue: Vs,
		useDeferredValue: function(e, t) {
			return Ws($o(), e, t);
		},
		useTransition: function() {
			var e = hs(!1);
			return e = Ks.bind(null, Y, e.queue, !0, !1), $o().memoizedState = e, [!1, e];
		},
		useSyncExternalStore: function(e, t, n) {
			var r = Y, a = $o();
			if (J) {
				if (n === void 0) throw Error(i(407));
				n = n();
			} else {
				if (n = t(), Xu === null) throw Error(i(349));
				Zu & 127 || us(r, t, n);
			}
			a.memoizedState = n;
			var o = {
				value: n,
				getSnapshot: t
			};
			return a.queue = o, Ns(fs.bind(null, r, o, e), [e]), r.flags |= 2048, ks(9, { destroy: void 0 }, ds.bind(null, r, o, n, t), null), n;
		},
		useId: function() {
			var e = $o(), t = Xu.identifierPrefix;
			if (J) {
				var n = Ui, r = Hi;
				n = (r & ~(1 << 32 - Ue(r) - 1)).toString(32) + n, t = "_" + t + "R_" + n, n = Bo++, 0 < n && (t += "H" + n.toString(32)), t += "_";
			} else n = Uo++, t = "_" + t + "r_" + n.toString(32) + "_";
			return e.memoizedState = t;
		},
		useHostTransitionStatus: Zs,
		useFormState: ws,
		useActionState: ws,
		useOptimistic: function(e) {
			var t = $o();
			t.memoizedState = t.baseState = e;
			var n = {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: null,
				lastRenderedState: null
			};
			return t.queue = n, t = ic.bind(null, Y, !0, n), n.dispatch = t, [e, t];
		},
		useMemoCache: is,
		useCacheRefresh: function() {
			return $o().memoizedState = ec.bind(null, Y);
		},
		useEffectEvent: function(e) {
			var t = $o(), n = { impl: e };
			return t.memoizedState = n, function() {
				if (Yu & 2) throw Error(i(440));
				return n.impl.apply(void 0, arguments);
			};
		}
	}, uc = {
		readContext: _a,
		use: rs,
		useCallback: Hs,
		useContext: _a,
		useEffect: Ps,
		useImperativeHandle: Bs,
		useInsertionEffect: Ls,
		useLayoutEffect: Rs,
		useMemo: Us,
		useReducer: os,
		useRef: As,
		useState: function() {
			return os(as);
		},
		useDebugValue: Vs,
		useDeferredValue: function(e, t) {
			return Gs(es(), Fo.memoizedState, e, t);
		},
		useTransition: function() {
			var e = os(as)[0], t = es().memoizedState;
			return [typeof e == "boolean" ? e : ns(e), t];
		},
		useSyncExternalStore: ls,
		useId: Qs,
		useHostTransitionStatus: Zs,
		useFormState: Ts,
		useActionState: Ts,
		useOptimistic: function(e, t) {
			return gs(es(), Fo, e, t);
		},
		useMemoCache: is,
		useCacheRefresh: $s,
		useEffectEvent: Is
	}, dc = {
		readContext: _a,
		use: rs,
		useCallback: Hs,
		useContext: _a,
		useEffect: Ps,
		useImperativeHandle: Bs,
		useInsertionEffect: Ls,
		useLayoutEffect: Rs,
		useMemo: Us,
		useReducer: cs,
		useRef: As,
		useState: function() {
			return cs(as);
		},
		useDebugValue: Vs,
		useDeferredValue: function(e, t) {
			var n = es();
			return Fo === null ? Ws(n, e, t) : Gs(n, Fo.memoizedState, e, t);
		},
		useTransition: function() {
			var e = cs(as)[0], t = es().memoizedState;
			return [typeof e == "boolean" ? e : ns(e), t];
		},
		useSyncExternalStore: ls,
		useId: Qs,
		useHostTransitionStatus: Zs,
		useFormState: Os,
		useActionState: Os,
		useOptimistic: function(e, t) {
			var n = es();
			return Fo === null ? (n.baseState = e, [e, n.queue.dispatch]) : gs(n, Fo, e, t);
		},
		useMemoCache: is,
		useCacheRefresh: $s,
		useEffectEvent: Is
	};
	function fc(e, t, n, r) {
		t = e.memoizedState, n = n(r, t), n = n == null ? t : D({}, t, n), e.memoizedState = n, e.lanes === 0 && (e.updateQueue.baseState = n);
	}
	var pc = {
		enqueueSetState: function(e, t, n) {
			e = e._reactInternals;
			var r = Ad(), i = co(r);
			i.payload = t, n != null && (i.callback = n), t = lo(e, i, r), t !== null && (Nd(t, e, r), uo(t, e, r));
		},
		enqueueReplaceState: function(e, t, n) {
			e = e._reactInternals;
			var r = Ad(), i = co(r);
			i.tag = 1, i.payload = t, n != null && (i.callback = n), t = lo(e, i, r), t !== null && (Nd(t, e, r), uo(t, e, r));
		},
		enqueueForceUpdate: function(e, t) {
			e = e._reactInternals;
			var n = Ad(), r = co(n);
			r.tag = 2, t != null && (r.callback = t), t = lo(e, r, n), t !== null && (Nd(t, e, n), uo(t, e, n));
		}
	};
	function mc(e, t, n, r, i, a, o) {
		return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(r, a, o) : t.prototype && t.prototype.isPureReactComponent ? !Pr(n, r) || !Pr(i, a) : !0;
	}
	function hc(e, t, n, r) {
		e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(n, r), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(n, r), t.state !== e && pc.enqueueReplaceState(t, t.state, null);
	}
	function gc(e, t) {
		var n = t;
		if ("ref" in t) for (var r in n = {}, t) r !== "ref" && (n[r] = t[r]);
		if (e = e.defaultProps) for (var i in n === t && (n = D({}, n)), e) n[i] === void 0 && (n[i] = e[i]);
		return n;
	}
	function _c(e) {
		fi(e);
	}
	function vc(e) {
		console.error(e);
	}
	function yc(e) {
		fi(e);
	}
	function bc(e, t) {
		try {
			var n = e.onUncaughtError;
			n(t.value, { componentStack: t.stack });
		} catch (e) {
			setTimeout(function() {
				throw e;
			});
		}
	}
	function xc(e, t, n) {
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
	function Sc(e, t, n) {
		return n = co(n), n.tag = 3, n.payload = { element: null }, n.callback = function() {
			bc(e, t);
		}, n;
	}
	function Cc(e) {
		return e = co(e), e.tag = 3, e;
	}
	function wc(e, t, n, r) {
		var i = n.type.getDerivedStateFromError;
		if (typeof i == "function") {
			var a = r.value;
			e.payload = function() {
				return i(a);
			}, e.callback = function() {
				xc(t, n, r);
			};
		}
		var o = n.stateNode;
		o !== null && typeof o.componentDidCatch == "function" && (e.callback = function() {
			xc(t, n, r), typeof i != "function" && (_d === null ? _d = /* @__PURE__ */ new Set([this]) : _d.add(this));
			var e = r.stack;
			this.componentDidCatch(r.value, { componentStack: e === null ? "" : e });
		});
	}
	function Tc(e, t, n, r, a) {
		if (n.flags |= 32768, typeof r == "object" && r && typeof r.then == "function") {
			if (t = n.alternate, t !== null && ma(t, n, a, !0), n = Co.current, n !== null) {
				switch (n.tag) {
					case 31:
					case 13:
					case 19: return wo === null ? Gd() : n.alternate === null && id === 0 && (id = 3), n.flags &= -257, n.flags |= 65536, n.lanes = a, r === Wa ? n.flags |= 16384 : (t = n.updateQueue, t === null ? n.updateQueue = /* @__PURE__ */ new Set([r]) : t.add(r), mf(e, r, a)), !1;
					case 22: return n.flags |= 65536, r === Wa ? n.flags |= 16384 : (t = n.updateQueue, t === null ? (t = {
						transitions: null,
						markerInstances: null,
						retryQueue: /* @__PURE__ */ new Set([r])
					}, n.updateQueue = t) : (n = t.retryQueue, n === null ? t.retryQueue = /* @__PURE__ */ new Set([r]) : n.add(r)), mf(e, r, a)), !1;
				}
				throw Error(i(435, n.tag));
			}
			return mf(e, r, a), Gd(), !1;
		}
		if (J) return t = Co.current, t === null ? (r !== $i && (t = Error(i(423), { cause: r }), oa(Pi(t, n))), e = e.current.alternate, e.flags |= 65536, a &= -a, e.lanes |= a, r = Pi(r, n), a = Sc(e.stateNode, r, a), fo(e, a), id !== 4 && (id = 2)) : (!(t.flags & 65536) && (t.flags |= 256), t.flags |= 65536, t.lanes = a, r !== $i && (e = Error(i(422), { cause: r }), oa(Pi(e, n)))), !1;
		var o = Error(i(520), { cause: r });
		if (o = Pi(o, n), ud === null ? ud = [o] : ud.push(o), id !== 4 && (id = 2), t === null) return !0;
		r = Pi(r, n), n = t;
		do {
			switch (n.tag) {
				case 3: return n.flags |= 65536, e = a & -a, n.lanes |= e, e = Sc(n.stateNode, r, e), fo(n, e), !1;
				case 1:
					if (t = n.type, o = n.stateNode, !(n.flags & 128) && (typeof t.getDerivedStateFromError == "function" || o !== null && typeof o.componentDidCatch == "function" && (_d === null || !_d.has(o)))) return n.flags |= 65536, a &= -a, n.lanes |= a, a = Cc(a), wc(a, e, n, r), fo(n, a), !1;
					break;
				case 22: if (n.memoizedState !== null) return n.flags |= 65536, !1;
			}
			n = n.return;
		} while (n !== null);
		return !1;
	}
	var Ec = Error(i(461)), Dc = !1;
	function Oc(e, t, n, r) {
		t.child = e === null ? io(t, null, n, r) : ro(t, e.child, n, r);
	}
	function kc(e, t, n, r, i) {
		n = n.render;
		var a = t.ref;
		if ("ref" in r) {
			var o = {};
			for (var s in r) s !== "ref" && (o[s] = r[s]);
		} else o = r;
		return ga(t), r = Ko(e, t, n, o, a, i), s = Xo(), e !== null && !Dc ? (Zo(e, t, i), rl(e, t, i)) : (J && s && Ki(t), t.flags |= 1, Oc(e, t, r, i), t.child);
	}
	function Ac(e, t, n, r, i) {
		if (e === null) {
			var a = n.type;
			return typeof a == "function" && !Ti(a) && a.defaultProps === void 0 && n.compare === null ? (t.tag = 15, t.type = a, jc(e, t, a, r, i)) : (e = Oi(n.type, null, r, t, t.mode, i), e.ref = t.ref, e.return = t, t.child = e);
		}
		if (a = e.child, !il(e, i)) {
			var o = a.memoizedProps;
			if (n = n.compare, n = n === null ? Pr : n, n(o, r) && e.ref === t.ref) return rl(e, t, i);
		}
		return t.flags |= 1, e = Ei(a, r), e.ref = t.ref, e.return = t, t.child = e;
	}
	function jc(e, t, n, r, i) {
		if (e !== null) {
			var a = e.memoizedProps;
			if (Pr(a, r) && e.ref === t.ref) {
				if (Dc = !1, t.pendingProps = r = a, il(e, i)) e.flags & 131072 && (Dc = !0);
				else return t.lanes = e.lanes, rl(e, t, i);
			}
		}
		return zc(e, t, n, r, i);
	}
	function Mc(e, t, n, r) {
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
				return Pc(e, t, a, n, r);
			}
			if (n & 536870912) t.memoizedState = {
				baseLanes: 0,
				cachePool: null
			}, e !== null && za(t, a === null ? null : a.cachePool), a === null ? xo() : bo(t, a), Do(t);
			else return r = t.lanes = 536870912, Pc(e, t, a === null ? n : a.baseLanes | n, n, r);
		} else a === null ? (e !== null && za(t, null), xo(), Oo()) : (za(t, a.cachePool), bo(t, a), Oo(), t.memoizedState = null);
		return Oc(e, t, i, n), t.child;
	}
	function Nc(e, t) {
		return e !== null && e.tag === 22 || t.stateNode !== null || (t.stateNode = {
			_visibility: 1,
			_pendingMarkers: null,
			_retryCache: null,
			_transitions: null
		}), t.sibling;
	}
	function Pc(e, t, n, r, i) {
		var a = Ra();
		return a = a === null ? null : {
			parent: Ca._currentValue,
			pool: a
		}, t.memoizedState = {
			baseLanes: n,
			cachePool: a
		}, e !== null && za(t, null), xo(), Do(t), e !== null && ma(e, t, r, !0), t.childLanes = i, null;
	}
	function Fc(e, t) {
		return t = Jc({
			mode: t.mode,
			children: t.children
		}, e.mode), t.ref = e.ref, e.child = t, t.return = e, t;
	}
	function Ic(e, t, n) {
		return ro(t, e.child, null, n), e = Fc(t, t.pendingProps), e.flags |= 2, ko(t), t.memoizedState = null, e;
	}
	function Lc(e, t, n) {
		var r = t.pendingProps, a = !!(t.flags & 128);
		if (t.flags &= -129, e === null) {
			if (J) {
				if (r.mode === "hidden") return e = Fc(t, r), t.lanes = 536870912, e.memoizedState = {
					baseLanes: 0,
					cachePool: null
				}, Nc(null, e);
				if (Eo(t), (e = Xi) ? (e = sm(e, Qi), e = e !== null && e.data === "&" ? e : null, e !== null && (t.memoizedState = {
					dehydrated: e,
					treeContext: Vi === null ? null : {
						id: Hi,
						overflow: Ui
					},
					retryLane: 536870912,
					hydrationErrors: null
				}, n = ji(e), n.return = t, t.child = n, Yi = t, Xi = null)) : e = null, e === null) throw ea(t);
				return t.lanes = 536870912, null;
			}
			return Fc(t, r);
		}
		var o = e.memoizedState;
		if (o !== null) {
			var s = o.dehydrated;
			if (Eo(t), a) {
				if (t.flags & 256) t.flags &= -257, t = Ic(e, t, n);
				else if (t.memoizedState !== null) t.child = e.child, t.flags |= 128, t = null;
				else throw Error(i(558));
			} else if (Dc || ma(e, t, n, !1), a = (n & e.childLanes) !== 0, Dc || a) {
				if (vo.current === null) {
					if (r = Xu, r !== null && (s = st(r, n), s !== 0 && s !== o.retryLane)) throw o.retryLane = s, yi(e, s), Nd(r, e, s), Ec;
					Gd();
				}
				t = Ic(e, t, n);
			} else e = o.treeContext, Xi = dm(s.nextSibling), Yi = t, J = !0, Zi = null, Qi = !1, e !== null && Ji(t, e), t = Fc(t, r), t.flags |= 134221824;
			return t;
		}
		return e = Ei(e.child, {
			mode: r.mode,
			children: r.children
		}), e.ref = t.ref, t.child = e, e.return = t, e;
	}
	function Rc(e, t) {
		var n = t.ref;
		if (n === null) e !== null && e.ref !== null && (t.flags |= 4194816);
		else {
			if (typeof n != "function" && typeof n != "object") throw Error(i(284));
			(e === null || e.ref !== n) && (t.flags |= 4194816);
		}
	}
	function zc(e, t, n, r, i) {
		return ga(t), n = Ko(e, t, n, r, void 0, i), r = Xo(), e !== null && !Dc ? (Zo(e, t, i), rl(e, t, i)) : (J && r && Ki(t), t.flags |= 1, Oc(e, t, n, i), t.child);
	}
	function Bc(e, t, n, r, i, a) {
		return ga(t), t.updateQueue = null, n = Jo(t, r, n, i), qo(e), r = Xo(), e !== null && !Dc ? (Zo(e, t, a), rl(e, t, a)) : (J && r && Ki(t), t.flags |= 1, Oc(e, t, n, a), t.child);
	}
	function Vc(e, t, n, r, i) {
		if (ga(t), t.stateNode === null) {
			var a = Si, o = n.contextType;
			typeof o == "object" && o && (a = _a(o)), a = new n(r, a), t.memoizedState = a.state !== null && a.state !== void 0 ? a.state : null, a.updater = pc, t.stateNode = a, a._reactInternals = t, a = t.stateNode, a.props = r, a.state = t.memoizedState, a.refs = {}, oo(t), o = n.contextType, a.context = typeof o == "object" && o ? _a(o) : Si, a.state = t.memoizedState, o = n.getDerivedStateFromProps, typeof o == "function" && (fc(t, n, o, r), a.state = t.memoizedState), typeof n.getDerivedStateFromProps == "function" || typeof a.getSnapshotBeforeUpdate == "function" || typeof a.UNSAFE_componentWillMount != "function" && typeof a.componentWillMount != "function" || (o = a.state, typeof a.componentWillMount == "function" && a.componentWillMount(), typeof a.UNSAFE_componentWillMount == "function" && a.UNSAFE_componentWillMount(), o !== a.state && pc.enqueueReplaceState(a, a.state, null), ho(t, r, a, i), mo(), a.state = t.memoizedState), typeof a.componentDidMount == "function" && (t.flags |= 4194308), r = !0;
		} else if (e === null) {
			a = t.stateNode;
			var s = t.memoizedProps, c = gc(n, s);
			a.props = c;
			var l = a.context, u = n.contextType;
			o = Si, typeof u == "object" && u && (o = _a(u));
			var d = n.getDerivedStateFromProps;
			u = typeof d == "function" || typeof a.getSnapshotBeforeUpdate == "function", s = t.pendingProps !== s, u || typeof a.UNSAFE_componentWillReceiveProps != "function" && typeof a.componentWillReceiveProps != "function" || (s || l !== o) && hc(t, a, r, o), ao = !1;
			var f = t.memoizedState;
			a.state = f, ho(t, r, a, i), mo(), l = t.memoizedState, s || f !== l || ao ? (typeof d == "function" && (fc(t, n, d, r), l = t.memoizedState), (c = ao || mc(t, n, c, r, f, l, o)) ? (u || typeof a.UNSAFE_componentWillMount != "function" && typeof a.componentWillMount != "function" || (typeof a.componentWillMount == "function" && a.componentWillMount(), typeof a.UNSAFE_componentWillMount == "function" && a.UNSAFE_componentWillMount()), typeof a.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof a.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = r, t.memoizedState = l), a.props = r, a.state = l, a.context = o, r = c) : (typeof a.componentDidMount == "function" && (t.flags |= 4194308), r = !1);
		} else {
			a = t.stateNode, so(e, t), o = t.memoizedProps, u = gc(n, o), a.props = u, d = t.pendingProps, f = a.context, l = n.contextType, c = Si, typeof l == "object" && l && (c = _a(l)), s = n.getDerivedStateFromProps, (l = typeof s == "function" || typeof a.getSnapshotBeforeUpdate == "function") || typeof a.UNSAFE_componentWillReceiveProps != "function" && typeof a.componentWillReceiveProps != "function" || (o !== d || f !== c) && hc(t, a, r, c), ao = !1, f = t.memoizedState, a.state = f, ho(t, r, a, i), mo();
			var p = t.memoizedState;
			o !== d || f !== p || ao || e !== null && e.dependencies !== null && ha(e.dependencies) ? (typeof s == "function" && (fc(t, n, s, r), p = t.memoizedState), (u = ao || mc(t, n, u, r, f, p, c) || e !== null && e.dependencies !== null && ha(e.dependencies)) ? (l || typeof a.UNSAFE_componentWillUpdate != "function" && typeof a.componentWillUpdate != "function" || (typeof a.componentWillUpdate == "function" && a.componentWillUpdate(r, p, c), typeof a.UNSAFE_componentWillUpdate == "function" && a.UNSAFE_componentWillUpdate(r, p, c)), typeof a.componentDidUpdate == "function" && (t.flags |= 4), typeof a.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof a.componentDidUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 4), typeof a.getSnapshotBeforeUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 1024), t.memoizedProps = r, t.memoizedState = p), a.props = r, a.state = p, a.context = c, r = u) : (typeof a.componentDidUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 4), typeof a.getSnapshotBeforeUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 1024), r = !1);
		}
		return a = r, Rc(e, t), r = !!(t.flags & 128), a || r ? (a = t.stateNode, n = r && typeof n.getDerivedStateFromError != "function" ? null : a.render(), t.flags |= 1, e !== null && r ? (t.child = ro(t, e.child, null, i), t.child = ro(t, null, n, i)) : Oc(e, t, n, i), t.memoizedState = a.state, e = t.child) : e = rl(e, t, i), e;
	}
	function Hc(e, t, n, r) {
		return ia(), t.flags |= 256, Oc(e, t, n, r), t.child;
	}
	var Uc = {
		dehydrated: null,
		treeContext: null,
		retryLane: 0,
		hydrationErrors: null
	};
	function Wc(e) {
		return {
			baseLanes: e,
			cachePool: Ba()
		};
	}
	function Gc(e, t, n) {
		return e = e === null ? 0 : e.childLanes & ~n, t && (e |= cd), e;
	}
	function Kc(e, t, n) {
		var r = t.pendingProps, i = !1, a = !!(t.flags & 128), o;
		if ((o = a) || (o = e !== null && e.memoizedState === null ? !1 : !!(Ao.current & 2)), o && (i = !0, t.flags &= -129), o = !!(t.flags & 32), t.flags &= -33, e === null) {
			if (J) {
				if (i ? To(t) : Oo(), (e = Xi) ? (e = sm(e, Qi), e = e !== null && e.data !== "&" ? e : null, e !== null && (t.memoizedState = {
					dehydrated: e,
					treeContext: Vi === null ? null : {
						id: Hi,
						overflow: Ui
					},
					retryLane: 536870912,
					hydrationErrors: null
				}, n = ji(e), n.return = t, t.child = n, Yi = t, Xi = null)) : e = null, e === null) throw ea(t);
				return t.lanes = lm(e) ? 32 : 536870912, null;
			}
			return a = r.children, r = r.fallback, i ? (Oo(), i = t.mode, a = Jc({
				mode: "hidden",
				children: a
			}, i), r = ki(r, i, n, null), a.return = t, r.return = t, a.sibling = r, t.child = a, r = t.child, r.memoizedState = Wc(n), r.childLanes = Gc(e, o, n), t.memoizedState = Uc, Nc(null, r)) : (To(t), qc(t, a));
		}
		var s = e.memoizedState;
		if (s !== null) {
			var c = s.dehydrated;
			if (c !== null) return Xc(e, t, a, o, r, c, s, n);
		}
		return i ? (Oo(), i = r.fallback, a = t.mode, s = e.child, c = s.sibling, r = Ei(s, {
			mode: "hidden",
			children: r.children
		}), r.subtreeFlags = s.subtreeFlags & 1206910976, c === null ? (i = ki(i, a, n, null), i.flags |= 2) : i = Ei(c, i), i.return = t, r.return = t, r.sibling = i, t.child = r, Nc(null, r), r = t.child, i = e.child.memoizedState, i === null ? i = Wc(n) : (a = i.cachePool, a === null ? a = Ba() : (s = Ca._currentValue, a = a.parent === s ? a : {
			parent: s,
			pool: s
		}), i = {
			baseLanes: i.baseLanes | n,
			cachePool: a
		}), r.memoizedState = i, r.childLanes = Gc(e, o, n), t.memoizedState = Uc, Nc(e.child, r)) : (To(t), n = e.child, e = n.sibling, n = Ei(n, {
			mode: "visible",
			children: r.children
		}), n.return = t, n.sibling = null, e !== null && (o = t.deletions, o === null ? (t.deletions = [e], t.flags |= 16) : o.push(e)), t.child = n, t.memoizedState = null, n);
	}
	function qc(e, t) {
		return t = Jc({
			mode: "visible",
			children: t
		}, e.mode), t.return = e, e.child = t;
	}
	function Jc(e, t) {
		return e = wi(22, e, null, t), e.lanes = 0, e;
	}
	function Yc(e, t, n) {
		return ro(t, e.child, null, n), e = qc(t, t.pendingProps.children), e.flags |= 2, t.memoizedState = null, e;
	}
	function Xc(e, t, n, r, a, o, s, c) {
		if (n) return t.flags & 256 ? (To(t), t.flags &= -257, Yc(e, t, c)) : t.memoizedState === null ? (Oo(), o = a.fallback, s = t.mode, a = Jc({
			mode: "visible",
			children: a.children
		}, s), o = ki(o, s, c, null), o.flags |= 2, a.return = t, o.return = t, a.sibling = o, t.child = a, ro(t, e.child, null, c), a = t.child, a.memoizedState = Wc(c), a.childLanes = Gc(e, r, c), t.memoizedState = Uc, Nc(null, a)) : (Oo(), t.child = e.child, t.flags |= 128, null);
		if (To(t), lm(o)) {
			if (r = o.nextSibling && o.nextSibling.dataset, r) var l = r.dgst;
			return r = l, r !== "" && (a = Error(i(419)), a.stack = "", a.digest = r, oa({
				value: a,
				source: null,
				stack: null
			})), Yc(e, t, c);
		}
		if (Dc || ma(e, t, c, !1), r = (c & e.childLanes) !== 0, Dc || r) {
			if (vo.current !== null) return Yc(e, t, c);
			if (r = Xu, r !== null && (a = st(r, c), a !== 0 && a !== s.retryLane)) throw s.retryLane = a, yi(e, a), Nd(r, e, a), Ec;
			return cm(o) || Gd(), Yc(e, t, c);
		}
		return cm(o) ? (t.flags |= 192, t.child = e.child, null) : (e = s.treeContext, Xi = dm(o.nextSibling), Yi = t, J = !0, Zi = null, Qi = !1, e !== null && Ji(t, e), t = qc(t, a.children), t.flags |= 134221824, t);
	}
	function Zc(e, t, n) {
		e.lanes |= t;
		var r = e.alternate;
		r !== null && (r.lanes |= t), fa(e.return, t, n);
	}
	function Qc(e) {
		for (var t = null; e !== null;) {
			var n = e.alternate;
			n !== null && No(n) === null && (t = e), e = e.sibling;
		}
		return t;
	}
	function $c(e, t, n, r, i, a) {
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
	function el(e) {
		var t = e.child;
		for (e.child = null; t !== null;) {
			var n = t.sibling;
			t.sibling = e.child, e.child = t, t = n;
		}
	}
	function tl(e, t, n) {
		var r = t.pendingProps, i = r.revealOrder, a = r.tail;
		r = r.children;
		var o = Ao.current;
		if (t.flags & 128) return jo(t, o), null;
		var s = !!(o & 2);
		if (s ? (o = o & 1 | 2, t.flags |= 128) : o &= 1, jo(t, o), i === "backwards" && e !== null ? (el(e), Oc(e, t, r, n), el(e)) : Oc(e, t, r, n), r = J ? Ri : 0, !s && e !== null && e.flags & 128) a: for (e = t.child; e !== null;) {
			if (e.tag === 13) e.memoizedState !== null && Zc(e, n, t);
			else if (e.tag === 19) Zc(e, n, t);
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
				n = Qc(t.child), n === null ? (i = t.child, t.child = null) : (i = n.sibling, n.sibling = null, el(t)), $c(t, !0, i, null, a, r);
				break;
			case "unstable_legacy-backwards":
				for (n = null, i = t.child, t.child = null; i !== null;) {
					if (e = i.alternate, e !== null && No(e) === null) {
						t.child = i;
						break;
					}
					e = i.sibling, i.sibling = n, n = i, i = e;
				}
				$c(t, !0, n, null, a, r);
				break;
			case "together":
				$c(t, !1, null, null, void 0, r);
				break;
			case "independent":
				t.memoizedState = null;
				break;
			default: n = Qc(t.child), n === null ? (i = t.child, t.child = null) : (i = n.sibling, n.sibling = null), $c(t, !1, i, n, a, r);
		}
		return t.child;
	}
	function nl(e, t, n) {
		var r = t.pendingProps;
		return ua(t, t.type, r.value), Oc(e, t, r.children, n), t.child;
	}
	function rl(e, t, n) {
		if (e !== null && (t.dependencies = e.dependencies), ad |= t.lanes, (n & t.childLanes) === 0) {
			if (e !== null) {
				if (ma(e, t, n, !1), (n & t.childLanes) === 0) return null;
			} else return null;
		}
		if (e !== null && t.child !== e.child) throw Error(i(153));
		if (t.child !== null) {
			for (e = t.child, n = Ei(e, e.pendingProps), t.child = n, n.return = t; e.sibling !== null;) e = e.sibling, n = n.sibling = Ei(e, e.pendingProps), n.return = t;
			n.sibling = null;
		}
		return t.child;
	}
	function il(e, t) {
		return (e.lanes & t) !== 0 || (e = e.dependencies, !!(e !== null && ha(e)));
	}
	function al(e, t, n) {
		switch (t.tag) {
			case 3:
				ge(t, t.stateNode.containerInfo), ua(t, Ca, e.memoizedState.cache), ia();
				break;
			case 27:
			case 5:
				ve(t);
				break;
			case 4:
				ge(t, t.stateNode.containerInfo);
				break;
			case 10:
				ua(t, t.type, t.memoizedProps.value);
				break;
			case 31:
				if (t.memoizedState !== null) return t.flags |= 128, Eo(t), null;
				break;
			case 13:
				var r = t.memoizedState;
				if (r !== null) {
					if (r.dehydrated !== null) return To(t), t.flags |= 128, null;
					r = ma(e, t, n, !1);
					var i = t.child.childLanes;
					return r || (n & i) !== 0 ? Kc(e, t, n) : (To(t), e = rl(e, t, n), e === null ? null : e.sibling);
				}
				To(t);
				break;
			case 19:
				if (t.flags & 128) return tl(e, t, n);
				if (i = !!(e.flags & 128), r = (n & t.childLanes) !== 0, r ||= (ma(e, t, n, !1), (n & t.childLanes) !== 0), i) {
					if (r) return tl(e, t, n);
					t.flags |= 128;
				}
				if (i = t.memoizedState, i !== null && (i.rendering = null, i.tail = null, i.lastEffect = null), jo(t, Ao.current), r) break;
				return null;
			case 22: return t.lanes = 0, Mc(e, t, n, t.pendingProps);
			case 24: ua(t, Ca, e.memoizedState.cache);
		}
		return rl(e, t, n);
	}
	function ol(e, t, n) {
		if (e !== null) {
			if (e.memoizedProps !== t.pendingProps) Dc = !0;
			else {
				if (!il(e, n) && !(t.flags & 128)) return Dc = !1, al(e, t, n);
				Dc = !!(e.flags & 131072);
			}
		} else Dc = !1, J && t.flags & 1048576 && Gi(t, Ri, t.index);
		switch (t.lanes = 0, t.tag) {
			case 16:
				a: {
					var r = t.pendingProps;
					if (e = qa(t.elementType), t.type = e, typeof e == "function") Ti(e) ? (r = gc(e, r), t.tag = 1, t = Vc(null, t, e, r, n)) : (t.tag = 0, t = zc(null, t, e, r, n));
					else {
						if (e != null) {
							var a = e.$$typeof;
							if (a === I) {
								t.tag = 11, t = kc(null, t, e, r, n);
								break a;
							}
							if (a === R) {
								t.tag = 14, t = Ac(null, t, e, r, n);
								break a;
							}
							if (a === F) {
								t.tag = 10, t.type = e, t = nl(null, t, n);
								break a;
							}
						}
						throw t = le(e) || e, Error(i(306, t, ""));
					}
				}
				return t;
			case 0: return zc(e, t, t.type, t.pendingProps, n);
			case 1: return r = t.type, a = gc(r, t.pendingProps), Vc(e, t, r, a, n);
			case 3:
				a: {
					if (ge(t, t.stateNode.containerInfo), e === null) throw Error(i(387));
					r = t.pendingProps;
					var o = t.memoizedState;
					a = o.element, so(e, t), ho(t, r, null, n);
					var s = t.memoizedState;
					if (r = s.cache, ua(t, Ca, r), r !== o.cache && pa(t, [Ca], n, !0), mo(), r = s.element, o.isDehydrated) {
						if (o = {
							element: r,
							isDehydrated: !1,
							cache: s.cache
						}, t.updateQueue.baseState = o, t.memoizedState = o, t.flags & 256) {
							t = Hc(e, t, r, n);
							break a;
						}
						if (r !== a) {
							a = Pi(Error(i(424)), t), oa(a), t = Hc(e, t, r, n);
							break a;
						}
						switch (e = t.stateNode.containerInfo, e.nodeType) {
							case 9:
								e = e.body;
								break;
							default: e = e.nodeName === "HTML" ? e.ownerDocument.body : e;
						}
						for (Xi = dm(e.firstChild), Yi = t, J = !0, Zi = null, Qi = !0, n = io(t, null, r, n), t.child = n; n;) n.flags = n.flags & -3 | 134221824, n = n.sibling;
					} else {
						if (ia(), r === a) {
							t = rl(e, t, n);
							break a;
						}
						Oc(e, t, r, n);
					}
					t = t.child;
				}
				return t;
			case 26: return Rc(e, t), e === null ? (n = Fm(t.type, null, t.pendingProps, null)) ? t.memoizedState = n : J || (t.stateNode = mp(t.type, t.pendingProps, G.current, t)) : t.memoizedState = Fm(t.type, e.memoizedProps, t.pendingProps, e.memoizedState), null;
			case 27: return ve(t), e === null && J && (r = t.stateNode = _m(t.type, t.pendingProps, G.current), Yi = t, Qi = !0, a = Xi, wp(t.type) ? (fm = a, Xi = dm(r.firstChild)) : Xi = a), Oc(e, t, t.pendingProps.children, n), Rc(e, t), e === null && (t.flags |= 4194304), t.child;
			case 5: return e === null && J && ((a = r = Xi) && (r = am(r, t.type, t.pendingProps, Qi), r === null ? a = !1 : (t.stateNode = r, Yi = t, Xi = dm(r.firstChild), Qi = !1, a = !0)), a || ea(t)), ve(t), a = t.type, o = t.pendingProps, s = e === null ? null : e.memoizedProps, r = o.children, hp(a, o) ? r = null : s !== null && hp(a, s) && (t.flags |= 32), t.memoizedState !== null && (a = Ko(e, t, Yo, null, null, n), lh._currentValue = a), Rc(e, t), Oc(e, t, r, n), t.child;
			case 6: return e === null && J && ((e = n = Xi) && (n = om(n, t.pendingProps, Qi), n === null ? e = !1 : (t.stateNode = n, Yi = t, Xi = null, e = !0)), e || ea(t)), null;
			case 13: return Kc(e, t, n);
			case 4: return ge(t, t.stateNode.containerInfo), r = t.pendingProps, e === null ? t.child = ro(t, null, r, n) : Oc(e, t, r, n), t.child;
			case 11: return kc(e, t, t.type, t.pendingProps, n);
			case 7: return r = t.pendingProps, Rc(e, t), Oc(e, t, r, n), t.child;
			case 8: return Oc(e, t, t.pendingProps.children, n), t.child;
			case 12: return Oc(e, t, t.pendingProps.children, n), t.child;
			case 10: return nl(e, t, n);
			case 9: return a = t.type._context, r = t.pendingProps.children, ga(t), a = _a(a), r = r(a), t.flags |= 1, Oc(e, t, r, n), t.child;
			case 14: return Ac(e, t, t.type, t.pendingProps, n);
			case 15: return jc(e, t, t.type, t.pendingProps, n);
			case 19: return tl(e, t, n);
			case 31: return Lc(e, t, n);
			case 22: return Mc(e, t, n, t.pendingProps);
			case 24: return ga(t), r = _a(Ca), e === null ? (a = Ra(), a === null && (a = Xu, o = wa(), a.pooledCache = o, o.refCount++, o !== null && (a.pooledCacheLanes |= n), a = o), t.memoizedState = {
				parent: r,
				cache: a
			}, oo(t), ua(t, Ca, a)) : ((e.lanes & n) !== 0 && (so(e, t), ho(t, null, null, n), mo()), a = e.memoizedState, o = t.memoizedState, a.parent === r ? (r = o.cache, ua(t, Ca, r), r !== a.cache && pa(t, [Ca], n, !0)) : (a = {
				parent: r,
				cache: r
			}, t.memoizedState = a, t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = a), ua(t, Ca, r))), Oc(e, t, t.pendingProps.children, n), t.child;
			case 30: return t.stateNode === null && (t.stateNode = {
				autoName: null,
				paired: null,
				clones: null,
				ref: null
			}), r = t.pendingProps, r.name != null && r.name !== "auto" ? t.flags |= e === null ? 18882560 : 18874368 : J && Ki(t), e !== null && e.memoizedProps.name !== r.name ? t.flags |= 4194816 : Rc(e, t), Oc(e, t, r.children, n), t.child;
			case 29: throw t.pendingProps;
		}
		throw Error(i(156, t.tag));
	}
	function sl(e) {
		e.flags |= 4;
	}
	function cl(e, t, n, r, i) {
		var a;
		if ((a = !!(e.mode & 32)) && (a = n === null ? Xm(t, r) : Xm(t, r) && (r.src !== n.src || r.srcSet !== n.srcSet)), a) {
			if (e.flags |= 16777216, (i & 335544128) === i) {
				if (e.stateNode.complete) e.flags |= 8192;
				else if (Hd()) e.flags |= 8192;
				else throw Ja = Wa, Ha;
			}
		} else e.flags &= -16777217;
	}
	function ll(e, t) {
		if (t.type !== "stylesheet" || t.state.loading & 4) e.flags &= -16777217;
		else if (e.flags |= 16777216, !Zm(t)) {
			if (Hd()) e.flags |= 8192;
			else throw Ja = Wa, Ha;
		}
	}
	function ul(e, t) {
		t !== null && (e.flags |= 4), e.flags & 16384 && (t = e.tag === 22 ? 536870912 : tt(), e.lanes |= t, ld |= t);
	}
	function dl(e, t) {
		if (!J) switch (e.tailMode) {
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
	function fl(e) {
		var t = e.alternate !== null && e.alternate.child === e.child, n = 0, r = 0;
		if (t) for (var i = e.child; i !== null;) n |= i.lanes | i.childLanes, r |= i.subtreeFlags & 1206910976, r |= i.flags & 1206910976, i.return = e, i = i.sibling;
		else for (i = e.child; i !== null;) n |= i.lanes | i.childLanes, r |= i.subtreeFlags, r |= i.flags, i.return = e, i = i.sibling;
		return e.subtreeFlags |= r, e.childLanes = n, t;
	}
	function pl(e, t, n) {
		var r = t.pendingProps;
		switch (qi(t), t.tag) {
			case 16:
			case 15:
			case 0:
			case 11:
			case 7:
			case 8:
			case 12:
			case 9:
			case 14: return fl(t), null;
			case 1: return fl(t), null;
			case 3: return n = t.stateNode, r = null, e !== null && (r = e.memoizedState.cache), t.memoizedState.cache !== r && (t.flags |= 2048), da(Ca), _e(), n.pendingContext && (n.context = n.pendingContext, n.pendingContext = null), (e === null || e.child === null) && (ra(t) ? sl(t) : e === null || e.memoizedState.isDehydrated && !(t.flags & 256) || (t.flags |= 1024, aa())), fl(t), null;
			case 26:
				var a = t.type, o = t.memoizedState;
				return e === null ? (sl(t), o === null ? (fl(t), cl(t, a, null, r, n)) : (fl(t), ll(t, o))) : o ? o === e.memoizedState ? (fl(t), t.flags &= -16777217) : (sl(t), fl(t), ll(t, o)) : (e = e.memoizedProps, e !== r && sl(t), fl(t), cl(t, a, e, r, n)), null;
			case 27:
				if (ye(t), n = G.current, a = t.type, e !== null && t.stateNode != null) e.memoizedProps !== r && sl(t);
				else {
					if (!r) {
						if (t.stateNode === null) throw Error(i(166));
						return fl(t), t.subtreeFlags &= -33554433, null;
					}
					e = he.current, ra(t) ? ta(t, e) : (e = _m(a, r, n), t.stateNode = e, sl(t));
				}
				return fl(t), t.subtreeFlags &= -33554433, null;
			case 5:
				if (ye(t), a = t.type, e !== null && t.stateNode != null) e.memoizedProps !== r && sl(t);
				else {
					if (!r) {
						if (t.stateNode === null) throw Error(i(166));
						return fl(t), t.subtreeFlags &= -33554433, null;
					}
					if (o = he.current, ra(t)) ta(t, o);
					else {
						var s = dp(G.current);
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
						o[pt] = t, o[mt] = r;
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
						a: switch (ip(o, a, r), a) {
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
						r && sl(t);
					}
				}
				return fl(t), t.subtreeFlags &= -33554433, cl(t, t.type, e === null ? null : e.memoizedProps, t.pendingProps, n), null;
			case 6:
				if (e && t.stateNode != null) e.memoizedProps !== r && sl(t);
				else {
					if (typeof r != "string" && t.stateNode === null) throw Error(i(166));
					if (e = G.current, ra(t)) {
						if (e = t.stateNode, n = t.memoizedProps, r = null, a = Yi, a !== null) switch (a.tag) {
							case 27:
							case 5: r = a.memoizedProps;
						}
						e[pt] = t, e = !!(e.nodeValue === n || r !== null && !0 === r.suppressHydrationWarning || tp(e.nodeValue, n)), e || ea(t, !0);
					} else e = dp(e).createTextNode(r), e[pt] = t, t.stateNode = e;
				}
				return fl(t), null;
			case 31:
				if (n = t.memoizedState, e === null || e.memoizedState !== null) {
					if (r = ra(t), n !== null) {
						if (e === null) {
							if (!r) throw Error(i(318));
							if (e = t.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(i(557));
							e[pt] = t;
						} else ia(), !(t.flags & 128) && (t.memoizedState = null), t.flags |= 4;
						fl(t), e = !1;
					} else n = aa(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = n), e = !0;
					if (!e) return t.flags & 256 ? (ko(t), t) : (ko(t), null);
					if (t.flags & 128) throw Error(i(558));
				}
				return fl(t), null;
			case 13:
				if (r = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
					if (a = ra(t), r !== null && r.dehydrated !== null) {
						if (e === null) {
							if (!a) throw Error(i(318));
							if (a = t.memoizedState, a = a === null ? null : a.dehydrated, !a) throw Error(i(317));
							a[pt] = t;
						} else ia(), !(t.flags & 128) && (t.memoizedState = null), t.flags |= 4;
						fl(t), a = !1;
					} else a = aa(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = a), a = !0;
					if (!a) return t.flags & 256 ? (ko(t), t) : (ko(t), null);
				}
				return ko(t), t.flags & 128 ? (t.lanes = n, t) : (n = r !== null, e = e !== null && e.memoizedState !== null, n && (r = t.child, a = null, r.alternate !== null && r.alternate.memoizedState !== null && r.alternate.memoizedState.cachePool !== null && (a = r.alternate.memoizedState.cachePool.pool), o = null, r.memoizedState !== null && r.memoizedState.cachePool !== null && (o = r.memoizedState.cachePool.pool), o !== a && (r.flags |= 2048)), n !== e && n && (t.child.flags |= 8192), ul(t, t.updateQueue), fl(t), null);
			case 4: return _e(), e === null && Gf(t.stateNode.containerInfo), t.flags |= 67108864, fl(t), null;
			case 10: return da(t.type), fl(t), null;
			case 19:
				if (Mo(t), r = t.memoizedState, r === null) return fl(t), null;
				if (a = !!(t.flags & 128), o = r.rendering, o === null) {
					if (a) dl(r, !1);
					else {
						if (id !== 0 || e !== null && e.flags & 128) for (e = t.child; e !== null;) {
							if (o = No(e), o !== null) {
								for (t.flags |= 128, dl(r, !1), e = o.updateQueue, t.updateQueue = e, ul(t, e), t.subtreeFlags = 0, e = n, n = t.child; n !== null;) Di(n, e), n = n.sibling;
								return jo(t, Ao.current & 1 | 2), J && Wi(t, r.treeForkCount), t.child;
							}
							e = e.sibling;
						}
						r.tail !== null && Me() > hd && (t.flags |= 128, a = !0, dl(r, !1), t.lanes = 4194304);
					}
				} else {
					if (!a) {
						if (e = No(o), e !== null) {
							if (t.flags |= 128, a = !0, e = e.updateQueue, t.updateQueue = e, ul(t, e), dl(r, !0), r.tail === null && r.tailMode !== "collapsed" && r.tailMode !== "visible" && !o.alternate && !J) return fl(t), null;
						} else 2 * Me() - r.renderingStartTime > hd && n !== 536870912 && (t.flags |= 128, a = !0, dl(r, !1), t.lanes = 4194304);
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
					return r.rendering = e, r.tail = e.sibling, r.renderingStartTime = Me(), e.sibling = null, o = Ao.current, o = a ? o & 1 | 2 : o & 1, r.tailMode === "visible" || r.tailMode === "collapsed" || !n || J ? jo(t, o) : (n = o, U(Co, t), U(Ao, n), wo === null && (wo = t)), J && Wi(t, r.treeForkCount), e;
				}
				return fl(t), null;
			case 22:
			case 23: return ko(t), So(), r = t.memoizedState !== null, e === null ? r && (t.flags |= 8192) : e.memoizedState !== null !== r && (t.flags |= 8192), r ? n & 536870912 && !(t.flags & 128) && (fl(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : fl(t), n = t.updateQueue, n !== null && ul(t, n.retryQueue), n = null, e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), r = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (r = t.memoizedState.cachePool.pool), r !== n && (t.flags |= 2048), e !== null && me(La), null;
			case 24: return n = null, e !== null && (n = e.memoizedState.cache), t.memoizedState.cache !== n && (t.flags |= 2048), da(Ca), fl(t), null;
			case 25: return null;
			case 30: return t.flags |= 33554432, fl(t), null;
		}
		throw Error(i(156, t.tag));
	}
	function ml(e, t) {
		switch (qi(t), t.tag) {
			case 1: return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 3: return da(Ca), _e(), e = t.flags, e & 65536 && !(e & 128) ? (t.flags = e & -65537 | 128, t) : null;
			case 26:
			case 27:
			case 5: return ye(t), null;
			case 31:
				if (t.memoizedState !== null) {
					if (ko(t), t.alternate === null) throw Error(i(340));
					ia();
				}
				return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 13:
				if (ko(t), e = t.memoizedState, e !== null && e.dehydrated !== null) {
					if (t.alternate === null) throw Error(i(340));
					ia();
				}
				return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 19: return Mo(t), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, e = t.memoizedState, e !== null && (e.rendering = null, e.tail = null), t.flags |= 4, t) : null;
			case 4: return _e(), null;
			case 10: return da(t.type), null;
			case 22:
			case 23: return ko(t), So(), e !== null && me(La), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 24: return da(Ca), null;
			case 25: return null;
			default: return null;
		}
	}
	function hl(e, t) {
		switch (qi(t), t.tag) {
			case 3:
				da(Ca), _e();
				break;
			case 26:
			case 27:
			case 5:
				ye(t);
				break;
			case 4:
				_e();
				break;
			case 31:
				t.memoizedState !== null && ko(t);
				break;
			case 13:
				ko(t);
				break;
			case 19:
				Mo(t);
				break;
			case 10:
				da(t.type);
				break;
			case 22:
			case 23:
				ko(t), So(), e !== null && me(La);
				break;
			case 24: da(Ca);
		}
	}
	function gl(e, t) {
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
			pf(t, t.return, e);
		}
	}
	function _l(e, t, n) {
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
								pf(i, c, e);
							}
						}
					}
					r = r.next;
				} while (r !== a);
			}
		} catch (e) {
			pf(t, t.return, e);
		}
	}
	function vl(e) {
		var t = e.updateQueue;
		if (t !== null) {
			var n = e.stateNode;
			try {
				_o(t, n);
			} catch (t) {
				pf(e, e.return, t);
			}
		}
	}
	function yl(e, t, n) {
		n.props = gc(e.type, e.memoizedProps), n.state = e.memoizedState;
		try {
			n.componentWillUnmount();
		} catch (n) {
			pf(e, t, n);
		}
	}
	function bl(e, t) {
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
						var i = e.stateNode, a = li(e.memoizedProps, i);
						(i.ref === null || i.ref.name !== a) && (i.ref = Ip(a)), r = i.ref;
						break;
					case 7:
						if (e.stateNode === null) {
							var o = new Lp(e);
							h(e.child, !1, em, o, void 0, void 0), e.stateNode = o;
						}
						r = e.stateNode;
						break;
					default: r = e.stateNode;
				}
				typeof n == "function" ? e.refCleanup = n(r) : n.current = r;
			}
		} catch (n) {
			pf(e, t, n);
		}
	}
	function xl(e, t) {
		var n = e.ref, r = e.refCleanup;
		if (n !== null) {
			if (typeof r == "function") try {
				r();
			} catch (n) {
				pf(e, t, n);
			} finally {
				e.refCleanup = null, e = e.alternate, e != null && (e.refCleanup = null);
			}
			else if (typeof n == "function") try {
				n(null);
			} catch (n) {
				pf(e, t, n);
			}
			else n.current = null;
		}
	}
	function Sl(e, t) {
		if ((e.tag === 5 || e.tag === 27 || e.tag === 6) && e.alternate === null && t !== null) for (var n = 0; n < t.length; n++) nm(e.stateNode, t[n]);
	}
	function Cl(e) {
		for (var t = e.return; t !== null && (Tl(t) && nm(e.stateNode, t.stateNode), !wl(t));) t = t.return;
	}
	function X(e) {
		for (var t = e.return; t !== null && (Tl(t) && rm(e.stateNode, t.stateNode), !wl(t));) t = t.return;
	}
	function wl(e) {
		return e.tag === 5 || e.tag === 3 || e.tag === 27;
	}
	function Tl(e) {
		return e && e.tag === 7 && e.stateNode !== null;
	}
	function El(e) {
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
			pf(e, e.return, t);
		}
	}
	function Dl(e, t, n) {
		try {
			var r = e.stateNode;
			op(r, e.type, n, t), r[mt] = t;
		} catch (t) {
			pf(e, e.return, t);
		}
	}
	function Ol(e) {
		return e.tag === 5 || e.tag === 3 || e.tag === 26 || e.tag === 27 && wp(e.type) || e.tag === 4;
	}
	function kl(e) {
		a: for (;;) {
			for (; e.sibling === null;) {
				if (e.return === null || Ol(e.return)) return null;
				e = e.return;
			}
			for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18;) {
				if (e.tag === 27 && wp(e.type) || e.flags & 2 || e.child === null || e.tag === 4) continue a;
				e.child.return = e, e = e.child;
			}
			if (!(e.flags & 2)) return e.stateNode;
		}
	}
	function Al(e, t, n, r) {
		var i = e.tag;
		if (i === 5 || i === 6) i = e.stateNode, t ? (n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n).insertBefore(i, t) : (t = n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n, t.appendChild(i), n = n._reactRootContainer, n != null || t.onclick !== null || (t.onclick = un)), Sl(e, r), Lt = !0;
		else if (i !== 4 && (i === 27 && (Sl(e, r), r = null, wp(e.type) && (n = e.stateNode, t = null)), e = e.child, e !== null)) for (Al(e, t, n, r), e = e.sibling; e !== null;) Al(e, t, n, r), e = e.sibling;
	}
	function jl(e, t, n, r) {
		var i = e.tag;
		if (i === 5 || i === 6) i = e.stateNode, t ? n.insertBefore(i, t) : n.appendChild(i), Sl(e, r), Lt = !0;
		else if (i !== 4 && (i === 27 && (Sl(e, r), r = null, wp(e.type) && (n = e.stateNode)), e = e.child, e !== null)) for (jl(e, t, n, r), e = e.sibling; e !== null;) jl(e, t, n, r), e = e.sibling;
	}
	function Ml(e) {
		var t = e.stateNode, n = e.memoizedProps;
		try {
			for (var r = e.type, i = t.attributes; i.length;) t.removeAttributeNode(i[0]);
			ip(t, r, n), t[pt] = e, t[mt] = n;
		} catch (t) {
			pf(e, e.return, t);
		}
	}
	var Nl = !1, Pl = null;
	function Fl(e) {
		(e.tag === 30 || e.subtreeFlags & 33554432) && (Nl = !0);
	}
	var Il = null;
	function Ll() {
		var e = Il;
		return Il = null, e;
	}
	var Rl = 0;
	function zl(e, t, n, r, i) {
		return Rl = 0, Bl(e.child, t, n, r, i);
	}
	function Bl(e, t, n, r, i) {
		for (var a = !1; e !== null;) {
			if (e.tag === 5) {
				var o = e.stateNode;
				if (r !== null) {
					var s = Ap(o);
					r.push(s), s.view && (a = !0);
				} else a || Ap(o).view && (a = !0);
				Nl = !0, Dp(o, Rl === 0 ? t : t + "_" + Rl, n), Rl++;
			} else e.tag === 22 && e.memoizedState !== null || e.tag === 30 && i || Bl(e.child, t, n, r, i) && (a = !0);
			e = e.sibling;
		}
		return a;
	}
	function Vl(e, t) {
		for (; e !== null;) e.tag === 5 ? Op(e.stateNode, e.memoizedProps) : e.tag === 22 && e.memoizedState !== null || e.tag === 30 && t || Vl(e.child, t), e = e.sibling;
	}
	function Hl(e) {
		if (e.subtreeFlags & 18874368) for (e = e.child; e !== null;) {
			if ((e.tag !== 22 || e.memoizedState === null) && (Hl(e), e.tag === 30 && e.flags & 18874368 && e.stateNode.paired)) {
				var t = e.memoizedProps;
				if (t.name == null || t.name === "auto") throw Error(i(544));
				var n = t.name;
				t = di(t.default, t.share), t !== "none" && (zl(e, n, t, null, !1) || Vl(e.child, !1));
			}
			e = e.sibling;
		}
	}
	function Ul(e, t) {
		if (e.tag === 30) {
			var n = e.stateNode, r = e.memoizedProps, i = li(r, n), a = di(r.default, n.paired ? r.share : r.enter);
			a === "none" ? Hl(e) : zl(e, i, a, null, !1) ? (Hl(e), n.paired || t || Md(e, r.onEnter)) : Vl(e.child, !1);
		} else if (e.subtreeFlags & 33554432) for (e = e.child; e !== null;) Ul(e, t), e = e.sibling;
		else Hl(e);
	}
	function Wl(e) {
		if (Pl !== null && Pl.size !== 0) {
			var t = Pl;
			if (e.subtreeFlags & 18874368) for (e = e.child; e !== null;) {
				if (e.tag !== 22 || e.memoizedState === null) {
					if (e.tag === 30 && e.flags & 18874368) {
						var n = e.memoizedProps, r = n.name;
						if (r != null && r !== "auto") {
							var i = t.get(r);
							if (i !== void 0) {
								var a = di(n.default, n.share);
								if (a !== "none" && (zl(e, r, a, null, !1) ? (a = e.stateNode, i.paired = a, a.paired = i, Md(e, n.onShare)) : Vl(e.child, !1)), t.delete(r), t.size === 0) break;
							}
						}
					}
					Wl(e);
				}
				e = e.sibling;
			}
		}
	}
	function Gl(e) {
		if (e.tag === 30) {
			var t = e.memoizedProps, n = li(t, e.stateNode), r = Pl === null ? void 0 : Pl.get(n), i = di(t.default, r === void 0 ? t.exit : t.share);
			i !== "none" && (zl(e, n, i, null, !1) ? r === void 0 ? Md(e, t.onExit) : (i = e.stateNode, r.paired = i, i.paired = r, Pl.delete(n), Md(e, t.onShare)) : Vl(e.child, !1)), Pl !== null && Wl(e);
		} else if (e.subtreeFlags & 33554432) for (e = e.child; e !== null;) Gl(e), e = e.sibling;
		else Pl !== null && Wl(e);
	}
	function Kl(e) {
		for (e = e.child; e !== null;) {
			if (e.tag === 30) {
				var t = e.memoizedProps, n = li(t, e.stateNode);
				t = di(t.default, t.update), e.flags &= -5, t !== "none" && zl(e, n, t, e.memoizedState = [], !1);
			} else e.subtreeFlags & 33554432 && Kl(e);
			e = e.sibling;
		}
	}
	function ql(e) {
		if (e.subtreeFlags & 18874368) for (e = e.child; e !== null;) {
			if (e.tag !== 22 || e.memoizedState === null) {
				if (e.tag === 30 && e.flags & 18874368) {
					var t = e.stateNode;
					t.paired !== null && (t.paired = null, Vl(e.child, !1));
				}
				ql(e);
			}
			e = e.sibling;
		}
	}
	function Jl(e) {
		if (e.tag === 30) e.stateNode.paired = null, Vl(e.child, !1), ql(e);
		else if (e.subtreeFlags & 33554432) for (e = e.child; e !== null;) Jl(e), e = e.sibling;
		else ql(e);
	}
	function Yl(e) {
		for (e = e.child; e !== null;) e.tag === 30 ? Vl(e.child, !1) : e.subtreeFlags & 33554432 && Yl(e), e = e.sibling;
	}
	function Xl(e, t, n, r, i, a, o) {
		for (var s = !1; t !== null;) {
			if (t.tag === 5) {
				var c = t.stateNode;
				if (a !== null && Rl < a.length) {
					var l = a[Rl], u = Ap(c);
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
				e.flags & 4 && Dp(c, Rl === 0 ? n : n + "_" + Rl, i), s && e.flags & 4 || (Il === null && (Il = []), Il.push(c, Rl === 0 ? r : r + "_" + Rl, t.memoizedProps)), Rl++;
			} else (t.tag !== 22 || t.memoizedState === null) && (t.tag === 30 && o ? e.flags |= t.flags & 32 : Xl(e, t.child, n, r, i, a, o) && (s = !0));
			t = t.sibling;
		}
		return s;
	}
	function Zl(e, t) {
		for (e = e.child; e !== null;) {
			if (e.tag === 30) {
				var n = e.memoizedProps, r = e.stateNode, i = li(n, r), a = di(n.default, n.update);
				if (t) {
					r = r.clones;
					var o = r === null ? null : r.map(jp);
				} else o = e.memoizedState, e.memoizedState = null;
				r = e;
				var s = e.child;
				Rl = 0, i = Xl(r, s, i, i, a, o, !1), e.flags & 4 && i && (t || Md(e, n.onUpdate));
			} else e.subtreeFlags & 33554432 && Zl(e, t);
			e = e.sibling;
		}
	}
	var Ql = !1, $l = !1, eu = !1, tu = !1, nu = typeof WeakSet == "function" ? WeakSet : Set, ru = null, iu = !1, au = !1, ou = !1, su = !1;
	function cu(e, t, n) {
		if (e = e.containerInfo, lp = vh, e = zr(e), Br(e)) {
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
		for (up = {
			focusedElem: e,
			selectionRange: r
		}, vh = !1, n = (n & 335544064) === n, ru = t, t = n ? 9270 : 1024; ru !== null;) {
			if (e = ru, n && (r = e.deletions, r !== null)) for (a = 0; a < r.length; a++) n && Gl(r[a]);
			if (e.alternate === null && e.flags & 2) n && Fl(e), lu(n);
			else {
				if (e.tag === 22) {
					if (r = e.alternate, e.memoizedState !== null) {
						r !== null && r.memoizedState === null && n && Gl(r), lu(n);
						continue;
					}
					if (r !== null && r.memoizedState !== null) {
						n && Fl(e), lu(n);
						continue;
					}
				}
				r = e.child, (e.subtreeFlags & t) !== 0 && r !== null ? (r.return = e, ru = r) : (n && Kl(e), lu(n));
			}
		}
		Pl = null;
	}
	function lu(e) {
		for (; ru !== null;) {
			var t = ru, n = e, r = t.alternate, a = t.flags;
			switch (t.tag) {
				case 0:
				case 11:
				case 15: break;
				case 1:
					if (a & 1024 && r !== null) {
						n = void 0, a = r.memoizedProps, r = r.memoizedState;
						var o = t.stateNode;
						try {
							var s = gc(t.type, a);
							n = o.getSnapshotBeforeUpdate(s, r), o.__reactInternalSnapshotBeforeUpdate = n;
						} catch (e) {
							pf(t, t.return, e);
						}
					}
					break;
				case 3:
					if (a & 1024) {
						if (r = t.stateNode.containerInfo, n = r.nodeType, n === 9) im(r);
						else if (n === 1) switch (r.nodeName) {
							case "HEAD":
							case "HTML":
							case "BODY":
								im(r);
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
					n && r !== null && (n = li(r.memoizedProps, r.stateNode), a = t.memoizedProps, a = di(a.default, a.update), a !== "none" && zl(r, n, a, r.memoizedState = [], !0));
					break;
				default: if (a & 1024) throw Error(i(163));
			}
			if (r = t.sibling, r !== null) {
				r.return = t.return, ru = r;
				break;
			}
			ru = t.return;
		}
	}
	function uu(e, t, n) {
		var r = n.flags;
		switch (n.tag) {
			case 0:
			case 11:
			case 15:
				Au(e, n), r & 4 && gl(5, n);
				break;
			case 1:
				if (Au(e, n), r & 4) {
					if (e = n.stateNode, t === null) try {
						e.componentDidMount();
					} catch (e) {
						pf(n, n.return, e);
					}
					else {
						var i = gc(n.type, t.memoizedProps);
						t = t.memoizedState;
						try {
							e.componentDidUpdate(i, t, e.__reactInternalSnapshotBeforeUpdate);
						} catch (e) {
							pf(n, n.return, e);
						}
					}
				}
				r & 64 && vl(n), r & 512 && bl(n, n.return);
				break;
			case 3:
				if (Au(e, n), r & 64 && (e = n.updateQueue, e !== null)) {
					if (t = null, n.child !== null) switch (n.child.tag) {
						case 27:
						case 5:
							t = n.child.stateNode;
							break;
						case 1: t = n.child.stateNode;
					}
					try {
						_o(e, t);
					} catch (e) {
						pf(n, n.return, e);
					}
				}
				break;
			case 27: t === null && r & 4 && Ml(n);
			case 26:
			case 5:
				Au(e, n), t === null && r & 4 && El(n), r & 512 && bl(n, n.return);
				break;
			case 12:
				Au(e, n);
				break;
			case 31:
				Au(e, n), r & 4 && yu(e, n);
				break;
			case 13:
				Au(e, n), r & 4 && bu(e, n), r & 64 && (e = n.memoizedState, e !== null && (e = e.dehydrated, e !== null && (n = _f.bind(null, n), um(e, n))));
				break;
			case 22:
				if (r = n.memoizedState !== null || Ql, !r) {
					var a = t !== null && t.memoizedState !== null || $l;
					t = Ql, i = $l, Ql = r, ($l = a) && !i ? (r = 2, n.subtreeFlags & 8772 && (r |= 1), Mu(e, n, r)) : Au(e, n), Ql = t, $l = i;
				}
				break;
			case 30:
				Au(e, n), r & 512 && bl(n, n.return);
				break;
			case 7: r & 512 && bl(n, n.return);
			default: Au(e, n);
		}
	}
	function du(e, t) {
		for (e = e.child; e !== null;) fu(e, t), e = e.sibling;
	}
	function fu(e, t) {
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
					pf(e, e.return, t);
				}
				pu(e, t);
				break;
			case 6:
				try {
					e.stateNode.nodeValue = t ? "" : e.memoizedProps, Lt = !0;
				} catch (t) {
					pf(e, e.return, t);
				}
				break;
			case 18:
				try {
					var s = e.stateNode;
					t ? Ep(s, !0) : Ep(e.stateNode, !1);
				} catch (t) {
					pf(e, e.return, t);
				}
				break;
			case 22:
			case 23:
				e.memoizedState === null && du(e, t);
				break;
			default: du(e, t);
		}
	}
	function pu(e, t) {
		if (e.subtreeFlags & 67108864) for (e = e.child; e !== null;) {
			a: {
				var n = e, r = t;
				switch (n.tag) {
					case 4:
						fu(n, r);
						break a;
					case 22:
						n.memoizedState === null && pu(n, r);
						break a;
					default: pu(n, r);
				}
			}
			e = e.sibling;
		}
	}
	function mu(e) {
		var t = e.alternate;
		t !== null && (e.alternate = null, mu(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && St(t)), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
	}
	var hu = null, gu = !1;
	function _u(e, t, n) {
		for (n = n.child; n !== null;) vu(e, t, n), n = n.sibling;
	}
	function vu(e, t, n) {
		if (Ve && typeof Ve.onCommitFiberUnmount == "function") try {
			Ve.onCommitFiberUnmount(Be, n);
		} catch {}
		switch (n.tag) {
			case 26:
				$l || xl(n, t), _u(e, t, n), n.memoizedState ? n.memoizedState.count-- : n.stateNode && !$l && (n = n.stateNode, n.parentNode.removeChild(n));
				break;
			case 27:
				$l || xl(n, t), X(n);
				var r = hu, i = gu;
				wp(n.type) && (hu = n.stateNode, gu = !1), _u(e, t, n), vm(n.stateNode, n.type, n.memoizedProps), hu = r, gu = i;
				break;
			case 5: $l || xl(n, t), X(n);
			case 6:
				if (n.tag === 6 && X(n), r = hu, i = gu, hu = null, _u(e, t, n), hu = r, gu = i, hu !== null) {
					if (gu) try {
						(hu.nodeType === 9 ? hu.body : hu.nodeName === "HTML" ? hu.ownerDocument.body : hu).removeChild(n.stateNode), Lt = !0;
					} catch (e) {
						pf(n, t, e);
					}
					else try {
						hu.removeChild(n.stateNode), Lt = !0;
					} catch (e) {
						pf(n, t, e);
					}
				}
				break;
			case 18:
				hu !== null && (gu ? (e = hu, Tp(e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e, n.stateNode), Wh(e)) : Tp(hu, n.stateNode));
				break;
			case 4:
				r = hu, i = gu, hu = n.stateNode.containerInfo, gu = !0, _u(e, t, n), hu = r, gu = i;
				break;
			case 0:
			case 11:
			case 14:
			case 15:
				_l(2, n, t), $l || _l(4, n, t), _u(e, t, n);
				break;
			case 1:
				$l || (xl(n, t), r = n.stateNode, typeof r.componentWillUnmount == "function" && yl(n, t, r)), _u(e, t, n);
				break;
			case 21:
				_u(e, t, n);
				break;
			case 22:
				$l = (r = $l) || n.memoizedState !== null, _u(e, t, n), $l = r;
				break;
			case 30:
				xl(n, t), _u(e, t, n);
				break;
			case 7:
				$l || xl(n, t), _u(e, t, n);
				break;
			default: _u(e, t, n);
		}
	}
	function yu(e, t) {
		if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null))) {
			e = e.dehydrated;
			try {
				Wh(e);
			} catch (e) {
				pf(t, t.return, e);
			}
		}
	}
	function bu(e, t) {
		if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null && (e = e.dehydrated, e !== null)))) try {
			Wh(e);
		} catch (e) {
			pf(t, t.return, e);
		}
	}
	function xu(e) {
		switch (e.tag) {
			case 31:
			case 13:
			case 19:
				var t = e.stateNode;
				return t === null && (t = e.stateNode = new nu()), t;
			case 22: return e = e.stateNode, t = e._retryCache, t === null && (t = e._retryCache = new nu()), t;
			default: throw Error(i(435, e.tag));
		}
	}
	function Su(e, t) {
		var n = xu(e);
		t.forEach(function(t) {
			if (!n.has(t)) {
				n.add(t);
				var r = vf.bind(null, e, t);
				t.then(r, r);
			}
		});
	}
	function Cu(e, t, n) {
		var r = t.deletions;
		if (r !== null) for (var a = 0; a < r.length; a++) {
			var o = r[a], s = e, c = t, l = c;
			a: for (; l !== null;) {
				switch (l.tag) {
					case 27:
						if (wp(l.type)) {
							hu = l.stateNode, gu = !1;
							break a;
						}
						break;
					case 5:
						hu = l.stateNode, gu = !1;
						break a;
					case 3:
					case 4:
						hu = l.stateNode.containerInfo, gu = !0;
						break a;
				}
				l = l.return;
			}
			if (hu === null) throw Error(i(160));
			vu(s, c, o), hu = null, gu = !1, s = o.alternate, s !== null && (s.return = null), o.return = null;
		}
		if (t.subtreeFlags & 13886) for (t = t.child; t !== null;) Tu(t, e, n), t = t.sibling;
	}
	var wu = null;
	function Tu(e, t, n) {
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
				Cu(t, e, n), Eu(e), a & 4 && (_l(3, e, e.return), gl(3, e), _l(5, e, e.return));
				break;
			case 1:
				Cu(t, e, n), Eu(e), a & 512 && ($l || r === null || xl(r, r.return)), a & 64 && Ql && (e = e.updateQueue, e !== null && (t = e.callbacks, t !== null && (n = e.shared.hiddenCallbacks, e.shared.hiddenCallbacks = n === null ? t : n.concat(t))));
				break;
			case 26:
				if (o = wu, Cu(t, e, n), Eu(e), a & 512 && ($l || r === null || xl(r, r.return)), a & 4) {
					if (a = r === null ? null : r.memoizedState, n = e.memoizedState, r === null) {
						if (n === null) {
							if (e.stateNode === null) {
								if (Ql) e.stateNode = mp(e.type, e.memoizedProps, t.containerInfo, e);
								else {
									a: {
										t = e.type, n = e.memoizedProps, a = o.ownerDocument || o;
										b: switch (t) {
											case "title":
												r = a.getElementsByTagName("title")[0], (!r || r[bt] || r[pt] || r.namespaceURI === "http://www.w3.org/2000/svg" || r.hasAttribute("itemprop")) && (r = a.createElement(t), a.head.insertBefore(r, a.querySelector("head > title"))), ip(r, t, n), r[pt] = e, Dt(r), t = r;
												break a;
											case "link":
												if (o = qm("link", "href", a).get(t + (n.href || ""))) {
													for (s = 0; s < o.length; s++) if (r = o[s], r.getAttribute("href") === (n.href == null || n.href === "" ? null : n.href) && r.getAttribute("rel") === (n.rel == null ? null : n.rel) && r.getAttribute("title") === (n.title == null ? null : n.title) && r.getAttribute("crossorigin") === (n.crossOrigin == null ? null : n.crossOrigin)) {
														o.splice(s, 1);
														break b;
													}
												}
												r = a.createElement(t), ip(r, t, n), a.head.appendChild(r);
												break;
											case "meta":
												if (o = qm("meta", "content", a).get(t + (n.content || ""))) {
													for (s = 0; s < o.length; s++) if (r = o[s], r.getAttribute("content") === (n.content == null ? null : "" + n.content) && r.getAttribute("name") === (n.name == null ? null : n.name) && r.getAttribute("property") === (n.property == null ? null : n.property) && r.getAttribute("http-equiv") === (n.httpEquiv == null ? null : n.httpEquiv) && r.getAttribute("charset") === (n.charSet == null ? null : n.charSet)) {
														o.splice(s, 1);
														break b;
													}
												}
												r = a.createElement(t), ip(r, t, n), a.head.appendChild(r);
												break;
											default: throw Error(i(468, t));
										}
										r[pt] = e, Dt(r), t = r;
									}
									e.stateNode = t;
								}
							} else Ql || Jm(o, e.type, e.stateNode);
						} else e.stateNode = Hm(o, n, e.memoizedProps);
					} else a === n ? n === null && e.stateNode !== null && Dl(e, e.memoizedProps, r.memoizedProps) : (a === null ? (t = r.stateNode, t === null || $l || t.parentNode.removeChild(t)) : a.count--, n === null ? Ql || Jm(o, e.type, e.stateNode) : Hm(o, n, e.memoizedProps));
				}
				break;
			case 27:
				Cu(t, e, n), Eu(e), a & 512 && ($l || r === null || xl(r, r.return)), r !== null && a & 4 && Dl(e, e.memoizedProps, r.memoizedProps);
				break;
			case 5:
				if (o = eu, eu = !1, Cu(t, e, n), eu = o, Eu(e), a & 512 && ($l || r === null || xl(r, r.return)), e.flags & 32) {
					t = e.stateNode;
					try {
						tn(t, ""), Lt = !0;
					} catch (t) {
						pf(e, e.return, t);
					}
				}
				a & 4 && e.stateNode != null && (t = e.memoizedProps, Dl(e, t, r === null ? t : r.memoizedProps)), a & 1024 && (tu = !0);
				break;
			case 6:
				if (Cu(t, e, n), Eu(e), a & 4) {
					if (e.stateNode === null) throw Error(i(162));
					t = e.memoizedProps, n = e.stateNode;
					try {
						n.nodeValue = t, Lt = !0;
					} catch (t) {
						pf(e, e.return, t);
					}
				}
				break;
			case 3:
				if (Lt = !1, Km = null, o = wu, wu = Sm(t.containerInfo), Cu(t, e, n), wu = o, Eu(e), a & 4 && r !== null && r.memoizedState.isDehydrated) try {
					Wh(t.containerInfo);
				} catch (t) {
					pf(e, e.return, t);
				}
				tu && (tu = !1, Du(e)), Lt = !1;
				break;
			case 4:
				a = eu, eu = Ql, r = Rt(), o = wu, wu = Sm(e.stateNode.containerInfo), Cu(t, e, n), Eu(e), wu = o, Lt && au && (ou = !0), Lt = r, eu = a;
				break;
			case 12:
				Cu(t, e, n), Eu(e);
				break;
			case 31:
				Cu(t, e, n), Eu(e), a & 4 && (t = e.updateQueue, t !== null && (e.updateQueue = null, Su(e, t)));
				break;
			case 13:
				Cu(t, e, n), Eu(e), e.child.flags & 8192 && e.memoizedState !== null != (r !== null && r.memoizedState !== null) && (pd = Me()), a & 4 && (t = e.updateQueue, t !== null && (e.updateQueue = null, Su(e, t)));
				break;
			case 22:
				o = e.memoizedState !== null, s = r !== null && r.memoizedState !== null;
				var c = Ql, l = $l, u = eu;
				Ql = c || o, eu = u || o, $l = l || s, Cu(t, e, n), $l = l, eu = u, Ql = c, Eu(e), a & 8192 && (t = e.stateNode, t._visibility = o ? t._visibility & -2 : t._visibility | 1, !o || r === null || s || Ql || $l || (t = s || $l, n = Ql, r = $l, Ql = o || Ql, $l = t, ju(e, 2), Ql = n, $l = r), !o && eu || du(e, o)), a & 4 && (t = e.updateQueue, t !== null && (n = t.retryQueue, n !== null && (t.retryQueue = null, Su(e, n))));
				break;
			case 19:
				Cu(t, e, n), Eu(e), a & 4 && (t = e.updateQueue, t !== null && (e.updateQueue = null, Su(e, t)));
				break;
			case 30:
				a & 512 && ($l || r === null || xl(r, r.return)), a = Rt(), o = au, s = (n & 335544064) === n, c = e.memoizedProps, au = s && di(c.default, c.update) !== "none", Cu(t, e, n), Eu(e), s && r !== null && Lt && (e.flags |= 4), au = o, Lt = a;
				break;
			case 21: break;
			case 7: a & 512 && ($l || r === null || xl(r, r.return)), r && r.stateNode !== null && (r.stateNode._fragmentFiber = e);
			default: Cu(t, e, n), Eu(e);
		}
	}
	function Eu(e) {
		var t = e.flags;
		if (t & 2) {
			try {
				for (var n, r = e.return; r !== null;) {
					if (Ol(r)) {
						n = r;
						break;
					}
					r = r.return;
				}
				r = null;
				for (var a = e.return; a !== null;) {
					if (Tl(a)) {
						var o = a.stateNode;
						r === null ? r = [o] : r.push(o);
					}
					if (wl(a)) break;
					a = a.return;
				}
				var s = r;
				if (n == null) throw Error(i(160));
				switch (n.tag) {
					case 27:
						var c = n.stateNode;
						jl(e, kl(e), c, s);
						break;
					case 5:
						var l = n.stateNode;
						n.flags & 32 && (tn(l, ""), n.flags &= -33), jl(e, kl(e), l, s);
						break;
					case 3:
					case 4:
						var u = n.stateNode.containerInfo;
						Al(e, kl(e), u, s);
						break;
					default: throw Error(i(161));
				}
			} catch (t) {
				pf(e, e.return, t);
			}
			e.flags &= -3;
		}
		t & 4096 && (e.flags &= -4097);
	}
	function Du(e) {
		if (e.subtreeFlags & 1024) for (e = e.child; e !== null;) {
			var t = e;
			Du(t), t.tag === 5 && t.flags & 1024 && (t = t.stateNode, vh = !0, t.reset(), vh = !1), e = e.sibling;
		}
	}
	function Ou(e, t) {
		if (t.subtreeFlags & 9270) for (t = t.child; t !== null;) ku(t, e), t = t.sibling;
		else Zl(t, !1);
	}
	function ku(e, t) {
		var n = e.alternate;
		if (n === null) Ul(e, !1);
		else switch (e.tag) {
			case 3:
				if (su = iu = !1, Ll(), Ou(t, e), !iu && !ou) {
					if (e = Il, e !== null) for (var r = 0; r < e.length; r += 3) {
						n = e[r];
						var i = e[r + 1];
						Op(n, e[r + 2]), n = n.ownerDocument.documentElement, n !== null && n.animate({
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
					})), su = !0;
				}
				Il = null;
				break;
			case 5:
				Ou(t, e);
				break;
			case 4:
				r = iu, iu = !1, Ou(t, e), iu && (ou = !0), iu = r;
				break;
			case 22:
				e.memoizedState === null && (n.memoizedState === null ? Ou(t, e) : Ul(e, !1));
				break;
			case 30:
				r = iu, i = Ll(), iu = !1, Ou(t, e), iu && (e.flags |= 4);
				var a = e.memoizedProps, o = e.stateNode;
				t = li(a, o), o = li(n.memoizedProps, o);
				var s = di(a.default, a.update);
				s === "none" ? t = !1 : (a = n.memoizedState, n.memoizedState = null, n = e.child, Rl = 0, t = Xl(e, n, t, o, s, a, !0), Rl !== (a === null ? 0 : a.length) && (e.flags |= 32)), e.flags & 4 && t ? (Md(e, e.memoizedProps.onUpdate), Il = i) : i !== null && (i.push.apply(i, Il), Il = i), iu = e.flags & 32 ? !0 : r;
				break;
			default: Ou(t, e);
		}
	}
	function Au(e, t) {
		if (t.subtreeFlags & 8772) for (t = t.child; t !== null;) uu(e, t.alternate, t), t = t.sibling;
	}
	function ju(e, t) {
		for (e = e.child; e !== null;) {
			var n = e, r = t;
			switch (n.tag) {
				case 0:
				case 11:
				case 14:
				case 15:
					_l(4, n, n.return), ju(n, r);
					break;
				case 1:
					xl(n, n.return);
					var i = n.stateNode;
					typeof i.componentWillUnmount == "function" && yl(n, n.return, i), ju(n, r);
					break;
				case 27: r & 2 && vm(n.stateNode, n.type, n.memoizedProps);
				case 5:
					xl(n, n.return), n.tag !== 5 && n.tag !== 27 || X(n), ju(n, r);
					break;
				case 6:
					X(n);
					break;
				case 26:
					xl(n, n.return), i = n.stateNode, n.memoizedState !== null || i === null || $l || i.parentNode.removeChild(i), ju(n, r);
					break;
				case 22:
					n.memoizedState === null && ju(n, r);
					break;
				case 30:
					xl(n, n.return), ju(n, r);
					break;
				case 7: xl(n, n.return);
				default: ju(n, r);
			}
			e = e.sibling;
		}
	}
	function Mu(e, t, n) {
		for (n = t.subtreeFlags & 8772 ? n : n & -2, t = t.child; t !== null;) {
			var r = t.alternate, i = e, a = t, o = a.flags, s = !!(n & 1);
			switch (a.tag) {
				case 0:
				case 11:
				case 15:
					Mu(i, a, n), gl(4, a);
					break;
				case 1:
					if (Mu(i, a, n), r = a, i = r.stateNode, typeof i.componentDidMount == "function") try {
						i.componentDidMount();
					} catch (e) {
						pf(r, r.return, e);
					}
					if (r = a, i = r.updateQueue, i !== null) {
						var c = r.stateNode;
						try {
							var l = i.shared.hiddenCallbacks;
							if (l !== null) for (i.shared.hiddenCallbacks = null, i = 0; i < l.length; i++) go(l[i], c);
						} catch (e) {
							pf(r, r.return, e);
						}
					}
					s && o & 64 && vl(a), bl(a, a.return);
					break;
				case 27: n & 2 && Ml(a);
				case 5:
					a.tag !== 5 && a.tag !== 27 || Cl(a), Mu(i, a, n), s && r === null && o & 4 && El(a), bl(a, a.return);
					break;
				case 6:
					Cl(a);
					break;
				case 26:
					c = a.stateNode, a.memoizedState !== null || c === null || Ql || Jm(Sm(c.ownerDocument), a.type, c), Mu(i, a, n), s && r === null && o & 4 && El(a), bl(a, a.return);
					break;
				case 12:
					Mu(i, a, n);
					break;
				case 31:
					Mu(i, a, n), s && o & 4 && yu(i, a);
					break;
				case 13:
					Mu(i, a, n), s && o & 4 && bu(i, a);
					break;
				case 22:
					a.memoizedState === null && Mu(i, a, n), bl(a, a.return);
					break;
				case 30:
					Mu(i, a, n), bl(a, a.return);
					break;
				case 7: bl(a, a.return);
				default: Mu(i, a, n);
			}
			t = t.sibling;
		}
	}
	function Nu(e, t) {
		var n = null;
		e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), e = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (e = t.memoizedState.cachePool.pool), e !== n && (e != null && e.refCount++, n != null && Ta(n));
	}
	function Pu(e, t) {
		e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && Ta(e));
	}
	function Fu(e, t, n, r) {
		var i = (n & 335544064) === n;
		if (t.subtreeFlags & (i ? 10262 : 10256)) for (t = t.child; t !== null;) Iu(e, t, n, r), t = t.sibling;
		else i && Yl(t);
	}
	function Iu(e, t, n, r) {
		var i = (n & 335544064) === n;
		i && t.alternate === null && t.return !== null && t.return.alternate !== null && Jl(t);
		var a = t.flags;
		switch (t.tag) {
			case 0:
			case 11:
			case 15:
				Fu(e, t, n, r), a & 2048 && gl(9, t);
				break;
			case 1:
				Fu(e, t, n, r);
				break;
			case 3:
				Fu(e, t, n, r), i && su && (e = e.containerInfo, e = e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e, e.style.viewTransitionName === "root" && (e.style.viewTransitionName = ""), e = e.ownerDocument.documentElement, e !== null && e.style.viewTransitionName === "none" && (e.style.viewTransitionName = "")), a & 2048 && (a = null, t.alternate !== null && (a = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== a && (t.refCount++, a != null && Ta(a)));
				break;
			case 12:
				if (a & 2048) {
					Fu(e, t, n, r), a = t.stateNode;
					try {
						var o = t.memoizedProps, s = o.id, c = o.onPostCommit;
						typeof c == "function" && c(s, t.alternate === null ? "mount" : "update", a.passiveEffectDuration, -0);
					} catch (e) {
						pf(t, t.return, e);
					}
				} else Fu(e, t, n, r);
				break;
			case 31:
				Fu(e, t, n, r);
				break;
			case 13:
				Fu(e, t, n, r);
				break;
			case 23: break;
			case 22:
				o = t.stateNode, s = t.alternate, t.memoizedState === null ? (i && s !== null && s.memoizedState !== null && Jl(t), o._visibility & 2 ? Fu(e, t, n, r) : (o._visibility |= 2, Lu(e, t, n, r, !!(t.subtreeFlags & 10256) || !1))) : (i && s !== null && s.memoizedState === null && Jl(s), o._visibility & 2 ? Fu(e, t, n, r) : Ru(e, t)), a & 2048 && Nu(s, t);
				break;
			case 24:
				Fu(e, t, n, r), a & 2048 && Pu(t.alternate, t);
				break;
			case 30:
				i && (a = t.alternate, a !== null && (Vl(a.child, !0), Vl(t.child, !0))), Fu(e, t, n, r);
				break;
			default: Fu(e, t, n, r);
		}
	}
	function Lu(e, t, n, r, i) {
		for (i &&= !!(t.subtreeFlags & 10256) || !1, t = t.child; t !== null;) {
			var a = e, o = t, s = n, c = r, l = o.flags;
			switch (o.tag) {
				case 0:
				case 11:
				case 15:
					Lu(a, o, s, c, i), gl(8, o);
					break;
				case 23: break;
				case 22:
					var u = o.stateNode;
					o.memoizedState === null ? (u._visibility |= 2, Lu(a, o, s, c, i)) : u._visibility & 2 ? Lu(a, o, s, c, i) : Ru(a, o), i && l & 2048 && Nu(o.alternate, o);
					break;
				case 24:
					Lu(a, o, s, c, i), i && l & 2048 && Pu(o.alternate, o);
					break;
				default: Lu(a, o, s, c, i);
			}
			t = t.sibling;
		}
	}
	function Ru(e, t) {
		if (t.subtreeFlags & 10256) for (t = t.child; t !== null;) {
			var n = e, r = t, i = r.flags;
			switch (r.tag) {
				case 22:
					Ru(n, r), i & 2048 && Nu(r.alternate, r);
					break;
				case 24:
					Ru(n, r), i & 2048 && Pu(r.alternate, r);
					break;
				default: Ru(n, r);
			}
			t = t.sibling;
		}
	}
	var zu = 8192;
	function Bu(e, t, n) {
		if (e.subtreeFlags & zu) for (e = e.child; e !== null;) Vu(e, t, n), e = e.sibling;
	}
	function Vu(e, t, n) {
		switch (e.tag) {
			case 26:
				Bu(e, t, n), e.flags & zu && (e.memoizedState === null ? (e = e.stateNode, (t & 335544128) === t && $m(n, e)) : eh(n, wu, e.memoizedState, e.memoizedProps));
				break;
			case 5:
				Bu(e, t, n), e.flags & zu && (e = e.stateNode, (t & 335544128) === t && $m(n, e));
				break;
			case 3:
			case 4:
				var r = wu;
				wu = Sm(e.stateNode.containerInfo), Bu(e, t, n), wu = r;
				break;
			case 22:
				e.memoizedState === null && (r = e.alternate, r !== null && r.memoizedState !== null ? (r = zu, zu = 16777216, Bu(e, t, n), zu = r) : Bu(e, t, n));
				break;
			case 30:
				if ((e.flags & zu) !== 0 && (r = e.memoizedProps.name, r != null && r !== "auto")) {
					var i = e.stateNode;
					i.paired = null, Pl === null && (Pl = /* @__PURE__ */ new Map()), Pl.set(r, i);
				}
				Bu(e, t, n);
				break;
			default: Bu(e, t, n);
		}
	}
	function Hu(e) {
		var t = e.alternate;
		if (t !== null && (e = t.child, e !== null)) {
			t.child = null;
			do
				t = e.sibling, e.sibling = null, e = t;
			while (e !== null);
		}
	}
	function Uu(e) {
		var t = e.deletions;
		if (e.flags & 16) {
			if (t !== null) for (var n = 0; n < t.length; n++) {
				var r = t[n];
				ru = r, Ku(r, e);
			}
			Hu(e);
		}
		if (e.subtreeFlags & 10256) for (e = e.child; e !== null;) Wu(e), e = e.sibling;
	}
	function Wu(e) {
		switch (e.tag) {
			case 0:
			case 11:
			case 15:
				Uu(e), e.flags & 2048 && _l(9, e, e.return);
				break;
			case 3:
				Uu(e);
				break;
			case 12:
				Uu(e);
				break;
			case 22:
				var t = e.stateNode;
				e.memoizedState !== null && t._visibility & 2 && (e.return === null || e.return.tag !== 13) ? (t._visibility &= -3, Gu(e)) : Uu(e);
				break;
			default: Uu(e);
		}
	}
	function Gu(e) {
		var t = e.deletions;
		if (e.flags & 16) {
			if (t !== null) for (var n = 0; n < t.length; n++) {
				var r = t[n];
				ru = r, Ku(r, e);
			}
			Hu(e);
		}
		for (e = e.child; e !== null;) {
			switch (t = e, t.tag) {
				case 0:
				case 11:
				case 15:
					_l(8, t, t.return), Gu(t);
					break;
				case 22:
					n = t.stateNode, n._visibility & 2 && (n._visibility &= -3, Gu(t));
					break;
				default: Gu(t);
			}
			e = e.sibling;
		}
	}
	function Ku(e, t) {
		for (; ru !== null;) {
			var n = ru;
			switch (n.tag) {
				case 0:
				case 11:
				case 15:
					_l(8, n, t);
					break;
				case 23:
				case 22:
					if (n.memoizedState !== null && n.memoizedState.cachePool !== null) {
						var r = n.memoizedState.cachePool.pool;
						r != null && r.refCount++;
					}
					break;
				case 24: Ta(n.memoizedState.cache);
			}
			if (r = n.child, r !== null) r.return = n, ru = r;
			else a: for (n = e; ru !== null;) {
				r = ru;
				var i = r.sibling, a = r.return;
				if (mu(r), r === n) {
					ru = null;
					break a;
				}
				if (i !== null) {
					i.return = a, ru = i;
					break a;
				}
				ru = a;
			}
		}
	}
	var qu = {
		getCacheForType: function(e) {
			var t = _a(Ca), n = t.data.get(e);
			return n === void 0 && (n = e(), t.data.set(e, n)), n;
		},
		cacheSignal: function() {
			return _a(Ca).controller.signal;
		}
	}, Ju = typeof WeakMap == "function" ? WeakMap : Map, Yu = 0, Xu = null, Z = null, Zu = 0, Qu = 0, $u = null, ed = !1, td = !1, nd = !1, rd = 0, id = 0, ad = 0, od = 0, sd = 0, cd = 0, ld = 0, ud = null, dd = null, fd = !1, pd = 0, md = 0, hd = Infinity, gd = null, _d = null, vd = 0, yd = null, bd = null, xd = 0, Sd = 0, Cd = null, wd = null, Td = null, Ed = null, Dd = null, Od = 0, kd = null;
	function Ad() {
		return Yu & 2 && Zu !== 0 ? Zu & -Zu : V.T === null ? ut() : Pf();
	}
	function jd() {
		if (cd === 0) {
			if (!(Zu & 536870912) || J) {
				var e = Je;
				Je <<= 1, !(Je & 3932160) && (Je = 262144), cd = e;
			} else cd = 536870912;
		}
		return e = Co.current, e !== null && (e.flags |= 32), cd;
	}
	function Md(e, t) {
		if (t != null) {
			var n = e.stateNode, r = n.ref;
			r === null && (r = n.ref = Ip(li(e.memoizedProps, n))), Ed === null && (Ed = []), Ed.push(t.bind(null, r));
		}
	}
	function Nd(e, t, n) {
		(e === Xu && (Qu === 2 || Qu === 9) || e.cancelPendingCommit !== null) && (Bd(e, 0), Ld(e, Zu, cd, !1)), rt(e, n), Yu & 2 && e === Xu || (e === Xu && (!(Yu & 2) && (od |= n), id === 4 && Ld(e, Zu, cd, !1)), Ef(e));
	}
	function Pd(e, t, n) {
		if (Yu & 6) throw Error(i(327));
		var r = !n && !(t & 127) && (t & e.expiredLanes) === 0 || Qe(e, t), a = r ? Jd(e, t) : Kd(e, t, !0), o = r;
		do {
			if (a === 0) {
				td && !r && Ld(e, t, 0, !1);
				break;
			}
			if (n = e.current.alternate, o && !Id(n)) a = Kd(e, t, !1), o = !1;
			else {
				if (a === 2) {
					if (o = t, e.errorRecoveryDisabledLanes & o) var s = 0;
					else s = e.pendingLanes & -536870913, s = s === 0 ? s & 536870912 ? 536870912 : 0 : s;
					if (s !== 0) {
						t = s;
						a: {
							var c = e;
							a = ud;
							var l = c.current.memoizedState.isDehydrated;
							if (l && (Bd(c, s).flags |= 256), s = Kd(c, s, !1), s !== 2 && s !== 6) {
								if (nd && !l) {
									c.errorRecoveryDisabledLanes |= o, od |= o, a = 4;
									break a;
								}
								o = dd, dd = a, o !== null && (dd === null ? dd = o : dd.push.apply(dd, o));
							}
							a = s;
						}
						if (o = !1, a !== 2) continue;
					}
				}
				if (a === 1) {
					Bd(e, 0), Ld(e, t, 0, !0);
					break;
				}
				a: {
					switch (r = e, o = a, o) {
						case 0:
						case 1: throw Error(i(345));
						case 4: if ((t & 4194048) !== t && (t & 62914560) !== t) break;
						case 6:
							Ld(r, t, cd, !ed);
							break a;
						case 2:
							dd = null;
							break;
						case 3:
						case 5: break;
						default: throw Error(i(329));
					}
					if ((t & 62914560) === t && (a = pd + 300 - Me(), 10 < a)) {
						if (Ld(r, t, cd, !ed), Ze(r, 0, !0) !== 0) break a;
						xd = t, r.timeoutHandle = vp(Fd.bind(null, r, n, dd, gd, fd, t, cd, od, ld, ed, o, "Throttled", -0, 0), a);
						break a;
					}
					Fd(r, n, dd, gd, fd, t, cd, od, ld, ed, o, null, -0, 0);
				}
				break;
			}
		} while (1);
		Ef(e);
	}
	function Fd(e, t, n, r, i, a, o, s, c, l, u, d, f, p) {
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
			unsuspend: un
		}, Pl = null, Vu(t, a, d), h && (m = d, h = e.containerInfo, h = (h.nodeType === 9 ? h : h.ownerDocument).__reactViewTransition, h != null && (m.count++, m.waitingForViewTransition = !0, m = ih.bind(m), h.finished.then(m, m))), m = (a & 62914560) === a ? pd - Me() : (a & 4194048) === a ? md - Me() : 0, m = nh(d, m), m !== null) ? (xd = a, e.cancelPendingCommit = m(tf.bind(null, e, t, a, n, r, i, o, s, c, l, u, d, null, f, p)), Ld(e, a, o, !l)) : tf(e, t, a, n, r, i, o, s, c, l, u, d);
	}
	function Id(e) {
		for (var t = e;;) {
			var n = t.tag;
			if ((n === 0 || n === 11 || n === 15) && t.flags & 16384 && (n = t.updateQueue, n !== null && (n = n.stores, n !== null))) for (var r = 0; r < n.length; r++) {
				var i = n[r], a = i.getSnapshot;
				i = i.value;
				try {
					if (!Nr(a(), i)) return !1;
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
	function Ld(e, t, n, r) {
		t = $e(e, t), t &= ~sd, t &= ~od, e.suspendedLanes |= t, e.pingedLanes &= ~t, r && (e.warmLanes |= t), r = e.expirationTimes;
		for (var i = t; 0 < i;) {
			var a = 31 - Ue(i), o = 1 << a;
			r[a] = -1, i &= ~o;
		}
		n !== 0 && at(e, n, t);
	}
	function Rd() {
		return Yu & 6 ? !0 : (Df(0, !1), !1);
	}
	function zd() {
		if (Z !== null) {
			if (Qu === 0) var e = Z.return;
			else e = Z, la = ca = null, Qo(e), Za = null, Qa = 0, e = Z;
			for (; e !== null;) hl(e.alternate, e), e = e.return;
			Z = null;
		}
	}
	function Bd(e, t) {
		var n = e.timeoutHandle;
		return n !== -1 && (e.timeoutHandle = -1, yp(n)), n = e.cancelPendingCommit, n !== null && (e.cancelPendingCommit = null, n()), xd = 0, zd(), Xu = e, Z = n = Ei(e.current, null), Zu = t, Qu = 0, $u = null, ed = !1, td = Qe(e, t), nd = !1, ld = cd = sd = od = ad = id = 0, dd = ud = null, fd = !1, rd = $e(e, t), gi(), n;
	}
	function Vd(e, t) {
		Y = null, V.H = cc, t === Va || t === Ua ? (t = Ya(), Qu = 3) : t === Ha ? (t = Ya(), Qu = 4) : Qu = t === Ec ? 8 : typeof t == "object" && t && typeof t.then == "function" ? 6 : 1, $u = t, Z === null && (id = 1, bc(e, Pi(t, e.current)));
	}
	function Hd() {
		var e = Co.current;
		return e === null ? !0 : (Zu & 4194048) === Zu ? wo === null : (Zu & 62914560) === Zu || Zu & 536870912 ? e === wo : !1;
	}
	function Ud() {
		var e = V.H;
		return V.H = cc, e === null ? cc : e;
	}
	function Wd() {
		var e = V.A;
		return V.A = qu, e;
	}
	function Gd() {
		id = 4, ed || (Zu & 4194048) !== Zu && Co.current !== null || (td = !0), !(ad & 134217727) && !(od & 134217727) || Xu === null || Ld(Xu, Zu, cd, !1);
	}
	function Kd(e, t, n) {
		var r = Yu;
		Yu |= 2;
		var i = Ud(), a = Wd();
		(Xu !== e || Zu !== t) && (gd = null, Bd(e, t)), t = !1;
		var o = id;
		a: do
			try {
				if (Qu !== 0 && Z !== null) {
					var s = Z, c = $u;
					switch (Qu) {
						case 8:
							zd(), o = 6;
							break a;
						case 3:
						case 2:
						case 9:
						case 6:
							Co.current === null && (t = !0);
							var l = Qu;
							if (Qu = 0, $u = null, Qd(e, s, c, l), n && td) {
								o = 0;
								break a;
							}
							break;
						default: l = Qu, Qu = 0, $u = null, Qd(e, s, c, l);
					}
				}
				qd(), o = id;
				break;
			} catch (t) {
				Vd(e, t);
			}
		while (1);
		return t && e.shellSuspendCounter++, la = ca = null, Yu = r, V.H = i, V.A = a, Z === null && (Xu = null, Zu = 0, gi()), o;
	}
	function qd() {
		for (; Z !== null;) Xd(Z);
	}
	function Jd(e, t) {
		var n = Yu;
		Yu |= 2;
		var r = Ud(), a = Wd();
		Xu !== e || Zu !== t ? (gd = null, hd = Me() + 500, Bd(e, t)) : td = Qe(e, t);
		a: do
			try {
				if (Qu !== 0 && Z !== null) {
					t = Z;
					var o = $u;
					b: switch (Qu) {
						case 1:
							Qu = 0, $u = null, Qd(e, t, o, 1);
							break;
						case 2:
						case 9:
							if (Ga(o)) {
								Qu = 0, $u = null, Zd(t);
								break;
							}
							t = function() {
								Qu !== 2 && Qu !== 9 || Xu !== e || (Qu = 7), Ef(e);
							}, o.then(t, t);
							break a;
						case 3:
							Qu = 7;
							break a;
						case 4:
							Qu = 5;
							break a;
						case 7:
							Ga(o) ? (Qu = 0, $u = null, Zd(t)) : (Qu = 0, $u = null, Qd(e, t, o, 7));
							break;
						case 5:
							var s = null;
							switch (Z.tag) {
								case 26: s = Z.memoizedState;
								case 5:
								case 27:
									var c = Z;
									if (s ? Zm(s) : c.stateNode.complete) {
										Qu = 0, $u = null;
										var l = c.sibling;
										if (l !== null) Z = l;
										else {
											var u = c.return;
											u === null ? Z = null : (Z = u, $d(u));
										}
										break b;
									}
							}
							Qu = 0, $u = null, Qd(e, t, o, 5);
							break;
						case 6:
							Qu = 0, $u = null, Qd(e, t, o, 6);
							break;
						case 8:
							zd(), id = 6;
							break a;
						default: throw Error(i(462));
					}
				}
				Yd();
				break;
			} catch (t) {
				Vd(e, t);
			}
		while (1);
		return la = ca = null, V.H = r, V.A = a, Yu = n, Z === null ? (Xu = null, Zu = 0, gi(), id) : 0;
	}
	function Yd() {
		for (; Z !== null && !Ae();) Xd(Z);
	}
	function Xd(e) {
		var t = ol(e.alternate, e, rd);
		e.memoizedProps = e.pendingProps, t === null ? $d(e) : Z = t;
	}
	function Zd(e) {
		var t = e, n = t.alternate;
		switch (t.tag) {
			case 15:
			case 0:
				t = Bc(n, t, t.pendingProps, t.type, void 0, Zu);
				break;
			case 11:
				t = Bc(n, t, t.pendingProps, t.type.render, t.ref, Zu);
				break;
			case 5:
				Qo(t);
				var r = t;
				r === Yi && (J ? (na(r), r.tag === 5 && r.stateNode != null && (Xi = r.stateNode)) : (na(r), J = !0));
			default: hl(n, t), t = Z = Di(t, rd), t = ol(n, t, rd);
		}
		e.memoizedProps = e.pendingProps, t === null ? $d(e) : Z = t;
	}
	function Qd(e, t, n, r) {
		la = ca = null, Qo(t), Za = null, Qa = 0;
		var i = t.return;
		try {
			if (Tc(e, i, t, n, Zu)) {
				id = 1, bc(e, Pi(n, e.current)), Z = null;
				return;
			}
		} catch (t) {
			if (i !== null) throw Z = i, t;
			id = 1, bc(e, Pi(n, e.current)), Z = null;
			return;
		}
		t.flags & 32768 ? (J || r === 1 ? e = !0 : td || Zu & 536870912 ? e = !1 : (ed = e = !0, (r === 2 || r === 9 || r === 3 || r === 6) && (r = Co.current, r !== null && r.tag === 13 && (r.flags |= 16384))), ef(t, e)) : $d(t);
	}
	function $d(e) {
		var t = e;
		do {
			if (t.flags & 32768) {
				ef(t, ed);
				return;
			}
			e = t.return;
			var n = pl(t.alternate, t, rd);
			if (n !== null) {
				Z = n;
				return;
			}
			if (t = t.sibling, t !== null) {
				Z = t;
				return;
			}
			Z = t = e;
		} while (t !== null);
		id === 0 && (id = 5);
	}
	function ef(e, t) {
		do {
			var n = ml(e.alternate, e);
			if (n !== null) {
				n.flags &= 32767, Z = n;
				return;
			}
			if (n = e.return, n !== null && (n.flags |= 32768, n.subtreeFlags = 0, n.deletions = null), !t && (e = e.sibling, e !== null)) {
				Z = e;
				return;
			}
			Z = e = n;
		} while (e !== null);
		id = 6, Z = null;
	}
	function tf(e, t, n, r, a, o, s, c, l, u, d, f) {
		e.cancelPendingCommit = null;
		do
			uf();
		while (vd !== 0);
		if (Yu & 6) throw Error(i(327));
		if (t !== null) {
			if (t === e.current) throw Error(i(177));
			e === Xu && (Z = Xu = null, Zu = 0), bd = t, yd = e, xd = n, Cd = a, wd = r, nf(e, t, n, s, c, l, f);
		}
	}
	function nf(e, t, n, r, i, a, o) {
		var s = t.lanes | t.childLanes;
		if (Sd = s, s |= hi, it(e, n, s, r, i, a), Ed = null, (n & 335544064) === n ? (Dd = Oa(e), r = 10262) : (Dd = null, r = 10256), (t.subtreeFlags & r) !== 0 || (t.flags & r) !== 0 ? (e.callbackNode = null, e.callbackPriority = 0, yf(Ie, function() {
			return df(), null;
		})) : (e.callbackNode = null, e.callbackPriority = 0), Nl = !1, r = !!(t.flags & 13878), t.subtreeFlags & 13878 || r) {
			r = V.T, V.T = null, i = H.p, H.p = 2, a = Yu, Yu |= 4;
			try {
				cu(e, t, n);
			} finally {
				Yu = a, H.p = i, V.T = r;
			}
		}
		vd = 1, Nl ? Td = Pp(o, e.containerInfo, Dd, of, sf, af, cf, df, rf, null, null) : (of(), sf(), cf());
	}
	function rf(e) {
		if (vd !== 0) {
			var t = yd.onRecoverableError;
			t(e, { componentStack: null });
		}
	}
	function af() {
		vd === 3 && (vd = 0, ku(bd, yd), vd = 4);
	}
	function of() {
		if (vd === 1) {
			vd = 0;
			var e = yd, t = bd, n = xd, r = !!(t.flags & 13878);
			if (t.subtreeFlags & 13878 || r) {
				r = V.T, V.T = null;
				var i = H.p;
				H.p = 2;
				var a = Yu;
				Yu |= 4;
				try {
					au = ou = !1, Tu(t, e, n), n = up;
					var o = zr(e.containerInfo), s = n.focusedElem, c = n.selectionRange;
					if (o !== s && s && s.ownerDocument && Rr(s.ownerDocument.documentElement, s)) {
						if (c !== null && Br(s)) {
							var l = c.start, u = c.end;
							if (u === void 0 && (u = l), "selectionStart" in s) s.selectionStart = l, s.selectionEnd = Math.min(u, s.value.length);
							else {
								var d = s.ownerDocument || document, f = d && d.defaultView || window;
								if (f.getSelection) {
									var p = f.getSelection(), m = s.textContent.length, h = Math.min(c.start, m), g = c.end === void 0 ? h : Math.min(c.end, m);
									!p.extend && h > g && (o = g, g = h, h = o);
									var _ = Lr(s, h), v = Lr(s, g);
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
					vh = !!lp, up = lp = null;
				} finally {
					Yu = a, H.p = i, V.T = r;
				}
			}
			e.current = t, vd = 2;
		}
	}
	function sf() {
		if (vd === 2) {
			vd = 0;
			var e = yd, t = bd, n = !!(t.flags & 8772);
			if (t.subtreeFlags & 8772 || n) {
				n = V.T, V.T = null;
				var r = H.p;
				H.p = 2;
				var i = Yu;
				Yu |= 4;
				try {
					uu(e, t.alternate, t);
				} finally {
					Yu = i, H.p = r, V.T = n;
				}
			}
			vd = 3;
		}
	}
	function cf() {
		if (vd === 4 || vd === 3) {
			vd = 0;
			var e = Td;
			Td = null, je();
			var t = yd, n = bd, r = xd, i = wd, a = (r & 335544064) === r ? 10262 : 10256;
			if ((n.subtreeFlags & a) !== 0 || (n.flags & a) !== 0 ? vd = 5 : (vd = 0, bd = yd = null, lf(t, t.pendingLanes)), a = t.pendingLanes, a === 0 && (_d = null), lt(r), n = n.stateNode, Ve && typeof Ve.onCommitFiberRoot == "function") try {
				Ve.onCommitFiberRoot(Be, n, void 0, (n.current.flags & 128) == 128);
			} catch {}
			if (i !== null) {
				n = V.T, a = H.p, H.p = 2, V.T = null;
				try {
					for (var o = t.onRecoverableError, s = 0; s < i.length; s++) {
						var c = i[s];
						o(c.value, { componentStack: c.stack });
					}
				} finally {
					V.T = n, H.p = a;
				}
			}
			if (i = Ed, o = Dd, Dd = null, i !== null && (Ed = null, o === null && (o = []), e !== null)) for (c = 0; c < i.length; c++) n = (0, i[c])(o), n !== void 0 && e.finished.finally(n);
			xd & 3 && uf(), Ef(t), a = t.pendingLanes, r & 261930 && a & 42 ? t === kd ? Od++ : (Od = 0, kd = t) : (Od = 0, kd = null), Df(0, !1);
		}
	}
	function lf(e, t) {
		(e.pooledCacheLanes &= t) === 0 && (t = e.pooledCache, t != null && (e.pooledCache = null, Ta(t)));
	}
	function uf() {
		return Td !== null && (Td.skipTransition(), Td = null), of(), sf(), cf(), df();
	}
	function df() {
		if (vd !== 5) return !1;
		var e = yd, t = Sd;
		Sd = 0;
		var n = lt(xd), r = V.T, a = H.p;
		try {
			H.p = 32 > n ? 32 : n, V.T = null, n = Cd, Cd = null;
			var o = yd, s = xd;
			if (vd = 0, bd = yd = null, xd = 0, Yu & 6) throw Error(i(331));
			var c = Yu;
			if (Yu |= 4, Wu(o.current), Iu(o, o.current, s, n), Yu = c, Df(0, !1), Ve && typeof Ve.onPostCommitFiberRoot == "function") try {
				Ve.onPostCommitFiberRoot(Be, o);
			} catch {}
			return !0;
		} finally {
			H.p = a, V.T = r, lf(e, t);
		}
	}
	function ff(e, t, n) {
		t = Pi(n, t), t = Sc(e.stateNode, t, 2), e = lo(e, t, 2), e !== null && (rt(e, 2), Ef(e));
	}
	function pf(e, t, n) {
		if (e.tag === 3) ff(e, e, n);
		else for (; t !== null;) {
			if (t.tag === 3) {
				ff(t, e, n);
				break;
			}
			if (t.tag === 1) {
				var r = t.stateNode;
				if (typeof t.type.getDerivedStateFromError == "function" || typeof r.componentDidCatch == "function" && (_d === null || !_d.has(r))) {
					e = Pi(n, e), n = Cc(2), r = lo(t, n, 2), r !== null && (wc(n, r, t, e), rt(r, 2), Ef(r));
					break;
				}
			}
			t = t.return;
		}
	}
	function mf(e, t, n) {
		var r = e.pingCache;
		if (r === null) {
			r = e.pingCache = new Ju();
			var i = /* @__PURE__ */ new Set();
			r.set(t, i);
		} else i = r.get(t), i === void 0 && (i = /* @__PURE__ */ new Set(), r.set(t, i));
		i.has(n) || (nd = !0, i.add(n), e = hf.bind(null, e, t, n), t.then(e, e));
	}
	function hf(e, t, n) {
		var r = e.pingCache;
		r !== null && r.delete(t), e.pingedLanes |= e.suspendedLanes & n, e.warmLanes &= ~n, Xu === e && (Zu & n) === n && (id === 4 || id === 3 && (Zu & 62914560) === Zu && 300 > Me() - pd ? Yu & 2 ? sd |= n : Bd(e, 0) : sd |= n, ld === Zu && (ld = 0)), Ef(e);
	}
	function gf(e, t) {
		t === 0 && (t = tt()), e = yi(e, t), e !== null && (rt(e, t), Ef(e));
	}
	function _f(e) {
		var t = e.memoizedState, n = 0;
		t !== null && (n = t.retryLane), gf(e, n);
	}
	function vf(e, t) {
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
		r !== null && r.delete(t), gf(e, n);
	}
	function yf(e, t) {
		return Oe(e, t);
	}
	var bf = null, xf = null, Sf = !1, Cf = !1, wf = !1, Tf = 0;
	function Ef(e) {
		e !== xf && e.next === null && (xf === null ? bf = xf = e : xf = xf.next = e), Cf = !0, Sf || (Sf = !0, Nf());
	}
	function Df(e, t) {
		if (!wf && Cf) {
			wf = !0;
			do
				for (var n = !1, r = bf; r !== null;) {
					if (!t) {
						if (e !== 0) {
							var i = r.pendingLanes;
							if (i === 0) var a = 0;
							else {
								var o = r.suspendedLanes, s = r.pingedLanes;
								a = (1 << 31 - Ue(42 | e) + 1) - 1, a &= i & ~(o & ~s), a = a & 201326741 ? a & 201326741 | 1 : a ? a | 2 : 0;
							}
							a !== 0 && (n = !0, Mf(r, a));
						} else a = Zu, a = Ze(r, r === Xu ? a : 0, r.cancelPendingCommit !== null || r.timeoutHandle !== -1), !(a & 3) || Qe(r, a) || (n = !0, Mf(r, a));
					}
					r = r.next;
				}
			while (n);
			wf = !1;
		}
	}
	function Of() {
		kf();
	}
	function kf() {
		Cf = Sf = !1;
		var e = 0;
		Tf !== 0 && _p() && (e = Tf);
		for (var t = Me(), n = null, r = bf; r !== null;) {
			var i = r.next, a = Af(r, t);
			a === 0 ? (r.next = null, n === null ? bf = i : n.next = i, i === null && (xf = n)) : (n = r, (e !== 0 || a & 3) && (Cf = !0)), r = i;
		}
		vd !== 0 && vd !== 5 || Df(e, !1), Tf !== 0 && (Tf = 0);
	}
	function Af(e, t) {
		for (var n = e.suspendedLanes, r = e.pingedLanes, i = e.expirationTimes, a = e.pendingLanes & -62914561; 0 < a;) {
			var o = 31 - Ue(a), s = 1 << o, c = i[o];
			c === -1 ? ((s & n) === 0 || (s & r) !== 0) && (i[o] = et(s, t)) : c <= t && (e.expiredLanes |= s), a &= ~s;
		}
		if (t = Xu, n = Zu, n = Ze(e, e === t ? n : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1), r = e.callbackNode, n === 0 || e === t && (Qu === 2 || Qu === 9) || e.cancelPendingCommit !== null) return r !== null && r !== null && ke(r), e.callbackNode = null, e.callbackPriority = 0;
		if (!(n & 3) || Qe(e, n)) {
			if (t = n & -n, t === e.callbackPriority) return t;
			switch (r !== null && ke(r), lt(n)) {
				case 2:
				case 8:
					n = Fe;
					break;
				case 32:
					n = Ie;
					break;
				case 268435456:
					n = q;
					break;
				default: n = Ie;
			}
			return r = jf.bind(null, e), n = Oe(n, r), e.callbackPriority = t, e.callbackNode = n, t;
		}
		return r !== null && r !== null && ke(r), e.callbackPriority = 2, e.callbackNode = null, 2;
	}
	function jf(e, t) {
		if (vd !== 0 && vd !== 5) return e.callbackNode = null, e.callbackPriority = 0, null;
		var n = e.callbackNode;
		if (uf() && e.callbackNode !== n) return null;
		var r = Zu;
		return r = Ze(e, e === Xu ? r : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1), r === 0 ? null : (Pd(e, r, t), Af(e, Me()), e.callbackNode != null && e.callbackNode === n ? jf.bind(null, e) : null);
	}
	function Mf(e, t) {
		if (uf()) return null;
		Pd(e, t, !0);
	}
	function Nf() {
		Sp(function() {
			Yu & 6 ? Oe(Pe, Of) : kf();
		});
	}
	function Pf() {
		if (Tf === 0) {
			var e = ja;
			e === 0 && (e = qe, qe <<= 1, !(qe & 261888) && (qe = 256)), Tf = e;
		}
		return Tf;
	}
	function Ff(e) {
		return e == null || typeof e == "symbol" || typeof e == "boolean" ? null : typeof e == "function" ? e : ln(e);
	}
	function If(e, t, n, r, i) {
		if (t === "submit" && n && n.stateNode === i) {
			var a = Ff((i[mt] || null).action), o = r.submitter;
			o && (t = (t = o[mt] || null) ? Ff(t.formAction) : o.getAttribute("formAction"), t !== null && (a = t, o = null));
			var s = new jn("action", "action", null, r, i);
			e.push({
				event: s,
				listeners: [{
					instance: null,
					listener: function() {
						if (r.defaultPrevented) {
							if (Tf !== 0) {
								var e = new FormData(i, o);
								Js(n, {
									pending: !0,
									data: e,
									method: i.method,
									action: a
								}, null, e);
							}
						} else typeof a == "function" && (s.preventDefault(), e = new FormData(i, o), Js(n, {
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
	for (var Lf = 0; Lf < oi.length; Lf++) {
		var Rf = oi[Lf];
		si(Rf.toLowerCase(), "on" + (Rf[0].toUpperCase() + Rf.slice(1)));
	}
	si(Qr, "onAnimationEnd"), si($r, "onAnimationIteration"), si(ei, "onAnimationStart"), si("dblclick", "onDoubleClick"), si("focusin", "onFocus"), si("focusout", "onBlur"), si(ti, "onTransitionRun"), si(ni, "onTransitionStart"), si(ri, "onTransitionCancel"), si(ii, "onTransitionEnd"), Mt("onMouseEnter", ["mouseout", "mouseover"]), Mt("onMouseLeave", ["mouseout", "mouseover"]), Mt("onPointerEnter", ["pointerout", "pointerover"]), Mt("onPointerLeave", ["pointerout", "pointerover"]), jt("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), jt("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), jt("onBeforeInput", [
		"compositionend",
		"keypress",
		"textInput",
		"paste"
	]), jt("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), jt("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), jt("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
	var zf = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), Bf = new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(zf));
	function Vf(e, t) {
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
						fi(e);
					}
					i.currentTarget = null, a = c;
				}
				else for (o = 0; o < r.length; o++) {
					if (s = r[o], c = s.instance, l = s.currentTarget, s = s.listener, c !== a && i.isPropagationStopped()) break a;
					a = s, i.currentTarget = l;
					try {
						a(i);
					} catch (e) {
						fi(e);
					}
					i.currentTarget = null, a = c;
				}
			}
		}
	}
	function Hf(e, t) {
		var n = t[gt];
		n === void 0 && (n = t[gt] = /* @__PURE__ */ new Set());
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
			e[Wf] = !0, kt.forEach(function(t) {
				t !== "selectionchange" && (Bf.has(t) || Uf(t, !1, e), Uf(t, !0, e));
			});
			var t = e.nodeType === 9 ? e : e.ownerDocument;
			t === null || t[Wf] || (t[Wf] = !0, Uf("selectionchange", !1, t));
		}
	}
	function Kf(e, t, n, r) {
		switch (Th(t)) {
			case 2:
				var i = yh;
				break;
			case 8:
				i = bh;
				break;
			default: i = xh;
		}
		n = i.bind(null, t, n, e), i = void 0, !bn || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (i = !0), r ? i === void 0 ? e.addEventListener(t, n, !0) : e.addEventListener(t, n, {
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
					if (s = Ct(c), s === null) return;
					if (l = s.tag, l === 5 || l === 6 || l === 26 || l === 27) {
						r = a = s;
						continue a;
					}
					c = c.parentNode;
				}
			}
			r = r.return;
		}
		_n(function() {
			var r = a, i = fn(n), s = [];
			a: {
				var c = ai.get(e);
				if (c !== void 0) {
					var l = jn, u = e;
					switch (e) {
						case "keypress": if (En(n) === 0) break a;
						case "keydown":
						case "keyup":
							l = Yn;
							break;
						case "focusin":
							u = "focus", l = Bn;
							break;
						case "focusout":
							u = "blur", l = Bn;
							break;
						case "beforeblur":
						case "afterblur":
							l = Bn;
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
							l = Rn;
							break;
						case "drag":
						case "dragend":
						case "dragenter":
						case "dragexit":
						case "dragleave":
						case "dragover":
						case "dragstart":
						case "drop":
							l = zn;
							break;
						case "touchcancel":
						case "touchend":
						case "touchmove":
						case "touchstart":
							l = Qn;
							break;
						case Qr:
						case $r:
						case ei:
							l = Vn;
							break;
						case ii:
							l = $n;
							break;
						case "scroll":
						case "scrollend":
							l = Nn;
							break;
						case "wheel":
							l = er;
							break;
						case "copy":
						case "cut":
						case "paste":
							l = Hn;
							break;
						case "gotpointercapture":
						case "lostpointercapture":
						case "pointercancel":
						case "pointerdown":
						case "pointermove":
						case "pointerout":
						case "pointerover":
						case "pointerup":
							l = Xn;
							break;
						case "submit":
							l = Zn;
							break;
						case "toggle":
						case "beforetoggle": l = tr;
					}
					var d = !!(t & 4), f = !d && (e === "scroll" || e === "scrollend"), p = d ? c === null ? null : c + "Capture" : c;
					d = [];
					for (var m = r, h; m !== null;) {
						var g = m;
						if (h = g.stateNode, g = g.tag, g !== 5 && g !== 26 && g !== 27 || h === null || p === null || (g = vn(m, p), g != null && d.push(Jf(m, g, h))), f) break;
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
					if (l = e === "mouseover" || e === "pointerover", c = e === "mouseout" || e === "pointerout", l && n !== dn && (u = n.relatedTarget || n.fromElement) && (Ct(u) || u[ht])) break a;
					(c || l) && (u = i.window === i ? i : (l = i.ownerDocument) ? l.defaultView || l.parentWindow : window, c ? (l = n.relatedTarget || n.toElement, c = r, l = l ? Ct(l) : null, l !== null && (f = o(l), d = l.tag, l !== f || d !== 5 && d !== 27 && d !== 6) && (l = null)) : (c = null, l = r), c !== l && (d = Rn, g = "onMouseLeave", p = "onMouseEnter", m = "mouse", (e === "pointerout" || e === "pointerover") && (d = Xn, g = "onPointerLeave", p = "onPointerEnter", m = "pointer"), f = c == null ? u : Tt(c), h = l == null ? u : Tt(l), u = new d(g, m + "leave", c, n, i), u.target = f, u.relatedTarget = h, g = null, Ct(i) === r && (d = new d(p, m + "enter", l, n, i), d.target = h, d.relatedTarget = f, g = d), f = g, d = c && l ? E(c, l, Xf) : null, c !== null && Zf(s, u, c, d, !1), l !== null && f !== null && Zf(s, f, l, d, !0)));
				}
				a: {
					if (c = r ? Tt(r) : window, l = c.nodeName && c.nodeName.toLowerCase(), l === "select" || l === "input" && c.type === "file") var _ = xr;
					else if (hr(c)) {
						if (Sr) _ = jr;
						else {
							_ = kr;
							var v = Or;
						}
					} else l = c.nodeName, !l || l.toLowerCase() !== "input" || c.type !== "checkbox" && c.type !== "radio" ? r && on(r.elementType) && (_ = xr) : _ = Ar;
					if (_ &&= _(e, r)) {
						gr(s, _, n, i);
						break a;
					}
					v && v(e, c, r);
				}
				switch (v = r ? Tt(r) : window, e) {
					case "focusin":
						(hr(v) || v.contentEditable === "true") && (Hr = v, Ur = r, Wr = null);
						break;
					case "focusout":
						Wr = Ur = Hr = null;
						break;
					case "mousedown":
						Gr = !0;
						break;
					case "contextmenu":
					case "mouseup":
					case "dragend":
						Gr = !1, Kr(s, n, i);
						break;
					case "selectionchange": if (Vr) break;
					case "keydown":
					case "keyup": Kr(s, n, i);
				}
				var y;
				if (rr) b: {
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
				else dr ? lr(e, n) && (b = "onCompositionEnd") : e === "keydown" && n.keyCode === 229 && (b = "onCompositionStart");
				b && (or && n.locale !== "ko" && (dr || b !== "onCompositionStart" ? b === "onCompositionEnd" && dr && (y = Tn()) : (Sn = i, Cn = "value" in Sn ? Sn.value : Sn.textContent, dr = !0)), v = Yf(r, b), 0 < v.length && (b = new Un(b, e, null, n, i), s.push({
					event: b,
					listeners: v
				}), y ? b.data = y : (y = ur(n), y !== null && (b.data = y)))), (y = ar ? fr(e, n) : pr(e, n)) && (b = Yf(r, "onBeforeInput"), 0 < b.length && (v = new Un("onBeforeInput", "beforeinput", null, n, i), s.push({
					event: v,
					listeners: b
				}), v.data = y)), If(s, e, r, n, i);
			}
			Vf(s, t);
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
			if (i = i.tag, i !== 5 && i !== 26 && i !== 27 || a === null || (i = vn(e, n), i != null && r.unshift(Jf(e, i, a)), i = vn(e, t), i != null && r.push(Jf(e, i, a))), e.tag === 3) return r;
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
			s !== 5 && s !== 26 && s !== 27 || l === null || (c = l, i ? (l = vn(n, a), l != null && o.unshift(Jf(n, l, c))) : i || (l = vn(n, a), l != null && o.push(Jf(n, l, c)))), n = n.return;
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
				if (typeof r == "string") t === "body" || t === "textarea" && r === "" || tn(e, r);
				else if (typeof r == "number" || typeof r == "bigint") t !== "body" && tn(e, "" + r);
				else return;
				break;
			case "className":
				Bt(e, "class", r);
				break;
			case "tabIndex":
				Bt(e, "tabindex", r);
				break;
			case "dir":
			case "role":
			case "viewBox":
			case "width":
			case "height":
				Bt(e, n, r);
				break;
			case "style":
				an(e, r, o);
				return;
			case "data": if (t !== "object") {
				Bt(e, "data", r);
				break;
			}
			case "src":
			case "href":
				if (r === "" && (t !== "a" || n !== "href") || r == null || typeof r == "function" || typeof r == "symbol" || typeof r == "boolean") {
					e.removeAttribute(n);
					break;
				}
				r = ln(r), e.setAttribute(n, r);
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
				r = ln(r), e.setAttribute(n, r);
				break;
			case "onClick":
				r != null && (e.onclick = un);
				return;
			case "onScroll":
				r != null && Hf("scroll", e);
				return;
			case "onScrollEnd":
				r != null && Hf("scrollend", e);
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
				n = ln(r), e.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", n);
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
				Hf("beforetoggle", e), Hf("toggle", e), zt(e, "popover", r);
				break;
			case "xlinkActuate":
				Vt(e, "http://www.w3.org/1999/xlink", "xlink:actuate", r);
				break;
			case "xlinkArcrole":
				Vt(e, "http://www.w3.org/1999/xlink", "xlink:arcrole", r);
				break;
			case "xlinkRole":
				Vt(e, "http://www.w3.org/1999/xlink", "xlink:role", r);
				break;
			case "xlinkShow":
				Vt(e, "http://www.w3.org/1999/xlink", "xlink:show", r);
				break;
			case "xlinkTitle":
				Vt(e, "http://www.w3.org/1999/xlink", "xlink:title", r);
				break;
			case "xlinkType":
				Vt(e, "http://www.w3.org/1999/xlink", "xlink:type", r);
				break;
			case "xmlBase":
				Vt(e, "http://www.w3.org/XML/1998/namespace", "xml:base", r);
				break;
			case "xmlLang":
				Vt(e, "http://www.w3.org/XML/1998/namespace", "xml:lang", r);
				break;
			case "xmlSpace":
				Vt(e, "http://www.w3.org/XML/1998/namespace", "xml:space", r);
				break;
			case "is":
				zt(e, "is", r);
				break;
			case "innerText":
			case "textContent": return;
			default: if (!(2 < n.length) || n[0] !== "o" && n[0] !== "O" || n[1] !== "n" && n[1] !== "N") n = sn.get(n) || n, zt(e, n, r);
			else return;
		}
		Lt = !0;
	}
	function rp(e, t, n, r, a, o) {
		switch (n) {
			case "style":
				an(e, r, o);
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
				if (typeof r == "string") tn(e, r);
				else if (typeof r == "number" || typeof r == "bigint") tn(e, "" + r);
				else return;
				break;
			case "onScroll":
				r != null && Hf("scroll", e);
				return;
			case "onScrollEnd":
				r != null && Hf("scrollend", e);
				return;
			case "onClick":
				r != null && (e.onclick = un);
				return;
			case "suppressContentEditableWarning":
			case "suppressHydrationWarning":
			case "innerHTML":
			case "ref": return;
			case "innerText":
			case "textContent": return;
			default:
				if (!At.hasOwnProperty(n)) a: {
					if (n[0] === "o" && n[1] === "n" && (a = n.endsWith("Capture"), o = n.slice(2, a ? n.length - 7 : void 0), t = e[mt] || null, t = t == null ? null : t[n], typeof t == "function" && e.removeEventListener(o, t, a), typeof r == "function")) {
						typeof t != "function" && t !== null && (n in e ? e[n] = null : e.hasAttribute(n) && e.removeAttribute(n)), e.addEventListener(o, r, a);
						break a;
					}
					Lt = !0, n in e ? e[n] = r : !0 === r ? e.setAttribute(n, "") : zt(e, n, r);
				}
				return;
		}
		Lt = !0;
	}
	function ip(e, t, n) {
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
				Hf("error", e), Hf("load", e);
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
				Hf("invalid", e);
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
				Xt(e, o, c, l, u, s, a, !1);
				return;
			case "select":
				for (a in Hf("invalid", e), r = s = o = null, n) if (n.hasOwnProperty(a) && (c = n[a], c != null)) switch (a) {
					case "value":
						o = c;
						break;
					case "defaultValue":
						s = c;
						break;
					case "multiple": r = c;
					default: np(e, t, a, c, n, null);
				}
				t = o, n = s, e.multiple = !!r, t == null ? n != null && Qt(e, !!r, n, !0) : Qt(e, !!r, t, !1);
				return;
			case "textarea":
				for (s in Hf("invalid", e), o = a = r = null, n) if (n.hasOwnProperty(s) && (c = n[s], c != null)) switch (s) {
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
				en(e, r, a, o);
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
				Hf("beforetoggle", e), Hf("toggle", e), Hf("cancel", e), Hf("close", e);
				break;
			case "iframe":
			case "object":
				Hf("load", e);
				break;
			case "video":
			case "audio":
				for (r = 0; r < zf.length; r++) Hf(zf[r], e);
				break;
			case "image":
				Hf("error", e), Hf("load", e);
				break;
			case "details":
				Hf("toggle", e);
				break;
			case "embed":
			case "source":
			case "link": Hf("error", e), Hf("load", e);
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
			default: if (on(t)) {
				for (d in n) n.hasOwnProperty(d) && (r = n[d], r !== void 0 && rp(e, t, d, r, n, void 0));
				return;
			}
		}
		for (c in n) n.hasOwnProperty(c) && (r = n[c], r != null && np(e, t, c, r, n, null));
	}
	var ap = {};
	function op(e, t, n, r) {
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
							m !== f && (Lt = !0), o = m;
							break;
						case "name":
							m !== f && (Lt = !0), a = m;
							break;
						case "checked":
							m !== f && (Lt = !0), u = m;
							break;
						case "defaultChecked":
							m !== f && (Lt = !0), d = m;
							break;
						case "value":
							m !== f && (Lt = !0), s = m;
							break;
						case "defaultValue":
							m !== f && (Lt = !0), c = m;
							break;
						case "children":
						case "dangerouslySetInnerHTML":
							if (m != null) throw Error(i(137, t));
							break;
						default: m !== f && np(e, t, p, m, r, f);
					}
				}
				Yt(e, s, c, l, u, d, o, a);
				return;
			case "select":
				for (o in m = s = c = p = null, n) if (l = n[o], n.hasOwnProperty(o) && l != null) switch (o) {
					case "value": break;
					case "multiple": m = l;
					default: r.hasOwnProperty(o) || np(e, t, o, null, r, l);
				}
				for (a in r) if (o = r[a], l = n[a], r.hasOwnProperty(a) && (o != null || l != null)) switch (a) {
					case "value":
						o !== l && (Lt = !0), p = o;
						break;
					case "defaultValue":
						o !== l && (Lt = !0), c = o;
						break;
					case "multiple": o !== l && (Lt = !0), s = o;
					default: o !== l && np(e, t, a, o, r, l);
				}
				t = c, n = s, r = m, p == null ? !!r != !!n && (t == null ? Qt(e, !!n, n ? [] : "", !1) : Qt(e, !!n, t, !0)) : Qt(e, !!n, p, !1);
				return;
			case "textarea":
				for (c in m = p = null, n) if (a = n[c], n.hasOwnProperty(c) && a != null && !r.hasOwnProperty(c)) switch (c) {
					case "value": break;
					case "children": break;
					default: np(e, t, c, null, r, a);
				}
				for (s in r) if (a = r[s], o = n[s], r.hasOwnProperty(s) && (a != null || o != null)) switch (s) {
					case "value":
						a !== o && (Lt = !0), p = a;
						break;
					case "defaultValue":
						a !== o && (Lt = !0), m = a;
						break;
					case "children": break;
					case "dangerouslySetInnerHTML":
						if (a != null) throw Error(i(91));
						break;
					default: a !== o && np(e, t, s, a, r, o);
				}
				$t(e, p, m);
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
						p !== m && (Lt = !0), e.selected = p && typeof p != "function" && typeof p != "symbol";
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
			default: if (on(t)) {
				for (var _ in n) p = n[_], n.hasOwnProperty(_) && p !== void 0 && !r.hasOwnProperty(_) && rp(e, t, _, void 0, r, p);
				for (d in r) p = r[d], m = n[d], !r.hasOwnProperty(d) || p === m || p === void 0 && m === void 0 || rp(e, t, d, p, r, m);
				return;
			}
		}
		for (var v in n) p = n[v], n.hasOwnProperty(v) && p != null && !r.hasOwnProperty(v) && np(e, t, v, null, r, p);
		for (f in r) p = r[f], m = n[f], !r.hasOwnProperty(f) || p === m || p == null && m == null || np(e, t, f, p, r, m);
	}
	function sp(e) {
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
	function cp() {
		if (typeof performance.getEntriesByType == "function") {
			for (var e = 0, t = 0, n = performance.getEntriesByType("resource"), r = 0; r < n.length; r++) {
				var i = n[r], a = i.transferSize, o = i.initiatorType, s = i.duration;
				if (a && s && sp(o)) {
					for (o = 0, s = i.responseEnd, r += 1; r < n.length; r++) {
						var c = n[r], l = c.startTime;
						if (l > s) break;
						var u = c.transferSize, d = c.initiatorType;
						u && sp(d) && (c = c.responseEnd, o += u * (c < s ? 1 : (s - l) / (c - l)));
					}
					if (--r, t += 8 * (a + o) / (i.duration / 1e3), e++, 10 < e) break;
				}
			}
			if (0 < e) return t / e / 1e6;
		}
		return navigator.connection && (e = navigator.connection.downlink, typeof e == "number") ? e : 5;
	}
	var lp = null, up = null;
	function dp(e) {
		return e.nodeType === 9 ? e : e.ownerDocument;
	}
	function fp(e) {
		switch (e) {
			case "http://www.w3.org/2000/svg": return 1;
			case "http://www.w3.org/1998/Math/MathML": return 2;
			default: return 0;
		}
	}
	function pp(e, t) {
		if (e === 0) switch (t) {
			case "svg": return 1;
			case "math": return 2;
			default: return 0;
		}
		return e === 1 && t === "foreignObject" ? 0 : e;
	}
	function mp(e, t, n, r) {
		return n = dp(n).createElement(e), n[pt] = r, n[mt] = t, ip(n, e, t), Dt(n), n;
	}
	function hp(e, t) {
		return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.children == "bigint" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
	}
	var gp = null;
	function _p() {
		var e = window.event;
		return e && e.type === "popstate" ? e !== gp && (gp = e, !0) : (gp = null, !1);
	}
	var vp = typeof setTimeout == "function" ? setTimeout : void 0, yp = typeof clearTimeout == "function" ? clearTimeout : void 0, bp = typeof Promise == "function" ? Promise : void 0, xp = typeof requestAnimationFrame == "function" ? requestAnimationFrame : vp, Sp = typeof queueMicrotask == "function" ? queueMicrotask : bp === void 0 ? vp : function(e) {
		return bp.resolve(null).then(e).catch(Cp);
	};
	function Cp(e) {
		setTimeout(function() {
			throw e;
		});
	}
	function wp(e) {
		return e === "head";
	}
	function Tp(e, t) {
		var n = t, r = 0;
		do {
			var i = n.nextSibling;
			if (e.removeChild(n), i && i.nodeType === 8) {
				if (n = i.data, n === "/$" || n === "/&") {
					if (r === 0) {
						e.removeChild(i), Wh(t);
						return;
					}
					r--;
				} else if (n === "$" || n === "$?" || n === "$~" || n === "$!" || n === "&") r++;
				else if (n === "html") ym(e.ownerDocument.documentElement);
				else if (n === "head") {
					n = e.ownerDocument.head, ym(n);
					for (var a = n.firstChild; a;) {
						var o = a.nextSibling, s = a.nodeName;
						a[bt] || s === "SCRIPT" || s === "STYLE" || s === "LINK" && a.rel.toLowerCase() === "stylesheet" || n.removeChild(a), a = o;
					}
				} else n === "body" && ym(e.ownerDocument.body);
			}
			n = i;
		} while (n);
		Wh(t);
	}
	function Ep(e, t) {
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
	function Dp(e, t, n) {
		if (t = CSS.escape(t) === t ? t : "r-" + btoa(t).replace(/=/g, ""), e.style.viewTransitionName = t, n != null && (e.style.viewTransitionClass = n), n = getComputedStyle(e), n.display === "inline") {
			if (t = e.getClientRects(), t.length === 1) var r = 1;
			else for (var i = r = 0; i < t.length; i++) {
				var a = t[i];
				0 < a.width && 0 < a.height && r++;
			}
			r === 1 && (e = e.style, e.display = t.length === 1 ? "inline-block" : "block", e.marginTop = "-" + n.paddingTop, e.marginBottom = "-" + n.paddingBottom);
		}
	}
	function Op(e, t) {
		e = e.style, t = t.style;
		var n = t == null ? null : t.hasOwnProperty("viewTransitionName") ? t.viewTransitionName : t.hasOwnProperty("view-transition-name") ? t["view-transition-name"] : null;
		e.viewTransitionName = n == null || typeof n == "boolean" ? "" : ("" + n).trim(), n = t == null ? null : t.hasOwnProperty("viewTransitionClass") ? t.viewTransitionClass : t.hasOwnProperty("view-transition-class") ? t["view-transition-class"] : null, e.viewTransitionClass = n == null || typeof n == "boolean" ? "" : ("" + n).trim(), e.display === "inline-block" && (t == null ? e.display = e.margin = "" : (n = t.display, e.display = n == null || typeof n == "boolean" ? "" : n, n = t.margin, n == null ? (n = t.hasOwnProperty("marginTop") ? t.marginTop : t["margin-top"], e.marginTop = n == null || typeof n == "boolean" ? "" : n, t = t.hasOwnProperty("marginBottom") ? t.marginBottom : t["margin-bottom"], e.marginBottom = t == null || typeof t == "boolean" ? "" : t) : e.margin = n));
	}
	function kp(e, t, n) {
		return n = n.ownerDocument.defaultView, {
			rect: e,
			abs: t.position === "absolute" || t.position === "fixed",
			clip: t.clipPath !== "none" || t.overflow !== "visible" || t.filter !== "none" || t.mask !== "none" || t.mask !== "none" || t.borderRadius !== "0px",
			view: 0 <= e.bottom && 0 <= e.right && e.top <= n.innerHeight && e.left <= n.innerWidth
		};
	}
	function Ap(e) {
		return kp(e.getBoundingClientRect(), getComputedStyle(e), e);
	}
	function jp(e) {
		var t = e.getBoundingClientRect();
		t = new DOMRect(t.x + 2e4, t.y + 2e4, t.width, t.height);
		var n = getComputedStyle(e);
		return kp(t, n, e);
	}
	function Mp(e) {
		return e.documentElement.clientHeight;
	}
	function Np(e) {
		this.addEventListener("load", e), this.addEventListener("error", e);
	}
	function Pp(e, t, n, r, i, a, o, s, c) {
		var l = t.nodeType === 9 ? t : t.ownerDocument;
		try {
			var u = l.startViewTransition({
				update: function() {
					var t = l.defaultView, n = t.navigation && t.navigation.transition, o = l.fonts.status;
					r();
					var s = [];
					if (o === "loaded" && (Mp(l), l.fonts.status === "loading" && s.push(l.fonts.ready)), o = s.length, e !== null) for (var c = e.suspenseyImages, u = 0, d = 0; d < c.length; d++) {
						var f = c[d];
						if (!f.complete) {
							var p = f.getBoundingClientRect();
							if (0 < p.bottom && 0 < p.right && p.top < t.innerHeight && p.left < t.innerWidth) {
								if (u += Qm(f), u > th) {
									s.length = o;
									break;
								}
								f = new Promise(Np.bind(f)), s.push(f);
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
	function Fp(e, t) {
		this._scope = document.documentElement, this._selector = "::view-transition-" + e + "(" + t + ")";
	}
	Fp.prototype.animate = function(e, t) {
		return t = typeof t == "number" ? { duration: t } : D({}, t), t.pseudoElement = this._selector, this._scope.animate(e, t);
	}, Fp.prototype.getAnimations = function() {
		for (var e = this._scope, t = this._selector, n = e.getAnimations({ subtree: !0 }), r = [], i = 0; i < n.length; i++) {
			var a = n[i].effect;
			a !== null && a.target === e && a.pseudoElement === t && r.push(n[i]);
		}
		return r;
	}, Fp.prototype.getComputedStyle = function() {
		return getComputedStyle(this._scope, this._selector);
	};
	function Ip(e) {
		return {
			name: e,
			group: new Fp("group", e),
			imagePair: new Fp("image-pair", e),
			old: new Fp("old", e),
			new: new Fp("new", e)
		};
	}
	function Lp(e) {
		this._fragmentFiber = e, this._observers = this._eventListeners = null;
	}
	Lp.prototype.addEventListener = function(e, t, n) {
		var r = null, i = null;
		if (!(n != null && typeof n != "boolean" && (r = n.signal || null, r !== null && r.aborted))) {
			this._eventListeners === null && (this._eventListeners = []);
			var a = this._eventListeners;
			if (Hp(a, e, t, n) === -1) {
				var o = this, s = t;
				n != null && typeof n != "boolean" && !0 === n.once && (s = function(r) {
					o.removeEventListener(e, t, n), typeof t == "function" ? t.call(this, r) : t.handleEvent(r);
				}), r !== null && (i = o.removeEventListener.bind(o, e, t, n), r.addEventListener("abort", i, { once: !0 }), i = r.removeEventListener.bind(r, "abort", i)), r = Bp(n), a.push({
					type: e,
					listener: t,
					optionsOrUseCapture: n,
					attachedListener: s,
					cleanup: i
				}), h(this._fragmentFiber.child, !1, Rp, e, s, r);
			}
			this._eventListeners = a;
		}
	};
	function Rp(e, t, n, r) {
		return b(e).addEventListener(t, n, r), !1;
	}
	Lp.prototype.removeEventListener = function(e, t, n) {
		var r = this._eventListeners;
		if (r !== null && (t = Hp(r, e, t, n), t !== -1)) {
			var i = r[t];
			n = i.attachedListener;
			var a = i.cleanup;
			i = Bp(i.optionsOrUseCapture), h(this._fragmentFiber.child, !1, zp, e, n, i), r.splice(t, 1), a !== null && a();
		}
	};
	function zp(e, t, n, r) {
		return b(e).removeEventListener(t, n, r), !1;
	}
	function Bp(e) {
		return e != null && typeof e != "boolean" && (!0 === e.once || e.signal instanceof AbortSignal) ? {
			capture: e.capture,
			passive: e.passive
		} : e;
	}
	function Vp(e) {
		return e == null ? "c=0" : typeof e == "boolean" ? "c=" + (e ? "1" : "0") : "c=" + (e.capture ? "1" : "0");
	}
	function Hp(e, t, n, r) {
		if (e.length === 0) return -1;
		r = Vp(r);
		for (var i = 0; i < e.length; i++) {
			var a = e[i];
			if (a.type === t && a.listener === n && Vp(a.optionsOrUseCapture) === r) return i;
		}
		return -1;
	}
	Lp.prototype.dispatchEvent = function(e) {
		var t = g(this._fragmentFiber);
		if (t === null) return !0;
		t = b(t);
		var n = this._eventListeners;
		if (n !== null && 0 < n.length || !e.bubbles) {
			var r = t.nodeType === 9 ? t.createComment("") : document.createTextNode("");
			if (n) for (var i = 0; i < n.length; i++) {
				var a = n[i];
				r.addEventListener(a.type, a.attachedListener, Bp(a.optionsOrUseCapture));
			}
			if (t.appendChild(r), e = r.dispatchEvent(e), n) for (i = 0; i < n.length; i++) a = n[i], r.removeEventListener(a.type, a.attachedListener, Bp(a.optionsOrUseCapture));
			return t.removeChild(r), e;
		}
		return t.dispatchEvent(e);
	}, Lp.prototype.focus = function(e) {
		h(this._fragmentFiber.child, !0, Up, e, void 0, void 0);
	};
	function Up(e, t) {
		return e.tag !== 6 && (e = b(e), hm(e, t));
	}
	Lp.prototype.focusLast = function(e) {
		var t = [];
		h(this._fragmentFiber.child, !0, Wp, t, void 0, void 0);
		for (var n = t.length - 1; 0 <= n && !Up(t[n], e); n--);
	};
	function Wp(e, t) {
		return t.push(e), !1;
	}
	Lp.prototype.blur = function() {
		var e = g(this._fragmentFiber);
		e !== null && (e = b(e), e = dp(e).activeElement, e !== null && h(this._fragmentFiber.child, !1, Gp, e, void 0, void 0));
	};
	function Gp(e, t) {
		return e.tag !== 6 && (e = b(e), e === t || e.contains(t) ? (t.blur(), !0) : !1);
	}
	Lp.prototype.observeUsing = function(e) {
		this._observers === null && (this._observers = /* @__PURE__ */ new Set()), this._observers.add(e), h(this._fragmentFiber.child, !1, Kp, e, void 0, void 0);
	};
	function Kp(e, t) {
		return e.tag === 6 || (e = b(e), t.observe(e)), !1;
	}
	Lp.prototype.unobserveUsing = function(e) {
		var t = this._observers;
		if (t !== null && t.has(e)) {
			t.delete(e), h(this._fragmentFiber.child, !1, qp, e, void 0, void 0);
			for (var n = t = 0; n < Jp.length; n++) {
				var r = Jp[n];
				r.fragmentInstance === this && r.observer === e ? e.unobserve(r.instance) : Jp[t++] = r;
			}
			Jp.length = t;
		}
	};
	function qp(e, t) {
		return e.tag === 6 || (e = b(e), t.unobserve(e)), !1;
	}
	var Jp = [], Yp = !1;
	function Xp(e, t, n) {
		Jp.push({
			fragmentInstance: e,
			observer: t,
			instance: n
		}), Yp || (Yp = !0, gm(function() {
			Yp = !1;
			var e = Jp;
			Jp = [];
			for (var t = 0; t < e.length; t++) {
				var n = e[t];
				n.observer.unobserve(n.instance);
			}
		}));
	}
	Lp.prototype.getClientRects = function() {
		var e = [];
		return h(this._fragmentFiber.child, !1, Zp, e, void 0, void 0), e;
	};
	function Zp(e, t) {
		if (e.tag === 6) {
			e = e.stateNode;
			var n = e.ownerDocument.createRange();
			n.selectNodeContents(e), t.push.apply(t, n.getClientRects());
		} else e = b(e), t.push.apply(t, e.getClientRects());
		return !1;
	}
	Lp.prototype.getRootNode = function(e) {
		var t = g(this._fragmentFiber);
		return t === null ? this : b(t).getRootNode(e);
	}, Lp.prototype.compareDocumentPosition = function(e) {
		var t = g(this._fragmentFiber);
		if (t === null) return Node.DOCUMENT_POSITION_DISCONNECTED;
		var n = [];
		h(this._fragmentFiber.child, !1, Wp, n, void 0, void 0);
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
		return s = r && a && o & Node.DOCUMENT_POSITION_FOLLOWING && s & Node.DOCUMENT_POSITION_PRECEDING, t = r && t === e || a && i === e || c || s ? Node.DOCUMENT_POSITION_CONTAINED_BY : !r && t === e || !a && i === e ? Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC : o, t & Node.DOCUMENT_POSITION_DISCONNECTED || t & Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC || Qp(t, this._fragmentFiber, n[0], n[n.length - 1], e) ? t : Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC;
	};
	function Qp(e, t, n, r, i) {
		var a = Ct(i);
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
	function $p(e, t) {
		var n = e.ownerDocument.createRange();
		n.selectNodeContents(e), e = n.getBoundingClientRect(), window.scrollTo(window.scrollX + e.left, t ? window.scrollY + e.top : window.scrollY + e.bottom - window.innerHeight);
	}
	Lp.prototype.scrollIntoView = function(e) {
		if (typeof e == "object") throw Error(i(566));
		var t = [];
		h(this._fragmentFiber.child, !1, Wp, t, void 0, void 0);
		var n = !1 !== e;
		if (t.length === 0) {
			var r = v(this._fragmentFiber);
			if (r = n ? r[1] || r[0] || g(this._fragmentFiber) : r[0] || r[1], r === null) return;
			if (r.tag === 6) {
				e = b(r), $p(e, n);
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
			a.tag === 6 ? (a = b(a), $p(a, n)) : b(a).scrollIntoView(e), r += n ? -1 : 1;
		}
	};
	function em(e, t) {
		return e = b(e), tm(e, t), !1;
	}
	function tm(e, t) {
		e.reactFragments ??= /* @__PURE__ */ new Set(), e.reactFragments.add(t);
	}
	function nm(e, t) {
		var n = t._eventListeners;
		if (n !== null) for (var r = 0; r < n.length; r++) {
			var i = n[r];
			e.addEventListener(i.type, i.attachedListener, Bp(i.optionsOrUseCapture));
		}
		e.nodeType !== 3 && (n = t._observers, n !== null && n.forEach(function(n) {
			for (var r = 0, i = 0; i < Jp.length; i++) {
				var a = Jp[i];
				(a.fragmentInstance !== t || a.observer !== n || a.instance !== e) && (Jp[r++] = a);
			}
			Jp.length = r, n.observe(e);
		}), tm(e, t));
	}
	function rm(e, t) {
		var n = t._eventListeners;
		if (n !== null) for (var r = 0; r < n.length; r++) {
			var i = n[r];
			e.removeEventListener(i.type, i.attachedListener, Bp(i.optionsOrUseCapture));
		}
		e.nodeType !== 3 && (n = t._observers, n !== null && n.forEach(function(n) {
			typeof n.rootMargin == "string" ? Xp(t, n, e) : n.unobserve(e);
		}), e.reactFragments != null && e.reactFragments.delete(t));
	}
	function im(e) {
		var t = e.firstChild;
		for (t && t.nodeType === 10 && (t = t.nextSibling); t;) {
			var n = t;
			switch (t = t.nextSibling, n.nodeName) {
				case "HTML":
				case "HEAD":
				case "BODY":
					im(n), St(n);
					continue;
				case "SCRIPT":
				case "STYLE": continue;
				case "LINK": if (n.rel.toLowerCase() === "stylesheet") continue;
			}
			e.removeChild(n);
		}
	}
	function am(e, t, n, r) {
		for (; e.nodeType === 1;) {
			var i = n;
			if (e.nodeName.toLowerCase() !== t.toLowerCase()) {
				if (!r && (e.nodeName !== "INPUT" || e.type !== "hidden")) break;
			} else if (!r) {
				if (t === "input" && e.type === "hidden") {
					var a = i.name == null ? null : "" + i.name;
					if (i.type === "hidden" && e.getAttribute("name") === a) return e;
				} else return e;
			} else if (!e[bt]) switch (t) {
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
			if (e = dm(e.nextSibling), e === null) break;
		}
		return null;
	}
	function om(e, t, n) {
		if (t === "") return null;
		for (; e.nodeType !== 3;) if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !n || (e = dm(e.nextSibling), e === null)) return null;
		return e;
	}
	function sm(e, t) {
		for (; e.nodeType !== 8;) if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !t || (e = dm(e.nextSibling), e === null)) return null;
		return e;
	}
	function cm(e) {
		return e.data === "$?" || e.data === "$~";
	}
	function lm(e) {
		return e.data === "$!" || e.data === "$?" && e.ownerDocument.readyState !== "loading";
	}
	function um(e, t) {
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
	function dm(e) {
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
	var fm = null;
	function pm(e) {
		e = e.nextSibling;
		for (var t = 0; e;) {
			if (e.nodeType === 8) {
				var n = e.data;
				if (n === "/$" || n === "/&") {
					if (t === 0) return dm(e.nextSibling);
					t--;
				} else n !== "$" && n !== "$!" && n !== "$?" && n !== "$~" && n !== "&" || t++;
			}
			e = e.nextSibling;
		}
		return null;
	}
	function mm(e) {
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
	function hm(e, t) {
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
	function gm(e) {
		xp(function() {
			xp(function(t) {
				return e(t);
			});
		});
	}
	function _m(e, t, n) {
		switch (t = dp(n), e) {
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
	function vm(e, t, n) {
		for (var r in n) {
			var i = n[r];
			n.hasOwnProperty(r) && i != null && np(e, t, r, null, ap, i);
		}
		n.dangerouslySetInnerHTML != null && (e.textContent = ""), e.onclick === un && (e.onclick = null), St(e);
	}
	function ym(e) {
		for (var t = e.attributes; t.length;) e.removeAttributeNode(t[0]);
		St(e);
	}
	var bm = /* @__PURE__ */ new Map(), xm = /* @__PURE__ */ new Set();
	function Sm(e) {
		if (typeof e.getRootNode == "function") {
			var t = e.getRootNode();
			if (t.nodeType === 9 || t.nodeType === 11) return t;
		}
		return e.nodeType === 9 ? e : e.ownerDocument;
	}
	var Cm = H.d;
	H.d = {
		f: wm,
		r: Tm,
		D: Om,
		C: km,
		L: Am,
		m: jm,
		X: Nm,
		S: Mm,
		M: Pm
	};
	function wm() {
		var e = Cm.f(), t = Rd();
		return e || t;
	}
	function Tm(e) {
		var t = wt(e);
		t !== null && t.tag === 5 && t.type === "form" ? Xs(t) : Cm.r(e);
	}
	var Em = typeof document > "u" ? null : document;
	function Dm(e, t, n) {
		var r = Em;
		if (r && typeof t == "string" && t) {
			var i = Jt(t);
			i = "link[rel=\"" + e + "\"][href=\"" + i + "\"]", typeof n == "string" && (i += "[crossorigin=\"" + n + "\"]"), xm.has(i) || (xm.add(i), e = {
				rel: e,
				crossOrigin: n,
				href: t
			}, r.querySelector(i) === null && (t = r.createElement("link"), ip(t, "link", e), Dt(t), r.head.appendChild(t)));
		}
	}
	function Om(e) {
		Cm.D(e), Dm("dns-prefetch", e, null);
	}
	function km(e, t) {
		Cm.C(e, t), Dm("preconnect", e, t);
	}
	function Am(e, t, n) {
		Cm.L(e, t, n);
		var r = Em;
		if (r && e && t) {
			var i = "link[rel=\"preload\"][as=\"" + Jt(t) + "\"]";
			t === "image" && n && n.imageSrcSet ? (i += "[imagesrcset=\"" + Jt(n.imageSrcSet) + "\"]", typeof n.imageSizes == "string" && (i += "[imagesizes=\"" + Jt(n.imageSizes) + "\"]")) : i += "[href=\"" + Jt(e) + "\"]";
			var a = i;
			switch (t) {
				case "style":
					a = Im(e);
					break;
				case "script": a = Bm(e);
			}
			if (!(bm.has(a) || (e = D({
				rel: "preload",
				href: t === "image" && n && n.imageSrcSet ? void 0 : e,
				as: t
			}, n), bm.set(a, e), r.querySelector(i) !== null || t === "style" && r.querySelector(Lm(a)) || t === "script" && r.querySelector(Vm(a))))) {
				var o = r.createElement("link");
				ip(o, "link", e), t === "style" && (o[xt] = !0, o.onload = o.onerror = function() {
					Ot(o);
				}), Dt(o), r.head.appendChild(o);
			}
		}
	}
	function jm(e, t) {
		Cm.m(e, t);
		var n = Em;
		if (n && e) {
			var r = t && typeof t.as == "string" ? t.as : "script", i = "link[rel=\"modulepreload\"][as=\"" + Jt(r) + "\"][href=\"" + Jt(e) + "\"]", a = i;
			switch (r) {
				case "audioworklet":
				case "paintworklet":
				case "serviceworker":
				case "sharedworker":
				case "worker":
				case "script": a = Bm(e);
			}
			if (!bm.has(a) && (e = D({
				rel: "modulepreload",
				href: e
			}, t), bm.set(a, e), n.querySelector(i) === null)) {
				switch (r) {
					case "audioworklet":
					case "paintworklet":
					case "serviceworker":
					case "sharedworker":
					case "worker":
					case "script": if (n.querySelector(Vm(a))) return;
				}
				r = n.createElement("link"), ip(r, "link", e), Dt(r), n.head.appendChild(r);
			}
		}
	}
	function Mm(e, t, n) {
		Cm.S(e, t, n);
		var r = Em;
		if (r && e) {
			var i = Et(r).hoistableStyles, a = Im(e);
			t ||= "default";
			var o = i.get(a);
			if (!o) {
				var s = {
					loading: 0,
					preload: null
				};
				if (o = r.querySelector(Lm(a))) s.loading = 5;
				else {
					e = D({
						rel: "stylesheet",
						href: e,
						"data-precedence": t
					}, n), (n = bm.get(a)) && Wm(e, n);
					var c = o = r.createElement("link");
					Dt(c), ip(c, "link", e), c._p = new Promise(function(e, t) {
						c.onload = e, c.onerror = t;
					}), c.addEventListener("load", function() {
						s.loading |= 1;
					}), c.addEventListener("error", function() {
						s.loading |= 2;
					}), s.loading |= 4, Um(o, t, r);
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
	function Nm(e, t) {
		Cm.X(e, t);
		var n = Em;
		if (n && e) {
			var r = Et(n).hoistableScripts, i = Bm(e), a = r.get(i);
			a || (a = n.querySelector(Vm(i)), a || (e = D({
				src: e,
				async: !0
			}, t), (t = bm.get(i)) && Gm(e, t), a = n.createElement("script"), Dt(a), ip(a, "link", e), n.head.appendChild(a)), a = {
				type: "script",
				instance: a,
				count: 1,
				state: null
			}, r.set(i, a));
		}
	}
	function Pm(e, t) {
		Cm.M(e, t);
		var n = Em;
		if (n && e) {
			var r = Et(n).hoistableScripts, i = Bm(e), a = r.get(i);
			a || (a = n.querySelector(Vm(i)), a || (e = D({
				src: e,
				async: !0,
				type: "module"
			}, t), (t = bm.get(i)) && Gm(e, t), a = n.createElement("script"), Dt(a), ip(a, "link", e), n.head.appendChild(a)), a = {
				type: "script",
				instance: a,
				count: 1,
				state: null
			}, r.set(i, a));
		}
	}
	function Fm(e, t, n, r) {
		var a = (a = G.current) ? Sm(a) : null;
		if (!a) throw Error(i(446));
		switch (e) {
			case "meta":
			case "title": return null;
			case "style": return typeof n.precedence == "string" && typeof n.href == "string" ? (n = Im(n.href), t = Et(a).hoistableStyles, r = t.get(n), r || (r = {
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
					e = Im(n.href);
					var o = Et(a).hoistableStyles, s = o.get(e);
					if (s || (a = a.ownerDocument || a, s = {
						type: "stylesheet",
						instance: null,
						count: 0,
						state: {
							loading: 0,
							preload: null
						}
					}, o.set(e, s), (o = a.querySelector(Lm(e))) ? o._p || (s.instance = o, s.state.loading = 5) : (o = bm.get(e), o || (o = {
						rel: "preload",
						as: "style",
						href: n.href,
						crossOrigin: n.crossOrigin,
						integrity: n.integrity,
						media: n.media,
						hrefLang: n.hrefLang,
						referrerPolicy: n.referrerPolicy
					}, bm.set(e, o)), zm(a, e, o, s.state))), t && r === null) throw Error(i(528, ""));
					return s;
				}
				if (t && r !== null) throw Error(i(529, ""));
				return null;
			case "script": return t = n.async, n = n.src, typeof n == "string" && t && typeof t != "function" && typeof t != "symbol" ? (n = Bm(n), t = Et(a).hoistableScripts, r = t.get(n), r || (r = {
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
	function Im(e) {
		return "href=\"" + Jt(e) + "\"";
	}
	function Lm(e) {
		return "link[rel=\"stylesheet\"][" + e + "]";
	}
	function Rm(e) {
		return D({}, e, {
			"data-precedence": e.precedence,
			precedence: null
		});
	}
	function zm(e, t, n, r) {
		if (t = e.querySelector("link[rel=\"preload\"][as=\"style\"][" + t + "]")) {
			if (!0 !== t[xt]) {
				r.loading = 1;
				return;
			}
		} else t = e.createElement("link"), t[xt] = !0, t.onload = t.onerror = Ot.bind(null, t), ip(t, "link", n), Dt(t), e.head.appendChild(t);
		r.preload = t, t.addEventListener("load", function() {
			return r.loading |= 1;
		}), t.addEventListener("error", function() {
			return r.loading |= 2;
		});
	}
	function Bm(e) {
		return "[src=\"" + Jt(e) + "\"]";
	}
	function Vm(e) {
		return "script[async]" + e;
	}
	function Hm(e, t, n) {
		if (t.count++, t.instance === null) switch (t.type) {
			case "style":
				var r = e.querySelector("style[data-href~=\"" + Jt(n.href) + "\"]");
				if (r) return t.instance = r, Dt(r), r;
				var a = D({}, n, {
					"data-href": n.href,
					"data-precedence": n.precedence,
					href: null,
					precedence: null
				});
				return r = (e.ownerDocument || e).createElement("style"), Dt(r), ip(r, "style", a), Um(r, n.precedence, e), t.instance = r;
			case "stylesheet":
				a = Im(n.href);
				var o = e.querySelector(Lm(a));
				if (o) return t.state.loading |= 4, t.instance = o, Dt(o), o;
				r = Rm(n), (a = bm.get(a)) && Wm(r, a), o = (e.ownerDocument || e).createElement("link"), Dt(o);
				var s = o;
				return s._p = new Promise(function(e, t) {
					s.onload = e, s.onerror = t;
				}), ip(o, "link", r), t.state.loading |= 4, Um(o, n.precedence, e), t.instance = o;
			case "script": return o = Bm(n.src), (a = e.querySelector(Vm(o))) ? (t.instance = a, Dt(a), a) : (r = n, (a = bm.get(o)) && (r = D({}, n), Gm(r, a)), e = e.ownerDocument || e, a = e.createElement("script"), Dt(a), ip(a, "link", r), e.head.appendChild(a), t.instance = a);
			case "void": return null;
			default: throw Error(i(443, t.type));
		}
		else t.type === "stylesheet" && !(t.state.loading & 4) && (r = t.instance, t.state.loading |= 4, Um(r, n.precedence, e));
		return t.instance;
	}
	function Um(e, t, n) {
		for (var r = n.querySelectorAll("link[rel=\"stylesheet\"][data-precedence],style[data-precedence]"), i = r.length ? r[r.length - 1] : null, a = i, o = 0; o < r.length; o++) {
			var s = r[o];
			if (s.dataset.precedence === t) a = s;
			else if (a !== i) break;
		}
		a ? a.parentNode.insertBefore(e, a.nextSibling) : (t = n.nodeType === 9 ? n.head : n, t.insertBefore(e, t.firstChild));
	}
	function Wm(e, t) {
		e.crossOrigin ??= t.crossOrigin, e.referrerPolicy ??= t.referrerPolicy, e.title ??= t.title;
	}
	function Gm(e, t) {
		e.crossOrigin ??= t.crossOrigin, e.referrerPolicy ??= t.referrerPolicy, e.integrity ??= t.integrity;
	}
	var Km = null;
	function qm(e, t, n) {
		if (Km === null) {
			var r = /* @__PURE__ */ new Map(), i = Km = /* @__PURE__ */ new Map();
			i.set(n, r);
		} else i = Km, r = i.get(n), r || (r = /* @__PURE__ */ new Map(), i.set(n, r));
		if (r.has(e)) return r;
		for (r.set(e, null), n = n.getElementsByTagName(e), i = 0; i < n.length; i++) {
			var a = n[i];
			if (!(a[bt] || a[pt] || e === "link" && a.getAttribute("rel") === "stylesheet") && a.namespaceURI !== "http://www.w3.org/2000/svg") {
				var o = a.getAttribute(t) || "";
				o = e + o;
				var s = r.get(o);
				s ? s.push(a) : r.set(o, [a]);
			}
		}
		return r;
	}
	function Jm(e, t, n) {
		e = e.ownerDocument || e, e.head.insertBefore(n, t === "title" ? e.querySelector("head > title") : null);
	}
	function Ym(e, t, n) {
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
	function Xm(e, t) {
		return e === "img" && t.src != null && t.src !== "" && t.onLoad == null && t.loading !== "lazy";
	}
	function Zm(e) {
		return !(e.type === "stylesheet" && !(e.state.loading & 3));
	}
	function Qm(e) {
		return (e.width || 100) * (e.height || 100) * (typeof devicePixelRatio == "number" ? devicePixelRatio : 1) * .25;
	}
	function $m(e, t) {
		typeof t.decode == "function" && (e.imgCount++, t.complete || (e.imgBytes += Qm(t), e.suspenseyImages.push(t)), e = ah.bind(e), t.decode().then(e, e));
	}
	function eh(e, t, n, r) {
		if (n.type === "stylesheet" && (typeof r.media != "string" || !1 !== matchMedia(r.media).matches) && !(n.state.loading & 4)) {
			if (n.instance === null) {
				var i = Im(r.href), a = t.querySelector(Lm(i));
				if (a) {
					t = a._p, typeof t == "object" && t && typeof t.then == "function" && (e.count++, e = ih.bind(e), t.then(e, e)), n.state.loading |= 4, n.instance = a, Dt(a);
					return;
				}
				a = t.ownerDocument || t, r = Rm(r), (i = bm.get(i)) && Wm(r, i), a = a.createElement("link"), Dt(a);
				var o = a;
				o._p = new Promise(function(e, t) {
					o.onload = e, o.onerror = t;
				}), ip(a, "link", r), n.instance = a;
			}
			e.stylesheets === null && (e.stylesheets = /* @__PURE__ */ new Map()), e.stylesheets.set(n, t), (t = n.state.preload) && !(n.state.loading & 3) && (e.count++, n = ih.bind(e), t.addEventListener("load", n), t.addEventListener("error", n));
		}
	}
	var th = 0;
	function nh(e, t) {
		return e.stylesheets && e.count === 0 && sh(e, e.stylesheets), 0 < e.count || 0 < e.imgCount ? function(n) {
			var r = setTimeout(function() {
				if (e.stylesheets && sh(e, e.stylesheets), e.unsuspend) {
					var t = e.unsuspend;
					e.unsuspend = null, t();
				}
			}, 6e4 + t);
			0 < e.imgBytes && th === 0 && (th = 62500 * cp());
			var i = setTimeout(function() {
				if (e.waitingForImages = !1, e.count === 0 && (e.stylesheets && sh(e, e.stylesheets), e.unsuspend)) {
					var t = e.unsuspend;
					e.unsuspend = null, t();
				}
			}, (e.imgBytes > th ? 50 : 800) + t);
			return e.unsuspend = n, function() {
				e.unsuspend = null, clearTimeout(r), clearTimeout(i);
			};
		} : null;
	}
	function rh(e) {
		if (e.count === 0 && (e.imgCount === 0 || !e.waitingForImages)) {
			if (e.stylesheets) sh(e, e.stylesheets);
			else if (e.unsuspend) {
				var t = e.unsuspend;
				e.unsuspend = null, t();
			}
		}
	}
	function ih() {
		this.count--, rh(this);
	}
	function ah() {
		this.imgCount--, rh(this);
	}
	var oh = null;
	function sh(e, t) {
		e.stylesheets = null, e.unsuspend !== null && (e.count++, oh = /* @__PURE__ */ new Map(), t.forEach(ch, e), oh = null, ih.call(e));
	}
	function ch(e, t) {
		if (!(t.state.loading & 4)) {
			var n = oh.get(e);
			if (n) var r = n.get(null);
			else {
				n = /* @__PURE__ */ new Map(), oh.set(e, n);
				for (var i = e.querySelectorAll("link[data-precedence],style[data-precedence]"), a = 0; a < i.length; a++) {
					var o = i[a];
					(o.nodeName === "LINK" || o.getAttribute("media") !== "not all") && (n.set(o.dataset.precedence, o), r = o);
				}
				r && n.set(null, r);
			}
			i = t.instance, o = i.getAttribute("data-precedence"), a = n.get(o) || r, a === r && n.set(null, i), n.set(o, i), this.count++, r = ih.bind(this), i.addEventListener("load", r), i.addEventListener("error", r), a ? a.parentNode.insertBefore(i, a.nextSibling) : (e = e.nodeType === 9 ? e.head : e, e.insertBefore(i, e.firstChild)), t.state.loading |= 4;
		}
	}
	var lh = {
		$$typeof: F,
		Provider: null,
		Consumer: null,
		_currentValue: ue,
		_currentValue2: ue,
		_threadCount: 0
	};
	function uh(e, t, n, r, i, a, o, s, c) {
		this.tag = 1, this.containerInfo = e, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = nt(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = nt(0), this.hiddenUpdates = nt(null), this.identifierPrefix = r, this.onUncaughtError = i, this.onCaughtError = a, this.onRecoverableError = o, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = c, this.transitionTypes = null, this.incompleteTransitions = /* @__PURE__ */ new Map();
	}
	function dh(e, t, n, r, i, a, o, s, c, l, u, d) {
		return e = new uh(e, t, n, o, c, l, u, d, s), t = 1, !0 === a && (t |= 24), a = wi(3, null, null, t), e.current = a, a.stateNode = e, t = wa(), t.refCount++, e.pooledCache = t, t.refCount++, a.memoizedState = {
			element: r,
			isDehydrated: n,
			cache: t
		}, oo(a), e;
	}
	function fh(e) {
		return e ? (e = Si, e) : Si;
	}
	function ph(e, t, n, r, i, a) {
		i = fh(i), r.context === null ? r.context = i : r.pendingContext = i, r = co(t), r.payload = { element: n }, a = a === void 0 ? null : a, a !== null && (r.callback = a), n = lo(e, r, t), n !== null && (Nd(n, e, t), uo(n, e, t));
	}
	function mh(e, t) {
		if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
			var n = e.retryLane;
			e.retryLane = n !== 0 && n < t ? n : t;
		}
	}
	function hh(e, t) {
		mh(e, t), (e = e.alternate) && mh(e, t);
	}
	function gh(e) {
		if (e.tag === 13 || e.tag === 31) {
			var t = yi(e, 67108864);
			t !== null && Nd(t, e, 67108864), hh(e, 67108864);
		}
	}
	function _h(e) {
		if (e.tag === 13 || e.tag === 31) {
			var t = Ad();
			t = ct(t);
			var n = yi(e, t);
			n !== null && Nd(n, e, t), hh(e, t);
		}
	}
	var vh = !0;
	function yh(e, t, n, r) {
		var i = V.T;
		V.T = null;
		var a = H.p;
		try {
			H.p = 2, xh(e, t, n, r);
		} finally {
			H.p = a, V.T = i;
		}
	}
	function bh(e, t, n, r) {
		var i = V.T;
		V.T = null;
		var a = H.p;
		try {
			H.p = 8, xh(e, t, n, r);
		} finally {
			H.p = a, V.T = i;
		}
	}
	function xh(e, t, n, r) {
		if (vh) {
			var i = Sh(r);
			if (i === null) qf(e, t, r, Ch, n), Ph(e, r);
			else if (Ih(i, e, t, n, r)) r.stopPropagation();
			else if (Ph(e, r), t & 4 && -1 < Nh.indexOf(e)) {
				for (; i !== null;) {
					var a = wt(i);
					if (a !== null) switch (a.tag) {
						case 3:
							if (a = a.stateNode, a.current.memoizedState.isDehydrated) {
								var o = Xe(a.pendingLanes);
								if (o !== 0) {
									var s = a;
									for (s.pendingLanes |= 2, s.entangledLanes |= 2; o;) {
										var c = 1 << 31 - Ue(o);
										s.entanglements[1] |= c, o &= ~c;
									}
									Ef(a), !(Yu & 6) && (hd = Me() + 500, Df(0, !1));
								}
							}
							break;
						case 31:
						case 13: s = yi(a, 2), s !== null && Nd(s, a, 2), Rd(), hh(a, 2);
					}
					if (a = Sh(r), a === null && qf(e, t, r, Ch, n), a === i) break;
					i = a;
				}
				i !== null && r.stopPropagation();
			} else qf(e, t, r, null, n);
		}
	}
	function Sh(e) {
		return e = fn(e), wh(e);
	}
	var Ch = null;
	function wh(e) {
		if (Ch = null, e = Ct(e), e !== null) {
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
		return Ch = e, null;
	}
	function Th(e) {
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
			case "message": switch (Ne()) {
				case Pe: return 2;
				case Fe: return 8;
				case Ie:
				case Le: return 32;
				case q: return 268435456;
				default: return 32;
			}
			default: return 32;
		}
	}
	var Eh = !1, Dh = null, Oh = null, kh = null, Ah = /* @__PURE__ */ new Map(), jh = /* @__PURE__ */ new Map(), Mh = [], Nh = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");
	function Ph(e, t) {
		switch (e) {
			case "focusin":
			case "focusout":
				Dh = null;
				break;
			case "dragenter":
			case "dragleave":
				Oh = null;
				break;
			case "mouseover":
			case "mouseout":
				kh = null;
				break;
			case "pointerover":
			case "pointerout":
				Ah.delete(t.pointerId);
				break;
			case "gotpointercapture":
			case "lostpointercapture": jh.delete(t.pointerId);
		}
	}
	function Fh(e, t, n, r, i, a) {
		return e === null || e.nativeEvent !== a ? (e = {
			blockedOn: t,
			domEventName: n,
			eventSystemFlags: r,
			nativeEvent: a,
			targetContainers: [i]
		}, t !== null && (t = wt(t), t !== null && gh(t)), e) : (e.eventSystemFlags |= r, t = e.targetContainers, i !== null && t.indexOf(i) === -1 && t.push(i), e);
	}
	function Ih(e, t, n, r, i) {
		switch (t) {
			case "focusin": return Dh = Fh(Dh, e, t, n, r, i), !0;
			case "dragenter": return Oh = Fh(Oh, e, t, n, r, i), !0;
			case "mouseover": return kh = Fh(kh, e, t, n, r, i), !0;
			case "pointerover":
				var a = i.pointerId;
				return Ah.set(a, Fh(Ah.get(a) || null, e, t, n, r, i)), !0;
			case "gotpointercapture": return a = i.pointerId, jh.set(a, Fh(jh.get(a) || null, e, t, n, r, i)), !0;
		}
		return !1;
	}
	function Lh(e) {
		var t = Ct(e.target);
		if (t !== null) {
			var n = o(t);
			if (n !== null) {
				if (t = n.tag, t === 13) {
					if (t = s(n), t !== null) {
						e.blockedOn = t, dt(e.priority, function() {
							_h(n);
						});
						return;
					}
				} else if (t === 31) {
					if (t = c(n), t !== null) {
						e.blockedOn = t, dt(e.priority, function() {
							_h(n);
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
	function Rh(e) {
		if (e.blockedOn !== null) return !1;
		for (var t = e.targetContainers; 0 < t.length;) {
			var n = Sh(e.nativeEvent);
			if (n === null) {
				n = e.nativeEvent;
				var r = new n.constructor(n.type, n);
				dn = r, n.target.dispatchEvent(r), dn = null;
			} else return t = wt(n), t !== null && gh(t), e.blockedOn = n, !1;
			t.shift();
		}
		return !0;
	}
	function zh(e, t, n) {
		Rh(e) && n.delete(t);
	}
	function Bh() {
		Eh = !1, Dh !== null && Rh(Dh) && (Dh = null), Oh !== null && Rh(Oh) && (Oh = null), kh !== null && Rh(kh) && (kh = null), Ah.forEach(zh), jh.forEach(zh);
	}
	function Vh(e, n) {
		e.blockedOn === n && (e.blockedOn = null, Eh || (Eh = !0, t.unstable_scheduleCallback(t.unstable_NormalPriority, Bh)));
	}
	var Hh = null;
	function Uh(e) {
		Hh !== e && (Hh = e, t.unstable_scheduleCallback(t.unstable_NormalPriority, function() {
			Hh === e && (Hh = null);
			for (var t = 0; t < e.length; t += 3) {
				var n = e[t], r = e[t + 1], i = e[t + 2];
				if (typeof r != "function") {
					if (wh(r || n) === null) continue;
					break;
				}
				var a = wt(n);
				a !== null && (e.splice(t, 3), t -= 3, Js(a, {
					pending: !0,
					data: i,
					method: n.method,
					action: r
				}, r, i));
			}
		}));
	}
	function Wh(e) {
		function t(t) {
			return Vh(t, e);
		}
		Dh !== null && Vh(Dh, e), Oh !== null && Vh(Oh, e), kh !== null && Vh(kh, e), Ah.forEach(t), jh.forEach(t);
		for (var n = 0; n < Mh.length; n++) {
			var r = Mh[n];
			r.blockedOn === e && (r.blockedOn = null);
		}
		for (; 0 < Mh.length && (n = Mh[0], n.blockedOn === null);) Lh(n), n.blockedOn === null && Mh.shift();
		if (n = (e.ownerDocument || e).$$reactFormReplay, n != null) for (r = 0; r < n.length; r += 3) {
			var i = n[r], a = n[r + 1], o = i[mt] || null;
			if (typeof a == "function") o || Uh(n);
			else if (o) {
				var s = null;
				if (a && a.hasAttribute("formAction")) {
					if (i = a, o = a[mt] || null) s = o.formAction;
					else if (wh(i) !== null) continue;
				} else s = o.action;
				typeof s == "function" ? n[r + 1] = s : (n.splice(r, 3), r -= 3), Uh(n);
			}
		}
	}
	function Gh() {
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
	function Kh(e) {
		this._internalRoot = e;
	}
	qh.prototype.render = Kh.prototype.render = function(e) {
		var t = this._internalRoot;
		if (t === null) throw Error(i(409));
		var n = t.current;
		ph(n, Ad(), e, t, null, null);
	}, qh.prototype.unmount = Kh.prototype.unmount = function() {
		var e = this._internalRoot;
		if (e !== null) {
			this._internalRoot = null;
			var t = e.containerInfo;
			ph(e.current, 2, null, e, null, null), Rd(), t[ht] = null;
		}
	};
	function qh(e) {
		this._internalRoot = e;
	}
	qh.prototype.unstable_scheduleHydration = function(e) {
		if (e) {
			var t = ut();
			e = {
				blockedOn: null,
				target: e,
				priority: t
			};
			for (var n = 0; n < Mh.length && t !== 0 && t < Mh[n].priority; n++);
			Mh.splice(n, 0, e), n === 0 && Lh(e);
		}
	};
	var Jh = n.version;
	if (Jh !== "19.3.1") throw Error(i(527, Jh, "19.3.1"));
	H.findDOMNode = function(e) {
		var t = e._reactInternals;
		if (t === void 0) throw typeof e.render == "function" ? Error(i(188)) : (e = Object.keys(e).join(","), Error(i(268, e)));
		return e = d(t), e = e === null ? null : p(e), e = e === null ? null : e.stateNode, e;
	};
	var Yh = {
		bundleType: 0,
		version: "19.3.1",
		rendererPackageName: "react-dom",
		currentDispatcherRef: V,
		reconcilerVersion: "19.3.1"
	};
	if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
		var Xh = __REACT_DEVTOOLS_GLOBAL_HOOK__;
		if (!Xh.isDisabled && Xh.supportsFiber) try {
			Be = Xh.inject(Yh), Ve = Xh;
		} catch {}
	}
	e.createRoot = function(e, t) {
		if (!a(e)) throw Error(i(299));
		var n = !1, r = "", o = _c, s = vc, c = yc;
		return t != null && (!0 === t.unstable_strictMode && (n = !0), t.identifierPrefix !== void 0 && (r = t.identifierPrefix), t.onUncaughtError !== void 0 && (o = t.onUncaughtError), t.onCaughtError !== void 0 && (s = t.onCaughtError), t.onRecoverableError !== void 0 && (c = t.onRecoverableError)), t = dh(e, 1, !1, null, null, n, r, null, o, s, c, Gh), e[ht] = t.current, Gf(e), new Kh(t);
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
}, I = /* @__NO_SIDE_EFFECTS__ */ (e) => e * 1e3, L = /* @__NO_SIDE_EFFECTS__ */ (e) => e / 1e3, ee = /* @__NO_SIDE_EFFECTS__ */ (e, t) => t ? 1e3 / t * e : 0, R = (e, t, n) => e * (3 * (1 - e) * ((1 - e) * t + e * n) + e * e);
/*#__NO_SIDE_EFFECTS__*/
function te(e, t, n, r) {
	return e === t && n === r ? M : (i) => {
		let a = 0, o = 1, s = i;
		for (let t = 0;; t++) {
			s >= a && s <= o || (s = (a + o) / 2);
			let r = R(s, e, n) - i;
			if (r * r < 1e-28 || t === 40) break;
			r > 0 ? o = s : a = s, s -= r * 1e-7 / (R(s + 1e-7, e, n) - i - r);
		}
		return R(s, t, r);
	};
}
// node_modules/motion-utils/dist/es/easing/modifiers/mirror.mjs
var ne = /* @__NO_SIDE_EFFECTS__ */ (e) => (t) => t <= .5 ? e(2 * t) / 2 : (2 - e(2 * (1 - t))) / 2, re = /* @__NO_SIDE_EFFECTS__ */ (e) => (t) => 1 - e(1 - t), ie = /*@__PURE__*/ te(.33, 1.53, .69, .99), ae = /*@__PURE__*/ re(ie), oe = /*@__PURE__*/ ne(ae), se = (e) => e >= 1 ? 1 : (e *= 2) < 1 ? .5 * ae(e) : .5 * (2 - 2 ** (-10 * (e - 1))), z = (e) => 1 - Math.sin(Math.acos(e)), ce = /* @__PURE__ */ re(z), le = /* @__PURE__ */ ne(z), B = /*@__PURE__*/ te(.42, 0, 1, 1), V = /*@__PURE__*/ te(0, 0, .58, 1), H = /*@__PURE__*/ te(.42, 0, .58, 1), ue = /* @__NO_SIDE_EFFECTS__ */ (e) => Array.isArray(e) && typeof e[0] != "number", de = /* @__NO_SIDE_EFFECTS__ */ (e) => Array.isArray(e) && typeof e[0] == "number", fe = {
	linear: M,
	easeIn: B,
	easeInOut: H,
	easeOut: V,
	circIn: z,
	circInOut: le,
	circOut: ce,
	backIn: ae,
	backInOut: oe,
	backOut: ie,
	anticipate: se
}, pe = (e) => typeof e == "string", me = (e) => {
	if (/* @__PURE__ */ de(e)) {
		e.length;
		let [t, n, r, i] = e;
		return /* @__PURE__ */ te(t, n, r, i);
	}
	return pe(e) ? (fe[e], `${e}`, fe[e]) : e;
}, U = {
	delta: 0,
	timestamp: 0,
	isProcessing: !1
}, he;
function W() {
	he = void 0;
}
var G = {
	now: () => (he === void 0 && G.set(U.isProcessing || D.useManualTiming ? U.timestamp : performance.now()), he),
	set: (e) => {
		he = e, queueMicrotask(W);
	}
}, K = (e) => Math.round(e * 1e5) / 1e5, ge = (e) => (t) => typeof t == "string" && t.startsWith(e), _e = /*@__PURE__*/ ge("--"), ve = /*@__PURE__*/ ge("var(--"), ye = (e) => ve(e) ? be.test(e.split("/*")[0].trim()) : !1, be = /var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu;
function xe(e) {
	return typeof e == "string" && e.split("/*")[0].includes("var(--");
}
// node_modules/motion-dom/dist/es/value/types/numbers/index.mjs
var Se = {
	test: (e) => typeof e == "number",
	parse: parseFloat,
	transform: (e) => e
}, Ce = {
	...Se,
	transform: (e) => E(0, 1, e)
}, we = {
	...Se,
	default: 1
}, Te = /-?(?:\d+(?:\.\d+)?|\.\d+)/gu;
// node_modules/motion-dom/dist/es/value/types/utils/is-nullish.mjs
function Ee(e) {
	return e == null;
}
// node_modules/motion-dom/dist/es/value/types/utils/single-color-regex.mjs
var De = /^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu, Oe = (e, t) => (n) => !!(typeof n == "string" && De.test(n) && n.startsWith(e) || t && !Ee(n) && Object.prototype.hasOwnProperty.call(n, t)), ke = (e, t, n) => (r) => {
	if (typeof r != "string") return r;
	let [i, a, o, s] = r.match(Te);
	return {
		[e]: parseFloat(i),
		[t]: parseFloat(a),
		[n]: parseFloat(o),
		alpha: s === void 0 ? 1 : parseFloat(s)
	};
}, Ae = (e) => E(0, 255, e), je = {
	...Se,
	transform: (e) => Math.round(Ae(e))
}, Me = {
	test: /*@__PURE__*/ Oe("rgb", "red"),
	parse: /*@__PURE__*/ ke("red", "green", "blue"),
	transform: ({ red: e, green: t, blue: n, alpha: r = 1 }) => "rgba(" + je.transform(e) + ", " + je.transform(t) + ", " + je.transform(n) + ", " + K(Ce.transform(r)) + ")"
};
// node_modules/motion-dom/dist/es/value/types/color/hex.mjs
function Ne(e) {
	let t = "", n = "", r = "", i = "";
	return e.length > 5 ? (t = e.substring(1, 3), n = e.substring(3, 5), r = e.substring(5, 7), i = e.substring(7, 9)) : (t = e.substring(1, 2), n = e.substring(2, 3), r = e.substring(3, 4), i = e.substring(4, 5), t += t, n += n, r += r, i += i), {
		red: parseInt(t, 16),
		green: parseInt(n, 16),
		blue: parseInt(r, 16),
		alpha: i ? parseInt(i, 16) / 255 : 1
	};
}
var Pe = {
	test: /*@__PURE__*/ Oe("#"),
	parse: Ne,
	transform: Me.transform
}, Fe = /* @__NO_SIDE_EFFECTS__ */ (e) => ({
	test: (t) => typeof t == "string" && t.endsWith(e) && t.split(" ").length === 1,
	parse: parseFloat,
	transform: (t) => `${t}${e}`
}), Ie = /*@__PURE__*/ Fe("deg"), Le = /*@__PURE__*/ Fe("%"), q = /*@__PURE__*/ Fe("px"), Re = /*@__PURE__*/ Fe("vh"), ze = /*@__PURE__*/ Fe("vw"), Be = {
	...Le,
	parse: (e) => Le.parse(e) / 100,
	transform: (e) => Le.transform(e * 100)
}, Ve = {
	test: /*@__PURE__*/ Oe("hsl", "hue"),
	parse: /*@__PURE__*/ ke("hue", "saturation", "lightness"),
	transform: ({ hue: e, saturation: t, lightness: n, alpha: r = 1 }) => "hsla(" + Math.round(e) + ", " + Le.transform(K(t)) + ", " + Le.transform(K(n)) + ", " + K(Ce.transform(r)) + ")"
}, He = {
	test: (e) => Me.test(e) || Pe.test(e) || Ve.test(e),
	parse: (e) => Me.test(e) ? Me.parse(e) : Ve.test(e) ? Ve.parse(e) : Pe.parse(e),
	transform: (e) => typeof e == "string" ? e : e.hasOwnProperty("red") ? Me.transform(e) : Ve.transform(e),
	getAnimatableNone: (e) => {
		let t = He.parse(e);
		return t.alpha = 0, He.transform(t);
	}
}, Ue = /(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu, We = /*@__PURE__*/ new RegExp(Te.source), Ge = /*@__PURE__*/ new RegExp(Ue.source, "i");
function Ke(e) {
	return isNaN(e) && typeof e == "string" && (We.test(e) || Ge.test(e));
}
var qe = "number", Je = "color", Ye = "var", Xe = "var(", Ze = "${}", Qe = /var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)(?![a-z]*\()/giu;
function $e(e) {
	let t = e.toString();
	return We.test(t) || Ge.test(t);
}
function et(e) {
	let t = e.toString(), n = [], r = {
		color: [],
		number: [],
		var: []
	}, i = [], a = 0;
	return {
		values: n,
		split: t.replace(Qe, (e) => (He.test(e) ? (r.color.push(a), i.push(Je), n.push(He.parse(e))) : e.startsWith(Xe) ? (r.var.push(a), i.push(Ye), n.push(e)) : (r.number.push(a), i.push(qe), n.push(parseFloat(e))), ++a, Ze)).split(Ze),
		indexes: r,
		types: i
	};
}
function tt(e) {
	return et(e).values;
}
function nt({ split: e, types: t }) {
	let n = e.length;
	return (r) => {
		let i = "";
		for (let a = 0; a < n; a++) if (i += e[a], r[a] !== void 0) {
			let e = t[a];
			i += e === qe ? K(r[a]) : e === Je ? He.transform(r[a]) : r[a];
		}
		return i;
	};
}
function rt(e) {
	return nt(et(e));
}
var it = (e) => typeof e == "number" ? 0 : He.test(e) ? He.getAnimatableNone(e) : e, at = (e, t) => typeof e == "number" ? t?.trim().endsWith("/") ? e : 0 : it(e);
function ot(e) {
	let t = et(e);
	return nt(t)(t.values.map((e, n) => at(e, t.split[n])));
}
var st = {
	test: Ke,
	parse: tt,
	createTransformer: rt,
	getAnimatableNone: ot
};
// node_modules/motion-dom/dist/es/value/types/color/hsla-to-rgba.mjs
function ct(e, t, n) {
	return n < 0 && (n += 1), n > 1 && --n, n < 1 / 6 ? e + (t - e) * 6 * n : n < 1 / 2 ? t : n < 2 / 3 ? e + (t - e) * (2 / 3 - n) * 6 : e;
}
function lt({ hue: e, saturation: t, lightness: n, alpha: r }) {
	e /= 360, t /= 100, n /= 100;
	let i = 0, a = 0, o = 0;
	if (!t) i = a = o = n;
	else {
		let r = n < .5 ? n * (1 + t) : n + t - n * t, s = 2 * n - r;
		i = ct(s, r, e + 1 / 3), a = ct(s, r, e), o = ct(s, r, e - 1 / 3);
	}
	return {
		red: Math.round(i * 255),
		green: Math.round(a * 255),
		blue: Math.round(o * 255),
		alpha: r
	};
}
// node_modules/motion-dom/dist/es/utils/mix/immediate.mjs
function ut(e, t) {
	return (n) => n > 0 ? t : e;
}
// node_modules/motion-dom/dist/es/utils/mix/number.mjs
var dt = (e, t, n) => e + (t - e) * n, ft = (e, t, n) => {
	let r = e * e, i = n * (t * t - r) + r;
	return i < 0 ? 0 : Math.sqrt(i);
}, pt = [
	Pe,
	Me,
	Ve
], mt = (e) => pt.find((t) => t.test(e));
function ht(e) {
	let t = mt(e);
	if (!t) return `${e}`, !1;
	let n = t.parse(e);
	return t === Ve && (n = lt(n)), n;
}
var gt = (e, t) => {
	let n = ht(e), r = ht(t);
	if (!n || !r) return ut(e, t);
	let i = { ...n };
	return (e) => (i.red = ft(n.red, r.red, e), i.green = ft(n.green, r.green, e), i.blue = ft(n.blue, r.blue, e), i.alpha = dt(n.alpha, r.alpha, e), Me.transform(i));
}, _t = /* @__PURE__ */ new Set(["none", "hidden"]);
function vt(e, t) {
	return _t.has(e) ? (n) => n <= 0 ? e : t : (n) => n >= 1 ? t : e;
}
// node_modules/motion-dom/dist/es/utils/mix/complex.mjs
function yt(e, t) {
	return (n) => dt(e, t, n);
}
function bt(e) {
	return typeof e == "number" ? yt : typeof e == "string" ? ye(e) ? ut : He.test(e) ? gt : wt : Array.isArray(e) ? xt : typeof e == "object" ? He.test(e) ? gt : St : ut;
}
function xt(e, t) {
	let n = [...e], r = n.length, i = e.map((e, n) => bt(e)(e, t[n]));
	return (e) => {
		for (let t = 0; t < r; t++) n[t] = i[t](e);
		return n;
	};
}
function St(e, t) {
	let n = {
		...e,
		...t
	}, r = {};
	for (let i in n) e[i] !== void 0 && t[i] !== void 0 && (r[i] = bt(e[i])(e[i], t[i]));
	return (e) => {
		for (let t in r) n[t] = r[t](e);
		return n;
	};
}
function Ct(e, t) {
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
var wt = (e, t) => {
	let n = st.createTransformer(t), r = et(e), i = et(t);
	return r.indexes.var.length === i.indexes.var.length && r.indexes.color.length === i.indexes.color.length && r.indexes.number.length >= i.indexes.number.length ? _t.has(e) && !i.values.length || _t.has(t) && !r.values.length ? vt(e, t) : N(xt(Ct(r, i), i.values), n) : (`${e}${t}`, ut(e, t));
}, Tt = /^(-?(?:\d+(?:\.\d*)?|\.\d+))([a-z%]*)$/iu;
function Et(e, t) {
	let n = Tt.exec(e);
	if (!n) return;
	let r = Tt.exec(t);
	if (!r || n[2] !== r[2]) return;
	let i = n[2], a = parseFloat(n[1]), o = parseFloat(r[1]);
	return (e) => K(dt(a, o, e)) + i;
}
function Dt(e, t, n) {
	if (typeof e == "number" && typeof t == "number" && typeof n == "number") return dt(e, t, n);
	if (typeof e == "string" && typeof t == "string") {
		let n = Et(e, t);
		if (n) return n;
	}
	return bt(e)(e, t);
}
// node_modules/motion-dom/dist/es/frameloop/order.mjs
var Ot = [
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
function kt(e) {
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
var At = 40;
function jt(e, t, n = {
	delta: 0,
	timestamp: 0,
	isProcessing: !1
}) {
	let r = !1, i = !0, a = () => r = !0, o = Ot.reduce((e, t) => (e[t] = kt(a), e), {}), { setup: s, read: c, resolveKeyframes: l, preUpdate: u, update: d, preRender: f, render: p, postRender: m } = o, h = () => {
		let a = D.useManualTiming, o = a ? n.timestamp : performance.now();
		r = !1, a || (n.delta = i ? 1e3 / 60 : Math.max(Math.min(o - n.timestamp, At), 1)), n.timestamp = o, n.isProcessing = !0, s.process(n), c.process(n), l.process(n), u.process(n), d.process(n), f.process(n), p.process(n), m.process(n), n.isProcessing = !1, r && t && (i = !1, e(h));
	}, g = () => {
		r = !0, i = !0, n.isProcessing || e(h);
	};
	return {
		schedule: Ot.reduce((e, t) => {
			let n = o[t];
			return e[t] = (e, t = !1, i = !1) => (r || g(), n.schedule(e, t, i)), e;
		}, {}),
		cancel: (e) => {
			for (let t = 0; t < Ot.length; t++) o[Ot[t]].cancel(e);
		},
		state: n,
		steps: o
	};
}
// node_modules/motion-dom/dist/es/frameloop/frame.mjs
var { schedule: Mt, cancel: Nt, steps: Pt } = /* @__PURE__ */ jt(typeof requestAnimationFrame < "u" ? requestAnimationFrame : M, !0, U), Ft = (e) => {
	let t = ({ timestamp: t }) => e(t);
	return {
		start: (e = !0) => Mt.update(t, e),
		stop: () => Nt(t),
		now: () => U.isProcessing ? U.timestamp : G.now()
	};
}, It = (e, t, n = 10) => {
	let r = "", i = Math.max(Math.round(t / n), 2);
	for (let t = 0; t < i; t++) r += Math.round(e(t / (i - 1)) * 1e4) / 1e4 + ", ";
	return `linear(${r.substring(0, r.length - 2)})`;
}, Lt = 2e4;
function Rt(e, t = 50, n = Lt, r) {
	let i = 0, a = e.next(i);
	for (r?.push(a.value); !a.done && i < n;) i += t, a = e.next(i), r?.push(a.value);
	return i >= n ? Infinity : i;
}
// node_modules/motion-dom/dist/es/animation/generators/utils/create-generator-easing.mjs
function zt(e, t = 100, n) {
	let { keyframes: r, velocity: i } = e, a = r && r[r.length - 1] - r[0], o = n({
		...e,
		velocity: i && a ? i * t / a : i,
		keyframes: [0, t]
	}), s = Math.min(Rt(o), Lt);
	return {
		type: "keyframes",
		ease: (e) => o.next(s * e).value / t,
		duration: /* @__PURE__ */ L(s)
	};
}
// node_modules/motion-dom/dist/es/animation/generators/spring.mjs
var Bt = {
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
}, Vt = (e) => e < 0 ? 1 / Math.max(1 + e, Bt.minDamping) : Math.max(1 - e, Bt.minDamping);
function Ht(e, t) {
	if (!(e > 1)) return 1;
	let n = Math.sqrt(e * e - 1), r = e - n, i = e + n, a = 2 * n * Math.exp(-t) * (1 + t);
	return Gt((e) => i * Math.exp(-r * e) - r * Math.exp(-i * e) - a, (e) => Math.exp(-i * e) - Math.exp(-r * e), t) / t;
}
function Ut(e, t) {
	return e * Math.sqrt(1 - t * t);
}
var Wt = 12;
function Gt(e, t, n) {
	let r = n;
	for (let n = 1; n < Wt; n++) r -= e(r) / t(r);
	return r;
}
var Kt = .001;
function qt({ duration: e = Bt.duration, bounce: t = Bt.bounce }) {
	let n, r;
	Bt.maxDuration;
	let i = Vt(t);
	e = E(Bt.minDuration, Bt.maxDuration, /* @__PURE__ */ L(e)), i < 1 ? (n = (t) => {
		let n = t * i, r = n * e, a = Ut(t, i), o = Math.exp(-r);
		return Kt - n / a * o;
	}, r = (t) => {
		let r = t * i * e, a = i * i * t * t * e, o = Math.exp(-r), s = Ut(t * t, i);
		return (-n(t) + Kt > 0 ? -1 : 1) * -a * o / s;
	}) : (n = (t) => -.001 + Math.exp(-t * e) * (t * e + 1), r = (t) => Math.exp(-t * e) * (-t * (e * e)));
	let a = 5 / e, o = Gt(n, r, a), s = o * Ht(i, o * e), c = s * s;
	return {
		stiffness: c,
		damping: i * 2 * Math.sqrt(c),
		duration: /* @__PURE__ */ I(e)
	};
}
var Jt = (e, t) => (t ? e >= 0 : e > 0) && e < Infinity;
function Yt(e, t) {
	if (Jt(e, t)) return e;
}
function Xt(e) {
	let t = Yt(e.stiffness), n = Yt(e.damping, !0), r = Yt(e.mass), i = {
		...e,
		stiffness: t ?? Bt.stiffness,
		damping: n ?? Bt.damping,
		mass: r ?? Bt.mass,
		isResolvedFromDuration: !1,
		isTimeDefined: (t ?? n ?? r) === void 0 && (e.duration !== void 0 || e.bounce !== void 0)
	};
	if (i.isTimeDefined) {
		if (e.visualDuration) {
			let t = Vt(e.bounce || 0), n = 2 * Math.PI / (e.visualDuration * 1.2) * Ht(t, 2 * Math.PI / 1.2);
			i.stiffness = n * n, i.damping = 2 * t * Math.sqrt(i.stiffness);
		} else Object.assign(i, qt(i)), i.isResolvedFromDuration = !0;
		Jt(i.stiffness) && Jt(i.damping, !0) || (i.stiffness = Bt.stiffness, i.damping = Bt.damping);
	}
	return i;
}
function Zt(e = Bt.visualDuration, t = Bt.bounce) {
	let n = typeof e == "object" ? e : {
		visualDuration: e,
		keyframes: [0, 1],
		bounce: t
	}, r = n.keyframes[0], i = n.keyframes[n.keyframes.length - 1], a = {
		done: !1,
		value: r
	}, { stiffness: o, damping: s, mass: c, duration: l, isResolvedFromDuration: u, isTimeDefined: d } = Xt({ ...n }), f = (e) => d ? 0 : -/* @__PURE__ */ L(e), p = s / (2 * Math.sqrt(o * c)), m = /* @__PURE__ */ L(Math.sqrt(o / c)), h = p * m, g = {
		target: i,
		delta: i - r,
		velocity: f(n.velocity || 0) || 0,
		restSpeed: 0,
		restDelta: 0
	}, _ = () => {
		let e = Math.abs(g.delta) < 5;
		g.restSpeed = n.restSpeed || (e ? Bt.restSpeed.granular : Bt.restSpeed.default), g.restDelta = n.restDelta || (e ? Bt.restDelta.granular : Bt.restDelta.default);
	};
	_();
	let v, y, b;
	if (p < 1) {
		let e = Ut(m, p), t = {
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
			let e = Math.min(Rt(S), Lt), t = It((t) => S.next(e * t).value, e, 30);
			return e + "ms " + t;
		},
		toTransition: () => {}
	};
	return S;
}
var Qt = /* @__PURE__ */ Object.assign(Zt, { applyToOptions: (e) => {
	let t = zt(e, 100, Zt);
	return e.ease = t.ease, e.duration = /* @__PURE__ */ I(t.duration), e.type = "keyframes", e;
} });
// node_modules/motion-dom/dist/es/animation/generators/inertia.mjs
function $t({ keyframes: e, velocity: t = 0, power: n = .8, timeConstant: r = 325, bounceDamping: i = 10, bounceStiffness: a = 500, modifyTarget: o, min: s, max: c, restDelta: l = .5, restSpeed: u }) {
	let d = e[0], f = {
		done: !1,
		value: d
	}, p = (e) => e < s || e > c, m = (e) => s === void 0 ? c : c === void 0 || Math.abs(s - e) < Math.abs(c - e) ? s : c, h = n * t, g = d + h, _ = o === void 0 ? g : o(g);
	_ !== g && (h = _ - d);
	let v = (e) => -h * Math.exp(-e / r), y = (e) => {
		let t = v(e);
		f.done = Math.abs(t) <= l, f.value = f.done ? _ : _ + t;
	}, b, x, S = (e) => {
		p(f.value) && (b = e, x = Qt({
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
function en(e, t, n) {
	let r = [], i = n || D.mix || Dt, a = e.length - 1;
	for (let n = 0; n < a; n++) {
		let a = i(e[n], e[n + 1]);
		t && (a = N(Array.isArray(t) ? t[n] || M : t, a)), r.push(a);
	}
	return r;
}
function tn(e, t, { clamp: n = !0, ease: r, mixer: i } = {}) {
	let a = e.length;
	if (t.length, a === 1) return () => t[0];
	if (a === 2 && t[0] === t[1]) return () => t[1];
	let o = e[0] === e[1];
	e[0] > e[a - 1] && (e = [...e].reverse(), t = [...t].reverse());
	let s = en(t, r, i), c = s.length, l = (n) => {
		if (o && n < e[0]) return t[0];
		let r = 0;
		if (c > 1) for (; r < e.length - 2 && !(n < e[r + 1]); r++);
		let i = /* @__PURE__ */ P(e[r], e[r + 1], n);
		return s[r](i);
	};
	return n ? (t) => l(E(e[0], e[a - 1], t)) : l;
}
// node_modules/motion-dom/dist/es/animation/keyframes/offsets/fill.mjs
function nn(e, t) {
	let n = e[e.length - 1];
	for (let r = 1; r <= t; r++) {
		let i = /* @__PURE__ */ P(0, t, r);
		e.push(dt(n, 1, i));
	}
}
// node_modules/motion-dom/dist/es/animation/keyframes/offsets/default.mjs
function rn(e) {
	let t = [0];
	return nn(t, e.length - 1), t;
}
// node_modules/motion-dom/dist/es/animation/keyframes/offsets/time.mjs
function an(e, t) {
	return e.map((e) => e * t);
}
// node_modules/motion-dom/dist/es/animation/generators/keyframes.mjs
function on(e, t) {
	return e.map(() => t || H).splice(0, e.length - 1);
}
function sn({ duration: e = 300, keyframes: t, times: n, ease: r = "easeInOut" }) {
	let i = /* @__PURE__ */ ue(r) ? r.map(me) : me(r) || H, a = {
		done: !1,
		value: t[0]
	};
	if (t.length === 2 && !Array.isArray(i) && (!n || n.length !== 2 || n[0] === 0 && n[1] === 1)) {
		let [n, r] = t, o = n === r ? void 0 : (D.mix || Dt)(n, r);
		return {
			calculatedDuration: e,
			next: (t) => (a.value = o ? o(i(e > 0 ? E(0, 1, t / e) : 1)) : r, a.done = t >= e, a)
		};
	}
	let o = tn(an(n && n.length === t.length ? n : rn(t), e), t, { ease: Array.isArray(i) ? i : on(t, i) });
	return {
		calculatedDuration: e,
		next: (t) => (a.value = o(t), a.done = t >= e, a)
	};
}
// node_modules/motion-dom/dist/es/animation/generators/utils/velocity.mjs
var cn = 5;
function ln(e, t, n) {
	let r = Math.max(t - cn, 0);
	return /* @__PURE__ */ ee(n - e(r), t - r);
}
function un(e, t, n = 0) {
	return t <= 0 ? n : e.velocity ? e.velocity(t) : ln((t) => e.next(t).value, t, e.next(t).value);
}
// node_modules/motion-dom/dist/es/animation/keyframes/get-final.mjs
var dn = (e) => e !== null;
function fn(e, { repeat: t, repeatType: n = "loop" }, r, i = 1) {
	let a = e.filter(dn), o = i < 0 || t && n !== "loop" && t % 2 == 1 ? 0 : a.length - 1;
	return !o || r === void 0 ? a[o] : r;
}
// node_modules/motion-dom/dist/es/animation/utils/replace-transition-type.mjs
var pn = {
	decay: $t,
	inertia: $t,
	tween: sn,
	keyframes: sn,
	spring: Qt
};
function mn(e) {
	typeof e.type == "string" && (e.type = pn[e.type]);
}
// node_modules/motion-dom/dist/es/animation/utils/resolve-start-time.mjs
var hn = 40, gn = (e, t) => t - e > hn && !D.useManualTiming ? t : e;
// node_modules/motion-dom/dist/es/animation/utils/notify-inspector.mjs
function _n(e, t) {
	return {
		kind: e,
		animation: t,
		timestamp: G.now(),
		frameTimestamp: U.timestamp,
		frameIsProcessing: U.isProcessing
	};
}
function vn(e, t, n) {
	let r = globalThis.__MOTION_INSPECT__;
	if (r) try {
		r({
			..._n("animation-start", e),
			options: n ? {
				...t,
				...n
			} : t
		});
	} catch {}
}
function yn(e, t) {
	let n = globalThis.__MOTION_INSPECT__;
	if (n) try {
		n({
			..._n("layout-animation-start", e),
			node: t
		});
	} catch {}
}
// node_modules/motion-dom/dist/es/animation/utils/WithPromise.mjs
var bn = class {
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
}, xn = (e) => e / 100, Sn = (e) => Math.round(e * 1e4) / 1e4, Cn = class extends bn {
	constructor(e) {
		super(), this.state = "idle", this.startTime = null, this.isStopped = !1, this.currentTime = 0, this.holdTime = null, this.playbackSpeed = 1, this.delayState = {
			done: !1,
			value: void 0
		}, this.stop = () => {
			let { motionValue: e } = this.options;
			e && e.updatedAt !== G.now() && this.tick(G.now()), this.isStopped = !0, this.state !== "idle" && (this.teardown(), this.options.onStop?.());
		}, this.options = e, this.initAnimation(), this.play(), e.autoplay === !1 && this.pause(), vn(this, this.options);
	}
	initAnimation() {
		let { options: e } = this;
		mn(e);
		let { type: t = sn, repeat: n = 0, repeatDelay: r = 0, repeatType: i, velocity: a = 0 } = e, { keyframes: o } = e, s = t || sn;
		s !== sn && typeof o[0] != "number" && (this.mixKeyframes = N(xn, Dt(o[0], o[1])), o = [0, 100]);
		let c = s(o === e.keyframes ? e : {
			...e,
			keyframes: o
		});
		i === "mirror" && (this.mirroredGenerator = s({
			...e,
			keyframes: [...o].reverse(),
			velocity: -a
		})), c.calculatedDuration === null && (c.calculatedDuration = Rt(c));
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
		this.startTime === this.pendingStartTime && (this.startTime = gn(this.startTime, e)), this.pendingStartTime = void 0, this.speed > 0 ? this.startTime = Math.min(this.startTime, e) : this.speed < 0 && (this.startTime = Math.min(e - r / this.speed, this.startTime)), t ? this.currentTime = e : this.updateTime(e);
		let u = this.currentTime - a * (this.playbackSpeed >= 0 ? 1 : -1), d = this.playbackSpeed >= 0 ? u < 0 : u > r;
		this.currentTime = Math.max(u, 0), this.state === "finished" && this.holdTime === null && (this.currentTime = r);
		let f = this.generate(this.currentTime, d), { done: p } = f;
		!d && i !== null && (p = this.playbackSpeed >= 0 ? this.currentTime >= r : this.currentTime <= 0);
		let m = this.holdTime === null && (this.state === "finished" || this.state === "running" && p);
		return m && s !== $t && (f.value = fn(o, this.options, l, this.speed)), c && c(f.value), m && this.finish(), f;
	}
	at(e) {
		return this.holdTime ?? Sn((e - this.startTime) * this.playbackSpeed);
	}
	sampleAt(e, t) {
		let { options: n, totalDuration: r } = this, i = this.at(e) - (n.delay || 0);
		return i >= r && n.type !== $t ? fn(n.keyframes, n, t ? void 0 : n.finalKeyframe) : this.generate(Math.max(i, 0), i < 0).value;
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
		return un(this.generator, this.currentTime, this.options.velocity);
	}
	get speed() {
		return this.playbackSpeed;
	}
	set speed(e) {
		let t = this.playbackSpeed !== e;
		t && this.driver && this.updateTime(G.now()), this.playbackSpeed = e, t && this.driver && (this.time = /* @__PURE__ */ L(this.currentTime));
	}
	play() {
		if (this.isStopped) return;
		let { driver: e = Ft, startTime: t } = this.options;
		this.driver ||= e((e) => this.tick(e)), this.options.onPlay?.();
		let n = this.driver.now();
		this.state === "finished" ? (this.updateFinished(), this.startTime = n) : this.holdTime === null ? this.startTime ||= t ?? (this.pendingStartTime = n) : this.startTime = n - this.holdTime / (this.playbackSpeed || 1), this.state === "finished" && this.speed < 0 && (this.startTime += this.calculatedDuration), this.holdTime = null, this.state = "running", this.driver.start();
	}
	pause() {
		this.state = "paused", this.updateTime(G.now()), this.holdTime = this.currentTime;
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
}, wn = /* @__PURE__ */ new Set([
	"brightness",
	"contrast",
	"saturate",
	"opacity"
]);
function Tn(e) {
	let [t, n] = e.slice(0, -1).split("(");
	if (t === "drop-shadow") return e;
	let [r] = n.match(Te) || [];
	if (!r) return e;
	let i = n.replace(r, ""), a = +!!wn.has(t);
	return r !== n && (a *= 100), t + "(" + a + i + ")";
}
var En = /\b([a-z-]*)\(.*?\)/gu, Dn = {
	...st,
	getAnimatableNone: (e) => {
		let t = e.match(En);
		return t ? t.map(Tn).join(" ") : e;
	}
}, On = {
	...st,
	getAnimatableNone: (e) => {
		let t = st.parse(e);
		return st.createTransformer(e)(t.map((e) => typeof e == "number" ? 0 : typeof e == "object" ? {
			...e,
			alpha: 1
		} : e));
	}
}, kn = {
	...Se,
	transform: Math.round
}, An = {
	borderWidth: q,
	borderTopWidth: q,
	borderRightWidth: q,
	borderBottomWidth: q,
	borderLeftWidth: q,
	borderRadius: q,
	borderTopLeftRadius: q,
	borderTopRightRadius: q,
	borderBottomRightRadius: q,
	borderBottomLeftRadius: q,
	width: q,
	maxWidth: q,
	height: q,
	maxHeight: q,
	top: q,
	right: q,
	bottom: q,
	left: q,
	inset: q,
	insetBlock: q,
	insetBlockStart: q,
	insetBlockEnd: q,
	insetInline: q,
	insetInlineStart: q,
	insetInlineEnd: q,
	padding: q,
	paddingTop: q,
	paddingRight: q,
	paddingBottom: q,
	paddingLeft: q,
	paddingBlock: q,
	paddingBlockStart: q,
	paddingBlockEnd: q,
	paddingInline: q,
	paddingInlineStart: q,
	paddingInlineEnd: q,
	margin: q,
	marginTop: q,
	marginRight: q,
	marginBottom: q,
	marginLeft: q,
	marginBlock: q,
	marginBlockStart: q,
	marginBlockEnd: q,
	marginInline: q,
	marginInlineStart: q,
	marginInlineEnd: q,
	fontSize: q,
	backgroundPositionX: q,
	backgroundPositionY: q,
	rotate: Ie,
	pathRotation: Ie,
	rotateX: Ie,
	rotateY: Ie,
	rotateZ: Ie,
	scale: we,
	scaleX: we,
	scaleY: we,
	scaleZ: we,
	skew: Ie,
	skewX: Ie,
	skewY: Ie,
	distance: q,
	translateX: q,
	translateY: q,
	translateZ: q,
	x: q,
	y: q,
	z: q,
	perspective: q,
	transformPerspective: q,
	opacity: Ce,
	originX: Be,
	originY: Be,
	originZ: q,
	zIndex: kn,
	fillOpacity: Ce,
	strokeOpacity: Ce,
	numOctaves: kn
}, jn = {
	...An,
	color: He,
	backgroundColor: He,
	outlineColor: He,
	fill: He,
	stroke: He,
	borderColor: He,
	borderTopColor: He,
	borderRightColor: He,
	borderBottomColor: He,
	borderLeftColor: He,
	filter: Dn,
	WebkitFilter: Dn,
	mask: On,
	WebkitMask: On
}, Mn = (e) => jn[e], Nn = /*@__PURE__*/ new Set([Dn, On]);
function Pn(e, t) {
	let n = Mn(e);
	return Nn.has(n) || (n = st), n.getAnimatableNone ? n.getAnimatableNone(t) : void 0;
}
// node_modules/motion-dom/dist/es/animation/keyframes/utils/fill-wildcards.mjs
function Fn(e) {
	for (let t = 1; t < e.length; t++) e[t] ?? (e[t] = e[t - 1]);
}
// node_modules/motion-dom/dist/es/render/dom/parse-transform.mjs
var In = (e) => e * 180 / Math.PI, Ln = (e) => zn(In(Math.atan2(e[1], e[0]))), Rn = {
	x: 4,
	y: 5,
	translateX: 4,
	translateY: 5,
	scaleX: 0,
	scaleY: 3,
	scaleZ: () => 1,
	scale: (e) => (Math.abs(e[0]) + Math.abs(e[3])) / 2,
	rotate: Ln,
	rotateZ: Ln,
	skewX: (e) => In(Math.atan(e[1])),
	skewY: (e) => In(Math.atan(e[2])),
	skew: (e) => (Math.abs(e[1]) + Math.abs(e[2])) / 2
}, zn = (e) => (e %= 360, e < 0 && (e += 360), e), Bn = Ln, Vn = (e) => Math.hypot(e[0], e[1]), Hn = (e) => Math.hypot(e[4], e[5]), Un = {
	x: 12,
	y: 13,
	z: 14,
	translateX: 12,
	translateY: 13,
	translateZ: 14,
	scaleX: Vn,
	scaleY: Hn,
	scaleZ: (e) => Math.hypot(e[8], e[9], e[10]),
	scale: (e) => (Vn(e) + Hn(e)) / 2,
	rotateX: (e) => zn(In(Math.atan2(e[6], e[5]))),
	rotateY: (e) => zn(In(Math.atan2(-e[2], e[0]))),
	rotateZ: Bn,
	rotate: Bn,
	skewX: (e) => In(Math.atan(e[4])),
	skewY: (e) => In(Math.atan(e[1])),
	skew: (e) => (Math.abs(e[1]) + Math.abs(e[4])) / 2
};
function Wn(e) {
	return +!!e.includes("scale");
}
function Gn(e, t) {
	if (!e || e === "none") return Wn(t);
	let n = e.match(/^matrix3d\(([-\d.e\s,]+)\)$/u), r, i;
	if (n) r = Un, i = n;
	else {
		let t = e.match(/^matrix\(([-\d.e\s,]+)\)$/u);
		r = Rn, i = t;
	}
	if (!i) return Wn(t);
	let a = r[t], o = i[1].split(",").map(qn);
	return typeof a == "function" ? a(o) : o[a];
}
var Kn = (e, t) => {
	let { transform: n = "none" } = getComputedStyle(e);
	return Gn(n, t);
};
function qn(e) {
	return parseFloat(e.trim());
}
// node_modules/motion-dom/dist/es/render/utils/keys-transform.mjs
var Jn = [
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
], Yn = /* @__PURE__ */ new Set([...Jn, "pathRotation"]), Xn = (e) => e === Se || e === q, Zn = /* @__PURE__ */ new Set([
	"x",
	"y",
	"z"
]), Qn = /* @__PURE__ */ Jn.filter((e) => !Zn.has(e));
function $n(e) {
	let t = [];
	return Qn.forEach((n) => {
		let r = e.getValue(n);
		if (r !== void 0) {
			let e = r.get(), i = +!!n.startsWith("scale");
			if (e === i) return;
			t.push([n, e]), r.set(i);
		}
	}), t;
}
var er = /* @__PURE__ */ new Set(["bottom", "right"]);
function tr(e, t, n, r, i, a) {
	let o = parseFloat(e);
	if (!isNaN(o)) return o;
	let { min: s, max: c } = t()[n], l = c - s;
	return a === "border-box" ? l : l - parseFloat(r) - parseFloat(i);
}
var nr = ({ transform: e }) => Gn(e, "x"), rr = ({ transform: e }) => Gn(e, "y"), ir = {
	width: ({ width: e, paddingLeft: t = "0", paddingRight: n = "0", boxSizing: r }, i) => tr(e, i, "x", t, n, r),
	height: ({ height: e, paddingTop: t = "0", paddingBottom: n = "0", boxSizing: r }, i) => tr(e, i, "y", t, n, r),
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
	x: nr,
	y: rr,
	translateX: nr,
	translateY: rr
}, ar = /* @__PURE__ */ new Set(), or = !1, sr = !1, cr = !1;
function lr() {
	if (sr) {
		let e = [], t = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Set();
		ar.forEach((r) => {
			r.needsMeasurement && (e.push(r), t.add(r.element), er.has(r.name) && n.add(r.element));
		});
		let r = /* @__PURE__ */ new Map();
		n.forEach((e) => {
			let t = $n(e);
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
	sr = !1, or = !1, ar.forEach((e) => e.complete(cr)), ar.clear();
}
function ur() {
	ar.forEach((e) => {
		e.readKeyframes(), e.needsMeasurement && (sr = !0);
	});
}
function dr() {
	cr = !0, ur(), lr(), cr = !1;
}
function fr(e, t, n) {
	if (typeof e == "string") {
		if (O(e) || A(e)) return parseFloat(e);
		if (!st.test(e) && st.test(n)) return Pn(t, n);
	}
	return e ?? void 0;
}
var pr = class {
	constructor(e, t, n, r, i, a = !1) {
		this.state = "pending", this.isAsync = !1, this.needsMeasurement = !1, this.unresolvedKeyframes = [...e], this.onComplete = t, this.name = n, this.motionValue = r, this.element = i, this.isAsync = a;
	}
	scheduleResolve() {
		this.state = "scheduled", this.isAsync ? (ar.add(this), or || (or = !0, Mt.read(ur), Mt.resolveKeyframes(lr))) : (this.readKeyframes(), this.complete());
	}
	readKeyframes() {
		let { unresolvedKeyframes: e, name: t, element: n, motionValue: r } = this;
		if (e[0] === null) {
			let i = r?.get(), a = e[e.length - 1];
			if (i !== void 0) e[0] = i;
			else if (n && t) {
				let r = fr(n.readValue(t, a), t, a);
				r !== void 0 && (e[0] = r);
			}
			e[0] === void 0 && (e[0] = a), r && i === void 0 && r.set(e[0]);
		}
		Fn(e);
	}
	setFinalKeyframe() {}
	measureInitialState() {}
	renderEndStyles() {}
	measureEndState() {}
	complete(e = !1) {
		this.state = "complete", this.onComplete(this.unresolvedKeyframes, this.finalKeyframe, e), ar.delete(this);
	}
	cancel() {
		this.state === "scheduled" && (ar.delete(this), this.state = "pending");
	}
	resume() {
		this.state === "pending" && this.scheduleResolve();
	}
}, mr = (e) => e.startsWith("--");
// node_modules/motion-dom/dist/es/render/dom/style-set.mjs
function hr(e, t, n) {
	mr(t) ? e.style.setProperty(t, n) : e.style[t] = n;
}
// node_modules/motion-dom/dist/es/utils/supports/flags.mjs
var gr = {};
// node_modules/motion-dom/dist/es/utils/supports/memo.mjs
function _r(e, t) {
	let n = /* @__PURE__ */ j(e);
	return () => gr[t] ?? n();
}
// node_modules/motion-dom/dist/es/utils/supports/scroll-timeline.mjs
var vr = /* @__PURE__ */ _r(() => window.ScrollTimeline !== void 0, "scrollTimeline"), yr = /*@__PURE__*/ _r(() => {
	try {
		document.createElement("div").animate({ opacity: 0 }, { easing: "linear(0, 1)" });
	} catch {
		return !1;
	}
	return !0;
}, "linearEasing"), br = ([e, t, n, r]) => `cubic-bezier(${e}, ${t}, ${n}, ${r})`, xr = {
	linear: "linear",
	ease: "ease",
	easeIn: "ease-in",
	easeOut: "ease-out",
	easeInOut: "ease-in-out",
	circIn: /*@__PURE__*/ br([
		0,
		.65,
		.55,
		1
	]),
	circOut: /*@__PURE__*/ br([
		.55,
		0,
		1,
		.45
	]),
	backIn: /*@__PURE__*/ br([
		.31,
		.01,
		.66,
		-.59
	]),
	backOut: /*@__PURE__*/ br([
		.33,
		1.53,
		.69,
		.99
	])
};
// node_modules/motion-dom/dist/es/animation/waapi/easing/map-easing.mjs
function Sr(e, t) {
	if (e) return typeof e == "function" ? yr() ? It(e, t) : "ease-out" : /* @__PURE__ */ de(e) ? br(e) : Array.isArray(e) ? e.map((e) => Sr(e, t) || xr.easeOut) : xr[e];
}
// node_modules/motion-dom/dist/es/animation/waapi/start-waapi-animation.mjs
function Cr(e, t, n, { delay: r = 0, duration: i = 300, repeat: a = 0, repeatType: o = "loop", ease: s = "easeOut", times: c } = {}, l = void 0) {
	let u = { [t]: n };
	c && (u.offset = c);
	let d = Sr(s, i);
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
function wr(e) {
	return typeof e == "function" && "applyToOptions" in e;
}
// node_modules/motion-dom/dist/es/animation/waapi/utils/apply-generator.mjs
function Tr({ type: e, ...t }) {
	return wr(e) && yr() ? e.applyToOptions(t) : (t.duration ??= 300, t.ease ??= "easeOut", t);
}
// node_modules/motion-dom/dist/es/animation/NativeAnimation.mjs
var Er = class extends bn {
	constructor(e) {
		if (super(), this.finishedTime = null, this.isStopped = !1, this.manualStartTime = null, !e) return;
		let { element: t, name: n, keyframes: r, pseudoElement: i, allowFlatten: a = !1, finalKeyframe: o, onComplete: s } = e;
		this.isPseudoElement = !!i, this.allowFlatten = a, this.options = e, e.type;
		let c = Tr(e);
		this.animation = Cr(t, n, r, c, i), c.autoplay === !1 && this.animation.pause(), this.animation.onfinish = () => {
			if (this.finishedTime = this.time, !i) {
				let e = fn(r, this.options, o, this.speed);
				this.updateMotionValue && this.updateMotionValue(e), hr(t, n, e), this.animation.cancel();
			}
			s?.(), this.notifyFinished();
		}, vn(this, e, c);
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
		return this.allowFlatten && this.animation.effect?.updateTiming({ easing: "linear" }), this.animation.onfinish = null, e && vr() ? (this.animation.timeline = e, t?.(this.animation), M) : n(this);
	}
}, Dr = {
	anticipate: se,
	backInOut: oe,
	circInOut: le
};
function Or(e) {
	return e in Dr;
}
function kr(e) {
	typeof e.ease == "string" && Or(e.ease) && (e.ease = Dr[e.ease]);
}
var Ar = class extends Er {
	constructor(e) {
		kr(e), mn(e), super(e), e.startTime !== void 0 && e.autoplay !== !1 && (this.startTime = e.startTime), this.options = e;
	}
	elapsed() {
		return this.state === "running" ? (G.now() - this.startTime) * this.speed : this.time * 1e3;
	}
	sample(e) {
		if (!this.sampler) {
			let { motionValue: e, onUpdate: t, onComplete: n, onPlay: r, onStop: i, element: a, ...o } = this.options;
			this.sampler = new Cn({
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
		n && r && hr(n, r, s), t.setWithVelocity(this.sample(a - o * Math.sign(i)), s, o / Math.abs(i || 1));
	}
}, jr = (e, t) => t !== "zIndex" && !!(typeof e == "number" || Array.isArray(e) || typeof e == "string" && (st.test(e) || e === "0") && !e.startsWith("url("));
// node_modules/motion-dom/dist/es/animation/utils/can-animate.mjs
function Mr(e) {
	let t = e[0];
	if (e.length === 1) return !0;
	for (let n = 0; n < e.length; n++) if (e[n] !== t) return !0;
}
function Nr(e, t, n, r) {
	let i = e[0];
	if (i === null) return !1;
	if (t === "display" || t === "visibility") return !0;
	let a = e[e.length - 1], o = jr(i, t), s = jr(a, t);
	return !o || !s ? (o !== s && `${t}${i}${a}${o ? a : i}`, !1) : Mr(e) || (n === "spring" || wr(n)) && r;
}
// node_modules/motion-dom/dist/es/animation/utils/make-animation-instant.mjs
function Pr(e) {
	e.duration = 0, e.type = "keyframes";
}
// node_modules/motion-dom/dist/es/animation/waapi/utils/accelerated-values.mjs
var Fr = /* @__PURE__ */ new Set([
	"opacity",
	"clipPath",
	"filter",
	"transform",
	"backgroundColor"
]), Ir = /^(?:oklch|oklab|lab|lch|color|color-mix|light-dark)\(/;
function Lr(e) {
	for (let t = 0; t < e.length; t++) if (typeof e[t] == "string" && Ir.test(e[t])) return !0;
	return !1;
}
// node_modules/motion-dom/dist/es/animation/waapi/supports/waapi.mjs
var Rr = /* @__PURE__ */ new Set([
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
]), zr = () => !D.useManualTiming && Object.hasOwnProperty.call(Element.prototype, "animate");
function Br(e) {
	let { motionValue: t, name: n, repeatDelay: r, repeatType: i, damping: a, type: o, keyframes: s } = e;
	if (!n || !(Fr.has(n) || Rr.has(n))) return !1;
	let c = t?.owner?.current;
	if (!(c instanceof HTMLElement) && !(c instanceof SVGElement)) return !1;
	let { onUpdate: l, transformTemplate: u } = t.owner.getProps();
	return zr() && (Fr.has(n) || Rr.has(n) && Lr(s)) && (n !== "transform" || !u) && !l && !r && i !== "mirror" && a !== 0 && o !== "inertia";
}
// node_modules/motion-dom/dist/es/value/types/utils/get-as-type.mjs
var Vr = (e, t) => t && typeof e == "number" ? t.transform(e) : e, Hr = {
	x: "translateX",
	y: "translateY",
	z: "translateZ",
	transformPerspective: "perspective"
}, Ur = Jn.length;
function Wr(e, t, n) {
	let r = "", i = !0;
	for (let a = 0; a < Ur; a++) {
		let o = Jn[a], s = e[o];
		if (s === void 0) continue;
		let c = !0;
		if (typeof s == "number") c = s === +!!o.startsWith("scale");
		else {
			let e = parseFloat(s);
			c = o.startsWith("scale") ? e === 1 : e === 0;
		}
		if (!c || n) {
			let e = Vr(s, An[o]);
			if (!c) {
				i = !1;
				let t = Hr[o] || o;
				r += `${t}(${e}) `;
			}
			n && (t[o] = e);
		}
	}
	let a = e.pathRotation;
	return a && (i = !1, r += `rotate(${Vr(a, An.pathRotation)}) `), r = r.trim(), n ? r = n(t, i ? "" : r) : i && (r = "none"), r;
}
// node_modules/motion-dom/dist/es/animation/waapi/transforms/groups.mjs
var Gr = /* @__PURE__ */ new WeakMap(), Kr = 200, qr = .001, Jr = .1, Yr = .001, Xr = 100, Zr = (e) => /^(linear|ease(In|Out|InOut))$/.test(e), Qr = (e, t) => e - t, $r = (e, t, n) => {
	let r = [];
	for (let i = 0; i <= n; i++) r.push(dt(e, t, i / n));
	return r;
}, ei = (e) => e.motionValue.owner, ti = (e) => Gr.get(e), ni = (e, t) => e.latestValues ? e.latestValues[t] : e.getValue(t)?.get(), ri = ({ name: e, motionValue: t }) => e && Jn.includes(e) && t?.owner?.current instanceof HTMLElement && zr() && yr();
function ii(e) {
	let t = ei(e), { onUpdate: n, transformTemplate: r } = t.getProps();
	return !e.isHandoff && !n && !e.hasOnUpdate && !r && e.type !== "inertia" && (ni(t, "transform") || "none") === "none" && !ni(t, "pathRotation") && !t.projection?.isProjecting();
}
var ai = class extends Cn {
	constructor(e) {
		let t = ei(e).current, { driver: n = Ft } = e, r, i = ii(e);
		e.driver = (e) => {
			let i = n(e);
			return {
				js: i,
				now: i.now,
				start: (e = !0) => {
					let n = ti(t);
					!n || n.isJS ? i.start(e) : n.schedule(!1, !e);
				},
				stop: () => {
					i.stop();
					let e = ti(t);
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
		return ti(ei(this.options).current);
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
		return this.isAccelerated() ? this.sampleAt(G.now()) : void 0;
	}
	tween() {
		let { keyframes: e, type: t, ease: n, times: r, repeat: i, delay: a = 0 } = this.options, o = /* @__PURE__ */ de(n) ? br(n) : Zr(n) && xr[n];
		if (o && !i && !r && e.length === 2 && t === sn && this.holdTime === null) {
			let e = this.startTime + a / this.speed;
			return [
				e,
				e + this.resolvedDuration / this.speed,
				o
			];
		}
	}
	boundaries(e, t) {
		let { startTime: n, speed: r, resolvedDuration: i, options: a } = this, { delay: o = 0, repeat: s = 0, repeatDelay: c = 0, repeatType: l, times: u, keyframes: d, type: f } = a, p = (f || sn) === sn ? u || rn(d) : [0, 1], m = n + o / r, h = [];
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
		let e = G.now();
		this.options.motionValue.setWithVelocity(this.sampleAt(e - 10, !0), this.sampleAt(e, !0), 10);
	}
	play() {
		this.isStopped || ((this.group || oi(ei(this.options))).tracks.add(this), super.play());
	}
	pause() {
		super.pause(), this.isAccelerated() && (this.sync(), this.group.schedule(!1));
	}
	complete() {
		super.complete();
		let { group: e } = this;
		e && !e.isJS && this.canAccelerate && this.tick(G.now());
	}
	get time() {
		return this.isAccelerated() ? /* @__PURE__ */ L(E(0, this.totalDuration, this.at(G.now()) - (this.options.delay || 0))) : super.time;
	}
	set time(e) {
		super.time = e, this.isAccelerated() && this.sync();
	}
	attachTimeline(e) {
		return this.canAccelerate = !1, this.group?.demote(!0), super.attachTimeline(e);
	}
};
function oi(e) {
	let t = e.current, n = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Map(), i = {}, a = [], o = /* @__PURE__ */ new Map(), s = [], c = !1, l = !1, u = !1, d = !1, f = -Infinity, p = (e) => {
		for (let t of n) if (t.name === e) return !0;
	}, m = (t, n) => {
		let o = {};
		for (let s of t === void 0 ? Jn : a) {
			let a = r.get(s), c = t === void 0 ? ni(e, s) : a ? a.sampleAt(n > t && !a.timing()[1] ? n : t) : i[s];
			c !== void 0 && (o[s] = c);
		}
		return o;
	}, h = (e, t) => {
		let n = "", r = m(e, t);
		for (let e in r) n += (Hr[e] || e) + "(" + Vr(r[e], An[e]) + ") ";
		return n || "none";
	}, g = (e = m()) => {
		t.style.transform = Wr(e, {});
	}, _ = (e = !0) => {
		e && g(), s.forEach(({ animation: e }) => e.cancel()), s = [];
	}, v = (e, t, n = Infinity) => {
		let r = {
			animation: e,
			offset: t,
			end: n
		};
		e.startTime = G.now() + t, n < Infinity && (e.onfinish = () => {
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
		let i = Math.min(Kr, Math.max(2, Math.ceil((n - t) / 10)));
		if (r.length * 4 > i) return;
		let a = $r(t, n, i).concat(r).sort(Qr), o = (e) => /* @__PURE__ */ P(t, n, e), s, c;
		for (let t of e) {
			let e = a.map((e) => t.numberAt(e)), [n] = e, r = e.map((e) => e - n), i = r[r.length - 1], o = r.some((e) => Math.abs(e) * qr > Math.abs(i)) ? 0 : i, l = r.map((e) => o ? e / o : e);
			if (!o) {
				if (l.some((e) => !(Math.abs(e) <= qr))) return;
			} else if (!s) s = l, c = (e) => (t.numberAt(e) - n) / o;
			else if (l.some((e, t) => !(Math.abs(e - s[t]) <= qr))) return;
		}
		if (!s || s.every((e, t) => Math.abs(e - o(a[t])) <= qr)) return "linear";
		let l = [], u = (e, t = c(e)) => l.push(Sn(t) + " " + Sn(o(e) * 100) + "%");
		return s.forEach((e, t) => {
			t && Math.abs(e - s[t - 1]) > .2 && y(c, a[t - 1], a[t]).forEach((e) => u(e)), u(a[t], e);
		}), "linear(" + l + ")";
	}, x = (e, t, n, r) => {
		let i = [t], a = (t, n) => e.every((e) => !(Math.abs(e.numberAt((t + n) / 2) - (e.numberAt(t) + e.numberAt(n)) / 2) > (e.name.startsWith("scale") ? Yr : Jr))), o = (t, n, r) => {
			if (n - t < 1 || a(t, n)) i.push(n);
			else if (r < 4) o(t, (t + n) / 2, r + 1), o((t + n) / 2, n, r + 1);
			else {
				for (let r of e) i.push(...y((e) => r.numberAt(e), t, n));
				i.push(n);
			}
		}, s = $r(t, n, Math.ceil((n - t) / 100));
		for (let e of r) s.push(e, Math.min(e + .01, n));
		let c = t;
		for (let e of s.sort(Qr)) e > c && o(c, e, 0), c = e;
		return i.sort(Qr);
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
		i = {}, a = Jn.filter((t) => {
			if (r.has(t)) return !0;
			let n = i[t] = ni(e, t);
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
	}, E = () => !n.size && (u = !0, ti(t) === O && Gr.delete(t), O.isJS || _(), !0), D = () => {
		let t = G.now();
		if (O.isJS || (O.isFinishing = !0, n.forEach((n) => {
			let [r, a] = n.timing();
			n.state === "running" && n.speed > 0 && !a && r <= t + 1 && (n.complete(), i[n.name] = ni(e, n.name), o.has(n) || (c = !0));
		}), O.isFinishing = !1), l = !1, u || (n.forEach(({ state: e }, t) => {
			(e === "idle" || e === "finished") && n.delete(t);
		}), E())) return;
		for (let e of n) if (!e.canAccelerate) return O.demote(!0);
		O.isJS && (O.isJS = !1, c = !0, n.forEach((e) => e.js?.stop()));
		let r = c, a = d;
		if (c = d = !1, r || !T(t)) {
			if (a) {
				if (t - f < Xr) return O.demote();
				f = t;
			}
			if (!w(t)) return O.demote();
		}
	}, O = {
		tracks: n,
		isJS: !1,
		isFinishing: !1,
		schedule(e, t) {
			u || (c ||= e, d ||= !!t, l || (l = !0, U.isProcessing ? Mt.render(D, !1, !0) : queueMicrotask(D)));
		},
		release(e) {
			let { state: t } = e;
			(t === "idle" || t === "finished") && n.delete(e), E() || O.schedule(!0);
		},
		check() {
			if (!O.isJS) {
				for (let t in i) if (ni(e, t) !== i[t] && !p(t)) return O.schedule(!0, !0);
			}
		},
		demote(e) {
			O.isJS || u || (n.forEach((t) => {
				t.isAccelerated() && t.sync(), e || (t.canAccelerate = !1);
			}), O.isJS = !0, o = /* @__PURE__ */ new Map(), _(), n.forEach((e) => e.state === "running" && e.js?.start()));
		}
	};
	return Gr.set(t, O), O;
}
// node_modules/motion-dom/dist/es/animation/AsyncMotionValueAnimation.mjs
var si = class extends bn {
	constructor(e) {
		super(), this.stop = () => {
			this._animation && (this._animation.stop(), this.stopTimeline?.()), this.keyframeResolver?.cancel();
		}, this.createdAt = G.now();
		let { keyframes: t, name: n, motionValue: r, element: i } = e, a = e;
		a.autoplay ??= !0, a.delay ??= 0, a.type ??= "keyframes", a.repeat ??= 0, a.repeatDelay ??= 0, a.repeatType ??= "loop";
		let o = i?.KeyframeResolver || pr;
		this.keyframeResolver = new o(t, (e, t, n) => this.onKeyframesResolved(e, t, a, !n), n, r, i), this.keyframeResolver?.scheduleResolve();
	}
	onKeyframesResolved(e, t, n, r) {
		this.keyframeResolver = void 0;
		let { name: i, type: a, velocity: o, delay: s, isHandoff: c, onUpdate: l } = n;
		this.resolvedAt = G.now();
		let u = !0;
		Nr(e, i, a, o) || (u = !1, (D.instantAnimations || !s) && l?.(fn(e, n, t)), e[0] = e[e.length - 1], Pr(n), n.repeat = 0);
		let { onComplete: d } = n;
		n.finalKeyframe = t, n.keyframes = e, n.onComplete = () => {
			d?.(), this.notifyFinished();
		};
		let f = u && !c && Br(n), p = !f && ri(n);
		r && (f || p || this.resolvedAt !== this.createdAt) && (n.startTime ??= gn(this.createdAt, this.resolvedAt));
		let m;
		if (f) {
			n.element = n.motionValue?.owner?.current;
			try {
				m = new Ar(n);
			} catch {
				m = new Cn(n);
			}
		} else m = p ? new ai(n) : new Cn(n);
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
		return this._animation || (this.keyframeResolver?.resume(), dr()), this._animation;
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
function ci(e, t, n, r = 0, i = 1) {
	let a = Array.from(e).sort((e, t) => e.sortNodePosition(t)).indexOf(t), o = e.size, s = (o - 1) * r;
	return typeof n == "function" ? n(a, o) : i === 1 ? a * r : s - a * r;
}
// node_modules/motion-dom/dist/es/value/index.mjs
var li = 30, ui = (e) => !isNaN(parseFloat(e)), di = { current: void 0 }, fi = class {
	constructor(e, t = {}) {
		this.canTrackVelocity = null, this.events = {}, this.updateAndNotify = (e) => {
			let t = G.now();
			if (this.updatedAt !== t && this.setPrevFrameValue(), this.prev = this.current, this.setCurrent(e), this.current !== this.prev && (this.notifyChange(), this.dependents)) for (let e of this.dependents) e.dirty();
		}, this.hasAnimated = !1, this.setCurrent(e), this.owner = t.owner;
	}
	setCurrent(e) {
		this.current = e, this.updatedAt = G.now(), this.canTrackVelocity === null && e !== void 0 && (this.canTrackVelocity = ui(this.current));
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
		Mt.read(() => {
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
		di.current && di.current.push(this);
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
		let e = G.now();
		if (!this.canTrackVelocity || this.prevFrameValue === void 0 || e - this.updatedAt > li) return 0;
		let t = Math.min(this.updatedAt - this.prevUpdatedAt, li);
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
function pi(e, t) {
	return new fi(e, t);
}
// node_modules/motion-dom/dist/es/animation/utils/resolve-transition.mjs
function mi(e, t) {
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
function hi(e, t) {
	let n = e?.[t] ?? e?.default ?? e;
	return n === e ? n : mi(n, e);
}
// node_modules/motion-dom/dist/es/animation/utils/default-transitions.mjs
var gi = {
	type: "spring",
	stiffness: 500,
	damping: 25,
	restSpeed: 10
}, _i = (e) => ({
	type: "spring",
	stiffness: 550,
	damping: e === 0 ? 2 * Math.sqrt(550) : 30,
	restSpeed: 10
}), vi = {
	type: "keyframes",
	duration: .8
}, yi = {
	type: "keyframes",
	ease: [
		.25,
		.1,
		.35,
		1
	],
	duration: .3
}, bi = (e, { keyframes: t }) => t.length > 2 ? vi : Yn.has(e) ? e.startsWith("scale") ? _i(t[1]) : gi : yi, xi = /* @__PURE__ */ new Set([
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
function Si(e) {
	for (let t in e) if (!xi.has(t)) return !0;
	return !1;
}
// node_modules/motion-dom/dist/es/animation/interfaces/motion-value.mjs
var Ci = (e, t, n, r = {}, i, a) => (o) => {
	let s = hi(r, e) || {}, c = s.delay || r.delay || 0, { elapsed: l = 0 } = r;
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
	Si(s) || Object.assign(u, bi(e, u)), u.duration &&= /* @__PURE__ */ I(u.duration), u.repeatDelay &&= /* @__PURE__ */ I(u.repeatDelay), u.from !== void 0 && (u.keyframes[0] = u.from);
	let d = !1;
	if ((u.type === !1 || u.duration === 0 && !u.repeatDelay) && (Pr(u), u.delay === 0 && (d = !0)), (D.instantAnimations || D.skipAnimations || i?.shouldSkipAnimations || s.skipAnimations) && (d = !0, Pr(u), u.delay = 0), u.allowFlatten = !s.type && !s.ease, d && !a && t.get() !== void 0) {
		let e = fn(u.keyframes, s);
		if (e !== void 0) {
			Mt.update(() => {
				u.onUpdate(e), u.onComplete();
			});
			return;
		}
	}
	return s.isSync ? new Cn(u) : new si(u);
}, wi = /^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u;
function Ti(e) {
	let t = wi.exec(e);
	if (!t) return [,];
	let [, n, r, i] = t;
	return [`--${n ?? r}`, i];
}
function Ei(e, t, n = 1) {
	`${e}`;
	let [r, i] = Ti(e);
	if (!r) return;
	let a = window.getComputedStyle(t).getPropertyValue(r);
	if (a) {
		let e = a.trim();
		return O(e) ? parseFloat(e) : e;
	}
	return ye(i) ? Ei(i, t, n + 1) : i;
}
// node_modules/motion-dom/dist/es/render/utils/resolve-variants.mjs
function Di(e) {
	let t = [{}, {}];
	return e?.values.forEach((e, n) => {
		t[0][n] = e.get(), t[1][n] = e.getVelocity();
	}), t;
}
function Oi(e, t, n, r) {
	let i = (t) => typeof t == "function" ? t(n === void 0 ? e.custom : n, ...Di(r)) : t;
	return t = i(t), typeof t == "string" && (t = e.variants && e.variants[t]), i(t);
}
// node_modules/motion-dom/dist/es/render/utils/resolve-dynamic-variants.mjs
function ki(e, t, n) {
	return Oi(e.getProps(), t, n, e);
}
var Ai = (e, t) => t === "exit" ? e.presenceContext?.custom : void 0, ji = /* @__PURE__ */ new Set([
	"width",
	"height",
	"top",
	"left",
	"right",
	"bottom",
	...Jn
]), Mi = (e) => Array.isArray(e);
// node_modules/motion-dom/dist/es/render/utils/setters.mjs
function Ni(e, t, n) {
	e.hasValue(t) ? e.getValue(t).set(n) : e.addValue(t, pi(n));
}
function Pi(e) {
	return Mi(e) ? e[e.length - 1] || 0 : e;
}
function Fi(e, t) {
	let { transitionEnd: n = {}, transition: r = {}, ...i } = ki(e, t) || {};
	i = {
		...i,
		...n
	};
	for (let t in i) Ni(e, t, Pi(i[t]));
}
// node_modules/motion-dom/dist/es/value/utils/is-motion-value.mjs
var Ii = (e) => !!(e && e.getVelocity);
// node_modules/motion-dom/dist/es/value/will-change/is.mjs
function Li(e) {
	return !!(Ii(e) && e.add);
}
// node_modules/motion-dom/dist/es/value/will-change/add-will-change.mjs
function Ri(e, t) {
	let n = e.getValue("willChange");
	if (Li(n)) return n.add(t);
	if (!n && D.WillChange) {
		let n = new D.WillChange("auto");
		e.addValue("willChange", n), n.add(t);
	}
}
// node_modules/motion-dom/dist/es/animation/optimized-appear/data-id.mjs
var zi = "data-framer-appear-id";
// node_modules/motion-dom/dist/es/animation/optimized-appear/get-appear-id.mjs
function Bi(e) {
	return e.props[zi];
}
// node_modules/motion-dom/dist/es/animation/interfaces/visual-element-target.mjs
var Vi = typeof window < "u";
function Hi({ protectedKeys: e, needsAnimating: t }, n) {
	let r = n in e && !t[n];
	return t[n] = !1, r;
}
function Ui(e, t, { delay: n = 0, transitionOverride: r, type: i } = {}) {
	let { transition: a, transitionEnd: o, ...s } = t, c = e.getDefaultTransition();
	a = a ? mi(a, c) : c;
	let l = a?.reduceMotion, u = a?.skipAnimations;
	r && (a = r);
	let d = [], f = i && e.animationState?.getState()[i], p = a?.path;
	p && (p.animateValues ? p.animateValues((t) => e.getValue(t, e.latestValues[t] ?? 0), s, a, n, d) : p.animateVisualElement?.(e, s, a, n, d));
	for (let t in s) {
		let r = e.getValue(t, e.latestValues[t] ?? null), i = s[t];
		if (i === void 0 || f && Hi(f, t)) continue;
		let o = {
			delay: n,
			...hi(a || {}, t)
		};
		u && (o.skipAnimations = !0);
		let c = r.get();
		if (c !== void 0 && !r.isAnimating() && !Array.isArray(i) && i === c && !o.velocity) {
			Mt.update(() => r.set(i));
			continue;
		}
		let p = !1;
		if (Vi && window.MotionHandoffAnimation) {
			let n = Bi(e);
			if (n) {
				let e = window.MotionHandoffAnimation(n, t, Mt);
				e !== null && (o.startTime = e, p = !0);
			}
		}
		Ri(e, t);
		let m = l ?? e.shouldReduceMotion;
		r.start(Ci(t, r, i, m && ji.has(t) ? { type: !1 } : o, e, p));
		let h = r.animation;
		h && d.push(h);
	}
	if (o) {
		let t = () => Mt.update(() => {
			o && Fi(e, o);
		});
		d.length ? Promise.all(d).then(t) : t();
	}
	return d;
}
// node_modules/motion-dom/dist/es/animation/interfaces/visual-element-variant.mjs
function Wi(e, t, n = {}) {
	let r = ki(e, t, Ai(e, n.type)), i = n.transitionOverride || (r?.transition ?? (e.getDefaultTransition() || {})), a = () => Promise.all(r ? Ui(e, r, n) : []), o = (r = 0) => {
		let { variantChildren: a } = e, { delayChildren: o = 0, staggerChildren: s, staggerDirection: c } = i, l = [];
		return a?.forEach((e) => {
			e.notify("AnimationStart", t), l.push(Wi(e, t, {
				...n,
				delay: r + (typeof o == "function" ? 0 : o) + ci(a, e, o, s, c)
			}).then(() => e.notify("AnimationComplete", t)));
		}), Promise.all(l);
	}, { when: s } = i;
	return s ? s === "beforeChildren" ? a().then(() => o()) : o().then(a) : Promise.all([a(), o(n.delay)]);
}
// node_modules/motion-dom/dist/es/animation/interfaces/visual-element.mjs
function Gi(e, t, n = {}) {
	return e.notify("AnimationStart", t), (Array.isArray(t) ? Promise.all(t.map((t) => Wi(e, t, n))) : typeof t == "string" ? Wi(e, t, n) : Promise.all(Ui(e, ki(e, t, n.custom), n))).then(() => {
		e.notify("AnimationComplete", t);
	});
}
// node_modules/motion-dom/dist/es/value/types/auto.mjs
var Ki = {
	test: (e) => e === "auto",
	parse: (e) => e
}, qi = (e) => (t) => t.test(e), Ji = [
	Se,
	q,
	Le,
	Ie,
	ze,
	Re,
	Ki
], Yi = (e) => Ji.find(qi(e));
// node_modules/motion-dom/dist/es/animation/keyframes/utils/is-none.mjs
function Xi(e) {
	return typeof e == "number" ? e === 0 : e === null || e === "none" || e === "0" || A(e);
}
// node_modules/motion-dom/dist/es/animation/keyframes/utils/make-none-animatable.mjs
var J = /* @__PURE__ */ new Set([
	"auto",
	"none",
	"0"
]);
function Zi(e, t, n) {
	let r = 0, i;
	for (; r < e.length && !i;) {
		let t = e[r];
		typeof t == "string" && !J.has(t) && $e(t) && (i = e[r]), r++;
	}
	if (i && n) for (let r of t) e[r] !== i && (e[r] = Pn(n, i));
}
// node_modules/motion-dom/dist/es/animation/keyframes/DOMKeyframesResolver.mjs
var Qi = class extends pr {
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
		for (let t = 0; t < e.length; t++) if (xe(t ? e[t] : r)) return !1;
		return !0;
	}
	readKeyframes() {
		let { unresolvedKeyframes: e, element: t, name: n } = this;
		if (!t || !t.current) return;
		super.readKeyframes();
		for (let n = 0; n < e.length; n++) {
			let r = e[n];
			if (typeof r == "string" && (r = r.trim(), ye(r))) {
				let i = Ei(r, t.current);
				i !== void 0 && (e[n] = i), n === e.length - 1 && (this.finalKeyframe = r);
			}
		}
		if (this.resolveNoneKeyframes(), !ji.has(n) || e.length !== 2) return;
		let [r, i] = e;
		if (typeof r == "number" && typeof i == "number") return;
		let a = Yi(r), o = Yi(i);
		if (xe(r) !== xe(i) && ir[n]) this.needsMeasurement = !0;
		else if (a !== o) {
			if (Xn(a) && Xn(o)) for (let t = 0; t < e.length; t++) {
				let n = e[t];
				typeof n == "string" && (e[t] = parseFloat(n));
			}
			else ir[n] && (this.needsMeasurement = !0);
		}
	}
	resolveNoneKeyframes() {
		let { unresolvedKeyframes: e, name: t } = this, n = [];
		for (let t = 0; t < e.length; t++) (e[t] === null || Xi(e[t])) && n.push(t);
		n.length && Zi(e, n, t);
	}
	measure() {
		let { element: e, name: t } = this;
		return ir[t](window.getComputedStyle(e.current), () => e.measureViewportBox());
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
}, $i = [
	"borderTopLeftRadius",
	"borderTopRightRadius",
	"borderBottomRightRadius",
	"borderBottomLeftRadius"
];
// node_modules/motion-dom/dist/es/utils/is-html-element.mjs
function ea(e) {
	return k(e) && "offsetHeight" in e && !("ownerSVGElement" in e);
}
// node_modules/motion-dom/dist/es/utils/is-svg-element.mjs
function ta(e) {
	return k(e) && "ownerSVGElement" in e;
}
// node_modules/motion-dom/dist/es/scope/active.mjs
var na = {};
function ra(e) {
	return na.current?.add(e), e;
}
var ia = (e) => na.current ? na.current.bind(e) : e;
// node_modules/motion-dom/dist/es/utils/resolve-elements.mjs
function aa(e, t, n) {
	if (e == null) return [];
	if (e instanceof EventTarget) return [e];
	if (typeof e == "string") {
		let r = t ? t.current : na.current?.root || document, i = n?.[e] ?? r.querySelectorAll(e);
		return i ? Array.from(i) : [];
	}
	return Array.from(e).filter((e) => e != null);
}
// node_modules/motion-dom/dist/es/render/dom/utils/camel-to-dash.mjs
function oa(e) {
	return e.replace(/([A-Z])/g, (e) => `-${e.toLowerCase()}`);
}
// node_modules/motion-dom/dist/es/render/html/utils/build-styles.mjs
function sa(e, t, n) {
	let { style: r, vars: i, transformOrigin: a } = e, o = !1, s = !1;
	for (let e in t) {
		let n = t[e];
		if (Yn.has(e)) o = !0;
		else if (_e(e)) i[e] = n;
		else {
			let t = Vr(n, An[e]);
			e.startsWith("origin") ? (s = !0, a[e] = t) : r[e] = t;
		}
	}
	if (t.transform || (o || n ? r.transform = Wr(t, e.transform, n) : r.transform &&= "none"), s) {
		let { originX: e = "50%", originY: t = "50%", originZ: n = 0 } = a;
		r.transformOrigin = `${e} ${t} ${n}`;
	}
}
// node_modules/motion-dom/dist/es/render/svg/utils/path.mjs
var ca = {
	offset: "stroke-dashoffset",
	array: "stroke-dasharray"
}, la = {
	offset: "strokeDashoffset",
	array: "strokeDasharray"
};
function ua(e, t, n = 1, r = 0, i = !0) {
	e.pathLength = 1;
	let a = i ? ca : la;
	e[a.offset] = `${-r}`, e[a.array] = `${t} ${n}`;
}
// node_modules/motion-dom/dist/es/render/svg/utils/build-attrs.mjs
var da = [
	"transform",
	"opacity",
	"clipPath",
	"filter",
	"offsetDistance",
	"offsetPath",
	"offsetRotate",
	"offsetAnchor"
];
function fa(e, { attrX: t, attrY: n, attrScale: r, pathLength: i, pathSpacing: a = 1, pathOffset: o = 0, ...s }, c, l, u) {
	if (sa(e, s, l), c) {
		e.style.viewBox && (e.attrs.viewBox = e.style.viewBox);
		return;
	}
	e.attrs = e.style, e.style = {};
	let { attrs: d, style: f } = e;
	for (let e of da) d[e] !== void 0 && (f[e] = d[e], delete d[e]);
	(f.transform || d.transformOrigin) && (f.transformOrigin = d.transformOrigin ?? "50% 50%", delete d.transformOrigin), f.transform && (f.transformBox = u?.transformBox ?? "fill-box", delete d.transformBox), t !== void 0 && (d.x = t), n !== void 0 && (d.y = n), r !== void 0 && (d.scale = r), i !== void 0 && ua(d, i, a, o, !1);
}
// node_modules/motion-dom/dist/es/projection/geometry/conversion.mjs
function pa({ top: e, left: t, right: n, bottom: r }) {
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
function ma({ x: e, y: t }) {
	return {
		top: t.min,
		right: e.max,
		bottom: t.max,
		left: e.min
	};
}
function ha(e, t) {
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
function ga(e) {
	return e === void 0 || e === 1;
}
function _a({ scale: e, scaleX: t, scaleY: n }) {
	return !ga(e) || !ga(t) || !ga(n);
}
function va(e) {
	return _a(e) || ya(e) || e.z || e.rotate || e.rotateX || e.rotateY || e.rotateZ || e.skewX || e.skewY;
}
function ya(e) {
	return ba(e.x) || ba(e.y);
}
function ba(e) {
	return e && e !== "0%";
}
// node_modules/motion-dom/dist/es/projection/geometry/delta-apply.mjs
function xa(e, t, n) {
	return n + t * (e - n);
}
function Sa(e, t, n, r, i) {
	return i !== void 0 && (e = xa(e, i, r)), xa(e, n, r) + t;
}
function Ca(e, t = 0, n = 1, r, i) {
	e.min = Sa(e.min, t, n, r, i), e.max = Sa(e.max, t, n, r, i);
}
function wa(e, { x: t, y: n }) {
	Ca(e.x, t.translate, t.scale, t.originPoint), Ca(e.y, n.translate, n.scale, n.originPoint);
}
var Ta = .999999999999, Ea = 1.0000000000001;
function Da(e, t, n, r = !1) {
	let i = n.length;
	if (!i) return;
	t.x = t.y = 1;
	let a, o;
	for (let s = 0; s < i; s++) {
		a = n[s], o = a.projectionDelta;
		let { visualElement: i } = a.options;
		i && i.props.style && i.props.style.display === "contents" || (r && a.options.layoutScroll && a.scroll && a !== a.root && (Oa(e.x, -a.scroll.offset.x), Oa(e.y, -a.scroll.offset.y)), o && (t.x *= o.x.scale, t.y *= o.y.scale, wa(e, o)), r && va(a.latestValues) && ja(e, a.latestValues, a.layout?.layoutBox));
	}
	t.x < Ea && t.x > Ta && (t.x = 1), t.y < Ea && t.y > Ta && (t.y = 1);
}
function Oa(e, t) {
	e.min += t, e.max += t;
}
function ka(e, t, n, r, i = .5) {
	Ca(e, t, n, dt(e.min, e.max, i), r);
}
function Aa(e, t) {
	return typeof e == "string" ? parseFloat(e) / 100 * (t.max - t.min) : e;
}
function ja(e, t, n) {
	let r = n ?? e;
	ka(e.x, Aa(t.x, r.x), t.scaleX, t.scale, t.originX), ka(e.y, Aa(t.y, r.y), t.scaleY, t.scale, t.originY);
}
// node_modules/motion-dom/dist/es/projection/utils/measure.mjs
function Ma(e, t) {
	return pa(ha(e.getBoundingClientRect(), t));
}
function Na(e, t, n) {
	let r = Ma(e, n), { scroll: i } = t;
	return i && (Oa(r.x, i.offset.x), Oa(r.y, i.offset.y)), r;
}
// node_modules/motion-dom/dist/es/frameloop/microtask.mjs
var { schedule: Pa, cancel: Fa } = /* @__PURE__ */ jt(queueMicrotask, !1);
// node_modules/motion-dom/dist/es/animation/animate/single-value.mjs
function Ia(e, t, n) {
	let r = Ii(e) ? e : pi(e);
	return r.start(Ci("", r, t, n)), r.animation;
}
// node_modules/motion-dom/dist/es/projection/styles/scale-correction.mjs
var La = {}, Ra = {
	value: null,
	addProjectionMetrics: null
};
// node_modules/motion-dom/dist/es/utils/delay.mjs
function za(e, t) {
	let n = G.now();
	e = ia(e);
	let r = ({ timestamp: i }) => {
		let a = i - n;
		a >= t && (Nt(r), e(a - t));
	};
	return Mt.setup(r, !0), ra(() => Nt(r));
}
// node_modules/motion-dom/dist/es/utils/is-svg-svg-element.mjs
function Ba(e) {
	return ta(e) && e.tagName === "svg";
}
// node_modules/motion-dom/dist/es/value/utils/resolve-motion-value.mjs
function Va(e) {
	return Ii(e) ? e.get() : e;
}
// node_modules/motion-dom/dist/es/value/utils/as-number.mjs
var Ha = (e) => typeof e == "number" ? e : parseFloat(e), Ua = $i.length, Wa = [
	"rotate",
	"rotateX",
	"rotateY",
	"rotateZ",
	"skewX",
	"skewY"
], Ga = Wa.length, Ka = (e) => typeof e == "number" || q.test(e);
function qa(e, t, n, r, i, a) {
	i ? (e.opacity = dt(0, n.opacity ?? 1, Ya(r)), e.opacityExit = dt(t.opacity ?? 1, 0, Xa(r))) : a && (e.opacity = dt(t.opacity ?? 1, n.opacity ?? 1, r));
	for (let i = 0; i < Ua; i++) {
		let a = $i[i], o = Ja(t, a), s = Ja(n, a);
		(o !== void 0 || s !== void 0) && (o ||= 0, s ||= 0, o === 0 || s === 0 || Ka(o) === Ka(s) ? (e[a] = Math.max(dt(Ha(o), Ha(s), r), 0), (Le.test(s) || Le.test(o)) && (e[a] += "%")) : e[a] = s);
	}
	for (let i = 0; i < Ga; i++) {
		let a = Wa[i];
		(t[a] || n[a]) && (e[a] = dt(t[a] || 0, n[a] || 0, r));
	}
}
function Ja(e, t) {
	return e[t] === void 0 ? e.borderRadius : e[t];
}
var Ya = /*@__PURE__*/ Za(0, .5, ce), Xa = /*@__PURE__*/ Za(.5, .95, M);
function Za(e, t, n) {
	return (r) => r < e ? 0 : r > t ? 1 : n(/* @__PURE__ */ P(e, t, r));
}
// node_modules/motion-dom/dist/es/projection/geometry/copy.mjs
function Qa(e, t) {
	e.min = t.min, e.max = t.max;
}
function $a(e, t) {
	Qa(e.x, t.x), Qa(e.y, t.y);
}
function eo(e, t) {
	e.translate = t.translate, e.scale = t.scale, e.originPoint = t.originPoint, e.origin = t.origin;
}
// node_modules/motion-dom/dist/es/projection/geometry/delta-calc.mjs
var to = .9999, no = 1.0001, ro = -.01, io = .01;
function ao(e) {
	return e.max - e.min;
}
function oo(e, t, n) {
	return Math.abs(e - t) <= n;
}
function so(e, t, n, r = .5) {
	e.origin = r, e.originPoint = dt(t.min, t.max, e.origin), e.scale = ao(n) / ao(t), e.translate = dt(n.min, n.max, e.origin) - e.originPoint, (e.scale >= to && e.scale <= no || isNaN(e.scale)) && (e.scale = 1), (e.translate >= ro && e.translate <= io || isNaN(e.translate)) && (e.translate = 0);
}
function co(e, t, n, r) {
	so(e.x, t.x, n.x, r ? r.originX : void 0), so(e.y, t.y, n.y, r ? r.originY : void 0);
}
function lo(e, t, n, r = 0) {
	e.min = (r ? dt(n.min, n.max, r) : n.min) + t.min, e.max = e.min + ao(t);
}
function uo(e, t, n, r) {
	lo(e.x, t.x, n.x, r?.x), lo(e.y, t.y, n.y, r?.y);
}
function fo(e, t, n, r = 0) {
	let i = r ? dt(n.min, n.max, r) : n.min;
	e.min = t.min - i, e.max = e.min + ao(t);
}
function po(e, t, n, r) {
	fo(e.x, t.x, n.x, r?.x), fo(e.y, t.y, n.y, r?.y);
}
// node_modules/motion-dom/dist/es/projection/geometry/delta-remove.mjs
function mo(e, t, n, r, i) {
	return e -= t, e = xa(e, 1 / n, r), i !== void 0 && (e = xa(e, 1 / i, r)), e;
}
function ho(e, t = 0, n = 1, r = .5, i, a = e, o = e) {
	if (Le.test(t) && (t = parseFloat(t), t = dt(o.min, o.max, t / 100) - o.min), typeof t != "number") return;
	let s = dt(a.min, a.max, r);
	e === a && (s -= t), e.min = mo(e.min, t, n, s, i), e.max = mo(e.max, t, n, s, i);
}
function go(e, t, [n, r, i], a, o) {
	ho(e, t[n], t[r], t[i], t.scale, a, o);
}
var _o = [
	"x",
	"scaleX",
	"originX"
], vo = [
	"y",
	"scaleY",
	"originY"
];
function yo(e, t, n, r) {
	go(e.x, t, _o, n ? n.x : void 0, r ? r.x : void 0), go(e.y, t, vo, n ? n.y : void 0, r ? r.y : void 0);
}
// node_modules/motion-dom/dist/es/projection/geometry/models.mjs
var bo = () => ({
	translate: 0,
	scale: 1,
	origin: 0,
	originPoint: 0
}), xo = () => ({
	x: bo(),
	y: bo()
}), So = () => ({
	min: 0,
	max: 0
}), Co = () => ({
	x: So(),
	y: So()
});
// node_modules/motion-dom/dist/es/projection/geometry/utils.mjs
function wo(e) {
	return e.translate === 0 && e.scale === 1;
}
function To(e) {
	return wo(e.x) && wo(e.y);
}
function Eo(e, t) {
	return e.min === t.min && e.max === t.max;
}
function Do(e, t) {
	return Eo(e.x, t.x) && Eo(e.y, t.y);
}
function Oo(e, t) {
	return Math.round(e.min) === Math.round(t.min) && Math.round(e.max) === Math.round(t.max);
}
function ko(e, t) {
	return Oo(e.x, t.x) && Oo(e.y, t.y);
}
function Ao(e) {
	return ao(e.x) / ao(e.y);
}
function jo(e, t) {
	return e.translate === t.translate && e.scale === t.scale && e.originPoint === t.originPoint;
}
// node_modules/motion-dom/dist/es/projection/shared/stack.mjs
var Mo = class {
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
function No(e, t) {
	return t.max === t.min ? 0 : e / (t.max - t.min) * 100;
}
var Po = { correct: (e, t) => {
	if (!t.target) return e;
	if (typeof e == "string") {
		if (q.test(e)) e = parseFloat(e);
		else return e;
	}
	return `${No(e, t.target.x)}% ${No(e, t.target.y)}%`;
} }, Y = {
	borderRadius: /* @__PURE__ */ Object.assign({}, Po, { applyTo: /* @__PURE__ */ $i.slice() }),
	borderTopLeftRadius: Po,
	borderTopRightRadius: Po,
	borderBottomLeftRadius: Po,
	borderBottomRightRadius: Po,
	boxShadow: { correct: (e, { treeScale: t, projectionDelta: n }) => {
		let r = e, i = st.parse(e);
		if (i.length > 5) return r;
		let a = st.createTransformer(e), o = typeof i[0] == "number" ? 0 : 1, s = n.x.scale * t.x, c = n.y.scale * t.y;
		i[0 + o] /= s, i[1 + o] /= c;
		let l = dt(s, c, .5);
		return typeof i[2 + o] == "number" && (i[2 + o] /= l), typeof i[3 + o] == "number" && (i[3 + o] /= l), a(i);
	} }
};
// node_modules/motion-dom/dist/es/projection/styles/transform.mjs
function Fo(e, t, n) {
	let r = "", i = e.x.translate / t.x, a = e.y.translate / t.y, o = n?.z || 0;
	if ((i || a || o) && (r = `translate3d(${i}px, ${a}px, ${o}px) `), (t.x !== 1 || t.y !== 1) && (r += `scale(${1 / t.x}, ${1 / t.y}) `), n) {
		let { transformPerspective: e, rotate: t, pathRotation: i, rotateX: a, rotateY: o, rotateZ: s, skewX: c, skewY: l } = n;
		e && (r = `perspective(${e}px) ${r}`), t && (r += `rotate(${t}deg) `), i && (r += `rotate(${i}deg) `), a && (r += `rotateX(${a}deg) `), o && (r += `rotateY(${o}deg) `), s && (r += `rotateZ(${s}deg) `), c && (r += `skewX(${c}deg) `), l && (r += `skewY(${l}deg) `);
	}
	let s = e.x.scale * t.x, c = e.y.scale * t.y;
	return (s !== 1 || c !== 1) && (r += `scale(${s}, ${c})`), r || "none";
}
// node_modules/motion-dom/dist/es/projection/utils/each-axis.mjs
function Io(e) {
	return [e("x"), e("y")];
}
// node_modules/motion-dom/dist/es/projection/utils/compare-by-depth.mjs
var Lo = (e, t) => e.depth - t.depth, Ro = class {
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
		this.isDirty && this.children.sort(Lo), this.isDirty = !1, this.children.forEach(e);
	}
}, zo = {
	hasAnimatedSinceResize: !0,
	hasEverUpdated: !1
}, Bo = {
	nodes: 0,
	calculatedTargetDeltas: 0,
	calculatedProjections: 0
}, Vo = [
	"",
	"X",
	"Y",
	"Z"
], Ho = 1e3, Uo = 0;
function Wo(e, t, n, r) {
	let { latestValues: i } = t;
	i[e] && (n[e] = i[e], t.setStaticValue(e, 0), r && (r[e] = 0));
}
var Go = ({ instance: e }) => e && Gr.get(e)?.demote();
function Ko(e) {
	if (e.hasCheckedOptimisedAppear = !0, e.root === e) return;
	let { visualElement: t } = e.options;
	if (!t) return;
	let n = Bi(t);
	if (window.MotionHasOptimisedAnimation(n, "transform")) {
		let { layout: t, layoutId: r } = e.options;
		window.MotionCancelOptimisedAnimation(n, "transform", Mt, !(t || r));
	}
	let { parent: r } = e;
	r && !r.hasCheckedOptimisedAppear && Ko(r);
}
function qo({ attachResizeListener: e, defaultParent: t, measureScroll: n, checkIsScrollRoot: r, resetTransform: i }) {
	return Object.assign(La, {
		...Y,
		...La
	}), class {
		constructor(e = {}, n = t?.()) {
			this.id = Uo++, this.animationId = 0, this.animationCommitId = 0, this.children = /* @__PURE__ */ new Set(), this.options = {}, this.isTreeAnimating = !1, this.isAnimationBlocked = !1, this.isLayoutDirty = !1, this.isProjectionDirty = !1, this.isSharedProjectionDirty = !1, this.isTransformDirty = !1, this.updateManuallyBlocked = !1, this.updateBlockedByResize = !1, this.isUpdating = !1, this.isSVG = !1, this.needsReset = !1, this.shouldResetTransform = !1, this.hasCheckedOptimisedAppear = !1, this.treeScale = {
				x: 1,
				y: 1
			}, this.eventHandlers = /* @__PURE__ */ new Map(), this.hasTreeAnimated = !1, this.updateScheduled = !1, this.scheduleUpdate = () => this.update(), this.projectionUpdateScheduled = !1, this.checkUpdateFailed = () => {
				this.isUpdating && (this.isUpdating = !1, this.clearAllSnapshots());
			}, this.updateProjection = () => {
				this.projectionUpdateScheduled = !1, Ra.value && (Bo.nodes = Bo.calculatedTargetDeltas = Bo.calculatedProjections = 0), this.nodes.forEach(Xo), this.nodes.forEach(ss), this.nodes.forEach(cs), this.nodes.forEach(Zo), Ra.addProjectionMetrics && Ra.addProjectionMetrics(Bo);
			}, this.resolvedRelativeTargetAt = 0, this.hasProjected = !1, this.isVisible = !0, this.animationProgress = 0, this.sharedNodes = /* @__PURE__ */ new Map(), this.latestValues = e, this.root = n ? n.root || n : this, this.path = n ? [...n.path, n] : [], this.parent = n, this.depth = n ? n.depth + 1 : 0;
			for (let e = 0; e < this.path.length; e++) this.path[e].shouldResetTransform = !0;
			this.root === this && (this.nodes = new Ro());
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
			this.isSVG = ta(t) && !Ba(t), this.instance = t;
			let { layoutId: n, layout: r, visualElement: i } = this.options;
			if (i && !i.current && i.mount(t), this.root.nodes.add(this), this.parent && this.parent.children.add(this), this.root.hasTreeAnimated && (r || n) && (this.isLayoutDirty = !0), e) {
				let n, r = 0, i = () => this.root.updateBlockedByResize = !1;
				Mt.read(() => {
					r = window.innerWidth;
				}), e(t, () => {
					let e = window.innerWidth;
					e !== r && (r = e, this.root.updateBlockedByResize = !0, n && n(), n = za(i, 250), zo.hasAnimatedSinceResize && (zo.hasAnimatedSinceResize = !1, this.nodes.forEach(os)));
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
				let a = this.options.transition || n.getDefaultTransition() || ms, { onLayoutAnimationStart: o, onLayoutAnimationComplete: s } = n.getProps(), c = !this.targetLayout || !ko(this.targetLayout, i), l = !t && r;
				if (this.options.layoutRoot || this.resumeFrom || l || t && (c || !this.currentAnimation)) {
					this.resumeFrom && (this.resumingFrom = this.resumeFrom, this.resumingFrom.resumingFrom = void 0);
					let t = {
						...hi(a, "layout"),
						onPlay: o,
						onComplete: s
					};
					(n.shouldReduceMotion || this.options.layoutRoot) && (t.delay = 0, t.type = !1), this.startAnimation(t), this.setAnimationOrigin(e, l, t.path);
				} else t || os(this), this.isLead() && this.options.onExitComplete && this.options.onExitComplete();
				this.targetLayout = i;
			}));
		}
		unmount() {
			this.options.layoutId && this.willUpdate(), this.root.nodes.remove(this);
			let e = this.getStack();
			e && e.remove(this), this.parent && this.parent.children.delete(this), this.instance = void 0, this.eventHandlers.clear(), this.hasLayoutListener = !1, Nt(this.updateProjection);
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
			this.isUpdateBlocked() || (this.isUpdating = !0, this.nodes && this.nodes.forEach(ls), this.animationId++);
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
			if (window.MotionCancelOptimisedAnimation && !this.hasCheckedOptimisedAppear && Ko(this), !this.root.isUpdating && this.root.startUpdate(), this.isLayoutDirty) return;
			Go(this), this.isLayoutDirty = !0;
			for (let e = 0; e < this.path.length; e++) {
				let t = this.path[e];
				t.shouldResetTransform = !0, Go(t), (typeof t.latestValues.x == "string" || typeof t.latestValues.y == "string") && (t.isLayoutDirty = !0), t.updateScroll("snapshot"), t.options.layoutRoot && t.willUpdate(!1), t.isAnimationBlocked && (t.dragSnapshot ||= t.measure(), this.dragAncestor = t);
			}
			let { layoutId: t, layout: n } = this.options;
			if (t === void 0 && !n) return;
			let r = this.getTransformTemplate();
			this.prevTransformTemplateValue = r ? r(this.latestValues, "") : void 0, this.updateSnapshot(), e && this.notifyListeners("willUpdate");
		}
		update() {
			if (this.updateScheduled = !1, this.isUpdateBlocked()) {
				let e = this.updateBlockedByResize;
				this.unblockUpdate(), this.updateBlockedByResize = !1, this.clearAllSnapshots(), e && this.nodes.forEach(es), this.nodes.forEach($o);
				return;
			}
			if (this.animationId <= this.animationCommitId) {
				this.nodes.forEach(ts);
				return;
			}
			this.animationCommitId = this.animationId, this.isUpdating ? (this.isUpdating = !1, this.nodes.forEach(rs), this.nodes.forEach(is), this.nodes.forEach(as), this.nodes.forEach(Jo), this.nodes.forEach(Yo)) : this.nodes.forEach(ts), this.clearAllSnapshots();
			let e = G.now();
			U.delta = E(0, 1e3 / 60, e - U.timestamp), U.timestamp = e, U.isProcessing = !0, Pt.update.process(U), Pt.preRender.process(U), Pt.render.process(U), U.isProcessing = !1;
		}
		didUpdate() {
			this.updateScheduled || (this.updateScheduled = !0, Pa.read(this.scheduleUpdate));
		}
		clearAllSnapshots() {
			this.nodes.forEach(Qo), this.sharedNodes.forEach((e, t) => e.members.length ? e.removeLeadSnapshot() : this.sharedNodes.delete(t));
		}
		scheduleUpdateProjection() {
			this.projectionUpdateScheduled || (this.projectionUpdateScheduled = !0, Mt.preRender(this.updateProjection, !1, !0));
		}
		scheduleCheckAfterUnmount() {
			Mt.postRender(() => {
				this.isLayoutDirty ? this.root.didUpdate() : this.root.checkUpdateFailed();
			});
		}
		updateSnapshot() {
			!this.snapshot && this.instance && (this.snapshot = this.measure(), this.snapshot && !ao(this.snapshot.measuredBox.x) && !ao(this.snapshot.measuredBox.y) && (this.snapshot = void 0));
		}
		updateLayout() {
			if (!this.instance || (this.updateScroll(), !(this.options.alwaysMeasureLayout && this.isLead()) && !this.isLayoutDirty)) return;
			if (this.resumeFrom && !this.resumeFrom.instance) for (let e = 0; e < this.path.length; e++) this.path[e].updateScroll();
			let e = this.layout;
			this.layout = this.measure(!1), this.layoutCorrected ||= Co(), this.isLayoutDirty = !1, this.projectionDelta = void 0, this.notifyListeners("measure", this.layout.layoutBox);
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
			e && Go(this);
			let t = this.projectionDelta && !To(this.projectionDelta), n = this.getTransformTemplate(), r = n ? n(this.latestValues, "") : void 0, a = r !== this.prevTransformTemplateValue;
			e && this.instance && (t || va(this.latestValues) || a) && (i(this.instance, r), this.shouldResetTransform = !1, this.scheduleRender());
		}
		measure(e = !0) {
			let t = this.measurePageBox(), n = this.removeElementScroll(t);
			return e && (n = this.removeTransform(n)), vs(n), {
				animationId: this.root.animationId,
				measuredBox: t,
				layoutBox: n,
				latestValues: {},
				source: this.id
			};
		}
		measurePageBox() {
			let { visualElement: e } = this.options;
			if (!e) return Co();
			let t = e.measureViewportBox();
			if (!(this.scroll?.wasRoot || this.path.some(bs))) {
				let { scroll: e } = this.root;
				e && (Oa(t.x, e.offset.x), Oa(t.y, e.offset.y));
			}
			return t;
		}
		removeElementScroll(e) {
			let t = Co();
			if ($a(t, e), this.scroll?.wasRoot) return t;
			for (let n = 0; n < this.path.length; n++) {
				let r = this.path[n], { scroll: i, options: a } = r;
				r !== this.root && i && a.layoutScroll && (i.wasRoot && $a(t, e), Oa(t.x, i.offset.x), Oa(t.y, i.offset.y));
			}
			return t;
		}
		applyTransform(e, t = !1, n, r) {
			let i = n || Co();
			$a(i, e);
			for (let e = 0; e < this.path.length; e++) {
				let n = this.path[e];
				!t && n.options.layoutScroll && n.scroll && n !== n.root && (Oa(i.x, -n.scroll.offset.x), Oa(i.y, -n.scroll.offset.y)), va(n.latestValues) && ja(i, n.latestValues, n.layout?.layoutBox);
			}
			return !r && va(this.latestValues) && ja(i, this.latestValues, this.layout?.layoutBox), i;
		}
		removeTransform(e) {
			let t = Co();
			$a(t, e);
			for (let e = 0; e < this.path.length; e++) {
				let n = this.path[e];
				if (!va(n.latestValues)) continue;
				let r;
				n.instance && (_a(n.latestValues) && n.updateSnapshot(), r = Co(), $a(r, n.measurePageBox())), yo(t, n.latestValues, n.snapshot?.layoutBox, r);
			}
			return va(this.latestValues) && yo(t, this.latestValues), t;
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
			this.relativeParent && this.relativeParent.resolvedRelativeTargetAt !== U.timestamp && this.relativeParent.resolveTargetDelta(!0);
		}
		resolveTargetDelta(e = !1) {
			let t = this.getLead();
			this.isProjectionDirty ||= t.isProjectionDirty, this.isTransformDirty ||= t.isTransformDirty, this.isSharedProjectionDirty ||= t.isSharedProjectionDirty;
			let n = !!this.resumingFrom || this !== t;
			if (!(e || n && this.isSharedProjectionDirty || this.isProjectionDirty || this.parent?.isProjectionDirty || this.attemptToResolveRelativeTarget || this.root.updateBlockedByResize)) return;
			let { layout: r, layoutId: i } = this.options;
			if (!this.layout || !(r || i)) return;
			this.resolvedRelativeTargetAt = U.timestamp;
			let a = this.getClosestProjectingParent();
			!this.targetDelta && !this.relativeTarget && (this.options.layoutAnchor !== !1 && a && a.layout ? this.createRelativeTarget(a, this.layout.layoutBox, a.layout.layoutBox) : this.removeRelativeTarget()), (this.relativeTarget || this.targetDelta) && (this.target || (this.target = Co(), this.targetWithTransforms = Co()), this.relativeTarget && this.relativeTargetOrigin && this.relativeParent && this.relativeParent.target ? (this.forceRelativeParentToResolveTarget(), uo(this.target, this.relativeTarget, this.relativeParent.target, this.options.layoutAnchor || void 0)) : this.targetDelta ? (this.resumingFrom ? this.applyTransform(this.layout.layoutBox, !1, this.target, !0) : $a(this.target, this.layout.layoutBox), wa(this.target, this.targetDelta)) : $a(this.target, this.layout.layoutBox), this.attemptToResolveRelativeTarget && (this.attemptToResolveRelativeTarget = !1, this.options.layoutAnchor !== !1 && a && !!a.resumingFrom == !!this.resumingFrom && !a.options.layoutScroll && a.target && this.animationProgress !== 1 ? this.createRelativeTarget(a, this.target, a.target) : this.relativeParent = this.relativeTarget = void 0), Ra.value && Bo.calculatedTargetDeltas++);
		}
		getClosestProjectingParent() {
			if (!(!this.parent || _a(this.parent.latestValues) || ya(this.parent.latestValues))) return this.parent.isProjecting() ? this.parent : this.parent.getClosestProjectingParent();
		}
		isProjecting() {
			return !!((this.relativeTarget || this.targetDelta || this.options.layoutRoot) && this.layout);
		}
		createRelativeTarget(e, t, n) {
			this.relativeParent = e, this.forceRelativeParentToResolveTarget(), this.relativeTarget = Co(), this.relativeTargetOrigin = Co(), po(this.relativeTargetOrigin, t, n, this.options.layoutAnchor || void 0), $a(this.relativeTarget, this.relativeTargetOrigin);
		}
		removeRelativeTarget() {
			this.relativeParent = this.relativeTarget = void 0;
		}
		calcProjection() {
			let e = this.getLead(), t = !!this.resumingFrom || this !== e, n = !0;
			if ((this.isProjectionDirty || this.parent?.isProjectionDirty) && (n = !1), t && (this.isSharedProjectionDirty || this.isTransformDirty) && (n = !1), this.resolvedRelativeTargetAt === U.timestamp && (n = !1), n) return;
			let { layout: r, layoutId: i } = this.options;
			if (this.isTreeAnimating = !!(this.parent && this.parent.isTreeAnimating || this.currentAnimation || this.pendingAnimation), this.isTreeAnimating || (this.targetDelta = this.relativeTarget = void 0), !this.layout || !(r || i)) return;
			$a(this.layoutCorrected, this.layout.layoutBox);
			let a = this.treeScale.x, o = this.treeScale.y;
			Da(this.layoutCorrected, this.treeScale, this.path, t), e.layout && !e.target && (this.treeScale.x !== 1 || this.treeScale.y !== 1) && (e.target = e.layout.layoutBox, e.targetWithTransforms = Co());
			let { target: s } = e;
			s ? (!this.projectionDelta || !this.prevProjectionDelta ? this.createProjectionDeltas() : (eo(this.prevProjectionDelta.x, this.projectionDelta.x), eo(this.prevProjectionDelta.y, this.projectionDelta.y)), co(this.projectionDelta, this.layoutCorrected, s, this.latestValues), this.treeScale.x === a && this.treeScale.y === o && jo(this.projectionDelta.x, this.prevProjectionDelta.x) && jo(this.projectionDelta.y, this.prevProjectionDelta.y) || (this.hasProjected = !0, this.scheduleRender(), this.notifyListeners("projectionUpdate", s)), Ra.value && Bo.calculatedProjections++) : this.prevProjectionDelta && (this.createProjectionDeltas(), this.scheduleRender());
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
			this.prevProjectionDelta = xo(), this.projectionDelta = xo(), this.projectionDeltaWithTransform = xo();
		}
		setAnimationOrigin(e, t = !1, n) {
			let r = this.snapshot, i = r ? r.latestValues : {}, a = { ...this.latestValues }, o = xo();
			this.relativeParent && this.relativeParent.options.layoutRoot || (this.relativeTarget = this.relativeTargetOrigin = void 0), this.attemptToResolveRelativeTarget = !t;
			let s = Co(), c = (r ? r.source : void 0) !== (this.layout ? this.layout.source : void 0), l = this.getStack(), u = !l || l.members.length <= 1, d = !(!c || u || this.options.crossfade !== !0 || this.path.some(ps));
			this.animationProgress = 0;
			let f, p = n?.interpolateProjection(e);
			this.mixTargetDelta = (t) => {
				let n = t / 1e3, r = p?.(n);
				r ? (o.x.translate = r.x, o.x.scale = dt(e.x.scale, 1, n), o.x.origin = e.x.origin, o.x.originPoint = e.x.originPoint, o.y.translate = r.y, o.y.scale = dt(e.y.scale, 1, n), o.y.origin = e.y.origin, o.y.originPoint = e.y.originPoint) : (us(o.x, e.x, n), us(o.y, e.y, n)), this.setTargetDelta(o), this.relativeTarget && this.relativeTargetOrigin && this.layout && this.relativeParent && this.relativeParent.layout && (po(s, this.layout.layoutBox, this.relativeParent.layout.layoutBox, this.options.layoutAnchor || void 0), fs(this.relativeTarget, this.relativeTargetOrigin, s, n), f && Do(this.relativeTarget, f) && (this.isProjectionDirty = !1), f ||= Co(), $a(f, this.relativeTarget)), c && (this.animationValues = a, qa(a, i, this.latestValues, n, d, u)), r && r.rotate !== void 0 && (this.animationValues ||= a, this.animationValues.pathRotation = r.rotate), this.root.scheduleUpdateProjection(), this.scheduleRender(), this.animationProgress = n;
			}, this.mixTargetDelta(this.options.layoutRoot ? 1e3 : 0);
		}
		startAnimation(e) {
			this.notifyListeners("animationStart"), this.currentAnimation?.stop(), this.resumingFrom?.currentAnimation?.stop(), this.pendingAnimation &&= (Nt(this.pendingAnimation), void 0), this.pendingAnimation = Mt.update(() => {
				zo.hasAnimatedSinceResize = !0, this.motionValue ||= pi(0), this.motionValue.jump(0, !1), this.currentAnimation = Ia(this.motionValue, [0, 1e3], {
					...e,
					velocity: 0,
					isSync: !0,
					onUpdate: (t) => {
						this.mixTargetDelta(t), e.onUpdate && e.onUpdate(t);
					},
					onComplete: () => {
						e.onComplete && e.onComplete(), this.completeAnimation();
					}
				}), yn(this.currentAnimation, this), this.resumingFrom && (this.resumingFrom.currentAnimation = this.currentAnimation), this.pendingAnimation = void 0;
			});
		}
		completeAnimation() {
			this.resumingFrom && (this.resumingFrom.currentAnimation = void 0, this.resumingFrom.preserveOpacity = void 0);
			let e = this.getStack();
			e && e.exitAnimationComplete(), this.resumingFrom = this.currentAnimation = this.animationValues = void 0, this.notifyListeners("animationComplete");
		}
		finishAnimation() {
			this.currentAnimation && (this.mixTargetDelta && this.mixTargetDelta(Ho), this.currentAnimation.stop()), this.completeAnimation();
		}
		applyTransformsToTarget() {
			let e = this.getLead(), { targetWithTransforms: t, layout: n, latestValues: r } = e, { target: i } = e;
			if (t && i && n) {
				if (this !== e && this.layout && n && ys(this.options.animationType, this.layout.layoutBox, n.layoutBox)) {
					i = this.target || Co();
					let t = ao(this.layout.layoutBox.x);
					i.x.min = e.target.x.min, i.x.max = i.x.min + t;
					let n = ao(this.layout.layoutBox.y);
					i.y.min = e.target.y.min, i.y.max = i.y.min + n;
				}
				$a(t, i), ja(t, r), co(this.projectionDeltaWithTransform, this.layoutCorrected, t, r);
			}
		}
		registerSharedNode(e, t) {
			this.sharedNodes.has(e) || this.sharedNodes.set(e, new Mo()), this.sharedNodes.get(e).add(t);
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
			n.z && Wo("z", e, r, this.animationValues);
			for (let t = 0; t < Vo.length; t++) Wo(`rotate${Vo[t]}`, e, r, this.animationValues), Wo(`skew${Vo[t]}`, e, r, this.animationValues);
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
				this.needsReset = !1, e.visibility = "", e.opacity = "", e.pointerEvents = Va(t?.pointerEvents) || "", e.transform = n ? n(this.latestValues, "") : "none";
				return;
			}
			let r = this.getLead();
			if (!this.projectionDelta || !this.layout || !r.target) {
				this.options.layoutId && (e.opacity = this.latestValues.opacity === void 0 ? 1 : this.latestValues.opacity, e.pointerEvents = Va(t?.pointerEvents) || ""), this.hasProjected && !va(this.latestValues) && (e.transform = n ? n({}, "") : "none", this.hasProjected = !1);
				return;
			}
			e.visibility = "";
			let i = r.animationValues || r.latestValues;
			this.applyTransformsToTarget();
			let a = Fo(this.projectionDeltaWithTransform, this.treeScale, i);
			n && (a = n(i, a)), e.transform = a;
			let { x: o, y: s } = this.projectionDelta;
			e.transformOrigin = `${o.origin * 100}% ${s.origin * 100}% 0`, e.opacity = r.animationValues ? r === this ? i.opacity ?? this.latestValues.opacity ?? 1 : this.preserveOpacity ? this.latestValues.opacity : i.opacityExit : r === this ? i.opacity === void 0 ? "" : i.opacity : i.opacityExit === void 0 ? 0 : i.opacityExit;
			for (let t in La) {
				if (i[t] === void 0) continue;
				let { correct: n, applyTo: o, isCSSVariable: s } = La[t], c = a === "none" ? i[t] : n(i[t], r);
				if (o) {
					let t = o.length;
					for (let n = 0; n < t; n++) e[o[n]] = c;
				} else s ? this.options.visualElement.renderState.vars[t] = c : e[t] = c;
			}
			this.options.layoutId && (e.pointerEvents = r === this ? Va(t?.pointerEvents) || "" : "none");
		}
		clearSnapshot() {
			this.resumeFrom = this.snapshot = this.dragSnapshot = this.dragAncestor = void 0;
		}
		resetTree() {
			this.root.nodes.forEach((e) => e.currentAnimation?.stop()), this.root.nodes.forEach($o), this.root.sharedNodes.clear();
		}
	};
}
function Jo(e) {
	e.updateLayout(), ns(e);
}
function Yo(e) {
	let t = e.resumeFrom?.snapshot || e.snapshot;
	if (e.isLead() && e.layout && t && e.hasListeners("didUpdate")) {
		let { layoutBox: n, measuredBox: r } = e.layout, { animationType: i } = e.options, a = t.source !== e.layout.source;
		if (i === "size") Io((e) => {
			let r = a ? t.measuredBox[e] : t.layoutBox[e], i = ao(r);
			r.min = n[e].min, r.max = r.min + i;
		});
		else if (i === "x" || i === "y") {
			let e = i === "x" ? "y" : "x";
			Qa(a ? t.measuredBox[e] : t.layoutBox[e], n[e]);
		} else ys(i, t.layoutBox, n) && Io((r) => {
			let i = a ? t.measuredBox[r] : t.layoutBox[r], o = ao(n[r]);
			i.max = i.min + o, e.relativeTarget && !e.currentAnimation && (e.isProjectionDirty = !0, e.relativeTarget[r].max = e.relativeTarget[r].min + o);
		});
		let o = xo();
		co(o, n, t.layoutBox);
		let s = xo();
		a ? co(s, e.applyTransform(r, !0), t.measuredBox) : co(s, n, t.layoutBox);
		let c = !To(o), l = !1;
		if (!e.resumeFrom) {
			let r = e.getClosestProjectingParent();
			if (r && !r.resumeFrom) {
				let { snapshot: i, layout: a } = r;
				if (i && a) {
					let o = e.options.layoutAnchor || void 0, s = Co();
					po(s, t.layoutBox, i.layoutBox, o);
					let c = Co();
					po(c, n, a.layoutBox, o), ko(s, c) || (l = !0), r.options.layoutRoot && (e.relativeTarget = c, e.relativeTargetOrigin = s, e.relativeParent = r);
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
function Xo(e) {
	Ra.value && Bo.nodes++, e.parent && (e.isProjecting() || (e.isProjectionDirty = e.parent.isProjectionDirty), e.isSharedProjectionDirty ||= !!(e.isProjectionDirty || e.parent.isProjectionDirty || e.parent.isSharedProjectionDirty), e.isTransformDirty ||= e.parent.isTransformDirty);
}
function Zo(e) {
	e.isProjectionDirty = e.isSharedProjectionDirty = e.isTransformDirty = !1;
}
function Qo(e) {
	e.clearSnapshot();
}
function $o(e) {
	e.clearMeasurements();
}
function es(e) {
	e.isLayoutDirty = !0, e.updateLayout();
}
function ts(e) {
	e.isLayoutDirty = !1;
}
function ns(e) {
	let { snapshot: t, dragAncestor: n } = e, r = n?.isAnimationBlocked && n.layout;
	if (!t || !r || e.resumeFrom || e.isAnimationBlocked) return;
	let i = n.dragSnapshot;
	Io((e) => Oa(t.layoutBox[e], r.layoutBox[e].min - i.layoutBox[e].min));
}
function rs(e) {
	e.isAnimationBlocked && e.layout && !e.isLayoutDirty && (e.snapshot = e.dragSnapshot || e.layout, e.isLayoutDirty = !0);
}
function is(e) {
	e.relativeTarget && e.relativeParent?.isLayoutDirty && (e.currentAnimation ? e.isLayoutDirty = !0 : (e.targetDelta = void 0, e.removeRelativeTarget()));
}
function as(e) {
	let { visualElement: t } = e.options;
	t && t.getProps().onBeforeLayoutMeasure && t.notify("BeforeLayoutMeasure"), e.resetTransform();
}
function os(e) {
	e.finishAnimation(), e.targetDelta = e.relativeTarget = e.target = void 0, e.isProjectionDirty = !0;
}
function ss(e) {
	e.resolveTargetDelta();
}
function cs(e) {
	e.calcProjection();
}
function ls(e) {
	e.resetSkewAndRotation();
}
function us(e, t, n) {
	e.translate = dt(t.translate, 0, n), e.scale = dt(t.scale, 1, n), e.origin = t.origin, e.originPoint = t.originPoint;
}
function ds(e, t, n, r) {
	e.min = dt(t.min, n.min, r), e.max = dt(t.max, n.max, r);
}
function fs(e, t, n, r) {
	ds(e.x, t.x, n.x, r), ds(e.y, t.y, n.y, r);
}
function ps(e) {
	return e.animationValues && e.animationValues.opacityExit !== void 0;
}
var ms = {
	duration: .45,
	ease: [
		.4,
		0,
		.1,
		1
	]
}, hs = (e) => typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().includes(e), gs = hs("applewebkit/") && !hs("chrome/") ? Math.round : M;
function _s(e) {
	e.min = gs(e.min), e.max = gs(e.max);
}
function vs(e) {
	_s(e.x), _s(e.y);
}
function ys(e, t, n) {
	return e === "position" || e === "preserve-aspect" && !oo(Ao(t), Ao(n), .2);
}
function bs(e) {
	return e !== e.root && e.scroll?.wasRoot;
}
// node_modules/motion-dom/dist/es/events/add-dom-event.mjs
function xs(e, t, n, r = { passive: !0 }) {
	return e.addEventListener(t, n, r), () => e.removeEventListener(t, n, r);
}
// node_modules/motion-dom/dist/es/projection/node/DocumentProjectionNode.mjs
var Ss = /* @__PURE__ */ qo({
	attachResizeListener: (e, t) => xs(e, "resize", t),
	measureScroll: () => ({
		x: document.documentElement.scrollLeft || document.body?.scrollLeft || 0,
		y: document.documentElement.scrollTop || document.body?.scrollTop || 0
	}),
	checkIsScrollRoot: () => !0
}), Cs = { current: void 0 }, ws = /* @__PURE__ */ qo({
	measureScroll: (e) => ({
		x: e.scrollLeft,
		y: e.scrollTop
	}),
	defaultParent: () => {
		if (!Cs.current) {
			let e = new Ss({});
			e.mount(window), e.setOptions({ layoutScroll: !0 }), Cs.current = e;
		}
		return Cs.current;
	},
	resetTransform: (e, t) => {
		e.style.transform = t === void 0 ? "none" : t;
	},
	checkIsScrollRoot: (e) => window.getComputedStyle(e).position === "fixed"
}), Ts = /* @__PURE__ */ new WeakMap();
// node_modules/motion-dom/dist/es/render/utils/is-animation-controls.mjs
function Es(e) {
	return typeof e == "object" && !!e && typeof e.start == "function";
}
// node_modules/motion-dom/dist/es/render/utils/is-variant-label.mjs
function Ds(e) {
	return typeof e == "string" || Array.isArray(e);
}
// node_modules/motion-dom/dist/es/render/utils/variant-props.mjs
var Os = [
	"animate",
	"whileInView",
	"whileFocus",
	"whileHover",
	"whileTap",
	"whileDrag",
	"exit"
], ks = /* @__PURE__ */ ["initial"].concat(Os);
// node_modules/motion-dom/dist/es/render/utils/is-controlling-variants.mjs
function As(e) {
	if (Es(e.animate)) return !0;
	for (let t = 0; t < ks.length; t++) if (Ds(e[ks[t]])) return !0;
	return !1;
}
function js(e) {
	return !!(As(e) || e.variants);
}
// node_modules/motion-dom/dist/es/render/utils/motion-values.mjs
function Ms(e, t, n) {
	for (let r in t) {
		let i = t[r], a = n[r];
		if (Ii(i)) e.addValue(r, i);
		else if (Ii(a)) e.addValue(r, pi(i, { owner: e }));
		else if (a !== i) {
			if (e.hasValue(r)) {
				let t = e.getValue(r);
				t.liveStyle === !0 ? t.jump(i) : t.hasAnimated || t.set(i);
			} else {
				let t = e.getStaticValue(r);
				e.addValue(r, pi(t === void 0 ? i : t, { owner: e }));
			}
		}
	}
	for (let r in n) t[r] === void 0 && e.removeValue(r);
	return t;
}
// node_modules/motion-dom/dist/es/render/utils/reduced-motion/state.mjs
var Ns = { current: null }, Ps = { current: !1 }, Fs = typeof window < "u";
function Is() {
	if (Ps.current = !0, Fs) {
		if (window.matchMedia) {
			let e = window.matchMedia("(prefers-reduced-motion)"), t = () => Ns.current = e.matches;
			e.addEventListener("change", t), t();
		} else Ns.current = !1;
	}
}
// node_modules/motion-dom/dist/es/render/VisualElement.mjs
var Ls = [
	"AnimationStart",
	"AnimationComplete",
	"Update",
	"BeforeLayoutMeasure",
	"LayoutMeasure",
	"LayoutAnimationStart",
	"LayoutAnimationComplete"
], Rs = {};
function zs(e) {
	Rs = e;
}
function Bs() {
	return Rs;
}
var Vs = class {
	scrapeMotionValuesFromProps(e, t, n) {
		return {};
	}
	constructor({ parent: e, props: t, presenceContext: n, reducedMotionConfig: r, skipAnimations: i, blockInitialAnimation: a, visualState: o }, s = {}) {
		this.current = null, this.children = /* @__PURE__ */ new Set(), this.isVariantNode = !1, this.isControllingVariants = !1, this.shouldReduceMotion = null, this.shouldSkipAnimations = !1, this.values = /* @__PURE__ */ new Map(), this.KeyframeResolver = pr, this.features = {}, this.valueSubscriptions = /* @__PURE__ */ new Map(), this.prevMotionValues = {}, this.hasBeenMounted = !1, this.events = {}, this.propEventSubscriptions = {}, this.notifyUpdate = () => this.notify("Update", this.latestValues), this.render = () => {
			this.current && (this.triggerBuild(), this.renderInstance(this.current, this.renderState, this.props.style, this.projection));
		}, this.renderScheduledAt = 0, this.scheduleRender = () => {
			let e = G.now();
			this.renderScheduledAt < e && (this.renderScheduledAt = e, Mt.render(this.render, !1, !0));
		};
		let { latestValues: c, renderState: l } = o;
		this.latestValues = c, this.baseTarget = { ...c }, this.initialValues = t.initial ? { ...c } : {}, this.renderState = l, this.parent = e, this.props = t, this.presenceContext = n, this.depth = e ? e.depth + 1 : 0, this.reducedMotionConfig = r, this.skipAnimationsConfig = i, this.options = s, this.blockInitialAnimation = !!a, this.isControllingVariants = As(t), this.isVariantNode = js(t), this.isVariantNode && (this.variantChildren = /* @__PURE__ */ new Set()), this.manuallyAnimateOnMount = !!(e && e.current);
		let { willChange: u, ...d } = this.scrapeMotionValuesFromProps(t, {}, this);
		for (let e in d) {
			let t = d[e];
			c[e] !== void 0 && Ii(t) && t.set(c[e]);
		}
	}
	mount(e) {
		if (this.hasBeenMounted) for (let e in this.initialValues) this.values.get(e)?.jump(this.initialValues[e]), this.latestValues[e] = this.initialValues[e];
		if (this.current = e, Ts.set(e, this), this.projection && !this.projection.instance && this.projection.mount(e), this.isVariantNode && !this.isControllingVariants) {
			let e = this;
			do
				e = e.props.inherit !== !1 && e.parent;
			while (e && !e.isVariantNode);
			if (e) {
				let { variantChildren: t } = e;
				t.add(this), this.removeFromVariantTree = () => t.delete(this);
			}
		}
		this.values.forEach((e, t) => this.bindToMotionValue(t, e)), this.reducedMotionConfig === "never" ? this.shouldReduceMotion = !1 : this.reducedMotionConfig === "always" ? this.shouldReduceMotion = !0 : (Ps.current || Is(), this.shouldReduceMotion = Ns.current), this.shouldSkipAnimations = this.skipAnimationsConfig ?? !1, this.parent?.addChild(this), this.update(this.props, this.presenceContext), this.hasBeenMounted = !0;
	}
	unmount() {
		this.projection && this.projection.unmount(), Nt(this.notifyUpdate), Nt(this.render), this.valueSubscriptions.forEach((e) => e()), this.valueSubscriptions.clear(), this.removeFromVariantTree && this.removeFromVariantTree(), this.parent?.removeChild(this);
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
		if (this.valueSubscriptions.has(e) && this.valueSubscriptions.get(e)(), t.accelerate && Fr.has(e) && this.current instanceof HTMLElement) {
			let { factory: n, keyframes: r, times: i, ease: a, duration: o } = t.accelerate, s = new Er({
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
		let n = Yn.has(e);
		n && this.onBindTransform && this.onBindTransform();
		let r = t.on("change", (t) => {
			this.latestValues[e] = t, this.props.onUpdate && Mt.preRender(this.notifyUpdate), n && (this.projection && (this.projection.isTransformDirty = !0), Gr.get(this.current)?.check()), this.scheduleRender();
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
		for (e in Rs) {
			let t = Rs[e];
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
		return this.current ? this.measureInstanceViewportBox(this.current, this.props) : Co();
	}
	getStaticValue(e) {
		return this.latestValues[e];
	}
	setStaticValue(e, t) {
		this.latestValues[e] = t;
	}
	update(e, t) {
		let { transformTemplate: n, onUpdate: r } = this.props;
		(e.transformTemplate || n) && this.scheduleRender(), (e.transformTemplate && !n || e.onUpdate && !r) && Gr.get(this.current)?.demote(), this.prevProps = this.props, this.props = e, this.prevPresenceContext = this.presenceContext, this.presenceContext = t;
		for (let t = 0; t < Ls.length; t++) {
			let n = Ls[t];
			this.propEventSubscriptions[n] && (this.propEventSubscriptions[n](), delete this.propEventSubscriptions[n]);
			let r = e["on" + n];
			r && (this.propEventSubscriptions[n] = this.on(n, r));
		}
		this.prevMotionValues = Ms(this, this.scrapeMotionValuesFromProps(e, this.prevProps || {}, this), this.prevMotionValues), this.handleChildMotionValue && this.handleChildMotionValue();
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
		return n === void 0 && t !== void 0 && (n = pi(t ?? this.getDefaultValue?.(e), { owner: this }), this.addValue(e, n)), n;
	}
	readValue(e, t) {
		let n = this.latestValues[e] !== void 0 || !this.current ? this.latestValues[e] : this.getBaseTargetFromProps(this.props, e) ?? this.readValueFromInstance(this.current, e, this.options);
		return n != null && (typeof n == "string" && (O(n) || A(n)) ? n = parseFloat(n) : typeof n != "number" && !st.test(n) && st.test(t) && (n = Pn(e, t)), this.setBaseTarget(e, Ii(n) ? n.get() : n)), Ii(n) ? n.get() : n;
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
		Pa.render(this.render);
	}
}, Hs = class extends Vs {
	constructor() {
		super(...arguments), this.KeyframeResolver = Qi;
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
		Ii(e) && (this.childSubscription = e.on("change", (e) => {
			this.current && (this.current.textContent = `${e}`);
		}));
	}
};
// node_modules/motion-dom/dist/es/render/html/utils/render.mjs
function Us(e, { style: t, vars: n }, r, i) {
	let a = e.style, o;
	for (o in t) a[o] = t[o];
	for (o in i?.applyProjectionStyles(a, r), n) a.setProperty(o, n[o]);
}
// node_modules/motion-dom/dist/es/render/utils/is-forced-motion-value.mjs
function Ws(e, { layout: t, layoutId: n }) {
	return Yn.has(e) || e.startsWith("origin") || (t || n !== void 0) && (!!La[e] || e === "opacity");
}
// node_modules/motion-dom/dist/es/render/html/utils/scrape-motion-values.mjs
function Gs(e, t, n) {
	let r = e.style, i = t?.style, a = {};
	if (!r) return a;
	for (let t in r) (Ii(r[t]) || i && Ii(i[t]) || Ws(t, e) || n?.getValue(t)?.liveStyle !== void 0) && (a[t] = r[t]);
	return a;
}
// node_modules/motion-dom/dist/es/render/html/HTMLVisualElement.mjs
function Ks(e) {
	return window.getComputedStyle(e);
}
var qs = class extends Hs {
	constructor() {
		super(...arguments), this.type = "html", this.renderInstance = Us;
	}
	mount(e) {
		e.style, super.mount(e);
	}
	readValueFromInstance(e, t) {
		if (Yn.has(t)) return this.projection?.isProjecting ? Wn(t) : Kn(e, t);
		{
			let n = Ks(e), r = (_e(t) ? n.getPropertyValue(t) : n[t]) || 0;
			return typeof r == "string" ? r.trim() : r;
		}
	}
	measureInstanceViewportBox(e, { transformPagePoint: t }) {
		return Ma(e, t);
	}
	build(e, t, n) {
		sa(e, t, n.transformTemplate);
	}
	scrapeMotionValuesFromProps(e, t, n) {
		return Gs(e, t, n);
	}
}, Js = (e) => e.pointerType === "mouse" ? typeof e.button != "number" || e.button <= 0 : e.isPrimary !== !1;
// node_modules/motion-dom/dist/es/events/event-info.mjs
function Ys(e) {
	return { point: {
		x: e.pageX,
		y: e.pageY
	} };
}
var Xs = (e) => (t) => Js(t) && e(t, Ys(t));
// node_modules/motion-dom/dist/es/events/add-pointer-event.mjs
function Zs(e, t, n, r) {
	return xs(e, t, Xs(n), r);
}
// node_modules/motion-dom/dist/es/resize/handle-element.mjs
var Qs = /* @__PURE__ */ new WeakMap(), $s, ec = (e, t, n) => (r, i) => i && i[0] ? i[0][e + "Size"] : ta(r) && "getBBox" in r ? r.getBBox()[t] : r[n], tc = /*@__PURE__*/ ec("inline", "width", "offsetWidth"), nc = /*@__PURE__*/ ec("block", "height", "offsetHeight");
function rc({ target: e, borderBoxSize: t }) {
	Qs.get(e)?.forEach((n) => {
		n(e, {
			get width() {
				return tc(e, t);
			},
			get height() {
				return nc(e, t);
			}
		});
	});
}
function ic(e) {
	e.forEach(rc);
}
function ac() {
	typeof ResizeObserver < "u" && ($s = new ResizeObserver(ic));
}
function oc(e, t) {
	$s || ac();
	let n = aa(e);
	return n.forEach((e) => {
		let n = Qs.get(e);
		n || (n = /* @__PURE__ */ new Set(), Qs.set(e, n)), n.add(t), $s?.observe(e);
	}), () => {
		n.forEach((e) => {
			let n = Qs.get(e);
			n?.delete(t), n?.size || $s?.unobserve(e);
		});
	};
}
// node_modules/motion-dom/dist/es/resize/handle-window.mjs
var sc = /* @__PURE__ */ new Set(), cc;
function lc() {
	cc = () => {
		let e = {
			get width() {
				return window.innerWidth;
			},
			get height() {
				return window.innerHeight;
			}
		};
		sc.forEach((t) => t(e));
	}, window.addEventListener("resize", cc);
}
function uc(e) {
	return sc.add(e), cc || lc(), () => {
		sc.delete(e), !sc.size && typeof cc == "function" && (window.removeEventListener("resize", cc), cc = void 0);
	};
}
// node_modules/motion-dom/dist/es/resize/index.mjs
function dc(e, t) {
	return ra(typeof e == "function" ? uc(e) : oc(e, t));
}
// node_modules/motion-dom/dist/es/utils/distance.mjs
var fc = (e, t) => Math.abs(e - t);
function pc(e, t) {
	let n = fc(e.x, t.x), r = fc(e.y, t.y);
	return Math.sqrt(n ** 2 + r ** 2);
}
// node_modules/motion-dom/dist/es/gestures/pan/PanSession.mjs
var mc = /*#__PURE__*/ new Set(["auto", "scroll"]), hc = class {
	constructor(e, t, { transformPagePoint: n, contextWindow: r = window, dragSnapToOrigin: i = !1, distanceThreshold: a = 3, element: o } = {}) {
		if (this.startEvent = null, this.lastMoveEvent = null, this.lastMoveEventInfo = null, this.lastRawMoveEventInfo = null, this.handlers = {}, this.contextWindow = window, this.scrollPositions = /* @__PURE__ */ new Map(), this.removeScrollListeners = null, this.onElementScroll = (e) => {
			this.handleScroll(e.target);
		}, this.onWindowScroll = () => {
			this.handleScroll(window);
		}, this.updatePoint = () => {
			if (!(this.lastMoveEvent && this.lastMoveEventInfo)) return;
			this.hasPendingMove = !1, this.lastRawMoveEventInfo && (this.lastMoveEventInfo = gc(this.lastRawMoveEventInfo, this.transformPagePoint));
			let e = vc(this.lastMoveEventInfo, this.history), t = this.startEvent !== null, n = pc(e.offset, {
				x: 0,
				y: 0
			}) >= this.distanceThreshold;
			if (!t && !n) return;
			let { point: r } = e;
			this.history.push({
				...r,
				timestamp: G.now()
			});
			let { onStart: i, onMove: a } = this.handlers;
			t || (i && i(this.lastMoveEvent, e), this.startEvent = this.lastMoveEvent), a && a(this.lastMoveEvent, e);
		}, this.handlePointerMove = (e, t) => {
			this.handleScroll(window), this.lastMoveEvent = e, this.lastRawMoveEventInfo = t, this.lastMoveEventInfo = gc(t, this.transformPagePoint), this.hasPendingMove = !0, Mt.update(this.updatePoint, !0);
		}, this.handlePointerUp = (e, t) => {
			this.hasPendingMove && this.updatePoint(), this.end();
			let { onEnd: n, onSessionEnd: r, resumeAnimation: i } = this.handlers;
			if ((this.dragSnapToOrigin || !this.startEvent) && i && i(), !(this.lastMoveEvent && this.lastMoveEventInfo)) return;
			let a = vc(e.type === "pointercancel" ? this.lastMoveEventInfo : gc(t, this.transformPagePoint), this.history);
			this.startEvent && n && n(e, a), r && r(e, a);
		}, !Js(e)) return;
		this.dragSnapToOrigin = i, this.handlers = t, this.transformPagePoint = n, this.distanceThreshold = a, this.contextWindow = r || window;
		let s = gc(Ys(e), this.transformPagePoint), { point: c } = s, { timestamp: l } = U;
		this.history = [{
			...c,
			timestamp: l
		}];
		let { onSessionStart: u } = t;
		u && u(e, vc(s, this.history));
		let d = {
			passive: !0,
			capture: !0
		};
		this.removeListeners = N(Zs(this.contextWindow, "pointermove", this.handlePointerMove, d), Zs(this.contextWindow, "pointerup", this.handlePointerUp, d), Zs(this.contextWindow, "pointercancel", this.handlePointerUp, d)), o && this.startScrollTracking(o);
	}
	startScrollTracking(e) {
		let t = e.parentElement;
		for (; t;) {
			let e = getComputedStyle(t);
			(mc.has(e.overflowX) || mc.has(e.overflowY)) && this.scrollPositions.set(t, {
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
		(i.x !== 0 || i.y !== 0) && (n ? this.lastMoveEventInfo && (this.lastMoveEventInfo.point.x += i.x, this.lastMoveEventInfo.point.y += i.y) : this.history.length > 0 && (this.history[0].x -= i.x, this.history[0].y -= i.y), this.scrollPositions.set(e, r), Mt.update(this.updatePoint, !0));
	}
	updateHandlers(e) {
		this.handlers = e;
	}
	end() {
		this.removeListeners && this.removeListeners(), this.removeScrollListeners && this.removeScrollListeners(), this.scrollPositions.clear(), Nt(this.updatePoint);
	}
};
function gc(e, t) {
	return t ? { point: t(e.point) } : e;
}
function _c(e, t) {
	return {
		x: e.x - t.x,
		y: e.y - t.y
	};
}
function vc({ point: e }, t) {
	return {
		point: e,
		delta: _c(e, bc(t)),
		offset: _c(e, yc(t)),
		velocity: xc(t, .1)
	};
}
function yc(e) {
	return e[0];
}
function bc(e) {
	return e[e.length - 1];
}
function xc(e, t) {
	if (e.length < 2) return {
		x: 0,
		y: 0
	};
	let n = e.length - 1, r = null, i = bc(e);
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
var Sc = /* @__PURE__ */ new Set([
	"BUTTON",
	"INPUT",
	"SELECT",
	"TEXTAREA",
	"A"
]);
function Cc(e) {
	return Sc.has(e.tagName) || e.isContentEditable === !0;
}
var wc = /* @__PURE__ */ new Set([
	"INPUT",
	"SELECT",
	"TEXTAREA"
]);
function Tc(e) {
	return wc.has(e.tagName) || e.isContentEditable === !0;
}
// node_modules/motion-dom/dist/es/gestures/drag/state/is-active.mjs
var Ec = {
	x: !1,
	y: !1
};
function Dc() {
	return Ec.x || Ec.y;
}
// node_modules/motion-dom/dist/es/gestures/drag/state/set-active.mjs
function Oc(e) {
	return e === "x" || e === "y" ? Ec[e] ? null : (Ec[e] = !0, () => {
		Ec[e] = !1;
	}) : Ec.x || Ec.y ? null : (Ec.x = Ec.y = !0, () => {
		Ec.x = Ec.y = !1;
	});
}
// node_modules/motion-dom/dist/es/gestures/drag/utils/constraints.mjs
function kc(e, { min: t, max: n }, r) {
	return t !== void 0 && e < t ? e = r ? dt(t, e, r.min) : Math.max(e, t) : n !== void 0 && e > n && (e = r ? dt(n, e, r.max) : Math.min(e, n)), e;
}
function Ac(e, t, n) {
	return {
		min: t === void 0 ? void 0 : e.min + t,
		max: n === void 0 ? void 0 : e.max + n - (e.max - e.min)
	};
}
function jc(e, { top: t, left: n, bottom: r, right: i }) {
	return {
		x: Ac(e.x, n, i),
		y: Ac(e.y, t, r)
	};
}
function Mc(e, t) {
	let n = t.min - e.min, r = t.max - e.max;
	return t.max - t.min < e.max - e.min && ([n, r] = [r, n]), {
		min: n,
		max: r
	};
}
function Nc(e, t) {
	return {
		x: Mc(e.x, t.x),
		y: Mc(e.y, t.y)
	};
}
function Pc(e, t) {
	let n = .5, r = ao(e), i = ao(t);
	return i > r ? n = /* @__PURE__ */ P(t.min, t.max - r, e.min) : r > i && (n = /* @__PURE__ */ P(e.min, e.max - i, t.min)), E(0, 1, n);
}
function Fc(e, t) {
	let n = {};
	return t.min !== void 0 && (n.min = t.min - e.min), t.max !== void 0 && (n.max = t.max - e.min), n;
}
var Ic = .35;
function Lc(e = Ic) {
	return e === !1 ? e = 0 : e === !0 && (e = Ic), {
		x: Rc(e, "left", "right"),
		y: Rc(e, "top", "bottom")
	};
}
function Rc(e, t, n) {
	return {
		min: zc(e, t),
		max: zc(e, n)
	};
}
function zc(e, t) {
	return typeof e == "number" ? e : e[t] || 0;
}
// node_modules/motion-dom/dist/es/gestures/drag/VisualElementDragControls.mjs
var Bc = /* @__PURE__ */ new WeakMap(), Vc = class {
	constructor(e, t = () => e.getProps()) {
		this.openDragLock = null, this.isDragging = !1, this.currentDirection = null, this.originPoint = {
			x: 0,
			y: 0
		}, this.constraints = !1, this.hasMutatedConstraints = !1, this.elastic = Co(), this.latestPointerEvent = null, this.latestPanInfo = null, this.visualElement = e, this.readProps = t;
	}
	start(e, { snapToCursor: t = !1, distanceThreshold: n } = {}) {
		let { presenceContext: r } = this.visualElement;
		if (r && r.isPresent === !1) return;
		let i = (e) => {
			t && this.snapToCursor(e), this.stopAnimation();
		}, a = (e, t) => {
			let { drag: n, dragPropagation: r, onDragStart: i } = this.getProps();
			if (n && !r && (this.openDragLock && this.openDragLock(), this.openDragLock = Oc(n), !this.openDragLock)) return;
			this.latestPointerEvent = e, this.latestPanInfo = t, this.isDragging = !0, this.currentDirection = null, this.resolveConstraints(), this.visualElement.projection && (this.visualElement.projection.isAnimationBlocked = !0, this.visualElement.projection.target = void 0), Io((e) => {
				let t = this.getAxisMotionValue(e).get() || 0;
				if (ye(t) && (t = Ei(t, this.visualElement.current) || 0), q.test(t)) t = parseFloat(t);
				else if (Le.test(t)) {
					let { projection: n } = this.visualElement;
					if (n && n.layout) {
						let r = n.layout.layoutBox[e];
						r && (t = ao(r) * (parseFloat(t) / 100));
					}
				}
				this.originPoint[e] = t;
			}), i && Mt.update(() => i(e, t), !1, !0), Ri(this.visualElement, "transform");
			let { animationState: a } = this.visualElement;
			a && a.setActive("whileDrag", !0);
		}, o = (e, t) => {
			this.latestPointerEvent = e, this.latestPanInfo = t;
			let { dragPropagation: n, dragDirectionLock: r, onDirectionLock: i, onDrag: a } = this.getProps();
			if (!n && !this.openDragLock) return;
			let { offset: o } = t;
			if (r && this.currentDirection === null) {
				if (this.currentDirection = qc(o), this.currentDirection === null) return;
				i && i(this.currentDirection);
			}
			this.updateAxis("x", t.point, o), this.updateAxis("y", t.point, o), this.visualElement.render(), a && Mt.update(() => a(e, t), !1, !0);
		}, s = (e, t) => {
			this.latestPointerEvent = e, this.latestPanInfo = t, this.stop(e, t), this.latestPointerEvent = null, this.latestPanInfo = null;
		}, c = () => {
			let { dragSnapToOrigin: e } = this.getProps();
			(e || this.constraints) && this.startAnimation({
				x: 0,
				y: 0
			});
		}, { dragSnapToOrigin: l } = this.getProps();
		this.panSession = new hc(e, {
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
		s && Mt.postRender(() => s(r, i));
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
		if (!n || !Kc(e, r, this.currentDirection)) return;
		let i = this.getAxisMotionValue(e), a = this.originPoint[e] + n[e];
		this.constraints && this.constraints[e] && (a = kc(a, this.constraints[e], this.elastic[e])), i.set(a);
	}
	resolveConstraints() {
		let { dragConstraints: e, dragElastic: t } = this.getProps(), n = this.visualElement.projection && !this.visualElement.projection.layout ? this.visualElement.projection.measure(!1) : this.visualElement.projection?.layout, r = this.constraints;
		Hc(e) ? this.constraints ||= this.resolveRefConstraints() : this.constraints = e && n ? jc(n.layoutBox, e) : !1, this.elastic = Lc(t), r !== this.constraints && !Hc(e) && n && this.constraints && !this.hasMutatedConstraints && Io((e) => {
			this.constraints !== !1 && this.getAxisMotionValue(e) && (this.constraints[e] = Fc(n.layoutBox[e], this.constraints[e]));
		});
	}
	resolveRefConstraints() {
		let { dragConstraints: e, onMeasureDragConstraints: t } = this.getProps();
		if (!Hc(e)) return !1;
		let n = Uc(e), { projection: r } = this.visualElement;
		if (!r || !r.layout) return !1;
		r.root && (r.root.scroll = void 0, r.root.updateScroll());
		let i = Na(n, r.root, this.visualElement.getTransformPagePoint()), a = Nc(r.layout.layoutBox, i);
		if (t) {
			let e = t(ma(a));
			this.hasMutatedConstraints = !!e, e && (a = pa(e));
		}
		return a;
	}
	startAnimation(e, t) {
		let { drag: n, dragMomentum: r, dragElastic: i, dragTransition: a, dragSnapToOrigin: o, onDragTransitionEnd: s } = this.getProps(), c = this.constraints || {}, l = Io((s) => {
			if (!Kc(s, t || n, this.currentDirection)) return;
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
		return Ri(this.visualElement, e), n.start(Ci(e, n, 0, t, this.visualElement, !1));
	}
	stopAnimation() {
		Io((e) => this.getAxisMotionValue(e).stop());
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
		Io((e) => {
			if (!Kc(e, n, this.currentDirection)) return;
			let t = this.getAxisMotionValue(e), { min: r, max: o } = a[e];
			t.set((t.get() || 0) + i[e] - dt(r, o, .5));
		});
	}
	scalePositionWithinConstraints() {
		if (!this.visualElement.current) return;
		let { drag: e, dragConstraints: t } = this.getProps(), { projection: n } = this.visualElement;
		if (!Hc(t) || !n || !this.constraints) return;
		this.stopAnimation();
		let r = this.constraints, i = {
			x: 0,
			y: 0
		};
		Io((e) => {
			let t = this.getAxisMotionValue(e).get();
			i[e] = Pc({
				min: t,
				max: t
			}, r[e]);
		});
		let { transformTemplate: a } = this.visualElement.getProps();
		this.visualElement.current.style.transform = a ? a({}, "") : "none", n.root && n.root.updateScroll(), n.updateLayout(), this.constraints = !1, this.resolveConstraints(), Io((t) => {
			let n = this.getAxisMotionValue(t);
			if (!Kc(t, e, null) || !n.get()) return;
			let { min: r, max: a } = this.constraints[t];
			n.set(dt(r, a, i[t]));
		}), this.visualElement.render();
	}
	addListeners() {
		if (!this.visualElement.current) return;
		Bc.set(this.visualElement, this);
		let e = this.visualElement.current, t = Zs(e, "pointerdown", (t) => {
			let { drag: n, dragListener: r = !0 } = this.getProps(), i = t.target, a = i !== e && Tc(i);
			n && r && !a && this.start(t);
		}), n, r = () => {
			let { dragConstraints: t } = this.getProps(), r = Hc(t) && Uc(t);
			r && (this.constraints = this.resolveRefConstraints(), n ||= Gc(e, r, () => this.scalePositionWithinConstraints()));
		}, { projection: i } = this.visualElement, a = i.addEventListener("measure", r);
		i && !i.layout && (i.root && i.root.updateScroll(), i.updateLayout()), Mt.read(r);
		let o = xs(window, "resize", () => this.scalePositionWithinConstraints()), s = i.addEventListener("didUpdate", (({ delta: e, hasLayoutChanged: t }) => {
			this.isDragging && t && (Io((t) => {
				if (!Kc(t, this.getProps().drag, this.currentDirection)) return;
				let n = this.getAxisMotionValue(t);
				this.originPoint[t] += e[t].translate, n.set(n.get() + e[t].translate);
			}), this.visualElement.render());
		}));
		return () => {
			o(), t(), a(), s && s(), n && n();
		};
	}
	getProps() {
		let e = this.readProps(), { drag: t = !1, dragDirectionLock: n = !1, dragPropagation: r = !1, dragConstraints: i = !1, dragElastic: a = Ic, dragMomentum: o = !0 } = e;
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
function Hc(e) {
	return !!e && typeof e == "object" && ("current" in e || "nodeType" in e);
}
var Uc = (e) => "current" in e ? e.current : e;
function Wc(e) {
	let t = !0;
	return () => {
		t ? t = !1 : e();
	};
}
function Gc(e, t, n) {
	let r = dc(e, Wc(n)), i = dc(t, Wc(n));
	return () => {
		r(), i();
	};
}
function Kc(e, t, n) {
	return (t === !0 || t === e) && (n === null || n === e);
}
function qc(e, t = 10) {
	let n = null;
	return Math.abs(e.y) > t ? n = "y" : Math.abs(e.x) > t && (n = "x"), n;
}
// node_modules/motion-dom/dist/es/gestures/utils/setup.mjs
function Jc(e, t) {
	let n = aa(e), r = new AbortController();
	return [
		n,
		{
			passive: !0,
			...t,
			signal: r.signal
		},
		ra(() => r.abort())
	];
}
// node_modules/motion-dom/dist/es/gestures/hover.mjs
function Yc(e) {
	return !(e.pointerType === "touch" || Dc());
}
function Xc(e, t, n = {}) {
	t = ia(t);
	let [r, i, a] = Jc(e, n);
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
			if (!Yc(n)) return;
			r = !1;
			let o = t(e, n);
			typeof o == "function" && (a = o, e.addEventListener("pointerleave", u, i));
		}, i), e.addEventListener("pointerdown", l, i);
	}), a;
}
// node_modules/motion-dom/dist/es/gestures/utils/is-node-or-child.mjs
var Zc = (e, t) => t ? e === t || Zc(e, t.parentElement) : !1, Qc = /* @__PURE__ */ new WeakSet();
// node_modules/motion-dom/dist/es/gestures/press/utils/keyboard.mjs
function $c(e) {
	return (t) => {
		t.key === "Enter" && e(t);
	};
}
function el(e, t) {
	e.dispatchEvent(new PointerEvent("pointer" + t, {
		isPrimary: !0,
		bubbles: !0
	}));
}
var tl = (e, t) => {
	let n = !1, r = $c(() => {
		Qc.has(e) || (n = !0, el(e, "down"));
	}), i = $c(() => {
		n && (n = !1, el(e, "up"));
	});
	e.addEventListener("keydown", r, t), e.addEventListener("keyup", i, t), e.addEventListener("blur", () => {
		e.removeEventListener("keydown", r), e.removeEventListener("keyup", i), n && el(e, "cancel");
	}, {
		...t,
		once: !0
	});
};
// node_modules/motion-dom/dist/es/gestures/press/index.mjs
function nl(e) {
	return Js(e) && !Dc();
}
var rl = /* @__PURE__ */ new WeakSet();
function il(e, t, n = {}) {
	t = ia(t);
	let [r, i, a] = Jc(e, n), o = (e) => {
		let r = e.currentTarget;
		if (!nl(e) || rl.has(e)) return;
		Qc.add(r), n.stopPropagation && rl.add(e);
		let a = t(r, e), o = {
			...i,
			capture: !0
		}, s = (e, t) => {
			window.removeEventListener("pointerup", c, o), window.removeEventListener("pointercancel", l, o), Qc.has(r) && Qc.delete(r), nl(e) && typeof a == "function" && a(e, { success: t });
		}, c = (e) => {
			s(e, r === window || r === document || n.useGlobalTarget || Zc(r, e.target));
		}, l = (e) => {
			s(e, !1);
		};
		window.addEventListener("pointerup", c, o), window.addEventListener("pointercancel", l, o);
	};
	return r.forEach((e) => {
		(n.useGlobalTarget ? window : e).addEventListener("pointerdown", o, i), ea(e) && (e.addEventListener("focus", () => tl(e, i), i), !Cc(e) && !e.hasAttribute("tabindex") && (e.tabIndex = 0));
	}), a;
}
// node_modules/motion-dom/dist/es/render/Feature.mjs
var al = class {
	constructor(e) {
		this.isMounted = !1, this.node = e;
	}
	update() {}
}, ol = /* @__PURE__ */ new Set([
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
]), sl = (e) => typeof e == "string" && e.toLowerCase() === "svg";
// node_modules/motion-dom/dist/es/render/svg/utils/render.mjs
function cl(e, t, n, r) {
	Us(e, t, void 0, r);
	for (let n in t.attrs) e.setAttribute(ol.has(n) ? n : oa(n), t.attrs[n]);
}
// node_modules/motion-dom/dist/es/render/svg/utils/scrape-motion-values.mjs
function ll(e, t, n) {
	let r = Gs(e, t, n);
	for (let n in e) if (n !== "children" && (Ii(e[n]) || Ii(t[n]))) {
		let t = Jn.indexOf(n) === -1 ? n : "attr" + n.charAt(0).toUpperCase() + n.substring(1);
		r[t] = e[n];
	}
	return r;
}
// node_modules/motion-dom/dist/es/render/svg/SVGVisualElement.mjs
var ul = class extends Hs {
	constructor() {
		super(...arguments), this.type = "svg", this.isSVGTag = !1, this.measureInstanceViewportBox = Co;
	}
	getBaseTargetFromProps(e, t) {
		return Yn.has(t) ? super.getBaseTargetFromProps(e, t) ?? Wn(t) : e[t];
	}
	getDefaultValue(e) {
		return Yn.has(e) ? this.latestValues[e] ?? Wn(e) : void 0;
	}
	readValueFromInstance(e, t) {
		if (Yn.has(t)) {
			let e = Mn(t);
			return e && e.default || 0;
		}
		if (da.includes(t)) {
			let n = getComputedStyle(e)[t];
			if (typeof n == "string" && n) return n.trim();
		}
		return t = ol.has(t) ? t : oa(t), e.getAttribute(t);
	}
	scrapeMotionValuesFromProps(e, t, n) {
		return ll(e, t, n);
	}
	build(e, t, n) {
		fa(e, t, this.isSVGTag, n.transformTemplate, n.style);
	}
	renderInstance(e, t, n, r) {
		cl(e, t, n, r);
	}
	mount(e) {
		this.isSVGTag = sl(e.tagName), super.mount(e);
	}
};
// node_modules/motion-dom/dist/es/render/utils/shallow-compare.mjs
function dl(e, t) {
	if (!Array.isArray(t)) return !1;
	let n = t.length;
	if (n !== e.length) return !1;
	for (let r = 0; r < n; r++) if (t[r] !== e[r]) return !1;
	return !0;
}
// node_modules/motion-dom/dist/es/render/utils/animation-state.mjs
var fl = [...Os].reverse();
function pl(e) {
	let t = (t) => Promise.all(t.map(({ animation: t, options: n }) => Gi(e, t, n))), n = hl(), r = !0, i = !1;
	function a(a) {
		let { props: o, parent: s, manuallyAnimateOnMount: c } = e, l = r || i, u = [], d = /* @__PURE__ */ new Set(), f = {}, p = Infinity, m = e;
		do
			m = m.props.inherit !== !1 && m.parent;
		while (m && !m.isControllingVariants);
		if (fl.forEach((t, r) => {
			let i = n[t], h = o[t], g = m && m.props[t], _ = h === void 0 ? Ds(g) || g === !1 ? g : void 0 : h, v = Ds(_), y = t === a ? i.isActive : null;
			y === !1 && (p = r);
			let b = v && h === void 0 && !(l && c);
			if (i.protectedKeys = { ...f }, !i.isActive && y === null || !_ && !i.prevProp || Es(_) || typeof _ == "boolean") return;
			if (t === "exit" && i.isActive && y !== !0) {
				f = {
					...f,
					...i.prevResolvedValues
				};
				return;
			}
			let x = ml(i.prevProp, _), S = x || v && (y && !b || r > p), C = !1, w = Array.isArray(_) ? _ : [_], T = {};
			if (y !== !1) for (let n of w) {
				let { transition: r, transitionEnd: i, ...a } = ki(e, n, Ai(e, t)) || {};
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
				let n = T[t], r = E[t], a = Array.isArray(n) && Array.isArray(r) ? !dl(n, r) || x : n !== r;
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
					let t = ki(s, n)?.transition?.delayChildren;
					r.delay = ci(s.enteringChildren, e, t);
				}
				u.push({
					animation: n,
					options: r
				});
			}
		}), d.size) {
			let { initial: t } = o, n = {}, r = typeof t != "boolean" && ki(e, Array.isArray(t) ? t[0] : t, e.presenceContext?.custom);
			r && r.transition && (n.transition = r.transition), d.forEach((i) => {
				let a = e.getValue(i);
				a && (a.liveStyle = !0);
				let s = r && !Array.isArray(t) ? r[i] : void 0, c = e.getBaseTargetFromProps(o, i);
				n[i] = (s === void 0 ? c !== void 0 && !Ii(c) ? c : e.initialValues[i] === void 0 ? e.baseTarget[i] : void 0 : s) ?? null;
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
			n = hl(), i = !0;
		}
	};
}
function ml(e, t) {
	return typeof t == "string" ? t !== e : Array.isArray(t) ? !dl(t, e) : !1;
}
function hl() {
	let e = {};
	for (let t of Os) e[t] = {
		isActive: t === "animate",
		protectedKeys: {},
		needsAnimating: {},
		prevResolvedValues: {}
	};
	return e;
}
// node_modules/framer-motion/dist/es/context/MotionConfigContext.mjs
var gl = /* @__PURE__ */ (0, y.createContext)({
	transformPagePoint: (e) => e,
	isStatic: !1,
	reducedMotion: "never"
});
// node_modules/framer-motion/dist/es/components/AnimatePresence/use-presence.mjs
function _l(e = !0) {
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
var vl = /* @__PURE__ */ (0, y.createContext)({ strict: !1 }), yl = {
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
}, bl = !1;
function xl() {
	if (bl) return;
	let e = {};
	for (let t in yl) e[t] = { isEnabled: (e) => yl[t].some((t) => !!e[t]) };
	zs(e), bl = !0;
}
function Sl() {
	return xl(), Bs();
}
// node_modules/framer-motion/dist/es/motion/features/load-features.mjs
function Cl(e) {
	let t = Sl();
	for (let n in e) t[n] = {
		...t[n],
		...e[n]
	};
	zs(t);
}
// node_modules/framer-motion/dist/es/components/MotionConfig/index.mjs
var X = v();
function wl({ children: e, ...t }) {
	let n = (0, y.useContext)(gl);
	t = {
		...n,
		...t
	}, t.transition = mi(t.transition, n.transition), t.isStatic = x(() => t.isStatic);
	let r = (0, y.useMemo)(() => t, [
		JSON.stringify(t.transition),
		t.transformPagePoint,
		t.reducedMotion,
		t.skipAnimations,
		t.isValidProp
	]);
	return (0, X.jsx)(gl.Provider, {
		value: r,
		children: e
	});
}
// node_modules/framer-motion/dist/es/context/MotionContext/index.mjs
var Tl = /* @__PURE__ */ (0, y.createContext)({});
// node_modules/framer-motion/dist/es/context/MotionContext/utils.mjs
function El(e, t) {
	if (As(e)) {
		let { initial: t, animate: n } = e;
		return {
			initial: t === !1 || Ds(t) ? t : void 0,
			animate: Ds(n) ? n : void 0
		};
	}
	return e.inherit === !1 ? {} : t;
}
// node_modules/framer-motion/dist/es/context/MotionContext/create.mjs
function Dl(e) {
	let { initial: t, animate: n } = El(e, (0, y.useContext)(Tl));
	return (0, y.useMemo)(() => ({
		initial: t,
		animate: n
	}), [Ol(t), Ol(n)]);
}
function Ol(e) {
	return Array.isArray(e) ? e.join(" ") : e;
}
// node_modules/framer-motion/dist/es/render/html/utils/create-render-state.mjs
var kl = () => ({
	style: {},
	transform: {},
	transformOrigin: {},
	vars: {}
});
// node_modules/framer-motion/dist/es/render/html/use-props.mjs
function Al(e, t, n) {
	for (let r in t) !Ii(t[r]) && !Ws(r, n) && (e[r] = t[r]);
}
function jl({ transformTemplate: e }, t) {
	return (0, y.useMemo)(() => {
		let n = kl();
		return sa(n, t, e), Object.assign({}, n.vars, n.style);
	}, [t]);
}
function Ml(e, t) {
	let n = e.style || {}, r = {};
	return Al(r, n, e), Object.assign(r, jl(e, t)), r;
}
function Nl(e, t) {
	let n = {}, r = Ml(e, t);
	return e.drag && e.dragListener !== !1 && (n.draggable = !1, r.userSelect = r.WebkitUserSelect = r.WebkitTouchCallout = "none", r.touchAction = e.drag === !0 ? "none" : `pan-${e.drag === "x" ? "y" : "x"}`), e.tabIndex === void 0 && (e.onTap || e.onTapStart || e.whileTap) && (n.tabIndex = 0), n.style = r, n;
}
// node_modules/framer-motion/dist/es/render/svg/utils/create-render-state.mjs
var Pl = () => ({
	...kl(),
	attrs: {}
});
// node_modules/framer-motion/dist/es/render/svg/use-props.mjs
function Fl(e, t, n, r) {
	let i = (0, y.useMemo)(() => {
		let n = Pl();
		return fa(n, t, sl(r), e.transformTemplate, e.style), {
			...n.attrs,
			style: { ...n.style }
		};
	}, [t]);
	if (e.style) {
		let t = {};
		return Al(t, e.style, e), {
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
var Il = /* @__PURE__ */ new Set(/* @__PURE__ */ "animate.exit.variants.initial.style.values.transition.transformTemplate.custom.inherit.onBeforeLayoutMeasure.onAnimationStart.onAnimationComplete.onUpdate.onDragStart.onDrag.onDragEnd.onMeasureDragConstraints.onDirectionLock.onDragTransitionEnd._dragX._dragY.onHoverStart.onHoverEnd.onViewportEnter.onViewportLeave.globalTapTarget.propagate.ignoreStrict.viewport".split("."));
function Ll(e) {
	return e.startsWith("while") || e.startsWith("drag") && e !== "draggable" || e.startsWith("layout") || e.startsWith("onTap") || e.startsWith("onPan") || e.startsWith("onLayout") || Il.has(e);
}
// node_modules/framer-motion/dist/es/render/dom/utils/filter-props.mjs
function Rl(e, t) {
	return e.startsWith("on") ? !Ll(e) : t?.(e) ?? !Ll(e);
}
function zl(e, t, n, r) {
	let i = {};
	for (let a in e) a === "values" && typeof e.values == "object" || Ii(e[a]) || (Rl(a, r) || n === !0 && Ll(a) || !t && !Ll(a) || e.draggable && a.startsWith("onDrag")) && (i[a] = e[a]);
	return i;
}
// node_modules/framer-motion/dist/es/render/svg/lowercase-elements.mjs
var Bl = [
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
function Vl(e) {
	return typeof e != "string" || e.includes("-") ? !1 : !!(Bl.indexOf(e) > -1 || /[A-Z]/u.test(e));
}
// node_modules/framer-motion/dist/es/render/dom/use-render.mjs
function Hl(e, t, n, { latestValues: r }, i, a = !1, o, s) {
	let c = (o ?? Vl(e) ? Fl : Nl)(t, r, i, e), l = zl(t, typeof e == "string", a, s), u = e === y.Fragment ? {} : {
		...l,
		...c,
		ref: n
	}, { children: d } = t, f = (0, y.useMemo)(() => Ii(d) ? d.get() : d, [d]);
	return (0, y.createElement)(e, {
		...u,
		children: f
	});
}
// node_modules/framer-motion/dist/es/motion/utils/use-visual-state.mjs
function Ul({ scrapeMotionValuesFromProps: e, createRenderState: t }, n, r, i) {
	return {
		latestValues: Wl(n, r, i, e),
		renderState: t()
	};
}
function Wl(e, t, n, r) {
	let i = {}, a = r(e, {});
	for (let e in a) i[e] = Va(a[e]);
	let { initial: o, animate: s } = e, c = As(e), l = js(e);
	t && l && !c && e.inherit !== !1 && (o === void 0 && (o = t.initial), s === void 0 && (s = t.animate));
	let u = n ? n.initial === !1 : !1;
	u ||= o === !1;
	let d = u ? s : o;
	if (d && typeof d != "boolean" && !Es(d)) {
		let t = Array.isArray(d) ? d : [d];
		for (let n = 0; n < t.length; n++) {
			let r = Oi(e, t[n]);
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
var Gl = (e) => (t, n) => {
	let r = (0, y.useContext)(Tl), i = (0, y.useContext)(C), a = () => Ul(e, t, r, i);
	return n ? a() : x(a);
}, Kl = /*@__PURE__*/ Gl({
	scrapeMotionValuesFromProps: Gs,
	createRenderState: kl
}), ql = /*@__PURE__*/ Gl({
	scrapeMotionValuesFromProps: ll,
	createRenderState: Pl
}), Jl = /* @__PURE__ */ Symbol.for("motionComponentSymbol");
// node_modules/framer-motion/dist/es/motion/utils/use-motion-ref.mjs
function Yl(e, t, n) {
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
var Xl = /* @__PURE__ */ (0, y.createContext)({});
// node_modules/framer-motion/dist/es/utils/is-ref-object.mjs
function Zl(e) {
	return e && typeof e == "object" && Object.prototype.hasOwnProperty.call(e, "current");
}
// node_modules/framer-motion/dist/es/motion/utils/use-visual-element.mjs
function Ql(e, t, n, r, i, a) {
	let { visualElement: o } = (0, y.useContext)(Tl), s = (0, y.useContext)(vl), c = (0, y.useContext)(C), l = (0, y.useContext)(gl), u = l.reducedMotion, d = l.skipAnimations, f = (0, y.useRef)(null), p = (0, y.useRef)(!1);
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
	let m = f.current, h = (0, y.useContext)(Xl);
	m && !m.projection && i && (m.type === "html" || m.type === "svg") && $l(f.current, n, i, h), (0, y.useInsertionEffect)(() => {
		m && m.props !== n && m.update(n, c);
	});
	let g = n[zi], _ = (0, y.useRef)(!!g && typeof window < "u" && !window.MotionHandoffIsComplete?.(g) && window.MotionHasOptimisedAnimation?.(g));
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
function $l(e, t, n, r) {
	let { layoutId: i, layout: a, drag: o, dragConstraints: s, layoutScroll: c, layoutRoot: l, layoutAnchor: u, layoutCrossfade: d } = t, f = e.projection = new n(e.latestValues, t["data-framer-portal-id"] ? void 0 : eu(e.parent));
	f.setOptions({
		layoutId: i,
		layout: a,
		alwaysMeasureLayout: !!o || s && Zl(s),
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
function eu(e) {
	if (e) return e.options.allowProjection === !1 ? eu(e.parent) : e.projection;
}
// node_modules/framer-motion/dist/es/motion/index.mjs
function tu(e, { forwardMotionProps: t = !1, type: n } = {}, r, i) {
	r && Cl(r);
	let a = n ? n === "svg" : Vl(e), o = a ? ql : Kl;
	function s(n, s) {
		let c, l = nu(n);
		x(() => !!Cs.current?.sharedNodes.get(l)?.lead && n.initial) && (n = {
			...n,
			initial: !1
		});
		let u = {
			...(0, y.useContext)(gl),
			...n,
			layoutId: l
		}, { isStatic: d, isValidProp: f } = u, p = Dl(n), m = o(n, d);
		if (!d && typeof window < "u") {
			ru(u, r);
			let t = iu(u);
			c = t.MeasureLayout, p.visualElement = Ql(e, m, u, i, t.ProjectionNode, a);
		}
		return (0, X.jsxs)(Tl.Provider, {
			value: p,
			children: [c && p.visualElement ? (0, X.jsx)(c, {
				visualElement: p.visualElement,
				...u
			}) : null, Hl(e, n, Yl(m, p.visualElement, s), m, d, t, a, f)]
		});
	}
	s.displayName = `motion.${typeof e == "string" ? e : `create(${e.displayName ?? e.name ?? ""})`}`;
	let c = (0, y.forwardRef)(s);
	return c[Jl] = e, c;
}
function nu({ layoutId: e }) {
	let t = (0, y.useContext)(b).id;
	return t && e !== void 0 ? t + "-" + e : e;
}
function ru(e, t) {
	(0, y.useContext)(vl).strict;
}
function iu(e) {
	let { drag: t, layout: n } = Sl();
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
function au(e, t) {
	if (typeof Proxy > "u") return tu;
	let n = /* @__PURE__ */ new Map(), r = (n, r) => tu(n, r, e, t);
	return new Proxy((e, t) => r(e, t), { get: (i, a) => a === "create" ? r : (n.has(a) || n.set(a, tu(a, void 0, e, t)), n.get(a)) });
}
// node_modules/framer-motion/dist/es/render/dom/create-visual-element.mjs
var ou = (e, t) => t.isSVG ?? Vl(e) ? new ul(t) : new qs(t, { allowProjection: e !== y.Fragment }), su = class extends al {
	constructor(e) {
		super(e), e.animationState ||= pl(e);
	}
	updateAnimationControlsSubscription() {
		let { animate: e } = this.node.getProps();
		Es(e) && (this.unmountControls = e.subscribe(this.node));
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
}, cu = 0, lu = {
	animation: { Feature: su },
	exit: { Feature: class extends al {
		constructor() {
			super(...arguments), this.id = cu++;
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
						let { transition: t, transitionEnd: n, ...r } = ki(this.node, e) || {};
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
}, uu = class extends al {
	constructor(e) {
		super(e), this.removeGroupControls = M, this.removeListeners = M, this.controls = new Vc(e);
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
}, du = ({ current: e }) => e ? e.ownerDocument.defaultView : null, fu = (e) => (t, n) => {
	e && Mt.update(() => e(t, n), !1, !0);
}, pu = class extends al {
	constructor() {
		super(...arguments), this.removePointerDownListener = M;
	}
	onPointerDown(e) {
		this.session = new hc(e, this.createPanHandlers(), {
			transformPagePoint: this.node.getTransformPagePoint(),
			contextWindow: du(this.node)
		});
	}
	createPanHandlers() {
		let { onPanSessionStart: e, onPanStart: t, onPan: n, onPanEnd: r } = this.node.getProps();
		return {
			onSessionStart: fu(e),
			onStart: fu(t),
			onMove: fu(n),
			onEnd: (e, t) => {
				delete this.session, r && Mt.postRender(() => r(e, t));
			}
		};
	}
	mount() {
		this.removePointerDownListener = Zs(this.node.current, "pointerdown", (e) => this.onPointerDown(e));
	}
	update() {
		this.session && this.session.updateHandlers(this.createPanHandlers());
	}
	unmount() {
		this.removePointerDownListener(), this.session && this.session.end();
	}
}, mu = !1, hu = ({ layout: e, layoutDependency: t }) => ({
	layout: e,
	layoutDependency: t,
	animationType: typeof e == "string" ? e : "both"
}), gu = class extends y.Component {
	componentDidMount() {
		let { visualElement: e, layoutGroup: t, switchLayoutGroup: n, layoutId: r } = this.props, { projection: i } = e;
		i && (t.group && t.group.add(i), n && n.register && r && n.register(i), mu && i.root.didUpdate(), i.addEventListener("animationComplete", () => {
			this.safeToRemove();
		}), i.setOptions({
			...i.options,
			...hu(this.props),
			onExitComplete: () => this.safeToRemove()
		})), zo.hasEverUpdated = !0;
	}
	getSnapshotBeforeUpdate(e) {
		let { layout: t, layoutDependency: n, visualElement: r, drag: i, isPresent: a } = this.props, { projection: o } = r;
		return o && (o.isPresent = a, (e.layoutDependency !== n || e.layout !== t) && o.setOptions({
			...o.options,
			...hu(this.props)
		}), mu = !0, i || e.layoutDependency !== n || n === void 0 || e.isPresent !== a ? o.willUpdate() : this.safeToRemove(), e.isPresent !== a && (a ? o.promote() : o.relegate() || Mt.postRender(() => {
			let e = o.getStack();
			e && e.members.length || this.safeToRemove();
		}))), null;
	}
	componentDidUpdate() {
		let { visualElement: e, layoutAnchor: t } = this.props, { projection: n } = e;
		n && (n.options.layoutAnchor = t, n.root.didUpdate(), Pa.postRender(() => {
			!n.currentAnimation && n.isLead() && this.safeToRemove();
		}));
	}
	componentWillUnmount() {
		let { visualElement: e, layoutGroup: t, switchLayoutGroup: n } = this.props, { projection: r } = e;
		mu = !0, r && (r.scheduleCheckAfterUnmount(), t && t.group && t.group.remove(r), n && n.deregister && n.deregister(r));
	}
	safeToRemove() {
		let { safeToRemove: e } = this.props;
		e && e();
	}
	render() {
		return null;
	}
};
function _u(e) {
	let [t, n] = _l(), r = (0, y.useContext)(b);
	return (0, X.jsx)(gu, {
		...e,
		layoutGroup: r,
		switchLayoutGroup: (0, y.useContext)(Xl),
		isPresent: t,
		safeToRemove: n
	});
}
// node_modules/framer-motion/dist/es/motion/features/drag.mjs
var vu = {
	pan: { Feature: pu },
	drag: {
		Feature: uu,
		ProjectionNode: ws,
		MeasureLayout: _u
	}
};
// node_modules/framer-motion/dist/es/gestures/hover.mjs
function yu(e, t, n) {
	let { props: r } = e;
	e.animationState && r.whileHover && e.animationState.setActive("whileHover", n === "Start");
	let i = r["onHover" + n];
	i && Mt.postRender(() => i(t, Ys(t)));
}
var bu = class extends al {
	mount() {
		let { current: e } = this.node;
		e && (this.unmount = Xc(e, (e, t) => (yu(this.node, t, "Start"), (e) => yu(this.node, e, "End"))));
	}
	unmount() {}
}, xu = class extends al {
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
		this.unmount = N(xs(this.node.current, "focus", () => this.onFocus()), xs(this.node.current, "blur", () => this.onBlur()));
	}
	unmount() {}
};
// node_modules/framer-motion/dist/es/gestures/press.mjs
function Su(e, t, n) {
	let { props: r } = e;
	if (e.current instanceof HTMLButtonElement && e.current.disabled) return;
	e.animationState && r.whileTap && e.animationState.setActive("whileTap", n === "Start");
	let i = r["onTap" + (n === "End" ? "" : n)];
	i && Mt.postRender(() => i(t, Ys(t)));
}
var Cu = class extends al {
	mount() {
		let { current: e } = this.node;
		if (!e) return;
		let { globalTapTarget: t, propagate: n } = this.node.props;
		this.unmount = il(e, (e, t) => (Su(this.node, t, "Start"), (e, { success: t }) => Su(this.node, e, t ? "End" : "Cancel")), {
			useGlobalTarget: t,
			stopPropagation: n?.tap === !1
		});
	}
	unmount() {}
}, wu = /* @__PURE__ */ new WeakMap(), Tu = /* @__PURE__ */ new WeakMap(), Eu = (e) => {
	let t = wu.get(e.target);
	t && t(e);
}, Du = (e) => {
	e.forEach(Eu);
};
function Ou({ root: e, ...t }) {
	let n = e || document;
	Tu.has(n) || Tu.set(n, {});
	let r = Tu.get(n), i = JSON.stringify(t);
	return r[i] || (r[i] = new IntersectionObserver(Du, {
		root: e,
		...t
	})), r[i];
}
function ku(e, t, n) {
	let r = Ou(t);
	return wu.set(e, n), r.observe(e), () => {
		wu.delete(e), r.unobserve(e);
	};
}
// node_modules/framer-motion/dist/es/motion/features/viewport/index.mjs
var Au = {
	some: 0,
	all: 1
}, ju = class extends al {
	constructor() {
		super(...arguments), this.hasEnteredView = !1, this.isInView = !1;
	}
	startObserver() {
		this.stopObserver?.();
		let { viewport: e = {} } = this.node.getProps(), { root: t, margin: n, amount: r = "some", once: i } = e, a = {
			root: t ? t.current : void 0,
			rootMargin: n,
			threshold: typeof r == "number" ? r : Au[r]
		}, o = (e) => {
			let { isIntersecting: t } = e;
			if (this.isInView === t || (this.isInView = t, i && !t && this.hasEnteredView)) return;
			t && (this.hasEnteredView = !0), this.node.animationState && this.node.animationState.setActive("whileInView", t);
			let { onViewportEnter: n, onViewportLeave: r } = this.node.getProps(), a = t ? n : r;
			a && a(e);
		};
		this.stopObserver = ku(this.node.current, a, o);
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
		].some(Mu(e, t)) && this.startObserver();
	}
	unmount() {
		this.stopObserver?.(), this.hasEnteredView = !1, this.isInView = !1;
	}
};
function Mu({ viewport: e = {} }, { viewport: t = {} } = {}) {
	return (n) => e[n] !== t[n];
}
// node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs
var Nu = /*@__PURE__*/ au(/* @__PURE__ */ Object.assign({}, lu, {
	inView: { Feature: ju },
	tap: { Feature: Cu },
	focus: { Feature: xu },
	hover: { Feature: bu }
}, vu, { layout: {
	ProjectionNode: ws,
	MeasureLayout: _u
} }), ou);
// node_modules/framer-motion/dist/es/utils/reduced-motion/use-reduced-motion.mjs
function Pu() {
	!Ps.current && Is();
	let [e] = (0, y.useState)(Ns.current);
	return e;
}
// node_modules/motion/dist/es/react.mjs
var Fu = m(), Iu = g(), Lu = Nu, Ru = (e) => e?.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
// node_modules/lucide-react/dist/esm/shared/src/utils/toLucideIconData.mjs
function zu(e, t, n = []) {
	if (t == null) throw Error("[lucide]: iconNode is required when icon name is used");
	return {
		name: Ru(e),
		size: 24,
		node: t,
		...n.length > 0 ? { aliases: n } : {}
	};
}
// node_modules/lucide-react/dist/esm/shared/src/utils/toCamelCase.mjs
var Bu = (e) => {
	let t = "", n = !1;
	for (let r of e) r === "-" || r === "_" || r <= " " ? n = t.length > 0 : (t.length === 0 ? t += r.toLowerCase() : t += n ? r.toUpperCase() : r, n = !1);
	return t;
}, Vu = (e) => {
	let t = Bu(e);
	return t.charAt(0).toUpperCase() + t.slice(1);
}, Hu = (...e) => e.filter((e, t, n) => !!e && e.trim() !== "" && n.indexOf(e) === t).join(" ").trim(), Uu = {
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
function Wu(e) {
	return e != null;
}
function Gu(e, t = {}) {
	let n = t.attributeNames ?? {}, r = (e) => n[e] ?? e, i = e.size ?? e.width ?? Uu.width, a = e.size ?? e.height ?? Uu.height, o = e.aliases?.filter((e) => typeof e == "string" && e.trim() !== "").map((e) => `lucide-${e}`) ?? [], s = [...e.name ? [`lucide-${e.name}`] : [], ...o], c = t.className?.split(" ").filter(Boolean) ?? [], l = t.includeDefaultClasses === !1 ? Hu(...c) : Hu("lucide", ...s, ...c), u = t.absoluteStrokeWidth ? Number(t.strokeWidth ?? Uu["stroke-width"]) * Number(e.size ?? e.width ?? Uu.width) / Number(t.size ?? t.width ?? Uu.width) : t.strokeWidth ?? Uu["stroke-width"];
	return [
		"svg",
		{
			...Object.entries(Uu).reduce((e, [t, n]) => (e[r(t)] = n, e), {}),
			..."color" in t && t.color && { [r("stroke")]: t.color },
			..."size" in t && Wu(t.size) && {
				[r("width")]: t.size,
				[r("height")]: t.size
			},
			..."width" in t && Wu(t.width) && { [r("width")]: t.width },
			..."height" in t && Wu(t.height) && { [r("height")]: t.height },
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
function Ku(e, t = {}) {
	return Gu(e, {
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
var qu = (e) => {
	for (let t in e) if (t.startsWith("aria-") || t === "role" || t === "title") return !0;
	return !1;
}, Ju = (0, y.createContext)({}), Yu = () => (0, y.useContext)(Ju), Xu = (0, y.forwardRef)(({ color: e, size: t, width: n, height: r, strokeWidth: i, absoluteStrokeWidth: a, nonScalingStroke: o, className: s = "", children: c, iconNode: l = [], icon: u = {
	node: l,
	aliases: [],
	size: 24
}, ...d }, f) => {
	let { size: p = 24, strokeWidth: m = 2, absoluteStrokeWidth: h = !1, nonScalingStroke: g = !1, color: _ = "currentColor", className: v = "" } = Yu() ?? {}, b = !!c || qu(d), [x, S, C = []] = Ku(u, {
		color: e ?? _,
		width: n ?? t ?? p,
		height: r ?? t ?? p,
		strokeWidth: i ?? m,
		absoluteStrokeWidth: a ?? h,
		nonScalingStroke: o ?? g,
		className: Hu(v, s),
		hasA11yProp: b,
		attributes: d
	});
	return (0, y.createElement)(x, {
		ref: f,
		...S
	}, [...C.map(([e, t]) => (0, y.createElement)(e, t)), ...Array.isArray(c) ? c : [c]]);
});
// node_modules/lucide-react/dist/esm/createLucideIcon.mjs
function Z(e, t = [], n = []) {
	let r = typeof e == "string" ? zu(e, t, n) : e, i = (0, y.forwardRef)(({ className: e, ...t }, n) => (0, y.createElement)(Xu, {
		ref: n,
		icon: r,
		className: e,
		...t
	}));
	return r.name && (i.displayName = Vu(r.name)), i;
}
// node_modules/lucide-react/dist/esm/icons/arrow-down.mjs
var Zu = {
	name: "arrow-down",
	size: 24,
	node: [["path", {
		d: "M12 5v14",
		key: "s699le"
	}], ["path", {
		d: "m19 12-7 7-7-7",
		key: "1idqje"
	}]]
};
Zu.node;
var Qu = Z(Zu), $u = {
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
$u.node;
var ed = Z($u), td = {
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
td.node;
var nd = Z(td), rd = {
	name: "boxes",
	size: 24,
	node: [
		["path", {
			d: "M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l3 1.8a2 2 0 0 0 2.06 0L12 19v-5.5l-5-3-4.03 2.42Z",
			key: "lc1i9w"
		}],
		["path", {
			d: "m7 16.5-4.74-2.85",
			key: "1o9zyk"
		}],
		["path", {
			d: "m7 16.5 5-3",
			key: "va8pkn"
		}],
		["path", {
			d: "M7 16.5v5.17",
			key: "jnp8gn"
		}],
		["path", {
			d: "M12 13.5V19l3.97 2.38a2 2 0 0 0 2.06 0l3-1.8a2 2 0 0 0 .97-1.71v-3.24a2 2 0 0 0-.97-1.71L17 10.5l-5 3Z",
			key: "8zsnat"
		}],
		["path", {
			d: "m17 16.5-5-3",
			key: "8arw3v"
		}],
		["path", {
			d: "m17 16.5 4.74-2.85",
			key: "8rfmw"
		}],
		["path", {
			d: "M17 16.5v5.17",
			key: "k6z78m"
		}],
		["path", {
			d: "M7.97 4.42A2 2 0 0 0 7 6.13v4.37l5 3 5-3V6.13a2 2 0 0 0-.97-1.71l-3-1.8a2 2 0 0 0-2.06 0l-3 1.8Z",
			key: "1xygjf"
		}],
		["path", {
			d: "M12 8 7.26 5.15",
			key: "1vbdud"
		}],
		["path", {
			d: "m12 8 4.74-2.85",
			key: "3rx089"
		}],
		["path", {
			d: "M12 13.5V8",
			key: "1io7kd"
		}]
	]
};
rd.node;
var id = Z(rd), ad = {
	name: "calendar-days",
	size: 24,
	node: [
		["path", {
			d: "M8 2v3",
			key: "1ioesn"
		}],
		["path", {
			d: "M16 2v3",
			key: "otl347"
		}],
		["rect", {
			x: "3",
			y: "3",
			width: "18",
			height: "18",
			rx: "2",
			key: "h1oib"
		}],
		["path", {
			d: "M3 9h18",
			key: "1pudct"
		}],
		["path", {
			d: "M8 13h.01",
			key: "1sbv64"
		}],
		["path", {
			d: "M12 13h.01",
			key: "y0uutt"
		}],
		["path", {
			d: "M16 13h.01",
			key: "wip0gl"
		}],
		["path", {
			d: "M8 17h.01",
			key: "p3bg7i"
		}],
		["path", {
			d: "M12 17h.01",
			key: "p32p05"
		}],
		["path", {
			d: "M16 17h.01",
			key: "ql8jdd"
		}]
	]
};
ad.node;
var od = Z(ad), sd = {
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
sd.node;
var cd = Z(sd), ld = {
	name: "check",
	size: 24,
	node: [["path", {
		d: "M20 6 9 17l-5-5",
		key: "1gmf2c"
	}]]
};
ld.node;
var ud = Z(ld), dd = {
	name: "chevron-down",
	size: 24,
	node: [["path", {
		d: "m6 9 6 6 6-6",
		key: "qrunsl"
	}]]
};
dd.node;
var fd = Z(dd), pd = {
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
pd.node;
var md = Z(pd), hd = {
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
hd.node;
var gd = Z(hd), _d = {
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
_d.node;
var vd = Z(_d), yd = {
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
yd.node;
var bd = Z(yd), xd = {
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
xd.node;
var Sd = Z(xd), Cd = {
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
Cd.node;
var wd = Z(Cd), Td = {
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
Td.node;
var Ed = Z(Td), Dd = {
	name: "pause",
	size: 24,
	node: [["rect", {
		x: "14",
		y: "3",
		width: "5",
		height: "18",
		rx: "1",
		key: "kaeet6"
	}], ["rect", {
		x: "5",
		y: "3",
		width: "5",
		height: "18",
		rx: "1",
		key: "1wsw3u"
	}]]
};
Dd.node;
var Od = Z(Dd), kd = {
	name: "play",
	size: 24,
	node: [["path", {
		d: "M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z",
		key: "10ikf1"
	}]]
};
kd.node;
var Ad = Z(kd), jd = {
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
jd.node;
var Md = Z(jd), Nd = {
	name: "settings-2",
	size: 24,
	node: [
		["path", {
			d: "M14 17H5",
			key: "gfn3mx"
		}],
		["path", {
			d: "M19 7h-9",
			key: "6i9tg"
		}],
		["circle", {
			cx: "17",
			cy: "17",
			r: "3",
			key: "18b49y"
		}],
		["circle", {
			cx: "7",
			cy: "7",
			r: "3",
			key: "dfmy0x"
		}]
	]
};
Nd.node;
var Pd = Z(Nd), Fd = {
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
Fd.node;
var Id = Z(Fd), Ld = {
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
Ld.node;
var Rd = Z(Ld), zd = {
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
zd.node;
var Bd = Z(zd), Vd = {
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
Vd.node;
var Hd = Z(Vd), Ud = Object.freeze({
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
}), Wd = (e) => Object.freeze(e);
Object.freeze([
	Wd({
		id: "public-home",
		path: "/",
		surface: "public",
		access: "public",
		title: "SIVI — Vendas industriais"
	}),
	Wd({
		id: "public-about",
		path: Ud.publicAbout,
		surface: "public",
		access: "public",
		title: "Quem somos — SIVI"
	}),
	Wd({
		id: "public-platform",
		path: Ud.publicPlatform,
		surface: "public",
		access: "public",
		title: "Plataforma — SIVI"
	}),
	Wd({
		id: "public-cases",
		path: Ud.publicCases,
		surface: "public",
		access: "public",
		title: "Casos de uso — SIVI"
	}),
	Wd({
		id: "public-faq",
		path: Ud.publicFaq,
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
	].map(([e, t, n, r, i]) => Wd({
		id: `${e}-${n}`,
		path: `/app/${t}/${r}`,
		surface: "app",
		access: "authenticated",
		workspaceRole: e,
		section: n,
		title: i
	})),
	Wd({
		id: "supplier-profile",
		path: "/app/fornecedor/perfil",
		surface: "app",
		access: "authenticated",
		workspaceRole: "supplier",
		section: "profile",
		title: "Perfil industrial"
	}),
	Wd({
		id: "access",
		path: Ud.access,
		surface: "auth",
		access: "public",
		title: "Acesso"
	}),
	Wd({
		id: "context",
		path: Ud.context,
		surface: "app",
		access: "authenticated",
		title: "Empresas e atuação"
	}),
	Wd({
		id: "buyer-home",
		path: Ud.buyerHome,
		surface: "app",
		access: "authenticated",
		workspaceRole: "buyer",
		title: "Visão geral"
	}),
	Wd({
		id: "buyer-suppliers",
		path: Ud.buyerSuppliers,
		surface: "app",
		access: "authenticated",
		workspaceRole: "buyer",
		title: "Fornecedores"
	}),
	Wd({
		id: "buyer-supplier-profile",
		path: Ud.buyerSupplierProfile,
		surface: "app",
		access: "authenticated",
		workspaceRole: "buyer",
		title: "Perfil do fornecedor"
	}),
	Wd({
		id: "buyer-reviews",
		path: Ud.buyerReviews,
		surface: "app",
		access: "authenticated",
		workspaceRole: "buyer",
		title: "Avaliações"
	}),
	Wd({
		id: "buyer-conversations",
		path: Ud.buyerConversations,
		surface: "app",
		access: "authenticated",
		workspaceRole: "buyer",
		title: "Conversas"
	}),
	Wd({
		id: "supplier-home",
		path: Ud.supplierHome,
		surface: "app",
		access: "authenticated",
		workspaceRole: "supplier",
		title: "Visão do fornecedor"
	}),
	Wd({
		id: "supplier-conversations",
		path: Ud.supplierConversations,
		surface: "app",
		access: "authenticated",
		workspaceRole: "supplier",
		title: "Conversas"
	}),
	Wd({
		id: "admin-home",
		path: Ud.adminHome,
		surface: "app",
		access: "authenticated",
		workspaceRole: "administration",
		title: "Visão administrativa"
	})
]);
// src/public/components.tsx
var Gd = {
	home: Ud.publicHome,
	about: Ud.publicAbout,
	platform: Ud.publicPlatform,
	cases: Ud.publicCases,
	faq: Ud.publicFaq
}, Kd = (e) => `#${Gd[e]}`, qd = (e, t) => `${Kd(e)}?secao=${encodeURIComponent(t)}`, Jd = (e) => e === "funcionamento" || e === "compras" || e === "fornecimento", Yd = (e) => qd(Jd(e) ? "platform" : "home", e), Xd = (e) => `${Yd("funcionamento")}&etapa=${e}`, Zd = (e) => e === "sobre" ? Kd("about") : `#/?pagina=${encodeURIComponent(e)}`, Qd = (e) => `#/acesso?modo=register${e ? `&atuacao=${e}` : ""}`, $d = [
	["about", "Quem somos"],
	["platform", "Plataforma"],
	["cases", "Casos de uso"],
	["faq", "Dúvidas"]
];
function ef({ back: e = !1 }) {
	return /* @__PURE__ */ (0, X.jsxs)("a", {
		className: "sv-brand",
		href: "#/",
		"aria-label": e ? "SIVI, voltar à página inicial" : "SIVI, início",
		children: [
			/* @__PURE__ */ (0, X.jsx)("img", {
				src: "./src/assets/brand/raposa.svg",
				width: "36",
				height: "36",
				alt: ""
			}),
			/* @__PURE__ */ (0, X.jsx)("span", { children: "SIVI" }),
			/* @__PURE__ */ (0, X.jsxs)("small", { children: [
				"VENDAS",
				/* @__PURE__ */ (0, X.jsx)("br", {}),
				"INDUSTRIAIS"
			] })
		]
	});
}
function tf() {
	return /* @__PURE__ */ (0, X.jsx)(nd, {
		className: "t-learn-chevron",
		size: 19,
		"aria-hidden": "true"
	});
}
function nf() {
	return /* @__PURE__ */ (0, X.jsxs)("svg", {
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
		children: [/* @__PURE__ */ (0, X.jsx)("path", {
			className: "t-learn-arm t-learn-arm-top",
			d: "M6 4L10 8"
		}), /* @__PURE__ */ (0, X.jsx)("path", {
			className: "t-learn-arm t-learn-arm-bot",
			d: "M10 8L6 12"
		})]
	});
}
function rf({ children: e, href: t = Qd(), secondary: n = !1, className: r = "" }) {
	return /* @__PURE__ */ (0, X.jsxs)("a", {
		href: t,
		className: `sv-button t-learn ${n ? "sv-button--secondary" : ""} ${r}`,
		children: [e, /* @__PURE__ */ (0, X.jsx)(nf, {})]
	});
}
function af({ current: e }) {
	let [t, n] = (0, y.useState)(!1), r = (0, y.useRef)(null);
	return (0, y.useEffect)(() => {
		if (!t) return;
		let e = (e) => {
			e.key === "Escape" && (n(!1), r.current?.focus());
		};
		return window.addEventListener("keydown", e), () => window.removeEventListener("keydown", e);
	}, [t]), /* @__PURE__ */ (0, X.jsxs)(X.Fragment, { children: [/* @__PURE__ */ (0, X.jsx)("a", {
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
	}), /* @__PURE__ */ (0, X.jsx)("header", {
		className: "sv-header",
		"data-menu-open": t || void 0,
		children: /* @__PURE__ */ (0, X.jsxs)("div", {
			className: "sv-nav sv-shell",
			children: [
				/* @__PURE__ */ (0, X.jsx)(ef, {}),
				/* @__PURE__ */ (0, X.jsx)("button", {
					className: "sv-menu",
					ref: r,
					"aria-label": t ? "Fechar menu" : "Abrir menu",
					"aria-expanded": t,
					"aria-controls": "sv-navigation",
					onClick: () => n(!t),
					children: t ? /* @__PURE__ */ (0, X.jsx)(Hd, {}) : /* @__PURE__ */ (0, X.jsx)(wd, {})
				}),
				/* @__PURE__ */ (0, X.jsxs)("nav", {
					id: "sv-navigation",
					"aria-label": "Navegação principal",
					className: t ? "is-open" : "",
					onClick: () => n(!1),
					children: [
						$d.map(([t, n]) => /* @__PURE__ */ (0, X.jsx)("a", {
							href: Kd(t),
							"aria-current": t === e ? "page" : void 0,
							children: n
						}, t)),
						/* @__PURE__ */ (0, X.jsxs)("a", {
							href: "#/acesso?modo=login",
							className: "sv-login-link",
							children: ["Entrar ", /* @__PURE__ */ (0, X.jsx)(tf, {})]
						}),
						/* @__PURE__ */ (0, X.jsxs)("a", {
							className: "sv-nav-cta",
							href: Qd(),
							children: ["Cadastrar empresa ", /* @__PURE__ */ (0, X.jsx)(tf, {})]
						})
					]
				})
			]
		})
	})] });
}
var of = [
	{
		name: "Plataforma",
		links: [
			["Como funciona", Yd("funcionamento")],
			["Para compradores", Yd("compras")],
			["Para fornecedores", Yd("fornecimento")],
			["Casos de uso", Kd("cases")]
		]
	},
	{
		name: "Conheça o SIVI",
		links: [
			["Quem somos", Kd("about")],
			["Segurança e dados", Zd("seguranca")],
			["Ajuda e acesso", Zd("ajuda")],
			["Dúvidas sobre o cadastro", Kd("faq")]
		]
	},
	{
		name: "Sua conta",
		links: [
			["Entrar na minha conta", "#/acesso?modo=login"],
			["Cadastrar empresa", Qd()],
			["Privacidade", Zd("privacidade")],
			["Condições de uso", Zd("condicoes")]
		]
	}
];
function sf() {
	return /* @__PURE__ */ (0, X.jsx)("footer", {
		className: "sv-footer public-footer",
		children: /* @__PURE__ */ (0, X.jsxs)("div", {
			className: "sv-shell",
			children: [/* @__PURE__ */ (0, X.jsxs)("div", {
				className: "sv-footer-top",
				children: [/* @__PURE__ */ (0, X.jsxs)("div", {
					className: "sv-footer-brand",
					children: [/* @__PURE__ */ (0, X.jsx)(ef, {}), /* @__PURE__ */ (0, X.jsx)("small", { children: "Sistema Integrado de Vendas Industriais" })]
				}), of.map((e) => /* @__PURE__ */ (0, X.jsxs)("nav", {
					"aria-label": e.name,
					children: [/* @__PURE__ */ (0, X.jsx)("h2", { children: e.name }), e.links.map(([e, t]) => /* @__PURE__ */ (0, X.jsx)("a", {
						href: t,
						children: e
					}, e))]
				}, e.name))]
			}), /* @__PURE__ */ (0, X.jsxs)("div", {
				className: "sv-footer-bottom",
				children: [
					/* @__PURE__ */ (0, X.jsxs)("span", { children: [
						"© ",
						(/* @__PURE__ */ new Date()).getFullYear(),
						" SIVI"
					] }),
					/* @__PURE__ */ (0, X.jsx)("a", {
						href: Zd("creditos"),
						children: "Créditos de imagem e vídeo"
					}),
					/* @__PURE__ */ (0, X.jsx)("span", { children: "Português · Brasil" }),
					/* @__PURE__ */ (0, X.jsx)("a", {
						href: Yd("topo"),
						children: "Voltar ao início ↑"
					})
				]
			})]
		})
	});
}
function cf({ focusTitle: e = !1 }) {
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
// node_modules/gsap/gsap-core.js
function lf(e) {
	if (e === void 0) throw ReferenceError("this hasn't been initialised - super() hasn't been called");
	return e;
}
function uf(e, t) {
	e.prototype = Object.create(t.prototype), e.prototype.constructor = e, e.__proto__ = t;
}
var df = {
	autoSleep: 120,
	force3D: "auto",
	nullTargetWarn: 1,
	units: { lineHeight: "" }
}, ff = {
	duration: .5,
	overwrite: !1,
	delay: 0
}, pf, mf, hf, gf = 1e8, _f = 1 / gf, vf = Math.PI * 2, yf = vf / 4, bf = 0, xf = Math.sqrt, Sf = Math.cos, Cf = Math.sin, wf = function(e) {
	return typeof e == "string";
}, Tf = function(e) {
	return typeof e == "function";
}, Ef = function(e) {
	return typeof e == "number";
}, Df = function(e) {
	return e === void 0;
}, Of = function(e) {
	return typeof e == "object";
}, kf = function(e) {
	return e !== !1;
}, Af = function() {
	return typeof window < "u";
}, jf = function(e) {
	return Tf(e) || wf(e);
}, Mf = typeof ArrayBuffer == "function" && ArrayBuffer.isView || function() {}, Nf = Array.isArray, Pf = /random\([^)]+\)/g, Ff = /,\s*/g, If = /(?:-?\.?\d|\.)+/gi, Lf = /[-+=.]*\d+[.e\-+]*\d*[e\-+]*\d*/g, Rf = /[-+=.]*\d+[.e-]*\d*[a-z%]*/g, zf = /[-+=.]*\d+\.?\d*(?:e-|e\+)?\d*/gi, Bf = /[+-]=-?[.\d]+/, Vf = /[^,'"\[\]\s]+/gi, Hf = /^[+\-=e\s\d]*\d+[.\d]*([a-z]*|%)\s*$/i, Uf, Wf, Gf, Kf, qf = {}, Jf = {}, Yf, Xf = function(e) {
	return (Jf = Op(e, qf)) && qh;
}, Zf = function(e, t) {
	return console.warn("Invalid property", e, "set to", t, "Missing plugin? gsap.registerPlugin()");
}, Qf = function(e, t) {
	return !t && console.warn(e);
}, $f = function(e, t) {
	return e && (qf[e] = t) && Jf && (Jf[e] = t) || qf;
}, ep = function() {
	return 0;
}, tp = {
	suppressEvents: !0,
	isStart: !0,
	kill: !1
}, np = {
	suppressEvents: !0,
	kill: !1
}, rp = { suppressEvents: !0 }, ip = {}, ap = [], op = {}, sp, cp = {}, lp = {}, up = 30, dp = [], fp = "", pp = function(e) {
	var t = e[0], n, r;
	if (Of(t) || Tf(t) || (e = [e]), !(n = (t._gsap || {}).harness)) {
		for (r = dp.length; r-- && !dp[r].targetTest(t););
		n = dp[r];
	}
	for (r = e.length; r--;) e[r] && (e[r]._gsap || (e[r]._gsap = new rh(e[r], n))) || e.splice(r, 1);
	return e;
}, mp = function(e) {
	return e._gsap || pp(dm(e))[0]._gsap;
}, hp = function(e, t, n) {
	return (n = e[t]) && Tf(n) ? e[t]() : Df(n) && e.getAttribute && e.getAttribute(t) || n;
}, gp = function(e, t) {
	return (e = e.split(",")).forEach(t) || e;
}, _p = function(e) {
	return Math.round(e * 1e5) / 1e5 || 0;
}, vp = function(e) {
	return Math.round(e * 1e7) / 1e7 || 0;
}, yp = function(e, t) {
	var n = t.charAt(0), r = parseFloat(t.substr(2));
	return e = parseFloat(e), n === "+" ? e + r : n === "-" ? e - r : n === "*" ? e * r : e / r;
}, bp = function(e, t) {
	for (var n = t.length, r = 0; e.indexOf(t[r]) < 0 && ++r < n;);
	return r < n;
}, xp = function() {
	var e = ap.length, t = ap.slice(0), n, r;
	for (op = {}, ap.length = 0, n = 0; n < e; n++) r = t[n], r && r._lazy && (r.render(r._lazy[0], r._lazy[1], !0)._lazy = 0);
}, Sp = function(e) {
	return !!(e._initted || e._startAt || e.add);
}, Cp = function(e, t, n, r) {
	ap.length && !mf && xp(), e.render(t, n, r || !!(mf && t < 0 && Sp(e))), ap.length && !mf && xp();
}, wp = function(e) {
	var t = parseFloat(e);
	return (t || t === 0) && (e + "").match(Vf).length < 2 ? t : wf(e) ? e.trim() : e;
}, Tp = function(e) {
	return e;
}, Ep = function(e, t) {
	for (var n in t) n in e || (e[n] = t[n]);
	return e;
}, Dp = function(e) {
	return function(t, n) {
		for (var r in n) r in t || r === "duration" && e || r === "ease" || (t[r] = n[r]);
	};
}, Op = function(e, t) {
	for (var n in t) e[n] = t[n];
	return e;
}, kp = function e(t, n) {
	for (var r in n) r !== "__proto__" && r !== "constructor" && r !== "prototype" && (t[r] = Of(n[r]) ? e(t[r] || (t[r] = {}), n[r]) : n[r]);
	return t;
}, Ap = function(e, t) {
	var n = {}, r;
	for (r in e) r in t || (n[r] = e[r]);
	return n;
}, jp = function(e) {
	var t = e.parent || Uf, n = e.keyframes ? Dp(Nf(e.keyframes)) : Ep;
	if (kf(e.inherit)) for (; t;) n(e, t.vars.defaults), t = t.parent || t._dp;
	return e;
}, Mp = function(e, t) {
	for (var n = e.length, r = n === t.length; r && n-- && e[n] === t[n];);
	return n < 0;
}, Np = function(e, t, n, r, i) {
	n === void 0 && (n = "_first"), r === void 0 && (r = "_last");
	var a = e[r], o;
	if (i) for (o = t[i]; a && a[i] > o;) a = a._prev;
	return a ? (t._next = a._next, a._next = t) : (t._next = e[n], e[n] = t), t._next ? t._next._prev = t : e[r] = t, t._prev = a, t.parent = t._dp = e, t;
}, Pp = function(e, t, n, r) {
	n === void 0 && (n = "_first"), r === void 0 && (r = "_last");
	var i = t._prev, a = t._next;
	i ? i._next = a : e[n] === t && (e[n] = a), a ? a._prev = i : e[r] === t && (e[r] = i), t._next = t._prev = t.parent = null;
}, Fp = function(e, t) {
	e.parent && (!t || e.parent.autoRemoveChildren) && e.parent.remove && e.parent.remove(e), e._act = 0;
}, Ip = function(e, t) {
	if (e && (!t || t._end > e._dur || t._start < 0)) for (var n = e; n;) n._dirty = 1, n = n.parent;
	return e;
}, Lp = function(e) {
	for (var t = e.parent; t && t.parent;) t._dirty = 1, t.totalDuration(), t = t.parent;
	return e;
}, Rp = function(e, t, n, r) {
	return e._startAt && (mf ? e._startAt.revert(np) : e.vars.immediateRender && !e.vars.autoRevert || e._startAt.render(t, !0, r));
}, zp = function e(t) {
	return !t || t._ts && e(t.parent);
}, Bp = function(e) {
	return e._repeat ? Vp(e._tTime, e = e.duration() + e._rDelay) * e : 0;
}, Vp = function(e, t) {
	var n = Math.floor(e = vp(e / t));
	return e && n === e ? n - 1 : n;
}, Hp = function(e, t) {
	return (e - t._start) * t._ts + (t._ts >= 0 ? 0 : t._dirty ? t.totalDuration() : t._tDur);
}, Up = function(e) {
	return e._end = vp(e._start + (e._tDur / Math.abs(e._ts || e._rts || _f) || 0));
}, Wp = function(e, t) {
	var n = e._dp;
	return n && n.smoothChildTiming && e._ts && (e._start = vp(n._time - (e._ts > 0 ? t / e._ts : ((e._dirty ? e.totalDuration() : e._tDur) - t) / -e._ts)), Up(e), n._dirty || Ip(n, e)), e;
}, Gp = function(e, t) {
	var n;
	if ((t._time || !t._dur && t._initted || t._start < e._time && (t._dur || !t.add)) && (n = Hp(e.rawTime(), t), (!t._dur || am(0, t.totalDuration(), n) - t._tTime > _f) && t.render(n, !0)), Ip(e, t)._dp && e._initted && e._time >= e._dur && e._ts) {
		if (e._dur < e.duration()) for (n = e; n._dp;) n.rawTime() >= 0 && n.totalTime(n._tTime), n = n._dp;
		e._zTime = -_f;
	}
}, Kp = function(e, t, n, r) {
	return t.parent && Fp(t), t._start = vp((Ef(n) ? n : !n && Xp(t) && (!e._last || e._last._start >= e._time) ? e._last ? e._last._start : e._time : n || e !== Uf ? nm(e, n, t) : e._time) + t._delay), t._end = vp(t._start + (t.totalDuration() / Math.abs(t.timeScale()) || 0)), Np(e, t, "_first", "_last", e._sort ? "_start" : 0), Xp(t) || (e._recent = t), r || Gp(e, t), e._ts < 0 && Wp(e, e._tTime), e;
}, qp = function(e, t) {
	return (qf.ScrollTrigger || Zf("scrollTrigger", t)) && qf.ScrollTrigger.create(t, e);
}, Jp = function(e, t, n, r, i) {
	if (fh(e, t, i), !e._initted) return 1;
	if (!n && e._pt && !mf && (e._dur && e.vars.lazy !== !1 || !e._dur && e.vars.lazy) && sp !== Um.frame) return ap.push(e), e._lazy = [i, r], 1;
}, Yp = function e(t) {
	var n = t.parent;
	return n && n._ts && n._initted && !n._lock && (n.rawTime() < 0 || e(n));
}, Xp = function(e) {
	var t = e.data;
	return t === "isFromStart" || t === "isStart";
}, Zp = function(e, t, n, r) {
	var i = e.ratio, a = t < 0 || !t && (!e._start && Yp(e) && (e._initted || !Xp(e)) || (e._ts < 0 || e._dp._ts < 0) && !Xp(e)) ? 0 : 1, o = e._rDelay, s = 0, c, l, u;
	if (o && e._repeat && (s = am(0, e._tDur, t), l = Vp(s, o), e._yoyo && l & 1 && (a = 1 - a), l !== Vp(e._tTime, o) && (i = 1 - a, e.vars.repeatRefresh && e._initted && e.invalidate())), a !== i || mf || r || e._zTime === _f || !t && e._zTime) {
		if (!e._initted && Jp(e, t, r, n, s)) return;
		for (u = e._zTime, e._zTime = t || (n ? _f : 0), n ||= t && !u, e.ratio = a, e._from && (a = 1 - a), e._time = 0, e._tTime = s, c = e._pt; c;) c.r(a, c.d), c = c._next;
		t < 0 && Rp(e, t, n, !0), e._onUpdate && !n && Om(e, "onUpdate"), s && e._repeat && !n && e.parent && Om(e, "onRepeat"), (t >= e._tDur || t < 0) && e.ratio === a && (a && Fp(e, 1), !n && !mf && (Om(e, a ? "onComplete" : "onReverseComplete", !0), e._prom && e._prom()));
	} else e._zTime ||= t;
}, Qp = function(e, t, n) {
	var r;
	if (n > t) for (r = e._first; r && r._start <= n;) {
		if (r.data === "isPause" && r._start > t) return r;
		r = r._next;
	}
	else for (r = e._last; r && r._start >= n;) {
		if (r.data === "isPause" && r._start < t) return r;
		r = r._prev;
	}
}, $p = function(e, t, n, r) {
	var i = e._repeat, a = vp(t) || 0, o = e._tTime / e._tDur;
	return o && !r && (e._time *= a / e._dur), e._dur = a, e._tDur = i ? i < 0 ? 1e10 : vp(a * (i + 1) + e._rDelay * i) : a, o > 0 && !r && Wp(e, e._tTime = e._tDur * o), e.parent && Up(e), n || Ip(e.parent, e), e;
}, em = function(e) {
	return e instanceof ah ? Ip(e) : $p(e, e._dur);
}, tm = {
	_start: 0,
	endTime: ep,
	totalDuration: ep
}, nm = function e(t, n, r) {
	var i = t.labels, a = t._recent || tm, o = t.duration() >= gf ? a.endTime(!1) : t._dur, s, c, l;
	return wf(n) && (isNaN(n) || n in i) ? (c = n.charAt(0), l = n.substr(-1) === "%", s = n.indexOf("="), c === "<" || c === ">" ? (s >= 0 && (n = n.replace(/=/, "")), (c === "<" ? a._start : a.endTime(a._repeat >= 0)) + (parseFloat(n.substr(1)) || 0) * (l ? (s < 0 ? a : r).totalDuration() / 100 : 1)) : s < 0 ? (n in i || (i[n] = o), i[n]) : (c = parseFloat(n.charAt(s - 1) + n.substr(s + 1)), l && r && (c = c / 100 * (Nf(r) ? r[0] : r).totalDuration()), s > 1 ? e(t, n.substr(0, s - 1), r) + c : o + c)) : n == null ? o : +n;
}, rm = function(e, t, n) {
	var r = Ef(t[1]), i = (r ? 2 : 1) + (e < 2 ? 0 : 1), a = t[i], o, s;
	if (r && (a.duration = t[1]), a.parent = n, e) {
		for (o = a, s = n; s && !("immediateRender" in o);) o = s.vars.defaults || {}, s = kf(s.vars.inherit) && s.parent;
		a.immediateRender = kf(o.immediateRender), e < 2 ? a.runBackwards = 1 : a.startAt = t[i - 1];
	}
	return new yh(t[0], a, t[i + 1]);
}, im = function(e, t) {
	return e || e === 0 ? t(e) : t;
}, am = function(e, t, n) {
	return n < e ? e : n > t ? t : n;
}, om = function(e, t) {
	return !wf(e) || !(t = Hf.exec(e)) ? "" : t[1];
}, sm = function(e, t, n) {
	return im(n, function(n) {
		return am(e, t, n);
	});
}, cm = [].slice, lm = function(e, t) {
	return e && Of(e) && "length" in e && (!t && !e.length || e.length - 1 in e && Of(e[0])) && !e.nodeType && e !== Wf;
}, um = function(e, t, n) {
	return n === void 0 && (n = []), e.forEach(function(e) {
		var r;
		return wf(e) && !t || lm(e, 1) ? (r = n).push.apply(r, dm(e)) : n.push(e);
	}) || n;
}, dm = function(e, t, n) {
	return hf && !t && hf.selector ? hf.selector(e) : wf(e) && !n && (Gf || !Wm()) ? cm.call((t || Kf).querySelectorAll(e), 0) : Nf(e) ? um(e, n) : lm(e) ? cm.call(e, 0) : e ? [e] : [];
}, fm = function(e) {
	return e = dm(e)[0] || Qf("Invalid scope") || {}, function(t) {
		var n = e.current || e.nativeElement || e;
		return dm(t, n.querySelectorAll ? n : n === e ? Qf("Invalid scope") || Kf.createElement("div") : e);
	};
}, pm = function(e) {
	return e.sort(function() {
		return .5 - Math.random();
	});
}, mm = function(e) {
	if (Tf(e)) return e;
	var t = Of(e) ? e : { each: e }, n = Qm(t.ease), r = t.from || 0, i = parseFloat(t.base) || 0, a = {}, o = r > 0 && r < 1, s = isNaN(r) || o, c = t.axis, l = r, u = r;
	return wf(r) ? l = u = {
		center: .5,
		edges: .5,
		end: 1
	}[r] || 0 : !o && s && (l = r[0], u = r[1]), function(e, o, d) {
		var f = (d || t).length, p = a[f], m, h, g, _, v, y, b, x, S;
		if (!p) {
			if (S = t.grid === "auto" ? 0 : (t.grid || [1, gf])[1], !S) {
				for (b = -gf; b < (b = d[S++].getBoundingClientRect().left) && S < f;);
				S < f && S--;
			}
			for (p = a[f] = [], m = s ? Math.min(S, f) * l - .5 : r % S, h = S === gf ? 0 : s ? f * u / S - .5 : r / S | 0, b = 0, x = gf, y = 0; y < f; y++) g = y % S - m, _ = h - (y / S | 0), p[y] = v = c ? Math.abs(c === "y" ? _ : g) : xf(g * g + _ * _), v > b && (b = v), v < x && (x = v);
			r === "random" && pm(p), p.max = b - x, p.min = x, p.v = f = (parseFloat(t.amount) || parseFloat(t.each) * (S > f ? f - 1 : c ? c === "y" ? f / S : S : Math.max(S, f / S)) || 0) * (r === "edges" ? -1 : 1), p.b = f < 0 ? i - f : i, p.u = om(t.amount || t.each) || 0, n = n && f < 0 ? Zm(n) : n;
		}
		return f = (p[e] - p.min) / p.max || 0, vp(p.b + (n ? n(f) : f) * p.v) + p.u;
	};
}, hm = function(e) {
	var t = 10 ** ((e + "").split(".")[1] || "").length;
	return function(n) {
		var r = vp(Math.round(parseFloat(n) / e) * e * t);
		return (r - r % 1) / t + (Ef(n) ? 0 : om(n));
	};
}, gm = function(e, t) {
	var n = Nf(e), r, i;
	return !n && Of(e) && (r = n = e.radius || gf, e.values ? (e = dm(e.values), (i = !Ef(e[0])) && (r *= r)) : e = hm(e.increment)), im(t, n ? Tf(e) ? function(t) {
		return i = e(t), Math.abs(i - t) <= r ? i : t;
	} : function(t) {
		for (var n = parseFloat(i ? t.x : t), a = parseFloat(i ? t.y : 0), o = gf, s = 0, c = e.length, l, u; c--;) i ? (l = e[c].x - n, u = e[c].y - a, l = l * l + u * u) : l = Math.abs(e[c] - n), l < o && (o = l, s = c);
		return s = !r || o <= r ? e[s] : t, i || s === t || Ef(t) ? s : s + om(t);
	} : hm(e));
}, _m = function(e, t, n, r) {
	return im(Nf(e) ? !t : n === !0 ? !!(n = 0) : !r, function() {
		return Nf(e) ? e[~~(Math.random() * e.length)] : (n ||= 1e-5) && (r = n < 1 ? 10 ** ((n + "").length - 2) : 1) && Math.floor(Math.round((e - n / 2 + Math.random() * (t - e + n * .99)) / n) * n * r) / r;
	});
}, vm = function() {
	var e = [...arguments];
	return function(t) {
		return e.reduce(function(e, t) {
			return t(e);
		}, t);
	};
}, ym = function(e, t) {
	return function(n) {
		return e(parseFloat(n)) + (t || om(n));
	};
}, bm = function(e, t, n) {
	return Tm(e, t, 0, 1, n);
}, xm = function(e, t, n) {
	return im(n, function(n) {
		return e[~~t(n)];
	});
}, Sm = function e(t, n, r) {
	var i = n - t;
	return Nf(t) ? xm(t, e(0, t.length), n) : im(r, function(e) {
		return (i + (e - t) % i) % i + t;
	});
}, Cm = function e(t, n, r) {
	var i = n - t, a = i * 2;
	return Nf(t) ? xm(t, e(0, t.length - 1), n) : im(r, function(e) {
		return e = (a + (e - t) % a) % a || 0, t + (e > i ? a - e : e);
	});
}, wm = function(e) {
	return e.replace(Pf, function(e) {
		var t = e.indexOf("[") + 1, n = e.substring(t || 7, t ? e.indexOf("]") : e.length - 1).split(Ff);
		return _m(t ? n : +n[0], t ? 0 : +n[1], +n[2] || 1e-5);
	});
}, Tm = function(e, t, n, r, i) {
	var a = t - e, o = r - n;
	return im(i, function(t) {
		return n + ((t - e) / a * o || 0);
	});
}, Em = function e(t, n, r, i) {
	var a = isNaN(t + n) ? 0 : function(e) {
		return (1 - e) * t + e * n;
	};
	if (!a) {
		var o = wf(t), s = {}, c, l, u, d, f;
		if (r === !0 && (i = 1) && (r = null), o) t = { p: t }, n = { p: n };
		else if (Nf(t) && !Nf(n)) {
			for (u = [], d = t.length, f = d - 2, l = 1; l < d; l++) u.push(e(t[l - 1], t[l]));
			d--, a = function(e) {
				e *= d;
				var t = Math.min(f, ~~e);
				return u[t](e - t);
			}, r = n;
		} else i || (t = Op(Nf(t) ? [] : {}, t));
		if (!u) {
			for (c in n) sh.call(s, t, c, "get", n[c]);
			a = function(e) {
				return Oh(e, s) || (o ? t.p : t);
			};
		}
	}
	return im(r, a);
}, Dm = function(e, t, n) {
	var r = e.labels, i = gf, a, o, s;
	for (a in r) o = r[a] - t, o < 0 == !!n && o && i > (o = Math.abs(o)) && (s = a, i = o);
	return s;
}, Om = function(e, t, n) {
	var r = e.vars, i = r[t], a = hf, o = e._ctx, s, c, l;
	if (i) return s = r[t + "Params"], c = r.callbackScope || e, n && ap.length && xp(), o && (hf = o), l = s ? i.apply(c, s) : i.call(c), hf = a, l;
}, km = function(e) {
	return Fp(e), e.scrollTrigger && e.scrollTrigger.kill(!!mf), e.progress() < 1 && Om(e, "onInterrupt"), e;
}, Am, jm = [], Mm = function(e) {
	if (e) {
		if (e = !e.name && e.default || e, Af() || e.headless) {
			var t = e.name, n = Tf(e), r = t && !n && e.init ? function() {
				this._props = [];
			} : e, i = {
				init: ep,
				render: Oh,
				add: sh,
				kill: Ah,
				modifier: kh,
				rawVars: 0
			}, a = {
				targetTest: 0,
				get: 0,
				getSetter: wh,
				aliases: {},
				register: 0
			};
			if (Wm(), e !== r) {
				if (cp[t]) return;
				Ep(r, Ep(Ap(e, i), a)), Op(r.prototype, Op(i, Ap(e, a))), cp[r.prop = t] = r, e.targetTest && (dp.push(r), ip[t] = 1), t = (t === "css" ? "CSS" : t.charAt(0).toUpperCase() + t.substr(1)) + "Plugin";
			}
			$f(t, r), e.register && e.register(qh, r, Nh);
		} else jm.push(e);
	}
}, Nm = 255, Pm = {
	aqua: [
		0,
		Nm,
		Nm
	],
	lime: [
		0,
		Nm,
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
		Nm
	],
	navy: [
		0,
		0,
		128
	],
	white: [
		Nm,
		Nm,
		Nm
	],
	olive: [
		128,
		128,
		0
	],
	yellow: [
		Nm,
		Nm,
		0
	],
	orange: [
		Nm,
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
		Nm,
		0,
		0
	],
	pink: [
		Nm,
		192,
		203
	],
	cyan: [
		0,
		Nm,
		Nm
	],
	transparent: [
		Nm,
		Nm,
		Nm,
		0
	]
}, Fm = function(e, t, n) {
	return e += e < 0 ? 1 : e > 1 ? -1 : 0, (e * 6 < 1 ? t + (n - t) * e * 6 : e < .5 ? n : e * 3 < 2 ? t + (n - t) * (2 / 3 - e) * 6 : t) * Nm + .5 | 0;
}, Im = function(e, t, n) {
	var r = e ? Ef(e) ? [
		e >> 16,
		e >> 8 & Nm,
		e & Nm
	] : 0 : Pm.black, i, a, o, s, c, l, u, d, f, p;
	if (!r) {
		if (e.substr(-1) === "," && (e = e.substr(0, e.length - 1)), Pm[e]) r = Pm[e];
		else if (e.charAt(0) === "#") {
			if (e.length < 6 && (i = e.charAt(1), a = e.charAt(2), o = e.charAt(3), e = "#" + i + i + a + a + o + o + (e.length === 5 ? e.charAt(4) + e.charAt(4) : "")), e.length === 9) return r = parseInt(e.substr(1, 6), 16), [
				r >> 16,
				r >> 8 & Nm,
				r & Nm,
				parseInt(e.substr(7), 16) / 255
			];
			e = parseInt(e.substr(1), 16), r = [
				e >> 16,
				e >> 8 & Nm,
				e & Nm
			];
		} else if (e.substr(0, 3) === "hsl") {
			if (r = p = e.match(If), !t) s = r[0] % 360 / 360, c = r[1] / 100, l = r[2] / 100, a = l <= .5 ? l * (c + 1) : l + c - l * c, i = l * 2 - a, r.length > 3 && (r[3] *= 1), r[0] = Fm(s + 1 / 3, i, a), r[1] = Fm(s, i, a), r[2] = Fm(s - 1 / 3, i, a);
			else if (~e.indexOf("=")) return r = e.match(Lf), n && r.length < 4 && (r[3] = 1), r;
		} else r = e.match(If) || Pm.transparent;
		r = r.map(Number);
	}
	return t && !p && (i = r[0] / Nm, a = r[1] / Nm, o = r[2] / Nm, u = Math.max(i, a, o), d = Math.min(i, a, o), l = (u + d) / 2, u === d ? s = c = 0 : (f = u - d, c = l > .5 ? f / (2 - u - d) : f / (u + d), s = u === i ? (a - o) / f + (a < o ? 6 : 0) : u === a ? (o - i) / f + 2 : (i - a) / f + 4, s *= 60), r[0] = ~~(s + .5), r[1] = ~~(c * 100 + .5), r[2] = ~~(l * 100 + .5)), n && r.length < 4 && (r[3] = 1), r;
}, Lm = function(e) {
	var t = [], n = [], r = -1;
	return e.split(zm).forEach(function(e) {
		var i = e.match(Rf) || [];
		t.push.apply(t, i), n.push(r += i.length + 1);
	}), t.c = n, t;
}, Rm = function(e, t, n) {
	var r = "", i = (e + r).match(zm), a = t ? "hsla(" : "rgba(", o = 0, s, c, l, u;
	if (!i) return e;
	if (i = i.map(function(e) {
		return (e = Im(e, t, 1)) && a + (t ? e[0] + "," + e[1] + "%," + e[2] + "%," + e[3] : e.join(",")) + ")";
	}), n && (l = Lm(e), s = n.c, s.join(r) !== l.c.join(r))) for (c = e.replace(zm, "1").split(Rf), u = c.length - 1; o < u; o++) r += c[o] + (~s.indexOf(o) ? i.shift() || a + "0,0,0,0)" : (l.length ? l : i.length ? i : n).shift());
	if (!c) for (c = e.split(zm), u = c.length - 1; o < u; o++) r += c[o] + i[o];
	return r + c[u];
}, zm = function() {
	var e = "(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3,4}){1,2}\\b", t;
	for (t in Pm) e += "|" + t + "\\b";
	return RegExp(e + ")", "gi");
}(), Bm = /hsl[a]?\(/, Vm = function(e) {
	var t = e.join(" "), n;
	if (zm.lastIndex = 0, zm.test(t)) return n = Bm.test(t), e[1] = Rm(e[1], n), e[0] = Rm(e[0], n, Lm(e[1])), !0;
}, Hm, Um = function() {
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
			Yf && (!Gf && Af() && (Wf = Gf = window, Kf = Wf.document || {}, qf.gsap = qh, (Wf.gsapVersions || (Wf.gsapVersions = [])).push(qh.version), Xf(Jf || Wf.GreenSockGlobals || !Wf.gsap && Wf || {}), jm.forEach(Mm)), u = typeof requestAnimationFrame < "u" && requestAnimationFrame, c && d.sleep(), l = u || function(e) {
				return setTimeout(e, o - d.time * 1e3 + 1 | 0);
			}, Hm = 1, m(2));
		},
		sleep: function() {
			(u ? cancelAnimationFrame : clearTimeout)(c), Hm = 0, l = ep;
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
			return d.remove(e), s[n ? "unshift" : "push"](r), Wm(), r;
		},
		remove: function(e, t) {
			~(t = s.indexOf(e)) && s.splice(t, 1) && p >= t && p--;
		},
		_listeners: s
	}, d;
}(), Wm = function() {
	return !Hm && Um.wake();
}, Gm = {}, Km = /^[\d.\-M][\d.\-,\s]/, qm = /["']/g, Jm = function(e) {
	for (var t = {}, n = e.substr(1, e.length - 3).split(":"), r = n[0], i = 1, a = n.length, o, s, c; i < a; i++) s = n[i], o = i === a - 1 ? s.length : s.lastIndexOf(","), c = s.substr(0, o), t[r] = isNaN(c) ? c.replace(qm, "").trim() : +c, r = s.substr(o + 1).trim();
	return t;
}, Ym = function(e) {
	var t = e.indexOf("(") + 1, n = e.indexOf(")"), r = e.indexOf("(", t);
	return e.substring(t, ~r && r < n ? e.indexOf(")", n + 1) : n);
}, Xm = function(e) {
	var t = (e + "").split("("), n = Gm[t[0]];
	return n && t.length > 1 && n.config ? n.config.apply(null, ~e.indexOf("{") ? [Jm(t[1])] : Ym(e).split(",").map(wp)) : Gm._CE && Km.test(e) ? Gm._CE("", e) : n;
}, Zm = function(e) {
	return function(t) {
		return 1 - e(1 - t);
	};
}, Qm = function(e, t) {
	return e && (Tf(e) ? e : Gm[e] || Xm(e)) || t;
}, $m = function(e, t, n, r) {
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
	return gp(e, function(e) {
		for (var t in Gm[e] = qf[e] = i, Gm[a = e.toLowerCase()] = n, i) Gm[a + (t === "easeIn" ? ".in" : t === "easeOut" ? ".out" : ".inOut")] = Gm[e + "." + t] = i[t];
	}), i;
}, eh = function(e) {
	return function(t) {
		return t < .5 ? (1 - e(1 - t * 2)) / 2 : .5 + e((t - .5) * 2) / 2;
	};
}, th = function e(t, n, r) {
	var i = n >= 1 ? n : 1, a = (r || (t ? .3 : .45)) / (n < 1 ? n : 1), o = a / vf * (Math.asin(1 / i) || 0), s = function(e) {
		return e === 1 ? 1 : i * 2 ** (-10 * e) * Cf((e - o) * a) + 1;
	}, c = t === "out" ? s : t === "in" ? function(e) {
		return 1 - s(1 - e);
	} : eh(s);
	return a = vf / a, c.config = function(n, r) {
		return e(t, n, r);
	}, c;
}, nh = function e(t, n) {
	n === void 0 && (n = 1.70158);
	var r = function(e) {
		return e ? --e * e * ((n + 1) * e + n) + 1 : 0;
	}, i = t === "out" ? r : t === "in" ? function(e) {
		return 1 - r(1 - e);
	} : eh(r);
	return i.config = function(n) {
		return e(t, n);
	}, i;
};
gp("Linear,Quad,Cubic,Quart,Quint,Strong", function(e, t) {
	var n = t < 5 ? t + 1 : t;
	$m(e + ",Power" + (n - 1), t ? function(e) {
		return e ** +n;
	} : function(e) {
		return e;
	}, function(e) {
		return 1 - (1 - e) ** n;
	}, function(e) {
		return e < .5 ? (e * 2) ** n / 2 : 1 - ((1 - e) * 2) ** n / 2;
	});
}), Gm.Linear.easeNone = Gm.none = Gm.Linear.easeIn, $m("Elastic", th("in"), th("out"), th()), (function(e, t) {
	var n = 1 / t, r = 2 * n, i = 2.5 * n, a = function(a) {
		return a < n ? e * a * a : a < r ? e * (a - 1.5 / t) ** 2 + .75 : a < i ? e * (a -= 2.25 / t) * a + .9375 : e * (a - 2.625 / t) ** 2 + .984375;
	};
	$m("Bounce", function(e) {
		return 1 - a(1 - e);
	}, a);
})(7.5625, 2.75), $m("Expo", function(e) {
	return 2 ** (10 * (e - 1)) * e + e * e * e * e * e * e * (1 - e);
}), $m("Circ", function(e) {
	return -(xf(1 - e * e) - 1);
}), $m("Sine", function(e) {
	return e === 1 ? 1 : -Sf(e * yf) + 1;
}), $m("Back", nh("in"), nh("out"), nh()), Gm.SteppedEase = Gm.steps = qf.SteppedEase = { config: function(e, t) {
	e === void 0 && (e = 1);
	var n = 1 / e, r = e + +!t, i = +!!t, a = 1 - _f;
	return function(e) {
		return ((r * am(0, a, e) | 0) + i) * n;
	};
} }, ff.ease = Gm["quad.out"], gp("onComplete,onUpdate,onStart,onRepeat,onReverseComplete,onInterrupt", function(e) {
	return fp += e + "," + e + "Params,";
});
var rh = function(e, t) {
	this.id = bf++, e._gsap = this, this.target = e, this.harness = t, this.get = t ? t.get : hp, this.set = t ? t.getSetter : wh;
}, ih = /*#__PURE__*/ function() {
	function e(e) {
		this.vars = e, this._delay = +e.delay || 0, (this._repeat = e.repeat === Infinity ? -2 : e.repeat || 0) && (this._rDelay = e.repeatDelay || 0, this._yoyo = !!e.yoyo || !!e.yoyoEase), this._ts = 1, $p(this, +e.duration, 1, 1), this.data = e.data, hf && (this._ctx = hf, hf.data.push(this)), Hm || Um.wake();
	}
	var t = e.prototype;
	return t.delay = function(e) {
		return e || e === 0 ? (this.parent && this.parent.smoothChildTiming && this.startTime(this._start + e - this._delay), this._delay = e, this) : this._delay;
	}, t.duration = function(e) {
		return arguments.length ? this.totalDuration(this._repeat > 0 ? e + (e + this._rDelay) * this._repeat : e) : this.totalDuration() && this._dur;
	}, t.totalDuration = function(e) {
		return arguments.length ? (this._dirty = 0, $p(this, this._repeat < 0 ? e : (e - this._repeat * this._rDelay) / (this._repeat + 1))) : this._tDur;
	}, t.totalTime = function(e, t) {
		if (Wm(), !arguments.length) return this._tTime;
		var n = this._dp;
		if (n && n.smoothChildTiming && this._ts) {
			for (Wp(this, e), !n._dp || n.parent || Gp(n, this); n && n.parent;) n.parent._time !== n._start + (n._ts >= 0 ? n._tTime / n._ts : (n.totalDuration() - n._tTime) / -n._ts) && n.totalTime(n._tTime, !0), n = n.parent;
			!this.parent && this._dp.autoRemoveChildren && (this._ts > 0 && e < this._tDur || this._ts < 0 && e > 0 || !this._tDur && !e) && Kp(this._dp, this, this._start - this._delay);
		}
		return (this._tTime !== e || !this._dur && !t || this._initted && Math.abs(this._zTime) === _f || !this._initted && this._dur && e || !e && !this._initted && (this.add || this._ptLookup)) && (this._ts || (this._pTime = e), Cp(this, e, t)), this;
	}, t.time = function(e, t) {
		return arguments.length ? this.totalTime(Math.min(this.totalDuration(), e + Bp(this)) % (this._dur + this._rDelay) || (e ? this._dur : 0), t) : this._time;
	}, t.totalProgress = function(e, t) {
		return arguments.length ? this.totalTime(this.totalDuration() * e, t) : this.totalDuration() ? Math.min(1, this._tTime / this._tDur) : this.rawTime() >= 0 && this._initted ? 1 : 0;
	}, t.progress = function(e, t) {
		return arguments.length ? this.totalTime(this.duration() * (this._yoyo && !(this.iteration() & 1) ? 1 - e : e) + Bp(this), t) : this.duration() ? Math.min(1, this._time / this._dur) : +(this.rawTime() > 0);
	}, t.iteration = function(e, t) {
		var n = this.duration() + this._rDelay;
		return arguments.length ? this.totalTime(this._time + (e - 1) * n, t) : this._repeat ? Vp(this._tTime, n) + 1 : 1;
	}, t.timeScale = function(e, t) {
		if (!arguments.length) return this._rts === -_f ? 0 : this._rts;
		if (this._rts === e) return this;
		var n = this.parent && this._ts ? Hp(this.parent._time, this) : this._tTime, r = this._rts < 0;
		this._rts = +e || 0, this._ts = this._ps || e === -_f ? 0 : this._rts;
		var i = this.totalDuration();
		return (r !== this._rts < 0 || n > 0 && n < i) && this.totalTime(am(-Math.abs(this._delay), i, n), t !== !1), Up(this), Lp(this);
	}, t.paused = function(e) {
		if (!arguments.length) return this._ps;
		if (this._ps !== e) {
			if (this._ps = e, e) this._pTime = this._tTime || Math.max(-this._delay, this.rawTime()), this._ts = this._act = 0;
			else {
				Wm(), this._ts = this._rts;
				var t = this.parent && !this.parent.smoothChildTiming ? this.rawTime() : this._tTime || this._pTime, n = this.progress() === 1 && Math.abs(this._zTime) !== _f, r;
				if (n) for (this._tTime -= _f, r = this._first; r;) {
					if (!r._dur && r._zTime < 0 && r._ts && r._start <= t + _f) {
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
			this._start = vp(e);
			var t = this.parent || this._dp;
			return t && (t._sort || !this.parent) && Kp(t, this, this._start - this._delay), this;
		}
		return this._start;
	}, t.endTime = function(e) {
		return this._start + (kf(e) ? this.totalDuration() : this.duration()) / Math.abs(this._ts || 1);
	}, t.rawTime = function(e) {
		var t = this.parent || this._dp;
		return t ? e && (!this._ts || this._repeat && this._time && this.totalProgress() < 1) ? this._tTime % (this._dur + this._rDelay) : this._ts ? Hp(t.rawTime(e), this) : this._tTime : this._tTime;
	}, t.revert = function(e) {
		e === void 0 && (e = rp);
		var t = mf;
		return mf = e, Sp(this) && (this.timeline && this.timeline.revert(e), this.totalTime(-.01, e.suppressEvents)), this.data !== "nested" && e.kill !== !1 && this.kill(), mf = t, this;
	}, t.globalTime = function(e) {
		for (var t = this, n = arguments.length ? e : t.rawTime(); t;) n = t._start + n / (Math.abs(t._ts) || 1), t = t._dp;
		return !this.parent && this._sat ? this._sat.globalTime(e) : n;
	}, t.repeat = function(e) {
		return arguments.length ? (this._repeat = e === Infinity ? -2 : e, em(this)) : this._repeat === -2 ? Infinity : this._repeat;
	}, t.repeatDelay = function(e) {
		if (arguments.length) {
			var t = this._time;
			return this._rDelay = e, em(this), t ? this.time(t) : this;
		}
		return this._rDelay;
	}, t.yoyo = function(e) {
		return arguments.length ? (this._yoyo = e, this) : this._yoyo;
	}, t.seek = function(e, t) {
		return this.totalTime(nm(this, e), kf(t));
	}, t.restart = function(e, t) {
		return this.play().totalTime(e ? -this._delay : 0, kf(t)), this._dur || (this._zTime = -_f), this;
	}, t.play = function(e, t) {
		return e != null && this.seek(e, t), this.reversed(!1).paused(!1);
	}, t.reverse = function(e, t) {
		return e != null && this.seek(e || this.totalDuration(), t), this.reversed(!0).paused(!1);
	}, t.pause = function(e, t) {
		return e != null && this.seek(e, t), this.paused(!0);
	}, t.resume = function() {
		return this.paused(!1);
	}, t.reversed = function(e) {
		return arguments.length ? (!!e !== this.reversed() && this.timeScale(-this._rts || (e ? -_f : 0)), this) : this._rts < 0;
	}, t.invalidate = function() {
		return this._initted = this._act = 0, this._zTime = -_f, this;
	}, t.isActive = function() {
		var e = this.parent || this._dp, t = this._start, n;
		return !!(!e || this._ts && this._initted && e.isActive() && (n = e.rawTime(!0)) >= t && n < this.endTime(!0) - _f);
	}, t.eventCallback = function(e, t, n) {
		var r = this.vars;
		return arguments.length > 1 ? (t ? (r[e] = t, n && (r[e + "Params"] = n), e === "onUpdate" && (this._onUpdate = t)) : delete r[e], this) : r[e];
	}, t.then = function(e) {
		var t = this, n = t._prom;
		return new Promise(function(r) {
			var i = Tf(e) ? e : Tp, a = function() {
				var e = t.then;
				t.then = null, n && n(), Tf(i) && (i = i(t)) && (i.then || i === t) && (t.then = e), r(i), t.then = e;
			};
			t._initted && t.totalProgress() === 1 && t._ts >= 0 || !t._tTime && t._ts < 0 ? a() : t._prom = a;
		});
	}, t.kill = function() {
		km(this);
	}, e;
}();
Ep(ih.prototype, {
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
	_zTime: -_f,
	_prom: 0,
	_ps: !1,
	_rts: 1
});
var ah = /*#__PURE__*/ function(e) {
	uf(t, e);
	function t(t, n) {
		var r;
		return t === void 0 && (t = {}), r = e.call(this, t) || this, r.labels = {}, r.smoothChildTiming = !!t.smoothChildTiming, r.autoRemoveChildren = !!t.autoRemoveChildren, r._sort = kf(t.sortChildren), Uf && Kp(t.parent || Uf, lf(r), n), t.reversed && r.reverse(), t.paused && r.paused(!0), t.scrollTrigger && qp(lf(r), t.scrollTrigger), r;
	}
	var n = t.prototype;
	return n.to = function(e, t, n) {
		return rm(0, arguments, this), this;
	}, n.from = function(e, t, n) {
		return rm(1, arguments, this), this;
	}, n.fromTo = function(e, t, n, r) {
		return rm(2, arguments, this), this;
	}, n.set = function(e, t, n) {
		return t.duration = 0, t.parent = this, jp(t).repeatDelay || (t.repeat = 0), t.immediateRender = !!t.immediateRender, new yh(e, t, nm(this, n), 1), this;
	}, n.call = function(e, t, n) {
		return Kp(this, yh.delayedCall(0, e, t), n);
	}, n.staggerTo = function(e, t, n, r, i, a, o) {
		return n.duration = t, n.stagger = n.stagger || r, n.onComplete = a, n.onCompleteParams = o, n.parent = this, new yh(e, n, nm(this, i)), this;
	}, n.staggerFrom = function(e, t, n, r, i, a, o) {
		return n.runBackwards = 1, jp(n).immediateRender = kf(n.immediateRender), this.staggerTo(e, t, n, r, i, a, o);
	}, n.staggerFromTo = function(e, t, n, r, i, a, o, s) {
		return r.startAt = n, jp(r).immediateRender = kf(r.immediateRender), this.staggerTo(e, t, r, i, a, o, s);
	}, n.render = function(e, t, n) {
		var r = this._time, i = this._dirty ? this.totalDuration() : this._tDur, a = this._dur, o = e <= 0 ? 0 : vp(e), s = this._zTime < 0 != e < 0 && (this._initted || !a), c, l, u, d, f, p, m, h, g, _, v, y;
		if (this !== Uf && o > i && e >= 0 && (o = i), o !== this._tTime || n || s) {
			if (r !== this._time && a && (o += this._time - r, e += this._time - r), c = o, g = this._start, h = this._ts, p = !h, s && (a || (r = this._zTime), (e || !t) && (this._zTime = e)), this._repeat) {
				if (v = this._yoyo, f = a + this._rDelay, this._repeat < -1 && e < 0) return this.totalTime(f * 100 + e, t, n);
				if (c = vp(o % f), o === i ? (d = this._repeat, c = a) : (_ = vp(o / f), d = ~~_, d && d === _ && (c = a, d--), c > a && (c = a)), _ = Vp(this._tTime, f), !r && this._tTime && _ !== d && this._tTime - _ * f - this._dur <= 0 && (_ = d), v && d & 1 && (c = a - c, y = 1), d !== _ && !this._lock) {
					var b = v && _ & 1, x = b === (v && d & 1);
					if (d < _ && (b = !b), r = b ? 0 : o % a ? a : o, this._lock = 1, this.render(r || (y ? 0 : vp(d * f)), t, !a)._lock = 0, this._tTime = o, !t && this.parent && Om(this, "onRepeat"), this.vars.repeatRefresh && !y && (this.invalidate()._lock = 1, _ = d), r && r !== this._time || p !== !this._ts || this.vars.onRepeat && !this.parent && !this._act || (a = this._dur, i = this._tDur, x && (this._lock = 2, r = b ? a : -1e-4, this.render(r, !0), this.vars.repeatRefresh && !y && this.invalidate()), this._lock = 0, !this._ts && !p)) return this;
				}
			}
			if (this._hasPause && !this._forcing && this._lock < 2 && (m = Qp(this, vp(r), vp(c)), m && (o -= c - (c = m._start))), this._tTime = o, this._time = c, this._act = !!h, this._initted || (this._onUpdate = this.vars.onUpdate, this._initted = 1, this._zTime = e, r = 0), !r && o && a && !t && !_ && (Om(this, "onStart"), this._tTime !== o)) return this;
			if (c >= r && e >= 0) for (l = this._first; l;) {
				if (u = l._next, (l._act || c >= l._start) && l._ts && m !== l) {
					if (l.parent !== this) return this.render(e, t, n);
					if (l.render(l._ts > 0 ? (c - l._start) * l._ts : (l._dirty ? l.totalDuration() : l._tDur) + (c - l._start) * l._ts, t, n), c !== this._time || !this._ts && !p) {
						m = 0, u && (o += this._zTime = -_f);
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
						if (l.render(l._ts > 0 ? (S - l._start) * l._ts : (l._dirty ? l.totalDuration() : l._tDur) + (S - l._start) * l._ts, t, n || mf && Sp(l)), c !== this._time || !this._ts && !p) {
							m = 0, u && (o += this._zTime = S ? -_f : _f);
							break;
						}
					}
					l = u;
				}
			}
			if (m && !t && (this.pause(), m.render(c >= r ? 0 : -_f)._zTime = c >= r ? 1 : -1, this._ts)) return this._start = g, Up(this), this.render(e, t, n);
			this._onUpdate && !t && Om(this, "onUpdate", !0), (o === i && this._tTime >= this.totalDuration() || !o && r) && (g !== this._start && Math.abs(h) === Math.abs(this._ts) || this._lock || ((e || !a) && (o === i && this._ts > 0 || !o && this._ts < 0) && Fp(this, 1), t || e < 0 && !r || !o && !r && i || (Om(this, o === i && e >= 0 ? "onComplete" : "onReverseComplete", !0), this._prom && !(o < i && this.timeScale() > 0) && this._prom())));
		}
		return this;
	}, n.add = function(e, t) {
		var n = this;
		if (Ef(t) || (t = nm(this, t, e)), !(e instanceof ih)) {
			if (Nf(e)) return e.forEach(function(e) {
				return n.add(e, t);
			}), this;
			if (wf(e)) return this.addLabel(e, t);
			if (Tf(e)) e = yh.delayedCall(0, e);
			else return this;
		}
		return this === e ? this : Kp(this, e, t);
	}, n.getChildren = function(e, t, n, r) {
		e === void 0 && (e = !0), t === void 0 && (t = !0), n === void 0 && (n = !0), r === void 0 && (r = -gf);
		for (var i = [], a = this._first; a;) a._start >= r && (a instanceof yh ? t && i.push(a) : (n && i.push(a), e && i.push.apply(i, a.getChildren(!0, t, n)))), a = a._next;
		return i;
	}, n.getById = function(e) {
		for (var t = this.getChildren(1, 1, 1), n = t.length; n--;) if (t[n].vars.id === e) return t[n];
	}, n.remove = function(e) {
		return wf(e) ? this.removeLabel(e) : Tf(e) ? this.killTweensOf(e) : (e.parent === this && Pp(this, e), e === this._recent && (this._recent = this._last), Ip(this));
	}, n.totalTime = function(t, n) {
		return arguments.length ? (this._forcing = 1, !this._dp && this._ts && (this._start = vp(Um.time - (this._ts > 0 ? t / this._ts : (this.totalDuration() - t) / -this._ts))), e.prototype.totalTime.call(this, t, n), this._forcing = 0, this) : this._tTime;
	}, n.addLabel = function(e, t) {
		return this.labels[e] = nm(this, t), this;
	}, n.removeLabel = function(e) {
		return delete this.labels[e], this;
	}, n.addPause = function(e, t, n) {
		var r = yh.delayedCall(0, t || ep, n);
		return r.data = "isPause", this._hasPause = 1, Kp(this, r, nm(this, e));
	}, n.removePause = function(e) {
		var t = this._first;
		for (e = nm(this, e); t;) t._start === e && t.data === "isPause" && Fp(t), t = t._next;
	}, n.killTweensOf = function(e, t, n) {
		for (var r = this.getTweensOf(e, n), i = r.length; i--;) uh !== r[i] && r[i].kill(e, t);
		return this;
	}, n.getTweensOf = function(e, t) {
		for (var n = [], r = dm(e), i = this._first, a = Ef(t), o; i;) i instanceof yh ? bp(i._targets, r) && (a ? (!uh || i._initted && i._ts) && i.globalTime(0) <= t && i.globalTime(i.totalDuration()) > t : !t || i.isActive()) && n.push(i) : (o = i.getTweensOf(r, t)).length && n.push.apply(n, o), i = i._next;
		return n;
	}, n.tweenTo = function(e, t) {
		t ||= {};
		var n = this, r = nm(n, e), i = t, a = i.startAt, o = i.onStart, s = i.onStartParams, c = i.immediateRender, l, u = yh.to(n, Ep({
			ease: t.ease || "none",
			lazy: !1,
			immediateRender: !1,
			time: r,
			overwrite: "auto",
			duration: t.duration || Math.abs((r - (a && "time" in a ? a.time : n._time)) / n.timeScale()) || _f,
			onStart: function() {
				if (n.pause(), !l) {
					var e = t.duration || Math.abs((r - (a && "time" in a ? a.time : n._time)) / n.timeScale());
					u._dur !== e && $p(u, e, 0, 1).render(u._time, !0, !0), l = 1;
				}
				o && o.apply(u, s || []);
			}
		}, t));
		return c ? u.render(0) : u;
	}, n.tweenFromTo = function(e, t, n) {
		return this.tweenTo(t, Ep({ startAt: { time: nm(this, e) } }, n));
	}, n.recent = function() {
		return this._recent;
	}, n.nextLabel = function(e) {
		return e === void 0 && (e = this._time), Dm(this, nm(this, e));
	}, n.previousLabel = function(e) {
		return e === void 0 && (e = this._time), Dm(this, nm(this, e), 1);
	}, n.currentLabel = function(e) {
		return arguments.length ? this.seek(e, !0) : this.previousLabel(this._time + _f);
	}, n.shiftChildren = function(e, t, n) {
		n === void 0 && (n = 0);
		var r = this._first, i = this.labels, a;
		for (e = vp(e); r;) r._start >= n && (r._start += e, r._end += e), r = r._next;
		if (t) for (a in i) i[a] >= n && (i[a] += e);
		return Ip(this);
	}, n.invalidate = function(t) {
		var n = this._first;
		for (this._lock = 0; n;) n.invalidate(t), n = n._next;
		return e.prototype.invalidate.call(this, t);
	}, n.clear = function(e) {
		e === void 0 && (e = !0);
		for (var t = this._first, n; t;) n = t._next, this.remove(t), t = n;
		return this._dp && (this._time = this._tTime = this._pTime = 0), e && (this.labels = {}), Ip(this);
	}, n.totalDuration = function(e) {
		var t = 0, n = this, r = n._last, i = gf, a, o, s;
		if (arguments.length) return n.timeScale((n._repeat < 0 ? n.duration() : n.totalDuration()) / (n.reversed() ? -e : e));
		if (n._dirty) {
			for (s = n.parent; r;) a = r._prev, r._dirty && r.totalDuration(), o = r._start, o > i && n._sort && r._ts && !n._lock ? (n._lock = 1, Kp(n, r, o - r._delay, 1)._lock = 0) : i = o, o < 0 && r._ts && (t -= o, (!s && !n._dp || s && s.smoothChildTiming) && (n._start += vp(o / n._ts), n._time -= o, n._tTime -= o), n.shiftChildren(-o, !1, -Infinity), i = 0), r._end > t && r._ts && (t = r._end), r = a;
			$p(n, n === Uf && n._time > t ? n._time : t, 1, 1), n._dirty = 0;
		}
		return n._tDur;
	}, t.updateRoot = function(e) {
		if (Uf._ts && (Cp(Uf, Hp(e, Uf)), sp = Um.frame), Um.frame >= up) {
			up += df.autoSleep || 120;
			var t = Uf._first;
			if ((!t || !t._ts) && df.autoSleep && Um._listeners.length < 2) {
				for (; t && !t._ts;) t = t._next;
				t || Um.sleep();
			}
		}
	}, t;
}(ih);
Ep(ah.prototype, {
	_lock: 0,
	_hasPause: 0,
	_forcing: 0
});
var oh = function(e, t, n, r, i, a, o) {
	var s = new Nh(this._pt, e, t, 0, 1, Dh, null, i), c = 0, l = 0, u, d, f, p, m, h, g, _;
	for (s.b = n, s.e = r, n += "", r += "", (g = ~r.indexOf("random(")) && (r = wm(r)), a && (_ = [n, r], a(_, e, t), n = _[0], r = _[1]), d = n.match(zf) || []; u = zf.exec(r);) p = u[0], m = r.substring(c, u.index), f ? f = (f + 1) % 5 : m.substr(-5) === "rgba(" && (f = 1), p !== d[l++] && (h = parseFloat(d[l - 1]) || 0, s._pt = {
		_next: s._pt,
		p: m || l === 1 ? m : ",",
		s: h,
		c: p.charAt(1) === "=" ? yp(h, p) - h : parseFloat(p) - h,
		m: f && f < 4 ? Math.round : 0
	}, c = zf.lastIndex);
	return s.c = c < r.length ? r.substring(c, r.length) : "", s.fp = o, (Bf.test(r) || g) && (s.e = 0), this._pt = s, s;
}, sh = function(e, t, n, r, i, a, o, s, c, l) {
	Tf(r) && (r = r(i || 0, e, a));
	var u = e[t], d = n === "get" ? Tf(u) ? c ? e[t.indexOf("set") || !Tf(e["get" + t.substr(3)]) ? t : "get" + t.substr(3)](c) : e[t]() : u : n, f = Tf(u) ? c ? Sh : xh : bh, p;
	if (wf(r) && (~r.indexOf("random(") && (r = wm(r)), r.charAt(1) === "=" && (p = yp(d, r) + (om(d) || 0), (p || p === 0) && (r = p))), !l || d !== r || dh) return !isNaN(d * r) && r !== "" ? (p = new Nh(this._pt, e, t, +d || 0, r - (d || 0), typeof u == "boolean" ? Eh : Th, 0, f), c && (p.fp = c), o && p.modifier(o, this, e), this._pt = p) : (!u && !(t in e) && Zf(t, r), oh.call(this, e, t, d, r, f, s || df.stringFilter, c));
}, ch = function(e, t, n, r, i) {
	if (Tf(e) && (e = gh(e, i, t, n, r)), !Of(e) || e.style && e.nodeType || Nf(e) || Mf(e)) return wf(e) ? gh(e, i, t, n, r) : e;
	var a = {}, o;
	for (o in e) a[o] = gh(e[o], i, t, n, r);
	return a;
}, lh = function(e, t, n, r, i, a) {
	var o, s, c, l;
	if (cp[e] && (o = new cp[e]()).init(i, o.rawVars ? t[e] : ch(t[e], r, i, a, n), n, r, a) !== !1 && (n._pt = s = new Nh(n._pt, i, e, 0, 1, o.render, o, 0, o.priority), n !== Am)) for (c = n._ptLookup[n._targets.indexOf(i)], l = o._props.length; l--;) c[o._props[l]] = s;
	return o;
}, uh, dh, fh = function e(t, n, r) {
	var i = t.vars, a = i.ease, o = i.startAt, s = i.immediateRender, c = i.lazy, l = i.onUpdate, u = i.runBackwards, d = i.yoyoEase, f = i.keyframes, p = i.autoRevert, m = t._dur, h = t._startAt, g = t._targets, _ = t.parent, v = _ && _.data === "nested" ? _.vars.targets : g, y = t._overwrite === "auto" && !pf, b = t.timeline, x = i.easeReverse || d, S, C, w, T, E, D, O, k, A, j, M, N, P;
	if (!b || f && a || (a = "none"), t._ease = Qm(a, ff.ease), t._rEase = x && (Qm(x) || t._ease), t._from = !b && !!i.runBackwards, t._from && (t.ratio = 1), !b || f && !i.stagger) {
		if (k = g[0] ? mp(g[0]).harness : 0, N = k && i[k.prop], S = Ap(i, ip), h && (h._zTime < 0 && h.progress(1), n < 0 && u && s && !p ? h.render(-1, !0) : h.revert(u && m ? np : tp), h._lazy = 0), o) {
			if (Fp(t._startAt = yh.set(g, Ep({
				data: "isStart",
				overwrite: !1,
				parent: _,
				immediateRender: !0,
				lazy: !h && kf(c),
				startAt: null,
				delay: 0,
				onUpdate: l && function() {
					return Om(t, "onUpdate");
				},
				stagger: 0
			}, o))), t._startAt._dp = 0, t._startAt._sat = t, n < 0 && (mf || !s && !p) && t._startAt.revert(np), s && m && n <= 0 && r <= 0) {
				n && (t._zTime = n);
				return;
			}
		} else if (u && m && !h) {
			if (n && (s = !1), w = Ep({
				overwrite: !1,
				data: "isFromStart",
				lazy: s && !h && kf(c),
				immediateRender: s,
				stagger: 0,
				parent: _
			}, S), N && (w[k.prop] = N), Fp(t._startAt = yh.set(g, w)), t._startAt._dp = 0, t._startAt._sat = t, n < 0 && (mf ? t._startAt.revert(np) : t._startAt.render(-1, !0)), t._zTime = n, !s) e(t._startAt, _f, _f);
			else if (!n) return;
		}
		for (t._pt = t._ptCache = 0, c = m && kf(c) || c && !m, C = 0; C < g.length; C++) {
			if (E = g[C], O = E._gsap || pp(g)[C]._gsap, t._ptLookup[C] = j = {}, op[O.id] && ap.length && xp(), M = v === g ? C : v.indexOf(E), k && (A = new k()).init(E, N || S, t, M, v) !== !1 && (t._pt = T = new Nh(t._pt, E, A.name, 0, 1, A.render, A, 0, A.priority), A._props.forEach(function(e) {
				j[e] = T;
			}), A.priority && (D = 1)), !k || N) for (w in S) cp[w] && (A = lh(w, S, t, M, E, v)) ? A.priority && (D = 1) : j[w] = T = sh.call(t, E, w, "get", S[w], M, v, 0, i.stringFilter);
			t._op && t._op[C] && t.kill(E, t._op[C]), y && t._pt && (uh = t, Uf.killTweensOf(E, j, t.globalTime(n)), P = !t.parent, uh = 0), t._pt && c && (op[O.id] = 1);
		}
		D && Mh(t), t._onInit && t._onInit(t);
	}
	t._onUpdate = l, t._initted = (!t._op || t._pt) && !P, f && n <= 0 && b.render(gf, !0, !0);
}, ph = function(e, t, n, r, i, a, o, s) {
	var c = (e._pt && e._ptCache || (e._ptCache = {}))[t], l, u, d, f;
	if (!c) for (c = e._ptCache[t] = [], d = e._ptLookup, f = e._targets.length; f--;) {
		if (l = d[f][t], l && l.d && l.d._pt) for (l = l.d._pt; l && l.p !== t && l.fp !== t;) l = l._next;
		if (!l) return dh = 1, e.vars[t] = "+=0", fh(e, o), dh = 0, s ? Qf(t + " not eligible for reset. Try splitting into individual properties") : 1;
		c.push(l);
	}
	for (f = c.length; f--;) u = c[f], l = u._pt || u, l.s = (r || r === 0) && !i ? r : l.s + (r || 0) + a * l.c, l.c = n - l.s, u.e && (u.e = _p(n) + om(u.e)), u.b && (u.b = l.s + om(u.b));
}, mh = function(e, t) {
	var n = e[0] ? mp(e[0]).harness : 0, r = n && n.aliases, i, a, o, s;
	if (!r) return t;
	for (a in i = Op({}, t), r) if (a in i) for (s = r[a].split(","), o = s.length; o--;) i[s[o]] = i[a];
	return i;
}, hh = function(e, t, n, r) {
	var i = t.ease || r || "power1.inOut", a, o;
	if (Nf(t)) o = n[e] || (n[e] = []), t.forEach(function(e, n) {
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
}, gh = function(e, t, n, r, i) {
	return Tf(e) ? e.call(t, n, r, i) : wf(e) && ~e.indexOf("random(") ? wm(e) : e;
}, _h = fp + "repeat,repeatDelay,yoyo,repeatRefresh,yoyoEase,easeReverse,autoRevert", vh = {};
gp(_h + ",id,stagger,delay,duration,paused,scrollTrigger", function(e) {
	return vh[e] = 1;
}), _h = _h.split(",");
var yh = /*#__PURE__*/ function(e) {
	uf(t, e);
	function t(t, n, r, i) {
		var a;
		typeof n == "number" && (r.duration = n, n = r, r = null), a = e.call(this, i ? n : jp(n)) || this;
		var o = a.vars, s = o.duration, c = o.delay, l = o.immediateRender, u = o.stagger, d = o.overwrite, f = o.keyframes, p = o.defaults, m = o.scrollTrigger, h = n.parent || Uf, g = (Nf(t) || Mf(t) ? Ef(t[0]) : "length" in n) ? [t] : dm(t), _, v, y, b, x, S, C, w;
		if (a._targets = g.length ? pp(g) : Qf("GSAP target " + t + " not found. https://gsap.com", !df.nullTargetWarn) || [], a._ptLookup = [], a._overwrite = d, f || u || jf(s) || jf(c)) {
			n = a.vars;
			var T = n.easeReverse || n.yoyoEase;
			if (_ = a.timeline = new ah({
				data: "nested",
				defaults: p || {},
				targets: h && h.data === "nested" ? h.vars.targets : g
			}), _.kill(), _.parent = _._dp = lf(a), _._start = 0, u || jf(s) || jf(c)) {
				if (b = g.length, C = u && mm(u), Of(u)) for (x in u) ~_h.indexOf(x) && (w ||= {}, w[x] = u[x]);
				for (v = 0; v < b; v++) y = Ap(n, vh), y.stagger = 0, T && (y.easeReverse = T), w && Op(y, w), S = g[v], y.duration = +gh(s, lf(a), v, S, g), y.delay = (+gh(c, lf(a), v, S, g) || 0) - a._delay, !u && b === 1 && y.delay && (a._delay = c = y.delay, a._start += c, y.delay = 0), _.to(S, y, C ? C(v, S, g) : 0), _._ease = Gm.none;
				_.duration() ? s = c = 0 : a.timeline = 0;
			} else if (f) {
				jp(Ep(_.vars.defaults, { ease: "none" })), _._ease = Qm(f.ease || n.ease || "none");
				var E = 0, D, O, k;
				if (Nf(f)) f.forEach(function(e) {
					return _.to(g, e, ">");
				}), _.duration();
				else {
					for (x in y = {}, f) x === "ease" || x === "easeEach" || hh(x, f[x], y, f.easeEach);
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
		return d === !0 && !pf && (uh = lf(a), Uf.killTweensOf(g), uh = 0), Kp(h, lf(a), r), n.reversed && a.reverse(), n.paused && a.paused(!0), (l || !s && !f && a._start === vp(h._time) && kf(l) && zp(lf(a)) && h.data !== "nested") && (a._tTime = -_f, a.render(Math.max(0, -c) || 0)), m && qp(lf(a), m), a;
	}
	var n = t.prototype;
	return n.render = function(e, t, n) {
		var r = this._time, i = this._tDur, a = this._dur, o = e < 0, s = e > i - _f && !o ? i : e < _f ? 0 : e, c, l, u, d, f, p, m, h;
		if (!a) Zp(this, e, t, n);
		else if (s !== this._tTime || !e || n || !this._initted && this._tTime || this._startAt && this._zTime < 0 !== o || this._lazy) {
			if (c = s, h = this.timeline, this._repeat) {
				if (d = a + this._rDelay, this._repeat < -1 && o) return this.totalTime(d * 100 + e, t, n);
				if (c = vp(s % d), s === i ? (u = this._repeat, c = a) : (f = vp(s / d), u = ~~f, u && u === f ? (c = a, u--) : c > a && (c = a)), p = this._yoyo && u & 1, p && (c = a - c), f = Vp(this._tTime, d), c === r && !n && this._initted && u === f) return this._tTime = s, this;
				u !== f && this.vars.repeatRefresh && !p && !this._lock && c !== d && this._initted && (this._lock = n = 1, this.render(vp(d * u), !0).invalidate()._lock = 0);
			}
			if (!this._initted) {
				if (Jp(this, o ? e : c, n, t, s)) return this._tTime = 0, this;
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
			if (this._from && (this.ratio = m = 1 - m), this._tTime = s, this._time = c, !this._act && this._ts && (this._act = 1, this._lazy = 0), !r && s && !t && !f && (Om(this, "onStart"), this._tTime !== s)) return this;
			for (l = this._pt; l;) l.r(m, l.d), l = l._next;
			h && h.render(e < 0 ? e : h._dur * h._ease(c / this._dur), t, n) || this._startAt && (this._zTime = e), this._onUpdate && !t && (o && Rp(this, e, t, n), Om(this, "onUpdate")), this._repeat && u !== f && this.vars.onRepeat && !t && this.parent && Om(this, "onRepeat"), s !== this._tDur && s || this._tTime !== s || (o && !this._onUpdate && Rp(this, e, !0, !0), (e || !a) && (s === this._tDur && this._ts > 0 || !s && this._ts < 0) && Fp(this, 1), !t && (!o || r) && (s || r || p) && (Om(this, s === i ? "onComplete" : "onReverseComplete", !0), this._prom && !(s < i && this.timeScale() > 0) && this._prom()));
		}
		return this;
	}, n.targets = function() {
		return this._targets;
	}, n.invalidate = function(t) {
		return t && this.vars.runBackwards || (this._startAt = 0), this._pt = this._op = this._onUpdate = this._lazy = this.ratio = 0, this._ptLookup = [], this.timeline && this.timeline.invalidate(t), e.prototype.invalidate.call(this, t);
	}, n.resetTo = function(e, t, n, r, i) {
		Hm || Um.wake(), this._ts || this.play();
		var a = Math.min(this._dur, (this._dp._time - this._start) * this._ts), o;
		return this._initted || fh(this, a), o = this._ease(a / this._dur), ph(this, e, t, n, r, o, a, i) ? this.resetTo(e, t, n, r, 1) : (Wp(this, 0), this.parent || Np(this._dp, this, "_first", "_last", this._dp._sort ? "_start" : 0), this.render(0));
	}, n.kill = function(e, t) {
		if (t === void 0 && (t = "all"), !e && (!t || t === "all")) return this._lazy = this._pt = 0, this.parent ? km(this) : this.scrollTrigger && this.scrollTrigger.kill(!!mf), this;
		if (this.timeline) {
			var n = this.timeline.totalDuration();
			return this.timeline.killTweensOf(e, t, uh && uh.vars.overwrite !== !0)._first || km(this), this.parent && n !== this.timeline.totalDuration() && $p(this, this._dur * this.timeline._tDur / n, 0, 1), this;
		}
		var r = this._targets, i = e ? dm(e) : r, a = this._ptLookup, o = this._pt, s, c, l, u, d, f, p;
		if ((!t || t === "all") && Mp(r, i)) return t === "all" && (this._pt = 0), km(this);
		for (s = this._op = this._op || [], t !== "all" && (wf(t) && (d = {}, gp(t, function(e) {
			return d[e] = 1;
		}), t = d), t = mh(r, t)), p = r.length; p--;) if (~i.indexOf(r[p])) for (d in c = a[p], t === "all" ? (s[p] = t, u = c, l = {}) : (l = s[p] = s[p] || {}, u = t), u) f = c && c[d], f && ("kill" in f.d && f.d.kill(d) !== !0 || Pp(this, f, "_pt"), delete c[d]), l !== "all" && (l[d] = 1);
		return this._initted && !this._pt && o && km(this), this;
	}, t.to = function(e, n) {
		return new t(e, n, arguments[2]);
	}, t.from = function(e, t) {
		return rm(1, arguments);
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
		return rm(2, arguments);
	}, t.set = function(e, n) {
		return n.duration = 0, n.repeatDelay || (n.repeat = 0), new t(e, n);
	}, t.killTweensOf = function(e, t, n) {
		return Uf.killTweensOf(e, t, n);
	}, t;
}(ih);
Ep(yh.prototype, {
	_targets: [],
	_lazy: 0,
	_startAt: 0,
	_op: 0,
	_onInit: 0
}), gp("staggerTo,staggerFrom,staggerFromTo", function(e) {
	yh[e] = function() {
		var t = new ah(), n = cm.call(arguments, 0);
		return n.splice(e === "staggerFromTo" ? 5 : 4, 0, 0), t[e].apply(t, n);
	};
});
var bh = function(e, t, n) {
	return e[t] = n;
}, xh = function(e, t, n) {
	return e[t](n);
}, Sh = function(e, t, n, r) {
	return e[t](r.fp, n);
}, Ch = function(e, t, n) {
	return e.setAttribute(t, n);
}, wh = function(e, t) {
	return Tf(e[t]) ? xh : Df(e[t]) && e.setAttribute ? Ch : bh;
}, Th = function(e, t) {
	return t.set(t.t, t.p, Math.round((t.s + t.c * e) * 1e6) / 1e6, t);
}, Eh = function(e, t) {
	return t.set(t.t, t.p, !!(t.s + t.c * e), t);
}, Dh = function(e, t) {
	var n = t._pt, r = "";
	if (!e && t.b) r = t.b;
	else if (e === 1 && t.e) r = t.e;
	else {
		for (; n;) r = n.p + (n.m ? n.m(n.s + n.c * e) : Math.round((n.s + n.c * e) * 1e4) / 1e4) + r, n = n._next;
		r += t.c;
	}
	t.set(t.t, t.p, r, t);
}, Oh = function(e, t) {
	for (var n = t._pt; n;) n.r(e, n.d), n = n._next;
}, kh = function(e, t, n, r) {
	for (var i = this._pt, a; i;) a = i._next, i.p === r && i.modifier(e, t, n), i = a;
}, Ah = function(e) {
	for (var t = this._pt, n, r; t;) r = t._next, t.p === e && !t.op || t.op === e ? Pp(this, t, "_pt") : t.dep || (n = 1), t = r;
	return !n;
}, jh = function(e, t, n, r) {
	r.mSet(e, t, r.m.call(r.tween, n, r.mt), r);
}, Mh = function(e) {
	for (var t = e._pt, n, r, i, a; t;) {
		for (n = t._next, r = i; r && r.pr > t.pr;) r = r._next;
		(t._prev = r ? r._prev : a) ? t._prev._next = t : i = t, (t._next = r) ? r._prev = t : a = t, t = n;
	}
	e._pt = i;
}, Nh = /*#__PURE__*/ function() {
	function e(e, t, n, r, i, a, o, s, c) {
		this.t = t, this.s = r, this.c = i, this.p = n, this.r = a || Th, this.d = o || this, this.set = s || bh, this.pr = c || 0, this._next = e, e && (e._prev = this);
	}
	var t = e.prototype;
	return t.modifier = function(e, t, n) {
		this.mSet = this.mSet || this.set, this.set = jh, this.m = e, this.mt = n, this.tween = t;
	}, e;
}();
gp(fp + "parent,duration,ease,delay,overwrite,runBackwards,startAt,yoyo,immediateRender,repeat,repeatDelay,data,paused,reversed,lazy,callbackScope,stringFilter,id,yoyoEase,stagger,inherit,repeatRefresh,keyframes,autoRevert,scrollTrigger,easeReverse", function(e) {
	return ip[e] = 1;
}), qf.TweenMax = qf.TweenLite = yh, qf.TimelineLite = qf.TimelineMax = ah, Uf = new ah({
	sortChildren: !1,
	defaults: ff,
	autoRemoveChildren: !0,
	id: "root",
	smoothChildTiming: !0
}), df.stringFilter = Vm;
var Ph = [], Fh = {}, Ih = [], Lh = 0, Rh = 0, zh = function(e) {
	return (Fh[e] || Ih).map(function(e) {
		return e();
	});
}, Bh = function() {
	var e = Date.now(), t = [];
	e - Lh > 2 && (zh("matchMediaInit"), Ph.forEach(function(e) {
		var n = e.queries, r = e.conditions, i, a, o, s;
		for (a in n) i = Wf.matchMedia(n[a]).matches, i && (o = 1), i !== r[a] && (r[a] = i, s = 1);
		s && (e.revert(), o && t.push(e));
	}), zh("matchMediaRevert"), t.forEach(function(e) {
		return e.onMatch(e, function(t) {
			return e.add(null, t);
		});
	}), Lh = e, zh("matchMedia"));
}, Vh = /*#__PURE__*/ function() {
	function e(e, t) {
		this.selector = t && fm(t), this.data = [], this._r = [], this.isReverted = !1, this.id = Rh++, e && this.add(e);
	}
	var t = e.prototype;
	return t.add = function(e, t, n) {
		Tf(e) && (n = t, t = e, e = Tf);
		var r = this, i = function() {
			var e = hf, i = r.selector, a;
			return e && e !== r && e.data.push(r), n && (r.selector = fm(n)), hf = r, a = t.apply(r, arguments), Tf(a) && r._r.push(a), hf = e, r.selector = i, r.isReverted = !1, a;
		};
		return r.last = i, e === Tf ? i(r, function(e) {
			return r.add(null, e);
		}) : e ? r[e] = i : i;
	}, t.ignore = function(e) {
		var t = hf;
		hf = null, e(this), hf = t;
	}, t.getTweens = function() {
		var t = [];
		return this.data.forEach(function(n) {
			return n instanceof e ? t.push.apply(t, n.getTweens()) : n instanceof yh && !(n.parent && n.parent.data === "nested") && t.push(n);
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
			}), r = n.data.length; r--;) i = n.data[r], i instanceof ah ? i.data !== "nested" && (i.scrollTrigger && i.scrollTrigger.revert(), i.kill()) : !(i instanceof yh) && i.revert && i.revert(e);
			n._r.forEach(function(t) {
				return t(e, n);
			}), n.isReverted = !0;
		})() : this.data.forEach(function(e) {
			return e.kill && e.kill();
		}), this.clear(), t) {
			for (var r = Ph.length; r--;) Ph[r].id === this.id && Ph.splice(r, 1);
			this._mqs && this._mqs.forEach(function(e) {
				return e.removeListener ? e.removeListener(Bh) : e.removeEventListener("change", Bh);
			}), this._mqs = null;
		}
	}, t.revert = function(e) {
		this.kill(e || {});
	}, e;
}(), Hh = /*#__PURE__*/ function() {
	function e(e) {
		this.contexts = [], this.scope = e, hf && hf.data.push(this);
	}
	var t = e.prototype;
	return t.add = function(e, t, n) {
		Of(e) || (e = { matches: e });
		var r = new Vh(0, n || this.scope), i = r.conditions = {}, a, o, s;
		for (o in hf && !r.selector && (r.selector = hf.selector), this.contexts.push(r), t = r.add("onMatch", t), r.queries = e, e) o === "all" ? s = 1 : (a = Wf.matchMedia(e[o]), a && (Ph.indexOf(r) < 0 && Ph.push(r), (i[o] = a.matches) && (s = 1), a.addListener ? a.addListener(Bh) : a.addEventListener("change", Bh), (r._mqs ||= []).push(a)));
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
}(), Uh = {
	registerPlugin: function() {
		[...arguments].forEach(function(e) {
			return Mm(e);
		});
	},
	timeline: function(e) {
		return new ah(e);
	},
	getTweensOf: function(e, t) {
		return Uf.getTweensOf(e, t);
	},
	getProperty: function(e, t, n, r) {
		wf(e) && (e = dm(e)[0]);
		var i = mp(e || {}).get, a = n ? Tp : wp;
		return n === "native" && (n = ""), e && (t ? a((cp[t] && cp[t].get || i)(e, t, n, r)) : function(t, n, r) {
			return a((cp[t] && cp[t].get || i)(e, t, n, r));
		});
	},
	quickSetter: function(e, t, n) {
		if (e = dm(e), e.length > 1) {
			var r = e.map(function(e) {
				return qh.quickSetter(e, t, n);
			}), i = r.length;
			return function(e) {
				for (var t = i; t--;) r[t](e);
			};
		}
		e = e[0] || {};
		var a = cp[t], o = mp(e), s = o.harness && (o.harness.aliases || {})[t] || t, c = a ? function(t) {
			var r = new a();
			Am._pt = 0, r.init(e, n ? t + n : t, Am, 0, [e]), r.render(1, r), Am._pt && Oh(1, Am);
		} : o.set(e, s);
		return a ? c : function(t) {
			return c(e, s, n ? t + n : t, o, 1);
		};
	},
	quickTo: function(e, t, n) {
		var r, i = qh.to(e, Ep((r = {}, r[t] = "+=0.1", r.paused = !0, r.stagger = 0, r), n || {})), a = function(e, n, r) {
			return i.resetTo(t, e, n, r);
		};
		return a.tween = i, a;
	},
	isTweening: function(e) {
		return Uf.getTweensOf(e, !0).length > 0;
	},
	defaults: function(e) {
		return e && e.ease && (e.ease = Qm(e.ease, ff.ease)), kp(ff, e || {});
	},
	config: function(e) {
		return kp(df, e || {});
	},
	registerEffect: function(e) {
		var t = e.name, n = e.effect, r = e.plugins, i = e.defaults, a = e.extendTimeline;
		(r || "").split(",").forEach(function(e) {
			return e && !cp[e] && !qf[e] && Qf(t + " effect requires " + e + " plugin.");
		}), lp[t] = function(e, t, r) {
			return n(dm(e), Ep(t || {}, i), r);
		}, a && (ah.prototype[t] = function(e, n, r) {
			return this.add(lp[t](e, Of(n) ? n : (r = n) && {}, this), r);
		});
	},
	registerEase: function(e, t) {
		Gm[e] = Qm(t);
	},
	parseEase: function(e, t) {
		return arguments.length ? Qm(e, t) : Gm;
	},
	getById: function(e) {
		return Uf.getById(e);
	},
	exportRoot: function(e, t) {
		e === void 0 && (e = {});
		var n = new ah(e), r, i;
		for (n.smoothChildTiming = kf(e.smoothChildTiming), Uf.remove(n), n._dp = 0, n._time = n._tTime = Uf._time, r = Uf._first; r;) i = r._next, (t || !(!r._dur && r instanceof yh && r.vars.onComplete === r._targets[0])) && Kp(n, r, r._start - r._delay), r = i;
		return Kp(Uf, n, 0), n;
	},
	context: function(e, t) {
		return e ? new Vh(e, t) : hf;
	},
	matchMedia: function(e) {
		return new Hh(e);
	},
	matchMediaRefresh: function() {
		return Ph.forEach(function(e) {
			var t = e.conditions, n, r;
			for (r in t) t[r] && (t[r] = !1, n = 1);
			n && e.revert();
		}) || Bh();
	},
	addEventListener: function(e, t) {
		var n = Fh[e] || (Fh[e] = []);
		~n.indexOf(t) || n.push(t);
	},
	removeEventListener: function(e, t) {
		var n = Fh[e], r = n && n.indexOf(t);
		r >= 0 && n.splice(r, 1);
	},
	utils: {
		wrap: Sm,
		wrapYoyo: Cm,
		distribute: mm,
		random: _m,
		snap: gm,
		normalize: bm,
		getUnit: om,
		clamp: sm,
		splitColor: Im,
		toArray: dm,
		selector: fm,
		mapRange: Tm,
		pipe: vm,
		unitize: ym,
		interpolate: Em,
		shuffle: pm
	},
	install: Xf,
	effects: lp,
	ticker: Um,
	updateRoot: ah.updateRoot,
	plugins: cp,
	globalTimeline: Uf,
	core: {
		PropTween: Nh,
		globals: $f,
		Tween: yh,
		Timeline: ah,
		Animation: ih,
		getCache: mp,
		_removeLinkedListItem: Pp,
		reverting: function() {
			return mf;
		},
		context: function(e) {
			return e && hf && (hf.data.push(e), e._ctx = hf), hf;
		},
		suppressOverwrites: function(e) {
			return pf = e;
		}
	}
};
gp("to,from,fromTo,delayedCall,set,killTweensOf", function(e) {
	return Uh[e] = yh[e];
}), Um.add(ah.updateRoot), Am = Uh.to({}, { duration: 0 });
var Wh = function(e, t) {
	for (var n = e._pt; n && n.p !== t && n.op !== t && n.fp !== t;) n = n._next;
	return n;
}, Gh = function(e, t) {
	var n = e._targets, r, i, a;
	for (r in t) for (i = n.length; i--;) a = e._ptLookup[i][r], (a &&= a.d) && (a._pt && (a = Wh(a, r)), a && a.modifier && a.modifier(t[r], e, n[i], r));
}, Kh = function(e, t) {
	return {
		name: e,
		headless: 1,
		rawVars: 1,
		init: function(e, n, r) {
			r._onInit = function(e) {
				var r, i;
				if (wf(n) && (r = {}, gp(n, function(e) {
					return r[e] = 1;
				}), n = r), t) {
					for (i in r = {}, n) r[i] = t(n[i]);
					n = r;
				}
				Gh(e, n);
			};
		}
	};
}, qh = Uh.registerPlugin({
	name: "attr",
	init: function(e, t, n, r, i) {
		var a, o, s;
		for (a in this.tween = n, t) s = e.getAttribute(a) || "", o = this.add(e, "setAttribute", (s || 0) + "", t[a], r, i, 0, 0, a), o.op = a, o.b = s, this._props.push(a);
	},
	render: function(e, t) {
		for (var n = t._pt; n;) mf ? n.set(n.t, n.p, n.b, n) : n.r(e, n.d), n = n._next;
	}
}, {
	name: "endArray",
	headless: 1,
	init: function(e, t) {
		for (var n = t.length; n--;) this.add(e, n, e[n] || 0, t[n], 0, 0, 0, 0, 0, 1);
	}
}, Kh("roundProps", hm), Kh("modifiers"), Kh("snap", gm)) || Uh;
yh.version = ah.version = qh.version = "3.15.1", Yf = 1, Af() && Wm(), Gm.Power0, Gm.Power1, Gm.Power2, Gm.Power3, Gm.Power4, Gm.Linear, Gm.Quad, Gm.Cubic, Gm.Quart, Gm.Quint, Gm.Strong, Gm.Elastic, Gm.Back, Gm.SteppedEase, Gm.Bounce, Gm.Sine, Gm.Expo, Gm.Circ;
// node_modules/gsap/CSSPlugin.js
var Jh, Yh, Xh, Zh, Qh, $h, eg, tg = function() {
	return typeof window < "u";
}, ng = {}, rg = 180 / Math.PI, ig = Math.PI / 180, ag = Math.atan2, og = 1e8, sg = /([A-Z])/g, cg = /(left|right|width|margin|padding|x)/i, lg = /[\s,\(]\S/, ug = {
	autoAlpha: "opacity,visibility",
	scale: "scaleX,scaleY",
	alpha: "opacity"
}, dg = function(e, t) {
	return t.set(t.t, t.p, Math.round((t.s + t.c * e) * 1e4) / 1e4 + t.u, t);
}, fg = function(e, t) {
	return t.set(t.t, t.p, e === 1 ? t.e : Math.round((t.s + t.c * e) * 1e4) / 1e4 + t.u, t);
}, pg = function(e, t) {
	return t.set(t.t, t.p, e ? Math.round((t.s + t.c * e) * 1e4) / 1e4 + t.u : t.b, t);
}, mg = function(e, t) {
	return t.set(t.t, t.p, e === 1 ? t.e : e ? Math.round((t.s + t.c * e) * 1e4) / 1e4 + t.u : t.b, t);
}, hg = function(e, t) {
	var n = t.s + t.c * e;
	t.set(t.t, t.p, ~~(n + (n < 0 ? -.5 : .5)) + t.u, t);
}, gg = function(e, t) {
	return t.set(t.t, t.p, e ? t.e : t.b, t);
}, _g = function(e, t) {
	return t.set(t.t, t.p, e === 1 ? t.e : t.b, t);
}, vg = function(e, t, n) {
	return e.style[t] = n;
}, yg = function(e, t, n) {
	return e.style.setProperty(t, n);
}, bg = function(e, t, n) {
	return e._gsap[t] = n;
}, xg = function(e, t, n) {
	return e._gsap.scaleX = e._gsap.scaleY = n;
}, Sg = function(e, t, n, r, i) {
	var a = e._gsap;
	a.scaleX = a.scaleY = n, a.renderTransform(i, a);
}, Cg = function(e, t, n, r, i) {
	var a = e._gsap;
	a[t] = n, a.renderTransform(i, a);
}, wg = "transform", Tg = wg + "Origin", Eg = function e(t, n) {
	var r = this, i = this.target, a = i.style, o = i._gsap;
	if (t in ng && a) {
		if (this.tfm = this.tfm || {}, t !== "transform") t = ug[t] || t, ~t.indexOf(",") ? t.split(",").forEach(function(e) {
			return r.tfm[e] = Gg(i, e);
		}) : this.tfm[t] = o.x ? o[t] : Gg(i, t), t === Tg && (this.tfm.zOrigin = o.zOrigin);
		else return ug.transform.split(",").forEach(function(t) {
			return e.call(r, t, n);
		});
		if (this.props.indexOf(wg) >= 0) return;
		o.svg && (this.svgo = i.getAttribute("data-svg-origin"), this.props.push(Tg, n, "")), t = wg;
	}
	(a || n) && this.props.push(t, n, a[t]);
}, Dg = function(e) {
	e.translate && (e.removeProperty("translate"), e.removeProperty("scale"), e.removeProperty("rotate"));
}, Og = function() {
	for (var e = this.props, t = this.target, n = t.style, r = t._gsap, i = 0, a; i < e.length; i += 3) e[i + 1] ? e[i + 1] === 2 ? t[e[i]](e[i + 2]) : t[e[i]] = e[i + 2] : e[i + 2] ? n[e[i]] = e[i + 2] : n.removeProperty(e[i].substr(0, 2) === "--" ? e[i] : e[i].replace(sg, "-$1").toLowerCase());
	if (this.tfm) {
		for (a in this.tfm) r[a] = this.tfm[a];
		r.svg && (r.renderTransform(), t.setAttribute("data-svg-origin", this.svgo || "")), i = eg(), i && i.isStart || n[wg] || (Dg(n), r.zOrigin && n[Tg] && (n[Tg] += " " + r.zOrigin + "px", r.zOrigin = 0, r.renderTransform()), r.uncache = 1);
	}
}, kg = function(e, t) {
	var n = {
		target: e,
		props: [],
		revert: Og,
		save: Eg
	};
	return e._gsap || qh.core.getCache(e), t && e.style && e.nodeType && t.split(",").forEach(function(e) {
		return n.save(e);
	}), n;
}, Ag, jg = function(e, t) {
	var n = Yh.createElementNS ? Yh.createElementNS((t || "http://www.w3.org/1999/xhtml").replace(/^https/, "http"), e) : Yh.createElement(e);
	return n && n.style ? n : Yh.createElement(e);
}, Mg = function e(t, n, r) {
	var i = getComputedStyle(t);
	return i[n] || i.getPropertyValue(n.replace(sg, "-$1").toLowerCase()) || i.getPropertyValue(n) || !r && e(t, Pg(n) || n, 1) || "";
}, Ng = "O,Moz,ms,Ms,Webkit".split(","), Pg = function(e, t, n) {
	var r = (t || Qh).style, i = 5;
	if (e in r && !n) return e;
	for (e = e.charAt(0).toUpperCase() + e.substr(1); i-- && !(Ng[i] + e in r););
	return i < 0 ? null : (i === 3 ? "ms" : i >= 0 ? Ng[i] : "") + e;
}, Fg = function() {
	tg() && window.document && (Jh = window, Yh = Jh.document, Xh = Yh.documentElement, Qh = jg("div") || { style: {} }, jg("div"), wg = Pg(wg), Tg = wg + "Origin", Qh.style.cssText = "border-width:0;line-height:0;position:absolute;padding:0", Ag = !!Pg("perspective"), eg = qh.core.reverting, Zh = 1);
}, Ig = function(e) {
	var t = e.ownerSVGElement, n = jg("svg", t && t.getAttribute("xmlns") || "http://www.w3.org/2000/svg"), r = e.cloneNode(!0), i;
	r.style.display = "block", n.appendChild(r), Xh.appendChild(n);
	try {
		i = r.getBBox();
	} catch {}
	return n.removeChild(r), Xh.removeChild(n), i;
}, Lg = function(e, t) {
	for (var n = t.length; n--;) if (e.hasAttribute(t[n])) return e.getAttribute(t[n]);
}, Rg = function(e) {
	var t, n;
	try {
		t = e.getBBox();
	} catch {
		t = Ig(e), n = 1;
	}
	return t && (t.width || t.height) || n || (t = Ig(e)), t && !t.width && !t.x && !t.y ? {
		x: +Lg(e, [
			"x",
			"cx",
			"x1"
		]) || 0,
		y: +Lg(e, [
			"y",
			"cy",
			"y1"
		]) || 0,
		width: 0,
		height: 0
	} : t;
}, zg = function(e) {
	return !(!e.getCTM || e.parentNode && !e.ownerSVGElement || !Rg(e));
}, Bg = function(e, t) {
	if (t) {
		var n = e.style, r;
		t in ng && t !== Tg && (t = wg), n.removeProperty ? (r = t.substr(0, 2), (r === "ms" || t.substr(0, 6) === "webkit") && (t = "-" + t), n.removeProperty(r === "--" ? t : t.replace(sg, "-$1").toLowerCase())) : n.removeAttribute(t);
	}
}, Vg = function(e, t, n, r, i, a) {
	var o = new Nh(e._pt, t, n, 0, 1, a ? _g : gg);
	return e._pt = o, o.b = r, o.e = i, e._props.push(n), o;
}, Hg = {
	deg: 1,
	rad: 1,
	turn: 1
}, Ug = {
	grid: 1,
	flex: 1
}, Wg = function e(t, n, r, i) {
	var a = parseFloat(r) || 0, o = (r + "").trim().substr((a + "").length) || "px", s = Qh.style, c = cg.test(n), l = t.tagName.toLowerCase() === "svg", u = (l ? "client" : "offset") + (c ? "Width" : "Height"), d = 100, f = i === "px", p = i === "%", m, h, g, _;
	if (i === o || !a || Hg[i] || Hg[o]) return a;
	if (o !== "px" && !f && (a = e(t, n, r, "px")), _ = t.getCTM && zg(t), (p || o === "%") && (ng[n] || ~n.indexOf("adius"))) return m = _ ? t.getBBox()[c ? "width" : "height"] : t[u], _p(p ? a / m * d : a / 100 * m);
	if (s[c ? "width" : "height"] = d + (f ? o : i), h = i !== "rem" && ~n.indexOf("adius") || i === "em" && t.appendChild && !l ? t : t.parentNode, _ && (h = (t.ownerSVGElement || {}).parentNode), h && h !== Yh && h.appendChild || (h = Yh.body), g = h._gsap, g && p && g.width && c && g.time === Um.time && !g.uncache) return _p(a / g.width * d);
	if (p && (n === "height" || n === "width")) {
		var v = t.style[n];
		t.style[n] = d + i, m = t[u], v ? t.style[n] = v : Bg(t, n);
	} else (p || o === "%") && !Ug[Mg(h, "display")] && (s.position = Mg(t, "position")), h === t && (s.position = "static"), h.appendChild(Qh), m = Qh[u], h.removeChild(Qh), s.position = "absolute";
	return c && p && (g = mp(h), g.time = Um.time, g.width = h[u]), _p(f ? m * a / d : m && a ? d / m * a : 0);
}, Gg = function(e, t, n, r) {
	var i;
	return Zh || Fg(), t in ug && t !== "transform" && (t = ug[t], ~t.indexOf(",") && (t = t.split(",")[0])), ng[t] && t !== "transform" ? (i = r_(e, r), i = t === "transformOrigin" ? i.svg ? i.origin : i_(Mg(e, Tg)) + " " + i.zOrigin + "px" : i[t]) : (i = e.style[t], (!i || i === "auto" || r || ~(i + "").indexOf("calc(")) && (i = Xg[t] && Xg[t](e, t, n) || Mg(e, t) || hp(e, t) || +(t === "opacity"))), n && !~(i + "").trim().indexOf(" ") ? Wg(e, t, i, n) + n : i;
}, Kg = function(e, t, n, r) {
	if (!n || n === "none") {
		var i = Pg(t, e, 1), a = i && Mg(e, i, 1);
		a && a !== n ? (t = i, n = a) : t === "borderColor" && (n = Mg(e, "borderTopColor"));
	}
	var o = new Nh(this._pt, e.style, t, 0, 1, Dh), s = 0, c = 0, l, u, d, f, p, m, h, g, _, v, y, b;
	if (o.b = n, o.e = r, n += "", r += "", r.substring(0, 6) === "var(--" && (r = Mg(e, r.substring(4, r.indexOf(")")))), r === "auto" && (m = e.style[t], e.style[t] = r, r = Mg(e, t) || r, m ? e.style[t] = m : Bg(e, t)), l = [n, r], Vm(l), n = l[0], r = l[1], d = n.match(Rf) || [], b = r.match(Rf) || [], b.length) {
		for (; u = Rf.exec(r);) h = u[0], _ = r.substring(s, u.index), p ? p = (p + 1) % 5 : (_.substr(-5) === "rgba(" || _.substr(-5) === "hsla(") && (p = 1), h !== (m = d[c++] || "") && (f = parseFloat(m) || 0, y = m.substr((f + "").length), h.charAt(1) === "=" && (h = yp(f, h) + y), g = parseFloat(h), v = h.substr((g + "").length), s = Rf.lastIndex - v.length, v || (v = v || df.units[t] || y, s === r.length && (r += v, o.e += v)), y !== v && (f = Wg(e, t, m, v) || 0), o._pt = {
			_next: o._pt,
			p: _ || c === 1 ? _ : ",",
			s: f,
			c: g - f,
			m: p && p < 4 || t === "zIndex" ? Math.round : 0
		});
		o.c = s < r.length ? r.substring(s, r.length) : "";
	} else o.r = t === "display" && r === "none" ? _g : gg;
	return Bf.test(r) && (o.e = 0), this._pt = o, o;
}, qg = {
	top: "0%",
	bottom: "100%",
	left: "0%",
	right: "100%",
	center: "50%"
}, Jg = function(e) {
	var t = e.split(" "), n = t[0], r = t[1] || "50%";
	return (n === "top" || n === "bottom" || r === "left" || r === "right") && (e = n, n = r, r = e), t[0] = qg[n] || n, t[1] = qg[r] || r, t.join(" ");
}, Yg = function(e, t) {
	if (t.tween && t.tween._time === t.tween._dur) {
		var n = t.t, r = n.style, i = t.u, a = n._gsap, o, s, c;
		if (i === "all" || i === !0) r.cssText = "", s = 1;
		else for (i = i.split(","), c = i.length; --c > -1;) o = i[c], ng[o] && (s = 1, o = o === "transformOrigin" ? Tg : wg), Bg(n, o);
		s && (Bg(n, wg), a && (a.svg && n.removeAttribute("transform"), r.scale = r.rotate = r.translate = "none", r_(n, 1), a.uncache = 1, Dg(r)));
	}
}, Xg = { clearProps: function(e, t, n, r, i) {
	if (i.data !== "isFromStart") {
		var a = e._pt = new Nh(e._pt, t, n, 0, 0, Yg);
		return a.u = r, a.pr = -10, a.tween = i, e._props.push(n), 1;
	}
} }, Zg = [
	1,
	0,
	0,
	1,
	0,
	0
], Qg = {}, $g = function(e) {
	return e === "matrix(1, 0, 0, 1, 0, 0)" || e === "none" || !e;
}, e_ = function(e) {
	var t = Mg(e, wg);
	return $g(t) ? Zg : t.substr(7).match(Lf).map(_p);
}, t_ = function(e, t) {
	var n = e._gsap || mp(e), r = e.style, i = e_(e), a, o, s, c;
	return n.svg && e.getAttribute("transform") ? (s = e.transform.baseVal.consolidate().matrix, i = [
		s.a,
		s.b,
		s.c,
		s.d,
		s.e,
		s.f
	], i.join(",") === "1,0,0,1,0,0" ? Zg : i) : (i === Zg && !e.offsetParent && e !== Xh && !n.svg && (s = r.display, r.display = "block", a = e.parentNode, a && (e.offsetParent || e.getBoundingClientRect().width) || (c = 1, o = e.nextElementSibling, Xh.appendChild(e)), i = e_(e), s ? r.display = s : Bg(e, "display"), c && (o ? a.insertBefore(e, o) : a ? a.appendChild(e) : Xh.removeChild(e))), t && i.length > 6 ? [
		i[0],
		i[1],
		i[4],
		i[5],
		i[12],
		i[13]
	] : i);
}, n_ = function(e, t, n, r, i, a) {
	var o = e._gsap, s = i || t_(e, !0), c = o.xOrigin || 0, l = o.yOrigin || 0, u = o.xOffset || 0, d = o.yOffset || 0, f = s[0], p = s[1], m = s[2], h = s[3], g = s[4], _ = s[5], v = t.split(" "), y = parseFloat(v[0]) || 0, b = parseFloat(v[1]) || 0, x, S, C, w;
	n ? s !== Zg && (S = f * h - p * m) && (C = h / S * y + b * (-m / S) + (m * _ - h * g) / S, w = y * (-p / S) + f / S * b - (f * _ - p * g) / S, y = C, b = w) : (x = Rg(e), y = x.x + (~v[0].indexOf("%") ? y / 100 * x.width : y), b = x.y + (~(v[1] || v[0]).indexOf("%") ? b / 100 * x.height : b)), r || r !== !1 && o.smooth ? (g = y - c, _ = b - l, o.xOffset = u + (g * f + _ * m) - g, o.yOffset = d + (g * p + _ * h) - _) : o.xOffset = o.yOffset = 0, o.xOrigin = y, o.yOrigin = b, o.smooth = !!r, o.origin = t, o.originIsAbsolute = !!n, e.style[Tg] = "0px 0px", a && (Vg(a, o, "xOrigin", c, y), Vg(a, o, "yOrigin", l, b), Vg(a, o, "xOffset", u, o.xOffset), Vg(a, o, "yOffset", d, o.yOffset)), e.setAttribute("data-svg-origin", y + " " + b);
}, r_ = function(e, t) {
	var n = e._gsap || new rh(e);
	if ("x" in n && !t && !n.uncache) return n;
	var r = e.style, i = n.scaleX < 0, a = "px", o = "deg", s = getComputedStyle(e), c = Mg(e, Tg) || "0", l = u = d = m = h = g = _ = v = y = 0, u, d, f = p = 1, p, m, h, g, _, v, y, b, x, S, C, w, T, E, D, O, k, A, j, M, N, P, F, I, L, ee, R, te;
	return n.svg = !!(e.getCTM && zg(e)), s.translate && ((s.translate !== "none" || s.scale !== "none" || s.rotate !== "none") && (r[wg] = (s.translate === "none" ? "" : "translate3d(" + (s.translate + " 0 0").split(" ").slice(0, 3).join(", ") + ") ") + (s.rotate === "none" ? "" : "rotate(" + s.rotate + ") ") + (s.scale === "none" ? "" : "scale(" + s.scale.split(" ").join(",") + ") ") + (s[wg] === "none" ? "" : s[wg])), r.scale = r.rotate = r.translate = "none"), S = t_(e, n.svg), n.svg && (n.uncache ? (N = e.getBBox(), c = n.xOrigin - N.x + "px " + (n.yOrigin - N.y) + "px", M = "") : M = !t && e.getAttribute("data-svg-origin"), n_(e, M || c, !!M || n.originIsAbsolute, n.smooth !== !1, S)), b = n.xOrigin || 0, x = n.yOrigin || 0, S !== Zg && (E = S[0], D = S[1], O = S[2], k = S[3], l = A = S[4], u = j = S[5], S.length === 6 ? (f = Math.sqrt(E * E + D * D), p = Math.sqrt(k * k + O * O), m = E || D ? ag(D, E) * rg : 0, _ = O || k ? ag(O, k) * rg + m : 0, _ && (p *= Math.abs(Math.cos(_ * ig))), n.svg && (l -= b - (b * E + x * O), u -= x - (b * D + x * k))) : (te = S[6], ee = S[7], F = S[8], I = S[9], L = S[10], R = S[11], l = S[12], u = S[13], d = S[14], C = ag(te, L), h = C * rg, C && (w = Math.cos(-C), T = Math.sin(-C), M = A * w + F * T, N = j * w + I * T, P = te * w + L * T, F = A * -T + F * w, I = j * -T + I * w, L = te * -T + L * w, R = ee * -T + R * w, A = M, j = N, te = P), C = ag(-O, L), g = C * rg, C && (w = Math.cos(-C), T = Math.sin(-C), M = E * w - F * T, N = D * w - I * T, P = O * w - L * T, R = k * T + R * w, E = M, D = N, O = P), C = ag(D, E), m = C * rg, C && (w = Math.cos(C), T = Math.sin(C), M = E * w + D * T, N = A * w + j * T, D = D * w - E * T, j = j * w - A * T, E = M, A = N), h && Math.abs(h) + Math.abs(m) > 359.9 && (h = m = 0, g = 180 - g), f = _p(Math.sqrt(E * E + D * D + O * O)), p = _p(Math.sqrt(j * j + te * te)), C = ag(A, j), _ = Math.abs(C) > 2e-4 ? C * rg : 0, y = R ? 1 / (R < 0 ? -R : R) : 0), n.svg && (M = e.getAttribute("transform"), n.forceCSS = e.setAttribute("transform", "") || !$g(Mg(e, wg)), M && e.setAttribute("transform", M))), Math.abs(_) > 90 && Math.abs(_) < 270 && (i ? (f *= -1, _ += m <= 0 ? 180 : -180, m += m <= 0 ? 180 : -180) : (p *= -1, _ += _ <= 0 ? 180 : -180)), t ||= n.uncache, n.x = l - ((n.xPercent = l && (!t && n.xPercent || (Math.round(e.offsetWidth / 2) === Math.round(-l) ? -50 : 0))) ? e.offsetWidth * n.xPercent / 100 : 0) + a, n.y = u - ((n.yPercent = u && (!t && n.yPercent || (Math.round(e.offsetHeight / 2) === Math.round(-u) ? -50 : 0))) ? e.offsetHeight * n.yPercent / 100 : 0) + a, n.z = d + a, n.scaleX = _p(f), n.scaleY = _p(p), n.rotation = _p(m) + o, n.rotationX = _p(h) + o, n.rotationY = _p(g) + o, n.skewX = _ + o, n.skewY = v + o, n.transformPerspective = y + a, (n.zOrigin = parseFloat(c.split(" ")[2]) || !t && n.zOrigin || 0) && (r[Tg] = i_(c)), n.xOffset = n.yOffset = 0, n.force3D = df.force3D, n.renderTransform = n.svg ? d_ : Ag ? u_ : o_, n.uncache = 0, n;
}, i_ = function(e) {
	return (e = e.split(" "))[0] + " " + e[1];
}, a_ = function(e, t, n) {
	var r = om(t);
	return _p(parseFloat(t) + parseFloat(Wg(e, "x", n + "px", r))) + r;
}, o_ = function(e, t) {
	t.z = "0px", t.rotationY = t.rotationX = "0deg", t.force3D = 0, u_(e, t);
}, s_ = "0deg", c_ = "0px", l_ = ") ", u_ = function(e, t) {
	var n = t || this, r = n.xPercent, i = n.yPercent, a = n.x, o = n.y, s = n.z, c = n.rotation, l = n.rotationY, u = n.rotationX, d = n.skewX, f = n.skewY, p = n.scaleX, m = n.scaleY, h = n.transformPerspective, g = n.force3D, _ = n.target, v = n.zOrigin, y = "", b = g === "auto" && e && e !== 1 || g === !0;
	if (v && (u !== s_ || l !== s_)) {
		var x = parseFloat(l) * ig, S = Math.sin(x), C = Math.cos(x), w;
		x = parseFloat(u) * ig, w = Math.cos(x), a = a_(_, a, S * w * -v), o = a_(_, o, -Math.sin(x) * -v), s = a_(_, s, C * w * -v + v);
	}
	h !== c_ && (y += "perspective(" + h + l_), (r || i) && (y += "translate(" + r + "%, " + i + "%) "), (b || a !== c_ || o !== c_ || s !== c_) && (y += s !== c_ || b ? "translate3d(" + a + ", " + o + ", " + s + ") " : "translate(" + a + ", " + o + l_), c !== s_ && (y += "rotate(" + c + l_), l !== s_ && (y += "rotateY(" + l + l_), u !== s_ && (y += "rotateX(" + u + l_), (d !== s_ || f !== s_) && (y += "skew(" + d + ", " + f + l_), (p !== 1 || m !== 1) && (y += "scale(" + p + ", " + m + l_), _.style[wg] = y || "translate(0, 0)";
}, d_ = function(e, t) {
	var n = t || this, r = n.xPercent, i = n.yPercent, a = n.x, o = n.y, s = n.rotation, c = n.skewX, l = n.skewY, u = n.scaleX, d = n.scaleY, f = n.target, p = n.xOrigin, m = n.yOrigin, h = n.xOffset, g = n.yOffset, _ = n.forceCSS, v = parseFloat(a), y = parseFloat(o), b, x, S, C, w;
	s = parseFloat(s), c = parseFloat(c), l = parseFloat(l), l && (l = parseFloat(l), c += l, s += l), s || c ? (s *= ig, c *= ig, b = Math.cos(s) * u, x = Math.sin(s) * u, S = Math.sin(s - c) * -d, C = Math.cos(s - c) * d, c && (l *= ig, w = Math.tan(c - l), w = Math.sqrt(1 + w * w), S *= w, C *= w, l && (w = Math.tan(l), w = Math.sqrt(1 + w * w), b *= w, x *= w)), b = _p(b), x = _p(x), S = _p(S), C = _p(C)) : (b = u, C = d, x = S = 0), (v && !~(a + "").indexOf("px") || y && !~(o + "").indexOf("px")) && (v = Wg(f, "x", a, "px"), y = Wg(f, "y", o, "px")), (p || m || h || g) && (v = _p(v + p - (p * b + m * S) + h), y = _p(y + m - (p * x + m * C) + g)), (r || i) && (w = f.getBBox(), v = _p(v + r / 100 * w.width), y = _p(y + i / 100 * w.height)), w = "matrix(" + b + "," + x + "," + S + "," + C + "," + v + "," + y + ")", f.setAttribute("transform", w), _ && (f.style[wg] = w);
}, f_ = function(e, t, n, r, i) {
	var a = 360, o = wf(i), s = parseFloat(i) * (o && ~i.indexOf("rad") ? rg : 1) - r, c = r + s + "deg", l, u;
	return o && (l = i.split("_")[1], l === "short" && (s %= a, s !== s % (a / 2) && (s += s < 0 ? a : -a)), l === "cw" && s < 0 ? s = (s + a * og) % a - ~~(s / a) * a : l === "ccw" && s > 0 && (s = (s - a * og) % a - ~~(s / a) * a)), e._pt = u = new Nh(e._pt, t, n, r, s, fg), u.e = c, u.u = "deg", e._props.push(n), u;
}, p_ = function(e, t) {
	for (var n in t) e[n] = t[n];
	return e;
}, m_ = function(e, t, n) {
	var r = p_({}, n._gsap), i = "perspective,force3D,transformOrigin,svgOrigin", a = n.style, o, s, c, l, u, d, f, p;
	for (s in r.svg ? (c = n.getAttribute("transform"), n.setAttribute("transform", ""), a[wg] = t, o = r_(n, 1), Bg(n, wg), n.setAttribute("transform", c)) : (c = getComputedStyle(n)[wg], a[wg] = t, o = r_(n, 1), a[wg] = c), ng) c = r[s], l = o[s], c !== l && i.indexOf(s) < 0 && (f = om(c), p = om(l), u = f === p ? parseFloat(c) : Wg(n, s, c, p), d = parseFloat(l), e._pt = new Nh(e._pt, o, s, u, d - u, dg), e._pt.u = p || 0, e._props.push(s));
	p_(o, r);
};
gp("padding,margin,Width,Radius", function(e, t) {
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
	Xg[t > 1 ? "border" + e : e] = function(e, t, n, r, i) {
		var a, s;
		if (arguments.length < 4) return a = o.map(function(t) {
			return Gg(e, t, n);
		}), s = a.join(" "), s.split(a[0]).length === 5 ? a[0] : s;
		a = (r + "").split(" "), s = {}, o.forEach(function(e, t) {
			return s[e] = a[t] = a[t] || a[(t - 1) / 2 | 0];
		}), e.init(t, s, i);
	};
});
var h_ = {
	name: "css",
	register: Fg,
	targetTest: function(e) {
		return e.style && e.nodeType;
	},
	init: function(e, t, n, r, i) {
		var a = this._props, o = e.style, s = n.vars.startAt, c, l, u, d, f, p, m, h, g, _, v, y, b, x, S, C, w;
		for (m in Zh || Fg(), this.styles = this.styles || kg(e), C = this.styles.props, this.tween = n, t) if (m !== "autoRound" && (l = t[m], !(cp[m] && lh(m, t, n, r, e, i)))) {
			if (f = typeof l, p = Xg[m], f === "function" && (l = l.call(n, r, e, i), f = typeof l), f === "string" && ~l.indexOf("random(") && (l = wm(l)), p) p(this, e, m, l, n) && (S = 1);
			else if (m.substr(0, 2) === "--") c = (getComputedStyle(e).getPropertyValue(m) + "").trim(), l += "", zm.lastIndex = 0, zm.test(c) || (h = om(c), g = om(l), g ? h !== g && (c = Wg(e, m, c, g) + g) : h && (l += h)), this.add(o, "setProperty", c, l, r, i, 0, 0, m), a.push(m), C.push(m, 0, o[m]);
			else if (f !== "undefined") {
				if (s && m in s ? (c = typeof s[m] == "function" ? s[m].call(n, r, e, i) : s[m], wf(c) && ~c.indexOf("random(") && (c = wm(c)), om(c + "") || c === "auto" || (c += df.units[m] || om(Gg(e, m)) || ""), (c + "").charAt(1) === "=" && (c = Gg(e, m))) : c = Gg(e, m), d = parseFloat(c), _ = f === "string" && l.charAt(1) === "=" && l.substr(0, 2), _ && (l = l.substr(2)), u = parseFloat(l), m in ug && (m === "autoAlpha" && (d === 1 && Gg(e, "visibility") === "hidden" && u && (d = 0), C.push("visibility", 0, o.visibility), Vg(this, o, "visibility", d ? "inherit" : "hidden", u ? "inherit" : "hidden", !u)), m !== "scale" && m !== "transform" && (m = ug[m], ~m.indexOf(",") && (m = m.split(",")[0]))), v = m in ng, v) {
					if (this.styles.save(m), w = l, f === "string" && l.substring(0, 6) === "var(--") {
						if (l = Mg(e, l.substring(4, l.indexOf(")"))), l.substring(0, 5) === "calc(") {
							var T = e.style.perspective;
							e.style.perspective = l, l = Mg(e, "perspective"), T ? e.style.perspective = T : Bg(e, "perspective");
						}
						u = parseFloat(l);
					}
					if (y || (b = e._gsap, b.renderTransform && !t.parseTransform || r_(e, t.parseTransform), x = t.smoothOrigin !== !1 && b.smooth, y = this._pt = new Nh(this._pt, o, wg, 0, 1, b.renderTransform, b, 0, -1), y.dep = 1), m === "scale") this._pt = new Nh(this._pt, b, "scaleY", b.scaleY, (_ ? yp(b.scaleY, _ + u) : u) - b.scaleY || 0, dg), this._pt.u = 0, a.push("scaleY", m), m += "X";
					else if (m === "transformOrigin") {
						C.push(Tg, 0, o[Tg]), l = Jg(l), b.svg ? n_(e, l, 0, x, 0, this) : (g = parseFloat(l.split(" ")[2]) || 0, g !== b.zOrigin && Vg(this, b, "zOrigin", b.zOrigin, g), Vg(this, o, m, i_(c), i_(l)));
						continue;
					} else if (m === "svgOrigin") {
						n_(e, l, 1, x, 0, this);
						continue;
					} else if (m in Qg) {
						f_(this, b, m, d, _ ? yp(d, _ + l) : l);
						continue;
					} else if (m === "smoothOrigin") {
						Vg(this, b, "smooth", b.smooth, l);
						continue;
					} else if (m === "force3D") {
						b[m] = l;
						continue;
					} else if (m === "transform") {
						m_(this, l, e);
						continue;
					}
				} else m in o || (m = Pg(m) || m);
				if (v || (u || u === 0) && (d || d === 0) && !lg.test(l) && m in o) h = (c + "").substr((d + "").length), u ||= 0, g = om(l) || (m in df.units ? df.units[m] : h), h !== g && (d = Wg(e, m, c, g)), this._pt = new Nh(this._pt, v ? b : o, m, d, (_ ? yp(d, _ + u) : u) - d, !v && (g === "px" || m === "zIndex") && t.autoRound !== !1 ? hg : dg), this._pt.u = g || 0, v && w !== l ? (this._pt.b = c, this._pt.e = w, this._pt.r = mg) : h !== g && g !== "%" && (this._pt.b = c, this._pt.r = pg);
				else if (m in o) Kg.call(this, e, m, c, _ ? _ + l : l);
				else if (m in e) this.add(e, m, c || e[m], _ ? _ + l : l, r, i);
				else if (m !== "parseTransform") {
					Zf(m, l);
					continue;
				}
				v || (m in o ? C.push(m, 0, o[m]) : typeof e[m] == "function" ? C.push(m, 2, e[m]()) : C.push(m, 1, c || e[m])), a.push(m);
			}
		}
		S && Mh(this);
	},
	render: function(e, t) {
		if (t.tween._time || !eg()) for (var n = t._pt; n;) n.r(e, n.d), n = n._next;
		else t.styles.revert();
	},
	get: Gg,
	aliases: ug,
	getSetter: function(e, t, n) {
		var r = ug[t];
		return r && r.indexOf(",") < 0 && (t = r), t in ng && t !== Tg && (e._gsap.x || Gg(e, "x")) ? n && $h === n ? t === "scale" ? xg : bg : ($h = n || {}) && (t === "scale" ? Sg : Cg) : e.style && !Df(e.style[t]) ? vg : ~t.indexOf("-") ? yg : wh(e, t);
	},
	core: {
		_removeProperty: Bg,
		_getMatrix: t_
	}
};
qh.utils.checkPrefix = Pg, qh.core.getStyleSaver = kg, (function(e, t, n, r) {
	var i = gp(e + "," + t + "," + n, function(e) {
		ng[e] = 1;
	});
	gp(t, function(e) {
		df.units[e] = "deg", Qg[e] = 1;
	}), ug[i[13]] = e + "," + t, gp(r, function(e) {
		var t = e.split(":");
		ug[t[1]] = i[t[0]];
	});
})("x,y,z,scale,scaleX,scaleY,xPercent,yPercent", "rotation,rotationX,rotationY,skewX,skewY", "transform,transformOrigin,svgOrigin,force3D,smoothOrigin,transformPerspective", "0:translateX,1:translateY,2:translateZ,8:rotate,8:rotationZ,8:rotateZ,9:rotateX,10:rotateY"), gp("x,y,z,top,right,bottom,left,width,height,fontSize,padding,margin,perspective", function(e) {
	df.units[e] = "px";
}), qh.registerPlugin(h_);
// node_modules/gsap/index.js
var g_ = qh.registerPlugin(h_) || qh;
g_.core.Tween;
// node_modules/gsap/Observer.js
function __(e, t) {
	for (var n = 0; n < t.length; n++) {
		var r = t[n];
		r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r);
	}
}
function v_(e, t, n) {
	return t && __(e.prototype, t), n && __(e, n), e;
}
var y_, b_, x_, S_, C_, w_, T_, E_, D_, O_, k_, A_, j_, M_ = function() {
	return y_ || typeof window < "u" && (y_ = window.gsap) && y_.registerPlugin && y_;
}, N_ = 1, P_ = [], F_ = [], I_ = [], L_ = Date.now, R_ = function(e, t) {
	return t;
}, z_ = function() {
	var e = D_.core, t = e.bridge || {}, n = e._scrollers, r = e._proxies;
	n.push.apply(n, F_), r.push.apply(r, I_), F_ = n, I_ = r, R_ = function(e, n) {
		return t[e](n);
	};
}, B_ = function(e, t) {
	return ~I_.indexOf(e) && I_[I_.indexOf(e) + 1][t];
}, V_ = function(e) {
	return !!~O_.indexOf(e);
}, H_ = function(e, t, n, r, i) {
	return e.addEventListener(t, n, {
		passive: r !== !1,
		capture: !!i
	});
}, U_ = function(e, t, n, r) {
	return e.removeEventListener(t, n, !!r);
}, W_ = "scrollLeft", G_ = "scrollTop", K_ = function() {
	return k_ && k_.isPressed || F_.cache++;
}, q_ = function(e, t) {
	var n = function n(r) {
		if (r || r === 0) {
			N_ && x_.history.scrollRestoration !== "manual" && (x_.history.scrollRestoration = "manual");
			var i = k_ && k_.isPressed;
			r = n.v = Math.round(r) || (k_ && k_.iOS ? 1 : 0), e(r), n.cacheID = F_.cache, i && R_("ss", r);
		} else (t || F_.cache !== n.cacheID || R_("ref")) && (n.cacheID = F_.cache, n.v = e());
		return n.v + n.offset;
	};
	return n.offset = 0, e && n;
}, J_ = {
	s: W_,
	p: "left",
	p2: "Left",
	os: "right",
	os2: "Right",
	d: "width",
	d2: "Width",
	a: "x",
	sc: q_(function(e) {
		return arguments.length ? x_.scrollTo(e, Y_.sc()) : x_.pageXOffset || S_[W_] || C_[W_] || w_[W_] || 0;
	})
}, Y_ = {
	s: G_,
	p: "top",
	p2: "Top",
	os: "bottom",
	os2: "Bottom",
	d: "height",
	d2: "Height",
	a: "y",
	op: J_,
	sc: q_(function(e) {
		return arguments.length ? x_.scrollTo(J_.sc(), e) : x_.pageYOffset || S_[G_] || C_[G_] || w_[G_] || 0;
	})
}, X_ = function(e, t) {
	return (t && t._ctx && t._ctx.selector || y_.utils.toArray)(e)[0] || (typeof e == "string" && y_.config().nullTargetWarn !== !1 ? console.warn("Element not found:", e) : null);
}, Z_ = function(e, t) {
	for (var n = t.length; n--;) if (t[n] === e || t[n].contains(e)) return !0;
	return !1;
}, Q_ = function(e, t) {
	var n = t.s, r = t.sc;
	V_(e) && (e = S_.scrollingElement || C_);
	var i = F_.indexOf(e), a = r === Y_.sc ? 1 : 2;
	!~i && (i = F_.push(e) - 1), F_[i + a] || H_(e, "scroll", K_);
	var o = F_[i + a], s = o || (F_[i + a] = q_(B_(e, n), !0) || (V_(e) ? r : q_(function(t) {
		return arguments.length ? e[n] = t : e[n];
	})));
	return s.target = e, o || (s.smooth = y_.getProperty(e, "scrollBehavior") === "smooth"), s;
}, $_ = function(e, t, n) {
	var r = e, i = e, a = L_(), o = a, s = t || 50, c = Math.max(500, s * 3), l = function(e, t) {
		var c = L_();
		t || c - a > s ? (i = r, r = e, o = a, a = c) : n ? r += e : r = i + (e - i) / (c - o) * (a - o);
	};
	return {
		update: l,
		reset: function() {
			i = r = n ? 0 : r, o = a = 0;
		},
		getVelocity: function(e) {
			var t = o, s = i, u = L_();
			return (e || e === 0) && e !== r && l(e), a === o || u - o > c ? 0 : (r + (n ? s : -s)) / ((n ? u : a) - t) * 1e3;
		}
	};
}, ev = function(e, t) {
	return t && !e._gsapAllow && e.cancelable !== !1 && e.preventDefault(), e.changedTouches ? e.changedTouches[0] : e;
}, tv = function(e) {
	var t = Math.max.apply(Math, e), n = Math.min.apply(Math, e);
	return Math.abs(t) >= Math.abs(n) ? t : n;
}, nv = function() {
	D_ = y_.core.globals().ScrollTrigger, D_ && D_.core && z_();
}, rv = function(e) {
	return y_ = e || M_(), !b_ && y_ && typeof document < "u" && document.body && (x_ = window, S_ = document, C_ = S_.documentElement, w_ = S_.body, O_ = [
		x_,
		S_,
		C_,
		w_
	], y_.utils.clamp, j_ = y_.core.context || function() {}, E_ = "onpointerenter" in w_ ? "pointer" : "mouse", T_ = iv.isTouch = x_.matchMedia && x_.matchMedia("(hover: none), (pointer: coarse)").matches ? 1 : "ontouchstart" in x_ || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0 ? 2 : 0, A_ = iv.eventTypes = ("ontouchstart" in C_ ? "touchstart,touchmove,touchcancel,touchend" : "onpointerdown" in C_ ? "pointerdown,pointermove,pointercancel,pointerup" : "mousedown,mousemove,mouseup,mouseup").split(","), setTimeout(function() {
		return N_ = 0;
	}, 500), b_ = 1), D_ || nv(), b_;
};
J_.op = Y_, F_.cache = 0;
var iv = /*#__PURE__*/ function() {
	function e(e) {
		this.init(e);
	}
	var t = e.prototype;
	return t.init = function(e) {
		b_ || rv(y_) || console.warn("Please gsap.registerPlugin(Observer)"), D_ || nv();
		var t = e.tolerance, n = e.dragMinimum, r = e.type, i = e.target, a = e.lineHeight, o = e.debounce, s = e.preventDefault, c = e.onStop, l = e.onStopDelay, u = e.ignore, d = e.wheelSpeed, f = e.event, p = e.onDragStart, m = e.onDragEnd, h = e.onDrag, g = e.onPress, _ = e.onRelease, v = e.onRight, y = e.onLeft, b = e.onUp, x = e.onDown, S = e.onChangeX, C = e.onChangeY, w = e.onChange, T = e.onToggleX, E = e.onToggleY, D = e.onHover, O = e.onHoverEnd, k = e.onMove, A = e.ignoreCheck, j = e.isNormalizer, M = e.onGestureStart, N = e.onGestureEnd, P = e.onWheel, F = e.onEnable, I = e.onDisable, L = e.onClick, ee = e.scrollSpeed, R = e.capture, te = e.allowClicks, ne = e.lockAxis, re = e.onLockAxis;
		this.target = i = X_(i) || C_, this.vars = e, u &&= y_.utils.toArray(u), t ||= 1e-9, n ||= 0, d ||= 1, ee ||= 1, r ||= "wheel,touch,pointer", o = o !== !1, a ||= parseFloat(x_.getComputedStyle(w_).lineHeight) || 22;
		var ie, ae, oe, se, z, ce, le, B = this, V = 0, H = 0, ue = e.passive || !s && e.passive !== !1, de = Q_(i, J_), fe = Q_(i, Y_), pe = de(), me = fe(), U = ~r.indexOf("touch") && !~r.indexOf("pointer") && A_[0] === "pointerdown", he = V_(i), W = i.ownerDocument || S_, G = [
			0,
			0,
			0
		], K = [
			0,
			0,
			0
		], ge = 0, _e = function() {
			return ge = L_();
		}, ve = function(e, t) {
			return (B.event = e) && u && Z_(e.target, u) || t && U && e.pointerType !== "touch" || A && A(e, t);
		}, ye = function() {
			B._vx.reset(), B._vy.reset(), ae.pause(), c && c(B);
		}, be = function() {
			var e = B.deltaX = tv(G), n = B.deltaY = tv(K), r = Math.abs(e) >= t, i = Math.abs(n) >= t;
			w && (r || i) && w(B, e, n, G, K), r && (v && B.deltaX > 0 && v(B), y && B.deltaX < 0 && y(B), S && S(B), T && B.deltaX < 0 != V < 0 && T(B), V = B.deltaX, G[0] = G[1] = G[2] = 0), i && (x && B.deltaY > 0 && x(B), b && B.deltaY < 0 && b(B), C && C(B), E && B.deltaY < 0 != H < 0 && E(B), H = B.deltaY, K[0] = K[1] = K[2] = 0), (se || oe) && (k && k(B), oe &&= (p && oe === 1 && p(B), h && h(B), 0), se = !1), ce && !(ce = !1) && re && re(B), z &&= (P(B), !1), ie = 0;
		}, xe = function(e, t, n) {
			G[n] += e, K[n] += t, B._vx.update(e), B._vy.update(t), o ? ie ||= requestAnimationFrame(be) : be();
		}, Se = function(e, t) {
			ne && !le && (B.axis = le = Math.abs(e) > Math.abs(t) ? "x" : "y", ce = !0), le !== "y" && (G[2] += e, B._vx.update(e, !0)), le !== "x" && (K[2] += t, B._vy.update(t, !0)), o ? ie ||= requestAnimationFrame(be) : be();
		}, Ce = function(e) {
			if (!ve(e, 1)) {
				e = ev(e, s);
				var t = e.clientX, r = e.clientY, i = t - B.x, a = r - B.y, o = B.isDragging;
				B.x = t, B.y = r, (o || (i || a) && (Math.abs(B.startX - t) >= n || Math.abs(B.startY - r) >= n)) && (oe ||= o ? 2 : 1, o || (B.isDragging = !0), Se(i, a));
			}
		}, we = B.onPress = function(e) {
			ve(e, 1) || e && e.button || (B.axis = le = null, ae.pause(), B.isPressed = !0, e = ev(e), V = H = 0, B.startX = B.x = e.clientX, B.startY = B.y = e.clientY, B._vx.reset(), B._vy.reset(), H_(j ? i : W, A_[1], Ce, ue, !0), B.deltaX = B.deltaY = 0, g && g(B));
		}, Te = B.onRelease = function(e) {
			if (!ve(e, 1)) {
				U_(j ? i : W, A_[1], Ce, !0);
				var t = !isNaN(B.y - B.startY), n = B.isDragging, r = n && (Math.abs(B.x - B.startX) > 3 || Math.abs(B.y - B.startY) > 3), a = ev(e);
				!r && t && (B._vx.reset(), B._vy.reset(), s && te && y_.delayedCall(.08, function() {
					if (L_() - ge > 300 && !e.defaultPrevented) {
						if (e.target.click) e.target.click();
						else if (W.createEvent) {
							var t = W.createEvent("MouseEvents");
							t.initMouseEvent("click", !0, !0, x_, 1, a.screenX, a.screenY, a.clientX, a.clientY, !1, !1, !1, !1, 0, null), e.target.dispatchEvent(t);
						}
					}
				})), B.isDragging = B.isGesturing = B.isPressed = !1, c && n && !j && ae.restart(!0), oe && be(), m && n && m(B), _ && _(B, r);
			}
		}, Ee = function(e) {
			return e.touches && e.touches.length > 1 && (B.isGesturing = !0) && M(e, B.isDragging);
		}, De = function() {
			return (B.isGesturing = !1) || N(B);
		}, Oe = function(e) {
			if (!ve(e)) {
				var t = de(), n = fe();
				xe((t - pe) * ee, (n - me) * ee, 1), pe = t, me = n, c && ae.restart(!0);
			}
		}, ke = function(e) {
			if (!ve(e)) {
				e = ev(e, s), P && (z = !0);
				var t = (e.deltaMode === 1 ? a : e.deltaMode === 2 ? x_.innerHeight : 1) * d;
				xe(e.deltaX * t, e.deltaY * t, 0), c && !j && ae.restart(!0);
			}
		}, Ae = function(e) {
			if (!ve(e)) {
				var t = e.clientX, n = e.clientY, r = t - B.x, i = n - B.y;
				B.x = t, B.y = n, se = !0, c && ae.restart(!0), (r || i) && Se(r, i);
			}
		}, je = function(e) {
			B.event = e, D(B);
		}, Me = function(e) {
			B.event = e, O(B);
		}, Ne = function(e) {
			return ve(e) || ev(e, s) && L(B);
		};
		ae = B._dc = y_.delayedCall(l || .25, ye).pause(), B.deltaX = B.deltaY = 0, B._vx = $_(0, 50, !0), B._vy = $_(0, 50, !0), B.scrollX = de, B.scrollY = fe, B.isDragging = B.isGesturing = B.isPressed = !1, j_(this), B.enable = function(e) {
			return B.isEnabled || (H_(he ? W : i, "scroll", K_), r.indexOf("scroll") >= 0 && H_(he ? W : i, "scroll", Oe, ue, R), r.indexOf("wheel") >= 0 && H_(i, "wheel", ke, ue, R), (r.indexOf("touch") >= 0 && T_ || r.indexOf("pointer") >= 0) && (H_(i, A_[0], we, ue, R), H_(W, A_[2], Te), H_(W, A_[3], Te), te && H_(i, "click", _e, !0, !0), L && H_(i, "click", Ne), M && H_(W, "gesturestart", Ee), N && H_(W, "gestureend", De), D && H_(i, E_ + "enter", je), O && H_(i, E_ + "leave", Me), k && H_(i, E_ + "move", Ae)), B.isEnabled = !0, B.isDragging = B.isGesturing = B.isPressed = se = oe = !1, B._vx.reset(), B._vy.reset(), pe = de(), me = fe(), e && e.type && we(e), F && F(B)), B;
		}, B.disable = function() {
			B.isEnabled && (P_.filter(function(e) {
				return e !== B && V_(e.target);
			}).length || U_(he ? W : i, "scroll", K_), B.isPressed && (B._vx.reset(), B._vy.reset(), U_(j ? i : W, A_[1], Ce, !0)), U_(he ? W : i, "scroll", Oe, R), U_(i, "wheel", ke, R), U_(i, A_[0], we, R), U_(W, A_[2], Te), U_(W, A_[3], Te), U_(i, "click", _e, !0), U_(i, "click", Ne), U_(W, "gesturestart", Ee), U_(W, "gestureend", De), U_(i, E_ + "enter", je), U_(i, E_ + "leave", Me), U_(i, E_ + "move", Ae), B.isEnabled = B.isPressed = B.isDragging = !1, I && I(B));
		}, B.kill = B.revert = function() {
			B.disable();
			var e = P_.indexOf(B);
			e >= 0 && P_.splice(e, 1), k_ === B && (k_ = 0);
		}, P_.push(B), j && V_(i) && (k_ = B), B.enable(f);
	}, v_(e, [{
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
iv.version = "3.15.1", iv.create = function(e) {
	return new iv(e);
}, iv.register = rv, iv.getAll = function() {
	return P_.slice();
}, iv.getById = function(e) {
	return P_.filter(function(t) {
		return t.vars.id === e;
	})[0];
}, M_() && y_.registerPlugin(iv);
// node_modules/gsap/ScrollTrigger.js
var Q, av, ov, sv, cv, lv, uv, dv, fv, pv, mv, hv, gv, _v, vv, yv, bv, xv, Sv, Cv, wv, Tv, Ev, Dv, Ov, kv, Av, jv, Mv, Nv, Pv, Fv, Iv, Lv, Rv = 1, zv = Date.now, Bv = zv(), Vv = 0, Hv = 0, Uv = function(e, t, n) {
	var r = ay(e) && (e.substr(0, 6) === "clamp(" || e.indexOf("max") > -1);
	return n["_" + t + "Clamp"] = r, r ? e.substr(6, e.length - 7) : e;
}, Wv = function(e, t) {
	return t && (!ay(e) || e.substr(0, 6) !== "clamp(") ? "clamp(" + e + ")" : e;
}, Gv = function e() {
	return Hv && requestAnimationFrame(e);
}, Kv = function() {
	return _v = 1;
}, qv = function() {
	return _v = 0;
}, Jv = function(e) {
	return e;
}, Yv = function(e) {
	return Math.round(e * 1e5) / 1e5 || 0;
}, Xv = function() {
	return typeof window < "u";
}, Zv = function() {
	return Q || Xv() && (Q = window.gsap) && Q.registerPlugin && Q;
}, Qv = function(e) {
	return !!~uv.indexOf(e);
}, $v = function(e) {
	return (e === "Height" ? Pv : ov["inner" + e]) || cv["client" + e] || lv["client" + e];
}, ey = function(e) {
	return B_(e, "getBoundingClientRect") || (Qv(e) ? function() {
		return Db.width = ov.innerWidth, Db.height = Pv, Db;
	} : function() {
		return Ay(e);
	});
}, ty = function(e, t, n) {
	var r = n.d, i = n.d2, a = n.a;
	return (a = B_(e, "getBoundingClientRect")) ? function() {
		return a()[r];
	} : function() {
		return (t ? $v(i) : e["client" + i]) || 0;
	};
}, ny = function(e, t) {
	return !t || ~I_.indexOf(e) ? ey(e) : function() {
		return Db;
	};
}, ry = function(e, t) {
	var n = t.s, r = t.d2, i = t.d, a = t.a;
	return Math.max(0, (n = "scroll" + r) && (a = B_(e, n)) ? a() - ey(e)()[i] : Qv(e) ? (cv[n] || lv[n]) - $v(r) : e[n] - e["offset" + r]);
}, iy = function(e, t) {
	for (var n = 0; n < Sv.length; n += 3) (!t || ~t.indexOf(Sv[n + 1])) && e(Sv[n], Sv[n + 1], Sv[n + 2]);
}, ay = function(e) {
	return typeof e == "string";
}, oy = function(e) {
	return typeof e == "function";
}, sy = function(e) {
	return typeof e == "number";
}, cy = function(e) {
	return typeof e == "object";
}, ly = function(e, t, n) {
	return e && e.progress(+!t) && n && e.pause();
}, uy = function(e, t, n) {
	if (e.enabled) {
		var r = e._ctx ? e._ctx.add(function() {
			return t(e, n);
		}) : t(e, n);
		r && r.totalTime && (e.callbackAnimation = r);
	}
}, dy = Math.abs, fy = "left", py = "top", my = "right", hy = "bottom", gy = "width", _y = "height", vy = "Right", yy = "Left", by = "Top", xy = "Bottom", Sy = "padding", Cy = "margin", wy = "Width", Ty = "Height", Ey = "px", Dy = function(e) {
	return ov.getComputedStyle(e.nodeType === Node.DOCUMENT_NODE ? e.scrollingElement : e);
}, Oy = function(e) {
	var t = Dy(e).position;
	e.style.position = t === "absolute" || t === "fixed" ? t : "relative";
}, ky = function(e, t) {
	for (var n in t) n in e || (e[n] = t[n]);
	return e;
}, Ay = function(e, t) {
	var n = t && Dy(e)[vv] !== "matrix(1, 0, 0, 1, 0, 0)" && Q.to(e, {
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
}, jy = function(e, t) {
	var n = t.d2;
	return e["offset" + n] || e["client" + n] || 0;
}, My = function(e) {
	var t = [], n = e.labels, r = e.duration(), i;
	for (i in n) t.push(n[i] / r);
	return t;
}, Ny = function(e) {
	return function(t) {
		return Q.utils.snap(My(e), t);
	};
}, Py = function(e) {
	var t = Q.utils.snap(e), n = Array.isArray(e) && e.slice(0).sort(function(e, t) {
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
}, Fy = function(e) {
	return function(t, n) {
		return Py(My(e))(t, n.direction);
	};
}, Iy = function(e, t, n, r) {
	return n.split(",").forEach(function(n) {
		return e(t, n, r);
	});
}, Ly = function(e, t, n, r, i) {
	return e.addEventListener(t, n, {
		passive: !r,
		capture: !!i
	});
}, Ry = function(e, t, n, r) {
	return e.removeEventListener(t, n, !!r);
}, zy = function(e, t, n) {
	n &&= n.wheelHandler, n && (e(t, "wheel", n), e(t, "touchmove", n));
}, By = {
	startColor: "green",
	endColor: "red",
	indent: 0,
	fontSize: "16px",
	fontWeight: "normal"
}, Vy = {
	toggleActions: "play",
	anticipatePin: 0
}, Hy = {
	top: 0,
	left: 0,
	center: .5,
	bottom: 1,
	right: 1
}, Uy = function(e, t) {
	if (ay(e)) {
		var n = e.indexOf("="), r = ~n ? +(e.charAt(n - 1) + 1) * parseFloat(e.substr(n + 1)) : 0;
		~n && (e.indexOf("%") > n && (r *= t / 100), e = e.substr(0, n - 1)), e = r + (e in Hy ? Hy[e] * t : ~e.indexOf("%") ? parseFloat(e) * t / 100 : parseFloat(e) || 0);
	}
	return e;
}, Wy = function(e, t, n, r, i, a, o, s) {
	var c = i.startColor, l = i.endColor, u = i.fontSize, d = i.indent, f = i.fontWeight, p = sv.createElement("div"), m = Qv(n) || B_(n, "pinType") === "fixed", h = e.indexOf("scroller") !== -1, g = m ? lv : n.tagName === "IFRAME" ? n.contentDocument.body : n, _ = e.indexOf("start") !== -1, v = _ ? c : l, y = "border-color:" + v + ";font-size:" + u + ";color:" + v + ";font-weight:" + f + ";pointer-events:none;white-space:nowrap;font-family:sans-serif,Arial;z-index:1000;padding:4px 8px;border-width:0;border-style:solid;";
	return y += "position:" + ((h || s) && m ? "fixed;" : "absolute;"), (h || s || !m) && (y += (r === Y_ ? my : hy) + ":" + (a + parseFloat(d)) + "px;"), o && (y += "box-sizing:border-box;text-align:left;width:" + o.offsetWidth + "px;"), p._isStart = _, p.setAttribute("class", "gsap-marker-" + e + (t ? " marker-" + t : "")), p.style.cssText = y, p.innerText = t || t === 0 ? e + "-" + t : e, g.children[0] ? g.insertBefore(p, g.children[0]) : g.appendChild(p), p._offset = p["offset" + r.op.d2], Gy(p, 0, r, _), p;
}, Gy = function(e, t, n, r) {
	var i = { display: "block" }, a = n[r ? "os2" : "p2"], o = n[r ? "p2" : "os2"];
	e._isFlipped = r, i[n.a + "Percent"] = r ? -100 : 0, i[n.a] = r ? "1px" : 0, i["border" + a + wy] = 1, i["border" + o + wy] = 0, i[n.p] = t + "px", Q.set(e, i);
}, Ky = [], qy = {}, Jy, Yy = function() {
	return zv() - Vv > 34 && (Jy ||= requestAnimationFrame(vb));
}, Xy = function() {
	(!Ev || !Ev.isPressed || Ev.startX > lv.clientWidth) && (F_.cache++, Ev ? Jy ||= requestAnimationFrame(vb) : vb(), Vv || nb("scrollStart"), Vv = zv());
}, Zy = function() {
	kv = ov.innerWidth, Ov = ov.innerHeight;
}, Qy = function(e) {
	F_.cache++, (e === !0 || !gv && !Tv && !sv.fullscreenElement && !sv.webkitFullscreenElement && (!Dv || kv !== ov.innerWidth || Math.abs(ov.innerHeight - Ov) > ov.innerHeight * .25)) && dv.restart(!0);
}, $y = {}, eb = [], tb = function e() {
	return Ry($, "scrollEnd", e) || mb(!0);
}, nb = function(e) {
	return $y[e] && $y[e].map(function(e) {
		return e();
	}) || eb;
}, rb = [], ib = function(e) {
	for (var t = 0; t < rb.length; t += 5) (!e || rb[t + 4] && rb[t + 4].query === e) && (rb[t].style.cssText = rb[t + 1], rb[t].getBBox && rb[t].setAttribute("transform", rb[t + 2] || ""), rb[t + 3].uncache = 1);
}, ab = function() {
	F_.cache++, F_.forEach(function(e) {
		return oy(e) && (e.rec = e());
	});
}, ob = function(e, t) {
	var n;
	for (yv = 0; yv < Ky.length; yv++) n = Ky[yv], n && (!t || n._ctx === t) && (e ? n.kill(1) : n.revert(!0, !0));
	Fv = !0, t && ib(t), t || nb("revert");
}, sb = function(e, t) {
	F_.cache++, (t || !cb) && F_.forEach(function(e) {
		return oy(e) && e.cacheID++ && (e.rec = 0);
	}), ay(e) && (Mv = e, ov.history.scrollRestoration !== e && (ov.history.scrollRestoration = e));
}, cb, lb = 0, ub, db = function() {
	if (ub !== lb) {
		var e = ub = lb;
		requestAnimationFrame(function() {
			return e === lb && mb(!0);
		});
	}
}, fb = function() {
	lv.appendChild(Nv), Pv = !Ev && Nv.offsetHeight || ov.innerHeight, lv.removeChild(Nv);
}, pb = function(e) {
	return fv(".gsap-marker-start, .gsap-marker-end, .gsap-marker-scroller-start, .gsap-marker-scroller-end").forEach(function(t) {
		return t.style.display = e ? "none" : "block";
	});
}, mb = function(e, t) {
	if (cv = sv.documentElement, lv = sv.body, uv = [
		ov,
		sv,
		cv,
		lv
	], Vv && !e && !Fv) Ly($, "scrollEnd", tb);
	else {
		fb(), cb = $.isRefreshing = !0, Fv || ab();
		var n = nb("refreshInit");
		Cv && $.sort(), t || ob(), F_.forEach(function(e) {
			oy(e) && (e.smooth && (e.target.style.scrollBehavior = "auto"), e(0));
		}), Ky.slice(0).forEach(function(e) {
			return e.refresh();
		}), Fv = !1, Ky.forEach(function(e) {
			if (e._subPinOffset && e.pin) {
				var t = e.vars.horizontal ? "offsetWidth" : "offsetHeight", n = e.pin[t];
				e.revert(!0, 1), e.adjustPinSpacing(e.pin[t] - n), e.refresh();
			}
		}), Iv = 1, pb(!0), Ky.forEach(function(e) {
			var t = ry(e.scroller, e._dir), n = e.vars.end === "max" || e._endClamp && e.end > t, r = e._startClamp && e.start >= t;
			(n || r) && e.setPositions(r ? t - 1 : e.start, n ? Math.max(r ? t : e.start + 1, t) : e.end, !0);
		}), pb(!1), Iv = 0, n.forEach(function(e) {
			return e && e.render && e.render(-1);
		}), F_.forEach(function(e) {
			oy(e) && (e.smooth && requestAnimationFrame(function() {
				return e.target.style.scrollBehavior = "smooth";
			}), e.rec && e(e.rec));
		}), sb(Mv, 1), dv.pause(), lb++, cb = 2, vb(2), Ky.forEach(function(e) {
			return oy(e.vars.onRefresh) && e.vars.onRefresh(e);
		}), cb = $.isRefreshing = !1, nb("refresh");
	}
}, hb = 0, gb = 1, _b, vb = function(e) {
	if (e === 2 || !cb && !Fv) {
		$.isUpdating = !0, _b && _b.update(0);
		var t = Ky.length, n = zv(), r = n - Bv >= 50, i = t && Ky[0].scroll();
		if (gb = hb > i ? -1 : 1, cb || (hb = i), r && (Vv && !_v && n - Vv > 200 && (Vv = 0, nb("scrollEnd")), mv = Bv, Bv = n), gb < 0) {
			for (yv = t; yv-- > 0;) Ky[yv] && Ky[yv].update(0, r);
			gb = 1;
		} else for (yv = 0; yv < t; yv++) Ky[yv] && Ky[yv].update(0, r);
		$.isUpdating = !1;
	}
	Jy = 0;
}, yb = [
	fy,
	py,
	hy,
	my,
	Cy + xy,
	Cy + vy,
	Cy + by,
	Cy + yy,
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
], bb = yb.concat([
	gy,
	_y,
	"boxSizing",
	"max" + wy,
	"max" + Ty,
	"position",
	Cy,
	Sy,
	Sy + by,
	Sy + vy,
	Sy + xy,
	Sy + yy
]), xb = function(e, t, n) {
	wb(n);
	var r = e._gsap;
	if (r.spacerIsNative) wb(r.spacerState);
	else if (e._gsap.swappedIn) {
		var i = t.parentNode;
		i && (i.insertBefore(e, t), i.removeChild(t));
	}
	e._gsap.swappedIn = !1;
}, Sb = function(e, t, n, r) {
	if (!e._gsap.swappedIn) {
		for (var i = yb.length, a = t.style, o = e.style, s; i--;) s = yb[i], a[s] = n[s];
		a.position = n.position === "absolute" ? "absolute" : "relative", n.display === "inline" && (a.display = "inline-block"), o[hy] = o[my] = "auto", a.flexBasis = n.flexBasis || "auto", a.overflow = "visible", a.boxSizing = "border-box", a[gy] = jy(e, J_) + Ey, a[_y] = jy(e, Y_) + Ey, a[Sy] = o[Cy] = o[py] = o[fy] = "0", wb(r), o[gy] = o["max" + wy] = n[gy], o[_y] = o["max" + Ty] = n[_y], o[Sy] = n[Sy], e.parentNode !== t && (e.parentNode.insertBefore(t, e), t.appendChild(e)), e._gsap.swappedIn = !0;
	}
}, Cb = /([A-Z])/g, wb = function(e) {
	if (e) {
		var t = e.t.style, n = e.length, r = 0, i, a;
		for ((e.t._gsap || Q.core.getCache(e.t)).uncache = 1; r < n; r += 2) a = e[r + 1], i = e[r], a ? t[i] = a : t[i] && t.removeProperty(i.replace(Cb, "-$1").toLowerCase());
	}
}, Tb = function(e) {
	for (var t = bb.length, n = e.style, r = [], i = 0; i < t; i++) r.push(bb[i], n[bb[i]]);
	return r.t = e, r;
}, Eb = function(e, t, n) {
	for (var r = [], i = e.length, a = n ? 8 : 0, o; a < i; a += 2) o = e[a], r.push(o, o in t ? t[o] : e[a + 1]);
	return r.t = e.t, r;
}, Db = {
	left: 0,
	top: 0
}, Ob = function(e, t, n, r, i, a, o, s, c, l, u, d, f, p) {
	oy(e) && (e = e(s)), ay(e) && e.substr(0, 3) === "max" && (e = d + (e.charAt(4) === "=" ? Uy("0" + e.substr(3), n) : 0));
	var m = f ? f.time() : 0, h, g, _;
	if (f && f.seek(0), isNaN(e) || (e = +e), sy(e)) f && (e = Q.utils.mapRange(f.scrollTrigger.start, f.scrollTrigger.end, 0, d, e)), o && Gy(o, n, r, !0);
	else {
		oy(t) && (t = t(s));
		var v = (e || "0").split(" "), y, b, x, S;
		_ = X_(t, s) || lv, y = Ay(_) || {}, y && (y.left || y.top) || Dy(_).display !== "none" || (S = _.style.display, _.style.display = "block", y = Ay(_), S ? _.style.display = S : _.style.removeProperty("display")), b = Uy(v[0], y[r.d]), x = Uy(v[1] || "0", n), e = y[r.p] - c[r.p] - l + b + i - x, o && Gy(o, x, r, n - x < 20 || o._isStart && x > 20), n -= n - x;
	}
	if (p && (s[p] = e || -.001, e < 0 && (e = 0)), a) {
		var C = e + n, w = a._isStart;
		h = "scroll" + r.d2, Gy(a, C, r, w && C > 20 || !w && (u ? Math.max(lv[h], cv[h]) : a.parentNode[h]) <= C + 1), u && (c = Ay(o), u && (a.style[r.op.p] = c[r.op.p] - r.op.m - a._offset + Ey));
	}
	return f && _ && (h = Ay(_), f.seek(d), g = Ay(_), f._caScrollDist = h[r.p] - g[r.p], e = e / f._caScrollDist * d), f && f.seek(m), f ? e : Math.round(e);
}, kb = /(webkit|moz|length|cssText|inset)/i, Ab = function(e, t, n, r) {
	if (e.parentNode !== t) {
		var i = e.style, a, o;
		if (t === lv) {
			for (a in e._stOrig = i.cssText, o = Dy(e), o) !+a && !kb.test(a) && o[a] && typeof i[a] == "string" && a !== "0" && (i[a] = o[a]);
			i.top = n, i.left = r;
		} else i.cssText = e._stOrig;
		Q.core.getCache(e).uncache = 1, t.appendChild(e);
	}
}, jb = function(e, t, n) {
	var r = t, i = r;
	return function(t) {
		var a = Math.round(e());
		return a !== r && a !== i && Math.abs(a - r) > 3 && Math.abs(a - i) > 3 && (t = a, n && n()), i = r, r = Math.round(t), r;
	};
}, Mb = function(e, t, n) {
	var r = {};
	r[t.p] = "+=" + n, Q.set(e, r);
}, Nb = function(e, t) {
	var n = Q_(e, t), r = "_scroll" + t.p2, i = function t(i, a, o, s, c) {
		var l = t.tween, u = a.onComplete, d = {};
		o ||= n();
		var f = jb(n, o, function() {
			l.kill(), t.tween = 0;
		});
		return c = s && c || 0, s ||= i - o, l && l.kill(), a[r] = i, a.inherit = !1, a.modifiers = d, d[r] = function() {
			return f(o + s * l.ratio + c * l.ratio * l.ratio);
		}, a.onUpdate = function() {
			F_.cache++, t.tween && vb();
		}, a.onComplete = function() {
			t.tween = 0, u && u.call(l);
		}, l = t.tween = Q.to(e, a), l;
	};
	return e[r] = n, n.wheelHandler = function() {
		return i.tween && i.tween.kill() && (i.tween = 0);
	}, Ly(e, "wheel", n.wheelHandler), $.isTouch && Ly(e, "touchmove", n.wheelHandler), i;
}, $ = /*#__PURE__*/ function() {
	function e(t, n) {
		av || e.register(Q) || console.warn("Please gsap.registerPlugin(ScrollTrigger)"), jv(this), this.init(t, n);
	}
	var t = e.prototype;
	return t.init = function(t, n) {
		if (this.progress = this.start = 0, this.vars && this.kill(!0, !0), !Hv) this.update = this.refresh = this.kill = Jv;
		else {
			t = ky(ay(t) || sy(t) || t.nodeType ? { trigger: t } : t, Vy);
			var r = t, i = r.onUpdate, a = r.toggleClass, o = r.id, s = r.onToggle, c = r.onRefresh, l = r.scrub, u = r.trigger, d = r.pin, f = r.pinSpacing, p = r.invalidateOnRefresh, m = r.anticipatePin, h = r.onScrubComplete, g = r.onSnapComplete, _ = r.once, v = r.snap, y = r.pinReparent, b = r.pinSpacer, x = r.containerAnimation, S = r.fastScrollEnd, C = r.preventOverlaps, w = t.horizontal || t.containerAnimation && t.horizontal !== !1 ? J_ : Y_, T = !l && l !== 0, E = X_(t.scroller || ov), D = Q.core.getCache(E), O = Qv(E), k = ("pinType" in t ? t.pinType : B_(E, "pinType") || O && "fixed") === "fixed", A = [
				t.onEnter,
				t.onLeave,
				t.onEnterBack,
				t.onLeaveBack
			], j = T && t.toggleActions.split(" "), M = "markers" in t ? t.markers : Vy.markers, N = O ? 0 : parseFloat(Dy(E)["border" + w.p2 + wy]) || 0, P = this, F = t.onRefreshInit && function() {
				return t.onRefreshInit(P);
			}, I = ty(E, O, w), L = ny(E, O), ee = 0, R = 0, te = 0, ne = Q_(E, w), re, ie, ae, oe, se, z, ce, le, B, V, H, ue, de, fe, pe, me, U, he, W, G, K, ge, _e, ve, ye, be, xe, Se, Ce, we, Te, Ee, De, Oe, ke, Ae, je, Me, Ne;
			if (P._startClamp = P._endClamp = !1, P._dir = w, m *= 45, P.scroller = E, P.scroll = x ? x.time.bind(x) : ne, oe = ne(), Fv && ne.rec == null && (ne.rec = oe), P.vars = t, n ||= t.animation, "refreshPriority" in t && (Cv = 1, t.refreshPriority === -9999 && (_b = P)), D.tweenScroll = D.tweenScroll || {
				top: Nb(E, Y_),
				left: Nb(E, J_)
			}, P.tweenTo = re = D.tweenScroll[w.p], P.scrubDuration = function(e) {
				De = sy(e) && e, De ? Ee ? Ee.duration(e) : Ee = Q.to(n, {
					ease: "expo",
					totalProgress: "+=0",
					inherit: !1,
					duration: De,
					paused: !0,
					onComplete: function() {
						return h && h(P);
					}
				}) : (Ee && Ee.progress(1).kill(), Ee = 0);
			}, n && (n.vars.lazy = !1, n._initted && !P.isReverted || n.vars.immediateRender !== !1 && t.immediateRender !== !1 && n.duration() && n.render(0, !0, !0), P.animation = n.pause(), n.scrollTrigger = P, P.scrubDuration(l), we = 0, o ||= n.vars.id), v && ((!cy(v) || v.push) && (v = { snapTo: v }), "scrollBehavior" in lv.style && Q.set(O ? [lv, cv] : E, { scrollBehavior: "auto" }), F_.forEach(function(e) {
				return oy(e) && e.target === (O ? sv.scrollingElement || cv : E) && (e.smooth = !1);
			}), ae = oy(v.snapTo) ? v.snapTo : v.snapTo === "labels" ? Ny(n) : v.snapTo === "labelsDirectional" ? Fy(n) : v.directional === !1 ? Q.utils.snap(v.snapTo) : function(e, t) {
				return Py(v.snapTo)(e, zv() - R < 500 ? 0 : t.direction);
			}, Oe = v.duration || {
				min: .1,
				max: 2
			}, Oe = cy(Oe) ? pv(Oe.min, Oe.max) : pv(Oe, Oe), ke = Q.delayedCall(v.delay || De / 2 || .1, function() {
				var e = ne(), t = zv() - R < 500, r = re.tween;
				if ((t || Math.abs(P.getVelocity()) < 10) && !r && !_v && ee !== e) {
					var i = (e - z) / fe, a = n && !T ? n.totalProgress() : i, o = t ? 0 : (a - Te) / (zv() - mv) * 1e3 || 0, s = Q.utils.clamp(-i, 1 - i, dy(o / 2) * o / .185), c = i + (v.inertia === !1 ? 0 : s), l, u, d = v, f = d.onStart, p = d.onInterrupt, m = d.onComplete;
					if (l = ae(c, P), sy(l) || (l = c), u = Math.max(0, Math.round(z + l * fe)), e <= ce && e >= z && u !== e) {
						if (r && !r._initted && r.data <= dy(u - e)) return;
						v.inertia === !1 && (s = l - i), re(u, {
							duration: Oe(dy(Math.max(dy(c - a), dy(l - a)) * .185 / o / .05 || 0)),
							ease: v.ease || "power3",
							data: dy(u - e),
							onInterrupt: function() {
								return ke.restart(!0) && p && uy(P, p);
							},
							onComplete: function() {
								P.update(), ee = ne(), n && !T && (Ee ? Ee.resetTo("totalProgress", l, n._tTime / n._tDur) : n.progress(l)), we = Te = n && !T ? n.totalProgress() : P.progress, g && g(P), m && uy(P, m);
							}
						}, e, s * fe, u - e - s * fe), f && uy(P, f, re.tween);
					}
				} else P.isActive && ee !== e && ke.restart(!0);
			}).pause()), o && (qy[o] = P), u = P.trigger = X_(u || d !== !0 && d), Ne = u && u._gsap && u._gsap.stRevert, Ne &&= Ne(P), d = d === !0 ? u : X_(d), ay(a) && (a = {
				targets: u,
				className: a
			}), d && (f === !1 || f === Cy || (f = !f && d.parentNode && d.parentNode.style && Dy(d.parentNode).display === "flex" ? !1 : Sy), P.pin = d, ie = Q.core.getCache(d), ie.spacer ? pe = ie.pinState : (b && (b = X_(b), b && !b.nodeType && (b = b.current || b.nativeElement), ie.spacerIsNative = !!b, b && (ie.spacerState = Tb(b))), ie.spacer = he = b || sv.createElement("div"), he.classList.add("pin-spacer"), o && he.classList.add("pin-spacer-" + o), ie.pinState = pe = Tb(d)), t.force3D !== !1 && Q.set(d, { force3D: !0 }), P.spacer = he = ie.spacer, Ce = Dy(d), ve = Ce[f + w.os2], G = Q.getProperty(d), K = Q.quickSetter(d, w.a, Ey), Sb(d, he, Ce), U = Tb(d)), M) {
				ue = cy(M) ? ky(M, By) : By, V = Wy("scroller-start", o, E, w, ue, 0), H = Wy("scroller-end", o, E, w, ue, 0, V), W = V["offset" + w.op.d2];
				var Pe = X_(B_(E, "content") || E);
				le = this.markerStart = Wy("start", o, Pe, w, ue, W, 0, x), B = this.markerEnd = Wy("end", o, Pe, w, ue, W, 0, x), x && (Me = Q.quickSetter([le, B], w.a, Ey)), !k && !(I_.length && B_(E, "fixedMarkers") === !0) && (Oy(O ? lv : E), Q.set([V, H], { force3D: !0 }), be = Q.quickSetter(V, w.a, Ey), Se = Q.quickSetter(H, w.a, Ey));
			}
			if (x) {
				var Fe = x.vars.onUpdate, Ie = x.vars.onUpdateParams;
				x.eventCallback("onUpdate", function() {
					P.update(0, 0, 1), Fe && Fe.apply(x, Ie || []);
				});
			}
			if (P.previous = function() {
				return Ky[Ky.indexOf(P) - 1];
			}, P.next = function() {
				return Ky[Ky.indexOf(P) + 1];
			}, P.revert = function(e, t) {
				if (!t) return P.kill(!0);
				var r = e !== !1 || !P.enabled, i = gv;
				r !== P.isReverted && (r && (Ae = Math.max(ne(), P.scroll.rec || 0), te = P.progress, je = n && n.progress()), le && [
					le,
					B,
					V,
					H
				].forEach(function(e) {
					return e.style.display = r ? "none" : "block";
				}), r && (gv = P, P.update(r)), !d || y && P.isActive || (r ? xb(d, he, pe) : Sb(d, he, Dy(d), ye)), r || P.update(r), gv = i, P.isReverted = r);
			}, P.refresh = function(r, i, a, o) {
				if (!gv && P.enabled || i) {
					if (d && r && Vv) Ly(e, "scrollEnd", tb);
					else {
						!cb && F && F(P), gv = P, re.tween && !a && (re.tween.kill(), re.tween = 0), Ee && Ee.pause(), p && n && (n.revert({ kill: !1 }).invalidate(), n.getChildren ? n.getChildren(!0, !0, !1).forEach(function(e) {
							return e.vars.immediateRender && e.render(0, !0, !0);
						}) : n.vars.immediateRender && n.render(0, !0, !0)), P.isReverted || P.revert(!0, !0), P._subPinOffset = !1;
						var s = I(), l = L(), m = x ? x.duration() : ry(E, w), h = fe <= .01 || !fe, g = 0, _ = o || 0, v = cy(a) ? a.end : t.end, b = t.endTrigger || u, S = cy(a) ? a.start : t.start || (t.start === 0 || !u ? 0 : d ? "0 0" : "0 100%"), C = P.pinnedContainer = t.pinnedContainer && X_(t.pinnedContainer, P), D = u && Math.max(0, Ky.indexOf(P)) || 0, A = D, j, ie, ae, ue, W, K, ve, be, Se, Ce, we, Te, De;
						for (M && cy(a) && (Te = Q.getProperty(V, w.p), De = Q.getProperty(H, w.p)); A-- > 0;) K = Ky[A], K.end || K.refresh(0, 1) || (gv = P), ve = K.pin, ve && (ve === u || ve === d || ve === C) && !K.isReverted && (Ce ||= [], Ce.unshift(K), K.revert(!0, !0)), K !== Ky[A] && (D--, A--);
						for (oy(S) && (S = S(P)), S = Uv(S, "start", P), z = Ob(S, u, s, w, ne(), le, V, P, l, N, k, m, x, P._startClamp && "_startClamp") || (d ? -.001 : 0), oy(v) && (v = v(P)), ay(v) && !v.indexOf("+=") && (~v.indexOf(" ") ? v = (ay(S) ? S.split(" ")[0] : "") + v : (g = Uy(v.substr(2), s), v = ay(S) ? S : (x ? Q.utils.mapRange(0, x.duration(), x.scrollTrigger.start, x.scrollTrigger.end, z) : z) + g, b = u)), v = Uv(v, "end", P), ce = Math.max(z, Ob(v || (b ? "100% 0" : m), b, s, w, ne() + g, B, H, P, l, N, k, m, x, P._endClamp && "_endClamp")) || -.001, g = 0, A = D; A--;) K = Ky[A] || {}, ve = K.pin, ve && K.start - K._pinPush <= z && !x && K.end > 0 && (j = K.end - (P._startClamp ? Math.max(0, K.start) : K.start), (ve === u && K.start - K._pinPush < z || ve === C) && isNaN(S) && (g += j * (1 - K.progress)), ve === d && (_ += j));
						if (z += g, ce += g, P._startClamp && (P._startClamp += g), P._endClamp && !cb && (P._endClamp = ce || -.001, ce = Math.min(ce, ry(E, w))), fe = ce - z || (z -= .01) && .001, h && (te = Q.utils.clamp(0, 1, Q.utils.normalize(z, ce, Ae))), P._pinPush = _, le && g && (j = {}, j[w.a] = "+=" + g, C && (j[w.p] = "-=" + ne()), Q.set([le, B], j)), d && !(Iv && P.end >= ry(E, w))) j = Dy(d), ue = w === Y_, ae = ne(), ge = parseFloat(G(w.a)) + _, !m && ce > 1 && (we = (O ? sv.scrollingElement || cv : E).style, we = {
							style: we,
							value: we["overflow" + w.a.toUpperCase()]
						}, O && Dy(lv)["overflow" + w.a.toUpperCase()] !== "scroll" && (we.style["overflow" + w.a.toUpperCase()] = "scroll")), Sb(d, he, j), U = Tb(d), ie = Ay(d, !0), be = k && Q_(E, ue ? J_ : Y_)(), f ? (ye = [f + w.os2, fe + _ + Ey], ye.t = he, A = f === Sy ? jy(d, w) + fe + _ : 0, A && (ye.push(w.d, A + Ey), he.style.flexBasis !== "auto" && (he.style.flexBasis = A + Ey)), wb(ye), C && Ky.forEach(function(e) {
							e.pin === C && e.vars.pinSpacing !== !1 && (e._subPinOffset = !0);
						}), k && ne(Ae)) : (A = jy(d, w), A && he.style.flexBasis !== "auto" && (he.style.flexBasis = A + Ey)), k && (W = {
							top: ie.top + (ue ? ae - z : be) + Ey,
							left: ie.left + (ue ? be : ae - z) + Ey,
							boxSizing: "border-box",
							position: "fixed"
						}, W[gy] = W["max" + wy] = Math.ceil(ie.width) + Ey, W[_y] = W["max" + Ty] = Math.ceil(ie.height) + Ey, W[Cy] = W[Cy + by] = W[Cy + vy] = W[Cy + xy] = W[Cy + yy] = "0", W[Sy] = j[Sy], W[Sy + by] = j[Sy + by], W[Sy + vy] = j[Sy + vy], W[Sy + xy] = j[Sy + xy], W[Sy + yy] = j[Sy + yy], me = Eb(pe, W, y), cb && ne(0)), n ? (Se = n._initted, wv(1), n.render(n.duration(), !0, !0), _e = G(w.a) - ge + fe + _, xe = Math.abs(fe - _e) > 1, k && xe && me.splice(me.length - 2, 2), n.render(0, !0, !0), Se || n.invalidate(!0), n.parent || n.totalTime(n.totalTime()), wv(0)) : _e = fe, we && (we.value ? we.style["overflow" + w.a.toUpperCase()] = we.value : we.style.removeProperty("overflow-" + w.a));
						else if (u && ne() && !x) for (ie = u.parentNode; ie && ie !== lv;) ie._pinOffset && (z -= ie._pinOffset, ce -= ie._pinOffset), ie = ie.parentNode;
						Ce && Ce.forEach(function(e) {
							return e.revert(!1, !0);
						}), P.start = z, P.end = ce, oe = se = cb ? Ae : ne(), x || cb || Fv || (oe < Ae && ne(Ae), P.scroll.rec = 0), P.revert(!1, !0), R = zv(), ke && (ee = -1, ke.restart(!0)), gv = 0, n && T && (n._initted || je) && n.progress() !== je && n.progress(je || 0, !0).render(n.time(), !0, !0), (h || te !== P.progress || x || p || n && !n._initted) && (n && !T && (n._initted || te || n.vars.immediateRender !== !1) && n.totalProgress(x && z < -.001 && !te ? Q.utils.normalize(z, ce, 0) : te, !0), P.progress = h || (oe - z) / fe === te ? 0 : te), d && f && (he._pinOffset = Math.round(P.progress * _e)), Ee && Ee.invalidate(), isNaN(Te) || (Te -= Q.getProperty(V, w.p), De -= Q.getProperty(H, w.p), Mb(V, w, Te), Mb(le, w, Te - (o || 0)), Mb(H, w, De), Mb(B, w, De - (o || 0))), h && !cb && P.update(), c && !cb && !de && (de = !0, c(P), de = !1);
					}
				}
			}, P.getVelocity = function() {
				return (ne() - se) / (zv() - mv) * 1e3 || 0;
			}, P.endAnimation = function() {
				ly(P.callbackAnimation), n && (Ee ? Ee.progress(1) : n.paused() ? T || ly(n, P.direction < 0, 1) : ly(n, n.reversed()));
			}, P.labelToScroll = function(e) {
				return n && n.labels && (z || P.refresh() || z) + n.labels[e] / n.duration() * fe || 0;
			}, P.getTrailing = function(e) {
				var t = Ky.indexOf(P), n = P.direction > 0 ? Ky.slice(0, t).reverse() : Ky.slice(t + 1);
				return (ay(e) ? n.filter(function(t) {
					return t.vars.preventOverlaps === e;
				}) : n).filter(function(e) {
					return P.direction > 0 ? e.end <= z : e.start >= ce;
				});
			}, P.update = function(e, t, r) {
				if (!x || r || e) {
					var o = cb === !0 ? Ae : P.scroll(), c = e ? 0 : (o - z) / fe, u = c < 0 ? 0 : c > 1 ? 1 : c || 0, p = P.progress, h, g, b, D, O, M, N, F;
					if (t && (se = oe, oe = x ? ne() : o, v && (Te = we, we = n && !T ? n.totalProgress() : u)), m && d && !gv && !Rv && Vv && (!u && z < o + (o - se) / (zv() - mv) * m ? u = 1e-4 : u === 1 && ce > o + (o - se) / (zv() - mv) * m && (u = .9999)), u !== p && P.enabled) {
						if (h = P.isActive = !!u && u < 1, g = !!p && p < 1, M = h !== g, O = M || !!u != !!p, P.direction = u > p ? 1 : -1, P.progress = u, O && !gv && (b = u && !p ? 0 : u === 1 ? 1 : p === 1 ? 2 : 3, T && (D = !M && j[b + 1] !== "none" && j[b + 1] || j[b], F = n && (D === "complete" || D === "reset" || D in n))), C && (M || F) && (F || l || !n) && (oy(C) ? C(P) : P.getTrailing(C).forEach(function(e) {
							return e.endAnimation();
						})), T || (Ee && !gv && !Rv ? (Ee._dp._time - Ee._start !== Ee._time && Ee.render(Ee._dp._time - Ee._start), Ee.resetTo ? Ee.resetTo("totalProgress", u, n._tTime / n._tDur) : (Ee.vars.totalProgress = u, Ee.invalidate().restart())) : n && n.totalProgress(u, !!(gv && (R || e)))), d) {
							if (e && f && (he.style[f + w.os2] = ve), !k) K(Yv(ge + _e * u));
							else if (O) {
								if (N = !e && u > p && ce + 1 > o && o + 1 >= ry(E, w), y) {
									if (!e && (h || N)) {
										var I = Ay(d, !0), L = o - z;
										Ab(d, lv, I.top + (w === Y_ ? L : 0) + Ey, I.left + (w === Y_ ? 0 : L) + Ey);
									} else Ab(d, he);
								}
								wb(h || N ? me : U), xe && u < 1 && h || K(ge + (u === 1 && !N ? _e : 0));
							}
						}
						v && !re.tween && !gv && !Rv && ke.restart(!0), a && (M || _ && u && (u < 1 || !Lv)) && fv(a.targets).forEach(function(e) {
							return e.classList[h || _ ? "add" : "remove"](a.className);
						}), i && !T && !e && i(P), O && !gv ? (T && (F && (D === "complete" ? n.pause().totalProgress(1) : D === "reset" ? n.restart(!0).pause() : D === "restart" ? n.restart(!0) : n[D]()), i && i(P)), (M || !Lv) && (s && M && uy(P, s), A[b] && uy(P, A[b]), _ && (u === 1 ? P.kill(!1, 1) : A[b] = 0), M || (b = u === 1 ? 1 : 3, A[b] && uy(P, A[b]))), S && !h && Math.abs(P.getVelocity()) > (sy(S) ? S : 2500) && (ly(P.callbackAnimation), Ee ? Ee.progress(1) : ly(n, D === "reverse" ? 1 : !u, 1))) : T && i && !gv && i(P);
					}
					if (Se) {
						var ee = x ? o / x.duration() * (x._caScrollDist || 0) : o;
						be(ee + +!!V._isFlipped), Se(ee);
					}
					Me && Me(-o / x.duration() * (x._caScrollDist || 0));
				}
			}, P.enable = function(t, n) {
				P.enabled || (P.enabled = !0, Ly(E, "resize", Qy), O || Ly(E, "scroll", Xy), F && Ly(e, "refreshInit", F), t !== !1 && (P.progress = te = 0, oe = se = ee = ne()), n !== !1 && P.refresh());
			}, P.getTween = function(e) {
				return e && re ? re.tween : Ee;
			}, P.setPositions = function(e, t, n, r) {
				if (x) {
					var i = x.scrollTrigger, a = x.duration(), o = i.end - i.start;
					e = i.start + o * e / a, t = i.start + o * t / a;
				}
				P.refresh(!1, !1, {
					start: Wv(e, n && !!P._startClamp),
					end: Wv(t, n && !!P._endClamp)
				}, r), P.update();
			}, P.adjustPinSpacing = function(e) {
				if (ye && e) {
					var t = ye.indexOf(w.d) + 1;
					ye[t] = parseFloat(ye[t]) + e + Ey, ye[1] = parseFloat(ye[1]) + e + Ey, wb(ye);
				}
			}, P.disable = function(t, n) {
				if (t !== !1 && P.revert(!0, !0), P.enabled && (P.enabled = P.isActive = !1, n || Ee && Ee.pause(), Ae = 0, ie && (ie.uncache = 1), F && Ry(e, "refreshInit", F), ke && (ke.pause(), re.tween && re.tween.kill() && (re.tween = 0)), !O)) {
					for (var r = Ky.length; r--;) if (Ky[r].scroller === E && Ky[r] !== P) return;
					Ry(E, "resize", Qy), O || Ry(E, "scroll", Xy);
				}
			}, P.kill = function(e, r) {
				P.disable(e, r), Ee && !r && Ee.kill(), o && delete qy[o];
				var i = Ky.indexOf(P);
				i >= 0 && Ky.splice(i, 1), i === yv && gb > 0 && yv--, i = 0, Ky.forEach(function(e) {
					return e.scroller === P.scroller && (i = 1);
				}), i || cb || Fv || (P.scroll.rec = 0), n && (n.scrollTrigger = null, e && n.revert({ kill: !1 }), r || n.kill()), le && [
					le,
					B,
					V,
					H
				].forEach(function(e) {
					return e.parentNode && e.parentNode.removeChild(e);
				}), _b === P && (_b = 0), d && (ie && (ie.uncache = 1), i = 0, Ky.forEach(function(e) {
					return e.pin === d && i++;
				}), i || (ie.spacer = 0)), t.onKill && t.onKill(P);
			}, Ky.push(P), P.enable(!1, !1), Ne && Ne(P), n && n.add && !fe) {
				var Le = P.update;
				P.update = function() {
					P.update = Le, F_.cache++, z || ce || P.refresh();
				}, Q.delayedCall(.01, P.update), fe = .01, z = ce = 0;
			} else P.refresh();
			d && db();
		}
	}, e.register = function(t) {
		return av ||= (Q = t || Zv(), Xv() && window.document && e.enable(), Hv), av;
	}, e.defaults = function(e) {
		if (e) for (var t in e) Vy[t] = e[t];
		return Vy;
	}, e.disable = function(e, t) {
		Hv = 0, Ky.forEach(function(n) {
			return n[t ? "kill" : "disable"](e);
		}), Ry(ov, "wheel", Xy), Ry(sv, "scroll", Xy), clearInterval(hv), Ry(sv, "touchcancel", Jv), Ry(lv, "touchstart", Jv), Iy(Ry, sv, "pointerdown,touchstart,mousedown", Kv), Iy(Ry, sv, "pointerup,touchend,mouseup", qv), dv.kill(), iy(Ry);
		for (var n = 0; n < F_.length; n += 3) zy(Ry, F_[n], F_[n + 1]), zy(Ry, F_[n], F_[n + 2]);
	}, e.enable = function() {
		if (ov = window, sv = document, cv = sv.documentElement, lv = sv.body, Q) {
			if (fv = Q.utils.toArray, pv = Q.utils.clamp, jv = Q.core.context || Jv, wv = Q.core.suppressOverwrites || Jv, Mv = ov.history.scrollRestoration || "auto", hb = ov.pageYOffset || 0, Q.core.globals("ScrollTrigger", e), lv) {
				Hv = 1, Nv = document.createElement("div"), Nv.style.height = "100vh", Nv.style.position = "absolute", fb(), Gv(), iv.register(Q), e.isTouch = iv.isTouch, Av = iv.isTouch && /(iPad|iPhone|iPod|Mac)/g.test(navigator.userAgent), Dv = iv.isTouch === 1, Ly(ov, "wheel", Xy), uv = [
					ov,
					sv,
					cv,
					lv
				], Q.matchMedia ? (e.matchMedia = function(e) {
					var t = Q.matchMedia(), n;
					for (n in e) t.add(n, e[n]);
					return t;
				}, Q.addEventListener("matchMediaInit", function() {
					ab(), ob();
				}), Q.addEventListener("matchMediaRevert", function() {
					return ib();
				}), Q.addEventListener("matchMedia", function() {
					mb(0, 1), nb("matchMedia");
				}), Q.matchMedia().add("(orientation: portrait)", function() {
					return Zy(), Zy;
				})) : console.warn("Requires GSAP 3.11.0 or later"), Zy(), Ly(sv, "scroll", Xy);
				var t = lv.hasAttribute("style"), n = lv.style, r = n.borderTopStyle, i = Q.core.Animation.prototype, a, o;
				for (i.revert || Object.defineProperty(i, "revert", { value: function() {
					return this.time(-.01, !0);
				} }), n.borderTopStyle = "solid", a = Ay(lv), Y_.m = Math.round(a.top + Y_.sc()) || 0, J_.m = Math.round(a.left + J_.sc()) || 0, r ? n.borderTopStyle = r : n.removeProperty("border-top-style"), t || (lv.setAttribute("style", ""), lv.removeAttribute("style")), hv = setInterval(Yy, 250), Q.delayedCall(.5, function() {
					return Rv = 0;
				}), Ly(sv, "touchcancel", Jv), Ly(lv, "touchstart", Jv), Iy(Ly, sv, "pointerdown,touchstart,mousedown", Kv), Iy(Ly, sv, "pointerup,touchend,mouseup", qv), vv = Q.utils.checkPrefix("transform"), bb.push(vv), av = zv(), dv = Q.delayedCall(.2, mb).pause(), Sv = [
					sv,
					"visibilitychange",
					function() {
						var e = ov.innerWidth, t = ov.innerHeight;
						sv.hidden ? (bv = e, xv = t) : (bv !== e || xv !== t) && Qy();
					},
					sv,
					"DOMContentLoaded",
					mb,
					ov,
					"load",
					mb,
					ov,
					"resize",
					Qy
				], iy(Ly), Ky.forEach(function(e) {
					return e.enable(0, 1);
				}), o = 0; o < F_.length; o += 3) zy(Ry, F_[o], F_[o + 1]), zy(Ry, F_[o], F_[o + 2]);
			} else sv && sv.addEventListener("DOMContentLoaded", function t() {
				e.enable(), sv.removeEventListener("DOMContentLoaded", t);
			});
		}
	}, e.config = function(t) {
		"limitCallbacks" in t && (Lv = !!t.limitCallbacks);
		var n = t.syncInterval;
		n && clearInterval(hv) || (hv = n) && setInterval(Yy, n), "ignoreMobileResize" in t && (Dv = e.isTouch === 1 && t.ignoreMobileResize), "autoRefreshEvents" in t && (iy(Ry) || iy(Ly, t.autoRefreshEvents || "none"), Tv = (t.autoRefreshEvents + "").indexOf("resize") === -1);
	}, e.scrollerProxy = function(e, t) {
		var n = X_(e), r = F_.indexOf(n), i = Qv(n);
		~r && F_.splice(r, i ? 6 : 2), t && (i ? I_.unshift(ov, t, lv, t, cv, t) : I_.unshift(n, t));
	}, e.clearMatchMedia = function(e) {
		Ky.forEach(function(t) {
			return t._ctx && t._ctx.query === e && t._ctx.kill(!0, !0);
		});
	}, e.isInViewport = function(e, t, n) {
		var r = (ay(e) ? X_(e) : e).getBoundingClientRect(), i = r[n ? gy : _y] * t || 0;
		return n ? r.right - i > 0 && r.left + i < ov.innerWidth : r.bottom - i > 0 && r.top + i < ov.innerHeight;
	}, e.positionInViewport = function(e, t, n) {
		ay(e) && (e = X_(e));
		var r = e.getBoundingClientRect(), i = r[n ? gy : _y], a = t == null ? i / 2 : t in Hy ? Hy[t] * i : ~t.indexOf("%") ? parseFloat(t) * i / 100 : parseFloat(t) || 0;
		return n ? (r.left + a) / ov.innerWidth : (r.top + a) / ov.innerHeight;
	}, e.killAll = function(e) {
		if (Ky.slice(0).forEach(function(e) {
			return e.vars.id !== "ScrollSmoother" && e.kill();
		}), e !== !0) {
			var t = $y.killAll || [];
			$y = {}, t.forEach(function(e) {
				return e();
			});
		}
	}, e;
}();
$.version = "3.15.1", $.saveStyles = function(e) {
	return e ? fv(e).forEach(function(e) {
		if (e && e.style) {
			var t = rb.indexOf(e);
			t >= 0 && rb.splice(t, 5), rb.push(e, e.style.cssText, e.getBBox && e.getAttribute("transform"), Q.core.getCache(e), jv());
		}
	}) : rb;
}, $.revert = function(e, t) {
	return ob(!e, t);
}, $.create = function(e, t) {
	return new $(e, t);
}, $.refresh = function(e) {
	return e ? Qy(!0) : (av || $.register()) && mb(!0);
}, $.update = function(e) {
	return ++F_.cache && vb(e === !0 ? 2 : 0);
}, $.clearScrollMemory = sb, $.maxScroll = function(e, t) {
	return ry(e, t ? J_ : Y_);
}, $.getScrollFunc = function(e, t) {
	return Q_(X_(e), t ? J_ : Y_);
}, $.getById = function(e) {
	return qy[e];
}, $.getAll = function() {
	return Ky.filter(function(e) {
		return e.vars.id !== "ScrollSmoother";
	});
}, $.isScrolling = function() {
	return !!Vv;
}, $.snapDirectional = Py, $.addEventListener = function(e, t) {
	var n = $y[e] || ($y[e] = []);
	~n.indexOf(t) || n.push(t);
}, $.removeEventListener = function(e, t) {
	var n = $y[e], r = n && n.indexOf(t);
	r >= 0 && n.splice(r, 1);
}, $.batch = function(e, t) {
	var n = [], r = {}, i = t.interval || .016, a = t.batchMax || 1e9, o = function(e, t) {
		var n = [], r = [], o = Q.delayedCall(i, function() {
			t(n, r), n = [], r = [];
		}).pause();
		return function(e) {
			n.length || o.restart(!0), n.push(e.trigger), r.push(e), a <= n.length && o.progress(1);
		};
	}, s;
	for (s in t) r[s] = s.substr(0, 2) === "on" && oy(t[s]) && s !== "onRefreshInit" ? o(s, t[s]) : t[s];
	return oy(a) && (a = a(), Ly($, "refresh", function() {
		return a = t.batchMax();
	})), fv(e).forEach(function(e) {
		var t = {};
		for (s in r) t[s] = r[s];
		t.trigger = e, n.push($.create(t));
	}), n;
};
var Pb = function(e, t, n, r) {
	return t > r ? e(r) : t < 0 && e(0), n > r ? (r - t) / (n - t) : n < 0 ? t / (t - n) : 1;
}, Fb = function e(t, n) {
	n === !0 ? t.style.removeProperty("touch-action") : t.style.touchAction = n === !0 ? "auto" : n ? "pan-" + n + (iv.isTouch ? " pinch-zoom" : "") : "none", t === cv && e(lv, n);
}, Ib = {
	auto: 1,
	scroll: 1
}, Lb = function(e) {
	var t = e.event, n = e.target, r = e.axis, i = (t.changedTouches ? t.changedTouches[0] : t).target, a = i._gsap || Q.core.getCache(i), o = zv(), s;
	if (!a._isScrollT || o - a._isScrollT > 2e3) {
		for (; i && i !== lv && (i.scrollHeight <= i.clientHeight && i.scrollWidth <= i.clientWidth || !(Ib[(s = Dy(i)).overflowY] || Ib[s.overflowX]));) i = i.parentNode;
		a._isScroll = i && i !== n && !Qv(i) && (Ib[(s = Dy(i)).overflowY] || Ib[s.overflowX]), a._isScrollT = o;
	}
	(a._isScroll || r === "x") && (t.stopPropagation(), t._gsapAllow = !0);
}, Rb = function(e, t, n, r) {
	return iv.create({
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
			return n && Ly(sv, iv.eventTypes[0], Vb, !1, !0);
		},
		onDisable: function() {
			return Ry(sv, iv.eventTypes[0], Vb, !0);
		}
	});
}, zb = /(input|label|select|textarea)/i, Bb, Vb = function(e) {
	var t = zb.test(e.target.tagName);
	(t || Bb) && (e._gsapAllow = !0, Bb = t);
}, Hb = function(e) {
	cy(e) || (e = {}), e.preventDefault = e.isNormalizer = e.allowClicks = !0, e.type || (e.type = "wheel,touch"), e.debounce = !!e.debounce, e.id = e.id || "normalizer";
	var t = e, n = t.normalizeScrollX, r = t.momentum, i = t.allowNestedScroll, a = t.onRelease, o, s, c = X_(e.target) || cv, l = Q.core.globals().ScrollSmoother, u = l && l.get(), d = Av && (e.content && X_(e.content) || u && e.content !== !1 && !u.smooth() && u.content()), f = Q_(c, Y_), p = Q_(c, J_), m = 1, h = (iv.isTouch && ov.visualViewport ? ov.visualViewport.scale * ov.visualViewport.width : ov.outerWidth) / ov.innerWidth, g = 0, _ = oy(r) ? function() {
		return r(o);
	} : function() {
		return r || 2.8;
	}, v, y, b = Rb(c, e.type, !0, i), x = function() {
		return y = !1;
	}, S = Jv, C = Jv, w = function() {
		s = ry(c, Y_), C = pv(+!!Av, s), n && (S = pv(0, ry(c, J_))), v = lb;
	}, T = function() {
		d._gsap.y = Yv(parseFloat(d._gsap.y) + f.offset) + "px", d.style.transform = "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, " + parseFloat(d._gsap.y) + ", 0, 1)", f.offset = f.cacheID = 0;
	}, E = function() {
		if (y) {
			requestAnimationFrame(x);
			var e = Yv(o.deltaY / 2), t = C(f.v - e);
			if (d && t !== f.v + f.offset) {
				f.offset = t - f.v;
				var n = Yv((parseFloat(d && d._gsap.y) || 0) - f.offset);
				d.style.transform = "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, " + n + ", 0, 1)", d._gsap.y = n + "px", f.cacheID = F_.cache, vb();
			}
			return !0;
		}
		f.offset && T(), y = !0;
	}, D, O, k, A, j = function() {
		w(), D.isActive() && D.vars.scrollY > s && (f() > s ? D.progress(1) && f(s) : D.resetTo("scrollY", s));
	};
	return d && Q.set(d, { y: "+=0" }), e.ignoreCheck = function(e) {
		return Av && e.type === "touchmove" && E(e) || m > 1.05 && e.type !== "touchstart" || o.isGesturing || e.touches && e.touches.length > 1;
	}, e.onPress = function() {
		y = !1;
		var e = m;
		m = Yv((ov.visualViewport && ov.visualViewport.scale || 1) / h), D.pause(), e !== m && Fb(c, m > 1.01 || !n && "x"), O = p(), k = f(), w(), v = lb;
	}, e.onRelease = e.onGestureStart = function(e, t) {
		if (f.offset && T(), !t) A.restart(!0);
		else {
			F_.cache++;
			var r = _(), i, o;
			n && (i = p(), o = i + r * .05 * -e.velocityX / .227, r *= Pb(p, i, o, ry(c, J_)), D.vars.scrollX = S(o)), i = f(), o = i + r * .05 * -e.velocityY / .227, r *= Pb(f, i, o, ry(c, Y_)), D.vars.scrollY = C(o), D.invalidate().duration(r).play(.01), (Av && D.vars.scrollY >= s || i >= s - 1) && Q.to({}, {
				onUpdate: j,
				duration: r
			});
		}
		a && a(e);
	}, e.onWheel = function() {
		D._ts && D.pause(), zv() - g > 1e3 && (v = 0, g = zv());
	}, e.onChange = function(e, t, r, i, a) {
		if (lb !== v && w(), t && n && p(S(i[2] === t ? O + (e.startX - e.x) : p() + t - i[1])), r) {
			f.offset && T();
			var o = a[2] === r, s = o ? k + e.startY - e.y : f() + r - a[1], c = C(s);
			o && s !== c && (k += c - s), f(c);
		}
		(r || t) && vb();
	}, e.onEnable = function() {
		Fb(c, !n && "x"), $.addEventListener("refresh", j), Ly(ov, "resize", j), f.smooth &&= (f.target.style.scrollBehavior = "auto", p.smooth = !1), b.enable();
	}, e.onDisable = function() {
		Fb(c, !0), Ry(ov, "resize", j), $.removeEventListener("refresh", j), b.kill();
	}, e.lockAxis = e.lockAxis !== !1, o = new iv(e), o.iOS = Av, Av && !f() && f(1), Av && Q.ticker.add(Jv), A = o._dc, D = Q.to(o, {
		ease: "power4",
		paused: !0,
		inherit: !1,
		scrollX: n ? "+=0.1" : "+=0",
		scrollY: "+=0.1",
		modifiers: { scrollY: jb(f, f(), function() {
			return D.pause();
		}) },
		onUpdate: vb,
		onComplete: A.vars.onComplete
	}), o;
};
$.sort = function(e) {
	if (oy(e)) return Ky.sort(e);
	var t = ov.pageYOffset || 0;
	return $.getAll().forEach(function(e) {
		return e._sortY = e.trigger ? t + e.trigger.getBoundingClientRect().top : e.start + ov.innerHeight;
	}), Ky.sort(e || function(e, t) {
		return (e.vars.refreshPriority || 0) * -1e6 + (e.vars.containerAnimation ? 1e6 : e._sortY) - ((t.vars.containerAnimation ? 1e6 : t._sortY) + (t.vars.refreshPriority || 0) * -1e6);
	});
}, $.observe = function(e) {
	return new iv(e);
}, $.normalizeScroll = function(e) {
	if (e === void 0) return Ev;
	if (e === !0 && Ev) return Ev.enable();
	if (e === !1) Ev && Ev.kill(), Ev = e;
	else {
		var t = e instanceof iv ? e : Hb(e);
		return Ev && Ev.target === t.target && Ev.kill(), Qv(t.target) && (Ev = t), t;
	}
}, $.core = {
	_getVelocityProp: $_,
	_inputObserver: Rb,
	_scrollers: F_,
	_proxies: I_,
	bridge: {
		ss: function() {
			Vv || nb("scrollStart"), Vv = zv();
		},
		ref: function() {
			return gv;
		}
	}
}, Zv() && Q.registerPlugin($);
// node_modules/gsap/SplitText.js
var Ub, Wb, Gb = typeof Symbol == "function" ? Symbol() : "_split", Kb, qb = () => Kb || fx.register(window.gsap), Jb = typeof Intl < "u" && "Segmenter" in Intl ? new Intl.Segmenter() : 0, Yb = (e) => e ? typeof e == "string" ? Yb(document.querySelectorAll(e)) : "length" in e ? Array.from(e).reduce((e, t) => (typeof t == "string" ? e.push(...Yb(t)) : e.push(t), e), []) : [e] : [], Xb = (e) => Yb(e).filter((e) => e && e.nodeType === 1), Zb = [], Qb = function() {}, $b = { add: (e) => e() }, ex = /\s+/g, tx = /* @__PURE__ */ RegExp("\\p{RI}\\p{RI}|\\p{Emoji}(\\p{EMod}|\\u{FE0F}\\u{20E3}?|[\\u{E0020}-\\u{E007E}]+\\u{E007F})?(\\u{200D}\\p{Emoji}(\\p{EMod}|\\u{FE0F}\\u{20E3}?|[\\u{E0020}-\\u{E007E}]+\\u{E007F})?)*|.", "gu"), nx = {
	left: 0,
	top: 0,
	width: 0,
	height: 0
}, rx = (e, t) => {
	for (; ++t < e.length && e[t] === nx;);
	return e[t] || nx;
}, ix = ({ element: e, html: t, ariaL: n, ariaH: r }) => {
	e.innerHTML = t, n ? e.setAttribute("aria-label", n) : e.removeAttribute("aria-label"), r ? e.setAttribute("aria-hidden", r) : e.removeAttribute("aria-hidden");
}, ax = (e, t) => {
	if (t) {
		let n = new Set(e.join("").match(t) || Zb), r = e.length, i, a, o, s;
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
}, ox = (e) => window.getComputedStyle(e).display === "inline" && (e.style.display = "inline-block"), sx = (e, t, n) => t.insertBefore(typeof e == "string" ? document.createTextNode(e) : e, n), cx = (e, t, n) => {
	let r = t[e + "sClass"] || "", { tag: i = "div", aria: a = "auto", propIndex: o = !1 } = t, s = e === "line" ? "block" : "inline-block", c = r.indexOf("++") > -1, l = (t) => {
		let l = document.createElement(i), u = n.length + 1;
		return r && (l.className = r + (c ? " " + r + u : "")), o && l.style.setProperty("--" + e, u + ""), a !== "none" && l.setAttribute("aria-hidden", "true"), i !== "span" && (l.style.position = "relative", l.style.display = s), l.textContent = t, n.push(l), l;
	};
	return c && (r = r.replace("++", "")), l.collection = n, l;
}, lx = (e, t, n, r) => {
	let i = cx("line", n, r), a = window.getComputedStyle(e).textAlign || "left";
	return (n, r) => {
		let o = i("");
		for (o.style.textAlign = a, e.insertBefore(o, t[n]); n < r; n++) o.appendChild(t[n]);
		o.normalize();
	};
}, ux = (e, t, n, r, i, a, o, s, c, l) => {
	var u;
	let d = Array.from(e.childNodes), f = 0, { wordDelimiter: p, reduceWhiteSpace: m = !0, prepareText: h } = t, g = e.getBoundingClientRect(), _ = g, v = !m && window.getComputedStyle(e).whiteSpace.substring(0, 3) === "pre", y = a && l && window.getComputedStyle(e).direction === "rtl", b = 0, x = n.collection, S, C, w, T, E, D, O, k, A, j, M, N, P, F, I, L, ee, R;
	for (typeof p == "object" ? (w = p.delimiter || p, C = p.replaceWith || "") : C = p === "" ? "" : p || " ", S = C !== " "; f < d.length; f++) if (T = d[f], T.nodeType === 3) {
		for (I = T.textContent || "", m ? I = I.replace(ex, " ") : v && (I = I.replace(/\n/g, C + "\n")), h && (I = h(I, e)), T.textContent = I, E = C || w ? I.split(w || C) : I.match(s) || Zb, ee = E[E.length - 1], k = S ? ee.slice(-1) === " " : !ee, ee || E.pop(), _ = g, O = S ? E[0].charAt(0) === " " : !E[0], O && sx(" ", e, T), E[0] || E.shift(), ax(E, c), a && l || (T.textContent = ""), A = 1; A <= E.length; A++) if (L = E[A - 1], !m && v && L.charAt(0) === "\n" && ((u = T.previousSibling) == null || u.remove(), sx(document.createElement("br"), e, T), L = L.slice(1)), !m && L === "") sx(C, e, T);
		else if (L === " ") e.insertBefore(document.createTextNode(" "), T);
		else {
			if (S && L.charAt(0) === " " && sx(" ", e, T), b && A === 1 && !O && x.indexOf(b.parentNode) > -1 ? (D = x[x.length - 1], D.appendChild(document.createTextNode(r ? "" : L))) : (D = n(r ? "" : L), sx(D, e, T), b && A === 1 && !O && D.insertBefore(b, D.firstChild)), r) {
				if (M = Jb ? ax([...Jb.segment(L)].map((e) => e.segment), c) : L.match(s) || Zb, c) {
					let e = L.match(c);
					e && e.some((e) => M.indexOf(e) < 0) && (M = L.match(s) || Zb);
				}
				for (R = 0; R < M.length; R++) D.appendChild(M[R] === " " ? document.createTextNode(" ") : r(M[R]));
			}
			if (a && l) {
				if (I = T.textContent = I.substring(L.length + 1, I.length), j = D.getBoundingClientRect(), j.top > _.top && (y ? j.left >= _.left : j.left <= _.left)) {
					for (N = e.cloneNode(), P = e.childNodes[0]; P && P !== D;) F = P, P = P.nextSibling, N.appendChild(F);
					e.parentNode.insertBefore(N, e), i && ox(N);
				}
				_ = j;
			}
			(A < E.length || k) && sx(A >= E.length ? " " : S && L.slice(-1) === " " ? " " + C : C, e, T);
		}
		e.removeChild(T), b = 0;
	} else T.nodeType === 1 && (o && o.indexOf(T) > -1 ? (x.indexOf(T.previousSibling) > -1 && x[x.length - 1].appendChild(T), b = T) : (ux(T, t, n, r, i, a, o, s, c, !0), b = 0), i && ox(T));
}, dx = class e {
	constructor(e, t) {
		this.isSplit = !1, qb(), this.elements = Xb(e), this.chars = [], this.words = [], this.lines = [], this.masks = [], this.vars = t, this.elements.forEach((e) => {
			var n;
			t.overwrite !== !1 && ((n = e[Gb]) == null || n._data.orig.filter(({ element: t }) => t === e).forEach(ix)), e[Gb] = this;
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
		}, Qb(this), this.split(t);
	}
	split(e) {
		return (this._ctx || $b).add(() => {
			this.isSplit && this.revert(), this.vars = e = e || this.vars || {};
			let { type: t = "chars,words,lines", aria: n = "auto", deepSlice: r = !0, smartWrap: i, onSplit: a, autoSplit: o = !1, specialChars: s, mask: c } = this.vars, l = t.indexOf("lines") > -1, u = t.indexOf("chars") > -1, d = t.indexOf("words") > -1, f = u && !d && !l, p = s && ("push" in s ? RegExp("(?:" + s.join("|") + ")", "gu") : s), m = p ? RegExp(p.source + "|" + tx.source, "gu") : tx, h = !!e.ignore && Xb(e.ignore), { orig: g, animTime: _, obs: v } = this._data, y;
			(u || d || l) && (this.elements.forEach((t, a) => {
				g[a] = {
					element: t,
					html: t.innerHTML,
					ariaL: t.getAttribute("aria-label"),
					ariaH: t.getAttribute("aria-hidden")
				}, n === "auto" ? t.setAttribute("aria-label", (t.textContent || "").trim()) : n === "hidden" && t.setAttribute("aria-hidden", "true");
				let o = [], s = [], c = [], _ = u ? cx("char", e, o) : null, v = cx("word", e, s), y, b, x, S;
				if (ux(t, e, v, _, f, r && (l || f), h, m, p, !1), l) {
					let n = Yb(t.childNodes), r = lx(t, n, e, c), i, a = [], o = 0, s = window.getComputedStyle(t).direction === "rtl", l = n.map((e) => e.nodeType === 1 ? e.getBoundingClientRect() : nx), u = nx, d;
					for (y = 0; y < n.length; y++) i = n[y], i.nodeType === 1 && (i.nodeName === "BR" ? (y && n[y - 1].nodeName === "BR" || (a.push(i), r(o, y + 1)), o = y + 1, u = rx(l, y)) : (d = l[y], y && d.top > u.top && (s ? d.left + d.width > u.left + 1 : d.left < u.left + u.width - 1) && (r(o, y), o = y), u = d));
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
			}))), this.isSplit = !0, Wb && l && o && Wb.addEventListener("loadingdone", this._split), (y = a && a(this)) && y.totalTime && (this._data.anim = _ ? y.totalTime(_) : y), l && o && this.elements.forEach((e, t) => {
				g[t].width = e.offsetWidth, v && v.observe(e);
			});
		}), this;
	}
	kill() {
		let { obs: e, t } = this._data;
		e && e.disconnect(), clearTimeout(t), Wb?.removeEventListener("loadingdone", this._split);
	}
	revert() {
		var e, t;
		if (this.isSplit) {
			let { orig: n, anim: r } = this._data;
			this.kill(), n.forEach(ix), this.chars.length = this.words.length = this.lines.length = n.length = this.masks.length = 0, this.isSplit = !1, r && (this._data.animTime = r.totalTime(), r.revert()), (t = (e = this.vars).onRevert) == null || t.call(e, this);
		}
		return this;
	}
	static create(t, n) {
		return new e(t, n);
	}
	static register(e) {
		Ub = Ub || e || window.gsap, Ub && (Yb = Ub.utils.toArray, Qb = Ub.core.context || Qb), !Kb && window.innerWidth > 0 && (Wb = document.fonts, Kb = !0);
	}
};
dx.version = "3.15.1";
var fx = dx, px = typeof document < "u" ? y.useLayoutEffect : y.useEffect, mx = (e) => e && !Array.isArray(e) && typeof e == "object", hx = [], gx = {}, _x = g_, vx = (e, t = hx) => {
	let n = gx;
	mx(e) ? (n = e, e = null, t = "dependencies" in n ? n.dependencies : hx) : mx(t) && (n = t, t = "dependencies" in n ? n.dependencies : hx), e && typeof e != "function" && console.warn("First parameter must be a function or config object");
	let { scope: r, revertOnUpdate: i } = n, a = (0, y.useRef)(!1), o = (0, y.useRef)(_x.context(() => {}, r)), s = (0, y.useRef)((e) => o.current.add(null, e)), c = t && t.length && !i;
	return c && px(() => (a.current = !0, () => o.current.revert()), hx), px(() => {
		if (e && o.current.add(e, r), !c || !a.current) return () => o.current.revert();
	}, t), {
		context: o.current,
		contextSafe: s.current
	};
};
// src/public/motion/SplitText.tsx
vx.register = (e) => {
	_x = e;
}, vx.headless = !0, g_.registerPlugin($, fx, vx);
var yx = {
	opacity: 0,
	y: 40
}, bx = {
	opacity: 1,
	y: 0
}, xx = 180, Sx = 19, Cx = .024, wx = typeof window < "u" ? y.useLayoutEffect : y.useEffect, Tx = () => typeof document < "u" && (!document.fonts || document.fonts.status === "loaded"), Ex = (e) => 1 - Math.cos(e * Math.PI * 1.5) * (1 - e) ** 1.2, Dx = (e, t) => {
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
			ease: Ex
		};
		default: return {
			from: { ...yx },
			to: { ...bx },
			ease: "power3.out"
		};
	}
}, Ox = ({ text: e, id: t, tabIndex: n, className: r = "", delay: i = 50, duration: a = 1.25, ease: o, splitType: s = "chars", from: c, to: l, threshold: u = .1, rootMargin: d = "-100px", textAlign: f = "center", tag: p = "p", staggerFrom: m = "start", mask: h = !1, effect: g = "rise", trigger: _ = "view", loop: v = !1, loopDelay: b = 1.5, hoverEffect: x = "none", color: S, accentColor: C, onLetterAnimationComplete: w }) => {
	let T = (0, y.useRef)(null), [E, D] = (0, y.useState)(() => typeof window < "u" && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
	(0, y.useEffect)(() => {
		let e = window.matchMedia("(prefers-reduced-motion: reduce)"), t = () => D(e.matches);
		return e.addEventListener("change", t), t(), () => e.removeEventListener("change", t);
	}, []);
	let O = (0, y.useRef)(null), k = (0, y.useRef)(w), A = (0, y.useRef)({
		trigger: _,
		hoverEffect: x,
		accentColor: C
	}), [j, M] = (0, y.useState)(Tx), [N, P] = (0, y.useState)(!1);
	wx(() => {
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
	}, [j]), vx(() => {
		let t = T.current;
		if (!t || !e || !j) return;
		if (t.getBoundingClientRect(), !Tx()) {
			M(!1);
			return;
		}
		let n = () => {
			O.current !== e && (O.current = e, k.current?.());
		};
		if (E) {
			P(!0), n();
			return;
		}
		let r = (1 - u) * 100, f = /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(d), p = f ? parseFloat(f[1]) : 0, y = f && f[2] || "px", x = `top ${r}%${p === 0 ? "" : p < 0 ? `-=${Math.abs(p)}${y}` : `+=${p}${y}`}`, S = s.includes("chars") ? "chars" : s.includes("words") ? "words" : "lines", C = parseFloat(getComputedStyle(t).fontSize) || 16, w = c !== void 0 || l !== void 0, D = Dx(g, C), N = w ? { ...c || yx } : D.from, F = w ? { ...l || bx } : D.to, I = o || (w ? "power3.out" : D.ease), L = w ? "willChange" : "transform,filter,willChange", ee = Math.max(.35, a * .55), R = [], te = [], ne = g_.utils.distribute({
			each: i / 1e3,
			from: m
		}), re = O.current === e, ie = null, ae = null, oe = null, se = 0, z = 0, ce = null, le = C * .2, B = [], V = [], H = {
			x: 0,
			y: 0,
			inside: !1
		}, ue = (e, n) => {
			let r = A.current.accentColor, i = g_.timeline(n);
			return i.fromTo(R, {
				...N,
				willChange: "transform, opacity"
			}, {
				...F,
				duration: a,
				ease: I,
				stagger: ne,
				immediateRender: e
			}, 0), r && i.fromTo(R, { color: r }, {
				color: getComputedStyle(t).color,
				duration: a * .7,
				ease: "power1.inOut",
				stagger: ne,
				immediateRender: e
			}, a * .3), i.set(R, { clearProps: r ? `${L},color` : L }), i;
		}, de = () => {
			let e = A.current.accentColor, t = g_.timeline();
			return t.fromTo(R, {
				...F,
				willChange: "transform, opacity"
			}, {
				...N,
				duration: ee,
				ease: "power2.in",
				stagger: ne,
				immediateRender: !1
			}, 0), e && t.to(R, {
				color: e,
				duration: ee,
				ease: "power1.in",
				stagger: ne
			}, 0), t;
		}, fe = () => {
			!ae && re && R.length && (oe?.kill(), oe = null, ae = g_.timeline({ onComplete: () => {
				ae = null, pe();
			} }).add(de(), 0).add(ue(!1), ee));
		}, pe = () => {
			oe?.kill(), oe = v ? g_.delayedCall(b, fe) : null;
		}, me = () => {
			let e = t.getBoundingClientRect();
			ce = te.map((t, n) => {
				let r = t.getBoundingClientRect();
				return {
					x: r.left + r.width / 2 - e.left,
					y: r.top + r.height / 2 - e.top - (B[n]?.y || 0)
				};
			});
		}, U = (e) => {
			se = 0;
			let t = Math.min(.032, Math.max(.001, (e - z) / 1e3));
			z = e;
			let n = A.current.hoverEffect === "lift" && H.inside && re ? ce : null, r = C * 1.15, i = !1;
			for (let t = V.length - 1; t >= 0; t--) {
				if (e < V[t].at) continue;
				let n = B[V[t].index];
				n && (n.v -= V[t].velocity), V.splice(t, 1);
			}
			te.forEach((e, a) => {
				let o = B[a] || (B[a] = {
					y: 0,
					v: 0
				}), s = n?.[a], c = 0;
				if (s) {
					let e = (s.x - H.x) / r, t = (s.y - H.y) / (r * 1.4);
					c = -le * Math.exp(-(e * e + t * t) * .5);
				}
				o.v += (xx * (c - o.y) - Sx * o.v) * t, o.y += o.v * t, Math.abs(c - o.y) < .02 && Math.abs(o.v) < .05 ? (o.y = c, o.v = 0) : i = !0, e.style.translate = Math.abs(o.y) > .01 ? `0 ${o.y.toFixed(2)}px` : "";
			}), (i || V.length) && (se = requestAnimationFrame(U));
		}, he = () => {
			se ||= (z = performance.now(), requestAnimationFrame(U));
		}, W = (e) => {
			let n = t.getBoundingClientRect();
			H.x = e.clientX - n.left, H.y = e.clientY - n.top;
		}, G = (e) => {
			if (e.pointerType === "touch" || !matchMedia("(hover: hover) and (pointer: fine)").matches || (W(e), H.inside = !0, !re)) return;
			let t = A.current;
			if (t.trigger === "hover" && fe(), t.hoverEffect !== "none") {
				if (me(), t.hoverEffect === "wave") {
					let e = performance.now(), t = C * 9, n = C * .16 / Cx;
					ce?.forEach((r, i) => {
						V.push({
							index: i,
							velocity: n,
							at: e + Math.abs(r.x - H.x) / t * 1e3
						});
					});
				}
				he();
			}
		}, K = (e) => {
			e.pointerType !== "touch" && matchMedia("(hover: hover) and (pointer: fine)").matches && (W(e), H.inside = !0, re && A.current.hoverEffect === "lift" && (ce || me(), he()));
		}, ge = () => {
			H.inside = !1, he();
		}, _e = () => {
			A.current.trigger === "click" && fe();
		}, ve = new fx(t, {
			type: s,
			smartWrap: !0,
			autoSplit: s === "lines",
			mask: h ? S : void 0,
			linesClass: "split-line",
			wordsClass: "split-word",
			charsClass: "split-char",
			reduceWhiteSpace: !1,
			onSplit: (e) => {
				if (R = [
					e[S],
					e.chars,
					e.words,
					e.lines
				].find((e) => e.length) || [], te = h && e.masks?.length === R.length ? e.masks : R, ne = g_.utils.distribute({
					each: i / 1e3,
					from: m
				}), ce = null, B.length = 0, V.length = 0, ae && ae !== ie && (ae.kill(), ae = null), !re) return ie = ue(!0, {
					scrollTrigger: _ === "load" ? void 0 : {
						trigger: t,
						start: x,
						once: !0,
						fastScrollEnd: !0,
						anticipatePin: .4
					},
					onComplete: () => {
						re = !0, ie = null, ae = null, n(), pe();
					}
				}), ae = ie, ie;
			}
		}), ye = () => {
			ie?.progress(1), oe?.kill(), g_.set(R, {
				...F,
				clearProps: "transform,filter,willChange"
			}), re = !0, n();
		};
		return t.addEventListener("focus", ye), t === document.activeElement && ye(), P(!0), re && t !== document.activeElement && pe(), t.addEventListener("pointerenter", G), t.addEventListener("pointermove", K), t.addEventListener("pointerleave", ge), t.addEventListener("click", _e), () => {
			cancelAnimationFrame(se), oe?.kill(), ae?.kill(), t.removeEventListener("focus", ye), t.removeEventListener("pointerenter", G), t.removeEventListener("pointermove", K), t.removeEventListener("pointerleave", ge), t.removeEventListener("click", _e), te.forEach((e) => {
				e.style.translate = "";
			}), $.getAll().forEach((e) => {
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
	let F = p || "p", I = x === "none" && (c !== void 0 || l !== void 0 || g === "rise" || g === "fade");
	return /* @__PURE__ */ (0, X.jsx)(F, {
		ref: T,
		id: t,
		tabIndex: n,
		"data-split-ready": N || void 0,
		className: `sv-split-text ${r}`,
		style: {
			textAlign: f,
			overflow: I ? "hidden" : "visible",
			display: "block",
			whiteSpace: "normal",
			wordWrap: "break-word",
			color: S,
			cursor: _ === "click" ? "pointer" : void 0
		},
		children: e
	}, e);
};
// src/public/motion/ScrollReveal.tsx
g_.registerPlugin($);
var kx = typeof window < "u" ? y.useLayoutEffect : y.useEffect, Ax = .5, jx = "inset(-1em -1em -0.15em -1em)", Mx = (e) => typeof e == "string" && !e.startsWith("clamp(") ? `clamp(${e})` : e, Nx = (e) => Math.min(Math.max(e, 0), 1), Px = (e) => e * e * (3 - 2 * e), Fx = (e) => 1 - (1 - e) ** 3, Ix = (e, t) => {
	let n = e - 1;
	return 1 + (t + 1) * n * n * n + t * n * n;
}, Lx = (e) => e <= 0 || e >= 1 ? 0 : e < .35 ? Px(e / .35) : 1 - Px((e - .35) / .65), Rx = (e, t, n) => {
	let r = t, i = t, a = "";
	n.effect === "rise" ? (r = Fx(t), i = Nx(r * 1.25), r < 1 && (a = n.masked ? `translateY(${((1 - r) * 100).toFixed(2)}%) translateY(${((1 - r) * .2).toFixed(3)}em)` : `translateY(${((1 - r) * .8).toFixed(3)}em)`)) : n.effect === "flip" ? (r = Ix(t, 1.2), i = Nx(t * 2), t < 1 && (a = `perspective(6em) rotateX(${((1 - r) * 90).toFixed(2)}deg)`)) : n.effect === "scale" && (r = Ix(t, 1.6), i = Nx(t * 1.6), t < 1 && (a = `scale(${(.35 + .65 * r).toFixed(4)})`)), n.highlightColor && (i = Math.max(i, Nx(t / .35)));
	let o = Nx(r), s = n.offset * (1 - o);
	if (e.style.opacity = t >= 1 ? "" : (n.baseOpacity + (1 - n.baseOpacity) * i).toFixed(3), e.style.transform = [s ? `translateY(${s.toFixed(2)}px)` : "", a].filter(Boolean).join(" "), e.style.filter = n.blur && o < 1 ? `blur(${(n.blur * (1 - o)).toFixed(2)}px)` : "", n.highlightColor) {
		let r = Lx(t);
		e.style.color = r > .002 ? `color-mix(in srgb, ${n.highlightColor} ${(r * 100).toFixed(1)}%, currentColor)` : "";
	}
}, zx = ({ children: e, id: t, tabIndex: n, scrollContainerRef: r, enableBlur: i = !0, baseOpacity: a = .1, baseRotation: o = 3, blurStrength: s = 4, baseOffset: c = 0, stagger: l = .05, smoothing: u = 0, splitBy: d = "words", effect: f = "fade", mode: p = "scrub", duration: m = .8, highlightColor: h = "", containerClassName: g = "", textClassName: _ = "", rotationEnd: v = "bottom bottom", wordAnimationEnd: b = "bottom bottom" }) => {
	let x = (0, y.useRef)(null), S = (0, y.useRef)(null), C = (0, y.useMemo)(() => {
		let t = y.Children.toArray(e);
		return t.every((e) => typeof e == "string" || typeof e == "number") ? t.join("") : null;
	}, [e]), w = (0, y.useMemo)(() => C === null ? null : C.split(/(\s+)/).map((e, t) => e.trim() === "" ? e : /* @__PURE__ */ (0, X.jsx)("span", {
		className: "scroll-reveal-word",
		children: d === "chars" ? Array.from(e).map((e, t) => /* @__PURE__ */ (0, X.jsx)("span", {
			className: "scroll-reveal-piece",
			children: e
		}, t)) : /* @__PURE__ */ (0, X.jsx)("span", {
			className: "scroll-reveal-piece",
			children: e
		})
	}, t)), [C, d]), [T, E] = (0, y.useState)(!1);
	return (0, y.useEffect)(() => E(!0), []), kx(() => {
		let e = x.current, t = S.current;
		if (!e || !t || r && !r.current) return;
		let n = r?.current || window, g = Array.from(e.querySelectorAll(".scroll-reveal-word")), _ = g.length ? Array.from(e.querySelectorAll(".scroll-reveal-piece")) : [t], y = () => n instanceof HTMLElement ? n.clientHeight : window.innerHeight, C = u > 0 ? u : !0, w = p === "enter" ? Math.max(.05, m) : Ax, T = Math.max(0, l), E = {
			effect: f,
			masked: f === "rise" && g.length > 0,
			baseOpacity: a,
			blur: i ? s : 0,
			offset: c,
			highlightColor: h
		}, D = g_.matchMedia();
		return D.add("(prefers-reduced-motion: no-preference)", () => {
			let r = _.map((e, t) => t), i = _.map(() => -1), a = { p: 0 }, s = e === document.activeElement, l = _.length, u = () => {
				if (d !== "lines" || !g.length) return;
				let e = -1, t = -Infinity;
				g.forEach((n, i) => {
					let a = n.offsetTop;
					Math.abs(a - t) > 2 && (e += 1, t = a), r[i] = e;
				}), l = e + 1;
			}, m = () => w + Math.max(0, l - 1) * T, h = () => {
				let e = (s ? 1 : a.p) * m();
				_.forEach((t, n) => {
					let a = Nx((e - r[n] * T) / w);
					a !== i[n] && (i[n] = a, Rx(t, a, E));
				});
			}, x = () => {
				s = !0, h();
			};
			if (e.addEventListener("focus", x), u(), _.forEach((e) => {
				e.style.willChange = _.length > 80 ? "" : f === "fade" && !c ? "opacity" : "opacity, transform", e.style.transformOrigin = f === "flip" ? "50% 100%" : "";
			}), E.masked && g.forEach((e) => {
				e.style.clipPath = jx;
			}), h(), p === "enter") {
				let t = !1, r = () => {
					t || (t = !0, g_.to(a, {
						p: 1,
						duration: m(),
						ease: "none",
						onUpdate: h
					}), o && g_.to(e, {
						rotate: 0,
						duration: Math.min(m(), 1.4),
						ease: "power3.out"
					}));
				};
				o && g_.set(e, {
					transformOrigin: "0% 50%",
					rotate: o
				}), $.create({
					trigger: e,
					scroller: n,
					start: () => {
						let t = y(), r = e.getBoundingClientRect().top - (n instanceof HTMLElement ? n.getBoundingClientRect().top + n.clientTop - n.scrollTop : -window.scrollY) - t + .2 * Math.min(e.offsetHeight, t);
						return Math.min(r, $.maxScroll(n) - 1);
					},
					onEnter: r,
					onLeave: r,
					onRefresh: (e) => {
						e.progress > 0 && r();
					}
				});
			} else o && g_.fromTo(e, {
				transformOrigin: "0% 50%",
				rotate: o
			}, {
				ease: "none",
				rotate: 0,
				scrollTrigger: {
					trigger: e,
					scroller: n,
					start: "top bottom",
					end: Mx(v),
					scrub: C
				}
			}), g_.to(a, {
				p: 1,
				ease: "none",
				onUpdate: h,
				scrollTrigger: {
					trigger: e,
					scroller: n,
					start: () => `top bottom-=${.2 * Math.min(e.offsetHeight, y())}`,
					end: Mx(b),
					scrub: C
				}
			});
			let S = d === "lines" && typeof ResizeObserver < "u" ? new ResizeObserver(() => {
				u(), i.fill(-1), h();
			}) : null;
			return S?.observe(t), () => {
				e.removeEventListener("focus", x), S?.disconnect(), _.forEach((e) => {
					e.style.opacity = "", e.style.transform = "", e.style.transformOrigin = "", e.style.filter = "", e.style.color = "", e.style.willChange = "";
				}), g.forEach((e) => {
					e.style.clipPath = "";
				});
			};
		}), () => D.revert();
	}, [
		T,
		r,
		C,
		d,
		f,
		p,
		m,
		h,
		i,
		a,
		o,
		s,
		c,
		l,
		u,
		v,
		b
	]), /* @__PURE__ */ (0, X.jsx)("h2", {
		id: t,
		tabIndex: n,
		"data-motion-reading": !0,
		ref: x,
		className: `scroll-reveal ${g}`,
		"aria-label": C ?? void 0,
		children: /* @__PURE__ */ (0, X.jsx)("span", {
			ref: S,
			className: `scroll-reveal-text ${_}`,
			"aria-hidden": C !== null || void 0,
			children: w ?? e
		})
	});
};
// src/public/landing-motion.ts
function Bx(e) {
	(0, y.useEffect)(() => {
		let t = e.current;
		if (!t) return;
		let n = window.matchMedia("(prefers-reduced-motion: reduce)"), r = window.scrollY, i = 0;
		function a() {
			if (!t) return;
			let e = Math.max(0, window.scrollY), a = e > 72;
			t.toggleAttribute("data-header-solid", a), e <= 168 || n.matches ? (t.removeAttribute("data-header-hidden"), r = e) : Math.abs(e - r) >= 5 && (t.toggleAttribute("data-header-hidden", e > r), r = e), i = 0;
		}
		function o() {
			i ||= requestAnimationFrame(a);
		}
		let s = t.querySelectorAll("[data-landing-reveal]"), c = (e) => {
			e.removeAttribute("data-awaiting-view"), e.setAttribute("data-in-view", "");
		}, l = typeof IntersectionObserver == "function" ? new IntersectionObserver((e) => {
			for (let t of e) t.isIntersecting && (c(t.target), l?.unobserve(t.target));
		}, { threshold: .08 }) : null;
		function u() {
			l?.disconnect();
			for (let e of s) n.matches || !l ? (e.removeAttribute("data-awaiting-view"), e.removeAttribute("data-in-view")) : e.hasAttribute("data-in-view") || (e.getBoundingClientRect().bottom <= 0 || e.contains(document.activeElement) ? e.removeAttribute("data-awaiting-view") : (e.setAttribute("data-awaiting-view", ""), l.observe(e)));
			o();
		}
		function d(e) {
			let t = e.target.closest("[data-awaiting-view]");
			for (; t;) c(t), l?.unobserve(t), t = t.parentElement?.closest("[data-awaiting-view]") ?? null;
		}
		let f = window.matchMedia("(hover: hover) and (pointer: fine)"), p = t.querySelectorAll("[data-landing-pointer]");
		function m(e) {
			if (n.matches || !f.matches || e.pointerType === "touch") return;
			let t = e.currentTarget, r = t.getBoundingClientRect(), i = ((e.clientX - r.left) / r.width - .5) * 2, a = ((e.clientY - r.top) / r.height - .5) * 2;
			t.style.setProperty("--pointer-x", i.toFixed(3)), t.style.setProperty("--pointer-y", a.toFixed(3));
		}
		function h(e) {
			let t = e.currentTarget;
			t.style.removeProperty("--pointer-x"), t.style.removeProperty("--pointer-y");
		}
		for (let e of p) e.addEventListener("pointermove", m), e.addEventListener("pointerleave", h);
		return u(), window.addEventListener("scroll", o, { passive: !0 }), n.addEventListener("change", u), t.addEventListener("focusin", d), () => {
			l?.disconnect(), cancelAnimationFrame(i), window.removeEventListener("scroll", o), n.removeEventListener("change", u), t.removeEventListener("focusin", d);
			for (let e of p) e.removeEventListener("pointermove", m), e.removeEventListener("pointerleave", h);
		};
	}, [e]);
}
// src/public/public-layout.tsx
function Vx({ page: e, lightHeader: t = !1, children: n }) {
	let r = (0, y.useRef)(null);
	return Bx(r), /* @__PURE__ */ (0, X.jsxs)("div", {
		className: "sv-landing",
		ref: r,
		"data-header-light": t || void 0,
		children: [
			/* @__PURE__ */ (0, X.jsx)(af, { current: e }),
			/* @__PURE__ */ (0, X.jsx)("main", {
				id: "conteudo",
				tabIndex: -1,
				children: n
			}),
			/* @__PURE__ */ (0, X.jsx)(sf, {}),
			/* @__PURE__ */ (0, X.jsx)(cf, { focusTitle: e !== "home" })
		]
	});
}
// src/public/purchase-examples.tsx
var Hx = [
	{
		id: "ficha-de-demanda",
		step: 1,
		Icon: bd,
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
		Icon: Sd,
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
		Icon: md,
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
		Icon: Ed,
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
function Ux({ example: e }) {
	let { Icon: t, title: n, fields: r } = e;
	return /* @__PURE__ */ (0, X.jsxs)("div", {
		className: "sv-quote sv-editorial-record",
		children: [/* @__PURE__ */ (0, X.jsxs)("div", {
			className: "sv-quote-heading",
			children: [/* @__PURE__ */ (0, X.jsxs)("span", { children: [
				/* @__PURE__ */ (0, X.jsx)(t, {
					size: 18,
					"aria-hidden": "true"
				}),
				" ",
				n
			] }), /* @__PURE__ */ (0, X.jsx)("small", { children: "Exemplo" })]
		}), /* @__PURE__ */ (0, X.jsx)("dl", { children: r.map(([e, t]) => /* @__PURE__ */ (0, X.jsxs)("div", { children: [/* @__PURE__ */ (0, X.jsx)("dt", { children: e }), /* @__PURE__ */ (0, X.jsx)("dd", { children: t })] }, e)) })]
	});
}
// src/public/home.tsx
function Wx() {
	let e = (0, y.useRef)(null), [t, n] = (0, y.useState)(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches || !!navigator.connection?.saveData), r = !new URLSearchParams(location.hash.split("?")[1]).has("secao");
	return (0, y.useEffect)(() => {
		let r = e.current;
		if (!r) return;
		let i = !0, a = () => {
			t || document.hidden || !i ? r.pause() : r.play().catch(() => n(!0));
		}, o = new IntersectionObserver((e) => {
			i = e[0].isIntersecting, a();
		});
		return o.observe(r), document.addEventListener("visibilitychange", a), a(), () => {
			o.disconnect(), document.removeEventListener("visibilitychange", a), r.pause();
		};
	}, [t]), /* @__PURE__ */ (0, X.jsxs)("section", {
		className: "sv-hero",
		"data-enter": !0,
		"data-landing-opening": r || void 0,
		"data-video-paused": t || void 0,
		"aria-labelledby": "public-title",
		children: [/* @__PURE__ */ (0, X.jsx)("div", {
			className: "sv-hero-media",
			children: /* @__PURE__ */ (0, X.jsx)("video", {
				ref: e,
				muted: !0,
				loop: !0,
				playsInline: !0,
				preload: "none",
				poster: "./assets/cnc-lathe-poster.jpg",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, X.jsx)("source", {
					src: "./assets/cnc-lathe.webm",
					type: "video/webm"
				})
			})
		}), /* @__PURE__ */ (0, X.jsxs)("div", {
			className: "sv-shell sv-landing-hero",
			children: [/* @__PURE__ */ (0, X.jsxs)("div", {
				className: `sv-landing-lead t-stagger${r ? " is-shown" : ""}`,
				children: [
					/* @__PURE__ */ (0, X.jsxs)("h1", {
						id: "public-title",
						tabIndex: -1,
						children: [
							/* @__PURE__ */ (0, X.jsx)("span", {
								className: "sv-hero-prefix t-stagger-line",
								children: "Conecte a"
							}),
							" ",
							/* @__PURE__ */ (0, X.jsx)("span", {
								className: "sv-hero-word t-stagger-line t-stagger-line--2",
								children: /* @__PURE__ */ (0, X.jsx)("span", {
									className: r ? "t-shimmer" : void 0,
									children: "indústria"
								})
							})
						]
					}),
					/* @__PURE__ */ (0, X.jsx)("p", {
						className: "sv-hero-description t-stagger-line t-stagger-line--3",
						children: "Marketplace B2B de compras e fornecimento industrial."
					}),
					/* @__PURE__ */ (0, X.jsx)("div", {
						className: "sv-hero-actions t-stagger-line t-stagger-line--4",
						children: /* @__PURE__ */ (0, X.jsx)(rf, { children: "Cadastrar empresa" })
					})
				]
			}), /* @__PURE__ */ (0, X.jsxs)("div", {
				className: "sv-hero-controls",
				children: [/* @__PURE__ */ (0, X.jsxs)("a", {
					className: "sv-hero-scroll",
					href: Yd("explorar"),
					children: ["Conheça o SIVI ", /* @__PURE__ */ (0, X.jsx)(Qu, {
						size: 18,
						"aria-hidden": "true"
					})]
				}), /* @__PURE__ */ (0, X.jsx)("button", {
					type: "button",
					className: "sv-video-control",
					"aria-label": t ? "Reproduzir vídeo de fundo" : "Pausar vídeo de fundo",
					onClick: () => n(!t),
					children: t ? /* @__PURE__ */ (0, X.jsx)(Ad, {
						size: 18,
						"aria-hidden": "true"
					}) : /* @__PURE__ */ (0, X.jsx)(Od, {
						size: 18,
						"aria-hidden": "true"
					})
				})]
			})]
		})]
	});
}
var Gx = [
	{
		Icon: Sd,
		label: "Material",
		description: "Informe a liga, o insumo ou o tipo de peça."
	},
	{
		Icon: Pd,
		label: "Processo",
		description: "Indique a operação necessária, como usinagem CNC."
	},
	{
		Icon: id,
		label: "Quantidade",
		description: "Defina o volume solicitado para cada item."
	},
	{
		Icon: od,
		label: "Prazo",
		description: "Deixe clara a data necessária para a compra."
	}
], Kx = [
	{
		step: 2,
		title: "Compatibilidade industrial",
		description: "Confira quais requisitos da demanda têm correspondência no perfil apresentado pelo fornecedor e quais ainda precisam ser confirmados."
	},
	{
		step: 3,
		title: "Histórico de propostas",
		description: "Quando uma cotação é revisada, a versão anterior continua disponível. Compare preço, prazo, frete e condições de pagamento."
	},
	{
		step: 5,
		title: "Inspeção e liberação",
		description: "O fornecedor registra plano, evidências e quantidade aprovada por item. A expedição depende da liberação da qualidade."
	},
	{
		step: 7,
		title: "Recebimento e avaliação",
		description: "O comprador confirma que recebeu o pedido e registra uma avaliação do fornecimento. As duas empresas podem consultar o histórico da compra."
	}
], qx = [
	{
		href: Kd("faq"),
		title: "Como cadastrar a empresa",
		description: "Veja quais dados informar e como acompanhar a análise."
	},
	{
		href: Zd("ajuda"),
		title: "Primeiro acesso",
		description: "Confirme o e-mail, entre na conta e retome a revisão da empresa."
	},
	{
		href: Zd("seguranca"),
		title: "Acessos e dados",
		description: "Entenda a diferença entre conta pessoal, empresa e atuação."
	}
];
function Jx() {
	return /* @__PURE__ */ (0, X.jsx)("section", {
		className: "sv-solutions",
		"aria-labelledby": "solucoes-inicio",
		children: /* @__PURE__ */ (0, X.jsxs)("div", {
			className: "sv-shell",
			children: [/* @__PURE__ */ (0, X.jsx)("div", {
				className: "sv-display-heading sv-display-heading--center",
				children: /* @__PURE__ */ (0, X.jsx)(Ox, {
					id: "solucoes-inicio",
					tag: "h2",
					text: "Soluções para cada etapa da compra.",
					effect: "wave",
					delay: 22,
					duration: .7,
					hoverEffect: "lift"
				})
			}), /* @__PURE__ */ (0, X.jsxs)("div", {
				className: "sv-solution-list",
				children: [
					/* @__PURE__ */ (0, X.jsxs)("article", {
						className: "sv-solution",
						children: [/* @__PURE__ */ (0, X.jsxs)("div", {
							className: "sv-solution-copy",
							children: [
								/* @__PURE__ */ (0, X.jsx)("h3", { children: "Publique uma demanda técnica." }),
								/* @__PURE__ */ (0, X.jsx)("p", { children: "Descreva o que sua empresa precisa comprar e separe os requisitos por item. Quem fornece consulta a mesma especificação ao preparar a cotação." }),
								/* @__PURE__ */ (0, X.jsx)(rf, {
									href: Yd("compras"),
									children: "Conhecer compras"
								})
							]
						}), /* @__PURE__ */ (0, X.jsx)("div", {
							className: "sv-solution-visual sv-quote-visual",
							"data-landing-reveal": "record",
							children: /* @__PURE__ */ (0, X.jsx)(Ux, { example: Hx[0] })
						})]
					}),
					/* @__PURE__ */ (0, X.jsxs)("article", {
						className: "sv-solution sv-solution--reverse",
						children: [/* @__PURE__ */ (0, X.jsxs)("div", {
							className: "sv-solution-copy",
							children: [
								/* @__PURE__ */ (0, X.jsx)("h3", { children: "Apresente sua capacidade industrial." }),
								/* @__PURE__ */ (0, X.jsx)("p", { children: "Informe os materiais, processos e regiões que atende. Consulte demandas compatíveis com seu perfil e envie suas condições de fornecimento." }),
								/* @__PURE__ */ (0, X.jsx)(rf, {
									href: Yd("fornecimento"),
									children: "Conhecer fornecimento"
								})
							]
						}), /* @__PURE__ */ (0, X.jsx)("div", {
							className: "sv-solution-visual sv-solution-photo",
							"data-landing-reveal": "curtain",
							"data-landing-pointer": "photo",
							children: /* @__PURE__ */ (0, X.jsx)("img", {
								src: "./assets/detalhe-torno.jpg",
								alt: "Ferramenta de usinagem em bancada industrial",
								loading: "lazy",
								width: "960",
								height: "640"
							})
						})]
					}),
					/* @__PURE__ */ (0, X.jsxs)("article", {
						className: "sv-solution",
						children: [/* @__PURE__ */ (0, X.jsxs)("div", {
							className: "sv-solution-copy",
							children: [
								/* @__PURE__ */ (0, X.jsx)("h3", { children: "Acompanhe o pedido até a entrega." }),
								/* @__PURE__ */ (0, X.jsx)("p", { children: "As condições aceitas ficam no pedido. A partir dele, o fornecedor registra inspeção e expedição, e o comprador confirma o recebimento." }),
								/* @__PURE__ */ (0, X.jsx)(rf, {
									href: Yd("funcionamento"),
									children: "Ver etapas do pedido"
								})
							]
						}), /* @__PURE__ */ (0, X.jsx)("div", {
							className: "sv-solution-visual sv-quote-visual",
							"data-landing-reveal": "record",
							children: /* @__PURE__ */ (0, X.jsx)(Ux, { example: Hx[3] })
						})]
					})
				]
			})]
		})
	});
}
function Yx() {
	return /* @__PURE__ */ (0, X.jsx)("section", {
		className: "sv-home-cases",
		"aria-labelledby": "casos-inicio",
		children: /* @__PURE__ */ (0, X.jsxs)("div", {
			className: "sv-shell sv-story-split",
			children: [/* @__PURE__ */ (0, X.jsxs)("div", {
				className: "sv-display-heading sv-story-heading",
				children: [
					/* @__PURE__ */ (0, X.jsx)("h2", {
						id: "casos-inicio",
						"data-landing-reveal": "title",
						children: "Casos de uso de uma compra industrial."
					}),
					/* @__PURE__ */ (0, X.jsx)("p", { children: "Veja como as duas empresas lidam com cotações diferentes e registram a inspeção dos itens acordados." }),
					/* @__PURE__ */ (0, X.jsx)(rf, {
						href: Kd("cases"),
						children: "Ver todos os casos"
					})
				]
			}), /* @__PURE__ */ (0, X.jsx)("div", {
				className: "sv-story-stack",
				children: Hx.slice(1, 3).map((e) => /* @__PURE__ */ (0, X.jsxs)("article", {
					className: "sv-story-card",
					children: [/* @__PURE__ */ (0, X.jsx)("div", {
						className: "sv-example-art",
						"data-landing-reveal": "record",
						children: /* @__PURE__ */ (0, X.jsx)(Ux, { example: e })
					}), /* @__PURE__ */ (0, X.jsxs)("a", {
						className: "sv-text-link",
						href: qd("cases", e.id),
						children: [
							e.title,
							" ",
							/* @__PURE__ */ (0, X.jsx)(tf, {})
						]
					})]
				}, e.id))
			})]
		})
	});
}
function Xx() {
	return /* @__PURE__ */ (0, X.jsxs)(Vx, {
		page: "home",
		children: [
			/* @__PURE__ */ (0, X.jsx)(Wx, {}),
			/* @__PURE__ */ (0, X.jsx)("section", {
				className: "sv-home-explore",
				"aria-labelledby": "explorar",
				children: /* @__PURE__ */ (0, X.jsxs)("div", {
					className: "sv-shell sv-page-split",
					"data-landing-pointer": "parallax",
					children: [/* @__PURE__ */ (0, X.jsxs)("div", {
						className: "sv-display-heading",
						children: [
							/* @__PURE__ */ (0, X.jsx)(Ox, {
								id: "explorar",
								tabIndex: -1,
								tag: "h2",
								text: "Da necessidade de compra ao pedido entregue.",
								splitType: "words",
								effect: "rise",
								mask: !0,
								delay: 70,
								duration: .8,
								textAlign: "left",
								rootMargin: "-48px"
							}),
							/* @__PURE__ */ (0, X.jsx)("p", { children: "O SIVI reúne empresas que compram e empresas que fabricam ou fornecem. A plataforma organiza os requisitos da demanda, as propostas recebidas e os registros do pedido em uma mesma jornada." }),
							/* @__PURE__ */ (0, X.jsx)(rf, {
								href: Kd("about"),
								children: "Conhecer o SIVI"
							})
						]
					}), /* @__PURE__ */ (0, X.jsxs)("div", {
						className: "sv-about-visual",
						"data-landing-reveal": "iris",
						children: [/* @__PURE__ */ (0, X.jsx)("img", {
							src: "./assets/operador-torno.jpg",
							alt: "Operador trabalhando em um torno industrial",
							loading: "lazy",
							width: "960",
							height: "640"
						}), /* @__PURE__ */ (0, X.jsx)("span", {
							"aria-hidden": "true",
							children: /* @__PURE__ */ (0, X.jsx)(tf, {})
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, X.jsx)("section", {
				className: "sv-criteria",
				"aria-labelledby": "criterios-inicio",
				children: /* @__PURE__ */ (0, X.jsxs)("div", {
					className: "sv-shell",
					children: [/* @__PURE__ */ (0, X.jsx)("div", {
						className: "sv-display-heading",
						children: /* @__PURE__ */ (0, X.jsx)("h2", {
							id: "criterios-inicio",
							children: "O que entra em uma demanda?"
						})
					}), /* @__PURE__ */ (0, X.jsx)("dl", {
						className: "sv-criteria-grid",
						children: Gx.map(({ Icon: e, label: t, description: n }, r) => /* @__PURE__ */ (0, X.jsxs)("div", {
							"data-landing-reveal": "line",
							style: { "--sv-delay": `${r * 90}ms` },
							children: [/* @__PURE__ */ (0, X.jsxs)("dt", { children: [
								/* @__PURE__ */ (0, X.jsx)(e, { "aria-hidden": "true" }),
								" ",
								t
							] }), /* @__PURE__ */ (0, X.jsx)("dd", { children: n })]
						}, t))
					})]
				})
			}),
			/* @__PURE__ */ (0, X.jsx)(Jx, {}),
			/* @__PURE__ */ (0, X.jsx)("section", {
				className: "sv-home-agreement",
				"aria-labelledby": "acordo-inicio",
				children: /* @__PURE__ */ (0, X.jsxs)("div", {
					className: "sv-shell sv-page-split",
					children: [/* @__PURE__ */ (0, X.jsx)("div", {
						className: "sv-display-heading",
						children: /* @__PURE__ */ (0, X.jsx)(zx, {
							id: "acordo-inicio",
							baseOpacity: .35,
							baseRotation: 0,
							enableBlur: !1,
							wordAnimationEnd: "top 40%",
							smoothing: .25,
							children: "O que foi aceito acompanha o pedido."
						})
					}), /* @__PURE__ */ (0, X.jsxs)("div", {
						className: "sv-display-heading",
						children: [/* @__PURE__ */ (0, X.jsx)("p", { children: "Preço, prazo, frete e pagamento ficam registrados quando a proposta é aceita. Se ela passou por revisões, o histórico permite consultar como as condições mudaram até o aceite." }), /* @__PURE__ */ (0, X.jsx)(rf, {
							href: Xd(4),
							children: "Ver como o pedido é formado"
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, X.jsx)(Yx, {}),
			/* @__PURE__ */ (0, X.jsx)("section", {
				className: "sv-resources",
				"aria-labelledby": "recursos-inicio",
				children: /* @__PURE__ */ (0, X.jsxs)("div", {
					className: "sv-shell sv-page-split",
					children: [/* @__PURE__ */ (0, X.jsxs)("div", {
						className: "sv-display-heading",
						children: [/* @__PURE__ */ (0, X.jsx)("h2", {
							id: "recursos-inicio",
							children: "Recursos do SIVI."
						}), /* @__PURE__ */ (0, X.jsx)("p", { children: "Explore como a plataforma organiza o trabalho em cada etapa." })]
					}), /* @__PURE__ */ (0, X.jsx)("div", {
						className: "sv-disclosures",
						children: Kx.map(({ step: e, title: t, description: n }) => /* @__PURE__ */ (0, X.jsxs)("details", { children: [/* @__PURE__ */ (0, X.jsxs)("summary", { children: [t, /* @__PURE__ */ (0, X.jsx)("span", {
							"aria-hidden": "true",
							children: "+"
						})] }), /* @__PURE__ */ (0, X.jsxs)("div", { children: [/* @__PURE__ */ (0, X.jsx)("p", { children: n }), /* @__PURE__ */ (0, X.jsxs)("a", {
							className: "sv-text-link",
							href: Xd(e),
							children: ["Ver etapa ", /* @__PURE__ */ (0, X.jsx)(tf, {})]
						})] })] }, e))
					})]
				})
			}),
			/* @__PURE__ */ (0, X.jsx)("section", {
				className: "sv-landing-close",
				"aria-labelledby": "comecar-title",
				children: /* @__PURE__ */ (0, X.jsxs)("div", {
					className: "sv-shell",
					children: [/* @__PURE__ */ (0, X.jsxs)("div", {
						className: "sv-display-heading",
						children: [
							/* @__PURE__ */ (0, X.jsxs)("h2", {
								id: "comecar-title",
								"data-landing-reveal": "title",
								children: [
									"Sua empresa",
									/* @__PURE__ */ (0, X.jsx)("br", {}),
									"na rede industrial."
								]
							}),
							/* @__PURE__ */ (0, X.jsx)("p", {
								"data-landing-reveal": "fade",
								children: "Cadastre uma empresa compradora, fornecedora ou com as duas atuações."
							}),
							/* @__PURE__ */ (0, X.jsx)(rf, { children: "Cadastrar empresa" })
						]
					}), /* @__PURE__ */ (0, X.jsx)("div", {
						className: "sv-close-visual",
						"data-landing-scroll": "wipe",
						"aria-hidden": "true",
						children: /* @__PURE__ */ (0, X.jsx)(nd, {
							className: "sv-close-arrow",
							strokeWidth: .8
						})
					})]
				})
			}),
			/* @__PURE__ */ (0, X.jsx)("section", {
				className: "sv-guides",
				"aria-labelledby": "guias-inicio",
				children: /* @__PURE__ */ (0, X.jsxs)("div", {
					className: "sv-shell",
					children: [/* @__PURE__ */ (0, X.jsx)("div", {
						className: "sv-display-heading",
						children: /* @__PURE__ */ (0, X.jsx)("h2", {
							id: "guias-inicio",
							children: "Guias para começar."
						})
					}), /* @__PURE__ */ (0, X.jsx)("div", {
						className: "sv-explore-grid",
						children: qx.map(({ href: e, title: t, description: n }) => /* @__PURE__ */ (0, X.jsxs)("a", {
							href: e,
							children: [
								/* @__PURE__ */ (0, X.jsx)("h3", { children: t }),
								/* @__PURE__ */ (0, X.jsx)(tf, {}),
								/* @__PURE__ */ (0, X.jsx)("p", { children: n })
							]
						}, e))
					})]
				})
			})
		]
	});
}
// src/public/motion/SlidingIndicator.tsx
function Zx({ selected: e }) {
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
	}, [e]), /* @__PURE__ */ (0, X.jsx)("span", {
		ref: t,
		className: "t-tabs-pill",
		"aria-hidden": "true"
	});
}
String.raw;
// node_modules/number-flow/dist/ssr-DvIINv8w.mjs
var Qx = String.raw, $x = (() => {
	try {
		document.createElement("div").animate({ opacity: 0 }, { easing: "linear(0, 1)" });
	} catch {
		return !1;
	}
	return !0;
})(), eS = typeof CSS < "u" && CSS.supports && CSS.supports("line-height", "mod(1,1)"), tS = typeof matchMedia < "u" ? matchMedia("(prefers-reduced-motion: reduce)") : null, nS = "--_number-flow-d-opacity", rS = "--_number-flow-d-width", iS = "--_number-flow-dx", aS = "--_number-flow-d", oS = (() => {
	try {
		return CSS.registerProperty({
			name: nS,
			syntax: "<number>",
			inherits: !1,
			initialValue: "0"
		}), CSS.registerProperty({
			name: iS,
			syntax: "<length>",
			inherits: !0,
			initialValue: "0px"
		}), CSS.registerProperty({
			name: rS,
			syntax: "<number>",
			inherits: !1,
			initialValue: "0"
		}), CSS.registerProperty({
			name: aS,
			syntax: "<number>",
			inherits: !0,
			initialValue: "0"
		}), !0;
	} catch {
		return !1;
	}
})(), sS = "round(nearest, calc(var(--number-flow-mask-height, 0.25em) / 2), 1px)", cS = `calc(${sS} * 2)`, lS = "var(--number-flow-mask-width, 0.5em)", uS = `calc(${lS} / var(--scale-x))`, dS = "#000 0, transparent 71%", fS = Qx`:host{display:inline-block;direction:ltr;white-space:nowrap;isolation:isolate;line-height:1}.number,.number__inner{display:inline-block;transform-origin:left top}:host([data-will-change]) :is(.number,.number__inner,.section,.digit,.digit__num,.symbol){will-change:transform}.number{--scale-x:calc(1 + var(${rS}) / var(--width));transform:translateX(var(${iS})) scaleX(var(--scale-x));margin:0 calc(-1 * ${lS});position:relative;-webkit-mask-image:linear-gradient(to right,transparent 0,#000 ${uS},#000 calc(100% - ${uS}),transparent ),linear-gradient(to bottom,transparent 0,#000 ${cS},#000 calc(100% - ${cS}),transparent 100% ),radial-gradient(at bottom right,${dS}),radial-gradient(at bottom left,${dS}),radial-gradient(at top left,${dS}),radial-gradient(at top right,${dS});-webkit-mask-size:100% calc(100% - ${cS} * 2),calc(100% - ${uS} * 2) 100%,${uS} ${cS},${uS} ${cS},${uS} ${cS},${uS} ${cS};-webkit-mask-position:center,center,top left,top right,bottom right,bottom left;-webkit-mask-repeat:no-repeat}.number__inner{padding:${sS} ${lS};transform:scaleX(calc(1 / var(--scale-x))) translateX(calc(-1 * var(${iS})))}:host > :not(.number){z-index:5}.section,.symbol{display:inline-block;position:relative;isolation:isolate}.section::after{content:'\200b';display:inline-block}.section--justify-left{transform-origin:center left}.section--justify-right{transform-origin:center right}.section > [inert],.symbol > [inert]{margin:0 !important;position:absolute !important;z-index:-1}.digit{display:inline-block;position:relative;--c:var(--current) + var(${aS})}.digit__num,.number .section::after{padding:${sS} 0}.digit__num{display:inline-block;--offset-raw:mod(var(--length) + var(--n) - mod(var(--c),var(--length)),var(--length));--offset:calc( var(--offset-raw) - var(--length) * round(down,var(--offset-raw) / (var(--length) / 2),1) );--y:clamp(-100%,var(--offset) * 100%,100%);transform:translateY(var(--y))}.digit__num[inert]{position:absolute;top:0;left:50%;transform:translateX(-50%) translateY(var(--y))}.digit:not(.is-spinning) .digit__num[inert]{display:none}.symbol__value{display:inline-block;mix-blend-mode:plus-lighter;white-space:pre}.section--justify-left .symbol > [inert]{left:0}.section--justify-right .symbol > [inert]{right:0}.animate-presence{opacity:calc(1 + var(${nS}))}`, pS = typeof HTMLElement < "u" ? HTMLElement : class {}, mS = Qx`:host{display:inline-block;direction:ltr;white-space:nowrap;line-height:1}span{display:inline-block}:host([data-will-change]) span{will-change:transform}.number,.digit{padding:${sS} 0}.symbol{white-space:pre}`, hS = (e = "") => Qx`:where(number-flow${e}){line-height:1}number-flow${e} > span{font-kerning:none;display:inline-block;padding:${cS} 0}`, gS = (e, t, n) => {
	let r = document.createElement(e), [i, a] = Array.isArray(t) ? [void 0, t] : [t, n];
	return i && Object.assign(r, i), a?.forEach((e) => r.appendChild(e)), r;
}, _S = (e, t) => t === "left" ? e.offsetLeft : ((e.offsetParent instanceof HTMLElement ? e.offsetParent : null)?.offsetWidth ?? 0) - e.offsetWidth - e.offsetLeft, vS = (e) => e.offsetWidth > 0 && e.offsetHeight > 0, yS = (e, t) => {
	typeof HTMLElement < "u" && typeof customElements < "u" && !customElements.get(e) && customElements.define(e, t);
};
function bS(e, t, { reverse: n = !1 } = {}) {
	let r = e.length;
	for (let i = n ? r - 1 : 0; n ? i >= 0 : i < r; n ? i-- : i++) t(e[i], i);
}
function xS(e, t, n, r) {
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
var SS = eS && $x && oS, CS = class extends pS {
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
			this._data = e, this.computedTrend = typeof this.trend == "function" ? this.trend(c.value, s) : this.trend, this.computedAnimated = SS && this._animated && (!this.respectMotionPreference || !((t = tS) != null && t.matches)) && vS(this) && this.ownerDocument.visibilityState === "visible", (n = this.plugins) == null || n.forEach((t) => t.onUpdate?.call(t, e, c, this)), this.batched || this.willUpdate(), this._pre.update(r), this._num.update({
				integer: i,
				fraction: a
			}), this._post.update(o), this.batched || this.didUpdate();
		} else {
			this._data = e, this.attachShadow({ mode: "open" });
			try {
				this._internals ??= this.attachInternals(), this._internals.role = "img";
			} catch {}
			let t = document.createElement("style");
			this.nonce && (t.nonce = this.nonce), t.textContent = fS, this.shadowRoot.appendChild(t), this._pre = new DS(this, r, {
				justify: "right",
				part: "left"
			}), this.shadowRoot.appendChild(this._pre.el), this._num = new wS(this, i, a), this.shadowRoot.appendChild(this._num.el), this._post = new DS(this, o, {
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
		this._preUpdated = SS && this._animated && (!this.respectMotionPreference || !((e = tS) != null && e.matches)) && this.ownerDocument.visibilityState === "visible", this._preUpdated && (this._pre.willUpdate(), this._num.willUpdate(), this._post.willUpdate());
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
CS.defaultProps = {
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
var wS = class {
	constructor(e, t, n, { className: r, ...i } = {}) {
		this.flow = e, this._integer = new ES(e, t, {
			justify: "right",
			part: "integer"
		}), this._fraction = new ES(e, n, {
			justify: "left",
			part: "fraction"
		}), this._inner = gS("span", { className: "number__inner" }, [this._integer.el, this._fraction.el]), this.el = gS("span", {
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
			[iS]: [`${t}px`, "0px"],
			[rS]: [r, 0]
		}, {
			...this.flow.transformTiming,
			composite: "accumulate"
		});
	}
}, TS = class {
	constructor(e, t, { justify: n, className: r, ...i }, a) {
		this.flow = e, this.children = /* @__PURE__ */ new Map(), this.onCharRemove = (e) => () => {
			this.children.delete(e);
		}, this.justify = n;
		let o = t.map((e) => this.addChar(e).el);
		this.el = gS("span", {
			...i,
			className: `section section--justify-${n} ${r ?? ""}`
		}, a ? a(o) : o);
	}
	addChar(e, { startDigitsAtZero: t = !1, ...n } = {}) {
		let r = e.type === "integer" || e.type === "fraction" ? new AS(this, e.type, t ? 0 : e.value, e.pos, {
			...n,
			onRemove: this.onCharRemove(e.key)
		}) : new jS(this, e.type, e.value, {
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
			e.el.style.top = `${e.el.offsetTop}px`, e.el.style[this.justify] = `${_S(e.el, this.justify)}px`;
		}), e.forEach((e) => {
			e.el.setAttribute("inert", ""), e.present = !1;
		});
	}
	addNewAndUpdateExisting(e) {
		let t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map(), r = this.justify === "left", i = r ? "prepend" : "append";
		if (bS(e, (e) => {
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
}, ES = class extends TS {
	update(e) {
		let t = /* @__PURE__ */ new Map();
		this.children.forEach((n, r) => {
			e.find((e) => e.key === r) || t.set(r, n), this.unpop(n);
		}), this.addNewAndUpdateExisting(e), t.forEach((e) => {
			e instanceof AS && e.update(0);
		}), this.pop(t);
	}
}, DS = class extends TS {
	update(e) {
		let t = /* @__PURE__ */ new Map();
		this.children.forEach((n, r) => {
			e.find((e) => e.key === r) || t.set(r, n);
		}), this.pop(t), this.addNewAndUpdateExisting(e);
	}
}, OS = class {
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
			this.el.style.setProperty("--_number-flow-d-opacity", e ? "0" : "-.999"), this.el.animate({ [nS]: e ? [-.9999, 0] : [.999, 0] }, {
				...this.flow.opacityTiming,
				composite: "accumulate"
			}), e ? this.flow.removeEventListener("animationsfinish", this._remove) : this.flow.addEventListener("animationsfinish", this._remove, { once: !0 });
		}
	}
}, kS = class extends OS {
	constructor(e, t, n, r) {
		super(e.flow, n, r), this.section = e, this.value = t, this.el = n;
	}
}, AS = class extends kS {
	constructor(e, t, n, r, i) {
		let a = (e.flow.digits?.[r]?.max ?? 9) + 1, o = Array.from({ length: a }).map((e, t) => {
			let r = gS("span", { className: "digit__num" }, [document.createTextNode(String(t))]);
			return t !== n && r.setAttribute("inert", ""), r.style.setProperty("--n", String(t)), r;
		}), s = gS("span", {
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
}, jS = class extends kS {
	constructor(e, t, n, r) {
		let i = gS("span", {
			className: "symbol__value",
			textContent: n
		});
		super(e, n, gS("span", {
			part: `symbol ${t}`,
			className: "symbol"
		}, [i]), r), this.type = t, this._children = /* @__PURE__ */ new Map(), this._onChildRemove = (e) => () => {
			this._children.delete(e);
		}, this._children.set(n, new OS(this.flow, i, { onRemove: this._onChildRemove(n) }));
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
				let t = gS("span", {
					className: "symbol__value",
					textContent: e
				});
				this.el.appendChild(t), this._children.set(e, new OS(this.flow, t, {
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
}, MS = (e) => [
	mS,
	hS(e),
	fS
], NS = parseInt("19.3.1".match(/^(\d+)\./)?.[1]) >= 19, PS = ["data", "digits"], FS = class extends CS {
	attributeChangedCallback(e, t, n) {
		this[e] = JSON.parse(n);
	}
};
FS.observedAttributes = NS ? [] : PS, yS("number-flow-react", FS);
var IS = {};
function LS(e) {
	return e;
}
var RS = NS ? LS : JSON.stringify;
function zS(e) {
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
var BS = class extends y.Component {
	updateProperties(e) {
		if (!this.el) return;
		this.el.batched = !this.props.isolate;
		let [t] = zS(this.props);
		Object.entries(t).forEach(([e, t]) => {
			this.el[e] = t ?? FS.defaultProps[e];
		}), e?.onAnimationsStart && this.el.removeEventListener("animationsstart", e.onAnimationsStart), this.props.onAnimationsStart && this.el.addEventListener("animationsstart", this.props.onAnimationsStart), e?.onAnimationsFinish && this.el.removeEventListener("animationsfinish", e.onAnimationsFinish), this.props.onAnimationsFinish && this.el.addEventListener("animationsfinish", this.props.onAnimationsFinish);
	}
	componentDidMount() {
		this.updateProperties(), NS && this.el && (this.el.digits = this.props.digits, this.el.data = this.props.data);
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
		let [e, { innerRef: t, className: n, data: r, nonce: i, willChange: a, isolate: o, group: s, digits: c, onAnimationsStart: l, onAnimationsFinish: u, ...d }] = zS(this.props);
		return /*#__PURE__*/ y.createElement("number-flow-react", {
			ref: this.handleRef,
			"data-will-change": a ? "" : void 0,
			class: n,
			nonce: i,
			...d,
			dangerouslySetInnerHTML: { __html: "" },
			suppressHydrationWarning: !0,
			digits: RS(c),
			data: RS(r)
		});
	}
	constructor(e) {
		super(e), this.handleRef = this.handleRef.bind(this);
	}
}, VS = /*#__PURE__*/ y.forwardRef(function({ value: e, locales: t, format: n, prefix: r, suffix: i, ...a }, o) {
	y.useImperativeHandle(o, () => s.current, []);
	let s = y.useRef(void 0), c = y.useContext(HS);
	c?.useRegister(s);
	let l = y.useMemo(() => t ? JSON.stringify(t) : "", [t]), u = y.useMemo(() => n ? JSON.stringify(n) : "", [n]), d = y.useMemo(() => xS(e, IS[`${l}:${u}`] ??= new Intl.NumberFormat(t, n), r, i), [
		e,
		l,
		u,
		r,
		i
	]);
	return /*#__PURE__*/ y.createElement(BS, {
		...a,
		group: c,
		data: d,
		innerRef: s
	});
}), HS = /*#__PURE__*/ y.createContext(void 0);
MS("-react"), Object.freeze([
	"pending",
	"changes_requested",
	"rejected",
	"active",
	"blocked"
]);
var US = Object.freeze(["buyer", "supplier"]);
Object.freeze({
	buyer: Object.freeze({
		homeRoute: Ud.buyerHome,
		userRoles: Object.freeze(["buyer", "owner"]),
		permissions: Object.freeze([
			"demands:write",
			"proposals:compare",
			"orders:read"
		])
	}),
	supplier: Object.freeze({
		homeRoute: Ud.supplierHome,
		userRoles: Object.freeze(["supplier", "owner"]),
		permissions: Object.freeze([
			"opportunities:read",
			"proposals:write-own",
			"orders:execute"
		])
	}),
	administration: Object.freeze({
		homeRoute: Ud.adminHome,
		userRoles: Object.freeze(["platform-admin"]),
		permissions: Object.freeze(["organizations:review"])
	})
});
function WS(e) {
	let t = typeof e == "string" ? e.trim().replace(/\s+/g, " ") : "";
	if (t.length < 2 || t.length > 120) throw Error("Informe o nome da empresa (2 a 120 caracteres).");
	return t;
}
function GS(e) {
	let t = Array.isArray(e) ? e : e && typeof e == "object" ? Object.entries(e).filter(([, e]) => e === !0).map(([e]) => e) : typeof e == "string" ? [e] : [], n = [...new Set(t.filter((e) => US.includes(e)))];
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
var KS = "AC AL AP AM BA CE DF ES GO MA MT MS MG PA PB PR PE PI RJ RN RS RO RR SC SP SE TO".split(" ");
function qS(e) {
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
	return t.state && !KS.includes(t.state) && (n.state = "Selecione uma UF válida."), {
		fields: t,
		errors: n
	};
}
function JS(e) {
	let t = WS(e?.name), n = GS(e?.roles), { fields: r, errors: i } = qS(e), a = Object.values(i)[0];
	if (a) throw Error(a);
	return {
		name: t,
		roles: n,
		...r,
		onboardingVersion: 1
	};
}
// src/pages/auth/auth-validation.js
function YS(e) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}
function XS(e) {
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
var ZS = Object.freeze([
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
]), QS = /* @__PURE__ */ new Map([
	["compras", "buyer"],
	["fornecimento", "supplier"],
	["integrado", "both"]
]);
function $S(e, t) {
	let n = e ?? QS.get(t);
	return ZS.find((e) => e.id === n) ?? ZS[0];
}
var eC = (e) => new Intl.NumberFormat("pt-BR", {
	style: "currency",
	currency: "BRL",
	maximumFractionDigits: 0
}).format(e);
function tC(e, t = "buyer") {
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
function nC(e, t = "buyer") {
	let n = tC(e, t), r = [
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
function rC(e, t) {
	let n = {};
	if (t === 0 && ((String(e.firstName ?? "").trim().length < 2 || String(e.firstName).length > 60) && (n.firstName = "Informe seu nome (2 a 60 caracteres)."), (String(e.lastName ?? "").trim().length < 2 || String(e.lastName).length > 80) && (n.lastName = "Informe seu sobrenome (2 a 80 caracteres)."), YS(String(e.email ?? "").trim()) || (n.email = "Informe um e-mail válido."), (XS(String(e.password ?? "")).score !== 4 || String(e.password).length > 128) && (n.password = "Use de 8 a 128 caracteres, com maiúscula, minúscula e número."), e.password !== e.confirmPassword && (n.confirmPassword = "As senhas precisam ser iguais.")), t === 1) {
		try {
			WS(e.name);
		} catch (e) {
			n.name = e.message;
		}
		try {
			GS(e.roles);
		} catch (e) {
			n.roles = e.message;
		}
		Object.assign(n, qS(e).errors);
	}
	return n;
}
// src/components/ui/web3-bento.tsx
var iC = [
	"var(--sv-orange)",
	"color-mix(in srgb, var(--sv-dark), var(--sv-paper) 55%)",
	"var(--sv-dark)",
	"var(--sv-ink)"
];
function aC() {
	let [e, t] = (0, y.useState)("90"), [n, r] = (0, y.useState)(null), [i, a] = (0, y.useState)("buyer"), o = Pu(), s = (0, y.useId)().replace(/:/g, ""), c = nC(e, i), l = c.series, u = i === "buyer", d = u ? "recebidas" : "enviadas", f = l.values.map((e, t) => [t / (l.values.length - 1) * 600, 160 - e / 18 * 145]), p = f.map(([e, t], n) => `${n ? "L" : "M"}${e},${t}`).join(" "), m = n ?? l.values.length - 1;
	return /* @__PURE__ */ (0, X.jsxs)("div", {
		className: "sv-demo",
		"data-ui": "industrial-demo",
		children: [
			/* @__PURE__ */ (0, X.jsxs)("div", {
				className: "sv-demo-header",
				children: [/* @__PURE__ */ (0, X.jsxs)("div", { children: [/* @__PURE__ */ (0, X.jsx)("img", {
					src: "./src/assets/brand/raposa.svg",
					alt: "",
					width: "23",
					height: "23"
				}), /* @__PURE__ */ (0, X.jsxs)("strong", { children: [
					"SIVI",
					" ",
					/* @__PURE__ */ (0, X.jsxs)("span", { children: ["/ ", u ? "Visão de compras" : "Visão de fornecimento"] })
				] })] }), /* @__PURE__ */ (0, X.jsx)("span", {
					className: "sv-example-label",
					children: "Demonstração · dados ilustrativos"
				})]
			}),
			/* @__PURE__ */ (0, X.jsxs)("div", {
				className: "sv-demo-body",
				children: [/* @__PURE__ */ (0, X.jsxs)("div", {
					className: "sv-demo-sidebar",
					"aria-hidden": "true",
					children: [
						/* @__PURE__ */ (0, X.jsx)("span", {
							className: "is-active",
							children: "Visão geral"
						}),
						/* @__PURE__ */ (0, X.jsx)("span", { children: "Demandas" }),
						/* @__PURE__ */ (0, X.jsx)("span", { children: "Propostas" }),
						/* @__PURE__ */ (0, X.jsx)("span", { children: "Pedidos" }),
						/* @__PURE__ */ (0, X.jsx)("span", { children: "Fornecedores" }),
						/* @__PURE__ */ (0, X.jsxs)("div", { children: [
							"METALÚRGICA EXEMPLO",
							/* @__PURE__ */ (0, X.jsx)("br", {}),
							/* @__PURE__ */ (0, X.jsxs)("small", { children: ["Atuação ", u ? "compradora" : "fornecedora"] })
						] })
					]
				}), /* @__PURE__ */ (0, X.jsxs)("div", {
					className: "sv-demo-main",
					children: [
						/* @__PURE__ */ (0, X.jsxs)("div", {
							className: "sv-demo-title",
							children: [/* @__PURE__ */ (0, X.jsxs)("div", { children: [/* @__PURE__ */ (0, X.jsx)("small", { children: "Acordos que viram registros" }), /* @__PURE__ */ (0, X.jsx)("h3", { children: u ? "O movimento da sua compra." : "Sua capacidade em movimento." })] }), /* @__PURE__ */ (0, X.jsxs)("div", {
								className: "sv-demo-role t-tabs",
								role: "group",
								"aria-label": "Atuação da demonstração",
								children: [/* @__PURE__ */ (0, X.jsx)(Zx, { selected: i }), [["buyer", "Comprador"], ["supplier", "Fornecedor"]].map(([e, t]) => /* @__PURE__ */ (0, X.jsx)("button", {
									"aria-pressed": i === e,
									onClick: () => {
										a(e), r(null);
									},
									children: t
								}, e))]
							})]
						}),
						/* @__PURE__ */ (0, X.jsxs)("div", {
							className: "sv-demo-cards",
							children: [
								/* @__PURE__ */ (0, X.jsxs)("div", { children: [
									/* @__PURE__ */ (0, X.jsxs)("span", { children: ["Propostas ", d] }),
									/* @__PURE__ */ (0, X.jsx)("strong", { children: /* @__PURE__ */ (0, X.jsx)(VS, {
										value: l.total,
										animated: !o
									}) }),
									/* @__PURE__ */ (0, X.jsx)("small", { children: "No período ilustrativo selecionado" })
								] }),
								/* @__PURE__ */ (0, X.jsxs)("div", { children: [
									/* @__PURE__ */ (0, X.jsx)("span", { children: "Demanda em destaque" }),
									/* @__PURE__ */ (0, X.jsx)("strong", { children: "Usinagem CNC" }),
									/* @__PURE__ */ (0, X.jsx)("small", { children: "Alumínio 6061 · 240 peças" })
								] }),
								/* @__PURE__ */ (0, X.jsxs)("div", { children: [
									/* @__PURE__ */ (0, X.jsx)("span", { children: "Pedido de exemplo" }),
									/* @__PURE__ */ (0, X.jsxs)("strong", {
										className: "sv-status",
										children: [/* @__PURE__ */ (0, X.jsx)("i", {}), "Em inspeção"]
									}),
									/* @__PURE__ */ (0, X.jsx)("small", { children: "Condições aceitas preservadas" })
								] })
							]
						}),
						/* @__PURE__ */ (0, X.jsxs)("div", {
							className: "sv-chart",
							children: [
								/* @__PURE__ */ (0, X.jsxs)("div", {
									className: "sv-chart-top",
									children: [/* @__PURE__ */ (0, X.jsxs)("div", { children: [/* @__PURE__ */ (0, X.jsxs)("h4", { children: [
										"Propostas ",
										d,
										" por semana"
									] }), /* @__PURE__ */ (0, X.jsxs)("p", { children: [
										l.total,
										" propostas em ",
										l.values.length,
										" semanas de exemplo"
									] })] }), /* @__PURE__ */ (0, X.jsxs)("div", {
										className: "sv-chart-filter t-tabs",
										role: "group",
										"aria-label": "Período do gráfico",
										children: [/* @__PURE__ */ (0, X.jsx)(Zx, { selected: e }), [
											"30",
											"60",
											"90"
										].map((n) => /* @__PURE__ */ (0, X.jsxs)("button", {
											"aria-pressed": e === n,
											onClick: () => {
												t(n), r(null);
											},
											children: [n, " dias"]
										}, n))]
									})]
								}),
								/* @__PURE__ */ (0, X.jsx)("div", {
									className: "sv-chart-area",
									onPointerMove: (e) => {
										let t = e.currentTarget.getBoundingClientRect();
										r(Math.max(0, Math.min(l.values.length - 1, Math.round((e.clientX - t.left) / t.width * (l.values.length - 1)))));
									},
									onPointerLeave: () => r(null),
									children: /* @__PURE__ */ (0, X.jsxs)("svg", {
										viewBox: "0 0 600 180",
										preserveAspectRatio: "none",
										role: "img",
										"aria-label": `${l.total} propostas ilustrativas, distribuídas por ${l.values.length} semanas`,
										children: [
											/* @__PURE__ */ (0, X.jsx)("defs", { children: /* @__PURE__ */ (0, X.jsxs)("linearGradient", {
												id: `${s}fill`,
												x1: "0",
												x2: "0",
												y1: "0",
												y2: "1",
												children: [/* @__PURE__ */ (0, X.jsx)("stop", {
													offset: "0",
													stopColor: "var(--sv-orange)",
													stopOpacity: ".25"
												}), /* @__PURE__ */ (0, X.jsx)("stop", {
													offset: "1",
													stopColor: "var(--sv-orange)",
													stopOpacity: "0"
												})]
											}) }),
											[
												.25,
												.5,
												.75
											].map((e) => /* @__PURE__ */ (0, X.jsx)("line", {
												x1: "0",
												x2: 600,
												y1: 180 * e,
												y2: 180 * e,
												stroke: "var(--sv-line)",
												strokeDasharray: "2 5"
											}, e)),
											/* @__PURE__ */ (0, X.jsx)("path", {
												d: `${p} L600,180 L0,180 Z`,
												fill: `url(#${s}fill)`
											}),
											/* @__PURE__ */ (0, X.jsx)(Lu.path, {
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
											/* @__PURE__ */ (0, X.jsx)("circle", {
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
								/* @__PURE__ */ (0, X.jsxs)("div", {
									className: "sv-chart-axis",
									children: [
										/* @__PURE__ */ (0, X.jsx)("span", { children: "Início do período" }),
										/* @__PURE__ */ (0, X.jsxs)("span", {
											"aria-live": "polite",
											children: [
												"Semana ",
												m + 1,
												": ",
												l.values[m],
												" propostas"
											]
										}),
										/* @__PURE__ */ (0, X.jsx)("span", { children: "Final" })
									]
								}),
								/* @__PURE__ */ (0, X.jsxs)("details", {
									className: "sv-data-table",
									children: [/* @__PURE__ */ (0, X.jsx)("summary", { children: "Consultar dados do gráfico" }), /* @__PURE__ */ (0, X.jsxs)("table", { children: [
										/* @__PURE__ */ (0, X.jsx)("caption", { children: "Valores ilustrativos por semana" }),
										/* @__PURE__ */ (0, X.jsx)("thead", { children: /* @__PURE__ */ (0, X.jsxs)("tr", { children: [/* @__PURE__ */ (0, X.jsx)("th", { children: "Semana" }), /* @__PURE__ */ (0, X.jsx)("th", { children: "Propostas" })] }) }),
										/* @__PURE__ */ (0, X.jsx)("tbody", { children: l.values.map((e, t) => /* @__PURE__ */ (0, X.jsxs)("tr", { children: [/* @__PURE__ */ (0, X.jsx)("td", { children: t + 1 }), /* @__PURE__ */ (0, X.jsx)("td", { children: e })] }, t)) })
									] })]
								})
							]
						}),
						/* @__PURE__ */ (0, X.jsxs)("div", {
							className: "sv-demo-detail-grid",
							children: [/* @__PURE__ */ (0, X.jsxs)("section", {
								className: "sv-demo-comparison",
								"aria-label": u ? "Comparação ilustrativa de propostas" : "Revisões ilustrativas da proposta",
								children: [
									/* @__PURE__ */ (0, X.jsx)("h4", { children: u ? "Condições em comparação" : "Versões da proposta" }),
									/* @__PURE__ */ (0, X.jsx)("p", { children: "240 peças · usinagem CNC · valores de exemplo" }),
									/* @__PURE__ */ (0, X.jsx)("ul", { children: c.quotes.map((e) => /* @__PURE__ */ (0, X.jsxs)("li", { children: [/* @__PURE__ */ (0, X.jsxs)("div", { children: [/* @__PURE__ */ (0, X.jsx)("strong", { children: e.label }), /* @__PURE__ */ (0, X.jsxs)("span", { children: [
										eC(e.amount),
										" ",
										/* @__PURE__ */ (0, X.jsxs)("small", { children: [
											"· ",
											e.days,
											" dias"
										] })
									] })] }), /* @__PURE__ */ (0, X.jsx)("span", {
										className: "sv-quote-track",
										"aria-hidden": "true",
										children: /* @__PURE__ */ (0, X.jsx)(Lu.i, {
											initial: !1,
											animate: { width: `${e.amount / 24e3 * 100}%` },
											transition: { duration: o ? 0 : .5 }
										})
									})] }, e.label)) }),
									/* @__PURE__ */ (0, X.jsx)("small", { children: u ? "Compare também frete e pagamento antes do aceite." : "Cada revisão mantém a versão anterior no histórico." })
								]
							}), /* @__PURE__ */ (0, X.jsxs)("section", {
								className: "sv-demo-distribution",
								"aria-label": "Distribuição ilustrativa dos pedidos",
								children: [
									/* @__PURE__ */ (0, X.jsx)("h4", { children: "Pedidos por etapa" }),
									/* @__PURE__ */ (0, X.jsxs)("p", { children: [c.orders.length, " pedidos ilustrativos no período selecionado"] }),
									/* @__PURE__ */ (0, X.jsx)("div", {
										className: "sv-stage-bar",
										"aria-hidden": "true",
										children: c.stages.map((e, t) => /* @__PURE__ */ (0, X.jsx)(Lu.span, {
											style: { background: iC[t] },
											animate: { flexBasis: `${e.count / c.orders.length * 100}%` },
											transition: { duration: o ? 0 : .5 }
										}, e.name))
									}),
									/* @__PURE__ */ (0, X.jsx)("ul", { children: c.stages.map((e, t) => /* @__PURE__ */ (0, X.jsxs)("li", { children: [/* @__PURE__ */ (0, X.jsxs)("span", { children: [/* @__PURE__ */ (0, X.jsx)("i", {
										"aria-hidden": "true",
										style: { background: iC[t] }
									}), e.name] }), /* @__PURE__ */ (0, X.jsx)("strong", { children: e.count })] }, e.name)) }),
									/* @__PURE__ */ (0, X.jsx)("small", { children: "A distribuição acompanha o período e a atuação." })
								]
							})]
						}),
						/* @__PURE__ */ (0, X.jsxs)("div", {
							className: "sv-demo-record",
							children: [
								/* @__PURE__ */ (0, X.jsx)(bd, { size: 19 }),
								/* @__PURE__ */ (0, X.jsxs)("div", { children: [/* @__PURE__ */ (0, X.jsx)("strong", { children: "Uma referência para os dois lados" }), /* @__PURE__ */ (0, X.jsx)("span", { children: "Especificações e condições registradas no pedido." })] }),
								/* @__PURE__ */ (0, X.jsx)(ud, { size: 18 })
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, X.jsxs)("div", {
				className: "sv-demo-foot",
				children: [/* @__PURE__ */ (0, X.jsx)("span", { children: "Exemplo de uso: os números não representam atividade real do SIVI." }), /* @__PURE__ */ (0, X.jsx)(nd, { size: 16 })]
			})
		]
	});
}
// src/public/platform.tsx
var oC = [
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
function sC() {
	let [e, t] = (0, y.useState)(() => {
		let e = new URLSearchParams(location.hash.split("?")[1]), t = Number(e.get("etapa"));
		return Number.isInteger(t) && t > 0 && t <= oC.length ? t - 1 : 0;
	}), [n, r] = (0, y.useState)(!1), i = oC[e], a = String(e + 1).padStart(2, "0");
	return /* @__PURE__ */ (0, X.jsxs)("section", {
		className: "sv-workflow sv-shell",
		"aria-labelledby": "funcionamento",
		children: [/* @__PURE__ */ (0, X.jsxs)("div", {
			className: "sv-section-heading sv-display-heading",
			children: [/* @__PURE__ */ (0, X.jsxs)("div", { children: [/* @__PURE__ */ (0, X.jsx)("p", {
				className: "sv-landing-label",
				children: "Como funciona"
			}), /* @__PURE__ */ (0, X.jsx)(Ox, {
				id: "funcionamento",
				tabIndex: -1,
				tag: "h2",
				text: "Da demanda à entrega.",
				splitType: "words",
				effect: "skew",
				delay: 85,
				duration: .75,
				textAlign: "left"
			})] }), /* @__PURE__ */ (0, X.jsx)("p", {
				"data-landing-reveal": "fade",
				children: "As duas empresas acompanham o mesmo acordo. Explore o que acontece em cada momento."
			})]
		}), /* @__PURE__ */ (0, X.jsxs)("div", {
			className: "sv-workflow-layout",
			"data-landing-reveal": "fade",
			children: [/* @__PURE__ */ (0, X.jsx)("ol", {
				"aria-label": "Etapas da compra",
				children: oC.map(([n], i) => /* @__PURE__ */ (0, X.jsx)("li", { children: /* @__PURE__ */ (0, X.jsxs)("button", {
					"aria-pressed": e === i,
					"aria-controls": "sv-workflow-panel",
					onClick: () => {
						i !== e && (t(i), r(!0));
					},
					children: [n, /* @__PURE__ */ (0, X.jsx)(nd, {
						size: 18,
						"aria-hidden": "true"
					})]
				}) }, n))
			}), /* @__PURE__ */ (0, X.jsxs)("div", {
				id: "sv-workflow-panel",
				className: "sv-workflow-panel",
				"aria-live": "polite",
				children: [/* @__PURE__ */ (0, X.jsxs)("div", {
					className: "sv-workflow-sample",
					"data-visual": !0,
					children: [
						/* @__PURE__ */ (0, X.jsx)("span", { children: "PEDIDO 0248 · EXEMPLO" }),
						/* @__PURE__ */ (0, X.jsxs)("span", {
							className: "sv-status",
							children: [/* @__PURE__ */ (0, X.jsx)("i", {}), i[0]]
						}),
						/* @__PURE__ */ (0, X.jsxs)("div", {
							className: "sv-record-sheet",
							children: [
								/* @__PURE__ */ (0, X.jsxs)("div", { children: [
									/* @__PURE__ */ (0, X.jsx)(bd, { size: 24 }),
									/* @__PURE__ */ (0, X.jsxs)("span", { children: [
										"Peça de conexão",
										/* @__PURE__ */ (0, X.jsx)("br", {}),
										/* @__PURE__ */ (0, X.jsx)("strong", { children: "Alumínio 6061" })
									] }),
									/* @__PURE__ */ (0, X.jsxs)("strong", { children: ["240 ", /* @__PURE__ */ (0, X.jsx)("small", { children: "un." })] })
								] }),
								/* @__PURE__ */ (0, X.jsxs)("div", { children: [/* @__PURE__ */ (0, X.jsxs)("span", { children: ["Material definido ", /* @__PURE__ */ (0, X.jsx)(ud, { size: 14 })] }), /* @__PURE__ */ (0, X.jsxs)("span", { children: ["Processo: CNC ", /* @__PURE__ */ (0, X.jsx)(ud, { size: 14 })] })] }),
								/* @__PURE__ */ (0, X.jsxs)("div", {
									className: "sv-stage-record t-panel-enter",
									children: [/* @__PURE__ */ (0, X.jsx)("small", { children: "REGISTRO EM DESTAQUE" }), /* @__PURE__ */ (0, X.jsx)("p", { children: i[5] })]
								}, a)
							]
						})
					]
				}), /* @__PURE__ */ (0, X.jsxs)("div", {
					className: "sv-workflow-copy",
					children: [
						/* @__PURE__ */ (0, X.jsxs)("p", {
							className: "sv-eyebrow",
							children: [
								"Etapa",
								" ",
								/* @__PURE__ */ (0, X.jsx)("span", {
									className: "sr-only",
									children: a
								}),
								/* @__PURE__ */ (0, X.jsx)("span", {
									"aria-hidden": "true",
									className: `t-digit-group${n ? " is-animating" : ""}`,
									children: [...a].map((e, t) => /* @__PURE__ */ (0, X.jsx)("span", {
										className: "t-digit",
										"data-stagger": t,
										children: e
									}, t))
								}, a),
								" ",
								"/ ",
								String(oC.length).padStart(2, "0")
							]
						}),
						/* @__PURE__ */ (0, X.jsx)("h3", {
							className: "sv-stage-record t-panel-enter",
							children: i[1]
						}, `title-${a}`),
						/* @__PURE__ */ (0, X.jsx)("p", {
							className: "sv-stage-record t-panel-enter",
							children: i[2]
						}, `copy-${a}`),
						/* @__PURE__ */ (0, X.jsxs)("dl", {
							className: "sv-stage-record t-panel-enter",
							children: [/* @__PURE__ */ (0, X.jsxs)("div", { children: [/* @__PURE__ */ (0, X.jsx)("dt", { children: "Comprador" }), /* @__PURE__ */ (0, X.jsx)("dd", { children: i[3] })] }), /* @__PURE__ */ (0, X.jsxs)("div", { children: [/* @__PURE__ */ (0, X.jsx)("dt", { children: "Fornecedor" }), /* @__PURE__ */ (0, X.jsx)("dd", { children: i[4] })] })]
						}, `roles-${a}`)
					]
				})]
			})]
		})]
	});
}
function cC() {
	let e = nC("90").quotes;
	return /* @__PURE__ */ (0, X.jsx)("section", {
		className: "sv-solutions",
		"aria-labelledby": "solucoes-title",
		children: /* @__PURE__ */ (0, X.jsxs)("div", {
			className: "sv-shell",
			children: [/* @__PURE__ */ (0, X.jsxs)("div", {
				className: "sv-display-heading sv-display-heading--center",
				children: [/* @__PURE__ */ (0, X.jsx)("p", {
					className: "sv-landing-label",
					children: "Soluções"
				}), /* @__PURE__ */ (0, X.jsx)("h2", {
					id: "solucoes-title",
					children: "Dois lados da mesma compra."
				})]
			}), /* @__PURE__ */ (0, X.jsxs)("div", {
				className: "sv-solution-list",
				children: [
					/* @__PURE__ */ (0, X.jsxs)("article", {
						className: "sv-solution",
						children: [/* @__PURE__ */ (0, X.jsxs)("div", {
							className: "sv-solution-copy",
							children: [
								/* @__PURE__ */ (0, X.jsx)("h3", {
									id: "compras",
									tabIndex: -1,
									children: "Para compradores"
								}),
								/* @__PURE__ */ (0, X.jsx)("p", { children: "Publique sua demanda com requisitos por item e compare as condições antes de fechar o pedido." }),
								/* @__PURE__ */ (0, X.jsxs)("ul", { children: [
									/* @__PURE__ */ (0, X.jsxs)("li", { children: [/* @__PURE__ */ (0, X.jsx)(ud, { "aria-hidden": "true" }), " Compatibilidade com os requisitos da compra"] }),
									/* @__PURE__ */ (0, X.jsxs)("li", { children: [/* @__PURE__ */ (0, X.jsx)(ud, { "aria-hidden": "true" }), " Comparação de preço, prazo, frete e pagamento"] }),
									/* @__PURE__ */ (0, X.jsxs)("li", { children: [/* @__PURE__ */ (0, X.jsx)(ud, { "aria-hidden": "true" }), " Acompanhamento até o recebimento e a avaliação"] })
								] }),
								/* @__PURE__ */ (0, X.jsx)(rf, {
									href: Qd("buyer"),
									children: "Cadastrar como comprador"
								})
							]
						}), /* @__PURE__ */ (0, X.jsx)("div", {
							className: "sv-solution-visual sv-quote-visual",
							"data-landing-reveal": "lift",
							"data-landing-pointer": "tilt",
							children: /* @__PURE__ */ (0, X.jsxs)("div", {
								className: "sv-quote",
								children: [
									/* @__PURE__ */ (0, X.jsxs)("div", {
										className: "sv-quote-heading",
										children: [/* @__PURE__ */ (0, X.jsxs)("span", { children: [/* @__PURE__ */ (0, X.jsx)(bd, {
											size: 17,
											"aria-hidden": "true"
										}), " Compras / Propostas"] }), /* @__PURE__ */ (0, X.jsx)("small", { children: "Exemplo" })]
									}),
									/* @__PURE__ */ (0, X.jsx)("strong", { children: "Peça de conexão" }),
									/* @__PURE__ */ (0, X.jsx)("p", { children: "Alumínio 6061 · Usinagem CNC · 240 peças" }),
									/* @__PURE__ */ (0, X.jsxs)("table", {
										"aria-label": "Exemplo de comparação de propostas",
										children: [/* @__PURE__ */ (0, X.jsx)("thead", { children: /* @__PURE__ */ (0, X.jsxs)("tr", { children: [
											/* @__PURE__ */ (0, X.jsx)("th", {
												scope: "col",
												children: "Proposta"
											}),
											/* @__PURE__ */ (0, X.jsx)("th", {
												scope: "col",
												children: "Valor"
											}),
											/* @__PURE__ */ (0, X.jsx)("th", {
												scope: "col",
												children: "Prazo"
											})
										] }) }), /* @__PURE__ */ (0, X.jsx)("tbody", { children: e.map(({ label: e, amount: t, days: n }) => /* @__PURE__ */ (0, X.jsxs)("tr", { children: [
											/* @__PURE__ */ (0, X.jsx)("th", {
												scope: "row",
												children: e
											}),
											/* @__PURE__ */ (0, X.jsx)("td", { children: eC(t) }),
											/* @__PURE__ */ (0, X.jsxs)("td", { children: [n, " dias"] })
										] }, e)) })]
									})
								]
							})
						})]
					}),
					/* @__PURE__ */ (0, X.jsxs)("article", {
						className: "sv-solution sv-solution--reverse",
						children: [/* @__PURE__ */ (0, X.jsxs)("div", {
							className: "sv-solution-copy",
							children: [
								/* @__PURE__ */ (0, X.jsx)("h3", {
									id: "fornecimento",
									tabIndex: -1,
									children: "Para fornecedores"
								}),
								/* @__PURE__ */ (0, X.jsx)("p", { children: "Apresente sua capacidade industrial, encontre demandas compatíveis e acompanhe o fornecimento." }),
								/* @__PURE__ */ (0, X.jsxs)("ul", { children: [
									/* @__PURE__ */ (0, X.jsxs)("li", { children: [/* @__PURE__ */ (0, X.jsx)(ud, { "aria-hidden": "true" }), " Perfil com materiais, processos e regiões"] }),
									/* @__PURE__ */ (0, X.jsxs)("li", { children: [/* @__PURE__ */ (0, X.jsx)(ud, { "aria-hidden": "true" }), " Propostas com histórico de revisões"] }),
									/* @__PURE__ */ (0, X.jsxs)("li", { children: [/* @__PURE__ */ (0, X.jsx)(ud, { "aria-hidden": "true" }), " Registros de inspeção e expedição"] })
								] }),
								/* @__PURE__ */ (0, X.jsx)(rf, {
									href: Qd("supplier"),
									children: "Cadastrar como fornecedor"
								})
							]
						}), /* @__PURE__ */ (0, X.jsx)("div", {
							className: "sv-solution-visual sv-solution-photo",
							"data-landing-reveal": "curtain",
							"data-landing-pointer": "photo",
							children: /* @__PURE__ */ (0, X.jsx)("img", {
								src: "./assets/detalhe-torno.jpg",
								alt: "Detalhe de uma ferramenta de usinagem",
								loading: "lazy",
								width: "960",
								height: "640"
							})
						})]
					}),
					/* @__PURE__ */ (0, X.jsxs)("article", {
						className: "sv-solution",
						children: [/* @__PURE__ */ (0, X.jsxs)("div", {
							className: "sv-solution-copy",
							children: [
								/* @__PURE__ */ (0, X.jsx)("h3", { children: "Um pedido para as duas empresas" }),
								/* @__PURE__ */ (0, X.jsx)("p", { children: "O aceite transforma a proposta em pedido. As duas empresas consultam os mesmos itens, valores e condições durante o fornecimento." }),
								/* @__PURE__ */ (0, X.jsxs)("ul", { children: [
									/* @__PURE__ */ (0, X.jsxs)("li", { children: [/* @__PURE__ */ (0, X.jsx)(ud, { "aria-hidden": "true" }), " Inspeção e liberação antes da expedição"] }),
									/* @__PURE__ */ (0, X.jsxs)("li", { children: [/* @__PURE__ */ (0, X.jsx)(ud, { "aria-hidden": "true" }), " Registro da saída pelo fornecedor"] }),
									/* @__PURE__ */ (0, X.jsxs)("li", { children: [/* @__PURE__ */ (0, X.jsx)(ud, { "aria-hidden": "true" }), " Confirmação de recebimento pelo comprador"] })
								] }),
								/* @__PURE__ */ (0, X.jsx)(rf, {
									href: Xd(4),
									children: "Ver a etapa do pedido"
								})
							]
						}), /* @__PURE__ */ (0, X.jsx)("div", {
							className: "sv-solution-visual sv-quote-visual",
							"data-landing-reveal": "lift",
							children: /* @__PURE__ */ (0, X.jsx)(Ux, { example: Hx[3] })
						})]
					})
				]
			})]
		})
	});
}
var lC = [
	{
		step: 1,
		Icon: bd,
		label: "Especificar materiais"
	},
	{
		step: 2,
		Icon: Md,
		label: "Conferir compatibilidade"
	},
	{
		step: 3,
		Icon: Sd,
		label: "Comparar propostas"
	},
	{
		step: 5,
		Icon: md,
		label: "Registrar inspeção"
	},
	{
		step: 6,
		Icon: Bd,
		label: "Acompanhar expedição"
	},
	{
		step: 7,
		Icon: Ed,
		label: "Confirmar recebimento"
	}
];
function uC() {
	return /* @__PURE__ */ (0, X.jsx)("section", {
		className: "sv-purchase-actions",
		"aria-labelledby": "recursos-title",
		children: /* @__PURE__ */ (0, X.jsxs)("div", {
			className: "sv-shell",
			children: [/* @__PURE__ */ (0, X.jsx)("div", {
				className: "sv-display-heading",
				children: /* @__PURE__ */ (0, X.jsx)("h2", {
					id: "recursos-title",
					children: "O que você pode fazer no SIVI."
				})
			}), /* @__PURE__ */ (0, X.jsx)("ul", {
				className: "sv-purchase-grid",
				"data-landing-reveal": "fade",
				children: lC.map(({ step: e, Icon: t, label: n }) => /* @__PURE__ */ (0, X.jsx)("li", { children: /* @__PURE__ */ (0, X.jsxs)("a", {
					href: Xd(e),
					children: [
						/* @__PURE__ */ (0, X.jsx)(t, { "aria-hidden": "true" }),
						/* @__PURE__ */ (0, X.jsx)("span", { children: n }),
						/* @__PURE__ */ (0, X.jsx)(tf, {})
					]
				}) }, e))
			})]
		})
	});
}
function dC() {
	return /* @__PURE__ */ (0, X.jsxs)(Vx, {
		page: "platform",
		children: [
			/* @__PURE__ */ (0, X.jsx)("section", {
				className: "sv-page-banner",
				children: /* @__PURE__ */ (0, X.jsxs)("div", {
					className: "sv-shell sv-display-heading",
					children: [
						/* @__PURE__ */ (0, X.jsx)("h1", {
							id: "public-title",
							tabIndex: -1,
							children: "Plataforma industrial"
						}),
						/* @__PURE__ */ (0, X.jsx)("p", { children: "Publique demandas, compare propostas e acompanhe pedidos. Cada empresa vê o que precisa fazer em sua etapa da compra." }),
						/* @__PURE__ */ (0, X.jsx)(rf, {
							href: Yd("funcionamento"),
							children: "Ver as etapas da compra"
						})
					]
				})
			}),
			/* @__PURE__ */ (0, X.jsx)(cC, {}),
			/* @__PURE__ */ (0, X.jsx)("section", {
				className: "sv-platform",
				"aria-labelledby": "plataforma-title",
				children: /* @__PURE__ */ (0, X.jsxs)("div", {
					className: "sv-shell",
					children: [/* @__PURE__ */ (0, X.jsxs)("div", {
						className: "sv-display-heading",
						children: [
							/* @__PURE__ */ (0, X.jsx)("p", {
								className: "sv-landing-label",
								children: "Demonstração"
							}),
							/* @__PURE__ */ (0, X.jsx)("h2", {
								id: "plataforma-title",
								children: "A plataforma por dentro."
							}),
							/* @__PURE__ */ (0, X.jsx)("p", {
								"data-landing-reveal": "fade",
								children: "Alterne entre Comprador e Fornecedor para explorar como cada empresa acompanha propostas e pedidos."
							})
						]
					}), /* @__PURE__ */ (0, X.jsx)("div", {
						"data-landing-reveal": "fade",
						children: /* @__PURE__ */ (0, X.jsx)(aC, {})
					})]
				})
			}),
			/* @__PURE__ */ (0, X.jsx)(sC, {}),
			/* @__PURE__ */ (0, X.jsx)(uC, {}),
			/* @__PURE__ */ (0, X.jsx)("section", {
				className: "sv-agreement",
				"aria-labelledby": "historico-title",
				children: /* @__PURE__ */ (0, X.jsxs)("div", {
					className: "sv-shell",
					children: [/* @__PURE__ */ (0, X.jsxs)("div", {
						className: "sv-display-heading",
						children: [
							/* @__PURE__ */ (0, X.jsx)("h2", {
								id: "historico-title",
								children: "O acordo fica registrado."
							}),
							/* @__PURE__ */ (0, X.jsx)("p", {
								"data-landing-reveal": "fade",
								children: "Consulte o histórico de propostas, condições aceitas e registros do pedido durante a compra."
							}),
							/* @__PURE__ */ (0, X.jsxs)("a", {
								className: "sv-text-link",
								href: Zd("seguranca"),
								children: ["Como o SIVI trata os dados ", /* @__PURE__ */ (0, X.jsx)(tf, {})]
							})
						]
					}), /* @__PURE__ */ (0, X.jsxs)("dl", { children: [
						/* @__PURE__ */ (0, X.jsxs)("div", { children: [/* @__PURE__ */ (0, X.jsx)("dt", { children: "Etapas da compra" }), /* @__PURE__ */ (0, X.jsx)("dd", {
							"data-landing-reveal": "number",
							children: String(oC.length).padStart(2, "0")
						})] }),
						/* @__PURE__ */ (0, X.jsxs)("div", { children: [/* @__PURE__ */ (0, X.jsx)("dt", { children: "Formas de atuação" }), /* @__PURE__ */ (0, X.jsx)("dd", {
							"data-landing-reveal": "number",
							children: "02"
						})] }),
						/* @__PURE__ */ (0, X.jsxs)("div", { children: [/* @__PURE__ */ (0, X.jsx)("dt", { children: "Histórico por pedido" }), /* @__PURE__ */ (0, X.jsx)("dd", {
							"data-landing-reveal": "number",
							children: "01"
						})] })
					] })]
				})
			}),
			/* @__PURE__ */ (0, X.jsx)("section", {
				className: "sv-home-agreement sv-home-agreement--dark",
				"aria-labelledby": "plataforma-exemplos",
				children: /* @__PURE__ */ (0, X.jsxs)("div", {
					className: "sv-shell sv-display-heading",
					children: [
						/* @__PURE__ */ (0, X.jsx)("h2", {
							id: "plataforma-exemplos",
							children: "Veja os registros em uma compra."
						}),
						/* @__PURE__ */ (0, X.jsx)("p", { children: "Os casos de uso mostram o que cada empresa faz e o que fica disponível para consulta em cada etapa." }),
						/* @__PURE__ */ (0, X.jsx)(rf, {
							href: Kd("cases"),
							children: "Explorar casos de uso"
						})
					]
				})
			})
		]
	});
}
// src/public/site-pages.tsx
var fC = [
	{
		Icon: bd,
		title: "Requisitos por item",
		description: "Cada fornecedor consulta o que foi especificado para a peça ou o material que vai cotar."
	},
	{
		Icon: Sd,
		title: "Versões consultáveis",
		description: "As revisões da proposta formam um histórico. O pedido preserva a versão aceita."
	},
	{
		Icon: md,
		title: "Responsabilidade por etapa",
		description: "Quem fornece registra a inspeção e a expedição. Quem compra confirma o recebimento."
	},
	{
		Icon: Id,
		title: "Acesso por empresa",
		description: "A confirmação do e-mail e a análise do cadastro precedem o acesso operacional."
	}
];
function pC() {
	return /* @__PURE__ */ (0, X.jsxs)(Vx, {
		page: "about",
		children: [
			/* @__PURE__ */ (0, X.jsx)("section", {
				className: "sv-page-banner",
				children: /* @__PURE__ */ (0, X.jsxs)("div", {
					className: "sv-shell sv-page-split",
					children: [/* @__PURE__ */ (0, X.jsxs)("div", {
						className: "sv-display-heading",
						children: [
							/* @__PURE__ */ (0, X.jsx)("h1", {
								id: "public-title",
								tabIndex: -1,
								children: "Quem somos"
							}),
							/* @__PURE__ */ (0, X.jsx)("p", { children: "Somos o Sistema Integrado de Vendas Industriais. Reunimos compradores e fornecedores em um só lugar para organizar as condições da compra e acompanhar o pedido até a entrega." }),
							/* @__PURE__ */ (0, X.jsx)(rf, {
								href: Kd("platform"),
								children: "Conhecer a plataforma"
							})
						]
					}), /* @__PURE__ */ (0, X.jsx)("video", {
						className: "sv-about-video",
						controls: !0,
						playsInline: !0,
						preload: "none",
						poster: "./assets/cnc-lathe-poster.jpg",
						muted: !0,
						"aria-label": "Vídeo de uma operação de usinagem CNC",
						children: /* @__PURE__ */ (0, X.jsx)("source", {
							src: "./assets/cnc-lathe.webm",
							type: "video/webm"
						})
					})]
				})
			}),
			/* @__PURE__ */ (0, X.jsx)("section", {
				className: "sv-about-purpose",
				"aria-labelledby": "visao-geral",
				children: /* @__PURE__ */ (0, X.jsxs)("div", {
					className: "sv-shell sv-about-details",
					children: [
						/* @__PURE__ */ (0, X.jsxs)("div", {
							className: "sv-display-heading",
							children: [/* @__PURE__ */ (0, X.jsx)(Ox, {
								id: "visao-geral",
								tabIndex: -1,
								tag: "h2",
								text: "Quem compra encontra quem fabrica.",
								splitType: "words",
								effect: "flip",
								delay: 85,
								duration: .85,
								textAlign: "left"
							}), /* @__PURE__ */ (0, X.jsx)("p", { children: "O SIVI organiza a negociação e os registros. Fabricação, transporte e pagamento são combinados entre as empresas." })]
						}),
						/* @__PURE__ */ (0, X.jsx)("img", {
							className: "sv-purpose-mark",
							src: "./src/assets/brand/raposa.svg",
							width: "160",
							height: "160",
							alt: ""
						}),
						/* @__PURE__ */ (0, X.jsxs)("dl", { children: [
							/* @__PURE__ */ (0, X.jsxs)("div", {
								"data-landing-reveal": "fade",
								children: [/* @__PURE__ */ (0, X.jsx)("dt", { children: "Por que existe" }), /* @__PURE__ */ (0, X.jsx)("dd", { children: "Uma compra industrial depende de especificações que vão além de preço e quantidade. As duas partes precisam trabalhar com os mesmos requisitos." })]
							}),
							/* @__PURE__ */ (0, X.jsxs)("div", {
								"data-landing-reveal": "fade",
								children: [/* @__PURE__ */ (0, X.jsx)("dt", { children: "Como funciona" }), /* @__PURE__ */ (0, X.jsx)("dd", { children: "O comprador descreve os requisitos e compara propostas. O fornecedor apresenta sua capacidade e registra o que foi acordado." })]
							}),
							/* @__PURE__ */ (0, X.jsxs)("div", {
								"data-landing-reveal": "fade",
								children: [/* @__PURE__ */ (0, X.jsx)("dt", { children: "O que fica registrado" }), /* @__PURE__ */ (0, X.jsx)("dd", { children: "As propostas e suas versões, as condições aceitas e o andamento do pedido até o recebimento e a avaliação." })]
							})
						] })
					]
				})
			}),
			/* @__PURE__ */ (0, X.jsx)("section", {
				className: "sv-about-audiences",
				"aria-labelledby": "quem-usa",
				children: /* @__PURE__ */ (0, X.jsxs)("div", {
					className: "sv-shell",
					children: [/* @__PURE__ */ (0, X.jsx)("div", {
						className: "sv-display-heading sv-display-heading--center",
						children: /* @__PURE__ */ (0, X.jsx)("h2", {
							id: "quem-usa",
							children: "Quem usa o SIVI."
						})
					}), /* @__PURE__ */ (0, X.jsxs)("div", {
						className: "sv-audience-grid",
						children: [/* @__PURE__ */ (0, X.jsxs)("article", { children: [
							/* @__PURE__ */ (0, X.jsx)("img", {
								src: "./assets/operador-torno.jpg",
								"data-landing-reveal": "curtain",
								alt: "Operador conferindo uma operação de usinagem",
								loading: "lazy",
								width: "960",
								height: "640"
							}),
							/* @__PURE__ */ (0, X.jsx)("h3", { children: "Empresas compradoras" }),
							/* @__PURE__ */ (0, X.jsx)("p", { children: "Equipes que precisam descrever peças, materiais ou serviços, comparar cotações e acompanhar o que foi combinado até o recebimento." }),
							/* @__PURE__ */ (0, X.jsxs)("a", {
								className: "sv-text-link",
								href: Yd("compras"),
								children: ["Ver como funciona para compras ", /* @__PURE__ */ (0, X.jsx)(tf, {})]
							})
						] }), /* @__PURE__ */ (0, X.jsxs)("article", { children: [
							/* @__PURE__ */ (0, X.jsx)("img", {
								src: "./assets/detalhe-torno.jpg",
								"data-landing-reveal": "curtain",
								alt: "Detalhe de uma máquina de usinagem",
								loading: "lazy",
								width: "960",
								height: "640"
							}),
							/* @__PURE__ */ (0, X.jsx)("h3", { children: "Empresas fornecedoras" }),
							/* @__PURE__ */ (0, X.jsx)("p", { children: "Empresas que apresentam seus materiais, processos e regiões atendidas, cotam demandas e registram o andamento do fornecimento." }),
							/* @__PURE__ */ (0, X.jsxs)("a", {
								className: "sv-text-link",
								href: Yd("fornecimento"),
								children: ["Ver como funciona para fornecimento ", /* @__PURE__ */ (0, X.jsx)(tf, {})]
							})
						] })]
					})]
				})
			}),
			/* @__PURE__ */ (0, X.jsx)("section", {
				className: "sv-account-journey",
				"aria-labelledby": "conta-operacao",
				children: /* @__PURE__ */ (0, X.jsxs)("div", {
					className: "sv-shell",
					children: [
						/* @__PURE__ */ (0, X.jsxs)("div", {
							className: "sv-display-heading",
							children: [/* @__PURE__ */ (0, X.jsx)("h2", {
								id: "conta-operacao",
								children: "Da conta ao acesso da empresa."
							}), /* @__PURE__ */ (0, X.jsx)("p", { children: "Uma empresa pode comprar, fornecer ou exercer as duas atuações." })]
						}),
						/* @__PURE__ */ (0, X.jsxs)("ol", { children: [
							/* @__PURE__ */ (0, X.jsxs)("li", { children: [/* @__PURE__ */ (0, X.jsx)("strong", { children: "Confirme seu e-mail." }), /* @__PURE__ */ (0, X.jsx)("p", { children: "Use o link enviado para validar a sua conta pessoal." })] }),
							/* @__PURE__ */ (0, X.jsxs)("li", { children: [/* @__PURE__ */ (0, X.jsx)("strong", { children: "Apresente a empresa." }), /* @__PURE__ */ (0, X.jsx)("p", { children: "Informe os dados empresariais e escolha como ela vai atuar." })] }),
							/* @__PURE__ */ (0, X.jsxs)("li", { children: [/* @__PURE__ */ (0, X.jsx)("strong", { children: "Acompanhe a análise." }), /* @__PURE__ */ (0, X.jsx)("p", { children: "Consulte o cadastro e responda a eventuais pedidos de correção." })] })
						] }),
						/* @__PURE__ */ (0, X.jsx)(rf, {
							href: Kd("faq"),
							children: "Entender o cadastro"
						})
					]
				})
			}),
			/* @__PURE__ */ (0, X.jsx)("section", {
				className: "sv-about-principles",
				"aria-labelledby": "principios",
				children: /* @__PURE__ */ (0, X.jsxs)("div", {
					className: "sv-shell",
					children: [
						/* @__PURE__ */ (0, X.jsx)("div", {
							className: "sv-display-heading sv-display-heading--center",
							children: /* @__PURE__ */ (0, X.jsx)("h2", {
								id: "principios",
								children: "Princípios da plataforma."
							})
						}),
						/* @__PURE__ */ (0, X.jsx)("div", {
							className: "sv-principle-grid",
							children: fC.map(({ Icon: e, title: t, description: n }) => /* @__PURE__ */ (0, X.jsxs)("article", {
								"data-landing-reveal": "fade",
								children: [
									/* @__PURE__ */ (0, X.jsx)(e, { "aria-hidden": "true" }),
									/* @__PURE__ */ (0, X.jsx)("h3", { children: t }),
									/* @__PURE__ */ (0, X.jsx)("p", { children: n })
								]
							}, t))
						}),
						/* @__PURE__ */ (0, X.jsx)(rf, {
							href: Kd("cases"),
							children: "Ver os princípios em exemplos"
						})
					]
				})
			})
		]
	});
}
function mC() {
	return /* @__PURE__ */ (0, X.jsxs)(Vx, {
		page: "cases",
		lightHeader: !0,
		children: [
			/* @__PURE__ */ (0, X.jsx)("section", {
				className: "sv-page-banner sv-page-banner--light sv-page-banner--center",
				children: /* @__PURE__ */ (0, X.jsxs)("div", {
					className: "sv-shell sv-display-heading",
					children: [
						/* @__PURE__ */ (0, X.jsx)("h1", {
							id: "public-title",
							tabIndex: -1,
							children: "Casos de uso"
						}),
						/* @__PURE__ */ (0, X.jsx)("p", { children: "Acompanhe uma compra ilustrativa de 240 peças, da primeira especificação à confirmação do recebimento." }),
						/* @__PURE__ */ (0, X.jsx)("nav", {
							className: "sv-section-index",
							"aria-label": "Casos nesta página",
							children: Hx.map(({ id: e, title: t }) => /* @__PURE__ */ (0, X.jsx)("a", {
								href: qd("cases", e),
								children: t
							}, e))
						})
					]
				})
			}),
			/* @__PURE__ */ (0, X.jsx)("div", {
				className: "sv-shell sv-cases-list",
				children: Hx.map((e) => /* @__PURE__ */ (0, X.jsxs)("article", {
					className: "sv-example-entry sv-case-row",
					children: [/* @__PURE__ */ (0, X.jsxs)("div", {
						className: "sv-case-body sv-display-heading",
						children: [
							/* @__PURE__ */ (0, X.jsx)("h2", {
								id: e.id,
								tabIndex: -1,
								children: e.title
							}),
							/* @__PURE__ */ (0, X.jsx)("p", { children: e.context }),
							/* @__PURE__ */ (0, X.jsxs)("dl", { children: [/* @__PURE__ */ (0, X.jsxs)("div", { children: [/* @__PURE__ */ (0, X.jsx)("dt", { children: "Como usar o SIVI" }), /* @__PURE__ */ (0, X.jsx)("dd", { children: e.walkthrough })] }), /* @__PURE__ */ (0, X.jsxs)("div", { children: [/* @__PURE__ */ (0, X.jsx)("dt", { children: "O que fica registrado" }), /* @__PURE__ */ (0, X.jsx)("dd", { children: e.record })] })] }),
							/* @__PURE__ */ (0, X.jsxs)(rf, {
								href: Xd(e.step),
								className: "sv-case-action",
								children: ["Explorar etapa", /* @__PURE__ */ (0, X.jsxs)("span", {
									className: "sr-only",
									children: [" de ", e.title.toLowerCase()]
								})]
							})
						]
					}), /* @__PURE__ */ (0, X.jsx)("div", {
						className: "sv-example-art",
						"data-landing-reveal": "record",
						children: /* @__PURE__ */ (0, X.jsx)(Ux, { example: e })
					})]
				}, e.id))
			}),
			/* @__PURE__ */ (0, X.jsx)("section", {
				className: "sv-home-agreement sv-home-agreement--dark",
				"aria-labelledby": "casos-jornada",
				children: /* @__PURE__ */ (0, X.jsxs)("div", {
					className: "sv-shell sv-display-heading",
					children: [
						/* @__PURE__ */ (0, X.jsx)("h2", {
							id: "casos-jornada",
							children: "Veja a jornada completa."
						}),
						/* @__PURE__ */ (0, X.jsx)("p", { children: "Explore os sete passos da compra e confira o papel de cada empresa em cada etapa." }),
						/* @__PURE__ */ (0, X.jsx)(rf, {
							href: Yd("funcionamento"),
							children: "Abrir a jornada de compra"
						})
					]
				})
			})
		]
	});
}
var hC = [{
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
function gC() {
	return /* @__PURE__ */ (0, X.jsxs)(Vx, {
		page: "faq",
		lightHeader: !0,
		children: [
			/* @__PURE__ */ (0, X.jsx)("section", {
				className: "sv-page-banner sv-page-banner--light",
				children: /* @__PURE__ */ (0, X.jsxs)("div", {
					className: "sv-shell sv-display-heading",
					children: [
						/* @__PURE__ */ (0, X.jsx)("h1", {
							id: "public-title",
							tabIndex: -1,
							children: "Dúvidas"
						}),
						/* @__PURE__ */ (0, X.jsx)("p", { children: "Encontre orientações para cadastrar a empresa, recuperar o acesso e acompanhar uma compra no SIVI." }),
						/* @__PURE__ */ (0, X.jsx)("nav", {
							className: "sv-section-index",
							"aria-label": "Temas de ajuda",
							children: hC.map(({ id: e, title: t }) => /* @__PURE__ */ (0, X.jsx)("a", {
								href: qd("faq", e),
								children: t
							}, e))
						})
					]
				})
			}),
			/* @__PURE__ */ (0, X.jsxs)("section", {
				className: "sv-faq sv-shell sv-faq-page",
				"aria-labelledby": "duvidas",
				children: [/* @__PURE__ */ (0, X.jsxs)("div", {
					className: "sv-display-heading",
					children: [/* @__PURE__ */ (0, X.jsx)("h2", {
						id: "duvidas",
						tabIndex: -1,
						children: "Perguntas frequentes."
					}), /* @__PURE__ */ (0, X.jsxs)("a", {
						className: "sv-text-link",
						href: Zd("ajuda"),
						children: ["Ver orientações de acesso ", /* @__PURE__ */ (0, X.jsx)(tf, {})]
					})]
				}), /* @__PURE__ */ (0, X.jsx)("div", {
					className: "sv-faq-topics",
					children: hC.map(({ id: e, title: t, questions: n }) => /* @__PURE__ */ (0, X.jsxs)("section", {
						"aria-labelledby": e,
						children: [/* @__PURE__ */ (0, X.jsx)("h3", {
							id: e,
							tabIndex: -1,
							children: t
						}), n.map(([e, t]) => /* @__PURE__ */ (0, X.jsxs)("details", { children: [/* @__PURE__ */ (0, X.jsxs)("summary", { children: [e, /* @__PURE__ */ (0, X.jsx)("span", {
							"aria-hidden": "true",
							children: "+"
						})] }), /* @__PURE__ */ (0, X.jsx)("p", { children: t })] }, e))]
					}, e))
				})]
			}),
			/* @__PURE__ */ (0, X.jsx)("section", {
				className: "sv-home-agreement sv-home-agreement--dark",
				"aria-labelledby": "duvidas-comecar",
				children: /* @__PURE__ */ (0, X.jsxs)("div", {
					className: "sv-shell sv-display-heading",
					children: [
						/* @__PURE__ */ (0, X.jsx)("h2", {
							id: "duvidas-comecar",
							children: "Pronto para cadastrar sua empresa?"
						}),
						/* @__PURE__ */ (0, X.jsx)("p", { children: "Crie sua conta e escolha como a sua empresa vai atuar no SIVI." }),
						/* @__PURE__ */ (0, X.jsx)(rf, { children: "Cadastrar empresa" })
					]
				})
			})
		]
	});
}
// src/public/information.tsx
var _C = {
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
function vC({ page: e }) {
	let t = _C[e] ?? _C.ajuda;
	return /* @__PURE__ */ (0, X.jsx)(Vx, {
		lightHeader: !0,
		children: /* @__PURE__ */ (0, X.jsxs)("div", {
			className: "sv-information sv-shell",
			children: [
				/* @__PURE__ */ (0, X.jsx)("a", {
					className: "sv-back",
					href: "#/",
					children: "← Voltar à página inicial"
				}),
				/* @__PURE__ */ (0, X.jsx)("p", {
					className: "sv-eyebrow",
					children: t.eyebrow
				}),
				/* @__PURE__ */ (0, X.jsx)("h1", {
					id: "public-title",
					tabIndex: -1,
					children: t.title
				}),
				/* @__PURE__ */ (0, X.jsx)("p", {
					className: "sv-information-intro",
					children: t.intro
				}),
				/* @__PURE__ */ (0, X.jsxs)("div", {
					className: "sv-information-grid",
					children: [/* @__PURE__ */ (0, X.jsxs)("aside", { children: [
						/* @__PURE__ */ (0, X.jsx)("span", { children: "Nesta página" }),
						t.sections.map(([t], n) => /* @__PURE__ */ (0, X.jsx)("a", {
							href: `#/?pagina=${e}&secao=info-${n}`,
							children: t
						}, t)),
						/* @__PURE__ */ (0, X.jsxs)("a", {
							href: Zd("ajuda"),
							children: ["Ajuda e acesso ", /* @__PURE__ */ (0, X.jsx)(tf, {})]
						})
					] }), /* @__PURE__ */ (0, X.jsxs)("div", { children: [t.sections.map(([e, t], n) => /* @__PURE__ */ (0, X.jsxs)("section", { children: [/* @__PURE__ */ (0, X.jsx)("h2", {
						id: `info-${n}`,
						tabIndex: -1,
						children: e
					}), /* @__PURE__ */ (0, X.jsx)("p", { children: t })] }, e)), e === "creditos" && /* @__PURE__ */ (0, X.jsxs)(X.Fragment, { children: [
						/* @__PURE__ */ (0, X.jsxs)("section", { children: [
							/* @__PURE__ */ (0, X.jsx)("h2", { children: "Vídeo: CNC lathe" }),
							/* @__PURE__ */ (0, X.jsx)("p", { children: "Vandurit inserti, via Wikimedia Commons. Licença CC BY 3.0. Vídeo recortado e apresentado sem áudio." }),
							/* @__PURE__ */ (0, X.jsxs)("a", {
								href: "https://commons.wikimedia.org/wiki/File:CNC_lathe.webm",
								target: "_blank",
								rel: "noreferrer",
								children: ["Ver vídeo e autoria ", /* @__PURE__ */ (0, X.jsx)(tf, {})]
							}),
							" ",
							"·",
							" ",
							/* @__PURE__ */ (0, X.jsxs)("a", {
								href: "https://creativecommons.org/licenses/by/3.0/",
								target: "_blank",
								rel: "noreferrer",
								children: ["Licença ", /* @__PURE__ */ (0, X.jsx)(tf, {})]
							})
						] }),
						/* @__PURE__ */ (0, X.jsxs)("section", { children: [
							/* @__PURE__ */ (0, X.jsx)("h2", { children: "Fotografias industriais" }),
							/* @__PURE__ */ (0, X.jsx)("p", { children: "Tima Miroshnichenko, via Pexels. Fotografias recortadas para a composição." }),
							/* @__PURE__ */ (0, X.jsxs)("a", {
								href: "https://www.pexels.com/photo/a-man-using-a-turning-machine-5846270/",
								target: "_blank",
								rel: "noreferrer",
								children: ["Operador no torno ", /* @__PURE__ */ (0, X.jsx)(tf, {})]
							}),
							/* @__PURE__ */ (0, X.jsx)("br", {}),
							/* @__PURE__ */ (0, X.jsxs)("a", {
								href: "https://www.pexels.com/photo/black-metal-machine-on-brown-wooden-table-5846125/",
								target: "_blank",
								rel: "noreferrer",
								children: ["Detalhe do torno ", /* @__PURE__ */ (0, X.jsx)(tf, {})]
							}),
							" ",
							"·",
							" ",
							/* @__PURE__ */ (0, X.jsxs)("a", {
								href: "https://www.pexels.com/license/",
								target: "_blank",
								rel: "noreferrer",
								children: ["Licença Pexels ", /* @__PURE__ */ (0, X.jsx)(tf, {})]
							})
						] }),
						/* @__PURE__ */ (0, X.jsxs)("section", { children: [
							/* @__PURE__ */ (0, X.jsx)("h2", { children: "Componentes e identidade" }),
							/* @__PURE__ */ (0, X.jsx)("p", { children: "Raposa original do SIVI preservada. Gráfico adaptado do componente de referência do 21st.dev fornecido pelo responsável. Ícones Lucide e movimento com Motion e GSAP. SplitText e ScrollReveal adaptados do React Bits, de David Haz. Indicadores, painéis e setas adaptados das receitas do Transitions.dev, de Jakub Antalik." }),
							/* @__PURE__ */ (0, X.jsxs)("a", {
								href: "https://reactbits.dev/",
								target: "_blank",
								rel: "noreferrer",
								children: ["React Bits ", /* @__PURE__ */ (0, X.jsx)(tf, {})]
							}),
							" ",
							"·",
							" ",
							/* @__PURE__ */ (0, X.jsxs)("a", {
								href: "./assets/licenses/react-bits.txt",
								target: "_blank",
								rel: "noreferrer",
								children: ["Licença React Bits ", /* @__PURE__ */ (0, X.jsx)(tf, {})]
							}),
							/* @__PURE__ */ (0, X.jsx)("br", {}),
							/* @__PURE__ */ (0, X.jsxs)("a", {
								href: "https://transitions.dev/",
								target: "_blank",
								rel: "noreferrer",
								children: ["Transitions.dev ", /* @__PURE__ */ (0, X.jsx)(tf, {})]
							}),
							" ",
							"·",
							" ",
							/* @__PURE__ */ (0, X.jsxs)("a", {
								href: "./assets/licenses/transitions-dev.txt",
								target: "_blank",
								rel: "noreferrer",
								children: ["Licença Transitions.dev ", /* @__PURE__ */ (0, X.jsx)(tf, {})]
							})
						] })
					] })] })]
				}),
				/* @__PURE__ */ (0, X.jsxs)("div", {
					className: "sv-information-cta",
					children: [/* @__PURE__ */ (0, X.jsx)("h2", { children: "Pronto para o próximo acordo?" }), /* @__PURE__ */ (0, X.jsx)(rf, { children: "Conhecer o cadastro" })]
				})
			]
		})
	});
}
// src/core/signup-draft-store.js
var yC = "sivi.signup-drafts.v1", bC = 6048e5, xC = (e) => String(e ?? "").trim().toLowerCase();
function SC({ storage: e, now: t = Date.now, idFactory: n = () => globalThis.crypto.randomUUID() } = {}) {
	let r = !!e, i = [];
	try {
		let t = JSON.parse(e?.getItem(yC) ?? "[]");
		Array.isArray(t) && (i = t);
	} catch {
		r = !1;
	}
	let a = () => {
		if (r) try {
			let n = JSON.parse(e.getItem(yC) ?? "[]");
			i = (Array.isArray(n) ? n : []).filter((e) => e && typeof e.id == "string" && typeof e.email == "string" && Number.isFinite(e.expiresAt) && e.expiresAt > t()).flatMap((e) => {
				try {
					return [{
						id: e.id,
						email: xC(e.email),
						uid: typeof e.uid == "string" ? e.uid : void 0,
						organization: JS(e.organization),
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
			e?.setItem(yC, JSON.stringify(i));
		} catch {
			r = !1;
		}
	}, s = (e, n) => e && e.expiresAt > t() && n?.uid && xC(n.email) === e.email && (!e.uid || e.uid === n.uid);
	return {
		get persistent() {
			return r;
		},
		stage({ email: e, organization: r }) {
			a();
			let s = JS(r), c = xC(e);
			i = i.filter((e) => e.email !== c);
			let l = {
				id: n(),
				email: c,
				organization: s,
				expiresAt: t() + bC
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
var CC;
function wC() {
	if (!CC) {
		let e;
		try {
			e = window.localStorage;
		} catch {}
		CC = SC({ storage: e });
	}
	return CC;
}
// src/services/auth-errors.js
function TC(e) {
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
function EC({ label: e, name: t, id: n, type: r = "text", value: i, onChange: a, error: o, hint: s, autoComplete: c, maxLength: l, ...u }) {
	let [d, f] = (0, y.useState)(!1);
	return /* @__PURE__ */ (0, X.jsxs)("div", {
		className: "sa-field",
		children: [
			/* @__PURE__ */ (0, X.jsx)("label", {
				htmlFor: n,
				children: e
			}),
			/* @__PURE__ */ (0, X.jsxs)("div", {
				className: "sa-input-wrap",
				children: [/* @__PURE__ */ (0, X.jsx)("input", {
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
				}), r === "password" && /* @__PURE__ */ (0, X.jsx)("button", {
					type: "button",
					className: "sa-password",
					"aria-label": d ? `Ocultar ${e.toLowerCase()}` : `Mostrar ${e.toLowerCase()}`,
					"aria-pressed": d,
					"aria-controls": n,
					onClick: () => f(!d),
					children: d ? /* @__PURE__ */ (0, X.jsx)(gd, { size: 18 }) : /* @__PURE__ */ (0, X.jsx)(vd, { size: 18 })
				})]
			}),
			s && !o && /* @__PURE__ */ (0, X.jsx)("small", {
				id: `${n}-hint`,
				children: s
			}),
			o && /* @__PURE__ */ (0, X.jsx)("small", {
				className: "sa-error",
				id: `${n}-error`,
				children: o
			})
		]
	});
}
var DC = {
	firstName: "",
	lastName: "",
	email: "",
	password: "",
	confirmPassword: ""
};
function OC({ bridge: e }) {
	let t = new URLSearchParams(location.hash.split("?")[1]), n = t.get("modo") !== "login", [r, i] = (0, y.useState)(() => $S(t.get("atuacao"), t.get("plano")).id), [a, o] = (0, y.useState)(0), [s, c] = (0, y.useState)({
		...DC,
		name: "",
		cnpj: "",
		city: "",
		state: "",
		contact: ""
	}), [l, u] = (0, y.useState)({}), [d, f] = (0, y.useState)(!1), [p, m] = (0, y.useState)(""), [h, g] = (0, y.useState)(null), [_, v] = (0, y.useState)(!1), [b, x] = (0, y.useState)(""), [S, C] = (0, y.useState)(""), w = (0, y.useRef)(!1), T = (0, y.useRef)(!0), E = (0, y.useRef)(null), D = (0, y.useRef)(null), O = $S(r), k = wC();
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
	async function N(t) {
		if (t.preventDefault(), w.current) return;
		let n = {
			...s,
			roles: O.roles
		}, r = rC(n, a);
		if (Object.keys(r).length) {
			M(r);
			return;
		}
		if (a === 0) {
			o(a + 1), m(""), u({}), window.scrollTo(0, 0);
			return;
		}
		let i = {
			...rC(n, 0),
			...r
		};
		if (Object.keys(i).length) {
			o(+!Object.keys(rC(n, 0)).length), M(i);
			return;
		}
		w.current = !0, f(!0), m("Criando sua conta. Aguarde a confirmação.");
		let l;
		try {
			l = k.stage({
				email: s.email,
				organization: JS(n)
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
			T.current && j(e.code === "auth/email-already-in-use" ? "Este e-mail já tem uma conta. Entre ou recupere sua senha para continuar." : TC(e));
		} finally {
			w.current = !1, T.current && f(!1);
		}
	}
	async function P(t) {
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
					T.current && j(TC(e));
				} finally {
					w.current = !1, T.current && f(!1);
				}
			}
		}
	}
	async function F(t) {
		if (!w.current) {
			w.current = !0, f(!0), m("Abrindo o provedor de acesso…");
			try {
				await (await e.loadAuth()).loginWithProvider(t);
			} catch (e) {
				T.current && j(TC(e));
			} finally {
				w.current = !1, T.current && f(!1);
			}
		}
	}
	let I = (e, t, n = "text", r) => /* @__PURE__ */ (0, X.jsx)(EC, {
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
	return /* @__PURE__ */ (0, X.jsxs)("div", {
		className: "sa-layout auth-shell",
		"data-mode": n ? "register" : "login",
		"data-ui-ready": "true",
		"aria-busy": d,
		children: [/* @__PURE__ */ (0, X.jsxs)("aside", {
			className: "sa-story",
			children: [
				/* @__PURE__ */ (0, X.jsx)("img", {
					className: "sa-story-photo",
					src: "./assets/operador-torno.jpg",
					alt: "Operador trabalhando em uma máquina industrial"
				}),
				/* @__PURE__ */ (0, X.jsx)("div", { className: "sa-story-shade" }),
				/* @__PURE__ */ (0, X.jsxs)("div", {
					className: "sa-story-top",
					children: [/* @__PURE__ */ (0, X.jsx)(ef, { back: !0 }), /* @__PURE__ */ (0, X.jsxs)("span", { children: [
						"DA NECESSIDADE",
						/* @__PURE__ */ (0, X.jsx)("br", {}),
						"AO ACORDO."
					] })]
				}),
				/* @__PURE__ */ (0, X.jsxs)("div", {
					className: "sa-story-copy",
					children: [
						/* @__PURE__ */ (0, X.jsx)("p", {
							className: "sv-eyebrow",
							children: "Boas conexões movem a indústria"
						}),
						/* @__PURE__ */ (0, X.jsxs)("h2", { children: [
							"O próximo acordo",
							/* @__PURE__ */ (0, X.jsx)("br", {}),
							"tem uma empresa",
							/* @__PURE__ */ (0, X.jsx)("br", {}),
							"como a sua."
						] }),
						/* @__PURE__ */ (0, X.jsxs)("p", { children: [
							"Requisitos claros. Condições registradas.",
							/* @__PURE__ */ (0, X.jsx)("br", {}),
							"Um caminho compartilhado até o recebimento."
						] }),
						/* @__PURE__ */ (0, X.jsxs)("div", {
							className: "sa-story-proof",
							children: [/* @__PURE__ */ (0, X.jsx)(Id, { size: 20 }), /* @__PURE__ */ (0, X.jsxs)("span", { children: [
								"E-mail confirmado.",
								/* @__PURE__ */ (0, X.jsx)("br", {}),
								"Empresa sujeita à análise."
							] })]
						})
					]
				}),
				/* @__PURE__ */ (0, X.jsx)("small", {
					className: "sa-story-credit",
					children: "Fotografia real · Tima Miroshnichenko / Pexels"
				})
			]
		}), /* @__PURE__ */ (0, X.jsxs)("main", {
			className: "sa-main",
			children: [
				/* @__PURE__ */ (0, X.jsx)("div", {
					className: "sa-mobile-brand",
					children: /* @__PURE__ */ (0, X.jsx)(ef, { back: !0 })
				}),
				/* @__PURE__ */ (0, X.jsxs)("div", {
					className: "sa-top",
					children: [/* @__PURE__ */ (0, X.jsxs)("a", {
						href: "#/",
						className: "sa-back",
						children: [/* @__PURE__ */ (0, X.jsx)(ed, { size: 16 }), " Voltar ao início"]
					}), /* @__PURE__ */ (0, X.jsxs)("span", { children: [
						n ? "Já tem conta?" : "Primeiro acesso?",
						" ",
						/* @__PURE__ */ (0, X.jsxs)("a", {
							href: n ? "#/acesso?modo=login" : "#/acesso?modo=register",
							"data-switch-mode": n ? "login" : "register",
							children: [
								n ? "Entrar" : "Criar conta",
								" ",
								/* @__PURE__ */ (0, X.jsx)(nd, { size: 14 })
							]
						})
					] })]
				}),
				/* @__PURE__ */ (0, X.jsx)("div", {
					className: "sa-content form-view is-active",
					children: h ? /* @__PURE__ */ (0, X.jsxs)("section", {
						className: "sa-success",
						children: [
							/* @__PURE__ */ (0, X.jsx)("div", {
								className: "sa-success-symbol",
								children: /* @__PURE__ */ (0, X.jsx)(ud, { size: 30 })
							}),
							/* @__PURE__ */ (0, X.jsx)("p", {
								className: "sv-eyebrow",
								children: "Seu primeiro passo está concluído"
							}),
							/* @__PURE__ */ (0, X.jsx)("h1", {
								ref: E,
								tabIndex: -1,
								children: "Sua conta foi criada."
							}),
							/* @__PURE__ */ (0, X.jsxs)("p", { children: [
								"Agora confirme o e-mail ",
								/* @__PURE__ */ (0, X.jsx)("strong", { children: h.email }),
								" para continuar."
							] }),
							/* @__PURE__ */ (0, X.jsxs)("ol", { children: [
								/* @__PURE__ */ (0, X.jsxs)("li", { children: [/* @__PURE__ */ (0, X.jsx)("strong", { children: "Abra a mensagem de verificação." }), /* @__PURE__ */ (0, X.jsx)("span", { children: h.verificationSent ? "O link foi enviado. Confira a caixa de entrada e o spam." : "Não foi possível enviar a mensagem agora. Tente entrar para solicitar um novo envio." })] }),
								/* @__PURE__ */ (0, X.jsxs)("li", { children: [/* @__PURE__ */ (0, X.jsx)("strong", { children: "Entre e revise a empresa." }), /* @__PURE__ */ (0, X.jsx)("span", { children: h.persistent ? "Os dados empresariais ficam neste navegador por até sete dias para você retomar a revisão." : "Este navegador não permitiu salvar o rascunho. Ao entrar, apresente novamente os dados da empresa." })] }),
								/* @__PURE__ */ (0, X.jsxs)("li", { children: [/* @__PURE__ */ (0, X.jsx)("strong", { children: "Envie para análise." }), /* @__PURE__ */ (0, X.jsx)("span", { children: "O acesso comercial será liberado após a aprovação do cadastro empresarial." })] })
							] }),
							(!h.profileSaved || !h.displayNameSaved) && /* @__PURE__ */ (0, X.jsx)("p", {
								className: "sa-notice",
								children: "A conta existe, mas parte dos dados do perfil não pôde ser salva. Confira seu perfil após entrar."
							}),
							/* @__PURE__ */ (0, X.jsxs)("a", {
								className: "sa-submit",
								href: "#/acesso?modo=login",
								children: ["Ir para entrar ", /* @__PURE__ */ (0, X.jsx)(nd, { size: 18 })]
							})
						]
					}) : n ? /* @__PURE__ */ (0, X.jsxs)(X.Fragment, { children: [
						/* @__PURE__ */ (0, X.jsxs)("div", {
							className: "sa-form-heading",
							children: [
								/* @__PURE__ */ (0, X.jsx)("p", {
									className: "sv-eyebrow",
									children: "Sua empresa no SIVI"
								}),
								/* @__PURE__ */ (0, X.jsx)("h1", {
									ref: E,
									tabIndex: -1,
									children: ["Comece uma nova conexão.", "Apresente sua empresa."][a]
								}),
								/* @__PURE__ */ (0, X.jsx)("p", { children: ["Preencha seus dados para criar um acesso acadêmico.", "Informe o nome e a atuação da empresa. Os dados complementares são opcionais."][a] })
							]
						}),
						/* @__PURE__ */ (0, X.jsx)("ol", {
							className: "sa-steps",
							"aria-label": "Etapas do cadastro",
							children: ["Seu acesso", "Sua empresa"].map((e, t) => /* @__PURE__ */ (0, X.jsx)("li", {
								"aria-current": t === a ? "step" : void 0,
								className: t <= a ? "is-active" : "",
								children: /* @__PURE__ */ (0, X.jsxs)("button", {
									type: "button",
									disabled: t > a || d,
									onClick: () => {
										o(t), m(""), u({});
									},
									children: [/* @__PURE__ */ (0, X.jsx)("span", { children: t < a ? /* @__PURE__ */ (0, X.jsx)(ud, { size: 13 }) : t + 1 }), e]
								})
							}, e))
						}),
						/* @__PURE__ */ (0, X.jsx)("form", {
							id: "register-form",
							noValidate: !0,
							onSubmit: N,
							children: /* @__PURE__ */ (0, X.jsxs)("fieldset", {
								disabled: d,
								children: [
									a === 0 && /* @__PURE__ */ (0, X.jsxs)(X.Fragment, { children: [
										/* @__PURE__ */ (0, X.jsxs)("div", {
											className: "sa-row",
											children: [I("firstName", "Nome", "text", "given-name"), I("lastName", "Sobrenome", "text", "family-name")]
										}),
										I("email", "E-mail", "email", "email"),
										I("password", "Senha", "password", "new-password"),
										I("confirmPassword", "Confirmar senha", "password", "new-password")
									] }),
									a === 1 && /* @__PURE__ */ (0, X.jsxs)(X.Fragment, { children: [
										/* @__PURE__ */ (0, X.jsx)(EC, {
											label: "Nome da empresa",
											id: "company-name",
											name: "name",
											autoComplete: "organization",
											maxLength: 120,
											value: s.name,
											onChange: A,
											error: l.name
										}),
										/* @__PURE__ */ (0, X.jsx)(EC, {
											label: "CNPJ",
											id: "company-cnpj",
											error: l.cnpj,
											name: "cnpj",
											maxLength: 18,
											value: s.cnpj,
											onChange: A
										}),
										/* @__PURE__ */ (0, X.jsxs)("div", {
											className: "sa-row sa-row--city",
											children: [/* @__PURE__ */ (0, X.jsx)(EC, {
												label: "Cidade",
												id: "company-city",
												error: l.city,
												name: "city",
												autoComplete: "address-level2",
												maxLength: 100,
												value: s.city,
												onChange: A
											}), /* @__PURE__ */ (0, X.jsxs)("div", {
												className: "sa-field",
												children: [
													/* @__PURE__ */ (0, X.jsx)("label", {
														htmlFor: "company-state",
														children: "UF"
													}),
													/* @__PURE__ */ (0, X.jsxs)("select", {
														id: "company-state",
														"aria-invalid": !!l.state,
														"aria-describedby": l.state ? "company-state-error" : void 0,
														name: "state",
														value: s.state,
														onChange: (e) => A("state", e.target.value),
														children: [/* @__PURE__ */ (0, X.jsx)("option", {
															value: "",
															children: "Selecione"
														}), KS.map((e) => /* @__PURE__ */ (0, X.jsx)("option", { children: e }, e))]
													}),
													l.state && /* @__PURE__ */ (0, X.jsx)("small", {
														id: "company-state-error",
														className: "sa-error",
														children: l.state
													})
												]
											})]
										}),
										/* @__PURE__ */ (0, X.jsx)(EC, {
											label: "Telefone ou e-mail de contato",
											id: "company-contact",
											error: l.contact,
											name: "contact",
											maxLength: 120,
											value: s.contact,
											onChange: A
										}),
										/* @__PURE__ */ (0, X.jsxs)("div", {
											className: "sa-field",
											children: [/* @__PURE__ */ (0, X.jsx)("label", {
												htmlFor: "signup-activity",
												children: "Atuação da empresa"
											}), /* @__PURE__ */ (0, X.jsx)("select", {
												id: "signup-activity",
												value: r,
												onChange: (e) => i(e.target.value),
												children: ZS.map((e) => /* @__PURE__ */ (0, X.jsx)("option", {
													value: e.id,
													children: e.label
												}, e.id))
											})]
										})
									] }),
									/* @__PURE__ */ (0, X.jsx)("div", {
										ref: D,
										className: `sa-feedback ${p ? "is-visible" : ""}`,
										role: "status",
										tabIndex: -1,
										"data-status": "register",
										children: p
									}),
									/* @__PURE__ */ (0, X.jsxs)("button", {
										type: "submit",
										className: "sa-submit",
										children: [d ? "Criando sua conta…" : a === 0 ? "Continuar para empresa" : "Criar conta", !d && /* @__PURE__ */ (0, X.jsx)(nd, { size: 18 })]
									}),
									a > 0 && /* @__PURE__ */ (0, X.jsx)("button", {
										className: "sa-previous",
										type: "button",
										onClick: () => {
											o(a - 1), m(""), u({});
										},
										children: "← Voltar e revisar"
									}),
									/* @__PURE__ */ (0, X.jsxs)("p", {
										className: "sa-legal",
										children: [
											"Ao criar a conta, você declara estar autorizado a representar a empresa. Conheça as",
											" ",
											/* @__PURE__ */ (0, X.jsx)("a", {
												href: Zd("condicoes"),
												target: "_blank",
												rel: "noopener noreferrer",
												children: "condições de uso"
											}),
											" ",
											"e o uso de dados na",
											" ",
											/* @__PURE__ */ (0, X.jsx)("a", {
												href: Zd("privacidade"),
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
					] }) : /* @__PURE__ */ (0, X.jsxs)(X.Fragment, { children: [
						/* @__PURE__ */ (0, X.jsxs)("div", {
							className: "sa-form-heading",
							children: [
								/* @__PURE__ */ (0, X.jsx)("p", {
									className: "sv-eyebrow",
									children: "Bem-vindo de volta"
								}),
								/* @__PURE__ */ (0, X.jsx)("h1", {
									ref: E,
									tabIndex: -1,
									children: _ ? "Recupere seu acesso." : "Seu próximo acordo espera."
								}),
								/* @__PURE__ */ (0, X.jsx)("p", { children: _ ? "Informe o e-mail usado no cadastro para receber as orientações." : "Entre para acompanhar sua empresa e continuar de onde parou." })
							]
						}),
						/* @__PURE__ */ (0, X.jsx)("form", {
							id: "login-form",
							noValidate: !0,
							onSubmit: P,
							children: /* @__PURE__ */ (0, X.jsxs)("fieldset", {
								disabled: d,
								children: [
									/* @__PURE__ */ (0, X.jsx)(EC, {
										id: "login-email",
										label: "E-mail",
										name: "email",
										type: "email",
										autoComplete: "username",
										value: b,
										onChange: (e, t) => x(t)
									}),
									!_ && /* @__PURE__ */ (0, X.jsx)(EC, {
										id: "login-password",
										label: "Senha",
										name: "password",
										type: "password",
										autoComplete: "current-password",
										value: S,
										onChange: (e, t) => C(t)
									}),
									/* @__PURE__ */ (0, X.jsx)("div", {
										ref: D,
										className: `sa-feedback ${p ? "is-visible" : ""}`,
										role: "status",
										tabIndex: -1,
										"data-status": "login",
										children: p
									}),
									/* @__PURE__ */ (0, X.jsxs)("button", {
										type: "submit",
										className: "sa-submit",
										children: [d ? "Aguarde…" : _ ? "Enviar orientações" : "Entrar na minha conta", !d && /* @__PURE__ */ (0, X.jsx)(nd, { size: 18 })]
									}),
									/* @__PURE__ */ (0, X.jsx)("button", {
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
						!_ && /* @__PURE__ */ (0, X.jsxs)(X.Fragment, { children: [/* @__PURE__ */ (0, X.jsx)("div", {
							className: "sa-divider",
							children: /* @__PURE__ */ (0, X.jsx)("span", { children: "ou entre com" })
						}), /* @__PURE__ */ (0, X.jsxs)("div", {
							className: "sa-providers",
							children: [/* @__PURE__ */ (0, X.jsxs)("button", {
								disabled: d,
								"data-provider": "google",
								onClick: () => F("google"),
								children: [/* @__PURE__ */ (0, X.jsx)("span", {
									"aria-hidden": "true",
									className: "sa-google",
									children: "G"
								}), "Google"]
							}), /* @__PURE__ */ (0, X.jsxs)("button", {
								disabled: d,
								"data-provider": "github",
								onClick: () => F("github"),
								children: [/* @__PURE__ */ (0, X.jsx)("svg", {
									width: "18",
									height: "18",
									viewBox: "0 0 24 24",
									fill: "currentColor",
									"aria-hidden": "true",
									children: /* @__PURE__ */ (0, X.jsx)("path", { d: "M12 .8a11.2 11.2 0 0 0-3.54 21.83c.56.1.77-.24.77-.54v-2.1c-3.13.68-3.8-1.33-3.8-1.33-.51-1.3-1.25-1.65-1.25-1.65-1.02-.7.08-.68.08-.68 1.13.08 1.72 1.16 1.72 1.16 1 1.71 2.63 1.22 3.27.93.1-.73.39-1.22.71-1.5-2.5-.28-5.13-1.25-5.13-5.56 0-1.23.44-2.23 1.16-3.02-.12-.28-.5-1.43.11-2.98 0 0 .94-.3 3.08 1.15a10.7 10.7 0 0 1 5.6 0c2.14-1.45 3.08-1.15 3.08-1.15.61 1.55.23 2.7.11 2.98.72.79 1.16 1.79 1.16 3.02 0 4.32-2.64 5.27-5.15 5.55.4.35.76 1.03.76 2.08v3.1c0 .3.2.65.77.54A11.2 11.2 0 0 0 12 .8Z" })
								}), "GitHub"]
							})]
						})] }),
						/* @__PURE__ */ (0, X.jsxs)("p", {
							className: "sa-login-help",
							children: [
								"O acesso da empresa depende da confirmação de e-mail e da análise cadastral.",
								" ",
								/* @__PURE__ */ (0, X.jsx)("a", {
									href: Zd("ajuda"),
									children: "Precisa de orientação?"
								})
							]
						})
					] })
				}),
				/* @__PURE__ */ (0, X.jsxs)("footer", {
					className: "sa-footer",
					children: [
						/* @__PURE__ */ (0, X.jsxs)("span", { children: [
							"© ",
							(/* @__PURE__ */ new Date()).getFullYear(),
							" SIVI"
						] }),
						/* @__PURE__ */ (0, X.jsx)("a", {
							href: Zd("privacidade"),
							children: "Privacidade"
						}),
						/* @__PURE__ */ (0, X.jsx)("a", {
							href: Zd("condicoes"),
							children: "Condições"
						}),
						/* @__PURE__ */ (0, X.jsx)("a", {
							href: Zd("ajuda"),
							children: "Ajuda"
						})
					]
				})
			]
		})]
	});
}
// src/domain/workspace-insights.js
var kC = new Intl.DateTimeFormat("en-CA", {
	timeZone: "America/Sao_Paulo",
	year: "numeric",
	month: "2-digit",
	day: "2-digit"
}), AC = 864e5, jC = (e) => {
	let t = Object.fromEntries(kC.formatToParts(e).map((e) => [e.type, e.value]));
	return `${t.year}-${t.month}-${t.day}`;
}, MC = (e) => Date.parse(`${e}T12:00:00Z`) / AC, NC = (e) => (/* @__PURE__ */ new Date(e * AC)).toISOString().slice(0, 10), PC = (e) => `${e.slice(8, 10)}/${e.slice(5, 7)}`, FC = (e) => {
	if (typeof e == "number" && Number.isFinite(e) && e > 0) return e;
	if (typeof e == "string" && /^\d{4}-\d{2}-\d{2}T/.test(e)) {
		let t = Date.parse(e);
		if (Number.isFinite(t)) return t;
	}
	return null;
}, IC = [
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
function LC(e = {}, { role: t = "buyer", days: n = 90, now: r = Date.now() } = {}) {
	if (!Number.isFinite(r)) throw Error("Informe um instante válido para os indicadores.");
	n = [
		30,
		60,
		90
	].includes(n) ? n : 90;
	let i = jC(r), a = MC(i) - n + 1, o = Array.from({ length: 6 }, (e, t) => {
		let r = NC(a + Math.ceil(t * n / 6)), i = NC(a + Math.ceil((t + 1) * n / 6) - 1);
		return {
			start: r,
			end: i,
			label: `${PC(r)}–${PC(i)}`,
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
		let e = FC(i.createdAt);
		if (e === null && t === "proposals") {
			let t = (i.versions ?? []).map((e) => FC(e.createdAt)).filter((e) => e !== null);
			t.length && (e = Math.min(...t));
		}
		if (e === null) {
			c[t] += 1;
			continue;
		}
		if (e > r) continue;
		let l = MC(jC(e)) - a;
		if (l < 0 || l >= n) continue;
		let u = Math.min(5, Math.floor(l * 6 / n));
		o[u][t] += 1, s[t] += 1;
	}
	let l = IC.map(([e, t, n]) => ({
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
			start: NC(a),
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
var RC = new Intl.NumberFormat("pt-BR", {
	style: "currency",
	currency: "BRL"
}), zC = new Intl.NumberFormat("pt-BR"), BC = new Intl.NumberFormat("pt-BR", {
	notation: "compact",
	maximumFractionDigits: 1
}), VC = [
	30,
	60,
	90
], HC = [
	4,
	3,
	2,
	1,
	0
], UC = (e) => e.slice(8, 10) + "/" + e.slice(5, 7), WC = (e) => UC(e) + "/" + e.slice(0, 4), GC = (e) => [
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
function KC({ records: e, role: t = "buyer", now: n }) {
	let [r, i] = (0, y.useState)(90), [a, o] = (0, y.useState)("proposals"), [s, c] = (0, y.useState)(null), [l] = (0, y.useState)(() => n ?? Date.now()), u = Pu(), d = (0, y.useId)(), f = (0, y.useId)(), p = (0, y.useMemo)(() => LC(e, {
		role: t,
		days: r,
		now: l
	}), [
		e,
		t,
		r,
		l
	]), m = GC(t), h = m.find((e) => e.id === a), g = p.totals[a], _ = Math.max(1, Math.ceil(Math.max(...p.series.map((e) => e[a])) / 4)), v = p.series.find((e) => e.start === s) ?? p.series.reduce((e, t) => t[a] > 0 ? t : e, p.series[0]), b = p.portfolio.filter((e) => e.count > 0), x = b.reduce((e, t) => e + t.count, 0), S = p.omitted[a], C = t === "supplier" ? "#/app/fornecedor/oportunidades" : "#/app/comprador/demandas", w = t === "supplier" ? "#/app/fornecedor/pedidos" : "#/app/comprador/pedidos";
	return /* @__PURE__ */ (0, X.jsxs)("section", {
		className: "workspace-insights",
		"data-workspace-insights": !0,
		"aria-label": "Indicadores da operação",
		children: [/* @__PURE__ */ (0, X.jsxs)("section", {
			className: "workspace-insights__movement",
			"aria-labelledby": d,
			children: [
				/* @__PURE__ */ (0, X.jsxs)("div", {
					className: "workspace-insights__heading",
					children: [/* @__PURE__ */ (0, X.jsxs)("div", { children: [/* @__PURE__ */ (0, X.jsx)("h2", {
						id: d,
						children: "Atividade da operação"
					}), /* @__PURE__ */ (0, X.jsxs)("p", { children: [
						WC(p.period.start),
						" a ",
						WC(p.period.end),
						" · horário de São Paulo"
					] })] }), /* @__PURE__ */ (0, X.jsx)("div", {
						className: "workspace-insights__period",
						role: "group",
						"aria-label": "Período dos indicadores",
						children: VC.map((e) => /* @__PURE__ */ (0, X.jsxs)("button", {
							type: "button",
							"aria-pressed": r === e,
							onClick: () => {
								i(e), c(null);
							},
							children: [e, " dias"]
						}, e))
					})]
				}),
				/* @__PURE__ */ (0, X.jsx)("div", {
					className: "workspace-insights__tabs",
					role: "group",
					"aria-label": "Tipo de atividade",
					children: m.map((e) => /* @__PURE__ */ (0, X.jsx)("button", {
						type: "button",
						"aria-pressed": a === e.id,
						onClick: () => {
							o(e.id), c(null);
						},
						children: e.label
					}, e.id))
				}),
				/* @__PURE__ */ (0, X.jsxs)("div", {
					className: "workspace-insights__figure",
					children: [/* @__PURE__ */ (0, X.jsx)("output", {
						"data-insight-total": !0,
						"aria-label": h.detail + ": " + g,
						"aria-live": "polite",
						children: /* @__PURE__ */ (0, X.jsx)(VS, {
							value: g,
							locales: "pt-BR",
							animated: !u,
							"aria-hidden": "true"
						})
					}), /* @__PURE__ */ (0, X.jsxs)("span", { children: [h.detail, " no período"] })]
				}),
				g > 0 ? /* @__PURE__ */ (0, X.jsxs)(X.Fragment, { children: [/* @__PURE__ */ (0, X.jsxs)("div", {
					className: "workspace-insights__plot",
					children: [/* @__PURE__ */ (0, X.jsx)("div", {
						className: "workspace-insights__y-axis",
						"aria-hidden": "true",
						children: HC.map((e) => /* @__PURE__ */ (0, X.jsx)("span", { children: BC.format(e * _) }, e))
					}), /* @__PURE__ */ (0, X.jsx)("div", {
						className: "workspace-insights__columns",
						role: "group",
						"aria-label": "Criações por intervalo",
						children: p.series.map((e) => /* @__PURE__ */ (0, X.jsxs)("button", {
							type: "button",
							"aria-label": e.label + ": " + zC.format(e[a]) + " · " + h.detail,
							"aria-pressed": e.start === v.start,
							onClick: () => c(e.start),
							children: [/* @__PURE__ */ (0, X.jsx)("span", {
								className: "workspace-insights__bar-track",
								"aria-hidden": "true",
								children: /* @__PURE__ */ (0, X.jsx)("span", {
									className: "workspace-insights__bar",
									"data-zero": e[a] === 0,
									style: { height: e[a] / (_ * 4) * 100 + "%" }
								})
							}), /* @__PURE__ */ (0, X.jsx)("span", { children: UC(e.start) })]
						}, e.start))
					})]
				}), /* @__PURE__ */ (0, X.jsxs)("p", {
					className: "workspace-insights__interval",
					role: "status",
					children: [/* @__PURE__ */ (0, X.jsx)("span", { children: v.label }), /* @__PURE__ */ (0, X.jsxs)("strong", { children: [zC.format(v[a]), " no intervalo"] })]
				})] }) : /* @__PURE__ */ (0, X.jsxs)("div", {
					className: "workspace-insights__empty",
					children: [/* @__PURE__ */ (0, X.jsx)(cd, {
						size: 20,
						"aria-hidden": "true"
					}), /* @__PURE__ */ (0, X.jsx)("p", { children: "Nenhuma criação registrada neste período." })]
				}),
				S > 0 && /* @__PURE__ */ (0, X.jsxs)("p", {
					className: "workspace-insights__note",
					children: [
						S,
						" ",
						h.label.toLocaleLowerCase("pt-BR"),
						" sem data de criação válida não entram nesta série."
					]
				}),
				t === "supplier" && a === "demands" && /* @__PURE__ */ (0, X.jsx)("p", {
					className: "workspace-insights__note",
					children: "Data de criação das oportunidades atualmente acessíveis; não mede quando foram liberadas."
				}),
				/* @__PURE__ */ (0, X.jsxs)("details", {
					className: "workspace-insights__data",
					children: [/* @__PURE__ */ (0, X.jsxs)("summary", { children: [
						/* @__PURE__ */ (0, X.jsx)(Rd, {
							size: 16,
							"aria-hidden": "true"
						}),
						"Consultar dados do período",
						/* @__PURE__ */ (0, X.jsx)(fd, {
							size: 16,
							"aria-hidden": "true"
						})
					] }), /* @__PURE__ */ (0, X.jsx)("div", { children: /* @__PURE__ */ (0, X.jsxs)("table", { children: [
						/* @__PURE__ */ (0, X.jsxs)("caption", { children: [
							"Criações por intervalo · ",
							r,
							" dias"
						] }),
						/* @__PURE__ */ (0, X.jsx)("thead", { children: /* @__PURE__ */ (0, X.jsxs)("tr", { children: [/* @__PURE__ */ (0, X.jsx)("th", {
							scope: "col",
							children: "Intervalo"
						}), m.map((e) => /* @__PURE__ */ (0, X.jsx)("th", {
							scope: "col",
							children: e.label
						}, e.id))] }) }),
						/* @__PURE__ */ (0, X.jsx)("tbody", { children: p.series.map((e) => /* @__PURE__ */ (0, X.jsxs)("tr", { children: [/* @__PURE__ */ (0, X.jsx)("th", {
							scope: "row",
							children: e.label
						}), m.map((t) => /* @__PURE__ */ (0, X.jsx)("td", { children: zC.format(e[t.id]) }, t.id))] }, e.start)) })
					] }) })]
				})
			]
		}), /* @__PURE__ */ (0, X.jsxs)("section", {
			className: "workspace-insights__portfolio",
			"aria-labelledby": f,
			children: [
				/* @__PURE__ */ (0, X.jsx)("div", {
					className: "workspace-insights__heading",
					children: /* @__PURE__ */ (0, X.jsxs)("div", { children: [/* @__PURE__ */ (0, X.jsx)("h2", {
						id: f,
						children: "Carteira de pedidos"
					}), /* @__PURE__ */ (0, X.jsx)("p", { children: "Estado atual · todos os períodos" })] })
				}),
				/* @__PURE__ */ (0, X.jsxs)("div", {
					className: "workspace-insights__order-summary",
					children: [/* @__PURE__ */ (0, X.jsxs)("div", { children: [/* @__PURE__ */ (0, X.jsx)("span", { children: "Total de pedidos" }), /* @__PURE__ */ (0, X.jsx)("strong", {
						"data-portfolio-total": !0,
						children: zC.format(x)
					})] }), /* @__PURE__ */ (0, X.jsxs)("div", { children: [/* @__PURE__ */ (0, X.jsx)("span", { children: "Valor registrado" }), /* @__PURE__ */ (0, X.jsx)("strong", { children: RC.format(p.orderValueCents / 100) })] })]
				}),
				x > 0 ? /* @__PURE__ */ (0, X.jsxs)(X.Fragment, { children: [/* @__PURE__ */ (0, X.jsx)("div", {
					className: "workspace-insights__distribution",
					"aria-hidden": "true",
					children: b.map((e) => /* @__PURE__ */ (0, X.jsx)("span", {
						className: "workspace-insights__status--" + e.tone,
						style: { flexGrow: e.count }
					}, e.id))
				}), /* @__PURE__ */ (0, X.jsx)("ul", {
					className: "workspace-insights__legend",
					"aria-label": "Pedidos por status",
					children: b.map((e) => /* @__PURE__ */ (0, X.jsxs)("li", { children: [
						/* @__PURE__ */ (0, X.jsx)("i", {
							className: "workspace-insights__status--" + e.tone,
							"aria-hidden": "true"
						}),
						/* @__PURE__ */ (0, X.jsx)("span", { children: e.label }),
						/* @__PURE__ */ (0, X.jsx)("strong", { children: zC.format(e.count) })
					] }, e.id))
				})] }) : /* @__PURE__ */ (0, X.jsx)("p", {
					className: "workspace-insights__portfolio-empty",
					children: "Seus pedidos aparecerão aqui após o aceite."
				}),
				/* @__PURE__ */ (0, X.jsxs)("p", {
					className: "workspace-insights__value-note",
					children: [p.incompleteOrderValues ? p.incompleteOrderValues + " pedido(s) com valor incompleto fora da soma. " : "", "Inclui frete. Não representa pagamento recebido."]
				}),
				/* @__PURE__ */ (0, X.jsxs)("a", {
					className: "workspace-insights__link",
					href: x ? w : C,
					children: [x ? "Acompanhar pedidos" : t === "supplier" ? "Ver oportunidades" : "Ver minhas demandas", /* @__PURE__ */ (0, X.jsx)(nd, {
						size: 16,
						"aria-hidden": "true"
					})]
				})
			]
		})]
	});
}
// src/public/entry.tsx
function qC(e, t, n) {
	e.replaceChildren();
	let r = (0, Iu.createRoot)(e);
	return (0, Fu.flushSync)(() => r.render(/* @__PURE__ */ (0, X.jsx)(wl, {
		reducedMotion: "user",
		children: /* @__PURE__ */ (0, X.jsx)("div", {
			className: n,
			children: t
		})
	}))), () => r.unmount();
}
var JC = {
	home: {
		Component: Xx,
		title: "SIVI — Marketplace industrial B2B"
	},
	about: {
		Component: pC,
		title: "Quem somos — SIVI"
	},
	platform: {
		Component: dC,
		title: "Plataforma — SIVI"
	},
	cases: {
		Component: mC,
		title: "Casos de uso — SIVI"
	},
	faq: {
		Component: gC,
		title: "Dúvidas — SIVI"
	}
};
function YC(e, t = "home") {
	let n = new URLSearchParams(location.hash.split("?")[1]), r = t === "home" ? n.get("pagina") : null, i = n.get("secao"), a = {
		seguranca: "Segurança e dados",
		privacidade: "Privacidade",
		condicoes: "Condições de uso",
		ajuda: "Ajuda e acesso",
		creditos: "Créditos"
	};
	if (r && r !== "sobre") {
		let t = Object.hasOwn(a, r) ? r : "ajuda";
		return document.title = `${a[t]} — SIVI`, qC(e, /* @__PURE__ */ (0, X.jsx)(vC, { page: t }), "sivi-public-ui");
	}
	(r === "sobre" || t === "home" && i === "visao-geral") && (t = "about"), t === "home" && Jd(i) && (t = "platform"), t === "home" && i === "duvidas" && (t = "faq");
	let { Component: o, title: s } = JC[t];
	return document.title = s, qC(e, /* @__PURE__ */ (0, X.jsx)(o, {}), "sivi-public-ui");
}
function XC(e, t) {
	return document.title = new URLSearchParams(location.hash.split("?")[1]).get("modo") === "login" ? "Entrar — SIVI" : "Cadastro — SIVI", qC(e, /* @__PURE__ */ (0, X.jsx)(OC, { bridge: t }), "sivi-auth-ui");
}
function ZC(e, t) {
	return qC(e, /* @__PURE__ */ (0, X.jsx)(KC, { ...t }), "sivi-workspace-ui");
}
export { XC as mountAuthExperience, YC as mountPublicExperience, ZC as mountWorkspaceAnalytics };
