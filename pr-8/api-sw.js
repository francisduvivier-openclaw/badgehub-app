var __defProp = Object.defineProperty;
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var __privateWrapper = (obj, member, setter, getter) => ({
  set _(value) {
    __privateSet(obj, member, value, setter);
  },
  get _() {
    return __privateGet(obj, member, getter);
  }
});
var _validatedData, _matchResult, _HonoRequest_instances, getDecodedParam_fn, getAllDecodedParams_fn, getParamValue_fn, _cachedBody, _a, _rawRequest, _req, _var, _status, _executionCtx, _res, _layout, _renderer, _notFoundHandler, _preparedHeaders, _matchResult2, _path, _Context_instances, newResponse_fn, _b, _path2, __Hono_instances, clone_fn, _notFoundHandler2, addRoute_fn, handleError_fn, dispatch_fn, _c, _index, _varIndex, _children, _d, _context, _root, _e, _middleware, _routes, _RegExpRouter_instances, buildMatcher_fn, _f, _routers, _routes2, _g, _methods, _children2, _patterns, _order, _params, __Node_instances, pushHandlerSets_fn, _h, _node, _i;
globalThis.__SHARED_CONFIG__ = { "BADGE_SLUGS": ["why2025", "mch2022"], "CATEGORY_NAMES": ["Uncategorised", "Event related", "Games", "Graphics", "Hardware", "Utility", "Wearable", "Data", "Silly", "Hacking", "Troll", "Unusable", "Adult", "Virus", "SAO", "Interpreter"], "ADMIN_CATEGORY_NAMES": ["Default"], "BADGEHUB_API_BASE_URL": "https://api.example.invalid", "keycloakPublic": { "KEYCLOAK_BASE_URL": "https://auth.example.invalid", "KEYCLOAK_REALM": "badgehub", "KEYCLOAK_CLIENT_ID": "badgehub-frontend" }, "isDevEnvironment": false };
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
var sqlWasmBrowser = { exports: {} };
var hasRequiredSqlWasmBrowser;
function requireSqlWasmBrowser() {
  if (hasRequiredSqlWasmBrowser) return sqlWasmBrowser.exports;
  hasRequiredSqlWasmBrowser = 1;
  (function(module, exports) {
    var initSqlJsPromise = void 0;
    var initSqlJs2 = function(moduleConfig) {
      if (initSqlJsPromise) {
        return initSqlJsPromise;
      }
      initSqlJsPromise = new Promise(function(resolveModule, reject) {
        var _a2, _b2;
        var Module = typeof moduleConfig !== "undefined" ? moduleConfig : {};
        var originalOnAbortFunction = Module["onAbort"];
        Module["onAbort"] = function(errorThatCausedAbort) {
          reject(new Error(errorThatCausedAbort));
          if (originalOnAbortFunction) {
            originalOnAbortFunction(errorThatCausedAbort);
          }
        };
        Module["postRun"] = Module["postRun"] || [];
        Module["postRun"].push(function() {
          resolveModule(Module);
        });
        module = void 0;
        var l;
        l || (l = typeof Module != "undefined" ? Module : {});
        var aa = !!globalThis.window, ba = !!globalThis.WorkerGlobalScope;
        l.onRuntimeInitialized = function() {
          function a(f, k) {
            switch (typeof k) {
              case "boolean":
                bc(f, k ? 1 : 0);
                break;
              case "number":
                cc(f, k);
                break;
              case "string":
                dc(f, k, -1, -1);
                break;
              case "object":
                if (null === k) eb(f);
                else if (null != k.length) {
                  var n = ca(k.length);
                  m.set(k, n);
                  ec(f, n, k.length, -1);
                  da(n);
                } else ra(f, "Wrong API use : tried to return a value of an unknown type (" + k + ").", -1);
                break;
              default:
                eb(f);
            }
          }
          function b(f, k) {
            for (var n = [], p = 0; p < f; p += 1) {
              var u = r(k + 4 * p, "i32"), v = fc(u);
              if (1 === v || 2 === v) u = gc(u);
              else if (3 === v) u = hc(u);
              else if (4 === v) {
                v = u;
                u = ic(v);
                v = jc(v);
                for (var K = new Uint8Array(u), G = 0; G < u; G += 1) K[G] = m[v + G];
                u = K;
              } else u = null;
              n.push(u);
            }
            return n;
          }
          function c(f, k) {
            this.Qa = f;
            this.db = k;
            this.Oa = 1;
            this.xb = [];
          }
          function d(f, k) {
            this.db = k;
            this.nb = ea(f);
            if (null === this.nb) throw Error("Unable to allocate memory for the SQL string");
            this.tb = this.nb;
            this.fb = this.Cb = null;
          }
          function e(f) {
            this.filename = "dbfile_" + (4294967295 * Math.random() >>> 0);
            if (null != f) {
              var k = this.filename, n = "/", p = k;
              n && (n = "string" == typeof n ? n : fa(n), p = k ? ha(n + "/" + k) : n);
              k = ia(true, true);
              p = ja(
                p,
                k
              );
              if (f) {
                if ("string" == typeof f) {
                  n = Array(f.length);
                  for (var u = 0, v = f.length; u < v; ++u) n[u] = f.charCodeAt(u);
                  f = n;
                }
                ka(p, k | 146);
                n = la(p, 577);
                ma(n, f, 0, f.length, 0);
                na(n);
                ka(p, k);
              }
            }
            this.handleError(q(this.filename, g));
            this.db = r(g, "i32");
            hb(this.db);
            this.ob = {};
            this.Sa = {};
          }
          var g = y(4), h = l.cwrap, q = h("sqlite3_open", "number", ["string", "number"]), w = h("sqlite3_close_v2", "number", ["number"]), t = h("sqlite3_exec", "number", ["number", "string", "number", "number", "number"]), x = h("sqlite3_changes", "number", ["number"]), D = h(
            "sqlite3_prepare_v2",
            "number",
            ["number", "string", "number", "number", "number"]
          ), ib = h("sqlite3_sql", "string", ["number"]), lc = h("sqlite3_normalized_sql", "string", ["number"]), jb = h("sqlite3_prepare_v2", "number", ["number", "number", "number", "number", "number"]), mc = h("sqlite3_bind_text", "number", ["number", "number", "number", "number", "number"]), kb = h("sqlite3_bind_blob", "number", ["number", "number", "number", "number", "number"]), nc = h("sqlite3_bind_double", "number", ["number", "number", "number"]), oc = h("sqlite3_bind_int", "number", [
            "number",
            "number",
            "number"
          ]), pc = h("sqlite3_bind_parameter_index", "number", ["number", "string"]), qc = h("sqlite3_step", "number", ["number"]), rc = h("sqlite3_errmsg", "string", ["number"]), sc = h("sqlite3_column_count", "number", ["number"]), tc = h("sqlite3_data_count", "number", ["number"]), uc = h("sqlite3_column_double", "number", ["number", "number"]), lb = h("sqlite3_column_text", "string", ["number", "number"]), vc = h("sqlite3_column_blob", "number", ["number", "number"]), wc = h("sqlite3_column_bytes", "number", ["number", "number"]), xc = h(
            "sqlite3_column_type",
            "number",
            ["number", "number"]
          ), yc = h("sqlite3_column_name", "string", ["number", "number"]), zc = h("sqlite3_reset", "number", ["number"]), Ac = h("sqlite3_clear_bindings", "number", ["number"]), Bc = h("sqlite3_finalize", "number", ["number"]), mb = h("sqlite3_create_function_v2", "number", "number string number number number number number number number".split(" ")), fc = h("sqlite3_value_type", "number", ["number"]), ic = h("sqlite3_value_bytes", "number", ["number"]), hc = h("sqlite3_value_text", "string", ["number"]), jc = h(
            "sqlite3_value_blob",
            "number",
            ["number"]
          ), gc = h("sqlite3_value_double", "number", ["number"]), cc = h("sqlite3_result_double", "", ["number", "number"]), eb = h("sqlite3_result_null", "", ["number"]), dc = h("sqlite3_result_text", "", ["number", "string", "number", "number"]), ec = h("sqlite3_result_blob", "", ["number", "number", "number", "number"]), bc = h("sqlite3_result_int", "", ["number", "number"]), ra = h("sqlite3_result_error", "", ["number", "string", "number"]), nb = h("sqlite3_aggregate_context", "number", ["number", "number"]), hb = h(
            "RegisterExtensionFunctions",
            "number",
            ["number"]
          ), ob = h("sqlite3_update_hook", "number", ["number", "number", "number"]);
          c.prototype.bind = function(f) {
            if (!this.Qa) throw "Statement closed";
            this.reset();
            return Array.isArray(f) ? this.Qb(f) : null != f && "object" === typeof f ? this.Rb(f) : true;
          };
          c.prototype.step = function() {
            if (!this.Qa) throw "Statement closed";
            this.Oa = 1;
            var f = qc(this.Qa);
            switch (f) {
              case 100:
                return true;
              case 101:
                return false;
              default:
                throw this.db.handleError(f);
            }
          };
          c.prototype.Jb = function(f) {
            null == f && (f = this.Oa, this.Oa += 1);
            return uc(this.Qa, f);
          };
          c.prototype.Xb = function(f) {
            null == f && (f = this.Oa, this.Oa += 1);
            f = lb(this.Qa, f);
            if ("function" !== typeof BigInt) throw Error("BigInt is not supported");
            return BigInt(f);
          };
          c.prototype.Yb = function(f) {
            null == f && (f = this.Oa, this.Oa += 1);
            return lb(this.Qa, f);
          };
          c.prototype.getBlob = function(f) {
            null == f && (f = this.Oa, this.Oa += 1);
            var k = wc(this.Qa, f);
            f = vc(this.Qa, f);
            for (var n = new Uint8Array(k), p = 0; p < k; p += 1) n[p] = m[f + p];
            return n;
          };
          c.prototype.get = function(f, k) {
            k = k || {};
            null != f && this.bind(f) && this.step();
            f = [];
            for (var n = tc(this.Qa), p = 0; p < n; p += 1) switch (xc(this.Qa, p)) {
              case 1:
                var u = k.useBigInt ? this.Xb(p) : this.Jb(p);
                f.push(u);
                break;
              case 2:
                f.push(this.Jb(p));
                break;
              case 3:
                f.push(this.Yb(p));
                break;
              case 4:
                f.push(this.getBlob(p));
                break;
              default:
                f.push(null);
            }
            return f;
          };
          c.prototype.getColumnNames = function() {
            for (var f = [], k = sc(this.Qa), n = 0; n < k; n += 1) f.push(yc(this.Qa, n));
            return f;
          };
          c.prototype.getAsObject = function(f, k) {
            f = this.get(f, k);
            k = this.getColumnNames();
            for (var n = {}, p = 0; p < k.length; p += 1) n[k[p]] = f[p];
            return n;
          };
          c.prototype.getSQL = function() {
            return ib(this.Qa);
          };
          c.prototype.getNormalizedSQL = function() {
            return lc(this.Qa);
          };
          c.prototype.run = function(f) {
            null != f && this.bind(f);
            this.step();
            return this.reset();
          };
          c.prototype.Gb = function(f, k) {
            null == k && (k = this.Oa, this.Oa += 1);
            f = ea(f);
            this.xb.push(f);
            this.db.handleError(mc(this.Qa, k, f, -1, 0));
          };
          c.prototype.Pb = function(f, k) {
            null == k && (k = this.Oa, this.Oa += 1);
            var n = ca(f.length);
            m.set(f, n);
            this.xb.push(n);
            this.db.handleError(kb(this.Qa, k, n, f.length, 0));
          };
          c.prototype.Fb = function(f, k) {
            null == k && (k = this.Oa, this.Oa += 1);
            this.db.handleError((f === (f | 0) ? oc : nc)(this.Qa, k, f));
          };
          c.prototype.Sb = function(f) {
            null == f && (f = this.Oa, this.Oa += 1);
            kb(this.Qa, f, 0, 0, 0);
          };
          c.prototype.Hb = function(f, k) {
            null == k && (k = this.Oa, this.Oa += 1);
            switch (typeof f) {
              case "string":
                this.Gb(f, k);
                return;
              case "number":
                this.Fb(f, k);
                return;
              case "bigint":
                this.Gb(f.toString(), k);
                return;
              case "boolean":
                this.Fb(f + 0, k);
                return;
              case "object":
                if (null === f) {
                  this.Sb(k);
                  return;
                }
                if (null != f.length) {
                  this.Pb(f, k);
                  return;
                }
            }
            throw "Wrong API use : tried to bind a value of an unknown type (" + f + ").";
          };
          c.prototype.Rb = function(f) {
            var k = this;
            Object.keys(f).forEach(function(n) {
              var p = pc(k.Qa, n);
              0 !== p && k.Hb(f[n], p);
            });
            return true;
          };
          c.prototype.Qb = function(f) {
            for (var k = 0; k < f.length; k += 1) this.Hb(f[k], k + 1);
            return true;
          };
          c.prototype.reset = function() {
            this.freemem();
            return 0 === Ac(this.Qa) && 0 === zc(this.Qa);
          };
          c.prototype.freemem = function() {
            for (var f; void 0 !== (f = this.xb.pop()); ) da(f);
          };
          c.prototype.free = function() {
            this.freemem();
            var f = 0 === Bc(this.Qa);
            delete this.db.ob[this.Qa];
            this.Qa = 0;
            return f;
          };
          d.prototype.next = function() {
            if (null === this.nb) return { done: true };
            null !== this.fb && (this.fb.free(), this.fb = null);
            if (!this.db.db) throw this.zb(), Error("Database closed");
            var f = oa(), k = y(4);
            pa(g);
            pa(k);
            try {
              this.db.handleError(jb(this.db.db, this.tb, -1, g, k));
              this.tb = r(k, "i32");
              var n = r(g, "i32");
              if (0 === n) return this.zb(), { done: true };
              this.fb = new c(n, this.db);
              this.db.ob[n] = this.fb;
              return { value: this.fb, done: false };
            } catch (p) {
              throw this.Cb = z(this.tb), this.zb(), p;
            } finally {
              qa(f);
            }
          };
          d.prototype.zb = function() {
            da(this.nb);
            this.nb = null;
          };
          d.prototype.getRemainingSQL = function() {
            return null !== this.Cb ? this.Cb : z(this.tb);
          };
          "function" === typeof Symbol && "symbol" === typeof Symbol.iterator && (d.prototype[Symbol.iterator] = function() {
            return this;
          });
          e.prototype.run = function(f, k) {
            if (!this.db) throw "Database closed";
            if (k) {
              f = this.prepare(f, k);
              try {
                f.step();
              } finally {
                f.free();
              }
            } else this.handleError(t(this.db, f, 0, 0, g));
            return this;
          };
          e.prototype.exec = function(f, k, n) {
            if (!this.db) throw "Database closed";
            var p = k = null, u = null;
            try {
              u = p = ea(f);
              var v = y(4);
              for (f = []; 0 !== r(u, "i8"); ) {
                pa(g);
                pa(v);
                this.handleError(jb(
                  this.db,
                  u,
                  -1,
                  g,
                  v
                ));
                var K = r(g, "i32");
                u = r(v, "i32");
                if (0 !== K) {
                  var G = null;
                  for (k = new c(K, this); k.step(); ) null === G && (G = { lc: k.getColumnNames(), values: [] }, f.push(G)), G.values.push(k.get(null, n));
                  k.free();
                }
              }
              return f;
            } catch (L) {
              throw k && k.free(), L;
            } finally {
              p && da(p);
            }
          };
          e.prototype.each = function(f, k, n, p, u) {
            "function" === typeof k && (p = n, n = k, k = void 0);
            f = this.prepare(f, k);
            try {
              for (; f.step(); ) n(f.getAsObject(null, u));
            } finally {
              f.free();
            }
            if ("function" === typeof p) return p();
          };
          e.prototype.prepare = function(f) {
            pa(g);
            this.handleError(D(
              this.db,
              f,
              -1,
              g,
              0
            ));
            f = r(g, "i32");
            if (0 === f) throw "Nothing to prepare";
            var k = new c(f, this);
            return this.ob[f] = k;
          };
          e.prototype.iterateStatements = function(f) {
            return new d(f, this);
          };
          e.prototype["export"] = function() {
            Object.values(this.ob).forEach(function(k) {
              k.free();
            });
            Object.values(this.Sa).forEach(A);
            this.Sa = {};
            this.handleError(w(this.db));
            var f = sa(this.filename);
            this.handleError(q(this.filename, g));
            this.db = r(g, "i32");
            hb(this.db);
            return f;
          };
          e.prototype.close = function() {
            null !== this.db && (Object.values(this.ob).forEach(function(f) {
              f.free();
            }), Object.values(this.Sa).forEach(A), this.Sa = {}, this.eb && (A(this.eb), this.eb = void 0), this.handleError(w(this.db)), ta("/" + this.filename), this.db = null);
          };
          e.prototype.handleError = function(f) {
            if (0 === f) return null;
            f = rc(this.db);
            throw Error(f);
          };
          e.prototype.getRowsModified = function() {
            return x(this.db);
          };
          e.prototype.create_function = function(f, k) {
            Object.prototype.hasOwnProperty.call(this.Sa, f) && (A(this.Sa[f]), delete this.Sa[f]);
            var n = ua(function(p, u, v) {
              u = b(u, v);
              try {
                var K = k.apply(null, u);
              } catch (G) {
                ra(p, G, -1);
                return;
              }
              a(
                p,
                K
              );
            }, "viii");
            this.Sa[f] = n;
            this.handleError(mb(this.db, f, k.length, 1, 0, n, 0, 0, 0));
            return this;
          };
          e.prototype.create_aggregate = function(f, k) {
            var n = k.init || function() {
              return null;
            }, p = k.finalize || function(L) {
              return L;
            }, u = k.step;
            if (!u) throw "An aggregate function must have a step function in " + f;
            var v = {};
            Object.hasOwnProperty.call(this.Sa, f) && (A(this.Sa[f]), delete this.Sa[f]);
            k = f + "__finalize";
            Object.hasOwnProperty.call(this.Sa, k) && (A(this.Sa[k]), delete this.Sa[k]);
            var K = ua(function(L, P, Ka) {
              var V = nb(L, 1);
              Object.hasOwnProperty.call(
                v,
                V
              ) || (v[V] = n());
              P = b(P, Ka);
              P = [v[V]].concat(P);
              try {
                v[V] = u.apply(null, P);
              } catch (Dc) {
                delete v[V], ra(L, Dc, -1);
              }
            }, "viii"), G = ua(function(L) {
              var P = nb(L, 1);
              try {
                var Ka = p(v[P]);
              } catch (V) {
                delete v[P];
                ra(L, V, -1);
                return;
              }
              a(L, Ka);
              delete v[P];
            }, "vi");
            this.Sa[f] = K;
            this.Sa[k] = G;
            this.handleError(mb(this.db, f, u.length - 1, 1, 0, 0, K, G, 0));
            return this;
          };
          e.prototype.updateHook = function(f) {
            this.eb && (ob(this.db, 0, 0), A(this.eb), this.eb = void 0);
            if (!f) return this;
            this.eb = ua(function(k, n, p, u, v) {
              switch (n) {
                case 18:
                  k = "insert";
                  break;
                case 23:
                  k = "update";
                  break;
                case 9:
                  k = "delete";
                  break;
                default:
                  throw "unknown operationCode in updateHook callback: " + n;
              }
              p = z(p);
              u = z(u);
              if (v > Number.MAX_SAFE_INTEGER) throw "rowId too big to fit inside a Number";
              f(k, p, u, Number(v));
            }, "viiiij");
            ob(this.db, this.eb, 0);
            return this;
          };
          l.Database = e;
        };
        var va = "./this.program", wa = (_b2 = (_a2 = globalThis.document) == null ? void 0 : _a2.currentScript) == null ? void 0 : _b2.src;
        ba && (wa = self.location.href);
        var xa = "", ya, za;
        if (aa || ba) {
          try {
            xa = new URL(".", wa).href;
          } catch {
          }
          ba && (za = (a) => {
            var b = new XMLHttpRequest();
            b.open("GET", a, false);
            b.responseType = "arraybuffer";
            b.send(null);
            return new Uint8Array(b.response);
          });
          ya = async (a) => {
            a = await fetch(a, { credentials: "same-origin" });
            if (a.ok) return a.arrayBuffer();
            throw Error(a.status + " : " + a.url);
          };
        }
        var Aa = console.log.bind(console), B = console.error.bind(console), Ba, Ca = false, Da, m, C, Ea, E, F, Fa, Ga, H;
        function Ha() {
          var a = Ia.buffer;
          m = new Int8Array(a);
          Ea = new Int16Array(a);
          C = new Uint8Array(a);
          E = new Int32Array(a);
          F = new Uint32Array(a);
          Fa = new Float32Array(a);
          Ga = new Float64Array(a);
          H = new BigInt64Array(a);
          new BigUint64Array(a);
        }
        function Ja(a) {
          var _a3;
          (_a3 = l.onAbort) == null ? void 0 : _a3.call(l, a);
          a = "Aborted(" + a + ")";
          B(a);
          Ca = true;
          throw new WebAssembly.RuntimeError(a + ". Build with -sASSERTIONS for more info.");
        }
        var La;
        async function Ma(a) {
          if (!Ba) try {
            var b = await ya(a);
            return new Uint8Array(b);
          } catch {
          }
          if (a == La && Ba) a = new Uint8Array(Ba);
          else if (za) a = za(a);
          else throw "both async and sync fetching of the wasm failed";
          return a;
        }
        async function Na(a, b) {
          try {
            var c = await Ma(a);
            return await WebAssembly.instantiate(c, b);
          } catch (d) {
            B(`failed to asynchronously prepare wasm: ${d}`), Ja(d);
          }
        }
        async function Oa(a) {
          var b = La;
          if (!Ba) try {
            var c = fetch(b, { credentials: "same-origin" });
            return await WebAssembly.instantiateStreaming(c, a);
          } catch (d) {
            B(`wasm streaming compile failed: ${d}`), B("falling back to ArrayBuffer instantiation");
          }
          return Na(b, a);
        }
        class Pa {
          constructor(a) {
            __publicField(this, "name", "ExitStatus");
            this.message = `Program terminated with exit(${a})`;
            this.status = a;
          }
        }
        var Qa = (a) => {
          for (; 0 < a.length; ) a.shift()(l);
        }, Ra = [], Sa = [], Ta = () => {
          var a = l.preRun.shift();
          Sa.push(a);
        }, I = 0, Ua = null;
        function r(a, b = "i8") {
          b.endsWith("*") && (b = "*");
          switch (b) {
            case "i1":
              return m[a];
            case "i8":
              return m[a];
            case "i16":
              return Ea[a >> 1];
            case "i32":
              return E[a >> 2];
            case "i64":
              return H[a >> 3];
            case "float":
              return Fa[a >> 2];
            case "double":
              return Ga[a >> 3];
            case "*":
              return F[a >> 2];
            default:
              Ja(`invalid type for getValue: ${b}`);
          }
        }
        var Va = true;
        function pa(a) {
          var b = "i32";
          b.endsWith("*") && (b = "*");
          switch (b) {
            case "i1":
              m[a] = 0;
              break;
            case "i8":
              m[a] = 0;
              break;
            case "i16":
              Ea[a >> 1] = 0;
              break;
            case "i32":
              E[a >> 2] = 0;
              break;
            case "i64":
              H[a >> 3] = BigInt(0);
              break;
            case "float":
              Fa[a >> 2] = 0;
              break;
            case "double":
              Ga[a >> 3] = 0;
              break;
            case "*":
              F[a >> 2] = 0;
              break;
            default:
              Ja(`invalid type for setValue: ${b}`);
          }
        }
        var Wa = new TextDecoder(), Xa = (a, b, c, d) => {
          c = b + c;
          if (d) return c;
          for (; a[b] && !(b >= c); ) ++b;
          return b;
        }, z = (a, b, c) => a ? Wa.decode(C.subarray(a, Xa(C, a, b, c))) : "", Ya = (a, b) => {
          for (var c = 0, d = a.length - 1; 0 <= d; d--) {
            var e = a[d];
            "." === e ? a.splice(d, 1) : ".." === e ? (a.splice(d, 1), c++) : c && (a.splice(d, 1), c--);
          }
          if (b) for (; c; c--) a.unshift("..");
          return a;
        }, ha = (a) => {
          var b = "/" === a.charAt(0), c = "/" === a.slice(-1);
          (a = Ya(a.split("/").filter((d) => !!d), !b).join("/")) || b || (a = ".");
          a && c && (a += "/");
          return (b ? "/" : "") + a;
        }, Za = (a) => {
          var b = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/.exec(a).slice(1);
          a = b[0];
          b = b[1];
          if (!a && !b) return ".";
          b && (b = b.slice(0, -1));
          return a + b;
        }, $a = (a) => a && a.match(/([^\/]+|\/)\/*$/)[1], ab = () => (a) => crypto.getRandomValues(a), bb = (a) => {
          (bb = ab())(a);
        }, cb = (...a) => {
          for (var b = "", c = false, d = a.length - 1; -1 <= d && !c; d--) {
            c = 0 <= d ? a[d] : "/";
            if ("string" != typeof c) throw new TypeError("Arguments to path.resolve must be strings");
            if (!c) return "";
            b = c + "/" + b;
            c = "/" === c.charAt(0);
          }
          b = Ya(b.split("/").filter((e) => !!e), !c).join("/");
          return (c ? "/" : "") + b || ".";
        }, db = (a) => {
          var b = Xa(a, 0);
          return Wa.decode(a.buffer ? a.subarray(0, b) : new Uint8Array(a.slice(0, b)));
        }, fb = [], gb = (a) => {
          for (var b = 0, c = 0; c < a.length; ++c) {
            var d = a.charCodeAt(c);
            127 >= d ? b++ : 2047 >= d ? b += 2 : 55296 <= d && 57343 >= d ? (b += 4, ++c) : b += 3;
          }
          return b;
        }, J = (a, b, c, d) => {
          if (!(0 < d)) return 0;
          var e = c;
          d = c + d - 1;
          for (var g = 0; g < a.length; ++g) {
            var h = a.codePointAt(g);
            if (127 >= h) {
              if (c >= d) break;
              b[c++] = h;
            } else if (2047 >= h) {
              if (c + 1 >= d) break;
              b[c++] = 192 | h >> 6;
              b[c++] = 128 | h & 63;
            } else if (65535 >= h) {
              if (c + 2 >= d) break;
              b[c++] = 224 | h >> 12;
              b[c++] = 128 | h >> 6 & 63;
              b[c++] = 128 | h & 63;
            } else {
              if (c + 3 >= d) break;
              b[c++] = 240 | h >> 18;
              b[c++] = 128 | h >> 12 & 63;
              b[c++] = 128 | h >> 6 & 63;
              b[c++] = 128 | h & 63;
              g++;
            }
          }
          b[c] = 0;
          return c - e;
        }, pb = [];
        function qb(a, b) {
          pb[a] = { input: [], output: [], jb: b };
          rb(a, sb);
        }
        var sb = { open(a) {
          var b = pb[a.node.mb];
          if (!b) throw new M(43);
          a.Va = b;
          a.seekable = false;
        }, close(a) {
          a.Va.jb.kb(a.Va);
        }, kb(a) {
          a.Va.jb.kb(a.Va);
        }, read(a, b, c, d) {
          if (!a.Va || !a.Va.jb.Kb) throw new M(60);
          for (var e = 0, g = 0; g < d; g++) {
            try {
              var h = a.Va.jb.Kb(a.Va);
            } catch (q) {
              throw new M(29);
            }
            if (void 0 === h && 0 === e) throw new M(6);
            if (null === h || void 0 === h) break;
            e++;
            b[c + g] = h;
          }
          e && (a.node.$a = Date.now());
          return e;
        }, write(a, b, c, d) {
          if (!a.Va || !a.Va.jb.Db) throw new M(60);
          try {
            for (var e = 0; e < d; e++) a.Va.jb.Db(a.Va, b[c + e]);
          } catch (g) {
            throw new M(29);
          }
          d && (a.node.Ua = a.node.Ta = Date.now());
          return e;
        } }, tb = { Kb() {
          var _a3;
          a: {
            if (!fb.length) {
              var a = null;
              ((_a3 = globalThis.window) == null ? void 0 : _a3.prompt) && (a = window.prompt("Input: "), null !== a && (a += "\n"));
              if (!a) {
                var b = null;
                break a;
              }
              b = Array(gb(a) + 1);
              a = J(a, b, 0, b.length);
              b.length = a;
              fb = b;
            }
            b = fb.shift();
          }
          return b;
        }, Db(a, b) {
          null === b || 10 === b ? (Aa(db(a.output)), a.output = []) : 0 != b && a.output.push(b);
        }, kb(a) {
          var _a3;
          0 < ((_a3 = a.output) == null ? void 0 : _a3.length) && (Aa(db(a.output)), a.output = []);
        }, oc() {
          return { ic: 25856, kc: 5, hc: 191, jc: 35387, fc: [
            3,
            28,
            127,
            21,
            4,
            0,
            1,
            0,
            17,
            19,
            26,
            0,
            18,
            15,
            23,
            22,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0
          ] };
        }, pc() {
          return 0;
        }, qc() {
          return [24, 80];
        } }, ub = { Db(a, b) {
          null === b || 10 === b ? (B(db(a.output)), a.output = []) : 0 != b && a.output.push(b);
        }, kb(a) {
          var _a3;
          0 < ((_a3 = a.output) == null ? void 0 : _a3.length) && (B(db(a.output)), a.output = []);
        } }, N = { Za: null, ab() {
          return N.createNode(null, "/", 16895, 0);
        }, createNode(a, b, c, d) {
          if (24576 === (c & 61440) || 4096 === (c & 61440)) throw new M(63);
          N.Za || (N.Za = { dir: { node: { Wa: N.La.Wa, Xa: N.La.Xa, lb: N.La.lb, qb: N.La.qb, Nb: N.La.Nb, wb: N.La.wb, ub: N.La.ub, Eb: N.La.Eb, vb: N.La.vb }, stream: { Ya: N.Ma.Ya } }, file: {
            node: { Wa: N.La.Wa, Xa: N.La.Xa },
            stream: { Ya: N.Ma.Ya, read: N.Ma.read, write: N.Ma.write, rb: N.Ma.rb, sb: N.Ma.sb }
          }, link: { node: { Wa: N.La.Wa, Xa: N.La.Xa, cb: N.La.cb }, stream: {} }, Ib: { node: { Wa: N.La.Wa, Xa: N.La.Xa }, stream: vb } });
          c = wb(a, b, c, d);
          O(c.mode) ? (c.La = N.Za.dir.node, c.Ma = N.Za.dir.stream, c.Na = {}) : 32768 === (c.mode & 61440) ? (c.La = N.Za.file.node, c.Ma = N.Za.file.stream, c.Ra = 0, c.Na = null) : 40960 === (c.mode & 61440) ? (c.La = N.Za.link.node, c.Ma = N.Za.link.stream) : 8192 === (c.mode & 61440) && (c.La = N.Za.Ib.node, c.Ma = N.Za.Ib.stream);
          c.$a = c.Ua = c.Ta = Date.now();
          a && (a.Na[b] = c, a.$a = a.Ua = a.Ta = c.$a);
          return c;
        }, nc(a) {
          return a.Na ? a.Na.subarray ? a.Na.subarray(0, a.Ra) : new Uint8Array(a.Na) : new Uint8Array(0);
        }, La: { Wa(a) {
          var b = {};
          b.Vb = 8192 === (a.mode & 61440) ? a.id : 1;
          b.$b = a.id;
          b.mode = a.mode;
          b.bc = 1;
          b.uid = 0;
          b.Zb = 0;
          b.mb = a.mb;
          O(a.mode) ? b.size = 4096 : 32768 === (a.mode & 61440) ? b.size = a.Ra : 40960 === (a.mode & 61440) ? b.size = a.link.length : b.size = 0;
          b.$a = new Date(a.$a);
          b.Ua = new Date(a.Ua);
          b.Ta = new Date(a.Ta);
          b.Tb = 4096;
          b.Ub = Math.ceil(b.size / b.Tb);
          return b;
        }, Xa(a, b) {
          for (var c of ["mode", "atime", "mtime", "ctime"]) null != b[c] && (a[c] = b[c]);
          void 0 !== b.size && (b = b.size, a.Ra != b && (0 == b ? (a.Na = null, a.Ra = 0) : (c = a.Na, a.Na = new Uint8Array(b), c && a.Na.set(c.subarray(0, Math.min(b, a.Ra))), a.Ra = b)));
        }, lb() {
          N.yb || (N.yb = new M(44), N.yb.stack = "<generic error, no stack>");
          throw N.yb;
        }, qb(a, b, c, d) {
          return N.createNode(a, b, c, d);
        }, Nb(a, b, c) {
          try {
            var d = Q(b, c);
          } catch (g) {
          }
          if (d) {
            if (O(a.mode)) for (var e in d.Na) throw new M(55);
            xb(d);
          }
          delete a.parent.Na[a.name];
          b.Na[c] = a;
          a.name = c;
          b.Ta = b.Ua = a.parent.Ta = a.parent.Ua = Date.now();
        }, wb(a, b) {
          delete a.Na[b];
          a.Ta = a.Ua = Date.now();
        }, ub(a, b) {
          var c = Q(a, b), d;
          for (d in c.Na) throw new M(55);
          delete a.Na[b];
          a.Ta = a.Ua = Date.now();
        }, Eb(a) {
          return [".", "..", ...Object.keys(a.Na)];
        }, vb(a, b, c) {
          a = N.createNode(a, b, 41471, 0);
          a.link = c;
          return a;
        }, cb(a) {
          if (40960 !== (a.mode & 61440)) throw new M(28);
          return a.link;
        } }, Ma: { read(a, b, c, d, e) {
          var g = a.node.Na;
          if (e >= a.node.Ra) return 0;
          a = Math.min(a.node.Ra - e, d);
          if (8 < a && g.subarray) b.set(g.subarray(e, e + a), c);
          else for (d = 0; d < a; d++) b[c + d] = g[e + d];
          return a;
        }, write(a, b, c, d, e, g) {
          b.buffer === m.buffer && (g = false);
          if (!d) return 0;
          a = a.node;
          a.Ua = a.Ta = Date.now();
          if (b.subarray && (!a.Na || a.Na.subarray)) {
            if (g) return a.Na = b.subarray(c, c + d), a.Ra = d;
            if (0 === a.Ra && 0 === e) return a.Na = b.slice(c, c + d), a.Ra = d;
            if (e + d <= a.Ra) return a.Na.set(b.subarray(c, c + d), e), d;
          }
          g = e + d;
          var h = a.Na ? a.Na.length : 0;
          h >= g || (g = Math.max(g, h * (1048576 > h ? 2 : 1.125) >>> 0), 0 != h && (g = Math.max(g, 256)), h = a.Na, a.Na = new Uint8Array(g), 0 < a.Ra && a.Na.set(h.subarray(0, a.Ra), 0));
          if (a.Na.subarray && b.subarray) a.Na.set(b.subarray(c, c + d), e);
          else for (g = 0; g < d; g++) a.Na[e + g] = b[c + g];
          a.Ra = Math.max(
            a.Ra,
            e + d
          );
          return d;
        }, Ya(a, b, c) {
          1 === c ? b += a.position : 2 === c && 32768 === (a.node.mode & 61440) && (b += a.node.Ra);
          if (0 > b) throw new M(28);
          return b;
        }, rb(a, b, c, d, e) {
          if (32768 !== (a.node.mode & 61440)) throw new M(43);
          a = a.node.Na;
          if (e & 2 || !a || a.buffer !== m.buffer) {
            e = true;
            d = 65536 * Math.ceil(b / 65536);
            var g = yb(65536, d);
            g && C.fill(0, g, g + d);
            d = g;
            if (!d) throw new M(48);
            if (a) {
              if (0 < c || c + b < a.length) a.subarray ? a = a.subarray(c, c + b) : a = Array.prototype.slice.call(a, c, c + b);
              m.set(a, d);
            }
          } else e = false, d = a.byteOffset;
          return { dc: d, Ob: e };
        }, sb(a, b, c, d) {
          N.Ma.write(
            a,
            b,
            0,
            d,
            c,
            false
          );
          return 0;
        } } }, ia = (a, b) => {
          var c = 0;
          a && (c |= 365);
          b && (c |= 146);
          return c;
        }, zb = null, Ab = {}, Bb = [], Cb = 1, R = null, Db = false, Eb = true, Fb = {}, M = class {
          constructor(a) {
            __publicField(this, "name", "ErrnoError");
            this.Pa = a;
          }
        }, Gb = class {
          constructor() {
            __publicField(this, "pb", {});
            __publicField(this, "node", null);
          }
          get flags() {
            return this.pb.flags;
          }
          set flags(a) {
            this.pb.flags = a;
          }
          get position() {
            return this.pb.position;
          }
          set position(a) {
            this.pb.position = a;
          }
        }, Hb = class {
          constructor(a, b, c, d) {
            __publicField(this, "La", {});
            __publicField(this, "Ma", {});
            __publicField(this, "hb", null);
            a || (a = this);
            this.parent = a;
            this.ab = a.ab;
            this.id = Cb++;
            this.name = b;
            this.mode = c;
            this.mb = d;
            this.$a = this.Ua = this.Ta = Date.now();
          }
          get read() {
            return 365 === (this.mode & 365);
          }
          set read(a) {
            a ? this.mode |= 365 : this.mode &= -366;
          }
          get write() {
            return 146 === (this.mode & 146);
          }
          set write(a) {
            a ? this.mode |= 146 : this.mode &= -147;
          }
        };
        function S(a, b = {}) {
          if (!a) throw new M(44);
          b.Ab ?? (b.Ab = true);
          "/" === a.charAt(0) || (a = "//" + a);
          var c = 0;
          a: for (; 40 > c; c++) {
            a = a.split("/").filter((q) => !!q);
            for (var d = zb, e = "/", g = 0; g < a.length; g++) {
              var h = g === a.length - 1;
              if (h && b.parent) break;
              if ("." !== a[g]) if (".." === a[g]) if (e = Za(e), d === d.parent) {
                a = e + "/" + a.slice(g + 1).join("/");
                c--;
                continue a;
              } else d = d.parent;
              else {
                e = ha(e + "/" + a[g]);
                try {
                  d = Q(d, a[g]);
                } catch (q) {
                  if (44 === (q == null ? void 0 : q.Pa) && h && b.cc) return { path: e };
                  throw q;
                }
                !d.hb || h && !b.Ab || (d = d.hb.root);
                if (40960 === (d.mode & 61440) && (!h || b.gb)) {
                  if (!d.La.cb) throw new M(52);
                  d = d.La.cb(d);
                  "/" === d.charAt(0) || (d = Za(e) + "/" + d);
                  a = d + "/" + a.slice(g + 1).join("/");
                  continue a;
                }
              }
            }
            return { path: e, node: d };
          }
          throw new M(32);
        }
        function fa(a) {
          for (var b; ; ) {
            if (a === a.parent) return a = a.ab.Mb, b ? "/" !== a[a.length - 1] ? `${a}/${b}` : a + b : a;
            b = b ? `${a.name}/${b}` : a.name;
            a = a.parent;
          }
        }
        function Ib(a, b) {
          for (var c = 0, d = 0; d < b.length; d++) c = (c << 5) - c + b.charCodeAt(d) | 0;
          return (a + c >>> 0) % R.length;
        }
        function xb(a) {
          var b = Ib(a.parent.id, a.name);
          if (R[b] === a) R[b] = a.ib;
          else for (b = R[b]; b; ) {
            if (b.ib === a) {
              b.ib = a.ib;
              break;
            }
            b = b.ib;
          }
        }
        function Q(a, b) {
          var c = O(a.mode) ? (c = Jb(a, "x")) ? c : a.La.lb ? 0 : 2 : 54;
          if (c) throw new M(c);
          for (c = R[Ib(a.id, b)]; c; c = c.ib) {
            var d = c.name;
            if (c.parent.id === a.id && d === b) return c;
          }
          return a.La.lb(a, b);
        }
        function wb(a, b, c, d) {
          a = new Hb(a, b, c, d);
          b = Ib(a.parent.id, a.name);
          a.ib = R[b];
          return R[b] = a;
        }
        function O(a) {
          return 16384 === (a & 61440);
        }
        function Kb(a) {
          var b = ["r", "w", "rw"][a & 3];
          a & 512 && (b += "w");
          return b;
        }
        function Jb(a, b) {
          if (Eb) return 0;
          if (!b.includes("r") || a.mode & 292) {
            if (b.includes("w") && !(a.mode & 146) || b.includes("x") && !(a.mode & 73)) return 2;
          } else return 2;
          return 0;
        }
        function Lb(a, b) {
          if (!O(a.mode)) return 54;
          try {
            return Q(a, b), 20;
          } catch (c) {
          }
          return Jb(a, "wx");
        }
        function Mb(a, b, c) {
          try {
            var d = Q(a, b);
          } catch (e) {
            return e.Pa;
          }
          if (a = Jb(a, "wx")) return a;
          if (c) {
            if (!O(d.mode)) return 54;
            if (d === d.parent || "/" === fa(d)) return 10;
          } else if (O(d.mode)) return 31;
          return 0;
        }
        function Nb(a) {
          if (!a) throw new M(63);
          return a;
        }
        function T(a) {
          a = Bb[a];
          if (!a) throw new M(8);
          return a;
        }
        function Ob(a, b = -1) {
          a = Object.assign(new Gb(), a);
          if (-1 == b) a: {
            for (b = 0; 4096 >= b; b++) if (!Bb[b]) break a;
            throw new M(33);
          }
          a.bb = b;
          return Bb[b] = a;
        }
        function Pb(a, b = -1) {
          var _a3, _b3;
          a = Ob(a, b);
          (_b3 = (_a3 = a.Ma) == null ? void 0 : _a3.mc) == null ? void 0 : _b3.call(_a3, a);
          return a;
        }
        function Qb(a, b, c) {
          var d = a == null ? void 0 : a.Ma.Xa;
          a = d ? a : b;
          d ?? (d = b.La.Xa);
          Nb(d);
          d(a, c);
        }
        var vb = { open(a) {
          var _a3, _b3;
          a.Ma = Ab[a.node.mb].Ma;
          (_b3 = (_a3 = a.Ma).open) == null ? void 0 : _b3.call(_a3, a);
        }, Ya() {
          throw new M(70);
        } };
        function rb(a, b) {
          Ab[a] = { Ma: b };
        }
        function Rb(a, b) {
          var c = "/" === b;
          if (c && zb) throw new M(10);
          if (!c && b) {
            var d = S(b, { Ab: false });
            b = d.path;
            d = d.node;
            if (d.hb) throw new M(10);
            if (!O(d.mode)) throw new M(54);
          }
          b = { type: a, rc: {}, Mb: b, ac: [] };
          a = a.ab(b);
          a.ab = b;
          b.root = a;
          c ? zb = a : d && (d.hb = b, d.ab && d.ab.ac.push(b));
        }
        function Sb(a, b, c) {
          var d = S(a, { parent: true }).node;
          a = $a(a);
          if (!a) throw new M(28);
          if ("." === a || ".." === a) throw new M(20);
          var e = Lb(d, a);
          if (e) throw new M(e);
          if (!d.La.qb) throw new M(63);
          return d.La.qb(d, a, b, c);
        }
        function ja(a, b = 438) {
          return Sb(a, b & 4095 | 32768, 0);
        }
        function U(a, b = 511) {
          return Sb(a, b & 1023 | 16384, 0);
        }
        function Tb(a, b, c) {
          "undefined" == typeof c && (c = b, b = 438);
          Sb(a, b | 8192, c);
        }
        function Ub(a, b) {
          if (!cb(a)) throw new M(44);
          var c = S(b, { parent: true }).node;
          if (!c) throw new M(44);
          b = $a(b);
          var d = Lb(c, b);
          if (d) throw new M(d);
          if (!c.La.vb) throw new M(63);
          c.La.vb(c, b, a);
        }
        function Vb(a) {
          var b = S(a, { parent: true }).node;
          a = $a(a);
          var c = Q(b, a), d = Mb(b, a, true);
          if (d) throw new M(d);
          if (!b.La.ub) throw new M(63);
          if (c.hb) throw new M(10);
          b.La.ub(b, a);
          xb(c);
        }
        function ta(a) {
          var b = S(a, { parent: true }).node;
          if (!b) throw new M(44);
          a = $a(a);
          var c = Q(b, a), d = Mb(b, a, false);
          if (d) throw new M(d);
          if (!b.La.wb) throw new M(63);
          if (c.hb) throw new M(10);
          b.La.wb(b, a);
          xb(c);
        }
        function Wb(a, b) {
          a = S(a, { gb: !b }).node;
          return Nb(a.La.Wa)(a);
        }
        function Xb(a, b, c, d) {
          Qb(a, b, { mode: c & 4095 | b.mode & -4096, Ta: Date.now(), Wb: d });
        }
        function ka(a, b) {
          a = "string" == typeof a ? S(a, { gb: true }).node : a;
          Xb(null, a, b);
        }
        function Yb(a, b, c) {
          if (O(b.mode)) throw new M(31);
          if (32768 !== (b.mode & 61440)) throw new M(28);
          var d = Jb(b, "w");
          if (d) throw new M(d);
          Qb(a, b, { size: c, timestamp: Date.now() });
        }
        function la(a, b, c = 438) {
          if ("" === a) throw new M(44);
          if ("string" == typeof b) {
            var d = { r: 0, "r+": 2, w: 577, "w+": 578, a: 1089, "a+": 1090 }[b];
            if ("undefined" == typeof d) throw Error(`Unknown file open mode: ${b}`);
            b = d;
          }
          c = b & 64 ? c & 4095 | 32768 : 0;
          if ("object" == typeof a) d = a;
          else {
            var e = a.endsWith("/");
            a = S(a, { gb: !(b & 131072), cc: true });
            d = a.node;
            a = a.path;
          }
          var g = false;
          if (b & 64) if (d) {
            if (b & 128) throw new M(20);
          } else {
            if (e) throw new M(31);
            d = Sb(a, c | 511, 0);
            g = true;
          }
          if (!d) throw new M(44);
          8192 === (d.mode & 61440) && (b &= -513);
          if (b & 65536 && !O(d.mode)) throw new M(54);
          if (!g && (e = d ? 40960 === (d.mode & 61440) ? 32 : O(d.mode) && ("r" !== Kb(b) || b & 576) ? 31 : Jb(d, Kb(b)) : 44)) throw new M(e);
          b & 512 && !g && (e = d, e = "string" == typeof e ? S(e, { gb: true }).node : e, Yb(null, e, 0));
          b &= -131713;
          e = Ob({ node: d, path: fa(d), flags: b, seekable: true, position: 0, Ma: d.Ma, ec: [], error: false });
          e.Ma.open && e.Ma.open(e);
          g && ka(d, c & 511);
          !l.logReadFiles || b & 1 || a in Fb || (Fb[a] = 1);
          return e;
        }
        function na(a) {
          if (null === a.bb) throw new M(8);
          a.Bb && (a.Bb = null);
          try {
            a.Ma.close && a.Ma.close(a);
          } catch (b) {
            throw b;
          } finally {
            Bb[a.bb] = null;
          }
          a.bb = null;
        }
        function Zb(a, b, c) {
          if (null === a.bb) throw new M(8);
          if (!a.seekable || !a.Ma.Ya) throw new M(70);
          if (0 != c && 1 != c && 2 != c) throw new M(28);
          a.position = a.Ma.Ya(a, b, c);
          a.ec = [];
        }
        function $b(a, b, c, d, e) {
          if (0 > d || 0 > e) throw new M(28);
          if (null === a.bb) throw new M(8);
          if (1 === (a.flags & 2097155)) throw new M(8);
          if (O(a.node.mode)) throw new M(31);
          if (!a.Ma.read) throw new M(28);
          var g = "undefined" != typeof e;
          if (!g) e = a.position;
          else if (!a.seekable) throw new M(70);
          b = a.Ma.read(a, b, c, d, e);
          g || (a.position += b);
          return b;
        }
        function ma(a, b, c, d, e) {
          if (0 > d || 0 > e) throw new M(28);
          if (null === a.bb) throw new M(8);
          if (0 === (a.flags & 2097155)) throw new M(8);
          if (O(a.node.mode)) throw new M(31);
          if (!a.Ma.write) throw new M(28);
          a.seekable && a.flags & 1024 && Zb(a, 0, 2);
          var g = "undefined" != typeof e;
          if (!g) e = a.position;
          else if (!a.seekable) throw new M(70);
          b = a.Ma.write(a, b, c, d, e, void 0);
          g || (a.position += b);
          return b;
        }
        function sa(a) {
          var b = b || 0;
          b = la(a, b);
          a = Wb(a).size;
          var d = new Uint8Array(a);
          $b(b, d, 0, a, 0);
          na(b);
          return d;
        }
        function W(a, b, c) {
          a = ha("/dev/" + a);
          var d = ia(!!b, !!c);
          W.Lb ?? (W.Lb = 64);
          var e = W.Lb++ << 8 | 0;
          rb(e, { open(g) {
            g.seekable = false;
          }, close() {
            var _a3;
            ((_a3 = c == null ? void 0 : c.buffer) == null ? void 0 : _a3.length) && c(10);
          }, read(g, h, q, w) {
            for (var t = 0, x = 0; x < w; x++) {
              try {
                var D = b();
              } catch (ib) {
                throw new M(29);
              }
              if (void 0 === D && 0 === t) throw new M(6);
              if (null === D || void 0 === D) break;
              t++;
              h[q + x] = D;
            }
            t && (g.node.$a = Date.now());
            return t;
          }, write(g, h, q, w) {
            for (var t = 0; t < w; t++) try {
              c(h[q + t]);
            } catch (x) {
              throw new M(29);
            }
            w && (g.node.Ua = g.node.Ta = Date.now());
            return t;
          } });
          Tb(a, d, e);
        }
        var X = {};
        function Y(a, b, c) {
          if ("/" === b.charAt(0)) return b;
          a = -100 === a ? "/" : T(a).path;
          if (0 == b.length) {
            if (!c) throw new M(44);
            return a;
          }
          return a + "/" + b;
        }
        function ac(a, b) {
          F[a >> 2] = b.Vb;
          F[a + 4 >> 2] = b.mode;
          F[a + 8 >> 2] = b.bc;
          F[a + 12 >> 2] = b.uid;
          F[a + 16 >> 2] = b.Zb;
          F[a + 20 >> 2] = b.mb;
          H[a + 24 >> 3] = BigInt(b.size);
          E[a + 32 >> 2] = 4096;
          E[a + 36 >> 2] = b.Ub;
          var c = b.$a.getTime(), d = b.Ua.getTime(), e = b.Ta.getTime();
          H[a + 40 >> 3] = BigInt(Math.floor(c / 1e3));
          F[a + 48 >> 2] = c % 1e3 * 1e6;
          H[a + 56 >> 3] = BigInt(Math.floor(d / 1e3));
          F[a + 64 >> 2] = d % 1e3 * 1e6;
          H[a + 72 >> 3] = BigInt(Math.floor(e / 1e3));
          F[a + 80 >> 2] = e % 1e3 * 1e6;
          H[a + 88 >> 3] = BigInt(b.$b);
          return 0;
        }
        var kc = void 0, Cc = () => {
          var a = E[+kc >> 2];
          kc += 4;
          return a;
        }, Ec = 0, Fc = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335], Gc = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334], Hc = {}, Ic = (a) => {
          if (!(a instanceof Pa || "unwind" == a)) throw a;
        }, Jc = (a) => {
          var _a3;
          Da = a;
          Va || 0 < Ec || ((_a3 = l.onExit) == null ? void 0 : _a3.call(l, a), Ca = true);
          throw new Pa(a);
        }, Kc = (a) => {
          if (!Ca) try {
            a();
          } catch (b) {
            Ic(b);
          } finally {
            if (!(Va || 0 < Ec)) try {
              Da = a = Da, Jc(a);
            } catch (b) {
              Ic(b);
            }
          }
        }, Lc = {}, Nc = () => {
          var _a3;
          if (!Mc) {
            var a = { USER: "web_user", LOGNAME: "web_user", PATH: "/", PWD: "/", HOME: "/home/web_user", LANG: (((_a3 = globalThis.navigator) == null ? void 0 : _a3.language) ?? "C").replace("-", "_") + ".UTF-8", _: va || "./this.program" }, b;
            for (b in Lc) void 0 === Lc[b] ? delete a[b] : a[b] = Lc[b];
            var c = [];
            for (b in a) c.push(`${b}=${a[b]}`);
            Mc = c;
          }
          return Mc;
        }, Mc, Oc = (a, b, c, d) => {
          var e = { string: (t) => {
            var x = 0;
            if (null !== t && void 0 !== t && 0 !== t) {
              x = gb(t) + 1;
              var D = y(x);
              J(t, C, D, x);
              x = D;
            }
            return x;
          }, array: (t) => {
            var x = y(t.length);
            m.set(t, x);
            return x;
          } };
          a = l["_" + a];
          var g = [], h = 0;
          if (d) for (var q = 0; q < d.length; q++) {
            var w = e[c[q]];
            w ? (0 === h && (h = oa()), g[q] = w(d[q])) : g[q] = d[q];
          }
          c = a(...g);
          return c = function(t) {
            0 !== h && qa(h);
            return "string" === b ? z(t) : "boolean" === b ? !!t : t;
          }(c);
        }, ea = (a) => {
          var b = gb(a) + 1, c = ca(b);
          c && J(a, C, c, b);
          return c;
        }, Pc, Qc = [], A = (a) => {
          Pc.delete(Z.get(a));
          Z.set(a, null);
          Qc.push(a);
        }, Rc = (a) => {
          const b = a.length;
          return [b % 128 | 128, b >> 7, ...a];
        }, Sc = { i: 127, p: 127, j: 126, f: 125, d: 124, e: 111 }, Tc = (a) => Rc(Array.from(a, (b) => Sc[b])), ua = (a, b) => {
          if (!Pc) {
            Pc = /* @__PURE__ */ new WeakMap();
            var c = Z.length;
            if (Pc) for (var d = 0; d < 0 + c; d++) {
              var e = Z.get(d);
              e && Pc.set(e, d);
            }
          }
          if (c = Pc.get(a) || 0) return c;
          c = Qc.length ? Qc.pop() : Z.grow(1);
          try {
            Z.set(c, a);
          } catch (g) {
            if (!(g instanceof TypeError)) throw g;
            b = Uint8Array.of(0, 97, 115, 109, 1, 0, 0, 0, 1, ...Rc([1, 96, ...Tc(b.slice(1)), ...Tc("v" === b[0] ? "" : b[0])]), 2, 7, 1, 1, 101, 1, 102, 0, 0, 7, 5, 1, 1, 102, 0, 0);
            b = new WebAssembly.Module(b);
            b = new WebAssembly.Instance(b, { e: { f: a } }).exports.f;
            Z.set(c, b);
          }
          Pc.set(a, c);
          return c;
        };
        R = Array(4096);
        Rb(N, "/");
        U("/tmp");
        U("/home");
        U("/home/web_user");
        (function() {
          U("/dev");
          rb(259, { read: () => 0, write: (d, e, g, h) => h, Ya: () => 0 });
          Tb("/dev/null", 259);
          qb(1280, tb);
          qb(1536, ub);
          Tb("/dev/tty", 1280);
          Tb("/dev/tty1", 1536);
          var a = new Uint8Array(1024), b = 0, c = () => {
            0 === b && (bb(a), b = a.byteLength);
            return a[--b];
          };
          W("random", c);
          W("urandom", c);
          U("/dev/shm");
          U("/dev/shm/tmp");
        })();
        (function() {
          U("/proc");
          var a = U("/proc/self");
          U("/proc/self/fd");
          Rb({ ab() {
            var b = wb(a, "fd", 16895, 73);
            b.Ma = { Ya: N.Ma.Ya };
            b.La = { lb(c, d) {
              c = +d;
              var e = T(c);
              c = { parent: null, ab: { Mb: "fake" }, La: { cb: () => e.path }, id: c + 1 };
              return c.parent = c;
            }, Eb() {
              return Array.from(Bb.entries()).filter(([, c]) => c).map(([c]) => c.toString());
            } };
            return b;
          } }, "/proc/self/fd");
        })();
        l.noExitRuntime && (Va = l.noExitRuntime);
        l.print && (Aa = l.print);
        l.printErr && (B = l.printErr);
        l.wasmBinary && (Ba = l.wasmBinary);
        l.thisProgram && (va = l.thisProgram);
        if (l.preInit) for ("function" == typeof l.preInit && (l.preInit = [l.preInit]); 0 < l.preInit.length; ) l.preInit.shift()();
        l.stackSave = () => oa();
        l.stackRestore = (a) => qa(a);
        l.stackAlloc = (a) => y(a);
        l.cwrap = (a, b, c, d) => {
          var e = !c || c.every((g) => "number" === g || "boolean" === g);
          return "string" !== b && e && !d ? l["_" + a] : (...g) => Oc(a, b, c, g);
        };
        l.addFunction = ua;
        l.removeFunction = A;
        l.UTF8ToString = z;
        l.stringToNewUTF8 = ea;
        l.writeArrayToMemory = (a, b) => {
          m.set(a, b);
        };
        var ca, da, yb, Uc, qa, y, oa, Ia, Z, Vc = {
          a: (a, b, c, d) => Ja(`Assertion failed: ${z(a)}, at: ` + [b ? z(b) : "unknown filename", c, d ? z(d) : "unknown function"]),
          i: function(a, b) {
            try {
              return a = z(a), ka(a, b), 0;
            } catch (c) {
              if ("undefined" == typeof X || "ErrnoError" !== c.name) throw c;
              return -c.Pa;
            }
          },
          L: function(a, b, c) {
            try {
              b = z(b);
              b = Y(a, b);
              if (c & -8) return -28;
              var d = S(b, { gb: true }).node;
              if (!d) return -44;
              a = "";
              c & 4 && (a += "r");
              c & 2 && (a += "w");
              c & 1 && (a += "x");
              return a && Jb(d, a) ? -2 : 0;
            } catch (e) {
              if ("undefined" == typeof X || "ErrnoError" !== e.name) throw e;
              return -e.Pa;
            }
          },
          j: function(a, b) {
            try {
              var c = T(a);
              Xb(c, c.node, b, false);
              return 0;
            } catch (d) {
              if ("undefined" == typeof X || "ErrnoError" !== d.name) throw d;
              return -d.Pa;
            }
          },
          h: function(a) {
            try {
              var b = T(a);
              Qb(b, b.node, { timestamp: Date.now(), Wb: false });
              return 0;
            } catch (c) {
              if ("undefined" == typeof X || "ErrnoError" !== c.name) throw c;
              return -c.Pa;
            }
          },
          b: function(a, b, c) {
            kc = c;
            try {
              var d = T(a);
              switch (b) {
                case 0:
                  var e = Cc();
                  if (0 > e) break;
                  for (; Bb[e]; ) e++;
                  return Pb(d, e).bb;
                case 1:
                case 2:
                  return 0;
                case 3:
                  return d.flags;
                case 4:
                  return e = Cc(), d.flags |= e, 0;
                case 12:
                  return e = Cc(), Ea[e + 0 >> 1] = 2, 0;
                case 13:
                case 14:
                  return 0;
              }
              return -28;
            } catch (g) {
              if ("undefined" == typeof X || "ErrnoError" !== g.name) throw g;
              return -g.Pa;
            }
          },
          g: function(a, b) {
            try {
              var c = T(a), d = c.node, e = c.Ma.Wa;
              a = e ? c : d;
              e ?? (e = d.La.Wa);
              Nb(e);
              var g = e(a);
              return ac(b, g);
            } catch (h) {
              if ("undefined" == typeof X || "ErrnoError" !== h.name) throw h;
              return -h.Pa;
            }
          },
          H: function(a, b) {
            b = -9007199254740992 > b || 9007199254740992 < b ? NaN : Number(b);
            try {
              if (isNaN(b)) return -61;
              var c = T(a);
              if (0 > b || 0 === (c.flags & 2097155)) throw new M(28);
              Yb(c, c.node, b);
              return 0;
            } catch (d) {
              if ("undefined" == typeof X || "ErrnoError" !== d.name) throw d;
              return -d.Pa;
            }
          },
          G: function(a, b) {
            try {
              if (0 === b) return -28;
              var c = gb("/") + 1;
              if (b < c) return -68;
              J("/", C, a, b);
              return c;
            } catch (d) {
              if ("undefined" == typeof X || "ErrnoError" !== d.name) throw d;
              return -d.Pa;
            }
          },
          K: function(a, b) {
            try {
              return a = z(a), ac(b, Wb(a, true));
            } catch (c) {
              if ("undefined" == typeof X || "ErrnoError" !== c.name) throw c;
              return -c.Pa;
            }
          },
          C: function(a, b, c) {
            try {
              return b = z(b), b = Y(a, b), U(b, c), 0;
            } catch (d) {
              if ("undefined" == typeof X || "ErrnoError" !== d.name) throw d;
              return -d.Pa;
            }
          },
          J: function(a, b, c, d) {
            try {
              b = z(b);
              var e = d & 256;
              b = Y(a, b, d & 4096);
              return ac(c, e ? Wb(b, true) : Wb(b));
            } catch (g) {
              if ("undefined" == typeof X || "ErrnoError" !== g.name) throw g;
              return -g.Pa;
            }
          },
          x: function(a, b, c, d) {
            kc = d;
            try {
              b = z(b);
              b = Y(a, b);
              var e = d ? Cc() : 0;
              return la(b, c, e).bb;
            } catch (g) {
              if ("undefined" == typeof X || "ErrnoError" !== g.name) throw g;
              return -g.Pa;
            }
          },
          v: function(a, b, c, d) {
            try {
              b = z(b);
              b = Y(a, b);
              if (0 >= d) return -28;
              var e = S(b).node;
              if (!e) throw new M(44);
              if (!e.La.cb) throw new M(28);
              var g = e.La.cb(e);
              var h = Math.min(d, gb(g)), q = m[c + h];
              J(g, C, c, d + 1);
              m[c + h] = q;
              return h;
            } catch (w) {
              if ("undefined" == typeof X || "ErrnoError" !== w.name) throw w;
              return -w.Pa;
            }
          },
          u: function(a) {
            try {
              return a = z(a), Vb(a), 0;
            } catch (b) {
              if ("undefined" == typeof X || "ErrnoError" !== b.name) throw b;
              return -b.Pa;
            }
          },
          f: function(a, b) {
            try {
              return a = z(a), ac(b, Wb(a));
            } catch (c) {
              if ("undefined" == typeof X || "ErrnoError" !== c.name) throw c;
              return -c.Pa;
            }
          },
          r: function(a, b, c) {
            try {
              b = z(b);
              b = Y(a, b);
              if (c) if (512 === c) Vb(b);
              else return -28;
              else ta(b);
              return 0;
            } catch (d) {
              if ("undefined" == typeof X || "ErrnoError" !== d.name) throw d;
              return -d.Pa;
            }
          },
          q: function(a, b, c) {
            try {
              b = z(b);
              b = Y(a, b, true);
              var d = Date.now(), e, g;
              if (c) {
                var h = F[c >> 2] + 4294967296 * E[c + 4 >> 2], q = E[c + 8 >> 2];
                1073741823 == q ? e = d : 1073741822 == q ? e = null : e = 1e3 * h + q / 1e6;
                c += 16;
                h = F[c >> 2] + 4294967296 * E[c + 4 >> 2];
                q = E[c + 8 >> 2];
                1073741823 == q ? g = d : 1073741822 == q ? g = null : g = 1e3 * h + q / 1e6;
              } else g = e = d;
              if (null !== (g ?? e)) {
                a = e;
                var w = S(b, { gb: true }).node;
                Nb(w.La.Xa)(w, { $a: a, Ua: g });
              }
              return 0;
            } catch (t) {
              if ("undefined" == typeof X || "ErrnoError" !== t.name) throw t;
              return -t.Pa;
            }
          },
          m: () => Ja(""),
          l: () => {
            Va = false;
            Ec = 0;
          },
          A: function(a, b) {
            a = -9007199254740992 > a || 9007199254740992 < a ? NaN : Number(a);
            a = new Date(1e3 * a);
            E[b >> 2] = a.getSeconds();
            E[b + 4 >> 2] = a.getMinutes();
            E[b + 8 >> 2] = a.getHours();
            E[b + 12 >> 2] = a.getDate();
            E[b + 16 >> 2] = a.getMonth();
            E[b + 20 >> 2] = a.getFullYear() - 1900;
            E[b + 24 >> 2] = a.getDay();
            var c = a.getFullYear();
            E[b + 28 >> 2] = (0 !== c % 4 || 0 === c % 100 && 0 !== c % 400 ? Gc : Fc)[a.getMonth()] + a.getDate() - 1 | 0;
            E[b + 36 >> 2] = -(60 * a.getTimezoneOffset());
            c = new Date(a.getFullYear(), 6, 1).getTimezoneOffset();
            var d = new Date(a.getFullYear(), 0, 1).getTimezoneOffset();
            E[b + 32 >> 2] = (c != d && a.getTimezoneOffset() == Math.min(d, c)) | 0;
          },
          y: function(a, b, c, d, e, g, h) {
            e = -9007199254740992 > e || 9007199254740992 < e ? NaN : Number(e);
            try {
              var q = T(d);
              if (0 !== (b & 2) && 0 === (c & 2) && 2 !== (q.flags & 2097155)) throw new M(2);
              if (1 === (q.flags & 2097155)) throw new M(2);
              if (!q.Ma.rb) throw new M(43);
              if (!a) throw new M(28);
              var w = q.Ma.rb(q, a, e, b, c);
              var t = w.dc;
              E[g >> 2] = w.Ob;
              F[h >> 2] = t;
              return 0;
            } catch (x) {
              if ("undefined" == typeof X || "ErrnoError" !== x.name) throw x;
              return -x.Pa;
            }
          },
          z: function(a, b, c, d, e, g) {
            g = -9007199254740992 > g || 9007199254740992 < g ? NaN : Number(g);
            try {
              var h = T(e);
              if (c & 2) {
                if (32768 !== (h.node.mode & 61440)) throw new M(43);
                d & 2 || h.Ma.sb && h.Ma.sb(h, C.slice(a, a + b), g, b, d);
              }
            } catch (q) {
              if ("undefined" == typeof X || "ErrnoError" !== q.name) throw q;
              return -q.Pa;
            }
          },
          n: (a, b) => {
            Hc[a] && (clearTimeout(Hc[a].id), delete Hc[a]);
            if (!b) return 0;
            var c = setTimeout(() => {
              delete Hc[a];
              Kc(() => Uc(a, performance.now()));
            }, b);
            Hc[a] = { id: c, sc: b };
            return 0;
          },
          B: (a, b, c, d) => {
            var e = (/* @__PURE__ */ new Date()).getFullYear(), g = new Date(e, 0, 1).getTimezoneOffset();
            e = new Date(e, 6, 1).getTimezoneOffset();
            F[a >> 2] = 60 * Math.max(g, e);
            E[b >> 2] = Number(g != e);
            b = (h) => {
              var q = Math.abs(h);
              return `UTC${0 <= h ? "-" : "+"}${String(Math.floor(q / 60)).padStart(2, "0")}${String(q % 60).padStart(2, "0")}`;
            };
            a = b(g);
            b = b(e);
            e < g ? (J(a, C, c, 17), J(b, C, d, 17)) : (J(a, C, d, 17), J(b, C, c, 17));
          },
          d: () => Date.now(),
          s: () => 2147483648,
          c: () => performance.now(),
          o: (a) => {
            var b = C.length;
            a >>>= 0;
            if (2147483648 < a) return false;
            for (var c = 1; 4 >= c; c *= 2) {
              var d = b * (1 + 0.2 / c);
              d = Math.min(d, a + 100663296);
              a: {
                d = (Math.min(2147483648, 65536 * Math.ceil(Math.max(a, d) / 65536)) - Ia.buffer.byteLength + 65535) / 65536 | 0;
                try {
                  Ia.grow(d);
                  Ha();
                  var e = 1;
                  break a;
                } catch (g) {
                }
                e = void 0;
              }
              if (e) return true;
            }
            return false;
          },
          E: (a, b) => {
            var c = 0, d = 0, e;
            for (e of Nc()) {
              var g = b + c;
              F[a + d >> 2] = g;
              c += J(e, C, g, Infinity) + 1;
              d += 4;
            }
            return 0;
          },
          F: (a, b) => {
            var c = Nc();
            F[a >> 2] = c.length;
            a = 0;
            for (var d of c) a += gb(d) + 1;
            F[b >> 2] = a;
            return 0;
          },
          e: function(a) {
            try {
              var b = T(a);
              na(b);
              return 0;
            } catch (c) {
              if ("undefined" == typeof X || "ErrnoError" !== c.name) throw c;
              return c.Pa;
            }
          },
          p: function(a, b) {
            try {
              var c = T(a);
              m[b] = c.Va ? 2 : O(c.mode) ? 3 : 40960 === (c.mode & 61440) ? 7 : 4;
              Ea[b + 2 >> 1] = 0;
              H[b + 8 >> 3] = BigInt(0);
              H[b + 16 >> 3] = BigInt(0);
              return 0;
            } catch (d) {
              if ("undefined" == typeof X || "ErrnoError" !== d.name) throw d;
              return d.Pa;
            }
          },
          w: function(a, b, c, d) {
            try {
              a: {
                var e = T(a);
                a = b;
                for (var g, h = b = 0; h < c; h++) {
                  var q = F[a >> 2], w = F[a + 4 >> 2];
                  a += 8;
                  var t = $b(e, m, q, w, g);
                  if (0 > t) {
                    var x = -1;
                    break a;
                  }
                  b += t;
                  if (t < w) break;
                  "undefined" != typeof g && (g += t);
                }
                x = b;
              }
              F[d >> 2] = x;
              return 0;
            } catch (D) {
              if ("undefined" == typeof X || "ErrnoError" !== D.name) throw D;
              return D.Pa;
            }
          },
          D: function(a, b, c, d) {
            b = -9007199254740992 > b || 9007199254740992 < b ? NaN : Number(b);
            try {
              if (isNaN(b)) return 61;
              var e = T(a);
              Zb(e, b, c);
              H[d >> 3] = BigInt(e.position);
              e.Bb && 0 === b && 0 === c && (e.Bb = null);
              return 0;
            } catch (g) {
              if ("undefined" == typeof X || "ErrnoError" !== g.name) throw g;
              return g.Pa;
            }
          },
          I: function(a) {
            var _a3, _b3;
            try {
              var b = T(a);
              return (_b3 = (_a3 = b.Ma) == null ? void 0 : _a3.kb) == null ? void 0 : _b3.call(_a3, b);
            } catch (c) {
              if ("undefined" == typeof X || "ErrnoError" !== c.name) throw c;
              return c.Pa;
            }
          },
          t: function(a, b, c, d) {
            try {
              a: {
                var e = T(a);
                a = b;
                for (var g, h = b = 0; h < c; h++) {
                  var q = F[a >> 2], w = F[a + 4 >> 2];
                  a += 8;
                  var t = ma(e, m, q, w, g);
                  if (0 > t) {
                    var x = -1;
                    break a;
                  }
                  b += t;
                  if (t < w) break;
                  "undefined" != typeof g && (g += t);
                }
                x = b;
              }
              F[d >> 2] = x;
              return 0;
            } catch (D) {
              if ("undefined" == typeof X || "ErrnoError" !== D.name) throw D;
              return D.Pa;
            }
          },
          k: Jc
        };
        function Wc() {
          function a() {
            var _a3;
            l.calledRun = true;
            if (!Ca) {
              if (!l.noFSInit && !Db) {
                var b, c;
                Db = true;
                b ?? (b = l.stdin);
                c ?? (c = l.stdout);
                d ?? (d = l.stderr);
                b ? W("stdin", b) : Ub("/dev/tty", "/dev/stdin");
                c ? W("stdout", null, c) : Ub("/dev/tty", "/dev/stdout");
                d ? W("stderr", null, d) : Ub("/dev/tty1", "/dev/stderr");
                la("/dev/stdin", 0);
                la("/dev/stdout", 1);
                la("/dev/stderr", 1);
              }
              Xc.N();
              Eb = false;
              (_a3 = l.onRuntimeInitialized) == null ? void 0 : _a3.call(l);
              if (l.postRun) for ("function" == typeof l.postRun && (l.postRun = [l.postRun]); l.postRun.length; ) {
                var d = l.postRun.shift();
                Ra.push(d);
              }
              Qa(Ra);
            }
          }
          if (0 < I) Ua = Wc;
          else {
            if (l.preRun) for ("function" == typeof l.preRun && (l.preRun = [l.preRun]); l.preRun.length; ) Ta();
            Qa(Sa);
            0 < I ? Ua = Wc : l.setStatus ? (l.setStatus("Running..."), setTimeout(() => {
              setTimeout(() => l.setStatus(""), 1);
              a();
            }, 1)) : a();
          }
        }
        var Xc;
        (async function() {
          var _a3;
          function a(c) {
            var _a4;
            c = Xc = c.exports;
            l._sqlite3_free = c.P;
            l._sqlite3_value_text = c.Q;
            l._sqlite3_prepare_v2 = c.R;
            l._sqlite3_step = c.S;
            l._sqlite3_reset = c.T;
            l._sqlite3_exec = c.U;
            l._sqlite3_finalize = c.V;
            l._sqlite3_column_name = c.W;
            l._sqlite3_column_text = c.X;
            l._sqlite3_column_type = c.Y;
            l._sqlite3_errmsg = c.Z;
            l._sqlite3_clear_bindings = c._;
            l._sqlite3_value_blob = c.$;
            l._sqlite3_value_bytes = c.aa;
            l._sqlite3_value_double = c.ba;
            l._sqlite3_value_int = c.ca;
            l._sqlite3_value_type = c.da;
            l._sqlite3_result_blob = c.ea;
            l._sqlite3_result_double = c.fa;
            l._sqlite3_result_error = c.ga;
            l._sqlite3_result_int = c.ha;
            l._sqlite3_result_int64 = c.ia;
            l._sqlite3_result_null = c.ja;
            l._sqlite3_result_text = c.ka;
            l._sqlite3_aggregate_context = c.la;
            l._sqlite3_column_count = c.ma;
            l._sqlite3_data_count = c.na;
            l._sqlite3_column_blob = c.oa;
            l._sqlite3_column_bytes = c.pa;
            l._sqlite3_column_double = c.qa;
            l._sqlite3_bind_blob = c.ra;
            l._sqlite3_bind_double = c.sa;
            l._sqlite3_bind_int = c.ta;
            l._sqlite3_bind_text = c.ua;
            l._sqlite3_bind_parameter_index = c.va;
            l._sqlite3_sql = c.wa;
            l._sqlite3_normalized_sql = c.xa;
            l._sqlite3_changes = c.ya;
            l._sqlite3_close_v2 = c.za;
            l._sqlite3_create_function_v2 = c.Aa;
            l._sqlite3_update_hook = c.Ba;
            l._sqlite3_open = c.Ca;
            ca = l._malloc = c.Da;
            da = l._free = c.Ea;
            l._RegisterExtensionFunctions = c.Fa;
            yb = c.Ga;
            Uc = c.Ha;
            qa = c.Ia;
            y = c.Ja;
            oa = c.Ka;
            Ia = c.M;
            Z = c.O;
            Ha();
            I--;
            (_a4 = l.monitorRunDependencies) == null ? void 0 : _a4.call(l, I);
            0 == I && Ua && (c = Ua, Ua = null, c());
            return Xc;
          }
          I++;
          (_a3 = l.monitorRunDependencies) == null ? void 0 : _a3.call(l, I);
          var b = { a: Vc };
          if (l.instantiateWasm) return new Promise((c) => {
            l.instantiateWasm(b, (d, e) => {
              c(a(d));
            });
          });
          La ?? (La = l.locateFile ? l.locateFile("sql-wasm-browser.wasm", xa) : xa + "sql-wasm-browser.wasm");
          return a((await Oa(b)).instance);
        })();
        Wc();
        return Module;
      });
      return initSqlJsPromise;
    };
    {
      module.exports = initSqlJs2;
      module.exports.default = initSqlJs2;
    }
  })(sqlWasmBrowser);
  return sqlWasmBrowser.exports;
}
var sqlWasmBrowserExports = requireSqlWasmBrowser();
const initSqlJs = /* @__PURE__ */ getDefaultExportFromCjs(sqlWasmBrowserExports);
function safe(sql) {
  return { _tag: "SafeSql", sql };
}
function templateToSql(strings, values) {
  let sql = "";
  const params = [];
  for (let i = 0; i < strings.length; i++) {
    sql += strings[i];
    if (i < values.length) {
      const v = values[i];
      if (v !== null && typeof v === "object" && "_tag" in v && v._tag === "SafeSql") {
        sql += v.sql;
      } else {
        sql += "?";
        params.push(v);
      }
    }
  }
  return { sql, params };
}
class SqlJsAdapter {
  constructor(db) {
    this.db = db;
  }
  run(strings, ...values) {
    const { sql, params } = templateToSql(strings, values);
    const stmt = this.db.prepare(sql);
    try {
      if (params.length > 0) stmt.bind(params);
      stmt.step();
    } finally {
      stmt.free();
    }
  }
  get(strings, ...values) {
    const { sql, params } = templateToSql(strings, values);
    const stmt = this.db.prepare(sql);
    try {
      if (params.length > 0) stmt.bind(params);
      if (!stmt.step()) return void 0;
      return stmt.getAsObject();
    } finally {
      stmt.free();
    }
  }
  all(strings, ...values) {
    const { sql, params } = templateToSql(strings, values);
    const stmt = this.db.prepare(sql);
    const rows = [];
    try {
      if (params.length > 0) stmt.bind(params);
      while (stmt.step()) rows.push(stmt.getAsObject());
    } finally {
      stmt.free();
    }
    return rows;
  }
  exec(sql) {
    this.db.run(sql);
  }
  runRaw(sql, params) {
    const stmt = this.db.prepare(sql);
    try {
      if (params.length > 0) stmt.bind(params);
      stmt.step();
    } finally {
      stmt.free();
    }
  }
}
var util;
(function(util2) {
  util2.assertEqual = (_) => {
  };
  function assertIs(_arg) {
  }
  util2.assertIs = assertIs;
  function assertNever(_x) {
    throw new Error();
  }
  util2.assertNever = assertNever;
  util2.arrayToEnum = (items) => {
    const obj = {};
    for (const item of items) {
      obj[item] = item;
    }
    return obj;
  };
  util2.getValidEnumValues = (obj) => {
    const validKeys = util2.objectKeys(obj).filter((k) => typeof obj[obj[k]] !== "number");
    const filtered = {};
    for (const k of validKeys) {
      filtered[k] = obj[k];
    }
    return util2.objectValues(filtered);
  };
  util2.objectValues = (obj) => {
    return util2.objectKeys(obj).map(function(e) {
      return obj[e];
    });
  };
  util2.objectKeys = typeof Object.keys === "function" ? (obj) => Object.keys(obj) : (object) => {
    const keys = [];
    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        keys.push(key);
      }
    }
    return keys;
  };
  util2.find = (arr, checker) => {
    for (const item of arr) {
      if (checker(item))
        return item;
    }
    return void 0;
  };
  util2.isInteger = typeof Number.isInteger === "function" ? (val) => Number.isInteger(val) : (val) => typeof val === "number" && Number.isFinite(val) && Math.floor(val) === val;
  function joinValues(array, separator = " | ") {
    return array.map((val) => typeof val === "string" ? `'${val}'` : val).join(separator);
  }
  util2.joinValues = joinValues;
  util2.jsonStringifyReplacer = (_, value) => {
    if (typeof value === "bigint") {
      return value.toString();
    }
    return value;
  };
})(util || (util = {}));
var objectUtil;
(function(objectUtil2) {
  objectUtil2.mergeShapes = (first, second) => {
    return {
      ...first,
      ...second
      // second overwrites first
    };
  };
})(objectUtil || (objectUtil = {}));
const ZodParsedType = util.arrayToEnum([
  "string",
  "nan",
  "number",
  "integer",
  "float",
  "boolean",
  "date",
  "bigint",
  "symbol",
  "function",
  "undefined",
  "null",
  "array",
  "object",
  "unknown",
  "promise",
  "void",
  "never",
  "map",
  "set"
]);
const getParsedType = (data) => {
  const t = typeof data;
  switch (t) {
    case "undefined":
      return ZodParsedType.undefined;
    case "string":
      return ZodParsedType.string;
    case "number":
      return Number.isNaN(data) ? ZodParsedType.nan : ZodParsedType.number;
    case "boolean":
      return ZodParsedType.boolean;
    case "function":
      return ZodParsedType.function;
    case "bigint":
      return ZodParsedType.bigint;
    case "symbol":
      return ZodParsedType.symbol;
    case "object":
      if (Array.isArray(data)) {
        return ZodParsedType.array;
      }
      if (data === null) {
        return ZodParsedType.null;
      }
      if (data.then && typeof data.then === "function" && data.catch && typeof data.catch === "function") {
        return ZodParsedType.promise;
      }
      if (typeof Map !== "undefined" && data instanceof Map) {
        return ZodParsedType.map;
      }
      if (typeof Set !== "undefined" && data instanceof Set) {
        return ZodParsedType.set;
      }
      if (typeof Date !== "undefined" && data instanceof Date) {
        return ZodParsedType.date;
      }
      return ZodParsedType.object;
    default:
      return ZodParsedType.unknown;
  }
};
const ZodIssueCode = util.arrayToEnum([
  "invalid_type",
  "invalid_literal",
  "custom",
  "invalid_union",
  "invalid_union_discriminator",
  "invalid_enum_value",
  "unrecognized_keys",
  "invalid_arguments",
  "invalid_return_type",
  "invalid_date",
  "invalid_string",
  "too_small",
  "too_big",
  "invalid_intersection_types",
  "not_multiple_of",
  "not_finite"
]);
class ZodError extends Error {
  get errors() {
    return this.issues;
  }
  constructor(issues) {
    super();
    this.issues = [];
    this.addIssue = (sub) => {
      this.issues = [...this.issues, sub];
    };
    this.addIssues = (subs = []) => {
      this.issues = [...this.issues, ...subs];
    };
    const actualProto = new.target.prototype;
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(this, actualProto);
    } else {
      this.__proto__ = actualProto;
    }
    this.name = "ZodError";
    this.issues = issues;
  }
  format(_mapper) {
    const mapper = _mapper || function(issue) {
      return issue.message;
    };
    const fieldErrors = { _errors: [] };
    const processError = (error) => {
      for (const issue of error.issues) {
        if (issue.code === "invalid_union") {
          issue.unionErrors.map(processError);
        } else if (issue.code === "invalid_return_type") {
          processError(issue.returnTypeError);
        } else if (issue.code === "invalid_arguments") {
          processError(issue.argumentsError);
        } else if (issue.path.length === 0) {
          fieldErrors._errors.push(mapper(issue));
        } else {
          let curr = fieldErrors;
          let i = 0;
          while (i < issue.path.length) {
            const el = issue.path[i];
            const terminal = i === issue.path.length - 1;
            if (!terminal) {
              curr[el] = curr[el] || { _errors: [] };
            } else {
              curr[el] = curr[el] || { _errors: [] };
              curr[el]._errors.push(mapper(issue));
            }
            curr = curr[el];
            i++;
          }
        }
      }
    };
    processError(this);
    return fieldErrors;
  }
  static assert(value) {
    if (!(value instanceof ZodError)) {
      throw new Error(`Not a ZodError: ${value}`);
    }
  }
  toString() {
    return this.message;
  }
  get message() {
    return JSON.stringify(this.issues, util.jsonStringifyReplacer, 2);
  }
  get isEmpty() {
    return this.issues.length === 0;
  }
  flatten(mapper = (issue) => issue.message) {
    const fieldErrors = {};
    const formErrors = [];
    for (const sub of this.issues) {
      if (sub.path.length > 0) {
        fieldErrors[sub.path[0]] = fieldErrors[sub.path[0]] || [];
        fieldErrors[sub.path[0]].push(mapper(sub));
      } else {
        formErrors.push(mapper(sub));
      }
    }
    return { formErrors, fieldErrors };
  }
  get formErrors() {
    return this.flatten();
  }
}
ZodError.create = (issues) => {
  const error = new ZodError(issues);
  return error;
};
const errorMap = (issue, _ctx) => {
  let message;
  switch (issue.code) {
    case ZodIssueCode.invalid_type:
      if (issue.received === ZodParsedType.undefined) {
        message = "Required";
      } else {
        message = `Expected ${issue.expected}, received ${issue.received}`;
      }
      break;
    case ZodIssueCode.invalid_literal:
      message = `Invalid literal value, expected ${JSON.stringify(issue.expected, util.jsonStringifyReplacer)}`;
      break;
    case ZodIssueCode.unrecognized_keys:
      message = `Unrecognized key(s) in object: ${util.joinValues(issue.keys, ", ")}`;
      break;
    case ZodIssueCode.invalid_union:
      message = `Invalid input`;
      break;
    case ZodIssueCode.invalid_union_discriminator:
      message = `Invalid discriminator value. Expected ${util.joinValues(issue.options)}`;
      break;
    case ZodIssueCode.invalid_enum_value:
      message = `Invalid enum value. Expected ${util.joinValues(issue.options)}, received '${issue.received}'`;
      break;
    case ZodIssueCode.invalid_arguments:
      message = `Invalid function arguments`;
      break;
    case ZodIssueCode.invalid_return_type:
      message = `Invalid function return type`;
      break;
    case ZodIssueCode.invalid_date:
      message = `Invalid date`;
      break;
    case ZodIssueCode.invalid_string:
      if (typeof issue.validation === "object") {
        if ("includes" in issue.validation) {
          message = `Invalid input: must include "${issue.validation.includes}"`;
          if (typeof issue.validation.position === "number") {
            message = `${message} at one or more positions greater than or equal to ${issue.validation.position}`;
          }
        } else if ("startsWith" in issue.validation) {
          message = `Invalid input: must start with "${issue.validation.startsWith}"`;
        } else if ("endsWith" in issue.validation) {
          message = `Invalid input: must end with "${issue.validation.endsWith}"`;
        } else {
          util.assertNever(issue.validation);
        }
      } else if (issue.validation !== "regex") {
        message = `Invalid ${issue.validation}`;
      } else {
        message = "Invalid";
      }
      break;
    case ZodIssueCode.too_small:
      if (issue.type === "array")
        message = `Array must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `more than`} ${issue.minimum} element(s)`;
      else if (issue.type === "string")
        message = `String must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `over`} ${issue.minimum} character(s)`;
      else if (issue.type === "number")
        message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
      else if (issue.type === "date")
        message = `Date must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${new Date(Number(issue.minimum))}`;
      else
        message = "Invalid input";
      break;
    case ZodIssueCode.too_big:
      if (issue.type === "array")
        message = `Array must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `less than`} ${issue.maximum} element(s)`;
      else if (issue.type === "string")
        message = `String must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `under`} ${issue.maximum} character(s)`;
      else if (issue.type === "number")
        message = `Number must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
      else if (issue.type === "bigint")
        message = `BigInt must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
      else if (issue.type === "date")
        message = `Date must be ${issue.exact ? `exactly` : issue.inclusive ? `smaller than or equal to` : `smaller than`} ${new Date(Number(issue.maximum))}`;
      else
        message = "Invalid input";
      break;
    case ZodIssueCode.custom:
      message = `Invalid input`;
      break;
    case ZodIssueCode.invalid_intersection_types:
      message = `Intersection results could not be merged`;
      break;
    case ZodIssueCode.not_multiple_of:
      message = `Number must be a multiple of ${issue.multipleOf}`;
      break;
    case ZodIssueCode.not_finite:
      message = "Number must be finite";
      break;
    default:
      message = _ctx.defaultError;
      util.assertNever(issue);
  }
  return { message };
};
let overrideErrorMap = errorMap;
function getErrorMap() {
  return overrideErrorMap;
}
const makeIssue = (params) => {
  const { data, path, errorMaps, issueData } = params;
  const fullPath = [...path, ...issueData.path || []];
  const fullIssue = {
    ...issueData,
    path: fullPath
  };
  if (issueData.message !== void 0) {
    return {
      ...issueData,
      path: fullPath,
      message: issueData.message
    };
  }
  let errorMessage = "";
  const maps = errorMaps.filter((m) => !!m).slice().reverse();
  for (const map of maps) {
    errorMessage = map(fullIssue, { data, defaultError: errorMessage }).message;
  }
  return {
    ...issueData,
    path: fullPath,
    message: errorMessage
  };
};
function addIssueToContext(ctx, issueData) {
  const overrideMap = getErrorMap();
  const issue = makeIssue({
    issueData,
    data: ctx.data,
    path: ctx.path,
    errorMaps: [
      ctx.common.contextualErrorMap,
      // contextual error map is first priority
      ctx.schemaErrorMap,
      // then schema-bound map if available
      overrideMap,
      // then global override map
      overrideMap === errorMap ? void 0 : errorMap
      // then global default map
    ].filter((x) => !!x)
  });
  ctx.common.issues.push(issue);
}
class ParseStatus {
  constructor() {
    this.value = "valid";
  }
  dirty() {
    if (this.value === "valid")
      this.value = "dirty";
  }
  abort() {
    if (this.value !== "aborted")
      this.value = "aborted";
  }
  static mergeArray(status, results) {
    const arrayValue = [];
    for (const s of results) {
      if (s.status === "aborted")
        return INVALID;
      if (s.status === "dirty")
        status.dirty();
      arrayValue.push(s.value);
    }
    return { status: status.value, value: arrayValue };
  }
  static async mergeObjectAsync(status, pairs) {
    const syncPairs = [];
    for (const pair of pairs) {
      const key = await pair.key;
      const value = await pair.value;
      syncPairs.push({
        key,
        value
      });
    }
    return ParseStatus.mergeObjectSync(status, syncPairs);
  }
  static mergeObjectSync(status, pairs) {
    const finalObject = {};
    for (const pair of pairs) {
      const { key, value } = pair;
      if (key.status === "aborted")
        return INVALID;
      if (value.status === "aborted")
        return INVALID;
      if (key.status === "dirty")
        status.dirty();
      if (value.status === "dirty")
        status.dirty();
      if (key.value !== "__proto__" && (typeof value.value !== "undefined" || pair.alwaysSet)) {
        finalObject[key.value] = value.value;
      }
    }
    return { status: status.value, value: finalObject };
  }
}
const INVALID = Object.freeze({
  status: "aborted"
});
const DIRTY = (value) => ({ status: "dirty", value });
const OK = (value) => ({ status: "valid", value });
const isAborted = (x) => x.status === "aborted";
const isDirty = (x) => x.status === "dirty";
const isValid = (x) => x.status === "valid";
const isAsync = (x) => typeof Promise !== "undefined" && x instanceof Promise;
var errorUtil;
(function(errorUtil2) {
  errorUtil2.errToObj = (message) => typeof message === "string" ? { message } : message || {};
  errorUtil2.toString = (message) => typeof message === "string" ? message : message == null ? void 0 : message.message;
})(errorUtil || (errorUtil = {}));
class ParseInputLazyPath {
  constructor(parent, value, path, key) {
    this._cachedPath = [];
    this.parent = parent;
    this.data = value;
    this._path = path;
    this._key = key;
  }
  get path() {
    if (!this._cachedPath.length) {
      if (Array.isArray(this._key)) {
        this._cachedPath.push(...this._path, ...this._key);
      } else {
        this._cachedPath.push(...this._path, this._key);
      }
    }
    return this._cachedPath;
  }
}
const handleResult = (ctx, result) => {
  if (isValid(result)) {
    return { success: true, data: result.value };
  } else {
    if (!ctx.common.issues.length) {
      throw new Error("Validation failed but no issues detected.");
    }
    return {
      success: false,
      get error() {
        if (this._error)
          return this._error;
        const error = new ZodError(ctx.common.issues);
        this._error = error;
        return this._error;
      }
    };
  }
};
function processCreateParams(params) {
  if (!params)
    return {};
  const { errorMap: errorMap2, invalid_type_error, required_error, description } = params;
  if (errorMap2 && (invalid_type_error || required_error)) {
    throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  }
  if (errorMap2)
    return { errorMap: errorMap2, description };
  const customMap = (iss, ctx) => {
    const { message } = params;
    if (iss.code === "invalid_enum_value") {
      return { message: message ?? ctx.defaultError };
    }
    if (typeof ctx.data === "undefined") {
      return { message: message ?? required_error ?? ctx.defaultError };
    }
    if (iss.code !== "invalid_type")
      return { message: ctx.defaultError };
    return { message: message ?? invalid_type_error ?? ctx.defaultError };
  };
  return { errorMap: customMap, description };
}
class ZodType {
  get description() {
    return this._def.description;
  }
  _getType(input) {
    return getParsedType(input.data);
  }
  _getOrReturnCtx(input, ctx) {
    return ctx || {
      common: input.parent.common,
      data: input.data,
      parsedType: getParsedType(input.data),
      schemaErrorMap: this._def.errorMap,
      path: input.path,
      parent: input.parent
    };
  }
  _processInputParams(input) {
    return {
      status: new ParseStatus(),
      ctx: {
        common: input.parent.common,
        data: input.data,
        parsedType: getParsedType(input.data),
        schemaErrorMap: this._def.errorMap,
        path: input.path,
        parent: input.parent
      }
    };
  }
  _parseSync(input) {
    const result = this._parse(input);
    if (isAsync(result)) {
      throw new Error("Synchronous parse encountered promise.");
    }
    return result;
  }
  _parseAsync(input) {
    const result = this._parse(input);
    return Promise.resolve(result);
  }
  parse(data, params) {
    const result = this.safeParse(data, params);
    if (result.success)
      return result.data;
    throw result.error;
  }
  safeParse(data, params) {
    const ctx = {
      common: {
        issues: [],
        async: (params == null ? void 0 : params.async) ?? false,
        contextualErrorMap: params == null ? void 0 : params.errorMap
      },
      path: (params == null ? void 0 : params.path) || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    const result = this._parseSync({ data, path: ctx.path, parent: ctx });
    return handleResult(ctx, result);
  }
  "~validate"(data) {
    var _a2, _b2;
    const ctx = {
      common: {
        issues: [],
        async: !!this["~standard"].async
      },
      path: [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    if (!this["~standard"].async) {
      try {
        const result = this._parseSync({ data, path: [], parent: ctx });
        return isValid(result) ? {
          value: result.value
        } : {
          issues: ctx.common.issues
        };
      } catch (err) {
        if ((_b2 = (_a2 = err == null ? void 0 : err.message) == null ? void 0 : _a2.toLowerCase()) == null ? void 0 : _b2.includes("encountered")) {
          this["~standard"].async = true;
        }
        ctx.common = {
          issues: [],
          async: true
        };
      }
    }
    return this._parseAsync({ data, path: [], parent: ctx }).then((result) => isValid(result) ? {
      value: result.value
    } : {
      issues: ctx.common.issues
    });
  }
  async parseAsync(data, params) {
    const result = await this.safeParseAsync(data, params);
    if (result.success)
      return result.data;
    throw result.error;
  }
  async safeParseAsync(data, params) {
    const ctx = {
      common: {
        issues: [],
        contextualErrorMap: params == null ? void 0 : params.errorMap,
        async: true
      },
      path: (params == null ? void 0 : params.path) || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    const maybeAsyncResult = this._parse({ data, path: ctx.path, parent: ctx });
    const result = await (isAsync(maybeAsyncResult) ? maybeAsyncResult : Promise.resolve(maybeAsyncResult));
    return handleResult(ctx, result);
  }
  refine(check, message) {
    const getIssueProperties = (val) => {
      if (typeof message === "string" || typeof message === "undefined") {
        return { message };
      } else if (typeof message === "function") {
        return message(val);
      } else {
        return message;
      }
    };
    return this._refinement((val, ctx) => {
      const result = check(val);
      const setError = () => ctx.addIssue({
        code: ZodIssueCode.custom,
        ...getIssueProperties(val)
      });
      if (typeof Promise !== "undefined" && result instanceof Promise) {
        return result.then((data) => {
          if (!data) {
            setError();
            return false;
          } else {
            return true;
          }
        });
      }
      if (!result) {
        setError();
        return false;
      } else {
        return true;
      }
    });
  }
  refinement(check, refinementData) {
    return this._refinement((val, ctx) => {
      if (!check(val)) {
        ctx.addIssue(typeof refinementData === "function" ? refinementData(val, ctx) : refinementData);
        return false;
      } else {
        return true;
      }
    });
  }
  _refinement(refinement) {
    return new ZodEffects({
      schema: this,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect: { type: "refinement", refinement }
    });
  }
  superRefine(refinement) {
    return this._refinement(refinement);
  }
  constructor(def) {
    this.spa = this.safeParseAsync;
    this._def = def;
    this.parse = this.parse.bind(this);
    this.safeParse = this.safeParse.bind(this);
    this.parseAsync = this.parseAsync.bind(this);
    this.safeParseAsync = this.safeParseAsync.bind(this);
    this.spa = this.spa.bind(this);
    this.refine = this.refine.bind(this);
    this.refinement = this.refinement.bind(this);
    this.superRefine = this.superRefine.bind(this);
    this.optional = this.optional.bind(this);
    this.nullable = this.nullable.bind(this);
    this.nullish = this.nullish.bind(this);
    this.array = this.array.bind(this);
    this.promise = this.promise.bind(this);
    this.or = this.or.bind(this);
    this.and = this.and.bind(this);
    this.transform = this.transform.bind(this);
    this.brand = this.brand.bind(this);
    this.default = this.default.bind(this);
    this.catch = this.catch.bind(this);
    this.describe = this.describe.bind(this);
    this.pipe = this.pipe.bind(this);
    this.readonly = this.readonly.bind(this);
    this.isNullable = this.isNullable.bind(this);
    this.isOptional = this.isOptional.bind(this);
    this["~standard"] = {
      version: 1,
      vendor: "zod",
      validate: (data) => this["~validate"](data)
    };
  }
  optional() {
    return ZodOptional.create(this, this._def);
  }
  nullable() {
    return ZodNullable.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return ZodArray.create(this);
  }
  promise() {
    return ZodPromise.create(this, this._def);
  }
  or(option) {
    return ZodUnion.create([this, option], this._def);
  }
  and(incoming) {
    return ZodIntersection.create(this, incoming, this._def);
  }
  transform(transform) {
    return new ZodEffects({
      ...processCreateParams(this._def),
      schema: this,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect: { type: "transform", transform }
    });
  }
  default(def) {
    const defaultValueFunc = typeof def === "function" ? def : () => def;
    return new ZodDefault({
      ...processCreateParams(this._def),
      innerType: this,
      defaultValue: defaultValueFunc,
      typeName: ZodFirstPartyTypeKind.ZodDefault
    });
  }
  brand() {
    return new ZodBranded({
      typeName: ZodFirstPartyTypeKind.ZodBranded,
      type: this,
      ...processCreateParams(this._def)
    });
  }
  catch(def) {
    const catchValueFunc = typeof def === "function" ? def : () => def;
    return new ZodCatch({
      ...processCreateParams(this._def),
      innerType: this,
      catchValue: catchValueFunc,
      typeName: ZodFirstPartyTypeKind.ZodCatch
    });
  }
  describe(description) {
    const This = this.constructor;
    return new This({
      ...this._def,
      description
    });
  }
  pipe(target) {
    return ZodPipeline.create(this, target);
  }
  readonly() {
    return ZodReadonly.create(this);
  }
  isOptional() {
    return this.safeParse(void 0).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
}
const cuidRegex = /^c[^\s-]{8,}$/i;
const cuid2Regex = /^[0-9a-z]+$/;
const ulidRegex = /^[0-9A-HJKMNP-TV-Z]{26}$/i;
const uuidRegex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i;
const nanoidRegex = /^[a-z0-9_-]{21}$/i;
const jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
const durationRegex = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/;
const emailRegex = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i;
const _emojiRegex = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
let emojiRegex;
const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
const ipv4CidrRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/;
const ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
const ipv6CidrRegex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
const base64Regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
const base64urlRegex = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/;
const dateRegexSource = `((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))`;
const dateRegex = new RegExp(`^${dateRegexSource}$`);
function timeRegexSource(args) {
  let secondsRegexSource = `[0-5]\\d`;
  if (args.precision) {
    secondsRegexSource = `${secondsRegexSource}\\.\\d{${args.precision}}`;
  } else if (args.precision == null) {
    secondsRegexSource = `${secondsRegexSource}(\\.\\d+)?`;
  }
  const secondsQuantifier = args.precision ? "+" : "?";
  return `([01]\\d|2[0-3]):[0-5]\\d(:${secondsRegexSource})${secondsQuantifier}`;
}
function timeRegex(args) {
  return new RegExp(`^${timeRegexSource(args)}$`);
}
function datetimeRegex(args) {
  let regex = `${dateRegexSource}T${timeRegexSource(args)}`;
  const opts = [];
  opts.push(args.local ? `Z?` : `Z`);
  if (args.offset)
    opts.push(`([+-]\\d{2}:?\\d{2})`);
  regex = `${regex}(${opts.join("|")})`;
  return new RegExp(`^${regex}$`);
}
function isValidIP(ip, version) {
  if ((version === "v4" || !version) && ipv4Regex.test(ip)) {
    return true;
  }
  if ((version === "v6" || !version) && ipv6Regex.test(ip)) {
    return true;
  }
  return false;
}
function isValidJWT(jwt, alg) {
  if (!jwtRegex.test(jwt))
    return false;
  try {
    const [header] = jwt.split(".");
    const base64 = header.replace(/-/g, "+").replace(/_/g, "/").padEnd(header.length + (4 - header.length % 4) % 4, "=");
    const decoded = JSON.parse(atob(base64));
    if (typeof decoded !== "object" || decoded === null)
      return false;
    if ("typ" in decoded && (decoded == null ? void 0 : decoded.typ) !== "JWT")
      return false;
    if (!decoded.alg)
      return false;
    if (alg && decoded.alg !== alg)
      return false;
    return true;
  } catch {
    return false;
  }
}
function isValidCidr(ip, version) {
  if ((version === "v4" || !version) && ipv4CidrRegex.test(ip)) {
    return true;
  }
  if ((version === "v6" || !version) && ipv6CidrRegex.test(ip)) {
    return true;
  }
  return false;
}
class ZodString extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = String(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.string) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.string,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    const status = new ParseStatus();
    let ctx = void 0;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        if (input.data.length < check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: "string",
            inclusive: true,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        if (input.data.length > check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: "string",
            inclusive: true,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "length") {
        const tooBig = input.data.length > check.value;
        const tooSmall = input.data.length < check.value;
        if (tooBig || tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          if (tooBig) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_big,
              maximum: check.value,
              type: "string",
              inclusive: true,
              exact: true,
              message: check.message
            });
          } else if (tooSmall) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_small,
              minimum: check.value,
              type: "string",
              inclusive: true,
              exact: true,
              message: check.message
            });
          }
          status.dirty();
        }
      } else if (check.kind === "email") {
        if (!emailRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "email",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "emoji") {
        if (!emojiRegex) {
          emojiRegex = new RegExp(_emojiRegex, "u");
        }
        if (!emojiRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "emoji",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "uuid") {
        if (!uuidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "uuid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "nanoid") {
        if (!nanoidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "nanoid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cuid") {
        if (!cuidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cuid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cuid2") {
        if (!cuid2Regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cuid2",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "ulid") {
        if (!ulidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "ulid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "url") {
        try {
          new URL(input.data);
        } catch {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "url",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "regex") {
        check.regex.lastIndex = 0;
        const testResult = check.regex.test(input.data);
        if (!testResult) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "regex",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "trim") {
        input.data = input.data.trim();
      } else if (check.kind === "includes") {
        if (!input.data.includes(check.value, check.position)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { includes: check.value, position: check.position },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "toLowerCase") {
        input.data = input.data.toLowerCase();
      } else if (check.kind === "toUpperCase") {
        input.data = input.data.toUpperCase();
      } else if (check.kind === "startsWith") {
        if (!input.data.startsWith(check.value)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { startsWith: check.value },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "endsWith") {
        if (!input.data.endsWith(check.value)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { endsWith: check.value },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "datetime") {
        const regex = datetimeRegex(check);
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "datetime",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "date") {
        const regex = dateRegex;
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "date",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "time") {
        const regex = timeRegex(check);
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "time",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "duration") {
        if (!durationRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "duration",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "ip") {
        if (!isValidIP(input.data, check.version)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "ip",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "jwt") {
        if (!isValidJWT(input.data, check.alg)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "jwt",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cidr") {
        if (!isValidCidr(input.data, check.version)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cidr",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "base64") {
        if (!base64Regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "base64",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "base64url") {
        if (!base64urlRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "base64url",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  _regex(regex, validation, message) {
    return this.refinement((data) => regex.test(data), {
      validation,
      code: ZodIssueCode.invalid_string,
      ...errorUtil.errToObj(message)
    });
  }
  _addCheck(check) {
    return new ZodString({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  email(message) {
    return this._addCheck({ kind: "email", ...errorUtil.errToObj(message) });
  }
  url(message) {
    return this._addCheck({ kind: "url", ...errorUtil.errToObj(message) });
  }
  emoji(message) {
    return this._addCheck({ kind: "emoji", ...errorUtil.errToObj(message) });
  }
  uuid(message) {
    return this._addCheck({ kind: "uuid", ...errorUtil.errToObj(message) });
  }
  nanoid(message) {
    return this._addCheck({ kind: "nanoid", ...errorUtil.errToObj(message) });
  }
  cuid(message) {
    return this._addCheck({ kind: "cuid", ...errorUtil.errToObj(message) });
  }
  cuid2(message) {
    return this._addCheck({ kind: "cuid2", ...errorUtil.errToObj(message) });
  }
  ulid(message) {
    return this._addCheck({ kind: "ulid", ...errorUtil.errToObj(message) });
  }
  base64(message) {
    return this._addCheck({ kind: "base64", ...errorUtil.errToObj(message) });
  }
  base64url(message) {
    return this._addCheck({
      kind: "base64url",
      ...errorUtil.errToObj(message)
    });
  }
  jwt(options) {
    return this._addCheck({ kind: "jwt", ...errorUtil.errToObj(options) });
  }
  ip(options) {
    return this._addCheck({ kind: "ip", ...errorUtil.errToObj(options) });
  }
  cidr(options) {
    return this._addCheck({ kind: "cidr", ...errorUtil.errToObj(options) });
  }
  datetime(options) {
    if (typeof options === "string") {
      return this._addCheck({
        kind: "datetime",
        precision: null,
        offset: false,
        local: false,
        message: options
      });
    }
    return this._addCheck({
      kind: "datetime",
      precision: typeof (options == null ? void 0 : options.precision) === "undefined" ? null : options == null ? void 0 : options.precision,
      offset: (options == null ? void 0 : options.offset) ?? false,
      local: (options == null ? void 0 : options.local) ?? false,
      ...errorUtil.errToObj(options == null ? void 0 : options.message)
    });
  }
  date(message) {
    return this._addCheck({ kind: "date", message });
  }
  time(options) {
    if (typeof options === "string") {
      return this._addCheck({
        kind: "time",
        precision: null,
        message: options
      });
    }
    return this._addCheck({
      kind: "time",
      precision: typeof (options == null ? void 0 : options.precision) === "undefined" ? null : options == null ? void 0 : options.precision,
      ...errorUtil.errToObj(options == null ? void 0 : options.message)
    });
  }
  duration(message) {
    return this._addCheck({ kind: "duration", ...errorUtil.errToObj(message) });
  }
  regex(regex, message) {
    return this._addCheck({
      kind: "regex",
      regex,
      ...errorUtil.errToObj(message)
    });
  }
  includes(value, options) {
    return this._addCheck({
      kind: "includes",
      value,
      position: options == null ? void 0 : options.position,
      ...errorUtil.errToObj(options == null ? void 0 : options.message)
    });
  }
  startsWith(value, message) {
    return this._addCheck({
      kind: "startsWith",
      value,
      ...errorUtil.errToObj(message)
    });
  }
  endsWith(value, message) {
    return this._addCheck({
      kind: "endsWith",
      value,
      ...errorUtil.errToObj(message)
    });
  }
  min(minLength, message) {
    return this._addCheck({
      kind: "min",
      value: minLength,
      ...errorUtil.errToObj(message)
    });
  }
  max(maxLength, message) {
    return this._addCheck({
      kind: "max",
      value: maxLength,
      ...errorUtil.errToObj(message)
    });
  }
  length(len, message) {
    return this._addCheck({
      kind: "length",
      value: len,
      ...errorUtil.errToObj(message)
    });
  }
  /**
   * Equivalent to `.min(1)`
   */
  nonempty(message) {
    return this.min(1, errorUtil.errToObj(message));
  }
  trim() {
    return new ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "trim" }]
    });
  }
  toLowerCase() {
    return new ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "toLowerCase" }]
    });
  }
  toUpperCase() {
    return new ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "toUpperCase" }]
    });
  }
  get isDatetime() {
    return !!this._def.checks.find((ch) => ch.kind === "datetime");
  }
  get isDate() {
    return !!this._def.checks.find((ch) => ch.kind === "date");
  }
  get isTime() {
    return !!this._def.checks.find((ch) => ch.kind === "time");
  }
  get isDuration() {
    return !!this._def.checks.find((ch) => ch.kind === "duration");
  }
  get isEmail() {
    return !!this._def.checks.find((ch) => ch.kind === "email");
  }
  get isURL() {
    return !!this._def.checks.find((ch) => ch.kind === "url");
  }
  get isEmoji() {
    return !!this._def.checks.find((ch) => ch.kind === "emoji");
  }
  get isUUID() {
    return !!this._def.checks.find((ch) => ch.kind === "uuid");
  }
  get isNANOID() {
    return !!this._def.checks.find((ch) => ch.kind === "nanoid");
  }
  get isCUID() {
    return !!this._def.checks.find((ch) => ch.kind === "cuid");
  }
  get isCUID2() {
    return !!this._def.checks.find((ch) => ch.kind === "cuid2");
  }
  get isULID() {
    return !!this._def.checks.find((ch) => ch.kind === "ulid");
  }
  get isIP() {
    return !!this._def.checks.find((ch) => ch.kind === "ip");
  }
  get isCIDR() {
    return !!this._def.checks.find((ch) => ch.kind === "cidr");
  }
  get isBase64() {
    return !!this._def.checks.find((ch) => ch.kind === "base64");
  }
  get isBase64url() {
    return !!this._def.checks.find((ch) => ch.kind === "base64url");
  }
  get minLength() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxLength() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
}
ZodString.create = (params) => {
  return new ZodString({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodString,
    coerce: (params == null ? void 0 : params.coerce) ?? false,
    ...processCreateParams(params)
  });
};
function floatSafeRemainder(val, step) {
  const valDecCount = (val.toString().split(".")[1] || "").length;
  const stepDecCount = (step.toString().split(".")[1] || "").length;
  const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
  const valInt = Number.parseInt(val.toFixed(decCount).replace(".", ""));
  const stepInt = Number.parseInt(step.toFixed(decCount).replace(".", ""));
  return valInt % stepInt / 10 ** decCount;
}
class ZodNumber extends ZodType {
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
    this.step = this.multipleOf;
  }
  _parse(input) {
    if (this._def.coerce) {
      input.data = Number(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.number) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.number,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    let ctx = void 0;
    const status = new ParseStatus();
    for (const check of this._def.checks) {
      if (check.kind === "int") {
        if (!util.isInteger(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: "integer",
            received: "float",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "min") {
        const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "multipleOf") {
        if (floatSafeRemainder(input.data, check.value) !== 0) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "finite") {
        if (!Number.isFinite(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_finite,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  gte(value, message) {
    return this.setLimit("min", value, true, errorUtil.toString(message));
  }
  gt(value, message) {
    return this.setLimit("min", value, false, errorUtil.toString(message));
  }
  lte(value, message) {
    return this.setLimit("max", value, true, errorUtil.toString(message));
  }
  lt(value, message) {
    return this.setLimit("max", value, false, errorUtil.toString(message));
  }
  setLimit(kind, value, inclusive, message) {
    return new ZodNumber({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind,
          value,
          inclusive,
          message: errorUtil.toString(message)
        }
      ]
    });
  }
  _addCheck(check) {
    return new ZodNumber({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  int(message) {
    return this._addCheck({
      kind: "int",
      message: errorUtil.toString(message)
    });
  }
  positive(message) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  negative(message) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  nonpositive(message) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  nonnegative(message) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  multipleOf(value, message) {
    return this._addCheck({
      kind: "multipleOf",
      value,
      message: errorUtil.toString(message)
    });
  }
  finite(message) {
    return this._addCheck({
      kind: "finite",
      message: errorUtil.toString(message)
    });
  }
  safe(message) {
    return this._addCheck({
      kind: "min",
      inclusive: true,
      value: Number.MIN_SAFE_INTEGER,
      message: errorUtil.toString(message)
    })._addCheck({
      kind: "max",
      inclusive: true,
      value: Number.MAX_SAFE_INTEGER,
      message: errorUtil.toString(message)
    });
  }
  get minValue() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxValue() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
  get isInt() {
    return !!this._def.checks.find((ch) => ch.kind === "int" || ch.kind === "multipleOf" && util.isInteger(ch.value));
  }
  get isFinite() {
    let max = null;
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "finite" || ch.kind === "int" || ch.kind === "multipleOf") {
        return true;
      } else if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      } else if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return Number.isFinite(min) && Number.isFinite(max);
  }
}
ZodNumber.create = (params) => {
  return new ZodNumber({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodNumber,
    coerce: (params == null ? void 0 : params.coerce) || false,
    ...processCreateParams(params)
  });
};
class ZodBigInt extends ZodType {
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
  }
  _parse(input) {
    if (this._def.coerce) {
      try {
        input.data = BigInt(input.data);
      } catch {
        return this._getInvalidInput(input);
      }
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.bigint) {
      return this._getInvalidInput(input);
    }
    let ctx = void 0;
    const status = new ParseStatus();
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            type: "bigint",
            minimum: check.value,
            inclusive: check.inclusive,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            type: "bigint",
            maximum: check.value,
            inclusive: check.inclusive,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "multipleOf") {
        if (input.data % check.value !== BigInt(0)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  _getInvalidInput(input) {
    const ctx = this._getOrReturnCtx(input);
    addIssueToContext(ctx, {
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.bigint,
      received: ctx.parsedType
    });
    return INVALID;
  }
  gte(value, message) {
    return this.setLimit("min", value, true, errorUtil.toString(message));
  }
  gt(value, message) {
    return this.setLimit("min", value, false, errorUtil.toString(message));
  }
  lte(value, message) {
    return this.setLimit("max", value, true, errorUtil.toString(message));
  }
  lt(value, message) {
    return this.setLimit("max", value, false, errorUtil.toString(message));
  }
  setLimit(kind, value, inclusive, message) {
    return new ZodBigInt({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind,
          value,
          inclusive,
          message: errorUtil.toString(message)
        }
      ]
    });
  }
  _addCheck(check) {
    return new ZodBigInt({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  positive(message) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  negative(message) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  nonpositive(message) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  nonnegative(message) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  multipleOf(value, message) {
    return this._addCheck({
      kind: "multipleOf",
      value,
      message: errorUtil.toString(message)
    });
  }
  get minValue() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxValue() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
}
ZodBigInt.create = (params) => {
  return new ZodBigInt({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodBigInt,
    coerce: (params == null ? void 0 : params.coerce) ?? false,
    ...processCreateParams(params)
  });
};
class ZodBoolean extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = Boolean(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.boolean) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.boolean,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
}
ZodBoolean.create = (params) => {
  return new ZodBoolean({
    typeName: ZodFirstPartyTypeKind.ZodBoolean,
    coerce: (params == null ? void 0 : params.coerce) || false,
    ...processCreateParams(params)
  });
};
class ZodDate extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = new Date(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.date) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.date,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    if (Number.isNaN(input.data.getTime())) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_date
      });
      return INVALID;
    }
    const status = new ParseStatus();
    let ctx = void 0;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        if (input.data.getTime() < check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            message: check.message,
            inclusive: true,
            exact: false,
            minimum: check.value,
            type: "date"
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        if (input.data.getTime() > check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            message: check.message,
            inclusive: true,
            exact: false,
            maximum: check.value,
            type: "date"
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return {
      status: status.value,
      value: new Date(input.data.getTime())
    };
  }
  _addCheck(check) {
    return new ZodDate({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  min(minDate, message) {
    return this._addCheck({
      kind: "min",
      value: minDate.getTime(),
      message: errorUtil.toString(message)
    });
  }
  max(maxDate, message) {
    return this._addCheck({
      kind: "max",
      value: maxDate.getTime(),
      message: errorUtil.toString(message)
    });
  }
  get minDate() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min != null ? new Date(min) : null;
  }
  get maxDate() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max != null ? new Date(max) : null;
  }
}
ZodDate.create = (params) => {
  return new ZodDate({
    checks: [],
    coerce: (params == null ? void 0 : params.coerce) || false,
    typeName: ZodFirstPartyTypeKind.ZodDate,
    ...processCreateParams(params)
  });
};
class ZodSymbol extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.symbol) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.symbol,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
}
ZodSymbol.create = (params) => {
  return new ZodSymbol({
    typeName: ZodFirstPartyTypeKind.ZodSymbol,
    ...processCreateParams(params)
  });
};
class ZodUndefined extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.undefined,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
}
ZodUndefined.create = (params) => {
  return new ZodUndefined({
    typeName: ZodFirstPartyTypeKind.ZodUndefined,
    ...processCreateParams(params)
  });
};
class ZodNull extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.null) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.null,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
}
ZodNull.create = (params) => {
  return new ZodNull({
    typeName: ZodFirstPartyTypeKind.ZodNull,
    ...processCreateParams(params)
  });
};
class ZodAny extends ZodType {
  constructor() {
    super(...arguments);
    this._any = true;
  }
  _parse(input) {
    return OK(input.data);
  }
}
ZodAny.create = (params) => {
  return new ZodAny({
    typeName: ZodFirstPartyTypeKind.ZodAny,
    ...processCreateParams(params)
  });
};
class ZodUnknown extends ZodType {
  constructor() {
    super(...arguments);
    this._unknown = true;
  }
  _parse(input) {
    return OK(input.data);
  }
}
ZodUnknown.create = (params) => {
  return new ZodUnknown({
    typeName: ZodFirstPartyTypeKind.ZodUnknown,
    ...processCreateParams(params)
  });
};
class ZodNever extends ZodType {
  _parse(input) {
    const ctx = this._getOrReturnCtx(input);
    addIssueToContext(ctx, {
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.never,
      received: ctx.parsedType
    });
    return INVALID;
  }
}
ZodNever.create = (params) => {
  return new ZodNever({
    typeName: ZodFirstPartyTypeKind.ZodNever,
    ...processCreateParams(params)
  });
};
class ZodVoid extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.void,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
}
ZodVoid.create = (params) => {
  return new ZodVoid({
    typeName: ZodFirstPartyTypeKind.ZodVoid,
    ...processCreateParams(params)
  });
};
class ZodArray extends ZodType {
  _parse(input) {
    const { ctx, status } = this._processInputParams(input);
    const def = this._def;
    if (ctx.parsedType !== ZodParsedType.array) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.array,
        received: ctx.parsedType
      });
      return INVALID;
    }
    if (def.exactLength !== null) {
      const tooBig = ctx.data.length > def.exactLength.value;
      const tooSmall = ctx.data.length < def.exactLength.value;
      if (tooBig || tooSmall) {
        addIssueToContext(ctx, {
          code: tooBig ? ZodIssueCode.too_big : ZodIssueCode.too_small,
          minimum: tooSmall ? def.exactLength.value : void 0,
          maximum: tooBig ? def.exactLength.value : void 0,
          type: "array",
          inclusive: true,
          exact: true,
          message: def.exactLength.message
        });
        status.dirty();
      }
    }
    if (def.minLength !== null) {
      if (ctx.data.length < def.minLength.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: def.minLength.value,
          type: "array",
          inclusive: true,
          exact: false,
          message: def.minLength.message
        });
        status.dirty();
      }
    }
    if (def.maxLength !== null) {
      if (ctx.data.length > def.maxLength.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: def.maxLength.value,
          type: "array",
          inclusive: true,
          exact: false,
          message: def.maxLength.message
        });
        status.dirty();
      }
    }
    if (ctx.common.async) {
      return Promise.all([...ctx.data].map((item, i) => {
        return def.type._parseAsync(new ParseInputLazyPath(ctx, item, ctx.path, i));
      })).then((result2) => {
        return ParseStatus.mergeArray(status, result2);
      });
    }
    const result = [...ctx.data].map((item, i) => {
      return def.type._parseSync(new ParseInputLazyPath(ctx, item, ctx.path, i));
    });
    return ParseStatus.mergeArray(status, result);
  }
  get element() {
    return this._def.type;
  }
  min(minLength, message) {
    return new ZodArray({
      ...this._def,
      minLength: { value: minLength, message: errorUtil.toString(message) }
    });
  }
  max(maxLength, message) {
    return new ZodArray({
      ...this._def,
      maxLength: { value: maxLength, message: errorUtil.toString(message) }
    });
  }
  length(len, message) {
    return new ZodArray({
      ...this._def,
      exactLength: { value: len, message: errorUtil.toString(message) }
    });
  }
  nonempty(message) {
    return this.min(1, message);
  }
}
ZodArray.create = (schema, params) => {
  return new ZodArray({
    type: schema,
    minLength: null,
    maxLength: null,
    exactLength: null,
    typeName: ZodFirstPartyTypeKind.ZodArray,
    ...processCreateParams(params)
  });
};
function deepPartialify(schema) {
  if (schema instanceof ZodObject) {
    const newShape = {};
    for (const key in schema.shape) {
      const fieldSchema = schema.shape[key];
      newShape[key] = ZodOptional.create(deepPartialify(fieldSchema));
    }
    return new ZodObject({
      ...schema._def,
      shape: () => newShape
    });
  } else if (schema instanceof ZodArray) {
    return new ZodArray({
      ...schema._def,
      type: deepPartialify(schema.element)
    });
  } else if (schema instanceof ZodOptional) {
    return ZodOptional.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodNullable) {
    return ZodNullable.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodTuple) {
    return ZodTuple.create(schema.items.map((item) => deepPartialify(item)));
  } else {
    return schema;
  }
}
class ZodObject extends ZodType {
  constructor() {
    super(...arguments);
    this._cached = null;
    this.nonstrict = this.passthrough;
    this.augment = this.extend;
  }
  _getCached() {
    if (this._cached !== null)
      return this._cached;
    const shape = this._def.shape();
    const keys = util.objectKeys(shape);
    this._cached = { shape, keys };
    return this._cached;
  }
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.object) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    const { status, ctx } = this._processInputParams(input);
    const { shape, keys: shapeKeys } = this._getCached();
    const extraKeys = [];
    if (!(this._def.catchall instanceof ZodNever && this._def.unknownKeys === "strip")) {
      for (const key in ctx.data) {
        if (!shapeKeys.includes(key)) {
          extraKeys.push(key);
        }
      }
    }
    const pairs = [];
    for (const key of shapeKeys) {
      const keyValidator = shape[key];
      const value = ctx.data[key];
      pairs.push({
        key: { status: "valid", value: key },
        value: keyValidator._parse(new ParseInputLazyPath(ctx, value, ctx.path, key)),
        alwaysSet: key in ctx.data
      });
    }
    if (this._def.catchall instanceof ZodNever) {
      const unknownKeys = this._def.unknownKeys;
      if (unknownKeys === "passthrough") {
        for (const key of extraKeys) {
          pairs.push({
            key: { status: "valid", value: key },
            value: { status: "valid", value: ctx.data[key] }
          });
        }
      } else if (unknownKeys === "strict") {
        if (extraKeys.length > 0) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.unrecognized_keys,
            keys: extraKeys
          });
          status.dirty();
        }
      } else if (unknownKeys === "strip") ;
      else {
        throw new Error(`Internal ZodObject error: invalid unknownKeys value.`);
      }
    } else {
      const catchall = this._def.catchall;
      for (const key of extraKeys) {
        const value = ctx.data[key];
        pairs.push({
          key: { status: "valid", value: key },
          value: catchall._parse(
            new ParseInputLazyPath(ctx, value, ctx.path, key)
            //, ctx.child(key), value, getParsedType(value)
          ),
          alwaysSet: key in ctx.data
        });
      }
    }
    if (ctx.common.async) {
      return Promise.resolve().then(async () => {
        const syncPairs = [];
        for (const pair of pairs) {
          const key = await pair.key;
          const value = await pair.value;
          syncPairs.push({
            key,
            value,
            alwaysSet: pair.alwaysSet
          });
        }
        return syncPairs;
      }).then((syncPairs) => {
        return ParseStatus.mergeObjectSync(status, syncPairs);
      });
    } else {
      return ParseStatus.mergeObjectSync(status, pairs);
    }
  }
  get shape() {
    return this._def.shape();
  }
  strict(message) {
    errorUtil.errToObj;
    return new ZodObject({
      ...this._def,
      unknownKeys: "strict",
      ...message !== void 0 ? {
        errorMap: (issue, ctx) => {
          var _a2, _b2;
          const defaultError = ((_b2 = (_a2 = this._def).errorMap) == null ? void 0 : _b2.call(_a2, issue, ctx).message) ?? ctx.defaultError;
          if (issue.code === "unrecognized_keys")
            return {
              message: errorUtil.errToObj(message).message ?? defaultError
            };
          return {
            message: defaultError
          };
        }
      } : {}
    });
  }
  strip() {
    return new ZodObject({
      ...this._def,
      unknownKeys: "strip"
    });
  }
  passthrough() {
    return new ZodObject({
      ...this._def,
      unknownKeys: "passthrough"
    });
  }
  // const AugmentFactory =
  //   <Def extends ZodObjectDef>(def: Def) =>
  //   <Augmentation extends ZodRawShape>(
  //     augmentation: Augmentation
  //   ): ZodObject<
  //     extendShape<ReturnType<Def["shape"]>, Augmentation>,
  //     Def["unknownKeys"],
  //     Def["catchall"]
  //   > => {
  //     return new ZodObject({
  //       ...def,
  //       shape: () => ({
  //         ...def.shape(),
  //         ...augmentation,
  //       }),
  //     }) as any;
  //   };
  extend(augmentation) {
    return new ZodObject({
      ...this._def,
      shape: () => ({
        ...this._def.shape(),
        ...augmentation
      })
    });
  }
  /**
   * Prior to zod@1.0.12 there was a bug in the
   * inferred type of merged objects. Please
   * upgrade if you are experiencing issues.
   */
  merge(merging) {
    const merged = new ZodObject({
      unknownKeys: merging._def.unknownKeys,
      catchall: merging._def.catchall,
      shape: () => ({
        ...this._def.shape(),
        ...merging._def.shape()
      }),
      typeName: ZodFirstPartyTypeKind.ZodObject
    });
    return merged;
  }
  // merge<
  //   Incoming extends AnyZodObject,
  //   Augmentation extends Incoming["shape"],
  //   NewOutput extends {
  //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
  //       ? Augmentation[k]["_output"]
  //       : k extends keyof Output
  //       ? Output[k]
  //       : never;
  //   },
  //   NewInput extends {
  //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
  //       ? Augmentation[k]["_input"]
  //       : k extends keyof Input
  //       ? Input[k]
  //       : never;
  //   }
  // >(
  //   merging: Incoming
  // ): ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"],
  //   NewOutput,
  //   NewInput
  // > {
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  setKey(key, schema) {
    return this.augment({ [key]: schema });
  }
  // merge<Incoming extends AnyZodObject>(
  //   merging: Incoming
  // ): //ZodObject<T & Incoming["_shape"], UnknownKeys, Catchall> = (merging) => {
  // ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"]
  // > {
  //   // const mergedShape = objectUtil.mergeShapes(
  //   //   this._def.shape(),
  //   //   merging._def.shape()
  //   // );
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  catchall(index) {
    return new ZodObject({
      ...this._def,
      catchall: index
    });
  }
  pick(mask) {
    const shape = {};
    for (const key of util.objectKeys(mask)) {
      if (mask[key] && this.shape[key]) {
        shape[key] = this.shape[key];
      }
    }
    return new ZodObject({
      ...this._def,
      shape: () => shape
    });
  }
  omit(mask) {
    const shape = {};
    for (const key of util.objectKeys(this.shape)) {
      if (!mask[key]) {
        shape[key] = this.shape[key];
      }
    }
    return new ZodObject({
      ...this._def,
      shape: () => shape
    });
  }
  /**
   * @deprecated
   */
  deepPartial() {
    return deepPartialify(this);
  }
  partial(mask) {
    const newShape = {};
    for (const key of util.objectKeys(this.shape)) {
      const fieldSchema = this.shape[key];
      if (mask && !mask[key]) {
        newShape[key] = fieldSchema;
      } else {
        newShape[key] = fieldSchema.optional();
      }
    }
    return new ZodObject({
      ...this._def,
      shape: () => newShape
    });
  }
  required(mask) {
    const newShape = {};
    for (const key of util.objectKeys(this.shape)) {
      if (mask && !mask[key]) {
        newShape[key] = this.shape[key];
      } else {
        const fieldSchema = this.shape[key];
        let newField = fieldSchema;
        while (newField instanceof ZodOptional) {
          newField = newField._def.innerType;
        }
        newShape[key] = newField;
      }
    }
    return new ZodObject({
      ...this._def,
      shape: () => newShape
    });
  }
  keyof() {
    return createZodEnum(util.objectKeys(this.shape));
  }
}
ZodObject.create = (shape, params) => {
  return new ZodObject({
    shape: () => shape,
    unknownKeys: "strip",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
ZodObject.strictCreate = (shape, params) => {
  return new ZodObject({
    shape: () => shape,
    unknownKeys: "strict",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
ZodObject.lazycreate = (shape, params) => {
  return new ZodObject({
    shape,
    unknownKeys: "strip",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
class ZodUnion extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const options = this._def.options;
    function handleResults(results) {
      for (const result of results) {
        if (result.result.status === "valid") {
          return result.result;
        }
      }
      for (const result of results) {
        if (result.result.status === "dirty") {
          ctx.common.issues.push(...result.ctx.common.issues);
          return result.result;
        }
      }
      const unionErrors = results.map((result) => new ZodError(result.ctx.common.issues));
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union,
        unionErrors
      });
      return INVALID;
    }
    if (ctx.common.async) {
      return Promise.all(options.map(async (option) => {
        const childCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: []
          },
          parent: null
        };
        return {
          result: await option._parseAsync({
            data: ctx.data,
            path: ctx.path,
            parent: childCtx
          }),
          ctx: childCtx
        };
      })).then(handleResults);
    } else {
      let dirty = void 0;
      const issues = [];
      for (const option of options) {
        const childCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: []
          },
          parent: null
        };
        const result = option._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: childCtx
        });
        if (result.status === "valid") {
          return result;
        } else if (result.status === "dirty" && !dirty) {
          dirty = { result, ctx: childCtx };
        }
        if (childCtx.common.issues.length) {
          issues.push(childCtx.common.issues);
        }
      }
      if (dirty) {
        ctx.common.issues.push(...dirty.ctx.common.issues);
        return dirty.result;
      }
      const unionErrors = issues.map((issues2) => new ZodError(issues2));
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union,
        unionErrors
      });
      return INVALID;
    }
  }
  get options() {
    return this._def.options;
  }
}
ZodUnion.create = (types, params) => {
  return new ZodUnion({
    options: types,
    typeName: ZodFirstPartyTypeKind.ZodUnion,
    ...processCreateParams(params)
  });
};
function mergeValues(a, b) {
  const aType = getParsedType(a);
  const bType = getParsedType(b);
  if (a === b) {
    return { valid: true, data: a };
  } else if (aType === ZodParsedType.object && bType === ZodParsedType.object) {
    const bKeys = util.objectKeys(b);
    const sharedKeys = util.objectKeys(a).filter((key) => bKeys.indexOf(key) !== -1);
    const newObj = { ...a, ...b };
    for (const key of sharedKeys) {
      const sharedValue = mergeValues(a[key], b[key]);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newObj[key] = sharedValue.data;
    }
    return { valid: true, data: newObj };
  } else if (aType === ZodParsedType.array && bType === ZodParsedType.array) {
    if (a.length !== b.length) {
      return { valid: false };
    }
    const newArray = [];
    for (let index = 0; index < a.length; index++) {
      const itemA = a[index];
      const itemB = b[index];
      const sharedValue = mergeValues(itemA, itemB);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newArray.push(sharedValue.data);
    }
    return { valid: true, data: newArray };
  } else if (aType === ZodParsedType.date && bType === ZodParsedType.date && +a === +b) {
    return { valid: true, data: a };
  } else {
    return { valid: false };
  }
}
class ZodIntersection extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    const handleParsed = (parsedLeft, parsedRight) => {
      if (isAborted(parsedLeft) || isAborted(parsedRight)) {
        return INVALID;
      }
      const merged = mergeValues(parsedLeft.value, parsedRight.value);
      if (!merged.valid) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_intersection_types
        });
        return INVALID;
      }
      if (isDirty(parsedLeft) || isDirty(parsedRight)) {
        status.dirty();
      }
      return { status: status.value, value: merged.data };
    };
    if (ctx.common.async) {
      return Promise.all([
        this._def.left._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        }),
        this._def.right._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        })
      ]).then(([left, right]) => handleParsed(left, right));
    } else {
      return handleParsed(this._def.left._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      }), this._def.right._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      }));
    }
  }
}
ZodIntersection.create = (left, right, params) => {
  return new ZodIntersection({
    left,
    right,
    typeName: ZodFirstPartyTypeKind.ZodIntersection,
    ...processCreateParams(params)
  });
};
class ZodTuple extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.array) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.array,
        received: ctx.parsedType
      });
      return INVALID;
    }
    if (ctx.data.length < this._def.items.length) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.too_small,
        minimum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: "array"
      });
      return INVALID;
    }
    const rest = this._def.rest;
    if (!rest && ctx.data.length > this._def.items.length) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.too_big,
        maximum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: "array"
      });
      status.dirty();
    }
    const items = [...ctx.data].map((item, itemIndex) => {
      const schema = this._def.items[itemIndex] || this._def.rest;
      if (!schema)
        return null;
      return schema._parse(new ParseInputLazyPath(ctx, item, ctx.path, itemIndex));
    }).filter((x) => !!x);
    if (ctx.common.async) {
      return Promise.all(items).then((results) => {
        return ParseStatus.mergeArray(status, results);
      });
    } else {
      return ParseStatus.mergeArray(status, items);
    }
  }
  get items() {
    return this._def.items;
  }
  rest(rest) {
    return new ZodTuple({
      ...this._def,
      rest
    });
  }
}
ZodTuple.create = (schemas, params) => {
  if (!Array.isArray(schemas)) {
    throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  }
  return new ZodTuple({
    items: schemas,
    typeName: ZodFirstPartyTypeKind.ZodTuple,
    rest: null,
    ...processCreateParams(params)
  });
};
class ZodRecord extends ZodType {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.object) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const pairs = [];
    const keyType = this._def.keyType;
    const valueType = this._def.valueType;
    for (const key in ctx.data) {
      pairs.push({
        key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, key)),
        value: valueType._parse(new ParseInputLazyPath(ctx, ctx.data[key], ctx.path, key)),
        alwaysSet: key in ctx.data
      });
    }
    if (ctx.common.async) {
      return ParseStatus.mergeObjectAsync(status, pairs);
    } else {
      return ParseStatus.mergeObjectSync(status, pairs);
    }
  }
  get element() {
    return this._def.valueType;
  }
  static create(first, second, third) {
    if (second instanceof ZodType) {
      return new ZodRecord({
        keyType: first,
        valueType: second,
        typeName: ZodFirstPartyTypeKind.ZodRecord,
        ...processCreateParams(third)
      });
    }
    return new ZodRecord({
      keyType: ZodString.create(),
      valueType: first,
      typeName: ZodFirstPartyTypeKind.ZodRecord,
      ...processCreateParams(second)
    });
  }
}
class ZodMap extends ZodType {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.map) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.map,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const keyType = this._def.keyType;
    const valueType = this._def.valueType;
    const pairs = [...ctx.data.entries()].map(([key, value], index) => {
      return {
        key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, [index, "key"])),
        value: valueType._parse(new ParseInputLazyPath(ctx, value, ctx.path, [index, "value"]))
      };
    });
    if (ctx.common.async) {
      const finalMap = /* @__PURE__ */ new Map();
      return Promise.resolve().then(async () => {
        for (const pair of pairs) {
          const key = await pair.key;
          const value = await pair.value;
          if (key.status === "aborted" || value.status === "aborted") {
            return INVALID;
          }
          if (key.status === "dirty" || value.status === "dirty") {
            status.dirty();
          }
          finalMap.set(key.value, value.value);
        }
        return { status: status.value, value: finalMap };
      });
    } else {
      const finalMap = /* @__PURE__ */ new Map();
      for (const pair of pairs) {
        const key = pair.key;
        const value = pair.value;
        if (key.status === "aborted" || value.status === "aborted") {
          return INVALID;
        }
        if (key.status === "dirty" || value.status === "dirty") {
          status.dirty();
        }
        finalMap.set(key.value, value.value);
      }
      return { status: status.value, value: finalMap };
    }
  }
}
ZodMap.create = (keyType, valueType, params) => {
  return new ZodMap({
    valueType,
    keyType,
    typeName: ZodFirstPartyTypeKind.ZodMap,
    ...processCreateParams(params)
  });
};
class ZodSet extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.set) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.set,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const def = this._def;
    if (def.minSize !== null) {
      if (ctx.data.size < def.minSize.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: def.minSize.value,
          type: "set",
          inclusive: true,
          exact: false,
          message: def.minSize.message
        });
        status.dirty();
      }
    }
    if (def.maxSize !== null) {
      if (ctx.data.size > def.maxSize.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: def.maxSize.value,
          type: "set",
          inclusive: true,
          exact: false,
          message: def.maxSize.message
        });
        status.dirty();
      }
    }
    const valueType = this._def.valueType;
    function finalizeSet(elements2) {
      const parsedSet = /* @__PURE__ */ new Set();
      for (const element of elements2) {
        if (element.status === "aborted")
          return INVALID;
        if (element.status === "dirty")
          status.dirty();
        parsedSet.add(element.value);
      }
      return { status: status.value, value: parsedSet };
    }
    const elements = [...ctx.data.values()].map((item, i) => valueType._parse(new ParseInputLazyPath(ctx, item, ctx.path, i)));
    if (ctx.common.async) {
      return Promise.all(elements).then((elements2) => finalizeSet(elements2));
    } else {
      return finalizeSet(elements);
    }
  }
  min(minSize, message) {
    return new ZodSet({
      ...this._def,
      minSize: { value: minSize, message: errorUtil.toString(message) }
    });
  }
  max(maxSize, message) {
    return new ZodSet({
      ...this._def,
      maxSize: { value: maxSize, message: errorUtil.toString(message) }
    });
  }
  size(size, message) {
    return this.min(size, message).max(size, message);
  }
  nonempty(message) {
    return this.min(1, message);
  }
}
ZodSet.create = (valueType, params) => {
  return new ZodSet({
    valueType,
    minSize: null,
    maxSize: null,
    typeName: ZodFirstPartyTypeKind.ZodSet,
    ...processCreateParams(params)
  });
};
class ZodLazy extends ZodType {
  get schema() {
    return this._def.getter();
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const lazySchema = this._def.getter();
    return lazySchema._parse({ data: ctx.data, path: ctx.path, parent: ctx });
  }
}
ZodLazy.create = (getter, params) => {
  return new ZodLazy({
    getter,
    typeName: ZodFirstPartyTypeKind.ZodLazy,
    ...processCreateParams(params)
  });
};
class ZodLiteral extends ZodType {
  _parse(input) {
    if (input.data !== this._def.value) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_literal,
        expected: this._def.value
      });
      return INVALID;
    }
    return { status: "valid", value: input.data };
  }
  get value() {
    return this._def.value;
  }
}
ZodLiteral.create = (value, params) => {
  return new ZodLiteral({
    value,
    typeName: ZodFirstPartyTypeKind.ZodLiteral,
    ...processCreateParams(params)
  });
};
function createZodEnum(values, params) {
  return new ZodEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodEnum,
    ...processCreateParams(params)
  });
}
class ZodEnum extends ZodType {
  _parse(input) {
    if (typeof input.data !== "string") {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type
      });
      return INVALID;
    }
    if (!this._cache) {
      this._cache = new Set(this._def.values);
    }
    if (!this._cache.has(input.data)) {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues
      });
      return INVALID;
    }
    return OK(input.data);
  }
  get options() {
    return this._def.values;
  }
  get enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  get Values() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  get Enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  extract(values, newDef = this._def) {
    return ZodEnum.create(values, {
      ...this._def,
      ...newDef
    });
  }
  exclude(values, newDef = this._def) {
    return ZodEnum.create(this.options.filter((opt) => !values.includes(opt)), {
      ...this._def,
      ...newDef
    });
  }
}
ZodEnum.create = createZodEnum;
class ZodNativeEnum extends ZodType {
  _parse(input) {
    const nativeEnumValues = util.getValidEnumValues(this._def.values);
    const ctx = this._getOrReturnCtx(input);
    if (ctx.parsedType !== ZodParsedType.string && ctx.parsedType !== ZodParsedType.number) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type
      });
      return INVALID;
    }
    if (!this._cache) {
      this._cache = new Set(util.getValidEnumValues(this._def.values));
    }
    if (!this._cache.has(input.data)) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues
      });
      return INVALID;
    }
    return OK(input.data);
  }
  get enum() {
    return this._def.values;
  }
}
ZodNativeEnum.create = (values, params) => {
  return new ZodNativeEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodNativeEnum,
    ...processCreateParams(params)
  });
};
class ZodPromise extends ZodType {
  unwrap() {
    return this._def.type;
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.promise && ctx.common.async === false) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.promise,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const promisified = ctx.parsedType === ZodParsedType.promise ? ctx.data : Promise.resolve(ctx.data);
    return OK(promisified.then((data) => {
      return this._def.type.parseAsync(data, {
        path: ctx.path,
        errorMap: ctx.common.contextualErrorMap
      });
    }));
  }
}
ZodPromise.create = (schema, params) => {
  return new ZodPromise({
    type: schema,
    typeName: ZodFirstPartyTypeKind.ZodPromise,
    ...processCreateParams(params)
  });
};
class ZodEffects extends ZodType {
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === ZodFirstPartyTypeKind.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    const effect = this._def.effect || null;
    const checkCtx = {
      addIssue: (arg) => {
        addIssueToContext(ctx, arg);
        if (arg.fatal) {
          status.abort();
        } else {
          status.dirty();
        }
      },
      get path() {
        return ctx.path;
      }
    };
    checkCtx.addIssue = checkCtx.addIssue.bind(checkCtx);
    if (effect.type === "preprocess") {
      const processed = effect.transform(ctx.data, checkCtx);
      if (ctx.common.async) {
        return Promise.resolve(processed).then(async (processed2) => {
          if (status.value === "aborted")
            return INVALID;
          const result = await this._def.schema._parseAsync({
            data: processed2,
            path: ctx.path,
            parent: ctx
          });
          if (result.status === "aborted")
            return INVALID;
          if (result.status === "dirty")
            return DIRTY(result.value);
          if (status.value === "dirty")
            return DIRTY(result.value);
          return result;
        });
      } else {
        if (status.value === "aborted")
          return INVALID;
        const result = this._def.schema._parseSync({
          data: processed,
          path: ctx.path,
          parent: ctx
        });
        if (result.status === "aborted")
          return INVALID;
        if (result.status === "dirty")
          return DIRTY(result.value);
        if (status.value === "dirty")
          return DIRTY(result.value);
        return result;
      }
    }
    if (effect.type === "refinement") {
      const executeRefinement = (acc) => {
        const result = effect.refinement(acc, checkCtx);
        if (ctx.common.async) {
          return Promise.resolve(result);
        }
        if (result instanceof Promise) {
          throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
        }
        return acc;
      };
      if (ctx.common.async === false) {
        const inner = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inner.status === "aborted")
          return INVALID;
        if (inner.status === "dirty")
          status.dirty();
        executeRefinement(inner.value);
        return { status: status.value, value: inner.value };
      } else {
        return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((inner) => {
          if (inner.status === "aborted")
            return INVALID;
          if (inner.status === "dirty")
            status.dirty();
          return executeRefinement(inner.value).then(() => {
            return { status: status.value, value: inner.value };
          });
        });
      }
    }
    if (effect.type === "transform") {
      if (ctx.common.async === false) {
        const base = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (!isValid(base))
          return INVALID;
        const result = effect.transform(base.value, checkCtx);
        if (result instanceof Promise) {
          throw new Error(`Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.`);
        }
        return { status: status.value, value: result };
      } else {
        return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((base) => {
          if (!isValid(base))
            return INVALID;
          return Promise.resolve(effect.transform(base.value, checkCtx)).then((result) => ({
            status: status.value,
            value: result
          }));
        });
      }
    }
    util.assertNever(effect);
  }
}
ZodEffects.create = (schema, effect, params) => {
  return new ZodEffects({
    schema,
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    effect,
    ...processCreateParams(params)
  });
};
ZodEffects.createWithPreprocess = (preprocess, schema, params) => {
  return new ZodEffects({
    schema,
    effect: { type: "preprocess", transform: preprocess },
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    ...processCreateParams(params)
  });
};
class ZodOptional extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType === ZodParsedType.undefined) {
      return OK(void 0);
    }
    return this._def.innerType._parse(input);
  }
  unwrap() {
    return this._def.innerType;
  }
}
ZodOptional.create = (type, params) => {
  return new ZodOptional({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodOptional,
    ...processCreateParams(params)
  });
};
class ZodNullable extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType === ZodParsedType.null) {
      return OK(null);
    }
    return this._def.innerType._parse(input);
  }
  unwrap() {
    return this._def.innerType;
  }
}
ZodNullable.create = (type, params) => {
  return new ZodNullable({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodNullable,
    ...processCreateParams(params)
  });
};
class ZodDefault extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    let data = ctx.data;
    if (ctx.parsedType === ZodParsedType.undefined) {
      data = this._def.defaultValue();
    }
    return this._def.innerType._parse({
      data,
      path: ctx.path,
      parent: ctx
    });
  }
  removeDefault() {
    return this._def.innerType;
  }
}
ZodDefault.create = (type, params) => {
  return new ZodDefault({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodDefault,
    defaultValue: typeof params.default === "function" ? params.default : () => params.default,
    ...processCreateParams(params)
  });
};
class ZodCatch extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const newCtx = {
      ...ctx,
      common: {
        ...ctx.common,
        issues: []
      }
    };
    const result = this._def.innerType._parse({
      data: newCtx.data,
      path: newCtx.path,
      parent: {
        ...newCtx
      }
    });
    if (isAsync(result)) {
      return result.then((result2) => {
        return {
          status: "valid",
          value: result2.status === "valid" ? result2.value : this._def.catchValue({
            get error() {
              return new ZodError(newCtx.common.issues);
            },
            input: newCtx.data
          })
        };
      });
    } else {
      return {
        status: "valid",
        value: result.status === "valid" ? result.value : this._def.catchValue({
          get error() {
            return new ZodError(newCtx.common.issues);
          },
          input: newCtx.data
        })
      };
    }
  }
  removeCatch() {
    return this._def.innerType;
  }
}
ZodCatch.create = (type, params) => {
  return new ZodCatch({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodCatch,
    catchValue: typeof params.catch === "function" ? params.catch : () => params.catch,
    ...processCreateParams(params)
  });
};
class ZodNaN extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.nan) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.nan,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return { status: "valid", value: input.data };
  }
}
ZodNaN.create = (params) => {
  return new ZodNaN({
    typeName: ZodFirstPartyTypeKind.ZodNaN,
    ...processCreateParams(params)
  });
};
class ZodBranded extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const data = ctx.data;
    return this._def.type._parse({
      data,
      path: ctx.path,
      parent: ctx
    });
  }
  unwrap() {
    return this._def.type;
  }
}
class ZodPipeline extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.common.async) {
      const handleAsync = async () => {
        const inResult = await this._def.in._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inResult.status === "aborted")
          return INVALID;
        if (inResult.status === "dirty") {
          status.dirty();
          return DIRTY(inResult.value);
        } else {
          return this._def.out._parseAsync({
            data: inResult.value,
            path: ctx.path,
            parent: ctx
          });
        }
      };
      return handleAsync();
    } else {
      const inResult = this._def.in._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
      if (inResult.status === "aborted")
        return INVALID;
      if (inResult.status === "dirty") {
        status.dirty();
        return {
          status: "dirty",
          value: inResult.value
        };
      } else {
        return this._def.out._parseSync({
          data: inResult.value,
          path: ctx.path,
          parent: ctx
        });
      }
    }
  }
  static create(a, b) {
    return new ZodPipeline({
      in: a,
      out: b,
      typeName: ZodFirstPartyTypeKind.ZodPipeline
    });
  }
}
class ZodReadonly extends ZodType {
  _parse(input) {
    const result = this._def.innerType._parse(input);
    const freeze = (data) => {
      if (isValid(data)) {
        data.value = Object.freeze(data.value);
      }
      return data;
    };
    return isAsync(result) ? result.then((data) => freeze(data)) : freeze(result);
  }
  unwrap() {
    return this._def.innerType;
  }
}
ZodReadonly.create = (type, params) => {
  return new ZodReadonly({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodReadonly,
    ...processCreateParams(params)
  });
};
var ZodFirstPartyTypeKind;
(function(ZodFirstPartyTypeKind2) {
  ZodFirstPartyTypeKind2["ZodString"] = "ZodString";
  ZodFirstPartyTypeKind2["ZodNumber"] = "ZodNumber";
  ZodFirstPartyTypeKind2["ZodNaN"] = "ZodNaN";
  ZodFirstPartyTypeKind2["ZodBigInt"] = "ZodBigInt";
  ZodFirstPartyTypeKind2["ZodBoolean"] = "ZodBoolean";
  ZodFirstPartyTypeKind2["ZodDate"] = "ZodDate";
  ZodFirstPartyTypeKind2["ZodSymbol"] = "ZodSymbol";
  ZodFirstPartyTypeKind2["ZodUndefined"] = "ZodUndefined";
  ZodFirstPartyTypeKind2["ZodNull"] = "ZodNull";
  ZodFirstPartyTypeKind2["ZodAny"] = "ZodAny";
  ZodFirstPartyTypeKind2["ZodUnknown"] = "ZodUnknown";
  ZodFirstPartyTypeKind2["ZodNever"] = "ZodNever";
  ZodFirstPartyTypeKind2["ZodVoid"] = "ZodVoid";
  ZodFirstPartyTypeKind2["ZodArray"] = "ZodArray";
  ZodFirstPartyTypeKind2["ZodObject"] = "ZodObject";
  ZodFirstPartyTypeKind2["ZodUnion"] = "ZodUnion";
  ZodFirstPartyTypeKind2["ZodDiscriminatedUnion"] = "ZodDiscriminatedUnion";
  ZodFirstPartyTypeKind2["ZodIntersection"] = "ZodIntersection";
  ZodFirstPartyTypeKind2["ZodTuple"] = "ZodTuple";
  ZodFirstPartyTypeKind2["ZodRecord"] = "ZodRecord";
  ZodFirstPartyTypeKind2["ZodMap"] = "ZodMap";
  ZodFirstPartyTypeKind2["ZodSet"] = "ZodSet";
  ZodFirstPartyTypeKind2["ZodFunction"] = "ZodFunction";
  ZodFirstPartyTypeKind2["ZodLazy"] = "ZodLazy";
  ZodFirstPartyTypeKind2["ZodLiteral"] = "ZodLiteral";
  ZodFirstPartyTypeKind2["ZodEnum"] = "ZodEnum";
  ZodFirstPartyTypeKind2["ZodEffects"] = "ZodEffects";
  ZodFirstPartyTypeKind2["ZodNativeEnum"] = "ZodNativeEnum";
  ZodFirstPartyTypeKind2["ZodOptional"] = "ZodOptional";
  ZodFirstPartyTypeKind2["ZodNullable"] = "ZodNullable";
  ZodFirstPartyTypeKind2["ZodDefault"] = "ZodDefault";
  ZodFirstPartyTypeKind2["ZodCatch"] = "ZodCatch";
  ZodFirstPartyTypeKind2["ZodPromise"] = "ZodPromise";
  ZodFirstPartyTypeKind2["ZodBranded"] = "ZodBranded";
  ZodFirstPartyTypeKind2["ZodPipeline"] = "ZodPipeline";
  ZodFirstPartyTypeKind2["ZodReadonly"] = "ZodReadonly";
})(ZodFirstPartyTypeKind || (ZodFirstPartyTypeKind = {}));
const stringType = ZodString.create;
const numberType = ZodNumber.create;
ZodBigInt.create;
const booleanType = ZodBoolean.create;
ZodDate.create;
ZodNever.create;
const arrayType = ZodArray.create;
const objectType = ZodObject.create;
ZodUnion.create;
ZodIntersection.create;
ZodTuple.create;
const recordType = ZodRecord.create;
const enumType = ZodEnum.create;
ZodPromise.create;
ZodOptional.create;
ZodNullable.create;
const coerce = {
  string: (arg) => ZodString.create({ ...arg, coerce: true }),
  number: (arg) => ZodNumber.create({ ...arg, coerce: true }),
  boolean: (arg) => ZodBoolean.create({
    ...arg,
    coerce: true
  }),
  bigint: (arg) => ZodBigInt.create({ ...arg, coerce: true }),
  date: (arg) => ZodDate.create({ ...arg, coerce: true })
};
const __vite_import_meta_env__ = { "BASE_URL": "/", "DEV": false, "MODE": "production", "PROD": true, "SSR": false, "VITE_ADMIN_CATEGORY_NAMES": "Default", "VITE_BADGEHUB_API_BASE_URL": "https://api.example.invalid", "VITE_BADGE_SLUGS": "why2025,mch2022", "VITE_BASE_PATH": "/badgehub-app/pr-8/", "VITE_CATEGORY_NAMES": "Uncategorised,Event related,Games,Graphics,Hardware,Utility,Wearable,Data,Silly,Hacking,Troll,Unusable,Adult,Virus,SAO,Interpreter", "VITE_ENABLE_BROWSER_BACKEND": "true", "VITE_KEYCLOAK_BASE_URL": "https://auth.example.invalid", "VITE_KEYCLOAK_CLIENT_ID": "badgehub-frontend", "VITE_KEYCLOAK_REALM": "badgehub" };
var define_process_env_default = {};
const viteEnv = __vite_import_meta_env__ ?? {};
function getEnv(envVarName) {
  return (typeof process !== "undefined" ? define_process_env_default[envVarName] : void 0) ?? viteEnv[envVarName] ?? viteEnv[`VITE_${envVarName}`];
}
function getAndAssertEnv(envVarName) {
  const envVar = getEnv(envVarName);
  if (envVar == null) {
    throw new Error(
      `Environment variable [${envVarName}] is not set and is required.`
    );
  }
  return envVar;
}
function readBFFEnv() {
  return {
    keycloakPublic: {
      KEYCLOAK_BASE_URL: getAndAssertEnv("KEYCLOAK_BASE_URL"),
      KEYCLOAK_REALM: getEnv("KEYCLOAK_REALM") ?? "master",
      KEYCLOAK_CLIENT_ID: getEnv("KEYCLOAK_CLIENT_ID") ?? "badgehub-api-frontend"
    },
    BADGEHUB_API_BASE_URL: getAndAssertEnv("BADGEHUB_API_BASE_URL"),
    BADGE_SLUGS: (getEnv("BADGE_SLUGS") ?? "why2025,mch2022").split(","),
    CATEGORY_NAMES: [...(getEnv("CATEGORY_NAMES") ?? "Default").split(",")],
    ADMIN_CATEGORY_NAMES: (getEnv("ADMIN_CATEGORY_NAMES") ?? "Default").split(","),
    isDevEnvironment: (getEnv("NODE_ENV") ?? "") === "development"
  };
}
const getSharedConfig = () => {
  return globalThis.__SHARED_CONFIG__ ?? readBFFEnv();
};
const badgeSlugSchema = enumType(getBadgeSlugs()).describe("badge slug");
function getBadgeSlugs() {
  return getSharedConfig().BADGE_SLUGS;
}
const sharedConfig = getSharedConfig();
const categoryNameSchema = enumType(getAllCategoryNames());
function getAllCategoryNames() {
  return [...sharedConfig.CATEGORY_NAMES, ...sharedConfig.ADMIN_CATEGORY_NAMES];
}
function getAdminOnlyCategoryNames() {
  return sharedConfig.ADMIN_CATEGORY_NAMES;
}
const variantJSONSchema = objectType({
  revision: coerce.number().int().nonnegative().optional().describe(`Revision of the project for this variant. If it is not present, then the revision of the project should be used.
Warning: if it is present, then badgehub clients on badges will not update the app unless the this revision number is increased.`),
  type: stringType().optional().describe(
    "the type of the application variant, eg 'standalone', 'badge_vms', 'appfs', 'micropython', 'circuitpython', ..."
  ),
  // Only useful for projects with project_type "application".
  executable: stringType().optional().describe(
    `Path to the source_file path of the file that should be executed to launch an app.
If the executable property is not present, then it can be guessed by the badge firmware (eg. case of only one file with correct extension, or case of __init__.py file in micropython app.`
  ),
  args: arrayType(stringType()).optional(),
  assets: arrayType(
    objectType({
      source_file: stringType().describe("Path to the source file, relative to the project root"),
      destination_file: stringType().optional().describe("Path to the destination file in the badge's filesystem")
    })
  ).optional().describe(`List of assets that are part of the variant, with optionally an indication of how the files should be mapped on the badge. 
if the assets property is not present, then all project files should be considered part of the variant.`),
  badges: arrayType(badgeSlugSchema).optional().describe(
    "list of badges that that this variant is made for. This should be subset of the badges in the top level appmetadata.json and it should not overlap with any other variants."
  )
});
const iconMapSchema = objectType({
  "8x8": stringType().optional(),
  "16x16": stringType().optional(),
  "32x32": stringType().optional(),
  "64x64": stringType().optional()
}).describe(
  `Icon Map of the project that maps from accepted sizes to a file path. Icon format is quite strict because BadgeHub is the first user of these icons.
    Badge implementations can use these icons but they are not required to. For example if a badge's launcher an icon as an icon.py file, this file can still just be uploaded and the path could be indicated as custom property in the variant json.".`
);
recordType(
  badgeSlugSchema,
  stringType().optional().describe("Path to the json file for this variant")
).describe(
  `Map from badge slug to variant information, allows knowing if a variant is updated and where to find the json file for it.
This is used to determine if a variant is updated and where to find the json file for it.
The variant with the highest revision number determines the latest revision of the project.`
);
const appMetadataJSONSchema = objectType({
  project_type: enumType(["app", "library", "firmware", "other"]).optional().describe("Type of the project, eg. 'app' or 'library'"),
  git_url: stringType().optional(),
  hidden: booleanType().describe(
    "Whether the project should be hidden from the launcher and from discovery on BadgeHub. Note that this does not make it private, just harder to find."
  ).optional(),
  name: stringType().optional().describe("name, we need this to show in the launcher and on badgehub."),
  description: stringType().optional().describe(
    "Some more details about the app. Allows users to decide whether they want to install the app."
  ),
  categories: arrayType(categoryNameSchema).optional().describe(
    "Categories that the app falls into, eg. 'Event Related'. Categories are defined by the specific badgehub instance's config."
  ),
  author: stringType().optional().describe("Name of the author of the project"),
  icon_map: iconMapSchema.optional(),
  license_file: stringType().optional().describe("Path to the License file. Default is LICENSE"),
  license_type: stringType().optional().describe("Short description of the license type, eg. 'MIT'"),
  version: stringType().optional().describe("Semantic version of the project"),
  badges: arrayType(stringType()).optional().describe("list of badges that are compatible with this project."),
  application: arrayType(variantJSONSchema).optional().describe(
    "A list of application variants that allows specifying badge-specific properties of the project"
  )
});
const isoDateStringSchema = stringType().endsWith("Z");
const datedDataSchema = objectType({
  created_at: isoDateStringSchema,
  updated_at: isoDateStringSchema
});
const fileMetadataSchema = datedDataSchema.extend({
  dir: stringType(),
  name: stringType(),
  ext: stringType(),
  mimetype: stringType(),
  image_width: numberType().optional(),
  image_height: numberType().optional(),
  size_of_content: numberType(),
  sha256: stringType().regex(/^[a-f0-9]{64}$/),
  // Lowercase hex sha256 digest
  size_formatted: stringType(),
  // Human readable size_of_content
  full_path: stringType(),
  // full path of file with filename and extensions (dir+'/'+name+'.'+ext)
  url: stringType().describe("Url that should be used to download the file")
});
const versionSchema = objectType({
  revision: numberType(),
  // zip: z.string().optional().nullable(),
  // size_of_zip: z.number().optional().nullable(),
  // git_commit_id: z.string().optional().nullable(),
  files: arrayType(fileMetadataSchema),
  app_metadata: appMetadataJSONSchema,
  published_at: isoDateStringSchema.optional().nullable(),
  // download_count: z.coerce.number(),
  project_slug: stringType().optional().nullable()
  // Project slug
});
enumType([
  "working",
  "in_progress",
  "broken",
  "unknown"
]);
const projectCoreSchema = objectType({
  slug: stringType(),
  idp_user_id: stringType(),
  latest_revision: numberType().optional().nullable()
});
const detailedProjectSchema = projectCoreSchema.extend({
  version: versionSchema
  // author: z.object({ name: z.string() }).optional().nullable(),
}).extend(datedDataSchema.shape);
const ONE_KILO = 1024;
function dbDateToISO(s) {
  if (s == null) return void 0;
  const normalized = s.includes("T") ? s : s.replace(" ", "T") + "Z";
  return new Date(normalized).toISOString();
}
function joinPath(...parts) {
  return parts.filter(Boolean).join("/");
}
function parsePath(pathParts) {
  const full = pathParts.join("/");
  const lastSlash = full.lastIndexOf("/");
  const filename = lastSlash >= 0 ? full.slice(lastSlash + 1) : full;
  const dir = lastSlash >= 0 ? full.slice(0, lastSlash) : "";
  const lastDot = filename.lastIndexOf(".");
  if (lastDot <= 0) return { dir, name: filename, ext: "" };
  return { dir, name: filename.slice(0, lastDot), ext: filename.slice(lastDot) };
}
class SQLiteBadgeHubMetadata {
  constructor(db, buildFileUrl) {
    this.db = db;
    this.buildFileUrl = buildFileUrl;
  }
  async insertProject(project, mockDates) {
    const createdAt = (mockDates == null ? void 0 : mockDates.created_at) ?? null;
    const updatedAt = (mockDates == null ? void 0 : mockDates.updated_at) ?? null;
    this.db.run`
      INSERT INTO projects (slug, git, idp_user_id, created_at, updated_at, deleted_at)
      VALUES (${project.slug}, ${project.git ?? null}, ${project.idp_user_id},
              COALESCE(${createdAt}, CURRENT_TIMESTAMP),
              COALESCE(${updatedAt}, CURRENT_TIMESTAMP), NULL)
      ON CONFLICT(slug)
      DO UPDATE SET
        git = excluded.git,
        idp_user_id = excluded.idp_user_id,
        updated_at = COALESCE(excluded.updated_at, CURRENT_TIMESTAMP),
        deleted_at = NULL`;
    this.db.run`
      INSERT INTO versions (project_slug, revision, app_metadata, published_at)
      VALUES (${project.slug}, 1, '{}', NULL)
      ON CONFLICT(project_slug, revision) DO NOTHING`;
    this.db.run`
      UPDATE projects
      SET draft_revision = COALESCE(draft_revision, 1),
          latest_revision = NULL
      WHERE slug = ${project.slug}`;
  }
  async updateProject(projectSlug, changes) {
    const allowedKeys = /* @__PURE__ */ new Set(["git", "latest_revision", "draft_revision", "idp_user_id", "deleted_at"]);
    const entries = Object.entries(changes).filter(([, value]) => value !== void 0).filter(([key]) => allowedKeys.has(key));
    if (!entries.length) return;
    const setSql = entries.map(([key]) => `${key} = ?`).join(", ");
    const values = entries.map(([, value]) => value);
    this.db.runRaw(
      `UPDATE projects SET ${setSql}, updated_at = CURRENT_TIMESTAMP WHERE slug = ?`,
      [...values, projectSlug]
    );
  }
  async deleteProject(projectSlug) {
    this.db.run`UPDATE projects SET deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE slug = ${projectSlug}`;
  }
  async publishVersion(projectSlug, mockDate) {
    const publishAt = mockDate ?? null;
    const project = this.db.get`
      SELECT draft_revision FROM projects WHERE slug = ${projectSlug} AND deleted_at IS NULL`;
    if (!project || project.draft_revision === null) {
      throw new Error(`Project draft not found: ${projectSlug}`);
    }
    this.db.run`
      UPDATE versions
      SET published_at = COALESCE(${publishAt}, CURRENT_TIMESTAMP),
          updated_at = COALESCE(${publishAt}, CURRENT_TIMESTAMP)
      WHERE project_slug = ${projectSlug} AND revision = ${project.draft_revision}`;
    const nextDraftRevision = project.draft_revision + 1;
    this.db.run`
      INSERT INTO versions (project_slug, revision, app_metadata, published_at)
      SELECT project_slug, ${nextDraftRevision}, app_metadata, NULL
      FROM versions
      WHERE project_slug = ${projectSlug} AND revision = ${project.draft_revision}
      ON CONFLICT(project_slug, revision) DO NOTHING`;
    this.db.run`
      INSERT INTO files (version_id, dir, name, ext, mimetype, size_of_content, sha256,
                         image_width, image_height, created_at, updated_at, deleted_at)
      SELECT vTo.id, f.dir, f.name, f.ext, f.mimetype, f.size_of_content, f.sha256,
             f.image_width, f.image_height,
             COALESCE(${publishAt}, CURRENT_TIMESTAMP),
             COALESCE(${publishAt}, CURRENT_TIMESTAMP),
             f.deleted_at
      FROM files f
      JOIN versions vFrom ON vFrom.id = f.version_id
      JOIN versions vTo ON vTo.project_slug = vFrom.project_slug AND vTo.revision = ${nextDraftRevision}
      WHERE vFrom.project_slug = ${projectSlug} AND vFrom.revision = ${project.draft_revision}`;
    this.db.run`
      UPDATE projects
      SET latest_revision = ${project.draft_revision}, draft_revision = ${nextDraftRevision}
      WHERE slug = ${projectSlug}`;
  }
  async getProject(projectSlug, versionRevision) {
    const project = this.db.get`SELECT slug, idp_user_id, latest_revision, created_at, updated_at
       FROM projects WHERE slug = ${projectSlug} AND deleted_at IS NULL`;
    if (!project) return void 0;
    let versionRow;
    if (typeof versionRevision === "number") {
      versionRow = this.db.get`
        SELECT revision, app_metadata, published_at
        FROM versions
        WHERE project_slug = ${projectSlug} AND revision = ${versionRevision}`;
    } else {
      versionRow = this.db.get`
        SELECT revision, app_metadata, published_at
        FROM versions
        WHERE project_slug = ${projectSlug}
          AND revision = (
            SELECT CASE WHEN ${versionRevision} = 'draft' THEN draft_revision ELSE latest_revision END
            FROM projects WHERE slug = ${projectSlug}
          )`;
    }
    if (!versionRow) return void 0;
    if (typeof versionRevision === "number" && (versionRevision <= 0 || !versionRow.published_at)) {
      return void 0;
    }
    const files = this.db.all`SELECT dir, name, ext, mimetype, size_of_content, sha256,
              image_width, image_height, created_at, updated_at
       FROM files
       WHERE version_id = (SELECT id FROM versions WHERE project_slug = ${projectSlug} AND revision = ${versionRow.revision})
         AND deleted_at IS NULL`;
    const revision = versionRow.revision;
    const publishedAt = versionRow.published_at;
    return detailedProjectSchema.parse({
      slug: project.slug,
      idp_user_id: project.idp_user_id,
      latest_revision: project.latest_revision,
      created_at: dbDateToISO(project.created_at),
      updated_at: dbDateToISO(project.updated_at),
      version: {
        revision,
        project_slug: project.slug,
        app_metadata: JSON.parse(versionRow.app_metadata || "{}"),
        published_at: dbDateToISO(publishedAt),
        files: files.map((f) => {
          const full_path = joinPath(f.dir, f.name + f.ext);
          return {
            dir: f.dir,
            name: f.name,
            ext: f.ext,
            mimetype: f.mimetype,
            size_of_content: Number(f.size_of_content),
            sha256: f.sha256,
            image_width: f.image_width ?? void 0,
            image_height: f.image_height ?? void 0,
            created_at: dbDateToISO(f.created_at),
            updated_at: dbDateToISO(f.updated_at),
            size_formatted: (Number(f.size_of_content) / ONE_KILO).toFixed(2) + "KB",
            full_path,
            url: this.buildFileUrl(project.slug, publishedAt ? revision : "draft", full_path)
          };
        })
      }
    });
  }
  async getFileMetadata(projectSlug, versionRevision, filePath) {
    const { dir, name, ext } = parsePath(filePath.split("/"));
    const row = this.db.get`SELECT f.*, v.revision, v.published_at
       FROM files f
       JOIN versions v ON v.id = f.version_id
       WHERE v.project_slug = ${projectSlug}
         AND v.revision = (
           SELECT CASE
                    WHEN ${versionRevision} = 'draft'  THEN draft_revision
                    WHEN ${versionRevision} = 'latest' THEN latest_revision
                    ELSE ${versionRevision}
                  END
           FROM projects WHERE slug = ${projectSlug}
         )
         AND f.dir = ${dir}
         AND f.name = ${name}
         AND f.ext = ${ext}
         AND f.deleted_at IS NULL`;
    if (!row) return void 0;
    if (typeof versionRevision === "number" && (versionRevision <= 0 || !row.published_at)) {
      return void 0;
    }
    const full_path = joinPath(row.dir, row.name + row.ext);
    return {
      dir: row.dir,
      name: row.name,
      ext: row.ext,
      mimetype: row.mimetype,
      size_of_content: Number(row.size_of_content),
      sha256: row.sha256,
      image_width: row.image_width ?? void 0,
      image_height: row.image_height ?? void 0,
      created_at: dbDateToISO(row.created_at),
      updated_at: dbDateToISO(row.updated_at),
      size_formatted: (Number(row.size_of_content) / ONE_KILO).toFixed(2) + "KB",
      full_path,
      url: this.buildFileUrl(projectSlug, row.published_at ? row.revision : "draft", full_path)
    };
  }
  async getBadges() {
    return getBadgeSlugs();
  }
  async getCategories() {
    return getAllCategoryNames();
  }
  async refreshReports() {
  }
  async getStats() {
    const count = (strings, ...values) => {
      const row = this.db.get(strings, ...values);
      return Number((row == null ? void 0 : row.count) ?? 0);
    };
    return {
      projects: count`SELECT COUNT(*) AS count FROM projects WHERE deleted_at IS NULL`,
      installs: count`SELECT COUNT(*) AS count FROM event_reports WHERE event_type = ${"install_count"}`,
      launches: count`SELECT COUNT(*) AS count FROM event_reports WHERE event_type = ${"launch_count"}`,
      crashes: count`SELECT COUNT(*) AS count FROM event_reports WHERE event_type = ${"crash_count"}`,
      installed_projects: count`SELECT COUNT(DISTINCT project_slug) AS count FROM event_reports WHERE event_type = ${"install_count"}`,
      launched_projects: count`SELECT COUNT(DISTINCT project_slug) AS count FROM event_reports WHERE event_type = ${"launch_count"}`,
      crashed_projects: count`SELECT COUNT(DISTINCT project_slug) AS count FROM event_reports WHERE event_type = ${"crash_count"}`,
      authors: count`SELECT COUNT(DISTINCT idp_user_id) AS count FROM projects WHERE deleted_at IS NULL AND idp_user_id IS NOT NULL`,
      badges: count`SELECT COUNT(*) AS count FROM registered_badges`
    };
  }
  async getProjectSummaries(query, revision) {
    var _a2, _b2;
    const revisionCol = safe(revision === "draft" ? "p.draft_revision" : "p.latest_revision");
    const rows = this.db.all`SELECT p.slug,
              p.idp_user_id,
              p.created_at,
              p.updated_at,
              p.git,
              v.revision,
              v.published_at,
              v.app_metadata,
              (
                SELECT COUNT(DISTINCT er.badge_id)
                FROM event_reports er
                WHERE er.project_slug = p.slug
                  AND er.event_type = 'install_count'
              ) AS distinct_installs
       FROM projects p
       LEFT JOIN versions v ON v.project_slug = p.slug AND v.revision = ${revisionCol}
       WHERE p.deleted_at IS NULL`;
    let summaries = rows.filter((r) => r.revision !== null).map((r) => {
      const metadata = JSON.parse(r.app_metadata || "{}");
      const effectiveRevision = r.revision;
      const categories = Array.isArray(metadata.categories) ? metadata.categories.length > 0 ? metadata.categories : ["Uncategorised"] : metadata.categories;
      return {
        slug: r.slug,
        idp_user_id: r.idp_user_id,
        name: metadata.name ?? r.slug,
        published_at: dbDateToISO(r.published_at ?? void 0) ?? void 0,
        installs: Number(r.distinct_installs ?? 0),
        icon_map: metadata.icon_map ? Object.fromEntries(
          Object.entries(metadata.icon_map).map(([key, fullPath]) => [
            key,
            {
              full_path: String(fullPath),
              url: this.buildFileUrl(r.slug, r.published_at ? effectiveRevision : "draft", String(fullPath))
            }
          ])
        ) : void 0,
        license_type: metadata.license_type,
        categories,
        badges: metadata.badges,
        description: metadata.description,
        revision: effectiveRevision,
        hidden: metadata.hidden
      };
    });
    if (revision === "latest") {
      summaries = summaries.filter((s) => Boolean(s.published_at));
      if (!((_a2 = query.slugs) == null ? void 0 : _a2.length)) {
        summaries = summaries.filter((s) => !s.hidden);
      }
    }
    if (query.badge) summaries = summaries.filter((s) => {
      var _a3;
      return (_a3 = s.badges) == null ? void 0 : _a3.includes(query.badge);
    });
    if (query.category) summaries = summaries.filter((s) => {
      var _a3;
      return (_a3 = s.categories) == null ? void 0 : _a3.includes(query.category);
    });
    if (query.search) {
      const searchLower = query.search.toLowerCase();
      summaries = summaries.filter((s) => {
        const text = [s.name, s.description ?? "", ...s.categories ?? []].join(" ").toLowerCase();
        return text.includes(searchLower);
      });
    }
    if ((_b2 = query.slugs) == null ? void 0 : _b2.length) summaries = summaries.filter((s) => query.slugs.includes(s.slug));
    if (query.userId) summaries = summaries.filter((s) => s.idp_user_id === query.userId);
    if (query.orderBy === "installs") summaries.sort((a, b) => b.installs - a.installs);
    if (query.orderBy === "published_at") summaries.sort((a, b) => (b.published_at ?? "").localeCompare(a.published_at ?? ""));
    if (query.orderBy === "updated_at") summaries.sort((a, b) => b.revision - a.revision);
    const start = query.pageStart ?? 0;
    const end = query.pageLength ? start + query.pageLength : void 0;
    return summaries.slice(start, end);
  }
  async updateDraftMetadata(slug, newAppMetadata, _mockDates) {
    this.db.run`
      UPDATE versions
      SET app_metadata = ${JSON.stringify(newAppMetadata ?? {})}, updated_at = CURRENT_TIMESTAMP
      WHERE project_slug = ${slug}
        AND revision = (SELECT draft_revision FROM projects WHERE slug = ${slug})`;
  }
  async writeDraftFileMetadata(slug, pathParts, uploadedFile, sha256, _mockDates) {
    const { dir, name, ext } = parsePath(pathParts);
    this.db.run`
      INSERT INTO files (version_id, dir, name, ext, mimetype, size_of_content, sha256,
                         image_width, image_height, deleted_at)
      VALUES (
        (SELECT id FROM versions
         WHERE project_slug = ${slug}
           AND revision = (SELECT draft_revision FROM projects WHERE slug = ${slug})),
        ${dir}, ${name}, ${ext},
        ${uploadedFile.mimetype}, ${uploadedFile.size}, ${sha256},
        ${uploadedFile.image_width ?? null}, ${uploadedFile.image_height ?? null},
        NULL
      )
      ON CONFLICT(version_id, dir, name, ext)
      DO UPDATE SET
        mimetype = excluded.mimetype,
        size_of_content = excluded.size_of_content,
        sha256 = excluded.sha256,
        image_width = excluded.image_width,
        image_height = excluded.image_height,
        deleted_at = NULL,
        updated_at = CURRENT_TIMESTAMP`;
  }
  async deleteDraftFile(slug, filePath) {
    const { dir, name, ext } = parsePath(filePath.split("/"));
    this.db.run`
      UPDATE files
      SET deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
      WHERE version_id = (
        SELECT id FROM versions
        WHERE project_slug = ${slug}
          AND revision = (SELECT draft_revision FROM projects WHERE slug = ${slug})
      )
        AND dir = ${dir}
        AND name = ${name}
        AND ext = ${ext}`;
  }
  async registerBadge(flashId, mac) {
    this.db.run`
      INSERT INTO registered_badges (id, mac)
      VALUES (${flashId}, ${mac ?? null})
      ON CONFLICT(id)
      DO UPDATE SET
        mac = COALESCE(registered_badges.mac, excluded.mac),
        last_seen_at = CURRENT_TIMESTAMP`;
  }
  async reportEvent(slug, revision, badgeId, eventType) {
    this.db.run`INSERT INTO event_reports (project_slug, revision, badge_id, event_type)
                VALUES (${slug}, ${revision}, ${badgeId}, ${eventType})`;
  }
  async writeFileContent(sha256, content) {
    this.db.run`INSERT OR IGNORE INTO file_contents (sha256, content) VALUES (${sha256}, ${content})`;
  }
  async getFileContentBySha256(sha256) {
    const row = this.db.get`SELECT content FROM file_contents WHERE sha256 = ${sha256}`;
    return row == null ? void 0 : row.content;
  }
  async revokeProjectApiToken(slug) {
    this.db.run`DELETE FROM project_api_token WHERE project_slug = ${slug}`;
  }
  async getProjectApiTokenMetadata(slug) {
    return this.db.get`SELECT created_at, last_used_at FROM project_api_token WHERE project_slug = ${slug}`;
  }
  async createProjectApiToken(slug, tokenHash) {
    this.db.run`
      INSERT INTO project_api_token (project_slug, key_hash, created_at, last_used_at)
      VALUES (${slug}, ${tokenHash}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      ON CONFLICT(project_slug)
      DO UPDATE SET
        key_hash = excluded.key_hash,
        created_at = CURRENT_TIMESTAMP,
        last_used_at = CURRENT_TIMESTAMP`;
  }
  async getProjectApiTokenHash(slug) {
    const row = this.db.get`SELECT key_hash FROM project_api_token WHERE project_slug = ${slug}`;
    return row == null ? void 0 : row.key_hash;
  }
}
const BADGEHUB_SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS projects (
    slug TEXT PRIMARY KEY,
    git TEXT,
    idp_user_id TEXT,
    latest_revision INTEGER,
    draft_revision INTEGER,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TEXT
  );

  CREATE TABLE IF NOT EXISTS registered_badges (
    id TEXT PRIMARY KEY,
    mac TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_seen_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS project_api_token (
    project_slug TEXT PRIMARY KEY,
    key_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_used_at TEXT
  );

  CREATE TABLE IF NOT EXISTS versions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_slug TEXT NOT NULL,
    revision INTEGER NOT NULL,
    app_metadata TEXT NOT NULL DEFAULT '{}',
    published_at TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(project_slug, revision)
  );

  CREATE TABLE IF NOT EXISTS files (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    version_id INTEGER NOT NULL,
    dir TEXT NOT NULL,
    name TEXT NOT NULL,
    ext TEXT NOT NULL,
    mimetype TEXT NOT NULL,
    size_of_content TEXT NOT NULL,
    sha256 TEXT NOT NULL,
    image_width INTEGER,
    image_height INTEGER,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TEXT,
    UNIQUE(version_id, dir, name, ext)
  );

  CREATE TABLE IF NOT EXISTS file_contents (
    sha256 TEXT PRIMARY KEY,
    content BLOB NOT NULL
  );

  CREATE TABLE IF NOT EXISTS event_reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_slug TEXT NOT NULL,
    revision INTEGER NOT NULL,
    badge_id TEXT NOT NULL,
    event_type TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`;
class PreviewBadgeHubData {
  constructor(metadata) {
    this.metadata = metadata;
  }
  getBadges() {
    return this.metadata.getBadges();
  }
  getCategories() {
    return this.metadata.getCategories();
  }
  getStats() {
    return this.metadata.getStats();
  }
  registerBadge(id, mac) {
    return this.metadata.registerBadge(id, mac);
  }
  getProject(slug, revision) {
    return this.metadata.getProject(slug, revision);
  }
  getProjectSummaries(query, revision) {
    return this.metadata.getProjectSummaries(query, revision);
  }
  async getFileContents(slug, revision, filePath) {
    const meta = await this.metadata.getFileMetadata(slug, revision, filePath);
    if (!meta) return void 0;
    return this.metadata.getFileContentBySha256(meta.sha256);
  }
  async insertProject(_project) {
  }
  async publishVersion(_slug) {
  }
  async reportInstall() {
  }
  async reportLaunch() {
  }
  async reportCrash() {
  }
}
var compose = (middleware, onError, onNotFound) => {
  return (context, next) => {
    let index = -1;
    return dispatch(0);
    async function dispatch(i) {
      if (i <= index) {
        throw new Error("next() called multiple times");
      }
      index = i;
      let res;
      let isError = false;
      let handler;
      if (middleware[i]) {
        handler = middleware[i][0][0];
        context.req.routeIndex = i;
      } else {
        handler = i === middleware.length && next || void 0;
      }
      if (handler) {
        try {
          res = await handler(context, () => dispatch(i + 1));
        } catch (err) {
          if (err instanceof Error && onError) {
            context.error = err;
            res = await onError(err, context);
            isError = true;
          } else {
            throw err;
          }
        }
      } else {
        if (context.finalized === false && onNotFound) {
          res = await onNotFound(context);
        }
      }
      if (res && (context.finalized === false || isError)) {
        context.res = res;
      }
      return context;
    }
  };
};
var GET_MATCH_RESULT = /* @__PURE__ */ Symbol();
var parseBody = async (request, options = /* @__PURE__ */ Object.create(null)) => {
  const { all = false, dot = false } = options;
  const headers = request instanceof HonoRequest ? request.raw.headers : request.headers;
  const contentType = headers.get("Content-Type");
  if ((contentType == null ? void 0 : contentType.startsWith("multipart/form-data")) || (contentType == null ? void 0 : contentType.startsWith("application/x-www-form-urlencoded"))) {
    return parseFormData(request, { all, dot });
  }
  return {};
};
async function parseFormData(request, options) {
  const formData = await request.formData();
  if (formData) {
    return convertFormDataToBodyData(formData, options);
  }
  return {};
}
function convertFormDataToBodyData(formData, options) {
  const form = /* @__PURE__ */ Object.create(null);
  formData.forEach((value, key) => {
    const shouldParseAllValues = options.all || key.endsWith("[]");
    if (!shouldParseAllValues) {
      form[key] = value;
    } else {
      handleParsingAllValues(form, key, value);
    }
  });
  if (options.dot) {
    Object.entries(form).forEach(([key, value]) => {
      const shouldParseDotValues = key.includes(".");
      if (shouldParseDotValues) {
        handleParsingNestedValues(form, key, value);
        delete form[key];
      }
    });
  }
  return form;
}
var handleParsingAllValues = (form, key, value) => {
  if (form[key] !== void 0) {
    if (Array.isArray(form[key])) {
      form[key].push(value);
    } else {
      form[key] = [form[key], value];
    }
  } else {
    if (!key.endsWith("[]")) {
      form[key] = value;
    } else {
      form[key] = [value];
    }
  }
};
var handleParsingNestedValues = (form, key, value) => {
  let nestedForm = form;
  const keys = key.split(".");
  keys.forEach((key2, index) => {
    if (index === keys.length - 1) {
      nestedForm[key2] = value;
    } else {
      if (!nestedForm[key2] || typeof nestedForm[key2] !== "object" || Array.isArray(nestedForm[key2]) || nestedForm[key2] instanceof File) {
        nestedForm[key2] = /* @__PURE__ */ Object.create(null);
      }
      nestedForm = nestedForm[key2];
    }
  });
};
var splitPath = (path) => {
  const paths = path.split("/");
  if (paths[0] === "") {
    paths.shift();
  }
  return paths;
};
var splitRoutingPath = (routePath) => {
  const { groups, path } = extractGroupsFromPath(routePath);
  const paths = splitPath(path);
  return replaceGroupMarks(paths, groups);
};
var extractGroupsFromPath = (path) => {
  const groups = [];
  path = path.replace(/\{[^}]+\}/g, (match2, index) => {
    const mark = `@${index}`;
    groups.push([mark, match2]);
    return mark;
  });
  return { groups, path };
};
var replaceGroupMarks = (paths, groups) => {
  for (let i = groups.length - 1; i >= 0; i--) {
    const [mark] = groups[i];
    for (let j = paths.length - 1; j >= 0; j--) {
      if (paths[j].includes(mark)) {
        paths[j] = paths[j].replace(mark, groups[i][1]);
        break;
      }
    }
  }
  return paths;
};
var patternCache = {};
var getPattern = (label, next) => {
  if (label === "*") {
    return "*";
  }
  const match2 = label.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
  if (match2) {
    const cacheKey = `${label}#${next}`;
    if (!patternCache[cacheKey]) {
      if (match2[2]) {
        patternCache[cacheKey] = next && next[0] !== ":" && next[0] !== "*" ? [cacheKey, match2[1], new RegExp(`^${match2[2]}(?=/${next})`)] : [label, match2[1], new RegExp(`^${match2[2]}$`)];
      } else {
        patternCache[cacheKey] = [label, match2[1], true];
      }
    }
    return patternCache[cacheKey];
  }
  return null;
};
var tryDecode = (str, decoder) => {
  try {
    return decoder(str);
  } catch {
    return str.replace(/(?:%[0-9A-Fa-f]{2})+/g, (match2) => {
      try {
        return decoder(match2);
      } catch {
        return match2;
      }
    });
  }
};
var tryDecodeURI = (str) => tryDecode(str, decodeURI);
var getPath = (request) => {
  const url = request.url;
  const start = url.indexOf("/", url.indexOf(":") + 4);
  let i = start;
  for (; i < url.length; i++) {
    const charCode = url.charCodeAt(i);
    if (charCode === 37) {
      const queryIndex = url.indexOf("?", i);
      const hashIndex = url.indexOf("#", i);
      const end = queryIndex === -1 ? hashIndex === -1 ? void 0 : hashIndex : hashIndex === -1 ? queryIndex : Math.min(queryIndex, hashIndex);
      const path = url.slice(start, end);
      return tryDecodeURI(path.includes("%25") ? path.replace(/%25/g, "%2525") : path);
    } else if (charCode === 63 || charCode === 35) {
      break;
    }
  }
  return url.slice(start, i);
};
var getPathNoStrict = (request) => {
  const result = getPath(request);
  return result.length > 1 && result.at(-1) === "/" ? result.slice(0, -1) : result;
};
var mergePath = (base, sub, ...rest) => {
  if (rest.length) {
    sub = mergePath(sub, ...rest);
  }
  return `${(base == null ? void 0 : base[0]) === "/" ? "" : "/"}${base}${sub === "/" ? "" : `${(base == null ? void 0 : base.at(-1)) === "/" ? "" : "/"}${(sub == null ? void 0 : sub[0]) === "/" ? sub.slice(1) : sub}`}`;
};
var checkOptionalParameter = (path) => {
  if (path.charCodeAt(path.length - 1) !== 63 || !path.includes(":")) {
    return null;
  }
  const segments = path.split("/");
  const results = [];
  let basePath = "";
  segments.forEach((segment) => {
    if (segment !== "" && !/\:/.test(segment)) {
      basePath += "/" + segment;
    } else if (/\:/.test(segment)) {
      if (/\?/.test(segment)) {
        if (results.length === 0 && basePath === "") {
          results.push("/");
        } else {
          results.push(basePath);
        }
        const optionalSegment = segment.replace("?", "");
        basePath += "/" + optionalSegment;
        results.push(basePath);
      } else {
        basePath += "/" + segment;
      }
    }
  });
  return results.filter((v, i, a) => a.indexOf(v) === i);
};
var _decodeURI = (value) => {
  if (!/[%+]/.test(value)) {
    return value;
  }
  if (value.indexOf("+") !== -1) {
    value = value.replace(/\+/g, " ");
  }
  return value.indexOf("%") !== -1 ? tryDecode(value, decodeURIComponent_) : value;
};
var _getQueryParam = (url, key, multiple) => {
  let encoded;
  if (!multiple && key && !/[%+]/.test(key)) {
    let keyIndex2 = url.indexOf("?", 8);
    if (keyIndex2 === -1) {
      return void 0;
    }
    if (!url.startsWith(key, keyIndex2 + 1)) {
      keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
    }
    while (keyIndex2 !== -1) {
      const trailingKeyCode = url.charCodeAt(keyIndex2 + key.length + 1);
      if (trailingKeyCode === 61) {
        const valueIndex = keyIndex2 + key.length + 2;
        const endIndex = url.indexOf("&", valueIndex);
        return _decodeURI(url.slice(valueIndex, endIndex === -1 ? void 0 : endIndex));
      } else if (trailingKeyCode == 38 || isNaN(trailingKeyCode)) {
        return "";
      }
      keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
    }
    encoded = /[%+]/.test(url);
    if (!encoded) {
      return void 0;
    }
  }
  const results = {};
  encoded ?? (encoded = /[%+]/.test(url));
  let keyIndex = url.indexOf("?", 8);
  while (keyIndex !== -1) {
    const nextKeyIndex = url.indexOf("&", keyIndex + 1);
    let valueIndex = url.indexOf("=", keyIndex);
    if (valueIndex > nextKeyIndex && nextKeyIndex !== -1) {
      valueIndex = -1;
    }
    let name = url.slice(
      keyIndex + 1,
      valueIndex === -1 ? nextKeyIndex === -1 ? void 0 : nextKeyIndex : valueIndex
    );
    if (encoded) {
      name = _decodeURI(name);
    }
    keyIndex = nextKeyIndex;
    if (name === "") {
      continue;
    }
    let value;
    if (valueIndex === -1) {
      value = "";
    } else {
      value = url.slice(valueIndex + 1, nextKeyIndex === -1 ? void 0 : nextKeyIndex);
      if (encoded) {
        value = _decodeURI(value);
      }
    }
    if (multiple) {
      if (!(results[name] && Array.isArray(results[name]))) {
        results[name] = [];
      }
      results[name].push(value);
    } else {
      results[name] ?? (results[name] = value);
    }
  }
  return key ? results[key] : results;
};
var getQueryParam = _getQueryParam;
var getQueryParams = (url, key) => {
  return _getQueryParam(url, key, true);
};
var decodeURIComponent_ = decodeURIComponent;
var tryDecodeURIComponent = (str) => tryDecode(str, decodeURIComponent_);
var HonoRequest = (_a = class {
  constructor(request, path = "/", matchResult = [[]]) {
    __privateAdd(this, _HonoRequest_instances);
    /**
     * `.raw` can get the raw Request object.
     *
     * @see {@link https://hono.dev/docs/api/request#raw}
     *
     * @example
     * ```ts
     * // For Cloudflare Workers
     * app.post('/', async (c) => {
     *   const metadata = c.req.raw.cf?.hostMetadata?
     *   ...
     * })
     * ```
     */
    __publicField(this, "raw");
    __privateAdd(this, _validatedData);
    // Short name of validatedData
    __privateAdd(this, _matchResult);
    __publicField(this, "routeIndex", 0);
    /**
     * `.path` can get the pathname of the request.
     *
     * @see {@link https://hono.dev/docs/api/request#path}
     *
     * @example
     * ```ts
     * app.get('/about/me', (c) => {
     *   const pathname = c.req.path // `/about/me`
     * })
     * ```
     */
    __publicField(this, "path");
    __publicField(this, "bodyCache", {});
    __privateAdd(this, _cachedBody, (key) => {
      const { bodyCache, raw } = this;
      const cachedBody = bodyCache[key];
      if (cachedBody) {
        return cachedBody;
      }
      const anyCachedKey = Object.keys(bodyCache)[0];
      if (anyCachedKey) {
        return bodyCache[anyCachedKey].then((body) => {
          if (anyCachedKey === "json") {
            body = JSON.stringify(body);
          }
          return new Response(body)[key]();
        });
      }
      return bodyCache[key] = raw[key]();
    });
    this.raw = request;
    this.path = path;
    __privateSet(this, _matchResult, matchResult);
    __privateSet(this, _validatedData, {});
  }
  param(key) {
    return key ? __privateMethod(this, _HonoRequest_instances, getDecodedParam_fn).call(this, key) : __privateMethod(this, _HonoRequest_instances, getAllDecodedParams_fn).call(this);
  }
  query(key) {
    return getQueryParam(this.url, key);
  }
  queries(key) {
    return getQueryParams(this.url, key);
  }
  header(name) {
    if (name) {
      return this.raw.headers.get(name) ?? void 0;
    }
    const headerData = {};
    this.raw.headers.forEach((value, key) => {
      headerData[key] = value;
    });
    return headerData;
  }
  async parseBody(options) {
    var _a2;
    return (_a2 = this.bodyCache).parsedBody ?? (_a2.parsedBody = await parseBody(this, options));
  }
  /**
   * `.json()` can parse Request body of type `application/json`
   *
   * @see {@link https://hono.dev/docs/api/request#json}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.json()
   * })
   * ```
   */
  json() {
    return __privateGet(this, _cachedBody).call(this, "text").then((text) => JSON.parse(text));
  }
  /**
   * `.text()` can parse Request body of type `text/plain`
   *
   * @see {@link https://hono.dev/docs/api/request#text}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.text()
   * })
   * ```
   */
  text() {
    return __privateGet(this, _cachedBody).call(this, "text");
  }
  /**
   * `.arrayBuffer()` parse Request body as an `ArrayBuffer`
   *
   * @see {@link https://hono.dev/docs/api/request#arraybuffer}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.arrayBuffer()
   * })
   * ```
   */
  arrayBuffer() {
    return __privateGet(this, _cachedBody).call(this, "arrayBuffer");
  }
  /**
   * Parses the request body as a `Blob`.
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.blob();
   * });
   * ```
   * @see https://hono.dev/docs/api/request#blob
   */
  blob() {
    return __privateGet(this, _cachedBody).call(this, "blob");
  }
  /**
   * Parses the request body as `FormData`.
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.formData();
   * });
   * ```
   * @see https://hono.dev/docs/api/request#formdata
   */
  formData() {
    return __privateGet(this, _cachedBody).call(this, "formData");
  }
  /**
   * Adds validated data to the request.
   *
   * @param target - The target of the validation.
   * @param data - The validated data to add.
   */
  addValidatedData(target, data) {
    __privateGet(this, _validatedData)[target] = data;
  }
  valid(target) {
    return __privateGet(this, _validatedData)[target];
  }
  /**
   * `.url()` can get the request url strings.
   *
   * @see {@link https://hono.dev/docs/api/request#url}
   *
   * @example
   * ```ts
   * app.get('/about/me', (c) => {
   *   const url = c.req.url // `http://localhost:8787/about/me`
   *   ...
   * })
   * ```
   */
  get url() {
    return this.raw.url;
  }
  /**
   * `.method()` can get the method name of the request.
   *
   * @see {@link https://hono.dev/docs/api/request#method}
   *
   * @example
   * ```ts
   * app.get('/about/me', (c) => {
   *   const method = c.req.method // `GET`
   * })
   * ```
   */
  get method() {
    return this.raw.method;
  }
  get [GET_MATCH_RESULT]() {
    return __privateGet(this, _matchResult);
  }
  /**
   * `.matchedRoutes()` can return a matched route in the handler
   *
   * @deprecated
   *
   * Use matchedRoutes helper defined in "hono/route" instead.
   *
   * @see {@link https://hono.dev/docs/api/request#matchedroutes}
   *
   * @example
   * ```ts
   * app.use('*', async function logger(c, next) {
   *   await next()
   *   c.req.matchedRoutes.forEach(({ handler, method, path }, i) => {
   *     const name = handler.name || (handler.length < 2 ? '[handler]' : '[middleware]')
   *     console.log(
   *       method,
   *       ' ',
   *       path,
   *       ' '.repeat(Math.max(10 - path.length, 0)),
   *       name,
   *       i === c.req.routeIndex ? '<- respond from here' : ''
   *     )
   *   })
   * })
   * ```
   */
  get matchedRoutes() {
    return __privateGet(this, _matchResult)[0].map(([[, route]]) => route);
  }
  /**
   * `routePath()` can retrieve the path registered within the handler
   *
   * @deprecated
   *
   * Use routePath helper defined in "hono/route" instead.
   *
   * @see {@link https://hono.dev/docs/api/request#routepath}
   *
   * @example
   * ```ts
   * app.get('/posts/:id', (c) => {
   *   return c.json({ path: c.req.routePath })
   * })
   * ```
   */
  get routePath() {
    return __privateGet(this, _matchResult)[0].map(([[, route]]) => route)[this.routeIndex].path;
  }
}, _validatedData = new WeakMap(), _matchResult = new WeakMap(), _HonoRequest_instances = new WeakSet(), getDecodedParam_fn = function(key) {
  const paramKey = __privateGet(this, _matchResult)[0][this.routeIndex][1][key];
  const param = __privateMethod(this, _HonoRequest_instances, getParamValue_fn).call(this, paramKey);
  return param && /\%/.test(param) ? tryDecodeURIComponent(param) : param;
}, getAllDecodedParams_fn = function() {
  const decoded = {};
  const keys = Object.keys(__privateGet(this, _matchResult)[0][this.routeIndex][1]);
  for (const key of keys) {
    const value = __privateMethod(this, _HonoRequest_instances, getParamValue_fn).call(this, __privateGet(this, _matchResult)[0][this.routeIndex][1][key]);
    if (value !== void 0) {
      decoded[key] = /\%/.test(value) ? tryDecodeURIComponent(value) : value;
    }
  }
  return decoded;
}, getParamValue_fn = function(paramKey) {
  return __privateGet(this, _matchResult)[1] ? __privateGet(this, _matchResult)[1][paramKey] : paramKey;
}, _cachedBody = new WeakMap(), _a);
var HtmlEscapedCallbackPhase = {
  Stringify: 1
};
var resolveCallback = async (str, phase, preserveCallbacks, context, buffer) => {
  if (typeof str === "object" && !(str instanceof String)) {
    if (!(str instanceof Promise)) {
      str = str.toString();
    }
    if (str instanceof Promise) {
      str = await str;
    }
  }
  const callbacks = str.callbacks;
  if (!(callbacks == null ? void 0 : callbacks.length)) {
    return Promise.resolve(str);
  }
  if (buffer) {
    buffer[0] += str;
  } else {
    buffer = [str];
  }
  const resStr = Promise.all(callbacks.map((c) => c({ phase, buffer, context }))).then(
    (res) => Promise.all(
      res.filter(Boolean).map((str2) => resolveCallback(str2, phase, false, context, buffer))
    ).then(() => buffer[0])
  );
  {
    return resStr;
  }
};
var TEXT_PLAIN = "text/plain; charset=UTF-8";
var setDefaultContentType = (contentType, headers) => {
  return {
    "Content-Type": contentType,
    ...headers
  };
};
var createResponseInstance = (body, init) => new Response(body, init);
var Context = (_b = class {
  /**
   * Creates an instance of the Context class.
   *
   * @param req - The Request object.
   * @param options - Optional configuration options for the context.
   */
  constructor(req, options) {
    __privateAdd(this, _Context_instances);
    __privateAdd(this, _rawRequest);
    __privateAdd(this, _req);
    /**
     * `.env` can get bindings (environment variables, secrets, KV namespaces, D1 database, R2 bucket etc.) in Cloudflare Workers.
     *
     * @see {@link https://hono.dev/docs/api/context#env}
     *
     * @example
     * ```ts
     * // Environment object for Cloudflare Workers
     * app.get('*', async c => {
     *   const counter = c.env.COUNTER
     * })
     * ```
     */
    __publicField(this, "env", {});
    __privateAdd(this, _var);
    __publicField(this, "finalized", false);
    /**
     * `.error` can get the error object from the middleware if the Handler throws an error.
     *
     * @see {@link https://hono.dev/docs/api/context#error}
     *
     * @example
     * ```ts
     * app.use('*', async (c, next) => {
     *   await next()
     *   if (c.error) {
     *     // do something...
     *   }
     * })
     * ```
     */
    __publicField(this, "error");
    __privateAdd(this, _status);
    __privateAdd(this, _executionCtx);
    __privateAdd(this, _res);
    __privateAdd(this, _layout);
    __privateAdd(this, _renderer);
    __privateAdd(this, _notFoundHandler);
    __privateAdd(this, _preparedHeaders);
    __privateAdd(this, _matchResult2);
    __privateAdd(this, _path);
    /**
     * `.render()` can create a response within a layout.
     *
     * @see {@link https://hono.dev/docs/api/context#render-setrenderer}
     *
     * @example
     * ```ts
     * app.get('/', (c) => {
     *   return c.render('Hello!')
     * })
     * ```
     */
    __publicField(this, "render", (...args) => {
      __privateGet(this, _renderer) ?? __privateSet(this, _renderer, (content) => this.html(content));
      return __privateGet(this, _renderer).call(this, ...args);
    });
    /**
     * Sets the layout for the response.
     *
     * @param layout - The layout to set.
     * @returns The layout function.
     */
    __publicField(this, "setLayout", (layout) => __privateSet(this, _layout, layout));
    /**
     * Gets the current layout for the response.
     *
     * @returns The current layout function.
     */
    __publicField(this, "getLayout", () => __privateGet(this, _layout));
    /**
     * `.setRenderer()` can set the layout in the custom middleware.
     *
     * @see {@link https://hono.dev/docs/api/context#render-setrenderer}
     *
     * @example
     * ```tsx
     * app.use('*', async (c, next) => {
     *   c.setRenderer((content) => {
     *     return c.html(
     *       <html>
     *         <body>
     *           <p>{content}</p>
     *         </body>
     *       </html>
     *     )
     *   })
     *   await next()
     * })
     * ```
     */
    __publicField(this, "setRenderer", (renderer) => {
      __privateSet(this, _renderer, renderer);
    });
    /**
     * `.header()` can set headers.
     *
     * @see {@link https://hono.dev/docs/api/context#header}
     *
     * @example
     * ```ts
     * app.get('/welcome', (c) => {
     *   // Set headers
     *   c.header('X-Message', 'Hello!')
     *   c.header('Content-Type', 'text/plain')
     *
     *   return c.body('Thank you for coming')
     * })
     * ```
     */
    __publicField(this, "header", (name, value, options) => {
      if (this.finalized) {
        __privateSet(this, _res, createResponseInstance(__privateGet(this, _res).body, __privateGet(this, _res)));
      }
      const headers = __privateGet(this, _res) ? __privateGet(this, _res).headers : __privateGet(this, _preparedHeaders) ?? __privateSet(this, _preparedHeaders, new Headers());
      if (value === void 0) {
        headers.delete(name);
      } else if (options == null ? void 0 : options.append) {
        headers.append(name, value);
      } else {
        headers.set(name, value);
      }
    });
    __publicField(this, "status", (status) => {
      __privateSet(this, _status, status);
    });
    /**
     * `.set()` can set the value specified by the key.
     *
     * @see {@link https://hono.dev/docs/api/context#set-get}
     *
     * @example
     * ```ts
     * app.use('*', async (c, next) => {
     *   c.set('message', 'Hono is hot!!')
     *   await next()
     * })
     * ```
     */
    __publicField(this, "set", (key, value) => {
      __privateGet(this, _var) ?? __privateSet(this, _var, /* @__PURE__ */ new Map());
      __privateGet(this, _var).set(key, value);
    });
    /**
     * `.get()` can use the value specified by the key.
     *
     * @see {@link https://hono.dev/docs/api/context#set-get}
     *
     * @example
     * ```ts
     * app.get('/', (c) => {
     *   const message = c.get('message')
     *   return c.text(`The message is "${message}"`)
     * })
     * ```
     */
    __publicField(this, "get", (key) => {
      return __privateGet(this, _var) ? __privateGet(this, _var).get(key) : void 0;
    });
    __publicField(this, "newResponse", (...args) => __privateMethod(this, _Context_instances, newResponse_fn).call(this, ...args));
    /**
     * `.body()` can return the HTTP response.
     * You can set headers with `.header()` and set HTTP status code with `.status`.
     * This can also be set in `.text()`, `.json()` and so on.
     *
     * @see {@link https://hono.dev/docs/api/context#body}
     *
     * @example
     * ```ts
     * app.get('/welcome', (c) => {
     *   // Set headers
     *   c.header('X-Message', 'Hello!')
     *   c.header('Content-Type', 'text/plain')
     *   // Set HTTP status code
     *   c.status(201)
     *
     *   // Return the response body
     *   return c.body('Thank you for coming')
     * })
     * ```
     */
    __publicField(this, "body", (data, arg, headers) => __privateMethod(this, _Context_instances, newResponse_fn).call(this, data, arg, headers));
    /**
     * `.text()` can render text as `Content-Type:text/plain`.
     *
     * @see {@link https://hono.dev/docs/api/context#text}
     *
     * @example
     * ```ts
     * app.get('/say', (c) => {
     *   return c.text('Hello!')
     * })
     * ```
     */
    __publicField(this, "text", (text, arg, headers) => {
      return !__privateGet(this, _preparedHeaders) && !__privateGet(this, _status) && !arg && !headers && !this.finalized ? new Response(text) : __privateMethod(this, _Context_instances, newResponse_fn).call(this, text, arg, setDefaultContentType(TEXT_PLAIN, headers));
    });
    /**
     * `.json()` can render JSON as `Content-Type:application/json`.
     *
     * @see {@link https://hono.dev/docs/api/context#json}
     *
     * @example
     * ```ts
     * app.get('/api', (c) => {
     *   return c.json({ message: 'Hello!' })
     * })
     * ```
     */
    __publicField(this, "json", (object, arg, headers) => {
      return __privateMethod(this, _Context_instances, newResponse_fn).call(this, JSON.stringify(object), arg, setDefaultContentType("application/json", headers));
    });
    __publicField(this, "html", (html, arg, headers) => {
      const res = (html2) => __privateMethod(this, _Context_instances, newResponse_fn).call(this, html2, arg, setDefaultContentType("text/html; charset=UTF-8", headers));
      return typeof html === "object" ? resolveCallback(html, HtmlEscapedCallbackPhase.Stringify, false, {}).then(res) : res(html);
    });
    /**
     * `.redirect()` can Redirect, default status code is 302.
     *
     * @see {@link https://hono.dev/docs/api/context#redirect}
     *
     * @example
     * ```ts
     * app.get('/redirect', (c) => {
     *   return c.redirect('/')
     * })
     * app.get('/redirect-permanently', (c) => {
     *   return c.redirect('/', 301)
     * })
     * ```
     */
    __publicField(this, "redirect", (location, status) => {
      const locationString = String(location);
      this.header(
        "Location",
        // Multibyes should be encoded
        // eslint-disable-next-line no-control-regex
        !/[^\x00-\xFF]/.test(locationString) ? locationString : encodeURI(locationString)
      );
      return this.newResponse(null, status ?? 302);
    });
    /**
     * `.notFound()` can return the Not Found Response.
     *
     * @see {@link https://hono.dev/docs/api/context#notfound}
     *
     * @example
     * ```ts
     * app.get('/notfound', (c) => {
     *   return c.notFound()
     * })
     * ```
     */
    __publicField(this, "notFound", () => {
      __privateGet(this, _notFoundHandler) ?? __privateSet(this, _notFoundHandler, () => createResponseInstance());
      return __privateGet(this, _notFoundHandler).call(this, this);
    });
    __privateSet(this, _rawRequest, req);
    if (options) {
      __privateSet(this, _executionCtx, options.executionCtx);
      this.env = options.env;
      __privateSet(this, _notFoundHandler, options.notFoundHandler);
      __privateSet(this, _path, options.path);
      __privateSet(this, _matchResult2, options.matchResult);
    }
  }
  /**
   * `.req` is the instance of {@link HonoRequest}.
   */
  get req() {
    __privateGet(this, _req) ?? __privateSet(this, _req, new HonoRequest(__privateGet(this, _rawRequest), __privateGet(this, _path), __privateGet(this, _matchResult2)));
    return __privateGet(this, _req);
  }
  /**
   * @see {@link https://hono.dev/docs/api/context#event}
   * The FetchEvent associated with the current request.
   *
   * @throws Will throw an error if the context does not have a FetchEvent.
   */
  get event() {
    if (__privateGet(this, _executionCtx) && "respondWith" in __privateGet(this, _executionCtx)) {
      return __privateGet(this, _executionCtx);
    } else {
      throw Error("This context has no FetchEvent");
    }
  }
  /**
   * @see {@link https://hono.dev/docs/api/context#executionctx}
   * The ExecutionContext associated with the current request.
   *
   * @throws Will throw an error if the context does not have an ExecutionContext.
   */
  get executionCtx() {
    if (__privateGet(this, _executionCtx)) {
      return __privateGet(this, _executionCtx);
    } else {
      throw Error("This context has no ExecutionContext");
    }
  }
  /**
   * @see {@link https://hono.dev/docs/api/context#res}
   * The Response object for the current request.
   */
  get res() {
    return __privateGet(this, _res) || __privateSet(this, _res, createResponseInstance(null, {
      headers: __privateGet(this, _preparedHeaders) ?? __privateSet(this, _preparedHeaders, new Headers())
    }));
  }
  /**
   * Sets the Response object for the current request.
   *
   * @param _res - The Response object to set.
   */
  set res(_res2) {
    if (__privateGet(this, _res) && _res2) {
      _res2 = createResponseInstance(_res2.body, _res2);
      for (const [k, v] of __privateGet(this, _res).headers.entries()) {
        if (k === "content-type") {
          continue;
        }
        if (k === "set-cookie") {
          const cookies = __privateGet(this, _res).headers.getSetCookie();
          _res2.headers.delete("set-cookie");
          for (const cookie of cookies) {
            _res2.headers.append("set-cookie", cookie);
          }
        } else {
          _res2.headers.set(k, v);
        }
      }
    }
    __privateSet(this, _res, _res2);
    this.finalized = true;
  }
  /**
   * `.var` can access the value of a variable.
   *
   * @see {@link https://hono.dev/docs/api/context#var}
   *
   * @example
   * ```ts
   * const result = c.var.client.oneMethod()
   * ```
   */
  // c.var.propName is a read-only
  get var() {
    if (!__privateGet(this, _var)) {
      return {};
    }
    return Object.fromEntries(__privateGet(this, _var));
  }
}, _rawRequest = new WeakMap(), _req = new WeakMap(), _var = new WeakMap(), _status = new WeakMap(), _executionCtx = new WeakMap(), _res = new WeakMap(), _layout = new WeakMap(), _renderer = new WeakMap(), _notFoundHandler = new WeakMap(), _preparedHeaders = new WeakMap(), _matchResult2 = new WeakMap(), _path = new WeakMap(), _Context_instances = new WeakSet(), newResponse_fn = function(data, arg, headers) {
  const responseHeaders = __privateGet(this, _res) ? new Headers(__privateGet(this, _res).headers) : __privateGet(this, _preparedHeaders) ?? new Headers();
  if (typeof arg === "object" && "headers" in arg) {
    const argHeaders = arg.headers instanceof Headers ? arg.headers : new Headers(arg.headers);
    for (const [key, value] of argHeaders) {
      if (key.toLowerCase() === "set-cookie") {
        responseHeaders.append(key, value);
      } else {
        responseHeaders.set(key, value);
      }
    }
  }
  if (headers) {
    for (const [k, v] of Object.entries(headers)) {
      if (typeof v === "string") {
        responseHeaders.set(k, v);
      } else {
        responseHeaders.delete(k);
        for (const v2 of v) {
          responseHeaders.append(k, v2);
        }
      }
    }
  }
  const status = typeof arg === "number" ? arg : (arg == null ? void 0 : arg.status) ?? __privateGet(this, _status);
  return createResponseInstance(data, { status, headers: responseHeaders });
}, _b);
var METHOD_NAME_ALL = "ALL";
var METHOD_NAME_ALL_LOWERCASE = "all";
var METHODS = ["get", "post", "put", "delete", "options", "patch"];
var MESSAGE_MATCHER_IS_ALREADY_BUILT = "Can not add a route since the matcher is already built.";
var UnsupportedPathError = class extends Error {
};
var COMPOSED_HANDLER = "__COMPOSED_HANDLER";
var notFoundHandler = (c) => {
  return c.text("404 Not Found", 404);
};
var errorHandler = (err, c) => {
  if ("getResponse" in err) {
    const res = err.getResponse();
    return c.newResponse(res.body, res);
  }
  console.error(err);
  return c.text("Internal Server Error", 500);
};
var Hono$1 = (_c = class {
  constructor(options = {}) {
    __privateAdd(this, __Hono_instances);
    __publicField(this, "get");
    __publicField(this, "post");
    __publicField(this, "put");
    __publicField(this, "delete");
    __publicField(this, "options");
    __publicField(this, "patch");
    __publicField(this, "all");
    __publicField(this, "on");
    __publicField(this, "use");
    /*
      This class is like an abstract class and does not have a router.
      To use it, inherit the class and implement router in the constructor.
    */
    __publicField(this, "router");
    __publicField(this, "getPath");
    // Cannot use `#` because it requires visibility at JavaScript runtime.
    __publicField(this, "_basePath", "/");
    __privateAdd(this, _path2, "/");
    __publicField(this, "routes", []);
    __privateAdd(this, _notFoundHandler2, notFoundHandler);
    // Cannot use `#` because it requires visibility at JavaScript runtime.
    __publicField(this, "errorHandler", errorHandler);
    /**
     * `.onError()` handles an error and returns a customized Response.
     *
     * @see {@link https://hono.dev/docs/api/hono#error-handling}
     *
     * @param {ErrorHandler} handler - request Handler for error
     * @returns {Hono} changed Hono instance
     *
     * @example
     * ```ts
     * app.onError((err, c) => {
     *   console.error(`${err}`)
     *   return c.text('Custom Error Message', 500)
     * })
     * ```
     */
    __publicField(this, "onError", (handler) => {
      this.errorHandler = handler;
      return this;
    });
    /**
     * `.notFound()` allows you to customize a Not Found Response.
     *
     * @see {@link https://hono.dev/docs/api/hono#not-found}
     *
     * @param {NotFoundHandler} handler - request handler for not-found
     * @returns {Hono} changed Hono instance
     *
     * @example
     * ```ts
     * app.notFound((c) => {
     *   return c.text('Custom 404 Message', 404)
     * })
     * ```
     */
    __publicField(this, "notFound", (handler) => {
      __privateSet(this, _notFoundHandler2, handler);
      return this;
    });
    /**
     * `.fetch()` will be entry point of your app.
     *
     * @see {@link https://hono.dev/docs/api/hono#fetch}
     *
     * @param {Request} request - request Object of request
     * @param {Env} Env - env Object
     * @param {ExecutionContext} - context of execution
     * @returns {Response | Promise<Response>} response of request
     *
     */
    __publicField(this, "fetch", (request, ...rest) => {
      return __privateMethod(this, __Hono_instances, dispatch_fn).call(this, request, rest[1], rest[0], request.method);
    });
    /**
     * `.request()` is a useful method for testing.
     * You can pass a URL or pathname to send a GET request.
     * app will return a Response object.
     * ```ts
     * test('GET /hello is ok', async () => {
     *   const res = await app.request('/hello')
     *   expect(res.status).toBe(200)
     * })
     * ```
     * @see https://hono.dev/docs/api/hono#request
     */
    __publicField(this, "request", (input, requestInit, Env, executionCtx) => {
      if (input instanceof Request) {
        return this.fetch(requestInit ? new Request(input, requestInit) : input, Env, executionCtx);
      }
      input = input.toString();
      return this.fetch(
        new Request(
          /^https?:\/\//.test(input) ? input : `http://localhost${mergePath("/", input)}`,
          requestInit
        ),
        Env,
        executionCtx
      );
    });
    /**
     * `.fire()` automatically adds a global fetch event listener.
     * This can be useful for environments that adhere to the Service Worker API, such as non-ES module Cloudflare Workers.
     * @deprecated
     * Use `fire` from `hono/service-worker` instead.
     * ```ts
     * import { Hono } from 'hono'
     * import { fire } from 'hono/service-worker'
     *
     * const app = new Hono()
     * // ...
     * fire(app)
     * ```
     * @see https://hono.dev/docs/api/hono#fire
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
     * @see https://developers.cloudflare.com/workers/reference/migrate-to-module-workers/
     */
    __publicField(this, "fire", () => {
      addEventListener("fetch", (event) => {
        event.respondWith(__privateMethod(this, __Hono_instances, dispatch_fn).call(this, event.request, event, void 0, event.request.method));
      });
    });
    const allMethods = [...METHODS, METHOD_NAME_ALL_LOWERCASE];
    allMethods.forEach((method) => {
      this[method] = (args1, ...args) => {
        if (typeof args1 === "string") {
          __privateSet(this, _path2, args1);
        } else {
          __privateMethod(this, __Hono_instances, addRoute_fn).call(this, method, __privateGet(this, _path2), args1);
        }
        args.forEach((handler) => {
          __privateMethod(this, __Hono_instances, addRoute_fn).call(this, method, __privateGet(this, _path2), handler);
        });
        return this;
      };
    });
    this.on = (method, path, ...handlers) => {
      for (const p of [path].flat()) {
        __privateSet(this, _path2, p);
        for (const m of [method].flat()) {
          handlers.map((handler) => {
            __privateMethod(this, __Hono_instances, addRoute_fn).call(this, m.toUpperCase(), __privateGet(this, _path2), handler);
          });
        }
      }
      return this;
    };
    this.use = (arg1, ...handlers) => {
      if (typeof arg1 === "string") {
        __privateSet(this, _path2, arg1);
      } else {
        __privateSet(this, _path2, "*");
        handlers.unshift(arg1);
      }
      handlers.forEach((handler) => {
        __privateMethod(this, __Hono_instances, addRoute_fn).call(this, METHOD_NAME_ALL, __privateGet(this, _path2), handler);
      });
      return this;
    };
    const { strict, ...optionsWithoutStrict } = options;
    Object.assign(this, optionsWithoutStrict);
    this.getPath = strict ?? true ? options.getPath ?? getPath : getPathNoStrict;
  }
  /**
   * `.route()` allows grouping other Hono instance in routes.
   *
   * @see {@link https://hono.dev/docs/api/routing#grouping}
   *
   * @param {string} path - base Path
   * @param {Hono} app - other Hono instance
   * @returns {Hono} routed Hono instance
   *
   * @example
   * ```ts
   * const app = new Hono()
   * const app2 = new Hono()
   *
   * app2.get("/user", (c) => c.text("user"))
   * app.route("/api", app2) // GET /api/user
   * ```
   */
  route(path, app) {
    const subApp = this.basePath(path);
    app.routes.map((r) => {
      var _a2;
      let handler;
      if (app.errorHandler === errorHandler) {
        handler = r.handler;
      } else {
        handler = async (c, next) => (await compose([], app.errorHandler)(c, () => r.handler(c, next))).res;
        handler[COMPOSED_HANDLER] = r.handler;
      }
      __privateMethod(_a2 = subApp, __Hono_instances, addRoute_fn).call(_a2, r.method, r.path, handler);
    });
    return this;
  }
  /**
   * `.basePath()` allows base paths to be specified.
   *
   * @see {@link https://hono.dev/docs/api/routing#base-path}
   *
   * @param {string} path - base Path
   * @returns {Hono} changed Hono instance
   *
   * @example
   * ```ts
   * const api = new Hono().basePath('/api')
   * ```
   */
  basePath(path) {
    const subApp = __privateMethod(this, __Hono_instances, clone_fn).call(this);
    subApp._basePath = mergePath(this._basePath, path);
    return subApp;
  }
  /**
   * `.mount()` allows you to mount applications built with other frameworks into your Hono application.
   *
   * @see {@link https://hono.dev/docs/api/hono#mount}
   *
   * @param {string} path - base Path
   * @param {Function} applicationHandler - other Request Handler
   * @param {MountOptions} [options] - options of `.mount()`
   * @returns {Hono} mounted Hono instance
   *
   * @example
   * ```ts
   * import { Router as IttyRouter } from 'itty-router'
   * import { Hono } from 'hono'
   * // Create itty-router application
   * const ittyRouter = IttyRouter()
   * // GET /itty-router/hello
   * ittyRouter.get('/hello', () => new Response('Hello from itty-router'))
   *
   * const app = new Hono()
   * app.mount('/itty-router', ittyRouter.handle)
   * ```
   *
   * @example
   * ```ts
   * const app = new Hono()
   * // Send the request to another application without modification.
   * app.mount('/app', anotherApp, {
   *   replaceRequest: (req) => req,
   * })
   * ```
   */
  mount(path, applicationHandler, options) {
    let replaceRequest;
    let optionHandler;
    if (options) {
      if (typeof options === "function") {
        optionHandler = options;
      } else {
        optionHandler = options.optionHandler;
        if (options.replaceRequest === false) {
          replaceRequest = (request) => request;
        } else {
          replaceRequest = options.replaceRequest;
        }
      }
    }
    const getOptions = optionHandler ? (c) => {
      const options2 = optionHandler(c);
      return Array.isArray(options2) ? options2 : [options2];
    } : (c) => {
      let executionContext = void 0;
      try {
        executionContext = c.executionCtx;
      } catch {
      }
      return [c.env, executionContext];
    };
    replaceRequest || (replaceRequest = (() => {
      const mergedPath = mergePath(this._basePath, path);
      const pathPrefixLength = mergedPath === "/" ? 0 : mergedPath.length;
      return (request) => {
        const url = new URL(request.url);
        url.pathname = url.pathname.slice(pathPrefixLength) || "/";
        return new Request(url, request);
      };
    })());
    const handler = async (c, next) => {
      const res = await applicationHandler(replaceRequest(c.req.raw), ...getOptions(c));
      if (res) {
        return res;
      }
      await next();
    };
    __privateMethod(this, __Hono_instances, addRoute_fn).call(this, METHOD_NAME_ALL, mergePath(path, "*"), handler);
    return this;
  }
}, _path2 = new WeakMap(), __Hono_instances = new WeakSet(), clone_fn = function() {
  const clone = new _c({
    router: this.router,
    getPath: this.getPath
  });
  clone.errorHandler = this.errorHandler;
  __privateSet(clone, _notFoundHandler2, __privateGet(this, _notFoundHandler2));
  clone.routes = this.routes;
  return clone;
}, _notFoundHandler2 = new WeakMap(), addRoute_fn = function(method, path, handler) {
  method = method.toUpperCase();
  path = mergePath(this._basePath, path);
  const r = { basePath: this._basePath, path, method, handler };
  this.router.add(method, path, [handler, r]);
  this.routes.push(r);
}, handleError_fn = function(err, c) {
  if (err instanceof Error) {
    return this.errorHandler(err, c);
  }
  throw err;
}, dispatch_fn = function(request, executionCtx, env, method) {
  if (method === "HEAD") {
    return (async () => new Response(null, await __privateMethod(this, __Hono_instances, dispatch_fn).call(this, request, executionCtx, env, "GET")))();
  }
  const path = this.getPath(request, { env });
  const matchResult = this.router.match(method, path);
  const c = new Context(request, {
    path,
    matchResult,
    env,
    executionCtx,
    notFoundHandler: __privateGet(this, _notFoundHandler2)
  });
  if (matchResult[0].length === 1) {
    let res;
    try {
      res = matchResult[0][0][0][0](c, async () => {
        c.res = await __privateGet(this, _notFoundHandler2).call(this, c);
      });
    } catch (err) {
      return __privateMethod(this, __Hono_instances, handleError_fn).call(this, err, c);
    }
    return res instanceof Promise ? res.then(
      (resolved) => resolved || (c.finalized ? c.res : __privateGet(this, _notFoundHandler2).call(this, c))
    ).catch((err) => __privateMethod(this, __Hono_instances, handleError_fn).call(this, err, c)) : res ?? __privateGet(this, _notFoundHandler2).call(this, c);
  }
  const composed = compose(matchResult[0], this.errorHandler, __privateGet(this, _notFoundHandler2));
  return (async () => {
    try {
      const context = await composed(c);
      if (!context.finalized) {
        throw new Error(
          "Context is not finalized. Did you forget to return a Response object or `await next()`?"
        );
      }
      return context.res;
    } catch (err) {
      return __privateMethod(this, __Hono_instances, handleError_fn).call(this, err, c);
    }
  })();
}, _c);
var emptyParam = [];
function match(method, path) {
  const matchers = this.buildAllMatchers();
  const match2 = (method2, path2) => {
    const matcher = matchers[method2] || matchers[METHOD_NAME_ALL];
    const staticMatch = matcher[2][path2];
    if (staticMatch) {
      return staticMatch;
    }
    const match3 = path2.match(matcher[0]);
    if (!match3) {
      return [[], emptyParam];
    }
    const index = match3.indexOf("", 1);
    return [matcher[1][index], match3];
  };
  this.match = match2;
  return match2(method, path);
}
var LABEL_REG_EXP_STR = "[^/]+";
var ONLY_WILDCARD_REG_EXP_STR = ".*";
var TAIL_WILDCARD_REG_EXP_STR = "(?:|/.*)";
var PATH_ERROR = /* @__PURE__ */ Symbol();
var regExpMetaChars = new Set(".\\+*[^]$()");
function compareKey(a, b) {
  if (a.length === 1) {
    return b.length === 1 ? a < b ? -1 : 1 : -1;
  }
  if (b.length === 1) {
    return 1;
  }
  if (a === ONLY_WILDCARD_REG_EXP_STR || a === TAIL_WILDCARD_REG_EXP_STR) {
    return 1;
  } else if (b === ONLY_WILDCARD_REG_EXP_STR || b === TAIL_WILDCARD_REG_EXP_STR) {
    return -1;
  }
  if (a === LABEL_REG_EXP_STR) {
    return 1;
  } else if (b === LABEL_REG_EXP_STR) {
    return -1;
  }
  return a.length === b.length ? a < b ? -1 : 1 : b.length - a.length;
}
var Node$1 = (_d = class {
  constructor() {
    __privateAdd(this, _index);
    __privateAdd(this, _varIndex);
    __privateAdd(this, _children, /* @__PURE__ */ Object.create(null));
  }
  insert(tokens, index, paramMap, context, pathErrorCheckOnly) {
    if (tokens.length === 0) {
      if (__privateGet(this, _index) !== void 0) {
        throw PATH_ERROR;
      }
      if (pathErrorCheckOnly) {
        return;
      }
      __privateSet(this, _index, index);
      return;
    }
    const [token, ...restTokens] = tokens;
    const pattern = token === "*" ? restTokens.length === 0 ? ["", "", ONLY_WILDCARD_REG_EXP_STR] : ["", "", LABEL_REG_EXP_STR] : token === "/*" ? ["", "", TAIL_WILDCARD_REG_EXP_STR] : token.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
    let node;
    if (pattern) {
      const name = pattern[1];
      let regexpStr = pattern[2] || LABEL_REG_EXP_STR;
      if (name && pattern[2]) {
        if (regexpStr === ".*") {
          throw PATH_ERROR;
        }
        regexpStr = regexpStr.replace(/^\((?!\?:)(?=[^)]+\)$)/, "(?:");
        if (/\((?!\?:)/.test(regexpStr)) {
          throw PATH_ERROR;
        }
      }
      node = __privateGet(this, _children)[regexpStr];
      if (!node) {
        if (Object.keys(__privateGet(this, _children)).some(
          (k) => k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR
        )) {
          throw PATH_ERROR;
        }
        if (pathErrorCheckOnly) {
          return;
        }
        node = __privateGet(this, _children)[regexpStr] = new _d();
        if (name !== "") {
          __privateSet(node, _varIndex, context.varIndex++);
        }
      }
      if (!pathErrorCheckOnly && name !== "") {
        paramMap.push([name, __privateGet(node, _varIndex)]);
      }
    } else {
      node = __privateGet(this, _children)[token];
      if (!node) {
        if (Object.keys(__privateGet(this, _children)).some(
          (k) => k.length > 1 && k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR
        )) {
          throw PATH_ERROR;
        }
        if (pathErrorCheckOnly) {
          return;
        }
        node = __privateGet(this, _children)[token] = new _d();
      }
    }
    node.insert(restTokens, index, paramMap, context, pathErrorCheckOnly);
  }
  buildRegExpStr() {
    const childKeys = Object.keys(__privateGet(this, _children)).sort(compareKey);
    const strList = childKeys.map((k) => {
      const c = __privateGet(this, _children)[k];
      return (typeof __privateGet(c, _varIndex) === "number" ? `(${k})@${__privateGet(c, _varIndex)}` : regExpMetaChars.has(k) ? `\\${k}` : k) + c.buildRegExpStr();
    });
    if (typeof __privateGet(this, _index) === "number") {
      strList.unshift(`#${__privateGet(this, _index)}`);
    }
    if (strList.length === 0) {
      return "";
    }
    if (strList.length === 1) {
      return strList[0];
    }
    return "(?:" + strList.join("|") + ")";
  }
}, _index = new WeakMap(), _varIndex = new WeakMap(), _children = new WeakMap(), _d);
var Trie = (_e = class {
  constructor() {
    __privateAdd(this, _context, { varIndex: 0 });
    __privateAdd(this, _root, new Node$1());
  }
  insert(path, index, pathErrorCheckOnly) {
    const paramAssoc = [];
    const groups = [];
    for (let i = 0; ; ) {
      let replaced = false;
      path = path.replace(/\{[^}]+\}/g, (m) => {
        const mark = `@\\${i}`;
        groups[i] = [mark, m];
        i++;
        replaced = true;
        return mark;
      });
      if (!replaced) {
        break;
      }
    }
    const tokens = path.match(/(?::[^\/]+)|(?:\/\*$)|./g) || [];
    for (let i = groups.length - 1; i >= 0; i--) {
      const [mark] = groups[i];
      for (let j = tokens.length - 1; j >= 0; j--) {
        if (tokens[j].indexOf(mark) !== -1) {
          tokens[j] = tokens[j].replace(mark, groups[i][1]);
          break;
        }
      }
    }
    __privateGet(this, _root).insert(tokens, index, paramAssoc, __privateGet(this, _context), pathErrorCheckOnly);
    return paramAssoc;
  }
  buildRegExp() {
    let regexp = __privateGet(this, _root).buildRegExpStr();
    if (regexp === "") {
      return [/^$/, [], []];
    }
    let captureIndex = 0;
    const indexReplacementMap = [];
    const paramReplacementMap = [];
    regexp = regexp.replace(/#(\d+)|@(\d+)|\.\*\$/g, (_, handlerIndex, paramIndex) => {
      if (handlerIndex !== void 0) {
        indexReplacementMap[++captureIndex] = Number(handlerIndex);
        return "$()";
      }
      if (paramIndex !== void 0) {
        paramReplacementMap[Number(paramIndex)] = ++captureIndex;
        return "";
      }
      return "";
    });
    return [new RegExp(`^${regexp}`), indexReplacementMap, paramReplacementMap];
  }
}, _context = new WeakMap(), _root = new WeakMap(), _e);
var nullMatcher = [/^$/, [], /* @__PURE__ */ Object.create(null)];
var wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
function buildWildcardRegExp(path) {
  return wildcardRegExpCache[path] ?? (wildcardRegExpCache[path] = new RegExp(
    path === "*" ? "" : `^${path.replace(
      /\/\*$|([.\\+*[^\]$()])/g,
      (_, metaChar) => metaChar ? `\\${metaChar}` : "(?:|/.*)"
    )}$`
  ));
}
function clearWildcardRegExpCache() {
  wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
}
function buildMatcherFromPreprocessedRoutes(routes) {
  var _a2;
  const trie = new Trie();
  const handlerData = [];
  if (routes.length === 0) {
    return nullMatcher;
  }
  const routesWithStaticPathFlag = routes.map(
    (route) => [!/\*|\/:/.test(route[0]), ...route]
  ).sort(
    ([isStaticA, pathA], [isStaticB, pathB]) => isStaticA ? 1 : isStaticB ? -1 : pathA.length - pathB.length
  );
  const staticMap = /* @__PURE__ */ Object.create(null);
  for (let i = 0, j = -1, len = routesWithStaticPathFlag.length; i < len; i++) {
    const [pathErrorCheckOnly, path, handlers] = routesWithStaticPathFlag[i];
    if (pathErrorCheckOnly) {
      staticMap[path] = [handlers.map(([h]) => [h, /* @__PURE__ */ Object.create(null)]), emptyParam];
    } else {
      j++;
    }
    let paramAssoc;
    try {
      paramAssoc = trie.insert(path, j, pathErrorCheckOnly);
    } catch (e) {
      throw e === PATH_ERROR ? new UnsupportedPathError(path) : e;
    }
    if (pathErrorCheckOnly) {
      continue;
    }
    handlerData[j] = handlers.map(([h, paramCount]) => {
      const paramIndexMap = /* @__PURE__ */ Object.create(null);
      paramCount -= 1;
      for (; paramCount >= 0; paramCount--) {
        const [key, value] = paramAssoc[paramCount];
        paramIndexMap[key] = value;
      }
      return [h, paramIndexMap];
    });
  }
  const [regexp, indexReplacementMap, paramReplacementMap] = trie.buildRegExp();
  for (let i = 0, len = handlerData.length; i < len; i++) {
    for (let j = 0, len2 = handlerData[i].length; j < len2; j++) {
      const map = (_a2 = handlerData[i][j]) == null ? void 0 : _a2[1];
      if (!map) {
        continue;
      }
      const keys = Object.keys(map);
      for (let k = 0, len3 = keys.length; k < len3; k++) {
        map[keys[k]] = paramReplacementMap[map[keys[k]]];
      }
    }
  }
  const handlerMap = [];
  for (const i in indexReplacementMap) {
    handlerMap[i] = handlerData[indexReplacementMap[i]];
  }
  return [regexp, handlerMap, staticMap];
}
function findMiddleware(middleware, path) {
  if (!middleware) {
    return void 0;
  }
  for (const k of Object.keys(middleware).sort((a, b) => b.length - a.length)) {
    if (buildWildcardRegExp(k).test(path)) {
      return [...middleware[k]];
    }
  }
  return void 0;
}
var RegExpRouter = (_f = class {
  constructor() {
    __privateAdd(this, _RegExpRouter_instances);
    __publicField(this, "name", "RegExpRouter");
    __privateAdd(this, _middleware);
    __privateAdd(this, _routes);
    __publicField(this, "match", match);
    __privateSet(this, _middleware, { [METHOD_NAME_ALL]: /* @__PURE__ */ Object.create(null) });
    __privateSet(this, _routes, { [METHOD_NAME_ALL]: /* @__PURE__ */ Object.create(null) });
  }
  add(method, path, handler) {
    var _a2;
    const middleware = __privateGet(this, _middleware);
    const routes = __privateGet(this, _routes);
    if (!middleware || !routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    if (!middleware[method]) {
      [middleware, routes].forEach((handlerMap) => {
        handlerMap[method] = /* @__PURE__ */ Object.create(null);
        Object.keys(handlerMap[METHOD_NAME_ALL]).forEach((p) => {
          handlerMap[method][p] = [...handlerMap[METHOD_NAME_ALL][p]];
        });
      });
    }
    if (path === "/*") {
      path = "*";
    }
    const paramCount = (path.match(/\/:/g) || []).length;
    if (/\*$/.test(path)) {
      const re = buildWildcardRegExp(path);
      if (method === METHOD_NAME_ALL) {
        Object.keys(middleware).forEach((m) => {
          var _a3;
          (_a3 = middleware[m])[path] || (_a3[path] = findMiddleware(middleware[m], path) || findMiddleware(middleware[METHOD_NAME_ALL], path) || []);
        });
      } else {
        (_a2 = middleware[method])[path] || (_a2[path] = findMiddleware(middleware[method], path) || findMiddleware(middleware[METHOD_NAME_ALL], path) || []);
      }
      Object.keys(middleware).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          Object.keys(middleware[m]).forEach((p) => {
            re.test(p) && middleware[m][p].push([handler, paramCount]);
          });
        }
      });
      Object.keys(routes).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          Object.keys(routes[m]).forEach(
            (p) => re.test(p) && routes[m][p].push([handler, paramCount])
          );
        }
      });
      return;
    }
    const paths = checkOptionalParameter(path) || [path];
    for (let i = 0, len = paths.length; i < len; i++) {
      const path2 = paths[i];
      Object.keys(routes).forEach((m) => {
        var _a3;
        if (method === METHOD_NAME_ALL || method === m) {
          (_a3 = routes[m])[path2] || (_a3[path2] = [
            ...findMiddleware(middleware[m], path2) || findMiddleware(middleware[METHOD_NAME_ALL], path2) || []
          ]);
          routes[m][path2].push([handler, paramCount - len + i + 1]);
        }
      });
    }
  }
  buildAllMatchers() {
    const matchers = /* @__PURE__ */ Object.create(null);
    Object.keys(__privateGet(this, _routes)).concat(Object.keys(__privateGet(this, _middleware))).forEach((method) => {
      matchers[method] || (matchers[method] = __privateMethod(this, _RegExpRouter_instances, buildMatcher_fn).call(this, method));
    });
    __privateSet(this, _middleware, __privateSet(this, _routes, void 0));
    clearWildcardRegExpCache();
    return matchers;
  }
}, _middleware = new WeakMap(), _routes = new WeakMap(), _RegExpRouter_instances = new WeakSet(), buildMatcher_fn = function(method) {
  const routes = [];
  let hasOwnRoute = method === METHOD_NAME_ALL;
  [__privateGet(this, _middleware), __privateGet(this, _routes)].forEach((r) => {
    const ownRoute = r[method] ? Object.keys(r[method]).map((path) => [path, r[method][path]]) : [];
    if (ownRoute.length !== 0) {
      hasOwnRoute || (hasOwnRoute = true);
      routes.push(...ownRoute);
    } else if (method !== METHOD_NAME_ALL) {
      routes.push(
        ...Object.keys(r[METHOD_NAME_ALL]).map((path) => [path, r[METHOD_NAME_ALL][path]])
      );
    }
  });
  if (!hasOwnRoute) {
    return null;
  } else {
    return buildMatcherFromPreprocessedRoutes(routes);
  }
}, _f);
var SmartRouter = (_g = class {
  constructor(init) {
    __publicField(this, "name", "SmartRouter");
    __privateAdd(this, _routers, []);
    __privateAdd(this, _routes2, []);
    __privateSet(this, _routers, init.routers);
  }
  add(method, path, handler) {
    if (!__privateGet(this, _routes2)) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    __privateGet(this, _routes2).push([method, path, handler]);
  }
  match(method, path) {
    if (!__privateGet(this, _routes2)) {
      throw new Error("Fatal error");
    }
    const routers = __privateGet(this, _routers);
    const routes = __privateGet(this, _routes2);
    const len = routers.length;
    let i = 0;
    let res;
    for (; i < len; i++) {
      const router = routers[i];
      try {
        for (let i2 = 0, len2 = routes.length; i2 < len2; i2++) {
          router.add(...routes[i2]);
        }
        res = router.match(method, path);
      } catch (e) {
        if (e instanceof UnsupportedPathError) {
          continue;
        }
        throw e;
      }
      this.match = router.match.bind(router);
      __privateSet(this, _routers, [router]);
      __privateSet(this, _routes2, void 0);
      break;
    }
    if (i === len) {
      throw new Error("Fatal error");
    }
    this.name = `SmartRouter + ${this.activeRouter.name}`;
    return res;
  }
  get activeRouter() {
    if (__privateGet(this, _routes2) || __privateGet(this, _routers).length !== 1) {
      throw new Error("No active router has been determined yet.");
    }
    return __privateGet(this, _routers)[0];
  }
}, _routers = new WeakMap(), _routes2 = new WeakMap(), _g);
var emptyParams = /* @__PURE__ */ Object.create(null);
var hasChildren = (children) => {
  for (const _ in children) {
    return true;
  }
  return false;
};
var Node = (_h = class {
  constructor(method, handler, children) {
    __privateAdd(this, __Node_instances);
    __privateAdd(this, _methods);
    __privateAdd(this, _children2);
    __privateAdd(this, _patterns);
    __privateAdd(this, _order, 0);
    __privateAdd(this, _params, emptyParams);
    __privateSet(this, _children2, children || /* @__PURE__ */ Object.create(null));
    __privateSet(this, _methods, []);
    if (method && handler) {
      const m = /* @__PURE__ */ Object.create(null);
      m[method] = { handler, possibleKeys: [], score: 0 };
      __privateSet(this, _methods, [m]);
    }
    __privateSet(this, _patterns, []);
  }
  insert(method, path, handler) {
    __privateSet(this, _order, ++__privateWrapper(this, _order)._);
    let curNode = this;
    const parts = splitRoutingPath(path);
    const possibleKeys = [];
    for (let i = 0, len = parts.length; i < len; i++) {
      const p = parts[i];
      const nextP = parts[i + 1];
      const pattern = getPattern(p, nextP);
      const key = Array.isArray(pattern) ? pattern[0] : p;
      if (key in __privateGet(curNode, _children2)) {
        curNode = __privateGet(curNode, _children2)[key];
        if (pattern) {
          possibleKeys.push(pattern[1]);
        }
        continue;
      }
      __privateGet(curNode, _children2)[key] = new _h();
      if (pattern) {
        __privateGet(curNode, _patterns).push(pattern);
        possibleKeys.push(pattern[1]);
      }
      curNode = __privateGet(curNode, _children2)[key];
    }
    __privateGet(curNode, _methods).push({
      [method]: {
        handler,
        possibleKeys: possibleKeys.filter((v, i, a) => a.indexOf(v) === i),
        score: __privateGet(this, _order)
      }
    });
    return curNode;
  }
  search(method, path) {
    var _a2;
    const handlerSets = [];
    __privateSet(this, _params, emptyParams);
    const curNode = this;
    let curNodes = [curNode];
    const parts = splitPath(path);
    const curNodesQueue = [];
    const len = parts.length;
    let partOffsets = null;
    for (let i = 0; i < len; i++) {
      const part = parts[i];
      const isLast = i === len - 1;
      const tempNodes = [];
      for (let j = 0, len2 = curNodes.length; j < len2; j++) {
        const node = curNodes[j];
        const nextNode = __privateGet(node, _children2)[part];
        if (nextNode) {
          __privateSet(nextNode, _params, __privateGet(node, _params));
          if (isLast) {
            if (__privateGet(nextNode, _children2)["*"]) {
              __privateMethod(this, __Node_instances, pushHandlerSets_fn).call(this, handlerSets, __privateGet(nextNode, _children2)["*"], method, __privateGet(node, _params));
            }
            __privateMethod(this, __Node_instances, pushHandlerSets_fn).call(this, handlerSets, nextNode, method, __privateGet(node, _params));
          } else {
            tempNodes.push(nextNode);
          }
        }
        for (let k = 0, len3 = __privateGet(node, _patterns).length; k < len3; k++) {
          const pattern = __privateGet(node, _patterns)[k];
          const params = __privateGet(node, _params) === emptyParams ? {} : { ...__privateGet(node, _params) };
          if (pattern === "*") {
            const astNode = __privateGet(node, _children2)["*"];
            if (astNode) {
              __privateMethod(this, __Node_instances, pushHandlerSets_fn).call(this, handlerSets, astNode, method, __privateGet(node, _params));
              __privateSet(astNode, _params, params);
              tempNodes.push(astNode);
            }
            continue;
          }
          const [key, name, matcher] = pattern;
          if (!part && !(matcher instanceof RegExp)) {
            continue;
          }
          const child = __privateGet(node, _children2)[key];
          if (matcher instanceof RegExp) {
            if (partOffsets === null) {
              partOffsets = new Array(len);
              let offset = path[0] === "/" ? 1 : 0;
              for (let p = 0; p < len; p++) {
                partOffsets[p] = offset;
                offset += parts[p].length + 1;
              }
            }
            const restPathString = path.substring(partOffsets[i]);
            const m = matcher.exec(restPathString);
            if (m) {
              params[name] = m[0];
              __privateMethod(this, __Node_instances, pushHandlerSets_fn).call(this, handlerSets, child, method, __privateGet(node, _params), params);
              if (hasChildren(__privateGet(child, _children2))) {
                __privateSet(child, _params, params);
                const componentCount = ((_a2 = m[0].match(/\//)) == null ? void 0 : _a2.length) ?? 0;
                const targetCurNodes = curNodesQueue[componentCount] || (curNodesQueue[componentCount] = []);
                targetCurNodes.push(child);
              }
              continue;
            }
          }
          if (matcher === true || matcher.test(part)) {
            params[name] = part;
            if (isLast) {
              __privateMethod(this, __Node_instances, pushHandlerSets_fn).call(this, handlerSets, child, method, params, __privateGet(node, _params));
              if (__privateGet(child, _children2)["*"]) {
                __privateMethod(this, __Node_instances, pushHandlerSets_fn).call(this, handlerSets, __privateGet(child, _children2)["*"], method, params, __privateGet(node, _params));
              }
            } else {
              __privateSet(child, _params, params);
              tempNodes.push(child);
            }
          }
        }
      }
      const shifted = curNodesQueue.shift();
      curNodes = shifted ? tempNodes.concat(shifted) : tempNodes;
    }
    if (handlerSets.length > 1) {
      handlerSets.sort((a, b) => {
        return a.score - b.score;
      });
    }
    return [handlerSets.map(({ handler, params }) => [handler, params])];
  }
}, _methods = new WeakMap(), _children2 = new WeakMap(), _patterns = new WeakMap(), _order = new WeakMap(), _params = new WeakMap(), __Node_instances = new WeakSet(), pushHandlerSets_fn = function(handlerSets, node, method, nodeParams, params) {
  for (let i = 0, len = __privateGet(node, _methods).length; i < len; i++) {
    const m = __privateGet(node, _methods)[i];
    const handlerSet = m[method] || m[METHOD_NAME_ALL];
    const processedSet = {};
    if (handlerSet !== void 0) {
      handlerSet.params = /* @__PURE__ */ Object.create(null);
      handlerSets.push(handlerSet);
      if (nodeParams !== emptyParams || params && params !== emptyParams) {
        for (let i2 = 0, len2 = handlerSet.possibleKeys.length; i2 < len2; i2++) {
          const key = handlerSet.possibleKeys[i2];
          const processed = processedSet[handlerSet.score];
          handlerSet.params[key] = (params == null ? void 0 : params[key]) && !processed ? params[key] : nodeParams[key] ?? (params == null ? void 0 : params[key]);
          processedSet[handlerSet.score] = true;
        }
      }
    }
  }
}, _h);
var TrieRouter = (_i = class {
  constructor() {
    __publicField(this, "name", "TrieRouter");
    __privateAdd(this, _node);
    __privateSet(this, _node, new Node());
  }
  add(method, path, handler) {
    const results = checkOptionalParameter(path);
    if (results) {
      for (let i = 0, len = results.length; i < len; i++) {
        __privateGet(this, _node).insert(method, results[i], handler);
      }
      return;
    }
    __privateGet(this, _node).insert(method, path, handler);
  }
  match(method, path) {
    return __privateGet(this, _node).search(method, path);
  }
}, _node = new WeakMap(), _i);
var Hono = class extends Hono$1 {
  /**
   * Creates an instance of the Hono class.
   *
   * @param options - Optional configuration options for the Hono instance.
   */
  constructor(options = {}) {
    super(options);
    this.router = options.router ?? new SmartRouter({
      routers: [new RegExpRouter(), new TrieRouter()]
    });
  }
};
const MIME_TYPES = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".json": "application/json",
  ".py": "text/plain",
  ".txt": "text/plain",
  ".md": "text/markdown"
};
function mimeTypeForPath(filePath) {
  const dot = filePath.lastIndexOf(".");
  const ext = dot >= 0 ? filePath.slice(dot).toLowerCase() : "";
  return MIME_TYPES[ext] ?? "application/octet-stream";
}
function createPublicApiRouter(data) {
  const app = new Hono();
  app.get("/api/v3/badges", async (c) => {
    return c.json(await data.getBadges());
  });
  app.get("/api/v3/categories", async (c) => {
    return c.json(await data.getCategories());
  });
  app.get("/api/v3/ping", async (c) => {
    const id = c.req.query("id");
    const mac = c.req.query("mac");
    if (id) await data.registerBadge(id, mac);
    return c.json("pong");
  });
  app.get("/api/v3/stats", async (c) => {
    return c.json(await data.getStats());
  });
  app.get("/api/v3/project-summaries", async (c) => {
    const q = c.req.query();
    const slugs = q.slugs ? q.slugs.split(",") : [];
    const summaries = await data.getProjectSummaries(
      {
        slugs,
        pageStart: q.pageStart ? Number(q.pageStart) : void 0,
        pageLength: q.pageLength ? Number(q.pageLength) : void 0,
        badge: q.badge || void 0,
        category: q.category || void 0,
        search: q.search || void 0,
        userId: q.userId || void 0,
        orderBy: q.orderBy === "installs" ? "installs" : "published_at"
      },
      "latest"
    );
    return c.json(summaries);
  });
  app.get("/api/v3/project-latest-revisions", async (c) => {
    var _a2;
    const slugs = (_a2 = c.req.query("slugs")) == null ? void 0 : _a2.split(",");
    const summaries = await data.getProjectSummaries(
      { slugs, orderBy: "published_at" },
      "latest"
    );
    c.header("Cache-Control", "max-age=10");
    return c.json(summaries.map((p) => ({ slug: p.slug, revision: p.revision })));
  });
  app.get("/api/v3/project-latest-revisions/:slug", async (c) => {
    const slug = c.req.param("slug");
    const project = await data.getProject(slug, "latest");
    if ((project == null ? void 0 : project.latest_revision) == void 0) {
      return c.json(
        { reason: `No published app with slug '${slug}' found` },
        404
      );
    }
    c.header("Cache-Control", "max-age=10");
    return c.json(project.latest_revision);
  });
  app.get("/api/v3/projects/:slug/latest/files/*", async (c) => {
    const slug = c.req.param("slug");
    const prefix = `/api/v3/projects/${slug}/latest/files/`;
    const filePath = decodeURIComponent(c.req.path.slice(prefix.length));
    const file = await data.getFileContents(slug, "latest", filePath);
    if (!file) {
      return c.json({ reason: `No app with slug '${slug}' found` }, 404);
    }
    c.header("Content-Type", mimeTypeForPath(filePath));
    c.header("Content-Disposition", `attachment; filename="${filePath}"`);
    return c.body(file);
  });
  app.get("/api/v3/projects/:slug/:rev{rev[0-9]+}/files/*", async (c) => {
    const slug = c.req.param("slug");
    const rev = c.req.param("rev");
    const revision = Number(rev.slice(3));
    const prefix = `/api/v3/projects/${slug}/${rev}/files/`;
    const filePath = decodeURIComponent(c.req.path.slice(prefix.length));
    const file = await data.getFileContents(slug, revision, filePath);
    if (!file) {
      return c.json(
        { reason: `No app with slug '${slug}' and revision '${revision}' found` },
        404
      );
    }
    c.header("Content-Type", mimeTypeForPath(filePath));
    c.header("Content-Disposition", `attachment; filename="${filePath}"`);
    c.header("Cache-Control", "public, max-age=31536000, immutable");
    return c.body(file);
  });
  app.get("/api/v3/projects/:slug/:rev{rev[0-9]+}", async (c) => {
    const slug = c.req.param("slug");
    const revision = Number(c.req.param("rev").slice(3));
    const details = await data.getProject(slug, revision);
    if (!details) {
      return c.json(
        { reason: `No public app with slug [${slug}] and revision [${revision}] found` },
        404
      );
    }
    c.header("Cache-Control", "public, max-age=31536000, immutable");
    return c.json(details);
  });
  app.get("/api/v3/projects/:slug", async (c) => {
    const slug = c.req.param("slug");
    const details = await data.getProject(slug, "latest");
    if (!details) {
      return c.json(
        { reason: `No public app with slug '${slug}' found` },
        404
      );
    }
    return c.json(details);
  });
  app.post("/api/v3/projects/:slug/:rev{rev[0-9]+}/report/install", async (c) => {
    const slug = c.req.param("slug");
    const revision = Number(c.req.param("rev").slice(3));
    const id = c.req.query("id");
    const mac = c.req.query("mac");
    await data.reportInstall(slug, revision, { id, mac });
    return c.body(null, 204);
  });
  app.post("/api/v3/projects/:slug/:rev{rev[0-9]+}/report/launch", async (c) => {
    const slug = c.req.param("slug");
    const revision = Number(c.req.param("rev").slice(3));
    const id = c.req.query("id");
    const mac = c.req.query("mac");
    await data.reportLaunch(slug, revision, { id, mac });
    return c.body(null, 204);
  });
  app.post("/api/v3/projects/:slug/:rev{rev[0-9]+}/report/crash", async (c) => {
    const slug = c.req.param("slug");
    const revision = Number(c.req.param("rev").slice(3));
    const id = c.req.query("id");
    const mac = c.req.query("mac");
    const body = await c.req.json().catch(() => ({}));
    await data.reportCrash(slug, revision, { id, mac }, body);
    return c.body(null, 204);
  });
  return app;
}
const PROJECT_NAMES = [
  "CodeCraft",
  "PixelPulse",
  "BitBlast",
  "NanoGames",
  "ElectraPlay",
  "CircuitForge",
  "ByteBash",
  "CodeCanvas",
  "SparkScript",
  "LogicLand",
  "MicroArcade",
  "CodeCraze",
  "GameGenius",
  "PixelPal",
  "Electronica",
  "CodeQuest",
  "CircuitCraft",
  "ByteBeat",
  "NanoNexus",
  "BitBox",
  "CircuitChaos",
  "CodeCrafter",
  "PixelPioneer",
  "LogicLab",
  "ByteBlitz",
  "CodeWave",
  "NanoNet",
  "ElectraForge",
  "GameGrid",
  "LogicLoom",
  "PixelPlaza",
  "CodeCity",
  "NanoArcade",
  "ElectronEra",
  "BitBazaar",
  "LogicLegends",
  "CodeClan",
  "PixelPortal",
  "CircuitCraze",
  "ByteBuster",
  "NanoNovel",
  "ElectraEden",
  "CodeComet",
  "PixelPlayground",
  "LogicLandia",
  "ByteBounce",
  "CircuitCarnival",
  "CodeCove",
  "NanoNest",
  "ElectraEntertain",
  "GameGalaxy",
  "LogicLabyrinth",
  "ByteBlaster",
  "CodeCompass",
  "NanoNation",
  "ElectraEmpire",
  "GameGarden",
  "PixelPeak",
  "CircuitCelestial",
  "CodeCrusade",
  "NanoNebula",
  "ElectraEnclave",
  "GameGizmo",
  "PixelPlanet",
  "LogicLounge",
  "ByteBeacon",
  "CodeCircus",
  "NanoNook",
  "ElectraElysium",
  "GameGlimpse",
  "PixelParadise",
  "CodeCoast",
  "NanoNirvana",
  "ElectraEdifice",
  "GameGen",
  "PixelPandemonium",
  "LogicLagoon",
  "ByteBlaze",
  "CodeCorridor",
  "HackSimulator",
  "CodeCrunch",
  "SecureCraft",
  "CryptoPulse",
  "DataForge",
  "CipherQuest",
  "HackQuest",
  "SecureSphere"
];
const USERS = [
  "TechTinkerer",
  "CodeCrafter",
  "PixelPilot",
  "LogicLion",
  "ElectronEager",
  "NanoNomad",
  "CircuitCraze",
  "GameGlider",
  "ByteBlast",
  "CyberCraft",
  "DigitalDynamo",
  "CodeCreator",
  "PixelPulse",
  "LogicLuminary",
  "ElectronEcho",
  "NanoNinja",
  "CircuitChampion",
  "GameGazer",
  "ByteBuddy",
  "TechTornado",
  "CodeChampion",
  "PixelProdigy",
  "LogicLabyrinth",
  "ElectronExplorer",
  "NanoNavigator",
  "CircuitCatalyst",
  "GameGuru",
  "ByteBlaze",
  "DigitalDreamer",
  "CodeCommander",
  "PixelPioneer",
  "LogicLegend",
  "ElectronElite",
  "NanoNerd",
  "CircuitCaptain",
  "GameGenius",
  "ByteBolt",
  "CyberCipher",
  "CodeConqueror",
  "PixelPaladin",
  "LogicLore",
  "ElectronEnigma",
  "CircuitConnoisseur",
  "GameGuardian",
  "ByteBandit",
  "TechTinker",
  "CodeCrusader",
  "PixelPirate",
  "ElectronEagle",
  "CircuitSavant",
  "GameGladiator",
  "ByteBlitz",
  "CyberSavvy",
  "CodeCraftsman",
  "PixelPro",
  "LogicLoreMaster",
  "ElectronEmperor",
  "CircuitChamp",
  "GameGizmo",
  "ByteBrawler",
  "TechTrailblazer",
  "CodeCaptain",
  "PixelPathfinder",
  "LogicLionheart",
  "ElectronExpedition",
  "NanoNoble",
  "CircuitCommander",
  "GameGlobetrotter",
  "CyberSherpa",
  "CyberCraftsman",
  "CodeConnoisseur"
];
const TWENTY_FOUR_HOURS_IN_MS = 24 * 60 * 60 * 1e3;
const SIX_HUNDRED_DAYS_IN_MS = 600 * TWENTY_FOUR_HOURS_IN_MS;
const CATEGORY_NAMES = getAllCategoryNames().filter(
  (c) => !getAdminOnlyCategoryNames().includes(c)
);
const ICON_COUNT = 16;
const ICON_FILENAMES = Array.from(
  { length: ICON_COUNT },
  (_, i) => `icon${i}.png`
);
const BADGE_IDS = Array(50).fill(0).map((_, i) => "badgeid" + i);
const stringToSemiRandomNumber = async (inputString) => {
  const ec = new TextEncoder();
  const msgUint8 = ec.encode(inputString);
  const digest = await crypto.subtle.digest("SHA-1", msgUint8);
  const hashArray = Array.from(new Uint8Array(digest));
  return hashArray.slice(-10).reduce((prev, curr, index) => prev + curr * 8 ** index, 0);
};
const getSemiRandomDates = async (stringToDigest) => {
  const semiRandomNumber = await stringToSemiRandomNumber(stringToDigest);
  const createMillisBack = semiRandomNumber % SIX_HUNDRED_DAYS_IN_MS;
  const created_at = date(createMillisBack);
  const updated_at = date(
    createMillisBack - Math.min(
      0,
      createMillisBack - semiRandomNumber % (1234 * TWENTY_FOUR_HOURS_IN_MS)
    )
  );
  return { created_at, updated_at };
};
const get1DayAfterSemiRandomUpdatedAt = async (projectSlug) => {
  return new Date(
    Date.parse((await getSemiRandomDates(projectSlug)).updated_at) + TWENTY_FOUR_HOURS_IN_MS
  ).toISOString();
};
function date(millisBackFrom2025) {
  const JAN_FIRST_2025_BRUSSELS = 1735686e6;
  const MAX_DATE_MILLIS = JAN_FIRST_2025_BRUSSELS;
  return new Date(MAX_DATE_MILLIS - millisBackFrom2025).toISOString();
}
function getSemiRandomElementSelection(semiRandomNumber, items, max_items) {
  const nbItems = Math.max(semiRandomNumber % max_items, 1);
  const selection = /* @__PURE__ */ new Set();
  for (let i = 0; i < nbItems; i++) {
    selection.add(items[(i + semiRandomNumber) % items.length]);
  }
  return [...selection];
}
async function createSemiRandomAppdata(projectName, semanticVersion, loadIcon) {
  const semiRandomNumber = await stringToSemiRandomNumber(projectName);
  const projectSlug = projectName.toLowerCase();
  const description = await getDescription(projectName);
  const userId = semiRandomNumber % USERS.length;
  const { created_at, updated_at } = await getSemiRandomDates(projectName);
  let iconBytes = void 0;
  const iconIndex = semiRandomNumber % (ICON_COUNT + 4);
  const iconFilename = ICON_FILENAMES[iconIndex];
  const iconRelativePath = iconFilename;
  if (iconFilename) {
    iconBytes = await loadIcon(iconFilename);
  }
  const categories = getSemiRandomElementSelection(
    semiRandomNumber,
    CATEGORY_NAMES,
    3
  );
  const allBadges = getBadgeSlugs();
  const badges = getSemiRandomElementSelection(
    semiRandomNumber,
    allBadges,
    allBadges.length
  );
  const appMetadata = {
    name: projectName,
    description,
    author: USERS[userId],
    license_type: "MIT",
    badges,
    categories,
    icon_map: iconRelativePath ? { "64x64": iconRelativePath } : void 0
  };
  if (semiRandomNumber % 2 === 0) {
    appMetadata.git_url = "https://github.com/badgehubcrew/badgehub-app";
  } else if (semiRandomNumber % 3 === 0) {
    appMetadata.git_url = "https://gitlab.com/team-badge/badgevms-badgehub";
  }
  if (semiRandomNumber % 2 === 0) {
    appMetadata.hidden = false;
  }
  if (semiRandomNumber % 9 === 0) {
    appMetadata.hidden = true;
  }
  return {
    projectSlug,
    created_at,
    updated_at,
    iconBytes,
    iconRelativePath,
    appMetadata
  };
}
async function getDescription(appName) {
  switch (await stringToSemiRandomNumber(appName) % 4) {
    case 0:
      return `Use ${appName} for some cool graphical effects.`;
    case 1:
      return `With ${appName}, you can do interesting things with the sensors.`;
    case 2:
      return `Make some magic happen with ${appName}.`;
    case 3:
      return `${appName} is just some silly test app.`;
  }
}
async function sha256Hex(data) {
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
async function writeFile(db, slug, pathParts, content, mimetype) {
  const sha256 = await sha256Hex(content);
  await db.writeDraftFileMetadata(
    slug,
    pathParts,
    { mimetype, fileContent: content, size: content.length },
    sha256
  );
  await db.writeFileContent(sha256, content);
}
async function populatePreviewDb(metadata, loadIcon) {
  console.log(`[populatePreviewDb] Inserting ${PROJECT_NAMES.length} projects…`);
  for (const projectName of PROJECT_NAMES) {
    const semiRandomNumber = await stringToSemiRandomNumber(projectName);
    const slug = projectName.toLowerCase();
    const userName = USERS[semiRandomNumber % USERS.length];
    const { created_at, updated_at } = await getSemiRandomDates(projectName);
    await metadata.insertProject(
      { slug, idp_user_id: userName },
      { created_at, updated_at }
    );
    const { appMetadata, iconBytes, iconRelativePath } = await createSemiRandomAppdata(projectName, "", loadIcon);
    await metadata.updateDraftMetadata(slug, appMetadata);
    if (iconBytes && iconRelativePath) {
      const sha256 = await sha256Hex(iconBytes);
      const pathParts = iconRelativePath.split("/");
      await metadata.writeDraftFileMetadata(
        slug,
        pathParts,
        { mimetype: "image/png", fileContent: iconBytes, size: iconBytes.length },
        sha256
      );
      await metadata.writeFileContent(sha256, iconBytes);
    }
    const metadataJson = new TextEncoder().encode(
      JSON.stringify(appMetadata, null, 2)
    );
    await writeFile(metadata, slug, ["metadata.json"], metadataJson, "application/json");
    const pythonLines = [
      `# ${projectName} badge app`,
      `import display`,
      ``,
      `def main():`,
      `    display.print("${projectName}")`,
      ``,
      `main()`
    ];
    const pythonSrc = new TextEncoder().encode(pythonLines.join("\n") + "\n");
    await writeFile(metadata, slug, ["__init__.py"], pythonSrc, "text/x-python");
  }
  console.log("[populatePreviewDb] Publishing half the projects…");
  const halfNames = PROJECT_NAMES.slice(0, PROJECT_NAMES.length >> 1);
  for (const projectName of halfNames) {
    const publishDate = await get1DayAfterSemiRandomUpdatedAt(projectName);
    await metadata.publishVersion(projectName.toLowerCase(), publishDate);
  }
  console.log("[populatePreviewDb] Reporting installs…");
  const publishedSlugs = halfNames.map((n) => n.toLowerCase());
  const nbDownloads = 500;
  for (let i = 0; i < nbDownloads; i++) {
    const semiRandomIndex = await stringToSemiRandomNumber("download" + i);
    await metadata.reportEvent(
      publishedSlugs[semiRandomIndex % publishedSlugs.length],
      1,
      BADGE_IDS[i % BADGE_IDS.length >> 2] + "-v1",
      "install_count"
    );
  }
  console.log("[populatePreviewDb] Done.");
}
const API_PREFIX = "/api/v3";
const PREVIEW_DATA_VERSION = 4;
const IDB_NAME = "badgehub-preview";
const IDB_STORE = "sqlite-cache";
const IDB_KEY = "preview-data";
function openIdb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_NAME, 1);
    req.onupgradeneeded = () => {
      req.result.createObjectStore(IDB_STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
async function loadFromIdb() {
  try {
    const db = await openIdb();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, "readonly");
      const req = tx.objectStore(IDB_STORE).get(IDB_KEY);
      req.onsuccess = () => {
        const cached = req.result;
        resolve((cached == null ? void 0 : cached.version) === PREVIEW_DATA_VERSION ? cached.data : null);
      };
      req.onerror = () => reject(req.error);
      tx.oncomplete = () => db.close();
    });
  } catch (e) {
    console.warn("[api-sw] Could not read from IndexedDB", e);
    return null;
  }
}
async function saveToIdb(data) {
  try {
    const db = await openIdb();
    await new Promise((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, "readwrite");
      tx.objectStore(IDB_STORE).put({ version: PREVIEW_DATA_VERSION, data }, IDB_KEY);
      tx.oncomplete = () => {
        db.close();
        resolve();
      };
      tx.onerror = () => reject(tx.error);
    });
  } catch (e) {
    console.warn("[api-sw] Could not save to IndexedDB", e);
  }
}
let honoApp = null;
let appPromise = null;
function fileUrl(slug, revision, filePath) {
  const revSegment = typeof revision === "number" ? `rev${revision}` : revision;
  return `/api/v3/projects/${encodeURIComponent(slug)}/${revSegment}/files/${filePath}`;
}
async function loadIconFromNetwork(filename) {
  try {
    const resp = await fetch(new URL(`dev-icons/${filename}`, self.location.href));
    if (!resp.ok) return void 0;
    return new Uint8Array(await resp.arrayBuffer());
  } catch {
    return void 0;
  }
}
function loadApp() {
  if (honoApp) return Promise.resolve(honoApp);
  if (!appPromise) {
    appPromise = Promise.all([
      initSqlJs({ locateFile: (file) => new URL(file, self.location.href).href }),
      loadFromIdb()
    ]).then(async ([SQL, cached]) => {
      let bytes;
      if (cached) {
        bytes = cached;
      } else {
        console.log("[api-sw] Generating preview database from fixture data…");
        const db2 = new SQL.Database();
        db2.run(BADGEHUB_SCHEMA_SQL);
        const adapter2 = new SqlJsAdapter(db2);
        const metadata2 = new SQLiteBadgeHubMetadata(adapter2, fileUrl);
        await populatePreviewDb(metadata2, loadIconFromNetwork);
        bytes = db2.export();
        saveToIdb(bytes);
      }
      const db = new SQL.Database(bytes);
      const adapter = new SqlJsAdapter(db);
      const metadata = new SQLiteBadgeHubMetadata(adapter, fileUrl);
      const backend = new PreviewBadgeHubData(metadata);
      honoApp = createPublicApiRouter(backend);
      appPromise = null;
      return honoApp;
    }).catch((e) => {
      appPromise = null;
      throw e;
    });
  }
  return appPromise;
}
self.addEventListener("install", (event) => {
  event.waitUntil(
    loadApp().catch(
      (e) => console.warn("[api-sw] Could not generate preview database", e)
    ).then(() => self.skipWaiting())
  );
});
self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  const apiIndex = url.pathname.indexOf(API_PREFIX + "/");
  if (apiIndex === -1) return;
  if (event.request.method !== "GET") return;
  const apiPath = url.pathname.slice(apiIndex);
  const normalizedUrl = new URL(apiPath + url.search, "https://localhost");
  const normalizedRequest = new Request(normalizedUrl.toString(), event.request);
  event.respondWith(
    loadApp().then((app) => app.fetch(normalizedRequest)).catch((e) => {
      console.error("[api-sw] error", e);
      return new Response(
        JSON.stringify({ reason: "Preview data could not be loaded" }),
        { status: 503, headers: { "Content-Type": "application/json" } }
      );
    })
  );
});
