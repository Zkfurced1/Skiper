/**
 * Skiper — content.js v3.2
 * world: ISOLATED — изолированный контекст, доступен chrome.runtime.
 *
 * ИСПРАВЛЕНО:
 *  - MutationObserver: obs.observe() перенесён в отдельную проверку
 *    (document.body может быть null на document_idle, но страхуемся)
 *  - skipDataAttrTimers: добавлен guard чтобы не обнулять data-атрибуты повторно
 *  - unlockHiddenButtons: убран лишний skippedCount++ (дублировал счёт)
 *  - forceZeroCountdownText: parseInt без replace(':','') — некорректно парсил "1:30"
 *    исправлено: отдельно считаем минуты+секунды
 *  - chrome.runtime.onMessage: добавлен return true только когда нужен async ответ
 *  - start(): MutationObserver теперь безопасно стартует только когда body готов
 *  - Все querySelector обёрнуты в try/catch (невалидный CSS-селектор не роняет всё)
 */

(function () {
  'use strict';

  var skippedCount  = 0;
  var enabled       = true;
  // Храним уже обработанные data-атрибуты, чтобы не считать повторно
  var processedEls  = new WeakSet();

  // ════════════════════════════════════════════════════════════════════════════
  //  СТРАТЕГИИ
  // ════════════════════════════════════════════════════════════════════════════

  /**
   * S1. freetp.org и аналоги:
   *   #dlink (hidden input) + a.dl-button (display:none)
   *   → присваиваем href и показываем кнопку
   */
  function skipHiddenLinkPattern() {
    var linkSels = [
      '#dlink', '#download-link', '#file-link', '#filelink',
      'input[name="dlink"]', 'input[name="link"]', 'input[name="file_link"]',
      'input[type="hidden"][name*="link"]',
      'input[type="hidden"][name*="url"]',
      'input[type="hidden"][name*="file"]',
      'input[type="hidden"][id*="link"]',
      'input[type="hidden"][id*="url"]',
      'input[type="hidden"][id*="file"]',
    ].join(',');

    var btnSels = [
      'a.dl-button', 'a.download-button', 'a.btn-download', 'a.download-btn',
      'a[class*="dl-button"]', 'a[class*="download-btn"]',
      'a[id*="download"]', '#download-btn',
      'a[class*="getfile"]', 'a[class*="get-file"]',
      '.download-link > a',
    ].join(',');

    var cntSels = [
      '.dl-counter', '[class*="dl-counter"]',
      '[class*="download-counter"]', '[class*="count-down"]',
      '[data-counter]', '[data-countdown]',
    ].join(',');

    try {
      var input  = document.querySelector(linkSels);
      var button = document.querySelector(btnSels);
      if (!input || !button) return false;

      var link = (input.value || '').trim();
      if (!link || link === '#' || !/^https?:\/\//.test(link)) return false;

      // Уже обработали эту кнопку?
      if (processedEls.has(button)) return false;
      processedEls.add(button);

      button.href = link;
      button.style.cssText += ';display:inline-flex!important;visibility:visible!important;'
        + 'opacity:1!important;pointer-events:auto!important;';
      button.removeAttribute('disabled');
      button.classList.remove('disabled', 'btn-disabled', 'locked');

      document.querySelectorAll(cntSels).forEach(function (el) {
        el.style.display = 'none';
      });

      skippedCount++;
      return true;
    } catch (_) { return false; }
  }

  /**
   * S2. data-counter / data-countdown / data-seconds / data-timer / data-delay
   */
  function skipDataAttrTimers() {
    var attrs = [
      'data-counter', 'data-countdown', 'data-seconds',
      'data-timer', 'data-time', 'data-delay',
    ];
    var found = false;
    attrs.forEach(function (attr) {
      try {
        document.querySelectorAll('[' + attr + ']').forEach(function (el) {
          if (processedEls.has(el)) return;
          var val = parseInt(el.getAttribute(attr), 10);
          if (!isNaN(val) && val > 0 && val <= 3600) {
            processedEls.add(el);
            el.setAttribute(attr, '0');
            ['change', 'input', 'timeend', 'countend', 'timerend', 'finish', 'done'].forEach(function (ev) {
              el.dispatchEvent(new Event(ev, { bubbles: true }));
            });
            found = true;
          }
        });
      } catch (_) {}
    });
    return found;
  }

  /**
   * S3. Скрытые / disabled кнопки и ссылки скачивания
   */
  function unlockHiddenButtons() {
    var DL_RE = /скачать|download|получить|перейти|continue|proceed|get\s*file|get\s*link|save|сохранить/i;
    var found = false;

    try {
      var sel = [
        'a[style]', 'button[style]',
        'button[disabled]', 'a[disabled]',
        'a.disabled', 'button.disabled',
        '[style*="display:none"]', '[style*="display: none"]',
        '[style*="visibility:hidden"]', '[style*="visibility: hidden"]',
      ].join(',');

      document.querySelectorAll(sel).forEach(function (el) {
        if (processedEls.has(el)) return;

        var style    = el.getAttribute('style') || '';
        var isHidden = /display\s*:\s*none/i.test(style)
                    || /visibility\s*:\s*hidden/i.test(style)
                    || el.disabled
                    || el.classList.contains('disabled');
        if (!isHidden) return;

        var text = (
          el.textContent ||
          el.value ||
          el.getAttribute('aria-label') ||
          el.getAttribute('title') || ''
        ).toLowerCase();
        var href = el.getAttribute('href') || '';

        if (DL_RE.test(text) || (href && href !== '#' && /^https?:\/\//.test(href))) {
          processedEls.add(el);
          el.style.cssText += ';display:inline-block!important;visibility:visible!important;';
          el.removeAttribute('disabled');
          el.classList.remove('disabled', 'locked', 'hidden');
          found = true;
          // НЕ увеличиваем skippedCount здесь — считаем только реальные скипы таймера
        }
      });
    } catch (_) {}

    return found;
  }

  /**
   * S4. Текстовый счётчик — сбрасываем в «0»
   */
  function forceZeroCountdownText() {
    var sels = [
      '.dl-counter b', '.countdown b', '.timer b', '.count b',
      '[class*="timer"] b', '[class*="countdown"] b',
      '[class*="timer"] span', '[class*="countdown"] span',
      '.timer-value', '.countdown-value', '.seconds',
    ].join(',');

    var found = false;
    try {
      document.querySelectorAll(sels).forEach(function (el) {
        if (processedEls.has(el)) return;
        var txt = (el.textContent || '').trim();

        var secs = 0;
        var mmss = txt.match(/^(\d{1,2}):(\d{2})$/);
        var plain = txt.match(/^(\d{1,3})$/);

        if (mmss)  secs = parseInt(mmss[1], 10) * 60 + parseInt(mmss[2], 10);
        if (plain) secs = parseInt(plain[1], 10);

        if (secs > 0) {
          processedEls.add(el);
          el.textContent = '0';
          el.dispatchEvent(new Event('change', { bubbles: true }));
          found = true;
        }
      });
    } catch (_) {}
    return found;
  }

  /**
   * S5. Кнопки «Skip Ad» / «Пропустить рекламу»
   */
  function clickSkipAdButtons() {
    var SKIP_RE = /^(skip(\s*ad)?|пропустить(\s*рекламу)?|перейти\s*к\s*сайту)$/i;

    try {
      // YouTube-специфичные
      var yt = document.querySelector(
        '.ytp-skip-ad-button, .ytp-ad-skip-button'
      );
      if (yt && yt.offsetParent) { yt.click(); skippedCount++; return true; }

      // Общие
      var els = document.querySelectorAll(
        'button, a[role="button"], [role="button"], input[type="button"]'
      );
      for (var i = 0; i < els.length; i++) {
        var el = els[i];
        if (!el.offsetParent) continue;
        var text = (
          el.textContent ||
          el.value ||
          el.getAttribute('aria-label') || ''
        ).trim();
        if (SKIP_RE.test(text)) {
          el.click();
          skippedCount++;
          return true;
        }
      }
    } catch (_) {}
    return false;
  }

  /**
   * S6. HTML5 Video — перематываем короткие рекламные ролики
   */
  function skipVideoAds() {
    try {
      document.querySelectorAll('video').forEach(function (video) {
        if (
          video.duration > 0 &&
          video.duration <= 120 &&
          !video.paused &&
          !video.ended
        ) {
          try { video.currentTime = video.duration - 0.1; } catch (_) {}
        }
      });
    } catch (_) {}
  }

  // ════════════════════════════════════════════════════════════════════════════
  //  ГЛАВНЫЙ ЦИКЛ
  // ════════════════════════════════════════════════════════════════════════════

  function runAll() {
    if (!enabled) return;
    skipHiddenLinkPattern();
    skipDataAttrTimers();
    unlockHiddenButtons();
    forceZeroCountdownText();
    clickSkipAdButtons();
    skipVideoAds();
  }

  function start() {
    runAll();
    // Повторные запуски — JS сайта может грузиться асинхронно
    setTimeout(runAll, 300);
    setTimeout(runAll, 800);
    setTimeout(runAll, 1500);
    setTimeout(runAll, 3000);

    // MutationObserver
    var body = document.body || document.documentElement;
    if (!body) return;

    var debounceTimer = null;
    var obs = new MutationObserver(function () {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(runAll, 150);
    });

    obs.observe(body, {
      childList: true,
      subtree: true,
      attributeFilter: ['style', 'disabled', 'class', 'data-counter', 'data-countdown'],
    });

    // Фоновый скан
    setInterval(runAll, 1000);
  }

  // ── Запуск ──────────────────────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }

  // ── Popup messages ───────────────────────────────────────────────────────────
  chrome.runtime.onMessage.addListener(function (msg, _sender, sendResponse) {
    try {
      if (msg.type === 'GET_STATUS') {
        sendResponse({ enabled: enabled, skipped: skippedCount });
        return false; // синхронный ответ
      }
      if (msg.type === 'SET_ENABLED') {
        enabled = !!msg.value;
        sendResponse({ ok: true });
        return false;
      }
      if (msg.type === 'MANUAL_SKIP') {
        runAll();
        sendResponse({ ok: true, skipped: skippedCount });
        return false;
      }
    } catch (e) {
      sendResponse({ ok: false, error: e.message });
      return false;
    }
  });

})();
