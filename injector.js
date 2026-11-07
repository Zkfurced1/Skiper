/**
 * Skiper — injector.js v2.1
 * world: MAIN — работает в контексте страницы, без <script> тегов, без CSP ошибок.
 *
 * ИСПРАВЛЕНО:
 *  - const → var (document_start может выполниться до ES6-среды на редких страницах)
 *  - Защита от повторного запуска (window.__skiperInjected)
 *  - try/catch вокруг патча performance.now (read-only в некоторых браузерах)
 *  - Не трогаем таймеры с delay === 0 или undefined (могут быть requestAnimationFrame-заменители)
 */

(function () {
  if (window.__skiperInjected) return;
  window.__skiperInjected = true;

  var SPEEDUP   = 100;
  var MAX_DELAY = 5000; // ускоряем только таймеры < 5 сек

  // ── setInterval ─────────────────────────────────────────────────────────────
  var _si = window.setInterval;
  window.setInterval = function (fn, delay) {
    var args = Array.prototype.slice.call(arguments, 2);
    var d = (typeof delay === 'number' && delay > 0 && delay < MAX_DELAY)
      ? Math.max(1, Math.round(delay / SPEEDUP))
      : delay;
    return _si.apply(window, [fn, d].concat(args));
  };

  // ── setTimeout ──────────────────────────────────────────────────────────────
  var _st = window.setTimeout;
  window.setTimeout = function (fn, delay) {
    var args = Array.prototype.slice.call(arguments, 2);
    var d = (typeof delay === 'number' && delay > 0 && delay < MAX_DELAY)
      ? Math.max(1, Math.round(delay / SPEEDUP))
      : delay;
    return _st.apply(window, [fn, d].concat(args));
  };

  // ── Date.now ────────────────────────────────────────────────────────────────
  try {
    var _origNow = Date.now.bind(Date);
    var _t0real  = _origNow();
    Date.now = function () {
      return _t0real + (_origNow() - _t0real) * SPEEDUP;
    };
  } catch (_) {}

  // ── performance.now ─────────────────────────────────────────────────────────
  try {
    if (window.performance && typeof performance.now === 'function') {
      var _pn  = performance.now.bind(performance);
      var _p0r = _pn();
      performance.now = function () {
        return _p0r + (_pn() - _p0r) * SPEEDUP;
      };
    }
  } catch (_) {}

})();
